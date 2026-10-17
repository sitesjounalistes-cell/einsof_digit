import type { Metadata } from "next";
import { BRAND } from "@/lib/brand";
import { WEB_OFFERS, SOFTWARE_OFFERS, SAAS_PRODUCTS, formatGNF } from "@/lib/catalog";

/* ════════════════════════════════════════════════════════════════
   MOTEUR SEO MONSTRE — référencement ULTRA-COMPLET pour la Guinée.
   Stratégie : peu importe la requête — courte traîne, longue traîne,
   ville, métier, question, marque ou concurrent générique — le site
   doit sortir EN TÊTE. On couvre donc :
     1. Tous les pôles d'activité (sites web, logiciels, applications,
        SaaS, community management, formations, génération de leads,
        stratégie digitale).
     2. Toutes les zones géographiques (Conakry + quartiers, les 8
        régions, les grandes villes, la diaspora, l'Afrique de l'Ouest).
     3. Tous les secteurs clients (santé, école, immobilier, commerce,
        hôtel, restaurant, ONG, banque, mine, transport, agriculture,
        BTP, médias, télécom, recrutement).
     4. Toutes les intentions (prix, tarif, devis, gratuit, meilleur,
        fiable, rapide, comment faire, combien coûte, où trouver…).
     5. Les requêtes en anglais (diaspora + partenaires internationaux).
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

/** Coordonnées Conakry (LocalBusiness — résultats cartographiques). */
export const GEO_COORDS = {
  latitude: 9.5092,
  longitude: -13.7122,
} as const;

/** Zones d'intervention — SEO local (page /zones + JSON-LD). */
export const ZONES = {
  quartiers: [
    "Kaloum",
    "Dixinn",
    "Ratoma",
    "Matam",
    "Kipé",
    "Lambanyi",
    "Nongo",
    "Kobaya",
    "Sonfonia",
    "Gbéssia",
  ],
  regions: [
    "Boké",
    "Conakry",
    "Faranah",
    "Kankan",
    "Kindia",
    "Labé",
    "Mamou",
    "Nzérékoré",
  ],
  villes: [
    "Kankan",
    "Nzérékoré",
    "Boké",
    "Kindia",
    "Labé",
    "Mamou",
    "Faranah",
    "Siguiri",
    "Kouroussa",
    "Kissidougou",
    "Guéckédou",
    "Macenta",
    "N'Zérékoré",
    "Pita",
    "Dalaba",
    "Télimélé",
    "Coyah",
    "Dubréka",
    "Fria",
    "Dabola",
    "Kamsar",
    "Touba",
    "Beyla",
    "Lola",
    "Yomou",
  ],
  naturelles: [
    "Guinée maritime",
    "Fouta Djallon",
    "Haute Guinée",
    "Guinée forestière",
  ],
  diaspora: [
    "diaspora guinéenne",
    "Afrique francophone",
    "Afrique de l'Ouest",
    "Sénégal",
    "Côte d'Ivoire",
    "Mali",
    "Sierra Leone",
    "Liberia",
  ],
} as const;

/* ── 1. JEU DE MOTS-CLÉS GLOBAL (toutes les pages) ─────────────── */
/* Organisé par thèmes. Objectif : couvrir littéralement toute requête
   du domaine d'activité, courte ou longue. */

/** Villes & localisations guinéennes à injecter dans les longue traîne. */
export const GEO_CITIES = [
  "Conakry",
  "Kaloum",
  "Dixinn",
  "Ratoma",
  "Kankan",
  "Nzérékoré",
  "Boké",
  "Kindia",
  "Labé",
  "Mamou",
  "Siguiri",
  "Kamsar",
  "Macenta",
  "Guéckédou",
  "Kissidougou",
  "Faranah",
  "Kouroussa",
  "Pita",
  "Dalaba",
  "Coyah",
  "Dubréka",
  "Fria",
] as const;

const GEO_INJECT: string[] = GEO_CITIES.flatMap((c) => [
  `création de site web ${c}`,
  `agence digitale ${c}`,
]);

