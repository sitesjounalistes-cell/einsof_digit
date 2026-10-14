import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { parseLocaleJson } from "@/lib/locale-json";

export const dynamic = "force-dynamic";

/**
 * Réalisations publiées (spécification §23 : /realisations).
 * Règle §20.4 : la section reste masquée tant que rien n'est publié.
 */
export async function GET() {
  try {
    const rows = await db.project.findMany({
      where: { isPublished: true },
      orderBy: [{ sortOrder: "asc" }, { year: "desc" }],
      take: 12,
    });
    return NextResponse.json({
      ok: true,
      data: rows.map((p) => ({
        id: p.id,
        slug: p.slug,
        title: parseLocaleJson(p.title),
        client: p.client,
        sector: p.sector,
        year: p.year,
        summary: parseLocaleJson(p.summary),
        description: parseLocaleJson(p.description ?? null),
        linkUrl: p.linkUrl,
      })),
    });
  } catch (e) {
    console.error("[projects]", e);
    return NextResponse.json({ ok: false, error: { code: "server" } }, { status: 500 });
  }
}
