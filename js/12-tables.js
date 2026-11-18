'use strict';
/* ===================== ทำครั้งเดียว: เลขตาราง/ภาพรันเอง · สารบัญทุกแบบ · แผนการสอนซิงก์จุดประสงค์ ===================== */
/* ---------- คำบรรยายตาราง / ภาพ + เลขรันอัตโนมัติ ---------- */
const CAP_T = { table: 'tbl', figure: 'fig', image: 'fig' };
function capNums() { const c = { tbl: 0, fig: 0 }, m = {}; doc.blocks.forEach(b => { const k = CAP_T[b.t]; if (k && b.capOn) m[b.id] = ++c[k]; }); return m; }
const capLabel = (b, n) => (CAP_T[b.t] === 'tbl' ? ((doc.settings && doc.settings.tblLab) || 'ตารางที่ ') : ((doc.settings && doc.settings.figLab) || 'ภาพที่ ')) + n;
function capSync() {
  const m = capNums();
  $$('#flow > .blk').forEach(el => {
    const b = byId(el.dataset.id); if (!b || !CAP_T[b.t]) return;
    if (b.t === 'image') { const cap = $('.b-image .cap', el); if (!cap) return; let n = $('.b-image .capn', el); if (!b.capOn) { if (n) n.remove(); return; } if (!n) { n = document.createElement('b'); n.className = 'capn'; n.contentEditable = 'false'; cap.before(n); } n.textContent = capLabel(b, m[b.id]); return; }
    let c = el.querySelector('.capx'); if (!b.capOn) { if (c) c.remove(); return; }
    if (!c) { c = document.createElement('div'); c.className = 'capx ' + CAP_T[b.t]; c.innerHTML = `<b class="capn" contenteditable="false"></b> <span contenteditable="true" data-f="cap" data-ph="พิมพ์ชื่อ${CAP_T[b.t] === 'tbl' ? 'ตาราง' : 'ภาพ'}"></span>`; setHTML($('[data-f="cap"]', c), b.cap || '');
      const body = el.querySelector(b.t === 'table' ? '.b-table' : '.b-figure'); if (!body) return; if (b.t === 'table') body.before(c); else body.after(c); }
    $('.capn', c).textContent = capLabel(b, m[b.id]);
  });
}
/* ---------- สารบัญ: หัวข้อทุกชนิด + สารบัญตาราง/ภาพ ---------- */
const TOC_SKIP = new Set(['problem', 'asheet', 'keytable', 'soltitle', 'solhead', 'lphead', 'lpbar', 'cover', 'examcover', 'pjcover', 'memohead']);
tocEntries = function (tb) {
  const i0 = doc.blocks.indexOf(tb), P = PAGE_H + PAGE_G, n = $('#sheets').childElementCount, out = [];
  const pgOf = el => { const L = pageLabel(Math.floor(el.offsetTop / P), n, doc.settings); return L.hide ? '' : (String(L.text).match(/[0-9๐-๙ivxlcdm]+|[ก-ฮ]$/i) || [''])[0]; };
  const after = new Set(doc.blocks.slice(i0 + 1).map(b => b.id));
  if (tb.kind === 'tbl' || tb.kind === 'fig') {
    const m = capNums();
    doc.blocks.forEach(b => { if (!m[b.id] || CAP_T[b.t] !== tb.kind) return; const el = $(`.blk[data-id="${b.id}"]`); if (!el) return; out.push({ lv: 2, text: capLabel(b, m[b.id]) + '  ' + plainText(b.cap || ''), page: pgOf(el) }); });
    return out;
  }
  const lvMax = tb.nosub ? 1 : (+tb.depth || 3);
  doc.blocks.forEach(b => {
    if (!after.has(b.id) || TOC_SKIP.has(b.t) || b.nobm) return; let lv = OUT_LV[b.t]; if (lv === undefined) return; const el = $(`.blk[data-id="${b.id}"]`); if (!el) return;
    let text;
    if (b.t === 'pjch') { text = [plainText(b.num || ''), plainText(b.title || '')].filter(Boolean).join(' '); lv = b.num ? 1 : 0; }
    else if (b.t === 'pjsec' || b.t === 'lpsec') { text = plainText(b.html || ''); lv = b.sub ? 3 : 2; }
    else if (b.t === 'chapter') text = [plainText(b.num || ''), plainText(b.title || '')].filter(Boolean).join(' ');
    else text = plainText(b.html || b.title || '');
    if (!text || Math.max(lv, 1) > lvMax) return; out.push({ lv, text, page: pgOf(el) });
  });
  return out;
};
const _extInspL = extInspector;
extInspector = function (b) {
  let h = _extInspL(b);
  if (CAP_T[b.t]) h += `<div class="ir"><label><input type="checkbox" data-bc2="capOn" ${b.capOn ? 'checked' : ''}> ${b.t === 'table' ? 'มีชื่อตาราง “ตารางที่ …” (รันเลขเอง)' : 'มีชื่อภาพ “ภาพที่ …” (รันเลขเอง)'}</label></div>`;
  if (b.t === 'toc') h += `<div class="ir"><label>ชนิดสารบัญ</label><select data-b="kind">${[['', 'สารบัญเรื่อง (หัวข้อ)'], ['tbl', 'สารบัญตาราง'], ['fig', 'สารบัญภาพ']].map(([k, v]) => `<option value="${k}"${(b.kind || '') === k ? ' selected' : ''}>${v}</option>`).join('')}</select></div>`
    + `<div class="ir"><label>ระดับหัวข้อที่แสดง</label><select data-b="depth">${[['3', 'ทุกระดับ'], ['2', 'บท + หัวข้อ'], ['1', 'เฉพาะบท']].map(([k, v]) => `<option value="${k}"${String(b.depth || 3) === k ? ' selected' : ''}>${v}</option>`).join('')}</select></div><p class="hint" style="font-size:14px">สารบัญตาราง/ภาพ: ติ๊ก “มีชื่อตาราง/ภาพ” ที่ตารางหรือรูปวาด แล้วเลขและหน้าจะรันเอง</p>`;
  return h;
};
/* ---------- แผนการสอน: แก้จุดประสงค์ครั้งเดียว ตารางวัดผล / บันทึกหลังสอน / แบบประเมิน ตามให้เอง ---------- */
const liTexts = h => { const d = document.createElement('div'); d.innerHTML = h || ''; return $$('li', d).map(li => { $$('.mx', li).forEach(s => s.textContent = '$' + s.dataset.tex + '$'); return li.textContent.replace(/\s+/g, ' ').trim(); }).filter(Boolean); };
function lpFind(B) {
  B = B || doc.blocks; if (!B.some(b => b.t === 'lphead')) return null;
  const R = { src: {}, tbl: {}, desc: {}, lab: {} }; let sec = '';
  B.forEach((b, i) => {
    if (b.t === 'lpsec') { sec = plainText(b.html || ''); const m = /^3\.([23])\s*(.+?)\s*\((P|A)\)\s*$/.exec(sec); if (m && !R.lab[m[3]]) R.lab[m[3]] = m[2]; return; }
    if (b.t === 'lptext') {
      const k = /^3\.1/.test(sec) ? 'K' : /^3\.2/.test(sec) ? 'P' : /^3\.3/.test(sec) ? 'A' : /^4\./.test(sec) ? 'C' : /^5\./.test(sec) ? 'D' : /แบบประเมินผลด้านความรู้/.test(sec) ? 'descK' : null;
      if (k === 'descK') R.desc.K = b; else if (k && !R.src[k]) R.src[k] = b; return;
    }
    if (b.t === 'table') { const k = /^9\./.test(sec) ? 'eval' : /^10\./.test(sec) ? 'rec' : /แบบประเมินผลด้านความรู้/.test(sec) ? 'sheetK' : /แบบประเมินคุณลักษณะ/.test(sec) ? 'sheetA' : /แบบประเมินสมรรถนะ/.test(sec) ? 'sheetC' : null; if (k && !R.tbl[k]) R.tbl[k] = b; }
  });
  return R;
}
function lpLists(R) { const L = { labP: R.lab && R.lab.P, labA: R.lab && R.lab.A }; ['K', 'P', 'A', 'C', 'D'].forEach(k => L[k] = R.src[k] ? liTexts(R.src[k].html) : []); L.C = L.C.map(x => /^ความสามารถใน/.test(x) ? x : 'ความสามารถใน' + x); return L; }
const lpStrip = h => plainText(h || '');
// ข้อความที่มี $...$ → HTML ที่มีสมการ
const lpTx = x => String(x).split(/(\$[^$]+\$)/).map(p => /^\$[^$]+\$$/.test(p) ? `<span class="mx" contenteditable="false" data-tex="${esc(p.slice(1, -1))}"></span>` : esc(p)).join('');
function genEval(L, old) {
  const kr = (old || []).find((r, i) => /\(K\)/.test(lpStrip(r[0]))) || []; const tool0 = kr[1] || 'ตรวจใบกิจกรรม', tool1 = kr[2] || 'ใบกิจกรรม', crit = kr[3] || 'นักเรียนได้คะแนนร้อยละ 60 ขึ้นไปถือว่าผ่าน';
  const rows = [], keys = [], rs = {}; const add = (k, r, s) => { if (s) rs[rows.length] = s; rows.push(r); keys.push(k); };
  add('h', ['จุดประสงค์การเรียนรู้', 'วิธีการวัดผล', 'เครื่องมือวัดผล', 'เกณฑ์การประเมิน'], 'H');
  add('sK', ['ด้านความรู้', '', '', ''], 'S'); L.K.forEach((x, i) => add('K' + i, [`${i + 1}. ${lpTx(x)} (K)`, tool0, tool1, crit]));
  add('sP', [L.labP || 'ด้านทักษะและกระบวนการทางคณิตศาสตร์', '', '', ''], 'S'); add('P', [`นักเรียนมีความสามารถ<br>${L.P.map((x, i) => `${i + 1}. ${lpTx(x)}`).join('<br>')}`, 'ตรวจใบกิจกรรม', 'ใบกิจกรรม', 'นักเรียนที่มีผลระดับคุณภาพ ดี ขึ้นไปผ่านเกณฑ์']);
  add('sA', [L.labA || 'ด้านคุณลักษณะอันพึงประสงค์ในการเรียนคณิตศาสตร์', '', '', ''], 'S'); add('A', [L.A.map((x, i) => `${i + 1}. ${lpTx(x)}`).join('<br>'), 'สังเกตพฤติกรรม', 'แบบสังเกตพฤติกรรม', 'นักเรียนที่มีผลระดับคุณภาพ ดี ขึ้นไปผ่านเกณฑ์']);
  add('D', [`<b>คุณลักษณะอันพึงประสงค์</b><br>${L.D.map(x => '- ' + lpTx(x)).join('<br>')}`, 'สังเกตพฤติกรรม', 'แบบประเมินคุณลักษณะอันพึงประสงค์', 'นักเรียนที่มีผลระดับคุณภาพ ดี ขึ้นไปผ่านเกณฑ์']);
  add('C', [`<b>สมรรถนะสำคัญของผู้เรียน</b><br>${L.C.map(x => '- ' + lpTx(x)).join('<br>')}`, 'สังเกตพฤติกรรม', 'แบบประเมินสมรรถนะสำคัญของผู้เรียน', 'นักเรียนที่มีผลระดับคุณภาพ ดี ขึ้นไปผ่านเกณฑ์']);
  return { rows, keys, rs };
}
function genRec(L) {
  const D = '.'.repeat(150), rows = [], keys = [], rs = {}; const add = (k, r, s) => { if (s) rs[rows.length] = s; rows.push(r); keys.push(k); };
  const pf = x => `${lpTx(x)}<br><span class="tab">\t</span>​ผ่าน ร้อยละ ................<span class="tab">\t</span><span class="tab">\t</span>​ไม่ผ่าน ร้อยละ ................`;
  const sum = x => `${lpTx(x)}<br>สรุป ผลการประเมินรวม ไม่ผ่าน (0) ...... คน ผ่าน (1) ...... คน ดี (2) ...... คน ดีเยี่ยม (3) ...... คน`;
  add('h', ['ผลหลังการจัดการเรียนรู้'], 'h');
  add('sK', ['ด้านความรู้'], 'S'); L.K.forEach((x, i) => add('K' + i, [pf(`${i + 1}. ${x}`)]));
  add('sP', [L.labP || 'ด้านทักษะและกระบวนการทางคณิตศาสตร์'], 'S'); add('P', [L.P.map((x, i) => pf(`${i + 1}. ${x}`)).join('<br>')]);
  add('sA', [L.labA || 'ด้านคุณลักษณะอันพึงประสงค์ในการเรียนคณิตศาสตร์'], 'S'); add('A', [L.A.map((x, i) => pf(`${i + 1}. ${x}`)).join('<br>')]);
  add('sD', ['คุณลักษณะอันพึงประสงค์ตามหลักสูตร'], 'S'); add('D', [L.D.map((x, i) => sum(`${i + 1}. ${x}`)).join('<br>')]);
  add('sC', ['สมรรถนะสำคัญของผู้เรียนตามหลักสูตร'], 'S'); add('C', [L.C.map((x, i) => sum(`${i + 1}. ${x}`)).join('<br>')]);
  add('hp', ['ปัญหา อุปสรรค และแนวทางแก้ไข'], 'h'); add('pp', [[D, D].join('<br>')]); add('hs', ['ข้อเสนอแนะ'], 'h'); add('ss', [[D, D].join('<br>')]);
  return { rows, keys, rs };
}
function genSheetK(L, old) {
  const n = Math.max(1, (old || []).length - 1); const hd = ['เลขที่', 'ชื่อ - นามสกุล']; L.K.forEach((_, i) => hd.push(`ข้อ ${i + 1}<br>คะแนน`, `ข้อ ${i + 1}<br>ผลการประเมิน`));
  const rows = [hd], keys = ['h']; for (let i = 1; i <= n; i++) { const o = old && old[i] || []; rows.push([o[0] || String(i), o[1] || '', ...L.K.flatMap(() => ['', ''])]); keys.push('r' + i); }
  return { rows, keys, rs: { 0: 'L' }, cw: [7, 35, ...L.K.flatMap(() => [10, 10])].join(','), fixedCols: 2 };
}
function genLevel(items, old) {
  const n = Math.max(1, (old || []).length - 1); const rows = [['เลขที่', 'ชื่อ - นามสกุล', ...items.map(esc), 'รวม', 'ระดับคุณภาพ']], keys = ['h'];
  for (let i = 1; i <= n; i++) { const o = old && old[i] || []; rows.push([o[0] || String(i), o[1] || '', ...items.map(() => ''), '', '']); keys.push('r' + i); }
  return { rows, keys, rs: { 0: 'L' }, cw: [7, 33, ...items.map(() => 12), 8, 12].join(','), fixedCols: 2 };
}
// รวมของใหม่กับของเดิม: ช่องที่ครูแก้เอง (ต่างจากที่ระบบสร้างครั้งก่อน) จะเก็บไว้
function lpMerge(tb, g) {
  const oldRows = tb.rows || [], oldKeys = tb.genKeys, oldGen = tb.gen;
  if (!oldKeys || !oldGen) { tb.gen = g.rows.map(r => r.slice()); tb.genKeys = g.keys; return false; } // ครั้งแรก: จำไว้ก่อน
  const rows = g.rows.map((r, i) => { const k = g.keys[i], oi = oldKeys.indexOf(k); if (oi < 0) return r.slice(); const sameShape = (oldRows[oi] || []).length === r.length;
    return r.map((c, j) => { const cur = (oldRows[oi] || [])[j], was = (oldGen[oi] || [])[j]; if (j < (g.fixedCols || 0)) return cur ?? c; return sameShape && cur !== undefined && cur !== was ? cur : c; }); });
  const changedAny = JSON.stringify(rows) !== JSON.stringify(oldRows);
  tb.rows = rows; tb.rs = g.rs; if (g.cw) tb.cw = g.cw; tb.gen = g.rows.map(r => r.slice()); tb.genKeys = g.keys; return changedAny;
}
let lpSigs = {}, lpTimer = null;
// เอกสารหนึ่งมีได้หลายแผน: แยกเป็นช่วงตามหัวแผน (lphead) แล้วซิงก์แต่ละแผนแยกกัน
function lpSegments() { const B = doc.blocks, out = []; B.forEach((b, i) => { if (b.t === 'lphead') out.push(i); }); return out.map((st, k) => ({ id: B[st].id, blocks: B.slice(st, k + 1 < out.length ? out[k + 1] : B.length) })); }
function lpSync(force) {
  const upd = [];
  lpSegments().forEach(seg => {
    const R = lpFind(seg.blocks); if (!R) return; const L = lpLists(R); const sig = JSON.stringify(L); if (!force && sig === lpSigs[seg.id]) return; const first = !(seg.id in lpSigs); lpSigs[seg.id] = sig;
    const T = R.tbl; const u = [];
    if (T.eval && lpMerge(T.eval, genEval(L, T.eval.rows))) u.push(T.eval.id);
    if (T.rec && lpMerge(T.rec, genRec(L))) u.push(T.rec.id);
    if (T.sheetK && lpMerge(T.sheetK, genSheetK(L, T.sheetK.rows))) u.push(T.sheetK.id);
    if (T.sheetA && lpMerge(T.sheetA, genLevel(L.D, T.sheetA.rows))) u.push(T.sheetA.id);
    if (T.sheetC && lpMerge(T.sheetC, genLevel(L.C, T.sheetC.rows))) u.push(T.sheetC.id);
    if (R.desc.K) { const h = `<b>คำชี้แจง :</b> ครูผู้ตรวจงานนักเรียน แล้วลงคะแนนในแต่ละข้อ<br>${L.K.map((x, i) => `<span class="tab">\t</span>​ข้อ ${i + 1}<span class="tab">\t</span>​${lpTx(x)} (K)`).join('<br>')}`; if (!first && R.desc.K.html !== h) { R.desc.K.html = h; u.push(R.desc.K.id); } }
    if (!first) upd.push(...u);
  });
  if (!upd.length) return;
  const act = document.activeElement; upd.forEach(id => { if (!act || !act.closest || !act.closest(`.blk[data-id="${id}"]`)) rerender(id); });
  changed(); toast('อัปเดตตารางวัดผล บันทึกหลังสอน และแบบประเมินตามจุดประสงค์แล้ว');
}
const _changedL = changed;
changed = function (imm) { _changedL(imm); if (doc && doc.blocks && doc.blocks.some(b => b.t === 'lphead')) { clearTimeout(lpTimer); lpTimer = setTimeout(() => lpSync(), 600); } };

