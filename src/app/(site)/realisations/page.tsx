import type { Metadata } from "next";
import { RealisationsPage } from "@/components/pages/RealisationsPage";
import { GEO, PAGE_KEYWORDS, buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  path: "/realisations",
  title: `Réalisations web & logiciels en Guinée — Portfolio ${"EINSOF"}`,
  description:
    `Projets livrés en ${GEO.country} et en Afrique francophone : sites web professionnels, logiciels sur mesure, SaaS déployés, réseaux sociaux et acquisition client. Portfolio, partenaires et témoignages clients de l'agence.`,
  keywords: PAGE_KEYWORDS.realisations,
});

export default function RealisationsRoute() {
  return <RealisationsPage />;
}
