/**
 * Test logique Task 7 — Partenaires / Témoignages / Documents.
 * Exécution directe via bun (le serveur de dev a un cache Prisma périmé).
 * 1) Crée 1 partenaire + 1 témoignage + 1 document réalistes marqués TEST_7
 *    (+ 1 variante masquée de chacun) ;
 * 2) Vérifie que les requêtes publiques (mêmes where que les routes API)
 *    retournent les variantes publiées et excluent les masquées ;
 * 3) SUPPRIME tout — la base doit rester vierge (règle §20.4).
 */
import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

const MARK = "TEST_7";

async function main() {
  /* ── 0. Nettoyage préalable (idempotence) ─────────────────────── */
  const d1 = await db.partner.deleteMany({ where: { name: { contains: MARK } } });
  const d2 = await db.testimonial.deleteMany({ where: { authorName: { contains: MARK } } });
  const d3 = await db.document.deleteMany({ where: { slug: { contains: "test-7" } } });
  console.log(`nettoyage préalable : ${d1.count} partenaires, ${d2.count} témoignages, ${d3.count} documents`);

  /* ── 1. Création (données réalistes marquées TEST_7) ──────────── */
  const partner = await db.partner.create({
    data: {
      name: `${MARK} — Entreprise Partenaire Vérification`,
      logoUrl: "https://example.com/logo-test.png",
      websiteUrl: "https://exemple-partenaire.com",
      description: "Partenaire de vérification technique — ne doit jamais rester en base.",
      sortOrder: 999,
      isActive: true,
    },
  });
  const partnerHidden = await db.partner.create({
    data: { name: `${MARK} — Partenaire Masqué`, isActive: false, sortOrder: 999 },
  });

  const testimonial = await db.testimonial.create({
    data: {
      authorName: `${MARK} — Auteure Vérification`,
      authorRole: "Directrice générale",
      company: "Entreprise Vérification",
      sector: "Vérification",
      quote: JSON.stringify({
        fr: "Citation de vérification technique — assez longue pour passer la validation minimale.",
        en: "Technical verification quote — long enough to pass minimum validation.",
      }),
      rating: 4,
      sortOrder: 999,
      isPublished: true,
    },
  });
  const testimonialHidden = await db.testimonial.create({
    data: {
      authorName: `${MARK} — Témoignage Masqué`,
      quote: JSON.stringify({ fr: "Citation masquée de vérification, jamais publiée." }),
      isPublished: false,
      sortOrder: 999,
    },
  });

  const document_ = await db.document.create({
    data: {
      slug: "test-7-guide-verif",
      title: JSON.stringify({ fr: "Guide de vérification (TEST_7)", en: "Verification guide (TEST_7)" }),
      description: JSON.stringify({ fr: "Document de vérification technique — à supprimer." }),
      category: "Vérification",
      fileUrl: "https://exemple-verification.com/guide-test.pdf",
      fileKind: "pdf",
      visibility: "public",
      isPublished: true,
      sortOrder: 999,
    },
  });
  const documentLead = await db.document.create({
    data: {
      slug: "test-7-doc-lead",
      title: JSON.stringify({ fr: "Document prospect (TEST_7)" }),
      fileUrl: "https://exemple-verification.com/prospect.pdf",
      fileKind: "pdf",
      visibility: "lead", // ne doit JAMAIS apparaître publiquement
      isPublished: true,
      sortOrder: 999,
    },
  });

  /* ── 2. Requêtes publiques (mêmes where que les routes) ───────── */
  const pubPartners = await db.partner.findMany({
    where: { isActive: true },
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
  });
  const pubTestimonials = await db.testimonial.findMany({
    where: { isPublished: true },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
  });
  const pubDocs = await db.document.findMany({
    where: { isPublished: true, visibility: "public" },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
  });

  const assert = (cond: boolean, msg: string) => {
    console.log(`${cond ? "OK " : "ÉCHEC"} — ${msg}`);
    if (!cond) process.exitCode = 1;
  };

  assert(pubPartners.some((p) => p.id === partner.id), "partenaire actif listé publiquement");
  assert(!pubPartners.some((p) => p.id === partnerHidden.id), "partenaire inactif exclu");
  assert(pubTestimonials.some((t) => t.id === testimonial.id), "témoignage publié listé");
  assert(!pubTestimonials.some((t) => t.id === testimonialHidden.id), "témoignage non publié exclu");
  assert(pubDocs.some((d) => d.id === document_.id), "document public listé");
  assert(!pubDocs.some((d) => d.id === documentLead.id), "document visibilité « lead » JAMAIS listé");
  const quote = JSON.parse(pubTestimonials.find((t) => t.id === testimonial.id)?.quote ?? "{}") as {
    fr?: string;
    en?: string;
  };
  assert(typeof quote.fr === "string" && typeof quote.en === "string", "citation JSON {fr,en} lisible");
  console.log(
    `comptes publics (base de dev incluse) : ${pubPartners.length} partenaires, ${pubTestimonials.length} témoignages, ${pubDocs.length} documents`
  );

  /* ── 3. Suppression complète (§20.4 : base vierge) ────────────── */
  for (const id of [partner.id, partnerHidden.id]) await db.partner.delete({ where: { id } });
  for (const id of [testimonial.id, testimonialHidden.id]) await db.testimonial.delete({ where: { id } });
  for (const id of [document_.id, documentLead.id]) await db.document.delete({ where: { id } });

  const leftP = await db.partner.count({ where: { name: { contains: MARK } } });
  const leftT = await db.testimonial.count({ where: { authorName: { contains: MARK } } });
  const leftD = await db.document.count({ where: { slug: { contains: "test-7" } } });
  assert(leftP + leftT + leftD === 0, "base vierge de toute donnée TEST_7 après nettoyage");
}

main()
  .catch((e) => {
    console.error("ÉCHEC du test :", e);
    process.exitCode = 1;
  })
  .finally(() => db.$disconnect());
