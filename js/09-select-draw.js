'use strict';
/* ===================== คลังโลโก้ ===================== */
const LOGO_LIB = [['winged', 'Earth & Newton (มีปีก)'], ['round', 'Earth & Newton (วงกลม)'], ['school', 'ตราโรงเรียนโซ่พิสัยพิทยาคม']];
function myLogos() { try { return JSON.parse(localStorage.getItem('en-logos') || '[]'); } catch (e) { return []; } }
function saveMyLogos(L) { try { localStorage.setItem('en-logos', JSON.stringify(L.slice(0, 8))); } catch (e) { } }
let logoCb = null;
function pickLogo(title, cb) {
  logoCb = cb; $('#lgT').textContent = 'เลือก' + title;
  const mine = myLogos();
  $('#lgList').innerHTML = LOGO_LIB.map(([k, n]) => `<button class="lgc" data-k="${k}"><img src="${LOGOS[k]}" alt="">${esc(n)}</button>`).join('') +
    mine.map((d, i) => `<button class="lgc" data-m="${i}"><img src="${d}" alt="">โลโก้ของฉัน ${i + 1}<span class="x" data-rm="${i}" title="ลบออกจากคลัง">✕</span></button>`).join('') +
    `<button class="lgc" data-def="1"><span style="height:90px;display:flex;align-items:center;font-size:30px;color:#b9aea5">↺</span>ใช้ค่าเริ่มต้น</button>`;
  openDlg('#dLogo');
}
$('#lgList').onclick = e => {
  const rm = e.target.closest('[data-rm]'); if (rm) { e.stopPropagation(); const L = myLogos(); L.splice(+rm.dataset.rm, 1); saveMyLogos(L); pickLogo($('#lgT').textContent.replace(/^เลือก/, ''), logoCb); return; }
  const b = e.target.closest('.lgc'); if (!b) return; closeDlg('#dLogo');
  const d = b.dataset.k ? LOGOS[b.dataset.k] : b.dataset.m !== undefined ? myLogos()[+b.dataset.m] : null;
  if (logoCb) logoCb(d);
};
$('#lgUpBtn').onclick = () => $('#lgUp').click();
$('#lgUp').onchange = async e => {
  const f = e.target.files[0]; if (!f) return; const d = await readImage(f); e.target.value = '';
  const L = myLogos().filter(x => x !== d); L.unshift(d); saveMyLogos(L);
  closeDlg('#dLogo'); if (logoCb) logoCb(d);
};

