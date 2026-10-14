import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { isAdmin } from "@/lib/admin-auth";

/** Journal des e-mails transactionnels (adaptateur Resend / mock). */
export async function GET() {
  if (!(await isAdmin())) {
    return NextResponse.json({ ok: false, error: { code: "unauthorized" } }, { status: 401 });
  }
  try {
    const rows = await db.emailLog.findMany({ orderBy: { createdAt: "desc" }, take: 60 });
    return NextResponse.json({
      ok: true,
      data: rows.map((m) => ({
        id: m.id,
        toEmail: m.toEmail,
        subject: m.subject,
        template: m.template,
        status: m.status,
        provider: m.provider,
        error: m.error,
        createdAt: m.createdAt.toISOString(),
      })),
    });
  } catch (e) {
    console.error("[admin/emails]", e);
    return NextResponse.json({ ok: false, error: { code: "server" } }, { status: 500 });
  }
}
