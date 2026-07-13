const CACHE_NAME = 'amor-app-v5.00'; // Puedes dejar esta versión y casi no tendrás que cambiarla más

// Aquí ponemos todos los archivos clave para que funcionen sin internet
const urlsToCache = [
  './',
  './index.html',
  './estilos.css',
  './candado.js',
  './arbol.html',
  './arbol.css',
  './arbol.js',
  './propuesta.html',
  './propuesta.js',
  './propuesta.css',
  './pomodoro.html',
  './calculadora.html',
  './lector_qr.html',
  './manifest.json'
];

// 1. INSTALACIÓN
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Caché abierto y guardando archivos base...');
        return cache.addAll(urlsToCache);
      })
      .then(() => self.skipWaiting())
  );
});

// 2. ACTIVACIÓN (Limpieza de cachés viejos)
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Borrando caché antiguo:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// 3. ESTRATEGIA "NETWORK FIRST" (Red Primero, Caché como respaldo)
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request)
      .then(networkResponse => {
        // Si hay conexión y la petición es exitosa, guardamos una copia fresca en el caché
        return caches.open(CACHE_NAME).then(cache => {
          // Solo guardamos peticiones HTTP/HTTPS (evita errores con extensiones del navegador)
          if (event.request.url.startsWith('http')) {
            cache.put(event.request, networkResponse.clone());
          }
          return networkResponse;
        });
      })
      .catch(() => {
        // Si FALLA la conexión (el usuario está OFFLINE), devolvemos lo que hay en el caché
        return caches.match(event.request);
      })
  );
});