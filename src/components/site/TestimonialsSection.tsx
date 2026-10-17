"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, PlayCircle, Star } from "lucide-react";
import { Section, Container, SectionHeading, GoldBadge } from "@/components/site/kit";
import { PopIn, Reveal, SpotlightCard, Tilt } from "@/components/motion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { useI18n } from "@/lib/i18n";
import { pickLocale, type LocaleMap } from "@/lib/locale-json";
import { parseYouTubeId, youTubeEmbedUrl } from "@/lib/youtube";

interface TestimonialRow {
  id: string;
  authorName: string;
  authorRole: string | null;
  company: string | null;
  sector: string | null;
  quote: LocaleMap;
  rating: number | null;
  authorPhotoUrl: string | null;
  videoUrl: string | null;
}

/** Vidéo en cours de lecture dans le dialogue (iframe démontée à la fermeture → pause). */
interface VideoTarget {
  id: string;
  author: string;
}

/**
 * Témoignages (spécification §23) — alimentée par l'Espace équipe.
 * Règle §20.4 : section masquée tant qu'aucun témoignage n'est publié.
 *
 * Carrousel sobre (aucune lecture automatique — le gérant veut du sérieux) :
 * une carte à la fois, flèches précédent/suivant + pastilles. Photo ronde de
 * l'auteur (monogramme à défaut), badge secteur, étoiles si note réelle,
 * bouton « Voir le témoignage vidéo » ouvrant un dialogue avec l'iframe
 * YouTube (autoplay, démontée à la fermeture donc lecture stoppée).
 * Un seul témoignage → carrousel désactivé, carte centrée.
 * Chorégraphie conservée (task 12-d) : guillemet serif en PopIn, étoiles en
 * cascade, SpotlightCard + Tilt léger, monogramme qui grossit au survol.
 */
