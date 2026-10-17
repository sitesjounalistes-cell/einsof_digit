"use client";

import {
  Languages,
  ReceiptText,
  ShieldCheck,
  UserCheck,
  type LucideIcon,
} from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { CtaBanner, PageCrossLinks } from "@/components/site/PageBlocks";
import { Container, Section, SectionHeading } from "@/components/site/kit";
import { AboutSection } from "@/components/site/AboutSection";
import { DocumentsSection } from "@/components/site/DocumentsSection";
import { ManagerMessageSection } from "@/components/site/ManagerMessageSection";
import { StatsSection } from "@/components/site/StatsSection";
import { Beam, SpotlightCard, Stagger, StaggerItem } from "@/components/motion";
import { useLocalized } from "@/lib/page-content";
import { APROPOS, type WhyIcon } from "@/lib/pages-content/apropos";

const WHY_ICONS: Record<WhyIcon, LucideIcon> = {
  interlocutor: UserCheck,
  shield: ShieldCheck,
  languages: Languages,
  prices: ReceiptText,
};

/**
 * Page /a-propos (architecture multi-pages) :
 * hero « À propos », chiffres clés animés, récit & valeurs existants,
 * bloc « pourquoi EINSOF », mot du gérant (réglages éditables),
 * documents téléchargeables, CTA final.
 */
export function AProposPage() {
  const c = useLocalized(APROPOS);

  return (
    <>
      <PageHero
        label={c.hero.label}
        title={c.hero.title}
        gold={c.hero.gold}
        sub={c.hero.sub}
        chips={c.hero.chips}
        image="/images/headers/header-a-propos.png"
      />

      {/* Chiffres clés animés (7 ans, ~10 experts, langues, SaaS) */}
      <StatsSection />

      {/* Récit + valeurs existants */}
      <AboutSection />

      {/* Pourquoi EINSOF */}
      <Section id="why-us" tone="surface" className="border-b border-line">
        <Container>
          <SectionHeading
            label={c.whyUs.label}
            title={c.whyUs.title}
            gold={c.whyUs.gold}
            sub={c.whyUs.sub}
          />

          <Stagger className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4" step={0.08} delay={0.05}>
            {c.whyUs.cards.map((card) => {
              const Icon = WHY_ICONS[card.icon];
              return (
                <StaggerItem key={card.title} y={30} className="h-full">
                  <SpotlightCard className="h-full rounded-xl">
                    <Beam className="h-full rounded-xl">
                      <article className="card-lift flex h-full flex-col rounded-xl border border-line bg-bg p-6">
                        <span
                          aria-hidden
                          className="flex h-11 w-11 items-center justify-center rounded-lg border border-gold/30 bg-surface text-goldtext"
                        >
                          <Icon size={20} strokeWidth={1.25} />
                        </span>
                        <h3 className="mt-4 font-serif text-xl leading-snug text-ink">
                          {card.title}
                        </h3>
                        <p className="mt-3 text-sm leading-relaxed text-mute">{card.text}</p>
                      </article>
                    </Beam>
                  </SpotlightCard>
                </StaggerItem>
              );
            })}
          </Stagger>
        </Container>
      </Section>

      {/* Mot du gérant — réglages Site & Contact (toujours affiché :
          l'API renvoie le texte officiel par défaut sinon) */}
      <ManagerMessageSection />

      {/* Documents de présentation téléchargeables (API — se masque si vide) */}
      <DocumentsSection />

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
