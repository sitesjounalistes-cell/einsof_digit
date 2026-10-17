"use client";

import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Facebook, Linkedin, Link2, MessageCircle, Twitter } from "lucide-react";
import { toast } from "sonner";
import { CtaBanner } from "@/components/site/PageBlocks";
import { Container, GoldBadge, GoldButton, Section } from "@/components/site/kit";
import { Beam, DrawRule, Reveal, Shimmer, Stagger, StaggerItem, WordMask } from "@/components/motion";
import { useI18n } from "@/lib/i18n";
import { pickLocale, type LocaleMap } from "@/lib/locale-json";
import { useLocalized } from "@/lib/page-content";
import type { PostAd } from "@/lib/post-ads";
import { parseYouTubeId, youTubeEmbedUrl } from "@/lib/youtube";
import { track } from "@/lib/analytics";
import { SITE_URL } from "@/lib/seo";
import { ARTICLE } from "@/lib/pages-content/article";

interface PostRow {
  id: string;
  slug: string;
  title: LocaleMap;
  excerpt: LocaleMap;
  body: LocaleMap;
  category: string;
  readingMin: number;
  publishedAt: string | null;
  /* Éditorial enrichi (dashboard) */
  coverImageUrl: string | null;
  isFeatured: boolean;
  videoUrl: string | null;
}

function fmtDate(iso: string | null, lang: string): string {
  if (!iso) return "";
  try {
    return new Intl.DateTimeFormat(lang === "zh" ? "zh-CN" : lang, {
      dateStyle: "long",
    }).format(new Date(iso));
  } catch {
    return "";
  }
}

/** Bloc publicitaire « partenaire » — bordure or, badge label, image 16/9
 * optionnelle, texte et CTA externe (https, rel sponsored). Sans lien :
 * bloc purement informatif, non cliquable. */
function AdBlock({ ad }: { ad: PostAd }) {
  const label = ad.title?.trim() || "Espace partenaire";
  const link = ad.linkUrl?.trim();
  const hasLink = typeof link === "string" && /^https:\/\//.test(link);
  const cta = ad.ctaLabel?.trim() || "Découvrir";
  return (
    <Reveal y={14} duration={0.6}>
      <aside
        aria-label="Contenu partenaire"
        className="my-10 overflow-hidden rounded-xl border border-gold/40 bg-surface"
      >
        {ad.imageUrl ? (
          <div className="relative aspect-video max-h-72 w-full overflow-hidden border-b border-gold/20">
            <Image
              src={ad.imageUrl}
              alt={label}
              fill
              sizes="(max-width: 768px) 100vw, 768px"
              className="object-cover"
              unoptimized
            />
          </div>
        ) : null}
        <div className="p-6">
          <GoldBadge>{label}</GoldBadge>
          {ad.text ? (
            <p className="mt-4 text-[0.9375rem] leading-relaxed text-ink">{ad.text}</p>
          ) : null}
          {hasLink ? (
            <a
              href={link}
              target="_blank"
              rel="sponsored noopener"
              className="mt-5 inline-flex min-h-[44px] items-center justify-center gap-2 rounded border border-gold/60 px-6 py-3 text-[0.8125rem] font-semibold uppercase tracking-[0.12em] text-goldtext transition-all duration-300 hover:border-gold hover:text-ongold active:scale-[0.98]"
            >
              {cta}
              <ArrowUpRight className="h-4 w-4" strokeWidth={1.25} aria-hidden />
            </a>
          ) : null}
        </div>
      </aside>
    </Reveal>
  );
}

/* ── Vidéo YouTube intégrée (youtube-nocookie, 16/9, chargement différé) ── */

function VideoEmbed({ videoId, articleTitle }: { videoId: string; articleTitle: string }) {
  const { t } = useI18n();
  return (
    <Reveal y={14} duration={0.6}>
      <figure className="my-10 overflow-hidden rounded-xl border border-gold/30 bg-black">
        <div className="relative aspect-video w-full">
          <iframe
            src={youTubeEmbedUrl(videoId)}
            title={`${t("journal.video")} — ${articleTitle}`}
            loading="lazy"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
            className="absolute inset-0 h-full w-full border-0"
          />
        </div>
        <figcaption className="border-t border-gold/20 px-5 py-3 text-[0.6875rem] font-medium uppercase tracking-[0.16em] text-mute">
          {t("journal.video")}
        </figcaption>
      </figure>
    </Reveal>
  );
}

