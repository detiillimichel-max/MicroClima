const CACHE_NAME = 'microclima-v9';

const STATIC_ASSETS = [
  './', './index.html', './css/style.css', './manifest.json',
  './icon-192.png', './icon-512.png',
  './js/utils/formatters.js', './js/utils/cache.js', './js/utils/location.js',
  './js/data/cities.js', './js/api/weatherService.js',
  './js/components/currentCard.js', './js/components/hourlyForecast.js',
  './js/components/dailyForecast.js', './js/components/locationPicker.js', './js/app.js'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(STATIC_ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  if (url.hostname.includes('open-meteo.com') || url.hostname.includes('bigdatacloud.net')) {
    event.respondWith(
      fetch(event.request).catch(() => new Response(
        JSON.stringify({ error: 'Sem conexão com a internet.' }),
        { status: 503, headers: { 'Content-Type': 'application/json' } }
      ))
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then(cached => cached || fetch(event.request).then(response => {
      if (response && response.status === 200 && response.type === 'basic') {
        const copy = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy));
      }
      return response;
    }))
  );
});
