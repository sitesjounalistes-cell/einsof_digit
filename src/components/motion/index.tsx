"use client";

import React, {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import { useMotionMode } from "@/components/providers";

const EASE = "cubic-bezier(0.22, 1, 0.36, 1)";

/* ── Reveal : apparition au défilement (opacité + 24 px vers le haut) ── */

export function Reveal({
  children,
  delay = 0,
  className = "",
  as: Tag = "div",
  once = true,
  y = 24,
  duration = 700,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: keyof React.JSX.IntrinsicElements;
  once?: boolean;
  y?: number;
  duration?: number;
}) {
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);
  const { lightMode } = useMotionMode();

  useEffect(() => {
    const el = ref.current;
    if (!el || lightMode) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          if (once) io.disconnect();
        } else if (!once) setVisible(false);
      },
      { threshold: 0.2 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [lightMode, once]);

  const shown = visible || lightMode;

  const style: CSSProperties = {
    opacity: shown ? 1 : 0,
    transform: shown ? "translateY(0)" : `translateY(${y}px)`,
    transition: lightMode
      ? "opacity .3s ease"
      : `opacity ${duration}ms ${EASE} ${delay}ms, transform ${duration}ms ${EASE} ${delay}ms`,
    willChange: "opacity, transform",
  };

  const Comp = Tag as React.ElementType;
  return (
    <Comp ref={ref} className={className} style={style}>
      {children}
    </Comp>
  );
}

/* ── Counter : compte animé 0 → valeur en 1,6 s ─────────────── */

export function Counter({
  to,
  duration = 1600,
  className = "",
}: {
  to: number;
  duration?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [value, setValue] = useState(0);
  const started = useRef(false);
  const { lightMode } = useMotionMode();

  useEffect(() => {
    const el = ref.current;
    if (!el || lightMode) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const start = performance.now();
          const tick = (now: number) => {
            const p = Math.min(1, (now - start) / duration);
            const eased = 1 - Math.pow(1 - p, 4);
            setValue(Math.round(eased * to));
            if (p < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
          io.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [to, duration, lightMode]);

  return (
    <span ref={ref} className={className}>
      {new Intl.NumberFormat("fr-FR").format(lightMode ? to : value)}
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
        el.style.transform = `translate(${dx * 0.25}px, ${dy * 0.25}px)`;
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
      style={{ transitionTimingFunction: EASE }}
    >
      {children}
    </span>
  );
}

/* ── Tilt : inclinaison 3D des cartes (4° max, ordinateur) ──── */

export function Tilt({
  children,
  className = "",
  max = 4,
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
    el.style.transform = `perspective(900px) rotateX(${(-py * max).toFixed(2)}deg) rotateY(${(px * max).toFixed(2)}deg) translateZ(0)`;
  };
  const onMouseLeave = () => {
    const el = ref.current;
    if (el) el.style.transform = "perspective(900px) rotateX(0) rotateY(0)";
  };

  return (
    <div
      ref={ref}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      className={`transition-transform duration-500 ${className}`}
      style={{ transitionTimingFunction: EASE, transformStyle: "preserve-3d" }}
    >
      {children}
    </div>
  );
}

/* ── ScrollProgress : filet doré de lecture en haut ─────────── */

export function ScrollProgress() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      const p = h.scrollTop / Math.max(1, h.scrollHeight - h.clientHeight);
      if (ref.current) ref.current.style.transform = `scaleX(${p})`;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <div
      ref={ref}
      aria-hidden
      className="fixed left-0 top-0 z-[70] h-[2px] w-full origin-left gold-fill"
    />
  );
}

/* ── WordMask : titre révélé mot par mot ────────────────────── */

export function WordMask({
  text,
  className = "",
  delay = 0,
  step = 60,
}: {
  text: string;
  className?: string;
  delay?: number;
  step?: number;
}) {
  const { lightMode } = useMotionMode();
  const words = text.split(" ");
  return (
    <span className={className}>
      {words.map((w, i) => (
        <span key={i} className="inline-block overflow-hidden pb-[0.08em] -mb-[0.08em] align-bottom">
          <span
            className="inline-block"
            style={{
              transform: lightMode ? "none" : undefined,
              animation: lightMode
                ? "none"
                : `word-up 900ms ${EASE} ${delay + i * step}ms both`,
            }}
          >
            {w}
            {i < words.length - 1 ? "\u00A0" : ""}
          </span>
        </span>
      ))}
      <style>{`@keyframes word-up { from { transform: translateY(110%); } to { transform: translateY(0); } }`}</style>
    </span>
  );
}
