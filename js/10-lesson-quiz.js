'use strict';
/* ===================== แผนการจัดการเรียนรู้ · ตารางขั้นสูง ===================== */
Object.assign(TYPES, { lphead: 'หัวแผนการจัดการเรียนรู้', lpsec: 'หัวข้อแผน (1. 2. 3.)', lpbar: 'แถบคาบที่ / หัวเรื่องทึบ', lpstep: 'แถบขั้น (ขั้นนำ ขั้นสอน ขั้นสรุป)', lptext: 'ข้อความย่อหน้าเยื้อง', lpsign: 'ลงชื่อ (ครู / ผู้บริหาร)' });
THEMES.lp = { name: 'น้ำเงินสด (แผนการสอน)', dark: '#14248f', brown: '#1f3ce6', gold: '#b8860b', orange: '#3d5af1', sep: '#c5ccf7', bar: '#cdd5fd', chapA: '#14248f', chapB: '#1f3ce6' };
OUT_LV.lphead = 1; OUT_LV.lpsec = 2; OUT_LV.lpbar = 3;
['lpsec', 'lpbar', 'lpstep'].forEach(t => HEADINGS.add(t));
function extNewBlock(b) {
  if (b.t === 'lphead') Object.assign(b, { title: 'แผนการจัดการเรียนรู้', subj: 'รายวิชาคณิตศาสตร์เพิ่มเติม 5', grade: 'ชั้นมัธยมศึกษาปีที่ 6', term: 'ภาคเรียนที่ 1 ปีการศึกษา 2569', unit: 'หน่วยการเรียนรู้ที่ 1 ชื่อหน่วย', utime: 'เวลา ... คาบ', plan: 'แผนการจัดการเรียนรู้ที่ 1 เรื่อง ...', ptime: 'เวลา ... คาบ' });
  if (b.t === 'lpsec') b.html = '1. หัวข้อ';
  if (b.t === 'lpbar') b.html = 'แนวการจัดการเรียนรู้ คาบที่ 1';
  if (b.t === 'lpstep') b.html = 'ขั้นนำ';
  if (b.t === 'lptext') b.html = '';
  if (b.t === 'lpsign') Object.assign(b, { l1: 'ลงชื่อ ................................................', name: '(...............................................)', pos: 'ตำแหน่ง ครู' });
}
function extBlockHTML(b) {
  const E = (f, ph, cls = '') => `<div class="${cls}" contenteditable="true" data-f="${f}" data-ph="${ph}"></div>`;
  switch (b.t) {
    case 'lphead': return `<div class="b-lphead">${E('title', 'แผนการจัดการเรียนรู้', 'lpt')}<div class="lpr">${E('subj', 'รายวิชา')}${E('grade', 'ชั้น')}</div><div class="lpr">${E('term', 'ภาคเรียน/ปีการศึกษา')}${E('unit', 'หน่วยการเรียนรู้ที่ ...')}</div><div class="lpr">${E('utime', 'เวลาทั้งหน่วย')}${E('plan', 'แผนที่ ... เรื่อง ...')}${E('ptime', 'เวลา')}</div><div class="lpdot"></div></div>`;
    case 'lpsec': return `<div class="b-lpsec${b.sub ? ' sub' : ''}${b.ctr ? ' ctr' : ''}" contenteditable="true" data-f="html" data-ph="1. หัวข้อ"></div>`;
    case 'lpbar': return `<div class="b-lpbar" contenteditable="true" data-f="html" data-ph="แนวการจัดการเรียนรู้ คาบที่ 1"></div>`;
    case 'lpstep': return `<div class="b-lpstep" contenteditable="true" data-f="html" data-ph="ขั้นนำ"></div>`;
    case 'lptext': return `<div class="b-lptext" style="margin-left:${(b.ind ?? 2.6)}em" contenteditable="true" data-f="html" data-ph="พิมพ์ข้อความ... (กด 1. แล้วเว้นวรรคเพื่อทำรายการ)"></div>`;
    case 'lpsign': return `<div class="b-lpsign">${b.cap !== undefined ? E('cap', 'ความคิดเห็น', 'lpcap') : ''}${E('l1', 'ลงชื่อ ..........')}${E('name', '(ชื่อ-สกุล)')}${E('pos', 'ตำแหน่ง')}${b.date !== undefined ? E('date', 'วันที่ ......') : ''}</div>`;
  }
  return '';
}
/* ---------- ตารางขั้นสูง: กว้างเต็ม ความกว้างคอลัมน์ แถวหัวทึบ/แถวคร่อม ---------- */
const cwOf = b => { const a = Array.isArray(b.cw) ? b.cw : String(b.cw || '').split(/[,\s]+/).map(Number).filter(x => x > 0); return a.length ? a : null; };
const RS_OPTS = [['', 'ปกติ'], ['H', 'หัวตารางทึบ'], ['h', 'หัวตารางทึบ (คร่อมทุกคอลัมน์)'], ['S', 'หัวข้อย่อย (คร่อม · พื้นอ่อน)'], ['L', 'หัวตารางสีอ่อน']];
function buildTableX(el, b) {
  const w = $('.b-table', el); const rows = b.rows || [['']]; const n = Math.max(...rows.map(r => r.length)); const rs = b.rs || (b.rs === undefined ? { 0: 'L' } : {}); const cw = cwOf(b);
  const al = j => b.al === 'left' ? 'l' : b.al === 'first' ? (j === 0 ? 'l' : 'c') : 'c';
  let h = `<table class="tx${b.full ? ' full' : ''}${b.compact ? ' compact' : ''}">${cw ? `<colgroup>${Array.from({ length: n }, (_, j) => `<col style="width:${(cw[j] || cw[cw.length - 1]) / cw.slice(0, n).reduce((a, x) => a + x, 0) * 100 || 100 / n}%">`).join('')}</colgroup>` : ''}`;
  rows.forEach((r, i) => { const st = rs[i] || ''; h += '<tr>'; if (st === 'h' || st === 'S') h += `<td colspan="${n}" class="rs-${st}" contenteditable="true" data-cell="${i},0"></td>`; else r.forEach((c, j) => h += `<td class="${st ? 'rs-' + st : 'al-' + al(j)}" contenteditable="true" data-cell="${i},${j}"></td>`); h += '</tr>'; });
  w.innerHTML = h + '</table>';
  $$('td', w).forEach(td => { const [i, j] = td.dataset.cell.split(',').map(Number); setHTML(td, (rows[i] || [])[j] || ''); });
}
function curTableRow(id) { const s = getSelection(); const n = s.rangeCount ? s.getRangeAt(0).startContainer : null; let td = n && (n.nodeType === 1 ? n : n.parentElement).closest('td[data-cell]'); if ((!td || !td.closest(`.blk[data-id="${id}"]`)) && lastRange) { const m = lastRange.startContainer; td = (m.nodeType === 1 ? m : m.parentElement).closest('td[data-cell]'); } if (!td || !td.closest(`.blk[data-id="${id}"]`)) return -1; return +td.dataset.cell.split(',')[0]; }
function tblRowStyle(v) { const b = byId(curId); if (!b || b.t !== 'table') return; const r = curTableRow(b.id); if (r < 0) { toast('คลิกในแถวของตารางก่อน แล้วเลือกใหม่'); return; } if (b.rs === undefined) b.rs = { 0: 'L' }; if (v) b.rs[r] = v; else delete b.rs[r]; rerender(b.id); changed(true); refreshInspector(); }
function extInspector(b) {
  if (b.t === 'table') {
    const r = curTableRow(b.id); const cur = r >= 0 ? ((b.rs || (b.rs === undefined ? { 0: 'L' } : {}))[r] || '') : '';
    return `<div class="ir"><label><input type="checkbox" data-bc2="full" ${b.full ? 'checked' : ''}> กว้างเต็มหน้า</label></div>
      <div class="ir"><label>ความกว้างคอลัมน์ (สัดส่วน)</label><input type="text" data-bt="cw" value="${esc(Array.isArray(b.cw) ? b.cw.join(',') : b.cw || '')}" placeholder="เช่น 35,20,25,20"></div>
      <div class="ir"><label>จัดข้อความในช่อง</label><select data-b="al">${[['', 'กึ่งกลาง'], ['left', 'ชิดซ้าย'], ['first', 'คอลัมน์แรกชิดซ้าย']].map(([k, v]) => `<option value="${k}"${(b.al || '') === k ? ' selected' : ''}>${v}</option>`).join('')}</select></div>
      <div class="ir"><label>แถวที่เคอร์เซอร์อยู่${r >= 0 ? ` (แถว ${r + 1})` : ''}</label><select onchange="tblRowStyle(this.value)">${RS_OPTS.map(([k, v]) => `<option value="${k}"${cur === k ? ' selected' : ''}>${v}</option>`).join('')}</select></div>
      <p class="hint" style="font-size:14px">ปุ่มบนตาราง: ↧แ แทรกแถวใต้แถวที่เลือก · ✕แ ลบแถวที่เลือก</p>`;
  }
  if (b.t === 'lpsec') return `<div class="ir"><label><input type="checkbox" data-bc2="sub" ${b.sub ? 'checked' : ''}> หัวข้อย่อย (เยื้อง เช่น 3.1)</label></div><div class="ir"><label><input type="checkbox" data-bc2="ctr" ${b.ctr ? 'checked' : ''}> จัดกึ่งกลาง</label></div>`;
  if (b.t === 'lptext') return `<div class="ir"><label>เยื้องซ้าย (em)</label><input type="number" min="0" max="10" step=".5" data-bn="ind" value="${b.ind ?? 2.6}"></div>`;
  return '';
}
flowEl.addEventListener('focusin', e => { const td = e.target.closest && e.target.closest('td[data-cell]'); if (td) setTimeout(() => { const b = byId(curId); if (b && b.t === 'table') refreshInspector(); }, 0); });
/* ---------- Word ---------- */
function tableXML(b, C, keep) {
  const rows = b.rows || []; if (!rows.length) return ''; const n = Math.max(...rows.map(r => r.length)); const adv = b.rs || b.full || b.cw || b.al;
  const rs = b.rs || (adv ? { 0: 'L' } : { 0: 'L' }); const W = b.full ? DX.cw : Math.min(DX.cw, n * 1700); const cw = cwOf(b);
  const cols = cw ? Array.from({ length: n }, (_, j) => (cw[j] || cw[cw.length - 1])).map((x, _, a) => W * x / a.reduce((s, y) => s + y, 0)) : Array(n).fill(W / n);
  const jc = j => b.al === 'left' ? 'left' : b.al === 'first' ? (j === 0 ? 'left' : 'center') : 'center';
  const out = rows.map((r, i) => { const st = rs[i] || '';
    const solid = st === 'H' || st === 'h', base = solid ? { b: true, color: 'FFFFFF' } : st === 'S' || st === 'L' ? { b: true, color: C('dark') } : {};
    const fill = solid ? C('brown') : st === 'S' ? C('bar') : st === 'L' ? 'FBEFE7' : undefined;
    const mk = (h, j, span) => cell(htmlParas(h || '', base).map(p => para(p.runs, { jc: span ? (st === 'h' ? 'left' : 'left') : (st ? 'center' : jc(j)), after: 0, keep })).join(''), { fill, span, w: span ? W : cols[j], bc: adv ? C('brown') : undefined, vAlign: 'center' });
    return (st === 'h' || st === 'S') ? [mk(r[0], 0, n)] : Array.from({ length: n }, (_, j) => mk(r[j], j)); });
  return table(out, { w: W, cols, center: !b.full, hdr: docHdrN(b) });
}
function extBlockXML(b, o) {
  const { C, keep } = o; const T = (h, f) => [].concat(...htmlParas(h || '', f).map(p => p.runs));
  switch (b.t) {
    case 'lphead': {
      const ttl = table([[cell(para(T(b.title, { b: true, color: 'FFFFFF', size: DX.base * 1.25 }), { jc: 'center', after: 0, keep: true, style: 'Heading1' }), { fill: C('brown'), bc: C('brown'), pt: 60, pb: 60 })]], {});
      const f = { b: true, color: C('brown') }, tabs = [['center', Math.round(DX.cw / 2)], ['right', DX.cw]];
      const row = (a, m, z) => para([].concat(T(a, f), [tabRun({})], m ? T(m, f) : [], [tabRun({})], T(z, f)), { tabs, after: 60, keep: true });
      return ttl + row(b.subj, '', b.grade) + row(b.term, '', b.unit) + row(b.utime, b.plan, b.ptime) + para([], { border: `<w:bottom w:val="dotted" w:sz="12" w:space="1" w:color="${C('brown')}"/>`, after: 120 });
    }
    case 'lpsec': return para(T(b.html, { b: true, color: C('brown'), size: DX.base * 1.05 }), { style: b.sub ? 'Heading3' : 'Heading2', keep: true, after: 40, ind: b.sub ? 700 : 0, jc: b.ctr ? 'center' : undefined });
    case 'lpbar': return table([[cell(para(T(b.html, { b: true, color: 'FFFFFF', size: DX.base * 1.15 }), { jc: 'center', after: 0, keep: true, style: 'Heading3' }), { fill: C('brown'), bc: C('brown'), pt: 50, pb: 50 })]], {});
    case 'lpstep': return table([[cell(para(T(b.html, { b: true, color: C('brown') }), { after: 0, keep: true }), { fill: C('bar'), bc: C('bar'), pt: 50, pb: 50 })]], {});
    case 'lptext': return htmlParas(b.html || '', {}).map(p => para(p.runs, { ind: Math.round((b.ind ?? 2.6) * 13.13 * 0.75 * 20), jc: p.jc, keep })).join('');
    case 'lpsign': { const ind = Math.round(DX.cw * 0.42); return [b.cap !== undefined ? para(T(b.cap, { b: true }), { after: 60 }) : '', para(T(b.l1, {}), { jc: 'center', ind, after: 0 }), para(T(b.name, {}), { jc: 'center', ind, after: 0 }), para(T(b.pos, {}), { jc: 'center', ind, after: 0 }), b.date !== undefined ? para(T(b.date, {}), { jc: 'center', ind, after: 60 }) : ''].join(''); }
  }
  return '';
}

