// Service Worker pour Musculs Pro
// Version 2.0

const CACHE_NAME = 'musculs-v2.0';
const urlsToCache = [
  '/musculs/',
  '/musculs/index.html',
  '/musculs/styles.css',
  '/musculs/app.js',
  '/musculs/data.js',
  '/musculs/manifest.json'
];

// Installation du Service Worker
self.addEventListener('install', event => {
  console.log('[SW] Installation...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[SW] Mise en cache des fichiers');
        return cache.addAll(urlsToCache);
      })
      .then(() => self.skipWaiting())
  );
});

// Activation du Service Worker
self.addEventListener('activate', event => {
  console.log('[SW] Activation...');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('[SW] Suppression ancien cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Stratégie de cache : Network First, fallback to Cache
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request)
      .then(response => {
        // Si la requête réussit, mettre en cache et retourner
        if (response && response.status === 200) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseClone);
          });
        }
        return response;
      })
      .catch(() => {
        // Si offline, chercher dans le cache
        return caches.match(event.request).then(response => {
          if (response) {
            return response;
          }
          // Page par défaut si pas dans le cache
          if (event.request.mode === 'navigate') {
            return caches.match('/musculs/index.html');
          }
        });
      })
  );
});

// Gestion des notifications push (optionnel, pour l'avenir)
self.addEventListener('push', event => {
  const options = {
    body: event.data ? event.data.text() : 'Nouvelle notification',
    icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">💪</text></svg>',
    badge: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">💪</text></svg>',
    vibrate: [200, 100, 200]
  };

  event.waitUntil(
    self.registration.showNotification('Musculs Pro', options)
  );
});

// Click sur notification
self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow('/musculs/')
  );
});

console.log('[SW] Service Worker chargé');
