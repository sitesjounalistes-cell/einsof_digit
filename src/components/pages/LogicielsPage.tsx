"use client";

import { Workflow } from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { CtaBanner, PageCrossLinks } from "@/components/site/PageBlocks";
import { SaasSection } from "@/components/site/SaasSection";
import { TrialSection } from "@/components/site/TrialSection";
import { Beam, Reveal } from "@/components/motion";
import { GoldButton, Section, Container } from "@/components/site/kit";
import { openForm } from "@/lib/chat-bus";
import { trackCta } from "@/lib/analytics";
import { useLocalized } from "@/lib/page-content";
import { LOGICIELS } from "@/lib/pages-content/logiciels";

/**
 * Page /logiciels — hub des sept SaaS de gestion :
 * bandeau (visuel de fond) > carrousel défilant des produits (chaque
 * carte ouvre sa page dédiée /logiciels/[slug] avec vidéo,
 * caractéristiques et réservation de démo) > conception de workflows
 * sur mesure > essai 7 jours > appel à l'action > liens croisés.
 */
export function LogicielsPage() {
  const c = useLocalized(LOGICIELS);

  return (
    <>
      <PageHero
        label={c.hero.label}
        title={c.hero.title}
        gold={c.hero.gold}
        sub={c.hero.sub}
        chips={c.hero.chips}
        image="/images/headers/header-logiciels.png"
      />

      {/* Carrousel défilant des 7 logiciels — chaque carte ouvre sa page */}
      <SaasSection heading={false} />

      {/* Conception de workflows sur mesure */}
      <Section id="workflows" tone="surface">
        <Container>
          <Reveal y={20}>
            <Beam className="rounded-xl" always>
              <div className="flex flex-col items-start gap-6 rounded-xl border border-gold/40 bg-bg p-6 md:flex-row md:items-center md:p-8">
                <span
                  aria-hidden
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-gold/40 bg-surface2"
                >
                  <Workflow size={22} strokeWidth={1.25} className="text-gold" />
                </span>
                <div className="flex-1">
                  <h2 className="display-3">
                    {c.workflows.title} <span className="text-goldtext">{c.workflows.gold}</span>
                  </h2>
                  <p className="mt-2 max-w-3xl text-sm leading-relaxed text-mute md:text-[0.9375rem]">
                    {c.workflows.desc}
                  </p>
                </div>
                <GoldButton
                  magnetic
                  className="shrink-0"
                  onClick={() => {
                    openForm("quote", { subject: c.workflows.title });
                    trackCta("logiciels", "workflows");
                  }}
                >
                  {c.workflows.ctaLabel}
                </GoldButton>
              </div>
            </Beam>
          </Reveal>
        </Container>
      </Section>

      <TrialSection />

      <CtaBanner
        title={c.cta.title}
        gold={c.cta.gold}
        sub={c.cta.sub}
        primaryLabel={c.cta.primaryLabel}
        primaryHref="/contact"
        secondaryLabel={c.cta.secondaryLabel}
        secondaryHref="/tarifs"
      />

      <PageCrossLinks title={c.cross.title} items={c.cross.items} />
    </>
  );
}

export default LogicielsPage;
