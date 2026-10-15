"use client";

import { PageHero } from "@/components/site/PageHero";
import { CtaBanner, PageCrossLinks } from "@/components/site/PageBlocks";
import { SaasSection } from "@/components/site/SaasSection";
import { TrialSection } from "@/components/site/TrialSection";
import { useLocalized } from "@/lib/page-content";
import { LOGICIELS } from "@/lib/pages-content/logiciels";

/**
 * Page /logiciels — hub des six SaaS de gestion :
 * bandeau (visuel de fond) > carrousel défilant des produits (chaque
 * carte ouvre sa page dédiée /logiciels/[slug] avec vidéo,
 * caractéristiques et réservation de démo) > essai 7 jours >
 * appel à l'action > liens croisés.
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

      {/* Carrousel défilant des 6 logiciels — chaque carte ouvre sa page */}
      <SaasSection heading={false} />

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
