import type { Metadata } from "next";
import { GEO, PAGE_KEYWORDS, buildMetadata } from "@/lib/seo";
import { PodcastPage } from "@/components/podcast/PodcastPage";

export const metadata: Metadata = buildMetadata({
  path: "/podcast",
  title: `Podcast EINSOF — Business, tech & marketing digital en ${GEO.country}`,
  description:
    `Le podcast EINSOF : conseils concrets sur le digital en ${GEO.country} — sites web, logiciels de gestion, marketing et entrepreneuriat. Écoutez nos épisodes où que vous soyez, depuis l'application ou le site.`,
  keywords: PAGE_KEYWORDS.podcast,
});

export default function PodcastRoute() {
  return <PodcastPage />;
}
