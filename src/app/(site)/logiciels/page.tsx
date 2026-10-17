import type { Metadata } from "next";
import { LogicielsPage } from "@/components/pages/LogicielsPage";
import { GEO, PAGE_KEYWORDS, buildMetadata } from "@/lib/seo";

/* /logiciels — cible « création de logiciels en Guinée », « logiciel
   SaaS », « logiciel de gestion », les requêtes produit ×7. */
export const metadata: Metadata = buildMetadata({
  path: "/logiciels",
  title: `Création de logiciels & applications en Guinée — SaaS de gestion`,
  description:
    `Sept logiciels de gestion prêts à l'emploi avec essai gratuit de 7 jours : facturation, comptabilité, gestion hospitalière, école, immobilière, pharmacie et formation. Création de logiciels sur mesure et d'applications mobiles en ${GEO.country} dès 20 000 000 GNF, workflows automatisés sur mesure.`,
  keywords: PAGE_KEYWORDS.logiciels,
});

export default function LogicielsRoute() {
  return <LogicielsPage />;
}
