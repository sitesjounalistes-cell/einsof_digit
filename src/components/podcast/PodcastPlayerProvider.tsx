"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";
import { toast } from "sonner";
import { useI18n } from "@/lib/i18n";
import { track } from "@/lib/analytics";

/**
 * Lecteur podcast global — UN SEUL élément <audio> monté dans le layout
 * (site) : il SURVIT aux navigations client, la lecture continue quand
 * le visiteur passe de /podcast à /blog puis à l'accueil.
 */

export interface PodcastEpisode {
  id: string;
  slug: string;
  title: string;
  description: string;
  audioUrl: string;
  durationSec: number | null;
  coverImageUrl: string | null;
  publishedAt: string | null;
}

interface PodcastPlayerContextValue {
  episode: PodcastEpisode | null;
  isPlaying: boolean;
  /** Position de lecture (secondes) — pilotée par l'événement timeupdate */
  currentTime: number;
  /** Durée réelle (secondes) — métadonnées audio, repli durationSec */
  duration: number;
  /** Charge l'épisode et lance la lecture (bascule pause si déjà chargé) */
  play: (episode: PodcastEpisode) => void;
  toggle: () => void;
  close: () => void;
  seek: (seconds: number) => void;
}

const PodcastPlayerContext = createContext<PodcastPlayerContextValue | null>(null);

export function usePodcastPlayer(): PodcastPlayerContextValue {
  const ctx = useContext(PodcastPlayerContext);
  if (!ctx) {
    throw new Error("usePodcastPlayer doit être utilisé dans <PodcastPlayerProvider>");
  }
  return ctx;
}

export function PodcastPlayerProvider({ children }: { children: React.ReactNode }) {
  const { t } = useI18n();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  /* « une fois par épisode joué » : slugs déjà trackés pendant la session */
  const trackedRef = useRef<Set<string>>(new Set());

  const [episode, setEpisode] = useState<PodcastEpisode | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const play = useCallback(
    (ep: PodcastEpisode) => {
      const audio = audioRef.current;
      if (!audio || !ep.audioUrl) return;

      /* Épisode déjà chargé → simple bascule lecture / pause */
      if (episode && episode.id === ep.id) {
        if (audio.paused) void audio.play().catch(() => setIsPlaying(false));
        else audio.pause();
        return;
      }

      setEpisode(ep);
      setCurrentTime(0);
      setDuration(ep.durationSec ?? 0);
      audio.src = ep.audioUrl;
      void audio.play().catch(() => setIsPlaying(false));

      if (!trackedRef.current.has(ep.slug)) {
        trackedRef.current.add(ep.slug);
        track("podcast_play", { slug: ep.slug });
      }
    },
    [episode]
  );

  const toggle = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || !episode) return;
    if (audio.paused) void audio.play().catch(() => setIsPlaying(false));
    else audio.pause();
  }, [episode]);

  const close = useCallback(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      audio.removeAttribute("src");
      audio.load();
    }
    setEpisode(null);
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
  }, []);

  const seek = useCallback((seconds: number) => {
    const audio = audioRef.current;
    if (!audio || !Number.isFinite(seconds)) return;
    audio.currentTime = Math.max(0, seconds);
    setCurrentTime(audio.currentTime);
  }, []);

  /* ── Synchronisation via les événements natifs de l'élément audio ── */

  const onPlay = useCallback(() => setIsPlaying(true), []);
  const onPause = useCallback(() => setIsPlaying(false), []);
  const onTimeUpdate = useCallback(() => {
    const audio = audioRef.current;
    if (audio) setCurrentTime(audio.currentTime);
  }, []);
  const onLoadedMetadata = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const d = audio.duration;
    setDuration(Number.isFinite(d) && d > 0 ? d : (episode?.durationSec ?? 0));
  }, [episode]);
  const onEnded = useCallback(() => setIsPlaying(false), []);
  const onError = useCallback(() => {
    setIsPlaying(false);
    /* Toast discret — l'épisode reste affiché, on peut réessayer */
    toast.error(t("contact.error"), { duration: 4000 });
  }, [t]);

  const value = useMemo<PodcastPlayerContextValue>(
    () => ({ episode, isPlaying, currentTime, duration, play, toggle, close, seek }),
    [episode, isPlaying, currentTime, duration, play, toggle, close, seek]
  );

  return (
    <PodcastPlayerContext.Provider value={value}>
      {children}
      {/* L'élément audio vit ici, au niveau du layout : aucune navigation
          client ne le démonte, la lecture continue de page en page. */}
      <audio
        ref={audioRef}
        preload="metadata"
        className="hidden"
        onPlay={onPlay}
        onPause={onPause}
        onTimeUpdate={onTimeUpdate}
        onLoadedMetadata={onLoadedMetadata}
        onEnded={onEnded}
        onError={onError}
      />
    </PodcastPlayerContext.Provider>
  );
}
