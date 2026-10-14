"use client";

import Image from "next/image";
import { Reveal } from "@/components/motion";
import { Container, GoldBadge, GoldButton, Section } from "@/components/site/kit";
import { scrollToSection } from "@/lib/chat-bus";
import { trackCta } from "@/lib/analytics";
import { useI18n } from "@/lib/i18n";

export function AboutSection() {
  const { t, tr } = useI18n();
  const values = tr<{ t: string; d: string }[]>("about.values") ?? [];

  return (
    <Section id="about">
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* Visuel */}
          <Reveal delay={120} className="order-2 lg:order-1">
            <div className="relative">
              <div
                aria-hidden
                className="absolute -inset-3 -z-10 rounded-3xl border border-gold/15"
              />
              <Image
                src="/images/about-sculpture.png"
                width={800}
                height={800}
                alt=""
                className="h-auto w-full rounded-2xl border border-gold/20 object-cover"
              />
              <GoldBadge className="absolute -bottom-4 left-6">{t("about.teamNote")}</GoldBadge>
            </div>
          </Reveal>

          {/* Texte */}
          <Reveal className="order-1 lg:order-2">
            <p className="label-caps">{t("about.label")}</p>
            <h2 className="display-2 mt-3">
              {t("about.title")}{" "}
              <em className="gold-text-gradient font-serif italic">{t("about.tGold")}</em>
            </h2>
            <p className="mt-5 text-mute">{t("about.p1")}</p>
            <p className="mt-3 text-mute">{t("about.p2")}</p>

            <h3 className="label-caps mt-8">{t("about.valuesT")}</h3>
            <dl className="mt-4 grid gap-4 sm:grid-cols-2">
              {values.map((v) => (
                <div key={v.t} className="rounded-lg border border-line bg-surface p-4">
                  <dt className="font-serif text-lg text-ink">{v.t}</dt>
                  <dd className="mt-1 text-xs text-mute">{v.d}</dd>
                </div>
              ))}
            </dl>

            <div className="mt-8 flex items-center gap-4">
              <GoldButton
                onClick={() => {
                  scrollToSection("contact");
                  trackCta("about", "cta");
                }}
              >
                {t("about.cta")}
              </GoldButton>
              <span className="text-sm text-mute">{t("about.ctaSub")}</span>
            </div>
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}

export default AboutSection;
