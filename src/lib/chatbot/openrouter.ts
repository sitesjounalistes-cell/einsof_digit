/**
 * Client OpenRouter — moteur conversationnel du chatbot (clé fournie par
 * le client). Le modèle répond en streaming SSE ; les tokens sont relayés
 * au navigateur en temps réel. Zéro réponse pré-écrite : tout part du
 * modèle, nourri par le contexte du site (voir site-index.ts).
 *
 * Latence (retour client : « c'est très lent ») :
 * 1. Le modèle par défaut d'origine (openai/gpt-4o-mini) est BLOQUÉ par
 *    région (HTTP 403) — chaque message basculait silencieusement sur le
 *    repli z-ai non-streamé + streaming simulé mot à mot (22 ms/mot) :
 *    d'où une réponse lente à chaque fois. Correctif : chaîne de modèles
 *    testés en direct (bench scripts/bench-chat.ts) avec repli auto.
 * 2. Chien de garde « premier token » : si un modèle n'émet rien dans les
 *    5 s (FIRST_TOKEN_TIMEOUT_MS), il est abandonné et le suivant prend le relais — le visiteur
 *    n'attend jamais longtemps sans flux.
 *
 * Fallback final : si toute la chaîne échoue, l'API route bascule sur
 * z-ai (voir message/route.ts) — le chatbot ne meurt jamais.
 */

import { BRAND } from "@/lib/brand";

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";

/** Chaîne par défaut : mesurée en direct (bench curl, TTFB streaming,
 *  reasoning désactivé) — llama-3.3-70b ≈ 0,6 s, mistral-small ≈ 0,8 s.
 *  deepseek-v4-flash en 3e : un peu plus lent (1,6 s) mais très robuste.
 *  gpt-4o-mini est BLOQUÉ par région (403) — ne pas le remettre. */
const DEFAULT_MODELS = [
  "meta-llama/llama-3.3-70b-instruct",
  "mistralai/mistral-small-24b-instruct-2501",
  "deepseek/deepseek-v4-flash",
];

/** Délai max d'attente du PREMIER token avant de changer de modèle.
 *  Les modèles retenus répondent en < 1 s ; 5 s couvre largement les
 *  démarrages à froid d'OpenRouter sans faire patienter le visiteur. */
export const FIRST_TOKEN_TIMEOUT_MS = 5_000;

export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export function isOpenRouterConfigured(): boolean {
  return Boolean(process.env.OPENROUTER_API_KEY);
}

/**
 * Chaîne de modèles : OPENROUTER_MODEL peut contenir plusieurs IDs séparés
 * par des virgules ; les modèles par défaut complètent toujours la liste
 * (en dédupliquant) pour que le chatbot reste résilient.
 */
export function openRouterModels(): string[] {
  const fromEnv = (process.env.OPENROUTER_MODEL ?? "")
    .split(",")
    .map((m) => m.trim())
    .filter(Boolean);
  const chain = [...fromEnv];
  for (const m of DEFAULT_MODELS) {
    if (!chain.includes(m)) chain.push(m);
  }
  return chain;
}

/** Compat : premier modèle de la chaîne (logs, diagnostics). */
export function openRouterModel(): string {
  return openRouterModels()[0] ?? DEFAULT_MODELS[0];
}

/**
 * Appelle OpenRouter en streaming et yield les deltas de texte.
 * Jette une erreur si la clé est absente ou si l'API répond une erreur —
 * l'appelant décide du repli.
 */
