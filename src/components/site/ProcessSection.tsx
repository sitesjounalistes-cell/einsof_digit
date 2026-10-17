"use client";

import { DrawRule, PopIn, Reveal, Stagger, StaggerItem } from "@/components/motion";
import { Container, Section, SectionHeading } from "@/components/site/kit";
import { useI18n } from "@/lib/i18n";

interface ProcessStep {
  t: string;
  d: string;
}

/* Nœud doré : pop élastique échelonné + anneau ping (délai index × 0,3 s) */
function StepNode({ index }: { index: number }) {
  return (
    <PopIn
      delay={index * 0.12}
      className="relative z-10 flex h-6 w-6 items-center justify-center rounded-full border border-gold bg-bg"
    >
      <span
        aria-hidden
        className="absolute inset-0 animate-ping rounded-full bg-gold/40"
        style={{ animationDelay: `${index * 0.3}s` }}
      />
      <span aria-hidden className="relative h-1.5 w-1.5 rounded-full bg-gold" />
    </PopIn>
  );
}

function StepBody({ n, title, desc }: { n: string; title: string; desc: string }) {
  return (
    <>
      <Reveal variant="scale" y={10} duration={0.7} delay={0.1} className="mt-4">
        <p className="font-serif text-sm text-gold">{n}</p>
      </Reveal>
      <h3 className="display-3 text-lg! mt-1">{title}</h3>
      <p className="mt-2 text-sm text-mute">{desc}</p>
    </>
  );
}

export function ProcessSection({ heading = true }: { heading?: boolean }) {
  const { t, tr } = useI18n();
  const steps = tr<ProcessStep[]>("process.steps") ?? [];

  return (
    <Section id="process">
      <Container>
        {heading && (

          <SectionHeading
          label={t("process.label")}
          title={t("process.title")}
          gold={t("process.tGold")}
          sub={t("process.sub")}
        />

        )}

        {/* Bureau : filet d'or qui se dessine de gauche à droite derrière les nœuds */}
        <div className="relative hidden lg:block">
          <DrawRule className="absolute left-0 right-0 top-3" duration={1.6} />
          <Stagger className="relative grid grid-cols-5 gap-8" step={0.1}>
            {steps.map((s, i) => (
              <StaggerItem key={`d-${i}`}>
                <StepNode index={i} />
                <StepBody n={String(i + 1).padStart(2, "0")} title={s.t} desc={s.d} />
              </StaggerItem>
            ))}
          </Stagger>
        </div>

        {/* Mobile : liste verticale (filet statique) — nœuds pop + ping identiques */}
        <Stagger
          className="relative space-y-8 border-l border-gold/30 pl-6 lg:hidden"
          step={0.1}
        >
          {steps.map((s, i) => (
            <StaggerItem key={`m-${i}`} className="relative pl-8">
              <div aria-hidden className="absolute -left-3 top-0 z-10">
                <StepNode index={i} />
              </div>
              <StepBody n={String(i + 1).padStart(2, "0")} title={s.t} desc={s.d} />
            </StaggerItem>
          ))}
        </Stagger>
      </Container>
    </Section>
  );
}
