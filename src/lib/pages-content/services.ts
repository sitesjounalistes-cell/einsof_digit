import type { Localized } from "@/lib/page-content";

/**
 * Contenu détaillé de la page /services — le détail des 7 pôles,
 * l'appel à l'action et les liens croisés, en 5 langues.
 * Les textes du bandeau d'ouverture (titre, or, sous-titre) viennent
 * du dictionnaire global (services.*) ; les chips et tout le reste
 * vivent ici, consommés via `useLocalized(SERVICES_PAGE)`.
 */

export interface ServicesPole {
  /** identifiant stable → icône (ServicesPage) */
  id: "web" | "software" | "saas" | "community" | "acquisition" | "training" | "strategy";
  num: string;
  title: string;
  mission: string;
  includedLabel: string;
  included: string[];
  forWhoLabel: string;
  forWho: string;
  /** pôle en ouverture (badge « Bientôt ») */
  soon?: boolean;
  /** lien interne optionnel (SaaS → /logiciels) */
  href?: string;
  hrefLabel?: string;
}

export interface ServicesPageContent {
  heroChips: string[];
  detail: {
    label: string;
    title: string;
    gold: string;
    sub: string;
    soonLabel: string;
  };
  poles: ServicesPole[];
  cta: {
    title: string;
    gold: string;
    sub: string;
    primaryLabel: string;
    secondaryLabel: string;
  };
  crossLinks: {
    title: string;
    items: { href: string; title: string; desc: string }[];
  };
}

