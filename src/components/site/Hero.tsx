"use client";

import { useSyncExternalStore } from "react";
import Image from "next/image";
import { MessageCircle, Sparkles } from "lucide-react";
import { Container, GoldBadge, GoldButton } from "@/components/site/kit";
import { Reveal, WordMask } from "@/components/motion";
import { GoldParticles, Spotlight } from "@/components/motion/gold-particles";
import { useI18n } from "@/lib/i18n";
import { openChat, scrollToSection } from "@/lib/chat-bus";
import { trackCta } from "@/lib/analytics";

/* Abonnement factice — lecture d'une valeur « snapshot » uniquement */
const subscribeNoop = () => () => {};

export function Hero() {
  const { t } = useI18n();
  /* salutation calculée côté client (useSyncExternalStore : aucun écart d'hydratation) */
  const period = useSyncExternalStore(
    subscribeNoop,
    () => {
      const h = new Date().getHours();
      return h < 12 ? "morning" : h < 18 ? "afternoon" : "evening";
    },
    () => ""
  );
  const greeting = period ? t(`hero.${period}`) : "";

  return (
    <section
      id="section-hero"
      data-section-id="hero"
      className="relative flex min-h-[100svh] items-center overflow-hidden"
    >
      {/* (a) image obsidienne */}
      <Image
        src="/images/hero-obsidienne.png"
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover opacity-40 dark:opacity-30"
      />
      {/* (b) voiles dégradés */}
      <div aria-hidden className="absolute inset-0 bg-gradient-to-b from-bg/80 via-bg/60 to-bg" />
      <div aria-hidden className="absolute inset-0 bg-gradient-to-r from-bg/70 to-transparent" />
      {/* (c) particules d'or + halo */}
      <GoldParticles />
      <Spotlight />

      {/* (d) contenu */}
      <Container className="relative z-10 pb-28 pt-28 md:pb-32 md:pt-36">
        <div className="max-w-3xl">
          <Reveal>
            <GoldBadge className="mb-6">
              <Sparkles size={14} strokeWidth={1.25} aria-hidden />
              {t("hero.badge")}
            </GoldBadge>
          </Reveal>

          <p className="label-caps">
            {greeting ? `${greeting} — ` : ""}
            {t("hero.label")}
          </p>

          <h1 className="display-1 mt-4">
            <WordMask text={t("hero.t1")} />
            <em className="gold-text-gradient mt-1 block font-serif italic">
              <WordMask text={t("hero.tGold")} delay={400} />
            </em>
          </h1>

          <Reveal delay={200}>
            <p className="lead-text mt-6 max-w-xl">{t("hero.sub")}</p>
          </Reveal>

          <Reveal delay={350}>
            <div className="mt-10 flex flex-wrap gap-4">
              <GoldButton
                variant="primary"
                magnetic
                onClick={() => {
                  trackCta("hero", "cta-primary");
                  scrollToSection("contact");
                }}
              >
                {t("hero.ctaPrimary")}
              </GoldButton>
              <GoldButton
                variant="outline"
                onClick={() => {
                  trackCta("hero", "chat");
                  openChat();
                }}
              >
                <MessageCircle size={16} strokeWidth={1.25} aria-hidden />
                {t("hero.ctaChat")}
              </GoldButton>
            </div>
          </Reveal>
        </div>
      </Container>

      {/* indicateur de défilement */}
      <div className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-3">
        <div aria-hidden className="scroll-indicator-line h-12 w-px bg-gold" />
        <span className="label-caps">{t("hero.scroll")}</span>
      </div>
    </section>
  );
}
