/**
 * Carte de navigation complète du site pour le chatbot — « contrôle total » :
 * le modèle peut envoyer le visiteur vers N'IMPORTE QUELLE page du site
 * (accueil, pages de pôles, pages logiciels, secteurs, zones, tarifs,
 * réalisations, podcast…) en temps réel via l'action navigate { path: "..." }.
 *
 * Source de vérité : lib/routes.ts (PAGES) + catalogue (services, SaaS)
 * + pages secteurs (SECTOR_SEO). Audit F-09 (17/10/2026) : /zones et les
 * 14 pages /secteurs/[slug] sont désormais navigables (auparavant filtrées
 * silencieusement par isValidSitePath alors que le prompt promettait
 * « emmène le visiteur PARTOUT »).
 */

import { SAAS_PRODUCTS } from "@/lib/catalog";
import { SERVICE_SLUGS, getServiceNameFr } from "@/lib/pages-content/service-details";
import { getSaasNameFr } from "@/lib/pages-content/saas-details";
import { SECTOR_SEO } from "@/lib/seo";
import { PAGES } from "@/lib/routes";
import { BRAND } from "@/lib/brand";

export interface SiteRoute {
  /** chemin exact attendu dans l'action navigate */
  path: string;
  /** libellé français (compris par le modèle) */
  label: string;
  /** mots-clés qui aident le modèle à choisir la bonne page */
  hint?: string;
}

/** Pages statiques — dérivées de la carte du site (lib/routes.ts). */
const STATIC_PAGES: SiteRoute[] = PAGES.filter((p) => p.id !== "home").map((p) => ({
  path: p.path,
  label: p.fr,
}));

/** Pages de pôles — /services/[slug]. */
const SERVICE_PAGES: SiteRoute[] = SERVICE_SLUGS.map((slug) => ({
  path: `/services/${slug}`,
  label: `Pôle ${getServiceNameFr(slug) ?? slug}`,
  hint: slug,
}));

/** Pages produits — /logiciels/[slug]. */
const SAAS_PAGES: SiteRoute[] = SAAS_PRODUCTS.map((p) => ({
  path: `/logiciels/${p.slug}`,
  label: `Logiciel ${p.name}`,
  hint: p.slug,
}));

/** Pages secteurs — /secteurs/[slug] (SEO longue traîne par métier). */
const SECTOR_PAGES: SiteRoute[] = SECTOR_SEO.map((s) => ({
  path: `/secteurs/${s.slug}`,
  label: `Secteur ${s.name}`,
  hint: s.slug,
}));

export const SITE_ROUTES: SiteRoute[] = [
  { path: "/", label: "Accueil" },
  ...STATIC_PAGES,
  ...SERVICE_PAGES,
  ...SAAS_PAGES,
  ...SECTOR_PAGES,
];

export const SITE_ROUTE_PATHS = SITE_ROUTES.map((r) => r.path);

export function isValidSitePath(path: string): boolean {
  return SITE_ROUTE_PATHS.includes(path);
}

/** Liste lisible pour le prompt système. */
export function siteRoutesForPrompt(): string {
  return SITE_ROUTES.map((r) => `- ${r.path} → ${r.label}${r.hint ? ` (${r.hint})` : ""}`).join("\n");
}

/** Marque (jamais en dur — audit F-05). */
export const SITE_BRAND = BRAND;
