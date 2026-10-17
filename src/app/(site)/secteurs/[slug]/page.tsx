import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SecteurDetailPage } from "@/components/pages/SecteurDetailPage";
import { JsonLd } from "@/components/site/JsonLd";
import { PAGE_KEYWORDS, SECTOR_SEO } from "@/lib/seo";
import { SECTEUR_DETAILS } from "@/lib/pages-content/secteur-details";
import { breadcrumbJsonLd, buildMetadata, faqJsonLd, serviceJsonLd } from "@/lib/seo";

/* /secteurs/[slug] — 14 landing pages longue traîne par métier :
   « site web pour hôtel en Guinée », « logiciel pour clinique en
   Guinée »… Chaque page porte la metadata ciblée de SON secteur. */

/** Pages statiques : un paramètre par secteur du référentiel SEO. */
export function generateStaticParams() {
  return SECTOR_SEO.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const sector = SECTOR_SEO.find((s) => s.slug === slug);
  if (!sector) notFound();
  return buildMetadata({
    path: `/secteurs/${slug}`,
    title: sector.metaTitle,
    description: sector.metaDescription,
    keywords: [...sector.keywords, ...PAGE_KEYWORDS.secteurs],
  });
}

export default async function SecteurDetailRoute({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const sector = SECTOR_SEO.find((s) => s.slug === slug);
  const detail = SECTEUR_DETAILS[slug];
  if (!sector || !detail) notFound();

  return (
    <>
      <JsonLd
        data={[
          serviceJsonLd({
            path: `/secteurs/${slug}`,
            name: `Solutions digitales — ${sector.name} en Guinée`,
            description: sector.metaDescription,
          }),
          breadcrumbJsonLd([
            { name: "Accueil", path: "/" },
            { name: "Secteurs", path: "/secteurs" },
            { name: sector.name, path: `/secteurs/${slug}` },
          ]),
          faqJsonLd(detail.faq),
        ]}
      />
      <SecteurDetailPage slug={slug} />
    </>
  );
}
