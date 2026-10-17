"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { getVisitorId } from "./consent";

/**
 * Anonymous analytics — events are sent ONLY after statistics consent (spec §28).
 */
export type AnalyticsEventName =
  | "page_view"
  | "cta_click"
  | "form_start"
  | "form_submit"
  | "trial_requested"
  | "demo_booked"
  | "quote_requested"
  | "document_downloaded"
  | "chat_opened"
  | "chat_message_sent"
  | "chat_lead_created"
  | "omnis_started"
  | "pwa_installed"
  | "pwa_prompt_accepted"
  | "pwa_prompt_dismissed"
  | "push_subscribed"
  | "notification_opened"
  | "article_read"
  | "article_shared"
  | "podcast_play"
  | "session_beat"
  | "click_heat"
  | "theme_changed"
  | "locale_changed";

let consentGranted = false;
export function setAnalyticsConsent(granted: boolean) {
  consentGranted = granted;
}

export function track(name: AnalyticsEventName, props?: Record<string, unknown>) {
  if (!consentGranted) return;
  const payload = {
    name,
    props: props ?? {},
    path: typeof window !== "undefined" ? window.location.pathname : "/",
    locale: document.documentElement.lang || "fr",
    visitorId: getVisitorId(),
  };
  fetch("/api/analytics", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    keepalive: true,
  }).catch(() => {});
}

export function trackCta(section: string, buttonId: string) {
  track("cta_click", { section, button: buttonId });
}

/* ── Tracking comportemental automatique (AnalyticsListener) ──────
   Monté une seule fois dans SiteShell : page_view par route,
   battement de session (45 s) et carte de chaleur des clics.
   Tout passe par track() — donc soumis au consentement analytics. */

export type DeviceKind = "mobile" | "tablet" | "desktop";

function detectDevice(): DeviceKind {
  if (typeof window === "undefined") return "desktop";
  const w = window.innerWidth;
  if (w <= 640) return "mobile";
  if (w <= 1024) return "tablet";
  return "desktop";
}

const SESSION_KEY = "eins-sid";
const BEAT_MS = 45_000;
const HEAT_THROTTLE_MS = 2_000;

function getSessionId(): string {
  try {
    let sid = sessionStorage.getItem(SESSION_KEY);
    if (!sid) {
      sid =
        typeof crypto !== "undefined" && "randomUUID" in crypto
          ? crypto.randomUUID()
          : `s-${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
      sessionStorage.setItem(SESSION_KEY, sid);
    }
    return sid;
  } catch {
    return "anonymous-session"; /* stockage indisponible (mode privé) */
  }
}

/**
 * Composant silencieux (rend null) — branchements automatiques :
 * - page_view au montage puis à chaque changement de route
 *   ({ referrer, device }) ;
 * - session_beat : un battement immédiat au chargement puis toutes les
 *   45 s tant que l'onglet est visible (sessionId en sessionStorage) ;
 * - click_heat : clics échantillonnés (max 1 / 2 s), position en
 *   pourcentages du viewport.
 */
export function AnalyticsListener() {
  const pathname = usePathname();

  /* page_view — l'effet tourne au montage ET à chaque changement de route */
  useEffect(() => {
    track("page_view", {
      referrer: document.referrer || null,
      device: detectDevice(),
    });
  }, [pathname]);

  /* session_beat — battement immédiat puis intervalle de 45 s */
  useEffect(() => {
    const sessionId = getSessionId();
    track("session_beat", { sessionId });
    const timer = window.setInterval(() => {
      if (document.visibilityState === "visible") {
        track("session_beat", { sessionId });
      }
    }, BEAT_MS);
    return () => window.clearInterval(timer);
  }, []);

  /* click_heat — écouteur global délégué (capture), throttlé */
  useEffect(() => {
    let last = 0;
    const onClick = (e: MouseEvent) => {
      const now = Date.now();
      if (now - last < HEAT_THROTTLE_MS) return;
      last = now;
      const vw = window.innerWidth || 1;
      const vh = window.innerHeight || 1;
      track("click_heat", {
        x: Math.round((e.clientX / vw) * 100),
        y: Math.round((e.clientY / vh) * 100),
        path: window.location.pathname,
      });
    };
    window.addEventListener("click", onClick, { capture: true });
    return () => window.removeEventListener("click", onClick, { capture: true });
  }, []);

  return null;
}
