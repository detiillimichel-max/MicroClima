const CACHE_NAME = 'microclima-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/css/style.css',
  '/manifest.json',
  '/js/utils/formatters.js',
  '/js/utils/location.js',
  '/js/api/weatherService.js',
  '/js/components/currentCard.js',
  '/js/components/hourlyForecast.js',
  '/js/components/dailyForecast.js'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
