"use client";

import type { ReactNode } from "react";
import { Gem, ShieldCheck } from "lucide-react";
import { Reveal } from "@/components/motion";
import { Container, GoldRule, Section, SectionHeading } from "@/components/site/kit";
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

        {/* Engagement 01 : texte à gauche, sceau à droite */}
        <Reveal>
          <div className="grid items-start gap-10 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <p className="label-caps">{t("pillars.p1.k")}</p>
              <p className="mt-4 font-serif text-2xl leading-snug md:text-4xl">
                «{t("pillars.p1.t")}»
              </p>
              <p className="mt-4 text-mute">{t("pillars.p1.d")}</p>
            </div>
            <div className="lg:col-span-5">
              <GoldRings>
                <ShieldCheck size={80} strokeWidth={1} className="text-gold/40" />
              </GoldRings>
            </div>
          </div>
        </Reveal>

        <GoldRule className="my-12 md:my-16" />

        {/* Engagement 02 : iconographie à gauche, texte à droite */}
        <Reveal delay={120}>
          <div className="grid items-start gap-10 lg:grid-cols-12">
            <div className="lg:order-2 lg:col-span-7">
              <p className="label-caps">{t("pillars.p2.k")}</p>
              <p className="mt-4 font-serif text-2xl leading-snug md:text-4xl">
                «{t("pillars.p2.t")}»
              </p>
              <p className="mt-4 text-mute">{t("pillars.p2.d")}</p>
            </div>
            <div className="lg:order-1 lg:col-span-5">
              <GoldRings>
                <Gem size={80} strokeWidth={1} className="text-gold/40" />
              </GoldRings>
            </div>
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}
