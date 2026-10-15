import type { Localized } from "@/lib/page-content";

/**
 * Contenu de la page /realisations — 5 langues complètes.
 * Règle anti-invention : cette page ne décrit que des TYPES de missions
 * génériques (objectif + livrables typiques). Les projets, partenaires
 * et témoignages réels proviennent des API et s'affichent dans les
 * sections existantes — elles se masquent d'elles-mêmes si vides.
 */

export type WorkTypeIcon =
  | "globe"
  | "cart"
  | "dashboard"
  | "cloud"
  | "share"
  | "target";

export interface WorkTypeCard {
  icon: WorkTypeIcon;
  title: string;
  goal: string;
  deliverables: string[];
}

export interface RealisationsContent {
  hero: {
    label: string;
    title: string;
    gold: string;
    sub: string;
    chips: string[];
  };
  workTypes: {
    label: string;
    title: string;
    gold: string;
    sub: string;
    deliverablesLabel: string;
    cards: WorkTypeCard[];
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

export const REALISATIONS: Localized<RealisationsContent> = {
  fr: {
    hero: {
      label: "Références",
      title: "Des projets livrés,",
      gold: "des clients accompagnés.",
      sub: "Chaque mission suit la même logique : une écoute sérieuse de votre activité, une conception sur mesure, un développement rigoureux, une formation de vos équipes puis un suivi qui dure. Voici les types de missions que nous menons, les projets livrés et les partenaires qui nous font confiance.",
      chips: [
        "Sites web",
        "Logiciels sur mesure",
        "SaaS déployés",
        "Accompagnement long terme",
      ],
    },
    workTypes: {
      label: "Types de missions",
      title: "Ce que nous construisons,",
      gold: "mission après mission.",
      sub: "Plutôt que de promettre, nous décrivons : voici les six familles de missions que nous menons le plus souvent, avec leur objectif et les livrables que vous recevez. Les projets réels publiés par l'agence apparaissent plus bas.",
      deliverablesLabel: "Livrables typiques",
      cards: [
        {
          icon: "globe",
          title: "Site vitrine pour PME",
          goal: "Donner à votre entreprise une présence en ligne crédible : une vitrine claire, rapide et facile à trouver, qui transforme vos visiteurs en contacts.",
          deliverables: [
            "Pages conçues et rédigées par l'agence",
            "Formulaire de contact et capture de prospects",
            "Nom de domaine, hébergement et mise en ligne",
          ],
        },
        {
          icon: "cart",
          title: "Boutique en ligne",
          goal: "Vendre vos produits sur Internet sans friction : catalogue soigné, paiement intégré et gestion simple de vos commandes au quotidien.",
          deliverables: [
            "Catalogue produits, panier et paiement intégré",
            "Tableau de bord de suivi des commandes",
            "Prise en main guidée de votre équipe",
          ],
        },
        {
          icon: "dashboard",
          title: "Logiciel de gestion interne",
          goal: "Remplacer les fichiers dispersés et les registres papier par un outil unique, adapté à vos processus réels plutôt que l'inverse.",
          deliverables: [
            "Application sur mesure paramétrée pour vos processus",
            "Comptes utilisateurs, droits d'accès et sauvegardes",
            "Formation des équipes et corrections sans frais",
          ],
        },
        {
          icon: "cloud",
          title: "Déploiement SaaS métier",
          goal: "Mettre en place un logiciel de gestion prêt à l'emploi — facturation, comptabilité, santé, école, immobilier ou pharmacie — sans attendre un développement complet.",
          deliverables: [
            "Paramétrage du logiciel pour votre activité",
            "Import de vos données et essai encadré de 7 jours",
            "Assistance et mises à jour pendant l'abonnement",
          ],
        },
        {
          icon: "share",
          title: "Animation de réseaux sociaux",
          goal: "Rester visible et proche de vos clients : une présence régulière, professionnelle et cohérente avec votre image, sans y passer vos soirées.",
          deliverables: [
            "Calendrier éditorial et publications régulières",
            "Modération et réponses aux messages",
            "Rapport mensuel d'activité et recommandations",
          ],
        },
        {
          icon: "target",
          title: "Campagne d'acquisition",
          goal: "Générer de vrais contacts qualifiés pour remplir votre carnet de commandes, avec un budget maîtrisé et des résultats mesurables.",
          deliverables: [
            "Stratégie et canaux adaptés à votre budget",
            "Pages de capture et suivi des prospects",
            "Reporting des résultats et ajustements continus",
          ],
        },
      ],
    },
    cta: {
      title: "Votre projet pourrait être le prochain.",
      gold: "Parlons-en.",
      sub: "Décrivez-nous votre besoin : nous revenons vers vous avec une approche adaptée et un devis détaillé sous 48 heures.",
      primaryLabel: "Démarrer un projet",
      primaryHref: "/contact",
      secondaryLabel: "Voir nos services",
      secondaryHref: "/services",
    },
    crossLinks: {
      title: "Explorer aussi",
      items: [
        {
          href: "/services",
          title: "Services",
          desc: "Sites web, logiciels sur mesure, SaaS, community management, acquisition, formations et stratégie : le détail de nos sept pôles.",
        },
        {
          href: "/blog",
          title: "Journal",
          desc: "Actualités de l'agence et conseils d'experts pour réussir votre transformation digitale.",
        },
        {
          href: "/contact",
          title: "Contact",
          desc: "Un projet, une question, un devis : nous répondons sous 24 heures ouvrées.",
        },
      ],
    },
  },
  en: {
    hero: {
      label: "References",
      title: "Projects delivered,",
      gold: "clients supported.",
      sub: "Every engagement follows the same logic: serious listening to your business, tailored design, rigorous development, training for your teams and follow-up that lasts. Here are the types of missions we carry out, the projects delivered and the partners who trust us.",
      chips: [
        "Websites",
        "Custom software",
        "SaaS deployed",
        "Long-term support",
      ],
    },
    workTypes: {
      label: "Types of engagements",
      title: "What we build,",
      gold: "mission after mission.",
      sub: "Rather than promising, we describe: here are the six families of missions we handle most often, with their goal and the deliverables you receive. The agency's real published projects appear below.",
      deliverablesLabel: "Typical deliverables",
      cards: [
        {
          icon: "globe",
          title: "Showcase website for SMEs",
          goal: "Give your business a credible online presence: a clear, fast and easy-to-find showcase that turns visitors into contacts.",
          deliverables: [
            "Pages designed and written by the agency",
            "Contact form and lead capture",
            "Domain name, hosting and go-live",
          ],
        },
        {
          icon: "cart",
          title: "Online store",
          goal: "Sell your products online without friction: a polished catalogue, integrated payment and simple day-to-day order management.",
          deliverables: [
            "Product catalogue, cart and integrated payment",
            "Order-tracking dashboard",
            "Guided onboarding for your team",
          ],
        },
        {
          icon: "dashboard",
          title: "Internal management software",
          goal: "Replace scattered files and paper registers with a single tool shaped around your real processes, not the other way round.",
          deliverables: [
            "Custom application tailored to your processes",
            "User accounts, access rights and backups",
            "Team training and free corrections",
          ],
        },
        {
          icon: "cloud",
          title: "Business SaaS deployment",
          goal: "Set up a ready-to-use management tool — invoicing, accounting, health, schools, real estate or pharmacy — without waiting for full development.",
          deliverables: [
            "Software configured for your business",
            "Data import and supervised 7-day trial",
            "Support and updates during the subscription",
          ],
        },
        {
          icon: "share",
          title: "Social media management",
          goal: "Stay visible and close to your clients: a regular, professional presence consistent with your brand, without spending your evenings on it.",
          deliverables: [
            "Editorial calendar and regular posts",
            "Moderation and message replies",
            "Monthly activity report and recommendations",
          ],
        },
        {
          icon: "target",
          title: "Client acquisition campaign",
          goal: "Generate genuine qualified contacts to fill your order book, with a controlled budget and measurable results.",
          deliverables: [
            "Strategy and channels adapted to your budget",
            "Landing pages and prospect follow-up",
            "Results reporting and continuous adjustments",
          ],
        },
      ],
    },
    cta: {
      title: "Your project could be next.",
      gold: "Let's talk.",
      sub: "Tell us what you need: we come back to you with a tailored approach and a detailed quote within 48 hours.",
      primaryLabel: "Start a project",
      primaryHref: "/contact",
      secondaryLabel: "See our services",
      secondaryHref: "/services",
    },
    crossLinks: {
      title: "Explore more",
      items: [
        {
          href: "/services",
          title: "Services",
          desc: "Websites, custom software, SaaS, social media, acquisition, training and strategy: our seven areas in detail.",
        },
        {
          href: "/blog",
          title: "Journal",
          desc: "Agency news and expert advice to make your digital transformation a success.",
        },
        {
          href: "/contact",
          title: "Contact",
          desc: "A project, a question, a quote: we reply within 24 working hours.",
        },
      ],
    },
  },
  es: {
    hero: {
      label: "Referencias",
      title: "Proyectos entregados,",
      gold: "clientes acompañados.",
      sub: "Cada misión sigue la misma lógica: escucha atenta de su actividad, diseño a medida, desarrollo riguroso, formación de sus equipos y un seguimiento que dura. Estas son las misiones que realizamos, los proyectos entregados y los socios que confían en nosotros.",
      chips: [
        "Sitios web",
        "Software a medida",
        "SaaS desplegados",
        "Acompañamiento a largo plazo",
      ],
    },
    workTypes: {
      label: "Tipos de misiones",
      title: "Lo que construimos,",
      gold: "misión tras misión.",
      sub: "En lugar de prometer, describimos: estas son las seis familias de misiones que realizamos con más frecuencia, con su objetivo y los entregables que recibe. Los proyectos reales publicados por la agencia aparecen más abajo.",
      deliverablesLabel: "Entregables típicos",
      cards: [
        {
          icon: "globe",
          title: "Sitio web corporativo para pymes",
          goal: "Dar a su empresa una presencia en línea creíble: una vitrina clara, rápida y fácil de encontrar que convierte a sus visitantes en contactos.",
          deliverables: [
            "Páginas diseñadas y redactadas por la agencia",
            "Formulario de contacto y captura de prospectos",
            "Dominio, alojamiento y puesta en línea",
          ],
        },
        {
          icon: "cart",
          title: "Tienda en línea",
          goal: "Vender sus productos en Internet sin fricciones: catálogo cuidado, pago integrado y gestión sencilla de sus pedidos a diario.",
          deliverables: [
            "Catálogo de productos, carrito y pago integrado",
            "Panel de seguimiento de pedidos",
            "Acompañamiento para que su equipo lo domine",
          ],
        },
        {
          icon: "dashboard",
          title: "Software de gestión interna",
          goal: "Sustituir los archivos dispersos y los registros en papel por una herramienta única, adaptada a sus procesos reales y no al revés.",
          deliverables: [
            "Aplicación a medida parametrizada para sus procesos",
            "Cuentas de usuario, permisos y copias de seguridad",
            "Formación de los equipos y correcciones sin coste",
          ],
        },
        {
          icon: "cloud",
          title: "Despliegue de SaaS sectorial",
          goal: "Poner en marcha un software de gestión listo para usar — facturación, contabilidad, salud, escuela, inmobiliaria o farmacia — sin esperar un desarrollo completo.",
          deliverables: [
            "Parametrización del software para su actividad",
            "Importación de sus datos y prueba guiada de 7 días",
            "Asistencia y actualizaciones durante la suscripción",
          ],
        },
        {
          icon: "share",
          title: "Gestión de redes sociales",
          goal: "Seguir siendo visible y cercano a sus clientes: presencia regular, profesional y coherente con su imagen, sin dedicarle sus noches.",
          deliverables: [
            "Calendario editorial y publicaciones regulares",
            "Moderación y respuesta a los mensajes",
            "Informe mensual de actividad y recomendaciones",
          ],
        },
        {
          icon: "target",
          title: "Campaña de adquisición",
          goal: "Generar contactos cualificados reales para llenar su cartera de pedidos, con un presupuesto controlado y resultados medibles.",
          deliverables: [
            "Estrategia y canales adaptados a su presupuesto",
            "Páginas de captura y seguimiento de prospectos",
            "Informes de resultados y ajustes continuos",
          ],
        },
      ],
    },
    cta: {
      title: "Su proyecto podría ser el próximo.",
      gold: "Hablemos.",
      sub: "Cuéntenos su necesidad: le respondemos con un enfoque adaptado y un presupuesto detallado en 48 horas.",
      primaryLabel: "Iniciar un proyecto",
      primaryHref: "/contact",
      secondaryLabel: "Ver nuestros servicios",
      secondaryHref: "/services",
    },
    crossLinks: {
      title: "Explorar también",
      items: [
        {
          href: "/services",
          title: "Servicios",
          desc: "Sitios web, software a medida, SaaS, community management, adquisición, formación y estrategia: el detalle de nuestros siete polos.",
        },
        {
          href: "/blog",
          title: "Diario",
          desc: "Noticias de la agencia y consejos de expertos para lograr su transformación digital.",
        },
        {
          href: "/contact",
          title: "Contacto",
          desc: "Un proyecto, una pregunta, un presupuesto: respondemos en 24 horas laborables.",
        },
      ],
    },
  },
  zh: {
    hero: {
      label: "客户参考",
      title: "项目已交付，",
      gold: "客户被陪伴。",
      sub: "每一项任务都遵循同一套逻辑：认真倾听您的业务、量身设计方案、严谨开发、培训您的团队，并提供长期跟进。以下是我们的任务类型、已交付的项目以及信任我们的合作伙伴。",
      chips: ["网站", "定制软件", "SaaS 部署", "长期陪伴"],
    },
    workTypes: {
      label: "任务类型",
      title: "我们在建造什么，",
      gold: "一个任务接一个任务。",
      sub: "我们不做空泛的承诺，而是具体描述：以下是我们最常承接的六类任务，包含目标与您将获得的交付物。机构发布的真实项目展示在下方。",
      deliverablesLabel: "典型交付物",
      cards: [
        {
          icon: "globe",
          title: "中小企业展示型网站",
          goal: "为您的企业提供可信的线上形象：清晰、快速、易于找到的展示窗口，把访客转化为联系人。",
          deliverables: [
            "由机构设计并撰写内容的页面",
            "联系表单与潜在客户收集",
            "域名、托管与上线部署",
          ],
        },
        {
          icon: "cart",
          title: "在线商店",
          goal: "无障碍地在线销售您的产品：精心打造的目录、集成的支付方式以及简单易用的日常订单管理。",
          deliverables: [
            "商品目录、购物车与集成支付",
            "订单跟踪管理面板",
            "团队上手指导培训",
          ],
        },
        {
          icon: "dashboard",
          title: "内部管理软件",
          goal: "用一套统一的工具取代分散的文件和纸质登记簿，让它适应您的真实流程，而不是反过来。",
          deliverables: [
            "按您的流程参数化定制的应用",
            "用户账户、权限与数据备份",
            "团队培训与免费修复",
          ],
        },
        {
          icon: "cloud",
          title: "行业 SaaS 部署",
          goal: "即开即用的管理软件部署——开票、会计、医疗、学校、物业或药房——无需等待完整开发周期。",
          deliverables: [
            "针对您的业务完成软件参数配置",
            "数据导入与 7 天带引导试用",
            "订阅期内的支持与更新",
          ],
        },
        {
          icon: "share",
          title: "社交媒体运营",
          goal: "保持可见度并贴近您的客户：定期、专业、与品牌形象一致的线上呈现，而无需占用您的晚间时间。",
          deliverables: [
            "内容日历与定期发布",
            "评论审核与消息回复",
            "每月活动报告与改进建议",
          ],
        },
        {
          icon: "target",
          title: "获客营销活动",
          goal: "用可控的预算和可衡量的结果，带来真正符合条件的潜在客户，填满您的订单簿。",
          deliverables: [
            "根据预算制定策略与渠道",
            "落地页与潜在客户跟进",
            "结果报告与持续优化",
          ],
        },
      ],
    },
    cta: {
      title: "您的项目也许就是下一个。",
      gold: "聊聊吧。",
      sub: "向我们描述您的需求：我们会带着量身定制的方案和 48 小时内的详细报价回复您。",
      primaryLabel: "启动项目",
      primaryHref: "/contact",
      secondaryLabel: "查看我们的服务",
      secondaryHref: "/services",
    },
    crossLinks: {
      title: "继续探索",
      items: [
        {
          href: "/services",
          title: "服务",
          desc: "网站、定制软件、SaaS、社交媒体运营、获客、培训与战略：七大业务板块详解。",
        },
        {
          href: "/blog",
          title: "日志",
          desc: "机构动态与专家建议，助力您的数字化转型成功。",
        },
        {
          href: "/contact",
          title: "联系我们",
          desc: "项目、问题或报价：我们会在 24 个工作小时内回复。",
        },
      ],
    },
  },
  de: {
    hero: {
      label: "Referenzen",
      title: "Projekte geliefert,",
      gold: "Kunden begleitet.",
      sub: "Jeder Auftrag folgt derselben Logik: aufmerksames Zuhören, maßgeschneiderte Konzeption, saubere Entwicklung, Schulung Ihrer Teams und eine Begleitung, die hält. Hier sind die Auftragsarten, die wir durchführen, die gelieferten Projekte und die Partner, die uns vertrauen.",
      chips: [
        "Websites",
        "Individualsoftware",
        "SaaS ausgerollt",
        "Langfristige Begleitung",
      ],
    },
    workTypes: {
      label: "Auftragsarten",
      title: "Was wir bauen,",
      gold: "Auftrag für Auftrag.",
      sub: "Statt zu versprechen, beschreiben wir: dies sind die sechs Auftragsarten, die wir am häufigsten durchführen, mit Ziel und den Lieferergebnissen, die Sie erhalten. Die echten, veröffentlichten Projekte der Agentur finden Sie weiter unten.",
      deliverablesLabel: "Typische Lieferergebnisse",
      cards: [
        {
          icon: "globe",
          title: "Webauftritt für KMU",
          goal: "Ihrem Unternehmen ein glaubwürdiges Online-Profil geben: klar, schnell und leicht auffindbar — und Besucher in Kontakte verwandeln.",
          deliverables: [
            "Von der Agentur gestaltete und geschriebene Seiten",
            "Kontaktformular und Lead-Erfassung",
            "Domain, Hosting und Inbetriebnahme",
          ],
        },
        {
          icon: "cart",
          title: "Online-Shop",
          goal: "Ihre Produkte reibungsfrei online verkaufen: gepflegter Katalog, integrierte Zahlung und einfache Tagesverwaltung Ihrer Bestellungen.",
          deliverables: [
            "Produktkatalog, Warenkorb und integrierte Zahlung",
            "Dashboard zur Bestellnachverfolgung",
            "Geführte Einarbeitung Ihres Teams",
          ],
        },
        {
          icon: "dashboard",
          title: "Interne Verwaltungssoftware",
          goal: "Verstreute Dateien und Papierregister durch ein einziges Werkzeug ersetzen — passend zu Ihren echten Abläufen, nicht umgekehrt.",
          deliverables: [
            "Maßgeschneiderte Anwendung für Ihre Abläufe",
            "Benutzerkonten, Zugriffsrechte und Backups",
            "Team-Schulung und kostenfreie Korrekturen",
          ],
        },
        {
          icon: "cloud",
          title: "SaaS-Einführung für Ihr Gewerbe",
          goal: "Ein einsatzbereites Verwaltungstool einrichten — Rechnungswesen, Buchhaltung, Gesundheit, Schule, Immobilien oder Apotheke — ohne lange Entwicklungszeit.",
          deliverables: [
            "Konfiguration der Software für Ihre Tätigkeit",
            "Datenimport und begleitete 7-Tage-Testphase",
            "Support und Updates während des Abos",
          ],
        },
        {
          icon: "share",
          title: "Social-Media-Betreuung",
          goal: "Sichtbar bleiben und nah bei Ihren Kunden: regelmäßige, professionelle und markenkonforme Präsenz — ohne Ihre Abende dafür zu opfern.",
          deliverables: [
            "Redaktionsplan und regelmäßige Beiträge",
            "Moderation und Beantwortung von Nachrichten",
            "Monatlicher Aktivitätsbericht und Empfehlungen",
          ],
        },
        {
          icon: "target",
          title: "Kundengewinnungs-Kampagne",
          goal: "Echte, qualifizierte Kontakte generieren, um Ihr Auftragsbuch zu füllen — mit kontrolliertem Budget und messbaren Ergebnissen.",
          deliverables: [
            "Strategie und Kanäle passend zu Ihrem Budget",
            "Landingpages und Nachverfolgung der Kontakte",
            "Ergebnisberichte und laufende Anpassungen",
          ],
        },
      ],
    },
    cta: {
      title: "Ihr Projekt könnte das nächste sein.",
      gold: "Sprechen wir darüber.",
      sub: "Beschreiben Sie uns Ihr Anliegen: Wir melden uns mit einem passenden Ansatz und einem Detailangebot innerhalb von 48 Stunden.",
      primaryLabel: "Projekt starten",
      primaryHref: "/contact",
      secondaryLabel: "Unsere Services ansehen",
      secondaryHref: "/services",
    },
    crossLinks: {
      title: "Auch entdecken",
      items: [
        {
          href: "/services",
          title: "Services",
          desc: "Websites, Individualsoftware, SaaS, Social Media, Kundengewinnung, Schulungen und Strategie: unsere sieben Bereiche im Detail.",
        },
        {
          href: "/blog",
          title: "Journal",
          desc: "News der Agentur und Expertenrat für eine erfolgreiche digitale Transformation.",
        },
        {
          href: "/contact",
          title: "Kontakt",
          desc: "Projekt, Frage oder Angebot: Wir antworten innerhalb von 24 Arbeitsstunden.",
        },
      ],
    },
  },
};
