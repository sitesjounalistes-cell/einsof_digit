import type { Metadata } from "next";
import { AProposPage } from "@/components/pages/AProposPage";

const BRAND = process.env.NEXT_PUBLIC_BRAND_NAME || "EINSOF";

export const metadata: Metadata = {
  title: `À propos — ${BRAND}`,
  description:
    "EINSOF, agence digitale premium basée en Guinée : sept ans d'expérience, une équipe d'environ dix experts, deux promesses qui ne bougent pas et des prix clairs annoncés d'avance, au service des entreprises de Guinée et d'Afrique francophone.",
};

export default function AProposRoute() {
  return <AProposPage />;
}
