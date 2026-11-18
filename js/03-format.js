'use strict';
/* ===================== จัดรูปแบบแบบ Pages: แถบรูปแบบข้อความ + แผงรูปแบบด้านขวา ===================== */
const SWATCH = ['#222222', '#401a01', '#713408', '#b8860b', '#d9682b', '#c0392b', '#a33a2a', '#1f4e9a', '#1f3864', '#2b7a8c', '#2e7d32', '#2e6b47', '#7b3fa0', '#7a7a7a', '#ffffff'];
const BGSWATCH = ['#fdf6ec', '#fce8de', '#fffbe6', '#eef6f1', '#eef4fb', '#fdeeee', '#f6f3ee', '#f3eef8', '#ffffff', '#401a01', '#713408'];
const HILITE = ['#fff3a3', '#ffd9b3', '#d4f5d4', '#d6e8ff', '#ffd6e0', '#e9dcff'];

function curEditable() {
  const s = getSelection(); if (!s.rangeCount) return null;
  const n = s.anchorNode && (s.anchorNode.nodeType === 1 ? s.anchorNode : s.anchorNode.parentElement);
  return n && n.closest ? n.closest('#flow [contenteditable="true"]') : null;
}
function restoreSel() { if (!curEditable() && lastRange) { const s = getSelection(); s.removeAllRanges(); s.addRange(lastRange); } }
function fmtDone() { const ed = curEditable(); if (ed) syncFrom(ed); }
function exec(cmd, val) {
  restoreSel(); document.execCommand('styleWithCSS', false, true); document.execCommand(cmd, false, val);
  if (cmd === 'foreColor' || cmd === 'removeFormat') { // สมการในส่วนที่เลือก → เปลี่ยนสีตามด้วย
    try { const s = getSelection(), ed = curEditable(); if (ed && s.rangeCount && !s.isCollapsed) { const r = s.getRangeAt(0); $$('.mx', ed).filter(m => r.intersectsNode(m)).forEach(m => { if (cmd === 'foreColor' && val) m.dataset.col = val; else delete m.dataset.col; m.style.color = m.dataset.col || ''; }); } } catch (e) { }
  }
  fmtDone();
}

