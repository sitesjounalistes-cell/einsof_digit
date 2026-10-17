import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SaasDetailPage } from "@/components/pages/SaasDetailPage";
import { JsonLd } from "@/components/site/JsonLd";
import {
  SAAS_DETAILS,
  SAAS_DETAIL_SLUGS,
  type SaasSlug,
} from "@/lib/pages-content/saas-details";
import { findSaas } from "@/lib/catalog";
import { breadcrumbJsonLd, buildMetadata, softwareJsonLd } from "@/lib/seo";

/** Pages statiques : un paramètre par logiciel SaaS. */
export function generateStaticParams() {
  return SAAS_DETAIL_SLUGS.map((slug) => ({ slug }));
}

/* Metadata longue traîne par produit : « logiciel de facturation
   Guinée », « logiciel de gestion d'école », etc. */
const SEO_BY_SLUG: Record<SaasSlug, { title: string; keywords: string[] }> = {
  "factura-pro": {
    title: "Factura Pro — Logiciel de facturation en Guinée (100 000 GNF/mois)",
    keywords: [
      "logiciel de facturation Guinée",
      "facturation Guinée",
      "générer factures et reçus",
      "Factura Pro",
      "logiciel facture GNF",
      "logiciel de caisse Guinée",
    ],
  },
  "gestion-comptable": {
    title: "Logiciel de gestion comptable en Guinée — Dès 1 000 000 GNF/mois",
    keywords: [
      "logiciel de gestion comptable Guinée",
      "comptabilité Guinée",
      "logiciel comptable PME Guinée",
      "gestion financière Guinée",
    ],
  },
  "gestion-hospitaliere": {
    title: "Logiciel de gestion hospitalière — Cliniques & hôpitaux (1–5 M GNF/mois)",
    keywords: [
      "logiciel de gestion hospitalière",
      "logiciel hôpital Guinée",
      "logiciel clinique Guinée",
      "gestion patients Guinée",
      "logiciel santé Guinée",
    ],
  },
  "gestion-ecole": {
    title: "Logiciel de gestion d'école en Guinée — 500 000 GNF/mois (9 mois)",
    keywords: [
      "logiciel de gestion d'école Guinée",
      "gestion scolaire Guinée",
      "logiciel école privée Guinée",
      "scolarité informatisée Guinée",
      "notes et bulletins logiciel",
    ],
  },
  "gestion-immobiliere": {
    title: "Logiciel de gestion immobilière en Guinée — 500 000 GNF/mois",
    keywords: [
      "logiciel de gestion immobilière Guinée",
      "gestion locative Guinée",
      "logiciel immobilier Conakry",
      "gestion baux et loyers Guinée",
    ],
  },
  "gestion-pharmacie": {
    title: "Logiciel de gestion de pharmacie en Guinée — 7 000 000 GNF/an",
    keywords: [
      "logiciel de gestion de pharmacie Guinée",
      "gestion pharmacie Guinée",
      "logiciel officine Guinée",
      "stock médicaments logiciel",
    ],
  },
  "gestion-formation": {
    title: "Logiciel de gestion de formation — Centres de formation en Guinée",
    keywords: [
      "logiciel de gestion de formation",
      "gestion centre de formation Guinée",
      "logiciel inscriptions formations Guinée",
      "programmes et activités formation",
    ],
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const detail = SAAS_DETAILS.fr[slug as SaasSlug];
  if (!detail) return { title: `Logiciel — EINSOF` };
  const seo = SEO_BY_SLUG[slug as SaasSlug];
  return buildMetadata({
    path: `/logiciels/${slug}`,
    title: seo.title,
    description: detail.hero.sub,
    keywords: [...seo.keywords, ...(detail.hero.chips ?? [])],
  });
}

export default async function SaasDetailRoute({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (!SAAS_DETAIL_SLUGS.includes(slug as SaasSlug)) notFound();
  const detail = SAAS_DETAILS.fr[slug as SaasSlug];
  const saas = findSaas(slug);
  const o = saas?.offers[0];

  return (
    <>
      <JsonLd
        data={[
          softwareJsonLd({
            path: `/logiciels/${slug}`,
            name: detail.name,
            description: detail.hero.sub,
            amount: o?.amount ?? null,
            period: o?.period ?? "month",
            isFrom: o?.isFrom,
            isQuoteOnly: o?.isQuoteOnly,
          }),
          breadcrumbJsonLd([
            { name: "Accueil", path: "/" },
            { name: "Logiciels", path: "/logiciels" },
            { name: detail.name, path: `/logiciels/${slug}` },
          ]),
        ]}
      />
      <SaasDetailPage slug={slug as SaasSlug} />
    </>
  );
}
