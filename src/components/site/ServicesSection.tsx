"use client";

import {
  ArrowUpRight,
  Boxes,
  Code2,
  Compass,
  Globe,
  GraduationCap,
  Megaphone,
  Target,
  type LucideIcon,
} from "lucide-react";
import {
  Beam,
  DrawRule,
  PopIn,
  PulseGlow,
  SpotlightCard,
  Stagger,
  StaggerItem,
  Tilt,
} from "@/components/motion";
import { Container, GoldBadge, GoldButton, Section, SectionHeading } from "@/components/site/kit";
import { useI18n } from "@/lib/i18n";
import { openForm } from "@/lib/chat-bus";
import { trackCta } from "@/lib/analytics";
import { formatGNF } from "@/lib/catalog";

type ServiceKey =
  | "web"
  | "software"
  | "saas"
  | "community"
  | "acquisition"
  | "training"
  | "strategy";

const SERVICE_KEYS: readonly ServiceKey[] = [
  "web",
  "software",
  "saas",
  "community",
  "acquisition",
  "training",
  "strategy",
];

const SERVICE_ICONS: Record<ServiceKey, LucideIcon> = {
  web: Globe,
  software: Code2,
  saas: Boxes,
  community: Megaphone,
  acquisition: Target,
  training: GraduationCap,
  strategy: Compass,
};

/* Tarifs EXACTS du cahier des charges (§19) — formatGNF seul autorisé. */
export function ServicesSection({ heading = true }: { heading?: boolean }) {
  const { t, tr } = useI18n();

  const priceFor = (key: ServiceKey): string | null => {
    switch (key) {
      case "web":
        return `${t("common.from")} ${formatGNF(1_500_000)}`;
      case "software":
        return `${t("common.from")} ${formatGNF(20_000_000)}`;
      case "saas":
        return `${t("common.from")} ${formatGNF(100_000)} ${t("pricing.perMonth")}`;
      case "community":
      case "acquisition":
      case "training":
        return t("pricing.quoteLabel");
      case "strategy":
        return null;
    }
  };

  const items = SERVICE_KEYS.map((key) => {
    const data = tr<{ name: string; desc: string }>(`services.items.${key}`);
    return data ? { key, name: data.name, desc: data.desc } : null;
  }).filter((v): v is { key: ServiceKey; name: string; desc: string } => v !== null);

  return (
    <Section id="services">
      <Container>
        {heading && (

          <SectionHeading
          label={t("services.label")}
          title={t("services.title")}
          gold={t("services.tGold")}
          sub={t("services.sub")}
        />

        )}

        <div className="relative">
          <Stagger
            className="relative z-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
            step={0.08}
          >
            {items.map((s, i) => {
              const Icon = SERVICE_ICONS[s.key];
              const price = priceFor(s.key);
              const isStrategy = s.key === "strategy";
              return (
                <StaggerItem key={s.key} className="h-full">
                  <Tilt className="h-full">
                    <button
                      type="button"
                      onClick={() => {
                        openForm("quote", { subject: s.name });
                        trackCta("services", s.key);
                      }}
                      className="block h-full w-full cursor-pointer text-left"
                    >
                      <Beam always={isStrategy} className="h-full rounded-xl">
                        <SpotlightCard className="h-full rounded-xl">
                          <article
                            className={`card-lift group relative h-full overflow-hidden rounded-xl border border-line bg-surface p-6 ${
                              isStrategy ? "opacity-80" : ""
                            }`}
                          >
                            <span
                              aria-hidden
                              className="absolute -top-2 right-3 font-serif text-7xl text-gold opacity-[0.07] transition-opacity duration-500 group-hover:opacity-[0.15]"
                            >
                              {String(i + 1).padStart(2, "0")}
                            </span>

                            <PopIn delay={i * 0.08}>
                              <span className="inline-flex w-fit rounded-full border border-gold/30 p-3 text-gold transition-transform duration-300 group-hover:rotate-6 group-hover:scale-110">
                                <Icon size={24} strokeWidth={1.25} aria-hidden />
                              </span>
                            </PopIn>

                            <h3 className="display-3 mt-5">{s.name}</h3>
                            <p className="mt-2 text-sm leading-relaxed text-mute">{s.desc}</p>

                            <div className="mt-4">
                              {price ? (
                                <p className="text-[0.8125rem] font-medium text-goldtext">{price}</p>
                              ) : (
                                <PulseGlow>
                                  <GoldBadge>{t("services.items.strategy.badge")}</GoldBadge>
                                </PulseGlow>
                              )}
                            </div>

                            <ArrowUpRight
                              size={20}
                              strokeWidth={1.25}
                              aria-hidden
                              className="absolute bottom-6 right-6 text-gold transition-[transform,color] duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-goldlight"
                            />
                          </article>
                        </SpotlightCard>
                      </Beam>
                    </button>
                  </Tilt>
                </StaggerItem>
              );
            })}
          </Stagger>
        </div>

        <DrawRule className="mt-14 h-px w-full" delay={0.1} />

        <div className="mt-10 text-center">
          <GoldButton
            onClick={() => {
              openForm("quote");
              trackCta("services", "cta");
            }}
          >
            {t("services.cta")}
          </GoldButton>
        </div>
      </Container>
    </Section>
  );
}
