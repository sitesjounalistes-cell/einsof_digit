"use client";

import { useSyncExternalStore } from "react";
import Image from "next/image";
import { MessageCircle, Sparkles } from "lucide-react";
import { Container, GoldBadge, GoldButton } from "@/components/site/kit";
import { Float, Parallax, PulseGlow, Stagger, StaggerItem, WordMask } from "@/components/motion";
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
      {/* (a) image obsidienne — parallaxe lente pour la profondeur */}
      <Parallax speed={0.15} className="absolute -inset-y-10 inset-x-0">
        <Image
          src="/images/hero-obsidienne.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-40 dark:opacity-30"
        />
      </Parallax>
      {/* (b) voiles dégradés */}
      <div aria-hidden className="absolute inset-0 bg-gradient-to-b from-bg/80 via-bg/60 to-bg" />
      <div aria-hidden className="absolute inset-0 bg-gradient-to-r from-bg/70 to-transparent" />
      {/* (c) particules d'or + halo */}
      <GoldParticles />
      <Spotlight />

      {/* (c3) anneaux dorés décoratifs — rotation lente opposée, lévitation, pulsation */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 -right-16 z-[5] hidden items-center xl:right-0 2xl:right-8 lg:flex"
      >
        <Float y={14} duration={9}>
          <PulseGlow duration={6}>
            <span className="relative block h-[26rem] w-[26rem] xl:h-[30rem] xl:w-[30rem]">
              <svg
                viewBox="0 0 400 400"
                fill="none"
                className="spin-slower absolute inset-0 h-full w-full"
              >
                <circle cx="200" cy="200" r="196" stroke="var(--gold)" strokeOpacity="0.14" />
                <circle
                  cx="200"
                  cy="200"
                  r="196"
                  stroke="var(--gold)"
                  strokeOpacity="0.38"
                  strokeWidth="1.5"
                  strokeDasharray="64 620"
                  strokeLinecap="round"
                />
              </svg>
              <svg
                viewBox="0 0 400 400"
                fill="none"
                className="spin-reverse absolute inset-0 h-full w-full"
              >
                <circle
                  cx="200"
                  cy="200"
                  r="152"
                  stroke="var(--gold)"
                  strokeOpacity="0.1"
                  strokeDasharray="2 9"
                />
                <circle
                  cx="200"
                  cy="200"
                  r="152"
                  stroke="var(--gold)"
                  strokeOpacity="0.26"
                  strokeWidth="1.5"
                  strokeDasharray="42 470"
                  strokeLinecap="round"
                />
              </svg>
              <span className="absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold/50" />
            </span>
          </PulseGlow>
        </Float>
      </div>

      {/* (d) contenu — contre-parallaxe + entrée orchestrée (rideau : ~1 s) */}
      <Parallax speed={-0.08} className="relative z-10 w-full">
        <Container className="pb-28 pt-28 md:pb-32 md:pt-36">
          <Stagger className="max-w-3xl" delay={0.95} step={0.16}>
            {/* 1 — badge */}
            <StaggerItem y={18}>
              <PulseGlow duration={4}>
                <GoldBadge>
                  <Sparkles size={14} strokeWidth={1.25} aria-hidden />
                  {t("hero.badge")}
                </GoldBadge>
              </PulseGlow>
            </StaggerItem>

            {/* 2 — surtitre */}
            <StaggerItem y={16} className="mt-6">
              <p className="label-caps">
                {greeting ? `${greeting} — ` : ""}
                {t("hero.label")}
              </p>
            </StaggerItem>

            {/* 3 — titre mot à mot (masques verticaux, dégradé or par mot) */}
            <h1 className="display-1 mt-4">
              <WordMask text={t("hero.t1")} delay={1.15} step={0.09} />
              <em className="mt-1 block font-serif italic">
                <WordMask text={t("hero.tGold")} gold delay={1.75} step={0.1} />
              </em>
            </h1>

            {/* 4 — sous-titre */}
            <StaggerItem y={20} className="mt-6">
              <p className="lead-text max-w-xl">{t("hero.sub")}</p>
            </StaggerItem>

            {/* 5 — appels à l'action */}
            <StaggerItem y={22} className="mt-10">
              <div className="flex flex-wrap gap-4">
                <GoldButton
                  variant="primary"
                  magnetic
                  className="glow-pulse"
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
            </StaggerItem>
          </Stagger>
        </Container>
      </Parallax>

      {/* indicateur de défilement — lévitation douce */}
      <Float y={4} duration={3.2} className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2">
        <div className="flex flex-col items-center gap-3">
          <div aria-hidden className="scroll-indicator-line h-12 w-px bg-gold" />
          <span className="label-caps">{t("hero.scroll")}</span>
        </div>
      </Float>
    </section>
  );
}
