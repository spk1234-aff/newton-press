'use strict';
/* ===================== โหมดฟิสิกส์ (ระยะที่ 1) =====================
   doc.settings.mode = 'math' | 'phys' | 'doc' (ไม่มี = คณิตศาสตร์) · โหมดเปลี่ยนแค่ค่าเริ่มต้น เครื่องมือทุกโหมดใช้ได้เสมอ
   · ปริมาณ+หน่วย  · แถบสัญลักษณ์ฟิสิกส์ · ตารางค่าคงตัว · กล่องฟิสิกส์ · แม่แบบฟิสิกส์ · ข้อสอบ A-Level ฟิสิกส์ */
(function () {
  const MODES = { math: 'คณิตศาสตร์', phys: 'ฟิสิกส์', doc: 'เอกสารราชการ / วิชาการ' };
  const modeOf = () => (doc && doc.settings && doc.settings.mode) || 'math';
  window.npMode = modeOf;

  /* ---------- แทรกสมการ/ข้อความที่ตำแหน่งเคอร์เซอร์ ---------- */
  function edOf(r) { return r && (r.startContainer.nodeType === 1 ? r.startContainer : r.startContainer.parentElement).closest('[contenteditable="true"]'); }
  function insTeX(tex) {
    const r = lastRange, ed = edOf(r); if (!ed) { toast('คลิกตำแหน่งในข้อความก่อน'); return; }
    const sp = mkMath(tex); r.deleteContents(); r.insertNode(document.createTextNode(' ')); r.insertNode(sp); renderMath(ed); syncFrom(ed);
    const nr = document.createRange(); nr.setStartAfter(sp.nextSibling || sp); nr.collapse(true); ed.focus({ preventScroll: true }); const s = getSelection(); s.removeAllRanges(); s.addRange(nr); lastRange = nr.cloneRange();
  }
  window.npInsTeX = insTeX;

  /* ---------- ปริมาณและหน่วย ---------- */
  const UNIT_MAP = { 'Ω': '\\Omega', 'ohm': '\\Omega', '°': '^{\\circ}', 'deg': '^{\\circ}', 'μ': '\\mu', 'u': 'u' };
  function unitTeX(u) {
    u = String(u || '').trim(); if (!u) return '';
    if (/^(°C|°|deg|degC)$/.test(u)) return u.includes('C') ? '^{\\circ}\\mathrm{C}' : '^{\\circ}';
    let t = u.replace(/\s*[·*]\s*|\s+/g, '\\cdot ').replace(/\^\(?(-?\d+(?:\.\d+)?)\)?/g, '^{$1}').replace(/Ω|ohm/g, '\\Omega ').replace(/μ/g, '\\mu ').replace(/°/g, '^{\\circ}');
    return `\\mathrm{${t}}`;
  }
  function numTeX(n) {
    const m = /^\s*([-+−]?\d*[.,]?\d+)\s*(?:(?:e|E|×\s*10\^?|x\s*10\^?|\*10\^?)\s*([-+−]?\d+))?\s*$/.exec(n); if (!m) return null;
    const a = m[1].replace('−', '-').replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1{,}'); return m[2] !== undefined ? `${a}\\times10^{${m[2].replace('−', '-')}}` : a;
  }
  window.qtyTeX = function (s) {
    s = String(s || '').trim(); const m = /^([-+−]?[\d.,]+(?:\s*(?:e|E|×\s*10\^?|x\s*10\^?|\*10\^?)\s*[-+−]?\d+)?)\s*(.*)$/.exec(s); if (!m) return null;
    const n = numTeX(m[1]); if (n === null) return null; const u = unitTeX(m[2]); return u ? (u.startsWith('^') ? n + u : `${n}\\,${u}`) : n;
  };
  function qtyDialog() {
    $$('#dQty').forEach(x => x.remove());
    const d = document.createElement('div'); d.className = 'dlg-back open'; d.id = 'dQty';
    d.innerHTML = `<div class="dlg" style="width:520px"><h3 style="margin:0 0 8px">ปริมาณและหน่วย</h3>
<input id="qtyIn" type="text" style="width:100%;font-size:20px;padding:6px 10px;box-sizing:border-box" placeholder="เช่น 9.8 m/s^2 · 6.02e23 · 3 kΩ · 25 °C">
<div id="qtyPv" style="font-size:24px;min-height:44px;margin:12px 0;text-align:center"></div>
<div class="hint" style="font-size:14px">ยกกำลังพิมพ์ ^ (m/s^2) · คูณหน่วยเว้นวรรคหรือ · (N·m) · 10 ยกกำลังพิมพ์ e (6.02e23) · คำนำหน้า k M m μ n ใช้ได้ทันที</div>
<div style="display:flex;justify-content:flex-end;gap:8px;margin-top:10px"><button class="tb" data-q="x">ยกเลิก</button><button class="tb primary" data-q="ok">แทรก</button></div></div>`;
    document.body.appendChild(d); const inp = $('#qtyIn', d), pv = $('#qtyPv', d); inp.focus();
    const upd = () => { const t = qtyTeX(inp.value); pv.innerHTML = t ? kx(t) : (inp.value ? '<span style="color:#b03a2e;font-size:15px">พิมพ์ตัวเลขก่อน แล้วตามด้วยหน่วย</span>' : ''); };
    const ok = () => { const t = qtyTeX(inp.value); if (!t) return; d.remove(); insTeX(t); };
    inp.oninput = upd; inp.onkeydown = e => { if (e.key === 'Enter') ok(); if (e.key === 'Escape') d.remove(); };
    d.onclick = e => { const b = e.target.closest('[data-q]'); if (e.target === d || (b && b.dataset.q === 'x')) d.remove(); else if (b) ok(); };
  }
  window.openQty = qtyDialog;

  /* ---------- แถบสัญลักษณ์ฟิสิกส์ ---------- */
  const SYM = [['Δ', '\\Delta'], ['ω', '\\omega'], ['λ', '\\lambda'], ['θ', '\\theta'], ['φ', '\\varphi'], ['ρ', '\\rho'], ['μ₀', '\\mu_{0}'], ['ε₀', '\\varepsilon_{0}'], ['Ω', '\\Omega'], ['°', '^{\\circ}'], ['⊗', '\\otimes'], ['⊙', '\\odot'], ['∝', '\\propto'], ['≈', '\\approx'], ['±', '\\pm']];
  const UNITS = ['N', 'J', 'W', 'Pa', 'C', 'V', 'A', 'Ω', 'T', 'Hz', 'eV', 'm/s', 'm/s^2', 'kg'];
  const st = document.createElement('style');
  st.textContent = `#physBar{position:fixed;left:50%;transform:translateX(-50%);bottom:14px;z-index:60;display:none;gap:3px;align-items:center;flex-wrap:nowrap;overflow-x:auto;max-width:min(94vw,860px);background:#fff;border:1px solid var(--ui-line,#e3d6c8);border-radius:14px;padding:4px 6px;box-shadow:0 6px 24px rgba(60,30,10,.16)}
body.physmode #physBar{display:flex}body.exporting #physBar{display:none!important}
#physBar button{flex:0 0 auto;font:inherit;font-size:15px;min-width:28px;height:28px;padding:0 5px;border:1px solid #eadfd4;background:#fff;border-radius:8px;cursor:pointer}#physBar button:hover{background:#fdf0e3}
#physBar .sep{width:1px;height:24px;background:#e6dcd2;margin:0 3px}#physBar .pb-main{background:var(--ui-accent,#7a3608);color:#fff;border-color:transparent}#physBar .pb-x{border:0;color:#999}
.b-box.k-pext .bt::after{content:" (เกินหลักสูตร อ่านเพิ่มเติม)";font-weight:400;font-size:.85em;opacity:.75}
.b-box .pcmp{display:grid;grid-template-columns:1fr 1fr;gap:0;border:1px solid var(--sep,#ddd);border-radius:6px;overflow:hidden;margin-top:4px}.b-box .pcmp>div{padding:4px 8px;min-height:2em}.b-box .pcmp>div:nth-child(odd){border-right:1px solid var(--sep,#ddd)}.b-box .pcmp>div:nth-child(-n+2){font-weight:700;background:color-mix(in srgb,var(--brown) 8%,#fff)}
.pblank{display:inline-block;min-width:8em;border-bottom:1.3px dotted #888;height:1.1em;vertical-align:-.15em}`;
  document.head.appendChild(st);
  const bar = document.createElement('div'); bar.id = 'physBar';
  bar.innerHTML = `<button class="pb-main" data-pb="qty" title="ปริมาณและหน่วย">9.8 m/s²</button><button data-pb="vec" title="เวกเตอร์ (ลูกศรบนหัว)">${kx("\\vec{F}")}</button><button data-pb="const" title="ตารางค่าคงตัว">ค่าคงตัว</button><span class="sep"></span>${SYM.map(([s, t]) => `<button data-tex="${esc(t)}">${s}</button>`).join('')}<span class="sep"></span>${UNITS.map(u => `<button data-unit="${esc(u)}" style="font-size:14px">${u.replace('^2', '²')}</button>`).join('')}<button class="pb-x" data-pb="hide" title="ซ่อนแถบ (เปิดใหม่ในตั้งค่า)">✕</button>`;
  document.body.appendChild(bar);
  bar.addEventListener('mousedown', e => e.preventDefault());
  bar.onclick = e => {
    const b = e.target.closest('button'); if (!b) return;
    if (b.dataset.tex) insTeX(b.dataset.tex);
    else if (b.dataset.unit) insTeX(unitTeX(b.dataset.unit));
    else if (b.dataset.pb === 'qty') qtyDialog();
    else if (b.dataset.pb === 'const') openConsts();
    else if (b.dataset.pb === 'vec') { const v = prompt('ชื่อเวกเตอร์ เช่น F, v, a, E', 'F'); if (v) insTeX(`\\vec{${v.trim()}}`); }
    else if (b.dataset.pb === 'hide') { doc.settings.physbar = 'off'; applySettings(); changed(true); }
  };

  /* ---------- ตารางค่าคงตัว ---------- */
  const CONSTS = [
    ['g', 'ความเร่งโน้มถ่วงของโลก', 'g', '9.8\\,\\mathrm{m/s^{2}}'], ['c', 'อัตราเร็วแสงในสุญญากาศ', 'c', '3.0\\times10^{8}\\,\\mathrm{m/s}'], ['e', 'ประจุไฟฟ้าของอิเล็กตรอน (ขนาด)', 'e', '1.6\\times10^{-19}\\,\\mathrm{C}'],
    ['me', 'มวลของอิเล็กตรอน', 'm_{e}', '9.1\\times10^{-31}\\,\\mathrm{kg}'], ['h', 'ค่าคงตัวของพลังค์', 'h', '6.6\\times10^{-34}\\,\\mathrm{J\\cdot s}'], ['k', 'ค่าคงตัวคูลอมบ์', 'k', '9.0\\times10^{9}\\,\\mathrm{N\\cdot m^{2}/C^{2}}'],
    ['G', 'ค่าคงตัวความโน้มถ่วงสากล', 'G', '6.67\\times10^{-11}\\,\\mathrm{N\\cdot m^{2}/kg^{2}}'], ['mu0', 'สภาพให้ซึมผ่านได้ของสุญญากาศ', '\\mu_{0}', '4\\pi\\times10^{-7}\\,\\mathrm{T\\cdot m/A}'], ['eps0', 'สภาพยอมของสุญญากาศ', '\\varepsilon_{0}', '8.85\\times10^{-12}\\,\\mathrm{C^{2}/N\\cdot m^{2}}'],
    ['NA', 'เลขอาโวกาโดร', 'N_{A}', '6.02\\times10^{23}\\,\\mathrm{mol^{-1}}'], ['R', 'ค่าคงตัวของแก๊ส', 'R', '8.31\\,\\mathrm{J/(mol\\cdot K)}']];
  const ANG = [[30, '\\tfrac{1}{2}', '\\tfrac{\\sqrt3}{2}', '\\tfrac{1}{\\sqrt3}'], [37, '0.6', '0.8', '0.75'], [45, '\\tfrac{\\sqrt2}{2}', '\\tfrac{\\sqrt2}{2}', '1'], [53, '0.8', '0.6', '\\tfrac{4}{3}'], [60, '\\tfrac{\\sqrt3}{2}', '\\tfrac{1}{2}', '\\sqrt3']];
  const M = t => `<span class="mx" contenteditable="false" data-tex="${esc(t)}"></span>`;
  window.npConstBlocks = function (keys, angs, asLine) {
    const C = CONSTS.filter(c => keys.includes(c[0])), A = ANG.filter(a => angs.includes(a[0])); const out = [];
    if (asLine) { const parts = C.map(c => M(`${c[2]}=${c[3]}`)).concat(A.map(a => M(`\\sin${a[0]}^{\\circ}=${a[1]},\\ \\cos${a[0]}^{\\circ}=${a[2]}`))); if (parts.length) out.push(newBlock('para', { html: '<b>กำหนดให้</b> ' + parts.join(' , ') })); return out; }
    if (C.length) out.push(newBlock('table', { rows: [['ปริมาณ', 'สัญลักษณ์', 'ค่า']].concat(C.map(c => [c[1], M(c[2]), M(c[3])])), full: true, cw: [46, 16, 38], tst: { k: 'soft', hr: 1 } }));
    if (A.length) out.push(newBlock('table', { rows: [['มุม', 'sin', 'cos', 'tan']].concat(A.map(a => [M(a[0] + '^{\\circ}'), M(a[1]), M(a[2]), M(a[3])])), full: true, tst: { k: 'soft', hr: 1 } }));
    return out;
  };
  function openConsts() {
    $$('#dConst').forEach(x => x.remove());
    const d = document.createElement('div'); d.className = 'dlg-back open'; d.id = 'dConst';
    d.innerHTML = `<div class="dlg" style="width:640px"><h3 style="margin:0 0 8px">ตารางค่าคงตัว</h3>
<div style="display:grid;grid-template-columns:1fr 1fr;gap:4px 14px;font-size:16px">${CONSTS.map(c => `<label><input type="checkbox" data-c="${c[0]}" checked> ${kx(c[2])} ${c[1]}</label>`).join('')}</div>
<div style="margin:10px 0 4px;font-weight:700">ค่าตรีโกณมิติ</div><div style="display:flex;gap:14px;font-size:16px">${ANG.map(a => `<label><input type="checkbox" data-a="${a[0]}" ${a[0] === 37 || a[0] === 53 ? 'checked' : ''}> ${a[0]}°</label>`).join('')}</div>
<div style="margin-top:12px;display:flex;gap:16px;font-size:16px"><label><input type="radio" name="cAs" value="t" checked> แทรกเป็นตาราง</label><label><input type="radio" name="cAs" value="l"> แทรกเป็นบรรทัด “กำหนดให้ …” ในโจทย์</label></div>
<div style="display:flex;justify-content:flex-end;gap:8px;margin-top:12px"><button class="tb" data-k="x">ยกเลิก</button><button class="tb primary" data-k="ok">แทรก</button></div></div>`;
    document.body.appendChild(d);
    d.onclick = e => { const b = e.target.closest('[data-k]'); if (e.target === d || (b && b.dataset.k === 'x')) return d.remove(); if (!b) return;
      const keys = $$('[data-c]:checked', d).map(x => x.dataset.c), angs = $$('[data-a]:checked', d).map(x => +x.dataset.a), line = ($('input[name=cAs]:checked', d) || {}).value === 'l';
      d.remove(); const bl = npConstBlocks(keys, angs, line); if (bl.length) insertBlocks(bl); };
  }
  window.openConsts = openConsts;

  /* ---------- กล่องฟิสิกส์ ---------- */
  Object.assign(BOXES, { plaw: 'นิยาม / กฎ', peq: 'สมการสำคัญ', pproof: 'การพิสูจน์สมการ', pext: 'ความรู้เสริม', pmis: 'ความเข้าใจผิดที่พบบ่อย', pcmp: 'เปรียบเทียบสถานการณ์', punit: 'ระวังหน่วย / ตัวเลขนัยสำคัญ' });
  Object.assign(BOXCOL, { plaw: '#7F9CCF', peq: '#E0B060', pproof: '#B8B8B8', pext: '#86CCBE', pmis: '#E3A3A3', pcmp: '#A8B8C4', punit: '#EFA98A' });
  const R = ':root.bxth #flow ', MX = p => `color-mix(in srgb,var(--brown) ${p}%,#fff)`;
  const s2 = document.createElement('style');
  s2.textContent = `${R}.b-box.k-plaw{background:${MX(7)};border:1.3px solid var(--dark);border-radius:7px}${R}.b-box.k-plaw .bt{color:#fff;background:var(--dark);margin:-4px -12px 5px;padding:2px 12px;border-radius:5px 5px 0 0}
${R}.b-box.k-peq{background:${MX(5)};border:1.2px solid var(--brown);border-left:5px solid var(--brown);border-radius:4px}${R}.b-box.k-peq .bt{color:var(--brown)}
${R}.b-box.k-pproof{background:transparent;border:0;border-left:3px solid ${MX(55)};border-radius:0}${R}.b-box.k-pproof .bt{color:var(--brown)}
${R}.b-box:is(.k-pext,.k-pcmp){background:${MX(3)};border:1.3px dashed ${MX(65)};border-radius:10px}${R}.b-box:is(.k-pext,.k-pcmp) .bt{color:var(--dark)}
${R}.b-box:is(.k-pmis,.k-punit){background:#fff;border:1px solid ${MX(40)};border-left:4px solid #c0392b}${R}.b-box:is(.k-pmis,.k-punit) .bt{color:#a33424}`;
  document.head.appendChild(s2);
  const _nb = extNewBlock; extNewBlock = function (b) { _nb(b); if (b.t === 'box' && b.kind === 'pcmp' && !b.html) b.html = '<div class="pcmp"><div>สถานการณ์ ก</div><div>สถานการณ์ ข</div><div>...</div><div>...</div></div>'; };
  // ฉบับให้นักเรียนเติม: คัดลอกกล่องพิสูจน์ แล้วเปลี่ยนบรรทัดที่เลือกเป็นช่องว่าง
  window.npProofBlank = function (id) {
    const b = byId(id); if (!b) return; const lines = String(b.html || '').split(/<br\s*\/?>/i);
    $$('#dPB').forEach(x => x.remove()); const d = document.createElement('div'); d.className = 'dlg-back open'; d.id = 'dPB';
    d.innerHTML = `<div class="dlg" style="width:640px"><h3 style="margin:0 0 6px">สร้างฉบับให้นักเรียนเติม</h3><div class="hint" style="margin-bottom:8px">ติ๊กขั้นที่ต้องการเว้นให้นักเรียนเติม</div><div id="pbL" style="max-height:52vh;overflow:auto">${lines.map((l, i) => `<label style="display:flex;gap:8px;align-items:flex-start;padding:5px 2px;border-bottom:1px dashed #eee"><input type="checkbox" data-i="${i}" ${i && i % 2 === 0 ? 'checked' : ''}><span class="pbx">${l || '&nbsp;'}</span></label>`).join('')}</div><div style="display:flex;justify-content:flex-end;gap:8px;margin-top:10px"><button class="tb" data-k="x">ยกเลิก</button><button class="tb primary" data-k="ok">สร้างกล่องใหม่ต่อท้าย</button></div></div>`;
    document.body.appendChild(d); renderMath(d);
    d.onclick = e => { const k = e.target.closest('[data-k]'); if (e.target === d || (k && k.dataset.k === 'x')) return d.remove(); if (!k) return;
      const pick = new Set($$('#pbL [data-i]:checked', d).map(x => +x.dataset.i)); d.remove();
      const nb = newBlock('box', { kind: b.kind, title: (b.title || BOXES[b.kind]) + ' (ฉบับเติม)', html: lines.map((l, i) => pick.has(i) ? '<span class="pblank"></span>' : l).join('<br>') });
      const at = doc.blocks.indexOf(b); doc.blocks.splice(at + 1, 0, nb); renderAll(); changed(true); };
  };
  const _ei = extInspector; extInspector = function (b) { let h = _ei(b); if (b.t === 'box' && b.kind === 'pproof') h += `<div class="ir"><button class="tb" onclick="npProofBlank('${b.id}')">สร้างฉบับให้นักเรียนเติม…</button></div>`; return h; };

  /* ---------- โหมด: ตั้งค่า · เอกสารใหม่ · ผลต่อค่าเริ่มต้น ---------- */
  const _as = applySettings;
  applySettings = function () { const r = _as.apply(this, arguments); document.body.classList.toggle('physmode', modeOf() === 'phys' && doc.settings.physbar !== 'off'); return r; };
  const _os = openSettings;
  openSettings = function () {
    const r = _os.apply(this, arguments); const box = $('#sThemes'); if (!box) return r;
    let w = $('#sMode');
    if (!w) { w = document.createElement('div'); w.id = 'sMode'; w.style.cssText = 'display:flex;gap:8px;align-items:center;margin:4px 0 10px;flex-wrap:wrap'; w.innerHTML = `<b>โหมดเอกสาร</b><select>${Object.entries(MODES).map(([k, v]) => `<option value="${k}">${v}</option>`).join('')}</select><label style="display:flex;gap:4px;align-items:center"><input type="checkbox" data-pbar> แสดงแถบสัญลักษณ์ฟิสิกส์</label>`;
      box.parentNode.insertBefore(w, box);
      $('select', w).onchange = e => { doc.settings.mode = e.target.value === 'math' ? undefined : e.target.value; applySettings(); changed(true); };
      $('[data-pbar]', w).onchange = e => { doc.settings.physbar = e.target.checked ? undefined : 'off'; applySettings(); changed(true); }; }
    $('select', w).value = modeOf(); $('[data-pbar]', w).checked = doc.settings.physbar !== 'off'; return r;
  };
  // เอกสารใหม่: เลือกโหมดก่อนเลือกแม่แบบ
  let pend = null;
  const _ot = openTemplates;
  openTemplates = function () {
    const r = _ot.apply(this, arguments); const list = $('#tplList'); if (!list) return r;
    let m = $('#tplMode'); if (!m) { m = document.createElement('div'); m.id = 'tplMode'; m.style.cssText = 'display:flex;gap:6px;align-items:center;margin:0 0 10px;flex-wrap:wrap;font-size:16px'; list.parentNode.insertBefore(m, list); }
    pend = pend || modeOf();
    const draw = () => { m.innerHTML = '<b>โหมด</b> ' + Object.entries(MODES).map(([k, v]) => `<button class="tb${pend === k ? ' primary' : ''}" data-md="${k}">${v}</button>`).join(''); const g = $$('#tplList .tplg'); const first = { phys: 'ฟิสิกส์', doc: 'งานเอกสาร', math: '' }[pend]; g.forEach(x => { const h = (x.querySelector('.tplgh b') || {}).textContent || ''; x.style.order = first && h.includes(first) ? -1 : 0; }); list.style.display = 'flex'; list.style.flexDirection = 'column'; };
    m.onclick = e => { const b = e.target.closest('[data-md]'); if (!b) return; pend = b.dataset.md; draw(); };
    draw(); return r;
  };
  document.addEventListener('click', e => { if (e.target.closest && e.target.closest('#tplList button')) window.__npPendMode = pend || 'math'; }, true);
  const _ra = renderAll;
  renderAll = function () {
    if (window.__npPendMode && doc && doc.settings) { const md = window.__npPendMode; window.__npPendMode = null; pend = null; doc.settings.mode = md === 'math' ? undefined : md; if (md === 'phys' && (!doc.settings.theme || doc.settings.theme === 'brown')) doc.settings.theme = 'navy'; applySettings(); }
    return _ra.apply(this, arguments);
  };
  // คลังรูป: โหมดฟิสิกส์เปิดหมวดฟิสิกส์ก่อน
  if (!LIBCAT.some(c => c[0] === '— ฟิสิกส์ —')) LIBCAT.push(['— ฟิสิกส์ —'], ['ฟิสิกส์: กราฟและรูปทั่วไป', ['wbfree', 'combo', 'fgraph', 'vec2']]);
  const _ol = openLibrary; openLibrary = function (id) { if (!id && modeOf() === 'phys') { const c = LIBCAT.find(x => x[0] === 'ฟิสิกส์: กราฟและรูปทั่วไป'); if (c && c[1].length) libKind = c[1][0]; } return _ol.apply(this, arguments); };

  /* ---------- แม่แบบโหมดฟิสิกส์ ---------- */
  const P = h => newBlock('para', { html: h });
  const LV = ['ระดับ 1 : พื้นฐาน', 'ระดับ 2 : ประยุกต์', 'ระดับ 3 : วิเคราะห์', 'ระดับ 4 : ท้าทาย'];
  DOC_TEMPLATES.push(
    ['แบบฝึกฟิสิกส์รายบท', 'เนื้อหา · พิสูจน์สมการ · ฝึกทันที · แบบฝึก 4 ระดับ · แบบทดสอบแนว A-Level', () => ({
      settings: { name: 'แบบฝึกฟิสิกส์', hl: 'แบบฝึกทักษะ ฟิสิกส์ เรื่อง ...', hr: 'ฟิสิกส์ ม.6', size: 'book', mode: 'phys', theme: 'navy', bxth: true, wbh: true, wdist: true },
      blocks: [newBlock('cover', { badge: 'แบบฝึกทักษะ', grade: 'ม.6', num: 'บทที่ ...', title: 'ชื่อบท', suf: '', subj: 'รายวิชาเพิ่มเติม ฟิสิกส์', f0: M('\\Sigma\\vec{F}=m\\vec{a}'), f1: M('v=f\\lambda'), f2: M('E=mc^{2}'), f3: M('W=Fs') }),
        newBlock('section', { html: '1.1 ชื่อหัวข้อ' }), newBlock('box', { kind: 'obj', title: 'จุดประสงค์การเรียนรู้', html: '1) ...<br>2) ...' }), P('เนื้อหา...'),
        newBlock('box', { kind: 'plaw', title: 'นิยาม / กฎ', html: '...' }), newBlock('box', { kind: 'peq', title: 'สมการสำคัญ', html: '<span class="mx" contenteditable="false" data-tex="F=ma" data-disp="1"></span>' }),
        newBlock('box', { kind: 'pproof', title: 'การพิสูจน์สมการ', html: 'ขั้นที่ 1 ...<br>ขั้นที่ 2 ...<br>ขั้นที่ 3 ...' }), newBlock('box', { kind: 'pmis', title: 'ความเข้าใจผิดที่พบบ่อย', html: '...' }),
        newBlock('activity', { html: 'ฝึกทันที 1.1', icon: '✎' }), newBlock('problem', { html: 'ข้อ 1' }), newBlock('question', { html: '...' }), newBlock('work', { h: 30, ans: true }), newBlock('actend'),
        newBlock('wbban', { html: 'แบบฝึกทักษะ 1.1', sub: 'ชื่อหัวข้อ · เรียงจากง่ายไปยาก', icon: 'pen' })].concat(...LV.map((l, i) => [newBlock('subsection', { html: l }), newBlock('problem', { html: 'ข้อ ' + (i + 1) }), newBlock('question', { html: '...' }), newBlock('work', { h: 35, ans: true })]))
        .concat([newBlock('section', { html: 'แบบทดสอบท้ายบท (แนว A-Level)' }), newBlock('problem', { html: 'ข้อ 1', pts: '' }), newBlock('question', { html: '...' }), newBlock('choices', { items: ['', '', '', '', ''] })])
    })],
    ['ใบกิจกรรมการทดลอง (ฟิสิกส์)', 'จุดประสงค์ · อุปกรณ์ · วิธีทดลอง · ตารางบันทึกผล · กราฟ · สรุปผล', () => ({
      settings: { name: 'ใบกิจกรรมการทดลอง', hl: 'ใบกิจกรรมการทดลอง เรื่อง ...', hr: 'ฟิสิกส์', size: 'book', mode: 'phys', theme: 'navy', bxth: true, wbh: true },
      blocks: [newBlock('section', { html: 'กิจกรรมการทดลอง เรื่อง ...' }), newBlock('table', { rows: [['ชื่อ–สกุล', '', 'ชั้น', '', 'เลขที่', '']], full: true, cw: [16, 44, 10, 12, 10, 8] }),
        newBlock('subsection', { html: 'จุดประสงค์' }), P('1) ...<br>2) ...'), newBlock('subsection', { html: 'อุปกรณ์' }), P('1) ...<br>2) ...'), newBlock('work', { h: 40, wl: 'ภาพอุปกรณ์ / การจัดอุปกรณ์' }),
        newBlock('subsection', { html: 'วิธีทดลอง' }), P('1) ...<br>2) ...<br>3) ...'), newBlock('subsection', { html: 'ตารางบันทึกผล' }),
        newBlock('table', { rows: [['ครั้งที่', 'ปริมาณที่ 1 (หน่วย)', 'ปริมาณที่ 2 (หน่วย)', 'ปริมาณที่ 3 (หน่วย)'], ['1', '', '', ''], ['2', '', '', ''], ['3', '', '', ''], ['ค่าเฉลี่ย', '', '', '']], full: true, tst: { k: 'soft', hr: 1 } }),
        newBlock('subsection', { html: 'กราฟ' }), newBlock('figure', { lib: { kind: 'wbfree', p: { src: 'axes: 0 10 0 10', x0: '-0.8', x1: '11', y0: '-0.8', y1: '10.8', sx: '34', ax: 'yes', tx: '1', ty: '1', grid: 'yes', xl: 'x (หน่วย)', yl: 'y (หน่วย)' } }, w: 70 }),
        newBlock('subsection', { html: 'สรุปผลการทดลอง' }), newBlock('work', { h: 30, wl: 'สรุปผล' }), newBlock('subsection', { html: 'คำถามท้ายการทดลอง' }), newBlock('question', { html: '1) ...' }), newBlock('work', { h: 25 })]
    })]);
  if (typeof TPL_META === 'object' && typeof TPL_GROUPS2 === 'object') {
    if (!TPL_GROUPS2.some(g => g[0] === 'phys')) TPL_GROUPS2.splice(1, 0, ['phys', 'ฟิสิกส์', 'แบบฝึกรายบท · ใบกิจกรรมการทดลอง · ข้อสอบ A-Level']);
    TPL_META['แบบฝึกฟิสิกส์รายบท'] = ['phys', 'เนื้อหา พิสูจน์สมการ ฝึกทันที แบบฝึก 4 ระดับ ทดสอบท้ายบท', 'workbook'];
    TPL_META['ใบกิจกรรมการทดลอง (ฟิสิกส์)'] = ['phys', 'จุดประสงค์ อุปกรณ์ วิธีทดลอง ตาราง กราฟ สรุปผล', 'book'];
  }
  // ข้อสอบ A-Level ฟิสิกส์: ปรนัย 5 ตัวเลือก 25 ข้อ + ระบายตัวเลข 5 ข้อ (xxxx.xx) · ตารางค่าคงตัวหน้าแรก
  if (typeof EXAM_PRESETS === 'object') EXAM_PRESETS.aphys = { name: 'A-Level ฟิสิกส์ (มีตารางค่าคงตัว)', subj: 'ฟิสิกส์ (A-Level)', set: 'ชุดที่ 1 · แนวข้อสอบปี 2569', time: 90, lab: '(1)', phys: true,
    parts: [{ n: 'ตอนที่ 1 แบบปรนัย 5 ตัวเลือก', c: 25, t: 'mc5', p: 3, w: 'third' }, { n: 'ตอนที่ 2 แบบระบายตัวเลข', c: 5, t: 'dec', d: 4, f: 2, p: 5, w: 'half' }] };
  if (typeof buildExam === 'function') { const _be = buildExam; buildExam = function (c) { const out = _be.apply(this, arguments); if (c && /ฟิสิกส์/.test(c.subj || '')) { const i = out.findIndex(b => b.t === 'examcover'); const cb = [newBlock('subsection', { html: 'ค่าคงตัวและข้อมูลที่ใช้' })].concat(npConstBlocks(CONSTS.map(x => x[0]), [37, 53], false)); out.splice(i + 1, 0, ...cb); } return out; }; }
  // ปุ่มในเมนูแทรก
  window.npInsertMenuGroup = () => `<div class="g"><div class="hd">ฟิสิกส์</div><button data-np="qty">ปริมาณและหน่วย (9.8 m/s²)</button><button data-np="const">ตารางค่าคงตัว…</button>${['plaw', 'peq', 'pproof', 'pext', 'pmis', 'pcmp', 'punit'].map(k => `<button data-box="${k}"><span class="dot" style="background:${BOXCOL[k]}"></span>${BOXES[k]}</button>`).join('')}</div>`;
  document.addEventListener('click', e => { const b = e.target.closest && e.target.closest('#mInsert [data-np]'); if (!b) return; e.stopPropagation(); closeMenus(); if (b.dataset.np === 'qty') qtyDialog(); else openConsts(); }, true);
})();