/* ขนาดตัวอักษรของข้อความที่เลือก (หน่วย pt) */
function setFontSize(pt) {
  restoreSel(); const ed = curEditable(); if (!ed) { toast('เลือกข้อความที่จะเปลี่ยนขนาดก่อน'); return; }
  document.execCommand('styleWithCSS', false, false);
  document.execCommand('fontSize', false, '7');
  $$('font[size="7"]', ed).forEach(f => { const sp = document.createElement('span'); sp.style.fontSize = pt + 'pt'; sp.innerHTML = f.innerHTML; f.replaceWith(sp); });
  $$('span[style*="xxx-large"]', ed).forEach(sp => sp.style.fontSize = pt + 'pt');
  syncFrom(ed);
}
function stepFont(d) {
  const ed = curEditable() || (lastRange && (lastRange.startContainer.nodeType === 1 ? lastRange.startContainer : lastRange.startContainer.parentElement).closest('[contenteditable="true"]'));
  if (!ed) return;
  const n = getSelection().anchorNode; const e = n && (n.nodeType === 1 ? n : n.parentElement);
  const px = parseFloat(getComputedStyle(e || ed).fontSize); const pt = Math.round(px * 0.75 / (+$('#zoom').value || 1) * 10) / 10;
  const list = [8, 9, 10, 11, 12, 14, 16, 18, 20, 24, 28, 32, 36, 48, 60, 72];
  let i = list.findIndex(v => v > pt - 0.3); if (i < 0) i = list.length - 1;
  const nv = d > 0 ? list[Math.min(list.length - 1, list[i] > pt + 0.3 ? i : i + 1)] : list[Math.max(0, i - 1)];
  setFontSize(nv);
}
function colorMenu(menu, list, onPick, withNone, custom) {
  menu.innerHTML = `<div class="swgrid">${withNone ? '<button class="sw none" data-c="" title="ไม่มี"></button>' : ''}${list.map(c => `<button class="sw" data-c="${c}" style="background:${c}" title="${c}"></button>`).join('')}</div>` +
    (custom ? '<label class="cpick">สีอื่น ๆ <input type="color"></label>' : '');
  menu.addEventListener('mousedown', e => { if (e.target.tagName !== 'INPUT') e.preventDefault(); });
  menu.onclick = e => { const b = e.target.closest('button[data-c]'); if (!b) return; closeMenus(); onPick(b.dataset.c); };
  const inp = $('input[type=color]', menu); if (inp) inp.onchange = e => { closeMenus(); onPick(e.target.value); };
}
function initFormat() {
  // ขนาดตัวอักษร
  const fs = $('#fSize');
  fs.innerHTML = '<option value="">ขนาด</option>' + [8, 9, 10, 11, 12, 14, 16, 18, 20, 24, 28, 32, 36, 48, 60, 72].map(v => `<option value="${v}">${v} pt</option>`).join('');
  fs.addEventListener('mousedown', () => { const ed = curEditable(); if (ed) lastRange = getSelection().getRangeAt(0).cloneRange(); });
  fs.onchange = () => { if (fs.value) setFontSize(+fs.value); fs.value = ''; };
  $('#fBig').onmousedown = e => { e.preventDefault(); stepFont(1); };
  $('#fSmall').onmousedown = e => { e.preventDefault(); stepFont(-1); };
  $$('[data-x]').forEach(b => b.addEventListener('mousedown', e => {
    e.preventDefault(); const c = b.dataset.x;
    if (c === 'removeFormat') { exec('removeFormat'); const ed = curEditable(); if (ed) { $$('span[style]', ed).forEach(sp => { if (!sp.classList.contains('mx') && !sp.classList.contains('blank') && !sp.classList.contains('ic')) sp.replaceWith(...sp.childNodes); }); syncFrom(ed); } return; }
    exec(c);
  }));
  colorMenu($('#mFg'), SWATCH, c => exec('foreColor', c), false, true);
  colorMenu($('#mHi'), HILITE, c => exec('hiliteColor', c || 'transparent'), true, true);
  $('#fFg').addEventListener('mousedown', e => { e.preventDefault(); openMenuAt($('#mFg'), e.currentTarget); });
  $('#fHi').addEventListener('mousedown', e => { e.preventDefault(); openMenuAt($('#mHi'), e.currentTarget); });
  $('#fBlank').addEventListener('mousedown', e => {
    e.preventDefault(); restoreSel(); const ed = curEditable(); if (!ed) { toast('คลิกตำแหน่งในข้อความก่อน'); return; }
    const r = getSelection().getRangeAt(0); const sp = document.createElement('span'); sp.className = 'blank'; sp.setAttribute('contenteditable', 'false'); sp.dataset.w = '6';
    r.deleteContents(); r.insertNode(document.createTextNode(' ')); r.insertNode(sp); r.insertNode(document.createTextNode(' ')); syncFrom(ed);
  });
  $('#fNw').addEventListener('mousedown', e => {
    e.preventDefault(); restoreSel(); const ed = curEditable(); if (!ed) { toast('เลือกคำหรือวลีที่ไม่ต้องการให้ถูกตัดก่อน'); return; }
    const sl = getSelection(); const r = sl.getRangeAt(0);
    const inNw = (r.startContainer.nodeType === 1 ? r.startContainer : r.startContainer.parentElement).closest('.nw');
    if (inNw) { inNw.replaceWith(...inNw.childNodes); syncFrom(ed); toast('ยกเลิกไม่แยกคำแล้ว'); return; }
    if (r.collapsed) { toast('ลากเลือกคำหรือวลีก่อน แล้วกดปุ่มนี้'); return; }
    const sp = document.createElement('span'); sp.className = 'nw'; sp.appendChild(r.extractContents()); r.insertNode(sp);
    $$('.nw .nw', sp.parentElement).forEach(x => x.replaceWith(...x.childNodes)); syncFrom(ed);
  });
  $('#fBr').addEventListener('mousedown', e => { e.preventDefault(); restoreSel(); const ed = curEditable(); if (!ed) return; document.execCommand('insertLineBreak'); syncFrom(ed); });
  $('#bInsp').onclick = () => { document.body.classList.toggle('noinsp'); };
  buildInspector();
}
/* ช่องเติมคำ: คลิกเพื่อเปลี่ยนความยาว */
document.addEventListener('click', e => {
  const b = e.target.closest('#flow .blank'); if (!b) return;
  const seq = ['3', '6', '10', '16', '24']; b.dataset.w = seq[(seq.indexOf(b.dataset.w || '6') + 1) % seq.length];
  const ed = b.closest('[contenteditable="true"]'); if (ed) syncFrom(ed);
});

