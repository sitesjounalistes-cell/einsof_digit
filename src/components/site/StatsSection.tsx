"use client";

import { Counter, Reveal } from "@/components/motion";
import { Container, GoldRule, Section } from "@/components/site/kit";
import { useI18n } from "@/lib/i18n";

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
    <Section id="stats" tone="surface">
      <Container>
        <div className="grid grid-cols-2 gap-10 lg:grid-cols-4">
          {stats.map((s, i) => (
            <Reveal key={s.label} delay={i * 80}>
              <p className="font-serif text-5xl font-medium text-goldtext md:text-6xl">
                <Counter to={s.value} />
              </p>
              <div className="mt-4 w-8">
                <GoldRule />
              </div>
              <p className="mt-3 text-sm text-mute">{s.label}</p>
            </Reveal>
          ))}
        </div>
      </Container>
    </Section>
  );
}
