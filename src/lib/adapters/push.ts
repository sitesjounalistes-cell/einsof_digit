/**
 * Adaptateur notifications push (web-push / VAPID — spécification §6/§14/§28).
 * - Clés VAPID : variables d'environnement VAPID_PUBLIC_KEY / VAPID_PRIVATE_KEY,
 *   sinon générées UNE FOIS et persistées dans la table Setting.
 * - Envoi : web-push (protocole Web Push standard). Les abonnements morts
 *   (404/410) sont supprimés automatiquement.
 * Générer ses propres clés : bun scripts/push-keys.ts
 */
import { db } from "@/lib/db";
import webpush from "web-push";

let cached: { publicKey: string; privateKey: string } | null = null;

export async function getVapid(): Promise<{ publicKey: string; privateKey: string }> {
  if (cached) return cached;

  const envPub = process.env.VAPID_PUBLIC_KEY?.trim();
  const envPriv = process.env.VAPID_PRIVATE_KEY?.trim();
  if (envPub && envPriv) {
    cached = { publicKey: envPub, privateKey: envPriv };
    return cached;
  }

  // Repli : paire persistée en base
  const [pubRow, privRow] = await Promise.all([
    db.setting.findUnique({ where: { key: "vapid_public" } }),
    db.setting.findUnique({ where: { key: "vapid_private" } }),
  ]);
  if (pubRow?.value && privRow?.value) {
    cached = { publicKey: pubRow.value, privateKey: privRow.value };
    return cached;
  }

  // Dernier recours : génération + persistance
  const keys = webpush.generateVAPIDKeys();
  await Promise.all([
    db.setting.upsert({
      where: { key: "vapid_public" },
      update: { value: keys.publicKey },
      create: { key: "vapid_public", value: keys.publicKey },
    }),
    db.setting.upsert({
      where: { key: "vapid_private" },
      update: { value: keys.privateKey },
      create: { key: "vapid_private", value: keys.privateKey },
    }),
  ]);
  cached = { publicKey: keys.publicKey, privateKey: keys.privateKey };
  return cached;
}

export interface PushSendResult {
  sent: number;
  failed: number;
  removed: number;
  configured: boolean;
}

export async function sendPushToAll(title: string, body: string): Promise<PushSendResult> {
  const { publicKey, privateKey } = await getVapid();
  webpush.setVapidDetails(
    process.env.VAPID_SUBJECT?.trim() || "mailto:contact@example.com",
    publicKey,
    privateKey
  );

  const subs = await db.pushSubscription.findMany();
  let sent = 0;
  let failed = 0;
  let removed = 0;

  await Promise.all(
    subs.map(async (s) => {
      try {
        await webpush.sendNotification(
          { endpoint: s.endpoint, keys: { p256dh: s.p256dh, auth: s.auth } },
          JSON.stringify({ title, body })
        );
        sent += 1;
      } catch (e) {
        failed += 1;
        const status =
          typeof e === "object" && e !== null && "statusCode" in e
            ? Number((e as { statusCode?: number }).statusCode)
            : 0;
        if (status === 404 || status === 410) {
          try {
            await db.pushSubscription.delete({ where: { id: s.id } });
            removed += 1;
          } catch {
            /* ignore */
          }
        }
      }
    })
  );

  return { sent, failed, removed, configured: subs.length > 0 };
}
