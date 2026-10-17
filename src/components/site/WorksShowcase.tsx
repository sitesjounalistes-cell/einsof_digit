"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { ArrowUpRight, Globe } from "lucide-react";
import { Container, Section, SectionHeading } from "@/components/site/kit";
import { CoverflowCarousel, type CoverflowItem } from "@/components/site/CoverflowCarousel";
import { useI18n } from "@/lib/i18n";
import type { Lang } from "@/lib/i18n/translations";
import { trackCta } from "@/lib/analytics";
import { pickLocale, type LocaleMap } from "@/lib/locale-json";
import { WORKS } from "@/lib/pages-content/works";

/**
 * Travaux réalisés — carrousel « coverflow » (même mise en scène que les
 * carrousels Services & Logiciels) : la carte du site actif trône au centre,
 * les voisines s'effacent en profondeur. Lecture automatique : une carte
 * toutes les 3 secondes, en boucle, pause au survol / focus / glisser.
 *
 * Aperçu animé : au survol de la carte active, la capture d'écran pleine
 * page (100 % des composants du site chargés) défile dans une fenêtre
 * « navigateur », comme si l'on scrolle le site en direct. Un clic ouvre
 * le site dans un nouvel onglet.
 *
 * Source des données : les réalisations publiées depuis l'Espace équipe
 * (GET /api/projects, ordre sortOrder). Si la base n'en renvoie aucune
 * (ou si l'API est momentanément indisponible), repli fidèle sur les
 * travaux statiques (works.ts) — la section n'est jamais vide. Pendant le
 * chargement, les travaux statiques s'affichent déjà : fluidité maximale,
 * aucune coquille vide, échange discret si la base renvoie ses projets.
 */

/* ── Vue unifiée : travaux statiques ou réalisations en base ── */

interface WorkView {
  key: string;
  name: string;
  year: number;
  url: string | null;
  domain: string | null;
  client: string | null;
  sector: string | null;
  desc: string;
  shot: string | null;
  shotH: number;
  logo: string | null;
}

interface ProjectFeedRow {
  id: string;
  slug: string;
  title: LocaleMap;
  client: string | null;
  sector: string | null;
  year: number;
  summary: LocaleMap;
  linkUrl: string | null;
  imageUrl: string | null;
}

/** Hauteur indicative des captures externes (fenêtre d'aperçu fixe de toute façon). */
const DEFAULT_SHOT_H = 1400;

/** Captures statiques connues — repli image d'une réalisation DB sans imageUrl. */
const STATIC_SHOTS: Record<string, string> = Object.fromEntries(
  WORKS.map((w) => [w.slug, w.shot])
);

function staticViews(lang: Lang): WorkView[] {
  return WORKS.map((w) => ({
    key: w.slug,
    name: w.name,
    year: 2025,
    url: w.url,
    domain: w.domain,
    client: null,
    sector: w.sector[lang] ?? w.sector.fr,
    desc: w.desc[lang] ?? w.desc.fr,
    shot: w.shot,
    shotH: w.shotH,
    logo: w.logo,
  }));
}

function hostnameOf(url: string): string | null {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return null;
  }
}

function projectViews(rows: ProjectFeedRow[], lang: string): WorkView[] {
  return rows.map((p) => ({
    key: p.slug,
    name: pickLocale(p.title, lang) || p.slug,
    year: p.year,
    url: p.linkUrl && p.linkUrl.trim() !== "" ? p.linkUrl : null,
    domain: p.linkUrl ? hostnameOf(p.linkUrl) : null,
    client: p.client,
    sector: p.sector,
    desc: pickLocale(p.summary, lang),
    /* imageUrl ?? capture statique du même slug (projets importés de works.ts) */
    shot: p.imageUrl ?? STATIC_SHOTS[p.slug] ?? null,
    shotH: DEFAULT_SHOT_H,
    logo: null,
  }));
}

/* ── Section publique ───────────────────────────────────────── */

