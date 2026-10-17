#!/usr/bin/env bun
/// <reference types="bun-types" />
/**
 * Harnais d'évaluation du chatbot vendeur — EINSOF (Task 5-b).
 *
 * Exécute le jeu de questions (tests/chatbot/questions.json) contre l'API
 * chat en mode éphémère (POST {message, locale:"fr", history:[]}, sans
 * sessionId), lit la réponse SSE en entier, concatène les tokens et vérifie :
 *   - mustInclude    : tous les mots-clés présents dans la réponse ;
 *   - mustNotInclude : aucun mot-clé interdit présent (anti-hallucination /
 *     anti-injection).
 * Comparaison insensible à la casse, aux accents et aux espaces (y compris
 * espaces insécables U+00A0 et fines insécables U+202F produites par
 * Intl.NumberFormat("fr-FR") côté site).
 *
 * Usage :
 *   bun tests/chatbot/run.ts [--limit N] [--start N] [--throttle MS] [--out fichier.json]
 *
 * Environnement :
 *   CHATBOT_BASE_URL — URL de base du site (défaut : http://localhost:3000)
 *
 * Code de sortie : 0 si score >= 90 %, 1 sinon, 2 si erreur du harnais
 * (arguments, fichier de questions illisible, etc.).
 */

const SEUIL = 90; // % minimum exigé
const REQUEST_TIMEOUT_MS = 30_000;
const THROTTLE_DEFAULT_MS = 3_500; // rate limit API chat : 20 req/min/IP => >= 3,5 s

const USAGE = `Usage : bun tests/chatbot/run.ts [options]

Options :
  --limit N      Nombre maximum de questions à exécuter (défaut : toutes)
  --start N      Index de départ (1-based, défaut : 1)
  --throttle MS  Pause entre deux appels API (défaut : 3500 ms)
  --out FICHIER  Écrit le rapport des échecs en JSON
  --help         Affiche cette aide

Environnement :
  CHATBOT_BASE_URL  URL de base du site (défaut : http://localhost:3000)`;

interface Question {
  id: number;
  category: string;
  question: string;
  mustInclude: string[];
  mustNotInclude: string[];
}

interface Outcome {
  index: number; // index global (1-based) dans le jeu complet
  question: Question;
  passed: boolean;
  /** Erreur transport/API (réseau, HTTP != 200, event SSE "error", réponse vide) */
  error: string | null;
  missing: string[];
  forbidden: string[];
  response: string;
}

interface FailureRow {
  id: number;
  category: string;
  question: string;
  error: string | null;
  missing: string[];
  forbidden: string[];
  response: string;
}

/* ------------------------------------------------------------------ */
/* Arguments                                                           */
/* ------------------------------------------------------------------ */

interface CliOptions {
  limit: number | null;
  start: number;
  throttle: number;
  out: string | null;
  help: boolean;
}

function parseArgs(argv: string[]): CliOptions {
  const opts: CliOptions = { limit: null, start: 1, throttle: THROTTLE_DEFAULT_MS, out: null, help: false };
  for (let i = 0; i < argv.length; i++) {
    const flag = argv[i];
    switch (flag) {
      case "--limit": {
        const n = Number(argv[++i]);
        if (!Number.isFinite(n) || n < 1) throw new Error("--limit doit être un entier >= 1");
        opts.limit = Math.floor(n);
        break;
      }
      case "--start": {
        const n = Number(argv[++i]);
        if (!Number.isFinite(n) || n < 1) throw new Error("--start doit être un entier >= 1");
        opts.start = Math.floor(n);
        break;
      }
      case "--throttle": {
        const n = Number(argv[++i]);
        if (!Number.isFinite(n) || n < 0) throw new Error("--throttle doit être un nombre >= 0");
        opts.throttle = n;
        break;
      }
      case "--out": {
        const v = argv[++i];
        if (!v) throw new Error("--out attend un chemin de fichier");
        opts.out = v;
        break;
      }
      case "--help":
      case "-h":
        opts.help = true;
        break;
      default:
        throw new Error(`Argument inconnu : ${String(flag)}\n${USAGE}`);
    }
  }
  return opts;
}

/* ------------------------------------------------------------------ */
/* Normalisation                                                       */
/* ------------------------------------------------------------------ */

/**
 * Minuscules + suppression des accents + tous les caractères
 * d'espacement/insécables (\s couvre \u00a0 et \u202f en JS, on les liste
 * quand même explicitement) réduits à UN espace simple.
 */
export function normalize(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/\s|\u00a0|\u202f/g, " ")
    .replace(/ {2,}/g, " ")
    .trim();
}

/* ------------------------------------------------------------------ */
/* SSE                                                                 */
/* ------------------------------------------------------------------ */

interface SseParse {
  text: string;
  error: string | null;
}

