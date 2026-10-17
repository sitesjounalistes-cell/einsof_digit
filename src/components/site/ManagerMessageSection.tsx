"use client";

import { useEffect, useState } from "react";
import { Container, Section, SectionHeading } from "@/components/site/kit";
import { Reveal, DrawRule } from "@/components/motion";
import { useI18n } from "@/lib/i18n";
import { BRAND_INITIAL } from "@/lib/brand";
import {
  DEFAULT_SITE_SETTINGS,
  type SiteSettingsData,
} from "@/lib/site-settings-defaults";

/**
 * Section « Mot du gérant » (page À propos).
 * Données : /api/site-settings — l'API renvoie TOUJOURS un objet complet
 * (texte officiel par défaut si rien n'est configuré), donc le bloc
 * s'affiche dans tous les cas. Photo arrondie à bordure or si fournie,
 * sinon monogramme « E » doré sur fond surface2. Message : 2 paragraphes
 * (séparés par une ligne vide) avec guillemet décoratif serif.
 */
export function ManagerMessageSection() {
  const { t } = useI18n();
  /* Défauts immédiats (rendu instantané), puis réglages réels dès chargé. */
  const [settings, setSettings] = useState<SiteSettingsData>(DEFAULT_SITE_SETTINGS);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/site-settings", { cache: "no-store" })
      .then(async (res) => {
        if (!res.ok) return;
        const json = (await res.json()) as { ok: boolean; data?: SiteSettingsData };
        if (!cancelled && json.ok && json.data) setSettings(json.data);
      })
      .catch(() => {
        /* réseau indisponible — le texte par défaut reste affiché */
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const paragraphs = settings.managerMessageFr
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <Section id="mot-gerant" tone="bg">
      <Container>
        <SectionHeading
          label={t("manager.label")}
          title={t("manager.title")}
          gold={t("manager.gold")}
        />

        <div className="grid items-start gap-10 md:grid-cols-[260px_1fr] md:gap-14 lg:gap-20">
          {/* ── Colonne portrait ─────────────────────────────── */}
          <Reveal y={20} duration={0.7} className="mx-auto text-center md:mx-0 md:text-left">
            <div className="relative inline-block">
              {/* Halo or discret derrière le portrait */}
              <span
                aria-hidden
                className="absolute -inset-3 rounded-full bg-[radial-gradient(circle,rgba(212,175,55,0.14),transparent_70%)]"
              />
              {settings.managerPhotoUrl ? (
                <img
                  src={settings.managerPhotoUrl}
                  alt={settings.managerPhotoAlt || "Portrait du gérant d'EINSOF"}
                  className="relative h-40 w-40 rounded-full border border-gold/50 object-cover shadow-[0_0_40px_rgba(212,175,55,0.18)] md:h-52 md:w-52"
                  loading="lazy"
                />
              ) : (
                /* Repli élégant : monogramme « E » doré sur fond surface2 */
                <span
                  aria-hidden
                  className="relative flex h-40 w-40 items-center justify-center rounded-full border border-gold/40 bg-surface2 md:h-52 md:w-52"
                >
                  <span className="font-serif text-6xl font-semibold text-goldtext md:text-7xl">
                    {BRAND_INITIAL}
                  </span>
                </span>
              )}
            </div>

            <p className="mt-6 font-serif text-xl leading-snug text-ink">
              {settings.managerName}
            </p>
            <p className="label-caps mt-2 text-[0.6875rem] text-goldtext">
              {settings.managerRole}
            </p>
          </Reveal>

          {/* ── Colonne message ──────────────────────────────── */}
          <Reveal y={24} delay={0.12} duration={0.8} className="relative">
            {/* Guillemet décoratif serif */}
            <span
              aria-hidden
              className="pointer-events-none absolute -top-10 left-0 select-none font-serif text-[7rem] leading-none text-gold/25 md:-top-14 md:text-[9rem]"
            >
              «
            </span>

            <div className="relative space-y-6 pt-6 md:pt-10">
              {paragraphs.map((p, i) => (
                <p
                  key={i}
                  className={
                    i === 0
                      ? "lead-text text-lg leading-relaxed text-ink md:text-xl"
                      : "lead-text leading-relaxed text-mute"
                  }
                >
                  {p}
                </p>
              ))}
            </div>

            <DrawRule className="mt-8 h-px w-24" delay={0.4} />
            <p className="mt-4 font-serif text-lg italic text-goldtext">
              — {settings.managerName}
            </p>
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}

export default ManagerMessageSection;
