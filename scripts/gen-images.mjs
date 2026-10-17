/**
 * Génération des visuels du site — thème « Obsidienne & Or » (§32).
 * 10 fonds de bandeau (une page = un visuel), 7 visuels de pôles,
 * 6 visuels de produits SaaS. Aucun texte généré dans les images.
 */
import ZAI from "z-ai-web-dev-sdk";
import fs from "fs";
import path from "path";

const ROOT = "/home/z/my-project/public/images";

const STYLE =
  "deep obsidian black background, elegant warm gold accents, cinematic moody lighting, premium luxury tech aesthetic, photorealistic, high quality, detailed, dark tones dominating with subtle golden highlights, no text, no words, no letters, no watermark";

const HEADERS = [
  ["header-services", "elegant dark workspace with laptop screens and notebooks arranged on a black marble desk, warm golden desk lamp glow"],
  ["header-logiciels", "dark software dashboard glowing on a widescreen monitor in a dim room, golden data charts and graphs"],
  ["header-tarifs", "abstract dark composition of floating geometric golden frames and cubes over black marble, soft golden bokeh"],
  ["header-faq", "dark elegant abstract background with soft golden light rays through dark smoke, mysterious premium atmosphere"],
  ["header-a-propos", "modern african tech office at night, small team silhouettes collaborating, warm golden ambient lighting"],
  ["header-contact", "dark abstract waves of golden light flowing across black background, elegant communication concept"],
  ["header-blog", "dark editorial desk with open magazine, fountain pen and coffee cup, golden rim lighting"],
  ["header-realisations", "dark modern gallery wall of glowing screens showing website designs, golden spotlights"],
  ["header-secteurs", "night skyline of an african coastal city, skyscrapers with warm golden window lights, dark sky"],
  ["header-methode", "abstract ascending golden staircase of light steps in dark space, elegant journey concept"],
];

const SERVICES = [
  ["svc-web", "elegant website design mockups on laptop and tablet screens standing on dark desk, golden glow reflections"],
  ["svc-software", "software developer workspace with multiple monitors showing code, dark room with golden screen glow"],
  ["svc-saas", "cloud software concept, laptop tablet and smartphone floating over dark background with golden cloud of light"],
  ["svc-community", "hand holding smartphone with glowing social media interface, dark background with golden bokeh lights"],
  ["svc-acquisition", "rising golden growth arrow chart over dark business district background, marketing funnel concept"],
  ["svc-training", "modern training room at night, presenter silhouette before glowing screen, warm golden lighting"],
  ["svc-strategy", "chess pieces and strategy notes on dark marble table, golden dramatic side lighting"],
];

const SAAS = [
  ["saas-factura", "professional invoicing interface glowing on laptop screen, receipts and calculator on dark desk, golden light"],
  ["saas-compta", "accounting ledger books with golden pen and financial charts on screens, dark elegant office"],
  ["saas-hosp", "modern hospital reception at night, clean lines, warm golden ambient light, medical technology screens"],
  ["saas-ecole", "modern school classroom with digital tablet on desk, chalkboard in dark tones, warm golden morning light"],
  ["saas-immo", "modern residential building model with keys on dark marble, golden accent lighting"],
  ["saas-pharma", "elegant pharmacy shelves with medicine boxes, dark premium interior with warm golden lighting"],
];

const JOBS = [
  ...HEADERS.map(([n, p]) => ({ dir: "headers", name: n, prompt: `${p}, wide banner composition`, size: "1536x640" })),
  ...SERVICES.map(([n, p]) => ({ dir: "services", name: n, prompt: p, size: "1344x768" })),
  ...SAAS.map(([n, p]) => ({ dir: "saas", name: n, prompt: p, size: "1344x768" })),
];

async function main() {
  const zai = await ZAI.create();
  const out = [];
  let done = 0;

  const worker = async (queue) => {
    while (queue.length) {
      const job = queue.shift();
      if (!job) return;
      const dir = path.join(ROOT, job.dir);
      fs.mkdirSync(dir, { recursive: true });
      const file = path.join(dir, `${job.name}.png`);
      if (fs.existsSync(file) && fs.statSync(file).size > 20_000) {
        done++;
        console.log(`= exists ${job.name}`);
        continue;
      }
      for (let attempt = 1; attempt <= 5; attempt++) {
        try {
          const res = await zai.images.generations.create({ prompt: job.prompt + ", " + STYLE, size: job.size });
          const b64 = res?.data?.[0]?.base64;
          if (!b64) throw new Error("empty response");
          fs.writeFileSync(file, Buffer.from(b64, "base64"));
          done++;
          console.log(`+ [${done}/${JOBS.length}] ${job.name} (${Math.round(fs.statSync(file).size / 1024)} KB)`);
          break;
        } catch (e) {
          console.error(`! ${job.name} attempt ${attempt}: ${e.message}`);
          if (attempt === 5) out.push(job.name);
          else await new Promise((r) => setTimeout(r, 5000 * attempt));
        }
      }
    }
  };

  /* File unique séquentielle — l'API d'images est sensible au débit. */
  await worker([...JOBS]);

  console.log(`DONE ok=${done} failed=[${out.join(", ")}]`);
}

main().catch((e) => {
  console.error("FATAL", e);
  process.exit(1);
});
