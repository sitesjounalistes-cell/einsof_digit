import type { Metadata } from "next";
import { BRAND } from "@/lib/brand";
import { WEB_OFFERS, SOFTWARE_OFFERS, SAAS_PRODUCTS, formatGNF } from "@/lib/catalog";

/* ════════════════════════════════════════════════════════════════
   NOYAU SEO — référencement approfondi pour la Guinée.
   Objectif client : apparaître EN TÊTE pour toute requête liée à
   « création de site web en Guinée », « création de site web
   professionnel en Guinée », « agence de création de site web en
   Guinée », « création de logiciel(s) en Guinée », « création
   d'application en Guinée », « application mobile Guinée », les
   logiciels SaaS de gestion, les formations et la génération de
   leads/prospects — quel que soit le mot-clé du thème.
   ════════════════════════════════════════════════════════════════ */

/**
 * URL canonique du site.
 * ⚠ TODO-HUMAN : renseigner NEXT_PUBLIC_SITE_URL avec le domaine final
 * du client dès qu'il est acheté — tout le reste (sitemap, canoniques,
 * Open Graph, JSON-LD) se mettra à jour automatiquement.
 */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "https://www.einsof.gn";

/** Ville / zone géographique ciblées (données structurées + contenus). */
export const GEO = {
  city: "Conakry",
  country: "Guinée",
  countryEn: "Guinea",
  countryCode: "GN",
  region: "Afrique de l'Ouest",
} as const;

/* ── 1. JEU DE MOTS-CLÉS GLOBAL (toutes les pages) ─────────────── */

export const BASE_KEYWORDS = [
  /* Agence / marque */
  `agence digitale ${GEO.country}`,
  `agence digitale ${GEO.city}`,
  `agence web ${GEO.country}`,
  `agence digitale premium ${GEO.country}`,
  "EINSOF",
  "EINSOF Guinée",
  /* Sites web — requêtes principales du client */
  `création de site web en ${GEO.country}`,
  `création de site web ${GEO.city}`,
  `création de site web professionnel en ${GEO.country}`,
  `agence de création de site web en ${GEO.country}`,
  `agence de création de site web professionnel en ${GEO.country}`,
  `site web vitrine ${GEO.country}`,
  `site internet professionnel ${GEO.country}`,
  `création boutique en ligne ${GEO.country}`,
  `prix création site web ${GEO.country}`,
  `tarif site web ${GEO.city}`,
  `développeur web ${GEO.country}`,
  `développeur web ${GEO.city}`,
  `refonte site web ${GEO.country}`,
  `référencement SEO ${GEO.country}`,
  /* Logiciels & applications */
  `création de logiciel en ${GEO.country}`,
  `création de logiciels en ${GEO.country}`,
  `développement de logiciel sur mesure ${GEO.country}`,
  `logiciel de gestion ${GEO.country}`,
  `création d'application en ${GEO.country}`,
  `création application mobile ${GEO.country}`,
  `développeur application mobile ${GEO.country}`,
  `logiciel SaaS ${GEO.country}`,
  `logiciel SaaS Afrique`,
  `application de gestion ${GEO.country}`,
  /* Pôles complémentaires */
  `community management ${GEO.country}`,
  `gestion des réseaux sociaux ${GEO.country}`,
  `génération de leads ${GEO.country}`,
  `génération de prospects ${GEO.country}`,
  `prospection B2B ${GEO.country}`,
  `acquisition client ${GEO.country}`,
  `formation informatique ${GEO.country}`,
  `formation digitale ${GEO.country}`,
  `stratégie digitale ${GEO.country}`,
  /* SaaS métiers (longue traîne produit) */
  "logiciel de facturation Guinée",
  "logiciel de gestion comptable Guinée",
  "logiciel de gestion hospitalière",
  "logiciel de gestion d'école",
  "logiciel de gestion immobilière",
  "logiciel de gestion de pharmacie",
  "logiciel de gestion de formation",
  "Factura Pro",
] as const;

/* ── 2. MOTS-CLÉS PAR PAGE (requêtes longue traîne) ────────────── */

