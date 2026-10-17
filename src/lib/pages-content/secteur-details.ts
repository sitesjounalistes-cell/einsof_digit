/**
 * Contenu des 14 landing pages `/secteurs/[slug]` — SEO longue traîne
 * (« site web pour hôtel en Guinée », « logiciel pour clinique en
 * Guinée »…). Français uniquement : ces pages visent le marché guinéen.
 *
 * ⚠ RÈGLE TARIFS (catalogue officiel, aucun prix inventé) :
 *   - site web vitrine dès 1 500 000 GNF
 *   - site avec tableau de bord 3 500 000 GNF
 *   - SaaS de gestion avec essai gratuit 7 jours
 *   - Factura Pro 100 000 GNF/mois
 *   - logiciel sur mesure dès 20 000 000 GNF
 *   - application mobile dès 20 000 000 GNF
 *   - community management dès 1 500 000 GNF/mois
 *   Tout le reste = « sur devis ».
 *
 * Les `slug` DOIVENT correspondre exactement à SECTOR_SEO (src/lib/seo.ts).
 */

export interface SecteurOffer {
  /** nom de composant Lucide (résolu via une map string → composant) */
  icon: string;
  title: string;
  desc: string;
}

export interface SecteurFaqItem {
  q: string;
  a: string;
}

export interface SecteurCrossLink {
  href: string;
  title: string;
  desc: string;
}

export interface SecteurDetail {
  /** identique à SECTOR_SEO[n].slug */
  slug: string;
  heroTitle: string;
  heroGold: string;
  heroSub: string;
  /** 2 paragraphes riches en mots-clés (« en Guinée » / « à Conakry ») */
  intro: string[];
  /** 4 offres : site web / logiciel ou SaaS / community management / leads */
  offers: SecteurOffer[];
  /** 3-4 réalités du terrain */
  terrain: string[];
  /** 3 questions longue traîne */
  faq: SecteurFaqItem[];
  /** 2-3 liens internes (maillage) */
  crossLinks: SecteurCrossLink[];
}

/* ── Index du maillage interne (page /secteurs) ──────────────────── */

export interface SectorIndexEntry {
  slug: string;
  /** libellé identique à SECTOR_SEO[n].name */
  name: string;
  /** nom de composant Lucide */
  icon: string;
  /** micro-descriptif d'une ligne (carte du maillage) */
  tagline: string;
}

export const SECTOR_INDEX: SectorIndexEntry[] = [
  {
    slug: "sante-pharmacie",
    name: "Santé & pharmacie",
    icon: "HeartPulse",
    tagline: "Sites pour cliniques et SaaS de gestion hospitalière.",
  },
  {
    slug: "education-formation",
    name: "Éducation & formation",
    icon: "GraduationCap",
    tagline: "Sites d'écoles et logiciel de scolarité.",
  },
  {
    slug: "immobilier",
    name: "Immobilier",
    icon: "Building2",
    tagline: "Catalogue de biens en ligne et gestion des loyers.",
  },
  {
    slug: "commerce-distribution",
    name: "Commerce & distribution",
    icon: "ShoppingCart",
    tagline: "Boutique en ligne, caisse, stock et facturation.",
  },
  {
    slug: "hotellerie-tourisme",
    name: "Hôtellerie & tourisme",
    icon: "BedDouble",
    tagline: "Sites d'hôtels et visibilité sur Google.",
  },
  {
    slug: "banque-microfinance",
    name: "Banque & microfinance",
    icon: "Landmark",
    tagline: "Logiciels de gestion des prêts et sites sécurisés.",
  },
  {
    slug: "btp-construction",
    name: "BTP & construction",
    icon: "HardHat",
    tagline: "Références en ligne et suivi de chantiers.",
  },
  {
    slug: "ong-institutions",
    name: "ONG & institutions",
    icon: "HandHeart",
    tagline: "Sites multilingues et rapports pour bailleurs.",
  },
  {
    slug: "transport-logistique",
    name: "Transport & logistique",
    icon: "Truck",
    tagline: "Suivi des expéditions et sites de transport.",
  },
  {
    slug: "agriculture-agro",
    name: "Agriculture & agro-industrie",
    icon: "Tractor",
    tagline: "Suivi de production et mise en relation acheteurs.",
  },
  {
    slug: "mines-energie",
    name: "Mines & énergie",
    icon: "Pickaxe",
    tagline: "Reporting multi-sites et sites institutionnels.",
  },
  {
    slug: "medias",
    name: "Médias",
    icon: "Newspaper",
    tagline: "Plateformes d'information rapides et monétisables.",
  },
  {
    slug: "telecoms-evenementiel",
    name: "Télécoms & événementiel",
    icon: "Signal",
    tagline: "Billetterie en ligne et communication d'événements.",
  },
  {
    slug: "recrutement",
    name: "Recrutement",
    icon: "Users",
    tagline: "Plateformes d'offres d'emploi et de candidatures.",
  },
];

/* ── Détails par secteur ─────────────────────────────────────────── */

