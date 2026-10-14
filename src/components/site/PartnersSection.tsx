"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { Section, Container, SectionHeading, GoldButton } from "@/components/site/kit";
import { Reveal } from "@/components/motion";
import { useI18n } from "@/lib/i18n";
import { openForm } from "@/lib/chat-bus";
import { trackCta } from "@/lib/analytics";

interface PartnerRow {
  id: string;
  name: string;
  logoUrl: string | null;
  websiteUrl: string | null;
  description: string | null;
}

/**
 * Partenaires (spécification §23) — alimentée par l'Espace équipe.
 * Règle §20.4 : section masquée tant qu'aucun partenaire n'est actif
 * (aucun partenaire fictif).
 */
export function PartnersSection() {
  const { t } = useI18n();
  const [partners, setPartners] = useState<PartnerRow[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/partners")
      .then((r) => (r.ok ? r.json() : null))
      .then((j: { ok: boolean; data?: PartnerRow[] } | null) => {
        if (cancelled) return;
        setPartners(j?.ok && Array.isArray(j.data) ? j.data : []);
      })
      .catch(() => {
        if (!cancelled) setPartners([]);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (!partners || partners.length === 0) return null;

  return (
    <Section id="partners" tone="surface">
      <Container>
        <SectionHeading
          label={t("partners.label")}
          title={t("partners.title")}
          gold={t("partners.tGold")}
          sub={t("partners.sub")}
        />

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {partners.map((p, i) => (
            <Reveal key={p.id} delay={i * 80}>
              <article className="card-lift flex h-full flex-col rounded-xl border border-line bg-bg p-6">
                {/* Logo dans un cadre fixe, sinon bloc typographique (jamais d'image générée) */}
                <div className="flex h-20 items-center justify-center">
                  {p.logoUrl ? (
                    <div className="relative h-20 w-full">
                      <Image
                        src={p.logoUrl}
                        alt={p.name}
                        fill
                        sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 30vw"
                        className="object-contain"
                        unoptimized
                      />
                    </div>
                  ) : (
                    <span className="font-serif text-2xl leading-tight">{p.name}</span>
                  )}
                </div>
                {p.description && (
                  <p className="mt-4 flex-1 text-sm leading-relaxed text-mute">{p.description}</p>
                )}
                <div className="mt-5 flex items-center justify-between gap-3 border-t border-line pt-4">
                  {p.logoUrl && (
                    <span className="min-w-0 truncate text-sm font-medium">{p.name}</span>
                  )}
                  {p.websiteUrl ? (
                    <a
                      href={p.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${p.name} — ${t("partners.visit")}`}
                      onClick={() => trackCta("partners", p.id)}
                      className="inline-flex min-h-[44px] flex-1 items-center gap-1.5 self-start text-[0.8125rem] font-semibold uppercase tracking-[0.12em] text-goldtext link-gold"
                    >
                      {t("partners.visit")}
                      <ArrowUpRight className="h-4 w-4" strokeWidth={1.25} aria-hidden />
                    </a>
                  ) : (
                    <span className="flex-1" />
                  )}
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal delay={120}>
          <GoldButton
            variant="outline"
            className="mt-10"
            onClick={() => {
              trackCta("partners", "become");
              openForm("contact", { subject: t("partners.become") });
            }}
          >
            {t("partners.become")}
          </GoldButton>
        </Reveal>
      </Container>
    </Section>
  );
}
