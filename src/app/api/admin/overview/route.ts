import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { isAdmin } from "@/lib/admin-auth";

export async function GET() {
  if (!(await isAdmin())) {
    return NextResponse.json({ ok: false, error: { code: "unauthorized" } }, { status: 401 });
  }
  try {
    /* Audit F-15 : la requête trialRequest était exécutée EN DOUBLE dans le
       même Promise.all (trials + trialRows) — une seule suffit désormais. */
    const [totalLeads, newLeads, trials, unreadMessages, chats, recentLeads, messages] =
      await Promise.all([
        db.lead.count(),
        db.lead.count({ where: { status: "new" } }),
        db.trialRequest.findMany({ orderBy: { createdAt: "desc" }, take: 20, include: { lead: true } }),
        db.contactMessage.count({ where: { status: "new" } }),
        db.chatSession.count(),
        db.lead.findMany({ orderBy: { createdAt: "desc" }, take: 30 }),
        db.contactMessage.findMany({ orderBy: { createdAt: "desc" }, take: 30, include: { lead: true } }),
      ]);

    return NextResponse.json({
      ok: true,
      data: {
        stats: { totalLeads, newLeads, unreadMessages, chats, trials: trials.length },
        leads: recentLeads,
        messages,
        trials,
      },
    });
  } catch (e) {
    console.error("[admin/overview]", e);
    return NextResponse.json({ ok: false, error: { code: "server" } }, { status: 500 });
  }
}
