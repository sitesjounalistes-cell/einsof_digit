"use client";

import { Check, Sparkles } from "lucide-react";
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

const tabsTriggerCls =
  "rounded-md px-4 py-2 text-[0.8125rem] uppercase tracking-[0.1em] text-mute dark:text-mute data-[state=active]:bg-surface dark:data-[state=active]:bg-surface data-[state=active]:text-goldtext dark:data-[state=active]:text-goldtext sm:px-5 sm:text-sm";

/** Carte tarif riche : titre + description + points détaillés (localisés)
 *  + prix rendu par PriceTag depuis le catalogue officiel.
 *  Chorégraphie : Tilt léger > SpotlightCard (halo curseur) > Beam (bordure or). */
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
              <h3 className="label-caps">{card.title}</h3>
              <p className="mt-2.5 text-sm leading-relaxed text-mute">{card.desc}</p>
              {card.features.length > 0 && (
                <ul className="mt-4 space-y-2.5">
                  {card.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm leading-relaxed text-mute">
                      <Check
                        className="mt-0.5 h-4 w-4 shrink-0 text-gold"
                        strokeWidth={1.25}
                        aria-hidden
                      />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              )}
              <Reveal variant="scale" delay={0.2} y={12} duration={0.7} className="mt-5">
                <PriceTag
                  offer={offer}
                  fromLabel={t("pricing.fromLabel")}
                  perMonth={t("pricing.perMonth")}
                  perYear={t("pricing.perYear")}
                  quoteLabel={t("pricing.quoteLabel")}
                />
              </Reveal>
              {/* note : la note de bas d'offre (footnote) est rendue une seule
                  fois par PriceTag — aucun doublon ici */}
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

/** Bande « renouvellements annuels » + option paiement — titres localisés,
 *  montants rendus par PriceTag depuis le catalogue.
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
                  <div>
                    <p className="font-serif text-lg text-ink">{r.title}</p>
                    <p className="mt-1 text-sm leading-relaxed text-mute">{r.desc}</p>
                  </div>
                  <Reveal variant="scale" delay={0.2} y={12} duration={0.7} className="shrink-0">
                    <PriceTag offer={offer} {...priceProps} className="sm:text-right" />
                  </Reveal>
                </div>
              </StaggerItem>
            );
          })}
        </Stagger>
      </Reveal>

      <Reveal delay={0.18} y={20} className="mt-4">
        <div className="flex flex-col items-start justify-between gap-4 rounded-xl border border-line bg-surface p-6 md:flex-row md:items-center">
          <div>
            <h4 className="font-serif text-lg text-ink">{web.addon.title}</h4>
            <p className="mt-1 max-w-2xl text-sm leading-relaxed text-mute">{web.addon.desc}</p>
          </div>
          <Reveal variant="scale" delay={0.2} y={12} duration={0.7} className="shrink-0">
            <PriceTag offer={addonOffer} {...priceProps} className="md:text-right" />
          </Reveal>
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
                  <Stagger className="mt-4" step={0.05}>
                    <ul className="space-y-3">
                      {groups.web.options.map((item) => (
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

              <Reveal delay={0.22} y={20} className="mt-4">
                <div className="rounded-xl border border-line bg-surface2 p-6 md:p-8">
                  <h4 className="display-3">{groups.web.includedTitle}</h4>
                  <Stagger className="mt-4" step={0.05}>
                    <ul className="grid gap-3 sm:grid-cols-2">
                      {groups.web.included.map((item) => (
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

              <Reveal delay={0.24} y={20} className="mt-4">
                <div className="rounded-xl border-l-2 border-gold bg-surface p-6 md:p-8">
                  <h4 className="label-caps">{groups.web.notesTitle}</h4>
                  <Stagger className="mt-4" step={0.05}>
                    <ul className="space-y-3">
                      {groups.web.notes.map((item) => (
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
                  return (
                    <StaggerItem key={p.slug}>
                      <div className="card-lift flex h-full items-center justify-between gap-4 rounded-xl border border-line bg-surface p-5">
                        <h4 className="font-serif text-lg">{p.name}</h4>
                        <div className="flex shrink-0 flex-col items-end gap-2">
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
                            <Reveal variant="scale" delay={0.2} y={12} duration={0.7}>
                              <PriceTag offer={o} {...priceProps} />
                            </Reveal>
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
                  <Sparkles size={20} strokeWidth={1.25} aria-hidden className="shrink-0 text-gold" />
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
                  <Stagger className="mt-4" step={0.05}>
                    <ul className="grid gap-3 sm:grid-cols-2">
                      {groups.training.subjects.map((s) => (
                        <li key={s}>
                          <StaggerItem className="flex items-start gap-2.5 text-sm leading-relaxed text-mute">
                            <Check
                              className="mt-0.5 h-4 w-4 shrink-0 text-gold"
                              strokeWidth={1.25}
                              aria-hidden
                            />
                            {s}
                          </StaggerItem>
                        </li>
                      ))}
                    </ul>
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
