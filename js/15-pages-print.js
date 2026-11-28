'use strict';
/* ===================== แก้ไขแบบ Pages =====================
   · รูปในบรรทัดข้อความ (วาง/ลาก/แทรกที่เคอร์เซอร์) · ข้อความล้อมรูป (ชิดซ้าย/ขวา) ทั้งรูปในบรรทัดและรูปแยกบล็อก
   · จับมุมย่อขยาย (คงสัดส่วน) แสดงขนาดเป็น ซม. · ลากย้ายรูป
   · แต่งรูป: ครอบตัด หมุน กลับด้าน เส้นขอบ เงา มุมโค้ง ความโปร่งใส
   · พิมพ์ต่อเนื่อง: Backspace/Delete รวมย่อหน้า · ←/→ ข้ามกล่อง · ⌘/Ctrl+Enter แยกย่อหน้าที่เคอร์เซอร์
   · รูปแบบย่อหน้า (ชื่อเรื่อง/หัวข้อ/หัวข้อย่อย/เนื้อความ) · ระยะบรรทัด · ย่อหน้าบรรทัดแรก
   · ตาราง: ลากเลือกหลายช่อง → ผสานเซลล์ / แยกเซลล์ */
(function pgCSS() {
  const s = document.createElement('style');
  s.textContent = `
#flow img.ii{max-width:100%;height:auto;vertical-align:bottom;cursor:pointer;-webkit-user-drag:none}
#flow img.ii[data-wrap="l"]{float:left;margin:3px 12px 4px 0}
#flow img.ii[data-wrap="r"]{float:right;margin:3px 0 4px 12px}
#flow img.ii[data-wrap="c"]{display:block;margin:6px auto}
#flow .b-image img{cursor:pointer;-webkit-user-drag:none}
#flow .blk.fl-l{float:left;width:var(--fw,40%);margin-right:14px;z-index:3}
#flow .blk.fl-r{float:right;width:var(--fw,40%);margin-left:14px;z-index:3}
#flow .blk.fl-l .b-image,#flow .blk.fl-r .b-image{margin:2px 0 4px}
#flow .blk.fl-l .b-image img,#flow .blk.fl-r .b-image img{width:100%!important}
#flow .blk.fl-l~.blk,#flow .blk.fl-r~.blk{display:block}
#flow .blk[data-t="pagebreak"],#flow .blk[data-t="chapter"],#flow .blk[data-t="cover"]{clear:both}
#flow img.isel{outline:2px solid #2f7de1;outline-offset:1px}
.exporting #flow img.isel{outline:none}
#flow .b-para.ps-title{font-size:1.9em;font-weight:700;text-align:center;line-height:1.35;color:var(--brown)}
#ihd{position:fixed;left:0;top:0;z-index:7000;pointer-events:none;display:none}
#ihd.on{display:block}
body:has(.dlg-back.open) #ihd,body:has(.dlg-back.open) #ibar,body:has(.dlg-back.open) #ipop,body:has(.dlg-back.open) #tsbar,.exporting #ihd,.exporting #ibar,.exporting #ipop{display:none!important}
#ihd .ih{position:absolute;width:11px;height:11px;margin:-6px 0 0 -6px;background:#fff;border:1.5px solid #2f7de1;border-radius:2px;pointer-events:auto;box-shadow:0 1px 3px #0003}
#ihd .ih[data-h="nw"],#ihd .ih[data-h="se"]{cursor:nwse-resize}#ihd .ih[data-h="ne"],#ihd .ih[data-h="sw"]{cursor:nesw-resize}
#ihd .ih[data-h="e"],#ihd .ih[data-h="w"]{cursor:ew-resize}#ihd .ih[data-h="n"],#ihd .ih[data-h="s"]{cursor:ns-resize}
#ihd .itip{position:absolute;background:#1f2937;color:#fff;font:13px/1.2 var(--ui-font);padding:3px 7px;border-radius:6px;white-space:nowrap;display:none}
#ihd.drag .itip{display:block}
#ibar{position:fixed;z-index:7001;display:none;gap:2px;align-items:center;background:#fff;border:1px solid var(--ui-line);border-radius:10px;box-shadow:0 6px 20px rgba(0,0,0,.16);padding:3px;font-family:var(--ui-font)}
#ibar.on{display:flex}
#ibar button{border:0;background:none;border-radius:7px;min-width:32px;height:30px;padding:0 7px;font:inherit;font-size:15px;cursor:pointer;color:var(--ui-ink);white-space:nowrap}
#ibar button:hover{background:#f3ece4}#ibar button.on{background:#e6eefc;color:#1d4ed8}
#ibar .sep{width:1px;align-self:stretch;background:var(--ui-line);margin:3px 3px}
#ipop{position:fixed;z-index:7002;display:none;width:290px;background:#fff;border:1px solid var(--ui-line);border-radius:12px;box-shadow:0 10px 30px rgba(0,0,0,.18);padding:10px 12px;font-family:var(--ui-font);font-size:15px}
#ipop.on{display:block}#ipop .r{display:flex;align-items:center;gap:6px;margin:6px 0;flex-wrap:wrap}#ipop .r>label{width:84px;color:var(--ui-mute)}
#ipop input[type=range]{flex:1}#ipop .sw{width:20px;height:20px;border-radius:50%;border:1px solid #0002;cursor:pointer;padding:0}#ipop .sw.on{box-shadow:0 0 0 2px #2f7de1}
#ipop .bt{border:1px solid var(--ui-line);background:#fff;border-radius:7px;padding:2px 8px;font:inherit;font-size:14px;cursor:pointer}#ipop .bt.on{border-color:#2f7de1;color:#1d4ed8;background:#eef4ff}
#imove{position:fixed;z-index:7003;pointer-events:none;opacity:.55;display:none;max-width:160px;max-height:160px;border:1px dashed #2f7de1}
#icaret{position:fixed;z-index:7003;pointer-events:none;width:2px;background:#2f7de1;display:none}
#idrop{position:fixed;z-index:7003;pointer-events:none;height:3px;background:#2f7de1;border-radius:2px;display:none}
#dCrop .crop-st{position:relative;margin:6px auto;user-select:none;-webkit-user-select:none;touch-action:none;background:#eee}
#dCrop .crop-st img{display:block;width:100%;height:100%}
#dCrop .crop-r{position:absolute;outline:2px solid #fff;box-shadow:0 0 0 9999px rgba(0,0,0,.5);cursor:move}
#dCrop .crop-st{overflow:hidden}
#dCrop .crop-r i{position:absolute;width:14px;height:14px;background:#fff;border:2px solid #2f7de1;border-radius:3px;box-sizing:border-box}
#dCrop .crop-r::before,#dCrop .crop-r::after{content:'';position:absolute;inset:33.3% 0;border-top:1px solid #fff8;border-bottom:1px solid #fff8;pointer-events:none}
#dCrop .crop-r::after{inset:0 33.3%;border:0;border-left:1px solid #fff8;border-right:1px solid #fff8}
#imgMenu{position:fixed;z-index:9999}
#flow td.csel{background:rgba(47,125,225,.16)!important;box-shadow:inset 0 0 0 1px #2f7de1}
.cselmode #flow{user-select:none;-webkit-user-select:none}
#tsbar{position:fixed;z-index:7001;display:none;gap:2px;background:#fff;border:1px solid var(--ui-line);border-radius:10px;box-shadow:0 6px 20px rgba(0,0,0,.16);padding:3px;font-family:var(--ui-font)}
#tsbar.on{display:flex}#tsbar button{border:0;background:none;border-radius:7px;height:30px;padding:0 9px;font:inherit;font-size:15px;cursor:pointer}#tsbar button:hover{background:#f3ece4}
#fPS{min-width:118px}#fLH{width:auto}`;
  document.head.appendChild(s);
})();

/* ---------- เครื่องมือทั่วไป ---------- */
const PG = { T: null, raf: 0, drag: null, inl: false, ts: null };
const PG_SH = { s: '0 2px 6px rgba(0,0,0,.28)', m: '0 6px 16px rgba(0,0,0,.30)', f: '0 16px 30px rgba(0,0,0,.35)' };
const PG_PX_CM = 37.795;
function pgEdOf(n) { const e = n && (n.nodeType === 1 ? n : n.parentElement); return e && e.closest && e.closest('#flow [contenteditable="true"]'); }
function pgCaretAt(x, y) {
  if (document.caretRangeFromPoint) return document.caretRangeFromPoint(x, y);
  const p = document.caretPositionFromPoint && document.caretPositionFromPoint(x, y); if (!p) return null;
  const r = document.createRange(); r.setStart(p.offsetNode, p.offset); r.collapse(true); return r;
}
function pgZ(img) { const w = img.offsetWidth; return w ? img.getBoundingClientRect().width / w : 1; }
// สไตล์รูป (เส้นขอบ เงา มุมโค้ง ความโปร่งใส) จากค่า o
function pgApplyLook(img, o) {
  o = o || {}; const bw = +o.bw || 0;
  img.style.border = bw ? `${bw}px solid ${o.bc || '#333333'}` : '';
  img.style.boxShadow = o.sh && PG_SH[o.sh] ? PG_SH[o.sh] : '';
  img.style.borderRadius = +o.rad ? o.rad + 'px' : '';
  img.style.opacity = o.op !== undefined && o.op !== '' && +o.op < 100 ? String(+o.op / 100) : '';
}
const PG_LOOK = ['bw', 'bc', 'sh', 'rad', 'op'];
function pgLookOfInline(img) { const o = {}; PG_LOOK.forEach(k => { if (img.dataset[k] !== undefined) o[k] = img.dataset[k]; }); return o; }

