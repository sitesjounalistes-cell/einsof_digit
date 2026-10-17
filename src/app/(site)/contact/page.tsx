import type { Metadata } from "next";
import { ContactPage } from "@/components/pages/ContactPage";
import { JsonLd } from "@/components/site/JsonLd";
import { GEO, PAGE_KEYWORDS, buildMetadata, webPageJsonLd } from "@/lib/seo";
import { BRAND } from "@/lib/brand";

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
  return (
    <>
      <JsonLd
        data={webPageJsonLd({
          path: "/contact",
          name: "Contact — devis site web, logiciel et application en Guinée",
          description:
            `Contactez ${BRAND} pour un devis gratuit : création de site web, logiciel sur mesure, application mobile, SaaS, community management et formation en Guinée.`,
          type: "ContactPage",
        })}
      />
      <ContactPage />
    </>
  );
}
