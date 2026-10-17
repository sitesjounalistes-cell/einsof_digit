"use client";

import React, { useEffect, useRef } from "react";
import { useMotionMode } from "@/components/providers";

const INTERACTIVE_SELECTOR =
  'a, button, [role="button"], input, textarea, select, [contenteditable="true"]';

const DOT_SIZE = 10; /* px */
const RING_SIZE = 36; /* px */

/**
 * Curseur personnalisé desktop (spéc. §32) — point or 10 px + anneau 36 px
 * avec inertie (anneau 0.15, point 0.6) via requestAnimationFrame.
 * Desktop uniquement : pointer fine + ≥ 1024 px + mode mouvement complet.
 * Aucun setState : tout est piloté par refs et styles directs.
 */
export function CustomCursor() {
  const { desktop, lightMode } = useMotionMode();
  const dotRef = useRef<HTMLDivElement | null>(null);
  const ringRef = useRef<HTMLDivElement | null>(null);
  const enabled = desktop && !lightMode;

  useEffect(() => {
    if (!enabled) return;
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    let mx = -100;
    let my = -100;
    let dx = -100; /* position point */
    let dy = -100;
    let rx = -100; /* position anneau */
    let ry = -100;
    let scale = 1;
    let dotOpacity = 0;
    let ringOpacity = 0;
    let seen = false;
    let hovering = false;
    let overInput = false;
    let raf = 0;

    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
      if (!seen) {
        seen = true;
        dx = rx = mx;
        dy = ry = my;
      }
    };

    const onOver = (e: MouseEvent) => {
      if (!(e.target instanceof Element)) {
        hovering = false;
        overInput = false;
        return;
      }
      const el = e.target.closest(INTERACTIVE_SELECTOR);
      hovering = el !== null;
      const tag = el?.tagName ?? "";
      overInput =
        tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" ||
        (el instanceof HTMLElement && el.isContentEditable);
    };

    const loop = () => {
      dx += (mx - dx) * 0.6;
      dy += (my - dy) * 0.6;
      rx += (mx - rx) * 0.15;
      ry += (my - ry) * 0.15;
      scale += ((hovering && !overInput ? 1.8 : 1) - scale) * 0.2;
      dotOpacity += ((seen && !hovering ? 1 : 0) - dotOpacity) * 0.25;
      ringOpacity += ((seen && !overInput ? 1 : 0) - ringOpacity) * 0.25;

      dot.style.transform = `translate3d(${dx - DOT_SIZE / 2}px, ${dy - DOT_SIZE / 2}px, 0)`;
      dot.style.opacity = dotOpacity.toFixed(3);
      ring.style.transform = `translate3d(${rx - RING_SIZE / 2}px, ${ry - RING_SIZE / 2}px, 0) scale(${scale.toFixed(3)})`;
      ring.style.opacity = ringOpacity.toFixed(3);

      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    document.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseover", onOver, { passive: true });

    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onOver);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <>
      <div
        ref={ringRef}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[95] hidden rounded-full border border-gold/50 lg:block"
        style={{ width: RING_SIZE, height: RING_SIZE, willChange: "transform", opacity: 0 }}
      />
      <div
        ref={dotRef}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[95] hidden rounded-full bg-gold lg:block"
        style={{ width: DOT_SIZE, height: DOT_SIZE, willChange: "transform", opacity: 0 }}
      />
    </>
  );
}
