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
  Square,
} from "lucide-react";
import { useChat } from "./chat-context";
import { useI18n } from "@/lib/i18n";
import { useConsent } from "@/lib/consent";
import { speakWithFallback, cancelSpeech, pickBestVoice, invalidateVoiceCache, SPEECH_LOCALES } from "@/lib/voice";
import { VoiceRecorder, isVoiceInputSupported } from "@/lib/voice-recorder";
import { onNavigatePath } from "@/lib/chat-bus";

type OmnisState =
  | "idle"
  | "recording"
  | "transcribing"
  | "thinking"
  | "speaking"
  | "denied"
  | "unsupported";
type OmnisNote = null | "no_speech" | "asr_error" | "mic_error";

interface SpeechRecognitionLike {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  start(): void;
  stop(): void;
  abort(): void;
  onresult:
    | ((e: { results: ArrayLike<ArrayLike<{ transcript: string }> & { isFinal: boolean }> }) => void)
    | null;
  onerror: ((e: { error: string }) => void) | null;
  onend: (() => void) | null;
}

type RecognitionCtor = new () => SpeechRecognitionLike;

/** Web Speech du navigateur — voie RAPIDE quand elle fonctionne (Chrome/Edge). */
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
 * MODE OMNIS — v3 « voix réparée de bout en bout ».
 *
 * ANCIEN BUG : la reconnaissance reposait uniquement sur webkitSpeechRecognition
 * (absente de Firefox, bloquée dans les iframes d'aperçu, capricieuse sur
 * Safari) — l'utilisateur parlait, rien ne se passait.
 *
 * NOUVEAU PIPELINE (double voie, jamais muet) :
 *  1. Enregistrement UNIVERSALISTE : getUserMedia + MediaRecorder (tous
 *     navigateurs) avec niveau sonore en direct (le visiteur VOIT que le
 *     micro entend) et arrêt automatique en fin de phrase (VAD).
 *  2. En parallèle, Web Speech si disponible (interim + précision Google).
 *  3. À l'arrêt : texte Web Speech s'il existe, sinon WAV 16 kHz →
 *     /api/voice/transcribe (ASR serveur) — fonctionne partout.
 *  4. Réponse LLM streamée → lecture voix : synthèse navigateur d'abord,
 *     repli TTS serveur automatique (/api/voice/speak) si aucune voix.
 * La navigation reste temps réel sous la capsule (chat-bus → router.push).
 */
