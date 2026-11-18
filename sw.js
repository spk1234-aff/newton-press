/* Newton Press offline helper */
const APP = 'np-app-v2', LIB = 'np-lib-v1', AST = 'np-ast-v1';
// ไฟล์ของแอป (สร้างอัตโนมัติจากตัวแยกไฟล์) — เก็บไว้ในเครื่องตั้งแต่ติดตั้ง ใช้ออฟไลน์บน iPad ได้
const FILES = ['vendor/katex.min.css', 'css/app.css', 'vendor/katex.min.js', 'js/logos.js', 'js/01-core.js', 'js/02-equation.js', 'js/03-format.js', 'js/04-math-tools.js', 'js/05-figlib-1.js', 'js/06-figlib-2.js', 'js/07-figlib-3.js', 'js/08-exam.js', 'js/09-select-draw.js', 'js/10-lesson-quiz.js', 'js/11-forms-flow.js', 'js/12-tables.js', 'js/13-export.js', 'js/14-drive.js', 'js/15-pages-print.js', 'js/16-templates-sign.js', 'js/17-table-ui.js', 'js/18-ui-more.js', 'js/19-templates-more.js', 'js/20-templates-contest.js', 'js/21-workbook.js', 'js/22-physics-board.js', 'js/99-toc-patch.js', 'fonts/KaTeX_AMS-Regular.woff2', 'fonts/KaTeX_Caligraphic-Bold.woff2', 'fonts/KaTeX_Caligraphic-Regular.woff2', 'fonts/KaTeX_Fraktur-Bold.woff2', 'fonts/KaTeX_Fraktur-Regular.woff2', 'fonts/KaTeX_Main-Bold.woff2', 'fonts/KaTeX_Main-BoldItalic.woff2', 'fonts/KaTeX_Main-Italic.woff2', 'fonts/KaTeX_Main-Regular.woff2', 'fonts/KaTeX_Math-BoldItalic.woff2', 'fonts/KaTeX_Math-Italic.woff2', 'fonts/KaTeX_SansSerif-Bold.woff2', 'fonts/KaTeX_SansSerif-Italic.woff2', 'fonts/KaTeX_SansSerif-Regular.woff2', 'fonts/KaTeX_Script-Regular.woff2', 'fonts/KaTeX_Size1-Regular.woff2', 'fonts/KaTeX_Size2-Regular.woff2', 'fonts/KaTeX_Size3-Regular.woff2', 'fonts/KaTeX_Size4-Regular.woff2', 'fonts/KaTeX_Typewriter-Regular.woff2', 'fonts/THSarabunNew-Regular.ttf', 'fonts/THSarabunNew-Bold.ttf', 'img/logo.png', 'img/logo-round.webp', 'img/logo-winged.webp', 'img/logo-school.webp', 'img/garuda.png', 'img/icon-64.png', 'img/apple-touch-inline.png'];
const LIB_HOSTS = ['cdn.jsdelivr.net', 'cdnjs.cloudflare.com', 'unpkg.com', 'fonts.googleapis.com', 'fonts.gstatic.com', 'www.gstatic.com'];
self.addEventListener('install', e => {
  self.skipWaiting();
  e.waitUntil((async () => {
    await caches.open(APP).then(c => c.add(new Request('./', { cache: 'reload' }))).catch(() => { });
    const c = await caches.open(AST);
    await Promise.all(FILES.map(f => c.add(new Request(f, { cache: 'reload' })).catch(() => { })));
  })());
});
self.addEventListener('activate', e => { e.waitUntil((async () => { const ks = await caches.keys(); await Promise.all(ks.filter(k => k !== APP && k !== LIB && k !== AST).map(k => caches.delete(k))); await self.clients.claim(); })()); });
const timeout = (p, ms) => Promise.race([p, new Promise((_, no) => setTimeout(() => no(new Error('timeout')), ms))]);
const ASSET_RE = /\/(js|css|vendor|fonts|img)\/[^/]+$/;
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
  // ไฟล์ย่อยของแอป: ชื่อมี ?v=เลขรุ่น → ใช้ของในเครื่องถ้ามีรุ่นนี้แล้ว ไม่มีก็โหลดใหม่ ออฟไลน์ใช้รุ่นล่าสุดที่เก็บไว้
  if (u.origin === location.origin && ASSET_RE.test(u.pathname)) {
    e.respondWith((async () => {
      const c = await caches.open(AST);
      const hit = await c.match(req); if (hit) return hit;
      const old = await c.match(req, { ignoreSearch: true });
      try {
        const r = await (old ? timeout(fetch(req), 15000) : fetch(req));
        if (r && r.ok) {
          const keep = r.clone();
          e.waitUntil((async () => { for (const k of await c.keys()) { const ku = new URL(k.url); if (ku.pathname === u.pathname && ku.search !== u.search) await c.delete(k); } await c.put(req, keep); })());
        }
        return r;
      } catch (err) { if (old) return old; throw err; }
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
