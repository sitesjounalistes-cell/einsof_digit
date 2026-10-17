import type { Metadata } from "next";
import { ServicesPage } from "@/components/pages/ServicesPage";
import { GEO, PAGE_KEYWORDS, buildMetadata } from "@/lib/seo";

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
  return <ServicesPage />;
}
