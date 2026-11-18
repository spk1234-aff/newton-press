'use strict';
/* ===================== แม่แบบงานศิลปหัตถกรรมนักเรียน (สพฐ.) : อัจฉริยภาพทางคณิตศาสตร์ ม.4–6 · โครงงาน 2 ประเภท ===================== */
const GN_T = s => String(s || '').replace(/\$\$([^$]+)\$\$/g, (m, t) => mxs(t, 1)).replace(/\$([^$]+)\$/g, (m, t) => mxs(t));
const GN_LAB = ['ก', 'ข', 'ค', 'ง'];
const GN_PARTS = [
  { n: 'ตอนที่ 1', info: 'แบบทดสอบปรนัยชนิดเลือกตอบ 4 ตัวเลือก · ข้อ 1–10 · ข้อละ 1 คะแนน (10 คะแนน)', c: 10, t: 'mc4', p: 1 },
  { n: 'ตอนที่ 2', info: 'แบบทดสอบปรนัยชนิดเติมคำตอบ วัดทักษะคิดเลขเร็วและทักษะการคิดคำนวณ · ข้อ 11–30 · ข้อละ 2 คะแนน (40 คะแนน)', c: 20, t: 'write', p: 2 },
  { n: 'ตอนที่ 3', info: 'แบบทดสอบปรนัยชนิดเติมคำตอบ วัดทักษะการแก้โจทย์ปัญหา · ข้อ 31–40 · ข้อละ 5 คะแนน (50 คะแนน)', c: 10, t: 'write', p: 5 },
];
EXAM_PRESETS.genius = { name: 'อัจฉริยภาพทางคณิตศาสตร์ ม.4–6 (ศิลปหัตถกรรม)', subj: 'การแข่งขันอัจฉริยภาพทางคณิตศาสตร์', set: 'ระดับชั้นมัธยมศึกษาปีที่ 4–6', time: 120, lab: 'ก.',
  parts: [{ n: 'ตอนที่ 1 ปรนัย 4 ตัวเลือก', c: 10, t: 'mc4', p: 1, w: 'none' }, { n: 'ตอนที่ 2 เติมคำตอบ (คิดเลขเร็ว/คิดคำนวณ)', c: 20, t: 'write', p: 2, w: 'none' }, { n: 'ตอนที่ 3 เติมคำตอบ (แก้โจทย์ปัญหา)', c: 10, t: 'write', p: 5, w: 'small' }] };
const GN_INS = [
  'แบบทดสอบมี 3 ตอน รวม 40 ข้อ คะแนนเต็ม 100 คะแนน เวลา 120 นาที',
  'ตอนที่ 1 แบบปรนัยชนิดเลือกตอบ 4 ตัวเลือก ข้อ 1–10 ข้อละ 1 คะแนน รวม 10 คะแนน',
  'ตอนที่ 2 แบบปรนัยชนิดเติมคำตอบ วัดทักษะคิดเลขเร็วและทักษะการคิดคำนวณ ข้อ 11–30 ข้อละ 2 คะแนน รวม 40 คะแนน',
  'ตอนที่ 3 แบบปรนัยชนิดเติมคำตอบ วัดทักษะการแก้โจทย์ปัญหา ข้อ 31–40 ข้อละ 5 คะแนน รวม 50 คะแนน',
  'เขียนคำตอบลงในกระดาษคำตอบเท่านั้น คำตอบที่เป็นเศษส่วนให้เขียนเป็นเศษส่วนอย่างต่ำ และรากที่สองให้อยู่ในรูปอย่างง่าย',
  'ไม่อนุญาตให้นำเครื่องคิดเลขหรืออุปกรณ์ช่วยคำนวณอื่น ๆ เข้าห้องสอบ กรรมการคุมสอบแจกกระดาษทดให้ และห้ามนำกระดาษทดออกจากห้องสอบ',
];
// ข้อมูลชุดข้อสอบ: { no, mc:[{q,c:[4],a,sol}], fill:[{q,a,sol}], prob:[{q,a,sol}] } · sol = { idea, steps:[..], check, warn }
const GENIUS_SETS = [];
function gnExamBlocks(S) {
  const B = [], add = (t, x) => { const b = newBlock(t, x || {}); B.push(b); return b; };
  add('examcover', { subj: 'การแข่งขันอัจฉริยภาพทางคณิตศาสตร์', set: 'ระดับชั้นมัธยมศึกษาปีที่ 4–6 · ชุดที่ ' + (S ? S.no : '...'), items: '40', score: '100', time: '120 นาที', ins: GN_INS.map((x, i) => `${i + 1}. ${esc(x)}`).join('<br>'), note: 'แนวข้อสอบตามเกณฑ์การแข่งขันงานศิลปหัตถกรรมนักเรียน (สพฐ.) ใช้สำหรับฝึกซ้อม ไม่ใช่ข้อสอบจริง', brand: 'Earth &amp; Newton Education' });
  let k = 1;
  GN_PARTS.forEach((P, pi) => {
    add('part', { html: P.n, info: P.info });
    const L = S ? [S.mc, S.fill, S.prob][pi] : Array(P.c).fill(null);
    L.forEach(it => {
      add('problem', { html: 'ข้อ ' + k, pts: String(P.p) });
      add('given', { html: it ? GN_T(it.q) : '' });
      if (P.t === 'mc4') add('choices', { items: it ? it.c.map(GN_T) : ['', '', '', ''], cf: 'ก.' });
      else if (pi === 2) add('work', Object.assign(workOpts('third'), it && L.indexOf(it) === L.length - 1 || (!it && k === 40) ? { share: undefined, full: true } : {}));
      k++;
    });
  });
  // กระดาษคำตอบ (กรอบทดข้อสุดท้ายเต็มหน้า จึงขึ้นหน้าใหม่เอง)
  add('lptext', { ind: 0, html: '<div style="text-align:center"><b><font size="5">กระดาษคำตอบ</font></b><br>การแข่งขันอัจฉริยภาพทางคณิตศาสตร์ ระดับชั้นมัธยมศึกษาปีที่ 4–6' + (S ? ' · ชุดที่ ' + S.no : '') + '</div><br>ชื่อ–สกุล ...................................................................... โรงเรียน ......................................................... เลขที่นั่งสอบ ............ คะแนนรวม ........ / 100' });
  const hd = { k: 'soft', hr: 1, c: '#1f3864' };
  add('lptext', { ind: 0, html: '<b>ตอนที่ 1</b> ปรนัย 4 ตัวเลือก (ข้อละ 1 คะแนน) — เขียนตัวอักษร ก ข ค หรือ ง' });
  add('table', { rows: [['ข้อ', ...Array.from({ length: 10 }, (_, i) => String(i + 1))], ['คำตอบ', ...Array(10).fill('')]], full: true, tst: hd, cw: [10, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9] });
  const pairs = (a, n) => { const R = [['ข้อ', 'คำตอบ', 'ข้อ', 'คำตอบ']]; for (let i = 0; i < n / 2; i++) R.push([String(a + i), '', String(a + n / 2 + i), '']); return R; };
  add('lptext', { ind: 0, html: '<b>ตอนที่ 2</b> เติมคำตอบ (ข้อละ 2 คะแนน)' }); add('table', { rows: pairs(11, 20), full: true, tst: hd, cw: [12, 38, 12, 38] });
  add('lptext', { ind: 0, html: '<b>ตอนที่ 3</b> เติมคำตอบ (ข้อละ 5 คะแนน)' }); add('table', { rows: pairs(31, 10), full: true, tst: hd, cw: [12, 38, 12, 38] });
  return B;
}
function gnSolBlocks(S) {
  const B = [], add = (t, x) => { const b = newBlock(t, x || {}); B.push(b); return b; };
  const all = [...S.mc.map(x => [x, 1]), ...S.fill.map(x => [x, 2]), ...S.prob.map(x => [x, 5])];
  const keyOf = ([it, p], i) => p === 1 ? GN_LAB[it.a] : String(it.k || it.a).replace(/\s+/g, '');
  add('pagebreak');
  add('soltitle', { brand: 'Earth &amp; Newton Education', title: 'เฉลยละเอียด', sub: 'การแข่งขันอัจฉริยภาพทางคณิตศาสตร์ ม.4–6 · ชุดที่ ' + S.no });
  add('keytable', { mode: 'parts', parts: [{ name: 'ตอนที่ 1', pts: '1', from: 1, to: 10 }, { name: 'ตอนที่ 2', pts: '2', from: 11, to: 30 }, { name: 'ตอนที่ 3', pts: '5', from: 31, to: 40 }], key: all.map(keyOf).join(','), cols: 10, cap: 'สรุปคำตอบ' });
  all.forEach(([it, p], i) => {
    const n = i + 1, ans = p === 1 ? `${GN_LAB[it.a]}. ${it.c[it.a]}` : it.a;
    if (n === 11 || n === 31) add('pagebreak');
    if (n === 1 || n === 11 || n === 31) add('part', { html: n === 1 ? 'ตอนที่ 1' : n === 11 ? 'ตอนที่ 2' : 'ตอนที่ 3', info: n === 1 ? 'ปรนัย 4 ตัวเลือก ข้อละ 1 คะแนน' : n === 11 ? 'เติมคำตอบ คิดเลขเร็วและคิดคำนวณ ข้อละ 2 คะแนน' : 'เติมคำตอบ แก้โจทย์ปัญหา ข้อละ 5 คะแนน' });
    add('solhead', Object.assign({ num: 'ข้อ ' + n, pts: String(p), ans: GN_T(ans) }, n === 1 || n === 11 || n === 31 ? {} : { inl: 1 }));
    add('box', { kind: 'recap', title: '', html: GN_T(it.q) + (p === 1 ? '<br>' + it.c.map((c, j) => `${GN_LAB[j]}. ${GN_T(c)}`).join('&emsp;&emsp;') : '') });
    const s = it.sol || {};
    if (s.idea) { add('h3', { tone: 'gold', html: 'แนวคิดหลัก' }); add('para', { html: GN_T(s.idea) }); }
    if (s.steps && s.steps.length) { add('h3', { tone: 'navy', html: 'วิธีทำ' }); add('para', { html: s.steps.map(GN_T).join('<br>') }); }
    if (s.warn) add('box', { kind: 'caution2', title: 'ข้อควรระวัง', html: GN_T(s.warn) });
    if (s.check) { add('h3', { tone: 'teal', html: 'ตรวจคำตอบ' }); add('para', { html: GN_T(s.check) }); }
    add('answer', { v: 'box', html: GN_T(ans) });
  });
  return B;
}
function gnDoc(S, withSol) {
  return { app: 'en-editor', v: 2, settings: Object.assign({}, doc.settings, { name: 'อัจฉริยภาพคณิตศาสตร์ ม.ปลาย' + (S ? ' ชุดที่ ' + S.no : ''), hl: 'การแข่งขันอัจฉริยภาพทางคณิตศาสตร์ ม.4–6', hr: S ? 'ชุดที่ ' + S.no : 'Earth & Newton Education', size: 'exam', bmq: true, tpl: 'exam' }), blocks: [...gnExamBlocks(S), ...(S && withSol ? gnSolBlocks(S) : [])] };
}
function openGenius() {
  const opts = GENIUS_SETS.map((S, i) => `<label class="gnk"><input type="radio" name="gns" value="${i}" ${i ? '' : 'checked'}> ชุดที่ ${S.no} (มีโจทย์และเฉลยละเอียด)</label>`).join('');
  ask('แบบทดสอบอัจฉริยภาพทางคณิตศาสตร์ ม.4–6', `<p style="margin:0 0 8px">ตามเกณฑ์งานศิลปหัตถกรรมนักเรียน: 3 ตอน 40 ข้อ 100 คะแนน 120 นาที</p><div class="tplk">${opts}<label class="gnk"><input type="radio" name="gns" value="blank" ${GENIUS_SETS.length ? '' : 'checked'}> ชุดว่าง (ปก · 3 ตอน · กระดาษคำตอบ) ไว้พิมพ์โจทย์เอง</label></div><label style="display:block;margin-top:8px"><input type="checkbox" id="gnSol" checked> ต่อท้ายด้วยเฉลยละเอียด (ชุดที่มีโจทย์)</label>`, 'สร้าง').then(ok => {
    if (!ok) return; const v = ($('input[name="gns"]:checked') || {}).value, S = v === 'blank' ? null : GENIUS_SETS[+v];
    doc = gnDoc(S, $('#gnSol') && $('#gnSol').checked); curId = null; applySettings(); renderAll(); changed(true); refreshInspector(); $('#scroller').scrollTop = 0; toast('สร้างแบบทดสอบแล้ว · แก้ไขได้ทุกส่วน');
  });
}
/* ---------- โครงงานคณิตศาสตร์ ศิลปหัตถกรรม 2 ประเภท ---------- */
const PJ_SILPA = {
  theory: { kind: 'โครงงานคณิตศาสตร์', type: 'ประเภทสร้างทฤษฎีหรือคำอธิบายทางคณิตศาสตร์', limit: 30 },
  integ: { kind: 'โครงงานคณิตศาสตร์', type: 'ประเภทบูรณาการความรู้ในคณิตศาสตร์ไปประยุกต์ใช้', limit: 20 },
};
function openProjectSilpa(k) {
  const P = PJ_SILPA[k], yr = new Date().getFullYear() + 543, no = yr - 2495;
  window.__pjPreset = { note: `รายงานฉบับนี้เป็นส่วนประกอบของโครงงานคณิตศาสตร์\n${P.type} ระดับมัธยมศึกษาตอนปลาย\nเนื่องในงานศิลปหัตถกรรมนักเรียนครั้งที่ ${no} ประจำปีการศึกษา ${yr}`, advl: 'ครูที่ปรึกษา', aff: 'สำนักงานเขตพื้นที่การศึกษามัธยมศึกษาบึงกาฬ', apx: 'ภาคผนวก (ไม่เกิน 10 หน้า)', hint: `เกณฑ์ศิลปหัตถกรรม: กระดาษ A4 ตัวอักษรไม่ต่ำกว่า 16 point พิมพ์หน้าเดียว · บทที่ 1–5 ไม่เกิน ${P.limit} หน้า · ภาคผนวกไม่เกิน 10 หน้า`, title: P.type };
  openProject();
}
(function () {
  const css = document.createElement('style'); css.textContent = `.gnk{display:block;font-size:17px;padding:7px 10px;border:1px solid var(--ui-line,#d9cfc4);border-radius:10px;cursor:pointer}.gnk:has(input:checked){border-color:#b45309;background:#fff7ed}`; document.head.appendChild(css);
  DOC_TEMPLATES.push(['อัจฉริยภาพทางคณิตศาสตร์ ม.4–6 (ศิลปหัตถกรรม)', '3 ตอน 40 ข้อ 100 คะแนน 120 นาที · กระดาษคำตอบ · ชุดตัวอย่างพร้อมเฉลยละเอียด', 'GENIUS'],
    ['โครงงานคณิตศาสตร์ ประเภทสร้างทฤษฎี (ศิลปหัตถกรรม)', 'ปกตามเกณฑ์ สพฐ. · บทที่ 1–5 ไม่เกิน 30 หน้า · สารบัญเดินเอง', 'PJ_THEORY'],
    ['โครงงานคณิตศาสตร์ ประเภทบูรณาการ (ศิลปหัตถกรรม)', 'ปกตามเกณฑ์ สพฐ. · บทที่ 1–5 ไม่เกิน 20 หน้า · สารบัญเดินเอง', 'PJ_INTEG']);
  const MAP = { GENIUS: () => openGenius(), PJ_THEORY: () => openProjectSilpa('theory'), PJ_INTEG: () => openProjectSilpa('integ') };
  const _ot = openTemplates; openTemplates = function () { const r = _ot.apply(this, arguments); const box = $('#tplList'); if (box && !box.dataset.gn) { box.dataset.gn = 1; box.addEventListener('click', e => { const b = e.target.closest('.tplc'); const f = b && MAP[DOC_TEMPLATES[+b.dataset.i][2]]; if (!f) return; e.stopImmediatePropagation(); closeDlg('#dTpl'); f(); }, true); } return r; };
  const _ei = extInspector; extInspector = function (b) { let h = _ei(b); if (b.t === 'solhead') h += `<div class="ir"><label><input type="checkbox" data-bc2="inl" ${b.inl ? 'checked' : ''}> ต่อจากข้อก่อนหน้า (ไม่ขึ้นหน้าใหม่)</label></div>`; return h; };
  // หน้าต่างเล่มโครงงาน: เติมค่าตามประเภทศิลปหัตถกรรม แล้วล้างค่า
  const _dd = docDlg; docDlg = function (title, fields, build, note) {
    const P = window.__pjPreset; if (P && /เล่มโครงงาน/.test(title)) { window.__pjPreset = null; title = 'โครงงานคณิตศาสตร์ (ศิลปหัตถกรรม)'; note = P.hint;
      fields = fields.map(f => { const g = f.slice(); if (g[0] === 'note') g[2] = P.note; if (g[0] === 'aff') g[2] = P.aff; if (g[0] === 'dot') g[2] = true; return g; });
      const _b = build; build = V => { const r = _b(V); r.blocks.forEach(b => { if (b.t === 'pjcover') { b.advl = 'ครูที่ปรึกษา'; b.aff = 'สำนักงานเขตพื้นที่การศึกษา' + esc(String(V('aff') || '').replace(/^สังกัด\s*/, '').replace(/^สำนักงานเขตพื้นที่การศึกษา/, '')); } }); r.settings.pjSilpa = 1; return r; }; }
    return _dd.call(this, title, fields, build, note);
  };
})();


