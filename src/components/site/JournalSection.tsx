"use client";

import React, { useEffect, useState } from "react";
import { Section, Container, SectionHeading, GoldBadge } from "@/components/site/kit";
import { Beam, DrawRule, Stagger, StaggerItem } from "@/components/motion";
import { useI18n } from "@/lib/i18n";
import { pickLocale, type LocaleMap } from "@/lib/locale-json";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ArrowUpRight } from "lucide-react";

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
 * Journal (spécification §23 : /blog) — articles éditoriaux de l'agence.
 * Section masquée tant qu'aucun article n'est publié (règle §20.4).
 * Chorégraphie (task 12-d) : Stagger (step 0.08), Beam hover sur chaque article,
 * date en capitales qui glisse au survol, titre qui s'embrase, filet doré en clôture.
 */
export function JournalSection() {
  const { lang, t, tr } = useI18n();
  const [posts, setPosts] = useState<PostRow[] | null>(null);
  const [openId, setOpenId] = useState<string | null>(null);

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

  if (!posts || posts.length === 0) return null;

  const catLabel = (c: string): string => tr<string>(`journal.categories.${c}`) ?? c;
  const open = posts.find((p) => p.id === openId) ?? null;

  return (
    <Section id="journal" tone="bg">
      <Container>
        <SectionHeading
          label={t("journal.label")}
          title={t("journal.title")}
          gold={t("journal.tGold")}
          sub={t("journal.sub")}
        />

        <Stagger className="grid gap-6 md:grid-cols-2 lg:grid-cols-3" step={0.08} delay={0.05}>
          {posts.map((p) => (
            <StaggerItem key={p.id} y={36} className="h-full">
              <Beam className="h-full rounded-xl">
                <article
                  role="button"
                  tabIndex={0}
                  aria-label={`${pickLocale(p.title, lang)} — ${t("journal.readMore")}`}
                  onClick={() => setOpenId(p.id)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setOpenId(p.id);
                    }
                  }}
                  className="card-lift group flex h-full cursor-pointer flex-col rounded-xl border border-line bg-surface p-6 text-left focus-visible:outline focus-visible:outline-1 focus-visible:outline-gold"
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
                  <p className="mt-3 line-clamp-3 flex-1 text-sm text-mute">
                    {pickLocale(p.excerpt, lang)}
                  </p>
                  <p className="mt-5 inline-flex items-center gap-1.5 text-[0.8125rem] font-semibold uppercase tracking-[0.12em] text-goldtext">
                    {t("journal.readMore")}
                    <ArrowUpRight
                      className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                      strokeWidth={1.25}
                      aria-hidden
                    />
                  </p>
                  <span className="mt-1 text-[0.6875rem] text-mute">
                    {p.readingMin} {t("journal.readingMin")}
                  </span>
                </article>
              </Beam>
            </StaggerItem>
          ))}
        </Stagger>

        {/* Filet doré qui se dessine en clôture de la liste */}
        <DrawRule className="mx-auto mt-14 h-px w-40" delay={0.1} />
      </Container>

      {/* Lecture d'un article — la lecture complète remplace la navigation hors route */}
      <Dialog open={openId !== null} onOpenChange={(o) => !o && setOpenId(null)}>
        <DialogContent
          aria-describedby={open ? "journal-article-excerpt" : undefined}
          className="max-h-[85vh] max-w-2xl overflow-y-auto border-line bg-surface text-ink"
        >
          {open && (
            <>
              <DialogHeader>
                <div className="flex flex-wrap items-center gap-2 pr-8">
                  <GoldBadge>{catLabel(open.category)}</GoldBadge>
                  <span className="text-xs text-mute">{fmtDate(open.publishedAt, lang)}</span>
                  <span className="text-xs text-mute">
                    · {open.readingMin} {t("journal.readingMin")}
                  </span>
                </div>
                <DialogTitle className="font-serif text-2xl leading-snug">
                  {pickLocale(open.title, lang)}
                </DialogTitle>
                <DialogDescription id="journal-article-excerpt" className="text-sm text-mute">
                  {pickLocale(open.excerpt, lang)}
                </DialogDescription>
              </DialogHeader>
              <div className="flex flex-col gap-4 text-[0.9375rem] leading-relaxed">
                {pickLocale(open.body, lang)
                  .split("\n\n")
                  .filter(Boolean)
                  .map((par, i) => (
                    <p key={i}>{par}</p>
                  ))}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </Section>
  );
}
