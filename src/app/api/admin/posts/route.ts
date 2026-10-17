import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { isAdmin } from "@/lib/admin-auth";
import { parseLocaleJson } from "@/lib/locale-json";
import { parseAds, stringifyAds, type PostAdInput } from "@/lib/post-ads";
import { parseYouTubeId } from "@/lib/youtube";
import { notifyAll } from "@/lib/push-notify";

/* Journal (blog) — rédaction complète pour l'Espace équipe (cahier des charges §26).
 * Format de stockage identique à scripts/seed-content.ts :
 *   title / excerpt : JSON {"fr":"…","en":"…"} (valeurs chaînes simples)
 *   body            : JSON {"fr":"p1\n\np2\n\n…","en":"…"} — chaque locale est une
 *                     chaîne de paragraphes jointe par \n\n (rendu public : split("\n\n")).
 * Enveloppe { ok, data | error } ; 401 sans session, 400 validation, 409 slug pris, 500 serveur.
 */

const SLUG_RE = /^[a-z0-9]+(-[a-z0-9]+)*$/;

/* ── Schémas ─────────────────────────────────────────────────── */

/** Valeur de corps : tableau de paragraphes (un par entrée) ou chaîne déjà jointe.
 * Normalisé en chaîne de paragraphes séparés par \n\n (format du seed). */
const paragraphValue = z
  .union([z.string(), z.array(z.string())])
  .transform((v) =>
    Array.isArray(v)
      ? v.map((p) => p.trim()).filter(Boolean).join("\n\n")
      : v.replace(/\r\n/g, "\n").trim()
  );

/** Carte multilingue {"fr": requis, en/es/zh/de optionnels} — repli fr côté site (§20.8).
 * Le français porte les bornes complètes ; les traductions optionnelles gardent
 * une borne basse souple (3 caractères) — elles peuvent aussi rester absentes. */
function localeMap<T extends z.ZodType, U extends z.ZodType>(required: T, optional: U) {
  return z.object({
    fr: required,
    en: optional.optional(),
    es: optional.optional(),
    zh: optional.optional(),
    de: optional.optional(),
  });
}

const titleMap = localeMap(
  z.string().trim().min(3).max(200),
  z.string().trim().min(3).max(200)
);
const excerptMap = localeMap(
  z.string().trim().min(20).max(400),
  z.string().trim().min(3).max(400)
);
const bodyMap = localeMap(
  paragraphValue.pipe(z.string().min(100).max(20000)),
  paragraphValue.pipe(z.string().min(3).max(20000))
);

const isoDate = z.string().refine((v) => !Number.isNaN(Date.parse(v)), "bad_date");

const slugField = z.string().trim().regex(SLUG_RE, "bad_slug").min(3).max(80);
const readingMinField = z.coerce.number().int().min(1).max(60);
/* Audit F-23 : la catégorie est validée contre le vocabulaire traduit
   (journal.categories.* dans les 5 langues) — les 6 articles seedés en
   catégories libres (« logiciels », « marketing », « formations »)
   affichaient des badges non traduits. */
const POST_CATEGORIES = ["agence", "web", "saas", "logiciels", "marketing", "formations"] as const;
const categoryField = z.enum(POST_CATEGORIES);

/* ── SEO par article (DASH-3) — chaîne vide = retour au repli automatique ── */
const metaTitleField = z
  .string()
  .trim()
  .max(200, "meta_title_too_long")
  .transform((v) => (v.length > 0 ? v : null));
const metaDescriptionField = z
  .string()
  .trim()
  .max(400, "meta_description_too_long")
  .transform((v) => (v.length > 0 ? v : null));
const keywordsField = z
  .string()
  .trim()
  .max(600, "keywords_too_long")
  .transform((v) => (v.length > 0 ? v : null));

/* ── Espaces publicitaires (DASH-3) — max 10, linkUrl https si présente ── */
const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .transform((v) => (v.length > 0 ? v : undefined));

const adSchema = z.object({
  id: optionalText(64),
  title: optionalText(120),
  text: optionalText(600),
  /** Interne (/uploads/…) ou https — jamais http:// en clair. */
  imageUrl: optionalText(600).refine(
    (v) => v === undefined || v.startsWith("/") || /^https:\/\//.test(v),
    "bad_image_url"
  ),
  /** Destination au clic : https uniquement (sécurité, contenu mixte). */
  linkUrl: optionalText(600).refine(
    (v) => v === undefined || /^https:\/\//.test(v),
    "bad_link_url"
  ),
  ctaLabel: optionalText(60),
  position: z.coerce
    .number()
    .int("bad_position")
    .min(0, "bad_position")
    .max(999, "bad_position")
    .default(0),
  isActive: z.boolean().default(true),
});
const adsField = z.array(adSchema).max(10, "too_many_ads");