/* ชุดข้อสอบอัจฉริยภาพทางคณิตศาสตร์ ม.4–6 (เนื้อหา + เฉลยละเอียด) · เขียนใหม่ในแนวข้อสอบแข่งขัน ปรับระดับให้เหมาะกับกิจกรรม */
GENIUS_SETS.push({
  no: 1,
  mc: [
    { q: String.raw`ให้ $A$ และ $B$ เป็นเซตจำกัด โดยที่ $n(A)=12,\ n(B)=15$ และ $n(A\cup B)=20$ จำนวนสับเซตของ $A\cap B$ ที่ไม่ใช่เซตว่างมีกี่สับเซต`, c: ['63', '127', '128', '255'], a: 1,
      sol: { idea: String.raw`หา $n(A\cap B)$ ก่อน แล้วใช้ว่าเซตที่มี $k$ สมาชิกมีสับเซต $2^k$ สับเซต`, steps: [String.raw`$n(A\cap B)=n(A)+n(B)-n(A\cup B)=12+15-20=7$`, String.raw`จำนวนสับเซตทั้งหมด $=2^7=128$ ตัดเซตว่างออก 1 สับเซต`, String.raw`จำนวนสับเซตที่ไม่ใช่เซตว่าง $=127$`], warn: 'ตัวเลือก 128 คือการลืมตัดเซตว่างออก' } },
    { q: String.raw`ถ้า $\log_2 x+\log_4 x+\log_{16} x=7$ แล้ว $x$ มีค่าเท่าใด`, c: ['2', '4', '8', '16'], a: 3,
      sol: { idea: String.raw`เปลี่ยนทุกพจน์เป็นฐาน 2 ด้วย $\log_{2^m}x=\frac1m\log_2 x$`, steps: [String.raw`$\log_2 x+\frac12\log_2 x+\frac14\log_2 x=7$`, String.raw`$\frac74\log_2 x=7 \Rightarrow \log_2 x=4 \Rightarrow x=16$`], check: String.raw`$4+2+1=7$ ✓` } },
    { q: String.raw`ผลบวกของจำนวนจริง $x$ ทั้งหมดที่สอดคล้องกับสมการ $|x-3|+|x+1|=6$ เท่ากับข้อใด`, c: ['2', '4', '6', '8'], a: 0,
      sol: { idea: 'แบ่งช่วงตามจุดที่ค่าภายในค่าสัมบูรณ์เป็นศูนย์ คือ $x=-1$ และ $x=3$', steps: [String.raw`ช่วง $x\ge3$: $(x-3)+(x+1)=6 \Rightarrow 2x-2=6 \Rightarrow x=4$ ✓`, String.raw`ช่วง $-1\le x<3$: $(3-x)+(x+1)=4\ne6$ ไม่มีคำตอบ`, String.raw`ช่วง $x<-1$: $(3-x)-(x+1)=6 \Rightarrow 2-2x=6 \Rightarrow x=-2$ ✓`, String.raw`ผลบวกคำตอบ $=4+(-2)=2$`], check: 'ระยะจาก $x$ ถึง 3 บวกระยะถึง $-1$ เท่ากับ 6 จุดต้องอยู่นอกช่วง $[-1,3]$ ไปข้างละ 1 หน่วย คือ $-2$ และ 4 ✓' } },
    { q: String.raw`กำหนดให้ $f(x)=\dfrac{x+1}{x-1}$ เมื่อ $x\ne1$ ค่าของ $f\big(f(f(3))\big)$ เท่ากับข้อใด`, c: [String.raw`$-2$`, String.raw`$\frac12$`, '2', '3'], a: 2,
      sol: { idea: String.raw`คำนวณทีละชั้นจากด้านใน หรือสังเกตว่า $f(f(x))=x$`, steps: [String.raw`$f(3)=\frac{4}{2}=2$`, String.raw`$f(2)=\frac{3}{1}=3$`, String.raw`$f(3)=2$`], check: String.raw`$f(f(x))=\dfrac{\frac{x+1}{x-1}+1}{\frac{x+1}{x-1}-1}=\dfrac{2x}{2}=x$ จึงได้ $f(f(f(3)))=f(3)=2$ ✓` } },
    { q: String.raw`ลำดับเลขคณิตลำดับหนึ่งมี $a_3+a_8=30$ และ $a_5=13$ ผลบวก 10 พจน์แรกของลำดับนี้เท่ากับข้อใด`, c: ['120', '135', '150', '165'], a: 2,
      sol: { idea: String.raw`เขียนทุกพจน์ในรูป $a_1$ และ $d$ แล้วแก้ระบบสมการ`, steps: [String.raw`$a_3+a_8=2a_1+9d=30$ และ $a_5=a_1+4d=13 \Rightarrow 2a_1+8d=26$`, String.raw`ลบกันได้ $d=4$ และ $a_1=13-16=-3$`, String.raw`$S_{10}=\frac{10}{2}\big[2(-3)+9(4)\big]=5(30)=150$`], check: String.raw`ทางลัด: $S_{10}=5(a_1+a_{10})=5(a_3+a_8)=5(30)=150$ เพราะ $a_1+a_{10}=a_3+a_8$ ✓` } },
    { q: String.raw`ถ้า $\sin x+\cos x=\frac75$ เมื่อ $0<x<\frac{\pi}{2}$ แล้ว $\sin 2x$ มีค่าเท่าใด`, c: [String.raw`$\frac15$`, String.raw`$\frac{7}{25}$`, String.raw`$\frac{12}{25}$`, String.raw`$\frac{24}{25}$`], a: 3,
      sol: { idea: String.raw`ยกกำลังสองทั้งสองข้าง แล้วใช้ $\sin^2x+\cos^2x=1$ และ $2\sin x\cos x=\sin2x$`, steps: [String.raw`$(\sin x+\cos x)^2=1+2\sin x\cos x=\frac{49}{25}$`, String.raw`$\sin 2x=\frac{49}{25}-1=\frac{24}{25}$`], warn: String.raw`ตัวเลือก $\frac{12}{25}$ คือค่าของ $\sin x\cos x$ ไม่ใช่ $\sin 2x$` } },
    { q: 'จำนวนคู่สามหลักที่มีเลขโดดในแต่ละหลักแตกต่างกันทั้งหมด มีกี่จำนวน', c: ['320', '328', '360', '405'], a: 1,
      sol: { idea: 'หลักหน่วยเป็น 0 หรือไม่เป็น 0 มีผลต่อหลักร้อย จึงแยกกรณี', steps: ['กรณีหลักหน่วยเป็น 0: หลักร้อยเลือกได้ 9 แบบ หลักสิบ 8 แบบ ได้ $9\\times8=72$', 'กรณีหลักหน่วยเป็น 2, 4, 6, 8 (4 แบบ): หลักร้อยห้ามเป็น 0 และห้ามซ้ำหลักหน่วย เหลือ 8 แบบ หลักสิบ 8 แบบ ได้ $4\\times8\\times8=256$', 'รวม $72+256=328$'], warn: 'ถ้าไม่แยกกรณี จะนับหลักร้อยเป็น 0 ปนเข้ามาหรือนับขาด' } },
    { q: String.raw`ค่าของ $i+i^2+i^3+\dots+i^{2026}$ เมื่อ $i^2=-1$ เท่ากับข้อใด`, c: [String.raw`$-1+i$`, '0', String.raw`$i$`, String.raw`$-1$`], a: 0,
      sol: { idea: String.raw`กำลังของ $i$ วนซ้ำทุก 4 พจน์ และผลบวก 4 พจน์ติดกันเท่ากับ 0`, steps: [String.raw`$i+i^2+i^3+i^4=i-1-i+1=0$`, String.raw`$2026=4(506)+2$ จึงเหลือ 2 พจน์สุดท้าย $i^{2025}+i^{2026}=i+i^2$`, String.raw`ผลบวก $=i-1=-1+i$`] } },
    { q: String.raw`กำหนดให้ $A=\begin{bmatrix}1&2\\3&4\end{bmatrix}$ และ $I$ เป็นเมทริกซ์เอกลักษณ์ ค่าของ $\det(A^2-A)$ เท่ากับข้อใด`, c: [String.raw`$-12$`, '2', '4', '12'], a: 3,
      sol: { idea: String.raw`แยกตัวประกอบ $A^2-A=A(A-I)$ แล้วใช้ $\det(XY)=\det X\det Y$`, steps: [String.raw`$\det A=4-6=-2$`, String.raw`$A-I=\begin{bmatrix}0&2\\3&3\end{bmatrix}$, $\det(A-I)=0-6=-6$`, String.raw`$\det(A^2-A)=(-2)(-6)=12$`], check: String.raw`$A^2-A=\begin{bmatrix}7&10\\15&22\end{bmatrix}-\begin{bmatrix}1&2\\3&4\end{bmatrix}=\begin{bmatrix}6&8\\12&18\end{bmatrix}$, $\det=108-96=12$ ✓` } },
    { q: 'คะแนนสอบของนักเรียน 5 คนเป็นจำนวนเต็มบวก มีค่าเฉลี่ยเลขคณิต 12 มัธยฐาน 13 และฐานนิยมเพียงค่าเดียวคือ 15 พิสัยของคะแนนชุดนี้มีค่ามากที่สุดเท่าใด', c: ['10', '11', '12', '13'], a: 0,
      sol: { idea: 'เรียงข้อมูลแล้วใช้เงื่อนไขทีละข้อ พิสัยมากสุดเมื่อคะแนนต่ำสุดน้อยที่สุด', steps: [String.raw`เรียงเป็น $a\le b\le 13\le d\le e$ ฐานนิยม 15 ค่าเดียว จึงต้องมี 15 อย่างน้อยสองตัว: $d=e=15$`, String.raw`ผลรวม $=60 \Rightarrow a+b=60-13-30=17$`, String.raw`ถ้า $b=13$ จะมี 13 ซ้ำสองตัว ฐานนิยมไม่ใช่ค่าเดียว จึงต้อง $b\le12$ และ $a\ne b$`, String.raw`$a=17-b\ge5$ ดังนั้นค่าต่ำสุดน้อยที่สุดคือ 5 (ข้อมูล $5,12,13,15,15$)`, String.raw`พิสัยมากสุด $=15-5=10$`] } },
  ],
  fill: [
    { q: String.raw`$999\times1001+1$ มีค่าเท่าใด`, a: '1000000', sol: { idea: String.raw`$999\times1001=(1000-1)(1000+1)=1000^2-1$`, steps: [String.raw`$=1000^2-1+1=1{,}000{,}000$`] } },
    { q: String.raw`$\frac{1}{1\cdot2}+\frac{1}{2\cdot3}+\frac{1}{3\cdot4}+\dots+\frac{1}{99\cdot100}$ มีค่าเท่าใด`, a: String.raw`$\frac{99}{100}$`, k: String.raw`\frac{99}{100}`, sol: { idea: String.raw`แยกเศษส่วนย่อย $\frac{1}{k(k+1)}=\frac1k-\frac1{k+1}$ แล้วพจน์กลางหักล้างกัน`, steps: [String.raw`$=\left(1-\frac12\right)+\left(\frac12-\frac13\right)+\dots+\left(\frac1{99}-\frac1{100}\right)$`, String.raw`$=1-\frac1{100}=\frac{99}{100}$`] } },
    { q: String.raw`$\sqrt{2025}+\sqrt[3]{-343}+2^{-2}\cdot16$ มีค่าเท่าใด`, a: '42', sol: { idea: 'คำนวณแต่ละพจน์แยกกัน', steps: [String.raw`$\sqrt{2025}=45,\ \sqrt[3]{-343}=-7,\ 2^{-2}\cdot16=\frac{16}{4}=4$`, String.raw`ผลรวม $=45-7+4=42$`] } },
    { q: String.raw`$(\sqrt5+\sqrt3)(\sqrt5-\sqrt3)(\sqrt5+2)(\sqrt5-2)$ มีค่าเท่าใด`, a: '2', sol: { idea: 'จับคู่ผลต่างกำลังสอง', steps: [String.raw`$(\sqrt5+\sqrt3)(\sqrt5-\sqrt3)=5-3=2$`, String.raw`$(\sqrt5+2)(\sqrt5-2)=5-4=1$`, String.raw`ผลคูณ $=2$`] } },
    { q: String.raw`$\log_2 3\cdot\log_3 4\cdot\log_4 5\cdots\log_{63}64$ มีค่าเท่าใด`, a: '6', sol: { idea: String.raw`ใช้ $\log_a b\cdot\log_b c=\log_a c$ ซ้ำ ๆ (ผลคูณแบบโซ่)`, steps: [String.raw`$=\frac{\log3}{\log2}\cdot\frac{\log4}{\log3}\cdots\frac{\log64}{\log63}=\frac{\log64}{\log2}=\log_2 64=6$`] } },
    { q: String.raw`ถ้า $2^a=3$ และ $3^b=16$ แล้ว $ab$ มีค่าเท่าใด`, a: '4', sol: { idea: 'แทนค่าหนึ่งลงในอีกค่าหนึ่ง', steps: [String.raw`$2^{ab}=(2^a)^b=3^b=16=2^4$`, String.raw`ดังนั้น $ab=4$`] } },
    { q: String.raw`ผลคูณของคำตอบทั้งหมดของสมการ $x^2-5|x|+6=0$ เท่ากับเท่าใด`, a: '36', sol: { idea: String.raw`ให้ $t=|x|\ge0$ จะได้สมการกำลังสองในรูป $t$`, steps: [String.raw`$t^2-5t+6=0 \Rightarrow t=2$ หรือ $t=3$`, String.raw`$|x|=2$ ได้ $x=\pm2$ และ $|x|=3$ ได้ $x=\pm3$`, String.raw`ผลคูณ $=(2)(-2)(3)(-3)=36$`], warn: 'สมการนี้มีคำตอบ 4 ค่า ไม่ใช่ 2 ค่า' } },
    { q: String.raw`กำหนดเอกภพสัมพัทธ์ $U=\{-3,-2,-1,0,1,2,3\}$ จำนวนสมาชิก $x$ ใน $U$ ที่ทำให้ประพจน์ $x^2<5\to x\ge0$ เป็นจริงมีกี่ตัว`, a: '5', sol: { idea: String.raw`$a\to b$ เป็นเท็จกรณีเดียว คือ $a$ จริงและ $b$ เท็จ จึงนับตัวที่ทำให้เป็นเท็จแล้วหักออก`, steps: [String.raw`เป็นเท็จเมื่อ $x^2<5$ จริง และ $x\ge0$ เท็จ คือ $x<0$ และ $x^2<5$`, String.raw`ใน $U$ ได้ $x=-1,-2$ (ส่วน $x=-3$ มี $x^2=9$ ทำให้ประพจน์เป็นจริง)`, String.raw`จำนวนที่ทำให้เป็นจริง $=7-2=5$`] } },
    { q: 'จำนวนเต็มตั้งแต่ 1 ถึง 100 ที่หารด้วย 2 ไม่ลงตัว และหารด้วย 3 ไม่ลงตัว มีกี่จำนวน', a: '33', sol: { idea: 'นับส่วนเติมเต็มด้วยหลักการเพิ่มเข้า–ตัดออก', steps: [String.raw`หารด้วย 2 ลงตัว 50 จำนวน หารด้วย 3 ลงตัว 33 จำนวน หารด้วย 6 ลงตัว 16 จำนวน`, String.raw`หารด้วย 2 หรือ 3 ลงตัว $=50+33-16=67$`, String.raw`ที่ต้องการ $=100-67=33$`] } },
    { q: String.raw`$1^2-2^2+3^2-4^2+\dots+99^2-100^2$ มีค่าเท่าใด`, a: String.raw`$-5050$`, k: '-5050', sol: { idea: 'จับคู่ทีละสองพจน์เป็นผลต่างกำลังสอง', steps: [String.raw`$(2k-1)^2-(2k)^2=-(4k-1)=-\big[(2k-1)+2k\big]$`, String.raw`ผลรวมทั้งหมด $=-(1+2+3+\dots+100)=-5050$`] } },
    { q: String.raw`$\sin^2 1^\circ+\sin^2 2^\circ+\sin^2 3^\circ+\dots+\sin^2 89^\circ$ มีค่าเท่าใด`, a: String.raw`$\frac{89}{2}$`, k: String.raw`\frac{89}{2}`, sol: { idea: String.raw`จับคู่ $\sin^2\theta+\sin^2(90^\circ-\theta)=\sin^2\theta+\cos^2\theta=1$`, steps: [String.raw`จับคู่ $(1^\circ,89^\circ),(2^\circ,88^\circ),\dots,(44^\circ,46^\circ)$ ได้ 44 คู่ คู่ละ 1`, String.raw`เหลือ $\sin^2 45^\circ=\frac12$`, String.raw`ผลรวม $=44+\frac12=\frac{89}{2}$`] } },
    { q: String.raw`$\tan15^\circ+\cot15^\circ$ มีค่าเท่าใด`, a: '4', sol: { idea: 'รวมเป็นเศษส่วนเดียวกัน', steps: [String.raw`$\tan\theta+\cot\theta=\frac{\sin^2\theta+\cos^2\theta}{\sin\theta\cos\theta}=\frac{2}{\sin2\theta}$`, String.raw`$=\frac{2}{\sin30^\circ}=\frac{2}{1/2}=4$`] } },
    { q: 'ฝากเงินต้นปีทุกปี ปีละ 10,000 บาท ได้ดอกเบี้ยทบต้นร้อยละ 10 ต่อปี เมื่อสิ้นปีที่ 3 จะมีเงินรวมกี่บาท', a: '36410', sol: { idea: 'เงินแต่ละก้อนได้ดอกเบี้ยทบต้นตามจำนวนปีที่ฝาก แล้วนำมารวมกัน (อนุกรมเรขาคณิต)', steps: [String.raw`ก้อนแรกฝาก 3 ปี: $10000(1.1)^3=13310$`, String.raw`ก้อนที่สองฝาก 2 ปี: $10000(1.1)^2=12100$`, String.raw`ก้อนที่สามฝาก 1 ปี: $10000(1.1)=11000$`, String.raw`รวม $=36410$ บาท`], warn: 'ฝากต้นปี เงินก้อนสุดท้ายจึงได้ดอกเบี้ย 1 ปี' } },
    { q: String.raw`$1+3+3^2+3^3+\dots+3^6$ มีค่าเท่าใด`, a: '1093', sol: { idea: String.raw`อนุกรมเรขาคณิต $S_n=\frac{a_1(r^n-1)}{r-1}$`, steps: [String.raw`$a_1=1,\ r=3,\ n=7$`, String.raw`$S_7=\frac{3^7-1}{2}=\frac{2186}{2}=1093$`] } },
    { q: String.raw`ส่วนเบี่ยงเบนมาตรฐาน (ประชากร) ของข้อมูล $3,\,5,\,7,\,9,\,11$ เท่ากับเท่าใด`, a: String.raw`$2\sqrt2$`, k: String.raw`2\sqrt2`, sol: { idea: String.raw`$\sigma=\sqrt{\frac{\sum(x_i-\mu)^2}{N}}$`, steps: [String.raw`$\mu=\frac{35}{5}=7$`, String.raw`$\sum(x_i-\mu)^2=16+4+0+4+16=40$`, String.raw`$\sigma=\sqrt{\frac{40}{5}}=\sqrt8=2\sqrt2$`] } },
    { q: String.raw`สัมประสิทธิ์ของ $x^3$ ในการกระจาย $(2x-1)^5$ เท่ากับเท่าใด`, a: '80', sol: { idea: String.raw`พจน์ทั่วไป $\binom5r(2x)^r(-1)^{5-r}$`, steps: [String.raw`$r=3$: $\binom53\cdot2^3\cdot(-1)^2=10\cdot8=80$`], warn: 'อย่าลืมยกกำลัง 2 ของสัมประสิทธิ์และเครื่องหมายของ $-1$' } },
    { q: String.raw`$\displaystyle\lim_{x\to0}\frac{\sqrt{x+9}-3}{x}$ มีค่าเท่าใด`, a: String.raw`$\frac16$`, k: String.raw`\frac16`, sol: { idea: 'แทนค่าได้ $\\frac00$ จึงคูณด้วยสังยุคของตัวเศษ', steps: [String.raw`$\frac{\sqrt{x+9}-3}{x}\cdot\frac{\sqrt{x+9}+3}{\sqrt{x+9}+3}=\frac{x}{x(\sqrt{x+9}+3)}=\frac{1}{\sqrt{x+9}+3}$`, String.raw`เมื่อ $x\to0$ ได้ $\frac{1}{3+3}=\frac16$`] } },
    { q: String.raw`ถ้า $f(x)=(x^2+1)(x-2)$ แล้ว $f'(2)$ มีค่าเท่าใด`, a: '5', sol: { idea: 'กฎผลคูณ $(uv)\'=u\'v+uv\'$', steps: [String.raw`$f'(x)=2x(x-2)+(x^2+1)$`, String.raw`$f'(2)=4(0)+5=5$`] } },
    { q: String.raw`$\displaystyle\int_{-1}^{1}(x^3+3x^2-x+2)\,dx$ มีค่าเท่าใด`, a: '6', sol: { idea: 'บนช่วงสมมาตร $[-a,a]$ ปริพันธ์ของฟังก์ชันคี่เป็น 0 จึงคิดเฉพาะพจน์คู่', steps: [String.raw`$x^3$ และ $-x$ เป็นฟังก์ชันคี่ ปริพันธ์เป็น 0`, String.raw`$\int_{-1}^{1}(3x^2+2)\,dx=\big[x^3+2x\big]_{-1}^{1}=3-(-3)=6$`] } },
    { q: String.raw`ถ้า $|\vec u|=3,\ |\vec v|=4$ และ $|\vec u+\vec v|=5$ แล้ว $|\vec u-2\vec v|$ มีค่าเท่าใด`, a: String.raw`$\sqrt{73}$`, k: String.raw`\sqrt{73}`, sol: { idea: String.raw`ใช้ $|\vec a|^2=\vec a\cdot\vec a$ หา $\vec u\cdot\vec v$ ก่อน`, steps: [String.raw`$|\vec u+\vec v|^2=9+16+2\vec u\cdot\vec v=25 \Rightarrow \vec u\cdot\vec v=0$`, String.raw`$|\vec u-2\vec v|^2=9+4(16)-4(0)=73$`, String.raw`$|\vec u-2\vec v|=\sqrt{73}$`] } },
  ],
  prob: [
    { q: String.raw`จุด $P$ อยู่บนวงรี $9x^2+25y^2-18x-216=0$ ให้ $F_1$ และ $F_2$ เป็นโฟกัสทั้งสองของวงรี ความยาวรอบรูปของสามเหลี่ยม $PF_1F_2$ เท่ากับกี่หน่วย`, a: '18',
      sol: { idea: String.raw`ทำสมการให้อยู่ในรูปมาตรฐาน แล้วใช้สมบัติของวงรี $PF_1+PF_2=2a$`, steps: [String.raw`$9(x^2-2x+1)+25y^2=216+9 \Rightarrow 9(x-1)^2+25y^2=225$`, String.raw`$\frac{(x-1)^2}{25}+\frac{y^2}{9}=1$ ได้ $a=5,\ b=3$`, String.raw`$c=\sqrt{a^2-b^2}=4$ ระยะระหว่างโฟกัส $F_1F_2=2c=8$`, String.raw`รอบรูป $=PF_1+PF_2+F_1F_2=2a+2c=10+8=18$`], warn: 'ผลบวกระยะทางจากจุดบนวงรีไปยังโฟกัสทั้งสองเท่ากับ $2a$ (ความยาวแกนเอก) ไม่ใช่ $2b$' } },
    { q: String.raw`ให้ $\alpha$ และ $\beta$ เป็นรากของสมการ $x^2-3x+1=0$ ค่าของ $\alpha^3+\beta^3$ เท่ากับเท่าใด`, a: '18',
      sol: { idea: String.raw`ไม่ต้องหารากจริง ใช้ $\alpha+\beta$ และ $\alpha\beta$ กับเอกลักษณ์ $\alpha^3+\beta^3=(\alpha+\beta)^3-3\alpha\beta(\alpha+\beta)$`, steps: [String.raw`$\alpha+\beta=3,\ \alpha\beta=1$`, String.raw`$\alpha^3+\beta^3=3^3-3(1)(3)=27-9=18$`], check: String.raw`วิธีที่สอง: $\alpha^2=3\alpha-1 \Rightarrow \alpha^3=3\alpha^2-\alpha=8\alpha-3$ จึงได้ $\alpha^3+\beta^3=8(3)-6=18$ ✓` } },
    { q: 'จำนวนนับที่เขียนด้วยเลขโดด 1, 2, 3 เท่านั้น (ใช้ซ้ำได้) นำมาเรียงจากน้อยไปมาก ได้ $1,2,3,11,12,13,21,\\dots$ จำนวนในลำดับที่ 50 คือจำนวนใด', a: '1212',
      sol: { idea: 'นับจำนวนตามจำนวนหลักก่อน แล้วไล่ลำดับในกลุ่มที่พจน์ที่ 50 อยู่', steps: ['หนึ่งหลักมี $3$ จำนวน สองหลักมี $3^2=9$ สามหลักมี $3^3=27$ รวม $39$ จำนวน', 'พจน์ที่ 50 จึงเป็นจำนวนสี่หลักลำดับที่ $50-39=11$', 'จำนวนสี่หลักขึ้นต้น 11 มี 9 จำนวน ($1111$ ถึง $1133$) จึงเป็นลำดับที่ 1–9', 'ลำดับที่ 10 และ 11 ขึ้นต้นด้วย 121 คือ $1211, 1212$', 'ตอบ $1212$'] } },
    { q: 'รูปสามเหลี่ยม $ABC$ มี $AB=13,\\ BC=14$ และ $CA=15$ หน่วย ความสูงจากจุด $A$ ตั้งฉากกับด้าน $BC$ ยาวกี่หน่วย', a: '12',
      sol: { idea: 'หาพื้นที่ด้วยสูตรเฮรอน หรือตั้งสมการพีทาโกรัสสองรูป แล้วใช้ พื้นที่ $=\\frac12\\times$ ฐาน $\\times$ สูง', steps: [String.raw`ให้ $D$ เป็นจุดบน $BC$ ที่ $AD\perp BC$, $BD=x$ และ $DC=14-x$`, String.raw`$13^2-x^2=15^2-(14-x)^2 \Rightarrow 169-x^2=225-196+28x-x^2$`, String.raw`$28x=140 \Rightarrow x=5$`, String.raw`$AD=\sqrt{13^2-5^2}=\sqrt{144}=12$`], check: String.raw`สูตรเฮรอน: $s=21$, พื้นที่ $=\sqrt{21\cdot8\cdot7\cdot6}=84=\frac12(14)(12)$ ✓` } },
    { q: 'ทอดลูกเต๋าที่เที่ยงตรง 2 ลูกพร้อมกัน 1 ครั้ง ความน่าจะเป็นที่ผลรวมของแต้มเป็นจำนวนเฉพาะเท่ากับเท่าใด', a: String.raw`$\frac{5}{12}$`, k: String.raw`\frac{5}{12}`,
      sol: { idea: 'ผลรวมที่เป็นไปได้คือ 2 ถึง 12 นับเฉพาะที่เป็นจำนวนเฉพาะ', steps: ['ผลรวมที่เป็นจำนวนเฉพาะ: 2, 3, 5, 7, 11', 'จำนวนผลลัพธ์: ผลรวม 2 มี 1, ผลรวม 3 มี 2, ผลรวม 5 มี 4, ผลรวม 7 มี 6, ผลรวม 11 มี 2 รวม 15', 'ความน่าจะเป็น $=\\frac{15}{36}=\\frac{5}{12}$'], warn: 'ผลรวม 2 ต้องนับ (2 เป็นจำนวนเฉพาะ) และผลรวม 9 ไม่ใช่จำนวนเฉพาะ' } },
    { q: 'เลือกจำนวนสามจำนวนที่แตกต่างกันจาก $\\{1,2,3,\\dots,10\\}$ โดยไม่สนใจลำดับ จำนวนวิธีที่ผลบวกของสามจำนวนเป็นจำนวนคู่มีกี่วิธี', a: '60',
      sol: { idea: 'ผลบวกเป็นจำนวนคู่ได้เมื่อมีจำนวนคี่ 0 ตัว หรือ 2 ตัว', steps: ['ในเซตมีจำนวนคี่ 5 ตัว และจำนวนคู่ 5 ตัว', 'คู่ทั้งสามตัว: $\\binom53=10$ วิธี', 'คี่ 2 ตัว คู่ 1 ตัว: $\\binom52\\binom51=10\\times5=50$ วิธี', 'รวม $10+50=60$ วิธี'], check: 'ทั้งหมด $\\binom{10}{3}=120$ วิธี ผลบวกคู่กับคี่มีจำนวนเท่ากันพอดีจากความสมมาตร จึงได้ครึ่งหนึ่งคือ 60 ✓' } },
    { q: 'จำนวนเต็มบวก $n$ ที่น้อยที่สุดซึ่งทำให้ $1+2+3+\\dots+n>2026$ คือจำนวนใด', a: '64',
      sol: { idea: String.raw`ใช้ $1+2+\dots+n=\frac{n(n+1)}{2}$ แล้วประมาณ $n^2\approx 2\times2026$`, steps: [String.raw`$\frac{n(n+1)}{2}>2026 \Rightarrow n(n+1)>4052$ และ $\sqrt{4052}\approx63.7$`, String.raw`$n=63$: $\frac{63\cdot64}{2}=2016<2026$ ไม่ผ่าน`, String.raw`$n=64$: $\frac{64\cdot65}{2}=2080>2026$ ผ่าน`, 'ตอบ 64'] } },
    { q: 'รูปสี่เหลี่ยมผืนผ้ารูปหนึ่งมีความยาวรอบรูป 34 หน่วย และเส้นทแยงมุมยาว 13 หน่วย พื้นที่ของรูปสี่เหลี่ยมนี้เท่ากับกี่ตารางหน่วย', a: '60',
      sol: { idea: String.raw`ใช้ $(a+b)^2=a^2+b^2+2ab$ โดยไม่ต้องหาด้านแต่ละด้าน`, steps: [String.raw`ให้ด้านยาว $a,b$: $a+b=17$ และ $a^2+b^2=13^2=169$`, String.raw`$2ab=(a+b)^2-(a^2+b^2)=289-169=120$`, String.raw`พื้นที่ $=ab=60$`], check: String.raw`ด้านคือ 5 และ 12: รอบรูป $2(17)=34$, เส้นทแยงมุม $\sqrt{25+144}=13$ ✓` } },
    { q: String.raw`ให้ $f(x)=ax+b$ เมื่อ $a>0$ ถ้า $f(f(x))=9x+8$ สำหรับทุกจำนวนจริง $x$ แล้ว $f(10)$ มีค่าเท่าใด`, a: '32',
      sol: { idea: 'คำนวณ $f(f(x))$ ในรูป $a,b$ แล้วเทียบสัมประสิทธิ์', steps: [String.raw`$f(f(x))=a(ax+b)+b=a^2x+(ab+b)$`, String.raw`เทียบ: $a^2=9$ และ $a>0$ จึงได้ $a=3$`, String.raw`$ab+b=4b=8 \Rightarrow b=2$`, String.raw`$f(x)=3x+2 \Rightarrow f(10)=32$`], check: String.raw`$f(f(x))=3(3x+2)+2=9x+8$ ✓`, warn: String.raw`ถ้าไม่มีเงื่อนไข $a>0$ จะมีอีกคำตอบคือ $a=-3,\ b=-4$` } },
    { q: 'ต้องการทำกล่องไม่มีฝาจากแผ่นกระดาษรูปสี่เหลี่ยมจัตุรัสยาวด้านละ 12 เซนติเมตร โดยตัดมุมทั้งสี่ออกเป็นรูปสี่เหลี่ยมจัตุรัสเท่ากัน แล้วพับขึ้น ปริมาตรมากที่สุดของกล่องเท่ากับกี่ลูกบาศก์เซนติเมตร', a: '128',
      sol: { idea: 'เขียนปริมาตรเป็นฟังก์ชันของความยาวที่ตัด แล้วหาค่าสูงสุดด้วยอนุพันธ์', steps: [String.raw`ตัดมุมด้านละ $x$ ซม. ($0<x<6$) ได้กล่องฐาน $(12-2x)\times(12-2x)$ สูง $x$`, String.raw`$V(x)=x(12-2x)^2$`, String.raw`$V'(x)=(12-2x)^2-4x(12-2x)=(12-2x)(12-6x)=0 \Rightarrow x=2$ (เพราะ $x\ne6$)`, String.raw`$V(2)=2\cdot8^2=128$`], check: String.raw`$V(1)=100,\ V(2)=128,\ V(3)=108$ ค่าที่ $x=2$ มากที่สุด ✓` } },
  ],
});