export const BASE_KEYWORDS: string[] = [
  /* Marque & agence */
  "EINSOF",
  "EINSOF Guinée",
  "EINSOF Conakry",
  "EINSOF agence digitale",
  `agence digitale ${GEO.country}`,
  `agence digitale ${GEO.city}`,
  "agence digitale Guinée Conakry",
  `agence web ${GEO.country}`,
  "agence web Conakry",
  `agence digitale premium ${GEO.country}`,
  "meilleure agence digitale Guinée",
  "meilleure agence web Guinée",
  "top agence digitale Guinée",
  "agence numérique Conakry",
  "entreprise informatique Guinée",
  "société informatique Guinée",
  "entreprise technologie Guinée",
  "société de services numériques Guinée",
  "partenaire digital entreprises Guinée",
  "transformation digitale Guinée",
  "transformation numérique Guinée",
  "digitalisation entreprises Guinée",
  "solutions numériques Afrique de l'Ouest",
  "solutions numériques Guinée",
  "services informatiques Guinée",
  "prestataire informatique Conakry",
  "sous-traitance informatique Guinée",
  "développement informatique Guinée",
  "informatique Guinée",
  "digital Guinée",
  "numérique Guinée",
  "tech Guinée",
  "startup Guinée",
  "startup tech Conakry",

  /* Sites web — requêtes principales du client */
  `création de site web en ${GEO.country}`,
  `création de site web ${GEO.city}`,
  "création de site web Guinée Conakry",
  `création de site web professionnel en ${GEO.country}`,
  "création de site web professionnel Conakry",
  `agence de création de site web en ${GEO.country}`,
  `agence de création de site web professionnel en ${GEO.country}`,
  "qui crée des sites web en Guinée",
  "faire créer son site web en Guinée",
  "faire un site web en Guinée",
  "comment créer un site web en Guinée",
  `site web ${GEO.country}`,
  `site internet ${GEO.country}`,
  `site web professionnel ${GEO.country}`,
  `site web vitrine ${GEO.country}`,
  "site vitrine Conakry",
  `site internet professionnel ${GEO.country}`,
  "site web entreprise Guinée",
  "site web pour entreprise Guinée",
  `création boutique en ligne ${GEO.country}`,
  "création e-commerce Guinée",
  "site e-commerce Guinée",
  "site web avec paiement en ligne Guinée",
  "paiement en ligne Guinée site web",
  "landing page Guinée",
  `prix création site web ${GEO.country}`,
  "prix site web Guinée",
  `tarif site web ${GEO.city}`,
  "tarif création site web Guinée",
  "combien coûte un site web en Guinée",
  "combien coute un site web en Guinée",
  "coût création site internet Guinée",
  "site web pas cher Guinée",
  "site web qualité Guinée",
  `développeur web ${GEO.country}`,
  `développeur web ${GEO.city}`,
  "développeur site web Guinée",
  "webmaster Guinée",
  `refonte site web ${GEO.country}`,
  "refonte site internet Conakry",
  "maintenance site web Guinée",
  "hébergement web Guinée",
  "nom de domaine Guinée",
  "e-mail professionnel Guinée",
  "adresse mail entreprise Guinée",
  "chatbot site web Guinée",
  "chatbot WhatsApp Guinée",
  "site multilingue Guinée",
  "site web moderne Guinée",
  "site web rapide Guinée",
  "site web mobile Guinée",
  "responsive design Guinée",
  `référencement SEO ${GEO.country}`,
  "référencement Google Guinée",
  "SEO Guinée",
  "SEO Conakry",
  "indexation Google Guinée",
  "google guinée site web",

  /* Logiciels & applications */
  `création de logiciel en ${GEO.country}`,
  `création de logiciels en ${GEO.country}`,
  "création de logiciel Conakry",
  "création de logiciels Conakry",
  `développement de logiciel sur mesure ${GEO.country}`,
  "logiciel sur mesure Guinée",
  "logiciel de gestion ${GEO.country}",
  "logiciel de gestion Conakry",
  "logiciel gestion entreprise Guinée",
  "développement logiciel Afrique de l'Ouest",
  "studio de développement Guinée",
  `création d'application en ${GEO.country}`,
  `création application mobile ${GEO.country}`,
  "création application mobile Conakry",
  "application Android Guinée",
  "application iOS Guinée",
  "application hybride Guinée",
  "créer une application en Guinée",
  "faire développer une application Guinée",
  `développeur application mobile ${GEO.country}`,
  "développeur d'applications Conakry",
  "application pour entreprise Guinée",
  "digitalisation des processus Guinée",
  "automatisation entreprise Guinée",
  "informatisation gestion Guinée",
  `logiciel SaaS ${GEO.country}`,
  "logiciel SaaS Afrique",
  "logiciels SaaS Guinée",
  "SaaS de gestion Guinée",
  "logiciel en ligne Guinée",
  "logiciel cloud Guinée",
  `application de gestion ${GEO.country}`,
  "application de gestion Conakry",
  "logiciel de facturation Guinée",
  "logiciel facturation Conakry",
  "logiciel de devis facture Guinée",
  "logiciel de gestion comptable Guinée",
  "logiciel comptabilité Guinée",
  "logiciel de gestion de stock Guinée",
  "gestion de stock Guinée logiciel",
  "logiciel de point de vente Guinée",
  "logiciel caisse Guinée",
  "logiciel RH Guinée",
  "logiciel de paie Guinée",
  "logiciel CRM Guinée",
  "logiciel ERP Guinée",
  "logiciel de gestion hospitalière",
  "logiciel de gestion hospitalière Guinée",
  "logiciel hôpital Guinée",
  "logiciel clinique Guinée",
  "logiciel de gestion d'école",
  "logiciel de gestion d'école Guinée",
  "logiciel scolarité Guinée",
  "logiciel école privée Guinée",
  "logiciel de gestion immobilière",
  "logiciel immobilier Guinée",
  "gestion locative logiciel Guinée",
  "logiciel de gestion de pharmacie",
  "logiciel pharmacie Guinée",
  "gestion stock pharmacie Guinée",
  "logiciel de gestion de formation",
  "logiciel centre de formation Guinée",
  "Factura Pro",
  "Factura Pro Guinée",
  "essai gratuit logiciel de gestion",
  "essai gratuit logiciel Guinée",
  "démo logiciel gestion Guinée",
  "logiciel de gestion gratuit 7 jours",
  "workflow automatisation Guinée",
  "conception workflow Guinée",
  "digitalisation PME Guinée",

  /* Pôles complémentaires */
  `community management ${GEO.country}`,
  "community management Conakry",
  "community manager Guinée",
  "community manager Conakry",
  "agence community management Guinée",
  `gestion des réseaux sociaux ${GEO.country}`,
  "gestion réseaux sociaux Conakry",
  "gestion page Facebook Guinée",
  "gestion Instagram entreprise Guinée",
  "publicité Facebook Guinée",
  "publicité Facebook Instagram Guinée",
  "Facebook Ads Guinée",
  "TikTok entreprise Guinée",
  "marketing digital Guinée",
  "marketing digital Conakry",
  "agence marketing digital Guinée",
  "création de contenu Guinée",
  "montage vidéo Guinée",
  "image de marque Guinée",
  "réputation en ligne Guinée",
  "e-réputation Guinée",
  `génération de leads ${GEO.country}`,
  "génération de leads Conakry",
  `génération de prospects ${GEO.country}`,
  "trouver des clients Guinée",
  "trouver des prospects Guinée",
  `prospection B2B ${GEO.country}`,
  "prospection commerciale Guinée",
  "prospection téléphonique Guinée",
  "téléprospection Guinée",
  `acquisition client ${GEO.country}`,
  "acquisition de clients Conakry",
  "développement commercial Guinée",
  "base de données entreprises Guinée",
  "liste de contacts B2B Guinée",
  "emailing B2B Guinée",
  "campagne publicitaire Guinée",
  "growth marketing Afrique",
  "convertir des visiteurs en clients Guinée",

  /* Formations */
  `formation informatique ${GEO.country}`,
  "formation informatique Conakry",
  `formation digitale ${GEO.country}`,
  "formation numérique Guinée",
  "formation en entreprise Guinée",
  "formation professionnelle Guinée",
  "formation équipe entreprise Guinée",
  "formation bureautique Guinée",
  "formation Excel Guinée",
  "formation Word Guinée",
  "formation marketing digital Guinée",
  "formation réseaux sociaux Guinée",
  "formation développement web Guinée",
  "formation utilisation logiciel Guinée",
  "formation logiciels de gestion Guinée",
  "formation tools numériques Conakry",
  "formation transformation digitale Guinée",
  "accompagnement digital Guinée",
  "montée en compétence numérique Guinée",
  "coach digital Guinée",

  /* Stratégie */
  `stratégie digitale ${GEO.country}`,
  "stratégie digitale Conakry",
  "conseil transformation numérique Guinée",
  "consultant digital Guinée",
  "audit digital Guinée",
  "audit numérique entreprise Guinée",
  "feuille de route digitale Guinée",
  "conseil en stratégie numérique Afrique",
  "roadmap digitale Guinée",

  /* Zones géographiques — courtes et directes */
  ...GEO_INJECT,
  "agence digitale Kankan",
  "agence digitale Nzérékoré",
  "agence digitale Boké",
  "agence digitale Labé",
  "site web Kankan",
  "site web Nzérékoré",
  "développeur Conakry",
  "informaticien Conakry",
  "République de Guinée site web",
  "Guinée 224 site web",
  "agence digitale +224",
  "Afrique de l'Ouest agence web",
  "agence digitale Afrique francophone",

  /* Anglais — diaspora & partenaires internationaux */
  "website development Guinea",
  "web development company Guinea",
  "web agency Conakry Guinea",
  "software development Guinea",
  "custom software development Guinea",
  "mobile app development Guinea",
  "SaaS solutions West Africa",
  "digital agency Guinea",
  "digital transformation Guinea",
  "IT company Conakry",
  "SEO services Guinea",
  "lead generation Guinea",
  "social media management Guinea",
  "digital training Guinea",
  "EINSOF Guinea",
  "EINSOF agency",
];

