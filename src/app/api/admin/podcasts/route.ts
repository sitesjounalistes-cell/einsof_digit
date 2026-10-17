import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { isAdmin } from "@/lib/admin-auth";
import { toPlayableAudioUrl } from "@/lib/drive";
import { notifyAll } from "@/lib/push-notify";
import { BRAND } from "@/lib/brand";

/**
 * Podcasts — CRUD complet pour l'Espace équipe.
 *
 * Le gérant colle un lien Google Drive (ou une URL audio directe) :
 * `toPlayableAudioUrl` le convertit en URL jouable par <audio> et le résultat
 * est stocké dans audioUrl (le lien d'origine est conservé dans sourceUrl).
 * Le slug est dérivé du titre avec unicité garantie (base-2, base-3…).
 * La première publication (PATCH false→true, publishedAt null) déclenche une
 * notification push FIRE-AND-FORGET — elle ne peut jamais faire échouer la
 * requête d'écriture.
 *
 * Enveloppe { ok, data | error } ; 401 sans session, 400 validation, 404 inconnu.
 */

/* ── Schémas zod ─────────────────────────────────────────────── */

const titleFrField = z.string().trim().min(2, "title_too_short").max(160, "title_too_long");

const descriptionFrField = z
  .string()
  .trim()
  .max(2000, "description_too_long")
  .transform((v) => (v.length > 0 ? v : null));

