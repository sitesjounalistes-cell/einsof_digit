"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Mic,
  MicOff,
  X,
  Keyboard,
  Radar,
  Radar as RadarIcon,
  Volume2,
  VolumeX,
  SendHorizonal,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
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

/**
 * MODE OMNIS — v2 « interface visible ».
 * Contrairement à une prise d'écran plein fond, Omnis est une CAPSULE
 * flottante en haut au centre : le site reste ENTIEREMENT visible autour,
 * l'IA peut naviguer en direct (router.push via chat-bus) et le visiteur
 * VOIT la page changer sous la capsule. Une carte discrète en bas à droite
 * conserve la dernière réponse, un champ texte intégré permet de poser la
 * question au clavier sans quitter le mode vocal.
 */
export function OmnisOverlay() {
  const { omnisOpen, setOmnisOpen, messages, streaming, send, consentNoticeAck, setOpen } = useChat();
  const { t, lang } = useI18n();
  const { record } = useConsent();

  const [state, setState] = useState<OmnisState>("idle");
  const [interim, setInterim] = useState("");
  const [handsFree, setHandsFree] = useState(true);
  const [navFlash, setNavFlash] = useState<string | null>(null);
  const [kbOpen, setKbOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const [cardOpen, setCardOpen] = useState(true);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const handsFreeRef = useRef(handsFree);
  const silenceRef = useRef(0);
  const restartTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const navTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

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

  /* Flash de navigation : le site bouge SOUS la capsule, en temps réel */
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
    setKbOpen(false);
    setDraft("");
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
     Le site reste visible sous la capsule : les actions navigate
     déplacent la page en direct, sous les yeux du visiteur. */
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

  /* Envoi clavier sans quitter Omnis */
  const submitDraft = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const text = draft.trim();
      if (!text || streaming) return;
      setDraft("");
      setState("thinking");
      void send(text);
    },
    [draft, streaming, send]
  );

  if (!omnisOpen) return null;

  const lastAssistant = [...messages].reverse().find((m) => m.role === "assistant" && m.content);
  const lastUser = [...messages].reverse().find((m) => m.role === "user" && m.content);
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

  const dotCls =
    state === "listening"
      ? "bg-[var(--success)]"
      : state === "speaking"
        ? "bg-gold"
        : effState === "thinking"
          ? "bg-gold/70"
          : "bg-mute/50";

  return (
    <>
      {/* ═══ Capsule Omnis — haut centre : le site reste visible partout ═══ */}
      <div
        role="dialog"
        aria-label={t("chat.omnis.title")}
        className="animate-in fade-in slide-in-from-top-3 duration-300 fixed left-1/2 top-[4.75rem] z-[82] flex w-[min(94vw,660px)] -translate-x-1/2 flex-col gap-2 md:top-[5.5rem]"
      >
        {/* Ligne principale : état + voix + clavier + fermer */}
        <div className="glass-panel flex items-center gap-2.5 rounded-2xl border border-line/60 px-3 py-2 shadow-2xl">
          <span className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-gold/40 text-goldtext">
            <Radar className="h-4 w-4" strokeWidth={1.5} />
            {(state === "listening" || state === "speaking") && (
              <span
                className="absolute inset-0 rounded-full border border-gold/60"
                style={{ animation: "breathe 2.4s ease-in-out infinite" }}
              />
            )}
          </span>

          <div className="min-w-0 flex-1">
            <p className="flex items-center gap-1.5 text-sm font-medium text-ink">
              <span
                className={`h-1.5 w-1.5 shrink-0 rounded-full ${dotCls}`}
                style={{
                  animation:
                    state === "listening"
                      ? "pulse-dot 2s infinite"
                      : effState === "thinking"
                        ? "pulse-dot 1s infinite"
                        : undefined,
                }}
              />
              <span className="truncate">{statusLabel}</span>
            </p>
            <p className="truncate text-xs italic text-mute">
              {interim
                ? `« ${interim} »`
                : lastUser
                  ? `« ${lastUser.content.slice(0, 80)} »`
                  : t("chat.omnis.hint")}
            </p>
          </div>

          {/* Micro : bascule écoute (désactivé pendant réflexion) */}
          <button
            type="button"
            onClick={startListening}
            disabled={effState === "thinking" || !supported}
            aria-label={t("chat.omnis.listening")}
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-all active:scale-95 disabled:opacity-50 ${
              state === "listening"
                ? "gold-fill shadow-[0_8px_30px_rgba(212,175,55,0.35)]"
                : "border border-gold/50 text-goldtext hover:bg-gold/10"
            }`}
          >
            {state === "denied" ? (
              <MicOff className="h-4.5 w-4.5 text-goldtext" strokeWidth={1.5} />
            ) : (
              <Mic className={`h-4.5 w-4.5 ${state === "listening" ? "text-ongold" : ""}`} strokeWidth={1.5} />
            )}
          </button>

          {/* Mains libres */}
          <button
            type="button"
            onClick={() => setHandsFree((v) => !v)}
            aria-pressed={handsFree}
            title={t("chat.omnis.handsFree")}
            aria-label={t("chat.omnis.handsFree")}
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border transition-colors ${
              handsFree
                ? "border-gold/50 bg-gold/10 text-goldtext"
                : "border-line text-mute hover:border-gold hover:text-goldtext"
            }`}
          >
            {handsFree ? (
              <Volume2 className="h-4 w-4" strokeWidth={1.5} />
            ) : (
              <VolumeX className="h-4 w-4" strokeWidth={1.5} />
            )}
          </button>

          {/* Clavier : champ intégré sans quitter Omnis */}
          <button
            type="button"
            onClick={() => {
              setKbOpen((v) => !v);
              setTimeout(() => inputRef.current?.focus(), 60);
            }}
            aria-expanded={kbOpen}
            title={t("chat.omnis.typeInstead")}
            aria-label={t("chat.omnis.typeInstead")}
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border transition-colors ${
              kbOpen
                ? "border-gold/50 bg-gold/10 text-goldtext"
                : "border-line text-mute hover:border-gold hover:text-goldtext"
            }`}
          >
            <Keyboard className="h-4 w-4" strokeWidth={1.5} />
          </button>

          <button
            type="button"
            onClick={exit}
            aria-label={t("chat.omnis.exit")}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-mute transition-colors hover:text-ink"
          >
            <X className="h-4 w-4" strokeWidth={1.5} />
          </button>
        </div>

        {/* Champ texte intégré (pose une question sans quitter le mode) */}
        {kbOpen && (
          <form
            onSubmit={submitDraft}
            className="glass-panel animate-in fade-in slide-in-from-top-2 flex items-center gap-2 rounded-2xl border border-line/60 px-3 py-2 shadow-xl duration-200"
          >
            <input
              ref={inputRef}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder={t("chat.omnis.placeholder")}
              aria-label={t("chat.omnis.placeholder")}
              maxLength={1000}
              className="h-10 min-w-0 flex-1 bg-transparent text-sm text-ink outline-none placeholder:text-mute"
            />
            <button
              type="submit"
              disabled={!draft.trim() || streaming}
              aria-label={t("chat.omnis.send")}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full gold-fill text-ongold transition-transform active:scale-95 disabled:opacity-40"
            >
              <SendHorizonal className="h-4 w-4" strokeWidth={1.5} />
            </button>
          </form>
        )}

        {/* Toast navigation temps réel : « la page bouge sous vos yeux » */}
        <div
          aria-live="polite"
          className={`flex items-center justify-center gap-2 overflow-hidden rounded-full border border-gold/40 bg-surface/95 px-4 text-xs text-goldtext shadow-xl backdrop-blur transition-all duration-300 ${
            navFlash ? "max-h-10 py-2.5 opacity-100" : "max-h-0 border-transparent py-0 opacity-0"
          }`}
        >
          <RadarIcon className="h-3.5 w-3.5 shrink-0" strokeWidth={1.5} style={{ animation: navFlash ? "omnis-spin 2.4s linear infinite" : undefined }} />
          <span className="truncate font-medium">
            {(navFlash && t("chat.omnis.navigating").replace("{page}", pathToLabel(navFlash))) || ""}
          </span>
        </div>

        {/* Consent notice */}
        {!consentNoticeAck && (
          <p className="px-2 text-center text-[0.6875rem] leading-snug text-mute drop-shadow">
            {t("chat.consent")}
          </p>
        )}
      </div>

      {/* ═══ Carte réponse — bas droite, discrète, repliable ═══ */}
      {(lastAssistant || state === "denied" || !supported) && (
        <div className="animate-in fade-in slide-in-from-bottom-3 fixed bottom-24 right-5 z-[81] w-[320px] max-w-[calc(100vw-2.5rem)] duration-300">
          <div className="glass-panel overflow-hidden rounded-2xl border border-line/60 shadow-2xl">
            <button
              type="button"
              onClick={() => setCardOpen((v) => !v)}
              aria-expanded={cardOpen}
              className="flex min-h-[44px] w-full items-center gap-2 px-4 py-2.5 text-left"
            >
              <span
                className={`h-1.5 w-1.5 shrink-0 rounded-full ${dotCls}`}
                style={{ animation: state === "speaking" ? "pulse-dot 1.4s infinite" : undefined }}
              />
              <span className="flex-1 truncate text-xs font-medium uppercase tracking-[0.14em] text-goldtext">
                {t("chat.omnis.transcript")}
              </span>
              {cardOpen ? (
                <ChevronDown className="h-4 w-4 shrink-0 text-mute" strokeWidth={1.5} />
              ) : (
                <ChevronUp className="h-4 w-4 shrink-0 text-mute" strokeWidth={1.5} />
              )}
            </button>
            {cardOpen && (
              <div className="max-h-[210px] space-y-2.5 overflow-y-auto border-t border-line/40 px-4 py-3 omnis-card-scroll">
                {lastAssistant ? (
                  <div className="border-l-2 border-gold/50 pl-3">
                    <p className="whitespace-pre-wrap text-sm leading-relaxed text-ink">
                      {lastAssistant.content || "…"}
                    </p>
                  </div>
                ) : (
                  <p className="text-sm leading-relaxed text-mute">{t("chat.omnis.hint")}</p>
                )}
                {state === "denied" && (
                  <p className="text-xs leading-relaxed text-mute">{t("chat.omnis.micDenied")}</p>
                )}
                {!supported && (
                  <p className="text-xs leading-relaxed text-mute">{t("chat.omnis.unsupported")}</p>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
