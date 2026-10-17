import { z } from "zod";
import { db } from "@/lib/db";
import { upsertLead, normalizePhone } from "@/lib/leads";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import ZAI from "z-ai-web-dev-sdk";
import {
  buildSystemPrompt,
  languageReminder,
  parseActions,
  type ModelAction,
} from "@/lib/chatbot/prompt";
import {
  isOpenRouterConfigured,
  streamOpenRouterChain,
  type ChatMessage,
} from "@/lib/chatbot/openrouter";
import { isValidSitePath } from "@/lib/chatbot/site-routes";
import {
  bookDemoSchema,
  bookDemoSlot,
  ensureUpcomingSlots,
  listUpcomingSlots,
  DEMO_CHAT_SLOTS_LIMIT,
} from "@/lib/demo";
import { SAAS_SLUGS } from "@/lib/catalog";

const historySchema = z.array(
  z.object({
    role: z.enum(["user", "assistant"]),
    content: z.string().max(4000),
  })
);

const schema = z.object({
  sessionId: z.string().uuid().nullable().optional(),
  message: z.string().trim().min(1).max(1000),
  /** page actuellement vue par le visiteur (contrôle total du site) —
   *  300 car. : pathname + query longs acceptés (audit F-13). */
  currentPath: z.string().max(300).default("/"),
  locale: z.string().max(5).default("fr"),
  /** Ephemeral mode: client-provided recent history, nothing persisted. */
  history: historySchema.max(12).optional(),
  /** Le message provient de la reconnaissance vocale → tolérance phonétique. */
  voice: z.boolean().optional().default(false),
});

export const maxDuration = 60;

interface SseEvent {
  type: "token" | "action" | "done" | "error";
  v?: string;
  tool?: string;
  args?: Record<string, unknown>;
  messageId?: number;
}

export async function POST(req: Request): Promise<Response> {
  const ip = clientIp(req);
  if (!rateLimit(`chat:${ip}`, 20).allowed) {
    return sse([{ type: "error", v: "rate" }]);
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return sse([{ type: "error", v: "bad_request" }]);
  }
  const parsed = schema.safeParse(body);
  if (!parsed.success) return sse([{ type: "error", v: "bad_request" }]);
  const d = parsed.data;

  // Load history (contenus tronqués : la latence dépend de la taille du prompt)
  let history: { role: "user" | "assistant"; content: string }[] = [];
  let persisted = false;
  if (d.sessionId) {
    try {
      const rows = await db.chatMessage.findMany({
        where: { sessionId: d.sessionId, role: { in: ["user", "assistant"] } },
        orderBy: { id: "desc" },
        take: 12,
      });
      history = rows
        .reverse()
        .map((r) => ({
          role: r.role as "user" | "assistant",
          content: (r.content ?? "").slice(0, 600),
        }));
      persisted = true;
    } catch (e) {
      console.error("[chat/message] history", e);
    }
  } else if (d.history) {
    history = d.history.map((h) => ({ ...h, content: h.content.slice(0, 600) }));
  }

  /* Persistance du message utilisateur : NON BLOQUANTE (latence) —
     elle part en parallèle de l'appel LLM ; la sauvegarde de secours
     en fin de flux ne doublonne que si celle-ci a échoué. */
  let savedUser = false;
  const saveUserPromise: Promise<void> =
    persisted && d.sessionId
      ? db.chatMessage
          .create({
            data: { sessionId: d.sessionId, role: "user", content: d.message },
          })
          .then(() => {
            savedUser = true;
          })
          .catch((e: unknown) => {
            console.error("[chat/message] save user", e);
          })
      : Promise.resolve();
  void saveUserPromise;

  /* Flag véridicité §20.4 : le podcast n'est vendu par le chatbot que
     s'il existe des épisodes publiés (audit F-16). */
  const publishedPodcasts = await db.podcast
    .count({ where: { isPublished: true } })
    .catch(() => 0);

  const system = buildSystemPrompt(d.locale, d.currentPath, d.message, { publishedPodcasts });
  const llmMessages: ChatMessage[] = [
    { role: "system", content: system },
    ...history.slice(-12),
    /* Rappel de langue juste avant la question — quand l'historique
       contient d'anciennes réponses dans une autre langue, la directive
       du prompt système seul est trop loin pour peser sur le modèle. */
    { role: "system", content: languageReminder(d.locale) },
    /* Message issu de la voix : la transcription automatique est souvent
       phonétiquement déformée — le modèle doit interpréter l'INTENTION
       (ex. « mantras muy vas tarifs » = « montrez-moi vos tarifs »)
       au lieu de répondre qu'il n'a pas compris. */
    ...(d.voice
      ? [
          {
            role: "system" as const,
            content:
              "MESSAGE VOCAL : la question de l'utilisateur provient d'une RECONNAISSANCE VOCALE AUTOMATIQUE, souvent approximative (mots déformés phonétiquement, noms altérés, accents incorrects). Interprète TOUJOURS l'intention la plus probable en t'appuyant sur le contexte du site et l'historique, répond directement au fond, et ne demande de reformuler QUE si aucun sens plausible n'émerge. Exemples : « mantras muy vas tarifs » ou « voss tariffs » = « montrez-moi vos tarifs » ; « logisiel farmassi » = « logiciel pharmacie ».",
          },
        ]
      : []),
    { role: "user", content: d.message },
  ];

  /* ── Moteur principal : OpenRouter en streaming réel (clé client).
        Les tokens partent vers le navigateur au fil de l'eau — aucune
        réponse pré-écrite. Repli transparent : z-ai STREAMÉ réellement
        (premier token ~1 s au lieu de la complétion complète). ── */
  if (isOpenRouterConfigured()) {
    return streamResponse(
      streamOpenRouterChain(llmMessages, { temperature: 0.6, maxTokens: 700 }),
      {
        ip,
        persisted,
        sessionId: d.sessionId,
        get savedUser() {
          return savedUser;
        },
        saveUserPromise,
        userMessage: d.message,
      },
      () => streamZaiWithWatchdog(llmMessages),
      d.locale
    );
  }

  // ── Repli direct : z-ai EN STREAMING RÉEL (même mécanique SSE, §27) ──
  return streamResponse(
    streamZaiWithWatchdog(llmMessages),
    {
      ip,
      persisted,
      sessionId: d.sessionId,
      get savedUser() {
        return savedUser;
      },
      saveUserPromise,
      userMessage: d.message,
    },
    () => streamZaiWithWatchdog(llmMessages),
    d.locale
  );
}