export const PAGE_KEYWORDS: Record<string, string[]> = {
  home: [
    ...BASE_KEYWORDS,
    "meilleure agence digitale Guinée",
    "agence numérique Conakry",
    "transformation digitale Guinée",
    "entreprise technologie Guinée",
    "solutions numériques Afrique de l'Ouest",
  ],
  services: [
    "services digitaux Guinée",
    "prestations web Guinée",
    "agence de création de site web professionnel en Guinée",
    "sous-traitance informatique Guinée",
    "partenaire digital entreprises Guinée",
    "création de site web en Guinée",
    "création de logiciel en Guinée",
  ],
  logiciels: [
    "création de logiciels en Guinée",
    "logiciels de gestion prêts à l'emploi Guinée",
    "SaaS de gestion Guinée",
    "essai gratuit logiciel gestion Guinée",
    "logiciel facturation GNF",
    "démo logiciel de gestion Guinée",
    "workflow automatisation Guinée",
  ],
  tarifs: [
    "prix création site web Guinée",
    "tarif création site web Guinée",
    "combien coûte un site web en Guinée",
    "prix site web vitrine Guinée",
    "tarif logiciel sur mesure Guinée",
    "prix community management Guinée",
    "tarif génération de leads Guinée",
    "prix formation informatique Guinée",
    "coût application mobile Guinée",
  ],
  realisations: [
    "réalisations web Guinée",
    "portfolio agence digitale Guinée",
    "exemples de sites web Guinée",
    "clients agence digitale Conakry",
    "références développement logiciel Guinée",
  ],
  methode: [
    "méthode de travail agence web",
    "processus création site web Guinée",
    "cycle de développement logiciel Guinée",
    "accompagnement projet digital Guinée",
  ],
  secteurs: [
    "agence digitale pour PME Guinée",
    "site web pour hôtel Guinée",
    "site web pour école Guinée",
    "logiciel pour clinique Guinée",
    "site web pour ONG Guinée",
    "digitalisation commerce Guinée",
    "site web restaurant Guinée",
    "logiciel immobilier Guinée",
  ],
  about: [
    "à propos EINSOF",
    "équipe agence digitale Guinée",
    "entreprise informatique guinéenne",
    "histoire agence digitale Conakry",
    "agence locale Guinée",
  ],
  blog: [
    "blog digital Guinée",
    "conseils création site web Guinée",
    "actualités numériques Guinée",
    "guide site internet Guinée",
    "tutoriel marketing digital Afrique",
  ],
  faq: [
    "questions création site web Guinée",
    "FAQ agence digitale Guinée",
    "délai création site web Guinée",
    "maintenance site web Guinée",
  ],
  contact: [
    "contact agence digitale Guinée",
    "devis création site web Guinée",
    "demander un devis site web Conakry",
    "agence digitale Conakry contact",
    "devis application mobile Guinée",
  ],
  strategy: [
    "stratégie digitale Guinée",
    "conseil transformation numérique Guinée",
    "audit digital Guinée",
  ],
};

/* ── 3. Builder de metadata par page ───────────────────────────── */

interface PageMetaInput {
  path: string;
  title: string;
  description: string;
  keywords?: string[];
  image?: string;
  type?: "website" | "article";
}

/** Construit une Metadata complète : canonical + OG + Twitter. */
export function buildMetadata({
  path,
  title,
  description,
  keywords = [],
  image = "/images/hero-obsidienne.png",
  type = "website",
}: PageMetaInput): Metadata {
  const url = path === "/" ? SITE_URL : `${SITE_URL}${path}`;
  const ogImage = { url: image, width: 1200, height: 630, alt: title };
  return {
    title,
    description,
    keywords: [...new Set([...keywords])],
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: BRAND,
      type,
      locale: "fr_GN",
      images: [ogImage],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}

/* ── 4. Données structurées JSON-LD ────────────────────────────── */

type Json = Record<string, unknown>;

/** Organization + LocalBusiness (ProfessionalService) — global. */
export function organizationJsonLd(): Json {
  return {
    "@context": "https://schema.org",
    "@type": ["Organization", "ProfessionalService", "LocalBusiness"],
    "@id": `${SITE_URL}/#organization`,
    name: BRAND,
    url: SITE_URL,
    logo: `${SITE_URL}/logo.svg`,
    image: `${SITE_URL}/images/hero-obsidienne.png`,
    description:
      "Agence digitale en Guinée : création de sites web professionnels, développement de logiciels sur mesure, applications mobiles, SaaS de gestion, community management, génération de leads et formations digitales.",
    slogan: "Votre présence digitale, notre métier.",
    priceRange: "1 500 000 - 50 000 000 GNF",
    currenciesAccepted: "GNF",
    address: {
      "@type": "PostalAddress",
      addressLocality: GEO.city,
      addressCountry: GEO.countryCode,
    },
    areaServed: [
      { "@type": "Country", name: GEO.country },
      { "@type": "AdministrativeArea", name: `${GEO.city}, ${GEO.country}` },
      { "@type": "Place", name: GEO.region },
    ],
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "08:00",
        closes: "18:00",
      },
    ],
    knowsLanguage: ["fr", "en"],
    /* Les tarifs officiels du catalogue (§19) — preuve de prix réels. */
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Services digitaux — tarifs officiels en GNF",
      itemListElement: [
        ...WEB_OFFERS.map((o) => ({
          "@type": "Offer",
          name: o.name,
          priceCurrency: "GNF",
          ...(o.amount !== null && !o.isQuoteOnly
            ? { price: o.amount, description: o.footnote ?? "" }
            : { description: "Sur devis — " + (o.footnote ?? "") }),
        })),
        ...SOFTWARE_OFFERS.map((o) => ({
          "@type": "Offer",
          name: o.name,
          priceCurrency: "GNF",
          ...(o.amount !== null ? { price: o.amount } : {}),
          description: o.footnote ?? "",
        })),
        ...SAAS_PRODUCTS.flatMap((p) =>
          p.offers
            .filter((o) => o.amount !== null)
            .map((o) => ({
              "@type": "Offer",
              name: `${p.name} — ${o.name}`,
              priceCurrency: "GNF",
              price: o.amount,
              ...(o.period === "month"
                ? { unitText: "MONTH" }
                : o.period === "year"
                  ? { unitText: "YEAR" }
                  : {}),
              description: o.footnote ?? "",
            })),
        ),
      ],
    },
  };
}

