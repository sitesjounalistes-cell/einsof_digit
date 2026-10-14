import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

/**
 * Partenaires actifs (spec §23 — section « confiance »).
 * Règle §20.4 : la section reste masquée tant qu'aucun partenaire n'est actif.
 */
export async function GET() {
  try {
    const rows = await db.partner.findMany({
      where: { isActive: true },
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    });
    return NextResponse.json({
      ok: true,
      data: rows.map((p) => ({
        id: p.id,
        name: p.name,
        logoUrl: p.logoUrl,
        websiteUrl: p.websiteUrl,
        description: p.description,
      })),
    });
  } catch (e) {
    console.error("[partners]", e);
    return NextResponse.json({ ok: false, error: { code: "server" } }, { status: 500 });
  }
}
