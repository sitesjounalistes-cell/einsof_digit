"use client";

import { useState, type ReactNode } from "react";
import {
  Activity,
  ArrowRightLeft,
  AtSign,
  Award,
  BadgeCheck,
  BarChart3,
  Bell,
  Bot,
  Briefcase,
  Building2,
  Calculator,
  CalendarCheck,
  Camera,
  ChevronDown,
  Cloud,
  Code2,
  Coins,
  Compass,
  CreditCard,
  Database,
  Factory,
  FileCheck,
  FileSpreadsheet,
  FileText,
  Gauge,
  Globe,
  GraduationCap,
  Handshake,
  HeartPulse,
  Hotel,
  Image as ImageIcon,
  Images,
  Inbox,
  Landmark,
  Languages,
  LayoutDashboard,
  LayoutTemplate,
  Lightbulb,
  LineChart,
  Lock,
  type LucideIcon,
  Mail,
  MapPin,
  Megaphone,
  MessageCircle,
  Monitor,
  Package,
  PenLine,
  Phone,
  PhoneCall,
  Pill,
  Puzzle,
  Receipt,
  RefreshCw,
  Rocket,
  School,
  Scissors,
  Search,
  Send,
  Server,
  ShieldCheck,
  ShoppingBag,
  Smartphone,
  Sparkles,
  Stethoscope,
  Store,
  Target,
  TrendingUp,
  Truck,
  UserPlus,
  Users,
  Video,
  Wallet,
  Workflow,
  Wrench,
  Zap,
} from "lucide-react";
import { CollapseMotion, PulseGlow } from "@/components/motion";

/* ════════════════════════════════════════════════════════════════
   Bibliothèque d'icônes « figurines or » — inspirée des visuels de
   référence du client : icône au trait fin dorée, centrée dans des
   cercles concentriques, sur fond sombre. Utilisée partout où le
   site énumère des éléments (caractéristiques, forfaits, inclus…)
   pour remplacer les longues listes de texte.
   ════════════════════════════════════════════════════════════════ */

/* ── 1. Mapping mots-clés → icône (fr + en + es + de) ──────────── */