export function WorksShowcase() {
  const { lang, t } = useI18n();
  const [dbRows, setDbRows] = useState<ProjectFeedRow[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/projects", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((j: { ok: boolean; data?: ProjectFeedRow[] } | null) => {
        if (cancelled) return;
        setDbRows(j?.ok && Array.isArray(j.data) ? j.data : []);
      })
      .catch(() => {
        if (!cancelled) setDbRows([]);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const views: WorkView[] =
    dbRows && dbRows.length > 0 ? projectViews(dbRows, lang) : staticViews(lang);

  const items: CoverflowItem[] = views.map((v) => ({
    key: v.key,
    ariaLabel: `${v.name}${v.sector ? ` — ${v.sector}` : ""}`,
  }));

  return (
    <Section id="works" tone="bg">
      <Container>
        <SectionHeading
          label={t("works.label")}
          title={t("works.title")}
          gold={t("works.tGold")}
          sub={t("works.sub")}
        />

        <CoverflowCarousel
          items={items}
          ariaLabel={t("works.label")}
          autoplayMs={3000}
          viewportClassName="h-[540px] sm:h-[580px]"
          renderItem={(item) => {
            const v = views.find((x) => x.key === item.key);
            return v ? <WorkCard work={v} /> : null;
          }}
        />

        <p className="mt-8 flex items-center justify-center gap-2 text-center text-xs text-mute">
          <Globe size={14} strokeWidth={1.25} aria-hidden className="text-gold" />
          {t("works.hint")}
        </p>
      </Container>
    </Section>
  );
}

/* ── Carte d'une réalisation : fenêtre navigateur + aperçu qui défile ── */

function WorkCard({ work: w }: { work: WorkView }) {
  const { lang, t } = useI18n();
  const browserLabel = w.domain ?? w.client ?? String(w.year);
  const sectorLabel = w.sector ?? String(w.year);

  const screen = w.shot ? (
    <Image
      src={w.shot}
      alt={`${w.name}${w.sector ? ` — ${w.sector}` : ""}`}
      width={1100}
      height={w.shotH}
      className="work-scrollable w-full transition-[filter] duration-500"
      priority={false}
      unoptimized
    />
  ) : (
    <span
      aria-hidden
      className="flex h-full w-full flex-col items-center justify-center gap-3 bg-surface2/40"
    >
      <span className="font-serif text-6xl leading-none text-gold/30">{w.name.charAt(0)}</span>
      <span className="label-caps">{w.year}</span>
    </span>
  );

  const windowContent = (
    <>
      {/* Fenêtre d'aperçu : la capture (tous composants chargés) défile au survol */}
      {screen}
      {/* Voile + étiquette « aperçu live » */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-bg/85 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-1.5 rounded-full border border-gold/40 bg-bg/85 px-3 py-1 text-[0.625rem] font-semibold uppercase tracking-[0.16em] text-goldtext opacity-0 backdrop-blur-sm transition-all duration-500 group-hover:opacity-100"
      >
        <i className="glow-pulse block h-1.5 w-1.5 rounded-full bg-gold" />
        {t("works.preview")}
      </span>
    </>
  );

  return (
    <article className="card-lift group flex h-full flex-col overflow-hidden rounded-xl border border-line bg-surface shadow-[0_18px_50px_-24px_rgba(0,0,0,0.45)]">
      {/* Barre de navigateur */}
      <div className="flex items-center gap-2 border-b border-line bg-surface2/60 px-4 py-2.5">
        <span aria-hidden className="flex gap-1.5">
          <i className="block h-2 w-2 rounded-full bg-gold/70" />
          <i className="block h-2 w-2 rounded-full bg-gold/35" />
          <i className="block h-2 w-2 rounded-full bg-line" />
        </span>
        <span className="mx-auto flex min-w-0 items-center gap-1.5 rounded-full border border-line bg-bg px-3 py-1 text-[0.6875rem] text-mute">
          <Globe size={10} strokeWidth={1.5} aria-hidden className="shrink-0 text-gold" />
          <span className="truncate">{browserLabel}</span>
        </span>
      </div>

      {w.url ? (
        <a
          href={w.url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${w.name} — ${t("works.visit")}`}
          onClick={() => trackCta("works", w.key)}
          className="work-window relative block h-[280px] overflow-hidden"
        >
          {windowContent}
        </a>
      ) : (
        <div className="work-window relative block h-[280px] overflow-hidden">
          {windowContent}
        </div>
      )}

      {/* Identité du client */}
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center gap-3">
          {w.logo ? (
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-line bg-bg p-1.5">
              <Image
                src={w.logo}
                alt=""
                width={44}
                height={44}
                className="h-full w-full object-contain dark:brightness-0 dark:invert"
                unoptimized
              />
            </span>
          ) : (
            <span
              aria-hidden
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-gold/30 bg-bg font-serif text-lg text-goldtext"
            >
              {w.name.charAt(0)}
            </span>
          )}
          <div className="min-w-0">
            <h3 className="truncate font-serif text-lg leading-tight">{w.name}</h3>
            <p className="label-caps mt-0.5 !text-[0.625rem]">{sectorLabel}</p>
          </div>
        </div>

        {w.desc && (
          <p className="mt-3 line-clamp-3 flex-1 text-sm leading-relaxed text-mute">{w.desc}</p>
        )}

        <div className="mt-4 flex items-center justify-between gap-3 border-t border-line pt-3.5">
          {w.url ? (
            <a
              href={w.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackCta("works", w.key)}
              className="link-gold inline-flex min-h-[44px] items-center gap-1.5 text-[0.8125rem] font-semibold uppercase tracking-[0.12em] text-goldtext"
            >
              {t("works.visit")}
              <ArrowUpRight
                className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                strokeWidth={1.25}
                aria-hidden
              />
            </a>
          ) : (
            <span className="label-caps text-mute">{w.year}</span>
          )}
          <span className="truncate text-[0.6875rem] text-mute">{browserLabel}</span>
        </div>
      </div>
    </article>
  );
}
