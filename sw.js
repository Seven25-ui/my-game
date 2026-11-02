
const C = 'pawn-hunt-v7';

const F = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

// Install and cache app files
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(C).then(cache => cache.addAll(F))
  );

  self.skipWaiting();
});

// Activate and remove old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => key !== C)
          .map(key => caches.delete(key))
      )
    )
  );

  self.clients.claim();
});

// Fetch with offline cache support
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then(cached => {
      return cached || fetch(event.request);
    })
  );
});