/* ===================== ส่งออก PDF เฉพาะบางหน้า =====================
   ส่งออก → "PDF เฉพาะบางหน้า…" · พิมพ์ช่วงหน้า เช่น 3-5, 8 หรือกด "หน้านี้" (หน้าที่กำลังดู)
   window.NP_PAGES = [ลำดับหน้าเริ่ม 0] ระหว่างส่งออก (exportPDF / exportPrintPDF อ่านค่านี้) */
(function () {
  window.NP_PAGES = null;
  const total = () => $('#sheets').childElementCount;
  function curPage() {
    const sc = $('#scroller'), zw = $('#zoomwrap'); const z = parseFloat(zw && zw.style.zoom) || 1; const P = (PAGE_H + PAGE_G) * z;
    return Math.max(1, Math.min(total(), Math.floor(((sc ? sc.scrollTop : 0) + (sc ? sc.clientHeight : 800) * 0.35) / P) + 1));
  }
  function parse(str, n) {
    const out = new Set(); String(str || '').replace(/[–—]/g, '-').split(/[,\s]+/).filter(Boolean).forEach(t => {
      const m = /^(\d+)(?:-(\d*))?$/.exec(t); if (!m) throw new Error('รูปแบบไม่ถูกต้อง: ' + t);
      const a = +m[1], b = m[2] === undefined ? a : (m[2] === '' ? n : +m[2]);
      for (let i = Math.min(a, b); i <= Math.max(a, b); i++) if (i >= 1 && i <= n) out.add(i - 1);
    });
    return [...out].sort((x, y) => x - y);
  }
  const label = L => { const r = []; let s = null, p = null; L.forEach(i => { if (s === null) { s = p = i; } else if (i === p + 1) p = i; else { r.push(s === p ? s + 1 : `${s + 1}-${p + 1}`); s = p = i; } }); if (s !== null) r.push(s === p ? s + 1 : `${s + 1}-${p + 1}`); return r.join(','); };
  // ชื่อไฟล์บอกช่วงหน้า
  const _fn = fname; fname = function (ext) { const f = _fn(ext); if (!window.NP_PAGES || !NP_PAGES.length) return f; return f.replace(/(\.[^.]+)$/, ` (หน้า ${label(NP_PAGES)})$1`); };
  async function run(kind, L) {
    window.NP_PAGES = L;
    try { if (kind === 'vec') await exportPrintPDF(); else await exportPDF(); }
    finally { window.NP_PAGES = null; }
  }
  window.openPageExport = function () {
    $$('#dPgr').forEach(x => x.remove());
    paginate(); const n = total(), c = curPage();
    const d = document.createElement('div'); d.className = 'dlg-back'; d.id = 'dPgr';
    d.innerHTML = `<div class="dlg" style="width:520px"><h3 style="margin:0 0 10px">ส่งออก PDF เฉพาะบางหน้า</h3>
<div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap"><label>หน้าที่ต้องการ</label><input id="pgrIn" type="text" value="${c}" style="flex:1;min-width:160px;font:inherit;font-size:18px;padding:4px 8px" placeholder="เช่น 3-5, 8">
<button class="tb" data-p="cur">หน้านี้ (${c})</button><button class="tb" data-p="all">ทั้งหมด</button></div>
<div class="hint" style="margin:6px 0 10px">เอกสารนี้มี ${n} หน้า · ใช้ - สำหรับช่วง และ , คั่นหลายช่วง เช่น <code>1, 4-6, 10-</code> (10- = หน้า 10 ถึงหน้าสุดท้าย)</div>
<label style="display:block;margin:4px 0"><input type="radio" name="pgrK" value="vec" checked> PDF คมชัด (เวกเตอร์) · เปิดหน้าต่างพิมพ์ → บันทึกเป็น PDF</label>
<label style="display:block;margin:4px 0"><input type="radio" name="pgrK" value="img"> PDF แบบภาพ (สำรอง)</label>
<div id="pgrErr" style="color:#b03a2e;min-height:1.2em;margin-top:6px"></div>
<div style="display:flex;gap:8px;justify-content:flex-end;margin-top:8px"><button class="tb" data-p="x">ยกเลิก</button><button class="tb primary" data-p="go">ส่งออก</button></div></div>`;
    document.body.appendChild(d); d.classList.add('open');
    const inp = $('#pgrIn', d); inp.focus(); inp.select();
    const close = () => d.remove();
    const go = () => { let L; try { L = parse(inp.value, n); } catch (e) { $('#pgrErr', d).textContent = e.message; return; } if (!L.length) { $('#pgrErr', d).textContent = `ไม่มีหน้าในช่วงนี้ (มี ${n} หน้า)`; return; } const k = ($('input[name=pgrK]:checked', d) || {}).value; close(); run(k, L.length === n ? null : L); };
    d.onclick = e => { const b = e.target.closest('[data-p]'); if (e.target === d) return close(); if (!b) return; const p = b.dataset.p; if (p === 'cur') inp.value = String(curPage()); else if (p === 'all') inp.value = `1-${n}`; else if (p === 'x') close(); else if (p === 'go') go(); };
    inp.onkeydown = e => { if (e.key === 'Enter') go(); if (e.key === 'Escape') close(); };
  };
  // เพิ่มในเมนู "ส่งออก" (แถบเครื่องมือ) และเมนูปุ่ม PDF
  function hook() {
    const bx = $('#bExp');
    if (bx && !bx.dataset.pgr && typeof uiMenu === 'function') {
      bx.dataset.pgr = 1; const K = IS_MAC ? '⌘' : 'Ctrl+';
      bx.onclick = () => uiMenu(bx, [['PDF คมชัด (เวกเตอร์)', () => exportPrintPDF(), K + 'P'], ['PDF แบบภาพ (สำรอง)', () => exportPDF()], ['PDF เฉพาะบางหน้า / ช่วงหน้า…', () => openPageExport()], ['Word (.docx)', () => exportDOCX()], '-', ['📤 ส่งข้อสอบไป Sir’Earth Class…', () => (typeof sndOpen === 'function' ? sndOpen() : 0)], '-', ['ตรวจการจัดหน้า…', () => openLayoutCheck()]]);
    }
    const bp = $('#bPdf');
    if (bp && !bp.dataset.pgr) {
      bp.dataset.pgr = 1; const _c = bp.onclick;
      bp.onclick = function (ev) { const r = _c && _c.call(this, ev); const m = $('#pdfMenu'); if (m) { const b = document.createElement('button'); b.dataset.k = 'pgr'; b.innerHTML = '<b>PDF เฉพาะบางหน้า / ช่วงหน้า…</b><small>เลือกหน้าที่กำลังดู หรือพิมพ์ช่วงหน้า เช่น 3-5, 8</small>'; b.onclick = e => { e.stopPropagation(); m.remove(); openPageExport(); }; m.insertBefore(b, m.querySelector('hr')); } return r; };
    }
  }
  hook(); setTimeout(hook, 500); setTimeout(hook, 2000);
  if (typeof scAdd === 'function') scAdd(IS_MAC ? '⌘⇧P' : 'Ctrl+Shift+P', 'ส่งออก PDF เฉพาะบางหน้า', 'ไฟล์', () => openPageExport(), e => (e.metaKey || e.ctrlKey) && e.shiftKey && !e.altKey && e.code === 'KeyP');
})();

