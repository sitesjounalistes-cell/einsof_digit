import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { clientIp, rateLimit } from "@/lib/rate-limit";

const keysSchema = z.object({ p256dh: z.string().min(20).max(200), auth: z.string().min(10).max(200) });

const schema = z.object({
  endpoint: z.string().url().max(600),
  keys: keysSchema,
  locale: z.string().max(5).optional(),
  visitorId: z.string().max(60).optional(),
});

/** Abonnement aux notifications push (upsert par endpoint) — rate-limité (audit S-06). */
export async function POST(req: Request) {
  const ip = clientIp(req);
  if (!rateLimit(`push-subscribe:${ip}`, 10).allowed) {
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
    const { endpoint, keys, locale, visitorId } = parsed.data;
    await db.pushSubscription.upsert({
      where: { endpoint },
      update: { p256dh: keys.p256dh, auth: keys.auth, locale: locale ?? null, visitorId: visitorId ?? null },
      create: {
        endpoint,
        p256dh: keys.p256dh,
        auth: keys.auth,
        locale: locale ?? null,
        visitorId: visitorId ?? null,
      },
    });
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (e) {
    console.error("[push/subscribe]", e);
    return NextResponse.json({ ok: false, error: { code: "server" } }, { status: 500 });
  }
}

/**
 * Désabonnement — preuve de possession requise (audit S-07) : la requête
 * doit fournir les clés d'abonnement (p256dh + auth), que seul le navigateur
 * abonné connaît. L'ancien DELETE par simple endpoint permettait à quiconque
 * connaissant l'URL d'endpoint de désabonner quelqu'un d'autre.
 */
export async function DELETE(req: Request) {
  const ip = clientIp(req);
  if (!rateLimit(`push-unsubscribe:${ip}`, 10).allowed) {
    return NextResponse.json({ ok: false, error: { code: "rate_limited" } }, { status: 429 });
  }
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: { code: "bad_json" } }, { status: 400 });
  }
  const parsed = z
    .object({ endpoint: z.string().url().max(600), keys: keysSchema })
    .safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: { code: "validation" } }, { status: 400 });
  }
  try {
    const { endpoint, keys } = parsed.data;
    // Ne supprime que si les clés correspondent à l'abonnement stocké.
    const deleted = await db.pushSubscription.deleteMany({
      where: { endpoint, p256dh: keys.p256dh, auth: keys.auth },
    });
    if (deleted.count === 0) {
      return NextResponse.json({ ok: false, error: { code: "not_found" } }, { status: 404 });
    }
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[push/subscribe DELETE]", e);
    return NextResponse.json({ ok: false, error: { code: "server" } }, { status: 500 });
  }
}
