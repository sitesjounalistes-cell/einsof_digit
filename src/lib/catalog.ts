/**
 * Commercial catalogue — amounts EXACTLY as communicated by the client
 * (mise à jour des services, itération 20). All amounts in Guinean francs
 * (GNF). Never invent another price.
 *
 * Sites web :
 *  - Vitrine 1 500 000 GNF (sans tableau de bord) — renouvellement 500 000 GNF/an
 *  - Avec tableau de bord 3 500 000 GNF (1 administrateur) — renouvellement 700 000 GNF/an
 *  - Customisé (options) : sur devis
 *  - Système de paiement intégré : +1 000 000 GNF quel que soit le site
 * Logiciels : interne dès 20 M · SaaS à commercialiser dès 50 M · mobile dès 20 M.
 * SaaS de gestion : 7 outils (tarifs inchangés) + conception de workflows sur mesure.
 * Community management : Essentiel 1,5 M / Professionnel 3 M / Premium 5 M par mois.
 * Acquisition client (B2B) et formations (dès 20 M, sur devis) : grille détaillée.
 */

export type BillingPeriod = "one_time" | "month" | "year";

export interface PriceOffer {
  id: string;
  name: string;
  amount: number | null;
  period: BillingPeriod;
  billableMonths?: number;
  isFrom?: boolean;
  isQuoteOnly?: boolean;
  footnote?: string;
  featured?: boolean;
}

export interface SaasProduct {
  slug: string;
  name: string;
  offers: PriceOffer[];
}

export const formatGNF = (n: number): string =>
  `${new Intl.NumberFormat("fr-FR").format(n)} GNF`;

/* ── Sites web ─────────────────────────────────────────────────── */

export const WEB_OFFERS: PriceOffer[] = [
  {
    id: "web-vitrine",
    name: "Site web vitrine",
    amount: 1_500_000,
    period: "one_time",
    footnote:
      "Sans tableau de bord — la gestion passe par un webmaster. Bugs vérifiés les 6 premiers mois.",
  },
  {
    id: "web-dashboard",
    name: "Site web avec tableau de bord",
    amount: 3_500_000,
    period: "one_time",
    featured: true,
    footnote:
      "Un seul espace administrateur. Bugs pris en charge pendant toute la collaboration.",
  },
  {
    id: "web-custom",
    name: "Site web customisé",
    amount: null,
    period: "one_time",
    isQuoteOnly: true,
    footnote:
      "Le site à tableau de bord + options sur mesure : chatbot WhatsApp, chatbot vendeur, section réseau social…",
  },
];

export const WEB_RENEWALS: PriceOffer[] = [
  {
    id: "web-renewal-vitrine",
    name: "Renouvellement — site vitrine",
    amount: 500_000,
    period: "year",
    footnote: "Nom de domaine et hébergement — garantit la continuité du site.",
  },
  {
    id: "web-renewal-dashboard",
    name: "Renouvellement — site avec tableau de bord",
    amount: 700_000,
    period: "year",
    footnote: "Nom de domaine et hébergement — garantit la continuité du site.",
  },
];

/** Option, quel que soit le forfait : s'ajoute au montant du site. */
export const WEB_PAYMENT_ADDON: PriceOffer = {
  id: "web-payment-addon",
  name: "Système de paiement intégré",
  amount: 1_000_000,
  period: "one_time",
  footnote:
    "Option pour tout type de site — s'ajoute au forfait (ex. vitrine 1 500 000 + 1 000 000 = 2 500 000 GNF).",
};

/* ── Logiciels & applications (conception sur mesure) ──────────── */

export const SOFTWARE_OFFERS: PriceOffer[] = [
  {
    id: "software-custom",
    name: "Logiciel sur mesure — usage interne",
    amount: 20_000_000,
    period: "one_time",
    isFrom: true,
    footnote:
      "Usage interne : plusieurs accès administrateur, fonctionnalités internes. Selon les fonctionnalités demandées.",
  },
  {
    id: "software-saas",
    name: "Logiciel SaaS à commercialiser",
    amount: 50_000_000,
    period: "one_time",
    isFrom: true,
    footnote:
      "Conception d'un logiciel SaaS destiné à être vendu à vos propres clients — projet étudié sur mesure.",
  },
  {
    id: "software-mobile",
    name: "Application mobile",
    amount: 20_000_000,
    period: "one_time",
    isFrom: true,
    footnote:
      "Selon le type de projet : étude personnalisée puis chiffrage précis sur devis.",
  },
];

/* ── SaaS de gestion (7 outils) + workflows sur mesure ─────────── */

