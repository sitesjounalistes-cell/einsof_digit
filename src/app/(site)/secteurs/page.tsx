import type { Metadata } from "next";
import { SecteursPage } from "@/components/pages/SecteursPage";
import { GEO, PAGE_KEYWORDS, buildMetadata } from "@/lib/seo";

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
  return <SecteursPage />;
}
