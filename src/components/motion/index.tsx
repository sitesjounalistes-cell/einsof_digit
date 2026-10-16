"use client";

import React, {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import {
  animate,
  motion,
  useAnimationFrame,
  useInView,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
  type Variants,
} from "framer-motion";
import { useMotionMode } from "@/components/providers";

/* ── Courbes & ressorts partagés (design §22 / §32) ─────────── */

export const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];
export const EASE_INOUT: [number, number, number, number] = [0.76, 0, 0.24, 1];
export const SPRING_SOFT = { type: "spring", stiffness: 120, damping: 20, mass: 0.9 } as const;
export const SPRING_SNAPPY = { type: "spring", stiffness: 300, damping: 28, mass: 0.6 } as const;

const MOTION_TAGS = {
  div: motion.div,
  span: motion.span,
  section: motion.section,
  article: motion.article,
  li: motion.li,
  p: motion.p,
  h1: motion.h1,
  h2: motion.h2,
  h3: motion.h3,
} as const;

type MotionTag = keyof typeof MOTION_TAGS;

/* Style statique du mode léger — FILET DE SÉCURITÉ ANTI-CONTENT INVISIBLE :
 * quand le mode léger s'active APRÈS le montage (appareil faible détecté
 * en post-hydratation, ex. hardwareConcurrency ≤ 4), framer-motion laisse
 * les styles inline de `initial` (opacity:0, transform) sur les éléments
 * pas encore révélés — ils restaient invisibles POUR TOUJOURS. En posant
 * explicitement opacity/transform/filter dans la branche light, React
 * écrase ces styles obsolètes au re-render. */
const STATIC_VISIBLE = { opacity: 1, transform: "none", filter: "none" } as const;

/* HYDRATION (fix radix-_R_…) : en mode light on rend TOUJOURS LA MÊME
 * RÉFÉRENCE de composant (motion.div, motion.span…) qu'en mode complet —
 * uniquement sans props d'animation. Deux pièges à éviter :
 *  1. rendrre un <div> natif à la place de motion.div changerait le TYPE
 *     de l'élément → React démonte et remonte toute la sous-arbre au
 *     basculement post-montage du mode light (appareil faible /
 *     prefers-reduced-motion) → tous les useId (Radix Tabs/Accordion)
 *     sont régénérés → l'appariement d'hydratation casse quand le
 *     basculement chevauche celle-ci (IDs radix-_R_… ≠ radix-_r_…).
 *  2. envelopper dans un composant intermédiaire (<Static>) change
 *     AUSSI le type de fiber au même niveau → même remontade.
 * La seule forme sûre : <Comp className=…> avec Comp = motion.* identique. */

/* ── Reveal : entrée au défilement, 6 variantes riches ──────── */
/* variantes : up | down | left | right | scale | blur           */

const REVEAL_OFFSETS: Record<string, Record<string, number>> = {
  up: { y: 36, x: 0, scale: 1 },
  down: { y: -36, x: 0, scale: 1 },
  left: { y: 0, x: -44, scale: 1 },
  right: { y: 0, x: 44, scale: 1 },
  scale: { y: 24, x: 0, scale: 0.92 },
  blur: { y: 20, x: 0, scale: 1.01 },
};

export function Reveal({
  children,
  delay = 0,
  className = "",
  as = "div",
  once = true,
  y = 36,
  duration = 0.9,
  variant = "up",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: MotionTag;
  once?: boolean;
  y?: number;
  duration?: number;
  variant?: "up" | "down" | "left" | "right" | "scale" | "blur";
}) {
  const { lightMode } = useMotionMode();
  const Comp = MOTION_TAGS[as] ?? motion.div;

  /* Même référence motion.* dans les deux modes (voir note HYDRATION)
     : mode light = motion.* sans props d'animation, zéro remontade. */
  if (lightMode)
    return (
      <Comp key="lm" className={className}>
        {children}
      </Comp>
    );

  const base = REVEAL_OFFSETS[variant] ?? REVEAL_OFFSETS.up;
  const offset = variant === "blur"
    ? { opacity: 0, y: base.y, x: 0, scale: base.scale, filter: "blur(14px)" }
    : { opacity: 0, y: y ?? base.y, x: base.x, scale: base.scale };

  return (
    <Comp
      key="fm"
      className={className}
      initial={offset}
      whileInView={{ opacity: 1, x: 0, y: 0, scale: 1, filter: "blur(0px)" }}
      viewport={{ once, margin: "-60px" }}
      transition={{ duration, ease: EASE, delay }}
      style={{ willChange: "opacity, transform" }}
    >
      {children}
    </Comp>
  );
}