/* ---------- รูปแยกบล็อก: วาดตามค่า (ล้อมข้อความ แต่งรูป) ---------- */
const _fbPg = fillBlock;
fillBlock = function (el, b) {
  _fbPg(el, b);
  if (b.t === 'image') {
    const im = $('img', el); if (im) { im.draggable = false; pgApplyLook(im, b.ist); }
    el.classList.toggle('fl-l', b.wrap === 'l'); el.classList.toggle('fl-r', b.wrap === 'r');
    if (b.wrap === 'l' || b.wrap === 'r') el.style.setProperty('--fw', (b.w || 40) + '%'); else el.style.removeProperty('--fw');
  }
  $$('img.ii', el).forEach(im => { im.draggable = false; });
};
const _abPg = applyBlockStyle;
applyBlockStyle = function (el, b) {
  _abPg(el, b); const st = b.st || {}, inner = el.firstElementChild; if (!inner) return;
  inner.style.lineHeight = st.lh ? (1.7 * st.lh).toFixed(3) : '';
  inner.style.textIndent = st.ti ? st.ti + 'px' : '';
  if (b.t === 'para') inner.classList.toggle('ps-title', b.ps === 'title');
};
// ไม่บันทึกกรอบเลือกรูปลงไฟล์
const _chPg = cleanHTML;
cleanHTML = function (el) { return _chPg(el).replace(/(<img[^>]*?class="[^"]*?)\s+isel(?=[\s"])/g, '$1').split(/(<[^>]*>)/).map((x, i) => i % 2 ? x : x.replace(/\r?\n/g, '<br>')).join(''); };

/* ---------- เลือกรูป + ที่จับ + แถบเครื่องมือ ---------- */
function pgEls() {
  let h = $('#ihd'); if (h) return h;
  h = document.createElement('div'); h.id = 'ihd';
  h.innerHTML = ['nw', 'n', 'ne', 'e', 'se', 's', 'sw', 'w'].map(k => `<div class="ih" data-h="${k}"></div>`).join('') + '<div class="itip"></div>';
  document.body.appendChild(h);
  const bar = document.createElement('div'); bar.id = 'ibar'; document.body.appendChild(bar);
  const pop = document.createElement('div'); pop.id = 'ipop'; document.body.appendChild(pop);
  ['imove', 'icaret', 'idrop'].forEach(id => { const e = document.createElement(id === 'imove' ? 'img' : 'div'); e.id = id; document.body.appendChild(e); });
  bar.addEventListener('mousedown', e => e.preventDefault());
  bar.addEventListener('click', e => { const b = e.target.closest('button'); if (b && b.dataset.a) pgAct(b.dataset.a, b); });
  return h;
}
function pgTarget(img) {
  const blk = img.closest('.blk'); if (!blk) return null;
  if (img.classList.contains('flimg')) return { img, fl: true, blk, id: blk.dataset.id, b: byId(blk.dataset.id), fid: img.dataset.fid };
  if (img.classList.contains('ii')) return { img, inl: true, blk, ed: img.closest('[contenteditable="true"]') };
  return { img, inl: false, blk, id: blk.dataset.id, b: byId(blk.dataset.id) };
}
function pgSelect(img) {
  pgEls(); if (PG.T && PG.T.img !== img) PG.T.img.classList.remove('isel');
  if (!img) { PG.T = null; $('#ihd').classList.remove('on'); $('#ibar').classList.remove('on'); $('#ipop').classList.remove('on'); cancelAnimationFrame(PG.raf); return; }
  PG.T = pgTarget(img); if (!PG.T) return; img.classList.add('isel');
  $('#ihd').classList.add('on'); pgBar(); $('#ibar').classList.add('on'); pgPos(); pgLoop();
}
function pgReselect() { // หลังวาดบล็อกใหม่ หา <img> ตัวใหม่
  const T = PG.T; if (!T) return; if (T.img.isConnected) { pgPos(); return; }
  if (T.fl) { const el = $(`#flow img.flimg[data-fid="${T.fid}"]`); if (el) { PG.T = null; pgSelect(el); return; } }
  else if (!T.inl) { const el = $(`.blk[data-id="${T.id}"] .b-image img`); if (el) { PG.T = null; pgSelect(el); return; } }
  pgSelect(null);
}
function pgLoop() { cancelAnimationFrame(PG.raf); const f = () => { if (!PG.T) return; if (!PG.T.img.isConnected) { pgReselect(); if (!PG.T) return; } if (!PG.drag) pgPos(); PG.raf = requestAnimationFrame(f); }; PG.raf = requestAnimationFrame(f); }
function pgPos() {
  const T = PG.T; if (!T) return; const r = T.img.getBoundingClientRect(), h = $('#ihd');
  const pts = { nw: [0, 0], n: [.5, 0], ne: [1, 0], e: [1, .5], se: [1, 1], s: [.5, 1], sw: [0, 1], w: [0, .5] };
  $$('.ih', h).forEach(e => { const p = pts[e.dataset.h]; e.style.left = (r.left + p[0] * r.width) + 'px'; e.style.top = (r.top + p[1] * r.height) + 'px'; e.style.display = r.width < 6 ? 'none' : ''; });
  const bar = $('#ibar'), bw = bar.offsetWidth || 400, bh = bar.offsetHeight || 36;
  let top = r.top - bh - 12; if (top < 60) top = r.bottom + 12; if (top > innerHeight - bh - 6) top = Math.max(60, r.top + 8);
  bar.style.left = Math.max(6, Math.min(innerWidth - bw - 6, r.left + r.width / 2 - bw / 2)) + 'px'; bar.style.top = top + 'px';
  const pop = $('#ipop'); if (pop.classList.contains('on')) { const br = bar.getBoundingClientRect(); pop.style.left = Math.max(6, Math.min(innerWidth - 300, br.left)) + 'px'; pop.style.top = (br.bottom + 6 + pop.offsetHeight > innerHeight ? Math.max(6, br.top - pop.offsetHeight - 6) : br.bottom + 6) + 'px'; }
}
function pgWrapOf(T) { return T.inl ? (T.img.dataset.wrap || '') : (T.b.wrap || ''); }
function pgBar() {
  if (PG.T && PG.T.fl) return flBar();
  const T = PG.T, w = pgWrapOf(T), on = v => w === v ? ' on' : '';
  const lay = T.inl
    ? `<button data-a="w:" class="${on('')}" title="อยู่ในบรรทัดเหมือนตัวอักษร">▭ ในบรรทัด</button><button data-a="w:l" class="${on('l')}" title="ชิดซ้าย ข้อความล้อมรอบ">◧ ล้อมซ้าย</button><button data-a="w:r" class="${on('r')}" title="ชิดขวา ข้อความล้อมรอบ">◨ ล้อมขวา</button><button data-a="w:c" class="${on('c')}" title="แยกบรรทัด กึ่งกลาง">▣ กลาง</button>`
    : `<button data-a="w:" class="${on('')}" title="รูปแยกบรรทัด (ไม่ล้อมข้อความ)">▣ แยกบรรทัด</button><button data-a="w:l" class="${on('l')}" title="ชิดซ้าย ข้อความด้านล่างไหลล้อมรอบ">◧ ล้อมซ้าย</button><button data-a="w:r" class="${on('r')}" title="ชิดขวา ข้อความด้านล่างไหลล้อมรอบ">◨ ล้อมขวา</button>`;
  $('#ibar').innerHTML = lay + '<span class="sep"></span>' +
    '<button data-a="crop" title="ครอบตัดรูป">✂ ครอบตัด</button><button data-a="rot" title="หมุนตามเข็ม 90°">↻</button><button data-a="rotl" title="หมุนทวนเข็ม 90°">↺</button><button data-a="fh" title="กลับซ้าย–ขวา">⇋</button><button data-a="fv" title="กลับบน–ล่าง">⇅</button>' +
    '<span class="sep"></span><button data-a="look" title="เส้นขอบ เงา มุมโค้ง ความโปร่งใส">🎨 แต่งรูป</button>' +
    ('<button data-a="tofl" title="ลอยอิสระ: ลากไปวางตำแหน่งใดก็ได้บนหน้ากระดาษ">✥ วางอิสระ</button>') +
    (T.inl ? '<button data-a="toblk" title="ทำเป็นรูปแยกบล็อก (มีคำบรรยายภาพได้)">⤓ แยกบล็อก</button>' : '<button data-a="rep" title="เปลี่ยนรูป">⇄</button>') +
    '<button data-a="del" title="ลบรูป">🗑</button>';
}
function pgCommit(T, soft) {
  T = T || PG.T; if (!T) return;
  if (T.fl) { flSave(T); return; }
  if (T.inl) { if (T.ed && T.ed.isConnected) syncFrom(T.ed); changed(true); }
  else { rerender(T.id); changed(true); if (curId === T.id) refreshInspector(); pgReselect(); }
  if (!soft) schedulePaginate();
}
function pgSetWrap(v) {
  const T = PG.T; if (!T) return;
  if (T.inl) { if (v) T.img.dataset.wrap = v; else delete T.img.dataset.wrap; pgCommit(T); }
  else { if (v) { T.b.wrap = v; if (!T.b.w || T.b.w > 70) T.b.w = 40; } else delete T.b.wrap; pgCommit(T); }
  pgBar();
}
async function pgAct(a, btn) {
  const T = PG.T; if (!T) return;
  if (a === 'tofl') { if (T.inl) flFromImg(T); else flFromBlock(T.id); return; }
  if (a.startsWith('w:')) return pgSetWrap(a.slice(2));
  if (a === 'del') { pgDelete(); return; }
  if (a === 'rep') { imgReplace = T.id; $('#imgIn').click(); return; }
  if (a === 'crop') { openCrop(); return; }
  if (a === 'look') { pgLook(); return; }
  if (a === 'toblk') { pgToBlock(); return; }
  if (['rot', 'rotl', 'fh', 'fv'].includes(a)) {
    const src = await pgTransform(T.img.src, a);
    if (T.inl) { const w = T.img.offsetWidth, h = T.img.offsetHeight; T.img.src = src; delete T.img.dataset.orig; delete T.img.dataset.cr; if (a === 'rot' || a === 'rotl') T.img.style.width = Math.round(Math.min(h, T.ed ? T.ed.clientWidth : 600)) + 'px'; }
    else { T.b.src = src; delete T.b.orig; delete T.b.cr; }
    pgCommit(T);
  }
}
function pgDelete() {
  const T = PG.T; if (!T) return; pgSelect(null);
  if (T.fl) { flRemove(T.id, T.fid); return; }
  if (T.inl) { const ed = T.ed; T.img.remove(); if (ed) syncFrom(ed); changed(true); schedulePaginate(); }
  else { const i = idx(T.id); if (i < 0) return; doc.blocks.splice(i, 1); const el = $(`.blk[data-id="${T.id}"]`); if (el) el.remove(); curId = null; changed(true); schedulePaginate(); refreshInspector(); }
}
function pgToBlock() {
  const T = PG.T; if (!T || !T.inl) return; const blk = T.blk, ed = T.ed;
  const w = Math.max(15, Math.min(100, Math.round(T.img.offsetWidth / ($('#flow').offsetWidth || 658) * 100)));
  const nb = newBlock('image', { src: T.img.src, w }); const o = pgLookOfInline(T.img); if (Object.keys(o).length) nb.ist = o;
  pgSelect(null); T.img.remove(); if (ed) syncFrom(ed);
  doc.blocks.splice(idx(blk.dataset.id) + 1, 0, nb); const el = makeEl(nb); blk.after(el); changed(true); schedulePaginate();
  selectBlock(nb.id); setTimeout(() => pgSelect($('.b-image img', el)), 30);
}
// หมุน/กลับด้านด้วย canvas (บันทึกลงในรูปจริง)
function pgLoadImg(src) { return new Promise((ok, no) => { const im = new Image(); im.onload = () => ok(im); im.onerror = no; im.src = src; }); }
function pgOut(cv, src) { return /^data:image\/(png|gif|svg)/.test(src) ? cv.toDataURL('image/png') : cv.toDataURL('image/jpeg', 0.92); }
async function pgTransform(src, a) {
  const im = await pgLoadImg(src); const w = im.naturalWidth, h = im.naturalHeight; const rot = a === 'rot' || a === 'rotl';
  const cv = document.createElement('canvas'); cv.width = rot ? h : w; cv.height = rot ? w : h; const g = cv.getContext('2d');
  if (!/^data:image\/(png|gif|svg)/.test(src)) { g.fillStyle = '#fff'; g.fillRect(0, 0, cv.width, cv.height); }
  if (a === 'rot') { g.translate(h, 0); g.rotate(Math.PI / 2); } else if (a === 'rotl') { g.translate(0, w); g.rotate(-Math.PI / 2); }
  else if (a === 'fh') { g.translate(w, 0); g.scale(-1, 1); } else if (a === 'fv') { g.translate(0, h); g.scale(1, -1); }
  g.drawImage(im, 0, 0); return pgOut(cv, src);
}

/* ---------- แต่งรูป (เส้นขอบ เงา มุมโค้ง ความโปร่งใส) ---------- */
function pgLookGet() { const T = PG.T; return T.inl ? pgLookOfInline(T.img) : Object.assign({}, T.b.ist || {}); }
function pgLookSet(k, v, final) {
  const T = PG.T; if (!T) return;
  if (T.inl) { if (v === '' || v === undefined || v === null) delete T.img.dataset[k]; else T.img.dataset[k] = v; pgApplyLook(T.img, pgLookOfInline(T.img)); if (final) pgCommit(T, true); }
  else { const o = T.b.ist = T.b.ist || {}; if (v === '' || v === undefined || v === null) delete o[k]; else o[k] = v; if (!Object.keys(o).length) delete T.b.ist; pgApplyLook(T.img, T.b.ist); if (final) pgCommit(T, true); }
}
function pgLook() {
  const pop = $('#ipop'); if (pop.classList.contains('on')) { pop.classList.remove('on'); return; }
  const o = pgLookGet(), C = ['#222222', '#7a3e10', '#1f3864', '#c0392b', '#2e8b57', '#b8860b', '#ffffff'];
  pop.innerHTML = `<div class="r"><label>เส้นขอบ</label>${[0, 1, 2, 3, 4, 6].map(v => `<button class="bt${(+o.bw || 0) === v ? ' on' : ''}" data-bw="${v}">${v ? v + ' px' : 'ไม่มี'}</button>`).join('')}</div>
<div class="r"><label>สีขอบ</label>${C.map(c => `<button class="sw${(o.bc || '#333333') === c ? ' on' : ''}" data-bc="${c}" style="background:${c}"></button>`).join('')}<input type="color" data-bcx value="${o.bc || '#333333'}" style="width:30px;height:24px;border:0;padding:0;background:none"></div>
<div class="r"><label>เงา</label>${[['', 'ไม่มี'], ['s', 'อ่อน'], ['m', 'กลาง'], ['f', 'ลอย']].map(([k, t]) => `<button class="bt${(o.sh || '') === k ? ' on' : ''}" data-sh="${k}">${t}</button>`).join('')}</div>
<div class="r"><label>มุมโค้ง</label><input type="range" min="0" max="60" step="1" data-rad value="${+o.rad || 0}"><span class="v">${+o.rad || 0}</span></div>
<div class="r"><label>ความทึบ</label><input type="range" min="10" max="100" step="5" data-op value="${o.op === undefined || o.op === '' ? 100 : +o.op}"><span class="v">${o.op === undefined || o.op === '' ? 100 : +o.op}%</span></div>
<div class="r" style="justify-content:space-between"><button class="bt" data-clr>ล้างการแต่ง</button><button class="bt" data-ok>เสร็จ</button></div>`;
  pop.classList.add('on'); pgPos();
  pop.onmousedown = e => { if (e.target.tagName !== 'INPUT') e.preventDefault(); };
  pop.onclick = e => {
    const b = e.target.closest('button'); if (!b) return; const d = b.dataset;
    if (d.bw !== undefined) { pgLookSet('bw', +d.bw ? d.bw : '', true); if (+d.bw && !pgLookGet().bc) pgLookSet('bc', '#333333', true); }
    else if (d.bc) { pgLookSet('bc', d.bc, false); if (!+pgLookGet().bw) pgLookSet('bw', '2', false); pgCommit(null, true); }
    else if (d.sh !== undefined) pgLookSet('sh', d.sh, true);
    else if (d.clr !== undefined) { PG_LOOK.forEach(k => pgLookSet(k, '', false)); pgCommit(null, true); }
    else if (d.ok !== undefined) { pop.classList.remove('on'); return; }
    pop.classList.remove('on'); pgLook();
  };
  pop.oninput = e => { const t = e.target; if (t.dataset.rad !== undefined) { pgLookSet('rad', +t.value ? t.value : '', false); t.nextElementSibling.textContent = t.value; } if (t.dataset.op !== undefined) { pgLookSet('op', +t.value < 100 ? t.value : '', false); t.nextElementSibling.textContent = t.value + '%'; } if (t.dataset.bcx !== undefined) { pgLookSet('bc', t.value, false); if (!+pgLookGet().bw) pgLookSet('bw', '2', false); } };
  pop.onchange = () => pgCommit(null, true);
}

/* ---------- ครอบตัด ---------- */
function openCrop() {
  const T = PG.T; if (!T) return;
  const orig = T.inl ? (T.img.dataset.orig || T.img.src) : (T.b.orig || T.b.src);
  const cr0 = (T.inl ? (T.img.dataset.cr || '') : (T.b.cr || []).join(',')).split(',').filter(x => x !== '').map(Number);
  let d = $('#dCrop');
  if (!d) {
    d = document.createElement('div'); d.className = 'dlg-back'; d.id = 'dCrop';
    d.innerHTML = `<div class="dlg" style="width:720px"><h3>ครอบตัดรูป</h3><div class="hint" style="margin-bottom:4px">ลากมุมหรือขอบกรอบสีขาวเพื่อเลือกส่วนที่ต้องการ · ลากกลางกรอบเพื่อเลื่อน</div>
<div class="ir" id="crAsp"><button class="tb on" data-asp="0">อิสระ</button><button class="tb" data-asp="1">1:1</button><button class="tb" data-asp="1.3333">4:3</button><button class="tb" data-asp="0.75">3:4</button><button class="tb" data-asp="1.7778">16:9</button><button class="tb" data-asp="o">ตามรูปเดิม</button></div>
<div class="crop-st" id="crSt"><img id="crImg" alt=""><div class="crop-r" id="crR">${['nw', 'n', 'ne', 'e', 'se', 's', 'sw', 'w'].map(k => `<i data-c="${k}"></i>`).join('')}</div></div>
<div class="actions"><button class="tb" id="crReset" style="margin-right:auto">คืนรูปเต็ม</button><button class="tb" id="crNo">ยกเลิก</button><button class="tb primary" id="crOk">ครอบตัด</button></div></div>`;
    document.body.appendChild(d);
  }
  const st = $('#crSt'), R = $('#crR'), im = $('#crImg');
  const C = { x: 0, y: 0, w: 1, h: 1, asp: 0, W: 0, H: 0 };
  const draw = () => { R.style.left = C.x * C.W + 'px'; R.style.top = C.y * C.H + 'px'; R.style.width = C.w * C.W + 'px'; R.style.height = C.h * C.H + 'px'; const p = { nw: [0, 0], n: [.5, 0], ne: [1, 0], e: [1, .5], se: [1, 1], s: [.5, 1], sw: [0, 1], w: [0, .5] }; $$('i', R).forEach(i => { const q = p[i.dataset.c]; i.style.left = q[0] * 100 + '%'; i.style.top = q[1] * 100 + '%'; i.style.transform = `translate(${-q[0] * 100}%,${-q[1] * 100}%)`; i.style.cursor = i.dataset.c + '-resize'; }); };
  im.onload = () => {
    const nw = im.naturalWidth, nh = im.naturalHeight, k = Math.min(660 / nw, 430 / nh, 3); C.W = Math.round(nw * k); C.H = Math.round(nh * k); C.nat = nw / nh;
    st.style.width = C.W + 'px'; st.style.height = C.H + 'px';
    if (cr0.length === 4) [C.x, C.y, C.w, C.h] = cr0; else Object.assign(C, { x: 0, y: 0, w: 1, h: 1 }); draw();
  };
  im.src = orig;
  const fix = () => { // จำกัดในกรอบ + คงสัดส่วน
    C.w = Math.max(0.03, Math.min(1, C.w)); C.h = Math.max(0.03, Math.min(1, C.h));
    if (C.asp) { const want = C.asp * C.H / C.W; if (C.w / C.h > want) C.w = C.h * want; else C.h = C.w / want; if (C.w > 1) { C.w = 1; C.h = 1 / want; } if (C.h > 1) { C.h = 1; C.w = want; } }
    C.x = Math.max(0, Math.min(1 - C.w, C.x)); C.y = Math.max(0, Math.min(1 - C.h, C.y));
  };
  $('#crAsp').onclick = e => { const b = e.target.closest('[data-asp]'); if (!b) return; $$('#crAsp .tb').forEach(x => x.classList.toggle('on', x === b)); C.asp = b.dataset.asp === 'o' ? C.nat : +b.dataset.asp; fix(); draw(); };
  st.onpointerdown = e => {
    e.preventDefault(); const h = e.target.closest('i'), onR = e.target.closest('#crR'); if (!onR && !h) return;
    const s = { x: e.clientX, y: e.clientY, c: Object.assign({}, C), k: h ? h.dataset.c : 'move' }; st.setPointerCapture(e.pointerId);
    st.onpointermove = ev => {
      const dx = (ev.clientX - s.x) / C.W, dy = (ev.clientY - s.y) / C.H, c = s.c, k = s.k;
      if (k === 'move') { C.x = c.x + dx; C.y = c.y + dy; fix(); draw(); return; }
      let x0 = c.x, y0 = c.y, x1 = c.x + c.w, y1 = c.y + c.h;
      if (/w/.test(k)) x0 = Math.min(x1 - .03, Math.max(0, x0 + dx)); if (/e/.test(k)) x1 = Math.max(x0 + .03, Math.min(1, x1 + dx));
      if (/n/.test(k)) y0 = Math.min(y1 - .03, Math.max(0, y0 + dy)); if (/s/.test(k)) y1 = Math.max(y0 + .03, Math.min(1, y1 + dy));
      C.x = x0; C.y = y0; C.w = x1 - x0; C.h = y1 - y0;
      if (C.asp) { const want = C.asp * C.H / C.W; if (/[ns]/.test(k) && !/[ew]/.test(k)) C.w = C.h * want; else C.h = C.w / want; if (/n/.test(k)) C.y = y1 - C.h; if (/w/.test(k)) C.x = x1 - C.w; }
      fix(); draw();
    };
    st.onpointerup = () => { st.onpointermove = null; st.onpointerup = null; };
  };
  $('#crNo').onclick = () => closeDlg('#dCrop');
  $('#crReset').onclick = () => { Object.assign(C, { x: 0, y: 0, w: 1, h: 1 }); fix(); draw(); };
  $('#crOk').onclick = async () => {
    closeDlg('#dCrop'); const full = C.x < .001 && C.y < .001 && C.w > .999 && C.h > .999;
    const src0 = await pgLoadImg(orig); const nw = src0.naturalWidth, nh = src0.naturalHeight;
    const cv = document.createElement('canvas'); cv.width = Math.max(1, Math.round(C.w * nw)); cv.height = Math.max(1, Math.round(C.h * nh));
    const g = cv.getContext('2d'); if (!/^data:image\/(png|gif|svg)/.test(orig)) { g.fillStyle = '#fff'; g.fillRect(0, 0, cv.width, cv.height); }
    g.drawImage(src0, C.x * nw, C.y * nh, C.w * nw, C.h * nh, 0, 0, cv.width, cv.height);
    const out = full ? orig : pgOut(cv, orig), oldW = (cr0[2] || 1), cr = [C.x, C.y, C.w, C.h].map(v => +v.toFixed(4));
    if (T.inl) {
      const w = T.img.offsetWidth; T.img.src = out; if (full) { delete T.img.dataset.orig; delete T.img.dataset.cr; } else { T.img.dataset.orig = orig; T.img.dataset.cr = cr.join(','); }
      T.img.style.width = Math.max(24, Math.round(w * C.w / oldW)) + 'px';
    } else {
      T.b.src = out; if (full) { delete T.b.orig; delete T.b.cr; } else { T.b.orig = orig; T.b.cr = cr; }
      T.b.w = Math.max(10, Math.min(100, Math.round((T.b.w || 60) * C.w / oldW)));
    }
    pgCommit(T); toast(full ? 'คืนรูปเต็มแล้ว' : 'ครอบตัดแล้ว (เปิดครอบตัดอีกครั้งเพื่อปรับหรือคืนรูปเต็มได้)');
  };
  openDlg('#dCrop');
}

/* ---------- เมาส์: เลือก / ย่อขยาย / ย้ายรูป ---------- */
document.addEventListener('pointerdown', e => {
  if (e.button !== 0) return;
  const h = e.target.closest && e.target.closest('#ihd .ih');
  if (h && PG.T) { e.preventDefault(); e.stopPropagation(); pgStartResize(e, h.dataset.h); return; }
  if (e.target.closest && e.target.closest('#ibar,#ipop,#dCrop,.dlg-back')) return;
  const img = e.target.closest && e.target.closest('#flow img.ii, #flow .b-image img');
  if (img) {
    if (img.classList.contains('ii')) { e.preventDefault(); const ed = img.closest('[contenteditable="true"]'); if (ed && document.activeElement !== ed) ed.focus({ preventScroll: true }); }
    const blk = img.closest('.blk'); if (blk && blk.dataset.id !== curId) selectBlock(blk.dataset.id);
    pgSelect(img); PG.drag = { kind: 'maybe', x: e.clientX, y: e.clientY, id: e.pointerId }; return;
  }
  if (PG.T) pgSelect(null);
}, true);
function pgStartResize(e, k) {
  const T = PG.T, r = T.img.getBoundingClientRect(), z = pgZ(T.img);
  const box = T.fl ? $('#flow') : T.inl ? (T.ed || T.blk) : (T.b.wrap ? $('#flow') : $('.b-image', T.blk) || T.blk);
  PG.drag = { kind: 'resize', k, x: e.clientX, y: e.clientY, w0: r.width, h0: r.height, z, boxW: box.getBoundingClientRect().width, ratio: r.height / Math.max(1, r.width) };
  $('#ihd').classList.add('drag'); document.body.style.cursor = getComputedStyle(e.target).cursor;
}
document.addEventListener('pointermove', e => {
  const D = PG.drag; if (!D || !PG.T) return; const T = PG.T;
  if (D.kind === 'maybe') { if (Math.hypot(e.clientX - D.x, e.clientY - D.y) < 6) return; D.kind = 'move'; const g = $('#imove'); g.src = T.img.src; g.style.display = 'block'; $('#ihd').classList.remove('on'); $('#ibar').classList.remove('on'); $('#ipop').classList.remove('on'); document.body.style.cursor = 'grabbing'; }
  if (D.kind === 'resize') {
    const dx = e.clientX - D.x, dy = e.clientY - D.y, k = D.k; let dw;
    if (k === 'n' || k === 's') dw = (k === 's' ? dy : -dy) / D.ratio; else if (k === 'e' || k === 'w') dw = k === 'e' ? dx : -dx;
    else { const sx = /e/.test(k) ? dx : -dx, sy = (/s/.test(k) ? dy : -dy) / D.ratio; dw = Math.abs(sx) > Math.abs(sy) ? sx : sy; }
    const W = Math.max(16, Math.min(D.boxW, D.w0 + dw));
    if (T.inl || T.fl) T.img.style.width = Math.round(W / D.z) + 'px';
    else { const pct = Math.max(10, Math.min(100, Math.round(W / D.boxW * 100))); D.pct = pct; if (T.b.wrap) T.blk.style.setProperty('--fw', pct + '%'); else T.img.style.width = pct + '%'; }
    const r = T.img.getBoundingClientRect(), tip = $('#ihd .itip');
    tip.textContent = `${(r.width / D.z / PG_PX_CM).toFixed(1)} × ${(r.height / D.z / PG_PX_CM).toFixed(1)} ซม.` + (T.inl || T.fl ? '' : ` · ${D.pct || T.b.w || 60}%`);
    tip.style.left = (r.right + 10) + 'px'; tip.style.top = (r.bottom - 10) + 'px'; pgPos(); return;
  }
  if (D.kind === 'move') {
    const g = $('#imove'); g.style.left = (e.clientX + 12) + 'px'; g.style.top = (e.clientY + 12) + 'px';
    const c = $('#icaret'), dl = $('#idrop'); c.style.display = 'none'; dl.style.display = 'none'; D.drop = null;
    if (T.inl) {
      const r = pgCaretAt(e.clientX, e.clientY), ed = r && pgEdOf(r.startContainer);
      if (r && ed && !T.img.contains(r.startContainer)) { const rr = r.getClientRects()[0] || (r.startContainer.nodeType === 1 ? r.startContainer.getBoundingClientRect() : null); if (rr) { c.style.left = rr.left + 'px'; c.style.top = rr.top + 'px'; c.style.height = Math.max(14, rr.height) + 'px'; c.style.display = 'block'; } D.drop = { r, ed }; }
    } else {
      const el = document.elementFromPoint(e.clientX, e.clientY), tb = el && el.closest && el.closest('#flow > .blk');
      if (tb && tb !== T.blk) { const r = tb.getBoundingClientRect(), after = e.clientY > r.top + r.height / 2; dl.style.left = r.left + 'px'; dl.style.width = r.width + 'px'; dl.style.top = ((after ? r.bottom : r.top) - 1) + 'px'; dl.style.display = 'block'; D.drop = { tb, after }; }
    }
  }
}, true);
document.addEventListener('pointerup', e => {
  const D = PG.drag; if (!D) return; PG.drag = null; const T = PG.T; document.body.style.cursor = '';
  $('#ihd').classList.remove('drag'); ['imove', 'icaret', 'idrop'].forEach(id => { const x = $('#' + id); if (x) x.style.display = 'none'; });
  if (!T) return;
  if (D.kind === 'resize') { if (!T.inl && !T.fl && D.pct) T.b.w = D.pct; pgCommit(T); return; }
  if (D.kind === 'move') {
    $('#ihd').classList.add('on'); $('#ibar').classList.add('on');
    if (T.inl && D.drop) { const old = T.ed; D.drop.r.insertNode(T.img); T.ed = D.drop.ed; if (old && old !== T.ed && old.isConnected) syncFrom(old); pgCommit(T); }
    else if (!T.inl && D.drop) {
      const tid = D.drop.tb.dataset.id; const b = T.b; doc.blocks.splice(idx(T.id), 1); const j = idx(tid) + (D.drop.after ? 1 : 0); doc.blocks.splice(j, 0, b);
      if (D.drop.after) D.drop.tb.after(T.blk); else D.drop.tb.before(T.blk); changed(true); schedulePaginate();
    }
    pgPos();
  }
}, true);
document.addEventListener('keydown', e => {
  if (!PG.T || e.isComposing) return;
  if (e.key === 'Escape') { pgSelect(null); return; }
  const a = document.activeElement; if (a && /^(INPUT|TEXTAREA|SELECT)$/.test(a.tagName)) return;
  if (e.key === 'Backspace' || e.key === 'Delete') {
    const s = getSelection(); if (PG.T.inl && s.rangeCount && !s.isCollapsed && !s.getRangeAt(0).intersectsNode(PG.T.img)) { pgSelect(null); return; }
    e.preventDefault(); e.stopImmediatePropagation(); pgDelete(); return;
  }
  if (!/^(Shift|Meta|Control|Alt)$/.test(e.key)) pgSelect(null);
}, true);
addEventListener('resize', () => PG.T && pgPos());

/* ---------- แทรกรูปในบรรทัด ---------- */
async function pgInsertInline(files, range) {
  const list = [...files].filter(f => imlIsImg(f)); if (!list.length) return false;
  let ed = range && pgEdOf(range.startContainer);
  if (!ed) return false;
  let last = null;
  for (const f of list) {
    let src; try { src = await readImage(f); } catch (e) { continue; } const im = await pgLoadImg(src).catch(() => null);
    const img = document.createElement('img'); img.className = 'ii'; img.alt = ''; img.src = src; img.draggable = false;
    const maxW = Math.min(ed.clientWidth || 600, 260); img.style.width = Math.round(Math.min(maxW, im ? im.naturalWidth : maxW)) + 'px';
    range.collapse(false); range.insertNode(img); range.setStartAfter(img); range.collapse(true); last = img;
  }
  const s = getSelection(); s.removeAllRanges(); s.addRange(range);
  syncFrom(ed); changed(true); schedulePaginate(); if (last) setTimeout(() => pgSelect(last), 60);
  return true;
}
function pgRangeNow() {
  const s = getSelection(); if (s.rangeCount && pgEdOf(s.getRangeAt(0).startContainer)) return s.getRangeAt(0).cloneRange();
  if (typeof lastRange !== 'undefined' && lastRange && pgEdOf(lastRange.startContainer) && lastRange.startContainer.isConnected) return lastRange.cloneRange();
  return null;
}
// วางรูปขณะพิมพ์ → แทรกในบรรทัดที่เคอร์เซอร์
addEventListener('paste', e => {
  const t = e.target && e.target.closest && e.target.closest('#flow [contenteditable="true"]'); if (!t) return;
  const all = [...((e.clipboardData && e.clipboardData.items) || [])]; const items = all.filter(i => i.type.startsWith('image/'));
  if (!items.length || all.some(i => i.type === 'text/plain')) return;
  const r = pgRangeNow(); if (!r) return; e.preventDefault(); e.stopImmediatePropagation(); pgInsertInline(items.map(i => i.getAsFile()), r);
}, true);
// ลากไฟล์รูปมาวางบนข้อความ → แทรกในบรรทัดตรงจุดที่วาง
addEventListener('drop', e => {
  if (!e.dataTransfer || !e.dataTransfer.files.length) return;
  const r = pgCaretAt(e.clientX, e.clientY), ed = r && pgEdOf(r.startContainer); if (!ed) return;
  if (![...e.dataTransfer.files].some(f => /^image\//.test(f.type))) return;
  e.preventDefault(); e.stopImmediatePropagation(); pgInsertInline(e.dataTransfer.files, r);
}, true);
// ปุ่ม 🖼 รูปภาพ → เลือกแบบแทรก
(function pgImgBtn() {
  const btn = $('#bImg'); if (!btn) return; const inp = $('#imgIn'); const _ch = inp.onchange;
  inp.onchange = async e => { if (PG.flt) { PG.flt = false; const fs = [...e.target.files]; e.target.value = ''; if (typeof flAddFiles === 'function') flAddFiles(fs); return; } if (PG.inl) { PG.inl = false; const r = PG.inlR; PG.inlR = null; const fs = [...e.target.files]; e.target.value = ''; if (!(r && await pgInsertInline(fs, r))) await addImages(fs); return; } return _ch(e); };
  btn.onclick = () => {
    $$('#imgMenu').forEach(m => m.remove()); const r0 = pgRangeNow();
    const m = document.createElement('div'); m.className = 'tmenu'; m.id = 'imgMenu';
    m.innerHTML = `<button data-k="blk">▣ รูปแยกบรรทัด (มีคำบรรยายภาพได้)</button><button data-k="flt">✥ รูปลอยอิสระ (ลากวางตรงไหนก็ได้)</button><button data-k="inl"${r0 ? '' : ' disabled style="opacity:.45" title="คลิกในข้อความก่อน"'}>▭ รูปในบรรทัดข้อความ ที่เคอร์เซอร์</button><hr><div class="tmh">ทิป: ลากรูปจากเครื่องมาวางบนข้อความ หรือคัดลอกแล้ววาง (⌘V) ขณะพิมพ์ ก็แทรกในบรรทัดได้</div>`;
    document.body.appendChild(m); const r = btn.getBoundingClientRect(); m.style.left = Math.min(r.left, innerWidth - 360) + 'px'; m.style.top = (r.bottom + 4) + 'px'; m.style.maxWidth = '350px';
    const off = ev => { if (!m.contains(ev.target)) { m.remove(); document.removeEventListener('mousedown', off, true); } }; setTimeout(() => document.addEventListener('mousedown', off, true), 0);
    m.addEventListener('mousedown', ev => ev.preventDefault());
    m.onclick = ev => { const k = ev.target.closest('button')?.dataset.k; if (!k || ev.target.closest('button').disabled) return; m.remove(); document.removeEventListener('mousedown', off, true); imgReplace = null; if (k === 'inl') { PG.inl = true; PG.inlR = r0; } if (k === 'flt') PG.flt = true; $('#imgIn').click(); };
  };
})();
// ส่งออก Word: เตรียมขนาดรูปในบรรทัดไว้ล่วงหน้า
const PG_ISZ = {};
(function () {
  const _dx = exportDOCX;
  exportDOCX = async function () {
    const srcs = new Set(); doc.blocks.forEach(b => Object.values(b).forEach(v => { if (typeof v === 'string' && v.includes('class="ii')) { const d = document.createElement('div'); d.innerHTML = v; $$('img.ii', d).forEach(i => srcs.add(i.getAttribute('src'))); } }));
    for (const s of srcs) if (!PG_ISZ[s]) PG_ISZ[s] = await imgSize(s);
    return _dx.apply(this, arguments);
  };
  const bd = $('#bDocx'); if (bd) bd.onclick = () => exportDOCX();
})();

/* ---------- พิมพ์ต่อเนื่องระหว่างย่อหน้า ---------- */
const PG_TXT = new Set(['para', 'given', 'section', 'subsection', 'h3']);
function pgOne(blk) { return blk && PG_TXT.has(blk.dataset.t) && edsOf(blk).length === 1; }
function pgMerge(aId, bId) { // ย้ายข้อความของ b ไปต่อท้าย a
  const A = byId(aId), B = byId(bId); if (!A || !B) return;
  const ah = String(A.html || '').replace(/(<br>\s*)+$/, '');
  A.html = ah + '<span id="pgmk"></span>' + String(B.html || '');
  doc.blocks.splice(idx(bId), 1); const be = $(`.blk[data-id="${bId}"]`); if (be) be.remove();
  rerender(aId); selectBlock(aId); const el = $(`.blk[data-id="${aId}"]`), ed = el && edsOf(el)[0]; if (!ed) return;
  ed.focus({ preventScroll: true }); const mk = $('#pgmk', el);
  if (mk) { const r = document.createRange(); r.setStartBefore(mk); r.collapse(true); const s = getSelection(); s.removeAllRanges(); s.addRange(r); mk.remove(); }
  syncFrom(ed); changed(true); schedulePaginate();
}
document.addEventListener('keydown', e => {
  if (e.isComposing || e.altKey || (typeof dlgOpen === 'function' && dlgOpen())) return;
  const t = e.target.closest && e.target.closest('#flow [contenteditable="true"]'); if (!t) return;
  const blk = t.closest('.blk'); if (!blk || !pgOne(blk) || t.closest('li') || t.dataset.cell) return;
  const s = getSelection(); if (!s.rangeCount || !s.isCollapsed) return;
  const M = e.metaKey || e.ctrlKey;
  if (e.key === 'Backspace' && !M && !e.shiftKey) {
    const ci = caretInfo(t); if (!ci.atStart || isEmptyEd(t)) return;
    const pv = blk.previousElementSibling; if (!pgOne(pv) || isBlankPara(byId(pv.dataset.id))) return;
    e.preventDefault(); e.stopImmediatePropagation(); pgMerge(pv.dataset.id, blk.dataset.id); return;
  }
  if (e.key === 'Delete' && !M) {
    const ci = caretInfo(t); if (!ci.atEnd) return; const nx = blk.nextElementSibling; if (!pgOne(nx)) return;
    e.preventDefault(); e.stopImmediatePropagation(); pgMerge(blk.dataset.id, nx.dataset.id); return;
  }
  if ((e.key === 'ArrowLeft' || e.key === 'ArrowRight') && !M && !e.shiftKey) {
    const ci = caretInfo(t), dir = e.key === 'ArrowLeft' ? -1 : 1;
    if ((dir < 0 && ci.atStart) || (dir > 0 && ci.atEnd)) { if (moveTo(blk, dir)) { e.preventDefault(); e.stopImmediatePropagation(); const ne = document.activeElement && document.activeElement.closest('.blk'); if (ne) selectBlock(ne.dataset.id); } }
    return;
  }
  if (e.key === 'Enter' && M && !e.shiftKey) { // แยกย่อหน้าที่ตำแหน่งเคอร์เซอร์
    const ci = caretInfo(t); if (ci.atEnd) return;
    e.preventDefault(); e.stopImmediatePropagation();
    const r = s.getRangeAt(0), tail = document.createRange(); tail.selectNodeContents(t); tail.setStart(r.endContainer, r.endOffset);
    const box = document.createElement('div'); box.appendChild(tail.extractContents()); const html = cleanHTML(box).replace(/^(<br>\s*)+/, '');
    syncFrom(t); const b = byId(blk.dataset.id), nb = newBlock(b.t === 'given' ? 'given' : b.t, { html }); if (b.st) nb.st = JSON.parse(JSON.stringify(b.st)); if (b.ps) nb.ps = b.ps;
    doc.blocks.splice(idx(b.id) + 1, 0, nb); const ne = makeEl(nb); blk.after(ne); changed(true); schedulePaginate();
    selectBlock(nb.id); caretToStart(edsOf(ne)[0]);
  }
}, true);

/* ---------- รูปแบบย่อหน้า + ระยะบรรทัด (แถบจัดรูปแบบ) ---------- */
const PG_PS = [['title', 'ชื่อเรื่อง'], ['section', 'หัวข้อ'], ['subsection', 'หัวข้อย่อย'], ['h3', 'หัวข้อแถบสี'], ['para', 'เนื้อความ']];
const PG_LH = [['0.85', 'แน่น'], ['', '1.0'], ['1.15', '1.15'], ['1.3', '1.3'], ['1.5', '1.5'], ['2', '2.0']];
function pgPSof(b) { return !b ? '' : b.t === 'para' && b.ps === 'title' ? 'title' : PG_PS.some(p => p[0] === b.t) ? b.t : ''; }
(function pgFbar() {
  const fb = $('#fbar'); if (!fb) return;
  const ps = document.createElement('select'); ps.id = 'fPS'; ps.title = 'รูปแบบย่อหน้า';
  ps.innerHTML = '<option value="" disabled>รูปแบบย่อหน้า</option>' + PG_PS.map(([k, t]) => `<option value="${k}">${t}</option>`).join('');
  fb.insertBefore(ps, fb.firstChild); const sp = document.createElement('span'); sp.className = 'sep'; ps.after(sp);
  const lh = document.createElement('select'); lh.id = 'fLH'; lh.title = 'ระยะห่างระหว่างบรรทัด';
  lh.innerHTML = '<option value="" disabled>↕ ระยะบรรทัด</option>' + PG_LH.map(([k, t]) => `<option value="${k || '1'}">↕ ${t}</option>`).join('');
  const jf = $('#fbar [data-x="justifyFull"]'); if (jf) jf.after(lh); else fb.appendChild(lh);
  let off = 0, edId = null;
  const remember = () => { const s = getSelection(); const ed = s.rangeCount && pgEdOf(s.getRangeAt(0).startContainer); if (!ed) return; const r = document.createRange(); r.selectNodeContents(ed); r.setEnd(s.getRangeAt(0).startContainer, s.getRangeAt(0).startOffset); off = r.toString().length; edId = ed.closest('.blk').dataset.id; };
  const restore = id => { const el = $(`.blk[data-id="${id}"]`); const ed = el && edsOf(el)[0]; if (!ed) return; ed.focus({ preventScroll: true }); const w = document.createTreeWalker(ed, NodeFilter.SHOW_TEXT); let n, k = off; while ((n = w.nextNode())) { if (k <= n.length) { const r = document.createRange(); r.setStart(n, k); r.collapse(true); const s = getSelection(); s.removeAllRanges(); s.addRange(r); return; } k -= n.length; } placeCaretEnd(ed); };
  [ps, lh].forEach(x => x.addEventListener('mousedown', remember));
  ps.onchange = () => {
    const v = ps.value, L = (selIds().length ? selIds() : (curId ? [curId] : [])).map(byId).filter(b => b && pgPSof(b));
    if (!L.length) { toast('คลิกในย่อหน้า หัวข้อ หรือข้อความก่อน'); pgSync(); return; }
    L.forEach(b => { if (v === 'title') { b.t = 'para'; b.ps = 'title'; } else { b.t = v; delete b.ps; } if (b.t === 'h3' && !b.tone) b.tone = 'navy'; rerender(b.id); });
    changed(true); schedulePaginate(); refreshInspector(); restore(edId && L.some(b => b.id === edId) ? edId : L[0].id);
  };
  lh.onchange = () => { const v = lh.value; if (!curId) { toast('คลิกในข้อความก่อน'); return; } setSt('lh', v === '1' ? '' : +v); schedulePaginate(); if (edId) restore(edId); };
})();
function pgSync() {
  const ps = $('#fPS'), lh = $('#fLH'); if (!ps) return; const b = curId && byId(curId);
  const v = pgPSof(b); ps.value = v; ps.disabled = !v;
  const l = b && b.st && b.st.lh; lh.value = l ? String(l) : '1';
}
document.addEventListener('selectionchange', () => { clearTimeout(PG.pst); PG.pst = setTimeout(pgSync, 80); });
const _riPg = refreshInspector;
refreshInspector = function () { const r = _riPg.apply(this, arguments); pgSync(); return r; };
// แผงตั้งค่า: ระยะบรรทัด ย่อหน้าบรรทัดแรก · การจัดวางรูป
const _extPg = extInspector;
extInspector = function (b) {
  let h = _extPg(b); const st = b.st || {};
  if (PG_TXT.has(b.t) || ['box', 'idea', 'check', 'caution', 'solution', 'question', 'answer'].includes(b.t)) {
    h += `<div class="sec">ย่อหน้า</div>
    ${PG_TXT.has(b.t) ? `<div class="ir"><label>รูปแบบ</label>${sel('data-pgps', PG_PS, pgPSof(b))}</div>` : ''}
    <div class="ir"><label>ระยะบรรทัด</label>${sel('data-stn="lh"', PG_LH, st.lh ? String(st.lh) : '')}</div>
    <div class="ir"><label>ย่อหน้าบรรทัดแรก</label>${sel('data-stn="ti"', [['', 'ไม่มี'], ['19', '0.5 ซม.'], ['38', '1 ซม.'], ['57', '1.5 ซม.'], ['76', '2 ซม.'], ['94', '2.5 ซม.']], st.ti ? String(st.ti) : '')}</div>`;
  }
  if (b.t === 'image') {
    h += `<div class="sec">การจัดวางรูป</div><div class="ir"><label>ข้อความ</label>${sel('data-pgwrap', [['', 'แยกบรรทัด'], ['l', 'ล้อมรูป · รูปชิดซ้าย'], ['r', 'ล้อมรูป · รูปชิดขวา']], b.wrap || '')}</div>
    <div class="ir"><button class="tb" data-pga="crop">✂ ครอบตัด</button><button class="tb" data-pga="rot">↻ หมุน</button><button class="tb" data-pga="fh">⇋ กลับด้าน</button><button class="tb" data-pga="look">🎨 แต่งรูป</button></div>`;
  }
  return h;
};
document.addEventListener('change', e => {
  const t = e.target; if (!t.dataset || (t.dataset.pgps === undefined && t.dataset.pgwrap === undefined)) return; e.stopImmediatePropagation();
  if (t.dataset.pgps !== undefined) { const ps = $('#fPS'); if (ps) { ps.value = t.value; ps.onchange(); } }
  if (t.dataset.pgwrap !== undefined) { const b = curId && byId(curId); if (!b || b.t !== 'image') return; if (t.value) { b.wrap = t.value; if (!b.w || b.w > 70) b.w = 40; } else delete b.wrap; rerender(b.id); changed(true); schedulePaginate(); refreshInspector(); }
}, true);
document.addEventListener('click', e => {
  const btn = e.target.closest && e.target.closest('[data-pga]'); if (!btn) return; const b = curId && byId(curId); if (!b || b.t !== 'image') return;
  const img = $(`.blk[data-id="${b.id}"] .b-image img`); if (!img) return; pgSelect(img); pgAct(btn.dataset.pga);
}, true);

/* ---------- ตาราง: ลากเลือกหลายช่อง → ผสาน / แยกเซลล์ ---------- */
function pgCellOf(n) { const td = n && n.closest && n.closest('#flow td[data-cell]'); return td && !td.closest('tr.rephd') ? td : null; }
function pgRect(b, a, z) { // ขยายกรอบให้ครอบช่องที่ผสานอยู่แล้วทั้งหมด
  let r0 = Math.min(a[0], z[0]), r1 = Math.max(a[0], z[0]), c0 = Math.min(a[1], z[1]), c1 = Math.max(a[1], z[1]); const { span } = tblSpans(b); let ch = true;
  while (ch) { ch = false; Object.entries(span).forEach(([k, v]) => { const [i, j] = k.split(',').map(Number), i2 = i + v[0] - 1, j2 = j + v[1] - 1; if (i2 < r0 || i > r1 || j2 < c0 || j > c1) return; if (i < r0) { r0 = i; ch = true; } if (j < c0) { c0 = j; ch = true; } if (i2 > r1) { r1 = i2; ch = true; } if (j2 > c1) { c1 = j2; ch = true; } }); }
  return { r0, r1, c0, c1 };
}
function pgPaintCells() {
  $$('#flow td.csel').forEach(td => td.classList.remove('csel')); const S = PG.ts; const bar = $('#tsbar'); if (!S || !S.z) { if (bar) bar.classList.remove('on'); return; }
  const b = byId(S.id); if (!b) return; const R = S.R = pgRect(b, S.a, S.z); const { span } = tblSpans(b); let n = 0, any = false;
  $$(`.blk[data-id="${S.id}"] td[data-cell]`).forEach(td => { if (td.closest('tr.rephd')) return; const [i, j] = td.dataset.cell.split(',').map(Number); if (i >= R.r0 && i <= R.r1 && j >= R.c0 && j <= R.c1) { td.classList.add('csel'); n++; if (span[td.dataset.cell]) any = true; } });
  S.n = n; S.any = any; pgTsBar();
}
function pgTsBar() {
  let bar = $('#tsbar'); if (!bar) { bar = document.createElement('div'); bar.id = 'tsbar'; document.body.appendChild(bar); bar.addEventListener('mousedown', e => e.preventDefault()); bar.addEventListener('click', e => { const k = e.target.closest('button')?.dataset.k; if (k) pgCellAct(k); }); }
  const S = PG.ts; if (!S || (S.n < 2 && !S.any)) { bar.classList.remove('on'); return; }
  bar.innerHTML = (S.n > 1 ? `<button data-k="merge">⊞ ผสานเซลล์ (${S.n} ช่อง)</button>` : '') + (S.any ? '<button data-k="split">⊟ แยกเซลล์</button>' : '') + (S.n > 1 ? '<button data-k="clear">⌫ ล้างข้อความ</button>' : '');
  const cs = $$('#flow td.csel'); if (!cs.length) { bar.classList.remove('on'); return; }
  const r = cs.reduce((a, td) => { const q = td.getBoundingClientRect(); return { l: Math.min(a.l, q.left), t: Math.min(a.t, q.top), r: Math.max(a.r, q.right) }; }, { l: 1e9, t: 1e9, r: -1e9 });
  bar.classList.add('on'); bar.style.left = Math.max(6, (r.l + r.r) / 2 - bar.offsetWidth / 2) + 'px'; bar.style.top = Math.max(60, r.t - bar.offsetHeight - 8) + 'px';
}
function pgCellClear() { PG.ts = null; pgPaintCells(); document.body.classList.remove('cselmode'); }
function pgCellAct(k) {
  const S = PG.ts; if (!S || !S.R) return; const b = byId(S.id); if (!b) return; const R = S.R; b.mg = b.mg || {};
  const { cover } = tblSpans(b);
  if (k === 'merge') {
    const parts = []; for (let i = R.r0; i <= R.r1; i++) for (let j = R.c0; j <= R.c1; j++) { const k2 = i + ',' + j; if (cover.has(k2)) continue; const h = (b.rows[i] || [])[j] || ''; if (String(h).replace(/<br>|&nbsp;|\s|​/g, '')) parts.push(h); if (b.rows[i]) b.rows[i][j] = ''; }
    Object.keys(b.mg).forEach(k2 => { const [i, j] = k2.split(',').map(Number); if (i >= R.r0 && i <= R.r1 && j >= R.c0 && j <= R.c1) delete b.mg[k2]; });
    b.rows[R.r0][R.c0] = parts.join('<br>'); const rs = R.r1 - R.r0 + 1, cs = R.c1 - R.c0 + 1; if (rs > 1 || cs > 1) b.mg[R.r0 + ',' + R.c0] = [rs, cs];
    toast(`ผสาน ${S.n} ช่องแล้ว`);
  } else if (k === 'split') {
    Object.keys(b.mg).forEach(k2 => { const [i, j] = k2.split(',').map(Number); if (i >= R.r0 && i <= R.r1 && j >= R.c0 && j <= R.c1) delete b.mg[k2]; }); toast('แยกเซลล์แล้ว');
  } else if (k === 'clear') { for (let i = R.r0; i <= R.r1; i++) for (let j = R.c0; j <= R.c1; j++) if (b.rows[i] && !cover.has(i + ',' + j)) b.rows[i][j] = ''; }
  if (!Object.keys(b.mg).length) delete b.mg;
  pgCellClear(); rerender(b.id); changed(true); schedulePaginate();
  setTimeout(() => { const td = $(`.blk[data-id="${b.id}"] td[data-cell="${R.r0},${R.c0}"]`); const ed = td && (td.isContentEditable ? td : $('[contenteditable="true"]', td) || td); if (ed && ed.focus) { selectBlock(b.id); placeCaretEnd(ed); } }, 30);
}
document.addEventListener('pointerdown', e => {
  if (e.button !== 0) { return; }
  if (e.target.closest && e.target.closest('#tsbar')) return;
  const td = pgCellOf(e.target);
  if (!td) { if (PG.ts && !(e.target.closest && e.target.closest('#insp'))) pgCellClear(); return; }
  const id = td.closest('.blk').dataset.id, ij = td.dataset.cell.split(',').map(Number);
  if (e.shiftKey && PG.ts && PG.ts.id === id) { e.preventDefault(); PG.ts.z = ij; pgPaintCells(); return; }
  PG.ts = { id, a: ij, z: null, down: true, td }; pgPaintCells();
}, true);
document.addEventListener('pointermove', e => {
  const S = PG.ts; if (!S || !S.down) return; const el = document.elementFromPoint(e.clientX, e.clientY); const td = pgCellOf(el);
  if (!td || td.closest('.blk').dataset.id !== S.id) return; const ij = td.dataset.cell.split(',').map(Number);
  if (!S.z && td === S.td) return; if (S.z && S.z[0] === ij[0] && S.z[1] === ij[1]) return;
  if (td === S.td) { S.z = null; pgPaintCells(); document.body.classList.remove('cselmode'); return; }
  S.z = ij; document.body.classList.add('cselmode'); const s = getSelection(); s.removeAllRanges(); pgPaintCells();
}, true);
document.addEventListener('pointerup', () => { if (PG.ts) { PG.ts.down = false; document.body.classList.remove('cselmode'); } }, true);
document.addEventListener('keydown', e => {
  const S = PG.ts; if (!S || !S.z || e.isComposing) return;
  if (e.key === 'Escape') { pgCellClear(); return; }
  if ((e.key === 'Backspace' || e.key === 'Delete') && S.n > 1) { e.preventDefault(); e.stopImmediatePropagation(); pgCellAct('clear'); return; }
  if ((e.metaKey || e.ctrlKey) && e.shiftKey && (e.key === 'm' || e.key === 'M')) { e.preventDefault(); pgCellAct('merge'); return; }
  if (!/^(Shift|Meta|Control|Alt)$/.test(e.key)) pgCellClear();
}, true);
document.addEventListener('scroll', () => { if (PG.ts && PG.ts.z) pgTsBar(); }, true);
// คลิกขวาในช่องที่เลือกไว้หลายช่อง → เมนูผสาน/แยก · ช่องที่ผสานอยู่ → เพิ่มคำสั่ง “แยกเซลล์”
addEventListener('contextmenu', e => {
  const td = pgCellOf(e.target); if (!td) return; const S = PG.ts, id = td.closest('.blk').dataset.id;
  if (S && S.z && S.id === id && td.classList.contains('csel') && S.n > 1) {
    e.preventDefault(); e.stopImmediatePropagation(); tblMenuClose(); const m = document.createElement('div'); m.className = 'tmenu';
    m.innerHTML = `<div class="tmh">ช่องที่เลือก ${S.n} ช่อง</div><button data-k="merge">⊞ ผสานเซลล์</button>${S.any ? '<button data-k="split">⊟ แยกเซลล์</button>' : ''}<button data-k="clear">⌫ ล้างข้อความ</button>`;
    document.body.appendChild(m); m.style.left = e.clientX + 'px'; m.style.top = e.clientY + 'px'; tmenu = m; setTimeout(() => document.addEventListener('mousedown', tblMenuOut, true), 0);
    m.addEventListener('mousedown', ev => ev.preventDefault());
    m.onclick = ev => { const k = ev.target.closest('button')?.dataset.k; if (!k) return; tblMenuClose(); pgCellAct(k); };
    return;
  }
  // เมนูเดิม + แยกเซลล์ / ผสานกับช่องข้างเคียง
  setTimeout(() => {
    if (!tmenu) return; const b = byId(id); if (!b) return; const k0 = td.dataset.cell; const merged = b.mg && b.mg[k0];
    const add = (t, f) => { const x = document.createElement('button'); x.textContent = t; x.onclick = ev => { ev.stopPropagation(); tblMenuClose(); f(); }; tmenu.appendChild(x); };
    const hd = document.createElement('div'); hd.className = 'tmh'; hd.textContent = 'ช่อง'; tmenu.appendChild(hd);
    const ij = k0.split(',').map(Number), v = merged || [1, 1];
    add('⊞ ผสานกับช่องขวา', () => { PG.ts = { id, a: ij, z: [ij[0] + v[0] - 1, ij[1] + v[1]] }; pgPaintCells(); pgCellAct('merge'); });
    add('⊞ ผสานกับช่องล่าง', () => { PG.ts = { id, a: ij, z: [ij[0] + v[0], ij[1] + v[1] - 1] }; pgPaintCells(); pgCellAct('merge'); });
    if (merged) add('⊟ แยกเซลล์', () => { PG.ts = { id, a: ij, z: ij }; pgPaintCells(); pgCellAct('split'); });
    const tip = document.createElement('div'); tip.className = 'tmh'; tip.textContent = 'ทิป: ลากคลุมหลายช่อง แล้วกด “ผสานเซลล์”'; tmenu.appendChild(tip);
  }, 0);
});

/* ===================== พิมพ์แบบ Pages (รอบ 2) =====================
   · Enter = ย่อหน้าใหม่ทันที (แยกที่เคอร์เซอร์) · Shift+Enter = ขึ้นบรรทัดใหม่ในย่อหน้าเดิม
   · เว้นวรรคได้ตามจริง (เคาะกี่ครั้งก็เว้นเท่านั้น) · ระยะ Tab ตั้งได้
   · ลากเลือกข้อความข้ามหลายย่อหน้า → ลบ / พิมพ์ทับ / คัดลอก / ตัด ได้ */
(function () {
  const s = document.createElement('style');
  s.textContent = `#flow [contenteditable="true"]{white-space:pre-wrap}
#flow .mx,#flow .katex{white-space:normal}
#flow .tab{tab-size:var(--tabw,8);-moz-tab-size:var(--tabw,8)}
::highlight(npx){background-color:rgba(47,125,225,.28)}
#flow .blk.xsel-f{background:rgba(47,125,225,.10)}
.xsmode #flow,.xsmode #flow *{user-select:none;-webkit-user-select:none}
#flow .grip,#flow .tools,#flow .vgrip,#flow .gapph{user-select:none;-webkit-user-select:none}`;
  document.head.appendChild(s);
})();
// ระยะ Tab ทั้งเอกสาร (ซม.)
function pgTabApply() { const f = $('#flow'); if (!f) return; const v = doc && doc.settings && +doc.settings.tabw; if (v) f.style.setProperty('--tabw', (v * PG_PX_CM).toFixed(1) + 'px'); else f.style.removeProperty('--tabw'); }
(function () { const _as = applySettings; applySettings = function () { const r = _as.apply(this, arguments); pgTabApply(); return r; }; setTimeout(pgTabApply, 0); })();
(function () {
  const _ex = extInspector;
  extInspector = function (b) {
    let h = _ex(b);
    if (PG_TXT.has(b.t) || ['box', 'idea', 'check', 'caution', 'solution', 'question', 'answer'].includes(b.t)) {
      const v = (doc.settings && doc.settings.tabw) || '';
      h += `<div class="ir"><label>ระยะ Tab (ทั้งเอกสาร)</label>${sel('data-pgtab', [['', 'เดิม (~0.8 ซม.)'], ['0.5', '0.5 ซม.'], ['1', '1 ซม.'], ['1.27', '1.27 ซม.'], ['1.5', '1.5 ซม.'], ['2', '2 ซม.'], ['2.5', '2.5 ซม.']], String(v))}</div>`;
    }
    return h;
  };
  document.addEventListener('change', e => { const t = e.target; if (!t.dataset || t.dataset.pgtab === undefined) return; e.stopImmediatePropagation(); if (t.value) doc.settings.tabw = +t.value; else delete doc.settings.tabw; pgTabApply(); changed(true); schedulePaginate(); }, true);
})();

/* ---------- Enter = ย่อหน้าใหม่ ---------- */
function pgSplitAt(t, blk) {
  const s = getSelection(); if (!s.rangeCount) return; if (!s.isCollapsed) s.getRangeAt(0).deleteContents();
  const r = s.getRangeAt(0), tail = document.createRange(); tail.selectNodeContents(t); tail.setStart(r.endContainer, r.endOffset);
  const box = document.createElement('div'); box.appendChild(tail.extractContents());
  let html = cleanHTML(box).replace(/^(<br>\s*)+/, ''); if (!box.textContent.replace(/[​\s]/g, '') && !box.querySelector('img,.mx,.ic')) html = '';
  t.innerHTML = t.innerHTML.replace(/(<br>\s*)+$/, ''); syncFrom(t);
  const b = byId(blk.dataset.id), heading = ['section', 'subsection', 'h3'].includes(b.t) || b.ps === 'title';
  const nt = heading && !html ? 'para' : b.t, nb = newBlock(nt, { html });
  if (b.st && !(heading && !html)) nb.st = JSON.parse(JSON.stringify(b.st)); if (b.ps && html) nb.ps = b.ps;
  doc.blocks.splice(idx(b.id) + 1, 0, nb); const ne = makeEl(nb); blk.after(ne); changed(true); schedulePaginate();
  selectBlock(nb.id); caretToStart(edsOf(ne)[0]);
}
addEventListener('keydown', e => {
  if (e.key !== 'Enter' || e.isComposing || e.altKey || e.metaKey || e.ctrlKey || e.shiftKey || (typeof dlgOpen === 'function' && dlgOpen())) return;
  if (PG.xs) return;
  const t = e.target.closest && e.target.closest('#flow [contenteditable="true"]'); if (!t) return;
  const blk = t.closest('.blk'); if (!blk || !pgOne(blk) || t.closest('li') || t.dataset.cell || t.dataset.pf) return;
  e.preventDefault(); e.stopImmediatePropagation(); pgSplitAt(t, blk);
}, true);

/* ---------- เลือกข้อความข้ามย่อหน้า ---------- */
PG.xs = null;
function pgXsPaint() {
  $$('#flow .blk.xsel-f').forEach(x => x.classList.remove('xsel-f'));
  const X = PG.xs; if (!X) { if (window.CSS && CSS.highlights) CSS.highlights.delete('npx'); return; }
  if (window.CSS && CSS.highlights && window.Highlight) CSS.highlights.set('npx', new Highlight(...pgXsEds().map(o => o.r)));
  else { // เบราว์เซอร์เก่า: ระบายทั้งกล่องที่อยู่ในช่วง
    let on = false; $$('#flow > .blk').forEach(el => { if (el === X.a) on = true; if (on) el.classList.add('xsel-f'); if (el === X.b) on = false; });
  }
}
function pgXsClear() { if (!PG.xs) return; PG.xs = null; pgXsPaint(); document.body.classList.remove('xsmode'); }
function pgXsSet(r0, r1) { // r0, r1 = จุด (Range ยุบ) สองจุด อยู่คนละกล่อง
  const ed0 = pgEdOf(r0.startContainer), ed1 = pgEdOf(r1.startContainer); if (!ed0 || !ed1) return false;
  let A = { n: r0.startContainer, o: r0.startOffset, ed: ed0 }, B = { n: r1.startContainer, o: r1.startOffset, ed: ed1 };
  const cmp = r0.compareBoundaryPoints(Range.START_TO_START, r1); if (cmp > 0) [A, B] = [B, A];
  const snap = P => { if (P.n.nodeType !== 3 || !window.Intl || !Intl.Segmenter) return; const t = P.n.nodeValue; let best = 0; for (const g of new Intl.Segmenter('th', { granularity: 'grapheme' }).segment(t)) { if (g.index <= P.o) best = g.index; else { if (g.index - P.o < P.o - best) best = g.index; break; } } if (P.o >= t.length) best = t.length; P.o = best; };
  snap(A); snap(B);
  const r = document.createRange(); r.setStart(A.n, A.o); r.setEnd(B.n, B.o);
  PG.xs = { r, A, B, a: A.ed.closest('.blk'), b: B.ed.closest('.blk') }; pgXsPaint(); return true;
}
// ข้อความ / HTML ในช่วงที่เลือก (คงสมการเป็น LaTeX)
function pgXsText() {
  const X = PG.xs; if (!X) return ''; const out = [];
  pgXsEds().forEach(({ ed, r }) => { const d = document.createElement('div'); d.appendChild(r.cloneContents()); $$('.mx', d).forEach(m => m.replaceWith('$' + (m.dataset.tex || '') + '$')); $$('br', d).forEach(b => b.replaceWith('\n')); out.push(d.textContent.replace(/​/g, '')); });
  return out.join('\n');
}
function pgXsHTML() { const out = []; pgXsEds().forEach(({ r }) => { const d = document.createElement('div'); d.appendChild(r.cloneContents()); out.push('<p>' + cleanHTML(d) + '</p>'); }); return out.join(''); }
// ช่องพิมพ์ทุกช่องที่อยู่ในช่วง พร้อมช่วงย่อยภายในแต่ละช่อง
function pgXsEds() {
  const X = PG.xs, res = []; if (!X) return res;
  $$('#flow [contenteditable="true"]').forEach(ed => {
    if (!X.r.intersectsNode(ed)) return; const r = document.createRange(); r.selectNodeContents(ed);
    if (ed === X.A.ed) r.setStart(X.A.n, X.A.o); if (ed === X.B.ed) r.setEnd(X.B.n, X.B.o); res.push({ ed, r });
  });
  return res;
}
function pgXsDelete() {
  const X = PG.xs; if (!X) return; pgXsClear();
  const els = $$('#flow > .blk'), ia = els.indexOf(X.a), ib = els.indexOf(X.b);
  // กล่องที่อยู่ระหว่างกลางทั้งกล่อง → ลบออก
  for (let k = ib - 1; k > ia; k--) { const el = els[k], id = el.dataset.id, j = idx(id); if (j >= 0) doc.blocks.splice(j, 1); el.remove(); }
  // ลบข้อความเฉพาะส่วนที่เลือกในกล่องแรก/กล่องสุดท้าย (รวมช่องย่อยที่อยู่ระหว่างกลาง)
  const eds = pgXsEdsOf(X);
  eds.forEach(({ ed, r }) => { r.deleteContents(); });
  eds.forEach(({ ed }) => { if (ed.isConnected) syncFrom(ed); });
  const aId = X.a.dataset.id, bId = X.b.dataset.id;
  if (X.a !== X.b && pgOne(X.a) && pgOne(X.b)) { pgMerge(aId, bId); return; }
  changed(true); schedulePaginate(); const ed = X.A.ed; ed.focus({ preventScroll: true });
  const rr = document.createRange(); try { rr.setStart(X.A.n, Math.min(X.A.o, X.A.n.nodeType === 3 ? X.A.n.length : X.A.n.childNodes.length)); } catch (err) { rr.selectNodeContents(ed); rr.collapse(false); } rr.collapse(true); const s = getSelection(); s.removeAllRanges(); s.addRange(rr);
}
function pgXsEdsOf(X) { const keep = PG.xs; PG.xs = X; const r = pgXsEds(); PG.xs = keep; return r; }
let pgXd = null;
document.addEventListener('pointerdown', e => {
  if (e.button !== 0) return;
  const ed = pgEdOf(e.target); const inCell = e.target.closest && e.target.closest('td[data-cell]');
  if (PG.xs) { if (e.shiftKey && ed && !inCell) { const p = pgCaretAt(e.clientX, e.clientY); if (p) { e.preventDefault(); pgXsSet(PG.xs.anchor || (() => { const q = document.createRange(); q.setStart(PG.xs.A.n, PG.xs.A.o); return q; })(), p); return; } } pgXsClear(); }
  if (!ed || inCell || (e.target.closest && e.target.closest('img,.mx,.grip,.tools'))) { pgXd = null; return; }
  // Shift+คลิกในอีกย่อหน้า → เลือกข้ามย่อหน้า
  if (e.shiftKey) { const s = getSelection(); if (s.rangeCount) { const cur = s.getRangeAt(0), ced = pgEdOf(cur.startContainer); if (ced && ced.closest('.blk') !== ed.closest('.blk')) { const p = pgCaretAt(e.clientX, e.clientY); if (p) { e.preventDefault(); const a = document.createRange(); a.setStart(cur.startContainer, cur.startOffset); if (pgXsSet(a, p)) PG.xs.anchor = a; return; } } } }
  const p = pgCaretAt(e.clientX, e.clientY); pgXd = p ? { a: p, ed, x: e.clientX, y: e.clientY } : null;
}, true);
document.addEventListener('pointermove', e => {
  if (!pgXd || !(e.buttons & 1)) return;
  const el = document.elementFromPoint(e.clientX, e.clientY); const ed = pgEdOf(el);
  if (!ed || ed === pgXd.ed && !PG.xs) return;
  if (ed.closest('.blk') === pgXd.ed.closest('.blk') && ed === pgXd.ed) { if (PG.xs) { pgXsClear(); } return; }
  const p = pgCaretAt(e.clientX, e.clientY); if (!p) return;
  document.body.classList.add('xsmode'); getSelection().removeAllRanges();
  if (pgXsSet(pgXd.a, p)) PG.xs.anchor = pgXd.a;
  const sc = $('#scroller'), cr = sc.getBoundingClientRect(); if (e.clientY > cr.bottom - 30) sc.scrollTop += 16; else if (e.clientY < cr.top + 30) sc.scrollTop -= 16;
}, true);
document.addEventListener('pointerup', () => { if (pgXd && PG.xs) { document.body.classList.remove('xsmode'); const ed = PG.xs.A.ed; ed.focus({ preventScroll: true }); getSelection().removeAllRanges(); } pgXd = null; }, true);
addEventListener('keydown', e => {
  const X = PG.xs; if (!X || e.isComposing) return;
  const M = e.metaKey || e.ctrlKey;
  if (/^(Shift|Meta|Control|Alt|CapsLock)$/.test(e.key)) return;
  if (M && /^[cxa]$/i.test(e.key) || M && e.code === 'KeyC' || M && e.code === 'KeyX') { if (e.code === 'KeyA') { pgXsClear(); } return; } // ให้ระบบส่ง copy/cut
  if (M && (e.key === 'z' || e.key === 'Z')) { pgXsClear(); return; }
  if (e.key === 'Escape' || /^Arrow/.test(e.key)) { e.preventDefault(); const back = e.key === 'ArrowLeft' || e.key === 'ArrowUp' ? X.A : X.B; pgXsClear(); const ed = back.ed; ed.focus({ preventScroll: true }); const r = document.createRange(); r.setStart(back.n, back.o); r.collapse(true); const s = getSelection(); s.removeAllRanges(); s.addRange(r); return; }
  if (e.key === 'Backspace' || e.key === 'Delete') { e.preventDefault(); e.stopImmediatePropagation(); pgXsDelete(); return; }
  if (e.key === 'Enter') { e.preventDefault(); e.stopImmediatePropagation(); pgXsDelete(); setTimeout(() => { const s = getSelection(); const t = s.rangeCount && pgEdOf(s.getRangeAt(0).startContainer); const blk = t && t.closest('.blk'); if (t && blk && pgOne(blk)) pgSplitAt(t, blk); }, 30); return; }
  if (e.key.length === 1 && !M) { e.preventDefault(); e.stopImmediatePropagation(); pgXsDelete(); setTimeout(() => { document.execCommand('insertText', false, e.key); const s = getSelection(); const t = s.rangeCount && pgEdOf(s.getRangeAt(0).startContainer); if (t) syncFrom(t); }, 30); return; }
  if (e.key === 'Tab') { e.preventDefault(); pgXsClear(); }
}, true);
document.addEventListener('copy', e => { if (!PG.xs) return; e.preventDefault(); e.stopImmediatePropagation(); e.clipboardData.setData('text/plain', pgXsText()); e.clipboardData.setData('text/html', pgXsHTML()); toast('คัดลอกข้อความที่เลือกแล้ว'); }, true);
document.addEventListener('cut', e => { if (!PG.xs) return; e.preventDefault(); e.stopImmediatePropagation(); e.clipboardData.setData('text/plain', pgXsText()); e.clipboardData.setData('text/html', pgXsHTML()); pgXsDelete(); }, true);
document.addEventListener('paste', e => { if (!PG.xs) return; pgXsDelete(); }, true);

/* ===================== PDF แบบเวกเตอร์ (ผ่านหน้าต่างพิมพ์) + ตรวจการจัดหน้า ===================== */
(function lyCSS() {
  const s = document.createElement('style');
  s.textContent = `#npPrint{display:none}
@media print{
  @page{size:A4;margin:0}
  html,body{background:#fff!important;margin:0!important;padding:0!important;height:auto!important;min-height:0!important;overflow:visible!important;width:auto!important}
  body>*:not(#npPrint){display:none!important}
  #npPrint{display:block!important}
  #npPrint .npp{position:relative;width:210mm;height:296.8mm;overflow:hidden;contain:strict;break-after:page;page-break-after:always;background:#fff}
  #npPrint .npp:last-child{break-after:auto;page-break-after:auto}
  #npPrint .npp>div{position:absolute;left:0;width:794px}
  #npPrint .sheet{box-shadow:none!important}
  *{-webkit-print-color-adjust:exact!important;print-color-adjust:exact!important}
}
#lyBody .ly-row{display:flex;align-items:center;gap:8px;padding:7px 10px;border:1px solid var(--ui-line);border-radius:9px;margin-bottom:6px;background:#fff}
#lyBody .ly-pg{flex:none;width:58px;color:var(--ui-mute);font-size:14px}
#lyBody .ly-t{flex:1;min-width:0;font-size:16px;line-height:1.35}#lyBody .ly-t small{display:block;color:var(--ui-mute);font-size:13.5px}
#lyBody .ly-k{flex:none;font-size:18px;width:24px;text-align:center}
#lyBody .ly-ok{padding:18px;text-align:center;color:#2e8b57;font-size:18px}
#lyBody .ly-done{opacity:.45}
#pdfMenu{max-width:380px}#pdfMenu button{white-space:normal;line-height:1.3;padding:6px 10px}#pdfMenu button small{display:block;color:var(--ui-mute);font-size:13.5px}`;
  document.head.appendChild(s);
})();

// ระหว่างเตรียมหน้าพิมพ์ ห้ามจัดหน้าใหม่ (มิฉะนั้นจะไปแก้สำเนาหน้าพิมพ์ที่มี #flow ซ้ำ)
const _pagLy = paginate; paginate = function () { if (document.getElementById('npPrint')) return; return _pagLy.apply(this, arguments); };
/* ---------- PDF เวกเตอร์: สร้างหน้ากระดาษทีละหน้าแล้วสั่งพิมพ์ (เลือก “บันทึกเป็น PDF”) ---------- */
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
    if (typeof npGradFix === 'function') npGradFix(st);
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
// ปุ่ม “ส่งออก PDF” → เลือกแบบ
(function lyPdfBtn() {
  const bp = $('#bPdf'); if (!bp) return;
  bp.onclick = () => {
    $$('#pdfMenu').forEach(m => m.remove()); const m = document.createElement('div'); m.className = 'tmenu'; m.id = 'pdfMenu';
    m.innerHTML = `<button data-k="vec"><b>PDF คมชัด (เวกเตอร์) · แนะนำ</b><small>ขยายเท่าไรก็ไม่แตก · เปิดหน้าต่างพิมพ์ → “บันทึกเป็น PDF” (ระยะขอบ: ไม่มี)</small></button>
<button data-k="img"><b>PDF แบบภาพ</b><small>สำรอง ใช้เมื่อแบบเวกเตอร์แสดงผลไม่ตรง · ไฟล์ใหญ่ สร้างนาน</small></button><hr>
<button data-k="chk"><b>🔍 ตรวจการจัดหน้าก่อนส่งออก</b><small>หาตารางล้นขอบ คำถูกตัดกลางคำ รูปสูงเกินหน้า ฯลฯ พร้อมแก้ให้</small></button>`;
    document.body.appendChild(m); const r = bp.getBoundingClientRect(); m.style.left = Math.max(8, Math.min(r.left, innerWidth - 390)) + 'px'; m.style.top = (r.bottom + 4) + 'px';
    const off = ev => { if (!m.contains(ev.target)) { m.remove(); document.removeEventListener('mousedown', off, true); } }; setTimeout(() => document.addEventListener('mousedown', off, true), 0);
    m.onclick = ev => { const k = ev.target.closest('button')?.dataset.k; if (!k) return; m.remove(); document.removeEventListener('mousedown', off, true); if (k === 'img') exportPDF(); else if (k === 'vec') exportPrintPDF(); else openLayoutCheck(); };
  };
})();
scAdd(IS_MAC ? '⌘P' : 'Ctrl+P', 'พิมพ์ / บันทึกเป็น PDF แบบเวกเตอร์', 'ไฟล์', () => exportPrintPDF(), e => M(e) && !e.shiftKey && !e.altKey && e.code === 'KeyP');
addEventListener('beforeprint', () => { if (!$('#npPrint')) toast('แนะนำ: ใช้ปุ่ม “ส่งออก PDF → แบบเวกเตอร์” เพื่อให้แบ่งหน้าตรงกับจอ'); });

/* ---------- ตรวจการจัดหน้า ---------- */
const LY_WORDS = ['เทเบิลเทนนิส', 'นันทนาการ', 'ปฐมนิเทศ', 'สมรรถภาพ', 'แอโรบิก', 'อินเตอร์เซกชัน', 'เบี่ยงเบน', 'ปริภูมิตัวอย่าง', 'เรียงสับเปลี่ยน', 'ความต่อเนื่อง', 'ไม่ต่อเนื่อง', 'ความแปรปรวน', 'คอมพลีเมนต์', 'สัมประสิทธิ์', 'ปฏิยานุพันธ์', 'แฟกทอเรียล', 'ค่าคาดหมาย', 'ฮิสโทแกรม', 'น่าจะเป็น', 'ตัวแปรสุ่ม', 'จุดประสงค์', 'เส้นสัมผัส', 'แคลคูลัส', 'ออยเลอร์', 'อนุพันธ์', 'ปริพันธ์', 'ฟังก์ชัน', 'ตัวชี้วัด', 'เรียนรู้', 'ปาสคาล', 'ยูเนียน', 'ภาระงาน', 'ชิ้นงาน', 'พหุนาม', 'ตรรกยะ', 'ทวินาม', 'เอกรูป', 'สังยุค', 'จัดหมู่', 'ลิมิต', 'เวนน์', 'ต่อเนื่อง', 'ปฏิบัติ', 'บันทึก', 'ข้อตกลง', 'ชีพจร', 'ประเภท', 'จังหวะ', 'ร่างกาย', 'สัปดาห์', 'นักเรียน', 'กิจกรรม', 'การประเมิน', 'ประสิทธิภาพ', 'คุณลักษณะ', 'อันพึงประสงค์', 'สมรรถนะ', 'ตรีโกณมิติ', 'เมทริกซ์', 'เวกเตอร์', 'ลอการิทึม', 'เอกซ์โพเนนเชียล', 'ความน่าจะเป็น', 'สถิติ', 'เรขาคณิต', 'พีชคณิต', 'อสมการ', 'สมการ', 'โรงเรียน', 'มหาวิทยาลัย', 'วิทยาศาสตร์', 'คณิตศาสตร์', 'คอมพิวเตอร์', 'เทคโนโลยี', 'อินเทอร์เน็ต', 'แบบฝึกหัด', 'ใบกิจกรรม', 'ใบความรู้', 'กระบวนการ', 'ทักษะ', 'สาระสำคัญ', 'การวิเคราะห์', 'สังเคราะห์', 'สถานการณ์', 'ผู้อำนวยการ', 'รองผู้อำนวยการ', 'ศาสตราวุฒิ'];
function lyWords() { const own = String((doc.settings && doc.settings.nbw) || '').split(/[\s,]+/).filter(Boolean); return [...new Set([...own, ...LY_WORDS])].sort((a, b) => b.length - a.length); }
const LY = { list: [] };
function lyPage(el) { return Math.floor((el.offsetTop || 0) / (PAGE_H + PAGE_G)) + 1; }
async function lyScan() {
  paginate(); const P = PAGE_H + PAGE_G, ROOM = PAGE_H - TOP - BOT, flow = $('#flow'), z = ($('#flow').getBoundingClientRect().width / $('#flow').offsetWidth) || 1;
  const fr = flow.getBoundingClientRect(), right = fr.left + fr.width + 2 * z; const out = [];
  const els = $$('#flow > .blk');
  els.forEach((el, i) => {
    const b = byId(el.dataset.id); if (!b) return; const pg = lyPage(el);
    // 1) ล้นขอบขวา
    let wide = null; $$('table, img, svg, .katex-display, .b-choices, .mx', el).forEach(x => { if (wide) return; const r = x.getBoundingClientRect(); if (r.width && r.right > right) wide = x; });
    if (wide) { const tb = wide.closest('table'); out.push({ id: b.id, pg, k: '↔', t: tb ? 'ตารางกว้างเกินขอบกระดาษ' : wide.closest('.katex-display,.mx') ? 'สมการยาวเกินขอบกระดาษ' : 'เนื้อหากว้างเกินขอบกระดาษ', d: tb ? 'แก้: ปรับตารางให้พอดีความกว้างหน้า (ตัดบรรทัดในช่อง)' : 'แก้: ลดขนาดตัวอักษรของส่วนนี้ลงเล็กน้อย', fix: tb ? () => { b.full = true; delete b.tw; if (b.cw && String(b.cw).split(',').reduce((a, v) => a + (+v || 0), 0) > 100) delete b.cw; rerender(b.id); } : () => { const st = b.st = b.st || {}; st.fs = Math.max(0.7, (+st.fs || 1) - 0.1).toFixed(2) * 1; rerender(b.id); } }); }
    // 2) สูงเกินหนึ่งหน้า (รูป/รูปวาด ตัดข้ามหน้าไม่ได้)
    if ((b.t === 'image' || b.t === 'figure') && el.offsetHeight > ROOM - 4) out.push({ id: b.id, pg, k: '↕', t: 'รูปสูงเกินหนึ่งหน้า', d: 'แก้: ย่อรูปให้พอดีหนึ่งหน้า', fix: () => { b.w = Math.max(15, Math.floor((b.w || 60) * (ROOM - 30) / el.offsetHeight)); rerender(b.id); } });
    // 3) ย่อหน้าว่างที่ด้านบนสุดของหน้า
    if (isBlankPara(b)) { const t = el.offsetTop - Math.floor(el.offsetTop / P) * P; if (t <= TOP + 6) out.push({ id: b.id, pg, k: '⎵', t: 'บรรทัดว่างอยู่บนสุดของหน้า', d: 'แก้: ลบบรรทัดว่าง', fix: () => { const j = idx(b.id); if (j >= 0) doc.blocks.splice(j, 1); const e2 = $(`.blk[data-id="${b.id}"]`); if (e2) e2.remove(); } }); }
    // 4) หัวข้อค้างท้ายหน้า (เนื้อหาถัดไปอยู่หน้าใหม่)
    if (HEADINGS.has(b.t) && els[i + 1] && lyPage(els[i + 1]) > pg && !['chapter', 'part'].includes(b.t)) out.push({ id: b.id, pg, k: '⤓', t: 'หัวข้อค้างอยู่ท้ายหน้า เนื้อหาไปอยู่หน้าถัดไป', d: 'แก้: ให้หัวข้อนี้ขึ้นหน้าใหม่', fix: () => { b.npg = true; } });
  });
  // 5) หน้าที่เหลือที่ว่างมาก (เพราะส่วนถัดไปถูกดันขึ้นหน้าใหม่)
  const used = {}; els.forEach(el => { const p = Math.floor(el.offsetTop / P); used[p] = Math.max(used[p] || 0, el.offsetTop + el.offsetHeight - p * P); });
  const n = $('#sheets').childElementCount;
  for (let p = 0; p < n - 1; p++) { const u = (used[p] || TOP) - TOP; if (u < ROOM * 0.45 && used[p + 1]) { const first = els.find(el => Math.floor(el.offsetTop / P) === p + 1); const b = first && byId(first.dataset.id); if (b && !b.npg && !(els[els.indexOf(first) - 1] || {}).dataset?.t?.match(/pagebreak/)) out.push({ id: b.id, pg: p + 1, k: '▭', t: `หน้า ${p + 1} เหลือที่ว่างมาก (ใช้ไป ${Math.round(u / ROOM * 100)}%)`, d: 'เพราะส่วนถัดไปยาวเกินที่เหลือ · แก้: ให้ข้อความไหลต่อจากหน้านี้ (ทุกจุดในเอกสาร)', fix: () => { const n = lyFlowAll(); toast(n ? `ปรับให้ข้อความไหลต่อหน้าแล้ว ${n} จุด` : 'ส่วนที่ถูกดันเป็นตาราง/รูป ตัดข้ามหน้าไม่ได้'); } }); } }
  // 6) คำที่ถูกตัดกลางคำตอนขึ้นบรรทัดใหม่
  const W = lyWords(), re = new RegExp(W.map(w => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|'), 'g'); let cnt = 0, t0 = performance.now();
  for (const ed of $$('#flow [contenteditable="true"]')) {
    if (!/[ก-๙]/.test(ed.textContent)) continue;
    const tw = document.createTreeWalker(ed, NodeFilter.SHOW_TEXT, { acceptNode: n => n.parentElement.closest('.nw,.mx,.katex') ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT });
    const hits = []; let tn; while ((tn = tw.nextNode())) { re.lastIndex = 0; let m; while ((m = re.exec(tn.nodeValue))) { const r = document.createRange(); r.setStart(tn, m.index); r.setEnd(tn, m.index + m[0].length); const rs = [...r.getClientRects()].filter(q => q.width > 0); if (rs.length > 1 && Math.abs(rs[0].top - rs[rs.length - 1].top) > 4) hits.push({ tn, i: m.index, w: m[0] }); } }
    if (hits.length) { const blk = ed.closest('.blk'), b = byId(blk.dataset.id); hits.forEach(h => out.push({ id: b.id, pg: lyPage(blk), k: '✂', t: `คำ “${h.w}” ถูกตัดคนละบรรทัด`, d: 'แก้: ห้ามตัดคำนี้ (ทั้งเอกสาร)', word: h.w, fix: () => lyProtect(h.w) })); }
    if (++cnt % 40 === 0 && performance.now() - t0 > 30) { await npYield(); t0 = performance.now(); }
  }
  // คำซ้ำ → รวมเป็นรายการเดียว
  const seen = new Set(); return out.filter(x => { if (!x.word) return true; if (seen.has(x.word)) return false; seen.add(x.word); return true; }).sort((a, b) => a.pg - b.pg);
}
// ห่อคำด้วย <span class="nw a"> ทุกที่ในเอกสาร
function lyProtect(word) {
  const re = new RegExp(word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'); let n = 0;
  const fix = h => h.split(/(<span class="nw[^"]*">[^<]*<\/span>|<[^>]*>)/).map((seg, i) => i % 2 ? seg : seg.replace(re, m => { n++; return `<span class="nw a">${m}</span>`; })).join('');
  const SKIP = new Set(['id', 't', 'svg', 'lib', 'src', 'orig', 'cw', 'al', 'w']);
  const walk = o => { if (Array.isArray(o)) return o.map(x => typeof x === 'string' ? (x.includes(word) && !x.startsWith('data:') ? fix(x) : x) : walk(x)); if (o && typeof o === 'object') { for (const k of Object.keys(o)) { if (SKIP.has(k)) continue; const v = o[k]; if (typeof v === 'string') { if (v.includes(word) && !v.startsWith('data:')) o[k] = fix(v); } else o[k] = walk(v); } } return o; };
  doc.blocks.forEach(b => walk(b)); return n;
}
async function openLayoutCheck() {
  let d = $('#dLayout');
  if (!d) {
    d = document.createElement('div'); d.className = 'dlg-back'; d.id = 'dLayout';
    d.innerHTML = `<div class="dlg" style="width:720px;max-height:90vh;overflow:auto"><h3>ตรวจการจัดหน้า</h3><div id="lyBody"></div>
<div class="ir" style="margin-top:8px"><label style="flex:none">คำที่ห้ามตัดเพิ่มเติม</label><input type="text" id="lyOwn" style="flex:1" placeholder="พิมพ์คำ คั่นด้วยเว้นวรรค เช่น ชื่อคน ศัพท์เฉพาะ"></div>
<div class="actions"><button class="tb" id="lyAgain" style="margin-right:auto">ตรวจอีกครั้ง</button><button class="tb" id="lyClose">ปิด</button><button class="tb primary" id="lyAll">แก้ทั้งหมดที่แก้ได้</button></div></div>`;
    document.body.appendChild(d);
    $('#lyClose').onclick = () => closeDlg('#dLayout'); $('#lyAgain').onclick = () => lyRun();
    $('#lyOwn').onchange = e => { doc.settings.nbw = e.target.value.trim(); changed(true); lyRun(); };
    $('#lyAll').onclick = () => { let k = 0; LY.list.forEach(x => { if (x.fix && !x.done) { try { x.fix(); x.done = true; k++; } catch (e) { } } }); if (k) { renderAll(); changed(true); } toast(k ? `แก้แล้ว ${k} จุด กำลังตรวจซ้ำ…` : 'ไม่มีจุดที่แก้อัตโนมัติได้'); setTimeout(lyRun, 400); };
    $('#lyBody').onclick = e => {
      const b = e.target.closest('button'); if (!b) return; const x = LY.list[+b.dataset.i]; if (!x) return;
      if (b.dataset.a === 'go') { closeDlg('#dLayout'); const el = $(`.blk[data-id="${x.id}"]`); if (el) { selectBlock(x.id); el.scrollIntoView({ block: 'center', behavior: 'smooth' }); } }
      if (b.dataset.a === 'fix' && x.fix && !x.done) { x.fix(); x.done = true; renderAll(); changed(true); b.closest('.ly-row').classList.add('ly-done'); b.remove(); toast('แก้แล้ว'); }
    };
  }
  $('#lyOwn').value = (doc.settings && doc.settings.nbw) || '';
  openDlg('#dLayout'); lyRun();
}
async function lyRun() {
  const B = $('#lyBody'); B.innerHTML = '<div class="ly-ok" style="color:var(--ui-mute)">กำลังตรวจทุกหน้า…</div>'; await paintNow();
  const zw = $('#zoomwrap'), oz = zw.style.zoom; zw.style.zoom = 1;
  try { LY.list = await lyScan(); } finally { zw.style.zoom = oz; }
  if (!LY.list.length) { B.innerHTML = '<div class="ly-ok">✓ ไม่พบปัญหาการจัดหน้า พร้อมส่งออก</div>'; return; }
  const nf = LY.list.filter(x => x.fix).length;
  B.innerHTML = `<div class="hint" style="margin-bottom:6px">พบ ${LY.list.length} จุด · แก้อัตโนมัติได้ ${nf} จุด</div>` + LY.list.map((x, i) => `<div class="ly-row"><span class="ly-k">${x.k}</span><span class="ly-pg">หน้า ${x.pg}</span><span class="ly-t">${esc(x.t)}<small>${esc(x.d)}</small></span><button class="tb" data-a="go" data-i="${i}">ไปที่</button>${x.fix ? `<button class="tb primary" data-a="fix" data-i="${i}">แก้</button>` : ''}</div>`).join('');
}

/* ---------- ให้ย่อหน้ายาวไหลต่อหน้าถัดไป (แยกกล่องที่บรรทัดใหม่) แทนการดันทั้งก้อนขึ้นหน้าใหม่ ---------- */
const LY_FLOW = new Set(['lptext', 'para', 'given', 'pjtext', 'lines']);
function lyCands(ed) { // จุดที่ตัดได้: หลัง <br> ระดับบน หรือหลัง <li> ของรายการระดับบน
  const out = [];
  [...ed.childNodes].forEach(n => { if (n.nodeName === 'BR') out.push({ kind: 'br', n }); else if (n.nodeName === 'OL' || n.nodeName === 'UL') [...n.children].filter(x => x.nodeName === 'LI').forEach((li, m, A) => { if (m < A.length - 1) out.push({ kind: 'li', n: li, list: n, m }); }); });
  return out;
}
function lySplit(b, ed, c) {
  const box = document.createElement('div');
  if (c.kind === 'br') { const r = document.createRange(); r.setStartAfter(c.n); r.setEnd(ed, ed.childNodes.length); box.appendChild(r.extractContents()); c.n.remove(); }
  else {
    const L = c.list, nl = L.cloneNode(false), lis = [...L.children].filter(x => x.nodeName === 'LI');
    lis.slice(c.m + 1).forEach(x => nl.appendChild(x)); if (L.nodeName === 'OL') nl.setAttribute('start', String((+L.getAttribute('start') || 1) + c.m + 1));
    const r = document.createRange(); r.setStartAfter(L); r.setEnd(ed, ed.childNodes.length); const rest = r.extractContents(); box.appendChild(nl); box.appendChild(rest);
  }
  const tail = cleanHTML(box).replace(/^(<br>\s*)+/, ''); if (!tail.replace(/<[^>]+>|​|\s/g, '') && !/class="mx|<img/.test(tail)) return null;
  b.html = cleanHTML(ed).replace(/(<br>\s*)+$/, ''); const nb = JSON.parse(JSON.stringify(b)); nb.id = uid(); nb.html = tail; delete nb.npg; delete nb.sp; delete nb.fl;
  doc.blocks.splice(idx(b.id) + 1, 0, nb); return nb;
}
function lyFlowOnce() {
  paginate(); const P = PAGE_H + PAGE_G, els = $$('#flow > .blk');
  for (let i = 1; i < els.length; i++) {
    const el = els[i], mt = parseFloat(el.style.marginTop) || 0; if (mt < 60) continue;
    const b0 = byId(el.dataset.id); if (!b0 || b0.npg) continue;
    const prev = els[i - 1], prevBot = prev.offsetTop + prev.offsetHeight, p = Math.floor(prev.offsetTop / P), limit = p * P + PAGE_H - BOT; let avail = limit - prevBot - 6;
    let tgt = el, tb = b0, j = i; while (tb && !LY_FLOW.has(tb.t) && j - i < 3 && els[j + 1] && !(parseFloat(els[j + 1].style.marginTop) > 0) && tgt.offsetHeight < 140) { avail -= tgt.offsetHeight; j++; tgt = els[j]; tb = byId(tgt.dataset.id); }
    if (!tb || !LY_FLOW.has(tb.t) || avail < 50) continue;
    const ed = $('[contenteditable="true"]', tgt); if (!ed) continue; const C = lyCands(ed); if (!C.length) continue;
    const tr = tgt.getBoundingClientRect(), z = (tr.height / tgt.offsetHeight) || 1; let pick = null;
    C.forEach(c => { let bot; if (c.kind === 'li') bot = c.n.getBoundingClientRect().bottom; else { const rr = document.createRange(); rr.setStartBefore(c.n); const q = rr.getClientRects(); bot = q.length ? q[q.length - 1].bottom : 1e9; } if ((bot - tr.top) / z + 4 <= avail) pick = c; });
    if (!pick) continue;
    if (!lySplit(tb, ed, pick)) continue; renderAll(); return true;
  }
  return false;
}
function lyFlowAll() { let n = 0; while (n < 60 && lyFlowOnce()) n++; if (n) { changed(true); schedulePaginate(); } return n; }

/* ===================== ประวัติฉบับใน Google Drive + ใช้งานออฟไลน์ ===================== */
(function cxCSS() {
  const s = document.createElement('style');
  s.textContent = `#cxBody .cx-row{display:flex;align-items:center;gap:8px;padding:7px 10px;border:1px solid var(--ui-line);border-radius:9px;margin-bottom:6px;background:#fff}
#cxBody .cx-row.cur{border-color:var(--ui-accent);background:#fffaf4}
#cxBody .cx-t{flex:1;min-width:0;font-size:16px}#cxBody .cx-t small{display:block;color:var(--ui-mute);font-size:13.5px}
#cxBody .cx-pin{border:0;background:none;font-size:18px;cursor:pointer;opacity:.35}#cxBody .cx-pin.on{opacity:1}
#bHist{min-width:34px;padding:2px 8px}#clStat.off{color:#8a6d00}`;
  document.head.appendChild(s);
})();
const cxDate = t => { const d = new Date(t); return d.toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: '2-digit' }) + ' ' + d.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }); };
const cxSize = n => n > 1048576 ? (n / 1048576).toFixed(1) + ' MB' : Math.max(1, Math.round(n / 1024)) + ' KB';
async function cxList(id) {
  const r = await gd(DRIVE + '/' + id + '/revisions?pageSize=200&fields=revisions(id,modifiedTime,size,keepForever,lastModifyingUser/displayName)');
  return (r.revisions || []).sort((a, b) => Date.parse(b.modifiedTime) - Date.parse(a.modifiedTime));
}
async function cxRead(id, rid) { const r = await gd(DRIVE + '/' + id + '/revisions/' + rid + '?alt=media', { raw: true }); return JSON.parse(await r.text()); }
async function openHistory(id) {
  id = id || (doc.cloud && doc.cloud.id);
  if (!id) { toast('งานนี้ยังไม่อยู่ในคลังงาน Google Drive · กด “บันทึก” ก่อน แล้วจึงดูประวัติได้'); return; }
  if (!navigator.onLine) { toast('ต้องต่ออินเทอร์เน็ตเพื่อดูประวัติฉบับใน Drive'); return; }
  if (CLD.user && !tokOk()) { if (!(await clSignIn())) return; }
  let d = $('#dHist');
  if (!d) {
    d = document.createElement('div'); d.className = 'dlg-back'; d.id = 'dHist';
    d.innerHTML = `<div class="dlg" style="width:640px;max-height:90vh;overflow:auto"><h3>ประวัติการแก้ไข</h3><div class="hint" id="cxName" style="margin-bottom:8px"></div><div id="cxBody"></div>
<div class="hint" style="margin-top:6px">Google Drive เก็บฉบับเก่าไว้ราว 30 วัน (สูงสุด 100 ฉบับ) · กด 📌 เพื่อเก็บฉบับนั้นไว้ตลอด</div>
<div class="actions"><button class="tb" id="cxClose">ปิด</button></div></div>`;
    document.body.appendChild(d); $('#cxClose').onclick = () => closeDlg('#dHist');
  }
  const B = $('#cxBody'); B.innerHTML = '<div class="hint">กำลังโหลดรายการฉบับ…</div>'; openDlg('#dHist');
  const name = (CLD.docs.find(x => x.id === id) || {}).name || (doc.cloud && doc.cloud.id === id ? doc.settings.name : '') || 'งาน';
  $('#cxName').textContent = '“' + name + '”';
  let list;
  try { list = await cxList(id); } catch (e) { B.innerHTML = `<div class="hint">โหลดประวัติไม่ได้: ${esc(e.message || e)}</div>`; return; }
  if (!list.length) { B.innerHTML = '<div class="hint">ยังไม่มีฉบับเก่า</div>'; return; }
  B.innerHTML = list.map((r, i) => `<div class="cx-row${i === 0 ? ' cur' : ''}"><button class="cx-pin${r.keepForever ? ' on' : ''}" data-pin="${r.id}" title="${r.keepForever ? 'เก็บไว้ตลอดแล้ว (กดเพื่อยกเลิก)' : 'เก็บฉบับนี้ไว้ตลอด'}">📌</button>
<span class="cx-t">${cxDate(r.modifiedTime)}${i === 0 ? ' · <b>ฉบับปัจจุบัน</b>' : ''}<small>${cxSize(+r.size || 0)}${r.lastModifyingUser ? ' · ' + esc(r.lastModifyingUser.displayName || '') : ''}</small></span>
<button class="tb" data-open="${r.id}" title="เปิดฉบับนี้ในแท็บใหม่ (ไม่กระทบงานปัจจุบัน)">เปิดดู</button>${i ? `<button class="tb primary" data-res="${r.id}">ใช้ฉบับนี้</button>` : ''}</div>`).join('');
  B.onclick = async e => {
    const b = e.target.closest('button'); if (!b) return; const D = b.dataset;
    try {
      if (D.pin) { const on = !b.classList.contains('on'); await gd(DRIVE + '/' + id + '/revisions/' + D.pin + '?fields=id', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ keepForever: on }) }); b.classList.toggle('on', on); toast(on ? 'เก็บฉบับนี้ไว้ตลอดแล้ว' : 'ยกเลิกการเก็บถาวร'); return; }
      const rid = D.open || D.res; if (!rid) return; const r = list.find(x => x.id === rid);
      if (D.open) {
        if (typeof tabFull === 'function' && tabFull()) { toast('แท็บเต็มแล้ว ปิดแท็บที่ไม่ใช้ก่อน'); return; }
        busy(true, 'กำลังเปิดฉบับเก่า…'); await paintNow();
        try { const data = await cxRead(id, rid); delete data.cloud; data.settings = Object.assign(sampleDoc().settings, data.settings || {}); data.settings.name = name + ' (ฉบับ ' + cxDate(r.modifiedTime) + ')'; closeDlg('#dHist'); doc = data; curId = null; applySettings(); renderAll(); hist.stack = []; hist.pos = -1; snapshot(); autosave(); refreshInspector(); $('#scroller').scrollTop = 0; if (typeof clStatus === 'function') clStatus(); toast('เปิดฉบับเก่าในแท็บใหม่แล้ว (ยังไม่ผูกกับคลังงาน)'); }
        finally { busy(false); }
        return;
      }
      if (D.res) {
        const ok = await ask('ใช้ฉบับเก่า', `<p>แทนที่งาน “${esc(name)}” ด้วยฉบับวันที่ <b>${cxDate(r.modifiedTime)}</b> ใช่ไหม?</p><p class="hint">ฉบับปัจจุบันจะยังอยู่ในประวัติ กลับมาใช้ได้ภายหลัง</p>`, 'ใช้ฉบับนี้'); if (!ok) return;
        busy(true, 'กำลังกู้คืนฉบับเก่า…'); await paintNow();
        try {
          if (!(doc.cloud && doc.cloud.id === id)) { await clOpen(id); }
          const data = await cxRead(id, rid); const m = await clMeta(id); const keep = doc.cloud;
          delete data.cloud; data.settings = Object.assign(sampleDoc().settings, data.settings || {}); data.settings.name = doc.settings.name;
          doc = data; doc.cloud = { id, folder: keep.folder || '', rev: (m.appProperties || {}).rev || keep.rev, dirty: true };
          curId = null; applySettings(); renderAll(); hist.stack = []; hist.pos = -1; snapshot(); refreshInspector();
          closeDlg('#dHist'); await clSave({ force: true }); toast('กู้คืนฉบับ ' + cxDate(r.modifiedTime) + ' แล้ว');
        } finally { busy(false); }
      }
    } catch (err) { toast('ทำรายการไม่สำเร็จ: ' + (err.message || err)); }
  };
}
// เมนู ⋯ ของงานในคลัง → เพิ่ม “ประวัติการแก้ไข”
(function () {
  const _m = clMenu;
  clMenu = function (btn, id) {
    _m(btn, id); const m = $$('.cl-menu').pop(); if (!m) return;
    const b = document.createElement('button'); b.textContent = '🕘 ประวัติการแก้ไข…'; b.onclick = ev => { ev.stopPropagation(); m.remove(); openHistory(id); }; m.insertBefore(b, m.lastElementChild);
  };
  const st = $('#clStat'); if (!st) return;
  const h = document.createElement('button'); h.className = 'tb'; h.id = 'bHist'; h.textContent = '🕘'; h.title = 'ประวัติการแก้ไข (ฉบับเก่าใน Google Drive)'; h.onclick = () => openHistory(); st.after(h);
  const vis = () => { h.style.display = doc && doc.cloud && doc.cloud.id ? '' : 'none'; };
  const _cs = clStatus; clStatus = function () { const r = _cs.apply(this, arguments); vis(); return r; }; vis();
})();

/* ---------- ออฟไลน์: ทำงานต่อได้ บันทึกในเครื่อง แล้วส่งขึ้น Drive อัตโนมัติเมื่อกลับมาออนไลน์ ---------- */
const CX_OFF = 'ออฟไลน์ · บันทึกไว้ในเครื่องแล้ว จะส่งขึ้น Drive เมื่อออนไลน์';
(function () {
  const _save = clSave;
  clSave = async function (opts = {}) {
    if (!navigator.onLine) { autosave(); if (doc.cloud && doc.cloud.id) { doc.cloud.dirty = true; clStatus(CX_OFF, true); $('#clStat') && $('#clStat').classList.add('off'); } if (!opts.silent) toast('ตอนนี้ออฟไลน์ งานถูกบันทึกในเครื่องแล้ว จะส่งขึ้น Drive ให้อัตโนมัติเมื่อต่อเน็ตได้'); return false; }
    return _save.apply(this, arguments);
  };
  addEventListener('offline', () => { if (doc && doc.cloud && doc.cloud.id) { clStatus(CX_OFF, true); $('#clStat') && $('#clStat').classList.add('off'); } else toast('ออฟไลน์ · ยังพิมพ์งานต่อได้ตามปกติ'); });
  addEventListener('online', () => {
    const s = $('#clStat'); if (s) s.classList.remove('off');
    if (!(doc && doc.cloud && doc.cloud.id)) { clStatus(); return; }
    if (isDirty() && CLD.user) { if (tokOk()) { clStatus('กำลังซิงก์…'); setTimeout(() => clSave({ silent: true }).then(ok => { if (ok) toast('ออนไลน์แล้ว · ส่งงานที่แก้ตอนออฟไลน์ขึ้น Drive แล้ว'); }), 1200); } else clStatus('ออนไลน์แล้ว · แตะเพื่อบันทึกลง Drive', true); }
    else clStatus();
  });
  if (!navigator.onLine) setTimeout(() => dispatchEvent(new Event('offline')), 1500);
  // ตัวช่วยออฟไลน์ (service worker): เก็บแอปและไลบรารีไว้ในเครื่อง เปิดได้แม้ไม่มีเน็ต
  if ('serviceWorker' in navigator && location.protocol === 'https:') {
    const swReg = () => { navigator.serviceWorker.register('sw.js').catch(e => console.warn('sw', e)); }; if (document.readyState === 'complete') swReg(); else addEventListener('load', swReg);
  }
})();