/* ===================== ตัวสร้างแผนการจัดการเรียนรู้ ===================== */
const COMPETENCIES = ['ความสามารถในการสื่อสาร', 'ความสามารถในการคิด', 'ความสามารถในการแก้ปัญหา', 'ความสามารถในการใช้ทักษะชีวิต', 'ความสามารถในการใช้เทคโนโลยี'];
const ATTRS = ['รักชาติ ศาสน์ กษัตริย์', 'ซื่อสัตย์สุจริต', 'มีวินัย', 'ใฝ่เรียนรู้', 'อยู่อย่างพอเพียง', 'มุ่งมั่นในการทำงาน', 'รักความเป็นไทย', 'มีจิตสาธารณะ'];
const MATH_SKILLS = ['การแก้ปัญหา', 'การสื่อสารและการสื่อความหมายทางคณิตศาสตร์', 'การเชื่อมโยง', 'การให้เหตุผล', 'การคิดสร้างสรรค์'];
const MODELS = {
  three: ['ขั้นนำ', 'ขั้นสอน', 'ขั้นสรุป'],
  four: ['ขั้นนำ', 'ขั้นสอน', 'ขั้นฝึกทักษะ', 'ขั้นสรุป'],
  e5: ['ขั้นที่ 1 ขั้นสร้างความสนใจ (Engagement)', 'ขั้นที่ 2 ขั้นสำรวจและค้นหา (Exploration)', 'ขั้นที่ 3 ขั้นอธิบายและลงข้อสรุป (Explanation)', 'ขั้นที่ 4 ขั้นขยายความรู้ (Elaboration)', 'ขั้นที่ 5 ขั้นประเมิน (Evaluation)'],
  e7: ['ขั้นที่ 1 ขั้นตรวจสอบความรู้เดิม (Elicitation)', 'ขั้นที่ 2 ขั้นเร้าความสนใจ (Engagement)', 'ขั้นที่ 3 ขั้นสำรวจและค้นหา (Exploration)', 'ขั้นที่ 4 ขั้นอธิบายและลงข้อสรุป (Explanation)', 'ขั้นที่ 5 ขั้นขยายความรู้ (Elaboration)', 'ขั้นที่ 6 ขั้นประเมินผล (Evaluation)', 'ขั้นที่ 7 ขั้นนำความรู้ไปใช้ (Extension)'],
  inq: ['ขั้นนำเข้าสู่บทเรียน', 'ขั้นสอน (ใช้คำถามนำสู่ข้อสรุป)', 'ขั้นฝึกทักษะ', 'ขั้นนำไปใช้', 'ขั้นสรุป'],
};
const STEP_SEED = {
  'ขั้นนำ': ['ครูและนักเรียนกล่าวสวัสดีทักทายกัน', 'ครูตั้งคำถามกระตุ้นความสนใจเกี่ยวกับ ... และให้นักเรียนร่วมกันแสดงความคิดเห็น'],
  'ขั้นสอน': ['ครูอธิบาย ... โดยใช้ตัวอย่างประกอบ', 'ครูให้นักเรียนจับคู่ทำใบกิจกรรมที่ ... ระหว่างที่นักเรียนทำกิจกรรม ครูเดินดูให้ทั่วถึงทุกคน เพื่อสังเกตการทำงานและฟังบทสนทนาของนักเรียน', 'ครูสุ่มนักเรียนออกมานำเสนอคำตอบหน้าห้องเรียน'],
  'ขั้นฝึกทักษะ': ['ครูให้นักเรียนทำแบบฝึกทักษะที่ ... ข้อ ...', 'ครูและนักเรียนร่วมกันตรวจคำตอบและอภิปรายข้อผิดพลาดที่พบบ่อย'],
  'ขั้นสรุป': ['ครูและนักเรียนร่วมกันสรุปว่า ...', 'ครูมอบหมายงาน ... เป็นการบ้าน'],
};
function lpDlg() {
  if ($('#dLP')) return;
  const d = document.createElement('div'); d.className = 'dlg-back'; d.id = 'dLP';
  const chk = (name, list, on) => `<div class="lpck">${list.map((x, i) => `<label><input type="checkbox" data-${name}="${i}"${on.includes(i) ? ' checked' : ''}> ${x}</label>`).join('')}</div>`;
  const I = (id, lab, v, w) => `<label class="lpf${w ? ' w' : ''}"><small>${lab}</small><input type="text" id="${id}" value="${esc(v)}"></label>`;
  const A = (id, lab, v, rows = 3) => `<label class="lpf w"><small>${lab}</small><textarea id="${id}" rows="${rows}">${esc(v)}</textarea></label>`;
  d.innerHTML = `<div class="dlg" style="width:980px;max-height:94vh;overflow:auto"><h3>ตัวสร้างแผนการจัดการเรียนรู้</h3>
    <p class="hint">กรอกเท่าที่มี ส่วนที่เหลือแก้ในเอกสารได้ทุกตัวอักษร · ช่องที่เป็นรายการให้พิมพ์บรรทัดละ 1 ข้อ</p>
    <div class="lpgrid">
      ${I('lpSubj', 'รายวิชา', 'คณิตศาสตร์เพิ่มเติม 5')}${I('lpGrade', 'ชั้น', 'มัธยมศึกษาปีที่ 6')}${I('lpTerm', 'ภาคเรียนที่', '1')}${I('lpYear', 'ปีการศึกษา', '2569')}
      ${I('lpUnitNo', 'หน่วยการเรียนรู้ที่', '2')}${I('lpUnit', 'ชื่อหน่วย', 'คณิตศาสตร์การเงิน')}${I('lpUTime', 'เวลาทั้งหน่วย (คาบ)', '17')}${I('lpNo', 'แผนที่', '1')}
      ${I('lpTopic', 'เรื่อง', 'ภัยทางการเงิน', 1)}${I('lpHrs', 'จำนวนคาบของแผนนี้', '3')}
      <label class="lpf"><small>รูปแบบการสอน</small><select id="lpModel"><option value="three">ขั้นนำ · ขั้นสอน · ขั้นสรุป</option><option value="four">ขั้นนำ · ขั้นสอน · ขั้นฝึกทักษะ · ขั้นสรุป</option><option value="e5">5E (สืบเสาะหาความรู้)</option><option value="e7">7E</option><option value="inq">อุปนัย / ใช้คำถาม</option></select></label>
    </div>
    ${A('lpOut', 'ผลการเรียนรู้ / ตัวชี้วัด', 'เข้าใจและนำความรู้เกี่ยวกับ ... ไปใช้ในการแก้ปัญหา', 2)}
    ${A('lpCore', 'สาระสำคัญ (หลายบรรทัด = 2.1, 2.2, ...)', '...', 3)}
    <div class="lpgrid3">${A('lpK', 'จุดประสงค์ ด้านความรู้ (K)', 'อธิบาย ... ได้\nคำนวณ ... ได้', 4)}${A('lpP', 'ด้านทักษะและกระบวนการทางคณิตศาสตร์ (P)', 'แก้ปัญหาได้\nให้เหตุผลได้', 4)}${A('lpA', 'ด้านคุณลักษณะอันพึงประสงค์ในการเรียนคณิตศาสตร์ (A)', 'มีความมุมานะในการทำความเข้าใจปัญหาและแก้ปัญหาทางคณิตศาสตร์\nสร้างเหตุผลเพื่อสนับสนุนแนวคิดของตนเองหรือโต้แย้งแนวคิดของผู้อื่นอย่างสมเหตุสมผล', 4)}</div>
    <div class="lpgrid2"><div><small>สมรรถนะสำคัญของผู้เรียน</small>${chk('cmp', COMPETENCIES, [0, 2])}</div><div><small>คุณลักษณะอันพึงประสงค์</small>${chk('atr', ATTRS, [3, 5])}</div></div>
    <div class="lpgrid3">${A('lpContent', 'สาระการเรียนรู้ (บรรทัดละ 1 หัวข้อ)', '...', 3)}${A('lpMedia', 'สื่อและแหล่งการเรียนรู้', 'ใบกิจกรรมที่ 1\nใบความรู้ที่ 1\nสื่อนำเสนอ ...', 3)}${A('lpTools', 'วิธีวัด / เครื่องมือ ด้านความรู้', 'ตรวจใบกิจกรรมที่ 1\nใบกิจกรรมที่ 1', 3)}</div>
    <div class="lpgrid">${I('lpTeacher', 'ชื่อครูผู้สอน', (doc.settings.au || 'นายศาสตราวุฒิ อาชนะชัย'))}${I('lpPos', 'ตำแหน่ง', 'ครู')}${I('lpN', 'จำนวนนักเรียน (แบบประเมิน)', '30')}${I('lpPass', 'เกณฑ์ผ่านด้านความรู้ (ร้อยละ)', '60')}</div>
    <div><small>ส่วนประกอบเพิ่มเติม</small><div class="lpck">
      <label><input type="checkbox" id="lpEval" checked> 9. การวัดและประเมินผล (ตาราง)</label><label><input type="checkbox" id="lpRec" checked> 10. บันทึกผลหลังการจัดการเรียนรู้</label>
      <label><input type="checkbox" id="lpHead" checked> ความคิดเห็นหัวหน้ากลุ่มสาระฯ</label><label><input type="checkbox" id="lpDir" checked> ความคิดเห็นผู้บริหาร</label>
      <label><input type="checkbox" id="lpSheetK" checked> แบบประเมินด้านความรู้ (K) รายชื่อ</label><label><input type="checkbox" id="lpSheetA"> แบบประเมินคุณลักษณะอันพึงประสงค์</label>
      <label><input type="checkbox" id="lpSheetC"> แบบประเมินสมรรถนะ</label><label><input type="checkbox" id="lpRubric" checked> เกณฑ์การประเมิน (รูบริก)</label>
      <label><input type="checkbox" id="lpPgNum" checked> เลขหน้ามุมบนขวา (ไม่แสดงหน้าแรก)</label><label><input type="checkbox" id="lpTheme" checked> โทนสีน้ำเงินแบบแผนการสอน</label></div></div>
    <div class="actions"><button class="tb" id="lpCancel">ยกเลิก</button><button class="tb" id="lpAppend">เพิ่มต่อท้ายเอกสารนี้</button><button class="tb primary" id="lpNew">สร้างเป็นเอกสารใหม่</button></div></div>`;
  document.body.appendChild(d);
  $('#lpCancel').onclick = () => closeDlg('#dLP');
  $('#lpNew').onclick = () => lpBuild(true); $('#lpAppend').onclick = () => lpBuild(false);
}
function openLessonPlan() { lpDlg(); openDlg('#dLP'); }
const lpLines = id => String($('#' + id).value || '').split('\n').map(x => x.trim()).filter(Boolean);
const olHTML = (arr, start = 1, ls) => arr.length ? `<ol${start > 1 ? ` start="${start}"` : ''}${ls ? ` data-ls="${ls}"` : ''}>${arr.map(x => `<li>${esc(x)}</li>`).join('')}</ol>` : '';
const DOTS = '.'.repeat(150);
function lpBuild(fresh) {
  const v = id => $('#' + id).value.trim(); const N = (x, d) => Math.max(1, Math.min(60, +x || d));
  const K = lpLines('lpK'), P = lpLines('lpP'), Aa = lpLines('lpA'), core = lpLines('lpCore'), cont = lpLines('lpContent'), media = lpLines('lpMedia'), tools = lpLines('lpTools');
  const cmp = $$('#dLP [data-cmp]').filter(x => x.checked).map(x => COMPETENCIES[+x.dataset.cmp]), atr = $$('#dLP [data-atr]').filter(x => x.checked).map(x => ATTRS[+x.dataset.atr]);
  const hrs = N(v('lpHrs'), 1), steps = MODELS[$('#lpModel').value] || MODELS.three; const pass = v('lpPass') || '60';
  const B = []; const add = (t, x) => { const b = newBlock(t, x || {}); B.push(b); return b; };
  add('lphead', { subj: 'รายวิชา' + v('lpSubj'), grade: 'ชั้น' + v('lpGrade'), term: `ภาคเรียนที่ ${v('lpTerm')} ปีการศึกษา ${v('lpYear')}`, unit: `หน่วยการเรียนรู้ที่ ${v('lpUnitNo')} ${v('lpUnit')}`, utime: `เวลา ${v('lpUTime')} คาบ`, plan: `แผนการจัดการเรียนรู้ที่ ${v('lpNo')} เรื่อง${v('lpTopic')}`, ptime: `เวลา ${hrs} คาบ` });
  add('lpsec', { html: '1. ผลการเรียนรู้' }); add('lptext', { html: esc(v('lpOut')).replace(/\n/g, '<br>') });
  add('lpsec', { html: '2. สาระสำคัญ' }); add('lptext', { html: core.length > 1 ? core.map((x, i) => `2.${i + 1}<span class="tab">\t</span>​${esc(x)}`).join('<br>') : esc(core[0] || '') });
  add('lpsec', { html: '3. จุดประสงค์การเรียนรู้' });
  [['3.1 ด้านความรู้ (K)', 'นักเรียนสามารถ', K], ['3.2 ด้านทักษะและกระบวนการทางคณิตศาสตร์ (P)', 'นักเรียนมีความสามารถ', P], ['3.3 ด้านคุณลักษณะอันพึงประสงค์ในการเรียนคณิตศาสตร์ (A)', 'นักเรียนมีคุณลักษณะอันพึงประสงค์ในการเรียนรู้คณิตศาสตร์ ดังนี้', Aa]].forEach(([h, lead, arr]) => { add('lpsec', { html: h, sub: true }); add('lptext', { ind: 4.6, html: lead + olHTML(arr) }); });
  add('lpsec', { html: '4. สมรรถนะสำคัญของผู้เรียน' }); add('lptext', { html: 'นักเรียนมีความสามารถในด้านต่าง ๆ ดังนี้' + olHTML(cmp.map(x => x.replace(/^ความสามารถใน/, ''))) });
  add('lpsec', { html: '5. คุณลักษณะอันพึงประสงค์' }); add('lptext', { html: 'นักเรียนมีคุณลักษณะอันพึงประสงค์ในด้านต่าง ๆ ดังนี้' + olHTML(atr) });
  add('lpsec', { html: '6. สาระการเรียนรู้' }); add('lptext', { html: cont.length ? `<ul>${cont.map(x => `<li>${esc(x)}</li>`).join('')}</ul>` : '' });
  add('lpsec', { html: '7. กิจกรรมการเรียนรู้' });
  for (let k = 1; k <= hrs; k++) {
    add('lpbar', { html: `แนวการจัดการเรียนรู้ คาบที่ ${k}` }); let no = 1;
    steps.forEach(st => { add('lpstep', { html: st }); const key = Object.keys(STEP_SEED).find(s => st.startsWith(s)); const seed = (k > 1 && key === 'ขั้นนำ') ? ['ครูและนักเรียนกล่าวสวัสดีทักทายกัน', 'ครูทบทวนความรู้จากคาบที่แล้วเกี่ยวกับ ...'] : (STEP_SEED[key] || ['ครู ...', 'นักเรียน ...']);
      add('lptext', { html: olHTML(seed, no) }); no += seed.length; });
  }
  add('lpsec', { html: '8. สื่อและแหล่งการเรียนรู้' }); add('lptext', { html: media.map((x, i) => `8.${i + 1}<span class="tab">\t</span>​${esc(x)}`).join('<br>') });
  if ($('#lpEval').checked) {
    add('lpsec', { html: '9. การวัดและประเมินผล' });
    const R = [['จุดประสงค์การเรียนรู้', 'วิธีการวัดผล', 'เครื่องมือวัดผล', 'เกณฑ์การประเมิน']], rs = { 0: 'H' };
    const sec = t => { rs[R.length] = 'S'; R.push([t, '', '', '']); };
    sec('ด้านความรู้'); K.forEach((x, i) => R.push([`${i + 1}. ${esc(x)} (K)`, esc(tools[0] || 'ตรวจใบกิจกรรม'), esc(tools[1] || 'ใบกิจกรรม'), `นักเรียนได้คะแนนร้อยละ ${pass} ขึ้นไปถือว่าผ่าน`]));
    sec('ด้านทักษะและกระบวนการทางคณิตศาสตร์'); R.push([`นักเรียนมีความสามารถ<br>${P.map((x, i) => `${i + 1}. ${esc(x)}`).join('<br>')}`, 'ตรวจใบกิจกรรม', 'ใบกิจกรรม', 'นักเรียนที่มีผลระดับคุณภาพ ดี ขึ้นไปผ่านเกณฑ์']);
    sec('ด้านคุณลักษณะอันพึงประสงค์ในการเรียนคณิตศาสตร์'); R.push([Aa.map((x, i) => `${i + 1}. ${esc(x)}`).join('<br>'), 'สังเกตพฤติกรรม', 'แบบสังเกตพฤติกรรม', 'นักเรียนที่มีผลระดับคุณภาพ ดี ขึ้นไปผ่านเกณฑ์']);
    R.push([`<b>คุณลักษณะอันพึงประสงค์</b><br>${atr.map(x => '- ' + esc(x)).join('<br>')}`, 'สังเกตพฤติกรรม', 'แบบประเมินคุณลักษณะอันพึงประสงค์', 'นักเรียนที่มีผลระดับคุณภาพ ดี ขึ้นไปผ่านเกณฑ์']);
    R.push([`<b>สมรรถนะสำคัญของผู้เรียน</b><br>${cmp.map(x => '- ' + esc(x)).join('<br>')}`, 'สังเกตพฤติกรรม', 'แบบประเมินสมรรถนะสำคัญของผู้เรียน', 'นักเรียนที่มีผลระดับคุณภาพ ดี ขึ้นไปผ่านเกณฑ์']);
    add('table', { rows: R, rs, full: true, cw: '34,20,24,22', al: 'first' });
  }
  if ($('#lpRec').checked) {
    add('lpsec', { html: '10. บันทึกผลหลังการจัดการเรียนรู้' });
    const R = [['ผลหลังการจัดการเรียนรู้']], rs = { 0: 'h' }; const S = t => { rs[R.length] = 'S'; R.push([t]); };
    const pf = x => `${esc(x)}<br><span class="tab">\t</span>​ผ่าน ร้อยละ ................<span class="tab">\t</span><span class="tab">\t</span>​ไม่ผ่าน ร้อยละ ................`;
    const sum = x => `${esc(x)}<br>สรุป ผลการประเมินรวม ไม่ผ่าน (0) ...... คน ผ่าน (1) ...... คน ดี (2) ...... คน ดีเยี่ยม (3) ...... คน`;
    S('ด้านความรู้'); K.forEach((x, i) => R.push([pf(`${i + 1}. ${x}`) + '<br>' + DOTS]));
    S('ด้านทักษะและกระบวนการทางคณิตศาสตร์'); R.push([P.map((x, i) => pf(`${i + 1}. ${x}`)).join('<br>') + '<br>' + DOTS]);
    S('ด้านคุณลักษณะอันพึงประสงค์ในการเรียนคณิตศาสตร์'); R.push([Aa.map((x, i) => pf(`${i + 1}. ${x}`)).join('<br>') + '<br>' + DOTS]);
    S('คุณลักษณะอันพึงประสงค์ตามหลักสูตร'); R.push([atr.map((x, i) => sum(`${i + 1}. ${x}`)).join('<br>') + '<br>' + DOTS]);
    S('สมรรถนะสำคัญของผู้เรียนตามหลักสูตร'); R.push([cmp.map((x, i) => sum(`${i + 1}. ${x}`)).join('<br>') + '<br>' + DOTS]);
    rs[R.length] = 'h'; R.push(['ปัญหา อุปสรรค และแนวทางแก้ไข']); R.push([[DOTS, DOTS, DOTS].join('<br>')]);
    rs[R.length] = 'h'; R.push(['ข้อเสนอแนะ']); R.push([[DOTS, DOTS].join('<br>')]);
    add('table', { rows: R, rs, full: true, al: 'left' });
    add('lpsign', { l1: 'ลงชื่อ ................................................', name: `(${v('lpTeacher')})`, pos: `ตำแหน่ง ${v('lpPos')}` });
  }
  const comment = (cap, pos) => { add('lpsign', { cap: `<b>${cap}</b><br>${DOTS}<br>${DOTS}<br>${DOTS}`, l1: 'ลงชื่อ ................................................', name: '(...............................................)', pos, date: 'วันที่ ......... เดือน .................... พ.ศ. ..........' }); };
  if ($('#lpHead').checked) comment('ความคิดเห็นของหัวหน้ากลุ่มสาระการเรียนรู้คณิตศาสตร์', 'หัวหน้ากลุ่มสาระการเรียนรู้คณิตศาสตร์');
  if ($('#lpDir').checked) comment('ความคิดเห็นของผู้บริหารสถานศึกษา', 'ผู้อำนวยการโรงเรียน');
  const n = N(v('lpN'), 30);
  if ($('#lpSheetK').checked && K.length) {
    add('pagebreak'); add('lpsec', { html: 'แบบประเมินผลด้านความรู้ (K)', ctr: true });
    add('lptext', { ind: 0, html: `<b>คำชี้แจง :</b> ครูผู้ตรวจงานนักเรียน แล้วลงคะแนนในแต่ละข้อ<br>${K.map((x, i) => `<span class="tab">\t</span>​ข้อ ${i + 1}<span class="tab">\t</span>​${esc(x)} (K)`).join('<br>')}` });
    const hd = ['เลขที่', 'ชื่อ - นามสกุล']; K.forEach((_, i) => hd.push(`ข้อ ${i + 1}<br>คะแนน`, `ข้อ ${i + 1}<br>ผลการประเมิน`));
    const R = [hd]; for (let i = 1; i <= n; i++) R.push([String(i), '', ...K.flatMap(() => ['', ''])]);
    add('table', { rows: R, rs: { 0: 'L' }, full: true, compact: true, cw: [7, 35, ...K.flatMap(() => [10, 10])].join(',') });
  }
  const levelSheet = (title, items) => { add('pagebreak'); add('lpsec', { html: title, ctr: true }); add('lptext', { ind: 0, html: '<b>คำชี้แจง :</b> ให้ครูสังเกตพฤติกรรมของนักเรียน แล้วให้คะแนนตามระดับคุณภาพ<br>3 = ดีเยี่ยม<span class="tab">\t</span>​2 = ดี<span class="tab">\t</span>​1 = ผ่าน<span class="tab">\t</span>​0 = ไม่ผ่าน' });
    const R = [['เลขที่', 'ชื่อ - นามสกุล', ...items, 'รวม', 'ระดับคุณภาพ']]; for (let i = 1; i <= n; i++) R.push([String(i), '', ...items.map(() => ''), '', '']);
    add('table', { rows: R, rs: { 0: 'L' }, full: true, compact: true, cw: [7, 33, ...items.map(() => 12), 8, 12].join(',') });
    add('lptext', { ind: 0, html: '<b>เกณฑ์การตัดสิน</b> คะแนนเฉลี่ย 2.50–3.00 = ดีเยี่ยม · 1.50–2.49 = ดี · 1.00–1.49 = ผ่าน · ต่ำกว่า 1.00 = ไม่ผ่าน' }); };
  if ($('#lpSheetA').checked && atr.length) levelSheet('แบบประเมินคุณลักษณะอันพึงประสงค์', atr);
  if ($('#lpSheetC').checked && cmp.length) levelSheet('แบบประเมินสมรรถนะสำคัญของผู้เรียน', cmp);
  if ($('#lpRubric').checked) {
    add('pagebreak'); add('lpsec', { html: 'เกณฑ์การประเมิน (รูบริก) ...', ctr: true });
    add('table', { rows: [['หัวข้อการประเมิน', 'ดีเยี่ยม (3 คะแนน)', 'ดี / พอใช้ (2 คะแนน)', 'ปรับปรุง (1 คะแนน)'], ['1. เนื้อหาและการวิเคราะห์', '', '', ''], ['2. วิธีการ / ขั้นตอน', '', '', ''], ['3. การสื่อสารและรูปแบบ', '', '', ''], ['4. ความคิดสร้างสรรค์', '', '', '']], rs: { 0: 'H' }, full: true, cw: '22,26,26,26', al: 'left' });
  }
  closeDlg('#dLP');
  if (fresh) {
    const st = Object.assign({}, doc.settings, { name: `แผนการจัดการเรียนรู้ที่ ${v('lpNo')} ${v('lpTopic')}` });
    if ($('#lpPgNum').checked) Object.assign(st, { hl: '', hr: '', nologo: true, hline: 'none', pnPos: 'tr', pnFmt: 'หน้า {n}', pnRules: [{ a: 1, b: 1, m: 'hide' }], ft: '', au: '' });
    if ($('#lpTheme').checked) st.theme = 'lp';
    doc = { app: 'en-editor', v: 2, settings: st, blocks: B }; curId = null; applySettings(); renderAll(); changed(true); refreshInspector(); $('#scroller').scrollTop = 0;
  } else { doc.blocks.push(...B); renderAll(); changed(true); }
  toast('สร้างแผนการจัดการเรียนรู้แล้ว แก้ไขได้ทุกส่วน');
}
DOC_TEMPLATES.splice(1, 0, ['แผนการจัดการเรียนรู้', 'หัวแผน · ผลการเรียนรู้ · จุดประสงค์ K P A · กิจกรรมรายคาบ · วัดผล · บันทึกหลังสอน · แบบประเมิน', 'LESSON']);