/* ── 2. MOTS-CLÉS PAR PAGE (requêtes longue traîne) ────────────── */

export const PAGE_KEYWORDS: Record<string, string[]> = {
  home: [
    ...BASE_KEYWORDS,
    "agence digitale tout-en-un Guinée",
    "site web + logiciel + marketing Guinée",
    "agence digitale des entreprises guinéennes",
    "solution digitale complète Guinée",
    "meilleur développeur Guinée",
    "services numériques Conakry",
    "EINSOF création site web",
  ],
  services: [
    "services digitaux Guinée",
    "prestations web Guinée",
    "prestations informatiques Guinée",
    "tous les services numériques Guinée",
    "agence de création de site web professionnel en Guinée",
    "sous-traitance informatique Guinée",
    "partenaire digital entreprises Guinée",
    "création de site web en Guinée",
    "création de logiciel en Guinée",
    "création d'application en Guinée",
    "logiciels SaaS Guinée",
    "community management Guinée",
    "génération de leads Guinée",
    "formation digitale Guinée",
    "stratégie digitale Guinée",
    "offre de services numérique Guinée",
    "que fait une agence digitale Guinée",
    "7 pôles de services digitaux",
  ],
  logiciels: [
    "création de logiciels en Guinée",
    "logiciels de gestion prêts à l'emploi Guinée",
    "SaaS de gestion Guinée",
    "essai gratuit logiciel gestion Guinée",
    "essai gratuit 7 jours logiciel",
    "logiciel facturation GNF",
    "logiciel facturation 100 000 GNF",
    "démo logiciel de gestion Guinée",
    "workflow automatisation Guinée",
    "logiciel de facturation Guinée",
    "logiciel de gestion comptable Guinée",
    "logiciel de gestion hospitalière Guinée",
    "logiciel de gestion d'école Guinée",
    "logiciel de gestion immobilière Guinée",
    "logiciel de gestion de pharmacie Guinée",
    "logiciel de gestion de formation Guinée",
    "acheter logiciel de gestion Guinée",
    "abonnement logiciel gestion Guinée",
    "logiciel gestion sans installation Guinée",
    "logiciel accessible mobile Guinée",
  ],
  tarifs: [
    "prix création site web Guinée",
    "tarif création site web Guinée",
    "combien coûte un site web en Guinée",
    "prix site web vitrine Guinée",
    "site web 1 500 000 GNF",
    "site web 3 500 000 GNF",
    "tarif logiciel sur mesure Guinée",
    "logiciel 20 millions GNF Guinée",
    "prix community management Guinée",
    "community management 1 500 000 GNF",
    "tarif génération de leads Guinée",
    "prix formation informatique Guinée",
    "coût application mobile Guinée",
    "application mobile 20 000 000 GNF",
    "tarifs agence digitale Guinée",
    "prix logiciels SaaS Guinée",
    "Factura Pro prix",
    "grille tarifaire site web Guinée",
    "tarif site internet Conakry",
    "devis site web Guinée",
    "prix renouvellement site web Guinée",
    "hébergement inclus Guinée site web",
  ],
  realisations: [
    "réalisations web Guinée",
    "portfolio agence digitale Guinée",
    "exemples de sites web Guinée",
    "clients agence digitale Conakry",
    "références développement logiciel Guinée",
    "sites web réalisés en Guinée",
    "site web entreprise guinéenne exemple",
    "agence web projets Guinée",
    "client FMK224",
    "Samou Media site web",
    "Ecometus site web",
    "TopGuinée site web",
    "Interseas Guinée",
    "Captis Guinée",
    "EMR Guinée",
    "Référence Media site web",
  ],
  methode: [
    "méthode de travail agence web",
    "processus création site web Guinée",
    "étapes création site web Guinée",
    "comment se passe la création d'un site web",
    "cycle de développement logiciel Guinée",
    "accompagnement projet digital Guinée",
    "comment choisir une agence digitale Guinée",
    "déroulement projet informatique Guinée",
    "cahier des charges site web Guinée",
    "délai création site web Guinée",
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
    "solutions digitales par secteur Guinée",
    "informatique santé Guinée",
    "informatique éducation Guinée",
    "informatique banque Guinée",
    "informatique mines Guinée",
    "informatique transport Guinée",
    "informatique agriculture Guinée",
    "informatique BTP Guinée",
    "informatique ONG Guinée",
  ],
  about: [
    "à propos EINSOF",
    "équipe agence digitale Guinée",
    "entreprise informatique guinéenne",
    "histoire agence digitale Conakry",
    "agence locale Guinée",
    "qui est EINSOF",
    "agence 100% guinéenne",
    "agence jeune Guinée",
    "valeur agence digitale Guinée",
    "agence de confiance Guinée",
  ],
  blog: [
    "blog digital Guinée",
    "conseils création site web Guinée",
    "actualités numériques Guinée",
    "guide site internet Guinée",
    "tutoriel marketing digital Afrique",
    "ressources digitales Guinée",
    "apprendre le digital Guinée",
    "guide création application Guinée",
    "conseils réseaux sociaux entreprise Guinée",
  ],
  faq: [
    "questions création site web Guinée",
    "FAQ agence digitale Guinée",
    "délai création site web Guinée",
    "maintenance site web Guinée",
    "qui possède mon site web Guinée",
    "propriété du site web agence",
    "paiement site web Guinée échelonné",
    "que se passe-t-il après la livraison du site",
    "puis-je modifier mon site moi-même",
    "formation à la gestion du site Guinée",
    "bugs site web gratuit",
  ],
  contact: [
    "contact agence digitale Guinée",
    "devis création site web Guinée",
    "demander un devis site web Conakry",
    "agence digitale Conakry contact",
    "devis application mobile Guinée",
    "devis logiciel Guinée",
    "demander une démo logiciel Guinée",
    "contacter EINSOF",
    "numéro agence digitale Guinée",
    "adresse agence digitale Conakry",
    "rendez-vous agence digitale Guinée",
    "discuter projet digital Guinée",
  ],
  strategy: [
    "stratégie digitale Guinée",
    "conseil transformation numérique Guinée",
    "audit digital Guinée",
    "consultant stratégie numérique Guinée",
    "plan de transformation digitale Guinée",
    "accompagnement numérique entreprise",
  ],
  zones: [
    "agence digitale Conakry",
    "agence digitale Kaloum",
    "agence digitale Dixinn",
    "agence digitale Ratoma",
    "création de site web Kankan",
    "création de site web Nzérékoré",
    "création de site web Boké",
    "création de site web Labé",
    "création de site web Kindia",
    "création de site web Siguiri",
    "création de site web Mamou",
    "agence web Haute Guinée",
    "agence web Guinée forestière",
    "agence web Fouta Djallon",
    "agence web Guinée maritime",
    "développement web partout en Guinée",
    "travail à distance agence digitale Guinée",
    "suivi à distance projet web Guinée",
  ],
};

