import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { isAdmin } from "@/lib/admin-auth";
import { parseLocaleJson } from "@/lib/locale-json";

/**
 * Réalisations — CRUD complet pour l'Espace équipe (H-08 — données réelles du client).
 *
 * Colonnes localisées (title, summary, description) : JSON {"fr":…,"en":…} en base
 * (repli fr — spec §20.8). L'API accepte du texte brut et met à jour la langue fr
 * SANS écraser les autres langues existantes (merge). Le slug est auto-dérivé du
 * titre (slugify + unicité garantie en base).
 */

/* ── Schémas zod ─────────────────────────────────────────────── */

const titleField = z.string().trim().min(2).max(200);
const summaryField = z.string().trim().min(4).max(4000);
const descriptionField = z.string().trim().max(8000);
/** URL interne (/uploads/…, /images/…) ou absolue (https://…). */
const imageUrlField = z
  .string()
  .trim()
  .max(500)
  .refine((v) => v === "" || v.startsWith("/") || /^https?:\/\//i.test(v), "bad_image_url");

const slugField = z.string().trim().max(80);

const createSchema = z.object({
  title: titleField,
  client: z.string().trim().max(120).optional(),
  sector: z.string().trim().max(60).optional(),
  year: z.coerce.number().int().min(2015).max(2100),
  summary: summaryField,
  description: descriptionField.optional(),
  linkUrl: z.string().url().max(300).optional().or(z.literal("")),
  imageUrl: imageUrlField.optional(),
  slug: slugField.optional(),
  isPublished: z.boolean().default(false),
  sortOrder: z.coerce.number().int().min(0).max(999).optional(),
  categoryId: z.string().uuid().or(z.literal("")).nullable().optional(),
});

const patchSchema = z.object({
  id: z.string().min(10),
  title: titleField.optional(),
  client: z.string().trim().max(120).nullable().optional(),
  sector: z.string().trim().max(60).nullable().optional(),
  year: z.coerce.number().int().min(2015).max(2100).optional(),
  summary: summaryField.optional(),
  description: descriptionField.nullable().optional(),
  linkUrl: z.string().url().max(300).nullable().optional().or(z.literal("")),
  imageUrl: imageUrlField.nullable().optional(),
  slug: slugField.nullable().optional(),
  isPublished: z.boolean().optional(),
  sortOrder: z.coerce.number().int().min(0).max(999).optional(),
  categoryId: z.string().uuid().or(z.literal("")).nullable().optional(),
});

/** Résout une valeur categoryId (""/null = aucun) — renvoie undefined si absent,
 * null si aucun, l'id si valide ou "bad" si la catégorie n'existe pas. */
async function resolveCategoryId(
  v: string | null | undefined
): Promise<string | null | "bad" | undefined> {
  if (v === undefined) return undefined;
  const id = (v ?? "").trim();
  if (id === "") return null;
  const exists = await db.portfolioCategory.findUnique({ where: { id }, select: { id: true } });
  return exists ? id : "bad";
}

/* ── Helpers ─────────────────────────────────────────────────── */

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

/** Slug unique en base : base, base-2, base-3… (id exclu du contrôle). */
async function uniqueSlug(base: string, excludeId?: string): Promise<string> {
  const root = slugify(base);
  let candidate = root;
  let n = 2;
  for (;;) {
    const clash = await db.project.findUnique({ where: { slug: candidate } });
    if (!clash || clash.id === excludeId) return candidate;
    candidate = `${root}-${n}`;
    n += 1;
  }
}

function clean(v?: string | null): string | null {
  const s = (v ?? "").trim();
  return s.length ? s : null;
}

/** Fusionne la valeur fr dans le JSON multi-langues existant (ne perd rien). */
function mergeFr(existingRaw: string | null | undefined, frValue: string): string {
  const map = parseLocaleJson(existingRaw);
  map.fr = frValue;
  return JSON.stringify(map);
}

/** Premier lancement de slug unique refusé en création : -2, -3… automatique. */

/* ── GET : liste complète (publiés + brouillons) ─────────────── */

export async function GET() {
  if (!(await isAdmin())) {
    return NextResponse.json({ ok: false, error: { code: "unauthorized" } }, { status: 401 });
  }
  try {
    const rows = await db.project.findMany({
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
      include: { category: { select: { nameJson: true } } },
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
        description: parseLocaleJson(p.description).fr ?? null,
        linkUrl: p.linkUrl,
        imageUrl: p.imageUrl,
        categoryId: p.categoryId,
        categoryName: p.category
          ? (parseLocaleJson(p.category.nameJson).fr ?? null)
          : null,
        isPublished: p.isPublished,
        sortOrder: p.sortOrder,
      })),
    });
  } catch (e) {
    console.error("[admin/projects GET]", e);
    return NextResponse.json({ ok: false, error: { code: "server" } }, { status: 500 });
  }
}

