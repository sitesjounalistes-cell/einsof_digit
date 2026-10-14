/**
 * Notifications push — côté équipe (spécification §6/§14/§28).
 * GET  : liste des abonnements + clé publique VAPID.
 * POST : envoi d'une notification de test à tous les abonnés actifs
 *        (les abonnements morts 404/410 sont nettoyés).
 */
import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { isAdmin } from "@/lib/admin-auth";
import { getVapid, sendPushToAll } from "@/lib/adapters/push";

export async function GET() {
  if (!(await isAdmin())) {
    return NextResponse.json({ ok: false, error: { code: "unauthorized" } }, { status: 401 });
  }
  try {
    const [rows, vapid] = await Promise.all([
      db.pushSubscription.findMany({ orderBy: { createdAt: "desc" }, take: 100 }),
      getVapid(),
    ]);
    return NextResponse.json({
      ok: true,
      data: {
        publicKey: vapid.publicKey,
        count: rows.length,
        subscriptions: rows.map((s) => ({
          id: s.id,
          endpoint: s.endpoint,
          locale: s.locale,
          createdAt: s.createdAt.toISOString(),
        })),
      },
    });
  } catch (e) {
    console.error("[admin/push]", e);
    return NextResponse.json({ ok: false, error: { code: "server" } }, { status: 500 });
  }
}

const sendSchema = z.object({
  title: z.string().trim().min(2).max(80),
  body: z.string().trim().min(2).max(280),
});

export async function POST(req: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ ok: false, error: { code: "unauthorized" } }, { status: 401 });
  }
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: { code: "bad_json" } }, { status: 400 });
  }
  const parsed = sendSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: { code: "validation" } }, { status: 400 });
  }
  try {
    const result = await sendPushToAll(parsed.data.title, parsed.data.body);
    return NextResponse.json({ ok: true, data: result });
  } catch (e) {
    console.error("[admin/push POST]", e);
    const message = e instanceof Error ? e.message : "server";
    return NextResponse.json({ ok: false, error: { code: "server", message } }, { status: 500 });
  }
}
