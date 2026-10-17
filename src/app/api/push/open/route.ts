/**
 * Ouverture de notification — appelé par le service worker au clic
 * sur une notification push (statistique « consultée » du cockpit).
 * Public (pas de session : le SW n'a pas de cookie admin), mais
 * strictement limité : un id de log existant, incrément borné.
 */
import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { clientIp, rateLimit } from "@/lib/rate-limit";

const schema = z.object({ logId: z.string().min(8).max(64) });

export async function POST(req: Request) {
  const ip = clientIp(req);
  if (!rateLimit(`push-open:${ip}`, 60).allowed) {
    return NextResponse.json({ ok: true }, { status: 202 });
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
    await db.notificationLog.update({
      where: { id: parsed.data.logId },
      data: { opened: { increment: 1 } },
    });
  } catch (e) {
    // P2025 (log introuvable) ou autre : jamais bloquant pour l'utilisateur
    console.error("[push/open]", e);
  }
  return NextResponse.json({ ok: true }, { status: 202 });
}