/* ===================== ข้อสอบกลางภาค / ปลายภาค: ใบปะหน้ายึดโยงกับตัวข้อสอบ ===================== */
EXAM_PRESETS.midfinal = { name: 'สอบกลางภาค / ปลายภาค (มีใบปะหน้าโรงเรียน)', subj: 'แบบทดสอบวัดผลปลายภาค', set: 'รายวิชา คณิตศาสตร์เพิ่มเติม 5  รหัส ค33201  ระดับชั้นมัธยมศึกษาปีที่ 6', time: 90, lab: '(1)',
  parts: [{ n: 'ตอนที่ 1 ข้อสอบปรนัย 5 ตัวเลือก', c: 10, t: 'mc5', p: 0.5, w: 'small' }, { n: 'ตอนที่ 2 ข้อสอบปรนัย เติมคำตอบ', c: 5, t: 'fill', p: 1, w: 'small' }, { n: 'ตอนที่ 3 ข้อสอบอัตนัย แสดงวิธีทำ', c: 4, t: 'subans', d: 3, p: 2.5, w: 'full' }] };
const XC_SKILL = { mc4: 'วัดทักษะคิดเลขเร็วและทักษะการคิดคำนวณ', mc5: 'วัดทักษะคิดเลขเร็วและทักษะการคิดคำนวณ', fill: 'วัดทักษะคิดเลขเร็วและทักษะการคิดคำนวณ', int: 'วัดทักษะคิดเลขเร็วและทักษะการคิดคำนวณ', dec: 'วัดทักษะคิดเลขเร็วและทักษะการคิดคำนวณ', write: 'วัดทักษะการแก้โจทย์ปัญหา', subans: 'วัดทักษะการแก้โจทย์ปัญหา', prove: 'วัดทักษะการให้เหตุผล' };
const xcTypeName = t => ({ mc4: 'ข้อสอบปรนัย 4 ตัวเลือก', mc5: 'ข้อสอบปรนัย 5 ตัวเลือก', fill: 'ข้อสอบปรนัย เติมคำตอบ', int: 'ข้อสอบปรนัย เติมคำตอบ', dec: 'ข้อสอบปรนัย เติมคำตอบ', write: 'ข้อสอบอัตนัย แสดงวิธีทำ', subans: 'ข้อสอบอัตนัย แสดงวิธีทำ' }[t] || ('ข้อสอบ' + (QTYPES[t] || '')));
// ช่องเลือกในหน้าต่างสร้างชุดข้อสอบ
(function () { const cv = $('#ebCover'); if (cv && !$('#ebXC')) cv.closest('label').insertAdjacentHTML('beforebegin', '<label><input type="checkbox" id="ebXC"> ใบปะหน้าข้อสอบโรงเรียน (ตรา คำชี้แจง ตาราง ผลการเรียนรู้ ลงนาม · ตัวเลขตามข้อสอบอัตโนมัติ)</label>'); })();
const _ebLoadX = ebLoad; ebLoad = function (k) { _ebLoadX(k); const m = k === 'midfinal'; $('#ebXC').checked = m; if (m) { $('#ebCover').checked = false; $('#ebQH').checked = false; $('#ebSheet').checked = false; $('#ebPartH').checked = true; $('#ebQ').checked = false; } if (typeof ebSum === 'function') ebSum(); };
const _ebReadX = ebRead; ebRead = function () { const c = _ebReadX(); c.xc = $('#ebXC').checked; if (c.xc) c.cover = false; return c; };
const _buildExamX = buildExam;
buildExam = function (c) {
  const B = _buildExamX(c); if (!c.xc) return B;
  const kind = /กลางภาค/.test(c.subj) ? 'กลางภาค' : 'ปลายภาค';
  const head = `${esc(c.subj)} กลุ่มสาระการเรียนรู้คณิตศาสตร์<br>${esc(c.set || 'รายวิชา ...')}<br>ภาคเรียนที่ ... ปีการศึกษา ...  ${SCHOOL}  ${AFF}`;
  const parts = c.parts.map(q => [xcTypeName(q.t), XC_SKILL[q.t] || '', q.c, ptsTxt(q.c * q.p)]);
  const cover = xcBlocks({ head, pages: '...', parts, outs: [['...', '-', '-', '-']] });
  const name = newBlock('pjtext', { noind: true, xc: 'name', npg: true, html: `ชื่อ – นามสกุล ................................................................ ชั้น ............ เลขที่ ............<br><b>เวลา</b> ${c.time} นาที${TAB}<b>คะแนนเต็ม</b> ${ptsTxt(c.parts.reduce((a, q) => a + q.c * q.p, 0))} คะแนน` });
  return cover.concat([name], B);
};
const _ebApplyX = ebApplyLook;
ebApplyLook = function (c) { _ebApplyX(c); if (c.xc) Object.assign(doc.settings, { hl: c.subj, hr: SCHOOL, nologo: true, ft: '', au: '', pnPos: 'tr', pnFmt: 'หน้า {n}', pnRules: [{ a: 1, b: 1, m: 'blank' }] }); };
/* ---------- ซิงก์: จำนวนหน้า · จำนวนข้อ · คะแนนแต่ละตอน · รวมผลการเรียนรู้ ---------- */
function xcScan() {
  const B = doc.blocks; const parts = []; let cur = null;
  B.forEach((b, i) => {
    if (b.t === 'part') { cur = { name: plainText(b.html || ''), n: 0, pts: 0, qt: null }; parts.push(cur); return; }
    if (b.t === 'problem' && !b.nobm) {
      if (!cur) { cur = { name: '', n: 0, pts: 0, qt: null }; parts.push(cur); }
      cur.n++; cur.pts += parseFloat(String(b.pts || '').replace(/[^\d.]/g, '')) || 0;
      if (!cur.qt) { let t = b.qt; if (!t) { for (let j = i + 1; j < B.length && B[j].t !== 'problem' && B[j].t !== 'part'; j++) if (B[j].t === 'choices') { t = (B[j].items || []).length >= 5 ? 'mc5' : 'mc4'; break; } } cur.qt = t || 'write'; }
    }
  });
  return parts.filter(p => p.n);
}
let xcSig = '', xcTimer = null;
function xcSync() {
  const tP = doc.blocks.find(b => b.xc === 'parts'); if (!tP) return; const pg = doc.blocks.find(b => b.xc === 'pages'), tO = doc.blocks.find(b => b.xc === 'outs');
  const parts = xcScan(); const nPages = Math.max(0, $('#sheets').childElementCount - 1);
  const outSig = tO ? JSON.stringify((tO.rows || []).slice(2).map(r => r.slice(1, 4))) : '';
  const sig = JSON.stringify([parts, nPages, outSig]); if (sig === xcSig) return; const first = !xcSig; xcSig = sig;
  const upd = [];
  if (parts.length) {
    const old = tP.rows || []; const P = parts.map((p, i) => { const o1 = old[i * 2] || []; return [o1[2] ? plainText(o1[2]) : xcTypeName(p.qt), o1[3] ? plainText(o1[3]) : (XC_SKILL[p.qt] || ''), p.n, ptsTxt(p.pts)]; });
    const rows = xcPartRows(P); if (JSON.stringify(rows) !== JSON.stringify(old)) { tP.rows = rows; upd.push(tP.id); }
  }
  if (pg && nPages) { const h = `${TAB}1. ข้อสอบ จำนวน ${nPages} หน้า`; if (pg.html !== h) { pg.html = h; upd.push(pg.id); } }
  const nm = doc.blocks.find(b => b.xc === 'name'); if (nm && parts.length) { const tot = ptsTxt(parts.reduce((a, p) => a + p.pts, 0)); const h = String(nm.html || '').replace(/(คะแนนเต็ม<\/b>\s*)[\d.]+/, '$1' + tot); if (h !== nm.html) { nm.html = h; upd.push(nm.id); } }
  if (tO) { let ch = false; (tO.rows || []).slice(2).forEach(r => { const v = r.slice(1, 4).map(x => +plainText(String(x)) || 0).reduce((a, x) => a + x, 0); const s = v ? String(v) : '-'; if (r[4] !== s) { r[4] = s; ch = true; } }); if (ch) upd.push(tO.id); }
  if (!upd.length) return; const act = document.activeElement;
  upd.forEach(id => { if (!act || !act.closest || !act.closest(`.blk[data-id="${id}"]`)) rerender(id); });
  if (!first) changed();
}
const _changedX = changed;
changed = function (imm) { _changedX(imm); if (doc && doc.blocks && doc.blocks.some(b => b.xc === 'parts')) { clearTimeout(xcTimer); xcTimer = setTimeout(xcSync, 900); } };
/* ---------- แม่แบบ ---------- */
DOC_TEMPLATES.push(['สอบกลางภาค / ปลายภาค', '', 'MIDFINAL']);
TPL_META['สอบกลางภาค / ปลายภาค'] = ['exam', 'ใบปะหน้าโรงเรียน + ตัวข้อสอบแยกตอน · จำนวนหน้า ข้อ และคะแนนบนใบปะหน้าอัปเดตตามข้อสอบเอง', 'midf'];
const _tplThumbM = tplThumb;
tplThumb = function (k) { if (k !== 'midf') return _tplThumbM(k); const L = (y, w, c = '#d9cfc6', x = 8) => `<rect x="${x}" y="${y}" width="${w}" height="3" rx="1.5" fill="${c}"/>`;
  return `<svg viewBox="0 0 64 82" width="58" height="74"><rect x="10" y="4" width="50" height="74" rx="4" fill="#fff" stroke="#e3d6c8"/>${L(14, 30, '#d9cfc6', 22)}${L(22, 38, '#d9cfc6', 16)}<circle cx="22" cy="40" r="2" fill="#a88"/>${L(39, 24, '#d9cfc6', 27)}<circle cx="22" cy="50" r="2" fill="#a88"/>${L(49, 24, '#d9cfc6', 27)}<rect x="16" y="58" width="38" height="14" rx="2" fill="none" stroke="#c9b6a8" stroke-dasharray="3 2"/><rect x=".5" y=".5" width="48" height="72" rx="4" fill="#fff" stroke="#e3d6c8"/><path d="M21 6h7v5l-3.5 2.5L21 11z" fill="#1f3ce6"/>${L(17, 30, '#555', 9)}${L(22, 36, '#999', 6)}<line x1="5" y1="27" x2="44" y2="27" stroke="#333"/>${L(31, 14, '#333', 5)}${L(36, 30, '#d9cfc6', 5)}<rect x="5" y="44" width="39" height="11" fill="none" stroke="#9fb0d8"/><rect x="5" y="44" width="39" height="3" fill="#dfe6f7"/>${L(60, 12, '#bbb', 6)}${L(60, 12, '#bbb', 28)}</svg>`; };