/* ===================== สอบย่อย: หัวแบบทดสอบ (ไม่มีหน้าปก) · รูปแบบข้อสอบเพิ่มเติม ===================== */
Object.assign(TYPES, { quizhead: 'หัวแบบทดสอบย่อย (ชื่อ คะแนน คำชี้แจง)', subq: 'ข้อย่อย (1.1) พร้อมคะแนน', errsteps: 'หาบรรทัดที่ผิดพร้อมแก้ไข', tfq: 'ถูก / ผิด (พร้อมเหตุผล)', matchq: 'จับคู่', orderq: 'เรียงลำดับขั้นตอน' });
Object.assign(QTYPES, { sub: 'ข้อย่อย 1.1, 1.2, … (แต่ละข้อมีคะแนน)', fill: 'เติมคำ / เติมคำตอบในช่องว่าง', short: 'ตอบสั้น (เขียนเฉพาะคำตอบ)', err: 'หาบรรทัดที่ผิด พร้อมแก้ไข', fillsteps: 'เติมวิธีทำให้สมบูรณ์', tf: 'ถูก / ผิด พร้อมเหตุผล', match: 'จับคู่', order: 'เรียงลำดับขั้นตอน', prove: 'พิสูจน์ / แสดงว่า' });
EXAM_PRESETS.quiz = { name: 'สอบย่อย / สอบเก็บคะแนน (ไม่มีหน้าปก)', subj: 'แบบทดสอบเก็บคะแนนครั้งที่ 1', set: 'รายวิชาคณิตศาสตร์เพิ่มเติม 5 รหัสวิชา ค33201', time: 50, lab: '(1)',
  parts: [{ n: 'ข้อย่อย', c: 1, t: 'sub', d: 4, p: 4, w: 'small' }, { n: 'เขียนแสดงวิธีทำ', c: 3, t: 'write', p: 1.5, w: 'half' }, { n: 'หาบรรทัดที่ผิด', c: 1, t: 'err', d: 5, p: 2, w: 'small' }] };
