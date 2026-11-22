(function(){
/* ---------- ส่งออกให้ตรงกับบนจอ (จอ Retina / จอที่ขยายสัดส่วน) ----------
   บนจอที่ devicePixelRatio > 1 เบราว์เซอร์ปัดความหนาเส้นขอบและขนาดฟอนต์ตามพิกเซลจริงของจอ (เช่น เส้น 0.67px → 0.5px)
   แต่หน้าพิมพ์และภาพ SVG จัดหน้าที่อัตรา 1 เท่า (0.67px → 1px) ช่องตารางจึงแคบลง ข้อความตกบรรทัด แถวสูงขึ้นแล้วล้นทับบล็อกถัดไป
   แก้: จัดหน้าสำหรับส่งออกที่ zoom = devicePixelRatio แล้วย่อกลับด้วย transform → ได้ผลการจัดหน้าเท่ากับบนจอทุกจุด */
window.NP_BLINK = /(Chrome|Chromium|Edg)\//.test(navigator.userAgent) && !/CriOS|FxiOS|EdgiOS/.test(navigator.userAgent);
function npExportZoom() { const z = +window.devicePixelRatio || 1; return NP_BLINK && z > 1.01 && z <= 4 ? z : 1; }
/* ตรวจจริงว่าภาพ SVG จัดหน้าต่างจากบนจอหรือไม่ (เส้น 0.67px ซ้อน 40 ชั้น) แล้วเลือกค่า zoom ที่ทำให้ตรงกับบนจอ */
window.NP_SVGZ = 0;
async function npSvgZoom() {
  if (NP_SVGZ) return NP_SVGZ;
  const Z = npExportZoom(); if (Z === 1) return (NP_SVGZ = 1);
  const rows = '<div style="border-top:0.67px solid #fff;height:2px"></div>'.repeat(40);
  try {
    const h = document.createElement('div'); h.style.cssText = 'position:absolute;left:-999px;top:0;width:100px;visibility:hidden'; h.innerHTML = rows + '<i style="display:block;height:1px"></i>';
    document.body.appendChild(h); const live = h.lastChild.getBoundingClientRect().top - h.getBoundingClientRect().top; h.remove();
    const probe = async z => {
      const inner = `<div style="width:100px">${rows}<div style="height:10px;background:#f00"></div></div>`;
      const body = z === 1 ? inner : `<div style="width:${100 * z}px;transform:scale(${1 / z});transform-origin:0 0"><div style="zoom:${z};width:100px">${inner}</div></div>`;
      const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="200"><foreignObject x="0" y="0" width="100" height="200"><div xmlns="http://www.w3.org/1999/xhtml" style="width:100px;height:200px;background:#fff;margin:0">${body}</div></foreignObject></svg>`;
      const img = new Image(); await new Promise((r, j) => { img.onload = r; img.onerror = j; img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg); });
      const cv = document.createElement('canvas'); cv.width = 100; cv.height = 200; const g = cv.getContext('2d'); g.drawImage(img, 0, 0); const d = g.getImageData(50, 0, 1, 200).data;
      for (let y = 0; y < 200; y++) if (d[y * 4] > 200 && d[y * 4 + 1] < 80) return y; return -1;
    };
    const a = await probe(1); if (a < 0 || Math.abs(a - live) <= 1) return (NP_SVGZ = 1);
    const b = await probe(Z); return (NP_SVGZ = (b >= 0 && Math.abs(b - live) <= 1) ? Z : 1);
  } catch (e) { console.warn('svg zoom probe', e); return (NP_SVGZ = 1); }
}
/* กันพลาด: วัดความสูงจริงของทุกบล็อกในสำเนาหน้าส่งออก (วางนอกจอชั่วคราว) ถ้าสูงเกินค่าที่ล็อกไว้ → ย่อเนื้อหาบล็อกนั้นด้วย zoom ให้พอดี
   st = สำเนา #stage ที่ล็อกความสูงแล้ว, cl = รายการ #flow > .blk ในสำเนา · คืนจำนวนบล็อกที่ต้องย่อ */
function npFitLocked(st, cl) {
  const host = document.createElement('div'); host.className = 'exporting'; host.style.cssText = 'position:absolute;left:-20000px;top:0;width:794px;visibility:hidden;pointer-events:none';
  let done = 0;
  try {
    host.appendChild(st); document.body.appendChild(host);
    const lock = cl.map(e => parseFloat(e.style.height) || 0);
    const nat = () => { cl.forEach(e => { e.style.height = ''; }); const r = cl.map(e => e.getBoundingClientRect().height); cl.forEach((e, k) => { if (lock[k]) e.style.height = lock[k] + 'px'; }); return r; };
    let h = nat(); const over = k => lock[k] > 0 && h[k] > lock[k] + 0.75;
    let idx = cl.map((_, k) => k).filter(over); done = idx.length;
    const cur = {}, base = new Map();
    for (let pass = 0; pass < 3 && idx.length; pass++) {
      idx.forEach(k => {
        const f = Math.max(0.8, (cur[k] || 1) * lock[k] / h[k] - 0.003); cur[k] = f;
        [...cl[k].children].forEach(c => { if (!base.has(c)) base.set(c, parseFloat(c.style.zoom) || 1); c.style.zoom = base.get(c) * f; });
      });
      h = nat(); idx = idx.filter(k => over(k) && cur[k] > 0.8);
    }
    if (done) console.warn('ส่งออก: ย่อบล็อกที่สูงเกินค่าที่จัดหน้าไว้', done, 'บล็อก');
  } catch (e) { console.warn('fit locked', e); }
  finally { if (st.parentNode === host) host.removeChild(st); host.remove(); }
  return done;
}
/* วาดหน้ากระดาษด้วยเอนจินของเบราว์เซอร์เอง (SVG foreignObject) — สมการ KaTeX ตรงกับบนจอทุกจุด */
const WEBKIT_FO = /AppleWebKit/.test(navigator.userAgent) && !/Chrome|Chromium|CriOS|Edg|Electron|FxiOS/.test(navigator.userAgent);
const __pr = async function(scale = 2.5) {
  let css = '';
  let cssK = ''; // ฟอนต์ KaTeX แยกไว้ ใส่เฉพาะหน้าที่มีสมการ (ไฟล์เล็กลงครึ่งหนึ่ง วาดเร็วขึ้นมากบน Safari)
  for (const ss of document.styleSheets) { try { for (const r of ss.cssRules) { const t = r.cssText; if (typeof fontCssKeep === 'function' && !fontCssKeep(t)) continue; if (/^@font-face/.test(t) && /KaTeX_/.test(t)) cssK += t + '\n'; else css += t + '\n'; } } catch (e) { } }
  css = css.replace(/<\/style/gi, ''); cssK = cssK.replace(/<\/style/gi, '');
  css = foCss(css);
  const vars = document.documentElement.getAttribute('style') || '';
  const st = $('#stage').cloneNode(true);
  // ล็อกความสูงทุกกล่องตามที่จัดหน้าไว้ ไม่ให้ตำแหน่งเลื่อนสะสมถ้าฟอนต์ในภาพโหลดช้า
  const orig = $$('#flow > .blk'), cl = $$('#flow > .blk', st);
  orig.forEach((el, i) => { if (cl[i]) { cl[i].style.height = el.getBoundingClientRect().height + 'px'; cl[i].style.boxSizing = 'border-box'; cl[i].style.overflow = 'visible'; } });
  $$('#flow', st).forEach(f => { f.style.height = $('#flow').getBoundingClientRect().height + 'px'; });
  $$('[contenteditable]', st).forEach(e => e.removeAttribute('contenteditable'));
  $$('.tools,.wh,.grip,.band,.dropline', st).forEach(e => e.remove()); $$('.msel', st).forEach(e => e.classList.remove('msel'));
  npFitLocked(st, cl); let XZ = 1; // XZ: zoom ของหน้าส่งออกให้จัดหน้าตรงกับบนจอ (กำหนดหลังตรวจภาพ SVG ด้านล่าง)
  const P = PAGE_H + PAGE_G;
  // ใส่เฉพาะเนื้อหาของหน้าที่กำลังวาด (กล่องอื่นเว้นว่างแต่คงความสูงไว้) — ไฟล์ภาพเล็กลงมาก และ Safari ไม่ทิ้งรูปภาพ
  const rng = orig.map(el => { const t = el.offsetTop, b = t + Math.max(1, el.offsetHeight); return [Math.floor(t / P), Math.floor((b - 1) / P)]; });
  const sh = $$('#sheets > *', st), full = cl.map(e => e.innerHTML), shFull = sh.map(e => e.innerHTML); let curPg = -1; const stOn = cl.map(() => true), shOn = sh.map(() => true);
  const xmlFor = (i, j = i) => {
    const key = i + ':' + j;
    if (curPg !== key) {
      cl.forEach((e, k) => { const on = !!(rng[k] && rng[k][1] >= i && rng[k][0] <= j); if (stOn[k] !== on) { e.innerHTML = on ? full[k] : ''; stOn[k] = on; } });
      sh.forEach((e, k) => { const on = k >= i && k <= j; if (shOn[k] !== on) { e.innerHTML = on ? shFull[k] : ''; shOn[k] = on; } });
      curPg = key;
    }
    return new XMLSerializer().serializeToString(st);
  };
  const SAFARI = /^((?!chrome|android|crios|fxios|edg).)*safari/i.test(navigator.userAgent);
  const IOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || (/Macintosh/.test(navigator.userAgent) && navigator.maxTouchPoints > 1);
  let checked = false;
  // วาดหลายหน้าในภาพ SVG เดียว (ฟอนต์และ CSS ถูกอ่านครั้งเดียวต่อชุด → เร็วขึ้นมาก โดยเฉพาะ Safari)
  const loadBatch = async (i0, k, mode) => {
    const i1 = i0 + k - 1, H = k * P;
    const body = xmlFor(i0, i1), hasMath = /class="katex/.test(body);
    const html = `<div xmlns="http://www.w3.org/1999/xhtml" class="${document.documentElement.className} ${document.body.className} fo" style="${vars};width:794px;height:${H}px;overflow:hidden;position:relative;background:#fff;margin:0"><style>${hasMath ? cssK : ''}${css}</style>${XZ === 1 ? `<div style="position:absolute;left:0;top:${-i0 * P}px">${body}</div>` : `<div style="position:absolute;left:0;top:0;width:${794 * XZ}px;transform:scale(${1 / XZ});transform-origin:0 0"><div style="position:absolute;left:0;top:${-i0 * P}px;width:794px;zoom:${XZ}">${body}</div></div>`}</div>`;
    const svgStr = foSVG(html, 794, H, scale, mode);
    // base64 ผ่าน FileReader (เร็วและเล็กกว่า encodeURIComponent มากสำหรับข้อความภาษาไทย)
    const url = await new Promise(ok => { const fr = new FileReader(); fr.onload = () => ok(fr.result); fr.readAsDataURL(new Blob([svgStr], { type: 'image/svg+xml' })); });
    const img = new Image(); img.decoding = 'sync';
    await new Promise((res, rej) => { img.onload = res; img.onerror = () => rej(new Error('svg load')); img.src = url; });
    try { await img.decode(); } catch (e) { } await npYield();
    return { i0, i1, img, src: mode === 'one' ? 1 : scale };
  };
  const cut = (B, i) => {
    const cv = document.createElement('canvas'); cv.width = 794 * scale; cv.height = PAGE_H * scale;
    const g = cv.getContext('2d'); g.fillStyle = '#fff'; g.fillRect(0, 0, cv.width, cv.height);
    const s0 = B.src; g.drawImage(B.img, 0, (i - B.i0) * P * s0, 794 * s0, PAGE_H * s0, 0, 0, cv.width, cv.height);
    // กันพลาด: วาดรูปภาพทับลงตำแหน่งจริงบนหน้า (Safari บางรุ่นไม่วาดรูปที่อยู่ใน SVG)
    if (SAFARI) { const S0 = $('#stage').getBoundingClientRect();
      for (const im of $$('#stage img')) { if (!im.complete || !im.naturalWidth) continue; const r = im.getBoundingClientRect(); if (r.width < 2 || r.height < 2) continue;
        const x = r.left - S0.left, y = r.top - S0.top - i * P; if (y + r.height <= 0 || y >= PAGE_H) continue;
        try { g.drawImage(im, x * scale, y * scale, r.width * scale, r.height * scale); } catch (e) { } } }
    if (!checked) { cv.toDataURL('image/jpeg', 0.5); checked = true; } // ตรวจว่าไม่ติด taint (ครั้งแรกครั้งเดียว)
    return cv;
  };
  const draw = async (i, mode) => cut(await loadBatch(i, 1, mode), i);
  // ขอบเขตหมึกบนหน้า (สัดส่วน 0–1) ใช้เทียบว่าภาพที่ได้เต็มหน้าจริง
  const inkBox = cv => { const W = 80, H = 113, c = document.createElement('canvas'); c.width = W; c.height = H; const g = c.getContext('2d'); g.drawImage(cv, 0, 0, W, H); const d = g.getImageData(0, 0, W, H).data; let r = 0, b = 0, l = W, t = H;
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) { const k = (y * W + x) * 4; if (d[k] + d[k + 1] + d[k + 2] < 690) { if (x > r) r = x; if (y > b) b = y; if (x < l) l = x; if (y < t) t = y; } }
    return r ? { r: r / W, b: b / H, l: l / W, t: t / H } : null; };
  XZ = await npSvgZoom();
  let MODE = FO_MODE.page; try { if (!MODE) MODE = FO_MODE.page = localStorage.getItem('np-fomode') || ''; } catch (e) { }
  if (!MODE) {
    const ref = inkBox(await draw(0, 'one')); MODE = 'one';
    if (ref) for (const m of ['vb', 'tf']) { try { const q = inkBox(await draw(0, m)); if (q && Math.abs(q.r - ref.r) < 0.06 && Math.abs(q.b - ref.b) < 0.06 && Math.abs(q.l - ref.l) < 0.06) { MODE = m; break; } } catch (e) { } }
    FO_MODE.page = MODE; try { localStorage.setItem('np-fomode', MODE); } catch (e) { } console.log('PDF render mode', MODE);
  }
  const NPG = $('#sheets').childElementCount, BATCH = IOS ? 2 : 4; let cur = null;
  return async i => {
    if (!cur || i < cur.i0 || i > cur.i1) { cur = null; try { cur = await loadBatch(i, Math.max(1, Math.min(BATCH, NPG - i)), MODE); } catch (e) { cur = await loadBatch(i, 1, MODE); } }
    return cut(cur, i);
  };
}


window.npExportZoom=npExportZoom;window.npSvgZoom=npSvgZoom;window.npFitLocked=npFitLocked;
window.__prNew=__pr;
async function exportPrintPDF() {
  if (typeof pgSelect === 'function') pgSelect(null); if (typeof pgCellClear === 'function') pgCellClear();
  const zw = $('#zoomwrap'), oldZoom = zw.style.zoom; zw.style.zoom = 1;
  document.body.classList.add('exporting'); $$('.blk.sel').forEach(x => x.classList.remove('sel'));
  if (document.activeElement) document.activeElement.blur();
  let root = $('#npPrint'); if (root) root.remove();
  try {
    busy(true, 'กำลังเตรียมหน้าสำหรับพิมพ์…'); await paintNow();
    paginate(); await (document.fonts ? document.fonts.ready : Promise.resolve());
    const P = PAGE_H + PAGE_G, n = $('#sheets').childElementCount;
    const st = $('#stage').cloneNode(true); st.removeAttribute('id'); st.id = 'stage';
    const orig = $$('#flow > .blk'), cl = $$('#flow > .blk', st);
    orig.forEach((el, i) => { if (cl[i]) { cl[i].style.height = el.getBoundingClientRect().height + 'px'; cl[i].style.boxSizing = 'border-box'; cl[i].style.overflow = 'visible'; } });
    $$('#flow', st).forEach(f => { f.style.height = $('#flow').getBoundingClientRect().height + 'px'; });
    $$('[contenteditable]', st).forEach(e => e.removeAttribute('contenteditable'));
    $$('.tools,.wh,.grip,.band,.dropline,.vgrip,.gapph,.tz', st).forEach(e => e.remove()); $$('.msel,.isel,.csel', st).forEach(e => e.classList.remove('msel', 'isel', 'csel'));
    npFitLocked(st, cl); const XZ = typeof npExportZoom === 'function' ? npExportZoom() : 1; // จัดหน้าพิมพ์ที่ zoom เท่าจอ (ดู 13-export.js)
    $$('.katex-mathml', st).forEach(e => e.remove()); // สำเนา MathML ที่ซ่อนอยู่ ไม่แสดงผล → ตัดออกให้หน้าต่างพิมพ์เบาลง
    const rng = orig.map(el => { const t = el.offsetTop, b = t + Math.max(1, el.offsetHeight); return [Math.floor(t / P), Math.floor((b - 1) / P)]; });
    const full = cl.map(e => e.innerHTML), sh = $$('#sheets > *', st), shFull = sh.map(e => e.innerHTML);
    root = document.createElement('div'); root.id = 'npPrint'; root.className = 'exporting';
    const PSET = (window.NP_PAGES && NP_PAGES.length) ? new Set(NP_PAGES) : null;
    for (let i = 0; i < n; i++) {
      if (PSET && !PSET.has(i)) continue;
      if (i % 8 === 0) { busy(true, `กำลังเตรียมหน้า ${i + 1}/${n}`); await npYield(); }
      cl.forEach((e, k) => { const on = !!(rng[k] && rng[k][1] >= i && rng[k][0] <= i); e.innerHTML = on ? full[k] : ''; });
      sh.forEach((e, k) => { e.innerHTML = k === i ? shFull[k] : ''; });
      const pp = document.createElement('div'); pp.className = 'npp'; const w = document.createElement('div'); if (XZ === 1) w.style.top = (-i * P) + 'px'; else w.style.cssText = `top:0;transform:scale(${1 / XZ});transform-origin:0 0`;
      const c = st.cloneNode(true); const fl = c.querySelector('#flow'); if (fl) fl.style.height = ((i + 1) * P) + 'px'; c.style.height = ((i + 1) * P) + 'px'; c.style.overflow = 'hidden';
      // เร็วขึ้น: แต่ละหน้าพิมพ์เก็บเฉพาะแผ่นกระดาษของหน้านั้น และตัดบล็อกที่อยู่หลังหน้านั้นทิ้ง (เดิมทุกหน้าพก
      // แผ่นกระดาษทุกแผ่นที่มีเงา → งานของหน้าต่างพิมพ์โตเป็นกำลังสองตามจำนวนหน้า)
      $$('#sheets > *', c).forEach((e, k) => { if (k !== i) e.remove(); });
      $$('#flow > .blk', c).forEach((e, k) => { if (rng[k] && rng[k][0] > i) e.remove(); });
      if (XZ === 1) w.appendChild(c); else { const v = document.createElement('div'); v.style.cssText = `position:absolute;left:0;top:${-i * P}px;width:794px;zoom:${XZ}`; v.appendChild(c); w.appendChild(v); }
      pp.appendChild(w); root.appendChild(pp);
    }
    document.body.appendChild(root);
    await new Promise(r => setTimeout(r, 120)); await Promise.all($$('#npPrint img').map(im => im.complete ? 0 : new Promise(r => { im.onload = im.onerror = r; })));
  } catch (e) { console.error(e); toast('เตรียมหน้าพิมพ์ไม่สำเร็จ: ' + e.message); if (root) root.remove(); document.body.classList.remove('exporting'); zw.style.zoom = oldZoom; busy(false); return; }
  busy(false);
  const old = document.title; document.title = fname('pdf').replace(/\.pdf$/, '');
  let done = false; const clean = () => { if (done) return; done = true; document.title = old; const r = $('#npPrint'); if (r) r.remove(); document.body.classList.remove('exporting'); zw.style.zoom = oldZoom; schedulePaginate(); removeEventListener('afterprint', clean); };
  addEventListener('afterprint', clean);
  // บางเบราว์เซอร์ไม่ส่ง afterprint → เก็บกวาดเมื่อผู้ใช้กลับมาแตะหน้าจอ
  const later = () => { document.removeEventListener('pointerdown', later, true); document.removeEventListener('keydown', later, true); clean(); };
  setTimeout(() => { window.print(); setTimeout(() => { if (done) return; document.addEventListener('pointerdown', later, true); document.addEventListener('keydown', later, true); }, 800); }, 50);
}

window.__epNew=exportPrintPDF;
})();