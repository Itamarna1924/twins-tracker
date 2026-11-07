// Service worker: offline app shell + Firebase Cloud Messaging background notifications.
importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js',
              'https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js',
              './config-sw.js');
firebase.initializeApp(self.FIREBASE_CONFIG);
firebase.messaging(); // notification payloads are shown automatically while the app is in the background

const CACHE='tt-v6';
const SHELL = ['./', './index.html', './style.css', './app.js', './drops.js', './drops.css', './boot.js', './config.js', './manifest.webmanifest', './icons/drops-192.png', './icons/drops-512.png'];
const FB = 'https://www.gstatic.com/firebasejs/10.12.2/';

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const req = e.request; if (req.method !== 'GET') return;
  const url = new URL(req.url);
  const sameOrigin = url.origin === self.location.origin;
  const cacheFirst = url.href.startsWith(FB) || url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com' || url.href.startsWith('https://cdnjs.cloudflare.com/ajax/libs/gsap/');
  if (!sameOrigin && !cacheFirst) return; // Firestore, Auth and other APIs go straight to the network
  if (cacheFirst) {
    e.respondWith(caches.match(req).then(hit => hit || fetch(req).then(res => { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)); return res; })));
    return;
  }
  // App files: network first so updates arrive, cache when offline.
  e.respondWith(fetch(req).then(res => { if (res.ok) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)); } return res; })
    .catch(() => caches.match(req).then(hit => hit || caches.match('./index.html'))));
});
self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(cs => {
    for (const c of cs) { if ('focus' in c) return c.focus(); }
    return self.clients.openWindow('./');
  }));
});
