"use client";

import { ArrowRight, Calendar } from "lucide-react";
import { Reveal, Tilt } from "@/components/motion";
import { Container, GoldButton, PriceTag, Section, SectionHeading } from "@/components/site/kit";
import { SAAS_PRODUCTS, type SaasProduct } from "@/lib/catalog";
import { openForm, scrollToSection } from "@/lib/chat-bus";
import { trackCta } from "@/lib/analytics";
import { useI18n } from "@/lib/i18n";

/* Slug produit → clé i18n (saas.items.*) */
const SAAS_KEY: Record<SaasProduct["slug"], string> = {
  "factura-pro": "factura",
  "gestion-comptable": "compta",
  "gestion-hospitaliere": "hosp",
  "gestion-ecole": "school",
  "gestion-immobiliere": "immo",
  "gestion-pharmacie": "pharma",
};

/* Forfait hôpital : bornes exactes du catalogue (1 000 000 → 5 000 000 GNF / mois) */
const HOSPITAL_RANGE = "1 – 5\u00A0000\u00A0000\u00A0GNF";

/** Maquette d'interface 100 % CSS — aucune image. */
function DeviceMockup() {
  return (
    <Tilt className="relative aspect-[16/9] bg-surface2 p-5">
      <div className="flex h-full flex-col overflow-hidden rounded-lg border border-line bg-surface shadow-inner">
        {/* barre de fenêtre */}
        <div aria-hidden className="flex gap-1.5 border-b border-line p-2">
          <span className="h-2 w-2 rounded-full bg-gold" />
          <span className="h-2 w-2 rounded-full bg-line" />
          <span className="h-2 w-2 rounded-full bg-line" />
        </div>
        <div className="flex min-h-0 flex-1">
          {/* barre latérale */}
          <div aria-hidden className="flex w-1/4 flex-col gap-2 border-r border-line p-2">
            <span className="h-1.5 rounded bg-gold/60" />
            <span className="h-1.5 rounded bg-line" />
            <span className="h-1.5 rounded bg-line" />
            <span className="h-1.5 rounded bg-line" />
          </div>
          {/* zone principale */}
          <div aria-hidden className="grid flex-1 grid-cols-2 gap-2 p-3">
            <span className="rounded bg-surface2" />
            <span className="rounded border border-gold/30 bg-gold/15" />
            <span className="rounded bg-surface2" />
            <span className="rounded bg-surface2" />
          </div>
        </div>
      </div>
    </Tilt>
  );
}

export function SaasSection() {
  const { t } = useI18n();

  return (
    <Section id="saas" tone="surface">
      <Container>
        <SectionHeading
          label={t("saas.label")}
          title={t("saas.title")}
          gold={t("saas.tGold")}
          sub={t("saas.sub")}
        />

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {SAAS_PRODUCTS.map((p, i) => {
            const itemKey = `saas.items.${SAAS_KEY[p.slug]}`;
            const isHospital = p.slug === "gestion-hospitaliere";
            const isSchool = p.slug === "gestion-ecole";
            return (
              <Reveal key={p.slug} delay={(i % 3) * 80} className="h-full">
                <article className="card-lift flex h-full flex-col overflow-hidden rounded-xl border border-line bg-bg">
                  <DeviceMockup />

                  <div className="flex flex-1 flex-col p-6">
                    <p className="label-caps">{t(`${itemKey}.tag`)}</p>
                    <h3 className="display-3 mt-2">{p.name}</h3>
                    <p className="mt-2 flex-1 text-sm text-mute">{t(`${itemKey}.desc`)}</p>

                    <div className="mt-4">
                      {isHospital ? (
                        <div>
                          <p className="font-serif text-xl text-goldtext">
                            {HOSPITAL_RANGE}{" "}
                            <span className="font-sans text-xs text-mute">{t("pricing.perMonth")}</span>
                          </p>
                          <p className="mt-1 text-xs text-mute">{t("saas.hospitalNote")}</p>
                        </div>
                      ) : (
                        <>
                          <PriceTag
                            offer={p.offers[0]}
                            fromLabel={t("pricing.fromLabel")}
                            perMonth={t("pricing.perMonth")}
                            perYear={t("pricing.perYear")}
                            quoteLabel={t("pricing.quoteLabel")}
                            billableNote={isSchool ? t("pricing.billableNote") : undefined}
                          />
                          {isSchool && (
                            <p className="mt-1 text-xs text-mute">{t("saas.schoolNote")}</p>
                          )}
                        </>
                      )}
                    </div>

                    <div className="mt-5">
                      <GoldButton
                        variant="outline"
                        ariaLabel={`${t("saas.book")} — ${p.name}`}
                        onClick={() => {
                          openForm("demo", {
                            subject: "Démo",
                            message: `Je souhaite une démonstration de ${p.name}.`,
                          });
                          trackCta("saas", p.slug);
                        }}
                      >
                        <Calendar className="h-4 w-4" strokeWidth={1.25} aria-hidden />
                        {t("saas.book")}
                      </GoldButton>
                    </div>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>

        <div className="mt-10 text-center">
          <GoldButton variant="ghost" onClick={() => scrollToSection("trial")}>
            {t("saas.trial")}
            <ArrowRight className="h-4 w-4" strokeWidth={1.25} aria-hidden />
          </GoldButton>
        </div>
      </Container>
    </Section>
  );
}

export default SaasSection;
