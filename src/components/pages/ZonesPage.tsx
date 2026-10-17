"use client";

import { Globe, MapPin, Navigation } from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { CtaBanner, PageCrossLinks } from "@/components/site/PageBlocks";
import { Container, GoldBadge, GoldButton, Section, SectionHeading } from "@/components/site/kit";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Beam, Reveal, SpotlightCard, Stagger, StaggerItem } from "@/components/motion";
import { useLocalized } from "@/lib/page-content";
import { ZONES_PAGE } from "@/lib/pages-content/zones";
import { ZONES as SEO_ZONES } from "@/lib/seo";
import { openForm } from "@/lib/chat-bus";
import { trackCta } from "@/lib/analytics";

/**
 * Page /zones — « Agence digitale partout en Guinée ».
 * SEO local : Conakry + quartiers, les 8 régions administratives et
 * leurs villes, la diaspora guinéenne — suivi à distance inclus.
 */
export function ZonesPage() {
  const c = useLocalized(ZONES_PAGE);

  /** CTA devis : tracking + préremplissage du formulaire /contact. */
  function handleQuote(subject: string, buttonId: string) {
    trackCta("zones", buttonId);
    openForm("quote", { subject });
  }

  return (
    <>
      <PageHero
        label={c.hero.label}
        title={c.hero.title}
        gold={c.hero.gold}
        sub={c.hero.sub}
        chips={c.hero.chips}
        image="/images/headers/header-services.png"
      />

      {/* Intro SEO : couverture nationale + organisation à distance */}
      <Section id="zones-intro">
        <Container>
          <Reveal y={16} duration={0.7}>
            <div className="mx-auto max-w-3xl space-y-5">
              <p className="text-lg leading-relaxed text-mute">{c.intro.p1}</p>
              <p className="text-lg leading-relaxed text-mute">{c.intro.p2}</p>
            </div>
          </Reveal>
          <Reveal delay={0.15} y={14} duration={0.7}>
            <p className="label-caps mt-12 text-center">{c.intro.naturellesLabel}</p>
            <div className="mt-4 flex flex-wrap justify-center gap-3">
              {SEO_ZONES.naturelles.map((n) => (
                <GoldBadge key={n} className="px-4 py-2 text-[0.75rem]">
                  {n}
                </GoldBadge>
              ))}
            </div>
          </Reveal>
        </Container>
      </Section>

      {/* Conakry — la capitale, quartiers desservis */}
      <Section id="zones-conakry" tone="surface" className="border-y border-line">
        <Container>
          <div className="grid items-start gap-10 lg:grid-cols-2 lg:gap-14">
            <SectionHeading
              label={c.capitale.label}
              title={c.capitale.title}
              gold={c.capitale.gold}
              sub={c.capitale.text}
            />
            <Reveal delay={0.2} y={26} duration={0.8} className="h-full">
              <Beam className="h-full rounded-xl">
                <div className="flex h-full flex-col rounded-xl border border-gold/30 bg-bg p-6">
                  <div className="flex items-center gap-3">
                    <span
                      aria-hidden
                      className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-gold/40 text-gold"
                    >
                      <Navigation size={18} strokeWidth={1.25} />
                    </span>
                    <p className="label-caps">{c.capitale.quartiersLabel}</p>
                  </div>
                  <ul className="mt-5 flex flex-wrap gap-2.5">
                    {SEO_ZONES.quartiers.map((q) => (
                      <li key={q}>
                        <GoldBadge className="px-3.5 py-1.5 text-[0.6875rem]">{q}</GoldBadge>
                      </li>
                    ))}
                  </ul>
                  <p className="mt-5 text-sm leading-relaxed text-mute">{c.capitale.note}</p>
                  <div className="mt-6 flex-1" />
                  <GoldButton
                    variant="outline"
                    onClick={() => handleQuote("Projet web — Conakry", "conakry-quote")}
                    ariaLabel={c.capitale.ctaLabel}
                  >
                    {c.capitale.ctaLabel}
                  </GoldButton>
                </div>
              </Beam>
            </Reveal>
          </div>
        </Container>
      </Section>

      {/* Les 8 régions administratives + villes desservies */}
      <Section id="zones-regions">
        <Container>
          <SectionHeading
            label={c.regions.label}
            title={c.regions.title}
            gold={c.regions.gold}
            sub={c.regions.sub}
          />

          <Stagger className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4" step={0.06}>
            {c.regions.items.map((region) => (
              <StaggerItem key={region.name} y={30} className="h-full">
                <SpotlightCard className="h-full rounded-xl">
                  <article
                    className={`card-lift flex h-full flex-col rounded-xl border bg-surface p-6 ${
                      region.name === "Conakry" ? "border-gold/40" : "border-line"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        aria-hidden
                        className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-gold/40 text-gold"
                      >
                        <MapPin size={18} strokeWidth={1.25} />
                      </span>
                      <h3 className="font-serif text-xl leading-snug text-ink">{region.name}</h3>
                    </div>

                    <ul className="mt-4 space-y-1.5">
                      {region.cities.map((city) => (
                        <li key={city} className="flex items-start gap-2.5 text-sm text-ink">
                          <span
                            aria-hidden
                            className="mt-[0.5rem] h-1 w-1 shrink-0 rounded-full bg-gold"
                          />
                          {city}
                        </li>
                      ))}
                    </ul>

                    <div className="mt-5 flex-1 border-t border-line pt-4">
                      <p className="label-caps">{c.regions.howLabel}</p>
                      <p className="mt-2 text-sm leading-relaxed text-mute">{region.how}</p>
                    </div>
                  </article>
                </SpotlightCard>
              </StaggerItem>
            ))}
          </Stagger>
        </Container>
      </Section>

      {/* Diaspora guinéenne & Afrique francophone */}
      <Section id="zones-diaspora" tone="surface" className="border-y border-line">
        <Container>
          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
            <SectionHeading
              label={c.diaspora.label}
              title={c.diaspora.title}
              gold={c.diaspora.gold}
            />
            <Reveal delay={0.2} y={26} duration={0.8}>
              <Beam className="h-full rounded-xl">
                <div className="flex h-full flex-col rounded-xl border border-gold/30 bg-bg p-6 md:p-8">
                  <span
                    aria-hidden
                    className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-gold/40 text-gold"
                  >
                    <Globe size={18} strokeWidth={1.25} />
                  </span>
                  <p className="mt-5 leading-relaxed text-mute">{c.diaspora.text}</p>
                  <ul className="mt-5 flex flex-wrap gap-2.5">
                    {SEO_ZONES.diaspora.map((d) => (
                      <li key={d}>
                        <GoldBadge className="px-3.5 py-1.5 text-[0.6875rem]">{d}</GoldBadge>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-7 flex-1" />
                  <GoldButton
                    onClick={() => handleQuote("Projet diaspora — suivi à distance", "diaspora-quote")}
                    ariaLabel={c.diaspora.ctaLabel}
                  >
                    {c.diaspora.ctaLabel}
                  </GoldButton>
                </div>
              </Beam>
            </Reveal>
          </div>
        </Container>
      </Section>

      {/* FAQ longue traîne locale (accordéon shadcn) */}
      <Section id="zones-faq">
        <Container>
          <SectionHeading
            align="center"
            label={c.faq.label}
            title={c.faq.title}
            gold={c.faq.gold}
            sub={c.faq.sub}
          />
          <Reveal y={18} duration={0.7}>
            <Accordion
              type="single"
              collapsible
              className="mx-auto max-w-3xl border-t border-line"
            >
              {c.faq.items.map((item, i) => (
                <AccordionItem
                  key={item.q}
                  value={`zone-q-${i}`}
                  className="border-b border-line"
                >
                  <AccordionTrigger className="text-left text-base font-medium text-ink hover:no-underline hover:text-goldtext md:text-lg [&>svg]:text-gold">
                    {item.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-mute">
                    <p className="leading-relaxed">{item.a}</p>
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
        secondaryHref="/tarifs"
      />

      <PageCrossLinks title={c.crossLinks.title} items={c.crossLinks.items} />
    </>
  );
}
