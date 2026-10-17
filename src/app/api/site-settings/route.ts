import { NextResponse } from "next/server";
import { getSiteSettings } from "@/lib/site-settings";
import { DEFAULT_SITE_SETTINGS } from "@/lib/site-settings-defaults";

/**
 * Réglages publics du site (téléphones, e-mails, réseaux sociaux,
 * mot du gérant) — GET ouvert à tous. Renvoie TOUJOURS un objet
 * complet (valeurs par défaut si la table est vide).
 */
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const data = await getSiteSettings();
    return NextResponse.json({ ok: true, data });
  } catch {
    // Même en cas d'erreur imprévue : défauts (le bloc public s'affiche toujours).
    return NextResponse.json({ ok: true, data: DEFAULT_SITE_SETTINGS });
  }
}
