"use client";

import Image from "next/image";
import {
  Beam,
  Counter,
  Float,
  Parallax,
  Reveal,
  Shimmer,
  Stagger,
  StaggerItem,
} from "@/components/motion";
import { Container, GoldBadge, GoldButton, Section } from "@/components/site/kit";
import { trackCta } from "@/lib/analytics";
import { useI18n } from "@/lib/i18n";

/**
 * À propos — chorégraphie riche (task 12-d) :
 * visuel en parallaxe liée au défilement + anneaux or en lévitation,
 * texte orchestré en Stagger, mot clé doré en Shimmer,
 * chiffres clés animés (uniquement les nombres déjà présents : 7 ans, 10 experts),
 * valeurs en entrées échelonnées.
 */
export function AboutSection() {
  const { t, tr } = useI18n();
  const values = tr<{ t: string; d: string }[]>("about.values") ?? [];

  return (
    <Section id="about">
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Visuel — parallaxe + ornements flottants */}
          <Parallax speed={0.2} className="order-2 lg:order-1">
            <Reveal variant="scale" duration={1} delay={0.1}>
              <div className="relative">
                {/* Ornement : anneaux or en rotation lente, derrière l'image */}
                <Float
                  y={12}
                  duration={7}
                  className="pointer-events-none absolute -right-6 -top-9 z-0 hidden sm:block"
                >
                  <div aria-hidden className="relative h-36 w-36 md:h-44 md:w-44">
                    <div className="spin-slower absolute inset-0 rounded-full border border-gold/20" />
                    <div className="spin-reverse absolute inset-4 rounded-full border border-dashed border-gold/10" />
                  </div>
                </Float>

                <Beam className="relative z-10 rounded-2xl">
                  <Image
                    src="/images/about-sculpture.png"
                    width={800}
                    height={800}
                    alt=""
                    className="h-auto w-full rounded-2xl border border-gold/30 object-cover transition-transform duration-700 ease-out hover:scale-[1.03]"
                  />
                </Beam>
                <GoldBadge className="absolute -bottom-4 left-6 z-20">
                  {t("about.teamNote")}
                </GoldBadge>
              </div>
            </Reveal>
          </Parallax>

          {/* Texte — orchestration Stagger */}
          <Stagger as="div" className="order-1 lg:order-2" step={0.09} delay={0.05}>
            <StaggerItem y={18}>
              <p className="label-caps">{t("about.label")}</p>
            </StaggerItem>

            <StaggerItem y={26}>
              <h2 className="display-2 mt-3">
                {t("about.title")}{" "}
                <em className="font-serif italic">
                  <Shimmer>{t("about.tGold")}</Shimmer>
                </em>
              </h2>
            </StaggerItem>

            <StaggerItem y={22}>
              <p className="mt-5 text-mute">{t("about.p1")}</p>
            </StaggerItem>
            <StaggerItem y={22}>
              <p className="mt-3 text-mute">{t("about.p2")}</p>
            </StaggerItem>

            {/* Chiffres clés — uniquement les nombres déjà dans le contenu (7 ans, 10 experts) */}
            <StaggerItem y={20}>
              <div className="mt-8 grid max-w-md grid-cols-2 gap-4">
                <div className="rounded-lg border border-line bg-surface p-4">
                  <p className="font-serif text-4xl font-medium text-goldtext">
                    <Counter to={7} />
                  </p>
                  <p className="mt-1 text-xs uppercase tracking-[0.14em] text-mute">
                    {t("stats.years")}
                  </p>
                </div>
                <div className="rounded-lg border border-line bg-surface p-4">
                  <p className="font-serif text-4xl font-medium text-goldtext">
                    <Counter to={10} />
                  </p>
                  <p className="mt-1 text-xs uppercase tracking-[0.14em] text-mute">
                    {t("stats.experts")}
                  </p>
                </div>
              </div>
            </StaggerItem>

            <StaggerItem y={20}>
              <h3 className="label-caps mt-8">{t("about.valuesT")}</h3>
              <dl className="mt-4 grid gap-4 sm:grid-cols-2">
                {values.map((v, i) => (
                  <Reveal key={v.t} delay={i * 0.08} y={20} className="h-full">
                    <div className="group h-full rounded-lg border border-line bg-surface p-4 transition-all duration-300 hover:-translate-y-1 hover:border-gold/40">
                      <dt className="font-serif text-lg text-ink transition-colors duration-300 group-hover:text-goldtext">
                        {v.t}
                      </dt>
                      <dd className="mt-1 text-xs leading-relaxed text-mute">{v.d}</dd>
                    </div>
                  </Reveal>
                ))}
              </dl>
            </StaggerItem>

            <StaggerItem y={22}>
              <div className="mt-9 flex flex-wrap items-center gap-4">
                <GoldButton
                  href="/contact"
                  onClick={() => {
                    trackCta("about", "cta");
                  }}
                >
                  {t("about.cta")}
                </GoldButton>
                <span className="text-sm text-mute">{t("about.ctaSub")}</span>
              </div>
            </StaggerItem>
          </Stagger>
        </div>
      </Container>
    </Section>
  );
}

export default AboutSection;
