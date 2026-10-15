"use client";

import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import Link from "next/link";
import {
  AnimatePresence,
  animate,
  motion,
  useMotionValue,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { EASE } from "@/components/motion";
import { useMotionMode } from "@/components/providers";

/**
 * Carrousel « coverflow » — la carte active trône au centre, mise en
 * emphase (pleine échelle, lueur dorée, premier plan), tandis que les
 * cartes voisines s'alignent à gauche et à droite, légèrement réduites,
 * assombries et repoussées en profondeur (perspective 3D).
 *
 * Dynamique :
 * - ressort vif (stiffness 420) avec léger dépassement — chaque
 *   transition a du punch, rien de mou ;
 * - glisser-déposer 1:1 au pointeur avec « flick » : une impulsion
 *   rapide fait toujours avancer d'au moins une carte ;
 * - lecture automatique (pause au survol, au focus, pendant le
 *   glissement et onglet masqué ; temporisation après interaction) ;
 * - flèches, pastilles cliquables et clavier (←/→/Début/Fin).
 *
 * Comportement du clic : une carte latérale se centre d'abord ; la
 * carte centrale (active) suit son lien vers la page détaillée.
 * Mode « animations réduites » : rail statique avec snap + flèches.
 */

export interface CoverflowItem {
  key: string;
  /** page ouverte par la carte lorsqu'elle est au centre */
  href?: string;
  ariaLabel: string;
}

const clamp = (v: number, min: number, max: number) =>
  Math.min(max, Math.max(min, v));

/* Ressort vif : départ nerveux, dépassement subtil, arrêt franc */
const SPRING = { type: "spring", stiffness: 420, damping: 29, mass: 1 } as const;

/* Largeur d'une carte + espacement de couverture (recouvrement 78 %) */
const CARD_CLS = "w-[min(80vw,350px)]";

function pad2(n: number) {
  return String(n).padStart(2, "0");
}

/* ── Carte positionnée en 3D selon sa distance à la position courante ── */
function CoverflowCard({
  item,
  i,
  pos,
  step,
  active,
  near,
  onActivate,
  children,
}: {
  item: CoverflowItem;
  i: number;
  pos: MotionValue<number>;
  step: number;
  active: boolean;
  near: boolean;
  onActivate: (i: number) => void;
  children: ReactNode;
}) {
  /* o > 0 : carte à gauche du centre ; o < 0 : à droite */
  const o = useTransform(pos, (v) => i - v);
  const x = useTransform(pos, (v) => (i - v) * step);
  const z = useTransform(o, (ov) => -Math.min(Math.abs(ov), 2.6) * 150);
  const rotateY = useTransform(o, (ov) => clamp(-ov, -2.2, 2.2) * 13);
  const scale = useTransform(o, (ov) => 1 - Math.min(Math.abs(ov), 2) * 0.13);
  const opacity = useTransform(
    o,
    (ov) =>
      Math.abs(ov) > 2.45 ? 0 : 1 - Math.max(0, Math.abs(ov) - 0.35) * 0.3
  );
  const brightness = useTransform(
    o,
    (ov) => `brightness(${1 - Math.min(Math.abs(ov), 2) * 0.24})`
  );
  const zIndex = useTransform(o, (ov) => 100 - Math.round(Math.abs(ov) * 10));

  return (
    <motion.div
      aria-hidden={!near}
      className="pointer-events-none absolute inset-0 flex justify-center will-change-transform"
      style={{ x, z, rotateY, scale, opacity, filter: brightness, zIndex }}
    >
      <div className={`h-full py-3 ${CARD_CLS}`}>
        {item.href ? (
          <Link
            href={item.href}
            aria-label={item.ariaLabel}
            tabIndex={near ? 0 : -1}
            onClick={(e) => {
              if (!active) {
                e.preventDefault();
                onActivate(i);
              }
            }}
            className={`pointer-events-auto block h-full focus-visible:outline focus-visible:outline-1 focus-visible:outline-gold ${
              active ? "cursor-pointer" : "cursor-grab active:cursor-grabbing"
            }`}
          >
            {children}
          </Link>
        ) : (
          <button
            type="button"
            onClick={() => !active && onActivate(i)}
            tabIndex={near ? 0 : -1}
            aria-label={item.ariaLabel}
            className="pointer-events-auto block h-full w-full text-left"
          >
            {children}
          </button>
        )}
      </div>
    </motion.div>
  );
}

export function CoverflowCarousel({
  items,
  renderItem,
  ariaLabel,
  autoplayMs = 5000,
  viewportClassName = "h-[500px] sm:h-[540px]",
  className = "",
}: {
  items: CoverflowItem[];
  /** contenu d'une carte ; `active` permet d'accentuer la carte centrale */
  renderItem: (item: CoverflowItem, state: { active: boolean; index: number }) => ReactNode;
  ariaLabel: string;
  /** durée d'une étape de lecture automatique (0 = désactivée) */
  autoplayMs?: number;
  /** hauteur du rail 3D (les cartes remplissent la hauteur) */
  viewportClassName?: string;
  className?: string;
}) {
  const { lightMode } = useMotionMode();
  const n = items.length;

  const [index, setIndex] = useState(0);
  const indexRef = useRef(0);
  const pos = useMotionValue(0);
  const [step, setStep] = useState(300);
  const viewportRef = useRef<HTMLDivElement>(null);
  const railRef = useRef<HTMLDivElement>(null);
  const drag = useRef<{ startX: number; startPos: number; moved: boolean } | null>(null);
  const suppressClick = useRef(false);
  const lastInteract = useRef(0);
  const [paused, setPaused] = useState(false);

  /* Mesure de l'espacement : largeur carte × 0.78 (recouvrement couverture) */
  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;
    const measure = () => {
      const w = Math.min(el.clientWidth * 0.8, 350);
      setStep(w * 0.78);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const goTo = useCallback(
    (i: number) => {
      const target = clamp(Math.round(i), 0, n - 1);
      indexRef.current = target;
      lastInteract.current = Date.now();
      setIndex(target);
      const from = pos.get();
      const dist = Math.abs(target - from);
      if (dist > 2.5) {
        /* Grand trajet (rebobinage fin de cycle) : glisse fluide */
        animate(pos, target, { duration: 0.55 + dist * 0.05, ease: EASE });
      } else {
        animate(pos, target, SPRING);
      }
    },
    [n, pos]
  );

  /* Lecture automatique — tempo humaine, pauses respectueuses */
  useEffect(() => {
    if (lightMode || autoplayMs <= 0 || paused || n < 2) return;
    const id = window.setInterval(() => {
      if (document.hidden || drag.current) return;
      if (Date.now() - lastInteract.current < 3600) return;
      const next = indexRef.current + 1 >= n ? 0 : indexRef.current + 1;
      goTo(next);
    }, autoplayMs);
    return () => window.clearInterval(id);
  }, [lightMode, paused, autoplayMs, n, goTo]);

  /* ── Glisser-déposer (pointeur unifié : souris, tactile, stylet) ── */
  const onPointerDown = (e: React.PointerEvent) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    drag.current = { startX: e.clientX, startPos: pos.get(), moved: false };
  };
  const onPointerMove = (e: React.PointerEvent) => {
    const d = drag.current;
    if (!d) return;
    const dx = e.clientX - d.startX;
    if (!d.moved && Math.abs(dx) > 5) d.moved = true;
    if (!d.moved) return;
    let raw = d.startPos - dx / step;
    const c = clamp(raw, 0, n - 1);
    raw = c + (raw - c) * 0.2; /* élastique aux extrémités */
    pos.set(raw);
    lastInteract.current = Date.now();
  };
  const endDrag = (e: React.PointerEvent) => {
    const d = drag.current;
    if (!d) return;
    drag.current = null;
    if (!d.moved) return;
    suppressClick.current = true;
    window.setTimeout(() => (suppressClick.current = false), 120);
    const dx = e.clientX - d.startX;
    const raw = d.startPos - dx / step;
    let target = Math.round(raw);
    /* Flick : une impulsion franche avance toujours d'une carte */
    if (dx < -48) target = Math.max(target, Math.ceil(d.startPos + 0.001));
    if (dx > 48) target = Math.min(target, Math.floor(d.startPos - 0.001));
    goTo(target);
  };

  /* Clavier : ←/→/Début/Fin */
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      goTo(indexRef.current - 1);
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      goTo(indexRef.current + 1);
    } else if (e.key === "Home") {
      e.preventDefault();
      goTo(0);
    } else if (e.key === "End") {
      e.preventDefault();
      goTo(n - 1);
    }
  };

  /* ── Mode animations réduites : rail statique à accroche ── */
  if (lightMode) {
    const scrollByCard = (dir: 1 | -1) => {
      const rail = railRef.current;
      if (!rail) return;
      rail.scrollBy({ left: dir * (rail.clientWidth * 0.8 + 24), behavior: "smooth" });
    };
    /* Suivi de la carte visible (pastilles + état des flèches) */
    const onRailScroll = () => {
      const rail = railRef.current;
      if (!rail) return;
      const cardW = rail.clientWidth * 0.8 + 24;
      const i = Math.round(rail.scrollLeft / cardW);
      if (i !== index && i >= 0 && i < n) setIndex(i);
    };
    return (
      <div
        role="region"
        aria-roledescription="carrousel"
        aria-label={ariaLabel}
        className={className}
      >
        <div
          ref={railRef}
          onScroll={onRailScroll}
          className="flex snap-x snap-mandatory gap-6 overflow-x-auto pb-4 [scrollbar-width:thin]"
        >
          {items.map((it, i) => (
            <div key={it.key} className={`${CARD_CLS} shrink-0 snap-center`}>
              {it.href ? (
                <Link href={it.href} aria-label={it.ariaLabel} className="block h-full">
                  {renderItem(it, { active: i === index, index: i })}
                </Link>
              ) : (
                renderItem(it, { active: i === index, index: i })
              )}
            </div>
          ))}
        </div>
        <div className="mt-6 flex items-center justify-center gap-3">
          <RailButton dir="prev" onClick={() => scrollByCard(-1)} disabled={index === 0} />
          <div className="flex items-center gap-2">
            {items.map((it, i) => (
              <Dot
                key={it.key}
                active={i === index}
                label={it.ariaLabel}
                onClick={() => {
                  const rail = railRef.current;
                  if (rail)
                    rail.scrollTo({
                      left: i * (rail.clientWidth * 0.8 + 24),
                      behavior: "smooth",
                    });
                  setIndex(i);
                }}
              />
            ))}
          </div>
          <RailButton dir="next" onClick={() => scrollByCard(1)} disabled={index === n - 1} />
        </div>
      </div>
    );
  }

  return (
    <div role="region" aria-roledescription="carrousel" aria-label={ariaLabel} className={className}>
      {/* Rail 3D */}
      <div
        ref={viewportRef}
        tabIndex={0}
        onKeyDown={onKeyDown}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocusCapture={() => setPaused(true)}
        onBlurCapture={() => setPaused(false)}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onClickCapture={(e) => {
          if (suppressClick.current) {
            e.preventDefault();
            e.stopPropagation();
          }
        }}
        className={`relative select-none outline-none [perspective:1500px] [touch-action:pan-y] ${viewportClassName}`}
      >
        {/* Halo doré derrière la carte centrale */}
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-1/2 h-[75%] w-[75%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(212,175,55,0.12),transparent_75%)]"
        />
        {items.map((it, i) => (
          <CoverflowCard
            key={it.key}
            item={it}
            i={i}
            pos={pos}
            step={step}
            active={i === index}
            near={Math.abs(i - index) <= 1}
            onActivate={goTo}
          >
            {renderItem(it, { active: i === index, index: i })}
          </CoverflowCard>
        ))}
      </div>

      {/* Commandes : flèches + pastilles + compteur */}
      <div className="mt-7 flex items-center justify-center gap-5">
        <RailButton dir="prev" onClick={() => goTo(indexRef.current - 1)} disabled={index === 0} />
        <div className="flex items-center gap-2.5">
          {items.map((it, i) => (
            <Dot key={it.key} active={i === index} label={it.ariaLabel} onClick={() => goTo(i)} />
          ))}
        </div>
        <RailButton dir="next" onClick={() => goTo(indexRef.current + 1)} disabled={index === n - 1} />
      </div>

      {/* Compteur or « 02 / 07 » — rebond à chaque changement */}
      <div className="mt-4 flex items-center justify-center gap-1.5" aria-hidden>
        <span className="relative inline-flex h-7 w-9 items-center justify-center overflow-hidden">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span
              key={index}
              initial={{ y: 16, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -16, opacity: 0 }}
              transition={{ duration: 0.35, ease: EASE }}
              className="absolute font-serif text-lg font-semibold text-goldtext"
            >
              {pad2(index + 1)}
            </motion.span>
          </AnimatePresence>
        </span>
        <span className="font-serif text-lg text-mute">/ {pad2(n)}</span>
      </div>
    </div>
  );
}

