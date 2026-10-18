import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { parseLocaleJson } from "@/lib/locale-json";

export const dynamic = "force-dynamic";

/** Articles du Journal publiés (spécification §23 : /blog).
 *  Publication planifiée : un article avec publishedAt dans le futur reste
 *  invisible jusqu'à sa date (calendrier éditorial 3 articles/semaine). */
export async function GET() {
  try {
    const rows = await db.blogPost.findMany({
      where: {
        isPublished: true,
        OR: [{ publishedAt: null }, { publishedAt: { lte: new Date() } }],
      },
      orderBy: [{ publishedAt: "desc" }],
      take: 60,
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
        /* Éditorial enrichi : couverture, mise en avant, vidéo YouTube */
        coverImageUrl: p.coverImageUrl,
        isFeatured: p.isFeatured,
        videoUrl: p.videoUrl,
      })),
    });
  } catch (e) {
    console.error("[posts]", e);
    return NextResponse.json({ ok: false, error: { code: "server" } }, { status: 500 });
  }
}
