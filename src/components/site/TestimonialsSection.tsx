"use client";

import React, { useEffect, useState } from "react";
import { Star } from "lucide-react";
import { Section, Container, SectionHeading, GoldBadge } from "@/components/site/kit";
import { Reveal } from "@/components/motion";
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
    <Section id="testimonials" tone="deep" className="text-[#f5f2ea]">
      <Container>
        <SectionHeading
          label={t("testimonials.label")}
          title={t("testimonials.title")}
          gold={t("testimonials.tGold")}
          sub={t("testimonials.sub")}
        />

        <div className="grid gap-6 md:grid-cols-2">
          {items.map((r, i) => {
            const quote = pickLocale(r.quote, lang);
            if (!quote) return null;
            const role = [r.authorRole, r.company].filter(Boolean).join(" — ");
            return (
              <Reveal key={r.id} delay={i * 80}>
                <figure className="card-lift flex h-full flex-col rounded-xl border border-gold/15 bg-[#111111] p-6 md:p-8">
                  <span aria-hidden className="font-serif text-5xl leading-none text-gold/50">
                    &ldquo;
                  </span>
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
                        <Star
                          key={n}
                          strokeWidth={1.25}
                          aria-hidden
                          className={`h-4 w-4 ${
                            n <= r.rating! ? "fill-gold text-gold" : "text-mute/40"
                          }`}
                        />
                      ))}
                    </div>
                  )}
                  <figcaption className="mt-6 border-t border-gold/15 pt-4">
                    <p className="font-medium">{r.authorName}</p>
                    {role && <p className="mt-0.5 text-sm text-mute">{role}</p>}
                  </figcaption>
                  {r.sector && (
                    <div className="mt-4">
                      <GoldBadge>{r.sector}</GoldBadge>
                    </div>
                  )}
                </figure>
              </Reveal>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}
