import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { parseLocaleJson } from "@/lib/locale-json";

export const dynamic = "force-dynamic";

/**
 * Documents publiés et visibles publiquement (spec §24 — ressources).
 * Les documents « lead » et « team » ne sont JAMAIS listés ici.
 * Règle §20.4 : la section reste masquée tant que rien n'est publié.
 */
export async function GET() {
  try {
    const rows = await db.document.findMany({
      where: { isPublished: true, visibility: "public" },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
      take: 24,
    });
    return NextResponse.json({
      ok: true,
      data: rows.map((d) => ({
        id: d.id,
        slug: d.slug,
        title: parseLocaleJson(d.title),
        description: parseLocaleJson(d.description ?? null),
        category: d.category,
        fileUrl: d.fileUrl,
        fileKind: d.fileKind,
      })),
    });
  } catch (e) {
    console.error("[documents]", e);
    return NextResponse.json({ ok: false, error: { code: "server" } }, { status: 500 });
  }
}
