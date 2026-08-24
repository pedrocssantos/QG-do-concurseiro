// ==========================================================================
// QG DO CONCURSEIRO - SERVICE WORKER (OFFLINE PWA)
// ==========================================================================

const CACHE_NAME = "qg-concurseiro-v1.1";
const STATIC_ASSETS = [
  "./",
  "./index.html",
  "./manifest.json",
  "./css/style.css",
  "./css/components.css",
  "./css/dashboard.css",
  "./css/edital.css",
  "./css/flashcards.css",
  "./css/pomodoro.css",
  "./css/questions.css",
  "./css/landing.css",
  "./js/data.js",
  "./js/supabase.js",
  "./js/store.js",
  "./js/analytics.js",
  "./js/pomodoro.js",
  "./js/questions.js",
  "./js/flashcards.js",
  "./js/edital.js",
  "./js/ciclo.js",
  "./js/errors.js",
  "./js/gamification.js",
  "./js/dashboard.js",
  "./js/app.js",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/favicon-32.png",
  "./icons/icon.svg"
];

// Instalação: Cache dos arquivos estáticos essenciais
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    }).then(() => self.skipWaiting())
  );
});

// Ativação: Limpeza de caches obsoletos
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Interceptação de requisições: Estratégia Stale-While-Revalidate para assets locais
self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);

  // Ignora requisições de esquemas não suportados (ex: chrome-extension)
  if (!event.request.url.startsWith("http")) return;

  // Requisições para APIs externas (Supabase, Stripe, CDNs externas): Network-First
  if (url.origin !== self.location.origin) {
    event.respondWith(
      fetch(event.request)
        .catch(() => caches.match(event.request))
    );
    return;
  }

  // Assets locais do aplicativo: Cache-First com atualização em background (Stale-While-Revalidate)
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      const fetchPromise = fetch(event.request).then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200 && networkResponse.type === "basic") {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      }).catch(() => {
        // Se offline e for navegação de página, retorna o index.html em cache
        if (event.request.mode === "navigate") {
          return caches.match("./index.html");
        }
      });

      return cachedResponse || fetchPromise;
    })
  );
});