/** Extrait du flux SSE brut la concaténation des tokens + l'éventuelle erreur. */
export function parseSse(raw: string): SseParse {
  let text = "";
  let error: string | null = null;
  for (const line of raw.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed.startsWith("data:")) continue;
    const payload = trimmed.slice(5).trim(); // après "data:"
    if (!payload) continue;
    let ev: unknown;
    try {
      ev = JSON.parse(payload);
    } catch {
      continue; // ligne mal formée : ignorée
    }
    if (ev === null || typeof ev !== "object") continue;
    const evt = ev as { type?: unknown; v?: unknown };
    if (evt.type === "token" && typeof evt.v === "string") {
      text += evt.v;
    } else if (evt.type === "error") {
      error = typeof evt.v === "string" && evt.v.length > 0 ? evt.v : "error";
    }
    // type "done" / "action" / "lead" : ignorés
  }
  return { text, error };
}

/* ------------------------------------------------------------------ */
/* Appel API                                                           */
/* ------------------------------------------------------------------ */

type AskResult = { ok: true; text: string } | { ok: false; error: string };

async function askChatbot(base: string, message: string): Promise<AskResult> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    const res = await fetch(`${base}/api/chat/message`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, locale: "fr", history: [] }),
      signal: controller.signal,
    });
    const raw = await res.text(); // lecture SSE ENTIÈRE
    if (!res.ok) return { ok: false, error: `HTTP ${res.status}` };
    const { text, error } = parseSse(raw);
    if (error) return { ok: false, error: `événement SSE "error" (${error})` };
    if (!text.trim()) return { ok: false, error: "réponse vide (aucun token reçu)" };
    return { ok: true, text };
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return {
      ok: false,
      error: controller.signal.aborted ? `timeout après ${REQUEST_TIMEOUT_MS / 1000} s` : `erreur réseau : ${msg}`,
    };
  } finally {
    clearTimeout(timer);
  }
}

/* ------------------------------------------------------------------ */
/* Évaluation                                                          */
/* ------------------------------------------------------------------ */

interface Evaluation {
  passed: boolean;
  missing: string[];
  forbidden: string[];
}

export function evaluate(q: Question, responseText: string): Evaluation {
  const normResponse = normalize(responseText);
  const missing = q.mustInclude.filter((k) => !normResponse.includes(normalize(k)));
  const forbidden = q.mustNotInclude.filter((k) => normResponse.includes(normalize(k)));
  return { passed: missing.length === 0 && forbidden.length === 0, missing, forbidden };
}

/* ------------------------------------------------------------------ */
/* Chargement des questions                                            */
/* ------------------------------------------------------------------ */

async function loadQuestions(path: string): Promise<Question[]> {
  const raw = await Bun.file(path).text();
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch (e) {
    throw new Error(`questions.json illisible (JSON invalide) : ${e instanceof Error ? e.message : String(e)}`);
  }
  if (!Array.isArray(parsed)) throw new Error("questions.json doit contenir un tableau");
  const questions: Question[] = [];
  for (const [i, item] of parsed.entries()) {
    const q = item as Partial<Question>;
    if (typeof q.id !== "number" || typeof q.question !== "string" || typeof q.category !== "string") {
      throw new Error(`questions.json : entrée ${i + 1} invalide (id/category/question requis)`);
    }
    questions.push({
      id: q.id,
      category: q.category,
      question: q.question,
      mustInclude: Array.isArray(q.mustInclude) ? q.mustInclude.filter((k): k is string => typeof k === "string") : [],
      mustNotInclude: Array.isArray(q.mustNotInclude) ? q.mustNotInclude.filter((k): k is string => typeof k === "string") : [],
    });
  }
  return questions;
}

/* ------------------------------------------------------------------ */
/* Affichage                                                           */
/* ------------------------------------------------------------------ */

function shorten(text: string, max: number): string {
  const clean = text.replace(/\s+/g, " ").trim();
  return clean.length <= max ? clean : `${clean.slice(0, max - 1)}…`;
}

function pad(n: number, width: number): string {
  return String(n).padStart(width, "0");
}

function printOutcome(o: Outcome, total: number, indexWidth: number): void {
  const label = o.passed ? "PASS" : "FAIL";
  console.log(`[${pad(o.index, indexWidth)}/${total}] ${label} ${o.question.category} — ${shorten(o.question.question, 64)}`);
  if (o.passed) return;
  if (o.error) console.log(`         ↳ erreur : ${o.error}`);
  if (o.missing.length > 0) {
    console.log(`         ↳ mot(s)-clé(s) manquant(s) : ${o.missing.map((k) => `"${k}"`).join(", ")}`);
  }
  if (o.forbidden.length > 0) {
    console.log(`         ↳ interdit trouvé : ${o.forbidden.map((k) => `"${k}"`).join(", ")}`);
  }
  if (o.response) console.log(`         ↳ réponse : ${shorten(o.response, 180)}`);
}

const sleep = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));

/* ------------------------------------------------------------------ */
/* Programme principal                                                 */
/* ------------------------------------------------------------------ */

