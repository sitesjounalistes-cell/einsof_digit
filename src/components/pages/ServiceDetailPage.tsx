"use client";

import Link from "next/link";
import { ArrowRight, ArrowUpRight, Check, Sparkles } from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { CtaBanner, PageCrossLinks } from "@/components/site/PageBlocks";
import {
  Container,
  GoldButton,
  Section,
  SectionHeading,
} from "@/components/site/kit";
import {
  Beam,
  DrawRule,
  PopIn,
  Reveal,
  SpotlightCard,
  Stagger,
  StaggerItem,
} from "@/components/motion";
import { useI18n } from "@/lib/i18n";
import { openForm } from "@/lib/chat-bus";
import { trackCta } from "@/lib/analytics";
import {
  ACQUISITION_OFFERS,
  COMMUNITY_OFFERS,
  SAAS_PRODUCTS,
  SOFTWARE_OFFERS,
  TRAINING_OFFERS,
  WEB_OFFERS,
  formatGNF,
  type PriceOffer,
} from "@/lib/catalog";
import { SERVICE_DETAILS, SERVICE_SLUGS, type ServiceSlug } from "@/lib/pages-content/service-details";
import { TARIFS, type TarifCard } from "@/lib/pages-content/tarifs";
import { PriceCard, RenewalsAddonBand } from "@/components/site/PricingSection";
import { GoldIcon, IconFeature, featureIconFor } from "@/components/site/icons";
import { useLocalized } from "@/lib/page-content";

/**
 * Page de détail d'un pôle /services/[slug] :
 * bandeau (visuel du pôle) > vue d'ensemble + points-clés > inclus >
 * méthode > pour qui > bande tarifaire (catalogue officiel §19) >
 * appel à l'action > liens vers les autres pôles.
 */
