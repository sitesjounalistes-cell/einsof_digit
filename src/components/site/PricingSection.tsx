"use client";

import {
  Calculator,
  CreditCard,
  GraduationCap,
  Pill,
  Receipt,
  RefreshCw,
  School,
  Building2,
  Stethoscope,
  Sparkles,
  Wallet,
  Workflow as WorkflowIcon,
} from "lucide-react";
import {
  Beam,
  PulseGlow,
  Reveal,
  SpotlightCard,
  Stagger,
  StaggerItem,
  Tilt,
} from "@/components/motion";
import { Container, GoldButton, PriceTag, Section, SectionHeading } from "@/components/site/kit";
import { GoldIcon, IconFeature, LearnMore, featureIconFor } from "@/components/site/icons";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ACQUISITION_OFFERS,
  COMMUNITY_OFFERS,
  SAAS_PRODUCTS,
  SOFTWARE_OFFERS,
  TRAINING_OFFERS,
  WEB_OFFERS,
  WEB_PAYMENT_ADDON,
  WEB_RENEWALS,
  type PriceOffer,
} from "@/lib/catalog";
import { openForm } from "@/lib/chat-bus";
import { trackCta } from "@/lib/analytics";
import { useI18n } from "@/lib/i18n";
import { useLocalized } from "@/lib/page-content";
import { TARIFS, type TarifCard } from "@/lib/pages-content/tarifs";

/* Forfait hôpital : bornes exactes du catalogue (1 000 000 → 5 000 000 GNF / mois) */
const HOSPITAL_RANGE = "1 – 5\u00A0000\u00A0000\u00A0GNF";

/* Figurine dédiée à chaque SaaS de gestion (repérage instantané). */
const SAAS_ICONS: Record<string, typeof Receipt> = {
  "factura-pro": Receipt,
  "gestion-comptable": Calculator,
  "gestion-hospitaliere": Stethoscope,
  "gestion-ecole": School,
  "gestion-immobiliere": Building2,
  "gestion-pharmacie": Pill,
  "gestion-formation": GraduationCap,
};

const tabsTriggerCls =
  "rounded-md px-4 py-2 text-[0.8125rem] uppercase tracking-[0.1em] text-mute dark:text-mute data-[state=active]:bg-surface dark:data-[state=active]:bg-surface data-[state=active]:text-goldtext dark:data-[state=active]:text-goldtext sm:px-5 sm:text-sm";

/** Nombre de caractéristiques visibles d'office sur une carte tarif —
 *  le reste se déplie derrière « En savoir plus ». */
const PREVIEW_FEATURES = 4;

/**
 * Carte tarif « prix d'abord » (demande client) :
 *  1. LE PRIX en très grand, TOUT EN HAUT de la carte ;
 *  2. le titre en grands caractères sous le prix ;
 *  3. un aperçu de 4 caractéristiques avec figurines or —
 *     le reste se déplie derrière « En savoir plus » ;
 *  4. bouton devis. Aucune avalanche de texte.
 *  Chorégraphie : Tilt léger > SpotlightCard (halo curseur) > Beam (bordure or).
 */
