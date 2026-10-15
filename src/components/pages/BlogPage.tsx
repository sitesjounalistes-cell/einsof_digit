"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Boxes, Globe, Target } from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { CtaBanner, PageCrossLinks } from "@/components/site/PageBlocks";
import {
  Container,
  GoldBadge,
  GoldButton,
  Section,
  SectionHeading,
} from "@/components/site/kit";
import { Beam, Reveal, Shimmer, SpotlightCard, Stagger, StaggerItem } from "@/components/motion";
import { useI18n } from "@/lib/i18n";
import { pickLocale, type LocaleMap } from "@/lib/locale-json";
import { useLocalized } from "@/lib/page-content";
import { BLOG } from "@/lib/pages-content/blog";

interface PostRow {
  id: string;
  slug: string;
  title: LocaleMap;
  excerpt: LocaleMap;
  body: LocaleMap;
  category: string;
  readingMin: number;
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

/* Icônes des trois cartes thématiques (ordre fixe : SaaS, Sites web, Stratégie) */
const TOPIC_ICONS = [Boxes, Globe, Target] as const;

/**
 * Page /blog — Journal complet de l'agence.
 * Différence clé avec JournalSection (accueil) : le clic sur un article
 * déclenche une vraie navigation (next/link vers /blog/[slug]),
 * pas une boîte de dialogue. Les articles viennent de la vraie base
 * (/api/posts) — aucun article n'est fabriqué côté client.
 */
export function BlogPage() {
  const { lang, t, tr } = useI18n();
  const c = useLocalized(BLOG);
  const [posts, setPosts] = useState<PostRow[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/posts")
      .then((r) => (r.ok ? r.json() : null))
      .then((j: { ok: boolean; data?: PostRow[] } | null) => {
        if (cancelled) return;
        setPosts(j?.ok && Array.isArray(j.data) ? j.data : []);
      })
      .catch(() => {
        if (!cancelled) setPosts([]);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const catLabel = (cat: string): string => tr<string>(`journal.categories.${cat}`) ?? cat;

  return (
    <>
      <PageHero
        label={c.hero.label}
        title={c.hero.title}
        gold={c.hero.gold}
        sub={c.hero.sub}
        chips={c.hero.chips}
      />

      {/* Grille complète des articles */}
      <Section id="blog-listing">
        <Container>
          <SectionHeading
            label={c.listing.label}
            title={c.listing.title}
            gold={c.listing.gold}
            sub={c.listing.sub}
          />

          {posts === null ? (
            /* Chargement : squelettes élégants (contenu factice, toujours visible) */
            <div role="status" aria-live="polite">
              <p className="label-caps mb-8">
                <Shimmer>{c.listing.loading}</Shimmer>
              </p>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3" aria-hidden>
                {[0, 1, 2].map((i) => (
                  <div key={i} className="rounded-xl border border-line bg-surface p-6">
                    <div className="flex items-center gap-3">
                      <div className="h-5 w-20 animate-pulse rounded-full bg-surface2" />
                      <div className="h-3 w-16 animate-pulse rounded bg-surface2" />
                    </div>
                    <div className="mt-5 h-5 w-4/5 animate-pulse rounded bg-surface2" />
                    <div className="mt-4 space-y-2.5">
                      <div className="h-3 w-full animate-pulse rounded bg-surface2" />
                      <div className="h-3 w-11/12 animate-pulse rounded bg-surface2" />
                      <div className="h-3 w-3/5 animate-pulse rounded bg-surface2" />
                    </div>
                    <div className="mt-6 h-3 w-24 animate-pulse rounded bg-surface2" />
                  </div>
                ))}
              </div>
            </div>
          ) : posts.length === 0 ? (
            /* État vide élégant — aucun article encore publié */
            <Reveal className="mx-auto max-w-xl">
              <div className="rounded-xl border border-line bg-surface p-8 text-center md:p-10">
                <p className="font-serif text-2xl text-ink">{c.listing.emptyTitle}</p>
                <p className="mt-3 text-sm leading-relaxed text-mute">{c.listing.emptyText}</p>
                <div className="mt-7 flex justify-center">
                  <GoldButton href="/contact">
                    {c.listing.emptyCta}
                    <ArrowRight size={16} strokeWidth={1.5} aria-hidden />
                  </GoldButton>
                </div>
              </div>
            </Reveal>
          ) : (
            <Stagger className="grid gap-6 md:grid-cols-2 lg:grid-cols-3" step={0.08} delay={0.05}>
              {posts.map((p) => {
                const title = pickLocale(p.title, lang);
                return (
                  <StaggerItem key={p.id} y={36} className="h-full">
                    <Beam className="h-full rounded-xl">
                      <Link
                        href={`/blog/${p.slug}`}
                        aria-label={`${title} — ${t("journal.readMore")}`}
                        className="card-lift group flex h-full flex-col rounded-xl border border-line bg-surface p-6 focus-visible:outline focus-visible:outline-1 focus-visible:outline-gold"
                      >
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                          <GoldBadge>{catLabel(p.category)}</GoldBadge>
                          <span className="text-[0.6875rem] font-medium uppercase tracking-[0.16em] text-mute transition-transform duration-300 group-hover:translate-x-1">
                            {fmtDate(p.publishedAt, lang)}
                          </span>
                        </div>
                        <h3 className="mt-4 font-serif text-xl leading-snug transition-colors duration-300 group-hover:text-goldlight">
                          {title}
                        </h3>
                        <p className="mt-3 line-clamp-3 flex-1 text-sm text-mute">
                          {pickLocale(p.excerpt, lang)}
                        </p>
                        <div className="mt-5 flex items-center justify-between gap-3">
                          <span className="inline-flex items-center gap-1.5 text-[0.8125rem] font-semibold uppercase tracking-[0.12em] text-goldtext">
                            {t("journal.readMore")}
                            <ArrowUpRight
                              className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                              strokeWidth={1.25}
                              aria-hidden
                            />
                          </span>
                          <span className="text-[0.6875rem] text-mute">
                            {p.readingMin} {t("journal.readingMin")}
                          </span>
                        </div>
                      </Link>
                    </Beam>
                  </StaggerItem>
                );
              })}
            </Stagger>
          )}
        </Container>
      </Section>

      {/* Thèmes du journal */}
      <Section id="blog-topics" tone="surface">
        <Container>
          <SectionHeading
            label={c.topics.label}
            title={c.topics.title}
            gold={c.topics.gold}
            sub={c.topics.sub}
          />
          <Stagger className="grid gap-6 md:grid-cols-3" step={0.09}>
            {c.topics.cards.map((topic, i) => {
              const Icon = TOPIC_ICONS[i] ?? Target;
              return (
                <StaggerItem key={topic.title} y={30} className="h-full">
                  <SpotlightCard className="h-full rounded-xl">
                    <article className="card-lift flex h-full flex-col rounded-xl border border-line bg-bg p-6">
                      <div className="flex items-center justify-between gap-3">
                        <span aria-hidden className="font-serif text-2xl text-gold/50">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <Icon size={20} strokeWidth={1.25} aria-hidden className="text-gold/70" />
                      </div>
                      <h3 className="mt-4 font-serif text-xl text-ink">{topic.title}</h3>
                      <p className="mt-3 flex-1 text-sm leading-relaxed text-mute">{topic.text}</p>
                    </article>
                  </SpotlightCard>
                </StaggerItem>
              );
            })}
          </Stagger>
        </Container>
      </Section>

      <CtaBanner
        title={c.cta.title}
        gold={c.cta.gold}
        primaryLabel={c.cta.primaryLabel}
        primaryHref="/contact"
        secondaryLabel={c.cta.secondaryLabel}
        secondaryHref="/services"
      />

      <PageCrossLinks title={c.crossLinks.title} items={c.crossLinks.items} />
    </>
  );
}