export function ServiceDetailPage({ slug }: { slug: ServiceSlug }) {
  const { t, lang } = useI18n();
  const d = (SERVICE_DETAILS[lang] ?? SERVICE_DETAILS.fr)[slug];
  const tarifs = useLocalized(TARIFS);
  const labelFor = (other: ServiceSlug) =>
    (SERVICE_DETAILS[lang] ?? SERVICE_DETAILS.fr)[other].name;

  /* Bande tarifaire selon la référence catalogue du pôle — les cartes
     détaillées (titre, description, points) viennent du contenu localisé
     de la page tarifs ; les montants viennent du catalogue officiel. */
  const priceStrip = () => {
    const stripCard = (
      groupId: "web" | "software" | "community" | "acquisition" | "training",
      offer: PriceOffer,
      featured = false
    ) => {
      const group = tarifs.groups[groupId] as { cards?: TarifCard[] };
      const card = group.cards?.find((x) => x.id === offer.id);
      if (!card) return null;
      return <PriceCard offer={offer} card={card} featured={featured} />;
    };

    if (d.priceRef === "web") {
      return (
        <>
          <Stagger className="grid gap-5 md:grid-cols-3" step={0.09}>
            {WEB_OFFERS.map((offer) => (
              <StaggerItem key={offer.id} className="h-full">
                {stripCard("web", offer, offer.featured === true)}
              </StaggerItem>
            ))}
          </Stagger>
          <div className="mt-8">
            <RenewalsAddonBand />
          </div>
        </>
      );
    }
    if (d.priceRef === "software") {
      return (
        <Stagger className="grid gap-5 md:grid-cols-3" step={0.09}>
          {SOFTWARE_OFFERS.map((offer) => (
            <StaggerItem key={offer.id} className="h-full">
              {stripCard("software", offer)}
            </StaggerItem>
          ))}
        </Stagger>
      );
    }
    if (d.priceRef === "saas") {
      return (
        <Stagger className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" step={0.06}>
          {SAAS_PRODUCTS.map((p) => {
            const o = p.offers[0];
            const isQuote = o.amount === null || o.isQuoteOnly === true;
            const period = o.period === "month" ? t("pricing.perMonth") : t("pricing.perYear");
            return (
              <StaggerItem key={p.slug} className="h-full">
                <Link
                  href={`/logiciels/${p.slug}`}
                  className="card-lift group flex h-full items-center justify-between gap-4 rounded-xl border border-line bg-bg p-5 transition-colors hover:border-gold/50 focus-visible:outline focus-visible:outline-1 focus-visible:outline-gold"
                >
                  <div>
                    <p className="font-serif text-base font-semibold text-ink group-hover:text-goldlight">
                      {p.name}
                    </p>
                    <p className="mt-1 text-sm text-goldtext">
                      {isQuote
                        ? t("pricing.quoteLabel")
                        : `${o.isFrom ? `${t("common.from")} ` : ""}${formatGNF(o.amount ?? 0)}`}
                      {!isQuote && <span className="text-xs text-mute"> {period}</span>}
                    </p>
                  </div>
                  <ArrowUpRight
                    size={18}
                    strokeWidth={1.25}
                    aria-hidden
                    className="shrink-0 text-gold transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  />
                </Link>
              </StaggerItem>
            );
          })}
        </Stagger>
      );
    }
    if (d.priceRef === "community") {
      return (
        <Stagger className="grid gap-5 md:grid-cols-3" step={0.09}>
          {COMMUNITY_OFFERS.map((offer) => (
            <StaggerItem key={offer.id} className="h-full">
              {stripCard("community", offer, offer.featured === true)}
            </StaggerItem>
          ))}
        </Stagger>
      );
    }
    if (d.priceRef === "acquisition") {
      return (
        <Stagger className="grid gap-5 md:grid-cols-2" step={0.09}>
          {ACQUISITION_OFFERS.map((offer) => (
            <StaggerItem key={offer.id} className="h-full">
              {stripCard("acquisition", offer)}
            </StaggerItem>
          ))}
        </Stagger>
      );
    }
    if (d.priceRef === "training") {
      return (
        <Stagger className="grid gap-5 md:grid-cols-2" step={0.09}>
          {TRAINING_OFFERS.map((offer) => (
            <StaggerItem key={offer.id} className="h-full">
              {stripCard("training", offer)}
            </StaggerItem>
          ))}
        </Stagger>
      );
    }
    return (
      <Reveal variant="scale">
        <div className="rounded-xl border border-gold/30 bg-bg p-8 text-center">
          <PopIn>
            <Sparkles size={22} strokeWidth={1.25} aria-hidden className="mx-auto text-gold" />
          </PopIn>
          <p className="font-serif mt-3 text-xl text-goldtext">{t("pricing.quoteLabel")}</p>
          <p className="mx-auto mt-2 max-w-xl text-sm leading-relaxed text-mute">{d.priceNote}</p>
        </div>
      </Reveal>
    );
  };

  return (
    <>
      <PageHero
        label={d.hero.label}
        title={d.hero.title}
        gold={d.hero.gold}
        sub={d.hero.sub}
        chips={d.hero.chips}
        image={d.image}
        parent={{ label: t("nav.services"), href: "/services" }}
      />

      {/* ── Vue d'ensemble + points-clés ─────────────────────────── */}
      <Section id={`${slug}-overview`}>
        <Container>
          <SectionHeading
            label={d.overview.label}
            title={d.overview.title}
            gold={d.overview.gold}
          />
          <div className="grid gap-10 lg:grid-cols-[1fr_340px] lg:gap-14">
            <div className="space-y-5">
              {d.overview.paragraphs.map((p, i) => (
                <Reveal key={i} y={22} delay={i * 0.1}>
                  <p className="text-[0.9375rem] leading-relaxed text-mute md:text-base">{p}</p>
                </Reveal>
              ))}
              <Reveal delay={0.2}>
                <GoldButton
                  variant="outline"
                  className="mt-3"
                  onClick={() => {
                    openForm("quote", { subject: d.name });
                    trackCta("service-detail", slug);
                  }}
                >
                  {d.cta.primaryLabel}
                  <ArrowRight size={15} strokeWidth={1.5} aria-hidden />
                </GoldButton>
              </Reveal>
            </div>

            {/* Points-clés (carte latérale collante) */}
            <Reveal variant="left" delay={0.15}>
              <aside className="lg:sticky lg:top-28">
                <Beam always className="rounded-xl">
                  <div className="rounded-xl border border-line bg-surface p-6">
                    <p className="label-caps mb-5">{t("services.detail.factsLabel")}</p>
                    <dl className="space-y-4">
                      {d.overview.facts.map((f) => (
                        <div key={f.k} className="border-l-2 border-gold/60 pl-4">
                          <dt className="text-[0.6875rem] font-medium uppercase tracking-[0.14em] text-mute">
                            {f.k}
                          </dt>
                          <dd className="mt-1 text-sm font-medium text-ink">{f.v}</dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                </Beam>
              </aside>
            </Reveal>
          </div>
        </Container>
      </Section>

      {/* ── Ce qui est inclus ────────────────────────────────────── */}
      <Section id={`${slug}-included`} tone="surface">
        <Container>
          <SectionHeading
            label={d.included.label}
            title={d.included.title}
            gold={d.included.gold}
          />
          <Stagger as="ul" className="grid gap-x-6 gap-y-4 sm:grid-cols-2" step={0.05}>
            {d.included.items.map((item, i) => (
              <StaggerItem key={item} as="li" y={18} className="h-full list-none">
                <div className="h-full rounded-lg border border-line/60 bg-bg px-4 py-3.5">
                  <PopIn delay={i * 0.04}>
                    <IconFeature text={item} as="div" />
                  </PopIn>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </Container>
      </Section>

      {/* ── Méthode : 4 étapes ───────────────────────────────────── */}
      <Section id={`${slug}-process`}>
        <Container>
          <SectionHeading
            label={d.process.label}
            title={d.process.title}
            gold={d.process.gold}
          />
          <DrawRule className="h-px w-full" delay={0.1} />
          <Stagger className="mt-10 grid gap-8 md:grid-cols-2 lg:grid-cols-4" step={0.1}>
            {d.process.steps.map((s) => (
              <StaggerItem key={s.k} y={24}>
                <div className="group h-full">
                  <p className="font-serif text-5xl text-gold opacity-25 transition-opacity duration-500 group-hover:opacity-60">
                    {s.k}
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-mute">{s.t}</p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </Container>
      </Section>

      {/* ── Pour qui ─────────────────────────────────────────────── */}
      <Section id={`${slug}-audience`} tone="surface">
        <Container>
          <SectionHeading
            label={d.audience.label}
            title={d.audience.title}
            gold={d.audience.gold}
          />
          <Stagger className="grid gap-6 md:grid-cols-3" step={0.09}>
            {d.audience.items.map((a) => {
              const AIcon = featureIconFor(`${a.k} ${a.d}`);
              return (
                <StaggerItem key={a.k} className="h-full">
                  <SpotlightCard className="h-full rounded-xl">
                    <Beam className="h-full rounded-xl">
                      <article className="card-lift h-full rounded-xl border border-line bg-bg p-6">
                        <GoldIcon icon={AIcon} size="md" />
                        <h3 className="mt-4 font-serif text-lg font-semibold leading-snug text-ink">
                          {a.k}
                        </h3>
                        <p className="mt-2.5 text-sm leading-relaxed text-mute">{a.d}</p>
                      </article>
                    </Beam>
                  </SpotlightCard>
                </StaggerItem>
              );
            })}
          </Stagger>
        </Container>
      </Section>

      {/* ── Bande tarifaire (catalogue officiel) ─────────────────── */}
      <Section id={`${slug}-pricing`} tone="deep">
        <Container>
          <SectionHeading
            label={t("pricing.label")}
            title={t("pricing.title")}
            gold={t("pricing.tGold")}
            sub={d.priceNote}
          />
          {priceStrip()}
        </Container>
      </Section>

      <CtaBanner
        title={d.cta.title}
        gold={d.cta.gold}
        sub={d.cta.sub}
        primaryLabel={d.cta.primaryLabel}
        primaryHref="/contact"
        secondaryLabel={d.cta.secondaryLabel}
        secondaryHref="/tarifs"
      />

      {/* Liens vers les autres pôles */}
      <PageCrossLinks
        title={t("services.detail.otherServices")}
        items={SERVICE_SLUGS.filter((s) => s !== slug).map((s) => ({
          href: `/services/${s}`,
          title: labelFor(s),
          desc: (SERVICE_DETAILS[lang] ?? SERVICE_DETAILS.fr)[s].hero.sub,
        }))}
      />
    </>
  );
}
