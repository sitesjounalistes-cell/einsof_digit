"use client";

import { Hero } from "@/components/site/Hero";
import { StatsSection } from "@/components/site/StatsSection";
import { ClientLogosBand } from "@/components/site/ClientLogosBand";
import { useI18n } from "@/lib/i18n";
import { Reveal } from "@/components/motion";
import { Container, GoldButton } from "@/components/site/kit";
import { ArrowRight } from "lucide-react";

/**
 * Page d'accueil (hub) — architecture multi-pages :
 * hero, chiffres clés et appel à l'action final.
 * Chaque page du site (services, logiciels, tarifs, blog…) est
 * atteinte via le menu de navigation — pas de grille de cartes ici.
 */
export function HomePage() {
  const { t } = useI18n();
  return (
    <>
      <Hero />
      {/* Bande déroulante des clients réalisés (preuve sociale immédiate) */}
      <ClientLogosBand />
      <StatsSection />

      {/* Appel à l'action final */}
      <section className="relative overflow-hidden bg-bg py-20 md:py-28">
        <Container className="text-center">
          <Reveal y={16} duration={0.7}>
            <h2 className="display-2 mx-auto max-w-3xl">
              {t("contact.title")}{" "}
              <em className="font-serif italic text-goldtext">{t("contact.tGold")}</em>
            </h2>
          </Reveal>
          <Reveal delay={0.15} y={14} duration={0.7}>
            <p className="lead-text mx-auto mt-4 max-w-xl">{t("contact.sub")}</p>
          </Reveal>
          <Reveal delay={0.25} y={14} duration={0.7}>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <GoldButton href="/contact" magnetic>
                {t("nav.cta")}
                <ArrowRight size={16} strokeWidth={1.5} aria-hidden />
              </GoldButton>
              <GoldButton href="/tarifs" variant="outline">
                {t("nav.tarifs")}
              </GoldButton>
            </div>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