/* ---------------- แผงรูปแบบ ---------------- */
function buildInspector() { refreshInspector(); }
function stOf(b) { b.st = b.st || {}; return b.st; }
function targets(sameType) { const p = curId && byId(curId); const ids = selIds(); let L = ids.map(byId).filter(Boolean); if (!L.length && p) L = [p]; if (sameType && p) L = L.filter(b => b.t === p.t); return L; }
function setSt(k, v) {
  const L = targets(false); if (!L.length) return;
  L.forEach(b => { const st = stOf(b); if (v === '' || v === null || v === undefined) delete st[k]; else st[k] = v; if (!Object.keys(st).length) delete b.st; rerender(b.id); });
  changed(true); refreshInspector();
}
function setB(k, v, keepInsp) { const L = targets(true); if (!L.length) return; L.forEach(b => { if (v === undefined) delete b[k]; else b[k] = (v && typeof v === 'object') ? JSON.parse(JSON.stringify(v)) : v; rerender(b.id); }); changed(true); if (!keepInsp) refreshInspector(); }
const LABEL_TYPES = new Set(['idea', 'check', 'caution', 'solution', 'question', 'answer']);
function swRow(key, list, cur, none = true) {
  return `<div class="swgrid">${none ? `<button class="sw none${!cur ? ' on' : ''}" data-st="${key}" data-v="" title="ค่าเดิม"></button>` : ''}${list.map(c => `<button class="sw${cur === c ? ' on' : ''}" data-st="${key}" data-v="${c}" style="background:${c}"></button>`).join('')}<input type="color" data-stc="${key}" value="${/^#[0-9a-f]{6}$/i.test(cur || '') ? cur : '#713408'}" title="สีอื่น ๆ"></div>`;
}
function sel(attr, opts, cur) { return `<select ${attr}>${opts.map(([v, n]) => `<option value="${v}"${String(cur ?? '') === String(v) ? ' selected' : ''}>${n}</option>`).join('')}</select>`; }
function refreshInspector() {
  const P = $('#insp'); if (!P) return;
  const b = curId && byId(curId);
  if (!b) { P.innerHTML = '<h4>รูปแบบ</h4><p class="hint">คลิกที่บล็อกบนหน้ากระดาษเพื่อปรับสี ขนาด กรอบ และระยะห่าง</p>'; return; }
  const st = b.st || {};
  const nsel = selIds().length;
  let h = nsel > 1 ? `<h4>เลือกไว้ ${nsel} กล่อง</h4><div class="ir"><button class="tb" data-ctx="del">ลบทั้งหมด</button><button class="tb" data-ctx="dup">ทำซ้ำ</button><button class="tb" data-ctx="copy">คัดลอก</button><button class="tb" data-ctx="up">↑</button><button class="tb" data-ctx="down">↓</button></div><p class="hint">สีและขนาดด้านล่างจะใช้กับทุกกล่องที่เลือก</p>`
    : `<h4>รูปแบบ: ${esc(TYPES[b.t] || b.t)}${b.t === 'box' ? ' · ' + esc(BOXES[b.kind] || '') : ''}</h4>`;
  // เฉพาะชนิด
  if (b.t === 'box') h += `<div class="ir"><label>ชนิดกล่อง</label>${sel('data-b="kind"', Object.entries(BOXES), b.kind)}</div>`;
  if (b.t === 'problem') h += `<div class="ir"><label><input type="checkbox" data-bc="skill" ${b.skill !== undefined ? 'checked' : ''}> แสดงช่อง “ทักษะ”</label></div><div class="ir"><button class="tb" id="ppOpen">จัดหน้าข้อสอบ (ข้อต่อหน้า)…</button></div><div class="ir"><label>คะแนน (เว้นว่าง = ไม่แสดง)</label><input type="text" data-bt="pts" value="${esc(b.pts ?? '')}" style="width:70px"></div>`;
  if (b.t === 'work') h += `<div class="ir"><label><input type="checkbox" data-bc2="full" ${b.full ? 'checked' : ''}> ขยายเต็มที่เหลือของหน้า และขึ้นข้อถัดไปหน้าใหม่</label></div>`;
  if (b.t === 'asheet') h += `<div class="ir"><button class="tb" id="asEd">แก้กระดาษคำตอบ…</button></div><p class="hint">ใส่คำตอบที่ถูกในหน้าต่างแก้ไข จะได้ “กระดาษเฉลย” ที่ระบายไว้แล้ว</p>`;
  if (b.t === 'h3') h += `<div class="ir"><label>สีหัวข้อ</label>${sel('data-b="tone"', [['navy', 'น้ำเงิน (ขั้นที่ ...)'], ['gold', 'ทอง (แนวคิดหลัก)'], ['teal', 'เขียว (ตรวจคำตอบ)'], ['red', 'แดง'], ['brown', 'น้ำตาล']], b.tone || 'navy')}</div>`;
  if (b.t === 'answer') h += `<div class="ir"><label><input type="checkbox" data-bv="v" ${b.v === 'box' ? 'checked' : ''}> แสดงเป็นกล่อง “ตอบ”</label></div>`;
  if (b.t === 'soltitle') h += `<div class="ir"><button class="tb" id="cvLogo">เปลี่ยนโลโก้…</button></div>`;
  if (b.t === 'keytable' && b.mode === 'parts') h += `<div class="ir col"><label>หัวแถวของแต่ละตอน</label>${(b.parts || []).map((p, i) => `<div class="row" style="margin:2px 0;gap:4px"><input type="text" data-kpn="${i}" value="${esc(p.name)}" style="width:110px"><input type="text" data-kpp="${i}" value="${esc(String(p.pts))}" style="width:46px" title="คะแนน"><span class="hint">ข้อ ${p.from}–${p.to}</span></div>`).join('')}</div>`;
  if (b.t === 'keytable') h += `<div class="ir col"><label>คำตอบเรียงตามข้อ (คั่นด้วย , หรือเว้นวรรค)</label><input type="text" data-bt="key" value="${esc(b.key || '')}" style="max-width:260px;width:100%"></div><div class="ir"><label>เริ่มที่ข้อ</label><input type="number" data-bn="from" value="${b.from || 1}" min="1"></div><div class="ir"><label>ข้อต่อแถว</label><input type="number" data-bn="cols" value="${b.cols || 10}" min="3" max="15"></div>`;
  if (b.t === 'examcover') h += `<div class="ir"><button class="tb" id="cvLogo">เปลี่ยนโลโก้…</button></div>`;
  if (b.t === 'work') h += `<div class="ir"><label>ขนาดกรอบ</label>${sel('data-b="wmode"', [['fix', 'กำหนดความสูงเอง'], ['5', '5 ข้อต่อหน้า'], ['4', '4 ข้อต่อหน้า'], ['3', '3 ข้อต่อหน้า'], ['2', '2 ข้อต่อหน้า'], ['1', '1 ข้อต่อหน้า (เต็มหน้า)']], b.full ? '1' : b.share ? String(b.share) : 'fix')}</div><div class="ir"><button class="tb" id="ppOpen">จัดหน้าทุกข้อ…</button></div>`;
  if (b.t === 'work') h += `<div class="ir"><label>ความสูง (มม.)</label><input type="number" min="10" max="250" step="5" data-bn="h" value="${b.h || 40}"></div>
    <div class="ir"><label><input type="checkbox" data-bnot="nolab" ${b.nolab ? '' : 'checked'}> แสดงคำว่า “พื้นที่สำหรับทด”</label></div>
    <div class="ir"><label><input type="checkbox" data-bc2="ans" ${b.ans ? 'checked' : ''}> เส้น “คำตอบ ......” ใต้กรอบ</label></div>
    <div class="ir"><label>ข้อความในกรอบ</label><input type="text" data-bt="wl" value="${esc(b.wl || 'พื้นที่สำหรับทด')}"></div>`;
  if (b.t === 'choices') h += `<div class="ir"><label>จำนวนคอลัมน์</label>${sel('data-b="cols"', [['', 'อัตโนมัติ'], ['1', '1'], ['2', '2'], ['3', '3'], ['4', '4'], ['5', '5']], b.cols || '')}</div>
    <div class="ir"><label>จำนวนตัวเลือก</label>${sel('data-b="nch"', [['4', '4'], ['5', '5']], (b.items || []).length || 5)}</div>
    <div class="ir"><label>รูปแบบเลขข้อ</label>${sel('data-b="cf"', [['(1)', '(1) (2)'], ['ก.', 'ก. ข.'], ['a)', 'a) b)'], ['A.', 'A. B.']], b.cf || '(1)')}</div>`;
  if (b.t === 'image') h += `<div class="ir"><button class="tb" id="imgRep">เปลี่ยนรูป…</button></div>`;
  if (b.t === 'people') h += `<div class="ir"><label>คนต่อแถว</label>${sel('data-b="cols"', [['2', '2'], ['3', '3'], ['4', '4']], b.cols || 3)}</div><div class="ir"><button class="tb" data-act2="padd">+ เพิ่มคน</button><button class="tb" data-act2="pdel">− ลบคนสุดท้าย</button><button class="tb" data-act2="pnoimg">ใช้ภาพสัญลักษณ์ทั้งหมด</button></div><p class="hint">คลิกที่ภาพเพื่อใส่รูปจริง</p>`;
  if (b.t === 'figure' && b.lib) h += `<div class="ir"><button class="tb" id="libEd">แก้ค่าของรูป…</button></div>`;
  if (b.t === 'divide') h += `<div class="ir"><button class="tb" id="dvEd">แก้ตัวเลข / ชนิดการหาร…</button></div>`;
  if (b.t === 'figure' || b.t === 'image') h += `<div class="ir"><label>ความกว้าง ${b.w || 60}%</label><input type="range" min="15" max="100" step="5" data-bn="w" value="${b.w || 60}"></div>`;
  if (typeof extInspector === 'function') h += extInspector(b);
  if (b.t === 'lines') h += `<div class="ir"><label>จำนวนบรรทัด</label><input type="number" min="1" max="40" data-bn="n" value="${b.n || 4}"></div>
    <div class="ir"><label>ระยะบรรทัด (มม.)</label><input type="number" min="5" max="20" data-bn="gap" value="${b.gap || 9}"></div>
    <div class="ir"><label><input type="checkbox" data-bc2="dash" ${b.dash ? 'checked' : ''}> เส้นประ</label></div>`;
  if (b.t === 'cover') h += `<div class="ir"><label>สีพื้นหลังปก</label>${swRowB('ca', ['#401a01', '#1f3864', '#1d4d2f', '#43204f', '#134e57', '#7a2e12'], b.ca)}</div>
    <div class="ir"><label>สีไล่ระดับ</label>${swRowB('cb', ['#713408', '#2e5597', '#2e6b47', '#6a3a7a', '#1f6f7a', '#b8860b'], b.cb)}</div>
    <div class="ir"><label>จำนวนวงกลมสูตร</label>${sel('data-b="circles"', [['0', 'ไม่มี'], ['2', '2'], ['3', '3'], ['4', '4']], b.circles ?? 4)}</div>
    <div class="ir"><button class="tb" id="cvLogo">เปลี่ยนโลโก้…</button></div>`;
  if (b.t === 'chapter') h += `<div class="ir"><label>สีแถบหัวบท</label>${swRowB('ca', ['#401a01', '#1f3864', '#1d4d2f', '#43204f', '#134e57', '#c0392b'], b.ca)}</div>`;
  if (b.t === 'activity') h += `<div class="ir"><label>สัญลักษณ์</label>${sel('data-b="icon"', [['♟', '♟ คน'], ['✎', '✎ ดินสอ'], ['★', '★ ดาว'], ['⚑', '⚑ ธง'], ['◆', '◆'], ['', 'ไม่มี']], b.icon ?? '♟')}</div>`;
  if (LABEL_TYPES.has(b.t)) h += `<div class="ir"><label>ข้อความป้าย</label><input type="text" data-stt="lt" value="${esc(st.lt || LABELS[b.t])}"></div>`;
  // ข้อความ
  h += `<div class="sec">ข้อความทั้งบล็อก</div>
    <div class="ir"><label>ขนาด</label>${sel('data-stn="fs"', [['', '100%'], ['0.8', '80%'], ['0.9', '90%'], ['1.1', '110%'], ['1.2', '120%'], ['1.35', '135%'], ['1.5', '150%'], ['1.75', '175%'], ['2', '200%'], ['2.5', '250%'], ['3', '300%']], st.fs || '')}</div>
    <div class="ir col"><label>สีตัวอักษร</label>${swRow('fg', SWATCH, st.fg)}</div>
    <div class="ir col"><label>สีป้าย/หัวเรื่อง</label>${swRow('lab', SWATCH, st.lab)}</div>
    <div class="ir"><label>จัดแนว</label><span class="seg">${[['', 'เดิม'], ['left', '⟸'], ['center', '≡'], ['right', '⟹'], ['justify', '☰']].map(([v, n]) => `<button class="${(st.al || '') === v ? 'on' : ''}" data-st="al" data-v="${v}" title="${{ '': 'ค่าเดิม', left: 'ชิดซ้าย', center: 'กึ่งกลาง', right: 'ชิดขวา', justify: 'เต็มบรรทัด' }[v]}">${n}</button>`).join('')}</span></div>`;
  // กรอบ
  h += `<div class="sec">พื้นและกรอบ</div>
    <div class="ir col"><label>สีพื้น</label>${swRow('bg', BGSWATCH, st.bg)}</div>
    <div class="ir col"><label>สีกรอบ</label>${swRow('bd', SWATCH, st.bd)}</div>
    <div class="ir"><label>ความหนากรอบ</label>${sel('data-stn="bw"', [['', 'เดิม'], ['0', 'ไม่มีกรอบ'], ['1', '1 px'], ['1.5', '1.5 px'], ['2', '2 px'], ['3', '3 px']], st.bw ?? '')}</div>
    <div class="ir"><label>ลายเส้น</label>${sel('data-sts="bs"', [['', 'เดิม'], ['solid', 'เส้นทึบ'], ['dashed', 'เส้นประ'], ['dotted', 'จุด'], ['double', 'เส้นคู่']], st.bs || '')}</div>
    <div class="ir"><label>มุมโค้ง</label>${sel('data-stn="rad"', [['', 'เดิม'], ['0', 'เหลี่ยม'], ['4', '4'], ['8', '8'], ['12', '12'], ['18', '18']], st.rad ?? '')}</div>`;
  // ระยะ
  h += `<div class="sec">ระยะห่าง</div>
    <div class="ir"><label>เว้นด้านบน</label>${sel('data-stn="mt"', [['', '0'], ['4', 'นิดหน่อย'], ['10', 'ปานกลาง'], ['20', 'มาก'], ['40', 'มากที่สุด']], st.mt || '')}</div>
    <div class="ir"><label>เว้นด้านล่าง</label>${sel('data-stn="mb"', [['', '0'], ['4', 'นิดหน่อย'], ['10', 'ปานกลาง'], ['20', 'มาก'], ['40', 'มากที่สุด']], st.mb || '')}</div>
    <div class="ir"><label>ย่อหน้าซ้าย</label>${sel('data-stn="ml"', [['', 'เดิม'], ['0', 'ชิดขอบ'], ['29', '1 ระดับ'], ['58', '2 ระดับ'], ['87', '3 ระดับ']], st.ml ?? '')}</div>`;
  h += `<div class="sec"></div><div class="ir"><button class="tb" id="stReset">ล้างรูปแบบบล็อกนี้</button><button class="tb" id="stAll" title="ใช้รูปแบบเดียวกันกับบล็อกชนิดนี้ทุกบล็อก">ใช้กับ “${esc(TYPES[b.t])}” ทั้งหมด</button></div>`;
  P.innerHTML = h;
  P.onclick = e => {
    const cx = e.target.closest('[data-ctx]'); if (cx) { ctxAction(cx.dataset.ctx); return; }
    const x = e.target.closest('[data-st]'); if (x) { setSt(x.dataset.st, x.dataset.v); return; }
    const y = e.target.closest('[data-stb]'); if (y) { setB(y.dataset.stb, y.dataset.v || undefined); return; }
    if (e.target.id === 'stReset') { delete b.st; rerender(b.id); changed(true); refreshInspector(); }
    if (e.target.id === 'stAll') { let n = 0; doc.blocks.forEach(o => { if (o.t === b.t && o !== b && (b.t !== 'box' || o.kind === b.kind)) { if (b.st) o.st = JSON.parse(JSON.stringify(b.st)); else delete o.st; n++; } }); renderAll(); changed(true); toast(`ใช้รูปแบบกับอีก ${n} บล็อกแล้ว`); }
    if (e.target.id === 'cvLogo') pickLogo('โลโก้ของกล่องนี้', d => setB('logo', d || undefined));
    if (e.target.id === 'imgRep') { imgReplace = b.id; $('#imgIn').click(); }
    if (e.target.id === 'dvEd') openDivision(b.id);
    if (e.target.id === 'libEd') openLibrary(b.id);
    if (e.target.id === 'asEd') openAnswerSheet(b.id);
    if (e.target.id === 'ppOpen') openPagePlan();
    const a2 = e.target.closest('[data-act2]'); if (a2) { if (a2.dataset.act2 === 'pnoimg') { b.items.forEach(it => delete it.img); rerender(b.id); changed(true); } else blockAction(a2.dataset.act2, b.id, a2); }
  };
  P.onchange = e => {
    const t = e.target, d = t.dataset;
    if (d.stc) setSt(d.stc, t.value);
    else if (d.stcb) setB(d.stcb, t.value);
    else if (d.stn !== undefined) setSt(d.stn, t.value === '' ? '' : +t.value);
    else if (d.sts !== undefined) setSt(d.sts, t.value);
    else if (d.stt !== undefined) setSt(d.stt, t.value.trim() === (LABELS[b.t] || '') ? '' : t.value.trim());
    else if (d.bn !== undefined) setB(d.bn, +t.value);
    else if (d.bt !== undefined) setB(d.bt, t.value);
    else if (d.bc !== undefined) setB(d.bc, t.checked ? (b[d.bc] || 'ทักษะ: ') : undefined);
    else if (d.kpn !== undefined || d.kpp !== undefined) { const i = +(d.kpn ?? d.kpp); b.parts[i][d.kpn !== undefined ? 'name' : 'pts'] = t.value; rerender(b.id); changed(true); }
    else if (d.bv !== undefined) setB(d.bv, t.checked ? 'box' : undefined);
    else if (d.bc2 !== undefined) setB(d.bc2, t.checked ? true : undefined);
    else if (d.bnot !== undefined) setB(d.bnot, t.checked ? undefined : true);
    else if (d.b === 'cols') setB('cols', t.value ? +t.value : undefined);
    else if (d.b === 'nch') { const n = +t.value; b.items = (b.items || []).slice(0, n); while (b.items.length < n) b.items.push(''); setB('items', b.items); }
    else if (d.b === 'circles') setB('circles', +t.value);
    else if (d.b === 'wmode') { const v = t.value; targets(true).forEach(x => { delete x.share; delete x.full; if (v === '1') { x.full = true; x.wl = x.wl || 'พื้นที่แสดงวิธีทำ / พื้นที่สำหรับทด'; } else if (v !== 'fix') x.share = +v; rerender(x.id); }); changed(true); refreshInspector(); }
    else if (d.b) setB(d.b, t.value);
  };
  P.oninput = e => { const t = e.target; if (t.type === 'range' && t.dataset.bn) { b[t.dataset.bn] = +t.value; rerender(b.id); changed(); t.previousElementSibling.textContent = `ความกว้าง ${t.value}%`; } };
}
function swRowB(key, list, cur) {
  return `<div class="swgrid">${list.map(c => `<button class="sw${cur === c ? ' on' : ''}" data-stb="${key}" data-v="${c}" style="background:${c}"></button>`).join('')}<input type="color" data-stcb="${key}" value="${cur || list[0]}"></div>`;
}
$('#logoIn').onchange = e => {
  const f = e.target.files[0]; if (!f) return; const rd = new FileReader();
  readImage(f).then(d => setB('logo', d)); e.target.value = '';
};

