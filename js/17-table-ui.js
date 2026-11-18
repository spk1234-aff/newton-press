'use strict';
/* ===================== ตัวเลือกสีแบบ Pages: ตารางสี · สีของเอกสาร · เลือกเอง (วงสี/hex/ความเข้ม) · หลอดดูดสี · ล่าสุด/โปรด ===================== */
const CP = { el: null, o: null, h: 0, s: 0, v: 0, a: 1, anchor: null };
const cpClamp = (x, a, b) => Math.max(a, Math.min(b, x));
function cpHex(r, g, b) { return '#' + [r, g, b].map(x => cpClamp(Math.round(x), 0, 255).toString(16).padStart(2, '0')).join(''); }
function cpRgb(hex) { hex = String(hex || '').trim(); let m = /^#?([0-9a-f]{3})$/i.exec(hex); if (m) hex = m[1].split('').map(c => c + c).join(''); m = /^#?([0-9a-f]{6})/i.exec(hex); if (m) return [0, 2, 4].map(i => parseInt(m[1].substr(i, 2), 16)); m = /rgba?\(\s*([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)/i.exec(hex); return m ? [+m[1], +m[2], +m[3]] : null; }
function cpNorm(c) { const r = cpRgb(c); return r ? cpHex(...r) : ''; }
function cpHsv2rgb(h, s, v) { const f = n => { const k = (n + h / 60) % 6; return v - v * s * Math.max(0, Math.min(k, 4 - k, 1)); }; return [f(5) * 255, f(3) * 255, f(1) * 255]; }
function cpRgb2hsv(r, g, b) { r /= 255; g /= 255; b /= 255; const mx = Math.max(r, g, b), d = mx - Math.min(r, g, b); let h = 0; if (d) { h = mx === r ? ((g - b) / d) % 6 : mx === g ? (b - r) / d + 2 : (r - g) / d + 4; h *= 60; if (h < 0) h += 360; } return [h, mx ? d / mx : 0, mx]; }
function cpHsl(h, s, l) { s /= 100; l /= 100; const a = s * Math.min(l, 1 - l), f = n => { const k = (n + h / 30) % 12; return l - a * Math.max(-1, Math.min(k - 3, 9 - k, 1)); }; return cpHex(f(0) * 255, f(8) * 255, f(4) * 255); }
function cpMix(c, w, t) { const a = cpRgb(c) || [0, 0, 0], b = cpRgb(w) || [255, 255, 255]; return cpHex(...a.map((x, i) => x + (b[i] - x) * t)); }
const CP_GRID = (() => { const rows = [], L = [93, 86, 77, 67, 57, 48, 40, 32, 24, 16], H = [0, 22, 40, 52, 85, 145, 175, 200, 222, 262, 310];
  L.forEach((l, i) => { const r = [cpHsl(0, 0, 100 - i * 11.1)]; H.forEach(h => r.push(cpHsl(h, h === 52 ? 92 : 78, l))); rows.push(r); }); return rows; })();
const cpStore = { get(k) { try { return JSON.parse(localStorage.getItem(k) || '[]'); } catch (e) { return []; } }, set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { } } };
function cpRecent(c) { if (!c) return; let L = cpStore.get('np-cpr').filter(x => x !== c); L.unshift(c); cpStore.set('np-cpr', L.slice(0, 12)); }
function cpDocColors() { const cs = getComputedStyle(document.body), out = []; ['--brown', '--dark', '--bar', '--sep', '--ink', '--navy', '--gold', '--teal', '--red'].forEach(k => { const v = cpNorm(cs.getPropertyValue(k)); if (v && !out.includes(v)) out.push(v); }); return out; }
function cpCur() { const [r, g, b] = cpHsv2rgb(CP.h, CP.s, CP.v); return CP.a >= 0.995 ? cpHex(r, g, b) : cpMix(cpHex(r, g, b), '#ffffff', 1 - CP.a); }
(function () {
  const s = document.createElement('style');
  s.textContent = `#cpk{position:fixed;z-index:10050;width:264px;background:#fff;border:1px solid #d9d9de;border-radius:14px;box-shadow:0 12px 40px rgba(0,0,0,.22);padding:12px;font-family:var(--ui-font);font-size:14px;color:#333;user-select:none;-webkit-user-select:none;display:none;max-height:calc(100vh - 16px);overflow-y:auto;box-sizing:border-box}
#cpk.on{display:block}#cpk .cl{font-size:12px;color:#8e8e93;margin:8px 0 4px;letter-spacing:.02em}#cpk .cl:first-child{margin-top:0}
#cpk .cg{display:grid;grid-template-columns:repeat(12,1fr);gap:0;border-radius:8px;overflow:hidden;border:1px solid #0001}#cpk .cg button{aspect-ratio:1;border:0;padding:0;cursor:pointer;position:relative}#cpk .cg button:hover{outline:2px solid #fff;outline-offset:-2px;box-shadow:0 0 0 1px #0006;z-index:1}
#cpk .cr{display:flex;gap:5px;flex-wrap:wrap;min-height:22px}#cpk .cr button{width:22px;height:22px;border-radius:50%;border:1px solid #0002;padding:0;cursor:pointer}#cpk .cr button.sel,#cpk .cg button.sel{outline:2px solid #0a84ff;outline-offset:1px;z-index:2}
#cpk .sv{position:relative;height:96px;border-radius:8px;margin-top:4px;cursor:crosshair;touch-action:none;background-image:linear-gradient(to top,#000,transparent),linear-gradient(to right,#fff,transparent)}#cpk .sv i,#cpk .sl i{position:absolute;width:14px;height:14px;border-radius:50%;border:2px solid #fff;box-shadow:0 0 0 1px #0007;transform:translate(-50%,-50%);pointer-events:none}
#cpk .sl{position:relative;height:14px;border-radius:7px;margin-top:10px;cursor:pointer;touch-action:none}#cpk .sl i{top:50%}#cpk .hue{background:linear-gradient(to right,#f00,#ff0,#0f0,#0ff,#00f,#f0f,#f00)}
#cpk .al{background-image:linear-gradient(to right,#fff,var(--c)),repeating-conic-gradient(#ddd 0 25%,#fff 0 50%);background-size:auto,10px 10px}
#cpk .cf{display:flex;gap:6px;align-items:center;margin-top:10px}#cpk .cf .pv{width:30px;height:30px;border-radius:8px;border:1px solid #0002;flex:none}#cpk .cf input{flex:1;min-width:0;height:30px;border:1px solid #d9d9de;border-radius:8px;padding:0 8px;font:14px ui-monospace,Menlo,monospace;text-transform:uppercase;user-select:text;-webkit-user-select:text}
#cpk .cf span{font-size:12px;color:#8e8e93;width:38px;text-align:right}#cpk .cf button,#cpk .cn{height:30px;border:1px solid #d9d9de;background:#fff;border-radius:8px;cursor:pointer;font:inherit;padding:0 8px;display:grid;place-items:center}#cpk .cf button:hover,#cpk .cn:hover{background:#f2f2f7}
#cpk .cn{width:100%;margin-top:10px;display:flex;gap:8px;justify-content:center;align-items:center}#cpk .cn i{width:16px;height:16px;border-radius:50%;border:1px solid #0003;background:linear-gradient(135deg,#fff 44%,#ff3b30 45%,#ff3b30 55%,#fff 56%)}
#cpk details{margin-top:8px}#cpk summary{cursor:pointer;font-size:13px;color:#555;list-style:none;display:flex;align-items:center;gap:4px}#cpk summary::before{content:'›';display:inline-block;transition:transform .15s;font-size:16px}#cpk details[open] summary::before{transform:rotate(90deg)}
input[type=color]{-webkit-appearance:none;appearance:none;width:28px;height:28px;border:1px solid #0002;border-radius:50%;padding:0;background:none;cursor:pointer;overflow:hidden;vertical-align:middle}input[type=color]::-webkit-color-swatch-wrapper{padding:0}input[type=color]::-webkit-color-swatch{border:0;border-radius:50%}input[type=color]::-moz-color-swatch{border:0;border-radius:50%}`;
  document.head.appendChild(s);
})();
function cpBuild() {
  const d = document.createElement('div'); d.id = 'cpk'; document.body.appendChild(d); CP.el = d;
  d.addEventListener('mousedown', e => { if (e.target.tagName !== 'INPUT') e.preventDefault(); e.stopPropagation(); });
  d.addEventListener('pointerdown', e => { e.stopPropagation(); const z = e.target.closest('.sv,.hue,.al'); if (!z) return; e.preventDefault();
    const mv = ev => { const r = z.getBoundingClientRect(), x = cpClamp((ev.clientX - r.left) / r.width, 0, 1), y = cpClamp((ev.clientY - r.top) / r.height, 0, 1);
      if (z.classList.contains('sv')) { CP.s = x; CP.v = 1 - y; } else if (z.classList.contains('hue')) CP.h = x * 359.9; else CP.a = x; cpSync(); if (CP.o && CP.o.live) CP.o.onPick(cpCur()); };
    const up = () => { removeEventListener('pointermove', mv); removeEventListener('pointerup', up); cpEmit(false); };
    addEventListener('pointermove', mv); addEventListener('pointerup', up); mv(e); });
  d.addEventListener('click', e => {
    const b = e.target.closest('button'); if (!b) return;
    if (b.dataset.c !== undefined) { if (e.altKey && b.closest('.fav')) { cpStore.set('np-cpf', cpStore.get('np-cpf').filter(x => x !== b.dataset.c)); cpFill(); return; } cpSet(b.dataset.c); cpEmit(true); return; }
    if (b.dataset.k === 'none') { const o = CP.o; cpClose(); if (o) o.onPick(''); return; }
    if (b.dataset.k === 'fav') { const c = cpCur(); let L = cpStore.get('np-cpf').filter(x => x !== c); L.unshift(c); cpStore.set('np-cpf', L.slice(0, 24)); cpFill(); return; }
    if (b.dataset.k === 'eye' && window.EyeDropper) { new EyeDropper().open().then(r => { cpSet(r.sRGBHex); cpEmit(false); }).catch(() => { }); }
  });
  d.addEventListener('toggle', () => { const r = d.getBoundingClientRect(); if (r.bottom > innerHeight - 8) d.style.top = Math.max(8, innerHeight - r.height - 8) + 'px'; }, true);
  d.addEventListener('change', e => { if (e.target.dataset.k === 'hex') { const c = cpNorm(e.target.value); if (c) { cpSet(c); cpEmit(false); } else cpSync(); } });
  d.addEventListener('keydown', e => { if (e.key === 'Enter' && e.target.dataset.k === 'hex') { e.target.blur(); } if (e.key === 'Escape') cpClose(); e.stopPropagation(); });
  document.addEventListener('mousedown', e => { if (CP.el.classList.contains('on') && !CP.el.contains(e.target) && !(CP.anchor && CP.anchor.contains(e.target))) cpClose(); }, true);
  addEventListener('keydown', e => { if (e.key === 'Escape' && CP.el.classList.contains('on')) { cpClose(); e.stopPropagation(); } }, true);
  addEventListener('resize', cpClose);
}
function cpSet(c, quiet) { const r = cpRgb(c); if (!r) return; const [h, s, v] = cpRgb2hsv(...r); if (s > 0.001 && v > 0.001) CP.h = h; CP.s = s; CP.v = v; CP.a = 1; if (!quiet) cpSync(); }
function cpSync() {
  const d = CP.el, pure = cpHex(...cpHsv2rgb(CP.h, 1, 1)), c = cpCur(), sv = $('.sv', d);
  sv.style.backgroundColor = pure; $('.sv i', d).style.cssText = `left:${CP.s * 100}%;top:${(1 - CP.v) * 100}%`; $('.hue i', d).style.left = (CP.h / 360 * 100) + '%';
  const al = $('.al', d); al.style.setProperty('--c', cpHex(...cpHsv2rgb(CP.h, CP.s, CP.v))); $('.al i', d).style.left = (CP.a * 100) + '%';
  $('.pv', d).style.background = c; const hx = $('[data-k=hex]', d); if (document.activeElement !== hx) hx.value = c.slice(1).toUpperCase(); $('.ap', d).textContent = Math.round(CP.a * 100) + '%';
  $$('button[data-c]', d).forEach(b => b.classList.toggle('sel', b.dataset.c === c));
}
function cpEmit(close) { const o = CP.o; if (!o) return; const c = cpCur(); cpRecent(c); if (close) cpClose(); else cpFill(true); o.onPick(c); }
function cpFill(keep) {
  const d = CP.el, o = CP.o || {}, rec = cpStore.get('np-cpr'), fav = cpStore.get('np-cpf'), docc = cpDocColors();
  const sw = L => L.map(c => `<button data-c="${c}" style="background:${c}" title="${c.toUpperCase()}"></button>`).join('');
  const open = keep ? ($('details', d) || {}).open : (o.custom || false);
  d.innerHTML = (rec.length ? `<div class="cl">ล่าสุด</div><div class="cr">${sw(rec.slice(0, 10))}</div>` : '') +
    `<div class="cl">สีของเอกสาร</div><div class="cr">${sw(docc)}</div>` +
    (fav.length ? `<div class="cl">สีโปรด</div><div class="cr fav" title="กด ⌥/Alt ค้างแล้วคลิก เพื่อลบ">${sw(fav)}</div>` : '') +
    `<div class="cl">ตารางสี</div><div class="cg">${CP_GRID.map(r => sw(r)).join('')}</div>` +
    `<details${open ? ' open' : ''}><summary>เลือกสีเอง</summary><div class="sv"><i></i></div><div class="sl hue"><i></i></div><div class="sl al" title="ความเข้ม"><i></i></div></details>` +
    `<div class="cf"><div class="pv"></div><input data-k="hex" maxlength="7" spellcheck="false" title="รหัสสี"><span class="ap"></span>${window.EyeDropper ? '<button data-k="eye" title="ดูดสีจากหน้าจอ"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m2 22 1-1h3l9-9"/><path d="M3 21v-3l9-9"/><path d="m15 6 3.4-3.4a2.1 2.1 0 1 1 3 3L18 9l.4.4a2.1 2.1 0 1 1-3 3l-3.8-3.8a2.1 2.1 0 1 1 3-3l.4.4Z"/></svg></button>' : ''}<button data-k="fav" title="เก็บเป็นสีโปรด">♥</button></div>` +
    (o.none ? `<button class="cn" data-k="none"><i></i>${esc(o.noneLabel || 'ไม่มีสี')}</button>` : '');
  cpSync();
}
function cpOpen(anchor, o) {
  if (!CP.el) cpBuild();
  if (CP.el.classList.contains('on') && CP.anchor === anchor) { cpClose(); return; }
  CP.o = o; CP.anchor = anchor; CP.a = 1; const v = cpNorm(o.value); if (v) cpSet(v, true); else { CP.h = 210; CP.s = 0; CP.v = 0; }
  cpFill(); const d = CP.el; d.classList.add('on');
  const r = anchor.getBoundingClientRect(), w = d.offsetWidth, h = d.offsetHeight;
  let x = Math.min(Math.max(8, r.left + r.width / 2 - w / 2), innerWidth - w - 8), y = r.bottom + 6; if (y + h > innerHeight - 8) y = Math.max(8, r.top - h - 6); if (y < 8 || (y < r.bottom && y + h > r.top)) { y = Math.max(8, innerHeight - h - 8); x = r.left - w - 8 > 8 ? r.left - w - 8 : Math.min(innerWidth - w - 8, r.right + 8); }
  d.style.left = x + 'px'; d.style.top = y + 'px';
}
function cpClose() { if (CP.el) CP.el.classList.remove('on'); CP.o = null; CP.anchor = null; }
/* ---------- ใช้ตัวเลือกสีนี้แทนของระบบทุกที่ ---------- */
document.addEventListener('click', e => {
  const inp = e.target.closest && e.target.closest('input[type=color]'); if (!inp || inp.closest('#cpk') || inp.dataset.native) return;
  e.preventDefault(); e.stopPropagation();
  cpOpen(inp, { value: inp.value, onPick: c => { if (!c) return; inp.value = c; inp.dispatchEvent(new Event('input', { bubbles: true })); inp.dispatchEvent(new Event('change', { bubbles: true })); } });
}, true);
/* ---------- สีตัวอักษร / ปากกาเน้น บนแถบจัดรูปแบบ ---------- */
const CPT = { fg: '#c0392b', hi: '#fff3a3' };
function cpTextBtn(id, kind) {
  const btn = $(id); if (!btn) return;
  btn.addEventListener('mousedown', e => {
    e.preventDefault(); e.stopImmediatePropagation();
    const ed = typeof curEditable === 'function' && curEditable(); if (ed && getSelection().rangeCount) lastRange = getSelection().getRangeAt(0).cloneRange();
    cpOpen(btn, { value: CPT[kind], none: true, noneLabel: kind === 'fg' ? 'สีเดิมของข้อความ' : 'ไม่เน้น', onPick: c => {
      if (kind === 'fg') { let col = c; if (!c) { restoreSel(); const e2 = curEditable(); col = e2 ? cpNorm(getComputedStyle(e2).color) : '#222222'; } else CPT.fg = c; exec('foreColor', col); }
      else { if (c) CPT.hi = c; exec('hiliteColor', c || 'transparent'); }
      cpTextPaint(); } });
  }, true);
}
function cpTextPaint() { const a = $('#fFg .ca'), b = $('#fHi .hi'); if (a) a.style.color = CPT.fg; if (b) b.style.background = CPT.hi; }
cpTextBtn('#fFg', 'fg'); cpTextBtn('#fHi', 'hi'); cpTextPaint();