/* ===================== ปรับขนาดตาราง: ลากเส้นคอลัมน์ · ขอบล่างแถว · ขอบขวาตาราง ===================== */
const _bTXs = buildTableX;
buildTableX = function (el, b) {
  _bTXs(el, b); const t = $('table', el); if (!t) return;
  if (!b.full && b.tw) t.style.width = Math.min(100, +b.tw) + '%';
  if (b.tfs) t.style.fontSize = (+b.tfs) + 'em';
  t.classList.toggle('pad-s', b.pad === 's'); t.classList.toggle('pad-l', b.pad === 'l');
  $$('tr', t).forEach(tr => { const c = tr.querySelector('td[data-cell]'); if (!c) return; const i = +c.dataset.cell.split(',')[0]; const mm = (b.rh || {})[i] || +b.rha || 0; tr.style.height = mm ? (mm * 3.7795) + 'px' : ''; });
};
const TZ = () => parseFloat(($('#zoomwrap') || {}).style?.zoom) || 1;
function tblCols(t) { // ความกว้างแต่ละคอลัมน์ (px) จากแถวที่ไม่มีการรวมช่องมากที่สุด
  const rows = Array.from(t.rows).filter(r => !r.classList.contains('pgsp') && !r.classList.contains('rephd'));
  const n = Math.max(...rows.map(r => Array.from(r.cells).reduce((a, c) => a + (c.colSpan || 1), 0)));
  const cg = $$('colgroup col', t); if (cg.length === n) return cg.map(c => c.getBoundingClientRect().width / TZ() || 0).map((w, j) => w || 40);
  const r = rows.find(r => r.cells.length === n && Array.from(r.cells).every(c => (c.colSpan || 1) === 1));
  if (r) return Array.from(r.cells).map(c => c.getBoundingClientRect().width / TZ());
  return Array(n).fill(t.getBoundingClientRect().width / TZ() / n);
}
function tblHandles(blk) {
  const w = $('.b-table', blk), t = w && $('table', w); if (!t) return; $$('.tz', w).forEach(x => x.remove());
  const z = TZ(), wr = w.getBoundingClientRect(), tr = t.getBoundingClientRect(); const L = (tr.left - wr.left) / z, T = (tr.top - wr.top) / z, H = tr.height / z, Wd = tr.width / z;
  const cols = tblCols(t); let x = L; const add = h => w.insertAdjacentHTML('beforeend', h);
  cols.slice(0, -1).forEach((cw, j) => { x += cw; add(`<div class="tz tzc" data-j="${j}" style="left:${x - 4}px;top:${T}px;height:${H}px" title="ลากเพื่อปรับความกว้างคอลัมน์"></div>`); });
  add(`<div class="tz tzw" style="left:${L + Wd - 4}px;top:${T}px;height:${H}px" title="ลากเพื่อปรับความกว้างทั้งตาราง"></div>`);
  Array.from(t.rows).forEach(r => { const c = r.querySelector('td[data-cell]'); if (!c) return; const rr = r.getBoundingClientRect(); add(`<div class="tz tzr" data-i="${c.dataset.cell.split(',')[0]}" style="left:${L}px;width:${Wd}px;top:${(rr.bottom - wr.top) / z - 3}px" title="ลากเพื่อปรับความสูงแถว"></div>`); });
}
document.addEventListener('mouseover', e => { const blk = e.target.closest && e.target.closest('#flow .blk[data-t="table"]'); if (!blk || blk.dataset.tz === '1' || tzDrag) return; blk.dataset.tz = '1'; tblHandles(blk); blk.addEventListener('mouseleave', () => { if (tzDrag || blk.contains(document.activeElement)) { blk.dataset.tz = '1'; return; } blk.dataset.tz = ''; $$('.tz', blk).forEach(x => x.remove()); }, { once: true }); });
let tzDrag = null;
document.addEventListener('pointerdown', e => {
  const h = e.target.closest && e.target.closest('#flow .tzc, #flow .tzw, #flow .tzr'); if (!h) return; e.preventDefault(); e.stopPropagation();
  const blk = h.closest('.blk'), b = byId(blk.dataset.id), t = $('table', blk); if (!b || !t) return;
  const z = TZ(); tzDrag = { h, blk, b, t, x: e.clientX, y: e.clientY, z };
  if (h.classList.contains('tzc')) { tzDrag.kind = 'c'; tzDrag.j = +h.dataset.j; tzDrag.cols = tblCols(t); let cg = $('colgroup', t); if (!cg || cg.children.length !== tzDrag.cols.length) { if (cg) cg.remove(); cg = document.createElement('colgroup'); tzDrag.cols.forEach(() => cg.appendChild(document.createElement('col'))); t.prepend(cg); } t.style.tableLayout = 'fixed'; tzDrag.cg = cg; }
  else if (h.classList.contains('tzw')) { tzDrag.kind = 'w'; tzDrag.w0 = t.getBoundingClientRect().width / z; tzDrag.flowW = $('#flow').getBoundingClientRect().width / z; }
  else { tzDrag.kind = 'r'; tzDrag.i = +h.dataset.i; const row = $(`td[data-cell^="${tzDrag.i},"]`, t).parentElement; tzDrag.row = row; tzDrag.h0 = row.getBoundingClientRect().height / z; }
  document.body.classList.add('tzdragging');
}, true);
document.addEventListener('pointermove', e => {
  const d = tzDrag; if (!d) return; const dx = (e.clientX - d.x) / d.z, dy = (e.clientY - d.y) / d.z;
  if (d.kind === 'c') { const c = d.cols.slice(); const a = Math.max(36, c[d.j] + dx), bb = Math.max(36, c[d.j] + c[d.j + 1] - a); c[d.j] = c[d.j] + c[d.j + 1] - bb; c[d.j + 1] = bb; const tot = c.reduce((s, x) => s + x, 0); Array.from(d.cg.children).forEach((col, j) => col.style.width = (c[j] / tot * 100) + '%'); d.now = c; d.h.style.left = (parseFloat(d.h.style.left) + 0) + 'px'; }
  if (d.kind === 'w') { const pct = Math.max(20, Math.min(100, Math.round((d.w0 + dx * 2) / d.flowW * 100))); d.t.style.width = pct + '%'; d.now = pct; }
  if (d.kind === 'r') { const px = Math.max(12, d.h0 + dy); d.row.style.height = px + 'px'; d.now = Math.round(px / 3.7795 * 2) / 2; }
});
document.addEventListener('pointerup', () => {
  const d = tzDrag; if (!d) return; tzDrag = null; document.body.classList.remove('tzdragging'); if (d.now === undefined) return; const b = d.b;
  if (d.kind === 'c') b.cw = d.now.map(x => Math.round(x)).join(',');
  if (d.kind === 'w') { if (d.now >= 100) { b.full = true; delete b.tw; } else { b.full = false; b.tw = d.now; } }
  if (d.kind === 'r') { b.rh = b.rh || {}; b.rh[d.i] = d.now; }
  d.blk.dataset.tz = ''; rerender(b.id); changed(true); if (curId === b.id) refreshInspector();
});
function tblResetSize() { const b = byId(curId); if (!b || b.t !== 'table') return; delete b.cw; delete b.rh; delete b.rha; delete b.tw; delete b.pad; delete b.tfs; rerender(b.id); changed(true); refreshInspector(); }
const _extInspZ = extInspector;
extInspector = function (b) {
  let h = _extInspZ(b); if (b.t !== 'table') return h;
  const sel = (k, lab, opts) => `<div class="ir"><label>${lab}</label><select data-b="${k}">${opts.map(([v, t]) => `<option value="${v}"${String(b[k] || '') === v ? ' selected' : ''}>${t}</option>`).join('')}</select></div>`;
  return h + `<div class="ir flowctl"><b>ขนาดตาราง</b></div><p class="hint" style="font-size:14px">ชี้เมาส์ที่ตาราง แล้วลาก <b>เส้นแบ่งคอลัมน์</b> (ปรับความกว้างคอลัมน์) · <b>ขอบล่างของแถว</b> (ปรับความสูงแถว) · <b>ขอบขวาสุด</b> (ปรับความกว้างทั้งตาราง)</p>`
    + `<div class="ir"><label>ความกว้างตาราง (% ของหน้า)</label><input type="number" min="20" max="100" step="5" value="${b.full ? 100 : (b.tw || '')}" placeholder="อัตโนมัติ" onchange="const x = byId('${b.id}'), v = +this.value; if (!v || v >= 100) { x.full = v >= 100; delete x.tw; } else { x.full = false; x.tw = v; } rerender(x.id); changed(true)"></div>`
    + `<div class="ir"><label>ความสูงทุกแถวอย่างน้อย (มม.)</label><input type="number" min="0" max="80" step="1" data-bn="rha" value="${b.rha || 0}"></div>`
    + sel('pad', 'ระยะห่างในช่อง', [['', 'ปกติ'], ['s', 'แคบ (ประหยัดที่)'], ['l', 'กว้าง']])
    + sel('tfs', 'ขนาดตัวอักษรในตาราง', [['0.8', '80%'], ['0.9', '90%'], ['', '100%'], ['1.1', '110%'], ['1.2', '120%']])
    + `<div class="ir"><button class="tb" onclick="tblResetSize()">คืนค่าขนาดเริ่มต้น</button></div>`;
};