/* ── Stagger : orchestration des enfants (blocs) ────────────── */

export function Stagger({
  children,
  className = "",
  as = "div",
  delay = 0,
  step = 0.08,
  once = true,
}: {
  children: ReactNode;
  className?: string;
  as?: MotionTag;
  delay?: number;
  step?: number;
  once?: boolean;
}) {
  const { lightMode } = useMotionMode();
  const Comp = MOTION_TAGS[as] ?? motion.div;

  if (lightMode)
    return (
      <Comp key="lm" className={className}>
        {children}
      </Comp>
    );

  return (
    <Comp
      key="fm"
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: "-60px" }}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: step, delayChildren: delay } },
      }}
    >
      {children}
    </Comp>
  );
}

export function StaggerItem({
  children,
  className = "",
  as = "div",
  y = 32,
}: {
  children: ReactNode;
  className?: string;
  as?: MotionTag;
  y?: number;
}) {
  const { lightMode } = useMotionMode();
  const Comp = MOTION_TAGS[as] ?? motion.div;

  if (lightMode)
    return (
      <Comp key="lm" className={className}>
        {children}
      </Comp>
    );

  return (
    <Comp
      key="fm"
      className={className}
      variants={{
        hidden: { opacity: 0, y, scale: 0.97, filter: "blur(6px)" },
        visible: {
          opacity: 1,
          y: 0,
          scale: 1,
          filter: "blur(0px)",
          transition: SPRING_SOFT,
        },
      }}
      style={{ willChange: "opacity, transform" }}
    >
      {children}
    </Comp>
  );
}

/* ── Parallax : translation liée au défilement ──────────────── */

