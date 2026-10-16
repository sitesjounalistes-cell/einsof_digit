/**
 * Contenu détaillé d'une page de service /services/[slug].
 * Chaque pôle possède sa page propre : vue d'ensemble, ce qui est
 * inclus, méthode, pour qui, tarif de référence et appel à l'action.
 * Les montants ne sont JAMAIS écrits ici : ils viennent du catalogue
 * officiel (src/lib/catalog.ts) via `priceRef`.
 */

export type ServiceSlug =
  | "web"
  | "software"
  | "saas"
  | "community"
  | "acquisition"
  | "training"
  | "strategy";

/** Référence catalogue pour la bande tarifaire de la page. */
export type ServicePriceRef =
  | "web"
  | "software"
  | "saas"
  | "community"
  | "acquisition"
  | "training"
  | null;

export interface ServiceDetail {
  slug: ServiceSlug;
  /** nom court du pôle (fil d'Ariane, metadata, liens croisés) */
  name: string;
  /** visuel du pôle (bandeau de la page) */
  image: string;
  hero: {
    label: string;
    title: string;
    gold: string;
    sub: string;
    chips: string[];
  };
  overview: {
    label: string;
    title: string;
    gold: string;
    paragraphs: string[];
    /** points-clés affichés dans la carte latérale (3 à 4) */
    facts: { k: string; v: string }[];
  };
  included: {
    label: string;
    title: string;
    gold: string;
    items: string[];
  };
  process: {
    label: string;
    title: string;
    gold: string;
    steps: { k: string; t: string }[];
  };
  audience: {
    label: string;
    title: string;
    gold: string;
    items: { k: string; d: string }[];
  };
  /** bande tarifaire : quelle ligne du catalogue afficher */
  priceRef: ServicePriceRef;
  priceNote: string;
  cta: {
    title: string;
    gold: string;
    sub: string;
    primaryLabel: string;
    secondaryLabel: string;
  };
}

export type ServiceDetailsContent = Record<ServiceSlug, ServiceDetail>;
/**
 * Contenu d'UNE langue (fr.ts, en.ts, es.ts… exportent ce type tel quel).
 * L'agrégation multi-langues Record<Lang, …> est faite dans index.ts.
 */
export type LocalizedServiceDetails = ServiceDetailsContent;