/* ===================== แก้ตารางแบบ Pages: แถบแถว/คอลัมน์ · ปุ่ม + · ลากมุมเพิ่มแถว/คอลัมน์ · เมนูคลิกขวา ===================== */
const tNcol = b => Math.max(...(b.rows || [['']]).map(r => r.length));
function tPrep(b) { if (b.rs === undefined) b.rs = { 0: 'L' }; const n = tNcol(b); b.rows.forEach(r => { while (r.length < n) r.push(''); }); }
const shiftObj = (o, at, d) => { if (!o) return o; const n = {}; Object.entries(o).forEach(([k, v]) => { const i = +k; if (d < 0 && i === at) return; n[i >= at + (d < 0 ? 1 : 0) ? i + d : i] = v; }); return n; };
function shiftMg(b, axis, at, d) { // axis 0 = แถว, 1 = คอลัมน์ · d = +1 แทรกที่ at, -1 ลบ at
  if (!b.mg) return; const n = {};
  Object.entries(b.mg).forEach(([k, v]) => { let p = k.split(',').map(Number), s = v.slice(); const a = p[axis], len = s[axis];
    if (d > 0) { if (a >= at) p[axis]++; else if (a + len > at) s[axis]++; }
    else { if (a === at) { if (len <= 1) return; s[axis]--; } else if (a > at) p[axis]--; else if (a + len > at) s[axis]--; }
    if (s[0] > 1 || s[1] > 1) n[p.join(',')] = s; });
  b.mg = n;
}
function tblInsRow(b, i) { tPrep(b); const n = tNcol(b); b.rows.splice(i, 0, Array(n).fill('')); b.rs = shiftObj(b.rs, i, 1); b.rh = shiftObj(b.rh, i, 1); shiftMg(b, 0, i, 1); }
function tblDelRow(b, i) { if (b.rows.length <= 1) { toast('ตารางต้องมีอย่างน้อย 1 แถว'); return false; } tPrep(b); b.rows.splice(i, 1); b.rs = shiftObj(b.rs, i, -1); b.rh = shiftObj(b.rh, i, -1); shiftMg(b, 0, i, -1); return true; }
function tblCwArr(b, n) { const c = cwOf(b); return c ? Array.from({ length: n }, (_, j) => c[j] || c[c.length - 1]) : null; }
function tblInsCol(b, j) { tPrep(b); const n = tNcol(b); const cw = tblCwArr(b, n); b.rows.forEach(r => r.splice(j, 0, '')); if (cw) { const w = Math.round(cw.reduce((a, x) => a + x, 0) / n); cw.splice(j, 0, w); b.cw = cw.join(','); } shiftMg(b, 1, j, 1); }
function tblDelCol(b, j) { const n = tNcol(b); if (n <= 1) { toast('ตารางต้องมีอย่างน้อย 1 คอลัมน์'); return false; } tPrep(b); const cw = tblCwArr(b, n); b.rows.forEach(r => r.splice(j, 1)); if (cw) { cw.splice(j, 1); b.cw = cw.join(','); } shiftMg(b, 1, j, -1); return true; }
function tblAfter(b, focus) { rerender(b.id); changed(true); if (curId === b.id) refreshInspector(); const el = $(`.blk[data-id="${b.id}"]`); if (el) el.dataset.tz = ''; if (focus) { const td = $(`.blk[data-id="${b.id}"] td[data-cell="${focus}"]`); if (td) placeCaretEnd(td); } }
function tblTabAdd(blk) { const b = byId(blk.dataset.id); if (!b || b.t !== 'table') return; const i = b.rows.length; tblInsRow(b, i); tblAfter(b, i + ',0'); }
/* ---------- เมนู ---------- */
let tmenu = null;
function tblMenu(x, y, b, kind, idx) {
  tblMenuClose(); const m = document.createElement('div'); m.className = 'tmenu';
  const it = (t, f) => `<button data-f="${f}">${t}</button>`; const rsv = (b.rs || (b.rs === undefined ? { 0: 'L' } : {}))[idx] || '';
  let h = '';
  if (kind === 'row') h = it('⬆ แทรกแถวด้านบน', 'rA') + it('⬇ แทรกแถวด้านล่าง', 'rB') + it('⧉ ทำซ้ำแถวนี้', 'rD') + it('✕ ลบแถวนี้', 'rX') + '<hr>' + RS_OPTS.map(([k, v]) => `<button data-f="rs:${k}"${rsv === k ? ' class="on"' : ''}>${v}</button>`).join('');
  else h = it('⟷ กว้างขึ้น', 'cW') + it('⟵⟶ แคบลง', 'cN') + '<hr>' + it('⬅ แทรกคอลัมน์ด้านซ้าย', 'cL') + it('➡ แทรกคอลัมน์ด้านขวา', 'cR') + it('✕ ลบคอลัมน์นี้', 'cX') + '<hr>' + it('↔ แบ่งความกว้างทุกคอลัมน์เท่ากัน', 'cE');
  m.innerHTML = h; document.body.appendChild(m);
  const r = m.getBoundingClientRect(); m.style.left = Math.min(x, innerWidth - r.width - 8) + 'px'; m.style.top = Math.min(y, innerHeight - r.height - 8) + 'px';
  m.onclick = e => { const f = e.target.closest('button')?.dataset.f; if (!f) return; tblMenuClose(); let foc = null;
    if (f === 'rA') { tblInsRow(b, idx); foc = idx + ',0'; } if (f === 'rB') { tblInsRow(b, idx + 1); foc = (idx + 1) + ',0'; }
    if (f === 'rD') { tblInsRow(b, idx + 1); b.rows[idx + 1] = b.rows[idx].slice(); }
    if (f === 'rX' && !tblDelRow(b, idx)) return;
    if (f.startsWith('rs:')) { tPrep(b); const v = f.slice(3); if (v) b.rs[idx] = v; else delete b.rs[idx]; }
    if (f === 'cL') { tblInsCol(b, idx); foc = '0,' + idx; } if (f === 'cR') { tblInsCol(b, idx + 1); foc = '0,' + (idx + 1); }
    if (f === 'cW' || f === 'cN') { tblNudgeCol(b.id, idx, f === 'cW' ? 6 : -6); return; } if (f === 'cX' && !tblDelCol(b, idx)) return; if (f === 'cE') delete b.cw;
    tblAfter(b, foc); };
  tmenu = m; setTimeout(() => document.addEventListener('mousedown', tblMenuOut, true), 0);
}
function tblMenuOut(e) { if (tmenu && !tmenu.contains(e.target)) tblMenuClose(); }
function tblMenuClose() { if (tmenu) tmenu.remove(); tmenu = null; document.removeEventListener('mousedown', tblMenuOut, true); }
/* ---------- แถบจับรอบตาราง (วาดต่อจากที่จับปรับขนาด) ---------- */
const _tblHandles0 = tblHandles;
tblHandles = function (blk) {
  _tblHandles0(blk); const w = $('.b-table', blk), t = w && $('table', w); if (!t) return;
  const z = TZ(), wr = w.getBoundingClientRect(), tr = t.getBoundingClientRect(); const L = (tr.left - wr.left) / z, T = (tr.top - wr.top) / z, H = tr.height / z, W = tr.width / z;
  const add = h => w.insertAdjacentHTML('beforeend', h); let x = L;
  tblCols(t).forEach((cw, j) => { add(`<div class="tz tzct" data-j="${j}" style="left:${x + 2}px;top:${T - 15}px;width:${cw - 4}px" title="คอลัมน์ ${j + 1}: คลิกเพื่อแทรก/ลบคอลัมน์"></div>`); x += cw; });
  Array.from(t.rows).forEach(r => { const c = r.querySelector('td[data-cell]'); if (!c) return; const rr = r.getBoundingClientRect(); add(`<div class="tz tzrt" data-i="${c.dataset.cell.split(',')[0]}" style="left:${L - 16}px;top:${(rr.top - wr.top) / z + 2}px;height:${rr.height / z - 4}px" title="แถว: คลิกเพื่อแทรก/ลบแถว หรือเปลี่ยนเป็นแถวหัว"></div>`); });
  add(`<button class="tz tzplus tzpr" style="left:${L + W + 6}px;top:${T + H / 2 - 11}px" title="เพิ่มคอลัมน์ทางขวา">+</button><button class="tz tzplus tzpb" style="left:${L + W / 2 - 11}px;top:${T + H + 4}px" title="เพิ่มแถวด้านล่าง">+</button><div class="tz tzcorner" style="left:${L + W - 5}px;top:${T + H - 5}px" title="ลากเพื่อเพิ่ม/ลดจำนวนแถวและคอลัมน์"></div>`);
};
document.addEventListener('click', e => {
  const h = e.target.closest && e.target.closest('#flow .tzct, #flow .tzrt, #flow .tzplus'); if (!h) return; e.preventDefault(); e.stopPropagation();
  const blk = h.closest('.blk'), b = byId(blk.dataset.id); if (!b) return; if (curId !== b.id && typeof selectBlock === 'function') selectBlock(b.id);
  if (h.classList.contains('tzpr')) { tblInsCol(b, tNcol(b)); return tblAfter(b); }
  if (h.classList.contains('tzpb')) { const i = b.rows.length; tblInsRow(b, i); return tblAfter(b, i + ',0'); }
  const r = h.getBoundingClientRect(); if (h.classList.contains('tzct')) tblMenu(r.left, r.bottom + 4, b, 'col', +h.dataset.j); else tblMenu(r.right + 4, r.top, b, 'row', +h.dataset.i);
}, true);
// คลิกขวาในช่องตาราง → เมนูแถว/คอลัมน์
document.addEventListener('contextmenu', e => {
  const td = e.target.closest && e.target.closest('#flow td[data-cell]'); if (!td) return; const b = byId(td.closest('.blk').dataset.id); if (!b || b.t !== 'table') return; e.preventDefault();
  const [i, j] = td.dataset.cell.split(',').map(Number); tblMenuClose(); const m = document.createElement('div'); m.className = 'tmenu';
  m.innerHTML = '<div class="tmh">แถว</div><button data-k="row">จัดการแถวนี้…</button><div class="tmh">คอลัมน์</div><button data-k="col">จัดการคอลัมน์นี้…</button>'; document.body.appendChild(m);
  m.style.left = e.clientX + 'px'; m.style.top = e.clientY + 'px'; tmenu = m; setTimeout(() => document.addEventListener('mousedown', tblMenuOut, true), 0);
  m.onclick = ev => { const k = ev.target.closest('button')?.dataset.k; if (!k) return; tblMenu(e.clientX, e.clientY, b, k, k === 'row' ? i : j); };
}, true);
// ลากมุมขวาล่าง → เพิ่ม/ลดแถวและคอลัมน์
let tzc = null;
document.addEventListener('pointerdown', e => {
  const h = e.target.closest && e.target.closest('#flow .tzcorner'); if (!h) return; e.preventDefault(); e.stopPropagation();
  const blk = h.closest('.blk'), b = byId(blk.dataset.id), t = $('table', blk); const z = TZ(); const tr = t.getBoundingClientRect();
  tzc = { blk, b, t, x: e.clientX, y: e.clientY, z, rh: tr.height / z / Math.max(1, t.rows.length), cw: tr.width / z / tNcol(b), dr: 0, dc: 0 };
  const g = document.createElement('div'); g.className = 'tzghost'; blk.querySelector('.b-table').appendChild(g); tzc.g = g; tzc.base = { l: (tr.left - blk.querySelector('.b-table').getBoundingClientRect().left) / z, t: (tr.top - blk.querySelector('.b-table').getBoundingClientRect().top) / z, w: tr.width / z, h: tr.height / z };
  document.body.classList.add('tzdragging'); document.body.style.cursor = 'nwse-resize';
}, true);
document.addEventListener('pointermove', e => {
  const d = tzc; if (!d) return; const dx = (e.clientX - d.x) / d.z, dy = (e.clientY - d.y) / d.z;
  d.dr = Math.max(1 - d.b.rows.length, Math.round(dy / d.rh)); d.dc = Math.max(1 - tNcol(d.b), Math.round(dx / d.cw));
  Object.assign(d.g.style, { left: d.base.l + 'px', top: d.base.t + 'px', width: Math.max(20, d.base.w + d.dc * d.cw) + 'px', height: Math.max(14, d.base.h + d.dr * d.rh) + 'px' });
  d.g.dataset.lab = `${d.b.rows.length + d.dr} แถว × ${tNcol(d.b) + d.dc} คอลัมน์`;
});
document.addEventListener('pointerup', () => {
  const d = tzc; if (!d) return; tzc = null; d.g.remove(); document.body.classList.remove('tzdragging'); document.body.style.cursor = ''; const b = d.b; let skipped = 0;
  for (let k = 0; k < d.dr; k++) tblInsRow(b, b.rows.length);
  for (let k = 0; k < -d.dr; k++) { const r = b.rows[b.rows.length - 1]; if (r.some(c => plainText(c || ''))) { skipped++; break; } tblDelRow(b, b.rows.length - 1); }
  for (let k = 0; k < d.dc; k++) tblInsCol(b, tNcol(b));
  for (let k = 0; k < -d.dc; k++) { const j = tNcol(b) - 1; if (b.rows.some(r => plainText(r[j] || ''))) { skipped++; break; } tblDelCol(b, j); }
  if (d.dr || d.dc) tblAfter(b); if (skipped) toast('ไม่ลบแถว/คอลัมน์ที่มีข้อความ — ลบเองได้จากแถบข้างตาราง');
});
/* ---------- ปรับความกว้างคอลัมน์: ใช้ได้บน iPad (แตะช่องแล้วมีที่จับ) + ตั้งตัวเลขที่แผงขวา ---------- */
document.addEventListener('focusin', e => { const blk = e.target.closest && e.target.closest('#flow .blk[data-t="table"]'); if (!blk || tzDrag || tzc) return; blk.dataset.tz = '1'; tblHandles(blk); });
document.addEventListener('focusout', e => { const blk = e.target.closest && e.target.closest('#flow .blk[data-t="table"]'); if (!blk) return; setTimeout(() => { if (!blk.contains(document.activeElement) && !blk.matches(':hover') && !tzDrag && !tzc) { blk.dataset.tz = ''; $$('.tz', blk).forEach(x => x.remove()); } }, 200); });
function tblColPct(b) { const n = tNcol(b); const cw = tblCwArr(b, n) || Array(n).fill(1); const t = cw.reduce((a, x) => a + x, 0); return cw.map(x => Math.round(x / t * 1000) / 10); }
function tblSetCol(id, j, v) { const b = byId(id); if (!b) return; const n = tNcol(b); let p = tblColPct(b); v = Math.max(3, Math.min(94, +v || 0)); const rest = 100 - v, others = p.reduce((a, x, k) => k === j ? a : a + x, 0) || 1; p = p.map((x, k) => k === j ? v : x / others * rest); b.cw = p.map(x => Math.max(1, Math.round(x * 10))).join(','); rerender(id); changed(true); refreshInspector(); }
function tblNudgeCol(id, j, d) { const b = byId(id); if (b) tblSetCol(id, j, tblColPct(b)[j] + d); }
const _extInspCW = extInspector;
extInspector = function (b) {
  let h = _extInspCW(b); if (b.t !== 'table') return h;
  const p = tblColPct(b);
  return h + `<div class="ir col"><label>ความกว้างแต่ละคอลัมน์ (% ของตาราง)</label><div class="cwgrid">${p.map((x, j) => `<div class="cwc"><span>ค.${j + 1}</span><button class="tb" onclick="tblNudgeCol('${b.id}', ${j}, -5)">−</button><input type="number" min="3" max="94" step="1" value="${Math.round(x)}" onchange="tblSetCol('${b.id}', ${j}, this.value)"><button class="tb" onclick="tblNudgeCol('${b.id}', ${j}, 5)">+</button></div>`).join('')}</div><button class="tb" onclick="const x = byId('${b.id}'); delete x.cw; rerender(x.id); changed(true); refreshInspector()">แบ่งเท่ากันทุกคอลัมน์</button></div>`;
};
/* ---------- ปรับขนาดพอดีเนื้อหาอัตโนมัติ (ทั้งตาราง) ---------- */
function tblFitMeasure(b) {
  const blk = $(`.blk[data-id="${b.id}"]`), t = blk && $('table', blk); if (!t) return null;
  const host = $('#flow'); const flowW = $('.b-table', blk).getBoundingClientRect().width / TZ();
  const c = t.cloneNode(true); $$('colgroup', c).forEach(x => x.remove()); $$('tr.pgsp, tr.rephd', c).forEach(x => x.remove()); $$('tr', c).forEach(tr => tr.style.height = '');
  c.style.cssText += ';table-layout:auto;width:auto;max-width:' + flowW + 'px;position:absolute;left:-99999px;top:0;visibility:hidden';
  const box = document.createElement('div'); box.className = $('.b-table', blk).className; box.style.cssText = 'position:absolute;left:-99999px;top:0;width:' + flowW + 'px'; box.appendChild(c); blk.appendChild(box);
  const rows = Array.from(c.rows); const n = Math.max(...rows.map(r => Array.from(r.cells).reduce((a, x) => a + (x.colSpan || 1), 0)));
  // ความกว้างที่อยากได้ = ข้อความยาวสุดแบบไม่ตัดบรรทัด, ต่ำสุด = คำยาวสุด
  const want = Array(n).fill(0), min = Array(n).fill(30);
  rows.forEach(r => { let j = 0; Array.from(r.cells).forEach(cell => { const s = cell.colSpan || 1; if (s === 1) { cell.style.whiteSpace = 'nowrap'; want[j] = Math.max(want[j], cell.getBoundingClientRect().width / TZ()); cell.style.whiteSpace = ''; } j += s; }); });
  c.style.width = '1px'; rows.forEach(r => { let j = 0; Array.from(r.cells).forEach(cell => { const s = cell.colSpan || 1; if (s === 1) min[j] = Math.max(min[j], cell.getBoundingClientRect().width / TZ()); j += s; }); });
  box.remove();
  for (let j = 0; j < n; j++) { if (!want[j]) want[j] = 60; want[j] = Math.max(want[j] + 2, min[j]); }
  let tot = want.reduce((a, x) => a + x, 0), w = want.slice();
  if (tot > flowW) { // ยาวเกินหน้า: ให้คอลัมน์ที่ข้อความยาวยอมตัดบรรทัด (ลดส่วนที่เกินตามสัดส่วนส่วนที่ลดได้)
    const minTot = min.reduce((a, x) => a + x, 0), room = Math.max(0, flowW - minTot), extra = want.map((x, j) => x - min[j]), exTot = extra.reduce((a, x) => a + x, 0) || 1;
    w = min.map((m, j) => m + room * extra[j] / exTot); tot = flowW;
  }
  return { cols: w, pct: Math.min(100, Math.ceil(tot / flowW * 100)) };
}
function tblAutoFit(id, quiet) {
  const b = byId(id || curId); if (!b || b.t !== 'table') return;
  const m = tblFitMeasure(b); if (!m) return;
  b.cw = m.cols.map(x => Math.round(x)).join(','); delete b.rh; delete b.rha;
  if (m.pct >= 96) { b.full = true; delete b.tw; } else { b.full = false; b.tw = Math.max(20, m.pct); }
  rerender(b.id); if (!quiet) { changed(true); if (curId === b.id) refreshInspector(); toast('ปรับขนาดตารางให้พอดีเนื้อหาแล้ว · ลากเส้นเพื่อปรับเองต่อได้'); }
}
function tblAutoFitAll() { const T = doc.blocks.filter(b => b.t === 'table'); T.forEach(b => tblAutoFit(b.id, true)); changed(true); refreshInspector(); toast(`ปรับตารางพอดีเนื้อหาแล้ว ${T.length} ตาราง`); }
const _extInspFit = extInspector;
extInspector = function (b) {
  const h = _extInspFit(b); if (b.t !== 'table') return h;
  return h.replace('<div class="ir flowctl"><b>ขนาดตาราง</b></div>', `<div class="ir flowctl"><b>ขนาดตาราง</b></div><div class="ir" style="gap:6px;flex-wrap:wrap"><button class="tb primary" onclick="tblAutoFit()">✨ พอดีเนื้อหา (ทั้งตาราง)</button><button class="tb" onclick="tblAutoFitAll()">ทุกตารางในเอกสาร</button></div>`);
};
// เมนูคลิกขวา: เพิ่มคำสั่งพอดีเนื้อหา
const _tblMenuFit = tblMenu;
tblMenu = function (x, y, b, kind, idx) {
  _tblMenuFit(x, y, b, kind, idx); if (!tmenu) return;
  tmenu.insertAdjacentHTML('beforeend', '<hr><button data-fit="1">✨ ปรับทั้งตารางให้พอดีเนื้อหา</button>');
  $('[data-fit]', tmenu).addEventListener('click', ev => { ev.stopPropagation(); tblMenuClose(); tblAutoFit(b.id); });
};

