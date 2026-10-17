/**
 * Seed des créneaux de démonstration (spec §24) — bun scripts/seed-demo-slots.ts
 *
 * Génère les créneaux récurrents sur 3 semaines : mardi et jeudi à 10:00
 * et à 15:00, HEURE LOCALE Africa/Conakry. La Guinée est en GMT+0 sans
 * heure d'été : les heures locales sont donc stockées directement en UTC.
 * Capacité 2 par créneau. Idempotent : les créneaux déjà présents
 * (même combinaison date + heure, via findFirst) sont sautés.
 *
 * Exécution : bun scripts/seed-demo-slots.ts
 */
import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

const WEEKS = 3;
const HOURS_UTC = [10, 15]; // 10:00 et 15:00 heure de Conakry = UTC (GMT+0)
const CAPACITY = 2;
const DAY_MS = 24 * 60 * 60 * 1000;

async function main() {
  const now = new Date();
  // Début : aujourd'hui à 00:00 UTC — Conakry étant en UTC, jour local = jour UTC.
  const cursor = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 0, 0, 0)
  );
  const end = cursor.getTime() + WEEKS * 7 * DAY_MS;

  let created = 0;
  let skippedExisting = 0;
  let skippedPast = 0;

  for (let t = cursor.getTime(); t < end; t += DAY_MS) {
    const day = new Date(t);
    const dow = day.getUTCDay(); // mardi = 2, jeudi = 4
    if (dow !== 2 && dow !== 4) continue;
    for (const hour of HOURS_UTC) {
      const startsAt = new Date(t + hour * 60 * 60 * 1000);
      if (startsAt.getTime() <= now.getTime()) {
        skippedPast++;
        continue;
      }
      const existing = await db.demoSlot.findFirst({ where: { startsAt } });
      if (existing) {
        skippedExisting++;
        continue;
      }
      await db.demoSlot.create({ data: { startsAt, capacity: CAPACITY, isActive: true } });
      created++;
    }
  }

  const total = await db.demoSlot.count();
  console.log(
    `Seed démos OK : ${created} créneaux créés, ${skippedExisting} déjà présents (sautés), ${skippedPast} passés ignorés — total en base : ${total}`
  );
}

main()
  .catch((e) => {
    console.error("Seed démos KO :", e);
    process.exitCode = 1;
  })
  .finally(() => db.$disconnect());
