const CACHE_NAME = 'custodian-dashboard-v1';
const urlsToCache = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/custodian-dashboard',
  '/custodian-payment-management',
  '/custodian-room-management',
  '/custodian-students',
  '/custodian-analytics',
  '/custodian-maintenance'
];

// Install event
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
});

// Fetch event
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version or fetch from network
        return response || fetch(event.request);
      }
    )
  );
});

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  }
});

function doBackgroundSync() {
  // Sync offline actions when connection is restored
  return fetch('/api/sync-offline-actions', {
    method: 'POST',
    body: JSON.stringify(getOfflineActions()),
    headers: {
      'Content-Type': 'application/json'
    }
  });
}

function getOfflineActions() {
  // Get stored offline actions from IndexedDB
  return [];
}