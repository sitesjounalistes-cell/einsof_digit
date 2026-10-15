"use client";

import React, { useEffect, useState } from "react";
import { Star } from "lucide-react";
import { Section, Container, SectionHeading, GoldBadge } from "@/components/site/kit";
import { PopIn, SpotlightCard, Stagger, StaggerItem, Tilt } from "@/components/motion";
import { useI18n } from "@/lib/i18n";
import { pickLocale, type LocaleMap } from "@/lib/locale-json";

interface TestimonialRow {
  id: string;
  authorName: string;
  authorRole: string | null;
  company: string | null;
  sector: string | null;
  quote: LocaleMap;
  rating: number | null;
}

/**
 * Témoignages (spécification §23) — alimentée par l'Espace équipe.
 * Règle §20.4 : section masquée tant qu'aucun témoignage n'est publié.
 * Le rating, s'il existe, est une donnée réelle saisie par l'équipe.
 * Chorégraphie (task 12-d) : Stagger > Tilt léger > SpotlightCard, guillemet serif
 * géant en PopIn, étoiles qui apparaissent en cascade (donnée réelle uniquement),
 * monogramme-auteur (initiale réelle) qui grossit au survol.
 */
export function TestimonialsSection() {
  const { lang, t } = useI18n();
  const [items, setItems] = useState<TestimonialRow[] | null>(null);

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

  return (
    <Section id="testimonials" tone="deep">
      <Container>
        <SectionHeading
          label={t("testimonials.label")}
          title={t("testimonials.title")}
          gold={t("testimonials.tGold")}
          sub={t("testimonials.sub")}
        />

        <Stagger className="grid gap-6 md:grid-cols-2" step={0.1} delay={0.05}>
          {items.map((r) => {
            const quote = pickLocale(r.quote, lang);
            if (!quote) return null;
            const role = [r.authorRole, r.company].filter(Boolean).join(" — ");
            return (
              <StaggerItem key={r.id} y={34} className="h-full">
                <Tilt max={4} className="h-full">
                  <SpotlightCard size={420} className="h-full rounded-xl">
                    <figure className="card-lift group flex h-full flex-col rounded-xl border border-gold/15 bg-surface p-6 md:p-8">
                      <PopIn delay={0.1}>
                        <span
                          aria-hidden
                          className="block font-serif text-6xl leading-none text-gold/10 md:text-7xl"
                        >
                          &ldquo;
                        </span>
                      </PopIn>
                      <blockquote className="mt-4 flex-1 text-lg leading-relaxed md:text-xl">
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
                      <figcaption className="mt-6 border-t border-gold/15 pt-4">
                        <div className="flex items-center gap-3">
                          <span
                            aria-hidden
                            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-gold/40 bg-surface/60 font-serif text-lg text-goldtext transition-transform duration-300 group-hover:scale-110"
                          >
                            {r.authorName.charAt(0).toUpperCase()}
                          </span>
                          <div className="min-w-0">
                            <p className="font-medium">{r.authorName}</p>
                            {role && <p className="mt-0.5 text-sm text-mute">{role}</p>}
                          </div>
                        </div>
                      </figcaption>
                      {r.sector && (
                        <div className="mt-4">
                          <GoldBadge>{r.sector}</GoldBadge>
                        </div>
                      )}
                    </figure>
                  </SpotlightCard>
                </Tilt>
              </StaggerItem>
            );
          })}
        </Stagger>
      </Container>
    </Section>
  );
}