export const SAAS_PRODUCTS: SaasProduct[] = [
  {
    slug: "factura-pro",
    name: "Factura Pro",
    offers: [
      {
        id: "factura-monthly",
        name: "Factura Pro",
        amount: 100_000,
        period: "month",
        footnote: "Outil de facturation : générer factures et reçus.",
      },
    ],
  },
  {
    slug: "gestion-comptable",
    name: "Gestion comptable",
    offers: [
      {
        id: "compta-monthly",
        name: "Gestion comptable",
        amount: 1_000_000,
        period: "month",
        isFrom: true,
      },
    ],
  },
  {
    slug: "gestion-hospitaliere",
    name: "Gestion hospitalière",
    offers: [
      {
        id: "hosp-1",
        name: "Forfait Essentiel",
        amount: 1_000_000,
        period: "month",
      },
      {
        id: "hosp-3",
        name: "Forfait Avancé",
        amount: 3_000_000,
        period: "month",
      },
      {
        id: "hosp-5",
        name: "Forfait Complet",
        amount: 5_000_000,
        period: "month",
      },
    ],
  },
  {
    slug: "gestion-ecole",
    name: "Gestion d'école",
    offers: [
      {
        id: "ecole-monthly",
        name: "Gestion d'école",
        amount: 500_000,
        period: "month",
        billableMonths: 9,
      },
    ],
  },
  {
    slug: "gestion-immobiliere",
    name: "Gestion immobilière",
    offers: [
      {
        id: "immo-monthly",
        name: "Gestion immobilière",
        amount: 500_000,
        period: "month",
      },
    ],
  },
  {
    slug: "gestion-pharmacie",
    name: "Gestion de pharmacie",
    offers: [
      {
        id: "pharma-yearly",
        name: "Gestion de pharmacie",
        amount: 7_000_000,
        period: "year",
      },
    ],
  },
  {
    slug: "gestion-formation",
    name: "Gestion de formation",
    offers: [
      {
        id: "formation-quote",
        name: "Gestion de formation",
        amount: null,
        period: "month",
        isQuoteOnly: true,
        footnote: "Tarification selon la taille de votre centre — sur devis.",
      },
    ],
  },
];

/* ── Community management (3 forfaits, par mois) ───────────────── */

export const COMMUNITY_OFFERS: PriceOffer[] = [
  {
    id: "community-essentiel",
    name: "Forfait Essentiel",
    amount: 1_500_000,
    period: "month",
    footnote:
      "Sans équipe de terrain : le client fournit les photos et les éléments. Publicité incluse : 10 $.",
  },
  {
    id: "community-pro",
    name: "Forfait Professionnel",
    amount: 3_000_000,
    period: "month",
    featured: true,
    footnote:
      "Sans équipe de terrain : le client fournit les photos. Publicité incluse : 50 $/mois.",
  },
  {
    id: "community-premium",
    name: "Forfait Premium",
    amount: 5_000_000,
    period: "month",
    footnote:
      "Équipe dédiée sur le terrain (2 interventions/semaine) + 5 montages vidéo. Publicité incluse : 100 $/mois.",
  },
];

/* ── Acquisition client (B2B) — grille proposée à valider ──────── */

export const ACQUISITION_OFFERS: PriceOffer[] = [
  {
    id: "acq-leads",
    name: "Génération de leads B2B",
    amount: 2_000_000,
    period: "month",
    isFrom: true,
    footnote:
      "Listes de contacts B2B qualifiés selon votre secteur et le pays ciblé, transmises à votre équipe commerciale.",
  },
  {
    id: "acq-calling",
    name: "Prospection téléphonique déléguée",
    amount: 4_500_000,
    period: "month",
    isFrom: true,
    footnote:
      "Nos équipes appellent pour vous, présentent vos services et vous transmettent les contacts intéressés + reporting.",
  },
  {
    id: "acq-landing",
    name: "Landing page de conversion",
    amount: 1_000_000,
    period: "one_time",
    isFrom: true,
    footnote: "Page unique pensée pour capturer des prospects.",
  },
  {
    id: "acq-ads",
    name: "Campagne publicitaire sur mesure",
    amount: 1_000_000,
    period: "month",
    isFrom: true,
    footnote:
      "Conception et pilotage de la campagne — budget média à la charge du client.",
  },
];

/* ── Formations (équipes en entreprise, sur devis) ─────────────── */

export const TRAINING_OFFERS: PriceOffer[] = [
  {
    id: "training-team",
    name: "Formation d'équipe en entreprise",
    amount: 20_000_000,
    period: "one_time",
    isFrom: true,
    footnote:
      "Sur devis après analyse de vos besoins — stratégie adaptée à votre domaine d'activité.",
  },
];

/* ── Helpers ───────────────────────────────────────────────────── */

export const ALL_OFFERS: PriceOffer[] = [
  ...WEB_OFFERS,
  ...WEB_RENEWALS,
  WEB_PAYMENT_ADDON,
  ...SOFTWARE_OFFERS,
  ...COMMUNITY_OFFERS,
  ...ACQUISITION_OFFERS,
  ...TRAINING_OFFERS,
];

export const findOffer = (id: string): PriceOffer | undefined =>
  ALL_OFFERS.find((o) => o.id === id);

export const findSaas = (slug: string) =>
  SAAS_PRODUCTS.find((s) => s.slug === slug);

export const SAAS_SLUGS = SAAS_PRODUCTS.map((s) => s.slug);

/** Liens éditables par logiciel (table SoftwareLink) — démo en ligne + vidéo YouTube. */
export type SoftwareLinksRecord = Record<
  string,
  { demoUrl: string | null; videoUrl: string | null }
>;
