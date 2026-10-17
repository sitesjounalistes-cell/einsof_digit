/**
 * Réalisations — migration des 8 travaux statiques (src/lib/pages-content/works.ts)
 * vers la table Project. Upsert par slug : relançable sans créer de doublon.
 *
 * Sources de vérité (aucune invention — règle §20.4) :
 *  - title    : nom de marque tel qu'affiché par le site lui-même (works.name)
 *  - client   : le client est la marque elle-même (works.name)
 *  - sector   : works.sector (langue fr — colonne non localisée en base)
 *  - summary  : works.desc (les 5 langues de works.ts sont reprises)
 *  - imageUrl : capture réelle existante (works.shot → /images/works/*.jpg)
 *  - linkUrl  : works.url (lien vérifié par le client)
 *  - year     : 2025 — année de vérification des liens/captures (works.ts) ;
 *               ajustable par réalisation depuis l'Espace équipe.
 *  - isPublished: true — les 8 sites sont réels et publics.
 *
 * Usage : bun scripts/seed-projects.ts
 */
import { PrismaClient } from "@prisma/client";
import { WORKS } from "../src/lib/pages-content/works";

const db = new PrismaClient();

const YEAR = 2025;

interface SeedProject {
  slug: string;
  title: Record<string, string>;
  client: string;
  sector: string;
  year: number;
  summary: Record<string, string>;
  imageUrl: string;
  linkUrl: string;
  sortOrder: number;
}

const SEED: SeedProject[] = WORKS.map((w, i) => ({
  slug: w.slug,
  title: { fr: w.name, en: w.name, es: w.name, zh: w.name, de: w.name },
  client: w.name,
  sector: w.sector.fr,
  year: YEAR,
  summary: { ...w.desc },
  imageUrl: w.shot,
  linkUrl: w.url,
  sortOrder: i + 1,
}));

async function main() {
  let created = 0;
  let updated = 0;
  for (const p of SEED) {
    const data = {
      title: JSON.stringify(p.title),
      client: p.client,
      sector: p.sector,
      year: p.year,
      summary: JSON.stringify(p.summary),
      imageUrl: p.imageUrl,
      linkUrl: p.linkUrl,
      isPublished: true,
      sortOrder: p.sortOrder,
    };
    const existing = await db.project.findUnique({ where: { slug: p.slug } });
    if (existing) {
      await db.project.update({ where: { slug: p.slug }, data });
      updated++;
      console.log(`updated  ${p.slug}  (ordre ${p.sortOrder}, langs: ${Object.keys(p.title).join(",")})`);
    } else {
      await db.project.create({ data: { slug: p.slug, ...data } });
      created++;
      console.log(`created  ${p.slug}  (ordre ${p.sortOrder}, langs: ${Object.keys(p.title).join(",")})`);
    }
  }
  const total = await db.project.count();
  const published = await db.project.count({ where: { isPublished: true } });
  console.log(`\ndone — ${created} created, ${updated} updated`);
  console.log(`table Project : ${total} projet(s), dont ${published} publié(s)`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
