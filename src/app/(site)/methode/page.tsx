import type { Metadata } from "next";
import { MethodPage } from "@/components/pages/MethodPage";

const BRAND = process.env.NEXT_PUBLIC_BRAND_NAME || "EINSOF";

export const metadata: Metadata = {
  title: `Méthode — ${BRAND}`,
  description:
    "Cinq étapes, zéro surprise : écoute, conception, développement, livraison et suivi. Une méthode éprouvée sur des dizaines de projets, du premier échange au suivi quotidien.",
};

export default function MethodeRoute() {
  return <MethodPage />;
}