/* ===================== เลือกหลายกล่อง ลบ คัดลอก วาง ลากย้าย แบบ Pages ===================== */
const CLIP_TAG = 'EN-EDITOR-BLOCKS:';
const IS_MAC = /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent);
const KM = s => IS_MAC ? s : s.replace(/⌘/g, 'Ctrl+').replace(/⌥/g, 'Alt+');
let blockClip = null;
function cloneBlocks(ids) { return ids.map(id => { const c = JSON.parse(JSON.stringify(byId(id))); c.id = uid(); return c; }); }
function enterBlockMode() { blockMode = true; const a = document.activeElement; if (a && a.blur && a.closest && a.closest('#flow')) a.blur(); getSelection().removeAllRanges(); paintSel(); }
function deleteSelected() {
  const ids = selIds(); if (!ids.length) return;
  const first = idx(ids[0]); const set = new Set(ids);
  doc.blocks = doc.blocks.filter(b => !set.has(b.id));
  if (!doc.blocks.length) doc.blocks.push({ id: uid(), t: 'para', html: '' });
  const nb = doc.blocks[Math.min(first, doc.blocks.length - 1)];
  selSet = new Set([nb.id]); curId = nb.id; renderAll(); changed(true); refreshInspector();
  toast(`ลบ ${ids.length} กล่องแล้ว · กด ${KM('⌘Z')} เพื่อย้อนกลับ`);
}
function insertAfterSel(blocks) {
  const ids = selIds(); let at = ids.length ? idx(ids[ids.length - 1]) + 1 : doc.blocks.length;
  doc.blocks.splice(at, 0, ...blocks);
  selSet = new Set(blocks.map(b => b.id)); curId = blocks[0].id; blockMode = true;
  renderAll(); changed(true); refreshInspector();
  const el = $(`.blk[data-id="${curId}"]`); if (el) el.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
}
function copySelected(cut) {
  const ids = selIds(); if (!ids.length) return null;
  blockClip = ids.map(id => JSON.parse(JSON.stringify(byId(id))));
  const txt = CLIP_TAG + JSON.stringify(blockClip);
  try { navigator.clipboard && navigator.clipboard.writeText(txt).catch(() => { }); } catch (e) { }
  if (cut) deleteSelected(); else toast(`คัดลอก ${ids.length} กล่องแล้ว`);
  return txt;
}
function pasteBlocks(list) { if (!list || !list.length) return; insertAfterSel(list.map(b => Object.assign(JSON.parse(JSON.stringify(b)), { id: uid() }))); toast(`วาง ${list.length} กล่องแล้ว`); }
function moveSelected(dir) {
  const ids = selIds(); if (!ids.length) return; const set = new Set(ids);
  const moving = doc.blocks.filter(b => set.has(b.id)); const rest = doc.blocks.filter(b => !set.has(b.id));
  let at = idx(ids[0]) + dir; // ตำแหน่งในรายการเดิม
  const firstIdx = idx(ids[0]), lastIdx = idx(ids[ids.length - 1]);
  if (dir < 0) { if (firstIdx === 0) return; const before = doc.blocks[firstIdx - 1]; at = rest.indexOf(before); }
  else { if (lastIdx >= doc.blocks.length - 1) return; const after = doc.blocks[lastIdx + 1]; at = rest.indexOf(after) + 1; }
  rest.splice(at, 0, ...moving); doc.blocks = rest; renderAll(); changed(true);
}
function ctxAction(a) {
  if (a === 'del') deleteSelected();
  else if (a === 'copy') copySelected(false);
  else if (a === 'cut') copySelected(true);
  else if (a === 'paste') { if (blockClip) pasteBlocks(blockClip); else toast('ยังไม่มีกล่องที่คัดลอกไว้'); }
  else if (a === 'dup') { const ids = selIds(); if (ids.length) insertAfterSel(cloneBlocks(ids)); }
  else if (a === 'up') moveSelected(-1);
  else if (a === 'down') moveSelected(1);
  else if (a === 'all') { selSet = new Set(doc.blocks.map(b => b.id)); curId = doc.blocks[0].id; enterBlockMode(); refreshInspector(); }
  else if (a === 'para') { const ids = selIds(); const b = newBlock('para'); let at = ids.length ? idx(ids[ids.length - 1]) + 1 : doc.blocks.length; doc.blocks.splice(at, 0, b); blockMode = false; selSet = new Set([b.id]); curId = b.id; renderAll(); changed(true); const ed = $(`.blk[data-id="${b.id}"] [contenteditable="true"]`); if (ed) placeCaretEnd(ed); }
  else if (a === 'insert') { openInsertMenu($(`.blk[data-id="${curId}"] .grip`) || $('#bInsert')); }
}
/* ---------- คลิกที่ที่จับ ⠿ ---------- */
flowEl.addEventListener('mousedown', e => {
  const g = e.target.closest('.grip'); if (!g || e.button !== 0) return;
  const id = g.closest('.blk').dataset.id;
  const how = (e.metaKey || e.ctrlKey) ? 'toggle' : e.shiftKey ? 'range' : (selSet.has(id) && selSet.size > 1 ? 'keep' : 'one');
  enterBlockMode(); if (how !== 'keep') selectBlock(id, how); else { curId = id; paintSel(); }
}, true);
/* ---------- ลากกรอบเลือก (คลิกที่ว่างแล้วลาก) ---------- */
let band = null;
$('#scroller').addEventListener('mousedown', e => {
  if (e.button !== 0 || e.target.closest('.blk') || e.target.closest('#insp,#nav,.dlg-back,.menu')) return;
  if (e.target === e.currentTarget && (e.offsetX > e.currentTarget.clientWidth || e.offsetY > e.currentTarget.clientHeight)) return; // แถบเลื่อน
  const st = $('#stage'); const sr = st.getBoundingClientRect(); const z = sr.width / st.offsetWidth || 1;
  if (!e.shiftKey && !e.metaKey && !e.ctrlKey) { selSet = new Set(); curId = null; }
  const base = new Set(selSet);
  enterBlockMode(); refreshInspector();
  const div = document.createElement('div'); div.className = 'band'; st.appendChild(div);
  band = { x0: e.clientX, y0: e.clientY, div, base, z, moved: false };
  e.preventDefault();
});
document.addEventListener('mousemove', e => {
  if (!band) return; const { x0, y0, div, z } = band; band.moved = true;
  const sr = $('#stage').getBoundingClientRect();
  const l = Math.min(x0, e.clientX), t = Math.min(y0, e.clientY), r = Math.max(x0, e.clientX), b = Math.max(y0, e.clientY);
  Object.assign(div.style, { left: (l - sr.left) / z + 'px', top: (t - sr.top) / z + 'px', width: (r - l) / z + 'px', height: (b - t) / z + 'px' });
  const s = new Set(band.base);
  $$('#flow > .blk').forEach(el => { const q = el.getBoundingClientRect(); if (q.bottom > t && q.top < b && q.right > l && q.left < r) s.add(el.dataset.id); });
  selSet = s; const arr = selIds(); curId = arr[0] || null; paintSel();
  const sc = $('#scroller'), cr = sc.getBoundingClientRect(); if (e.clientY > cr.bottom - 30) sc.scrollTop += 18; else if (e.clientY < cr.top + 30) sc.scrollTop -= 18;
});
document.addEventListener('mouseup', () => { if (!band) return; band.div.remove(); band = null; refreshInspector(); });
/* ---------- แป้นพิมพ์ ---------- */
function dlgOpen() { return !!$('.dlg-back.open'); }
document.addEventListener('keydown', e => {
  if (dlgOpen()) return;
  const mod = e.metaKey || e.ctrlKey, k = e.key.toLowerCase();
  const inText = document.activeElement && document.activeElement.closest && document.activeElement.closest('[contenteditable="true"]');
  const inForm = document.activeElement && /^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement.tagName);
  if (mod && k === 'z' && !inForm) { e.preventDefault(); if (e.shiftKey) $('#bRedo').click(); else $('#bUndo').click(); return; }
  if (mod && k === 'y' && !inForm) { e.preventDefault(); $('#bRedo').click(); return; }
  if (mod && k === 's') { e.preventDefault(); $('#bSave').click(); return; }
  if (inForm) return;
  if (inText) {
    if (e.key === 'Escape') { e.preventDefault(); enterBlockMode(); refreshInspector(); }
    return;
  }
  if (!blockMode && !selSet.size) return;
  if (e.key === 'Delete' || e.key === 'Backspace') { e.preventDefault(); deleteSelected(); return; }
  if (mod && k === 'a') { e.preventDefault(); ctxAction('all'); return; }
  if (mod && k === 'd') { e.preventDefault(); ctxAction('dup'); return; }
  if (e.altKey && (e.key === 'ArrowUp' || e.key === 'ArrowDown')) { e.preventDefault(); moveSelected(e.key === 'ArrowUp' ? -1 : 1); return; }
  if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
    e.preventDefault(); const ids = selIds(); if (!ids.length) return;
    const i = idx(e.key === 'ArrowUp' ? ids[0] : ids[ids.length - 1]) + (e.key === 'ArrowUp' ? -1 : 1); const nb = doc.blocks[i]; if (!nb) return;
    if (e.shiftKey) selectBlock(nb.id, 'toggle'); else selectBlock(nb.id); enterBlockMode();
    const el = $(`.blk[data-id="${nb.id}"]`); if (el) el.scrollIntoView({ block: 'nearest' }); return;
  }
  if (e.key === 'Enter') { e.preventDefault(); const el = $(`.blk[data-id="${curId}"]`); const ed = el && $('[contenteditable="true"]', el); if (ed) { blockMode = false; selectBlock(curId); placeCaretEnd(ed); } return; }
  if (e.key === 'Escape') { selSet = new Set(); curId = null; blockMode = false; paintSel(); refreshInspector(); }
});
/* คัดลอก/ตัด/วาง ผ่านคลิปบอร์ดของระบบ (ใช้ข้ามแท็บได้) */
document.addEventListener('copy', e => { if (dlgOpen() || !blockMode || !selSet.size) return; const t = copySelected(false); if (t) { e.clipboardData.setData('text/plain', t); e.preventDefault(); } });
document.addEventListener('cut', e => { if (dlgOpen() || !blockMode || !selSet.size) return; const t = copySelected(true); if (t) { e.clipboardData.setData('text/plain', t); e.preventDefault(); } });
document.addEventListener('paste', e => {
  if (dlgOpen()) return; const t = (e.clipboardData && e.clipboardData.getData('text/plain')) || '';
  if (t.startsWith(CLIP_TAG)) { e.preventDefault(); e.stopPropagation(); try { pasteBlocks(JSON.parse(t.slice(CLIP_TAG.length))); } catch (err) { } return; }
  const inText = document.activeElement && document.activeElement.closest && document.activeElement.closest('[contenteditable="true"]');
  if (!inText && blockMode && blockClip && !t) { e.preventDefault(); pasteBlocks(blockClip); }
}, true);
/* ---------- เมนูคลิกขวา ---------- */
flowEl.addEventListener('contextmenu', e => {
  const blk = e.target.closest('.blk'); if (!blk) return;
  const inText = e.target.closest('[contenteditable="true"]'); const hasTextSel = inText && !getSelection().isCollapsed;
  if (hasTextSel && !e.target.closest('.grip')) return; // ปล่อยเมนูข้อความของระบบตามปกติ
  e.preventDefault();
  if (!selSet.has(blk.dataset.id)) selectBlock(blk.dataset.id);
  enterBlockMode();
  const n = selIds().length; const m = $('#mCtx');
  m.innerHTML = `<div class="hd">${n > 1 ? `เลือกไว้ ${n} กล่อง` : esc(TYPES[byId(curId).t] || '')}</div>
    <button data-ctx="cut">ตัด<kbd>${KM('⌘X')}</kbd></button><button data-ctx="copy">คัดลอก<kbd>${KM('⌘C')}</kbd></button><button data-ctx="paste"${blockClip ? '' : ' disabled'}>วางด้านล่าง<kbd>${KM('⌘V')}</kbd></button>
    <button data-ctx="dup">ทำซ้ำ<kbd>${KM('⌘D')}</kbd></button><button data-ctx="del">ลบ<kbd>⌫</kbd></button>
    <div class="hd"></div><button data-ctx="up">เลื่อนขึ้น<kbd>${KM('⌥↑')}</kbd></button><button data-ctx="down">เลื่อนลง<kbd>${KM('⌥↓')}</kbd></button>
    <button data-ctx="para">เพิ่มย่อหน้าด้านล่าง<kbd>${KM('⌘↵')}</kbd></button><button data-ctx="insert">แทรกอย่างอื่นด้านล่าง…</button><button data-ctx="all">เลือกทั้งหมด<kbd>${KM('⌘A')}</kbd></button>`;
  closeMenus(); m.style.position = 'fixed'; m.style.left = Math.min(e.clientX, innerWidth - 270) + 'px'; m.style.top = Math.min(e.clientY, innerHeight - 380) + 'px'; m.classList.add('open');
});
$('#mCtx').addEventListener('mousedown', e => e.preventDefault());
$('#mCtx').onclick = e => { const b = e.target.closest('[data-ctx]'); if (!b || b.disabled) return; closeMenus(); ctxAction(b.dataset.ctx); };
/* ---------- ลากย้ายด้วยที่จับ ⠿ ---------- */
let dragIds = null; const dropLine = document.createElement('div'); dropLine.className = 'dropline';
flowEl.addEventListener('dragstart', e => {
  const g = e.target.closest && e.target.closest('.grip'); if (!g) return;
  const id = g.closest('.blk').dataset.id; dragIds = selSet.has(id) ? selIds() : [id];
  if (!selSet.has(id)) { selectBlock(id); }
  enterBlockMode();
  e.dataTransfer.effectAllowed = 'move'; e.dataTransfer.setData('text/plain', 'en-move');
  try { e.dataTransfer.setDragImage(g.closest('.blk'), 20, 12); } catch (err) { }
});
function dropTarget(y) {
  const els = $$('#flow > .blk'); for (const el of els) { const r = el.getBoundingClientRect(); if (y < r.top + r.height / 2) return el; } return null;
}
flowEl.addEventListener('dragover', e => {
  if (!dragIds) return; e.preventDefault(); e.dataTransfer.dropEffect = 'move';
  const t = dropTarget(e.clientY); const flow = $('#flow');
  const top = t ? t.offsetTop - 2 : flow.lastElementChild.offsetTop + flow.lastElementChild.offsetHeight + 1;
  dropLine.style.top = top + 'px'; if (!dropLine.parentNode) flow.appendChild(dropLine);
});
flowEl.addEventListener('drop', e => {
  if (!dragIds) return; e.preventDefault(); e.stopPropagation();
  const t = dropTarget(e.clientY); const set = new Set(dragIds);
  const moving = doc.blocks.filter(b => set.has(b.id)); const rest = doc.blocks.filter(b => !set.has(b.id));
  let at = t ? rest.findIndex(b => b.id === t.dataset.id) : rest.length; if (at < 0) at = rest.length;
  rest.splice(at, 0, ...moving); doc.blocks = rest; dropLine.remove(); dragIds = null; renderAll(); changed(true);
}, true);
document.addEventListener('dragend', () => { dragIds = null; dropLine.remove(); });

/* ===================== ตัววาดรูป (เรขาคณิต กราฟ แผนภาพต้นไม้) ===================== */
const FW = 640, FH = 440, GS = 20;
const FCOL = [['น้ำเงิน', '#1f3864'], ['ดำ', '#222222'], ['แดง', '#b03a2e'], ['ทอง', '#b8860b'], ['ส้ม', '#d9682b'], ['เขียว', '#2e7d32'], ['เทา', '#8a8a8a']];
let fig = null, figBlockId = null, figTool = 'select', figTmp = [], figSel = null, figStyle = { color: '#1f3864', dash: false, fill: false };
let figHist = [];

function emptyFig() { return { objs: [], axes: false, grid: false, nextL: 0 }; }
function fid() { return 'o' + Math.random().toString(36).slice(2, 8); }
function fpt(id) { return fig.objs.find(o => o.id === id); }
const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
function nextLabel() { const used = new Set(fig.objs.filter(o => o.type === 'pt').map(o => o.label)); for (const L of LETTERS) if (!used.has(L)) return L; return ''; }

/* ป้ายข้อความ: ตัวแปรละติน = ตัวเอียง KaTeX_Math, ตัวเลข/เครื่องหมาย = KaTeX_Main, ไทย = THS */
function labelSpans(str) {
  let out = '', math = false;
  const parts = String(str).split(/(\$)/);
  for (const p of parts) {
    if (p === '$') { math = !math; continue; }
    if (!p) continue;
    const re = /([A-Za-z]+)|([0-9.,]+|[+\-−×÷=<>≤≥()\/:°′'!]+)|([^A-Za-z0-9.,+\-−×÷=<>≤≥()\/:°′'!]+)/g;
    let m;
    while ((m = re.exec(p))) {
      if (m[1]) out += `<tspan font-family="KaTeX_Math" font-style="italic">${esc(m[1])}</tspan>`;
      else if (m[2]) out += `<tspan font-family="KaTeX_Main">${esc(m[2].replace(/-/g, '−'))}</tspan>`;
      else out += `<tspan font-family="THS">${esc(m[3])}</tspan>`;
    }
  }
  return out;
}

