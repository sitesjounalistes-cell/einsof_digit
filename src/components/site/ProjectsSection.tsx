"use client";

import React, { useEffect, useState } from "react";
import { Section, Container, SectionHeading, GoldBadge } from "@/components/site/kit";
import { Beam, SpotlightCard, Stagger, StaggerItem, Tilt } from "@/components/motion";
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
 * Chorégraphie (task 12-d) : Stagger (step 0.08) > Tilt > SpotlightCard > Beam hover ;
 * l'année réelle devient un filigrane qui zoome au survol (aucune image inventée :
 * les données API ne contiennent pas de visuel), dégradé or qui monte au survol.
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

        <Stagger className="grid gap-6 md:grid-cols-2 lg:grid-cols-3" step={0.08} delay={0.05}>
          {projects.map((p) => {
            const title = pickLocale(p.title, lang);
            return (
              <StaggerItem key={p.id} y={36} className="h-full">
                <Tilt max={5} className="h-full">
                  <SpotlightCard size={380} className="h-full rounded-xl">
                    <Beam className="h-full rounded-xl">
                      <article className="card-lift group flex h-full flex-col rounded-xl border border-line bg-bg p-6">
                        {/* Bandeau visuel — filigrane de l'année réelle + dégradé or montant */}
                        <div className="relative mb-5 h-24 overflow-hidden rounded-lg border border-line bg-surface2">
                          <span className="absolute -top-5 right-2 select-none font-serif text-[5rem] leading-none text-transparent [-webkit-text-stroke:1px_rgba(212,175,55,0.4)] transition-transform duration-700 ease-out group-hover:scale-105">
                            {String(p.year)}
                          </span>
                          <span
                            aria-hidden
                            className="absolute inset-0 bg-gradient-to-t from-gold/15 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                          />
                          {p.sector && (
                            <GoldBadge className="absolute bottom-3 left-3">{p.sector}</GoldBadge>
                          )}
                        </div>

                        <h3 className="font-serif text-xl leading-snug transition-colors duration-300 group-hover:text-goldlight">
                          {title}
                        </h3>
                        <p className="mt-3 flex-1 text-sm text-mute">{pickLocale(p.summary, lang)}</p>
                        <dl className="mt-5 grid grid-cols-2 gap-3 border-t border-line pt-4 text-xs">
                          <div>
                            <dt className="uppercase tracking-[0.14em] text-mute">
                              {t("projects.client")}
                            </dt>
                            <dd className="mt-1">{p.client ?? "—"}</dd>
                          </div>
                          <div>
                            <dt className="uppercase tracking-[0.14em] text-mute">
                              {t("projects.sector")}
                            </dt>
                            <dd className="mt-1">{p.sector ?? "—"}</dd>
                          </div>
                        </dl>
                        <button
                          type="button"
                          onClick={() => {
                            trackCta("projects", p.slug);
                            openForm("quote", { subject: `${t("projects.cta")} — ${title}` });
                          }}
                          className="link-gold mt-5 inline-flex min-h-[44px] items-center gap-1.5 self-start text-[0.8125rem] font-semibold uppercase tracking-[0.12em] text-goldtext"
                        >
                          {t("projects.cta")}
                          <ArrowUpRight
                            className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1"
                            strokeWidth={1.25}
                            aria-hidden
                          />
                        </button>
                      </article>
                    </Beam>
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
