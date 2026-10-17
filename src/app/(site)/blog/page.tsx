import type { Metadata } from "next";
import { BlogPage } from "@/components/pages/BlogPage";
import { GEO, PAGE_KEYWORDS, buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  path: "/blog",
  title: `Journal digital — Conseils sites web, logiciels & marketing en Guinée`,
  description:
    `Conseils d'experts pour réussir votre digital en ${GEO.country} : combien coûte un site web, site vitrine ou avec tableau de bord, choisir un SaaS de gestion, multilingue, stratégie et acquisition client.`,
  keywords: PAGE_KEYWORDS.blog,
});

export default function BlogRoute() {
  return <BlogPage />;
}
