"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Headphones, Pause, Play, Smartphone, Share2 } from "lucide-react";
import { toast } from "sonner";
import { PageHero } from "@/components/site/PageHero";
import { CtaBanner } from "@/components/site/PageBlocks";
import { Container, GoldButton, Section, SectionHeading } from "@/components/site/kit";
import { Beam, Reveal, Shimmer, Stagger, StaggerItem } from "@/components/motion";
import { useI18n } from "@/lib/i18n";
import {
  usePodcastPlayer,
  type PodcastEpisode,
} from "@/components/podcast/PodcastPlayerProvider";

interface PodcastRow {
  id: string;
  slug: string;
  title: string;
  description: string;
  audioUrl: string;
  durationSec: number | null;
  coverImageUrl: string | null;
  publishedAt: string | null;
}

function fmtDate(iso: string | null, lang: string): string {
  if (!iso) return "";
  try {
    return new Intl.DateTimeFormat(lang === "zh" ? "zh-CN" : lang, {
      dateStyle: "long",
    }).format(new Date(iso));
  } catch {
    return "";
  }
}

/** Carte d'un épisode — pochette 16/9 optionnelle, « Écouter » joue
 * l'épisode dans le lecteur global (aucune navigation). */
function EpisodeCard({ ep, index }: { ep: PodcastRow; index: number }) {
  const { lang, t } = useI18n();
  const { episode, isPlaying, play } = usePodcastPlayer();
  const isCurrentPlaying = episode?.id === ep.id && isPlaying;

  const onShare = async () => {
    const url = `${window.location.origin}/podcast`;
    try {
      if (typeof navigator !== "undefined" && navigator.share) {
        await navigator.share({ title: ep.title, url });
      } else {
        await navigator.clipboard.writeText(url);
        toast.success(t("journal.shareCopied"));
      }
    } catch {
      /* partage annulé par l'utilisateur */
    }
  };

  return (
    <StaggerItem y={32} className="h-full">
      <Beam className="h-full rounded-xl">
        <article className="card-lift group flex h-full flex-col overflow-hidden rounded-xl border border-line bg-surface">
          {/* Pochette 16/9 (repli : dégradé or/noir + numéro serif) */}
          <div className="relative aspect-video w-full overflow-hidden border-b border-line">
            {ep.coverImageUrl ? (
              <Image
                src={ep.coverImageUrl}
                alt={ep.title}
                fill
                sizes="(max-width: 768px) 100vw, 600px"
                className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                unoptimized
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-gold/20 via-surface to-black">
                <span
                  aria-hidden
                  className="font-serif text-5xl text-gold/40 transition-transform duration-700 group-hover:scale-110"
                >
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>
            )}
            {isCurrentPlaying && (
              <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-black/70 px-3 py-1 text-[0.625rem] font-semibold uppercase tracking-[0.14em] text-goldlight backdrop-blur-sm">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-gold" aria-hidden />
                {t("podcast.playing")}
              </span>
            )}
          </div>

          <div className="flex flex-1 flex-col p-6">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
              <span className="text-[0.6875rem] font-medium uppercase tracking-[0.16em] text-mute">
                {fmtDate(ep.publishedAt, lang)}
              </span>
              {ep.durationSec ? (
                <>
                  <span aria-hidden className="text-[0.6875rem] text-mute">
                    ·
                  </span>
                  <span className="text-[0.6875rem] font-semibold uppercase tracking-[0.12em] text-goldtext">
                    {Math.max(1, Math.round(ep.durationSec / 60))} {t("podcast.duration")}
                  </span>
                </>
              ) : null}
            </div>

            <h3 className="mt-3 font-serif text-xl leading-snug text-ink transition-colors duration-300 group-hover:text-goldlight">
              {ep.title}
            </h3>

            {ep.description ? (
              <p className="mt-2.5 line-clamp-2 text-sm leading-relaxed text-mute">
                {ep.description}
              </p>
            ) : null}

            <div className="mt-auto flex items-center gap-3 pt-5">
              <GoldButton
                variant={isCurrentPlaying ? "outline" : "primary"}
                onClick={() => play(ep)}
                className="px-5! text-xs!"
                ariaLabel={`${t("podcast.play")} — ${ep.title}`}
              >
                {isCurrentPlaying ? (
                  <>
                    <Pause size={15} strokeWidth={1.75} aria-hidden />
                    {t("podcast.playing")}
                  </>
                ) : (
                  <>
                    <Play size={15} strokeWidth={1.75} aria-hidden />
                    {t("podcast.play")}
                  </>
                )}
              </GoldButton>
              <button
                type="button"
                onClick={onShare}
                aria-label={t("podcast.shareEpisode")}
                title={t("podcast.shareEpisode")}
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-line text-mute transition-colors duration-300 hover:border-gold/50 hover:text-goldtext"
              >
                <Share2 className="h-4 w-4" strokeWidth={1.5} aria-hidden />
              </button>
            </div>
          </div>
        </article>
      </Beam>
    </StaggerItem>
  );
}

