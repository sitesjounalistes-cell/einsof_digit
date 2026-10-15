/**
 * Contenu détaillé d'une page de logiciel /logiciels/[slug].
 * Chaque produit : présentation, vidéo (à intégrer), caractéristiques,
 * modules clés, pour qui, tarif de référence (catalogue §19) et CTA
 * « réserver une démo » + « essai gratuit 7 jours ».
 * Les montants ne sont JAMAIS écrits ici : ils viennent du catalogue
 * officiel (src/lib/catalog.ts) — rendus par PriceTag.
 */

export type SaasSlug =
  | "factura-pro"
  | "gestion-comptable"
  | "gestion-hospitaliere"
  | "gestion-ecole"
  | "gestion-immobiliere"
  | "gestion-pharmacie";

export interface SaasDetail {
  slug: SaasSlug;
  /** nom du produit (fil d'Ariane, metadata) — vient aussi du catalogue */
  name: string;
  /** visuel produit (bandeau + affiche de la vidéo) */
  image: string;
  /** URL de la vidéo de présentation — null : affiche « bientôt » élégante */
  videoUrl: string | null;
  hero: {
    label: string;
    title: string;
    gold: string;
    sub: string;
    chips: string[];
  };
  video: {
    label: string;
    title: string;
    gold: string;
    /** texte affiché si aucune vidéo n'est encore intégrée */
    soonNote: string;
    watchLabel: string;
  };
  overview: {
    label: string;
    title: string;
    gold: string;
    paragraphs: string[];
  };
  features: {
    label: string;
    title: string;
    gold: string;
    sub: string;
    /** toutes les caractéristiques écrites sous la vidéo (8 à 10) */
    items: string[];
  };
  audience: {
    label: string;
    title: string;
    gold: string;
    forWhom: string;
    /** situations concrètes (2 à 3) */
    cases: { k: string; d: string }[];
  };
  /** bande tarifaire : slug du produit dans le catalogue */
  priceNote: string;
  cta: {
    title: string;
    gold: string;
    sub: string;
    demoLabel: string;
    trialLabel: string;
  };
  faq: {
    label: string;
    items: { q: string; a: string }[];
  };
}

export type SaasDetailsContent = Record<SaasSlug, SaasDetail>;
/**
 * Contenu d'UNE langue (fr.ts, en.ts, es.ts… exportent ce type tel quel).
 * L'agrégation multi-langues Record<Lang, …> est faite dans index.ts.
 */
export type LocalizedSaasDetails = SaasDetailsContent;
