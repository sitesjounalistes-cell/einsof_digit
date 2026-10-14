"use client";

import React, { useEffect, useState } from "react";
import { Download, File, FileSpreadsheet, FileText, Link2 } from "lucide-react";
import { Section, Container, SectionHeading, GoldBadge } from "@/components/site/kit";
import { Reveal } from "@/components/motion";
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
              <Reveal key={d.id} delay={i * 60}>
                <article className="card-lift flex flex-col gap-4 rounded-xl border border-line bg-bg p-5 md:flex-row md:items-center md:gap-6 md:p-6">
                  <span
                    aria-hidden
                    className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-gold/40 text-goldtext"
                  >
                    <Icon className="h-5 w-5" strokeWidth={1.25} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="font-serif text-lg leading-snug md:text-xl">{title}</h3>
                      {d.category && <GoldBadge>{d.category}</GoldBadge>}
                    </div>
                    {description && (
                      <p className="mt-2 text-sm leading-relaxed text-mute">{description}</p>
                    )}
                  </div>
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
                </article>
              </Reveal>
            );
          })}
        </div>

        <p className="mt-8 text-sm text-mute">{t("documents.emptyNote")}</p>
      </Container>
    </Section>
  );
}
