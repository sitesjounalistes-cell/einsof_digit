"use client";

import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Boxes, Globe, Share2, Target } from "lucide-react";
import { toast } from "sonner";
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
import { track } from "@/lib/analytics";
import { BRAND_INITIAL } from "@/lib/brand";
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
  /* Éditorial enrichi (dashboard) */
  coverImageUrl: string | null;
  isFeatured: boolean;
  videoUrl: string | null;
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

/* ── Couverture d'article (repli élégant : dégradé or/noir + monogramme) ── */

function CoverArt({
  src,
  alt,
  ratio,
  sizes,
}: {
  src: string | null;
  alt: string;
  ratio: "video" | "wide";
  sizes: string;
}) {
  const cls = ratio === "video" ? "aspect-video" : "aspect-[16/10]";
  if (!src) {
    return (
      <div
        aria-hidden
        className={`${cls} relative w-full overflow-hidden bg-gradient-to-br from-gold/25 via-surface to-black`}
      >
        <span className="absolute inset-0 flex items-center justify-center font-serif text-6xl text-gold/30">
          {BRAND_INITIAL}
        </span>
      </div>
    );
  }
  return (
    <div className={`${cls} relative w-full overflow-hidden border-b border-line`}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
        unoptimized
      />
    </div>
  );
}

/* ── Partage d'article : Web Share sinon presse-papiers + toast ────── */

async function sharePost(slug: string, title: string): Promise<"webshare" | "clipboard" | null> {
  const url = `${window.location.origin}/blog/${slug}`;
  try {
    if (typeof navigator !== "undefined" && navigator.share) {
      await navigator.share({ title, url });
      track("article_shared", { slug, channel: "webshare" });
      return "webshare";
    }
    await navigator.clipboard.writeText(url);
    track("article_shared", { slug, channel: "clipboard" });
    return "clipboard";
  } catch {
    /* partage annulé par l'utilisateur */
    return null;
  }
}

function ShareButton({ slug, title }: { slug: string; title: string }) {
  const { t } = useI18n();
  return (
    <button
      type="button"
      onClick={(e) => {
        /* bouton dédié : jamais de navigation vers l'article */
        e.preventDefault();
        e.stopPropagation();
        void sharePost(slug, title).then((channel) => {
          if (channel === "clipboard") toast.success(t("journal.shareCopied"));
        });
      }}
      aria-label={`${t("journal.share")} — ${title}`}
      title={t("journal.share")}
      className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-line bg-bg/80 text-mute backdrop-blur-sm transition-all duration-300 hover:border-gold/50 hover:text-goldtext focus-visible:outline focus-visible:outline-1 focus-visible:outline-gold"
    >
      <Share2 className="h-4 w-4" strokeWidth={1.5} aria-hidden />
    </button>
  );
}

/* Icônes des trois cartes thématiques (ordre fixe : SaaS, Sites web, Stratégie) */
const TOPIC_ICONS = [Boxes, Globe, Target] as const;

/**
 * Page /blog — Blog complet de l'agence.
 * Bande de catégories déroulante (sticky), articles « à la une »,
 * grille filtrée avec couvertures et partage. Le clic sur un article
 * déclenche une vraie navigation (next/link vers /blog/[slug]).
 * Les articles viennent de la vraie base (/api/posts).
 */
