import type { Localized } from "@/lib/page-content";

/**
 * Contenu de la page /secteurs — le ruban des 14 secteurs est rendu par
 * la section existante (SectorsSection) ; ce module porte les six cartes
 * détaillées « solutions par secteur », la liste complète des 14 secteurs
 * et l'habillage de la page, en 5 langues.
 */

export type SectorIcon =
  | "health"
  | "education"
  | "realEstate"
  | "commerce"
  | "banking"
  | "mining";

export interface SectorCard {
  name: string;
  icon: SectorIcon;
  /** les défis du métier (1-2 phrases, réalité locale) */
  challenges: string;
  /** notre réponse (2-3 puces) */
  bullets: string[];
}

export interface SecteursCrossLink {
  href: string;
  title: string;
  desc: string;
}

export interface SecteursContent {
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
    challengesLabel: string;
    answerLabel: string;
    cards: SectorCard[];
  };
  all: {
    label: string;
    title: string;
    gold: string;
    sub: string;
    items: string[];
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
    items: SecteursCrossLink[];
  };
}

export const SECTEURS: Localized<SecteursContent> = {
  fr: {
    hero: {
      label: "04 — Secteurs",
      title: "Tous les secteurs,",
      gold: "sans exception.",
      sub: "Nous servons tous les domaines d'activité, avec une connaissance fine des réalités du terrain en Guinée.",
      chips: ["14 secteurs servis", "Connaissance du terrain", "Solutions par métier"],
    },
    detail: {
      label: "Solutions par secteur",
      title: "Six secteurs phares,",
      gold: "décryptés.",
      sub: "Pour les métiers les plus demandés, voici comment nous transformons les contraintes du terrain en outils qui travaillent vraiment.",
      challengesLabel: "Les défis",
      answerLabel: "Notre réponse",
      cards: [
        {
          name: "Santé & pharmacie",
          icon: "health",
          challenges:
            "Dossiers patients souvent papier, rappels de rendez-vous au téléphone et stocks de pharmacie suivis à la main : la moindre erreur coûte cher, en santé comme en trésorerie.",
          bullets: [
            "SaaS métier dédié : dossiers patients, rendez-vous et stocks de pharmacie",
            "Site vitrine pour présenter services, horaires et équipes",
            "Tableau de bord pour suivre l'activité en temps réel",
          ],
        },
        {
          name: "Éducation & formation",
          icon: "education",
          challenges:
            "Inscriptions gérées en paperasse, suivi des paiements de scolarité dispersé et communication avec les parents limitée à quelques appels.",
          bullets: [
            "Logiciel de gestion d'école : inscriptions, classes, paiements",
            "Site vitrine avec actualités et formulaires d'admission",
            "Formation des équipes administratives à la livraison",
          ],
        },
        {
          name: "Immobilier",
          icon: "realEstate",
          challenges:
            "Biens gérés sur plusieurs sites, dossiers locataires au format papier et suivi des loyers fait manuellement, souvent après coup.",
          bullets: [
            "Logiciel de gestion immobilière : biens, baux, loyers",
            "Site vitrine avec catalogue de biens et demandes de visite",
            "Tableau de bord des revenus, bien par bien",
          ],
        },
        {
          name: "Commerce & distribution",
          icon: "commerce",
          challenges:
            "Stock réparti entre dépôt et boutiques, ventes consignées sur cahier et marges réelles difficiles à connaître avant la fin du mois.",
          bullets: [
            "SaaS de caisse et de stock synchronisé multi-boutiques",
            "Boutique en ligne pour vendre au-delà du quartier et de la capitale",
            "Rapports de ventes et de marges en temps réel",
          ],
        },
        {
          name: "Banque & microfinance",
          icon: "banking",
          challenges:
            "Portefeuille clients étendu, échéances de remboursement suivies manuellement et exigence de reporting d'un niveau que le papier ne tient plus.",
          bullets: [
            "Logiciel de gestion des prêts et échéanciers",
            "Tableau de bord du portefeuille et des impayés",
            "Site institutionnel sécurisé, disponible en plusieurs langues",
          ],
        },
        {
          name: "Mines & énergie",
          icon: "mining",
          challenges:
            "Sites d'exploitation isolés, connectivité variable d'un jour à l'autre et données de production encore collectées à la main sur le terrain.",
          bullets: [
            "SaaS métier conçu pour rester utilisable en connexion instable",
            "Reporting consolidé multi-sites, sans ressaisie",
            "Site vitrine pour vos parties prenantes et vos partenaires",
          ],
        },
      ],
    },
    all: {
      label: "Tous les secteurs",
      title: "Les 14 domaines",
      gold: "que nous servons.",
      sub: "D'un secteur à l'autre, la méthode reste la même : écouter le métier, construire l'outil adapté, former les équipes.",
      items: [
        "BTP & construction",
        "Recrutement",
        "Médias",
        "Mines & énergie",
        "Santé & pharmacie",
        "Éducation & formation",
        "Immobilier",
        "Banque & microfinance",
        "Commerce & distribution",
        "Hôtellerie & tourisme",
        "Transport & logistique",
        "Agriculture & agro-industrie",
        "ONG & institutions",
        "Télécoms & événementiel",
      ],
    },
    cta: {
      title: "Votre secteur n'est pas listé ?",
      gold: "Parlez-nous de votre métier.",
      sub: "Nous construisons pour tous les domaines d'activité : décrivez le vôtre, nous vous dirons précisément comment nous pouvons l'équiper.",
      primaryLabel: "Décrire mon besoin",
      secondaryLabel: "Voir les logiciels",
    },
    crossLinks: {
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
          desc: "Sites web, logiciels sur mesure, SaaS, community management, acquisition et formations : sept pôles complémentaires.",
        },
        {
          href: "/realisations",
          title: "Réalisations",
          desc: "Des projets livrés qui travaillent pour nos clients : sites, logiciels et plateformes en production au quotidien.",
        },
      ],
    },
  },
  en: {
    hero: {
      label: "04 — Sectors",
      title: "Every sector,",
      gold: "no exceptions.",
      sub: "We serve all industries, with deep knowledge of the realities on the ground in Guinea.",
      chips: ["14 sectors served", "Field knowledge", "Solutions by trade"],
    },
    detail: {
      label: "Solutions by sector",
      title: "Six flagship sectors,",
      gold: "decoded.",
      sub: "For the most requested trades, here is how we turn field constraints into tools that truly work.",
      challengesLabel: "The challenges",
      answerLabel: "Our answer",
      cards: [
        {
          name: "Health & pharmacy",
          icon: "health",
          challenges:
            "Patient files often on paper, appointment reminders by phone and pharmacy stocks tracked by hand: the slightest error is costly, both in health and in cash flow.",
          bullets: [
            "Dedicated business SaaS: patient files, appointments and pharmacy stocks",
            "Showcase website to present services, hours and teams",
            "Dashboard to follow the activity in real time",
          ],
        },
        {
          name: "Education & training",
          icon: "education",
          challenges:
            "Enrolments managed on paper, tuition payment tracking scattered across notebooks and parent communication limited to a few calls.",
          bullets: [
            "School management software: enrolments, classes, payments",
            "Showcase website with news and admission forms",
            "Training of the administrative teams at delivery",
          ],
        },
        {
          name: "Real estate",
          icon: "realEstate",
          challenges:
            "Properties managed across several sites, tenant files on paper and rent tracking done manually, often after the fact.",
          bullets: [
            "Real estate management software: properties, leases, rents",
            "Showcase website with property catalogue and visit requests",
            "Revenue dashboard, property by property",
          ],
        },
        {
          name: "Retail & distribution",
          icon: "commerce",
          challenges:
            "Stock split between warehouse and shops, sales recorded in notebooks and actual margins hard to know before the end of the month.",
          bullets: [
            "Point-of-sale and stock SaaS synchronised across shops",
            "Online store to sell beyond the neighbourhood and the capital",
            "Real-time sales and margin reports",
          ],
        },
        {
          name: "Banking & microfinance",
          icon: "banking",
          challenges:
            "A wide client portfolio, repayment schedules tracked manually and a reporting requirement that paper can no longer sustain.",
          bullets: [
            "Loan and schedule management software",
            "Portfolio and arrears dashboard",
            "Secure institutional website, available in several languages",
          ],
        },
        {
          name: "Mining & energy",
          icon: "mining",
          challenges:
            "Isolated operation sites, connectivity that varies from one day to the next and production data still collected by hand in the field.",
          bullets: [
            "Business SaaS designed to stay usable on unstable connections",
            "Consolidated multi-site reporting, with no double entry",
            "Showcase website for your stakeholders and partners",
          ],
        },
      ],
    },
    all: {
      label: "All sectors",
      title: "The 14 fields",
      gold: "we serve.",
      sub: "From one sector to another, the method stays the same: listen to the trade, build the right tool, train the teams.",
      items: [
        "Construction & civil engineering",
        "Recruitment",
        "Media",
        "Mining & energy",
        "Health & pharmacy",
        "Education & training",
        "Real estate",
        "Banking & microfinance",
        "Retail & distribution",
        "Hospitality & tourism",
        "Transport & logistics",
        "Agriculture & agribusiness",
        "NGOs & institutions",
        "Telecoms & events",
      ],
    },
    cta: {
      title: "Your sector is not listed?",
      gold: "Tell us about your trade.",
      sub: "We build for every line of business: describe yours and we will tell you precisely how we can equip it.",
      primaryLabel: "Describe my need",
      secondaryLabel: "See the software",
    },
    crossLinks: {
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
          desc: "Websites, custom software, SaaS, social media management, client acquisition and training: seven complementary areas.",
        },
        {
          href: "/realisations",
          title: "Our work",
          desc: "Delivered projects that work for our clients: websites, software and platforms in daily production.",
        },
      ],
    },
  },
  es: {
    hero: {
      label: "04 — Sectores",
      title: "Todos los sectores,",
      gold: "sin excepción.",
      sub: "Atendemos todos los sectores de actividad, con un conocimiento profundo de las realidades del terreno en Guinea.",
      chips: ["14 sectores atendidos", "Conocimiento del terreno", "Soluciones por oficio"],
    },
    detail: {
      label: "Soluciones por sector",
      title: "Seis sectores clave,",
      gold: "al descubierto.",
      sub: "Para los oficios más solicitados, así convertimos las restricciones del terreno en herramientas que realmente funcionan.",
      challengesLabel: "Los desafíos",
      answerLabel: "Nuestra respuesta",
      cards: [
        {
          name: "Salud y farmacia",
          icon: "health",
          challenges:
            "Historiales de pacientes a menudo en papel, recordatorios de citas por teléfono y stocks de farmacia controlados a mano: el más mínimo error cuesta caro, en salud y en tesorería.",
          bullets: [
            "SaaS de oficio dedicado: historiales, citas y stocks de farmacia",
            "Sitio vitrina para presentar servicios, horarios y equipos",
            "Panel de control para seguir la actividad en tiempo real",
          ],
        },
        {
          name: "Educación y formación",
          icon: "education",
          challenges:
            "Inscripciones gestionadas en papel, seguimiento de las matrículas disperso y comunicación con los padres limitada a unas llamadas.",
          bullets: [
            "Software de gestión escolar: inscripciones, clases, pagos",
            "Sitio vitrina con noticias y formularios de admisión",
            "Formación de los equipos administrativos en la entrega",
          ],
        },
        {
          name: "Inmobiliaria",
          icon: "realEstate",
          challenges:
            "Propiedades gestionadas en varios sitios, expedientes de inquilinos en papel y seguimiento de alquileres manual, a menudo a posteriori.",
          bullets: [
            "Software de gestión inmobiliaria: propiedades, contratos, alquileres",
            "Sitio vitrina con catálogo de propiedades y solicitudes de visita",
            "Panel de ingresos, propiedad por propiedad",
          ],
        },
        {
          name: "Comercio y distribución",
          icon: "commerce",
          challenges:
            "Stock repartido entre depósito y tiendas, ventas anotadas en cuadernos y márgenes reales difíciles de conocer antes de fin de mes.",
          bullets: [
            "SaaS de caja y stock sincronizado entre tiendas",
            "Tienda en línea para vender más allá del barrio y de la capital",
            "Informes de ventas y márgenes en tiempo real",
          ],
        },
        {
          name: "Banca y microfinanzas",
          icon: "banking",
          challenges:
            "Cartera de clientes amplia, vencimientos de reembolso seguidos a mano y una exigencia de reporting que el papel ya no sostiene.",
          bullets: [
            "Software de gestión de préstamos y calendarios",
            "Panel de cartera y de impagos",
            "Sitio institucional seguro, disponible en varios idiomas",
          ],
        },
        {
          name: "Minas y energía",
          icon: "mining",
          challenges:
            "Sitios de explotación aislados, conectividad variable de un día a otro y datos de producción aún recogidos a mano en el terreno.",
          bullets: [
            "SaaS de oficio diseñado para seguir siendo usable con conexión inestable",
            "Reporting consolidado multi-sitio, sin doble registro",
            "Sitio vitrina para sus grupos de interés y socios",
          ],
        },
      ],
    },
    all: {
      label: "Todos los sectores",
      title: "Los 14 sectores",
      gold: "que atendemos.",
      sub: "De un sector a otro, el método sigue siendo el mismo: escuchar el oficio, construir la herramienta adecuada, formar a los equipos.",
      items: [
        "Construcción e ingeniería civil",
        "Reclutamiento",
        "Medios",
        "Minas y energía",
        "Salud y farmacia",
        "Educación y formación",
        "Inmobiliaria",
        "Banca y microfinanzas",
        "Comercio y distribución",
        "Hostelería y turismo",
        "Transporte y logística",
        "Agricultura y agroindustria",
        "ONG e instituciones",
        "Telecomunicaciones y eventos",
      ],
    },
    cta: {
      title: "¿Su sector no está en la lista?",
      gold: "Háblenos de su oficio.",
      sub: "Construimos para todos los sectores de actividad: describa el suyo y le diremos con precisión cómo podemos equiparlo.",
      primaryLabel: "Describir mi necesidad",
      secondaryLabel: "Ver el software",
    },
    crossLinks: {
      title: "Explorar también",
      items: [
        {
          href: "/logiciels",
          title: "Software SaaS",
          desc: "Seis herramientas de gestión listas para usar con prueba gratis de 7 días: facturación, contabilidad, salud, escuela, inmobiliaria, farmacia.",
        },
        {
          href: "/services",
          title: "Servicios",
          desc: "Sitios web, software a medida, SaaS, community management, adquisición y formación: siete polos complementarios.",
        },
        {
          href: "/realisations",
          title: "Realizaciones",
          desc: "Proyectos entregados que trabajan para nuestros clientes: sitios, software y plataformas en producción diaria.",
        },
      ],
    },
  },
  zh: {
    hero: {
      label: "04 — 行业",
      title: "覆盖所有行业，",
      gold: "无一例外。",
      sub: "我们服务所有行业领域，深谙几内亚当地的市场实情。",
      chips: ["服务 14 个行业", "本地经验", "按行业定制方案"],
    },
    detail: {
      label: "分行业解决方案",
      title: "六大重点行业，",
      gold: "逐一拆解。",
      sub: "针对需求最多的行业，我们是这样把现场的实际约束转化为真正好用的工具的。",
      challengesLabel: "行业难题",
      answerLabel: "我们的方案",
      cards: [
        {
          name: "医疗与药房",
          icon: "health",
          challenges:
            "病历常常停留在纸上，预约提醒靠电话，药房库存靠手工记录：任何一点差错，无论对健康还是对现金流，代价都很高。",
          bullets: [
            "专属行业 SaaS：病历、预约与药房库存",
            "展示网站：服务、营业时间与团队介绍",
            "管理后台，实时掌握经营状况",
          ],
        },
        {
          name: "教育与培训",
          icon: "education",
          challenges:
            "报名靠纸质材料，学费缴付记录散落各处，与家长的沟通仅限于零星几次电话。",
          bullets: [
            "学校管理软件：报名、班级、缴费",
            "展示网站：新闻动态与入学申请表",
            "交付时为行政团队提供培训",
          ],
        },
        {
          name: "不动产",
          icon: "realEstate",
          challenges:
            "物业分散在多处管理，租户档案停留在纸上，租金收缴全靠手工，往往事后才补记。",
          bullets: [
            "物业管理软件：房源、租约、租金",
            "展示网站：房源目录与看房申请",
            "收入后台，逐个房源跟踪收益",
          ],
        },
        {
          name: "商贸与分销",
          icon: "commerce",
          challenges:
            "库存分散在仓库与各门店，销售记录在本子上，月底之前很难知道真实毛利。",
          bullets: [
            "多门店同步的收银与库存 SaaS",
            "在线商城，把生意做到街区和首都之外",
            "实时销售与毛利报表",
          ],
        },
        {
          name: "银行与小额信贷",
          icon: "banking",
          challenges:
            "客户群体庞大，还款日程靠手工跟踪，报表要求之高已经超出纸面能力。",
          bullets: [
            "贷款与还款计划管理软件",
            "信贷组合与逾期后台",
            "安全的多语言机构官网",
          ],
        },
        {
          name: "矿业与能源",
          icon: "mining",
          challenges:
            "作业地点偏远，网络连接时好时坏，生产数据仍在现场手工收集。",
          bullets: [
            "为不稳定网络环境设计的行业 SaaS",
            "多站点汇总报表，无需重复录入",
            "面向利益相关方与合作伙伴的展示网站",
          ],
        },
      ],
    },
    all: {
      label: "所有行业",
      title: "我们服务的",
      gold: "14 个领域。",
      sub: "行业不同，方法不变：倾听业务、打造合适的工具、培训团队。",
      items: [
        "建筑与工程",
        "招聘",
        "媒体",
        "矿业与能源",
        "医疗与药房",
        "教育与培训",
        "不动产",
        "银行与小额信贷",
        "商贸与分销",
        "酒店与旅游",
        "运输与物流",
        "农业与农业综合企业",
        "非政府组织与机构",
        "电信与会展",
      ],
    },
    cta: {
      title: "没有找到您的行业？",
      gold: "讲讲您的业务。",
      sub: "我们为所有行业构建工具：描述您的业务，我们会准确告诉您如何为它配备系统。",
      primaryLabel: "描述我的需求",
      secondaryLabel: "查看软件",
    },
    crossLinks: {
      title: "同时探索",
      items: [
        {
          href: "/logiciels",
          title: "SaaS 软件",
          desc: "六款即开即用的管理软件，附 7 天免费试用：开票、会计、医疗、学校、物业、药房。",
        },
        {
          href: "/services",
          title: "服务",
          desc: "网站、定制软件、SaaS、社交媒体运营、获客与培训：七大互补业务板块。",
        },
        {
          href: "/realisations",
          title: "案例",
          desc: "为客户持续创造价值的已交付项目：网站、软件与日常生产中的平台。",
        },
      ],
    },
  },
  de: {
    hero: {
      label: "04 — Branchen",
      title: "Alle Branchen,",
      gold: "ohne Ausnahme.",
      sub: "Wir bedienen alle Wirtschaftsbereiche — mit feinem Gespür für die Gegebenheiten vor Ort in Guinea.",
      chips: ["14 Branchen betreut", "Praxiswissen", "Lösungen pro Gewerbe"],
    },
    detail: {
      label: "Lösungen pro Branche",
      title: "Sechs Leitbranchen,",
      gold: "entschlüsselt.",
      sub: "Für die meistgefragten Gewerbe zeigen wir, wie wir die Zwänge vor Ort in Werkzeuge übersetzen, die wirklich funktionieren.",
      challengesLabel: "Die Herausforderungen",
      answerLabel: "Unsere Antwort",
      cards: [
        {
          name: "Gesundheit & Pharmazie",
          icon: "health",
          challenges:
            "Patientenakten oft auf Papier, Terminerinnerungen am Telefon und Apothekenbestände in Handarbeit: Jeder kleine Fehler kostet teuer — gesundheitlich wie finanziell.",
          bullets: [
            "Dediziertes Fach-SaaS: Patientenakten, Termine und Apothekenbestände",
            "Showcase-Website für Leistungen, Öffnungszeiten und Team",
            "Dashboard, um die Aktivität in Echtzeit zu verfolgen",
          ],
        },
        {
          name: "Bildung & Schulung",
          icon: "education",
          challenges:
            "Anmeldungen in Papierform, verstreute Nachweise über Schulgeldzahlungen und Elternkommunikation, die auf wenige Anrufe beschränkt bleibt.",
          bullets: [
            "Schulverwaltungssoftware: Anmeldungen, Klassen, Zahlungen",
            "Showcase-Website mit Neuigkeiten und Aufnahmeformularen",
            "Schulung der Verwaltungsteams bei der Auslieferung",
          ],
        },
        {
          name: "Immobilien",
          icon: "realEstate",
          challenges:
            "Objekte verwaltet über mehrere Standorte, Mieterakten auf Papier und Mieterverfolgung manuell — oft erst im Nachhinein.",
          bullets: [
            "Immobilienverwaltungssoftware: Objekte, Verträge, Mieten",
            "Showcase-Website mit Objektkatalog und Besichtigungsanfragen",
            "Erlös-Dashboard, Objekt für Objekt",
          ],
        },
        {
          name: "Handel & Vertrieb",
          icon: "commerce",
          challenges:
            "Lagerbestand verteilt auf Depot und Läden, Verkäufe in Heftchen notiert und echte Margen kaum vor Monatsende bekannt.",
          bullets: [
            "Kassen- und Lager-SaaS, abgeglichen über alle Läden",
            "Onlineshop, um über das Viertel und die Hauptstadt hinaus zu verkaufen",
            "Umsatz- und Margenberichte in Echtzeit",
          ],
        },
        {
          name: "Banken & Mikrofinanz",
          icon: "banking",
          challenges:
            "Breites Kundenportfolio, manuell verfolgte Rückzahlungspläne und Reporting-Anforderungen, die das Papier nicht mehr trägt.",
          bullets: [
            "Software für Kreditverwaltung und Tilgungspläne",
            "Dashboard für Portfolio und Zahlungsrückstände",
            "Sichere institutionelle Website, in mehreren Sprachen verfügbar",
          ],
        },
        {
          name: "Bergbau & Energie",
          icon: "mining",
          challenges:
            "Abgelegene Standorte, Connectivity, die von einem Tag zum anderen schwankt, und Produktionsdaten, die weiterhin von Hand erfasst werden.",
          bullets: [
            "Fach-SaaS, das auch bei instabiler Verbindung nutzbar bleibt",
            "Konsolidierte Multi-Standort-Berichte ohne Doppelerfassung",
            "Showcase-Website für Ihre Anspruchsgruppen und Partner",
          ],
        },
      ],
    },
    all: {
      label: "Alle Branchen",
      title: "Die 14 Bereiche,",
      gold: "die wir bedienen.",
      sub: "Von Branche zu Branche bleibt die Methode dieselbe: dem Gewerbe zuhören, das passende Werkzeug bauen, die Teams schulen.",
      items: [
        "Hoch- & Tiefbau",
        "Recruiting",
        "Medien",
        "Bergbau & Energie",
        "Gesundheit & Pharmazie",
        "Bildung & Schulung",
        "Immobilien",
        "Banken & Mikrofinanz",
        "Handel & Vertrieb",
        "Hotellerie & Tourismus",
        "Transport & Logistik",
        "Landwirtschaft & Agroindustrie",
        "NGOs & Institutionen",
        "Telekommunikation & Veranstaltungen",
      ],
    },
    cta: {
      title: "Ihre Branche ist nicht dabei?",
      gold: "Erzählen Sie uns von Ihrem Gewerbe.",
      sub: "Wir bauen für jeden Wirtschaftsbereich: Beschreiben Sie Ihren, und wir sagen Ihnen genau, wie wir ihn ausstatten können.",
      primaryLabel: "Bedarf beschreiben",
      secondaryLabel: "Software ansehen",
    },
    crossLinks: {
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
          desc: "Websites, Individualsoftware, SaaS, Social-Media-Management, Kundengewinnung und Schulungen: sieben komplementäre Bereiche.",
        },
        {
          href: "/realisations",
          title: "Referenzen",
          desc: "Abgeschlossene Projekte, die für unsere Kunden arbeiten: Websites, Software und Plattformen im täglichen Einsatz.",
        },
      ],
    },
  },
};
