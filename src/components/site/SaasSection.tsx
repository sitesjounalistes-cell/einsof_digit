"use client";

import Image from "next/image";
import { ArrowRight, Images } from "lucide-react";
import {
  Beam,
  DrawRule,
  Reveal,
  SpotlightCard,
} from "@/components/motion";
import { Container, GoldButton, PriceTag, Section, SectionHeading } from "@/components/site/kit";
import { CoverflowCarousel } from "@/components/site/CoverflowCarousel";
import { SAAS_PRODUCTS, type SaasProduct } from "@/lib/catalog";
import { scrollToSection } from "@/lib/chat-bus";
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

/* Visuel produit généré (obsidienne & or) — cohérence sur les cartes. */
const SAAS_IMAGE: Record<SaasProduct["slug"], string> = {
  "factura-pro": "/images/saas/saas-factura.png",
  "gestion-comptable": "/images/saas/saas-compta.png",
  "gestion-hospitaliere": "/images/saas/saas-hosp.png",
  "gestion-ecole": "/images/saas/saas-ecole.png",
  "gestion-immobiliere": "/images/saas/saas-immo.png",
  "gestion-pharmacie": "/images/saas/saas-pharma.png",
};

/* Forfait hôpital : bornes exactes du catalogue (1 000 000 → 5 000 000 GNF / mois) */
const HOSPITAL_RANGE = "1 – 5\u00A0000\u00A0000\u00A0GNF";

export function SaasSection({ heading = true }: { heading?: boolean }) {
  const { t } = useI18n();

  return (
    <Section id="saas" tone="surface">
      <Container>
        {heading && (
          <SectionHeading
            label={t("saas.label")}
            title={t("saas.title")}
            gold={t("saas.tGold")}
            sub={t("saas.sub")}
          />
        )}

        {/* Carrousel coverflow : la carte centrale s'impose, un clic ouvre la page dédiée */}
        <CoverflowCarousel
          ariaLabel={t("saas.title")}
          viewportClassName="h-[560px] sm:h-[600px]"
          items={SAAS_PRODUCTS.map((p) => ({
            key: p.slug,
            href: `/logiciels/${p.slug}`,
            ariaLabel: `${p.name} — ${t("saas.discover")}`,
          }))}
          renderItem={(item, { active }) => {
            const p = SAAS_PRODUCTS.find((x) => x.slug === item.key)!;
            const i = SAAS_PRODUCTS.indexOf(p);
            const itemKey = `saas.items.${SAAS_KEY[p.slug]}`;
            const isHospital = p.slug === "gestion-hospitaliere";
            const isSchool = p.slug === "gestion-ecole";
            const isFeatured = p.offers[0]?.featured === true;
            return (
              <Beam always={active || isFeatured} className="h-full rounded-xl">
                <SpotlightCard className="h-full rounded-xl">
                  <div
                    className={`card-lift group relative flex h-full flex-col overflow-hidden rounded-xl border bg-bg transition-colors duration-500 ${
                      active ? "border-gold/50" : "border-line"
                    }`}
                  >
                    <span
                      aria-hidden
                      className="absolute right-4 top-4 z-10 font-serif text-5xl text-gold opacity-[0.18] transition-opacity duration-500 group-hover:opacity-30"
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>

                    {/* Visuel produit */}
                    <div className="relative aspect-[16/10] shrink-0 overflow-hidden">
                      <Image
                        src={SAAS_IMAGE[p.slug]}
                        alt=""
                        fill
                        sizes="(max-width: 640px) 80vw, 350px"
                        className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
                      />
                      <div
                        aria-hidden
                        className="absolute inset-0 bg-gradient-to-t from-bg via-transparent to-transparent"
                      />
                    </div>

                    <div className="flex flex-1 flex-col p-6">
                      <p className="label-caps">{t(`${itemKey}.tag`)}</p>
                      <h3 className="display-3 mt-2">{p.name}</h3>
                      <p className="mt-2 text-sm text-mute">{t(`${itemKey}.desc`)}</p>

                      <Reveal variant="scale" delay={0.15} className="mt-4">
                        {isHospital ? (
                          <div>
                            <p className="font-serif text-xl text-goldtext">
                              {HOSPITAL_RANGE}{" "}
                              <span className="font-sans text-xs text-mute">
                                {t("pricing.perMonth")}
                              </span>
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
                      </Reveal>

                      <span
                        aria-hidden
                        className="mt-auto inline-flex items-center gap-2 pt-5 text-[0.75rem] font-semibold uppercase tracking-[0.14em] text-goldtext"
                      >
                        {t("saas.discover")}
                        <ArrowRight
                          size={14}
                          strokeWidth={1.5}
                          className="transition-transform duration-300 group-hover:translate-x-1"
                        />
                      </span>
                    </div>
                  </div>
                </SpotlightCard>
              </Beam>
            );
          }}
        />

        <DrawRule className="mt-14 h-px w-full" delay={0.1} />

        <div className="mt-10 flex flex-col items-center gap-3 text-center">
          <GoldButton variant="ghost" onClick={() => scrollToSection("trial")}>
            {t("saas.trial")}
            <ArrowRight className="h-4 w-4" strokeWidth={1.25} aria-hidden />
          </GoldButton>
          <p className="inline-flex items-center gap-2 text-xs text-mute">
            <Images size={14} strokeWidth={1.25} aria-hidden className="text-gold" />
            {t("saas.carouselHint")}
          </p>
        </div>
      </Container>
    </Section>
  );
}

export default SaasSection;
