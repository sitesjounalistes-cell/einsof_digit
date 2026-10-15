"use client";

import { PageHero } from "@/components/site/PageHero";
import { ServicesSection } from "@/components/site/ServicesSection";
import { PillarsSection } from "@/components/site/PillarsSection";
import { CtaBanner, PageCrossLinks } from "@/components/site/PageBlocks";
import { useI18n } from "@/lib/i18n";
import { useLocalized } from "@/lib/page-content";
import { SERVICES_PAGE } from "@/lib/pages-content/services";

/**
 * Page /services — hub des sept pôles :
 * bandeau (visuel de fond) > carrousel défilant des pôles (chaque
 * carte ouvre sa page détaillée /services/[slug]) > les deux
 * promesses > appel à l'action > liens croisés.
 */
export function ServicesPage() {
  const { t } = useI18n();
  const c = useLocalized(SERVICES_PAGE);

  return (
    <>
      <PageHero
        label={t("services.label")}
        title={t("services.title")}
        gold={t("services.tGold")}
        sub={t("services.sub")}
        chips={c.heroChips}
        image="/images/headers/header-services.png"
      />

      {/* Carrousel défilant des 7 pôles — chaque carte ouvre le détail */}
      <ServicesSection heading={false} />

      {/* Les deux promesses */}
      <PillarsSection />

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