/* ===================== แถบเครื่องมือตารางลอย (แบบ Pages) + แผงตั้งค่าตารางแบ่งแท็บ ===================== */
(function () {
  const s = document.createElement('style');
  s.textContent = `#tbar{position:fixed;z-index:7002;display:none;gap:2px;align-items:center;background:#fff;border:1px solid var(--ui-line);border-radius:11px;box-shadow:0 6px 20px rgba(0,0,0,.16);padding:3px;font-family:var(--ui-font);user-select:none;-webkit-user-select:none}
#tbar.on{display:flex}#tbar>button{border:0;background:none;border-radius:8px;height:32px;padding:0 10px;font:inherit;font-size:15px;cursor:pointer;white-space:nowrap;color:#3b2a1e}#tbar>button:hover,#tbar>button.open{background:#f3ece4}
#tbar>button.pri{background:#2f7de1;color:#fff}#tbar>button.pri:hover{background:#1f6bd0}#tbar .sep{width:1px;height:22px;background:var(--ui-line);margin:0 2px}#tbar .tbinfo{font-size:13px;color:#8a7a6d;padding:0 6px;white-space:nowrap}
body.tbar-on #tsbar{display:none!important}body:has(.dlg-back.open) #tbar,.exporting #tbar,.xsmode #tbar{display:none!important}
.tbm{position:fixed;z-index:9999;background:#fff;border:1px solid var(--ui-line);border-radius:10px;box-shadow:0 8px 24px rgba(0,0,0,.18);padding:5px;display:flex;flex-direction:column;min-width:220px;font-size:16px;font-family:var(--ui-font);user-select:none;-webkit-user-select:none}
.tbm button{border:0;background:none;text-align:left;padding:7px 12px;border-radius:7px;font:inherit;cursor:pointer;color:#3b2a1e;display:flex;gap:8px;align-items:center}.tbm button:hover{background:#f3ece4}.tbm button.on{background:#e8f0fd}.tbm button.dan{color:#c0392b}
.tbm hr{border:0;border-top:1px solid var(--ui-line);margin:4px 2px}.tbm .lb{font-size:13px;color:#8a7a6d;padding:4px 12px 2px}
.tbm .sws{display:grid;grid-template-columns:repeat(6,28px);gap:5px;padding:6px 10px}.tbm .sws button{width:28px;height:28px;padding:0;border-radius:6px;border:1px solid #0002}.tbm .sws button.no{background:linear-gradient(135deg,#fff 45%,#c0392b 46%,#c0392b 54%,#fff 55%)}
.tbm .bdg{margin:4px 8px}.tbm .bdg button{padding:0;width:34px;height:30px;display:grid;place-items:center}.ipane>.hint:first-child{margin-top:4px!important}
.itabs{display:flex;gap:4px;margin:0 0 10px;border-bottom:1px solid var(--ui-line)}.itabs button{border:0;background:none;padding:7px 10px;font:inherit;font-size:15px;cursor:pointer;color:#8a7a6d;border-bottom:2px solid transparent;margin-bottom:-1px}.itabs button.on{color:#3b2a1e;border-bottom-color:var(--ui-accent,#7a3e10);font-weight:700}
.ipane{display:none}.ipane.on{display:block}`;
  document.head.appendChild(s);
})();

