/**
 * Journal — 6 articles SEO longue traîne (Task 3-c).
 * Faits exclusivement issus du catalogue officiel (src/lib/catalog.ts, itération 20).
 * Aucun prix ni engagement inventé — montants cités :
 *  - Application mobile dès 20 000 000 GNF (étude personnalisée puis chiffrage sur devis)
 *  - Logiciel interne sur mesure dès 20 000 000 GNF · SaaS à commercialiser dès 50 000 000 GNF
 *  - Factura Pro 100 000 GNF/mois · Comptable dès 1 M/mois · Hospitalière 1/3/5 M/mois
 *  - École 500 000/mois (9 mois facturés) · Immobilière 500 000/mois · Pharmacie 7 M/an · Formation (SaaS) sur devis
 *  - Essai gratuit 7 jours (une fois par personne et par logiciel)
 *  - Community management : Essentiel 1,5 M · Professionnel 3 M · Premium 5 M GNF/mois
 *    (publicité incluse 10 $ / 50 $ / 100 $ ; Premium : équipe terrain 2 interventions/semaine + 5 montages vidéo)
 *  - Génération de leads B2B dès 2 M GNF/mois · Prospection téléphonique déléguée dès 4,5 M GNF/mois
 *  - Landing page de conversion dès 1 M GNF · Campagne publicitaire dès 1 M GNF/mois (budget média client)
 *  - Formation d'équipe en entreprise dès 20 M GNF, sur devis après analyse des besoins
 *  - Vitrine 1 500 000 GNF (renouv. 500 000/an) · Tableau de bord 3 500 000 GNF (renouv. 700 000/an)
 *  - Site customisé sur devis · Paiement intégré +1 000 000 GNF quel que soit le site
 *
 * Idempotent : upsert par slug (créer OU mettre à jour, sans doublon).
 * Usage : bun scripts/seed-blog-seo.ts
 */
import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

/** Paragraphes → corps continu séparé par \n\n (format attendu par ArticlePage). */
const P = (...paras: string[]): string => paras.join("\n\n");

/** Objet multilingue → chaîne JSON stockée en base (repli fr). */
const J = (o: Record<string, string>): string => JSON.stringify(o);

interface SeedPost {
  slug: string;
  title: Record<string, string>;
  excerpt: Record<string, string>;
  body: Record<string, string>;
  category: string;
  readingMin: number;
  publishedAt: Date;
}

