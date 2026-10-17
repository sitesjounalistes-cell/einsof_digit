import type { Metadata } from "next";
import { ContactPage } from "@/components/pages/ContactPage";
import { GEO, PAGE_KEYWORDS, buildMetadata } from "@/lib/seo";

/* /contact — cible « devis création site web Guinée », « agence
   digitale Conakry contact »… */
export const metadata: Metadata = buildMetadata({
  path: "/contact",
  title: `Devis création de site web & logiciel en Guinée — Contact`,
  description:
    `Demandez votre devis gratuit : réponse sous 24 heures ouvrées, devis détaillé sous 48 h. Création de site web professionnel, logiciel sur mesure, application mobile, SaaS, community management et formation en ${GEO.country} — ${GEO.city} et tout le pays.`,
  keywords: PAGE_KEYWORDS.contact,
});

export default function ContactRoute() {
  return <ContactPage />;
}