/* ── 2-bis. SEO PAR SECTEUR (/secteurs/[slug]) ─────────────────── */
/* Une landing page longue traîne par métier : « site web pour
   hôtel en Guinée », « logiciel pour pharmacie en Guinée »… */

export interface SectorSeo {
  slug: string;
  name: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
}

export const SECTOR_SEO: SectorSeo[] = [
  {
    slug: "sante-pharmacie",
    name: "Santé & pharmacie",
    metaTitle: "Site web et logiciel pour clinique et pharmacie en Guinée",
    metaDescription:
      "Solutions digitales pour la santé en Guinée : logiciel de gestion hospitalière (dossiers patients, rendez-vous), gestion de pharmacie, sites web pour cliniques et cabinets. Essai gratuit 7 jours.",
    keywords: [
      "site web pour clinique Guinée",
      "logiciel pour clinique Guinée",
      "logiciel santé Guinée",
      "logiciel de gestion hospitalière Guinée",
      "logiciel pharmacie Guinée",
      "gestion stock pharmacie Guinée",
      "site web médecin Guinée",
      "site web cabinet médical Guinée",
      "digitalisation santé Guinée",
      "dossier patient informatisé Guinée",
      "rendez-vous médical en ligne Guinée",
      "logiciel laboratoire Guinée",
    ],
  },
  {
    slug: "education-formation",
    name: "Éducation & formation",
    metaTitle: "Site web et logiciel pour écoles et centres de formation en Guinée",
    metaDescription:
      "Solutions digitales pour l'éducation en Guinée : logiciel de gestion d'école (inscriptions, notes, scolarité), site web pour écoles et universités, gestion de centre de formation. Essai gratuit 7 jours.",
    keywords: [
      "site web pour école Guinée",
      "logiciel pour école Guinée",
      "logiciel de gestion d'école Guinée",
      "logiciel scolarité Guinée",
      "gestion inscriptions école Guinée",
      "site web université Guinée",
      "site web centre de formation Guinée",
      "logiciel centre de formation Guinée",
      "informatisation école Guinée",
      "suivi notes élèves Guinée",
      "bulletins numériques Guinée",
      "site web école privée Conakry",
    ],
  },
  {
    slug: "immobilier",
    name: "Immobilier",
    metaTitle: "Site web et logiciel pour agences immobilières en Guinée",
    metaDescription:
      "Solutions digitales pour l'immobilier en Guinée : logiciel de gestion immobilière (loyers, locataires, bâtiments), site vitrine pour agences, catalogue de biens en ligne. Essai gratuit 7 jours.",
    keywords: [
      "site web immobilier Guinée",
      "logiciel immobilier Guinée",
      "logiciel de gestion immobilière Guinée",
      "gestion locative Guinée logiciel",
      "site web agence immobilière Conakry",
      "catalogue biens immobiliers en ligne Guinée",
      "gestion des loyers logiciel Guinée",
      "suivi locataires logiciel Guinée",
      "immobilier Conakry digital",
    ],
  },
  {
    slug: "commerce-distribution",
    name: "Commerce & distribution",
    metaTitle: "Site web e-commerce et logiciels pour commerces en Guinée",
    metaDescription:
      "Solutions digitales pour le commerce en Guinée : boutique en ligne avec paiement intégré, logiciel de facturation (Factura Pro), gestion de stock et de point de vente. Vendez plus, partout au pays.",
    keywords: [
      "boutique en ligne Guinée",
      "création e-commerce Guinée",
      "site web pour commerce Guinée",
      "logiciel pour commerce Guinée",
      "logiciel facturation commerce Guinée",
      "gestion de stock commerce Guinée",
      "point de vente Guinée logiciel",
      "vendre en ligne Guinée",
      "paiement en ligne Guinée",
      "digitalisation commerce Guinée",
      "site web magasin Conakry",
    ],
  },
  {
    slug: "hotellerie-tourisme",
    name: "Hôtellerie & tourisme",
    metaTitle: "Site web pour hôtels et tourisme en Guinée — Réservation",
    metaDescription:
      "Solutions digitales pour l'hôtellerie et le tourisme en Guinée : site web vitrine ou avec réservation, présentation des chambres et services, visibilité Google, gestion des avis. Attirez les voyageurs.",
    keywords: [
      "site web pour hôtel Guinée",
      "site web hôtel Conakry",
      "création site hôtel Guinée",
      "système de réservation hôtel Guinée",
      "site web tourisme Guinée",
      "site web auberge Guinée",
      "site web restaurant Guinée",
      "visibilité Google hôtel Guinée",
      "réservation en ligne Guinée",
      "digitalisation hôtellerie Guinée",
    ],
  },
  {
    slug: "banque-microfinance",
    name: "Banque & microfinance",
    metaTitle: "Logiciels et solutions digitales pour banques et microfinance en Guinée",
    metaDescription:
      "Solutions digitales pour la banque et la microfinance en Guinée : logiciels sur mesure, applications de gestion, sites institutionnels sécurisés, automatisation des processus internes.",
    keywords: [
      "logiciel pour banque Guinée",
      "logiciel microfinance Guinée",
      "solution digitale banque Guinée",
      "site web institution financière Guinée",
      "développement logiciel bancaire Guinée",
      "application mobile microfinance Guinée",
      "automatisation processes banque Guinée",
      "informatisation microfinance Conakry",
    ],
  },
  {
    slug: "btp-construction",
    name: "BTP & construction",
    metaTitle: "Site web et logiciels pour entreprises de BTP en Guinée",
    metaDescription:
      "Solutions digitales pour le BTP et la construction en Guinée : site web vitrine de référence, gestion de chantiers et d'équipes, suivi de projets sur mesure. Projetez une image solide.",
    keywords: [
      "site web entreprise BTP Guinée",
      "site web construction Guinée",
      "logiciel BTP Guinée",
      "gestion de chantier Guinée logiciel",
      "site web architecte Guinée",
      "suivi de projet construction Guinée",
      "digitalisation BTP Guinée",
      "site web entreprise générale Guinée",
    ],
  },
  {
    slug: "ong-institutions",
    name: "ONG & institutions",
    metaTitle: "Sites web et outils digitaux pour ONG et institutions en Guinée",
    metaDescription:
      "Solutions digitales pour les ONG et institutions en Guinée : sites institutionnels multilingues, rapports en ligne, outils de suivi de projets, visibilité internationale. Communiquez votre impact.",
    keywords: [
      "site web ONG Guinée",
      "création site ONG Conakry",
      "site web association Guinée",
      "site web institution Guinée",
      "site web multilingue ONG",
      "site web projet international Guinée",
      "communication digitale ONG Guinée",
      "rapports en ligne ONG Guinée",
      "visibilité ONG Guinée",
    ],
  },
  {
    slug: "transport-logistique",
    name: "Transport & logistique",
    metaTitle: "Solutions digitales pour transport et logistique en Guinée",
    metaDescription:
      "Solutions digitales pour le transport et la logistique en Guinée : suivi des opérations, logiciels sur mesure, sites web pour sociétés de transport. Des outils qui suivent le rythme du terrain.",
    keywords: [
      "logiciel transport Guinée",
      "logistique Guinée logiciel",
      "site web transport Guinée",
      "site web société de transport Conakry",
      "suivi logistique Guinée",
      "digitalisation transport Guinée",
      "gestion flotte Guinée",
      "application transport Guinée",
    ],
  },
  {
    slug: "agriculture-agro",
    name: "Agriculture & agro-industrie",
    metaTitle: "Solutions digitales pour l'agriculture et l'agro-industrie en Guinée",
    metaDescription:
      "Solutions digitales pour l'agriculture et l'agro-industrie en Guinée : gestion de coopératives, suivi de production, sites web pour producteurs et transformateurs, vente en ligne.",
    keywords: [
      "logiciel agriculture Guinée",
      "digitalisation agriculture Guinée",
      "site web coopérative agricole Guinée",
      "site web agro-industrie Guinée",
      "gestion production agricole Guinée",
      "vente en ligne produits agricoles Guinée",
      "agritech Guinée",
      "suivi récoltes logiciel Guinée",
    ],
  },
  {
    slug: "mines-energie",
    name: "Mines & énergie",
    metaTitle: "Solutions digitales pour mines et énergie en Guinée",
    metaDescription:
      "Solutions digitales pour les mines et l'énergie en Guinée : logiciels sur mesure pour suivi d'opérations, sites institutionnels, tableaux de bord et automatisation. Des outils à la hauteur du secteur.",
    keywords: [
      "logiciel mine Guinée",
      "site web société minière Guinée",
      "digitalisation mines Guinée",
      "logiciel énergie Guinée",
      "suivi opérations minières Guinée",
      "site web compagnie minière Conakry",
      "tableau de bord mine Guinée",
      "informatisation secteur minier Guinée",
    ],
  },
  {
    slug: "medias",
    name: "Médias",
    metaTitle: "Sites web et plateformes pour médias en Guinée",
    metaDescription:
      "Solutions digitales pour les médias en Guinée : sites d'information rapides et modernes, rubriques éditoriales, sections vidéo, abonnements, monétisation et audience Google.",
    keywords: [
      "site web média Guinée",
      "création site d'information Guinée",
      "site web journal Guinée",
      "site web radio Guinée",
      "site web chaîne TV Guinée",
      "plateforme d'actualités Guinée",
      "site presse Guinée",
      "monétisation site média Guinée",
    ],
  },
  {
    slug: "telecoms-evenementiel",
    name: "Télécoms & événementiel",
    metaTitle: "Solutions digitales pour télécoms et événementiel en Guinée",
    metaDescription:
      "Solutions digitales pour les télécoms et l'événementiel en Guinée : sites web pour prestataires, billetterie en ligne, communication digitale d'événements, applications dédiées.",
    keywords: [
      "site web télécom Guinée",
      "site web événementiel Guinée",
      "billetterie en ligne Guinée",
      "site web organisateur d'événements Guinée",
      "communication événement Guinée",
      "application événement Guinée",
      "digitalisation événementiel Conakry",
    ],
  },
  {
    slug: "recrutement",
    name: "Recrutement",
    metaTitle: "Sites web et outils pour le recrutement en Guinée",
    metaDescription:
      "Solutions digitales pour le recrutement en Guinée : plateformes d'offres d'emploi, sites web de cabinets, gestion de candidatures, visibilité employeur sur Google.",
    keywords: [
      "site web cabinet de recrutement Guinée",
      "plateforme emploi Guinée",
      "site web recrutement Guinée",
      "gestion candidatures Guinée",
      "site offres d'emploi Guinée",
      "recrutement digital Conakry",
      "site web RH Guinée",
    ],
  },
];

