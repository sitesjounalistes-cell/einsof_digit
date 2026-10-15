import type { Localized } from "@/lib/page-content";

/**
 * Contenu détaillé de la page /methode — le détail des 5 étapes,
 * les deux garanties, l'appel à l'action et les liens croisés, en 5 langues.
 * Les textes du bandeau d'ouverture (titre, or, sous-titre) et la frise
 * des 5 étapes viennent du dictionnaire global (process.*) ; les chips
 * et tout le reste vivent ici, consommés via `useLocalized(METHODE_PAGE)`.
 */

export interface MethodStepDetail {
  num: string;
  title: string;
  doLabel: string;
  doing: string;
  deliverLabel: string;
  deliverables: string[];
  durationLabel: string;
  /** absent quand la durée dépend du périmètre négocié à l'étape 02 */
  duration?: string;
}

export interface MethodePageContent {
  heroChips: string[];
  detail: {
    label: string;
    title: string;
    gold: string;
    sub: string;
  };
  steps: MethodStepDetail[];
  guarantees: {
    heading: {
      label: string;
      title: string;
      gold: string;
      sub: string;
    };
    items: { title: string; desc: string }[];
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
    items: { href: string; title: string; desc: string }[];
  };
}

export const METHODE_PAGE: Localized<MethodePageContent> = {
  fr: {
    heroChips: ["Devis détaillé", "Budget figé", "Suivi inclus"],
    detail: {
      label: "Les cinq étapes en détail",
      title: "Chaque étape,",
      gold: "en toute clarté.",
      sub: "Ce que nous faisons, ce que vous recevez et la durée indicative : tout est posé avant de commencer.",
    },
    steps: [
      {
        num: "01",
        title: "Écoute",
        doLabel: "Ce que nous faisons",
        doing:
          "Entretien approfondi de votre activité, de vos contraintes et de vos objectifs. Nous analysons aussi l'existant pour partir de votre réalité, pas d'un modèle théorique.",
        deliverLabel: "Ce que vous recevez",
        deliverables: [
          "Compte rendu de cadrage écrit",
          "Premières recommandations concrètes",
          "Estimation d'enveloppe budgétaire",
        ],
        durationLabel: "Durée indicative",
        duration: "Quelques jours",
      },
      {
        num: "02",
        title: "Conception",
        doLabel: "Ce que nous faisons",
        doing:
          "Maquettes, parcours utilisateurs et choix techniques, validés point par point avec vous. Rien n'est développé avant que vous ayez dit oui.",
        deliverLabel: "Ce que vous recevez",
        deliverables: ["Maquettes validées ensemble", "Devis détaillé et figé", "Planning de réalisation"],
        durationLabel: "Durée indicative",
        duration: "Une à deux semaines selon le projet",
      },
      {
        num: "03",
        title: "Développement",
        doLabel: "Ce que nous faisons",
        doing:
          "Construction soignée de votre solution, avec des points d'avancement réguliers et des démonstrations à chaque étape clé. Vous voyez le produit prendre forme, semaine après semaine.",
        deliverLabel: "Ce que vous recevez",
        deliverables: [
          "Versions de préproduction consultables",
          "Comptes rendus écrits des points hebdomadaires",
        ],
        durationLabel: "Durée indicative",
        duration: "Selon le périmètre, annoncée au devis",
      },
      {
        num: "04",
        title: "Livraison",
        doLabel: "Ce que nous faisons",
        doing:
          "Recette complète de toutes les fonctionnalités, formation de vos équipes puis mise en ligne accompagnée. Le lancement se fait sans stress, à vos côtés.",
        deliverLabel: "Ce que vous recevez",
        deliverables: [
          "Site ou logiciel en production",
          "Documentation complète",
          "Session de formation",
          "Remise de tous les accès",
        ],
        durationLabel: "Durée indicative",
      },
      {
        num: "05",
        title: "Suivi",
        doLabel: "Ce que nous faisons",
        doing:
          "Après la mise en ligne, nous restons à vos côtés : correction gratuite des bugs, maintenance et évolutions pour faire grandir l'outil avec votre activité.",
        deliverLabel: "Ce que vous recevez",
        deliverables: [
          "Corrections de bugs sans frais",
          "Support réactif au quotidien",
          "Propositions d'évolution régulières",
        ],
        durationLabel: "Durée indicative",
        duration: "Toute la collaboration",
      },
    ],
    guarantees: {
      heading: {
        label: "Deux promesses, noir sur blanc",
        title: "Ce qui ne changera",
        gold: "jamais.",
        sub: "Les deux engagements qui structurent chacune de nos collaborations — écrits dans chaque devis.",
      },
      items: [
        {
          title: "Sérénité garantie",
          desc: "Bugs, failles, erreurs : nous nous en chargeons, sans frais supplémentaires. Seules les nouvelles fonctionnalités sont facturées à part, écrit noir sur blanc dans chaque devis.",
        },
        {
          title: "Des services qui vont plus loin",
          desc: "Site, tableau de bord, chatbot et capture de contacts dès l'offre de base : un seul partenaire pilote tout votre digital.",
        },
      ],
    },
    cta: {
      title: "Prêt à démarrer ?",
      gold: "La première étape est un simple échange.",
      sub: "Un appel, quelques questions, et vous recevez une première estimation sous 48 heures.",
      primaryLabel: "Demander un devis",
      secondaryLabel: "Voir les tarifs",
    },
    crossLinks: {
      title: "Explorer aussi",
      items: [
        {
          href: "/services",
          title: "Services",
          desc: "Sites web, logiciels sur mesure, SaaS, community management, acquisition, formations et stratégie : sept pôles complémentaires.",
        },
        {
          href: "/realisations",
          title: "Réalisations",
          desc: "Projets livrés et clients accompagnés, des partenaires qui nous font confiance depuis sept ans.",
        },
        {
          href: "/tarifs",
          title: "Tarifs",
          desc: "Des prix clairs, annoncés d'avance, en francs guinéens.",
        },
      ],
    },
  },
  en: {
    heroChips: ["Detailed quote", "Fixed budget", "Ongoing support"],
    detail: {
      label: "The five steps in detail",
      title: "Step by step,",
      gold: "in full transparency.",
      sub: "What we do, what you receive and the indicative duration: everything is laid out before we begin.",
    },
    steps: [
      {
        num: "01",
        title: "Listening",
        doLabel: "What we do",
        doing:
          "An in-depth conversation about your activity, your constraints and your goals. We also analyse what already exists, so we start from your reality rather than a theoretical model.",
        deliverLabel: "What you receive",
        deliverables: [
          "A written scoping report",
          "First concrete recommendations",
          "An estimate of the budget envelope",
        ],
        durationLabel: "Indicative duration",
        duration: "A few days",
      },
      {
        num: "02",
        title: "Design",
        doLabel: "What we do",
        doing:
          "Mock-ups, user journeys and technical choices, validated with you point by point. Nothing is built before you have said yes.",
        deliverLabel: "What you receive",
        deliverables: ["Mock-ups validated together", "A detailed, fixed quote", "A delivery schedule"],
        durationLabel: "Indicative duration",
        duration: "One to two weeks depending on the project",
      },
      {
        num: "03",
        title: "Development",
        doLabel: "What we do",
        doing:
          "Careful construction of your solution, with regular progress updates and a demonstration at every key milestone. You watch the product take shape, week after week.",
        deliverLabel: "What you receive",
        deliverables: [
          "Pre-production versions you can try",
          "Written reports from the weekly check-ins",
        ],
        durationLabel: "Indicative duration",
        duration: "Depends on the scope, announced in the quote",
      },
      {
        num: "04",
        title: "Delivery",
        doLabel: "What we do",
        doing:
          "Complete acceptance testing, training for your teams and a guided go-live. The launch happens without stress, by your side.",
        deliverLabel: "What you receive",
        deliverables: [
          "Your site or software in production",
          "Full documentation",
          "A training session",
          "Handover of all access credentials",
        ],
        durationLabel: "Indicative duration",
      },
      {
        num: "05",
        title: "Support",
        doLabel: "What we do",
        doing:
          "After the launch, we stay by your side: free bug fixes, maintenance and evolutions so the tool grows with your business.",
        deliverLabel: "What you receive",
        deliverables: [
          "Bug fixes at no cost",
          "Responsive day-to-day support",
          "Regular improvement proposals",
        ],
        durationLabel: "Indicative duration",
        duration: "The whole collaboration",
      },
    ],
    guarantees: {
      heading: {
        label: "Two promises, in black and white",
        title: "What will never",
        gold: "change.",
        sub: "The two commitments that frame every one of our collaborations — written into every quote.",
      },
      items: [
        {
          title: "Peace of mind, guaranteed",
          desc: "Bugs, vulnerabilities, errors: we take care of them at no extra cost. Only new features are billed separately — written in black and white in every quote.",
        },
        {
          title: "Services that go further",
          desc: "Website, dashboard, chatbot and lead capture from the basic offer: a single partner steers your entire digital world.",
        },
      ],
    },
    cta: {
      title: "Ready to start?",
      gold: "The first step is a simple conversation.",
      sub: "One call, a few questions — and you receive a first estimate within 48 hours.",
      primaryLabel: "Request a quote",
      secondaryLabel: "See pricing",
    },
    crossLinks: {
      title: "Explore more",
      items: [
        {
          href: "/services",
          title: "Services",
          desc: "Websites, custom software, SaaS, community management, acquisition, training and strategy: seven complementary poles.",
        },
        {
          href: "/realisations",
          title: "Our work",
          desc: "Projects delivered and clients supported, partners who have trusted us for seven years.",
        },
        {
          href: "/tarifs",
          title: "Pricing",
          desc: "Clear prices, announced upfront, in Guinean francs.",
        },
      ],
    },
  },
  es: {
    heroChips: ["Presupuesto detallado", "Precio cerrado", "Seguimiento incluido"],
    detail: {
      label: "Las cinco etapas en detalle",
      title: "Etapa a etapa,",
      gold: "sin zonas de sombra.",
      sub: "Lo que hacemos, lo que recibes y la duración estimada: todo queda definido antes de empezar.",
    },
    steps: [
      {
        num: "01",
        title: "Escucha",
        doLabel: "Lo que hacemos",
        doing:
          "Una conversación en profundidad sobre tu actividad, tus restricciones y tus objetivos. También analizamos lo existente para partir de tu realidad, no de un modelo teórico.",
        deliverLabel: "Lo que recibes",
        deliverables: [
          "Un informe de definición por escrito",
          "Primeras recomendaciones concretas",
          "Una estimación del presupuesto global",
        ],
        durationLabel: "Duración estimada",
        duration: "Unos días",
      },
      {
        num: "02",
        title: "Concepción",
        doLabel: "Lo que hacemos",
        doing:
          "Maquetas, recorridos de usuario y decisiones técnicas, validadas contigo punto por punto. Nada se desarrolla antes de que digas sí.",
        deliverLabel: "Lo que recibes",
        deliverables: ["Maquetas validadas juntas", "Presupuesto detallado y cerrado", "Calendario de realización"],
        durationLabel: "Duración estimada",
        duration: "Una o dos semanas según el proyecto",
      },
      {
        num: "03",
        title: "Desarrollo",
        doLabel: "Lo que hacemos",
        doing:
          "Construcción cuidada de tu solución, con puntos de avance regulares y demostraciones en cada hito clave. Ves cómo el producto toma forma, semana tras semana.",
        deliverLabel: "Lo que recibes",
        deliverables: [
          "Versiones de preproducción consultables",
          "Informes escritos de los puntos semanales",
        ],
        durationLabel: "Duración estimada",
        duration: "Según el alcance, anunciada en el presupuesto",
      },
      {
        num: "04",
        title: "Entrega",
        doLabel: "Lo que hacemos",
        doing:
          "Prueba de aceptación completa, formación de tus equipos y puesta en línea acompañada. El lanzamiento se hace sin estrés, a tu lado.",
        deliverLabel: "Lo que recibes",
        deliverables: [
          "Sitio o software en producción",
          "Documentación completa",
          "Sesión de formación",
          "Entrega de todos los accesos",
        ],
        durationLabel: "Duración estimada",
      },
      {
        num: "05",
        title: "Acompañamiento",
        doLabel: "Lo que hacemos",
        doing:
          "Tras la puesta en línea seguimos a tu lado: corrección gratuita de errores, mantenimiento y evoluciones para que la herramienta crezca con tu actividad.",
        deliverLabel: "Lo que recibes",
        deliverables: [
          "Corrección de errores sin coste",
          "Soporte ágil en el día a día",
          "Propuestas de mejora periódicas",
        ],
        durationLabel: "Duración estimada",
        duration: "Toda la colaboración",
      },
    ],
    guarantees: {
      heading: {
        label: "Dos promesas, negro sobre blanco",
        title: "Lo que nunca",
        gold: "cambiará.",
        sub: "Los dos compromisos que estructuran cada colaboración — por escrito en cada presupuesto.",
      },
      items: [
        {
          title: "Tranquilidad garantizada",
          desc: "Errores, fallos, vulnerabilidades: nos encargamos de ellos sin coste adicional. Solo las nuevas funcionalidades se facturan aparte, negro sobre blanco en cada presupuesto.",
        },
        {
          title: "Servicios que van más allá",
          desc: "Sitio web, panel de control, chatbot y captación de contactos desde la oferta básica: un solo socio pilota todo tu mundo digital.",
        },
      ],
    },
    cta: {
      title: "¿Listo para empezar?",
      gold: "El primer paso es una simple conversación.",
      sub: "Una llamada, unas preguntas, y recibes una primera estimación en 48 horas.",
      primaryLabel: "Solicitar presupuesto",
      secondaryLabel: "Ver precios",
    },
    crossLinks: {
      title: "Explorar también",
      items: [
        {
          href: "/services",
          title: "Servicios",
          desc: "Sitios web, software a medida, SaaS, community management, captación, formación y estrategia: siete áreas complementarias.",
        },
        {
          href: "/realisations",
          title: "Realizaciones",
          desc: "Proyectos entregados y clientes acompañados, partners que confían en nosotros desde hace siete años.",
        },
        {
          href: "/tarifs",
          title: "Precios",
          desc: "Precios claros, anunciados por adelantado, en francos guineanos.",
        },
      ],
    },
  },
  zh: {
    heroChips: ["报价明细", "预算锁定", "全程跟进"],
    detail: {
      label: "五个阶段详解",
      title: "每个阶段，",
      gold: "清清楚楚。",
      sub: "我们做什么、您收到什么、大致需要多久：开工之前，一切清晰列明。",
    },
    steps: [
      {
        num: "01",
        title: "倾听",
        doLabel: "我们做什么",
        doing:
          "与您深入对谈，全面了解您的业务、约束与目标。同时分析现有系统与流程，从您的实际出发，而非套用理论模型。",
        deliverLabel: "您会收到",
        deliverables: ["书面的需求梳理纪要", "首批切实可行的建议", "预算区间估算"],
        durationLabel: "参考周期",
        duration: "数日",
      },
      {
        num: "02",
        title: "设计",
        doLabel: "我们做什么",
        doing:
          "原型、用户路径与技术选型，与您逐点确认。您未点头之前，一行代码都不动手。",
        deliverLabel: "您会收到",
        deliverables: ["共同确认的原型", "明细完整、固定不变的报价", "实施排期"],
        durationLabel: "参考周期",
        duration: "视项目而定，约一至两周",
      },
      {
        num: "03",
        title: "开发",
        doLabel: "我们做什么",
        doing:
          "精工细作地构建您的系统，定期同步进度，在每个关键节点现场演示。您能看着产品一周一周长成。",
        deliverLabel: "您会收到",
        deliverables: ["可随时查看的预发布版本", "每周例会的书面纪要"],
        durationLabel: "参考周期",
        duration: "视范围而定，报价时明确",
      },
      {
        num: "04",
        title: "交付",
        doLabel: "我们做什么",
        doing:
          "全功能验收测试、为您的团队提供培训，并在您身边陪同上线。发布从容不迫，我们全程护航。",
        deliverLabel: "您会收到",
        deliverables: ["正式上线的网站或软件", "完整文档", "一场培训课程", "全部账号权限交付"],
        durationLabel: "参考周期",
      },
      {
        num: "05",
        title: "跟进",
        doLabel: "我们做什么",
        doing:
          "上线之后，我们仍在您身边：免费修复缺陷、持续维护，并随业务成长不断演进系统。",
        deliverLabel: "您会收到",
        deliverables: ["缺陷修复不收费", "日常问题快速响应", "定期提出升级建议"],
        durationLabel: "参考周期",
        duration: "整个合作期",
      },
    ],
    guarantees: {
      heading: {
        label: "两条承诺，白纸黑字",
        title: "永远不会",
        gold: "改变。",
        sub: "贯穿每一次合作的两项承诺——逐条写入每份报价单。",
      },
      items: [
        {
          title: "安心有保障",
          desc: "缺陷、漏洞、差错：我们全部负责，不加收任何费用。只有新增功能才单独计费，白纸黑字写进每份报价单。",
        },
        {
          title: "服务更进一步",
          desc: "从基础套餐起即包含网站、管理后台、聊天机器人与客户信息收集：一个伙伴，统管您的全部数字世界。",
        },
      ],
    },
    cta: {
      title: "准备开始了吗？",
      gold: "第一步只是一次交谈。",
      sub: "一通电话、几个问题，48 小时内您就能收到初步估算。",
      primaryLabel: "索取报价",
      secondaryLabel: "查看价格",
    },
    crossLinks: {
      title: "继续探索",
      items: [
        {
          href: "/services",
          title: "服务",
          desc: "网站、定制软件、SaaS、社媒运营、获客、培训与战略：七大互补领域。",
        },
        {
          href: "/realisations",
          title: "案例成果",
          desc: "已交付项目与长期陪伴的客户，七年来始终信任我们的合作伙伴。",
        },
        {
          href: "/tarifs",
          title: "价格",
          desc: "价格透明，提前公开，以几内亚法郎计价。",
        },
      ],
    },
  },
  de: {
    heroChips: ["Detailliertes Angebot", "Festes Budget", "Begleitung inklusive"],
    detail: {
      label: "Die fünf Schritte im Detail",
      title: "Schritt für Schritt,",
      gold: "ohne offene Fragen.",
      sub: "Was wir tun, was Sie erhalten und die voraussichtliche Dauer: alles ist geklärt, bevor wir beginnen.",
    },
    steps: [
      {
        num: "01",
        title: "Zuhören",
        doLabel: "Was wir tun",
        doing:
          "Ein ausführliches Gespräch über Ihr Geschäft, Ihre Rahmenbedingungen und Ihre Ziele. Wir analysieren auch das Bestehende, um bei Ihrer Realität zu starten – nicht bei einem theoretischen Modell.",
        deliverLabel: "Was Sie erhalten",
        deliverables: [
          "Schriftliches Klärungsprotokoll",
          "Erste konkrete Empfehlungen",
          "Eine Schätzung des Budgetrahmens",
        ],
        durationLabel: "Voraussichtliche Dauer",
        duration: "Einige Tage",
      },
      {
        num: "02",
        title: "Konzeption",
        doLabel: "Was wir tun",
        doing:
          "Mock-ups, Nutzerwege und technische Entscheidungen – mit Ihnen Punkt für Punkt abgestimmt. Nichts wird entwickelt, bevor Sie nicht Ja gesagt haben.",
        deliverLabel: "Was Sie erhalten",
        deliverables: ["Gemeinsam freigegebene Mock-ups", "Ein detailliertes, festes Angebot", "Ein Umsetzungsplan"],
        durationLabel: "Voraussichtliche Dauer",
        duration: "Je nach Projekt ein bis zwei Wochen",
      },
      {
        num: "03",
        title: "Entwicklung",
        doLabel: "Was wir tun",
        doing:
          "Sorgfältige Konstruktion Ihrer Lösung, mit regelmäßigen Standberichten und einer Vorführung bei jedem wichtigen Meilenstein. Sie sehen das Produkt Woche für Woche Gestalt annehmen.",
        deliverLabel: "Was Sie erhalten",
        deliverables: [
          "Einsehbare Vorab-Versionen (Preproduktion)",
          "Schriftliche Protokolle der Wochenmeetings",
        ],
        durationLabel: "Voraussichtliche Dauer",
        duration: "Je nach Umfang, im Angebot angekündigt",
      },
      {
        num: "04",
        title: "Lieferung",
        doLabel: "Was wir tun",
        doing:
          "Vollständige Abnahmetests, Schulung Ihrer Teams und ein begleiteter Launch. Der Start verläuft ohne Stress – an Ihrer Seite.",
        deliverLabel: "Was Sie erhalten",
        deliverables: [
          "Website oder Software in Produktion",
          "Vollständige Dokumentation",
          "Eine Schulungseinheit",
          "Übergabe aller Zugänge",
        ],
        durationLabel: "Voraussichtliche Dauer",
      },
      {
        num: "05",
        title: "Begleitung",
        doLabel: "Was wir tun",
        doing:
          "Auch nach dem Launch bleiben wir an Ihrer Seite: kostenlose Fehlerbehebung, Wartung und Weiterentwicklungen, damit das Werkzeug mit Ihrem Geschäft wächst.",
        deliverLabel: "Was Sie erhalten",
        deliverables: [
          "Fehlerkorrekturen ohne Kosten",
          "Reagierender Alltagssupport",
          "Regelmäßige Verbesserungsvorschläge",
        ],
        durationLabel: "Voraussichtliche Dauer",
        duration: "Die gesamte Zusammenarbeit",
      },
    ],
    guarantees: {
      heading: {
        label: "Zwei Versprechen, schwarz auf weiß",
        title: "Was sich nie",
        gold: "ändert.",
        sub: "Die beiden Verpflichtungen, die jede unserer Kooperationen prägen – in jedem Angebot schriftlich festgehalten.",
      },
      items: [
        {
          title: "Entspannung garantiert",
          desc: "Fehler, Schwachstellen, Pannen: Wir kümmern uns darum, ohne Zusatzkosten. Nur neue Funktionen werden separat abgerechnet – schwarz auf weiß in jedem Angebot.",
        },
        {
          title: "Leistungen, die weitergehen",
          desc: "Website, Dashboard, Chatbot und Kontakt-Erfassung ab dem Basisangebot: ein einziger Partner steuert Ihre gesamte digitale Welt.",
        },
      ],
    },
    cta: {
      title: "Bereit loszulegen?",
      gold: "Der erste Schritt ist ein einfaches Gespräch.",
      sub: "Ein Anruf, ein paar Fragen – und Sie erhalten binnen 48 Stunden eine erste Einschätzung.",
      primaryLabel: "Angebot anfordern",
      secondaryLabel: "Preise ansehen",
    },
    crossLinks: {
      title: "Auch entdecken",
      items: [
        {
          href: "/services",
          title: "Leistungen",
          desc: "Websites, individuelle Software, SaaS, Community-Management, Kundengewinnung, Schulungen und Strategie: sieben sich ergänzende Bereiche.",
        },
        {
          href: "/realisations",
          title: "Referenzen",
          desc: "Gelieferte Projekte und begleitete Kunden, Partner, die uns seit sieben Jahren vertrauen.",
        },
        {
          href: "/tarifs",
          title: "Preise",
          desc: "Klare Preise, vorab angekündigt, in guineischen Francs.",
        },
      ],
    },
  },
};
