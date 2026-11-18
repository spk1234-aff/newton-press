'use strict';
/* ===================== เล่มโครงงาน · บันทึกข้อความ · ปกแผน · กำหนดการสอน ===================== */
Object.assign(TYPES, { pjcover: 'หน้าปก (โครงงาน / แผน / กำหนดการ)', pjch: 'หัวบท / หัวหน้า (กึ่งกลาง)', pjsec: 'หัวข้อ 1.1 (ตัวหนา)', pjtext: 'ย่อหน้า (เยื้องบรรทัดแรก)', pjinfo: 'ตารางข้อมูล (ชื่อโครงงาน ผู้จัดทำ ...)', toc: 'สารบัญอัตโนมัติ', memohead: 'หัวบันทึกข้อความ (ครุฑ)', memocmt: 'ช่องความเห็น / ลงนาม', cshead: 'หัวรายวิชา (รหัส ชั้น เวลา หน่วยกิต)', signln: 'บรรทัดลงชื่อ (ลงชื่อ ...... ตำแหน่ง)' });
FULLPAGE.add('pjcover'); OUT_LV.pjch = 1; OUT_LV.pjsec = 2; OUT_LV.memohead = 1; OUT_LV.pjcover = 0; ['pjch', 'pjsec'].forEach(t => HEADINGS.add(t));
let SCHOOL = 'โรงเรียนโซ่พิสัยพิทยาคม', AMPHOE = 'อำเภอโซ่พิสัย จังหวัดบึงกาฬ', AFF = 'สำนักงานเขตพื้นที่การศึกษามัธยมศึกษาบึงกาฬ';
const PPL = { me: ['นายศาสตราวุฒิ อาชนะชัย', 'ครู'], head: ['นางสาวอำไพ จิตวิขาม', 'หัวหน้ากลุ่มสาระการเรียนรู้คณิตศาสตร์'], acad: ['นางพานิชย์ ปัดถาทุม', 'หัวหน้ากลุ่มงานบริหารงานวิชาการ'], dep: ['นายทรงศักดิ์ สิงหนสาย', 'รองผู้อำนวยการกลุ่มบริหารวิชาการ'], hr: ['นางประภัสสร จันทร์เภา', 'รองผู้อำนวยการกลุ่มบริหารงานบุคคล'], dir: ['นายโชคชัย ชินโณ', 'ผู้อำนวยการ' + SCHOOL] };
const TAB = '<span class="tab">\t</span>​';
const logoOf = v => !v ? '' : v.startsWith('data:') ? v : (LOGOS[v] || '');
const _extNewP = extNewBlock;
extNewBlock = function (b) {
  _extNewP(b);
  if (b.t === 'pjcover') Object.assign(b, { kick: 'โครงงานคณิตศาสตร์', title: 'เรื่อง ...', by: 'โดย', stu: `1. ...${TAB}...<br>2. ...${TAB}...`, advl: 'อาจารย์ที่ปรึกษาโครงงาน', adv: `1. ...${TAB}...`, school: SCHOOL, aff: 'สังกัด' + AFF, note: '' });
  if (b.t === 'pjch') Object.assign(b, { num: 'บทที่ 1', title: 'บทนำ' });
  if (b.t === 'pjsec') b.html = '1.1 หัวข้อ';
  if (b.t === 'pjtext') b.html = '';
  if (b.t === 'pjinfo') Object.assign(b, { n: 4, l0: 'ชื่อโครงงาน', l1: 'ผู้จัดทำโครงงาน', l2: 'ครูที่ปรึกษาโครงงาน', l3: 'ระดับชั้น' });
  if (b.t === 'memohead') Object.assign(b, { ttl: 'บันทึกข้อความ', org: SCHOOL + '  ' + AMPHOE, no: 'ศธ ๐๔๓๑๒.๐๓/', date: '', subj: '' });
  if (b.t === 'memocmt') Object.assign(b, { n: 2, dl: 2, t0: 'ความเห็นของ ...', name0: '(..............................................)', pos0: 'ตำแหน่ง', t1: 'ความเห็นของผู้อำนวยการโรงเรียน', ck1: '☐ อนุมัติ' + '&nbsp;'.repeat(10) + '☐ ไม่อนุมัติ', name1: `(${PPL.dir[0]})`, pos1: PPL.dir[1] });
  if (b.t === 'cshead') Object.assign(b, { ttl: 'คำอธิบายรายวิชา', a0: 'รายวิชา ... รหัสวิชา ...', m0: '', z0: '', a1: 'กลุ่มสาระการเรียนรู้คณิตศาสตร์', m1: '', z1: 'ชั้นมัธยมศึกษาปีที่ ...', a2: 'เวลา ... ชั่วโมง', m2: '', z2: 'จำนวน ... หน่วยกิต' });
  if (b.t === 'signln') Object.assign(b, { name: '(..............................................)', role: 'ตำแหน่ง', date: '' });
};
const _extHTMLP = extBlockHTML;
extBlockHTML = function (b) {
  const r = _extHTMLP(b); if (r) return r;
  const E = (f, ph, cls = '') => `<div class="${cls}" contenteditable="true" data-f="${f}" data-ph="${ph}"></div>`;
  switch (b.t) {
    case 'pjcover': { const lg = [logoOf(b.lg), logoOf(b.lg2)].filter(Boolean); lg.forEach(cachePng);
      return `<div class="b-pjcover${b.ctr ? ' ctr' : ''}${b.std ? ' std' : ''}">${lg.length ? `<div class="pc-lg">${lg.map(s => `<img src="${s}" alt="">`).join('')}</div>` : ''}${E('kick', 'ชื่อเอกสาร', 'pc-k')}${E('title', 'เรื่อง / รายวิชา ...', 'pc-t')}${E('by', 'โดย', 'pc-by')}<div class="pc-l">${E('stu', 'รายชื่อ')}</div>${E('advl', '(หัวข้อรอง)', 'pc-by')}<div class="pc-l">${E('adv', 'รายชื่อ')}</div><div class="pc-sp"></div>${E('school', 'โรงเรียน', 'pc-s')}${E('aff', 'สังกัด', 'pc-s')}<div class="pc-sp"></div>${E('note', 'ข้อความท้ายปก', 'pc-n')}</div>`; }
    case 'pjch': return `<div class="b-pjch">${E('num', '', 'pj-n')}${E('title', 'ชื่อบท', 'pj-t')}</div>`;
    case 'pjsec': return `<div class="b-pjsec${b.sub ? ' sub' : ''}" contenteditable="true" data-f="html" data-ph="1.1 หัวข้อ"></div>`;
    case 'pjtext': return `<div class="b-pjtext${b.hang ? ' hang' : ''}${b.noind ? ' noind' : ''}" contenteditable="true" data-f="html" data-ph="พิมพ์ข้อความ..."></div>`;
    case 'pjinfo': { const n = Math.max(1, Math.min(12, +b.n || 4)); return `<div class="b-pjinfo">${Array.from({ length: n }, (_, i) => `<div class="pi-r">${E('l' + i, 'หัวข้อ', 'pi-l')}${E('v' + i, 'ข้อมูล', 'pi-v')}</div>`).join('')}</div>`; }
    case 'toc': return `<div class="b-toc"><div class="toc-h"><span>เรื่อง</span><span>หน้า</span></div><div class="toc-body"><div class="hint">สารบัญจะสร้างให้อัตโนมัติจากหัวบทและหัวข้อด้านล่าง</div></div></div>`;
    case 'memohead': return `<div class="b-memohead"><div class="mh-top"><img class="mh-g" src="${GARUDA}" alt="">${E('ttl', 'บันทึกข้อความ', 'mh-t')}</div>
      <div class="mh-r"><b>ส่วนราชการ</b>${E('org', 'ส่วนราชการ', 'mh-v')}</div><div class="mh-r"><b>ที่</b>${E('no', 'ศธ ...', 'mh-v')}<b>วันที่</b>${E('date', 'วัน เดือน ปี', 'mh-v')}</div><div class="mh-r"><b>เรื่อง</b>${E('subj', 'เรื่อง', 'mh-v')}</div></div>`;
    case 'memocmt': { const n = Math.max(1, Math.min(6, +b.n || 2)), dl = Math.max(0, Math.min(4, b.dl ?? 2));
      return `<div class="b-memocmt${b.one ? ' one' : ''}">${Array.from({ length: n }, (_, i) => `<div class="mc">${E('t' + i, 'หัวข้อความเห็น (เว้นว่างได้)', 'mc-t')}${E('ck' + i, 'ตัวเลือก ☐ / ✓ (เว้นว่างได้)', 'mc-ck')}${'<div class="mc-d"></div>'.repeat(dl)}<div class="mc-sig">ลงชื่อ</div>${E('name' + i, '(ชื่อ – สกุล)', 'mc-n')}${E('pos' + i, 'ตำแหน่ง', 'mc-p')}${E('dt' + i, 'วันที่ (เว้นว่างได้)', 'mc-p')}</div>`).join('')}</div>`; }
    case 'cshead': return `<div class="b-cshead">${E('ttl', 'หัวเรื่อง', 'cs-t')}${[0, 1, 2].map(i => `<div class="cs-r">${E('a' + i, '')}${E('m' + i, '')}${E('z' + i, '')}</div>`).join('')}</div>`;
    case 'signln': return `<div class="b-signln"><div class="sl-r"><span>ลงชื่อ</span><span class="sl-d"></span>${E('role', 'ตำแหน่ง', 'sl-role')}</div>${E('name', '(ชื่อ – สกุล)', 'sl-n')}${E('date', 'วันที่ (เว้นว่างได้)', 'sl-n')}</div>`;
  }
  return '';
};
const _extInspP = extInspector;
extInspector = function (b) {
  let h = _extInspP(b); const num = (k, lab, v, mn, mx) => `<div class="ir"><label>${lab}</label><input type="number" min="${mn}" max="${mx}" data-bn="${k}" value="${v}"></div>`, ck = (k, lab) => `<div class="ir"><label><input type="checkbox" data-bc2="${k}" ${b[k] ? 'checked' : ''}> ${lab}</label></div>`;
  if (b.t === 'pjsec') h += ck('sub', 'หัวข้อย่อย (เยื้อง เช่น 1.2.1)');
  if (b.t === 'pjtext') h += ck('noind', 'ไม่เยื้องบรรทัดแรก') + ck('hang', 'ย่อหน้าแบบบรรณานุกรม (บรรทัดถัดไปเยื้อง)');
  if (b.t === 'pjinfo') h += num('n', 'จำนวนแถว', b.n || 4, 1, 12);
  if (b.t === 'memocmt') h += num('n', 'จำนวนช่องลงนาม', b.n || 2, 1, 6) + num('dl', 'บรรทัดจุดสำหรับเขียนความเห็น', b.dl ?? 2, 0, 4) + ck('one', 'เรียงช่องเดียว (ไม่แบ่ง 2 คอลัมน์)') + `<p class="hint" style="font-size:14px">พิมพ์ ☐ หรือ ✓ ในช่องตัวเลือกได้เลย เช่น “✓ เห็นควรอนุญาต” · “☐ อนุมัติ ☐ ไม่อนุมัติ”</p>`;
  if (b.t === 'pjcover') h += ck('ctr', 'รายชื่อจัดกึ่งกลาง (ไม่ใช้ตำแหน่งแท็บ)') + `<div class="ir"><button class="tb" onclick="pickLogo('ตราด้านซ้าย', d => { const x = byId('${b.id}'); x.lg = d || ''; rerender(x.id); changed(true); })">ตรา 1</button><button class="tb" onclick="pickLogo('ตราที่ 2', d => { const x = byId('${b.id}'); x.lg2 = d || ''; rerender(x.id); changed(true); })">ตรา 2</button><button class="tb" onclick="const x = byId('${b.id}'); x.lg = x.lg2 = ''; rerender(x.id); changed(true)">ไม่มีตรา</button></div>`;
  if (b.t === 'pjch') h += `<div class="ir"><button class="tb" onclick="doc.settings.pnAnchor='${b.id}'; applySettings(); changed(true); toast('เริ่มนับหน้า 1 ที่หน้านี้แล้ว')">เริ่มนับเลขหน้า 1 ที่หน้านี้</button></div>`;
  if (b.t === 'toc') h += `<p class="hint" style="font-size:14px">ดึงจาก “หัวบท / หัวหน้า” และ “หัวข้อ 1.1” ที่อยู่ถัดจากสารบัญ เลขหน้าตามการนับจริง</p>` + ck('nosub', 'ไม่แสดงหัวข้อย่อย (1.1)');
  return h;
};
/* ---------- ตาราง: รวมช่อง (ผสานเซลล์) ---------- */
function tblSpans(b) { // คืน {span:{'i,j':[rs,cs]}, cover:Set('i,j')}
  const span = {}, cover = new Set(); Object.entries(b.mg || {}).forEach(([k, v]) => { const [i, j] = k.split(',').map(Number); span[k] = v; for (let a = 0; a < v[0]; a++) for (let c = 0; c < v[1]; c++) if (a || c) cover.add(`${i + a},${j + c}`); }); return { span, cover };
}
function curTableCell(id) { const s = getSelection(); const n = s.rangeCount ? s.getRangeAt(0).startContainer : null; let td = n && (n.nodeType === 1 ? n : n.parentElement).closest('td[data-cell]'); if ((!td || !td.closest(`.blk[data-id="${id}"]`)) && lastRange) { const m = lastRange.startContainer; td = (m.nodeType === 1 ? m : m.parentElement).closest('td[data-cell]'); } if (!td || !td.closest(`.blk[data-id="${id}"]`)) return null; return td.dataset.cell.split(',').map(Number); }
function tblMerge(dir) {
  const b = byId(curId); if (!b || b.t !== 'table') return; const c = curTableCell(b.id); if (!c) { toast('คลิกในช่องของตารางก่อน'); return; }
  const k = c.join(','); b.mg = b.mg || {}; const v = b.mg[k] || [1, 1]; const n = Math.max(...b.rows.map(r => r.length));
  if (dir === 'r' && c[1] + v[1] < n) v[1]++; else if (dir === 'd' && c[0] + v[0] < b.rows.length) v[0]++; else if (dir === 'x') { delete b.mg[k]; rerender(b.id); changed(true); return; } else return;
  b.mg[k] = v; rerender(b.id); changed(true);
}
const _bTXp = buildTableX;
buildTableX = function (el, b) {
  _bTXp(el, b); const tb0 = $('table', el); if (tb0) tb0.classList.toggle('nob', !!b.nob); if (!b.mg || !Object.keys(b.mg).length) return; const { span, cover } = tblSpans(b);
  $$('td[data-cell]', el).forEach(td => { const k = td.dataset.cell; if (cover.has(k)) td.remove(); else if (span[k]) { td.rowSpan = span[k][0]; td.colSpan = span[k][1]; } });
};
const _tXMLp = tableXML;
tableXML = function (b, C, keep) {
  if ((!b.mg || !Object.keys(b.mg).length) && !b.bd && !b.cf && !b.tst && !b.ca && !b.nob && !b.tw && !b.rh && !b.rha && !b.pad && !b.tfs) return _tXMLp(b, C, keep); if (typeof cOver === 'function') C = cOver(b, C);
  // สร้างจากตารางเดิมแล้วแทนที่เซลล์ที่ถูกรวม
  const rows = b.rows || []; const n = Math.max(...rows.map(r => r.length)); const rs = b.rs || { 0: 'L' }; const W = b.full ? DX.cw : b.tw ? DX.cw * Math.min(100, +b.tw) / 100 : Math.min(DX.cw, n * 1700); const cw = cwOf(b); const fs = +b.tfs || 1, PAD = { s: [10, 20, 60], l: [80, 100, 180] }[b.pad] || [40, 60, 140];
  const cols = cw ? Array.from({ length: n }, (_, j) => (cw[j] || cw[cw.length - 1])).map((x, _, a) => W * x / a.reduce((s, y) => s + y, 0)) : Array(n).fill(W / n);
  const jc = j => b.al === 'left' ? 'left' : b.al === 'first' ? (j === 0 ? 'left' : 'center') : 'center'; const { span, cover } = tblSpans(b);
  const vOwner = {}; Object.entries(span).forEach(([k, v]) => { const [i, j] = k.split(',').map(Number); for (let a = 1; a < v[0]; a++) vOwner[`${i + a},${j}`] = v[1]; });
  const GO = typeof bdGrid === 'function' ? bdGrid(b) : { own: {} };
  const out = rows.map((r, i) => { const st = rs[i] || ''; const solid = st === 'H' || st === 'h', base = Object.assign(solid ? { b: true, color: 'FFFFFF' } : st === 'S' || st === 'L' ? { b: true, color: C('dark') } : {}, fs !== 1 ? { size: DX.base * fs } : {});
    const fill = solid ? C('brown') : st === 'S' ? C('bar') : st === 'L' ? 'FBEFE7' : undefined; const o = { fill, bc: C('brown'), vAlign: 'center', pt: PAD[0], pb: PAD[1], px: PAD[2] }; if (b.nob) { o.border = `<w:top w:val="nil"/><w:left w:val="nil"/><w:bottom w:val="nil"/><w:right w:val="nil"/>`; o.fill = undefined; o.px = 60; }
    if (st === 'h' || st === 'S') return [cell(htmlParas(r[0] || '', base).map(p => para(p.runs, { jc: 'left', after: 0, keep })).join(''), Object.assign({ span: n, w: W }, o))];
    const cells = []; for (let j = 0; j < n; j++) { const k = `${i},${j}`;
      if (vOwner[k]) { const cs = vOwner[k]; const ok = (GO.own[k] || k), oi = ok.split(',').map(Number); cells.push(cell(para([]), Object.assign({ w: cols.slice(j, j + cs).reduce((a, x) => a + x, 0), span: cs > 1 ? cs : 0, vm: 'continue' }, o, tblWordCell(b, oi[0], oi[1], ok, o, base, C).opt))); j += cs - 1; continue; }
      if (cover.has(k)) continue; const sp = span[k] || [1, 1];
      const X = tblWordCell(b, i, j, k, o, base, C);
      cells.push(cell(htmlParas(r[j] || '', X.base).map(p => para(p.runs, { jc: X.jc || (st ? 'center' : jc(j)), after: 0, keep })).join(''), Object.assign({ w: cols.slice(j, j + sp[1]).reduce((a, x) => a + x, 0), span: sp[1] > 1 ? sp[1] : 0, vm: sp[0] > 1 ? 'restart' : '' }, o, X.opt))); j += sp[1] - 1; }
    return cells; });
  const rh = (b.rows || []).map((_, i) => ((b.rh || {})[i] || +b.rha || 0) * 56.7);
  return table(out, { w: W, cols, center: !b.full, hdr: docHdrN(b), rh });
};
const _extInspT = extInspector;
extInspector = function (b) { let h = _extInspT(b); if (b.t === 'table') h += `<div class="ir"><label>รวมช่องที่เคอร์เซอร์อยู่</label><button class="tb" onclick="tblMerge('r')">รวมไปทางขวา →</button><button class="tb" onclick="tblMerge('d')">รวมลงล่าง ↓</button><button class="tb" onclick="tblMerge('x')">แยกช่อง</button></div>`; return h; };
/* ---------- สารบัญอัตโนมัติ ---------- */
function tocEntries(tb) {
  const i0 = doc.blocks.indexOf(tb), P = PAGE_H + PAGE_G, n = $('#sheets').childElementCount, out = [];
  doc.blocks.slice(i0 + 1).forEach(b => {
    if (b.t !== 'pjch' && !(b.t === 'pjsec' && !tb.nosub)) return; const el = $(`.blk[data-id="${b.id}"]`); if (!el) return;
    const pg = Math.floor(el.offsetTop / P); const L = pageLabel(pg, n, doc.settings); const page = L.hide ? '' : (String(L.text).match(/[0-9๐-๙ivxlcdm]+|[ก-ฮ]$/i) || [''])[0];
    const text = b.t === 'pjch' ? [plainText(b.num || ''), plainText(b.title || '')].filter(Boolean).join(' ') : plainText(b.html || '');
    if (text) out.push({ lv: b.t === 'pjch' ? (b.num ? 1 : 0) : (b.sub ? 3 : 2), text, page });
  });
  return out;
}
function updateTOC() {
  let again = false;
  doc.blocks.filter(b => b.t === 'toc').forEach(tb => {
    const el = $(`.blk[data-id="${tb.id}"] .toc-body`); if (!el) return; const E = tocEntries(tb); const sig = JSON.stringify(E);
    if (el.dataset.sig === sig) return; const cnt = (el.dataset.sig ? JSON.parse(el.dataset.sig).length : -1); el.dataset.sig = sig;
    el.innerHTML = E.map(e => `<div class="toc-r lv${e.lv}"><span class="tt">${esc(e.text)}</span><span class="dd"></span><span class="pg">${esc(e.page)}</span></div>`).join('') || '<div class="hint">ยังไม่มีหัวบทถัดจากสารบัญ</div>';
    if (cnt !== E.length) again = true;
  });
  if (again && typeof schedulePaginate === 'function') schedulePaginate();
}
/* ---------- Word ---------- */
const _extXMLP = extBlockXML;
extBlockXML = function (b, o) {
  const r = _extXMLP(b, o); if (r) return r; const { keep } = o; const T = (h, f) => [].concat(...htmlParas(h || '', f).map(p => p.runs)); const P = (h, f, po) => htmlParas(h || '', f).map(p => para(p.runs, Object.assign({ keep, after: 0 }, po))).join('');
  const none = `<w:top w:val="nil"/><w:left w:val="nil"/><w:bottom w:val="nil"/><w:right w:val="nil"/>`, dotB = `<w:top w:val="nil"/><w:left w:val="nil"/><w:bottom w:val="dotted" w:sz="6" w:color="555555"/><w:right w:val="nil"/>`;
  const big = DX.base * 1.25; const img = (src, mm) => { const c = PNGC[src]; const d = c ? c.d : src; const m = /^data:image\/(png|jpeg|gif);base64,(.*)$/.exec(d || ''); if (!m) return ''; const ar = c ? c.h / c.w : 1; return drawing(addMedia(m[2], m[1] === 'jpeg' ? 'jpg' : m[1]), ar > 1 ? mm / ar : mm, ar > 1 ? mm : mm * ar, ++DX.pic); };
  switch (b.t) {
    case 'pjcover': { const c = { jc: 'center', after: 0 }; const L = (h) => b.ctr ? P(h, {}, c) : table([[cell(P(h, {}, { tabs: [['left', 2600]] }), { border: none })]], { w: 5200, center: true });
      const lg = [logoOf(b.lg), logoOf(b.lg2)].filter(Boolean).map(s => img(s, 26)).filter(Boolean);
      return (lg.length ? para(lg.flatMap((x, i) => i ? [run('   ', {}), x] : [x]), { jc: 'center', after: 300 }) : '') + P(b.kick, { b: true, size: big }, c) + para([], { after: 300 }) + P(b.title, { b: !b.std }, b.std ? { after: 0 } : c) + para([], { after: 200 }) + P(b.by, { b: !b.std }, c) + L(b.stu) + (plainText(b.advl || '') ? para([], { after: 120 }) + P(b.advl, { b: !b.std }, c) + L(b.adv) : '') + para([], { after: 360 }) + P(b.school, { b: !b.std }, c) + P(b.aff, { b: !b.std }, c) + para([], { after: 360 }) + P(b.note, { b: !b.std }, c) + '<w:p><w:r><w:br w:type="page"/></w:r></w:p>'; }
    case 'pjch': return (b.num ? P(b.num, { b: true, size: big }, { jc: 'center', keep: true, style: 'Heading1' }) : '') + P(b.title, { b: true, size: big }, { jc: 'center', keep: true, after: 200, style: b.num ? undefined : 'Heading1' });
    case 'pjsec': return P(b.html, { b: true }, { keep: true, ind: b.sub ? 600 : 0, style: b.sub ? 'Heading3' : 'Heading2', after: 40 });
    case 'pjtext': return htmlParas(b.html || '', {}).map(p => para(p.runs, { keep, jc: p.jc || DX.al, after: 0, ind: b.hang ? 720 : 0, hang: b.hang ? 720 : 0, first: !b.hang && !b.noind ? 720 : 0 })).join('');
    case 'pjinfo': { const n = Math.max(1, Math.min(12, +b.n || 4)); return table(Array.from({ length: n }, (_, i) => [cell(P(b['l' + i], { b: true }), { border: none, w: 2200 }), cell(P(b['v' + i], {}), { border: none, w: DX.cw - 2200 })]), { w: DX.cw, cols: [2200, DX.cw - 2200] }); }
    case 'toc': { const E = tocEntries(b); return para([run('เรื่อง', { b: true }), tabRun({}), run('หน้า', { b: true })], { tabs: [['right', DX.cw]], after: 60 }) + E.map(e => para([run(e.text, { b: e.lv <= 1 }), tabRun({}), run(e.page, {})], { tabs: [['right', DX.cw, 'dot']], ind: e.lv >= 2 ? (e.lv - 1) * 500 : 0, after: 0 })).join(''); }
    case 'memohead': { const lab = t => run(t + ' ', { b: true, size: DX.base * 1.15 }); const v = (h) => T(h, {});
      const top = table([[cell(para([drawing(DX.garuda || (DX.garuda = addMedia(GARUDA.split(',')[1], 'png')), 15, 14.8, ++DX.pic)], { after: 0 }), { border: none, w: 1300 }), cell(para(T(b.ttl, { b: true, size: DX.base * 1.6 }), { jc: 'center', after: 0 }), { border: none, w: DX.cw - 2600, vAlign: 'bottom' }), cell(para([]), { border: none, w: 1300 })]], { w: DX.cw, cols: [1300, DX.cw - 2600, 1300], noGap: true });
      const row = (cells, ws) => table([cells.map((c, i) => cell(para(c, { after: 0 }), { border: i % 2 ? dotB : none, w: ws[i], px: 40 }))], { w: DX.cw, cols: ws, noGap: true });
      return top + row([[lab('ส่วนราชการ')], v(b.org)], [1800, DX.cw - 1800]) + row([[lab('ที่')], v(b.no), [lab('วันที่')], v(b.date)], [450, DX.cw / 2 - 450, 950, DX.cw / 2 - 950]) + row([[lab('เรื่อง')], v(b.subj)], [700, DX.cw - 700]) + para([], { after: 60 }); }
    case 'memocmt': { const n = Math.max(1, Math.min(6, +b.n || 2)), dl = Math.max(0, Math.min(4, b.dl ?? 2)); const per = b.one ? 1 : 2; const W = DX.cw / per;
      const box = i => (plainText(b['t' + i] || '') ? P(b['t' + i], { b: true, u: true }) : '') + (plainText(b['ck' + i] || '') ? P(b['ck' + i], {}) : '') + Array.from({ length: dl }, () => para([run('.'.repeat(per === 1 ? 140 : 66), {})], { after: 0 })).join('') + para([run('ลงชื่อ', {})], { before: 160, after: 0 }) + P(b['name' + i], {}, { jc: 'center' }) + P(b['pos' + i], {}, { jc: 'center' }) + P(b['dt' + i], {}, { jc: 'center', after: 160 });
      const rows = []; for (let i = 0; i < n; i += per) rows.push(Array.from({ length: per }, (_, k) => cell(i + k < n ? box(i + k) : para([]), { border: none, w: W }))); return table(rows, { w: DX.cw, cols: Array(per).fill(W) }); }
    case 'cshead': { const tabs = [['center', Math.round(DX.cw * 0.62)], ['right', DX.cw]]; const f = { b: true };
      return P(b.ttl, { b: true, size: DX.base * 1.1 }, { jc: 'center', keep: true, after: 60, style: 'Heading1' }) + [0, 1, 2].map(i => para([].concat(T(b['a' + i], f), [tabRun({})], T(b['m' + i], f), [tabRun({})], T(b['z' + i], f)), { tabs, keep: true, after: 0 })).join('') + para([], { border: '<w:bottom w:val="dashed" w:sz="12" w:space="1" w:color="000000"/>', after: 160 }); }
    case 'signln': { const ws = [1100, 3600, DX.cw - 4700]; return table([[cell(para([run('ลงชื่อ', {})], { after: 0 }), { border: none, w: ws[0], vAlign: 'bottom' }), cell(para([]), { border: dotB, w: ws[1] }), cell(P(b.role, {}), { border: none, w: ws[2], vAlign: 'bottom' })], [cell(para([]), { border: none, w: ws[0] }), cell(P(b.name, {}, { jc: 'center' }) + P(b.date, {}, { jc: 'center' }), { border: none, w: ws[1] }), cell(para([]), { border: none, w: ws[2] })]], { w: DX.cw, cols: ws, h: 500 }); }
  }
  return '';
};
/* ---------- หน้าต่างกรอกข้อมูลแม่แบบ (ใช้ร่วมกัน) ---------- */
function docDlg(title, fields, build, note) {
  let d = $('#dDoc'); if (d) d.remove(); d = document.createElement('div'); d.id = 'dDoc'; d.className = 'dlg-back'; d.addEventListener('mousedown', e => { if (e.target === d) closeDlg('#dDoc'); });
  const F = ([id, lab, val, kind, opts]) => kind === 't' ? `<label class="dd-f wide"><small>${lab}</small><textarea id="dd_${id}" rows="${opts || 3}">${esc(val)}</textarea></label>` : kind === 's' ? `<label class="dd-f"><small>${lab}</small><select id="dd_${id}">${opts.map(([k, v]) => `<option value="${k}"${k === val ? ' selected' : ''}>${v}</option>`).join('')}</select></label>` : kind === 'c' ? `<label class="dd-c"><input type="checkbox" id="dd_${id}" ${val ? 'checked' : ''}> ${lab}</label>` : kind === 'h' ? `<div class="dd-h">${lab}</div>` : `<label class="dd-f"><small>${lab}</small><input type="text" id="dd_${id}" value="${esc(val)}"></label>`;
  d.innerHTML = `<div class="dlg" style="width:760px"><h3>${title}</h3>${note ? `<p class="hint" style="margin:-4px 0 8px">${note}</p>` : ''}<div class="dd-grid">${fields.map(F).join('')}</div><div class="actions"><button class="tb" id="ddCancel">ยกเลิก</button><button class="tb" id="ddAppend">เพิ่มต่อท้ายเอกสารนี้</button><button class="tb primary" id="ddNew">สร้างเป็นเอกสารใหม่</button></div></div>`;
  document.body.appendChild(d);
  const V = id => { const e = $('#dd_' + id); return !e ? '' : e.type === 'checkbox' ? e.checked : e.value.trim(); };
  const go = fresh => { const res = build(V); closeDlg('#dDoc'); if (fresh) { doc = { app: 'en-editor', v: 2, settings: Object.assign({}, doc.settings, { pnAnchor: '', pnFront: 'hide', pnRules: [] }, res.settings), blocks: res.blocks }; curId = null; applySettings(); renderAll(); changed(true); refreshInspector(); $('#scroller').scrollTop = 0; } else { doc.blocks.push(...res.blocks); renderAll(); changed(true); } toast(res.msg || 'สร้างแล้ว แก้ไขได้ทุกส่วน'); };
  $('#ddCancel').onclick = () => closeDlg('#dDoc'); $('#ddNew').onclick = () => go(true); $('#ddAppend').onclick = () => go(false);
  openDlg('#dDoc');
}
const lnz = s => String(s || '').split('\n').map(x => x.trim()).filter(Boolean);
const brs = s => esc(String(s || '')).replace(/\n/g, '<br>');
const NOHEAD = { hl: '', hr: '', nologo: true, hline: 'none', ft: '', au: '' };
/* ---------- 1) เล่มโครงงานสมบูรณ์ ---------- */
function openProject() {
  docDlg('เล่มโครงงานสมบูรณ์', [
    ['kind', 'ประเภทโครงงาน', 'โครงงานคณิตศาสตร์'], ['title', 'ชื่อเรื่อง', ''], ['stu', 'ผู้จัดทำ (บรรทัดละคน)', '', 't', 3], ['adv', 'ครูที่ปรึกษา (บรรทัดละคน)', 'นายศาสตราวุฒิ อาชนะชัย', 't', 2],
    ['level', 'ระดับชั้น', 'มัธยมศึกษาตอนปลาย'], ['school', 'โรงเรียน', SCHOOL], ['aff', 'สังกัด', 'สังกัด' + AFF], ['note', 'ข้อความท้ายปก', 'รายงานฉบับนี้เป็นส่วนประกอบของโครงงานคณิตศาสตร์ ระดับมัธยมศึกษาตอนปลาย\nงาน ...', 't', 2],
    ['kw', 'คำสำคัญ', ''], ['h', 'ส่วนประกอบ', '', 'h'], ['inner', 'ปกใน', true, 'c'], ['tbl', 'สารบัญตาราง', true, 'c'], ['fig', 'สารบัญภาพ', true, 'c'], ['app', 'ภาคผนวก', true, 'c'],
  ], V => {
    const B = []; const add = (t, x) => { const b = newBlock(t, x || {}); B.push(b); return b; }; const S = lnz(V('stu')), A = lnz(V('adv'));
    const list = L => L.map((x, i) => `${i + 1}. ${esc(x)}`).join('<br>') || '1. ...';
    const cover = () => add('pjcover', { kick: esc(V('kind')), title: 'เรื่อง ' + esc(V('title') || '...'), stu: list(S), adv: list(A), school: esc(V('school')), aff: esc(V('aff')), note: brs(V('note')), ctr: true });
    cover(); if (V('inner')) cover();
    add('pjinfo', { n: 4, l0: 'ชื่อโครงงาน', v0: esc(V('title')), l1: 'ผู้จัดทำโครงงาน', v1: S.map(esc).join('<br>'), l2: 'ครูที่ปรึกษาโครงงาน', v2: A.map(esc).join('<br>'), l3: 'ระดับชั้น', v3: esc(V('level')) });
    add('pjch', { num: '', title: 'บทคัดย่อ' }); add('pjtext', { html: 'โครงงานนี้มีวัตถุประสงค์เพื่อ ...' }); add('pjtext', { noind: true, html: '<b>คำสำคัญ:</b> ' + esc(V('kw') || '...') });
    add('pjch', { num: '', title: 'กิตติกรรมประกาศ' }); add('pjtext', { html: 'โครงงานฉบับนี้สำเร็จลุล่วงได้ด้วยความกรุณาจาก ...' }); add('lptext', { ind: 0, html: '<div style="text-align:right">คณะผู้จัดทำ</div>' });
    add('pjch', { num: '', title: 'สารบัญ' }); const toc = add('toc', {});
    if (V('tbl')) { add('pjch', { num: '', title: 'สารบัญตาราง' }); add('toc', { kind: 'tbl' }); }
    if (V('fig')) { add('pjch', { num: '', title: 'สารบัญภาพ' }); add('toc', { kind: 'fig' }); }
    const CH = [['บทนำ', ['ที่มาและความสำคัญ', 'วัตถุประสงค์', 'ขอบเขตของการศึกษา', 'ประโยชน์ที่คาดว่าจะได้รับ', 'นิยามศัพท์เฉพาะ']], ['เอกสารที่เกี่ยวข้อง', ['ความรู้พื้นฐาน', 'งานวิจัยที่เกี่ยวข้อง']], ['วิธีการดำเนินการ', ['เครื่องมือที่ใช้ในการศึกษา', 'วิธีการดำเนินการ']], ['ผลการดำเนินการ', ['ผลการศึกษา']], ['สรุป อภิปรายผล และข้อเสนอแนะ', ['สรุปผล', 'อภิปรายผล', 'ข้อเสนอแนะ']]];
    let first = null; CH.forEach(([t, secs], k) => { const c = add('pjch', { num: `บทที่ ${k + 1}`, title: t }); if (!first) first = c; secs.forEach((s, j) => { add('pjsec', { html: `${k + 1}.${j + 1} ${s}` }); add('pjtext', { html: '' }); }); if (k === 3) add('table', { capOn: true, cap: 'ผลการศึกษา', rows: [['หัวข้อ', 'ผล'], ['', '']], full: true, rs: { 0: 'L' } }); });
    add('pjch', { num: '', title: 'บรรณานุกรม' }); add('pjtext', { hang: true, html: 'ชื่อผู้แต่ง. (ปีที่พิมพ์). <i>ชื่อหนังสือ</i>. สถานที่พิมพ์: สำนักพิมพ์.' });
    if (V('app')) { add('pjch', { num: '', title: 'ภาคผนวก' }); add('pjtext', { html: '' }); }
    return { blocks: B, settings: Object.assign({ name: 'โครงงาน ' + (V('title') || '') }, NOHEAD, { pnPos: 'tr', pnFmt: '{n}', pnStart: 1, pnAnchor: first.id, pnFront: 'hide', pnRules: [] }), msg: 'สร้างเล่มโครงงานแล้ว · สารบัญและเลขหน้าเดินเองอัตโนมัติ' };
  }, 'ปก ปกใน บทคัดย่อ กิตติกรรมประกาศ สารบัญอัตโนมัติ บทที่ 1–5 บรรณานุกรม ภาคผนวก · เลขหน้ามุมบนขวาเริ่ม 1 ที่บทที่ 1');
}
/* ---------- 2) บันทึกข้อความ ---------- */
const MEMO_KINDS = {
  plan: ['ขออนุญาตใช้แผนการจัดการเรียนรู้', 'ขออนุญาตใช้แผนการจัดการเรียนรู้'],
  trip: ['ขออนุญาตไปราชการ', 'ขออนุญาตไปราชการ'],
  report: ['รายงานผลการไปปฏิบัติราชการ', 'รายงานผลการไปปฏิบัติราชการ'],
  req: ['ขออนุญาต / ขอความอนุเคราะห์ (ทั่วไป)', 'ขออนุญาต ...'],
};
function openMemo(kind) {
  docDlg('บันทึกข้อความ', [
    ['kind', 'ชนิดบันทึก', kind || 'plan', 's', Object.entries(MEMO_KINDS).map(([k, v]) => [k, v[0]])], ['subj', 'เรื่อง (เว้นว่าง = ตามชนิด)', ''],
    ['org', 'ส่วนราชการ', SCHOOL + '  ' + AMPHOE], ['no', 'ที่', 'ศธ ๐๔๓๑๒.๐๓/'], ['date', 'วันที่', '...... เดือน ................ พ.ศ. ........'], ['to', 'เรียน', 'ผู้อำนวยการ' + SCHOOL],
    ['name', 'ผู้ลงนาม', PPL.me[0]], ['pos', 'ตำแหน่ง', PPL.me[1]], ['course', 'รายวิชา / งาน (สำหรับแผน)', 'รายวิชาคณิตศาสตร์เพิ่มเติม ... รหัสวิชา ... ชั้นมัธยมศึกษาปีที่ ... ภาคเรียนที่ ... ปีการศึกษา ....'],
    ['body', 'เนื้อความเพิ่มเติม / รายละเอียด (เว้นว่าง = ใช้ข้อความตัวอย่าง)', '', 't', 3],
  ], V => {
    const k = V('kind'), B = []; const add = (t, x) => { const b = newBlock(t, x || {}); B.push(b); return b; }; const me = `ข้าพเจ้า${V('name')} ตำแหน่ง ${V('pos')}${SCHOOL} สังกัด${AFF}`; const extra = V('body') ? brs(V('body')) : '';
    add('memohead', { org: esc(V('org')), no: esc(V('no')), date: esc(V('date')), subj: esc(V('subj') || MEMO_KINDS[k][1]) });
    add('pjtext', { noind: true, html: '<b>เรียน</b>' + TAB + esc(V('to')) });
    const cmt = (L, ckText) => add('memocmt', Object.assign({ n: L.length, dl: ckText ? 0 : 2 }, ...L.map((p, i) => ({ ['t' + i]: p[2] || '', ['ck' + i]: p[3] !== undefined ? p[3] : (ckText || ''), ['name' + i]: `(${p[0]})`, ['pos' + i]: p[1], ['dt' + i]: ckText ? '...... / ...... / ......' : '' }))));
    const sign = () => add('lpsign', { l1: '(ลงชื่อ) ................................................', name: `(${esc(V('name'))})`, pos: 'ตำแหน่ง ' + esc(V('pos')) });
    const AP = '☐ อนุมัติ' + '&nbsp;'.repeat(10) + '☐ ไม่อนุมัติ';
    if (k === 'plan') {
      add('pjtext', { html: `${esc(me)} ได้รับมอบหมายให้ทำการสอน ${esc(V('course'))} ความดังแจ้งแล้ว นั้น` });
      add('pjtext', { html: extra || 'ในการนี้ ข้าพเจ้าได้จัดเตรียมการสอนโดยการวิเคราะห์ผู้เรียนและพบสภาพที่เป็นปัญหาในการเรียนการสอน จึงได้วางแผนเพื่อพัฒนาการเรียนการสอนในส่วนที่รับผิดชอบ โดยได้จัดทำแผนการจัดการเรียนรู้ที่เน้นผู้เรียนเป็นสำคัญ จึงขออนุญาตดำเนินการจัดการเรียนรู้ตามแผนการจัดการเรียนรู้ที่แนบมานี้' });
      add('pjtext', { html: 'จึงเรียนมาเพื่อโปรดพิจารณา' }); sign();
      cmt([[...PPL.head], [...PPL.dep], [...PPL.dir]], '☐ เห็นควรอนุญาตให้ใช้ในการสอนได้<br>☐ อื่น ๆ ....................................');
    } else if (k === 'trip') {
      add('pjtext', { html: extra || `ด้วย ... ได้มีหนังสือที่ ... ลงวันที่ ... เรื่อง ... โดยกำหนดจัด ... ในวันที่ ... ณ ...` });
      add('pjtext', { html: `ในการนี้ ${esc(me)} จึงขออนุญาตไปราชการดังกล่าว ระหว่างวันที่ ................................. โดยเดินทางด้วย ......................` });
      add('pjtext', { noind: true, html: `${TAB}☐ ไม่ขอเบิกค่าใช้จ่ายใด ๆ<br>${TAB}☐ ขอเบิกค่าใช้จ่ายจาก ...................................... เป็นเงิน .............. บาท` });
      add('pjtext', { html: 'จึงเรียนมาเพื่อโปรดพิจารณา' }); sign(); add('pagebreak');
      cmt([[...PPL.head, 'ความเห็นหัวหน้ากลุ่มสาระการเรียนรู้'], [...PPL.dep, 'ความเห็นรองผู้อำนวยการกลุ่มบริหารวิชาการ'], [...PPL.hr, 'ความเห็นรองผู้อำนวยการกลุ่มบริหารงานบุคคล'], [...PPL.dir, 'ความเห็นผู้อำนวยการโรงเรียน', AP]]);
    } else if (k === 'report') {
      add('pjtext', { html: `ตามที่ ${esc(me)} ได้รับอนุญาตให้ไปราชการ เรื่อง ...................................... ระหว่างวันที่ ...................... ณ ...................... นั้น บัดนี้ได้ปฏิบัติราชการเสร็จเรียบร้อยแล้ว จึงขอรายงานผลการไปปฏิบัติราชการ ดังนี้` });
      add('pjtext', { noind: true, html: `${TAB}<b>๑. สาระสำคัญที่ได้รับจากการไปราชการ</b><br>${TAB}${TAB}${extra || '...............................................................................'}<br>${TAB}<b>๒. ประโยชน์ที่ได้รับและการนำไปใช้</b><br>${TAB}${TAB}...............................................................................` });
      add('pjtext', { html: 'จึงเรียนมาเพื่อโปรดทราบ' }); sign();
      cmt([[...PPL.dep, 'ความเห็นรองผู้อำนวยการกลุ่มบริหารวิชาการ'], [...PPL.dir, 'ความเห็นผู้อำนวยการโรงเรียน', '☐ ทราบ']]);
      add('pagebreak'); add('pjch', { num: '', title: 'รูปประกอบการไปราชการ' }); add('work', { h: 95, nolab: true }); add('work', { h: 95, nolab: true });
    } else {
      add('pjtext', { html: `${esc(me)} ${extra || 'มีความประสงค์ขออนุญาต ... เนื่องจาก ... ดังรายชื่อต่อไปนี้'}` });
      add('table', { rows: [['ที่', 'ชื่อ – สกุล', 'ชั้น', 'หมายเหตุ'], ['1', '', '', ''], ['2', '', '', ''], ['3', '', '', '']], cw: '8,52,15,25', full: true, rs: { 0: 'L' } });
      add('pjtext', { html: 'จึงเรียนมาเพื่อโปรดพิจารณา' }); sign(); cmt([[...PPL.dir, 'ความเห็นผู้อำนวยการโรงเรียน', AP]]);
    }
    return { blocks: B, settings: Object.assign({ name: 'บันทึกข้อความ ' + (V('subj') || MEMO_KINDS[k][1]) }, NOHEAD, { pnPos: 'tc', pnFmt: '- {n} -', pnStart: 1, pnRules: [{ a: 1, b: 1, m: 'hide' }] }), msg: 'สร้างบันทึกข้อความแล้ว · แก้ชื่อ ตำแหน่ง ☐/✓ ได้ทุกช่อง' };
  }, 'หัวครุฑตามแบบหนังสือราชการ · ช่องความเห็น/ลงนามของหัวหน้ากลุ่มสาระ รองฯ และผู้อำนวยการ · หน้า 2 ขึ้นไปมีเลข “- 2 -”');
}
/* ---------- 3) ปกแผน + 4) กำหนดการจัดการเรียนรู้ ---------- */
const SKILLS = { p: ['การแก้ปัญหา', 'การสื่อสารและการสื่อความหมายทางคณิตศาสตร์', 'การเชื่อมโยง', 'การให้เหตุผล', 'การคิดสร้างสรรค์'], a: ['ทำความเข้าใจหรือสร้างกรณีทั่วไปโดยใช้ความรู้ที่ได้จากการศึกษากรณีตัวอย่างหลาย ๆ กรณี', 'มองเห็นว่าสามารถใช้คณิตศาสตร์แก้ปัญหาในชีวิตจริงได้', 'มีความมุมานะในการทำความเข้าใจปัญหาและแก้ปัญหาทางคณิตศาสตร์', 'สร้างเหตุผลเพื่อสนับสนุนแนวคิดของตนเองหรือโต้แย้งแนวคิดของผู้อื่นอย่างสมเหตุสมผล', 'ค้นหาลักษณะที่เกิดขึ้นซ้ำ ๆ และประยุกต์ใช้ลักษณะดังกล่าวเพื่อทำความเข้าใจหรือแก้ปัญหาในสถานการณ์ต่าง ๆ'], c: ['ความสามารถในการสื่อสาร', 'ความสามารถในการคิด', 'ความสามารถในการแก้ปัญหา', 'ความสามารถในการใช้ทักษะชีวิต', 'ความสามารถในการใช้เทคโนโลยี'], d: ['รักชาติ ศาสน์ กษัตริย์', 'ซื่อสัตย์สุจริต', 'มีวินัย', 'ใฝ่เรียนรู้', 'อยู่อย่างพอเพียง', 'มุ่งมั่นในการทำงาน', 'รักความเป็นไทย', 'มีจิตสาธารณะ'] };
const COURSE_F = [['subj', 'รายวิชา', 'คณิตศาสตร์เพิ่มเติม 5'], ['code', 'รหัสวิชา', 'ค33201'], ['en', 'ชื่อภาษาอังกฤษ + รหัส', 'Additional Mathematics 5   MA33201'], ['grade', 'ชั้น', 'มัธยมศึกษาปีที่ 6'], ['term', 'ภาคเรียน', '1'], ['year', 'ปีการศึกษา', '2569'], ['teacher', 'ครูผู้สอน', PPL.me[0]], ['pos', 'ตำแหน่ง', 'ครู'], ['group', 'กลุ่มสาระ', 'กลุ่มสาระการเรียนรู้คณิตศาสตร์']];
function courseCover(add, V, kick) {
  add('pjcover', { lg: 'school', kick, title: `รายวิชา ${esc(V('subj'))}  รหัสวิชา ${esc(V('code'))}<br>${esc(V('en'))}<br><br>ชั้น${esc(V('grade'))}<br><br>ภาคเรียนที่ ${esc(V('term'))} ปีการศึกษา ${esc(V('year'))}`, by: 'โดย', stu: `${esc(V('teacher'))}<br>ตำแหน่ง ${esc(V('pos'))}<br>${esc(V('group'))}`, advl: '', adv: '', school: `${SCHOOL} ${AMPHOE}`, aff: AFF, note: 'สำนักงานคณะกรรมการการศึกษาขั้นพื้นฐาน<br>กระทรวงศึกษาธิการ', ctr: true });
}
function openPlanCover() {
  docDlg('ปกแผนการจัดการเรียนรู้ + บันทึกขออนุญาตใช้แผน', [...COURSE_F, ['date', 'วันที่ในบันทึก', '...... เดือน ................ พ.ศ. ........'], ['memo', 'มีบันทึกขออนุญาตใช้แผน (หน้า 2)', true, 'c']], V => {
    const B = []; const add = (t, x) => { const b = newBlock(t, x || {}); B.push(b); return b; };
    courseCover(add, V, 'แผนการจัดการเรียนรู้');
    if (V('memo')) {
      add('memohead', { org: SCHOOL + '  ' + AMPHOE, no: 'ศธ ๐๔๓๑๒.๐๓/ ' + esc(V('group')), date: esc(V('date')), subj: 'ขออนุญาตใช้แผนการจัดการเรียนรู้' });
      add('pjtext', { noind: true, html: '<b>เรียน</b>' + TAB + 'ผู้อำนวยการ' + SCHOOL });
      add('pjtext', { html: `ด้วยข้าพเจ้า${esc(V('teacher'))} ตำแหน่ง ${esc(V('pos'))}${SCHOOL} สังกัด${AFF} ได้รับมอบหมายให้ทำการสอน รายวิชา${esc(V('subj'))} รหัสวิชา ${esc(V('code'))} ชั้น${esc(V('grade'))} ในภาคเรียนที่ ${esc(V('term'))} ปีการศึกษา ${esc(V('year'))} ความดังแจ้งแล้ว นั้น ในการนี้ข้าพเจ้าได้จัดเตรียมการสอนโดยการวิเคราะห์ผู้เรียนและพบสภาพที่เป็นปัญหาในการเรียนการสอน จึงได้วางแผนเพื่อพัฒนาการเรียนการสอนในส่วนที่รับผิดชอบ โดยได้จัดทำแผนการจัดการเรียนรู้ที่เน้นผู้เรียนเป็นสำคัญ จึงขออนุญาตดำเนินการจัดการเรียนรู้ตามแผนการจัดการเรียนรู้ที่แนบมานี้` });
      add('pjtext', { html: 'จึงเรียนมาเพื่อโปรดพิจารณา' });
      add('lpsign', { l1: 'ลงชื่อ ................................................', name: `(${esc(V('teacher'))})`, pos: 'ตำแหน่ง ' + esc(V('pos')) });
      const L = [PPL.head, PPL.dep, PPL.dir]; add('memocmt', Object.assign({ n: 3, dl: 0 }, ...L.map((p, i) => ({ ['t' + i]: '', ['ck' + i]: '☐ เห็นควรอนุญาตให้ใช้ในการสอนได้<br>☐ อื่น ๆ ....................................', ['name' + i]: `(${p[0]})`, ['pos' + i]: p[1], ['dt' + i]: '...... / ...... / ......' }))));
    }
    return { blocks: B, settings: Object.assign({ name: 'ปกแผน ' + V('subj') }, NOHEAD, { pnPos: 'tr', pnFmt: '{n}', pnRules: [{ a: 1, b: 99, m: 'hide' }] }), msg: 'สร้างปกแผนและบันทึกขออนุญาตใช้แผนแล้ว' };
  }, 'ปกมีตราโรงเรียน (เปลี่ยนเป็นตราอื่นหรือเพิ่มตราที่ 2 ได้ที่แผงขวา) · หน้า 2 เป็นบันทึกข้อความพร้อมช่องความเห็น 3 ท่าน');
}
function openSyllabus() {
  docDlg('กำหนดการจัดการเรียนรู้ (Course Syllabus)', [...COURSE_F, ['hrs', 'เวลาเรียน (ชั่วโมง)', '60'], ['cred', 'หน่วยกิต', '1.5'],
    ['desc', 'คำอธิบายรายวิชา (ศึกษา ฝึกทักษะ ... ในเนื้อหาต่อไปนี้)', 'ลำดับและอนุกรม ...\nคณิตศาสตร์การเงิน ...', 't', 3],
    ['kind', 'รายวิชาใช้', 'out', 's', [['out', 'ผลการเรียนรู้ (รายวิชาเพิ่มเติม)'], ['ind', 'มาตรฐาน/ตัวชี้วัด (รายวิชาพื้นฐาน)']]],
    ['ex', 'ชั่วโมงสอบ กลางภาค / ปลายภาค (ใส่ – ถ้าไม่นับรวม)', '2 / 2'],
    ['out', 'ผลการเรียนรู้ หรือ ตัวชี้วัด (บรรทัดละข้อ เช่น ค3.2 ม 5/1 เข้าใจ...)', '', 't', 4], ['units', 'หน่วยการเรียนรู้: สัปดาห์ | ชื่อหน่วย | ชั่วโมง | รหัสตัวชี้วัด/ผลการเรียนรู้ | จุดประสงค์ (บรรทัดละหน่วย; 2 ช่องท้ายเว้นได้)', '1-9 | ลำดับและอนุกรม | 27\n11-16 | คณิตศาสตร์การเงิน | 18\n17-19 | แคลคูลัสเบื้องต้น 1 | 9', 't', 3],
    ['sc', 'คะแนน ก่อนกลางภาค / กลางภาค / หลังกลางภาค / ปลายภาค', '30 / 20 / 30 / 20'], ['media', 'สื่อ / แหล่งเรียนรู้ (บรรทัดละข้อ เว้นว่าง = ค่าเริ่มต้น)', '', 't', 2], ['date', 'วันที่ลงนาม', '31 มีนาคม พ.ศ. 2569'],
  ], V => {
    const B = []; const add = (t, x) => { const b = newBlock(t, x || {}); B.push(b); return b; }; const sc = (V('sc').match(/\d+/g) || [30, 20, 30, 20]).map(Number);
    courseCover(add, V, 'กำหนดการจัดการเรียนรู้ (Course Syllabus)');
    const head = ttl => add('cshead', { ttl, a0: `${esc(V('subj'))}  รหัสวิชา ${esc(V('code'))}`, m0: '', z0: esc(V('en')), a1: esc(V('group')), m1: '', z1: 'ชั้น' + esc(V('grade')), a2: `เวลา ${esc(V('hrs'))} ชั่วโมง`, m2: '', z2: `จำนวน ${esc(V('cred'))} หน่วยกิต` });
    head('คำอธิบายรายวิชา');
    add('pjtext', { noind: true, html: '<b>ศึกษา ฝึกทักษะและกระบวนการทางคณิตศาสตร์ในเนื้อหาของสาระ ดังนี้</b>' }); lnz(V('desc')).forEach(x => add('pjtext', { html: esc(x) }));
    add('pjtext', { html: 'โดยจัดประสบการณ์ให้ผู้เรียนได้พัฒนาทักษะและกระบวนการทางคณิตศาสตร์ อันได้แก่ การแก้ปัญหา การสื่อสารและการสื่อความหมายทางคณิตศาสตร์ การเชื่อมโยง การให้เหตุผล และการคิดสร้างสรรค์ การใช้สื่อ อุปกรณ์ เทคโนโลยี และแหล่งข้อมูล และนำประสบการณ์ ตลอดจนทักษะและกระบวนการที่ได้ไปใช้ในการเรียนรู้สิ่งต่าง ๆ และใช้ในชีวิตประจำวันอย่างสร้างสรรค์ รวมทั้งเห็นคุณค่าและมีเจตคติที่ดีต่อคณิตศาสตร์ สามารถทำงานอย่างเป็นระบบ มีความรอบคอบ มีวิจารณญาณ และมีคุณลักษณะอันพึงประสงค์ในการเรียนคณิตศาสตร์' });
    add('pjtext', { html: 'การวัดและประเมินผล ใช้วิธีการที่หลากหลายตามสภาพความเป็นจริงให้สอดคล้องกับเนื้อหาและทักษะที่ต้องการวัด' });
    const O = lnz(V('out')), IND = V('kind') === 'ind', OL = IND ? 'ตัวชี้วัด' : 'ผลการเรียนรู้';
    if (IND) { add('pjsec', { html: 'รหัสตัวชี้วัด' }); add('pjtext', { noind: true, html: 'ตัวชี้วัดระหว่างทาง<br>' + TAB + '-' }); add('pjtext', { noind: true, html: 'ตัวชี้วัดปลายทาง' }); O.forEach(x => { const m = /^(ค\s*\d\.\d\s*ม\.?\s*\d\/\d+)\s*(.*)$/.exec(x); add('lptext', { ind: 2.6, html: m ? `<b>${esc(m[1])}</b>${TAB}${esc(m[2])}` : esc(x) }); }); }
    else { add('pjsec', { html: 'ผลการเรียนรู้' }); add('lptext', { html: O.length ? `<ol>${O.map(x => `<li>${esc(x)}</li>`).join('')}</ol>` : '<ol><li>...</li></ol>' }); }
    add('pjsec', { html: `รวมทั้งหมด ${O.length || '...'} ${OL}` });
    // ตารางโครงสร้าง
    add('pagebreak'); head('กำหนดการจัดการเรียนรู้ (Course Syllabus)');
    const U = lnz(V('units')).map(l => l.split('|').map(x => x.trim()));
    const R = [['สัปดาห์ที่', 'ชื่อหน่วย<br>การเรียนรู้', IND ? 'รหัส<br>ตัวชี้วัด' : 'ผลการ<br>เรียนรู้', 'จุดประสงค์การเรียนรู้', 'ภาระงาน/<br>ชิ้นงาน', 'เวลา<br>(ชม.)', 'น้ำหนักคะแนน', '', '', ''], ['', '', '', '', '', '', 'ก่อน', 'กลาง', 'หลัง', 'ปลาย']], rs = { 0: 'L', 1: 'L' }, mg = { '0,0': [2, 1], '0,1': [2, 1], '0,2': [2, 1], '0,3': [2, 1], '0,4': [2, 1], '0,5': [2, 1], '0,6': [1, 4] };
    const half = Math.ceil(U.length / 2); let tot = 0; const exh = (V('ex') || '').split('/').map(x => x.trim()); const exN = k => /^\d+$/.test(exh[k] || '') ? +exh[k] : null; const exS = k => exN(k) === null ? '–' : String(exN(k));
    const urow = (u, i) => { tot += +u[2] || 0; R.push([esc(u[0] || ''), `<b>${esc(u[1] || '')}</b>`, esc(u[3] || ''), esc(u[4] || ''), '1. แบบทดสอบ<br>เก็บคะแนน<br>2. แบบฝึกหัด', esc(u[2] || ''), i < half ? (i === 0 ? String(sc[0]) : '') : '', '', i >= half ? (i === half ? String(sc[2]) : '') : '', '']); };
    const tr = (t, h, a, s) => { const i = R.length; R.push([`<b>${t}</b>`, '', '', '', '', String(h), ...a]); rs[i] = s || 'L'; mg[`${i},0`] = [1, 5]; return i; };
    U.slice(0, half).forEach((u, i) => urow(u, i)); tr('สอบกลางภาคเรียน', exS(0), ['', String(sc[1]), '', ''], 'L'); U.slice(half).forEach((u, i) => urow(u, half + i));
    const i1 = tr('รวมระหว่างเรียน', tot + (exN(0) || 0), [String(sc[0] + sc[1] + sc[2]), '', '', '']); mg[`${i1},6`] = [1, 3]; tr('สอบปลายภาค', exS(1), ['', '', '', String(sc[3])]); const i3 = tr('รวม', tot + (exN(0) || 0) + (exN(1) || 0), [String(sc.reduce((a, x) => a + x, 0)), '', '', '']); mg[`${i3},6`] = [1, 4];
    add('table', { rows: R, rs, mg, full: true, compact: true, cw: '9,12,10,21,12,8,7,7,7,7' });
    // ทักษะ คุณลักษณะ
    add('pagebreak'); const ls = (h, L, lead) => { add('pjsec', { html: h }); add('lptext', { html: `${lead}<ol>${L.map(x => `<li>${esc(x)}</li>`).join('')}</ol>` }); };
    ls('ทักษะและกระบวนการทางคณิตศาสตร์', SKILLS.p, `ทั้งหมด ${SKILLS.p.length} ข้อ`); ls('คุณลักษณะอันพึงประสงค์ในการเรียนคณิตศาสตร์', SKILLS.a, `ทั้งหมด ${SKILLS.a.length} ข้อ`); ls('สมรรถนะที่สำคัญของผู้เรียนตามหลักสูตร', SKILLS.c, 'สมรรถนะสำคัญ 5 ประการ'); ls('คุณลักษณะอันพึงประสงค์ของผู้เรียนตามหลักสูตร', SKILLS.d, `ทั้งหมด ${SKILLS.d.length} ข้อ`);
    add('pagebreak'); add('pjsec', { html: 'แผนการวัดและประเมินผล' });
    add('lptext', { html: `<ul><li>การประเมินระหว่างเรียน<ul><li>การประเมินก่อนกลางภาค${TAB}${sc[0]} คะแนน</li><li>กลางภาค${TAB}${TAB}${sc[1]} คะแนน</li><li>การประเมินหลังกลางภาค${TAB}${sc[2]} คะแนน</li></ul></li><li>การประเมินปลายภาคเรียน${TAB}${sc[3]} คะแนน</li></ul>` });
    add('pjsec', { html: 'สื่อ / แหล่งเรียนรู้' }); { const M = lnz(V('media')); add('lptext', { html: M.length ? `<ol>${M.map(x => `<li>${esc(x)}</li>`).join('')}</ol>` : '<ol><li>เอกสารประกอบการเรียนและแบบฝึกหัดสอน เรื่อง ... จัดทำโดย' + esc(V('teacher')) + '</li><li>หนังสือเรียนรายวิชาเพิ่มเติมคณิตศาสตร์ ... สสวท.</li></ol>' }); }
    add('pjsec', { html: 'ข้อตกลงเบื้องต้น' }); add('pjsec', { sub: true, html: '1. ข้อตกลงในห้องเรียน' });
    add('pjtext', { html: '1.1 นักเรียนจะต้องมีเวลาเข้าเรียนไม่ต่ำกว่า 80% หรือขาดเรียนไม่เกิน 20% ของเวลาเรียนทั้งหมด จึงจะมีสิทธิ์เข้าสอบวัดผลปลายภาคเรียน หากเวลาเรียนไม่ถึงตามที่กำหนดจะต้องดำเนินการแก้ไขตามเงื่อนไขที่โรงเรียนกำหนด' });
    add('pjtext', { html: '1.2 ไม่เข้าห้องเรียนช้าเกิน 15 นาที เว้นแต่มีเหตุจำเป็นเร่งด่วนซึ่งพิจารณาโดยครูผู้สอนและเพื่อนร่วมชั้นเรียนเป็นรายกรณี' });
    add('pjsec', { sub: true, html: '2. การลา' }); add('pjtext', { html: '2.1 การลากิจและลาป่วย นักเรียนสามารถส่งข้อความลาหรือเขียนจดหมายลาส่งกับครูผู้สอนหรือครูที่ปรึกษา พร้อมแนบสำเนาหลักฐาน' }); add('pjtext', { html: '2.2 การลาไปราชการและลาช่วยกิจกรรมส่งเสริมการเรียนรู้ภายในโรงเรียนและภายนอกโรงเรียน หากมีบันทึกข้อความหรือหนังสือรับรองจากหน่วยงานหรือครูผู้รับผิดชอบ จะถือว่านักเรียนได้เข้าเรียนในคาบเรียนนั้นตามปกติ' });
    add('pjsec', { html: 'เงื่อนไขการได้ผลการเรียน “ร”' }); add('pjtext', { html: 'นักเรียนจะได้ผลการเรียน “ร” เมื่อนักเรียนไม่ได้ส่งเอกสารประกอบการสอน ใบกิจกรรม หรือแบบทดสอบเก็บคะแนนที่แจ้งไว้ในแผนการวัดผลและประเมินผล ทั้งนี้เพื่อให้นักเรียนผ่านผลการเรียนรู้ทั้งหมด' });
    add('pagebreak'); const sg = (p, role) => { add('signln', { name: `(${esc(p[0])})`, role, date: esc(V('date')) }); add('pjtext', { html: '' }); };
    sg([V('teacher')], 'ครูผู้สอน'); sg(PPL.head, PPL.head[1].replace('การเรียนรู้', '')); sg(PPL.acad, PPL.acad[1]); sg(PPL.dep, 'รองผู้อำนวยการโรงเรียน<br>กลุ่มบริหารงานวิชาการ'); sg(PPL.dir, 'ผู้อำนวยการโรงเรียน');
    return { blocks: B, settings: Object.assign({ name: 'กำหนดการจัดการเรียนรู้ ' + V('subj') }, NOHEAD, { pnPos: 'tr', pnFmt: '{n}', pnRules: [{ a: 1, b: 1, m: 'hide' }] }), msg: 'สร้างกำหนดการจัดการเรียนรู้แล้ว · ตารางโครงสร้างรวมช่องได้ที่แผงขวา' };
  }, 'ปก · คำอธิบายรายวิชา · ตารางโครงสร้าง (สัปดาห์ หน่วย เวลา น้ำหนักคะแนน) · ทักษะ/คุณลักษณะ/สมรรถนะ · การวัดผล · ข้อตกลง · หน้าลงนาม');
}
DOC_TEMPLATES.push(['เล่มโครงงานสมบูรณ์', '', 'PROJECT'], ['บันทึกข้อความ', '', 'MEMO'], ['ปกแผน + บันทึกขออนุญาตใช้แผน', '', 'PLANCOVER'], ['กำหนดการจัดการเรียนรู้ (Course Syllabus)', '', 'SYLLABUS']);
Object.assign(TPL_META, {
  'เล่มโครงงานสมบูรณ์': ['doc', 'ปก บทคัดย่อ สารบัญอัตโนมัติ บทที่ 1–5 บรรณานุกรม เลขหน้าเริ่มที่บทที่ 1', 'proj'],
  'บันทึกข้อความ': ['doc', 'ครุฑ ส่วนราชการ ที่ วันที่ เรื่อง · ขออนุญาต / ไปราชการ / รายงานผล พร้อมช่องความเห็น', 'memo'],
  'ปกแผน + บันทึกขออนุญาตใช้แผน': ['plan', 'ปกมีตราโรงเรียน และบันทึกข้อความขออนุญาตใช้แผน 3 ช่องความเห็น', 'pcover'],
  'กำหนดการจัดการเรียนรู้ (Course Syllabus)': ['plan', 'คำอธิบายรายวิชา ตารางโครงสร้าง น้ำหนักคะแนน ข้อตกลง หน้าลงนาม', 'syl'],
});
TPL_GROUPS2.push(['doc', 'งานเอกสาร', 'เล่มโครงงาน · บันทึกข้อความ']);
TPL_GROUPS2.forEach(g => { if (g[0] === 'plan') g[2] = 'แผนการสอน · ปกแผน · กำหนดการสอน'; });
const _tplThumb0 = tplThumb;
tplThumb = function (k) {
  const L = (y, w = 40, c = '#d9cfc6', x = 8) => `<rect x="${x}" y="${y}" width="${w}" height="3" rx="1.5" fill="${c}"/>`;
  const S = {
    proj: `${L(10, 30, 'var(--ui-accent)', 17)}${L(20, 40, '#8a7f76', 12)}${L(34, 16, '#c9b6a8', 24)}${L(40, 26, '#d9cfc6', 19)}${L(46, 26, '#d9cfc6', 19)}${L(60, 36, '#8a7f76', 14)}${L(66, 30, '#d9cfc6', 17)}`,
    memo: `<path d="M12 8 l5 3 l5 -3 l-1 8 h-8z" fill="#8a7f76"/>${L(11, 22, '#333', 30)}${L(22, 46)}${L(28, 46)}${L(34, 46)}${L(44, 46, '#e3d6c8')}${L(50, 46, '#e3d6c8')}<rect x="8" y="58" width="21" height="16" rx="1.5" fill="none" stroke="#c9b6a8"/><rect x="35" y="58" width="21" height="16" rx="1.5" fill="none" stroke="#c9b6a8"/>`,
    pcover: `<circle cx="32" cy="14" r="6" fill="#1f3ce6"/>${L(26, 30, '#1f3ce6', 17)}${L(34, 36, '#8a7f76', 14)}${L(40, 24, '#d9cfc6', 20)}${L(52, 22, '#8a7f76', 21)}${L(66, 36, '#8a7f76', 14)}`,
    syl: `${L(8, 30, '#333', 17)}${L(14, 46)}<line x1="7" y1="21" x2="57" y2="21" stroke="#555" stroke-dasharray="2 1.5"/><rect x="7" y="25" width="50" height="50" fill="none" stroke="#9fb0d8"/><rect x="7" y="25" width="50" height="6" fill="#dfe6f7"/>${[33, 41, 49, 57, 65].map(y => `<line x1="7" y1="${y}" x2="57" y2="${y}" stroke="#c9d3ea"/>`).join('')}<line x1="22" y1="25" x2="22" y2="75" stroke="#c9d3ea"/><line x1="44" y1="25" x2="44" y2="75" stroke="#c9d3ea"/>`,
  };
  if (S[k]) return `<svg viewBox="0 0 64 82" width="58" height="74"><rect x=".5" y=".5" width="63" height="81" rx="5" fill="#fff" stroke="#e3d6c8"/>${S[k]}</svg>`;
  return _tplThumb0(k);
};
/* ---------- รูปตรา → PNG (สำหรับไฟล์ Word) ---------- */
const PNGC = {};
function cachePng(src) { if (!src || PNGC[src]) return; const im = new Image(); im.onload = () => { try { const c = document.createElement('canvas'); c.width = im.naturalWidth; c.height = im.naturalHeight; c.getContext('2d').drawImage(im, 0, 0); PNGC[src] = { d: /^data:image\/(png|jpeg)/.test(src) ? src : c.toDataURL('image/png'), w: im.naturalWidth, h: im.naturalHeight }; } catch (e) { } }; im.src = src; }
setTimeout(() => { try { Object.values(LOGOS).forEach(cachePng); } catch (e) { } }, 500);
/* ---------- หัวกระดาษมีตรา (ใบปะหน้าข้อสอบ ฯลฯ) ---------- */
TYPES.logohead = 'หัวกระดาษมีตรา (ตรงกลาง + ข้อความ + เส้นใต้)'; OUT_LV.logohead = 1;
const _extNewLH = extNewBlock;
extNewBlock = function (b) { _extNewLH(b); if (b.t === 'logohead') Object.assign(b, { lg: 'school', html: 'หัวเรื่อง<br>บรรทัดที่ 2', rule: true }); };
const _extHTMLLH = extBlockHTML;
extBlockHTML = function (b) {
  const r = _extHTMLLH(b); if (r) return r;
  if (b.t === 'logohead') { const lg = logoOf(b.lg); if (lg) cachePng(lg); return `<div class="b-logohead${b.rule ? ' rule' : ''}">${lg ? `<img src="${lg}" alt="" style="height:${b.lh || 30}mm">` : ''}<div contenteditable="true" data-f="html" data-ph="ข้อความหัวกระดาษ"></div></div>`; }
  return '';
};
const _extInspLH = extInspector;
extInspector = function (b) {
  let h = _extInspLH(b);
  if (b.t === 'logohead') h += `<div class="ir"><button class="tb" onclick="pickLogo('ตรา', d => { const x = byId('${b.id}'); x.lg = d || ''; rerender(x.id); changed(true); })">เปลี่ยนตรา</button><button class="tb" onclick="const x = byId('${b.id}'); x.lg = ''; rerender(x.id); changed(true)">ไม่มีตรา</button></div><div class="ir"><label>ความสูงตรา (มม.)</label><input type="number" min="10" max="60" data-bn="lh" value="${b.lh || 30}"></div><div class="ir"><label><input type="checkbox" data-bc2="rule" ${b.rule ? 'checked' : ''}> เส้นคั่นด้านล่าง</label></div>`;
  if (b.t === 'table') h += `<div class="ir"><label><input type="checkbox" data-bc2="nob" ${b.nob ? 'checked' : ''}> ไม่มีเส้นตาราง (ใช้จัดข้อความเป็นคอลัมน์)</label></div>`;
  return h;
};
const _extXMLLH = extBlockXML;
extBlockXML = function (b, o) {
  const r = _extXMLLH(b, o); if (r) return r;
  if (b.t === 'logohead') { const lg = logoOf(b.lg), c = lg && PNGC[lg]; let out = '';
    if (c) { const m = /^data:image\/(png|jpeg);base64,(.*)$/.exec(c.d); if (m) { const hmm = +b.lh || 30, wmm = hmm * c.w / c.h; out += para([drawing(addMedia(m[2], m[1] === 'jpeg' ? 'jpg' : 'png'), wmm, hmm, ++DX.pic)], { jc: 'center', after: 120 }); } }
    const ps = htmlParas(b.html || '', {}); ps.forEach((p, i) => out += para(p.runs, { jc: 'center', after: 0, keep: true, border: b.rule && i === ps.length - 1 ? '<w:bottom w:val="single" w:sz="8" w:space="6" w:color="000000"/>' : undefined }));
    return out + para([], { after: 120 }); }
  return '';
};
/* ---------- 5) ใบปะหน้าข้อสอบกลางภาค / ปลายภาค ---------- */
PPL.meas = ['นางสุภาพ รัตนชัย', 'หัวหน้างานวัดผลประเมินผล']; PPL.acad2 = ['นางพานิชย์ ปัดถาทุม', 'หัวหน้ากลุ่มบริหารงานวิชาการ'];

