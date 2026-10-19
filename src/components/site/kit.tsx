"use client";

import React, { type ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import { DrawRule, Magnetic, Reveal, WordMask } from "@/components/motion";
import { type PriceOffer, formatGNF } from "@/lib/catalog";

/* ── Section : coquille avec data-section-id stable ─────────── */

export function Section({
  id,
  tone = "bg",
  className = "",
  children,
}: {
  id: string;
  tone?: "bg" | "surface" | "deep";
  className?: string;
  children: ReactNode;
}) {
  const toneCls =
    tone === "surface"
      ? "bg-surface"
      : tone === "deep"
        ? "bg-deep"
        : "bg-bg";
  return (
    <section
      id={`section-${id}`}
      data-section-id={id}
      className={`relative scroll-mt-20 py-20 md:py-28 lg:py-32 ${toneCls} ${className}`}
    >
      {children}
    </section>
  );
}

export function Container({
  className = "",
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={`mx-auto w-full max-w-7xl px-5 md:px-8 lg:px-12 ${className}`}>
      {children}
    </div>
  );
}

/* ── SectionHeading : libellé numéroté + titre serif animé ──── */

export function SectionHeading({
  label,
  title,
  gold,
  sub,
  align = "left",
}: {
  label: string;
  title: string;
  gold?: string;
  sub?: string;
  align?: "left" | "center";
}) {
  return (
    <div className={`mb-12 md:mb-16 ${align === "center" ? "text-center" : ""}`}>
      <Reveal y={14} duration={0.6}>
        <p className="label-caps mb-4">{label}</p>
      </Reveal>
      <h2 className="display-2 max-w-3xl">
        <WordMask text={title} />{" "}
        {gold && (
          /* Le dégradé or est posé mot par mot (prop `gold`) — un
             background-clip:text sur ce parent peindrait un texte
             invisible au-dessus de descendants transformés (Chrome). */
          <em className="font-serif italic">
            <WordMask text={gold} gold delay={0.22} />
          </em>
        )}
      </h2>
      <DrawRule
        className={`mt-6 h-px w-24 ${align === "center" ? "mx-auto" : ""}`}
        delay={0.35}
      />
      {sub && (
        <Reveal delay={0.3} y={18} duration={0.8}>
          <p className={`lead-text mt-5 max-w-2xl ${align === "center" ? "mx-auto" : ""}`}>{sub}</p>
        </Reveal>
      )}
    </div>
  );
}

/* ── GoldButton : boutons principaux avec reflet doré ───────── */

type ButtonVariant = "primary" | "outline" | "ghost";

export function GoldButton({
  children,
  variant = "primary",
  href,
  onClick,
  type = "button",
  className = "",
  magnetic = false,
  disabled = false,
  ariaLabel,
  /** href externe : <a> natif dans un nouvel onglet (au lieu de next/link) */
  external = false,
}: {
  children: ReactNode;
  variant?: ButtonVariant;
  href?: string;
  onClick?: () => void;
  type?: "button" | "submit";
  className?: string;
  magnetic?: boolean;
  disabled?: boolean;
  ariaLabel?: string;
  external?: boolean;
}) {
  const base =
    "relative inline-flex items-center justify-center gap-2 rounded font-semibold uppercase tracking-[0.12em] text-[0.8125rem] leading-none min-h-[44px] px-6 py-3.5 transition-all duration-300 disabled:opacity-50 disabled:pointer-events-none cursor-pointer select-none";

  const styles: Record<ButtonVariant, string> = {
    primary:
      "gold-fill btn-sheen text-ongold hover:-translate-y-1 hover:scale-[1.02] hover:shadow-[0_0_50px_rgba(212,175,55,0.35)] active:scale-[0.97] shadow-[0_0_0_rgba(212,175,55,0)] transition-[transform,box-shadow] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
    outline:
      "border border-gold/60 text-goldtext hover:text-ongold overflow-hidden group hover:border-gold active:scale-[0.98]",
    ghost:
      "text-goldtext link-gold normal-case tracking-normal font-medium text-[0.9375rem] px-0 py-1",
  };

  const inner =
    variant === "outline" ? (
      <>
        <span
          aria-hidden
          className="absolute inset-0 gold-fill translate-y-full group-hover:translate-y-0 transition-transform duration-300"
        />
        <span className="relative z-10 inline-flex items-center gap-2">{children}</span>
      </>
    ) : (
      <>{children}</>
    );

  const cls = `${base} ${styles[variant]} ${className}`;

  const comp = href ? (
    external ? (
      /* Lien externe (démo logicielle, document…) : <a> natif, nouvel onglet. */
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        onClick={onClick}
        className={cls}
        aria-label={ariaLabel}
      >
        {inner}
      </a>
    ) : (
      /* next/link : navigation client (SPA) au lieu d'un <a> natif qui rechargerait la page */
      <Link href={href} onClick={onClick} className={cls} aria-label={ariaLabel}>
        {inner}
      </Link>
    )
  ) : (
    <button type={type} onClick={onClick} disabled={disabled} className={cls} aria-label={ariaLabel}>
      {inner}
    </button>
  );

  return magnetic ? <Magnetic>{comp}</Magnetic> : comp;
}

/* ── Logo client : symbole infini doré, fond transparent ────── */

export function Monogram({ size = 40, className = "" }: { size?: number; className?: string }) {
  return (
    <span
      className={`relative inline-flex shrink-0 items-center justify-center ${className}`}
      style={{ width: size, height: size }}
      aria-hidden
    >
      <Image
        src="/logos/einsof-symbole-or.png"
        alt=""
        fill
        sizes="64px"
        className="object-contain drop-shadow-[0_0_10px_rgba(212,175,55,0.35)]"
      />
    </span>
  );
}

/* ── Séparateur avec filet d'or (statique) ──────────────────── */

export function GoldRule({ className = "" }: { className?: string }) {
  return <div aria-hidden className={`gold-rule w-full ${className}`} />;
}

/* ── GoldRuleDraw : filet d'or qui se dessine au défilement ─── */

export function GoldRuleDraw({ className = "" }: { className?: string }) {
  return <DrawRule className={`w-full ${className}`} />;
}

/* ── PriceTag : affichage de prix GNF normalisé ─────────────── */
/* `size` : "md" (blocs secondaires) · "lg" (cartes) · "xl" (héros
   des cartes tarif — le prix est l'ÉLÉMENT le plus visible, en haut
   de chaque carte, comme demandé par le client). */

const PRICE_SIZES = {
  md: { amount: "text-2xl md:text-[1.75rem]", period: "text-xs", from: "text-[0.6875rem]" },
  lg: { amount: "text-3xl md:text-4xl", period: "text-sm", from: "text-xs" },
  xl: {
    amount: "text-[2rem] leading-none md:text-[2.75rem]",
    period: "text-sm",
    from: "text-xs",
  },
} as const;

export function PriceTag({
  offer,
  fromLabel,
  perMonth,
  perYear,
  quoteLabel,
  billableNote,
  size = "md",
  className = "",
}: {
  offer: PriceOffer;
  fromLabel: string;
  perMonth: string;
  perYear: string;
  quoteLabel: string;
  billableNote?: string;
  size?: keyof typeof PRICE_SIZES;
  className?: string;
}) {
  const s = PRICE_SIZES[size];
  if (offer.isQuoteOnly || offer.amount === null) {
    return (
      <div className={className}>
        <span className={`font-serif font-semibold text-goldtext ${s.amount}`}>{quoteLabel}</span>
        {offer.footnote && <p className="mt-1 text-xs text-mute">{offer.footnote}</p>}
      </div>
    );
  }
  const period = offer.period === "month" ? perMonth : offer.period === "year" ? perYear : "";
  return (
    <div className={className}>
      <p className={`${s.from} font-medium uppercase tracking-[0.14em] text-mute`}>
        {offer.isFrom ? fromLabel : "\u00A0"}
      </p>
      <p
        className={`font-serif font-semibold text-goldtext leading-tight ${s.amount} drop-shadow-[0_0_18px_rgba(212,175,55,0.25)]`}
      >
        {formatGNF(offer.amount)}
        {period && (
          <span className={`font-sans font-normal text-mute ${s.period}`}> {period}</span>
        )}
      </p>
      {billableNote && offer.billableMonths ? (
        <p className="mt-0.5 text-xs text-mute">{billableNote}</p>
      ) : null}
      {offer.footnote && <p className="mt-1 text-xs text-mute">{offer.footnote}</p>}
    </div>
  );
}

/* ── Badge discret ──────────────────────────────────────────── */

export function GoldBadge({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border border-gold/40 px-3 py-1 text-[0.6875rem] font-medium uppercase tracking-[0.14em] text-goldtext ${className}`}
    >
      {children}
    </span>
  );
}