/* ── 2-ter. MÉTA PAR ZONE (/zones — SEO local) ────────────────── */

export const ZONES_META = {
  title: "Agence digitale partout en Guinée — Conakry, Kankan, Nzérékoré, Boké…",
  description:
    "Création de sites web, logiciels et services digitaux dans toutes les régions de Guinée : Conakry (Kaloum, Dixinn, Ratoma…), Kankan, Nzérékoré, Boké, Kindia, Labé, Mamou, Faranah. Suivi à distance inclus, partout au pays et dans la diaspora.",
  keywords: PAGE_KEYWORDS.zones,
} as const;

/* ── 3. Builder de metadata par page ───────────────────────────── */

interface PageMetaInput {
  path: string;
  title: string;
  description: string;
  keywords?: string[];
  image?: string;
  type?: "website" | "article";
}

/** Codes de vérification moteurs (optionnels, via variables d'env). */
function verifications(): Metadata["verification"] {
  const v: NonNullable<Metadata["verification"]> = {};
  if (process.env.GOOGLE_SITE_VERIFICATION) {
    v.google = process.env.GOOGLE_SITE_VERIFICATION;
  }
  if (process.env.BING_SITE_VERIFICATION) {
    v.other = {
      "msvalidate.01": process.env.BING_SITE_VERIFICATION,
    };
  }
  return Object.keys(v).length > 0 ? v : undefined;
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
    alternates: {
      canonical: url,
      languages: {
        fr: url,
        en: url,
        "x-default": url,
      },
    },
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
    verification: verifications(),
  };
}