/* ---------- หาตาราง/ช่องปัจจุบัน ---------- */
function tbCtx() {
  if (PG.ts && PG.ts.z && PG.ts.R) { const b = byId(PG.ts.id); if (b && b.t === 'table') { const R = PG.ts.R; return { b, i: R.r0, j: R.c0, R, n: PG.ts.n || 1 }; } }
  const s = getSelection(); let n = s.rangeCount ? s.getRangeAt(0).startContainer : null;
  let td = n && (n.nodeType === 1 ? n : n.parentElement); td = td && td.closest && td.closest('#flow td[data-cell]');
  if (!td) return null; const blk = td.closest('.blk'); const b = blk && byId(blk.dataset.id); if (!b || b.t !== 'table') return null;
  const [i, j] = td.dataset.cell.split(',').map(Number); const mg = (b.mg || {})[td.dataset.cell] || [1, 1];
  return { b, i, j, R: { r0: i, r1: i + mg[0] - 1, c0: j, c1: j + mg[1] - 1 }, n: 1, td };
}
let TB_LAST = null;
function tbPlace() {
  const bar = $('#tbar'); if (!bar) return; const c = tbCtx();
  if (!c || document.body.classList.contains('xsmode')) { bar.classList.remove('on'); document.body.classList.remove('tbar-on'); TB_LAST = null; return; }
  const key = c.b.id + ':' + c.R.r0 + ',' + c.R.c0 + ':' + c.R.r1 + ',' + c.R.c1 + ':' + c.n;
  if (key !== TB_LAST) { TB_LAST = key; tbRender(c); }
  const t = $(`.blk[data-id="${c.b.id}"] .b-table table`); if (!t) return; const tr = t.getBoundingClientRect();
  const sc = $('#scroller'), sr = sc ? sc.getBoundingClientRect() : { top: 0, bottom: innerHeight };
  bar.classList.add('on'); document.body.classList.add('tbar-on');
  const h = bar.offsetHeight; let top = tr.top - h - 24; if (top < sr.top + 6) top = Math.min(sr.top + 6, tr.bottom - h - 6);
  if (tr.bottom < sr.top + 10 || tr.top > sr.bottom - 10) { bar.classList.remove('on'); document.body.classList.remove('tbar-on'); return; }
  bar.style.top = top + 'px'; bar.style.left = Math.max(6, Math.min(tr.left, innerWidth - bar.offsetWidth - 8)) + 'px';
}
function tbRender(c) {
  const bar = $('#tbar'); const multi = c.n > 1;
  const nr = c.R.r1 - c.R.r0 + 1, nc = c.R.c1 - c.R.c0 + 1;
  bar.innerHTML = `<span class="tbinfo">${multi ? `เลือก ${c.n} ช่อง` : `แถว ${c.i + 1} · คอลัมน์ ${c.j + 1}`}</span><span class="sep"></span>
<button data-m="row">☰ แถว ▾</button><button data-m="col">▥ คอลัมน์ ▾</button><button data-m="cell">${multi ? '⊞ ผสาน/แยก ▾' : '⊞ ช่อง ▾'}</button><span class="sep"></span>
<button data-m="bg">🎨 สีพื้น ▾</button><button data-m="bd">▦ เส้นขอบ ▾</button><span class="sep"></span><button data-m="set">⚙ ตั้งค่าตาราง</button>`;
  bar.dataset.nr = nr; bar.dataset.nc = nc;
}
let tbMenuEl = null;
function tbMenuClose() { if (tbMenuEl) tbMenuEl.remove(); tbMenuEl = null; $$('#tbar > button.open').forEach(x => x.classList.remove('open')); }
function tbMenu(btn, kind) {
  const c = tbCtx(); if (!c) return; const open = btn.classList.contains('open'); tbMenuClose(); if (open) return;
  if (kind === 'set') { tbOpenSettings('table'); return; }
  const b = c.b, R = c.R, nr = c.n > 1 ? R.r1 - R.r0 + 1 : 1, nc = c.n > 1 ? R.c1 - R.c0 + 1 : 1, it = (t, f, cls) => `<button data-f="${f}"${cls ? ` class="${cls}"` : ''}>${t}</button>`;
  let h = '';
  if (kind === 'row') { const rsv = (b.rs || (b.rs === undefined ? { 0: 'L' } : {}))[R.r0] || '';
    h = it('⬆ แทรกแถวด้านบน', 'rA') + it('⬇ แทรกแถวด้านล่าง', 'rB') + it('⧉ ทำซ้ำแถว' + (nr > 1 ? ` (${nr} แถว)` : ''), 'rD') + it('✕ ลบแถว' + (nr > 1 ? ` (${nr} แถว)` : 'นี้'), 'rX', 'dan')
      + '<hr><div class="lb">รูปแบบแถว</div>' + RS_OPTS.map(([k, v]) => it(v, 'rs:' + k, rsv === k ? 'on' : '')).join(''); }
  if (kind === 'col') h = it('⬅ แทรกคอลัมน์ด้านซ้าย', 'cL') + it('➡ แทรกคอลัมน์ด้านขวา', 'cR') + it('✕ ลบคอลัมน์' + (nc > 1 ? ` (${nc} คอลัมน์)` : 'นี้'), 'cX', 'dan')
    + '<hr>' + it('⟷ กว้างขึ้น', 'cW') + it('→← แคบลง', 'cN') + it('⚌ แบ่งความกว้างเท่ากันทุกคอลัมน์', 'cE')
    + '<hr><div class="lb">จัดข้อความในช่อง (ทั้งตาราง)</div>' + [['', 'กึ่งกลาง'], ['left', 'ชิดซ้าย'], ['first', 'คอลัมน์แรกชิดซ้าย']].map(([k, v]) => it(v, 'al:' + k, (b.al || '') === k ? 'on' : '')).join('');
  if (kind === 'cell') { const sp = (b.mg || {})[R.r0 + ',' + R.c0]; const anyMg = c.n > 1 ? !!PG.ts.any : !!sp;
    h = (c.n > 1 ? it(`⊞ ผสาน ${c.n} ช่องเป็นช่องเดียว`, 'mM') : it('→ รวมกับช่องทางขวา', 'mR') + it('↓ รวมกับช่องด้านล่าง', 'mD'))
      + (anyMg ? it('⊟ แยกช่องที่ผสานไว้', 'mX') : '') + '<hr>' + it('⌫ ล้างข้อความในช่อง' + (c.n > 1 ? `ที่เลือก (${c.n})` : 'นี้'), 'mC')
      + '<hr><div class="lb">ทิป: ลากคลุมหลายช่อง แล้วกด “ผสาน”</div>'; }
  if (kind === 'bg') h = `<div class="lb">สีพื้นหลัง${c.n > 1 ? `ช่องที่เลือก (${c.n})` : 'ช่องนี้'}</div><div class="sws">${CF_BG.map(x => `<button data-f="bg:${x}" style="background:${x}" title="${x}"></button>`).join('')}<button data-f="bg:" class="no" title="ไม่มีสี"></button></div>`
    + `<div class="lb">สีตัวอักษร</div><div class="sws">${CF_FG.map(x => `<button data-f="fg:${x}" style="background:${x}" title="${x}"></button>`).join('')}<button data-f="fg:" class="no" title="สีเดิม"></button></div>`
    + '<hr>' + it('ใช้สีกับทั้งตาราง…', 'bgall');
  if (kind === 'bd') h = `<div class="lb">เส้นขอบ${c.n > 1 ? `ช่องที่เลือก (${c.n})` : 'ทั้งตาราง (ลากคลุมช่องก่อน = เฉพาะบางช่อง)'}<br>${BD_ST.find(x => x[0] === BD.st)[1]} ${BD.pt} pt</div><div class="bdg">${BD_KEYS.map(([k, t]) => `<button data-f="bd:${k}" title="${t}">${bdIcon(k)}</button>`).join('')}</div>`
    + '<hr>' + it('▢ ไม่มีเส้น (ส่วนที่เลือก)', 'bdnone') + it('↺ ล้างเส้นที่ตั้งเอง', 'bdx') + it('✎ เลือกลักษณะเส้น/สี/ความหนา…', 'bdset');
  const m = document.createElement('div'); m.className = 'tbm'; m.innerHTML = h; document.body.appendChild(m); tbMenuEl = m; btn.classList.add('open');
  const r = btn.getBoundingClientRect(), mr = m.getBoundingClientRect();
  m.style.left = Math.max(6, Math.min(r.left, innerWidth - mr.width - 8)) + 'px'; m.style.top = (r.bottom + 4 + mr.height > innerHeight ? Math.max(6, r.top - mr.height - 4) : r.bottom + 4) + 'px';
  m.addEventListener('mousedown', e => e.preventDefault());
  m.addEventListener('click', e => { const f = e.target.closest('[data-f]')?.dataset.f; if (!f) return; e.stopPropagation(); tbMenuClose(); tbDo(f); });
}
function tbDo(f) {
  const c = tbCtx(); if (!c) return; const b = c.b, R = c.R; let foc = null; const nr = c.n > 1 ? R.r1 - R.r0 + 1 : 1, nc = c.n > 1 ? R.c1 - R.c0 + 1 : 1;
  if (curId !== b.id) selectBlock(b.id);
  const keepRange = c.n > 1;
  if (f === 'rA') { for (let k = 0; k < nr; k++) tblInsRow(b, R.r0); foc = R.r0 + ',' + R.c0; }
  else if (f === 'rB') { for (let k = 0; k < nr; k++) tblInsRow(b, R.r1 + 1); foc = (R.r1 + 1) + ',' + R.c0; }
  else if (f === 'rD') { for (let k = nr - 1; k >= 0; k--) { tblInsRow(b, R.r1 + 1); b.rows[R.r1 + 1] = b.rows[R.r0 + k].slice(); } foc = (R.r1 + 1) + ',' + R.c0; }
  else if (f === 'rX') { if (nr >= b.rows.length) { toast('ลบทุกแถวไม่ได้ — ถ้าจะลบทั้งตาราง ให้เลือกกล่องแล้วกด ✕'); return; } for (let k = R.r0 + nr - 1; k >= R.r0; k--) tblDelRow(b, k); foc = Math.min(R.r0, b.rows.length - 1) + ',0'; }
  else if (f.startsWith('rs:')) { tPrep(b); const v = f.slice(3); for (let k = R.r0; k <= R.r1; k++) { if (v) b.rs[k] = v; else delete b.rs[k]; } }
  else if (f === 'cL') { for (let k = 0; k < nc; k++) tblInsCol(b, R.c0); foc = R.r0 + ',' + R.c0; }
  else if (f === 'cR') { for (let k = 0; k < nc; k++) tblInsCol(b, R.c1 + 1); foc = R.r0 + ',' + (R.c1 + 1); }
  else if (f === 'cX') { if (nc >= tNcol(b)) { toast('ลบทุกคอลัมน์ไม่ได้'); return; } for (let k = R.c0 + nc - 1; k >= R.c0; k--) tblDelCol(b, k); foc = R.r0 + ',' + Math.min(R.c0, tNcol(b) - 1); }
  else if (f === 'cW' || f === 'cN') { tblNudgeCol(b.id, R.c0, f === 'cW' ? 6 : -6); return; }
  else if (f === 'cE') { delete b.cw; }
  else if (f.startsWith('al:')) { const v = f.slice(3); if (v) b.al = v; else delete b.al; }
  else if (f === 'mR' || f === 'mD' || f === 'mX' && c.n <= 1) { const k = R.r0 + ',' + R.c0; b.mg = b.mg || {}; const v = b.mg[k] || [1, 1]; const n = tNcol(b);
    if (f === 'mR') { if (R.c1 + 1 >= n) { toast('ไม่มีช่องทางขวาแล้ว'); return; } v[1]++; b.mg[k] = v; }
    else if (f === 'mD') { if (R.r1 + 1 >= b.rows.length) { toast('ไม่มีช่องด้านล่างแล้ว'); return; } v[0]++; b.mg[k] = v; }
    else delete b.mg[k];
    if (!Object.keys(b.mg).length) delete b.mg; foc = k; }
  else if (f === 'mM') { pgCellAct('merge'); return; }
  else if (f === 'mX') { pgCellAct('split'); return; }
  else if (f === 'mC') { if (c.n > 1) { pgCellAct('clear'); return; } b.rows[R.r0][R.c0] = ''; foc = R.r0 + ',' + R.c0; }
  else if (f.startsWith('bg:') || f.startsWith('fg:')) { cfApplyKeys(b, cfKeysOf(b, R), f[0] === 'b' ? 0 : 1, f.slice(3)); tbRefocus(b, R, keepRange); return; }
  else if (f === 'bgall') { tbOpenSettings('cell'); return; }
  else if (f.startsWith('bd:') || f === 'bdnone') { tbBorder(b, c, f === 'bdnone' ? 'all' : f.slice(3), f === 'bdnone'); tbRefocus(b, R, keepRange); return; }
  else if (f === 'bdx') { bdClear(b); tbRefocus(b, R, keepRange); return; }
  else if (f === 'bdset') { tbOpenSettings('cell'); return; }
  if (PG.ts) pgCellClear();
  tblAfter(b, foc || (R.r0 + ',' + R.c0)); schedulePaginate(); TB_LAST = null; setTimeout(tbPlace, 60);
}
function cfKeysOf(b, R) { const G = bdGrid(b), ks = new Set(); for (let i = R.r0; i <= R.r1; i++) for (let j = R.c0; j <= R.c1; j++) if (G.own[i + ',' + j]) ks.add(G.own[i + ',' + j]); return [...ks]; }
function cfApplyKeys(b, keys, slot, col) {
  b.cf = b.cf || {}; keys.forEach(k => { const v = b.cf[k] = b.cf[k] || ['', '']; v[slot] = col || ''; if (!v[0] && !v[1]) delete b.cf[k]; });
  if (!Object.keys(b.cf).length) delete b.cf; rerender(b.id); changed(true);
}
function tbBorder(b, c, scope, none) {
  const keep = PG.ts; const save = BD.st;
  if (c.n <= 1) PG.ts = null; // ช่องเดียว → ใช้ทั้งตาราง (ตามแผงเดิม)
  if (none) BD.st = 'none'; try { bdApplyScope(b, scope); } finally { BD.st = save; PG.ts = keep; }
}
function tbRefocus(b, R, keepRange) {
  setTimeout(() => {
    if (keepRange && PG.ts && PG.ts.id === b.id) { pgPaintCells(); }
    else { const td = $(`.blk[data-id="${b.id}"] td[data-cell="${R.r0},${R.c0}"]`); if (td) { if (curId !== b.id) selectBlock(b.id); placeCaretEnd(td); } }
    TB_LAST = null; tbPlace(); if (curId === b.id) refreshInspector();
  }, 40);
}
function tbOpenSettings(tab) {
  TBT = tab; refreshInspector(); const P = $('#insp'); if (!P) return;
  const side = P.closest('aside,#side,.side') || P; if (typeof side.scrollIntoView === 'function') P.scrollTop = 0;
  P.classList.add('flash'); setTimeout(() => P.classList.remove('flash'), 700);
  if (getComputedStyle(P).display === 'none' || P.offsetWidth < 20) toast('เปิดแผง “รูปแบบ” ด้านขวาเพื่อดูการตั้งค่าตารางทั้งหมด');
}
(function tbInit() {
  const bar = document.createElement('div'); bar.id = 'tbar'; document.body.appendChild(bar);
  window.addEventListener('pointerdown', e => { if (e.target.closest && e.target.closest('#tbar,.tbm')) e.stopPropagation(); }, true);
  bar.addEventListener('mousedown', e => e.preventDefault());
  bar.addEventListener('click', e => { const btn = e.target.closest('button[data-m]'); if (btn) tbMenu(btn, btn.dataset.m); });
  document.addEventListener('mousedown', e => { if (tbMenuEl && !tbMenuEl.contains(e.target) && !e.target.closest('#tbar')) tbMenuClose(); }, true);
  let raf = 0; const upd = () => { if (raf) return; raf = requestAnimationFrame(() => { raf = 0; tbPlace(); if (tbMenuEl && !$('#tbar.on')) tbMenuClose(); }); };
  document.addEventListener('selectionchange', upd); addEventListener('resize', upd); document.addEventListener('scroll', e => { upd(); if (tbMenuEl) tbMenuClose(); }, true);
  document.addEventListener('pointerup', () => setTimeout(upd, 30)); document.addEventListener('keyup', upd);
  addEventListener('keydown', e => { if (e.key === 'Escape' && tbMenuEl) { tbMenuClose(); e.stopPropagation(); } }, true);
  const _pc = pgPaintCells; pgPaintCells = function () { const r = _pc.apply(this, arguments); TB_LAST = null; upd(); return r; };
})();
// ปุ่มย่อบนกล่องตาราง (+แ +ค −แ ↧แ ✕แ) ไม่ต้องใช้แล้ว — ใช้แถบลอยแทน
(function () { const _tb = toolButtons; toolButtons = function (b) { if (b.t !== 'table') return _tb.apply(this, arguments); return _tb({ ...b, t: '__tbl' }); }; })();

