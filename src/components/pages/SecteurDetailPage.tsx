"use client";

import {
  ArrowRight,
  BarChart3,
  BedDouble,
  Building2,
  CalendarRange,
  ClipboardList,
  Database,
  GraduationCap,
  HandHeart,
  HardHat,
  Home,
  Landmark,
  MapPin,
  Megaphone,
  Newspaper,
  Package,
  Pickaxe,
  Pill,
  School,
  ShoppingCart,
  Signal,
  Sparkles,
  Stethoscope,
  Target,
  Tractor,
  Truck,
  Tv,
  Users,
  UtensilsCrossed,
  type LucideIcon,
} from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { CtaBanner, PageCrossLinks } from "@/components/site/PageBlocks";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Container, GoldButton, Section, SectionHeading } from "@/components/site/kit";
import { GoldIcon } from "@/components/site/icons";
import { Reveal, SpotlightCard, Stagger, StaggerItem } from "@/components/motion";
import { useI18n } from "@/lib/i18n";
import { openForm } from "@/lib/chat-bus";
import { trackCta } from "@/lib/analytics";
import { SECTOR_SEO } from "@/lib/seo";
import { SECTEUR_DETAILS } from "@/lib/pages-content/secteur-details";

/**
 * Page de détail d'un secteur /secteurs/[slug] — landing SEO longue
 * traîne (« site web pour hôtel en Guinée »…) : bandeau > introduction
 * riche en mots-clés > 4 offres (site web, logiciel/SaaS, community
 * management, génération de leads) > réalités du terrain > FAQ longue
 * traîne > appel à l'action > maillage interne.
 * Contenu FR uniquement (marché guinéen) — voir secteur-details.ts.
 */

/* Icônes Lucide des offres, nommées par une chaîne dans le contenu
   (secteur-details.ts). Toute icône absente retombe sur Sparkles. */
const OFFER_ICONS: Record<string, LucideIcon> = {
  BarChart3,
  Stethoscope,
  ClipboardList,
  Pill,
  Megaphone,
  Target,
  GraduationCap,
  School,
  Building2,
  Home,
  ShoppingCart,
  Package,
  BedDouble,
  UtensilsCrossed,
  Landmark,
  Database,
  HardHat,
  HandHeart,
  Truck,
  MapPin,
  Tractor,
  Pickaxe,
  Newspaper,
  Tv,
  CalendarRange,
  Signal,
  Users,
};

