/**
 * CLEANUP (BLOG-1, QA) — restaure l'état initial après les tests :
 *  - article : coverImageUrl/isFeatured/videoUrl/body depuis /tmp/blog1-backup.json
 *  - suppression des 2 podcasts de test
 * Usage : bun scripts/cleanup-blog-podcast-test.ts
 */
import { PrismaClient } from "@prisma/client";
import { readFileSync } from "node:fs";

const db = new PrismaClient();

async function main() {
  const backup = JSON.parse(readFileSync("/tmp/blog1-backup.json", "utf8")) as {
    slug: string;
    coverImageUrl: string | null;
    isFeatured: boolean;
    videoUrl: string | null;
    body: string;
  };

  await db.blogPost.update({
    where: { slug: backup.slug },
    data: {
      coverImageUrl: backup.coverImageUrl,
      isFeatured: backup.isFeatured,
      videoUrl: backup.videoUrl,
      body: backup.body,
    },
  });

  /* Couvertures ajoutées par le seed sur 2 autres articles → null */
  await db.blogPost.update({
    where: { slug: "combien-coute-un-site-web-en-guinee" },
    data: { coverImageUrl: null },
  });
  await db.blogPost.update({
    where: { slug: "factura-pro-la-facturation-simplifiee" },
    data: { coverImageUrl: null },
  });

  const del = await db.podcast.deleteMany({
    where: { slug: { in: ["test-ep-1", "test-ep-2"] } },
  });

  console.log(
    `cleanup ok : article ${backup.slug} restauré (cover=${backup.coverImageUrl}, featured=${backup.isFeatured}, video=${backup.videoUrl}), ${del.count} podcast(s) supprimé(s)`
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
