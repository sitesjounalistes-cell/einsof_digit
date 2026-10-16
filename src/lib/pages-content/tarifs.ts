import type { Localized } from "@/lib/page-content";

/**
 * Contenu de la page /tarifs — organisé PAR SERVICE pour zéro confusion :
 * sites web, logiciels & applications, SaaS de gestion, community
 * management, acquisition client, formations.
 * Aucun montant n'est déclaré ici : les prix sont TOUJOURS rendus par
 * PriceTag à partir des PriceOffer de src/lib/catalog.ts (WEB_OFFERS,
 * WEB_RENEWALS, WEB_PAYMENT_ADDON, SOFTWARE_OFFERS, COMMUNITY_OFFERS,
 * ACQUISITION_OFFERS, TRAINING_OFFERS). Les cartes détaillées sont
 * reliées au catalogue par l'id d'offre.
 */

export interface TarifCard {
  /** id d'offre dans src/lib/catalog.ts */
  id: string;
  title: string;
  desc: string;
  /** points détaillés affichés sous la description */
  features: string[];
}

export interface TarifsContent {
  hero: {
    label: string;
    title: string;
    gold: string;
    sub: string;
    chips: string[];
  };
  groups: {
    web: {
      sub: string;
      cards: TarifCard[];
      renewalsTitle: string;
      renewals: { id: string; title: string; desc: string }[];
      addon: { id: string; title: string; desc: string };
      optionsTitle: string;
      options: string[];
      includedTitle: string;
      included: string[];
      notesTitle: string;
      notes: string[];
    };
    software: {
      sub: string;
      cards: TarifCard[];
      note: string;
    };
    saas: {
      sub: string;
      workflowsTitle: string;
      workflowsDesc: string;
    };
    community: {
      sub: string;
      cards: TarifCard[];
      note: string;
    };
    acquisition: {
      sub: string;
      cards: TarifCard[];
      note: string;
    };
    training: {
      sub: string;
      subjectsTitle: string;
      subjects: string[];
      cards: TarifCard[];
      note: string;
    };
    strategy: {
      sub: string;
    };
  };
  faq: {
    label: string;
    title: string;
    gold: string;
    sub: string;
    items: { q: string; a: string }[];
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

export const TARIFS: Localized<TarifsContent> = {
  fr: {
    hero: {
      label: "06 — Tarifs",
      title: "Des prix clairs,",
      gold: "annoncés d'avance.",
      sub: "Tous les montants sont en francs guinéens (GNF), tels que communiqués par l'agence. Parcourez chaque service : le tarif, ce qu'il inclut et ses conditions sont affichés noir sur blanc.",
      chips: [
        "Montants en GNF",
        "« À partir de » explicite",
        "Renouvellement dès 500 000 GNF/an",
      ],
    },
    groups: {
      web: {
        sub: "Trois catégories de sites, paiement unique à la livraison. Le SEO et l'indexation Google sont pris en charge sur tous nos sites.",
        cards: [
          {
            id: "web-vitrine",
            title: "Site web vitrine",
            desc: "Votre présence en ligne complète, conçue et gérée par l'agence — sans tableau de bord : pour toute modification, vous faites appel à un webmaster.",
            features: [
              "Nom de domaine et hébergement",
              "Deux adresses e-mail professionnelles",
              "Chatbot IA intégré, alimenté par le contenu du site",
              "Pages accueil, à propos, services, contact, galerie",
              "Page boutique en option (affichage des produits)",
              "Capture de leads : formulaire envoyé à votre e-mail",
              "Pages supplémentaires à la demande (structures niveau 1, 2, 3)",
              "SEO et indexation Google pris en charge",
              "Bugs et failles vérifiés pendant les 6 premiers mois, puis remise de toutes vos clés et accès",
            ],
          },
          {
            id: "web-dashboard",
            title: "Site web avec tableau de bord",
            desc: "Tout le site vitrine, plus votre tableau de bord : vous gérez vous-même vos contenus, recevez vos messages et mesurez votre portée.",
            features: [
              "Tout ce que le site vitrine inclut",
              "Un seul espace administrateur (administrateurs supplémentaires : tarification spécifique)",
              "Galerie : sections, catégories, sous-catégories, images et vidéos",
              "Pages services modifiables ou masquables — sans création de nouvelles pages services",
              "Pages accueil et à propos entièrement modifiables (sans ajout de boutons)",
              "Messages du site reçus trois fois : tableau de bord, e-mail et WhatsApp",
              "Site téléchargeable comme une application",
              "Blog : 1 article par mois, 12 intégrés — au-delà, facturation supplémentaire",
              "Notifications envoyées aux lecteurs à chaque nouvel article",
              "Fonction Publicité : notification push à tous les utilisateurs de votre application",
              "Statistiques : téléchargements de l'application et consultations des notifications",
              "Bugs pris en charge pendant toute la collaboration",
            ],
          },
          {
            id: "web-custom",
            title: "Site web customisé",
            desc: "Le site à tableau de bord, enrichi des options de votre choix — configuré ensemble, chiffré sur devis.",
            features: [
              "Toutes les fonctionnalités du site à tableau de bord",
              "Chatbot WhatsApp pour rester en contact constant avec vos clients",
              "Chatbot conversationnel entraîné pour la vente — un commercial en ligne qui vend, réserve des rendez-vous et alimente votre tableau de bord",
              "Tableau de bord renforcé",
              "Section « réseau social » : vos publications (vidéos, articles, photos) visibles par les utilisateurs de votre application",
              "Articles de blog accélérés : 3 ou 5 par mois, ou sur mesure (en supplément)",
              "Toute fonctionnalité supplémentaire à la demande",
            ],
          },
        ],
        renewalsTitle: "Renouvellement annuel — nom de domaine et hébergement",
        renewals: [
          {
            id: "web-renewal-vitrine",
            title: "Site vitrine",
            desc: "Chaque année, le renouvellement du domaine et de l'hébergement assure la continuité de votre site.",
          },
          {
            id: "web-renewal-dashboard",
            title: "Site avec tableau de bord",
            desc: "Chaque année, le renouvellement du domaine et de l'hébergement assure la continuité de votre site.",
          },
        ],
        addon: {
          id: "web-payment-addon",
          title: "Système de paiement intégré",
          desc: "Sur demande, nous intégrons un système de paiement sur n'importe quel site : 1 000 000 GNF en supplément du forfait — vitrine (2 500 000 GNF au total) comme tableau de bord (4 500 000 GNF au total).",
        },
        optionsTitle: "Options & précisions",
        options: [
          "Pages supplémentaires pour tous les types de sites : structures de niveau 1, 2 et 3 — une page service, une sous-page par service, puis les sous-pages détaillées",
          "Espaces spécialisés selon votre activité : recrutement, soumission de données, programmes et activités d'une école…",
          "Administrateurs supplémentaires : tarification spécifique — le forfait tableau de bord inclut un seul espace administrateur",
          "Si vous récupérez le code pour changer de développeur, la gestion des bugs et de la maintenance vous appartient",
        ],
        includedTitle: "Inclus dans chaque site web",
        included: [
          "Nom de domaine et hébergement",
          "Deux adresses e-mail professionnelles",
          "Chatbot IA alimenté par le contenu du site",
          "Formulaires de capture de contacts (redirigés vers votre e-mail)",
          "SEO et indexation Google",
          "Mode clair et sombre, site multilingue",
        ],
        notesTitle: "Conditions & clauses",
        notes: [
          "Bugs et failles : vérifiés sans frais pendant les 6 premiers mois sur un site vitrine, puis remise de toutes les clés et accès ; pris en charge pendant toute la collaboration sur un site avec tableau de bord.",
          "L'ajout de nouvelles fonctionnalités est facturé en supplément, toujours après votre accord.",
          "Blog standard : un article par mois (12 intégrés au site). Au-delà — 3 ou 5 par mois, ou sur mesure — facturation supplémentaire.",
          "Renouvellement annuel pour maintenir le domaine et l'hébergement : 500 000 GNF (vitrine) ou 700 000 GNF (tableau de bord).",
        ],
      },
      software: {
        sub: "Conception sur mesure, unique pour chaque client — le chiffrage dépend des fonctionnalités demandées et fait l'objet d'une discussion dédiée.",
        cards: [
          {
            id: "software-custom",
            title: "Logiciel sur mesure — usage interne",
            desc: "Un outil taillé pour vos processus : plusieurs accès administrateur, fonctionnalités internes, pilotage complet de votre activité.",
            features: [
              "Atelier de cadrage de vos processus",
              "Développement itératif avec démonstrations régulières",
              "Fonctionnalités intégrées selon votre demande",
              "Formation complète de vos équipes",
            ],
          },
          {
            id: "software-saas",
            title: "Logiciel SaaS à commercialiser",
            desc: "Vous voulez vendre votre propre logiciel à vos clients ? Nous concevons le produit complet, prêt à être commercialisé.",
            features: [
              "Architecture multi-clients",
              "Abonnements et facturation intégrés",
              "Tableau de bord d'exploitation",
              "Accompagnement du lancement",
            ],
          },
          {
            id: "software-mobile",
            title: "Application mobile",
            desc: "Une application pour vos équipes ou vos clients, selon le type de projet : étude personnalisée puis chiffrage précis sur devis.",
            features: [
              "Étude personnalisée de votre besoin",
              "Maquettes et validations étape par étape",
              "Publication sur les magasins d'applications",
              "Formation et suivi de vos équipes",
            ],
          },
        ],
        note: "Chaque projet est unique : après une discussion sur mesure, vous recevez un devis précis, poste par poste.",
      },
      saas: {
        sub: "Sept logiciels métiers prêts à l'emploi, paramétrés pour votre activité dès le premier jour — essai gratuit de 7 jours sur chacun.",
        workflowsTitle: "Conception de workflows sur mesure",
        workflowsDesc:
          "Au-delà des SaaS prêts à l'emploi, nous concevons des systèmes de workflows sur mesure : vos processus métier automatisés de bout en bout, chiffrés après étude de votre besoin.",
      },
      community: {
        sub: "La gestion de vos réseaux sociaux — publications, vidéos courtes, publicité — avec des formules mensuelles claires. Plateformes gérées de base : Facebook, TikTok, LinkedIn, Instagram.",
        cards: [
          {
            id: "community-essentiel",
            title: "Forfait Essentiel",
            desc: "L'essentiel pour rester visible chaque semaine.",
            features: [
              "12 publications standards par mois — 3 par semaine, chacune avec un texte et une affiche conçus par notre équipe",
              "8 vidéos courtes par mois — 2 par semaine, de 30 à 45 secondes",
              "5 plateformes : Facebook, Instagram, LinkedIn, TikTok et YouTube Shorts, selon le format du contenu",
              "Publicité incluse : 10 $ — budget sponsorisé sur une semaine, objectif au choix : prospects, abonnés ou mentions J'aime",
              "Sans équipe de terrain : vous fournissez les photos et les éléments nécessaires aux contenus",
            ],
          },
          {
            id: "community-pro",
            title: "Forfait Professionnel",
            desc: "Le rythme d'une marque qui grandit.",
            features: [
              "20 publications standards par mois — 5 par semaine, avec texte et affiche",
              "30 vidéos courtes par mois — 1 par jour, de 30 à 45 secondes",
              "Diffusion multiplateforme : publications standards sur Facebook, Instagram et LinkedIn ; vidéos sur Facebook Reels, LinkedIn, TikTok et YouTube Shorts",
              "Publicité incluse : 50 $ par mois — budget réparti sur deux semaines",
              "Sans équipe de terrain : vous fournissez les photos et les éléments nécessaires aux contenus",
            ],
          },
          {
            id: "community-premium",
            title: "Forfait Premium",
            desc: "Notre équipe crée vos contenus sur le terrain.",
            features: [
              "20 publications standards par mois — 5 par semaine, avec texte et affiche",
              "30 à 90 vidéos courtes par mois — 1 à 3 vidéos par jour, de 30 à 45 secondes",
              "Équipe dédiée sur le terrain : 2 interventions par semaine pour photographier et filmer vos activités",
              "5 montages vidéo inclus, dédiés aux besoins de votre communication",
              "Publicité incluse : 100 $ par mois — budget sponsorisé mensuel",
            ],
          },
        ],
        note: "La création de contenu et la gestion du réseau social sont deux travaux distincts : nos formules combinent les deux, avec ou sans équipe de terrain.",
      },
      acquisition: {
        sub: "Génération de leads et de prospects B2B, selon votre domaine d'activité et le pays ciblé — partout dans le monde.",
        cards: [
          {
            id: "acq-leads",
            title: "Génération de leads B2B",
            desc: "Nous récupérons des contacts qualifiés selon votre secteur et le pays ciblé, puis nous vous les transférons : votre équipe commerciale effectue les appels de prospection.",
            features: [
              "Contacts B2B par secteur d'activité et par pays",
              "Listes transmises directement à votre équipe commerciale",
              "Canaux adaptés à votre marché — y compris LinkedIn",
            ],
          },
          {
            id: "acq-calling",
            title: "Prospection téléphonique déléguée",
            desc: "Nos équipes appellent pour vous : elles présentent vos services, identifient les personnes intéressées et vous transmettent les listes.",
            features: [
              "Appels de prospection réalisés par nos équipes",
              "Présentation de vos services aux prospects",
              "Listes de contacts intéressés retournées à votre équipe",
              "Suivi rigoureux et reporting détaillé",
            ],
          },
          {
            id: "acq-landing",
            title: "Landing page de conversion",
            desc: "Une page unique, pensée pour transformer vos campagnes en contacts concrets.",
            features: [
              "Structure orientée conversion",
              "Formulaire de capture intégré",
              "Connexion à vos outils de suivi",
            ],
          },
          {
            id: "acq-ads",
            title: "Campagne publicitaire sur mesure",
            desc: "Conception et pilotage de campagnes adaptées à vos objectifs et à votre budget.",
            features: [
              "Stratégie de campagne définie avec vous",
              "Création des supports publicitaires",
              "Pilotage et ajustements continus",
              "Budget média à la charge du client",
            ],
          },
        ],
        note: "Précision importante : nous garantissons la qualité et la fiabilité des contacts générés, pas leur passage à l'achat — la conversion reste le travail de votre équipe commerciale. Nous intervenons en B2B.",
      },
      training: {
        sub: "Nous formons vos équipes en entreprise — des formations stratégiques construites autour de votre domaine d'activité, sur devis.",
        subjectsTitle: "Nos formations",
        subjects: [
          "Stratégie d'acquisition client — y compris via LinkedIn",
          "Prospection téléphonique",
          "Neuromarketing et stratégie de vente",
          "Fidélisation client",
          "Intelligence artificielle appliquée à votre domaine d'activité",
        ],
        cards: [
          {
            id: "training-team",
            title: "Formation d'équipe en entreprise",
            desc: "Un programme construit après analyse de vos besoins et de votre stratégie, animé directement auprès de vos équipes.",
            features: [
              "Analyse préalable de vos besoins",
              "Programme adapté à votre secteur",
              "Animation pratique auprès de vos équipes",
              "Suivi post-formation pour consolider les acquis",
            ],
          },
        ],
        note: "Formations destinées aux entreprises : nous formons vos équipes, pas les particuliers. Tarification sur devis, à partir de 20 000 000 GNF, après discussion de vos besoins.",
      },
      strategy: {
        sub: "Ce service n'est pas encore disponible — il ouvrira prochainement.",
      },
    },
    faq: {
      label: "06.2 — Questions fréquentes",
      title: "Les tarifs,",
      gold: "sans ambiguïté.",
      sub: "Les questions que l'on nous pose avant chaque devis. Pour le reste, notre assistant répond instantanément.",
      items: [
        {
          q: "Les prix peuvent-ils changer en cours de route ?",
          a: "Non. Une fois le devis accepté, le montant est figé : il ne change pas en cours de route. Seules les nouvelles fonctionnalités demandées en plus se facturent en supplément — toujours après votre accord.",
        },
        {
          q: "Que comprend le renouvellement annuel ?",
          a: "Le nom de domaine et l'hébergement de votre site : 500 000 GNF par an pour un site vitrine, 700 000 GNF par an pour un site avec tableau de bord. Sans ce renouvellement, le domaine et l'hébergement expirent.",
        },
        {
          q: "Qui corrige les bugs après la livraison ?",
          a: "Sur un site vitrine, nous vérifions bugs et failles pendant les 6 premiers mois, puis nous vous remettons toutes les clés et accès. Sur un site avec tableau de bord, les bugs sont pris en charge pendant toute la collaboration.",
        },
        {
          q: "Et pour un système de paiement ?",
          a: "Sur demande, nous intégrons un système de paiement sur n'importe quel site : 1 000 000 GNF en supplément du forfait — vitrine (2 500 000 GNF au total) comme tableau de bord (4 500 000 GNF au total).",
        },
        {
          q: "Combien d'administrateurs pour mon site ?",
          a: "Le site à tableau de bord inclut un seul espace administrateur. Si vous souhaitez plusieurs administrateurs, il s'agit d'une tarification spécifique : parlons de votre organisation et nous chiffrons ensemble.",
        },
        {
          q: "Comment se passe le paiement ?",
          a: "Par jalons, définis dans le devis. Chaque échéance est accompagnée d'une facture détaillée, sans surprise.",
        },
      ],
    },
    cta: {
      title: "Un budget à cadrer ?",
      gold: "Demandez un devis détaillé.",
      sub: "Décrivez votre projet en quelques lignes : nous revenons vers vous avec un devis chiffré, poste par poste, sous 48 heures.",
      primaryLabel: "Demander un devis",
      secondaryLabel: "Voir les logiciels",
    },
    cross: {
      title: "Explorer aussi",
      items: [
        {
          href: "/logiciels",
          title: "Logiciels SaaS",
          desc: "Sept outils de gestion prêts à l'emploi, avec essai gratuit de 7 jours : facturation, comptabilité, santé, école, immobilier, pharmacie, formation.",
        },
        {
          href: "/services",
          title: "Services",
          desc: "Sept pôles complémentaires : sites web, logiciels sur mesure, SaaS, community management, acquisition client, formations et stratégie.",
        },
        {
          href: "/faq",
          title: "FAQ",
          desc: "Délais, maintenance, langues, support : les réponses claires aux questions les plus fréquentes.",
        },
      ],
    },
  },

  en: {
    hero: {
      label: "06 — Pricing",
      title: "Clear prices,",
      gold: "announced upfront.",
      sub: "All amounts are in Guinean francs (GNF), exactly as communicated by the agency. Browse each service: the price, what it includes and its conditions are spelled out in black and white.",
      chips: [
        "Amounts in GNF",
        "Explicit “from” mentions",
        "Renewal from 500 000 GNF/year",
      ],
    },
    groups: {
      web: {
        sub: "Three categories of websites, one-off payment on delivery. SEO and Google indexing are covered on all our sites.",
        cards: [
          {
            id: "web-vitrine",
            title: "Showcase website",
            desc: "Your complete online presence, designed and managed by the agency — no dashboard: for any change, you call on a webmaster.",
            features: [
              "Domain name and hosting",
              "Two professional e-mail addresses",
              "Built-in AI chatbot powered by the site's content",
              "Home, about, services, contact and gallery pages",
              "Optional shop page (product display)",
              "Lead capture: form sent to your e-mail",
              "Additional pages on request (level 1, 2, 3 structures)",
              "SEO and Google indexing covered",
              "Bugs and vulnerabilities checked during the first 6 months, then handover of all your keys and access",
            ],
          },
          {
            id: "web-dashboard",
            title: "Website with dashboard",
            desc: "Everything in the showcase site, plus your own dashboard: you manage your content yourself, receive your messages and measure your reach.",
            features: [
              "Everything the showcase site includes",
              "A single administrator space (additional administrators: specific pricing)",
              "Gallery: sections, categories, sub-categories, images and videos",
              "Service pages editable or hideable — without creating new service pages",
              "Home and about pages fully editable (no button additions)",
              "Site messages received three times: dashboard, e-mail and WhatsApp",
              "Site downloadable as an app",
              "Blog: 1 article per month, 12 included — beyond that, additional billing",
              "Notifications sent to readers with each new article",
              "Advertising feature: push notification to all users of your app",
              "Statistics: app downloads and notification views",
              "Bugs covered for the entire collaboration",
            ],
          },
          {
            id: "web-custom",
            title: "Customised website",
            desc: "The dashboard site, enriched with the options of your choice — configured together, quoted on estimate.",
            features: [
              "All the features of the dashboard site",
              "WhatsApp chatbot to stay in constant touch with your clients",
              "Conversational chatbot trained for sales — an online salesperson that sells, books appointments and feeds your dashboard",
              "Reinforced dashboard",
              "“Social network” section: your posts (videos, articles, photos) visible to your app's users",
              "Accelerated blog: 3 or 5 articles per month, or bespoke (at extra cost)",
              "Any additional feature on request",
            ],
          },
        ],
        renewalsTitle: "Annual renewal — domain name and hosting",
        renewals: [
          {
            id: "web-renewal-vitrine",
            title: "Showcase site",
            desc: "Every year, renewing the domain and hosting keeps your site up and running.",
          },
          {
            id: "web-renewal-dashboard",
            title: "Site with dashboard",
            desc: "Every year, renewing the domain and hosting keeps your site up and running.",
          },
        ],
        addon: {
          id: "web-payment-addon",
          title: "Integrated payment system",
          desc: "On request, we integrate a payment system on any site: 1 000 000 GNF on top of the package — showcase (2 500 000 GNF in total) as well as dashboard (4 500 000 GNF in total).",
        },
        optionsTitle: "Options & details",
        options: [
          "Additional pages for all site types: level 1, 2 and 3 structures — a service page, a sub-page per service, then the detailed sub-pages",
          "Specialised spaces depending on your activity: recruitment, data submission, a school's programmes and activities…",
          "Additional administrators: specific pricing — the dashboard package includes a single administrator space",
          "If you take back the code to change developer, bug fixes and maintenance become your responsibility",
        ],
        includedTitle: "Included in every website",
        included: [
          "Domain name and hosting",
          "Two professional e-mail addresses",
          "AI chatbot powered by the site's content",
          "Lead-capture forms (forwarded to your e-mail)",
          "SEO and Google indexing",
          "Light and dark mode, multilingual site",
        ],
        notesTitle: "Conditions & clauses",
        notes: [
          "Bugs and vulnerabilities: checked free of charge during the first 6 months on a showcase site, then handover of all keys and access; covered for the entire collaboration on a dashboard site.",
          "Adding new features is billed as an extra, always after your approval.",
          "Standard blog: one article per month (12 built into the site). Beyond that — 3 or 5 per month, or bespoke — additional billing.",
          "Annual renewal to maintain the domain and hosting: 500 000 GNF (showcase) or 700 000 GNF (dashboard).",
        ],
      },
      software: {
        sub: "Bespoke design, unique for each client — the pricing depends on the features requested and is the subject of a dedicated discussion.",
        cards: [
          {
            id: "software-custom",
            title: "Custom software — internal use",
            desc: "A tool tailored to your processes: several administrator accesses, internal features, complete control of your business.",
            features: [
              "Workshop to frame your processes",
              "Iterative development with regular demos",
              "Features built to your request",
              "Full training of your teams",
            ],
          },
          {
            id: "software-saas",
            title: "SaaS software to commercialise",
            desc: "Want to sell your own software to your clients? We design the complete product, ready to market.",
            features: [
              "Multi-client architecture",
              "Built-in subscriptions and billing",
              "Operations dashboard",
              "Launch support",
            ],
          },
          {
            id: "software-mobile",
            title: "Mobile application",
            desc: "An app for your teams or your clients, depending on the project type: personalised study then precise quote.",
            features: [
              "Personalised study of your need",
              "Mock-ups and step-by-step validations",
              "Publication on the app stores",
              "Training and follow-up of your teams",
            ],
          },
        ],
        note: "Every project is unique: after a bespoke discussion, you receive a precise quote, line by line.",
      },
      saas: {
        sub: "Seven ready-to-use business tools, configured for your activity from day one — free 7-day trial on each.",
        workflowsTitle: "Bespoke workflow design",
        workflowsDesc:
          "Beyond the ready-to-use SaaS, we design bespoke workflow systems: your business processes automated end to end, priced after studying your need.",
      },
      community: {
        sub: "Managing your social media — posts, short videos, advertising — with clear monthly plans. Base platforms managed: Facebook, TikTok, LinkedIn, Instagram.",
        cards: [
          {
            id: "community-essentiel",
            title: "Essential plan",
            desc: "The essentials to stay visible every week.",
            features: [
              "12 standard posts per month — 3 per week, each with copy and a poster designed by our team",
              "8 short videos per month — 2 per week, 30 to 45 seconds",
              "5 platforms: Facebook, Instagram, LinkedIn, TikTok and YouTube Shorts, depending on the content format",
              "Advertising included: $10 — sponsored budget over one week, goal of your choice: leads, followers or likes",
              "No field team: you provide the photos and materials needed for the content",
            ],
          },
          {
            id: "community-pro",
            title: "Professional plan",
            desc: "The pace of a growing brand.",
            features: [
              "20 standard posts per month — 5 per week, with copy and poster",
              "30 short videos per month — 1 per day, 30 to 45 seconds",
              "Multi-platform distribution: standard posts on Facebook, Instagram and LinkedIn; videos on Facebook Reels, LinkedIn, TikTok and YouTube Shorts",
              "Advertising included: $50 per month — budget spread over two weeks",
              "No field team: you provide the photos and materials needed for the content",
            ],
          },
          {
            id: "community-premium",
            title: "Premium plan",
            desc: "Our team creates your content in the field.",
            features: [
              "20 standard posts per month — 5 per week, with copy and poster",
              "30 to 90 short videos per month — 1 to 3 videos per day, 30 to 45 seconds",
              "Dedicated field team: 2 visits per week to photograph and film your activities",
              "5 video edits included, dedicated to your communication needs",
              "Advertising included: $100 per month — monthly sponsored budget",
            ],
          },
        ],
        note: "Content creation and social media management are two separate jobs: our plans combine the two, with or without a field team.",
      },
      acquisition: {
        sub: "B2B lead and prospect generation, based on your industry and target country — anywhere in the world.",
        cards: [
          {
            id: "acq-leads",
            title: "B2B lead generation",
            desc: "We gather qualified contacts based on your sector and target country, then hand them over: your sales team makes the prospecting calls.",
            features: [
              "B2B contacts by industry and by country",
              "Lists passed straight to your sales team",
              "Channels suited to your market — including LinkedIn",
            ],
          },
          {
            id: "acq-calling",
            title: "Delegated phone prospecting",
            desc: "Our teams call on your behalf: they present your services, identify interested people and pass you the lists.",
            features: [
              "Prospecting calls made by our teams",
              "Presentation of your services to prospects",
              "Lists of interested contacts returned to your team",
              "Rigorous follow-up and detailed reporting",
            ],
          },
          {
            id: "acq-landing",
            title: "Conversion landing page",
            desc: "A single page, designed to turn your campaigns into concrete contacts.",
            features: [
              "Conversion-oriented structure",
              "Built-in capture form",
              "Connection to your tracking tools",
            ],
          },
          {
            id: "acq-ads",
            title: "Bespoke advertising campaign",
            desc: "Design and management of campaigns adapted to your goals and budget.",
            features: [
              "Campaign strategy defined with you",
              "Creation of the advertising assets",
              "Continuous management and adjustments",
              "Media budget borne by the client",
            ],
          },
        ],
        note: "Important precision: we guarantee the quality and reliability of the contacts generated, not their move to purchase — conversion remains the job of your sales team. We work in B2B.",
      },
      training: {
        sub: "We train your teams in-company — strategic trainings built around your field of activity, on quote.",
        subjectsTitle: "Our trainings",
        subjects: [
          "Client acquisition strategy — including via LinkedIn",
          "Phone prospecting",
          "Neuromarketing and sales strategy",
          "Client loyalty",
          "Artificial intelligence applied to your field",
        ],
        cards: [
          {
            id: "training-team",
            title: "In-company team training",
            desc: "A programme built after analysing your needs and strategy, delivered directly to your teams.",
            features: [
              "Upfront analysis of your needs",
              "Programme adapted to your sector",
              "Hands-on delivery to your teams",
              "Post-training follow-up to consolidate learning",
            ],
          },
        ],
        note: "Trainings designed for companies: we train your teams, not individuals. Quote-based pricing, from 20 000 000 GNF, after discussing your needs.",
      },
      strategy: {
        sub: "This service is not yet available — it will open soon.",
      },
    },
    faq: {
      label: "06.2 — Frequently asked questions",
      title: "The prices,",
      gold: "without ambiguity.",
      sub: "The questions we are asked before every quote. For the rest, our assistant answers instantly.",
      items: [
        {
          q: "Can prices change along the way?",
          a: "No. Once the quote is accepted, the amount is frozen: it does not change along the way. Only new features requested on top are billed as extras — always after your approval.",
        },
        {
          q: "What does the annual renewal cover?",
          a: "Your site's domain name and hosting: 500 000 GNF per year for a showcase site, 700 000 GNF per year for a site with dashboard. Without this renewal, the domain and hosting expire.",
        },
        {
          q: "Who fixes bugs after delivery?",
          a: "On a showcase site, we check bugs and vulnerabilities during the first 6 months, then hand over all keys and access. On a dashboard site, bugs are covered for the entire collaboration.",
        },
        {
          q: "What about a payment system?",
          a: "On request, we integrate a payment system on any site: 1 000 000 GNF on top of the package — showcase (2 500 000 GNF in total) as well as dashboard (4 500 000 GNF in total).",
        },
        {
          q: "How many administrators for my site?",
          a: "The dashboard site includes a single administrator space. If you want several administrators, it is specific pricing: let's talk about your organisation and we will price it together.",
        },
        {
          q: "How does payment work?",
          a: "By milestones, defined in the quote. Each deadline comes with a detailed invoice, no surprises.",
        },
      ],
    },
    cta: {
      title: "A budget to frame?",
      gold: "Request a detailed quote.",
      sub: "Describe your project in a few lines: we come back to you with an itemised quote within 48 hours.",
      primaryLabel: "Request a quote",
      secondaryLabel: "See the software",
    },
    cross: {
      title: "Explore more",
      items: [
        {
          href: "/logiciels",
          title: "SaaS software",
          desc: "Seven ready-to-use management tools, with a free 7-day trial: invoicing, accounting, health, school, real estate, pharmacy, training.",
        },
        {
          href: "/services",
          title: "Services",
          desc: "Seven complementary pillars: websites, custom software, SaaS, social media, client acquisition, training and strategy.",
        },
        {
          href: "/faq",
          title: "FAQ",
          desc: "Deadlines, maintenance, languages, support: clear answers to the most frequent questions.",
        },
      ],
    },
  },

  es: {
    hero: {
      label: "06 — Precios",
      title: "Precios claros,",
      gold: "anunciados de antemano.",
      sub: "Todos los importes están en francos guineanos (GNF), tal como los comunica la agencia. Recorra cada servicio: el precio, lo que incluye y sus condiciones están escritos con letra clara.",
      chips: [
        "Importes en GNF",
        "Mención « desde » explícita",
        "Renovación desde 500 000 GNF/año",
      ],
    },
    groups: {
      web: {
        sub: "Tres categorías de sitios web, pago único a la entrega. El SEO y la indexación en Google están cubiertos en todos nuestros sitios.",
        cards: [
          {
            id: "web-vitrine",
            title: "Sitio web vitrina",
            desc: "Su presencia en línea completa, diseñada y gestionada por la agencia — sin panel de administración: para cualquier modificación, recurre a un webmaster.",
            features: [
              "Nombre de dominio y alojamiento",
              "Dos direcciones de correo profesionales",
              "Chatbot con IA integrado, alimentado por el contenido del sitio",
              "Páginas de inicio, acerca de, servicios, contacto y galería",
              "Página de tienda opcional (visualización de productos)",
              "Captación de contactos: formulario enviado a su correo",
              "Páginas adicionales a petición (estructuras de nivel 1, 2, 3)",
              "SEO e indexación en Google cubiertos",
              "Bugs y vulnerabilidades verificados durante los 6 primeros meses, luego entrega de todas sus claves y accesos",
            ],
          },
          {
            id: "web-dashboard",
            title: "Sitio web con panel de administración",
            desc: "Todo el sitio vitrina, más su propio panel: usted gestiona sus contenidos, recibe sus mensajes y mide su alcance.",
            features: [
              "Todo lo que incluye el sitio vitrina",
              "Un solo espacio de administrador (administradores adicionales: tarificación específica)",
              "Galería: secciones, categorías, subcategorías, imágenes y vídeos",
              "Páginas de servicios modificables u ocultables — sin crear nuevas páginas de servicios",
              "Páginas de inicio y «acerca de» totalmente modificables (sin añadir botones)",
              "Mensajes del sitio recibidos tres veces: panel, correo y WhatsApp",
              "Sitio descargable como aplicación",
              "Blog: 1 artículo al mes, 12 integrados — más allá, facturación adicional",
              "Notificaciones enviadas a los lectores con cada nuevo artículo",
              "Función Publicidad: notificación push a todos los usuarios de su aplicación",
              "Estadísticas: descargas de la aplicación y consultas de las notificaciones",
              "Bugs cubiertos durante toda la colaboración",
            ],
          },
          {
            id: "web-custom",
            title: "Sitio web personalizado",
            desc: "El sitio con panel, enriquecido con las opciones que elija — configurado juntos, presupuestado a consultar.",
            features: [
              "Todas las funcionalidades del sitio con panel",
              "Chatbot de WhatsApp para mantener un contacto constante con sus clientes",
              "Chatbot conversacional entrenado para vender — un comercial en línea que vende, reserva citas y alimenta su panel",
              "Panel de administración reforzado",
              "Sección «red social»: sus publicaciones (vídeos, artículos, fotos) visibles para los usuarios de su aplicación",
              "Blog acelerado: 3 o 5 artículos al mes, o a medida (suplemento)",
              "Cualquier funcionalidad adicional a petición",
            ],
          },
        ],
        renewalsTitle: "Renovación anual — nombre de dominio y alojamiento",
        renewals: [
          {
            id: "web-renewal-vitrine",
            title: "Sitio vitrina",
            desc: "Cada año, la renovación del dominio y del alojamiento asegura la continuidad de su sitio.",
          },
          {
            id: "web-renewal-dashboard",
            title: "Sitio con panel",
            desc: "Cada año, la renovación del dominio y del alojamiento asegura la continuidad de su sitio.",
          },
        ],
        addon: {
          id: "web-payment-addon",
          title: "Sistema de pago integrado",
          desc: "A petición, integramos un sistema de pago en cualquier sitio: 1 000 000 GNF en suplemento del paquete — vitrina (2 500 000 GNF en total) como con panel (4 500 000 GNF en total).",
        },
        optionsTitle: "Opciones y precisiones",
        options: [
          "Páginas adicionales para todos los tipos de sitios: estructuras de nivel 1, 2 y 3 — una página de servicio, una subpágina por servicio, luego las subpáginas detalladas",
          "Espacios especializados según su actividad: reclutamiento, envío de datos, programas y actividades de una escuela…",
          "Administradores adicionales: tarificación específica — el paquete con panel incluye un solo espacio de administrador",
          "Si recupera el código para cambiar de desarrollador, la gestión de bugs y del mantenimiento le corresponde",
        ],
        includedTitle: "Incluido en cada sitio web",
        included: [
          "Nombre de dominio y alojamiento",
          "Dos direcciones de correo profesionales",
          "Chatbot con IA alimentado por el contenido del sitio",
          "Formularios de captación de contactos (redirigidos a su correo)",
          "SEO e indexación en Google",
          "Modo claro y oscuro, sitio multilingüe",
        ],
        notesTitle: "Condiciones y cláusulas",
        notes: [
          "Bugs y vulnerabilidades: verificados sin cargo durante los 6 primeros meses en un sitio vitrina, luego entrega de todas las claves y accesos; cubiertos durante toda la colaboración en un sitio con panel.",
          "La adición de nuevas funcionalidades se factura como suplemento, siempre tras su acuerdo.",
          "Blog estándar: un artículo al mes (12 integrados en el sitio). Más allá — 3 o 5 al mes, o a medida — facturación adicional.",
          "Renovación anual para mantener el dominio y el alojamiento: 500 000 GNF (vitrina) o 700 000 GNF (panel).",
        ],
      },
      software: {
        sub: "Concepción a medida, única para cada cliente — el presupuesto depende de las funcionalidades solicitadas y se discute en una conversación dedicada.",
        cards: [
          {
            id: "software-custom",
            title: "Software a medida — uso interno",
            desc: "Una herramienta adaptada a sus procesos: varios accesos de administrador, funcionalidades internas, pilotaje completo de su actividad.",
            features: [
              "Taller de encuadre de sus procesos",
              "Desarrollo iterativo con demostraciones regulares",
              "Funcionalidades integradas según su petición",
              "Formación completa de sus equipos",
            ],
          },
          {
            id: "software-saas",
            title: "Software SaaS para comercializar",
            desc: "¿Quiere vender su propio software a sus clientes? Concebimos el producto completo, listo para comercializar.",
            features: [
              "Arquitectura multi-cliente",
              "Suscripciones y facturación integradas",
              "Panel de explotación",
              "Acompañamiento del lanzamiento",
            ],
          },
          {
            id: "software-mobile",
            title: "Aplicación móvil",
            desc: "Una aplicación para sus equipos o sus clientes, según el tipo de proyecto: estudio personalizado y luego presupuesto preciso a consultar.",
            features: [
              "Estudio personalizado de su necesidad",
              "Maquetas y validaciones paso a paso",
              "Publicación en las tiendas de aplicaciones",
              "Formación y seguimiento de sus equipos",
            ],
          },
        ],
        note: "Cada proyecto es único: tras una conversación a medida, recibe un presupuesto preciso, partida por partida.",
      },
      saas: {
        sub: "Siete herramientas de gestión listas para usar, configuradas para su actividad desde el primer día — prueba gratuita de 7 días en cada una.",
        workflowsTitle: "Diseño de flujos de trabajo a medida",
        workflowsDesc:
          "Más allá de los SaaS listos para usar, diseñamos sistemas de flujos de trabajo a medida: sus procesos de negocio automatizados de principio a fin, presupuestados tras estudiar su necesidad.",
      },
      community: {
        sub: "La gestión de sus redes sociales — publicaciones, vídeos cortos, publicidad — con fórmulas mensuales claras. Plataformas gestionadas de base: Facebook, TikTok, LinkedIn, Instagram.",
        cards: [
          {
            id: "community-essentiel",
            title: "Plan Esencial",
            desc: "Lo esencial para seguir visible cada semana.",
            features: [
              "12 publicaciones estándar al mes — 3 por semana, cada una con texto y cartel diseñados por nuestro equipo",
              "8 vídeos cortos al mes — 2 por semana, de 30 a 45 segundos",
              "5 plataformas: Facebook, Instagram, LinkedIn, TikTok y YouTube Shorts, según el formato del contenido",
              "Publicidad incluida: 10 $ — presupuesto patrocinado durante una semana, objetivo a elegir: contactos, seguidores o «me gusta»",
              "Sin equipo de terreno: usted proporciona las fotos y los elementos necesarios para los contenidos",
            ],
          },
          {
            id: "community-pro",
            title: "Plan Profesional",
            desc: "El ritmo de una marca que crece.",
            features: [
              "20 publicaciones estándar al mes — 5 por semana, con texto y cartel",
              "30 vídeos cortos al mes — 1 al día, de 30 a 45 segundos",
              "Difusión multiplataforma: publicaciones estándar en Facebook, Instagram y LinkedIn; vídeos en Facebook Reels, LinkedIn, TikTok y YouTube Shorts",
              "Publicidad incluida: 50 $ al mes — presupuesto repartido en dos semanas",
              "Sin equipo de terreno: usted proporciona las fotos y los elementos necesarios para los contenidos",
            ],
          },
          {
            id: "community-premium",
            title: "Plan Premium",
            desc: "Nuestro equipo crea sus contenidos en el terreno.",
            features: [
              "20 publicaciones estándar al mes — 5 por semana, con texto y cartel",
              "30 a 90 vídeos cortos al mes — 1 a 3 vídeos al día, de 30 a 45 segundos",
              "Equipo dedicado en el terreno: 2 intervenciones por semana para fotografiar y filmar sus actividades",
              "5 montajes de vídeo incluidos, dedicados a las necesidades de su comunicación",
              "Publicidad incluida: 100 $ al mes — presupuesto patrocinado mensual",
            ],
          },
        ],
        note: "La creación de contenido y la gestión de la red social son dos trabajos distintos: nuestras fórmulas combinan los dos, con o sin equipo de terreno.",
      },
      acquisition: {
        sub: "Generación de leads y prospectos B2B, según su sector de actividad y el país objetivo — en todo el mundo.",
        cards: [
          {
            id: "acq-leads",
            title: "Generación de leads B2B",
            desc: "Recuperamos contactos cualificados según su sector y el país objetivo, y se los transferimos: su equipo comercial realiza las llamadas de prospección.",
            features: [
              "Contactos B2B por sector de actividad y por país",
              "Listas entregadas directamente a su equipo comercial",
              "Canales adaptados a su mercado — incluido LinkedIn",
            ],
          },
          {
            id: "acq-calling",
            title: "Prospección telefónica delegada",
            desc: "Nuestros equipos llaman por usted: presentan sus servicios, identifican a las personas interesadas y le transmiten las listas.",
            features: [
              "Llamadas de prospección realizadas por nuestros equipos",
              "Presentación de sus servicios a los prospectos",
              "Listas de contactos interesados devueltas a su equipo",
              "Seguimiento riguroso e informes detallados",
            ],
          },
          {
            id: "acq-landing",
            title: "Landing page de conversión",
            desc: "Una página única, pensada para transformar sus campañas en contactos concretos.",
            features: [
              "Estructura orientada a la conversión",
              "Formulario de captación integrado",
              "Conexión a sus herramientas de seguimiento",
            ],
          },
          {
            id: "acq-ads",
            title: "Campaña publicitaria a medida",
            desc: "Concepción y pilotaje de campañas adaptadas a sus objetivos y a su presupuesto.",
            features: [
              "Estrategia de campaña definida con usted",
              "Creación de los soportes publicitarios",
              "Pilotaje y ajustes continuos",
              "Presupuesto de medios a cargo del cliente",
            ],
          },
        ],
        note: "Precisión importante: garantizamos la calidad y la fiabilidad de los contactos generados, no su paso a la compra — la conversión sigue siendo el trabajo de su equipo comercial. Intervenimos en B2B.",
      },
      training: {
        sub: "Formamos a sus equipos en la empresa — formaciones estratégicas construidas en torno a su sector de actividad, a consultar.",
        subjectsTitle: "Nuestras formaciones",
        subjects: [
          "Estrategia de captación de clientes — incluida vía LinkedIn",
          "Prospección telefónica",
          "Neuromarketing y estrategia de venta",
          "Fidelización de clientes",
          "Inteligencia artificial aplicada a su sector de actividad",
        ],
        cards: [
          {
            id: "training-team",
            title: "Formación de equipo en empresa",
            desc: "Un programa construido tras analizar sus necesidades y su estrategia, impartido directamente a sus equipos.",
            features: [
              "Análisis previo de sus necesidades",
              "Programa adaptado a su sector",
              "Animación práctica ante sus equipos",
              "Seguimiento posformación para consolidar los conocimientos",
            ],
          },
        ],
        note: "Formaciones destinadas a empresas: formamos a sus equipos, no a particulares. Tarificación a consultar, a partir de 20 000 000 GNF, tras discutir sus necesidades.",
      },
      strategy: {
        sub: "Este servicio aún no está disponible — abrirá próximamente.",
      },
    },
    faq: {
      label: "06.2 — Preguntas frecuentes",
      title: "Los precios,",
      gold: "sin ambigüedad.",
      sub: "Las preguntas que nos hacen antes de cada presupuesto. Para el resto, nuestro asistente responde al instante.",
      items: [
        {
          q: "¿Los precios pueden cambiar durante el camino?",
          a: "No. Una vez aceptado el presupuesto, el importe queda fijado: no cambia durante el camino. Solo las nuevas funcionalidades pedidas además se facturan como suplemento — siempre tras su acuerdo.",
        },
        {
          q: "¿Qué incluye la renovación anual?",
          a: "El nombre de dominio y el alojamiento de su sitio: 500 000 GNF al año para un sitio vitrina, 700 000 GNF al año para un sitio con panel. Sin esta renovación, el dominio y el alojamiento caducan.",
        },
        {
          q: "¿Quién corrige los bugs tras la entrega?",
          a: "En un sitio vitrina, verificamos bugs y vulnerabilidades durante los 6 primeros meses, y luego le entregamos todas las claves y accesos. En un sitio con panel, los bugs están cubiertos durante toda la colaboración.",
        },
        {
          q: "¿Y para un sistema de pago?",
          a: "A petición, integramos un sistema de pago en cualquier sitio: 1 000 000 GNF en suplemento del paquete — vitrina (2 500 000 GNF en total) como con panel (4 500 000 GNF en total).",
        },
        {
          q: "¿Cuántos administradores para mi sitio?",
          a: "El sitio con panel incluye un solo espacio de administrador. Si desea varios administradores, se trata de una tarificación específica: hablemos de su organización y lo presupuestamos juntos.",
        },
        {
          q: "¿Cómo se realiza el pago?",
          a: "Por hitos, definidos en el presupuesto. Cada vencimiento viene acompañado de una factura detallada, sin sorpresas.",
        },
      ],
    },
    cta: {
      title: "¿Un presupuesto que definir?",
      gold: "Solicite un presupuesto detallado.",
      sub: "Describa su proyecto en unas líneas: le respondemos con un presupuesto detallado, partida por partida, en menos de 48 horas.",
      primaryLabel: "Solicitar un presupuesto",
      secondaryLabel: "Ver los software",
    },
    cross: {
      title: "Explorar también",
      items: [
        {
          href: "/logiciels",
          title: "Software SaaS",
          desc: "Siete herramientas de gestión listas para usar, con prueba gratuita de 7 días: facturación, contabilidad, salud, escuela, inmobiliaria, farmacia, formación.",
        },
        {
          href: "/services",
          title: "Servicios",
          desc: "Siete polos complementarios: sitios web, software a medida, SaaS, community management, captación de clientes, formaciones y estrategia.",
        },
        {
          href: "/faq",
          title: "FAQ",
          desc: "Plazos, mantenimiento, idiomas, soporte: respuestas claras a las preguntas más frecuentes.",
        },
      ],
    },
  },

  zh: {
    hero: {
      label: "06 — 价格",
      title: "价格透明，",
      gold: "事先明示。",
      sub: "所有金额均以几内亚法郎（GNF）计，与机构对外公布一致。逐项浏览每项服务：价格、包含内容与条件全部白纸黑字写明。",
      chips: [
        "金额以 GNF 计",
        "明确标注「起价」",
        "续费低至 500 000 GNF/年",
      ],
    },
    groups: {
      web: {
        sub: "三类网站，交付时一次性付款。所有网站均包含 SEO 与谷歌收录。",
        cards: [
          {
            id: "web-vitrine",
            title: "展示型网站",
            desc: "完整的在线形象，由本机构设计与管理——无管理后台：如需修改，请联系网站管理员。",
            features: [
              "域名与托管",
              "两个专业电子邮箱",
              "内置 AI 聊天机器人，基于网站内容作答",
              "首页、关于、服务、联系与图库页面",
              "商店页面（可选，用于产品展示）",
              "线索收集：表单发送至您的邮箱",
              "可按需增加页面（一、二、三级结构）",
              "包含 SEO 与谷歌收录",
              "前 6 个月免费排查漏洞与缺陷，之后移交全部密钥与权限",
            ],
          },
          {
            id: "web-dashboard",
            title: "带管理后台的网站",
            desc: "展示型网站的全部内容，外加管理后台：您自行管理内容、接收消息、衡量传播效果。",
            features: [
              "包含展示型网站的全部内容",
              "仅含一个管理员空间（增加管理员需另行计费）",
              "图库：栏目、分类、子分类、图片与视频",
              "服务页面可编辑或隐藏——不能新建服务页面",
              "首页与关于页面完全可编辑（不可新增按钮）",
              "网站消息三重接收：后台、邮箱与 WhatsApp",
              "网站可像应用一样下载安装",
              "博客：每月 1 篇，共含 12 篇——超出部分另行计费",
              "每篇新文章发布时向读者推送通知",
              "广告功能：向应用所有用户发送推送通知",
              "统计：应用下载量与通知阅读量",
              "合作期间全程负责修复缺陷",
            ],
          },
          {
            id: "web-custom",
            title: "定制网站",
            desc: "在带后台网站基础上，加入您所选的选项——共同配置，按需报价。",
            features: [
              "带后台网站的全部功能",
              "WhatsApp 聊天机器人，与客户保持实时联系",
              "为销售而训练的对话式聊天机器人——一位会卖货、会约访、会回填后台的在线销售",
              "增强版管理后台",
              "「社交网络」板块：您的帖子（视频、文章、照片）对应用用户可见",
              "博客加速：每月 3 或 5 篇，或按需定制（另行计费）",
              "任何其他功能均可按需添加",
            ],
          },
        ],
        renewalsTitle: "年度续费 — 域名与托管",
        renewals: [
          {
            id: "web-renewal-vitrine",
            title: "展示型网站",
            desc: "每年续费域名与托管，确保网站持续在线。",
          },
          {
            id: "web-renewal-dashboard",
            title: "带后台网站",
            desc: "每年续费域名与托管，确保网站持续在线。",
          },
        ],
        addon: {
          id: "web-payment-addon",
          title: "集成支付系统",
          desc: "按需在任何网站中集成支付系统：在套餐之外加收 1 000 000 GNF——展示型（总计 2 500 000 GNF）与带后台型（总计 4 500 000 GNF）均适用。",
        },
        optionsTitle: "选项与说明",
        options: [
          "所有类型网站均可增加页面：一、二、三级结构——一个服务页、每项服务一个子页，再往下是详细子页",
          "按业务提供专属空间：招聘、数据提交、学校的课程与活动等",
          "增加管理员：另行计费——带后台套餐仅含一个管理员空间",
          "如果您取回代码更换开发商，缺陷修复与维护由您自行负责",
        ],
        includedTitle: "每个网站均包含",
        included: [
          "域名与托管",
          "两个专业电子邮箱",
          "基于网站内容的 AI 聊天机器人",
          "线索收集表单（转发至您的邮箱）",
          "SEO 与谷歌收录",
          "明亮与深色模式，多语言网站",
        ],
        notesTitle: "条件与条款",
        notes: [
          "缺陷与漏洞：展示型网站前 6 个月免费排查，之后移交全部密钥与权限；带后台网站在合作期间全程负责。",
          "新增功能另行计费，且必须事先征得您的同意。",
          "标准博客：每月一篇文章（网站内含 12 篇）。超出部分——每月 3 或 5 篇或定制——另行计费。",
          "维持域名与托管的年度续费：500 000 GNF（展示型）或 700 000 GNF（带后台）。",
        ],
      },
      software: {
        sub: "量身定制开发，每个客户方案唯一——报价取决于所需功能，需专项沟通后确定。",
        cards: [
          {
            id: "software-custom",
            title: "定制软件 — 内部使用",
            desc: "贴合您流程的工具：多个管理员入口、内部功能、对业务的完整掌控。",
            features: [
              "流程梳理工作坊",
              "迭代开发，定期演示",
              "按需求集成功能",
              "为您的团队提供完整培训",
            ],
          },
          {
            id: "software-saas",
            title: "可商用 SaaS 软件",
            desc: "想把自己的软件卖给客户？我们从零设计完整产品，可直接上市销售。",
            features: [
              "多租户架构",
              "内置订阅与计费",
              "运营后台",
              "上市陪跑",
            ],
          },
          {
            id: "software-mobile",
            title: "移动应用",
            desc: "为您的团队或客户打造应用，视项目类型而定：先做个性化调研，再给出精确报价。",
            features: [
              "个性化需求调研",
              "原型设计与逐步确认",
              "上架应用商店",
              "团队培训与跟进",
            ],
          },
        ],
        note: "每个项目都独一无二：专项沟通之后，您将收到逐项列明的精确报价。",
      },
      saas: {
        sub: "七款即用型业务软件，从第一天起就为您的业务完成配置——每款均享 7 天免费试用。",
        workflowsTitle: "定制工作流设计",
        workflowsDesc:
          "在开箱即用的 SaaS 之外，我们设计定制工作流系统：您的业务流程端到端自动化，经需求评估后报价。",
      },
      community: {
        sub: "社交媒体账号代运营——帖子、短视频、广告——月度套餐清晰明了。基础托管平台：Facebook、TikTok、LinkedIn、Instagram。",
        cards: [
          {
            id: "community-essentiel",
            title: "基础套餐",
            desc: "每周保持曝光的基本配置。",
            features: [
              "每月 12 条标准帖子——每周 3 条，每条含文案与海报，由我们团队设计",
              "每月 8 条短视频——每周 2 条，每条 30 至 45 秒",
              "5 个平台：Facebook、Instagram、LinkedIn、TikTok 与 YouTube Shorts，视内容格式而定",
              "含广告投放：10 美元——一周投流预算，目标可选：获客、涨粉或点赞",
              "无实地团队：由您提供内容所需的照片与素材",
            ],
          },
          {
            id: "community-pro",
            title: "专业套餐",
            desc: "成长中品牌的节奏。",
            features: [
              "每月 20 条标准帖子——每周 5 条，含文案与海报",
              "每月 30 条短视频——每天 1 条，每条 30 至 45 秒",
              "多平台分发：标准帖子发 Facebook、Instagram 与 LinkedIn；视频发 Facebook Reels、LinkedIn、TikTok 与 YouTube Shorts",
              "含广告投放：每月 50 美元——预算分两周投放",
              "无实地团队：由您提供内容所需的照片与素材",
            ],
          },
          {
            id: "community-premium",
            title: "尊享套餐",
            desc: "我们的团队到现场为您创作内容。",
            features: [
              "每月 20 条标准帖子——每周 5 条，含文案与海报",
              "每月 30 至 90 条短视频——每天 1 至 3 条，每条 30 至 45 秒",
              "专属实地团队：每周 2 次到场拍摄您的业务活动",
              "含 5 支视频剪辑，专用于您的传播需求",
              "含广告投放：每月 100 美元——月度投流预算",
            ],
          },
        ],
        note: "内容创作与账号运营是两份不同的工作：我们的套餐将两者结合，可选配或不配实地团队。",
      },
      acquisition: {
        sub: "B2B 线索与潜在客户开发，按您的行业与目标国家执行——覆盖全球。",
        cards: [
          {
            id: "acq-leads",
            title: "B2B 线索开发",
            desc: "我们按您的行业与目标国家收集合格联系人并交付：由您的销售团队完成外呼跟进。",
            features: [
              "按行业与国家提供 B2B 联系人",
              "名单直接交付您的销售团队",
              "适配您市场的触达渠道——包括 LinkedIn",
            ],
          },
          {
            id: "acq-calling",
            title: "电话外呼代打",
            desc: "我们的团队替您致电：介绍您的服务，甄别有意向者，并将名单交还给您。",
            features: [
              "由我们的团队执行外呼",
              "向潜在客户介绍您的服务",
              "有意向的联系人名单交还您的团队",
              "严格跟进与详细报告",
            ],
          },
          {
            id: "acq-landing",
            title: "转化型落地页",
            desc: "一个页面，专为把广告投放变成实际联系人而设计。",
            features: [
              "以转化为导向的结构",
              "内置信息收集表单",
              "对接您的追踪工具",
            ],
          },
          {
            id: "acq-ads",
            title: "定制广告投放",
            desc: "围绕您的目标与预算设计并代管广告活动。",
            features: [
              "与您共同制定投放策略",
              "制作广告素材",
              "持续代管与调优",
              "媒体预算由客户承担",
            ],
          },
        ],
        note: "重要说明：我们保证所提供线索的质量与可靠性，而非其最终成交——转化仍需依靠您的销售团队。我们仅服务 B2B。",
      },
      training: {
        sub: "我们到企业内部为您的团队授课——围绕您的行业领域设计的战略培训，按需报价。",
        subjectsTitle: "我们的培训主题",
        subjects: [
          "客户获取战略——包括 LinkedIn 渠道",
          "电话外呼销售",
          "神经营销与销售战略",
          "客户忠诚度经营",
          "应用于您所在行业的人工智能",
        ],
        cards: [
          {
            id: "training-team",
            title: "企业团队内训",
            desc: "在分析您的需求与战略后设计课程，直接面向您的团队授课。",
            features: [
              "事前需求分析",
              "课程贴合您的行业",
              "面向团队的实操授课",
              "训后跟进，巩固所学",
            ],
          },
        ],
        note: "培训面向企业：我们培训您的团队，不招收个人学员。按需报价，20 000 000 GNF 起，经需求沟通后确定。",
      },
      strategy: {
        sub: "该服务尚未开通——即将上线。",
      },
    },
    faq: {
      label: "06.2 — 常见问题",
      title: "价格相关，",
      gold: "绝不含糊。",
      sub: "每次报价前客户最常问的问题。其余问题，我们的助手即刻作答。",
      items: [
        {
          q: "价格中途会变吗？",
          a: "不会。报价一经接受，金额即被锁定：中途不变。只有额外新增的功能才会加收费用——且必须事先征得您的同意。",
        },
        {
          q: "年度续费包含什么？",
          a: "网站的域名与托管：展示型网站每年 500 000 GNF，带后台网站每年 700 000 GNF。若不续费，域名与托管将会到期失效。",
        },
        {
          q: "交付之后谁负责修 bug？",
          a: "展示型网站：前 6 个月我们免费排查缺陷与漏洞，之后移交全部密钥与权限。带后台网站：合作期间全程负责。",
        },
        {
          q: "支付系统怎么算？",
          a: "按需在任何网站中集成支付系统：在套餐之外加收 1 000 000 GNF——展示型（总计 2 500 000 GNF）与带后台型（总计 4 500 000 GNF）均适用。",
        },
        {
          q: "我的网站可以有几个管理员？",
          a: "带后台网站仅含一个管理员空间。如需多个管理员，属于另行计费项目：聊聊您的组织架构，我们一起定价。",
        },
        {
          q: "付款怎么进行？",
          a: "按报价中约定的里程碑付款。每期付款都附有明细发票，绝无意外。",
        },
      ],
    },
    cta: {
      title: "需要核算预算？",
      gold: "索取详细报价。",
      sub: "用几行文字描述您的项目：我们将在 48 小时内回复逐项列明的报价单。",
      primaryLabel: "索取报价",
      secondaryLabel: "查看软件",
    },
    cross: {
      title: "继续探索",
      items: [
        {
          href: "/logiciels",
          title: "SaaS 软件",
          desc: "七款即用型管理工具，均享 7 天免费试用：开票、会计、医疗、学校、房产、药房、培训。",
        },
        {
          href: "/services",
          title: "服务",
          desc: "七个互补板块：网站、定制软件、SaaS、社交媒体运营、获客、培训与战略。",
        },
        {
          href: "/faq",
          title: "常见问题",
          desc: "工期、维护、语言、支持：最常见问题的清晰解答。",
        },
      ],
    },
  },

  de: {
    hero: {
      label: "06 — Preise",
      title: "Klare Preise,",
      gold: "vorab angekündigt.",
      sub: "Alle Beträge in guineischen Francs (GNF), exakt so, wie die Agentur sie mitteilt. Sehen Sie sich jeden Service an: Preis, Leistungen und Bedingungen stehen schwarz auf weiß.",
      chips: [
        "Beträge in GNF",
        "Ausdrückliche „ab“-Hinweise",
        "Verlängerung ab 500 000 GNF/Jahr",
      ],
    },
    groups: {
      web: {
        sub: "Drei Website-Kategorien, einmalige Zahlung bei Übergabe. SEO und Google-Indexierung sind bei allen unseren Websites inbegriffen.",
        cards: [
          {
            id: "web-vitrine",
            title: "Präsenz-Website",
            desc: "Ihre komplette Online-Präsenz, von der Agentur gestaltet und verwaltet — ohne Dashboard: Für jede Änderung beauftragen Sie einen Webmaster.",
            features: [
              "Domainname und Hosting",
              "Zwei professionelle E-Mail-Adressen",
              "Integrierter KI-Chatbot, gespeist durch den Inhalt der Website",
              "Seiten: Start, Über uns, Leistungen, Kontakt, Galerie",
              "Optionale Shop-Seite (Produktpräsentation)",
              "Lead-Erfassung: Formular an Ihre E-Mail gesendet",
              "Zusätzliche Seiten auf Anfrage (Strukturen der Stufen 1, 2, 3)",
              "SEO und Google-Indexierung inbegriffen",
              "Fehler und Schwachstellen während der ersten 6 Monate geprüft, danach Übergabe aller Schlüssel und Zugänge",
            ],
          },
          {
            id: "web-dashboard",
            title: "Website mit Dashboard",
            desc: "Alles aus der Präsenz-Website, plus Ihr eigenes Dashboard: Sie verwalten Ihre Inhalte selbst, empfangen Ihre Nachrichten und messen Ihre Reichweite.",
            features: [
              "Alles, was die Präsenz-Website enthält",
              "Ein einziger Administrationsbereich (weitere Administratoren: eigene Preisgestaltung)",
              "Galerie: Sektionen, Kategorien, Unterkategorien, Bilder und Videos",
              "Leistungsseiten bearbeitbar oder ausblendbar — ohne Anlegen neuer Leistungsseiten",
              "Start- und Über-uns-Seiten vollständig bearbeitbar (ohne zusätzliche Schaltflächen)",
              "Nachrichten der Website dreifach empfangen: Dashboard, E-Mail und WhatsApp",
              "Website als App herunterladbar",
              "Blog: 1 Artikel pro Monat, 12 integriert — darüber hinaus zusätzliche Abrechnung",
              "Benachrichtigungen an Leser bei jedem neuen Artikel",
              "Werbefunktion: Push-Benachrichtigung an alle Nutzer Ihrer App",
              "Statistiken: App-Downloads und Benachrichtigungsaufrufe",
              "Fehler während der gesamten Zusammenarbeit abgedeckt",
            ],
          },
          {
            id: "web-custom",
            title: "Individuell angepasste Website",
            desc: "Die Dashboard-Website, angereichert um die Optionen Ihrer Wahl — gemeinsam konfiguriert, auf Angebot kalkuliert.",
            features: [
              "Alle Funktionen der Dashboard-Website",
              "WhatsApp-Chatbot, um in ständigem Kontakt mit Ihren Kunden zu bleiben",
              "Für den Verkauf trainierter Conversational-Chatbot — ein Online-Verkäufer, der verkauft, Termine vereinbart und Ihr Dashboard speist",
              "Erweitertes Dashboard",
              "„Soziales Netzwerk“-Sektion: Ihre Beiträge (Videos, Artikel, Fotos) für die Nutzer Ihrer App sichtbar",
              "Beschleunigter Blog: 3 oder 5 Artikel pro Monat, oder maßgeschneidert (gegen Aufpreis)",
              "Jede weitere Funktion auf Anfrage",
            ],
          },
        ],
        renewalsTitle: "Jahresverlängerung — Domainname und Hosting",
        renewals: [
          {
            id: "web-renewal-vitrine",
            title: "Präsenz-Website",
            desc: "Jedes Jahr sichert die Verlängerung von Domain und Hosting den Fortbestand Ihrer Website.",
          },
          {
            id: "web-renewal-dashboard",
            title: "Website mit Dashboard",
            desc: "Jedes Jahr sichert die Verlängerung von Domain und Hosting den Fortbestand Ihrer Website.",
          },
        ],
        addon: {
          id: "web-payment-addon",
          title: "Integriertes Zahlungssystem",
          desc: "Auf Wunsch integrieren wir ein Zahlungssystem in jede Website: 1 000 000 GNF zusätzlich zum Paket — Präsenz-Website (2 500 000 GNF gesamt) wie Dashboard-Website (4 500 000 GNF gesamt).",
        },
        optionsTitle: "Optionen & Hinweise",
        options: [
          "Zusätzliche Seiten für alle Website-Typen: Strukturen der Stufen 1, 2 und 3 — eine Leistungsseite, eine Unterseite pro Leistung, dann die detaillierten Unterseiten",
          "Spezialisierte Bereiche je nach Tätigkeit: Recruiting, Dateneingabe, Programme und Aktivitäten einer Schule …",
          "Weitere Administratoren: eigene Preisgestaltung — das Dashboard-Paket enthält einen einzigen Administrationsbereich",
          "Wenn Sie den Code zurückholen, um den Entwickler zu wechseln, obliegen Fehlerbehebung und Wartung Ihnen",
        ],
        includedTitle: "In jeder Website enthalten",
        included: [
          "Domainname und Hosting",
          "Zwei professionelle E-Mail-Adressen",
          "KI-Chatbot, gespeist durch den Inhalt der Website",
          "Lead-Erfassungsformulare (an Ihre E-Mail weitergeleitet)",
          "SEO und Google-Indexierung",
          "Heller und dunkler Modus, mehrsprachige Website",
        ],
        notesTitle: "Bedingungen & Klauseln",
        notes: [
          "Fehler und Schwachstellen: bei einer Präsenz-Website während der ersten 6 Monate kostenlos geprüft, danach Übergabe aller Schlüssel und Zugänge; bei einer Dashboard-Website während der gesamten Zusammenarbeit abgedeckt.",
          "Das Hinzufügen neuer Funktionen wird zusätzlich abgerechnet — immer nach Ihrer Zustimmung.",
          "Standard-Blog: ein Artikel pro Monat (12 in der Website integriert). Darüber hinaus — 3 oder 5 pro Monat oder maßgeschneidert — zusätzliche Abrechnung.",
          "Jahresverlängerung für Domain und Hosting: 500 000 GNF (Präsenz) oder 700 000 GNF (Dashboard).",
        ],
      },
      software: {
        sub: "Maßgeschneiderte Entwicklung, einzigartig für jeden Kunden — die Kalkulation hängt von den gewünschten Funktionen ab und wird in einem eigenen Gespräch besprochen.",
        cards: [
          {
            id: "software-custom",
            title: "Individuelle Software — interne Nutzung",
            desc: "Ein Werkzeug für Ihre Prozesse: mehrere Admin-Zugänge, interne Funktionen, volle Steuerung Ihres Geschäfts.",
            features: [
              "Workshop zur Strukturierung Ihrer Prozesse",
              "Iterative Entwicklung mit regelmäßigen Demos",
              "Funktionen nach Ihrem Wunsch integriert",
              "Vollständige Schulung Ihrer Teams",
            ],
          },
          {
            id: "software-saas",
            title: "SaaS-Software zur Vermarktung",
            desc: "Sie möchten Ihre eigene Software an Ihre Kunden verkaufen? Wir entwerfen das komplette Produkt, verkaufsbereit.",
            features: [
              "Multi-Mandanten-Architektur",
              "Integrierte Abos und Abrechnung",
              "Betriebs-Dashboard",
              "Begleitung des Launches",
            ],
          },
          {
            id: "software-mobile",
            title: "Mobile Anwendung",
            desc: "Eine App für Ihre Teams oder Ihre Kunden, je nach Projekttyp: individuelle Studie, dann präzises Angebot.",
            features: [
              "Individuelle Analyse Ihres Bedarfs",
              "Mock-ups und schrittweise Freigaben",
              "Veröffentlichung in den App-Stores",
              "Schulung und Begleitung Ihrer Teams",
            ],
          },
        ],
        note: "Jedes Projekt ist einzigartig: Nach einem maßgeschneiderten Gespräch erhalten Sie ein präzises Angebot, Posten für Posten.",
      },
      saas: {
        sub: "Sieben einsatzbereite Fachlösungen, ab Tag eins für Ihre Tätigkeit konfiguriert — kostenloser 7-Tage-Test für jede.",
        workflowsTitle: "Maßgeschneidertes Workflow-Design",
        workflowsDesc:
          "Über die fertigen SaaS hinaus entwerfen wir individuelle Workflow-Systeme: Ihre Geschäftsprozesse von Ende zu Ende automatisiert, kalkuliert nach Analyse Ihres Bedarfs.",
      },
      community: {
        sub: "Die Verwaltung Ihrer Social Media — Beiträge, Kurzvideos, Werbung — mit klaren Monatspaketen. Basisbetreute Plattformen: Facebook, TikTok, LinkedIn, Instagram.",
        cards: [
          {
            id: "community-essentiel",
            title: "Paket Essentiell",
            desc: "Das Wesentliche, um jede Woche sichtbar zu bleiben.",
            features: [
              "12 Standardbeiträge pro Monat — 3 pro Woche, jeder mit Text und Plakat von unserem Team gestaltet",
              "8 Kurzvideos pro Monat — 2 pro Woche, 30 bis 45 Sekunden",
              "5 Plattformen: Facebook, Instagram, LinkedIn, TikTok und YouTube Shorts, je nach Inhaltsformat",
              "Werbung inklusive: 10 $ — gesponsertes Budget über eine Woche, Ziel nach Wahl: Leads, Follower oder Likes",
              "Ohne Außenteam: Sie liefern die Fotos und Unterlagen, die die Inhalte brauchen",
            ],
          },
          {
            id: "community-pro",
            title: "Paket Professionell",
            desc: "Das Tempo einer wachsenden Marke.",
            features: [
              "20 Standardbeiträge pro Monat — 5 pro Woche, mit Text und Plakat",
              "30 Kurzvideos pro Monat — 1 pro Tag, 30 bis 45 Sekunden",
              "Multiplattform-Verbreitung: Standardbeiträge auf Facebook, Instagram und LinkedIn; Videos auf Facebook Reels, LinkedIn, TikTok und YouTube Shorts",
              "Werbung inklusive: 50 $ pro Monat — Budget verteilt auf zwei Wochen",
              "Ohne Außenteam: Sie liefern die Fotos und Unterlagen, die die Inhalte brauchen",
            ],
          },
          {
            id: "community-premium",
            title: "Paket Premium",
            desc: "Unser Team erstellt Ihre Inhalte vor Ort.",
            features: [
              "20 Standardbeiträge pro Monat — 5 pro Woche, mit Text und Plakat",
              "30 bis 90 Kurzvideos pro Monat — 1 bis 3 Videos pro Tag, 30 bis 45 Sekunden",
              "Dediziertes Außenteam: 2 Einsätze pro Woche, um Ihre Aktivitäten zu fotografieren und zu filmen",
              "5 Videoschnitte inklusive, zugeschnitten auf Ihre Kommunikationsbedürfnisse",
              "Werbung inklusive: 100 $ pro Monat — monatlich gesponsertes Budget",
            ],
          },
        ],
        note: "Content-Erstellung und Social-Media-Verwaltung sind zwei getrennte Arbeiten: Unsere Pakete verbinden beides — mit oder ohne Außenteam.",
      },
      acquisition: {
        sub: "B2B-Lead- und Interessentengenerierung nach Ihrer Branche und Ihrem Zielland — weltweit.",
        cards: [
          {
            id: "acq-leads",
            title: "B2B-Leadgenerierung",
            desc: "Wir sammeln qualifizierte Kontakte nach Ihrer Branche und Ihrem Zielland und übergeben sie: Ihr Vertrieb führt die Akquiseanrufe durch.",
            features: [
              "B2B-Kontakte nach Branche und Land",
              "Listen direkt an Ihr Vertriebsteam übergeben",
              "Zu Ihrem Markt passende Kanäle — inklusive LinkedIn",
            ],
          },
          {
            id: "acq-calling",
            title: "Delegierte Telefonakquise",
            desc: "Unsere Teams rufen für Sie an: Sie präsentieren Ihre Leistungen, erkennen interessierte Personen und übergeben die Listen.",
            features: [
              "Akquiseanrufe durch unsere Teams",
              "Präsentation Ihrer Leistungen bei Interessenten",
              "Listen interessierter Kontakte zurück an Ihr Team",
              "Sorgfältige Nachverfolgung und detaillierte Berichte",
            ],
          },
          {
            id: "acq-landing",
            title: "Conversion-Landingpage",
            desc: "Eine einzige Seite, darauf ausgelegt, Ihre Kampagnen in konkrete Kontakte zu verwandeln.",
            features: [
              "Auf Conversion ausgerichtete Struktur",
              "Integriertes Erfassungsformular",
              "Anbindung an Ihre Tracking-Tools",
            ],
          },
          {
            id: "acq-ads",
            title: "Individuelle Werbekampagne",
            desc: "Konzeption und Steuerung von Kampagnen, angepasst an Ihre Ziele und Ihr Budget.",
            features: [
              "Kampagnenstrategie gemeinsam mit Ihnen definiert",
              "Erstellung der Werbemittel",
              "Laufende Steuerung und Anpassungen",
              "Medienbudget trägt der Kunde",
            ],
          },
        ],
        note: "Wichtiger Hinweis: Wir garantieren die Qualität und Zuverlässigkeit der generierten Kontakte, nicht deren Kaufabschluss — die Konversion bleibt Aufgabe Ihres Vertriebsteams. Wir sind im B2B tätig.",
      },
      training: {
        sub: "Wir schulen Ihre Teams im Unternehmen — strategische Schulungen, aufgebaut rund um Ihren Geschäftsbereich, auf Angebot.",
        subjectsTitle: "Unsere Schulungen",
        subjects: [
          "Kundengewinnungsstrategie — einschließlich über LinkedIn",
          "Telefonakquise",
          "Neuromarketing und Vertriebsstrategie",
          "Kundenbindung",
          "Künstliche Intelligenz angewandt auf Ihren Geschäftsbereich",
        ],
        cards: [
          {
            id: "training-team",
            title: "Team-Schulung im Unternehmen",
            desc: "Ein Programm, aufgebaut nach Analyse Ihrer Bedürfnisse und Ihrer Strategie, direkt vor Ihren Teams durchgeführt.",
            features: [
              "Vorab-Analyse Ihrer Bedürfnisse",
              "Programm angepasst an Ihre Branche",
              "Praktische Durchführung vor Ihren Teams",
              "Nachbereitung, um das Gelernte zu festigen",
            ],
          },
        ],
        note: "Schulungen für Unternehmen: Wir schulen Ihre Teams, keine Privatpersonen. Preisgestaltung auf Angebot, ab 20 000 000 GNF, nach Besprechung Ihres Bedarfs.",
      },
      strategy: {
        sub: "Dieser Service ist noch nicht verfügbar — er wird bald geöffnet.",
      },
    },
    faq: {
      label: "06.2 — Häufige Fragen",
      title: "Die Preise,",
      gold: "ohne Mehrdeutigkeit.",
      sub: "Die Fragen, die uns vor jedem Angebot gestellt werden. Für alles Weitere antwortet unser Assistent sofort.",
      items: [
        {
          q: "Können sich die Preise unterwegs ändern?",
          a: "Nein. Sobald das Angebot angenommen ist, ist der Betrag eingefroren: Er ändert sich nicht unterwegs. Nur zusätzlich angeforderte neue Funktionen werden extra abgerechnet — immer nach Ihrer Zustimmung.",
        },
        {
          q: "Was umfasst die Jahresverlängerung?",
          a: "Domainname und Hosting Ihrer Website: 500 000 GNF pro Jahr für eine Präsenz-Website, 700 000 GNF pro Jahr für eine Website mit Dashboard. Ohne diese Verlängerung laufen Domain und Hosting ab.",
        },
        {
          q: "Wer behebt Fehler nach der Übergabe?",
          a: "Bei einer Präsenz-Website prüfen wir Fehler und Schwachstellen während der ersten 6 Monate und übergeben dann alle Schlüssel und Zugänge. Bei einer Dashboard-Website sind Fehler während der gesamten Zusammenarbeit abgedeckt.",
        },
        {
          q: "Und ein Zahlungssystem?",
          a: "Auf Wunsch integrieren wir ein Zahlungssystem in jede Website: 1 000 000 GNF zusätzlich zum Paket — Präsenz-Website (2 500 000 GNF gesamt) wie Dashboard-Website (4 500 000 GNF gesamt).",
        },
        {
          q: "Wie viele Administratoren für meine Website?",
          a: "Die Dashboard-Website enthält einen einzigen Administrationsbereich. Wenn Sie mehrere Administratoren wünschen, handelt es sich um eine eigene Preisgestaltung: Sprechen wir über Ihre Organisation, dann kalkulieren wir gemeinsam.",
        },
        {
          q: "Wie läuft die Zahlung?",
          a: "In Etappen, festgelegt im Angebot. Jede Fälligkeit wird von einer detaillierten Rechnung begleitet — ohne Überraschungen.",
        },
      ],
    },
    cta: {
      title: "Ein Budget festzurren?",
      gold: "Fordern Sie ein detailliertes Angebot an.",
      sub: "Beschreiben Sie Ihr Projekt in wenigen Zeilen: Wir melden uns innerhalb von 48 Stunden mit einem Angebot zurück, Posten für Posten.",
      primaryLabel: "Angebot anfordern",
      secondaryLabel: "Software ansehen",
    },
    cross: {
      title: "Auch entdecken",
      items: [
        {
          href: "/logiciels",
          title: "SaaS-Software",
          desc: "Sieben einsatzbereite Management-Tools, mit kostenlosem 7-Tage-Test: Fakturierung, Buchhaltung, Gesundheit, Schule, Immobilien, Apotheke, Schulung.",
        },
        {
          href: "/services",
          title: "Leistungen",
          desc: "Sieben sich ergänzende Säulen: Websites, individuelle Software, SaaS, Social-Media-Management, Kundengewinnung, Schulungen und Strategie.",
        },
        {
          href: "/faq",
          title: "FAQ",
          desc: "Fristen, Wartung, Sprachen, Support: klare Antworten auf die häufigsten Fragen.",
        },
      ],
    },
  },
};
