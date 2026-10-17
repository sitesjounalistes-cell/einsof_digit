"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowUpRight,
  Calendar,
  ChevronDown,
  CirclePlay,
  Clock3,
  ExternalLink,
  Sparkles,
} from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { PageCrossLinks } from "@/components/site/PageBlocks";
import {
  Container,
  GoldBadge,
  GoldButton,
  PriceTag,
  Section,
  SectionHeading,
} from "@/components/site/kit";
import {
  Beam,
  CollapseMotion,
  DrawRule,
  PopIn,
  PulseGlow,
  Reveal,
  SpotlightCard,
  Stagger,
  StaggerItem,
} from "@/components/motion";
import { useI18n } from "@/lib/i18n";
import { useLocalized } from "@/lib/page-content";
import { openForm } from "@/lib/chat-bus";
import { trackCta } from "@/lib/analytics";
import { findSaas, type SoftwareLinksRecord } from "@/lib/catalog";
import { parseYouTubeId, youTubeEmbedUrl } from "@/lib/youtube";
import { SAAS_DETAILS, SAAS_DETAIL_SLUGS, type SaasSlug } from "@/lib/pages-content/saas-details";
import { LOGICIELS } from "@/lib/pages-content/logiciels";
import { GoldIcon, IconFeature, featureIconFor } from "@/components/site/icons";

/**
 * Page de détail d'un logiciel /logiciels/[slug] :
 * bandeau (visuel produit, + bouton « Ouvrir le logiciel » si une démo
 * en ligne est configurée) > vidéo de présentation (~3/4 de largeur,
 * intégrée depuis l'Espace équipe sinon affiche « bientôt ») >
 * présentation > caractéristiques > pour qui > tarif (catalogue §19) >
 * CTA démo + essai (+ ouverture de la démo) > mini-FAQ > liens vers les
 * autres logiciels.
 * Vidéo et démo proviennent de /api/software-links (table SoftwareLink,
 * édition dans l'Espace équipe) — sans lien configuré, rendu inchangé.
 */
