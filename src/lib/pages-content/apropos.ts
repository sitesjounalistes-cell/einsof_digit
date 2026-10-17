import type { Localized } from "@/lib/page-content";

/**
 * Contenu de la page /a-propos — 5 langues complètes.
 * Faits utilisés uniquement : 7 ans d'expérience, équipe d'environ dix
 * experts, base en Guinée, clientèle Guinée & Afrique francophone,
 * bugs corrigés sans frais, offres plus complètes que la moyenne,
 * prix publics en GNF — tous issus du catalogue et des traductions
 * existantes. Aucun nom, chiffre ou témoignage inventé.
 */

export type WhyIcon = "interlocutor" | "shield" | "languages" | "prices";

export interface WhyCard {
  icon: WhyIcon;
  title: string;
  text: string;
}

export interface AProposContent {
  hero: {
    label: string;
    title: string;
    gold: string;
    sub: string;
    chips: string[];
  };
  whyUs: {
    label: string;
    title: string;
    gold: string;
    sub: string;
    cards: WhyCard[];
  };
  cta: {
    title: string;
    gold: string;
    sub: string;
    primaryLabel: string;
    primaryHref: string;
    secondaryLabel: string;
    secondaryHref: string;
  };
  crossLinks: {
    title: string;
    items: { href: string; title: string; desc: string }[];
  };
}