function axesOrigin() { return { ox: Math.round(FW / 2 / GS) * GS, oy: Math.round(FH / 2 / GS) * GS }; }
function evalFunc(expr) { return mpCompile(expr); }

function figMarkup(f, editing) {
  let s = '';
  const st = o => `stroke="${o.color || '#1f3864'}" stroke-width="${o.w || 2}"${o.dash ? ' stroke-dasharray="6 4"' : ''}`;
  if (editing) {
    for (let x = 0; x <= FW; x += GS) s += `<line x1="${x}" y1="0" x2="${x}" y2="${FH}" stroke="#eef0f4" stroke-width="1"/>`;
    for (let y = 0; y <= FH; y += GS) s += `<line x1="0" y1="${y}" x2="${FW}" y2="${y}" stroke="#eef0f4" stroke-width="1"/>`;
  } else if (f.grid) {
    const bb = f.bbox || { x: 0, y: 0, w: FW, h: FH };
    for (let x = Math.ceil(bb.x / GS) * GS; x <= bb.x + bb.w; x += GS) s += `<line x1="${x}" y1="${bb.y}" x2="${x}" y2="${bb.y + bb.h}" stroke="#e3e6ec" stroke-width="1"/>`;
    for (let y = Math.ceil(bb.y / GS) * GS; y <= bb.y + bb.h; y += GS) s += `<line x1="${bb.x}" y1="${y}" x2="${bb.x + bb.w}" y2="${y}" stroke="#e3e6ec" stroke-width="1"/>`;
  }
  if (f.axes) {
    const { ox, oy } = axesOrigin();
    s += `<defs><marker id="ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#8a8a8a"/></marker></defs>`;
    s += `<line x1="10" y1="${oy}" x2="${FW - 10}" y2="${oy}" stroke="#8a8a8a" stroke-width="1.3" marker-end="url(#ah)"/>`;
    s += `<line x1="${ox}" y1="${FH - 10}" x2="${ox}" y2="10" stroke="#8a8a8a" stroke-width="1.3" marker-end="url(#ah)"/>`;
    s += `<text x="${FW - 14}" y="${oy + 20}" font-size="16" fill="#555">${labelSpans('x')}</text><text x="${ox + 8}" y="20" font-size="16" fill="#555">${labelSpans('y')}</text>`;
    s += `<text x="${ox - 14}" y="${oy + 18}" font-size="14" fill="#555">${labelSpans('0')}</text>`;
    for (let k = -14; k <= 14; k++) { if (!k) continue; const x = ox + k * GS * 2, y = oy - k * GS * 2; if (x > 20 && x < FW - 20) { s += `<line x1="${x}" y1="${oy - 3}" x2="${x}" y2="${oy + 3}" stroke="#8a8a8a"/><text x="${x}" y="${oy + 17}" font-size="12" text-anchor="middle" fill="#666">${labelSpans(String(k * 2))}</text>`; } if (y > 20 && y < FH - 20) { s += `<line x1="${ox - 3}" y1="${y}" x2="${ox + 3}" y2="${y}" stroke="#8a8a8a"/><text x="${ox - 6}" y="${y + 4}" font-size="12" text-anchor="end" fill="#666">${labelSpans(String(k * 2))}</text>`; } }
  }
  for (const o of f.objs) {
    const sel = editing && figSel === o.id ? ' data-sel="1"' : '';
    if (o.type === 'poly') { const P = o.pts.map(fpt2(f)).filter(Boolean); if (P.length > 1) s += `<polygon points="${P.map(p => p.x + ',' + p.y).join(' ')}" fill="${o.fill ? hexA(o.color, .12) : 'none'}" ${st(o)} stroke-linejoin="round" data-id="${o.id}"${sel}/>`; }
    if (o.type === 'seg') { const a = fpt2(f)(o.a), b = fpt2(f)(o.b); if (a && b) s += `<line x1="${a.x}" y1="${a.y}" x2="${b.x}" y2="${b.y}" ${st(o)} stroke-linecap="round" data-id="${o.id}"${sel}/>`; }
    if (o.type === 'line') { const a = fpt2(f)(o.a), b = fpt2(f)(o.b); if (a && b) { const c = clipLine(a, b); if (c) s += `<line x1="${c[0]}" y1="${c[1]}" x2="${c[2]}" y2="${c[3]}" ${st(o)} data-id="${o.id}"${sel}/>`; } }
    if (o.type === 'circ') { const c = fpt2(f)(o.c), p = fpt2(f)(o.p); if (c && p) s += `<circle cx="${c.x}" cy="${c.y}" r="${Math.hypot(p.x - c.x, p.y - c.y)}" fill="${o.fill ? hexA(o.color, .1) : 'none'}" ${st(o)} data-id="${o.id}"${sel}/>`; }
    if (o.type === 'ang') {
      const a = fpt2(f)(o.a), v = fpt2(f)(o.v), b = fpt2(f)(o.b);
      if (a && v && b) {
        const a1 = Math.atan2(a.y - v.y, a.x - v.x), a2 = Math.atan2(b.y - v.y, b.x - v.x);
        let d = a2 - a1; while (d <= -Math.PI) d += 2 * Math.PI; while (d > Math.PI) d -= 2 * Math.PI;
        const r = 22;
        if (o.right) { const u1 = [Math.cos(a1), Math.sin(a1)], u2 = [Math.cos(a2), Math.sin(a2)], q = 14; s += `<path d="M${v.x + u1[0] * q},${v.y + u1[1] * q} L${v.x + (u1[0] + u2[0]) * q},${v.y + (u1[1] + u2[1]) * q} L${v.x + u2[0] * q},${v.y + u2[1] * q}" fill="none" stroke="${o.color}" stroke-width="1.5" data-id="${o.id}"${sel}/>`; }
        else { const x1 = v.x + r * Math.cos(a1), y1 = v.y + r * Math.sin(a1), x2 = v.x + r * Math.cos(a1 + d), y2 = v.y + r * Math.sin(a1 + d); s += `<path d="M${x1},${y1} A${r},${r} 0 0 ${d > 0 ? 1 : 0} ${x2},${y2}" fill="none" stroke="${o.color}" stroke-width="1.5" data-id="${o.id}"${sel}/>`; }
        if (o.text) { const m = a1 + d / 2, rr = o.right ? 30 : 38; s += `<text x="${v.x + rr * Math.cos(m)}" y="${v.y + rr * Math.sin(m) + 5}" font-size="15" text-anchor="middle" fill="${o.color}" data-id="${o.id}">${labelSpans(o.text)}</text>`; }
      }
    }
    if (o.type === 'func') {
      try {
        const fn = evalFunc(o.expr), { ox, oy } = axesOrigin(); let d = '', pen = false;
        for (let px = 0; px <= FW; px += 2) { const x = (px - ox) / (GS * 2); const y = fn(x); const py = oy - y * GS * 2; if (!isFinite(y) || py < -50 || py > FH + 50 || x < o.x1 || x > o.x2) { pen = false; continue; } d += (pen ? 'L' : 'M') + px.toFixed(1) + ',' + py.toFixed(1); pen = true; }
        s += `<path d="${d}" fill="none" ${st(o)} data-id="${o.id}"${sel}/>`;
        if (o.show) { const x = Math.min(o.x2, (FW - 60 - ox) / (GS * 2)); const y = fn(x); s += `<text x="${ox + x * GS * 2 + 6}" y="${oy - y * GS * 2 - 8}" font-size="15" fill="${o.color}" data-id="${o.id}">${labelSpans('$y=' + o.expr + '$')}</text>`; }
      } catch (e) { }
    }
    if (o.type === 'tree') s += treeMarkup(o, sel);
    if (o.type === 'text') s += `<text x="${o.x}" y="${o.y}" font-size="${o.size || 16}" fill="${o.color || '#222'}" data-id="${o.id}"${sel} style="cursor:move">${labelSpans(o.str)}</text>`;
  }
  for (const o of f.objs) if (o.type === 'pt') {
    const sel = editing && figSel === o.id;
    if (o.show !== false) s += `<circle cx="${o.x}" cy="${o.y}" r="${sel ? 5.5 : 3.6}" fill="${sel ? '#d9682b' : (o.color || '#1f3864')}" data-id="${o.id}"/>`;
    else if (editing) s += `<circle cx="${o.x}" cy="${o.y}" r="4" fill="none" stroke="#bbb" stroke-dasharray="2 2" data-id="${o.id}"/>`;
    if (o.label) s += `<text x="${o.x + (o.dx ?? 9)}" y="${o.y + (o.dy ?? -9)}" font-size="17" fill="${o.color || '#1f3864'}" data-lab="${o.id}" style="cursor:move">${labelSpans(o.label)}</text>`;
  }
  return s;
}
function clipLine(a, b) {
  const dx = b.x - a.x, dy = b.y - a.y; let t0 = -1e9, t1 = 1e9;
  const m = 6; const ck = (p, q) => { if (p === 0) return q >= 0; const r = q / p; if (p < 0) { if (r > t1) return false; if (r > t0) t0 = r; } else { if (r < t0) return false; if (r < t1) t1 = r; } return true; };
  if (!(ck(-dx, a.x - m) && ck(dx, FW - m - a.x) && ck(-dy, a.y - m) && ck(dy, FH - m - a.y))) return null;
  return [a.x + t0 * dx, a.y + t0 * dy, a.x + t1 * dx, a.y + t1 * dy].map(v => +v.toFixed(1));
}
function fpt2(f) { return id => f.objs.find(o => o.id === id); }
function hexA(h, a) { const n = parseInt(h.slice(1), 16); return `rgba(${n >> 16},${(n >> 8) & 255},${n & 255},${a})`; }
function treeMarkup(o, sel) {
  const L = o.levels.filter(l => l.length);
  if (!L.length) return '';
  const leaves = L.reduce((a, l) => a * l.length, 1);
  const dy = Math.max(18, Math.min(30, 360 / leaves)), dx = 90;
  let s = '', leafY = [];
  const H = leaves * dy;
  function node(level, y0, y1, px, py, path) {
    if (level === L.length) { leafY.push([y0 + (y1 - y0) / 2, path]); return; }
    const n = L[level].length, h = (y1 - y0) / n;
    L[level].forEach((lab, i) => {
      const y = y0 + h * i + h / 2, x = o.x + (level + 1) * dx;
      s += `<line x1="${px}" y1="${py}" x2="${x - 12}" y2="${y}" stroke="${o.color || '#713408'}" stroke-width="1.4"/>`;
      s += `<circle cx="${x}" cy="${y}" r="11" fill="#fff" stroke="${o.color || '#713408'}" stroke-width="1.3"/>`;
      s += `<text x="${x}" y="${y + 5}" font-size="14" text-anchor="middle" fill="#222">${labelSpans(lab)}</text>`;
      node(level + 1, y0 + h * i, y0 + h * (i + 1), x + 12, y, path.concat(lab));
    });
  }
  s += `<circle cx="${o.x}" cy="${o.y + H / 2}" r="4" fill="${o.color || '#713408'}" data-id="${o.id}"${sel}/>`;
  node(0, o.y, o.y + H, o.x + 4, o.y + H / 2, []);
  if (o.outcomes) leafY.forEach(([y, p]) => { s += `<text x="${o.x + L.length * dx + 26}" y="${y + 5}" font-size="14" fill="#444">${labelSpans(p.join(''))}</text>`; });
  s += `<rect x="${o.x - 8}" y="${o.y - 6}" width="${L.length * dx + 30 + (o.outcomes ? L.length * 12 + 20 : 0)}" height="${H + 12}" fill="transparent" data-id="${o.id}" style="cursor:move"/>`;
  return s;
}

