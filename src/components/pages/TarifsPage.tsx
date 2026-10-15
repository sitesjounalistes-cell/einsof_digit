"use client";

import { Check } from "lucide-react";
import { Beam, Reveal, SpotlightCard, Stagger, StaggerItem } from "@/components/motion";
import {
  Container,
  GoldBadge,
  PriceTag,
  Section,
  SectionHeading,
} from "@/components/site/kit";
import { PageHero } from "@/components/site/PageHero";
import { CtaBanner, PageCrossLinks } from "@/components/site/PageBlocks";
import { PricingSection } from "@/components/site/PricingSection";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { SOFTWARE_OFFERS, WEB_OFFERS, WEB_RENEWAL } from "@/lib/catalog";
import { useI18n } from "@/lib/i18n";
import { useLocalized } from "@/lib/page-content";
import { TARIFS } from "@/lib/pages-content/tarifs";

/**
 * Page /tarifs — tous les prix officiels de l'agence.
 * Composition : PageHero > PricingSection (3 onglets) > « bien lire les prix »
 * (cartes détaillées jointes au catalogue par id d'offre, inclus, conditions)
 * > mini-FAQ (accordéon) > CtaBanner > liens croisés.
 * Aucun montant n'est écrit ici : tout vient de src/lib/catalog.ts via PriceTag.
 */