/* ชุดที่ 2–3 */
(function () {
const R = String.raw;
GENIUS_SETS.push({
  no: 2,
  mc: [
    { q: R`ประพจน์ $p\to q$ สมมูลกับประพจน์ในข้อใด`, c: [R`$\sim q\to\sim p$`, R`$q\to p$`, R`$\sim p\to\sim q$`, R`$p\wedge\sim q$`], a: 0,
      sol: { idea: R`$p\to q\equiv\sim p\vee q\equiv\sim q\to\sim p$ (แย้งสลับที่)`, steps: [R`$\sim q\to\sim p\equiv\sim(\sim q)\vee\sim p\equiv q\vee\sim p\equiv p\to q$ ✓`, R`ข. และ ค. เป็นบทกลับและบทผกผัน ไม่สมมูลกับ $p\to q$ (ลอง $p$ เท็จ $q$ จริง)`, R`ง. คือนิเสธของ $p\to q$`] } },
    { q: R`กำหนดให้ $A=\{x\in\mathbb Z\mid x^2<10\}$ และ $B=\{x\in\mathbb Z\mid |x-1|\le2\}$ จำนวนสมาชิกของ $A\cap B$ เท่ากับข้อใด`, c: ['3', '4', '5', '6'], a: 2,
      sol: { idea: 'เขียนสมาชิกของแต่ละเซตออกมาก่อน', steps: [R`$x^2<10$ กับ $x\in\mathbb Z$ ได้ $A=\{-3,-2,-1,0,1,2,3\}$`, R`$|x-1|\le2 \Rightarrow -1\le x\le3$ ได้ $B=\{-1,0,1,2,3\}$`, R`$A\cap B=\{-1,0,1,2,3\}$ มี 5 สมาชิก`] } },
    { q: R`เมื่อหาร $p(x)=x^3+ax+2$ ด้วย $x-2$ เหลือเศษ 4 ถ้าหาร $p(x)$ ด้วย $x+1$ จะเหลือเศษเท่าใด`, c: [R`$-2$`, '0', '2', '4'], a: 3,
      sol: { idea: R`ทฤษฎีบทเศษเหลือ: เศษจากการหาร $p(x)$ ด้วย $x-c$ คือ $p(c)$`, steps: [R`$p(2)=8+2a+2=4 \Rightarrow a=-3$`, R`เศษจากการหารด้วย $x+1$ คือ $p(-1)=-1+3+2=4$`] } },
    { q: R`กำหนดให้ $f(x)=\dfrac{2x+3}{x-1}$ เมื่อ $x\ne1$ ค่าของ $f^{-1}(5)$ เท่ากับข้อใด`, c: ['2', R`$\frac83$`, '3', R`$\frac{13}{4}$`], a: 1,
      sol: { idea: R`$f^{-1}(5)=t$ ก็ต่อเมื่อ $f(t)=5$ ไม่ต้องหาสูตรของ $f^{-1}$ ทั้งหมด`, steps: [R`$\frac{2t+3}{t-1}=5 \Rightarrow 2t+3=5t-5 \Rightarrow t=\frac83$`], check: R`$f\left(\frac83\right)=\frac{\frac{16}{3}+3}{\frac53}=\frac{25/3}{5/3}=5$ ✓`, warn: R`ตัวเลือก $\frac{13}{4}$ คือ $f(5)$ ไม่ใช่ $f^{-1}(5)$` } },
    { q: R`ผลบวกของคำตอบทั้งหมดของสมการ $4^x-6\cdot2^x+8=0$ เท่ากับข้อใด`, c: ['3', '4', '5', '6'], a: 0,
      sol: { idea: R`ให้ $t=2^x$ จะได้ $4^x=t^2$ สมการกลายเป็นสมการกำลังสอง`, steps: [R`$t^2-6t+8=0 \Rightarrow t=2$ หรือ $t=4$`, R`$2^x=2 \Rightarrow x=1$ และ $2^x=4 \Rightarrow x=2$`, R`ผลบวกคำตอบ $=3$`], warn: R`6 คือผลบวกของค่า $t$ ไม่ใช่ผลบวกของ $x$` } },
    { q: R`ระยะทางจากจุดศูนย์กลางของวงกลม $x^2+y^2-6x+4y-12=0$ ไปยังเส้นตรง $3x+4y+14=0$ เท่ากับข้อใด`, c: ['1', '2', '3', '5'], a: 2,
      sol: { idea: R`จัดรูปกำลังสองสมบูรณ์หาจุดศูนย์กลาง แล้วใช้สูตรระยะทางจากจุดถึงเส้นตรง $\frac{|Ax_0+By_0+C|}{\sqrt{A^2+B^2}}$`, steps: [R`$(x-3)^2+(y+2)^2=25$ จุดศูนย์กลาง $(3,-2)$`, R`ระยะทาง $=\frac{|3(3)+4(-2)+14|}{\sqrt{9+16}}=\frac{15}{5}=3$`], check: 'ระยะ 3 น้อยกว่ารัศมี 5 แสดงว่าเส้นตรงตัดวงกลมสองจุด (ใช้ตรวจความสมเหตุสมผลได้)' } },
    { q: R`ถ้า $\tan A=\frac34$ และ $\pi<A<\frac{3\pi}{2}$ แล้ว $\sin A+\cos A$ มีค่าเท่าใด`, c: [R`$-\frac75$`, R`$-\frac15$`, R`$\frac15$`, R`$\frac75$`], a: 0,
      sol: { idea: R`มุมในจตุภาคที่ 3 มีทั้ง $\sin$ และ $\cos$ เป็นลบ ใช้สามเหลี่ยมมุมฉาก 3–4–5 หาขนาด`, steps: [R`$\tan A=\frac34$ ได้ขนาด $|\sin A|=\frac35,\ |\cos A|=\frac45$`, R`จตุภาคที่ 3: $\sin A=-\frac35,\ \cos A=-\frac45$`, R`$\sin A+\cos A=-\frac75$`], warn: 'ถ้าลืมเครื่องหมายตามจตุภาค จะได้ $\\frac75$ ซึ่งผิด' } },
    { q: R`ให้ $\vec u=\vec i+2\vec j+2\vec k$ และ $\vec v=2\vec i-\vec j+2\vec k$ ถ้า $\theta$ เป็นมุมระหว่าง $\vec u$ กับ $\vec v$ แล้ว $\cos\theta$ เท่ากับข้อใด`, c: [R`$\frac29$`, R`$\frac13$`, R`$\frac49$`, R`$\frac59$`], a: 2,
      sol: { idea: R`$\cos\theta=\frac{\vec u\cdot\vec v}{|\vec u||\vec v|}$`, steps: [R`$\vec u\cdot\vec v=2-2+4=4$`, R`$|\vec u|=\sqrt{1+4+4}=3,\ |\vec v|=\sqrt{4+1+4}=3$`, R`$\cos\theta=\frac{4}{9}$`] } },
    { q: 'คน 5 คน ซึ่งมีนาย ก และนาย ข รวมอยู่ด้วย ยืนเรียงแถวหน้ากระดานแบบสุ่ม ความน่าจะเป็นที่นาย ก และนาย ข ยืนติดกันเท่ากับข้อใด', c: [R`$\frac15$`, R`$\frac25$`, R`$\frac12$`, R`$\frac35$`], a: 1,
      sol: { idea: 'มัดคนที่ต้องติดกันเป็นหนึ่งหน่วย แล้วคูณด้วยการสลับภายในมัด', steps: [R`จำนวนวิธีทั้งหมด $=5!=120$`, R`มัด ก ข เป็น 1 หน่วย เหลือ 4 หน่วย จัดได้ $4!=24$ วิธี สลับ ก ข ในมัดได้ 2 วิธี รวม 48 วิธี`, R`ความน่าจะเป็น $=\frac{48}{120}=\frac25$`] } },
    { q: 'คะแนนสอบวิชาหนึ่งมีค่าเฉลี่ยเลขคณิต 60 คะแนน และส่วนเบี่ยงเบนมาตรฐาน 8 คะแนน นักเรียนที่มีค่ามาตรฐานเท่ากับ $-0.5$ ได้คะแนนเท่าใด', c: ['48', '52', '54', '56'], a: 3,
      sol: { idea: R`ค่ามาตรฐาน $z=\frac{x-\mu}{\sigma}$ จึงได้ $x=\mu+z\sigma$`, steps: [R`$x=60+(-0.5)(8)=60-4=56$`], warn: R`ค่า $z$ ติดลบแปลว่าต่ำกว่าค่าเฉลี่ย ไม่ใช่สูงกว่า` } },
  ],
  fill: [
    { q: R`$(\sqrt7+\sqrt3)^2+(\sqrt7-\sqrt3)^2$ มีค่าเท่าใด`, a: '20', sol: { idea: R`$(a+b)^2+(a-b)^2=2(a^2+b^2)$ พจน์ $2ab$ หักล้างกัน`, steps: [R`$=2(7+3)=20$`] } },
    { q: R`ทศนิยมซ้ำ $0.\dot3\dot6$ เขียนเป็นเศษส่วนอย่างต่ำได้เท่าใด`, a: R`$\frac{4}{11}$`, k: R`\frac{4}{11}`, sol: { idea: 'ทศนิยมซ้ำสองตำแหน่ง $0.\\dot a\\dot b=\\frac{ab}{99}$', steps: [R`$x=0.3636\ldots \Rightarrow 100x=36.3636\ldots$`, R`$99x=36 \Rightarrow x=\frac{36}{99}=\frac{4}{11}$`] } },
    { q: R`$\log_3\frac{1}{81}+\log_{\frac12}8$ มีค่าเท่าใด`, a: R`$-7$`, k: '-7', sol: { idea: 'เขียนเป็นเลขยกกำลังของฐาน', steps: [R`$\log_3 3^{-4}=-4$`, R`$\log_{\frac12}8=\log_{\frac12}\left(\frac12\right)^{-3}=-3$`, R`ผลรวม $=-7$`] } },
    { q: R`ถ้า $2^{2x+1}=32^{x-1}$ แล้ว $x$ มีค่าเท่าใด`, a: '2', sol: { idea: 'ทำฐานให้เป็น 2 ทั้งสองข้าง', steps: [R`$32^{x-1}=2^{5x-5}$`, R`$2x+1=5x-5 \Rightarrow x=2$`] } },
    { q: R`จำนวนเต็ม $x$ ที่สอดคล้องกับอสมการ $x^2-x-12<0$ มีกี่จำนวน`, a: '6', sol: { idea: 'แยกตัวประกอบ แล้วหาช่วงที่ผลคูณเป็นลบ', steps: [R`$(x-4)(x+3)<0 \Rightarrow -3<x<4$`, R`จำนวนเต็มคือ $-2,-1,0,1,2,3$ รวม 6 จำนวน`], warn: 'อสมการไม่มีเครื่องหมายเท่ากับ จึงไม่รวม $-3$ และ $4$' } },
    { q: R`กำหนดให้ $f(x)=3x-2$ และ $g(x)=x^2+1$ ค่าของ $(f\circ g)(-2)+(g\circ f)(-2)$ เท่ากับเท่าใด`, a: '78', sol: { idea: 'คำนวณฟังก์ชันด้านในก่อนทั้งสองพจน์', steps: [R`$(f\circ g)(-2)=f(5)=13$`, R`$(g\circ f)(-2)=g(-8)=65$`, R`ผลรวม $=78$`] } },
    { q: R`ผลบวกกำลังสองของรากทั้งหมดของสมการ $x^3-6x^2+11x-6=0$ เท่ากับเท่าใด`, a: '14', sol: { idea: 'หารากด้วยทฤษฎีบทตัวประกอบ', steps: [R`$x=1$ ทำให้สมการเป็น 0 จึงแยกได้ $(x-1)(x^2-5x+6)=(x-1)(x-2)(x-3)$`, R`ผลบวกกำลังสอง $=1+4+9=14$`] } },
    { q: R`เศษจากการหาร $x^{2026}+2x+3$ ด้วย $x-1$ เท่ากับเท่าใด`, a: '6', sol: { idea: 'ทฤษฎีบทเศษเหลือ แทน $x=1$', steps: [R`เศษ $=1^{2026}+2(1)+3=6$`] } },
    { q: R`$\det\begin{bmatrix}1&2&3\\0&1&4\\5&6&0\end{bmatrix}$ มีค่าเท่าใด`, a: '1', sol: { idea: 'กระจายตามแถวแรก', steps: [R`$=1(0-24)-2(0-20)+3(0-5)$`, R`$=-24+40-15=1$`] } },
    { q: R`ถ้า $A=\begin{bmatrix}2&1\\5&3\end{bmatrix}$ ผลบวกของสมาชิกทุกตัวของ $A^{-1}$ เท่ากับเท่าใด`, a: R`$-1$`, k: '-1', sol: { idea: R`$\begin{bmatrix}a&b\\c&d\end{bmatrix}^{-1}=\frac{1}{ad-bc}\begin{bmatrix}d&-b\\-c&a\end{bmatrix}$`, steps: [R`$\det A=6-5=1$`, R`$A^{-1}=\begin{bmatrix}3&-1\\-5&2\end{bmatrix}$`, R`ผลบวก $=3-1-5+2=-1$`] } },
    { q: R`$(1+i)^8$ มีค่าเท่าใด`, a: '16', sol: { idea: R`$(1+i)^2=2i$ แล้วยกกำลังต่อ`, steps: [R`$(1+i)^8=\big((1+i)^2\big)^4=(2i)^4=16i^4=16$`] } },
    { q: R`ถ้า $z=\dfrac{1+3i}{1-i}$ แล้ว $|z|$ มีค่าเท่าใด`, a: R`$\sqrt5$`, k: R`\sqrt5`, sol: { idea: R`$\left|\frac{z_1}{z_2}\right|=\frac{|z_1|}{|z_2|}$`, steps: [R`$|z|=\frac{\sqrt{10}}{\sqrt2}=\sqrt5$`] } },
    { q: R`$\cos20^\circ\cos40^\circ\cos80^\circ$ มีค่าเท่าใด`, a: R`$\frac18$`, k: R`\frac18`, sol: { idea: R`คูณและหารด้วย $\sin20^\circ$ แล้วใช้ $2\sin\theta\cos\theta=\sin2\theta$ ซ้ำ`, steps: [R`$8\sin20^\circ\cos20^\circ\cos40^\circ\cos80^\circ=4\sin40^\circ\cos40^\circ\cos80^\circ=2\sin80^\circ\cos80^\circ=\sin160^\circ$`, R`$\sin160^\circ=\sin20^\circ$ จึงได้ผลคูณ $=\frac{\sin20^\circ}{8\sin20^\circ}=\frac18$`] } },
    { q: R`$\sin\!\left(\arcsin\frac35+\arccos\frac5{13}\right)$ มีค่าเท่าใด`, a: R`$\frac{63}{65}$`, k: R`\frac{63}{65}`, sol: { idea: R`ให้ $\alpha=\arcsin\frac35,\ \beta=\arccos\frac5{13}$ (มุมแหลมทั้งคู่) แล้วใช้ $\sin(\alpha+\beta)$`, steps: [R`$\sin\alpha=\frac35,\ \cos\alpha=\frac45,\ \cos\beta=\frac5{13},\ \sin\beta=\frac{12}{13}$`, R`$\sin(\alpha+\beta)=\frac35\cdot\frac5{13}+\frac45\cdot\frac{12}{13}=\frac{15+48}{65}=\frac{63}{65}$`] } },
    { q: R`$\dfrac{P_{10,3}}{\binom{10}{3}}$ มีค่าเท่าใด`, a: '6', sol: { idea: R`$P_{n,r}=r!\binom nr$ (เลือกก่อนแล้วจึงเรียง)`, steps: [R`$\frac{P_{10,3}}{\binom{10}3}=3!=6$`], check: R`$\frac{720}{120}=6$ ✓` } },
    { q: R`พจน์ที่ไม่มี $x$ ในการกระจาย $\left(x+\dfrac2x\right)^6$ มีค่าเท่าใด`, a: '160', sol: { idea: R`พจน์ทั่วไป $\binom6r x^{6-r}\left(\frac2x\right)^r=\binom6r2^r x^{6-2r}$`, steps: [R`ไม่มี $x$ เมื่อ $6-2r=0 \Rightarrow r=3$`, R`พจน์นั้น $=\binom63 2^3=20\cdot8=160$`] } },
    { q: R`ผลบวกของอนุกรมอนันต์ $1-\frac13+\frac19-\frac1{27}+\dots$ เท่ากับเท่าใด`, a: R`$\frac34$`, k: R`\frac34`, sol: { idea: R`อนุกรมเรขาคณิตอนันต์ที่ $r=-\frac13$`, steps: [R`$S_\infty=\frac{1}{1-(-\frac13)}=\frac{1}{\frac43}=\frac34$`] } },
    { q: R`$\displaystyle\lim_{n\to\infty}\left(\sqrt{n^2+4n}-n\right)$ มีค่าเท่าใด`, a: '2', sol: { idea: 'รูปแบบ $\\infty-\\infty$ คูณด้วยสังยุค', steps: [R`$=\lim\frac{(n^2+4n)-n^2}{\sqrt{n^2+4n}+n}=\lim\frac{4n}{\sqrt{n^2+4n}+n}$`, R`หารด้วย $n$: $=\lim\frac{4}{\sqrt{1+\frac4n}+1}=\frac42=2$`] } },
    { q: R`เส้นสัมผัสเส้นโค้ง $y=x^3-3x$ ที่จุด $x=2$ ตัดแกน $Y$ ที่จุด $(0,b)$ ค่าของ $b$ เท่ากับเท่าใด`, a: R`$-16$`, k: '-16', sol: { idea: 'ความชันเส้นสัมผัส = อนุพันธ์ที่จุดนั้น', steps: [R`จุดสัมผัส $(2,\,8-6)=(2,2)$, ความชัน $y'=3x^2-3=9$`, R`เส้นสัมผัส $y-2=9(x-2) \Rightarrow y=9x-16$`, R`$b=-16$`] } },
    { q: R`$\displaystyle\int_0^3|x-1|\,dx$ มีค่าเท่าใด`, a: R`$\frac52$`, k: R`\frac52`, sol: { idea: 'แบ่งช่วงที่ค่าในค่าสัมบูรณ์เปลี่ยนเครื่องหมาย', steps: [R`$\int_0^1(1-x)\,dx=\frac12$`, R`$\int_1^3(x-1)\,dx=\big[\frac{x^2}2-x\big]_1^3=\frac32+\frac12=2$`, R`รวม $=\frac52$`] } },
  ],
  prob: [
    { q: 'สำรวจนักเรียน 100 คน พบว่าเล่นฟุตบอล 45 คน วอลเลย์บอล 40 คน บาสเกตบอล 35 คน เล่นฟุตบอลและวอลเลย์บอล 15 คน ฟุตบอลและบาสเกตบอล 12 คน วอลเลย์บอลและบาสเกตบอล 10 คน และเล่นทั้งสามชนิด 5 คน มีนักเรียนที่ไม่เล่นกีฬาทั้งสามชนิดเลยกี่คน', a: '12',
      sol: { idea: R`$n(A\cup B\cup C)=n(A)+n(B)+n(C)-n(A\cap B)-n(A\cap C)-n(B\cap C)+n(A\cap B\cap C)$`, steps: [R`เล่นอย่างน้อยหนึ่งชนิด $=45+40+35-15-12-10+5=88$`, R`ไม่เล่นเลย $=100-88=12$`], check: 'แผนภาพเวนน์: ฟุตบอลอย่างเดียว 23 วอลเลย์อย่างเดียว 20 บาสอย่างเดียว 18 สองชนิดพอดี 10+7+5=22 ทั้งสาม 5 รวม 88 ✓' } },
    { q: R`พหุนาม $p(x)$ เมื่อหารด้วย $x-1$ เหลือเศษ 3 และเมื่อหารด้วย $x-2$ เหลือเศษ 5 ถ้า $r(x)$ เป็นเศษจากการหาร $p(x)$ ด้วย $(x-1)(x-2)$ แล้ว $r(10)$ มีค่าเท่าใด`, a: '21',
      sol: { idea: R`ตัวหารดีกรี 2 เศษมีดีกรีไม่เกิน 1 เขียน $p(x)=(x-1)(x-2)q(x)+ax+b$`, steps: [R`$p(1)=a+b=3$ และ $p(2)=2a+b=5$`, R`ได้ $a=2,\ b=1$ ดังนั้น $r(x)=2x+1$`, R`$r(10)=21$`] } },
    { q: R`ผลคูณของคำตอบทั้งหมดของสมการ $(\log_2 x)^2-5\log_2 x+6=0$ เท่ากับเท่าใด`, a: '32',
      sol: { idea: R`ให้ $t=\log_2x$ เป็นสมการกำลังสอง แล้วแปลงกลับ`, steps: [R`$t^2-5t+6=0 \Rightarrow t=2,3$`, R`$x=2^2=4$ และ $x=2^3=8$ (ทั้งสองค่าเป็นบวก ใช้ได้)`, R`ผลคูณ $=32$`], check: R`ทางลัด: ผลคูณ $=2^{t_1+t_2}=2^5=32$ ✓` } },
    { q: R`จุด $P$ อยู่บนพาราโบลา $y^2=12x$ ในจตุภาคที่ 1 และอยู่ห่างจากโฟกัส 9 หน่วย ถ้า $F$ เป็นโฟกัส และ $O$ เป็นจุดกำเนิด พื้นที่ของสามเหลี่ยม $OPF$ เท่ากับกี่ตารางหน่วย`, a: R`$9\sqrt2$`, k: R`9\sqrt2`,
      sol: { idea: 'ระยะจากจุดบนพาราโบลาถึงโฟกัส = ระยะถึงไดเรกทริกซ์', steps: [R`$y^2=4cx$ กับ $4c=12$ ได้ $c=3$: โฟกัส $F(3,0)$ ไดเรกทริกซ์ $x=-3$`, R`$PF=x+3=9 \Rightarrow x=6$ และ $y^2=72 \Rightarrow y=6\sqrt2$`, R`พื้นที่ $=\frac12\cdot OF\cdot y=\frac12(3)(6\sqrt2)=9\sqrt2$`] } },
    { q: R`ยืนที่จุด $A$ มองยอดเสาเห็นมุมเงย $30^\circ$ เดินตรงเข้าหาเสาอีก 20 เมตรถึงจุด $B$ มองยอดเสาเห็นมุมเงย $60^\circ$ เสาสูงกี่เมตร (จุด $A$, $B$ และโคนเสาอยู่ในแนวเดียวกันบนพื้นราบ)`, a: R`$10\sqrt3$`, k: R`10\sqrt3`,
      sol: { idea: 'เขียนระยะจากโคนเสาด้วย $\\cot$ ของมุมเงย', steps: [R`ให้เสาสูง $h$: ระยะจาก $A$ ถึงโคนเสา $=h\cot30^\circ=h\sqrt3$, จาก $B$ $=h\cot60^\circ=\frac{h}{\sqrt3}$`, R`$h\sqrt3-\frac h{\sqrt3}=20 \Rightarrow \frac{2h}{\sqrt3}=20 \Rightarrow h=10\sqrt3$`], check: R`สามเหลี่ยม $ABT$ เป็นหน้าจั่ว ($\angle ATB=30^\circ$) จึงได้ $BT=20$ และ $h=20\sin60^\circ=10\sqrt3$ ✓` } },
    { q: R`ถ้า $(x,y,z)$ เป็นคำตอบของระบบสมการ $x+y+z=6,\ 2x-y+z=3,\ x+2y-z=2$ แล้ว $xyz$ มีค่าเท่าใด`, a: '6',
      sol: { idea: 'กำจัดตัวแปรทีละตัว (หรือใช้การดำเนินการตามแถวกับเมทริกซ์แต่งเติม)', steps: [R`สมการ 1 + สมการ 3: $2x+3y=8$`, R`สมการ 2 + สมการ 3: $3x+y=5$`, R`จาก $3x+y=5$ ได้ $y=5-3x$ แทน: $2x+15-9x=8 \Rightarrow x=1,\ y=2$`, R`$z=6-1-2=3$ ดังนั้น $xyz=6$`], check: R`$2-2+3=3$ ✓ และ $1+4-3=2$ ✓` } },
    { q: 'โยนเหรียญที่เที่ยงตรง 5 ครั้ง ความน่าจะเป็นที่จะได้หัวอย่างน้อย 4 ครั้งเท่ากับเท่าใด', a: R`$\frac{3}{16}$`, k: R`\frac{3}{16}`,
      sol: { idea: R`แต่ละผลลัพธ์มีโอกาสเท่ากัน $\frac1{32}$ นับจำนวนผลลัพธ์ที่ได้หัว 4 หรือ 5 ครั้ง`, steps: [R`ได้หัว 4 ครั้ง: $\binom54=5$ แบบ, ได้หัว 5 ครั้ง: 1 แบบ`, R`ความน่าจะเป็น $=\frac{5+1}{32}=\frac{3}{16}$`] } },
    { q: 'ฝากเงิน 20,000 บาท ได้ดอกเบี้ยร้อยละ 8 ต่อปี โดยคิดดอกเบี้ยทบต้นทุก 6 เดือน เมื่อครบ 1 ปี จะได้ดอกเบี้ยทั้งหมดกี่บาท', a: '1632',
      sol: { idea: 'ทบต้นทุก 6 เดือน คือได้ดอกเบี้ยงวดละ $\\frac{8}{2}=4\\%$ จำนวน 2 งวด', steps: [R`เงินรวม $=20000(1.04)^2=20000(1.0816)=21632$`, R`ดอกเบี้ย $=21632-20000=1632$ บาท`], warn: 'ถ้าคิดดอกเบี้ยแบบปีละครั้งจะได้ 1,600 บาท ซึ่งน้อยกว่า' } },
    { q: R`พื้นที่ที่ปิดล้อมด้วยเส้นโค้ง $y=x^2$ และเส้นตรง $y=2x$ เท่ากับกี่ตารางหน่วย`, a: R`$\frac43$`, k: R`\frac43`,
      sol: { idea: 'หาจุดตัด แล้วอินทิเกรต (ฟังก์ชันบน − ฟังก์ชันล่าง)', steps: [R`$x^2=2x \Rightarrow x=0,2$ ช่วง $[0,2]$ มี $2x\ge x^2$`, R`พื้นที่ $=\int_0^2(2x-x^2)\,dx=\big[x^2-\frac{x^3}3\big]_0^2=4-\frac83=\frac43$`] } },
    { q: 'ข้อมูล 10 จำนวนมีค่าเฉลี่ยเลขคณิต 15 และส่วนเบี่ยงเบนมาตรฐาน 2 ถ้านำข้อมูลทุกตัวคูณด้วย 3 แล้วลบด้วย 5 ผลบวกของค่าเฉลี่ยใหม่กับความแปรปรวนใหม่เท่ากับเท่าใด', a: '76',
      sol: { idea: R`ถ้า $y=ax+b$ แล้ว $\bar y=a\bar x+b$ และ $s_y=|a|s_x$ (การบวกค่าคงตัวไม่เปลี่ยนการกระจาย)`, steps: [R`ค่าเฉลี่ยใหม่ $=3(15)-5=40$`, R`ส่วนเบี่ยงเบนมาตรฐานใหม่ $=3(2)=6$ ความแปรปรวนใหม่ $=36$`, R`ผลบวก $=40+36=76$`], warn: R`ความแปรปรวนคูณด้วย $a^2=9$ ไม่ใช่ $a=3$` } },
  ],
});
GENIUS_SETS.push({
  no: 3,
  mc: [
    { q: R`ถ้าประพจน์ $p\to q$ มีค่าความจริงเป็นเท็จ ข้อใดมีค่าความจริงเป็นจริงเสมอ`, c: [R`$p\wedge q$`, R`$q\to r$`, R`$\sim p\vee q$`, R`$p\leftrightarrow q$`], a: 1,
      sol: { idea: R`$p\to q$ เท็จได้กรณีเดียว: $p$ จริง และ $q$ เท็จ`, steps: [R`ก. $T\wedge F$ เป็นเท็จ`, R`ข. $q$ เท็จ ทำให้ $q\to r$ เป็นจริงเสมอไม่ว่า $r$ เป็นอะไร ✓`, R`ค. $F\vee F$ เป็นเท็จ`, R`ง. $T\leftrightarrow F$ เป็นเท็จ`] } },
    { q: R`สำหรับเซต $A$ และ $B$ ใด ๆ เซต $A-(A-B)$ เท่ากับข้อใด`, c: [R`$A\cap B$`, R`$A\cup B$`, R`$B-A$`, R`$\varnothing$`], a: 0,
      sol: { idea: R`$X-Y=X\cap Y'$`, steps: [R`$A-(A-B)=A\cap(A\cap B')'=A\cap(A'\cup B)$`, R`$=(A\cap A')\cup(A\cap B)=A\cap B$`], check: R`ตัวอย่าง $A=\{1,2,3\},\ B=\{2,3,4\}$: $A-B=\{1\}$, $A-\{1\}=\{2,3\}=A\cap B$ ✓` } },
    { q: R`จำนวนเต็มที่สอดคล้องกับอสมการ $|2x-5|\le3$ มีกี่จำนวน`, c: ['3', '4', '5', '7'], a: 1,
      sol: { idea: R`$|u|\le a \iff -a\le u\le a$`, steps: [R`$-3\le2x-5\le3 \Rightarrow 2\le2x\le8 \Rightarrow 1\le x\le4$`, R`จำนวนเต็ม $1,2,3,4$ รวม 4 จำนวน`] } },
    { q: R`โดเมนของฟังก์ชัน $f(x)=\dfrac{\sqrt{4-x^2}}{x-1}$ คือข้อใด`, c: [R`$[-2,2]$`, R`$(-2,2)$`, R`$[-2,1)\cup(1,2]$`, R`$(-\infty,-2]\cup[2,\infty)$`], a: 2,
      sol: { idea: 'ในรากต้องไม่ติดลบ และตัวส่วนต้องไม่เป็นศูนย์', steps: [R`$4-x^2\ge0 \Rightarrow -2\le x\le2$`, R`$x-1\ne0 \Rightarrow x\ne1$`, R`โดเมน $=[-2,1)\cup(1,2]$`] } },
    { q: R`ถ้า $\log2=a$ และ $\log3=b$ แล้ว $\log72$ เท่ากับข้อใด`, c: [R`$2a+3b$`, R`$6ab$`, R`$3a+2b$`, R`$a^3b^2$`], a: 2,
      sol: { idea: 'แยกตัวประกอบเฉพาะของ 72', steps: [R`$72=2^3\cdot3^2$`, R`$\log72=3\log2+2\log3=3a+2b$`] } },
    { q: R`ระยะห่างระหว่างโฟกัสทั้งสองของวงรี $\dfrac{x^2}{16}+\dfrac{y^2}{9}=1$ เท่ากับข้อใด`, c: [R`$2\sqrt7$`, '7', '8', '10'], a: 0,
      sol: { idea: R`วงรี $\frac{x^2}{a^2}+\frac{y^2}{b^2}=1$ ($a>b$) มี $c^2=a^2-b^2$ โฟกัสอยู่ที่ $(\pm c,0)$`, steps: [R`$c^2=16-9=7 \Rightarrow c=\sqrt7$`, R`ระยะระหว่างโฟกัส $=2c=2\sqrt7$`], warn: R`ไม่ใช่ $c^2=a^2+b^2$ ซึ่งใช้กับไฮเพอร์โบลา` } },
    { q: R`สามเหลี่ยม $ABC$ มี $a=10$ หน่วย มุม $A=30^\circ$ และมุม $B=45^\circ$ ความยาวด้าน $b$ เท่ากับข้อใด`, c: [R`$5\sqrt2$`, '10', R`$10\sqrt3$`, R`$10\sqrt2$`], a: 3,
      sol: { idea: R`กฎของไซน์ $\frac{a}{\sin A}=\frac{b}{\sin B}$`, steps: [R`$b=\frac{a\sin B}{\sin A}=\frac{10\cdot\frac{\sqrt2}{2}}{\frac12}=10\sqrt2$`] } },
    { q: R`ค่าของ $\left(1+\sqrt3\,i\right)^6$ เท่ากับข้อใด`, c: [R`$-64$`, R`$-64i$`, R`$64i$`, '64'], a: 3,
      sol: { idea: 'เขียนในรูปเชิงขั้วแล้วใช้ทฤษฎีบทของเดอมัวฟร์', steps: [R`$1+\sqrt3\,i=2(\cos60^\circ+i\sin60^\circ)$`, R`$(1+\sqrt3\,i)^6=2^6(\cos360^\circ+i\sin360^\circ)=64$`] } },
    { q: R`ให้ $A$ เป็นเมทริกซ์มิติ $3\times3$ ที่ $\det A=2$ ค่าของ $\det(2A^{t})$ เท่ากับข้อใด เมื่อ $A^t$ คือเมทริกซ์สลับเปลี่ยนของ $A$`, c: ['4', '8', '16', '32'], a: 2,
      sol: { idea: R`$\det(A^t)=\det A$ และ $\det(kA)=k^n\det A$ สำหรับเมทริกซ์มิติ $n\times n$`, steps: [R`$\det(2A^t)=2^3\det A^t=8\cdot2=16$`], warn: R`ตัวเลือก 4 มาจากการคิด $2\det A$ ซึ่งผิด` } },
    { q: R`ข้อมูล $2,\,5,\,7,\,8,\,10,\,12,\,15$ มีควอร์ไทล์ที่ 1 เท่ากับข้อใด`, c: ['5', '6', '7', '8'], a: 0,
      sol: { idea: R`ตำแหน่งของ $Q_r$ คือ $\frac{r(N+1)}{4}$ เมื่อเรียงข้อมูลจากน้อยไปมาก`, steps: [R`$N=7$: ตำแหน่ง $Q_1=\frac{1(8)}{4}=2$`, R`ข้อมูลตัวที่ 2 คือ 5`] } },
  ],
  fill: [
    { q: R`$1+2+4+8+\dots+512$ มีค่าเท่าใด`, a: '1023', sol: { idea: 'อนุกรมเรขาคณิต $a_1=1,\\ r=2$ ถึงพจน์ $2^9$ (10 พจน์)', steps: [R`$S_{10}=\frac{2^{10}-1}{2-1}=1023$`] } },
    { q: R`$\sqrt[3]{2+\sqrt5}+\sqrt[3]{2-\sqrt5}$ มีค่าเท่าใด`, a: '1', sol: { idea: R`ให้ $x$ เท่ากับผลบวก แล้วยกกำลังสามโดยใช้ $(a+b)^3=a^3+b^3+3ab(a+b)$`, steps: [R`$a^3+b^3=4$ และ $ab=\sqrt[3]{(2+\sqrt5)(2-\sqrt5)}=\sqrt[3]{-1}=-1$`, R`$x^3=4+3(-1)x \Rightarrow x^3+3x-4=0 \Rightarrow (x-1)(x^2+x+4)=0$`, R`$x^2+x+4=0$ ไม่มีรากจริง จึงได้ $x=1$`] } },
    { q: R`$25^{\log_5 3}$ มีค่าเท่าใด`, a: '9', sol: { idea: R`$a^{\log_a b}=b$`, steps: [R`$25^{\log_53}=(5^2)^{\log_53}=\left(5^{\log_53}\right)^2=3^2=9$`] } },
    { q: R`$\log_2\!\big(\log_3(\log_4 64)\big)$ มีค่าเท่าใด`, a: '0', sol: { idea: 'คำนวณจากด้านในออกมา', steps: [R`$\log_4 64=3$, $\log_3 3=1$, $\log_2 1=0$`] } },
    { q: R`คำตอบของสมการ $\sqrt{x+5}=x-1$ คือจำนวนใด`, a: '4', sol: { idea: 'ยกกำลังสองแล้วต้องตรวจคำตอบกับสมการเดิม', steps: [R`$x+5=x^2-2x+1 \Rightarrow x^2-3x-4=0 \Rightarrow x=4$ หรือ $x=-1$`, R`ตรวจ $x=-1$: $\sqrt4=2\ne-2$ ใช้ไม่ได้, $x=4$: $\sqrt9=3$ ✓`], warn: 'การยกกำลังสองอาจเพิ่มคำตอบเกินมา ต้องตรวจทุกครั้ง' } },
    { q: R`ถ้า $f(x+1)=x^2+3x$ สำหรับทุกจำนวนจริง $x$ แล้ว $f(4)$ มีค่าเท่าใด`, a: '18', sol: { idea: R`เลือก $x$ ที่ทำให้ $x+1=4$`, steps: [R`$x=3$: $f(4)=9+9=18$`] } },
    { q: R`ผลบวกของสัมประสิทธิ์ทุกพจน์ในการกระจาย $(3x-2)^7$ เท่ากับเท่าใด`, a: '1', sol: { idea: 'แทน $x=1$ จะได้ผลบวกสัมประสิทธิ์ทั้งหมด', steps: [R`$(3-2)^7=1$`] } },
    { q: R`ถ้า $x^2+x+1=0$ แล้ว $x^{2026}+x^{2027}+x^{2028}$ มีค่าเท่าใด`, a: '0', sol: { idea: 'ดึงตัวร่วม $x^{2026}$ ออก', steps: [R`$=x^{2026}(1+x+x^2)=x^{2026}\cdot0=0$`] } },
    { q: R`ถ้า $A=\begin{bmatrix}1&1\\0&1\end{bmatrix}$ ผลบวกของสมาชิกทุกตัวของ $A^{10}$ เท่ากับเท่าใด`, a: '12', sol: { idea: 'คำนวณ $A^2, A^3$ เพื่อหาแบบรูป', steps: [R`$A^2=\begin{bmatrix}1&2\\0&1\end{bmatrix},\ A^3=\begin{bmatrix}1&3\\0&1\end{bmatrix}$ จึงได้ $A^n=\begin{bmatrix}1&n\\0&1\end{bmatrix}$`, R`$A^{10}$ มีผลบวกสมาชิก $1+10+0+1=12$`] } },
    { q: R`ถ้า $|\vec u|=2,\ |\vec v|=3$ และมุมระหว่าง $\vec u$ กับ $\vec v$ เท่ากับ $60^\circ$ แล้ว $|2\vec u+\vec v|$ มีค่าเท่าใด`, a: R`$\sqrt{37}$`, k: R`\sqrt{37}`, sol: { idea: R`$|\vec a|^2=\vec a\cdot\vec a$ และ $\vec u\cdot\vec v=|\vec u||\vec v|\cos\theta$`, steps: [R`$\vec u\cdot\vec v=2\cdot3\cdot\frac12=3$`, R`$|2\vec u+\vec v|^2=4(4)+9+4(3)=37$`, R`$|2\vec u+\vec v|=\sqrt{37}$`] } },
    { q: R`ถ้า $z$ เป็นจำนวนเชิงซ้อนที่ $z+2\bar z=3-4i$ แล้ว $|z|$ มีค่าเท่าใด`, a: R`$\sqrt{17}$`, k: R`\sqrt{17}`, sol: { idea: R`ให้ $z=a+bi$ แล้วเทียบส่วนจริงและส่วนจินตภาพ`, steps: [R`$z+2\bar z=(a+bi)+2(a-bi)=3a-bi$`, R`$3a=3,\ -b=-4 \Rightarrow a=1,\ b=4$`, R`$|z|=\sqrt{1+16}=\sqrt{17}$`] } },
    { q: R`$\sin75^\circ\sin15^\circ$ มีค่าเท่าใด`, a: R`$\frac14$`, k: R`\frac14`, sol: { idea: R`$2\sin A\sin B=\cos(A-B)-\cos(A+B)$`, steps: [R`$\sin75^\circ\sin15^\circ=\frac12\big(\cos60^\circ-\cos90^\circ\big)=\frac12\cdot\frac12=\frac14$`] } },
    { q: R`$\tan75^\circ-\tan15^\circ$ มีค่าเท่าใด`, a: R`$2\sqrt3$`, k: R`2\sqrt3`, sol: { idea: R`$\tan(45^\circ\pm30^\circ)$`, steps: [R`$\tan75^\circ=2+\sqrt3,\ \tan15^\circ=2-\sqrt3$`, R`ผลต่าง $=2\sqrt3$`] } },
    { q: R`สมการ $2\sin^2x-3\sin x+1=0$ เมื่อ $0\le x<2\pi$ มีคำตอบกี่คำตอบ`, a: '3', sol: { idea: R`แยกตัวประกอบในรูป $\sin x$`, steps: [R`$(2\sin x-1)(\sin x-1)=0$`, R`$\sin x=\frac12$: $x=\frac\pi6,\frac{5\pi}6$ (2 คำตอบ)`, R`$\sin x=1$: $x=\frac\pi2$ (1 คำตอบ) รวม 3 คำตอบ`] } },
    { q: 'เลือกคณะกรรมการ 3 คนจากชาย 5 คน และหญิง 4 คน โดยต้องมีหญิงอย่างน้อย 1 คน ได้ทั้งหมดกี่วิธี', a: '74', sol: { idea: 'คำว่า "อย่างน้อย" ใช้ส่วนเติมเต็ม: ทั้งหมด − ไม่มีหญิงเลย', steps: [R`ทั้งหมด $\binom93=84$, ชายล้วน $\binom53=10$`, R`$84-10=74$`] } },
    { q: 'จัดคน 6 คนนั่งรอบโต๊ะกลมได้ทั้งหมดกี่วิธี', a: '120', sol: { idea: R`เรียงสับเปลี่ยนเชิงวงกลม $(n-1)!$`, steps: [R`$(6-1)!=5!=120$`] } },
    { q: R`$\displaystyle\lim_{n\to\infty}\frac{2n+1}{3n-1}$ มีค่าเท่าใด`, a: R`$\frac23$`, k: R`\frac23`, sol: { idea: R`หารทั้งเศษและส่วนด้วย $n$`, steps: [R`$=\lim\frac{2+\frac1n}{3-\frac1n}=\frac23$`] } },
    { q: R`$1\cdot2+2\cdot3+3\cdot4+\dots+10\cdot11$ มีค่าเท่าใด`, a: '440', sol: { idea: R`$\sum k(k+1)=\sum k^2+\sum k$`, steps: [R`$\sum_{k=1}^{10}k^2=385,\ \sum_{k=1}^{10}k=55$`, R`ผลรวม $=440$`] } },
    { q: R`$\displaystyle\lim_{x\to3}\frac{x^3-27}{x-3}$ มีค่าเท่าใด`, a: '27', sol: { idea: R`$a^3-b^3=(a-b)(a^2+ab+b^2)$`, steps: [R`$=\lim_{x\to3}(x^2+3x+9)=9+9+9=27$`] } },
    { q: R`ค่าต่ำสุดสัมพัทธ์ของ $f(x)=2x^3-9x^2+12x$ เท่ากับเท่าใด`, a: '4', sol: { idea: R`หาจุดวิกฤตแล้วตรวจด้วย $f''$`, steps: [R`$f'(x)=6x^2-18x+12=6(x-1)(x-2)$`, R`$f''(x)=12x-18$: $f''(2)=6>0$ ต่ำสุดสัมพัทธ์ที่ $x=2$`, R`$f(2)=16-36+24=4$`] } },
  ],
  prob: [
    { q: R`จำนวนกรณีของค่าความจริงของ $p,\ q,\ r$ (จากทั้งหมด 8 กรณี) ที่ทำให้ประพจน์ $(p\to q)\wedge(q\to r)$ เป็นจริง มีกี่กรณี`, a: '4',
      sol: { idea: 'ประพจน์ "และ" เป็นจริงเมื่อทั้งสองส่วนจริง นับอย่างเป็นระบบตามค่าของ $q$', steps: [R`กรณี $q$ จริง: $p\to q$ จริงเสมอ ($p$ ได้ 2 แบบ) ต้องให้ $q\to r$ จริง จึง $r$ จริง: 2 กรณี`, R`กรณี $q$ เท็จ: $q\to r$ จริงเสมอ ($r$ ได้ 2 แบบ) ต้องให้ $p\to q$ จริง จึง $p$ เท็จ: 2 กรณี`, 'รวม 4 กรณี'], check: 'กรณีที่เป็นจริง: (T,T,T), (F,T,T), (F,F,T), (F,F,F) ✓' } },
    { q: R`จำนวนเต็ม $x$ ที่สอดคล้องกับอสมการ $(x^2-1)(x^2-16)\le0$ มีกี่จำนวน`, a: '8',
      sol: { idea: R`ให้ $t=x^2\ge0$ แก้อสมการในรูป $t$ ก่อน`, steps: [R`$(t-1)(t-16)\le0 \Rightarrow 1\le t\le16$`, R`$1\le x^2\le16 \Rightarrow 1\le|x|\le4$`, R`จำนวนเต็ม $\pm1,\pm2,\pm3,\pm4$ รวม 8 จำนวน`], warn: R`$x=0$ ไม่อยู่ในคำตอบ เพราะ $(0-1)(0-16)=16>0$` } },
    { q: 'แบคทีเรียชนิดหนึ่งเพิ่มจำนวนเป็นสองเท่าทุก 3 ชั่วโมง ถ้าเริ่มต้นมี 500 ตัว อีกกี่ชั่วโมงจึงจะมี 32,000 ตัว', a: '18',
      sol: { idea: R`จำนวนเมื่อเวลา $t$ ชั่วโมง $N(t)=500\cdot2^{t/3}$`, steps: [R`$500\cdot2^{t/3}=32000 \Rightarrow 2^{t/3}=64=2^6$`, R`$\frac t3=6 \Rightarrow t=18$ ชั่วโมง`] } },
    { q: R`ให้ $F_1(-5,0)$ และ $F_2(5,0)$ เป็นโฟกัสของไฮเพอร์โบลา $\dfrac{x^2}{9}-\dfrac{y^2}{16}=1$ ถ้าจุด $P$ อยู่บนกิ่งขวาของไฮเพอร์โบลา และ $PF_1=10$ หน่วย แล้ว $PF_2$ ยาวกี่หน่วย`, a: '4',
      sol: { idea: R`จุดบนไฮเพอร์โบลามี $|PF_1-PF_2|=2a$`, steps: [R`$a^2=9 \Rightarrow 2a=6$ (ตรวจ $c^2=9+16=25$ ตรงกับโฟกัส $\pm5$)`, R`กิ่งขวาอยู่ใกล้ $F_2$ จึงได้ $PF_1-PF_2=6$`, R`$PF_2=10-6=4$`], check: R`จุดยอดขวา $(3,0)$ มี $PF_2\ge5-3=2$ ค่า 4 จึงเป็นไปได้ ✓` } },
    { q: 'สามเหลี่ยมรูปหนึ่งมีด้านยาว 3, 5 และ 7 หน่วย พื้นที่ของสามเหลี่ยมรูปนี้เท่ากับกี่ตารางหน่วย', a: R`$\frac{15\sqrt3}{4}$`, k: R`\frac{15\sqrt3}{4}`,
      sol: { idea: R`หามุมด้วยกฎของโคไซน์ แล้วใช้ พื้นที่ $=\frac12bc\sin A$`, steps: [R`มุม $A$ ตรงข้ามด้าน 7: $\cos A=\frac{5^2+3^2-7^2}{2(5)(3)}=\frac{-15}{30}=-\frac12$ ได้ $A=120^\circ$`, R`พื้นที่ $=\frac12(5)(3)\sin120^\circ=\frac{15}{2}\cdot\frac{\sqrt3}{2}=\frac{15\sqrt3}{4}$`], check: R`สูตรเฮรอน: $s=\frac{15}2$, พื้นที่ $=\sqrt{\frac{15}2\cdot\frac92\cdot\frac52\cdot\frac12}=\frac{\sqrt{675}}4=\frac{15\sqrt3}4$ ✓` } },
    { q: R`พื้นที่ของสามเหลี่ยมที่มีจุดยอด $A(1,0,0),\ B(0,2,0)$ และ $C(0,0,3)$ เท่ากับกี่ตารางหน่วย`, a: R`$\frac72$`, k: R`\frac72`,
      sol: { idea: R`พื้นที่สามเหลี่ยม $=\frac12|\overrightarrow{AB}\times\overrightarrow{AC}|$`, steps: [R`$\overrightarrow{AB}=(-1,2,0),\ \overrightarrow{AC}=(-1,0,3)$`, R`$\overrightarrow{AB}\times\overrightarrow{AC}=(6,\,3,\,2)$`, R`$|(6,3,2)|=\sqrt{36+9+4}=7$ พื้นที่ $=\frac72$`] } },
    { q: 'กล่องใบที่หนึ่งมีลูกบอลสีแดง 3 ลูก สีขาว 2 ลูก กล่องใบที่สองมีสีแดง 1 ลูก สีขาว 4 ลูก สุ่มหยิบลูกบอล 1 ลูกจากกล่องใบที่หนึ่งใส่ลงในกล่องใบที่สอง แล้วสุ่มหยิบลูกบอล 1 ลูกจากกล่องใบที่สอง ความน่าจะเป็นที่จะได้ลูกบอลสีแดงเท่ากับเท่าใด', a: R`$\frac{4}{15}$`, k: R`\frac{4}{15}`,
      sol: { idea: 'แยกกรณีตามสีของลูกที่ย้ายไป แล้วรวมความน่าจะเป็นของแต่ละกรณี', steps: [R`ย้ายแดง (โอกาส $\frac35$): กล่องสองมีแดง 2 จาก 6 ลูก ได้แดง $\frac26$`, R`ย้ายขาว (โอกาส $\frac25$): กล่องสองมีแดง 1 จาก 6 ลูก ได้แดง $\frac16$`, R`ความน่าจะเป็น $=\frac35\cdot\frac26+\frac25\cdot\frac16=\frac{6+2}{30}=\frac4{15}$`] } },
    { q: 'ออมเงินวันแรก 10 บาท และวันต่อ ๆ ไปออมเพิ่มขึ้นวันละ 5 บาท (วันที่สองออม 15 บาท วันที่สามออม 20 บาท ...) เงินออมสะสมจะเกิน 2,000 บาทครั้งแรกในวันที่เท่าใด', a: '27',
      sol: { idea: R`เงินสะสมคืออนุกรมเลขคณิต $S_n=\frac n2\big[2(10)+(n-1)5\big]$`, steps: [R`$S_n=\frac{n(5n+15)}{2}>2000 \Rightarrow n^2+3n>800$`, R`$n=26$: $676+78=754$ ยังไม่เกิน`, R`$n=27$: $729+81=810>800$ เกินแล้ว`, 'ตอบวันที่ 27'], check: R`$S_{26}=1885,\ S_{27}=2025$ ✓` } },
    { q: R`เส้นตรงสองเส้นผ่านจุดกำเนิด และสัมผัสเส้นโค้ง $y=x^2+1$ ผลคูณของความชันของเส้นสัมผัสทั้งสองเท่ากับเท่าใด`, a: R`$-4$`, k: '-4',
      sol: { idea: R`ให้จุดสัมผัสเป็น $(a,a^2+1)$ ความชันที่จุดนั้นคือ $2a$ แล้วบังคับให้เส้นผ่านจุดกำเนิด`, steps: [R`เส้นสัมผัส: $y-(a^2+1)=2a(x-a)$`, R`ผ่าน $(0,0)$: $-(a^2+1)=-2a^2 \Rightarrow a^2=1 \Rightarrow a=\pm1$`, R`ความชัน $2a=2$ และ $-2$ ผลคูณ $=-4$`] } },
    { q: 'คะแนนสอบของนักเรียนกลุ่มหนึ่งมีการแจกแจงปกติ ค่าเฉลี่ย 50 คะแนน ส่วนเบี่ยงเบนมาตรฐาน 10 คะแนน กำหนดพื้นที่ใต้เส้นโค้งปกติมาตรฐาน: พื้นที่จาก $Z=0$ ถึง $Z=1$ เท่ากับ $0.3413$ และจาก $Z=0$ ถึง $Z=2$ เท่ากับ $0.4772$ นักเรียนที่ได้คะแนนระหว่าง 40 ถึง 70 คะแนน คิดเป็นร้อยละเท่าใด', a: '81.85',
      sol: { idea: R`เปลี่ยนคะแนนเป็นค่ามาตรฐาน $z=\frac{x-\mu}{\sigma}$ แล้วใช้ความสมมาตรของเส้นโค้งปกติ`, steps: [R`$x=40 \Rightarrow z=-1$ และ $x=70 \Rightarrow z=2$`, R`พื้นที่จาก $-1$ ถึง $0$ เท่ากับพื้นที่จาก $0$ ถึง $1$ คือ $0.3413$`, R`พื้นที่รวม $=0.3413+0.4772=0.8185$ คิดเป็นร้อยละ 81.85`] } },
  ],
});
})();


