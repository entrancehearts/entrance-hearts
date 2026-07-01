const CACHE_NAME = 'entrancehearts-v7';
const STATIC_ASSETS = [
  './',
  './index.html',
  './browse.html',
  './chat.html',
  './confessions.html',
  './study.html',
  './profile.html',
  './help.html',
  './login.html',
  './signup.html',
  './timer.html',
  './ai-match.html',
  './admin.html',
  './verify.html',
  './update-password.html',
  './privacy.html',
  './terms.html',
  './offline.html',
  './not-found.html',
  './who-liked-me.html',
  './onboarding.html',
  './sounds.js',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache =>
      Promise.allSettled(STATIC_ASSETS.map(url => cache.add(url).catch(() => {})))
    )
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);

  // Skip non-same-origin requests
  if (url.origin !== location.origin && !url.hostname.includes(location.hostname)) {
    // For Supabase API calls: network first, cache fallback
    if (url.href.includes('supabase.co')) {
      event.respondWith(
        fetch(event.request).catch(() => caches.match(event.request))
      );
    }
    return;
  }

  // For HTML navigation requests: network first, offline fallback
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          if (response && response.status === 200) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
          }
          return response;
        })
        .catch(() =>
          caches.match(event.request).then(cached =>
            cached || caches.match('./offline.html')
          )
        )
    );
    return;
  }

  // For other assets: network first, cache fallback
  event.respondWith(
    fetch(event.request)
      .then(response => {
        if (response && response.status === 200) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        }
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});

self.addEventListener('push', event => {
  let data = {};
  try { data = event.data ? event.data.json() : {}; } catch {}

  const options = {
    body:     data.body     || 'You have a new notification!',
    icon:     './icon-192.png',
    badge:    './icon-192.png',
    vibrate:  [200, 100, 200],
    tag:      data.tag      || 'eh-notification',
    renotify: true,
    data:     { url: data.url || './' },
    actions:  [
      { action: 'open',    title: 'Open App' },
      { action: 'dismiss', title: 'Dismiss'  }
    ]
  };

  event.waitUntil(
    self.registration.showNotification(data.title || 'EntranceHearts 💕', options)
  );
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  if (event.action === 'dismiss') return;

  const targetUrl = event.notification.data?.url || './';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(windowClients => {
      for (const client of windowClients) {
        if ('focus' in client) {
          client.navigate(targetUrl);
          return client.focus();
        }
      }
      return clients.openWindow(targetUrl);
    })
  );
});
