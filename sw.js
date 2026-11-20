// Service Worker: кешує файли сайту, щоб він працював офлайн
const CACHE_NAME = 'notes-v4';

const FILES_TO_CACHE = [
  './',
  './index.html',
  './offline.html',
  './css/style.css',
  './js/db.js',
  './js/app.js',
  './manifest.json',
  './icons/icon-192.png',
  './icons/icon-512.png'
];

// 1. Встановлення: зберігаємо файли в кеш
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(FILES_TO_CACHE))
  );
  self.skipWaiting();
});

// 2. Активація: видаляємо старі версії кешу
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))
    )
  );
  self.clients.claim();
});

// 3. Запити: спершу шукаємо в кеші (Cache First), інакше — мережа
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;

      return fetch(event.request).catch(() => {
        // Якщо сторінки немає в кеші і немає мережі — показуємо offline.html
        if (event.request.mode === 'navigate') {
          return caches.match('./offline.html');
        }
      });
    })
  );
});