/* ── Barre de partage : WhatsApp, Facebook, X, LinkedIn + copier ───── */

const SHARE_CHANNELS = [
  { id: "whatsapp", Icon: MessageCircle, label: "WhatsApp" },
  { id: "facebook", Icon: Facebook, label: "Facebook" },
  { id: "x", Icon: Twitter, label: "X" },
  { id: "linkedin", Icon: Linkedin, label: "LinkedIn" },
] as const;

type ShareChannel = (typeof SHARE_CHANNELS)[number]["id"];

function buildShareUrl(channel: ShareChannel, title: string, url: string): string {
  const enc = encodeURIComponent;
  switch (channel) {
    case "whatsapp":
      return `https://wa.me/?text=${enc(`${title} ${url}`)}`;
    case "facebook":
      return `https://www.facebook.com/sharer/sharer.php?u=${enc(url)}`;
    case "x":
      return `https://twitter.com/intent/tweet?text=${enc(title)}&url=${enc(url)}`;
    case "linkedin":
      return `https://www.linkedin.com/sharing/share-offsite/?url=${enc(url)}`;
  }
}

function ShareBar({ slug, title }: { slug: string; title: string }) {
  const { t } = useI18n();
  /* Partage : URL canonique du domaine (stable SSR/hydratation) ;
     « Copier le lien » utilise l'origine réelle du visiteur. */
  const url = `${SITE_URL}/blog/${slug}`;

  const onShare = (channel: ShareChannel) => {
    track("article_shared", { slug, channel });
  };

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}/blog/${slug}`);
      toast.success(t("journal.shareCopied"));
      track("article_shared", { slug, channel: "copy" });
    } catch {
      /* presse-papiers indisponible */
    }
  };

  const iconCls =
    "inline-flex h-11 w-11 items-center justify-center rounded-full border border-line text-mute transition-all duration-300 hover:border-gold/50 hover:text-goldtext focus-visible:outline focus-visible:outline-1 focus-visible:outline-gold";

  return (
    <div className="mt-10 flex flex-wrap items-center gap-2.5 border-y border-line py-4">
      <span className="label-caps mr-2">{t("journal.share")}</span>
      {SHARE_CHANNELS.map(({ id, Icon, label }) => (
        <a
          key={id}
          href={buildShareUrl(id, title, url)}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => onShare(id)}
          aria-label={`${t("journal.share")} — ${label}`}
          title={label}
          className={iconCls}
        >
          <Icon className="h-4 w-4" strokeWidth={1.5} aria-hidden />
        </a>
      ))}
      <button
        type="button"
        onClick={() => void onCopy()}
        aria-label={t("journal.shareCopied")}
        title={t("journal.share")}
        className={iconCls}
      >
        <Link2 className="h-4 w-4" strokeWidth={1.5} aria-hidden />
      </button>
    </div>
  );
}

/**
 * Page article /blog/[slug] — le slug est résolu côté serveur (base
 * réelle, 404 si introuvable) ; côté client, l'article est chargé
 * depuis /api/posts puis rendu en paragraphes. Le texte se révèle
 * progressivement (Reveal once) mais finit toujours 100 % visible.
 * Enrichi : image de couverture, vidéo YouTube (champ dédié + liens
 * nus dans le corps) et barre de partage multi-canaux.
 */
export function ArticlePage({ slug, ads = [] }: { slug: string; ads?: PostAd[] }) {
  const { lang, tr } = useI18n();
  const c = useLocalized(ARTICLE);
  const [posts, setPosts] = useState<PostRow[] | null>(null);

  /* Suivi de lecture (analytics, après consentement) */
  useEffect(() => {
    track("article_read", { slug });
  }, [slug]);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/posts")
      .then((r) => (r.ok ? r.json() : null))
      .then((j: { ok: boolean; data?: PostRow[] } | null) => {
        if (cancelled) return;
        setPosts(j?.ok && Array.isArray(j.data) ? j.data : []);
      })
      .catch(() => {
        if (!cancelled) setPosts([]);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const post = useMemo(
    () => posts?.find((p) => p.slug === slug) ?? null,
    [posts, slug]
  );

  const catLabel = (cat: string): string => tr<string>(`journal.categories.${cat}`) ?? cat;

  /* ── État introuvable (client : API vide ou slug absent du lot) ── */
  if (posts !== null && !post) {
    return (
      <Section id="article-missing" className="pt-40">
        <Container className="text-center">
          <Reveal>
            <p className="font-serif text-3xl text-ink">{c.notFoundTitle}</p>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-mute">
              {c.notFoundText}
            </p>
          </Reveal>
          <Reveal delay={0.2}>
            <div className="mt-8 flex justify-center">
              <GoldButton href="/blog">
                <ArrowLeft size={16} strokeWidth={1.5} aria-hidden />
                {c.backToList}
              </GoldButton>
            </div>
          </Reveal>
        </Container>
      </Section>
    );
  }

  /* ── État chargement ─────────────────────────────────────────── */
  if (!post) {
    return (
      <>
        <header className="border-b border-line bg-deep pt-28 pb-12 md:pt-36 md:pb-16">
          <Container>
            <div
              role="status"
              aria-live="polite"
              className="mx-auto max-w-3xl"
            >
              <p className="label-caps">
                <Shimmer>{c.loading}</Shimmer>
              </p>
              <div className="mt-6 space-y-3" aria-hidden>
                <div className="h-8 w-4/5 animate-pulse rounded bg-surface2" />
                <div className="h-8 w-3/5 animate-pulse rounded bg-surface2" />
              </div>
              <div className="mt-6 space-y-2.5" aria-hidden>
                <div className="h-3 w-full animate-pulse rounded bg-surface2" />
                <div className="h-3 w-11/12 animate-pulse rounded bg-surface2" />
                <div className="h-3 w-4/5 animate-pulse rounded bg-surface2" />
              </div>
            </div>
          </Container>
        </header>
      </>
    );
  }

  /* ── Article trouvé : jusqu'à 2 autres articles pour « lire aussi » ── */
  const title = pickLocale(post.title, lang);
  const others = posts!.filter((p) => p.slug !== slug).slice(0, 2);

  /* Corps : chaque paragraphe devient du texte OU une vidéo intégrée
     quand il s'agit d'un simple lien YouTube (commence par http…). */
  const blocks: Array<{ kind: "p"; text: string } | { kind: "video"; videoId: string }> =
    pickLocale(post.body, lang)
      .split("\n\n")
      .map((par) => par.trim())
      .filter(Boolean)
      .map((par) => {
        const videoId = par.startsWith("http") ? parseYouTubeId(par) : null;
        return videoId ? { kind: "video" as const, videoId } : { kind: "p" as const, text: par };
      });

  /* Vidéo dédiée du dashboard (champ videoUrl) */
  const fieldVideoId = post.videoUrl ? parseYouTubeId(post.videoUrl) : null;

  /* Espaces publicitaires actifs : position N = insérés après le N-ième
   * paragraphe ; 0 (ou au-delà du dernier) = tout à la fin.
   * Les indices suivent les blocs 1:1 (texte ou vidéo remplacée). */
  const adsAfter = new Map<number, PostAd[]>();
  for (const ad of ads) {
    if (!ad.isActive) continue;
    const at =
      ad.position <= 0
        ? blocks.length
        : Math.min(ad.position, blocks.length);
    adsAfter.set(at, [...(adsAfter.get(at) ?? []), ad]);
  }

  return (
    <>
      {/* Bandeau d'ouverture de l'article */}
      <header className="relative overflow-hidden border-b border-line bg-deep pt-28 pb-12 md:pt-36 md:pb-16">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_0%,rgba(212,175,55,0.07),transparent_70%)]"
        />
        <Container className="relative">
          <div className="mx-auto max-w-3xl">
            <Reveal y={10} duration={0.5}>
              <Link
                href="/blog"
                className="group inline-flex min-h-[44px] items-center gap-2 text-sm font-semibold uppercase tracking-[0.12em] text-goldtext transition-colors duration-300 hover:text-goldlight"
              >
                <ArrowLeft
                  size={16}
                  strokeWidth={1.5}
                  aria-hidden
                  className="transition-transform duration-300 group-hover:-translate-x-1"
                />
                {c.back}
              </Link>
            </Reveal>

            <Reveal delay={0.08} y={12} duration={0.6}>
              <div className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-2">
                <GoldBadge>{catLabel(post.category)}</GoldBadge>
                <span className="text-[0.6875rem] font-medium uppercase tracking-[0.16em] text-mute">
                  {fmtDate(post.publishedAt, lang)}
                </span>
                <span className="text-[0.6875rem] text-mute">
                  · {post.readingMin} {c.readingMin}
                </span>
              </div>
            </Reveal>

            <h1 className="mt-5 font-serif text-3xl leading-tight text-ink md:text-5xl">
              <WordMask text={title} />
            </h1>

            <DrawRule className="mt-6 h-px w-24" delay={0.3} />

            <Reveal delay={0.3} y={18} duration={0.8}>
              <p className="lead-text mt-5">{pickLocale(post.excerpt, lang)}</p>
            </Reveal>
          </div>
        </Container>
      </header>

      {/* Corps de l'article */}
      <Section id="article-body">
        <Container>
          <div className="mx-auto max-w-3xl">
            {/* Image de couverture (avant le contenu) */}
            {post.coverImageUrl ? (
              <Reveal y={14} duration={0.7}>
                <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-line">
                  <Image
                    src={post.coverImageUrl}
                    alt={title}
                    priority
                    fill
                    sizes="(max-width: 1024px) 100vw, 768px"
                    className="object-cover"
                    unoptimized
                  />
                </div>
              </Reveal>
            ) : null}

            {/* Barre de partage multi-canaux */}
            <ShareBar slug={post.slug} title={title} />

            {/* Vidéo dédiée (dashboard) */}
            {fieldVideoId ? <VideoEmbed videoId={fieldVideoId} articleTitle={title} /> : null}

            {blocks.map((block, i) => (
              <React.Fragment key={i}>
                {block.kind === "p" ? (
                  <Reveal y={18} duration={0.7} delay={Math.min(i * 0.05, 0.25)}>
                    <p className="text-[0.9375rem] leading-relaxed text-ink md:text-base">
                      {block.text}
                    </p>
                  </Reveal>
                ) : (
                  /* Paragraphe « lien YouTube nu » → lecteur intégré */
                  <VideoEmbed videoId={block.videoId} articleTitle={title} />
                )}
                {(adsAfter.get(i + 1) ?? []).map((ad) => (
                  <AdBlock key={ad.id} ad={ad} />
                ))}
              </React.Fragment>
            ))}

            <DrawRule className="mx-auto mt-14 h-px w-40" delay={0.1} />
          </div>
        </Container>
      </Section>

      {/* Lire aussi */}
      {others.length > 0 && (
        <Section id="article-also" tone="surface" className="border-t border-line">
          <Container>
            <Reveal y={14} duration={0.6}>
              <h2 className="font-serif text-2xl text-ink md:text-3xl">{c.alsoTitle}</h2>
              <p className="mt-2 text-sm text-mute">{c.alsoSub}</p>
            </Reveal>
            <Stagger className="mt-8 grid gap-6 md:grid-cols-2" step={0.08}>
              {others.map((p) => (
                <StaggerItem key={p.id} y={30} className="h-full">
                  <Beam className="h-full rounded-xl">
                    <Link
                      href={`/blog/${p.slug}`}
                      aria-label={`${pickLocale(p.title, lang)}`}
                      className="card-lift group flex h-full flex-col rounded-xl border border-line bg-bg p-6 focus-visible:outline focus-visible:outline-1 focus-visible:outline-gold"
                    >
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                        <GoldBadge>{catLabel(p.category)}</GoldBadge>
                        <span className="text-[0.6875rem] font-medium uppercase tracking-[0.16em] text-mute transition-transform duration-300 group-hover:translate-x-1">
                          {fmtDate(p.publishedAt, lang)}
                        </span>
                      </div>
                      <h3 className="mt-4 font-serif text-xl leading-snug transition-colors duration-300 group-hover:text-goldlight">
                        {pickLocale(p.title, lang)}
                      </h3>
                      <div className="mt-auto flex items-center justify-between gap-3 pt-5">
                        <span className="text-[0.6875rem] text-mute">
                          {p.readingMin} {c.readingMin}
                        </span>
                        <ArrowUpRight
                          className="h-4 w-4 text-goldtext transition-transform duration-300 group-hover:translate-x-1"
                          strokeWidth={1.25}
                          aria-hidden
                        />
                      </div>
                    </Link>
                  </Beam>
                </StaggerItem>
              ))}
            </Stagger>
          </Container>
        </Section>
      )}

      <CtaBanner
        title={c.cta.title}
        gold={c.cta.gold}
        primaryLabel={c.cta.primaryLabel}
        primaryHref="/contact"
        secondaryLabel={c.cta.secondaryLabel}
        secondaryHref="/services"
      />
    </>
  );
}
