/**
 * Notifications push — côté équipe (spécification §6/§14/§28).
 * GET  : liste des abonnements + clé publique VAPID + journal des
 *        20 dernières notifications envoyées (cockpit publicitaire).
 * POST : envoi d'une notification à tous les abonnés actifs via
 *        notifyAll() — journalisée dans NotificationLog (kind promo|test).
 *        Les abonnements morts (404/410) sont nettoyés.
 */
import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { isAdmin } from "@/lib/admin-auth";
import { getVapid } from "@/lib/adapters/push";
import { notifyAll } from "@/lib/push-notify";

export async function GET() {
  if (!(await isAdmin())) {
    return NextResponse.json({ ok: false, error: { code: "unauthorized" } }, { status: 401 });
  }
  try {
    const [rows, vapid, logs] = await Promise.all([
      db.pushSubscription.findMany({ orderBy: { createdAt: "desc" }, take: 100 }),
      getVapid(),
      db.notificationLog.findMany({ orderBy: { createdAt: "desc" }, take: 20 }),
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
        logs: logs.map((l) => ({
          id: l.id,
          title: l.title,
          body: l.body,
          url: l.url,
          kind: l.kind,
          sentTo: l.sentTo,
          delivered: l.delivered,
          failed: l.failed,
          opened: l.opened,
          createdAt: l.createdAt.toISOString(),
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
  /** Chemin interne ouvert au clic sur la notification (défaut "/") */
  url: z
    .string()
    .trim()
    .startsWith("/")
    .max(300)
    .optional(),
  /** Promo publicitaire ou simple test (les articles passent par kind "article") */
  kind: z.enum(["promo", "test"]).optional(),
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
    return NextResponse.json(
      { ok: false, error: { code: "validation", message: "Titre (2-80), message (2-280), url commençant par « / », kind promo|test." } },
      { status: 400 }
    );
  }
  try {
    const result = await notifyAll({
      title: parsed.data.title,
      body: parsed.data.body,
      url: parsed.data.url ?? "/",
      kind: parsed.data.kind ?? "promo",
    });
    return NextResponse.json({ ok: true, data: result });
  } catch (e) {
    console.error("[admin/push POST]", e);
    const message = e instanceof Error ? e.message : "server";
    return NextResponse.json({ ok: false, error: { code: "server", message } }, { status: 500 });
  }
}
