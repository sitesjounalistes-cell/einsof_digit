import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { isAdmin } from "@/lib/admin-auth";

/** Partenaires : CRUD complet pour l'équipe (H-08 — données réelles du client). */

/* URL (https) OU chemin interne (/uploads/… issu de /api/admin/upload) — vide = aucun. */
const urlField = z
  .string()
  .trim()
  .max(300)
  .refine(
    (v) => v === "" || v.startsWith("/") || /^https?:\/\/\S+\.\S+/i.test(v),
    "bad_url"
  )
  .nullable()
  .optional();

const createSchema = z.object({
  name: z.string().trim().min(2).max(120),
  logoUrl: urlField,
  websiteUrl: urlField,
  description: z.string().trim().max(500).optional(),
  sortOrder: z.coerce.number().int().min(0).max(999).default(0),
  isActive: z.boolean().default(true),
});

const putSchema = z.object({
  id: z.string().uuid(),
  name: z.string().trim().min(2).max(120).optional(),
  logoUrl: urlField,
  websiteUrl: urlField,
  description: z.string().trim().max(500).nullable().optional(),
  sortOrder: z.coerce.number().int().min(0).max(999).optional(),
  isActive: z.boolean().optional(),
});

function clean(v?: string | null): string | null {
  const s = (v ?? "").trim();
  return s.length ? s : null;
}

export async function GET() {
  if (!(await isAdmin())) {
    return NextResponse.json({ ok: false, error: { code: "unauthorized" } }, { status: 401 });
  }
  try {
    const rows = await db.partner.findMany({
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    });
    return NextResponse.json({ ok: true, data: rows });
  } catch (e) {
    console.error("[admin/partners]", e);
    return NextResponse.json({ ok: false, error: { code: "server" } }, { status: 500 });
  }
}

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
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: { code: "validation", fields: parsed.error.flatten().fieldErrors } },
      { status: 400 }
    );
  }
  try {
    const d = parsed.data;
    const partner = await db.partner.create({
      data: {
        name: d.name,
        logoUrl: clean(d.logoUrl),
        websiteUrl: clean(d.websiteUrl),
        description: clean(d.description),
        sortOrder: d.sortOrder,
        isActive: d.isActive,
      },
    });
    return NextResponse.json({ ok: true, data: { id: partner.id } }, { status: 201 });
  } catch (e) {
    console.error("[admin/partners POST]", e);
    return NextResponse.json({ ok: false, error: { code: "server" } }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ ok: false, error: { code: "unauthorized" } }, { status: 401 });
  }
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: { code: "bad_json" } }, { status: 400 });
  }
  const parsed = putSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: { code: "validation" } }, { status: 400 });
  }
  try {
    const { id, logoUrl, websiteUrl, description, ...rest } = parsed.data;
    const data: Record<string, unknown> = { ...rest };
    if (logoUrl !== undefined) data.logoUrl = clean(logoUrl);
    if (websiteUrl !== undefined) data.websiteUrl = clean(websiteUrl);
    if (description !== undefined) data.description = clean(description);
    const partner = await db.partner.update({ where: { id }, data });
    return NextResponse.json({ ok: true, data: { id: partner.id } });
  } catch (e) {
    if ((e as { code?: string }).code === "P2025") {
      return NextResponse.json({ ok: false, error: { code: "not_found" } }, { status: 404 });
    }
    console.error("[admin/partners PUT]", e);
    return NextResponse.json({ ok: false, error: { code: "server" } }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ ok: false, error: { code: "unauthorized" } }, { status: 401 });
  }
  const id = new URL(req.url).searchParams.get("id");
  if (!id) {
    return NextResponse.json({ ok: false, error: { code: "validation" } }, { status: 400 });
  }
  try {
    await db.partner.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (e) {
    if ((e as { code?: string }).code === "P2025") {
      return NextResponse.json({ ok: false, error: { code: "not_found" } }, { status: 404 });
    }
    console.error("[admin/partners DELETE]", e);
    return NextResponse.json({ ok: false, error: { code: "server" } }, { status: 500 });
  }
}
