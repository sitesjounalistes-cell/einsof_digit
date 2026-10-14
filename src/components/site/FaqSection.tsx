"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { motion } from "framer-motion";
import { CollapseMotion, EASE, Stagger, StaggerItem } from "@/components/motion";
import { useMotionMode } from "@/components/providers";
import { Container, Section, SectionHeading } from "@/components/site/kit";
import { useI18n } from "@/lib/i18n";

export function FaqSection() {
  const { t, tr } = useI18n();
  const { lightMode } = useMotionMode();
  const [open, setOpen] = useState<number | null>(null);
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

        {/* Accordéon custom : chevron rotatif + panneau à hauteur animée */}
        <Stagger className="mx-auto max-w-3xl" step={0.07}>
          {items.map((item, i) => {
            const isOpen = open === i;
            return (
              <StaggerItem key={item.q} className="border-b border-line last:border-b-0">
                <h3>
                  <button
                    type="button"
                    id={`faq-question-${i}`}
                    aria-expanded={isOpen}
                    aria-controls={`faq-answer-${i}`}
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="group flex w-full cursor-pointer items-center justify-between gap-4 py-5 text-left"
                  >
                    <span
                      className={`text-base font-medium transition-all duration-300 ease-out group-hover:translate-x-1 group-hover:text-goldtext md:text-lg ${
                        isOpen ? "text-goldtext" : "text-ink"
                      }`}
                    >
                      {item.q}
                    </span>
                    {lightMode ? (
                      <ChevronDown
                        aria-hidden
                        className={`h-4 w-4 shrink-0 text-gold transition-transform duration-300 ${
                          isOpen ? "rotate-180" : ""
                        }`}
                      />
                    ) : (
                      <motion.span
                        aria-hidden
                        className="block shrink-0 text-gold"
                        animate={{ rotate: isOpen ? 180 : 0 }}
                        transition={{ duration: 0.4, ease: EASE }}
                      >
                        <ChevronDown className="h-4 w-4" />
                      </motion.span>
                    )}
                  </button>
                </h3>
                <CollapseMotion open={isOpen}>
                  <div
                    id={`faq-answer-${i}`}
                    role="region"
                    aria-labelledby={`faq-question-${i}`}
                    aria-hidden={!isOpen}
                    className="pb-5 pr-8"
                  >
                    <p className="leading-relaxed text-mute">{item.a}</p>
                  </div>
                </CollapseMotion>
              </StaggerItem>
            );
          })}
        </Stagger>
      </Container>
    </Section>
  );
}

export default FaqSection;