export function TestimonialsSection() {
  const { lang, t } = useI18n();
  const [items, setItems] = useState<TestimonialRow[] | null>(null);
  const [index, setIndex] = useState(0);
  const [video, setVideo] = useState<VideoTarget | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/testimonials")
      .then((r) => (r.ok ? r.json() : null))
      .then((j: { ok: boolean; data?: TestimonialRow[] } | null) => {
        if (cancelled) return;
        setItems(j?.ok && Array.isArray(j.data) ? j.data : []);
      })
      .catch(() => {
        if (!cancelled) setItems([]);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (!items || items.length === 0) return null;

  const m = items.length;
  const solo = m === 1;
  const goTo = (i: number) => setIndex(Math.min(m - 1, Math.max(0, i)));

  return (
    <Section id="testimonials" tone="deep">
      <Container>
        <SectionHeading
          label={t("testimonials.label")}
          title={t("testimonials.title")}
          gold={t("testimonials.tGold")}
          sub={t("testimonials.sub")}
        />

        <Reveal delay={0.05} y={26}>
          <div
            role="region"
            aria-roledescription="carousel"
            aria-label={t("testimonials.label")}
            className={solo ? "" : "mx-auto max-w-3xl"}
          >
            {/* Piste : une carte par page, translation animée (aucun autoplay) */}
            <div className="overflow-hidden">
              <div
                className="flex transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none"
                style={{ transform: `translateX(-${index * 100}%)` }}
              >
                {items.map((r, i) => {
                  const quote = pickLocale(r.quote, lang);
                  if (!quote) return null;
                  const role = [r.authorRole, r.company].filter(Boolean).join(" — ");
                  const ytId = r.videoUrl ? parseYouTubeId(r.videoUrl) : null;
                  const active = i === index;
                  return (
                    <div
                      key={r.id}
                      role="group"
                      aria-roledescription="slide"
                      aria-label={`${i + 1} / ${m}`}
                      aria-hidden={!active}
                      inert={!active}
                      className="w-full shrink-0 px-1.5 py-2"
                    >
                      <Tilt max={3} className="mx-auto h-full max-w-2xl">
                        <SpotlightCard size={420} className="h-full rounded-xl">
                          <figure className="card-lift group flex h-full flex-col rounded-xl border border-gold/15 bg-surface p-6 md:p-8">
                            {/* Auteur : photo ronde (monogramme à défaut), nom, rôle, badge */}
                            <figcaption className="flex items-center gap-4">
                              {r.authorPhotoUrl ? (
                                <span className="relative inline-flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full border border-gold/40 shadow-[0_0_0_1px_rgba(212,175,55,0.15)] transition-transform duration-300 group-hover:scale-105">
                                  <Image
                                    src={r.authorPhotoUrl}
                                    alt={`Photo de ${r.authorName}`}
                                    width={112}
                                    height={112}
                                    className="h-full w-full object-cover"
                                    unoptimized
                                  />
                                </span>
                              ) : (
                                <span
                                  aria-hidden
                                  className="inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-gold/40 bg-surface/60 font-serif text-xl text-goldtext transition-transform duration-300 group-hover:scale-110"
                                >
                                  {r.authorName.charAt(0).toUpperCase()}
                                </span>
                              )}
                              <div className="min-w-0 flex-1">
                                <p className="truncate font-medium">{r.authorName}</p>
                                {role && <p className="mt-0.5 truncate text-sm text-mute">{role}</p>}
                                {r.sector && (
                                  <div className="mt-2">
                                    <GoldBadge>{r.sector}</GoldBadge>
                                  </div>
                                )}
                              </div>
                            </figcaption>

                            <PopIn delay={0.1}>
                              <span
                                aria-hidden
                                className="mt-5 block font-serif text-6xl leading-none text-gold/10 md:text-7xl"
                              >
                                &ldquo;
                              </span>
                            </PopIn>
                            <blockquote className="mt-2 flex-1 text-lg leading-relaxed md:text-xl">
                              {quote}
                            </blockquote>

                            {typeof r.rating === "number" && r.rating >= 1 && r.rating <= 5 && (
                              <div
                                className="mt-5 flex items-center gap-1"
                                role="img"
                                aria-label={`${r.rating}/5`}
                              >
                                {[1, 2, 3, 4, 5].map((n) => (
                                  <PopIn
                                    key={n}
                                    as="span"
                                    delay={0.15 + (n - 1) * 0.07}
                                    className="inline-flex"
                                  >
                                    <Star
                                      strokeWidth={1.25}
                                      aria-hidden
                                      className={`block h-4 w-4 ${
                                        n <= r.rating! ? "fill-gold text-gold" : "text-mute/40"
                                      }`}
                                    />
                                  </PopIn>
                                ))}
                              </div>
                            )}

                            {ytId && (
                              <div className="mt-6 border-t border-gold/15 pt-5">
                                <button
                                  type="button"
                                  onClick={() => setVideo({ id: ytId, author: r.authorName })}
                                  className="inline-flex min-h-[44px] cursor-pointer items-center gap-2 rounded-full border border-gold/40 bg-bg px-5 text-[0.75rem] font-semibold uppercase tracking-[0.12em] text-goldtext transition-all duration-300 hover:border-gold hover:bg-gold/10 hover:shadow-[0_8px_24px_-10px_rgba(212,175,55,0.6)] focus-visible:outline focus-visible:outline-1 focus-visible:outline-gold"
                                >
                                  <PlayCircle size={17} strokeWidth={1.5} aria-hidden />
                                  {t("testimonials.video")}
                                </button>
                              </div>
                            )}
                          </figure>
                        </SpotlightCard>
                      </Tilt>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Commandes — absentes pour un témoignage unique (carrousel désactivé) */}
            {!solo && (
              <div className="mt-8 flex items-center justify-center gap-5">
                <NavButton
                  dir="prev"
                  label={t("testimonials.prev")}
                  onClick={() => goTo(index - 1)}
                  disabled={index === 0}
                />
                <div className="flex items-center gap-2.5">
                  {items.map((r, i) => (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => goTo(i)}
                      aria-label={`${i + 1} / ${m}`}
                      aria-current={i === index || undefined}
                      className="group flex h-8 min-w-8 cursor-pointer items-center justify-center"
                    >
                      <span
                        aria-hidden
                        className={`block h-1.5 rounded-full transition-all duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                          i === index
                            ? "w-7 bg-gold shadow-[0_0_12px_rgba(212,175,55,0.5)]"
                            : "w-1.5 bg-line group-hover:w-3 group-hover:bg-gold/60"
                        }`}
                      />
                    </button>
                  ))}
                </div>
                <NavButton
                  dir="next"
                  label={t("testimonials.next")}
                  onClick={() => goTo(index + 1)}
                  disabled={index === m - 1}
                />
              </div>
            )}
          </div>
        </Reveal>
      </Container>

      {/* Vidéo — le contenu est démonté à la fermeture : l'iframe est retirée
          du DOM, donc la lecture s'arrête immédiatement. */}
      <Dialog
        open={video !== null}
        onOpenChange={(open) => {
          if (!open) setVideo(null);
        }}
      >
        <DialogContent className="max-w-3xl border-gold/25 bg-bg p-3 sm:p-4">
          {video && (
            <>
              <DialogTitle className="sr-only">
                {`${t("testimonials.video")} — ${video.author}`}
              </DialogTitle>
              <DialogDescription className="sr-only">
                {`${video.author} — YouTube`}
              </DialogDescription>
              <div className="aspect-video overflow-hidden rounded-lg border border-gold/25 bg-black shadow-[0_30px_80px_-30px_rgba(0,0,0,0.8)]">
                <iframe
                  src={`${youTubeEmbedUrl(video.id)}&autoplay=1`}
                  title={`${t("testimonials.video")} — ${video.author}`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  referrerPolicy="strict-origin-when-cross-origin"
                  className="h-full w-full"
                />
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </Section>
  );
}

/* ── Flèche précédent / suivant — 44 px tactile ─────────────── */

function NavButton({
  dir,
  label,
  onClick,
  disabled,
}: {
  dir: "prev" | "next";
  label: string;
  onClick: () => void;
  disabled?: boolean;
}) {
  const Icon = dir === "prev" ? ChevronLeft : ChevronRight;
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-line bg-surface text-mute transition-colors duration-300 hover:border-gold/60 hover:text-goldtext focus-visible:outline focus-visible:outline-1 focus-visible:outline-gold disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:border-line disabled:hover:text-mute"
    >
      <Icon size={18} strokeWidth={1.5} aria-hidden />
    </button>
  );
}