const POSTS: SeedPost[] = [
  /* ── 1. Créer une application mobile en Guinée ─────────────────── */
  {
    slug: "creer-application-mobile-guinee",
    category: "logiciels",
    readingMin: 6,
    publishedAt: new Date("2025-11-05T09:00:00.000Z"),
    title: {
      fr: "Créer une application mobile en Guinée : guide complet et tarifs",
      en: "Creating a mobile app in Guinea: complete guide and pricing",
      es: "Crear una aplicación móvil en Guinea: guía completa y tarifas",
      zh: "在几内亚开发移动应用：完整指南与价格",
      de: "Eine mobile App in Guinea entwickeln: vollständiger Leitfaden und Preise",
    },
    excerpt: {
      fr: "Prix de départ, étapes, Android et iOS : tout ce qu'il faut savoir pour créer une application mobile en Guinée, avec des chiffres exacts.",
      en: "Starting price, steps, Android and iOS: everything you need to know to build a mobile app in Guinea, with exact figures.",
      es: "Precio de partida, etapas, Android e iOS: todo lo que hay que saber para crear una aplicación móvil en Guinea, con cifras exactas.",
      zh: "起步价格、步骤、Android 与 iOS：在几内亚开发一款移动应用所需了解的一切，数字精确。",
      de: "Einstiegspreis, Schritte, Android und iOS: alles, was Sie für die Entwicklung einer mobilen App in Guinea wissen müssen — mit exakten Zahlen.",
    },
    body: {
      fr: P(
        "Créer une application mobile en Guinée est devenu un projet accessible aux entreprises qui veulent se rapprocher de leurs clients. La question qui revient toujours : combien ça coûte, et par où commencer ? Chez nous, la création d'une application mobile démarre à partir de 20 000 000 GNF, avec une étude personnalisée d'abord et un chiffrage précis sur devis ensuite.",
        "Une application mobile, ce n'est pas un site web adapté au téléphone. C'est une icône sur l'écran d'accueil de vos clients, des notifications qui les ramènent, et des usages directs : commander, réserver, suivre une commande, contacter votre équipe. Pour un commerce, une école, une clinique ou un service de livraison en Guinée, c'est le canal le plus fidèle.",
        "Première étape : l'étude personnalisée. Nous analysons votre activité, vos utilisateurs et les fonctionnalités réellement nécessaires. Aucun chiffrage sérieux n'est possible sans cette étude : c'est elle qui transforme une idée floue en cahier des charges précis.",
        "Deuxième étape : la conception. Nous dessinons les écrans, les parcours et les contenus. Votre application peut être traduite en plusieurs langues — français, anglais et d'autres — pour parler à toute votre clientèle, y compris la diaspora.",
        "Troisième étape : le développement pour Android et iOS. Nous construisons l'application pour les deux plateformes, puis nous la testons avec vous, sur des usages réels, jusqu'à ce qu'elle soit prête pour la publication.",
        "Après la livraison, nous restons là : les bugs, les failles et les erreurs sont corrigés sans frais supplémentaires pendant toute la durée de notre collaboration. Les nouvelles fonctionnalités que vous demandez ensuite sont chiffrées à part, en toute transparence.",
        "Le prix. Une application mobile démarre à partir de 20 000 000 GNF, selon le type de projet : nombre d'écrans, connexions à vos outils, niveaux d'utilisateurs. Pour situer notre gamme : un logiciel interne sur mesure démarre également à 20 000 000 GNF, et un logiciel SaaS destiné à être commercialisé à partir de 50 000 000 GNF. L'étude personnalisée détermine le montant final, précis, sur devis.",
        "Deux conseils avant de lancer votre projet : ne confondez pas site web et application mobile — ce sont deux investissements différents, souvent complémentaires ; et ne cherchez pas à tout mettre dans la première version. Une application simple, livrée et utilisée, vaut mieux qu'une application complexe sans cesse repoussée.",
        "Vous avez un projet d'application mobile en Guinée ? Décrivez-nous votre besoin via notre page Contact (/contact) : l'étude personnalisée précède tout chiffrage. Vous pouvez aussi parcourir l'ensemble de nos solutions sur la page Logiciels (/logiciels)."
      ),
      en: P(
        "Creating a mobile app in Guinea has become an accessible project for businesses that want to get closer to their clients. The question that always comes up: how much does it cost, and where to start? With us, building a mobile app starts from 20,000,000 GNF, with a personalized study first and a precise quote to follow.",
        "A mobile app is not a website adapted to the phone. It is an icon on your clients' home screen, notifications that bring them back, and direct uses: ordering, booking, tracking an order, contacting your team. For a shop, a school, a clinic or a delivery service in Guinea, it is the most loyal channel.",
        "First step: the personalized study. We analyze your business, your users and the features that are actually needed. No serious quote is possible without this study: it is what turns a vague idea into a precise specification.",
        "Second step: the design. We draw the screens, the user journeys and the content. Your app can be translated into several languages — French, English and more — to speak to your entire clientele, including the diaspora.",
        "Third step: development for Android and iOS. We build the app for both platforms, then we test it with you, on real use cases, until it is ready for release.",
        "After delivery, we stay involved: bugs, vulnerabilities and errors are fixed at no extra cost for the entire duration of our collaboration. New features you request afterwards are quoted separately, in full transparency.",
        "The price. A mobile app starts from 20,000,000 GNF, depending on the type of project: number of screens, connections to your tools, user levels. To situate our range: a custom internal software also starts at 20,000,000 GNF, and a SaaS software meant to be sold starts from 50,000,000 GNF. The personalized study determines the final amount, precisely, on quote.",
        "Two pieces of advice before starting: do not confuse a website and a mobile app — they are two different, often complementary investments; and do not try to put everything in the first version. A simple app that ships and gets used is worth more than a complex app that keeps being postponed.",
        "You have a mobile app project in Guinea? Tell us about your needs through our Contact page (/contact): the personalized study comes before any quote. You can also browse all our solutions on the Software page (/logiciels)."
      ),
      es: P(
        "Crear una aplicación móvil en Guinea se ha convertido en un proyecto accesible para las empresas que quieren acercarse a sus clientes. La pregunta que siempre surge: ¿cuánto cuesta y por dónde empezar? Con nosotros, la creación de una aplicación móvil arranca desde 20 000 000 GNF, con un estudio personalizado primero y un presupuesto preciso después.",
        "Una aplicación móvil no es un sitio web adaptado al teléfono. Es un icono en la pantalla de inicio de sus clientes, notificaciones que los hacen volver y usos directos: pedir, reservar, seguir un pedido, contactar a su equipo. Para un comercio, una escuela, una clínica o un servicio de reparto en Guinea, es el canal más fiel.",
        "Primera etapa: el estudio personalizado. Analizamos su actividad, sus usuarios y las funcionalidades realmente necesarias. Ningún presupuesto serio es posible sin ese estudio: es lo que convierte una idea vaga en unas especificaciones precisas.",
        "Segunda etapa: el diseño. Dibujamos las pantallas, los recorridos y los contenidos. Su aplicación puede traducirse a varios idiomas — francés, inglés y otros — para hablar a toda su clientela, incluida la diáspora.",
        "Tercera etapa: el desarrollo para Android e iOS. Construimos la aplicación para ambas plataformas y la probamos con usted, con usos reales, hasta que esté lista para su publicación.",
        "Tras la entrega, seguimos ahí: los errores, las fallas y los fallos se corrigen sin coste adicional durante toda la colaboración. Las nuevas funcionalidades que solicite después se presupuestan aparte, con total transparencia.",
        "El precio. Una aplicación móvil arranca desde 20 000 000 GNF, según el tipo de proyecto: número de pantallas, conexiones con sus herramientas, niveles de usuarios. Para situar nuestra gama: un software interno a medida arranca igualmente en 20 000 000 GNF, y un software SaaS destinado a comercializarse desde 50 000 000 GNF. El estudio personalizado determina el importe final, con precisión, sobre presupuesto.",
        "Dos consejos antes de lanzarse: no confunda sitio web y aplicación móvil — son dos inversiones distintas, a menudo complementarias; y no intente meterlo todo en la primera versión. Una aplicación simple, entregada y utilizada, vale más que una aplicación compleja sin cesar aplazada.",
        "¿Tiene un proyecto de aplicación móvil en Guinea? Cuéntenos su necesidad desde nuestra página de Contacto (/contact): el estudio personalizado precede a todo presupuesto. También puede ver todas nuestras soluciones en la página de Software (/logiciels)."
      ),
      zh: P(
        "在几内亚，为企业开发一款移动应用已经成为触达客户的可行项目。客户最常问的问题是：多少钱？从哪里开始？在我们这里，移动应用开发 20 000 000 GNF 起，先进行个性化研究，再给出精确报价。",
        "移动应用不是“适配手机的网站”。它是出现在客户手机主屏幕上的图标，是能把他们唤回的通知，也是直接的使用场景：下单、预约、跟踪订单、联系您的团队。对于几内亚的商店、学校、诊所或配送服务来说，这是最忠诚的渠道。",
        "第一步：个性化研究。我们分析您的业务、您的用户以及真正需要的功能。没有研究就无法给出严肃的报价：正是这一步把模糊的想法变成精确的需求说明。",
        "第二步：设计。我们绘制界面、使用路径与内容。您的应用可以翻译成多种语言——法语、英语等——与您的全部客户沟通，包括海外侨胞。",
        "第三步：Android 与 iOS 开发。我们为两个平台构建应用，并与您一起在真实使用场景中反复测试，直到可以发布。",
        "交付之后我们依然在：在整个合作期内，缺陷、漏洞与错误免费修复。您此后提出的新功能单独计价，完全透明。",
        "价格。移动应用 20 000 000 GNF 起，取决于项目类型：界面数量、与您工具的对接、用户层级。作为参照：定制内部软件同样 20 000 000 GNF 起，面向市场销售的 SaaS 软件 50 000 000 GNF 起。最终金额由个性化研究精确确定，按报价评估。",
        "启动项目前的两个建议：不要混淆网站与移动应用——这是两项不同、却常常互补的投资；也不要想把所有功能塞进第一版。一款简单、按时交付并被真正使用的应用，胜过一款一再延期的复杂应用。",
        "您在几内亚有移动应用项目？请通过我们的联系页面（/contact）告诉我们您的需求：个性化研究先于一切报价。您也可以在软件页面（/logiciels）浏览我们的全部解决方案。"
      ),
      de: P(
        "Eine mobile App in Guinea zu entwickeln ist für Unternehmen, die näher an ihren Kunden sein wollen, zu einem zugänglichen Projekt geworden. Die Frage, die immer kommt: Was kostet es, und wo beginnt man? Bei uns startet die Entwicklung einer mobilen App ab 20 000 000 GNF — mit einer persönlichen Analyse zuerst und einem präzisen Angebot danach.",
        "Eine mobile App ist keine für das Telefon angepasste Website. Sie ist ein Symbol auf dem Startbildschirm Ihrer Kunden, eine Benachrichtigung, die sie zurückholt, und direkte Nutzung: bestellen, reservieren, eine Bestellung verfolgen, Ihr Team kontaktieren. Für ein Geschäft, eine Schule, eine Klinik oder einen Lieferservice in Guinea ist sie der treueste Kanal.",
        "Erster Schritt: die persönliche Analyse. Wir untersuchen Ihr Geschäft, Ihre Nutzer und die wirklich benötigten Funktionen. Ohne diese Analyse ist kein seriöses Angebot möglich: Sie verwandelt eine vage Idee in ein präzises Lastenheft.",
        "Zweiter Schritt: das Design. Wir entwerfen Bildschirme, Bedienwege und Inhalte. Ihre App kann in mehrere Sprachen übersetzt werden — Französisch, Englisch und weitere — um Ihre gesamte Kundschaft anzusprechen, einschließlich der Diaspora.",
        "Dritter Schritt: die Entwicklung für Android und iOS. Wir bauen die App für beide Plattformen und testen sie gemeinsam mit Ihnen an realen Anwendungsfällen, bis sie veröffentlichungsbereit ist.",
        "Nach der Lieferung bleiben wir dran: Bugs, Schwachstellen und Fehler werden während der gesamten Zusammenarbeit ohne Aufpreis behoben. Neue Funktionen, die Sie danach wünschen, werden separat und transparent angeboten.",
        "Der Preis. Eine mobile App beginnt ab 20 000 000 GNF, je nach Projekttyp: Anzahl der Bildschirme, Anbindung an Ihre Tools, Nutzerebenen. Zur Einordnung: Eine individuelle interne Software startet ebenfalls ab 20 000 000 GNF, eine SaaS-Software für den Verkauf ab 50 000 000 GNF. Die persönliche Analyse bestimmt den Endbetrag — präzise, auf Angebot.",
        "Zwei Ratschläge vor dem Start: Verwechseln Sie Website und mobile App nicht — das sind zwei verschiedene, oft ergänzende Investitionen; und versuchen Sie nicht, alles in die erste Version zu packen. Eine einfache App, die geliefert und genutzt wird, ist mehr wert als eine komplexe App, die immer wieder verschoben wird.",
        "Sie haben ein Projekt für eine mobile App in Guinea? Beschreiben Sie uns Ihr Vorhaben über unsere Kontaktseite (/contact): Die persönliche Analyse geht jedem Angebot voraus. Alle unsere Lösungen finden Sie auf der Software-Seite (/logiciels)."
      ),
    },
  },

  /* ── 2. Pourquoi un logiciel de gestion ────────────────────────── */
  {
    slug: "pourquoi-logiciel-gestion-guinee",
    category: "logiciels",
    readingMin: 5,
    publishedAt: new Date("2025-11-12T09:00:00.000Z"),
    title: {
      fr: "Pourquoi votre entreprise en Guinée a besoin d'un logiciel de gestion",
      en: "Why your business in Guinea needs management software",
      es: "Por qué su empresa en Guinea necesita un software de gestión",
      zh: "为什么您在几内亚的企业需要管理软件",
      de: "Warum Ihr Unternehmen in Guinea eine Verwaltungssoftware braucht",
    },
    excerpt: {
      fr: "Facturation, comptabilité, clients : ce qu'un logiciel de gestion change pour une entreprise en Guinée — et un essai gratuit de 7 jours pour le vérifier.",
      en: "Invoicing, accounting, clients: what management software changes for a business in Guinea — and a free 7-day trial to check it.",
      es: "Facturación, contabilidad, clientes: lo que un software de gestión cambia para una empresa en Guinea — y una prueba gratuita de 7 días para comprobarlo.",
      zh: "开票、会计、客户：管理软件能为几内亚的企业带来什么改变——并用 7 天免费试用亲自验证。",
      de: "Fakturierung, Buchhaltung, Kunden: was Verwaltungssoftware für ein Unternehmen in Guinea verändert — und eine kostenlose 7-Tage-Testphase, um es zu prüfen.",
    },
    body: {
      fr: P(
        "Cahiers, classeurs Excel, factures papier : beaucoup d'entreprises en Guinée gèrent encore leur activité à la main. Tant que l'entreprise est petite, ça passe. Dès qu'elle grandit, la gestion ralentit tout : factures perdues, comptes à refaire, clients oubliés. Un logiciel de gestion est la réponse — et la digitalisation commence là.",
        "Un logiciel de gestion centralise ce qui compte : la facturation, les clients, les stocks, les rendez-vous, les paiements. Vous retrouvez chaque information en quelques secondes, vous suivez ce qui rentre et ce qui sort, et vous décidez avec des chiffres fiables plutôt qu'avec des souvenirs.",
        "La facturation est souvent le premier besoin. Notre SaaS Factura Pro la simplifie : générer factures et reçus en quelques clics, pour 100 000 GNF par mois. C'est l'outil le plus simple pour passer du papier au digital, sans changer toute votre organisation d'un coup.",
        "Au-delà de la facturation, notre gamme compte sept logiciels de gestion : la gestion comptable (à partir de 1 000 000 GNF par mois), la gestion hospitalière (1 000 000, 3 000 000 ou 5 000 000 GNF par mois selon le forfait), la gestion d'école (500 000 GNF par mois, 9 mois facturés), la gestion immobilière (500 000 GNF par mois), la gestion de pharmacie (7 000 000 GNF par an) et la gestion de formation (tarification sur devis selon la taille de votre centre).",
        "Chacun de ces logiciels se teste gratuitement pendant 7 jours. L'essai est ouvert une fois par personne et par logiciel : vous remplissez le formulaire court (prénom, nom, téléphone), notre équipe active votre accès et vous rappelle pour vous accompagner pendant la prise en main. Sept jours suffisent pour vous faire votre propre avis.",
        "Si vos processus sont spécifiques, un logiciel interne sur mesure est la bonne option : à partir de 20 000 000 GNF, avec plusieurs accès administrateur et les fonctionnalités internes que vous demandez. Les workflows de validation, d'alerte ou de reporting sont conçus sur mesure. Et si vous voulez aller plus loin — vendre votre propre logiciel à vos clients — un logiciel SaaS à commercialiser démarre à partir de 50 000 000 GNF.",
        "Notre conseil : commencez par un seul outil, celui qui vous fait perdre le plus de temps aujourd'hui — souvent la facturation. Une fois l'habitude prise, étendez : comptabilité, gestion des clients, puis logiciels métiers. La digitalisation d'une entreprise en Guinée se fait pas à pas, avec un seul partenaire pour l'ensemble.",
        "Envie d'essayer ? Demandez votre essai gratuit de 7 jours ou une démonstration guidée via notre page Contact (/contact). Le détail des sept logiciels de gestion et de leurs tarifs est sur la page Logiciels (/logiciels)."
      ),
      en: P(
        "Notebooks, Excel spreadsheets, paper invoices: many businesses in Guinea still run their activity by hand. While the company is small, it works. As soon as it grows, management slows everything down: lost invoices, accounts to redo, clients forgotten. Management software is the answer — and digitalization starts there.",
        "Management software centralizes what matters: invoicing, clients, stock, appointments, payments. You find every piece of information in seconds, you track what comes in and what goes out, and you decide with reliable figures instead of memories.",
        "Invoicing is often the first need. Our Factura Pro SaaS makes it simple: generate invoices and receipts in a few clicks, for 100,000 GNF per month. It is the simplest tool to move from paper to digital, without changing your whole organization at once.",
        "Beyond invoicing, our range includes seven management tools: accounting management (from 1,000,000 GNF per month), hospital management (1,000,000, 3,000,000 or 5,000,000 GNF per month depending on the package), school management (500,000 GNF per month, 9 months billed), real-estate management (500,000 GNF per month), pharmacy management (7,000,000 GNF per year) and training management (quoted according to the size of your center).",
        "Each of these tools comes with a free 7-day trial. The trial is open once per person and per software: you fill in the short form (first name, last name, phone), our team activates your access and calls you back to support you as you get started. Seven days are enough to make up your own mind.",
        "If your processes are specific, a custom internal software is the right option: from 20,000,000 GNF, with several administrator accesses and the internal features you request. Validation, alert or reporting workflows are designed to measure. And to go further — selling your own software to your clients — a SaaS software to commercialize starts from 50,000,000 GNF.",
        "Our advice: start with a single tool, the one that wastes most of your time today — often invoicing. Once the habit is taken, extend: accounting, client management, then business tools. The digitalization of a company in Guinea happens step by step, with a single partner for everything.",
        "Want to try? Request your free 7-day trial or a guided demo through our Contact page (/contact). The details of the seven management tools and their prices are on the Software page (/logiciels)."
      ),
      es: P(
        "Cuadernos, hojas de Excel, facturas de papel: muchas empresas en Guinea siguen gestionando su actividad a mano. Mientras la empresa es pequeña, pasa. En cuanto crece, la gestión lo frena todo: facturas perdidas, cuentas por rehacer, clientes olvidados. Un software de gestión es la respuesta — y la digitalización empieza ahí.",
        "Un software de gestión centraliza lo que importa: la facturación, los clientes, el stock, las citas, los pagos. Encuentra cada información en segundos, sigue lo que entra y lo que sale, y decide con cifras fiables en lugar de recuerdos.",
        "La facturación suele ser la primera necesidad. Nuestro SaaS Factura Pro la simplifica: generar facturas y recibos en unos clics, por 100 000 GNF al mes. Es la herramienta más sencilla para pasar del papel a lo digital, sin cambiar toda su organización de golpe.",
        "Más allá de la facturación, nuestra gama cuenta con siete software de gestión: la gestión contable (desde 1 000 000 GNF al mes), la gestión hospitalaria (1 000 000, 3 000 000 o 5 000 000 GNF al mes según el paquete), la gestión de escuela (500 000 GNF al mes, 9 meses facturados), la gestión inmobiliaria (500 000 GNF al mes), la gestión de farmacia (7 000 000 GNF al año) y la gestión de formación (tarificación sobre presupuesto según el tamaño de su centro).",
        "Cada uno de estos software se prueba gratuitamente durante 7 días. La prueba está abierta una vez por persona y por software: rellene el formulario corto (nombre, apellido, teléfono), nuestro equipo activa su acceso y le llama para acompañarle durante la toma en mano. Siete días bastan para formarse su propia opinión.",
        "Si sus procesos son específicos, un software interno a medida es la buena opción: desde 20 000 000 GNF, con varios accesos de administrador y las funcionalidades internas que solicite. Los flujos de validación, alerta o informes se diseñan a medida. Y para ir más lejos — vender su propio software a sus clientes — un software SaaS para comercializar arranca desde 50 000 000 GNF.",
        "Nuestro consejo: empiece por una sola herramienta, la que hoy le hace perder más tiempo — a menudo la facturación. Una vez tomada la costumbre, amplíe: contabilidad, gestión de clientes y luego software de oficio. La digitalización de una empresa en Guinea se hace paso a paso, con un solo socio para todo.",
        "¿Ganas de probar? Solicite su prueba gratuita de 7 días o una demostración guiada desde nuestra página de Contacto (/contact). El detalle de los siete software de gestión y sus tarifas está en la página de Software (/logiciels)."
      ),
      zh: P(
        "笔记本、Excel 表格、纸质发票：几内亚的许多企业仍在手工管理业务。公司小的时候还过得去；一旦长大，管理就会拖慢一切：发票丢失、账目重做、客户被遗忘。管理软件正是答案——数字化也从这里开始。",
        "管理软件把重要的事情集中起来：开票、客户、库存、预约、收款。您几秒钟就能找到任何信息，清楚掌握进与出，用可靠的数字而不是记忆来做决策。",
        "开票往往是最先的需求。我们的 SaaS 产品 Factura Pro 让它变得简单：几次点击即可生成发票与收据，每月 100 000 GNF。这是从纸质走向数字化最简单的工具，无需一夜之间改变整个组织。",
        "除开票之外，我们的产品线共有七款管理软件：会计管理（每月 1 000 000 GNF 起）、医院管理（根据套餐每月 1 000 000 / 3 000 000 / 5 000 000 GNF）、学校管理（每月 500 000 GNF，按 9 个月计费）、物业管理（每月 500 000 GNF）、药房管理（每年 7 000 000 GNF）以及培训管理（根据中心规模按报价计费）。",
        "每款软件都可免费试用 7 天。试用对每位用户、每款软件开放一次：填写简短表单（名字、姓氏、电话），我们的团队会开通您的账号，并回电陪伴您完成上手。七天足以让您形成自己的判断。",
        "如果您的流程比较特殊，定制内部软件是正确选择：20 000 000 GNF 起，提供多个管理员账号以及您需要的内部功能。审批、提醒或报表等流程可量身设计。若想更进一步——把您自己的软件卖给您的客户——面向市场的 SaaS 软件 50 000 000 GNF 起。",
        "我们的建议：先从一个工具开始，也就是今天最浪费您时间的那个——通常是开票。习惯养成后再扩展：会计、客户管理，然后是业务软件。几内亚企业的数字化要一步步来，而且只需一个合作伙伴。",
        "想试试吗？通过我们的联系页面（/contact）申请 7 天免费试用或一次引导式演示。七款管理软件及其价格的详情见软件页面（/logiciels）。"
      ),
      de: P(
        "Hefte, Excel-Tabellen, Papierrechnungen: viele Unternehmen in Guinea verwalten ihr Geschäft noch von Hand. Solange das Unternehmen klein ist, geht es. Sobald es wächst, bremst die Verwaltung alles aus: verlorene Rechnungen, nachzuführende Konten, vergessene Kunden. Eine Verwaltungssoftware ist die Antwort — und die Digitalisierung beginnt dort.",
        "Eine Verwaltungssoftware bündelt, was zählt: Fakturierung, Kunden, Lager, Termine, Zahlungen. Sie finden jede Information in Sekunden, verfolgen Zu- und Abflüsse und entscheiden mit verlässlichen Zahlen statt mit Erinnerungen.",
        "Die Fakturierung ist oft der erste Bedarf. Unser SaaS Factura Pro macht sie einfach: Rechnungen und Quittungen mit wenigen Klicks erzeugen, für 100 000 GNF pro Monat. Es ist das einfachste Werkzeug, um vom Papier ins Digitale zu wechseln, ohne die gesamte Organisation auf einmal umzustellen.",
        "Über die Fakturierung hinaus umfasst unsere Palette sieben Verwaltungstools: Buchhaltung (ab 1 000 000 GNF pro Monat), Krankenhausverwaltung (je nach Paket 1 000 000, 3 000 000 oder 5 000 000 GNF pro Monat), Schulverwaltung (500 000 GNF pro Monat, 9 Monate abgerechnet), Immobilienverwaltung (500 000 GNF pro Monat), Apothekenverwaltung (7 000 000 GNF pro Jahr) und Trainingsverwaltung (Preisgestaltung auf Angebot, nach Größe Ihres Zentrums).",
        "Jedes dieser Tools lässt sich 7 Tage kostenlos testen. Die Testphase gilt einmal pro Person und pro Software: Sie füllen das kurze Formular aus (Vorname, Name, Telefon), unser Team schaltet Ihren Zugang frei und ruft Sie zurück, um Sie beim Einstieg zu begleiten. Sieben Tage genügen für ein eigenes Urteil.",
        "Sind Ihre Abläufe besonders, ist eine individuelle interne Software die richtige Option: ab 20 000 000 GNF, mit mehreren Administrator-Zugängen und den von Ihnen gewünschten internen Funktionen. Workflows für Freigaben, Warnungen oder Berichte werden maßgeschneidert entworfen. Und um weiterzugehen — Ihre eigene Software an Ihre Kunden zu verkaufen — beginnt eine zu vermarktende SaaS-Software ab 50 000 000 GNF.",
        "Unser Rat: Beginnen Sie mit einem einzigen Werkzeug, dem, das heute die meiste Zeit kostet — oft die Fakturierung. Sobald die Gewohnheit sitzt, erweitern Sie: Buchhaltung, Kundenverwaltung, dann Fachtools. Die Digitalisierung eines Unternehmens in Guinea geschieht Schritt für Schritt, mit einem einzigen Partner für alles.",
        "Lust zu testen? Fordern Sie Ihre kostenlose 7-Tage-Testphase oder eine geführte Demonstration über unsere Kontaktseite (/contact) an. Details zu den sieben Verwaltungstools und ihren Preisen finden Sie auf der Software-Seite (/logiciels)."
      ),
    },
  },

  /* ── 3. Community management en Guinée ─────────────────────────── */
  {
    slug: "community-management-guinee-guide",
    category: "marketing",
    readingMin: 5,
    publishedAt: new Date("2025-11-19T09:00:00.000Z"),
    title: {
      fr: "Community management en Guinée : à quoi ça sert et combien ça coûte",
      en: "Social media management in Guinea: what it's for and what it costs",
      es: "Community management en Guinea: para qué sirve y cuánto cuesta",
      zh: "几内亚的社交媒体代运营：有什么用、要花多少钱",
      de: "Community-Management in Guinea: wozu es dient und was es kostet",
    },
    excerpt: {
      fr: "Gestion des réseaux sociaux, publicité Facebook et Instagram : les trois forfaits — 1 500 000, 3 000 000 et 5 000 000 GNF par mois — expliqués sans détour.",
      en: "Social media management, Facebook and Instagram advertising: the three packages — 1,500,000, 3,000,000 and 5,000,000 GNF per month — explained plainly.",
      es: "Gestión de redes sociales, publicidad en Facebook e Instagram: los tres paquetes — 1 500 000, 3 000 000 y 5 000 000 GNF al mes — explicados sin rodeos.",
      zh: "社交媒体管理、Facebook 与 Instagram 广告：三档套餐——每月 1 500 000、3 000 000 与 5 000 000 GNF——直白讲清。",
      de: "Social-Media-Betreuung, Facebook- und Instagram-Werbung: die drei Pakete — 1 500 000, 3 000 000 und 5 000 000 GNF pro Monat — klar erklärt.",
    },
    body: {
      fr: P(
        "Vos clients sont déjà sur les réseaux sociaux : Facebook, Instagram, WhatsApp. La vraie question n'est pas « faut-il y être », mais qui gère vos pages, à quelle cadence, et à quel prix. Le community management en Guinée, c'est la gestion professionnelle de vos réseaux sociaux — et elle a un coût, qu'on vous donne ici, chiffres exacts.",
        "Concrètement, un community manager prépare un calendrier de publications, crée les visuels et les textes, publie régulièrement, répond aux messages et commentaires, et anime la publicité Facebook et Instagram pour toucher de nouveaux clients. Bien fait, ce travail transforme une page morte en vitrine vivante — et en source de contacts.",
        "Nous proposons trois forfaits, par mois. Le Forfait Essentiel, à 1 500 000 GNF par mois : sans équipe de terrain — vous fournissez les photos et les éléments, nous les transformons en publications professionnelles. La publicité est incluse : 10 $. C'est le bon niveau si votre activité produit déjà du contenu.",
        "Le Forfait Professionnel, à 3 000 000 GNF par mois : toujours sans équipe de terrain (vous fournissez les photos), avec une publicité incluse de 50 $ par mois. C'est notre forfait le plus demandé : une présence régulière et des campagnes qui donnent réellement de la visibilité.",
        "Le Forfait Premium, à 5 000 000 GNF par mois : là, nous venons sur le terrain. Une équipe dédiée réalise 2 interventions par semaine chez vous — photos et vidéos — et produit 5 montages vidéo par mois. La publicité incluse monte à 100 $ par mois. C'est le niveau des marques qui veulent une image constante, sans rien fournir.",
        "Vous voulez aller plus loin que la publicité incluse ? Nous concevons aussi des campagnes publicitaires sur mesure, à partir de 1 000 000 GNF par mois — conception et pilotage compris, budget média à votre charge. Combinée au community management, une campagne bien ciblée devient un vrai canal d'acquisition de clients.",
        "Comment choisir ? Trois questions : avez-vous du contenu à fournir (photos, actualités) ? Votre image a-t-elle besoin d'une présence terrain régulière ? Quel budget publicitaire voulez-vous activer chaque mois ? Essentiel répond au premier cas, Professionnel à la visibilité, Premium à l'image complète.",
        "Parlons de vos réseaux sociaux : décrivez-nous votre activité via notre page Contact (/contact), ou comparez les trois forfaits et tous nos tarifs sur la page Tarifs (/tarifs)."
      ),
      en: P(
        "Your clients are already on social media: Facebook, Instagram, WhatsApp. The real question is not whether to be there, but who manages your pages, at what pace, and at what price. Social media management in Guinea is the professional handling of your social networks — and it has a cost, which we give you here with exact figures.",
        "Concretely, a community manager prepares a publishing calendar, creates visuals and copy, publishes regularly, answers messages and comments, and runs Facebook and Instagram advertising to reach new clients. Done well, this work turns a dead page into a living showcase — and a source of contacts.",
        "We offer three packages, per month. The Essential package, at 1,500,000 GNF per month: no field team — you provide the photos and the material, we turn them into professional publications. Advertising is included: 10 $. It is the right level if your business already produces content.",
        "The Professional package, at 3,000,000 GNF per month: still without a field team (you provide the photos), with 50 $ of advertising included per month. It is our most requested package: a regular presence and campaigns that bring real visibility.",
        "The Premium package, at 5,000,000 GNF per month: there, we come on site. A dedicated team carries out 2 interventions per week at your premises — photos and videos — and produces 5 video edits per month. Included advertising rises to 100 $ per month. It is the level of brands that want a constant image, without providing anything.",
        "Want to go further than the included advertising? We also design custom advertising campaigns, from 1,000,000 GNF per month — design and management included, media budget at your charge. Combined with social media management, a well-targeted campaign becomes a real client-acquisition channel.",
        "How to choose? Three questions: do you have content to provide (photos, news)? Does your image need a regular field presence? What advertising budget do you want to activate each month? Essential answers the first case, Professional the visibility, Premium the complete image.",
        "Let's talk about your social media: describe your activity through our Contact page (/contact), or compare the three packages and all our prices on the Pricing page (/tarifs)."
      ),
      es: P(
        "Sus clientes ya están en las redes sociales: Facebook, Instagram, WhatsApp. La verdadera pregunta no es si hay que estar, sino quién gestiona sus páginas, con qué cadencia y a qué precio. El community management en Guinea es la gestión profesional de sus redes sociales — y tiene un coste, que le damos aquí con cifras exactas.",
        "En concreto, un community manager prepara un calendario de publicaciones, crea visuales y textos, publica con regularidad, responde a mensajes y comentarios, y anima la publicidad de Facebook e Instagram para alcanzar nuevos clientes. Bien hecho, este trabajo transforma una página muerta en una vitrina viva — y en una fuente de contactos.",
        "Proponemos tres paquetes, por mes. El Paquete Esencial, a 1 500 000 GNF al mes: sin equipo de terreno — usted proporciona las fotos y los elementos, nosotros los convertimos en publicaciones profesionales. La publicidad está incluida: 10 $. Es el buen nivel si su actividad ya produce contenido.",
        "El Paquete Profesional, a 3 000 000 GNF al mes: siempre sin equipo de terreno (usted proporciona las fotos), con 50 $ de publicidad incluidos al mes. Es nuestro paquete más solicitado: una presencia regular y campañas que dan visibilidad real.",
        "El Paquete Premium, a 5 000 000 GNF al mes: aquí sí vamos al terreno. Un equipo dedicado realiza 2 intervenciones por semana en sus instalaciones — fotos y vídeos — y produce 5 montajes de vídeo al mes. La publicidad incluida sube a 100 $ al mes. Es el nivel de las marcas que quieren una imagen constante, sin aportar nada.",
        "¿Quiere ir más lejos que la publicidad incluida? También concebimos campañas publicitarias a medida, desde 1 000 000 GNF al mes — concepción y pilotaje incluidos, presupuesto de medios a su cargo. Combinada con el community management, una campaña bien dirigida se convierte en un verdadero canal de captación de clientes.",
        "¿Cómo elegir? Tres preguntas: ¿tiene contenido que aportar (fotos, actualidades)? ¿Su imagen necesita una presencia de terreno regular? ¿Qué presupuesto publicitario quiere activar cada mes? Esencial responde al primer caso, Profesional a la visibilidad, Premium a la imagen completa.",
        "Hablemos de sus redes sociales: descríbanos su actividad desde nuestra página de Contacto (/contact), o compare los tres paquetes y todas nuestras tarifas en la página de Tarifas (/tarifs)."
      ),
      zh: P(
        "您的客户已经在社交媒体上：Facebook、Instagram、WhatsApp。真正的问题不是“要不要出现”，而是谁来运营您的页面、以怎样的频率、花多少钱。几内亚的社交媒体代运营，就是对您的社交平台进行专业化管理——它有成本，我们在这里用精确的数字告诉您。",
        "具体来说，社交媒体运营人员会制定发布日历、制作图片与文案、定期发布、回复私信与评论，并投放 Facebook 和 Instagram 广告来触达新客户。做得好，这些工作能把一个沉寂的页面变成鲜活的橱窗——以及稳定的客户来源。",
        "我们提供三档月付套餐。基础套餐，每月 1 500 000 GNF：不含地面团队——您提供照片与素材，我们将其转化为专业发布内容。广告费已含：10 $。如果您的业务本身已能产出内容，这一档正合适。",
        "专业套餐，每月 3 000 000 GNF：同样不含地面团队（照片由您提供），每月已含 50 $ 广告费。这是我们最热门的套餐：稳定的内容节奏，加上真正带来曝光的广告投放。",
        "尊享套餐，每月 5 000 000 GNF：这一档我们到现场。专属团队每周到店 2 次——拍摄照片与视频——每月制作 5 条视频剪辑。广告费提高到每月 100 $。这是想要持续形象、又无需自己提供任何素材的品牌之选。",
        "想在包含的广告之外更进一步？我们还提供定制广告投放服务，每月 1 000 000 GNF 起——含策划与代管，媒体预算由您承担。与代运营结合，一场精准投放可以成为真正的获客渠道。",
        "如何选择？问三个问题：您有内容可提供吗（照片、动态）？您的品牌形象是否需要固定的地面出镜？您每月想启用多少广告预算？基础套餐对应第一种情况，专业套餐对应曝光需求，尊享套餐对应完整形象。",
        "聊聊您的社交媒体吧：通过联系页面（/contact）描述您的业务，或在价格页面（/tarifs）对比三档套餐与全部报价。"
      ),
      de: P(
        "Ihre Kunden sind bereits in den sozialen Medien: Facebook, Instagram, WhatsApp. Die eigentliche Frage ist nicht, ob man dort sein muss, sondern wer Ihre Seiten betreut, in welchem Rhythmus und zu welchem Preis. Community-Management in Guinea bedeutet die professionelle Betreuung Ihrer sozialen Netzwerke — und sie hat einen Preis, den wir hier mit exakten Zahlen nennen.",
        "Konkret bereitet ein Community-Manager einen Redaktionskalender vor, erstellt Visuals und Texte, veröffentlicht regelmäßig, beantwortet Nachrichten und Kommentare und betreut die Facebook- und Instagram-Werbung, um neue Kunden zu erreichen. Gut gemacht verwandelt diese Arbeit eine tote Seite in eine lebendige Vitrine — und in eine Quelle von Kontakten.",
        "Wir bieten drei Pakete, pro Monat. Das Essentiel-Paket, zu 1 500 000 GNF pro Monat: ohne Außenteam — Sie liefern die Fotos und Unterlagen, wir machen daraus professionelle Veröffentlichungen. Werbung ist inklusive: 10 $. Die richtige Stufe, wenn Ihr Geschäft bereits Inhalte produziert.",
        "Das Professionnel-Paket, zu 3 000 000 GNF pro Monat: weiterhin ohne Außenteam (Sie liefern die Fotos), mit 50 $ Werbebudget pro Monat inklusive. Unser meistgewähltes Paket: eine regelmäßige Präsenz und Kampagnen, die echte Sichtbarkeit bringen.",
        "Das Premium-Paket, zu 5 000 000 GNF pro Monat: hier kommen wir vor Ort. Ein dediziertes Team führt 2 Einsätze pro Woche bei Ihnen durch — Fotos und Videos — und produziert 5 Videoschnitte pro Monat. Die inkludierte Werbung steigt auf 100 $ pro Monat. Die Stufe für Marken, die ein konstantes Bild wollen, ohne etwas liefern zu müssen.",
        "Möchten Sie über die inkludierte Werbung hinausgehen? Wir entwerfen auch maßgeschneiderte Werbekampagnen, ab 1 000 000 GNF pro Monat — Konzeption und Steuerung inklusive, Medienbudget zu Ihren Lasten. Kombiniert mit dem Community-Management wird eine gut gezielte Kampagne zu einem echten Kanal der Kundengewinnung.",
        "Wie wählen? Drei Fragen: Haben Sie Inhalte zu liefern (Fotos, Neuigkeiten)? Braucht Ihr Bild eine regelmäßige Präsenz vor Ort? Welches Werbebudget möchten Sie monatlich aktivieren? Essentiel beantwortet den ersten Fall, Professionnel die Sichtbarkeit, Premium das komplette Bild.",
        "Sprechen wir über Ihre sozialen Medien: Beschreiben Sie Ihre Tätigkeit über unsere Kontaktseite (/contact), oder vergleichen Sie die drei Pakete und alle unsere Preise auf der Preisseite (/tarifs)."
      ),
    },
  },

  /* ── 4. Génération de leads B2B ────────────────────────────────── */
  {
    slug: "trouver-clients-b2b-guinee",
    category: "marketing",
    readingMin: 5,
    publishedAt: new Date("2025-11-26T09:00:00.000Z"),
    title: {
      fr: "Génération de leads B2B en Guinée : trouver des clients, méthode et tarifs",
      en: "B2B lead generation in Guinea: finding clients, method and pricing",
      es: "Generación de leads B2B en Guinea: encontrar clientes, método y tarifas",
      zh: "几内亚的 B2B 线索获取：寻找客户的方法与价格",
      de: "B2B-Leadgenerierung in Guinea: Kunden finden, Methode und Preise",
    },
    excerpt: {
      fr: "Listes de contacts qualifiés, prospection téléphonique déléguée, landing page, campagnes : la méthode complète pour trouver des clients B2B en Guinée, à partir de 1 000 000 GNF.",
      en: "Qualified contact lists, delegated phone prospecting, landing page, campaigns: the complete method to find B2B clients in Guinea, starting from 1,000,000 GNF.",
      es: "Listas de contactos cualificados, prospección telefónica delegada, landing page, campañas: el método completo para encontrar clientes B2B en Guinea, desde 1 000 000 GNF.",
      zh: "合格客户名单、委托电话外呼、落地页、广告投放：在几内亚寻找 B2B 客户的完整方法，1 000 000 GNF 起。",
      de: "Qualifizierte Kontaktlisten, delegierte Telefonakquise, Landingpage, Kampagnen: die komplette Methode, um in Guinea B2B-Kunden zu finden, ab 1 000 000 GNF.",
    },
    body: {
      fr: P(
        "Trouver des clients B2B en Guinée ne se fait plus uniquement par le bouche-à-oreille. La génération de leads — l'art d'identifier et de qualifier des prospects pour votre équipe commerciale — est devenue un processus structuré, avec une méthode et des tarifs clairs. Voici comment nous procédons, et ce que ça coûte.",
        "Un lead, c'est un contact qualifié : une entreprise, un décideur, un besoin qui correspond à votre offre. La différence avec la prospection à l'aveugle est immense : votre équipe commerciale ne perd plus son temps à appeler des numéros qui n'aboutissent à rien. Elle appelle des prospects déjà triés.",
        "Premier service : la génération de leads B2B, à partir de 2 000 000 GNF par mois. Nous constituons des listes de contacts qualifiés selon votre secteur et le pays ciblé, et nous les transmettons à votre équipe commerciale. Vous gardez la main sur le contact final : c'est vous qui appelez, vous qui vendez.",
        "Deuxième service : la prospection téléphonique déléguée, à partir de 4 500 000 GNF par mois. Là, nos équipes appellent pour vous : elles présentent vos services, filtre les conversations intéressées et vous transmettent les contacts chauds, avec un reporting. Votre force commerciale ne voit arriver que des rendez-vous utiles.",
        "Troisième service : la landing page de conversion, à partir de 1 000 000 GNF. Une page unique, pensée pour capturer des prospects : un message clair, un formulaire court, des formulaires de capture de contacts connectés à votre suivi. Diffusée sur les réseaux ou en campagne, elle collecte des demandes pendant que vos équipes travaillent.",
        "Quatrième service : la campagne publicitaire sur mesure, à partir de 1 000 000 GNF par mois. Nous concevons et pilotons la campagne — le budget média reste à votre charge. C'est le moteur qui alimente la landing page en visiteurs, et transforme les visiteurs en leads.",
        "La méthode compte autant que les outils : définir précisément la cible (secteur, taille, zone), le message (le problème que vous résolvez), le canal (listes, appels, page, publicité), puis mesurer et corriger. Les quatre services se combinent : des listes pour la qualité, des appels pour la conversion, une landing page pour collecter, des campagnes pour amplifier.",
        "Vous cherchez des clients pour votre entreprise ? Parlez-nous de votre cible via notre page Contact (/contact) — nous vous dirons quelle combinaison adapter à votre marché. Le détail des services d'acquisition est sur la page Tarifs (/tarifs)."
      ),
      en: P(
        "Finding B2B clients in Guinea no longer relies only on word of mouth. Lead generation — the craft of identifying and qualifying prospects for your sales team — has become a structured process, with a method and clear prices. Here is how we proceed, and what it costs.",
        "A lead is a qualified contact: a company, a decision-maker, a need that matches your offer. The difference with blind prospecting is huge: your sales team no longer wastes time calling numbers that lead nowhere. It calls prospects that have already been sorted.",
        "First service: B2B lead generation, from 2,000,000 GNF per month. We build lists of qualified contacts according to your sector and the target country, and we hand them over to your sales team. You keep control of the final contact: you call, you sell.",
        "Second service: delegated phone prospecting, from 4,500,000 GNF per month. There, our teams call for you: they present your services, filter the interested conversations and pass on the warm contacts, with reporting. Your sales force only sees useful appointments arrive.",
        "Third service: the conversion landing page, from 1,000,000 GNF. A single page, designed to capture prospects: a clear message, a short form, contact capture forms connected to your follow-up. Broadcast on social media or in a campaign, it collects requests while your teams work.",
        "Fourth service: the custom advertising campaign, from 1,000,000 GNF per month. We design and run the campaign — the media budget remains at your charge. It is the engine that feeds the landing page with visitors and turns visitors into leads.",
        "The method matters as much as the tools: define the target precisely (sector, size, zone), the message (the problem you solve), the channel (lists, calls, page, advertising), then measure and correct. The four services combine: lists for quality, calls for conversion, a landing page to collect, campaigns to amplify.",
        "Looking for clients for your business? Tell us about your target through our Contact page (/contact) — we will tell you which combination fits your market. The details of the acquisition services are on the Pricing page (/tarifs)."
      ),
      es: P(
        "Encontrar clientes B2B en Guinea ya no depende solo del boca a boca. La generación de leads — el arte de identificar y cualificar prospectos para su equipo comercial — se ha convertido en un proceso estructurado, con un método y tarifas claras. He aquí cómo procedemos y cuánto cuesta.",
        "Un lead es un contacto cualificado: una empresa, un decididor, una necesidad que corresponde a su oferta. La diferencia con la prospección a ciegas es enorme: su equipo comercial ya no pierde el tiempo llamando a números que no llevan a nada. Llama a prospectos ya triados.",
        "Primer servicio: la generación de leads B2B, desde 2 000 000 GNF al mes. Constituyemos listas de contactos cualificados según su sector y el país objetivo, y se las transmitimos a su equipo comercial. Usted conserva el control del contacto final: es usted quien llama, quien vende.",
        "Segundo servicio: la prospección telefónica delegada, desde 4 500 000 GNF al mes. Aquí, nuestros equipos llaman por usted: presentan sus servicios, filtran las conversaciones interesadas y le transmiten los contactos calientes, con un informe. Su fuerza comercial solo recibe citas útiles.",
        "Tercer servicio: la landing page de conversión, desde 1 000 000 GNF. Una página única, pensada para capturar prospectos: un mensaje claro, un formulario corto, formularios de captación de contactos conectados a su seguimiento. Difundida en redes o en campaña, recoge solicitudes mientras sus equipos trabajan.",
        "Cuarto servicio: la campaña publicitaria a medida, desde 1 000 000 GNF al mes. Concebimos y pilotamos la campaña — el presupuesto de medios queda a su cargo. Es el motor que alimenta la landing page de visitantes y convierte a los visitantes en leads.",
        "El método cuenta tanto como las herramientas: definir con precisión el objetivo (sector, tamaño, zona), el mensaje (el problema que resuelve), el canal (listas, llamadas, página, publicidad) y después medir y corregir. Los cuatro servicios se combinan: listas para la calidad, llamadas para la conversión, una landing page para recoger, campañas para amplificar.",
        "¿Busca clientes para su empresa? Cuéntenos su objetivo desde nuestra página de Contacto (/contact) — le diremos qué combinación se adapta a su mercado. El detalle de los servicios de captación está en la página de Tarifas (/tarifs)."
      ),
      zh: P(
        "在几内亚寻找 B2B 客户，早已不再只靠口口相传。线索获取——为您的销售团队识别并筛选潜在客户——已成为一套有方法、有明确价格的标准化流程。下面是我们的做法与价格。",
        "一条合格的线索，就是一个经过筛选的联系人：一家企业、一位决策者、一个与您的产品匹配的需求。它与盲目外呼的差别巨大：您的销售团队不再把时间浪费在打不通、没意义的号码上，而是拨打已经筛选过的潜在客户。",
        "第一项服务：B2B 线索获取，每月 2 000 000 GNF 起。我们根据您的行业与目标国家建立合格联系人名单，并交付给您的销售团队。最终接触权仍在您手中：您来打电话，您来成交。",
        "第二项服务：委托电话外呼，每月 4 500 000 GNF 起。这一档由我们的团队替您拨打电话：介绍您的服务、筛选有意向的对话，并把高意向联系人连同报表一起交给您。您的销售团队只会接到有用的预约。",
        "第三项服务：转化落地页，1 000 000 GNF 起。一个只为获取潜在客户而设计的单页：清晰的信息、简短的表单、接入您跟进流程的客户信息收集表。投放到社交平台或广告中，它在您的团队工作时持续收集需求。",
        "第四项服务：定制广告投放，每月 1 000 000 GNF 起。由我们策划并代管投放——媒体预算由您承担。它是给落地页带来访客、并把访客转化为线索的引擎。",
        "方法与工具同样重要：精确定义目标（行业、规模、区域）、信息（您解决的问题）、渠道（名单、电话、页面、广告），然后度量并修正。四项服务可以组合：名单保证质量，电话促成转化，落地页负责收集，广告负责放大。",
        "您正在为您的企业寻找客户？通过联系页面（/contact）告诉我们您的目标客群——我们会告诉您哪种组合适合您的市场。获客服务的详情见价格页面（/tarifs）。"
      ),
      de: P(
        "B2B-Kunden in Guinea zu finden läuft längst nicht mehr nur über Mundpropaganda. Leadgenerierung — die Kunst, Interessenten für Ihr Vertriebsteam zu identifizieren und zu qualifizieren — ist ein strukturierter Prozess geworden, mit Methode und klaren Preisen. Hier ist unser Vorgehen und was es kostet.",
        "Ein Lead ist ein qualifizierter Kontakt: ein Unternehmen, ein Entscheider, ein Bedarf, der zu Ihrem Angebot passt. Der Unterschied zur Blindakquise ist gewaltig: Ihr Vertriebsteam verschwendet keine Zeit mehr mit Nummern, die zu nichts führen. Es ruft bereits gesiebte Interessenten an.",
        "Erste Leistung: B2B-Leadgenerierung, ab 2 000 000 GNF pro Monat. Wir erstellen Listen qualifizierter Kontakte nach Ihrer Branche und dem Zielland und übergeben sie Ihrem Vertriebsteam. Den letzten Kontakt behalten Sie in der Hand: Sie rufen an, Sie verkaufen.",
        "Zweite Leistung: delegierte Telefonakquise, ab 4 500 000 GNF pro Monat. Hier rufen unsere Teams für Sie an: Sie präsentieren Ihre Leistungen, sieben die interessierten Gespräche aus und übergeben Ihnen die warmen Kontakte — inklusive Reporting. Ihr Vertrieb erhält nur noch nützliche Termine.",
        "Dritte Leistung: die Conversion-Landingpage, ab 1 000 000 GNF. Eine einzelne Seite, gedacht zum Erfassen von Interessenten: eine klare Botschaft, ein kurzes Formular, Kontaktformulare, an Ihr Nachfassen angebunden. Auf sozialen Medien oder in Kampagnen ausgespielt, sammelt sie Anfragen, während Ihre Teams arbeiten.",
        "Vierte Leistung: die maßgeschneiderte Werbekampagne, ab 1 000 000 GNF pro Monat. Wir konzipieren und steuern die Kampagne — das Medienbudget bleibt zu Ihren Lasten. Sie ist der Motor, der die Landingpage mit Besuchern speist und aus Besuchern Leads macht.",
        "Die Methode zählt so viel wie die Werkzeuge: Ziel präzise definieren (Branche, Größe, Region), Botschaft (das Problem, das Sie lösen), Kanal (Listen, Anrufe, Seite, Werbung), dann messen und korrigieren. Die vier Leistungen kombinieren sich: Listen für Qualität, Anrufe für die Konversion, eine Landingpage zum Sammeln, Kampagnen zur Verstärkung.",
        "Sie suchen Kunden für Ihr Unternehmen? Beschreiben Sie uns Ihre Zielgruppe über unsere Kontaktseite (/contact) — wir sagen Ihnen, welche Kombination zu Ihrem Markt passt. Details zu den Akquiseleistungen finden Sie auf der Preisseite (/tarifs)."
      ),
    },
  },

  /* ── 5. Former ses équipes au digital ──────────────────────────── */
  {
    slug: "former-equipes-digital-guinee",
    category: "formations",
    readingMin: 4,
    publishedAt: new Date("2025-12-03T09:00:00.000Z"),
    title: {
      fr: "Former ses équipes au digital en Guinée : méthode et programme",
      en: "Training your teams in digital skills in Guinea: method and program",
      es: "Formar a sus equipos en digital en Guinea: método y programa",
      zh: "在几内亚培训团队的数字化能力：方法与课程",
      de: "Teams in Guinea digital weiterbilden: Methode und Programm",
    },
    excerpt: {
      fr: "Formation informatique en entreprise : notre méthode en quatre temps, un programme sur mesure pour votre métier, à partir de 20 000 000 GNF sur devis.",
      en: "In-company IT training: our four-step method, a program tailored to your line of business, from 20,000,000 GNF on quote.",
      es: "Formación informática en empresa: nuestro método en cuatro tiempos, un programa a medida para su actividad, desde 20 000 000 GNF sobre presupuesto.",
      zh: "企业内部 IT 培训：四步方法、为您的行业量身定制的课程，20 000 000 GNF 起，按报价评估。",
      de: "IT-Schulung im Unternehmen: unsere Methode in vier Schritten, ein auf Ihre Branche zugeschnittenes Programm, ab 20 000 000 GNF auf Angebot.",
    },
    body: {
      fr: P(
        "Livrer un logiciel ou un site à une équipe qui ne sait pas s'en servir, c'est livrer la moitié du projet. La formation informatique en entreprise est le maillon qui transforme un outil en résultat. En Guinée, nous formons les équipes des entreprises et organisations qui nous font confiance — avec un programme conçu pour leur métier.",
        "Pourquoi former ? Trois raisons simples. Vos équipes adoptent réellement les outils au lieu de les contourner. Elles gagnent en autonomie : moins d'allers-retours avec les prestataires. Et les usages deviennent plus sûrs : mots de passe, sauvegardes, données sensibles.",
        "Notre offre : la formation d'équipe en entreprise, à partir de 20 000 000 GNF, sur devis. Le montant est établi après analyse de vos besoins — taille des équipes, niveau de départ, outils concernés — et la stratégie de formation est adaptée à votre domaine d'activité. Pas de programme générique : votre programme.",
        "La méthode tient en quatre temps. Un : l'analyse — nous rencontrons vos équipes et identifions l'écart entre leurs usages actuels et ce que vos outils permettent. Deux : le programme sur mesure, séquence par séquence. Trois : les sessions, pratiques, sur vos outils réels et vos vrais dossiers. Quatre : l'évaluation, pour vérifier que les acquis tiennent dans la durée.",
        "Le programme couvre, selon vos besoins : la prise en main de l'ordinateur et des outils bureautiques, la messagerie professionnelle, vos logiciels de gestion (facturation, comptabilité, gestion des clients), les bonnes pratiques numériques — mots de passe, sauvegardes, prudence face aux tentatives de fraude — et l'usage des sites ou applications que nous vous avons livrés.",
        "Pour qui ? Les secrétariats, les équipes terrain, les services comptables, les responsables d'agence ou de site, et les directions qui veulent lire leurs chiffres sans dépendre de personne. Le nombre de participants et le rythme des sessions sont définis pendant l'étude.",
        "La formation complète naturellement nos autres services : un logiciel livré, une équipe formée, des bugs corrigés pendant la collaboration. Un seul partenaire pour l'outil et le savoir-faire — c'est ce qui fait tenir la digitalisation dans le temps.",
        "Décrivez-nous vos équipes et vos outils via notre page Contact (/contact) : l'analyse des besoins précède tout devis. Nos autres solutions sont détaillées sur la page Logiciels (/logiciels) et la page Tarifs (/tarifs)."
      ),
      en: P(
        "Delivering a software or a website to a team that does not know how to use it is delivering half a project. In-company IT training is the link that turns a tool into results. In Guinea, we train the teams of the companies and organizations that trust us — with a program designed for their line of business.",
        "Why train? Three simple reasons. Your teams actually adopt the tools instead of bypassing them. They gain autonomy: fewer back-and-forths with providers. And usage becomes safer: passwords, backups, sensitive data.",
        "Our offer: in-company team training, from 20,000,000 GNF, on quote. The amount is set after an analysis of your needs — team sizes, starting level, tools involved — and the training strategy is adapted to your line of business. No generic program: your program.",
        "The method holds in four steps. One: the analysis — we meet your teams and identify the gap between their current usage and what your tools allow. Two: the tailored program, sequence by sequence. Three: the sessions, hands-on, on your real tools and your real files. Four: the evaluation, to check that the learning lasts.",
        "Depending on your needs, the program covers: getting to grips with the computer and office tools, professional e-mail, your management software (invoicing, accounting, client management), digital best practices — passwords, backups, caution against fraud attempts — and the use of the websites or applications we delivered to you.",
        "For whom? Secretariats, field teams, accounting departments, branch or site managers, and executives who want to read their figures without depending on anyone. The number of participants and the pace of sessions are defined during the study.",
        "Training naturally completes our other services: a software delivered, a team trained, bugs fixed during the collaboration. A single partner for the tool and the know-how — that is what makes digitalization last.",
        "Tell us about your teams and tools through our Contact page (/contact): the needs analysis comes before any quote. Our other solutions are detailed on the Software page (/logiciels) and the Pricing page (/tarifs)."
      ),
      es: P(
        "Entregar un software o un sitio a un equipo que no sabe usarlo es entregar la mitad del proyecto. La formación informática en empresa es el eslabón que transforma una herramienta en resultados. En Guinea, formamos a los equipos de las empresas y organizaciones que nos dan su confianza — con un programa concebido para su oficio.",
        "¿Por qué formar? Tres razones simples. Sus equipos adoptan de verdad las herramientas en lugar de esquivarlas. Ganan autonomía: menos idas y vueltas con los proveedores. Y los usos se vuelven más seguros: contraseñas, copias de seguridad, datos sensibles.",
        "Nuestra oferta: la formación de equipo en empresa, desde 20 000 000 GNF, sobre presupuesto. El importe se establece tras un análisis de sus necesidades — tamaño de los equipos, nivel de partida, herramientas implicadas — y la estrategia de formación se adapta a su dominio de actividad. Nada de programa genérico: su programa.",
        "El método se sostiene en cuatro tiempos. Uno: el análisis — conocemos a sus equipos e identificamos la distancia entre sus usos actuales y lo que sus herramientas permiten. Dos: el programa a medida, secuencia por secuencia. Tres: las sesiones, prácticas, sobre sus herramientas reales y sus verdaderos expedientes. Cuatro: la evaluación, para comprobar que lo aprendido dura.",
        "Según sus necesidades, el programa cubre: la toma en mano del ordenador y las herramientas de ofimática, el correo profesional, sus software de gestión (facturación, contabilidad, gestión de clientes), las buenas prácticas digitales — contraseñas, copias de seguridad, prudencia frente a los intentos de fraude — y el uso de los sitios o aplicaciones que le hemos entregado.",
        "¿Para quién? Los secretariados, los equipos de terreno, los servicios contables, los responsables de agencia o de sitio, y las direcciones que quieren leer sus cifras sin depender de nadie. El número de participantes y el ritmo de las sesiones se definen durante el estudio.",
        "La formación completa naturalmente nuestros demás servicios: un software entregado, un equipo formado, errores corregidos durante la colaboración. Un solo socio para la herramienta y el saber hacer — eso es lo que hace durar la digitalización.",
        "Descríbanos sus equipos y sus herramientas desde nuestra página de Contacto (/contact): el análisis de necesidades precede a todo presupuesto. Nuestras demás soluciones están detalladas en la página de Software (/logiciels) y en la página de Tarifas (/tarifs)."
      ),
      zh: P(
        "把软件或网站交给一个不会使用的团队，等于只交付了项目的一半。企业 IT 培训正是把工具变成成果的关键一环。在几内亚，我们为信任我们的企业与组织培训团队——课程专为他们的行业设计。",
        "为什么要培训？三个简单的原因：您的团队会真正采用工具，而不是绕开它们；他们获得自主能力，减少与供应商的来回沟通；使用习惯也更安全：密码、备份、敏感数据。",
        "我们的服务：企业团队培训，20 000 000 GNF 起，按报价评估。金额在分析您的需求后确定——团队规模、起点水平、涉及的工具——培训策略会根据您的行业领域量身调整。没有通用课程：只有您的课程。",
        "方法分四步。一：调研——我们与您的团队见面，找出他们当前用法与工具能力之间的差距。二：量身定制的课程，逐节编排。三：实操课程，在您的真实工具与真实业务上进行。四：评估，确认所掌握的技能能够长期保持。",
        "根据您的需要，课程涵盖：电脑与办公工具的入门、企业邮箱、您的管理软件（开票、会计、客户管理）、数字化良好实践——密码、备份、警惕诈骗——以及我们交付给您的网站或应用的使用。",
        "面向谁？行政文员、外勤团队、财务部门、分公司或站点负责人，以及希望独立读懂经营数字的管理层。参训人数与课程节奏在调研阶段确定。",
        "培训自然地补全我们的其他服务：软件已交付、团队已培训、缺陷在合作期内免费修复。工具与技能只靠一个伙伴——这正是数字化能够持久的原因。",
        "通过联系页面（/contact）告诉我们您的团队与工具情况：需求分析先于一切报价。我们的其他方案详见软件页面（/logiciels）与价格页面（/tarifs）。"
      ),
      de: P(
        "Eine Software oder eine Website an ein Team zu liefern, das sie nicht bedienen kann, heißt, die Hälfte des Projekts zu liefern. IT-Schulung im Unternehmen ist das Bindeglied, das aus einem Werkzeug Ergebnisse macht. In Guinea schulen wir die Teams der Unternehmen und Organisationen, die uns vertrauen — mit einem Programm, das für ihre Branche entworfen ist.",
        "Warum schulen? Drei einfache Gründe. Ihre Teams nehmen die Werkzeuge wirklich an, statt sie zu umgehen. Sie gewinnen Eigenständigkeit: weniger Hin und Her mit Dienstleistern. Und die Nutzung wird sicherer: Passwörter, Backups, sensible Daten.",
        "Unser Angebot: Teamtrainings im Unternehmen, ab 20 000 000 GNF, auf Angebot. Der Betrag wird nach einer Analyse Ihrer Bedürfnisse festgelegt — Teamgröße, Ausgangsniveau, beteiligte Werkzeuge — und die Schulungsstrategie wird an Ihr Tätigkeitsfeld angepasst. Kein generisches Programm: Ihr Programm.",
        "Die Methode besteht aus vier Schritten. Erstens: die Analyse — wir treffen Ihre Teams und erkennen die Lücke zwischen ihrem jetzigen Umgang und dem, was Ihre Werkzeuge erlauben. Zweitens: das maßgeschneiderte Programm, Schritt für Schritt. Drittens: die Sitzungen, praktisch, an Ihren echten Werkzeugen und echten Vorgängen. Viertens: die Evaluation, um zu prüfen, dass das Gelernte hält.",
        "Je nach Bedarf deckt das Programm ab: den Umgang mit Computer und Bürosoftware, professionelle E-Mail, Ihre Verwaltungssoftware (Fakturierung, Buchhaltung, Kundenverwaltung), gute digitale Praxis — Passwörter, Backups, Vorsicht vor Betrugsversuchen — sowie die Nutzung der Websites oder Anwendungen, die wir Ihnen geliefert haben.",
        "Für wen? Sekretariate, Außenteams, Buchhaltungsabteilungen, Leiter von Niederlassungen oder Standorten und Führungskräfte, die ihre Zahlen lesen wollen, ohne von jemandem abzuhängen. Teilnehmerzahl und Sitzungsrhythmus werden während der Analyse festgelegt.",
        "Das Training ergänzt natürlich unsere anderen Leistungen: eine gelieferte Software, ein geschultes Team, behobene Bugs während der Zusammenarbeit. Ein einziger Partner für Werkzeug und Know-how — das lässt die Digitalisierung Bestand haben.",
        "Beschreiben Sie uns Ihre Teams und Werkzeuge über unsere Kontaktseite (/contact): Die Bedarfsanalyse geht jedem Angebot voraus. Unsere anderen Lösungen sind auf der Software-Seite (/logiciels) und der Preisseite (/tarifs) im Detail beschrieben."
      ),
    },
  },

  /* ── 6. Site vitrine ou boutique en ligne ──────────────────────── */
  {
    slug: "site-vitrine-ou-ecommerce-guinee",
    category: "web",
    readingMin: 5,
    publishedAt: new Date("2025-12-10T09:00:00.000Z"),
    title: {
      fr: "Site vitrine ou boutique en ligne en Guinée : que choisir ?",
      en: "Showcase site or online store in Guinea: which one to choose?",
      es: "¿Sitio vitrina o tienda en línea en Guinea: qué elegir?",
      zh: "在几内亚，展示站还是在线商店：如何选择？",
      de: "Auftritts-Website oder Online-Shop in Guinea: Was wählen?",
    },
    excerpt: {
      fr: "Vitrine 1 500 000 GNF, tableau de bord 3 500 000 GNF, paiement intégré +1 000 000 GNF : le comparatif clair pour choisir entre site vitrine et boutique en ligne en Guinée.",
      en: "Showcase 1,500,000 GNF, dashboard 3,500,000 GNF, integrated payment +1,000,000 GNF: a clear comparison to choose between a showcase site and an online store in Guinea.",
      es: "Vitrina 1 500 000 GNF, panel 3 500 000 GNF, pago integrado +1 000 000 GNF: el comparativo claro para elegir entre sitio vitrina y tienda en línea en Guinea.",
      zh: "展示站 1 500 000 GNF、带后台网站 3 500 000 GNF、集成支付 +1 000 000 GNF：在几内亚选择展示站还是在线商店的清晰对比。",
      de: "Auftritt 1 500 000 GNF, Dashboard 3 500 000 GNF, integrierte Zahlung +1 000 000 GNF: der klare Vergleich zwischen Auftritts-Website und Online-Shop in Guinea.",
    },
    body: {
      fr: P(
        "Site vitrine ou boutique en ligne en Guinée : beaucoup d'entrepreneurs se posent la question au moment de lancer leur projet web. Les deux sont des sites, mais ils ne servent pas la même chose et ne coûtent pas le même montant. Voici comment trancher, avec les chiffres exacts.",
        "Le site vitrine présente votre activité : qui vous êtes, ce que vous faites, comment vous joindre. Les pages sont conçues et gérées par l'agence — vous n'avez aucune technologie à apprendre ; pour un changement, vous passez par un webmaster. Il est proposé à 1 500 000 GNF, avec un renouvellement annuel de 500 000 GNF qui couvre le nom de domaine et l'hébergement. C'est le bon choix si votre contenu change peu.",
        "La boutique en ligne, elle, vend : catalogue, panier, commande, paiement. Sur notre catalogue, la vente en ligne s'appuie sur le système de paiement intégré, une option disponible pour tout type de site pour 1 000 000 GNF supplémentaires — par exemple un site vitrine à 1 500 000 GNF avec paiement intégré revient à 2 500 000 GNF.",
        "Entre les deux, le site à tableau de bord : 3 500 000 GNF, renouvellement annuel de 700 000 GNF. Vous gérez vous-même vos textes, vos images et vos contenus depuis un espace d'administration (un administrateur). Si votre catalogue évolue souvent — nouveaux produits, nouveaux tarifs, actualités — c'est la base à privilégier. Au-delà, le site customisé est étudié sur devis : options sur mesure comme le chatbot WhatsApp, le chatbot vendeur ou une section réseau social.",
        "Dans tous les cas, chaque site comprend le nom de domaine, l'hébergement, deux adresses e-mail professionnelles, la correction des bugs, le mode clair et sombre, la traduction en plusieurs langues, un chatbot écrit et des formulaires de capture de contacts. Rien de tout cela n'est une option cachée.",
        "Comment choisir ? Trois critères. La fréquence des mises à jour : peu fréquentes → vitrine ; fréquentes → tableau de bord. Le besoin de vente en ligne : oui → paiement intégré (+1 000 000 GNF). La capacité interne : une équipe qui peut alimenter le site → tableau de bord ; sinon → vitrine gérée par l'agence.",
        "Un dernier point pour la Guinée : la majorité de vos clients navigue depuis un téléphone. Quel que soit votre choix, le site est rapide sur mobile et la commande — si vous vendez — reste simple : peu d'étapes, un paiement direct. Une boutique qui oblige à dix clics perd ses clients en route.",
        "Toujours hésitant ? Décrivez-nous votre activité via notre page Contact (/contact) : nous vous dirons quel site correspond à votre besoin — et le détail de toutes les offres est sur la page Tarifs (/tarifs)."
      ),
      en: P(
        "Showcase site or online store in Guinea: many entrepreneurs ask themselves the question when launching their web project. Both are websites, but they do not serve the same purpose and do not cost the same amount. Here is how to decide, with exact figures.",
        "The showcase site presents your business: who you are, what you do, how to reach you. The pages are designed and managed by the agency — you have no technology to learn; for a change, you go through a webmaster. It is offered at 1,500,000 GNF, with an annual renewal of 500,000 GNF covering the domain name and hosting. It is the right choice if your content changes little.",
        "The online store, it, sells: catalog, cart, order, payment. In our catalog, online selling relies on the integrated payment system, an option available for any type of site for an extra 1,000,000 GNF — for example a showcase site at 1,500,000 GNF with integrated payment comes to 2,500,000 GNF.",
        "Between the two, the dashboard site: 3,500,000 GNF, annual renewal of 700,000 GNF. You manage your texts, images and content yourself from an administration space (one administrator). If your catalog evolves often — new products, new prices, news — it is the base to favor. Beyond, the customized site is studied on quote: custom options like the WhatsApp chatbot, the sales chatbot or a social network section.",
        "In every case, each site includes the domain name, hosting, two professional e-mail addresses, bug fixing, light and dark mode, translation into several languages, a written chatbot and contact capture forms. None of that is a hidden option.",
        "How to choose? Three criteria. Update frequency: rare → showcase; frequent → dashboard. The need to sell online: yes → integrated payment (+1,000,000 GNF). Internal capacity: a team that can feed the site → dashboard; otherwise → showcase managed by the agency.",
        "One last point for Guinea: most of your clients browse from a phone. Whatever your choice, the site is fast on mobile and ordering — if you sell — stays simple: few steps, a direct payment. A store that requires ten clicks loses its clients on the way.",
        "Still hesitating? Describe your activity through our Contact page (/contact): we will tell you which site matches your need — and the detail of all the offers is on the Pricing page (/tarifs)."
      ),
      es: P(
        "¿Sitio vitrina o tienda en línea en Guinea? Muchos emprendedores se hacen la pregunta al lanzar su proyecto web. Los dos son sitios, pero no sirven para lo mismo ni cuestan lo mismo. He aquí cómo decidirse, con las cifras exactas.",
        "El sitio vitrina presenta su actividad: quién es usted, qué hace, cómo contactarle. Las páginas son diseñadas y gestionadas por la agencia — no tiene ninguna tecnología que aprender; para un cambio, pasa por un webmaster. Se propone a 1 500 000 GNF, con una renovación anual de 500 000 GNF que cubre el nombre de dominio y el alojamiento. Es la buena elección si su contenido cambia poco.",
        "La tienda en línea, ella, vende: catálogo, carrito, pedido, pago. En nuestro catálogo, la venta en línea se apoya en el sistema de pago integrado, una opción disponible para todo tipo de sitio por 1 000 000 GNF adicionales — por ejemplo, un sitio vitrina de 1 500 000 GNF con pago integrado asciende a 2 500 000 GNF.",
        "Entre los dos, el sitio con panel de administración: 3 500 000 GNF, renovación anual de 700 000 GNF. Usted mismo gestiona sus textos, imágenes y contenidos desde un espacio de administración (un administrador). Si su catálogo evoluciona a menudo — nuevos productos, nuevos precios, actualidades — es la base a privilegiar. Más allá, el sitio personalizado se estudia sobre presupuesto: opciones a medida como el chatbot de WhatsApp, el chatbot vendedor o una sección de red social.",
        "En todos los casos, cada sitio incluye el nombre de dominio, el alojamiento, dos direcciones de correo profesionales, la corrección de errores, el modo claro y oscuro, la traducción a varios idiomas, un chatbot escrito y formularios de captación de contactos. Nada de eso es una opción oculta.",
        "¿Cómo elegir? Tres criterios. La frecuencia de actualización: poco frecuente → vitrina; frecuente → panel. La necesidad de vender en línea: sí → pago integrado (+1 000 000 GNF). La capacidad interna: un equipo que pueda alimentar el sitio → panel; si no → vitrina gestionada por la agencia.",
        "Un último punto para Guinea: la mayoría de sus clientes navega desde un teléfono. Sea cual sea su elección, el sitio es rápido en el móvil y la compra — si usted vende — sigue siendo simple: pocos pasos, un pago directo. Una tienda que obliga a diez clics pierde a sus clientes en el camino.",
        "¿Todavía duda? Descríbanos su actividad desde nuestra página de Contacto (/contact): le diremos qué sitio corresponde a su necesidad — y el detalle de todas las ofertas está en la página de Tarifas (/tarifs)."
      ),
      zh: P(
        "在几内亚，展示站还是在线商店？很多创业者在启动网站项目时都会问这个问题。两者都是网站，但用途不同、价格也不同。下面用精确的数字帮您做出选择。",
        "展示站用于呈现您的业务：您是谁、您做什么、如何联系您。页面由代理公司设计与管理——您无需学习任何技术；需要修改时，交给网站管理员处理。价格为 1 500 000 GNF，年度续费 500 000 GNF，涵盖域名与主机。如果您的网站内容变化不大，这是正确的选择。",
        "在线商店则负责销售：商品目录、购物车、下单、支付。在我们的目录中，在线销售依托集成支付系统——这是一项适用于任何类型网站的选项，额外费用 1 000 000 GNF。例如：1 500 000 GNF 的展示站加上集成支付，总计 2 500 000 GNF。",
        "介于两者之间的是带管理后台的网站：3 500 000 GNF，年度续费 700 000 GNF。您可以在后台自行管理文字、图片与内容（一个管理员账号）。如果您的商品目录经常变动——新品、调价、动态——这是应优先选择的基础。再往上是定制站，按报价单独评估：定制选项包括 WhatsApp 聊天机器人、销售机器人或社交版块。",
        "无论哪种情况，每个网站都包含：域名、主机、两个专业电子邮箱、缺陷修复、明暗双主题、多语言翻译、文字聊天机器人以及客户信息收集表单。这些没有一样是隐藏的付费选项。",
        "如何选择？三个标准。更新频率：很少更新 → 展示站；经常更新 → 带后台网站。是否需要在线销售：是 → 集成支付（+1 000 000 GNF）。内部能力：有团队可以持续维护网站 → 带后台网站；否则 → 由代理公司管理的展示站。",
        "关于几内亚市场的最后一点：您的客户大多用手机浏览。无论您选择哪种方案，网站在手机上都要快，购买流程——如果您销售的话——也要简单：步骤少、支付直接。一家让客户点十次才能下单的商店，会在路上流失他们。",
        "还在犹豫？通过联系页面（/contact）描述您的业务：我们会告诉您哪种网站适合您的需求——全部方案的详情见价格页面（/tarifs）。"
      ),
      de: P(
        "Auftritts-Website oder Online-Shop in Guinea? Viele Unternehmer stellen sich diese Frage beim Start ihres Webprojekts. Beide sind Websites, aber sie dienen nicht demselben Zweck und kosten nicht denselben Betrag. So treffen Sie die Entscheidung — mit exakten Zahlen.",
        "Die Auftritts-Website präsentiert Ihr Unternehmen: wer Sie sind, was Sie tun, wie man Sie erreicht. Die Seiten werden von der Agentur gestaltet und verwaltet — Sie müssen keine Technik lernen; für eine Änderung gehen Sie über einen Webmaster. Sie wird zu 1 500 000 GNF angeboten, mit einer jährlichen Verlängerung von 500 000 GNF, die Domain und Hosting abdeckt. Die richtige Wahl, wenn sich Ihr Inhalt wenig ändert.",
        "Der Online-Shop dagegen verkauft: Katalog, Warenkorb, Bestellung, Zahlung. In unserem Katalog stützt sich der Onlineverkauf auf das integrierte Zahlungssystem, eine Option für jeden Website-Typ für zusätzliche 1 000 000 GNF — eine Auftritts-Website zu 1 500 000 GNF mit integrierter Zahlung macht zum Beispiel 2 500 000 GNF.",
        "Zwischen beiden liegt die Website mit Dashboard: 3 500 000 GNF, jährliche Verlängerung 700 000 GNF. Sie verwalten Ihre Texte, Bilder und Inhalte selbst in einem Verwaltungsbereich (ein Administrator). Wenn sich Ihr Katalog oft ändert — neue Produkte, neue Preise, Neuigkeiten —, ist sie die bevorzugte Basis. Darüber hinaus wird die maßgeschneiderte Website auf Angebot kalkuliert: individuelle Optionen wie der WhatsApp-Chatbot, der Verkaufs-Chatbot oder ein Social-Media-Bereich.",
        "In jedem Fall umfasst jede Website Domain, Hosting, zwei professionelle E-Mail-Adressen, Fehlerbehebung, hellen und dunklen Modus, Übersetzung in mehrere Sprachen, einen Text-Chatbot und Formulare zur Kontaktaufnahme. Nichts davon ist eine versteckte Option.",
        "Wie wählen? Drei Kriterien. Änderungshäufigkeit: selten → Auftritt; häufig → Dashboard. Bedarf an Onlineverkauf: ja → integrierte Zahlung (+1 000 000 GNF). Interne Kapazität: ein Team, das die Seite speisen kann → Dashboard; sonst → Auftritt, von der Agentur verwaltet.",
        "Ein letzter Punkt für Guinea: Die meisten Ihrer Kunden surfen vom Telefon. Welchen Weg Sie auch wählen — die Seite ist schnell auf dem Mobilgerät, und die Bestellung — wenn Sie verkaufen — bleibt einfach: wenige Schritte, eine direkte Zahlung. Ein Shop, der zehn Klicks verlangt, verliert seine Kunden unterwegs.",
        "Noch unentschlossen? Beschreiben Sie Ihre Tätigkeit über unsere Kontaktseite (/contact): Wir sagen Ihnen, welche Website zu Ihrem Bedarf passt — das Detail aller Angebote finden Sie auf der Preisseite (/tarifs)."
      ),
    },
  },
];