/* ── Éditorial enrichi (DASH-5) — couverture, à la une, vidéo YouTube ──
 * Chaîne vide = remise à blanc (null en base). */
const coverUrlField = z
  .string()
  .trim()
  .max(600, "cover_too_long")
  .transform((v) => (v.length > 0 ? v : null))
  .refine(
    (v) => v === null || v.startsWith("/") || /^https:\/\//i.test(v),
    "bad_cover_url"
  );
/** Lien YouTube : watch, youtu.be, shorts, embed — null si vide, 400 sinon. */
const videoUrlField = z
  .string()
  .trim()
  .max(500, "video_too_long")
  .transform((v) => (v.length > 0 ? v : null))
  .refine((v) => v === null || parseYouTubeId(v) !== null, "bad_video_url");

const createSchema = z.object({
  slug: slugField,
  title: titleMap,
  excerpt: excerptMap,
  body: bodyMap,
  category: categoryField,
  readingMin: readingMinField.optional(),
  isPublished: z.boolean().default(false),
  publishedAt: isoDate.optional(),
  metaTitle: metaTitleField.optional(),
  metaDescription: metaDescriptionField.optional(),
  keywords: keywordsField.optional(),
  ads: adsField.optional(),
  coverImageUrl: coverUrlField.optional(),
  isFeatured: z.boolean().optional(),
  videoUrl: videoUrlField.optional(),
});

const updateSchema = z.object({
  id: z.string().uuid(),
  slug: slugField.optional(),
  title: titleMap.optional(),
  excerpt: excerptMap.optional(),
  body: bodyMap.optional(),
  category: categoryField.optional(),
  readingMin: readingMinField.optional(),
  isPublished: z.boolean().optional(),
  publishedAt: isoDate.optional(),
  metaTitle: metaTitleField.optional(),
  metaDescription: metaDescriptionField.optional(),
  keywords: keywordsField.optional(),
  ads: adsField.optional(),
  coverImageUrl: coverUrlField.optional(),
  isFeatured: z.boolean().optional(),
  videoUrl: videoUrlField.optional(),
});

/* PATCH (publication) — contrat historique conservé à l'identique. */
const patchSchema = z.object({
  id: z.string().uuid(),
  isPublished: z.boolean(),
});

/* ── Aides ───────────────────────────────────────────────────── */

/** Sérialise une carte {fr, en?…} en JSON compact (les clés absentes sont omises). */
function toStoreJson(map: Record<string, string | undefined>): string {
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(map)) {
    if (typeof v === "string" && v.length > 0) out[k] = v;
  }
  return JSON.stringify(out);
}

/** Estimation du temps de lecture : mots / 200, arrondi supérieur, borné [1, 60]. */
function estimateReadingMin(frBody: string): number {
  const words = frBody.trim().split(/\s+/).filter(Boolean).length;
  return Math.min(60, Math.max(1, Math.ceil(words / 200)));
}

/** Colonnes éditorial enrichi (DASH-5) pour create/update. Les champs non fournis
 * ne touchent pas à la base ; une chaîne vide remet à blanc (null). */
function editorialColumns(d: {
  coverImageUrl?: string | null;
  isFeatured?: boolean;
  videoUrl?: string | null;
}): Record<string, unknown> {
  const data: Record<string, unknown> = {};
  if (d.coverImageUrl !== undefined) data.coverImageUrl = d.coverImageUrl;
  if (d.isFeatured !== undefined) data.isFeatured = d.isFeatured;
  if (d.videoUrl !== undefined) data.videoUrl = d.videoUrl;
  return data;
}

/** AUTOPUSH — publication d'un article (transition false→true uniquement).
 * FIRE-AND-FORGET : ne bloque jamais la réponse, n'échoue jamais la requête. */
function notifyArticlePublished(prevPublished: boolean, nextPublished: boolean, frTitle: string, slug: string): void {
  if (!nextPublished || prevPublished) return;
  void notifyAll({
    title: "📰 Nouvel article",
    body: (frTitle || slug).slice(0, 120),
    url: `/blog/${slug}`,
    kind: "article",
  }).catch(() => {});
}

/** Titre français d'un post stocké en JSON (repli : texte brut puis slug). */
function frTitleOf(titleJson: string, slug: string): string {
  const map = parseLocaleJson(titleJson);
  return map.fr ?? Object.values(map)[0] ?? slug;
}

/** Colonnes SEO + adsJson pour create/update (DASH-3). Les champs non fournis
 * ne touchent pas à la base ; une chaîne vide remet le repli automatique (null). */
