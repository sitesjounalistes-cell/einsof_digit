"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { CtaBanner } from "@/components/site/PageBlocks";
import { Container, GoldBadge, GoldButton, Section } from "@/components/site/kit";
import { Beam, DrawRule, Reveal, Shimmer, Stagger, StaggerItem, WordMask } from "@/components/motion";
import { useI18n } from "@/lib/i18n";
import { pickLocale, type LocaleMap } from "@/lib/locale-json";
import { useLocalized } from "@/lib/page-content";
import { ARTICLE } from "@/lib/pages-content/article";

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

/**
 * Page article /blog/[slug] — le slug est résolu côté serveur (base
 * réelle, 404 si introuvable) ; côté client, l'article est chargé
 * depuis /api/posts puis rendu en paragraphes. Le texte se révèle
 * progressivement (Reveal once) mais finit toujours 100 % visible.
 */
export function ArticlePage({ slug }: { slug: string }) {
  const { lang, tr } = useI18n();
  const c = useLocalized(ARTICLE);
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

  const post = useMemo(
    () => posts?.find((p) => p.slug === slug) ?? null,
    [posts, slug]
  );

  const catLabel = (cat: string): string => tr<string>(`journal.categories.${cat}`) ?? cat;

  /* ── État introuvable (client : API vide ou slug absent du lot) ── */
  if (posts !== null && !post) {
    return (
      <Section id="article-missing" className="pt-40">
        <Container className="text-center">
          <Reveal>
            <p className="font-serif text-3xl text-ink">{c.notFoundTitle}</p>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-mute">
              {c.notFoundText}
            </p>
          </Reveal>
          <Reveal delay={0.2}>
            <div className="mt-8 flex justify-center">
              <GoldButton href="/blog">
                <ArrowLeft size={16} strokeWidth={1.5} aria-hidden />
                {c.backToList}
              </GoldButton>
            </div>
          </Reveal>
        </Container>
      </Section>
    );
  }

  /* ── État chargement ─────────────────────────────────────────── */
  if (!post) {
    return (
      <>
        <header className="border-b border-line bg-[#0D0D0D] pt-28 pb-12 md:pt-36 md:pb-16">
          <Container>
            <div
              role="status"
              aria-live="polite"
              className="mx-auto max-w-3xl"
            >
              <p className="label-caps">
                <Shimmer>{c.loading}</Shimmer>
              </p>
              <div className="mt-6 space-y-3" aria-hidden>
                <div className="h-8 w-4/5 animate-pulse rounded bg-surface2" />
                <div className="h-8 w-3/5 animate-pulse rounded bg-surface2" />
              </div>
              <div className="mt-6 space-y-2.5" aria-hidden>
                <div className="h-3 w-full animate-pulse rounded bg-surface2" />
                <div className="h-3 w-11/12 animate-pulse rounded bg-surface2" />
                <div className="h-3 w-4/5 animate-pulse rounded bg-surface2" />
              </div>
            </div>
          </Container>
        </header>
      </>
    );
  }

  /* ── Article trouvé : jusqu'à 2 autres articles pour « lire aussi » ── */
  const others = posts!.filter((p) => p.slug !== slug).slice(0, 2);
  const paragraphs = pickLocale(post.body, lang)
    .split("\n\n")
    .map((par) => par.trim())
    .filter(Boolean);

  return (
    <>
      {/* Bandeau d'ouverture de l'article */}
      <header className="relative overflow-hidden border-b border-line bg-[#0D0D0D] pt-28 pb-12 md:pt-36 md:pb-16">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_0%,rgba(212,175,55,0.07),transparent_70%)]"
        />
        <Container className="relative">
          <div className="mx-auto max-w-3xl">
            <Reveal y={10} duration={0.5}>
              <Link
                href="/blog"
                className="group inline-flex min-h-[44px] items-center gap-2 text-sm font-semibold uppercase tracking-[0.12em] text-goldtext transition-colors duration-300 hover:text-goldlight"
              >
                <ArrowLeft
                  size={16}
                  strokeWidth={1.5}
                  aria-hidden
                  className="transition-transform duration-300 group-hover:-translate-x-1"
                />
                {c.back}
              </Link>
            </Reveal>

            <Reveal delay={0.08} y={12} duration={0.6}>
              <div className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-2">
                <GoldBadge>{catLabel(post.category)}</GoldBadge>
                <span className="text-[0.6875rem] font-medium uppercase tracking-[0.16em] text-mute">
                  {fmtDate(post.publishedAt, lang)}
                </span>
                <span className="text-[0.6875rem] text-mute">
                  · {post.readingMin} {c.readingMin}
                </span>
              </div>
            </Reveal>

            <h1 className="mt-5 font-serif text-3xl leading-tight text-ink md:text-5xl">
              <WordMask text={pickLocale(post.title, lang)} />
            </h1>

            <DrawRule className="mt-6 h-px w-24" delay={0.3} />

            <Reveal delay={0.3} y={18} duration={0.8}>
              <p className="lead-text mt-5">{pickLocale(post.excerpt, lang)}</p>
            </Reveal>
          </div>
        </Container>
      </header>

      {/* Corps de l'article */}
      <Section id="article-body">
        <Container>
          <div className="mx-auto max-w-3xl">
            {paragraphs.map((par, i) => (
              <Reveal key={i} y={18} duration={0.7} delay={Math.min(i * 0.05, 0.25)}>
                <p className="text-[0.9375rem] leading-relaxed text-ink md:text-base">{par}</p>
              </Reveal>
            ))}

            <DrawRule className="mx-auto mt-14 h-px w-40" delay={0.1} />
          </div>
        </Container>
      </Section>

      {/* Lire aussi */}
      {others.length > 0 && (
        <Section id="article-also" tone="surface" className="border-t border-line">
          <Container>
            <Reveal y={14} duration={0.6}>
              <h2 className="font-serif text-2xl text-ink md:text-3xl">{c.alsoTitle}</h2>
              <p className="mt-2 text-sm text-mute">{c.alsoSub}</p>
            </Reveal>
            <Stagger className="mt-8 grid gap-6 md:grid-cols-2" step={0.08}>
              {others.map((p) => (
                <StaggerItem key={p.id} y={30} className="h-full">
                  <Beam className="h-full rounded-xl">
                    <Link
                      href={`/blog/${p.slug}`}
                      aria-label={`${pickLocale(p.title, lang)}`}
                      className="card-lift group flex h-full flex-col rounded-xl border border-line bg-bg p-6 focus-visible:outline focus-visible:outline-1 focus-visible:outline-gold"
                    >
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                        <GoldBadge>{catLabel(p.category)}</GoldBadge>
                        <span className="text-[0.6875rem] font-medium uppercase tracking-[0.16em] text-mute transition-transform duration-300 group-hover:translate-x-1">
                          {fmtDate(p.publishedAt, lang)}
                        </span>
                      </div>
                      <h3 className="mt-4 font-serif text-xl leading-snug transition-colors duration-300 group-hover:text-goldlight">
                        {pickLocale(p.title, lang)}
                      </h3>
                      <div className="mt-auto flex items-center justify-between gap-3 pt-5">
                        <span className="text-[0.6875rem] text-mute">
                          {p.readingMin} {c.readingMin}
                        </span>
                        <ArrowUpRight
                          className="h-4 w-4 text-goldtext transition-transform duration-300 group-hover:translate-x-1"
                          strokeWidth={1.25}
                          aria-hidden
                        />
                      </div>
                    </Link>
                  </Beam>
                </StaggerItem>
              ))}
            </Stagger>
          </Container>
        </Section>
      )}

      <CtaBanner
        title={c.cta.title}
        gold={c.cta.gold}
        primaryLabel={c.cta.primaryLabel}
        primaryHref="/contact"
        secondaryLabel={c.cta.secondaryLabel}
        secondaryHref="/services"
      />
    </>
  );
}