const XC_RULES = ['ให้นักเรียนเขียนแสดงวิธีหาคำตอบทุกข้ออย่างละเอียด', 'สิ่งที่อนุญาตให้นำเข้าสอบ', '- ปากกา ดินสอ ยางลบ น้ำยาลบคำผิด', '- กระดาษ A4 จำนวน 1 แผ่น นำส่งกรรมการคุมสอบหลังการสอบ', 'ทุจริตปรับตกทุกกรณี'];
function xcPartRows(P) { const R = []; P.forEach((p, i) => { R.push(['', `1.${i + 1}`, esc(p[0] || ''), esc(p[1] || '')]); R.push(['', '', `จำนวน ${esc(String(p[2] ?? ''))} ข้อ`, `คิดเป็น ${esc(String(p[3] ?? ''))} คะแนน`]); }); return R; }
function xcOutRows(O) { const sum = o => { const v = o.slice(1, 4).map(x => +x || 0).reduce((a, x) => a + x, 0); return v ? String(v) : '-'; }; return [['ผลการเรียนรู้', 'ระดับพฤติกรรมด้าน', '', '', 'รวม (ข้อ)'], ['', 'K', 'P', 'A', ''], ...O.map((o, i) => [/^\d+\./.test(o[0] || '') ? esc(o[0]) : `${i + 1}. ${esc(o[0] || '')}`, o[1] || '-', o[2] || '-', o[3] || '-', sum(o)])]; }
function xcBlocks(m) {
  const B = []; const add = (t, x) => { const b = newBlock(t, x || {}); B.push(b); return b; };
  add('logohead', { lg: 'school', rule: true, lh: 26, html: m.head, xc: 'head' });
  add('pjtext', { noind: true, html: '<b>คำชี้แจง</b>' });
  add('pjtext', { noind: true, xc: 'pages', html: `${TAB}1. ข้อสอบ จำนวน ${esc(String(m.pages || '...'))} หน้า` });
  add('table', { rows: xcPartRows(m.parts), nob: true, al: 'left', rs: {}, cw: '9,7,36,48', full: true, compact: true, xc: 'parts' });
  let n = 1, sub = 0; const L = [];
  (m.rules || XC_RULES).forEach(l => { if (/^-/.test(l)) { sub++; L.push(`${TAB}${TAB}${n}.${sub} ${esc(l.replace(/^-\s*/, ''))}`); } else { n++; sub = 0; L.push(`${TAB}${n}. ${esc(l)}`); } });
  if (L.length) add('pjtext', { noind: true, html: L.join('<br>') });
  const O = m.outs && m.outs.length ? m.outs : [['...', '-', '-', '-']];
  add('table', { rows: xcOutRows(O), rs: { 0: 'L', 1: 'L' }, mg: { '0,0': [2, 1], '0,1': [1, 3], '0,4': [2, 1] }, full: true, al: 'first', cw: '55,10,10,10,15', xc: 'outs' });
  const S = [[m.teacher || PPL.me[0], 'ครูผู้สอน'], PPL.head, PPL.meas, PPL.acad2];
  add('memocmt', Object.assign({ n: 4, dl: 0 }, ...S.map((p, i) => ({ ['t' + i]: '', ['ck' + i]: '', ['name' + i]: `(${esc(p[0])})`, ['pos' + i]: esc(p[1]), ['dt' + i]: '' }))));
  return B;
}
function openExamCover() {
  docDlg('ใบปะหน้าข้อสอบ (กลางภาค / ปลายภาค)', [
    ['kind', 'ชนิดการสอบ', 'ปลายภาค', 's', [['ปลายภาค', 'สอบปลายภาค'], ['กลางภาค', 'สอบกลางภาค']]], ['subj', 'รายวิชา', 'คณิตศาสตร์เพิ่มเติม 5'],
    ['code', 'รหัสวิชา', 'ค33201'], ['level', 'ระดับชั้น / ห้อง', 'มัธยมศึกษาปีที่ 6/2, 6/3, 6/4 และ 6/5'], ['term', 'ภาคเรียนที่', '1'], ['year', 'ปีการศึกษา', '2569'], ['pages', 'ข้อสอบมีกี่หน้า', '8'], ['group', 'กลุ่มสาระ', 'กลุ่มสาระการเรียนรู้คณิตศาสตร์'],
    ['parts', 'ตอนของข้อสอบ: ชนิด | วัดทักษะ | จำนวนข้อ | คะแนน (บรรทัดละตอน)', 'ข้อสอบปรนัย 5 ตัวเลือก | วัดทักษะคิดเลขเร็วและทักษะการคิดคำนวณ | 10 | 5\nข้อสอบปรนัย เติมคำตอบ | วัดทักษะคิดเลขเร็วและทักษะการคิดคำนวณ | 5 | 5\nข้อสอบอัตนัย แสดงวิธีทำ | วัดทักษะการแก้โจทย์ปัญหา | 4 | 10', 't', 3],
    ['rules', 'ข้อชี้แจงอื่น ๆ (บรรทัดละข้อ · ขึ้นต้นด้วย - เพื่อเป็นข้อย่อย)', 'ให้นักเรียนเขียนแสดงวิธีหาคำตอบทุกข้ออย่างละเอียด\nสิ่งที่อนุญาตให้นำเข้าสอบ\n- ปากกา ดินสอ ยางลบ น้ำยาลบคำผิด\n- กระดาษ A4 จำนวน 1 แผ่น นำส่งกรรมการคุมสอบหลังการสอบ\nทุจริตปรับตกทุกกรณี', 't', 4],
    ['outs', 'ผลการเรียนรู้: ผลการเรียนรู้ | K | P | A (จำนวนข้อ · บรรทัดละข้อ)', 'หาผลบวกอนุกรมอนันต์ | - | 7 | -\nเห็นถึงความสำคัญของการปกป้องตนเองจากกลโกงของมิจฉาชีพ และสามารถวิเคราะห์ข้อมูลข่าวสารการเงินบนโลกออนไลน์จากสถานการณ์ที่กำหนด | 10 | - | -\nเข้าใจและนำความรู้เกี่ยวกับลำดับและอนุกรมไปใช้ในการแก้ปัญหาดอกเบี้ยทบต้น มูลค่าของเงิน ค่างวดและการวางแผนการเงินเพื่อใช้จ่ายยามเกษียณ | - | 3 | -', 't', 4],
    ['teacher', 'ครูผู้สอน', PPL.me[0]],
  ], V => {
    const B = xcBlocks({ head: `แบบทดสอบวัดผล${esc(V('kind'))} ${esc(V('group'))}<br>รายวิชา ${esc(V('subj'))}  รหัส ${esc(V('code'))}  ระดับชั้น${esc(V('level'))}<br>ภาคเรียนที่ ${esc(V('term'))} ปีการศึกษา ${esc(V('year'))}  ${SCHOOL}  ${AFF}`, pages: V('pages'),
      parts: lnz(V('parts')).map(l => l.split('|').map(x => x.trim())), rules: lnz(V('rules')), outs: lnz(V('outs')).map(l => l.split('|').map(x => x.trim())), teacher: V('teacher') });
    return { blocks: B, settings: Object.assign({ name: `ใบปะหน้าข้อสอบ${V('kind')} ${V('subj')}` }, NOHEAD, { pnPos: 'none' }), msg: 'สร้างใบปะหน้าข้อสอบแล้ว · ตาราง ผลการเรียนรู้ และผู้ลงนามแก้ได้ทุกช่อง' };
  }, 'ตราโรงเรียน · ชื่อการสอบ รายวิชา ภาคเรียน · คำชี้แจงจำนวนหน้า/ตอน/คะแนน · ตารางผลการเรียนรู้ K P A · ช่องลงนาม 4 ท่าน');
}
DOC_TEMPLATES.push(['ใบปะหน้าข้อสอบ (กลางภาค / ปลายภาค)', '', 'EXCOVER']);
TPL_META['ใบปะหน้าข้อสอบ (กลางภาค / ปลายภาค)'] = ['exam', 'ตราโรงเรียน คำชี้แจง ตอน/คะแนน ตารางผลการเรียนรู้ K P A และช่องลงนาม', 'excov'];
const _tplThumbX = tplThumb;
tplThumb = function (k) { if (k !== 'excov') return _tplThumbX(k); const L = (y, w, c = '#d9cfc6', x = 8) => `<rect x="${x}" y="${y}" width="${w}" height="3" rx="1.5" fill="${c}"/>`;
  return `<svg viewBox="0 0 64 82" width="58" height="74"><rect x=".5" y=".5" width="63" height="81" rx="5" fill="#fff" stroke="#e3d6c8"/><path d="M28 6h8v6l-4 3-4-3z" fill="#1f3ce6"/>${L(18, 30, '#555', 17)}${L(23, 40, '#999', 12)}<line x1="7" y1="29" x2="57" y2="29" stroke="#333"/>${L(33, 14, '#333')}${L(38, 34)}${L(43, 30)}<rect x="7" y="50" width="50" height="14" fill="none" stroke="#9fb0d8"/><rect x="7" y="50" width="50" height="4" fill="#dfe6f7"/>${L(68, 16, '#bbb', 10)}${L(68, 16, '#bbb', 38)}${L(74, 16, '#bbb', 10)}${L(74, 16, '#bbb', 38)}</svg>`; };

