/**
 * Client OpenRouter — moteur conversationnel du chatbot (clé fournie par
 * le client). Le modèle répond en streaming SSE ; les tokens sont relayés
 * au navigateur en temps réel. Zéro réponse pré-écrite : tout part du
 * modèle, nourri par le contexte du site (voir site-index.ts).
 *
 * Fallback : si la clé est absente ou si l'appel échoue, l'API route
 * bascule sur le fournisseur z-ai (voir message/route.ts) — le chatbot
 * ne meurt jamais.
 */

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";

export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export function isOpenRouterConfigured(): boolean {
  return Boolean(process.env.OPENROUTER_API_KEY);
}

export function openRouterModel(): string {
  return process.env.OPENROUTER_MODEL ?? "openai/gpt-4o-mini";
}

/**
 * Appelle OpenRouter en streaming et yield les deltas de texte.
 * Jette une erreur si la clé est absente ou si l'API répond une erreur —
 * l'appelant décide du repli.
 */
export async function* streamOpenRouter(
  messages: ChatMessage[],
  opts: { temperature?: number; maxTokens?: number; signal?: AbortSignal } = {}
): AsyncGenerator<string> {
  const key = process.env.OPENROUTER_API_KEY;
  if (!key) throw new Error("openrouter_not_configured");

  const res = await fetch(OPENROUTER_URL, {
    method: "POST",
    signal: opts.signal,
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      /* OpenRouter recommande ces en-têtes d'attribution */
      "HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL ?? "https://einsof.vercel.app",
      "X-Title": "EINSOF — Assistant commercial",
    },
    body: JSON.stringify({
      model: openRouterModel(),
      messages,
      stream: true,
      temperature: opts.temperature ?? 0.6,
      max_tokens: opts.maxTokens ?? 700,
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