/* ---------------- เครื่องมือ ---------------- */
const FIGTOOLS = [
  ['select', '↖ เลือก/ลาก', 'ลากจุด ป้าย หรือข้อความ · คลิกเลือกแล้วกดลบ'],
  ['pt', '• จุด', 'คลิกเพื่อวางจุด (ชื่อจุดตั้งให้อัตโนมัติ)'],
  ['seg', '／ ส่วนของเส้นตรง', 'คลิกจุดเริ่ม แล้วคลิกจุดปลาย'],
  ['line', '⟷ เส้นตรง', 'คลิกสองจุดที่เส้นผ่าน'],
  ['circ', '○ วงกลม', 'คลิกจุดศูนย์กลาง แล้วคลิกจุดบนวงกลม'],
  ['poly', '△ รูปหลายเหลี่ยม', 'คลิกจุดยอดทีละจุด คลิกจุดแรกซ้ำเพื่อปิดรูป'],
  ['ang', '∠ มุม', 'คลิกจุดบนแขนที่ 1 → จุดยอดมุม → จุดบนแขนที่ 2'],
  ['text', 'ก ข้อความ', 'คลิกตำแหน่งที่จะวางข้อความ (ใส่ $...$ ได้)'],
];
function buildFigTools() {
  const box = $('#figTools');
  let h = FIGTOOLS.map(([k, n]) => `<button class="tb" data-ft="${k}">${n}</button>`).join('');
  h += `<button class="tb" data-fx="func">𝑓 กราฟฟังก์ชัน</button><button class="tb" data-fx="tree">⋔ แผนภาพต้นไม้</button>`;
  h += `<div style="height:6px"></div><button class="tb" data-fx="axes">แกน x–y เปิด/ปิด</button><button class="tb" data-fx="grid">ตารางในรูป เปิด/ปิด</button>`;
  h += `<div style="display:flex;gap:4px;flex-wrap:wrap;margin:4px 0">${FCOL.map(([n, c]) => `<button class="sw" title="${n}" data-fc="${c}" style="background:${c}"></button>`).join('')}</div>`;
  h += `<button class="tb" data-fx="dash">เส้นประ เปิด/ปิด</button><button class="tb" data-fx="fill">แรเงา เปิด/ปิด</button><button class="tb" data-fx="hide">ซ่อน/แสดงจุดที่เลือก</button><button class="tb" data-fx="rename">เปลี่ยนชื่อ/ข้อความ</button><button class="tb" data-fx="del">ลบสิ่งที่เลือก</button><button class="tb" data-fx="undo">↶ ย้อนกลับ</button>`;
  box.innerHTML = h;
  box.onclick = e => {
    const b = e.target.closest('button'); if (!b) return;
    if (b.dataset.ft) { figTool = b.dataset.ft; figTmp = []; drawFig(); }
    else if (b.dataset.fc) { figStyle.color = b.dataset.fc; const o = fpt(figSel); if (o) { pushFig(); o.color = b.dataset.fc; } drawFig(); }
    else figAction(b.dataset.fx);
  };
}
function pushFig() { figHist.push(JSON.stringify(fig)); if (figHist.length > 60) figHist.shift(); }
async function figAction(a) {
  const o = fpt(figSel);
  if (a === 'axes') { pushFig(); fig.axes = !fig.axes; }
  if (a === 'grid') { pushFig(); fig.grid = !fig.grid; toast(fig.grid ? 'จะแสดงตารางในรูปที่ใส่ลงเอกสาร' : 'ไม่แสดงตารางในรูป'); }
  if (a === 'dash') { figStyle.dash = !figStyle.dash; if (o && o.type !== 'pt') { pushFig(); o.dash = !o.dash; } }
  if (a === 'fill') { figStyle.fill = !figStyle.fill; if (o) { pushFig(); o.fill = !o.fill; } }
  if (a === 'hide' && o && o.type === 'pt') { pushFig(); o.show = o.show === false; }
  if (a === 'del' && o) { pushFig(); deleteObj(o.id); figSel = null; }
  if (a === 'undo' && figHist.length) { fig = JSON.parse(figHist.pop()); figSel = null; }
  if (a === 'rename' && o) {
    const cur = o.type === 'pt' ? o.label : o.type === 'text' ? o.str : o.type === 'ang' ? (o.text || '') : null;
    if (cur !== null) { const v = await figPrompt('ข้อความ (ใส่ $...$ สำหรับสมการ)', cur); if (v !== null) { pushFig(); if (o.type === 'pt') o.label = v; else if (o.type === 'text') o.str = v; else o.text = v; } }
    if (o.type === 'ang') { o.right = await askYesNo('มุมฉาก?', 'วาดเป็นสัญลักษณ์มุมฉาก (สี่เหลี่ยมเล็ก) ไหม') ; }
    if (o.type === 'tree') { await editTree(o); }
    if (o.type === 'func') { await editFunc(o); }
  }
  if (a === 'func') { const nf = { id: fid(), type: 'func', expr: 'x^2-4', x1: -10, x2: 10, show: true, color: figStyle.color }; if (await editFunc(nf)) { pushFig(); if (!fig.axes) fig.axes = true; fig.objs.push(nf); figSel = nf.id; } }
  if (a === 'tree') { const nt = { id: fid(), type: 'tree', x: 40, y: 40, levels: [['H', 'T'], ['H', 'T']], outcomes: true, color: '#713408' }; if (await editTree(nt)) { pushFig(); fig.objs.push(nt); figSel = nt.id; } }
  drawFig();
}
function deleteObj(id) {
  fig.objs = fig.objs.filter(o => o.id !== id && !(o.a === id || o.b === id || o.c === id || o.p === id || o.v === id || (o.pts && o.pts.includes(id))));
}
function figPrompt(title, val) {
  return new Promise(res => {
    const back = $('#dAsk'); $('#askT').textContent = title;
    $('#askBody').innerHTML = `<input type="text" id="fpIn" style="width:100%;font-size:20px" value="${esc(val || '')}">`;
    $('#askYes').textContent = 'ตกลง'; back.style.zIndex = 150; openDlg('#dAsk');
    setTimeout(() => $('#fpIn').focus(), 30);
    const done = v => { closeDlg('#dAsk'); back.style.zIndex = ''; res(v); };
    $('#askYes').onclick = () => done($('#fpIn').value); $('#askNo').onclick = () => done(null);
    $('#fpIn').onkeydown = e => { if (e.key === 'Enter') done($('#fpIn').value); };
  });
}
function askYesNo(title, msg) {
  return new Promise(res => { const back = $('#dAsk'); $('#askT').textContent = title; $('#askBody').innerHTML = `<p>${msg}</p>`; $('#askYes').textContent = 'ใช่'; back.style.zIndex = 150; openDlg('#dAsk'); const done = v => { closeDlg('#dAsk'); back.style.zIndex = ''; res(v); }; $('#askYes').onclick = () => done(true); $('#askNo').onclick = () => done(false); });
}
function editFunc(o) {
  return new Promise(res => {
    const back = $('#dAsk'); $('#askT').textContent = 'กราฟฟังก์ชัน';
    $('#askBody').innerHTML = `<div class="row"><label for="fnE">y =</label><input type="text" id="fnE" style="flex:1;font-size:20px" value="${esc(o.expr)}"></div>
      <div class="row"><label for="fnA">x ตั้งแต่</label><input type="text" id="fnA" style="width:70px" value="${o.x1}"><label for="fnB">ถึง</label><input type="text" id="fnB" style="width:70px" value="${o.x2}"><label><input type="checkbox" id="fnS" ${o.show ? 'checked' : ''}> แสดงสมการบนกราฟ</label></div>
      <p style="font-size:16px;color:#7b746c">ตัวอย่าง: x^2-4 · 2*x+1 · sqrt(x) · abs(x-1) · sin(x) · 1/x · 2^x (หนึ่งช่องตารางในรูป = 0.5 หน่วย)</p>`;
    $('#askYes').textContent = 'ตกลง'; back.style.zIndex = 150; openDlg('#dAsk');
    const done = ok => {
      if (ok) { try { evalFunc($('#fnE').value)(1); } catch (e) { toast('เขียนสมการไม่ถูกรูปแบบ'); return; } o.expr = $('#fnE').value; o.x1 = parseFloat($('#fnA').value) || -10; o.x2 = parseFloat($('#fnB').value) || 10; o.show = $('#fnS').checked; }
      closeDlg('#dAsk'); back.style.zIndex = ''; res(ok);
    };
    $('#askYes').onclick = () => done(true); $('#askNo').onclick = () => done(false);
  });
}
function editTree(o) {
  return new Promise(res => {
    const back = $('#dAsk'); $('#askT').textContent = 'แผนภาพต้นไม้';
    $('#askBody').innerHTML = `<p style="font-size:17px;margin:0 0 4px">พิมพ์ทีละบรรทัด บรรทัดละหนึ่งขั้นตอน คั่นกิ่งด้วยจุลภาค</p><textarea id="trT" style="min-height:110px;font-size:18px">${esc(o.levels.map(l => l.join(', ')).join('\n'))}</textarea>
      <label><input type="checkbox" id="trO" ${o.outcomes ? 'checked' : ''}> แสดงผลลัพธ์ที่ปลายกิ่ง</label><p style="font-size:16px;color:#7b746c">ตัวอย่าง โยนเหรียญ 3 ครั้ง: H, T ⏎ H, T ⏎ H, T</p>`;
    $('#askYes').textContent = 'ตกลง'; back.style.zIndex = 150; openDlg('#dAsk');
    const done = ok => {
      if (ok) { o.levels = $('#trT').value.split('\n').map(l => l.split(',').map(x => x.trim()).filter(Boolean)).filter(l => l.length); o.outcomes = $('#trO').checked; const leaves = o.levels.reduce((a, l) => a * l.length, 1); if (leaves > 64) { toast('กิ่งมากเกินไป (เกิน 64 ปลายกิ่ง)'); return; } }
      closeDlg('#dAsk'); back.style.zIndex = ''; res(ok);
    };
    $('#askYes').onclick = () => done(true); $('#askNo').onclick = () => done(false);
  });
}

