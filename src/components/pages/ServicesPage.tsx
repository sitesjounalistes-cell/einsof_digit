"use client";

import Link from "next/link";
import {
  ArrowUpRight,
  Boxes,
  Check,
  Code2,
  Compass,
  Globe,
  GraduationCap,
  Megaphone,
  Target,
  type LucideIcon,
} from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { ServicesSection } from "@/components/site/ServicesSection";
import { PillarsSection } from "@/components/site/PillarsSection";
import { CtaBanner, PageCrossLinks } from "@/components/site/PageBlocks";
import { Container, GoldBadge, Section, SectionHeading } from "@/components/site/kit";
import { Beam, PopIn, PulseGlow, Stagger, StaggerItem } from "@/components/motion";
import { useI18n } from "@/lib/i18n";
import { useLocalized } from "@/lib/page-content";
import { SERVICES_PAGE } from "@/lib/pages-content/services";

/**
 * Page /services — bandeau d'ouverture, les 7 pôles (section partagée),
 * les deux promesses (section partagée), le détail de chaque pôle,
 * appel à l'action et liens croisés.
 */

const POLE_ICONS: Record<string, LucideIcon> = {
  web: Globe,
  software: Code2,
  saas: Boxes,
  community: Megaphone,
  acquisition: Target,
  training: GraduationCap,
  strategy: Compass,
};

export function ServicesPage() {
  const { t } = useI18n();
  const c = useLocalized(SERVICES_PAGE);

  return (
    <>
      <PageHero
        label={t("services.label")}
        title={t("services.title")}
        gold={t("services.tGold")}
        sub={t("services.sub")}
        chips={c.heroChips}
      />

      {/* Les 7 pôles (cartes + tarifs officiels) — section partagée existante */}
      <ServicesSection heading={false} />

      {/* Les deux promesses — section partagée existante */}
      <PillarsSection />

      {/* Détail de chaque pôle */}
      <Section id="services-detail" tone="surface">
        <Container>
          <SectionHeading
            label={c.detail.label}
            title={c.detail.title}
            gold={c.detail.gold}
            sub={c.detail.sub}
          />

          <Stagger className="grid gap-6 lg:grid-cols-2" step={0.1}>
            {c.poles.map((pole, i) => {
              const Icon = POLE_ICONS[pole.id] ?? Globe;
              return (
                <StaggerItem key={pole.id} y={28} className="h-full">
                  <Beam always={pole.soon} className="h-full rounded-xl">
                    <article
                      className={`card-lift relative flex h-full flex-col overflow-hidden rounded-xl border border-line bg-bg p-6 md:p-8 ${
                        pole.soon ? "opacity-85" : ""
                      }`}
                    >
                      <span
                        aria-hidden
                        className="absolute -top-2 right-3 font-serif text-7xl text-gold opacity-[0.07] transition-opacity duration-500 hover:opacity-[0.12]"
                      >
                        {pole.num}
                      </span>

                      {/* En-tête : icône, numéro, titre, badge éventuel */}
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center gap-4">
                          <PopIn delay={i * 0.05}>
                            <span
                              aria-hidden
                              className="inline-flex rounded-full border border-gold/30 p-3 text-gold"
                            >
                              <Icon size={22} strokeWidth={1.25} aria-hidden />
                            </span>
                          </PopIn>
                          <div>
                            <p className="font-serif text-sm text-gold" aria-hidden>
                              {pole.num}
                            </p>
                            <h3 className="mt-0.5 font-serif text-xl font-semibold text-ink md:text-2xl">
                              {pole.title}
                            </h3>
                          </div>
                        </div>
                        {pole.soon && (
                          <PulseGlow>
                            <GoldBadge className="shrink-0">{c.detail.soonLabel}</GoldBadge>
                          </PulseGlow>
                        )}
                      </div>

                      {/* Mission */}
                      <p className="mt-5 text-sm leading-relaxed text-mute md:text-[0.9375rem]">
                        {pole.mission}
                      </p>

                      {/* Inclus */}
                      {pole.included.length > 0 && (
                        <div className="mt-6">
                          <p className="label-caps">{pole.includedLabel}</p>
                          <ul className="mt-3 space-y-2.5">
                            {pole.included.map((item) => (
                              <li key={item} className="flex items-start gap-2.5">
                                <Check
                                  size={15}
                                  strokeWidth={1.75}
                                  aria-hidden
                                  className="mt-[0.2rem] shrink-0 text-gold"
                                />
                                <span className="text-sm leading-relaxed text-ink">{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Pour qui */}
                      <div className="mt-6 border-t border-line pt-5">
                        <p className="label-caps">{pole.forWhoLabel}</p>
                        <p className="mt-2 text-sm leading-relaxed text-mute">{pole.forWho}</p>
                      </div>

                      {/* Renvoi interne éventuel (SaaS → /logiciels) */}
                      {pole.href && pole.hrefLabel && (
                        <Link
                          href={pole.href}
                          className="link-gold mt-5 inline-flex w-fit items-center gap-1.5 text-sm font-medium text-goldtext transition-colors hover:text-goldlight"
                        >
                          {pole.hrefLabel}
                          <ArrowUpRight size={16} strokeWidth={1.5} aria-hidden />
                        </Link>
                      )}
                    </article>
                  </Beam>
                </StaggerItem>
              );
            })}
          </Stagger>
        </Container>
      </Section>

      <CtaBanner
        title={c.cta.title}
        gold={c.cta.gold}
        sub={c.cta.sub}
        primaryLabel={c.cta.primaryLabel}
        primaryHref="/contact"
        secondaryLabel={c.cta.secondaryLabel}
        secondaryHref="/tarifs"
      />

      <PageCrossLinks title={c.crossLinks.title} items={c.crossLinks.items} />
    </>
  );
}
