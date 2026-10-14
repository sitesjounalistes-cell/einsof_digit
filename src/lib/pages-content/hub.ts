import type { Localized } from "@/lib/page-content";

/**
 * Contenu du hub de la page d'accueil — une carte par page du site.
 * Même principe que les autres modules de `src/lib/pages-content/` :
 * un objet localisé en 5 langues, consommé par `useLocalized`.
 */

export type HubIcon =
  | "layout"
  | "boxes"
  | "building"
  | "route"
  | "tag"
  | "award"
  | "news"
  | "users"
  | "help"
  | "mail";

export interface HubCard {
  href: string;
  num: string;
  icon: HubIcon;
  title: string;
  desc: string;
}

export interface HubContent {
  label: string;
  title: string;
  gold: string;
  sub: string;
  discover: string;
  cards: HubCard[];
}

export const HUB: Localized<HubContent> = {
  fr: {
    label: "Explorer le site",
    title: "Chaque sujet mérite",
    gold: "sa page.",
    sub: "Services, logiciels, secteurs, méthode, tarifs, réalisations, journal, à propos, FAQ et contact : chaque page détaille un sujet, en profondeur.",
    discover: "Découvrir",
    cards: [
      {
        href: "/services",
        num: "01",
        icon: "layout",
        title: "Services",
        desc: "Sites web, logiciels sur mesure, SaaS, community management, acquisition, formations et stratégie : sept pôles complémentaires.",
      },
      {
        href: "/logiciels",
        num: "02",
        icon: "boxes",
        title: "Logiciels SaaS",
        desc: "Six outils de gestion prêts à l'emploi — facturation, comptabilité, santé, école, immobilier, pharmacie — avec essai gratuit de 7 jours.",
      },
      {
        href: "/secteurs",
        num: "03",
        icon: "building",
        title: "Secteurs",
        desc: "BTP, santé, éducation, mines, immobilier… tous les domaines d'activité, avec une connaissance fine du terrain guinéen.",
      },
      {
        href: "/methode",
        num: "04",
        icon: "route",
        title: "Méthode",
        desc: "Cinq étapes, zéro surprise : écoute, conception, développement, livraison et suivi pendant toute la collaboration.",
      },
      {
        href: "/tarifs",
        num: "05",
        icon: "tag",
        title: "Tarifs",
        desc: "Des prix clairs, annoncés d'avance, en francs guinéens. Sites web, logiciels sur mesure et abonnements SaaS.",
      },
      {
        href: "/realisations",
        num: "06",
        icon: "award",
        title: "Réalisations",
        desc: "Projets livrés, clients accompagnés et partenaires qui nous font confiance depuis sept ans.",
      },
      {
        href: "/blog",
        num: "07",
        icon: "news",
        title: "Journal",
        desc: "Actualités de l'agence et conseils d'experts pour réussir votre transformation digitale.",
      },
      {
        href: "/a-propos",
        num: "08",
        icon: "users",
        title: "À propos",
        desc: "Sept ans d'expérience, une équipe d'experts passionnés et deux promesses qui ne bougent pas.",
      },
      {
        href: "/faq",
        num: "09",
        icon: "help",
        title: "FAQ",
        desc: "Réponses claires aux questions les plus fréquentes : délais, tarifs, maintenance, langues et support.",
      },
      {
        href: "/contact",
        num: "10",
        icon: "mail",
        title: "Contact",
        desc: "Parlons de votre projet : devis sous 48 h, démo guidée et essai gratuit des SaaS.",
      },
    ],
  },
  en: {
    label: "Explore the site",
    title: "Every topic deserves",
    gold: "its own page.",
    sub: "Services, software, sectors, method, pricing, work, journal, about, FAQ and contact: each page covers one topic in depth.",
    discover: "Discover",
    cards: [
      {
        href: "/services",
        num: "01",
        icon: "layout",
        title: "Services",
        desc: "Websites, custom software, SaaS, social media management, client acquisition, training and strategy: seven complementary areas.",
      },
      {
        href: "/logiciels",
        num: "02",
        icon: "boxes",
        title: "SaaS software",
        desc: "Six ready-to-use management tools — invoicing, accounting, health, schools, real estate, pharmacy — with a 7-day free trial.",
      },
      {
        href: "/secteurs",
        num: "03",
        icon: "building",
        title: "Sectors",
        desc: "Construction, health, education, mining, real estate… every line of business, with deep knowledge of the Guinean market.",
      },
      {
        href: "/methode",
        num: "04",
        icon: "route",
        title: "Method",
        desc: "Five steps, zero surprises: listening, design, development, delivery and follow-up throughout the collaboration.",
      },
      {
        href: "/tarifs",
        num: "05",
        icon: "tag",
        title: "Pricing",
        desc: "Clear prices, announced upfront, in Guinean francs. Websites, custom software and SaaS subscriptions.",
      },
      {
        href: "/realisations",
        num: "06",
        icon: "award",
        title: "Our work",
        desc: "Delivered projects, supported clients and partners who have trusted us for seven years.",
      },
      {
        href: "/blog",
        num: "07",
        icon: "news",
        title: "Journal",
        desc: "Agency news and expert advice to make your digital transformation a success.",
      },
      {
        href: "/a-propos",
        num: "08",
        icon: "users",
        title: "About",
        desc: "Seven years of experience, a team of passionate experts and two promises that never move.",
      },
      {
        href: "/faq",
        num: "09",
        icon: "help",
        title: "FAQ",
        desc: "Clear answers to the most frequent questions: timelines, pricing, maintenance, languages and support.",
      },
      {
        href: "/contact",
        num: "10",
        icon: "mail",
        title: "Contact",
        desc: "Let's talk about your project: quotes within 48 hours, guided demo and free SaaS trial.",
      },
    ],
  },
  es: {
    label: "Explorar el sitio",
    title: "Cada tema merece",
    gold: "su página.",
    sub: "Servicios, software, sectores, método, tarifas, realizaciones, diario, acerca de, FAQ y contacto: cada página trata un tema en profundidad.",
    discover: "Descubrir",
    cards: [
      {
        href: "/services",
        num: "01",
        icon: "layout",
        title: "Servicios",
        desc: "Sitios web, software a medida, SaaS, community management, adquisición, formación y estrategia: siete polos complementarios.",
      },
      {
        href: "/logiciels",
        num: "02",
        icon: "boxes",
        title: "Software SaaS",
        desc: "Seis herramientas de gestión listas para usar — facturación, contabilidad, salud, escuela, inmobiliaria, farmacia — con prueba gratis de 7 días.",
      },
      {
        href: "/secteurs",
        num: "03",
        icon: "building",
        title: "Sectores",
        desc: "Construcción, salud, educación, minería, inmobiliaria… todos los sectores, con un conocimiento profundo del terreno guineano.",
      },
      {
        href: "/methode",
        num: "04",
        icon: "route",
        title: "Método",
        desc: "Cinco pasos, cero sorpresas: escucha, diseño, desarrollo, entrega y seguimiento durante toda la colaboración.",
      },
      {
        href: "/tarifs",
        num: "05",
        icon: "tag",
        title: "Tarifas",
        desc: "Precios claros, anunciados de antemano, en francos guineanos. Sitios web, software a medida y suscripciones SaaS.",
      },
      {
        href: "/realisations",
        num: "06",
        icon: "award",
        title: "Realizaciones",
        desc: "Proyectos entregados, clientes acompañados y socios que confían en nosotros desde hace siete años.",
      },
      {
        href: "/blog",
        num: "07",
        icon: "news",
        title: "Diario",
        desc: "Noticias de la agencia y consejos de expertos para lograr su transformación digital.",
      },
      {
        href: "/a-propos",
        num: "08",
        icon: "users",
        title: "Acerca de",
        desc: "Siete años de experiencia, un equipo de expertos apasionados y dos promesas que no cambian.",
      },
      {
        href: "/faq",
        num: "09",
        icon: "help",
        title: "FAQ",
        desc: "Respuestas claras a las preguntas más frecuentes: plazos, tarifas, mantenimiento, idiomas y soporte.",
      },
      {
        href: "/contact",
        num: "10",
        icon: "mail",
        title: "Contacto",
        desc: "Hablemos de su proyecto: presupuesto en 48 h, demo guiada y prueba gratuita de los SaaS.",
      },
    ],
  },
  zh: {
    label: "探索网站",
    title: "每个主题，",
    gold: "独立成页。",
    sub: "服务、软件、行业、方法论、价格、案例、日志、关于、常见问题与联系：每一页都深入讲解一个主题。",
    discover: "了解详情",
    cards: [
      {
        href: "/services",
        num: "01",
        icon: "layout",
        title: "服务",
        desc: "网站、定制软件、SaaS、社交媒体运营、获客、培训与战略：七大互补业务板块。",
      },
      {
        href: "/logiciels",
        num: "02",
        icon: "boxes",
        title: "SaaS 软件",
        desc: "六款即开即用的管理软件——开票、会计、医疗、学校、物业、药房——附 7 天免费试用。",
      },
      {
        href: "/secteurs",
        num: "03",
        icon: "building",
        title: "行业",
        desc: "建筑、医疗、教育、矿业、房地产……覆盖所有行业，深谙几内亚本地市场。",
      },
      {
        href: "/methode",
        num: "04",
        icon: "route",
        title: "方法论",
        desc: "五个步骤，零意外：倾听、设计、开发、交付与全程跟进。",
      },
      {
        href: "/tarifs",
        num: "05",
        icon: "tag",
        title: "价格",
        desc: "价格透明，提前公布，以几内亚法郎计。网站、定制软件与 SaaS 订阅。",
      },
      {
        href: "/realisations",
        num: "06",
        icon: "award",
        title: "案例",
        desc: "已交付的项目、长期陪伴的客户，以及七年来信任我们的合作伙伴。",
      },
      {
        href: "/blog",
        num: "07",
        icon: "news",
        title: "日志",
        desc: "公司动态与专家建议，助力您的数字化转型。",
      },
      {
        href: "/a-propos",
        num: "08",
        icon: "users",
        title: "关于我们",
        desc: "七年经验、充满热情的专家团队，以及两条永不改变的承诺。",
      },
      {
        href: "/faq",
        num: "09",
        icon: "help",
        title: "常见问题",
        desc: "关于工期、价格、维护、语言与支持的常见问题，一一解答。",
      },
      {
        href: "/contact",
        num: "10",
        icon: "mail",
        title: "联系我们",
        desc: "聊聊您的项目：48 小时内报价、引导式演示与 SaaS 免费试用。",
      },
    ],
  },
  de: {
    label: "Die Website erkunden",
    title: "Jedes Thema verdient",
    gold: "seine eigene Seite.",
    sub: "Services, Software, Branchen, Methode, Preise, Referenzen, Journal, Über uns, FAQ und Kontakt: Jede Seite behandelt ein Thema ausführlich.",
    discover: "Entdecken",
    cards: [
      {
        href: "/services",
        num: "01",
        icon: "layout",
        title: "Services",
        desc: "Websites, maßgeschneiderte Software, SaaS, Social-Media-Management, Kundengewinnung, Schulungen und Strategie: sieben komplementäre Bereiche.",
      },
      {
        href: "/logiciels",
        num: "02",
        icon: "boxes",
        title: "SaaS-Software",
        desc: "Sechs einsatzbereite Verwaltungstools — Rechnungswesen, Buchhaltung, Gesundheit, Schule, Immobilien, Apotheke — mit 7 Tagen Gratisphase.",
      },
      {
        href: "/secteurs",
        num: "03",
        icon: "building",
        title: "Branchen",
        desc: "Bau, Gesundheit, Bildung, Bergbau, Immobilien… jede Branche, mit feinem Gespür für den guineischen Markt.",
      },
      {
        href: "/methode",
        num: "04",
        icon: "route",
        title: "Methode",
        desc: "Fünf Schritte, null Überraschungen: Zuhören, Konzeption, Entwicklung, Auslieferung und Betreuung während der gesamten Zusammenarbeit.",
      },
      {
        href: "/tarifs",
        num: "05",
        icon: "tag",
        title: "Preise",
        desc: "Klare Preise, im Voraus angekündigt, in guineischen Francs. Websites, Individualsoftware und SaaS-Abos.",
      },
      {
        href: "/realisations",
        num: "06",
        icon: "award",
        title: "Referenzen",
        desc: "Abgeschlossene Projekte, betreute Kunden und Partner, die uns seit sieben Jahren vertrauen.",
      },
      {
        href: "/blog",
        num: "07",
        icon: "news",
        title: "Journal",
        desc: "News der Agentur und Expertenrat für eine erfolgreiche digitale Transformation.",
      },
      {
        href: "/a-propos",
        num: "08",
        icon: "users",
        title: "Über uns",
        desc: "Sieben Jahre Erfahrung, ein Team leidenschaftlicher Experten und zwei Versprechen, die sich nie ändern.",
      },
      {
        href: "/faq",
        num: "09",
        icon: "help",
        title: "FAQ",
        desc: "Klare Antworten auf die häufigsten Fragen: Fristen, Preise, Wartung, Sprachen und Support.",
      },
      {
        href: "/contact",
        num: "10",
        icon: "mail",
        title: "Kontakt",
        desc: "Sprechen wir über Ihr Projekt: Angebot in 48 Stunden, geführte Demo und gratis SaaS-Testphase.",
      },
    ],
  },
};
