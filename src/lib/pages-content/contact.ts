import type { Localized } from "@/lib/page-content";

/**
 * Contenu de la page /contact — 5 langues complètes.
 * Faits utilisés uniquement : réponse sous 24 h ouvrées, devis sous 48 h,
 * horaires Lun–Ven 8 h–18 h (translations.ts), 3 formules web et 6 SaaS
 * avec essai 7 jours, logiciel sur mesure dès 20 000 000 GNF (catalog.ts).
 * Aucun nom de client, chiffre ou témoignage inventé.
 */

export type HelpIcon = "site" | "saas" | "bespoke" | "faq";

export interface HelpCard {
  icon: HelpIcon;
  title: string;
  text: string;
  ctaLabel: string;
  href: string;
}

export interface ContactPageContent {
  hero: {
    label: string;
    title: string;
    gold: string;
    sub: string;
    chips: string[];
  };
  help: {
    label: string;
    title: string;
    gold: string;
    sub: string;
    cards: HelpCard[];
  };
  crossLinks: {
    title: string;
    items: { href: string; title: string; desc: string }[];
  };
}

export const CONTACT: Localized<ContactPageContent> = {
  fr: {
    hero: {
      label: "15 — Contact",
      title: "Parlons de",
      gold: "votre projet.",
      sub: "Décrivez votre besoin en deux minutes. Nous répondons sous 24 heures ouvrées.",
      chips: [
        "Réponse sous 24 h ouvrées",
        "Devis détaillé sous 48 h",
        "Lun – Ven, 8 h – 18 h",
      ],
    },
    help: {
      label: "Avant d'écrire",
      title: "Vous ne savez pas",
      gold: "par où commencer ?",
      sub: "Quatre points d'entrée selon votre besoin : comparez, explorez ou lisez — et si la réponse n'y est pas, le formulaire reste le plus court chemin.",
      cards: [
        {
          icon: "site",
          title: "Vous voulez un site ?",
          text: "Comparez nos trois formules : site vitrine, site avec tableau de bord et boutique en ligne. Chaque prix est annoncé d'avance, en francs guinéens, avec le détail de ce qui est inclus.",
          ctaLabel: "Comparer les formules",
          href: "/tarifs",
        },
        {
          icon: "saas",
          title: "Vous cherchez un logiciel de gestion ?",
          text: "Six outils prêts à l'emploi couvrent l'essentiel : facturation, comptabilité, santé, école, immobilier et pharmacie. Chacun s'essaie gratuitement pendant 7 jours.",
          ctaLabel: "Voir les six logiciels",
          href: "/logiciels",
        },
        {
          icon: "bespoke",
          title: "Un besoin spécifique ?",
          text: "Nous développons des logiciels sur mesure, à partir de 20 000 000 GNF, après une étude personnalisée de vos processus. Décrivez votre besoin : nous proposons une solution adaptée, pas un catalogue.",
          ctaLabel: "Explorer nos services",
          href: "/services",
        },
        {
          icon: "faq",
          title: "Une question rapide ?",
          text: "Délais, maintenance, langues de travail, support, modalités de paiement : la FAQ rassemble les réponses aux questions que nos clients posent le plus souvent.",
          ctaLabel: "Consulter la FAQ",
          href: "/faq",
        },
      ],
    },
    crossLinks: {
      title: "Explorer aussi",
      items: [
        {
          href: "/tarifs",
          title: "Tarifs",
          desc: "Tous nos prix en francs guinéens : sites web, logiciels sur mesure et abonnements SaaS, annoncés d'avance.",
        },
        {
          href: "/services",
          title: "Services",
          desc: "Sept pôles complémentaires, un seul interlocuteur pour tout votre digital.",
        },
        {
          href: "/faq",
          title: "FAQ",
          desc: "Les réponses claires aux questions les plus fréquentes sur nos offres et notre méthode.",
        },
      ],
    },
  },
  en: {
    hero: {
      label: "15 — Contact",
      title: "Let's talk about",
      gold: "your project.",
      sub: "Describe your need in two minutes. We reply within 24 working hours.",
      chips: [
        "Reply within 24 working hours",
        "Detailed quote within 48 h",
        "Mon – Fri, 8 am – 6 pm",
      ],
    },
    help: {
      label: "Before you write",
      title: "Not sure where",
      gold: "to start?",
      sub: "Four entry points depending on your need: compare, explore or read — and if the answer isn't there, the form remains the shortest path.",
      cards: [
        {
          icon: "site",
          title: "You want a website?",
          text: "Compare our three plans: showcase site, site with dashboard and online store. Every price is announced upfront, in Guinean francs, with the details of what is included.",
          ctaLabel: "Compare the plans",
          href: "/tarifs",
        },
        {
          icon: "saas",
          title: "You need management software?",
          text: "Six ready-to-use tools cover the essentials: invoicing, accounting, health, schools, real estate and pharmacy. Each one comes with a free 7-day trial.",
          ctaLabel: "See the six tools",
          href: "/logiciels",
        },
        {
          icon: "bespoke",
          title: "A specific need?",
          text: "We build custom software, from 20,000,000 GNF, after a personalised study of your processes. Describe your need: we propose a tailored solution, not a catalogue.",
          ctaLabel: "Explore our services",
          href: "/services",
        },
        {
          icon: "faq",
          title: "A quick question?",
          text: "Timelines, maintenance, working languages, support, payment terms: the FAQ gathers the answers to the questions our clients ask most often.",
          ctaLabel: "Read the FAQ",
          href: "/faq",
        },
      ],
    },
    crossLinks: {
      title: "Explore more",
      items: [
        {
          href: "/tarifs",
          title: "Pricing",
          desc: "All our prices in Guinean francs: websites, custom software and SaaS subscriptions, announced upfront.",
        },
        {
          href: "/services",
          title: "Services",
          desc: "Seven complementary areas, one single contact for your entire digital presence.",
        },
        {
          href: "/faq",
          title: "FAQ",
          desc: "Clear answers to the most frequent questions about our offers and our method.",
        },
      ],
    },
  },
  es: {
    hero: {
      label: "15 — Contacto",
      title: "Hablemos de",
      gold: "su proyecto.",
      sub: "Describa su necesidad en dos minutos. Respondemos en 24 horas laborables.",
      chips: [
        "Respuesta en 24 h laborables",
        "Presupuesto detallado en 48 h",
        "Lun – Vie, 8 h – 18 h",
      ],
    },
    help: {
      label: "Antes de escribir",
      title: "¿No sabe por",
      gold: "dónde empezar?",
      sub: "Cuatro puntos de entrada según su necesidad: compare, explore o lea — y si la respuesta no está ahí, el formulario sigue siendo el camino más corto.",
      cards: [
        {
          icon: "site",
          title: "¿Quiere un sitio web?",
          text: "Compare nuestras tres fórmulas: sitio corporativo, sitio con panel de administración y tienda en línea. Cada precio se anuncia de antemano, en francos guineanos, con el detalle de lo incluido.",
          ctaLabel: "Comparar las fórmulas",
          href: "/tarifs",
        },
        {
          icon: "saas",
          title: "¿Busca un software de gestión?",
          text: "Seis herramientas listas para usar cubren lo esencial: facturación, contabilidad, salud, escuela, inmobiliaria y farmacia. Cada una se prueba gratis durante 7 días.",
          ctaLabel: "Ver los seis software",
          href: "/logiciels",
        },
        {
          icon: "bespoke",
          title: "¿Una necesidad específica?",
          text: "Desarrollamos software a medida, a partir de 20 000 000 GNF, tras un estudio personalizado de sus procesos. Describa su necesidad: proponemos una solución adaptada, no un catálogo.",
          ctaLabel: "Explorar nuestros servicios",
          href: "/services",
        },
        {
          icon: "faq",
          title: "¿Una pregunta rápida?",
          text: "Plazos, mantenimiento, idiomas de trabajo, soporte, modalidades de pago: la FAQ reúne las respuestas a las preguntas que nuestros clientes hacen con más frecuencia.",
          ctaLabel: "Consultar la FAQ",
          href: "/faq",
        },
      ],
    },
    crossLinks: {
      title: "Explorar también",
      items: [
        {
          href: "/tarifs",
          title: "Tarifas",
          desc: "Todos nuestros precios en francos guineanos: sitios web, software a medida y suscripciones SaaS, anunciados de antemano.",
        },
        {
          href: "/services",
          title: "Servicios",
          desc: "Siete polos complementarios, un solo interlocutor para todo su digital.",
        },
        {
          href: "/faq",
          title: "FAQ",
          desc: "Respuestas claras a las preguntas más frecuentes sobre nuestras ofertas y nuestro método.",
        },
      ],
    },
  },
  zh: {
    hero: {
      label: "15 — 联系",
      title: "聊聊",
      gold: "您的项目。",
      sub: "花两分钟描述您的需求。我们会在 24 个工作小时内回复。",
      chips: ["24 个工作小时内回复", "48 小时内详细报价", "周一至周五 8:00–18:00"],
    },
    help: {
      label: "写下需求之前",
      title: "不知该",
      gold: "从哪里开始？",
      sub: "根据您的需求，提供四个入口：比较、浏览或阅读——如果没有找到答案，表单依然是最短的路径。",
      cards: [
        {
          icon: "site",
          title: "您想要一个网站？",
          text: "比较我们的三种方案：展示型网站、带管理面板的网站和在线商店。每个价格都以几内亚法郎提前公布，并写明所含内容。",
          ctaLabel: "比较三种方案",
          href: "/tarifs",
        },
        {
          icon: "saas",
          title: "您在找管理软件？",
          text: "六款即开即用的工具覆盖核心需求：开票、会计、医疗、学校、物业和药房。每款均可免费试用 7 天。",
          ctaLabel: "查看六款软件",
          href: "/logiciels",
        },
        {
          icon: "bespoke",
          title: "有特殊需求？",
          text: "我们开发定制软件，2000 万几内亚法郎起，并在充分研究您的流程后给出个性化方案。描述您的需求：我们提供量身定制的解决方案，而不是产品目录。",
          ctaLabel: "浏览我们的服务",
          href: "/services",
        },
        {
          icon: "faq",
          title: "有个快速问题？",
          text: "工期、维护、工作语言、支持、付款方式：常见问题页面汇总了客户最常问的问题及解答。",
          ctaLabel: "查看常见问题",
          href: "/faq",
        },
      ],
    },
    crossLinks: {
      title: "继续探索",
      items: [
        {
          href: "/tarifs",
          title: "价格",
          desc: "以几内亚法郎公开的全部价格：网站、定制软件与 SaaS 订阅，提前公布。",
        },
        {
          href: "/services",
          title: "服务",
          desc: "七大互补业务板块，一个对接人负责您的全部数字化事务。",
        },
        {
          href: "/faq",
          title: "常见问题",
          desc: "关于我们的方案与方法论的最常见问题，一一清晰解答。",
        },
      ],
    },
  },
  de: {
    hero: {
      label: "15 — Kontakt",
      title: "Sprechen wir über",
      gold: "Ihr Projekt.",
      sub: "Beschreiben Sie Ihr Anliegen in zwei Minuten. Wir antworten innerhalb von 24 Arbeitsstunden.",
      chips: [
        "Antwort in 24 Arbeitsstunden",
        "Detailangebot in 48 Stunden",
        "Mo – Fr, 8 – 18 Uhr",
      ],
    },
    help: {
      label: "Bevor Sie schreiben",
      title: "Sie wissen nicht,",
      gold: "wo Sie anfangen sollen?",
      sub: "Vier Einstiege je nach Bedarf: vergleichen, erkunden oder lesen — und wenn die Antwort nicht dabei ist, bleibt das Formular der kürzeste Weg.",
      cards: [
        {
          icon: "site",
          title: "Sie möchten eine Website?",
          text: "Vergleichen Sie unsere drei Pakete: Webauftritt, Website mit Dashboard und Online-Shop. Jeder Preis wird im Voraus angekündigt, in guineischen Francs, mit Details zum Leistungsumfang.",
          ctaLabel: "Pakete vergleichen",
          href: "/tarifs",
        },
        {
          icon: "saas",
          title: "Sie suchen Verwaltungssoftware?",
          text: "Sechs einsatzbereite Tools decken das Wesentliche ab: Rechnungswesen, Buchhaltung, Gesundheit, Schule, Immobilien und Apotheke. Jedes davon 7 Tage gratis testen.",
          ctaLabel: "Die sechs Tools ansehen",
          href: "/logiciels",
        },
        {
          icon: "bespoke",
          title: "Ein besonderer Bedarf?",
          text: "Wir entwickeln Individualsoftware ab 20.000.000 GNF, nach einer persönlichen Analyse Ihrer Abläufe. Beschreiben Sie Ihr Anliegen: Wir schlagen eine passende Lösung vor, keinen Katalog.",
          ctaLabel: "Unsere Services erkunden",
          href: "/services",
        },
        {
          icon: "faq",
          title: "Eine kurze Frage?",
          text: "Fristen, Wartung, Arbeitssprachen, Support, Zahlungsmodalitäten: Die FAQ versammelt die Antworten auf die Fragen, die unsere Kunden am häufigsten stellen.",
          ctaLabel: "FAQ lesen",
          href: "/faq",
        },
      ],
    },
    crossLinks: {
      title: "Auch entdecken",
      items: [
        {
          href: "/tarifs",
          title: "Preise",
          desc: "Alle unsere Preise in guineischen Francs: Websites, Individualsoftware und SaaS-Abos, im Voraus angekündigt.",
        },
        {
          href: "/services",
          title: "Services",
          desc: "Sieben komplementäre Bereiche, ein einziger Ansprechpartner für Ihr gesamtes Digitalgeschäft.",
        },
        {
          href: "/faq",
          title: "FAQ",
          desc: "Klare Antworten auf die häufigsten Fragen zu unseren Angeboten und unserer Methode.",
        },
      ],
    },
  },
};