/* ── POST : création ─────────────────────────────────────────── */

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
    const categoryId = await resolveCategoryId(d.categoryId);
    if (categoryId === "bad") {
      return NextResponse.json({ ok: false, error: { code: "bad_category" } }, { status: 400 });
    }
    const slug = await uniqueSlug(d.slug ? d.slug : d.title);
    const project = await db.project.create({
      data: {
        slug,
        title: JSON.stringify({ fr: d.title }),
        client: clean(d.client),
        sector: clean(d.sector),
        year: d.year,
        summary: JSON.stringify({ fr: d.summary }),
        description: d.description ? JSON.stringify({ fr: d.description }) : null,
        linkUrl: clean(d.linkUrl ?? null),
        imageUrl: clean(d.imageUrl ?? null),
        isPublished: d.isPublished,
        sortOrder: d.sortOrder ?? 0,
        categoryId,
      },
    });
    return NextResponse.json(
      { ok: true, data: { id: project.id, slug: project.slug } },
      { status: 201 }
    );
  } catch (e) {
    console.error("[admin/projects POST]", e);
    return NextResponse.json({ ok: false, error: { code: "server" } }, { status: 500 });
  }
}

/* ── PATCH : édition de tous les champs par id ───────────────── */

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
    return NextResponse.json(
      { ok: false, error: { code: "validation", fields: parsed.error.flatten().fieldErrors } },
      { status: 400 }
    );
  }
  const {
    id,
    title,
    summary,
    description,
    client,
    sector,
    linkUrl,
    imageUrl,
    slug,
    categoryId,
    ...rest
  } = parsed.data;
  try {
    const existing = await db.project.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ ok: false, error: { code: "not_found" } }, { status: 404 });
    }

    const data: Record<string, unknown> = {};
    // Champs localisés : merge de la langue fr, les autres langues sont conservées.
    if (title !== undefined) data.title = mergeFr(existing.title, title);
    if (summary !== undefined) data.summary = mergeFr(existing.summary, summary);
    if (description !== undefined) {
      data.description =
        description === null || description === "" ? null : mergeFr(existing.description, description);
    }
    if (client !== undefined) data.client = clean(client);
    if (sector !== undefined) data.sector = clean(sector);
    if (linkUrl !== undefined) data.linkUrl = clean(linkUrl);
    if (imageUrl !== undefined) data.imageUrl = clean(imageUrl);
    if (categoryId !== undefined) {
      const resolved = await resolveCategoryId(categoryId);
      if (resolved === "bad") {
        return NextResponse.json({ ok: false, error: { code: "bad_category" } }, { status: 400 });
      }
      data.categoryId = resolved;
    }
    if (slug !== undefined && slug !== null && slug.trim() !== "") {
      const next = slugify(slug);
      if (next !== existing.slug) data.slug = await uniqueSlug(next, id);
    }
    for (const [k, v] of Object.entries(rest)) {
      if (v !== undefined) data[k] = v;
    }

    const project = await db.project.update({ where: { id }, data });
    return NextResponse.json({ ok: true, data: { id: project.id, slug: project.slug } });
  } catch (e) {
    console.error("[admin/projects PATCH]", e);
    return NextResponse.json({ ok: false, error: { code: "server" } }, { status: 500 });
  }
}

/* ── DELETE : suppression par id (?id=…) ─────────────────────── */

export async function DELETE(req: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ ok: false, error: { code: "unauthorized" } }, { status: 401 });
  }
  const id = new URL(req.url).searchParams.get("id");
  if (!id || id.length < 10) {
    return NextResponse.json({ ok: false, error: { code: "validation" } }, { status: 400 });
  }
  try {
    await db.project.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (e) {
    const code = (e as { code?: string }).code;
    if (code === "P2025") {
      return NextResponse.json({ ok: false, error: { code: "not_found" } }, { status: 404 });
    }
    console.error("[admin/projects DELETE]", e);
    return NextResponse.json({ ok: false, error: { code: "server" } }, { status: 500 });
  }
}
