"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Container } from "@/components/site/kit";
import { DrawRule, Reveal, WordMask } from "@/components/motion";
import { useI18n } from "@/lib/i18n";

/**
 * Bandeau d'ouverture de chaque page du site multi-pages :
 * fil d'Ariane (Accueil / …), libellé numéroté, titre serif animé
 * mot à mot (dégradé or posé par mot — voir UI-FIX-2), sous-titre.
 * `image` : visuel de fond photographique (obscurci par deux voiles
 * dégradés — lisibilité du texte garantie, aucun texte décoratif).
 */
export function PageHero({
  label,
  title,
  gold,
  sub,
  chips,
  image,
  parent,
}: {
  label: string;
  title: string;
  gold?: string;
  sub?: string;
  /** petits attributs affichés sous le texte (ex. « 7 pôles », « Devis 48 h ») */
  chips?: string[];
  /** visuel de fond (chemin public) — voiles sombres superposés */
  image?: string;
  /** page parente pour le fil d'Ariane (ex. Services → page de détail) */
  parent?: { label: string; href: string };
}) {
  const { t } = useI18n();
  return (
    <header className="relative overflow-hidden border-b border-line bg-deep pt-28 pb-14 md:pt-36 md:pb-20">
      {/* Visuel de fond + voiles (couleur du thème courant — lisibilité) */}
      {image && (
        <div aria-hidden className="absolute inset-0">
          <Image
            src={image}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover object-center opacity-40 dark:opacity-55"
          />
          {/* voile principal : bas → haut, garantit le contraste du texte */}
          <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/80 to-bg/45" />
          {/* voile latéral gauche : renforce la zone de texte */}
          <div className="absolute inset-0 bg-gradient-to-r from-bg/85 via-bg/40 to-transparent" />
        </div>
      )}
      {/* halo radial discret, aucun texte décoratif en arrière-plan */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_0%,rgba(212,175,55,0.07),transparent_70%)]"
      />
      <Container className="relative">
        {/* Fil d'Ariane */}
        <Reveal y={10} duration={0.5}>
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex items-center gap-1.5 text-xs uppercase tracking-[0.14em] text-mute">
              <li>
                <Link
                  href="/"
                  className="inline-flex min-h-[24px] items-center transition-colors hover:text-goldtext"
                >
                  {t("pages.home")}
                </Link>
              </li>
              {parent && (
                <>
                  <li aria-hidden>
                    <ChevronRight size={12} strokeWidth={1.5} className="text-gold/60" />
                  </li>
                  <li>
                    <Link
                      href={parent.href}
                      className="inline-flex min-h-[24px] items-center transition-colors hover:text-goldtext"
                    >
                      {parent.label}
                    </Link>
                  </li>
                </>
              )}
              <li aria-hidden>
                <ChevronRight size={12} strokeWidth={1.5} className="text-gold/60" />
              </li>
              <li aria-current="page" className="text-goldtext">
                {title}
              </li>
            </ol>
          </nav>
        </Reveal>

        <Reveal y={14} duration={0.6}>
          <p className="label-caps mb-4">{label}</p>
        </Reveal>

        <h1 className="display-1 max-w-4xl">
          <WordMask text={title} />{" "}
          {gold && (
            <em className="font-serif italic">
              <WordMask text={gold} gold delay={0.22} />
            </em>
          )}
        </h1>

        <DrawRule className="mt-6 h-px w-24" delay={0.35} />

        {sub && (
          <Reveal delay={0.3} y={18} duration={0.8}>
            <p className="lead-text mt-5 max-w-2xl">{sub}</p>
          </Reveal>
        )}

        {chips && chips.length > 0 && (
          <Reveal delay={0.45} y={14} duration={0.7}>
            <ul className="mt-7 flex flex-wrap gap-2.5">
              {chips.map((chip) => (
                <li
                  key={chip}
                  className="inline-flex items-center gap-1.5 rounded-full border border-gold/30 bg-surface/60 px-3.5 py-1.5 text-[0.6875rem] font-medium uppercase tracking-[0.14em] text-goldtext"
                >
                  {chip}
                </li>
              ))}
            </ul>
          </Reveal>
        )}
      </Container>
    </header>
  );
}
