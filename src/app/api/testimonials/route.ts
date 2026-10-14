import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { parseLocaleJson } from "@/lib/locale-json";

export const dynamic = "force-dynamic";

/**
 * Témoignages publiés (spec §23 — section « confiance »).
 * Règle §20.4 : la section reste masquée tant que rien n'est publié.
 * Le rating est une donnée réelle saisie par l'équipe, jamais inventée.
 */
export async function GET() {
  try {
    const rows = await db.testimonial.findMany({
      where: { isPublished: true },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
      take: 12,
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
      })),
    });
  } catch (e) {
    console.error("[testimonials]", e);
    return NextResponse.json({ ok: false, error: { code: "server" } }, { status: 500 });
  }
}
