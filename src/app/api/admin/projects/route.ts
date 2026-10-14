import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { isAdmin } from "@/lib/admin-auth";
import { parseLocaleJson } from "@/lib/locale-json";

/** Réalisations : CRUD complet pour l'équipe (H-08 — données réelles du client). */

const localeField = z
  .string()
  .trim()
  .min(2)
  .max(4000)
  .transform((v) => JSON.stringify({ fr: v }));

const createSchema = z.object({
  title: localeField,
  client: z.string().trim().max(120).optional(),
  sector: z.string().trim().max(60).optional(),
  year: z.coerce.number().int().min(2015).max(2100),
  summary: localeField,
  description: z
    .string()
    .trim()
    .max(8000)
    .optional()
    .transform((v) => (v ? JSON.stringify({ fr: v }) : undefined)),
  linkUrl: z.string().url().max(300).optional().or(z.literal("")),
  isPublished: z.boolean().default(false),
});

const patchSchema = z.object({
  id: z.string().uuid(),
  title: localeField.optional(),
  client: z.string().trim().max(120).nullable().optional(),
  sector: z.string().trim().max(60).nullable().optional(),
  year: z.coerce.number().int().min(2015).max(2100).optional(),
  summary: localeField.optional(),
  description: z
    .string()
    .trim()
    .max(8000)
    .optional()
    .transform((v) => (v ? JSON.stringify({ fr: v }) : undefined)),
  linkUrl: z.string().url().max(300).nullable().optional().or(z.literal("")),
  isPublished: z.boolean().optional(),
  sortOrder: z.coerce.number().int().min(0).max(999).optional(),
});

function slugify(s: string): string {
  return (
    s
      .normalize("NFD")
      .replace(/\p{Diacritic}/gu, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 60) || `projet-${Date.now()}`
  );
}

function clean(v?: string | null): string | null {
  const s = (v ?? "").trim();
  return s.length ? s : null;
}

export async function GET() {
  if (!(await isAdmin())) {
    return NextResponse.json({ ok: false, error: { code: "unauthorized" } }, { status: 401 });
  }
  try {
    const rows = await db.project.findMany({
      orderBy: [{ sortOrder: "asc" }, { year: "desc" }],
    });
    return NextResponse.json({
      ok: true,
      data: rows.map((p) => ({
        id: p.id,
        slug: p.slug,
        title: parseLocaleJson(p.title).fr ?? p.slug,
        client: p.client,
        sector: p.sector,
        year: p.year,
        summary: parseLocaleJson(p.summary).fr ?? "",
        linkUrl: p.linkUrl,
        isPublished: p.isPublished,
        sortOrder: p.sortOrder,
      })),
    });
  } catch (e) {
    console.error("[admin/projects]", e);
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
    const titleFr = JSON.parse(d.title).fr as string;
    const project = await db.project.create({
      data: {
        slug: `${slugify(titleFr)}-${d.year}`,
        title: d.title,
        client: clean(d.client),
        sector: clean(d.sector),
        year: d.year,
        summary: d.summary,
        description: d.description ?? null,
        linkUrl: clean(d.linkUrl),
        isPublished: d.isPublished,
      },
    });
    return NextResponse.json({ ok: true, data: { id: project.id } }, { status: 201 });
  } catch (e) {
    console.error("[admin/projects POST]", e);
    return NextResponse.json({ ok: false, error: { code: "server" } }, { status: 500 });
  }
}

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
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: { code: "validation" } }, { status: 400 });
  }
  try {
    const { id, linkUrl, ...rest } = parsed.data;
    const data: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(rest)) {
      if (v !== undefined) data[k] = k === "client" || k === "sector" ? clean(v as string) : v;
    }
    if (linkUrl !== undefined) data.linkUrl = clean(linkUrl);
    const project = await db.project.update({ where: { id }, data });
    return NextResponse.json({ ok: true, data: { id: project.id } });
  } catch (e) {
    console.error("[admin/projects PATCH]", e);
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
    await db.project.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[admin/projects DELETE]", e);
    return NextResponse.json({ ok: false, error: { code: "server" } }, { status: 500 });
  }
}
