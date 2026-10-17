import type { Metadata } from "next";
import { TarifsPage } from "@/components/pages/TarifsPage";
import { JsonLd } from "@/components/site/JsonLd";
import { PAGE_KEYWORDS, buildMetadata, faqJsonLd } from "@/lib/seo";
import { TARIFS } from "@/lib/pages-content/tarifs";

/* /tarifs — cible toutes les requêtes prix : « prix création site web
   Guinée », « combien coûte un site web en Guinée », « tarif logiciel »… */
export const metadata: Metadata = buildMetadata({
  path: "/tarifs",
  title: "Prix création site web en Guinée — Tarifs officiels en GNF",
  description:
    "Tarifs officiels annoncés d'avance : site vitrine 1 500 000 GNF, site avec tableau de bord 3 500 000 GNF, site customisé sur devis, logiciels dès 20 000 000 GNF, 7 SaaS de gestion dès 100 000 GNF/mois, community management dès 1 500 000 GNF/mois, génération de leads dès 2 000 000 GNF/mois, formations dès 20 000 000 GNF. Renouvellement dès 500 000 GNF/an.",
  keywords: PAGE_KEYWORDS.tarifs,
});

export default function TarifsRoute() {
  /* FAQPage JSON-LD : éligible aux réponses enrichies Google. */
  return (
    <>
      <JsonLd data={faqJsonLd(TARIFS.fr.faq.items)} />
      <TarifsPage />
    </>
  );
}
