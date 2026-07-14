// Cámbiale el nombre UNA ÚLTIMA VEZ para que el celular borre el viejo e instale este nuevo
const CACHE_NAME = 'pomodoro-amor-v-FINAL.1'; 
const urlsToCache = [
  './',
  './index.html',
  './estilos.css',
  './manifest.json'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Caché abierto correctamente.');
        return cache.addAll(urlsToCache);
      })
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Borrando caché antiguo viejo:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// =======================================================
// EL NUEVO CEREBRO: RED PRIMERO (Network First)
// =======================================================
self.addEventListener('fetch', event => {
  event.respondWith(
    // 1. Intenta buscar la versión más nueva en internet (GitHub)
    fetch(event.request)
      .then(response => {
        // Si hay internet y lo encuentra, guarda una copia fresca en el caché
        const responseClone = response.clone();
        caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, responseClone);
        });
        return response; // Entrega la versión nueva a la pantalla
      })
      .catch(() => {
        // 2. Si falla (estás en modo avión o sin internet), usa la copia del caché
        return caches.match(event.request);
      })
  );
});