/** Table ordonnée : le PREMIER mot-clé trouvé gagne. */
const ICON_KEYWORDS: [string[], LucideIcon][] = [
  /* Sites web */
  [["domaine", "domain", "dominio", "domain"], Globe],
  [["hébergement", "hebergement", "hosting", "alojamiento", "hosting"], Server],
  [["e-mail", "email", "mail", "correo"], Mail],
  [["chatbot", "bot", "assistant", "asistente"], Bot],
  [["seo", "indexation", "google", "référencement", "referencement"], Search],
  [["boutique", "shop", "store", "tienda", "produit", "product"], ShoppingBag],
  [["panier", "cart"], ImageIcon],
  [["paiement", "payment", "pago", "zahlung"], CreditCard],
  [["mobile money", "wallet", "portefeuille"], Wallet],
  [["lead", "prospect", "contact", "cliente potentiel"], Target],
  [["formulaire", "form", "formulario"], FileText],
  [["page", "página", "seite", "structure"], LayoutTemplate],
  [["blog", "article", "artículo", "artikel"], PenLine],
  [["notification", "push"], Bell],
  [["publicité", "publicite", "ads", "campagne", "campaign", "campaña", "werbung"], Megaphone],
  [["statistique", "statistiques", "stats", "mesure", "analytique", "analytics", "estadística"], BarChart3],
  [["application", "app", "appli", "mobile"], Smartphone],
  [["tableau de bord", "dashboard", "admin", "administrateur", "administrator", "administrador"], LayoutDashboard],
  [["galerie", "image", "vidéo", "video", "photo", "galería", "galerie"], Images],
  [["message", "whatsapp", "chat", "mensaje"], MessageCircle],
  [["bug", "faille", "sécurité", "seguridad", "sicherheit", "maintenance"], ShieldCheck],
  [["multilingue", "langue", "language", "idioma", "sprache"], Languages],
  [["supplémentaire", "supplément", "extra", "option"], Sparkles],
  [["renouvellement", "renewal", "renovación", "erneuerung", "annuel", "annual"], RefreshCw],
  [["téléchargeable", "downloadable", "descargable"], Monitor],
  [["cloud"], Cloud],
  [["base de données", "database", "datos"], Database],
  [["sécurisé", "secure", "sûr", "protection", "clé", "access"], Lock],

  /* Logiciels & SaaS */
  [["facture", "facturation", "invoice", "factura", "reçu", "receipt", "rechnung"], Receipt],
  [["comptable", "comptabilité", "accounting", "contable", "buchhaltung"], Calculator],
  [["hôpital", "hospital", "hospitalier", "santé", "health", "salud", "krankenhaus"], Stethoscope],
  [["école", "ecole", "school", "escuela", "schule", "élève", "élèves"], School],
  [["immobilier", "real estate", "inmobiliaria", "immobilien", "bail", "propriété"], Building2],
  [["pharmacie", "pharmacy", "farmacia", "apotheke", "médicament"], Pill],
  [["formation", "training", "formación", "schulung", "cours", "course"], GraduationCap],
  [["centre", "centro", "center"], Compass],
  [["équip", "equipo", "team", "équipe", "équipes"], Users],
  [["recrutement", "recruitment", "rh", "hr"], UserPlus],
  [["agenda", "rendez-vous", "appointment", "cita", "termin", "planification"], CalendarCheck],
  [["workflow", "processus", "automatis", "automat", "flujo"], Workflow],
  [["données", "data", "datos", "soumission"], Database],
  [["rapport", "reporting", "report", "informe"], FileSpreadsheet],
  [["alerte", "alert", "suivi", "tracking", "seguimiento"], Activity],
  [["inventaire", "stock", "inventory", "inventario", "lager"], Package],
  [["livraison", "delivery", "entrega", "lieferung", "logistique"], Truck],
  [["multi-clients", "multi-tenant", "abonnement", "subscription", "suscripción", "abo"], ArrowRightLeft],
  [["lancement", "launch", "lanzamiento", "start"], Rocket],
  [["maquette", "mockup", "prototype", "design", "diseño"], Puzzle],
  [["publication", "store", "magasins", "play store"], Send],
  [["api", "intégration", "integration", "integración"], Code2],
  [["performance", "vitesse", "speed"], Gauge],
  [["sur mesure", "custom", "personalizado", "maßgeschneidert", "interne", "internal"], Wrench],

  /* Community management */
  [["réseau", "social", "redes", "sozialen", "communauté", "community"], Users],
  [["vidéo", "montage", "editing", "edición", "schnitt"], Video],
  [["photo", "shooting", "foto"], Camera],
  [["contenu", "content", "contenido", "inhalt"], PenLine],
  [["community manager", "gestion des réseaux"], Briefcase],
  [["visibilité", "audience", "portée", "reach"], TrendingUp],
  [["engagement", "interaction"], HeartPulse],
  [["planification", "programmation", "scheduling"], CalendarCheck],

  /* Acquisition & formation */
  [["téléphonique", "calling", "appel", "call", "llamada", "anruf"], PhoneCall],
  [["téléphone", "phone", "teléfono", "telefon"], Phone],
  [["b2b", "commercial", "sales", "ventas", "vertrieb"], Handshake],
  [["landing", "conversion", "konvertierung"], Target],
  [["emailing", "newsletter", "mailing"], Send],
  [["atelier", "workshop", "taller"], Lightbulb],
  [["itératif", "démonstration", "demo"], Monitor],
  [["cadrage", "étude", "etude", "estudio", "analyse", "analysis"], Search],
  [["accompagnement", "coaching", "conseil", "beratung"], Award],
  [["certification", "diplôme", "certificado"], BadgeCheck],
  [["hôtel", "hotel", "hôtellerie"], Hotel],
  [["banque", "finance", "microfinance", "bank"], Landmark],
  [["ong", "association", "fondation"], Handshake],
  [["usine", "industrie", "manufacture", "production"], Factory],
  [["restaurant", "restauración", "gastronomie"], Store],
  [["coiffure", "beauté", "beauty", "salon"], Scissors],
  [["clinique", "cabinet"], HeartPulse],
  [["energie", "énergie", "electricité", "solaire"], Zap],
  [["immobilier neuf", "chantier", "construction"], Building2],
  [["agriculture", "agro"], Package],
  [["élevage", "bétail"], Activity],
  [["transport", "transit", "douane", "customs"], Truck],
  [["assurance", "seguro", "versicherung"], ShieldCheck],
  [["veterinaire", "vétérinaire"], Stethoscope],
  [["juridique", "legal", "avocat"], FileCheck],
  [["localisation", "carte", "map", "zone", "secteur", "region", "région"], MapPin],
  [["prix", "tarif", "price", "precio", "preis", "coût", "montant"], Coins],
  [["inbox", "boîte", "recevoir"], Inbox],
  [["at-sign", "adresse"], AtSign],
  [["bureau", "office", "oficina", "büro"], Briefcase],
  [["écran", "site", "web", "sito", "website"], Monitor],
  [["croissance", "growth", "crecimiento", "wachstum"], LineChart],
  [["qualité", "premium", "luxueux", "excellence"], Award],
];