/* ===================== การไหลของเนื้อหา: ตารางตัดข้ามหน้า + หัวตารางซ้ำ + ดันลงหน้าใหม่ ===================== */
function offIn(n, root) { let y = 0; while (n && n !== root) { y += n.offsetTop; n = n.offsetParent; } return y; }
function tblHdrN(b, tbl) {
  if (b.norep) return 0; const plain = !(b.rs || b.full || b.cw || b.al || b.mg); if (plain) return 1;
  const rs = b.rs || { 0: 'L' }; let n = 0; while (n < tbl.rows.length - 1 && ['H', 'L'].includes(rs[n])) n++;
  // แถวหัวที่ถูกรวมลงมา (rowspan) ต้องนับรวมด้วย
  for (let k = 0; k < n; k++) $$('td', tbl.rows[k]).forEach(td => { n = Math.max(n, k + (td.rowSpan || 1)); });
  return Math.min(n, tbl.rows.length - 1);
}
function tblUnsplit() { $$('#flow tr.pgsp, #flow tr.rephd').forEach(tr => tr.remove()); }
function tblSplit(el) {
  const b = byId(el.dataset.id), tbl = $('table', el), flow = $('#flow'); if (!b || !tbl) return;
  const P = PAGE_H + PAGE_G, ROOM = PAGE_H - TOP - BOT; const hn = tblHdrN(b, tbl); const hdr = Array.from(tbl.rows).slice(0, hn);
  let first = true; const ncol = Math.max(1, ...Array.from(tbl.rows).map(r => Array.from(r.cells).reduce((a, c) => a + (c.colSpan || 1), 0)));
  for (let k = hn; k < tbl.rows.length; k++) {
    const tr = tbl.rows[k]; if (tr.classList.contains('pgsp') || tr.classList.contains('rephd')) continue;
    const top = offIn(tr, flow), bot = top + tr.offsetHeight; const p = Math.floor(top / P), re = p * P + PAGE_H - BOT;
    if (bot <= re + 1 || tr.offsetHeight > ROOM) { first = false; continue; }
    const tgt = (p + 1) * P + TOP;
    if (first) { // แถวข้อมูลแรกยังไม่พอ → ย้ายทั้งตารางไปหน้าใหม่
      const t0 = offIn(el, flow); el.style.marginTop = ((parseFloat(el.style.marginTop) || 0) + Math.max(0, tgt - offIn(tbl, flow))) + 'px'; if (offIn(el, flow) === t0) return; first = false; k = hn - 1; continue;
    }
    const sp = document.createElement('tr'); sp.className = 'pgsp'; sp.innerHTML = `<td colspan="${ncol}" style="height:${tgt - top}px"></td>`; tr.before(sp);
    hdr.forEach(h => { const c = h.cloneNode(true); c.classList.add('rephd'); $$('[contenteditable]', c).forEach(x => x.removeAttribute('contenteditable')); $$('[data-cell]', c).forEach(x => x.removeAttribute('data-cell')); tr.before(c); });
  }
}
const _extInspF = extInspector;
extInspector = function (b) {
  let h = _extInspF(b);
  if (b.t === 'table') h += `<div class="ir"><label><input type="checkbox" data-bnot="norep" ${b.norep ? '' : 'checked'}> ตารางยาวข้ามหน้า: ขึ้นหัวตารางซ้ำให้อัตโนมัติ</label></div>`;
  if (b.t !== 'pagebreak') h += `<div class="ir flowctl"><label><input type="checkbox" data-bc2="npg" ${b.npg ? 'checked' : ''}> ขึ้นหน้าใหม่ก่อนส่วนนี้ <span class="hint">(${IS_MAC ? '⌘⇧↓' : 'Ctrl+Shift+↓'})</span></label></div><div class="ir"><label>เว้นที่ว่างด้านบน (มม.)</label><input type="number" min="0" max="200" step="5" data-bn="sp" value="${b.sp || 0}"></div>`;
  return h;
};
function pushDown(step) {
  const b = byId(curId); if (!b) { toast('คลิกเลือกส่วนที่ต้องการก่อน'); return; }
  if (step === 'page') { b.npg = !b.npg; toast(b.npg ? 'ส่วนนี้ขึ้นหน้าใหม่แล้ว' : 'ยกเลิกการขึ้นหน้าใหม่'); }
  else { b.sp = Math.max(0, (+b.sp || 0) + step); }
  changed(true); schedulePaginate(); refreshInspector();
}
scAdd(IS_MAC ? '⌘⇧↓' : 'Ctrl+Shift+↓', 'ดันส่วนที่เลือกขึ้นหน้าใหม่ (กดซ้ำเพื่อยกเลิก)', 'จัดหน้า', () => pushDown('page'), e => M(e) && e.shiftKey && !e.altKey && e.key === 'ArrowDown');
scAdd(IS_MAC ? '⌥⌘↓' : 'Ctrl+Alt+↓', 'เลื่อนส่วนที่เลือกลง 10 มม.', 'จัดหน้า', () => pushDown(10), e => M(e) && e.altKey && e.key === 'ArrowDown');
scAdd(IS_MAC ? '⌥⌘↑' : 'Ctrl+Alt+↑', 'เลื่อนส่วนที่เลือกขึ้น 10 มม.', 'จัดหน้า', () => pushDown(-10), e => M(e) && e.altKey && e.key === 'ArrowUp');
function docHdrN(b) {
  if (b.norep) return 0; const rows = b.rows || []; const rs = b.rs || { 0: 'L' }; let n = 0; while (n < rows.length - 1 && ['H', 'L'].includes(rs[n])) n++;
  Object.entries(b.mg || {}).forEach(([k, v]) => { const i = +k.split(',')[0]; if (i < n) n = Math.max(n, i + v[0]); }); return Math.min(n, Math.max(0, rows.length - 1));
}
/* ---------- ลากเลื่อนเนื้อหาลง (เว้นที่ว่างด้านบน) แบบ Pages ---------- */
const _makeElF = makeEl;
makeEl = function (b) { const el = _makeElF(b); const v = document.createElement('div'); v.className = 'vgrip'; v.title = 'ลากลง = เลื่อนส่วนนี้และเนื้อหาด้านล่างลง เว้นที่ว่างด้านบนไว้แทรก · ลากขึ้น = ลดที่ว่าง · ดับเบิลคลิก = ไม่เว้น'; v.textContent = '↕'; el.appendChild(v); return el; };
function gapDraw(el, b) {
  const px = b && b.sp ? +b.sp * 3.7795 : 0; el.style.paddingTop = px ? px + 'px' : ''; el.style.setProperty('--gap', px + 'px');
  let g = el.querySelector(':scope > .gapph');
  if (!px) { if (g) g.remove(); return; }
  if (!g) { g = document.createElement('div'); g.className = 'gapph'; g.contentEditable = 'false'; g.innerHTML = `<button class="tb gapins">＋ แทรกเนื้อหาในที่ว่างนี้</button><span class="gapmm"></span>`; el.prepend(g); }
  g.style.height = px + 'px'; $('.gapmm', g).textContent = `ที่ว่าง ${Math.round(b.sp)} มม. · ลาก ↕ เพื่อปรับ`; g.classList.toggle('small', px < 34);
}
let vDrag = null, vRaf = 0;
document.addEventListener('pointerdown', e => {
  const v = e.target.closest && e.target.closest('#flow .vgrip'); if (!v) return; e.preventDefault(); e.stopPropagation();
  const el = v.closest('.blk'), b = byId(el.dataset.id); if (!b) return; if (typeof selectBlock === 'function') selectBlock(b.id);
  vDrag = { el, b, y: e.clientY, sp: +b.sp || 0, z: parseFloat(($('#zoomwrap') || {}).style?.zoom) || 1 }; document.body.classList.add('vdragging'); v.setPointerCapture && v.setPointerCapture(e.pointerId);
}, true);
document.addEventListener('pointermove', e => {
  if (!vDrag) return; const mm = (e.clientY - vDrag.y) / vDrag.z / 3.7795; vDrag.b.sp = Math.max(0, Math.min(250, Math.round(vDrag.sp + mm)));
  gapDraw(vDrag.el, vDrag.b); if (!vRaf) vRaf = requestAnimationFrame(() => { vRaf = 0; paginate(); });
});
document.addEventListener('pointerup', () => { if (!vDrag) return; const b = vDrag.b; vDrag = null; document.body.classList.remove('vdragging'); if (!b.sp) delete b.sp; changed(true); paginate(); if (curId === b.id) refreshInspector(); });
document.addEventListener('dblclick', e => { const v = e.target.closest && e.target.closest('#flow .vgrip'); if (!v) return; const b = byId(v.closest('.blk').dataset.id); if (b) { delete b.sp; gapDraw(v.closest('.blk'), b); changed(true); } });
document.addEventListener('click', e => {
  const btn = e.target.closest && e.target.closest('#flow .gapins'); if (!btn) return; e.preventDefault(); e.stopPropagation();
  const el = btn.closest('.blk'), b = byId(el.dataset.id); const i = doc.blocks.indexOf(b); const nb = newBlock('para', {}); doc.blocks.splice(i, 0, nb);
  const sp = +b.sp || 0; b.sp = 0; const ne = makeEl(nb); el.before(ne); gapDraw(el, b);
  const h = ne.offsetHeight / 3.7795; b.sp = Math.max(0, Math.round(sp - h)); if (!b.sp) delete b.sp; gapDraw(el, b);
  changed(true); if (typeof selectBlock === 'function') selectBlock(nb.id); const f = $('[contenteditable="true"]', ne); if (f) f.focus();
}, true);
/* ป้าย “คำถาม / ตอบ” อยู่บรรทัดเดียวกับข้อความเสมอ (แม้มีสมการสูง) — วัดความกว้างป้ายแล้วเยื้องแขวน */
function labelIndent() {
  $$('#flow .b-question, #flow .b-answer:not(.boxed)').forEach(w => { const l = w.querySelector('.ql, .al'); if (!l) return; l.style.width = 'auto'; const px = l.offsetWidth + 9; l.style.width = ''; w.style.setProperty('--lw', px + 'px'); });
}
/* ---------- กันหน้าจอกระโดดลงเองตอนพิมพ์ (โดยเฉพาะ iPad / Safari) ----------
   จำตำแหน่งเลื่อนก่อนพิมพ์ ถ้าเบราว์เซอร์เลื่อนจอไปเองทั้งที่เคอร์เซอร์ยังมองเห็นอยู่ที่ตำแหน่งเดิม ให้เลื่อนกลับ */