/* ---------- แผงด้านขวาสำหรับตาราง: แบ่งเป็นแท็บ ---------- */
let TBT = null, TBA = null, TB_IT = 0; // แท็บที่ผู้ใช้เลือกล่าสุด / แท็บที่แสดงล่าสุด / เวลาที่แตะแผงล่าสุด
document.addEventListener('pointerdown', e => { if (e.target.closest && e.target.closest('#insp')) TB_IT = Date.now(); }, true);
(function () {
  const _ri = refreshInspector;
  refreshInspector = function () {
    const r = _ri.apply(this, arguments);
    try { const b = curId && byId(curId); if (b && b.t === 'table' && selIds().length <= 1) tbTabify(); } catch (e) { console.warn('tabify', e); }
    return r;
  };
})();
function tbTabify() {
  const P = $('#insp'); if (!P || P.querySelector('.itabs')) return;
  const kids = [...P.children]; const head = kids[0] && kids[0].tagName === 'H4' ? kids.shift() : null;
  const T = el => (el.innerText || el.textContent || '').replace(/\s+/g, ' ').trim();
  const CELL = ['รวมช่อง', 'จัดข้อความในช่อง', 'แถวที่เคอร์เซอร์อยู่'], MORE = ['สีหลักของส่วนนี้', 'สีพื้นอ่อน', 'ใช้สีตามโทนเอกสาร', 'อยากเปลี่ยนทั้งเล่ม', 'ขึ้นหน้าใหม่ก่อนส่วนนี้', 'เว้นที่ว่างด้านบน'];
  const groups = { cell: [], table: [], more: [] }; let sec = null;
  kids.forEach(el => {
    const t = T(el);
    if (/^ปุ่มบนตาราง/.test(t)) { el.remove(); return; }
    if (el.classList.contains('sec')) sec = /^(เส้นขอบ|สีในตาราง)/.test(t) ? 'cell' : 'more';
    let g = sec || 'table';
    if (!sec) { if (CELL.some(k => t.startsWith(k))) g = 'cell'; else if (MORE.some(k => t.startsWith(k))) g = 'more'; }
    groups[g].push(el);
  });
  const inCell = !!tbCtx(); const def = TBA = TBT || (Date.now() - TB_IT < 4000 && TBA) || (inCell ? 'cell' : 'table');
  const tabs = document.createElement('div'); tabs.className = 'itabs';
  const L = { cell: 'ช่อง/แถว', table: 'ขนาดตาราง', more: 'กล่อง/อื่น ๆ' };
  tabs.innerHTML = Object.keys(L).map(k => `<button data-it="${k}" class="${k === def ? 'on' : ''}">${L[k]}</button>`).join('');
  const frag = document.createDocumentFragment(); if (head) frag.appendChild(head); frag.appendChild(tabs);
  Object.keys(groups).forEach(k => { const p = document.createElement('div'); p.className = 'ipane' + (k === def ? ' on' : ''); p.dataset.ip = k;
    if (k === 'cell') p.insertAdjacentHTML('beforeend', `<p class="hint" style="margin:0 0 8px">ใช้แถบเครื่องมือเหนือตารางเพื่อแทรก/ลบแถว คอลัมน์ ผสานช่อง และสีพื้นได้เร็วขึ้น</p>`);
    groups[k].forEach(el => p.appendChild(el)); frag.appendChild(p); });
  P.innerHTML = ''; P.appendChild(frag);
  tabs.addEventListener('mousedown', e => e.preventDefault());
  tabs.addEventListener('click', e => { const k = e.target.closest('[data-it]')?.dataset.it; if (!k) return; TBT = k; $$('.itabs button', P).forEach(x => x.classList.toggle('on', x.dataset.it === k)); $$('.ipane', P).forEach(x => x.classList.toggle('on', x.dataset.ip === k)); });
}

