import type { Metadata } from "next";
import { RealisationsPage } from "@/components/pages/RealisationsPage";
import { JsonLd } from "@/components/site/JsonLd";
import { GEO, PAGE_KEYWORDS, buildMetadata, webPageJsonLd } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  path: "/realisations",
  title: `Réalisations web & logiciels en Guinée — Portfolio de l'agence`,
  description:
    `Projets livrés en ${GEO.country} et en Afrique francophone : sites web professionnels, logiciels sur mesure, SaaS déployés, réseaux sociaux et acquisition client. Portfolio, partenaires et témoignages clients de l'agence.`,
  keywords: PAGE_KEYWORDS.realisations,
});

export default function RealisationsRoute() {
  return (
    <>
      <JsonLd
        data={webPageJsonLd({
          path: "/realisations",
          name: "Réalisations — sites web et logiciels créés en Guinée par EINSOF",
          description:
            "Portfolio EINSOF : sites web professionnels, logiciels sur mesure et SaaS livrés aux entreprises de Guinée et d'Afrique francophone.",
          type: "CollectionPage",
        })}
      />
      <RealisationsPage />
    </>
  );
}
