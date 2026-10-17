import type { Metadata } from "next";
import { HomePage } from "@/components/pages/HomePage";
import { GEO } from "@/lib/seo";
import { PAGE_KEYWORDS, buildMetadata } from "@/lib/seo";

/* Accueil — la vitrine SEO principale : ciblage des requêtes
   « création de site web en Guinée », « agence digitale Conakry »… */
export const metadata: Metadata = buildMetadata({
  path: "/",
  title: `Création de site web en Guinée — Agence digitale ${GEO.city} | ${"EINSOF"}`,
  description:
    `Création de site web professionnel en Guinée dès 1 500 000 GNF : site vitrine, site avec tableau de bord, création de logiciels et d'applications mobiles, SaaS de gestion avec essai gratuit, community management et génération de leads. Agence digitale à ${GEO.city} au service des entreprises de Guinée et d'Afrique francophone.`,
  keywords: PAGE_KEYWORDS.home,
});

export default function HomeRoute() {
  return <HomePage />;
}
