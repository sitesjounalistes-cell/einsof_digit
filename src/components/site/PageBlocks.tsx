"use client";

import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Container, GoldButton } from "@/components/site/kit";
import { Beam, Reveal, Stagger, StaggerItem } from "@/components/motion";

/**
 * Blocs de clôture partagés par toutes les pages du site multi-pages :
 * — CtaBanner : bandeau d'appel à l'action en fin de page
 * — PageCrossLinks : cartes « Explorer aussi » vers les pages liées
 */

export function CtaBanner({
  title,
  gold,
  sub,
  primaryLabel,
  primaryHref = "/contact",
  secondaryLabel,
  secondaryHref = "/tarifs",
}: {
  title: string;
  gold?: string;
  sub?: string;
  primaryLabel: string;
  primaryHref?: string;
  secondaryLabel?: string;
  secondaryHref?: string;
}) {
  return (
    <section className="relative overflow-hidden border-y border-line bg-[#0D0D0D] py-16 md:py-24">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(55%_60%_at_50%_100%,rgba(212,175,55,0.09),transparent_70%)]"
      />
      <Container className="relative text-center">
        <Reveal y={16} duration={0.7}>
          <h2 className="display-2 mx-auto max-w-3xl">
            {title}{" "}
            {gold && <em className="font-serif italic text-goldtext">{gold}</em>}
          </h2>
        </Reveal>
        {sub && (
          <Reveal delay={0.15} y={14} duration={0.7}>
            <p className="lead-text mx-auto mt-4 max-w-xl">{sub}</p>
          </Reveal>
        )}
        <Reveal delay={0.25} y={14} duration={0.7}>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <GoldButton href={primaryHref} magnetic>
              {primaryLabel}
              <ArrowRight size={16} strokeWidth={1.5} aria-hidden />
            </GoldButton>
            {secondaryLabel && (
              <GoldButton href={secondaryHref} variant="outline">
                {secondaryLabel}
              </GoldButton>
            )}
          </div>
        </Reveal>
      </Container>
    </section>
  );
}

export function PageCrossLinks({
  title,
  items,
}: {
  title: string;
  items: { href: string; title: string; desc: string }[];
}) {
  return (
    <section className="bg-bg py-16 md:py-20">
      <Container>
        <Reveal y={14} duration={0.6}>
          <h2 className="label-caps mb-8">{title}</h2>
        </Reveal>
        <Stagger className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3" step={0.08}>
          {items.map((item) => (
            <StaggerItem key={item.href} y={26} className="h-full">
              <Beam className="h-full rounded-xl">
                <Link
                  href={item.href}
                  className="card-lift group flex h-full flex-col rounded-xl border border-line bg-surface p-6 focus-visible:outline focus-visible:outline-1 focus-visible:outline-gold"
                >
                  <span className="inline-flex items-center justify-between gap-3 font-serif text-xl text-ink transition-colors duration-300 group-hover:text-goldlight">
                    {item.title}
                    <ArrowUpRight
                      size={18}
                      strokeWidth={1.25}
                      aria-hidden
                      className="shrink-0 text-gold transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    />
                  </span>
                  <span className="mt-2.5 text-sm leading-relaxed text-mute">
                    {item.desc}
                  </span>
                </Link>
              </Beam>
            </StaggerItem>
          ))}
        </Stagger>
      </Container>
    </section>
  );
}
