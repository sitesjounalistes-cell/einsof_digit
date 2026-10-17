import { SiteShell } from "@/components/site/SiteShell";
import { PodcastPlayerProvider } from "@/components/podcast/PodcastPlayerProvider";
import { PodcastPlayerBar } from "@/components/podcast/PodcastPlayerBar";

/**
 * Coquille du site + lecteur podcast global : le fournisseur (et son
 * unique élément <audio>) est monté au niveau du layout — la lecture
 * d'un épisode SURVIT aux navigations client (blog → accueil → podcast).
 * La barre de lecture, rendue dans le même fournisseur, s'affiche au
 * bas de l'écran tant qu'un épisode est chargé.
 */
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <PodcastPlayerProvider>
      <SiteShell>{children}</SiteShell>
      <PodcastPlayerBar />
    </PodcastPlayerProvider>
  );
}
