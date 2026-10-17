"use client";

import React, { useEffect, useState } from "react";
import { Download, File, FileSpreadsheet, FileText, Link2 } from "lucide-react";
import { Section, Container, SectionHeading, GoldBadge } from "@/components/site/kit";
import { Magnetic, Reveal } from "@/components/motion";
import { useI18n } from "@/lib/i18n";
import { pickLocale, type LocaleMap } from "@/lib/locale-json";
import { trackCta } from "@/lib/analytics";

interface DocumentRow {
  id: string;
  slug: string;
  title: LocaleMap;
  description: LocaleMap;
  category: string | null;
  fileUrl: string;
  fileKind: string | null;
}

const KIND_ICONS = {
  pdf: FileText,
  xlsx: FileSpreadsheet,
  docx: File,
  link: Link2,
} as const;

function iconFor(kind: string | null) {
  if (kind && kind in KIND_ICONS) {
    return KIND_ICONS[kind as keyof typeof KIND_ICONS];
  }
  return File;
}

/**
 * Ressources téléchargeables (spécification §24) — alimentée par l'Espace équipe.
 * Règle §20.4 : section masquée tant qu'aucun document public n'est publié.
 * Les documents « lead » et « team » ne sont jamais listés (filtrés par l'API).
 * Chorégraphie (task 12-d) : entrées latérales échelonnées (Reveal « left »,
 * pas 0.06), ligne qui glisse vers la droite au survol (translate-x-2,
 * border-l or, fond surface2), icône qui pivote/zoome, badge qui s'illumine,
 * bouton de téléchargement magnétique.
 */
export function DocumentsSection() {
  const { lang, t } = useI18n();
  const [docs, setDocs] = useState<DocumentRow[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/documents")
      .then((r) => (r.ok ? r.json() : null))
      .then((j: { ok: boolean; data?: DocumentRow[] } | null) => {
        if (cancelled) return;
        setDocs(j?.ok && Array.isArray(j.data) ? j.data : []);
      })
      .catch(() => {
        if (!cancelled) setDocs([]);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (!docs || docs.length === 0) return null;

  return (
    <Section id="documents" tone="surface">
      <Container>
        <SectionHeading
          label={t("documents.label")}
          title={t("documents.title")}
          gold={t("documents.tGold")}
          sub={t("documents.sub")}
        />

        <div className="flex flex-col gap-4">
          {docs.map((d, i) => {
            const title = pickLocale(d.title, lang);
            const description = pickLocale(d.description, lang);
            const Icon = iconFor(d.fileKind);
            const isLink = d.fileKind === "link";
            return (
              <Reveal key={d.id} variant="left" delay={i * 0.06} duration={0.7} y={28}>
                <article className="group flex flex-col gap-4 rounded-xl border border-line border-l-2 border-l-gold/25 bg-bg p-5 transition-all duration-300 ease-out hover:translate-x-2 hover:border-l-gold hover:bg-surface2 hover:shadow-[0_10px_34px_rgba(0,0,0,0.22)] md:flex-row md:items-center md:gap-6 md:p-6">
                  <span
                    aria-hidden
                    className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-gold/40 text-goldtext"
                  >
                    <Icon
                      className="h-5 w-5 transition-transform duration-300 group-hover:rotate-3 group-hover:scale-110"
                      strokeWidth={1.25}
                    />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="font-serif text-lg leading-snug transition-colors duration-300 group-hover:text-goldlight md:text-xl">
                        {title}
                      </h3>
                      {d.category && (
                        <GoldBadge className="transition-shadow duration-300 group-hover:shadow-[0_0_16px_rgba(212,175,55,0.28)]">
                          {d.category}
                        </GoldBadge>
                      )}
                    </div>
                    {description && (
                      <p className="mt-2 text-sm leading-relaxed text-mute">{description}</p>
                    )}
                  </div>
                  <Magnetic>
                    <a
                      href={d.fileUrl}
                      {...(isLink ? {} : { download: "" })}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${t("documents.download")} — ${title}`}
                      onClick={() => trackCta("documents", d.slug)}
                      className="inline-flex min-h-[44px] shrink-0 items-center justify-center gap-2 self-start rounded border border-gold/60 px-4 text-[0.8125rem] font-semibold uppercase tracking-[0.12em] text-goldtext transition-colors hover:border-gold hover:bg-gold hover:text-ongold md:self-auto"
                    >
                      {isLink ? (
                        <Link2 className="h-4 w-4" strokeWidth={1.25} aria-hidden />
                      ) : (
                        <Download className="h-4 w-4" strokeWidth={1.25} aria-hidden />
                      )}
                      {t("documents.download")}
                    </a>
                  </Magnetic>
                </article>
              </Reveal>
            );
          })}
        </div>

        <Reveal delay={0.15}>
          <p className="mt-8 text-sm text-mute">{t("documents.emptyNote")}</p>
        </Reveal>
      </Container>
    </Section>
  );
}