const N_TYPES = ['sub', 'err', 'tf', 'match', 'order'];
const THL = 'กขคงจฉชซฌญ';
const _extNew2 = extNewBlock;
extNewBlock = function (b) {
  _extNew2(b);
  if (b.t === 'quizhead') Object.assign(b, { title: 'แบบทดสอบเก็บคะแนนครั้งที่ 1', subj: 'รายวิชาคณิตศาสตร์เพิ่มเติม 5 รหัสวิชา ค33201', cls: 'ชั้นมัธยมศึกษาปีที่ 6 ภาคเรียนที่ 1 ปีการศึกษา 2569',
    info: '<b>ครูผู้สอน :</b> ' + esc(doc.settings.au || 'นายศาสตราวุฒิ อาชนะชัย') + '<br><b>รายละเอียดแบบทดสอบ :</b> ข้อสอบอัตนัยทั้งหมด ... ข้อ รวม ... คะแนน<br><b>คำชี้แจง :</b> ให้นักเรียนแสดงวิธีหาคำตอบทุกข้ออย่างละเอียด<br><b>สิ่งที่อนุญาตให้นำเข้าสอบ :</b> ปากกา ดินสอ ยางลบ น้ำยาลบคำผิด<br><b>เวลาในการสอบ :</b> 50 นาที (1 คาบ)',
    cap: 'คะแนนที่ได้', total: '10', n1: 'ชื่อ – นามสกุล', n2: 'เลขที่', n3: 'ชั้น' });
  if (b.t === 'subq') Object.assign(b, { num: '1.1)', html: '', pts: '(1.0 คะแนน)' });
  if (b.t === 'errsteps') Object.assign(b, { n: 5, lead: 'นักเรียนคนหนึ่งแสดงวิธีทำดังนี้ จงพิจารณาว่าบรรทัดใดผิด และแก้ไขให้ถูกต้อง', ans: 'บรรทัดที่ผิดคือบรรทัดที่ ............ เพราะ ..........................................................................' });
  if (b.t === 'tfq') Object.assign(b, { n: 4, why: true });
  if (b.t === 'matchq') Object.assign(b, { n: 4, m: 5, hl: 'คอลัมน์ ก', hr: 'คอลัมน์ ข' });
  if (b.t === 'orderq') Object.assign(b, { n: 4 });
};
const _extHTML2 = extBlockHTML;
extBlockHTML = function (b) {
  const r = _extHTML2(b); if (r) return r;
  const E = (f, ph, cls = '', def) => `<div class="${cls}" contenteditable="true" data-f="${f}" data-ph="${ph}"${def ? ` data-def="${esc(def)}"` : ''}></div>`;
  const S = (f, ph, cls = '') => `<span class="${cls}" contenteditable="true" data-f="${f}" data-ph="${ph}"></span>`;
  switch (b.t) {
    case 'quizhead': return `<div class="b-quizhead"><div class="qh-top">${b.nologo ? '' : '<img class="qh-logo" alt="">'}<div class="qh-tt">${E('title', 'แบบทดสอบ...', 'qh-title')}${E('subj', 'รายวิชา / รหัสวิชา', 'qh-subj')}${E('cls', 'ชั้น / ภาคเรียน / ปีการศึกษา', 'qh-cls')}</div></div>
      <div class="qh-mid">${E('info', 'ครูผู้สอน · รายละเอียด · คำชี้แจง · เวลา', 'qh-info')}<div class="qh-score">${E('cap', 'คะแนนที่ได้', 'qh-cap')}<div class="qh-box"><span class="qh-of">/ ${S('total', 'เต็ม')}</span></div></div></div>
      <div class="qh-name"><div class="qn w">${S('n1', 'ชื่อ – นามสกุล', 'ql')}<i></i></div><div class="qn">${S('n2', 'เลขที่', 'ql')}<i></i></div><div class="qn">${S('n3', 'ชั้น', 'ql')}<i></i></div></div></div>`;
    case 'subq': return `<div class="b-subq">${S('num', '1.1)', 'sn')}${E('html', 'โจทย์ข้อย่อย...', 'sq')}${S('pts', '(1 คะแนน)', 'sp')}</div>`;
    case 'errsteps': { const n = Math.max(1, Math.min(15, +b.n || 5)); return `<div class="b-errsteps">${E('lead', 'คำสั่ง...', 'es-lead')}<table class="es">${Array.from({ length: n }, (_, i) => `<tr><td class="es-n">บรรทัดที่ ${i + 1}</td><td class="es-s">${E('s' + i, 'ขั้นตอน...')}</td>${b.nomark ? '' : '<td class="es-m">☐</td>'}</tr>`).join('')}</table>${E('ans', 'บรรทัดที่ผิดคือ ...', 'es-ans')}</div>`; }
    case 'tfq': { const n = Math.max(1, Math.min(20, +b.n || 4)); return `<div class="b-tfq"><table class="tf"><tr class="tfh"><td class="tf-n"></td><td>ข้อความ</td><td class="tf-c">ถูก</td><td class="tf-c">ผิด</td></tr>${Array.from({ length: n }, (_, i) => `<tr><td class="tf-n">${i + 1}.</td><td class="tf-s">${E('s' + i, 'ข้อความ...')}${b.why ? '<div class="tf-why">เหตุผล ...............................................................................................</div>' : ''}</td><td class="tf-c">☐</td><td class="tf-c">☐</td></tr>`).join('')}</table></div>`; }
    case 'matchq': { const n = Math.max(1, Math.min(15, +b.n || 4)), m = Math.max(n, Math.min(20, +b.m || n + 1)); return `<div class="b-matchq"><div class="mq-col"><div class="mq-h">${S('hl', 'คอลัมน์ ก', '', )}</div>${Array.from({ length: n }, (_, i) => `<div class="mq-it"><span class="mq-a">(.......)</span><span class="mq-k">${i + 1}.</span>${E('l' + i, 'รายการ...', 'mq-t')}</div>`).join('')}</div><div class="mq-col"><div class="mq-h">${S('hr', 'คอลัมน์ ข')}</div>${Array.from({ length: m }, (_, i) => `<div class="mq-it"><span class="mq-k">${THL[i] || String.fromCharCode(97 + i)}.</span>${E('r' + i, 'ตัวเลือก...', 'mq-t')}</div>`).join('')}</div></div>`; }
    case 'orderq': { const n = Math.max(2, Math.min(10, +b.n || 4)); return `<div class="b-orderq">${Array.from({ length: n }, (_, i) => `<div class="oq-it"><span class="oq-k">${THL[i]}.</span>${E('o' + i, 'ขั้นตอน...', 'oq-t')}</div>`).join('')}<div class="oq-ans">ลำดับที่ถูกต้องคือ ${Array.from({ length: n }, () => '<span class="oq-b"></span>').join(' → ')}</div></div>`; }
  }
  return '';
};
// โลโก้ของหัวแบบทดสอบ
const _obs = new MutationObserver(() => $$('.b-quizhead .qh-logo').forEach(im => { if (!im.src) { const blk = im.closest('.blk'); const b = blk && byId(blk.dataset.id); im.src = (b && b.logo) || coverLogo(b); } }));
_obs.observe(document.getElementById('flow'), { childList: true, subtree: true });
const _extInsp2 = extInspector;
extInspector = function (b) {
  let h = _extInsp2(b);
  const num = (k, lab, v, mn = 1, mx = 20) => `<div class="ir"><label>${lab}</label><input type="number" min="${mn}" max="${mx}" data-bn="${k}" value="${v}"></div>`;
  if (b.t === 'quizhead') h += `<div class="ir"><label><input type="checkbox" data-bc2="nologo" ${b.nologo ? 'checked' : ''}> ไม่แสดงโลโก้</label></div><div class="ir"><button class="tb" onclick="pickLogo('โลโก้หัวแบบทดสอบ', d => setB('logo', d || undefined))">เปลี่ยนโลโก้…</button></div>`;
  if (b.t === 'errsteps') h += num('n', 'จำนวนบรรทัด', b.n || 5, 1, 15) + `<div class="ir"><label><input type="checkbox" data-bc2="nomark" ${b.nomark ? 'checked' : ''}> ไม่มีช่อง ☐ ท้ายบรรทัด</label></div>`;
  if (b.t === 'tfq') h += num('n', 'จำนวนข้อความ', b.n || 4) + `<div class="ir"><label><input type="checkbox" data-bc2="why" ${b.why ? 'checked' : ''}> บรรทัด “เหตุผล” ใต้แต่ละข้อ</label></div>`;
  if (b.t === 'matchq') h += num('n', 'จำนวนรายการซ้าย', b.n || 4, 1, 15) + num('m', 'จำนวนตัวเลือกขวา', b.m || 5, 1, 20);
  if (b.t === 'orderq') h += num('n', 'จำนวนขั้นตอน', b.n || 4, 2, 10);
  return h;
};
const _extXML2 = extBlockXML;
extBlockXML = function (b, o) {
  const r = _extXML2(b, o); if (r) return r; const { C, keep } = o; const T = (h, f) => [].concat(...htmlParas(h || '', f).map(p => p.runs)); const P = (h, f, po) => htmlParas(h || '', f).map(p => para(p.runs, Object.assign({ keep, after: 0 }, po))).join('') || para([]);
  const bd = c => `<w:top w:val="single" w:sz="6" w:color="${c}"/><w:left w:val="single" w:sz="6" w:color="${c}"/><w:bottom w:val="single" w:sz="6" w:color="${c}"/><w:right w:val="single" w:sz="6" w:color="${c}"/>`;
  const none = `<w:top w:val="nil"/><w:left w:val="nil"/><w:bottom w:val="nil"/><w:right w:val="nil"/>`;
  switch (b.t) {
    case 'quizhead': {
      const top = table([[cell(para(T(b.title, { b: true, color: 'FFFFFF', size: DX.base * 1.35 }), { jc: 'center', after: 0, style: 'Heading1', keep: true }), { fill: C('brown'), bc: C('brown'), pt: 60, pb: 60 })]], {}) + para(T(b.subj, { b: true, color: C('brown'), size: DX.base * 1.1 }), { jc: 'center', after: 0, keep: true }) + para(T(b.cls, { color: C('dark') }), { jc: 'center', after: 80, keep: true });
      const W = DX.cw, sw = 2200;
      const mid = table([[cell(P(b.info, {}, {}), { border: none, w: W - sw - 200 }), cell(para(T(b.cap, { b: true, color: C('brown') }), { jc: 'center', after: 40 }) + table([[cell(para([], { after: 0 }) + para([run('/ ', { color: C('dark') })].concat(T(b.total, { b: true, color: C('dark') })), { jc: 'right', after: 0 }), { border: bd(C('brown')), w: sw - 300, pt: 500 })]], { w: sw - 300, center: true }), { border: none, w: sw + 200 })]], { w: W, cols: [W - sw - 200, sw + 200] });
      const line = `<w:top w:val="nil"/><w:left w:val="nil"/><w:bottom w:val="single" w:sz="6" w:color="${C('brown')}"/><w:right w:val="nil"/>`;
      const nm = table([[cell(para(T(b.n1, { b: true, color: C('brown') }), { after: 0 }), { border: none, w: 2300 }), cell(para([]), { border: line, w: W * .52 - 2300 }), cell(para(T(b.n2, { b: true, color: C('brown') }), { after: 0, jc: 'right' }), { border: none, w: 1100 }), cell(para([]), { border: line, w: W * .2 - 1100 }), cell(para(T(b.n3, { b: true, color: C('brown') }), { after: 0, jc: 'right' }), { border: none, w: 900 }), cell(para([]), { border: line, w: W * .28 - 900 })]], { w: W, cols: [2300, W * .52 - 2300, 1100, W * .2 - 1100, 900, W * .28 - 900] });
      return top + mid + para([], { after: 60 }) + nm + para([], { after: 120 });
    }
    case 'subq': return para([].concat(T(b.num, { b: true }), [run('  ', {})], T(b.html, {}), [tabRun({})], T(b.pts, { color: C('brown') })), { ind: 700, tabs: [['right', DX.cw]], keep, after: 60 });
    case 'errsteps': { const n = Math.max(1, Math.min(15, +b.n || 5)); const rows = Array.from({ length: n }, (_, i) => [cell(para([run('บรรทัดที่ ' + (i + 1), { b: true, color: C('brown') })], { after: 0 }), { w: 1500, fill: C('bar') }), cell(P(b['s' + i], {}, {}), { w: DX.cw - 700 - 1500 - (b.nomark ? 0 : 600) })].concat(b.nomark ? [] : [cell(para([run('☐', {})], { jc: 'center', after: 0 }), { w: 600 })]));
      return P(b.lead, {}, { after: 60 }) + table(rows, { w: DX.cw - 700, ind: 700, cols: [1500, DX.cw - 700 - 1500 - (b.nomark ? 0 : 600)].concat(b.nomark ? [] : [600]) }) + P(b.ans, {}, { ind: 700, after: 60 }); }
    case 'tfq': { const n = Math.max(1, Math.min(20, +b.n || 4)); const w0 = 500, wc = 700, ws = DX.cw - 700 - w0 - 2 * wc; const hd = [cell(para([]), { w: w0, fill: C('bar') }), cell(para([run('ข้อความ', { b: true })], { jc: 'center', after: 0 }), { w: ws, fill: C('bar') }), cell(para([run('ถูก', { b: true })], { jc: 'center', after: 0 }), { w: wc, fill: C('bar') }), cell(para([run('ผิด', { b: true })], { jc: 'center', after: 0 }), { w: wc, fill: C('bar') })];
      const rows = [hd].concat(Array.from({ length: n }, (_, i) => [cell(para([run((i + 1) + '.', {})], { jc: 'center', after: 0 }), { w: w0 }), cell(P(b['s' + i], {}, {}) + (b.why ? para([run('เหตุผล ' + '.'.repeat(90), { color: '9A8576' })], { after: 0 }) : ''), { w: ws }), cell(para([run('☐', {})], { jc: 'center', after: 0 }), { w: wc }), cell(para([run('☐', {})], { jc: 'center', after: 0 }), { w: wc })]));
      return table(rows, { w: DX.cw - 700, ind: 700, cols: [w0, ws, wc, wc] }); }
    case 'matchq': { const n = Math.max(1, Math.min(15, +b.n || 4)), m = Math.max(n, Math.min(20, +b.m || n + 1)); const L = Array.from({ length: n }, (_, i) => para([run('(.......)  ' + (i + 1) + '. ', {})].concat(T(b['l' + i], {})), { after: 40 })).join(''); const R = Array.from({ length: m }, (_, i) => para([run((THL[i] || '') + '. ', {})].concat(T(b['r' + i], {})), { after: 40 })).join('');
      return table([[cell(para(T(b.hl || 'คอลัมน์ ก', { b: true, color: C('brown') }), { after: 40 }) + L, { border: none, w: (DX.cw - 700) / 2 }), cell(para(T(b.hr || 'คอลัมน์ ข', { b: true, color: C('brown') }), { after: 40 }) + R, { border: none, w: (DX.cw - 700) / 2 })]], { w: DX.cw - 700, ind: 700 }); }
    case 'orderq': { const n = Math.max(2, Math.min(10, +b.n || 4)); return Array.from({ length: n }, (_, i) => para([run(THL[i] + '. ', { b: true })].concat(T(b['o' + i], {})), { ind: 700, keep, after: 40 })).join('') + para([run('ลำดับที่ถูกต้องคือ ' + Array(n).fill('........').join(' → '), {})], { ind: 700, after: 60 }); }
  }
  return '';
};

