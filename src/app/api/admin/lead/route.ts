import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { isAdmin } from "@/lib/admin-auth";

const schema = z.object({
  id: z.string().uuid(),
  status: z.enum(["new", "contacted", "qualified", "trial_or_demo", "proposal", "won", "lost"]).optional(),
  notes: z.string().max(2000).optional(),
});

export async function PATCH(req: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ ok: false, error: { code: "unauthorized" } }, { status: 401 });
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
    const { id, status, notes } = parsed.data;
    const before = await db.lead.findUnique({ where: { id } });
    if (!before) return NextResponse.json({ ok: false, error: { code: "not_found" } }, { status: 404 });
    await db.lead.update({ where: { id }, data: { ...(status ? { status } : {}), ...(notes !== undefined ? { notes } : {}) } });
    if (status && status !== before.status) {
      await db.leadEvent.create({
        data: { leadId: id, type: "status_changed", data: JSON.stringify({ from: before.status, to: status }) },
      });
    }
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[admin/lead]", e);
    return NextResponse.json({ ok: false, error: { code: "server" } }, { status: 500 });
  }
}
