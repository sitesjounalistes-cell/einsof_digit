import { PrismaClient } from "@prisma/client";
const db = new PrismaClient();
// 1 catégorie + 2 projets rattachés
const cat = await db.portfolioCategory.create({ data: { slug: "site-vitrine", nameJson: JSON.stringify({ fr: "Site vitrine" }) } });
await db.project.updateMany({ where: { slug: { in: ["captis", "fmk224"] } }, data: { categoryId: cat.id } });
// 2 témoignages (1 photo, 1 vidéo)
await db.testimonial.createMany({ data: [
  { authorName: "Mariama Camara", authorRole: "Directrice", company: "Boutique Kaloum", sector: "Commerce", quote: JSON.stringify({ fr: "EINSOF a transformé notre boutique : les commandes arrivent maintenant directement sur WhatsApp. Une équipe sérieuse qui livre vraiment." }), rating: 5, authorPhotoUrl: "/uploads/dg-gerant.png", isPublished: true },
  { authorName: "Ibrahima Diallo", authorRole: "Fondateur", company: "Logistique Siguiri", sector: "Transport", quote: JSON.stringify({ fr: "Un site clair, rapide, et surtout un accompagnement réel. Nous recevons des demandes de devis chaque semaine." }), videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", isPublished: true },
] });
// 1 podcast (audio direct jouable)
await db.podcast.create({ data: { slug: "ep-test-digital", titleJson: JSON.stringify({ fr: "Épisode test — le digital en Guinée" }), descriptionJson: JSON.stringify({ fr: "Description de test pour vérifier le lecteur." }), audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3", isPublished: true, publishedAt: new Date() } });
// 1 article à la une avec cover + vidéo
const post = await db.blogPost.findUnique({ where: { slug: "site-web-multilingue-pourquoi" } });
if (post) await db.blogPost.update({ where: { slug: post.slug }, data: { isFeatured: true, coverImageUrl: "/images/works/captis.jpg", videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" } });
console.log("seeded:", cat.slug);
await db.$disconnect();