/* ===================== ตารางแบบ Pages: สไตล์สำเร็จรูป · หัวแถว/หัวคอลัมน์/แถวท้าย/แถวสลับสี · จัดข้อความรายช่อง · เลือกเส้นขอบบนตาราง ===================== */
const TS_LIST = [['solid', 'หัวทึบ'], ['soft', 'หัวสีอ่อน'], ['line', 'เส้นแนวนอน'], ['plain', 'เส้นดำ'], ['gray', 'เทา'], ['none', 'ไม่มีเส้น']];
const TS_NONE = [0, 'none', '#000000'];
function tsMain(b) { return cpNorm((b.tst && b.tst.c) || getComputedStyle(document.body).getPropertyValue('--brown')) || '#7a3e10'; }
function tsCell(b, i, j, M) { // รูปแบบของช่อง (i,j) ตามสไตล์ตาราง
  const T = b.tst; if (!T || !T.k) return null;
  const R = (b.rows || []).length, hr = T.hr ?? 1, hc = T.hc || 0, fr = T.fr || 0;
  const isH = i < hr, isF = !isH && i >= R - fr, isC = !isH && !isF && j < hc, body = !isH && !isF && !isC;
  const tint = cpMix(M, '#ffffff', .86), line = cpMix(M, '#ffffff', .55), dark = cpMix(M, '#000000', .3), o = {};
  const grid = (c, pt = 0.5) => { o.t = o.b = o.l = o.r = [pt, 'solid', c]; };
  let band = T.bc || cpMix(M, '#ffffff', .93);
  if (T.k === 'solid') { grid(line); if (isH) { o.fill = M; o.fg = '#ffffff'; o.bold = 1; grid(M); } else if (isC || isF) { o.fill = tint; o.fg = dark; o.bold = 1; } }
  else if (T.k === 'soft') { grid(line); if (!body) { o.fill = tint; o.fg = dark; o.bold = 1; } }
  else if (T.k === 'line') { o.l = o.r = TS_NONE; o.t = o.b = [0.5, 'solid', line]; if (i === 0) o.t = TS_NONE; if (isH) { o.bold = 1; o.fg = dark; if (i === hr - 1) o.b = [1.5, 'solid', M]; } if (isC) o.bold = 1; if (isF) { o.bold = 1; if (i === R - fr) o.t = [1, 'solid', M]; } if (i === R - 1) o.b = [1, 'solid', M]; }
  else if (T.k === 'plain') { grid('#000000'); if (!body) o.bold = 1; }
  else if (T.k === 'gray') { grid('#bfbfbf'); if (isH) { o.fill = '#d9d9d9'; o.bold = 1; } else if (!body) { o.fill = '#efefef'; o.bold = 1; } if (!T.bc) band = '#f5f5f5'; }
  else if (T.k === 'none') { o.t = o.b = o.l = o.r = TS_NONE; if (isH) { o.bold = 1; if (i === hr - 1) o.b = [1, 'solid', M]; } else if (!body) o.bold = 1; }
  if (T.band && body && (i - hr) % 2 === 1) o.fill = band;
  return o;
}
const TA_H = { l: 'left', c: 'center', r: 'right' }, TA_V = { t: 'top', m: 'middle', b: 'bottom' };
(function () {
  const _bt = buildTable;
  buildTable = function (el, b) {
    const r = _bt.apply(this, arguments); if ((!b.tst || !b.tst.k) && !b.ca) return r; if (b.nob) return r;
    const M = tsMain(b);
    $$('td[data-cell]', el).forEach(td => {
      const k = td.dataset.cell, [i, j] = k.split(',').map(Number), o = tsCell(b, i, j, M), cf = b.cf && b.cf[k], bd = b.bd && b.bd[k], ca = b.ca && b.ca[k];
      if (o) {
        if (!(cf && cf[0])) td.style.background = o.fill || 'none';
        if (!(cf && cf[1])) td.style.color = o.fg || 'inherit';
        td.style.fontWeight = o.bold ? '700' : '400';
        [['t', 'borderTop'], ['b', 'borderBottom'], ['l', 'borderLeft'], ['r', 'borderRight']].forEach(([s, p]) => { if (o[s] && !(bd && bd[s])) td.style[p] = bdCss(o[s]); });
      }
      if (ca) { if (ca[0]) td.style.textAlign = TA_H[ca[0]]; if (ca[1]) td.style.verticalAlign = TA_V[ca[1]]; }
    });
    return r;
  };
})();
/* ---------- Word ---------- */
function tblWordCell(b, i, j, k, o, base, C) {
  const out = { opt: {}, base, jc: null };
  const M = cpNorm((b.tst && b.tst.c) || ('#' + C('brown'))) || '#7a3e10', ts = b.nob ? null : tsCell(b, i, j, M), bd = b.bd && b.bd[k], cf = b.cf && b.cf[k], ca = b.ca && b.ca[k];
  const hx = c => String(c || '#000000').replace('#', '').toUpperCase();
  if (ts || bd) {
    const W = { solid: 'single', dashed: 'dashed', dotted: 'dotted', double: 'double', none: 'nil' };
    const def = side => b.nob ? `<w:${side} w:val="nil"/>` : `<w:${side} w:val="single" w:sz="4" w:color="${o.bc || 'CDB9AD'}"/>`;
    const one = (side, v) => !v ? def(side) : v[1] === 'none' ? `<w:${side} w:val="nil"/>` : `<w:${side} w:val="${W[v[1]] || 'single'}" w:sz="${Math.max(2, Math.round(v[0] * 8))}" w:color="${hx(v[2])}"/>`;
    const pick = s => (bd && bd[s]) || (ts && ts[s]);
    out.opt.border = one('top', pick('t')) + one('left', pick('l')) + one('bottom', pick('b')) + one('right', pick('r'));
  }
  if (ts) { out.opt.fill = ts.fill ? hx(ts.fill) : undefined; const nb = Object.assign({}, base); if (ts.bold) nb.b = true; else delete nb.b; if (ts.fg) nb.color = hx(ts.fg); else delete nb.color; out.base = nb; }
  if (cf && cf[0]) out.opt.fill = hx(cf[0]);
  if (cf && cf[1]) out.base = Object.assign({}, out.base, { color: hx(cf[1]) });
  if (ca) { if (ca[0]) out.jc = TA_H[ca[0]]; if (ca[1]) out.opt.vAlign = { t: 'top', m: 'center', b: 'bottom' }[ca[1]]; }
  return out;
}
/* ---------- คำสั่ง ---------- */
function txDone(b, keepInsp) {
  rerender(b.id); changed(true); schedulePaginate();
  setTimeout(() => { if (PG.ts && PG.ts.id === b.id) pgPaintCells(); if (!keepInsp && curId === b.id) refreshInspector(); if (typeof TB_LAST !== 'undefined') { TB_LAST = null; tbPlace(); } }, 30);
}
function tsApply(b, k) {
  if (!k) { delete b.tst; b.rs = { 0: 'L' }; txDone(b); return; }
  tPrep(b); Object.keys(b.rs).forEach(i => { if (b.rs[i] === 'H' || b.rs[i] === 'L') delete b.rs[i]; });
  b.tst = Object.assign({ hr: 1, hc: 0, fr: 0 }, b.tst, { k }); delete b.bd; if (b.cf) { Object.keys(b.cf).forEach(x => { b.cf[x][0] = ''; if (!b.cf[x][1]) delete b.cf[x]; }); if (!Object.keys(b.cf).length) delete b.cf; }
  delete b.nob; txDone(b);
}
function tsSet(b, key, v) { if (!b.tst || !b.tst.k) { tPrep(b); Object.keys(b.rs).forEach(i => { if (b.rs[i] === 'H' || b.rs[i] === 'L') delete b.rs[i]; }); b.tst = { k: 'soft', hr: 1, hc: 0, fr: 0 }; } if (v === '' || v === undefined) delete b.tst[key]; else b.tst[key] = v; txDone(b); }
function taApply(b, slot, v) { const T = cfTarget(b); b.ca = b.ca || {}; T.keys.forEach(k => { const a = b.ca[k] = b.ca[k] || ['', '']; a[slot] = a[slot] === v ? '' : v; if (!a[0] && !a[1]) delete b.ca[k]; }); if (!Object.keys(b.ca).length) delete b.ca; txDone(b); }
function tsThumb(k, M) {
  const b = { rows: [[], [], [], []], tst: { k, hr: 1, hc: 0, fr: 0, band: k === 'solid' || k === 'gray' } }; let s = '';
  for (let i = 0; i < 4; i++) for (let j = 0; j < 3; j++) { const o = tsCell(b, i, j, M), x = 2 + j * 20, y = 2 + i * 10; s += `<rect x="${x}" y="${y}" width="20" height="10" fill="${o.fill || '#fff'}"/>`;
    const ln = (v, x1, y1, x2, y2) => v && v[1] !== 'none' ? `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${v[2]}" stroke-width="${Math.max(.6, v[0])}"/>` : '';
    s += ln(o.t, x, y, x + 20, y) + ln(o.b, x, y + 10, x + 20, y + 10) + ln(o.l, x, y, x, y + 10) + ln(o.r, x + 20, y, x + 20, y + 10) + `<line x1="${x + 5}" y1="${y + 5}" x2="${x + 15}" y2="${y + 5}" stroke="${o.fg || '#999'}" stroke-width="${o.bold ? 1.8 : 1}" stroke-linecap="round"/>`; }
  return `<svg viewBox="0 0 64 44" width="64" height="44">${s}</svg>`;
}
/* ---------- แผง "ตาราง" และ "ช่อง" ---------- */
const well = (k, c, title) => `<button class="well${c ? '' : ' none'}" data-well="${k}" style="--c:${c || 'transparent'}" title="${title || ''}"></button>`;
const stepper = (k, v, title) => `<span class="stp" title="${title || ''}"><button data-stp="${k}" data-d="-1">−</button><b>${v}</b><button data-stp="${k}" data-d="1">+</button></span>`;
const SEGI = { l: '<path d="M3 5h14M3 9h9M3 13h14M3 17h9"/>', c: '<path d="M3 5h14M6 9h8M3 13h14M6 17h8"/>', r: '<path d="M3 5h14M8 9h9M3 13h14M8 17h9"/>', t: '<path d="M3 4h14M10 17V8M6.5 11.5 10 8l3.5 3.5"/>', m: '<path d="M3 10h14M10 3v4M8 5l2 2 2-2M10 17v-4M8 15l2-2 2 2"/>', b: '<path d="M3 16h14M10 3v9M6.5 8.5 10 12l3.5-3.5"/>' };
const segI = k => `<svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">${SEGI[k]}</svg>`;
function tblPaneTable(b) {
  const T = b.tst || {}, M = tsMain(b), hr = T.k ? (T.hr ?? 1) : 1;
  return `<div class="tsg">${TS_LIST.map(([k, n]) => `<button data-tsk="${k}" class="${T.k === k ? 'on' : ''}" title="${n}">${tsThumb(k, M)}</button>`).join('')}</div>
<div class="prow"><label>สีหลัก</label>${well('tsc', M, 'สีหลักของตาราง')}<span class="sp"></span><label class="chk"><input type="checkbox" data-tsb="band" ${T.band ? 'checked' : ''}> แถวสลับสี</label>${T.band ? well('tsbc', T.bc || cpMix(M, '#ffffff', .93), 'สีแถวสลับ') : ''}</div>
<div class="prow3"><div><label>หัวแถว</label>${stepper('hr', hr)}</div><div><label>หัวคอลัมน์</label>${stepper('hc', T.hc || 0)}</div><div><label>แถวท้าย</label>${stepper('fr', T.fr || 0)}</div></div>
<div class="prow3"><div><label>แถว</label>${stepper('nr', b.rows.length)}</div><div><label>คอลัมน์</label>${stepper('nc', tNcol(b))}</div><div>${T.k ? '<button class="lnk" data-tsk="">ล้างสไตล์</button>' : ''}</div></div>`;
}
function tblPaneCell(b) {
  const T = cfTarget(b), k0 = T.keys[0], cf = (b.cf || {})[k0] || ['', ''], ca = (b.ca || {})[k0] || ['', ''];
  const seg = (slot, L) => `<span class="seg2">${L.map(v => `<button data-ta="${slot}" data-v="${v}" class="${ca[slot] === v ? 'on' : ''}" title="${{ l: 'ชิดซ้าย', c: 'กึ่งกลาง', r: 'ชิดขวา', t: 'ชิดบน', m: 'กลาง', b: 'ชิดล่าง' }[v]}">${segI(v)}</button>`).join('')}</span>`;
  const ms = PG.ts && PG.ts.id === b.id && PG.ts.n > 1;
  return `<div class="pwhat">${T.what}</div>
<div class="prow"><label>เติมสี</label>${well('cfill', cf[0], 'สีพื้นหลังช่อง')}<span class="sp"></span><label>ตัวอักษร</label>${well('cfg', cf[1], 'สีตัวอักษรในช่อง')}</div>
<div class="prow"><label>จัดแนว</label>${seg(0, ['l', 'c', 'r'])}<span class="sp"></span>${seg(1, ['t', 'm', 'b'])}</div>
<div class="psec">เส้นขอบ</div>
<div class="prow top"><div class="bdg">${BD_KEYS.map(([k, t]) => `<button data-bdk="${k}" title="${t}">${bdIcon(k)}</button>`).join('')}</div>
<div class="pcol"><select data-bdo="st">${BD_ST.map(([v, t]) => `<option value="${v}"${BD.st === v ? ' selected' : ''}>${t}</option>`).join('')}</select>
<div class="prow tight">${stepper('bpt', BD.pt + ' pt', 'ความหนาเส้น')}${well('bdc', BD.c, 'สีเส้น')}</div><button class="lnk" data-bdx="1">ล้างเส้น</button></div></div>
<div class="psec">ผสานช่อง</div>
<div class="prow">${ms ? `<button class="pb" data-tbf="mM">ผสาน ${PG.ts.n} ช่อง</button>` : '<button class="pb" data-tbf="mR">→ ขวา</button><button class="pb" data-tbf="mD">↓ ล่าง</button>'}<button class="pb" data-tbf="mX">แยก</button></div>`;
}
document.addEventListener('mousedown', e => { if (e.target.closest && e.target.closest('[data-tsk],[data-stp],[data-ta],[data-well],[data-tbf],.pb')) e.preventDefault(); }, true);
document.addEventListener('click', e => {
  const t = e.target.closest && e.target.closest('[data-tsk],[data-stp],[data-ta],[data-well],[data-tbf]'); if (!t || t.closest('#egp')) return;
  const b = curId && byId(curId); if (!b || b.t !== 'table') return; const d = t.dataset;
  if (d.tsk !== undefined) { e.stopPropagation(); tsApply(b, d.tsk); return; }
  if (d.ta !== undefined) { e.stopPropagation(); taApply(b, +d.ta, d.v); return; }
  if (d.tbf) { e.stopPropagation(); const c = tbCtx(); if (!c) { toast('คลิกในช่องตารางก่อน'); return; } tbDo(d.tbf); return; }
  if (d.stp) { e.stopPropagation(); const dd = +d.d, k = d.stp;
    if (k === 'bpt') { BD.pt = cpClamp(Math.round((BD.pt + dd * (BD.pt < 1 || (BD.pt === 1 && dd < 0) ? 0.25 : 0.5)) * 100) / 100, 0.25, 6); refreshInspector(); return; }
    if (k === 'nr') { if (dd > 0) tblInsRow(b, b.rows.length); else if (!tblDelRow(b, b.rows.length - 1)) return; if (PG.ts) pgCellClear(); txDone(b); return; }
    if (k === 'nc') { if (dd > 0) tblInsCol(b, tNcol(b)); else if (!tblDelCol(b, tNcol(b) - 1)) return; if (PG.ts) pgCellClear(); txDone(b); return; }
    const cur = b.tst && b.tst.k ? (b.tst[k] ?? (k === 'hr' ? 1 : 0)) : (k === 'hr' ? 1 : 0), max = k === 'hc' ? tNcol(b) - 1 : b.rows.length - 1; tsSet(b, k, cpClamp(cur + dd, 0, Math.min(5, max))); return; }
  if (d.well) { e.stopPropagation(); const k = d.well, cur = cpNorm(t.style.getPropertyValue('--c'));
    cpOpen(t, { value: cur || (k === 'cfg' ? '#000000' : '#fff4c2'), none: k === 'cfill' || k === 'cfg' || k === 'tsc' || k === 'tsbc', noneLabel: k === 'tsc' ? 'ตามโทนเอกสาร' : k === 'tsbc' ? 'สีอัตโนมัติ' : k === 'cfg' ? 'สีเดิม' : 'ไม่เติมสี', onPick: c => {
      if (k === 'cfill') cfApply(b, 0, c); else if (k === 'cfg') cfApply(b, 1, c); else if (k === 'tsc') tsSet(b, 'c', c); else if (k === 'tsbc') tsSet(b, 'bc', c); else if (k === 'bdc') { if (c) BD.c = c; refreshInspector(); } } }); }
}, true);
document.addEventListener('change', e => { const d = e.target.dataset; if (!d || d.tsb === undefined) return; e.stopImmediatePropagation(); const b = curId && byId(curId); if (b && b.t === 'table') tsSet(b, d.tsb, e.target.checked ? true : ''); }, true);

