import type { Metadata } from "next";
import { RealisationsPage } from "@/components/pages/RealisationsPage";

const BRAND = process.env.NEXT_PUBLIC_BRAND_NAME || "EINSOF";

export const metadata: Metadata = {
  title: `Réalisations — ${BRAND}`,
  description:
    "Projets livrés, partenaires et témoignages : découvrez les types de missions que mène EINSOF depuis sept ans — sites web, logiciels sur mesure, SaaS déployés, réseaux sociaux et acquisition client — en Guinée et en Afrique francophone.",
};

export default function RealisationsRoute() {
  return <RealisationsPage />;
}
