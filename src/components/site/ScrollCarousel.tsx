"use client";

import React, { useEffect, useRef, useState, type ReactNode } from "react";
import { motion, useAnimationFrame, useMotionValue } from "framer-motion";
import { useMotionMode } from "@/components/providers";

/**
 * Carrousel défilant infini (bord à bord, sans coupure) :
 * - défilement continu piloté par useAnimationFrame (vitesse px/s) ;
 * - pause au survol et dès qu'un lien interne reçoit le focus clavier ;
 * - boucle parfaitement transparente : translation modulo largeur d'un
 *   « set » de cartes (3 sets rendus, les sets > 0 sont aria-hidden) ;
 * - dégradés de fondu sur les deux bords (couleur du fond du parent) ;
 * - mode « animations réduites » : simple rail scrollable avec snap.
 */
export function ScrollCarousel({
  children,
  ariaLabel,
  speed = 26,
  tone = "bg",
  className = "",
}: {
  children: ReactNode;
  /** libellé accessible de la région */
  ariaLabel: string;
  /** vitesse de défilement en px/s */
  speed?: number;
  /** couleur des fondus de bord = ton de fond de la section parente */
  tone?: "bg" | "surface";
  className?: string;
}) {
  const { lightMode } = useMotionMode();
  const setRef = useRef<HTMLDivElement>(null);
  const [setWidth, setSetWidth] = useState(0);
  const paused = useRef(false);
  const x = useMotionValue(0);

  /* Mesure de la largeur d'un set (responsive : à chaque redimensionnement) */
  useEffect(() => {
    const el = setRef.current;
    if (!el) return;
    const measure = () => setSetWidth(el.offsetWidth);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useAnimationFrame((_t, delta) => {
    if (lightMode || paused.current || setWidth <= 0) return;
    const next = x.get() - speed * (delta / 1000);
    /* boucle modulo : jamais de saut visuel */
    x.set(next <= -setWidth ? next + setWidth : next);
  });

  const pause = () => (paused.current = true);
  const resume = () => (paused.current = false);

  if (lightMode) {
    return (
      <div
        role="region"
        aria-roledescription="carrousel"
        aria-label={ariaLabel}
        className={`-mx-5 overflow-x-auto px-5 pb-4 md:mx-0 md:px-0 [scrollbar-width:thin] ${className}`}
      >
        <div className="flex w-max snap-x snap-mandatory gap-6">{children}</div>
      </div>
    );
  }

  return (
    <div
      role="region"
      aria-roledescription="carrousel"
      aria-label={ariaLabel}
      className={`relative ${className}`}
      onMouseEnter={pause}
      onMouseLeave={resume}
      onFocusCapture={pause}
      onBlurCapture={resume}
      onTouchStart={pause}
      onTouchEnd={resume}
    >
      <motion.div className="flex w-max will-change-transform" style={{ x }}>
        {[0, 1, 2].map((set) => (
          <div
            key={set}
            ref={set === 0 ? setRef : undefined}
            aria-hidden={set > 0}
            className="flex shrink-0 gap-6 pr-6"
          >
            {React.Children.map(children, (child) =>
              set > 0 && React.isValidElement(child)
                ? React.cloneElement(child as React.ReactElement<{ tabIndex?: number }>, {
                    tabIndex: -1,
                  })
                : child
            )}
          </div>
        ))}
      </motion.div>

      {/* Fondus latéraux (masquent l'entrée/sortie des cartes) */}
      <div
        aria-hidden
        className={`pointer-events-none absolute inset-y-0 left-0 z-10 w-10 bg-gradient-to-r to-transparent md:w-24 ${
          tone === "surface" ? "from-surface" : "from-bg"
        }`}
      />
      <div
        aria-hidden
        className={`pointer-events-none absolute inset-y-0 right-0 z-10 w-10 bg-gradient-to-l to-transparent md:w-24 ${
          tone === "surface" ? "from-surface" : "from-bg"
        }`}
      />
    </div>
  );
}
