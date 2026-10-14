import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";

const schema = z.object({
  messageId: z.number().int().positive(),
  value: z.union([z.literal(-1), z.literal(1)]),
});

export async function POST(req: Request) {
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
