import type { Metadata } from "next";
import { LogicielsPage } from "@/components/pages/LogicielsPage";

const BRAND = process.env.NEXT_PUBLIC_BRAND_NAME || "EINSOF";

export const metadata: Metadata = {
  title: `Logiciels SaaS — ${BRAND}`,
  description:
    "Six logiciels de gestion prêts à l'emploi : facturation, comptabilité, gestion hospitalière, école, immobilier et pharmacie. Essai gratuit 7 jours, démo guidée, support et mises à jour inclus.",
};

export default function LogicielsRoute() {
  return <LogicielsPage />;
}
