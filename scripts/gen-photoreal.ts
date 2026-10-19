/**
 * Génération photoréaliste des visuels du site (retour client 17/10) :
 * l'utilisateur veut de VRAIES images illustratives, visibles, pas des
 * fonds abstraits. Écrase les fichiers existants (mêmes noms) :
 *  - 24 couvertures d'articles de blog (public/images/blog/<slug>.jpg)
 *  - 16 bandeaux (podcast, zones, 14 secteurs)
 * Moteur : z-ai-web-dev-sdk (images.generations), même outil que les
 * visuels d'origine du site. Séquentiel (l'API est sensible au débit).
 *
 * Usage : bun scripts/gen-photoreal.ts [--only blog|headers|test]
 */
import ZAI from "z-ai-web-dev-sdk";
import fs from "node:fs";
import path from "node:path";

const ROOT = path.join(process.cwd(), "public", "images");
const ONLY = process.argv.includes("--only")
  ? process.argv[process.argv.indexOf("--only") + 1]
  : "all";

const STYLE =
  "photorealistic, professional photography, cinematic warm golden ambient lighting with deep obsidian dark tones, premium editorial quality, sharp details, no text, no words, no letters, no watermark, no logo";

/* ── 24 couvertures de blog (scènes concrètes par article) ── */
const BLOG: [string, string][] = [
  ["top-agences-creation-site-web-guinee-2026", "modern african web agency office in Conakry, diverse team of developers and designers working at computers with website mockups on screens, warm golden evening light"],
  ["combien-coute-un-site-web-en-guinee", "close-up of hands typing on laptop showing elegant website design, price calculator and gold-framed glasses on dark wooden desk, warm lamp light"],
  ["vendre-en-ligne-guinee-guide-complet", "african woman entrepreneur packaging product orders next to smartphone showing mobile payment confirmation, small business home studio, warm golden light"],
  ["logiciel-gestion-scolaire-guinee", "african school secretary at computer registering student files digitally, tidy shelves, classroom visible through door, warm morning light"],
  ["logiciel-pharmacie-guinee", "african pharmacist in white coat checking organized medicine shelves with tablet in hand, elegant pharmacy interior, warm golden lighting"],
  ["logiciel-gestion-hospitaliere-guinee", "modern clinic reception, african nurse with computer showing patient records software, clean bright hallway with warm accents"],
  ["logiciel-immobilier-guinee", "african real estate agent showing apartment on tablet to couple, modern building interior with city view, golden hour light"],
  ["comptabilite-facturation-pme-guinee", "african accountant at desk with laptop displaying invoice software, neat stacks of documents, calculator, warm office light"],
  ["apparaitre-premier-google-guinee", "laptop on desk showing search engine results page with one glowing top result, african entrepreneur pointing at screen, golden light"],
  ["site-web-whatsapp-guinee", "close-up of hands holding smartphone with chat conversation and green message bubbles, laptop with website open in background, warm light"],
  ["digitaliser-entreprise-guinee-guide", "african small business owner standing proudly in shop using tablet, traditional shop modernized with digital tools, warm atmosphere"],
  ["nom-domaine-hebergement-guinee-guide", "futuristic server room with warm golden status lights reflecting on dark floor, network cables, premium technology atmosphere"],
  // 12 articles historiques
  ["combien-coute-un-site-web-en-guinee", "elegant laptop displaying professional website with price tags concept, gold coins stack beside, dark desk, warm light"],
  ["nos-deux-engagements-envers-chaque-client", "two african professionals shaking hands with client over desk, warm golden office light, trust and partnership"],
  ["factura-pro-la-facturation-simplifiee", "laptop screen showing clean invoicing software interface, printed invoices and pen on dark desk, golden glow"],
  ["site-web-multilingue-pourquoi", "laptop showing website with multiple language selection flags, globe on dark desk, warm golden light"],
  ["site-vitrine-ou-tableau-de-bord", "split scene: elegant showcase website on tablet left, admin dashboard with charts on laptop right, dark desk"],
  ["logiciel-de-gestion-bien-choisir", "row of glowing screens each showing different management software, dark office with golden reflections"],
  ["creer-application-mobile-guinee", "african developer designing mobile app on large monitor, smartphone mockups on desk, dark room with warm screen glow"],
  ["pourquoi-logiciel-gestion-guinee", "african manager reviewing digital dashboard with growth charts on wall screen, modern dark office, golden accents"],
  ["community-management-guinee-guide", "african social media manager with smartphone and ring light recording product content, dark studio with warm bokeh"],
  ["trouver-clients-b2b-guinee", "african sales team around table with laptop showing client pipeline, business district through window at dusk, golden light"],
  ["former-equipes-digital-guinee", "african trainer presenting digital tools on screen to attentive team in modern training room, warm lighting"],
  ["site-vitrine-ou-ecommerce-guinee", "elegant product photography scene with smartphone showing online boutique, golden props on dark background"],
];

