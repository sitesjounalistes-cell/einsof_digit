"use client";

import { Check } from "lucide-react";
import { Beam, DrawRule, SpotlightCard, Stagger, StaggerItem } from "@/components/motion";
import {
  Container,
  GoldBadge,
  PriceTag,
  Section,
  SectionHeading,
} from "@/components/site/kit";
import { PageHero } from "@/components/site/PageHero";
import { CtaBanner, PageCrossLinks } from "@/components/site/PageBlocks";
import { SaasSection } from "@/components/site/SaasSection";
import { TrialSection } from "@/components/site/TrialSection";
import { findSaas, type PriceOffer } from "@/lib/catalog";
import { useI18n } from "@/lib/i18n";
import { useLocalized } from "@/lib/page-content";
import { LOGICIELS } from "@/lib/pages-content/logiciels";

/**
 * Page /logiciels — hub des six SaaS de gestion.
 * Composition : PageHero > SaasSection (vitrine produits) > détail produit
 * (cartes riches jointes au catalogue officiel) > TrialSection (essai 7 jours)
 * > CtaBanner > liens croisés.
 */
export function LogicielsPage() {
  const { t } = useI18n();
  const c = useLocalized(LOGICIELS);

  /* Jonction contenu localisé ↔ catalogue officiel (source de vérité des prix). */
  const rows = c.detail.products.flatMap((detail) => {
    const saas = findSaas(detail.slug);
    return saas ? [{ detail, saas }] : [];
  });

  const priceProps = {
    fromLabel: t("pricing.fromLabel"),
    perMonth: t("pricing.perMonth"),
    perYear: t("pricing.perYear"),
    quoteLabel: t("pricing.quoteLabel"),
  };

  return (
    <>
      <PageHero
        label={c.hero.label}
        title={c.hero.title}
        gold={c.hero.gold}
        sub={c.hero.sub}
        chips={c.hero.chips}
      />

      <SaasSection heading={false} />

      {/* ── Détail des produits : une carte riche par logiciel ─────── */}
      <Section id="saas-detail" tone="surface">
        <Container>
          <SectionHeading
            label={c.detail.label}
            title={c.detail.title}
            gold={c.detail.gold}
            sub={c.detail.sub}
          />

          <Stagger className="grid gap-6 lg:grid-cols-2" step={0.07}>
            {rows.map(({ detail, saas }) => {
              const isHospital = saas.slug === "gestion-hospitaliere";
              const isSchool = saas.slug === "gestion-ecole";
              return (
                <StaggerItem key={detail.slug} className="h-full">
                  <SpotlightCard className="h-full rounded-xl">
                    <Beam className="h-full rounded-xl">
                      <article className="card-lift flex h-full flex-col rounded-xl border border-line bg-bg p-6 md:p-8">
                        {/* En-tête : nom + public */}
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <h3 className="display-3">{saas.name}</h3>
                          <GoldBadge>{detail.audience}</GoldBadge>
                        </div>

                        {/* Modules clés */}
                        <div className="mt-6">
                          <p className="label-caps">{c.detail.modulesLabel}</p>
                          <ul className="mt-3 space-y-2.5">
                            {detail.modules.map((mod) => (
                              <li key={mod} className="flex items-start gap-2.5 text-sm leading-relaxed text-mute">
                                <Check
                                  className="mt-0.5 h-4 w-4 shrink-0 text-gold"
                                  strokeWidth={1.25}
                                  aria-hidden
                                />
                                {mod}
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Pour qui */}
                        <div className="mt-6 rounded-lg border-l-2 border-gold bg-surface2 p-4">
                          <p className="label-caps mb-1.5">{c.detail.forWhomLabel}</p>
                          <p className="text-sm leading-relaxed text-mute">{detail.forWhom}</p>
                        </div>

                        {/* Prix — montants issus du catalogue officiel */}
                        <div className="mt-auto pt-7">
                          <DrawRule className="h-px w-full" delay={0.1} />
                          {isHospital ? (
                            <div className="mt-5">
                              <p className="label-caps mb-3">{c.detail.plansLabel}</p>
                              <ul className="space-y-3">
                                {saas.offers.map((offer: PriceOffer, i: number) => (
                                  <li
                                    key={offer.id}
                                    className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1"
                                  >
                                    <span className="font-serif text-lg text-ink">
                                      {c.detail.hospitalTiers[i] ?? offer.name}
                                    </span>
                                    <PriceTag
                                      offer={offer}
                                      {...priceProps}
                                      className="text-right"
                                    />
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ) : (
                            <div className="mt-5">
                              <PriceTag
                                offer={saas.offers[0]}
                                {...priceProps}
                                billableNote={isSchool ? c.detail.schoolNote : undefined}
                              />
                            </div>
                          )}
                        </div>
                      </article>
                    </Beam>
                  </SpotlightCard>
                </StaggerItem>
              );
            })}
          </Stagger>
        </Container>
      </Section>

      <TrialSection />

      <CtaBanner
        title={c.cta.title}
        gold={c.cta.gold}
        sub={c.cta.sub}
        primaryLabel={c.cta.primaryLabel}
        primaryHref="/contact"
        secondaryLabel={c.cta.secondaryLabel}
        secondaryHref="/tarifs"
      />

      <PageCrossLinks title={c.cross.title} items={c.cross.items} />
    </>
  );
}

export default LogicielsPage;
