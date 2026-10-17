import type { Metadata } from "next";
import { AProposPage } from "@/components/pages/AProposPage";
import { GEO, PAGE_KEYWORDS, buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  path: "/a-propos",
  title: `À propos — Agence digitale guinéenne depuis 7 ans`,
  description:
    `EINSOF, agence de création de sites web et de logiciels basée en ${GEO.country} : sept ans d'expérience, une équipe d'environ dix experts, des prix clairs annoncés d'avance au service des entreprises de Guinée et d'Afrique francophone.`,
  keywords: PAGE_KEYWORDS.about,
});

export default function AProposRoute() {
  return <AProposPage />;
}