/* ---------------- แม่แบบเอกสารทั้งเล่ม ---------------- */
function mxs(t, d) { return `<span class="mx" contenteditable="false" data-tex="${esc(t)}"${d ? ' data-disp="1"' : ''}></span>`; }
const DOC_TEMPLATES = [
  ['แบบฝึกทักษะ', 'ปก · คำชี้แจง · ทดสอบก่อนเรียน · กิจกรรม · แบบฝึกระดับ 1–3', () => ({
    settings: { name: 'แบบฝึกทักษะ', hl: 'แบบฝึกทักษะ เรื่อง ...', hr: 'คณิตศาสตร์เพิ่มเติม ม.5', size: 'book' },
    blocks: [newBlock('cover'),
      newBlock('section', { html: 'ทดสอบความพร้อมก่อนเรียน' }),
      newBlock('box', { kind: 'inst', title: '', html: '<b>คำชี้แจง</b> ทำแบบทดสอบนี้ เพื่อตรวจว่าความรู้พื้นฐานพร้อมสำหรับหน่วยนี้หรือไม่ ข้อที่ทำไม่ได้ให้ทบทวนเรื่องที่ระบุไว้ก่อนเริ่มเรียน' }),
      newBlock('problem', { html: 'ข้อ 1', skill: 'ทักษะ: ' }), newBlock('given', { html: `ให้ ${mxs('A')} และ ${mxs('B')} เป็นเซตจำกัด` }), newBlock('question', { html: 'จงหา ...' }), newBlock('work', { h: 30, ans: true }),
      newBlock('section', { html: '1.1 ชื่อหัวข้อ' }),
      newBlock('para', { html: 'เนื้อหา...' }),
      newBlock('activity', { html: 'กิจกรรมที่ 1.1.1 ชื่อกิจกรรม' }), newBlock('para', { html: 'สถานการณ์...' }), newBlock('question', { html: '(ก) ...<br>(ข) ...' }), newBlock('work', { h: 35 }), newBlock('actend'),
      newBlock('box', { kind: 'write', html: '(ก) ...<br>(ข) ...' }), newBlock('lines', { n: 3 }),
      newBlock('box', { kind: 'key', title: 'บทสรุป: ...', html: '1) ...<br>2) ...' }),
      newBlock('section', { html: 'แบบฝึกทักษะ 1.1' }), newBlock('subsection', { html: 'ระดับ 1 ใช้สูตรหรือบทนิยามแทนค่าได้โดยตรง' }),
      newBlock('problem', { html: 'ข้อ 1' }), newBlock('given', { html: 'โจทย์...' }), newBlock('question', { html: 'จงหา...' }), newBlock('work', { h: 35 }),
      newBlock('problem', { html: 'ข้อ 2' }), newBlock('given', { html: 'โจทย์...' }), newBlock('question', { html: 'ข้อใดถูกต้อง' }), newBlock('choices'), newBlock('work', { h: 30 }),
    ],
  })],
  ['ตำรา / บทเรียน', 'หัวบท · สิ่งที่จะได้เรียน · หลักการ · ตัวอย่างพร้อมวิธีทำ · ฝึกทันที', () => ({
    settings: { name: 'บทเรียน', hl: 'ชื่อหนังสือ', hr: 'Earth & Newton Education', size: 'book' },
    blocks: [newBlock('chapter', { num: 'บทที่ 1', title: 'ชื่อบท', sub: 'ประโยคเดียวบอกว่าบทนี้จะได้อะไร' }),
      newBlock('box', { kind: 'key', title: 'สิ่งที่จะได้เรียนในบทนี้', html: '• ...<br>• ...<br>• ...' }),
      newBlock('section', { html: '1.1 ชื่อหัวข้อ' }), newBlock('para', { html: 'เริ่มจากโจทย์เล็กที่นับมือได้...' }),
      newBlock('box', { kind: 'thm', title: 'หลักการ', html: `ถ้า ... แล้ว ${mxs('\\frac{a}{b}', 1)}` }),
      newBlock('problem', { html: 'ตัวอย่างที่ 1.1' }), newBlock('given', { html: 'โจทย์...' }), newBlock('question', { html: 'จงหา...' }), newBlock('idea'), newBlock('solution'), newBlock('check'), newBlock('answer'),
      newBlock('problem', { html: 'ฝึกทันที 1.1' }), newBlock('given', { html: 'โจทย์...' }), newBlock('question', { html: 'จงหา...' }), newBlock('work', { h: 25 }),
      newBlock('box', { kind: 'warn', title: 'ข้อผิดพลาดที่พบบ่อย', html: '...' }),
    ],
  })],
  ['เฉลยละเอียดแบบฝึก', 'ป้ายข้อ · โจทย์ · แนวคิด · วิธีทำ · ตรวจคำตอบ · ข้อควรระวัง · ตอบ', () => ({
    settings: { name: 'เฉลยละเอียด', hl: 'เฉลยแบบฝึกทักษะ เรื่อง ...', hr: 'Earth & Newton Education', size: 'book' },
    blocks: [newBlock('chapter', { num: 'เฉลยละเอียด', title: 'ชื่อเรื่อง', sub: '' }), newBlock('section', { html: 'แบบฝึกทักษะ 1.1' }),
      newBlock('problem', { html: 'ข้อ 1' }), newBlock('given', { html: 'โจทย์...' }), newBlock('question', { html: 'จงหา...' }), newBlock('idea'), newBlock('solution'), newBlock('check'), newBlock('caution'), newBlock('answer')],
  })],
  ['สร้างชุดข้อสอบ (ปก ตอน ข้อ กระดาษคำตอบ)', 'A-Level · แนวสมาคมฯ · PMC · NETSAT · ชุดเก็ง · กลางภาค หรือกำหนดเองทั้งหมด', 'EXAM'],
  ['เฉลยข้อสอบแนวสมาคมฯ (แบบชุด L)', 'หัวเฉลยมีโลโก้ · สรุปคำตอบแยกตอน · ข้อละหน้า แถบ ข้อ · คะแนน · คำตอบ · ทวนโจทย์ · แนวคิดหลัก · ขั้นที่ · ข้อควรระวัง · ตรวจ · ตอบ', 'SOLASSOC'],
  ['เฉลยข้อสอบละเอียด', 'สรุปคำตอบ · ข้อละหน้า · หัวแถบ ข้อ · คะแนน · คำตอบ · ทวนโจทย์ · ขั้นตอน · ตรวจ · ตอบ', () => ({
    settings: { name: 'เฉลยข้อสอบ', hl: 'เฉลยละเอียด ...', hr: 'Earth & Newton Education', size: 'exam', bmq: false },
    blocks: [newBlock('chapter', { num: 'เฉลยละเอียด', title: 'ชื่อชุดข้อสอบ', sub: '' }), newBlock('keytable', { key: '', cols: 10 }),
      ...[1, 2].flatMap(n => [newBlock('solhead', { num: 'ข้อ ' + n, pts: '3', ans: '' }), newBlock('box', { kind: 'plain', title: 'โจทย์', html: '' }), newBlock('idea', { st: { lt: 'แนวคิดหลัก' } }), newBlock('para', { html: '• สิ่งที่โจทย์ให้มา: <br>• สิ่งที่ต้องหา: ' }), newBlock('solution', { st: { lt: 'ขั้นที่ 1 ...' } }), newBlock('solution', { st: { lt: 'ขั้นที่ 2 ...' } }), newBlock('solution', { st: { lt: 'ขั้นที่ 3 ...' } }), newBlock('caution'), newBlock('check'), newBlock('answer')])],
  })],
  ['กระดาษคำตอบอย่างเดียว', 'เลือกแบบสำเร็จรูป หรือกำหนดจำนวนข้อ ชนิด และหลักตัวเลขเอง', 'ASHEET'],
  ['หน้าว่าง', 'เริ่มจากย่อหน้าว่าง', () => ({ settings: { name: 'เอกสารใหม่' }, blocks: [newBlock('para', { html: '' })] })],
];
function openTemplates() {
  const box = $('#tplList');
  box.innerHTML = DOC_TEMPLATES.map(([n, d], i) => `<button class="tplc" data-i="${i}"><b>${n}</b><span>${d}</span></button>`).join('');
  box.onclick = async e => {
    const b = e.target.closest('.tplc'); if (!b) return;
    closeDlg('#dTpl');
    const f = DOC_TEMPLATES[+b.dataset.i][2];
    if (f === 'EXAM') { openExamBuilder(); return; }
    if (f === 'LESSON') { openLessonPlan(); return; }
    if (f === 'PROJECT') { openProject(); return; } if (f === 'MEMO') { openMemo(); return; } if (f === 'PLANCOVER') { openPlanCover(); return; } if (f === 'SYLLABUS') { openSyllabus(); return; } if (f === 'EXCOVER') { openExamCover(); return; } if (f === 'MIDFINAL') { openExamBuilder(); $('#ebPreset').value = 'midfinal'; ebLoad('midfinal'); return; }
    if (f === 'QUIZ') { openExamBuilder(); $('#ebPreset').value = 'quiz'; ebLoad('quiz'); return; }
    if (f === 'SOLASSOC') { openExamBuilder(); $('#ebPreset').value = 'assoc'; ebLoad('assoc'); return; }
    if (f === 'ASHEET') { doc = { app: 'en-editor', v: 2, settings: Object.assign({}, doc.settings, { name: 'กระดาษคำตอบ' }), blocks: [] }; doc.blocks = [newBlock('asheet')]; curId = null; renderAll(); changed(true); openAnswerSheet(doc.blocks[0].id); return; }
    const t = f();
    doc = { app: 'en-editor', v: 2, settings: Object.assign({}, doc.settings, t.settings), blocks: [] };
    doc.blocks = t.blocks; curId = null; renderAll(); changed(true); refreshInspector();
    $('#scroller').scrollTop = 0;
  };
  openDlg('#dTpl');
}