/* ===================== เส้นคั่น / ลายคั่น ปรับได้ (จุดไข่ปลา เส้นประ เส้นทึบ คลื่น อิโมจิ สัญลักษณ์) ===================== */
const DV_STYLES = [['dot', 'จุดไข่ปลา ••••'], ['dash', 'เส้นประ - - -'], ['solid', 'เส้นทึบ ───'], ['thick', 'เส้นหนา ━━━'], ['double', 'เส้นคู่ ═══'], ['wave', 'เส้นคลื่น 〰'], ['char', 'สัญลักษณ์ / อิโมจิ'], ['none', 'ไม่มีเส้น']];
const DV_CHARS = ['✦', '★', '✿', '❀', '◆', '●', '○', '♦', '❖', '✧', '∑', 'π', '∞', '△', '✎', '📐', '📏', '🌸', '🌿', '⭐', '💡', '🎓', '📘', '✏️'];
function dividerHTML(b, def) {
  const st = b.dv || def, col = b.dvcol || 'var(--brown)', z = +b.dvz || 0;
  if (st === 'none') return '<div class="dvx dv-none"></div>';
  if (st === 'char') { const ch = b.dvc || '✦'; const sp = b.dvs ?? 6; return `<div class="dvx dv-char" style="color:${col};font-size:${z || 14}px;letter-spacing:${sp}px">${esc(ch.repeat(Math.ceil(400 / Math.max(1, [...ch].length))))}</div>`; }
  if (st === 'wave') { const h = z || 3; return `<div class="dvx dv-wave" style="height:${6 + h * 2}px;background:url(&quot;data:image/svg+xml,${encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' width='16' height='${6 + h * 2}'><path d='M0 ${3 + h} Q4 ${h - 1} 8 ${3 + h} T16 ${3 + h}' fill='none' stroke='${String(b.dvcol || themeCol()).replace(/"/g, '')}' stroke-width='${Math.max(1, h * .6)}'/></svg>`)}&quot;) repeat-x center"></div>`; }
  const w = z || ({ dot: 3, dash: 2, solid: 1.5, thick: 4, double: 4 }[st]);
  return `<div class="dvx" style="border-top:${w}px ${{ dot: 'dotted', dash: 'dashed', solid: 'solid', thick: 'solid', double: 'double' }[st]} ${col}"></div>`;
}
function themeCol() { try { return (typeof themeOf === 'function' ? themeOf(doc.settings).brown : '#713408'); } catch (e) { return '#713408'; } }
function dividerXML(b, def, C) {
  const st = b.dv || def; const col = (b.dvcol || ('#' + (C ? C('brown') : '713408'))).replace('#', '').toUpperCase();
  if (st === 'none') return para([], { after: 120 });
  if (st === 'char') { const ch = b.dvc || '✦'; const n = Math.max(8, Math.round(DX.cw / ((+b.dvz || 14) * 14 + (b.dvs ?? 6) * 15) / Math.max(1, [...ch].length))); return para([run(ch.repeat(n), { color: col, size: (+b.dvz || 14) * .75 })], { jc: 'center', after: 120 }); }
  const val = { dot: 'dotted', dash: 'dashed', solid: 'single', thick: 'thick', double: 'double', wave: 'wave' }[st] || 'dotted'; const sz = Math.round((+b.dvz || ({ dot: 3, dash: 2, solid: 1.5, thick: 4, double: 4, wave: 3 }[st])) * 4);
  return para([], { border: `<w:bottom w:val="${val}" w:sz="${Math.min(48, Math.max(4, sz))}" w:space="1" w:color="${col}"/>`, after: 120 });
}
function dvInsp(b, def, title = 'เส้นคั่นด้านล่าง') {
  const st = b.dv || def; const id = b.id;
  return `<div class="ir flowctl"><b>${title}</b></div><div class="ir"><label>รูปแบบ</label><select data-b="dv">${DV_STYLES.map(([k, v]) => `<option value="${k}"${st === k ? ' selected' : ''}>${v}</option>`).join('')}</select></div>`
    + (st === 'char' ? `<div class="ir col"><label>เลือกสัญลักษณ์ / อิโมจิ (หรือพิมพ์เองหลายตัวได้ เช่น ✦✧)</label><div class="dvpick">${DV_CHARS.map(c => `<button class="tb" onclick="const x = byId('${id}'); x.dvc = '${c}'; rerender(x.id); changed(true); refreshInspector()">${c}</button>`).join('')}</div><input type="text" data-bt="dvc" value="${esc(b.dvc || '✦')}" style="max-width:200px"></div><div class="ir"><label>ระยะห่างระหว่างตัว (px)</label><input type="number" min="0" max="40" data-bn="dvs" value="${b.dvs ?? 6}"></div>` : '')
    + (st !== 'none' ? `<div class="ir"><label>${st === 'char' ? 'ขนาดสัญลักษณ์ (px)' : 'ความหนา (px)'}</label><input type="number" min="0" max="${st === 'char' ? 40 : 12}" step="${st === 'char' ? 1 : .5}" data-bn="dvz" value="${b.dvz || ''}" placeholder="อัตโนมัติ"></div><div class="ir"><label>สี</label><input type="color" value="${b.dvcol || themeCol()}" oninput="const x = byId('${id}'); x.dvcol = this.value; rerender(x.id); changed()"><button class="tb" onclick="const x = byId('${id}'); delete x.dvcol; rerender(x.id); changed(true); refreshInspector()">สีตามธีม</button></div>` : '');
}
// บล็อกเส้นคั่นอิสระ
TYPES.divider = 'เส้นคั่น / ลายคั่น (จุด เส้น อิโมจิ)';
const _extNewDV = extNewBlock; extNewBlock = function (b) { _extNewDV(b); if (b.t === 'divider') Object.assign(b, { dv: 'char', dvc: '✦' }); };
const _extHTMLDV = extBlockHTML;
extBlockHTML = function (b) {
  let r = _extHTMLDV(b);
  if (b.t === 'divider') return `<div class="b-divider">${dividerHTML(b, 'char')}</div>`;
  if (r && b.t === 'lphead') r = r.replace('<div class="lpdot"></div>', dividerHTML(b, 'dot'));
  if (r && b.t === 'cshead') r = r.replace('<div class="b-cshead"', '<div class="b-cshead nobd"').replace(/<\/div>$/, dividerHTML(b, 'dash') + '</div>');
  return r;
};
const _extInspDV = extInspector;
extInspector = function (b) { let h = _extInspDV(b); if (b.t === 'lphead') h += dvInsp(b, 'dot'); if (b.t === 'cshead') h += dvInsp(b, 'dash'); if (b.t === 'divider') h += dvInsp(b, 'char', 'ลายคั่น'); return h; };
const _extXMLDV = extBlockXML;
extBlockXML = function (b, o) {
  let r = _extXMLDV(b, o);
  if (b.t === 'divider') return dividerXML(b, 'char', o.C);
  if (r && (b.t === 'lphead' || b.t === 'cshead') && b.dv) { const re = b.t === 'lphead' ? /<w:p><w:pPr><w:pBdr><w:bottom w:val="dotted"(?:(?!<w:p>)[\s\S])*<\/w:p>$/ : /<w:p><w:pPr><w:pBdr><w:bottom w:val="dashed"(?:(?!<w:p>)[\s\S])*<\/w:p>$/; r = r.replace(re, dividerXML(b, b.t === 'lphead' ? 'dot' : 'dash', o.C)); }
  return r;
};

