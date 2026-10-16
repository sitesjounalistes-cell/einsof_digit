"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { Mic, MicOff, X, Keyboard } from "lucide-react";
import { useChat } from "./chat-context";
import { useI18n, type Lang } from "@/lib/i18n";
import { useConsent } from "@/lib/consent";
import { speakProfessional, pickBestVoice, invalidateVoiceCache, SPEECH_LOCALES } from "@/lib/voice";
import { GoldButton } from "@/components/site/kit";

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

export function OmnisOverlay() {
  const { omnisOpen, setOmnisOpen, messages, streaming, send, consentNoticeAck } = useChat();
  const { t, lang } = useI18n();
  const { record } = useConsent();

  const [state, setState] = useState<OmnisState>("idle");
  const [interim, setInterim] = useState("");
  const [spokenOnce, setSpokenOnce] = useState(false);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const prevStreaming = useRef(false);
  const lastSpokenRef = useRef("");

  const supported = getRecognitionCtor() !== null;

  /* Voix neuronale la plus professionnelle disponible (voiceschanged) */
  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    invalidateVoiceCache();
    pickBestVoice(lang);
    const onChange = () => invalidateVoiceCache();
    window.speechSynthesis.addEventListener?.("voiceschanged", onChange);
    return () => window.speechSynthesis.removeEventListener?.("voiceschanged", onChange);
  }, [lang]);

  const stopEverything = useCallback(() => {
    try {
      recognitionRef.current?.abort();
    } catch { /* ignore */ }
    try {
      window.speechSynthesis?.cancel();
    } catch { /* ignore */ }
  }, []);

  const exit = useCallback(() => {
    stopEverything();
    setOmnisOpen(false);
    setState("idle");
    setInterim("");
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

  const speak = useCallback(
    (text: string) => {
      /* Voix professionnelle : sélection neuronale + débit posé +
         découpage par phrases (voir lib/voice.ts). L'état « speaking »
         est piloté par les callbacks ; le texte reste affiché à l'écran. */
      speakProfessional(text, lang, () => setState("idle"), () => setState("speaking"));
    },
    [lang]
  );

  // When streaming finishes, speak the reply (Omnis reads it aloud)
  useEffect(() => {
    if (!omnisOpen) return;
    if (prevStreaming.current && !streaming) {
      const last = messages[messages.length - 1];
      if (last?.role === "assistant" && last.content) {
        lastSpokenRef.current = last.content;
        prevStreaming.current = streaming;
        const id = setTimeout(() => speak(last.content), 60);
        return () => clearTimeout(id);
      }
    }
    prevStreaming.current = streaming;
  }, [streaming, omnisOpen]);

  const startListening = useCallback(() => {
    const Ctor = getRecognitionCtor();
    if (!Ctor) {
      setState("unsupported");
      return;
    }
    stopEverything();
    record("microphone", true);
    setInterim("");
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
          setSpokenOnce(true);
          void send(finalText.trim());
        }
      };
      rec.onerror = (e) => {
        if (e.error === "not-allowed" || e.error === "service-not-allowed") setState("denied");
        else setState("idle");
      };
      rec.onend = () => {
        setState((s) => (s === "listening" ? "idle" : s));
      };
      setState("listening");
      rec.start();
    } catch {
      setState("idle");
    }
  }, [lang, record, send, stopEverything]);

  if (!omnisOpen) return null;

  const lastAssistant = [...messages].reverse().find((m) => m.role === "assistant" && m.content);
  const effState: OmnisState = streaming ? "thinking" : state;

  const statusLabel =
    state === "listening"
      ? t("chat.omnis.listening")
      : state === "thinking" || streaming
        ? t("chat.omnis.thinking")
        : state === "speaking"
          ? t("chat.omnis.speaking")
          : t("chat.omnis.idle");

  return (
    <div
      role="dialog"
      aria-label={t("chat.omnis.title")}
      className="fixed inset-0 z-[80] flex flex-col bg-bg/[0.985] backdrop-blur-xl"
    >
      {/* Top bar */}
      <div className="flex items-center justify-between px-5 py-4 sm:px-8">
        <p className="label-caps">{t("chat.omnis.title")}</p>
        <button
          type="button"
          onClick={exit}
          className="flex h-11 items-center gap-2 rounded-full border border-line px-4 text-sm text-mute transition-colors hover:border-gold hover:text-goldtext"
        >
          <X className="h-4 w-4" strokeWidth={1.5} />
          {t("chat.omnis.exit")}
        </button>
      </div>

      {/* Center stage */}
      <div className="flex flex-1 flex-col items-center justify-center gap-10 px-6 pb-24">
        {/* Visual */}
        <div className="relative flex h-[220px] w-[220px] items-center justify-center">
          {effState === "speaking" ? (
            <div className="flex h-24 items-center gap-1.5">
              {Array.from({ length: 24 }).map((_, i) => (
                <span
                  key={i}
                  className="w-1 rounded-full bg-gold"
                  style={{
                    height: `${8 + Math.abs(Math.sin(i * 1.7)) * 80}%`,
                    animation: `eq 900ms ${(i % 6) * 120}ms infinite ease-in-out`,
                    minHeight: 6,
                  }}
                />
              ))}
              <style>{`@keyframes eq { 0%,100% { transform: scaleY(.4)} 50% { transform: scaleY(1)} }`}</style>
            </div>
          ) : effState === "thinking" ? (
            <div
              className="h-[160px] w-[160px] rounded-full border border-gold/20 border-t-gold"
              style={{ animation: "spin-arc 1.2s linear infinite" }}
            />
          ) : (
            <div
              className="flex h-[160px] w-[160px] items-center justify-center rounded-full border border-gold/40"
              style={{ animation: "breathe 6s ease-in-out infinite" }}
            >
              <div className="h-[130px] w-[130px] rounded-full border border-gold/20" />
            </div>
          )}
        </div>

        {/* Status + transcript */}
        <div className="min-h-[7rem] text-center">
          <p className="label-caps">{statusLabel}</p>
          <p className="mx-auto mt-3 max-w-xl font-serif text-xl leading-snug text-ink md:text-2xl">
            {effState === "listening" && interim
              ? interim
              : effState === "speaking" || (effState === "thinking" && lastAssistant)
                ? lastAssistant?.content
                : state === "denied"
                  ? t("chat.omnis.micDenied")
                  : state === "unsupported"
                    ? t("chat.omnis.unsupported")
                    : !spokenOnce
                      ? t("chat.omnis.hint")
                      : ""}
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-col items-center gap-5">
          <button
            type="button"
            onClick={startListening}
            disabled={effState === "thinking"}
            aria-label={t("chat.omnis.listening")}
            className="fab-pulse flex h-16 w-16 items-center justify-center rounded-full gold-fill shadow-[0_8px_30px_rgba(212,175,55,0.35)] transition-transform active:scale-95 disabled:opacity-50"
          >
            {state === "denied" ? (
              <MicOff className="h-6 w-6 text-ongold" strokeWidth={1.5} />
            ) : (
              <Mic className="h-6 w-6 text-ongold" strokeWidth={1.5} />
            )}
          </button>
          <GoldButton variant="ghost" onClick={() => { stopEverything(); setOmnisOpen(false); }}>
            <span className="inline-flex items-center gap-2">
              <Keyboard className="h-4 w-4" strokeWidth={1.5} />
              {t("chat.omnis.typeInstead")}
            </span>
          </GoldButton>
        </div>
      </div>

      {/* Consent notice */}
      {!consentNoticeAck && (
        <p className="absolute bottom-5 inset-x-0 px-6 text-center text-[0.6875rem] text-mute">
          {t("chat.consent")}
        </p>
      )}
    </div>
  );
}
