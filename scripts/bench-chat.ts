/**
 * Bench latence chatbot : mesure TTFT (premier token) + temps total
 * avec le prompt système réel, pour différents modèles.
 * Usage : OPENROUTER_API_KEY=... bun scripts/bench-chat.ts
 */
import { buildSystemPrompt } from "../src/lib/chatbot/prompt";

const KEY = process.env.OPENROUTER_API_KEY ?? "";
const URL = "https://openrouter.ai/api/v1/chat/completions";

async function bench(model: string, system: string, question: string) {
  const t0 = Date.now();
  let ttft = -1;
  let total = 0;
  let tokens = 0;
  try {
    const res = await fetch(URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://einsof.vercel.app",
        "X-Title": "EINSOF bench",
      },
      body: JSON.stringify({
        model,
        stream: true,
        temperature: 0.6,
        max_tokens: 700,
        messages: [
          { role: "system", content: system },
          { role: "user", content: question },
        ],
      }),
    });
    if (!res.ok || !res.body) {
      console.log(`${model} → HTTP ${res.status} ${(await res.text()).slice(0, 120)}`);
      return;
    }
    const reader = res.body.getReader();
    const dec = new TextDecoder();
    let buf = "";
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buf += dec.decode(value, { stream: true });
      const parts = buf.split("\n");
      buf = parts.pop() ?? "";
      for (const line of parts) {
        const s = line.trim();
        if (!s.startsWith("data:")) continue;
        const p = s.slice(5).trim();
        if (p === "[DONE]") continue;
        try {
          const j = JSON.parse(p);
          const d = j.choices?.[0]?.delta?.content;
          if (d) {
            if (ttft < 0) ttft = Date.now() - t0;
            tokens++;
            total = Date.now() - t0;
          }
        } catch { /* ignore */ }
      }
    }
    console.log(
      `${model.padEnd(34)} prompt≈${Math.round(system.length / 3.6)}tok  TTFT=${ttft}ms  total=${total}ms  chunks=${tokens}`
    );
  } catch (e) {
    console.log(`${model} → ERROR ${e}`);
  }
}

const Q1 = "Combien coûte un site web vitrine ?";
const Q2 = "Vous gérez une pharmacie ?";

const sys = buildSystemPrompt("fr", "/", Q1);
console.log(`System prompt : ${sys.length} chars ≈ ${Math.round(sys.length / 3.6)} tokens`);

/* Audit F-21 : la chaîne complète par défaut est couverte par le bench
   (llama-3.3-70b et mistral-small étaient absents alors que le commentaire
   d'openrouter.ts prétendait l'inverse). */
const MODELS = [
  "meta-llama/llama-3.3-70b-instruct",
  "mistralai/mistral-small-24b-instruct-2501",
  "deepseek/deepseek-v4-flash",
  "~z-ai/glm-flash-latest",
];

for (const m of MODELS) {
  await bench(m, sys, Q1);
}
console.log("--- 2e passe (connexion chaude) ---");
for (const m of MODELS) {
  await bench(m, sys, Q2);
}
