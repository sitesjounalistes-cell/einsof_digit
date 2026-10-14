"use client";

/**
 * Abonnement aux notifications push côté navigateur (spécification §6/§28).
 * Retourne un état que l'appelant traduit via i18n.
 */
export type PushStatus = "enabled" | "denied" | "unsupported" | "error";

export async function subscribePush(lang: string): Promise<PushStatus> {
  if (
    typeof window === "undefined" ||
    !("serviceWorker" in navigator) ||
    !("PushManager" in window) ||
    typeof Notification === "undefined"
  ) {
    return "unsupported";
  }
  try {
    const permission = await Notification.requestPermission();
    if (permission !== "granted") return "denied";

    const reg = await navigator.serviceWorker.ready;
    const keyRes = await fetch("/api/push/key");
    if (!keyRes.ok) return "error";
    const keyJson = (await keyRes.json()) as { ok: boolean; data?: { publicKey?: string } };
    const publicKey = keyJson?.data?.publicKey;
    if (!keyJson.ok || !publicKey) return "error";

    const sub = await reg.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(publicKey),
    });
    const json = sub.toJSON() as {
      endpoint?: string;
      keys?: { p256dh?: string; auth?: string };
    };
    const endpoint = json.endpoint ?? "";
    const p256dh = json.keys?.p256dh ?? "";
    const auth = json.keys?.auth ?? "";
    if (!endpoint || !p256dh || !auth) return "error";

    const res = await fetch("/api/push/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ endpoint, keys: { p256dh, auth }, locale: lang }),
    });
    return res.ok ? "enabled" : "error";
  } catch {
    return "error";
  }
}

function urlBase64ToUint8Array(base64String: string): Uint8Array<ArrayBuffer> {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = atob(base64);
  const buf = new ArrayBuffer(raw.length);
  const out = new Uint8Array(buf);
  for (let i = 0; i < raw.length; i += 1) {
    out[i] = raw.charCodeAt(i);
  }
  return out;
}
