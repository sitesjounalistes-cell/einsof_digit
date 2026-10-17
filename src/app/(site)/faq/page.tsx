import type { Metadata } from "next";
import { FaqPage } from "@/components/pages/FaqPage";
import { JsonLd } from "@/components/site/JsonLd";
import { PAGE_KEYWORDS, buildMetadata, faqJsonLd } from "@/lib/seo";
import { FAQ } from "@/lib/pages-content/faq";

/* /faq — FAQPage JSON-LD : réponses enrichies Google sur les délais,
   tarifs, maintenance, propriété du code… */
export const metadata: Metadata = buildMetadata({
  path: "/faq",
  title: "FAQ — Création de site web et logiciels en Guinée : vos questions",
  description:
    "Délais de création, tarifs en GNF, maintenance, propriété du site et du code, formation, support, langues : les réponses claires avant de démarrer votre projet de site web, logiciel ou application en Guinée.",
  keywords: PAGE_KEYWORDS.faq,
});

export default function FaqRoute() {
  const items = FAQ.fr.categories.flatMap((c) => c.items);
  return (
    <>
      <JsonLd data={faqJsonLd(items)} />
      <FaqPage />
    </>
  );
}