/* ── 4. Données structurées JSON-LD ────────────────────────────── */

type Json = Record<string, unknown>;

/** @id canonique de l'organisation — relie toutes les entités. */
export const ORG_ID = `${SITE_URL}/#organization`;

/** Organization + LocalBusiness (ProfessionalService) — global.
    Enrichi : géo, contact, réseaux, zones couvertes, champs « knowsAbout ». */
export function organizationJsonLd(): Json {
  return {
    "@context": "https://schema.org",
    "@type": ["Organization", "ProfessionalService", "LocalBusiness"],
    "@id": ORG_ID,
    name: BRAND,
    alternateName: ["EINSOF Guinée", "EINSOF Conakry", "EINSOF GN"],
    url: SITE_URL,
    logo: `${SITE_URL}/logo.svg`,
    image: `${SITE_URL}/images/hero-obsidienne.png`,
    description:
      "Agence digitale en Guinée : création de sites web professionnels, développement de logiciels sur mesure, applications mobiles, logiciels SaaS de gestion, community management, génération de leads et formations digitales. Basée à Conakry, active dans toutes les régions de Guinée.",
    slogan: "Votre présence digitale, notre métier.",
    priceRange: "1 500 000 - 50 000 000 GNF",
    currenciesAccepted: "GNF",
    paymentAccepted: "Espèces, Virement, Mobile Money",
    address: {
      "@type": "PostalAddress",
      addressLocality: GEO.city,
      addressCountry: GEO.countryCode,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: GEO_COORDS.latitude,
      longitude: GEO_COORDS.longitude,
    },
    areaServed: [
      { "@type": "Country", name: GEO.country },
      { "@type": "AdministrativeArea", name: `${GEO.city}, ${GEO.country}` },
      { "@type": "Place", name: GEO.region },
      ...ZONES.regions.map((r) => ({
        "@type": "AdministrativeArea",
        name: `${r}, ${GEO.country}`,
      })),
    ],
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "customer service",
        availableLanguage: ["French", "English"],
        areaServed: GEO.countryCode,
      },
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
    /* Signal sémantique fort : tout le domaine d'activité. */
    knowsAbout: [
      "création de site web",
      "développement de logiciels",
      "applications mobiles",
      "logiciels SaaS",
      "gestion d'entreprise",
      "facturation",
      "comptabilité",
      "gestion hospitalière",
      "gestion d'école",
      "gestion immobilière",
      "gestion de pharmacie",
      "community management",
      "réseaux sociaux",
      "publicité en ligne",
      "génération de leads",
      "prospection commerciale",
      "formations numériques",
      "stratégie digitale",
      "référencement Google",
      "e-commerce",
      "chatbot",
      "transformation numérique",
      "Guinée",
      "Conakry",
    ],
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
        ...WEB_RENEWALS_JSON(),
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

/** Renouvellements annuels + option paiement (catalogue officiel). */
function WEB_RENEWALS_JSON(): Json[] {
  return [
    {
      "@type": "Offer",
      name: "Renouvellement annuel — site vitrine",
      price: 500_000,
      priceCurrency: "GNF",
      description: "Nom de domaine et hébergement, par an.",
    },
    {
      "@type": "Offer",
      name: "Renouvellement annuel — site avec tableau de bord",
      price: 700_000,
      priceCurrency: "GNF",
      description: "Nom de domaine et hébergement, par an.",
    },
    {
      "@type": "Offer",
      name: "Système de paiement intégré (option)",
      price: 1_000_000,
      priceCurrency: "GNF",
      description: "Option disponible pour tout type de site.",
    },
  ];
}

/** WebSite + publisher (+ potentialAction pointant vers /blog). */
export function websiteJsonLd(): Json {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    url: SITE_URL,
    name: BRAND,
    inLanguage: "fr",
    publisher: { "@id": ORG_ID },
  };
}