function qBody(t, k, q, c) { // บล็อกของข้อ (ไม่รวมป้ายข้อ)
  const B = [], n = +q.d || 4;
      const W = () => { if (q.w !== 'none') B.push(newBlock('work', workOpts(q.w))); };
      switch (t) {
        case 'sub': { B.push(newBlock('given', { html: 'จงพิจารณา ...' })); const each = Math.round(q.p / n * 100) / 100; for (let j = 1; j <= n; j++) { B.push(newBlock('subq', { num: `${k}.${j})`, pts: `(${ptsTxt(each)} คะแนน)` })); if (q.w !== 'none') B.push(newBlock('work', Object.assign(workOpts(q.w === 'full' ? 'third' : q.w), { full: undefined }))); } break; }
        case 'fill': B.push(newBlock('given', { html: 'เติมคำตอบลงในช่องว่าง ... = <span class="blank" contenteditable="false" data-w="8"></span>' })); W(); break;
        case 'short': B.push(newBlock('given', { html: '' })); if (c.q) B.push(newBlock('question', { html: '' })); W(); B.push(newBlock('answer', { html: '.........................................................' })); break;
        case 'err': B.push(newBlock('errsteps', { n })); B.push(newBlock('work', Object.assign(workOpts(q.w === 'none' ? 'small' : q.w), { wl: 'แก้ไขให้ถูกต้อง' }))); break;
        case 'fillsteps': B.push(newBlock('given', { html: 'โจทย์ ...' })); B.push(newBlock('solution', { html: 'จาก ... จะได้ <span class="blank" contenteditable="false" data-w="6"></span><br>ดังนั้น <span class="blank" contenteditable="false" data-w="6"></span><br>นั่นคือ <span class="blank" contenteditable="false" data-w="6"></span>' })); break;
        case 'tf': B.push(newBlock('given', { html: 'จงพิจารณาข้อความต่อไปนี้ว่าถูกหรือผิด พร้อมให้เหตุผล' })); B.push(newBlock('tfq', { n })); break;
        case 'match': B.push(newBlock('given', { html: 'จงจับคู่รายการในคอลัมน์ ก กับคอลัมน์ ข ให้ถูกต้อง' })); B.push(newBlock('matchq', { n, m: n + 1 })); break;
        case 'order': B.push(newBlock('given', { html: 'จงเรียงลำดับขั้นตอนต่อไปนี้ให้ถูกต้อง' })); B.push(newBlock('orderq', { n })); break;
        case 'prove': B.push(newBlock('given', { html: 'จงแสดงว่า ...' })); W(); break;
        default: B.push(newBlock('given', { html: '' })); if (c.q) B.push(newBlock('question', { html: '' })); if (t === 'mc4' || t === 'mc5') B.push(newBlock('choices', { items: Array(t === 'mc4' ? 4 : 5).fill(''), cf: c.lab })); W();
      }
  return B;
}
/* ---------- ตัวสร้างข้อสอบ: รองรับรูปแบบใหม่ + หัวแบบทดสอบย่อย ---------- */
(function () {
  const cv = $('#ebCover'); if (cv && !$('#ebQH')) cv.closest('label').insertAdjacentHTML('beforebegin', '<label><input type="checkbox" id="ebQH"> หัวแบบทดสอบย่อย (ชื่อ คะแนน คำชี้แจง — ไม่มีหน้าปก)</label>');
})();
const _ebLoad0 = ebLoad;
ebLoad = function (k) { _ebLoad0(k); const q = k === 'quiz'; $('#ebQH').checked = q; $('#ebCover').checked = !q; if (q) { $('#ebSheet').checked = false; $('#ebPartH').checked = false; $('#ebQ').checked = false; } ebSum(); };
const _ebRead0 = ebRead;
ebRead = function () { const c = _ebRead0(); c.qh = $('#ebQH').checked; return c; };
const _ebSum0 = ebSum;
ebSum = function () { _ebSum0(); $$('#ebParts .ebr').forEach(r => { const t = $('[data-k="t"]', r).value; const dg = $('.dg', r); if (N_TYPES.includes(t)) { dg.style.display = ''; dg.title = { sub: 'จำนวนข้อย่อย', err: 'จำนวนบรรทัด', tf: 'จำนวนข้อความ', match: 'จำนวนคู่', order: 'จำนวนขั้นตอน' }[t]; } else if (t !== 'int' && t !== 'dec') dg.style.display = 'none'; else dg.title = 'จำนวนหลัก'; }); };
$('#ebParts').addEventListener('change', () => ebSum()); $('#ebParts').addEventListener('input', () => ebSum());
const _buildExam0 = buildExam;
buildExam = function (c) {
  const special = c.parts.some(q => QTYPES[q.t] && !['mc4', 'mc5', 'int', 'dec', 'write'].includes(q.t));
  const B = [];
  if (c.qh) { const tot = total(c.parts); B.push(newBlock('quizhead', { title: c.subj, subj: c.set || 'รายวิชา ...', total: ptsTxt(tot), info: `<b>ครูผู้สอน :</b> ${esc(doc.settings.au || 'นายศาสตราวุฒิ อาชนะชัย')}<br><b>รายละเอียดแบบทดสอบ :</b> ${c.parts.every(q => q.t.startsWith('mc')) ? 'ข้อสอบปรนัย' : c.parts.some(q => q.t.startsWith('mc')) ? 'ข้อสอบปรนัยและอัตนัย' : 'ข้อสอบอัตนัย'} จำนวน ${count(c.parts)} ข้อ รวม ${ptsTxt(tot)} คะแนน<br><b>คำชี้แจง :</b> ให้นักเรียนแสดงวิธีหาคำตอบทุกข้ออย่างละเอียด<br><b>สิ่งที่อนุญาตให้นำเข้าสอบ :</b> ปากกา ดินสอ ยางลบ น้ำยาลบคำผิด<br><b>เวลาในการสอบ :</b> ${c.time} นาที` })); }
  if (!special) { const R = _buildExam0(Object.assign({}, c, { cover: c.cover && !c.qh })); return B.concat(R); }
  if (c.cover && !c.qh) B.push(newBlock('examcover', defaultExamCover(c)));
  let k = 1;
  c.parts.forEach(q => {
    if (c.partHead) B.push(newBlock('part', { html: q.n, info: `ข้อ ${k}–${k + q.c - 1} · ${QTYPES[q.t]} · ข้อละ ${ptsTxt(q.p)} คะแนน` }));
    for (let i = 0; i < q.c; i++, k++) {
      B.push(newBlock('problem', { html: 'ข้อ ' + k, pts: ptsTxt(q.p), qt: q.t })); B.push(...qBody(q.t, k, q, c));
    }
  });
  const sheetParts = c.parts.filter(q => ['mc4', 'mc5', 'int', 'dec'].includes(q.t));
  if (c.sheet && sheetParts.length) B.push(newBlock('asheet', { cfg: Object.assign(sheetFromParts(sheetParts, c.lab), { sub: (c.subj + ' ' + c.set).trim() }) }));
  return B;
};
DOC_TEMPLATES.splice(2, 0, ['สอบย่อย / สอบเก็บคะแนน', 'หัวแบบทดสอบ (ชื่อ เลขที่ ชั้น ช่องคะแนน คำชี้แจง) ไม่มีหน้าปก · ข้อย่อยพร้อมคะแนน · กรอบทด', 'QUIZ']);