export function TarifsPage() {
  const { t, tr } = useI18n();
  const c = useLocalized(TARIFS);

  const included = tr<string[]>("pricing.included.items") ?? [];
  const notes = tr<string[]>("pricing.notes.items") ?? [];

  const priceProps = {
    fromLabel: t("pricing.fromLabel"),
    perMonth: t("pricing.perMonth"),
    perYear: t("pricing.perYear"),
    quoteLabel: t("pricing.quoteLabel"),
  };

  /* Jonction cartes localisées ↔ offres officielles (par id) — footnote
     retirée de l'offre : la description riche de la carte la remplace. */
  const webRows = c.detail.web.flatMap((card) => {
    const offer = WEB_OFFERS.find((o) => o.id === card.id);
    if (!offer) return [];
    const { footnote: _footnote, ...core } = offer;
    return [{ card, offer: core, featured: offer.featured === true }];
  });

  const softwareRows = c.detail.software.flatMap((card) => {
    const offer = SOFTWARE_OFFERS.find((o) => o.id === card.id);
    if (!offer) return [];
    const { footnote: _footnote, ...core } = offer;
    return [{ card, offer: core }];
  });

  const { footnote: _renewalFootnote, ...renewalCore } = WEB_RENEWAL;

  return (
    <>
      <PageHero
        label={c.hero.label}
        title={c.hero.title}
        gold={c.hero.gold}
        sub={c.hero.sub}
        chips={c.hero.chips}
        image="/images/headers/header-tarifs.png"
      />

      <PricingSection heading={false} />

      {/* ── Bien lire les prix : détail forfaits + inclus + conditions ── */}
      <Section id="pricing-detail" tone="surface">
        <Container>
          <SectionHeading
            label={c.detail.label}
            title={c.detail.title}
            gold={c.detail.gold}
            sub={c.detail.sub}
          />

          {/* Sites web */}
          <Reveal y={14} duration={0.6}>
            <div className="mb-6">
              <h3 className="display-3">{c.detail.webLabel}</h3>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-mute">
                {c.detail.webSub}
              </p>
            </div>
          </Reveal>
          <Stagger className="grid gap-6 lg:grid-cols-3" step={0.08}>
            {webRows.map(({ card, offer, featured }) => (
              <StaggerItem key={card.id} className="h-full">
                <SpotlightCard
                  className={`card-lift h-full rounded-xl border bg-bg hover:-translate-y-1.5 ${
                    featured ? "border-gold/50" : "border-line"
                  }`}
                >
                  <Beam className="h-full rounded-xl" always={featured}>
                    <article
                      className={`relative flex h-full flex-col rounded-xl p-6 ${featured ? "glow-pulse" : ""}`}
                    >
                      {featured && (
                        <span className="absolute right-5 top-5">
                          <GoldBadge>{c.detail.featuredLabel}</GoldBadge>
                        </span>
                      )}
                      <h4 className="max-w-[80%] font-serif text-xl leading-snug text-ink">
                        {card.title}
                      </h4>
                      <p className="mt-2.5 flex-1 text-sm leading-relaxed text-mute">
                        {card.desc}
                      </p>
                      <Reveal variant="scale" delay={0.2} y={12} duration={0.7} className="mt-5">
                        <PriceTag offer={offer} {...priceProps} />
                      </Reveal>
                      <p className="mt-2 text-xs uppercase tracking-[0.14em] text-mute">
                        {t("common.oneTime")}
                      </p>
                    </article>
                  </Beam>
                </SpotlightCard>
              </StaggerItem>
            ))}
          </Stagger>

          {/* Renouvellement annuel */}
          <Reveal delay={0.15} y={20} className="mt-6">
            <div className="flex flex-col items-start justify-between gap-4 rounded-xl border border-gold/30 bg-surface2 p-6 md:flex-row md:items-center">
              <div>
                <h4 className="font-serif text-xl text-ink">{c.detail.renewal.title}</h4>
                <p className="mt-1 text-sm leading-relaxed text-mute">{c.detail.renewal.desc}</p>
              </div>
              <Reveal variant="scale" delay={0.2} y={12} duration={0.7} className="shrink-0">
                <PriceTag offer={renewalCore} {...priceProps} className="md:text-right" />
              </Reveal>
            </div>
          </Reveal>

          {/* Logiciels */}
          <Reveal y={14} duration={0.6} className="mt-14">
            <div className="mb-6">
              <h3 className="display-3">{c.detail.softwareLabel}</h3>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-mute">
                {c.detail.softwareSub}
              </p>
            </div>
          </Reveal>
          <Stagger className="grid gap-6 md:grid-cols-2" step={0.08}>
            {softwareRows.map(({ card, offer }) => (
              <StaggerItem key={card.id} className="h-full">
                <SpotlightCard className="card-lift h-full rounded-xl border border-line bg-bg hover:-translate-y-1.5">
                  <Beam className="h-full rounded-xl">
                    <article className="flex h-full flex-col rounded-xl p-6">
                      <h4 className="font-serif text-xl leading-snug text-ink">{card.title}</h4>
                      <p className="mt-2.5 flex-1 text-sm leading-relaxed text-mute">
                        {card.desc}
                      </p>
                      <Reveal variant="scale" delay={0.2} y={12} duration={0.7} className="mt-5">
                        <PriceTag offer={offer} {...priceProps} />
                      </Reveal>
                      {offer.isQuoteOnly ? null : (
                        <p className="mt-2 text-xs uppercase tracking-[0.14em] text-mute">
                          {t("common.oneTime")}
                        </p>
                      )}
                    </article>
                  </Beam>
                </SpotlightCard>
              </StaggerItem>
            ))}
          </Stagger>

          {/* Inclus dans chaque site */}
          <Reveal delay={0.15} y={20} className="mt-14">
            <div className="rounded-xl border border-line bg-bg p-6 md:p-8">
              <h3 className="display-3">{t("pricing.included.t")}</h3>
              <Stagger className="mt-5" step={0.05}>
                <ul className="grid gap-3 sm:grid-cols-2">
                  {included.map((item) => (
                    <li key={item}>
                      <StaggerItem className="flex items-start gap-2.5 text-sm leading-relaxed text-mute">
                        <Check
                          className="mt-0.5 h-4 w-4 shrink-0 text-gold"
                          strokeWidth={1.25}
                          aria-hidden
                        />
                        {item}
                      </StaggerItem>
                    </li>
                  ))}
                </ul>
              </Stagger>
            </div>
          </Reveal>

          {/* Conditions & clauses */}
          <Reveal delay={0.2} y={20} className="mt-6">
            <div className="rounded-xl border-l-2 border-gold bg-bg p-6 md:p-8">
              <h3 className="label-caps">{t("pricing.notes.t")}</h3>
              <Stagger className="mt-4" step={0.05}>
                <ul className="space-y-3">
                  {notes.map((item) => (
                    <li key={item}>
                      <StaggerItem className="flex gap-3 text-sm leading-relaxed text-mute">
                        <span className="mt-0.5 shrink-0 text-gold" aria-hidden>
                          *
                        </span>
                        {item}
                      </StaggerItem>
                    </li>
                  ))}
                </ul>
              </Stagger>
            </div>
          </Reveal>
        </Container>
      </Section>

      {/* ── Mini-FAQ tarifs ────────────────────────────────────────── */}
      <Section id="pricing-faq">
        <Container>
          <SectionHeading
            label={c.faq.label}
            title={c.faq.title}
            gold={c.faq.gold}
            sub={c.faq.sub}
          />
          <Reveal delay={0.1} y={20} className="mx-auto max-w-3xl">
            <Accordion type="single" collapsible className="w-full rounded-xl border border-line bg-surface px-6">
              {c.faq.items.map((item, i) => (
                <AccordionItem key={item.q} value={`tarif-faq-${i}`} className="border-line last:border-b-0">
                  <AccordionTrigger className="py-5 text-left font-serif text-base font-medium text-ink hover:no-underline hover:text-goldlight md:text-lg">
                    {item.q}
                  </AccordionTrigger>
                  <AccordionContent className="pb-5 text-sm leading-relaxed text-mute">
                    {item.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </Reveal>
        </Container>
      </Section>

      <CtaBanner
        title={c.cta.title}
        gold={c.cta.gold}
        sub={c.cta.sub}
        primaryLabel={c.cta.primaryLabel}
        primaryHref="/contact"
        secondaryLabel={c.cta.secondaryLabel}
        secondaryHref="/logiciels"
      />

      <PageCrossLinks title={c.cross.title} items={c.cross.items} />
    </>
  );
}

export default TarifsPage;