function seoColumns(d: {
  metaTitle?: string | null;
  metaDescription?: string | null;
  keywords?: string | null;
  ads?: PostAdInput[];
}): Record<string, unknown> {
  const data: Record<string, unknown> = {};
  if (d.metaTitle !== undefined) data.metaTitle = d.metaTitle;
  if (d.metaDescription !== undefined) data.metaDescription = d.metaDescription;
  if (d.keywords !== undefined) data.keywords = d.keywords;
  if (d.ads !== undefined) data.adsJson = stringifyAds(d.ads);
  return data;
}

function unauthorized() {
  return NextResponse.json({ ok: false, error: { code: "unauthorized" } }, { status: 401 });
}

function badJson() {
  return NextResponse.json({ ok: false, error: { code: "bad_json" } }, { status: 400 });
}

async function readJson(req: Request): Promise<unknown | null> {
  try {
    return await req.json();
  } catch {
    return null;
  }
}

/* ── GET — liste (contrat historique) ou détail ?id=… (édition) ── */

export async function GET(req: Request) {
  if (!(await isAdmin())) {
    return unauthorized();
  }
  try {
    const id = new URL(req.url).searchParams.get("id");
    if (id) {
      const p = await db.blogPost.findUnique({ where: { id } });
      if (!p) {
        return NextResponse.json({ ok: false, error: { code: "not_found" } }, { status: 404 });
      }
      return NextResponse.json({
        ok: true,
        data: {
          id: p.id,
          slug: p.slug,
          title: parseLocaleJson(p.title),
          excerpt: parseLocaleJson(p.excerpt),
          body: parseLocaleJson(p.body),
          category: p.category,
          readingMin: p.readingMin,
          isPublished: p.isPublished,
          publishedAt: p.publishedAt?.toISOString() ?? null,
          createdAt: p.createdAt.toISOString(),
          metaTitle: p.metaTitle,
          metaDescription: p.metaDescription,
          keywords: p.keywords,
          ads: parseAds(p.adsJson),
          coverImageUrl: p.coverImageUrl,
          isFeatured: p.isFeatured,
          videoUrl: p.videoUrl,
        },
      });
    }
    const rows = await db.blogPost.findMany({ orderBy: { createdAt: "desc" } });
    return NextResponse.json({
      ok: true,
      data: rows.map((p) => ({
        id: p.id,
        slug: p.slug,
        title: parseLocaleJson(p.title).fr ?? p.slug,
        category: p.category,
        readingMin: p.readingMin,
        isPublished: p.isPublished,
        publishedAt: p.publishedAt?.toISOString() ?? null,
        createdAt: p.createdAt.toISOString(),
        metaTitle: p.metaTitle,
        metaDescription: p.metaDescription,
        keywords: p.keywords,
        ads: parseAds(p.adsJson),
        coverImageUrl: p.coverImageUrl,
        isFeatured: p.isFeatured,
        videoUrl: p.videoUrl,
      })),
    });
  } catch (e) {
    console.error("[admin/posts]", e);
    return NextResponse.json({ ok: false, error: { code: "server" } }, { status: 500 });
  }
}

/* ── POST — création ─────────────────────────────────────────── */

export async function POST(req: Request) {
  if (!(await isAdmin())) {
    return unauthorized();
  }
  const body = await readJson(req);
  if (body === null) {
    return badJson();
  }
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: { code: "validation", fields: parsed.error.flatten().fieldErrors } },
      { status: 400 }
    );
  }
  const d = parsed.data;
  try {
    const clash = await db.blogPost.findUnique({ where: { slug: d.slug }, select: { id: true } });
    if (clash) {
      return NextResponse.json({ ok: false, error: { code: "slug_exists" } }, { status: 409 });
    }
    const post = await db.blogPost.create({
      data: {
        slug: d.slug,
        title: toStoreJson(d.title),
        excerpt: toStoreJson(d.excerpt),
        body: toStoreJson(d.body),
        category: d.category,
        readingMin: d.readingMin ?? estimateReadingMin(d.body.fr),
        isPublished: d.isPublished,
        publishedAt: d.publishedAt ? new Date(d.publishedAt) : d.isPublished ? new Date() : null,
        ...seoColumns(d),
        ...editorialColumns(d),
      },
    });
    /* AUTOPUSH — article créé directement publié (fire-and-forget). */
    notifyArticlePublished(false, post.isPublished, frTitleOf(post.title, post.slug), post.slug);
    return NextResponse.json({ ok: true, data: { id: post.id } }, { status: 201 });
  } catch (e) {
    console.error("[admin/posts POST]", e);
    return NextResponse.json({ ok: false, error: { code: "server" } }, { status: 500 });
  }
}

