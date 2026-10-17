import type { Metadata } from "next";
import { SecteursPage } from "@/components/pages/SecteursPage";
import { JsonLd } from "@/components/site/JsonLd";
import {
  GEO,
  PAGE_KEYWORDS,
  SITE_URL,
  buildMetadata,
  itemListJsonLd,
  webPageJsonLd,
} from "@/lib/seo";
import { SECTOR_SEO } from "@/lib/seo";

/* /secteurs — longue traîne « site web pour hôtel/école/clinique en
   Guinée » : capture les recherches par métier. */
export const metadata: Metadata = buildMetadata({
  path: "/secteurs",
  title: `Solutions digitales par secteur — Santé, école, commerce… | Guinée`,
  description:
    `14 secteurs servis en ${GEO.country} : santé (logiciel de gestion hospitalière), éducation (gestion d'école), immobilier, commerce, hôtellerie, restauration, banque, mines, ONG… Des sites web et logiciels adaptés aux réalités du terrain, à ${GEO.city} comme à l'intérieur du pays.`,
  keywords: PAGE_KEYWORDS.secteurs,
});

export default function SecteursRoute() {
  /* ItemList : les 14 pages secteurs — toutes les longue traîne métier. */
  const sectorItems = SECTOR_SEO.map((s) => ({
    name: `Sites web et logiciels pour ${s.name.toLowerCase()} en Guinée`,
    url: `${SITE_URL}/secteurs/${s.slug}`,
  }));

  return (
    <>
      <JsonLd
        data={[
          itemListJsonLd({
            path: "/secteurs",
            name: "Solutions digitales par secteur d'activité en Guinée — 14 secteurs",
            items: sectorItems,
          }),
          webPageJsonLd({
            path: "/secteurs",
            name: "Secteurs — solutions digitales par métier en Guinée",
            description:
              "Sites web et logiciels pour la santé, l'éducation, l'immobilier, le commerce, l'hôtellerie, la banque, les mines, les ONG et plus encore, en Guinée.",
            type: "CollectionPage",
          }),
        ]}
      />
      <SecteursPage />
    </>
  );
}
