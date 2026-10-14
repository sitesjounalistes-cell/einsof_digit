"use client";

import { useEffect, useRef } from "react";
import { useMotionMode } from "@/components/providers";

/**
 * Gold particles — light 2D canvas (max 40 points, spec §32.5).
 * Stops automatically when off-screen. Disabled in light mode.
 */
export function GoldParticles({ count = 40, className = "" }: { count?: number; className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { lightMode, desktop } = useMotionMode();

  useEffect(() => {
    if (lightMode) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const mobile = !desktop;
    const n = Math.min(count, mobile ? 20 : 40);
    let w = (canvas.width = canvas.offsetWidth);
    let h = (canvas.height = canvas.offsetHeight);
    let visible = true;
    let raf = 0;

    const mouse = { x: 0.5, y: 0.5, tx: 0.5, ty: 0.5 };

    const particles = Array.from({ length: n }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: 0.6 + Math.random() * 1.4,
      o: 0.15 + Math.random() * 0.35,
      vx: (Math.random() - 0.5) * 0.08,
      vy: -(0.04 + Math.random() * 0.1),
      tw: Math.random() * Math.PI * 2,
    }));

    const onMouse = (e: MouseEvent) => {
      const r = canvas.getBoundingClientRect();
      mouse.tx = (e.clientX - r.left) / r.width;
      mouse.ty = (e.clientY - r.top) / r.height;
    };
    window.addEventListener("mousemove", onMouse, { passive: true });

    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting), { threshold: 0 });
    io.observe(canvas);

    const onResize = () => {
      w = canvas.width = canvas.offsetWidth;
      h = canvas.height = canvas.offsetHeight;
    };
    window.addEventListener("resize", onResize);

    let last = performance.now();
    const draw = (now: number) => {
      raf = requestAnimationFrame(draw);
      const dt = Math.min(50, now - last);
      last = now;
      if (!visible) return;
      ctx.clearRect(0, 0, w, h);
      mouse.x += (mouse.tx - mouse.x) * 0.04;
      mouse.y += (mouse.ty - mouse.y) * 0.04;
      const shiftX = (mouse.x - 0.5) * 24;
      const shiftY = (mouse.y - 0.5) * 24;
      for (const p of particles) {
        p.x += p.vx * (dt / 16);
        p.y += p.vy * (dt / 16);
        p.tw += 0.02;
        if (p.y < -8) p.y = h + 8;
        if (p.x < -8) p.x = w + 8;
        if (p.x > w + 8) p.x = -8;
        const alpha = p.o * (0.7 + 0.3 * Math.sin(p.tw));
        ctx.beginPath();
        ctx.arc(p.x + shiftX * p.r, p.y + shiftY * p.r, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(212, 175, 55, ${alpha.toFixed(3)})`;
        ctx.fill();
      }
    };
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("resize", onResize);
      window.removeEventListener("mousemove", onMouse);
    };
  }, [lightMode, desktop, count]);

  if (lightMode) return null;
  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
    />
  );
}

/**
 * Spotlight — radial gold halo following the mouse (desktop) or fixed on mobile.
 */
export function Spotlight({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { lightMode, desktop } = useMotionMode();

  useEffect(() => {
    if (lightMode) return;
    const el = ref.current;
    if (!el) return;
    if (!desktop) {
      el.style.left = "50%";
      el.style.top = "30%";
      return;
    }
    const onMove = (e: MouseEvent) => {
      el.style.left = `${e.clientX}px`;
      el.style.top = `${e.clientY}px`;
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, [lightMode, desktop]);

  if (lightMode) return null;
  return (
    <div
      ref={ref}
      aria-hidden
      className={`pointer-events-none absolute z-0 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full ${className}`}
      style={{
        background:
          "radial-gradient(circle, rgba(212,175,55,0.08) 0%, rgba(212,175,55,0.03) 40%, transparent 70%)",
      }}
    />
  );
}