/**
 * Page /podcast — épisodes audio de l'agence. La lecture passe par le
 * lecteur global (PodcastPlayerProvider, monté dans le layout) : la
 * lecture continue quand on navigue ailleurs sur le site.
 */
export function PodcastPage() {
  const { lang, t, tr } = useI18n();
  const [episodes, setEpisodes] = useState<PodcastRow[] | null>(null);
  const chips = tr<string[]>("podcast.chips") ?? [];

  useEffect(() => {
    let cancelled = false;
    fetch("/api/podcasts")
      .then((r) => (r.ok ? r.json() : null))
      .then((j: { ok: boolean; data?: PodcastRow[] } | null) => {
        if (cancelled) return;
        setEpisodes(j?.ok && Array.isArray(j.data) ? j.data : []);
      })
      .catch(() => {
        if (!cancelled) setEpisodes([]);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <>
      <PageHero
        label={t("podcast.label")}
        title={t("podcast.title")}
        gold={t("podcast.gold")}
        sub={t("podcast.sub")}
        chips={chips}
        image="/images/headers/header-blog.png"
      />

      {/* Épisodes */}
      <Section id="podcast-episodes">
        <Container>
          <SectionHeading
            label={t("podcast.label")}
            title={t("podcast.title")}
            gold={t("podcast.gold")}
            sub={
              episodes !== null && episodes.length > 0
                ? `${episodes.length} ${t("podcast.episodes")}`
                : undefined
            }
          />

          {episodes === null ? (
            /* Chargement : squelettes élégants (jamais de section vide) */
            <div role="status" aria-live="polite">
              <p className="label-caps mb-8">
                <Shimmer>{t("podcast.label")}</Shimmer>
              </p>
              <div className="grid gap-6 md:grid-cols-2" aria-hidden>
                {[0, 1].map((i) => (
                  <div key={i} className="overflow-hidden rounded-xl border border-line bg-surface">
                    <div className="aspect-video w-full animate-pulse bg-surface2" />
                    <div className="space-y-3 p-6">
                      <div className="h-3 w-24 animate-pulse rounded bg-surface2" />
                      <div className="h-5 w-4/5 animate-pulse rounded bg-surface2" />
                      <div className="h-3 w-full animate-pulse rounded bg-surface2" />
                      <div className="mt-6 h-11 w-36 animate-pulse rounded bg-surface2" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : episodes.length === 0 ? (
            /* État vide élégant — aucun épisode publié */
            <Reveal className="mx-auto max-w-xl">
              <div className="rounded-xl border border-line bg-surface p-8 text-center md:p-10">
                <span
                  aria-hidden
                  className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-gold/40 bg-black/40"
                >
                  <Headphones className="h-6 w-6 text-goldtext" strokeWidth={1.25} />
                </span>
                <p className="mt-5 font-serif text-2xl text-ink">{t("podcast.emptyTitle")}</p>
                <p className="mt-3 text-sm leading-relaxed text-mute">{t("podcast.emptyText")}</p>
              </div>
            </Reveal>
          ) : (
            <Stagger className="grid gap-6 md:grid-cols-2" step={0.09} delay={0.05}>
              {episodes.map((ep, i) => (
                <EpisodeCard key={ep.id} ep={ep} index={i} />
              ))}
            </Stagger>
          )}
        </Container>
      </Section>

      {/* Écouter où que vous soyez — le site s'installe en application */}
      <Section id="podcast-anywhere" tone="surface">
        <Container>
          <SectionHeading
            label={t("journal.listenPodcast")}
            title={t("pwa.t")}
            sub={`${t("pwa.d")} ${t("podcast.sub")}`}
          />
          <Reveal y={18} duration={0.7}>
            <div className="flex flex-wrap items-center justify-center gap-4">
              {[Headphones, Smartphone, Play].map((Icon, i) => (
                <span
                  key={i}
                  aria-hidden
                  className="inline-flex h-14 w-14 items-center justify-center rounded-full border border-gold/40 bg-black/30"
                >
                  <Icon className="h-6 w-6 text-goldtext" strokeWidth={1.25} />
                </span>
              ))}
            </div>
          </Reveal>
        </Container>
      </Section>

      <CtaBanner
        title={t("podcast.ctaTitle")}
        gold={t("podcast.ctaGold")}
        sub={t("podcast.ctaText")}
        primaryLabel={t("podcast.ctaPrimary")}
        primaryHref="/contact"
        secondaryLabel={t("podcast.ctaSecondary")}
        secondaryHref="/blog"
      />
    </>
  );
}
