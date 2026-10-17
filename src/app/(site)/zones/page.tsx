import type { Metadata } from "next";
import { ZonesPage } from "@/components/pages/ZonesPage";
import { JsonLd } from "@/components/site/JsonLd";
import {
  PAGE_KEYWORDS,
  ZONES_META,
  breadcrumbJsonLd,
  buildMetadata,
  faqJsonLd,
  webPageJsonLd,
} from "@/lib/seo";
import { ZONES_PAGE } from "@/lib/pages-content/zones";

/* /zones — SEO local « monstrueux » : toute requête géographique
   (« création de site web à Kankan », « agence digitale Nzérékoré »…)
   doit mener ici. FAQPage JSON-LD = réponses enrichies sur la couverture
   nationale, les projets à distance et la diaspora. */
export const metadata: Metadata = buildMetadata({
  path: "/zones",
  title: ZONES_META.title,
  description: ZONES_META.description,
  keywords: PAGE_KEYWORDS.zones,
});

export default function ZonesRoute() {
  return (
    <>
      <JsonLd
        data={[
          webPageJsonLd({
            path: "/zones",
            name: ZONES_META.title,
            description: ZONES_META.description,
          }),
          breadcrumbJsonLd([
            { name: "Accueil", path: "/" },
            { name: "Zones", path: "/zones" },
          ]),
          faqJsonLd(ZONES_PAGE.fr.faq.items),
        ]}
      />
      <ZonesPage />
    </>
  );
}
