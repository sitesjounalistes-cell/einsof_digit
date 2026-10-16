/**
 * Index de connaissances « vivant » du chatbot — RAG léger par mots-clés.
 *
 * Principe (exigence client) : le chatbot doit se nourrir CONSTAMMENT des
 * informations qui sont réellement sur le site. Au lieu d'un texte figé,
 * chaque module de contenu du site (pôles, logiciels, réalisations, FAQ,
 * tarifs, méthode, à propos, blog) est découpé en documents ; pour chaque
 * question du visiteur, les extraits les plus pertinents (top-k) sont
 * injectés dans le prompt système. Le modèle répond donc à partir du
 * contenu réel des pages — et peut y renvoyer par leur chemin exact.
 *
 * Anti-invention : les documents proviennent exclusivement des modules
 * officiels (pages-content/*, catalog.ts, works.ts). Aucun fait n'est
 * fabriqué ici.
 */

import {
  SAAS_PRODUCTS,
  WEB_OFFERS,
  WEB_RENEWALS,
  WEB_PAYMENT_ADDON,
  SOFTWARE_OFFERS,
  COMMUNITY_OFFERS,
  ACQUISITION_OFFERS,
  TRAINING_OFFERS,
  formatGNF,
} from "@/lib/catalog";
import { SERVICE_DETAILS, SERVICE_SLUGS } from "@/lib/pages-content/service-details";
import { SAAS_DETAILS, SAAS_DETAIL_SLUGS } from "@/lib/pages-content/saas-details";
import { WORKS } from "@/lib/pages-content/works";
import { FAQ } from "@/lib/pages-content/faq";
import { BLOG } from "@/lib/pages-content/blog";
import { APROPOS } from "@/lib/pages-content/apropos";
import { BRAND } from "@/lib/brand";

export interface SiteDoc {
  /** titre court (aussi indexé avec un poids supérieur) */
  title: string;
  /** corps du document */
  body: string;
  /** chemin du site à citer / où naviguer */
  path?: string;
}

/* ── Helpers tarifs ── */
function priceLine(o: {
  amount: number | null;
  period: string;
  isFrom?: boolean;
  isQuoteOnly?: boolean;
  billableMonths?: number;
}): string {
  if (o.isQuoteOnly || o.amount === null) return "sur devis";
  const amount = formatGNF(o.amount);
  const per =
    o.period === "month" ? "par mois" : o.period === "year" ? "par an" : "au total";
  const from = o.isFrom ? "à partir de " : "";
  const months = o.billableMonths ? ` (${o.billableMonths} mois facturés par an)` : "";
  return `${from}${amount} ${per}${months}`;
}