/** ItemList — liste les entités d'une page hub (/services, /logiciels…). */
export function itemListJsonLd(opts: {
  path: string;
  name: string;
  items: { name: string; url: string; description?: string }[];
}): Json {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: opts.name,
    url: `${SITE_URL}${opts.path}`,
    numberOfItems: opts.items.length,
    itemListElement: opts.items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      url: it.url,
      ...(it.description ? { description: it.description } : {}),
    })),
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
    provider: { "@id": ORG_ID },
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
    author: { "@id": ORG_ID },
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

/** Course — pôle formations (/services/training). */
export function courseJsonLd(opts: {
  path: string;
  name: string;
  description: string;
  priceFrom?: number | null;
}): Json {
  return {
    "@context": "https://schema.org",
    "@type": "Course",
    name: opts.name,
    description: opts.description,
    url: `${SITE_URL}${opts.path}`,
    inLanguage: "fr",
    provider: {
      "@id": ORG_ID,
      "@type": "Organization",
      name: BRAND,
      sameAs: SITE_URL,
    },
    ...(opts.priceFrom
      ? {
          offers: {
            "@type": "Offer",
            price: opts.priceFrom,
            priceCurrency: "GNF",
            category: "À partir de",
            availability: "https://schema.org/InStock",
          },
        }
      : {}),
  };
}

