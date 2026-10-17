/**
 * Carte du site multi-pages (architecture « multipage » demandée par le client).
 * Source de vérité unique : navbar, footer, hub de la page d'accueil,
 * navigation du chatbot et liens croisés y font référence.
 */

export interface PageDef {
  /** identifiant stable (analytics, chatbot, hub) */
  id: string;
  /** route Next.js */
  path: string;
  /** libellé français par défaut (les traductions complètes sont dans nav.* / pages.*) */
  fr: string;
}

export const PAGES: PageDef[] = [
  { id: "home", path: "/", fr: "Accueil" },
  { id: "services", path: "/services", fr: "Services" },
  { id: "logiciels", path: "/logiciels", fr: "Logiciels SaaS" },
  { id: "secteurs", path: "/secteurs", fr: "Secteurs" },
  { id: "methode", path: "/methode", fr: "Méthode" },
  { id: "tarifs", path: "/tarifs", fr: "Tarifs" },
  { id: "realisations", path: "/realisations", fr: "Réalisations" },
  { id: "blog", path: "/blog", fr: "Journal" },
  { id: "podcast", path: "/podcast", fr: "Podcast" },
  { id: "zones", path: "/zones", fr: "Zones d'intervention" },
  { id: "a-propos", path: "/a-propos", fr: "À propos" },
  { id: "faq", path: "/faq", fr: "FAQ" },
  { id: "contact", path: "/contact", fr: "Contact" },
];

export const PAGE_IDS = PAGES.map((p) => p.id);

export function pageByPath(path: string): PageDef | undefined {
  return PAGES.find((p) => p.path === path);
}

export function pageById(id: string): PageDef | undefined {
  return PAGES.find((p) => p.id === id);
}

/**
 * Correspondance section → page/anchor pour la navigation du chatbot
 * (outil `navigate`) et les liens profonds. Les identifiants de section
 * restent stables (compatibilité API §25).
 */
export const SECTION_ROUTES: Record<string, { page: string; anchor?: string }> = {
  hero: { page: "/" },
  stats: { page: "/", anchor: "stats" },
  services: { page: "/services" },
  pillars: { page: "/services", anchor: "pillars" },
  saas: { page: "/logiciels" },
  trial: { page: "/logiciels", anchor: "trial" },
  sectors: { page: "/secteurs" },
  process: { page: "/methode" },
  pricing: { page: "/tarifs" },
  faq: { page: "/faq" },
  about: { page: "/a-propos" },
  documents: { page: "/a-propos", anchor: "documents" },
  projects: { page: "/realisations" },
  partners: { page: "/realisations", anchor: "partners" },
  testimonials: { page: "/realisations", anchor: "testimonials" },
  journal: { page: "/blog" },
  contact: { page: "/contact" },
};