/** WebSite + SearchAction (Google sitelinks searchbox). */
export function websiteJsonLd(): Json {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    url: SITE_URL,
    name: BRAND,
    inLanguage: "fr",
    publisher: { "@id": `${SITE_URL}/#organization` },
  };
}

/** Service (page de pôle /services/[slug] ou /logiciels). */
export function serviceJsonLd(opts: {
  path: string;
  name: string;
  description: string;
  offers?: { name: string; amount: number | null; period: string; isFrom?: boolean; isQuoteOnly?: boolean }[];
}): Json {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: opts.name,
    description: opts.description,
    provider: { "@id": `${SITE_URL}/#organization` },
    areaServed: { "@type": "Country", name: GEO.country },
    url: `${SITE_URL}${opts.path}`,
    serviceType: opts.name,
    ...(opts.offers && opts.offers.length > 0
      ? {
          hasOfferCatalog: {
            "@type": "OfferCatalog",
            name: `${opts.name} — tarifs`,
            itemListElement: opts.offers.map((o) => ({
              "@type": "Offer",
              name: o.name,
              priceCurrency: "GNF",
              ...(o.amount !== null && !o.isQuoteOnly
                ? { price: o.amount }
                : { priceSpecification: { "@type": "PriceSpecification", valueAddedTaxIncluded: true } }),
              ...(o.isFrom ? { name: `${o.name} (à partir de)` } : {}),
            })),
          },
        }
      : {}),
  };
}

/** SoftWareApplication (pages /logiciels/[slug]). */
export function softwareJsonLd(opts: {
  path: string;
  name: string;
  description: string;
  amount: number | null;
  period: "month" | "year" | "one_time";
  isFrom?: boolean;
  isQuoteOnly?: boolean;
}): Json {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: opts.name,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    description: opts.description,
    url: `${SITE_URL}${opts.path}`,
    author: { "@id": `${SITE_URL}/#organization` },
    offers: {
      "@type": "Offer",
      priceCurrency: "GNF",
      ...(opts.amount !== null && !opts.isQuoteOnly
        ? { price: opts.amount }
        : { price: undefined }),
      ...(opts.isFrom ? { description: `À partir de ${formatGNF(opts.amount ?? 0)}` } : {}),
      availability: "https://schema.org/InStock",
      areaServed: { "@type": "Country", name: GEO.country },
    },
  };
}

/** FAQPage (page /faq et mini-FAQ des tarifs). */
export function faqJsonLd(items: { q: string; a: string }[]): Json {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((it) => ({
      "@type": "Question",
      name: it.q,
      acceptedAnswer: { "@type": "Answer", text: it.a },
    })),
  };
}

/** Article (pages /blog/[slug]). */
export function articleJsonLd(post: {
  title: string;
  excerpt: string;
  slug: string;
  publishedAt: string | null;
}): Json {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    url: `${SITE_URL}/blog/${post.slug}`,
    ...(post.publishedAt ? { datePublished: post.publishedAt } : {}),
    inLanguage: "fr",
    author: { "@id": `${SITE_URL}/#organization` },
    publisher: { "@id": `${SITE_URL}/#organization` },
    mainEntityOfPage: `${SITE_URL}/blog/${post.slug}`,
  };
}

/** BreadcrumbList (toutes les pages de détail). */
export function breadcrumbJsonLd(
  items: { name: string; path: string }[],
): Json {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: it.path === "/" ? SITE_URL : `${SITE_URL}${it.path}`,
    })),
  };
}