/* ── Réponse en flux réel (OpenRouter) ───────────────────────────
   Chaque delta du modèle est relayé immédiatement au navigateur.
   À la fin : parsing des actions [[action:…]], exécution serveur
   (créneaux, leads, démos) puis émission des événements action/done.
   Si OpenRouter échoue SANS avoir émis un seul token → repli
   transparent sur z-ai dans le même flux. */
async function runServerActions(
  actions: ModelAction[],
  ip: string,
  locale: string
): Promise<ModelAction[]> {
  for (const a of actions) {
    if (a.tool === "create_lead") {
      const created = await handleCreateLead(a, ip);
      if (created) a.args = { ...a.args, _created: true };
    } else if (a.tool === "suggest_slots") {
      // Auto-entretien de la grille avant proposition (audit F-02)
      await ensureUpcomingSlots().catch(() => {});
      const slots = await listUpcomingSlots(DEMO_CHAT_SLOTS_LIMIT).catch(() => []);
      if (slots.length > 0) a.args = { slots };
      else a.args = { _drop: true };
    } else if (a.tool === "book_demo") {
      await handleBookDemo(a, ip, locale);
    }
  }
  return actions;
}

function streamResponse(
  iterator: AsyncGenerator<string>,
  ctx: {
    ip: string;
    persisted: boolean;
    sessionId?: string | null;
    savedUser: boolean | (() => boolean);
    saveUserPromise?: Promise<void>;
    userMessage: string;
  },
  zaiFallback: () => AsyncGenerator<string>,
  locale: string
): Response {
  const encoder = new TextEncoder();
  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const send = (ev: SseEvent) =>
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(ev)}\n\n`));
      const savedUserNow = () => (typeof ctx.savedUser === "function" ? ctx.savedUser() : ctx.savedUser);

      /* Émetteur « sûr » : ne fait JAMAIS partir vers le navigateur les
         marqueurs d'action ([[action:…], {"tool":… y compris avec espaces,
         ou l'outil nu « navigate {…} ») — les deltas du modèle peuvent les
         couper en deux (« …[[ac » + « tion:… »). On retient les 24 derniers
         caractères tant que le flux n'est pas terminé, puis on rince.
         Audit F-08 : la garde tolère désormais les espaces comme le
         parseur final (parseActions), sinon des fragments fuient à l'écran
         puis disparaissent du message stocké. */
      const HOLD = 24;
      const ACTION_MARK = /\[\[action|\{\s*"tool"|\bnavigate\s*\{/i;
      const makeSafeSender = () => {
        let buf = "";
        let sentLen = 0;
        const safeCut = (final: boolean) => {
          let cut = buf.length;
          const m = ACTION_MARK.exec(buf);
          if (m && m.index < cut) cut = m.index;
          if (!final) cut = Math.min(cut, Math.max(0, buf.length - HOLD));
          return cut;
        };
        return {
          push(delta: string) {
            buf += delta;
            const cut = safeCut(false);
            if (cut > sentLen) {
              send({ type: "token", v: buf.slice(sentLen, cut) });
              sentLen = cut;
            }
          },
          flush() {
            const cut = safeCut(true);
            if (cut > sentLen) {
              send({ type: "token", v: buf.slice(sentLen, cut) });
              sentLen = cut;
            }
          },
          text: () => buf,
          visible: () => sentLen > 0,
        };
      };

      /* Fin de flux partagée : actions serveur + persistance + done. */
      const finish = async (full: string, senderVisible: boolean): Promise<void> => {
        const { clean, actions } = parseActions(full);
        const validActions = await runServerActions(filterActions(actions), ctx.ip, locale);

        let messageId: number | undefined;
        if (ctx.persisted && ctx.sessionId) {
          try {
            const saved = await db.chatMessage.create({
              data: { sessionId: ctx.sessionId, role: "assistant", content: clean || full.trim() },
            });
            messageId = saved.id;
            if (!savedUserNow()) {
              await db.chatMessage.create({
                data: { sessionId: ctx.sessionId, role: "user", content: ctx.userMessage },
              });
            }
          } catch (e) {
            console.error("[chat/message] save assistant", e);
          }
        }

        for (const a of validActions) {
          if (a.args?._drop === true) continue;
          send({ type: "action", tool: a.tool, args: a.args });
        }
        send({ type: "done", messageId });
      };

      let got = false;
      const sender = makeSafeSender();
      try {
        for await (const delta of iterator) {
          if (!delta) continue;
          got = true;
          sender.push(delta);
        }
        sender.flush();
        /* Ni texte visible, ni marqueur exploitable → repli. */
        if (!got || !sender.text().trim() || !sender.visible()) throw new Error("empty_stream");
      } catch (e) {
        console.error("[chat/message] primary stream", e);
        if (!sender.visible()) {
          /* aucun token VISIBLE envoyé → repli z-ai STREAMÉ, même flux */
          try {
            await ctx.saveUserPromise;
            const fb = makeSafeSender();
            for await (const delta of zaiFallback()) {
              if (!delta) continue;
              fb.push(delta);
            }
            fb.flush();
            if (!fb.text().trim() || !fb.visible()) throw new Error("empty_fallback");
            await finish(fb.text(), fb.visible());
            controller.close();
          } catch (err) {
            console.error("[chat/message] zai fallback", err);
            send({ type: "error", v: "llm" });
            controller.close();
          }
          return;
        }
        /* coupure en cours de flux : on clôt proprement avec ce qui existe */
      }

      await finish(sender.text(), sender.visible());
      controller.close();
    },
  });
  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}

/* ── Streaming z-ai réel ──────────────────────────────────────────
   Le SDK accepte stream:true et renvoie un ReadableStream de SSE
   (chat.completion.chunk) : premier token ~0,5-1 s au lieu de la
   complétion complète (3-12 s) — c'est ce qui rend le repli réactif. */
async function* streamZaiDeltas(messages: ChatMessage[]): AsyncGenerator<string> {
  const zai = await ZAI.create();
  const res = (await zai.chat.completions.create({
    messages,
    stream: true,
    thinking: { type: "disabled" },
  })) as unknown as ReadableStream<Uint8Array>;
  const reader = res.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() ?? "";
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed.startsWith("data:")) continue;
      const payload = trimmed.slice(5).trim();
      if (!payload || payload === "[DONE]") continue;
      try {
        const json = JSON.parse(payload) as { choices?: { delta?: { content?: string } }[] };
        const delta = json.choices?.[0]?.delta?.content;
        if (delta) yield delta;
      } catch {
        /* chunk incomplet — ignoré */
      }
    }
  }
}

/** Streaming z-ai avec watchdog « premier token » (12 s). */
async function* streamZaiWithWatchdog(messages: ChatMessage[]): AsyncGenerator<string> {
  const it = streamZaiDeltas(messages)[Symbol.asyncIterator]();
  const first = await Promise.race([
    it.next(),
    new Promise<"timeout">((resolve) => setTimeout(() => resolve("timeout"), 12_000)),
  ]);
  if (first === "timeout") {
    try {
      await it.return?.(undefined as never);
    } catch {
      /* ignore */
    }
    throw new Error("zai_first_token_timeout");
  }
  if (!first.done && first.value) yield first.value;
  while (true) {
    const { done, value } = await it.next();
    if (done) break;
    if (value) yield value;
  }
}

const CHAT_LOCALES = ["fr", "en", "es", "zh", "de"] as const;
const THEMES = ["dark", "light"] as const;
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function filterActions(actions: ModelAction[]): ModelAction[] {
  const out: ModelAction[] = [];
  for (const a of actions.slice(0, 1)) {
    // max one action per reply
    if (a.tool === "navigate") {
      /* Contrôle total du site : le chemin doit exister dans la carte
         du site (pages statiques + pages de pôles + pages logiciels). */
      const path = String(a.args?.path ?? "").split("?")[0].split("#")[0];
      if (!path || !isValidSitePath(path)) continue;
      a.args = { path };
    }
    /* Audit F-19 : "demo" est géré par ContactSection (sujet « Démo ») —
       le filtre l'excluait à tort alors que le type client l'autorise. */
    if (a.tool === "open_form" && !["trial", "quote", "contact", "demo"].includes(String(a.args?.type ?? ""))) continue;
    if (a.tool === "create_lead") {
      const fn = String(a.args?.first_name ?? "").trim();
      const ln = String(a.args?.last_name ?? "").trim();
      const ph = String(a.args?.phone ?? "").trim();
      if (fn.length < 2 || ln.length < 2 || ph.length < 6) continue;
    }
    if (a.tool === "book_demo") {
      const fn = String(a.args?.first_name ?? "").trim();
      const ln = String(a.args?.last_name ?? "").trim();
      const ph = String(a.args?.phone ?? "").trim();
      const slotId = String(a.args?.slot_id ?? "").trim();
      const saas = a.args?.saas_slug ? String(a.args.saas_slug).trim() : "";
      const email = a.args?.email ? String(a.args.email).trim() : "";
      const digits = (ph.match(/\d/g) ?? []).length;
      const emailOk = email === "" || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      if (
        fn.length < 1 ||
        ln.length < 1 ||
        !/^[\d\s+]{7,20}$/.test(ph) ||
        digits < 7 ||
        !UUID_RE.test(slotId) ||
        (saas !== "" && !SAAS_SLUGS.includes(saas)) ||
        !emailOk
      )
        continue;
    }
    if (a.tool === "switch_locale" && !CHAT_LOCALES.includes(String(a.args?.locale ?? "") as (typeof CHAT_LOCALES)[number])) continue;
    if (a.tool === "switch_theme" && !THEMES.includes(String(a.args?.theme ?? "") as (typeof THEMES)[number])) continue;
    out.push(a);
  }
  return out;
}

async function handleCreateLead(a: ModelAction, ip: string): Promise<boolean> {
  try {
    const args = a.args;
    const consent = args?.consent_contact === true || args?.consent === true;
    const { lead } = await upsertLead({
      firstName: String(args?.first_name ?? "").trim(),
      lastName: String(args?.last_name ?? "").trim(),
      phone: normalizePhone(String(args?.phone ?? "")),
      email: args?.email ? String(args.email) : null,
      source: "chat",
      interests: args?.interest ? [String(args.interest)] : [],
      consent,
      ip,
    });
    await db.leadEvent.create({
      data: { leadId: lead.id, type: "chat_lead", data: JSON.stringify({ via: "chatbot" }) },
    });
    return true;
  } catch (e) {
    console.error("[chat/message] create_lead", e);
    return false;
  }
}

async function handleBookDemo(a: ModelAction, ip: string, locale: string): Promise<void> {
  try {
    const args = a.args ?? {};
    const parsed = bookDemoSchema.safeParse({
      firstName: String(args.first_name ?? "").trim(),
      lastName: String(args.last_name ?? "").trim(),
      phone: String(args.phone ?? "").trim(),
      email: args.email ? String(args.email).trim() : "",
      saasSlug: args.saas_slug ? String(args.saas_slug).trim() : "",
      slotId: String(args.slot_id ?? "").trim(),
      locale: String(args.locale ?? locale ?? "fr").slice(0, 2) || "fr",
      consentContact: true,
    });
    if (!parsed.success) {
      a.args = { ok: false, reason: "invalid_slot" };
      return;
    }
    const result = await bookDemoSlot(parsed.data, ip);
    if (result.ok) {
      a.args = { ok: true, startsAt: result.startsAt };
    } else {
      a.args = { ok: false, reason: result.code };
    }
  } catch (e) {
    console.error("[chat/message] book_demo", e);
    a.args = { ok: false, reason: "error" };
  }
}

function sse(events: SseEvent[], delayMs = 0): Response {
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      for (const ev of events) {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(ev)}\n\n`));
        if (delayMs) await new Promise((r) => setTimeout(r, delayMs));
      }
      controller.close();
    },
  });
  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
