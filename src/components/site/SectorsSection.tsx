"use client";

import { Marquee, Reveal } from "@/components/motion";
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

        <Reveal>
          <div className="relative">
            <Marquee duration={45}>
              {items.map((label) => (
                <span
                  key={label}
                  className="mx-3 inline-flex items-center gap-3 rounded-full border border-line bg-surface px-6 py-3 text-sm text-mute"
                >
                  <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-gold" />
                  {label}
                </span>
              ))}
            </Marquee>

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
