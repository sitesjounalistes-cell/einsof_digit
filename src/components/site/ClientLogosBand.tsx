"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/site/kit";
import { Reveal } from "@/components/motion";
import { useI18n } from "@/lib/i18n";
import { trackCta } from "@/lib/analytics";
import { WORKS } from "@/lib/pages-content/works";

interface PartnerLogoRow {
  id: string;
  name: string;
  logoUrl: string | null;
  websiteUrl: string | null;
}

/**
 * Bandeau déroulant (page d'accueil) : si l'Espace équipe contient des
 * partenaires actifs avec un vrai logo (GET /api/partners), le bandeau
 * défile avec ces logos réels ; sinon repli fidèle sur les travaux
 * statiques (works.ts) — inchangé.
 * Données réelles fournies par le client — aucune invention (règle §20.4).
 */
export function ClientLogosBand() {
  const { t } = useI18n();
  /* null = en cours de chargement ; [] = pas de partenaire logoté → repli statique */
  const [partners, setPartners] = useState<PartnerLogoRow[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/partners")
      .then((r) => (r.ok ? r.json() : null))
      .then((j: { ok: boolean; data?: PartnerLogoRow[] } | null) => {
        if (cancelled) return;
        const rows = j?.ok && Array.isArray(j.data) ? j.data : [];
        setPartners(rows.filter((p) => p.logoUrl && p.logoUrl.trim() !== ""));
      })
      .catch(() => {
        if (!cancelled) setPartners([]);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section aria-label={t("clients.label")} className="border-y border-line bg-surface/40 py-8">
      <Container>
        <Reveal y={10} duration={0.6}>
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            <p className="label-caps">{t("clients.label")}</p>
            <span aria-hidden className="hidden h-px w-10 bg-gold/40 sm:block" />
            <Link
              href="/realisations"
              className="link-gold inline-flex min-h-[32px] items-center gap-1.5 text-[0.75rem] font-semibold uppercase tracking-[0.14em] text-goldtext"
            >
              {t("clients.cta")}
              <ArrowRight size={13} strokeWidth={1.5} aria-hidden />
            </Link>
          </div>
        </Reveal>

        {partners && partners.length > 0 ? (
          /* Logos partenaires réels — même marquee (piste doublée, boucle -50 %) */
          <Reveal delay={0.1} y={12} duration={0.7}>
            <div className="marquee-paused mt-6 overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_8%,black_92%,transparent)]">
              <div
                className="marquee-track items-center gap-0"
                style={{ ["--marquee-duration" as string]: "42s" }}
              >
                {[...partners, ...partners].map((p, i) => (
                  <div
                    key={`partner-${p.id}-${i}`}
                    className="flex items-center"
                    aria-hidden={i >= partners.length}
                  >
                    {p.websiteUrl ? (
                      <a
                        href={p.websiteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        tabIndex={i >= partners.length ? -1 : undefined}
                        onClick={() => trackCta("clients-band", `partner:${p.id}`)}
                        className="flex h-16 min-w-[190px] items-center justify-center px-7"
                        title={p.name}
                      >
                        <Image
                          src={p.logoUrl!}
                          alt={p.name}
                          width={170}
                          height={48}
                          className="h-12 w-auto object-contain opacity-70 grayscale transition-all duration-500 hover:scale-105 hover:opacity-100 hover:grayscale-0"
                          unoptimized
                        />
                      </a>
                    ) : (
                      <div
                        className="flex h-16 min-w-[190px] items-center justify-center px-7"
                        title={p.name}
                      >
                        <Image
                          src={p.logoUrl!}
                          alt={p.name}
                          width={170}
                          height={48}
                          className="h-12 w-auto object-contain opacity-70 grayscale transition-all duration-500 hover:scale-105 hover:opacity-100 hover:grayscale-0"
                          unoptimized
                        />
                      </div>
                    )}
                    <span aria-hidden className="h-1.5 w-1.5 shrink-0 rounded-full bg-gold/30" />
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        ) : (
          /* Repli statique : les clients réalisés (works.ts) — inchangé */
          <StaticWorksBand />
        )}
      </Container>
    </section>
  );
}

/** Bandeau statique historique (works.ts) — conservation à l'identique. */
function StaticWorksBand() {
  const { t } = useI18n();
  const items = [...WORKS, ...WORKS]; /* piste doublée pour la boucle -50 % */

  return (
    <Reveal delay={0.1} y={12} duration={0.7}>
      <div className="marquee-paused mt-6 overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_8%,black_92%,transparent)]">
        <div className="marquee-track items-center gap-0" style={{ ["--marquee-duration" as string]: "42s" }}>
          {items.map((w, i) => (
            <div key={`${w.slug}-${i}`} className="flex items-center" aria-hidden={i >= WORKS.length}>
              <a
                href={w.url}
                target="_blank"
                rel="noopener noreferrer"
                tabIndex={i >= WORKS.length ? -1 : undefined}
                onClick={() => trackCta("clients-band", w.slug)}
                className="flex h-16 min-w-[190px] items-center justify-center px-7"
                title={w.name}
              >
                {w.logo ? (
                  <Image
                    src={w.logo}
                    alt={w.name}
                    width={170}
                    height={64}
                    className="h-11 w-auto object-contain opacity-70 grayscale transition-all duration-500 hover:scale-105 hover:opacity-100 hover:grayscale-0 dark:opacity-85 dark:brightness-0 dark:invert dark:hover:opacity-100 dark:hover:brightness-100 dark:hover:invert-0"
                    unoptimized
                  />
                ) : (
                  <span className="whitespace-nowrap font-serif text-xl tracking-wide text-ink/60 transition-all duration-500 hover:scale-105 hover:text-goldtext">
                    {w.name}
                  </span>
                )}
              </a>
              <span aria-hidden className="h-1.5 w-1.5 shrink-0 rounded-full bg-gold/30" />
            </div>
          ))}
        </div>
      </div>
    </Reveal>
  );
}