/** Retourne l'icône correspondant au texte (recherche du premier
 *  mot-clé présent, accents ignorés). Repli : CheckShield. */
export function featureIconFor(text: string): LucideIcon {
  const norm = text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
  for (const [keys, icon] of ICON_KEYWORDS) {
    for (const k of keys) {
      const kn = k.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      if (norm.includes(kn)) return icon;
    }
  }
  return ShieldCheck;
}

/* ── 2. GoldIcon : la « figurine » or avec cercles concentriques ── */

const SIZES = {
  sm: { box: "h-12 w-12", ring: "h-12 w-12", inner: "h-8 w-8", icon: 14, radius: 3 },
  md: { box: "h-16 w-16", ring: "h-16 w-16", inner: "h-11 w-11", icon: 18, radius: 4 },
  lg: { box: "h-20 w-20", ring: "h-20 w-20", inner: "h-14 w-14", icon: 24, radius: 5 },
  xl: { box: "h-28 w-28", ring: "h-28 w-28", inner: "h-20 w-20", icon: 32, radius: 7 },
} as const;

/**
 * Figurine de luxe : icône au trait fin dorée au centre d'anneaux
 * concentriques (réplique des visuels fournis par le client :
 * bouclier ✓, diamant…). 3 anneaux : externe très discret,
 * intermédiaire, cercle interne qui porte l'icône.
 */
export function GoldIcon({
  icon: Icon,
  size = "md",
  pulse = false,
  className = "",
}: {
  icon: LucideIcon;
  size?: keyof typeof SIZES;
  /** halo pulsant sur le point supérieur (comme le visuel bouclier) */
  pulse?: boolean;
  className?: string;
}) {
  const s = SIZES[size];
  return (
    <span
      aria-hidden
      className={`relative inline-flex shrink-0 items-center justify-center ${s.box} ${className}`}
    >
      {/* anneaux concentriques */}
      <span className="absolute inset-0 rounded-full border border-gold/[0.10]" />
      <span className="absolute inset-[9%] rounded-full border border-gold/[0.18]" />
      <span className="absolute inset-[19%] rounded-full border border-gold/25 bg-surface2/40" />
      {/* point or en haut (accent du visuel de référence) */}
      {pulse ? (
        <span className="absolute -top-0.5 left-1/2 -translate-x-1/2">
          <PulseGlow>
            <span className="block h-1.5 w-1.5 rounded-full bg-gold" />
          </PulseGlow>
        </span>
      ) : null}
      {/* icône centrale */}
      <span
        className={`relative z-10 inline-flex items-center justify-center rounded-full ${s.inner}`}
      >
        <Icon
          size={s.icon}
          strokeWidth={1.1}
          className="text-gold drop-shadow-[0_0_6px_rgba(212,175,55,0.35)]"
        />
      </span>
    </span>
  );
}

