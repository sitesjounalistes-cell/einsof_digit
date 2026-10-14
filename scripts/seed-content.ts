/**
 * Seed du Journal (blog) — contenus éditoriaux de l'agence.
 * Règle stricte (cahier des charges §20.4 / §19) : aucun fait, prix ou client
 * inventé — uniquement des informations dérivées du cahier des charges
 * (tarifs exacts §19, deux piliers §19.3, modalités d'essai §12).
 * Idempotent : upsert par slug.
 *
 * Exécution : bun scripts/seed-content.ts
 */
import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

interface SeedPost {
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  category: string;
  readingMin: number;
  publishedAt: Date;
}

const posts: SeedPost[] = [
  {
    slug: "combien-coute-un-site-web-en-guinee",
    category: "web",
    readingMin: 4,
    publishedAt: new Date("2026-10-12T09:00:00Z"),
    title: JSON.stringify({
      fr: "Combien coûte un site web en Guinée ? Le détail de nos offres",
      en: "How much does a website cost in Guinea? Our offers explained",
    }),
    excerpt: JSON.stringify({
      fr: "Trois offres claires, un renouvellement annuel transparent et des inclusions qui dépassent la moyenne : voici exactement ce que vous obtenez avec nous.",
      en: "Three clear offers, a transparent annual renewal and inclusions that go beyond the average: here is exactly what you get with us.",
    }),
    body: JSON.stringify({
      fr: [
        "Chez beaucoup d'agences, le prix d'un site web reste un mystère qu'on découvre seulement au devis. Nous avons choisi l'inverse : trois offres publiques, des montants fixes en francs guinéens, et tout ce qui est inclus écrit noir sur blanc.",
        "La première offre, le site vitrine, est proposée à 1 500 000 GNF. Les pages sont conçues par l'agence, sans tableau de bord d'administration : idéal pour présenter votre activité avec une image impeccable.",
        "La deuxième offre, à 2 500 000 GNF, ajoute le tableau de bord d'administration. Vous gérez vous-même environ 70 % de votre site : textes, images, contenus. Un seul administrateur est prévu ; le multi-utilisateurs ou multi-administrateurs fait l'objet d'un devis.",
        "La troisième offre, à 3 500 000 GNF, est la boutique en ligne avec système de paiement intégré, tableau de bord inclus.",
        "À ces montants s'ajoute le renouvellement annuel de 500 000 GNF, qui couvre votre nom de domaine et votre hébergement : c'est ce qui garantit la continuité de votre site, année après année.",
        "Chaque site comprend le nom de domaine, l'hébergement, deux adresses e-mail professionnelles (selon le forfait), la correction des bugs, le mode clair et sombre, la traduction en plusieurs langues, un chatbot écrit et des formulaires de capture de contacts. Sur devis, nous connectons également un chatbot WhatsApp ou un système d'e-mailing.",
        "Le moyen le plus simple d'y voir clair pour votre projet : demandez un devis ou parlez à notre assistant — il connaît toutes nos offres et vous oriente en quelques échanges.",
      ].join("\n\n"),
      en: [
        "At many agencies, the price of a website is a mystery you only discover at the quote stage. We chose the opposite: three public offers, fixed amounts in Guinean francs, and everything included written in black and white.",
        "The first offer, the showcase site, is priced at 1,500,000 GNF. Pages are designed by the agency, without an administration dashboard: ideal to present your business with a flawless image.",
        "The second offer, at 2,500,000 GNF, adds the administration dashboard. You manage about 70% of your site yourself: texts, images, content. A single administrator is included; multi-user or multi-administrator is quoted separately.",
        "The third offer, at 3,500,000 GNF, is the online store with an integrated payment system and dashboard included.",
        "On top of these amounts comes the 500,000 GNF annual renewal, which covers your domain name and hosting: this is what guarantees your site's continuity, year after year.",
        "Every site includes the domain name, hosting, two professional e-mail addresses (depending on the package), bug fixes, light and dark mode, translation into several languages, a written chatbot and contact capture forms. On quote, we also connect a WhatsApp chatbot or an e-mailing system.",
        "The simplest way to see clearly for your project: request a quote or talk to our assistant — it knows all our offers and guides you in a few exchanges.",
      ].join("\n\n"),
    }),
  },
  {
    slug: "nos-deux-engagements-envers-chaque-client",
    category: "agence",
    readingMin: 3,
    publishedAt: new Date("2026-10-06T09:00:00Z"),
    title: JSON.stringify({
      fr: "Nos deux engagements envers chaque client",
      en: "Our two commitments to every client",
    }),
    excerpt: JSON.stringify({
      fr: "Des bugs corrigés sans frais pendant toute la collaboration, et des services plus complets que la moyenne. Voici ce qui nous distingue, concrètement.",
      en: "Bugs fixed free of charge throughout the collaboration, and services more complete than average. Here is what sets us apart, concretely.",
    }),
    body: JSON.stringify({
      fr: [
        "Deux engagements guident chaque projet que nous livrons. Ils ne sont pas marketing : ils sont écrits dans notre manière de travailler, et ils sont les mêmes depuis sept ans.",
        "Premier engagement : les bugs, les failles et les erreurs, nous nous en chargeons — sans frais supplémentaires. Pendant toute la durée de notre collaboration, si quelque chose ne fonctionne pas dans ce que nous vous avons livré, nous le corrigeons. En revanche, les nouvelles fonctionnalités que vous demandez après la livraison sont facturées à part : c'est la limite honnête de l'engagement.",
        "Deuxième engagement : des services plus complets que la moyenne. Un site chez nous, ce n'est pas seulement des pages : c'est un tableau de bord d'administration, un chatbot, des formulaires de capture de contacts, le mode clair et sombre et la traduction en plusieurs langues, dès l'offre de base.",
        "Et parce qu'un prestataire unique vaut mieux que quatre, nous couvrons aussi vos logiciels sur mesure, vos réseaux sociaux et votre acquisition de clients. Un seul interlocuteur pour tout votre digital.",
        "Nous ne prétendons pas être les moins chers. Nous prétendons livrer plus complet, plus solide, et corriger ce qui doit l'être sans marchander. C'est ainsi que nous construisons des collaborations qui durent.",
      ].join("\n\n"),
      en: [
        "Two commitments guide every project we deliver. They are not marketing: they are written into the way we work, and they have been the same for seven years.",
        "First commitment: bugs, vulnerabilities and errors — we take care of them, at no extra cost. For the entire duration of our collaboration, if something we delivered does not work, we fix it. New features you request after delivery are billed separately: that is the honest limit of the commitment.",
        "Second commitment: services more complete than average. A website with us is not just pages: it includes an administration dashboard, a chatbot, contact capture forms, light and dark mode and translation into several languages, from the base offer.",
        "And because one provider beats four, we also cover your custom software, your social media and your client acquisition. A single contact for your entire digital presence.",
        "We do not claim to be the cheapest. We claim to deliver more complete, more solid work, and to fix what needs fixing without haggling. That is how we build collaborations that last.",
      ].join("\n\n"),
    }),
  },
  {
    slug: "factura-pro-la-facturation-simplifiee",
    category: "saas",
    readingMin: 3,
    publishedAt: new Date("2026-09-28T09:00:00Z"),
    title: JSON.stringify({
      fr: "Factura Pro : la facturation de votre entreprise, sans friction",
      en: "Factura Pro: your company's invoicing, without friction",
    }),
    excerpt: JSON.stringify({
      fr: "Notre SaaS de facturation à 100 000 GNF par mois, testable gratuitement pendant 7 jours. Comment l'essayer et ce qui se passe ensuite.",
      en: "Our invoicing SaaS at 100,000 GNF per month, free to try for 7 days. How to try it and what happens next.",
    }),
    body: JSON.stringify({
      fr: [
        "La facturation est le rythme quotidien d'une entreprise : chaque prestation livrée doit se transformer en facture claire, envoyée à temps, suivie jusqu'au paiement. C'est précisément le travail de Factura Pro, notre SaaS de gestion de la facturation.",
        "Le tarif est simple : 100 000 GNF par mois. Pas de frais d'installation cachés, pas d'engagement compliqué — et un essai gratuit de 7 jours pour vous faire votre propre avis.",
        "L'essai est ouvert à tous : une fois par personne et par logiciel. Vous remplissez le formulaire court (prénom, nom, téléphone), notre équipe active votre accès et vous rappelle pour vous accompagner pendant la prise en main.",
        "Vous hésitez entre un essai et une démonstration guidée ? Notre conseiller peut vous présenter le logiciel en direct, adapté à votre activité — demandez une démo via le formulaire de contact ou l'assistant du site, et nous revenons vers vous sous 24 heures ouvrées.",
        "Factura Pro fait partie de notre gamme de SaaS métiers, aux côtés de la gestion comptable, de la gestion hospitalière, de la gestion d'école, de la gestion immobilière et de la gestion de pharmacie. Un même partenaire pour l'ensemble de vos outils de gestion.",
      ].join("\n\n"),
      en: [
        "Invoicing is a company's daily rhythm: every delivered service must become a clear invoice, sent on time, followed up until payment. That is exactly the job of Factura Pro, our invoicing management SaaS.",
        "The pricing is simple: 100,000 GNF per month. No hidden setup fees, no complicated commitment — and a free 7-day trial to make up your own mind.",
        "The trial is open to everyone: once per person and per software. You fill in the short form (first name, last name, phone), our team activates your access and calls you back to support you as you get started.",
        "Undecided between a trial and a guided demo? Our advisor can present the software live, tailored to your business — request a demo via the contact form or the site assistant, and we get back to you within 24 working hours.",
        "Factura Pro is part of our range of business SaaS, alongside accounting management, hospital management, school management, real-estate management and pharmacy management. One partner for all your management tools.",
      ].join("\n\n"),
    }),
  },
];

async function main() {
  for (const p of posts) {
    const data = {
      title: p.title,
      excerpt: p.excerpt,
      body: p.body,
      category: p.category,
      readingMin: p.readingMin,
      isPublished: true,
      publishedAt: p.publishedAt,
    };
    await db.blogPost.upsert({
      where: { slug: p.slug },
      update: data,
      create: { slug: p.slug, ...data },
    });
  }
  console.log(`Seed OK : ${posts.length} articles de journal (upsert par slug)`);
}

main()
  .catch((e) => {
    console.error("Seed KO :", e);
    process.exitCode = 1;
  })
  .finally(() => db.$disconnect());