/* ---------------- วาดบนผืนผ้าใบ ---------------- */
function drawFig() {
  $$('#figTools [data-ft]').forEach(b => b.classList.toggle('on', b.dataset.ft === figTool));
  $('#figHint').textContent = (FIGTOOLS.find(t => t[0] === figTool) || [, , ''])[2] + (figTmp.length ? ` (เลือกแล้ว ${figTmp.length} จุด)` : '');
  let s = figMarkup(fig, true);
  figTmp.forEach(id => { const p = fpt(id); if (p) s += `<circle cx="${p.x}" cy="${p.y}" r="8" fill="none" stroke="#d9682b" stroke-width="2"/>`; });
  const sel = fpt(figSel);
  $('#figCanvas').innerHTML = s;
  if (sel && sel.type !== 'pt') $$(`#figCanvas [data-id="${sel.id}"]`).forEach(e => { e.setAttribute('stroke', '#d9682b'); });
}
function svgPt(e) { const svg = $('#figCanvas'); const p = svg.createSVGPoint(); p.x = e.clientX; p.y = e.clientY; const q = p.matrixTransform(svg.getScreenCTM().inverse()); return { x: q.x, y: q.y }; }
function snap(v) { return Math.round(v / (GS / 2)) * (GS / 2); }
function nearPt(x, y, r = 10) { let best = null, bd = r; fig.objs.forEach(o => { if (o.type === 'pt') { const d = Math.hypot(o.x - x, o.y - y); if (d < bd) { bd = d; best = o; } } }); return best; }
function getOrMakePt(x, y) { const n = nearPt(x, y); if (n) return n; const p = { id: fid(), type: 'pt', x: snap(x), y: snap(y), label: nextLabel(), color: figStyle.color }; fig.objs.push(p); return p; }
let drag = null;
function figDown(e) {
  const { x, y } = svgPt(e);
  if (figTool === 'select') {
    const lab = e.target.closest('[data-lab]'), hit = e.target.closest('[data-id]');
    const p = nearPt(x, y, 9);
    if (lab) { const o = fpt(lab.dataset.lab); figSel = o.id; pushFig(); drag = { kind: 'lab', o, sx: x, sy: y, dx: o.dx ?? 9, dy: o.dy ?? -9 }; }
    else if (p) { figSel = p.id; pushFig(); drag = { kind: 'pt', o: p }; }
    else if (hit) { const o = fpt(hit.dataset.id); figSel = o ? o.id : null; if (o && (o.type === 'text' || o.type === 'tree')) { pushFig(); drag = { kind: 'move', o, sx: x, sy: y, ox: o.x, oy: o.y }; } }
    else figSel = null;
    drawFig(); return;
  }
  pushFig();
  if (figTool === 'pt') { const p = getOrMakePt(x, y); figSel = p.id; }
  else if (figTool === 'text') { figPrompt('ข้อความในรูป (ใส่ $...$ สำหรับสมการ)', '').then(v => { if (v) { fig.objs.push({ id: fid(), type: 'text', x: snap(x), y: snap(y), str: v, size: 16, color: figStyle.color === '#1f3864' ? '#222' : figStyle.color }); drawFig(); } else figHist.pop(); }); return; }
  else {
    const p = getOrMakePt(x, y);
    if (figTool === 'poly' && figTmp.length >= 3 && p.id === figTmp[0]) { fig.objs.push({ id: fid(), type: 'poly', pts: figTmp.slice(), color: figStyle.color, dash: figStyle.dash, fill: figStyle.fill }); figTmp = []; drawFig(); return; }
    if (figTmp[figTmp.length - 1] !== p.id) figTmp.push(p.id);
    const need = { seg: 2, line: 2, circ: 2, ang: 3 }[figTool];
    if (need && figTmp.length === need) {
      const [a, b, c] = figTmp;
      if (figTool === 'seg') fig.objs.push({ id: fid(), type: 'seg', a, b, color: figStyle.color, dash: figStyle.dash });
      if (figTool === 'line') fig.objs.push({ id: fid(), type: 'line', a, b, color: figStyle.color, dash: figStyle.dash });
      if (figTool === 'circ') { const pp = fpt(b); if (pp && !pp.label.match(/^[A-Z]$/)) { } fig.objs.push({ id: fid(), type: 'circ', c: a, p: b, color: figStyle.color, dash: figStyle.dash, fill: figStyle.fill }); }
      if (figTool === 'ang') fig.objs.push({ id: fid(), type: 'ang', a, v: b, b: c, color: '#b8860b', text: '' });
      figTmp = [];
    }
  }
  drawFig();
}
function figMove(e) {
  if (!drag) return;
  const { x, y } = svgPt(e);
  if (drag.kind === 'pt') { drag.o.x = snap(Math.max(0, Math.min(FW, x))); drag.o.y = snap(Math.max(0, Math.min(FH, y))); }
  if (drag.kind === 'lab') { drag.o.dx = Math.round(drag.dx + x - drag.sx); drag.o.dy = Math.round(drag.dy + y - drag.sy); }
  if (drag.kind === 'move') { drag.o.x = snap(drag.ox + x - drag.sx); drag.o.y = snap(drag.oy + y - drag.sy); }
  drawFig();
}
function figUp() { drag = null; }
$('#figCanvas').addEventListener('pointerdown', e => { e.preventDefault(); figDown(e); });
$('#figCanvas').addEventListener('pointermove', figMove);
window.addEventListener('pointerup', figUp);
document.addEventListener('keydown', e => {
  if (!$('#dFig').classList.contains('open') || $('#dAsk').classList.contains('open')) return;
  if ((e.key === 'Delete' || e.key === 'Backspace') && figSel) { e.preventDefault(); figAction('del'); }
  if (e.key === 'Escape') { figTmp = []; drawFig(); }
});

/* ---------------- เปิด/ปิดตัววาดรูป ---------------- */
function openFigure(blockId) {
  figBlockId = blockId;
  const b = blockId ? byId(blockId) : null;
  fig = b && b.fig ? JSON.parse(JSON.stringify(b.fig)) : emptyFig();
  figTool = 'select'; figTmp = []; figSel = null; figHist = [];
  if (!b) {
    // รูปตัวอย่างเริ่มต้น: สามเหลี่ยม ABC
    const A = { id: fid(), type: 'pt', x: 220, y: 320, label: 'A', color: '#1f3864' }, B = { id: fid(), type: 'pt', x: 440, y: 320, label: 'B', color: '#1f3864', dx: 8 }, C = { id: fid(), type: 'pt', x: 300, y: 140, label: 'C', color: '#1f3864' };
    fig.objs.push(A, B, C, { id: fid(), type: 'poly', pts: [A.id, B.id, C.id], color: '#1f3864', fill: true });
    toast('เริ่มจากสามเหลี่ยมตัวอย่าง ลากจุดเพื่อปรับ หรือกด “ลบสิ่งที่เลือก”', 4000);
  }
  drawFig(); openDlg('#dFig');
}
$('#fgCancel').onclick = () => closeDlg('#dFig');
$('#fgOk').onclick = () => {
  const { svg, w } = figToSVG(fig);
  closeDlg('#dFig');
  if (figBlockId) { const b = byId(figBlockId); b.fig = fig; b.svg = svg; rerender(figBlockId); changed(true); }
  else insertBlocks([newBlock('figure', { fig, svg, w })]);
};
function figToSVG(f) {
  // วัดขอบเขตจริงของรูป แล้วตัดให้พอดี
  const tmp = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  tmp.setAttribute('width', FW); tmp.setAttribute('height', FH); tmp.style.position = 'absolute'; tmp.style.left = '-9999px';
  document.body.appendChild(tmp);
  tmp.innerHTML = figMarkup(Object.assign({}, f, { grid: false }), false);
  let bb; try { bb = tmp.getBBox(); } catch (e) { bb = { x: 0, y: 0, width: FW, height: FH }; }
  tmp.remove();
  const pad = 8;
  let x = Math.max(0, bb.x - pad), y = Math.max(0, bb.y - pad), w = Math.min(FW, bb.x + bb.width + pad) - x, h = Math.min(FH, bb.y + bb.height + pad) - y;
  if (w < 20 || h < 20) { x = 0; y = 0; w = FW; h = FH; }
  const g = Object.assign({}, f, { bbox: { x, y, w, h } });
  const body = figMarkup(g, false);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${Math.round(w)}" height="${Math.round(h)}" viewBox="${x} ${y} ${w} ${h}"><style>text{font-family:'THS'}</style>${body}</svg>`;
  return { svg, w: Math.round(Math.min(100, w / 658 * 100 * 0.9)) };
}

