import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { clientIp, rateLimit } from "@/lib/rate-limit";

const schema = z.object({
  visitorId: z.string().max(64),
  type: z.enum(["cookies_analytics", "chat_storage", "microphone", "contact"]),
  granted: z.boolean(),
  locale: z.string().max(5).optional(),
});

export async function POST(req: Request) {
  const ip = clientIp(req);
  if (!rateLimit(`consent:${ip}`, 30).allowed) {
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
    await db.consent.create({
      data: {
        visitorId: parsed.data.visitorId,
        type: parsed.data.type,
        granted: parsed.data.granted,
        locale: parsed.data.locale ?? null,
      },
    });
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (e) {
    console.error("[consent]", e);
    return NextResponse.json({ ok: false, error: { code: "server" } }, { status: 500 });
  }
}
