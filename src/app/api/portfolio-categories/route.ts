import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { parseLocaleJson } from "@/lib/locale-json";

export const dynamic = "force-dynamic";

/**
 * Catégories des réalisations (public) — filtres de la section Travaux.
 * Renvoie : id, slug, name (JSON nameJson parsé, repli fr côté client via
 * pickLocale) et count = nombre de projets PUBLIÉS rattachés.
 * Tri : sortOrder asc. Parsing défensif : une catégorie au nameJson corrompu
 * reste listée (name {}) sans faire échouer la réponse.
 */
export async function GET() {
  try {
    const rows = await db.portfolioCategory.findMany({
      orderBy: { sortOrder: "asc" },
      include: {
        _count: {
          select: {
            projects: { where: { isPublished: true } },
          },
        },
      },
    });
    return NextResponse.json({
      ok: true,
      data: rows.map((c) => ({
        id: c.id,
        slug: c.slug,
        name: parseLocaleJson(c.nameJson),
        count: c._count.projects,
      })),
    });
  } catch (e) {
    console.error("[portfolio-categories]", e);
    return NextResponse.json({ ok: false, error: { code: "server" } }, { status: 500 });
  }
}