/* ===================== แป้นลัดแบบ Pages · Tab · รายการอัตโนมัติ ===================== */
const LIST_STYLES = [
  ['decimal', '1. 2. 3.', 'ol'], ['dec-paren', '1) 2) 3)', 'ol'], ['paren-dec', '(1) (2) (3)', 'ol'], ['lower-alpha', 'a. b. c.', 'ol'], ['upper-alpha', 'A. B. C.', 'ol'],
  ['lower-roman', 'i. ii. iii.', 'ol'], ['upper-roman', 'I. II. III.', 'ol'], ['thai-alpha', 'ก. ข. ค.', 'ol'], ['thai', '๑. ๒. ๓.', 'ol'],
  ['disc', '• จุด', 'ul'], ['circle', '◦ วงกลม', 'ul'], ['square', '▪ สี่เหลี่ยม', 'ul'], ['dash', '– ขีด', 'ul'], ['check', '✓ ถูก', 'ul'], ['arrow', '➤ ลูกศร', 'ul'],
];
const THAI_AL = 'กขคงจฉชซฌญฎฏฐฑฒณดตถทธนบปผฝพฟภมยรลวศษสหฬอฮ';
function toRoman(n) { const v = [[1000, 'm'], [900, 'cm'], [500, 'd'], [400, 'cd'], [100, 'c'], [90, 'xc'], [50, 'l'], [40, 'xl'], [10, 'x'], [9, 'ix'], [5, 'v'], [4, 'iv'], [1, 'i']]; let s = ''; v.forEach(([a, r]) => { while (n >= a) { s += r; n -= a; } }); return s; }
function listMarker(type, k) { // ข้อความเลขรายการ (ใช้ตอนส่งออก Word)
  switch (type) {
    case 'dec-paren': return k + ')'; case 'paren-dec': return '(' + k + ')';
    case 'lower-alpha': case 'lower-latin': return String.fromCharCode(96 + ((k - 1) % 26) + 1) + '.'; case 'upper-alpha': case 'upper-latin': return String.fromCharCode(64 + ((k - 1) % 26) + 1) + '.';
    case 'lower-roman': return toRoman(k) + '.'; case 'upper-roman': return toRoman(k).toUpperCase() + '.';
    case 'thai-alpha': return THAI_AL[(k - 1) % THAI_AL.length] + '.'; case 'thai': return String(k).replace(/\d/g, d => '๐๑๒๓๔๕๖๗๘๙'[d]) + '.';
    case 'circle': return '◦'; case 'square': return '▪'; case 'dash': return '–'; case 'check': return '✓'; case 'arrow': return '➤'; case 'disc': return '•';
    default: return k + '.';
  }
}
function selNode() { const s = getSelection(); if (!s.rangeCount) return null; const n = s.getRangeAt(0).startContainer; return n.nodeType === 1 ? n : n.parentElement; }
function curLi() { const n = selNode(); return n && n.closest && n.closest('#flow [contenteditable="true"] li'); }
function execRaw(cmd, val) { document.execCommand('styleWithCSS', false, false); document.execCommand(cmd, false, val); }
function listToggle(kind, styleType) {
  restoreSel(); const ed = curEditable(); if (!ed) { toast('คลิกตำแหน่งในข้อความก่อน'); return; }
  let li = curLi(); let lst = li && li.parentElement;
  if (!lst || lst.tagName.toLowerCase() !== kind) { execRaw(kind === 'ol' ? 'insertOrderedList' : 'insertUnorderedList'); li = curLi(); lst = li && li.parentElement; }
  if (lst && styleType) { lst.style.listStyleType = ''; lst.dataset.ls = styleType; }
  syncFrom(ed);
}
function caretTo(node, atEnd = true) { const r = document.createRange(); r.selectNodeContents(node); r.collapse(!atEnd); const s = getSelection(); s.removeAllRanges(); s.addRange(r); }
function listExit(li, t) {
  const lst = li.parentElement; const outerLi = lst.parentElement && lst.parentElement.closest('li');
  const after = [...lst.children].slice([...lst.children].indexOf(li) + 1);
  if (lst.parentElement && /^(OL|UL)$/.test(lst.parentElement.tagName) || outerLi) { // ถอยออกหนึ่งระดับ
    const outer = /^(OL|UL)$/.test(lst.parentElement.tagName) ? lst.parentElement : outerLi.parentElement; const anchor = /^(OL|UL)$/.test(lst.parentElement.tagName) ? lst : outerLi;
    li.innerHTML = '<br>'; anchor.after(li); if (after.length) { const nl = lst.cloneNode(false); after.forEach(x => nl.appendChild(x)); li.appendChild(nl); } if (!lst.children.length) lst.remove(); caretTo(li, false); syncFrom(t); return;
  }
  const div = document.createElement('div'); div.innerHTML = '<br>'; li.remove();
  if (after.length) { const nl = lst.cloneNode(false); after.forEach(x => nl.appendChild(x)); if (lst.tagName === 'OL') nl.setAttribute('start', (+(lst.getAttribute('start') || 1)) + lst.children.length); lst.after(nl); }
  lst.after(div); if (!lst.children.length) lst.remove(); caretTo(div, false); syncFrom(t);
}
function liIndent(li, t) {
  const prev = li.previousElementSibling; if (!prev || prev.tagName !== 'LI') { toast('รายการแรกเลื่อนเป็นรายการย่อยไม่ได้'); return; }
  let sub = [...prev.children].reverse().find(c => /^(OL|UL)$/.test(c.tagName)); if (!sub || sub !== prev.lastElementChild) { sub = document.createElement(li.parentElement.tagName.toLowerCase()); prev.appendChild(sub); }
  sub.appendChild(li); const kids = [...li.children].filter(c => /^(OL|UL)$/.test(c.tagName)); kids.forEach(k => { [...k.children].forEach(x => sub.appendChild(x)); k.remove(); });
  caretTo(li, true); syncFrom(t);
}
function liOutdent(li, t) {
  const lst = li.parentElement, host = lst.parentElement;
  const after = [...lst.children].slice([...lst.children].indexOf(li) + 1);
  if (host && host.tagName === 'LI') { host.after(li); if (after.length) { const nl = lst.cloneNode(false); after.forEach(x => nl.appendChild(x)); li.appendChild(nl); } if (!lst.children.length) lst.remove(); caretTo(li, true); syncFrom(t); return; }
  if (host && /^(OL|UL)$/.test(host.tagName)) { lst.after(li); if (after.length) { const nl = lst.cloneNode(false); after.forEach(x => nl.appendChild(x)); li.after(nl); } if (!lst.children.length) lst.remove(); caretTo(li, true); syncFrom(t); return; }
  // ระดับบนสุด → กลับเป็นข้อความธรรมดา
  const div = document.createElement('div'); while (li.firstChild) { if (/^(OL|UL)$/.test(li.firstChild.nodeName)) break; div.appendChild(li.firstChild); } if (!div.childNodes.length) div.innerHTML = '<br>';
  const rest = [...li.children].filter(c => /^(OL|UL)$/.test(c.tagName)); li.remove();
  if (after.length) { const nl = lst.cloneNode(false); after.forEach(x => nl.appendChild(x)); lst.after(nl); }
  lst.after(div); rest.forEach(r => div.after(r)); if (!lst.children.length) lst.remove(); caretTo(div, true); syncFrom(t);
}
function lineToList(t, n, offset, kind, st, start) { // เปลี่ยนบรรทัดปัจจุบัน (ระหว่าง <br>) เป็นรายการ
  const par = n.parentElement; let a = n; while (a.previousSibling && a.previousSibling.nodeName !== 'BR') a = a.previousSibling; let z = n; while (z.nextSibling && z.nextSibling.nodeName !== 'BR' && !/^(OL|UL|DIV|P)$/.test(z.nextSibling.nodeName)) z = z.nextSibling;
  const lst = document.createElement(kind); if (st && st !== 'decimal' && st !== 'disc') lst.dataset.ls = st; if (start > 1) lst.setAttribute('start', start); const li = document.createElement('li'); lst.appendChild(li);
  const brAfter = z.nextSibling && z.nextSibling.nodeName === 'BR' ? z.nextSibling : null; const brBefore = a.previousSibling && a.previousSibling.nodeName === 'BR' ? a.previousSibling : null;
  par.insertBefore(lst, a); let cur = a; while (cur) { const nx = cur === z ? null : cur.nextSibling; li.appendChild(cur); cur = nx; }
  if (brAfter) brAfter.remove(); if (brBefore) brBefore.remove(); if (!li.textContent && !li.querySelector('*')) li.innerHTML = '<br>';
  const tn = [...li.childNodes].find(x => x === n); if (tn && tn.nodeType === 3) { const r = document.createRange(); r.setStart(tn, Math.min(offset, tn.length)); r.collapse(true); const s = getSelection(); s.removeAllRanges(); s.addRange(r); } else caretTo(li, true);
  syncFrom(t);
}
/* Enter / Tab ในกล่องข้อความ (ทำงานก่อนตัวจัดการเดิม) */
flowEl.addEventListener('keydown', e => {
  const t = e.target.closest && e.target.closest('[contenteditable="true"]'); if (!t || e.isComposing) return;
  const li = curLi(); const inLi = li && t.contains(li);
  if (e.key === 'Enter' && !e.metaKey && !e.ctrlKey && inLi) {
    e.stopImmediatePropagation();
    if (e.shiftKey) { e.preventDefault(); document.execCommand('insertLineBreak'); return; }
    if (!li.textContent.replace(/[​\s]/g, '') && !li.querySelector('.mx,img,.ic')) { e.preventDefault(); listExit(li, t); return; }
    setTimeout(() => syncFrom(t), 0); return; // ให้เบราว์เซอร์สร้างรายการถัดไป (เลขต่อกันอัตโนมัติ)
  }
  if (e.key === 'Tab' && !e.metaKey && !e.ctrlKey && !e.altKey) {
    e.preventDefault(); e.stopImmediatePropagation();
    if (inLi) { if (e.shiftKey) liOutdent(li, t); else liIndent(li, t); return; }
    if (t.dataset.cell || t.dataset.pf) { const blk = t.closest('.blk'); const eds = edsOf(blk), k = eds.indexOf(t); const nx = eds[k + (e.shiftKey ? -1 : 1)]; if (nx) placeCaretEnd(nx); else if (t.dataset.cell && !e.shiftKey && typeof tblTabAdd === 'function') tblTabAdd(blk); return; }
    if (e.shiftKey) { const s = getSelection(); const r = s.rangeCount && s.getRangeAt(0); const n = r && r.startContainer; const prev = n && (n.nodeType === 3 && r.startOffset === 0 ? n.previousSibling : n.nodeType === 1 ? n.childNodes[r.startOffset - 1] : null); if (prev && prev.classList && prev.classList.contains('tab')) { prev.remove(); syncFrom(t); } return; }
    document.execCommand('insertHTML', false, '<span class="tab">\t</span>​'); syncFrom(t); return;
  }
  // พิมพ์ "1. " "a) " "- " ต้นบรรทัด → เป็นรายการอัตโนมัติ
  if (e.key === ' ' && !inLi && t.closest('.blk') && !ONE_LINE.has(t.closest('.blk').dataset.t) && !t.dataset.cell && !t.dataset.pf) {
    const s = getSelection(); if (!s.rangeCount || !s.isCollapsed) return; const r = s.getRangeAt(0), n = r.startContainer; if (n.nodeType !== 3) return;
    const before = n.nodeValue.slice(0, r.startOffset); const p = n.previousSibling; if (p && !(p.nodeName === 'BR')) return; if (n.parentElement !== t && !/^(DIV|P)$/.test(n.parentElement.tagName)) return;
    const m = /^\s*(?:(\d+)([.)])|\((\d+)\)|([a-z])([.)])|([ก-ฮ])\.|([-*•–]))$/.exec(before.replace(/​/g, '')); if (!m) return;
    e.preventDefault(); e.stopImmediatePropagation();
    n.nodeValue = n.nodeValue.slice(r.startOffset); if (!n.nodeValue) n.nodeValue = '\u200b';
    const ul = !!m[7]; const st = m[1] ? (m[2] === ')' ? 'dec-paren' : 'decimal') : m[3] ? 'paren-dec' : m[4] ? 'lower-alpha' : m[6] ? 'thai-alpha' : (m[7] === '-' || m[7] === '–') ? 'dash' : 'disc';
    lineToList(t, n, 0, ul ? 'ul' : 'ol', st, +(m[1] || m[3] || 0));
  }
}, true);

