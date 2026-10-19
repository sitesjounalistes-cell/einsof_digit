"use client";

import {
  ArrowRight,
  ArrowUpRight,
  Boxes,
  Code2,
  Compass,
  Globe,
  GraduationCap,
  Images,
  Megaphone,
  Target,
  type LucideIcon,
} from "lucide-react";
import Image from "next/image";
import {
  Beam,
  DrawRule,
  PulseGlow,
  SpotlightCard,
} from "@/components/motion";
import { Container, GoldBadge, GoldButton, Section, SectionHeading } from "@/components/site/kit";
import { CoverflowCarousel } from "@/components/site/CoverflowCarousel";
import { useI18n } from "@/lib/i18n";
import { openForm } from "@/lib/chat-bus";
import { trackCta } from "@/lib/analytics";
import { formatGNF } from "@/lib/catalog";

/* Visuel illustré de chaque pôle (cartes du carrousel — retour client 17/10 :
   de vraies images, même présentation que les cartes logiciels SaaS). */
const SVC_IMAGE: Record<string, string> = {
  web: "/images/services/svc-web.png",
  software: "/images/services/svc-software.png",
  saas: "/images/services/svc-saas.png",
  community: "/images/services/svc-community.png",
  acquisition: "/images/services/svc-acquisition.png",
  training: "/images/services/svc-training.png",
  strategy: "/images/services/svc-strategy.png",
};

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

/* Slugs des pages de détail /services/[slug] */
const SERVICE_HREF: Record<ServiceKey, string> = {
  web: "/services/web",
  software: "/services/software",
  saas: "/services/saas",
  community: "/services/community",
  acquisition: "/services/acquisition",
  training: "/services/training",
  strategy: "/services/strategy",
};

/* Tarifs EXACTS du cahier des charges (§19) — formatGNF seul autorisé. */
export function ServicesSection({ heading = true }: { heading?: boolean }) {
  const { t } = useI18n();

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
    const data = t(`services.items.${key}.name`);
    const desc = t(`services.items.${key}.desc`);
    return data ? { key, name: data, desc } : null;
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

        {/* Carrousel coverflow : la carte centrale s'impose, un clic ouvre la page du pôle */}
        <CoverflowCarousel
          ariaLabel={t("services.title")}
          viewportClassName="h-[480px] sm:h-[520px]"
          items={items.map((s) => ({
            key: s.key,
            href: SERVICE_HREF[s.key],
            ariaLabel: `${s.name} — ${t("services.discover")}`,
          }))}
          renderItem={(item, { active }) => {
            const s = items.find((x) => x.key === item.key)!;
            const i = items.indexOf(s);
            const Icon = SERVICE_ICONS[s.key];
            const price = priceFor(s.key);
            const isStrategy = s.key === "strategy";
            return (
              <Beam always={active || isStrategy} className="h-full rounded-xl">
                <SpotlightCard className="h-full rounded-xl">
                  <div
                    className={`card-lift group relative flex h-full flex-col overflow-hidden rounded-xl border bg-surface transition-colors duration-500 ${
                      active ? "border-gold/50" : "border-line"
                    }`}
                  >
                    <span
                      aria-hidden
                      className="absolute right-4 top-4 z-10 font-serif text-5xl text-gold opacity-[0.18] transition-opacity duration-500 group-hover:opacity-30"
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>

                    {/* Visuel du pôle (photo illustrée) */}
                    <div className="relative aspect-[16/10] shrink-0 overflow-hidden">
                      <Image
                        src={SVC_IMAGE[s.key]}
                        alt={s.name}
                        fill
                        sizes="(max-width: 640px) 80vw, 350px"
                        className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
                      />
                      <div
                        aria-hidden
                        className="absolute inset-0 bg-gradient-to-t from-bg via-transparent to-transparent"
                      />
                      {/* badge icône en superposition du visuel */}
                      <span className="absolute bottom-3 left-4 z-10 inline-flex rounded-full border border-gold/40 bg-deep/80 p-2.5 text-gold backdrop-blur-sm">
                        <Icon size={18} strokeWidth={1.25} aria-hidden />
                      </span>
                    </div>

                    <h3 className="display-3 mt-5 px-6">{s.name}</h3>
                    <p className="mt-2 px-6 text-sm leading-relaxed text-mute">{s.desc}</p>

                    <div className="mt-4 px-6">
                      {price ? (
                        <p className="text-[0.8125rem] font-medium text-goldtext">{price}</p>
                      ) : (
                        <PulseGlow>
                          <GoldBadge>{t("services.items.strategy.badge")}</GoldBadge>
                        </PulseGlow>
                      )}
                    </div>

                    {/* Pied de carte : invitation à ouvrir la page du pôle */}
                    <span
                      aria-hidden
                      className="mt-auto inline-flex items-center gap-2 px-6 pb-6 pt-6 text-[0.75rem] font-semibold uppercase tracking-[0.14em] text-goldtext"
                    >
                      {t("services.discover")}
                      <ArrowRight
                        size={14}
                        strokeWidth={1.5}
                        className="transition-transform duration-300 group-hover:translate-x-1"
                      />
                    </span>
                    <ArrowUpRight
                      size={20}
                      strokeWidth={1.25}
                      aria-hidden
                      className="absolute bottom-6 right-6 text-gold opacity-0 transition-[opacity,transform] duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:opacity-100"
                    />
                  </div>
                </SpotlightCard>
              </Beam>
            );
          }}
        />

        <DrawRule className="mt-14 h-px w-full" delay={0.1} />

        <div className="mt-10 flex flex-col items-center gap-3 text-center">
          <GoldButton
            onClick={() => {
              openForm("quote");
              trackCta("services", "cta");
            }}
          >
            {t("services.cta")}
          </GoldButton>
          <p className="inline-flex items-center gap-2 text-xs text-mute">
            <Images size={14} strokeWidth={1.25} aria-hidden className="text-gold" />
            {t("services.carouselHint")}
          </p>
        </div>
      </Container>
    </Section>
  );
}