export const SERVICES_PAGE: Localized<ServicesPageContent> = {
  fr: {
    heroChips: ["7 pôles d'expertise", "Un seul interlocuteur", "Devis sous 48 h"],
    detail: {
      label: "Chaque pôle en détail",
      title: "Sept pôles,",
      gold: "une même exigence.",
      sub: "Mission, prestations incluses, profils concernés : ce que chaque pôle d'expertise apporte concrètement à votre activité.",
      soonLabel: "Bientôt",
    },
    poles: [
      {
        id: "web",
        num: "01",
        title: "Sites web",
        mission:
          "Concevoir des sites web qui inspirent confiance dès la première seconde et transforment vos visiteurs en clients. Trois catégories : site vitrine, site avec tableau de bord, site customisé — chaque page est pensée pour votre image et pour vos objectifs commerciaux.",
        includedLabel: "Inclus dans chaque site",
        included: [
          "Site vitrine, avec tableau de bord ou customisé, adapté à votre image",
          "Nom de domaine, hébergement et deux adresses e-mail professionnelles",
          "Chatbot IA intégré, alimenté par le contenu du site",
          "Pages accueil, à propos, services, contact, galerie — et boutique en option",
          "Capture de leads : les formulaires arrivent directement dans votre e-mail",
          "SEO et indexation Google pris en charge",
        ],
        forWhoLabel: "Pour qui",
        forWho:
          "TPE/PME, commerces, institutions et professions libérales qui veulent une présence en ligne crédible et efficace.",
      },
      {
        id: "software",
        num: "02",
        title: "Logiciels & applications",
        mission:
          "Concevoir sur mesure des logiciels uniques — usage interne ou SaaS à commercialiser — et des applications mobiles qui épousent vos processus réels, au lieu de vous forcer à changer votre façon de travailler.",
        includedLabel: "Inclus dans chaque projet",
        included: [
          "Logiciel d'usage interne à partir de 20 000 000 GNF",
          "Logiciel SaaS destiné à la commercialisation à partir de 50 000 000 GNF",
          "Applications mobiles à partir de 20 000 000 GNF",
          "Fonctionnalités intégrées selon votre demande",
          "Chiffrage après discussion sur mesure, poste par poste",
        ],
        forWhoLabel: "Pour qui",
        forWho:
          "Structures dont les processus ne rentrent dans aucun moule standard et qui ont besoin d'un outil réellement adapté.",
      },
      {
        id: "saas",
        num: "03",
        title: "SaaS & workflows",
        mission:
          "Mettre à disposition immédiate sept logiciels métiers éprouvés — facturation, comptabilité, santé, école, immobilier, pharmacie, formation — et concevoir des workflows sur mesure qui automatisent vos processus de bout en bout.",
        includedLabel: "Inclus dans chaque abonnement",
        included: [
          "Sept SaaS prêts à l'emploi, paramétrés pour votre activité",
          "Import de vos données existantes",
          "Formation de vos équipes à l'outil",
          "Support et mises à jour inclus",
          "Conception de workflows sur mesure, chiffrée après étude",
        ],
        forWhoLabel: "Pour qui",
        forWho:
          "Entreprises, cabinets, écoles, cliniques, agences immobilières, pharmacies et centres de formation.",
        href: "/logiciels",
        hrefLabel: "Voir les sept logiciels",
      },
      {
        id: "community",
        num: "04",
        title: "Community management",
        mission:
          "Gérer vos réseaux sociaux avec des formules mensuelles claires : publications, vidéos courtes et publicité sponsorisée. La création de contenu et la gestion des plateformes sont deux métiers — nos forfaits combinent les deux.",
        includedLabel: "Inclus dans chaque formule",
        included: [
          "Facebook, Instagram, LinkedIn, TikTok, YouTube Shorts",
          "Publications standards : texte et affiche conçus par notre équipe",
          "Vidéos courtes de 30 à 45 secondes, jusqu'à 3 par jour",
          "Publicité sponsorisée incluse : 10 $, 50 $ ou 100 $ par mois",
          "Équipe de terrain dédiée avec le forfait Premium (2 interventions par semaine)",
        ],
        forWhoLabel: "Pour qui",
        forWho:
          "Marques, commerces, acteurs de l'événementiel et institutions qui veulent rester visibles et proches de leur audience.",
      },
      {
        id: "acquisition",
        num: "05",
        title: "Acquisition client",
        mission:
          "Générer des leads et des prospects B2B selon votre domaine d'activité et le pays ciblé — partout dans le monde. Nous transférons les contacts qualifiés à votre équipe, et même les appels de prospection si vous le souhaitez.",
        includedLabel: "Inclus dans chaque dispositif",
        included: [
          "Génération de leads B2B par secteur et par pays",
          "Contacts transférés directement à votre équipe commerciale",
          "Prospection téléphonique déléguée en option",
          "Landing pages et campagnes publicitaires sur mesure",
          "Suivi rigoureux et reporting détaillé",
        ],
        forWhoLabel: "Pour qui",
        forWho:
          "Entreprises B2B qui veulent des contacts commerciaux qualifiés — en Guinée comme à l'international.",
      },
      {
        id: "training",
        num: "06",
        title: "Formations",
        mission:
          "Former vos équipes en entreprise aux stratégies qui font grandir le chiffre d'affaires : acquisition client, prospection téléphonique, neuromarketing, fidélisation et intelligence artificielle appliquée à votre métier.",
        includedLabel: "Nos formations",
        included: [
          "Stratégie d'acquisition client — y compris via LinkedIn",
          "Prospection téléphonique",
          "Neuromarketing et stratégie de vente",
          "Fidélisation client",
          "Intelligence artificielle appliquée à votre domaine d'activité",
        ],
        forWhoLabel: "Pour qui",
        forWho:
          "Directions commerciales et équipes en entreprise — nous formons vos équipes, pas les particuliers.",
      },
      {
        id: "strategy",
        num: "07",
        title: "Stratégie d'entreprise",
        mission:
          "Proposer des stratégies sur mesure pour structurer et accélérer la croissance de votre entreprise, en cohérence avec votre réalité et votre marché. Ce pôle ouvre prochainement.",
        includedLabel: "Inclus",
        included: [],
        forWhoLabel: "Pour qui",
        forWho:
          "Dirigeants en phase de structuration ou d'expansion qui veulent un regard extérieur et rigoureux.",
        soon: true,
      },
    ],
    cta: {
      title: "Un projet en tête ?",
      gold: "Parlons-en.",
      sub: "Décrivez-nous votre besoin : nous revenons vers vous avec un devis détaillé sous 48 heures.",
      primaryLabel: "Demander un devis",
      secondaryLabel: "Voir les tarifs",
    },
    crossLinks: {
      title: "Explorer aussi",
      items: [
        {
          href: "/logiciels",
          title: "Sept logiciels prêts pour votre métier",
          desc: "Facturation, comptabilité, santé, école, immobilier, pharmacie, formation : des outils de gestion prêts à l'emploi, avec essai gratuit de 7 jours.",
        },
        {
          href: "/tarifs",
          title: "Des prix clairs, annoncés d'avance",
          desc: "Sites web, logiciels sur mesure et abonnements SaaS, en francs guinéens, sans surprise à la facturation.",
        },
        {
          href: "/methode",
          title: "Cinq étapes, zéro surprise",
          desc: "Écoute, conception, développement, livraison et suivi pendant toute la collaboration.",
        },
      ],
    },
  },
  en: {
    heroChips: ["7 areas of expertise", "A single point of contact", "Quote within 48 hours"],
    detail: {
      label: "Every pole in detail",
      title: "Seven poles,",
      gold: "one standard of quality.",
      sub: "Mission, what is included, who it is for: what each area of expertise concretely brings to your business.",
      soonLabel: "Coming soon",
    },
    poles: [
      {
        id: "web",
        num: "01",
        title: "Websites",
        mission:
          "Designing showcase sites and online stores that inspire trust from the very first second and turn your visitors into customers. Every page is crafted around your image and your business goals.",
        includedLabel: "Included in every site",
        included: [
          "Showcase site or e-commerce store, tailored to your image",
          "Admin dashboard to manage your content",
          "Secure online payments for stores",
          "Multilingual version for your markets",
          "Written chatbot and lead-capture form",
          "Free bug fixes after launch",
        ],
        forWhoLabel: "Who it is for",
        forWho:
          "SMEs, retailers, institutions and liberal professions that want a credible, effective online presence.",
      },
      {
        id: "software",
        num: "02",
        title: "Software & applications",
        mission:
          "Building management software and mobile apps tailored to your real processes, instead of forcing you to change the way you work. We start from your field, not from a generic template.",
        includedLabel: "Included in every project",
        included: [
          "Scoping workshop to analyse your processes",
          "Iterative development with regular demonstrations",
          "Dashboard to steer your activity",
          "Full training for your teams",
          "Maintenance and free fixes",
        ],
        forWhoLabel: "Who it is for",
        forWho:
          "Organisations whose processes fit no standard mould and that need a genuinely tailored tool.",
      },
      {
        id: "saas",
        num: "03",
        title: "Management SaaS",
        mission:
          "Six proven business software packages available immediately, configured for your activity from day one. You test in real conditions with a free trial, then get started fast.",
        includedLabel: "Included in every subscription",
        included: [
          "Initial configuration adapted to your activity",
          "Import of your existing data",
          "Training for your teams on the tool",
          "Support and updates included",
        ],
        forWhoLabel: "Who it is for",
        forWho: "Companies, firms, schools, clinics, real-estate agencies and pharmacies.",
        href: "/logiciels",
        hrefLabel: "See the six software packages",
      },
      {
        id: "community",
        num: "04",
        title: "Community management",
        mission:
          "Running your social media to build an engaged community around your brand. Our field team creates content that speaks to your audience and keeps the conversation alive.",
        includedLabel: "Included in every plan",
        included: [
          "Editorial calendar validated with you",
          "Content created by our field team",
          "Daily publishing and moderation",
          "Monthly report to measure results",
        ],
        forWhoLabel: "Who it is for",
        forWho:
          "Brands, retailers, event organisers and institutions that want to stay visible and close to their audience.",
      },
      {
        id: "acquisition",
        num: "05",
        title: "Client acquisition",
        mission:
          "Filling your order book with qualified prospects — not just boosting your visibility. We build campaigns that reach the right people and track every conversion.",
        includedLabel: "Included in every programme",
        included: [
          "Lead-generation strategy tailored to your market",
          "Landing pages designed to convert",
          "Campaigns monitored and adjusted continuously",
          "Conversion tracking down to the sale",
        ],
        forWhoLabel: "Who it is for",
        forWho:
          "B2B and B2C companies that want commercial contacts, not just visibility.",
      },
      {
        id: "training",
        num: "06",
        title: "Training",
        mission:
          "Making your teams genuinely self-sufficient with everyday digital tools. Our hands-on sessions let every participant practise, try and progress at their own pace.",
        includedLabel: "Included in every session",
        included: [
          "Hands-on sessions in small groups",
          "Materials adapted to your context",
          "Post-training follow-up to consolidate skills",
        ],
        forWhoLabel: "Who it is for",
        forWho:
          "In-house teams, executives and retailers who want to master their digital tools.",
      },
      {
        id: "strategy",
        num: "07",
        title: "Business strategy",
        mission:
          "Tailored strategies to structure and accelerate your company's growth, in line with your reality and your market. This pole is opening soon.",
        includedLabel: "Included",
        included: [],
        forWhoLabel: "Who it is for",
        forWho:
          "Executives structuring or expanding their business who want a rigorous outside perspective.",
        soon: true,
      },
    ],
    cta: {
      title: "A project in mind?",
      gold: "Let's talk.",
      sub: "Tell us about your need: we come back to you with a detailed quote within 48 hours.",
      primaryLabel: "Request a quote",
      secondaryLabel: "See pricing",
    },
    crossLinks: {
      title: "Explore more",
      items: [
        {
          href: "/logiciels",
          title: "Six software packages ready for your trade",
          desc: "Invoicing, accounting, health, school, real estate, pharmacy: ready-to-use management tools, with a free 7-day trial.",
        },
        {
          href: "/tarifs",
          title: "Clear prices, announced upfront",
          desc: "Websites, custom software and SaaS subscriptions, in Guinean francs, with no billing surprises.",
        },
        {
          href: "/methode",
          title: "Five steps, zero surprises",
          desc: "Listening, design, development, delivery and support throughout the collaboration.",
        },
      ],
    },
  },
  es: {
    heroChips: ["7 áreas de especialización", "Un solo interlocutor", "Presupuesto en 48 h"],
    detail: {
      label: "Cada área en detalle",
      title: "Siete áreas,",
      gold: "una misma exigencia.",
      sub: "Misión, servicios incluidos, perfiles interesados: lo que cada área de especialización aporta concretamente a tu actividad.",
      soonLabel: "Próximamente",
    },
    poles: [
      {
        id: "web",
        num: "01",
        title: "Sitios web",
        mission:
          "Diseñar sitios de presentación y tiendas en línea que inspiran confianza desde el primer segundo y convierten a tus visitantes en clientes. Cada página se construye alrededor de tu imagen y de tus objetivos comerciales.",
        includedLabel: "Incluido en cada sitio",
        included: [
          "Sitio de presentación o tienda e-commerce, adaptado a tu imagen",
          "Panel de administración para gestionar tus contenidos",
          "Pagos en línea seguros para las tiendas",
          "Versión multilingüe según tus mercados",
          "Chatbot escrito y formulario de captación de contactos",
          "Corrección gratuita de errores tras la puesta en línea",
        ],
        forWhoLabel: "Para quién",
        forWho:
          "Pymes, comercios, instituciones y profesionales liberales que quieren una presencia en línea creíble y eficaz.",
      },
      {
        id: "software",
        num: "02",
        title: "Software y aplicaciones",
        mission:
          "Desarrollar software de gestión y aplicaciones móviles a medida que se ajustan a tus procesos reales, en lugar de obligarte a cambiar tu forma de trabajar. Partimos de tu terreno, no de un modelo genérico.",
        includedLabel: "Incluido en cada proyecto",
        included: [
          "Taller de definición para analizar tus procesos",
          "Desarrollo iterativo con demostraciones periódicas",
          "Panel de control para dirigir tu actividad",
          "Formación completa de tus equipos",
          "Mantenimiento y correcciones gratuitas",
        ],
        forWhoLabel: "Para quién",
        forWho:
          "Organizaciones cuyos procesos no encajan en ningún molde estándar y que necesitan una herramienta realmente a medida.",
      },
      {
        id: "saas",
        num: "03",
        title: "SaaS de gestión",
        mission:
          "Seis software de gestión probados, disponibles de inmediato y configurados para tu actividad desde el primer día. Los pruebas en condiciones reales gracias a una prueba gratuita y arrancas rápido.",
        includedLabel: "Incluido en cada suscripción",
        included: [
          "Configuración inicial adaptada a tu actividad",
          "Importación de tus datos existentes",
          "Formación de tus equipos en la herramienta",
          "Soporte y actualizaciones incluidos",
        ],
        forWhoLabel: "Para quién",
        forWho:
          "Empresas, despachos, escuelas, clínicas, agencias inmobiliarias y farmacias.",
        href: "/logiciels",
        hrefLabel: "Descubrir los seis programas",
      },
      {
        id: "community",
        num: "04",
        title: "Community management",
        mission:
          "Animar tus redes sociales para construir una comunidad comprometida con tu marca. Nuestro equipo de terreno crea contenidos que hablan a tu audiencia y mantienen viva la conversación.",
        includedLabel: "Incluido en cada fórmula",
        included: [
          "Calendario editorial validado contigo",
          "Contenido creado por nuestro equipo de terreno",
          "Publicación y moderación diarias",
          "Informe mensual para medir resultados",
        ],
        forWhoLabel: "Para quién",
        forWho:
          "Marcas, comercios, organizadores de eventos e instituciones que quieren seguir visibles y cerca de su audiencia.",
      },
      {
        id: "acquisition",
        num: "05",
        title: "Captación de clientes",
        mission:
          "Llenar tu cartera de pedidos con prospectos cualificados, no solo aumentar tu visibilidad. Creamos campañas que llegan a las personas adecuadas y seguimos cada conversión.",
        includedLabel: "Incluido en cada dispositivo",
        included: [
          "Estrategia de generación de leads adaptada a tu mercado",
          "Landing pages diseñadas para convertir",
          "Campañas monitoreadas y ajustadas en continuo",
          "Seguimiento de las conversiones hasta la venta",
        ],
        forWhoLabel: "Para quién",
        forWho:
          "Empresas B2B y B2C que quieren contactos comerciales, no solo visibilidad.",
      },
      {
        id: "training",
        num: "06",
        title: "Formación",
        mission:
          "Hacer que tus equipos sean realmente autónomos con las herramientas digitales del día a día. Nuestras sesiones prácticas permiten a cada participante manipular, probar y avanzar a su ritmo.",
        includedLabel: "Incluido en cada sesión",
        included: [
          "Sesiones prácticas en grupos reducidos",
          "Materiales adaptados a tu contexto",
          "Acompañamiento post-formación para consolidar lo aprendido",
        ],
        forWhoLabel: "Para quién",
        forWho:
          "Equipos internos, direcciones y comerciantes que quieren dominar sus herramientas digitales.",
      },
      {
        id: "strategy",
        num: "07",
        title: "Estrategia de empresa",
        mission:
          "Estrategias a medida para estructurar y acelerar el crecimiento de tu empresa, en coherencia con tu realidad y tu mercado. Esta área abre próximamente.",
        includedLabel: "Incluido",
        included: [],
        forWhoLabel: "Para quién",
        forWho:
          "Dirigentes en fase de estructuración o de expansión que quieren una mirada exterior y rigurosa.",
        soon: true,
      },
    ],
    cta: {
      title: "¿Tienes un proyecto?",
      gold: "Hablemos.",
      sub: "Cuéntanos tu necesidad: te respondemos con un presupuesto detallado en 48 horas.",
      primaryLabel: "Solicitar presupuesto",
      secondaryLabel: "Ver precios",
    },
    crossLinks: {
      title: "Explorar también",
      items: [
        {
          href: "/logiciels",
          title: "Seis programas listos para tu oficio",
          desc: "Facturación, contabilidad, salud, escuela, inmobiliaria, farmacia: herramientas de gestión listas para usar, con prueba gratuita de 7 días.",
        },
        {
          href: "/tarifs",
          title: "Precios claros, anunciados por adelantado",
          desc: "Sitios web, software a medida y suscripciones SaaS, en francos guineanos, sin sorpresas al facturar.",
        },
        {
          href: "/methode",
          title: "Cinco etapas, cero sorpresas",
          desc: "Escucha, concepción, desarrollo, entrega y acompañamiento durante toda la colaboración.",
        },
      ],
    },
  },
  zh: {
    heroChips: ["七大专业领域", "唯一对接人", "48 小时内报价"],
    detail: {
      label: "各领域详解",
      title: "七大领域，",
      gold: "同一标准。",
      sub: "使命、包含内容、适用对象：每个专业领域能为您的业务带来什么，一目了然。",
      soonLabel: "即将推出",
    },
    poles: [
      {
        id: "web",
        num: "01",
        title: "网站",
        mission:
          "打造展示型网站与在线商店，从第一秒起就建立信任，把访客转化为客户。每一个页面都围绕您的形象与商业目标精心设计。",
        includedLabel: "每个网站均包含",
        included: [
          "展示型网站或电商网站，贴合您的形象",
          "管理后台，轻松管理内容",
          "商店支持安全在线支付",
          "面向您的市场的多语言版本",
          "文字聊天机器人与联系人收集表单",
          "上线后免费修复缺陷",
        ],
        forWhoLabel: "适用对象",
        forWho: "希望拥有可信且高效在线形象的中小企业、商户、机构与自由职业者。",
      },
      {
        id: "software",
        num: "02",
        title: "软件与应用",
        mission:
          "开发贴合您真实流程的定制管理软件与移动应用，而不是强迫您改变工作方式。我们从您的实际业务出发，而非套用通用模板。",
        includedLabel: "每个项目均包含",
        included: [
          "工作坊式需求梳理，深入分析您的流程",
          "迭代开发，定期演示",
          "驾驶舱看板，掌控业务全局",
          "为您的团队提供完整培训",
          "免费维护与修复",
        ],
        forWhoLabel: "适用对象",
        forWho: "流程无法套用任何标准模板、真正需要量身定制工具的组织。",
      },
      {
        id: "saas",
        num: "03",
        title: "管理类 SaaS",
        mission:
          "六款经过验证的行业软件即开即用，第一天起就按您的业务完成配置。先通过免费试用在真实环境中体验，再快速上手。",
        includedLabel: "每份订阅均包含",
        included: [
          "按您的业务完成初始配置",
          "导入您的现有数据",
          "为您的团队提供工具培训",
          "支持与更新全部包含",
        ],
        forWhoLabel: "适用对象",
        forWho: "企业、事务所、学校、诊所、房产中介与药店。",
        href: "/logiciels",
        hrefLabel: "查看六款软件",
      },
      {
        id: "community",
        num: "04",
        title: "社媒运营",
        mission:
          "运营您的社交媒体，围绕品牌建立有粘性的社区。我们的地面团队创作贴近受众的内容，让对话持续升温。",
        includedLabel: "每项服务均包含",
        included: [
          "与您共同确认的编辑日历",
          "由地面团队原创内容",
          "每日发布与互动维护",
          "月度报告，量化效果",
        ],
        forWhoLabel: "适用对象",
        forWho: "希望保持曝光并贴近受众的品牌、商户、活动主办方与机构。",
      },
      {
        id: "acquisition",
        num: "05",
        title: "客户获取",
        mission:
          "用高质量线索填满您的订单簿，而不只是提升曝光。我们打造触达精准人群的广告活动，并跟踪每一次转化。",
        includedLabel: "每项方案均包含",
        included: [
          "贴合您市场的获客策略",
          "为转化而设计的落地页",
          "全程监测、持续调优的投放",
          "从线索到成交的转化跟踪",
        ],
        forWhoLabel: "适用对象",
        forWho: "要的是商业线索、而不只是曝光度的 B2B 与 B2C 企业。",
      },
      {
        id: "training",
        num: "06",
        title: "培训",
        mission:
          "让您的团队真正掌握日常数字工具。实操式培训让每位学员动手练习、大胆尝试、按自己的节奏进步。",
        includedLabel: "每场培训均包含",
        included: [
          "小班实操课程",
          "贴合您场景的教材",
          "训后跟进，巩固所学",
        ],
        forWhoLabel: "适用对象",
        forWho: "想用好数字工具的内部团队、管理层与商户。",
      },
      {
        id: "strategy",
        num: "07",
        title: "企业战略",
        mission:
          "提供量身定制的战略方案，在符合您现实与市场的前提下，搭建增长框架并加速成长。该领域即将推出。",
        includedLabel: "包含内容",
        included: [],
        forWhoLabel: "适用对象",
        forWho: "处于体系搭建或扩张阶段、需要严谨外部视角的决策者。",
        soon: true,
      },
    ],
    cta: {
      title: "有项目要做？",
      gold: "聊聊吧。",
      sub: "告诉我们您的需求，48 小时内您将收到一份详细报价。",
      primaryLabel: "索取报价",
      secondaryLabel: "查看价格",
    },
    crossLinks: {
      title: "继续探索",
      items: [
        {
          href: "/logiciels",
          title: "六款即用型行业软件",
          desc: "发票、会计、医疗、学校、房产、药店：开箱即用的管理工具，含 7 天免费试用。",
        },
        {
          href: "/tarifs",
          title: "价格透明，提前公开",
          desc: "网站、定制软件与 SaaS 订阅，均以几内亚法郎计价，账单零意外。",
        },
        {
          href: "/methode",
          title: "五个步骤，零意外",
          desc: "倾听、设计、开发、交付与跟进，贯穿整个合作。",
        },
      ],
    },
  },
  de: {
    heroChips: ["7 Kompetenzbereiche", "Ein einziger Ansprechpartner", "Angebot in 48 Stunden"],
    detail: {
      label: "Jeder Bereich im Detail",
      title: "Sieben Bereiche,",
      gold: "ein einziger Anspruch.",
      sub: "Mission, enthaltene Leistungen, passende Profile: Was jeder Kompetenzbereich konkret für Ihr Geschäft leistet.",
      soonLabel: "In Kürze",
    },
    poles: [
      {
        id: "web",
        num: "01",
        title: "Websites",
        mission:
          "Wir gestalten Präsentationswebsites und Online-Shops, die vom ersten Sekundenblick an Vertrauen schaffen und Besucher in Kunden verwandeln. Jede Seite entsteht rund um Ihr Erscheinungsbild und Ihre Geschäftsziele.",
        includedLabel: "In jeder Website enthalten",
        included: [
          "Präsentationswebsite oder E-Commerce-Shop, passend zu Ihrem Erscheinungsbild",
          "Admin-Dashboard zur Verwaltung Ihrer Inhalte",
          "Sichere Online-Zahlungen für Shops",
          "Mehrsprachige Version für Ihre Märkte",
          "Schriftlicher Chatbot und Formular zur Kontakt-Erfassung",
          "Kostenlose Fehlerbehebung nach dem Launch",
        ],
        forWhoLabel: "Für wen",
        forWho:
          "Kleine und mittlere Unternehmen, Händler, Institutionen und Freiberufler, die einen glaubwürdigen und wirksamen Online-Auftritt wollen.",
      },
      {
        id: "software",
        num: "02",
        title: "Software & Anwendungen",
        mission:
          "Wir entwickeln Management-Software und mobile Apps, die sich Ihren realen Abläufen anpassen – statt Sie zu zwingen, Ihre Arbeitsweise zu ändern. Wir starten bei Ihnen vor Ort, nicht bei einer generischen Vorlage.",
        includedLabel: "In jedem Projekt enthalten",
        included: [
          "Klärungsworkshop zur Analyse Ihrer Prozesse",
          "Iterative Entwicklung mit regelmäßigen Vorführungen",
          "Dashboard zur Steuerung Ihrer Aktivität",
          "Vollständige Schulung Ihrer Teams",
          "Wartung und kostenlose Korrekturen",
        ],
        forWhoLabel: "Für wen",
        forWho:
          "Organisationen, deren Prozesse in kein Standardschema passen und die ein wirklich maßgeschneidertes Werkzeug brauchen.",
      },
      {
        id: "saas",
        num: "03",
        title: "Management-SaaS",
        mission:
          "Sechs erprobte Branchensoftware-Lösungen, sofort verfügbar und ab dem ersten Tag auf Ihre Tätigkeit konfiguriert. Sie testen im realen Umfeld mit einer kostenlosen Testphase und starten schnell durch.",
        includedLabel: "In jedem Abo enthalten",
        included: [
          "Erstkonfiguration passend zu Ihrer Tätigkeit",
          "Import Ihrer bestehenden Daten",
          "Schulung Ihrer Teams im Werkzeug",
          "Support und Updates inklusive",
        ],
        forWhoLabel: "Für wen",
        forWho:
          "Unternehmen, Kanzleien, Schulen, Kliniken, Immobilienagenturen und Apotheken.",
        href: "/logiciels",
        hrefLabel: "Die sechs Softwarelösungen ansehen",
      },
      {
        id: "community",
        num: "04",
        title: "Community-Management",
        mission:
          "Wir betreuen Ihre Social-Media-Kanäle und bauen eine engagierte Community rund um Ihre Marke auf. Unser Team vor Ort erstellt Inhalte, die Ihr Publikum ansprechen und das Gespräch am Laufen halten.",
        includedLabel: "In jeder Variante enthalten",
        included: [
          "Redaktionskalender, gemeinsam mit Ihnen abgestimmt",
          "Inhalte aus der Hand unseres Teams vor Ort",
          "Tägliche Veröffentlichung und Moderation",
          "Monatsbericht zur Erfolgsmessung",
        ],
        forWhoLabel: "Für wen",
        forWho:
          "Marken, Händler, Eventveranstalter und Institutionen, die sichtbar bleiben und nah an ihrem Publikum sein wollen.",
      },
      {
        id: "acquisition",
        num: "05",
        title: "Kundengewinnung",
        mission:
          "Wir füllen Ihr Auftragsbuch mit qualifizierten Interessenten – statt nur Ihre Sichtbarkeit zu erhöhen. Wir bauen Kampagnen, die die richtigen Menschen erreichen, und verfolgen jede Konversion.",
        includedLabel: "In jedem Programm enthalten",
        included: [
          "Lead-Generierungsstrategie passend zu Ihrem Markt",
          "Landingpages, konzipiert für Conversions",
          "Kampagnen, laufend überwacht und nachjustiert",
          "Konversions-Tracking bis zum Abschluss",
        ],
        forWhoLabel: "Für wen",
        forWho:
          "B2B- und B2C-Unternehmen, die geschäftliche Kontakte wollen, nicht nur Sichtbarkeit.",
      },
      {
        id: "training",
        num: "06",
        title: "Schulungen",
        mission:
          "Wir machen Ihre Teams im Alltag wirklich selbstständig mit digitalen Werkzeugen. Unsere Praxis-Sessions lassen jeden Teilnehmer selbst anpacken, ausprobieren und im eigenen Tempo Fortschritte machen.",
        includedLabel: "In jeder Schulung enthalten",
        included: [
          "Praxis-Sessions in kleinen Gruppen",
          "Unterlagen, angepasst an Ihren Kontext",
          "Nachbetreuung nach der Schulung zur Festigung",
        ],
        forWhoLabel: "Für wen",
        forWho:
          "Interne Teams, Führungskräfte und Händler, die ihre digitalen Werkzeuge beherrschen wollen.",
      },
      {
        id: "strategy",
        num: "07",
        title: "Unternehmensstrategie",
        mission:
          "Maßgeschneiderte Strategien, um das Wachstum Ihres Unternehmens zu strukturieren und zu beschleunigen – im Einklang mit Ihrer Realität und Ihrem Markt. Dieser Bereich öffnet in Kürze.",
        includedLabel: "Enthalten",
        included: [],
        forWhoLabel: "Für wen",
        forWho:
          "Führungskräfte in Strukturierungs- oder Expansionsphasen, die einen rigurosen Blick von außen wünschen.",
        soon: true,
      },
    ],
    cta: {
      title: "Ein Projekt im Kopf?",
      gold: "Sprechen wir darüber.",
      sub: "Schildern Sie uns Ihr Anliegen: Sie erhalten binnen 48 Stunden ein detailliertes Angebot.",
      primaryLabel: "Angebot anfordern",
      secondaryLabel: "Preise ansehen",
    },
    crossLinks: {
      title: "Auch entdecken",
      items: [
        {
          href: "/logiciels",
          title: "Sechs Softwarelösungen für Ihr Gewerbe",
          desc: "Fakturierung, Buchhaltung, Gesundheit, Schule, Immobilien, Apotheke: einsatzbereite Management-Tools, mit kostenlosem 7-Tage-Test.",
        },
        {
          href: "/tarifs",
          title: "Klare Preise, vorab angekündigt",
          desc: "Websites, individuelle Software und SaaS-Abos, in guineischen Francs, ohne Überraschungen bei der Abrechnung.",
        },
        {
          href: "/methode",
          title: "Fünf Schritte, keine Überraschungen",
          desc: "Zuhören, Konzeption, Entwicklung, Lieferung und Begleitung während der gesamten Zusammenarbeit.",
        },
      ],
    },
  },
};
