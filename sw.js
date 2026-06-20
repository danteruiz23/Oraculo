// Oraculo · Service Worker
const CACHE = 'oraculo-v2';
const ASSETS = ['./', './index.html', './manifest.json'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  // No cachear llamadas a Supabase ni al SDK (siempre red)
  if (url.host.includes('supabase') || url.host.includes('jsdelivr')) {
    e.respondWith(fetch(e.request).catch(() => caches.match(e.request)));
    return;
  }
  // App shell: cache-first
  e.respondWith(caches.match(e.request).then(r => r || fetch(e.request)));
});
