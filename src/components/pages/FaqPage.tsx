"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import { motion } from "framer-motion";
import { PageHero } from "@/components/site/PageHero";
import { CtaBanner, PageCrossLinks } from "@/components/site/PageBlocks";
import { Container, Section, SectionHeading } from "@/components/site/kit";
import { CollapseMotion, EASE, Reveal, Stagger, StaggerItem } from "@/components/motion";
import { useMotionMode } from "@/components/providers";
import { useLocalized } from "@/lib/page-content";
import { FAQ } from "@/lib/pages-content/faq";

/**
 * Page /faq — questions classées thème par thème.
 * Navigation par ancres (chips), chaque thème ouvre son accordéon ;
 * les questions « propriété » fournies par le client sont mises en
 * avant dans la première catégorie.
 */
export function FaqPage() {
  const c = useLocalized(FAQ);
  const [open, setOpen] = useState<string | null>(null);

  const toggle = (key: string) => setOpen((v) => (v === key ? null : key));

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

      {/* Questions classées par thème */}
      <Section id="faq-cats">
        <Container>
          <SectionHeading
            label={c.cats.label}
            title={c.cats.title}
            gold={c.cats.gold}
            sub={c.cats.sub}
          />

          {/* Navigation par thème (ancres) */}
          <Reveal delay={0.1} y={12} duration={0.6}>
            <nav
              aria-label={c.cats.label}
              className="sticky top-20 z-20 mx-auto -mx-2 mb-4 flex max-w-full gap-2 overflow-x-auto px-2 py-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              {c.categories.map((cat) => (
                <a
                  key={cat.id}
                  href={`#cat-${cat.id}`}
                  className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-gold/30 bg-surface px-4 py-2 text-[0.75rem] font-medium uppercase tracking-[0.1em] text-goldtext transition-all duration-300 hover:-translate-y-0.5 hover:border-gold hover:bg-surface2"
                >
                  {cat.title}
                </a>
              ))}
            </nav>
          </Reveal>

          {/* Thèmes */}
          <div className="mx-auto max-w-3xl">
            {c.categories.map((cat, ci) => (
              <div key={cat.id} id={`cat-${cat.id}`} className="scroll-mt-40 pt-10 first:pt-4">
                <Reveal y={14} duration={0.6}>
                  <div className="mb-4 flex items-baseline gap-3">
                    <span
                      aria-hidden
                      className="font-serif text-2xl text-gold/60 transition-colors duration-300"
                    >
                      {String(ci + 1).padStart(2, "0")}
                    </span>
                    <h2 className="display-3">{cat.title}</h2>
                  </div>
                </Reveal>

                <Stagger step={0.06}>
                  {cat.items.map((item, i) => {
                    const key = `${cat.id}-${i}`;
                    const isOpen = open === key;
                    return (
                      <StaggerItem
                        key={key}
                        className="border-b border-line last:border-b-0"
                      >
                        <h3>
                          <button
                            type="button"
                            id={`faq-q-${key}`}
                            aria-expanded={isOpen}
                            aria-controls={`faq-a-${key}`}
                            onClick={() => toggle(key)}
                            className="group flex w-full cursor-pointer items-center justify-between gap-4 py-5 text-left"
                          >
                            <span
                              className={`text-base font-medium transition-all duration-300 ease-out group-hover:translate-x-1 group-hover:text-goldtext md:text-lg ${
                                isOpen ? "text-goldtext" : "text-ink"
                              }`}
                            >
                              {item.q}
                            </span>
                            <FaqChevron open={isOpen} />
                          </button>
                        </h3>
                        <CollapseMotion open={isOpen}>
                          <div
                            id={`faq-a-${key}`}
                            role="region"
                            aria-labelledby={`faq-q-${key}`}
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
              </div>
            ))}
          </div>
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

/* Chevron rotatif (statique en mode animations réduites) */
function FaqChevron({ open }: { open: boolean }) {
  const { lightMode } = useMotionMode();
  if (lightMode) {
    return (
      <ChevronDown
        aria-hidden
        className={`h-4 w-4 shrink-0 text-gold transition-transform duration-300 ${
          open ? "rotate-180" : ""
        }`}
      />
    );
  }
  return (
    <motion.span
      aria-hidden
      className="block shrink-0 text-gold"
      animate={{ rotate: open ? 180 : 0 }}
      transition={{ duration: 0.4, ease: EASE }}
    >
      <ChevronDown className="h-4 w-4" />
    </motion.span>
  );
}
