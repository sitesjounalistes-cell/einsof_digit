"use client";

import { useRouter } from "next/navigation";
import {
  Boxes,
  Globe,
  MessageCircleQuestion,
  PenTool,
  type LucideIcon,
} from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { PageCrossLinks } from "@/components/site/PageBlocks";
import { Container, GoldButton, Section, SectionHeading } from "@/components/site/kit";
import { ContactSection } from "@/components/site/ContactSection";
import { Beam, SpotlightCard, Stagger, StaggerItem } from "@/components/motion";
import { useLocalized } from "@/lib/page-content";
import { CONTACT, type HelpIcon } from "@/lib/pages-content/contact";

const HELP_ICONS: Record<HelpIcon, LucideIcon> = {
  site: Globe,
  saas: Boxes,
  bespoke: PenTool,
  faq: MessageCircleQuestion,
};

/**
 * Page /contact (architecture multi-pages) :
 * hero « Contact », formulaire complet existant (sujets, consentement,
 * honeypot), cartes d'aide « avant d'écrire » et liens croisés.
 * Pas de CtaBanner : la page EST l'appel à l'action.
 */
export function ContactPage() {
  const c = useLocalized(CONTACT);
  const router = useRouter();

  return (
    <>
      <PageHero
        label={c.hero.label}
        title={c.hero.title}
        gold={c.hero.gold}
        sub={c.hero.sub}
        chips={c.hero.chips}
        image="/images/headers/header-contact.png"
      />

      {/* Formulaire complet + coordonnées (section existante, titre déjà dans le PageHero) */}
      <ContactSection heading={false} />

      {/* Avant d'écrire — points d'entrée selon le besoin */}
      <Section id="contact-help" tone="surface" className="border-t border-line">
        <Container>
          <SectionHeading
            label={c.help.label}
            title={c.help.title}
            gold={c.help.gold}
            sub={c.help.sub}
          />

          <Stagger className="grid gap-6 md:grid-cols-2" step={0.08} delay={0.05}>
            {c.help.cards.map((card) => {
              const Icon = HELP_ICONS[card.icon];
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

                        <p className="mt-4 text-sm leading-relaxed text-mute">{card.text}</p>

                        {/* Navigation interne : routage client (next/navigation) */}
                        <div className="mt-auto pt-5">
                          <GoldButton
                            variant="outline"
                            onClick={() => router.push(card.href)}
                            ariaLabel={`${card.ctaLabel} — ${card.title}`}
                          >
                            {card.ctaLabel}
                          </GoldButton>
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

      <PageCrossLinks title={c.crossLinks.title} items={c.crossLinks.items} />
    </>
  );
}
