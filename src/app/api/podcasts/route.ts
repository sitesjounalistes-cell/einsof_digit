import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { parseLocaleJson } from "@/lib/locale-json";

export const dynamic = "force-dynamic";

/**
 * Podcast public (spéc. §23 / §26) — épisodes publiés, triés par date de
 * publication décroissante puis ordre éditorial croissant.
 * Parsing défensif : jamais d'exception si un JSON locale est malformé.
 */
export async function GET() {
  try {
    const rows = await db.podcast.findMany({
      where: { isPublished: true },
      orderBy: [{ publishedAt: "desc" }, { sortOrder: "asc" }],
    });
    return NextResponse.json({
      ok: true,
      data: rows.map((p) => {
        const titleMap = parseLocaleJson(p.titleJson);
        const descMap = parseLocaleJson(p.descriptionJson);
        return {
          id: p.id,
          slug: p.slug,
          /* Repli fr → en → première langue disponible → slug */
          title:
            titleMap.fr ??
            titleMap.en ??
            Object.values(titleMap)[0] ??
            p.slug,
          description:
            descMap.fr ??
            descMap.en ??
            Object.values(descMap)[0] ??
            "",
          audioUrl: p.audioUrl,
          durationSec: p.durationSec,
          coverImageUrl: p.coverImageUrl,
          publishedAt: p.publishedAt?.toISOString() ?? null,
        };
      }),
    });
  } catch (e) {
    console.error("[podcasts]", e);
    return NextResponse.json({ ok: false, error: { code: "server" } }, { status: 500 });
  }
}
