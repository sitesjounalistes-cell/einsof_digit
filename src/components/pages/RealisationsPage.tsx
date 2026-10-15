"use client";

import {
  Check,
  Cloud,
  Globe,
  LayoutDashboard,
  Share2,
  ShoppingBag,
  Target,
  type LucideIcon,
} from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { CtaBanner, PageCrossLinks } from "@/components/site/PageBlocks";
import { Container, Section, SectionHeading } from "@/components/site/kit";
import { PartnersSection } from "@/components/site/PartnersSection";
import { ProjectsSection } from "@/components/site/ProjectsSection";
import { TestimonialsSection } from "@/components/site/TestimonialsSection";
import { Beam, SpotlightCard, Stagger, StaggerItem } from "@/components/motion";
import { useLocalized } from "@/lib/page-content";
import { REALISATIONS, type WorkTypeIcon } from "@/lib/pages-content/realisations";

const WORK_ICONS: Record<WorkTypeIcon, LucideIcon> = {
  globe: Globe,
  cart: ShoppingBag,
  dashboard: LayoutDashboard,
  cloud: Cloud,
  share: Share2,
  target: Target,
};

/**
 * Page /realisations (architecture multi-pages) :
 * hero « Références », types de missions (contenu statique générique),
 * puis les sections réelles issues des API — projets, partenaires,
 * témoignages — qui se masquent d'elles-mêmes si vides.
 */
export function RealisationsPage() {
  const c = useLocalized(REALISATIONS);

  return (
    <>
      <PageHero
        label={c.hero.label}
        title={c.hero.title}
        gold={c.hero.gold}
        sub={c.hero.sub}
        chips={c.hero.chips}
      />

      {/* Types de missions — descriptions génériques, aucun faux client */}
      <Section id="work-types" tone="surface" className="border-b border-line">
        <Container>
          <SectionHeading
            label={c.workTypes.label}
            title={c.workTypes.title}
            gold={c.workTypes.gold}
            sub={c.workTypes.sub}
          />

          <Stagger className="grid gap-6 md:grid-cols-2 lg:grid-cols-3" step={0.08} delay={0.05}>
            {c.workTypes.cards.map((card) => {
              const Icon = WORK_ICONS[card.icon];
              return (
                <StaggerItem key={card.title} y={30} className="h-full">
                  <SpotlightCard className="h-full rounded-xl">
                    <Beam className="h-full rounded-xl">
                      <article className="card-lift flex h-full flex-col rounded-xl border border-line bg-bg p-6">
                        <div className="flex items-center gap-3.5">
                          <span
                            aria-hidden
                            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-gold/30 bg-surface text-goldtext"
                          >
                            <Icon size={20} strokeWidth={1.25} />
                          </span>
                          <h3 className="font-serif text-xl leading-snug text-ink">
                            {card.title}
                          </h3>
                        </div>

                        <p className="mt-4 text-sm leading-relaxed text-mute">{card.goal}</p>

                        <div className="mt-auto pt-5">
                          <p className="label-caps mb-2.5">{c.workTypes.deliverablesLabel}</p>
                          <ul className="space-y-1.5">
                            {card.deliverables.map((item) => (
                              <li key={item} className="flex items-start gap-2 text-sm text-mute">
                                <Check
                                  size={14}
                                  strokeWidth={1.75}
                                  aria-hidden
                                  className="mt-0.5 shrink-0 text-gold"
                                />
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </article>
                    </Beam>
                  </SpotlightCard>
                </StaggerItem>
              );
            })}
          </Stagger>
        </Container>
      </Section>

      {/* Réalisations réelles (API — se masque si vide) */}
      <ProjectsSection />

      {/* Partenaires (API — se masque si vide) */}
      <PartnersSection />

      {/* Témoignages (API — se masque si vide) */}
      <TestimonialsSection />

      <CtaBanner
        title={c.cta.title}
        gold={c.cta.gold}
        sub={c.cta.sub}
        primaryLabel={c.cta.primaryLabel}
        primaryHref={c.cta.primaryHref}
        secondaryLabel={c.cta.secondaryLabel}
        secondaryHref={c.cta.secondaryHref}
      />

      <PageCrossLinks title={c.crossLinks.title} items={c.crossLinks.items} />
    </>
  );
}
