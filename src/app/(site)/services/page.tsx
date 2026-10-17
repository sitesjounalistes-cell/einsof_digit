import type { Metadata } from "next";
import { ServicesPage } from "@/components/pages/ServicesPage";
import { JsonLd } from "@/components/site/JsonLd";
import {
  GEO,
  PAGE_KEYWORDS,
  SITE_URL,
  buildMetadata,
  itemListJsonLd,
  webPageJsonLd,
} from "@/lib/seo";
import { SERVICE_SLUGS, getServiceNameFr } from "@/lib/pages-content/service-details";

/* /services — cible « agence de création de site web professionnel en
   Guinée », « création de logiciel en Guinée », etc. */
export const metadata: Metadata = buildMetadata({
  path: "/services",
  title: `Agence de création de site web professionnel en Guinée — Nos 7 services`,
  description:
    `Sept pôles d'expertise complémentaires en ${GEO.country} : création de sites web professionnels, développement de logiciels sur mesure et d'applications mobiles, SaaS de gestion, community management, génération de leads et prospects, formations digitales et stratégie. Un seul interlocuteur pour tout votre digital.`,
  keywords: PAGE_KEYWORDS.services,
});

export default function ServicesRoute() {
  /* ItemList : les 7 pôles — maillage sémantique pour les moteurs. */
  const serviceItems = SERVICE_SLUGS.map((slug) => ({
    name: getServiceNameFr(slug) ?? slug,
    url: `${SITE_URL}/services/${slug}`,
  }));

  return (
    <>
      <JsonLd
        data={[
          itemListJsonLd({
            path: "/services",
            name: "Services digitaux EINSOF en Guinée — 7 pôles",
            items: serviceItems,
          }),
          webPageJsonLd({
            path: "/services",
            name: "Services — EINSOF, agence digitale en Guinée",
            description:
              "Création de sites web, logiciels, applications, SaaS, community management, génération de leads, formations et stratégie digitale en Guinée.",
            type: "CollectionPage",
          }),
        ]}
      />
      <ServicesPage />
    </>
  );
}
