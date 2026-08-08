const CACHE_NAME = 'healthbridge-v1.0.0';
const STATIC_ASSETS = [
  '/',
  '/manifest.json',
  '/data/emergency-corpus.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  '/icons/maskable-512x512.png',
  '/icons/apple-touch-icon.png',
  '/favicon.ico',
];

// Install Event - Pre-cache App Shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    }).then(() => self.skipWaiting())
  );
});

// Activate Event - Clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch Event - Network First for HTML/APIs, Stale-While-Revalidate for Static Assets
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // NEVER CACHE sensitive medical API routes or authentication endpoints
  if (
    url.pathname.startsWith('/api/') ||
    url.pathname.startsWith('/dashboard/assistant') ||
    url.pathname.includes('/auth/')
  ) {
    event.respondWith(fetch(event.request));
    return;
  }

  // Network First for HTML navigation pages with offline fallback
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(async () => {
        const cache = await caches.open(CACHE_NAME);
        const cachedResponse = await cache.match(event.request);
        if (cachedResponse) return cachedResponse;

        // Return offline HTML fallback
        return new Response(
          `<!DOCTYPE html>
          <html lang="en">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>HealthBridge — Offline</title>
            <style>
              body { font-family: system-ui, -apple-system, sans-serif; background: #2F3273; color: white; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; padding: 24px; text-align: center; }
              .card { background: rgba(255,255,255,0.1); backdrop-filter: blur(12px); border-radius: 24px; padding: 32px; max-width: 420px; border: 1px solid rgba(255,255,255,0.2); }
              h1 { font-size: 24px; font-weight: 900; margin-bottom: 12px; }
              p { font-size: 14px; opacity: 0.85; line-height: 1.5; margin-bottom: 24px; }
              .btn { background: #F9DF77; color: #2F3273; font-weight: 800; padding: 14px 24px; border-radius: 14px; text-decoration: none; display: inline-block; }
              .sos { margin-top: 16px; display: block; background: #DC2626; color: white; font-weight: 800; padding: 12px; border-radius: 14px; text-decoration: none; }
            </style>
          </head>
          <body>
            <div class="card">
              <h1>HealthBridge is Offline</h1>
              <p>Some online features (AI Assistant, cloud sync) are temporarily unavailable. Emergency SOS dialing remains available via device phone dialer.</p>
              <a href="tel:112" class="sos">Call 112 / 108 Emergency Dialer</a>
              <br><br>
              <a href="/dashboard" class="btn">Try Reconnecting</a>
            </div>
          </body>
          </html>`,
          { headers: { 'Content-Type': 'text/html' } }
        );
      })
    );
    return;
  }

  // Stale-While-Revalidate for static assets
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      const fetchPromise = fetch(event.request).then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseClone));
        }
        return networkResponse;
      }).catch(() => cachedResponse);

      return cachedResponse || fetchPromise;
    })
  );
});
