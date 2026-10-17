import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { isAdmin } from "@/lib/admin-auth";

const schema = z.object({
  id: z.string().uuid(),
  status: z.enum(["new", "read", "answered", "archived"]),
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
    await db.contactMessage.update({ where: { id: parsed.data.id }, data: { status: parsed.data.status } });
    return NextResponse.json({ ok: true });
  } catch (e) {
    /* Cohérence API (audit F-15) : id inconnu → 404, pas 500. */
    if (typeof e === "object" && e !== null && "code" in e && (e as { code?: string }).code === "P2025") {
      return NextResponse.json({ ok: false, error: { code: "not_found" } }, { status: 404 });
    }
    console.error("[admin/message]", e);
    return NextResponse.json({ ok: false, error: { code: "server" } }, { status: 500 });
  }
}
