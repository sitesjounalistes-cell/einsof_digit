import type { Metadata } from "next";
import { TarifsPage } from "@/components/pages/TarifsPage";

const BRAND = process.env.NEXT_PUBLIC_BRAND_NAME || "EINSOF";

export const metadata: Metadata = {
  title: `Tarifs — ${BRAND}`,
  description:
    "Tous les montants en francs guinéans (GNF), annoncés d'avance : sites web (vitrine 1 500 000, tableau de bord 2 500 000, boutique 3 500 000), logiciels sur mesure dès 20 000 000, SaaS de gestion et renouvellement annuel 500 000 GNF.",
};

export default function TarifsRoute() {
  return <TarifsPage />;
}
