"use client";

import React, { createContext, useCallback, useContext, useEffect, useMemo, useSyncExternalStore } from "react";

export type ConsentType = "cookies_analytics" | "chat_storage" | "microphone" | "contact";

interface ConsentSnapshot {
  decided: boolean;
  analytics: boolean;
  chatStorage: boolean;
  hydrated: boolean;
}

const SERVER_SNAPSHOT: ConsentSnapshot = {
  decided: true,
  analytics: false,
  chatStorage: false,
  hydrated: false,
};

const KEY = "eins-consent";

/* External store (localStorage) — hydration-safe. */
let snapshot: ConsentSnapshot = SERVER_SNAPSHOT;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((l) => l());
}

function subscribe(fn: () => void) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

function loadFromStorage() {
  if (snapshot.hydrated) return;
  let next: ConsentSnapshot = { decided: false, analytics: false, chatStorage: false, hydrated: true };
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const v = JSON.parse(raw) as { analytics?: boolean; chatStorage?: boolean };
      next = { decided: true, analytics: !!v.analytics, chatStorage: !!v.chatStorage, hydrated: true };
    }
  } catch {
    /* ignore */
  }
  snapshot = next;
  emit();
}

export function getVisitorId(): string {
  const VID_KEY = "eins-vid";
  try {
    let v = localStorage.getItem(VID_KEY);
    if (!v) {
      v = crypto.randomUUID();
      localStorage.setItem(VID_KEY, v);
    }
    return v;
  } catch {
    return "anonymous";
  }
}

interface ConsentContextValue extends ConsentSnapshot {
  decide: (analytics: boolean, chatStorage: boolean) => void;
  record: (type: ConsentType, granted: boolean) => void;
}

const ConsentContext = createContext<ConsentContextValue>({
  ...SERVER_SNAPSHOT,
  decide: () => {},
  record: () => {},
});

function postConsent(type: ConsentType, granted: boolean) {
  void fetch("/api/consent", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ type, granted, visitorId: getVisitorId() }),
  }).catch(() => {});
}

export function ConsentProvider({ children }: { children: React.ReactNode }) {
  const state = useSyncExternalStore(subscribe, () => snapshot, () => SERVER_SNAPSHOT);

  useEffect(() => {
    loadFromStorage();
  }, []);

  const decide = useCallback((analytics: boolean, chatStorage: boolean) => {
    snapshot = { ...snapshot, decided: true, analytics, chatStorage, hydrated: true };
    try {
      localStorage.setItem(KEY, JSON.stringify({ analytics, chatStorage }));
    } catch {
      /* ignore */
    }
    emit();
    postConsent("cookies_analytics", analytics);
    postConsent("chat_storage", chatStorage);
  }, []);

  const record = useCallback((type: ConsentType, granted: boolean) => {
    postConsent(type, granted);
  }, []);

  const value = useMemo(
    () => ({ ...state, decide, record }),
    [state, decide, record]
  );

  return <ConsentContext.Provider value={value}>{children}</ConsentContext.Provider>;
}

export const useConsent = () => useContext(ConsentContext);