(function () {
  const sc = () => $('#scroller'); let s0 = null, w0 = 0, t0 = 0, userAt = 0;
  const inFlow = e => e.target && e.target.closest && e.target.closest('#flow');
  const save = () => { const s = sc(); if (!s) return; s0 = s.scrollTop; w0 = window.scrollY; t0 = Date.now(); };
  const caretRect = () => { const sel = getSelection(); if (sel.rangeCount) { const rs = sel.getRangeAt(0).getClientRects(); if (rs.length) return rs[rs.length - 1]; } const a = document.activeElement; return a && a.closest && a.closest('#flow') ? a.getBoundingClientRect() : null; };
  const fix = () => {
    const s = sc(); if (!s || s0 === null || Date.now() - t0 > 2000 || userAt > t0) return;
    if (window.scrollY !== w0 && document.documentElement.scrollHeight <= innerHeight + 4) window.scrollTo(window.scrollX, w0);
    const d = s.scrollTop - s0; if (Math.abs(d) < 6) return; const r = caretRect(); if (!r || (!r.height && !r.top)) return;
    const box = s.getBoundingClientRect(), vv = window.visualViewport; const vTop = Math.max(box.top, vv ? vv.offsetTop : 0), vBot = Math.min(box.bottom, vv ? vv.offsetTop + vv.height : innerHeight);
    const top = r.top + d, bot = r.bottom + d; if (top >= vTop + 4 && bot <= vBot - 4) s.scrollTop = s0;
  };
  const later = () => [0, 40, 120, 300, 600].forEach(ms => setTimeout(fix, ms));
  ['keydown', 'beforeinput', 'compositionstart'].forEach(ev => document.addEventListener(ev, e => { if (inFlow(e)) { save(); } }, true));
  document.addEventListener('pointerdown', e => { if (inFlow(e)) save(); }, true);
  document.addEventListener('focusin', e => { if (inFlow(e)) later(); }, true);
  document.addEventListener('input', e => { if (inFlow(e)) later(); }, true);
  document.addEventListener('compositionend', e => { if (inFlow(e)) later(); }, true);
  ['touchmove', 'wheel'].forEach(ev => document.addEventListener(ev, () => { userAt = Date.now(); }, { passive: true, capture: true }));
  document.addEventListener('keydown', e => { if (/^(PageUp|PageDown|ArrowUp|ArrowDown|Enter)$/.test(e.key)) userAt = Date.now() + 1; }, true); // ให้เลื่อนตามเคอร์เซอร์ได้ตามปกติเมื่อขึ้นบรรทัด/เลื่อนหน้า
  const s = () => sc(); setTimeout(() => { const x = s(); if (x) x.addEventListener('scroll', () => { if (s0 !== null && Date.now() - t0 < 800 && userAt <= t0) fix(); }, { passive: true }); }, 0);
})();
/* ---------- เปิด/ปิดหน้าต่าง (เช่น พิมพ์สมการ) แล้วจอไม่กระโดด ---------- */
(function () {
  let s0 = null, t0 = 0, user = 0;
  ['touchmove', 'wheel'].forEach(ev => document.addEventListener(ev, e => { if (!(e.target.closest && e.target.closest('.dlg'))) user = Date.now(); }, { passive: true, capture: true }));
  const _o = openDlg, _c = closeDlg;
  openDlg = function (sel) { const s = $('#scroller'); if (s) { s0 = s.scrollTop; t0 = Date.now(); } return _o(sel); };
  closeDlg = function (sel) { const r = _c(sel); const s = $('#scroller'); if (s && s0 !== null) { const keep = s0, tc = Date.now(); [0, 30, 100, 250, 500, 900].forEach(ms => setTimeout(() => { if (user < tc && Math.abs(s.scrollTop - keep) > 4 && !$('.dlg-back.open')) s.scrollTop = keep; }, ms)); } return r; };
})();
/* ===== Enter = ดันเนื้อหาลงจริง (แทรกบรรทัดว่างด้านบน) =====
   · เคอร์เซอร์อยู่ต้นข้อความของกล่อง/บล็อก แล้วกด Enter → บล็อกทั้งกล่องเลื่อนลง 1 บรรทัด (เนื้อหาด้านล่างเลื่อนตาม)
   · เลือกบล็อกเป็นกรอบ (กด Esc) แล้วกด Enter → ดันลงทีละบรรทัด · Backspace ต้นข้อความ/บนกรอบ → ดึงขึ้น (ลบบรรทัดว่างด้านบน)
   · Shift+Enter ตอนเลือกเป็นกรอบ = เข้าไปแก้ไขข้อความ */
