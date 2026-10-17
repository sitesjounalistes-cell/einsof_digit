/**
 * Injection des données SQLite → PostgreSQL (Neon) via Bun.sql — 17/10/2026.
 * Lit _migration_data.json (dump de db/custom.db produit par _dump_sqlite.py)
 * + régénère une grille de créneaux de démo fraîche.
 *
 * Usage : bun scripts/migrate-neon-data.ts
 * Identifiants de tables/colonnes : liste statique de confiance (le dump),
 * valeurs transmises en paramètres positionnels ($1…$n).
 */
import { SQL } from "bun";
import { readFileSync } from "node:fs";

const url = process.env.DATABASE_URL;
if (!url) { console.error("DATABASE_URL manquant"); process.exit(1); }
const sql = new SQL(url);

interface Row { [k: string]: unknown }
interface Dump {
  BlogPost: Row[]; Project: Row[]; PortfolioCategory: Row[];
  SiteSettings: Row[]; Setting: Row[]; SoftwareLink: Row[];
}

const TS = new Set(["createdAt", "updatedAt", "publishedAt", "startsAt"]);
/* SQLite stocke les booléens en 0/1 — PostgreSQL exige un vrai BOOLEAN. */
const BOOL = new Set(["consentContact", "isPublished", "isFeatured", "isActive", "granted"]);
const prep = (r: Row): Row => {
  const out: Row = {};
  for (const [k, v] of Object.entries(r)) {
    if (TS.has(k) && typeof v === "number") out[k] = new Date(v);
    else if (BOOL.has(k)) out[k] = Boolean(v);
    else out[k] = v;
  }
  return out;
};

/** INSERT dynamique : colonnes citées (identifiants internes de confiance),
 *  valeurs en paramètres positionnels. */
async function insert(table: string, rows: Row[]) {
  for (const raw of rows) {
    const r = prep(raw);
    const cols = Object.keys(r).map((c) => `"${c}"`).join(", ");
    const marks = Object.keys(r).map((_, i) => `$${i + 1}`).join(", ");
    const values = Object.values(r);
    await sql.unsafe(`INSERT INTO "${table}" (${cols}) VALUES (${marks})`, values);
  }
}

async function main() {
  const dump: Dump = JSON.parse(readFileSync("_migration_data.json", "utf-8"));

  await sql.unsafe('DELETE FROM "Project"');
  await sql.unsafe('DELETE FROM "PortfolioCategory"');
  await sql.unsafe('DELETE FROM "BlogPost"');
  await sql.unsafe('DELETE FROM "SiteSettings"');
  await sql.unsafe('DELETE FROM "Setting"');
  await sql.unsafe('DELETE FROM "SoftwareLink"');
  await sql.unsafe('DELETE FROM "DemoSlot"');

  await insert("PortfolioCategory", dump.PortfolioCategory);
  await insert("Project", dump.Project);
  await insert("BlogPost", dump.BlogPost);
  await insert("SiteSettings", dump.SiteSettings);
  await insert("Setting", dump.Setting);
  await insert("SoftwareLink", dump.SoftwareLink);

  /* Créneaux frais : mardi/jeudi 10h & 15h UTC (= heure de Conakry),
     capacité 2, 12 créneaux — même logique que ensureUpcomingSlots. */
  const HOURS = [10, 15], DAYS = [2, 4];
  const now = new Date();
  const day = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  let made = 0;
  for (let i = 0; i < 4 * 7 + 7 && made < 12; i++) {
    const d = new Date(day);
    d.setUTCDate(day.getUTCDate() + i);
    if (!DAYS.includes(d.getUTCDay())) continue;
    for (const h of HOURS) {
      if (made >= 12) break;
      const s = new Date(d);
      s.setUTCHours(h, 0, 0, 0);
      if (s.getTime() <= now.getTime() + 30 * 60_000) continue;
      await sql.unsafe(
        'INSERT INTO "DemoSlot" ("id","startsAt","capacity","isActive","createdAt","updatedAt") VALUES ($1,$2,$3,$4,$5,$6)',
        [crypto.randomUUID(), s, 2, true, now, now]
      );
      made++;
    }
  }

  const counts = await sql.unsafe(
    `SELECT (SELECT COUNT(*) FROM "BlogPost") AS articles,
            (SELECT COUNT(*) FROM "Project") AS realisations,
            (SELECT COUNT(*) FROM "SiteSettings") AS reglages,
            (SELECT COUNT(*) FROM "Setting") AS settings,
            (SELECT COUNT(*) FROM "DemoSlot") AS creneaux`
  );
  console.log("Migration Neon terminée :", counts[0]);
  const first = await sql.unsafe('SELECT MIN("startsAt") AS a FROM "DemoSlot"');
  const last = await sql.unsafe('SELECT MAX("startsAt") AS b FROM "DemoSlot"');
  console.log("Créneaux :", String(first[0].a).slice(0, 24), "→", String(last[0].b).slice(0, 24));
  await sql.end();
}

main().catch((e) => { console.error("ÉCHEC seed:", String(e).slice(0, 600)); process.exit(1); });
