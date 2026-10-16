"use client";

/**
 * Enregistrement vocal universel pour le mode Omnis.
 *
 * Remplace l'ancienne dépendance à webkitSpeechRecognition (API Web Speech),
 * qui est absente de Firefox, bloquée dans les iframes d'aperçu et
 * intermittente sur Safari — c'est elle qui rendait le mode vocal muet.
 *
 * Chaîne : getUserMedia → MediaRecorder (webm/opus, ogg/opus ou mp4/AAC
 * selon le navigateur) → décodage local → WAV PCM 16 bits 16 kHz mono →
 * base64 → POST /api/voice/transcribe (ASR serveur).
 *
 * Un analyseur temps réel fournit le niveau sonore (retour visuel « le
 * micro entend ») et un détecteur d'activité vocale (VAD) stoppe
 * automatiquement l'enregistrement après ~1,7 s de silence.
 */

const VAD_LEVEL_THRESHOLD = 0.09; // niveau RMS normalisé considéré comme de la parole
const VAD_SILENCE_MS = 1700; // silence déclenchant l'arrêt automatique
const VAD_GRACE_MS = 350; // délai minimal avant que le VAD puisse couper
const HARD_CAP_MS = 15_000; // garde-fou : durée maximale d'une prise

export function isVoiceInputSupported(): boolean {
  if (typeof navigator === "undefined") return false;
  return (
    !!navigator.mediaDevices?.getUserMedia &&
    typeof window.MediaRecorder === "function" &&
    typeof window.AudioContext === "function"
  );
}

/** Meilleur conteneur audio supporté par le navigateur courant. */
export function pickRecorderMime(): string {
  if (typeof window === "undefined" || typeof window.MediaRecorder !== "function") return "";
  const candidates = [
    "audio/webm;codecs=opus",
    "audio/webm",
    "audio/ogg;codecs=opus",
    "audio/mp4",
    "audio/mpeg",
  ];
  for (const mime of candidates) {
    try {
      if (MediaRecorder.isTypeSupported?.(mime)) return mime;
    } catch {
      /* ignore */
    }
  }
  return "";
}

export interface RecordedTake {
  /** WAV 16 kHz mono PCM16, encodé base64 (prêt pour l'ASR serveur). */
  wavBase64: string;
  durationMs: number;
  /** Énergie moyenne du signal (0..1) — détecte les prises totalement muettes. */
  rms: number;
}

/* ── Encodeur WAV PCM16 ──────────────────────────────────────────── */

function encodeWavPcm16(samples: Float32Array, sampleRate: number): ArrayBuffer {
  const buffer = new ArrayBuffer(44 + samples.length * 2);
  const view = new DataView(buffer);
  const writeStr = (offset: number, s: string) => {
    for (let i = 0; i < s.length; i++) view.setUint8(offset + i, s.charCodeAt(i));
  };
  writeStr(0, "RIFF");
  view.setUint32(4, 36 + samples.length * 2, true);
  writeStr(8, "WAVE");
  writeStr(12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true); // PCM
  view.setUint16(22, 1, true); // mono
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  writeStr(36, "data");
  view.setUint32(40, samples.length * 2, true);
  let offset = 44;
  for (let i = 0; i < samples.length; i++, offset += 2) {
    const s = Math.max(-1, Math.min(1, samples[i]));
    view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, true);
  }
  return buffer;
}

function floatToBase64(wav: ArrayBuffer): string {
  const bytes = new Uint8Array(wav);
  let binary = "";
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
  }
  return btoa(binary);
}

/** Décode l'enregistrement natif et le reconditionne en WAV 16 kHz mono. */
async function takeToWav(blob: Blob, decodeCtx: AudioContext): Promise<RecordedTake> {
  const decoded = await decodeCtx.decodeAudioData(await blob.arrayBuffer());
  const targetRate = 16_000;
  const length = Math.max(1, Math.ceil(decoded.duration * targetRate));
  const offline = new OfflineAudioContext(1, length, targetRate);
  const source = offline.createBufferSource();
  source.buffer = decoded;
  source.connect(offline.destination);
  source.start();
  const rendered = await offline.startRendering();
  const data = rendered.getChannelData(0);

  let sum = 0;
  for (let i = 0; i < data.length; i++) sum += data[i] * data[i];
  const rms = Math.sqrt(sum / Math.max(1, data.length));

  const wav = encodeWavPcm16(data, targetRate);
  return { wavBase64: floatToBase64(wav), durationMs: Math.round(decoded.duration * 1000), rms };
}

/* ── Enregistreur ────────────────────────────────────────────────── */