/* ชุดที่ 4–5 */
(function () {
const R = String.raw;
GENIUS_SETS.push({
  no: 4,
  mc: [
    { q: R`นิเสธของประพจน์ $\forall x\,[P(x)\to Q(x)]$ คือข้อใด`, c: [R`$\forall x\,[P(x)\wedge\sim Q(x)]$`, R`$\exists x\,[\sim P(x)\wedge Q(x)]$`, R`$\exists x\,[P(x)\wedge\sim Q(x)]$`, R`$\exists x\,[P(x)\to\sim Q(x)]$`], a: 2,
      sol: { idea: R`$\sim\forall x\,[A(x)]\equiv\exists x\,[\sim A(x)]$ และ $\sim(p\to q)\equiv p\wedge\sim q$`, steps: [R`$\sim\forall x\,[P(x)\to Q(x)]\equiv\exists x\,[\sim(P(x)\to Q(x))]\equiv\exists x\,[P(x)\wedge\sim Q(x)]$`], warn: R`ตัวเลือก ก. ลืมเปลี่ยน $\forall$ เป็น $\exists$` } },
    { q: R`ถ้า $n(A)=10$ และ $n(B)=8$ ค่าที่น้อยที่สุดที่เป็นไปได้ของ $n(A\cup B)$ เท่ากับข้อใด`, c: ['2', '8', '10', '18'], a: 2,
      sol: { idea: R`$n(A\cup B)=18-n(A\cap B)$ จะน้อยที่สุดเมื่อ $n(A\cap B)$ มากที่สุด`, steps: [R`$n(A\cap B)\le\min(10,8)=8$ (เกิดเมื่อ $B\subset A$)`, R`$n(A\cup B)$ น้อยสุด $=18-8=10$`] } },
    { q: R`ถ้า $a>b>0$ ข้อใดถูกต้องเสมอ`, c: [R`$\frac1a<\frac1b$`, R`$a^2<b^2$`, R`$-a>-b$`, R`$a-b<0$`], a: 0,
      sol: { idea: 'คุณสมบัติการไม่เท่ากัน: คูณด้วยจำนวนบวกเครื่องหมายคงเดิม คูณด้วยจำนวนลบเครื่องหมายกลับ', steps: [R`หาร $a>b$ ด้วย $ab>0$ ได้ $\frac1b>\frac1a$ ✓`, R`ข. ผิด เพราะ $a>b>0$ ทำให้ $a^2>b^2$`, R`ค. ผิด คูณ $-1$ ต้องกลับเครื่องหมายเป็น $-a<-b$`, R`ง. ผิด เพราะ $a-b>0$`] } },
    { q: R`เรนจ์ของฟังก์ชัน $f(x)=x^2-4x+7$ คือข้อใด`, c: [R`$[2,\infty)$`, R`$[3,\infty)$`, R`$[7,\infty)$`, R`$\mathbb R$`], a: 1,
      sol: { idea: 'จัดรูปกำลังสองสมบูรณ์หาจุดต่ำสุด', steps: [R`$f(x)=(x-2)^2+3\ge3$`, R`ค่าต่ำสุด 3 ที่ $x=2$ เรนจ์คือ $[3,\infty)$`], warn: R`7 คือค่าของ $f(0)$ ไม่ใช่ค่าต่ำสุด` } },
    { q: R`ถ้า $3^x=5$ แล้ว $9^{x+1}$ มีค่าเท่าใด`, c: ['75', '81', '125', '225'], a: 3,
      sol: { idea: R`เขียน $9^{x+1}$ ในรูป $3^x$`, steps: [R`$9^{x+1}=9\cdot9^x=9\cdot(3^x)^2=9\cdot25=225$`] } },
    { q: R`ระยะห่างระหว่างโฟกัสกับไดเรกทริกซ์ของพาราโบลา $(x-1)^2=8(y+3)$ เท่ากับข้อใด`, c: ['2', '4', '6', '8'], a: 1,
      sol: { idea: R`พาราโบลา $(x-h)^2=4c(y-k)$ มีโฟกัสห่างจุดยอด $c$ และไดเรกทริกซ์ห่างจุดยอด $c$ ในทิศตรงข้าม`, steps: [R`$4c=8 \Rightarrow c=2$`, R`ระยะโฟกัสถึงไดเรกทริกซ์ $=2c=4$`], warn: R`ค่า 8 คือ $4c$ ไม่ใช่ระยะทาง` } },
    { q: R`$\dfrac{1-\cos2x}{\sin2x}$ เท่ากับข้อใด (เมื่อตัวส่วนไม่เป็นศูนย์)`, c: [R`$\sin x$`, R`$\cos x$`, R`$\tan x$`, R`$\cot x$`], a: 2,
      sol: { idea: R`$1-\cos2x=2\sin^2x$ และ $\sin2x=2\sin x\cos x$`, steps: [R`$\frac{2\sin^2x}{2\sin x\cos x}=\frac{\sin x}{\cos x}=\tan x$`] } },
    { q: R`ถ้า $z$ เป็นรากหนึ่งของสมการ $x^2-4x+13=0$ แล้ว $|z|$ เท่ากับข้อใด`, c: ['2', '3', R`$2\sqrt3$`, R`$\sqrt{13}$`], a: 3,
      sol: { idea: R`รากทั้งสองเป็นสังยุคกัน จึงมี $|z|^2=z\bar z=$ ผลคูณราก`, steps: [R`ผลคูณราก $=13$ จึงได้ $|z|^2=13 \Rightarrow |z|=\sqrt{13}$`], check: R`รากคือ $2\pm3i$, $|2+3i|=\sqrt{4+9}=\sqrt{13}$ ✓` } },
    { q: R`ถ้าเมทริกซ์ $A=\begin{bmatrix}a&2\\3&a\end{bmatrix}$ ไม่มีตัวผกผันการคูณ แล้ว $a^2$ มีค่าเท่าใด`, c: ['6', '8', '9', '12'], a: 0,
      sol: { idea: R`เมทริกซ์ไม่มีตัวผกผันเมื่อ $\det A=0$`, steps: [R`$\det A=a^2-6=0 \Rightarrow a^2=6$`] } },
    { q: 'สุ่มเลือกจำนวนเต็ม 1 จำนวนจาก 1 ถึง 50 ความน่าจะเป็นที่จำนวนนั้นหารด้วย 4 หรือ 6 ลงตัวเท่ากับข้อใด', c: [R`$\frac{7}{25}$`, R`$\frac{8}{25}$`, R`$\frac{9}{25}$`, R`$\frac25$`], a: 1,
      sol: { idea: 'หลักการเพิ่มเข้า–ตัดออก ตัวที่หารด้วยทั้ง 4 และ 6 ลงตัวคือพหุคูณของ 12 (ค.ร.น.)', steps: [R`หารด้วย 4 ลงตัว 12 จำนวน, หารด้วย 6 ลงตัว 8 จำนวน, หารด้วย 12 ลงตัว 4 จำนวน`, R`จำนวนที่ต้องการ $=12+8-4=16$`, R`ความน่าจะเป็น $=\frac{16}{50}=\frac{8}{25}$`], warn: R`พหุคูณร่วมของ 4 และ 6 คือ 12 ไม่ใช่ 24` } },
  ],
  fill: [
    { q: R`$\dfrac{1}{\sqrt2+1}+\dfrac{1}{\sqrt3+\sqrt2}+\dots+\dfrac{1}{\sqrt{100}+\sqrt{99}}$ มีค่าเท่าใด`, a: '9', sol: { idea: R`ทำตัวส่วนเป็นจำนวนตรรกยะ: $\frac{1}{\sqrt{k+1}+\sqrt k}=\sqrt{k+1}-\sqrt k$`, steps: [R`ผลรวม $=(\sqrt2-1)+(\sqrt3-\sqrt2)+\dots+(\sqrt{100}-\sqrt{99})$`, R`$=\sqrt{100}-1=9$`] } },
    { q: R`$(0.25)^{-\frac32}$ มีค่าเท่าใด`, a: '8', sol: { idea: R`$0.25=\frac14=2^{-2}$`, steps: [R`$(2^{-2})^{-\frac32}=2^3=8$`] } },
    { q: R`$\log_5 0.04$ มีค่าเท่าใด`, a: R`$-2$`, k: '-2', sol: { idea: R`$0.04=\frac{1}{25}=5^{-2}$`, steps: [R`$\log_5 5^{-2}=-2$`] } },
    { q: R`$\log_2 6\cdot\log_6 32$ มีค่าเท่าใด`, a: '5', sol: { idea: R`$\log_a b\cdot\log_b c=\log_a c$`, steps: [R`$=\log_2 32=5$`] } },
    { q: R`คำตอบของสมการ $\log_3(x+1)+\log_3(x-1)=1$ คือจำนวนใด`, a: '2', sol: { idea: R`รวมลอการิทึมเป็นผลคูณ แล้วตรวจว่าค่าในลอการิทึมเป็นบวก`, steps: [R`$\log_3\big((x+1)(x-1)\big)=1 \Rightarrow x^2-1=3 \Rightarrow x=\pm2$`, R`ต้องมี $x-1>0$ จึงได้ $x=2$`], warn: R`$x=-2$ ทำให้ $\log_3(-1)$ ไม่นิยาม` } },
    { q: R`ค่าที่น้อยที่สุดของ $|x+2|+|x-4|$ เมื่อ $x$ เป็นจำนวนจริงใด ๆ เท่ากับเท่าใด`, a: '6', sol: { idea: R`$|x+2|+|x-4|$ คือผลบวกระยะทางจาก $x$ ไปยังจุด $-2$ และ 4 บนเส้นจำนวน`, steps: [R`ถ้า $x$ อยู่ระหว่าง $-2$ กับ 4 ผลบวกระยะทาง $=4-(-2)=6$`, R`ถ้า $x$ อยู่นอกช่วงนี้ ผลบวกจะมากกว่า 6 จึงได้ค่าน้อยที่สุด 6`] } },
    { q: R`ถ้า $f(x)=2x+1$ แล้ว $f^{-1}\big(f^{-1}(15)\big)$ มีค่าเท่าใด`, a: '3', sol: { idea: R`$f^{-1}(x)=\frac{x-1}{2}$`, steps: [R`$f^{-1}(15)=7$`, R`$f^{-1}(7)=3$`] } },
    { q: R`ถ้า $3x^3+ax^2+bx-2$ หารด้วย $x^2-1$ ลงตัว แล้ว $ab$ มีค่าเท่าใด`, a: R`$-6$`, k: '-6', sol: { idea: R`$x^2-1=(x-1)(x+1)$ จึงต้องมี $p(1)=0$ และ $p(-1)=0$`, steps: [R`$p(1)=3+a+b-2=0 \Rightarrow a+b=-1$`, R`$p(-1)=-3+a-b-2=0 \Rightarrow a-b=5$`, R`$a=2,\ b=-3$ ดังนั้น $ab=-6$`] } },
    { q: R`$\det\begin{bmatrix}2&0&0\\1&3&0\\4&5&-1\end{bmatrix}$ มีค่าเท่าใด`, a: R`$-6$`, k: '-6', sol: { idea: 'เมทริกซ์สามเหลี่ยมล่าง ดีเทอร์มิแนนต์เท่ากับผลคูณสมาชิกในแนวทแยงหลัก', steps: [R`$=2\cdot3\cdot(-1)=-6$`] } },
    { q: R`ถ้า $A=\begin{bmatrix}1&2\\3&4\end{bmatrix}$ และ $B=\begin{bmatrix}0&1\\1&0\end{bmatrix}$ ผลบวกของสมาชิกในแนวทแยงหลักของ $AB$ เท่ากับเท่าใด`, a: '5', sol: { idea: 'การคูณด้วย $B$ ทางขวาคือการสลับหลักของ $A$', steps: [R`$AB=\begin{bmatrix}2&1\\4&3\end{bmatrix}$`, R`ผลบวกแนวทแยงหลัก $=2+3=5$`] } },
    { q: R`จำนวนเชิงซ้อน $z$ สอดคล้องกับ $|z-1|=|z+1|$ และ $|z|=3$ ผลคูณของค่า $z$ ทั้งหมดเท่ากับเท่าใด`, a: '9', sol: { idea: R`$|z-1|=|z+1|$ คือจุดที่ห่างจาก 1 และ $-1$ เท่ากัน ซึ่งอยู่บนแกนจินตภาพ`, steps: [R`$z=bi$ และ $|z|=3 \Rightarrow z=3i$ หรือ $z=-3i$`, R`ผลคูณ $=(3i)(-3i)=-9i^2=9$`] } },
    { q: R`ถ้า $\sin^2x=\frac13$ แล้ว $\cos2x$ มีค่าเท่าใด`, a: R`$\frac13$`, k: R`\frac13`, sol: { idea: R`$\cos2x=1-2\sin^2x$`, steps: [R`$=1-\frac23=\frac13$`] } },
    { q: R`$\cos75^\circ+\cos15^\circ$ มีค่าเท่าใด`, a: R`$\frac{\sqrt6}{2}$`, k: R`\frac{\sqrt6}{2}`, sol: { idea: R`$\cos A+\cos B=2\cos\frac{A+B}2\cos\frac{A-B}2$`, steps: [R`$=2\cos45^\circ\cos30^\circ=2\cdot\frac{\sqrt2}{2}\cdot\frac{\sqrt3}{2}=\frac{\sqrt6}{2}$`] } },
    { q: R`$\arctan1+\arctan2+\arctan3$ มีค่ากี่องศา`, a: '180', sol: { idea: R`ใช้ $\tan(A+B)=\frac{\tan A+\tan B}{1-\tan A\tan B}$`, steps: [R`$\tan(\arctan2+\arctan3)=\frac{2+3}{1-6}=-1$ และ $\arctan2+\arctan3$ อยู่ระหว่าง $90^\circ$ กับ $180^\circ$ จึงเท่ากับ $135^\circ$`, R`รวมกับ $\arctan1=45^\circ$ ได้ $180^\circ$`] } },
    { q: 'รูปแปดเหลี่ยมนูนที่ไม่มีเส้นทแยงมุมสามเส้นใดตัดกันที่จุดเดียวกัน เส้นทแยงมุมตัดกันภายในรูปทั้งหมดกี่จุด', a: '70', sol: { idea: 'จุดตัดภายในหนึ่งจุดเกิดจากเส้นทแยงมุมของสี่เหลี่ยมที่สร้างจากจุดยอด 4 จุด', steps: [R`เลือกจุดยอด 4 จุดได้ 1 จุดตัด จำนวนจุดตัด $=\binom84=70$`] } },
    { q: R`$\binom{10}{0}+\binom{10}{1}+\binom{10}{2}+\dots+\binom{10}{10}$ มีค่าเท่าใด`, a: '1024', sol: { idea: R`แทน $x=1$ ในทฤษฎีบททวินาม $(1+x)^{n}=\sum\binom nr x^r$`, steps: [R`$=(1+1)^{10}=2^{10}=1024$`] } },
    { q: R`ผลบวกของอนุกรม $\displaystyle\sum_{n=1}^{\infty}\left(\frac23\right)^n$ เท่ากับเท่าใด`, a: '2', sol: { idea: R`อนุกรมเรขาคณิตอนันต์ $a_1=\frac23,\ r=\frac23$`, steps: [R`$S_\infty=\frac{\frac23}{1-\frac23}=2$`], warn: 'อนุกรมเริ่มที่ $n=1$ พจน์แรกจึงเป็น $\\frac23$ ไม่ใช่ 1' } },
    { q: R`กำหนดให้ $f(x)=\dfrac{x^2-1}{x-1}$ เมื่อ $x\ne1$ และ $f(1)=k$ ถ้า $f$ ต่อเนื่องที่ $x=1$ แล้ว $k$ มีค่าเท่าใด`, a: '2', sol: { idea: R`ต่อเนื่องที่ $x=1$ เมื่อ $\lim_{x\to1}f(x)=f(1)$`, steps: [R`$\lim_{x\to1}\frac{(x-1)(x+1)}{x-1}=\lim_{x\to1}(x+1)=2$`, R`จึงต้องมี $k=2$`] } },
    { q: R`ถ้า $f(x)=(2x-1)^3$ แล้ว $f'(1)$ มีค่าเท่าใด`, a: '6', sol: { idea: 'กฎลูกโซ่: $\\frac{d}{dx}u^3=3u^2u\'$', steps: [R`$f'(x)=3(2x-1)^2\cdot2=6(2x-1)^2$`, R`$f'(1)=6$`] } },
    { q: R`$\displaystyle\int_0^1(x+1)^2\,dx$ มีค่าเท่าใด`, a: R`$\frac73$`, k: R`\frac73`, sol: { idea: 'กระจายแล้วอินทิเกรตทีละพจน์', steps: [R`$\int_0^1(x^2+2x+1)\,dx=\frac13+1+1=\frac73$`] } },
  ],
  prob: [
    { q: 'สำรวจคน 120 คน พบว่าดื่มชา 60 คน ดื่มกาแฟ 50 คน ดื่มโกโก้ 40 คน มีผู้ดื่มอย่างน้อยสองชนิด 30 คน และดื่มทั้งสามชนิด 10 คน มีผู้ที่ไม่ดื่มเครื่องดื่มทั้งสามชนิดนี้เลยกี่คน', a: '10',
      sol: { idea: R`ให้ $x_1,x_2,x_3$ เป็นจำนวนคนที่ดื่มพอดี 1, 2, 3 ชนิด ผลรวม $60+50+40$ นับคนที่ดื่ม $k$ ชนิดซ้ำ $k$ ครั้ง`, steps: [R`$x_3=10$ และ $x_2+x_3=30 \Rightarrow x_2=20$`, R`$x_1+2x_2+3x_3=150 \Rightarrow x_1+40+30=150 \Rightarrow x_1=80$`, R`ดื่มอย่างน้อยหนึ่งชนิด $=80+20+10=110$ ไม่ดื่มเลย $=120-110=10$`] } },
    { q: R`ถ้า $x-2$ เป็นตัวประกอบของ $p(x)=x^3-kx^2+5x-6$ ผลบวกกำลังสองของรากทั้งหมดของสมการ $p(x)=0$ (รวมรากที่เป็นจำนวนเชิงซ้อน) เท่ากับเท่าใด`, a: R`$-1$`, k: '-1',
      sol: { idea: R`หา $k$ จาก $p(2)=0$ แล้วใช้ $\sum r_i^2=\left(\sum r_i\right)^2-2\sum r_ir_j$`, steps: [R`$p(2)=8-4k+10-6=0 \Rightarrow k=3$`, R`$p(x)=x^3-3x^2+5x-6$: $\sum r_i=3,\ \sum r_ir_j=5$`, R`$\sum r_i^2=9-10=-1$`], check: R`$p(x)=(x-2)(x^2-x+3)$ รากเชิงซ้อน $\frac{1\pm\sqrt{11}\,i}{2}$ มีผลบวกกำลังสอง $1-6=-5$ บวก $2^2=4$ ได้ $-1$ ✓`, warn: 'ผลลัพธ์ติดลบได้ เพราะมีรากที่ไม่ใช่จำนวนจริง' } },
    { q: R`ระดับความดังของเสียงคำนวณได้จาก $L=10\log\dfrac{I}{I_0}$ เดซิเบล เมื่อ $I$ คือความเข้มเสียงและ $I_0$ เป็นค่าคงตัว ถ้าลำโพงหนึ่งตัวมีระดับความดัง 60 เดซิเบล เมื่อเปิดลำโพงแบบเดียวกัน 10 ตัวพร้อมกัน (ความเข้มเสียงรวมกัน) จะมีระดับความดังกี่เดซิเบล`, a: '70',
      sol: { idea: 'ความเข้มรวมเป็น 10 เท่า แล้วใช้สมบัติ $\\log(10x)=1+\\log x$', steps: [R`ลำโพงตัวเดียว: $10\log\frac{I}{I_0}=60 \Rightarrow \log\frac I{I_0}=6$`, R`10 ตัว: $L=10\log\frac{10I}{I_0}=10\left(1+\log\frac I{I_0}\right)=10(1+6)=70$`], warn: 'ความดังไม่ได้เป็น $10\\times60=600$ เดซิเบล เพราะสเกลเป็นลอการิทึม' } },
    { q: R`เส้นสัมผัสวงกลม $x^2+y^2=25$ ที่จุด $(3,4)$ ตัดแกน $X$ และแกน $Y$ พื้นที่ของสามเหลี่ยมที่เกิดจากเส้นสัมผัสนี้กับแกนทั้งสองเท่ากับกี่ตารางหน่วย`, a: R`$\frac{625}{24}$`, k: R`\frac{625}{24}`,
      sol: { idea: R`เส้นสัมผัสตั้งฉากกับรัศมี (หรือใช้สูตร $x_0x+y_0y=r^2$)`, steps: [R`ความชันรัศมี $=\frac43$ ความชันเส้นสัมผัส $=-\frac34$`, R`เส้นสัมผัส $3x+4y=25$`, R`ตัดแกน $X$ ที่ $\frac{25}{3}$ และแกน $Y$ ที่ $\frac{25}{4}$`, R`พื้นที่ $=\frac12\cdot\frac{25}3\cdot\frac{25}4=\frac{625}{24}$`] } },
    { q: R`ผลต่างระหว่างค่าสูงสุดกับค่าต่ำสุดของ $f(x)=3\sin x-4\cos x+7$ เท่ากับเท่าใด`, a: '10',
      sol: { idea: R`$a\sin x+b\cos x$ มีค่าอยู่ระหว่าง $-\sqrt{a^2+b^2}$ ถึง $\sqrt{a^2+b^2}$`, steps: [R`$\sqrt{3^2+4^2}=5$ จึงได้ $3\sin x-4\cos x\in[-5,5]$`, R`$f(x)\in[2,12]$ ผลต่าง $=12-2=10$`] } },
    { q: R`ให้ $A=\begin{bmatrix}2&1\\1&1\end{bmatrix}$ และ $X$ เป็นเมทริกซ์ที่ $AX=\begin{bmatrix}3&1\\2&1\end{bmatrix}$ ผลบวกของสมาชิกทุกตัวของ $X$ เท่ากับเท่าใด`, a: '3',
      sol: { idea: R`คูณ $A^{-1}$ ทางซ้ายทั้งสองข้าง $X=A^{-1}B$`, steps: [R`$\det A=1$, $A^{-1}=\begin{bmatrix}1&-1\\-1&2\end{bmatrix}$`, R`$X=\begin{bmatrix}1&-1\\-1&2\end{bmatrix}\begin{bmatrix}3&1\\2&1\end{bmatrix}=\begin{bmatrix}1&0\\1&1\end{bmatrix}$`, R`ผลบวกสมาชิก $=3$`], check: R`$AX=\begin{bmatrix}2&1\\1&1\end{bmatrix}\begin{bmatrix}1&0\\1&1\end{bmatrix}=\begin{bmatrix}3&1\\2&1\end{bmatrix}$ ✓`, warn: R`ต้องคูณ $A^{-1}$ ทางซ้าย $X=A^{-1}B$ ไม่ใช่ $BA^{-1}$` } },
    { q: 'นักกีฬายิงธนูถูกเป้าแต่ละครั้งด้วยความน่าจะเป็น 0.8 อย่างเป็นอิสระต่อกัน ถ้ายิง 4 ครั้ง ความน่าจะเป็นที่จะถูกเป้าอย่างน้อย 3 ครั้งเท่ากับเท่าใด', a: '0.8192',
      sol: { idea: R`การแจกแจงทวินาม $P(X=k)=\binom nk p^k(1-p)^{n-k}$`, steps: [R`$P(X=3)=\binom43(0.8)^3(0.2)=4(0.512)(0.2)=0.4096$`, R`$P(X=4)=(0.8)^4=0.4096$`, R`รวม $=0.8192$`] } },
    { q: 'ต้องการมีเงิน 133,100 บาท เมื่อครบ 3 ปี โดยฝากเงินก้อนเดียวในวันนี้ ได้ดอกเบี้ยทบต้นร้อยละ 10 ต่อปี ต้องฝากเงินวันนี้กี่บาท', a: '100000',
      sol: { idea: R`มูลค่าปัจจุบัน $P=\frac{F}{(1+r)^n}$`, steps: [R`$P=\frac{133100}{(1.1)^3}=\frac{133100}{1.331}=100000$ บาท`] } },
    { q: R`อนุภาคเคลื่อนที่ในแนวเส้นตรง มีตำแหน่ง $s(t)=t^3-6t^2+9t$ เมตร ที่เวลา $t$ วินาที ระยะทางทั้งหมดที่อนุภาคเคลื่อนที่ได้ตั้งแต่ $t=0$ ถึง $t=4$ วินาที เท่ากับกี่เมตร`, a: '12',
      sol: { idea: 'อนุภาคกลับทิศเมื่อความเร็วเป็นศูนย์ ต้องแบ่งช่วงที่กลับทิศ แล้วรวมระยะทางแต่ละช่วง', steps: [R`$v(t)=s'(t)=3t^2-12t+9=3(t-1)(t-3)=0 \Rightarrow t=1,3$`, R`$s(0)=0,\ s(1)=4,\ s(3)=0,\ s(4)=4$`, R`ระยะทาง $=|4-0|+|0-4|+|4-0|=12$ เมตร`], warn: R`การกระจัด $s(4)-s(0)=4$ ไม่ใช่ระยะทาง` } },
    { q: 'ข้อมูล 5 จำนวนมีค่าเฉลี่ยเลขคณิต 10 และความแปรปรวน (ประชากร) 4 ถ้าเพิ่มข้อมูลอีก 1 จำนวนคือ 10 ความแปรปรวนของข้อมูลชุดใหม่ 6 จำนวนเท่ากับเท่าใด', a: R`$\frac{10}{3}$`, k: R`\frac{10}{3}`,
      sol: { idea: R`ข้อมูลที่เพิ่มเท่ากับค่าเฉลี่ยเดิม ค่าเฉลี่ยไม่เปลี่ยน ผลรวม $\sum(x_i-\mu)^2$ จึงไม่เปลี่ยน แต่จำนวนข้อมูลเพิ่มขึ้น`, steps: [R`$\sum(x_i-10)^2=5\times4=20$`, R`ค่าเฉลี่ยใหม่ยังเป็น 10 และพจน์ใหม่ $(10-10)^2=0$`, R`ความแปรปรวนใหม่ $=\frac{20}{6}=\frac{10}{3}$`] } },
  ],
});
GENIUS_SETS.push({
  no: 5,
  mc: [
    { q: R`ถ้า $p\to(q\wedge r)$ มีค่าความจริงเป็นเท็จ และ $q$ มีค่าความจริงเป็นจริง ข้อใดมีค่าความจริงเป็นจริง`, c: [R`$(p\wedge q)\to r$`, R`$\sim r\wedge p$`, R`$r\vee\sim q$`, R`$p\leftrightarrow r$`], a: 1,
      sol: { idea: R`$p\to(q\wedge r)$ เท็จ เมื่อ $p$ จริงและ $q\wedge r$ เท็จ เมื่อ $q$ จริงจึงได้ $r$ เท็จ`, steps: [R`$p=T,\ q=T,\ r=F$`, R`ก. $(T\wedge T)\to F$ เป็นเท็จ`, R`ข. $T\wedge T$ เป็นจริง ✓`, R`ค. $F\vee F$ เป็นเท็จ`, R`ง. $T\leftrightarrow F$ เป็นเท็จ`] } },
    { q: R`กำหนดให้ $A=\{1,\{1\},\{1,2\}\}$ ข้อใดถูกต้อง`, c: [R`$\{2\}\subset A$`, R`$\{1,2\}\subset A$`, R`$\{\{1,2\}\}\in A$`, R`$\{1\}\in A$`], a: 3,
      sol: { idea: R`สมาชิกของ $A$ มี 3 ตัว คือ $1$, $\{1\}$ และ $\{1,2\}$ แยกให้ออกว่า "เป็นสมาชิก" กับ "เป็นสับเซต"`, steps: [R`ก. $2\notin A$ จึง $\{2\}\not\subset A$`, R`ข. $2\notin A$ จึง $\{1,2\}\not\subset A$ (แต่ $\{1,2\}\in A$)`, R`ค. $\{\{1,2\}\}$ ไม่ใช่สมาชิกของ $A$ (เป็นสับเซต)`, R`ง. $\{1\}$ เป็นสมาชิกตัวหนึ่งของ $A$ ✓`] } },
    { q: R`เซตคำตอบของอสมการ $\dfrac{x-1}{x+2}\ge0$ คือข้อใด`, c: [R`$(-\infty,-2]\cup[1,\infty)$`, R`$(-\infty,-2)\cup[1,\infty)$`, R`$(-2,1]$`, R`$[-2,1]$`], a: 1,
      sol: { idea: 'ใช้เส้นจำนวนตรวจเครื่องหมาย และตัวส่วนห้ามเป็นศูนย์', steps: [R`จุดวิกฤต $x=-2$ (ตัวส่วนเป็นศูนย์) และ $x=1$ (ตัวเศษเป็นศูนย์)`, R`เครื่องหมาย: $x<-2$ บวก, $-2<x<1$ ลบ, $x>1$ บวก`, R`รวม $x=1$ (ได้ 0) แต่ไม่รวม $x=-2$: ได้ $(-\infty,-2)\cup[1,\infty)$`], warn: R`ตัวเลือก ก. รวม $-2$ ซึ่งทำให้ตัวส่วนเป็นศูนย์` } },
    { q: R`ถ้า $f(x)=x^3+1$ แล้ว $f^{-1}(9)$ มีค่าเท่าใด`, c: ['2', '3', '8', '730'], a: 0,
      sol: { idea: R`$f^{-1}(9)=t \iff f(t)=9$`, steps: [R`$t^3+1=9 \Rightarrow t^3=8 \Rightarrow t=2$`], warn: R`730 คือ $f(9)$` } },
    { q: R`ผลคูณของคำตอบทั้งหมดของสมการ $\log_2(x^2-4x)=5$ เท่ากับข้อใด`, c: [R`$-32$`, R`$-4$`, '4', '32'], a: 0,
      sol: { idea: 'แปลงเป็นเลขยกกำลัง แล้วตรวจว่าค่าในลอการิทึมเป็นบวก', steps: [R`$x^2-4x=2^5=32 \Rightarrow x^2-4x-32=0 \Rightarrow x=8$ หรือ $x=-4$`, R`ตรวจ: ทั้งสองค่าทำให้ $x^2-4x=32>0$ ใช้ได้ทั้งคู่`, R`ผลคูณ $=-32$`] } },
    { q: R`วงรีที่มีจุดศูนย์กลางที่จุดกำเนิด มีโฟกัสที่ $(\pm3,0)$ และผ่านจุด $(5,0)$ มีสมการตามข้อใด`, c: [R`$\frac{x^2}{25}+\frac{y^2}{9}=1$`, R`$\frac{x^2}{25}+\frac{y^2}{16}=1$`, R`$\frac{x^2}{16}+\frac{y^2}{25}=1$`, R`$\frac{x^2}{34}+\frac{y^2}{9}=1$`], a: 1,
      sol: { idea: R`$(5,0)$ บนแกนเอกคือจุดยอด จึงได้ $a=5$ และ $b^2=a^2-c^2$`, steps: [R`$a=5,\ c=3 \Rightarrow b^2=25-9=16$`, R`สมการ $\frac{x^2}{25}+\frac{y^2}{16}=1$`] } },
    { q: R`ถ้า $\sin x=2\cos x$ แล้ว $\sin2x$ มีค่าเท่าใด`, c: [R`$\frac15$`, R`$\frac25$`, R`$\frac35$`, R`$\frac45$`], a: 3,
      sol: { idea: R`$\tan x=2$ แล้วใช้ $\sin2x=\frac{2\tan x}{1+\tan^2x}$`, steps: [R`$\sin2x=\frac{2(2)}{1+4}=\frac45$`], check: R`$\sin x=\frac{2}{\sqrt5},\ \cos x=\frac1{\sqrt5}$: $2\cdot\frac2{\sqrt5}\cdot\frac1{\sqrt5}=\frac45$ ✓ (กรณีทั้งคู่ติดลบก็ได้ค่าเดียวกัน)` } },
    { q: R`ถ้าเวกเตอร์ $\vec u=\vec i+k\vec j+2\vec k$ ตั้งฉากกับ $\vec v=k\vec i+3\vec j-4\vec k$ แล้ว $k$ มีค่าเท่าใด`, c: [R`$-2$`, '1', '2', '4'], a: 2,
      sol: { idea: R`เวกเตอร์ตั้งฉากกันเมื่อผลคูณเชิงสเกลาร์เป็นศูนย์`, steps: [R`$\vec u\cdot\vec v=k+3k-8=0 \Rightarrow k=2$`] } },
    { q: R`$(\cos40^\circ+i\sin40^\circ)(\cos20^\circ+i\sin20^\circ)$ เท่ากับข้อใด`, c: [R`$\frac12+\frac{\sqrt3}{2}i$`, R`$\frac{\sqrt3}{2}+\frac12i$`, R`$i$`, R`$-\frac12+\frac{\sqrt3}{2}i$`], a: 0,
      sol: { idea: 'คูณจำนวนเชิงซ้อนในรูปเชิงขั้ว: บวกมุม คูณขนาด', steps: [R`$=\cos60^\circ+i\sin60^\circ=\frac12+\frac{\sqrt3}2i$`] } },
    { q: 'นำข้อมูลทุกตัวในชุดหนึ่งมาบวกด้วย 5 ค่าสถิติในข้อใดไม่เปลี่ยนแปลง', c: ['ค่าเฉลี่ยเลขคณิต', 'มัธยฐาน', 'ส่วนเบี่ยงเบนมาตรฐาน', 'ฐานนิยม'], a: 2,
      sol: { idea: 'การบวกค่าคงตัวเลื่อนข้อมูลทั้งชุดไปเท่ากัน ค่ากลางเปลี่ยนตาม แต่การกระจายไม่เปลี่ยน', steps: ['ค่าเฉลี่ย มัธยฐาน ฐานนิยม เพิ่มขึ้น 5 ทั้งหมด', 'ระยะห่างระหว่างข้อมูลกับค่าเฉลี่ยเท่าเดิม ส่วนเบี่ยงเบนมาตรฐานจึงไม่เปลี่ยน'] } },
  ],
  fill: [
    { q: R`$(2+\sqrt3)^{2026}(2-\sqrt3)^{2026}$ มีค่าเท่าใด`, a: '1', sol: { idea: R`$a^nb^n=(ab)^n$`, steps: [R`$=\big[(2+\sqrt3)(2-\sqrt3)\big]^{2026}=(4-3)^{2026}=1$`] } },
    { q: R`$\sqrt{7+4\sqrt3}-\sqrt3$ มีค่าเท่าใด`, a: '2', sol: { idea: R`หา $a,b$ ที่ $(a+b\sqrt3)^2=7+4\sqrt3$`, steps: [R`$(2+\sqrt3)^2=4+4\sqrt3+3=7+4\sqrt3$`, R`$\sqrt{7+4\sqrt3}=2+\sqrt3$ จึงได้ผลลัพธ์ $=2$`] } },
    { q: R`$\log_2 12-\log_2 3+2^{\log_2 5}$ มีค่าเท่าใด`, a: '7', sol: { idea: R`$\log_a x-\log_a y=\log_a\frac xy$ และ $a^{\log_a b}=b$`, steps: [R`$\log_2 4+5=2+5=7$`] } },
    { q: R`ถ้า $8^x=4^{x+3}$ แล้ว $x$ มีค่าเท่าใด`, a: '6', sol: { idea: 'ทำฐานเป็น 2', steps: [R`$2^{3x}=2^{2x+6} \Rightarrow 3x=2x+6 \Rightarrow x=6$`] } },
    { q: R`ผลบวกของคำตอบทั้งหมดของสมการ $|x^2-4|=3x$ เท่ากับเท่าใด`, a: '5', sol: { idea: R`ข้างขวาต้องไม่ติดลบ จึงได้ $x\ge0$ แล้วแยกกรณีของค่าสัมบูรณ์`, steps: [R`กรณี $x^2-4=3x$: $x^2-3x-4=0 \Rightarrow x=4$ ($x=-1$ ใช้ไม่ได้)`, R`กรณี $x^2-4=-3x$: $x^2+3x-4=0 \Rightarrow x=1$ ($x=-4$ ใช้ไม่ได้)`, R`ผลบวก $=4+1=5$`], check: R`$x=4$: $|12|=12$ ✓, $x=1$: $|-3|=3$ ✓` } },
    { q: R`ถ้า $f(x)=x^2-2x$ แล้ว $(f\circ f)(-1)$ มีค่าเท่าใด`, a: '3', sol: { idea: 'คำนวณจากด้านใน', steps: [R`$f(-1)=1+2=3$`, R`$f(3)=9-6=3$`] } },
    { q: R`ผลคูณของรากทั้งหมดของสมการ $2x^3-5x^2+4x-6=0$ เท่ากับเท่าใด`, a: '3', sol: { idea: R`สมการ $ax^3+bx^2+cx+d=0$ มีผลคูณราก $-\frac da$`, steps: [R`$=-\frac{-6}{2}=3$`] } },
    { q: R`เศษจากการหาร $x^5+3x^2-1$ ด้วย $x+2$ เท่ากับเท่าใด`, a: R`$-21$`, k: '-21', sol: { idea: 'ทฤษฎีบทเศษเหลือ แทน $x=-2$', steps: [R`$(-2)^5+3(4)-1=-32+12-1=-21$`] } },
    { q: R`ผลบวกของค่า $x$ ทั้งหมดที่ทำให้ $\det\begin{bmatrix}x&2\\3&x+1\end{bmatrix}=0$ เท่ากับเท่าใด`, a: R`$-1$`, k: '-1', sol: { idea: 'ตั้งสมการดีเทอร์มิแนนต์เท่ากับศูนย์', steps: [R`$x(x+1)-6=0 \Rightarrow x^2+x-6=0$`, R`ผลบวกราก $=-1$ (รากคือ 2 และ $-3$)`] } },
    { q: R`ถ้า $A=\begin{bmatrix}0&1\\-1&0\end{bmatrix}$ ผลบวกของสมาชิกในแนวทแยงหลักของ $A^{2026}$ เท่ากับเท่าใด`, a: R`$-2$`, k: '-2', sol: { idea: 'หาแบบรูปของกำลังของ $A$', steps: [R`$A^2=\begin{bmatrix}-1&0\\0&-1\end{bmatrix}=-I$ จึงได้ $A^4=I$`, R`$2026=4(506)+2$ ดังนั้น $A^{2026}=A^2=-I$`, R`ผลบวกแนวทแยงหลัก $=-2$`] } },
    { q: R`ถ้า $z=3-4i$ แล้ว $z\bar z+z+\bar z$ มีค่าเท่าใด`, a: '31', sol: { idea: R`$z\bar z=|z|^2$ และ $z+\bar z=2\operatorname{Re}(z)$`, steps: [R`$z\bar z=9+16=25,\ z+\bar z=6$`, R`ผลรวม $=31$`] } },
    { q: R`$\sin(-1050^\circ)$ มีค่าเท่าใด`, a: R`$\frac12$`, k: R`\frac12`, sol: { idea: R`บวกหรือลบ $360^\circ$ ได้ค่าเท่าเดิม`, steps: [R`$-1050^\circ+3(360^\circ)=30^\circ$`, R`$\sin(-1050^\circ)=\sin30^\circ=\frac12$`], warn: R`$\sin(-\theta)=-\sin\theta$ ถ้าคิดเป็น $-\sin1050^\circ$ ต้องได้ $-\sin(-30^\circ)=\frac12$ เช่นกัน` } },
    { q: R`$\sin^2 75^\circ-\sin^2 15^\circ$ มีค่าเท่าใด`, a: R`$\frac{\sqrt3}{2}$`, k: R`\frac{\sqrt3}{2}`, sol: { idea: R`$\sin^2 75^\circ=\cos^2 15^\circ$ จึงเปลี่ยนเป็น $\cos^2\theta-\sin^2\theta=\cos2\theta$`, steps: [R`$\sin75^\circ=\cos15^\circ$`, R`$\cos^2 15^\circ-\sin^2 15^\circ=\cos30^\circ=\frac{\sqrt3}{2}$`] } },
    { q: R`ถ้า $A$ และ $B$ เป็นมุมแหลมที่ $\tan A=\frac12$ และ $\tan B=\frac13$ แล้ว $A+B$ มีค่ากี่องศา`, a: '45', sol: { idea: R`$\tan(A+B)=\frac{\tan A+\tan B}{1-\tan A\tan B}$`, steps: [R`$\tan(A+B)=\frac{\frac12+\frac13}{1-\frac16}=\frac{5/6}{5/6}=1$`, R`$A+B$ อยู่ระหว่าง $0^\circ$ กับ $180^\circ$ และ $\tan=1$ จึงได้ $45^\circ$`] } },
    { q: 'รหัสผ่าน 4 หลักที่สร้างจากเลขโดด 0–9 (ใช้ซ้ำได้) และมีเลข 7 อย่างน้อยหนึ่งหลัก มีกี่รหัส', a: '3439', sol: { idea: 'ทั้งหมด − ไม่มีเลข 7 เลย', steps: [R`ทั้งหมด $10^4=10000$, ไม่มีเลข 7 $9^4=6561$`, R`$10000-6561=3439$`] } },
    { q: R`สัมประสิทธิ์ของ $x^4$ ในการกระจาย $\left(x^2-\dfrac1x\right)^8$ เท่ากับเท่าใด`, a: '70', sol: { idea: R`พจน์ทั่วไป $\binom8r(x^2)^{8-r}\left(-\frac1x\right)^r=\binom8r(-1)^rx^{16-3r}$`, steps: [R`$16-3r=4 \Rightarrow r=4$`, R`สัมประสิทธิ์ $=\binom84(-1)^4=70$`] } },
    { q: R`ลำดับ $a_n$ มี $a_1=1$ และ $a_{n+1}=3a_n+2$ ค่าของ $a_5$ เท่ากับเท่าใด`, a: '161', sol: { idea: 'คำนวณทีละพจน์ตามความสัมพันธ์เวียนเกิด', steps: [R`$a_2=5,\ a_3=17,\ a_4=53,\ a_5=161$`], check: R`$a_n+1$ เป็นลำดับเรขาคณิต $2,6,18,54,162$ จึงได้ $a_5=161$ ✓` } },
    { q: R`$\displaystyle\sum_{k=1}^{20}(2k-1)$ มีค่าเท่าใด`, a: '400', sol: { idea: R`ผลบวกจำนวนคี่ $n$ ตัวแรกเท่ากับ $n^2$`, steps: [R`$=2\cdot\frac{20\cdot21}{2}-20=420-20=400=20^2$`] } },
    { q: R`ฟังก์ชัน $f(x)=x^4-2x^2$ มีค่าวิกฤตทั้งหมดกี่ค่า`, a: '3', sol: { idea: R`ค่าวิกฤตคือ $x$ ที่ $f'(x)=0$ (ฟังก์ชันพหุนามมีอนุพันธ์ทุกจุด)`, steps: [R`$f'(x)=4x^3-4x=4x(x-1)(x+1)=0$`, R`$x=-1,0,1$ รวม 3 ค่า`] } },
    { q: R`$\displaystyle\int_0^2x(x-2)\,dx$ มีค่าเท่าใด`, a: R`$-\frac43$`, k: R`-\frac43`, sol: { idea: 'กระจายแล้วอินทิเกรต', steps: [R`$\int_0^2(x^2-2x)\,dx=\big[\frac{x^3}3-x^2\big]_0^2=\frac83-4=-\frac43$`], warn: 'ค่าปริพันธ์ติดลบได้ เพราะกราฟอยู่ใต้แกน $X$ บนช่วงนี้ (ไม่ใช่พื้นที่)' } },
  ],
  prob: [
    { q: R`ให้ $A=\{x\in\mathbb N\mid x\text{ หาร }12\text{ ลงตัว และ }x\le10\}$ และ $B=\{x\in\mathbb N\mid x^2<30\}$ ค่าของ $n\big(P(A\cup B)\big)-n\big(P(A\cap B)\big)$ เท่ากับเท่าใด`, a: '48',
      sol: { idea: 'เขียนสมาชิกของเซต แล้วใช้ $n(P(X))=2^{n(X)}$', steps: [R`$A=\{1,2,3,4,6\}$, $B=\{1,2,3,4,5\}$`, R`$A\cup B=\{1,2,3,4,5,6\}$ มี 6 สมาชิก, $A\cap B=\{1,2,3,4\}$ มี 4 สมาชิก`, R`$2^6-2^4=64-16=48$`] } },
    { q: R`จำนวนเต็ม $x$ ที่อยู่ในช่วง $[-5,5]$ และสอดคล้องกับอสมการ $(x-1)(x-3)(x+2)\le0$ มีกี่จำนวน`, a: '7',
      sol: { idea: 'ใช้เส้นจำนวนกับจุดวิกฤต $-2, 1, 3$', steps: [R`เครื่องหมาย: $x<-2$ ลบ, $-2<x<1$ บวก, $1<x<3$ ลบ, $x>3$ บวก`, R`คำตอบ $x\le-2$ หรือ $1\le x\le3$`, R`จำนวนเต็มในช่วง $[-5,5]$: $-5,-4,-3,-2$ และ $1,2,3$ รวม 7 จำนวน`] } },
    { q: R`จำนวนเต็มบวก $n$ ที่น้อยที่สุดที่ทำให้ $2^n>10^{10}$ คือจำนวนใด กำหนดให้ $\log2\approx0.3010$`, a: '34',
      sol: { idea: 'ใส่ log ฐาน 10 ทั้งสองข้าง (log เป็นฟังก์ชันเพิ่ม เครื่องหมายไม่เปลี่ยน)', steps: [R`$n\log2>10 \Rightarrow n>\frac{10}{0.3010}\approx33.2$`, R`จำนวนเต็มบวกที่น้อยที่สุดคือ 34`], check: R`$2^{33}\approx8.6\times10^9<10^{10}$ และ $2^{34}\approx1.7\times10^{10}>10^{10}$ ✓` } },
    { q: R`วงกลมวงหนึ่งผ่านจุด $(0,0),\ (6,0)$ และ $(0,8)$ ถ้าวงกลมมีจุดศูนย์กลาง $(h,k)$ และรัศมี $r$ แล้ว $h+k+r$ มีค่าเท่าใด`, a: '12',
      sol: { idea: 'มุมที่จุดกำเนิดเป็นมุมฉาก ส่วนของเส้นตรงที่เชื่อม $(6,0)$ กับ $(0,8)$ จึงเป็นเส้นผ่านศูนย์กลาง', steps: [R`จุดศูนย์กลาง = จุดกึ่งกลาง $(3,4)$`, R`เส้นผ่านศูนย์กลางยาว $\sqrt{36+64}=10$ รัศมี $r=5$`, R`$h+k+r=3+4+5=12$`], check: R`แทน $(0,0)$ ใน $(x-3)^2+(y-4)^2=25$: $9+16=25$ ✓` } },
    { q: R`สามเหลี่ยม $ABC$ มีมุม $A=60^\circ$ ด้าน $b=8$ และ $c=5$ หน่วย ความยาวรอบรูปของสามเหลี่ยมเท่ากับกี่หน่วย`, a: '20',
      sol: { idea: R`กฎของโคไซน์ $a^2=b^2+c^2-2bc\cos A$`, steps: [R`$a^2=64+25-2(8)(5)\cdot\frac12=49 \Rightarrow a=7$`, R`รอบรูป $=7+8+5=20$`] } },
    { q: R`ความยาวของภาพฉายของเวกเตอร์ $\vec u=3\vec i+4\vec j$ บนเวกเตอร์ $\vec v=\vec i+2\vec j+2\vec k$ เท่ากับกี่หน่วย`, a: R`$\frac{11}{3}$`, k: R`\frac{11}{3}`,
      sol: { idea: R`ความยาวภาพฉาย $=\frac{|\vec u\cdot\vec v|}{|\vec v|}$`, steps: [R`$\vec u\cdot\vec v=3+8+0=11$, $|\vec v|=\sqrt{1+4+4}=3$`, R`ความยาวภาพฉาย $=\frac{11}{3}$`] } },
    { q: 'นำเลข 1, 2, 3, 4, 5 มาเรียงเป็นแถวแบบสุ่ม ความน่าจะเป็นที่เลข 1 อยู่ทางซ้ายของเลข 2 และเลข 2 อยู่ทางซ้ายของเลข 3 (ไม่จำเป็นต้องติดกัน) เท่ากับเท่าใด', a: R`$\frac16$`, k: R`\frac16`,
      sol: { idea: 'ลำดับของเลข 1, 2, 3 ระหว่างกันมี $3!=6$ แบบ ซึ่งเกิดได้เท่า ๆ กัน', steps: ['ในทุกการเรียง เลข 1, 2, 3 จะปรากฏในลำดับใดลำดับหนึ่งจาก 6 แบบ', 'มีเพียงลำดับ 1, 2, 3 ที่ต้องการ จึงได้ความน่าจะเป็น $\\frac16$'], check: R`นับตรง: เลือกตำแหน่งให้ 1,2,3 ได้ $\binom53=10$ แบบ (เรียงได้แบบเดียว) เลข 4,5 สลับได้ 2 แบบ: $\frac{20}{120}=\frac16$ ✓` } },
    { q: R`ลำดับเรขาคณิตลำดับหนึ่งมี $a_2=6$ และ $a_5=162$ ผลบวก 6 พจน์แรกของลำดับนี้เท่ากับเท่าใด`, a: '728',
      sol: { idea: R`$\frac{a_5}{a_2}=r^3$`, steps: [R`$r^3=\frac{162}{6}=27 \Rightarrow r=3$ และ $a_1=\frac63=2$`, R`$S_6=\frac{2(3^6-1)}{3-1}=3^6-1=728$`] } },
    { q: R`พื้นที่ทั้งหมดของบริเวณที่ปิดล้อมด้วยเส้นโค้ง $y=x^3$ และเส้นตรง $y=x$ เท่ากับกี่ตารางหน่วย`, a: R`$\frac12$`, k: R`\frac12`,
      sol: { idea: R`หาจุดตัด แล้วแบ่งช่วงตามว่าฟังก์ชันใดอยู่บน (ใช้ความสมมาตรได้ เพราะทั้งสองเป็นฟังก์ชันคี่)`, steps: [R`$x^3=x \Rightarrow x=-1,0,1$`, R`ช่วง $[0,1]$: $x\ge x^3$ พื้นที่ $\int_0^1(x-x^3)\,dx=\frac12-\frac14=\frac14$`, R`ช่วง $[-1,0]$ มีพื้นที่เท่ากันจากความสมมาตร รวม $\frac12$`], warn: R`ถ้าอินทิเกรต $\int_{-1}^1(x-x^3)\,dx$ ตรง ๆ จะได้ 0 เพราะส่วนบวกและลบหักล้างกัน` } },
    { q: 'น้ำหนักของนักเรียนกลุ่มหนึ่งมีการแจกแจงปกติ ค่าเฉลี่ย 50 กิโลกรัม ส่วนเบี่ยงเบนมาตรฐาน 5 กิโลกรัม กำหนดพื้นที่ใต้เส้นโค้งปกติมาตรฐานจาก $Z=0$ ถึง $Z=2$ เท่ากับ $0.4772$ นักเรียนที่หนักเกิน 60 กิโลกรัม คิดเป็นร้อยละเท่าใด', a: '2.28',
      sol: { idea: R`$z=\frac{x-\mu}{\sigma}$ และพื้นที่ครึ่งขวาของเส้นโค้งเท่ากับ 0.5`, steps: [R`$z=\frac{60-50}{5}=2$`, R`$P(Z>2)=0.5-0.4772=0.0228$`, R`คิดเป็นร้อยละ 2.28`] } },
  ],
});
})();