async function main() {
  let created = 0;
  let updated = 0;
  for (const p of POSTS) {
    const existing = await db.blogPost.findUnique({ where: { slug: p.slug } });
    const data = {
      title: J(p.title),
      excerpt: J(p.excerpt),
      body: J(p.body),
      category: p.category,
      readingMin: p.readingMin,
      isPublished: true,
      publishedAt: p.publishedAt,
    };
    if (existing) {
      await db.blogPost.update({ where: { slug: p.slug }, data });
      updated++;
      console.log(`updated  ${p.slug} (langs: ${Object.keys(p.title).join(",")})`);
    } else {
      await db.blogPost.create({ data: { slug: p.slug, ...data } });
      created++;
      console.log(`created  ${p.slug} (langs: ${Object.keys(p.title).join(",")})`);
    }
  }

  /* Vérification : nombre total d'articles publiés + paragraphe manquant éventuel */
  const total = await db.blogPost.count({ where: { isPublished: true } });
  const slugs = await db.blogPost.findMany({
    where: { isPublished: true },
    select: { slug: true, publishedAt: true },
    orderBy: { publishedAt: "asc" },
  });

  console.log(`\ndone — ${created} created, ${updated} updated`);
  console.log(`Journal : ${total} articles publiés au total`);
  for (const s of slugs) {
    console.log(`  ${s.publishedAt?.toISOString().slice(0, 10)}  ${s.slug}`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
