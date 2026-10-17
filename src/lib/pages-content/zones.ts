import type { Localized } from "@/lib/page-content";

/**
 * Contenu de la page /zones — « Agence digitale partout en Guinée ».
 * SEO local : les 8 régions administratives, les grandes villes,
 * les quartiers de Conakry et la diaspora guinéenne.
 * FR uniquement : les autres langues retombent automatiquement sur le
 * français via le fallback de `useLocalized` (mécanisme prévu).
 */

export interface ZonesRegionCard {
  /** Nom de la région administrative (ex. Kankan, Nzérékoré…) */
  name: string;
  /** Villes réelles desservies dans cette région */
  cities: string[];
  /** Comment nous travaillons avec vous (1-2 phrases) */
  how: string;
}

export interface ZonesFaqItem {
  q: string;
  a: string;
}

export interface ZonesCrossLink {
  href: string;
  title: string;
  desc: string;
}

export interface ZonesContent {
  hero: {
    label: string;
    title: string;
    gold: string;
    sub: string;
    chips: string[];
  };
  intro: {
    p1: string;
    p2: string;
    naturellesLabel: string;
  };
  capitale: {
    label: string;
    title: string;
    gold: string;
    text: string;
    quartiersLabel: string;
    note: string;
    ctaLabel: string;
  };
  regions: {
    label: string;
    title: string;
    gold: string;
    sub: string;
    howLabel: string;
    items: ZonesRegionCard[];
  };
  diaspora: {
    label: string;
    title: string;
    gold: string;
    text: string;
    ctaLabel: string;
  };
  faq: {
    label: string;
    title: string;
    gold: string;
    sub: string;
    items: ZonesFaqItem[];
  };
  cta: {
    title: string;
    gold: string;
    sub: string;
    primaryLabel: string;
    secondaryLabel: string;
  };
  crossLinks: {
    title: string;
    items: ZonesCrossLink[];
  };
}

