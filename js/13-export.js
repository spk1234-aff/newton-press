'use strict';
/* ===================== ส่งออก PDF และ Word ===================== */
function busy(on, msg) { document.body.style.cursor = on ? 'progress' : ''; status(on ? msg : ''); if (!on) schedulePaginate(); }

/* พักให้หน้าจออัปเดต — ใช้ MessageChannel เพราะไม่ถูกเบราว์เซอร์หน่วงเวลาเมื่อสลับไปแท็บ/แอปอื่น (setTimeout/rAF จะช้าหรือหยุด) */
const npYield = () => new Promise(r => { const c = new MessageChannel(); c.port1.onmessage = () => r(); c.port2.postMessage(0); });
const cvJPEG = (cv, q) => new Promise(ok => { if (cv.toBlob) cv.toBlob(b => { if (!b) return ok(cv.toDataURL('image/jpeg', q)); b.arrayBuffer().then(a => ok(new Uint8Array(a))); }, 'image/jpeg', q); else ok(cv.toDataURL('image/jpeg', q)); });
/* ---------- PDF: ถ่ายภาพทีละหน้าแล้วรวมเป็น PDF ---------- */
async function exportPDF() {
  if (!window.jspdf) { toast('ยังโหลดตัวสร้าง PDF ไม่เสร็จ ลองใหม่อีกครั้ง'); return; }
  const zw = $('#zoomwrap'), oldZoom = zw.style.zoom; zw.style.zoom = 1;
  document.body.classList.add('exporting'); $$('.blk.sel').forEach(x => x.classList.remove('sel'));
  if (document.activeElement) document.activeElement.blur();
  paginate();
  await (document.fonts ? document.fonts.ready : Promise.resolve());
  const n = $('#sheets').childElementCount, P = PAGE_H + PAGE_G;
  const pdf = new jspdf.jsPDF({ unit: 'mm', format: 'a4', compress: true });
  try {
    let render = null;
    try { render = await pageRenderer(2.5); await render(0); } catch (e) { console.warn('foreignObject failed', e); render = null; }
    const LIST = (window.NP_PAGES && NP_PAGES.length) ? NP_PAGES.filter(i => i < n) : Array.from({ length: n }, (_, i) => i); let cnt = 0;
    for (const i of LIST) {
      busy(true, `กำลังสร้าง PDF หน้า ${i + 1} (${++cnt}/${LIST.length})`);
      let cv;
      if (render) cv = await render(i);
      else cv = await html2canvas($('#stage'), { scale: 2, backgroundColor: '#ffffff', x: 0, y: i * P, width: 794, height: PAGE_H, scrollX: 0, scrollY: 0, windowWidth: 1000, windowHeight: 1200, logging: false,
        onclone: d => { const s2 = d.getElementById('stage'), b = d.body; b.innerHTML = ''; b.style.margin = '0'; b.style.overflow = 'visible'; b.style.height = 'auto'; d.documentElement.style.overflow = 'visible'; b.appendChild(s2); s2.style.position = 'absolute'; s2.style.left = '0'; s2.style.top = '0'; } });
      if (cnt > 1) pdf.addPage();
      pdf.addImage(await cvJPEG(cv, 0.93), 'JPEG', 0, 0, 210, 297, undefined, 'FAST');
      cv.width = cv.height = 0; await npYield();
    }
    // บุ๊กมาร์กใน PDF จากหัวบท หัวข้อ หัวข้อย่อย และหัวกิจกรรม (ข้อความไทยเข้ารหัส UTF-16)
    if (LIST.length === n) try {
      pdf.outline.makeString = v => '<FEFF' + Array.from(String(v)).map(ch => { let h = ''; for (let i = 0; i < ch.length; i++) h += ch.charCodeAt(i).toString(16).padStart(4, '0'); return h; }).join('').toUpperCase() + '>';
      const par = [];
      outline().forEach(x => { let p = null; for (let l = x.lv - 1; l >= 0; l--) if (par[l]) { p = par[l]; break; } const node = pdf.outline.add(p, x.title, { pageNumber: Math.min(x.page, n) }); par[x.lv] = node; for (let l = x.lv + 1; l < 6; l++) par[l] = null; });
    } catch (e) { console.warn('outline', e); }
    if (LIST.length === n) try { if (typeof tocPdfLinks === 'function') tocPdfLinks(pdf, n); } catch (e) { console.warn('toc links', e); }
    busy(true, 'กำลังรวมไฟล์ PDF…'); await npYield();
    const blob = pdf.output('blob');
    await saveFile(fname('pdf'), blob);
  } catch (e) { console.error(e); toast('สร้าง PDF ไม่สำเร็จ: ' + e.message); }
  finally { document.body.classList.remove('exporting'); zw.style.zoom = oldZoom; busy(false); }
}
/* แปลงส่วนหนึ่งของหน้า (เช่น การหาร) เป็นรูป PNG สำหรับไฟล์ Word */
let CSS_CACHE = null;
/* ในภาพ SVG (foreignObject) ไม่มี <body>: คลาสของ body ไปอยู่ที่ div ครอบ (.fo) → แปลงตัวเลือก body.xxx / :root body.xxx ให้ยังจับได้ (คงน้ำหนักตัวเลือกไม่ให้ต่ำลง) */
function foCss(c) {
  return c.replace(/(?::root|\bhtml)((?:\.[\w-]+)*)\s+body((?:\.[\w-]+)*)(?![\w-])/g, '.fo.fo$1$2')
    .replace(/:root(?![\w-])/g, '.fo')
    .replace(/(^|[\s,{}>+~(])html((?:\.[\w-]+)+)/g, '$1.fo$2')
    .replace(/(^|[\s,{}>+~(])body((?:\.[\w-]+)+)/g, '$1.fo$2');
}
function allCSS() { if (CSS_CACHE) return CSS_CACHE; let css = ''; for (const ss of document.styleSheets) { try { for (const r of ss.cssRules) if (typeof fontCssKeep !== 'function' || fontCssKeep(r.cssText)) css += r.cssText + '\n'; } catch (e) { } } return (CSS_CACHE = css); }
async function elemPNG(el, scale = 3) {
  const w = Math.ceil(el.scrollWidth) + 4, h = Math.ceil(el.scrollHeight) + 4;
  const vars = document.documentElement.getAttribute('style') || '';
  const cs = getComputedStyle(el.closest('#flow') || el);
  const xml = new XMLSerializer().serializeToString(el.cloneNode(true));
  const html = `<div xmlns="http://www.w3.org/1999/xhtml" class="exporting" style="${vars};width:${w}px;height:${h}px;background:#fff;font-family:THS;font-size:${cs.fontSize};line-height:${cs.lineHeight};color:#222;padding:2px;box-sizing:border-box"><style>${allCSS()}</style>${xml}</div>`;
  const svg = foSVG(html, w, h, scale, await foMode(scale));
  const img = new Image();
  await new Promise((res, rej) => { img.onload = res; img.onerror = () => rej(new Error('svg')); img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg); });
  await new Promise(r => setTimeout(r, 30));
  const cv = document.createElement('canvas'); cv.width = w * scale; cv.height = h * scale;
  const g = cv.getContext('2d'); g.fillStyle = '#fff'; g.fillRect(0, 0, cv.width, cv.height); g.drawImage(img, 0, 0, cv.width, cv.height);
  return { data: cv.toDataURL('image/png').split(',')[1], w, h };
}
/* Safari/iPad ไม่ขยาย foreignObject ตาม viewBox (ได้ภาพเล็กชิดมุมซ้ายบน) → ตรวจว่าเบราว์เซอร์รองรับวิธีไหน แล้วเลือกใช้ */
const FO_MODE = {};
function foSVG(html, w, h, s, mode) {
  if (mode === 'tf') return `<svg xmlns="http://www.w3.org/2000/svg" width="${w * s}" height="${h * s}"><foreignObject x="0" y="0" width="${w * s}" height="${h * s}"><div xmlns="http://www.w3.org/1999/xhtml" style="width:${w}px;height:${h}px;transform:scale(${s});transform-origin:0 0">${html}</div></foreignObject></svg>`;
  if (mode === 'one') return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}"><foreignObject x="0" y="0" width="${w}" height="${h}">${html}</foreignObject></svg>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w * s}" height="${h * s}" viewBox="0 0 ${w} ${h}"><foreignObject x="0" y="0" width="${w}" height="${h}">${html}</foreignObject></svg>`;
}
async function foProbe(mode, s) {
  const w = 100, h = 140, html = '<div xmlns="http://www.w3.org/1999/xhtml" style="width:100px;height:140px;background:#f00;margin:0"></div>';
  const img = new Image();
  await new Promise((res, rej) => { img.onload = res; img.onerror = rej; img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(foSVG(html, w, h, s, mode)); });
  await new Promise(r => setTimeout(r, 30));
  const cv = document.createElement('canvas'); cv.width = w * s; cv.height = h * s; const g = cv.getContext('2d'); g.fillStyle = '#fff'; g.fillRect(0, 0, cv.width, cv.height); g.drawImage(img, 0, 0, cv.width, cv.height);
  const px = (x, y) => g.getImageData(x, y, 1, 1).data; const ok = p => p[0] > 200 && p[1] < 60 && p[2] < 60;
  return ok(px(cv.width - 4, cv.height - 4)) && ok(px(4, 4)) && ok(px(cv.width >> 1, cv.height >> 1));
}
async function foMode(s) {
  if (FO_MODE[s]) return FO_MODE[s];
  for (const m of ['vb', 'tf']) { try { if (await foProbe(m, s)) return (FO_MODE[s] = m); } catch (e) { } }
  return (FO_MODE[s] = 'one'); // วาดขนาดจริงแล้วให้ canvas ขยาย (คมน้อยลงแต่เต็มหน้า)
}
/* วาดหน้ากระดาษด้วยเอนจินของเบราว์เซอร์เอง (SVG foreignObject) — สมการ KaTeX ตรงกับบนจอทุกจุด */
const WEBKIT_FO = /AppleWebKit/.test(navigator.userAgent) && !/Chrome|Chromium|CriOS|Edg|Electron|FxiOS/.test(navigator.userAgent);
async function pageRenderer(scale = 2.5) {
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
    const html = `<div xmlns="http://www.w3.org/1999/xhtml" class="${document.documentElement.className} ${document.body.className} fo" style="${vars};width:794px;height:${H}px;overflow:hidden;position:relative;background:#fff;margin:0"><style>${hasMath ? cssK : ''}${css}</style><div style="position:absolute;left:0;top:${-i0 * P}px">${body}</div></div>`;
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

/* ---------- Word (.docx) ---------- */
const TW = 56.6929; // twips ต่อ มม.
const EMU = 36000;  // EMU ต่อ มม.
function xesc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
function hex(c) {
  c = (c || '').trim();
  if (c.startsWith('#')) { if (c.length === 4) c = '#' + c[1] + c[1] + c[2] + c[2] + c[3] + c[3]; return c.slice(1).toUpperCase(); }
  const m = /rgba?\((\d+),\s*(\d+),\s*(\d+)/.exec(c); if (m) return [m[1], m[2], m[3]].map(v => (+v).toString(16).padStart(2, '0')).join('').toUpperCase();
  return '222222';
}
let DX = null; // บริบทระหว่างสร้างไฟล์ Word
function rpr(f) {
  const sz = Math.round((f.size || DX.base) * (f.noScale ? 1 : (DX.sc || 1)) * 2);
  const col = f.color || DX.fg;
  const fn = xesc(f.font || DX.font || 'TH Sarabun New');
  let x = `<w:rFonts w:ascii="${fn}" w:hAnsi="${fn}" w:cs="${fn}" w:eastAsia="${fn}"/>`;
  if (f.b) x += '<w:b/><w:bCs/>';
  if (f.i) x += '<w:i/><w:iCs/>';
  if (f.s) x += '<w:strike/>';
  if (col) x += `<w:color w:val="${col}"/>`;
  x += `<w:sz w:val="${sz}"/><w:szCs w:val="${sz}"/>`;
  if (f.u) x += '<w:u w:val="single"/>';
  if (f.hl) x += `<w:shd w:val="clear" w:color="auto" w:fill="${f.hl}"/>`;
  if (f.va) x += `<w:vertAlign w:val="${f.va}"/>`;
  x += '<w:lang w:val="th-TH" w:bidi="th-TH"/>';
  return `<w:rPr>${x}</w:rPr>`;
}
function run(text, f) { return `<w:r>${rpr(f)}${String(text).replace(/\u200b/g, '').split('\t').map(x => `<w:t xml:space="preserve">${xesc(x)}</w:t>`).join('<w:tab/>')}</w:r>`; }
function tabRun(f) { return `<w:r>${rpr(f)}<w:tab/></w:r>`; }
function para(runs, o = {}) {
  let p = '';
  if (o.style) p += `<w:pStyle w:val="${o.style}"/>`;
  if (o.keep) p += '<w:keepNext/><w:keepLines/>';
  if (o.pageBefore) p += '<w:pageBreakBefore/>';
  if (o.border) p += `<w:pBdr>${o.border}</w:pBdr>`;
  if (o.tabs) p += `<w:tabs>${o.tabs.map(t => `<w:tab w:val="${t[0]}"${t[2] ? ` w:leader="${t[2]}"` : ''} w:pos="${t[1]}"/>`).join('')}</w:tabs>`;
  p += `<w:spacing w:before="${o.before || 0}" w:after="${o.after ?? 40}" w:line="${o.line || 300}" w:lineRule="auto"/>`;
  if (o.ind || o.first) p += `<w:ind w:left="${Math.round(o.ind || 0)}"${o.first ? ` w:firstLine="${Math.round(o.first)}"` : ''}${o.hang ? ` w:hanging="${Math.round(o.hang)}"` : ''}${o.right ? ` w:right="${o.right}"` : ''}/>`;
  if (o.jc) p += `<w:jc w:val="${o.jc}"/>`;
  return `<w:p><w:pPr>${p}${rpr(o.f || {})}</w:pPr>${runs.join('')}</w:p>`;
}
/* แปลง HTML ของช่องพิมพ์ → รายการย่อหน้า (แต่ละย่อหน้าคือรายการ run) */
function htmlParas(html, base = {}) {
  const box = document.createElement('div'); box.innerHTML = html || '';
  const paras = [[]]; const disp = []; const jcs = [];
  const walk = (node, f) => {
    node.childNodes.forEach(n => {
      if (n.nodeType === 3) { const t = n.nodeValue.replace(/ /g, ' '); if (t) paras[paras.length - 1].push(run(t, f)); return; }
      if (n.nodeType !== 1) return;
      const tag = n.tagName.toLowerCase();
      if (n.classList.contains('mx')) {
        const tex = '$' + (n.dataset.tex || '') + '$';
        const mf = Object.assign({}, f); if (n.dataset.col) mf.color = hex(n.dataset.col); if (n.dataset.sz) mf.size = (f.size || DX.base) * +n.dataset.sz;
        if (n.dataset.disp === '1') { paras.push([run(tex, mf)]); disp[paras.length - 1] = true; paras.push([]); }
        else paras[paras.length - 1].push(run(tex, mf));
        return;
      }
      if (n.classList.contains('ic')) { const rid = DX.icons && DX.icons[n.dataset.ic]; if (rid) { const mm = (f.size || DX.base) * (f.noScale ? 1 : (DX.sc || 1)) * 1.3 * 0.3528; paras[paras.length - 1].push(drawing(rid, mm, mm, ++DX.pic)); } return; }
      if (n.classList.contains('blank')) { paras[paras.length - 1].push(run('.'.repeat(Math.round((+n.dataset.w || 6) * 3)), f)); return; }
      if (tag === 'img' && n.classList.contains('ii')) { const src = n.getAttribute('src') || '', m = /^data:image\/(png|jpeg|jpg|gif);base64,(.*)$/.exec(src); const sz = (typeof PG_ISZ !== 'undefined' && PG_ISZ[src]) || { w: 400, h: 300 }; if (m) { const wmm = Math.min(175, (parseFloat(n.style.width) || 200) / 3.7795), hmm = wmm * sz.h / sz.w; const rid = addMedia(m[2], m[1] === 'jpeg' ? 'jpg' : m[1]); if (n.dataset.wrap === 'c') { paras.push([drawing(rid, wmm, hmm, ++DX.pic)]); jcs[paras.length - 1] = 'center'; paras.push([]); } else paras[paras.length - 1].push(drawing(rid, wmm, hmm, ++DX.pic)); } return; }
      if (tag === 'br') { paras.push([]); return; }
      const g = Object.assign({}, f);
      if (tag === 'b' || tag === 'strong' || /bold|700/.test(n.style.fontWeight)) g.b = true;
      if (tag === 'i' || tag === 'em' || n.style.fontStyle === 'italic') g.i = true;
      if (tag === 'u' || /underline/.test(n.style.textDecoration)) g.u = true;
      if (n.style.color) g.color = hex(n.style.color);
      if (tag === 's' || tag === 'strike' || /line-through/.test(n.style.textDecoration)) g.s = true;
      if (tag === 'sup' || n.style.verticalAlign === 'super') g.va = 'superscript';
      if (tag === 'sub' || n.style.verticalAlign === 'sub') g.va = 'subscript';
      if (n.style.backgroundColor && !/transparent|rgba\(0, 0, 0, 0\)/.test(n.style.backgroundColor)) g.hl = hex(n.style.backgroundColor);
      if (n.dataset && n.dataset.font && typeof fontReal === 'function') g.font = n.dataset.font === 'THS' ? 'TH Sarabun New' : fontReal(n.dataset.font);
      if (n.style.fontSize) { const m = /([\d.]+)(pt|px|em)/.exec(n.style.fontSize); if (m) { g.size = m[2] === 'pt' ? +m[1] * 1.4 : m[2] === 'px' ? +m[1] * 0.75 * 1.4 : (f.size || DX.base) * +m[1]; g.noScale = true; } }
      if (tag === 'li') { if (paras[paras.length - 1].length) paras.push([]); const lst = n.parentElement; const ol = lst && lst.tagName === 'OL'; const k = [...lst.children].filter(c => c.tagName === 'LI').indexOf(n) + (+(lst.getAttribute('start') || 1)); let dep = 0; for (let a = lst.parentElement; a && a !== box; a = a.parentElement) if (/^(OL|UL)$/.test(a.tagName)) dep++; paras[paras.length - 1].push(run('\u2003'.repeat(dep * 2) + (ol && lst.dataset.lf && typeof listMarkerOf === 'function' ? listMarkerOf(n) : listMarker(lst.dataset.ls || (ol ? ['decimal', 'lower-alpha', 'lower-roman'][Math.min(dep, 2)] : dep > 0 ? 'circle' : 'disc'), k)) + ' ', f)); walk(n, g); paras.push([]); return; }
      if (tag === 'font' && n.getAttribute('color')) g.color = hex(n.getAttribute('color'));
      const block = tag === 'div' || tag === 'p' || tag === 'ul' || tag === 'ol';
      if (block && paras[paras.length - 1].length) paras.push([]);
      if (block && n.style.textAlign) jcs[paras.length - 1] = { left: 'left', center: 'center', right: 'right', justify: 'both' }[n.style.textAlign];
      walk(n, g);
      if (block) paras.push([]);
    });
  };
  walk(box, base);
  const out = []; paras.forEach((r, i) => { if (r.length || i === 0) out.push({ runs: r, disp: !!disp[i], jc: jcs[i] }); });
  while (out.length > 1 && !out[out.length - 1].runs.length) out.pop();
  return out;
}
function cell(inner, o = {}) {
  const bd = o.border || `<w:top w:val="single" w:sz="4" w:color="${o.bc || 'CDB9AD'}"/><w:left w:val="single" w:sz="4" w:color="${o.bc || 'CDB9AD'}"/><w:bottom w:val="single" w:sz="4" w:color="${o.bc || 'CDB9AD'}"/><w:right w:val="single" w:sz="4" w:color="${o.bc || 'CDB9AD'}"/>`;
  return `<w:tc><w:tcPr>${o.w ? `<w:tcW w:w="${Math.round(o.w)}" w:type="dxa"/>` : ''}${o.span ? `<w:gridSpan w:val="${o.span}"/>` : ''}${o.vm ? `<w:vMerge${o.vm === 'restart' ? ' w:val="restart"' : ''}/>` : ''}<w:tcBorders>${bd}</w:tcBorders>${o.fill ? `<w:shd w:val="clear" w:color="auto" w:fill="${o.fill}"/>` : ''}<w:tcMar><w:top w:w="${o.pt ?? 40}" w:type="dxa"/><w:left w:w="${o.px ?? 140}" w:type="dxa"/><w:bottom w:w="${o.pb ?? 60}" w:type="dxa"/><w:right w:w="${o.px ?? 140}" w:type="dxa"/></w:tcMar>${o.vAlign ? `<w:vAlign w:val="${o.vAlign}"/>` : ''}</w:tcPr>${inner || para([])}</w:tc>`;
}
function table(rows, o = {}) {
  const w = o.w || DX.cw - (o.ind || 0);
  const cols = rows[0].length;
  const ws = o.cols || Array(cols).fill(w / cols);
  return `<w:tbl><w:tblPr><w:tblW w:w="${Math.round(w)}" w:type="dxa"/>${o.center ? '<w:jc w:val="center"/>' : ''}${o.ind ? `<w:tblInd w:w="${Math.round(o.ind)}" w:type="dxa"/>` : ''}<w:tblLayout w:type="fixed"/></w:tblPr><w:tblGrid>${ws.map(x => `<w:gridCol w:w="${Math.round(x)}"/>`).join('')}</w:tblGrid>${rows.map((r, i) => `<w:tr><w:trPr><w:cantSplit/>${i < (o.hdr || 0) ? '<w:tblHeader/>' : ''}${(o.rh && o.rh[i]) || o.h ? `<w:trHeight w:val="${Math.round((o.rh && o.rh[i]) || o.h)}" w:hRule="atLeast"/>` : ''}</w:trPr>${r.join('')}</w:tr>`).join('')}</w:tbl>` + (o.noGap ? '' : para([], { after: 0, line: 120 }));
}
function boxTable(label, labelColor, bodyHTML, fill, bcol, o = {}) {
  const k = o.keep;
  let inner = '';
  if (label) inner += para([run(label, { b: true, color: DX.lab || labelColor })], { keep: true, after: 0 });
  htmlParas(bodyHTML).forEach(p => inner += para(p.runs, { keep: k, jc: p.jc || (p.disp ? 'center' : DX.al), after: 20 }));
  return table([[cell(inner, { fill: DX.bg || fill, bc: DX.bd || bcol, border: DX.bord })]], { ind: o.ind || 0, noGap: o.noGap });
}

async function svgToPNG(svg, scale = 2) {
  // ใส่ฟอนต์ลงใน SVG ก่อนแปลงเป็นรูป (รูปแยกไม่เห็นฟอนต์ของหน้าเว็บ)
  let css = '';
  for (const ss of document.styleSheets) { try { for (const r of ss.cssRules) if (r.type === 5 && /THS|KaTeX_Main|KaTeX_Math/.test(r.cssText) && /woff2|truetype/.test(r.cssText)) css += r.cssText + '\n'; } catch (e) { } }
  const s = svg.replace('<style>', `<style>${css}`);
  const m = /width="(\d+)" height="(\d+)"/.exec(s); const w = +m[1], h = +m[2];
  const img = new Image();
  const url = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(s);
  await new Promise((res, rej) => { img.onload = res; img.onerror = rej; img.src = url; });
  await new Promise(r => setTimeout(r, 60));
  const cv = document.createElement('canvas'); cv.width = w * scale; cv.height = h * scale;
  const g = cv.getContext('2d'); g.fillStyle = '#fff'; g.fillRect(0, 0, cv.width, cv.height); g.drawImage(img, 0, 0, cv.width, cv.height);
  return { data: cv.toDataURL('image/png').split(',')[1], w, h };
}
function imgSize(src) { return new Promise(res => { const i = new Image(); i.onload = () => res({ w: i.naturalWidth, h: i.naturalHeight }); i.onerror = () => res({ w: 400, h: 300 }); i.src = src; }); }
function drawing(rid, wmm, hmm, id) {
  const cx = Math.round(wmm * EMU), cy = Math.round(hmm * EMU);
  return `<w:r><w:drawing><wp:inline distT="0" distB="0" distL="0" distR="0"><wp:extent cx="${cx}" cy="${cy}"/><wp:docPr id="${id}" name="Picture ${id}"/><wp:cNvGraphicFramePr><a:graphicFrameLocks xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" noChangeAspect="1"/></wp:cNvGraphicFramePr><a:graphic xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main"><a:graphicData uri="http://schemas.openxmlformats.org/drawingml/2006/picture"><pic:pic xmlns:pic="http://schemas.openxmlformats.org/drawingml/2006/picture"><pic:nvPicPr><pic:cNvPr id="${id}" name="img${id}"/><pic:cNvPicPr/></pic:nvPicPr><pic:blipFill><a:blip r:embed="${rid}"/><a:stretch><a:fillRect/></a:stretch></pic:blipFill><pic:spPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="${cx}" cy="${cy}"/></a:xfrm><a:prstGeom prst="rect"><a:avLst/></a:prstGeom></pic:spPr></pic:pic></a:graphicData></a:graphic></wp:inline></w:drawing></w:r>`;
}
function addMedia(b64, ext) { const n = DX.media.length + 1; const name = `img${n}.${ext}`; DX.media.push({ name, b64 }); const rid = 'rIdM' + n; DX.rels.push(`<Relationship Id="${rid}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/image" Target="media/${name}"/>`); return rid; }

async function blockXML(b, keep) {
  const S = b.st || {};
  DX.sc = S.fs || 1; DX.fg = S.fg ? hex(S.fg) : null; DX.lab = S.lab ? hex(S.lab) : null; DX.al = S.al ? { left: 'left', center: 'center', right: 'right', justify: 'both' }[S.al] : undefined;
  DX.bg = S.bg ? hex(S.bg) : null; DX.bd = S.bd ? hex(S.bd) : null;
  DX.bord = (S.bw !== undefined || S.bs) ? (() => { const v = S.bw === 0 ? 'nil' : ({ dashed: 'dashed', dotted: 'dotted', double: 'double' }[S.bs] || 'single'); const z = Math.round((S.bw || 1) * 6); const c = DX.bd || '9A8576'; return ['top', 'left', 'bottom', 'right'].map(k => `<w:${k} w:val="${v}" w:sz="${z}" w:color="${c}"/>`).join(''); })() : null;
  const BOXED = new Set(['h3', 'soltitle', 'idea', 'check', 'caution', 'box', 'chapter', 'work', 'table', 'cover', 'activity', 'examcover', 'part', 'solhead', 'keytable', 'asheet']);
  let x = await blockXML0(b, keep);
  if ((DX.bg || DX.bd || DX.bord) && !BOXED.has(b.t) && x) {
    x = table([[cell(x + (/<\/w:tbl>$/.test(x) ? para([]) : ''), { fill: DX.bg || undefined, bc: DX.bd || 'FFFFFF', border: DX.bord })]], {});
  }
  DX.sc = 1; DX.fg = DX.lab = DX.bg = DX.bd = DX.bord = null; DX.al = undefined;
  return x;
}
async function blockXML0(b, keep) {
  const th = themeOf(doc.settings), C = k => hex(th[k]);
  const IND = 29 * 0.2646 * TW, IND2 = 38 * 0.2646 * TW;
  const lab = t => ((b.st && b.st.lt) || LABELS[t]);
  const P = (html, o = {}, base = {}) => htmlParas(html, base).map(p => para(p.runs, Object.assign({ keep, jc: p.jc || (p.disp ? 'center' : DX.al) }, o))).join('');
  switch (b.t) {
    case 'chapter': {
      const inner = para([run(b.num || '', { color: 'FFFFFF', size: DX.base * 0.9 })], { after: 0, keep: true }) + para([run(b.title || '', { b: true, color: 'FFFFFF', size: DX.base * 1.8 })], { style: 'Heading1', after: 0, keep: true }) + para([run(b.sub || '', { color: 'F2E6DC', size: DX.base * 0.95 })], { after: 0, keep: true });
      const ca = b.ca ? hex(b.ca) : C('chapA');
      return table([[cell(inner, { fill: ca, bc: ca, pt: 120, pb: 140 })]], {});
    }
    case 'section': return P(b.html, { style: 'Heading2', keep: true, before: 160, after: 80, border: `<w:bottom w:val="single" w:sz="6" w:space="1" w:color="${C('sep')}"/>` }, { b: true, color: C('dark'), size: DX.base * 1.15 });
    case 'subsection': return P(b.html, { style: 'Heading3', keep: true, before: 120 }, { b: true, color: C('brown') });
    case 'para': return P(b.html);
    case 'problem': {
      const runs = [].concat(...htmlParas(b.html, { b: true, color: DX.lab || C('dark') }).map(p => p.runs));
      if (b.skill !== undefined) { runs.push(run('   ', {})); htmlParas(b.skill, { b: true, color: DX.lab || C('brown') }).forEach(p => runs.push(...p.runs)); }
      if (b.pts !== undefined && b.pts !== '') runs.push(tabRun({}), run(`(${b.pts} คะแนน)`, { color: C('brown') }));
      return para(runs, { tabs: [['right', DX.cw]], keep: true, before: 120, border: `<w:top w:val="dashed" w:sz="4" w:space="4" w:color="${C('sep')}"/>` });
    }
    case 'given': return P(b.html, { ind: IND });
    case 'question': {
      const ps = htmlParas(b.html); const q = 1000;
      return ps.map((p, i) => para((i === 0 ? [run(lab('question'), { b: true, color: DX.lab || C('gold') }), tabRun({})] : []).concat(p.runs), { keep, ind: IND + q, hang: i === 0 ? q : 0, tabs: [['left', Math.round(IND + q)]] })).join('');
    }
    case 'choices': {
      const items = b.items || []; const len = Math.max(...items.map(h => h.replace(/<[^>]+>/g, '').length + 2));
      const cols = b.cols || (len <= 12 ? 5 : len <= 26 ? 3 : len <= 44 ? 2 : 1);
      const rows = []; for (let i = 0; i < items.length; i += cols) rows.push(items.slice(i, i + cols));
      const none = '<w:top w:val="nil"/><w:left w:val="nil"/><w:bottom w:val="nil"/><w:right w:val="nil"/>';
      return table(rows.map((r, ri) => { const cs = r.map((h, j) => cell(para([run(choiceLab(b, ri * cols + j), {}), run(' ', {})].concat(...htmlParas(h).map(p => p.runs)), { keep, after: 0 }), { border: none, pt: 0, pb: 0 })); while (cs.length < cols) cs.push(cell(para([]), { border: none })); return cs; }), { ind: IND * 2 });
    }
    case 'idea': return boxTable(lab('idea'), C('brown'), b.html, 'FDF6EC', 'EFD9B8', { keep, ind: IND2 });
    case 'check': return boxTable(lab('check'), '2E6B47', b.html, 'EEF6F1', 'C9E3D3', { keep, ind: IND2 });
    case 'caution': return boxTable(lab('caution'), 'A33A2A', b.html, 'FDEEEE', 'F0C9C9', { keep, ind: IND2 });
    case 'solution': {
      const bd = `<w:left w:val="single" w:sz="18" w:space="8" w:color="${C('bar')}"/>`;
      return para([run(lab('solution'), { b: true, color: DX.lab })], { keep: true, ind: IND2, border: bd, after: 0 }) + P(b.html, { ind: IND2, border: bd });
    }
    case 'answer': {
      if (b.v === 'box') { const r = [run(lab('answer') + '  ', { b: true, color: C('dark') })].concat(...htmlParas(b.html, {}).map(p => p.runs)); return table([[cell(para(r, { after: 0 }), { fill: 'FDF6EC', bc: C('gold') })]], { w: Math.min(DX.cw, 4200) }); }
      const ps = htmlParas(b.html, { b: true, color: C('dark') });
      return ps.map((p, i) => para((i === 0 ? [run(lab('answer'), { b: true, color: DX.lab || C('dark') }), tabRun({})] : []).concat(p.runs), { keep, ind: IND + 700, hang: i === 0 ? 700 : 0, tabs: [['left', Math.round(IND + 700)]] })).join('');
    }
    case 'box': {
      const m0 = BOXDATA[b.kind] || BOXDATA.thm; const map = [m0[0], m0[1], m0[2] || C('brown')];
      return boxTable((b.title || '').replace(/<[^>]+>/g, ''), map[2], b.kind === 'proof' ? (b.html || '') + ' ∎' : b.html, map[0], map[1], { keep: true });
    }
    case 'work': {
      const dash = `<w:top w:val="dashed" w:sz="4" w:color="C9B6A8"/><w:left w:val="dashed" w:sz="4" w:color="C9B6A8"/><w:bottom w:val="dashed" w:sz="4" w:color="C9B6A8"/><w:right w:val="dashed" w:sz="4" w:color="C9B6A8"/>`;
      const wel = $(`.blk[data-id="${b.id}"] .b-work`); const hmm = b.share && wel ? wel.offsetHeight * 0.2646 * 0.92 : (b.h || 40);
      let w = table([[cell(para(b.nolab ? [] : [run(b.wl || 'พื้นที่สำหรับทด', { color: 'B8A090', size: DX.base * 0.75 })], { after: 0 }), { border: dash })]], { ind: IND, h: hmm * TW, noGap: !!b.ans });
      if (b.full) w = w.replace(/<w:trHeight w:val="\d+"/, `<w:trHeight w:val="${Math.round(150 * TW)}"`);
      if (b.ans) w += para([run((b.ansl || 'คำตอบ') + ' ', { color: '9A8576' }), run('.'.repeat(40), { color: '9A8576' })], { jc: 'right', after: 60 });
      return w;
    }
    case 'lines': {
      const bd = `<w:top w:val="nil"/><w:left w:val="nil"/><w:bottom w:val="${b.dash ? 'dashed' : 'single'}" w:sz="4" w:color="CDB9AD"/><w:right w:val="nil"/>`;
      return table(Array.from({ length: b.n || 4 }, () => [cell(para([], { after: 0, keep }), { border: bd, pt: 0, pb: 0 })]), { ind: IND, h: (b.gap || 9) * TW });
    }
    case 'activity': {
      return table([[cell(para([run((b.icon ?? '♟') + '  ', { b: true, color: 'FFFFFF' })].concat(...htmlParas(b.html, { b: true, color: 'FFFFFF' }).map(p => p.runs)), { style: 'Heading3', after: 0, keep: true }), { fill: C('brown'), bc: C('brown'), pt: 30, pb: 30 })]], { noGap: true });
    }
    case 'actend': return para([], { border: `<w:bottom w:val="single" w:sz="8" w:space="1" w:color="${C('brown')}"/>`, after: 120 });
    case 'timeline': {
      return (b.rows || []).map(r => para([run('●  ', { color: C('brown') })].concat(...htmlParas(r[0], { b: true, color: C('brown') }).map(p => p.runs), [run('   ', {})], ...htmlParas(r[1]).map(p => p.runs)), { ind: 300, keep: true })).join('');
    }
    case 'cover': {
      const A = b.ca ? hex(b.ca) : C('chapA');
      const txt = (h, f) => [].concat(...htmlParas(h, f).map(p => p.runs));
      let inner = para(txt(b.badge, { color: 'FFFFFF', size: DX.base * 1.3 }).concat([tabRun({})], txt(b.grade, { b: true, color: 'FFFFFF', size: DX.base * 2 })), { tabs: [['right', DX.cw - 300]], after: 80 });
      inner += para(txt(b.num, { color: 'FFFFFF', size: DX.base * 1.5 }), { after: 0 });
      inner += para(txt(b.title, { b: true, color: 'FFFFFF', size: DX.base * 3.2 }).concat([run(' ', {})], txt(b.suf, { color: 'FFFFFF', size: DX.base * 1.7 })), { after: 100, line: 240 });
      let x = table([[cell(inner, { fill: A, bc: A, pt: 150, pb: 150 })]], {});
      const fs = Array.from({ length: b.circles ?? 4 }, (_, i) => b['f' + i] || '');
      if (fs.length) x += table([fs.map(h => cell(para(txt(h, { size: DX.base * 1.2 }), { jc: 'center', after: 0 }), { bc: C('brown'), pt: 60, pb: 60, vAlign: 'center' }))], { w: DX.cw, center: true });
      x += para(txt(b.subj, { b: true, color: C('dark'), size: DX.base * 1.7 }), { jc: 'center', before: 160, after: 30 });
      htmlParas(b.curr, { color: '6B5A4E', size: DX.base * 1.1 }).forEach(p => x += para(p.runs, { jc: 'center', after: 0, line: 260 }));
      let bot = para([run(plainText(b.by ?? 'จัดทำโดย') + '  ', { color: 'F2E6DC' })].concat(txt(b.auth, { b: true, color: 'FFFFFF', size: DX.base * 1.7 })), { after: 0, line: 240 });
      htmlParas(b.info, { color: 'F2E6DC', size: DX.base * 0.9 }).forEach(p => bot += para(p.runs, { after: 0, line: 220 }));
      bot += para(txt(b.brand, { color: 'FFFFFF' }), { after: 0, line: 240 });
      x += table([[cell(bot, { fill: A, bc: A, pt: 200, pb: 200 })]], { noGap: true });
      return x + '<w:p><w:pPr><w:spacing w:before="0" w:after="0" w:line="20" w:lineRule="exact"/></w:pPr><w:r><w:br w:type="page"/></w:r></w:p>';
    }
    case 'figure': {
      if (!b.svg) return '';
      const png = await svgToPNG(b.svg); const rid = addMedia(png.data, 'png');
      const wmm = 175 * (b.w || 60) / 100, hmm = wmm * png.h / png.w;
      return para([drawing(rid, wmm, hmm, ++DX.pic)], { keep, jc: 'center', after: 60 });
    }
    case 'image': {
      if (!b.src) return '';
      const m = /^data:image\/(\w+);base64,(.*)$/.exec(b.src); if (!m) return '';
      const ext = m[1] === 'jpeg' ? 'jpg' : m[1]; let data = m[2], e2 = ext;
      if (!['png', 'jpg', 'gif'].includes(ext)) { const sz0 = await imgSize(b.src); const cv = document.createElement('canvas'); cv.width = sz0.w; cv.height = sz0.h; const im = new Image(); await new Promise(r => { im.onload = r; im.src = b.src; }); cv.getContext('2d').drawImage(im, 0, 0); data = cv.toDataURL('image/png').split(',')[1]; e2 = 'png'; }
      const sz = await imgSize(b.src); const rid = addMedia(data, e2);
      const wmm = 175 * (b.w || 60) / 100, hmm = wmm * sz.h / sz.w;
      const jc = { left: 'left', right: 'right' }[(b.st || {}).al] || 'center';
      let out = para([drawing(rid, wmm, hmm, ++DX.pic)], { keep: keep || !!b.cap, jc, after: b.cap ? 0 : 60 });
      if (b.cap || b.capOn) out += P((b.capOn ? '<b>' + capLabel(b, capNums()[b.id]) + '</b> ' : '') + (b.cap || ''), { jc, after: 80 }, { color: '5B4F47', size: DX.base * 0.92 });
      return out;
    }
    case 'table': return tableXML(b, C, keep);
    case 'pagebreak': return '<w:p><w:r><w:br w:type="page"/></w:r></w:p>';
    case 'part': {
      const runs = [].concat(...htmlParas(b.html, { b: true, color: 'FFFFFF', size: DX.base * 1.1 }).map(p => p.runs), [run('    ', {})], ...htmlParas(b.info, { color: 'F2E6DC' }).map(p => p.runs));
      return table([[cell(para(runs, { style: 'Heading1', after: 0, keep: true }), { fill: C('brown'), bc: C('brown'), pt: 40, pb: 40 })]], {});
    }
    case 'solhead': {
      const t = (x, f) => [].concat(...htmlParas(x, f).map(p => p.runs));
      const runs = t(b.num, { b: true, color: 'FFFFFF', size: DX.base * 1.4 }).concat([run('   ', {})], t(b.pts, { color: 'E6D6A6', size: DX.base * 0.9 }), [run(' ' + plainText(b.lp ?? 'คะแนน'), { color: 'E6D6A6', size: DX.base * 0.9 }), tabRun({}), run(plainText(b.la ?? 'คำตอบ') + ' ', { color: 'DFE5EF' })], t(b.ans || '____', { b: true, color: 'E8C66A', size: DX.base * 1.4 }));
      return '<w:p><w:r><w:br w:type="page"/></w:r></w:p>' + table([[cell(para(runs, { style: 'Heading2', tabs: [['right', DX.cw - 300]], after: 0, keep: true }), { fill: C('dark'), bc: C('dark'), pt: 60, pb: 60 })]], {});
    }
    case 'h3': {
      const col = { navy: C('dark'), gold: 'A8801F', teal: '2B7A8C', red: 'C0392B', brown: C('brown') }[b.tone || 'navy'];
      return P(b.html, { keep: true, before: 140, after: 60, border: `<w:bottom w:val="single" w:sz="4" w:space="1" w:color="${col}"/>` }, { b: true, color: col, size: DX.base * 1.06 });
    }
    case 'soltitle': {
      const t = (h, f) => [].concat(...htmlParas(h, f).map(p => p.runs));
      const lg = await (async () => { const src = coverLogo(b); const sz = await imgSize(src); const cv = document.createElement('canvas'); const k = 260 / Math.max(sz.w, sz.h); cv.width = sz.w * k; cv.height = sz.h * k; const im = new Image(); await new Promise(r => { im.onload = r; im.onerror = r; im.src = src; }); cv.getContext('2d').drawImage(im, 0, 0, cv.width, cv.height); return cv.toDataURL('image/png').split(',')[1]; })();
      const rid = addMedia(lg, 'png'); const none = '<w:top w:val="nil"/><w:left w:val="nil"/><w:bottom w:val="nil"/><w:right w:val="nil"/>';
      const right = para(t(b.brand, { color: C('gold'), size: DX.base * 1.2 }), { after: 0 }) + para(t(b.title, { b: true, color: C('dark'), size: DX.base * 2.2 }), { style: 'Heading1', after: 0, line: 260 }) + para(t(b.sub, { color: '5D554D' }), { after: 0 });
      return table([[cell(para([drawing(rid, 28, 28, ++DX.pic)], { after: 0 }), { border: none, w: 2000, vAlign: 'center' }), cell(right, { border: none, vAlign: 'center' })]], {}).replace('<w:tblGrid><w:gridCol w:w="' + Math.round(DX.cw / 2) + '"/><w:gridCol w:w="' + Math.round(DX.cw / 2) + '"/></w:tblGrid>', `<w:tblGrid><w:gridCol w:w="2000"/><w:gridCol w:w="${DX.cw - 2000}"/></w:tblGrid>`) + para([], { border: `<w:bottom w:val="single" w:sz="18" w:space="1" w:color="${C('dark')}"/>`, after: 120 });
    }
    case 'keytable': {
      if (b.mode === 'parts') {
        const ks = String(b.key || '').split(/[,\s]+/).filter(Boolean); const per = +b.cols || 10; const rows = [];
        const hd = (txt2, first) => cell(first ? para([run(txt2, { b: true, color: 'FFFFFF', size: DX.base * 0.8 })], { jc: 'center', after: 0, line: 220 }) : para([]), { fill: C('dark'), bc: C('dark') });
        (b.parts || []).forEach(p => { const n = p.to - p.from + 1; for (let r = 0; r < Math.ceil(n / per); r++) { const nums = [], ans = []; for (let j = 0; j < per; j++) { const q = p.from + r * per + j; nums.push(cell(para(q <= p.to ? [run(String(q), { color: '9AA3AF', size: DX.base * 0.75 })] : [], { jc: 'center', after: 0, line: 220 }), { bc: 'D5D9E0', pt: 0, pb: 0, px: 20 })); ans.push(cell(para(q <= p.to && ks[q - 1] ? [run(ks[q - 1], { size: DX.base * 0.9 })] : [], { jc: 'center', after: 0 }), { bc: 'D5D9E0', px: 20 })); } rows.push([hd(`${p.name} (${p.pts} คะแนน)`, r === 0)].concat(nums)); rows.push([hd('', false)].concat(ans)); } });
        const fw = 1500, rw = (DX.cw - fw) / per; return para(htmlParas(b.cap || 'สรุปคำตอบ', { b: true, color: C('dark') })[0].runs, { style: 'Heading1', keep: true, after: 60 }) + (rows.length ? table(rows, { cols: [fw].concat(Array(per).fill(rw)) }) : '');
      }
      const ks = String(b.key || '').split(/[,\s]+/).filter(Boolean); if (!ks.length) return ''; const per = +b.cols || 10, st = +b.from || 1; const rows = [];
      for (let i = 0; i < ks.length; i += per) { const r = ks.slice(i, i + per); while (r.length < per) r.push(''); rows.push(r.map((_, j) => cell(para([run(i + j < ks.length ? 'ข้อ ' + (st + i + j) : '', { b: true, color: C('dark'), size: DX.base * 0.9 })], { jc: 'center', after: 0 }), { fill: 'FBEFE7' }))); rows.push(r.map(k => cell(para(k ? [run('$' + k + '$', {})] : [], { jc: 'center', after: 0 }), {}))); }
      return para([run('สรุปคำตอบ', { b: true, color: C('dark'), size: DX.base * 1.15 })], { style: 'Heading1', keep: true, after: 60 }) + table(rows, { center: true });
    }
    case 'asheet': {
      const png = await svgToPNG(answerSheetSVG(b.cfg || ASHEET_DEF), 2.2); const rid = addMedia(png.data, 'png');
      const wmm = Math.min(175, png.w * 0.2646), hmm = wmm * png.h / png.w; const hh = Math.min(hmm, 245), ww = wmm * hh / hmm;
      return para([run('กระดาษคำตอบ', { color: 'FFFFFF', size: 2 })], { style: 'Heading1', after: 0 }) + para([drawing(rid, ww, hh, ++DX.pic)], { jc: 'center', after: 0 });
    }
    case 'examcover': {
      const t = (h, f) => [].concat(...htmlParas(h, f).map(p => p.runs));
      const lg = await (async () => { const src = coverLogo(b); const sz = await imgSize(src); const cv = document.createElement('canvas'); const k = 300 / Math.max(sz.w, sz.h); cv.width = sz.w * k; cv.height = sz.h * k; const im = new Image(); await new Promise(r => { im.onload = r; im.onerror = r; im.src = src; }); cv.getContext('2d').drawImage(im, 0, 0, cv.width, cv.height); return cv.toDataURL('image/png').split(',')[1]; })();
      const rid = addMedia(lg, 'png');
      let x = para([drawing(rid, 24, 24, ++DX.pic)], { jc: 'center', after: 20 }) + para(t(b.brand, { color: C('brown'), size: DX.base * 1.1 }), { jc: 'center', after: 120 });
      x += para(t(b.subj, { b: true, color: C('dark'), size: DX.base * 1.8 }), { style: 'Heading1', jc: 'center', after: 40, line: 260 }) + para(t(b.set, { color: C('brown'), size: DX.base * 1.3 }), { jc: 'center', after: 140 });
      const hd = s2 => cell(para([run(s2, { b: true, color: 'FFFFFF' })], { jc: 'center', after: 0 }), { fill: C('brown'), bc: C('brown') });
      const vd = r => cell(para(r, { jc: 'center', after: 0 }), { bc: C('brown') });
      x += table([[hd(plainText(b.l1 ?? 'จำนวน')), hd(plainText(b.l2 ?? 'คะแนนเต็ม')), hd(plainText(b.l3 ?? 'เวลา'))], [vd(t(b.items).concat([run(' ' + plainText(b.u1 ?? 'ข้อ'), {})])), vd(t(b.score).concat([run(' ' + plainText(b.u2 ?? 'คะแนน'), {})])), vd(t(b.time))]], { w: 6200, center: true });
      x += para([run(plainText(b.n1 ?? 'ชื่อ–นามสกุล') + ' ' + '.'.repeat(60) + ' ' + plainText(b.n2 ?? 'ชั้น') + ' ' + '.'.repeat(12) + ' ' + plainText(b.n3 ?? 'เลขที่') + ' ' + '.'.repeat(8), {})], { before: 160, after: 140 });
      const bd = ['top', 'left', 'bottom', 'right'].map(k => `<w:${k} w:val="single" w:sz="8" w:space="6" w:color="${C('brown')}"/>`).join('');
      x += para([run(plainText(b.insh ?? 'คำชี้แจง'), { b: true, color: C('brown'), size: DX.base * 1.1 })], { border: bd, ind: 150, right: 150, after: 0 }).replace('<w:pPr>', '<w:pPr>');
      htmlParas(b.ins, { size: DX.base * 0.9 }).forEach(p => x += para(p.runs, { border: bd, ind: 150, right: 150, after: 0, line: 240 }));
      x += para(t(b.note, { color: '8A7D73' }).concat(['<w:r><w:br w:type="page"/></w:r>']), { jc: 'center', before: 160, after: 0 });
      return x;
    }
    case 'people': case 'divide': {
      const el = $(`.blk[data-id="${b.id}"] .b-${b.t}`); if (!el) return '';
      const png = await elemPNG(el); const rid = addMedia(png.data, 'png');
      const wmm = png.w * 0.2646 * 1.07, hmm = png.h * 0.2646 * 1.07;
      return para([drawing(rid, wmm, hmm, ++DX.pic)], { keep, ind: IND, after: 60 });
    }
  }
  if (typeof extBlockXML === 'function') { const x = extBlockXML(b, { C, IND, keep, P }); if (x) return x; }
  return '';
}

async function exportDOCX() {
  if (!window.JSZip) { toast('ยังโหลดตัวสร้างไฟล์ Word ไม่เสร็จ ลองใหม่อีกครั้ง'); return; }
  busy(true, 'กำลังสร้างไฟล์ Word...');
  try {
    const s = doc.settings, th = themeOf(s);
    DX = { base: s.size === 'exam' ? 16 : 14, cw: Math.round((210 - 18 - 17) * TW), media: [], rels: [], pic: 10 };
    DX.font = typeof fontReal === 'function' ? fontReal(s.font) : 'TH Sarabun New';
    // จัดกลุ่มเหมือนการจัดหน้าบนจอ: บล็อกในข้อเดียวกันให้อยู่หน้าเดียวกัน
    let body = '';
    const B = doc.blocks;
    DX.icons = {};
    const used = new Set(); (JSON.stringify(B).match(/data-ic=\\"[^"\\]+\\"/g) || []).forEach(m => used.add(m.replace(/^data-ic=\\"|\\"$/g, '')));
    for (const name of used) { const svg = iconSVG(name); if (!svg) continue; try { const png = await svgToPNG(svg.replace('width="24" height="24"', 'width="48" height="48"'), 2); DX.icons[name] = addMedia(png.data, 'png'); } catch (e) { } }
    const AI = s.pnAnchor ? B.findIndex(b => b.id === s.pnAnchor) : -1;
    for (let i = 0; i < B.length; i++) {
      const b = B[i], nx = B[i + 1];
      const inGroup = nx && ((b.t === 'problem' || GROUP_MEMBERS.has(b.t)) && GROUP_MEMBERS.has(nx.t) && nx.t !== 'problem');
      if (i % 8 === 0) { busy(true, `กำลังสร้างไฟล์ Word ส่วนที่ ${i + 1}/${B.length}`); await new Promise(r => setTimeout(r, 0)); }
      let x = await blockXML(b, !!inGroup || HEADINGS.has(b.t));
 if (b.capOn && (b.t === 'table' || b.t === 'figure')) { const cp = para([run(capLabel(b, capNums()[b.id]) + ' ', { b: true })].concat(...htmlParas(b.cap || '', {}).map(q => q.runs)), { keep: b.t === 'table', jc: b.t === 'table' ? undefined : 'center', after: 60 }); x = b.t === 'table' ? cp + x : x + cp; }
 if (i === AI && i > 0) { body += '%%SECT1%%' + x; continue; }
 if (b.sp) x = `<w:p><w:pPr><w:spacing w:before="0" w:after="${Math.round(b.sp * 56.7)}" w:line="20" w:lineRule="exact"/></w:pPr></w:p>` + x;
 if (b.npg && i > 0 && B[i - 1].t !== 'pagebreak') { body += '<w:p><w:r><w:br w:type="page"/></w:r></w:p>' + x; continue; }
 if ((b.t === 'chapter' || b.t === 'pjch' || b.t === 'memohead') && i > 0 && !['cover', 'examcover', 'pagebreak', 'pjcover'].includes(B[i - 1].t) && !(b.t === 'pjch' && B[i - 1].t === 'pjinfo')) x = '<w:p><w:r><w:br w:type="page"/></w:r></w:p>' + x;
      body += x;
    }
    const cw = DX.cw, hdrSz = DX.base * 0.75;
    const logoRid = 'rIdLogo';
    const lg = await (async () => { const src = headLogo(s); const sz = await imgSize(src); const cv = document.createElement('canvas'); cv.width = sz.w; cv.height = sz.h; const im = new Image(); await new Promise(r => { im.onload = r; im.onerror = r; im.src = src; }); cv.getContext('2d').drawImage(im, 0, 0); return { data: cv.toDataURL('image/png').split(',')[1], ar: sz.w / sz.h }; })();
    const lgH = 9, lgW = Math.min(40, lgH * lg.ar);
    const ftxt = (() => { const ft = s.ft ?? 'Earth & Newton Education'; return (s.au ? 'จัดทำโดย ' + s.au : '') + (s.au && ft ? ' · ' : '') + ft; })();
    const fld = (code) => `<w:r>${rpr({ b: true, color: hex(th.dark), size: hdrSz })}<w:fldChar w:fldCharType="begin"/></w:r><w:r>${rpr({ b: true, color: hex(th.dark), size: hdrSz })}<w:instrText xml:space="preserve"> ${code} </w:instrText></w:r><w:r>${rpr({ b: true, color: hex(th.dark), size: hdrSz })}<w:fldChar w:fldCharType="separate"/></w:r><w:r>${rpr({ b: true, color: hex(th.dark), size: hdrSz })}<w:t>1</w:t></w:r><w:r>${rpr({ b: true, color: hex(th.dark), size: hdrSz })}<w:fldChar w:fldCharType="end"/></w:r>`;
    const pos = s.pnPos || 'br', hl = s.hline || 'dash';
    const pnRuns = () => { const f = s.pnFmt ?? 'หน้า {n}'; const st = { b: true, color: hex(th.dark), size: hdrSz }; return f.split(/(\{n\}|\{N\})/).filter(Boolean).map(x => x === '{n}' ? fld('PAGE') : x === '{N}' ? fld('NUMPAGES') : run(x, st)).join(''); };
    const hBorder = hl === 'none' ? '' : `<w:bottom w:val="${hl === 'solid' ? 'single' : 'dashed'}" w:sz="4" w:space="2" w:color="${hex(th.sep)}"/>`;
    const mkHeader = withPn => `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:hdr ${NS}>${para([withPn && pos === 'tl' ? pnRuns() + run('   ', {}) : '', run(s.hl, { u: true, color: hex(th.dark), size: hdrSz }), tabRun({}), s.nologo ? '' : drawing(logoRid, lgW, lgH, 1), withPn && pos === 'tc' ? pnRuns() : '', tabRun({}), run(s.hr, { i: true, u: true, color: hex(th.dark), size: hdrSz }), withPn && pos === 'tr' ? run('   ', {}) + pnRuns() : ''], { tabs: [['center', Math.round(cw / 2)], ['right', cw]], border: hBorder, after: 0 })}</w:hdr>`;
    const mkFooter = withPn => `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:ftr ${NS}>${para(pos === 'bl' ? [withPn ? pnRuns() : '', tabRun({}), tabRun({}), run(ftxt, { color: hex(th.dark), size: hdrSz })] : [run(ftxt, { color: hex(th.dark), size: hdrSz }), tabRun({}), withPn && pos === 'bc' ? pnRuns() : '', tabRun({}), withPn && pos === 'br' ? pnRuns() : ''], { tabs: [['center', Math.round(cw / 2)], ['right', cw]], after: 0 })}</w:ftr>`;
    const header = mkHeader(pos !== 'none'), footer = mkFooter(pos !== 'none');
    let r1 = (s.pnRules || []).find(r => (+r.a || 1) === 1 && (+r.b || 0) === 1 && (r.m === 'hide' || r.m === 'blank')); const anc = AI > 0; if (anc && !r1) r1 = { m: 'hide' }; const firstH = r1 ? (r1.m === 'blank' ? `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:hdr ${NS}><w:p/></w:hdr>` : mkHeader(false)) : null, firstF = r1 ? (r1.m === 'blank' ? `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:ftr ${NS}><w:p/></w:ftr>` : mkFooter(false)) : null;
    const pgFmt = { arabic: 'decimal', thai: 'thaiNumbers', roman: 'lowerRoman', Roman: 'upperRoman' }[s.pnStyle || 'arabic'];
    const sect = `<w:sectPr><w:headerReference w:type="default" r:id="rIdH"/><w:footerReference w:type="default" r:id="rIdF"/>${firstH && !anc ? '<w:headerReference w:type="first" r:id="rIdH1"/><w:footerReference w:type="first" r:id="rIdF1"/>' : ''}<w:pgSz w:w="11906" w:h="16838"/><w:pgMar w:top="${Math.round(26 * TW)}" w:right="${Math.round(17 * TW)}" w:bottom="${Math.round(20 * TW)}" w:left="${Math.round(18 * TW)}" w:header="${Math.round(8 * TW)}" w:footer="${Math.round(9 * TW)}" w:gutter="0"/><w:pgNumType w:fmt="${pgFmt}" w:start="${+s.pnStart || 1}"/>${firstH && !anc ? '<w:titlePg/>' : ''}</w:sectPr>`;
    if (anc) body = body.replace('%%SECT1%%', `<w:p><w:pPr><w:sectPr><w:headerReference w:type="default" r:id="rIdH1"/><w:footerReference w:type="default" r:id="rIdF1"/><w:pgSz w:w="11906" w:h="16838"/><w:pgMar w:top="${Math.round(26 * TW)}" w:right="${Math.round(17 * TW)}" w:bottom="${Math.round(20 * TW)}" w:left="${Math.round(18 * TW)}" w:header="${Math.round(8 * TW)}" w:footer="${Math.round(9 * TW)}" w:gutter="0"/></w:sectPr></w:pPr></w:p>`);
    const document_ = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:document ${NS}><w:body>${body}${sect}</w:body></w:document>`;
    const styles = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:styles xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:docDefaults><w:rPrDefault><w:rPr><w:rFonts w:ascii="${xesc(DX.font)}" w:hAnsi="${xesc(DX.font)}" w:cs="${xesc(DX.font)}" w:eastAsia="${xesc(DX.font)}"/><w:sz w:val="${DX.base * 2}"/><w:szCs w:val="${DX.base * 2}"/><w:lang w:val="th-TH" w:bidi="th-TH"/></w:rPr></w:rPrDefault><w:pPrDefault><w:pPr><w:spacing w:after="40" w:line="300" w:lineRule="auto"/></w:pPr></w:pPrDefault></w:docDefaults><w:style w:type="paragraph" w:default="1" w:styleId="Normal"><w:name w:val="Normal"/><w:qFormat/></w:style><w:style w:type="paragraph" w:styleId="Heading1"><w:name w:val="heading 1"/><w:basedOn w:val="Normal"/><w:next w:val="Normal"/><w:uiPriority w:val="9"/><w:qFormat/><w:pPr><w:keepNext/><w:outlineLvl w:val="0"/></w:pPr></w:style><w:style w:type="paragraph" w:styleId="Heading2"><w:name w:val="heading 2"/><w:basedOn w:val="Normal"/><w:next w:val="Normal"/><w:uiPriority w:val="9"/><w:qFormat/><w:pPr><w:keepNext/><w:outlineLvl w:val="1"/></w:pPr></w:style><w:style w:type="paragraph" w:styleId="Heading3"><w:name w:val="heading 3"/><w:basedOn w:val="Normal"/><w:next w:val="Normal"/><w:uiPriority w:val="9"/><w:qFormat/><w:pPr><w:keepNext/><w:outlineLvl w:val="2"/></w:pPr></w:style><w:style w:type="table" w:default="1" w:styleId="TableNormal"><w:name w:val="Normal Table"/><w:tblPr><w:tblCellMar><w:left w:w="108" w:type="dxa"/><w:right w:w="108" w:type="dxa"/></w:tblCellMar></w:tblPr></w:style></w:styles>`;
    const settings = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:settings xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:defaultTabStop w:val="720"/><w:characterSpacingControl w:val="doNotCompress"/><w:compat><w:compatSetting w:name="compatibilityMode" w:uri="http://schemas.microsoft.com/office/word" w:val="15"/></w:compat></w:settings>`;
    const rels = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rIdS" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/><Relationship Id="rIdSet" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/settings" Target="settings.xml"/><Relationship Id="rIdH" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/header" Target="header1.xml"/><Relationship Id="rIdF" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/footer" Target="footer1.xml"/>${firstH ? '<Relationship Id="rIdH1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/header" Target="header2.xml"/><Relationship Id="rIdF1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/footer" Target="footer2.xml"/>' : ''}${DX.rels.join('')}</Relationships>`;
    const hrels = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="${logoRid}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/image" Target="media/logo.png"/></Relationships>`;
    const ct = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Default Extension="png" ContentType="image/png"/><Default Extension="jpg" ContentType="image/jpeg"/><Default Extension="gif" ContentType="image/gif"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/><Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/><Override PartName="/word/settings.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.settings+xml"/><Override PartName="/word/header1.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.header+xml"/><Override PartName="/word/footer1.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.footer+xml"/>${firstH ? '<Override PartName="/word/header2.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.header+xml"/><Override PartName="/word/footer2.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.footer+xml"/>' : ''}</Types>`;
    const root = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/></Relationships>`;
    const z = new JSZip();
    z.file('[Content_Types].xml', ct); z.file('_rels/.rels', root);
    z.file('word/document.xml', document_); z.file('word/styles.xml', styles); z.file('word/settings.xml', settings);
    z.file('word/header1.xml', header); z.file('word/footer1.xml', footer);
    z.file('word/_rels/document.xml.rels', rels); z.file('word/_rels/header1.xml.rels', hrels);
    if (firstH) { z.file('word/header2.xml', firstH); z.file('word/footer2.xml', firstF); z.file('word/_rels/header2.xml.rels', hrels); }
    z.file('word/media/logo.png', lg.data, { base64: true });
    DX.media.forEach(m => z.file('word/media/' + m.name, m.b64, { base64: true }));
    busy(true, 'กำลังรวมไฟล์ Word…'); await new Promise(r => setTimeout(r, 0));
    const blob = await z.generateAsync({ type: 'blob', mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
    await saveFile(fname('docx'), blob);
  } catch (e) { console.error(e); toast('สร้างไฟล์ Word ไม่สำเร็จ: ' + e.message); }
  finally { busy(false); }
}
const NS = 'xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:wp="http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing" xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:pic="http://schemas.openxmlformats.org/drawingml/2006/picture"';

$('#bPdf').onclick = exportPDF;
$('#bDocx').onclick = async () => {
  const ok = await ask('ส่งออกเป็นไฟล์ Word', '<p>ในไฟล์ Word สมการจะพิมพ์เป็น LaTeX แบบ <b>$...$</b> ฟอนต์ตามที่ตั้งไว้ในเอกสาร ส่วนรูปวาดจะเป็นรูปภาพ</p><p style="font-size:16px;color:#7b746c">ต้องติดตั้งฟอนต์ TH Sarabun New ในเครื่องก่อนเปิดไฟล์</p>', 'สร้างไฟล์ Word');
  if (ok) exportDOCX();
};

init();

