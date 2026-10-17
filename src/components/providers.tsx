"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
} from "react";
import { ThemeProvider } from "next-themes";
import { LangProvider } from "@/lib/i18n";
import { ConsentProvider, useConsent } from "@/lib/consent";
import { setAnalyticsConsent } from "@/lib/analytics";

/* ── Motion / light-mode context (hydration-safe external stores) ── */

const RM_KEY = "eins-reduce-motion";

/* Manual override store */
let overrideValue: boolean | null = null;
const overrideListeners = new Set<() => void>();

function overrideSubscribe(fn: () => void) {
  overrideListeners.add(fn);
  return () => overrideListeners.delete(fn);
}

function loadOverride() {
  let next: boolean | null = null;
  try {
    const saved = localStorage.getItem(RM_KEY);
    if (saved === "1") next = true;
    else if (saved === "0") next = false;
  } catch {
    /* ignore */
  }
  if (next !== overrideValue) {
    overrideValue = next;
    overrideListeners.forEach((l) => l());
  }
}

function setOverrideStore(v: boolean | null) {
  overrideValue = v;
  try {
    if (v === null) localStorage.removeItem(RM_KEY);
    else localStorage.setItem(RM_KEY, v ? "1" : "0");
  } catch {
    /* ignore */
  }
  overrideListeners.forEach((l) => l());
}

/* System prefers-reduced-motion store */
let reduceMq: MediaQueryList | null = null;
function getReduceMq(): MediaQueryList | null {
  if (typeof window === "undefined") return null;
  if (!reduceMq) reduceMq = window.matchMedia("(prefers-reduced-motion: reduce)");
  return reduceMq;
}
function subscribeReduce(fn: () => void) {
  const mq = getReduceMq();
  mq?.addEventListener?.("change", fn);
  return () => mq?.removeEventListener?.("change", fn);
}

/* Static device capabilities (stable per session) */
interface DeviceInfo {
  weak: boolean;
  desktop: boolean;
}
let deviceCache: DeviceInfo | null = null;
function deviceInfo(): DeviceInfo {
  if (deviceCache) return deviceCache;
  if (typeof window === "undefined") return { weak: false, desktop: false };
  const nav = navigator as Navigator & {
    deviceMemory?: number;
    connection?: { saveData: boolean; effectiveType?: string };
  };
  const weak =
    (nav.hardwareConcurrency ?? 8) <= 4 ||
    (nav.deviceMemory ?? 8) <= 2 ||
    nav.connection?.saveData === true ||
    nav.connection?.effectiveType === "2g" ||
    nav.connection?.effectiveType === "slow-2g";
  const desktop =
    window.matchMedia("(pointer: fine)").matches && window.innerWidth >= 1024;
  deviceCache = { weak, desktop };
  return deviceCache;
}

const DEVICE_SERVER_SNAPSHOT: DeviceInfo = { weak: false, desktop: false };

interface MotionContextValue {
  /** true = heavy animations disabled (system, weak device or manual switch) */
  lightMode: boolean;
  setLightMode: (v: boolean | null) => void;
  override: boolean | null;
  desktop: boolean;
}

const MotionContext = createContext<MotionContextValue>({
  lightMode: false,
  setLightMode: () => {},
  override: null,
  desktop: false,
});

export const useMotionMode = () => useContext(MotionContext);

function MotionProvider({ children }: { children: React.ReactNode }) {
  const override = useSyncExternalStore(
    overrideSubscribe,
    () => overrideValue,
    () => null
  );
  const reduced = useSyncExternalStore(
    subscribeReduce,
    () => getReduceMq()?.matches ?? false,
    () => false
  );
  /* Capacités matérielles : état post-montage (un store statique ne
     notifie jamais — avec useSyncExternalStore la valeur client n'était
     jamais réappliquée après hydratation, le mode léger auto restait
     inactif sur les appareils faibles). */
  const [device, setDevice] = useState<DeviceInfo>(DEVICE_SERVER_SNAPSHOT);

  useEffect(() => {
    loadOverride();
    const raf = requestAnimationFrame(() => setDevice(deviceInfo()));
    return () => cancelAnimationFrame(raf);
  }, []);

  const lightMode = override !== null ? override : reduced || device.weak;

  useEffect(() => {
    document.documentElement.classList.toggle("reduce-motion", lightMode);
  }, [lightMode]);

  const setOverride = useCallback((v: boolean | null) => setOverrideStore(v), []);

  const value = useMemo(
    () => ({ lightMode, setLightMode: setOverride, override, desktop: device.desktop }),
    [lightMode, setOverride, override, device.desktop]
  );

  return <MotionContext.Provider value={value}>{children}</MotionContext.Provider>;
}

/* ── Root providers ────────────────────────────────────────── */

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} disableTransitionOnChange={false}>
      <MotionProvider>
        <LangProvider>
          <ConsentProvider>
            <ConsentBridge>{children}</ConsentBridge>
          </ConsentProvider>
        </LangProvider>
      </MotionProvider>
    </ThemeProvider>
  );
}

/** Bridges the stored consent to the analytics module. */
function ConsentBridge({ children }: { children: React.ReactNode }) {
  const { analytics } = useConsent();
  useEffect(() => {
    setAnalyticsConsent(analytics);
  }, [analytics]);
  return <>{children}</>;
}
