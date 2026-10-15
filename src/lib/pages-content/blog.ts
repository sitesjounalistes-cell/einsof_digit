import type { Localized } from "@/lib/page-content";

/**
 * Contenu de la page /blog (Journal) — les articles eux-mêmes viennent
 * de la vraie base (/api/posts) ; ce module ne porte que l'habillage
 * et les blocs éditoriaux de la page, en 5 langues.
 */

export interface BlogCrossLink {
  href: string;
  title: string;
  desc: string;
}

export interface BlogTopic {
  title: string;
  text: string;
}

export interface BlogContent {
  hero: {
    label: string;
    title: string;
    gold: string;
    sub: string;
    chips: string[];
  };
  listing: {
    label: string;
    title: string;
    gold: string;
    sub: string;
    loading: string;
    emptyTitle: string;
    emptyText: string;
    emptyCta: string;
  };
  topics: {
    label: string;
    title: string;
    gold: string;
    sub: string;
    cards: BlogTopic[];
  };
  cta: {
    title: string;
    gold: string;
    primaryLabel: string;
    secondaryLabel: string;
  };
  crossLinks: {
    title: string;
    items: BlogCrossLink[];
  };
}

export const BLOG: Localized<BlogContent> = {
  fr: {
    hero: {
      label: "10 — Journal",
      title: "Actualités et",
      gold: "conseils d'experts.",
      sub: "Les articles de fond de l'agence, écrits à partir de projets réellement livrés en Guinée. Des conseils concrets pour réussir votre transformation digitale, sans jargon inutile.",
      chips: ["SaaS & gestion", "Sites web", "Stratégie digitale"],
    },
    listing: {
      label: "Articles publiés",
      title: "Les articles",
      gold: "du moment.",
      sub: "Chaque article part d'une situation vécue chez un client : facturation, sites web, gestion d'équipe ou transformation digitale. Vous y trouverez des réponses applicables dès cette semaine.",
      loading: "Chargement du journal…",
      emptyTitle: "Le premier article arrive bientôt.",
      emptyText:
        "Notre équipe met la dernière main aux premiers articles de fond. En attendant, parlons directement de votre projet : un expert vous répondra, pas un article.",
      emptyCta: "En attendant, parlons de votre projet",
    },
    topics: {
      label: "Thèmes du journal",
      title: "Trois sujets,",
      gold: "un fil conducteur.",
      sub: "Ce que vous trouverez dans nos pages, et pourquoi cela compte pour votre activité.",
      cards: [
        {
          title: "SaaS & gestion",
          text: "Bien choisir et déployer un logiciel métier : critères de sélection, pièges à éviter, formation des équipes et conduite du changement. Nous partageons ce qui fonctionne réellement sur le terrain guinéen, avec des exemples chiffrés quand c'est possible.",
        },
        {
          title: "Sites web",
          text: "Vitrines, e-commerce et SEO local : faire de votre site un outil de vente, pas une simple carte de visite numérique. Nous détaillons les décisions qui pèsent le plus sur vos résultats, de l'arborescence au formulaire de contact.",
        },
        {
          title: "Stratégie digitale",
          text: "Acquisition, réseaux sociaux et transformation : construire une présence digitale rentable, étape par étape. Des méthodes éprouvées avec des entreprises d'ici, ajustées à vos moyens et à votre marché.",
        },
      ],
    },
    cta: {
      title: "Un sujet à creuser ?",
      gold: "Parlons de votre projet.",
      primaryLabel: "Nous contacter",
      secondaryLabel: "Voir nos services",
    },
    crossLinks: {
      title: "Explorer aussi",
      items: [
        {
          href: "/services",
          title: "Services",
          desc: "Sites web, logiciels sur mesure, SaaS, community management, acquisition et formations : sept pôles complémentaires au service de votre croissance.",
        },
        {
          href: "/realisations",
          title: "Réalisations",
          desc: "Des projets livrés qui travaillent pour nos clients : sites, logiciels et plateformes en production au quotidien.",
        },
        {
          href: "/faq",
          title: "FAQ",
          desc: "Délais, tarifs, maintenance, langues et support : les réponses claires aux questions que tout le monde se pose.",
        },
      ],
    },
  },
  en: {
    hero: {
      label: "10 — Journal",
      title: "News and",
      gold: "expert advice.",
      sub: "In-depth articles from the agency, written from projects actually delivered in Guinea. Practical advice to make your digital transformation a success, with no useless jargon.",
      chips: ["SaaS & management", "Websites", "Digital strategy"],
    },
    listing: {
      label: "Published articles",
      title: "The articles",
      gold: "of the moment.",
      sub: "Every article starts from a real situation at a client's: invoicing, websites, team management or digital transformation. You will find answers you can apply this very week.",
      loading: "Loading the journal…",
      emptyTitle: "The first article is coming soon.",
      emptyText:
        "Our team is putting the finishing touches to the first in-depth articles. In the meantime, let's talk directly about your project: an expert will answer you, not an article.",
      emptyCta: "In the meantime, let's talk about your project",
    },
    topics: {
      label: "Journal topics",
      title: "Three subjects,",
      gold: "one common thread.",
      sub: "What you will find in our pages, and why it matters for your business.",
      cards: [
        {
          title: "SaaS & management",
          text: "Choosing and deploying a business software wisely: selection criteria, pitfalls to avoid, team training and change management. We share what truly works on the Guinean field, with concrete figures whenever possible.",
        },
        {
          title: "Websites",
          text: "Showcases, e-commerce and local SEO: turning your website into a sales tool, not just a digital business card. We break down the decisions that weigh most on your results, from the site tree to the contact form.",
        },
        {
          title: "Digital strategy",
          text: "Acquisition, social media and transformation: building a profitable digital presence, step by step. Methods proven with local companies, adjusted to your means and your market.",
        },
      ],
    },
    cta: {
      title: "A topic to dig into?",
      gold: "Let's talk about your project.",
      primaryLabel: "Contact us",
      secondaryLabel: "See our services",
    },
    crossLinks: {
      title: "Explore more",
      items: [
        {
          href: "/services",
          title: "Services",
          desc: "Websites, custom software, SaaS, social media management, client acquisition and training: seven complementary areas serving your growth.",
        },
        {
          href: "/realisations",
          title: "Our work",
          desc: "Delivered projects that work for our clients: websites, software and platforms in daily production.",
        },
        {
          href: "/faq",
          title: "FAQ",
          desc: "Timelines, pricing, maintenance, languages and support: clear answers to the questions everyone asks.",
        },
      ],
    },
  },
  es: {
    hero: {
      label: "10 — Diario",
      title: "Noticias y",
      gold: "consejos de expertos.",
      sub: "Los artículos de fondo de la agencia, escritos a partir de proyectos realmente entregados en Guinea. Consejos concretos para lograr su transformación digital, sin jerga innecesaria.",
      chips: ["SaaS y gestión", "Sitios web", "Estrategia digital"],
    },
    listing: {
      label: "Artículos publicados",
      title: "Los artículos",
      gold: "del momento.",
      sub: "Cada artículo parte de una situación vivida con un cliente: facturación, sitios web, gestión de equipos o transformación digital. Encontrará respuestas aplicables desde esta misma semana.",
      loading: "Cargando el diario…",
      emptyTitle: "El primer artículo llega pronto.",
      emptyText:
        "Nuestro equipo está dando los últimos toques a los primeros artículos de fondo. Mientras tanto, hablemos directamente de su proyecto: le responderá un experto, no un artículo.",
      emptyCta: "Mientras tanto, hablemos de su proyecto",
    },
    topics: {
      label: "Temas del diario",
      title: "Tres temas,",
      gold: "un mismo hilo conductor.",
      sub: "Lo que encontrará en nuestras páginas, y por qué es importante para su actividad.",
      cards: [
        {
          title: "SaaS y gestión",
          text: "Elegir bien y desplegar un software de gestión: criterios de selección, errores que evitar, formación de los equipos y gestión del cambio. Compartimos lo que realmente funciona sobre el terreno guineano, con ejemplos concretos cuando es posible.",
        },
        {
          title: "Sitios web",
          text: "Vitrinas, e-commerce y SEO local: convertir su sitio en una herramienta de venta, no en una simple tarjeta de visita digital. Detallamos las decisiones que más influyen en sus resultados, de la estructura al formulario de contacto.",
        },
        {
          title: "Estrategia digital",
          text: "Adquisición, redes sociales y transformación: construir una presencia digital rentable, paso a paso. Métodos probados con empresas de aquí, ajustados a sus medios y a su mercado.",
        },
      ],
    },
    cta: {
      title: "¿Un tema para profundizar?",
      gold: "Hablemos de su proyecto.",
      primaryLabel: "Contactarnos",
      secondaryLabel: "Ver nuestros servicios",
    },
    crossLinks: {
      title: "Explorar también",
      items: [
        {
          href: "/services",
          title: "Servicios",
          desc: "Sitios web, software a medida, SaaS, community management, adquisición y formación: siete polos complementarios al servicio de su crecimiento.",
        },
        {
          href: "/realisations",
          title: "Realizaciones",
          desc: "Proyectos entregados que trabajan para nuestros clientes: sitios, software y plataformas en producción diaria.",
        },
        {
          href: "/faq",
          title: "FAQ",
          desc: "Plazos, tarifas, mantenimiento, idiomas y soporte: respuestas claras a las preguntas que todos se hacen.",
        },
      ],
    },
  },
  zh: {
    hero: {
      label: "10 — 日志",
      title: "公司动态与",
      gold: "专家建议。",
      sub: "所有深度文章均取材于我们在几内亚实际交付的项目。用切实可行的建议助您完成数字化转型，没有无用的行业术语。",
      chips: ["SaaS 与管理", "网站", "数字化战略"],
    },
    listing: {
      label: "已发布文章",
      title: "近期",
      gold: "文章。",
      sub: "每篇文章都源自客户的真实场景：开票、网站、团队管理或数字化转型。您将找到本周就能用上的答案。",
      loading: "日志加载中…",
      emptyTitle: "第一篇文章即将发布。",
      emptyText:
        "我们的团队正在为首批深度文章做最后的打磨。在此期间，不妨直接聊聊您的项目：为您解答的将是专家，而不是一篇文章。",
      emptyCta: "在此期间，聊聊您的项目",
    },
    topics: {
      label: "日志主题",
      title: "三个主题，",
      gold: "一条主线。",
      sub: "您将在我们的页面中读到什么，以及这些内容为何与您的业务息息相关。",
      cards: [
        {
          title: "SaaS 与管理",
          text: "如何明智地选型并部署业务软件：选择标准、需要避开的坑、团队培训与变革管理。我们分享在几内亚本地真正行之有效的经验，并尽可能给出具体数字。",
        },
        {
          title: "网站",
          text: "展示站、电商与本地 SEO：让您的网站成为销售工具，而不只是一张数字名片。我们逐一拆解对结果影响最大的决策，从站点结构到联系表单。",
        },
        {
          title: "数字化战略",
          text: "获客、社交媒体与转型：一步步构建可盈利的数字化存在。这些方法已在本地企业中得到验证，并会根据您的资源和市场做出调整。",
        },
      ],
    },
    cta: {
      title: "有想深入探讨的话题？",
      gold: "聊聊您的项目。",
      primaryLabel: "联系我们",
      secondaryLabel: "查看我们的服务",
    },
    crossLinks: {
      title: "同时探索",
      items: [
        {
          href: "/services",
          title: "服务",
          desc: "网站、定制软件、SaaS、社交媒体运营、获客与培训：七大互补业务板块，助力您的增长。",
        },
        {
          href: "/realisations",
          title: "案例",
          desc: "为客户持续创造价值的已交付项目：网站、软件与日常生产中的平台。",
        },
        {
          href: "/faq",
          title: "常见问题",
          desc: "工期、价格、维护、语言与支持：人人关心的问题，在这里都能找到清晰的答案。",
        },
      ],
    },
  },
  de: {
    hero: {
      label: "10 — Journal",
      title: "News und",
      gold: "Expertenrat.",
      sub: "Die ausführlichen Artikel der Agentur, geschrieben aus Projekten, die tatsächlich in Guinea umgesetzt wurden. Konkrete Ratschläge für eine erfolgreiche digitale Transformation — ohne unnötiges Fachchinesisch.",
      chips: ["SaaS & Verwaltung", "Websites", "Digitale Strategie"],
    },
    listing: {
      label: "Veröffentlichte Artikel",
      title: "Die Artikel",
      gold: "des Moments.",
      sub: "Jeder Artikel beginnt mit einer realen Situation bei einem Kunden: Rechnungsstellung, Websites, Teamverwaltung oder digitale Transformation. Sie finden Antworten, die sich noch diese Woche anwenden lassen.",
      loading: "Journal wird geladen…",
      emptyTitle: "Der erste Artikel erscheint bald.",
      emptyText:
        "Unser Team feilt gerade an den ersten ausführlichen Artikeln. Sprechen wir in der Zwischenzeit direkt über Ihr Projekt: Ein Experte antwortet Ihnen, kein Artikel.",
      emptyCta: "Sprechen wir in der Zwischenzeit über Ihr Projekt",
    },
    topics: {
      label: "Themen des Journals",
      title: "Drei Themen,",
      gold: "ein roter Faden.",
      sub: "Was Sie auf unseren Seiten finden — und warum es für Ihr Unternehmen zählt.",
      cards: [
        {
          title: "SaaS & Verwaltung",
          text: "Fachsoftware klug auswählen und einführen: Auswahlkriterien, Fallstricke, Schulung der Teams und Change-Management. Wir teilen, was vor Ort in Guinea wirklich funktioniert — mit konkreten Zahlen, wo immer möglich.",
        },
        {
          title: "Websites",
          text: "Auftritt, E-Commerce und lokales SEO: Machen Sie aus Ihrer Website ein Verkaufswerkzeug, nicht nur eine digitale Visitenkarte. Wir erläutern die Entscheidungen mit dem größten Einfluss auf Ihre Ergebnisse — von der Seitenstruktur bis zum Kontaktformular.",
        },
        {
          title: "Digitale Strategie",
          text: "Kundengewinnung, soziale Medien und Transformation: Schritt für Schritt eine rentable digitale Präsenz aufbauen. Bewährte Methoden von hier, angepasst an Ihre Mittel und Ihren Markt.",
        },
      ],
    },
    cta: {
      title: "Ein Thema zum Vertiefen?",
      gold: "Sprechen wir über Ihr Projekt.",
      primaryLabel: "Kontakt aufnehmen",
      secondaryLabel: "Unsere Services ansehen",
    },
    crossLinks: {
      title: "Auch entdecken",
      items: [
        {
          href: "/services",
          title: "Services",
          desc: "Websites, Individualsoftware, SaaS, Social-Media-Management, Kundengewinnung und Schulungen: sieben komplementäre Bereiche für Ihr Wachstum.",
        },
        {
          href: "/realisations",
          title: "Referenzen",
          desc: "Abgeschlossene Projekte, die für unsere Kunden arbeiten: Websites, Software und Plattformen im täglichen Einsatz.",
        },
        {
          href: "/faq",
          title: "FAQ",
          desc: "Fristen, Preise, Wartung, Sprachen und Support: klare Antworten auf die Fragen, die sich alle stellen.",
        },
      ],
    },
  },
};
