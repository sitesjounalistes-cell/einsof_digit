"use client";

import Link from "next/link";
import React from "react";
import {
  ArrowUpRight,
  BedDouble,
  Building2,
  GraduationCap,
  HandHeart,
  HardHat,
  HeartPulse,
  Landmark,
  Newspaper,
  Pickaxe,
  ShoppingCart,
  Signal,
  Tractor,
  Truck,
  Users,
  type LucideIcon,
} from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { SectorsSection } from "@/components/site/SectorsSection";
import { CtaBanner, PageCrossLinks } from "@/components/site/PageBlocks";
import { Container, GoldBadge, Section, SectionHeading } from "@/components/site/kit";
import {
  Beam,
  DrawRule,
  Reveal,
  SpotlightCard,
  Stagger,
  StaggerItem,
} from "@/components/motion";
import { useLocalized } from "@/lib/page-content";
import { SECTEURS, type SectorIcon } from "@/lib/pages-content/secteurs";
import { SECTOR_INDEX } from "@/lib/pages-content/secteur-details";

/* Icônes des six secteurs phares (ordre des cartes du contenu) */
const SECTOR_ICONS: Record<SectorIcon, typeof HeartPulse> = {
  health: HeartPulse,
  education: GraduationCap,
  realEstate: Building2,
  commerce: ShoppingCart,
  banking: Landmark,
  mining: Pickaxe,
};

/* Icônes des 14 pages /secteurs/[slug] (maillage interne) — indexées
   par le nom de composant Lucide défini dans SECTOR_INDEX. */
const SECTOR_PAGE_ICONS: Record<string, LucideIcon> = {
  HeartPulse,
  GraduationCap,
  Building2,
  ShoppingCart,
  BedDouble,
  Landmark,
  HardHat,
  HandHeart,
  Truck,
  Tractor,
  Pickaxe,
  Newspaper,
  Signal,
  Users,
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
        image="/images/headers/header-secteurs.png"
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

      {/* Toutes les pages par métier — maillage interne vers les
          14 landing pages /secteurs/[slug] (SEO longue traîne) */}
      <Section id="sectors-pages" tone="surface">
        <Container>
          <SectionHeading
            label="Solutions par métier"
            title="Toutes les pages"
            gold="par métier."
            sub="Chaque métier a sa page dédiée : sites web, logiciels, prix et réponses aux questions spécifiques au secteur, en Guinée."
          />
          <Stagger className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" step={0.05}>
            {SECTOR_INDEX.map((entry) => {
              const Icon = SECTOR_PAGE_ICONS[entry.icon] ?? HeartPulse;
              return (
                <StaggerItem key={entry.slug} y={20} className="h-full">
                  <Beam className="h-full rounded-xl">
                    <Link
                      href={`/secteurs/${entry.slug}`}
                      className="card-lift group flex h-full flex-col rounded-xl border border-line bg-bg p-5 transition-colors hover:border-gold/50 focus-visible:outline focus-visible:outline-1 focus-visible:outline-gold"
                    >
                      <span className="flex items-center justify-between gap-3">
                        <span
                          aria-hidden
                          className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-gold/40 text-gold"
                        >
                          <Icon size={16} strokeWidth={1.25} />
                        </span>
                        <ArrowUpRight
                          size={16}
                          strokeWidth={1.25}
                          aria-hidden
                          className="shrink-0 text-gold opacity-0 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-100"
                        />
                      </span>
                      {/* anchor text = nom du métier */}
                      <span className="mt-4 font-serif text-lg leading-snug text-ink transition-colors duration-300 group-hover:text-goldlight">
                        {entry.name}
                      </span>
                      <span className="mt-1.5 text-[0.8125rem] leading-relaxed text-mute">
                        {entry.tagline}
                      </span>
                    </Link>
                  </Beam>
                </StaggerItem>
              );
            })}
          </Stagger>
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
