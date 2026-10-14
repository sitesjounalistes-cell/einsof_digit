import { z } from "zod";
import { db } from "@/lib/db";
import { upsertLead, normalizePhone } from "@/lib/leads";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import ZAI from "z-ai-web-dev-sdk";
import { buildSystemPrompt, parseActions, type ModelAction } from "@/lib/chatbot/prompt";
import { isValidSection } from "@/lib/sections-registry";

const historySchema = z.array(
  z.object({
    role: z.enum(["user", "assistant"]),
    content: z.string().max(4000),
  })
);

const schema = z.object({
  sessionId: z.string().uuid().nullable().optional(),
  message: z.string().trim().min(1).max(1000),
  currentSection: z.string().max(40).default("hero"),
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

  // Load history
  let history: { role: "user" | "assistant"; content: string }[] = [];
  let persisted = false;
  if (d.sessionId) {
    try {
      const rows = await db.chatMessage.findMany({
        where: { sessionId: d.sessionId, role: { in: ["user", "assistant"] } },
        orderBy: { id: "desc" },
        take: 12,
      });
      history = rows.reverse().map((r) => ({ role: r.role as "user" | "assistant", content: r.content ?? "" }));
      persisted = true;
    } catch (e) {
      console.error("[chat/message] history", e);
    }
  } else if (d.history) {
    history = d.history;
  }

  // Persist user message when the session is stored
  let savedUser = false;
  if (persisted && d.sessionId) {
    try {
      await db.chatMessage.create({
        data: { sessionId: d.sessionId, role: "user", content: d.message },
      });
      savedUser = true;
    } catch (e) {
      console.error("[chat/message] save user", e);
    }
  }

  const system = buildSystemPrompt(d.locale, isValidSection(d.currentSection) ? d.currentSection : "hero");
  const messages = [
    { role: "system" as const, content: system },
    ...history.slice(-12),
    { role: "user" as const, content: d.message },
  ];

  // LLM call with 15 s guard (spec §27: polite fallback beyond 15 s)
  let text = "";
  try {
    const zai = await ZAI.create();
    const withTimeout = Promise.race([
      zai.chat.completions.create({
        messages,
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
    }
  }

  // Stream tokens word-by-word (simulated flow, LLM is non-streaming)
  const tokens = clean.match(/\S+\s*/g) ?? [clean];
  const events: SseEvent[] = tokens.map((tk) => ({ type: "token", v: tk }));
  for (const a of validActions) {
    events.push({ type: "action", tool: a.tool, args: a.args });
  }
  events.push({ type: "done", messageId });

  return sse(events, 22);
}

function filterActions(actions: ModelAction[]): ModelAction[] {
  const out: ModelAction[] = [];
  for (const a of actions.slice(0, 1)) {
    // max one action per reply
    if (a.tool === "navigate" && !isValidSection(String(a.args?.section ?? ""))) continue;
    if (a.tool === "open_form" && !["trial", "quote", "contact"].includes(String(a.args?.type ?? ""))) continue;
    if (a.tool === "create_lead") {
      const fn = String(a.args?.first_name ?? "").trim();
      const ln = String(a.args?.last_name ?? "").trim();
      const ph = String(a.args?.phone ?? "").trim();
      if (fn.length < 2 || ln.length < 2 || ph.length < 6) continue;
    }
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