/* ── 3. IconFeature : élément de liste avec figurine compacte ──── */

/**
 * Point de liste « icône d'abord » : pastille or (double anneau)
 * + texte court. Utilisé pour TOUTES les énumérations du site
 * (caractéristiques des forfaits, inclus, options, sujets…).
 */
export function IconFeature({
  text,
  className = "",
  compact = false,
  as = "li",
}: {
  text: string;
  className?: string;
  /** version resserrée pour les cartes tarif */
  compact?: boolean;
  /** « li » (défaut, dans une <ul>) ou « div » (grilles cartées) */
  as?: "li" | "div";
}) {
  const Tag = as;
  return (
    <Tag
      className={`group flex items-start gap-3 ${className}`}
    >
      <span
        aria-hidden
        className={`relative mt-0.5 inline-flex shrink-0 items-center justify-center rounded-full border border-gold/25 bg-surface2/70 transition-all duration-300 group-hover:border-gold/60 group-hover:bg-surface2 ${
          compact ? "h-6 w-6" : "h-7 w-7"
        }`}
      >
        <span aria-hidden className={`absolute inset-[3px] rounded-full border border-gold/15`} />
        {featureGlyphFor(text, { size: compact ? 11 : 13, strokeWidth: 1.3, className: "text-gold" })}
      </span>
      <span
        className={`leading-relaxed text-mute ${compact ? "text-[0.8125rem]" : "text-sm"}`}
      >
        {text}
      </span>
    </Tag>
  );
}

/** Renvoie l'ÉLÉMENT icône correspondant au texte (helper module —
 *  la résolution se fait hors rendu de composant : compatible
 *  react-hooks/static-components). */
export function featureGlyphFor(
  text: string,
  props: { size?: number; strokeWidth?: number; className?: string } = {},
) {
  const Icon = featureIconFor(text);
  return <Icon size={props.size ?? 14} strokeWidth={props.strokeWidth ?? 1.3} className={props.className} aria-hidden />;
}

/* ── 4. LearnMore : aperçu + dépliage « En savoir plus » ───────── */

/**
 * Affiche un APERÇU (quelques éléments) puis un bouton or
 * « En savoir plus » qui déplie le reste — le visiteur voit
 * l'essentiel sans être noyé sous le texte.
 */
export function LearnMore({
  preview,
  children,
  moreLabel = "En savoir plus",
  lessLabel = "Réduire",
  collapsible = true,
  className = "",
}: {
  preview: ReactNode;
  /** contenu révélé au clic */
  children: ReactNode;
  moreLabel?: string;
  lessLabel?: string;
  /** false : affiche preview + children sans bouton (rien à déplier) */
  collapsible?: boolean;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className={className}>
      {preview}
      {collapsible && (
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          className="group mt-4 inline-flex min-h-[40px] items-center gap-2 rounded border border-gold/35 px-4 py-2 text-[0.75rem] font-medium uppercase tracking-[0.14em] text-goldtext transition-all duration-300 hover:border-gold hover:bg-gold/10 hover:text-goldlight focus-visible:outline focus-visible:outline-1 focus-visible:outline-gold"
        >
          {open ? lessLabel : moreLabel}
          <ChevronDown
            size={14}
            strokeWidth={1.5}
            aria-hidden
            className={`transition-transform duration-300 ${open ? "rotate-180" : ""} group-hover:text-goldlight`}
          />
        </button>
      )}
      <CollapseMotion open={open || !collapsible} className="w-full">
        <div className={collapsible ? "pt-4" : ""}>{children}</div>
      </CollapseMotion>
    </div>
  );
}