/* ── PUT — mise à jour par id (remplace l'objet entier par locale) ── */

export async function PUT(req: Request) {
  if (!(await isAdmin())) {
    return unauthorized();
  }
  const body = await readJson(req);
  if (body === null) {
    return badJson();
  }
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: { code: "validation", fields: parsed.error.flatten().fieldErrors } },
      { status: 400 }
    );
  }
  const d = parsed.data;
  try {
    const existing = await db.blogPost.findUnique({ where: { id: d.id } });
    if (!existing) {
      return NextResponse.json({ ok: false, error: { code: "not_found" } }, { status: 404 });
    }
    if (d.slug && d.slug !== existing.slug) {
      const clash = await db.blogPost.findUnique({
        where: { slug: d.slug },
        select: { id: true },
      });
      if (clash) {
        return NextResponse.json({ ok: false, error: { code: "slug_exists" } }, { status: 409 });
      }
    }
    const data: Record<string, unknown> = {};
    if (d.slug !== undefined) data.slug = d.slug;
    if (d.title !== undefined) data.title = toStoreJson(d.title);
    if (d.excerpt !== undefined) data.excerpt = toStoreJson(d.excerpt);
    if (d.body !== undefined) {
      data.body = toStoreJson(d.body);
      /* Le temps de lecture suit le texte s'il n'est pas fixé explicitement. */
      if (d.readingMin === undefined) data.readingMin = estimateReadingMin(d.body.fr);
    }
    if (d.readingMin !== undefined) data.readingMin = d.readingMin;
    if (d.category !== undefined) data.category = d.category;
    if (d.isPublished !== undefined) {
      data.isPublished = d.isPublished;
      if (d.isPublished && d.publishedAt === undefined && !existing.publishedAt) {
        data.publishedAt = new Date();
      }
    }
    if (d.publishedAt !== undefined) data.publishedAt = new Date(d.publishedAt);
    Object.assign(data, seoColumns(d));
    Object.assign(data, editorialColumns(d));
    const post = await db.blogPost.update({ where: { id: d.id }, data });
    /* AUTOPUSH — transition false→true via l'enregistrement complet. */
    notifyArticlePublished(existing.isPublished, post.isPublished, frTitleOf(post.title, post.slug), post.slug);
    return NextResponse.json({ ok: true, data: { id: post.id } });
  } catch (e) {
    console.error("[admin/posts PUT]", e);
    return NextResponse.json({ ok: false, error: { code: "server" } }, { status: 500 });
  }
}

/* ── PATCH — publication / masquage (contrat historique) ─────── */

export async function PATCH(req: Request) {
  if (!(await isAdmin())) {
    return unauthorized();
  }
  const body = await readJson(req);
  if (body === null) {
    return badJson();
  }
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: { code: "validation" } }, { status: 400 });
  }
  try {
    const existing = await db.blogPost.findUnique({
      where: { id: parsed.data.id },
      select: { isPublished: true },
    });
    if (!existing) {
      return NextResponse.json({ ok: false, error: { code: "not_found" } }, { status: 404 });
    }
    const post = await db.blogPost.update({
      where: { id: parsed.data.id },
      data: {
        isPublished: parsed.data.isPublished,
        ...(parsed.data.isPublished ? { publishedAt: new Date() } : {}),
      },
    });
    /* AUTOPUSH — transition false→true (contrat historique conservé). */
    notifyArticlePublished(existing.isPublished, post.isPublished, frTitleOf(post.title, post.slug), post.slug);
    return NextResponse.json({ ok: true, data: { id: post.id, isPublished: post.isPublished } });
  } catch (e) {
    console.error("[admin/posts PATCH]", e);
    return NextResponse.json({ ok: false, error: { code: "server" } }, { status: 500 });
  }
}

/* ── DELETE — suppression définitive par ?id=… ───────────────── */

export async function DELETE(req: Request) {
  if (!(await isAdmin())) {
    return unauthorized();
  }
  const id = new URL(req.url).searchParams.get("id");
  if (!id) {
    return NextResponse.json({ ok: false, error: { code: "validation" } }, { status: 400 });
  }
  try {
    const existing = await db.blogPost.findUnique({ where: { id }, select: { id: true } });
    if (!existing) {
      return NextResponse.json({ ok: false, error: { code: "not_found" } }, { status: 404 });
    }
    await db.blogPost.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[admin/posts DELETE]", e);
    return NextResponse.json({ ok: false, error: { code: "server" } }, { status: 500 });
  }
}
