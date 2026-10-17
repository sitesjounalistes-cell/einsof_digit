import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { SAAS_SLUGS } from "@/lib/catalog";

/**
 * Liens publics par logiciel SaaS — alimente les pages détail
 * (vidéo YouTube + bouton « Ouvrir le logiciel ») et les badges
 * des cartes de la section Logiciels.
 * Toujours frais (force-dynamic) : les liens sont édités dans l'Espace équipe.
 */

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const rows = await db.softwareLink.findMany({ where: { slug: { in: [...SAAS_SLUGS] } } });
    const bySlug = new Map(rows.map((r) => [r.slug, r]));
    const data: Record<string, { demoUrl: string | null; videoUrl: string | null }> = {};
    for (const slug of SAAS_SLUGS) {
      const row = bySlug.get(slug);
      data[slug] = { demoUrl: row?.demoUrl ?? null, videoUrl: row?.videoUrl ?? null };
    }
    return NextResponse.json({ ok: true, data });
  } catch (e) {
    console.error("[software-links GET]", e);
    return NextResponse.json({ ok: false, error: { code: "server" } }, { status: 500 });
  }
}