export async function* streamOpenRouter(
  messages: ChatMessage[],
  opts: {
    temperature?: number;
    maxTokens?: number;
    signal?: AbortSignal;
    model?: string;
  } = {}
): AsyncGenerator<string> {
  const key = process.env.OPENROUTER_API_KEY;
  if (!key) throw new Error("openrouter_not_configured");

  const res = await fetch(OPENROUTER_URL, {
    method: "POST",
    signal: opts.signal,
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      /* OpenRouter recommande ces en-têtes d'attribution.
         ATTENTION : ASCII strict — un tiret cadratin (—) ou tout caractère
         hors ISO-8859-1 fait REJETER le header par le fetch de Bun/Edge
         avant même la requête (chaque appel échoue → repli lent).
         Audit F-20 : URL et titre par défaut alignés sur la marque dynamique
         et la même URL canonique par défaut que lib/seo.ts. */
      "HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.einsof.gn",
      "X-Title": `${BRAND} Assistant commercial`,
    },
    body: JSON.stringify({
      model: opts.model ?? openRouterModel(),
      messages,
      stream: true,
      temperature: opts.temperature ?? 0.6,
      max_tokens: opts.maxTokens ?? 700,
      /* CRUCIAL (latence) : les modèles « flash » raisonnent AVANT de
         répondre — les tokens de réflexion (delta.reasoning) retardaient
         chaque réponse visible de plusieurs secondes et pouvaient
         consommer tout le budget max_tokens (réponse vide !).
         On désactive explicitement le raisonnement. */
      reasoning: { enabled: false },
    }),
  });

  if (!res.ok || !res.body) {
    const detail = await res.text().catch(() => "");
    throw new Error(`openrouter_${res.status}: ${detail.slice(0, 180)}`);
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const parts = buffer.split("\n");
    buffer = parts.pop() ?? "";
    for (const line of parts) {
      const trimmed = line.trim();
      /* OpenRouter émet des lignes « : OPENROUTER PROCESSING » — à ignorer */
      if (!trimmed || trimmed.startsWith(":")) continue;
      if (!trimmed.startsWith("data:")) continue;
      const payload = trimmed.slice(5).trim();
      if (payload === "[DONE]") return;
      try {
        const json = JSON.parse(payload) as {
          choices?: { delta?: { content?: string } }[];
          error?: { message?: string };
        };
        if (json.error?.message) throw new Error(`openrouter: ${json.error.message}`);
        const delta = json.choices?.[0]?.delta?.content;
        if (delta) yield delta;
      } catch (e) {
        if (e instanceof SyntaxError) continue; /* fragment incomplet */
        throw e;
      }
    }
  }
}

/**
 * Enveloppe un générateur avec un chien de garde sur le PREMIER token :
 * si rien n'arrive dans `ms`, le contrôleur est avorté et une erreur
 * « first_token_timeout » est levée (le modèle suivant prend le relais).
 */
async function* withFirstTokenWatchdog(
  gen: AsyncGenerator<string>,
  ms: number,
  abort: AbortController
): AsyncGenerator<string> {
  const it = gen[Symbol.asyncIterator]();
  let first = true;
  while (true) {
    let result: IteratorResult<string> | "timeout";
    if (first) {
      result = await Promise.race([
        it.next(),
        new Promise<"timeout">((resolve) => setTimeout(() => resolve("timeout"), ms)),
      ]);
      if (result === "timeout") {
        abort.abort();
        try {
          await it.return?.(undefined);
        } catch {
          /* flux déjà coupé */
        }
        throw new Error("first_token_timeout");
      }
      first = false;
    } else {
      result = await it.next();
    }
    if (result.done) return;
    yield result.value;
  }
}

/**
 * Chaîne de modèles avec repli automatique : chaque modèle est essayé à
 * son tour (fetch + premier token sous FIRST_TOKEN_TIMEOUT_MS). Un modèle
 * n'est abandonné QUE si aucun token n'a encore été émis — si le flux est
 * coupé en cours de réponse, on ne redémarre pas (les tokens sont déjà
 * partis vers le navigateur).
 */
export async function* streamOpenRouterChain(
  messages: ChatMessage[],
  opts: { temperature?: number; maxTokens?: number } = {}
): AsyncGenerator<string> {
  const models = openRouterModels();
  let lastErr: unknown = new Error("no_model");
  for (const model of models) {
    const abort = new AbortController();
    let emitted = 0;
    try {
      const gen = withFirstTokenWatchdog(
        streamOpenRouter(messages, { ...opts, model, signal: abort.signal }),
        FIRST_TOKEN_TIMEOUT_MS,
        abort
      );
      for await (const delta of gen) {
        emitted++;
        yield delta;
      }
      /* Flux terminé SANS aucun token (réponse vide, raisonnement consommé,
         fournisseur dégradé) → on essaie le modèle suivant au lieu de
         livrer un silence au visiteur. */
      if (emitted === 0) {
        lastErr = new Error(`empty_stream_from_${model}`);
        console.error(`[chatbot] model "${model}" returned an empty stream, next model…`);
        continue;
      }
      return;
    } catch (e) {
      lastErr = e;
      console.error(`[chatbot] model "${model}" failed${emitted ? " (after tokens)" : ""}:`, e);
      /* Des tokens ont déjà été envoyés → ne jamais redémarrer une réponse. */
      if (emitted > 0) throw e;
      /* sinon : modèle suivant */
    }
  }
  throw lastErr;
}
