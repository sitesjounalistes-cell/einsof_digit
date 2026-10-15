import type { Metadata } from "next";
import { ContactPage } from "@/components/pages/ContactPage";

const BRAND = process.env.NEXT_PUBLIC_BRAND_NAME || "EINSOF";

export const metadata: Metadata = {
  title: `Contact — ${BRAND}`,
  description:
    "Contactez EINSOF : décrivez votre besoin en deux minutes, réponse sous 24 heures ouvrées et devis détaillé sous 48 heures. Sites web, logiciels sur mesure, SaaS de gestion, community management, acquisition et formation.",
};

export default function ContactRoute() {
  return <ContactPage />;
}