export const ZONES_PAGE: Localized<ZonesContent> = {
  fr: {
    hero: {
      label: "09 — Zones",
      title: "Partout en Guinée,",
      gold: "sans exception.",
      sub: "De Conakry à Nzérékoré, de Kankan à Labé et Boké : EINSOF crée des sites web, des logiciels et des solutions digitales pour les entreprises de toutes les régions de Guinée — avec un suivi à distance inclus, où que vous soyez.",
      chips: [
        "Conakry & intérieur du pays",
        "Suivi à distance inclus",
        "Déplacements sur rendez-vous",
      ],
    },
    intro: {
      p1: "Depuis Conakry, EINSOF assure la création de site web partout en Guinée. Agence digitale présente à Conakry comme dans les régions, nous livrons des sites vitrines, des boutiques en ligne et des logiciels de gestion à Kankan, Nzérékoré, Boké, Kindia, Labé, Mamou et Faranah — avec les mêmes délais, les mêmes prix affichés et la même qualité de finition qu'au siège.",
      p2: "Notre organisation 100 % numérique — visioconférence, WhatsApp, échange de documents en ligne — garantit un suivi à distance fluide, sans frais de déplacement pour vous. Et quand le projet le mérite, nos équipes se déplacent sur rendez-vous : relevés sur site, formation des équipes, lancement officiel. Où que soit votre entreprise, votre projet avance tous les jours.",
      naturellesLabel: "Les quatre régions naturelles couvertes",
    },
    capitale: {
      label: "Conakry — notre base",
      title: "À Conakry,",
      gold: "nous sommes chez nous.",
      text: "Notre agence digitale est basée à Conakry, la capitale : c'est ici que nous concevons vos sites et vos logiciels, et d'où partent nos déplacements en région. Rendez-vous dans nos bureaux ou chez vous, dans tous les quartiers de la ville — ou tout à distance, comme vous préférez.",
      quartiersLabel: "Quartiers de Conakry desservis",
      note: "Rendez-vous sur place, démonstration en direct, remise des clés en main propre — ou tout à distance si votre agenda est serré.",
      ctaLabel: "Demander un devis — Conakry",
    },
    regions: {
      label: "Les 8 régions",
      title: "Chaque région de Guinée,",
      gold: "une équipe à votre écoute.",
      sub: "Boké, Conakry, Faranah, Kankan, Kindia, Labé, Mamou, Nzérékoré : voici comment nous travaillons dans chaque région. Dans chaque ville, le suivi à distance est inclus et les visites se planifient au fil du projet.",
      howLabel: "Comment nous travaillons avec vous",
      items: [
        {
          name: "Boké",
          cities: ["Boké", "Kamsar", "Fria"],
          how: "Suivi à distance quotidien par WhatsApp et visioconférence, visites planifiées à Boké et à Kamsar pour les projets industriels et miniers, livraison et formation en ligne.",
        },
        {
          name: "Conakry",
          cities: ["Conakry", "Kaloum", "Dixinn", "Ratoma", "Matam"],
          how: "Notre base : rendez-vous dans nos bureaux ou chez vous dans tous les quartiers, démonstrations en direct et accompagnement en présentiel autant que nécessaire.",
        },
        {
          name: "Faranah",
          cities: ["Faranah"],
          how: "Projets menés à distance de bout en bout : ateliers de cadrage en visioconférence, validations par email et WhatsApp, mise en ligne suivie d'une formation des équipes.",
        },
        {
          name: "Kankan",
          cities: ["Kankan", "Siguiri", "Kouroussa"],
          how: "Cœur de la Haute Guinée : ateliers en visioconférence, visites planifiées à Kankan et à Siguiri pour les relevés et les formations, livraison en ligne.",
        },
        {
          name: "Kindia",
          cities: ["Kindia", "Coyah", "Dubréka"],
          how: "À une heure de Conakry : déplacements faciles à organiser sur rendez-vous, suivi à distance entre les étapes, formation des équipes sur place à la livraison.",
        },
        {
          name: "Labé",
          cities: ["Labé", "Pita", "Dalaba", "Télimélé"],
          how: "Au cœur du Fouta Djallon : suivi à distance rigoureux, déplacements planifiés pour les projets qui le demandent, formation et support en visioconférence.",
        },
        {
          name: "Mamou",
          cities: ["Mamou", "Dabola"],
          how: "Carrefour des régions : réunions de suivi en visioconférence, passages sur rendez-vous lors de nos tournées, recette et mise en ligne à distance.",
        },
        {
          name: "Nzérékoré",
          cities: ["Nzérékoré", "Guéckédou", "Macenta", "Kissidougou", "Beyla"],
          how: "Guinée forestière : ateliers à distance, visites planifiées à Nzérékoré pour les lancements importants, support quotidien par WhatsApp et téléphone.",
        },
      ],
    },
    diaspora: {
      label: "Diaspora",
      title: "Guinéens de l'extérieur,",
      gold: "nous travaillons aussi pour vous.",
      text: "Vous êtes de la diaspora guinéenne, en Afrique francophone — Sénégal, Côte d'Ivoire, Mali, Sierra Leone, Liberia — ou ailleurs dans le monde ? Nous pilotons votre projet à distance de bout en bout : visioconférence à vos horaires, échanges documentés par email et WhatsApp, avancement visible en ligne et un interlocuteur unique sur le terrain, en Guinée. Site web de votre activité locale, logiciel de gestion, accompagnement digital : tout se décide et se suit sans vous déplacer.",
      ctaLabel: "Démarrer mon projet à distance",
    },
    faq: {
      label: "Zones & distance",
      title: "Vos questions",
      gold: "sur le terrain.",
      sub: "Création de site web en région, projets à distance, déplacements, diaspora : les réponses que l'on nous pose le plus souvent.",
      items: [
        {
          q: "Créez-vous des sites web en dehors de Conakry ?",
          a: "Oui. Nous créons des sites web dans toutes les régions de Guinée : Kankan, Nzérékoré, Boké, Kindia, Labé, Mamou, Faranah et leurs villes — Siguiri, Kouroussa, Guéckédou, Macenta, Kamsar, Pita, Dalaba et bien d'autres. Le suivi se fait à distance (visioconférence, WhatsApp, email) avec des déplacements planifiés sur rendez-vous quand le projet le demande. Mêmes délais et mêmes prix affichés qu'à Conakry.",
        },
        {
          q: "Comment se déroule un projet à distance ?",
          a: "Exactement comme sur place, avec plus de souplesse. Un appel de cadrage en visioconférence fixe les objectifs ; vous suivez l'avancement à travers des maquettes et des démonstrations en ligne ; les validations se font par email ou WhatsApp. À la livraison, nous formons vos équipes en visioconférence et restons disponibles pour le support. Aucune étape n'est sautée.",
        },
        {
          q: "Vous déplacez-vous en région ?",
          a: "Oui, sur rendez-vous. Nos équipes se déplacent dans les huit régions pour les étapes qui le méritent : relevés sur site, formation des équipes, lancement officiel, captation de photos et de contenus. Ces déplacements sont planifiés dès le début du projet et annoncés clairement dans le devis — sans surprise.",
        },
        {
          q: "Travaillez-vous avec la diaspora guinéenne ?",
          a: "Oui. Une grande partie de nos projets est pilotée depuis l'étranger : la diaspora guinéenne et les investisseurs d'Afrique francophone nous confient la création de sites web et de logiciels pour leurs activités en Guinée. Tout se gère à distance — visioconférence, paiements documentés, comptes rendus écrits — avec un interlocuteur unique sur place.",
        },
      ],
    },
    cta: {
      title: "Votre ville n'est pas listée ?",
      gold: "Parlons-en quand même.",
      sub: "Création de site web, logiciel, accompagnement digital : où que vous soyez en Guinée ou dans la diaspora, le premier échange est gratuit et sans engagement.",
      primaryLabel: "Démarrer mon projet",
      secondaryLabel: "Voir nos tarifs",
    },
    crossLinks: {
      title: "Explorer aussi",
      items: [
        {
          href: "/services",
          title: "Nos services",
          desc: "Les 7 pôles : sites web, logiciels, applications, community management, acquisition, formations, stratégie digitale.",
        },
        {
          href: "/secteurs",
          title: "Secteurs d'activité",
          desc: "Santé, éducation, immobilier, commerce, mines, ONG : nos solutions par métier, adaptées aux réalités du terrain guinéen.",
        },
        {
          href: "/tarifs",
          title: "Tarifs officiels",
          desc: "Prix affichés en GNF, sans surprise : sites web à partir de 1 500 000 GNF, logiciels sur mesure, SaaS de gestion.",
        },
        {
          href: "/faq",
          title: "Questions fréquentes",
          desc: "Délais, maintenance, propriété du code, formation, langues : les réponses claires avant de démarrer.",
        },
      ],
    },
  },
} as Localized<ZonesContent>;