export function Parallax({
  children,
  className = "",
  speed = 0.25,
}: {
  children: ReactNode;
  className?: string;
  /** 0 = figé, 0.5 = très mobile (±50 % de la hauteur traversée) */
  speed?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { lightMode } = useMotionMode();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const raw = useTransform(scrollYProgress, [0, 1], [speed * 120, speed * -120]);
  const y = useSpring(raw, { stiffness: 55, damping: 22, mass: 0.6 });

  if (lightMode) return <motion.div ref={ref} className={className}>{children}</motion.div>;

  return (
    <motion.div ref={ref} style={{ y }} className={className}>
      {children}
    </motion.div>
  );
}

/* ── Float : lévitation continue (ornements, badges) ────────── */

export function Float({
  children,
  className = "",
  y = 12,
  rotate = 0,
  duration = 6,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  y?: number;
  rotate?: number;
  duration?: number;
  delay?: number;
}) {
  const { lightMode } = useMotionMode();

  if (lightMode) return <motion.div className={className}>{children}</motion.div>;

  return (
    <motion.div
      className={className}
      animate={{
        y: [0, -y, 0],
        rotate: rotate ? [0, rotate, 0] : 0,
      }}
      transition={{ duration, delay, repeat: Infinity, ease: "easeInOut" }}
    >
      {children}
    </motion.div>
  );
}

/* ── Shimmer : texte or animé (balayage lumineux) ───────────── */

export function Shimmer({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const { lightMode } = useMotionMode();
  return (
    <span className={`shimmer-text ${lightMode ? "gold-text-gradient" : ""} ${className}`}>
      {children}
    </span>
  );
}

/* ── Beam : bordure dorée animée (bandeau lumineux) ─────────── */

export function Beam({
  children,
  className = "",
  always = false,
}: {
  children: ReactNode;
  className?: string;
  always?: boolean;
}) {
  return (
    <div className={`beam-wrap ${always ? "beam-always" : ""} ${className}`}>{children}</div>
  );
}

/* ── SpotlightCard : halo or suivant le curseur (cartes) ────── */

export function SpotlightCard({
  children,
  className = "",
  size = 460,
}: {
  children: ReactNode;
  className?: string;
  size?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { lightMode, desktop } = useMotionMode();

  const onMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el || lightMode || !desktop) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - r.left}px`);
    el.style.setProperty("--my", `${e.clientY - r.top}px`);
    el.style.setProperty("--spot-op", "1");
  };
  const onLeave = () => {
    const el = ref.current;
    if (el) el.style.setProperty("--spot-op", "0");
  };

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={`spot-card ${className}`}
      style={{ "--spot-size": `${size}px` } as CSSProperties}
    >
      {children}
    </div>
  );
}

/* ── DrawRule : filet d'or qui se dessine à l'écran ─────────── */

export function DrawRule({
  className = "",
  delay = 0,
  duration = 1.1,
}: {
  className?: string;
  delay?: number;
  duration?: number;
}) {
  const { lightMode } = useMotionMode();

  if (lightMode)
    return (
      <motion.div
        aria-hidden
        className={`gold-rule ${className}`}
        style={{ transform: "none" }}
      />
    );

  return (
    <motion.div
      aria-hidden
      className={`gold-rule ${className}`}
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration, ease: EASE, delay }}
      style={{ transformOrigin: "left center" }}
    />
  );
}

/* ── Counter : compte animé spring (chiffres clés) ──────────── */

export function Counter({
  to,
  duration = 2000,
  className = "",
  prefix = "",
  suffix = "",
  decimals = 0,
}: {
  to: number;
  duration?: number;
  className?: string;
  prefix?: string;
  suffix?: string;
  decimals?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const { lightMode } = useMotionMode();
  const [val, setVal] = useState(0);

  useEffect(() => {
    if (!inView || lightMode) return;
    const controls = animate(0, to, {
      duration: duration / 1000,
      ease: EASE,
      onUpdate: (v) => setVal(v),
    });
    return () => controls.stop();
  }, [inView, to, duration, lightMode]);

  const shown = lightMode ? to : val;
  const formatted = new Intl.NumberFormat("fr-FR", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(shown);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
}

/* ── Marquee : bandeau défilant en boucle ───────────────────── */

export function Marquee({
  children,
  duration = 40,
  className = "",
}: {
  children: ReactNode;
  duration?: number;
  className?: string;
}) {
  const { lightMode } = useMotionMode();
  return (
    <div
      className={`marquee-paused overflow-hidden ${className}`}
      style={
        lightMode
          ? undefined
          : ({ "--marquee-duration": `${duration}s` } as CSSProperties)
      }
    >
      <div
        className="marquee-track items-center"
        style={lightMode ? { flexWrap: "wrap", width: "100%", justifyContent: "center" } : undefined}
      >
        {children}
        {!lightMode && children}
      </div>
    </div>
  );
}

/* ── VelocityRow : ruban réactif à la vitesse de défilement ─── */

const wrap = (min: number, max: number, v: number) => {
  const range = max - min;
  return ((((v - min) % range) + range) % range) + min;
};

export function VelocityRow({
  children,
  className = "",
  baseVelocity = 2.2,
}: {
  children: ReactNode;
  className?: string;
  /** % de largeur par seconde */
  baseVelocity?: number;
}) {
  const { lightMode } = useMotionMode();
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, { damping: 50, stiffness: 400 });
  const velocityFactor = useTransform(smoothVelocity, [0, 1200], [0, 4.5], { clamp: false });
  const direction = useRef(1);
  const x = useTransform(baseX, (v) => `${wrap(-50, 0, v)}%`);

  useAnimationFrame((_t, delta) => {
    if (lightMode) return;
    let moveBy = direction.current * baseVelocity * (delta / 1000);
    const vf = velocityFactor.get();
    if (vf < 0) direction.current = -1;
    else if (vf > 0) direction.current = 1;
    moveBy += direction.current * moveBy * Math.abs(vf);
    baseX.set(baseX.get() + moveBy);
  });

  if (lightMode) {
    return (
      <div className={`overflow-hidden ${className}`}>
        <motion.div className="flex w-max items-center">{children}</motion.div>
      </div>
    );
  }

  return (
    <div className={`overflow-hidden whitespace-nowrap ${className}`}>
      <motion.div className="flex w-max items-center whitespace-nowrap" style={{ x }}>
        {children}
        {children}
        {children}
        {children}
      </motion.div>
    </div>
  );
}

/* ── Magnetic : boutons magnétiques (ordinateur uniquement) ─── */

export function Magnetic({ children, radius = 80 }: { children: ReactNode; radius?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const { lightMode, desktop } = useMotionMode();

  useEffect(() => {
    const el = ref.current;
    if (!el || lightMode || !desktop) return;
    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.hypot(dx, dy);
      if (dist < radius) {
        el.style.transform = `translate(${dx * 0.28}px, ${dy * 0.28}px)`;
      } else {
        el.style.transform = "translate(0,0)";
      }
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, [radius, lightMode, desktop]);

  return (
    <span
      ref={ref}
      className="inline-block transition-transform duration-300"
      style={{ transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)" }}
    >
      {children}
    </span>
  );
}

/* ── Tilt : inclinaison 3D des cartes (6° max, ordinateur) ──── */

export function Tilt({
  children,
  className = "",
  max = 6,
}: {
  children: ReactNode;
  className?: string;
  max?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { lightMode, desktop } = useMotionMode();

  const onMouseMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el || lightMode || !desktop) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `perspective(1000px) rotateX(${(-py * max).toFixed(2)}deg) rotateY(${(px * max).toFixed(2)}deg) translateZ(0)`;
  };
  const onMouseLeave = () => {
    const el = ref.current;
    if (el) el.style.transform = "perspective(1000px) rotateX(0) rotateY(0)";
  };

  return (
    <div
      ref={ref}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      className={`transition-transform duration-500 ${className}`}
      style={{
        transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
        transformStyle: "preserve-3d",
      }}
    >
      {children}
    </div>
  );
}

/* ── ScrollProgress : filet doré de lecture en haut ─────────── */

export function ScrollProgress() {
  const { lightMode } = useMotionMode();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: 0.4 });

  if (lightMode) {
    return <motion.div aria-hidden className="fixed left-0 top-0 z-[70] h-[2px] w-full origin-left gold-fill" />;
  }
  return (
    <motion.div
      aria-hidden
      className="fixed left-0 top-0 z-[70] h-[2px] w-full origin-left gold-fill"
      style={{ scaleX }}
    />
  );
}

/* ── WordMask : titre révélé mot par mot (masque vertical) ────
   FIABILITÉ (v3) :
   1. L'observation se fait UNE SEULE FOIS sur l'enveloppe (élément
      jamais transformé ni masqué) puis l'animation est propagée à
      chaque mot — aucun IntersectionObserver sur un élément caché.
   2. Filet de sécurité : si l'observation échoue (iframe, quirk
      navigateur…), un temporisateur force l'affichage complet —
      un texte ne peut plus rester invisible pour toujours.
   3. `gold` : le dégradé doré est posé SUR CHAQUE MOT (l'élément
      animé lui-même) et JAMAIS sur un parent en background-clip:text.
      Chrome ne peint pas le dégradé d'un ancêtre à travers des
      descendants transformés → texte doré entièrement invisible. */
export function WordMask({
  text,
  className = "",
  delay = 0,
  step = 0.07,
  gold = false,
}: {
  text: string;
  className?: string;
  delay?: number;
  step?: number;
  gold?: boolean;
}) {
  const { lightMode } = useMotionMode();
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [forceShown, setForceShown] = useState(false);
  const words = text.split(" ");

  /* Filet de sécurité : quel que soit l'environnement, le texte
     s'affiche intégralement au plus tard 4 s après le montage. */
  useEffect(() => {
    if (lightMode) return;
    const t = setTimeout(() => setForceShown(true), 4000);
    return () => clearTimeout(t);
  }, [lightMode]);

  if (lightMode) {
    return (
      <span className={`${gold ? "gold-text-gradient " : ""}${className}`}>{text}</span>
    );
  }

  const shown = inView || forceShown;

  return (
    <span ref={ref} className={className}>
      {words.map((w, i) => (
        /* Masque par mot : léger débord de clip (px/-mx, pb/-mb) pour que
           les italiques, accents et jambages ne soient jamais rognés. */
        <span
          key={i}
          className="inline-block overflow-hidden align-bottom px-[0.06em] -mx-[0.06em] pb-[0.12em] -mb-[0.12em]"
        >
          <motion.span
            className={`inline-block will-change-transform ${gold ? "gold-text-gradient" : ""}`}
            initial={{ y: "130%" }}
            animate={shown ? { y: "0%" } : { y: "130%" }}
            transition={{ duration: 0.85, ease: EASE, delay: delay + i * step }}
          >
            {w}
            {i < words.length - 1 ? "\u00A0" : ""}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

/* ── LettersReveal : mot lettre par lettre (pied de page, logo) */

export function LettersReveal({
  text,
  className = "",
  delay = 0,
  step = 0.045,
}: {
  text: string;
  className?: string;
  delay?: number;
  step?: number;
}) {
  const { lightMode } = useMotionMode();
  const letters = Array.from(text);

  if (lightMode) return <span className={className}>{text}</span>;

  return (
    <span className={className} aria-label={text}>
      {letters.map((ch, i) => (
        <motion.span
          key={i}
          aria-hidden
          className="inline-block will-change-transform"
          initial={{ opacity: 0, y: "0.6em", rotate: 8 }}
          whileInView={{ opacity: 1, y: 0, rotate: 0 }}
          viewport={{ once: true, margin: "-30px" }}
          transition={{ duration: 0.7, ease: EASE, delay: delay + i * step }}
        >
          {ch === " " ? "\u00A0" : ch}
        </motion.span>
      ))}
    </span>
  );
}

/* ── PopIn : apparition élastique (icônes, pastilles) ───────── */

export function PopIn({
  children,
  className = "",
  delay = 0,
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  as?: MotionTag;
}) {
  const { lightMode } = useMotionMode();
  const Comp = MOTION_TAGS[as] ?? motion.div;

  if (lightMode)
    return (
      <Comp key="lm" className={className}>
        {children}
      </Comp>
    );

  return (
    <Comp
      key="fm"
      className={className}
      initial={{ opacity: 0, scale: 0.4, rotate: -10 }}
      whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ ...SPRING_SNAPPY, delay }}
    >
      {children}
    </Comp>
  );
}

/* ── PulseGlow : pulsation lumineuse continue (badge, CTA) ──── */

export function PulseGlow({
  children,
  className = "",
  duration = 3,
}: {
  children: ReactNode;
  className?: string;
  duration?: number;
}) {
  const { lightMode } = useMotionMode();

  if (lightMode) return <span className={className}>{children}</span>;

  return (
    <motion.span
      className={`inline-block ${className}`}
      animate={{ opacity: [1, 0.75, 1], filter: ["brightness(1)", "brightness(1.18)", "brightness(1)"] }}
      transition={{ duration, repeat: Infinity, ease: "easeInOut" }}
    >
      {children}
    </motion.span>
  );
}

/* ── CurtainIntro : rideau d'ouverture or & obsidienne ──────── */

export function CurtainIntro({ brand = "EINSOF" }: { brand?: string }) {
  const { lightMode } = useMotionMode();
  const [gone, setGone] = useState(false);

  useEffect(() => {
    if (lightMode) return;
    const t = setTimeout(() => setGone(true), 1500);
    return () => clearTimeout(t);
  }, [lightMode]);

  if (lightMode || gone) return null;

  return (
    <motion.div
      aria-hidden
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-bg"
      initial={{ y: 0 }}
      animate={{ y: "-100%" }}
      transition={{ delay: 0.75, duration: 0.75, ease: EASE_INOUT }}
    >
      <motion.span
        className="font-serif text-3xl tracking-[0.35em] gold-text-gradient md:text-4xl"
        initial={{ opacity: 0, letterSpacing: "0.8em" }}
        animate={{ opacity: 1, letterSpacing: "0.35em" }}
        transition={{ duration: 0.9, ease: EASE }}
      >
        {brand}
      </motion.span>
      <motion.div
        className="gold-rule mt-5 w-40"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.7, ease: EASE, delay: 0.15 }}
      />
    </motion.div>
  );
}

/* ── AccordionMotion : panneau dépliant animé (hauteur auto) ── */

export function CollapseMotion({
  open,
  children,
  className = "",
}: {
  open: boolean;
  children: ReactNode;
  className?: string;
}) {
  const { lightMode } = useMotionMode();

  if (lightMode) {
    return open ? <motion.div className={className}>{children}</motion.div> : null;
  }

  return (
    <motion.div
      className={className}
      initial={false}
      animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }}
      transition={{ duration: 0.45, ease: EASE }}
      style={{ overflow: "hidden" }}
    >
      {children}
    </motion.div>
  );
}

/* ── Groupe de variantes exportées (utilisé par les sections) ── */

export const staggerParent: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

export const staggerChild: Variants = {
  hidden: { opacity: 0, y: 32, scale: 0.97 },
  visible: { opacity: 1, y: 0, scale: 1, transition: SPRING_SOFT },
};