/** Construit l'index complet (fr) — évalué une seule fois par processus. */
export function buildSiteDocs(): SiteDoc[] {
  const docs: SiteDoc[] = [];
  const push = (title: string, body: string, path?: string) =>
    docs.push({ title, body, path });

  /* ── Pôles de services (7 pages /services/[slug]) ── */
  for (const slug of SERVICE_SLUGS) {
    const d = SERVICE_DETAILS.fr[slug];
    if (!d) continue;
    const body = [
      d.hero.sub,
      ...d.overview.paragraphs,
      `Points clés : ${d.overview.facts.map((f) => `${f.k} — ${f.v}`).join(" ; ")}.`,
      `Inclus : ${d.included.items.join(" ; ")}.`,
      `Méthode : ${d.process.steps.map((s) => `${s.k} ${s.t}`).join(" ; ")}.`,
      `Pour qui : ${d.audience.items.map((a) => `${a.k} (${a.d})`).join(" ; ")}.`,
    ].join("\n");
    push(`Pôle — ${d.name}`, body, `/services/${slug}`);
  }

  /* ── Logiciels SaaS (6 pages /logiciels/[slug]) ── */
  for (const slug of SAAS_DETAIL_SLUGS) {
    const d = SAAS_DETAILS.fr[slug];
    const cat = SAAS_PRODUCTS.find((p) => p.slug === slug);
    if (!d) continue;
    const prices = cat ? cat.offers.map((o) => `${o.name} : ${priceLine(o)}`).join(" ; ") : "sur devis";
    const body = [
      d.hero.sub,
      ...d.overview.paragraphs,
      `Caractéristiques : ${d.features.items.join(" ; ")}.`,
      `Pour qui : ${d.audience.forWhom} Cas concrets : ${d.audience.cases.map((a) => `${a.k} (${a.d})`).join(" ; ")}.`,
      `Tarifs : ${prices}.`,
      `Essai gratuit de 7 jours disponible ; démonstration de 30 minutes possible.`,
    ].join("\n");
    push(`Logiciel — ${d.name}`, body, `/logiciels/${slug}`);
    /* mini-FAQ du produit : documents individuels */
    for (const item of d.faq.items) {
      push(`Logiciel ${d.name} — FAQ : ${item.q}`, item.a, `/logiciels/${slug}`);
    }
  }

  /* ── Réalisations (8 sites livrés) ── */
  for (const w of WORKS) {
    push(
      `Réalisation — ${w.name}`,
      [
        `Site livré par ${BRAND} pour ${w.name} (${w.sector.fr}).`,
        w.desc.fr,
        `Voir le site : ${w.url}`,
      ].join(" "),
      "/realisations"
    );
  }
  push(
    "Réalisations — vue d'ensemble",
    `${BRAND} a livré ${WORKS.length} sites publiés : ${WORKS.map((w) => w.name).join(", ")}. Chacun est présenté avec un aperçu animé sur la page Réalisations.`,
    "/realisations"
  );

  /* ── FAQ (questions classées par thème) ── */
  for (const cat of FAQ.fr.categories) {
    for (const item of cat.items) {
      push(`FAQ ${cat.title} — ${item.q}`, item.a, "/faq");
    }
  }

  /* ── Tarifs (catalogue officiel) ── */
  push(
    "Tarifs — Sites web",
    WEB_OFFERS.map((o) => `${o.name} : ${priceLine(o)}${o.footnote ? ` — ${o.footnote}` : ""}`).join("\n") +
      `\n${WEB_RENEWALS.map((o) => `${o.name} : ${priceLine(o)}${o.footnote ? ` — ${o.footnote}` : ""}`).join("\n")}` +
      `\n${WEB_PAYMENT_ADDON.name} : ${priceLine(WEB_PAYMENT_ADDON)}${WEB_PAYMENT_ADDON.footnote ? ` — ${WEB_PAYMENT_ADDON.footnote}` : ""}` +
      `\nTous les sites incluent : domaine, hébergement, 2 e-mails pro, chatbot IA alimenté par le contenu, capture de leads, SEO et indexation Google. Site vitrine : sans tableau de bord, bugs vérifiés 6 mois puis remise des clés. Site à tableau de bord : 1 administrateur, messages reçus dans le tableau de bord + e-mail + WhatsApp, site téléchargeable en application, blog (1 article/mois, 12 intégrés), notifications, fonction Publicité push, statistiques ; bugs pris en charge pendant toute la collaboration. Site customisé : options sur mesure (chatbot WhatsApp, chatbot conversationnel entraîné pour la vente, section « réseau social »).`,
    "/tarifs"
  );
  push(
    "Tarifs — Logiciels sur mesure",
    SOFTWARE_OFFERS.map((o) => `${o.name} : ${priceLine(o)}${o.footnote ? ` — ${o.footnote}` : ""}`).join("\n"),
    "/tarifs"
  );
  push(
    "Tarifs — Logiciels SaaS de gestion",
    SAAS_PRODUCTS.map(
      (p) => `${p.name} : ${p.offers.map((o) => `${o.name} ${priceLine(o)}`).join(" ; ")}`
    ).join("\n") +
      "\nConception de workflows sur mesure : chiffrée après étude (sur devis).",
    "/tarifs"
  );
  push(
    "Tarifs — Community management",
    COMMUNITY_OFFERS.map((o) => `${o.name} : ${priceLine(o)}${o.footnote ? ` — ${o.footnote}` : ""}`).join("\n") +
      "\nPlateformes : Facebook, Instagram, LinkedIn, TikTok, YouTube Shorts. Publicité sponsorisée incluse (10 $ / 50 $ / 100 $ par mois). Essentiel et Professionnel sans équipe de terrain ; Premium avec équipe dédiée (2 interventions/semaine) et 5 montages vidéo.",
    "/tarifs"
  );
  push(
    "Tarifs — Acquisition client (B2B)",
    ACQUISITION_OFFERS.map((o) => `${o.name} : ${priceLine(o)}${o.footnote ? ` — ${o.footnote}` : ""}`).join("\n") +
      "\nPrécision : contacts B2B par secteur et par pays, partout dans le monde ; nous garantissons la qualité des contacts, PAS leur passage à l'achat — la prospection et la conversion restent le travail de l'équipe du client, sauf avec la prospection téléphonique déléguée.",
    "/tarifs"
  );
  push(
    "Tarifs — Formations (équipes en entreprise)",
    TRAINING_OFFERS.map((o) => `${o.name} : ${priceLine(o)}${o.footnote ? ` — ${o.footnote}` : ""}`).join("\n") +
      "\nThèmes : stratégie d'acquisition client (y compris via LinkedIn), prospection téléphonique, neuromarketing et stratégie de vente, fidélisation client, intelligence artificielle appliquée au domaine d'activité. Nous formons les équipes des entreprises, pas les particuliers.",
    "/tarifs"
  );

  /* ── Méthode de travail ── */
  push(
    "Méthode de travail",
    "Quatre étapes : écoute et cadrage du besoin, maquette et validation, développement avec points d'étape réguliers, mise en ligne avec formation du client. Sur un site vitrine, bugs et failles sont vérifiés sans frais pendant les 6 premiers mois puis toutes les clés sont remises ; sur un site avec tableau de bord et sur les logiciels, les bugs sont corrigés sans frais pendant toute la collaboration.",
    "/methode"
  );

  /* ── À propos ── */
  push(
    "À propos de l'agence",
    [
      APROPOS.fr.hero.sub,
      ...APROPOS.fr.whyUs.cards.map((c) => `${c.title} : ${c.text}`),
    ].join("\n"),
    "/a-propos"
  );

  /* ── Blog (thématiques éditoriales) ── */
  push(
    "Blog — articles et conseils",
    [
      BLOG.fr.hero.sub,
      `Thématiques abordées : ${BLOG.fr.topics.cards.map((c) => `${c.title} (${c.text})`).join(" ; ")}.`,
      "Les articles publiés sont à lire sur la page Blog.",
    ].join(" "),
    "/blog"
  );

  return docs;
}

