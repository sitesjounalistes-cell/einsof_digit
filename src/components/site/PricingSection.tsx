"use client";

import { Check } from "lucide-react";
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
  formatGNF,
  SAAS_PRODUCTS,
  SOFTWARE_OFFERS,
  WEB_OFFERS,
  WEB_RENEWAL,
  type PriceOffer,
} from "@/lib/catalog";
import { openForm } from "@/lib/chat-bus";
import { trackCta } from "@/lib/analytics";
import { useI18n } from "@/lib/i18n";

/* Forfait hôpital : bornes exactes du catalogue (1 000 000 → 5 000 000 GNF / mois) */
const HOSPITAL_RANGE = "1 – 5\u00A0000\u00A0000\u00A0GNF";

const tabsTriggerCls =
  "rounded-md px-5 py-2 text-sm uppercase tracking-[0.12em] text-mute dark:text-mute data-[state=active]:bg-surface dark:data-[state=active]:bg-surface data-[state=active]:text-goldtext dark:data-[state=active]:text-goldtext";

/** Carte tarif (offres web & logiciels) — la note de bas de page est rendue une seule fois, sous le prix.
 *  Chorégraphie : Tilt léger > SpotlightCard (halo curseur) > Beam (bordure or) ; le prix « pop » en scale. */
function PriceCard({ offer, featured = false }: { offer: PriceOffer; featured?: boolean }) {
  const { t } = useI18n();
  const { footnote, ...rest } = offer;

  return (
    <div className={`h-full ${featured ? "md:scale-[1.02]" : ""}`}>
      <Tilt max={4} className="h-full">
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
              <h3 className="label-caps">{offer.name}</h3>
              <Reveal variant="scale" delay={0.2} y={12} duration={0.7} className="mt-4">
                <PriceTag
                  offer={rest}
                  fromLabel={t("pricing.fromLabel")}
                  perMonth={t("pricing.perMonth")}
                  perYear={t("pricing.perYear")}
                  quoteLabel={t("pricing.quoteLabel")}
                />
              </Reveal>
              {footnote && <p className="mt-3 text-xs text-mute">{footnote}</p>}
              <div aria-hidden className="flex-1" />
              <GoldButton
                variant={featured ? "primary" : "outline"}
                magnetic
                className="mt-6"
                onClick={() => {
                  openForm("quote", { subject: `Devis — ${offer.name}` });
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

export function PricingSection() {
  const { t, tr } = useI18n();
  const included = tr<string[]>("pricing.included.items") ?? [];
  const notes = tr<string[]>("pricing.notes.items") ?? [];

  return (
    <Section id="pricing">
      <Container>
        <SectionHeading
          label={t("pricing.label")}
          title={t("pricing.title")}
          gold={t("pricing.tGold")}
          sub={t("pricing.sub")}
        />

        <Reveal delay={0.1} y={20}>
          <Tabs defaultValue="web">
            <TabsList className="h-auto rounded-lg border border-line bg-transparent p-1">
              <TabsTrigger value="web" className={tabsTriggerCls}>
                {t("pricing.tabs.web")}
              </TabsTrigger>
              <TabsTrigger value="software" className={tabsTriggerCls}>
                {t("pricing.tabs.software")}
              </TabsTrigger>
              <TabsTrigger value="saas" className={tabsTriggerCls}>
                {t("pricing.tabs.saas")}
              </TabsTrigger>
            </TabsList>

            {/* ── Sites web ─────────────────────────────────── */}
            <TabsContent value="web" className="mt-10">
              <Stagger className="grid gap-6 lg:grid-cols-3" step={0.08}>
                {WEB_OFFERS.map((offer) => (
                  <StaggerItem key={offer.id} className="h-full">
                    <PriceCard offer={offer} featured={offer.id === "web-dashboard"} />
                  </StaggerItem>
                ))}
              </Stagger>

              <Reveal delay={0.15} y={20} className="mt-10">
                <div className="flex flex-col items-center justify-between gap-4 rounded-xl border border-gold/30 bg-surface2 p-6 md:flex-row">
                  <div>
                    <h4 className="font-serif text-xl">{t("pricing.renewalT")}</h4>
                    <p className="text-sm text-mute">{t("pricing.renewalD")}</p>
                  </div>
                  {WEB_RENEWAL.amount !== null && (
                    <Reveal variant="scale" delay={0.2} y={12} duration={0.7} className="shrink-0">
                      <p className="font-serif text-2xl text-goldtext">
                        {formatGNF(WEB_RENEWAL.amount)}
                        <span className="font-sans text-xs text-mute"> {t("pricing.perYear")}</span>
                      </p>
                    </Reveal>
                  )}
                </div>
              </Reveal>

              <Reveal delay={0.2} y={20} className="mt-4">
                <div className="rounded-xl border border-line bg-surface p-6 md:p-8">
                  <h4 className="display-3">{t("pricing.included.t")}</h4>
                  <Stagger className="mt-4" step={0.05}>
                    <ul className="grid gap-3 sm:grid-cols-2">
                      {included.map((item) => (
                        <li key={item}>
                          <StaggerItem className="flex items-start gap-2.5 text-sm text-mute">
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
            </TabsContent>

            {/* ── Logiciels ─────────────────────────────────── */}
            <TabsContent value="software" className="mt-10">
              <Stagger className="grid gap-6 md:grid-cols-2" step={0.08}>
                {SOFTWARE_OFFERS.map((offer) => (
                  <StaggerItem key={offer.id} className="h-full">
                    <PriceCard offer={offer} />
                  </StaggerItem>
                ))}
              </Stagger>
              <Reveal delay={0.2} y={16} className="mt-6">
                <div className="rounded-lg border-l-2 border-gold bg-surface2 p-4">
                  <p className="text-sm text-mute">{notes[2] ?? ""}</p>
                </div>
              </Reveal>
            </TabsContent>

            {/* ── SaaS ──────────────────────────────────────── */}
            <TabsContent value="saas" className="mt-10">
              <Stagger className="grid gap-4 md:grid-cols-2" step={0.08}>
                {SAAS_PRODUCTS.map((p) => {
                  const isHospital = p.slug === "gestion-hospitaliere";
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
                              <PriceTag
                                offer={p.offers[0]}
                                fromLabel={t("pricing.fromLabel")}
                                perMonth={t("pricing.perMonth")}
                                perYear={t("pricing.perYear")}
                                quoteLabel={t("pricing.quoteLabel")}
                              />
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
            </TabsContent>
          </Tabs>
        </Reveal>

        {/* ── Notes de bas de section ───────────────────── */}
        <Reveal delay={0.1} y={20} className="mt-12">
          <div className="rounded-xl border border-line bg-surface2 p-6 md:p-8">
            <h4 className="label-caps">{t("pricing.notes.t")}</h4>
            <Stagger className="mt-4" step={0.05}>
              <ul className="space-y-3">
                {notes.map((item) => (
                  <li key={item}>
                    <StaggerItem className="flex gap-3 text-sm text-mute">
                      <span className="mt-0.5 text-gold" aria-hidden>
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
  );
}

export default PricingSection;