export function SaasDetailPage({ slug }: { slug: SaasSlug }) {
  const { t, lang } = useI18n();
  const L = useLocalized(LOGICIELS);
  const d = (SAAS_DETAILS[lang] ?? SAAS_DETAILS.fr)[slug];
  const nameFor = (other: SaasSlug) => (SAAS_DETAILS[lang] ?? SAAS_DETAILS.fr)[other].name;
  const saas = findSaas(slug);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  /* Liens édités dans l'Espace équipe (démo en ligne + vidéo YouTube) —
   * chargés une seule fois ; en cas d'échec, rendu inchangé (repli statique). */
  const [links, setLinks] = useState<SoftwareLinksRecord | null>(null);
  useEffect(() => {
    let cancelled = false;
    fetch("/api/software-links", { cache: "no-store" })
      .then((res) => res.json())
      .then((json: { ok?: boolean; data?: SoftwareLinksRecord }) => {
        if (!cancelled && json?.ok && json.data) setLinks(json.data);
      })
      .catch(() => {
        /* silencieux — la page reste identique sans liens configurés */
      });
    return () => {
      cancelled = true;
    };
  }, []);
  const link = links?.[slug] ?? null;
  const demoUrl = link?.demoUrl ?? null;
  const dbVideoId = link?.videoUrl ? parseYouTubeId(link.videoUrl) : null;

  const priceProps = {
    fromLabel: t("pricing.fromLabel"),
    perMonth: t("pricing.perMonth"),
    perYear: t("pricing.perYear"),
    quoteLabel: t("pricing.quoteLabel"),
  };

  /* Lien YouTube/Vimeo → iframe ; sinon fichier vidéo direct */
  const embedUrl = (() => {
    if (!d.videoUrl) return null;
    const yt = d.videoUrl.match(
      /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([\w-]{6,})/
    );
    if (yt) return `https://www.youtube-nocookie.com/embed/${yt[1]}?rel=0`;
    const vimeo = d.videoUrl.match(/vimeo\.com\/(\d+)/);
    if (vimeo) return `https://player.vimeo.com/video/${vimeo[1]}`;
    return null;
  })();

  return (
    <>
      <PageHero
        label={d.hero.label}
        title={d.hero.title}
        gold={d.hero.gold}
        sub={d.hero.sub}
        chips={d.hero.chips}
        image={d.image}
        parent={{ label: t("nav.logiciels"), href: "/logiciels" }}
        action={
          demoUrl ? (
            <GoldButton
              href={demoUrl}
              external
              magnetic
              onClick={() => trackCta("saas-detail", `${slug}-open-software`)}
              ariaLabel={`${t("saas.openSoftware")} — ${d.name}`}
            >
              <ExternalLink size={15} strokeWidth={1.25} aria-hidden />
              {t("saas.openSoftware")}
            </GoldButton>
          ) : undefined
        }
      />

      {/* ── Vidéo de présentation (≈ 3/4 de la largeur) ─────────── */}
      <Section id={`${slug}-video`}>
        <Container>
          <SectionHeading
            label={d.video.label}
            title={d.video.title}
            gold={d.video.gold}
          />
          <Reveal variant="scale" duration={0.9}>
            <div className="mx-auto w-full lg:w-3/4">
              <Beam always className="rounded-xl">
                <div
                  className={`group relative aspect-video overflow-hidden rounded-xl border bg-deep ${
                    dbVideoId ? "border-gold/30" : "border-line"
                  }`}
                >
                  {dbVideoId ? (
                    /* Vidéo configurée dans l'Espace équipe — lecteur YouTube sans cookies */
                    <iframe
                      src={youTubeEmbedUrl(dbVideoId)}
                      title={`Vidéo de présentation — ${d.name}`}
                      className="absolute inset-0 h-full w-full"
                      loading="lazy"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : embedUrl ? (
                    <iframe
                      src={embedUrl}
                      title={`${d.name} — ${d.video.label}`}
                      className="absolute inset-0 h-full w-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : d.videoUrl ? (
                    <video
                      src={d.videoUrl}
                      poster={d.image}
                      controls
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                  ) : (
                    <>
                      {/* Affiche : visuel produit + voile + bouton lecture */}
                      <Image
                        src={d.image}
                        alt=""
                        fill
                        sizes="(max-width: 1024px) 100vw, 75vw"
                        className="object-cover opacity-70 transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03]"
                      />
                      <div
                        aria-hidden
                        className="absolute inset-0 bg-gradient-to-t from-bg/90 via-bg/40 to-transparent"
                      />
                      <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                        <PopIn>
                          <span className="inline-flex h-20 w-20 items-center justify-center rounded-full border border-gold/50 bg-surface/70 text-gold backdrop-blur-sm transition-transform duration-300 group-hover:scale-110">
                            <CirclePlay size={34} strokeWidth={1.25} aria-hidden />
                          </span>
                        </PopIn>
                        <PulseGlow duration={4}>
                          <GoldBadge>{t("saas.videoSoonBadge")}</GoldBadge>
                        </PulseGlow>
                      </div>
                      <span
                        aria-hidden
                        className="absolute bottom-4 right-4 inline-flex items-center gap-1.5 rounded-full border border-line bg-surface/80 px-3 py-1 text-[0.6875rem] uppercase tracking-[0.14em] text-mute backdrop-blur-sm"
                      >
                        <Clock3 size={12} strokeWidth={1.25} aria-hidden />
                        {t("saas.book")} · {d.name}
                      </span>
                    </>
                  )}
                </div>
              </Beam>
              {!d.videoUrl && !dbVideoId && (
                <p className="mx-auto mt-4 max-w-2xl text-center text-sm leading-relaxed text-mute">
                  {d.video.soonNote}
                </p>
              )}
            </div>
          </Reveal>
        </Container>
      </Section>

      {/* ── Présentation ────────────────────────────────────────── */}
      <Section id={`${slug}-overview`} tone="surface">
        <Container>
          <SectionHeading
            label={d.overview.label}
            title={d.overview.title}
            gold={d.overview.gold}
          />
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
            {d.overview.paragraphs.map((p, i) => (
              <Reveal key={i} y={22} delay={i * 0.1}>
                <p className="text-[0.9375rem] leading-relaxed text-mute md:text-base">{p}</p>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      {/* ── Caractéristiques ────────────────────────────────────── */}
      <Section id={`${slug}-features`}>
        <Container>
          <SectionHeading
            label={d.features.label}
            title={d.features.title}
            gold={d.features.gold}
            sub={d.features.sub}
          />
          <Stagger as="ul" className="grid gap-x-6 gap-y-4 sm:grid-cols-2" step={0.05}>
            {d.features.items.map((item, i) => (
              <StaggerItem key={item} as="li" y={18} className="h-full list-none">
                <div className="h-full rounded-lg border border-line/60 bg-surface px-4 py-3.5">
                  <PopIn delay={i * 0.04}>
                    <IconFeature text={item} as="div" />
                  </PopIn>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </Container>
      </Section>

      {/* ── Pour qui ────────────────────────────────────────────── */}
      <Section id={`${slug}-audience`} tone="surface">
        <Container>
          <SectionHeading
            label={d.audience.label}
            title={d.audience.title}
            gold={d.audience.gold}
          />
          <Reveal>
            <div className="rounded-xl border-l-2 border-gold bg-bg p-6">
              <p className="label-caps mb-2">{L.detail.forWhomLabel}</p>
              <p className="text-sm leading-relaxed text-mute md:text-[0.9375rem]">
                {d.audience.forWhom}
              </p>
            </div>
          </Reveal>
          <Stagger className="mt-8 grid gap-6 md:grid-cols-3" step={0.09}>
            {d.audience.cases.map((a) => {
              const CIcon = featureIconFor(`${a.k} ${a.d}`);
              return (
                <StaggerItem key={a.k} className="h-full">
                  <SpotlightCard className="h-full rounded-xl">
                    <Beam className="h-full rounded-xl">
                      <article className="card-lift h-full rounded-xl border border-line bg-bg p-6">
                        <GoldIcon icon={CIcon} size="md" />
                        <h3 className="mt-4 font-serif text-lg font-semibold leading-snug text-ink">
                          {a.k}
                        </h3>
                        <p className="mt-2.5 text-sm leading-relaxed text-mute">{a.d}</p>
                      </article>
                    </Beam>
                  </SpotlightCard>
                </StaggerItem>
              );
            })}
          </Stagger>
        </Container>
      </Section>

      {/* ── Tarif (catalogue officiel) ──────────────────────────── */}
      {saas && (
        <Section id={`${slug}-pricing`} tone="deep">
          <Container>
            <SectionHeading
              label={t("pricing.label")}
              title={t("pricing.title")}
              gold={t("pricing.tGold")}
              sub={d.priceNote}
            />
            <Stagger
              className={`grid gap-5 ${saas.offers.length > 1 ? "md:grid-cols-3" : "max-w-xl"}`}
              step={0.09}
            >
              {saas.offers.map((offer) => (
                <StaggerItem key={offer.id} className="h-full">
                  <SpotlightCard className="h-full rounded-xl">
                    <article className="card-lift flex h-full flex-col rounded-xl border border-line bg-bg p-6">
                      <div className="flex items-start justify-between gap-3">
                        <h3 className="font-serif text-lg font-semibold text-ink">{offer.name}</h3>
                        {offer.featured && <GoldBadge>{t("pricing.popularLabel")}</GoldBadge>}
                      </div>
                      <div className="mt-4">
                        <PriceTag
                          offer={offer}
                          size="xl"
                          {...priceProps}
                          billableNote={
                            slug === "gestion-ecole" ? t("pricing.billableNote") : undefined
                          }
                        />
                      </div>
                    </article>
                  </SpotlightCard>
                </StaggerItem>
              ))}
            </Stagger>
          </Container>
        </Section>
      )}

      {/* ── CTA : démo + essai gratuit ──────────────────────────── */}
      <Section id={`${slug}-cta`}>
        <Container className="text-center">
          <Reveal y={16}>
            <h2 className="display-2 mx-auto max-w-3xl">
              {d.cta.title}{" "}
              <em className="font-serif italic text-goldtext">{d.cta.gold}</em>
            </h2>
          </Reveal>
          <Reveal delay={0.12} y={14}>
            <p className="lead-text mx-auto mt-4 max-w-xl">{d.cta.sub}</p>
          </Reveal>
          <Reveal delay={0.22} y={14}>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <GoldButton
                magnetic
                onClick={() => {
                  openForm("demo", {
                    subject: "Démo",
                    message: `Je souhaite une démonstration de ${d.name}.`,
                  });
                  trackCta("saas-detail", `${slug}-demo`);
                }}
              >
                <Calendar size={15} strokeWidth={1.25} aria-hidden />
                {d.cta.demoLabel}
              </GoldButton>
              {demoUrl && (
                <GoldButton
                  href={demoUrl}
                  external
                  onClick={() => trackCta("saas-detail", `${slug}-open-software-cta`)}
                  ariaLabel={`${t("saas.openSoftware")} — ${d.name}`}
                >
                  <ExternalLink size={15} strokeWidth={1.25} aria-hidden />
                  {t("saas.openSoftware")}
                </GoldButton>
              )}
              <GoldButton
                variant="outline"
                onClick={() => {
                  openForm("trial", { subject: d.name });
                  trackCta("saas-detail", `${slug}-trial`);
                }}
              >
                <Sparkles size={15} strokeWidth={1.25} aria-hidden />
                {d.cta.trialLabel}
              </GoldButton>
            </div>
          </Reveal>
        </Container>
      </Section>

      {/* ── Mini-FAQ ────────────────────────────────────────────── */}
      <Section id={`${slug}-faq`} tone="surface">
        <Container className="max-w-3xl">
          <SectionHeading label={d.faq.label} title={t("faq.title")} gold={t("faq.tGold")} />
          <div className="space-y-3">
            {d.faq.items.map((item, i) => {
              const open = openFaq === i;
              return (
                <Reveal key={item.q} y={16} delay={i * 0.06}>
                  <div className="overflow-hidden rounded-xl border border-line bg-bg">
                    <button
                      type="button"
                      onClick={() => setOpenFaq(open ? null : i)}
                      aria-expanded={open}
                      className="flex min-h-[56px] w-full items-center justify-between gap-4 px-5 py-4 text-left transition-colors hover:bg-surface"
                    >
                      <span className="font-serif text-base font-medium text-ink">{item.q}</span>
                      <ChevronDown
                        size={18}
                        strokeWidth={1.25}
                        aria-hidden
                        className={`shrink-0 text-gold transition-transform duration-300 ${open ? "rotate-180" : ""}`}
                      />
                    </button>
                    <CollapseMotion open={open}>
                      <p className="border-t border-line px-5 py-4 text-sm leading-relaxed text-mute">
                        {item.a}
                      </p>
                    </CollapseMotion>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </Container>
      </Section>

      {/* ── Autres logiciels ────────────────────────────────────── */}
      <Section id={`${slug}-others`}>
        <Container>
          <Reveal y={14}>
            <h2 className="label-caps mb-8">{L.cross.title}</h2>
          </Reveal>
          <DrawRule className="h-px w-full" delay={0.1} />
          <Stagger className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5" step={0.06}>
            {SAAS_DETAIL_SLUGS.filter((s) => s !== slug).map((s) => (
              <StaggerItem key={s} className="h-full">
                <Link
                  href={`/logiciels/${s}`}
                  className="card-lift group flex h-full min-h-[110px] flex-col justify-between rounded-xl border border-line bg-surface p-4 transition-colors hover:border-gold/50 focus-visible:outline focus-visible:outline-1 focus-visible:outline-gold"
                >
                  <span className="font-serif text-base font-semibold text-ink transition-colors group-hover:text-goldlight">
                    {nameFor(s)}
                  </span>
                  <ArrowUpRight
                    size={16}
                    strokeWidth={1.25}
                    aria-hidden
                    className="mt-3 self-end text-gold transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  />
                </Link>
              </StaggerItem>
            ))}
          </Stagger>
        </Container>
      </Section>
    </>
  );
}
