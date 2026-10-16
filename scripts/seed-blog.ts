/**
 * Journal — complétion à 5 langues + 3 nouveaux articles (itération 21).
 * Faits exclusivement issus du catalogue (src/lib/catalog.ts, itération 20) :
 *  - Vitrine 1 500 000 GNF (renouvellement 500 000/an)
 *  - Site à tableau de bord 3 500 000 GNF (1 admin, renouvellement 700 000/an)
 *  - Customisé sur devis ; paiement intégré +1 000 000 GNF
 *  - Factura Pro 100 000/mois · Comptable dès 1 M/mois · Hospitalière 1/3/5 M/mois
 *  - École 500 000/mois (9 mois facturés) · Immobilière 500 000/mois · Pharmacie 7 M/an
 *  - Formation : sur devis · Logiciel interne dès 20 M · Workflows sur mesure
 * Usage : bun scripts/seed-blog.ts
 */
import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

const J = (o: Record<string, string>) => JSON.stringify(o);

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
  {
    slug: "site-web-multilingue-pourquoi",
    category: "agence",
    readingMin: 3,
    publishedAt: new Date("2026-10-16T09:00:00.000Z"),
    title: {
      fr: "Un site en plusieurs langues : pourquoi la traduction change tout",
      en: "A website in several languages: why translation changes everything",
      es: "Un sitio en varios idiomas: por qué la traducción lo cambia todo",
      zh: "多语言网站：为什么翻译能改变一切",
      de: "Eine Website in mehreren Sprachen: Warum Übersetzung alles verändert",
    },
    excerpt: {
      fr: "Vos clients lisent le français, vos partenaires cherchent en anglais, la diaspora compare depuis l'étranger. Chez nous, le multilingue est inclus dès l'offre de base.",
      en: "Your clients read French, your international partners search in English, the diaspora compares from abroad. With us, multilingual is included from the base offer.",
      es: "Sus clientes leen en francés, sus socios internacionales buscan en inglés, la diáspora compara desde el extranjero. Con nosotros, el multilingüe está incluido desde la oferta básica.",
      zh: "您的客户读法语，国际伙伴用英语搜索，海外侨胞在异国比较。在我们这里，多语言从基础套餐起就已包含。",
      de: "Ihre Kunden lesen Französisch, Ihre internationalen Partner suchen auf Englisch, die Diaspora vergleicht aus dem Ausland. Bei uns ist Mehrsprachigkeit ab dem Basisangebot inklusive.",
    },
    body: {
      fr: "En Guinée, votre clientèle ne lit pas tous la même langue. Vos clients parlent français, vos partenaires internationaux cherchent en anglais, la diaspora compare depuis l'étranger — et chacun juge votre entreprise en quelques secondes, dans sa langue.\n\nC'est pourquoi la traduction en plusieurs langues est incluse dans toutes nos offres de sites web, dès la base. Ce site même existe en français, en anglais, en espagnol, en chinois et en allemand : votre futur site suivra la même logique.\n\nL'enjeu dépasse la simple politesse : chaque langue est une porte d'entrée depuis Google. Un visiteur qui trouve votre page dans sa langue reste plus longtemps, comprend mieux votre offre et contacte plus volontiers. Un site monolingue, lui, ferme silencieusement toutes les autres portes.\n\nConcrètement, chez nous, le multilingue n'est pas un supplément d'intégration : l'interface est traduite, les contenus sont structurés par langue, et l'assistant du site répond au visiteur dans la sienne. Vous n'avez qu'un site à entretenir ; lui parle toutes les langues.\n\nSi votre ambition dépasse la frontière — export, sous-traitance internationale, diaspora investisseuse — la traduction n'est pas une option : c'est la première brique. Parlons-en.",
      en: "In Guinea, your clientele does not all read the same language. Your clients speak French, your international partners search in English, the diaspora compares from abroad — and everyone judges your company within seconds, in their own language.\n\nThat is why translation into several languages is included in all our website offers, from the base. This very site exists in French, English, Spanish, Chinese and German: your future site will follow the same logic.\n\nThe stake goes beyond simple politeness: each language is a doorway from Google. A visitor who finds your page in their own language stays longer, understands your offer better and gets in touch more willingly. A monolingual site silently closes all the other doors.\n\nConcretely, with us, multilingual is not an integration surcharge: the interface is translated, the content is structured by language, and the site assistant answers each visitor in theirs. You maintain one single site; it speaks all the languages.\n\nIf your ambition crosses the border — exports, international subcontracting, investing diaspora — translation is not an option: it is the first brick. Let's talk about it.",
      es: "En Guinea, su clientela no lee todos el mismo idioma. Sus clientes hablan francés, sus socios internacionales buscan en inglés, la diáspora compara desde el extranjero — y cada uno juzga a su empresa en segundos, en su propia lengua.\n\nPor eso la traducción a varios idiomas está incluida en todas nuestras ofertas de sitios web, desde la base. Este mismo sitio existe en francés, inglés, español, chino y alemán: su futuro sitio seguirá la misma lógica.\n\nEl asunto va más allá de la cortesía: cada idioma es una puerta de entrada desde Google. Un visitante que encuentra su página en su idioma permanece más tiempo, entiende mejor su oferta y contacta con más gusto. Un sitio monolingüe cierra en silencio todas las demás puertas.\n\nEn concreto, con nosotros, el multilingüe no es un suplemento de integración: la interfaz está traducida, los contenidos están estructurados por idioma y el asistente del sitio responde a cada visitante en el suyo. Usted mantiene un solo sitio; él habla todos los idiomas.\n\nSi su ambición cruza la frontera — exportación, subcontratación internacional, diáspora inversora — la traducción no es una opción: es el primer ladrillo. Hablemos de ello.",
      zh: "在几内亚，您的客户并不都读同一种语言。您的客户说法语，国际伙伴用英语搜索，海外侨胞在异国他乡比较各家报价——每个人都在几秒钟内、用自己的语言评判您的企业。\n\n因此，多语言翻译包含在我们所有网站套餐之中，从基础款开始。本网站本身就有法语、英语、西班牙语、中文和德语五个版本：您未来的网站也将遵循同样的逻辑。\n\n这件事的意义远超礼貌层面：每一种语言都是一扇来自 Google 的入口。用母语找到您页面的访客停留更久、更懂您的产品、也更愿意联系您。而单语网站则无声地关上了所有其他的门。\n\n具体来说，在我们这里，多语言不是集成加价项：界面已翻译，内容按语言结构化，网站助手还会用访客的语言回答对方。您只需维护一个网站，而它会说的语言覆盖所有人。\n\n如果您的雄心跨越国境——出口、国际分包、投资型侨胞——翻译不是可选项：它是第一块砖。来聊聊吧。",
      de: "In Guinea liest nicht jeder Ihrer Kunden dieselbe Sprache. Ihre Kunden sprechen Französisch, Ihre internationalen Partner suchen auf Englisch, die Diaspora vergleicht von unterwegs — und jeder beurteilt Ihr Unternehmen in Sekunden, in seiner eigenen Sprache.\n\nDeshalb ist die Übersetzung in mehrere Sprachen in allen unseren Website-Angeboten enthalten, ab der Basis. Diese Website selbst existiert auf Französisch, Englisch, Spanisch, Chinesisch und Deutsch: Ihre künftige Website folgt derselben Logik.\n\nDie Sache geht über Höflichkeit hinaus: Jede Sprache ist eine Tür von Google aus. Ein Besucher, der Ihre Seite in seiner Sprache findet, bleibt länger, versteht Ihr Angebot besser und kontaktiert eher. Eine einsprachige Website verschließt lautlos alle anderen Türen.\n\nKonkret ist Mehrsprachigkeit bei uns kein Integrationsaufschlag: Die Oberfläche ist übersetzt, die Inhalte sind nach Sprache strukturiert, und der Website-Assistent antwortet jedem Besucher in seiner Sprache. Sie pflegen eine einzige Website; sie spricht alle Sprachen.\n\nWenn Ihr Ehrgeiz die Grenze überschreitet — Export, internationale Subunternehmer, investierende Diaspora — ist Übersetzung keine Option: sie ist der erste Baustein. Sprechen wir darüber.",
    },
  },
  {
    slug: "combien-coute-un-site-web-en-guinee",
    category: "web",
    readingMin: 4,
    publishedAt: new Date("2026-10-12T09:00:00.000Z"),
    title: {
      fr: "Combien coûte un site web en Guinée ? Le détail de nos offres",
      en: "How much does a website cost in Guinea? Our offers explained",
      es: "¿Cuánto cuesta un sitio web en Guinea? Nuestras ofertas en detalle",
      zh: "在几内亚建一个网站要多少钱？我们的报价详解",
      de: "Was kostet eine Website in Guinea? Unsere Angebote im Detail",
    },
    excerpt: {
      fr: "Site vitrine, site à tableau de bord ou customisé : montants fixes en GNF, renouvellements transparents et inclusions détaillées — voici exactement nos offres.",
      en: "Showcase site, dashboard site or customized: fixed amounts in GNF, transparent renewals and detailed inclusions — here are exactly our offers.",
      es: "Sitio vitrina, sitio con panel de administración o personalizado: importes fijos en GNF, renovaciones transparentes e inclusiones detalladas: estas son exactamente nuestras ofertas.",
      zh: "展示站、带管理后台的网站或定制站：以几内亚法郎计的固定价格、透明的年度续费与详细的包含项——这就是我们的完整报价。",
      de: "Auftritts-Website, Website mit Dashboard oder maßgeschneidert: feste Beträge in GNF, transparente Verlängerungen und detaillierte Leistungen — genau das bieten wir.",
    },
    body: {
      fr: "Chez beaucoup d'agences, le prix d'un site web reste un mystère qu'on découvre seulement au devis. Nous avons choisi l'inverse : des offres publiques, des montants fixes en francs guinéens, et tout ce qui est inclus écrit noir sur blanc.\n\nLa première offre, le site vitrine, est proposée à 1 500 000 GNF. Les pages sont conçues et gérées par l'agence — aucun tableau de bord, aucune technologie à apprendre : idéal pour présenter votre activité avec une image impeccable. Son renouvellement annuel est de 500 000 GNF.\n\nLa deuxième offre, le site à tableau de bord, est à 3 500 000 GNF. Vous gérez vous-même vos textes, vos images et vos contenus depuis un espace d'administration (un administrateur). Son renouvellement annuel est de 700 000 GNF. Vous hésitez entre les deux ? Le vitrine convient si votre site change peu ; le tableau de bord s'impose si vous publiez souvent.\n\nAu-delà, le site customisé est étudié sur devis : il part du site à tableau de bord et y ajoute des options sur mesure — chatbot WhatsApp, chatbot vendeur, section réseau social… Et quel que soit le site, le système de paiement intégré est disponible en option pour 1 000 000 GNF supplémentaires.\n\nChaque site comprend le nom de domaine, l'hébergement, deux adresses e-mail professionnelles, la correction des bugs, le mode clair et sombre, la traduction en plusieurs langues, un chatbot écrit et des formulaires de capture de contacts.\n\nLe moyen le plus simple d'y voir clair pour votre projet : demandez un devis ou parlez à notre assistant — il connaît toutes nos offres et vous oriente en quelques échanges.",
      en: "At many agencies, the price of a website is a mystery you only discover at the quote stage. We chose the opposite: public offers, fixed amounts in Guinean francs, and everything included written in black and white.\n\nThe first offer, the showcase site, is priced at 1,500,000 GNF. The pages are designed and managed by the agency — no dashboard, no technology to learn: ideal to present your business with a flawless image. Its annual renewal is 500,000 GNF.\n\nThe second offer, the dashboard site, is at 3,500,000 GNF. You manage your texts, images and content yourself from an administration space (one administrator). Its annual renewal is 700,000 GNF. Hesitating between the two? The showcase fits if your site changes little; the dashboard is the right call if you publish often.\n\nBeyond that, the customized site is studied on quote: it starts from the dashboard site and adds custom options — WhatsApp chatbot, sales chatbot, social network section… And whatever the site, the integrated payment system is available as an option for an extra 1,000,000 GNF.\n\nEvery site includes the domain name, hosting, two professional e-mail addresses, bug fixing, light and dark mode, translation into several languages, a written chatbot and contact capture forms.\n\nThe simplest way to see clearly for your project: request a quote or talk to our assistant — it knows all our offers and guides you in a few exchanges.",
      es: "En muchas agencias, el precio de un sitio web sigue siendo un misterio que solo se descubre en el presupuesto. Nosotros elegimos lo contrario: ofertas públicas, importes fijos en francos guineanos y todo lo incluido escrito en blanco y negro.\n\nLa primera oferta, el sitio vitrina, cuesta 1 500 000 GNF. Las páginas son diseñadas y gestionadas por la agencia — sin panel de administración, sin tecnología que aprender: ideal para presentar su actividad con una imagen impecable. Su renovación anual es de 500 000 GNF.\n\nLa segunda oferta, el sitio con panel de administración, cuesta 3 500 000 GNF. Usted mismo gestiona sus textos, imágenes y contenidos desde un espacio de administración (un administrador). Su renovación anual es de 700 000 GNF. ¿Duda entre los dos? La vitrina basta si su sitio cambia poco; el panel se impone si publica a menudo.\n\nMás allá, el sitio personalizado se estudia sobre presupuesto: parte del sitio con panel y añade opciones a medida — chatbot de WhatsApp, chatbot vendedor, sección de red social… Y sea cual sea el sitio, el sistema de pago integrado está disponible como opción por 1 000 000 GNF adicionales.\n\nCada sitio incluye el nombre de dominio, el alojamiento, dos direcciones de correo profesionales, la corrección de errores, el modo claro y oscuro, la traducción a varios idiomas, un chatbot escrito y formularios de captación de contactos.\n\nLa manera más sencilla de verlo claro para su proyecto: pida un presupuesto o hable con nuestro asistente — conoce todas nuestras ofertas y le orienta en unos intercambios.",
      zh: "在很多代理公司，网站的价格是个谜，直到报价阶段才揭晓。我们选择相反的做法：公开报价、以几内亚法郎计的固定金额，以及白纸黑字写明的包含项。\n\n第一款产品是展示站，价格为 1 500 000 GNF。页面由代理公司设计和管理——没有管理后台、无需学习任何技术：适合以完美的形象展示您的业务。年度续费为 500 000 GNF。\n\n第二款产品是带管理后台的网站，价格为 3 500 000 GNF。您可以在后台自行管理文字、图片和内容（一个管理员账号）。年度续费为 700 000 GNF。两者之间犹豫？如果网站更新很少，展示站足够；如果经常发布内容，带后台的方案更合适。\n\n在此之上，定制站按报价单独评估：它以带后台的网站为基础，叠加定制选项——WhatsApp 聊天机器人、销售机器人、社交版块等。无论哪种网站，集成的支付系统都可以作为选项添加，额外费用为 1 000 000 GNF。\n\n每个网站都包含：域名、主机、两个专业电子邮箱、缺陷修复、明暗双主题、多语言翻译、文字聊天机器人以及客户信息收集表单。\n\n想为您的项目理清头绪，最简单的方式：申请报价或与我们的助手聊聊——它了解我们的全部报价，几次对话就能为您指明方向。",
      de: "Bei vielen Agenturen bleibt der Preis einer Website ein Geheimnis, das man erst bei der Offerte lüftet. Wir haben es umgekehrt entschieden: öffentliche Angebote, feste Beträge in guineischen Francs und alle Leistungen schwarz auf weiß.\n\nDas erste Angebot, die Auftritts-Website, kostet 1 500 000 GNF. Die Seiten werden von der Agentur gestaltet und verwaltet — ohne Dashboard, ohne Technik, die man lernen muss: ideal, um Ihr Unternehmen mit tadellosem Bild zu präsentieren. Die jährliche Verlängerung beträgt 500 000 GNF.\n\nDas zweite Angebot, die Website mit Dashboard, kostet 3 500 000 GNF. Sie verwalten Ihre Texte, Bilder und Inhalte selbst in einem Verwaltungsbereich (ein Administrator). Die jährliche Verlängerung beträgt 700 000 GNF. Unentschieden? Der Auftritt reicht, wenn sich Ihre Seite wenig ändert; das Dashboard ist richtig, wenn Sie häufig veröffentlichen.\n\nDarüber hinaus wird die maßgeschneiderte Website nach Angebot kalkuliert: Sie baut auf der Dashboard-Website auf und ergänzt individuelle Optionen — WhatsApp-Chatbot, Verkaufs-Chatbot, Social-Media-Bereich… Und bei jeder Website ist das integrierte Zahlungssystem als Option für zusätzliche 1 000 000 GNF erhältlich.\n\nJede Website umfasst Domain, Hosting, zwei professionelle E-Mail-Adressen, Fehlerbehebung, hellen und dunklen Modus, Übersetzung in mehrere Sprachen, einen Text-Chatbot und Formulare zur Kontaktaufnahme.\n\nAm einfachsten schaffen Sie Klarheit für Ihr Projekt: Fordern Sie ein Angebot an oder sprechen Sie mit unserem Assistenten — er kennt alle unsere Angebote und führt Sie in wenigen Schritten.",
    },
  },
  {
    slug: "nos-deux-engagements-envers-chaque-client",
    category: "agence",
    readingMin: 3,
    publishedAt: new Date("2026-10-06T09:00:00.000Z"),
    title: {
      fr: "Nos deux engagements envers chaque client",
      en: "Our two commitments to every client",
      es: "Nuestros dos compromisos con cada cliente",
      zh: "我们对每一位客户的两个承诺",
      de: "Unsere zwei Zusagen gegenüber jedem Kunden",
    },
    excerpt: {
      fr: "Des bugs corrigés sans frais pendant toute la collaboration, et des services plus complets que la moyenne. Voici ce qui nous distingue, concrètement.",
      en: "Bugs fixed free of charge throughout the collaboration, and services more complete than average. Here is what sets us apart, concretely.",
      es: "Errores corregidos sin coste durante toda la colaboración y servicios más completos que el promedio. Esto es lo que nos distingue, en concreto.",
      zh: "整个合作期内免费修复缺陷，以及高于平均水准的完整服务。这就是我们的具体不同之处。",
      de: "Kostenlose Fehlerbehebung während der gesamten Zusammenarbeit und umfassendere Leistungen als üblich. Das unterscheidet uns — konkret.",
    },
    body: {
      fr: "Deux engagements guident chaque projet que nous livrons. Ils ne sont pas marketing : ils sont écrits dans notre manière de travailler, et ils sont les mêmes depuis sept ans.\n\nPremier engagement : les bugs, les failles et les erreurs, nous nous en chargeons — sans frais supplémentaires. Pendant toute la durée de notre collaboration, si quelque chose ne fonctionne pas dans ce que nous vous avons livré, nous le corrigeons. En revanche, les nouvelles fonctionnalités que vous demandez après la livraison sont facturées à part : c'est la limite honnête de l'engagement.\n\nDeuxième engagement : des services plus complets que la moyenne. Un site chez nous, ce n'est pas seulement des pages : c'est un tableau de bord d'administration, un chatbot, des formulaires de capture de contacts, le mode clair et sombre et la traduction en plusieurs langues, dès l'offre de base.\n\nEt parce qu'un prestataire unique vaut mieux que quatre, nous couvrons aussi vos logiciels sur mesure, vos réseaux sociaux et votre acquisition de clients. Un seul interlocuteur pour tout votre digital.\n\nNous ne prétendons pas être les moins chers. Nous prétendons livrer plus complet, plus solide, et corriger ce qui doit l'être sans marchander. C'est ainsi que nous construisons des collaborations qui durent.",
      en: "Two commitments guide every project we deliver. They are not marketing: they are written into the way we work, and they have been the same for seven years.\n\nFirst commitment: bugs, vulnerabilities and errors — we take care of them, at no extra cost. For the entire duration of our collaboration, if something we delivered does not work, we fix it. New features you request after delivery are billed separately: that is the honest limit of the commitment.\n\nSecond commitment: services more complete than average. A website with us is not just pages: it includes an administration dashboard, a chatbot, contact capture forms, light and dark mode and translation into several languages, from the base offer.\n\nAnd because one provider beats four, we also cover your custom software, your social media and your client acquisition. A single contact for your entire digital presence.\n\nWe do not claim to be the cheapest. We claim to deliver more complete, more solid work, and to fix what needs fixing without haggling. That is how we build collaborations that last.",
      es: "Dos compromisos guían cada proyecto que entregamos. No son marketing: están escritos en nuestra manera de trabajar, y son los mismos desde hace siete años.\n\nPrimer compromiso: los errores, las fallas y los fallos — nos encargamos de ellos sin coste adicional. Durante toda nuestra colaboración, si algo que entregamos no funciona, lo corregimos. Las nuevas funcionalidades que solicite después de la entrega se facturan aparte: es el límite honesto del compromiso.\n\nSegundo compromiso: servicios más completos que el promedio. Un sitio con nosotros no son solo páginas: incluye un panel de administración, un chatbot, formularios de captación de contactos, modo claro y oscuro y traducción a varios idiomas, desde la oferta básica.\n\nY porque un solo proveedor vale más que cuatro, también cubrimos su software a medida, sus redes sociales y su captación de clientes. Un único interlocutor para todo su mundo digital.\n\nNo pretendemos ser los más baratos. Pretendemos entregar algo más completo, más sólido, y corregir lo que deba corregirse sin regatear. Así construimos colaboraciones que duran.",
      zh: "两个承诺贯穿我们交付的每一个项目。它们不是营销话术，而是写进了我们的工作方式，并且七年来始终如一。\n\n第一个承诺：缺陷、漏洞与错误——我们负责修复，不额外收费。在整个合作期间，只要是我们交付的内容出现问题，我们都会修正。而交付后您提出的新功能则单独计费：这是承诺诚实的边界。\n\n第二个承诺：比平均水平更完整的服务。在我们这里，网站不只是页面：从基础套餐起，就包含管理后台、聊天机器人、客户信息收集表单、明暗双主题以及多语言翻译。\n\n而且，一个服务商胜过四个：我们还覆盖您的定制软件、社交媒体运营与客户获取。您的整个数字业务，只需一个对接人。\n\n我们不自称最便宜。我们承诺交付更完整、更稳固的成果，并把该修的修好、绝不讨价还价。这正是我们建立长期合作的方式。",
      de: "Zwei Zusagen leiten jedes Projekt, das wir liefern. Sie sind kein Marketing: Sie stehen in unserer Arbeitsweise geschrieben, und sie sind seit sieben Jahren dieselben.\n\nErste Zusage: Bugs, Schwachstellen und Fehler — wir kümmern uns darum, ohne Aufpreis. Während der gesamten Zusammenarbeit gilt: Was wir geliefert haben und nicht funktioniert, reparieren wir. Neue Funktionen, die Sie nach der Lieferung wünschen, werden separat abgerechnet: das ist die ehrliche Grenze der Zusage.\n\nZweite Zusage: Leistungen, die umfassender sind als der Durchschnitt. Eine Website bei uns ist nicht nur Seiten: ab dem Basisangebot inklusive Verwaltungsbereich, Chatbot, Formulare zur Kontaktaufnahme, hellen und dunklem Modus sowie Übersetzung in mehrere Sprachen.\n\nUnd weil ein Anbieter besser ist als vier, decken wir auch Ihre Individualsoftware, Ihre sozialen Medien und Ihre Kundengewinnung ab. Ein einziger Ansprechpartner für Ihr gesamtes digitales Geschäft.\n\nWir behaupten nicht, die günstigsten zu sein. Wir liefern umfassender, solider — und reparieren, was repariert werden muss, ohne Feilschen. So bauen wir Zusammenarbeiten auf, die halten.",
    },
  },
  {
    slug: "factura-pro-la-facturation-simplifiee",
    category: "saas",
    readingMin: 3,
    publishedAt: new Date("2026-09-28T09:00:00.000Z"),
    title: {
      fr: "Factura Pro : la facturation de votre entreprise, sans friction",
      en: "Factura Pro: your company's invoicing, without friction",
      es: "Factura Pro: la facturación de su empresa, sin fricción",
      zh: "Factura Pro：让贵公司的开票流程零摩擦",
      de: "Factura Pro: Die Rechnungsstellung Ihres Unternehmens ohne Reibung",
    },
    excerpt: {
      fr: "Notre SaaS de facturation à 100 000 GNF par mois, testable gratuitement pendant 7 jours. Comment l'essayer et ce qui se passe ensuite.",
      en: "Our invoicing SaaS at 100,000 GNF per month, free to try for 7 days. How to try it and what happens next.",
      es: "Nuestro SaaS de facturación a 100 000 GNF al mes, con prueba gratuita de 7 días. Cómo probarlo y qué ocurre después.",
      zh: "我们的开票 SaaS 每月 100 000 GNF，可免费试用 7 天。如何试用，以及接下来会发生什么。",
      de: "Unser Rechnungs-SaaS für 100 000 GNF pro Monat, 7 Tage kostenlos testbar. Wie Sie ihn testen und was danach passiert.",
    },
    body: {
      fr: "La facturation est le rythme quotidien d'une entreprise : chaque prestation livrée doit se transformer en facture claire, envoyée à temps, suivie jusqu'au paiement. C'est précisément le travail de Factura Pro, notre SaaS de gestion de la facturation.\n\nLe tarif est simple : 100 000 GNF par mois. Pas de frais d'installation cachés, pas d'engagement compliqué — et un essai gratuit de 7 jours pour vous faire votre propre avis.\n\nL'essai est ouvert à tous : une fois par personne et par logiciel. Vous remplissez le formulaire court (prénom, nom, téléphone), notre équipe active votre accès et vous rappelle pour vous accompagner pendant la prise en main.\n\nVous hésitez entre un essai et une démonstration guidée ? Notre conseiller peut vous présenter le logiciel en direct, adapté à votre activité — demandez une démo via le formulaire de contact ou l'assistant du site, et nous revenons vers vous sous 24 heures ouvrées.\n\nFactura Pro fait partie de notre gamme de SaaS métiers, aux côtés de la gestion comptable, de la gestion hospitalière, de la gestion d'école, de la gestion immobilière et de la gestion de pharmacie. Un même partenaire pour l'ensemble de vos outils de gestion.",
      en: "Invoicing is a company's daily rhythm: every delivered service must become a clear invoice, sent on time, followed up until payment. That is exactly the job of Factura Pro, our invoicing management SaaS.\n\nThe pricing is simple: 100,000 GNF per month. No hidden setup fees, no complicated commitment — and a free 7-day trial to make up your own mind.\n\nThe trial is open to everyone: once per person and per software. You fill in the short form (first name, last name, phone), our team activates your access and calls you back to support you as you get started.\n\nUndecided between a trial and a guided demo? Our advisor can present the software live, tailored to your business — request a demo via the contact form or the site assistant, and we get back to you within 24 working hours.\n\nFactura Pro is part of our range of business SaaS, alongside accounting management, hospital management, school management, real-estate management and pharmacy management. One partner for all your management tools.",
      es: "La facturación es el ritmo diario de una empresa: cada servicio entregado debe convertirse en una factura clara, enviada a tiempo y seguida hasta el pago. Ese es exactamente el trabajo de Factura Pro, nuestro SaaS de gestión de facturación.\n\nLa tarifa es sencilla: 100 000 GNF al mes. Sin costes de instalación ocultos, sin compromisos complicados — y una prueba gratuita de 7 días para formarse su propia opinión.\n\nLa prueba está abierta a todos: una vez por persona y por software. Rellene el formulario breve (nombre, apellido, teléfono), nuestro equipo activa su acceso y le llama para acompañarle durante la puesta en marcha.\n\n¿Duda entre una prueba y una demostración guiada? Nuestro asesor puede presentarle el software en directo, adaptado a su actividad — solicite una demo a través del formulario de contacto o del asistente del sitio, y le respondemos en menos de 24 horas laborables.\n\nFactura Pro forma parte de nuestra gama de SaaS de gestión, junto con la gestión contable, la gestión hospitalaria, la gestión escolar, la gestión inmobiliaria y la gestión de farmacia. Un solo socio para todas sus herramientas de gestión.",
      zh: "开票是一家公司的日常节奏：每一项交付的服务都应变成一张清晰的发票，按时发出，并跟进到回款。这正是 Factura Pro——我们的开票管理 SaaS——所做的工作。\n\n价格很简单：每月 100 000 GNF。没有隐藏的安装费，没有复杂的绑定条款——还有 7 天免费试用，让您自己下判断。\n\n试用对所有人开放：每人、每个软件限一次。您只需填写简短表单（姓、名、电话），我们的团队会开通您的账号，并在您上手期间电话陪伴指导。\n\n在试用与引导演示之间犹豫？我们的顾问可以针对您的业务现场演示软件——通过联系表单或网站助手申请演示，我们会在 24 个工作小时内回复您。\n\nFactura Pro 属于我们的行业管理 SaaS 系列，与之并列的还有会计管理、医院管理、学校管理、物业管理与药店管理。您的全部管理工具，由同一个伙伴提供。",
      de: "Die Rechnungsstellung ist der tägliche Rhythmus eines Unternehmens: Jede erbrachte Leistung muss zu einer klaren Rechnung werden, rechtzeitig versendet und bis zur Zahlung verfolgt werden. Genau das ist die Aufgabe von Factura Pro, unserem SaaS für das Rechnungsmanagement.\n\nDer Tarif ist einfach: 100 000 GNF pro Monat. Keine versteckten Einrichtungskosten, keine komplizierten Bindungen — und eine kostenlose 7-Tage-Testphase, um sich selbst ein Urteil zu bilden.\n\nDer Test steht allen offen: einmal pro Person und pro Software. Sie füllen das kurze Formular aus (Vorname, Nachname, Telefon), unser Team schaltet Ihren Zugang frei und ruft Sie an, um Sie beim Einstieg zu begleiten.\n\nUnsicher zwischen Testphase und geführter Demo? Unser Berater stellt Ihnen die Software live vor, angepasst an Ihr Geschäft — fordern Sie eine Demo über das Kontaktformular oder den Website-Assistenten an; wir melden uns innerhalb von 24 Arbeitsstunden.\n\nFactura Pro ist Teil unserer Palette an Verwaltungs-SaaS, neben der Buchhaltungsverwaltung, dem Krankenhausmanagement, dem Schulmanagement, dem Immobilienmanagement und dem Apothekenmanagement. Ein Partner für alle Ihre Verwaltungswerkzeuge.",
    },
  },
  {
    slug: "site-vitrine-ou-tableau-de-bord",
    category: "web",
    readingMin: 4,
    publishedAt: new Date("2026-09-21T09:00:00.000Z"),
    title: {
      fr: "Site vitrine ou site à tableau de bord : comment choisir ?",
      en: "Showcase site or dashboard site: how to choose?",
      es: "¿Sitio vitrina o sitio con panel de administración? Cómo elegir",
      zh: "展示站还是带管理后台的网站？如何选择",
      de: "Auftritt oder Website mit Dashboard: Wie entscheiden?",
    },
    excerpt: {
      fr: "Deux façons de posséder un site : nous gérer tout pour vous, ou vous donner les clés. Voici comment trancher selon votre activité.",
      en: "Two ways to own a website: we manage everything for you, or we hand you the keys. Here is how to decide for your business.",
      es: "Dos maneras de tener un sitio: nosotros lo gestionamos todo por usted, o le entregamos las llaves. Así puede decidir según su actividad.",
      zh: "拥有网站有两种方式：我们为您打理一切，或者把钥匙交给您。以下是如何根据您的业务做出选择。",
      de: "Zwei Wege, eine Website zu besitzen: Wir verwalten alles für Sie, oder wir übergeben Ihnen die Schlüssel. So treffen Sie die richtige Wahl.",
    },
    body: {
      fr: "Posséder un site web, ce n'est pas seulement payer une fois : c'est décider qui fera vivre les contenus, semaine après semaine. C'est la vraie question qui sépare nos deux offres principales — et elle mérite mieux qu'un coup d'œil au prix.\n\nLe site vitrine, à 1 500 000 GNF, est la sérénité : nous concevons les pages, nous gérons les contenus, vous n'apprenez aucun outil. Il convient parfaitement aux activités dont le site change peu — une image impeccable, des informations claires, un contact simple. Renouvellement annuel : 500 000 GNF.\n\nLe site à tableau de bord, à 3 500 000 GNF, est l'autonomie : vous modifiez vos textes, vos images et vos contenus vous-même, quand vous voulez, depuis un espace d'administration (un administrateur). Il s'impose dès que votre site doit vivre au rythme de votre activité : actualités, catalogues, équipes, offres. Renouvellement annuel : 700 000 GNF.\n\nEntre les deux, un pont : le site customisé, étudié sur devis, qui ajoute au tableau de bord des options sur mesure — chatbot WhatsApp, chatbot vendeur, section réseau social. Et pour vendre en ligne, le système de paiement intégré est disponible en option (1 000 000 GNF), quel que soit votre site.\n\nNotre conseil : si vos contenus bougent moins d'une fois par mois, le vitrine suffit ; au-delà, le tableau de bord se rembourse en temps gagné. Et si vous hésitez encore, notre assistant connaît les deux offres sur le bout des pixels.",
      en: "Owning a website is not just paying once: it is deciding who will keep the content alive, week after week. That is the real question separating our two main offers — and it deserves more than a glance at the price tag.\n\nThe showcase site, at 1,500,000 GNF, is peace of mind: we design the pages, we manage the content, you learn no tool. It perfectly fits businesses whose site changes little — a flawless image, clear information, simple contact. Annual renewal: 500,000 GNF.\n\nThe dashboard site, at 3,500,000 GNF, is autonomy: you edit your texts, images and content yourself, whenever you want, from an administration space (one administrator). It becomes essential as soon as your site must live at the pace of your business: news, catalogues, teams, offers. Annual renewal: 700,000 GNF.\n\nBetween the two, a bridge: the customized site, studied on quote, which adds custom options to the dashboard — WhatsApp chatbot, sales chatbot, social network section. And to sell online, the integrated payment system is available as an option (1,000,000 GNF), whatever your site.\n\nOur advice: if your content moves less than once a month, the showcase is enough; beyond that, the dashboard pays for itself in time saved. And if you still hesitate, our assistant knows both offers down to the last pixel.",
      es: "Tener un sitio web no es solo pagar una vez: es decidir quién dará vida a los contenidos, semana tras semana. Esa es la verdadera pregunta que separa nuestras dos ofertas principales — y merece más que una mirada al precio.\n\nEl sitio vitrina, a 1 500 000 GNF, es la tranquilidad: diseñamos las páginas, gestionamos los contenidos, usted no aprende ninguna herramienta. Encaja perfectamente con actividades cuyo sitio cambia poco — una imagen impecable, información clara, un contacto sencillo. Renovación anual: 500 000 GNF.\n\nEl sitio con panel de administración, a 3 500 000 GNF, es la autonomía: usted modifica sus textos, imágenes y contenidos cuando quiere, desde un espacio de administración (un administrador). Se impone en cuanto su sitio debe vivir al ritmo de su actividad: noticias, catálogos, equipos, ofertas. Renovación anual: 700 000 GNF.\n\nEntre ambos, un puente: el sitio personalizado, estudiado sobre presupuesto, que añade al panel opciones a medida — chatbot de WhatsApp, chatbot vendedor, sección de red social. Y para vender en línea, el sistema de pago integrado está disponible como opción (1 000 000 GNF), sea cual sea su sitio.\n\nNuestro consejo: si sus contenidos se mueven menos de una vez al mes, la vitrina basta; más allá, el panel se amortiza en tiempo ganado. Y si todavía duda, nuestro asistente conoce ambas ofertas hasta el último píxel.",
      zh: "拥有一个网站不只是付一次钱：而是要决定由谁让内容持续生长，一周又一周。这正是我们两款主要产品的真正分水岭——值得您认真权衡，而不是只看价格。\n\n展示站，1 500 000 GNF，买的是省心：我们设计页面、我们管理内容，您无需学习任何工具。它非常适合内容更新较少的业务——形象无可挑剔、信息清晰、联系方式简单。年度续费：500 000 GNF。\n\n带管理后台的网站，3 500 000 GNF，买的是自主：您可以在后台随时自行修改文字、图片和内容（一个管理员账号）。一旦网站需要跟上业务节奏——新闻、目录、团队、优惠——它就是必然之选。年度续费：700 000 GNF。\n\n两者之间还有一座桥：定制站，按报价评估，在后台网站基础上叠加定制选项——WhatsApp 聊天机器人、销售机器人、社交版块。而要在线收款，无论哪种网站，都可选择集成支付系统（1 000 000 GNF）。\n\n我们的建议：如果内容每月更新不到一次，展示站足够；超过这个频率，带后台的方案会在节省的时间中回本。如果您还在犹豫，我们的助手对这两款产品了如指掌。",
      de: "Eine Website zu besitzen heißt nicht nur, einmal zu zahlen: Es heißt zu entscheiden, wer die Inhalte Woche für Woche am Leben hält. Das ist die eigentliche Frage zwischen unseren beiden Hauptangeboten — und sie verdient mehr als einen Blick auf den Preis.\n\nDie Auftritts-Website für 1 500 000 GNF ist Gelassenheit: Wir gestalten die Seiten, wir pflegen die Inhalte, Sie lernen kein Werkzeug. Sie passt perfekt zu Unternehmen, deren Site sich wenig ändert — ein tadelloses Bild, klare Informationen, einfacher Kontakt. Jährliche Verlängerung: 500 000 GNF.\n\nDie Website mit Dashboard für 3 500 000 GNF ist Autonomie: Sie bearbeiten Ihre Texte, Bilder und Inhalte selbst, wann immer Sie wollen, in einem Verwaltungsbereich (ein Administrator). Sie ist unerlässlich, sobald Ihre Site im Takt Ihres Unternehmens leben muss: News, Kataloge, Teams, Angebote. Jährliche Verlängerung: 700 000 GNF.\n\nZwischen beiden eine Brücke: die maßgeschneiderte Website, kalkuliert nach Angebot, die zum Dashboard individuelle Optionen ergänzt — WhatsApp-Chatbot, Verkaufs-Chatbot, Social-Media-Bereich. Und um online zu verkaufen, ist das integrierte Zahlungssystem als Option erhältlich (1 000 000 GNF), ganz gleich welche Website.\n\nUnser Rat: Bewegen sich Ihre Inhalte seltener als einmal im Monat, genügt der Auftritt; darüber hinaus amortisiert sich das Dashboard durch gewonnene Zeit. Und wenn Sie noch zögern: Unser Assistent kennt beide Angebote bis ins letzte Pixel.",
    },
  },
  {
    slug: "logiciel-de-gestion-bien-choisir",
    category: "saas",
    readingMin: 4,
    publishedAt: new Date("2026-09-14T09:00:00.000Z"),
    title: {
      fr: "Sept logiciels de gestion, un même partenaire",
      en: "Seven management software tools, one single partner",
      es: "Siete software de gestión, un mismo socio",
      zh: "七款管理软件，同一个伙伴",
      de: "Sieben Verwaltungssoftware, ein einziger Partner",
    },
    excerpt: {
      fr: "Facturation, comptabilité, hôpital, école, immobilier, pharmacie, formation : nos SaaS métiers couvrent l'essentiel — tarifs clairs, essai gratuit 7 jours.",
      en: "Invoicing, accounting, hospital, school, real estate, pharmacy, training: our business SaaS covers the essentials — clear pricing, 7-day free trial.",
      es: "Facturación, contabilidad, hospital, escuela, inmobiliaria, farmacia, formación: nuestros SaaS sectoriales cubren lo esencial — tarifas claras y prueba gratuita de 7 días.",
      zh: "开票、会计、医院、学校、物业、药店、培训：我们的行业 SaaS 覆盖核心需求——价格清晰，7 天免费试用。",
      de: "Rechnungsstellung, Buchhaltung, Krankenhaus, Schule, Immobilien, Apotheke, Schulung: unsere Branchen-SaaS decken das Wesentliche ab — klare Preise, 7 Tage kostenlos testen.",
    },
    body: {
      fr: "Quand la gestion se fait à la main — factures papier, cahiers, fichiers dispersés — chaque journée perd des heures, et chaque erreur coûte de l'argent. Un logiciel métier n'est pas un luxe : c'est la remise en ordre de votre quotidien.\n\nNotre gamme couvre les besoins les plus courants. Factura Pro, la facturation, à 100 000 GNF par mois. La gestion comptable, dès 1 000 000 GNF par mois. La gestion hospitalière, de 1 000 000 à 5 000 000 GNF par mois selon le forfait (Essentiel, Avancé, Complet). La gestion d'école, à 500 000 GNF par mois — neuf mois facturés, l'année scolaire obéit. La gestion immobilière, à 500 000 GNF par mois. Et la gestion de pharmacie, à 7 000 000 GNF par an.\n\nChaque logiciel s'essaie gratuitement pendant 7 jours, une fois par personne : vous remplissez le formulaire court, nous activons votre accès et nous vous accompagnons au téléphone pendant la prise en main. Vous préférez être guidé ? Demandez une démonstration, nous revenons vers vous sous 24 heures ouvrées.\n\nPour les centres de formation, l'outil d'administration est étudié sur devis. Et si aucun outil standard ne colle à votre métier, nous concevons des workflows sur mesure et des logiciels internes dès 20 000 000 GNF : votre manière de travailler, transformée en logiciel.\n\nUn même partenaire pour l'ensemble de vos outils de gestion : formation des équipes, support et évolutions par les mêmes personnes qui ont conçu l'outil. Commencez par un essai — c'est le moyen le plus sûr de juger.",
      en: "When management is done by hand — paper invoices, notebooks, scattered files — every day loses hours, and every mistake costs money. Business software is not a luxury: it is your daily routine put back in order.\n\nOur range covers the most common needs. Factura Pro, for invoicing, at 100,000 GNF per month. Accounting management, from 1,000,000 GNF per month. Hospital management, from 1,000,000 to 5,000,000 GNF per month depending on the package (Essential, Advanced, Complete). School management, at 500,000 GNF per month — nine months billed, as the school year dictates. Real-estate management, at 500,000 GNF per month. And pharmacy management, at 7,000,000 GNF per year.\n\nEach software can be tried free for 7 days, once per person: fill in the short form, we activate your access and support you by phone as you get started. Prefer to be guided? Request a demonstration, we get back to you within 24 working hours.\n\nFor training centres, the administration tool is studied on quote. And if no standard tool fits your trade, we design custom workflows and internal software from 20,000,000 GNF: your way of working, turned into software.\n\nOne single partner for your entire management toolbox: team training, support and evolutions handled by the same people who built the tool. Start with a trial — it is the surest way to judge.",
      es: "Cuando la gestión se hace a mano — facturas de papel, cuadernos, archivos dispersos — cada día pierde horas y cada error cuesta dinero. Un software sectorial no es un lujo: es poner orden en su diario.\n\nNuestra gama cubre las necesidades más comunes. Factura Pro, la facturación, a 100 000 GNF al mes. La gestión contable, desde 1 000 000 GNF al mes. La gestión hospitalaria, de 1 000 000 a 5 000 000 GNF al mes según el paquete (Esencial, Avanzado, Completo). La gestión escolar, a 500 000 GNF al mes — nueve meses facturados, lo manda el curso escolar. La gestión inmobiliaria, a 500 000 GNF al mes. Y la gestión de farmacia, a 7 000 000 GNF al año.\n\nCada software se prueba gratis durante 7 días, una vez por persona: rellene el formulario breve, activamos su acceso y le acompañamos por teléfono durante la puesta en marcha. ¿Prefiere que le guíen? Pida una demostración, le respondemos en menos de 24 horas laborables.\n\nPara los centros de formación, la herramienta de administración se estudia sobre presupuesto. Y si ninguna herramienta estándar encaja con su oficio, diseñamos flujos de trabajo a medida y software interno desde 20 000 000 GNF: su manera de trabajar, convertida en software.\n\nUn mismo socio para todas sus herramientas de gestión: formación de equipos, soporte y evoluciones por las mismas personas que concibieron la herramienta. Empiece por una prueba — es la manera más segura de juzgar.",
      zh: "当管理靠手工进行——纸质发票、笔记本、分散的文件——每一天都在流失时间，每一个错误都在损失金钱。行业软件不是奢侈品：它是把您的日常重新理顺。\n\n我们的产品线覆盖最常见的场景。Factura Pro 开票管理，每月 100 000 GNF。会计管理，每月 1 000 000 GNF 起。医院管理，每月 1 000 000 至 5 000 000 GNF 不等（基础、进阶、完整三种套餐）。学校管理，每月 500 000 GNF——按学年只计费 9 个月。物业管理，每月 500 000 GNF。药店管理，每年 7 000 000 GNF。\n\n每款软件都可免费试用 7 天，每人限一次：填写简短表单，我们开通账号，并在您上手期间电话陪伴。更喜欢有人引导？申请一次演示，我们会在 24 个工作小时内回复您。\n\n针对培训中心，管理工具按报价单独评估。如果没有一款标准工具契合您的行业，我们可以为您设计定制工作流和内部软件，20 000 000 GNF 起：把您的工作方式变成软件。\n\n您的全部管理工具，由同一个伙伴负责：团队培训、支持与升级，都由设计这款工具的同一批人完成。先从试用开始——这是最稳妥的判断方式。",
      de: "Wenn die Verwaltung von Hand läuft — Papierrechnungen, Hefte, verstreute Dateien — verliert jeder Tag Stunden und jeder Fehler Geld. Fachsoftware ist kein Luxus: sie bringt Ihren Alltag wieder in Ordnung.\n\nUnsere Palette deckt die häufigsten Bedürfnisse ab. Factura Pro, die Rechnungsstellung, für 100 000 GNF pro Monat. Die Buchhaltungsverwaltung, ab 1 000 000 GNF pro Monat. Das Krankenhausmanagement, je nach Paket 1 000 000 bis 5 000 000 GNF pro Monat (Essential, Advanced, Complete). Das Schulmanagement für 500 000 GNF pro Monat — neun Monate abgerechnet, das Schuljahr diktiert es. Das Immobilienmanagement für 500 000 GNF pro Monat. Und das Apothekenmanagement für 7 000 000 GNF pro Jahr.\n\nJede Software lässt sich 7 Tage kostenlos testen, einmal pro Person: Sie füllen das kurze Formular aus, wir schalten Ihren Zugang frei und begleiten Sie telefonisch beim Einstieg. Lieber geführt? Fordern Sie eine Demonstration an — wir melden uns innerhalb von 24 Arbeitsstunden.\n\nFür Ausbildungszentren wird das Verwaltungswerkzeug nach Angebot kalkuliert. Und wenn kein Standardwerkzeug zu Ihrem Gewerbe passt, entwerfen wir maßgeschneiderte Workflows und interne Software ab 20 000 000 GNF: Ihre Arbeitsweise, in Software verwandelt.\n\nEin einziger Partner für Ihr gesamtes Verwaltungswerkzeug: Schulung der Teams, Support und Weiterentwicklung durch dieselben Menschen, die das Werkzeug entworfen haben. Beginnen Sie mit einem Test — das ist der sicherste Weg zu urteilen.",
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
  console.log(`\ndone — ${created} created, ${updated} updated`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
