import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { isAdmin } from "@/lib/admin-auth";
import { parseLocaleJson } from "@/lib/locale-json";

/** Documents : CRUD complet pour l'équipe (H-08 — liens réels fournis par le client). */

const SLUG_RE = /^[a-z0-9]+(-[a-z0-9]+)*$/;

/** Texte multi-langues : fr requis, traductions optionnelles (repli fr côté site). */
function localeText(min: number, max: number) {
  return z.object({
    fr: z.string().trim().min(min).max(max),
    en: z.string().trim().min(min).max(max).optional(),
    es: z.string().trim().min(min).max(max).optional(),
    zh: z.string().trim().min(min).max(max).optional(),
    de: z.string().trim().min(min).max(max).optional(),
  });
}

const createSchema = z.object({
  slug: z.string().trim().min(3).max(80).regex(SLUG_RE, "slug"),
  title: localeText(3, 200),
  description: localeText(3, 600).optional(),
  category: z.string().trim().max(40).optional(),
  fileUrl: z.string().trim().min(1).max(500),
  fileKind: z.enum(["pdf", "xlsx", "docx", "link"]).optional(),
  visibility: z.enum(["public", "lead", "team"]).default("public"),
  isPublished: z.boolean().default(false),
  sortOrder: z.coerce.number().int().min(0).max(999).default(0),
});

const putSchema = z.object({
  id: z.string().uuid(),
  slug: z.string().trim().min(3).max(80).regex(SLUG_RE, "slug").optional(),
  title: localeText(3, 200).optional(),
  description: localeText(3, 600).nullable().optional(),
  category: z.string().trim().max(40).nullable().optional(),
  fileUrl: z.string().trim().min(1).max(500).optional(),
  fileKind: z.enum(["pdf", "xlsx", "docx", "link"]).nullable().optional(),
  visibility: z.enum(["public", "lead", "team"]).optional(),
  isPublished: z.boolean().optional(),
  sortOrder: z.coerce.number().int().min(0).max(999).optional(),
});

function clean(v?: string | null): string | null {
  const s = (v ?? "").trim();
  return s.length ? s : null;
}

/** Rejette une requête si le slug est déjà pris (par un autre document). */
async function slugTaken(slug: string, exceptId?: string): Promise<boolean> {
  const existing = await db.document.findUnique({ where: { slug } });
  return existing !== null && existing.id !== exceptId;
}

export async function GET() {
  if (!(await isAdmin())) {
    return NextResponse.json({ ok: false, error: { code: "unauthorized" } }, { status: 401 });
  }
  try {
    const rows = await db.document.findMany({
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    });
    return NextResponse.json({
      ok: true,
      data: rows.map((d) => ({
        id: d.id,
        slug: d.slug,
        title: parseLocaleJson(d.title),
        description: parseLocaleJson(d.description ?? null),
        category: d.category,
        fileUrl: d.fileUrl,
        fileKind: d.fileKind,
        visibility: d.visibility,
        isPublished: d.isPublished,
        sortOrder: d.sortOrder,
        createdAt: d.createdAt,
      })),
    });
  } catch (e) {
    console.error("[admin/documents]", e);
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
    if (await slugTaken(d.slug)) {
      return NextResponse.json({ ok: false, error: { code: "slug_exists" } }, { status: 409 });
    }
    const document = await db.document.create({
      data: {
        slug: d.slug,
        title: JSON.stringify(d.title),
        description: d.description ? JSON.stringify(d.description) : null,
        category: clean(d.category),
        fileUrl: d.fileUrl,
        fileKind: d.fileKind ?? null,
        visibility: d.visibility,
        isPublished: d.isPublished,
        sortOrder: d.sortOrder,
      },
    });
    return NextResponse.json({ ok: true, data: { id: document.id } }, { status: 201 });
  } catch (e) {
    if ((e as { code?: string }).code === "P2002") {
      return NextResponse.json({ ok: false, error: { code: "slug_exists" } }, { status: 409 });
    }
    console.error("[admin/documents POST]", e);
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
    const { id, slug, title, description, category, fileKind, ...rest } = parsed.data;
    if (slug && (await slugTaken(slug, id))) {
      return NextResponse.json({ ok: false, error: { code: "slug_exists" } }, { status: 409 });
    }
    const data: Record<string, unknown> = { ...rest };
    if (slug !== undefined) data.slug = slug;
    if (title !== undefined) data.title = JSON.stringify(title);
    if (description !== undefined) {
      data.description = description === null ? null : JSON.stringify(description);
    }
    if (category !== undefined) data.category = clean(category);
    if (fileKind !== undefined) data.fileKind = fileKind;
    const document = await db.document.update({ where: { id }, data });
    return NextResponse.json({ ok: true, data: { id: document.id } });
  } catch (e) {
    if ((e as { code?: string }).code === "P2002") {
      return NextResponse.json({ ok: false, error: { code: "slug_exists" } }, { status: 409 });
    }
    if ((e as { code?: string }).code === "P2025") {
      return NextResponse.json({ ok: false, error: { code: "not_found" } }, { status: 404 });
    }
    console.error("[admin/documents PUT]", e);
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
    await db.document.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (e) {
    if ((e as { code?: string }).code === "P2025") {
      return NextResponse.json({ ok: false, error: { code: "not_found" } }, { status: 404 });
    }
    console.error("[admin/documents DELETE]", e);
    return NextResponse.json({ ok: false, error: { code: "server" } }, { status: 500 });
  }
}
