"use client";

import React from "react";
import { PageHero } from "@/components/site/PageHero";
import { FaqSection } from "@/components/site/FaqSection";
import { CtaBanner, PageCrossLinks } from "@/components/site/PageBlocks";
import { Container, Section, SectionHeading } from "@/components/site/kit";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Reveal } from "@/components/motion";
import { useLocalized } from "@/lib/page-content";
import { FAQ } from "@/lib/pages-content/faq";

/**
 * Page /faq — l'accordéon des questions courantes (FaqSection existante)
 * est complété par un bloc de six questions détaillées propres à la page,
 * rendues avec l'accordéon shadcn animé.
 */
export function FaqPage() {
  const c = useLocalized(FAQ);

  return (
    <>
      <PageHero
        label={c.hero.label}
        title={c.hero.title}
        gold={c.hero.gold}
        sub={c.hero.sub}
        chips={c.hero.chips}
        image="/images/headers/header-faq.png"
      />

      {/* Questions courantes (section existante, réutilisée telle quelle) */}
      <FaqSection heading={false} />

      {/* Questions détaillées */}
      <Section id="faq-extra" tone="surface" className="border-t border-line">
        <Container>
          <SectionHeading
            label={c.extra.label}
            title={c.extra.title}
            gold={c.extra.gold}
            sub={c.extra.sub}
          />

          <Reveal className="mx-auto max-w-3xl">
            <Accordion
              type="single"
              collapsible
              className="rounded-xl border border-line bg-bg px-5 md:px-8"
            >
              {c.extra.items.map((item, i) => (
                <AccordionItem
                  key={item.q}
                  value={`faq-extra-${i}`}
                  className="border-line last:border-b-0"
                >
                  <AccordionTrigger className="py-5 text-base font-medium text-ink hover:no-underline data-[state=open]:text-goldtext [&>svg]:shrink-0 [&>svg]:text-gold">
                    {item.q}
                  </AccordionTrigger>
                  <AccordionContent className="pb-5 pr-6 text-sm leading-relaxed text-mute md:pr-10">
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
        primaryLabel={c.cta.primaryLabel}
        primaryHref="/contact"
        secondaryLabel={c.cta.secondaryLabel}
        secondaryHref="/tarifs"
      />

      <PageCrossLinks title={c.crossLinks.title} items={c.crossLinks.items} />
    </>
  );
}
