const CACHE_NAME = 'bloom-cache-v1';
const urlsToCache = [
  '/',
  '/offline.html',
  '/BloomLogo2.png',
  '/manifest.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          return response;
        }
        return fetch(event.request)
          .catch(() => caches.match('/offline.html'));
      })
  );
});

// Add notification functionality
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'hourly-notification') {
    event.waitUntil(sendHourlyNotification());
  }
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow('/')
  );
});

async function sendHourlyNotification() {
  const notificationOptions = {
    body: "Don't forget to check out our latest skincare products!",
    icon: '/BloomLogo2.png',
    badge: '/BloomLogo2.png',
    vibrate: [100, 50, 100],
    data: {
      url: '/'
    }
  };

  return self.registration.showNotification('Bloom Skincare', notificationOptions);
} 