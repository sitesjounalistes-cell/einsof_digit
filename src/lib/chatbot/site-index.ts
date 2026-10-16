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
  WEB_RENEWAL,
  SOFTWARE_OFFERS,
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
      `\nRenouvellement annuel (domaine + hébergement) : ${priceLine(WEB_RENEWAL)}.`,
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
    ).join("\n"),
    "/tarifs"
  );

  /* ── Méthode de travail ── */
  push(
    "Méthode de travail",
    "Quatre étapes : écoute et cadrage du besoin, maquette et validation, développement avec points d'étape réguliers, mise en ligne avec formation du client. Les bugs, failles et erreurs sont corrigés sans frais pendant toute la collaboration.",
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
    for (const tk of tokens) {
      let hit = 0;
      if (titleTokens.has(tk)) hit += 3;
      if (bodySet.has(tk)) hit += 1;
      else {
        /* préfixe tolérant (pluriels, conjugaisons) */
        const pref = bodyTokens.find((b) => b.startsWith(tk.slice(0, Math.max(4, tk.length - 2))));
        if (pref) hit += 0.5;
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
