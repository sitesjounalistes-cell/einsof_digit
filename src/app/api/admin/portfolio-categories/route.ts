import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { isAdmin } from "@/lib/admin-auth";
import { parseLocaleJson } from "@/lib/locale-json";

/**
 * Catégories des réalisations — gérées depuis l'Espace équipe.
 *
 * Chaque catégorie porte un nom JSON {"fr":…} (repli fr) et un ordre ; les
 * projets y sont rattachés via Project.categoryId (FK avec onDelete: SetNull —
 * supprimer une catégorie détache les projets sans les supprimer, la réponse
 * renvoie { detached: n } pour affichage dans le tableau de bord).
 *
 * Enveloppe { ok, data | error } ; 401 sans session, 400 validation, 404 inconnu.
 */

const nameFrField = z.string().trim().min(2, "name_too_short").max(80, "name_too_long");
const sortOrderField = z.coerce.number().int().min(0).max(999).optional();

const createSchema = z.object({
  nameFr: nameFrField,
  sortOrder: sortOrderField,
});

const patchSchema = z.object({
  id: z.string().min(10),
  nameFr: nameFrField.optional(),
  sortOrder: sortOrderField,
});

/* ── Helpers ─────────────────────────────────────────────────── */

function slugify(s: string): string {
  return (
    s
      .normalize("NFD")
      .replace(/\p{Diacritic}/gu, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 60) || `categorie-${Date.now().toString(36)}`
  );
}

/** Slug unique en base : base, base-2, base-3… */
async function uniqueCategorySlug(base: string): Promise<string> {
  const root = slugify(base);
  let candidate = root;
  let n = 2;
  for (;;) {
    const clash = await db.portfolioCategory.findUnique({
      where: { slug: candidate },
      select: { id: true },
    });
    if (!clash) return candidate;
    candidate = `${root}-${n}`;
    n += 1;
  }
}

function unauthorized() {
  return NextResponse.json({ ok: false, error: { code: "unauthorized" } }, { status: 401 });
}

async function readJson(req: Request): Promise<unknown | null> {
  try {
    return await req.json();
  } catch {
    return null;
  }
}

/* ── GET — toutes les catégories avec le nombre de projets rattachés ── */

export async function GET() {
  if (!(await isAdmin())) {
    return unauthorized();
  }
  try {
    const rows = await db.portfolioCategory.findMany({
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
      include: { _count: { select: { projects: true } } },
    });
    return NextResponse.json({
      ok: true,
      data: rows.map((c) => ({
        id: c.id,
        slug: c.slug,
        name: parseLocaleJson(c.nameJson).fr ?? c.slug,
        sortOrder: c.sortOrder,
        projectCount: c._count.projects,
        createdAt: c.createdAt.toISOString(),
      })),
    });
  } catch (e) {
    console.error("[admin/portfolio-categories GET]", e);
    return NextResponse.json({ ok: false, error: { code: "server" } }, { status: 500 });
  }
}

/* ── POST — création (nom fr, slug auto, ordre max+1) ────────── */

export async function POST(req: Request) {
  if (!(await isAdmin())) {
    return unauthorized();
  }
  const body = await readJson(req);
  if (body === null) {
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
    const maxAgg = await db.portfolioCategory.aggregate({ _max: { sortOrder: true } });
    const slug = await uniqueCategorySlug(d.nameFr);
    const category = await db.portfolioCategory.create({
      data: {
        slug,
        nameJson: JSON.stringify({ fr: d.nameFr }),
        sortOrder: d.sortOrder ?? (maxAgg._max.sortOrder ?? 0) + 1,
      },
    });
    return NextResponse.json(
      { ok: true, data: { id: category.id, slug: category.slug } },
      { status: 201 }
    );
  } catch (e) {
    console.error("[admin/portfolio-categories POST]", e);
    return NextResponse.json({ ok: false, error: { code: "server" } }, { status: 500 });
  }
}

/* ── PATCH — renommage (merge fr) et réordonnancement ────────── */

export async function PATCH(req: Request) {
  if (!(await isAdmin())) {
    return unauthorized();
  }
  const body = await readJson(req);
  if (body === null) {
    return NextResponse.json({ ok: false, error: { code: "bad_json" } }, { status: 400 });
  }
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: { code: "validation", fields: parsed.error.flatten().fieldErrors } },
      { status: 400 }
    );
  }
  const { id, nameFr, sortOrder } = parsed.data;
  try {
    const existing = await db.portfolioCategory.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ ok: false, error: { code: "not_found" } }, { status: 404 });
    }
    const data: Record<string, unknown> = {};
    if (nameFr !== undefined) {
      /* Merge : la langue fr est mise à jour, les autres sont conservées. */
      const map = parseLocaleJson(existing.nameJson);
      map.fr = nameFr;
      data.nameJson = JSON.stringify(map);
      const next = slugify(nameFr);
      if (next !== existing.slug) data.slug = await uniqueCategorySlug(nameFr);
    }
    if (sortOrder !== undefined) data.sortOrder = sortOrder;
    const category = await db.portfolioCategory.update({ where: { id }, data });
    return NextResponse.json({ ok: true, data: { id: category.id, slug: category.slug } });
  } catch (e) {
    console.error("[admin/portfolio-categories PATCH]", e);
    return NextResponse.json({ ok: false, error: { code: "server" } }, { status: 500 });
  }
}

/* ── DELETE ?id= — suppression (les projets sont détachés, pas supprimés) ── */

export async function DELETE(req: Request) {
  if (!(await isAdmin())) {
    return unauthorized();
  }
  const id = new URL(req.url).searchParams.get("id");
  if (!id) {
    return NextResponse.json({ ok: false, error: { code: "validation" } }, { status: 400 });
  }
  try {
    const detached = await db.project.count({ where: { categoryId: id } });
    await db.portfolioCategory.delete({ where: { id } }); /* SetNull côté projets */
    return NextResponse.json({ ok: true, data: { detached } });
  } catch (e) {
    if ((e as { code?: string }).code === "P2025") {
      return NextResponse.json({ ok: false, error: { code: "not_found" } }, { status: 404 });
    }
    console.error("[admin/portfolio-categories DELETE]", e);
    return NextResponse.json({ ok: false, error: { code: "server" } }, { status: 500 });
  }
}
