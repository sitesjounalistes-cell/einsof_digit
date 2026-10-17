/**
 * DASH-4 — test ponctuel : upsert d'un lien de test sur factura-pro
 * (vidéo YouTube + démo), lecture de contrôle. Usage :
 *   bun scripts/test-software-links.ts seed   → données de test
 *   bun scripts/test-software-links.ts clean  → remise à null (état initial)
 */
import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();
const mode = process.argv[2] ?? "seed";

const seed = {
  slug: "factura-pro",
  videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  demoUrl: "https://example.com/demo-factura",
};

async function main() {
  if (mode === "seed") {
    const row = await db.softwareLink.upsert({
      where: { slug: seed.slug },
      create: seed,
      update: { videoUrl: seed.videoUrl, demoUrl: seed.demoUrl },
    });
    console.log("[seed]", JSON.stringify(row));
  } else if (mode === "clean") {
    const row = await db.softwareLink.update({
      where: { slug: seed.slug },
      data: { videoUrl: null, demoUrl: null },
    });
    console.log("[clean]", JSON.stringify(row));
  } else {
    console.log("Usage: bun scripts/test-software-links.ts seed|clean");
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(() => db.$disconnect());
