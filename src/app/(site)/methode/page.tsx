import type { Metadata } from "next";
import { MethodPage } from "@/components/pages/MethodPage";
import { GEO, PAGE_KEYWORDS, buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  path: "/methode",
  title: `Notre méthode de création de sites web et logiciels en Guinée`,
  description:
    `Cinq étapes, zéro surprise : écoute, conception, développement, livraison et suivi. La méthode éprouvée de l'agence pour créer sites web, logiciels et applications en ${GEO.country} — du premier échange au suivi quotidien.`,
  keywords: PAGE_KEYWORDS.methode,
});

export default function MethodeRoute() {
  return <MethodPage />;
}
