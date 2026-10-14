import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";

const schema = z.object({
  endpoint: z.string().url().max(600),
  keys: z.object({ p256dh: z.string().min(20).max(200), auth: z.string().min(10).max(200) }),
  locale: z.string().max(5).optional(),
  visitorId: z.string().max(60).optional(),
});

/** Abonnement aux notifications push (upsert par endpoint). */
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

/** Désabonnement. */
export async function DELETE(req: Request) {
  const endpoint = new URL(req.url).searchParams.get("endpoint");
  if (!endpoint) {
    return NextResponse.json({ ok: false, error: { code: "validation" } }, { status: 400 });
  }
  try {
    await db.pushSubscription.deleteMany({ where: { endpoint } });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[push/subscribe DELETE]", e);
    return NextResponse.json({ ok: false, error: { code: "server" } }, { status: 500 });
  }
}
