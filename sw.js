const CACHE_NAME = 'microclima-v2';

// Arquivos estáticos para salvar em cache local
const STATIC_ASSETS = [
  './',
  './index.html',
  './css/style.css',
  './manifest.json',
  './assets/icons/icon.svg',
  './js/utils/formatters.js',
  './js/utils/location.js',
  './js/api/weatherService.js',
  './js/components/currentCard.js',
  './js/components/hourlyForecast.js',
  './js/components/dailyForecast.js',
  './js/app.js'
];

// Instalação: Salva assets no cache
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    }).then(() => self.skipWaiting())
  );
});

// Ativação: Limpa caches antigos de versões anteriores
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    }).then(() => self.clients.claim())
  );
});

// Interceptador de Requisições
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // APIs Externas (Open-Meteo / BigDataCloud): SEMPRE buscam na rede para máxima precisão
  if (url.hostname.includes('open-meteo.com') || url.hostname.includes('bigdatacloud.net')) {
    event.respondWith(
      fetch(event.request).catch(() => {
        return new Response(JSON.stringify({ error: 'Você está sem conexão com a internet.' }), {
          headers: { 'Content-Type': 'application/json' }
        });
      })
    );
    return;
  }

  // Arquivos locais do app: Busca no cache primeiro (carregamento ultra-rápido)
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request).then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      });
    })
  );
});
