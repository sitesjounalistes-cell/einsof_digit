import type { Localized } from "@/lib/page-content";

/**
 * Contenu de la page /faq — au-dessus de l'accordéon des questions
 * courantes (FaqSection existante), cette page ajoute un bloc de
 * questions détaillées propres à la page.
 */

export interface FaqDetailedItem {
  q: string;
  a: string;
}

export interface FaqCrossLink {
  href: string;
  title: string;
  desc: string;
}

export interface FaqContent {
  hero: {
    label: string;
    title: string;
    gold: string;
    sub: string;
    chips: string[];
  };
  extra: {
    label: string;
    title: string;
    gold: string;
    sub: string;
    items: FaqDetailedItem[];
  };
  cta: {
    title: string;
    gold: string;
    primaryLabel: string;
    secondaryLabel: string;
  };
  crossLinks: {
    title: string;
    items: FaqCrossLink[];
  };
}

export const FAQ: Localized<FaqContent> = {
  fr: {
    hero: {
      label: "07 — FAQ",
      title: "Vos questions,",
      gold: "nos réponses.",
      sub: "Avant de démarrer avec nous, vous méritez des réponses claires et sans détour. Délais, tarifs, maintenance et support : tout est dit ici, simplement.",
      chips: ["Délais", "Tarifs", "Maintenance", "Support"],
    },
    extra: {
      label: "Questions détaillées",
      title: "Allons",
      gold: "plus loin.",
      sub: "Six questions qui reviennent dès que le projet devient concret — répondues en détail, sans langage commercial.",
      items: [
        {
          q: "Quels sont les délais de réalisation ?",
          a: "Un site vitrine se réalise en quelques semaines, une fois vos contenus rassemblés. Pour un site avec tableau de bord ou une boutique en ligne, le délai dépend du périmètre exact : le planning annoncé au devis est celui que nous tenons. Pour un logiciel sur mesure, nous avançons par jalons, avec des démonstrations régulières qui vous permettent de voir l'avancement à chaque étape. Aucune date n'est annoncée à la légère : elle est fixée avec vous, au moment du devis.",
        },
        {
          q: "Comment se passe la formation ?",
          a: "À la livraison, nous organisons une session de formation pratique avec vos équipes, sur vos vrais contenus et pas sur un exemple d'école. Les supports sont adaptés à votre activité et au niveau de chacun : prise en main guidée du tableau de bord, gestion des contenus, lecture des statistiques. Après la mise en ligne, nous restons disponibles pour répondre aux questions et compléter la formation si nécessaire.",
        },
        {
          q: "Que se passe-t-il après la mise en ligne ?",
          a: "Les bugs, failles et erreurs sont corrigés gratuitement pendant toute la collaboration — c'est écrit noir sur blanc dans nos conditions. Le nom de domaine et l'hébergement sont renouvelés chaque année pour 500 000 GNF, ce qui garantit la continuité de votre site. Les nouvelles fonctionnalités et les évolutions sont étudiées sur devis, pour que vous sachiez toujours ce qui est inclus et ce qui est facturé.",
        },
        {
          q: "Puis-je commencer par un site puis évoluer vers un logiciel ?",
          a: "Oui, et c'est même un parcours que nous recommandons souvent. L'architecture est pensée pour évoluer : vos contenus, vos données et vos comptes peuvent être repris lors du passage à un logiciel de gestion. Chaque évolution fait l'objet d'un devis transparent, avec un périmètre et un planning clairs avant de démarrer. Vous investissez par étapes, sans jamais rien jeter.",
        },
        {
          q: "Dans quelles langues mon site sera-t-il disponible ?",
          a: "Chaque site est livré en français par défaut. La traduction en plusieurs langues est incluse dans chaque site : l'anglais, l'espagnol, le chinois et l'allemand sont disponibles, comme sur le site que vous parcourez en ce moment. Vos visiteurs basculent d'une langue à l'autre en un clic, depuis n'importe quelle page, et les contenus traduits sont validés avec vous avant la mise en ligne.",
        },
        {
          q: "Comment obtenir un devis ?",
          a: "Décrivez votre besoin via la page contact ou directement auprès de l'assistant de ce site. Nous répondons sous 24 heures ouvrées, puis nous cadrons votre projet avec vous avant de chiffrer quoi que ce soit. Vous recevez ensuite un devis détaillé et figé : les montants annoncés sont ceux que vous payez, sans surprise en cours de route.",
        },
      ],
    },
    cta: {
      title: "Une question sans réponse ?",
      gold: "Écrivez-nous.",
      primaryLabel: "Poser ma question",
      secondaryLabel: "Voir les tarifs",
    },
    crossLinks: {
      title: "Explorer aussi",
      items: [
        {
          href: "/tarifs",
          title: "Tarifs",
          desc: "Des prix clairs, annoncés d'avance et en francs guinéens : sites web, logiciels sur mesure et abonnements SaaS.",
        },
        {
          href: "/logiciels",
          title: "Logiciels SaaS",
          desc: "Six outils de gestion prêts à l'emploi, avec essai gratuit de 7 jours : facturation, comptabilité, santé, école, immobilier, pharmacie.",
        },
        {
          href: "/methode",
          title: "Méthode",
          desc: "Cinq étapes, zéro surprise : de la première écoute au suivi quotidien, vous savez toujours où en est votre projet.",
        },
      ],
    },
  },
  en: {
    hero: {
      label: "07 — FAQ",
      title: "Your questions,",
      gold: "our answers.",
      sub: "Before starting with us, you deserve clear, straight answers. Timelines, pricing, maintenance and support: everything is said here, simply.",
      chips: ["Timelines", "Pricing", "Maintenance", "Support"],
    },
    extra: {
      label: "Detailed questions",
      title: "Let's go",
      gold: "further.",
      sub: "Six questions that come up as soon as the project becomes concrete — answered in detail, without sales talk.",
      items: [
        {
          q: "What are the delivery timelines?",
          a: "A showcase website takes a few weeks, once your content has been gathered. For a website with a dashboard or an online store, the timeline depends on the exact scope: the schedule announced in the quote is the one we keep. For custom software, we move forward in milestones, with regular demonstrations so you can see the progress at every stage. No date is ever announced lightly: it is set with you, at the time of the quote.",
        },
        {
          q: "How does the training work?",
          a: "At delivery, we organize a hands-on training session with your teams, on your real content and not on a textbook example. The materials are adapted to your activity and to everyone's level: guided handling of the dashboard, content management, reading the statistics. After going live, we remain available to answer questions and complete the training if needed.",
        },
        {
          q: "What happens after the launch?",
          a: "Bugs, vulnerabilities and errors are fixed free of charge throughout the collaboration — it is written in black and white in our terms. The domain name and hosting are renewed every year for 500,000 GNF, which guarantees the continuity of your website. New features and evolutions are studied on quote, so you always know what is included and what is billed.",
        },
        {
          q: "Can I start with a website then move to a software?",
          a: "Yes, and it is actually a path we often recommend. The architecture is designed to evolve: your content, your data and your accounts can be carried over when moving to a management software. Every evolution comes with a transparent quote, with a clear scope and schedule before starting. You invest step by step, without ever throwing anything away.",
        },
        {
          q: "In which languages will my website be available?",
          a: "Every website is delivered in French by default. Translation into several languages is included in every website: English, Spanish, Chinese and German are available, just like on the website you are browsing right now. Your visitors switch from one language to another in one click, from any page, and the translated content is validated with you before going live.",
        },
        {
          q: "How do I get a quote?",
          a: "Describe your need through the contact page or directly to the assistant of this website. We answer within 24 business hours, then we frame your project with you before pricing anything. You then receive a detailed and frozen quote: the announced amounts are the ones you pay, with no surprises along the way.",
        },
      ],
    },
    cta: {
      title: "A question without an answer?",
      gold: "Write to us.",
      primaryLabel: "Ask my question",
      secondaryLabel: "See the pricing",
    },
    crossLinks: {
      title: "Explore more",
      items: [
        {
          href: "/tarifs",
          title: "Pricing",
          desc: "Clear prices, announced upfront and in Guinean francs: websites, custom software and SaaS subscriptions.",
        },
        {
          href: "/logiciels",
          title: "SaaS software",
          desc: "Six ready-to-use management tools with a 7-day free trial: invoicing, accounting, health, schools, real estate, pharmacy.",
        },
        {
          href: "/methode",
          title: "Method",
          desc: "Five steps, zero surprises: from the first listening to daily follow-up, you always know where your project stands.",
        },
      ],
    },
  },
  es: {
    hero: {
      label: "07 — FAQ",
      title: "Sus preguntas,",
      gold: "nuestras respuestas.",
      sub: "Antes de empezar con nosotros, merece respuestas claras y directas. Plazos, tarifas, mantenimiento y soporte: todo está dicho aquí, de forma sencilla.",
      chips: ["Plazos", "Tarifas", "Mantenimiento", "Soporte"],
    },
    extra: {
      label: "Preguntas detalladas",
      title: "Vamos",
      gold: "más lejos.",
      sub: "Seis preguntas que aparecen en cuanto el proyecto se vuelve concreto — respondidas con detalle, sin discurso comercial.",
      items: [
        {
          q: "¿Cuáles son los plazos de realización?",
          a: "Un sitio vitrina se realiza en unas semanas, una vez reunidos sus contenidos. Para un sitio con panel de control o una tienda en línea, el plazo depende del alcance exacto: el calendario anunciado en el presupuesto es el que cumplimos. Para un software a medida, avanzamos por hitos, con demostraciones regulares que le permiten ver el avance en cada etapa. Ninguna fecha se anuncia a la ligera: se fija con usted, en el momento del presupuesto.",
        },
        {
          q: "¿Cómo se desarrolla la formación?",
          a: "En la entrega, organizamos una sesión de formación práctica con sus equipos, sobre sus contenidos reales y no sobre un ejemplo de manual. Los soportes se adaptan a su actividad y al nivel de cada uno: manejo guiado del panel de control, gestión de contenidos, lectura de las estadísticas. Tras la puesta en línea, seguimos disponibles para responder preguntas y completar la formación si es necesario.",
        },
        {
          q: "¿Qué ocurre después de la puesta en línea?",
          a: "Los bugs, fallos y errores se corrigen de forma gratuita durante toda la colaboración — está escrito en negro sobre blanco en nuestras condiciones. El nombre de dominio y el alojamiento se renuevan cada año por 500 000 GNF, lo que garantiza la continuidad de su sitio. Las nuevas funcionalidades y evoluciones se estudian mediante presupuesto, para que siempre sepa qué está incluido y qué se factura.",
        },
        {
          q: "¿Puedo empezar con un sitio y evolucionar hacia un software?",
          a: "Sí, y de hecho es un camino que recomendamos a menudo. La arquitectura está pensada para evolucionar: sus contenidos, datos y cuentas pueden retomarse al pasar a un software de gestión. Cada evolución cuenta con un presupuesto transparente, con un alcance y un calendario claros antes de empezar. Invierte por etapas, sin tirar nunca nada.",
        },
        {
          q: "¿En qué idiomas estará disponible mi sitio?",
          a: "Cada sitio se entrega en francés por defecto. La traducción a varios idiomas está incluida en cada sitio: inglés, español, chino y alemán están disponibles, como en el sitio que está navegando ahora mismo. Sus visitantes cambian de idioma con un clic, desde cualquier página, y los contenidos traducidos se validan con usted antes de la puesta en línea.",
        },
        {
          q: "¿Cómo obtener un presupuesto?",
          a: "Describa su necesidad a través de la página de contacto o directamente al asistente de este sitio. Respondemos en 24 horas laborables y, después, delimitamos su proyecto con usted antes de calcular cualquier importe. A continuación recibe un presupuesto detallado y cerrado: los importes anunciados son los que paga, sin sorpresas por el camino.",
        },
      ],
    },
    cta: {
      title: "¿Una pregunta sin respuesta?",
      gold: "Escríbanos.",
      primaryLabel: "Hacer mi pregunta",
      secondaryLabel: "Ver las tarifas",
    },
    crossLinks: {
      title: "Explorar también",
      items: [
        {
          href: "/tarifs",
          title: "Tarifas",
          desc: "Precios claros, anunciados de antemano y en francos guineanos: sitios web, software a medida y suscripciones SaaS.",
        },
        {
          href: "/logiciels",
          title: "Software SaaS",
          desc: "Seis herramientas de gestión listas para usar con prueba gratis de 7 días: facturación, contabilidad, salud, escuela, inmobiliaria, farmacia.",
        },
        {
          href: "/methode",
          title: "Método",
          desc: "Cinco pasos, cero sorpresas: desde la primera escucha hasta el seguimiento diario, siempre sabe en qué punto está su proyecto.",
        },
      ],
    },
  },
  zh: {
    hero: {
      label: "07 — 常见问题",
      title: "您的疑问，",
      gold: "我们的解答。",
      sub: "在与我们合作之前，您理应得到清晰、直接的答案。工期、价格、维护与支持：所有内容都在这里，用最简单的方式说明。",
      chips: ["工期", "价格", "维护", "支持"],
    },
    extra: {
      label: "深入解答",
      title: "我们再",
      gold: "进一步。",
      sub: "当项目变得具体时，这六个问题总会被问到——我们用细节作答，不谈销售话术。",
      items: [
        {
          q: "项目交付需要多长时间？",
          a: "展示型网站在内容齐备后几周内即可完成。对于带管理后台的网站或在线商城，工期取决于具体范围：报价单上公布的计划就是我们承诺遵守的计划。对于定制软件，我们按里程碑推进，并通过定期演示让您在每个阶段都能看到进展。任何日期都不是随口承诺：它是在报价时与您共同确定的。",
        },
        {
          q: "培训是如何进行的？",
          a: "交付时，我们会与您的团队进行一次实操培训，使用的是您的真实内容，而不是教科书式的示例。培训资料会根据您的业务和每个人的水平进行调整：后台管理的引导式上手、内容管理、数据统计的解读。上线之后，我们仍会随时解答问题，并在需要时补充培训。",
        },
        {
          q: "上线之后会发生什么？",
          a: "在合作期间，漏洞、缺陷和错误全部免费修复——这一点在我们的条款中白纸黑字写明。域名与托管每年续费 500 000 几内亚法郎，以保障您网站的连续性。新功能与升级按报价单处理，让您始终清楚哪些已包含、哪些另行计费。",
        },
        {
          q: "我可以先做网站，之后再升级为管理软件吗？",
          a: "可以，这也是我们经常推荐的路径。整体架构为演进而设计：您的数据与账户在过渡到管理软件时可以直接迁移。每次升级都会提供透明的报价，启动之前就有明确的范围与计划。您按阶段投入，不会浪费任何已有的成果。",
        },
        {
          q: "我的网站会支持哪些语言？",
          a: "每个网站默认以法语交付。多语言翻译包含在每个网站中：英语、西班牙语、中文和德语均可提供，正如您正在浏览的这个网站。访问者在任意页面都可一键切换语言，翻译内容会在上线前与您一起确认。",
        },
        {
          q: "如何获得报价？",
          a: "通过联系页面或本网站的助手描述您的需求。我们在 24 个工作小时内回复，然后在计算任何金额之前与您一起梳理项目范围。随后您会收到一份详细且锁定的报价：公布的金额就是您支付的金额，过程中没有任何意外。",
        },
      ],
    },
    cta: {
      title: "还有没被解答的问题？",
      gold: "给我们留言。",
      primaryLabel: "提出我的问题",
      secondaryLabel: "查看价格",
    },
    crossLinks: {
      title: "同时探索",
      items: [
        {
          href: "/tarifs",
          title: "价格",
          desc: "价格透明、提前公布、以几内亚法郎计：网站、定制软件与 SaaS 订阅。",
        },
        {
          href: "/logiciels",
          title: "SaaS 软件",
          desc: "六款即开即用的管理软件，附 7 天免费试用：开票、会计、医疗、学校、物业、药房。",
        },
        {
          href: "/methode",
          title: "方法论",
          desc: "五个步骤，零意外：从第一次倾听到日常跟进，您始终清楚项目进展。",
        },
      ],
    },
  },
  de: {
    hero: {
      label: "07 — FAQ",
      title: "Ihre Fragen,",
      gold: "unsere Antworten.",
      sub: "Bevor Sie mit uns starten, verdienen Sie klare, ungeschönte Antworten. Fristen, Preise, Wartung und Support: Alles steht hier, einfach gesagt.",
      chips: ["Fristen", "Preise", "Wartung", "Support"],
    },
    extra: {
      label: "Detaillierte Fragen",
      title: "Gehen wir",
      gold: "tiefer.",
      sub: "Sechs Fragen, die gestellt werden, sobald das Projekt konkret wird — ausführlich beantwortet, ohne Verkauftstalk.",
      items: [
        {
          q: "Wie lang sind die Umsetzungsfristen?",
          a: "Eine Showcase-Website entsteht in wenigen Wochen, sobald Ihre Inhalte zusammengetragen sind. Bei einer Website mit Dashboard oder einem Onlineshop hängt die Frist vom genauen Umfang ab: Der im Angebot angekündigte Zeitplan ist der, den wir einhalten. Bei Individualsoftware arbeiten wir in Meilensteinen, mit regelmäßigen Demonstrationen, damit Sie den Fortschritt in jeder Phase sehen. Kein Termin wird leichtfertig genannt: Er wird mit Ihnen im Moment des Angebots festgelegt.",
        },
        {
          q: "Wie läuft die Schulung ab?",
          a: "Bei der Auslieferung organisieren wir eine praktische Schulungssession mit Ihren Teams — an Ihren echten Inhalten, nicht an einem Schulbeispiel. Die Unterlagen passen sich Ihrer Tätigkeit und dem Niveau jedes Einzelnen an: geführte Einführung ins Dashboard, Inhaltsverwaltung, Lesen der Statistiken. Nach dem Go-live bleiben wir erreichbar, um Fragen zu beantworten und die Schulung bei Bedarf zu ergänzen.",
        },
        {
          q: "Was passiert nach dem Go-live?",
          a: "Bugs, Schwachstellen und Fehler werden während der gesamten Zusammenarbeit kostenlos behoben — das steht schwarz auf weiß in unseren Bedingungen. Domain und Hosting werden jährlich für 500 000 GNF erneuert, was die Kontinuität Ihrer Website garantiert. Neue Funktionen und Weiterentwicklungen werden auf Angebotsbasis geprüft, damit Sie immer wissen, was enthalten ist und was berechnet wird.",
        },
        {
          q: "Kann ich mit einer Website beginnen und später zu einer Software wechseln?",
          a: "Ja — das ist sogar ein Weg, den wir oft empfehlen. Die Architektur ist auf Weiterentwicklung ausgelegt: Ihre Inhalte, Daten und Konten können beim Übergang zu einer Verwaltungssoftware übernommen werden. Jede Erweiterung erhält ein transparentes Angebot mit klarem Umfang und Zeitplan vor dem Start. Sie investieren schrittweise und verwerfen nie etwas.",
        },
        {
          q: "In welchen Sprachen wird meine Website verfügbar sein?",
          a: "Jede Website wird standardmäßig auf Französisch ausgeliefert. Die Übersetzung in mehrere Sprachen ist in jeder Website enthalten: Englisch, Spanisch, Chinesisch und Deutsch stehen zur Verfügung — genau wie auf der Website, die Sie gerade lesen. Ihre Besucher wechseln mit einem Klick die Sprache, auf jeder Seite, und die übersetzten Inhalte werden vor dem Go-live mit Ihnen abgestimmt.",
        },
        {
          q: "Wie erhalte ich ein Angebot?",
          a: "Beschreiben Sie Ihr Anliegen über die Kontaktseite oder direkt dem Assistenten dieser Website. Wir antworten innerhalb von 24 Werktstunden und stecken Ihr Projekt mit Ihnen ab, bevor irgendwelche Beträge berechnet werden. Anschließend erhalten Sie ein detailliertes und festgeschriebenes Angebot: Die angekündigten Beträge sind die, die Sie zahlen — ohne Überraschungen.",
        },
      ],
    },
    cta: {
      title: "Eine Frage ohne Antwort?",
      gold: "Schreiben Sie uns.",
      primaryLabel: "Meine Frage stellen",
      secondaryLabel: "Preise ansehen",
    },
    crossLinks: {
      title: "Auch entdecken",
      items: [
        {
          href: "/tarifs",
          title: "Preise",
          desc: "Klare Preise, im Voraus angekündigt und in guineischen Francs: Websites, Individualsoftware und SaaS-Abos.",
        },
        {
          href: "/logiciels",
          title: "SaaS-Software",
          desc: "Sechs einsatzbereite Verwaltungstools mit 7 Tagen Gratisphase: Rechnungswesen, Buchhaltung, Gesundheit, Schule, Immobilien, Apotheke.",
        },
        {
          href: "/methode",
          title: "Methode",
          desc: "Fünf Schritte, null Überraschungen: vom ersten Zuhören bis zur täglichen Betreuung wissen Sie immer, wo Ihr Projekt steht.",
        },
      ],
    },
  },
};
