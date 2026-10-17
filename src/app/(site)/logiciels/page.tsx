import type { Metadata } from "next";
import { LogicielsPage } from "@/components/pages/LogicielsPage";
import { JsonLd } from "@/components/site/JsonLd";
import {
  GEO,
  PAGE_KEYWORDS,
  SITE_URL,
  buildMetadata,
  itemListJsonLd,
  webPageJsonLd,
} from "@/lib/seo";
import { SAAS_DETAIL_SLUGS } from "@/lib/pages-content/saas-details";
import { SAAS_PRODUCTS } from "@/lib/catalog";

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
  /* ItemList : les 7 SaaS — maillage produit complet pour les moteurs. */
  const saasItems = SAAS_DETAIL_SLUGS.map((slug) => {
    const product = SAAS_PRODUCTS.find((p) => p.slug === slug);
    return {
      name: `Logiciel ${product?.name ?? slug}`,
      url: `${SITE_URL}/logiciels/${slug}`,
    };
  });

  return (
    <>
      <JsonLd
        data={[
          itemListJsonLd({
            path: "/logiciels",
            name: "Logiciels SaaS de gestion pour la Guinée — 7 outils",
            items: saasItems,
          }),
          webPageJsonLd({
            path: "/logiciels",
            name: "Logiciels — création de logiciels et SaaS de gestion en Guinée",
            description:
              "Création de logiciels sur mesure, applications mobiles et 7 logiciels SaaS de gestion (facturation, comptabilité, santé, école, immobilier, pharmacie, formation) avec essai gratuit 7 jours.",
            type: "CollectionPage",
          }),
        ]}
      />
      <LogicielsPage />
    </>
  );
}
