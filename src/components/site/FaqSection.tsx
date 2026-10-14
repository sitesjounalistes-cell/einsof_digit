"use client";

import { Reveal } from "@/components/motion";
import { Container, Section, SectionHeading } from "@/components/site/kit";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useI18n } from "@/lib/i18n";

export function FaqSection() {
  const { t, tr } = useI18n();
  const items = tr<{ q: string; a: string }[]>("faq.items") ?? [];

  return (
    <Section id="faq" tone="surface">
      <Container>
        <SectionHeading
          label={t("faq.label")}
          title={t("faq.title")}
          gold={t("faq.tGold")}
          sub={t("faq.sub")}
        />

        <Accordion type="single" collapsible className="mx-auto max-w-3xl">
          {items.map((item, i) => (
            <Reveal
              key={item.q}
              delay={i * 60}
              className="border-b border-line last:border-b-0"
            >
              <AccordionItem value={`faq-${i}`} className="border-b-0">
                <AccordionTrigger className="text-left font-medium text-ink text-base hover:text-goldtext hover:no-underline md:text-lg">
                  {item.q}
                </AccordionTrigger>
                <AccordionContent className="text-mute leading-relaxed">
                  {item.a}
                </AccordionContent>
              </AccordionItem>
            </Reveal>
          ))}
        </Accordion>
      </Container>
    </Section>
  );
}

export default FaqSection;
