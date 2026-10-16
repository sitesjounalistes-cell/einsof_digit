import type { Localized } from "@/lib/page-content";

/**
 * Contenu de la page /faq — questions classées par thème.
 * Source client : 4 questions « propriété » fournies mot pour mot
 * (transparence : le client reste propriétaire de tout), complétées
 * par les questions existantes de l'agence et enrichies de questions
 * factuelles (tarifs §19, délais, maintenance, mobile).
 * Règle anti-invention : aucune promesse commerciale nouvelle.
 */

export interface FaqDetailedItem {
  q: string;
  a: string;
}

export interface FaqCategory {
  /** identifiant d'ancre (URL #propriete, etc.) */
  id: string;
  title: string;
  items: FaqDetailedItem[];
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
  cats: {
    label: string;
    title: string;
    gold: string;
    sub: string;
  };
  categories: FaqCategory[];
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
      sub: "Avant de démarrer avec nous, vous méritez des réponses claires et sans détour. Propriété, tarifs, délais, maintenance : tout est dit ici, simplement, et classé par thème.",
      chips: [
        "Propriété & indépendance",
        "Tarifs & paiement",
        "Essais & démonstrations",
        "Délais & méthode",
        "Gestion & autonomie",
        "Maintenance & suivi",
      ],
    },
    cats: {
      label: "Questions classées",
      title: "Tout est classé,",
      gold: "thème par thème.",
      sub: "Vingt réponses organisées en six thèmes : propriété, tarifs, essais, délais, gestion et maintenance. Trouvez votre question d'un coup d'œil.",
    },
    categories: [
      {
        id: "propriete",
        title: "Propriété & indépendance",
        items: [
          {
            q: "Qui est propriétaire du nom de domaine ?",
            a: "Vous. Il est enregistré à votre nom avec vos identifiants. Nous créons un nouveau compte à votre nom, puis lors de la remise vous changez vous-même le mot de passe, ajoutez votre numéro et votre e-mail de récupération, et activez la double authentification devant nous.",
          },
          {
            q: "Qui possède le site et le code ?",
            a: "Vous. Tout est livré avec les accès administrateur complets : domaine, hébergement, code et base de données.",
          },
          {
            q: "Si on arrête de travailler ensemble, garde-t-on le site ?",
            a: "Oui, à 100 %. Vous pouvez confier le site à un autre développeur sans aucun problème.",
          },
          {
            q: "Qui a le mot de passe de l'hébergement ?",
            a: "Vous, à tous les niveaux.",
          },
        ],
      },
      {
        id: "tarifs",
        title: "Tarifs & paiement",
        items: [
          {
            q: "Combien coûte un site web ?",
            a: "Le site vitrine est à 1 500 000 GNF, le site avec tableau de bord à 3 500 000 GNF, et le site customisé (options sur mesure) est chiffré sur devis. Le renouvellement annuel (nom de domaine et hébergement) est de 500 000 GNF par an pour la vitrine et de 700 000 GNF par an pour le tableau de bord. Un système de paiement intégré ajoute 1 000 000 GNF à tout forfait.",
          },
          {
            q: "Comment obtenir un devis ?",
            a: "Décrivez votre besoin via la page contact ou directement auprès de l'assistant de ce site. Nous répondons sous 24 heures ouvrées, puis nous cadrons votre projet avec vous avant de chiffrer quoi que ce soit. Vous recevez ensuite un devis détaillé et figé : les montants annoncés sont ceux que vous payez, sans surprise en cours de route.",
          },
          {
            q: "Quel est le délai de réponse et comment se passent les paiements ?",
            a: "Nous répondons sous 24 heures ouvrées. Les modalités de paiement sont définies avec l'équipe lors du devis ; le Mobile Money fait partie des moyens couramment utilisés en Guinée.",
          },
          {
            q: "Y a-t-il des frais cachés ?",
            a: "Non. Le devis est détaillé et figé : les montants annoncés sont ceux que vous payez. Le coût récurrent — le renouvellement annuel du nom de domaine et de l'hébergement, à 500 000 GNF (vitrine) ou 700 000 GNF (tableau de bord) — est annoncé dès le départ. L'ajout de nouvelles fonctionnalités fait toujours l'objet d'un devis validé avec vous avant tout travail.",
          },
        ],
      },
      {
        id: "essais",
        title: "Essais & démonstrations",
        items: [
          {
            q: "Comment fonctionne l'essai gratuit ?",
            a: "L'essai dure 7 jours sur le SaaS de votre choix. Vous remplissez un formulaire court (nom, prénom, téléphone), notre équipe vous recontacte et active votre accès. Un essai par personne et par logiciel.",
          },
          {
            q: "Puis-je voir une démonstration avant de m'engager ?",
            a: "Oui. Réservez une démo avec un conseiller via le formulaire ou l'assistant de ce site : nous vous montrons le logiciel en situation réelle et répondons à toutes vos questions.",
          },
        ],
      },
      {
        id: "delais",
        title: "Délais & méthode",
        items: [
          {
            q: "Quels sont les délais de réalisation ?",
            a: "Un site vitrine se réalise en quelques semaines, une fois vos contenus rassemblés. Pour un site avec tableau de bord ou une boutique en ligne, le délai dépend du périmètre exact : le planning annoncé au devis est celui que nous tenons. Pour un logiciel sur mesure, nous avançons par jalons, avec des démonstrations régulières qui vous permettent de voir l'avancement à chaque étape. Aucune date n'est annoncée à la légère : elle est fixée avec vous, au moment du devis.",
          },
          {
            q: "Puis-je commencer par un site puis évoluer vers un logiciel ?",
            a: "Oui, et c'est même un parcours que nous recommandons souvent. L'architecture est pensée pour évoluer : vos contenus, vos données et vos comptes peuvent être repris lors du passage à un logiciel de gestion. Chaque évolution fait l'objet d'un devis transparent, avec un périmètre et un planning clairs avant de démarrer. Vous investissez par étapes, sans jamais rien jeter.",
          },
          {
            q: "Comment suis-je l'avancement de mon projet ?",
            a: "Vous n'avez jamais à relancer pour savoir où en est votre projet. Pour un logiciel, nous avançons par jalons avec des démonstrations régulières ; pour un site, vous validez chaque grande étape — structure, design, contenus — avant la mise en ligne. Et le planning annoncé au devis est celui que nous tenons.",
          },
        ],
      },
      {
        id: "gestion",
        title: "Gestion & autonomie",
        items: [
          {
            q: "Puis-je gérer mon site moi-même ?",
            a: "Avec le site vitrine, non : les pages sont gérées par l'agence, et toute modification passe par un webmaster. Avec le site à tableau de bord, oui : vous modifiez vos contenus, votre galerie et vos pages services existantes (sans en créer de nouvelles), et vous recevez vos messages dans le tableau de bord, votre e-mail et votre WhatsApp — avec un seul espace administrateur. Les administrateurs supplémentaires font l'objet d'une tarification spécifique.",
          },
          {
            q: "Comment se passe la formation ?",
            a: "À la livraison, nous organisons une session de formation pratique avec vos équipes, sur vos vrais contenus et pas sur un exemple d'école. Les supports sont adaptés à votre activité et au niveau de chacun : prise en main guidée du tableau de bord, gestion des contenus, lecture des statistiques. Après la mise en ligne, nous restons disponibles pour répondre aux questions et compléter la formation si nécessaire.",
          },
          {
            q: "Dans quelles langues mon site sera-t-il disponible ?",
            a: "Chaque site est livré en français par défaut. La traduction en plusieurs langues est incluse dans chaque site : l'anglais, l'espagnol, le chinois et l'allemand sont disponibles, comme sur le site que vous parcourez en ce moment. Vos visiteurs basculent d'une langue à l'autre en un clic, depuis n'importe quelle page, et les contenus traduits sont validés avec vous avant la mise en ligne.",
          },
          {
            q: "Mon site sera-t-il adapté aux téléphones ?",
            a: "Oui, systématiquement. Chaque site est conçu dès le départ pour s'afficher correctement sur téléphone, tablette et ordinateur — la majorité de vos visiteurs arriveront depuis un mobile. La rapidité de chargement fait partie de nos critères de qualité, sur chaque page.",
          },
        ],
      },
      {
        id: "maintenance",
        title: "Maintenance & suivi",
        items: [
          {
            q: "La correction des bugs est-elle payante ?",
            a: "Sur un site vitrine, bugs et failles sont vérifiés sans frais pendant les 6 premiers mois, puis toutes les clés et accès vous sont remis. Sur un site avec tableau de bord et sur les logiciels, les bugs sont corrigés sans frais pendant toute la collaboration. L'ajout de nouvelles fonctionnalités est facturé en supplément — la distinction figure clairement dans nos conditions.",
          },
          {
            q: "Que se passe-t-il après la mise en ligne ?",
            a: "Sur un site vitrine, bugs et failles sont vérifiés pendant les 6 premiers mois, puis vous recevez toutes vos clés. Sur un site avec tableau de bord, nous continuons à corriger les bugs pendant toute la collaboration. Le nom de domaine et l'hébergement sont renouvelés chaque année — 500 000 GNF (vitrine) ou 700 000 GNF (tableau de bord) — pour garantir la continuité de votre site. Les nouvelles fonctionnalités sont étudiées sur devis.",
          },
          {
            q: "Que comprend le renouvellement annuel ?",
            a: "Le nom de domaine et l'hébergement de votre site : 500 000 GNF par an pour un site vitrine, 700 000 GNF par an pour un site avec tableau de bord. Sans ce renouvellement, le domaine et l'hébergement expirent ; c'est le seul coût récurrent, annoncé dès le devis.",
          },
        ],
      },
    ],
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
      sub: "Before starting with us, you deserve clear, straight answers. Ownership, pricing, timelines, maintenance: everything is said here, simply, and sorted by theme.",
      chips: [
        "Ownership & independence",
        "Pricing & payment",
        "Trials & demos",
        "Timelines & method",
        "Management & autonomy",
        "Maintenance & follow-up",
      ],
    },
    cats: {
      label: "Categorised questions",
      title: "Everything is sorted,",
      gold: "theme by theme.",
      sub: "Twenty answers organised into six themes: ownership, pricing, trials, timelines, management and maintenance. Find your question at a glance.",
    },
    categories: [
      {
        id: "propriete",
        title: "Ownership & independence",
        items: [
          {
            q: "Who owns the domain name?",
            a: "You do. It is registered in your name with your own credentials. We create a new account in your name, then at handover you change the password yourself, add your recovery phone number and email, and enable two-factor authentication in front of us.",
          },
          {
            q: "Who owns the website and the code?",
            a: "You do. Everything is delivered with full administrator access: domain, hosting, code and database.",
          },
          {
            q: "If we stop working together, do we keep the website?",
            a: "Yes, 100%. You can hand the site over to another developer without any problem.",
          },
          {
            q: "Who has the hosting password?",
            a: "You, at every level.",
          },
        ],
      },
      {
        id: "tarifs",
        title: "Pricing & payment",
        items: [
          {
            q: "How much does a website cost?",
            a: "Three offers: showcase site at 1,500,000 GNF, site with dashboard at 2,500,000 GNF and online store at 3,500,000 GNF. Annual renewal (domain and hosting) is 500,000 GNF per year.",
          },
          {
            q: "How do I get a quote?",
            a: "Describe your need through the contact page or directly to the assistant of this website. We answer within 24 business hours, then we frame your project with you before pricing anything. You then receive a detailed and frozen quote: the announced amounts are the ones you pay, with no surprises along the way.",
          },
          {
            q: "What is the response time and how do payments work?",
            a: "We reply within 24 working hours. Payment terms are defined with the team during the quote; Mobile Money is among the commonly used means in Guinea.",
          },
          {
            q: "Are there any hidden fees?",
            a: "No. The quote is detailed and frozen: the announced amounts are the ones you pay. The only recurring cost — the annual renewal of the domain name and hosting, at 500,000 GNF — is announced from the start. Any new feature is always quoted and validated with you before any work begins.",
          },
        ],
      },
      {
        id: "essais",
        title: "Trials & demos",
        items: [
          {
            q: "How does the free trial work?",
            a: "The trial lasts 7 days on the SaaS of your choice. Fill in a short form (first name, last name, phone), our team contacts you and activates your access. One trial per person and per product.",
          },
          {
            q: "Can I see a demo before committing?",
            a: "Yes. Book a demo with an advisor via the form or this site's assistant: we show you the software in real conditions and answer all your questions.",
          },
        ],
      },
      {
        id: "delais",
        title: "Timelines & method",
        items: [
          {
            q: "What are the delivery timelines?",
            a: "A showcase website takes a few weeks, once your content has been gathered. For a website with a dashboard or an online store, the timeline depends on the exact scope: the schedule announced in the quote is the one we keep. For custom software, we move forward in milestones, with regular demonstrations so you can see the progress at every stage. No date is ever announced lightly: it is set with you, at the time of the quote.",
          },
          {
            q: "Can I start with a website then move to a software?",
            a: "Yes, and it is actually a path we often recommend. The architecture is designed to evolve: your content, your data and your accounts can be carried over when moving to a management software. Every evolution comes with a transparent quote, with a clear scope and schedule before starting. You invest step by step, without ever throwing anything away.",
          },
          {
            q: "How do I follow the progress of my project?",
            a: "You never have to chase us to know where your project stands. For software, we move in milestones with regular demonstrations; for a website, you validate each major step — structure, design, content — before going live. And the schedule announced in the quote is the one we keep.",
          },
        ],
      },
      {
        id: "gestion",
        title: "Management & autonomy",
        items: [
          {
            q: "Can I manage my website myself?",
            a: "Yes, except for the simple showcase plan. The included dashboard lets you manage about 70% of your site: editing agency-created pages, content and images. A single administrator; multi-administrator on quote.",
          },
          {
            q: "How does the training work?",
            a: "At delivery, we organize a hands-on training session with your teams, on your real content and not on a textbook example. The materials are adapted to your activity and to everyone's level: guided handling of the dashboard, content management, reading the statistics. After going live, we remain available to answer questions and complete the training if needed.",
          },
          {
            q: "In which languages will my website be available?",
            a: "Every website is delivered in French by default. Translation into several languages is included in every website: English, Spanish, Chinese and German are available, just like on the website you are browsing right now. Your visitors switch from one language to another in one click, from any page, and the translated content is validated with you before going live.",
          },
          {
            q: "Will my website work well on phones?",
            a: "Yes, always. Every website is designed from the ground up to display properly on phones, tablets and computers — most of your visitors will arrive from a mobile. Fast loading is part of our quality criteria on every page.",
          },
        ],
      },
      {
        id: "maintenance",
        title: "Maintenance & follow-up",
        items: [
          {
            q: "Are bug fixes charged?",
            a: "No. Bugs, flaws and errors are fixed free of charge for the entire collaboration. New features, however, are billed separately — the distinction is clearly stated in our terms.",
          },
          {
            q: "What happens after the launch?",
            a: "Bugs, vulnerabilities and errors are fixed free of charge throughout the collaboration — it is written in black and white in our terms. The domain name and hosting are renewed every year for 500,000 GNF, which guarantees the continuity of your website. New features and evolutions are studied on quote, so you always know what is included and what is billed.",
          },
          {
            q: "What does the annual renewal include?",
            a: "For 500,000 GNF per year, your domain name and hosting are renewed, which guarantees the continuity of your website. It is the only recurring cost; everything else is detailed in the quote, with no surprises.",
          },
        ],
      },
    ],
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
      sub: "Antes de empezar con nosotros, merece respuestas claras y directas. Propiedad, tarifas, plazos, mantenimiento: todo está dicho aquí, de forma sencilla, y clasificado por temas.",
      chips: [
        "Propiedad e independencia",
        "Tarifas y pago",
        "Pruebas y demostraciones",
        "Plazos y método",
        "Gestión y autonomía",
        "Mantenimiento y seguimiento",
      ],
    },
    cats: {
      label: "Preguntas clasificadas",
      title: "Todo está clasificado,",
      gold: "tema por tema.",
      sub: "Veinte respuestas organizadas en seis temas: propiedad, tarifas, pruebas, plazos, gestión y mantenimiento. Encuentre su pregunta de un vistazo.",
    },
    categories: [
      {
        id: "propriete",
        title: "Propiedad e independencia",
        items: [
          {
            q: "¿Quién es el propietario del nombre de dominio?",
            a: "Usted. Está registrado a su nombre con sus credenciales. Creamos una nueva cuenta a su nombre y, en la entrega, usted mismo cambia la contraseña, añade su número y su correo de recuperación, y activa la doble autenticación delante de nosotros.",
          },
          {
            q: "¿Quién posee el sitio y el código?",
            a: "Usted. Todo se entrega con los accesos de administrador completos: dominio, alojamiento, código y base de datos.",
          },
          {
            q: "Si dejamos de trabajar juntos, ¿conservamos el sitio?",
            a: "Sí, al 100 %. Puede confiar el sitio a otro desarrollador sin ningún problema.",
          },
          {
            q: "¿Quién tiene la contraseña del alojamiento?",
            a: "Usted, en todos los niveles.",
          },
        ],
      },
      {
        id: "tarifs",
        title: "Tarifas y pago",
        items: [
          {
            q: "¿Cuánto cuesta un sitio web?",
            a: "Tres ofertas: sitio de presentación a 1 500 000 GNF, sitio con panel de administración a 2 500 000 GNF y tienda en línea a 3 500 000 GNF. La renovación anual (nombre de dominio y alojamiento) es de 500 000 GNF al año.",
          },
          {
            q: "¿Cómo obtener un presupuesto?",
            a: "Describa su necesidad a través de la página de contacto o directamente al asistente de este sitio. Respondemos en 24 horas laborables y, después, delimitamos su proyecto con usted antes de calcular cualquier importe. A continuación recibe un presupuesto detallado y cerrado: los importes anunciados son los que paga, sin sorpresas por el camino.",
          },
          {
            q: "¿Cuál es el plazo de respuesta y cómo son los pagos?",
            a: "Respondemos en un plazo de 24 horas laborables. Las modalidades de pago se definen con el equipo durante el presupuesto; el Mobile Money es uno de los medios más habituales en Guinea.",
          },
          {
            q: "¿Hay costes ocultos?",
            a: "No. El presupuesto es detallado y cerrado: los importes anunciados son los que paga. El único coste recurrente — la renovación anual del dominio y del alojamiento, 500 000 GNF — se anuncia desde el principio. Cualquier nueva funcionalidad se presupuesta y se valida con usted antes de empezar a trabajar.",
          },
        ],
      },
      {
        id: "essais",
        title: "Pruebas y demostraciones",
        items: [
          {
            q: "¿Cómo funciona la prueba gratuita?",
            a: "La prueba dura 7 días en el SaaS que elijas. Rellenas un formulario breve (nombre, apellido, teléfono), nuestro equipo te contacta y activa tu acceso. Una prueba por persona y por software.",
          },
          {
            q: "¿Puedo ver una demostración antes de comprometerme?",
            a: "Sí. Reserva una demo con un asesor a través del formulario o del asistente de este sitio: te mostramos el software en situación real y respondemos a todas tus preguntas.",
          },
        ],
      },
      {
        id: "delais",
        title: "Plazos y método",
        items: [
          {
            q: "¿Cuáles son los plazos de realización?",
            a: "Un sitio vitrina se realiza en unas semanas, una vez reunidos sus contenidos. Para un sitio con panel de control o una tienda en línea, el plazo depende del alcance exacto: el calendario anunciado en el presupuesto es el que cumplimos. Para un software a medida, avanzamos por hitos, con demostraciones regulares que le permiten ver el avance en cada etapa. Ninguna fecha se anuncia a la ligera: se fija con usted, en el momento del presupuesto.",
          },
          {
            q: "¿Puedo empezar con un sitio y evolucionar hacia un software?",
            a: "Sí, y de hecho es un camino que recomendamos a menudo. La arquitectura está pensada para evolucionar: sus contenidos, datos y cuentas pueden retomarse al pasar a un software de gestión. Cada evolución cuenta con un presupuesto transparente, con un alcance y un calendario claros antes de empezar. Invierte por etapas, sin tirar nunca nada.",
          },
          {
            q: "¿Cómo sigo el avance de mi proyecto?",
            a: "Nunca tiene que insistir para saber en qué punto está su proyecto. Para un software, avanzamos por hitos con demostraciones regulares; para un sitio, usted valida cada gran etapa — estructura, diseño, contenidos — antes de la puesta en línea. Y el calendario anunciado en el presupuesto es el que cumplimos.",
          },
        ],
      },
      {
        id: "gestion",
        title: "Gestión y autonomía",
        items: [
          {
            q: "¿Puedo gestionar mi sitio web yo mismo?",
            a: "Sí, salvo en el plan de presentación simple. El panel de administración incluido te permite gestionar alrededor del 70 % de tu sitio web: modificación de las páginas creadas por la agencia, contenidos, imágenes. Un único administrador; el multiadministrador es a consultar.",
          },
          {
            q: "¿Cómo se desarrolla la formación?",
            a: "En la entrega, organizamos una sesión de formación práctica con sus equipos, sobre sus contenidos reales y no sobre un ejemplo de manual. Los soportes se adaptan a su actividad y al nivel de cada uno: manejo guiado del panel de control, gestión de contenidos, lectura de las estadísticas. Tras la puesta en línea, seguimos disponibles para responder preguntas y completar la formación si es necesario.",
          },
          {
            q: "¿En qué idiomas estará disponible mi sitio?",
            a: "Cada sitio se entrega en francés por defecto. La traducción a varios idiomas está incluida en cada sitio: inglés, español, chino y alemán están disponibles, como en el sitio que está navegando ahora mismo. Sus visitantes cambian de idioma con un clic, desde cualquier página, y los contenidos traducidos se validan con usted antes de la puesta en línea.",
          },
          {
            q: "¿Mi sitio funcionará bien en teléfonos?",
            a: "Sí, siempre. Cada sitio está diseñado desde el origen para mostrarse correctamente en teléfono, tableta y ordenador — la mayoría de sus visitantes llegarán desde un móvil. La velocidad de carga forma parte de nuestros criterios de calidad en cada página.",
          },
        ],
      },
      {
        id: "maintenance",
        title: "Mantenimiento y seguimiento",
        items: [
          {
            q: "¿La corrección de bugs es de pago?",
            a: "No. Los bugs, fallos y errores se corrigen sin coste durante toda la colaboración. En cambio, la adición de nuevas funcionalidades se factura como suplemento — la distinción figura claramente en nuestras condiciones.",
          },
          {
            q: "¿Qué ocurre después de la puesta en línea?",
            a: "Los bugs, fallos y errores se corrigen de forma gratuita durante toda la colaboración — está escrito en negro sobre blanco en nuestras condiciones. El nombre de dominio y el alojamiento se renuevan cada año por 500 000 GNF, lo que garantiza la continuidad de su sitio. Las nuevas funcionalidades y evoluciones se estudian mediante presupuesto, para que siempre sepa qué está incluido y qué se factura.",
          },
          {
            q: "¿Qué incluye la renovación anual?",
            a: "Por 500 000 GNF al año se renuevan su nombre de dominio y su alojamiento, lo que garantiza la continuidad de su sitio. Es el único coste recurrente; todo lo demás figura en el presupuesto, sin sorpresas.",
          },
        ],
      },
    ],
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
      sub: "在与我们合作之前，您理应得到清晰、直接的答案。所有权、价格、工期、维护：所有内容都在这里，用最简单的方式说明，并按主题分类。",
      chips: [
        "所有权与独立自主",
        "价格与付款",
        "试用与演示",
        "工期与方法",
        "管理与自主",
        "维护与跟进",
      ],
    },
    cats: {
      label: "分类问题",
      title: "所有问题都已分类，",
      gold: "一个主题接一个主题。",
      sub: "二十个答案按六个主题整理：所有权、价格、试用、工期、管理与维护。一眼找到您的问题。",
    },
    categories: [
      {
        id: "propriete",
        title: "所有权与独立自主",
        items: [
          {
            q: "域名的所有者是谁？",
            a: "是您。域名以您的名义注册，使用您自己的账户凭据。我们会以您的名义新建一个账户；在交付时，您亲自修改密码、添加您的恢复手机号和邮箱，并当着我们的面开启双重验证。",
          },
          {
            q: "网站和代码归谁所有？",
            a: "归您所有。交付时提供完整的管理员权限：域名、托管、代码与数据库。",
          },
          {
            q: "如果停止合作，网站还归我们吗？",
            a: "当然，100% 归您。您可以毫无问题地把网站交给其他开发者。",
          },
          {
            q: "托管的密码在谁手里？",
            a: "在您手里，所有层级都是。",
          },
        ],
      },
      {
        id: "tarifs",
        title: "价格与付款",
        items: [
          {
            q: "建一个网站需要多少钱？",
            a: "三种方案：展示型网站1 500 000 GNF、带管理后台的网站2 500 000 GNF、在线商城3 500 000 GNF。年度续费（域名与托管）为每年500 000 GNF。",
          },
          {
            q: "如何获得报价？",
            a: "通过联系页面或本网站的助手描述您的需求。我们在 24 个工作小时内回复，然后在计算任何金额之前与您一起梳理项目范围。随后您会收到一份详细且锁定的报价：公布的金额就是您支付的金额，过程中没有任何意外。",
          },
          {
            q: "响应时间是多久，如何付款？",
            a: "我们在24个工作小时内回复。付款方式在报价阶段与团队商定；移动支付（Mobile Money）是几内亚常用的支付方式之一。",
          },
          {
            q: "有隐藏费用吗？",
            a: "没有。报价单详细且锁定：公布的金额就是您支付的金额。唯一一项周期性费用——域名与托管的年度续费（500 000 GNF）——从一开始就会明确告知。任何新增功能都会先与您确认报价，然后才开工。",
          },
        ],
      },
      {
        id: "essais",
        title: "试用与演示",
        items: [
          {
            q: "免费试用如何运作？",
            a: "试用期为7天，可任选一款SaaS。您填写一份简短表单（姓氏、名字、电话），我们的团队会与您联系并开通权限。每人每款软件限一次试用。",
          },
          {
            q: "签约前可以先看演示吗？",
            a: "可以。通过表单或本站助手预约顾问演示：我们将在真实使用场景中为您展示软件，并解答您的所有问题。",
          },
        ],
      },
      {
        id: "delais",
        title: "工期与方法",
        items: [
          {
            q: "项目交付需要多长时间？",
            a: "展示型网站在内容齐备后几周内即可完成。对于带管理后台的网站或在线商城，工期取决于具体范围：报价单上公布的计划就是我们承诺遵守的计划。对于定制软件，我们按里程碑推进，并通过定期演示让您在每个阶段都能看到进展。任何日期都不是随口承诺：它是在报价时与您共同确定的。",
          },
          {
            q: "我可以先做网站，之后再升级为管理软件吗？",
            a: "可以，这也是我们经常推荐的路径。整体架构为演进而设计：您的数据与账户在过渡到管理软件时可以直接迁移。每次升级都会提供透明的报价，启动之前就有明确的范围与计划。您按阶段投入，不会浪费任何已有的成果。",
          },
          {
            q: "我如何跟进项目进展？",
            a: "您无需反复追问项目进展。定制软件我们按里程碑推进并定期演示；网站项目则由您逐一确认每个重要环节——结构、设计、内容——然后再上线。报价时公布的计划就是我们遵守的计划。",
          },
        ],
      },
      {
        id: "gestion",
        title: "管理与自主",
        items: [
          {
            q: "我可以自己管理网站吗？",
            a: "可以，纯展示型套餐除外。随附的管理后台让您能管理约70%的网站：修改机构创建的页面、内容与图片。仅限一名管理员；多管理员按需报价。",
          },
          {
            q: "培训是如何进行的？",
            a: "交付时，我们会与您的团队进行一次实操培训，使用的是您的真实内容，而不是教科书式的示例。培训资料会根据您的业务和每个人的水平进行调整：后台管理的引导式上手、内容管理、数据统计的解读。上线之后，我们仍会随时解答问题，并在需要时补充培训。",
          },
          {
            q: "我的网站会支持哪些语言？",
            a: "每个网站默认以法语交付。多语言翻译包含在每个网站中：英语、西班牙语、中文和德语均可提供，正如您正在浏览的这个网站。访问者在任意页面都可一键切换语言，翻译内容会在上线前与您一起确认。",
          },
          {
            q: "我的网站在手机上好用吗？",
            a: "当然，所有网站都如此。每个网站从设计之初就确保在手机、平板和电脑上正常显示——您的大多数访客都会通过手机访问。页面加载速度是我们的质量标准之一。",
          },
        ],
      },
      {
        id: "maintenance",
        title: "维护与跟进",
        items: [
          {
            q: "漏洞修复是否收费？",
            a: "不收费。漏洞、缺陷与错误在整个合作期内免费修复。但新增功能另行计费——该区别在我们的条款中有清晰说明。",
          },
          {
            q: "上线之后会发生什么？",
            a: "在合作期间，漏洞、缺陷和错误全部免费修复——这一点在我们的条款中白纸黑字写明。域名与托管每年续费 500 000 几内亚法郎，以保障您网站的连续性。新功能与升级按报价单处理，让您始终清楚哪些已包含、哪些另行计费。",
          },
          {
            q: "年度续费包含什么？",
            a: "每年 500 000 GNF，用于续订您的域名与托管，保障网站的连续运行。这是唯一的周期性费用；其余一切都在报价单中写明，没有意外。",
          },
        ],
      },
    ],
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
      sub: "Bevor Sie mit uns starten, verdienen Sie klare, ungeschönte Antworten. Eigentum, Preise, Fristen, Wartung: Alles steht hier, einfach gesagt und nach Themen geordnet.",
      chips: [
        "Eigentum & Unabhängigkeit",
        "Preise & Zahlung",
        "Testphase & Demonstrationen",
        "Fristen & Methode",
        "Verwaltung & Eigenständigkeit",
        "Wartung & Betreuung",
      ],
    },
    cats: {
      label: "Kategorisierte Fragen",
      title: "Alles ist sortiert,",
      gold: "Thema für Thema.",
      sub: "Zwanzig Antworten in sechs Themen geordnet: Eigentum, Preise, Testphasen, Fristen, Verwaltung und Wartung. Finden Sie Ihre Frage auf einen Blick.",
    },
    categories: [
      {
        id: "propriete",
        title: "Eigentum & Unabhängigkeit",
        items: [
          {
            q: "Wem gehört der Domainname?",
            a: "Ihnen. Er wird auf Ihren Namen mit Ihren Zugangsdaten registriert. Wir erstellen ein neues Konto auf Ihren Namen; bei der Übergabe ändern Sie selbst das Passwort, hinterlegen Ihre Handynummer und Ihre Wiederherstellungs-E-Mail und aktivieren vor unseren Augen die Zweifaktorauthentifizierung.",
          },
          {
            q: "Wem gehören die Website und der Code?",
            a: "Ihnen. Alles wird mit vollständigen Administrator-Zugängen übergeben: Domain, Hosting, Code und Datenbank.",
          },
          {
            q: "Wenn wir die Zusammenarbeit beenden, behalten wir dann die Website?",
            a: "Ja, zu 100 %. Sie können die Website ohne Probleme einem anderen Entwickler anvertrauen.",
          },
          {
            q: "Wer hat das Hosting-Passwort?",
            a: "Sie — auf jeder Ebene.",
          },
        ],
      },
      {
        id: "tarifs",
        title: "Preise & Zahlung",
        items: [
          {
            q: "Was kostet eine Website?",
            a: "Drei Angebote: Präsentationswebsite für 1 500 000 GNF, Website mit Dashboard für 2 500 000 GNF und Online-Shop für 3 500 000 GNF. Die jährliche Verlängerung (Domain und Hosting) kostet 500 000 GNF pro Jahr.",
          },
          {
            q: "Wie erhalte ich ein Angebot?",
            a: "Beschreiben Sie Ihr Anliegen über die Kontaktseite oder direkt dem Assistenten dieser Website. Wir antworten innerhalb von 24 Werktstunden und stecken Ihr Projekt mit Ihnen ab, bevor irgendwelche Beträge berechnet werden. Anschließend erhalten Sie ein detailliertes und festgeschriebenes Angebot: Die angekündigten Beträge sind die, die Sie zahlen — ohne Überraschungen.",
          },
          {
            q: "Wie schnell erfolgt die Antwort und wie laufen die Zahlungen ab?",
            a: "Wir antworten innerhalb von 24 Arbeitsstunden. Die Zahlungsmodalitäten werden im Angebot mit dem Team vereinbart; Mobile Money zählt zu den in Guinea gängigen Zahlungsmitteln.",
          },
          {
            q: "Gibt es versteckte Kosten?",
            a: "Nein. Das Angebot ist detailliert und festgeschrieben: Die angekündigten Beträge sind die, die Sie zahlen. Die einzige wiederkehrende Kostenposition — die jährliche Verlängerung von Domain und Hosting für 500 000 GNF — wird von Anfang an genannt. Jede neue Funktion wird vor Arbeitsbeginn angeboten und mit Ihnen abgestimmt.",
          },
        ],
      },
      {
        id: "essais",
        title: "Testphase & Demonstrationen",
        items: [
          {
            q: "Wie funktioniert der kostenlose Test?",
            a: "Der Test dauert 7 Tage auf der SaaS Ihrer Wahl. Sie füllen ein kurzes Formular aus (Vorname, Nachname, Telefon), unser Team meldet sich und schaltet Ihren Zugang frei. Ein Test pro Person und pro Software.",
          },
          {
            q: "Kann ich mich vor einer Verpflichtung eine Demonstration ansehen?",
            a: "Ja. Buchen Sie eine Demo mit einem Berater über das Formular oder den Assistenten dieser Website: Wir zeigen Ihnen die Software unter realen Bedingungen und beantworten alle Ihre Fragen.",
          },
        ],
      },
      {
        id: "delais",
        title: "Fristen & Methode",
        items: [
          {
            q: "Wie lang sind die Umsetzungsfristen?",
            a: "Eine Showcase-Website entsteht in wenigen Wochen, sobald Ihre Inhalte zusammengetragen sind. Bei einer Website mit Dashboard oder einem Onlineshop hängt die Frist vom genauen Umfang ab: Der im Angebot angekündigte Zeitplan ist der, den wir einhalten. Bei Individualsoftware arbeiten wir in Meilensteinen, mit regelmäßigen Demonstrationen, damit Sie den Fortschritt in jeder Phase sehen. Kein Termin wird leichtfertig genannt: Er wird mit Ihnen im Moment des Angebots festgelegt.",
          },
          {
            q: "Kann ich mit einer Website beginnen und später zu einer Software wechseln?",
            a: "Ja — das ist sogar ein Weg, den wir oft empfehlen. Die Architektur ist auf Weiterentwicklung ausgelegt: Ihre Inhalte, Daten und Konten können beim Übergang zu einer Verwaltungssoftware übernommen werden. Jede Erweiterung erhält ein transparentes Angebot mit klarem Umfang und Zeitplan vor dem Start. Sie investieren schrittweise und verwerfen nie etwas.",
          },
          {
            q: "Wie verfolge ich den Fortschritt meines Projekts?",
            a: "Sie müssen nie nachfragen, wo Ihr Projekt steht. Bei Software arbeiten wir in Meilensteinen mit regelmäßigen Demonstrationen; bei einer Website geben Sie jede große Etappe frei — Struktur, Design, Inhalte — bevor sie live geht. Und der im Angebot angekündigte Zeitplan ist der, den wir einhalten.",
          },
        ],
      },
      {
        id: "gestion",
        title: "Verwaltung & Eigenständigkeit",
        items: [
          {
            q: "Kann ich meine Website selbst verwalten?",
            a: "Ja, außer beim einfachen Präsentationspaket. Das enthaltene Dashboard erlaubt Ihnen, etwa 70 % Ihrer Website selbst zu verwalten: Seiten, die die Agentur erstellt hat, Inhalte, Bilder. Ein Administrator; Multi-Admin auf Angebot.",
          },
          {
            q: "Wie läuft die Schulung ab?",
            a: "Bei der Auslieferung organisieren wir eine praktische Schulungssession mit Ihren Teams — an Ihren echten Inhalten, nicht an einem Schulbeispiel. Die Unterlagen passen sich Ihrer Tätigkeit und dem Niveau jedes Einzelnen an: geführte Einführung ins Dashboard, Inhaltsverwaltung, Lesen der Statistiken. Nach dem Go-live bleiben wir erreichbar, um Fragen zu beantworten und die Schulung bei Bedarf zu ergänzen.",
          },
          {
            q: "In welchen Sprachen wird meine Website verfügbar sein?",
            a: "Jede Website wird standardmäßig auf Französisch ausgeliefert. Die Übersetzung in mehrere Sprachen ist in jeder Website enthalten: Englisch, Spanisch, Chinesisch und Deutsch stehen zur Verfügung — genau wie auf der Website, die Sie gerade lesen. Ihre Besucher wechseln mit einem Klick die Sprache, auf jeder Seite, und die übersetzten Inhalte werden vor dem Go-live mit Ihnen abgestimmt.",
          },
          {
            q: "Funktioniert meine Website gut auf Handys?",
            a: "Ja, grundsätzlich. Jede Website wird von Anfang an so entworfen, dass sie auf Handy, Tablet und Computer korrekt angezeigt wird — die meisten Ihrer Besucher kommen per Mobilgerät. Die Ladegeschwindigkeit gehört auf jeder Seite zu unseren Qualitätskriterien.",
          },
        ],
      },
      {
        id: "maintenance",
        title: "Wartung & Betreuung",
        items: [
          {
            q: "Ist die Fehlerbehebung kostenpflichtig?",
            a: "Nein. Bugs, Schwachstellen und Fehler werden während der gesamten Zusammenarbeit kostenlos behoben. Neue Funktionen werden dagegen separat abgerechnet — der Unterschied steht klar in unseren Bedingungen.",
          },
          {
            q: "Was passiert nach dem Go-live?",
            a: "Bugs, Schwachstellen und Fehler werden während der gesamten Zusammenarbeit kostenlos behoben — das steht schwarz auf weiß in unseren Bedingungen. Domain und Hosting werden jährlich für 500 000 GNF erneuert, was die Kontinuität Ihrer Website garantiert. Neue Funktionen und Weiterentwicklungen werden auf Angebotsbasis geprüft, damit Sie immer wissen, was enthalten ist und was berechnet wird.",
          },
          {
            q: "Was umfasst die jährliche Verlängerung?",
            a: "Für 500 000 GNF pro Jahr werden Domain und Hosting verlängert — das garantiert die Kontinuität Ihrer Website. Es ist die einzige wiederkehrende Position; alles andere steht im Angebot, ohne Überraschungen.",
          },
        ],
      },
    ],
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