export function BlogPage() {
  const { lang, t, tr } = useI18n();
  const c = useLocalized(BLOG);
  const [posts, setPosts] = useState<PostRow[] | null>(null);
  const [activeCat, setActiveCat] = useState<string>("all");

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

  /* Rubriques dérivées des articles réels + compteur (ordre de publication) */
  const categories = useMemo(() => {
    if (!posts) return [] as { cat: string; count: number }[];
    const map = new Map<string, number>();
    for (const p of posts) map.set(p.category, (map.get(p.category) ?? 0) + 1);
    return [...map.entries()].map(([cat, count]) => ({ cat, count }));
  }, [posts]);

  /* À la une : max 2 articles mis en avant (section visible sur « tous ») */
  const featured = useMemo(
    () => (posts ?? []).filter((p) => p.isFeatured).slice(0, 2),
    [posts]
  );

  /* Grille filtrée côté client — « tous » : les à la une sont déjà
     montrés en tête, on évite le doublon dans la grille. */
  const filtered = useMemo(() => {
    if (!posts) return [];
    if (activeCat === "all") return posts.filter((p) => !p.isFeatured);
    return posts.filter((p) => p.category === activeCat);
  }, [posts, activeCat]);

  const chipCls = (active: boolean) =>
    `shrink-0 whitespace-nowrap rounded-full border px-4 py-2 text-[0.6875rem] font-semibold uppercase tracking-[0.14em] transition-all duration-300 focus-visible:outline focus-visible:outline-1 focus-visible:outline-gold ${
      active
        ? "gold-fill border-transparent text-ongold shadow-[0_0_20px_rgba(212,175,55,0.25)]"
        : "border-line bg-surface/60 text-mute hover:border-gold/40 hover:text-goldtext"
    }`;

  return (
    <>
      <PageHero
        label={c.hero.label}
        title={c.hero.title}
        gold={c.hero.gold}
        sub={c.hero.sub}
        chips={c.hero.chips}
        image="/images/headers/header-blog.png"
      />

      {/* ── Bande de catégories déroulante (sticky sous le héros) ── */}
      <div className="sticky top-16 z-30 border-b border-line bg-bg/90 backdrop-blur-md md:top-20">
        <Container>
          <div
            role="group"
            aria-label={t("journal.band.label")}
            className="flex items-center gap-2 overflow-x-auto py-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            <button
              type="button"
              onClick={() => setActiveCat("all")}
              aria-pressed={activeCat === "all"}
              className={chipCls(activeCat === "all")}
            >
              {t("journal.band.all")}
              {posts !== null && (
                <span className={activeCat === "all" ? "ml-2 opacity-70" : "ml-2 text-goldtext/70"}>
                  {posts.length}
                </span>
              )}
            </button>
            {categories.map(({ cat, count }) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCat(cat)}
                aria-pressed={activeCat === cat}
                className={chipCls(activeCat === cat)}
              >
                {catLabel(cat)}
                <span className={activeCat === cat ? "ml-2 opacity-70" : "ml-2 text-goldtext/70"}>
                  {count}
                </span>
              </button>
            ))}
          </div>
        </Container>
      </div>

      {/* ── À la une (articles mis en avant, max 2) ── */}
      {posts !== null && activeCat === "all" && featured.length > 0 && (
        <Section id="blog-featured" tone="surface">
          <Container>
            <Reveal y={12} duration={0.6}>
              <p className="label-caps mb-8">{c.listing.label}</p>
            </Reveal>
            <Stagger className="space-y-8" step={0.12}>
              {featured.map((p, i) => {
                const title = pickLocale(p.title, lang);
                return (
                  <StaggerItem key={p.id} y={36}>
                    <Beam className="rounded-xl">
                      <article className="card-lift group relative overflow-hidden rounded-xl border border-line bg-bg">
                        <div className="grid md:grid-cols-2">
                          {/* Couverture large 16/10 (repli : dégradé or/noir) */}
                          <div className={`relative ${i % 2 === 1 ? "md:order-2" : ""}`}>
                            <CoverArt
                              src={p.coverImageUrl}
                              alt={title}
                              ratio="wide"
                              sizes="(max-width: 768px) 100vw, 50vw"
                            />
                            <span className="gold-fill absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[0.625rem] font-semibold uppercase tracking-[0.14em] text-ongold shadow-[0_0_20px_rgba(212,175,55,0.35)]">
                              <ArrowUpRight className="h-3 w-3" strokeWidth={2} aria-hidden />
                              {t("journal.featuredBadge")}
                            </span>
                          </div>

                          <div className="flex flex-col p-6 md:p-8 lg:p-10">
                            <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                              <GoldBadge>{catLabel(p.category)}</GoldBadge>
                              <span className="text-[0.6875rem] font-medium uppercase tracking-[0.16em] text-mute">
                                {fmtDate(p.publishedAt, lang)}
                              </span>
                            </div>
                            <h3 className="mt-4 font-serif text-2xl leading-tight text-ink md:text-3xl">
                              {title}
                            </h3>
                            <p className="mt-4 line-clamp-3 text-sm leading-relaxed text-mute md:text-[0.9375rem]">
                              {pickLocale(p.excerpt, lang)}
                            </p>
                            <div className="mt-6 flex items-center justify-between gap-3 md:mt-auto md:pt-8">
                              <span className="text-[0.6875rem] text-mute">
                                {p.readingMin} {t("journal.readingMin")}
                              </span>
                              <span className="inline-flex items-center gap-1.5 text-[0.8125rem] font-semibold uppercase tracking-[0.12em] text-goldtext">
                                {t("journal.readMore")}
                                <ArrowUpRight
                                  className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                                  strokeWidth={1.25}
                                  aria-hidden
                                />
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Lien étiré sur toute la carte — SOUS le bouton partager */}
                        <Link
                          href={`/blog/${p.slug}`}
                          aria-label={`${title} — ${t("journal.readMore")}`}
                          className="absolute inset-0 z-20 focus-visible:outline focus-visible:outline-1 focus-visible:-outline-offset-1 focus-visible:outline-gold"
                        />
                        {/* Bouton partager — HORS du lien (aucune navigation) */}
                        <div className="absolute bottom-5 right-5 z-30 md:bottom-8 md:right-8">
                          <ShareButton slug={p.slug} title={title} />
                        </div>
                      </article>
                    </Beam>
                  </StaggerItem>
                );
              })}
            </Stagger>
          </Container>
        </Section>
      )}

      {/* ── Grille complète des articles (filtrée par rubrique) ── */}
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
                  <div key={i} className="overflow-hidden rounded-xl border border-line bg-surface">
                    <div className="aspect-video w-full animate-pulse bg-surface2" />
                    <div className="p-6">
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
          ) : filtered.length === 0 ? (
            /* Garde-fou : rubrique sans article (ne devrait jamais arriver) */
            <Reveal className="mx-auto max-w-xl">
              <div className="rounded-xl border border-line bg-surface p-8 text-center">
                <p className="text-sm text-mute">{c.listing.emptyTitle}</p>
              </div>
            </Reveal>
          ) : (
            <Stagger className="grid gap-6 md:grid-cols-2 lg:grid-cols-3" step={0.08} delay={0.05}>
              {filtered.map((p) => {
                const title = pickLocale(p.title, lang);
                return (
                  <StaggerItem key={p.id} y={36} className="h-full">
                    <Beam className="h-full rounded-xl">
                      <article className="card-lift group relative flex h-full flex-col overflow-hidden rounded-xl border border-line bg-surface">
                        <Link
                          href={`/blog/${p.slug}`}
                          aria-label={`${title} — ${t("journal.readMore")}`}
                          className="flex h-full flex-col focus-visible:outline focus-visible:outline-1 focus-visible:-outline-offset-1 focus-visible:outline-gold"
                        >
                          {/* Image de couverture 16/9 (repli : dégradé or/noir) */}
                          <CoverArt
                            src={p.coverImageUrl}
                            alt={title}
                            ratio="video"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          />
                          <div className="flex flex-1 flex-col p-6">
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
                          </div>
                        </Link>
                        {/* Bouton partager — HORS du lien (aucune navigation),
                            posé sur la couverture */}
                        <div className="absolute right-3 top-3 z-30">
                          <ShareButton slug={p.slug} title={title} />
                        </div>
                      </article>
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
