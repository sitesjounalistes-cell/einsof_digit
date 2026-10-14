"use client";

import { Reveal } from "@/components/motion";
import { Container, Section, SectionHeading } from "@/components/site/kit";
import { useI18n } from "@/lib/i18n";

interface ProcessStep {
  t: string;
  d: string;
}

function StepBody({ n, title, desc }: { n: string; title: string; desc: string }) {
  return (
    <>
      <p className="mt-4 font-serif text-sm text-gold">{n}</p>
      <h3 className="display-3 text-lg! mt-1">{title}</h3>
      <p className="mt-2 text-sm text-mute">{desc}</p>
    </>
  );
}

export function ProcessSection() {
  const { t, tr } = useI18n();
  const steps = tr<ProcessStep[]>("process.steps") ?? [];

  return (
    <Section id="process">
      <Container>
        <SectionHeading
          label={t("process.label")}
          title={t("process.title")}
          gold={t("process.tGold")}
          sub={t("process.sub")}
        />

        {/* Bureau : filet d'or horizontal derrière les nœuds */}
        <div className="relative hidden lg:block">
          <div aria-hidden className="gold-rule absolute left-0 right-0 top-3" />
          <div className="grid grid-cols-5 gap-8">
            {steps.map((s, i) => (
              <Reveal key={`d-${i}`} delay={i * 80}>
                <div className="relative z-10 flex h-6 w-6 items-center justify-center rounded-full border border-gold bg-bg">
                  <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-gold" />
                </div>
                <StepBody n={String(i + 1).padStart(2, "0")} title={s.t} desc={s.d} />
              </Reveal>
            ))}
          </div>
        </div>

        {/* Mobile : liste verticale sur filet d'or */}
        <div className="space-y-8 border-l border-gold/30 pl-6 lg:hidden">
          {steps.map((s, i) => (
            <Reveal key={`m-${i}`} delay={i * 80} className="relative pl-8">
              <div
                aria-hidden
                className="absolute -left-3 top-0 z-10 flex h-6 w-6 items-center justify-center rounded-full border border-gold bg-bg"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-gold" />
              </div>
              <StepBody n={String(i + 1).padStart(2, "0")} title={s.t} desc={s.d} />
            </Reveal>
          ))}
        </div>
      </Container>
    </Section>
  );
}