export const SECTEUR_DETAILS: Record<string, SecteurDetail> = {
  "sante-pharmacie": {
    slug: "sante-pharmacie",
    heroTitle: "Le digital au service de la santé",
    heroGold: "en Guinée.",
    heroSub:
      "Sites web pour cliniques, cabinets et pharmacies, SaaS de gestion hospitalière, suivi des stocks de médicaments : des outils pensés pour les réalités du terrain guinéen.",
    intro: [
      "En Guinée, la gestion d'une clinique, d'un cabinet médical ou d'une pharmacie repose encore trop souvent sur le papier. Dossiers patients égarés, rendez-vous confirmés au téléphone un par un, stocks de médicaments suivis à la main : chaque erreur se paie en santé comme en trésorerie. À Conakry comme à l'intérieur du pays, EINSOF équipe les structures de santé avec des outils simples, conçus pour rester utilisables même quand la connexion faiblit.",
      "Nous livrons un SaaS de gestion hospitalière prêt à l'emploi — dossiers patients, rendez-vous, facturation — avec essai gratuit de 7 jours, ainsi que des sites web vitrines dès 1 500 000 GNF pour présenter vos services, vos horaires et votre équipe. Pour des besoins plus larges (laboratoire, imagerie, multi-établissements), nous concevons un logiciel sur mesure dès 20 000 000 GNF, étudié directement avec vos praticiens.",
    ],
    offers: [
      {
        icon: "Stethoscope",
        title: "Site web pour clinique ou cabinet",
        desc: "Présentez vos spécialités, vos praticiens, vos horaires et votre localisation. Site vitrine dès 1 500 000 GNF, référencé sur Google et Google Maps pour les recherches locales.",
      },
      {
        icon: "ClipboardList",
        title: "SaaS de gestion hospitalière",
        desc: "Dossiers patients, rendez-vous et facturation dans un seul outil, avec essai gratuit de 7 jours. Accessible depuis mobile et ordinateur, même en connexion limitée.",
      },
      {
        icon: "Pill",
        title: "Gestion de pharmacie",
        desc: "Suivi des stocks de médicaments, péremptions, ventes et marges : un SaaS de gestion adapté aux officines guinéennes, avec essai gratuit de 7 jours.",
      },
      {
        icon: "Megaphone",
        title: "Community management santé",
        desc: "Campagnes de sensibilisation, pages réseaux sociaux et réputation en ligne dès 1 500 000 GNF/mois. Génération de patients par référencement local et landing pages : sur devis.",
      },
    ],
    terrain: [
      "Dossiers patients souvent papier : la moindre erreur coûte cher, en santé comme en trésorerie.",
      "Rappels de rendez-vous passés au téléphone, un par un, sans historique fiable.",
      "Stocks de pharmacie suivis à la main : ruptures et péremptions découvertes trop tard.",
      "Connexion instable : vos outils doivent rester utilisables même quand Internet faiblit.",
    ],
    faq: [
      {
        q: "Combien coûte un site web pour une clinique en Guinée ?",
        a: "Un site vitrine pour clinique démarre à 1 500 000 GNF, domaine et hébergement inclus la première année. Si vous souhaitez gérer vous-même le contenu — actualités, plannings, recrutements — le site avec tableau de bord coûte 3 500 000 GNF. Les fonctions spécifiques comme la prise de rendez-vous en ligne font l'objet d'un devis.",
      },
      {
        q: "Existe-t-il un logiciel de gestion hospitalière adapté aux cliniques guinéennes ?",
        a: "Oui : notre SaaS de gestion hospitalière couvre les dossiers patients, les rendez-vous et la facturation, avec essai gratuit de 7 jours. Il fonctionne depuis un navigateur, sur mobile comme sur ordinateur. Pour un besoin plus large — laboratoire, imagerie, multi-sites — nous développons un logiciel sur mesure dès 20 000 000 GNF.",
      },
      {
        q: "Comment attirer plus de patients vers mon cabinet à Conakry ?",
        a: "Trois leviers : un site web indexé sur Google et Google Maps, une fiche d'établissement soignée avec avis, et une communication régulière sur les réseaux sociaux. Notre forfait community management démarre à 1 500 000 GNF/mois ; les campagnes de génération de patients se chiffrent sur devis.",
      },
    ],
    crossLinks: [
      {
        href: "/logiciels",
        title: "Logiciels SaaS",
        desc: "Gestion hospitalière et gestion de pharmacie prêtes à l'emploi, avec essai gratuit de 7 jours.",
      },
      {
        href: "/services/web",
        title: "Création de site web",
        desc: "Site vitrine dès 1 500 000 GNF ou site avec tableau de bord à 3 500 000 GNF, hébergement inclus.",
      },
      {
        href: "/tarifs",
        title: "Tarifs",
        desc: "Tous nos prix annoncés d'avance, en GNF : sites web, logiciels, SaaS et services digitaux.",
      },
    ],
  },

  "education-formation": {
    slug: "education-formation",
    heroTitle: "Le digital au service de l'éducation",
    heroGold: "en Guinée.",
    heroSub:
      "Logiciel de gestion d'école, site web pour établissements et centres de formation, communication avec les parents : des outils simples pour les équipes administratives guinéennes.",
    intro: [
      "Inscriptions gérées en paperasse, suivi des paiements de scolarité dispersé entre cahiers et reçus, communication avec les parents limitée à quelques appels : les établissements scolaires guinéens perdent un temps considérable dans des tâches qui peuvent être informatisées. EINSOF équipe écoles privées, universités et centres de formation à Conakry et dans toutes les régions, avec des outils que les équipes non technophiles prennent en main en quelques jours.",
      "Notre SaaS de gestion d'école couvre les inscriptions, les classes, les notes et les paiements de scolarité, avec essai gratuit de 7 jours et formation des équipes administratives à la livraison. Côté visibilité, un site web vitrine dès 1 500 000 GNF présente votre établissement, vos filières et vos résultats, avec formulaire d'admission en ligne. Un logiciel sur mesure dès 20 000 000 GNF couvre les besoins spécifiques : bulletins, enseignants, multi-sites.",
    ],
    offers: [
      {
        icon: "GraduationCap",
        title: "Site web pour école ou université",
        desc: "Présentez votre établissement, vos filières, vos actualités et vos réussites. Site vitrine dès 1 500 000 GNF, avec formulaire d'admission en ligne.",
      },
      {
        icon: "School",
        title: "Logiciel de gestion d'école",
        desc: "SaaS de gestion : inscriptions, classes, notes, paiements de scolarité. Essai gratuit 7 jours, formation des équipes administratives à la livraison.",
      },
      {
        icon: "Megaphone",
        title: "Communication de rentrée",
        desc: "Community management dès 1 500 000 GNF/mois : pages réseaux sociaux, annonces de rentrée, valorisation des résultats de vos élèves.",
      },
      {
        icon: "Target",
        title: "Attirer les candidatures",
        desc: "Référencement local, campagnes ciblées parents et landing pages d'admission pour remplir vos classes dès la rentrée : offre chiffrée sur devis.",
      },
    ],
    terrain: [
      "Inscriptions gérées en paperasse : dossiers dupliqués, informations introuvables.",
      "Suivi des paiements de scolarité dispersé entre cahiers et reçus.",
      "Communication avec les parents limitée à quelques appels.",
      "Équipes administratives peu formées à l'informatique : la prise en main doit être immédiate.",
    ],
    faq: [
      {
        q: "Combien coûte un site web pour une école privée en Guinée ?",
        a: "Un site vitrine pour école démarre à 1 500 000 GNF, avec domaine et hébergement inclus la première année. Pour gérer vous-même les actualités, les formulaires d'admission et les annonces, le site avec tableau de bord coûte 3 500 000 GNF. Les fonctions avancées — portail parents, paiement en ligne — se chiffrent sur devis.",
      },
      {
        q: "Comment informatiser la gestion des inscriptions et de la scolarité ?",
        a: "Avec notre SaaS de gestion d'école : inscriptions, classes, notes et paiements centralisés dans un seul outil, avec essai gratuit de 7 jours. Les paiements de scolarité sont suivis élève par élève, sans cahier. Nous formons vos équipes administratives à la livraison pour que l'outil soit réellement utilisé.",
      },
      {
        q: "Le logiciel de gestion d'école fonctionne-t-il quand Internet est instable ?",
        a: "Oui : nos outils sont conçus pour le terrain guinéen. L'interface reste légère et accessible depuis un simple mobile, et les données se resynchronisent dès que la connexion revient. Nos équipes assurent aussi un suivi à distance dans toutes les régions de Guinée, sans déplacement obligatoire.",
      },
    ],
    crossLinks: [
      {
        href: "/logiciels",
        title: "Logiciels SaaS",
        desc: "Gestion d'école et gestion de formation prêts à l'emploi, avec essai gratuit de 7 jours.",
      },
      {
        href: "/services/web",
        title: "Création de site web",
        desc: "Site vitrine dès 1 500 000 GNF ou site avec tableau de bord à 3 500 000 GNF pour publier vous-même.",
      },
      {
        href: "/contact",
        title: "Demander un devis",
        desc: "Décrivez votre établissement : nous vous répondons avec une proposition précise.",
      },
    ],
  },

  immobilier: {
    slug: "immobilier",
    heroTitle: "Sites et logiciels pour l'immobilier",
    heroGold: "en Guinée.",
    heroSub:
      "Catalogue de biens en ligne, logiciel de gestion des loyers et des locataires, visibilité Google : équipez votre agence immobilière à Conakry et dans tout le pays.",
    intro: [
      "Biens gérés sur plusieurs carnets, dossiers locataires au format papier, suivi des loyers fait manuellement et souvent après échéance : la gestion immobilière en Guinée demande une rigueur que le papier ne tient plus. Pendant ce temps, les acheteurs et les locataires — expatriés, diaspora, entreprises — cherchent d'abord en ligne. Une agence sans vitrine numérique perd des mandats chaque semaine.",
      "EINSOF propose aux agences immobilières de Conakry et de l'intérieur du pays un site vitrine dès 1 500 000 GNF avec catalogue de biens, photos et demandes de visite, ou un site à 3 500 000 GNF avec tableau de bord pour gérer le catalogue vous-même. Notre SaaS de gestion immobilière — biens, baux, locataires, loyers — est livré avec essai gratuit de 7 jours. Pour des portefeuilles étendus ou la promotion immobilière, un logiciel sur mesure dès 20 000 000 GNF est étudié avec vous.",
    ],
    offers: [
      {
        icon: "Building2",
        title: "Site vitrine d'agence immobilière",
        desc: "Catalogue de biens avec photos, quartiers et demandes de visite en ligne. Site vitrine dès 1 500 000 GNF, site avec tableau de bord à 3 500 000 GNF.",
      },
      {
        icon: "Home",
        title: "Logiciel de gestion immobilière",
        desc: "SaaS de gestion : biens, baux, locataires, loyers et relances. Essai gratuit 7 jours, tableau de bord des revenus bien par bien.",
      },
      {
        icon: "Megaphone",
        title: "Valorisation des biens",
        desc: "Community management dès 1 500 000 GNF/mois : visuels soignés, vidéos de visites, promotion sur Facebook et Instagram pour vendre plus vite.",
      },
      {
        icon: "Target",
        title: "Prospects acquéreurs et locataires",
        desc: "Génération de leads qualifiés : publicité locale, landing pages par bien, suivi des demandes de visite jusqu'à la signature. Sur devis.",
      },
    ],
    terrain: [
      "Biens gérés sur plusieurs sites et carnets : informations dispersées, mandats plus lents.",
      "Dossiers locataires au format papier, baux difficiles à retrouver au moment du litige.",
      "Suivi des loyers fait manuellement, souvent après l'échéance.",
      "Les acheteurs et la diaspora cherchent d'abord en ligne : sans site, votre portefeuille reste invisible.",
    ],
    faq: [
      {
        q: "Combien coûte un site web pour une agence immobilière en Guinée ?",
        a: "Un site vitrine avec catalogue de biens démarre à 1 500 000 GNF. Pour administrer vous-même le catalogue, les photos et les demandes de visite, le site avec tableau de bord coûte 3 500 000 GNF. Les options — visite virtuelle, multilingue, paiement — se chiffrent sur devis.",
      },
      {
        q: "Comment suivre les loyers et les locataires sans classeur ?",
        a: "Avec notre SaaS de gestion immobilière : biens, baux, échéances de loyer et relances centralisés, avec essai gratuit de 7 jours. Vous voyez les retards en temps réel et le tableau de bord des revenus, bien par bien. Les loyers ne tombent plus dans l'oubli.",
      },
      {
        q: "Peut-on vendre ou louer plus vite grâce à Internet en Guinée ?",
        a: "Oui : un catalogue en ligne indexé sur Google attire les recherches locales comme celles de la diaspora, et des photos de qualité doublent l'impact d'une annonce. Nos forfaits community management dès 1 500 000 GNF/mois et nos campagnes de génération de leads (sur devis) accélèrent encore les ventes.",
      },
    ],
    crossLinks: [
      {
        href: "/logiciels",
        title: "Logiciels SaaS",
        desc: "Gestion immobilière prête à l'emploi : biens, baux, loyers. Essai gratuit de 7 jours.",
      },
      {
        href: "/services/web",
        title: "Création de site web",
        desc: "Site vitrine dès 1 500 000 GNF ou site avec tableau de bord à 3 500 000 GNF, catalogue de biens inclus.",
      },
      {
        href: "/tarifs",
        title: "Tarifs",
        desc: "Tous nos prix annoncés d'avance, en GNF : sites web, logiciels, SaaS et services digitaux.",
      },
    ],
  },

  "commerce-distribution": {
    slug: "commerce-distribution",
    heroTitle: "Commerce & distribution",
    heroGold: "vendez plus, partout.",
    heroSub:
      "Boutique en ligne, logiciel de facturation, caisse et stock synchronisés : des outils pour vendre au-delà du quartier, de Conakry à l'intérieur du pays.",
    intro: [
      "Stock réparti entre dépôt et boutiques, ventes consignées sur cahier, marges réelles connues seulement à la fin du mois : les commerces guinéens volent à l'aveugle. Ajoutez des commandes reçues sur WhatsApp sans trace ni historique, et la croissance devient un pari. EINSOF équipe commerces et distributeurs à Conakry et dans toutes les régions avec des outils qui rendent chaque vente visible.",
      "Notre SaaS de caisse et de stock synchronisé suit les ventes, les marges et les inventaires en temps réel, avec essai gratuit de 7 jours ; pour la facturation, Factura Pro à 100 000 GNF/mois génère factures et reçus en un clic. Côté canaux, une boutique en ligne — site vitrine dès 1 500 000 GNF, tableau de bord à 3 500 000 GNF — ouvre votre catalogue à tout le pays, et le community management dès 1 500 000 GNF/mois anime vos ventes sur Facebook et Instagram.",
    ],
    offers: [
      {
        icon: "ShoppingCart",
        title: "Boutique en ligne",
        desc: "Vendez au-delà de votre quartier : catalogue produits, commandes et paiement en ligne. Site vitrine dès 1 500 000 GNF, tableau de bord à 3 500 000 GNF.",
      },
      {
        icon: "Package",
        title: "Caisse, stock et facturation",
        desc: "SaaS de caisse et de stock synchronisé multi-boutiques avec rapports de marges en temps réel. Factura Pro pour les factures et reçus : 100 000 GNF/mois.",
      },
      {
        icon: "Megaphone",
        title: "Community management commerce",
        desc: "Dès 1 500 000 GNF/mois : visuels produits, promotions, animation quotidienne de Facebook et Instagram pour remplir la boutique.",
      },
      {
        icon: "Target",
        title: "Génération de commandes",
        desc: "Campagnes publicitaires ciblées, landing pages par produit et suivi des prospects jusqu'à la vente : offre chiffrée sur devis.",
      },
    ],
    terrain: [
      "Stock réparti entre dépôt et boutiques, sans vue d'ensemble fiable.",
      "Ventes consignées sur cahier : marges réelles connues en fin de mois seulement.",
      "Commandes reçues sur WhatsApp, sans trace ni historique client.",
      "Fournisseurs et livraisons pilotés au téléphone, sans planning partagé.",
    ],
    faq: [
      {
        q: "Combien coûte une boutique en ligne en Guinée ?",
        a: "Une boutique en ligne démarre au prix d'un site vitrine, dès 1 500 000 GNF, avec catalogue et commandes. Si vous voulez gérer les produits vous-même, le site avec tableau de bord coûte 3 500 000 GNF. L'intégration du paiement en ligne et les options avancées se chiffrent sur devis.",
      },
      {
        q: "Quel logiciel pour gérer le stock et la facturation d'un commerce ?",
        a: "Notre SaaS de caisse et de stock synchronise dépôt et boutiques, avec rapports de ventes et de marges en temps réel et essai gratuit de 7 jours. Pour la facturation seule, Factura Pro coûte 100 000 GNF/mois et génère factures et reçus depuis un mobile comme depuis un ordinateur.",
      },
      {
        q: "Comment vendre au-delà de Conakry, jusqu'à l'intérieur du pays ?",
        a: "Un catalogue en ligne indexé sur Google, une animation régulière des réseaux sociaux et des campagnes ciblées par région. Notre community management démarre à 1 500 000 GNF/mois ; les campagnes publicitaires et la génération de commandes se chiffrent sur devis selon vos volumes.",
      },
    ],
    crossLinks: [
      {
        href: "/logiciels",
        title: "Logiciels SaaS",
        desc: "Factura Pro (100 000 GNF/mois) et SaaS de gestion : caisse, stock, comptabilité. Essai gratuit 7 jours.",
      },
      {
        href: "/services/web",
        title: "Création de site web",
        desc: "Site vitrine dès 1 500 000 GNF ou boutique avec tableau de bord à 3 500 000 GNF.",
      },
      {
        href: "/tarifs",
        title: "Tarifs",
        desc: "Tous nos prix annoncés d'avance, en GNF : sites web, logiciels, SaaS et services digitaux.",
      },
    ],
  },

  "hotellerie-tourisme": {
    slug: "hotellerie-tourisme",
    heroTitle: "Hôtellerie & tourisme",
    heroGold: "recevez le monde entier.",
    heroSub:
      "Site web pour hôtels, auberges et restaurants, réservation en ligne, visibilité Google : transformez les voyageurs de passage en clients, avant même leur arrivée en Guinée.",
    intro: [
      "Les voyageurs comparent les établissements en ligne avant de réserver : sans site, votre hôtel, votre auberge ou votre restaurant n'existe tout simplement pas dans leur décision. En Guinée, les réservations sont encore prises au téléphone ou sur WhatsApp, sans planning centralisé, et les avis clients restent sans réponse alors qu'ils décident de la saison suivante.",
      "EINSOF crée des sites web d'hôtellerie dès 1 500 000 GNF : chambres, services, galerie photos, localisation et avis — le site avec tableau de bord à 3 500 000 GNF vous laisse gérer le contenu vous-même. Le module de réservation en ligne se chiffre sur devis, et l'application mobile dédiée démarre à 20 000 000 GNF. Pour la facturation courante, Factura Pro à 100 000 GNF/mois suffit à la réception ; pour un logiciel de gestion complet, nous étudions un sur mesure dès 20 000 000 GNF.",
    ],
    offers: [
      {
        icon: "BedDouble",
        title: "Site web d'hôtel ou d'auberge",
        desc: "Chambres, services, galerie photos, localisation et avis. Site vitrine dès 1 500 000 GNF, réservation en ligne sur devis.",
      },
      {
        icon: "UtensilsCrossed",
        title: "Outils de gestion de réception",
        desc: "Suivi des réservations et de la facturation : Factura Pro à 100 000 GNF/mois pour les reçus, ou logiciel sur mesure dès 20 000 000 GNF pour un établissement complet.",
      },
      {
        icon: "Megaphone",
        title: "Animation et réputation",
        desc: "Community management dès 1 500 000 GNF/mois : contenus, avis Google, promotion des week-ends, menus et événements de la saison.",
      },
      {
        icon: "Target",
        title: "Remplir vos chambres",
        desc: "Référencement local, campagnes ciblées diaspora et entreprises, landing pages saisonnières : offre chiffrée sur devis.",
      },
    ],
    terrain: [
      "Les voyageurs comparent en ligne avant de réserver : sans site, vous n'existez pas.",
      "Réservations prises au téléphone ou sur WhatsApp, sans planning centralisé.",
      "Avis clients non suivis : une mauvaise note peut tuer la saison suivante.",
      "Haute et basse saison : la communication doit s'ajuster vite, semaine après semaine.",
    ],
    faq: [
      {
        q: "Combien coûte un site web pour un hôtel en Guinée ?",
        a: "Un site vitrine pour hôtel démarre à 1 500 000 GNF : chambres, services, photos, localisation et avis. Pour gérer vous-même le contenu, le site avec tableau de bord coûte 3 500 000 GNF. Le module de réservation en ligne et les options se chiffrent sur devis selon votre organisation.",
      },
      {
        q: "Comment être visible sur Google quand on cherche un hôtel à Conakry ?",
        a: "Trois fondations : un site rapide et indexé, une fiche d'établissement Google soignée avec photos et avis, et une communication régulière qui prouve que l'hôtel est actif. Nous montons ce dispositif avec vous ; l'entretien des réseaux démarre à 1 500 000 GNF/mois en community management.",
      },
      {
        q: "Peut-on prendre les réservations en ligne en Guinée ?",
        a: "Oui : formulaire de réservation avec confirmation, ou module dédié synchronisé avec votre réception — le chiffrage dépend de votre organisation et se fait sur devis. Un chatbot WhatsApp peut aussi prendre les demandes 24 h/24 ; une application mobile dédiée démarre à 20 000 000 GNF.",
      },
    ],
    crossLinks: [
      {
        href: "/services/web",
        title: "Création de site web",
        desc: "Site vitrine dès 1 500 000 GNF ou site avec tableau de bord à 3 500 000 GNF, réservation en option.",
      },
      {
        href: "/logiciels",
        title: "Logiciels SaaS",
        desc: "Factura Pro et SaaS de gestion pour la réception, avec essai gratuit de 7 jours.",
      },
      {
        href: "/contact",
        title: "Demander un devis",
        desc: "Parlez-nous de votre établissement : nous proposons le dispositif adapté à votre saisonnalité.",
      },
    ],
  },

  "banque-microfinance": {
    slug: "banque-microfinance",
    heroTitle: "Banque & microfinance",
    heroGold: "au niveau de vos exigences.",
    heroSub:
      "Logiciels sur mesure pour la gestion des prêts et des échéanciers, sites institutionnels sécurisés, tableaux de bord du portefeuille : des outils fiables pour un secteur sans marge d'erreur.",
    intro: [
      "Portefeuille clients étendu, échéances de remboursement suivies manuellement, exigences de reporting d'un niveau que le papier ne tient plus : les institutions de microfinance et les banques guinéennes ont besoin d'outils dont la fiabilité n'est pas négociable. Les données clients, les accès et les historiques ne se confient pas à n'importe quel système.",
      "EINSOF développe pour les institutions financières de Guinée des logiciels sur mesure dès 20 000 000 GNF : gestion des prêts, échéanciers, impayés, reporting consolidé et tableaux de bord du portefeuille en temps réel. Votre image mérite la même rigueur : un site institutionnel dès 1 500 000 GNF — ou 3 500 000 GNF avec tableau de bord — présente vos produits dans un cadre sécurisé, et les fonctions avancées se chiffrent sur devis.",
    ],
    offers: [
      {
        icon: "Landmark",
        title: "Site institutionnel sécurisé",
        desc: "Image solide, produits, actualités et agences. Site vitrine dès 1 500 000 GNF, site avec tableau de bord à 3 500 000 GNF, fonctions avancées sur devis.",
      },
      {
        icon: "Database",
        title: "Logiciel de gestion des prêts",
        desc: "Développement sur mesure dès 20 000 000 GNF : échéanciers, impayés, reporting et tableau de bord du portefeuille en temps réel.",
      },
      {
        icon: "Megaphone",
        title: "Communication institutionnelle",
        desc: "Community management dès 1 500 000 GNF/mois : produits financiers, éducation financière, image de marque auprès du public.",
      },
      {
        icon: "Target",
        title: "Acquisition de clients",
        desc: "Campagnes de sensibilisation et génération de prospects pour vos agences : dispositif étudié et chiffré sur devis.",
      },
    ],
    terrain: [
      "Échéances de remboursement suivies manuellement : les retards se découvrent trop tard.",
      "Exigences de reporting que le papier ne tient plus, agence après agence.",
      "Agences en ville comme à l'intérieur : les données doivent être centralisées et fiables.",
      "Sécurité : les accès et les données clients ne se confient pas à n'importe quel outil.",
    ],
    faq: [
      {
        q: "Quel logiciel pour gérer un portefeuille de microfinance en Guinée ?",
        a: "Un logiciel sur mesure développé dès 20 000 000 GNF : dossiers de prêts, échéanciers, impayés et reporting consolidé, avec des accès différenciés par rôle. Après une étude personnalisée de vos processus, nous chiffrons précisément le projet sur devis avant tout engagement.",
      },
      {
        q: "Combien coûte un site web pour une institution financière en Guinée ?",
        a: "Un site institutionnel vitrine démarre à 1 500 000 GNF ; avec tableau de bord pour gérer vous-même les contenus, comptez 3 500 000 GNF. Les fonctions avancées — espace client, multilingue, intégrations — se chiffrent sur devis, avec une attention particulière à la sécurité.",
      },
      {
        q: "Vos outils respectent-ils la confidentialité des données clients ?",
        a: "Oui : accès nominatifs et différenciés, sauvegardes régulières et bonnes pratiques de sécurité dès la conception. Nous auditons vos processus avec votre équipe avant de développer, et le suivi se fait à distance dans toute la Guinée, sans déplacement obligatoire de vos équipes.",
      },
    ],
    crossLinks: [
      {
        href: "/services/web",
        title: "Création de site web",
        desc: "Site institutionnel dès 1 500 000 GNF ou avec tableau de bord à 3 500 000 GNF, en toute sécurité.",
      },
      {
        href: "/tarifs",
        title: "Tarifs",
        desc: "Tous nos prix annoncés d'avance, en GNF : sites web, logiciels sur mesure et services digitaux.",
      },
      {
        href: "/contact",
        title: "Demander un devis",
        desc: "Présentez vos processus : nous étudions un dispositif adapté à vos exigences de reporting.",
      },
    ],
  },

  "btp-construction": {
    slug: "btp-construction",
    heroTitle: "BTP & construction",
    heroGold: "projetez une image solide.",
    heroSub:
      "Site web vitrine de référence, suivi de chantiers, gestion d'équipes et de matériaux : des outils à la hauteur des entreprises de bâtiment et travaux publics en Guinée.",
    intro: [
      "Avancement des chantiers consigné sur des cahiers, photos éparpillées sur les téléphones, matériaux suivis à la main : dans le BTP guinéen, les pertes sont réelles mais rarement chiffrées. Surtout, les appels d'offres se gagnent aujourd'hui avec des références visibles en ligne — une entreprise sans site pèse moins face au maître d'ouvrage.",
      "EINSOF construit des sites web d'entreprise de BTP dès 1 500 000 GNF : réalisations, références, certifications et appels d'offres — avec tableau de bord à 3 500 000 GNF pour publier vos projets vous-même. Côté opérations, un logiciel sur mesure dès 20 000 000 GNF centralise chantiers, équipes, matériaux et rapports, même depuis des sites isolés à connexion faible. Le chiffrage précis se fait sur devis après étude de vos processus.",
    ],
    offers: [
      {
        icon: "HardHat",
        title: "Site web d'entreprise de BTP",
        desc: "Réalisations, références, certifications et appels d'offres. Site vitrine dès 1 500 000 GNF, site avec tableau de bord à 3 500 000 GNF.",
      },
      {
        icon: "ClipboardList",
        title: "Suivi de chantiers",
        desc: "Logiciel sur mesure dès 20 000 000 GNF : équipes, matériaux, avancement et rapports de chantier centralisés, utilisables en connexion instable.",
      },
      {
        icon: "Megaphone",
        title: "Image de marque",
        desc: "Community management dès 1 500 000 GNF/mois : photos de chantiers, récits de projets, notoriété auprès des donneurs d'ordre.",
      },
      {
        icon: "Target",
        title: "Prospection B2B",
        desc: "Génération de leads vers maîtres d'ouvrage et donneurs d'ordre : listes qualifiées, landing pages et campagnes, sur devis.",
      },
    ],
    terrain: [
      "Avancement des chantiers consigné sur cahiers, photos éparpillées sur les téléphones.",
      "Appels d'offres : sans références en ligne, votre dossier technique pèse moins.",
      "Matériaux et équipements suivis à la main, pertes difficiles à chiffrer.",
      "Sites isolés : les outils doivent fonctionner même avec une connexion faible.",
    ],
    faq: [
      {
        q: "Pourquoi une entreprise de BTP en Guinée a-t-elle besoin d'un site web ?",
        a: "Parce que les maîtres d'ouvrage vérifient vos références en ligne avant de vous confier un marché : un site clair avec vos réalisations et certifications crédibilise chaque dossier d'appel d'offres. Un site vitrine démarre à 1 500 000 GNF, avec tableau de bord à 3 500 000 GNF pour publier vos chantiers vous-même.",
      },
      {
        q: "Comment suivre plusieurs chantiers en même temps ?",
        a: "Avec un logiciel sur mesure dès 20 000 000 GNF : chaque chantier a son avancement, ses équipes, ses matériaux et ses rapports au même endroit. Les données saisies sur le terrain se centralisent sans ressaisie, même depuis des sites où la connexion varie. L'étude et le chiffrage précis se font sur devis.",
      },
      {
        q: "Combien coûte un logiciel de gestion de chantier ?",
        a: "Nos logiciels sur mesure démarrent à 20 000 000 GNF, selon les fonctionnalités demandées : suivi d'avancement, gestion des matériaux, rapports, multi-sites. Nous commençons par une étude personnalisée de vos processus, puis nous chiffrons le projet précisément sur devis avant de développer.",
      },
    ],
    crossLinks: [
      {
        href: "/services/web",
        title: "Création de site web",
        desc: "Site vitrine dès 1 500 000 GNF ou site avec tableau de bord à 3 500 000 GNF pour vos références.",
      },
      {
        href: "/tarifs",
        title: "Tarifs",
        desc: "Tous nos prix annoncés d'avance, en GNF : sites web, logiciels sur mesure et services digitaux.",
      },
      {
        href: "/contact",
        title: "Demander un devis",
        desc: "Décrivez vos chantiers : nous étudions l'outil qui centralisera vos opérations.",
      },
    ],
  },

  "ong-institutions": {
    slug: "ong-institutions",
    heroTitle: "ONG & institutions",
    heroGold: "faites rayonner votre impact.",
    heroSub:
      "Sites institutionnels multilingues, rapports en ligne, outils de suivi de projets : communiquez votre impact aux bailleurs et partenaires internationaux en Guinée et partout ailleurs.",
    intro: [
      "Les bailleurs et les partenaires vérifient votre crédibilité en ligne avant tout partenariat : une ONG sans site dépend entièrement de ses rapports PDF. En Guinée, les rapports d'activités sont assemblés à la main et en retard sur les échéances, tandis que les équipes dispersées entre Conakry et les régions ne partagent aucune donnée centralisée.",
      "EINSOF crée des sites institutionnels dès 1 500 000 GNF — missions, projets, publications, dons — et à 3 500 000 GNF avec tableau de bord pour publier vos contenus vous-même ; les versions multilingues se chiffrent sur devis. Pour le suivi d'activités et des indicateurs, un logiciel sur mesure dès 20 000 000 GNF consolide les données de terrain et produit des rapports bailleurs sans ressaisie. Le community management dès 1 500 000 GNF/mois entretient votre visibilité entre deux cycles de reporting.",
    ],
    offers: [
      {
        icon: "HandHeart",
        title: "Site institutionnel multilingue",
        desc: "Missions, projets, publications et dons. Site vitrine dès 1 500 000 GNF, tableau de bord à 3 500 000 GNF, versions multilingues sur devis.",
      },
      {
        icon: "BarChart3",
        title: "Suivi de projets et indicateurs",
        desc: "Logiciel sur mesure dès 20 000 000 GNF : activités, indicateurs, rapports bailleurs consolidés à partir des données de terrain.",
      },
      {
        icon: "Megaphone",
        title: "Communication d'impact",
        desc: "Community management dès 1 500 000 GNF/mois : récits de terrain, campagnes de sensibilisation, visibilité auprès des partenaires.",
      },
      {
        icon: "Target",
        title: "Visibilité internationale",
        desc: "Référencement multilingue et campagnes ciblées bailleurs, partenaires et diaspora : dispositif chiffré sur devis.",
      },
    ],
    terrain: [
      "Les bailleurs vérifient votre crédibilité en ligne avant tout partenariat.",
      "Rapports d'activités assemblés à la main, en retard sur les échéances.",
      "Équipes dispersées entre Conakry et les régions : données jamais centralisées.",
      "Communication limitée aux rapports PDF : l'impact reste invisible.",
    ],
    faq: [
      {
        q: "Combien coûte un site web pour une ONG en Guinée ?",
        a: "Un site institutionnel vitrine démarre à 1 500 000 GNF : missions, projets, publications et contacts. Avec tableau de bord pour publier vous-même rapports et actualités, comptez 3 500 000 GNF. Les versions multilingues et l'espace dons se chiffrent sur devis.",
      },
      {
        q: "Comment publier nos rapports et résultats en ligne ?",
        a: "Votre site embarque un espace publications : rapports téléchargeables, actualités de projets, chiffres clés. Avec le tableau de bord (site à 3 500 000 GNF), votre équipe publie sans passer par un webmaster. Chaque page est optimisée pour être trouvée sur Google par les bailleurs.",
      },
      {
        q: "Peut-on suivre nos projets et nos indicateurs avec un outil digital ?",
        a: "Oui : un logiciel sur mesure dès 20 000 000 GNF centralise les activités, les indicateurs et les données de terrain, puis produit des rapports bailleurs consolidés sans ressaisie. Les équipes de Conakry comme des régions alimentent le même outil ; l'étude et le chiffrage se font sur devis.",
      },
    ],
    crossLinks: [
      {
        href: "/services/web",
        title: "Création de site web",
        desc: "Site institutionnel dès 1 500 000 GNF ou avec tableau de bord à 3 500 000 GNF, multilingue en option.",
      },
      {
        href: "/secteurs",
        title: "Tous les secteurs",
        desc: "Découvrez nos solutions pour les 14 domaines d'activité que nous servons en Guinée.",
      },
      {
        href: "/contact",
        title: "Demander un devis",
        desc: "Présentez vos projets : nous proposons un dispositif adapté à vos bailleurs.",
      },
    ],
  },

  "transport-logistique": {
    slug: "transport-logistique",
    heroTitle: "Transport & logistique",
    heroGold: "suivez chaque opération.",
    heroSub:
      "Sites web pour sociétés de transport, logiciels de suivi des expéditions, gestion de flotte : des outils qui suivent le rythme du terrain guinéen.",
    intro: [
      "Expéditions suivies au téléphone, bordereaux papier, preuves de livraison introuvables quand un litige survient, facturation client reconstruite après coup avec des oublis : la logistique guinéenne perd de l'argent dans l'invisible. Les routes et la connectivité varient d'un jour à l'autre — vos outils doivent tenir le terrain, pas seulement le bureau.",
      "EINSOF développe des logiciels sur mesure dès 20 000 000 GNF pour le transport en Guinée : expéditions, chauffeurs, livraisons, preuves de livraison et stocks centralisés, avec saisie terrain pensée pour les connexions instables. Une application mobile dédiée démarre aussi à 20 000 000 GNF. Côté commercial, un site web dès 1 500 000 GNF — ou 3 500 000 GNF avec tableau de bord — présente vos services et vos flottes, et le chiffrage des modules de suivi client se fait sur devis.",
    ],
    offers: [
      {
        icon: "Truck",
        title: "Site web de transport",
        desc: "Services, flotte, itinéraires et demandes de devis. Site vitrine dès 1 500 000 GNF, site avec tableau de bord à 3 500 000 GNF.",
      },
      {
        icon: "MapPin",
        title: "Suivi des opérations",
        desc: "Logiciel sur mesure dès 20 000 000 GNF : expéditions, livraisons, stocks et preuves de livraison centralisés, utilisables en connexion instable.",
      },
      {
        icon: "Megaphone",
        title: "Visibilité commerciale",
        desc: "Community management dès 1 500 000 GNF/mois : services, recrutement de chauffeurs, image fiable auprès des donneurs de charge.",
      },
      {
        icon: "Target",
        title: "Contrats et clients B2B",
        desc: "Génération de leads : prospection des importateurs, industries et organisations qui expédient chaque semaine. Sur devis.",
      },
    ],
    terrain: [
      "Expéditions suivies au téléphone : aucune vue d'ensemble sur la flotte.",
      "Bordereaux papier, preuves de livraison introuvables quand un litige survient.",
      "Facturation client reconstruite après coup, avec des oublis.",
      "Routes et connectivité variables : vos outils doivent tenir le terrain.",
    ],
    faq: [
      {
        q: "Quel logiciel pour gérer une flotte de transport en Guinée ?",
        a: "Un logiciel sur mesure développé dès 20 000 000 GNF : suivi des expéditions, des chauffeurs et des preuves de livraison dans un seul outil, avec une saisie terrain conçue pour les connexions instables. Après étude personnalisée de vos opérations, le chiffrage précis se fait sur devis.",
      },
      {
        q: "Combien coûte un site web pour une société de transport ?",
        a: "Un site vitrine présentant vos services, votre flotte et vos itinéraires démarre à 1 500 000 GNF. Le site avec tableau de bord coûte 3 500 000 GNF et vous laisse publier vos contenus vous-même. Un module de suivi client intégré au site se chiffre sur devis.",
      },
      {
        q: "Vos clients peuvent-ils suivre leurs colis eux-mêmes ?",
        a: "Oui : un lien ou un portail de suivi peut être proposé selon votre organisation — chaque projet est chiffré sur devis. Si vous souhaitez une expérience entièrement dédiée (notifications, application), une application mobile démarre à 20 000 000 GNF, après étude de vos flux.",
      },
    ],
    crossLinks: [
      {
        href: "/services/web",
        title: "Création de site web",
        desc: "Site vitrine dès 1 500 000 GNF ou site avec tableau de bord à 3 500 000 GNF pour vos services.",
      },
      {
        href: "/tarifs",
        title: "Tarifs",
        desc: "Tous nos prix annoncés d'avance, en GNF : sites web, logiciels sur mesure et applications mobiles.",
      },
      {
        href: "/contact",
        title: "Demander un devis",
        desc: "Décrivez vos flux : nous étudions l'outil qui suivra vos opérations sans ressaisie.",
      },
    ],
  },

  "agriculture-agro": {
    slug: "agriculture-agro",
    heroTitle: "Agriculture & agro-industrie",
    heroGold: "cultivez votre croissance.",
    heroSub:
      "Gestion de coopératives, suivi de production, sites web pour producteurs et transformateurs, mise en relation avec les acheteurs : le digital au service des filières guinéennes.",
    intro: [
      "Récoltes et stocks consignés sur des cahiers, acheteurs contactés au dernier moment, prix subis plutôt que négociés : les filières agricoles guinéennes manquent de données pour valoriser leur production. Les coopératives, dispersées sur plusieurs préfectures, n'ont aucune vision consolidée, alors que la traçabilité est devenue une exigence des acheteurs internationaux.",
      "EINSOF équipe producteurs, coopératives et transformateurs en Guinée : un site web dès 1 500 000 GNF — ou 3 500 000 GNF avec tableau de bord — présente votre filière, vos volumes et vos contacts commerciaux, avec catalogue et commandes en option sur devis. Pour la gestion, un logiciel sur mesure dès 20 000 000 GNF suit parcelles, récoltes, stocks et achats avec traçabilité. La vente en ligne et l'application mobile dédiée démarrent respectivement à 1 500 000 GNF (site) et 20 000 000 GNF (app).",
    ],
    offers: [
      {
        icon: "Tractor",
        title: "Site web producteur ou coopérative",
        desc: "Filière, volumes, qualité et contacts commerciaux. Site vitrine dès 1 500 000 GNF, catalogue et commandes en ligne sur devis.",
      },
      {
        icon: "BarChart3",
        title: "Suivi de production",
        desc: "Logiciel sur mesure dès 20 000 000 GNF : parcelles, récoltes, stocks, achats et traçabilité jusqu'à l'export.",
      },
      {
        icon: "Megaphone",
        title: "Promotion des produits",
        desc: "Community management dès 1 500 000 GNF/mois : contenus de saison, qualité et image auprès des acheteurs nationaux et internationaux.",
      },
      {
        icon: "Target",
        title: "Acheteurs et export",
        desc: "Génération de leads B2B : mise en relation avec acheteurs nationaux et internationaux, landing pages par filière. Sur devis.",
      },
    ],
    terrain: [
      "Récoltes et stocks consignés sur cahiers : aucune vision consolidée de la production.",
      "Acheteurs contactés au téléphone au dernier moment : prix subis plutôt que négociés.",
      "Coopératives dispersées sur plusieurs préfectures, données jamais centralisées.",
      "Traçabilité exigée par les acheteurs internationaux : le papier ne suffit plus.",
    ],
    faq: [
      {
        q: "À quoi sert un site web pour une coopérative agricole en Guinée ?",
        a: "Il donne de la crédibilité auprès des acheteurs, centralise vos contacts commerciaux et rend votre filière visible sur Google — y compris pour les acheteurs internationaux qui vérifient avant de se déplacer. Un site vitrine démarre à 1 500 000 GNF, avec catalogue et commandes en option sur devis.",
      },
      {
        q: "Comment suivre la production et les stocks d'une coopérative ?",
        a: "Avec un logiciel sur mesure dès 20 000 000 GNF : parcelles, récoltes, stocks et achats centralisés, avec des tableaux de bord par site et par saison. Les données saisies sur le terrain se consolident sans ressaisie, même entre plusieurs préfectures. L'étude et le chiffrage précis se font sur devis.",
      },
      {
        q: "Peut-on vendre nos produits agricoles en ligne ?",
        a: "Oui : un catalogue avec commandes peut être intégré à votre site dès le format vitrine, à partir de 1 500 000 GNF — l'intégration du paiement en ligne se chiffre sur devis. Pour une expérience dédiée aux acheteurs professionnels, une application mobile démarre à 20 000 000 GNF.",
      },
    ],
    crossLinks: [
      {
        href: "/secteurs",
        title: "Tous les secteurs",
        desc: "Découvrez nos solutions pour les 14 domaines d'activité que nous servons en Guinée.",
      },
      {
        href: "/services/web",
        title: "Création de site web",
        desc: "Site vitrine dès 1 500 000 GNF ou site avec tableau de bord à 3 500 000 GNF, catalogue en option.",
      },
      {
        href: "/contact",
        title: "Demander un devis",
        desc: "Présentez votre filière : nous étudions l'outil qui valorisera votre production.",
      },
    ],
  },

  "mines-energie": {
    slug: "mines-energie",
    heroTitle: "Mines & énergie",
    heroGold: "à la hauteur du secteur.",
    heroSub:
      "Logiciels sur mesure pour le suivi des opérations, sites institutionnels, tableaux de bord consolidés : des outils fiables pour un secteur exigeant, en Guinée et sur tous vos sites.",
    intro: [
      "Sites d'exploitation isolés, connectivité variable d'un jour à l'autre, données de production encore collectées à la main sur le terrain puis ressaisies le soir : le secteur minier et énergétique guinéen exige un niveau de fiabilité que le papier ne tient plus. Rapports HSE, conformité et consolidation multi-sites attendent des outils d'un autre niveau.",
      "EINSOF développe des logiciels sur mesure dès 20 000 000 GNF pour les mines et l'énergie en Guinée : production, logistique, HSE et reporting multi-sites sans ressaisie, conçus pour rester utilisables en connexion instable. Une application mobile de saisie terrain démarre à 20 000 000 GNF. Votre image institutionnelle mérite la même exigence : site web dès 1 500 000 GNF, ou 3 500 000 GNF avec tableau de bord ; les portails (carrières, fournisseurs) se chiffrent sur devis.",
    ],
    offers: [
      {
        icon: "Pickaxe",
        title: "Site institutionnel",
        desc: "Projets, conformité, parties prenantes et carrières. Site vitrine dès 1 500 000 GNF, site avec tableau de bord à 3 500 000 GNF.",
      },
      {
        icon: "Database",
        title: "Suivi des opérations",
        desc: "Logiciel sur mesure dès 20 000 000 GNF : production, HSE, logistique et reporting multi-sites sans ressaisie, utilisable en connexion instable.",
      },
      {
        icon: "Megaphone",
        title: "Communication RSE",
        desc: "Community management dès 1 500 000 GNF/mois : emploi local, environnement, relations communautaires et image auprès du public.",
      },
      {
        icon: "Target",
        title: "Partenaires et sous-traitants",
        desc: "Génération de leads B2B : partenaires techniques, fournisseurs et institutions. Approche ciblée, chiffrée sur devis.",
      },
    ],
    terrain: [
      "Sites d'exploitation isolés, connectivité variable d'un jour à l'autre.",
      "Données de production collectées à la main sur le terrain, ressaisies le soir.",
      "Rapports HSE et conformité exigés en continu : le papier ne tient plus.",
      "Plusieurs bases, plusieurs équipes : aucune donnée consolidée en temps réel.",
    ],
    faq: [
      {
        q: "Quel logiciel pour le suivi des opérations minières en Guinée ?",
        a: "Un logiciel sur mesure développé dès 20 000 000 GNF : production, logistique, HSE et reporting consolidé dans un seul outil, conçu pour rester utilisable quand la connexion faiblit. Les données saisies sur le terrain se synchronisent sans ressaisie. L'étude et le chiffrage précis se font sur devis.",
      },
      {
        q: "Combien coûte un site web pour une société minière ?",
        a: "Un site institutionnel vitrine démarre à 1 500 000 GNF ; avec tableau de bord pour publier vos contenus, comptez 3 500 000 GNF. Les portails spécifiques — carrières, fournisseurs, espace partenaires — se chiffrent sur devis selon vos exigences de conformité.",
      },
      {
        q: "Comment consolider les données de plusieurs sites d'exploitation ?",
        a: "Par un outil unique où chaque site saisit ses données, même hors connexion, et où le siège consulte un reporting consolidé en temps réel. Selon vos flux, un SaaS de gestion avec essai gratuit de 7 jours peut suffire, ou un développement sur mesure dès 20 000 000 GNF — une application mobile de saisie démarre à 20 000 000 GNF.",
      },
    ],
    crossLinks: [
      {
        href: "/services/web",
        title: "Création de site web",
        desc: "Site institutionnel dès 1 500 000 GNF ou avec tableau de bord à 3 500 000 GNF pour vos parties prenantes.",
      },
      {
        href: "/tarifs",
        title: "Tarifs",
        desc: "Tous nos prix annoncés d'avance, en GNF : sites web, logiciels sur mesure et applications mobiles.",
      },
      {
        href: "/contact",
        title: "Demander un devis",
        desc: "Présentez vos sites et vos flux : nous étudions l'outil qui consolidera vos données.",
      },
    ],
  },

  medias: {
    slug: "medias",
    heroTitle: "Médias",
    heroGold: "publiez plus vite.",
    heroSub:
      "Sites d'information rapides et modernes, rubriques éditoriales, sections vidéo, monétisation : des plateformes qui portent votre audience en Guinée et dans la diaspora.",
    intro: [
      "L'actualité se consomme sur mobile : un site lent ou dépendant d'un webmaster externe perd des lecteurs à chaque Une. En Guinée, les rédactions publient encore en double saisie entre le site, Facebook et WhatsApp, sans mesurer leur audience — impossible alors de vendre l'espace publicitaire à sa juste valeur.",
      "EINSOF construit des plateformes d'information pour les médias guinéens : un site avec tableau de bord à 3 500 000 GNF permet à votre rédaction de publier en autonomie — rubriques, articles, vidéos, alertes — tandis que la vitrine démarre à 1 500 000 GNF. La monétisation (espaces publicitaires, abonnements) et les fonctionnalités avancées se chiffrent sur devis. Le community management dès 1 500 000 GNF/mois synchronise vos Une sur tous les canaux et fidélise l'audience.",
    ],
    offers: [
      {
        icon: "Newspaper",
        title: "Site d'information",
        desc: "Rubriques, articles, vidéos et alertes. Site vitrine dès 1 500 000 GNF ; tableau de bord de publication à 3 500 000 GNF pour votre rédaction.",
      },
      {
        icon: "Tv",
        title: "Plateforme et monétisation",
        desc: "Espaces publicitaires, abonnements et sections vidéo : fonctionnalités développées sur devis, adaptées à votre rédaction et à votre audience.",
      },
      {
        icon: "Megaphone",
        title: "Croissance d'audience",
        desc: "Community management dès 1 500 000 GNF/mois : teasing des Une, diffusion multi-plateformes, fidélisation de la communauté.",
      },
      {
        icon: "Target",
        title: "Audience et annonceurs",
        desc: "Référencement et génération de trafic, dossiers commerciaux pour les annonceurs : offres chiffrées sur devis.",
      },
    ],
    terrain: [
      "L'actualité se consomme sur mobile : un site lent perd ses lecteurs.",
      "Publication dépendante d'un webmaster externe : des heures perdues à chaque Une.",
      "Audience non mesurée : impossible de vendre l'espace publicitaire à sa juste valeur.",
      "Contenus dupliqués entre site, Facebook et WhatsApp sans stratégie claire.",
    ],
    faq: [
      {
        q: "Combien coûte un site web pour un média en Guinée ?",
        a: "Un site vitrine démarre à 1 500 000 GNF. Pour que votre rédaction publie elle-même articles, rubriques et vidéos, le site avec tableau de bord coûte 3 500 000 GNF. Les fonctionnalités avancées — abonnements, espaces publicitaires, application — se chiffrent sur devis.",
      },
      {
        q: "Comment augmenter l'audience de mon site d'information ?",
        a: "Trois leviers : la vitesse sur mobile, un référencement soigné de chaque article et une diffusion synchronisée sur les réseaux sociaux. Notre community management démarre à 1 500 000 GNF/mois ; le référencement et les campagnes de génération de trafic se chiffrent sur devis.",
      },
      {
        q: "Peut-on monétiser un site d'actualité en Guinée ?",
        a: "Oui : espaces publicitaires, abonnements et partenariats s'installent selon votre audience. Nous mesurons d'abord vos trafics pour fixer la bonne offre aux annonceurs, puis nous développons le dispositif adapté — chaque projet est chiffré sur devis après étude de votre audience.",
      },
    ],
    crossLinks: [
      {
        href: "/services/web",
        title: "Création de site web",
        desc: "Site vitrine dès 1 500 000 GNF ou site avec tableau de bord à 3 500 000 GNF pour publier en autonomie.",
      },
      {
        href: "/logiciels",
        title: "Logiciels SaaS",
        desc: "Factura Pro (100 000 GNF/mois) pour la facturation des annonceurs, avec essai gratuit de 7 jours.",
      },
      {
        href: "/contact",
        title: "Demander un devis",
        desc: "Parlez-nous de votre rédaction : nous construisons la plateforme qui porte votre audience.",
      },
    ],
  },

  "telecoms-evenementiel": {
    slug: "telecoms-evenementiel",
    heroTitle: "Télécoms & événementiel",
    heroGold: "connectez vos publics.",
    heroSub:
      "Sites web pour prestataires, billetterie en ligne, communication digitale d'événements, applications dédiées : des outils qui font le show, avant comme pendant l'événement.",
    intro: [
      "Billetterie gérée à la main avec ses files d'attente et ses faux billets, événements promus uniquement par affiches et relais WhatsApp, données participants éparpillées et jamais réutilisées : l'événementiel guinéen gagne à être outillé. Les prestataires télécoms et fournisseurs d'équipements, eux, restent souvent sans vitrine en ligne crédible face à leurs donneurs d'ordre.",
      "EINSOF crée des sites événementiels dès 1 500 000 GNF — programme, artistes, partenaires — ou à 3 500 000 GNF avec tableau de bord ; la billetterie en ligne avec paiement mobile money se chiffre sur devis. Pour un outil dédié (accréditations, engagement du public), une application événementielle démarre à 20 000 000 GNF. Le community management dès 1 500 000 GNF/mois porte le teasing, la couverture en direct et les contenus d'après-événement.",
    ],
    offers: [
      {
        icon: "CalendarRange",
        title: "Site événementiel",
        desc: "Programme, artistes, partenaires et billetterie en ligne. Site vitrine dès 1 500 000 GNF ; billetterie et inscriptions sur devis.",
      },
      {
        icon: "Signal",
        title: "Applications événement et télécoms",
        desc: "Applications dédiées dès 20 000 000 GNF : billetterie, accréditations, engagement du public, outils sur mesure pour prestataires télécoms.",
      },
      {
        icon: "Megaphone",
        title: "Communication d'événement",
        desc: "Community management dès 1 500 000 GNF/mois : teasing, couverture en direct, contenus d'après-événement pour préparer la suite.",
      },
      {
        icon: "Target",
        title: "Sponsors et participants",
        desc: "Génération de leads : dossiers sponsors, campagnes de billetterie et bases de participants réutilisables. Sur devis.",
      },
    ],
    terrain: [
      "Billetterie gérée à la main : files d'attente, faux billets, chiffres incertains.",
      "Événements promus uniquement par affiches et relais WhatsApp.",
      "Prestataires télécoms et équipements sans vitrine en ligne crédible.",
      "Données participants éparpillées : aucune base réutilisable pour l'édition suivante.",
    ],
    faq: [
      {
        q: "Comment vendre des billets en ligne pour un événement en Guinée ?",
        a: "Par une billetterie en ligne avec paiement mobile money, une page dédiée à votre événement et des QR codes pour contrôler l'entrée le jour J. Chaque dispositif est chiffré sur devis selon la jauge et le nombre de catégories de billets ; le site vitrine de l'événement démarre à 1 500 000 GNF.",
      },
      {
        q: "Combien coûte un site web pour un organisateur d'événements ?",
        a: "Un site vitrine événementiel démarre à 1 500 000 GNF : programme, intervenants, partenaires et contacts. Avec tableau de bord pour gérer le contenu et les inscriptions, comptez 3 500 000 GNF. La billetterie en ligne et les intégrations avancées se chiffrent sur devis.",
      },
      {
        q: "Une application mobile est-elle utile pour un événement ?",
        a: "Elle devient pertinente pour les grands formats : programme personnalisé, carte du site, notifications en direct et engagement du public. Une application événementielle démarre à 20 000 000 GNF ; après étude de votre édition et de votre budget, nous vous dirons si elle est justifiée ou si le site suffit.",
      },
    ],
    crossLinks: [
      {
        href: "/services/web",
        title: "Création de site web",
        desc: "Site vitrine dès 1 500 000 GNF ou site avec tableau de bord à 3 500 000 GNF, billetterie en option.",
      },
      {
        href: "/logiciels",
        title: "Logiciels SaaS",
        desc: "Factura Pro (100 000 GNF/mois) pour la facturation sponsors et prestataires, essai gratuit 7 jours.",
      },
      {
        href: "/tarifs",
        title: "Tarifs",
        desc: "Tous nos prix annoncés d'avance, en GNF : sites web, applications mobiles et services digitaux.",
      },
    ],
  },

  recrutement: {
    slug: "recrutement",
    heroTitle: "Recrutement",
    heroGold: "trouvez les bons talents.",
    heroSub:
      "Plateformes d'offres d'emploi, sites web de cabinets, gestion des candidatures, marque employeur : des outils pour recruter plus vite et plus juste en Guinée.",
    intro: [
      "CV reçus par WhatsApp et e-mail sans suivi, offres diffusées en bouche-à-oreille que les bons profils ne voient jamais, présélections manuelles et sans traçabilité : le recrutement en Guinée perd des talents dans le bruit. Pendant ce temps, les candidats qualifiés — au pays comme dans la diaspora — cherchent d'abord sur Google.",
      "EINSOF équipe cabinets et services RH : un site de recrutement dès 1 500 000 GNF — ou 3 500 000 GNF avec tableau de bord pour publier vos offres et recevoir les candidatures — constitue la base. Une plateforme complète d'offres et de candidatures, avec base de CV, statuts et historiques, se chiffre sur devis ; l'application mobile dédiée démarre à 20 000 000 GNF. Le community management dès 1 500 000 GNF/mois construit votre marque employeur.",
    ],
    offers: [
      {
        icon: "Users",
        title: "Site de cabinet de recrutement",
        desc: "Offres d'emploi, présentation du cabinet, dépôt de CV. Site vitrine dès 1 500 000 GNF, site avec tableau de bord à 3 500 000 GNF.",
      },
      {
        icon: "ClipboardList",
        title: "Gestion des candidatures",
        desc: "Plateforme d'offres et de candidatures développée sur devis : base de CV, statuts, notes et traçabilité. Application mobile dédiée dès 20 000 000 GNF.",
      },
      {
        icon: "Megaphone",
        title: "Marque employeur",
        desc: "Community management dès 1 500 000 GNF/mois : visibilité des offres, image du cabinet, animation de la communauté de candidats.",
      },
      {
        icon: "Target",
        title: "Candidats et employeurs",
        desc: "Génération de leads : campagnes pour attirer les profils rares et les entreprises qui recrutent. Sur devis.",
      },
    ],
    terrain: [
      "CV reçus par WhatsApp et e-mail : aucun suivi, aucun historique.",
      "Offres diffusées en bouche-à-oreille : les bons profils ne les voient jamais.",
      "Présélections manuelles, sans traçabilité ni cohérence entre recruteurs.",
      "Les candidats qualifiés cherchent d'abord sur Google : sans plateforme, vous ratez.",
    ],
    faq: [
      {
        q: "Comment créer un site d'offres d'emploi en Guinée ?",
        a: "Commencez par un site de cabinet dès 1 500 000 GNF avec publication d'offres et dépôt de CV, ou un site à 3 500 000 GNF avec tableau de bord pour gérer tout vous-même. Pour une plateforme complète — comptes candidats, base de CV, statuts de recrutement — nous développons sur devis après étude de vos processus.",
      },
      {
        q: "Combien coûte un site web pour un cabinet de recrutement ?",
        a: "Un site vitrine présentant le cabinet, ses offres et un formulaire de candidature démarre à 1 500 000 GNF. Le site avec tableau de bord coûte 3 500 000 GNF et vous laisse publier les offres vous-même. Les fonctions avancées se chiffrent sur devis selon vos volumes de candidatures.",
      },
      {
        q: "Comment suivre les candidatures sans perdre de CV ?",
        a: "Avec un outil dédié : chaque candidature est enregistrée avec son statut, ses notes et son historique — plus de CV noyés dans WhatsApp. La plateforme se chiffre sur devis selon vos volumes ; si vos recruteurs sont souvent en déplacement, une application mobile démarre à 20 000 000 GNF.",
      },
    ],
    crossLinks: [
      {
        href: "/services/web",
        title: "Création de site web",
        desc: "Site vitrine dès 1 500 000 GNF ou site avec tableau de bord à 3 500 000 GNF pour vos offres.",
      },
      {
        href: "/logiciels",
        title: "Logiciels SaaS",
        desc: "Factura Pro (100 000 GNF/mois) et SaaS de gestion pour votre cabinet, essai gratuit 7 jours.",
      },
      {
        href: "/contact",
        title: "Demander un devis",
        desc: "Décrivez vos recrutements : nous étudions la plateforme qui organisera vos candidatures.",
      },
    ],
  },
};
