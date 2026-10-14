import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { clientIp, rateLimit } from "@/lib/rate-limit";

const schema = z.object({
  visitorId: z.string().max(64),
  locale: z.string().max(5).default("fr"),
  mode: z.enum(["text", "omnis"]).default("text"),
  entryPath: z.string().max(200).optional(),
  /** Only persist when the visitor consented to conversation storage. */
  consentChatStorage: z.boolean().default(false),
});

export async function POST(req: Request) {
  const ip = clientIp(req);
  if (!rateLimit(`chatsession:${ip}`, 20).allowed) {
    return NextResponse.json({ ok: false, error: { code: "rate_limited" } }, { status: 429 });
  }
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: { code: "bad_json" } }, { status: 400 });
  }
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: { code: "validation" } }, { status: 400 });
  }
  const d = parsed.data;

  if (!d.consentChatStorage) {
    // Ephemeral mode — nothing is written to the database.
    return NextResponse.json({ ok: true, data: { sessionId: null, ephemeral: true } });
  }

  try {
    const session = await db.chatSession.create({
      data: {
        visitorId: d.visitorId,
        locale: d.locale,
        mode: d.mode,
        entryPath: d.entryPath ?? null,
      },
    });
    return NextResponse.json({ ok: true, data: { sessionId: session.id, ephemeral: false } }, { status: 201 });
  } catch (e) {
    console.error("[chat/session]", e);
    return NextResponse.json({ ok: false, error: { code: "server" } }, { status: 500 });
  }
}
