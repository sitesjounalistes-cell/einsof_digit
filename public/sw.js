/* Service worker minimal — pages en réseau d'abord, images en cache d'abord.
   Jamais /api ni /admin. (spec §28)

   INTÉGRITÉ D'HYDRATATION (fix « radix-_R_… mismatch ») :
   1. Chaque navigation est mise en cache SO SON PROPRE URL (l'ancien code
      faisait caches.put("/", copy) pour TOUTES les pages → en cas d'échec
      réseau passager (redémarrage du serveur de dev, hoquet de la
      passerelle), le SW répondait à /tarifs avec le HTML D'UNE AUTRE PAGE
      (souvent l'accueil, périmé) → le JS neuf hydratait un HTML d'un
      autre arbre → tous les ids Radix (Tabs/Accordion) divergeaient
      systématiquement.
   2. Le repli hors ligne ne sert une page QUE SI l'URL demandée a déjà
      été visitée et mise en cache (ou l'accueil pour la racine).
   3. Seules les réponses HTML complètes (200, text/html) sont mises en
      cache — jamais une erreur ou une réponse partielle de stream. */
const CACHE = "einsof-v2";
const PRECACHE = ["/icon.svg", "/images/hero-obsidienne.png"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(PRECACHE)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

const isImageAsset = (pathname) =>
  pathname.startsWith("/images/") ||
  pathname.startsWith("/icons/") ||
  pathname === "/icon.svg" ||
  pathname === "/logo.svg";

self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);
  if (event.request.method !== "GET") return;
  if (url.origin !== self.location.origin) return;
  if (url.pathname.startsWith("/api") || url.pathname.startsWith("/admin")) return;

  // Images & icônes : cache-first
  if (isImageAsset(url.pathname)) {
    event.respondWith(
      caches.match(event.request).then(
        (hit) =>
          hit ||
          fetch(event.request).then((res) => {
            if (res.ok) {
              const copy = res.clone();
              caches.open(CACHE).then((c) => c.put(event.request, copy));
            }
            return res;
          })
      )
    );
    return;
  }

  // Navigations : réseau d'abord ; cache SO URL PROPRE en repli hors ligne.
  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request)
        .then((res) => {
          const type = res.headers.get("content-type") ?? "";
          if (res.ok && type.includes("text/html")) {
            const copy = res.clone();
            caches.open(CACHE).then((c) => c.put(event.request, copy));
          }
          return res;
        })
        .catch(() =>
          caches
            .match(event.request)
            .then((hit) => hit || (url.pathname === "/" ? caches.match("/") : null))
            .then((hit) => hit || Response.error())
        )
    );
  }
});

/* ── Notifications push (spécification §6/§14/§28) ──────────── */

self.addEventListener("push", (event) => {
  let payload = { title: "", body: "" };
  try {
    if (event.data) payload = event.data.json();
  } catch {
    payload = { title: "", body: event.data ? event.data.text() : "" };
  }
  event.waitUntil(
    self.registration.showNotification(payload.title || "EINSOF", {
      body: payload.body || "",
      icon: "/icons/icon-192.png",
      badge: "/icons/icon-192.png",
      tag: "einsof-push",
    })
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((list) => {
      for (const client of list) {
        if ("focus" in client) return client.focus();
      }
      return self.clients.openWindow("/");
    })
  );
});