/* ---------- สีเฉพาะส่วน (แถบหัวแบบทดสอบ / แผนการสอน / ตาราง) ---------- */
const CBLK = new Set(['quizhead', 'lphead', 'lpsec', 'lpbar', 'lpstep', 'table', 'errsteps', 'tfq', 'matchq', 'subq']);
const CSW1 = ['#2c3fd6', '#1f3864', '#2e5597', '#0b6e8c', '#2b7a8c', '#2e7d32', '#1d4d2f', '#713408', '#401a01', '#b8860b', '#d9682b', '#c0392b', '#a0275a', '#7b3f8c', '#43204f', '#333333'];
const CSW2 = ['#cdd5fd', '#dce6f2', '#d9eef0', '#dcefe2', '#fce8de', '#fbefe7', '#f6efd9', '#fde2e2', '#f5e1ec', '#efe2f4', '#eeeeee', '#ffffff'];
const cvars = b => (b.c1 ? `--brown:${b.c1};--dark:${b.c1};` : '') + (b.c2 ? `--bar:${b.c2};` : '');
const _extHTML3 = extBlockHTML;
extBlockHTML = function (b) {
  let h = _extHTML3(b); if (!h || !(b.c1 || b.c2)) return h; const v = cvars(b);
  return h.replace(/^<(\w+)([^>]*)>/, (m, tag, at) => /style="/.test(at) ? `<${tag}${at.replace('style="', 'style="' + v)}>` : `<${tag} style="${v}"${at}>`);
};
const _bTX = buildTableX;
buildTableX = function (el, b) { _bTX(el, b); const w = $('.b-table', el); if (b.c1) w.style.setProperty('--brown', b.c1); else w.style.removeProperty('--brown'); if (b.c2) w.style.setProperty('--bar', b.c2); else w.style.removeProperty('--bar'); };
const _extInsp3 = extInspector;
extInspector = function (b) {
  let h = _extInsp3(b); if (!CBLK.has(b.t)) return h;
  return h + `<div class="ir col"><label>สีหลักของส่วนนี้ (แถบ หัวข้อ เส้นกรอบ)</label>${swRowB('c1', CSW1, b.c1 || '')}</div>
    <div class="ir col"><label>สีพื้นอ่อน (แถบชื่อ แถบขั้น แถวหัวข้อย่อย)</label>${swRowB('c2', CSW2, b.c2 || '')}</div>
    <div class="ir"><button class="tb" onclick="setB('c1', undefined); setB('c2', undefined)">ใช้สีตามโทนเอกสาร</button><button class="tb" onclick="colorAllParts()">ใช้สีนี้กับทุกส่วน</button></div>
    <p class="hint" style="font-size:14px">อยากเปลี่ยนทั้งเล่ม: ปุ่ม “ตั้งค่า” → โทนสีเอกสาร (มีสีกำหนดเอง)</p>`;
};
function colorAllParts() { const b = byId(curId); if (!b) return; let n = 0; doc.blocks.forEach(o => { if (CBLK.has(o.t) && o !== b) { if (b.c1) o.c1 = b.c1; else delete o.c1; if (b.c2) o.c2 = b.c2; else delete o.c2; n++; } }); renderAll(); changed(true); toast(`ใช้สีกับอีก ${n} ส่วนแล้ว`); }
const cOver = (b, C) => k => (k === 'brown' || k === 'dark') && b.c1 ? hex(b.c1) : k === 'bar' && b.c2 ? hex(b.c2) : C(k);
const _extXML3 = extBlockXML;
extBlockXML = function (b, o) { return _extXML3(b, Object.assign({}, o, { C: cOver(b, o.C) })); };
const _tXML = tableXML;
tableXML = function (b, C, keep) { return _tXML(b, cOver(b, C), keep); };

/* ---------- แก้ข้อสอบในเอกสาร: เปลี่ยนรูปแบบข้อ · แทรกข้อใหม่ · เรียงเลขข้อ ---------- */
['subq', 'errsteps', 'tfq', 'matchq', 'orderq'].forEach(t => GROUP_MEMBERS.add(t));
const QSTOP = new Set(['problem', 'part', 'pagebreak', 'asheet', 'examcover', 'quizhead', 'soltitle', 'section', 'subsection', 'chapter', 'keytable', 'solhead', 'h3', 'lpsec', 'lpbar', 'lphead', 'cover']);
function qGroup(id) {
  const i = idx(id); if (i < 0) return null; let s = i;
  while (s >= 0 && doc.blocks[s].t !== 'problem') { if (QSTOP.has(doc.blocks[s].t)) return null; s--; }
  if (s < 0) return null; let e = s; while (e + 1 < doc.blocks.length && !QSTOP.has(doc.blocks[e + 1].t)) e++; return [s, e];
}
function qTypeOf(s, e) {
  const p = doc.blocks[s]; if (p.qt && QTYPES[p.qt]) return p.qt; const G = doc.blocks.slice(s + 1, e + 1); const has = t => G.some(b => b.t === t);
  const ch = G.find(b => b.t === 'choices'); if (ch) return (ch.items || []).length === 4 ? 'mc4' : 'mc5';
  if (has('subq')) return 'sub'; if (has('errsteps')) return 'err'; if (has('tfq')) return 'tf'; if (has('matchq')) return 'match'; if (has('orderq')) return 'order'; if (has('answer')) return 'short';
  if (G.some(b => b.t === 'solution' && /class="blank"/.test(b.html || ''))) return 'fillsteps'; if (G.some(b => b.t === 'given' && /class="blank"/.test(b.html || ''))) return 'fill';
  return 'write';
}
function qWorkOf(G) { const w = G.find(b => b.t === 'work'); if (!w) return 'none'; if (w.full) return 'full'; if (w.share) return { 5: 'q5', 4: 'q4', 3: 'third', 2: 'half' }[w.share] || 'small'; return (w.h || 30) >= 55 ? 'half' : (w.h || 30) >= 40 ? 'third' : 'small'; }
function qPts(p) { const v = parseFloat(String(p.pts || '').replace(/[^\d.]/g, '')); return isFinite(v) ? v : 1; }
function renumberQ() {
  let k = 0;
  doc.blocks.forEach(b => {
    if (b.t === 'problem' && /^\s*ข้อ\s*\d+\s*$/.test(plainText(b.html))) { k++; b.html = 'ข้อ ' + k; }
    if (b.t === 'subq' && k) { const m = /^\s*\d+\.(\d+)(\)?)\s*$/.exec(plainText(b.num || '')); if (m) b.num = `${k}.${m[1]}${m[2]}`; }
  });
  const P = doc.blocks.filter(b => b.t === 'problem' && /^\s*ข้อ\s*\d+/.test(plainText(b.html))); const tot = P.reduce((a, b) => a + qPts(b), 0);
  doc.blocks.filter(b => b.t === 'quizhead').forEach(h => { h.total = ptsTxt(tot); if (h.info) h.info = h.info.replace(/จำนวน\s*[\d.]+\s*ข้อ\s*รวม\s*[\d.]+\s*คะแนน/, `จำนวน ${P.length} ข้อ รวม ${ptsTxt(tot)} คะแนน`); });
}
const STEM_DEF = /^(จงพิจารณา \.\.\.|โจทย์ \.\.\.|จงแสดงว่า \.\.\.|)$/;
function convertQ(t) {
  const g = curId && qGroup(curId); if (!g) { toast('คลิกที่ข้อสอบข้อที่ต้องการก่อน'); return; }
  const [s, e] = g; const pr = doc.blocks[s], G = doc.blocks.slice(s + 1, e + 1); const old = qTypeOf(s, e); if (old === t) return;
  const stemB = G.find(b => b.t === 'given' && !STEM_DEF.test(plainText(b.html || '').trim()));
  const nOld = G.filter(b => b.t === 'subq').length || (G.find(b => ['errsteps', 'tfq', 'matchq', 'orderq'].includes(b.t)) || {}).n || 4;
  const q = { p: qPts(pr), w: qWorkOf(G), d: nOld };
  const body = qBody(t, 0, q, { q: G.some(b => b.t === 'question'), lab: (G.find(b => b.t === 'choices') || {}).cf || '(1)' });
  if (stemB) { const gi = body.findIndex(b => b.t === 'given'); if (gi >= 0) body[gi].html = stemB.html; else body.unshift(newBlock('given', { html: stemB.html })); }
  ask('เปลี่ยนรูปแบบข้อนี้', `เปลี่ยน <b>${esc(plainText(pr.html))}</b> จาก “${esc(QTYPES[old] || old)}” เป็น “${esc(QTYPES[t])}”<br><span class="hint">โจทย์หลักจะถูกเก็บไว้ ส่วนประกอบอื่นของข้อ (ตัวเลือก กรอบทด ข้อย่อย ฯลฯ) จะถูกสร้างใหม่ — ย้อนกลับได้ด้วย ⌘Z</span>`, 'เปลี่ยนรูปแบบ').then(ok => {
    if (!ok) return; doc.blocks.splice(s + 1, e - s, ...body); pr.qt = t; renumberQ(); renderAll(); changed(true); selectBlock(pr.id); refreshInspector(); toast('เปลี่ยนรูปแบบข้อแล้ว');
  });
}
function insertQ(t, where) {
  let at = doc.blocks.length - 1, p = 1, w = 'small';
  if (curId) { const g = qGroup(curId); if (g) { at = g[1]; p = qPts(doc.blocks[g[0]]); w = qWorkOf(doc.blocks.slice(g[0] + 1, g[1] + 1)); } else at = idx(curId); }
  if (where === 'end') at = doc.blocks.length - 1;
  const pr = newBlock('problem', { html: 'ข้อ 999', pts: ptsTxt(p), qt: t });
  const body = qBody(t, 0, { p, w: t === 'mc4' || t === 'mc5' ? (w === 'none' ? 'small' : w) : w, d: 4 }, { q: false, lab: '(1)' });
  doc.blocks.splice(at + 1, 0, pr, ...body); renumberQ(); renderAll(); changed(true); selectBlock(pr.id); refreshInspector();
  const el = $(`.blk[data-id="${pr.id}"]`); if (el) el.scrollIntoView({ block: 'center' }); toast(`แทรก${plainText(pr.html)} (${QTYPES[t]}) แล้ว`);
}
function deleteQ() { const g = curId && qGroup(curId); if (!g) return; ask('ลบทั้งข้อ', `ลบ <b>${esc(plainText(doc.blocks[g[0]].html))}</b> ทั้งข้อ แล้วเรียงเลขข้อใหม่?`, 'ลบ').then(ok => { if (!ok) return; doc.blocks.splice(g[0], g[1] - g[0] + 1); curId = null; renumberQ(); renderAll(); changed(true); refreshInspector(); }); }
const qOpts = cur => Object.entries(QTYPES).map(([k, v]) => `<option value="${k}"${k === cur ? ' selected' : ''}>${v}</option>`).join('');
const _extInsp4 = extInspector;
extInspector = function (b) {
  let h = _extInsp4(b); const g = qGroup(b.id); if (!g) return h; const cur = qTypeOf(g[0], g[1]); const pr = doc.blocks[g[0]];
  return `<div class="qedit"><div class="qeh">ข้อสอบ ${esc(plainText(pr.html))} · ${esc(QTYPES[cur] || '')}</div>
    <div class="ir col"><label>เปลี่ยนรูปแบบข้อนี้เป็น</label><div class="row" style="margin:0;gap:6px"><select id="qConv" style="flex:1;min-width:0">${qOpts(cur)}</select><button class="tb primary" onclick="convertQ($('#qConv').value)">เปลี่ยน</button></div></div>
    <div class="ir col"><label>แทรกข้อใหม่ต่อจากข้อนี้</label><div class="row" style="margin:0;gap:6px"><select id="qIns" style="flex:1;min-width:0">${qOpts(cur)}</select><button class="tb" onclick="insertQ($('#qIns').value)">＋ แทรก</button></div></div>
    <div class="ir"><button class="tb" onclick="renumberQ(); renderAll(); changed(true); toast('เรียงเลขข้อใหม่แล้ว')">เรียงเลขข้อใหม่</button><button class="tb" onclick="deleteQ()" style="color:#c0392b">ลบทั้งข้อ</button></div></div>` + h;
};

