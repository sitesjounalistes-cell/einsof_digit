"use client";

import type { ReactNode } from "react";
import { Gem, ShieldCheck } from "lucide-react";
import { DrawRule, Float, PopIn, Reveal, WordMask } from "@/components/motion";
import { Container, Section, SectionHeading } from "@/components/site/kit";
import { useI18n } from "@/lib/i18n";

/* Icône décorative dans des anneaux concentriques dorés */
function GoldRings({ children }: { children: ReactNode }) {
  return (
    <div
      aria-hidden
      className="relative mx-auto flex aspect-square w-56 items-center justify-center sm:w-64 lg:w-72"
    >
      <span
        className="absolute inset-0 rounded-full border border-gold/15"
        style={{ animation: "breathe 9s ease-in-out infinite" }}
      />
      <span className="absolute inset-7 rounded-full border border-gold/25" />
      <span className="absolute inset-14 rounded-full border border-gold/40" />
      {children}
    </div>
  );
}

export function PillarsSection() {
  const { t } = useI18n();

  return (
    <Section id="pillars" tone="deep" className="text-[#f5f2ea]">
      <Container>
        <SectionHeading
          label={t("pillars.label")}
          title={t("pillars.title")}
          gold={t("pillars.tGold")}
        />

        {/* Engagement 01 : texte à gauche, sceau à droite — entrée depuis la gauche */}
        <Reveal variant="left">
          <div className="grid items-start gap-10 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <p className="label-caps">{t("pillars.p1.k")}</p>
              <p className="mt-4 font-serif text-2xl leading-snug md:text-4xl">
                «<WordMask text={t("pillars.p1.t")} delay={0.12} />»
              </p>
              <p className="mt-4 text-mute">{t("pillars.p1.d")}</p>
            </div>
            <div className="lg:col-span-5">
              <Float y={10} duration={7}>
                <GoldRings>
                  <PopIn delay={0.35}>
                    <ShieldCheck size={80} strokeWidth={1} className="text-gold/40" />
                  </PopIn>
                </GoldRings>
              </Float>
            </div>
          </div>
        </Reveal>

        {/* Filet d'or qui se dessine entre les deux engagements */}
        <DrawRule className="my-12 md:my-16" delay={0.1} />

        {/* Engagement 02 : iconographie à gauche, texte à droite — entrée depuis la droite */}
        <Reveal variant="right">
          <div className="grid items-start gap-10 lg:grid-cols-12">
            <div className="lg:order-2 lg:col-span-7">
              <p className="label-caps">{t("pillars.p2.k")}</p>
              <p className="mt-4 font-serif text-2xl leading-snug md:text-4xl">
                «<WordMask text={t("pillars.p2.t")} delay={0.12} />»
              </p>
              <p className="mt-4 text-mute">{t("pillars.p2.d")}</p>
            </div>
            <div className="lg:order-1 lg:col-span-5">
              <Float y={12} duration={8} delay={0.6}>
                <GoldRings>
                  <PopIn delay={0.5}>
                    <Gem size={80} strokeWidth={1} className="text-gold/40" />
                  </PopIn>
                </GoldRings>
              </Float>
            </div>
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}