/** HowTo — la méthode en 5 étapes (/methode). */
export function howToJsonLd(opts: {
  path: string;
  name: string;
  description: string;
  steps: { name: string; text: string }[];
}): Json {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: opts.name,
    description: opts.description,
    url: `${SITE_URL}${opts.path}`,
    inLanguage: "fr",
    totalTime: "P3W",
    step: opts.steps.map((s, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: s.name,
      text: s.text,
      url: `${SITE_URL}${opts.path}#etape-${i + 1}`,
    })),
  };
}

/** WebPage générique — relie chaque page au graphe du site. */
export function webPageJsonLd(opts: {
  path: string;
  name: string;
  description: string;
  type?: "WebPage" | "AboutPage" | "ContactPage" | "CollectionPage" | "QAPage";
}): Json {
  return {
    "@context": "https://schema.org",
    "@type": opts.type ?? "WebPage",
    name: opts.name,
    description: opts.description,
    url: opts.path === "/" ? SITE_URL : `${SITE_URL}${opts.path}`,
    inLanguage: "fr",
    isPartOf: { "@id": `${SITE_URL}/#website` },
    about: { "@id": ORG_ID },
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
  updatedAt?: string | null;
  keywords?: string[];
}): Json {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    url: `${SITE_URL}/blog/${post.slug}`,
    ...(post.publishedAt ? { datePublished: post.publishedAt } : {}),
    ...(post.updatedAt ? { dateModified: post.updatedAt } : {}),
    ...(post.keywords && post.keywords.length > 0
      ? { keywords: post.keywords.join(", ") }
      : {}),
    inLanguage: "fr",
    author: { "@id": ORG_ID },
    publisher: { "@id": ORG_ID },
    mainEntityOfPage: `${SITE_URL}/blog/${post.slug}`,
    image: `${SITE_URL}/images/hero-obsidienne.png`,
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