export function PriceCard({
  offer,
  card,
  featured = false,
}: {
  offer: PriceOffer;
  card: TarifCard;
  featured?: boolean;
}) {
  const { t } = useI18n();
  const HeroIcon = featureIconFor(card.title);
  const preview = card.features.slice(0, PREVIEW_FEATURES);
  const rest = card.features.slice(PREVIEW_FEATURES);

  return (
    <div className={`h-full ${featured ? "lg:scale-[1.02]" : ""}`}>
      <Tilt max={3} className="h-full">
        <SpotlightCard
          className={`card-lift h-full rounded-xl border bg-surface hover:-translate-y-1.5 ${
            featured ? "border-gold/50" : "border-line"
          }`}
        >
          <Beam className="h-full rounded-xl" always={featured}>
            <div
              className={`relative flex h-full flex-col rounded-xl p-6 ${
                featured ? "glow-pulse" : ""
              }`}
            >
              {featured && (
                <span aria-hidden className="absolute right-5 top-5">
                  <PulseGlow>
                    <span className="block h-2 w-2 rounded-full bg-gold" />
                  </PulseGlow>
                </span>
              )}

              {/* ── 1. LE PRIX — en haut, en très grand ─────────── */}
              <PriceTag
                offer={offer}
                size="xl"
                fromLabel={t("pricing.fromLabel")}
                perMonth={t("pricing.perMonth")}
                perYear={t("pricing.perYear")}
                quoteLabel={t("pricing.quoteLabel")}
              />

              {/* ── 2. TITRE en grands caractères + figurine ────── */}
              <div aria-hidden className="gold-rule my-5 h-px w-full opacity-60" />
              <div className="flex items-center gap-4">
                <GoldIcon icon={HeroIcon} size="md" pulse={featured} />
                <h3 className="font-serif text-2xl font-semibold leading-tight text-ink">
                  {card.title}
                </h3>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-mute">{card.desc}</p>

              {/* ── 3. Caractéristiques : 4 visibles + dépliage ──── */}
              {card.features.length > 0 && (
                <div className="mt-5">
                  <LearnMore
                    moreLabel={t("common.seeMore")}
                    lessLabel={t("common.showLess")}
                    collapsible={rest.length > 0}
                    preview={
                      <ul className="space-y-3">
                        {preview.map((f) => (
                          <IconFeature key={f} text={f} compact />
                        ))}
                      </ul>
                    }
                  >
                    <ul className="space-y-3">
                      {rest.map((f) => (
                        <IconFeature key={f} text={f} compact />
                      ))}
                    </ul>
                  </LearnMore>
                </div>
              )}

              <div aria-hidden className="flex-1" />
              <GoldButton
                variant={featured ? "primary" : "outline"}
                magnetic
                className="mt-6"
                onClick={() => {
                  openForm("quote", { subject: `Devis — ${card.title}` });
                  trackCta("pricing", offer.id);
                }}
              >
                {t("pricing.ctaQuote")}
              </GoldButton>
            </div>
          </Beam>
        </SpotlightCard>
      </Tilt>
    </div>
  );
}

/** Bande « renouvellements annuels » + option paiement — figurines or,
 *  montants rendus par PriceTag (grand format) depuis le catalogue.
 *  Réutilisée par la page de détail du pôle web. */
export function RenewalsAddonBand() {
  const { t } = useI18n();
  const c = useLocalized(TARIFS);
  const web = c.groups.web;
  const priceProps = {
    fromLabel: t("pricing.fromLabel"),
    perMonth: t("pricing.perMonth"),
    perYear: t("pricing.perYear"),
    quoteLabel: t("pricing.quoteLabel"),
    size: "lg" as const,
  };
  const addonOffer = WEB_PAYMENT_ADDON;

  return (
    <>
      <Reveal delay={0.15} y={20} className="mt-10">
        <h4 className="font-serif text-xl text-ink">{web.renewalsTitle}</h4>
        <Stagger className="mt-4 grid gap-4 md:grid-cols-2" step={0.08}>
          {web.renewals.map((r) => {
            const offer = WEB_RENEWALS.find((o) => o.id === r.id);
            if (!offer) return null;
            return (
              <StaggerItem key={r.id} className="h-full">
                <div className="flex h-full flex-col justify-between gap-4 rounded-xl border border-gold/30 bg-surface2 p-6 sm:flex-row sm:items-center">
                  <div className="flex min-w-0 flex-1 items-start gap-4">
                    <GoldIcon icon={RefreshCw} size="sm" />
                    <div className="min-w-0">
                      <p className="font-serif text-lg text-ink">{r.title}</p>
                      <p className="mt-1 text-sm leading-relaxed text-mute">{r.desc}</p>
                    </div>
                  </div>
                  <PriceTag offer={offer} {...priceProps} className="w-full sm:max-w-[300px] sm:text-right" />
                </div>
              </StaggerItem>
            );
          })}
        </Stagger>
      </Reveal>

      <Reveal delay={0.18} y={20} className="mt-4">
        <div className="flex flex-col items-start justify-between gap-4 rounded-xl border border-line bg-surface p-6 md:flex-row md:items-center">
          <div className="flex min-w-0 flex-1 items-start gap-4">
            <GoldIcon icon={CreditCard} size="sm" />
            <div className="min-w-0">
              <h4 className="font-serif text-lg text-ink">{web.addon.title}</h4>
              <p className="mt-1 max-w-2xl text-sm leading-relaxed text-mute">{web.addon.desc}</p>
            </div>
          </div>
          <PriceTag offer={addonOffer} {...priceProps} className="w-full sm:max-w-[340px] md:text-right" />
        </div>
      </Reveal>
    </>
  );
}

