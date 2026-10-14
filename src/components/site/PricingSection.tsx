"use client";

import { Check } from "lucide-react";
import { Reveal } from "@/components/motion";
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

/** Carte tarif (offres web & logiciels) — la note de bas de page est rendue une seule fois, sous le prix. */
function PriceCard({ offer, featured = false }: { offer: PriceOffer; featured?: boolean }) {
  const { t } = useI18n();
  const { footnote, ...rest } = offer;

  return (
    <div
      className={`flex h-full flex-col rounded-xl border border-line bg-surface p-6 ${
        featured ? "gold-frame lg:-translate-y-2" : ""
      }`}
    >
      <h3 className="label-caps">{offer.name}</h3>
      <div className="mt-4">
        <PriceTag
          offer={rest}
          fromLabel={t("pricing.fromLabel")}
          perMonth={t("pricing.perMonth")}
          perYear={t("pricing.perYear")}
          quoteLabel={t("pricing.quoteLabel")}
        />
      </div>
      {footnote && <p className="mt-3 text-xs text-mute">{footnote}</p>}
      <div aria-hidden className="flex-1" />
      <GoldButton
        variant={featured ? "primary" : "outline"}
        className="mt-6"
        onClick={() => {
          openForm("quote", { subject: `Devis — ${offer.name}` });
          trackCta("pricing", offer.id);
        }}
      >
        {t("pricing.ctaQuote")}
      </GoldButton>
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
            <div className="grid gap-6 lg:grid-cols-3">
              {WEB_OFFERS.map((offer, i) => (
                <Reveal key={offer.id} delay={i * 80} className="h-full">
                  <PriceCard offer={offer} featured={offer.id === "web-dashboard"} />
                </Reveal>
              ))}
            </div>

            <div className="mt-10 flex flex-col items-center justify-between gap-4 rounded-xl border border-gold/30 bg-surface2 p-6 md:flex-row">
              <div>
                <h4 className="font-serif text-xl">{t("pricing.renewalT")}</h4>
                <p className="text-sm text-mute">{t("pricing.renewalD")}</p>
              </div>
              {WEB_RENEWAL.amount !== null && (
                <p className="shrink-0 font-serif text-2xl text-goldtext">
                  {formatGNF(WEB_RENEWAL.amount)}
                  <span className="font-sans text-xs text-mute"> {t("pricing.perYear")}</span>
                </p>
              )}
            </div>

            <div className="mt-4 rounded-xl border border-line bg-surface p-6 md:p-8">
              <h4 className="display-3">{t("pricing.included.t")}</h4>
              <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                {included.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm text-mute">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-gold" strokeWidth={1.25} aria-hidden />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </TabsContent>

          {/* ── Logiciels ─────────────────────────────────── */}
          <TabsContent value="software" className="mt-10">
            <div className="grid gap-6 md:grid-cols-2">
              {SOFTWARE_OFFERS.map((offer, i) => (
                <Reveal key={offer.id} delay={i * 80} className="h-full">
                  <PriceCard offer={offer} />
                </Reveal>
              ))}
            </div>
            <div className="mt-6 rounded-lg border-l-2 border-gold bg-surface2 p-4">
              <p className="text-sm text-mute">{notes[2] ?? ""}</p>
            </div>
          </TabsContent>

          {/* ── SaaS ──────────────────────────────────────── */}
          <TabsContent value="saas" className="mt-10">
            <div className="grid gap-4 md:grid-cols-2">
              {SAAS_PRODUCTS.map((p) => {
                const isHospital = p.slug === "gestion-hospitaliere";
                return (
                  <div
                    key={p.slug}
                    className="flex items-center justify-between gap-4 rounded-xl border border-line bg-surface p-5"
                  >
                    <h4 className="font-serif text-lg">{p.name}</h4>
                    <div className="flex shrink-0 flex-col items-end gap-2">
                      {isHospital ? (
                        <p className="font-serif text-xl text-goldtext">
                          {HOSPITAL_RANGE}
                          <span className="font-sans text-xs text-mute"> {t("pricing.perMonth")}</span>
                        </p>
                      ) : (
                        <PriceTag
                          offer={p.offers[0]}
                          fromLabel={t("pricing.fromLabel")}
                          perMonth={t("pricing.perMonth")}
                          perYear={t("pricing.perYear")}
                          quoteLabel={t("pricing.quoteLabel")}
                        />
                      )}
                      <GoldButton
                        variant="ghost"
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
                );
              })}
            </div>
          </TabsContent>
        </Tabs>

        {/* ── Notes de bas de section ───────────────────── */}
        <div className="mt-12 rounded-xl border border-line bg-surface2 p-6 md:p-8">
          <h4 className="label-caps">{t("pricing.notes.t")}</h4>
          <ul className="mt-4 space-y-3">
            {notes.map((item) => (
              <li key={item} className="flex gap-3 text-sm text-mute">
                <span className="mt-0.5 text-gold" aria-hidden>
                  *
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </Section>
  );
}

export default PricingSection;
