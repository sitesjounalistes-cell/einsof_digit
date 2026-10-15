"use client";

import { Check, Clock, Gem, ShieldCheck, type LucideIcon } from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { ProcessSection } from "@/components/site/ProcessSection";
import { CtaBanner, PageCrossLinks } from "@/components/site/PageBlocks";
import { Container, Section, SectionHeading } from "@/components/site/kit";
import { Beam, DrawRule, PopIn, Reveal, Stagger, StaggerItem } from "@/components/motion";
import { useI18n } from "@/lib/i18n";
import { useLocalized } from "@/lib/page-content";
import { METHODE_PAGE } from "@/lib/pages-content/methode";

/**
 * Page /methode — bandeau d'ouverture, la frise des 5 étapes
 * (section partagée), le détail de chaque étape, les deux garanties,
 * appel à l'action et liens croisés.
 */

const GUARANTEE_ICONS: readonly LucideIcon[] = [ShieldCheck, Gem];

export function MethodPage() {
  const { t } = useI18n();
  const c = useLocalized(METHODE_PAGE);

  return (
    <>
      <PageHero
        label={t("process.label")}
        title={t("process.title")}
        gold={t("process.tGold")}
        sub={t("process.sub")}
        chips={c.heroChips}
      />

      {/* Les 5 étapes (frise or) — section partagée existante */}
      <ProcessSection heading={false} />

      {/* Détail de chaque étape */}
      <Section id="method-detail" tone="surface">
        <Container>
          <SectionHeading
            label={c.detail.label}
            title={c.detail.title}
            gold={c.detail.gold}
            sub={c.detail.sub}
          />

          <div>
            {c.steps.map((step, i) => (
              <Reveal key={step.num} y={30} duration={0.8}>
                <article className="grid gap-8 lg:grid-cols-12">
                  {/* Numéro, titre, durée */}
                  <div className="lg:col-span-4">
                    <p
                      aria-hidden
                      className="gold-text-gradient font-serif text-5xl font-semibold leading-none md:text-6xl"
                    >
                      {step.num}
                    </p>
                    <h3 className="mt-4 font-serif text-2xl font-semibold text-ink">{step.title}</h3>
                    {step.duration && (
                      <p className="mt-4 inline-flex items-center gap-2 rounded-full border border-gold/30 bg-bg/60 px-3.5 py-1.5">
                        <Clock size={13} strokeWidth={1.5} aria-hidden className="shrink-0 text-gold" />
                        <span className="text-[0.6875rem] font-medium uppercase tracking-[0.14em] text-goldtext">
                          {step.durationLabel} · {step.duration}
                        </span>
                      </p>
                    )}
                  </div>

                  {/* Ce que nous faisons / ce que vous recevez */}
                  <div className="lg:col-span-8">
                    <p className="label-caps">{step.doLabel}</p>
                    <p className="mt-3 max-w-2xl leading-relaxed text-mute">{step.doing}</p>

                    <p className="label-caps mt-7">{step.deliverLabel}</p>
                    <ul className="mt-3 max-w-2xl space-y-2.5">
                      {step.deliverables.map((item) => (
                        <li key={item} className="flex items-start gap-2.5">
                          <Check
                            size={15}
                            strokeWidth={1.75}
                            aria-hidden
                            className="mt-[0.2rem] shrink-0 text-gold"
                          />
                          <span className="text-sm leading-relaxed text-ink">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </article>

                {i < c.steps.length - 1 && <DrawRule className="my-10 h-px w-full md:my-12" />}
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      {/* Les deux garanties */}
      <Section id="method-guarantees">
        <Container>
          <SectionHeading
            label={c.guarantees.heading.label}
            title={c.guarantees.heading.title}
            gold={c.guarantees.heading.gold}
            sub={c.guarantees.heading.sub}
          />

          <Stagger className="grid gap-6 md:grid-cols-2" step={0.12}>
            {c.guarantees.items.map((item, i) => {
              const Icon = GUARANTEE_ICONS[i] ?? ShieldCheck;
              return (
                <StaggerItem key={item.title} y={26} className="h-full">
                  <Beam className="h-full rounded-xl">
                    <article className="glass-panel card-lift flex h-full flex-col rounded-xl p-6 md:p-8">
                      <PopIn delay={i * 0.1}>
                        <span
                          aria-hidden
                          className="inline-flex rounded-full border border-gold/30 p-3.5 text-gold"
                        >
                          <Icon size={28} strokeWidth={1.25} aria-hidden />
                        </span>
                      </PopIn>
                      <h3 className="mt-6 font-serif text-2xl font-semibold text-ink">{item.title}</h3>
                      <p className="mt-3 leading-relaxed text-mute">{item.desc}</p>
                    </article>
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
        secondaryHref="/tarifs"
      />

      <PageCrossLinks title={c.crossLinks.title} items={c.crossLinks.items} />
    </>
  );
}
