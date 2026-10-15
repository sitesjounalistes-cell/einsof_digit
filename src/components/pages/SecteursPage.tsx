"use client";

import React from "react";
import {
  Building2,
  GraduationCap,
  HeartPulse,
  Landmark,
  Pickaxe,
  ShoppingCart,
} from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { SectorsSection } from "@/components/site/SectorsSection";
import { CtaBanner, PageCrossLinks } from "@/components/site/PageBlocks";
import { Container, GoldBadge, Section, SectionHeading } from "@/components/site/kit";
import {
  DrawRule,
  Reveal,
  SpotlightCard,
  Stagger,
  StaggerItem,
} from "@/components/motion";
import { useLocalized } from "@/lib/page-content";
import { SECTEURS, type SectorIcon } from "@/lib/pages-content/secteurs";

/* Icônes des six secteurs phares (ordre des cartes du contenu) */
const SECTOR_ICONS: Record<SectorIcon, typeof HeartPulse> = {
  health: HeartPulse,
  education: GraduationCap,
  realEstate: Building2,
  commerce: ShoppingCart,
  banking: Landmark,
  mining: Pickaxe,
};

/**
 * Page /secteurs — le ruban animé des 14 secteurs (section existante)
 * est complété par six cartes détaillées « solutions par secteur »
 * et par la liste complète des 14 domaines servis.
 */
export function SecteursPage() {
  const c = useLocalized(SECTEURS);

  return (
    <>
      <PageHero
        label={c.hero.label}
        title={c.hero.title}
        gold={c.hero.gold}
        sub={c.hero.sub}
        chips={c.hero.chips}
      />

      {/* Ruban des 14 secteurs (section existante, réutilisée telle quelle) */}
      <SectorsSection heading={false} />

      {/* Solutions par secteur */}
      <Section id="sectors-detail" tone="surface">
        <Container>
          <SectionHeading
            label={c.detail.label}
            title={c.detail.title}
            gold={c.detail.gold}
            sub={c.detail.sub}
          />

          <Stagger className="grid gap-6 md:grid-cols-2 lg:grid-cols-3" step={0.08}>
            {c.detail.cards.map((card) => {
              const Icon = SECTOR_ICONS[card.icon] ?? HeartPulse;
              return (
                <StaggerItem key={card.name} y={32} className="h-full">
                  <SpotlightCard className="h-full rounded-xl">
                    <article className="card-lift flex h-full flex-col rounded-xl border border-line bg-bg p-6">
                      <div className="flex items-start justify-between gap-3">
                        <h3 className="font-serif text-xl leading-snug text-ink">{card.name}</h3>
                        <span
                          aria-hidden
                          className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-gold/40 text-gold"
                        >
                          <Icon size={16} strokeWidth={1.25} />
                        </span>
                      </div>

                      <div className="mt-5">
                        <p className="label-caps">{c.detail.challengesLabel}</p>
                        <p className="mt-2 text-sm leading-relaxed text-mute">{card.challenges}</p>
                      </div>

                      <div className="mt-5 flex-1">
                        <p className="label-caps">{c.detail.answerLabel}</p>
                        <ul className="mt-3 space-y-2.5">
                          {card.bullets.map((b) => (
                            <li key={b} className="flex items-start gap-2.5 text-sm leading-relaxed text-ink">
                              <span
                                aria-hidden
                                className="mt-[0.5rem] h-1 w-1 shrink-0 rounded-full bg-gold"
                              />
                              {b}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </article>
                  </SpotlightCard>
                </StaggerItem>
              );
            })}
          </Stagger>
        </Container>
      </Section>

      {/* Les 14 secteurs servis */}
      <Section id="sectors-all">
        <Container>
          <SectionHeading
            align="center"
            label={c.all.label}
            title={c.all.title}
            gold={c.all.gold}
            sub={c.all.sub}
          />

          <Stagger className="mx-auto flex max-w-4xl flex-wrap justify-center gap-3" step={0.04}>
            {c.all.items.map((name) => (
              <StaggerItem key={name} y={16}>
                <GoldBadge className="px-4 py-2 text-[0.75rem]">{name}</GoldBadge>
              </StaggerItem>
            ))}
          </Stagger>

          <DrawRule className="mx-auto mt-12 h-px w-40" delay={0.1} />
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

      <PageCrossLinks title={c.crossLinks.title} items={c.crossLinks.items} />
    </>
  );
}
