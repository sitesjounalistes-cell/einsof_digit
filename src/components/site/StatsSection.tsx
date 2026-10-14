"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";
import {
  Counter,
  DrawRule,
  PopIn,
  Reveal,
  Stagger,
  StaggerItem,
} from "@/components/motion";
import { Container, Section } from "@/components/site/kit";
import { useI18n } from "@/lib/i18n";
import { useMotionMode } from "@/components/providers";

/* Carte chiffrée : halo or au survol (card-lift) + léger zoom spring,
   désactivé tel quel en mode « animations réduites ». */
function StatCard({ children }: { children: ReactNode }) {
  const { lightMode } = useMotionMode();
  const cls =
    "card-lift group relative h-full rounded-xl border border-transparent bg-surface/50 px-4 py-7 text-center md:px-6";

  if (lightMode) return <div className={cls}>{children}</div>;

  return (
    <motion.div
      className={cls}
      whileHover={{ scale: 1.035 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
    >
      {children}
    </motion.div>
  );
}

/* Chiffres réels du cahier des charges — ne jamais en inventer d'autres. */
export function StatsSection() {
  const { t } = useI18n();
  const stats = [
    { value: 7, label: t("stats.years") },
    { value: 10, label: t("stats.experts") },
    { value: 5, label: t("stats.langs") },
    { value: 6, label: t("stats.saas") },
  ];

  return (
    <Section id="stats" tone="surface" className="overflow-hidden">
      <Container className="relative">
        {/* filets d'or qui se dessinent, au-dessus et en-dessous du bloc */}
        <DrawRule className="h-px w-full" duration={1.3} />

        <Stagger className="grid grid-cols-2 gap-6 py-14 sm:gap-10 md:py-16 lg:grid-cols-4" step={0.12}>
          {stats.map((s, i) => (
            <StaggerItem key={s.label} y={40}>
              <StatCard>
                {/* chiffre géant — apparition élastique puis compte animé */}
                <PopIn
                  as="p"
                  delay={0.4 + i * 0.12}
                  className="font-serif text-6xl font-medium text-goldtext transition-colors duration-500 group-hover:text-goldlight md:text-7xl"
                >
                  <Counter to={s.value} duration={1800} />
                </PopIn>
                {/* filet qui se dessine sous le chiffre */}
                <DrawRule className="mx-auto mt-4 h-px w-10" delay={0.55 + i * 0.12} />
                {/* libellé — révélation échelonnée */}
                <Reveal delay={0.6 + i * 0.12} y={14} duration={0.7}>
                  <p className="mt-3 text-sm text-mute">{s.label}</p>
                </Reveal>
              </StatCard>
            </StaggerItem>
          ))}
        </Stagger>

        <DrawRule className="h-px w-full" duration={1.3} delay={0.2} />
      </Container>
    </Section>
  );
}
