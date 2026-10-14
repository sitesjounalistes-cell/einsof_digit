/**
 * Commercial catalogue — amounts are EXACTLY those of section 19 of the specification.
 * All amounts in Guinean francs (GNF). Never invent another price.
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

export const WEB_OFFERS: PriceOffer[] = [
  {
    id: "web-vitrine",
    name: "Site vitrine",
    amount: 1_500_000,
    period: "one_time",
    footnote:
      "Pages conçues par l'agence, sans tableau de bord d'administration.",
  },
  {
    id: "web-dashboard",
    name: "Site avec tableau de bord",
    amount: 2_500_000,
    period: "one_time",
    featured: true,
    footnote: "Tableau de bord à un seul administrateur.",
  },
  {
    id: "web-ecommerce",
    name: "Boutique en ligne",
    amount: 3_500_000,
    period: "one_time",
    footnote:
      "Système de paiement intégré ; tableau de bord inclus (à confirmer).",
  },
];

export const WEB_RENEWAL: PriceOffer = {
  id: "web-renewal",
  name: "Renouvellement annuel",
  amount: 500_000,
  period: "year",
  footnote: "Nom de domaine et hébergement — garantit la continuité du site.",
};

export const SOFTWARE_OFFERS: PriceOffer[] = [
  {
    id: "software-custom",
    name: "Logiciel sur mesure",
    amount: 20_000_000,
    period: "one_time",
    isFrom: true,
    footnote:
      "Selon les fonctionnalités demandées. Bugs corrigés sans frais pendant toute la collaboration.",
  },
  {
    id: "software-mobile",
    name: "Application mobile",
    amount: null,
    period: "one_time",
    isQuoteOnly: true,
    footnote: "Tarif en cours de définition — étude personnalisée.",
  },
];

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
];

export const findSaas = (slug: string) =>
  SAAS_PRODUCTS.find((s) => s.slug === slug);

export const SAAS_SLUGS = SAAS_PRODUCTS.map((s) => s.slug);
