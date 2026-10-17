"use client";

import Image from "next/image";
import { Pause, Play, X } from "lucide-react";
import { Container, Monogram } from "@/components/site/kit";
import { useI18n } from "@/lib/i18n";
import { usePodcastPlayer } from "@/components/podcast/PodcastPlayerProvider";

/**
 * Barre de lecture podcast — fixe en bas de l'écran, visible uniquement
 * quand un épisode est chargé. Au-dessus de la barre d'actions mobile
 * (MobileActionBar + bouton chat restent accessibles) ; sur desktop la
 * barre est dockée au ras du bas (au-dessus du bouton flottant du chat).
 * Progression cliquable (input range natif, accessible au clavier).
 */

function fmtTime(sec: number): string {
  if (!Number.isFinite(sec) || sec < 0) return "0:00";
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}

export function PodcastPlayerBar() {
  const { t } = useI18n();
  const { episode, isPlaying, currentTime, duration, toggle, close, seek } = usePodcastPlayer();

  if (!episode) return null;

  const canSeek = duration > 0;

  return (
    <aside
      role="region"
      aria-label={t("podcast.playerLabel")}
      className="animate-in fade-in slide-in-from-bottom-2 duration-300 fixed inset-x-0 z-[84] border-t border-gold/25 bg-deep/95 backdrop-blur-md bottom-[calc(env(safe-area-inset-bottom)+5.5rem)] md:bottom-0"
    >
      <Container>
        <div className="flex min-h-[4.5rem] flex-col justify-center gap-1.5 py-2.5 md:h-[84px] md:flex-row md:items-center md:gap-5 md:py-0">
          {/* Ligne principale : pochette, titre, contrôles */}
          <div className="flex min-w-0 items-center gap-3">
            {/* Pochette (repli : monogramme or) */}
            <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-md border border-gold/30 bg-surface md:h-12 md:w-12">
              {episode.coverImageUrl ? (
                <Image
                  src={episode.coverImageUrl}
                  alt=""
                  fill
                  sizes="48px"
                  className="object-cover"
                  unoptimized
                />
              ) : (
                <span className="flex h-full w-full items-center justify-center bg-gradient-to-br from-gold/25 via-surface to-black">
                  <Monogram size={30} className="!border-0 !bg-transparent" />
                </span>
              )}
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-[0.625rem] font-medium uppercase tracking-[0.16em] text-goldtext">
                {isPlaying ? t("podcast.nowPlaying") : t("podcast.label")}
              </p>
              <p className="truncate font-serif text-[0.9375rem] leading-snug text-ink md:text-base">
                {episode.title}
              </p>
            </div>

            {/* Play / pause — cible tactile 44 px */}
            <button
              type="button"
              onClick={toggle}
              aria-label={isPlaying ? t("podcast.nowPlaying") : t("podcast.play")}
              className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full gold-fill shadow-[0_0_24px_rgba(212,175,55,0.25)] transition-transform duration-300 hover:scale-105 active:scale-95"
            >
              {isPlaying ? (
                <Pause className="h-5 w-5 text-ongold" strokeWidth={1.75} aria-hidden />
              ) : (
                <Play className="ml-0.5 h-5 w-5 text-ongold" strokeWidth={1.75} aria-hidden />
              )}
            </button>

            {/* Fermer le lecteur */}
            <button
              type="button"
              onClick={close}
              aria-label={t("podcast.close")}
              title={t("podcast.close")}
              className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-mute transition-colors duration-300 hover:text-goldtext"
            >
              <X className="h-5 w-5" strokeWidth={1.5} aria-hidden />
            </button>
          </div>

          {/* Progression + temps (seconde ligne mobile, suite desktop) */}
          <div className="flex flex-1 items-center gap-3 md:max-w-xl">
            <span className="w-10 shrink-0 text-right font-mono text-[0.6875rem] tabular-nums text-mute">
              {fmtTime(currentTime)}
            </span>
            <input
              type="range"
              min={0}
              max={canSeek ? duration : 1}
              step={0.1}
              value={Math.min(currentTime, canSeek ? duration : 1)}
              disabled={!canSeek}
              onChange={(e) => seek(Number(e.target.value))}
              aria-label={t("podcast.playerLabel")}
              aria-valuetext={`${fmtTime(currentTime)} / ${fmtTime(duration)}`}
              className="h-1.5 w-full min-w-0 cursor-pointer accent-gold disabled:cursor-default disabled:opacity-40"
            />
            <span className="w-10 shrink-0 font-mono text-[0.6875rem] tabular-nums text-mute">
              {fmtTime(duration)}
            </span>
          </div>
        </div>
      </Container>
    </aside>
  );
}