export function OmnisOverlay() {
  const { omnisOpen, setOmnisOpen, messages, streaming, send, consentNoticeAck, setOpen } = useChat();
  const { t, lang } = useI18n();
  const { record } = useConsent();

  const [state, setState] = useState<OmnisState>("idle");
  const [note, setNote] = useState<OmnisNote>(null);
  const [heard, setHeard] = useState("");
  const [webInterim, setWebInterim] = useState("");
  const [handsFree, setHandsFree] = useState(true);
  const [navFlash, setNavFlash] = useState<string | null>(null);
  const [kbOpen, setKbOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const [cardOpen, setCardOpen] = useState(true);
  const [elapsed, setElapsed] = useState(0);

  const recorderRef = useRef<VoiceRecorder | null>(null);
  const webRecRef = useRef<SpeechRecognitionLike | null>(null);
  const webFinalRef = useRef("");
  const handsFreeRef = useRef(handsFree);
  const restartTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const navTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const noteTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const elapsedTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const startedAtRef = useRef(0);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const pendingVoiceRef = useRef<string>("");
  const barRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const silenceRef = useRef(0);

  const supported = isVoiceInputSupported();

  useEffect(() => {
    handsFreeRef.current = handsFree;
  }, [handsFree]);

  /* État courant lisible dans les callbacks non-React (VAD, timers) */
  const stateRef = useRef<OmnisState>(state);
  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  const streamingRef = useRef(streaming);
  useEffect(() => {
    streamingRef.current = streaming;
  }, [streaming]);

  /* Préchauffe la sélection de voix (voiceschanged asynchrone) */
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

  const clearTimers = useCallback(() => {
    if (restartTimer.current) {
      clearTimeout(restartTimer.current);
      restartTimer.current = null;
    }
    if (noteTimer.current) {
      clearTimeout(noteTimer.current);
      noteTimer.current = null;
    }
    if (elapsedTimer.current) {
      clearInterval(elapsedTimer.current);
      elapsedTimer.current = null;
    }
  }, []);

  const flashNote = useCallback((n: OmnisNote) => {
    setNote(n);
    if (noteTimer.current) clearTimeout(noteTimer.current);
    noteTimer.current = setTimeout(() => setNote(null), 5200);
  }, []);

  const stopWebSpeech = useCallback(() => {
    const rec = webRecRef.current;
    webRecRef.current = null;
    if (!rec) return;
    rec.onresult = null;
    rec.onerror = null;
    rec.onend = null;
    try {
      rec.abort();
    } catch {
      /* ignore */
    }
  }, []);

  const stopRecording = useCallback(() => {
    const rec = recorderRef.current;
    recorderRef.current = null;
    rec?.dispose();
    if (elapsedTimer.current) {
      clearInterval(elapsedTimer.current);
      elapsedTimer.current = null;
    }
  }, []);

  const stopEverything = useCallback(() => {
    stopRecording();
    stopWebSpeech();
    clearTimers();
    cancelSpeech();
  }, [stopRecording, stopWebSpeech, clearTimers]);

  const exit = useCallback(() => {
    stopEverything();
    setOmnisOpen(false);
    setState("idle");
    setNote(null);
    setHeard("");
    setWebInterim("");
    setKbOpen(false);
    setDraft("");
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

  /* ── Réarmement mains libres (après un tour sans parole détectée) ──
     Un simple compteur d'état : l'effet dédié (défini après startListening)
     re-déclenche l'écoute — aucune référence circulaire. */
  const [relistenTick, setRelistenTick] = useState(0);
  const requestRelisten = useCallback(() => setRelistenTick((t) => t + 1), []);

  /* ── Démarrage Web Speech (voie rapide, échec silencieux) ──────── */
  const startWebSpeech = useCallback(() => {
    const Ctor = getRecognitionCtor();
    if (!Ctor) return;
    try {
      const rec = new Ctor();
      webRecRef.current = rec;
      webFinalRef.current = "";
      rec.lang = SPEECH_LOCALES[lang];
      rec.continuous = true;
      rec.interimResults = true;
      rec.onresult = (e) => {
        let fin = "";
        let inter = "";
        for (let i = 0; i < e.results.length; i++) {
          const res = e.results[i];
          const txt = res[0]?.transcript ?? "";
          if (res.isFinal) fin += txt;
          else inter += txt;
        }
        if (fin.trim()) {
          webFinalRef.current = `${webFinalRef.current ? `${webFinalRef.current} ` : ""}${fin.trim()}`;
        }
        setWebInterim((webFinalRef.current + (inter ? ` ${inter}` : "")).trim());
      };
      rec.onerror = () => {
        /* toléré : l'ASR serveur prend le relais à l'arrêt */
        stopWebSpeech();
      };
      rec.onend = () => {
        /* le VAD pilote l'arrêt global — rien à faire ici */
      };
      rec.start();
    } catch {
      webRecRef.current = null;
    }
  }, [lang, stopWebSpeech]);

  /* ── Fin de prise : Web Speech d'abord, ASR serveur sinon ─────── */
  const finishCapture = useCallback(async () => {
    stopWebSpeech();
    const rec = recorderRef.current;
    recorderRef.current = null;
    if (elapsedTimer.current) {
      clearInterval(elapsedTimer.current);
      elapsedTimer.current = null;
    }
    if (!rec) return;

    let take: { wavBase64: string; durationMs: number; rms: number } | null = null;
    try {
      take = await rec.stop();
    } catch {
      take = null;
    }

    const webText = webFinalRef.current.trim();
    webFinalRef.current = "";
    setWebInterim("");

    /* Voie rapide — Web Speech a compris. */
    if (webText) {
      setHeard(webText);
      silenceRef.current = 0;
      if (streamingRef.current) {
        pendingVoiceRef.current = webText;
        setState("thinking");
        return;
      }
      setState("thinking");
      void send(webText, { source: "voice" });
      return;
    }

    /* Prise vide / souffle seul — pas d'aller-retour inutile. */
    if (!take || !take.wavBase64 || take.durationMs < 650 || take.rms < 0.004) {
      silenceRef.current += 1;
      flashNote("no_speech");
      setState("idle");
      requestRelisten();
      return;
    }

    /* Voie fiable — ASR serveur (tous navigateurs). */
    setState("transcribing");
    try {
      const res = await fetch("/api/voice/transcribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ audioBase64: take.wavBase64 }),
      });
      const json = (await res.json().catch(() => null)) as { ok?: boolean; data?: { text?: string } } | null;
      const text = json?.ok ? String(json.data?.text ?? "").trim() : "";
      if (text) {
        setHeard(text);
        silenceRef.current = 0;
        if (streamingRef.current) {
          pendingVoiceRef.current = text;
          setState("thinking");
          return;
        }
        setState("thinking");
        void send(text, { source: "voice" });
      } else if (json?.ok) {
        silenceRef.current += 1;
        flashNote("no_speech");
        setState("idle");
        requestRelisten();
      } else {
        flashNote("asr_error");
        setState("idle");
        requestRelisten();
      }
    } catch {
      flashNote("asr_error");
      setState("idle");
      requestRelisten();
    }
  }, [send, flashNote, requestRelisten, stopWebSpeech]);

  /* ── Démarrage de l'écoute ─────────────────────────────────────── */
  const startListening = useCallback(async () => {
    if (!isVoiceInputSupported()) {
      setState("unsupported");
      setKbOpen(true);
      return;
    }
    if (recorderRef.current) return;
    clearTimers();
    cancelSpeech(); // jamais d'écoute pendant la voix
    record("microphone", true);
    setNote(null);
    setHeard("");
    setWebInterim("");
    setElapsed(0);
    silenceRef.current = 0;

    const rec = new VoiceRecorder();
    rec.onLevel = (level) => {
      const bars = barRefs.current;
      const gains = [0.55, 0.8, 1, 0.8, 0.55];
      for (let i = 0; i < bars.length; i++) {
        const bar = bars[i];
        if (bar) bar.style.transform = `scaleY(${(0.18 + level * gains[i]).toFixed(3)})`;
      }
    };
    rec.onVadStop = () => {
      if (recorderRef.current === rec) void finishCapture();
    };

    try {
      await rec.start();
      recorderRef.current = rec;
      startedAtRef.current = Date.now();
      setState("recording");
      elapsedTimer.current = setInterval(() => {
        setElapsed(Math.floor((Date.now() - startedAtRef.current) / 100) / 10);
      }, 200);
      startWebSpeech();
    } catch (e) {
      rec.dispose();
      const name = (e as DOMException | undefined)?.name ?? "";
      if (name === "NotAllowedError" || name === "SecurityError" || name === "PermissionDeniedError") {
        setHandsFree(false);
        setKbOpen(true); // le clavier prend le relais immédiatement
        setState("denied");
      } else if (name === "NotFoundError" || name === "DevicesNotFoundError" || name === "NotReadableError") {
        setKbOpen(true);
        flashNote("mic_error");
        setState("idle");
      } else {
        setKbOpen(true);
        flashNote("mic_error");
        setState("idle");
      }
    }
  }, [clearTimers, flashNote, finishCapture, record, startWebSpeech]);

  /* Réarmement mains libres : après un tour sans parole détectée, on
     ré-écoute brièvement — pause après 2 silences (le visiteur re-tape
     le micro pour reprendre). */
  useEffect(() => {
    if (!relistenTick || !handsFree) return;
    const id = setTimeout(() => {
      if (stateRef.current === "idle" && !streamingRef.current) void startListening();
    }, 700);
    return () => clearTimeout(id);
  }, [relistenTick, handsFree, startListening]);

  /* Question vocale arrivée pendant le streaming : partie dès la fin. */
  useEffect(() => {
    if (streaming) return;
    const queued = pendingVoiceRef.current;
    if (queued) {
      pendingVoiceRef.current = "";
      void send(queued, { source: "voice" });
    }
  }, [streaming, send]);

  /* ── Boucle conversationnelle temps réel ─────────────────────────
     Dès qu'une RÉPONSE est complète → lecture à voix haute (navigateur,
     repli serveur automatique) → fin de lecture → (mains libres)
     réécoute auto. spokenRef évite toute double lecture. */
  const spokenRef = useRef("");

  useEffect(() => {
    if (!omnisOpen) return;
    const last = [...messages].reverse().find((m) => m.role === "assistant" && m.content);
    spokenRef.current = last?.content ?? "";
  }, [omnisOpen]);

  useEffect(() => {
    if (!omnisOpen || streaming) return;
    const last = messages[messages.length - 1];
    const isReplyToUser =
      last?.role === "assistant" &&
      last.content &&
      messages.length > 1 &&
      messages[messages.length - 2]?.role === "user";
    if (!isReplyToUser || last.content === spokenRef.current) return;
    spokenRef.current = last.content;
    speakWithFallback(last.content, lang, {
      onStart: () => setState("speaking"),
      onEnd: () => {
        setState((s) => (s === "speaking" ? "idle" : s));
        if (handsFreeRef.current && isVoiceInputSupported()) {
          restartTimer.current = setTimeout(() => {
            restartTimer.current = null;
            if (stateRef.current === "idle" && !streamingRef.current) void startListening();
          }, 400);
        }
      },
    });
  }, [streaming, messages, omnisOpen, lang, startListening]);

  /* Envoi clavier sans quitter Omnis */
  const submitDraft = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const text = draft.trim();
      if (!text || streaming) return;
      setDraft("");
      stopEverything(); // coupe l'écoute éventuelle
      setState("thinking");
      void send(text);
    },
    [draft, streaming, send, stopEverything]
  );

  if (!omnisOpen) return null;

  const lastAssistant = [...messages].reverse().find((m) => m.role === "assistant" && m.content);
  const lastUser = [...messages].reverse().find((m) => m.role === "user" && m.content);
  const effState: OmnisState = streaming && state !== "recording" ? "thinking" : state;
  const recording = state === "recording";

  const statusLabel =
    state === "recording"
      ? t("chat.omnis.listening")
      : state === "transcribing"
        ? t("chat.omnis.transcribing")
        : state === "thinking" || streaming
          ? t("chat.omnis.thinking")
          : state === "speaking"
            ? t("chat.omnis.speaking")
            : state === "denied"
              ? t("chat.omnis.micDenied")
              : handsFree
                ? t("chat.omnis.autoListen")
                : t("chat.omnis.idle");

  const noteLabel =
    note === "no_speech"
      ? t("chat.omnis.noSpeech")
      : note === "asr_error"
        ? t("chat.omnis.asrError")
        : note === "mic_error"
          ? t("chat.omnis.micError")
          : null;

  const dotCls =
    state === "recording"
      ? "bg-[var(--success)]"
      : state === "speaking"
        ? "bg-gold"
        : effState === "thinking"
          ? "bg-gold/70"
          : "bg-mute/50";

  const interimText = recording
    ? webInterim
    : heard || webInterim || lastUser?.content.slice(0, 80) || "";

  return (
    <>
      {/* ═══ Capsule Omnis — haut centre : le site reste visible partout ═══ */}
      <div
        role="dialog"
        aria-label={t("chat.omnis.title")}
        className="animate-in fade-in slide-in-from-top-3 duration-300 fixed left-1/2 top-[4.75rem] z-[82] flex w-[min(94vw,660px)] -translate-x-1/2 flex-col gap-2 md:top-[5.5rem]"
      >
        {/* Ligne principale : état + niveaux + voix + clavier + fermer */}
        <div className="glass-panel flex items-center gap-2 rounded-2xl border border-line/60 px-2.5 py-2 shadow-2xl sm:gap-2.5 sm:px-3">
          <span className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-gold/40 text-goldtext">
            <Radar className="h-4 w-4" strokeWidth={1.5} />
            {(recording || state === "speaking") && (
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
                    recording ? "pulse-dot 2s infinite" : effState === "thinking" ? "pulse-dot 1s infinite" : undefined,
                }}
              />
              <span className="truncate">{statusLabel}</span>
              {recording && (
                <span className="ml-1 shrink-0 rounded-full bg-surface/80 px-1.5 text-[0.6875rem] tabular-nums text-mute">
                  {elapsed.toFixed(1)}s
                </span>
              )}
            </p>
            {state === "denied" ? (
              <p className="line-clamp-2 text-xs leading-snug text-mute">{t("chat.omnis.micDenied")}</p>
            ) : (
              <p className="truncate text-xs italic text-mute">
                {noteLabel ? noteLabel : interimText ? `« ${interimText} »` : t("chat.omnis.hint")}
              </p>
            )}
          </div>

          {/* Niveau sonore en direct : le visiteur VOIT que le micro entend */}
          {recording && (
            <span className="flex h-10 shrink-0 items-center gap-[3px]" aria-hidden="true">
              {[0, 1, 2, 3, 4].map((i) => (
                <span
                  key={i}
                  ref={(el) => {
                    barRefs.current[i] = el;
                  }}
                  className="h-6 w-[3px] origin-center rounded-full bg-gold transition-transform duration-75 ease-linear"
                  style={{ transform: "scaleY(0.18)" }}
                />
              ))}
            </span>
          )}

          {/* Micro : démarre / arrête-et-envoie */}
          <button
            type="button"
            onClick={() => {
              if (recording) void finishCapture();
              else void startListening();
            }}
            disabled={state === "transcribing" || (effState === "thinking" && !recording) || !supported}
            aria-label={recording ? t("chat.omnis.stop") : t("chat.omnis.listening")}
            title={recording ? t("chat.omnis.stop") : t("chat.omnis.hint")}
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-all active:scale-95 disabled:opacity-50 sm:h-11 sm:w-11 ${
              recording
                ? "gold-fill shadow-[0_8px_30px_rgba(212,175,55,0.45)]"
                : "border border-gold/50 text-goldtext hover:bg-gold/10"
            }`}
          >
            {state === "denied" ? (
              <MicOff className="h-4.5 w-4.5 text-goldtext" strokeWidth={1.5} />
            ) : recording ? (
              <Square className="h-4 w-4 fill-current text-ongold" strokeWidth={1.5} />
            ) : (
              <Mic className="h-4.5 w-4.5 text-goldtext" strokeWidth={1.5} />
            )}
          </button>

          {/* Mains libres */}
          <button
            type="button"
            onClick={() => setHandsFree((v) => !v)}
            aria-pressed={handsFree}
            title={t("chat.omnis.handsFree")}
            aria-label={t("chat.omnis.handsFree")}
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border transition-colors sm:h-10 sm:w-10 ${
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
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border transition-colors sm:h-10 sm:w-10 ${
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
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-mute transition-colors hover:text-ink sm:h-10 sm:w-10"
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
          <RadarIcon
            className="h-3.5 w-3.5 shrink-0"
            strokeWidth={1.5}
            style={{ animation: navFlash ? "omnis-spin 2.4s linear infinite" : undefined }}
          />
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
                {heard && (
                  <p className="text-xs italic leading-relaxed text-mute">
                    {t("chat.you")} : « {heard} »
                  </p>
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
