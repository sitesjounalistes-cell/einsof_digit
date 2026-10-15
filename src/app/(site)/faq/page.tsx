import type { Metadata } from "next";
import { FaqPage } from "@/components/pages/FaqPage";

const BRAND = process.env.NEXT_PUBLIC_BRAND_NAME || "EINSOF";

export const metadata: Metadata = {
  title: `FAQ — ${BRAND}`,
  description:
    "Délais, tarifs, maintenance, formation et support : les réponses claires et détaillées avant de démarrer votre projet avec l'agence.",
};

export default function FaqRoute() {
  return <FaqPage />;
}
