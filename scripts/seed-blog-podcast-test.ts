/**
 * SEED TEMPORAIRE (BLOG-1, QA) — données de test pour vérifier le rendu :
 *  - 2 podcasts publiés (1 avec pochette, 1 sans)
 *  - 1 article : coverImageUrl + isFeatured + videoUrl + un paragraphe
 *    « lien YouTube nu » inséré en tête du body (toutes les langues)
 * Les valeurs d'origine sont sauvegardées dans /tmp/blog1-backup.json
 * pour une restauration exacte par scripts/cleanup-blog-podcast-test.ts.
 * Usage : bun scripts/seed-blog-podcast-test.ts
 */
import { PrismaClient } from "@prisma/client";
import { writeFileSync, existsSync } from "node:fs";

const db = new PrismaClient();

const YT_FIELD = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";
const YT_NUDE = "https://youtu.be/dQw4w9WgXcQ";
const AUDIO_1 = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3";
const AUDIO_2 = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3";
const POST_SLUG = "site-web-multilingue-pourquoi";

async function main() {
  const post = await db.blogPost.findUnique({ where: { slug: POST_SLUG } });
  if (!post) throw new Error(`Article introuvable : ${POST_SLUG}`);

  /* Sauvegarde exacte pour restauration (une seule fois — le script est
     relançable sans écraser les valeurs d'origine par l'état modifié) */
  if (!existsSync("/tmp/blog1-backup.json")) {
    writeFileSync(
      "/tmp/blog1-backup.json",
      JSON.stringify(
        {
          slug: post.slug,
          coverImageUrl: post.coverImageUrl,
          isFeatured: post.isFeatured,
          videoUrl: post.videoUrl,
          body: post.body,
        },
        null,
        2
      )
    );
  }

  /* Article : couverture + à la une + vidéo dédiée + lien YouTube nu en tête */
  const bodyMap: Record<string, string> = JSON.parse(post.body);
  for (const k of Object.keys(bodyMap)) {
    bodyMap[k] = `${YT_NUDE}\n\n${bodyMap[k]}`;
  }
  await db.blogPost.update({
    where: { slug: POST_SLUG },
    data: {
      coverImageUrl: "/images/works/captis.jpg",
      isFeatured: true,
      videoUrl: YT_FIELD,
      body: JSON.stringify(bodyMap),
    },
  });

  /* Deux couvertures supplémentaires (cartes de la grille) —
     remises à null par le cleanup */
  await db.blogPost.update({
    where: { slug: "combien-coute-un-site-web-en-guinee" },
    data: { coverImageUrl: "/images/works/ecometus.jpg" },
  });
  await db.blogPost.update({
    where: { slug: "factura-pro-la-facturation-simplifiee" },
    data: { coverImageUrl: "/images/works/fmk224.jpg" },
  });

  /* Podcasts de test (nettoyés d'abord pour rester idempotent) */
  await db.podcast.deleteMany({
    where: { slug: { in: ["test-ep-1", "test-ep-2"] } },
  });
  await db.podcast.create({
    data: {
      slug: "test-ep-1",
      titleJson: JSON.stringify({
        fr: "Créer son site web en Guinée : par où commencer",
        en: "Building your website in Guinea: where to start",
      }),
      descriptionJson: JSON.stringify({
        fr: "Épisode de test : budget, étapes et pièges à éviter pour un premier site professionnel.",
        en: "Test episode: budget, steps and pitfalls for a first professional website.",
      }),
      audioUrl: AUDIO_1,
      sourceUrl: "https://www.soundhelix.com/audio-examples",
      durationSec: 372,
      coverImageUrl: "/images/works/emrod.jpg",
      isPublished: true,
      publishedAt: new Date("2026-02-01T10:00:00.000Z"),
      sortOrder: 1,
    },
  });
  await db.podcast.create({
    data: {
      slug: "test-ep-2",
      titleJson: JSON.stringify({
        fr: "Vendre sur les réseaux sociaux depuis Conakry",
        en: "Selling on social media from Conakry",
      }),
      descriptionJson: JSON.stringify({
        fr: "Deuxième épisode de test, sans pochette : le repli monogramme doit s'afficher.",
        en: "Second test episode, without cover: the monogram fallback must show.",
      }),
      audioUrl: AUDIO_2,
      durationSec: 425,
      isPublished: true,
      publishedAt: new Date("2026-02-05T10:00:00.000Z"),
      sortOrder: 2,
    },
  });

  console.log("seed BLOG-1 ok : article enrichi + 2 podcasts publiés");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
