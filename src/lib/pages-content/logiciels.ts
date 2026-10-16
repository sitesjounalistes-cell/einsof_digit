import type { Localized } from "@/lib/page-content";

/**
 * Contenu de la page /logiciels (hub « SaaS de gestion »).
 * Le détail produit est joint aux données officielles de src/lib/catalog.ts
 * via le slug (findSaas) — aucun montant n'est déclaré ici : les prix sont
 * TOUJOURS rendus par PriceTag à partir des PriceOffer du catalogue.
 */

export interface SaasDetailProduct {
  /** slug de src/lib/catalog.ts → SAAS_PRODUCTS */
  slug: string;
  /** public visé (badge de la carte) */
  audience: string;
  /** modules clés (4 à 6 puces) */
  modules: string[];
  /** profil « pour qui » */
  forWhom: string;
}

export interface LogicielsContent {
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
    audienceLabel: string;
    modulesLabel: string;
    forWhomLabel: string;
    /** hôpital : libellé du bloc « trois forfaits » */
    plansLabel: string;
    /** hôpital : nom des trois forfaits (ordre = SAAS_PRODUCTS hospital offers) */
    hospitalTiers: string[];
    /** école : note de facturation affichée sous le prix */
    schoolNote: string;
    products: SaasDetailProduct[];
  };
  /** conception de workflows sur mesure (au-delà des SaaS prêts à l'emploi) */
  workflows: {
    title: string;
    gold: string;
    desc: string;
    ctaLabel: string;
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

export const LOGICIELS: Localized<LogicielsContent> = {
  fr: {
    hero: {
      label: "03 — SaaS & workflows",
      title: "Sept logiciels prêts pour",
      gold: "votre métier.",
      sub: "Des outils de gestion éprouvés, disponibles immédiatement, paramétrés pour votre activité et soutenus par notre équipe — et la conception de workflows sur mesure quand vos processus débordent le cadre.",
      chips: ["Essai gratuit 7 jours", "Démo guidée", "Workflows sur mesure"],
    },
    detail: {
      label: "03.1 — Détail des produits",
      title: "Chaque logiciel,",
      gold: "en détail.",
      sub: "Modules clés, public visé et prix affiché : tout ce qu'il faut savoir avant de demander votre essai gratuit de 7 jours. Les montants sont ceux du catalogue officiel de l'agence.",
      audienceLabel: "Public",
      modulesLabel: "Modules clés",
      forWhomLabel: "Pour qui ?",
      plansLabel: "Trois forfaits selon la taille de votre établissement",
      hospitalTiers: ["Essentiel", "Avancé", "Complet"],
      schoolNote: "9 mois payés par an — les 3 mois de vacances sont offerts",
      products: [
        {
          slug: "factura-pro",
          audience: "Entreprises & commerces",
          modules: [
            "Factures et reçus professionnels",
            "Bons de commande et de livraison",
            "Gestion des stocks",
            "Trésorerie",
            "Exports comptables",
          ],
          forWhom:
            "Commerces de détail, grossistes, distributeurs et PME qui veulent quitter les cahiers et les tableurs : Factura Pro couvre la journée type, de la vente au comptoir jusqu'à la clôture du mois.",
        },
        {
          slug: "gestion-comptable",
          audience: "Cabinets comptables",
          modules: [
            "Suivi des dossiers clients",
            "Saisie et lettrage des écritures",
            "Rapprochements",
            "États financiers normalisés",
            "Archivage",
          ],
          forWhom:
            "Cabinets d'expertise comptable et fiduciaires qui portent plusieurs dossiers en parallèle et ont besoin d'un suivi rigoureux, dossier par dossier, de la saisie jusqu'aux états financiers.",
        },
        {
          slug: "gestion-hospitaliere",
          audience: "Hôpitaux & cliniques",
          modules: [
            "Dossier patient",
            "Consultations et hospitalisations",
            "Pharmacie interne",
            "Facturation et caisse",
            "Statistiques de service",
          ],
          forWhom:
            "Hôpitaux, cliniques et centres de santé qui veulent un dossier patient fiable, une pharmacie interne maîtrisée et une caisse claire — du petit établissement au centre hospitalier complet.",
        },
        {
          slug: "gestion-ecole",
          audience: "Écoles & instituts",
          modules: [
            "Inscriptions et réinscriptions",
            "Classes et emplois du temps",
            "Notes et bulletins",
            "Suivi de la scolarité",
            "Communication avec les parents",
          ],
          forWhom:
            "Écoles primaires, collèges, lycées et instituts de formation qui veulent digitaliser toute la scolarité : du recrutement des élèves à l'impression des bulletins, en passant par la communication avec les familles.",
        },
        {
          slug: "gestion-immobiliere",
          audience: "Agences & gestionnaires",
          modules: [
            "Portefeuille de biens",
            "Bailleurs et locataires",
            "Baux et échéances",
            "Appels de loyers",
            "Suivi des paiements et relances",
          ],
          forWhom:
            "Agences immobilières et gestionnaires de patrimoine qui encaissent des dizaines de loyers chaque mois et veulent savoir, en un coup d'œil, qui a payé, qui est en retard et qui doit être relancé.",
        },
        {
          slug: "gestion-pharmacie",
          audience: "Pharmacies",
          modules: [
            "Stocks de médicaments",
            "Alertes de péremption",
            "Ventes au comptoir",
            "Facturation",
            "Historique d'approvisionnement",
          ],
          forWhom:
            "Pharmacies d'officine qui veulent un stock toujours juste : les alertes de péremption évitent les pertes, l'historique d'approvisionnement documente chaque entrée, et le comptoir encaisse sans attente.",
        },
        {
          slug: "gestion-formation",
          audience: "Centres de formation",
          modules: [
            "Inscriptions et dossiers apprenants",
            "Programmes et sessions",
            "Présences et évaluations",
            "Certificats et attestations",
            "Suivi budgétaire",
          ],
          forWhom:
            "Centres de formation professionnelle, instituts et organismes de cours qui veulent digitaliser toute la vie de leur établissement : des inscriptions aux certificats, en passant par les présences et le budget.",
        },
      ],
    },
    workflows: {
      title: "Besoin d'aller plus loin ?",
      gold: "Conception de workflows sur mesure.",
      desc: "Au-delà des SaaS prêts à l'emploi, nous concevons des systèmes de workflows sur mesure : vos processus métier automatisés de bout en bout — validations, notifications, documents — chiffrés après étude de votre besoin.",
      ctaLabel: "Étudier mon workflow",
    },
    cta: {
      title: "Pas encore sûr ?",
      gold: "Réservez une démo guidée.",
      sub: "Un conseiller vous montre le logiciel en situation réelle, sur vos propres cas, et répond à toutes vos questions — sans engagement.",
      primaryLabel: "Réserver une démo",
      secondaryLabel: "Voir les tarifs",
    },
    cross: {
      title: "Explorer aussi",
      items: [
        {
          href: "/tarifs",
          title: "Tarifs",
          desc: "Tous les montants en francs guinéens, abonnements SaaS inclus : mensuels, annuels et mentions « à partir de » explicites.",
        },
        {
          href: "/secteurs",
          title: "Secteurs",
          desc: "BTP, santé, éducation, mines, immobilier : notre connaissance fine du terrain guinéen au service de votre métier.",
        },
        {
          href: "/contact",
          title: "Contact",
          desc: "Devis sous 48 heures, démo guidée et essai gratuit : écrivez-nous, nous répondons vite et clairement.",
        },
      ],
    },
  },
  en: {
    hero: {
      label: "03 — SaaS & workflows",
      title: "Seven software tools ready for",
      gold: "your business.",
      sub: "Proven management tools, available immediately, configured for your activity and backed by our team — and bespoke workflow design when your processes outgrow the off-the-shelf.",
      chips: ["7-day free trial", "Guided demo", "Bespoke workflows"],
    },
    detail: {
      label: "03.1 — Product details",
      title: "Every tool,",
      gold: "in detail.",
      sub: "Key modules, target audience and displayed price: everything you need to know before requesting your 7-day free trial. Amounts are those of the agency's official catalogue.",
      audienceLabel: "Audience",
      modulesLabel: "Key modules",
      forWhomLabel: "Who is it for?",
      plansLabel: "Three plans depending on the size of your facility",
      hospitalTiers: ["Essential", "Advanced", "Complete"],
      schoolNote: "9 months paid per year — the 3 months of holidays are free",
      products: [
        {
          slug: "factura-pro",
          audience: "Businesses & retailers",
          modules: [
            "Professional invoices and receipts",
            "Purchase and delivery orders",
            "Inventory management",
            "Cash flow",
            "Accounting exports",
          ],
          forWhom:
            "Retail shops, wholesalers, distributors and SMEs ready to drop paper notebooks and spreadsheets: Factura Pro covers the typical day, from the counter sale to the month-end close.",
        },
        {
          slug: "gestion-comptable",
          audience: "Accounting firms",
          modules: [
            "Client file tracking",
            "Entry recording and lettering",
            "Reconciliations",
            "Standardised financial statements",
            "Archiving",
          ],
          forWhom:
            "Accounting firms and fiduciaries handling several client files in parallel who need rigorous tracking, file by file, from data entry to the financial statements.",
        },
        {
          slug: "gestion-hospitaliere",
          audience: "Hospitals & clinics",
          modules: [
            "Patient records",
            "Consultations and hospitalisations",
            "In-house pharmacy",
            "Billing and cash desk",
            "Department statistics",
          ],
          forWhom:
            "Hospitals, clinics and health centres that want reliable patient records, a controlled in-house pharmacy and a clean cash desk — from the small facility to the full hospital.",
        },
        {
          slug: "gestion-ecole",
          audience: "Schools & institutes",
          modules: [
            "Enrolment and re-enrolment",
            "Classes and timetables",
            "Grades and report cards",
            "Schooling follow-up",
            "Parent communication",
          ],
          forWhom:
            "Primary schools, middle and high schools and training institutes that want to digitalise the whole school year: from student enrolment to report-card printing, including family communication.",
        },
        {
          slug: "gestion-immobiliere",
          audience: "Agencies & property managers",
          modules: [
            "Property portfolio",
            "Landlords and tenants",
            "Leases and due dates",
            "Rent calls",
            "Payment tracking and reminders",
          ],
          forWhom:
            "Real-estate agencies and property managers collecting dozens of rents every month who want to see at a glance who has paid, who is late and who needs a reminder.",
        },
        {
          slug: "gestion-pharmacie",
          audience: "Pharmacies",
          modules: [
            "Medicine stock",
            "Expiry alerts",
            "Counter sales",
            "Billing",
            "Supply history",
          ],
          forWhom:
            "Community pharmacies that want their stock always right: expiry alerts prevent losses, the supply history documents every inbound order, and the counter sells without waiting.",
        },
        {
          slug: "gestion-formation",
          audience: "Training centres",
          modules: [
            "Enrolment and learner records",
            "Programmes and sessions",
            "Attendance and assessments",
            "Certificates and attestations",
            "Budget tracking",
          ],
          forWhom:
            "Vocational training centres, institutes and course providers that want to digitalise the whole life of their facility: from enrolment to certificates, including attendance and budget.",
        },
      ],
    },
    workflows: {
      title: "Need to go further?",
      gold: "Bespoke workflow design.",
      desc: "Beyond the ready-to-use SaaS, we design bespoke workflow systems: your business processes automated end to end — approvals, notifications, documents — priced after studying your need.",
      ctaLabel: "Study my workflow",
    },
    cta: {
      title: "Still not sure?",
      gold: "Book a guided demo.",
      sub: "An advisor shows you the software in real conditions, on your own cases, and answers all your questions — no commitment.",
      primaryLabel: "Book a demo",
      secondaryLabel: "See pricing",
    },
    cross: {
      title: "Explore more",
      items: [
        {
          href: "/tarifs",
          title: "Pricing",
          desc: "All amounts in Guinean francs, SaaS subscriptions included: monthly, yearly and explicit “from” mentions.",
        },
        {
          href: "/secteurs",
          title: "Sectors",
          desc: "Construction, health, education, mining, real estate: our deep knowledge of the Guinean market serving your business.",
        },
        {
          href: "/contact",
          title: "Contact",
          desc: "Quotes within 48 hours, guided demo and free trial: write to us, we answer quickly and clearly.",
        },
      ],
    },
  },
  es: {
    hero: {
      label: "03 — SaaS y flujos de trabajo",
      title: "Siete softwares listos para",
      gold: "su actividad.",
      sub: "Herramientas de gestión probadas, disponibles de inmediato, configuradas para tu actividad y respaldadas por nuestro equipo — y el diseño de flujos de trabajo a medida cuando tus procesos desbordan lo estándar.",
      chips: ["Prueba gratis 7 días", "Demo guiada", "Flujos de trabajo a medida"],
    },
    detail: {
      label: "03.1 — Detalle de los productos",
      title: "Cada software,",
      gold: "en detalle.",
      sub: "Módulos clave, público objetivo y precio mostrado: todo lo que hay que saber antes de pedir la prueba gratuita de 7 días. Los importes son los del catálogo oficial de la agencia.",
      audienceLabel: "Público",
      modulesLabel: "Módulos clave",
      forWhomLabel: "¿Para quién?",
      plansLabel: "Tres planes según el tamaño de su establecimiento",
      hospitalTiers: ["Esencial", "Avanzado", "Completo"],
      schoolNote: "9 meses pagados al año — los 3 meses de vacaciones son gratis",
      products: [
        {
          slug: "factura-pro",
          audience: "Empresas y comercios",
          modules: [
            "Facturas y recibos profesionales",
            "Pedidos y albaranes de entrega",
            "Gestión de inventario",
            "Tesorería",
            "Exportaciones contables",
          ],
          forWhom:
            "Comercios minoristas, mayoristas, distribuidores y pymes que quieren dejar los cuadernos y las hojas de cálculo: Factura Pro cubre el día típico, desde la venta en mostrador hasta el cierre de mes.",
        },
        {
          slug: "gestion-comptable",
          audience: "Despachos contables",
          modules: [
            "Seguimiento de expedientes de clientes",
            "Asiento y lettering de apuntes",
            "Conciliaciones",
            "Estados financieros normalizados",
            "Archivo",
          ],
          forWhom:
            "Despachos de auditoría y fiduciarias que llevan varios expedientes en paralelo y necesitan un seguimiento riguroso, expediente por expediente, desde el asiento hasta los estados financieros.",
        },
        {
          slug: "gestion-hospitaliere",
          audience: "Hospitales y clínicas",
          modules: [
            "Historia clínica",
            "Consultas y hospitalizaciones",
            "Farmacia interna",
            "Facturación y caja",
            "Estadísticas de servicio",
          ],
          forWhom:
            "Hospitales, clínicas y centros de salud que quieren historias clínicas fiables, una farmacia interna controlada y una caja clara — del pequeño centro al hospital completo.",
        },
        {
          slug: "gestion-ecole",
          audience: "Escuelas e institutos",
          modules: [
            "Inscripciones y reinscripciones",
            "Clases y horarios",
            "Notas y boletines",
            "Seguimiento de la escolaridad",
            "Comunicación con los padres",
          ],
          forWhom:
            "Escuelas primarias, colegios, institutos y centros de formación que quieren digitalizar toda la escolaridad: desde la inscripción de alumnos hasta la impresión de boletines, sin olvidar la comunicación con las familias.",
        },
        {
          slug: "gestion-immobiliere",
          audience: "Agencias y gestores",
          modules: [
            "Cartera de inmuebles",
            "Propietarios e inquilinos",
            "Contratos y vencimientos",
            "Reclamaciones de alquiler",
            "Seguimiento de pagos y recordatorios",
          ],
          forWhom:
            "Agencias inmobiliarias y gestores de patrimonio que cobran decenas de alquileres cada mes y quieren saber de un vistazo quién ha pagado, quién está en retraso y a quién hay que reclamar.",
        },
        {
          slug: "gestion-pharmacie",
          audience: "Farmacias",
          modules: [
            "Stock de medicamentos",
            "Alertas de caducidad",
            "Ventas en mostrador",
            "Facturación",
            "Historial de aprovisionamiento",
          ],
          forWhom:
            "Farmacias de oficina que quieren un stock siempre ajustado: las alertas de caducidad evitan pérdidas, el historial de aprovisionamiento documenta cada entrada y el mostrador cobra sin espera.",
        },
        {
          slug: "gestion-formation",
          audience: "Centros de formación",
          modules: [
            "Inscripciones y expedientes de alumnos",
            "Programas y sesiones",
            "Asistencia y evaluaciones",
            "Certificados y constancias",
            "Seguimiento presupuestario",
          ],
          forWhom:
            "Centros de formación profesional, institutos y organismos de cursos que quieren digitalizar toda la vida de su establecimiento: de las inscripciones a los certificados, pasando por la asistencia y el presupuesto.",
        },
      ],
    },
    workflows: {
      title: "¿Necesita ir más lejos?",
      gold: "Diseño de flujos de trabajo a medida.",
      desc: "Más allá de los SaaS listos para usar, diseñamos sistemas de flujos de trabajo a medida: sus procesos de negocio automatizados de principio a fin — validaciones, notificaciones, documentos — presupuestados tras estudiar su necesidad.",
      ctaLabel: "Estudiar mi flujo de trabajo",
    },
    cta: {
      title: "¿Aún con dudas?",
      gold: "Reserve una demo guiada.",
      sub: "Un asesor le muestra el software en situación real, con sus propios casos, y responde a todas sus preguntas — sin compromiso.",
      primaryLabel: "Reservar una demo",
      secondaryLabel: "Ver tarifas",
    },
    cross: {
      title: "Explorar también",
      items: [
        {
          href: "/tarifs",
          title: "Tarifas",
          desc: "Todos los importes en francos guineanos, suscripciones SaaS incluidas: mensuales, anuales y menciones « desde » explícitas.",
        },
        {
          href: "/secteurs",
          title: "Sectores",
          desc: "Construcción, salud, educación, minería, inmobiliaria: nuestro conocimiento profundo del terreno guineano al servicio de su actividad.",
        },
        {
          href: "/contact",
          title: "Contacto",
          desc: "Presupuesto en 48 horas, demo guiada y prueba gratuita: escríbanos, respondemos rápido y con claridad.",
        },
      ],
    },
  },
  zh: {
    hero: {
      label: "03 — SaaS与工作流",
      title: "七款软件，为",
      gold: "您的行业而生。",
      sub: "经过验证的管理工具，即开即用，为您的业务完成配置，并由我们的团队提供支持——当标准软件无法覆盖您的流程时，我们还提供定制工作流设计。",
      chips: ["7 天免费试用", "引导式演示", "定制工作流"],
    },
    detail: {
      label: "03.1 — 产品详情",
      title: "每款软件，",
      gold: "细细道来。",
      sub: "核心模块、目标客户与明示价格：在申请 7 天免费试用之前，这里提供您需要的全部信息。所有金额均与公司官方目录一致。",
      audienceLabel: "适用对象",
      modulesLabel: "核心模块",
      forWhomLabel: "适合谁？",
      plansLabel: "三个套餐，按机构规模选择",
      hospitalTiers: ["基础版", "进阶版", "完整版"],
      schoolNote: "每年支付 9 个月 — 3 个月假期免费",
      products: [
        {
          slug: "factura-pro",
          audience: "企业与商户",
          modules: [
            "专业发票与收据",
            "采购单与送货单",
            "库存管理",
            "资金流水",
            "会计导出",
          ],
          forWhom:
            "零售店、批发商、经销商和中小企业，告别纸质账本与电子表格：Factura Pro 覆盖典型的一天，从柜台销售到月末结账。",
        },
        {
          slug: "gestion-comptable",
          audience: "会计事务所",
          modules: [
            "客户档案跟进",
            "凭证录入与核销",
            "对账",
            "标准化财务报表",
            "归档",
          ],
          forWhom:
            "同时管理多个客户档案的会计师事务所与财务代理公司，需要逐档、从严录入到报表的严密跟进。",
        },
        {
          slug: "gestion-hospitaliere",
          audience: "医院与诊所",
          modules: [
            "患者档案",
            "门诊与住院",
            "院内药房",
            "收费与出纳",
            "科室统计",
          ],
          forWhom:
            "希望患者档案可靠、院内药房受控、账目清晰的医院、诊所和卫生中心——从小型医疗机构到完整的大型医院。",
        },
        {
          slug: "gestion-ecole",
          audience: "学校与培训机构",
          modules: [
            "报名与重新注册",
            "班级与课表",
            "成绩与成绩单",
            "学籍跟进",
            "家长沟通",
          ],
          forWhom:
            "小学、初中、高中和培训机构，想把整个学年数字化：从学生报名到成绩单打印，包括与家长的沟通。",
        },
        {
          slug: "gestion-immobiliere",
          audience: "中介与物业管理",
          modules: [
            "房源组合",
            "房东与租客",
            "租约与到期日",
            "租金催缴单",
            "付款跟进与催收",
          ],
          forWhom:
            "每月收取几十笔租金的房产中介与物业管理公司，一眼看清谁已付、谁拖欠、谁需要催收。",
        },
        {
          slug: "gestion-pharmacie",
          audience: "药房",
          modules: [
            "药品库存",
            "效期预警",
            "柜台销售",
            "开票",
            "采购历史",
          ],
          forWhom:
            "希望库存永远精准的零售药房：效期预警减少损耗，采购历史记录每一批进货，柜台收款不用等。",
        },
        {
          slug: "gestion-formation",
          audience: "培训机构",
          modules: [
            "报名与学员档案",
            "课程与班次",
            "考勤与考核",
            "证书与结业证明",
            "预算跟进",
          ],
          forWhom:
            "希望把机构整个运转数字化的职业培训中心、学院与课程机构：从报名到证书，涵盖考勤与预算。",
        },
      ],
    },
    workflows: {
      title: "需要更进一步？",
      gold: "定制工作流设计。",
      desc: "在开箱即用的 SaaS 之外，我们设计定制工作流系统：您的业务流程端到端自动化——审批、通知、单据——经需求评估后报价。",
      ctaLabel: "评估我的工作流",
    },
    cta: {
      title: "还在犹豫？",
      gold: "预约一场引导式演示。",
      sub: "顾问用您自己的业务场景，在真实环境中为您演示软件，并解答所有问题——不设任何约束。",
      primaryLabel: "预约演示",
      secondaryLabel: "查看价格",
    },
    cross: {
      title: "继续探索",
      items: [
        {
          href: "/tarifs",
          title: "价格",
          desc: "所有金额以几内亚法郎计，含 SaaS 订阅：按月、按年，“起价”标注明确。",
        },
        {
          href: "/secteurs",
          title: "行业",
          desc: "建筑、医疗、教育、矿业、房地产：深谙几内亚本地市场，服务您的行业。",
        },
        {
          href: "/contact",
          title: "联系我们",
          desc: "48 小时内报价、引导式演示与免费试用：给我们留言，回复迅速而清晰。",
        },
      ],
    },
  },
  de: {
    hero: {
      label: "03 — SaaS & Workflows",
      title: "Sieben Softwarelösungen bereit für",
      gold: "Ihr Metier.",
      sub: "Bewährte Management-Tools, sofort verfügbar, für Ihre Tätigkeit konfiguriert und von unserem Team unterstützt — plus maßgeschneidertem Workflow-Design, wenn Ihre Prozesse den Standard übersteigen.",
      chips: ["7 Tage gratis testen", "Geführte Demo", "Maßgeschneiderte Workflows"],
    },
    detail: {
      label: "03.1 — Produktdetails",
      title: "Jede Software,",
      gold: "im Detail.",
      sub: "Kernmodule, Zielgruppe und ausgewiesener Preis: alles, was Sie wissen müssen, bevor Sie Ihre 7-tägige Gratisphase anfordern. Die Beträge entsprechen dem offiziellen Katalog der Agentur.",
      audienceLabel: "Zielgruppe",
      modulesLabel: "Kernmodule",
      forWhomLabel: "Für wen?",
      plansLabel: "Drei Pakete je nach Größe Ihrer Einrichtung",
      hospitalTiers: ["Essentiell", "Erweitert", "Komplett"],
      schoolNote: "9 Monate pro Jahr bezahlt — die 3 Ferienmonate sind gratis",
      products: [
        {
          slug: "factura-pro",
          audience: "Unternehmen & Handel",
          modules: [
            "Professionelle Rechnungen und Belege",
            "Bestell- und Lieferscheine",
            "Lagerverwaltung",
            "Liquidität",
            "Buchhaltungsexporte",
          ],
          forWhom:
            "Einzelhändler, Großhändler, Distributoren und KMU, die Notebooks und Tabellen ablegen wollen: Factura Pro deckt den typischen Tag ab, vom Ladenverkauf bis zum Monatsabschluss.",
        },
        {
          slug: "gestion-comptable",
          audience: "Buchhaltungskanzleien",
          modules: [
            "Nachverfolgung der Mandanten",
            "Erfassung und Opferkonto der Buchungen",
            "Kontenabstimmungen",
            "Normalisierte Abschlüsse",
            "Archivierung",
          ],
          forWhom:
            "Steuerberatungs- und Treuhandkanzleien, die mehrere Mandate parallel betreuen und eine strenge Nachverfolgung brauchen — Mandat für Mandat, von der Erfassung bis zum Abschluss.",
        },
        {
          slug: "gestion-hospitaliere",
          audience: "Krankenhäuser & Kliniken",
          modules: [
            "Patientenakte",
            "Konsultationen und Hospitalisierungen",
            "Interne Apotheke",
            "Fakturierung und Kasse",
            "Servicestatistiken",
          ],
          forWhom:
            "Krankenhäuser, Kliniken und Gesundheitszentren, die eine verlässliche Patientenakte, eine kontrollierte interne Apotheke und eine saubere Kasse wollen — von der kleinen Einrichtung bis zum Vollkrankenhaus.",
        },
        {
          slug: "gestion-ecole",
          audience: "Schulen & Institute",
          modules: [
            "Anmeldungen und Wiederanmeldungen",
            "Klassen und Stundenpläne",
            "Noten und Zeugnisse",
            "Schulverlauf-Nachverfolgung",
            "Elternkommunikation",
          ],
          forWhom:
            "Grundschulen, Gymnasien und Ausbildungsinstitute, die das ganze Schuljahr digitalisieren wollen: von der Schüleranmeldung bis zum Zeugnisdruck, einschließlich der Kommunikation mit den Familien.",
        },
        {
          slug: "gestion-immobiliere",
          audience: "Agenturen & Verwalter",
          modules: [
            "Objektportfolio",
            "Vermieter und Mieter",
            "Mietverträge und Fälligkeiten",
            "Mietzahlungsaufrufe",
            "Zahlungsverfolgung und Mahnungen",
          ],
          forWhom:
            "Immobilienagenturen und Verwalter, die jeden Monat Dutzende Mieten einziehen und auf einen Blick sehen wollen, wer gezahlt hat, wer in Verzug ist und wer gemahnt werden muss.",
        },
        {
          slug: "gestion-pharmacie",
          audience: "Apotheken",
          modules: [
            "Medikamentenbestand",
            "Ablaufwarnungen",
            "Thekenverkäufe",
            "Fakturierung",
            "Einkaufshistorie",
          ],
          forWhom:
            "Öffentliche Apotheken, deren Bestand immer stimmen soll: Ablaufwarnungen verhindern Verluste, die Einkaufshistorie dokumentiert jede Lieferung, und an der Theke wird ohne Wartezeit kassiert.",
        },
        {
          slug: "gestion-formation",
          audience: "Bildungszentren",
          modules: [
            "Einschreibungen und Teilnehmerakten",
            "Programme und Kurse",
            "Anwesenheit und Bewertungen",
            "Zertifikate und Nachweise",
            "Budgetverfolgung",
          ],
          forWhom:
            "Berufliche Bildungszentren, Institute und Kursanbieter, die das gesamte Leben ihrer Einrichtung digitalisieren wollen: von der Einschreibung bis zum Zertifikat — Anwesenheit und Budget inklusive.",
        },
      ],
    },
    workflows: {
      title: "Sie wollen weitergehen?",
      gold: "Maßgeschneidertes Workflow-Design.",
      desc: "Über die fertigen SaaS hinaus entwerfen wir individuelle Workflow-Systeme: Ihre Geschäftsprozesse von Ende zu Ende automatisiert — Freigaben, Benachrichtigungen, Dokumente — kalkuliert nach Analyse Ihres Bedarfs.",
      ctaLabel: "Meinen Workflow analysieren",
    },
    cta: {
      title: "Noch unsicher?",
      gold: "Buchen Sie eine geführte Demo.",
      sub: "Ein Berater zeigt Ihnen die Software in der Praxis, an Ihren eigenen Fällen, und beantwortet alle Fragen — unverbindlich.",
      primaryLabel: "Demo buchen",
      secondaryLabel: "Preise ansehen",
    },
    cross: {
      title: "Auch entdecken",
      items: [
        {
          href: "/tarifs",
          title: "Preise",
          desc: "Alle Beträge in guineischen Francs, SaaS-Abos inklusive: monatlich, jährlich und mit ausdrücklichen „ab“-Hinweisen.",
        },
        {
          href: "/secteurs",
          title: "Branchen",
          desc: "Bau, Gesundheit, Bildung, Bergbau, Immobilien: unser feines Gespür für den guineischen Markt — im Dienst Ihres Metiers.",
        },
        {
          href: "/contact",
          title: "Kontakt",
          desc: "Angebot in 48 Stunden, geführte Demo und gratis Testphase: schreiben Sie uns — wir antworten schnell und klar.",
        },
      ],
    },
  },
};