function pushDown(id, keepEdit) {
  const i = idx(id); if (i < 0) return; const nb = newBlock('para'); doc.blocks.splice(i, 0, nb);
  const el = $(`.blk[data-id="${id}"]`); if (el) { el.before(makeEl(nb)); paginate(); } else renderAll();
  changed(true); return nb;
}
function isBlankPara(b) { return b && b.t === 'para' && !String(plainText(b.html || '')).replace(/[​\s]/g, '') && !/class="(mx|ic)|<img/.test(b.html || ''); }
function pullUp(id) {
  const i = idx(id); const pb = doc.blocks[i - 1]; if (!isBlankPara(pb)) return false;
  doc.blocks.splice(i - 1, 1); const pe = $(`.blk[data-id="${pb.id}"]`); if (pe) { pe.remove(); paginate(); } else renderAll(); changed(true); return true;
}
document.addEventListener('keydown', e => {
  if (e.isComposing || e.metaKey || e.ctrlKey || e.altKey || (typeof dlgOpen === 'function' && dlgOpen())) return;
  if (e.key !== 'Enter' && e.key !== 'Backspace') return;
  const t = e.target.closest && e.target.closest('#flow [contenteditable="true"]');
  if (t) { // กำลังพิมพ์
    if (e.shiftKey) return; const blk = t.closest('.blk'); if (!blk) return;
    if (edsOf(blk)[0] !== t) return; if (t.closest('li')) return;
    const s = getSelection(); if (!s.rangeCount || !s.isCollapsed) return;
    const ci = caretInfo(t); if (!ci.atStart) return;
    if (e.key === 'Enter') { if (isEmptyEd(t)) return; e.preventDefault(); e.stopImmediatePropagation(); const sc = $('#scroller'), y = sc && sc.scrollTop; pushDown(blk.dataset.id); if (sc) sc.scrollTop = y; caretToStart(t); return; }
    if (e.key === 'Backspace' && !isEmptyEd(t)) { const pb = doc.blocks[idx(blk.dataset.id) - 1]; if (isBlankPara(pb)) { e.preventDefault(); e.stopImmediatePropagation(); pullUp(blk.dataset.id); caretToStart(t); } }
    return;
  }
  // เลือกเป็นกรอบ
  if (typeof blockMode === 'undefined' || !blockMode || !curId || document.activeElement && /^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement.tagName)) return;
  if (e.key === 'Enter') {
    e.preventDefault(); e.stopImmediatePropagation();
    if (e.shiftKey) { const el = $(`.blk[data-id="${curId}"]`); const ed = el && $('[contenteditable="true"]', el); if (ed) { blockMode = false; selectBlock(curId); placeCaretEnd(ed); } return; }
    pushDown(curId); selectBlock(curId); enterBlockMode(); return;
  }
  if (e.key === 'Backspace' && selSet.size <= 1) { const pb = doc.blocks[idx(curId) - 1]; if (isBlankPara(pb)) { e.preventDefault(); e.stopImmediatePropagation(); pullUp(curId); selectBlock(curId); enterBlockMode(); } }
}, true);
function caretToStart(ed) { ed.focus({ preventScroll: true }); const r = document.createRange(); r.selectNodeContents(ed); r.collapse(true); const s = getSelection(); s.removeAllRanges(); s.addRange(r); }

