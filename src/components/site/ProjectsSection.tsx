"use client";

import React, { useEffect, useState } from "react";
import { Section, Container, SectionHeading, GoldBadge } from "@/components/site/kit";
import { Reveal } from "@/components/motion";
import { useI18n } from "@/lib/i18n";
import { pickLocale, type LocaleMap } from "@/lib/locale-json";
import { openForm } from "@/lib/chat-bus";
import { trackCta } from "@/lib/analytics";
import { ArrowUpRight } from "lucide-react";

interface ProjectRow {
  id: string;
  slug: string;
  title: LocaleMap;
  client: string | null;
  sector: string | null;
  year: number;
  summary: LocaleMap;
  description: LocaleMap;
  linkUrl: string | null;
}

/**
 * Réalisations (spécification §23 : /realisations) — alimentée par l'Espace équipe.
 * Règle §20.4 : section masquée tant qu'aucune réalisation n'est publiée
 * (aucun client ni projet fictif).
 */
export function ProjectsSection() {
  const { lang, t } = useI18n();
  const [projects, setProjects] = useState<ProjectRow[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/projects")
      .then((r) => (r.ok ? r.json() : null))
      .then((j: { ok: boolean; data?: ProjectRow[] } | null) => {
        if (cancelled) return;
        setProjects(j?.ok && Array.isArray(j.data) ? j.data : []);
      })
      .catch(() => {
        if (!cancelled) setProjects([]);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (!projects || projects.length === 0) return null;

  return (
    <Section id="projects" tone="surface">
      <Container>
        <SectionHeading
          label={t("projects.label")}
          title={t("projects.title")}
          gold={t("projects.tGold")}
          sub={t("projects.sub")}
        />

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((p, i) => {
            const title = pickLocale(p.title, lang);
            return (
              <Reveal key={p.id} delay={i * 80}>
                <article className="card-lift flex h-full flex-col rounded-xl border border-line bg-bg p-6">
                  <div className="flex items-baseline justify-between gap-3">
                    <span aria-hidden className="font-serif text-3xl text-gold/70">
                      {String(p.year)}
                    </span>
                    {p.sector && <GoldBadge>{p.sector}</GoldBadge>}
                  </div>
                  <h3 className="mt-4 font-serif text-xl leading-snug">{title}</h3>
                  <p className="mt-3 flex-1 text-sm text-mute">{pickLocale(p.summary, lang)}</p>
                  <dl className="mt-5 grid grid-cols-2 gap-3 border-t border-line pt-4 text-xs">
                    <div>
                      <dt className="uppercase tracking-[0.14em] text-mute">{t("projects.client")}</dt>
                      <dd className="mt-1">{p.client ?? "—"}</dd>
                    </div>
                    <div>
                      <dt className="uppercase tracking-[0.14em] text-mute">{t("projects.sector")}</dt>
                      <dd className="mt-1">{p.sector ?? "—"}</dd>
                    </div>
                  </dl>
                  <button
                    type="button"
                    onClick={() => {
                      trackCta("projects", p.slug);
                      openForm("quote", { subject: `${t("projects.cta")} — ${title}` });
                    }}
                    className="mt-5 inline-flex min-h-[44px] items-center gap-1.5 self-start text-[0.8125rem] font-semibold uppercase tracking-[0.12em] text-goldtext link-gold"
                  >
                    {t("projects.cta")}
                    <ArrowUpRight className="h-4 w-4" strokeWidth={1.25} aria-hidden />
                  </button>
                </article>
              </Reveal>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}
