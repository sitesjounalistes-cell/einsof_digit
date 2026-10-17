import type { Metadata } from "next";
import { GEO, PAGE_KEYWORDS, buildMetadata } from "@/lib/seo";
import { PodcastPage } from "@/components/podcast/PodcastPage";
import { BRAND } from "@/lib/brand";

export const metadata: Metadata = buildMetadata({
  path: "/podcast",
  title: `Podcast ${BRAND} — Business, tech & marketing digital en ${GEO.country}`,
  /* §20.4 (audit F-16) : description vraie qu'il y ait des épisodes ou non. */
  description:
    `Le podcast ${BRAND} : conseils concrets sur le digital en ${GEO.country} — sites web, logiciels de gestion, marketing et entrepreneuriat. Épisodes publiés au fil de l'eau, à écouter depuis l'application ou le site.`,
  keywords: PAGE_KEYWORDS.podcast,
});

export default function PodcastRoute() {
  return <PodcastPage />;
}
