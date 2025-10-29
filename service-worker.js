// service-worker.js — v3 (navigate: network-first, assets: stale-while-revalidate)
const CACHE_NAME = "physiostroop-v3";
const ASSETS = [
  "./",
  "./index.html",
  "./css/style.css",
  "./js/app.js",
  "./manifest.webmanifest",
  "./icons/icon-192.png",
  "./icons/icon-512.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const req = event.request;

  // 🔹 Navigations (HTML, ex: index.html?lang=en) → Network-first
  if (req.mode === "navigate") {
    event.respondWith(
      fetch(req)
        .then((res) => {
          if (res && res.ok) {
            const copy = res.clone();
            caches.open(CACHE_NAME).then((c) => c.put(req, copy));
          }
          return res;
        })
        .catch(async () => {
          // Offline → on essaie la requête exacte, sinon on retombe sur index.html
          const cached = await caches.match(req);
          return cached || caches.match("./index.html", { ignoreSearch: true });
        })
    );
    return;
  }

  // 🔹 Assets (CSS/JS/icônes/manifest) → Stale-while-revalidate
  event.respondWith((async () => {
    const cache = await caches.open(CACHE_NAME);
    const cached = await cache.match(req);
    const networkPromise = fetch(req)
      .then((res) => {
        if (res && res.ok) cache.put(req, res.clone());
        return res;
      })
      .catch(() => null);

    // Si on a le cache, on sert tout de suite, et on met à jour en arrière-plan
    if (cached) return cached;

    // Sinon on attend le réseau (ou rien si offline)
    const networkRes = await networkPromise;
    return networkRes || new Response("", { status: 504, statusText: "Gateway Timeout" });
  })());
});
