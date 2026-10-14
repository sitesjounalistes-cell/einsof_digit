"use client";

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
  | "push_subscribed"
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
