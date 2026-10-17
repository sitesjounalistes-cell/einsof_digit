import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { isAdmin } from "@/lib/admin-auth";
import { parseLocaleJson } from "@/lib/locale-json";
import { parseYouTubeId } from "@/lib/youtube";

/** Témoignages : CRUD complet pour l'équipe (H-08 — données réelles du client). */

const quoteSchema = z.object({
  fr: z.string().trim().min(10).max(600),
  en: z.string().trim().min(10).max(600).optional(),
  es: z.string().trim().min(10).max(600).optional(),
  zh: z.string().trim().min(10).max(600).optional(),
  de: z.string().trim().min(10).max(600).optional(),
});

const optional120 = z.string().trim().max(120).optional();

/* ── Photo + vidéo de l'auteur (DASH-5) — chaîne vide = remise à blanc ── */
const photoUrlField = z
  .string()
  .trim()
  .max(600, "photo_too_long")
  .transform((v) => (v.length > 0 ? v : null))
  .refine(
    (v) => v === null || v.startsWith("/") || /^https:\/\//i.test(v),
    "bad_photo_url"
  );
const videoUrlField = z
  .string()
  .trim()
  .max(500, "video_too_long")
  .transform((v) => (v.length > 0 ? v : null))
  .refine((v) => v === null || parseYouTubeId(v) !== null, "bad_video_url");

const createSchema = z.object({
  authorName: z.string().trim().min(2).max(120),
  authorRole: optional120,
  company: optional120,
  sector: optional120,
  quote: quoteSchema,
  rating: z.coerce.number().int().min(1).max(5).nullable().optional(),
  sortOrder: z.coerce.number().int().min(0).max(999).default(0),
  isPublished: z.boolean().default(false),
  authorPhotoUrl: photoUrlField.optional(),
  videoUrl: videoUrlField.optional(),
});

const putSchema = z.object({
  id: z.string().uuid(),
  authorName: z.string().trim().min(2).max(120).optional(),
  authorRole: z.string().trim().max(120).nullable().optional(),
  company: z.string().trim().max(120).nullable().optional(),
  sector: z.string().trim().max(120).nullable().optional(),
  quote: quoteSchema.optional(),
  rating: z.coerce.number().int().min(1).max(5).nullable().optional(),
  sortOrder: z.coerce.number().int().min(0).max(999).optional(),
  isPublished: z.boolean().optional(),
  authorPhotoUrl: photoUrlField.nullable().optional(),
  videoUrl: videoUrlField.nullable().optional(),
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
    const rows = await db.testimonial.findMany({
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    });
    return NextResponse.json({
      ok: true,
      data: rows.map((r) => ({
        id: r.id,
        authorName: r.authorName,
        authorRole: r.authorRole,
        company: r.company,
        sector: r.sector,
        quote: parseLocaleJson(r.quote),
        rating: r.rating,
        authorPhotoUrl: r.authorPhotoUrl,
        videoUrl: r.videoUrl,
        sortOrder: r.sortOrder,
        isPublished: r.isPublished,
        createdAt: r.createdAt,
      })),
    });
  } catch (e) {
    console.error("[admin/testimonials]", e);
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
    const testimonial = await db.testimonial.create({
      data: {
        authorName: d.authorName,
        authorRole: clean(d.authorRole),
        company: clean(d.company),
        sector: clean(d.sector),
        quote: JSON.stringify(d.quote),
        rating: d.rating ?? null,
        authorPhotoUrl: d.authorPhotoUrl ?? null,
        videoUrl: d.videoUrl ?? null,
        sortOrder: d.sortOrder,
        isPublished: d.isPublished,
      },
    });
    return NextResponse.json({ ok: true, data: { id: testimonial.id } }, { status: 201 });
  } catch (e) {
    console.error("[admin/testimonials POST]", e);
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
    const { id, authorRole, company, sector, quote, rating, authorPhotoUrl, videoUrl, ...rest } =
      parsed.data;
    const data: Record<string, unknown> = { ...rest };
    if (authorRole !== undefined) data.authorRole = clean(authorRole);
    if (company !== undefined) data.company = clean(company);
    if (sector !== undefined) data.sector = clean(sector);
    if (quote !== undefined) data.quote = JSON.stringify(quote);
    if (rating !== undefined) data.rating = rating;
    if (authorPhotoUrl !== undefined) data.authorPhotoUrl = authorPhotoUrl;
    if (videoUrl !== undefined) data.videoUrl = videoUrl;
    const testimonial = await db.testimonial.update({ where: { id }, data });
    return NextResponse.json({ ok: true, data: { id: testimonial.id } });
  } catch (e) {
    if ((e as { code?: string }).code === "P2025") {
      return NextResponse.json({ ok: false, error: { code: "not_found" } }, { status: 404 });
    }
    console.error("[admin/testimonials PUT]", e);
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
    await db.testimonial.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (e) {
    if ((e as { code?: string }).code === "P2025") {
      return NextResponse.json({ ok: false, error: { code: "not_found" } }, { status: 404 });
    }
    console.error("[admin/testimonials DELETE]", e);
    return NextResponse.json({ ok: false, error: { code: "server" } }, { status: 500 });
  }
}