export class VoiceRecorder {
  private stream: MediaStream | null = null;
  private recorder: MediaRecorder | null = null;
  private ctx: AudioContext | null = null;
  private raf = 0;
  private chunks: Blob[] = [];
  private startedAt = 0;
  private speechSeen = false;
  private lastVoiceAt = 0;
  private stopping = false;

  /** Niveau sonore normalisé (0..1), mis à jour en temps réel. */
  onLevel: ((level: number) => void) | null = null;
  /** Déclenché par le VAD (fin de parole) ou par le garde-fou de durée. */
  onVadStop: (() => void) | null = null;

  static supported(): boolean {
    return isVoiceInputSupported();
  }

  /** À appeler dans un geste utilisateur (autorisation micro). */
  async start(): Promise<void> {
    if (this.recorder) return;
    this.stream = await navigator.mediaDevices.getUserMedia({
      audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true },
    });

    const mime = pickRecorderMime();
    this.recorder = new MediaRecorder(this.stream, mime ? { mimeType: mime } : undefined);
    this.chunks = [];
    this.recorder.ondataavailable = (e) => {
      if (e.data && e.data.size > 0) this.chunks.push(e.data);
    };
    this.recorder.start(250);
    this.startedAt = Date.now();
    this.speechSeen = false;
    this.lastVoiceAt = Date.now();
    this.stopping = false;

    /* Analyseur temps réel — niveau + VAD. */
    const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    this.ctx = new Ctor();
    void this.ctx.resume();
    const source = this.ctx.createMediaStreamSource(this.stream);
    const analyser = this.ctx.createAnalyser();
    analyser.fftSize = 512;
    source.connect(analyser);
    const data = new Uint8Array(analyser.frequencyBinCount);

    const tick = () => {
      if (!this.ctx || this.stopping) return;
      analyser.getByteTimeDomainData(data);
      let sum = 0;
      for (let i = 0; i < data.length; i++) {
        const v = (data[i] - 128) / 128;
        sum += v * v;
      }
      const level = Math.min(1, Math.sqrt(sum / data.length) * 4.2);
      this.onLevel?.(level);

      const now = Date.now();
      if (level > VAD_LEVEL_THRESHOLD) {
        this.speechSeen = true;
        this.lastVoiceAt = now;
      } else if (
        this.speechSeen &&
        now - this.startedAt > VAD_GRACE_MS &&
        now - this.lastVoiceAt > VAD_SILENCE_MS
      ) {
        this.onVadStop?.();
        return; // plus de boucle — l'appelant va stopper
      }
      if (now - this.startedAt > HARD_CAP_MS) {
        this.onVadStop?.();
        return;
      }
      this.raf = requestAnimationFrame(tick);
    };
    this.raf = requestAnimationFrame(tick);
  }

  /** Stoppe la prise et retourne le WAV prêt pour l'ASR. */
  async stop(): Promise<RecordedTake> {
    this.stopping = true;
    cancelAnimationFrame(this.raf);
    const rec = this.recorder;
    this.recorder = null;
    const durationMs = Date.now() - this.startedAt;

    const stopped = new Promise<void>((resolve) => {
      if (!rec || rec.state === "inactive") return resolve();
      rec.onstop = () => resolve();
      try {
        rec.stop();
      } catch {
        resolve();
      }
    });
    await stopped;

    const blob = new Blob(this.chunks, { type: this.chunks[0]?.type || "audio/webm" });
    this.chunks = [];
    this.stream?.getTracks().forEach((t) => t.stop());
    this.stream = null;

    const ctx = this.ctx;
    this.ctx = null;
    if (!ctx || blob.size === 0) {
      void ctx?.close().catch(() => {});
      return { wavBase64: "", durationMs, rms: 0 };
    }
    try {
      const take = await takeToWav(blob, ctx);
      return take;
    } catch {
      /* décodage impossible (rare) — prise perdue mais session propre */
      return { wavBase64: "", durationMs, rms: 0 };
    } finally {
      void ctx.close().catch(() => {});
    }
  }

  /** Arrêt d'urgence sans traitement (fermeture du mode, changement d'état). */
  dispose(): void {
    this.stopping = true;
    cancelAnimationFrame(this.raf);
    try {
      if (this.recorder && this.recorder.state !== "inactive") this.recorder.stop();
    } catch {
      /* ignore */
    }
    this.recorder = null;
    this.chunks = [];
    this.stream?.getTracks().forEach((t) => t.stop());
    this.stream = null;
    void this.ctx?.close().catch(() => {});
    this.ctx = null;
  }
}
