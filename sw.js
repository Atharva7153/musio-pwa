const CACHE_NAME = 'musio-v1.1';
const urlsToCache = [
  './',
  './index.html',
  './app.js',
  './darkmode.css',
  './song.json',
  './play.svg',
  './next.svg',
  './prev.svg',
  './icon.svg'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(urlsToCache);
      })
  );
  // Activate worker immediately
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            // Delete old caches
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      // Tell clients about the update
      self.clients.matchAll().then(clients => {
        clients.forEach(client => {
          client.postMessage({ type: 'UPDATE_AVAILABLE' });
        });
      });
    })
  );
  // Take control of all clients immediately
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Always try network first for HTML files
        if (event.request.mode === 'navigate') {
          return fetch(event.request)
            .catch(() => response); // Fallback to cache if offline
        }
        
        if (response) {
          // Return cached response
          return response;
        }

        return fetch(event.request)
          .then((response) => {
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            const responseToCache = response.clone();
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });

            return response;
          });
      })
  );
}); 