async function main(): Promise<void> {
  let opts: CliOptions;
  try {
    opts = parseArgs(process.argv.slice(2));
  } catch (e) {
    console.error(`${e instanceof Error ? e.message : String(e)}`);
    process.exitCode = 2;
    return;
  }
  if (opts.help) {
    console.log(USAGE);
    return;
  }

  const base = (process.env.CHATBOT_BASE_URL ?? "http://localhost:3000").replace(/\/+$/, "");
  const scriptDir = new URL(".", import.meta.url).pathname;
  const questionsPath = `${scriptDir}questions.json`;

  let questions: Question[];
  try {
    questions = await loadQuestions(questionsPath);
  } catch (e) {
    console.error(`Harnais : ${e instanceof Error ? e.message : String(e)}`);
    process.exitCode = 2;
    return;
  }

  const total = questions.length;
  const start = Math.max(1, Math.min(opts.start, total));
  const end = opts.limit !== null ? Math.min(start - 1 + opts.limit, total) : total;
  const selected = questions.slice(start - 1, end);
  if (selected.length === 0) {
    console.error("Harnais : aucune question sélectionnée (--start/--limit).");
    process.exitCode = 2;
    return;
  }

  const indexWidth = String(total).length;
  console.log(`Harnais chatbot vendeur — ${selected.length}/${total} question(s) — cible : ${base}`);
  console.log(`Throttle : ${opts.throttle} ms entre les appels (rate limit API : 20 req/min/IP)`);
  console.log("—".repeat(78));

  const outcomes: Outcome[] = [];
  let networkErrorShown = false;
  let passedCount = 0;

  for (let i = 0; i < selected.length; i++) {
    const question = selected[i]!;
    const index = start + i;
    const answer = await askChatbot(base, question.question);

    let outcome: Outcome;
    if (!answer.ok) {
      outcome = { index, question, passed: false, error: answer.error, missing: [], forbidden: [], response: "" };
      if (!networkErrorShown) {
        networkErrorShown = true;
        console.error(`\n⚠ Premier échec réseau : ${answer.error}`);
        console.error(`⚠ Vérifiez que le serveur tourne (bun run dev) ou ajustez CHATBOT_BASE_URL.\n`);
      }
    } else {
      const evaluation = evaluate(question, answer.text);
      outcome = {
        index,
        question,
        passed: evaluation.passed,
        error: null,
        missing: evaluation.missing,
        forbidden: evaluation.forbidden,
        response: answer.text,
      };
    }
    if (outcome.passed) passedCount++;

    printOutcome(outcome, total, indexWidth);
    outcomes.push(outcome);

    if (i < selected.length - 1) await sleep(opts.throttle);
  }

  const failed = outcomes.filter((o) => !o.passed);
  const score = outcomes.length > 0 ? (passedCount / outcomes.length) * 100 : 0;
  const scoreStr = score.toFixed(1);
  const seuilAtteint = score >= SEUIL;

  console.log("—".repeat(78));
  console.log(`Résultat    : ${passedCount}/${outcomes.length} réussies — score ${scoreStr} %`);
  console.log(`Seuil exigé : ${SEUIL} % → ${seuilAtteint ? "✓ ATTEINT" : "✗ NON ATTEINT"}`);
  if (failed.length > 0) {
    console.log(`Échecs (${failed.length}) :`);
    for (const o of failed) {
      const reason = o.error
        ? `erreur : ${o.error}`
        : [
            o.missing.length > 0 ? `manquant : ${o.missing.map((k) => `"${k}"`).join(", ")}` : null,
            o.forbidden.length > 0 ? `interdit : ${o.forbidden.map((k) => `"${k}"`).join(", ")}` : null,
          ]
            .filter(Boolean)
            .join(" | ");
      console.log(`  - #${o.question.id} [${o.question.category}] ${shorten(o.question.question, 60)} → ${reason}`);
    }
  }

  if (opts.out) {
    const report = {
      base,
      generatedAt: new Date().toISOString(),
      seuil: SEUIL,
      total: outcomes.length,
      passed: passedCount,
      failed: failed.length,
      scorePct: Number(scoreStr),
      seuilAtteint,
      failures: failed.map(
        (o): FailureRow => ({
          id: o.question.id,
          category: o.question.category,
          question: o.question.question,
          error: o.error,
          missing: o.missing,
          forbidden: o.forbidden,
          response: o.response,
        })
      ),
    };
    try {
      await Bun.write(opts.out, `${JSON.stringify(report, null, 2)}\n`);
      console.log(`Rapport des échecs écrit : ${opts.out}`);
    } catch (e) {
      console.error(`Impossible d'écrire ${opts.out} : ${e instanceof Error ? e.message : String(e)}`);
    }
  }

  process.exitCode = seuilAtteint ? 0 : 1;
}

// N'exécute le harnais que si ce fichier est le point d'entrée
// (permet d'importer normalize/parseSse/evaluate pour des tests unitaires).
if (import.meta.main) {
  main().catch((e: unknown) => {
    console.error(`Harnais : erreur fatale — ${e instanceof Error ? (e.stack ?? e.message) : String(e)}`);
    process.exitCode = 2;
  });
}
