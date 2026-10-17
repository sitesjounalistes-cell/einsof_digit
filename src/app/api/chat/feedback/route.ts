import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { clientIp, rateLimit } from "@/lib/rate-limit";

const schema = z.object({
  messageId: z.number().int().positive(),
  value: z.union([z.literal(-1), z.literal(1)]),
});

export async function POST(req: Request) {
  /* Route publique d'écriture : rate-limit obligatoire (audit S-06,
     aligné sur la spec §25 — toutes les écritures publiques sont limitées). */
  const ip = clientIp(req);
  if (!rateLimit(`chat-feedback:${ip}`, 20).allowed) {
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
  try {
    await db.chatMessage.update({
      where: { id: parsed.data.messageId },
      data: { feedback: parsed.data.value },
    });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[chat/feedback]", e);
    return NextResponse.json({ ok: false, error: { code: "server" } }, { status: 500 });
  }
}