/* ── Pastille de pagination ───────────────────────────────────── */
function Dot({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      aria-current={active || undefined}
      className="group flex h-8 min-w-8 cursor-pointer items-center justify-center"
    >
      <span
        className={`block h-1.5 rounded-full transition-all duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          active
            ? "w-7 bg-gold shadow-[0_0_12px_rgba(212,175,55,0.5)]"
            : "w-1.5 bg-line group-hover:w-3 group-hover:bg-gold/60"
        }`}
      />
    </button>
  );
}

/* ── Bouton circulaire précédent / suivant ────────────────────── */
function RailButton({
  dir,
  onClick,
  disabled,
}: {
  dir: "prev" | "next";
  onClick: () => void;
  disabled?: boolean;
}) {
  const Icon = dir === "prev" ? ChevronLeft : ChevronRight;
  return (
    <motion.button
      type="button"
      onClick={onClick}
      disabled={disabled}
      whileTap={disabled ? undefined : { scale: 0.86 }}
      transition={{ type: "spring", stiffness: 500, damping: 24 }}
      aria-label={dir === "prev" ? "Carte précédente" : "Carte suivante"}
      className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-line bg-surface text-mute transition-colors duration-300 hover:border-gold/60 hover:text-goldtext disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:border-line disabled:hover:text-mute"
    >
      <Icon size={18} strokeWidth={1.5} aria-hidden />
    </motion.button>
  );
}