/* ---------- หน้าต่างเลือกแม่แบบ: จัดเป็นหมวด มีภาพย่อ ---------- */
const TPL_META = {
  'แบบฝึกทักษะ': ['teach', 'ปก คำชี้แจง ทดสอบก่อนเรียน กิจกรรม และแบบฝึกระดับ 1–3', 'workbook'],
  'ตำรา / บทเรียน': ['teach', 'หัวบท หลักการ ตัวอย่างพร้อมวิธีทำ และฝึกทันที', 'book'],
  'หน้าว่าง': ['teach', 'เริ่มจากหน้าว่าง แล้วแทรกส่วนต่าง ๆ เอง', 'blank'],
  'สอบย่อย / สอบเก็บคะแนน': ['exam', 'ไม่มีหน้าปก มีช่องชื่อ คะแนน คำชี้แจง ข้อย่อยพร้อมคะแนน', 'quiz'],
  'สร้างชุดข้อสอบ (ปก ตอน ข้อ กระดาษคำตอบ)': ['exam', 'A-Level · สมาคมฯ · PMC · NETSAT · กลางภาค/ปลายภาค มีปกและกระดาษคำตอบ', 'exam'],
  'กระดาษคำตอบอย่างเดียว': ['exam', 'กระดาษคำตอบแบบฝนสำเร็จรูป หรือกำหนดจำนวนข้อเอง', 'sheet'],
  'เฉลยละเอียดแบบฝึก': ['sol', 'โจทย์ แนวคิด วิธีทำ ตรวจคำตอบ และตอบ ทีละข้อ', 'sol'],
  'เฉลยข้อสอบละเอียด': ['sol', 'สรุปคำตอบ แล้วเฉลยข้อละหน้า', 'sol2'],
  'เฉลยข้อสอบแนวสมาคมฯ (แบบชุด L)': ['sol', 'หัวเฉลยมีโลโก้ สรุปคำตอบแยกตอน ข้อละหน้า', 'sol3'],
  'แผนการจัดการเรียนรู้': ['plan', 'หัวแผน จุดประสงค์ K P A กิจกรรมรายคาบ วัดผล บันทึกหลังสอน', 'plan'],
};
const TPL_GROUPS2 = [['exam', 'ข้อสอบ', 'สอบย่อย · ชุดข้อสอบ · กระดาษคำตอบ'], ['teach', 'สื่อการสอน', 'แบบฝึก · ตำรา · หน้าว่าง'], ['sol', 'เฉลย', 'เฉลยแบบฝึก · เฉลยข้อสอบ'], ['plan', 'งานครู', 'แผนการจัดการเรียนรู้']];
function tplThumb(k) {
  const L = (y, w = 40, c = '#d9cfc6') => `<rect x="8" y="${y}" width="${w}" height="3" rx="1.5" fill="${c}"/>`, BAR = (y, h = 9, c = 'var(--ui-accent)') => `<rect x="6" y="${y}" width="52" height="${h}" rx="2.5" fill="${c}"/>`, BOX = (y, h, c = '#e9d8c9', dash) => `<rect x="7" y="${y}" width="50" height="${h}" rx="2" fill="none" stroke="${c}" stroke-width="1.2"${dash ? ' stroke-dasharray="3 2"' : ''}/>`;
  const S = {
    workbook: `<rect x="6" y="6" width="52" height="70" rx="3" fill="#f6e3cf"/>${BAR(14, 12)}<circle cx="20" cy="44" r="6" fill="#fff"/><circle cx="32" cy="44" r="6" fill="#fff"/><circle cx="44" cy="44" r="6" fill="#fff"/>${L(60, 34, '#fff')}`,
    book: `${BAR(6, 13)}${L(26)}${L(32, 30)}${BOX(38, 14, '#d9a35b')}${L(58, 20, 'var(--ui-accent)')}${L(64)}${L(70, 28)}`,
    blank: `${L(10, 30)}${L(16)}${L(22, 36)}`,
    quiz: `${BAR(6, 12)}${L(23, 26)}<rect x="44" y="21" width="13" height="12" rx="2" fill="none" stroke="var(--ui-accent)" stroke-width="1.3"/>${L(29, 26)}<rect x="6" y="37" width="52" height="5" rx="2" fill="#f2e3d6"/>${L(47, 14, 'var(--ui-accent)')}${BOX(53, 10, '#c9b6a8', 1)}${BOX(66, 10, '#c9b6a8', 1)}`,
    exam: `<rect x="6" y="6" width="52" height="34" rx="3" fill="var(--ui-accent)"/>${L(16, 30, '#fff')}${L(24, 22, '#fff')}${L(46, 14, 'var(--ui-accent)')}${L(52)}${[0, 1, 2, 3].map(i => `<circle cx="${14 + i * 10}" cy="${62}" r="3" fill="none" stroke="#a88"/>`).join('')}${[0, 1, 2, 3].map(i => `<circle cx="${14 + i * 10}" cy="${71}" r="3" fill="none" stroke="#a88"/>`).join('')}`,
    sheet: `${L(8, 30, 'var(--ui-accent)')}${Array.from({ length: 6 }, (_, r) => Array.from({ length: 5 }, (_, c) => `<circle cx="${14 + c * 9}" cy="${20 + r * 9}" r="3" fill="none" stroke="#a88"/>`).join('')).join('')}`,
    sol: `${L(8, 14, 'var(--ui-accent)')}${L(14)}<rect x="8" y="20" width="48" height="10" rx="2" fill="#eef6f1"/>${L(36, 16, '#2e6b47')}${L(42)}${L(48, 34)}<rect x="8" y="58" width="30" height="9" rx="4" fill="#fdf6ec" stroke="#d9a35b"/>`,
    sol2: `${BAR(6, 10)}<rect x="8" y="20" width="48" height="16" fill="none" stroke="#d9cfc6"/>${L(42)}${L(48, 30)}${L(54)}${L(60, 34)}${L(66, 20)}`,
    sol3: `<circle cx="14" cy="13" r="6" fill="var(--ui-accent)"/>${L(10, 26, 'var(--ui-accent)')}${L(17, 20)}<rect x="8" y="26" width="48" height="12" fill="none" stroke="#d9cfc6"/>${BAR(44, 7)}${L(56)}${L(62, 30)}${L(68)}`,
    plan: `<rect x="6" y="6" width="52" height="9" rx="1.5" fill="#1f3ce6"/>${L(19, 46, '#1f3ce6')}${L(24, 46, '#1f3ce6')}<line x1="7" y1="30" x2="57" y2="30" stroke="#1f3ce6" stroke-dasharray="1 2"/>${L(35, 20, '#1f3ce6')}${L(41)}<rect x="6" y="48" width="52" height="7" fill="#1f3ce6"/><rect x="6" y="58" width="52" height="6" fill="#cdd5fd"/>${L(68)}`,
  };
  return `<svg viewBox="0 0 64 82" width="58" height="74"><rect x=".5" y=".5" width="63" height="81" rx="5" fill="#fff" stroke="#e3d6c8"/>${S[k] || ''}</svg>`;
}
const _openTpl0 = openTemplates;
openTemplates = function () {
  _openTpl0();
  const items = DOC_TEMPLATES.map((t, i) => ({ i, name: t[0], meta: TPL_META[t[0]] || ['teach', t[1], 'blank'] }));
  $('#tplList').innerHTML = TPL_GROUPS2.map(([g, gn, gd]) => { const L = items.filter(x => x.meta[0] === g); if (!L.length) return ''; return `<div class="tplg"><div class="tplgh"><b>${gn}</b><span>${gd}</span></div><div class="tplgrid">${L.map(x => `<button class="tplc" data-i="${x.i}">${tplThumb(x.meta[2])}<div class="tpltx"><b>${esc(x.name.replace(/\s*\(.*\)\s*$/, ''))}</b><span>${esc(x.meta[1])}</span></div></button>`).join('')}</div></div>`; }).join('');
  $('#dTpl .dlg').style.width = '920px';
};

const GARUDA = NP_ASSET['img/garuda.png'];

