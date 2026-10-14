import { NextResponse } from "next/server";
import { db } from "@/lib/db";

/**
 * Tâche planifiée de maintenance (spécification §25 : /api/cron/*).
 * Protégée par `Authorization: Bearer <CRON_SECRET>` (Vercel Cron en production).
 *
 * À planifier quotidiennement :
 *   vercel.json → { "crons": [{ "path": "/api/cron/maintenance", "schedule": "0 3 * * *" }] }
 * En local : curl -H "Authorization: Bearer $CRON_SECRET" http://localhost:3000/api/cron/maintenance
 */
function authorized(req: Request): boolean {
  const secret = process.env.CRON_SECRET?.trim() || "eins-cron-dev";
  const header = req.headers.get("authorization") ?? "";
  return header === `Bearer ${secret}`;
}

async function runMaintenance() {
  const now = new Date();

  // 1. Essais gratuits dépassés (7 jours) → expirés + événement horodaté
  const openTrials = await db.trialRequest.findMany({
    where: { status: "requested" },
    include: { lead: false },
  });
  let trialsExpired = 0;
  for (const t of openTrials) {
    const deadline = new Date(t.createdAt);
    deadline.setDate(deadline.getDate() + t.trialDays);
    if (deadline < now) {
      await db.trialRequest.update({ where: { id: t.id }, data: { status: "expired" } });
      await db.leadEvent.create({
        data: { leadId: t.leadId, type: "trial_expired", data: JSON.stringify({ trialId: t.id }) },
      });
      trialsExpired += 1;
    }
  }

  // 2. Sessions de chat ouvertes depuis plus de 24 h → clôturées
  const chatCutoff = new Date(now.getTime() - 24 * 3600 * 1000);
  const chatsClosed = await db.chatSession.updateMany({
    where: { endedAt: null, createdAt: { lt: chatCutoff } },
    data: { endedAt: now },
  });

  // 3. Purge des événements analytiques de plus de 12 mois (minimisation §24)
  const analyticsCutoff = new Date(now.getTime() - 365 * 24 * 3600 * 1000);
  const analyticsPurged = await db.analyticsEvent.deleteMany({
    where: { createdAt: { lt: analyticsCutoff } },
  });

  // 4. Purge du journal des e-mails de plus de 90 jours
  const emailCutoff = new Date(now.getTime() - 90 * 24 * 3600 * 1000);
  const emailsPurged = await db.emailLog.deleteMany({
    where: { createdAt: { lt: emailCutoff } },
  });

  return {
    ranAt: now.toISOString(),
    trialsExpired,
    chatsClosed: chatsClosed.count,
    analyticsPurged: analyticsPurged.count,
    emailsPurged: emailsPurged.count,
  };
}

function handle(req: Request) {
  if (!authorized(req)) {
    return NextResponse.json({ ok: false, error: { code: "unauthorized" } }, { status: 401 });
  }
  return runMaintenance()
    .then((data) => NextResponse.json({ ok: true, data }))
    .catch((e) => {
      console.error("[cron/maintenance]", e);
      return NextResponse.json({ ok: false, error: { code: "server" } }, { status: 500 });
    });
}

export async function GET(req: Request) {
  return handle(req);
}

export async function POST(req: Request) {
  return handle(req);
}