/* ===================== อัตนัยมีข้อย่อย + ตารางคำตอบ (ข้อ | คำตอบ) ===================== */
TYPES.anstab = 'ตารางคำตอบข้อย่อย (ข้อ | คำตอบ)';
QTYPES.subans = 'อัตนัยมีข้อย่อย + ตารางคำตอบ';
const _extNewAT = extNewBlock;
extNewBlock = function (b) { _extNewAT(b); if (b.t === 'anstab') Object.assign(b, { l1: 'ข้อ', l2: 'คำตอบ', w: 100, side: false, rhmm: 10 }); };
function atNums(b) { // เลขข้อย่อยจากบล็อก subq ของข้อเดียวกัน
  const i = doc.blocks.indexOf(b); const nums = [];
  for (let j = i - 1; j >= 0; j--) { const x = doc.blocks[j]; if (x.t === 'problem') break; if (x.t === 'subq') nums.unshift(plainText(x.num || '').replace(/[)\s]+$/, '')); }
  if (!nums.length) for (let k = 1; k <= (+b.n || 3); k++) nums.push(String(k));
  return nums;
}
const _extHTMLAT = extBlockHTML;
extBlockHTML = function (b) {
  const r = _extHTMLAT(b); if (r || b.t !== 'anstab') return r;
  const N = atNums(b); b._sig = N.join('|'); const rh = (+b.rhmm || 11) * 3.7795;
  const tbl = `<table class="at" style="width:${b.side ? 100 : (+b.w || 100)}%"><tr class="ath"><th contenteditable="true" data-f="l1"></th><th contenteditable="true" data-f="l2"></th></tr>${N.map((n, i) => `<tr style="height:${rh}px"><td class="atn">${esc(n)}</td><td contenteditable="true" data-f="a${i}" data-ph=" "></td></tr>`).join('')}</table>`;
  if (!b.side) return `<div class="b-anstab">${tbl}</div>`;
  const lines = Math.ceil(((N.length * rh) + 40) / (9 * 3.7795));
  return `<div class="b-anstab side"><div class="atl" style="width:${+b.w || 42}%">${tbl}</div><div class="atr">${'<i></i>'.repeat(lines)}</div></div>`;
};
// เลขข้อย่อยเปลี่ยน → วาดตารางใหม่
const _capSyncAT = typeof capSync === 'function' ? capSync : null;
capSync = function () { if (_capSyncAT) _capSyncAT(); doc.blocks.forEach(b => { if (false) { const el = $(`.blk[data-id="${b.id}"]`); if (el && !el.contains(document.activeElement)) { const nel = makeEl(b); if (el.classList.contains('sel')) nel.classList.add('sel'); el.replaceWith(nel); } } }); };
const _extInspAT = extInspector;
extInspector = function (b) {
  let h = _extInspAT(b); if (b.t !== 'anstab') return h;
  return h + `<div class="ir"><label>ความกว้างตาราง (% ของหน้า)</label><input type="number" min="25" max="100" step="5" data-bn="w" value="${b.w || 42}"></div>`
    + `<div class="ir"><label>ความสูงช่องคำตอบ (มม.)</label><input type="number" min="6" max="40" data-bn="rhmm" value="${b.rhmm || 11}"></div>`
    + `<div class="ir"><label><input type="checkbox" data-bc2="side" ${b.side ? 'checked' : ''}> มีเส้นบรรทัดต่อด้านขวาของตาราง</label></div>`
    + `<div class="ir"><label>จำนวนแถว (ใช้เมื่อไม่มีข้อย่อย)</label><input type="number" min="1" max="15" data-bn="n" value="${b.n || 3}"></div>`
    + `<p class="hint" style="font-size:14px">เลขในตารางตามข้อย่อย (6.1, 6.2 …) ของข้อนี้อัตโนมัติ · ช่องคำตอบพิมพ์เฉลยไว้ได้</p>`;
};
const _extXMLAT = extBlockXML;
extBlockXML = function (b, o) {
  const r = _extXMLAT(b, o); if (r || b.t !== 'anstab') return r; const { C } = o; const N = atNums(b);
  const tw = (DX.cw - 600) * Math.min(100, +b.w || 100) / 100, w1 = b.side ? tw * .24 : tw * .13, w2 = tw - w1;
  const bc = C('brown'); const T = h => [].concat(...htmlParas(h || '', {}).map(p => p.runs));
  const hd = (h) => cell(para(T(h).map(x => x), { jc: 'center', after: 0 }).replace(/<w:rPr>/g, `<w:rPr><w:b/><w:color w:val="${bc}"/>`), { fill: C('bar'), bc, vAlign: 'center' });
  const rows = [[hd(b.l1 || 'ข้อ'), hd(b.l2 || 'คำตอบ')]].concat(N.map((n, i) => [cell(para([run(n, { b: true, color: bc })], { jc: 'center', after: 0 }), { bc, vAlign: 'center' }), cell(para(T(b['a' + i]), { after: 0 }), { bc, vAlign: 'center' })]));
  const rh = (+b.rhmm || 11) * 56.7;
  let x = table(rows, { w: w1 + w2, cols: [w1, w2], rh: [0, ...N.map(() => rh)], noGap: !!b.side, ind: b.side ? 0 : 600 });
  if (b.side) { const lines = Math.ceil((N.length * (+b.rhmm || 11) + 10) / 9); const L = Array.from({ length: lines }, () => para([], { border: '<w:bottom w:val="single" w:sz="4" w:color="CDB9AD"/>', after: 0, line: 500, lineRule: 'exact' })).join('');
    x = table([[cell(x + para([], { after: 0 }), { border: '<w:top w:val="nil"/><w:left w:val="nil"/><w:bottom w:val="nil"/><w:right w:val="nil"/>', w: w1 + w2, px: 0 }), cell(L, { border: '<w:top w:val="nil"/><w:left w:val="nil"/><w:bottom w:val="nil"/><w:right w:val="nil"/>', w: DX.cw - w1 - w2, px: 80 })]], { w: DX.cw, cols: [w1 + w2, DX.cw - w1 - w2] }); }
  return x;
};
// แทรกทั้งข้อ: โจทย์ + คำถามนำ + ข้อย่อย + เส้นเขียน + ตารางคำตอบ
const _qBodyAT = qBody;
qBody = function (t, k, q, c) {
  if (t !== 'subans') return _qBodyAT(t, k, q, c);
  const n = +q.d || 3; const half = Math.round(q.p * 2), base = Math.floor(half / n), extra = half - base * n; const ptsOf = j => (base + (j > n - extra ? 1 : 0)) / 2; const B = [];
  B.push(newBlock('given', { html: 'สถานการณ์ / ข้อมูลของโจทย์ ...' }));
  B.push(newBlock('question', { html: 'จงหา ... โดยที่' }));
  for (let j = 1; j <= n; j++) B.push(newBlock('subq', { num: `${k}.${j}`, html: '', pts: `(${ptsTxt(ptsOf(j))} คะแนน)` }));
  B.push(newBlock('work', workOpts(q.w && q.w !== 'none' && q.w !== 'small' ? q.w : 'full')));
  B.push(newBlock('anstab', {}));
  return B;
};
if (typeof N_TYPES !== 'undefined' && !N_TYPES.includes('subans')) N_TYPES.push('subans');
// กรอบทดแบบเต็มหน้า + ตารางคำตอบ: ยืดกรอบทดให้ตารางคำตอบชิดล่างของหน้า
function atFill() {
  const P = PAGE_H + PAGE_G;
  $$('#flow > .blk[data-t="anstab"]').forEach(el => {
    const pv = el.previousElementSibling; if (!pv || pv.dataset.t !== 'work') return; const wb = byId(pv.dataset.id); if (!wb || !wb.full) return; const w = $('.b-work', pv); if (!w) return;
    const bot = el.offsetTop + el.offsetHeight, p = Math.floor((bot - 1) / P), re = p * P + PAGE_H - BOT; if (Math.floor(pv.offsetTop / P) !== p) return;
    const nx = el.nextElementSibling; if (nx && Math.floor(nx.offsetTop / P) === p) return;
    const add = re - bot - 4; if (add > 6) w.style.height = (w.offsetHeight + add) + 'px';
  });
}
/* ===================== คะแนนข้ออัตนัย: ช่องคะแนนท้ายข้อ · คอลัมน์คะแนนข้อย่อย · ตารางสรุปคะแนน ===================== */
const ptsNum = s => parseFloat(String(plainText(s || '')).replace(/[^\d.]/g, '')) || 0;
function probOf(b) { const i = doc.blocks.indexOf(b); for (let j = i - 1; j >= 0; j--) if (doc.blocks[j].t === 'problem') return doc.blocks[j]; return null; }
function subPts(b) { const i = doc.blocks.indexOf(b), out = []; for (let j = i - 1; j >= 0; j--) { const x = doc.blocks[j]; if (x.t === 'problem') break; if (x.t === 'subq') out.unshift(ptsNum(x.pts)); } return out; }
function fullOf(b) { const p = probOf(b); const sp = subPts(b).reduce((a, x) => a + x, 0); return p && ptsNum(p.pts) ? ptsNum(p.pts) : sp; }
const sbHTML = (full) => `<div class="sbx"><span>คะแนนที่ได้</span><i></i><span>/ ${esc(ptsTxt(full || 0))}</span></div>`;
TYPES.scorebox = 'ช่องคะแนนท้ายข้อ (คะแนนที่ได้ … / เต็ม)';
TYPES.scoresum = 'ตารางสรุปคะแนน (ปรนัย + อัตนัยรายข้อ)';
const _extNewSB = extNewBlock;
extNewBlock = function (b) { _extNewSB(b); if (b.t === 'anstab') Object.assign(b, { sbox: true, scol: false }); };
// ตารางคำตอบ: เพิ่มคอลัมน์คะแนนข้อย่อย + ช่องคะแนนรวมของข้อ
const _extHTMLSB = extBlockHTML;
extBlockHTML = function (b) {
  if (b.t === 'scorebox') { const f = fullOf(b); b._sig = 'f' + f; return `<div class="b-scorebox">${sbHTML(f)}</div>`; }
  if (b.t === 'scoresum') { const R = ssRows(b); b._sig = JSON.stringify(R); return `<div class="b-scoresum"><table class="ss"><tr><th contenteditable="true" data-f="h0" data-ph="ส่วน"></th><th>เต็ม</th><th>ได้</th>${b.who ? '<th>ผู้ตรวจ</th>' : ''}</tr>${R.map(r => `<tr${r.tot ? ' class="tot"' : ''}><td>${esc(r.name)}</td><td>${esc(ptsTxt(r.full))}</td><td></td>${b.who ? '<td></td>' : ''}</tr>`).join('')}</table></div>`; }
  let r = _extHTMLSB(b); if (b.t !== 'anstab' || !r) return r;
  const SP = subPts(b), full = fullOf(b); b._sig = (b._sig || '') + '|' + SP.join(',') + '|' + full;
  if (b.scol) { r = r.replace('<th contenteditable="true" data-f="l2"></th>', '<th contenteditable="true" data-f="l2"></th><th class="atsh">คะแนน</th>'); let k = 0; r = r.replace(/(<td contenteditable="true" data-f="a\d+" data-ph=" "><\/td>)/g, (m) => m + `<td class="atsc"><i></i>/ ${esc(ptsTxt(SP[k++] || 0))}</td>`); }
  if (b.sbox) r = r.replace(/<\/div>$/, sbHTML(full) + '</div>');
  return r;
};
// ตารางสรุปคะแนน: ตอนปรนัยรวมเป็นแถวเดียว ข้ออัตนัยแยกรายข้อ
const WRITE_QT = new Set(['write', 'prove', 'sub', 'subans', 'err', 'fillsteps', 'short', 'tf', 'match', 'order']);
function ssRows(sb) {
  const B = doc.blocks, rows = []; let part = null, partName = '';
  const flush = () => { if (part && part.n) rows.push({ name: `${partName || 'ปรนัย'} (ข้อ ${part.a}–${part.z})`, full: part.full }); part = null; };
  B.forEach((x, i) => {
    if (x.t === 'part') { flush(); partName = plainText(x.html || ''); return; }
    if (x.t !== 'problem' || x.nobm) return;
    let qt = x.qt; if (!qt) { for (let j = i + 1; j < B.length && B[j].t !== 'problem' && B[j].t !== 'part'; j++) { if (B[j].t === 'choices') { qt = 'mc'; break; } if (B[j].t === 'anstab' || B[j].t === 'subq') { qt = 'subans'; break; } } }
    const no = plainText(x.html || '').replace(/^ข้อ\s*/, ''), full = ptsNum(x.pts);
    if (WRITE_QT.has(qt || 'write')) { flush(); rows.push({ name: 'ข้อ ' + no, full }); }
    else { if (!part) part = { a: no, z: no, n: 0, full: 0 }; part.z = no; part.n++; part.full += full; }
  });
  flush(); rows.push({ name: 'รวม', full: rows.reduce((a, r) => a + r.full, 0), tot: true });
  return rows;
}
// วาดใหม่เมื่อข้อ/คะแนนเปลี่ยน
const _capSyncSB = capSync;
capSync = function () { _capSyncSB(); doc.blocks.forEach(b => { if (!['scorebox', 'scoresum', 'anstab'].includes(b.t)) return; const el = $(`.blk[data-id="${b.id}"]`); if (!el || el.contains(document.activeElement)) return; const old = b._sig; b._sig = ''; const tmp = extBlockHTML(b); const now = b._sig; b._sig = old; if (now !== old) { const nel = makeEl(b); if (el.classList.contains('sel')) nel.classList.add('sel'); el.replaceWith(nel); } }); };
const _extInspSB = extInspector;
extInspector = function (b) {
  let h = _extInspSB(b);
  if (b.t === 'anstab') h += `<div class="ir"><label><input type="checkbox" data-bc2="sbox" ${b.sbox ? 'checked' : ''}> ช่อง “คะแนนที่ได้ … / เต็ม” ท้ายข้อ</label></div><div class="ir"><label><input type="checkbox" data-bc2="scol" ${b.scol ? 'checked' : ''}> คอลัมน์คะแนนแยกข้อย่อย</label></div>`;
  if (b.t === 'scoresum') h += `<div class="ir"><label><input type="checkbox" data-bc2="who" ${b.who ? 'checked' : ''}> คอลัมน์ “ผู้ตรวจ”</label></div><p class="hint" style="font-size:14px">แถวและคะแนนเต็มสร้างจากข้อสอบในเอกสารอัตโนมัติ · ปรนัยรวมเป็นแถวเดียวต่อตอน · อัตนัยแยกรายข้อ</p>`;
  if (b.t === 'scorebox') h += `<p class="hint" style="font-size:14px">คะแนนเต็มดึงจากคะแนนของข้อนี้อัตโนมัติ</p>`;
  return h;
};
// Word
const _extXMLSB = extBlockXML;
extBlockXML = function (b, o) {
  const { C } = o; const bc = C('brown');
  const sbXML = full => para([run('คะแนนที่ได้  ', { b: true, color: bc }), run('..........', {}), run('  / ' + ptsTxt(full || 0), { b: true, color: bc })], { jc: 'right', after: 60, before: 80 });
  if (b.t === 'scorebox') return sbXML(fullOf(b));
  if (b.t === 'scoresum') { const R = ssRows(b); const n = b.who ? 4 : 3; const W = DX.cw * .62; const cols = b.who ? [W * .46, W * .16, W * .16, W * .22] : [W * .6, W * .2, W * .2];
    const hd = t => cell(para([run(t, { b: true, color: bc })], { jc: 'center', after: 0 }), { fill: C('bar'), bc });
    const rows = [[hd(plainText(b.h0 || '') || 'ส่วน'), hd('เต็ม'), hd('ได้')].concat(b.who ? [hd('ผู้ตรวจ')] : [])].concat(R.map(r => [cell(para([run(r.name, { b: !!r.tot })], { after: 0 }), { bc }), cell(para([run(ptsTxt(r.full), { b: !!r.tot })], { jc: 'center', after: 0 }), { bc }), cell(para([]), { bc })].concat(b.who ? [cell(para([]), { bc })] : [])));
    return table(rows, { w: W, cols, center: true, rh: [0, ...R.map(() => 420)] }); }
  let r = _extXMLSB(b, o); if (b.t === 'anstab' && r && b.sbox) r += sbXML(fullOf(b)); return r;
};
GROUP_MEMBERS.add('scorebox');
// ในชุดข้อสอบ: ข้ออัตนัยแบบอื่นมีช่องคะแนนท้ายข้อ + ตารางสรุปคะแนนในข้อสอบกลางภาค/ปลายภาค
const _qBodySB = qBody;
qBody = function (t, k, q, c) { const B = _qBodySB(t, k, q, c); if (c && c.xc && ['write', 'prove', 'sub', 'err', 'fillsteps'].includes(t)) B.push(newBlock('scorebox', {})); return B; };
const _buildExamSB = buildExam;
buildExam = function (c) { const B = _buildExamSB(c); if (!c.xc) return B; const i = B.findIndex(b => b.xc === 'name'); if (i >= 0) B.splice(i + 1, 0, newBlock('scoresum', { h0: 'ส่วน' })); return B; };

