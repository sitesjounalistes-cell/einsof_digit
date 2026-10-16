import type { Metadata } from "next";
import { TarifsPage } from "@/components/pages/TarifsPage";

const BRAND = process.env.NEXT_PUBLIC_BRAND_NAME || "EINSOF";

export const metadata: Metadata = {
  title: `Tarifs — ${BRAND}`,
  description:
    "Tous les montants en francs guinéens (GNF), annoncés d'avance : sites web (vitrine 1 500 000, tableau de bord 3 500 000, customisé sur devis), logiciels dès 20 000 000, 7 SaaS de gestion, community management, acquisition client, formations — renouvellement dès 500 000 GNF/an.",
};

export default function TarifsRoute() {
  return <TarifsPage />;
}
