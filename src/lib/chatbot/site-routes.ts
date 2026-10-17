/**
 * Carte de navigation complète du site pour le chatbot — « contrôle total » :
 * le modèle peut envoyer le visiteur vers N'IMPORTE QUELLE page du site
 * (accueil, pages de pôles, pages logiciels, tarifs, réalisations…)
 * en temps réel via l'action navigate { path: "..." }.
 *
 * Source de vérité : lib/routes.ts (PAGES) + catalogue (services, SaaS).
 */

import { SAAS_PRODUCTS } from "@/lib/catalog";
import { SERVICE_SLUGS, getServiceNameFr } from "@/lib/pages-content/service-details";
import { getSaasNameFr } from "@/lib/pages-content/saas-details";
import { PAGES } from "@/lib/routes";

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

export const SITE_ROUTES: SiteRoute[] = [
  { path: "/", label: "Accueil" },
  ...STATIC_PAGES,
  /* Podcast — page éditée par un autre chantier (PAGES pas encore à jour) :
     déclarée ici pour que le chatbot puisse y emmener le visiteur et
     s'en servir comme preuve d'expertise (audios sur le digital et la
     vente en Guinée). */
  { path: "/podcast", label: "Podcast EINSOF", hint: "podcast audio digital vente guinée" },
  ...SERVICE_PAGES,
  ...SAAS_PAGES,
];

export const SITE_ROUTE_PATHS = SITE_ROUTES.map((r) => r.path);

export function isValidSitePath(path: string): boolean {
  return SITE_ROUTE_PATHS.includes(path);
}

/** Liste lisible pour le prompt système. */
export function siteRoutesForPrompt(): string {
  return SITE_ROUTES.map((r) => `- ${r.path} → ${r.label}`).join("\n");
}
