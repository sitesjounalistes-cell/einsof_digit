import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { parseLocaleJson } from "@/lib/locale-json";

export const dynamic = "force-dynamic";

/** Articles du Journal publiés (spécification §23 : /blog). */
export async function GET() {
  try {
    const rows = await db.blogPost.findMany({
      where: { isPublished: true },
      orderBy: [{ publishedAt: "desc" }],
      take: 12,
    });
    return NextResponse.json({
      ok: true,
      data: rows.map((p) => ({
        id: p.id,
        slug: p.slug,
        title: parseLocaleJson(p.title),
        excerpt: parseLocaleJson(p.excerpt),
        body: parseLocaleJson(p.body),
        category: p.category,
        readingMin: p.readingMin,
        publishedAt: p.publishedAt?.toISOString() ?? null,
      })),
    });
  } catch (e) {
    console.error("[posts]", e);
    return NextResponse.json({ ok: false, error: { code: "server" } }, { status: 500 });
  }
}