export function PricingSection({ heading = true }: { heading?: boolean }) {
  const { t } = useI18n();
  const c = useLocalized(TARIFS);
  const { groups } = c;

  const priceProps = {
    fromLabel: t("pricing.fromLabel"),
    perMonth: t("pricing.perMonth"),
    perYear: t("pricing.perYear"),
    quoteLabel: t("pricing.quoteLabel"),
    size: "lg" as const,
  };

  const cardById = (cards: TarifCard[], id: string) => cards.find((x) => x.id === id);

  return (
    <Section id="pricing">
      <Container>
        {heading && (
          <SectionHeading
            label={t("pricing.label")}
            title={t("pricing.title")}
            gold={t("pricing.tGold")}
            sub={t("pricing.sub")}
          />
        )}

        <Reveal delay={0.1} y={20}>
          <Tabs defaultValue="web">
            <TabsList className="h-auto flex-wrap rounded-lg border border-line bg-transparent p-1">
              <TabsTrigger value="web" className={tabsTriggerCls}>
                {t("pricing.tabs.web")}
              </TabsTrigger>
              <TabsTrigger value="software" className={tabsTriggerCls}>
                {t("pricing.tabs.software")}
              </TabsTrigger>
              <TabsTrigger value="saas" className={tabsTriggerCls}>
                {t("pricing.tabs.saas")}
              </TabsTrigger>
              <TabsTrigger value="community" className={tabsTriggerCls}>
                {t("pricing.tabs.community")}
              </TabsTrigger>
              <TabsTrigger value="acquisition" className={tabsTriggerCls}>
                {t("pricing.tabs.acquisition")}
              </TabsTrigger>
              <TabsTrigger value="training" className={tabsTriggerCls}>
                {t("pricing.tabs.training")}
              </TabsTrigger>
            </TabsList>

            {/* ── Sites web ─────────────────────────────────── */}
            <TabsContent value="web" className="mt-10">
              <p className="mb-6 max-w-3xl text-sm leading-relaxed text-mute">{groups.web.sub}</p>
              <Stagger className="grid gap-6 md:grid-cols-2 lg:grid-cols-3" step={0.08}>
                {WEB_OFFERS.map((offer) => {
                  const card = cardById(groups.web.cards, offer.id);
                  if (!card) return null;
                  return (
                    <StaggerItem key={offer.id} className="h-full">
                      <PriceCard offer={offer} card={card} featured={offer.featured === true} />
                    </StaggerItem>
                  );
                })}
              </Stagger>

              <RenewalsAddonBand />

              <Reveal delay={0.2} y={20} className="mt-4">
                <div className="rounded-xl border border-line bg-surface p-6 md:p-8">
                  <h4 className="display-3">{groups.web.optionsTitle}</h4>
                  <Stagger as="ul" className="mt-5 grid gap-x-8 gap-y-3.5 sm:grid-cols-2" step={0.05}>
                    {groups.web.options.map((item) => (
                      <StaggerItem key={item} as="li" className="h-full list-none">
                        <IconFeature text={item} as="div" />
                      </StaggerItem>
                    ))}
                  </Stagger>
                </div>
              </Reveal>

              <Reveal delay={0.22} y={20} className="mt-4">
                <div className="rounded-xl border border-line bg-surface2 p-6 md:p-8">
                  <h4 className="display-3">{groups.web.includedTitle}</h4>
                  <Stagger as="ul" className="mt-5 grid gap-x-8 gap-y-3.5 sm:grid-cols-2" step={0.05}>
                    {groups.web.included.map((item) => (
                      <StaggerItem key={item} as="li" className="h-full list-none">
                        <IconFeature text={item} as="div" />
                      </StaggerItem>
                    ))}
                  </Stagger>
                </div>
              </Reveal>

              {/* Conditions : aperçu de 2 clauses, le reste derrière
                  « En savoir plus » (moins de texte visible d'office). */}
              <Reveal delay={0.24} y={20} className="mt-4">
                <div className="rounded-xl border-l-2 border-gold bg-surface p-6 md:p-8">
                  <h4 className="label-caps">{groups.web.notesTitle}</h4>
                  <LearnMore
                    className="mt-4"
                    moreLabel={t("common.seeMore")}
                    lessLabel={t("common.showLess")}
                    preview={
                      <ul className="space-y-3">
                        {groups.web.notes.slice(0, 2).map((item) => (
                          <IconFeature key={item} text={item} />
                        ))}
                      </ul>
                    }
                  >
                    <ul className="space-y-3">
                      {groups.web.notes.slice(2).map((item) => (
                        <IconFeature key={item} text={item} />
                      ))}
                    </ul>
                  </LearnMore>
                </div>
              </Reveal>
            </TabsContent>

            {/* ── Logiciels & applications ──────────────────── */}
            <TabsContent value="software" className="mt-10">
              <p className="mb-6 max-w-3xl text-sm leading-relaxed text-mute">
                {groups.software.sub}
              </p>
              <Stagger className="grid gap-6 md:grid-cols-2 lg:grid-cols-3" step={0.08}>
                {SOFTWARE_OFFERS.map((offer) => {
                  const card = cardById(groups.software.cards, offer.id);
                  if (!card) return null;
                  return (
                    <StaggerItem key={offer.id} className="h-full">
                      <PriceCard offer={offer} card={card} />
                    </StaggerItem>
                  );
                })}
              </Stagger>
              <Reveal delay={0.2} y={16} className="mt-6">
                <div className="rounded-lg border-l-2 border-gold bg-surface2 p-4">
                  <p className="text-sm leading-relaxed text-mute">{groups.software.note}</p>
                </div>
              </Reveal>
            </TabsContent>

            {/* ── SaaS de gestion ───────────────────────────── */}
            <TabsContent value="saas" className="mt-10">
              <p className="mb-6 max-w-3xl text-sm leading-relaxed text-mute">{groups.saas.sub}</p>
              <Stagger className="grid gap-4 md:grid-cols-2" step={0.08}>
                {SAAS_PRODUCTS.map((p) => {
                  const isHospital = p.slug === "gestion-hospitaliere";
                  const o = p.offers[0];
                  const PIcon = SAAS_ICONS[p.slug] ?? Wallet;
                  return (
                    <StaggerItem key={p.slug}>
                      <div className="card-lift flex h-full items-center gap-4 rounded-xl border border-line bg-surface p-5 transition-colors hover:border-gold/40">
                        <GoldIcon icon={PIcon} size="sm" />
                        <h4 className="min-w-0 flex-1 font-serif text-lg leading-snug">
                          {p.name}
                        </h4>
                        <div className="flex shrink-0 flex-col items-end gap-1.5">
                          {isHospital ? (
                            <Reveal variant="scale" delay={0.2} y={12} duration={0.7}>
                              <p className="font-serif text-xl text-goldtext">
                                {HOSPITAL_RANGE}
                                <span className="font-sans text-xs text-mute">
                                  {" "}
                                  {t("pricing.perMonth")}
                                </span>
                              </p>
                            </Reveal>
                          ) : (
                            <PriceTag offer={o} {...priceProps} size="lg" className="text-right" />
                          )}
                          <GoldButton
                            variant="ghost"
                            magnetic
                            ariaLabel={`${t("pricing.ctaDemo")} — ${p.name}`}
                            onClick={() => {
                              openForm("demo", {
                                subject: "Démo",
                                message: `Je souhaite une démonstration de ${p.name}.`,
                              });
                              trackCta("pricing", p.slug);
                            }}
                          >
                            {t("pricing.ctaDemo")}
                          </GoldButton>
                        </div>
                      </div>
                    </StaggerItem>
                  );
                })}
              </Stagger>

              <Reveal delay={0.2} y={16} className="mt-6">
                <div className="flex flex-col items-start gap-4 rounded-xl border border-gold/30 bg-surface2 p-6 md:flex-row md:items-center">
                  <GoldIcon icon={WorkflowIcon} size="sm" />
                  <div>
                    <h4 className="font-serif text-lg text-ink">{groups.saas.workflowsTitle}</h4>
                    <p className="mt-1 max-w-3xl text-sm leading-relaxed text-mute">
                      {groups.saas.workflowsDesc}
                    </p>
                  </div>
                  <div className="shrink-0 md:ml-auto">
                    <PriceTag
                      offer={{ id: "workflows-quote", name: "Workflows", amount: null, period: "one_time", isQuoteOnly: true }}
                      {...priceProps}
                      className="md:text-right"
                    />
                  </div>
                </div>
              </Reveal>
            </TabsContent>

            {/* ── Community management ──────────────────────── */}
            <TabsContent value="community" className="mt-10">
              <p className="mb-6 max-w-3xl text-sm leading-relaxed text-mute">
                {groups.community.sub}
              </p>
              <Stagger className="grid gap-6 md:grid-cols-2 lg:grid-cols-3" step={0.08}>
                {COMMUNITY_OFFERS.map((offer) => {
                  const card = cardById(groups.community.cards, offer.id);
                  if (!card) return null;
                  return (
                    <StaggerItem key={offer.id} className="h-full">
                      <PriceCard offer={offer} card={card} featured={offer.featured === true} />
                    </StaggerItem>
                  );
                })}
              </Stagger>
              <Reveal delay={0.2} y={16} className="mt-6">
                <div className="rounded-lg border-l-2 border-gold bg-surface2 p-4">
                  <p className="text-sm leading-relaxed text-mute">{groups.community.note}</p>
                </div>
              </Reveal>
            </TabsContent>

            {/* ── Acquisition client ────────────────────────── */}
            <TabsContent value="acquisition" className="mt-10">
              <p className="mb-6 max-w-3xl text-sm leading-relaxed text-mute">
                {groups.acquisition.sub}
              </p>
              <Stagger className="grid gap-6 md:grid-cols-2" step={0.08}>
                {ACQUISITION_OFFERS.map((offer) => {
                  const card = cardById(groups.acquisition.cards, offer.id);
                  if (!card) return null;
                  return (
                    <StaggerItem key={offer.id} className="h-full">
                      <PriceCard offer={offer} card={card} />
                    </StaggerItem>
                  );
                })}
              </Stagger>
              <Reveal delay={0.2} y={16} className="mt-6">
                <div className="rounded-lg border-l-2 border-gold bg-surface2 p-4">
                  <p className="text-sm leading-relaxed text-mute">{groups.acquisition.note}</p>
                </div>
              </Reveal>
            </TabsContent>

            {/* ── Formations ────────────────────────────────── */}
            <TabsContent value="training" className="mt-10">
              <p className="mb-6 max-w-3xl text-sm leading-relaxed text-mute">
                {groups.training.sub}
              </p>
              <Reveal delay={0.12} y={16}>
                <div className="rounded-xl border border-line bg-surface2 p-6 md:p-8">
                  <h4 className="display-3">{groups.training.subjectsTitle}</h4>
                  <Stagger as="ul" className="mt-5 grid gap-x-8 gap-y-3.5 sm:grid-cols-2" step={0.05}>
                    {groups.training.subjects.map((s) => (
                      <StaggerItem key={s} as="li" className="h-full list-none">
                        <IconFeature text={s} as="div" />
                      </StaggerItem>
                    ))}
                  </Stagger>
                </div>
              </Reveal>
              <Stagger className="mt-6 grid gap-6 md:grid-cols-2" step={0.08}>
                {TRAINING_OFFERS.map((offer) => {
                  const card = cardById(groups.training.cards, offer.id);
                  if (!card) return null;
                  return (
                    <StaggerItem key={offer.id} className="h-full">
                      <PriceCard offer={offer} card={card} />
                    </StaggerItem>
                  );
                })}
              </Stagger>
              <Reveal delay={0.2} y={16} className="mt-6">
                <div className="rounded-lg border-l-2 border-gold bg-surface2 p-4">
                  <p className="text-sm leading-relaxed text-mute">{groups.training.note}</p>
                </div>
              </Reveal>
            </TabsContent>
          </Tabs>
        </Reveal>

        {/* ── Note multi-service ─────────────────────────────── */}
        <Reveal delay={0.1} y={20} className="mt-12">
          <div className="rounded-xl border border-line bg-surface2 p-6 text-sm leading-relaxed text-mute">
            {groups.strategy.sub}
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}

export default PricingSection;