export function SecteurDetailPage({ slug }: { slug: string }) {
  const { t } = useI18n();
  const sector = SECTOR_SEO.find((s) => s.slug === slug);
  const detail = SECTEUR_DETAILS[slug];

  if (!sector || !detail) return null;

  const quoteSubject = `Solutions digitales — ${sector.name} (Guinée)`;

  return (
    <>
      <PageHero
        label="Secteur"
        title={detail.heroTitle}
        gold={detail.heroGold}
        sub={detail.heroSub}
        image="/images/headers/header-secteurs.png"
        parent={{ label: t("nav.secteurs"), href: "/secteurs" }}
      />

      {/* ── Introduction riche en mots-clés ──────────────────────── */}
      <Section id={`${slug}-intro`}>
        <Container>
          <SectionHeading
            label="Vue d'ensemble"
            title={`Solutions digitales — ${sector.name}`}
            gold="en Guinée."
          />
          <div className="max-w-3xl space-y-5">
            {detail.intro.map((p, i) => (
              <Reveal key={i} y={22} delay={i * 0.1}>
                <p className="text-[0.9375rem] leading-relaxed text-mute md:text-base">{p}</p>
              </Reveal>
            ))}
            <Reveal delay={0.2}>
              <GoldButton
                variant="outline"
                className="mt-3"
                onClick={() => {
                  openForm("quote", { subject: quoteSubject });
                  trackCta(`secteur-${slug}`, "quote");
                }}
              >
                Demander un devis
                <ArrowRight size={15} strokeWidth={1.5} aria-hidden />
              </GoldButton>
            </Reveal>
          </div>
        </Container>
      </Section>

      {/* ── Quatre offres par métier ─────────────────────────────── */}
      <Section id={`${slug}-offres`} tone="surface">
        <Container>
          <SectionHeading
            label="Nos offres"
            title="Quatre leviers pour équiper"
            gold="votre métier."
            sub="Sites web, logiciels et SaaS de gestion, community management, génération de leads : le dispositif complet, adapté à votre secteur."
          />
          <Stagger className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4" step={0.08}>
            {detail.offers.map((offer) => {
              const Icon = OFFER_ICONS[offer.icon] ?? Sparkles;
              return (
                <StaggerItem key={offer.title} y={28} className="h-full">
                  <SpotlightCard className="h-full rounded-xl">
                    <article className="card-lift flex h-full flex-col rounded-xl border border-line bg-bg p-6">
                      <GoldIcon icon={Icon} size="sm" />
                      <h3 className="mt-4 font-serif text-lg font-semibold leading-snug text-ink">
                        {offer.title}
                      </h3>
                      <p className="mt-2.5 flex-1 text-sm leading-relaxed text-mute">{offer.desc}</p>
                    </article>
                  </SpotlightCard>
                </StaggerItem>
              );
            })}
          </Stagger>
        </Container>
      </Section>

      {/* ── Réalités du terrain ──────────────────────────────────── */}
      <Section id={`${slug}-terrain`} tone="deep">
        <Container>
          <SectionHeading
            label="Réalités du terrain"
            title="Ce que le terrain impose,"
            gold="nous le connaissons."
            sub="Nos solutions partent des contraintes réelles de votre métier en Guinée — pas de la théorie."
          />
          <Stagger as="ul" className="grid list-none gap-x-10 gap-y-6 md:grid-cols-2" step={0.08}>
            {detail.terrain.map((item, i) => (
              <StaggerItem key={item} as="li" y={20} className="h-full list-none">
                <div className="h-full rounded-lg border border-line/60 bg-bg px-5 py-4">
                  <div className="flex items-start gap-3.5">
                    <span
                      aria-hidden
                      className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-gold/40 font-serif text-[0.6875rem] text-goldtext"
                    >
                      {i + 1}
                    </span>
                    <p className="text-sm leading-relaxed text-ink">{item}</p>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </Container>
      </Section>

      {/* ── FAQ longue traîne ────────────────────────────────────── */}
      <Section id={`${slug}-faq`} tone="surface">
        <Container>
          <SectionHeading
            label="Questions fréquentes"
            title="Vos questions,"
            gold="nos réponses."
          />
          <Reveal y={18} duration={0.7}>
            <Accordion
              type="single"
              collapsible
              className="w-full rounded-xl border border-line bg-surface px-6"
            >
              {detail.faq.map((item, i) => (
                <AccordionItem key={item.q} value={`secteur-faq-${i}`} className="border-line last:border-b-0">
                  <AccordionTrigger className="py-5 text-left font-serif text-base font-medium text-ink hover:no-underline hover:text-goldlight md:text-lg">
                    {item.q}
                  </AccordionTrigger>
                  <AccordionContent className="pb-5 text-sm leading-relaxed text-mute">
                    {item.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </Reveal>
        </Container>
      </Section>

      <CtaBanner
        title="Prêt à équiper votre métier ?"
        gold="Parlons de votre projet."
        sub="Décrivez votre activité en Guinée : nous vous répondons sous 48 h avec une proposition précise et un prix annoncé d'avance."
        primaryLabel="Démarrer mon projet"
        primaryHref="/contact"
        secondaryLabel="Voir les tarifs"
        secondaryHref="/tarifs"
      />

      <PageCrossLinks title="Explorer aussi" items={detail.crossLinks} />
    </>
  );
}