/** Lien source : https obligatoire (Drive ou audio direct). */
const sourceUrlField = z
  .string()
  .trim()
  .min(8, "source_url_required")
  .max(600, "source_url_too_long")
  .refine((v) => /^https:\/\//i.test(v), "source_url_https");

/** Image de couverture : chemin interne (/uploads/…) ou https. */
const coverUrlField = z
  .string()
  .trim()
  .max(600)
  .refine(
    (v) => v === "" || v.startsWith("/") || /^https:\/\//i.test(v),
    "bad_cover_url"
  )
  .transform((v) => (v.length > 0 ? v : null));

const durationSecField = z.coerce
  .number()
  .int("bad_duration")
  .min(0, "bad_duration")
  .max(86400, "bad_duration")
  .nullable()
  .optional();

const sortOrderField = z.coerce.number().int().min(0).max(999).optional();

const createSchema = z.object({
  titleFr: titleFrField,
  descriptionFr: descriptionFrField.optional(),
  sourceUrl: sourceUrlField,
  durationSec: durationSecField,
  coverImageUrl: coverUrlField.optional(),
  sortOrder: sortOrderField,
  isPublished: z.boolean().default(false),
});

const patchSchema = z.object({
  id: z.string().min(10),
  titleFr: titleFrField.optional(),
  descriptionFr: descriptionFrField.optional(),
  sourceUrl: sourceUrlField.optional(),
  durationSec: durationSecField,
  coverImageUrl: coverUrlField.optional(),
  sortOrder: sortOrderField,
  isPublished: z.boolean().optional(),
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
      .slice(0, 80) || `podcast-${Date.now().toString(36)}`
  );
}

/** Slug unique en base : base, base-2, base-3… */
async function uniquePodcastSlug(base: string): Promise<string> {
  const root = slugify(base);
  let candidate = root;
  let n = 2;
  for (;;) {
    const clash = await db.podcast.findUnique({ where: { slug: candidate }, select: { id: true } });
    if (!clash) return candidate;
    candidate = `${root}-${n}`;
    n += 1;
  }
}

/** Lit le titre français stocké en titleJson (repli : slug). */
function frTitleOf(titleJson: string, slug: string): string {
  try {
    const map: unknown = JSON.parse(titleJson);
    if (map && typeof map === "object" && !Array.isArray(map)) {
      const fr = (map as Record<string, unknown>).fr;
      if (typeof fr === "string" && fr) return fr;
    }
  } catch {
    /* JSON corrompu : repli slug */
  }
  return slug;
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

/* ── GET — tous les podcasts (tri ordre puis création récente) ── */

export async function GET() {
  if (!(await isAdmin())) {
    return unauthorized();
  }
  try {
    const rows = await db.podcast.findMany({
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    });
    return NextResponse.json({
      ok: true,
      data: rows.map((p) => ({
        id: p.id,
        slug: p.slug,
        title: frTitleOf(p.titleJson, p.slug),
        description: p.descriptionJson,
        audioUrl: p.audioUrl,
        sourceUrl: p.sourceUrl,
        durationSec: p.durationSec,
        coverImageUrl: p.coverImageUrl,
        isPublished: p.isPublished,
        publishedAt: p.publishedAt?.toISOString() ?? null,
        sortOrder: p.sortOrder,
        createdAt: p.createdAt.toISOString(),
      })),
    });
  } catch (e) {
    console.error("[admin/podcasts GET]", e);
    return NextResponse.json({ ok: false, error: { code: "server" } }, { status: 500 });
  }
}

/* ── POST — création (sourceUrl convertie en audioUrl) ───────── */

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
  const d = parsed.data;

  const audioUrl = toPlayableAudioUrl(d.sourceUrl);
  if (!audioUrl) {
    return NextResponse.json({ ok: false, error: { code: "bad_source_url" } }, { status: 400 });
  }

  try {
    const slug = await uniquePodcastSlug(d.titleFr);
    const podcast = await db.podcast.create({
      data: {
        slug,
        titleJson: JSON.stringify({ fr: d.titleFr }),
        descriptionJson: d.descriptionFr ?? null,
        audioUrl,
        sourceUrl: d.sourceUrl,
        durationSec: d.durationSec ?? null,
        coverImageUrl: d.coverImageUrl ?? null,
        isPublished: d.isPublished,
        publishedAt: d.isPublished ? new Date() : null,
        sortOrder: d.sortOrder ?? 0,
      },
    });
    /* Audit F-10 : création directe publiée → notification push, comme
       via le PATCH false→true (comportement symétrique avec les articles). */
    if (d.isPublished) {
      void notifyAll({
        title: `🎙️ Nouveau podcast`,
        body: d.titleFr.slice(0, 120),
        url: "/podcast",
        kind: "podcast",
      }).catch(() => {});
    }
    return NextResponse.json(
      { ok: true, data: { id: podcast.id, slug: podcast.slug } },
      { status: 201 }
    );
  } catch (e) {
    console.error("[admin/podcasts POST]", e);
    return NextResponse.json({ ok: false, error: { code: "server" } }, { status: 500 });
  }
}

/* ── PATCH — mise à jour de tous les champs par id ───────────── */

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
  const {
    id,
    titleFr,
    descriptionFr,
    sourceUrl,
    durationSec,
    coverImageUrl,
    sortOrder,
    isPublished,
  } = parsed.data;
  try {
    const existing = await db.podcast.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ ok: false, error: { code: "not_found" } }, { status: 404 });
    }

    const data: Record<string, unknown> = {};
    if (titleFr !== undefined) {
      data.titleJson = JSON.stringify({ fr: titleFr });
      data.slug = await uniquePodcastSlug(titleFr);
    }
    if (descriptionFr !== undefined) data.descriptionJson = descriptionFr;
    if (sourceUrl !== undefined) {
      const audioUrl = toPlayableAudioUrl(sourceUrl);
      if (!audioUrl) {
        return NextResponse.json({ ok: false, error: { code: "bad_source_url" } }, { status: 400 });
      }
      data.audioUrl = audioUrl;
      data.sourceUrl = sourceUrl;
    }
    if (durationSec !== undefined) data.durationSec = durationSec;
    if (coverImageUrl !== undefined) data.coverImageUrl = coverImageUrl;
    if (sortOrder !== undefined) data.sortOrder = sortOrder;

    /* Toggle publication : première mise en ligne (publishedAt null) → push. */
    let shouldNotify = false;
    if (isPublished !== undefined) {
      data.isPublished = isPublished;
      if (isPublished && !existing.publishedAt) {
        data.publishedAt = new Date();
      }
      shouldNotify = isPublished && !existing.isPublished && existing.publishedAt === null;
    }

    const podcast = await db.podcast.update({ where: { id }, data });

    if (shouldNotify) {
      /* FIRE-AND-FORGET — ne bloque jamais la réponse, n'échoue jamais la requête. */
      void notifyAll({
        title: `🎙️ Nouveau podcast ${BRAND}`,
        body: frTitleOf(podcast.titleJson, podcast.slug).slice(0, 120),
        url: "/podcast",
        kind: "podcast",
      }).catch(() => {});
    }

    return NextResponse.json({ ok: true, data: { id: podcast.id, slug: podcast.slug } });
  } catch (e) {
    console.error("[admin/podcasts PATCH]", e);
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
    await db.podcast.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (e) {
    if ((e as { code?: string }).code === "P2025") {
      return NextResponse.json({ ok: false, error: { code: "not_found" } }, { status: 404 });
    }
    console.error("[admin/podcasts DELETE]", e);
    return NextResponse.json({ ok: false, error: { code: "server" } }, { status: 500 });
  }
}
