import type { Metadata } from "next";
import { HomePage } from "@/components/pages/HomePage";

export const metadata: Metadata = {
  title: "EINSOF — Agence digitale premium en Guinée",
  description:
    "Sites web, logiciels sur mesure, SaaS de gestion, community management et acquisition client. Sept ans d'expérience au service des entreprises de Guinée et d'Afrique francophone.",
};

export default function HomeRoute() {
  return <HomePage />;
}
