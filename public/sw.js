/* Service worker minimal — pages en réseau d'abord, images en cache d'abord.
   Jamais /api ni /admin. (spec §28) */
const CACHE = "einsof-v1";
const PRECACHE = ["/", "/icon.svg", "/images/hero-obsidienne.png"];

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

self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);
  if (event.request.method !== "GET") return;
  if (url.pathname.startsWith("/api") || url.pathname.startsWith("/admin")) return;

  // Images & icônes : cache-first
  if (url.pathname.startsWith("/images/") || url.pathname.startsWith("/icons/") || url.pathname === "/icon.svg") {
    event.respondWith(
      caches.match(event.request).then(
        (hit) =>
          hit ||
          fetch(event.request).then((res) => {
            const copy = res.clone();
            caches.open(CACHE).then((c) => c.put(event.request, copy));
            return res;
          })
      )
    );
    return;
  }

  // Navigations : network-first avec repli cache (hors ligne élégant)
  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put("/", copy));
          return res;
        })
        .catch(() => caches.match("/").then((hit) => hit || Response.error()))
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
