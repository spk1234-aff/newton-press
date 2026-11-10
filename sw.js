/* Newton Press offline helper */
const APP = 'np-app-v1', LIB = 'np-lib-v1';
const LIB_HOSTS = ['cdn.jsdelivr.net', 'cdnjs.cloudflare.com', 'unpkg.com', 'fonts.googleapis.com', 'fonts.gstatic.com', 'www.gstatic.com'];
self.addEventListener('install', e => { self.skipWaiting(); e.waitUntil(caches.open(APP).then(c => c.add(new Request('./', { cache: 'reload' })).catch(() => { }))); });
self.addEventListener('activate', e => { e.waitUntil((async () => { const ks = await caches.keys(); await Promise.all(ks.filter(k => k !== APP && k !== LIB).map(k => caches.delete(k))); await self.clients.claim(); })()); });
const timeout = (p, ms) => Promise.race([p, new Promise((_, no) => setTimeout(() => no(new Error('timeout')), ms))]);
self.addEventListener('fetch', e => {
  const req = e.request; if (req.method !== 'GET') return;
  const u = new URL(req.url);
  if (req.mode === 'navigate' || (u.origin === location.origin && /\/(index\.html)?$/.test(u.pathname))) {
    e.respondWith((async () => {
      const c = await caches.open(APP);
      try { const r = await timeout(fetch(req, { cache: 'no-store' }), 8000); if (r && r.ok) c.put('./', r.clone()); return r; }
      catch (err) { return (await c.match('./')) || (await c.match(req, { ignoreSearch: true })) || new Response('Offline', { status: 503, headers: { 'Content-Type': 'text/plain; charset=utf-8' } }); }
    })());
    return;
  }
  if (LIB_HOSTS.includes(u.hostname) && !/firebasejs\/.*\/(auth|init)\.json/.test(u.pathname) && !/__\/auth/.test(u.pathname)) {
    e.respondWith((async () => {
      const c = await caches.open(LIB); const hit = await c.match(req); if (hit) return hit;
      const r = await fetch(req); if (r && (r.ok || r.type === 'opaque')) c.put(req, r.clone()); return r;
    })());
  }
});
