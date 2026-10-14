"use client";

import { Reveal, VelocityRow } from "@/components/motion";
import { Container, Section, SectionHeading } from "@/components/site/kit";
import { useI18n } from "@/lib/i18n";

export function SectorsSection() {
  const { t, tr } = useI18n();
  const items = tr<string[]>("sectors.items") ?? [];

  return (
    <Section id="sectors">
      <Container>
        <SectionHeading
          align="center"
          label={t("sectors.label")}
          title={t("sectors.title")}
          gold={t("sectors.tGold")}
          sub={t("sectors.sub")}
        />

        <Reveal variant="blur">
          <div className="relative">
            {/* Ruban réactif : accélère et s'inverse avec la vitesse de défilement */}
            <VelocityRow baseVelocity={1.8}>
              {items.map((label) => (
                <span
                  key={label}
                  className="group mx-3 inline-flex cursor-default items-center gap-3 rounded-full border border-line bg-surface px-6 py-3 text-sm text-mute transition-all duration-300 hover:-translate-y-1 hover:border-gold/60 hover:text-goldtext"
                >
                  <span
                    aria-hidden
                    className="h-1.5 w-1.5 rounded-full bg-gold transition-transform duration-300 group-hover:scale-[1.9]"
                  />
                  {label}
                </span>
              ))}
            </VelocityRow>

            {/* fondus latéraux discrets */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-bg to-transparent md:w-32"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-bg to-transparent md:w-32"
            />
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}
