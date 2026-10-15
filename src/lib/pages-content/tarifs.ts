import type { Localized } from "@/lib/page-content";

/**
 * Contenu de la page /tarifs.
 * Aucun montant n'est déclaré ici : les prix sont TOUJOURS rendus par
 * PriceTag à partir des PriceOffer de src/lib/catalog.ts (WEB_OFFERS,
 * WEB_RENEWAL, SOFTWARE_OFFERS, SAAS_PRODUCTS). Les cartes détaillées
 * ci-dessous sont reliées au catalogue par l'id d'offre.
 */

export interface TarifOfferCard {
  /** id d'offre dans src/lib/catalog.ts */
  id: string;
  title: string;
  desc: string;
}

export interface TarifsContent {
  hero: {
    label: string;
    title: string;
    gold: string;
    sub: string;
    chips: string[];
  };
  detail: {
    label: string;
    title: string;
    gold: string;
    sub: string;
    /** sous-titre du bloc « Sites web » */
    webLabel: string;
    webSub: string;
    web: TarifOfferCard[];
    featuredLabel: string;
    renewal: { title: string; desc: string };
    /** sous-titre du bloc « Logiciels » */
    softwareLabel: string;
    softwareSub: string;
    software: TarifOfferCard[];
  };
  faq: {
    label: string;
    title: string;
    gold: string;
    sub: string;
    items: { q: string; a: string }[];
  };
  cta: {
    title: string;
    gold: string;
    sub: string;
    primaryLabel: string;
    secondaryLabel: string;
  };
  cross: {
    title: string;
    items: { href: string; title: string; desc: string }[];
  };
}

