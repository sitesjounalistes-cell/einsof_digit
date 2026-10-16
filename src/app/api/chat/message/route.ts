import { z } from "zod";
import { db } from "@/lib/db";
import { upsertLead, normalizePhone } from "@/lib/leads";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import ZAI from "z-ai-web-dev-sdk";
import {
  buildSystemPrompt,
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
  /** page actuellement vue par le visiteur (contrôle total du site) */
  currentPath: z.string().max(160).default("/"),
  locale: z.string().max(5).default("fr"),
  /** Ephemeral mode: client-provided recent history, nothing persisted. */
  history: historySchema.max(12).optional(),
});

export const maxDuration = 60;

interface SseEvent {
  type: "token" | "action" | "done" | "error" | "lead";
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

  const system = buildSystemPrompt(d.locale, d.currentPath, d.message);
  const llmMessages: ChatMessage[] = [
    { role: "system", content: system },
    ...history.slice(-12),
    { role: "user", content: d.message },
  ];

  /* ── Moteur principal : OpenRouter en streaming réel (clé client).
        Les tokens partent vers le navigateur au fil de l'eau — aucune
        réponse pré-écrite. Repli transparent : z-ai (mot à mot). ── */
  if (isOpenRouterConfigured()) {
    const zaiFallback = async (): Promise<string> => {
      const zai = await ZAI.create();
      const withTimeout = Promise.race([
        zai.chat.completions.create({
          messages: llmMessages,
          thinking: { type: "disabled" },
        }),
        new Promise<null>((resolve) => setTimeout(() => resolve(null), 15_000)),
      ]);
      const completion = (await withTimeout) as Awaited<
        ReturnType<typeof zai.chat.completions.create>
      > | null;
      const text = completion?.choices?.[0]?.message?.content ?? "";
      if (!text.trim()) throw new Error("empty");
      return text;
    };
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
      zaiFallback,
      d.locale
    );
  }

  // ── Repli direct : z-ai, LLM call with 15 s guard (spec §27) ──
  let text = "";
  try {
    const zai = await ZAI.create();
    const withTimeout = Promise.race([
      zai.chat.completions.create({
        messages: llmMessages,
        thinking: { type: "disabled" },
      }),
      new Promise<null>((resolve) => setTimeout(() => resolve(null), 15_000)),
    ]);
    const completion = (await withTimeout) as Awaited<
      ReturnType<typeof zai.chat.completions.create>
    > | null;
    text = completion?.choices?.[0]?.message?.content ?? "";
    if (!text.trim()) throw new Error("empty");
  } catch (e) {
    console.error("[chat/message] llm", e);
    return sse([{ type: "error", v: "llm" }]);
  }

  const { clean, actions } = parseActions(text);
  const validActions = filterActions(actions);

  // Persist assistant reply + apply server-side actions
  let messageId: number | undefined;
  if (persisted && d.sessionId) {
    try {
      const saved = await db.chatMessage.create({
        data: { sessionId: d.sessionId, role: "assistant", content: clean },
      });
      messageId = saved.id;
      if (!savedUser) {
        await db.chatMessage.create({
          data: { sessionId: d.sessionId, role: "user", content: d.message },
        });
      }
    } catch (e) {
      console.error("[chat/message] save assistant", e);
    }
  }

  for (const a of validActions) {
    if (a.tool === "create_lead") {
      const created = await handleCreateLead(a, ip);
      if (created) a.args = { ...a.args, _created: true };
    } else if (a.tool === "suggest_slots") {
      const slots = await listUpcomingSlots(DEMO_CHAT_SLOTS_LIMIT).catch(() => []);
      if (slots.length > 0) a.args = { slots };
      else a.args = { _drop: true };
    } else if (a.tool === "book_demo") {
      await handleBookDemo(a, ip, d.locale);
    }
  }
  const emitActions = validActions.filter((a) => a.args?._drop !== true);

  // Stream tokens word-by-word (simulated flow, LLM is non-streaming)
  const tokens = clean.match(/\S+\s*/g) ?? [clean];
  const events: SseEvent[] = tokens.map((tk) => ({ type: "token", v: tk }));
  for (const a of emitActions) {
    events.push({ type: "action", tool: a.tool, args: a.args });
  }
  events.push({ type: "done", messageId });

  return sse(events, 22);
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
  zaiFallback: () => Promise<string>,
  locale: string
): Response {
  const encoder = new TextEncoder();
  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const send = (ev: SseEvent) =>
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(ev)}\n\n`));
      const savedUserNow = () => (typeof ctx.savedUser === "function" ? ctx.savedUser() : ctx.savedUser);
      let full = "";
      let got = false;
      let sentLen = 0;
      /* Affichage propre : les marqueurs d'action ([[action:…] ou dérives
         {"tool":…}) sont parsés en FIN de flux — on ne les envoie JAMAIS
         au navigateur. On n'émet que le texte sûr (avant le 1er marqueur). */
      const sendSafe = () => {
        let cut = full.length;
        const i1 = full.indexOf("[[action");
        if (i1 !== -1 && i1 < cut) cut = i1;
        const i2 = full.indexOf('{"tool"');
        if (i2 !== -1 && i2 < cut) cut = i2;
        if (cut > sentLen) {
          send({ type: "token", v: full.slice(sentLen, cut) });
          sentLen = cut;
        }
      };
      try {
        for await (const delta of iterator) {
          if (!delta) continue;
          got = true;
          full += delta;
          sendSafe();
        }
        /* Ni texte visible, ni marqueur exploitable → repli. */
        if (!got || !full.trim() || sentLen === 0) throw new Error("empty_stream");
      } catch (e) {
        console.error("[chat/message] openrouter stream", e);
        if (sentLen === 0) {
          /* aucun token VISIBLE envoyé → repli z-ai complet, même flux */
          try {
            await ctx.saveUserPromise;
            const text = await zaiFallback();
            const { clean, actions } = parseActions(text);
            const validActions = await runServerActions(filterActions(actions), ctx.ip, locale);
            let messageId: number | undefined;
            if (ctx.persisted && ctx.sessionId) {
              try {
                const saved = await db.chatMessage.create({
                  data: { sessionId: ctx.sessionId, role: "assistant", content: clean },
                });
                messageId = saved.id;
                if (!savedUserNow()) {
                  await db.chatMessage.create({
                    data: { sessionId: ctx.sessionId, role: "user", content: ctx.userMessage },
                  });
                }
              } catch (err) {
                console.error("[chat/message] save assistant", err);
              }
            }
            const tokens = clean.match(/\S+\s*/g) ?? [clean];
            for (const tk of tokens) send({ type: "token", v: tk });
            for (const a of validActions) {
              if (a.args?._drop === true) continue;
              send({ type: "action", tool: a.tool, args: a.args });
            }
            send({ type: "done", messageId });
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
    if (a.tool === "open_form" && !["trial", "quote", "contact"].includes(String(a.args?.type ?? ""))) continue;
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
