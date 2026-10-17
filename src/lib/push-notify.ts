/**
 * Notification à tous les abonnés + journalisation (cockpit).
 * Utilisée par :
 *  - la publication d'un article de blog (kind = "article"),
 *  - les rappels publicitaires de l'Espace équipe (kind = "promo"),
 *  - les tests push (kind = "test"),
 *  - la publication d'un podcast (kind = "podcast").
 * Le journal NotificationLog alimente les statistiques (délivrées, ouvertes).
 *
 * Correctif audit F-11 (17/10/2026) : le journal est créé AVANT l'envoi et
 * son id est inclus dans le payload (logId) — le service worker peut ainsi
 * signaler l'ouverture via POST /api/push/open. Auparavant logId ne pouvait
 * jamais être dans le payload (créé après envoi) : « ouvertes » restait 0.
 */
import { db } from "@/lib/db";
import { sendPushToAll, type PushSendResult } from "@/lib/adapters/push";

export type NotificationKind = "article" | "promo" | "test" | "podcast";

export interface NotifyAllResult extends PushSendResult {
  logId: string | null;
  subscribers: number;
}

export async function notifyAll(opts: {
  title: string;
  body: string;
  url?: string;
  kind?: NotificationKind;
}): Promise<NotifyAllResult> {
  const subscribers = await db.pushSubscription.count();

  // 1. Journal d'abord → logId disponible pour le payload (traçabilité ouvertes)
  const log = await db.notificationLog
    .create({
      data: {
        title: opts.title,
        body: opts.body,
        url: opts.url ?? null,
        kind: opts.kind ?? "promo",
        sentTo: subscribers,
        delivered: 0,
        failed: 0,
        opened: 0,
      },
    })
    .catch(() => null);

  // 2. Envoi avec logId dans le payload (sw.js → POST /api/push/open au clic)
  let result: PushSendResult;
  try {
    result = await sendPushToAll(opts.title, opts.body, opts.url, log?.id ?? undefined);
  } catch (e) {
    if (log) {
      await db.notificationLog
        .update({ where: { id: log.id }, data: { failed: subscribers } })
        .catch(() => {});
    }
    throw e;
  }

  // 3. Mise à jour des compteurs réels
  if (log) {
    await db.notificationLog
      .update({
        where: { id: log.id },
        data: { delivered: result.sent, failed: result.failed },
      })
      .catch(() => {});
  }

  return { ...result, logId: log?.id ?? null, subscribers };
}
