"use client";

/**
 * Voix conversationnelle professionnelle pour le mode Omnis.
 *
 * Le client jugeait la voix par défaut « pas du tout bonne » : les
 * navigateurs choisissent en effet souvent une voix système robotique.
 * Stratégie : sélectionner systématiquement LA MEILLEURE voix disponible
 * pour la langue cible, avec préférence marquée pour les voix neuronales
 * (« Natural », « Neural », « Online », « Premium », « Enhanced »,
 * voix « Google »), puis régler débit / hauteur pour un rendu posé,
 * clair et conversationnel. Le texte est découpé par phrases pour une
 * prosodie stable (certains navigateurs coupent les longues énonciations).
 */

import type { Lang } from "@/lib/i18n";

export const SPEECH_LOCALES: Record<Lang, string> = {
  fr: "fr-FR",
  en: "en-US",
  es: "es-ES",
  zh: "zh-CN",
  de: "de-DE",
};

/** Voix à bannir (moteurs robotiques connus). */
const BAD_VOICE = /espeak|pico|compact|festival|flite/i;

/** Indices de qualité décroissante dans le nom de la voix. */
const QUALITY_MARKERS: { re: RegExp; weight: number }[] = [
  { re: /\bnatural\b/i, weight: 100 }, // Microsoft … Online (Natural)
  { re: /\bneural\b/i, weight: 100 }, // … Neural
  { re: /\bonline\b/i, weight: 60 }, // Microsoft Denise Online…
  { re: /google/i, weight: 70 }, // Google français
  { re: /\bpremium\b/i, weight: 50 }, // macOS voix Premium
  { re: /\benhanced\b/i, weight: 45 }, // macOS voix Enhanced
  { re: /\bsiri\b/i, weight: 40 },
];

export interface RankedVoice {
  voice: SpeechSynthesisVoice;
  score: number;
}

function baseLangScore(voice: SpeechSynthesisVoice, target: string): number {
  const vl = voice.lang.replace("_", "-").toLowerCase();
  const tl = target.toLowerCase();
  const root = tl.split("-")[0];
  if (vl === tl) return 200;
  if (vl.startsWith(root)) return 120;
  return 0;
}

function qualityScore(voice: SpeechSynthesisVoice): number {
  let score = 0;
  for (const { re, weight } of QUALITY_MARKERS) {
    if (re.test(voice.name)) score += weight;
  }
  if (BAD_VOICE.test(voice.name)) score -= 200;
  if (!voice.localService) score += 8; // voix cloud souvent neuronales
  return score;
}

/** Classe toutes les voix pour une locale cible (meilleure d'abord). */
export function rankVoices(target: string): RankedVoice[] {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return [];
  const all = window.speechSynthesis.getVoices();
  return all
    .map((voice) => ({
      voice,
      score: baseLangScore(voice, target) + qualityScore(voice),
    }))
    .filter((v) => v.score > 100) // même racine linguistique uniquement
    .sort((a, b) => b.score - a.score);
}

/** Meilleure voix pour la langue — avec micro-cache par locale. */
const cache = new Map<string, SpeechSynthesisVoice | null>();

export function pickBestVoice(lang: Lang): SpeechSynthesisVoice | null {
  const target = SPEECH_LOCALES[lang];
  if (cache.has(target)) return cache.get(target) ?? null;
  const ranked = rankVoices(target);
  const best = ranked[0]?.voice ?? null;
  cache.set(target, best);
  return best;
}

/** Invalide le cache (événement voiceschanged). */
export function invalidateVoiceCache() {
  cache.clear();
}

/** Découpe un texte en phrases courtes (prosodie stable). */
export function splitSentences(text: string, max = 220): string[] {
  const sentences = text.match(/[^.!?…]+[.!?…]+["»']?\s*|[^.!?…]+$/g) ?? [text];
  const out: string[] = [];
  let current = "";
  for (const s of sentences) {
    if ((current + s).length <= max) {
      current += s;
    } else {
      if (current.trim()) out.push(current.trim());
      current = s;
    }
  }
  if (current.trim()) out.push(current.trim());
  return out;
}

/**
 * Énonce un texte avec la meilleure voix disponible.
 * Retourne l'utterance principale (null si la synthèse est indisponible).
 * `onEnd` est appelé à la fin de TOUTE la lecture (toutes les phrases).
 */
export function speakProfessional(
  text: string,
  lang: Lang,
  onEnd?: () => void,
  onStart?: () => void
): SpeechSynthesisUtterance | null {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return null;
  const synth = window.speechSynthesis;
  const clean = text
    .replace(/\[\[[^\]]*\]\]/g, "")
    .replace(/[*_#`>|]/g, "")
    .replace(/\s+/g, " ")
    .trim();
  if (!clean) return null;

  synth.cancel();
  const voice = pickBestVoice(lang);

  const parts = splitSentences(clean);
  let started = false;
  let finished = 0;

  parts.forEach((part, i) => {
    const utter = new SpeechSynthesisUtterance(part);
    utter.lang = SPEECH_LOCALES[lang];
    if (voice) utter.voice = voice;
    /* Rendu posé et professionnel : débit légèrement sous la normale,
       hauteur neutre, volume plein. */
    utter.rate = 0.98;
    utter.pitch = 1;
    utter.volume = 1;
    if (i === 0) {
      utter.onstart = () => {
        if (!started) {
          started = true;
          onStart?.();
        }
      };
    }
    utter.onend = () => {
      finished++;
      if (finished >= parts.length) onEnd?.();
    };
    utter.onerror = () => {
      finished++;
      if (finished >= parts.length) onEnd?.();
    };
    synth.speak(utter);
  });

  /* File d'attente vide (certains navigateurs purgent au chargement) :
     si rien n'a démarré après 400 ms, on notifie quand même la fin. */
  window.setTimeout(() => {
    if (!started && !synth.speaking && !synth.pending) {
      onEnd?.();
    }
  }, 400);

  return null;
}
