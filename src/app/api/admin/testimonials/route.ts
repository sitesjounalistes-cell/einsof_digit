import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { isAdmin } from "@/lib/admin-auth";
import { parseLocaleJson } from "@/lib/locale-json";

/** Témoignages : CRUD complet pour l'équipe (H-08 — données réelles du client). */

const quoteSchema = z.object({
  fr: z.string().trim().min(10).max(600),
  en: z.string().trim().min(10).max(600).optional(),
  es: z.string().trim().min(10).max(600).optional(),
  zh: z.string().trim().min(10).max(600).optional(),
  de: z.string().trim().min(10).max(600).optional(),
});

const optional120 = z.string().trim().max(120).optional();

const createSchema = z.object({
  authorName: z.string().trim().min(2).max(120),
  authorRole: optional120,
  company: optional120,
  sector: optional120,
  quote: quoteSchema,
  rating: z.coerce.number().int().min(1).max(5).nullable().optional(),
  sortOrder: z.coerce.number().int().min(0).max(999).default(0),
  isPublished: z.boolean().default(false),
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
    const { id, authorRole, company, sector, quote, rating, ...rest } = parsed.data;
    const data: Record<string, unknown> = { ...rest };
    if (authorRole !== undefined) data.authorRole = clean(authorRole);
    if (company !== undefined) data.company = clean(company);
    if (sector !== undefined) data.sector = clean(sector);
    if (quote !== undefined) data.quote = JSON.stringify(quote);
    if (rating !== undefined) data.rating = rating;
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