/* ── 16 bandeaux ── */
const WIDE = "wide panoramic banner composition, horizontal";
const HEADERS: [string, string][] = [
  ["headers/header-podcast", `professional podcast microphone with pop filter in dark studio, warm golden bokeh lights, sound waves concept, ${WIDE}`],
  ["headers/header-zones", `aerial night view of Conakry coastal city with golden lights along the coastline, dark ocean, ${WIDE}`],
  ["headers/header-secteur-sante-pharmacie", `modern african hospital corridor with warm golden accent lighting, medical staff silhouette, ${WIDE}`],
  ["headers/header-secteur-education-formation", `african students with books and tablets in modern school courtyard, golden morning light, ${WIDE}`],
  ["headers/header-secteur-immobilier", `modern residential buildings at dusk with warm golden window lights, african city skyline, ${WIDE}`],
  ["headers/header-secteur-commerce-distribution", `well-stocked modern african shop interior with warm golden shelves lighting, ${WIDE}`],
  ["headers/header-secteur-hotellerie-tourisme", `elegant hotel lobby with warm golden chandeliers, african art decor, evening ambiance, ${WIDE}`],
  ["headers/header-secteur-banque-microfinance", `modern bank interior with dark marble and golden accents, professional counter, ${WIDE}`],
  ["headers/header-secteur-btp-construction", `construction site at dusk with tower cranes silhouettes and warm golden work lights, ${WIDE}`],
  ["headers/header-secteur-ong-institutions", `african community meeting under warm light, hands together, humanitarian concept, ${WIDE}`],
  ["headers/header-secteur-transport-logistique", `truck fleet on african highway at golden sunset, logistics warehouse silhouette, ${WIDE}`],
  ["headers/header-secteur-agriculture-agro", `african farmer with tablet in green field at golden hour, modern agriculture, ${WIDE}`],
  ["headers/header-secteur-mines-energie", `industrial mining machinery at night with warm golden floodlights, dark sky, ${WIDE}`],
  ["headers/header-secteur-medias", `professional camera and lighting equipment in dark studio with golden spotlights, ${WIDE}`],
  ["headers/header-secteur-telecoms-evenementiel", `concert event stage with golden lights and crowd silhouettes, telecom towers far, ${WIDE}`],
  ["headers/header-secteur-recrutement", `job interview scene, african candidate and recruiter shaking hands across desk, warm office light, ${WIDE}`],
];

interface Job { file: string; prompt: string; size: string }

const jobs: Job[] = [];
if (ONLY === "all" || ONLY === "blog")
  for (const [slug, p] of BLOG) jobs.push({ file: `blog/${slug}.jpg`, prompt: p, size: "1344x768" });
if (ONLY === "all" || ONLY === "headers")
  for (const [name, p] of HEADERS) jobs.push({ file: `${name}.jpg`, prompt: p, size: "1536x640" });

async function main() {
  const zai = await ZAI.create();
  let done = 0;
  const failed: string[] = [];
  for (const job of jobs) {
    const out = path.join(ROOT, job.file);
    fs.mkdirSync(path.dirname(out), { recursive: true });
    for (let attempt = 1; attempt <= 4; attempt++) {
      try {
        const res = await zai.images.generations.create({
          prompt: `${job.prompt}, ${STYLE}`,
          size: job.size,
        });
        const b64 = (res as { data?: { base64?: string }[] })?.data?.[0]?.base64;
        if (!b64) throw new Error("réponse vide");
        fs.writeFileSync(out, Buffer.from(b64, "base64"));
        done++;
        console.log(`+ [${done}/${jobs.length}] ${job.file} (${Math.round(fs.statSync(out).size / 1024)} Ko)`);
        break;
      } catch (e) {
        console.error(`! ${job.file} essai ${attempt}: ${(e as Error).message}`);
        if (attempt === 4) failed.push(job.file);
        else await new Promise((r) => setTimeout(r, 4000 * attempt));
      }
    }
  }
  console.log(`TERMINE ok=${done} échecs=[${failed.join(", ")}]`);
  if (failed.length) process.exit(1);
}

main().catch((e) => { console.error("FATAL", e); process.exit(1); });