export const APROPOS: Localized<AProposContent> = {
  fr: {
    hero: {
      label: "À propos",
      title: "Sept ans d'expertise",
      gold: "au service du numérique guinéen.",
      sub: "{brand} est une agence digitale premium basée en Guinée. Depuis sept ans, une équipe d'environ dix experts met son savoir-faire au service des entreprises de Guinée et d'Afrique francophone : sites web, logiciels de gestion, SaaS, réseaux sociaux et acquisition client.",
      chips: [
        "Depuis sept ans",
        "Équipe d'experts",
        "Guinée & Afrique francophone",
      ],
    },
    whyUs: {
      label: "Pourquoi {brand}",
      title: "Ce qui change,",
      gold: "quand nous travaillons ensemble.",
      sub: "Quatre convictions concrètes, vérifiables dès le premier échange : elles structurent chacune de nos collaborations et s'écrivent noir sur blanc dans nos devis.",
      cards: [
        {
          icon: "interlocutor",
          title: "Un seul interlocuteur pour tout votre digital",
          text: "Site, logiciel, réseaux sociaux et acquisition de clients : un seul partenaire pilote l'ensemble. Vous gagnez du temps, vous évitez les allers-retours entre prestataires et vous gardez une vision claire de vos coûts.",
        },
        {
          icon: "shield",
          title: "Deux promesses qui ne bougent pas",
          text: "Bugs, failles et erreurs sont corrigés sans frais pendant toute la collaboration. Et nos offres sont plus complètes que la moyenne : dès la formule de base, un site inclut un tableau de bord, un chatbot et la capture de contacts.",
        },
        {
          icon: "languages",
          title: "Une équipe terrain qui connaît les réalités locales",
          text: "Nous travaillons chaque jour avec les réalités du terrain : plusieurs langues parlées, habitudes de paiement, contraintes de connectivité. Présents à Conakry, nous nous déplaçons pour comprendre votre activité sur place.",
        },
        {
          icon: "prices",
          title: "Des prix clairs, annoncés d'avance",
          text: "Nos tarifs sont affichés en francs guinéens, sans surprise en cours de route. Ce qui est inclus est écrit noir sur blanc dans chaque devis ; seules les nouvelles fonctionnalités sont facturées à part.",
        },
      ],
    },
    cta: {
      title: "Envie de travailler avec nous ?",
      gold: "Faisons connaissance.",
      sub: "Racontez-nous votre activité et vos projets : nous vous dirons simplement comment nous pouvons vous aider.",
      primaryLabel: "Nous contacter",
      primaryHref: "/contact",
      secondaryLabel: "Voir nos réalisations",
      secondaryHref: "/realisations",
    },
    crossLinks: {
      title: "Explorer aussi",
      items: [
        {
          href: "/realisations",
          title: "Réalisations",
          desc: "Projets livrés, partenaires et témoignages : sept ans de collaborations avec des entreprises de Guinée et d'ailleurs.",
        },
        {
          href: "/faq",
          title: "FAQ",
          desc: "Délais, tarifs, maintenance, langues de travail et support : les réponses aux questions les plus fréquentes.",
        },
        {
          href: "/contact",
          title: "Contact",
          desc: "Décrivez votre besoin en deux minutes : réponse sous 24 heures ouvrées, devis détaillé sous 48 heures.",
        },
      ],
    },
  },
  en: {
    hero: {
      label: "About",
      title: "Seven years of expertise",
      gold: "serving Guinea's digital growth.",
      sub: "{brand} is a premium digital agency based in Guinea. For seven years, a team of about ten experts has served businesses in Guinea and French-speaking Africa: websites, management software, SaaS, social media and client acquisition.",
      chips: [
        "For seven years",
        "Team of experts",
        "Guinea & French-speaking Africa",
      ],
    },
    whyUs: {
      label: "Why {brand}",
      title: "What changes when",
      gold: "we work together.",
      sub: "Four concrete convictions, verifiable from the very first conversation: they shape every collaboration and are written in black and white in our quotes.",
      cards: [
        {
          icon: "interlocutor",
          title: "One contact for your entire digital presence",
          text: "Website, software, social media and client acquisition: one single partner steers it all. You save time, avoid back-and-forth between vendors and keep a clear view of your costs.",
        },
        {
          icon: "shield",
          title: "Two promises that never move",
          text: "Bugs, vulnerabilities and errors are fixed free of charge throughout the collaboration. And our offers go further than most: from the base plan, a website includes a dashboard, a chatbot and lead capture.",
        },
        {
          icon: "languages",
          title: "A field team that knows local realities",
          text: "We work with local realities every day: several spoken languages, payment habits, connectivity constraints. Based in Conakry, we travel to understand your business on site.",
        },
        {
          icon: "prices",
          title: "Clear prices, announced upfront",
          text: "Our prices are displayed in Guinean francs, with no surprises along the way. What is included is written in black and white in every quote; only new features are billed separately.",
        },
      ],
    },
    cta: {
      title: "Fancy working with us?",
      gold: "Let's get acquainted.",
      sub: "Tell us about your business and your plans: we will simply tell you how we can help.",
      primaryLabel: "Contact us",
      primaryHref: "/contact",
      secondaryLabel: "See our work",
      secondaryHref: "/realisations",
    },
    crossLinks: {
      title: "Explore more",
      items: [
        {
          href: "/realisations",
          title: "Our work",
          desc: "Delivered projects, partners and testimonials: seven years of collaborations with businesses in Guinea and beyond.",
        },
        {
          href: "/faq",
          title: "FAQ",
          desc: "Timelines, pricing, maintenance, working languages and support: answers to the most frequent questions.",
        },
        {
          href: "/contact",
          title: "Contact",
          desc: "Describe your need in two minutes: reply within 24 working hours, detailed quote within 48 hours.",
        },
      ],
    },
  },
  es: {
    hero: {
      label: "Acerca de",
      title: "Siete años de experiencia",
      gold: "al servicio del digital guineano.",
      sub: "{brand} es una agencia digital premium con base en Guinea. Desde hace siete años, un equipo de unos diez expertos pone su saber hacer al servicio de las empresas de Guinea y del África francófona: sitios web, software de gestión, SaaS, redes sociales y adquisición de clientes.",
      chips: [
        "Desde hace siete años",
        "Equipo de expertos",
        "Guinea y África francófona",
      ],
    },
    whyUs: {
      label: "Por qué {brand}",
      title: "Lo que cambia cuando",
      gold: "trabajamos juntos.",
      sub: "Cuatro convicciones concretas, verificables desde el primer intercambio: estructuran cada una de nuestras colaboraciones y quedan escritas en blanco y negro en nuestros presupuestos.",
      cards: [
        {
          icon: "interlocutor",
          title: "Un solo interlocutor para todo su digital",
          text: "Sitio, software, redes sociales y adquisición de clientes: un único socio dirige el conjunto. Gana tiempo, evita los tira y afloja entre proveedores y mantiene una visión clara de sus costes.",
        },
        {
          icon: "shield",
          title: "Dos promesas que no cambian",
          text: "Bugs, fallos y errores se corrigen sin coste durante toda la colaboración. Y nuestras ofertas son más completas que la media: desde la fórmula base, un sitio incluye panel de administración, chatbot y captura de contactos.",
        },
        {
          icon: "languages",
          title: "Un equipo de terreno que conoce las realidades locales",
          text: "Trabajamos a diario con las realidades del terreno: varios idiomas hablados, hábitos de pago, restricciones de conectividad. Presentes en Conakry, nos desplazamos para entender su actividad sobre el terreno.",
        },
        {
          icon: "prices",
          title: "Precios claros, anunciados de antemano",
          text: "Nuestras tarifas se muestran en francos guineanos, sin sorpresas durante el camino. Lo incluido queda escrito en blanco y negro en cada presupuesto; solo las nuevas funcionalidades se facturan aparte.",
        },
      ],
    },
    cta: {
      title: "¿Ganas de trabajar con nosotros?",
      gold: "Conozcámonos.",
      sub: "Cuéntenos su actividad y sus proyectos: le diremos con sencillez cómo podemos ayudarle.",
      primaryLabel: "Contactarnos",
      primaryHref: "/contact",
      secondaryLabel: "Ver nuestras realizaciones",
      secondaryHref: "/realisations",
    },
    crossLinks: {
      title: "Explorar también",
      items: [
        {
          href: "/realisations",
          title: "Realizaciones",
          desc: "Proyectos entregados, socios y testimonios: siete años de colaboraciones con empresas de Guinea y de otros lugares.",
        },
        {
          href: "/faq",
          title: "FAQ",
          desc: "Plazos, tarifas, mantenimiento, idiomas de trabajo y soporte: respuestas a las preguntas más frecuentes.",
        },
        {
          href: "/contact",
          title: "Contacto",
          desc: "Describa su necesidad en dos minutos: respuesta en 24 horas laborables, presupuesto detallado en 48 horas.",
        },
      ],
    },
  },
  zh: {
    hero: {
      label: "关于我们",
      title: "七年专业积累",
      gold: "服务几内亚数字化。",
      sub: "{brand} 是一家总部位于几内亚的高端数字机构。七年来，一支约十位专家组成的团队为几内亚及法语非洲的企业服务：网站、管理软件、SaaS、社交媒体与客户获取。",
      chips: ["七年经验", "专家团队", "几内亚与法语非洲"],
    },
    whyUs: {
      label: "为什么选择 {brand}",
      title: "与我们合作时，",
      gold: "会有什么不同。",
      sub: "四条具体、可验证的信念，从第一次沟通就能核实：它们塑造了我们每一次合作，并白纸黑字写进每一份报价。",
      cards: [
        {
          icon: "interlocutor",
          title: "一个对接人，负责您的全部数字化事务",
          text: "网站、软件、社交媒体与客户获取：由唯一的合作伙伴统一统筹。您节省时间，避免在多家服务商之间来回协调，并对成本一目了然。",
        },
        {
          icon: "shield",
          title: "两条永不改变的承诺",
          text: "整个合作期间，Bug、漏洞与错误一律免费修复。而且我们的方案比平均水平更完整：从基础版起，网站就包含管理面板、聊天机器人和客户信息收集。",
        },
        {
          icon: "languages",
          title: "懂本地现实的一线团队",
          text: "我们每天都在与本地现实打交道：多种语言、支付习惯、网络条件。团队驻守科纳克里，愿意上门实地了解您的业务。",
        },
        {
          icon: "prices",
          title: "价格透明，提前公布",
          text: "我们的价格以几内亚法郎公开标示，过程中绝无意外。每一份报价都白纸黑字写清包含内容；只有新增功能才单独计费。",
        },
      ],
    },
    cta: {
      title: "想与我们合作吗？",
      gold: "先认识一下。",
      sub: "谈谈您的业务和计划：我们会直截了当地告诉您能如何提供帮助。",
      primaryLabel: "联系我们",
      primaryHref: "/contact",
      secondaryLabel: "查看我们的案例",
      secondaryHref: "/realisations",
    },
    crossLinks: {
      title: "继续探索",
      items: [
        {
          href: "/realisations",
          title: "案例",
          desc: "已交付的项目、合作伙伴与客户见证：与几内亚及其他地区企业合作的七年。",
        },
        {
          href: "/faq",
          title: "常见问题",
          desc: "工期、价格、维护、工作语言与支持：最常见问题的解答。",
        },
        {
          href: "/contact",
          title: "联系我们",
          desc: "两分钟描述您的需求：24 个工作小时内回复，48 小时内详细报价。",
        },
      ],
    },
  },
  de: {
    hero: {
      label: "Über uns",
      title: "Sieben Jahre Expertise",
      gold: "im Dienst des guineischen Digitalfortschritts.",
      sub: "{brand} ist eine Premium-Digitalagentur mit Sitz in Guinea. Seit sieben Jahren stellt ein Team von rund zehn Experten sein Können in den Dienst der Unternehmen in Guinea und Französisch-Afrika: Websites, Verwaltungssoftware, SaaS, Social Media und Kundengewinnung.",
      chips: [
        "Seit sieben Jahren",
        "Expertenteam",
        "Guinea & Französisch-Afrika",
      ],
    },
    whyUs: {
      label: "Warum {brand}",
      title: "Was sich ändert, wenn",
      gold: "wir zusammenarbeiten.",
      sub: "Vier konkrete Überzeugungen, schon im ersten Gespräch überprüfbar: Sie prägen jede Zusammenarbeit und stehen schwarz auf weiß in unseren Angeboten.",
      cards: [
        {
          icon: "interlocutor",
          title: "Ein einziger Ansprechpartner für Ihr gesamtes Digitalgeschäft",
          text: "Website, Software, Social Media und Kundengewinnung: ein einziger Partner steuert alles. Sie sparen Zeit, vermeiden das Ping-Pong zwischen Dienstleistern und behalten Ihre Kosten klar im Blick.",
        },
        {
          icon: "shield",
          title: "Zwei Versprechen, die sich nie ändern",
          text: "Bugs, Schwachstellen und Fehler werden während der gesamten Zusammenarbeit kostenfrei behoben. Und unsere Angebote sind umfassender als der Durchschnitt: Schon die Basisformel enthält Dashboard, Chatbot und Lead-Erfassung.",
        },
        {
          icon: "languages",
          title: "Ein Team vor Ort, das die Realitäten kennt",
          text: "Wir arbeiten täglich mit den Gegebenheiten vor Ort: mehrere gesprochene Sprachen, Zahlungsgewohnheiten, Herausforderungen der Konnektivität. Mit Standpunkt in Conakry kommen wir vorbei, um Ihr Geschäft an Ort und Stelle zu verstehen.",
        },
        {
          icon: "prices",
          title: "Klare Preise, im Voraus angekündigt",
          text: "Unsere Preise sind in guineischen Francs ausgewiesen, ohne Überraschungen unterwegs. Was enthalten ist, steht schwarz auf weiß in jedem Angebot; nur neue Funktionen werden separat berechnet.",
        },
      ],
    },
    cta: {
      title: "Lust, mit uns zu arbeiten?",
      gold: "Lernen wir uns kennen.",
      sub: "Erzählen Sie uns von Ihrem Geschäft und Ihren Plänen: Wir sagen Ihnen einfach, wie wir helfen können.",
      primaryLabel: "Kontakt aufnehmen",
      primaryHref: "/contact",
      secondaryLabel: "Unsere Referenzen ansehen",
      secondaryHref: "/realisations",
    },
    crossLinks: {
      title: "Auch entdecken",
      items: [
        {
          href: "/realisations",
          title: "Referenzen",
          desc: "Gelieferte Projekte, Partner und Stimmen: sieben Jahre Zusammenarbeit mit Unternehmen in Guinea und darüber hinaus.",
        },
        {
          href: "/faq",
          title: "FAQ",
          desc: "Fristen, Preise, Wartung, Arbeitssprachen und Support: Antworten auf die häufigsten Fragen.",
        },
        {
          href: "/contact",
          title: "Kontakt",
          desc: "Beschreiben Sie Ihr Anliegen in zwei Minuten: Antwort innerhalb von 24 Arbeitsstunden, Detailangebot binnen 48 Stunden.",
        },
      ],
    },
  },
};
