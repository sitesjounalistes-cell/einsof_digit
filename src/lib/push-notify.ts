/**
 * Notification à tous les abonnés + journalisation (cockpit).
 * Utilisée par :
 *  - la publication d'un article de blog (kind = "article"),
 *  - les rappels publicitaires de l'Espace équipe (kind = "promo"),
 *  - les tests push (kind = "test"),
 *  - la publication d'un podcast (kind = "podcast").
 * Le journal NotificationLog alimente les statistiques (délivrées, ouvertes).
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
  const subs = await db.pushSubscription.findMany({ select: { id: true } });
  const subscribers = subs.length;

  let result: PushSendResult;
  try {
    result = await sendPushToAll(opts.title, opts.body, opts.url);
  } catch (e) {
    // Même en cas d'échec d'envi, on journalise l'intention (traçabilité cockpit)
    await db.notificationLog
      .create({
        data: {
          title: opts.title,
          body: opts.body,
          url: opts.url ?? null,
          kind: opts.kind ?? "promo",
          sentTo: subscribers,
          delivered: 0,
          failed: subscribers,
          opened: 0,
        },
      })
      .catch(() => {});
    throw e;
  }

  const log = await db.notificationLog
    .create({
      data: {
        title: opts.title,
        body: opts.body,
        url: opts.url ?? null,
        kind: opts.kind ?? "promo",
        sentTo: subscribers,
        delivered: result.sent,
        failed: result.failed,
        opened: 0,
      },
    })
    .catch(() => null);

  return { ...result, logId: log?.id ?? null, subscribers };
}
