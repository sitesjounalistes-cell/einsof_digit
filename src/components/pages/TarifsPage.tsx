"use client";

import { PageHero } from "@/components/site/PageHero";
import { CtaBanner, PageCrossLinks } from "@/components/site/PageBlocks";
import { PricingSection } from "@/components/site/PricingSection";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Container, Section, SectionHeading } from "@/components/site/kit";
import { Reveal } from "@/components/motion";
import { useLocalized } from "@/lib/page-content";
import { TARIFS } from "@/lib/pages-content/tarifs";

/**
 * Page /tarifs — tous les prix officiels de l'agence, organisés PAR SERVICE
 * (sites web, logiciels & applications, SaaS de gestion, community management,
 * acquisition client, formations) pour une lecture sans confusion.
 * Composition : PageHero > PricingSection (6 onglets détaillés) > mini-FAQ
 * > CtaBanner > liens croisés.
 * Aucun montant n'est écrit ici : tout vient de src/lib/catalog.ts via PriceTag.
 */
export function TarifsPage() {
  const c = useLocalized(TARIFS);

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