/* ── Retrieval par mots-clés (robuste, sans dépendance) ── */

const STOP = new Set([
  "le","la","les","un","une","des","de","du","d","l","et","ou","à","a","au","aux","en",
  "pour","par","sur","dans","avec","sans","que","qui","quoi","quel","quelle","quels",
  "quelles","comment","combien","est","sont","vous","votre","vos","je","j","moi","mon",
  "ma","mes","ce","cet","cette","ces","il","elle","on","nous","se","sa","son","ses","y",
  "plus","moins","prix","tarif","tarifs","cout","coûte","coute","the","of","and","to",
  "is","are","what","how","much","does","do","for","you","your","we","our","in","on",
  "a","an","it","can","have","has","i","me","my",
]);

function normalize(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9à-ÿ\s-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function tokenize(s: string): string[] {
  return normalize(s)
    .split(" ")
    .filter((t) => t.length > 1 && !STOP.has(t));
}

/**
 * Alias multilingues (en/es/de) → vocabulaire FRANÇAIS de l'index.
 * L'index est rédigé en fr ; sans cette table, une question en anglais
 * (« training management software ») ne retrouve pas la page du logiciel
 * correspondant (« gestion de formation ») et le modèle dérive sur les prix.
 * Les cibles sont déjà normalisées (sans accents) comme le reste de l'index.
 */
const ALIASES: Record<string, string[]> = {
  /* EN */
  training: ["formation"], trainings: ["formation"], train: ["formation"],
  software: ["logiciel", "logiciels"], apps: ["application", "mobile"], app: ["application", "mobile"],
  invoice: ["facture", "facturation"], invoicing: ["facturation", "facture"],
  accounting: ["comptable", "comptabilite"], bookkeeping: ["comptabilite"],
  hospital: ["hopital", "clinique"], clinic: ["clinique", "hopital"],
  school: ["ecole"], schools: ["ecole"], student: ["eleve", "apprenant"], students: ["eleve", "apprenant"],
  pharmacy: ["pharmacie"], drug: ["medicament"], drugs: ["medicament"],
  realestate: ["immobiliere", "immobilier"], property: ["immobilier", "bailleur"],
  landlord: ["bailleur"], tenant: ["locataire"], rent: ["loyer"], rents: ["loyer"],
  certificate: ["certificat", "attestation"], certificates: ["certificat", "attestation"],
  learner: ["apprenant"], learners: ["apprenant"], attendance: ["presence"],
  website: ["site", "vitrine"], websites: ["site"], webpage: ["site"],
  dashboard: ["tableau", "bord"], backoffice: ["tableau", "bord"],
  store: ["boutique"], shop: ["boutique"], ecommerce: ["boutique", "commerce"],
  pricing: ["prix", "tarif"], price: ["prix", "tarif"], fee: ["prix", "tarif"], fees: ["prix", "tarif"], costs: ["prix"], cost: ["prix"],
  lead: ["lead", "prospect"], leads: ["lead", "prospect"], prospecting: ["prospection", "prospect"],
  advertising: ["publicite", "pub"], ads: ["publicite", "pub"], campaign: ["campagne"], campaigns: ["campagne"],
  social: ["reseaux", "sociaux"],
  bug: ["bug", "bugs"], bugs: ["bug", "bugs"],
  renewal: ["renouvellement"], renewals: ["renouvellement"], domain: ["domaine"], hosting: ["hebergement"],
  payment: ["paiement"], payments: ["paiement"],
  demo: ["demo", "demonstration"], trial: ["essai", "gratuit"],
  /* ES */
  formacion: ["formation"], formaciones: ["formation"],
  factura: ["factura", "facture"], facturacion: ["facturation"],
  contable: ["comptable"], contabilidad: ["comptabilite"],
  farmacia: ["pharmacie"], escuela: ["ecole"], colegio: ["ecole"],
  inmobiliaria: ["immobiliere"], alquiler: ["loyer"],
  certificado: ["certificat"], certificados: ["certificat"],
  alumno: ["apprenant"], alumnos: ["apprenant"], asistencia: ["presence"],
  prueba: ["essai"], gratis: ["gratuit"], mantenimiento: ["maintenance"],
  dominio: ["domaine"], alojamiento: ["hebergement"], pago: ["paiement"],
  demostracion: ["demonstration"], publicidad: ["publicite"],
  /* DE */
  schulung: ["formation"], schulungen: ["formation"],
  buchhaltung: ["comptabilite"], krankenhaus: ["hopital"], klinik: ["clinique"],
  apotheke: ["pharmacie"], immobilien: ["immobilier"], miete: ["loyer"],
  rechnung: ["facture"], angebot: ["devis"], test: ["essai"],
  wartung: ["maintenance"], zahlung: ["paiement"],
};

/** Résout un token en [token + alias] (dédupe). */
function expand(tk: string): string[] {
  const alts = ALIASES[tk];
  return alts ? [tk, ...alts.filter((a) => a !== tk)] : [tk];
}

const DOCS = buildSiteDocs();
const DOCS_TOKENS = DOCS.map((d) => ({
  titleTokens: new Set(tokenize(d.title)),
  bodyTokens: tokenize(d.body),
  bodySet: new Set(tokenize(d.body)),
}));

/**
 * Retourne les extraits les plus pertinents pour une question.
 * Score : correspondances de titre (×3) + correspondances de corps,
 * avec bonus si le document contient TOUS les mots-clés principaux.
 *
 * Note latence : k=4 et corps tronqués — le prompt système est la première
 * cause de latence TTFT chez les fournisseurs LLM.
 */
export function retrieveSiteDocs(query: string, k = 4): SiteDoc[] {
  const tokens = tokenize(query);
  if (tokens.length === 0) return [];
  const scored = DOCS.map((doc, i) => {
    const { titleTokens, bodyTokens, bodySet } = DOCS_TOKENS[i];
    let score = 0;
    let matched = 0;
    for (const raw of tokens) {
      /* chaque token teste aussi ses alias multilingues (training→formation…) */
      const variants = expand(raw);
      let hit = 0;
      for (const tk of variants) {
        if (titleTokens.has(tk)) {
          hit = Math.max(hit, 3);
          continue;
        }
        if (bodySet.has(tk)) {
          hit = Math.max(hit, 1);
          continue;
        }
        /* préfixe tolérant (pluriels, conjugaisons) */
        const pref = bodyTokens.find((b) => b.startsWith(tk.slice(0, Math.max(4, tk.length - 2))));
        if (pref) hit = Math.max(hit, 0.5);
      }
      if (hit > 0) matched++;
      score += hit;
    }
    /* bonus couverture : tous les mots-clés présents */
    if (matched === tokens.length) score += 4;
    /* léger bonus réalisations quand on cherche des exemples */
    return { doc, score };
  })
    .filter((s) => s.score >= 3)
    .sort((a, b) => b.score - a.score)
    .slice(0, k);
  return scored.map((s) => s.doc);
}

/** Taille max d'un extrait injecté dans le prompt (latence TTFT). */
const DOC_BODY_MAX = 600;

/** Bloc « CONTEXTE DU SITE » injecté dans le prompt système. */
export function siteContextBlock(query: string): string {
  const docs = retrieveSiteDocs(query);
  if (docs.length === 0) return "";
  const parts = docs.map((d) => {
    const body = d.body.length > DOC_BODY_MAX ? `${d.body.slice(0, DOC_BODY_MAX).replace(/\s+\S*$/, "")}…` : d.body;
    return d.path
      ? `### ${d.title} (page : ${d.path})\n${body}`
      : `### ${d.title}\n${body}`;
  });
  return `CONTEXTE DU SITE — extraits pertinents des pages réelles (utilise ces informations en priorité ; le chemin entre parenthèses peut être ouvert pour le visiteur avec l'action navigate) :\n\n${parts.join("\n\n")}`;
}
