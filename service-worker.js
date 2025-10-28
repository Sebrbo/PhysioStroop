// service-worker.js — v2 (network-first pour HTML/navigations)
const CACHE_NAME = "physiostroop-v2";
const FILES_TO_CACHE = [
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
    caches.open(CACHE_NAME).then((cache) => cache.addAll(FILES_TO_CACHE))
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

  // 🔹 Network-first pour les navigations (HTML, y compris ?lang=fr|en)
  if (req.mode === "navigate") {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE_NAME).then((c) => c.put(req, copy));
          return res;
        })
        .catch(() =>
          // si offline, on retombe sur ce qu’on a en cache
          caches.match(req).then((r) => r || caches.match("./index.html"))
        )
    );
    return;
  }

  // 🔹 Cache-first pour les assets (CSS/JS/icônes/manifest)
  event.respondWith(
    caches.match(req).then((cached) => cached || fetch(req))
  );
});