export const TARIFS: Localized<TarifsContent> = {
  fr: {
    hero: {
      label: "06 — Tarifs",
      title: "Des prix clairs,",
      gold: "annoncés d'avance.",
      sub: "Tous les montants sont en francs guinéens (GNF), tels que communiqués par l'agence. Les mentions « à partir de » et « sur devis » sont explicites.",
      chips: ["Montants en GNF", "« À partir de » explicite", "Renouvellement 500 000 GNF/an"],
    },
    detail: {
      label: "06.1 — Bien lire les prix",
      title: "Chaque montant,",
      gold: "expliqué.",
      sub: "L'onglet ci-dessus donne les chiffres ; ici, on les détaille : ce que couvre chaque forfait sites web et logiciels, ce qui est inclus d'office et les conditions qui s'appliquent.",
      webLabel: "Sites web",
      webSub: "Trois forfaits, paiement unique à la livraison. Le renouvellement annuel, en dessous, assure la continuité du site.",
      web: [
        {
          id: "web-vitrine",
          title: "Site vitrine",
          desc: "Pages conçues par l'agence, sans tableau de bord : idéal pour présenter votre activité en ligne avec un budget maîtrisé.",
        },
        {
          id: "web-dashboard",
          title: "Site avec tableau de bord",
          desc: "Toutes les pages de la vitrine, plus un tableau de bord d'administration — un administrateur — pour gérer vos contenus vous-même.",
        },
        {
          id: "web-ecommerce",
          title: "Boutique en ligne",
          desc: "Votre boutique avec système de paiement intégré : catalogue, panier et commandes, pour vendre directement sur Internet.",
        },
      ],
      featuredLabel: "Recommandé",
      renewal: {
        title: "Renouvellement annuel",
        desc: "500 000 GNF/an, nom de domaine et hébergement — garantit la continuité de votre site, année après année.",
      },
      softwareLabel: "Logiciels",
      softwareSub: "Pour les besoins qui débordent du cadre d'un site : construction dédiée, chiffrée à part.",
      software: [
        {
          id: "software-custom",
          title: "Logiciel sur mesure",
          desc: "Construit exactement pour vos processus, selon les fonctionnalités demandées. Bugs, failles et erreurs corrigés sans frais pendant toute la collaboration.",
        },
        {
          id: "software-mobile",
          title: "Application mobile",
          desc: "Une application pour vos équipes ou vos clients : étude personnalisée de votre besoin, puis chiffrage précis sur devis.",
        },
      ],
    },
    faq: {
      label: "06.2 — Questions fréquentes",
      title: "Les tarifs,",
      gold: "sans ambiguïté.",
      sub: "Quatre questions que l'on nous pose avant chaque devis. Pour le reste, notre assistant répond instantanément.",
      items: [
        {
          q: "Les prix peuvent-ils changer en cours de route ?",
          a: "Non. Une fois le devis accepté, le montant est figé : il ne change pas en cours de route. Seules les nouvelles fonctionnalités demandées en plus se facturent en supplément — toujours après votre accord.",
        },
        {
          q: "Que comprend le renouvellement de 500 000 GNF ?",
          a: "Le nom de domaine et l'hébergement de votre site. Ce renouvellement annuel garantit la continuité de votre site : sans lui, le domaine et l'hébergement expirent.",
        },
        {
          q: "Comment se passe le paiement ?",
          a: "Par jalons, définis dans le devis. Pas de paiement en ligne dans cette version : chaque échéance est accompagnée d'une facture détaillée.",
        },
        {
          q: "Et si mon besoin n'est dans aucun forfait ?",
          a: "Nous étudions un développement sur mesure, à partir de 20 000 000 GNF selon les fonctionnalités. Après une étude personnalisée, vous recevez un devis précis — et les bugs sont corrigés sans frais pendant toute la collaboration.",
        },
      ],
    },
    cta: {
      title: "Un budget à cadrer ?",
      gold: "Demandez un devis détaillé.",
      sub: "Décrivez votre projet en quelques lignes : nous revenons vers vous avec un devis chiffré, poste par poste, sous 48 heures.",
      primaryLabel: "Demander un devis",
      secondaryLabel: "Voir les logiciels",
    },
    cross: {
      title: "Explorer aussi",
      items: [
        {
          href: "/logiciels",
          title: "Logiciels SaaS",
          desc: "Six outils de gestion prêts à l'emploi, avec essai gratuit de 7 jours : facturation, comptabilité, santé, école, immobilier, pharmacie.",
        },
        {
          href: "/services",
          title: "Services",
          desc: "Sept pôles complémentaires : sites web, logiciels sur mesure, community management, acquisition, formations et stratégie.",
        },
        {
          href: "/faq",
          title: "FAQ",
          desc: "Délais, maintenance, langues, support : les réponses claires aux questions les plus fréquentes.",
        },
      ],
    },
  },
  en: {
    hero: {
      label: "06 — Pricing",
      title: "Clear prices,",
      gold: "announced upfront.",
      sub: "All amounts are in Guinean francs (GNF), exactly as communicated by the agency. “From” and “quote only” mentions are explicit.",
      chips: ["Amounts in GNF", "Explicit “from”", "Renewal 500,000 GNF/yr"],
    },
    detail: {
      label: "06.1 — Reading the prices",
      title: "Every amount,",
      gold: "explained.",
      sub: "The tab above gives the figures; here we detail them: what each website and software plan covers, what is included by default and the terms that apply.",
      webLabel: "Websites",
      webSub: "Three plans, one-time payment at delivery. The yearly renewal below keeps your site running.",
      web: [
        {
          id: "web-vitrine",
          title: "Showcase website",
          desc: "Pages designed by the agency, no dashboard: ideal to present your business online while keeping the budget tight.",
        },
        {
          id: "web-dashboard",
          title: "Website with dashboard",
          desc: "Everything in the showcase plan, plus an administration dashboard — one administrator — to manage your content yourself.",
        },
        {
          id: "web-ecommerce",
          title: "Online store",
          desc: "Your store with an integrated payment system: catalogue, cart and orders, to sell directly on the Internet.",
        },
      ],
      featuredLabel: "Recommended",
      renewal: {
        title: "Yearly renewal",
        desc: "500,000 GNF per year, domain name and hosting — it keeps your site alive, year after year.",
      },
      softwareLabel: "Software",
      softwareSub: "For needs that go beyond a website: dedicated construction, quoted separately.",
      software: [
        {
          id: "software-custom",
          title: "Custom software",
          desc: "Built exactly for your processes, depending on the features you request. Bugs, flaws and errors fixed free of charge throughout the collaboration.",
        },
        {
          id: "software-mobile",
          title: "Mobile application",
          desc: "An app for your teams or your clients: personalised study of your need, then precise quoting by estimate.",
        },
      ],
    },
    faq: {
      label: "06.2 — Frequent questions",
      title: "Pricing,",
      gold: "no ambiguity.",
      sub: "Four questions we hear before every quote. For the rest, our assistant answers instantly.",
      items: [
        {
          q: "Can prices change along the way?",
          a: "No. Once the quote is accepted, the amount is frozen: it does not move during the project. Only additional features requested on top are billed as extras — always after your approval.",
        },
        {
          q: "What does the 500,000 GNF renewal cover?",
          a: "Your website's domain name and hosting. This yearly renewal guarantees the continuity of your site: without it, the domain and hosting expire.",
        },
        {
          q: "How does payment work?",
          a: "By milestones, defined in the quote. No online payment in this version: each milestone comes with a detailed invoice.",
        },
        {
          q: "What if my need fits no plan?",
          a: "We study a custom build, from 20,000,000 GNF depending on the features. After a personalised study, you receive a precise quote — and bugs are fixed free of charge throughout the collaboration.",
        },
      ],
    },
    cta: {
      title: "A budget to frame?",
      gold: "Ask for a detailed quote.",
      sub: "Describe your project in a few lines: we come back with a costed quote, line by line, within 48 hours.",
      primaryLabel: "Request a quote",
      secondaryLabel: "See the software",
    },
    cross: {
      title: "Explore more",
      items: [
        {
          href: "/logiciels",
          title: "SaaS software",
          desc: "Six ready-to-use management tools with a 7-day free trial: invoicing, accounting, health, schools, real estate, pharmacy.",
        },
        {
          href: "/services",
          title: "Services",
          desc: "Seven complementary areas: websites, custom software, social media, client acquisition, training and strategy.",
        },
        {
          href: "/faq",
          title: "FAQ",
          desc: "Timelines, maintenance, languages, support: clear answers to the most frequent questions.",
        },
      ],
    },
  },
  es: {
    hero: {
      label: "06 — Tarifas",
      title: "Precios claros,",
      gold: "anunciados de antemano.",
      sub: "Todos los importes están en francos guineanos (GNF), tal como los comunica la agencia. Las menciones « desde » y « a consultar » son explícitas.",
      chips: ["Importes en GNF", "« Desde » explícito", "Renovación 500 000 GNF/año"],
    },
    detail: {
      label: "06.1 — Leer bien los precios",
      title: "Cada importe,",
      gold: "explicado.",
      sub: "La pestaña de arriba da las cifras; aquí las detallamos: qué cubre cada plan de sitios web y software, qué está incluido de serie y qué condiciones se aplican.",
      webLabel: "Sitios web",
      webSub: "Tres planes, pago único en la entrega. La renovación anual, más abajo, garantiza la continuidad del sitio.",
      web: [
        {
          id: "web-vitrine",
          title: "Sitio vitrina",
          desc: "Páginas diseñadas por la agencia, sin panel de administración: ideal para presentar su actividad en línea con un presupuesto ajustado.",
        },
        {
          id: "web-dashboard",
          title: "Sitio con panel de administración",
          desc: "Todas las páginas de la vitrina, más un panel de administración — un administrador — para gestionar usted mismo sus contenidos.",
        },
        {
          id: "web-ecommerce",
          title: "Tienda en línea",
          desc: "Su tienda con sistema de pago integrado: catálogo, carrito y pedidos, para vender directamente en Internet.",
        },
      ],
      featuredLabel: "Recomendado",
      renewal: {
        title: "Renovación anual",
        desc: "500 000 GNF al año, nombre de dominio y alojamiento — garantiza la continuidad de su sitio, año tras año.",
      },
      softwareLabel: "Software",
      softwareSub: "Para necesidades que desbordan el marco de un sitio: construcción dedicada, presupuestada aparte.",
      software: [
        {
          id: "software-custom",
          title: "Software a medida",
          desc: "Construido exactamente para sus procesos, según las funcionalidades pedidas. Bugs, fallos y errores corregidos sin coste durante toda la colaboración.",
        },
        {
          id: "software-mobile",
          title: "Aplicación móvil",
          desc: "Una aplicación para sus equipos o sus clientes: estudio personalizado de su necesidad y luego un presupuesto preciso a consultar.",
        },
      ],
    },
    faq: {
      label: "06.2 — Preguntas frecuentes",
      title: "Las tarifas,",
      gold: "sin ambigüedad.",
      sub: "Cuatro preguntas que nos hacen antes de cada presupuesto. Para el resto, nuestro asistente responde al instante.",
      items: [
        {
          q: "¿Los precios pueden cambiar durante el camino?",
          a: "No. Una vez aceptado el presupuesto, el importe queda fijado: no cambia durante el proyecto. Solo las funcionalidades nuevas pedidas además se facturan como suplemento — siempre con su acuerdo.",
        },
        {
          q: "¿Qué incluye la renovación de 500 000 GNF?",
          a: "El nombre de dominio y el alojamiento de su sitio. Esta renovación anual garantiza la continuidad de su sitio: sin ella, el dominio y el alojamiento caducan.",
        },
        {
          q: "¿Cómo se realiza el pago?",
          a: "Por hitos, definidos en el presupuesto. Sin pago en línea en esta versión: cada hito va acompañado de una factura detallada.",
        },
        {
          q: "¿Y si mi necesidad no entra en ningún plan?",
          a: "Estudiamos un desarrollo a medida, a partir de 20 000 000 GNF según las funcionalidades. Tras un estudio personalizado, recibe un presupuesto preciso — y los bugs se corrigen sin coste durante toda la colaboración.",
        },
      ],
    },
    cta: {
      title: "¿Un presupuesto que definir?",
      gold: "Pida un presupuesto detallado.",
      sub: "Describa su proyecto en unas líneas: le respondemos con un presupuesto detallado, partida por partida, en 48 horas.",
      primaryLabel: "Pedir un presupuesto",
      secondaryLabel: "Ver el software",
    },
    cross: {
      title: "Explorar también",
      items: [
        {
          href: "/logiciels",
          title: "Software SaaS",
          desc: "Seis herramientas de gestión listas para usar, con prueba gratis de 7 días: facturación, contabilidad, salud, escuela, inmobiliaria, farmacia.",
        },
        {
          href: "/services",
          title: "Servicios",
          desc: "Siete polos complementarios: sitios web, software a medida, community management, adquisición, formación y estrategia.",
        },
        {
          href: "/faq",
          title: "FAQ",
          desc: "Plazos, mantenimiento, idiomas, soporte: respuestas claras a las preguntas más frecuentes.",
        },
      ],
    },
  },
  zh: {
    hero: {
      label: "06 — 价格",
      title: "价格透明，",
      gold: "提前公布。",
      sub: "所有金额均以几内亚法郎（GNF）计，与机构对外公布一致。“起价”与“按需报价”均有明确标注。",
      chips: ["金额以 GNF 计", "“起价”标注明确", "年度续费 500 000 GNF"],
    },
    detail: {
      label: "06.1 — 看懂价格",
      title: "每一笔金额，",
      gold: "都讲清楚。",
      sub: "上方的选项卡给出数字；这里进一步说明：每个网站与软件套餐覆盖什么、默认包含什么，以及适用的条款。",
      webLabel: "网站",
      webSub: "三个套餐，交付时一次性付款。下方的年度续费保障网站的持续运行。",
      web: [
        {
          id: "web-vitrine",
          title: "展示型网站",
          desc: "页面由公司设计，不含管理后台：适合以可控预算在线展示您的业务。",
        },
        {
          id: "web-dashboard",
          title: "带管理后台的网站",
          desc: "包含展示型网站的全部页面，另加管理后台（一名管理员），您可以自行管理内容。",
        },
        {
          id: "web-ecommerce",
          title: "在线商城",
          desc: "内置支付系统的商城：商品目录、购物车与订单，直接在互联网上销售。",
        },
      ],
      featuredLabel: "推荐",
      renewal: {
        title: "年度续费",
        desc: "每年 500 000 GNF，含域名与托管——保障您的网站年年不断线。",
      },
      softwareLabel: "软件",
      softwareSub: "当需求超出一个网站的框架时：专门构建，单独报价。",
      software: [
        {
          id: "software-custom",
          title: "定制软件",
          desc: "完全按照您的流程构建，取决于所需功能。在整个合作期间，漏洞、缺陷与错误免费修复。",
        },
        {
          id: "software-mobile",
          title: "移动应用",
          desc: "面向您的团队或客户的应用：先对需求做个性化研究，再按需给出精确报价。",
        },
      ],
    },
    faq: {
      label: "06.2 — 常见问题",
      title: "价格问题，",
      gold: "毫无含糊。",
      sub: "每个报价之前最常见的四个问题。其余问题，我们的助手即刻作答。",
      items: [
        {
          q: "价格会在中途变动吗？",
          a: "不会。报价一经接受，金额即告锁定：项目过程中不会变动。只有额外要求的新功能才会另行计费——而且始终先征得您的同意。",
        },
        {
          q: "500 000 GNF 的续费包含什么？",
          a: "您网站的域名与托管。这项年度续费保障网站的连续性：没有它，域名与托管将会到期失效。",
        },
        {
          q: "付款如何进行？",
          a: "按报价单中约定的节点分批支付。此版本不含在线支付：每个节点均附一张明细发票。",
        },
        {
          q: "如果我的需求不属于任何套餐呢？",
          a: "我们会研究定制开发，视功能而定，自 20 000 000 GNF 起。经过个性化研究后，您将收到一份精确的报价——且整个合作期间漏洞免费修复。",
        },
      ],
    },
    cta: {
      title: "预算需要规划？",
      gold: "索取一份明细报价。",
      sub: "用几行文字描述您的项目：我们将在 48 小时内回复一份逐项计价的详细报价。",
      primaryLabel: "索取报价",
      secondaryLabel: "查看软件",
    },
    cross: {
      title: "继续探索",
      items: [
        {
          href: "/logiciels",
          title: "SaaS 软件",
          desc: "六款即开即用的管理软件，附 7 天免费试用：开票、会计、医疗、学校、物业、药房。",
        },
        {
          href: "/services",
          title: "服务",
          desc: "七大互补业务板块：网站、定制软件、社交媒体运营、获客、培训与战略。",
        },
        {
          href: "/faq",
          title: "常见问题",
          desc: "工期、维护、语言、支持：最常见问题的清晰解答。",
        },
      ],
    },
  },
  de: {
    hero: {
      label: "06 — Preise",
      title: "Klare Preise,",
      gold: "im Voraus angekündigt.",
      sub: "Alle Beträge in guineischen Francs (GNF), exakt so, wie die Agentur sie mitteilt. Die Hinweise „ab“ und „auf Angebot“ sind ausdrücklich ausgewiesen.",
      chips: ["Beträge in GNF", "Ausdrückliche „ab“-Hinweise", "Verlängerung 500 000 GNF/Jahr"],
    },
    detail: {
      label: "06.1 — Preise richtig lesen",
      title: "Jeder Betrag,",
      gold: "erklärt.",
      sub: "Der Reiter oben zeigt die Zahlen; hier werden sie erläutert: was jedes Website- und Software-Paket abdeckt, was standardmäßig enthalten ist und welche Bedingungen gelten.",
      webLabel: "Websites",
      webSub: "Drei Pakete, Einmalzahlung bei Auslieferung. Die jährliche Verlängerung unten sichert den Fortbestand der Website.",
      web: [
        {
          id: "web-vitrine",
          title: "Präsentations-Website",
          desc: "Von der Agentur gestaltete Seiten, ohne Verwaltungspanel: ideal, um Ihr Geschäft online zu zeigen — bei überschaubarem Budget.",
        },
        {
          id: "web-dashboard",
          title: "Website mit Verwaltungspanel",
          desc: "Alle Seiten der Präsentations-Website, plus Verwaltungspanel — ein Administrator —, um Ihre Inhalte selbst zu pflegen.",
        },
        {
          id: "web-ecommerce",
          title: "Onlineshop",
          desc: "Ihr Shop mit integriertem Zahlungssystem: Katalog, Warenkorb und Bestellungen, um direkt im Internet zu verkaufen.",
        },
      ],
      featuredLabel: "Empfohlen",
      renewal: {
        title: "Jährliche Verlängerung",
        desc: "500 000 GNF pro Jahr, Domainname und Hosting — garantiert den Fortbestand Ihrer Website, Jahr für Jahr.",
      },
      softwareLabel: "Software",
      softwareSub: "Für Bedürfnisse, die den Rahmen einer Website sprengen: eigene Entwicklung, separat angeboten.",
      software: [
        {
          id: "software-custom",
          title: "Individuelle Software",
          desc: "Genau für Ihre Abläufe gebaut, je nach gewünschten Funktionen. Fehler, Schwachstellen und Bugs werden während der gesamten Zusammenarbeit kostenlos behoben.",
        },
        {
          id: "software-mobile",
          title: "Mobile Anwendung",
          desc: "Eine App für Ihre Teams oder Kunden: persönliche Analyse Ihres Bedarfs, dann eine präzise Offerte auf Angebot.",
        },
      ],
    },
    faq: {
      label: "06.2 — Häufige Fragen",
      title: "Die Preise,",
      gold: "ohne Mehrdeutigkeit.",
      sub: "Vier Fragen, die uns vor jedem Angebot gestellt werden. Für alles Weitere antwortet unser Assistent sofort.",
      items: [
        {
          q: "Können sich die Preise unterwegs ändern?",
          a: "Nein. Sobald das Angebot angenommen ist, ist der Betrag eingefroren: Er ändert sich während des Projekts nicht. Nur zusätzlich angeforderte neue Funktionen werden separat berechnet — immer nach Ihrer Zustimmung.",
        },
        {
          q: "Was umfasst die Verlängerung von 500 000 GNF?",
          a: "Domainname und Hosting Ihrer Website. Diese jährliche Verlängerung garantiert den Fortbestand Ihrer Website: ohne sie laufen Domain und Hosting ab.",
        },
        {
          q: "Wie läuft die Zahlung ab?",
          a: "In Etappen, festgelegt im Angebot. Keine Onlinezahlung in dieser Version: jede Etappe wird von einer detaillierten Rechnung begleitet.",
        },
        {
          q: "Und wenn mein Bedarf in kein Paket passt?",
          a: "Wir prüfen eine individuelle Entwicklung, je nach Funktionen ab 20 000 000 GNF. Nach einer persönlichen Analyse erhalten Sie eine präzise Offerte — und Bugs werden während der gesamten Zusammenarbeit kostenlos behoben.",
        },
      ],
    },
    cta: {
      title: "Ein Budget einzordnen?",
      gold: "Fordern Sie ein Detailangebot an.",
      sub: "Beschreiben Sie Ihr Projekt in wenigen Zeilen: Wir melden uns innerhalb von 48 Stunden mit einem Angebot, Position für Position.",
      primaryLabel: "Angebot anfordern",
      secondaryLabel: "Software ansehen",
    },
    cross: {
      title: "Auch entdecken",
      items: [
        {
          href: "/logiciels",
          title: "SaaS-Software",
          desc: "Sechs einsatzbereite Verwaltungstools mit 7 Tagen Gratisphase: Rechnungswesen, Buchhaltung, Gesundheit, Schule, Immobilien, Apotheke.",
        },
        {
          href: "/services",
          title: "Services",
          desc: "Sieben komplementäre Bereiche: Websites, Individualsoftware, Social Media, Kundengewinnung, Schulungen und Strategie.",
        },
        {
          href: "/faq",
          title: "FAQ",
          desc: "Fristen, Wartung, Sprachen, Support: klare Antworten auf die häufigsten Fragen.",
        },
      ],
    },
  },
};
