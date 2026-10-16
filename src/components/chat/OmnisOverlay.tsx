"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { Mic, MicOff, X, Keyboard, Radar, Radar as RadarIcon, Volume2 } from "lucide-react";
import { useChat } from "./chat-context";
import { useI18n } from "@/lib/i18n";
import { useConsent } from "@/lib/consent";
import { speakProfessional, pickBestVoice, invalidateVoiceCache, SPEECH_LOCALES } from "@/lib/voice";
import { onNavigatePath } from "@/lib/chat-bus";

type OmnisState = "idle" | "listening" | "thinking" | "speaking" | "unsupported" | "denied";

interface SpeechRecognitionLike {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  start(): void;
  stop(): void;
  abort(): void;
  onresult: ((e: { results: ArrayLike<ArrayLike<{ transcript: string }> & { isFinal: boolean }> }) => void) | null;
  onerror: ((e: { error: string }) => void) | null;
  onend: (() => void) | null;
}

type RecognitionCtor = new () => SpeechRecognitionLike;

function getRecognitionCtor(): RecognitionCtor | null {
  if (typeof window === "undefined") return null;
  const w = window as unknown as {
    SpeechRecognition?: RecognitionCtor;
    webkitSpeechRecognition?: RecognitionCtor;
  };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

/** « /logiciels/gestion-pharmacie » → « Gestion pharmacie » (libellé flash). */
function pathToLabel(path: string): string {
  const tail = path.split("?")[0].split("#")[0].split("/").filter(Boolean).pop() ?? "Accueil";
  return tail
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export function OmnisOverlay() {
  const { omnisOpen, setOmnisOpen, messages, streaming, send, consentNoticeAck, setOpen } = useChat();
  const { t, lang } = useI18n();
  const { record } = useConsent();

  const [state, setState] = useState<OmnisState>("idle");
  const [interim, setInterim] = useState("");
  const [handsFree, setHandsFree] = useState(true);
  const [navFlash, setNavFlash] = useState<string | null>(null);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const handsFreeRef = useRef(handsFree);
  const silenceRef = useRef(0);
  const restartTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const navTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const supported = getRecognitionCtor() !== null;

  useEffect(() => {
    handsFreeRef.current = handsFree;
  }, [handsFree]);

  /* État courant lisible dans les callbacks non-React (rec.onend, timers) */
  const stateRef = useRef<OmnisState>(state);
  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  /* Auto-référence : rec.onend (déclaré DANS startListening) relance
     l'écoute — la fonction ne peut pas se référencer directement. */
  const startListeningRef = useRef<() => void>(() => {});

  /* Voix neuronale la plus professionnelle disponible (voiceschanged) */
  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    invalidateVoiceCache();
    pickBestVoice(lang);
    const onChange = () => invalidateVoiceCache();
    window.speechSynthesis.addEventListener?.("voiceschanged", onChange);
    return () => window.speechSynthesis.removeEventListener?.("voiceschanged", onChange);
  }, [lang]);

  /* Flash de navigation : le site bouge SOUS le panneau, en temps réel */
  useEffect(() => {
    return onNavigatePath((path) => {
      if (!omnisOpen) return;
      setNavFlash(path);
      if (navTimer.current) clearTimeout(navTimer.current);
      navTimer.current = setTimeout(() => setNavFlash(null), 3200);
    });
  }, [omnisOpen]);

  const stopRecognition = useCallback(() => {
    try {
      recognitionRef.current?.abort();
    } catch {
      /* ignore */
    }
    recognitionRef.current = null;
  }, []);

  const stopEverything = useCallback(() => {
    stopRecognition();
    if (restartTimer.current) {
      clearTimeout(restartTimer.current);
      restartTimer.current = null;
    }
    try {
      window.speechSynthesis?.cancel();
    } catch {
      /* ignore */
    }
  }, [stopRecognition]);

  const exit = useCallback(() => {
    stopEverything();
    setOmnisOpen(false);
    setState("idle");
    setInterim("");
    silenceRef.current = 0;
  }, [setOmnisOpen, stopEverything]);

  // Escape exits Omnis
  useEffect(() => {
    if (!omnisOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") exit();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [omnisOpen, exit]);

  useEffect(() => {
    if (!omnisOpen) stopEverything();
  }, [omnisOpen, stopEverything]);

  const startListening = useCallback(() => {
    const Ctor = getRecognitionCtor();
    if (!Ctor) {
      setState("unsupported");
      return;
    }
    if (restartTimer.current) {
      clearTimeout(restartTimer.current);
      restartTimer.current = null;
    }
    try {
      window.speechSynthesis?.cancel(); // jamais d'écoute pendant la voix
    } catch {
      /* ignore */
    }
    stopRecognition();
    record("microphone", true);
    setInterim("");
    silenceRef.current = 0;
    try {
      const rec = new Ctor();
      recognitionRef.current = rec;
      rec.lang = SPEECH_LOCALES[lang];
      rec.continuous = false;
      rec.interimResults = true;
      rec.onresult = (e) => {
        let finalText = "";
        let interimText = "";
        for (let i = 0; i < e.results.length; i++) {
          const res = e.results[i];
          const txt = res[0]?.transcript ?? "";
          if (res.isFinal) finalText += txt;
          else interimText += txt;
        }
        setInterim(interimText || finalText);
        if (finalText.trim()) {
          setState("thinking");
          silenceRef.current = 0;
          stopRecognition();
          void send(finalText.trim());
        }
      };
      rec.onerror = (e) => {
        if (e.error === "not-allowed" || e.error === "service-not-allowed") {
          setHandsFree(false);
          setState("denied");
        } else if (e.error === "no-speech") {
          /* silence : comptabilisé, la boucle se met en pause au bout de 2 */
          silenceRef.current += 1;
          setState("idle");
        } else {
          setState("idle");
        }
      };
      rec.onend = () => {
        setState((s) => (s === "listening" ? "idle" : s));
        /* Mains libres : après une écoute restée sans résultat (silence),
           relancer brièvement — pause après 2 silences consécutifs. */
        if (
          handsFreeRef.current &&
          silenceRef.current > 0 &&
          silenceRef.current < 2 &&
          (stateRef.current === "idle" || stateRef.current === "listening")
        ) {
          restartTimer.current = setTimeout(() => {
            restartTimer.current = null;
            if (
              handsFreeRef.current &&
              (stateRef.current === "idle" || stateRef.current === "listening")
            ) {
              startListeningRef.current();
            }
          }, 500);
        }
      };
      setState("listening");
      rec.start();
    } catch {
      setState("idle");
    }
  }, [lang, record, send, stopRecognition]);

  /* Synchronise l'auto-référence après chaque re-création du callback. */
  useEffect(() => {
    startListeningRef.current = startListening;
  }, [startListening]);

  /* ── Boucle conversationnelle temps réel ─────────────────────────
     Dès qu'une RÉPONSE (à un tour utilisateur) est complète → lecture
     à voix haute → fin de lecture → (mains libres) réécoute auto.
     Garde fou : `spokenRef` mémorise le dernier énoncé — la mise à jour
     du message (id serveur après done) ne re-déclenche pas la lecture.
     Le site reste visible sous le panneau : les actions navigate
     déplacent la page en direct. */
  const spokenRef = useRef("");

  // À l'ouverture d'Omnis, la transcription existante n'est pas relue.
  useEffect(() => {
    if (!omnisOpen) return;
    const last = [...messages].reverse().find((m) => m.role === "assistant" && m.content);
    spokenRef.current = last?.content ?? "";
  }, [omnisOpen]);

  useEffect(() => {
    if (!omnisOpen || streaming) return;
    const last = messages[messages.length - 1];
    const isReplyToUser =
      last?.role === "assistant" && last.content && messages.length > 1 && messages[messages.length - 2]?.role === "user";
    if (isReplyToUser && last.content !== spokenRef.current) {
      spokenRef.current = last.content;
      speakProfessional(
        last.content,
        lang,
        () => {
          setState((s) => (s === "speaking" ? "idle" : s));
          if (handsFreeRef.current && supported) {
            restartTimer.current = setTimeout(() => {
              restartTimer.current = null;
              if (stateRef.current === "idle") startListening();
            }, 350);
          }
        },
        () => setState("speaking")
      );
    }
  }, [streaming, messages, omnisOpen, lang, startListening, supported]);

  if (!omnisOpen) return null;

  const lastAssistant = [...messages].reverse().find((m) => m.role === "assistant" && m.content);
  const effState: OmnisState = streaming && state !== "listening" ? "thinking" : state;

  const statusLabel =
    state === "listening"
      ? t("chat.omnis.listening")
      : state === "thinking" || streaming
        ? t("chat.omnis.thinking")
        : state === "speaking"
          ? t("chat.omnis.speaking")
          : handsFree
            ? t("chat.omnis.autoListen")
            : t("chat.omnis.idle");

  return (
    <div
      role="dialog"
      aria-label={t("chat.omnis.title")}
      className="glass-panel animate-in fade-in zoom-in-95 slide-in-from-bottom-3 fixed bottom-24 right-5 z-[82] flex w-[380px] max-w-[calc(100vw-2.5rem)] flex-col overflow-hidden rounded-2xl shadow-2xl duration-300"
      style={{ transformOrigin: "bottom right" }}
    >
      {/* Header */}
      <div className="flex h-14 shrink-0 items-center gap-3 border-b border-line/60 px-4">
        <span className="relative flex h-9 w-9 items-center justify-center rounded-full border border-gold/40 text-goldtext">
          <Radar className="h-4 w-4" strokeWidth={1.5} />
          {(state === "listening" || state === "speaking") && (
            <span
              className="absolute inset-0 rounded-full border border-gold/60"
              style={{ animation: "breathe 2.4s ease-in-out infinite" }}
            />
          )}
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-ink">{t("chat.omnis.title")}</p>
          <p className="flex items-center gap-1.5 text-[0.6875rem] text-mute">
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                state === "listening"
                  ? "bg-[var(--success)]"
                  : state === "speaking"
                    ? "bg-gold"
                    : "bg-mute/50"
              }`}
              style={{ animation: state === "listening" ? "pulse-dot 2s infinite" : undefined }}
            />
            {statusLabel}
          </p>
        </div>
        <button
          type="button"
          onClick={exit}
          aria-label={t("chat.omnis.exit")}
          className="flex h-9 w-9 items-center justify-center rounded-full text-mute transition-colors hover:text-ink"
        >
          <X className="h-4 w-4" strokeWidth={1.5} />
        </button>
      </div>

      {/* Flash navigation : « le robot m'emmène sur /tarifs » */}
      <div className="px-4 pt-3">
        <div
          aria-live="polite"
          className={`flex items-center gap-2 overflow-hidden rounded-lg border border-gold/40 bg-surface px-3 text-xs text-goldtext transition-all duration-300 ${
            navFlash ? "max-h-12 py-2 opacity-100" : "max-h-0 border-transparent py-0 opacity-0"
          }`}
        >
          <RadarIcon className="h-3.5 w-3.5 shrink-0" strokeWidth={1.5} />
          <span className="truncate">
            {(navFlash && t("chat.omnis.navigating").replace("{page}", pathToLabel(navFlash))) || ""}
          </span>
        </div>
      </div>

      {/* Conversation en direct */}
      <div className="flex max-h-[280px] min-h-[120px] flex-1 flex-col justify-end space-y-3 overflow-y-auto px-4 py-3">
        {lastAssistant && (
          <div className="border-l-2 border-gold/50 pl-3">
            <p className="whitespace-pre-wrap text-sm leading-relaxed text-ink">
              {lastAssistant.content || "…"}
            </p>
          </div>
        )}
        {interim && (
          <div className="flex justify-end">
            <div className="max-w-[85%] rounded-2xl rounded-br-sm border border-line bg-surface2 px-4 py-2.5 text-sm italic text-mute">
              {interim}…
            </div>
          </div>
        )}
        {!lastAssistant && !interim && (
          <p className="text-sm leading-relaxed text-mute">{t("chat.omnis.hint")}</p>
        )}
        {state === "denied" && (
          <p className="text-sm leading-relaxed text-mute">{t("chat.omnis.micDenied")}</p>
        )}
        {!supported && (
          <p className="text-sm leading-relaxed text-mute">{t("chat.omnis.unsupported")}</p>
        )}
      </div>

      {/* Contrôles */}
      <div className="flex shrink-0 items-center gap-2 border-t border-line/60 p-3">
        <button
          type="button"
          onClick={startListening}
          disabled={effState === "thinking" || !supported}
          aria-label={t("chat.omnis.listening")}
          className="fab-pulse flex h-11 w-11 shrink-0 items-center justify-center rounded-full gold-fill shadow-[0_8px_30px_rgba(212,175,55,0.35)] transition-transform active:scale-95 disabled:opacity-50"
        >
          {state === "denied" ? (
            <MicOff className="h-5 w-5 text-ongold" strokeWidth={1.5} />
          ) : (
            <Mic className="h-5 w-5 text-ongold" strokeWidth={1.5} />
          )}
        </button>
        <button
          type="button"
          onClick={() => setHandsFree((v) => !v)}
          aria-pressed={handsFree}
          title={t("chat.omnis.handsFree")}
          className={`flex h-11 flex-1 items-center justify-center gap-2 rounded-full border px-3 text-xs transition-colors ${
            handsFree
              ? "border-gold/50 bg-gold/10 text-goldtext"
              : "border-line text-mute hover:border-gold hover:text-goldtext"
          }`}
        >
          <Volume2 className="h-4 w-4" strokeWidth={1.5} />
          {t("chat.omnis.handsFree")}
        </button>
        <button
          type="button"
          onClick={() => {
            stopEverything();
            setOmnisOpen(false);
            setOpen(true);
          }}
          title={t("chat.omnis.typeInstead")}
          aria-label={t("chat.omnis.typeInstead")}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-line text-mute transition-colors hover:border-gold hover:text-goldtext"
        >
          <Keyboard className="h-4 w-4" strokeWidth={1.5} />
        </button>
      </div>

      {/* Consent notice */}
      {!consentNoticeAck && (
        <p className="px-4 pb-2 text-center text-[0.6875rem] leading-snug text-mute">
          {t("chat.consent")}
        </p>
      )}
    </div>
  );
}