/* ===================== บอร์ดโครงงาน (ระยะที่ 1) =====================
   doc.settings.tpl = 'board' · settings.board = { layout:1|3, panels:[{name,w,h}] (ซม.), fs:[..] }
   บล็อก: bpanel (เริ่มแผง: จำนวนคอลัมน์ สัดส่วน ขนาดตัวอักษร) · bcol (ขึ้นคอลัมน์ถัดไป) · bcard (หัวการ์ด มีเลขในวงกลม)
   บล็อกเดิมทุกชนิด (ย่อหน้า ตาราง สมการ รูป กล่อง) วางใต้หัวการ์ดได้ → อยู่ในการ์ดเดียวกันจนถึงหัวการ์ด/คอลัมน์/แผงถัดไป
   ส่งออก: PDF ขนาดจริงทีละแผง (พิมพ์แบบเวกเตอร์ @page ตามขนาดแผง ชื่อไฟล์ตั้งอัตโนมัติ) */
(function () {
  const CM = 37.8, GAP_PANEL = 90, TOPM = 70, PAD = 50, CGAP = 30, BGAP = 6, CARDGAP = 26;
  const isBoard = () => !!(doc && doc.settings && doc.settings.tpl === 'board');
  window.isBoard = isBoard;
  const defBoard = () => ({ layout: 3, panels: [{ name: 'แผงซ้าย', w: 60, h: 60 }, { name: 'แผงกลาง', w: 120, h: 60 }, { name: 'แผงขวา', w: 60, h: 60 }] });
  const BD = () => { const s = doc.settings; if (!s.board) s.board = defBoard(); return s.board; };

  const st = document.createElement('style');
  st.textContent = `
body.board #stage{width:auto}
body.board #flow{margin:0!important;padding:0!important;width:100%!important;position:relative;color:#13294B;line-height:1.45}
body.board #flow>.blk{position:absolute!important;box-sizing:border-box;margin:0!important}
body.board .bsheet{position:absolute;border-radius:6px;background:linear-gradient(160deg,#f3f8fe,#dceafa);box-shadow:0 2px 6px rgba(0,0,0,.12),0 14px 40px rgba(0,0,0,.10)}
body.board .bcardbg{position:absolute;background:#fff;border-radius:18px;box-shadow:0 3px 12px rgba(14,44,94,.13);border:1px solid #d8e4f4}
body.board .bcardbg.over{border:3px solid #d93025}
body.board .bplabel{position:absolute;font:600 22px var(--dfont,'THS');color:#5a6b85}
.b-bpanel{font-size:20px!important;color:#5a6b85;border:1.5px dashed #9fb3cf;border-radius:10px;padding:4px 12px;background:#fff}
.b-bcol{font-size:16px!important;color:#9fb3cf;border-top:2px dashed #c4d3e8;text-align:right;padding-top:2px}
.b-bcard{display:flex;align-items:center;gap:12px;color:#0E2C5E;font-weight:700;font-size:1.3em;padding:2px 0 6px;border-bottom:3px solid #D9822B}
.b-bcard .bn{flex:0 0 auto;width:1.45em;height:1.45em;border-radius:50%;background:#1D4E9E;color:#fff;display:flex;align-items:center;justify-content:center;font-size:.85em}
.b-bcard .bn:empty{display:none}.b-bcard>div{flex:1}
body.exporting .b-bpanel,body.exporting .b-bcol,body.bdprinting .b-bpanel,body.bdprinting .b-bcol,body.bdprinting .bplabel{visibility:hidden}
#bdBar{position:fixed;left:50%;transform:translateX(-50%);top:62px;z-index:59;display:none;gap:6px;background:#fff;border:1px solid #d8e4f4;border-radius:12px;padding:4px 6px;box-shadow:0 4px 16px rgba(14,44,94,.14)}
body.board #bdBar{display:flex}#bdBar button{font:inherit;font-size:15px;border:1px solid #d8e4f4;background:#fff;border-radius:8px;padding:3px 10px;cursor:pointer}#bdBar button:hover{background:#eef4fc}
@media print{html.bdprint body>*:not(#bdPrint){display:none!important}html.bdprint #bdPrint{display:block!important;position:absolute;left:0;top:0;overflow:hidden;-webkit-print-color-adjust:exact;print-color-adjust:exact}}
#bdPrint{display:none}`;
  document.head.appendChild(st);

  /* ---------- บล็อก ---------- */
  Object.assign(TYPES, { bpanel: 'บอร์ด: เริ่มแผง', bcol: 'บอร์ด: ขึ้นคอลัมน์ถัดไป', bcard: 'บอร์ด: หัวการ์ด' });
  const _nb = extNewBlock; extNewBlock = function (b) { _nb(b); if (b.t === 'bpanel') Object.assign(b, { html: 'แผง', cols: 2, ratio: '1,1', fs: 32 }); if (b.t === 'bcard') Object.assign(b, { html: 'หัวข้อ', num: '' }); };
  const _bh = extBlockHTML; extBlockHTML = function (b) {
    const r = _bh(b); if (r) return r;
    if (b.t === 'bpanel') return `<div class="b-bpanel"><span contenteditable="true" data-f="html" data-ph="ชื่อแผง"></span> · ${b.cols || 1} คอลัมน์</div>`;
    if (b.t === 'bcol') return `<div class="b-bcol">คอลัมน์ถัดไป ↦</div>`;
    if (b.t === 'bcard') return `<div class="b-bcard"><span class="bn" contenteditable="true" data-f="num"></span><div contenteditable="true" data-f="html" data-ph="หัวข้อการ์ด"></div></div>`;
    return '';
  };
  const _ei = extInspector; extInspector = function (b) {
    let h = _ei(b); const num = (k, lab, v, mn, mx, stp = 1) => `<div class="ir"><label>${lab}</label><input type="number" min="${mn}" max="${mx}" step="${stp}" data-bn="${k}" value="${v}"></div>`;
    if (b.t === 'bpanel') h += num('cols', 'จำนวนคอลัมน์', b.cols || 1, 1, 3) + `<div class="ir"><label>สัดส่วนความกว้าง เช่น 1,1,2</label><input type="text" data-bt="ratio" value="${esc(b.ratio || '')}"></div>` + num('fs', 'ขนาดตัวอักษรของแผง (px)', b.fs || 32, 10, 80);
    if (b.t === 'bcard') h += `<div class="ir"><label><input type="checkbox" data-bc2="span" ${b.span ? 'checked' : ''}> การ์ดยาวเต็มแถว (ทุกคอลัมน์)</label></div><div class="ir"><label>เลขในวงกลม (เว้นว่าง = ไม่แสดง)</label><input type="text" data-bt="num" value="${esc(b.num || '')}"></div>`;
    return h;
  };

  /* ---------- จัดวางบอร์ด ---------- */
  function geom() { // ตำแหน่งแผง (px) แผงข้างชิดขอบล่างของแผงกลาง
    const B = BD(), P = (B.layout === 1 ? B.panels.slice(1, 2) : B.panels).map(p => ({ name: p.name, w: (+p.w || 60) * CM, h: (+p.h || 60) * CM, wcm: +p.w || 60, hcm: +p.h || 60 }));
    const H = Math.max(...P.map(p => p.h)); let x = 40;
    P.forEach(p => { p.x = x; p.y = TOPM + (H - p.h); x += p.w + GAP_PANEL; });
    return { P, W: x - GAP_PANEL + 40, H: TOPM + H + 40 };
  }
  window.boardGeom = geom;
  function boardLayout() {
    const G = geom(), flow = $('#flow'), sh = $('#sheets'); let html = '';
    G.P.forEach(p => { html += `<div class="bsheet" style="left:${p.x}px;top:${p.y}px;width:${p.w}px;height:${p.h}px"></div><div class="bplabel" style="left:${p.x}px;top:${p.y - 34}px">${esc(p.name)} ${p.wcm}×${p.hcm} ซม.</div>`; });
    const els = $$('#flow > .blk'); let pi = -1, cfg = null, cols = [], cur = 0, card = null; const bgs = [];
    const closeCard = () => { if (!card) return; const c = cols[card.col]; const top = card.top - 14, bot = c.y + 10; bgs.push({ x: card.x - 18, y: top, w: card.w + 36, h: bot - top, over: bot > cfg.bottom }); c.y = bot + CARDGAP; if (card.span) cols.forEach(cc => cc.y = c.y); card = null; };
    const startPanel = (b) => {
      closeCard(); pi = Math.min(pi + 1, G.P.length - 1); const p = G.P[pi]; const n = Math.max(1, Math.min(3, +b.cols || 1));
      let rr = String(b.ratio || '').split(',').map(Number).filter(v => v > 0); while (rr.length < n) rr.push(1); rr = rr.slice(0, n); const sum = rr.reduce((a, c) => a + c, 0);
      const inner = p.w - 2 * PAD - (n - 1) * CGAP; let x = p.x + PAD; cols = rr.map(r => { const w = inner * r / sum; const c = { x, w, y: p.y + PAD }; x += w + CGAP; return c; });
      cfg = { fs: +b.fs || 32, bottom: p.y + p.h - PAD, p }; cur = 0;
    };
    els.forEach(el => {
      const b = byId(el.dataset.id); if (!b) return; const t = b.t;
      if (t === 'bpanel') { startPanel(b); const p = G.P[pi]; Object.assign(el.style, { left: (p.x + p.w - 330) + 'px', top: (p.y - 38) + 'px', width: '330px', fontSize: '' }); return; }
      if (!cfg) startPanel({ cols: 1 });
      el.style.fontSize = cfg.fs + 'px';
      if (t === 'bcol') { closeCard(); cur = Math.min(cur + 1, cols.length - 1); const c = cols[cur]; Object.assign(el.style, { left: c.x + 'px', top: (c.y - 22) + 'px', width: c.w + 'px', fontSize: '' }); return; }
      if (t === 'bcard') {
        closeCard();
        if (b.span) { const y = Math.max(...cols.map(c => c.y)); cols.forEach(c => c.y = y); const L = cols[0].x, R = cols[cols.length - 1].x + cols[cols.length - 1].w; card = { col: 0, x: L, w: R - L, top: y, span: true }; }
        else { const c = cols[cur]; card = { col: cur, x: c.x, w: c.w, top: c.y }; }
      }
      const c = cols[card ? card.col : cur]; const x = card ? card.x : c.x, w = card ? card.w : c.w;
      Object.assign(el.style, { left: x + 'px', top: c.y + 'px', width: w + 'px' });
      c.y += el.offsetHeight + BGAP;
      if (card && card.span) cols.forEach(cc => cc.y = c.y);
    });
    closeCard();
    bgs.forEach(g => { html += `<div class="bcardbg${g.over ? ' over' : ''}" style="left:${g.x}px;top:${g.y}px;width:${g.w}px;height:${g.h}px"></div>`; });
    sh.innerHTML = html; sh.dataset.sig = 'board';
    const stg = $('#stage'); stg.style.width = G.W + 'px'; stg.style.height = G.H + 'px'; flow.style.height = G.H + 'px';
    status(`บอร์ด ${G.P.length} แผง`);
  }
  window.boardLayout = boardLayout;
  const _pg = paginate;
  paginate = function () { if (isBoard()) { try { return boardLayout(); } catch (e) { console.error('board', e); } return; } const stg = $('#stage'); if (stg && stg.style.width) { stg.style.width = ''; $('#flow').style.height = ''; } return _pg.apply(this, arguments); };
  const _as = applySettings;
  applySettings = function () { const r = _as.apply(this, arguments); const on = isBoard(); document.body.classList.toggle('board', on); if (!on) $$('#flow > .blk').forEach(el => { el.style.left = el.style.top = el.style.width = ''; const bb = byId(el.dataset.id), fs = bb && bb.st && bb.st.fs; el.style.fontSize = fs && fs != 1 ? fs + 'em' : ''; }); return r; };
  // ซูมพอดีจอเมื่อเปิดบอร์ด
  function fitZoom() { const sc = $('#scroller'), zs = $('#zoom'); if (!sc || !zs) return; const z = Math.max(.05, Math.min(1, (sc.clientWidth - 40) / geom().W)); const v = (Math.floor(z * 100) / 100).toFixed(2); if (![...zs.options].some(o => o.value === v)) { const o = document.createElement('option'); o.value = v; o.textContent = Math.round(v * 100) + '%'; zs.insertBefore(o, zs.firstChild); } zs.value = v; $('#zoomwrap').style.zoom = v; }
  window.boardFit = fitZoom;
  let wasBoard = false;
  const _ra = renderAll; renderAll = function () { const r = _ra.apply(this, arguments); const on = isBoard(); if (on && !wasBoard) setTimeout(fitZoom, 60); if (!on && wasBoard) { const zs = $('#zoom'); if (zs) { zs.value = '1'; if (zs.value !== '1') zs.selectedIndex = [...zs.options].findIndex(o => +o.value === 1); $('#zoomwrap').style.zoom = 1; } } wasBoard = on; return r; };

  /* ---------- แถบบอร์ด + ตั้งค่า ---------- */
  const bar = document.createElement('div'); bar.id = 'bdBar';
  bar.innerHTML = '<button data-bd="set">⚙ ตั้งค่าบอร์ด</button><button data-bd="fit">⤢ พอดีจอ</button><button data-bd="pdf">⬇ PDF ขนาดจริง</button>';
  document.body.appendChild(bar);
  bar.onclick = e => { const b = e.target.closest('[data-bd]'); if (!b) return; ({ set: openBoardSettings, fit: fitZoom, pdf: openBoardExport })[b.dataset.bd](); };
  function dlg(id, w, html) { $$('#' + id).forEach(x => x.remove()); const d = document.createElement('div'); d.className = 'dlg-back open'; d.id = id; d.innerHTML = `<div class="dlg" style="width:${w}px">${html}</div>`; document.body.appendChild(d); d.addEventListener('click', e => { if (e.target === d || e.target.closest('[data-x]')) d.remove(); }); return d; }
  function openBoardSettings() {
    const B = BD(); const row = (p, i) => `<tr><td><input type="text" data-pn="${i}" value="${esc(p.name)}" style="width:110px"></td><td><input type="number" data-pw="${i}" value="${p.w}" min="10" max="300" style="width:70px"> ×</td><td><input type="number" data-ph="${i}" value="${p.h}" min="10" max="300" style="width:70px"> ซม.</td></tr>`;
    const d = dlg('dBoard', 520, `<h3 style="margin:0 0 10px">ตั้งค่าบอร์ด</h3>
<div style="display:flex;gap:14px;font-size:16px;margin-bottom:10px"><label><input type="radio" name="bdl" value="3" ${B.layout !== 1 ? 'checked' : ''}> 3 แผง (ซ้าย | กลาง | ขวา)</label><label><input type="radio" name="bdl" value="1" ${B.layout === 1 ? 'checked' : ''}> 1 แผง</label></div>
<table style="font-size:16px;border-spacing:6px 4px">${B.panels.map(row).join('')}</table>
<div class="hint" style="margin:6px 0">แบบ 1 แผงใช้ขนาดของแผงกลาง · จำนวนคอลัมน์และขนาดตัวอักษรตั้งที่บล็อก “เริ่มแผง” ของแต่ละแผง</div>
<div style="display:flex;justify-content:flex-end;gap:8px;margin-top:8px"><button class="tb" data-x>ยกเลิก</button><button class="tb primary" data-ok>บันทึก</button></div>`);
    $('[data-ok]', d).onclick = () => { B.layout = +($('input[name=bdl]:checked', d).value); B.panels.forEach((p, i) => { p.name = $(`[data-pn="${i}"]`, d).value || p.name; p.w = Math.max(10, +$(`[data-pw="${i}"]`, d).value || p.w); p.h = Math.max(10, +$(`[data-ph="${i}"]`, d).value || p.h); }); d.remove(); changed(true); paginate(); fitZoom(); };
  }
  window.openBoardSettings = openBoardSettings;

  /* ---------- ส่งออก PDF ขนาดจริง (ทีละแผง) ---------- */
  const shortName = () => String(doc.settings.name || 'โครงงาน').replace(/^บอร์ด\s*/, '').replace(/[\\/:*?"<>|]/g, ' ').trim().slice(0, 30);
  function openBoardExport() {
    paginate(); const G = geom();
    const d = dlg('dBoardX', 520, `<h3 style="margin:0 0 6px">ส่งออก PDF ขนาดจริง</h3><div class="hint" style="margin-bottom:10px">กดทีละแผง → หน้าต่างพิมพ์ → เลือก “บันทึกเป็น PDF” (ขนาดกระดาษตั้งให้แล้ว ระยะขอบ: ไม่มี · เปิด “กราฟิกพื้นหลัง”)</div>${G.P.map((p, i) => `<button class="tb" data-pi="${i}" style="display:block;width:100%;margin:5px 0;font-size:17px;text-align:left">⬇ ${esc(p.name)} · ${p.wcm}×${p.hcm} ซม.</button>`).join('')}<div style="text-align:right;margin-top:8px"><button class="tb" data-x>ปิด</button></div>`);
    d.querySelectorAll('[data-pi]').forEach(b => b.onclick = () => printPanel(+b.dataset.pi));
  }
  window.openBoardExport = openBoardExport;
  function printPanel(i) {
    const G = geom(), p = G.P[i]; if (!p) return;
    const zw = $('#zoomwrap'), oldZ = zw.style.zoom; zw.style.zoom = 1; $$('.blk.sel').forEach(x => x.classList.remove('sel')); if (document.activeElement) document.activeElement.blur();
    paginate();
    $$('#bdPrint').forEach(x => x.remove());
    const root = document.createElement('div'); root.id = 'bdPrint'; root.className = document.body.className + ' board bdprinting';
    root.style.width = p.w + 'px'; root.style.height = p.h + 'px';
    const stg = $('#stage').cloneNode(true); stg.removeAttribute('id'); stg.style.position = 'absolute'; stg.style.left = (-p.x) + 'px'; stg.style.top = (-p.y) + 'px';
    $$('.tools,.wh,.grip,.band,.dropline,.vgrip', stg).forEach(e => e.remove());
    const box = document.createElement('div'); box.id = 'stage'; box.style.cssText = `position:relative;width:${p.w}px;height:${p.h}px;overflow:hidden`; box.appendChild(stg);
    // id #flow/#sheets ใน clone ยังอยู่ (ใช้ CSS เดิม) — root เดียวที่แสดงตอนพิมพ์
    root.appendChild(box); document.body.appendChild(root);
    const ps = document.createElement('style'); ps.id = 'bdPage'; ps.textContent = `@page{size:${p.wcm}cm ${p.hcm}cm;margin:0}html.bdprint,html.bdprint body{width:${p.w}px;height:${p.h}px;margin:0;padding:0;background:#fff}`;
    document.head.appendChild(ps); document.documentElement.classList.add('bdprint'); document.body.classList.add('bdprinting');
    const oldT = document.title; document.title = `บอร์ด${shortName()} ${p.name} ${p.wcm}x${p.hcm} ซม.`;
    let done = false; const clean = () => { if (done) return; done = true; document.title = oldT; root.remove(); ps.remove(); document.documentElement.classList.remove('bdprint'); document.body.classList.remove('bdprinting'); zw.style.zoom = oldZ; removeEventListener('afterprint', clean); paginate(); };
    addEventListener('afterprint', clean);
    setTimeout(() => { document.title = `บอร์ด${shortName()} ${p.name} ${p.wcm}x${p.hcm} ซม.`; window.print(); setTimeout(() => { if (!done) document.addEventListener('pointerdown', function f() { document.removeEventListener('pointerdown', f, true); clean(); }, true); }, 800); }, 120);
  }
  window.boardPrintPanel = printPanel;

  /* ---------- แม่แบบ: บอร์ดโครงงาน (โครงเริ่มต้น) ---------- */
  const card = (n, t) => newBlock('bcard', { num: n ? String(n) : '', html: t });
  const P = h => newBlock('para', { html: h });
  DOC_TEMPLATES.push(['บอร์ดโครงงาน (3 แผง)', 'แผงซ้าย 60×60 · แผงกลาง 120×60 · แผงขวา 60×60 ซม. · การ์ดหัวข้อพร้อมเลข', () => ({
    settings: { name: 'บอร์ดโครงงาน', hl: '', hr: '', size: 'book', tpl: 'board', board: defBoard(), nologo: true },
    blocks: [newBlock('bpanel', { html: 'แผงซ้าย', cols: 1, fs: 32 }), card(1, 'ที่มาและความสำคัญ'), P('...'), card(2, 'วัตถุประสงค์'), P('1) ...<br>2) ...'), card(3, 'ขอบเขตของโครงงาน'), P('...'), card(4, 'นิยามศัพท์เฉพาะ'), P('...'), card(5, 'เอกสารที่เกี่ยวข้อง'), P('...'),
      newBlock('bpanel', { html: 'แผงกลาง', cols: 3, ratio: '1,1,1', fs: 32 }), newBlock('bcard', { html: 'ชื่อโครงงาน', num: '', span: true }), P('ผู้จัดทำ ... · ครูที่ปรึกษา ...'), newBlock('bcard', { html: 'วิธีการดำเนินการ', num: '6', span: true }), P('ขั้นที่ 1 ... → ขั้นที่ 2 ... → ขั้นที่ 3 ...'),
      card(7, 'ผลการศึกษา (1)'), P('...'), newBlock('bcol'), card('', 'ผลการศึกษา (2)'), P('...'), newBlock('bcol'), card('', 'ผลการศึกษา (3)'), P('...'),
      newBlock('bpanel', { html: 'แผงขวา', cols: 1, fs: 32 }), card(8, 'การนำไปใช้'), P('...'), card(9, 'สรุปผล'), P('...'), card(10, 'อภิปรายผล'), P('...'), card(11, 'ข้อเสนอแนะ'), P('...'), card(12, 'ประโยชน์ที่ได้รับ'), P('...')]
  })]);
  if (typeof TPL_META === 'object') TPL_META['บอร์ดโครงงาน (3 แผง)'] = ['teach', 'บอร์ดนำเสนอโครงงาน ขนาดจริงเป็นเซนติเมตร', 'book'];
  if (typeof npInsertMenuGroup === 'function') { const _g = npInsertMenuGroup; window.npInsertMenuGroup = () => _g() + `<div class="g"><div class="hd">บอร์ดโครงงาน</div><button data-ins="bpanel">เริ่มแผง</button><button data-ins="bcol">ขึ้นคอลัมน์ถัดไป</button><button data-ins="bcard">หัวการ์ด</button></div>`; }
})();

/* ===================== ใช้งานง่ายขึ้น: คลังรูปแบบรูปย่อ + หน้าจอไม่กระโดดเมื่อแก้ไข =====================
   1) หน้าต่างวาดรูป: หมวดด้านซ้ายมีสัญลักษณ์ · รายการรูปเป็นแถบรูปย่อเลื่อนซ้าย–ขวา (ชื่อเต็มอยู่ใน tooltip)
   2) ปิด scroll anchoring ของเบราว์เซอร์ (ต้นเหตุหน้าจอเลื่อนลงเมื่อขยายรูป/ตาราง กด Enter ฯลฯ)
      แล้วตรึงตำแหน่งเองให้บล็อกที่กำลังแก้อยู่ตำแหน่งเดิมบนจอ หลังวาดใหม่/จัดหน้าใหม่ทุกครั้ง */
(function () {
  const st = document.createElement('style');
  st.textContent = `
#scroller,#scroller *{overflow-anchor:none!important}
#lbCats{flex:0 0 168px!important}
#lbCats button{display:flex;align-items:center;gap:8px;font-size:15.5px!important;padding:5px 8px!important;line-height:1.25}
#lbCats button .ci{flex:0 0 26px;height:26px;border-radius:7px;background:#f6ece2;color:#7a3608;display:flex;align-items:center;justify-content:center;font-size:15px;font-family:KaTeX_Main,serif}
#lbCats button.on .ci{background:var(--ui-accent,#7a3608);color:#fff}
#lbCats button .cn{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical}
#lbKinds{display:flex!important;flex-wrap:nowrap!important;overflow-x:auto;gap:8px!important;padding:2px 2px 8px;scroll-snap-type:x proximity}
#lbKinds .tb.kc{flex:0 0 118px!important;width:118px!important;max-width:118px!important;white-space:normal!important;height:auto!important;min-height:0!important;display:flex;flex-direction:column;align-items:center;gap:3px;padding:5px!important;border-radius:10px;scroll-snap-align:start;font-size:13px!important;line-height:1.2}
#lbKinds .tb.kc .th{width:106px;height:70px;display:flex;align-items:center;justify-content:center;background:#fff;border-radius:6px;overflow:hidden}
#lbKinds .tb.kc .th svg{max-width:106px!important;max-height:70px!important;width:auto!important;height:auto!important}
#lbKinds .tb.kc .kn{width:100%;overflow:hidden;text-overflow:ellipsis;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;text-align:center;color:#5d554d}
#lbKinds .tb.kc.on{background:#fbe6d4;border-color:var(--ui-accent)}#lbKinds .tb.kc.on .kn{color:var(--ui-accent);font-weight:700}`;
  document.head.appendChild(st);

  /* ---------- สัญลักษณ์หมวด ---------- */
  const ICON = [[/ใช้บ่อย/, '★'], [/เซต/, '⊂'], [/จำนวนจริง|เส้นจำนวน/, '↔'], [/ฟังก์ชัน/, 'ƒ'], [/ภาคตัดกรวย|เรขาคณิตวิเคราะห์/, '◯'], [/ตรีโกณ.*ประยุกต์|มุมเงย/, '⛰'], [/ตรีโกณ/, '∠'], [/เวกเตอร์/, '→'], [/เชิงซ้อน/, 'i'], [/หลักการนับ/, '!'], [/ความน่าจะเป็น/, '⚄'], [/ลำดับ|อนุกรม/, 'Σ'], [/แคลคูลัส/, '∫'], [/สถิติ/, '▥'], [/2 มิติ/, '△'], [/3 มิติ/, '⬡'], [/สถานการณ์|ฉาก/, '⛰'], [/วาดเอง/, '✎'], [/แยกตัวประกอบ|พหุนาม/, '▦'], [/ฟิสิกส์/, '⚛']];
  const iconOf = n => (ICON.find(([r]) => r.test(n)) || [0, '•'])[1];
  function decoCats() {
    $$('#lbCats button[data-c]').forEach(b => { if (b.dataset.dc) return; b.dataset.dc = 1; const sm = b.querySelector('small'); const name = b.childNodes[0] ? b.childNodes[0].textContent.trim() : b.textContent.trim(); b.title = name; b.innerHTML = `<span class="ci">${iconOf(name)}</span><span class="cn">${esc(name.replace(/^★\s*/, '').replace(/\s*\(.*\)\s*$/, ''))}</span>` + (sm ? sm.outerHTML : ''); });
  }
  /* ---------- รูปย่อของแต่ละรูป ---------- */
  const TH = {};
  function thumb(k) { if (TH[k] !== undefined) return TH[k]; let s = ''; try { s = libSVG({ lib: { kind: k, p: {} } }) || ''; } catch (e) { } return TH[k] = s; }
  function decoKinds() {
    const box = $('#lbKinds'); if (!box) return;
    const bs = $$('#lbKinds .tb[data-k]').filter(b => !b.classList.contains('kc')); if (!bs.length) return;
    bs.forEach(b => { const k = b.dataset.k, name = (LIB[k] && LIB[k].name) || b.textContent; b.classList.add('kc'); b.title = name; const np = typeof libNameParts === 'function' ? libNameParts(name) : [name, '']; b.innerHTML = `<span class="th">${thumb(k)}</span><span class="kn${np[1] ? '' : ' l3'}">${esc(np[0])}</span>` + (np[1] ? `<span class="ks">${esc(np[1])}</span>` : ''); });
    const on = $('#lbKinds .tb.on'); if (on) on.scrollIntoView({ block: 'nearest', inline: 'nearest' });
  }
  let busy = false;
  const mo = new MutationObserver(() => { if (busy) return; busy = true; try { decoCats(); decoKinds(); } finally { busy = false; } });
  const watch = () => { const a = $('#lbCats'), b = $('#lbKinds'); if (a) mo.observe(a, { childList: true }); if (b) mo.observe(b, { childList: true }); };
  watch();
  // เลื่อนแถบรูปด้วยล้อเมาส์แนวตั้งได้
  document.addEventListener('wheel', e => { const k = e.target.closest && e.target.closest('#lbKinds'); if (!k || Math.abs(e.deltaX) > Math.abs(e.deltaY)) return; if (k.scrollWidth > k.clientWidth) { k.scrollLeft += e.deltaY; e.preventDefault(); } }, { passive: false });

  /* ---------- ตรึงตำแหน่งจอขณะแก้ไข ---------- */
  const sc = () => $('#scroller');
  function anchorEl() {
    const s = sc(); if (!s) return null; const R = s.getBoundingClientRect();
    const vis = el => { if (!el || !el.isConnected) return false; const r = el.getBoundingClientRect(); return r.bottom > R.top + 4 && r.top < R.bottom - 4; };
    const ae = document.activeElement; const a1 = ae && ae.closest && ae.closest('#flow .blk'); if (vis(a1)) return a1;
    const a2 = $('#flow .blk.sel'); if (vis(a2)) return a2;
    for (const el of $$('#flow > .blk')) { const r = el.getBoundingClientRect(); if (r.bottom > R.top + 40) return el; }
    return null;
  }
  let depth = 0, saved = null;
  function cap() { if (depth++ > 0) return; saved = null; if (document.body.classList.contains('exporting')) return; const el = anchorEl(); if (el) saved = { id: el.dataset.id, top: el.getBoundingClientRect().top }; }
  function rest() { if (--depth > 0) return; const a = saved; saved = null; if (!a) return; const el = $(`#flow .blk[data-id="${a.id}"]`); const s = sc(); if (!el || !s) return; const d = el.getBoundingClientRect().top - a.top; if (Math.abs(d) > 1) s.scrollTop += d; }
  const wrap = name => { const f = window[name]; if (typeof f !== 'function') return; window[name] = function () { cap(); try { return f.apply(this, arguments); } finally { rest(); } }; };
  ['rerender', 'paginate', 'renderAll'].forEach(wrap);
  // ฟังก์ชันที่ประกาศแบบ function ถูกเรียกด้วยชื่อ: ผูกชื่อใหม่ให้ใช้ตัวที่ห่อแล้ว
  try { rerender = window.rerender; paginate = window.paginate; renderAll = window.renderAll; } catch (e) { }
})();

/* ===================== หน้าต่างวาดรูป: อ่านง่าย กรอกง่าย ใช้ได้กับทุกแม่แบบ (รวมแม่แบบที่เพิ่มภายหลัง) =====================
   1) ชื่อหมวด/ชื่อการ์ดไม่ถูกตัดกลางตัวอักษร: การ์ดแสดงชื่อหลัก + คำขยายบรรทัดเล็ก ชื่อเต็มแสดงเป็นหัวเรื่องเหนือช่องกรอก
   2) ช่องกรอก: ป้ายอยู่เหนือช่อง คำอธิบายในวงเล็บแยกเป็นบรรทัดเล็ก ช่องสั้นวางคู่กัน 2 ช่องต่อแถว
   3) ช่องตามชนิด: แม่แบบใดมีกฎ when (LIB[kind].when หรือ LIB_WHEN[kind]) จะแสดงเฉพาะช่องที่ใช้กับชนิดที่เลือก พร้อมป้ายเฉพาะชนิด
      รูปแบบ: { dep:'ชื่อช่องที่เป็นตัวเลือกชนิด', show:{ช่อง:[ค่าของ dep ที่ให้แสดง]}, label:{ช่อง:{ค่า:'ป้าย'}}, opts:{ช่อง:{ค่า:[ตัวเลือกที่ให้เลือกได้]}} } */
(function () {
  const st = document.createElement('style');
  st.textContent = `
#lbCats{flex:0 0 196px!important}
#lbCats button{align-items:flex-start!important;line-height:1.35!important;padding:6px 8px!important}
#lbCats button .cn{display:block!important;overflow:visible!important;white-space:normal!important;overflow-wrap:anywhere;-webkit-line-clamp:unset!important;text-overflow:clip!important}
#lbCats button small{flex:0 0 auto;margin-top:2px}
#lbKinds .tb.kc{flex:0 0 132px!important;width:132px!important;max-width:132px!important;padding:6px 5px 7px!important;gap:2px!important;line-height:1.4!important;justify-content:flex-start}
#lbKinds .tb.kc .th{width:118px}#lbKinds .tb.kc .th svg{max-width:118px!important}
#lbKinds .tb.kc .kn{display:-webkit-box!important;-webkit-box-orient:vertical;-webkit-line-clamp:2;overflow:hidden;line-height:1.4!important;padding:1px 0 2px;font-size:13.5px;overflow-wrap:anywhere;flex:0 0 auto}
#lbKinds .tb.kc .kn.l3{-webkit-line-clamp:3}
#lbKinds .tb.kc .ks{display:block;width:100%;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;font-size:11.5px;line-height:1.5;color:#9a9087;text-align:center;flex:0 0 auto}
#lbTitle{margin:8px 0 0;font-weight:700;font-size:17px;line-height:1.4;color:var(--ui-accent,#7a3608)}#lbTitle small{font-weight:400;color:#8a8078;font-size:14px}
#lbForm{display:grid!important;grid-template-columns:repeat(2,minmax(0,1fr));gap:9px 12px;align-content:start;padding-right:6px;box-sizing:border-box}
#lbForm>*{grid-column:1/-1;min-width:0}
#lbForm .row.half{grid-column:auto;justify-content:flex-end}
#lbForm .row{display:flex;flex-direction:column;align-items:stretch!important;gap:3px;margin:0!important}
#lbForm .row>label{width:auto!important;font-size:15px!important;color:#4f463e;line-height:1.35}
#lbForm .row>label .lh{display:block;font-size:12.5px;color:#9a9087;line-height:1.35}
#lbForm .row>input[type=text],#lbForm .row>select,#lbForm .row>textarea{width:100%;box-sizing:border-box;flex:none!important}
#lbForm details.wbframe[open]{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:9px 12px}#lbForm details.wbframe>summary{grid-column:1/-1}
#lbForm details.wbframe>.row{grid-column:auto}
.lbsty .lbsh{line-height:1.4}`;
  document.head.appendChild(st);

  /* ---------- ชื่อการ์ด: ชื่อหลัก + คำขยาย ---------- */
  window.libNameParts = function (name) {
    name = String(name || '');
    let m = /^(.*\S)\s*\(([^()]*[ก-๙][^()]*)\)\s*$/.exec(name); if (m && m[1].length >= 4) return [m[1], m[2]];
    m = /^([^:]{4,}?):\s+(.+)$/.exec(name); if (m) return [m[1], m[2]];
    return [name, ''];
  };

  /* ---------- กฎช่องตามชนิดของแม่แบบที่มีอยู่ ---------- */
  window.LIB_WHEN = Object.assign(window.LIB_WHEN || {}, {
    conic: { dep: 'kind',
      show: { b: ['ellipse', 'hyper'], dir: ['parab', 'ellipse', 'hyper'], f: ['parab', 'ellipse', 'hyper'], ax: ['parab', 'ellipse', 'hyper'], as: ['hyper'] },
      label: { h: { circle: 'จุดศูนย์กลาง h', ellipse: 'จุดศูนย์กลาง h', hyper: 'จุดศูนย์กลาง h', parab: 'จุดยอด h' }, k: { circle: 'จุดศูนย์กลาง k', ellipse: 'จุดศูนย์กลาง k', hyper: 'จุดศูนย์กลาง k', parab: 'จุดยอด k' },
        a: { circle: 'รัศมี r', parab: 'ระยะโฟกัส c', ellipse: 'ครึ่งแกนเอก a', hyper: 'ครึ่งแกนตามขวาง a' }, b: { ellipse: 'ครึ่งแกนโท b', hyper: 'ครึ่งแกนสังยุค b' },
        dir: { parab: 'ทิศเปิด', ellipse: 'แนวแกนเอก', hyper: 'แนวแกนตามขวาง' }, ax: { parab: 'เส้นไดเรกตริกซ์', ellipse: 'แกนเอกและแกนโท', hyper: 'แกนตามขวางและแกนสังยุค' }, as: { hyper: 'เส้นกำกับ' } },
      opts: { dir: { ellipse: ['h', 'v'], hyper: ['h', 'v'] } } },
    trim: { dep: 'mode', show: { a: ['sss', 'asa', 'aas'], b: ['sss', 'sas'], c: ['sss', 'sas'], A: ['sas', 'aas'], B: ['asa', 'aas'], C: ['asa'] } }
  });

  const rowOf = k => { const el = $(`#lbForm [data-k="${k}"]`); return el ? el.closest('.row') : null; };
  function setLabel(row, text) {
    const lb = row && row.querySelector('label'); if (!lb) return;
    if (lb.dataset.full === undefined) lb.dataset.full = lb.textContent;
    const t = text || lb.dataset.full; let main = t, hint = '';
    const m = /^(.*?\S)\s+\((.+)\)\s*(.*)$/.exec(t); if (m) { main = m[1]; hint = m[2] + (m[3] ? ' · ' + m[3] : ''); }
    lb.title = t; lb.innerHTML = esc(main) + (hint ? `<span class="lh">${esc(hint)}</span>` : '');
  }
  function layout() {
    const form = $('#lbForm'); if (!form) return; const L = LIB[libKind] || {}; const W = L.when || LIB_WHEN[libKind];
    const dep = W && $(`#lbForm [data-k="${W.dep}"]`), v = dep ? dep.value : null;
    $$('#lbForm .row').forEach(r => { const el = r.querySelector('[data-k]'); if (!el) return; const k = el.dataset.k;
      if (r.dataset.wh) { r.style.display = ''; delete r.dataset.wh; }
      let text = null;
      if (W && v !== null) {
        if (W.show && W.show[k] && !W.show[k].includes(v)) { r.style.display = 'none'; r.dataset.wh = 1; }
        if (W.label && W.label[k] && W.label[k][v]) text = W.label[k][v];
        if (el.tagName === 'SELECT' && W.opts && W.opts[k]) { const allow = W.opts[k][v];
          [...el.options].forEach(o => { if (o.dataset.t0 === undefined) o.dataset.t0 = o.textContent; const ok = !allow || allow.includes(o.value); o.hidden = !ok; o.disabled = !ok; o.textContent = allow ? o.dataset.t0.replace(/\s*\(.*\)\s*$/, '') : o.dataset.t0; });
          if (allow && !allow.includes(el.value)) { el.value = allow.find(a => el.value.startsWith(a)) || allow[0]; } }
      }
      setLabel(r, text);
    });
    // ช่องสั้นวางคู่กัน (ช่องที่เหลือเศษให้เต็มแถว)
    const rows = $$('#lbForm > .row').filter(r => r.style.display !== 'none'); let run = [];
    const flush = () => { if (run.length % 2) run.pop().classList.remove('half'); run = []; };
    rows.forEach(r => { const el = r.querySelector('[data-k]'), lb = r.querySelector('label'); const nx = r.nextElementSibling;
      const main = lb ? (lb.firstChild ? lb.firstChild.textContent : '') : '', hint = lb && lb.querySelector('.lh') ? lb.querySelector('.lh').textContent : '';
      const short = el && (el.tagName === 'SELECT' || (el.tagName === 'INPUT' && (el.type === 'color' || String(el.getAttribute('value') || '').length <= 9))) && main.length <= 24 && hint.length <= 30 && !(nx && nx.classList.contains('fnbox')) && !(el.tagName === 'SELECT' && [...el.options].some(o => (o.dataset.t0 || o.textContent).length > 22));
      r.classList.toggle('half', !!short); if (short) run.push(r); else flush(); });
    flush();
  }
  function title() {
    let t = $('#lbTitle'); const kinds = $('#lbKinds'); if (!kinds) return;
    if (!t) { t = document.createElement('div'); t.id = 'lbTitle'; kinds.after(t); }
    const L = LIB[libKind]; if (!L || !$('#lbForm [data-k]')) { t.innerHTML = ''; return; }
    const [a, b] = libNameParts(L.name); t.innerHTML = esc(a) + (b ? ` <small>${esc(b)}</small>` : '');
  }
  const _le = libEnhance;
  libEnhance = function () { const r = _le.apply(this, arguments); try { title(); layout(); } catch (e) { console.error('drawui', e); } return r; };
  const f = $('#lbForm'); if (f) f.addEventListener('change', e => { const W = (LIB[libKind] || {}).when || LIB_WHEN[libKind]; if (W && e.target.dataset && e.target.dataset.k === W.dep) { layout(); libPrev(); } });
  const _sc = showLibCat; showLibCat = function () { const r = _sc.apply(this, arguments); try { title(); } catch (e) { } return r; };
})();

/* ===================== ไฟล์ .npress: ดับเบิลคลิกในเครื่องแล้วเปิดใน Newton Press =====================
   ใช้ได้เมื่อติดตั้งแอปผ่าน Chrome / Edge (manifest มี file_handlers) · macOS ส่งไฟล์มาทาง launchQueue */
(function () {
  if (!('launchQueue' in window) || !window.launchQueue || typeof launchQueue.setConsumer !== 'function') return;
  launchQueue.setConsumer(async params => {
    const files = (params && params.files) || [];
    for (const h of files) {
      try {
        if (typeof lfOpenHandle === 'function') await lfOpenHandle(h);
        else { const f = await h.getFile(); const d = JSON.parse(await f.text()); if (!d.blocks) throw 0; doc = d; doc.settings = Object.assign(sampleDoc().settings, d.settings || {}); renderAll(); }
      } catch (e) { toast('เปิดไฟล์ไม่ได้: ' + ((e && e.message) || e)); }
    }
  });
})();
