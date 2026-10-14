"use client";

import Link from "next/link";
import {
  AppWindow,
  ArrowUpRight,
  Award,
  Building2,
  LayoutGrid,
  Mail,
  MessageCircleQuestion,
  Newspaper,
  Route,
  Tags,
  Users,
  type LucideIcon,
} from "lucide-react";
import { Container, SectionHeading } from "@/components/site/kit";
import { Stagger, StaggerItem, Tilt } from "@/components/motion";
import { useLocalized } from "@/lib/page-content";
import { HUB, type HubIcon } from "@/lib/pages-content/hub";

const ICONS: Record<HubIcon, LucideIcon> = {
  layout: LayoutGrid,
  boxes: AppWindow,
  building: Building2,
  route: Route,
  tag: Tags,
  award: Award,
  news: Newspaper,
  users: Users,
  help: MessageCircleQuestion,
  mail: Mail,
};

/**
 * Hub de la page d'accueil (architecture multi-pages) :
 * une carte animée par page du site, numérotée, avec icône,
 * description courte et flèche d'exploration.
 */
export function HubGrid() {
  const c = useLocalized(HUB);
  return (
    <section id="section-hub" data-section-id="hub" className="relative scroll-mt-20 bg-surface py-20 md:py-28">
      <Container>
        <SectionHeading
          label={c.label}
          title={c.title}
          gold={c.gold}
          sub={c.sub}
        />

        <Stagger className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5" step={0.06} delay={0.05}>
          {c.cards.map((card) => {
            const Icon = ICONS[card.icon];
            return (
              <StaggerItem key={card.href} y={30} className="h-full">
                <Tilt max={5} className="h-full">
                  <Link
                    href={card.href}
                    className="card-lift group flex h-full min-h-[220px] flex-col rounded-xl border border-line bg-bg p-5 focus-visible:outline focus-visible:outline-1 focus-visible:outline-gold"
                    aria-label={`${card.title} — ${c.discover}`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <span
                        aria-hidden
                        className="font-serif text-sm tracking-[0.2em] text-goldtext"
                      >
                        {card.num}
                      </span>
                      <span
                        aria-hidden
                        className="flex h-9 w-9 items-center justify-center rounded-lg border border-gold/30 bg-surface text-goldtext transition-all duration-300 group-hover:border-gold group-hover:bg-gold group-hover:text-ongold"
                      >
                        <Icon size={17} strokeWidth={1.25} />
                      </span>
                    </div>
                    <h3 className="mt-4 font-serif text-xl leading-snug text-ink transition-colors duration-300 group-hover:text-goldlight">
                      {card.title}
                    </h3>
                    <p className="mt-2 flex-1 text-[0.8125rem] leading-relaxed text-mute">
                      {card.desc}
                    </p>
                    <span className="mt-4 inline-flex items-center gap-1.5 text-[0.75rem] font-semibold uppercase tracking-[0.14em] text-goldtext">
                      {c.discover}
                      <ArrowUpRight
                        size={14}
                        strokeWidth={1.5}
                        aria-hidden
                        className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                      />
                    </span>
                  </Link>
                </Tilt>
              </StaggerItem>
            );
          })}
        </Stagger>
      </Container>
    </section>
  );
}