/* ---------- แป้นลัด ---------- */
const SC = []; // [คีย์, คำอธิบาย, หมวด, ฟังก์ชัน, ตัวตรวจ]
const scAdd = (keys, desc, grp, fn, test) => SC.push({ keys, desc, grp, fn, test });
const inTextNow = () => !!(document.activeElement && document.activeElement.closest && document.activeElement.closest('#flow [contenteditable="true"]'));
const needText = fn => () => { if (!inTextNow() && !lastRange) { toast('คลิกตำแหน่งในข้อความก่อน'); return; } fn(); };
const clickId = id => () => { const b = $('#' + id); if (b) b.click(); };
const fmtBtn = x => () => { const b = $(`[data-x="${x}"]`); if (b) b.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, cancelable: true })); };
function insertAfterCur(t, extra) { insertBlocks([newBlock(t, extra || {})]); }
const M = e => IS_MAC ? e.metaKey : e.ctrlKey;
// การจัดรูปแบบข้อความ
scAdd('⌘B', 'ตัวหนา', 'ข้อความ', () => exec('bold'), e => M(e) && !e.shiftKey && !e.altKey && e.code === 'KeyB');
scAdd('⌘I', 'ตัวเอียง', 'ข้อความ', () => exec('italic'), e => M(e) && !e.shiftKey && !e.altKey && e.code === 'KeyI');
scAdd('⌘U', 'ขีดเส้นใต้', 'ข้อความ', () => exec('underline'), e => M(e) && !e.shiftKey && !e.altKey && e.code === 'KeyU');
scAdd('⌘⇧X', 'ขีดฆ่า', 'ข้อความ', () => exec('strikeThrough'), e => M(e) && e.shiftKey && e.code === 'KeyX');
scAdd(IS_MAC ? '⌃⌘=' : 'Ctrl+Shift+=', 'ตัวยก (x²)', 'ข้อความ', () => exec('superscript'), e => IS_MAC ? (e.metaKey && e.ctrlKey && (e.code === 'Equal')) : (e.ctrlKey && e.shiftKey && e.code === 'Equal'));
scAdd(IS_MAC ? '⌃⌘−' : 'Ctrl+=', 'ตัวห้อย (x₂)', 'ข้อความ', () => exec('subscript'), e => IS_MAC ? (e.metaKey && e.ctrlKey && e.code === 'Minus') : (e.ctrlKey && !e.shiftKey && e.code === 'Equal'));
scAdd(IS_MAC ? '⌘+' : 'Ctrl+Shift+>', 'ขยายตัวอักษร', 'ข้อความ', () => stepFont(1), e => IS_MAC ? (e.metaKey && !e.ctrlKey && !e.altKey && e.code === 'Equal') : (e.ctrlKey && e.shiftKey && e.code === 'Period'));
scAdd(IS_MAC ? '⌘−' : 'Ctrl+Shift+<', 'ลดขนาดตัวอักษร', 'ข้อความ', () => stepFont(-1), e => IS_MAC ? (e.metaKey && !e.ctrlKey && !e.altKey && e.code === 'Minus') : (e.ctrlKey && e.shiftKey && e.code === 'Comma'));
scAdd('⌘\\', 'ล้างรูปแบบ', 'ข้อความ', fmtBtn('removeFormat'), e => M(e) && !e.shiftKey && e.code === 'Backslash');
// ย่อหน้า
scAdd('⌘⇧[', 'ชิดซ้าย', 'ย่อหน้า', () => exec('justifyLeft'), e => M(e) && e.shiftKey && !e.altKey && e.code === 'BracketLeft');
scAdd('⌘⇧\\', 'กึ่งกลาง', 'ย่อหน้า', () => exec('justifyCenter'), e => M(e) && e.shiftKey && !e.altKey && e.code === 'Backslash');
scAdd('⌘⇧]', 'ชิดขวา', 'ย่อหน้า', () => exec('justifyRight'), e => M(e) && e.shiftKey && !e.altKey && e.code === 'BracketRight');
scAdd('⌥⌘⇧\\', 'เต็มแนว (กระจาย)', 'ย่อหน้า', () => exec('justifyFull'), e => M(e) && e.shiftKey && e.altKey && e.code === 'Backslash');
scAdd('⌘]', 'เพิ่มย่อหน้า (เยื้องเข้า)', 'ย่อหน้า', () => { const li = curLi(); if (li) liIndent(li, curEditable()); else exec('indent'); }, e => M(e) && !e.shiftKey && e.code === 'BracketRight');
scAdd('⌘[', 'ลดย่อหน้า', 'ย่อหน้า', () => { const li = curLi(); if (li) liOutdent(li, curEditable()); else exec('outdent'); }, e => M(e) && !e.shiftKey && e.code === 'BracketLeft');
scAdd('⌘⇧7', 'รายการตัวเลข 1. 2. 3.', 'ย่อหน้า', () => listToggle('ol'), e => M(e) && e.shiftKey && e.code === 'Digit7');
scAdd('⌘⇧8', 'รายการจุด •', 'ย่อหน้า', () => listToggle('ul'), e => M(e) && e.shiftKey && e.code === 'Digit8');
scAdd('Tab / ⇧Tab', 'ในรายการ: เลื่อนเป็นรายการย่อย / ถอยกลับ · ในข้อความ: เว้นระยะแท็บ · ในตาราง: ไปช่องถัดไป', 'ย่อหน้า', null, () => false);
scAdd('↵ บนรายการว่าง', 'จบรายการ', 'ย่อหน้า', null, () => false);
scAdd('⇧↵', 'ขึ้นบรรทัดใหม่ในย่อหน้า/รายการเดิม', 'ย่อหน้า', null, () => false);
scAdd('↵ ต้นข้อความ', 'ดันทั้งกล่องลง 1 บรรทัด (เนื้อหาล่างเลื่อนตาม)', 'ย่อหน้า', null, () => false);
scAdd('⌫ ต้นข้อความ', 'ดึงกล่องขึ้น (ลบบรรทัดว่างด้านบน)', 'ย่อหน้า', null, () => false);
scAdd('↵ บนกรอบที่เลือก', 'ดันบล็อกลง · ⇧↵ = เข้าแก้ไขข้อความ', 'ย่อหน้า', null, () => false);
scAdd('พิมพ์ 1. a) (1) ก. - แล้วเว้นวรรค', 'เปลี่ยนเป็นรายการอัตโนมัติ', 'ย่อหน้า', null, () => false);
// แทรก
scAdd('⌥⌘E', 'แทรกสมการ', 'แทรก', needText(() => openMath(null)), e => M(e) && e.altKey && !e.shiftKey && e.code === 'KeyE');
scAdd('⌥⌘F', 'วาดรูป / กราฟ', 'แทรก', clickId('bFig'), e => M(e) && e.altKey && !e.shiftKey && e.code === 'KeyF');
scAdd('⌥⌘G', 'แทรกรูปภาพจากเครื่อง', 'แทรก', clickId('bImg'), e => M(e) && e.altKey && !e.shiftKey && e.code === 'KeyG');
scAdd('⌥⌘T', 'แทรกตาราง', 'แทรก', () => insertAfterCur('table'), e => M(e) && e.altKey && !e.shiftKey && e.code === 'KeyT');
scAdd('⌥⌘N', 'เพิ่มข้อใหม่', 'แทรก', clickId('bAddQ'), e => M(e) && e.altKey && !e.shiftKey && e.code === 'KeyN');
scAdd('⌥⌘L', 'ช่องเติมคำ ____', 'แทรก', needText(() => $('#fBlank').dispatchEvent(new MouseEvent('mousedown', { bubbles: true, cancelable: true }))), e => M(e) && e.altKey && !e.shiftKey && e.code === 'KeyL');
scAdd('⌥⌘K', 'ไอคอน', 'แทรก', () => $('#fIcon').dispatchEvent(new MouseEvent('mousedown', { bubbles: true, cancelable: true })), e => M(e) && e.altKey && !e.shiftKey && e.code === 'KeyK');
scAdd('⌥⌘B', 'กล่องทฤษฎีบท', 'แทรก', () => insertAfterCur('box', { kind: 'thmf' }), e => M(e) && e.altKey && !e.shiftKey && e.code === 'KeyB');
scAdd('⌥⌘D', 'กล่องบทนิยาม', 'แทรก', () => insertAfterCur('box', { kind: 'def' }), e => M(e) && e.altKey && !e.shiftKey && e.code === 'KeyD');
scAdd('⌥⌘M', 'เมนูแทรกทั้งหมด', 'แทรก', clickId('bInsert'), e => M(e) && e.altKey && !e.shiftKey && e.code === 'KeyM');
scAdd('⌘↵', 'ย่อหน้าใหม่ (กล่องใหม่)', 'แทรก', null, () => false);
scAdd('⌘⇧↵', 'ขึ้นหน้าใหม่', 'แทรก', () => insertAfterCur('pagebreak'), e => M(e) && e.shiftKey && e.key === 'Enter');
// เอกสาร
scAdd('⌘S', 'บันทึกงาน', 'เอกสาร', null, () => false);
scAdd('⌘O', 'เปิดไฟล์งาน', 'เอกสาร', clickId('bOpen'), e => M(e) && !e.shiftKey && !e.altKey && e.code === 'KeyO');
scAdd('⌘P', 'ส่งออก PDF', 'เอกสาร', clickId('bPdf'), e => M(e) && !e.shiftKey && !e.altKey && e.code === 'KeyP');
scAdd('⌘Z / ⌘⇧Z', 'ย้อนกลับ / ทำซ้ำ', 'เอกสาร', null, () => false);
scAdd('⌥⌘S', 'แสดง/ซ่อนสารบัญ', 'เอกสาร', clickId('bNav'), e => M(e) && e.altKey && !e.shiftKey && e.code === 'KeyS');
scAdd('⌘/', 'ดูแป้นลัดทั้งหมด', 'เอกสาร', () => showShortcuts(), e => M(e) && !e.altKey && (e.code === 'Slash'));
scAdd('Esc', 'เลือกทั้งกล่อง (จากในข้อความ) · ⌫ ลบ · ⌘C/X/V/D · ⌥↑↓ เลื่อน', 'เอกสาร', null, () => false);
const TEXT_ONLY = new Set(['ตัวหนา', 'ตัวเอียง', 'ขีดเส้นใต้', 'ขีดฆ่า', 'ตัวยก (x²)', 'ตัวห้อย (x₂)', 'ขยายตัวอักษร', 'ลดขนาดตัวอักษร', 'ล้างรูปแบบ', 'ชิดซ้าย', 'กึ่งกลาง', 'ชิดขวา', 'เต็มแนว (กระจาย)', 'เพิ่มย่อหน้า (เยื้องเข้า)', 'ลดย่อหน้า', 'รายการตัวเลข 1. 2. 3.', 'รายการจุด •', 'ช่องเติมคำ ____', 'ไอคอน']);
document.addEventListener('keydown', e => {
  if (e.isComposing) return;
  if (dlgOpen()) { if (M(e) && e.code === 'Slash' && $('#dAsk.open') && $('#dAsk .kbw')) { e.preventDefault(); $('#askYes').click(); } return; }
  const inForm = document.activeElement && /^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement.tagName); if (inForm) return;
  for (const s of SC) {
    if (!s.fn || !s.test(e)) continue;
    if (TEXT_ONLY.has(s.desc) && !inTextNow()) continue;
    if (['ตัวหนา', 'ตัวเอียง', 'ขีดเส้นใต้'].includes(s.desc)) { /* ให้เบราว์เซอร์ทำเอง แต่บันทึกผล */ setTimeout(() => { const ed = curEditable(); if (ed) syncFrom(ed); }, 0); return; }
    e.preventDefault(); e.stopPropagation(); s.fn(); return;
  }
}, true);
function showShortcuts() {
  const groups = [...new Set(SC.map(s => s.grp))];
  const body = `<div class="kbgrid">${groups.map(g => `<div class="kbg"><h4>${g}</h4>${SC.filter(s => s.grp === g).map(s => `<div class="kbr"><kbd>${esc(IS_MAC ? s.keys : KM(s.keys).replace(/⇧/g, 'Shift+').replace(/⌃/g, 'Ctrl+').replace(/↵/g, 'Enter').replace(/Ctrl\+Ctrl\+/g, 'Ctrl+'))}</kbd><span>${esc(s.desc)}</span></div>`).join('')}</div>`).join('')}</div><p class="hint">${IS_MAC ? '⌘ = Command · ⌥ = Option · ⇧ = Shift · ⌃ = Control' : 'บน Windows ใช้ Ctrl แทน ⌘ และ Alt แทน ⌥'}</p>`;
  const pr = ask('แป้นลัด (คล้าย Pages)', body, 'ปิด'); const d = $('#dAsk .dlg'); d.classList.add('kbw'); const no = $('#dAsk [id$=No], #dAsk .tb:not(.primary)'); if (no) no.style.display = 'none'; Promise.resolve(pr).then(() => { d.classList.remove('kbw'); if (no) no.style.display = ''; });
}
/* ---------- ปุ่ม/เมนูรูปแบบเลขรายการ ---------- */
(function () {
  const ol = $('[data-x="insertOrderedList"]'); if (!ol) return;
  const b = document.createElement('button'); b.className = 'tb'; b.id = 'fLs'; b.title = 'รูปแบบเลข/สัญลักษณ์รายการ: 1. a. ก. (1) • – ✓'; b.textContent = 'รูปแบบรายการ ▾'; ol.after(b);
  const m = document.createElement('div'); m.className = 'menu'; m.id = 'mLs'; document.body.appendChild(m);
  m.innerHTML = `<div class="hd">ตัวเลข / ตัวอักษร</div>${LIST_STYLES.filter(x => x[2] === 'ol').map(([k, n]) => `<button data-ls="${k}" data-lk="ol">${n}</button>`).join('')}<div class="hd">สัญลักษณ์</div>${LIST_STYLES.filter(x => x[2] === 'ul').map(([k, n]) => `<button data-ls="${k}" data-lk="ul">${n}</button>`).join('')}<div class="hd">เริ่มนับที่</div><button data-ls="start">ตั้งเลขเริ่มต้น…</button>`;
  b.addEventListener('mousedown', e => { e.preventDefault(); const ed = curEditable(); if (ed) { const s = getSelection(); if (s.rangeCount) lastRange = s.getRangeAt(0).cloneRange(); } openMenuAt(m, b); });
  m.addEventListener('mousedown', e => e.preventDefault());
  m.onclick = async e => {
    const x = e.target.closest('[data-ls]'); if (!x) return; closeMenus();
    if (x.dataset.ls === 'start') { restoreSel(); const li = curLi(); if (!li) { toast('คลิกในรายการตัวเลขก่อน'); return; } const lst = li.parentElement; const v = prompt('เริ่มนับที่เลข', lst.getAttribute('start') || '1'); if (v && +v > 0) { lst.setAttribute('start', +v); syncFrom(curEditable()); } return; }
    listToggle(x.dataset.lk, x.dataset.ls);
  };
  ['indent', 'outdent'].forEach(x => { const bt = $(`[data-x="${x}"]`); if (bt) bt.addEventListener('mousedown', e => { restoreSel(); const li = curLi(); if (!li) return; e.preventDefault(); e.stopImmediatePropagation(); const ed = curEditable(); if (x === 'indent') liIndent(li, ed); else liOutdent(li, ed); }, true); });
  const kb = document.createElement('button'); kb.className = 'tb'; kb.id = 'fKeys'; kb.title = 'ดูแป้นลัดทั้งหมด (⌘/)'; kb.textContent = '⌨ แป้นลัด'; const last = $('[data-x="removeFormat"]'); if (last) last.after(kb);
  kb.addEventListener('mousedown', e => { e.preventDefault(); showShortcuts(); });
})();