/* ---------- คลิกเส้นขอบบนตาราง เพื่อเลือกและแก้เส้นนั้น ---------- */
const EG = { id: null, list: [], down: null };
(function () {
  const s = document.createElement('style');
  s.textContent = `.tze{background:transparent}.tzeh{height:7px;cursor:pointer}.tzev{width:7px;cursor:pointer}.egsel{position:absolute;z-index:8;background:#0a84ff;border-radius:2px;pointer-events:none;box-shadow:0 0 0 1px #fff}
#egp{position:fixed;z-index:7003;display:none;gap:6px;align-items:center;background:#fff;border:1px solid #d9d9de;border-radius:12px;box-shadow:0 8px 28px rgba(0,0,0,.2);padding:6px 8px;font-family:var(--ui-font);font-size:14px;user-select:none;-webkit-user-select:none}#egp.on{display:flex}
#egp select{height:30px;border:1px solid #d9d9de;border-radius:8px;font:inherit;background:#fff}#egp .x{border:0;background:none;height:30px;padding:0 8px;border-radius:8px;cursor:pointer;font:inherit;color:#c0392b}#egp .x:hover{background:#fdecea}#egp .lb{color:#8e8e93;font-size:12px}`;
  document.head.appendChild(s);
  const _th = tblHandles;
  tblHandles = function (blk) {
    _th(blk); const w = $('.b-table', blk), t = w && $('table', w); if (!t) return;
    const z = TZ(), wr = w.getBoundingClientRect(), tr = t.getBoundingClientRect(), L = (tr.left - wr.left) / z, T = (tr.top - wr.top) / z, H = tr.height / z, W = tr.width / z;
    w.insertAdjacentHTML('beforeend', `<div class="tz tze tzeh" data-eh="0" style="left:${L}px;top:${T - 3}px;width:${W}px" title="คลิกเพื่อเลือกเส้นขอบบน"></div><div class="tz tze tzev" data-ev="0" style="left:${L - 3}px;top:${T}px;height:${H}px" title="คลิกเพื่อเลือกเส้นขอบซ้าย"></div>`);
    $$('.tzc,.tzw,.tzr', w).forEach(h => { if (!/คลิก/.test(h.title)) h.title += ' · คลิกเพื่อเลือกเส้น'; });
    egPaint(blk);
  };
})();
function egGeom(blk) {
  const w = $('.b-table', blk), t = w && $('table', w); if (!t) return null; const z = TZ(), wr = w.getBoundingClientRect(), tr = t.getBoundingClientRect();
  const xs = [(tr.left - wr.left) / z]; tblCols(t).forEach(c => xs.push(xs[xs.length - 1] + c));
  const ys = [(tr.top - wr.top) / z]; const seen = new Set(); Array.from(t.rows).forEach(r => { const c = r.querySelector('td[data-cell]'); if (!c || r.classList.contains('rephd')) return; const i = +c.dataset.cell.split(',')[0]; if (seen.has(i)) return; seen.add(i); ys[i + 1] = (r.getBoundingClientRect().bottom - wr.top) / z; });
  for (let i = 1; i < ys.length; i++) if (ys[i] === undefined) ys[i] = ys[i - 1];
  return { w, xs, ys };
}
function egPaint(blk) {
  $$('.egsel').forEach(x => x.remove()); if (!EG.id || !EG.list.length) return; blk = blk || $(`.blk[data-id="${EG.id}"]`); if (!blk || blk.dataset.id !== EG.id) return;
  const g = egGeom(blk); if (!g) return; const X0 = g.xs[0], X1 = g.xs[g.xs.length - 1], Y0 = g.ys[0], Y1 = g.ys[g.ys.length - 1];
  EG.list.forEach(e => { const d = document.createElement('div'); d.className = 'egsel';
    if (e.kind === 'v') d.style.cssText = `left:${g.xs[e.idx] - 1.5}px;top:${Y0}px;width:3px;height:${Y1 - Y0}px`; else d.style.cssText = `left:${X0}px;top:${g.ys[e.idx] - 1.5}px;height:3px;width:${X1 - X0}px`;
    g.w.appendChild(d); });
}
function egClear() { if (!EG.id) return; EG.id = null; EG.list = []; $$('.egsel').forEach(x => x.remove()); const p = $('#egp'); if (p) p.classList.remove('on'); }
function egPop(x, y) {
  let p = $('#egp'); if (!p) { p = document.createElement('div'); p.id = 'egp'; document.body.appendChild(p);
    p.addEventListener('mousedown', e => { if (e.target.tagName !== 'SELECT') e.preventDefault(); e.stopPropagation(); }); p.addEventListener('pointerdown', e => e.stopPropagation());
    p.addEventListener('change', e => { if (e.target.dataset.eg === 'st') { e.stopPropagation(); BD.st = e.target.value; egApply(); } });
    p.addEventListener('click', e => { const t = e.target.closest('[data-stp],[data-well],[data-eg]'); if (!t) return; e.stopPropagation();
      if (t.dataset.stp) { const dd = +t.dataset.d; BD.pt = cpClamp(Math.round((BD.pt + dd * (BD.pt < 1 || (BD.pt === 1 && dd < 0) ? 0.25 : 0.5)) * 100) / 100, 0.25, 6); if (BD.st === 'none') BD.st = 'solid'; egApply(); }
      else if (t.dataset.well) cpOpen(t, { value: BD.c, onPick: c => { if (c) { BD.c = c; if (BD.st === 'none') BD.st = 'solid'; egApply(); } } });
      else if (t.dataset.eg === 'none') { const s = BD.st; BD.st = 'none'; egApply(); BD.st = s; }
      else if (t.dataset.eg === 'ok') egClear(); }); }
  egPopFill(); p.classList.add('on'); if (x !== undefined) { const t = $(`.blk[data-id="${EG.id}"] .b-table table`), tr = t ? t.getBoundingClientRect() : { top: y, bottom: y }; let top = tr.top - p.offsetHeight - 26; if (top < 70) top = Math.min(innerHeight - p.offsetHeight - 8, tr.bottom + 34); p.style.left = Math.max(8, Math.min(x - p.offsetWidth / 2, innerWidth - p.offsetWidth - 8)) + 'px'; p.style.top = Math.max(8, top) + 'px'; }
}
function egPopFill() { const p = $('#egp'); if (!p) return; p.innerHTML = `<span class="lb">${EG.list.length > 1 ? EG.list.length + ' เส้น' : 'เส้น'}</span><select data-eg="st">${BD_ST.filter(x => x[0] !== 'none').map(([v, t]) => `<option value="${v}"${BD.st === v ? ' selected' : ''}>${t}</option>`).join('')}</select>${stepper('bpt', BD.pt + ' pt', 'ความหนา')}${well('bdc', BD.c, 'สีเส้น')}<button class="x" data-eg="none">ไม่มีเส้น</button>`; }
function egApply() {
  const b = EG.id && byId(EG.id); if (!b) return; const G = bdGrid(b), v = [BD.pt, BD.st, BD.c]; b.bd = b.bd || {};
  const put = (k, s) => { if (k === undefined) return; (b.bd[k] = b.bd[k] || {})[s] = v; };
  EG.list.forEach(e => {
    if (e.kind === 'v') for (let i = 0; i < G.R; i++) { const a = G.own[i + ',' + (e.idx - 1)], c = G.own[i + ',' + e.idx]; if (a !== undefined && a === c) continue; put(a, 'r'); put(c, 'l'); }
    else for (let j = 0; j < G.C; j++) { const a = G.own[(e.idx - 1) + ',' + j], c = G.own[e.idx + ',' + j]; if (a !== undefined && a === c) continue; put(a, 'b'); put(c, 't'); }
  });
  rerender(b.id); changed(true); schedulePaginate(); const blk = $(`.blk[data-id="${b.id}"]`); if (blk) { blk.dataset.tz = '1'; tblHandles(blk); } egPopFill();
}
document.addEventListener('pointerdown', e => { const h = e.target.closest && e.target.closest('#flow .tzc, #flow .tzw, #flow .tzr, #flow .tze'); EG.down = h ? { h, x: e.clientX, y: e.clientY, blk: h.closest('.blk'), shift: e.shiftKey } : null; if (!h && EG.id && !(e.target.closest && e.target.closest('#egp,#cpk'))) egClear(); if (h && h.classList.contains('tze')) { e.preventDefault(); e.stopPropagation(); } }, true);
document.addEventListener('pointerup', e => {
  const d = EG.down; EG.down = null; if (!d || Math.hypot(e.clientX - d.x, e.clientY - d.y) > 3) return;
  const b = byId(d.blk.dataset.id); if (!b || b.t !== 'table') return; const h = d.h, G = bdGrid(b);
  const eg = h.classList.contains('tzc') ? { kind: 'v', idx: +h.dataset.j + 1 } : h.classList.contains('tzw') ? { kind: 'v', idx: G.C } : h.classList.contains('tzr') ? { kind: 'h', idx: +h.dataset.i + 1 } : h.dataset.eh !== undefined ? { kind: 'h', idx: 0 } : { kind: 'v', idx: 0 };
  if (EG.id !== b.id || !d.shift) EG.list = []; EG.id = b.id; const at = EG.list.findIndex(x => x.kind === eg.kind && x.idx === eg.idx); if (at >= 0) EG.list.splice(at, 1); else EG.list.push(eg);
  if (!EG.list.length) { egClear(); return; } if (curId !== b.id) selectBlock(b.id);
  setTimeout(() => { const blk = $(`.blk[data-id="${b.id}"]`); if (blk) { if (!$('.tz', blk)) { blk.dataset.tz = '1'; tblHandles(blk); } else egPaint(blk); } egPop(e.clientX, e.clientY); }, 0);
}, true);
addEventListener('keydown', e => { if (e.key === 'Escape' && EG.id) egClear(); }, true);

