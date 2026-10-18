/**
 * Injection des 12 articles SEO (rédigés via le brief docs/BRIEF-12-ARTICLES-SEO.md)
 * dans PostgreSQL/Neon, avec couvertures générées et calendrier éditorial.
 *
 * Calendrier : 3 articles/semaine (lun/mer/ven 08:00 heure de Conakry = UTC),
 * premier article publié immédiatement (samedi 17/10/2026).
 *
 * Usage : bun scripts/seed-blog-seo-v2.ts <fichier-articles.txt>
 * Idempotent : les slugs déjà présents sont mis à jour (upsert), pas dupliqués.
 */
import { SQL } from "bun";
import { readFileSync } from "node:fs";

const SRC = process.argv[2] ?? "C:/Users/GBESSI/Downloads/EINSOF-DIGIT-12-articles-SEO.txt";
const url = process.env.DATABASE_URL;
if (!url) { console.error("DATABASE_URL manquant"); process.exit(1); }
const sql = new SQL(url);

/* ── Calendrier 3/semaine (08:00 UTC = heure de Conakry, GMT+0) ── */
const SCHEDULE = [
  new Date("2026-10-17T16:30:00Z"), // sam 17/10 — dès maintenant
  new Date("2026-10-19T08:00:00Z"), // lun 19/10
  new Date("2026-10-21T08:00:00Z"), // mer 21/10
  new Date("2026-10-23T08:00:00Z"), // ven 23/10
  new Date("2026-10-26T08:00:00Z"), // lun 26/10
  new Date("2026-10-28T08:00:00Z"), // mer 28/10
  new Date("2026-10-30T08:00:00Z"), // ven 30/10
  new Date("2026-11-02T08:00:00Z"), // lun 02/11
  new Date("2026-11-04T08:00:00Z"), // mer 04/11
  new Date("2026-11-06T08:00:00Z"), // ven 06/11
  new Date("2026-11-09T08:00:00Z"), // lun 09/11
  new Date("2026-11-11T08:00:00Z"), // mer 11/11
];

interface Article {
  titre: string; slug: string; categorie: string; metaTitle: string;
  metaDescription: string; excerpt: string; keywords: string; corps: string;
}

function parseArticles(src: string): Article[] {
  const blocks = src.split(/===ARTICLE \d+\/12===/).slice(1);
  const out: Article[] = [];
  for (const b of blocks) {
    const body = b.split("===FIN===")[0];
    const grab = (label: string): string => {
      const m = body.match(new RegExp("^" + label + ":\\s*(.*)$", "m"));
      return m ? m[1].trim() : "";
    };
    const corpsM = body.match(/^CORPS:\r?\n([\s\S]*)$/m);
    const a: Article = {
      titre: grab("TITRE"), slug: grab("SLUG"), categorie: grab("CATEGORIE"),
      metaTitle: grab("META_TITLE"), metaDescription: grab("META_DESCRIPTION"),
      excerpt: grab("EXCERPT"), keywords: grab("KEYWORDS"),
      corps: corpsM ? corpsM[1].replace(/\r/g, "").trim() : "",
    };
    if (!a.slug || !a.corps) throw new Error("Article incomplet : " + a.titre);
    out.push(a);
  }
  if (out.length !== 12) throw new Error(`12 articles attendus, ${out.length} trouvés`);
  return out;
}

async function main() {
  const articles = parseArticles(readFileSync(SRC, "utf-8"));
  const now = new Date();
  let i = 0;
  for (const a of articles) {
    const words = a.corps.split(/\s+/).length;
    const readingMin = Math.max(3, Math.round(words / 200));
    const bodyJson = JSON.stringify({ fr: a.corps });
    const titleJson = JSON.stringify({ fr: a.titre });
    const excerptJson = JSON.stringify({ fr: a.excerpt });
    const publishedAt = SCHEDULE[i];
    const cover = `/images/blog/${a.slug}.jpg`;
    const isFeatured = i === 0; // « À la une » : le comparatif Top 7
    const id = crypto.randomUUID();
    // upsert par slug (re-exécution safe)
    const existing = await sql.unsafe('SELECT id FROM "BlogPost" WHERE slug = $1', [a.slug]);
    if (existing.length > 0) {
      await sql.unsafe(
        `UPDATE "BlogPost" SET title=$2, excerpt=$3, body=$4, category=$5, "readingMin"=$6,
         "metaTitle"=$7, "metaDescription"=$8, keywords=$9, "coverImageUrl"=$10,
         "isFeatured"=$11, "isPublished"=true, "publishedAt"=$12, "updatedAt"=$13
         WHERE slug=$1`,
        [a.slug, titleJson, excerptJson, bodyJson, a.categorie, readingMin,
         a.metaTitle, a.metaDescription, a.keywords, cover, isFeatured, publishedAt, now]
      );
    } else {
      await sql.unsafe(
        `INSERT INTO "BlogPost" (id, slug, title, excerpt, body, category, "readingMin",
         "isPublished", "publishedAt", "createdAt", "updatedAt", "metaTitle", "metaDescription",
         keywords, "adsJson", "coverImageUrl", "isFeatured", "videoUrl")
         VALUES ($1,$2,$3,$4,$5,$6,$7,true,$8,$9,$9,$10,$11,$12,'[]',$13,$14,NULL)`,
        [id, a.slug, titleJson, excerptJson, bodyJson, a.categorie, readingMin,
         publishedAt, now, a.metaTitle, a.metaDescription, a.keywords, cover, isFeatured]
      );
    }
    const statut = publishedAt <= now ? "PUBLIÉ" : `planifié ${publishedAt.toISOString().slice(0, 16).replace("T", " ")}`;
    console.log(`${String(i + 1).padStart(2)}/12 ${a.slug} — ${words} mots, ${readingMin} min — ${statut}`);
    i++;
  }
  const counts = await sql.unsafe(
    `SELECT COUNT(*) AS total,
            SUM(CASE WHEN "publishedAt" <= now() THEN 1 ELSE 0 END) AS visibles,
            SUM(CASE WHEN "publishedAt" > now() THEN 1 ELSE 0 END) AS planifies
     FROM "BlogPost" WHERE "isPublished" = true`);
  console.log("Base :", counts[0]);
  await sql.end();
}

main().catch((e) => { console.error("ÉCHEC :", String(e).slice(0, 500)); process.exit(1); });
