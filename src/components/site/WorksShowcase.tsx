"use client";

import Image from "next/image";
import { ArrowUpRight, Globe } from "lucide-react";
import { Container, Section, SectionHeading } from "@/components/site/kit";
import { Beam, SpotlightCard, Stagger, StaggerItem } from "@/components/motion";
import { useI18n } from "@/lib/i18n";
import { trackCta } from "@/lib/analytics";
import { WORKS, type WorkEntry } from "@/lib/pages-content/works";

/**
 * Travaux réalisés — sites réellement livrés par l'agence (liens fournis
 * par le client). Aperçu animé : au survol, la capture d'écran pleine
 * page défile doucement dans une fenêtre « navigateur », comme si l'on
 * scrolle le site en direct. Un clic ouvre le site dans un nouvel onglet.
 */
export function WorksShowcase() {
  const { t } = useI18n();

  return (
    <Section id="works" tone="base">
      <Container>
        <SectionHeading
          label={t("works.label")}
          title={t("works.title")}
          gold={t("works.tGold")}
          sub={t("works.sub")}
        />

        <Stagger className="grid gap-6 md:grid-cols-2 lg:grid-cols-3" step={0.08} delay={0.05}>
          {WORKS.map((w) => (
            <StaggerItem key={w.slug} y={36} className="h-full">
              <WorkCard work={w} />
            </StaggerItem>
          ))}
        </Stagger>

        <p className="mt-8 flex items-center justify-center gap-2 text-center text-xs text-mute">
          <Globe size={14} strokeWidth={1.25} aria-hidden className="text-gold" />
          {t("works.hint")}
        </p>
      </Container>
    </Section>
  );
}

/* ── Carte d'une réalisation : fenêtre navigateur + aperçu qui défile ── */
function WorkCard({ work: w }: { work: WorkEntry }) {
  const { lang, t } = useI18n();

  return (
    <SpotlightCard size={380} className="h-full rounded-xl">
      <Beam className="h-full rounded-xl">
        <article className="card-lift group flex h-full flex-col overflow-hidden rounded-xl border border-line bg-surface">
          {/* Barre de navigateur */}
          <div className="flex items-center gap-2 border-b border-line bg-surface2/60 px-4 py-2.5">
            <span aria-hidden className="flex gap-1.5">
              <i className="block h-2 w-2 rounded-full bg-gold/70" />
              <i className="block h-2 w-2 rounded-full bg-gold/35" />
              <i className="block h-2 w-2 rounded-full bg-line" />
            </span>
            <span className="mx-auto flex min-w-0 items-center gap-1.5 rounded-full border border-line bg-bg px-3 py-1 text-[0.6875rem] text-mute">
              <Globe size={10} strokeWidth={1.5} aria-hidden className="shrink-0 text-gold" />
              <span className="truncate">{w.domain}</span>
            </span>
          </div>

          {/* Fenêtre d'aperçu : la capture défile au survol (site « en direct ») */}
          <a
            href={w.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${w.name} — ${t("works.visit")}`}
            onClick={() => trackCta("works", w.slug)}
            className="work-window relative block h-[240px] overflow-hidden sm:h-[260px]"
          >
            <Image
              src={w.shot}
              alt={`${w.name} — ${w.sector[lang] ?? w.sector.fr}`}
              width={1100}
              height={5400}
              className="work-scrollable w-full transition-[filter] duration-500"
              priority={false}
              unoptimized
            />
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
          </a>

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
                <p className="label-caps mt-0.5 !text-[0.625rem]">{w.sector[lang] ?? w.sector.fr}</p>
              </div>
            </div>

            <p className="mt-3 line-clamp-3 flex-1 text-sm leading-relaxed text-mute">
              {w.desc[lang] ?? w.desc.fr}
            </p>

            <div className="mt-4 flex items-center justify-between gap-3 border-t border-line pt-3.5">
              <a
                href={w.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackCta("works", w.slug)}
                className="link-gold inline-flex min-h-[44px] items-center gap-1.5 text-[0.8125rem] font-semibold uppercase tracking-[0.12em] text-goldtext"
              >
                {t("works.visit")}
                <ArrowUpRight
                  className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  strokeWidth={1.25}
                  aria-hidden
                />
              </a>
              <span className="truncate text-[0.6875rem] text-mute">{w.domain}</span>
            </div>
          </div>
        </article>
      </Beam>
    </SpotlightCard>
  );
}
