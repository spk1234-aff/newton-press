/* ===================== ห้องพิมพ์ Earth & Newton : แกนหลัก ===================== */
'use strict';
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const uid = () => 'b' + Math.random().toString(36).slice(2, 9);
const PAGE_H = 1123, PAGE_G = 24, TOP = 98, BOT = 76;

const THEMES = {
  brown: { name: 'น้ำตาล–ทอง', dark: '#401a01', brown: '#713408', gold: '#b8860b', orange: '#d9682b', sep: '#d8c8bf', bar: '#fce8de', chapA: '#401a01', chapB: '#713408' },
  navy: { name: 'น้ำเงิน–ทอง', dark: '#1f3864', brown: '#2e5597', gold: '#b8912f', orange: '#2b7a8c', sep: '#c9d2e0', bar: '#dce6f2', chapA: '#1f3864', chapB: '#2e5597' },
  green: { name: 'เขียว', dark: '#1d4d2f', brown: '#2e6b47', gold: '#a07a12', orange: '#3c8d5a', sep: '#c6dccb', bar: '#dcefe2', chapA: '#1d4d2f', chapB: '#2e6b47' },
  plum: { name: 'ม่วง', dark: '#43204f', brown: '#6a3a7a', gold: '#b07a1c', orange: '#8e4fa3', sep: '#dccbe2', bar: '#efe2f4', chapA: '#43204f', chapB: '#6a3a7a' },
  teal: { name: 'เขียวน้ำทะเล', dark: '#134e57', brown: '#1f6f7a', gold: '#b8860b', orange: '#2b7a8c', sep: '#c4dcdf', bar: '#d9eef0', chapA: '#134e57', chapB: '#1f6f7a' },
};
const TEXT_COLORS = [['ดำ', '#222222'], ['น้ำตาลเข้ม', 'var:dark'], ['น้ำตาล', 'var:brown'], ['ทอง', 'var:gold'], ['แดง', '#c0392b'], ['น้ำเงิน', '#1f4e9a'], ['เขียว', '#2e7d32'], ['ส้ม', '#d9682b'], ['ม่วง', '#7b3fa0'], ['เทา', '#7a7a7a']];

const TYPES = {
  chapter: 'หัวบท', section: 'หัวข้อ', subsection: 'หัวข้อย่อย', para: 'ย่อหน้า', problem: 'ป้ายข้อ (ข้อ 1 / ตัวอย่าง)',
  given: 'ข้อความโจทย์', question: 'คำถาม', choices: 'ตัวเลือกปรนัย', idea: 'แนวคิด', solution: 'วิธีทำ', check: 'ตรวจคำตอบ',
  caution: 'ข้อควรระวัง', answer: 'ตอบ', box: 'กล่องสี', work: 'กรอบพื้นที่สำหรับทด', figure: 'รูปวาด', image: 'รูปภาพจากเครื่อง',
  table: 'ตาราง', pagebreak: 'ขึ้นหน้าใหม่', cover: 'หน้าปก', activity: 'หัวกิจกรรม', actend: 'จบกรอบกิจกรรม', lines: 'บรรทัดสำหรับเขียน', timeline: 'เส้นเวลา', divide: 'การหาร (หารยาว / พหุนาม / สังเคราะห์)', people: 'บุคคลสำคัญ', examcover: 'ปกข้อสอบ', soltitle: 'หัวเฉลย (โลโก้ + ชื่อชุด)', h3: 'หัวข้อในเฉลย (แนวคิดหลัก / ขั้นที่ ...)', part: 'หัวตอน (ตอนที่ ...)', asheet: 'กระดาษคำตอบแบบฝน', keytable: 'ตารางสรุปคำตอบ', solhead: 'หัวเฉลยข้อสอบ (ข้อ · คะแนน · คำตอบ)',
};
const BOXES = { def: 'บทนิยาม', thm: 'หลักการ', key: 'สรุป', warn: 'ข้อผิดพลาดที่พบบ่อย', try: 'ลองคิดก่อนอ่านต่อ', hist: 'เกร็ดประวัติ', inst: 'คำชี้แจง', write: '✎ เขียนด้วยคำพูดของตนเอง', note: 'ข้อสังเกต', link: 'การเชื่อมโยงกับวิชาอื่น', plain: 'กรอบเปล่า', recap: 'ทวนโจทย์ (แถบซ้าย)', caution2: 'ข้อควรระวัง (แถบแดง)', thmf: 'ทฤษฎีบท', lem: 'บทตั้ง', cor: 'บทแทรก', prop: 'สมบัติ', axm: 'สัจพจน์', formula: 'สูตร', rule: 'กฎ', crit: 'เกณฑ์การทดสอบ', notat: 'สัญลักษณ์และการอ่าน', conv: 'ข้อตกลง', proof: 'พิสูจน์', cex: 'ตัวอย่างค้าน', conj: 'ข้อความคาดการณ์', algo: 'ขั้นตอนวิธี', remark: 'หมายเหตุ', obj: 'จุดประสงค์การเรียนรู้', prior: 'ทบทวนความรู้เดิม', tip: 'เทคนิค / วิธีลัด', exam: 'แนวข้อสอบ', app: 'การประยุกต์ในชีวิตจริง' };
const BOXCOL = { def: '#bcd3ea', thm: '#d9a35b', key: '#9fcfb0', warn: '#f0c9c9', try: '#e8d77a', hist: '#d8cbb8', inst: '#e8d77a', write: '#c9a48a', note: '#b9c7d6', link: '#d9a35b', plain: '#cdb9ad', recap: '#b8912f', caution2: '#c0392b', thmf: '#7F9CCF', lem: '#A9BEDD', cor: '#B9A6D9', prop: '#8CC5C5', axm: '#C9A877', formula: '#E0B060', rule: '#D99A7A', crit: '#A3CF9A', notat: '#A8B8C4', conv: '#C9C4B0', proof: '#B8B8B8', cex: '#E3A3A3', conj: '#C8A8E8', algo: '#9FC0DD', remark: '#CCCCCC', obj: '#8EC1E0', prior: '#D2BE9C', tip: '#8FD1A6', exam: '#EFA98A', app: '#86CCBE' };
const BOXDATA = { def: ['EEF4FB', 'BCD3EA', '1F4E79'], thm: ['FDF6EC', 'D9A35B', null], key: ['EEF6F1', '9FCFB0', '2E6B47'], warn: ['FDEEEE', 'F0C9C9', 'A33A2A'], try: ['FFFBE6', 'E8D77A', '8A6D00'], hist: ['F6F3EE', 'D8CBB8', '5B4636'], inst: ['FFFBEA', 'E8D77A', '8A6D00'], write: ['FFFFFF', 'C9A48A', null], note: ['F2F6FA', 'B9C7D6', '34506B'], link: ['FFFFFF', 'D9A35B', null], plain: ['FFFFFF', 'CDB9AD', null], recap: ['F3F5F9', 'B8912F', null], caution2: ['FDF4EC', 'C0392B', 'C0392B'], thmf: ['EEF2FA', '7F9CCF', '1F3F7A'], lem: ['F1F5FB', 'A9BEDD', '2C4A7A'], cor: ['F4F1FA', 'B9A6D9', '5B3F8C'], prop: ['EEF7F7', '8CC5C5', '1F6B6B'], axm: ['F7F3EC', 'C9A877', '6B4A1E'], formula: ['FFF8EC', 'E0B060', '8A5A00'], rule: ['FBF1EC', 'D99A7A', '8C3B1E'], crit: ['EFF7EE', 'A3CF9A', '2E6B2E'], notat: ['F3F6F8', 'A8B8C4', '34505F'], conv: ['F6F6F3', 'C9C4B0', '5E5640'], proof: ['FFFFFF', 'B8B8B8', '333333'], cex: ['FDF0F0', 'E3A3A3', 'A33A2A'], conj: ['FAF5FF', 'C8A8E8', '6A3FA0'], algo: ['F2F7FB', '9FC0DD', '1F4E79'], remark: ['FAFAFA', 'CCCCCC', '555555'], obj: ['EEF6FB', '8EC1E0', '1C5D86'], prior: ['F7F4EE', 'D2BE9C', '6B5230'], tip: ['F1FAF4', '8FD1A6', '1E7A44'], exam: ['FFF4F0', 'EFA98A', 'A8441C'], app: ['F0FAF8', '86CCBE', '1E6E60'] };
const GROUP_MEMBERS = new Set(['given', 'question', 'choices', 'idea', 'solution', 'check', 'caution', 'answer', 'work', 'figure', 'image', 'table', 'lines', 'divide']);
const HEADINGS = new Set(['chapter', 'section', 'subsection', 'activity', 'part', 'solhead', 'h3']);
const FULLPAGE = new Set(['cover', 'examcover']);
const LABELS = { idea: 'แนวคิด', check: 'ตรวจคำตอบ', caution: 'ข้อควรระวัง', solution: 'วิธีทำ', question: 'คำถาม', answer: 'ตอบ' };
function labOf(b) { return esc((b.st && b.st.lt) || LABELS[b.t] || ''); }

let doc = null;
let curId = null;          // บล็อกที่เลือกอยู่
let lastRange = null;      // ตำแหน่งเคอร์เซอร์ล่าสุดในช่องพิมพ์
const hist = { stack: [], pos: -1, lock: false };

/* ---------------- เอกสารตัวอย่าง ---------------- */
function sampleDoc() {
  const m = (t, d) => `<span class="mx" contenteditable="false" data-tex="${esc(t)}"${d ? ' data-disp="1"' : ''}></span>`;
  return {
    app: 'en-editor', v: 1,
    settings: { name: 'บทที่ 7 การเลือกแบบไม่ติดกัน', hl: 'เทคนิคการนับและความน่าจะเป็น', hr: 'Earth & Newton Education', au: 'นายศาสตราวุฒิ อาชนะชัย', size: 'book', theme: 'brown' },
    blocks: [
      { id: uid(), t: 'chapter', num: 'บทที่ 7', title: 'การเลือกแบบไม่ติดกัน', sub: 'เลือกของจากแถวหรือวงกลมโดยไม่ให้สองชิ้นใดอยู่ติดกัน' },
      { id: uid(), t: 'box', kind: 'key', title: 'วิธีใช้โปรแกรมนี้ (ลบกล่องนี้ได้)', html: `• คลิกที่ข้อความบนหน้ากระดาษแล้วพิมพ์ได้เลย · <b>Enter</b> = ขึ้นบรรทัดใหม่ · กด Enter ซ้ำบนบรรทัดว่าง หรือ <b>Ctrl/⌘+Enter</b> = ย่อหน้าใหม่ · Backspace ในกล่องว่าง = ลบกล่อง<br>• เลือกข้อความแล้วใช้แถบที่สองเปลี่ยนขนาด สี ไฮไลต์ จัดแนว รายการ ไอคอน<br>• เลือกหลายกล่อง: คลิกที่ว่างข้างกระดาษแล้วลากคลุม หรือ ⌘/Ctrl+คลิก, Shift+คลิก · กด Delete ลบทีเดียว · ลากที่จับ ⠿ เพื่อย้าย · คลิกขวาดูเมนู<br>• คลิกบล็อกใดก็ได้ แผงรูปแบบด้านขวาจะปรับขนาดทั้งบล็อก สีตัวอักษร สีพื้น สีกรอบ ลายเส้น มุมโค้ง ระยะห่าง และชื่อป้ายได้<br>• สมการ: กดปุ่ม ∑ สมการ (มีปุ่มเศษส่วน ราก อินทิกรัล ลิมิต เมทริกซ์ กรีก ฯลฯ) หรือพิมพ์ LaTeX ระหว่างเครื่องหมายดอลลาร์ แล้วจะกลายเป็นสมการเอง · คลิกสมการเพื่อแก้<br>• ปุ่ม “+ ข้อใหม่” และเมนู “แทรก” มีแม่แบบ ข้อแบบฝึก ข้อปรนัย ตัวอย่าง เฉลย กิจกรรม หน้าปก · ปุ่ม “ใหม่” เลือกแม่แบบทั้งเล่ม<br>• วาดรูปเรขาคณิต กราฟ แผนภาพต้นไม้: ปุ่ม วาดรูป · บันทึกงานเป็นไฟล์ .json แล้วเปิดกลับมาแก้ได้` },
      { id: uid(), t: 'section', html: '7.1 เริ่มจากกรณีเล็ก' },
      { id: uid(), t: 'para', html: `เก้าอี้ ${m('5')} ตัวเรียงเป็นแถว ต้องการเลือก ${m('2')} ตัวโดยไม่ให้สองตัวที่เลือกอยู่ติดกัน ลองวางเก้าอี้ที่ไม่ถูกเลือก ${m('3')} ตัวก่อน จะเกิดช่องว่าง ${m('4')} ช่อง` },
      { id: uid(), t: 'box', kind: 'thm', title: 'หลักการ (วิธีช่องว่าง)', html: `เก้าอี้ ${m('m')} ตัวเรียงเป็นแถว เลือก ${m('k')} ตัวโดยไม่มีสองตัวใดติดกัน ทำได้ ${m('\\dbinom{m-k+1}{k}', 1)}` },
      { id: uid(), t: 'problem', html: 'ตัวอย่างที่ 7.1' },
      { id: uid(), t: 'given', html: `เก้าอี้ ${m('5')} ตัวเรียงเป็นแถว ติดหมายเลข ${m('1')} ถึง ${m('5')}` },
      { id: uid(), t: 'question', html: `เลือกเก้าอี้ ${m('2')} ตัวที่ไม่อยู่ติดกันได้กี่วิธี` },
      { id: uid(), t: 'idea', html: `ตัวที่ไม่ถูกเลือกมี ${m('5-2=3')} ตัว เกิดช่องว่าง ${m('4')} ช่อง จึงเลือก ${m('2')} ช่องจาก ${m('4')} ช่อง` },
      { id: uid(), t: 'solution', html: `จำนวนวิธี ${m('=\\dbinom{4}{2}=\\dfrac{4\\times 3}{2\\times 1}=6')} วิธี` },
      { id: uid(), t: 'check', html: `แจกแจงได้ ${m('\\{1,3\\},\\{1,4\\},\\{1,5\\},\\{2,4\\},\\{2,5\\},\\{3,5\\}')} ครบ ${m('6')} แบบ` },
      { id: uid(), t: 'answer', html: `${m('6')} วิธี` },
      { id: uid(), t: 'box', kind: 'note', title: 'ตัวอย่างสมการ (ลองคลิกเพื่อแก้)', html: `อินทิกรัลยืดตามฟังก์ชัน ${m('\\int_{0}^{1} \\frac{x^{2}+1}{\\sqrt{x+1}}\\,dx', 1)}เมทริกซ์ ${m('A=\\begin{bmatrix} 1 & 2 \\\\ 3 & 4 \\end{bmatrix}')} และดีเทอร์มิแนนต์ ${m('\\det(A)=\\begin{vmatrix} 1 & 2 \\\\ 3 & 4 \\end{vmatrix}=-2')}` },
      { id: uid(), t: 'subsection', html: 'ระดับ 3 ประยุกต์ (แนว A-Level)' },
      { id: uid(), t: 'problem', html: 'ข้อ 1' },
      { id: uid(), t: 'given', html: `เลือกจำนวน ${m('3')} จำนวนจาก ${m('1, 2, 3, \\ldots, 10')} โดยไม่มีสองจำนวนใดอยู่ติดกัน` },
      { id: uid(), t: 'question', html: 'เลือกได้ทั้งหมดกี่วิธี' },
      { id: uid(), t: 'choices', items: [m('35'), m('56'), m('84'), m('120'), m('210')] },
      { id: uid(), t: 'work', h: 40 },
    ],
  };
}

/* ---------------- ยูทิลิตี ---------------- */
function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
function toast(msg, ms = 2600) { const t = $('#toast'); t.textContent = msg; t.style.display = 'block'; clearTimeout(t._h); t._h = setTimeout(() => t.style.display = 'none', ms); }
function status(msg) { $('#status').textContent = msg; }
// ข้อความล้วนของหัวกรอบ (สมการ → อักขระธรรมดา) ใช้กับหัวกรอบ "(ต่อ)" ที่แสดงผ่าน CSS content
function texPlain(t) {
  const SUP = { '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹', 'n': 'ⁿ', '+': '⁺', '-': '⁻', 'x': 'ˣ' };
  const SUB = { '0': '₀', '1': '₁', '2': '₂', '3': '₃', '4': '₄', '5': '₅', '6': '₆', '7': '₇', '8': '₈', '9': '₉', 'n': 'ₙ' };
  const ITAL = c => { const k = c.charCodeAt(0); if (c === 'h') return 'ℎ'; if (k >= 97 && k <= 122) return String.fromCodePoint(0x1D44E + k - 97); if (k >= 65 && k <= 90) return String.fromCodePoint(0x1D434 + k - 65); return c; };
  let s = String(t || '').replace(/\\(displaystyle|textstyle|left|right|qquad|quad)(?![a-zA-Z])/g, ' ').replace(/\\[,;!]/g, ' ').replace(/\\[dt]?frac\s*\{([^{}]*)\}\s*\{([^{}]*)\}/g, '$1/$2')
    .replace(/\\sqrt\s*\{([^{}]*)\}/g, '√($1)').replace(/\\(text|mathrm|mathbf|operatorname)\s*\{([^{}]*)\}/g, '\u0001$2\u0002')
    .replace(/\\(alpha|beta|gamma|delta|theta|lambda|mu|phi|varphi|omega|sigma|rho|varepsilon|epsilon)(?![a-zA-Z])/g, (m, g) => ({ alpha: 'α', beta: 'β', gamma: 'γ', delta: 'δ', theta: 'θ', lambda: 'λ', mu: 'μ', phi: 'φ', varphi: 'φ', omega: 'ω', sigma: 'σ', rho: 'ρ', varepsilon: 'ε', epsilon: 'ϵ' })[g]).replace(/\\pm/g, '±').replace(/\\mp/g, '∓').replace(/\\int/g, '∫').replace(/\\lim/g, '\u0001lim\u0002').replace(/\\to/g, '→').replace(/\\infty/g, '∞').replace(/\\pi/g, 'π').replace(/\\times/g, '×').replace(/\\cdot/g, '·').replace(/\\le(q)?\b/g, '≤').replace(/\\ge(q)?\b/g, '≥').replace(/\\neq?\b/g, '≠').replace(/\\prime/g, '′').replace(/\\Delta/g, 'Δ').replace(/\\[lr]?vert/g, '|');
  s = s.replace(/\^\s*\{([^{}]*)\}|\^\s*(\\?[A-Za-z0-9+\-])/g, (m, a, b) => { const v = a !== undefined ? a : b; return [...v].every(c => SUP[c]) ? [...v].map(c => SUP[c]).join('') : '^' + (v.length > 1 ? '(' + v + ')' : v); })
    .replace(/_\s*\{([^{}]*)\}|_\s*([A-Za-z0-9])/g, (m, a, b) => { const v = a !== undefined ? a : b; return [...v].every(c => SUB[c]) ? [...v].map(c => SUB[c]).join('') : '_' + v; })
    .replace(/'/g, '′').replace(/\\[a-zA-Z]+/g, '').replace(/[{}]/g, '');
  let out = '', raw = false; for (const c of s) { if (c === '\u0001') raw = true; else if (c === '\u0002') raw = false; else out += raw ? c : ITAL(c); }
  return out.replace(/\s+/g, ' ').trim();
}
function actTitleText(el) { const c = el.cloneNode(true); c.querySelectorAll('.mx').forEach(m => m.replaceWith(document.createTextNode(texPlain(m.dataset.tex)))); return c.textContent.replace(/\s+/g, ' ').trim(); }
function byId(id) { return doc.blocks.find(b => b.id === id); }
function idx(id) { return doc.blocks.findIndex(b => b.id === id); }

function renderMath(root) {
  $$('.mx', root).forEach(s => {
    const tex = s.dataset.tex || '';
    const disp = s.dataset.disp === '1';
    s.classList.toggle('disp', disp);
    s.setAttribute('contenteditable', 'false');
    s.style.color = s.dataset.col || ''; s.style.fontSize = s.dataset.sz ? s.dataset.sz + 'em' : '';
    try { katex.render(texFor(tex, { ts: s.dataset.ts === '1' }), s, { throwOnError: true, displayMode: false, strict: false }); s.classList.remove('err'); }
    catch (e) { s.textContent = tex || '?'; s.classList.add('err'); }
  });
}
// \frac → \dfrac เฉพาะนอกตัวยก/ตัวห้อย (ในขอบเขตอินทิกรัล ผลบวก ฯลฯ ให้คงขนาดเล็กตามตำแหน่ง)
function prepScripts(t) {
  const OPS = /\\(?:int|iint|iiint|oint|sum|prod|lim|bigcup|bigcap|coprod|limsup|liminf)\s*(?:[_^]\s*(?:\{(?:[^{}]|\{[^{}]*\})*\}|\\?\S))*\s*[_^]\s*$/;
  let out = '', st = [], i = 0; const lvl = () => st.reduce((m, x) => Math.max(m, x), 0);
  const before = () => { let k = out.length - 1; while (k >= 0 && out[k] === ' ') k--; return out[k]; };
  while (i < t.length) { const c = t[i];
    if (c === '\\') { const cmd = (/^\\[a-zA-Z]+|^\\./.exec(t.slice(i)) || ['\\'])[0]; const b = before(); const direct = b === '^' || b === '_' ? (OPS.test(out) ? 2 : 1) : 0; const L = Math.max(lvl(), direct);
      if (cmd === '\\frac' || cmd === '\\dfrac') out += L === 2 ? '\\genfrac{}{}{}{1}' : L === 1 ? '\\frac' : '\\dfrac';  // ขอบเขตของ ∫ ∑ lim: เศษ/ส่วนขนาดเท่าตัวยก
      else if (cmd === '\\binom' || cmd === '\\dbinom') out += L ? '\\binom' : '\\dbinom';
      else out += cmd;
      i += cmd.length; continue; }
    if (c === '{') { const b = before(); st.push(b === '^' || b === '_' ? (OPS.test(out) ? 2 : 1) : 0); out += c; i++; continue; }
    if (c === '}') { st.pop(); out += c; i++; continue; }
    out += c; i++; }
  return out;
}
function prepTex(t) { return prepScripts(t); }
function cleanHTML(el) {
  const c = el.cloneNode(true);
  $$('.mx', c).forEach(s => { s.innerHTML = ''; s.removeAttribute('class'); s.removeAttribute('style'); s.className = 'mx'; });
  $$('.ic', c).forEach(s => { s.innerHTML = ''; });
  return c.innerHTML.replace(/<span class="mx" contenteditable="false"/g, '<span class="mx" contenteditable="false"');
}
function setHTML(el, html) { el.innerHTML = html || ''; renderMath(el); renderIcons(el); }

/* ---------------- สร้างบล็อก ---------------- */
function ed(field, html, ph, cls = '') {
  return `<div class="${cls}" contenteditable="true" data-f="${field}" data-ph="${esc(ph)}"></div>`;
}
function blockHTML(b) {
  switch (b.t) {
    case 'chapter': return `<div class="b-chapter"><div class="cn" contenteditable="true" data-f="num" data-ph="บทที่ ..."></div><div class="ct" contenteditable="true" data-f="title" data-ph="ชื่อบท"></div><div class="cs" contenteditable="true" data-f="sub" data-ph="คำโปรย"></div></div>`;
    case 'section': return ed('html', '', 'หัวข้อ เช่น 1.1 ...', 'b-section');
    case 'subsection': return ed('html', '', 'หัวข้อย่อย', 'b-subsection');
    case 'para': return ed('html', '', 'พิมพ์ข้อความ...', 'b-para');
    case 'problem': return `<div class="b-problem"><div class="pl" contenteditable="true" data-f="html" data-ph="ข้อ 1"></div>${b.skill !== undefined ? '<div class="sk" contenteditable="true" data-f="skill" data-ph="ทักษะ: ..."></div>' : ''}${b.pts !== undefined && b.pts !== '' ? `<div class="pp">(${esc(b.pts)} คะแนน)</div>` : ''}</div>`;
    case 'given': return ed('html', '', 'ข้อความโจทย์...', 'b-given');
    case 'question': return `<div class="b-question"><span class="ql">${labOf(b)}</span><div class="qb" contenteditable="true" data-f="html" data-ph="จงหา..."></div></div>`;
    case 'choices': return `<div class="b-choices">${(b.items || ['', '', '', '', '']).map((x, i) => `<div class="ch"><span class="cl">${choiceLab(b, i)}</span><div contenteditable="true" data-f="c${i}" data-ph="ตัวเลือก"></div></div>`).join('')}</div>`;
    case 'idea': case 'check': case 'caution':
      return `<div class="bx b-${b.t}"><span class="lab">${labOf(b)}</span><div contenteditable="true" data-f="html" data-ph="พิมพ์..."></div></div>`;
    case 'solution': return `<div class="b-solution"><span class="lab">${labOf(b)}</span><div contenteditable="true" data-f="html" data-ph="พิมพ์วิธีทำ..."></div></div>`;
    case 'answer': return `<div class="b-answer${b.v === 'box' ? ' boxed' : ''}"><span class="al">${labOf(b)}</span><div class="ab" contenteditable="true" data-f="html" data-ph="คำตอบ"></div></div>`;
    case 'box': return `<div class="b-box k-${b.kind}"><div class="bt" contenteditable="true" data-f="title" data-ph="ชื่อกล่อง"></div><div contenteditable="true" data-f="html" data-ph="พิมพ์..."></div></div>`;
    case 'work': return `<div class="b-work">${b.nolab ? '' : `<span class="wl">${esc(b.wl || 'พื้นที่สำหรับทด')}</span>`}<span class="wh"><button data-act="wminus">− เตี้ยลง</button><button data-act="wplus">+ สูงขึ้น</button></span></div>${b.ans ? `<div class="w-ans"><span>${esc(b.ansl || 'คำตอบ')}</span><i></i></div>` : ''}`;
    case 'lines': return `<div class="b-lines">${Array.from({ length: b.n || 4 }, () => '<i></i>').join('')}</div>`;
    case 'activity': return `<div class="b-activity"><span class="aic">${b.icon || '♟'}</span><div contenteditable="true" data-f="html" data-ph="กิจกรรมที่ ..."></div></div>`;
    case 'actend': return `<div class="b-actend"><span>จบกรอบกิจกรรม</span></div>`;
    case 'timeline': return `<div class="b-timeline"></div>`;
    case 'cover': return coverHTML(b);
    case 'examcover': return examCoverHTML(b);
    case 'part': return partHTML(b);
    case 'asheet': return ashtHTML(b);
    case 'keytable': return b.mode === 'parts' ? keyTablePartsHTML(b) : keyTableHTML(b);
    case 'soltitle': return solTitleHTML(b);
    case 'h3': return `<div class="b-h3 t-${b.tone || 'navy'}" contenteditable="true" data-f="html" data-ph="หัวข้อ"></div>`;
    case 'solhead': return `<div class="b-solhead"><span class="sn" contenteditable="true" data-f="num" data-ph="ข้อ 1"></span><span class="sp"><span contenteditable="true" data-f="pts" data-ph="3"></span> <span contenteditable="true" data-f="lp" data-def="คะแนน"></span></span><span class="sr"><span contenteditable="true" data-f="la" data-def="คำตอบ"></span> <span class="sa" contenteditable="true" data-f="ans" data-ph="____"></span></span></div>`;
    case 'figure': return `<div class="b-figure" title="ดับเบิลคลิกเพื่อแก้รูป"></div>`;
    case 'people': return peopleHTML(b);
    case 'image': return `<div class="b-image"><img alt="รูปภาพ"><div class="cap" contenteditable="true" data-f="cap" data-ph="คำบรรยายภาพ (เว้นว่างได้)"></div></div>`;
    case 'divide': return `<div class="b-divide" title="ดับเบิลคลิกเพื่อแก้">${divisionHTML(b)}</div>`;
    case 'table': return `<div class="b-table"></div>`;
    case 'pagebreak': return `<div class="b-pagebreak">— ขึ้นหน้าใหม่ —</div>`;
  }
  if (typeof extBlockHTML === 'function') { const h = extBlockHTML(b); if (h) return h; }
  return '';
}
function fillBlock(el, b) {
  $$('[data-f]', el).forEach(e => {
    const f = e.dataset.f;
    if (f.startsWith('c') && b.items) setHTML(e, b.items[+f.slice(1)] || '');
    else setHTML(e, b[f] !== undefined ? b[f] : (e.dataset.def || ''));
  });
  if (b.t === 'work') $('.b-work', el).style.height = (b.h || 40) * 3.7795 + 'px';
  if (b.t === 'people') fillPeople(el, b);
  if (b.t === 'figure') { if (b.lib) b.svg = libSVG(b); $('.b-figure', el).innerHTML = b.svg || ''; const s = $('svg', el); if (s && b.w) s.style.width = b.w + '%'; }
  if (b.t === 'image') { const im = $('img', el); im.src = b.src || ''; im.style.width = (b.w || 60) + '%'; }
  if (b.t === 'table') buildTable(el, b);
  if (b.t === 'choices') layoutChoices(el, b);
  if (b.t === 'timeline') buildTimeline(el, b);
  if (b.t === 'chapter' && b.ca) $('.b-chapter', el).style.background = `linear-gradient(90deg, ${b.ca}, ${b.ca}cc)`;
  if (b.t === 'lines') { $('.b-lines', el).style.setProperty('--lh', (b.gap || 9) + 'mm'); $('.b-lines', el).classList.toggle('dash', !!b.dash); }
  if (b.t === 'cover') fillCover(el, b);
  if (b.t === 'examcover') fillExamCover(el, b);
  if (b.t === 'soltitle') fillSolTitle(el, b);
  applyBlockStyle(el, b);
}
function choiceLab(b, i) { const f = b.cf || '(1)'; if (f === 'ก.') return 'กขคงจฉชซ'[i] + '.'; if (f === 'a)') return 'abcdefgh'[i] + ')'; if (f === 'A.') return 'ABCDEFGH'[i] + '.'; return `(${i + 1})`; }
function buildTimeline(el, b) {
  const w = $('.b-timeline', el); const rows = b.rows || [['', '']];
  w.innerHTML = rows.map((r, i) => `<div class="tl"><div class="ty" contenteditable="true" data-cell="${i},0" data-ph="ปี / เวลา"></div><div class="tx" contenteditable="true" data-cell="${i},1" data-ph="เหตุการณ์"></div></div>`).join('');
  $$('[data-cell]', w).forEach(td => { const [i, j] = td.dataset.cell.split(',').map(Number); setHTML(td, rows[i][j]); });
}
/* รูปแบบเฉพาะบล็อก (แผงรูปแบบด้านขวา) */
function applyBlockStyle(el, b) {
  const st = b.st || {}; const inner = el.firstElementChild; if (!inner) return;
  el.style.fontSize = st.fs && st.fs != 1 ? st.fs + 'em' : '';
  el.style.paddingTop = st.mt ? st.mt + 'px' : ''; el.style.paddingBottom = st.mb ? st.mb + 'px' : '';
  inner.style.color = st.fg || '';
  inner.style.textAlign = st.al || '';
  if (st.ml !== undefined && st.ml !== '') inner.style.marginLeft = st.ml + 'px'; else inner.style.marginLeft = '';
  if (st.bg) { inner.style.background = st.bg; inner.classList.add('hasbg'); } else { inner.style.background = ''; inner.classList.remove('hasbg'); }
  if (st.bd || st.bw !== undefined || st.bs) { const bw = st.bw ?? 1; inner.style.border = bw > 0 ? `${bw}px ${st.bs || 'solid'} ${st.bd || '#9a8576'}` : 'none'; inner.classList.add('hasbg'); } else inner.style.border = '';
  inner.style.borderRadius = st.rad !== undefined && st.rad !== '' ? st.rad + 'px' : '';
  $$('.lab,.bt,.ql,.al,.wl,.cl,.pl,.sk,.cn,.ct', el).forEach(x => x.style.color = st.lab || '');
}
function layoutChoices(el, b) {
  const g = $('.b-choices', el);
  const len = Math.max(...(b.items || ['']).map(h => { const d = document.createElement('div'); d.innerHTML = h; $$('.mx', d).forEach(s => s.textContent = s.dataset.tex); return d.textContent.length; }));
  const cols = b.cols || (len <= 9 ? 5 : len <= 22 ? 3 : len <= 40 ? 2 : 1);
  g.style.gridTemplateColumns = cols === 5 ? 'repeat(5,auto)' : `repeat(${cols},1fr)`;
  g.style.justifyContent = 'start';
}
function buildTable(el, b) {
  if (typeof buildTableX === 'function' && (b.rs || b.full || b.cw || b.al || b.mg || b.bd || b.cf || b.tst || b.ca || b.nob || b.tw || b.rh || b.rha || b.pad || b.tfs)) return buildTableX(el, b);
  const w = $('.b-table', el);
  const rows = b.rows || [['', ''], ['', '']];
  w.innerHTML = '<table>' + rows.map((r, i) => '<tr>' + r.map((c, j) => `<td contenteditable="true" data-cell="${i},${j}"></td>`).join('') + '</tr>').join('') + '</table>';
  $$('td', w).forEach(td => { const [i, j] = td.dataset.cell.split(',').map(Number); setHTML(td, rows[i][j]); });
}
function toolButtons(b) {
  let extra = '';
  if (b.t === 'table') extra = '<button data-act="trow" title="เพิ่มแถว">+แ</button><button data-act="tcol" title="เพิ่มคอลัมน์">+ค</button><button data-act="tdel" title="ลบแถวสุดท้าย">−แ</button><button data-act="tins" title="แทรกแถวใต้แถวที่เคอร์เซอร์อยู่">↧แ</button><button data-act="trdel" title="ลบแถวที่เคอร์เซอร์อยู่">✕แ</button>';
  if (b.t === 'figure' || b.t === 'image') extra = '<button data-act="wbig" title="ขยาย">⤢</button><button data-act="wsmall" title="ย่อ">⤡</button>' + (b.t === 'figure' ? '<button data-act="fedit" title="แก้รูป">✎</button>' : '');
  if (b.t === 'people') extra = '<button data-act="padd" title="เพิ่มคน">+ค</button><button data-act="pdel" title="ลบคนสุดท้าย">−ค</button>';
  if (b.t === 'divide') extra = '<button data-act="dvedit" title="แก้การหาร">✎</button>';
  if (b.t === 'choices') extra = '<button data-act="ccols" title="เปลี่ยนจำนวนคอลัมน์">▦</button>';
  if (b.t === 'box') extra = '<button data-act="bkind" title="เปลี่ยนชนิดกล่อง">◐</button>';
  if (b.t === 'timeline') extra = '<button data-act="trow" title="เพิ่มเหตุการณ์">+แ</button><button data-act="tdel" title="ลบแถวสุดท้าย">−แ</button>';
  if (b.t === 'lines') extra = '<button data-act="lplus" title="เพิ่มบรรทัด">+</button><button data-act="lminus" title="ลดบรรทัด">−</button>';
  return `<div class="tools"><button data-act="up" title="เลื่อนขึ้น">↑</button><button data-act="down" title="เลื่อนลง">↓</button><button data-act="dup" title="ทำซ้ำ">⧉</button><button data-act="add" title="แทรกต่อท้าย">+</button>${extra}<button data-act="del" title="ลบ">✕</button></div>`;
}
function makeEl(b) {
  const el = document.createElement('div');
  el.className = 'blk';
  el.dataset.id = b.id; el.dataset.t = b.t;
  el.innerHTML = blockHTML(b) + toolButtons(b) + '<div class="grip" draggable="true" title="คลิก = เลือกทั้งกล่อง · ลาก = ย้าย · คลิกขวา = เมนู">⠿</div>';
  fillBlock(el, b);
  return el;
}
function renderAll() {
  const flow = $('#flow');
  flow.innerHTML = '';
  doc.blocks.forEach(b => flow.appendChild(makeEl(b)));
  markActivities();
  paintSel();
  applySettings();
  schedulePaginate();
}
function rerender(id) {
  const b = byId(id), old = $(`.blk[data-id="${id}"]`);
  if (!b || !old) return;
  const el = makeEl(b);
  if (old.classList.contains('sel')) el.classList.add('sel');
  old.replaceWith(el);
  markActivities(); paintSel();
  schedulePaginate();
}
/* บล็อกที่อยู่ระหว่าง "หัวกิจกรรม" กับ "จบกรอบกิจกรรม" จะมีกรอบล้อม */
function markActivities() {
  let on = false; const els = $$('#flow > .blk');
  els.forEach((el, i) => {
    const t = el.dataset.t;
    el.classList.remove('inact', 'acthead', 'actlast');
    if (t === 'activity') { on = true; el.classList.add('acthead'); return; }
    if (on && (t === 'chapter' || t === 'section' || FULLPAGE.has(t) || t === 'part')) on = false;
    if (on) { el.classList.add('inact'); if (t === 'actend') { el.classList.add('actlast'); on = false; } }
  });
}

/* ---------------- ซิงก์ข้อความกลับเข้าข้อมูล ---------------- */
function syncFrom(edEl) {
  const blk = edEl.closest('.blk'); if (!blk) return;
  const b = byId(blk.dataset.id); if (!b) return;
  if (edEl.dataset.pf) { const [i, k] = edEl.dataset.pf.split('.'); b.items[+i][k] = cleanHTML(edEl); changed(); return; }
  if (edEl.dataset.cell) { const [i, j] = edEl.dataset.cell.split(',').map(Number); b.rows[i][j] = cleanHTML(edEl); }
  else {
    const f = edEl.dataset.f;
    if (/^c\d$/.test(f)) { b.items = b.items || ['', '', '', '', '']; b.items[+f.slice(1)] = cleanHTML(edEl); layoutChoices(blk, b); }
    else b[f] = cleanHTML(edEl);
  }
  changed();
}

/* ---------------- จัดหน้าอัตโนมัติ ---------------- */
let pagTimer = null;
// การจัดหน้าแบบไฟล์เฉลย: เปิดด้วย settings.solpg = true (ถ้าไม่กำหนด ใช้กับเอกสารที่ชื่อขึ้นต้นด้วย "เฉลย")
function solPaging() { const st = (doc && doc.settings) || {}; return st.solpg !== undefined ? !!st.solpg : /^\s*เฉลย/.test(st.name || ''); }
// ข้อในไฟล์เฉลยที่ยาวเกินหนึ่งหน้า: เริ่มข้อในหน้าเดิมเมื่อเหลือที่อย่างน้อยครึ่งหน้าและลงโจทย์กับวิธีทำช่วงแรกได้ ไม่เช่นนั้นขึ้นหน้าใหม่
// ตัดหน้าเฉพาะรอยต่อที่อนุญาต: ไม่แยกหัวข้อ/โจทย์/รูปโจทย์/คำถาม ไม่แยกรูปหรือตารางจากวิธีทำก่อนหน้า และไม่แยกคำตอบจากบล็อกก่อนหน้า
function solLongPlace(u, prev, P, ROOM) {
  const E = u.els, n = E.length, T = E.map(e => e.dataset.t);
  const D = E.map((e, k) => k < n - 1 ? E[k + 1].offsetTop - e.offsetTop : e.offsetHeight);
  const firstSol = T.indexOf('solution'); const glued = (a, b, j) => { const beforeSol = firstSol < 0 || j < firstSol; return a === 'problem' || a === 'skull' || HEADINGS.has(a) || b === 'answer' || (['figure', 'image', 'table'].includes(b) && ['solution', 'table', 'figure', 'image'].includes(a)) || (['given', 'question', 'choices', 'figure', 'image'].includes(b) && ['given', 'question', 'figure', 'image'].includes(a) && beforeSol); };
  const top = e => e.offsetTop, pageOf = e => Math.floor(top(e) / P);
  const toNext = e => { if (top(e) % P <= TOP + 2) return; const tgt = (pageOf(e) + 1) * P + TOP; e.style.marginTop = (parseFloat(e.style.marginTop) || 0) + (tgt - top(e)) + 'px'; };
  let t = top(E[0]), p = pageOf(E[0]), rs = p * P + TOP, re = p * P + PAGE_H - BOT;
  if (t < rs) { E[0].style.marginTop = (rs - t) + 'px'; t = rs; }
  let fresh = t <= rs + 2;
  if (!fresh && (u.forced || re - t < ROOM * 0.45)) { toNext(E[0]); fresh = true; }
  let k = 0;
  while (k < n) {
    const s = top(E[k]), pp = pageOf(E[k]); const avail = pp * P + PAGE_H - BOT - s;
    const scan = relax => { let acc = 0, j = k, bs = -1; while (j < n && acc + D[j] <= avail) { acc += D[j]; j++; if (j === n || !glued(T[j - 1], T[j], j) || (relax && T[j - 1] === 'solution' && ['figure', 'image', 'table'].includes(T[j]))) bs = j; } return bs; };
    let best = scan(false);
    if (k === 0 && !T.slice(0, Math.max(best, 0)).includes('solution')) { const b2 = scan(true); if (T.slice(0, Math.max(b2, 0)).includes('solution')) best = b2; } // โจทย์+วิธีทำ+รูปไม่พอหน้า: ให้รูปเฉลยไปหน้าถัดไปแทนการแยกโจทย์จากวิธีทำ
    const hasSol = T.slice(k, best < 0 ? k : best).includes('solution');
    if (best < 0 || (k === 0 && !fresh && !hasSol && best < n)) { // ลงไม่ได้ หรือได้แค่โจทย์: ขึ้นหน้าใหม่
      if (!fresh) { toNext(E[k]); fresh = true; continue; }
      best = k + 1; while (best < n && glued(T[best - 1], T[best], best) && D.slice(k, best + 1).reduce((x, y) => x + y, 0) <= ROOM) best++;
    }
    if (best < n) toNext(E[best]);
    k = best; fresh = true;
  }
}
function schedulePaginate() { clearTimeout(pagTimer); pagTimer = setTimeout(paginate, 60); }
function units() {
  const els = $$('#flow > .blk');
  const out = []; let cur = null, inSol = false, actU = null;
  els.forEach((el, i) => {
    const t = el.dataset.t, prevT = i ? els[i - 1].dataset.t : null;
    if (actU && ['activity', 'chapter', 'section', 'subsection', 'pagebreak', 'cover'].includes(t)) actU = null;
    if (actU && cur === actU) { cur.els.push(el); if (t === 'actend') actU = null; return; } // แบบฝึก: กรอบ (กิจกรรม ตัวอย่าง ทฤษฎีบท ฝึกทันที) อยู่หน้าเดียวทั้งกรอบ ถ้ายาวเกินหน้าจึงแยก
    if (inSol && cur && !['solhead', 'part', 'pagebreak', 'soltitle', 'keytable'].includes(t)) { cur.els.push(el); if (t === 'answer') inSol = false; return; } // เฉลยหนึ่งข้อ (หัวแถบ → คำตอบ) อยู่หน้าเดียวกัน
    inSol = t === 'solhead';
    if (cur && t === 'actend') { cur.els.push(el); return; }
    if (cur && t !== 'problem' && cur.kind === 'problem' && GROUP_MEMBERS.has(t)) cur.els.push(el);
    else if (cur && doc.settings.wdist && (((t === 'image' || t === 'table') && prevT === 'para') || (t === 'table' && prevT === 'image') || (t === 'question' && ['image', 'table'].includes(prevT)) || (['work', 'lines'].includes(t) && ['question', 'box', 'para'].includes(prevT)))) cur.els.push(el); // แบบฝึก: ข้อความนำ รูป ตาราง คำถาม และกรอบทด อยู่หน้าเดียวกัน
    else if (cur && HEADINGS.has(prevT) && t !== 'pagebreak') { cur.els.push(el); if (t === 'problem') cur.kind = 'problem'; }
    else { const pb = i ? byId(els[i - 1].dataset.id) : null; cur = { els: [el], kind: t, forced: !!(byId(el.dataset.id) || {}).npg || prevT === 'pagebreak' || FULLPAGE.has(prevT) || (prevT === 'work' && pb && pb.full && t !== 'anstab') || (prevT === 'anstab' && i > 1 && !!(byId(els[i - 2].dataset.id) || {}).full) || ((t === 'chapter' || (t === 'pjch' && prevT !== 'pjinfo') || t === 'memohead' || FULLPAGE.has(t) || (t === 'solhead' && !(byId(el.dataset.id) || {}).inl) || t === 'asheet') && i > 0 && prevT !== 'pagebreak') }; out.push(cur); }
    if (t === 'activity' && doc.settings.wdist && !(byId(el.dataset.id) || {}).split) actU = cur;
  });
  return out;
}
function paginate() {
  const flow = $('#flow');
  stretchInts(flow);
  if (typeof capSync === 'function') capSync();
  if (typeof labelIndent === 'function') labelIndent();
  if (typeof tblUnsplit === 'function') tblUnsplit();
  $$('#flow .toc-r').forEach(r => { if (r.style.marginTop) r.style.marginTop = ''; });
  $$('#flow > .blk').forEach(el => { el.style.marginTop = ''; el.classList.remove('actcont', 'actbrk'); { const bb = byId(el.dataset.id); if (typeof gapDraw === 'function') gapDraw(el, bb); else el.style.paddingTop = bb && bb.sp ? (+bb.sp * 3.7795) + 'px' : ''; } const w = $('.b-work', el); if (w) { const b = byId(el.dataset.id); w.style.height = (b.h || 40) * 3.7795 + 'px'; } });
  const P = PAGE_H + PAGE_G, ROOM = PAGE_H - TOP - BOT;
  // ข้อที่ยาวเกินหนึ่งหน้า: แยกเป็นบล็อกย่อยให้ขึ้นหน้าใหม่ทีละบล็อก
  const U = []; const SOLPG = solPaging();
  units().forEach(u => {
    const f = u.els[0], l = u.els[u.els.length - 1];
    if (SOLPG && u.els.some(e => e.dataset.t === 'problem') && u.els.length > 1 && l.offsetTop + l.offsetHeight - f.offsetTop > ROOM) { U.push({ els: u.els, kind: 'problem', forced: u.forced, long: true }); return; } // ไฟล์เฉลย: ข้อยาวเกินหน้า จัดแยกในลูปด้านล่าง
    if (u.els.length > 1 && l.offsetTop + l.offsetHeight - f.offsetTop > ROOM) { // ยาวเกินหน้า: แยกเป็นกลุ่มย่อย แต่หัวข้อยังติดกับเนื้อหาถัดไป คำถามติดกับกรอบทด
      const glue = (a, b) => HEADINGS.has(a) || b === 'actend' || (['work', 'lines', 'answer', 'choices'].includes(b) && ['question', 'given', 'box', 'choices'].includes(a)) || (['image', 'table'].includes(b) && a === 'para') || (b === 'question' && ['image', 'table', 'given'].includes(a));
      let sub = null; const subs = [];
      u.els.forEach((el, k) => { const t = el.dataset.t, pt = k ? u.els[k - 1].dataset.t : null; if (sub && glue(pt, t)) sub.push(el); else { sub = [el]; subs.push(sub); } });
      subs.forEach((g, k) => { const gh = g[g.length - 1].offsetTop + g[g.length - 1].offsetHeight - g[0].offsetTop; if (g.length > 1 && gh > ROOM) g.forEach((el, j) => U.push({ els: [el], kind: el.dataset.t, forced: k === 0 && j === 0 && u.forced })); else U.push({ els: g, kind: g[0].dataset.t, forced: k === 0 && u.forced }); });
    }
    else U.push(u);
  });
  // กรอบทดแบบ “N ข้อต่อหน้า”: ปรับความสูงกรอบให้ทั้งข้อสูง ROOM/N พอดี (ข้อที่โจทย์ยาว กรอบจะเล็กลงเอง)
  U.forEach(u => {
    const l = u.els[u.els.length - 1]; const wb = byId(l.dataset.id); const w = $('.b-work', l);
    if (w && wb && wb.full) { u.forced = true; return; }
    if (!w || !wb || !wb.share) return;
    const f = u.els[0]; const H = l.offsetTop + l.offsetHeight - f.offsetTop; const content = H - w.offsetHeight;
    const target = Math.floor((ROOM - 2) / wb.share) - 6;
    w.style.height = Math.max(20 * 3.7795, target - content) + 'px';
  });
  let prev = null;
  for (const u of U) {
    if (u.long) { solLongPlace(u, prev, P, ROOM); prev = u; continue; }
    const first = u.els[0], last = u.els[u.els.length - 1];
    let t = first.offsetTop, bt = last.offsetTop + last.offsetHeight;
    let p = Math.floor(t / P);
    let rs = p * P + TOP, re = p * P + PAGE_H - BOT;
    let target = null;
    if (u.forced && prev && t > rs + 2) target = (p + 1) * P + TOP;
    else if (t < rs) target = rs;
    else if (bt > re && bt - t <= re - rs && !(u.kind === 'toc' && typeof tocSplit === 'function' && re - t > 120)) target = (p + 1) * P + TOP;
    if (target !== null && prev && target > re) {
      // ขยายกรอบทดของข้อก่อนหน้าให้เต็มหน้า
      const pl = prev.els[prev.els.length - 1];
      const w = $('.b-work', pl);
      const pb = pl.offsetTop + pl.offsetHeight;
      if ((w || doc.settings.wdist) && pb <= re && Math.floor(pl.offsetTop / P) === p) {
        const add = re - pb - 4;
        if (add > 6 && doc.settings.wdist) { // แบบฝึก: กระจายพื้นที่ที่เหลือให้กรอบทดทุกกรอบในหน้านั้นตามสัดส่วนขนาดเดิม (ไม่เกิน 2 เท่า)
          const ws = $$('#flow > .blk .b-work').filter(x => { const o = x.closest('.blk').offsetTop; return o >= p * P && o < pb; });
          const base = ws.map(x => x.offsetHeight), sum = base.reduce((a, b) => a + b, 0) || 1;
          ws.forEach((x, i) => { x.style.height = (base[i] + Math.min(base[i], add * base[i] / sum)) + 'px'; }); t = first.offsetTop;
        } else if (add > 6) { w.style.height = (w.offsetHeight + add) + 'px'; t = first.offsetTop; }
      }
    }
    if (target !== null && target > re && first.classList.contains('inact')) { // กรอบกิจกรรม/ฝึกทันทีต่อหน้าใหม่: ปิดกรอบหน้าเดิม และใส่หัวกรอบซ้ำ (ต่อ)
      let h = first.previousElementSibling; while (h && !h.classList.contains('acthead')) h = h.previousElementSibling;
      if (h) { first.dataset.acttl = actTitleText(($('.b-activity', h) || h).querySelector('[data-f=html]') || h) + ' (ต่อ)'; first.dataset.actic = ((($('.aic', h) || {}).textContent) || ''); first.classList.add('actcont'); target += 32; }
      const pl = prev && prev.els[prev.els.length - 1]; if (pl && pl.classList.contains('inact')) pl.classList.add('actbrk');
    }
    if (target !== null) first.style.marginTop = Math.max(0, target - t) + 'px';
    if (typeof tblSplit === 'function') u.els.forEach(el => { if (el.dataset.t === 'table') tblSplit(el); });
    if (typeof tocSplit === 'function') u.els.forEach(el => { if (el.dataset.t === 'toc') tocSplit(el); });
    prev = u;
  }
  // กรอบทดแบบเต็มหน้าของข้อสุดท้าย
  if (prev) { const pl = prev.els[prev.els.length - 1]; const pbk = byId(pl.dataset.id); const w = $('.b-work', pl); if (w && pbk && pbk.full) { const p = Math.floor(pl.offsetTop / P); const re = p * P + PAGE_H - BOT; const add = re - (pl.offsetTop + pl.offsetHeight) - 4; if (add > 6) w.style.height = (w.offsetHeight + add) + 'px'; } }
  if (typeof atFill === 'function') atFill();
  const lastEl = flow.lastElementChild;
  const end = lastEl ? lastEl.offsetTop + lastEl.offsetHeight : TOP;
  const pages = Math.max(1, Math.floor((end - 1) / P) + 1);
  drawSheets(pages);
  if (typeof updateTOC === 'function') updateTOC();
  $('#stage').style.height = (pages * P - PAGE_G) + 'px';
  status(`${pages} หน้า`);
  scheduleNav();
}
/* ---------------- แถบนำทางซ้าย: สารบัญ (บุ๊กมาร์ก) และภาพย่อหน้า ---------------- */
const OUT_LV = { cover: 0, examcover: 0, soltitle: 0, chapter: 1, part: 1, asheet: 1, keytable: 1, section: 2, subsection: 3, activity: 3, problem: 2, solhead: 2 };
function plainText(h) { const d = document.createElement('div'); d.innerHTML = h || ''; $$('.mx', d).forEach(s => s.textContent = s.dataset.tex); return d.textContent.replace(/\s+/g, ' ').trim(); }
function outline() {
  const P = PAGE_H + PAGE_G; const out = [];
  doc.blocks.forEach(b => {
    if (!(b.t in OUT_LV) || b.nobm) return; if (b.t === 'problem' && !doc.settings.bmq) return; const el = $(`.blk[data-id="${b.id}"]`); if (!el) return;
    let title = b.t === 'lphead' ? plainText(b.plan) || 'แผนการจัดการเรียนรู้' : b.t === 'logohead' ? (b.xc ? 'ใบปะหน้า · ' : '') + plainText(String(b.html || '').split(/<br\s*\/?>/i)[0]) : b.t === 'chapter' ? [plainText(b.num), plainText(b.title)].filter(Boolean).join(' ') : FULLPAGE.has(b.t) ? 'ปก' : b.t === 'soltitle' ? plainText(b.title) || 'เฉลย' : b.t === 'asheet' ? 'กระดาษคำตอบ' : b.t === 'keytable' ? 'สรุปคำตอบ' : b.t === 'solhead' ? [plainText(b.num), b.ans ? 'ตอบ ' + plainText(b.ans) : ''].filter(Boolean).join(' · ') : plainText(b.html);
    if (!title) return; out.push({ id: b.id, lv: OUT_LV[b.t], title, page: Math.floor(el.offsetTop / P) + 1, y: el.offsetTop });
  });
  return out;
}
let navTimer = null, navTab = 'out';
function scheduleNav() { clearTimeout(navTimer); navTimer = setTimeout(buildNav, 500); }
function initNav() {
  $('#navTabs').onclick = e => { const b = e.target.closest('[data-t]'); if (!b) return; navTab = b.dataset.t; $$('#navTabs button').forEach(x => x.classList.toggle('on', x === b)); buildNav(); };
  $('#bNav').onclick = () => { document.body.classList.toggle('nonav'); };
}
function scrollToY(y) { const z = +($('#zoom').value) || 1; const sc = $('#scroller'); sc.scrollTo({ top: $('#stage').offsetTop + y * z - 20, behavior: 'smooth' }); }
function buildNav() {
  const box = $('#navBody'); if (!box || document.body.classList.contains('nonav')) return;
  if (navTab === 'out') {
    const o = outline();
    box.innerHTML = o.length ? o.map(x => `<button class="ol lv${x.lv}" data-id="${x.id}" data-y="${x.y}"><span>${esc(x.title)}</span><i>${x.page}</i></button>`).join('') : '<p class="hint">ยังไม่มีหัวข้อ · หัวบท หัวข้อ หัวข้อย่อย และหัวกิจกรรมจะขึ้นที่นี่ และกลายเป็นบุ๊กมาร์กในไฟล์ PDF</p>';
    box.onclick = e => { const b = e.target.closest('.ol'); if (!b) return; scrollToY(+b.dataset.y); selectBlock(b.dataset.id); };
  } else {
    const n = $('#sheets').childElementCount, P = PAGE_H + PAGE_G, k = 0.2;
    const st = $('#stage').cloneNode(true); st.removeAttribute('id');
    $$('[contenteditable]', st).forEach(e => e.removeAttribute('contenteditable')); $$('.tools,.wh,.grip,[id]', st).forEach(e => e.classList.contains('tools') || e.classList.contains('wh') || e.classList.contains('grip') ? e.remove() : e.removeAttribute('id'));
    box.innerHTML = '';
    const wrap = document.createElement('div'); wrap.className = 'thumbs'; wrap.style.height = (n * P * k) + 'px';
    const inner = document.createElement('div'); inner.className = 'thumbin'; inner.style.transform = `scale(${k})`; inner.appendChild(st); wrap.appendChild(inner);
    for (let i = 0; i < n; i++) { const t = document.createElement('button'); t.className = 'tpg'; t.style.top = (i * P * k) + 'px'; t.style.height = (PAGE_H * k) + 'px'; t.dataset.y = i * P; t.innerHTML = `<span>${i + 1}</span>`; wrap.appendChild(t); }
    box.appendChild(wrap);
    box.onclick = e => { const b = e.target.closest('.tpg'); if (b) scrollToY(+b.dataset.y); };
  }
}
function headLogo(s) { return s.logo || LOGOS.winged; }
function coverLogo(b) { const s = doc.settings || {}; return (b && b.logo) || s.clogo || LOGOS.round; }
function footText(s) { const ft = s.ft ?? 'Earth & Newton Education'; return esc((s.au ? 'จัดทำโดย ' + s.au : '') + (s.au && ft ? ' · ' : '') + ft); }
const PN_STYLES = { arabic: '1, 2, 3', thai: '๑, ๒, ๓', roman: 'i, ii, iii', Roman: 'I, II, III' };
function pnFmtNum(n, st) { if (st === 'thai') return String(n).replace(/\d/g, d => '๐๑๒๓๔๕๖๗๘๙'[d]); if (st === 'roman' || st === 'Roman') { const r = typeof toRoman === 'function' ? toRoman(Math.max(1, n)) : String(n); return st === 'Roman' ? r.toUpperCase() : r; } return String(n); }
function pageLabel(i, n, s) { // i เริ่มที่ 0 → { text, hide, blank }
  const p = i + 1; let num = (+s.pnStart || 1) + i, st = s.pnStyle || 'arabic', text = null, hide = s.pnPos === 'none', blank = false;
  if (s.pnAnchor && PN_ANCHOR) { if (p < PN_ANCHOR) { if ((s.pnFront || 'hide') === 'hide') hide = true; else text = s.pnFront === 'thai' ? (THAI_AL || 'กขค')[(p - 1) % 44] : s.pnFront === 'roman' ? pnFmtNum(p, 'roman') : null; } else num = (+s.pnStart || 1) + (p - PN_ANCHOR); }
  (s.pnRules || []).forEach(r => { const a = +r.a || 1, b = (r.b === '' || r.b == null) ? Infinity : +r.b; if (p < a || p > b) return;
    if (r.m === 'hide') hide = true; else if (r.m === 'blank') { blank = true; hide = true; } else if (r.m === 'text') { text = r.t || ''; hide = false; } else if (r.m === 'num') { num = (+r.s || 1) + (p - a); if (r.st) st = r.st; hide = s.pnPos === 'none'; } });
  const N = (+s.pnStart || 1) + n - 1; const f = text !== null ? text : (s.pnFmt ?? 'หน้า {n}');
  return { text: f.replace(/\{n\}/g, pnFmtNum(num, st)).replace(/\{N\}/g, pnFmtNum(N, st)), hide, blank };
}
let PN_ANCHOR = null;
function drawSheets(n) {
  const s = doc.settings, box = $('#sheets');
  PN_ANCHOR = null; if (s.pnAnchor) { const el = $(`.blk[data-id="${s.pnAnchor}"]`); if (el) PN_ANCHOR = Math.floor(el.offsetTop / (PAGE_H + PAGE_G)) + 1; }
  const sig = [s.hl, s.hr, s.au, s.ft, (s.logo || '').length, s.nologo, s.hline, s.pnPos, s.pnFmt, s.pnStart, s.pnStyle, JSON.stringify(s.pnRules || []), PN_ANCHOR, s.pnFront].join('|');
  if (box.childElementCount !== n || box.dataset.sig !== sig) {
    box.dataset.sig = sig;
    box.innerHTML = '';
    const pos = s.pnPos || 'br';
    for (let i = 0; i < n; i++) {
      const d = document.createElement('div'); const L = pageLabel(i, n, s); const pn = L.hide ? '' : `<span class="pn">${esc(L.text)}</span>`;
      d.className = 'sheet' + (L.blank ? ' blankpg' : ''); d.style.top = i * (PAGE_H + PAGE_G) + 'px';
      const hl = `<span class="hl">${esc(s.hl)}</span>`, hr = `<span class="hr">${esc(s.hr)}</span>`, fl = `<span class="fl">${footText(s)}</span>`;
      let h = `<div class="hw hwl">${pos === 'tl' ? pn : ''}${hl}</div>${s.nologo ? '' : `<img class="logo" src="${headLogo(s)}" alt="">`}<div class="hw hwr">${hr}${pos === 'tr' ? pn : ''}</div>${pos === 'tc' ? `<div class="hw hwc">${pn}</div>` : ''}`;
      if ((s.hline || 'dash') !== 'none') h += `<div class="hline${s.hline === 'solid' ? ' solid' : ''}"></div>`;
      h += `<div class="fw fwl">${pos === 'bl' ? pn : fl}</div><div class="fw fwr">${pos === 'br' ? pn : pos === 'bl' ? fl : ''}</div>${pos === 'bc' ? `<div class="fw fwc">${pn}</div>` : ''}`;
      d.innerHTML = h; box.appendChild(d);
    }
  }
}

/* ---------------- ตั้งค่า / ธีม ---------------- */
function mixHex(a, b, t) { const p = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16)); const x = p(a), y = p(b); return '#' + x.map((v, i) => Math.round(v + (y[i] - v) * t).toString(16).padStart(2, '0')).join(''); }
function themeOf(s) {
  if (s.theme === 'custom' && s.custom) { const c = s.custom; return { name: 'กำหนดเอง', dark: c.dark, brown: c.brown, gold: c.gold, orange: c.brown, sep: mixHex(c.brown, '#ffffff', .72), bar: mixHex(c.brown, '#ffffff', .86), chapA: c.dark, chapB: c.brown }; }
  return THEMES[s.theme] || THEMES.brown;
}
function applySettings() {
  const s = doc.settings, th = themeOf(s);
  const r = document.documentElement.style;
  ['dark', 'brown', 'gold', 'orange', 'sep', 'bar', 'chapA', 'chapB'].forEach(k => r.setProperty('--' + k, th[k]));
  document.body.classList.toggle('exam', s.size === 'exam');
  $('#sheets').dataset.sig = '';
  schedulePaginate();
}
function openSettings() {
  const s = doc.settings;
  $('#sHl').value = s.hl; $('#sHr').value = s.hr; $('#sAu').value = s.au; $('#sSize').value = s.size; $('#sFt').value = s.ft ?? 'Earth & Newton Education';
  $('#sLogoImg').src = headLogo(s); $('#sCLogoImg').src = coverLogo(null); $('#sNoLogo').checked = !!s.nologo;
  pnFill();
  const box = $('#sThemes'); box.innerHTML = '';
  Object.entries(THEMES).forEach(([k, th]) => {
    const b = document.createElement('button');
    b.className = 'tb'; b.style.borderColor = s.theme === k ? th.dark : '';
    b.innerHTML = `<span class="sw" style="background:${th.dark}"></span>${th.name}`;
    b.onclick = () => { s.theme = k; applySettings(); openSettings(); changed(); };
    box.appendChild(b);
  });
  const cu = s.custom || { dark: '#1f3864', brown: '#2e5597', gold: '#b8912f' };
  const cb = document.createElement('div'); cb.className = 'row'; cb.style.margin = '4px 0 0';
  cb.innerHTML = `<button class="tb" id="sCustom" style="${s.theme === 'custom' ? 'border-color:#222' : ''}">สีกำหนดเอง</button><label>เข้ม <input type="color" data-cu="dark" value="${cu.dark}"></label><label>หลัก <input type="color" data-cu="brown" value="${cu.brown}"></label><label>เน้น <input type="color" data-cu="gold" value="${cu.gold}"></label>`;
  box.appendChild(cb);
  $('#sCustom').onclick = () => { s.custom = Object.assign({}, cu, s.custom || {}); s.theme = 'custom'; applySettings(); renderAll(); openSettings(); changed(true); };
  $$('[data-cu]', cb).forEach(i => i.oninput = () => { s.custom = Object.assign({}, cu, s.custom || {}, { [i.dataset.cu]: i.value }); s.theme = 'custom'; applySettings(); changed(); });
  openDlg('#dSet');
}
$('#sLogoBtn').onclick = () => pickLogo('โลโก้หัวกระดาษ', d => { if (d) doc.settings.logo = d; else delete doc.settings.logo; $('#sLogoImg').src = headLogo(doc.settings); applySettings(); renderAll(); changed(true); });
$('#sCLogoBtn').onclick = () => pickLogo('โลโก้บนปก / หัวเฉลย', d => { if (d) doc.settings.clogo = d; else delete doc.settings.clogo; $('#sCLogoImg').src = coverLogo(null); renderAll(); changed(true); });
$('#sLogoIn').onchange = async e => { const f = e.target.files[0]; if (!f) return; doc.settings.logo = await readImage(f); e.target.value = ''; $('#sLogoImg').src = doc.settings.logo; applySettings(); renderAll(); changed(true); };
$('#sLogoReset').onclick = () => { delete doc.settings.logo; $('#sLogoImg').src = headLogo(doc.settings); applySettings(); renderAll(); changed(true); };
$('#sNoLogo').onchange = e => { doc.settings.nologo = e.target.checked || undefined; applySettings(); changed(true); };
['sHl', 'sHr', 'sAu', 'sFt'].forEach(id => $('#' + id).addEventListener('input', e => { const k = { sHl: 'hl', sHr: 'hr', sAu: 'au', sFt: 'ft' }[id]; doc.settings[k] = e.target.value; applySettings(); changed(); }));
$('#sSize').addEventListener('change', e => { doc.settings.size = e.target.value; applySettings(); changed(); });
$('#sOk').onclick = () => closeDlg('#dSet');
/* ---------- เลขหน้าและเส้นหัวกระดาษ ---------- */
function pnFill() {
  const s = doc.settings; $('#sHline').value = s.hline || 'dash'; $('#sPnPos').value = s.pnPos || 'br'; $('#sPnStyle').value = s.pnStyle || 'arabic'; $('#sPnStart').value = s.pnStart || 1;
  const f = s.pnFmt ?? 'หน้า {n}'; const pre = [...$('#sPnFmt').options].map(o => o.value); $('#sPnFmt').value = pre.includes(f) ? f : 'custom'; $('#sPnCustom').value = f; $('#sPnCustom').style.display = pre.includes(f) ? 'none' : '';
  pnRulesDraw();
}
function pnRulesDraw() {
  const R = doc.settings.pnRules || [];
  $('#sPnRules').innerHTML = R.map((r, i) => `<div class="pnr" data-i="${i}">หน้า <input type="number" min="1" data-r="a" value="${r.a || 1}"> ถึง <input type="number" min="1" data-r="b" value="${r.b ?? ''}" placeholder="ท้ายเล่ม">
    <select data-r="m">${[['hide', 'ไม่แสดงเลขหน้า'], ['blank', 'ไม่แสดงหัว–ท้ายกระดาษเลย'], ['num', 'นับเลขใหม่'], ['text', 'ตั้งชื่อหน้าเอง']].map(([k, v]) => `<option value="${k}"${r.m === k ? ' selected' : ''}>${v}</option>`).join('')}</select>
    ${r.m === 'num' ? `เริ่มที่ <input type="number" min="1" data-r="s" value="${r.s || 1}"> <select data-r="st">${Object.entries(PN_STYLES).map(([k, v]) => `<option value="${k}"${(r.st || 'arabic') === k ? ' selected' : ''}>${v}</option>`).join('')}</select>` : ''}
    ${r.m === 'text' ? `<input type="text" data-r="t" value="${esc(r.t || '')}" placeholder="เช่น ภาคผนวก ก หรือ คำนำ" style="flex:1;min-width:150px">` : ''}
    <button class="tb" data-rdel="${i}" title="ลบ">✕</button></div>`).join('') || '<span class="hint">ยังไม่มี — ใช้กับหน้าปก คำนำ สารบัญ หรือหน้าที่อยากตั้งชื่อเฉพาะ</span>';
}
$('#sPnRules').addEventListener('input', e => { const el = e.target.closest('[data-r]'); if (!el) return; const i = +el.closest('.pnr').dataset.i; const r = doc.settings.pnRules[i]; r[el.dataset.r] = el.value; if (el.dataset.r === 'm') pnRulesDraw(); applySettings(); changed(); });
$('#sPnRules').addEventListener('click', e => { const b = e.target.closest('[data-rdel]'); if (!b) return; doc.settings.pnRules.splice(+b.dataset.rdel, 1); pnRulesDraw(); applySettings(); changed(true); });
$('#sPnAdd').onclick = () => { (doc.settings.pnRules = doc.settings.pnRules || []).push({ a: 1, b: 1, m: 'hide' }); pnRulesDraw(); applySettings(); changed(true); };
$('#sHline').onchange = e => { doc.settings.hline = e.target.value; applySettings(); changed(true); };
$('#sPnPos').onchange = e => { doc.settings.pnPos = e.target.value; applySettings(); changed(true); };
$('#sPnStyle').onchange = e => { doc.settings.pnStyle = e.target.value; applySettings(); changed(true); };
$('#sPnStart').oninput = e => { doc.settings.pnStart = Math.max(1, +e.target.value || 1); applySettings(); changed(); };
$('#sPnFmt').onchange = e => { const v = e.target.value; $('#sPnCustom').style.display = v === 'custom' ? '' : 'none'; if (v !== 'custom') { doc.settings.pnFmt = v; applySettings(); changed(true); } else $('#sPnCustom').focus(); };
$('#sPnCustom').oninput = e => { doc.settings.pnFmt = e.target.value; applySettings(); changed(); };
$('#bSet').onclick = openSettings;

/* ---------------- หน้าต่าง ---------------- */
function openDlg(s) { $(s).classList.add('open'); }
function closeDlg(s) { $(s).classList.remove('open'); }
$$('.dlg-back').forEach(d => d.addEventListener('mousedown', e => { if (e.target === d && d.id !== 'dFig') d.classList.remove('open'); }));
function ask(title, bodyHTML, yesText = 'ตกลง') {
  return new Promise(res => {
    $('#askT').textContent = title; $('#askBody').innerHTML = bodyHTML; $('#askYes').textContent = yesText;
    openDlg('#dAsk');
    $('#askYes').onclick = () => { closeDlg('#dAsk'); res(true); };
    $('#askNo').onclick = () => { closeDlg('#dAsk'); res(false); };
  });
}

/* ---------------- ประวัติ (ย้อนกลับ/ทำซ้ำ) ---------------- */
let saveTimer = null;
function changed(immediate) {
  clearTimeout(saveTimer);
  saveTimer = setTimeout(() => { snapshot(); autosave(); }, immediate ? 0 : 700);
  schedulePaginate();
}
function snapshot() {
  if (hist.lock) return;
  const s = JSON.stringify(doc);
  if (hist.stack[hist.pos] === s) return;
  hist.stack = hist.stack.slice(0, hist.pos + 1); hist.stack.push(s);
  if (hist.stack.length > 120) hist.stack.shift();
  hist.pos = hist.stack.length - 1;
}
function restore(pos) { hist.lock = true; doc = JSON.parse(hist.stack[pos]); hist.pos = pos; renderAll(); hist.lock = false; autosave(); }
$('#bUndo').onclick = () => { snapshot(); if (hist.pos > 0) restore(hist.pos - 1); };
$('#bRedo').onclick = () => { if (hist.pos < hist.stack.length - 1) restore(hist.pos + 1); };
function autosave() { try { localStorage.setItem('en-editor-draft', JSON.stringify(doc)); } catch (e) { } }

/* ---------------- การเลือกบล็อก / แก้ไข ---------------- */
const flowEl = $('#flow');
flowEl.addEventListener('focusin', e => {
  const blk = e.target.closest('.blk'); if (!blk) return; blockMode = false; if (!selSet.has(blk.dataset.id) || selSet.size > 1) selectBlock(blk.dataset.id); else { curId = blk.dataset.id; paintSel(); }
});
flowEl.addEventListener('mousedown', e => {
  const blk = e.target.closest('.blk'); if (!blk || e.button !== 0) return;
  if (e.target.closest('.tools,.grip')) return;
  if (e.metaKey || e.ctrlKey) { e.preventDefault(); if (document.activeElement && document.activeElement.blur) document.activeElement.blur(); blockMode = true; selectBlock(blk.dataset.id, 'toggle'); return; }
  if (e.shiftKey && (blockMode || selSet.size > 1 || !e.target.closest('[contenteditable="true"]'))) { e.preventDefault(); if (document.activeElement && document.activeElement.blur) document.activeElement.blur(); blockMode = true; selectBlock(blk.dataset.id, 'range'); return; }
  if (!e.target.closest('[contenteditable="true"]')) { // คลิกส่วนที่ไม่ใช่ข้อความ (รูป กรอบทด การหาร) = เลือกทั้งกล่อง
    if (document.activeElement && document.activeElement.blur && document.activeElement.closest && document.activeElement.closest('#flow')) document.activeElement.blur();
    blockMode = true; selectBlock(blk.dataset.id); paintSel(); return;
  }
  blockMode = false; selectBlock(blk.dataset.id);
});
/* การเลือก: one = เลือกกล่องเดียว · toggle = Ctrl/⌘+คลิก · range = Shift+คลิก */
let selSet = new Set(), blockMode = false;
function selectBlock(id, how = 'one') {
  if (!id) return;
  if (how === 'one') { if (curId === id && selSet.size === 1 && selSet.has(id)) { paintSel(); return; } selSet = new Set([id]); }
  else if (how === 'toggle') {
    if (selSet.has(id) && selSet.size > 1) { selSet.delete(id); if (curId === id) curId = [...selSet].pop(); paintSel(); refreshInspector(); return; }
    selSet.add(id);
  } else if (how === 'range') {
    const a = idx(curId || id), z = idx(id); const [lo, hi] = a < z ? [a, z] : [z, a];
    for (let i = lo; i <= hi; i++) selSet.add(doc.blocks[i].id);
    paintSel(); refreshInspector(); return;
  }
  curId = id; paintSel(); refreshInspector();
}
function paintSel() {
  [...selSet].forEach(id => { if (!byId(id)) selSet.delete(id); });
  if (curId && !byId(curId)) curId = null;
  $$('#flow > .blk').forEach(x => { const id = x.dataset.id; x.classList.toggle('sel', id === curId && !blockMode); x.classList.toggle('msel', selSet.has(id) && (blockMode || selSet.size > 1)); });
}
function selIds() { const s = selSet.size ? selSet : (curId ? new Set([curId]) : new Set()); return doc.blocks.filter(b => s.has(b.id)).map(b => b.id); }
flowEl.addEventListener('input', e => {
  const t = e.target.closest('[contenteditable="true"]'); if (!t) return;
  autoMath(t);
  syncFrom(t);
});
flowEl.addEventListener('paste', e => {
  const t = e.target.closest('[contenteditable="true"]'); if (!t) return;
  e.preventDefault();
  const text = (e.clipboardData || window.clipboardData).getData('text/plain');
  document.execCommand('insertText', false, text);
});
/* ---------- การขึ้นบรรทัดใหม่ / ย่อหน้าใหม่ ----------
   Enter = ขึ้นบรรทัดใหม่ในกล่องเดิม · Enter ซ้ำบนบรรทัดว่างท้ายย่อหน้า = ย่อหน้าใหม่
   Ctrl/⌘+Enter = ย่อหน้าใหม่ทันที · ในหัวข้อ/ป้ายข้อ Enter = ไปบรรทัดถัดไป
   Backspace ในกล่องว่าง = ลบกล่อง · ลูกศรขึ้น/ลงที่ขอบกล่อง = ย้ายไปกล่องข้างเคียง */
const ONE_LINE = new Set(['h3', 'soltitle', 'section', 'subsection', 'problem', 'chapter', 'activity', 'cover', 'examcover', 'part', 'solhead', 'people', 'table', 'timeline', 'choices']);
function caretInfo(t) {
  const s = getSelection(); if (!s.rangeCount) return {}; const r = s.getRangeAt(0);
  const pre = document.createRange(); pre.selectNodeContents(t); pre.setEnd(r.startContainer, r.startOffset);
  const post = document.createRange(); post.selectNodeContents(t); post.setStart(r.endContainer, r.endOffset);
  const a = document.createElement('div'); a.appendChild(pre.cloneContents()); const z = document.createElement('div'); z.appendChild(post.cloneContents());
  const atEnd = !z.textContent.replace(/[\u200b\s]/g, '') && !z.querySelector('.mx,.ic,.blank,img');
  const atStart = !a.textContent.replace(/[\u200b\s]/g, '') && !a.querySelector('.mx,.ic,.blank,img,br');
  return { r, atEnd, atStart, emptyLine: /<br>\s*$/.test(a.innerHTML) || /<div>(<br>)?<\/div>\s*$/.test(a.innerHTML) };
}
function isEmptyEd(t) { return !t.textContent.replace(/[\u200b\s]/g, '') && !t.querySelector('.mx,.ic,.blank,img'); }
function newParaAfter(blk, type = 'para') { selectBlock(blk.dataset.id); curId = blk.dataset.id; const i = idx(blk.dataset.id); const b = newBlock(type); doc.blocks.splice(i + 1, 0, b); renderAll(); changed(true); const ed = $(`.blk[data-id="${b.id}"] [contenteditable="true"]`); if (ed) { selectBlock(b.id); placeCaretEnd(ed); ed.scrollIntoView({ block: 'nearest' }); } }
function edsOf(blk) { return $$('[contenteditable="true"]', blk).filter(e => e.offsetParent !== null); }
function moveTo(blk, dir) {
  let n = dir < 0 ? blk.previousElementSibling : blk.nextElementSibling;
  while (n && !edsOf(n).length) n = dir < 0 ? n.previousElementSibling : n.nextElementSibling;
  if (!n) return false; const eds = edsOf(n); const ed = dir < 0 ? eds[eds.length - 1] : eds[0];
  if (dir < 0) placeCaretEnd(ed); else { ed.focus(); const r = document.createRange(); r.selectNodeContents(ed); r.collapse(true); const s = getSelection(); s.removeAllRanges(); s.addRange(r); }
  return true;
}
flowEl.addEventListener('keydown', e => {
  const t = e.target.closest('[contenteditable="true"]'); if (!t) return;
  const blk = t.closest('.blk'), type = blk.dataset.t;
  if (e.isComposing) return;
  if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) { e.preventDefault(); newParaAfter(blk); return; }
  if (e.key === 'Enter' && !e.shiftKey) {
    if (ONE_LINE.has(type) || t.dataset.pf || t.dataset.cell) {
      e.preventDefault();
      { const eds = edsOf(blk), k = eds.indexOf(t); if (k >= 0 && k < eds.length - 1) { placeCaretEnd(eds[k + 1]); return; } }
      if (!moveTo(blk, 1)) newParaAfter(blk); return;
    }
    const ci = caretInfo(t);
    if (ci.atEnd && ci.emptyLine && edsOf(blk).length === 1) {
      e.preventDefault(); t.innerHTML = t.innerHTML.replace(/(<br>\s*|<div><br><\/div>\s*)+$/, ''); syncFrom(t);
      newParaAfter(blk, ['para', 'given'].includes(type) ? 'para' : 'para'); return;
    }
    e.preventDefault(); document.execCommand('insertLineBreak'); return;
  }
  if (e.key === 'Backspace' && isEmptyEd(t) && edsOf(blk).length === 1 && !['chapter', 'cover', 'examcover'].includes(type) && doc.blocks.length > 1) {
    e.preventDefault(); const id = blk.dataset.id; const prev = blk.previousElementSibling;
    doc.blocks.splice(idx(id), 1); curId = null; renderAll(); changed(true);
    setTimeout(() => { const p = prev && $(`.blk[data-id="${prev.dataset.id}"]`); const eds = p ? edsOf(p) : []; if (eds.length) { selectBlock(p.dataset.id); placeCaretEnd(eds[eds.length - 1]); } }, 30);
    return;
  }
  if ((e.key === 'ArrowUp' || e.key === 'ArrowDown') && !e.shiftKey) {
    const s = getSelection(); if (!s.rangeCount) return; const rr = s.getRangeAt(0).getClientRects()[0]; const tr = t.getBoundingClientRect();
    const lh = parseFloat(getComputedStyle(t).lineHeight) || 20; const z = +($('#zoom').value) || 1;
    const ci = caretInfo(t);
    const edge = e.key === 'ArrowUp' ? (ci.atStart || (rr && rr.top - tr.top < lh * z * 0.8)) : (ci.atEnd || (rr && tr.bottom - rr.bottom < lh * z * 0.8));
    if (edge) { const eds = edsOf(blk), k = eds.indexOf(t), dir = e.key === 'ArrowUp' ? -1 : 1; const nk = k + dir; if (nk >= 0 && nk < eds.length) { e.preventDefault(); if (dir < 0) placeCaretEnd(eds[nk]); else { eds[nk].focus(); } return; } if (moveTo(blk, dir)) e.preventDefault(); }
  }
});
function focusNext(blk) { moveTo(blk, 1); }
function placeCaretEnd(el) { el.focus(); const r = document.createRange(); r.selectNodeContents(el); r.collapse(false); const s = getSelection(); s.removeAllRanges(); s.addRange(r); }
document.addEventListener('selectionchange', () => {
  const s = getSelection(); if (!s.rangeCount) return;
  const r = s.getRangeAt(0); const n = r.startContainer.nodeType === 1 ? r.startContainer : r.startContainer.parentElement;
  if (n && n.closest && n.closest('#flow [contenteditable="true"]')) lastRange = r.cloneRange();
});

/* ปุ่มเครื่องมือของบล็อก */
flowEl.addEventListener('click', e => {
  const btn = e.target.closest('[data-act]');
  if (btn) { e.preventDefault(); blockAction(btn.dataset.act, btn.closest('.blk').dataset.id, btn); return; }
  const mx = e.target.closest('.mx');
  if (mx) { openMath(mx); return; }
});
flowEl.addEventListener('dblclick', e => {
  const f = e.target.closest('.b-figure'); if (f) { const id = f.closest('.blk').dataset.id; if (byId(id).lib) openLibrary(id); else openFigure(id); }
  const dv = e.target.closest('.b-divide'); if (dv) openDivision(dv.closest('.blk').dataset.id);
});
function blockAction(act, id, btn) {
  const i = idx(id), b = doc.blocks[i];
  if (act === 'up' && i > 0) { doc.blocks.splice(i - 1, 0, doc.blocks.splice(i, 1)[0]); renderAll(); }
  else if (act === 'down' && i < doc.blocks.length - 1) { doc.blocks.splice(i + 1, 0, doc.blocks.splice(i, 1)[0]); renderAll(); }
  else if (act === 'dup') { const c = JSON.parse(JSON.stringify(b)); c.id = uid(); doc.blocks.splice(i + 1, 0, c); renderAll(); }
  else if (act === 'del') { if (curId === id) curId = null; doc.blocks.splice(i, 1); setTimeout(refreshInspector, 0); if (!doc.blocks.length) doc.blocks.push({ id: uid(), t: 'para', html: '' }); renderAll(); }
  else if (act === 'add') { selectBlock(id); openInsertMenu(btn); return; }
  else if (act === 'wplus') { b.h = (b.h || 40) + 10; rerender(id); }
  else if (act === 'wminus') { b.h = Math.max(10, (b.h || 40) - 10); rerender(id); }
  else if (act === 'trow') { b.rows.push(b.rows[0].map(() => '')); rerender(id); }
  else if (act === 'lplus') { b.n = Math.min(40, (b.n || 4) + 1); rerender(id); }
  else if (act === 'lminus') { b.n = Math.max(1, (b.n || 4) - 1); rerender(id); }
  else if (act === 'tcol') { b.rows.forEach(r => r.push('')); rerender(id); }
  else if (act === 'tins' || act === 'trdel') { const r = typeof curTableRow === 'function' ? curTableRow(id) : -1; if (r < 0) { toast('คลิกในแถวของตารางก่อน'); return; } if (act === 'tins') { b.rows.splice(r + 1, 0, b.rows[r].map(() => '')); if (b.rs) { const m = {}; Object.entries(b.rs).forEach(([k, v]) => m[+k > r ? +k + 1 : k] = v); b.rs = m; } } else if (b.rows.length > 1) { b.rows.splice(r, 1); if (b.rs) { const m = {}; Object.entries(b.rs).forEach(([k, v]) => { if (+k !== r) m[+k > r ? +k - 1 : k] = v; }); b.rs = m; } } rerender(id); }
  else if (act === 'tdel') { if (b.rows.length > 1) b.rows.pop(); rerender(id); }
  else if (act === 'wbig') { b.w = Math.min(100, (b.w || 60) + 10); rerender(id); }
  else if (act === 'wsmall') { b.w = Math.max(20, (b.w || 60) - 10); rerender(id); }
  else if (act === 'fedit') { if (b.lib) openLibrary(id); else openFigure(id); return; }
  else if (act === 'padd') { b.items.push({ name: '', en: '', yrs: '', desc: '', sym: '' }); rerender(id); }
  else if (act === 'pdel') { if (b.items.length > 1) b.items.pop(); rerender(id); }
  else if (act === 'dvedit') { openDivision(id); return; }
  else if (act === 'ccols') { const seq = [5, 3, 2, 1]; const c = b.cols || 0; b.cols = seq[(seq.indexOf(c) + 1) % seq.length]; rerender(id); }
  else if (act === 'bkind') { const ks = Object.keys(BOXES); b.kind = ks[(ks.indexOf(b.kind) + 1) % ks.length]; if (Object.values(BOXES).includes(b.title)) b.title = BOXES[b.kind]; rerender(id); }
  changed(true);
}

/* ---------------- แทรกบล็อก ---------------- */
function newBlock(t, extra = {}) {
  const b = { id: uid(), t };
  if (t === 'chapter') Object.assign(b, { num: 'บทที่ ' + nextNum('chapter'), title: '', sub: '' });
  if (t === 'problem') b.html = 'ข้อ ' + nextNum('problem');
  if (t === 'choices') b.items = ['', '', '', '', ''];
  if (t === 'box') { b.kind = extra.kind || 'thm'; b.title = BOXES[b.kind]; b.html = ''; }
  if (t === 'work') b.h = 40;
  if (t === 'table') b.rows = [['หัวตาราง', 'หัวตาราง', 'หัวตาราง'], ['', '', ''], ['', '', '']];
  if (t === 'timeline') b.rows = [['ปี', 'เหตุการณ์'], ['', '']];
  if (t === 'lines') { b.n = 4; b.gap = 9; }
  if (t === 'people') { b.cols = 3; b.items = [{ name: 'ชื่อนักคณิตศาสตร์', en: 'English Name', yrs: 'พ.ศ. ...', desc: 'ผลงานสำคัญ', sym: 'n!' }, { name: '', en: '', yrs: '', desc: '', sym: '' }, { name: '', en: '', yrs: '', desc: '', sym: '' }]; }
  if (t === 'activity') b.html = 'กิจกรรมที่ ' + nextAct();
  if (t === 'cover') Object.assign(b, defaultCover());
  if (t === 'examcover') Object.assign(b, defaultExamCover());
  if (t === 'part') { b.html = 'ตอนที่ 1'; b.info = 'ข้อ 1–10 · ข้อละ 3 คะแนน'; }
  if (t === 'asheet') b.cfg = AS_PRESETS.alevel();
  if (t === 'keytable') { b.key = ''; b.cols = 10; b.from = 1; }
  if (t === 'h3') { b.tone = extra.tone || 'navy'; b.html = 'ขั้นที่ 1 ...'; }
  if (t === 'soltitle') { b.brand = 'Earth &amp; Newton Education'; b.title = 'เฉลยละเอียด'; b.sub = 'ชื่อชุดข้อสอบ'; }
  if (t === 'solhead') { b.num = 'ข้อ ' + (doc.blocks.filter(x => x.t === 'solhead').length + 1); b.pts = '3'; b.ans = ''; }
  if (typeof extNewBlock === 'function') extNewBlock(b);
  return Object.assign(b, extra);
}
function nextAct() { let n = 0; doc.blocks.forEach(b => { if (b.t === 'activity') n++; }); return n + 1; }
function nextNum(t) {
  let n = 0;
  doc.blocks.forEach(b => {
    if (t === 'problem' && b.t === 'problem') { const m = /ข้อ\s*(\d+)/.exec(b.html.replace(/<[^>]+>/g, '')); if (m) n = Math.max(n, +m[1]); }
    if (t === 'chapter' && b.t === 'chapter') { const m = /(\d+)/.exec(b.num || ''); if (m) n = Math.max(n, +m[1]); }
  });
  return n + 1;
}
function insertBlocks(list) {
  let i = curId ? idx(curId) : doc.blocks.length - 1;
  if (curId) {
    const cur = byId(curId);
    // ถ้ากำลังอยู่ในข้อ ให้แทรกหลังข้อนั้นทั้งข้อ เมื่อแทรกข้อใหม่
    if (list[0].t === 'problem' && (cur.t === 'problem' || GROUP_MEMBERS.has(cur.t))) { while (i + 1 < doc.blocks.length && GROUP_MEMBERS.has(doc.blocks[i + 1].t)) i++; }
  }
  doc.blocks.splice(i + 1, 0, ...list);
  renderAll();
  changed(true);
  const first = list[0];
  setTimeout(() => {
    const el = $(`.blk[data-id="${first.id}"]`); if (!el) return;
    selectBlock(first.id);
    const e = (list[0].t === 'problem' && list.length > 1 ? list.slice(1) : list).map(b => $(`.blk[data-id="${b.id}"] [contenteditable="true"]`)).find(Boolean);
    if (e) { placeCaretEnd(e); e.scrollIntoView({ block: 'center', behavior: 'smooth' }); } else el.scrollIntoView({ block: 'center' });
  }, 80);
  return first;
}
const TEMPLATES = [
  ['ข้อแบบฝึก (โจทย์ + คำถาม + กรอบทด)', () => [newBlock('problem'), newBlock('given'), newBlock('question'), newBlock('work')]],
  ['ข้อปรนัย (โจทย์ + ตัวเลือก + กรอบทด)', () => [newBlock('problem'), newBlock('given'), newBlock('question'), newBlock('choices'), newBlock('work', { h: 30 })]],
  ['ตัวอย่างพร้อมวิธีทำ', () => { const p = newBlock('problem'); p.html = 'ตัวอย่างที่ ' + nextEx(); return [p, newBlock('given'), newBlock('question'), newBlock('idea'), newBlock('solution'), newBlock('answer')]; }],
  ['เฉลยข้อสอบ ข้อละหน้า (หัวแถบ ทวนโจทย์ แนวคิด ขั้นตอน ระวัง ตรวจ ตอบ)', () => [newBlock('solhead'), newBlock('box', { kind: 'plain', title: 'โจทย์', html: '' }), newBlock('idea', { st: { lt: 'แนวคิดหลัก' } }), newBlock('para', { html: '• สิ่งที่โจทย์ให้มา: <br>• สิ่งที่ต้องหา: ' }), newBlock('solution', { st: { lt: 'ขั้นที่ 1 ...' } }), newBlock('solution', { st: { lt: 'ขั้นที่ 2 ...' } }), newBlock('solution', { st: { lt: 'ขั้นที่ 3 ...' } }), newBlock('caution'), newBlock('check'), newBlock('answer')]],
  ['ข้อสอบปรนัย 4 ตัวเลือก (มีคะแนน)', () => [newBlock('problem', { pts: '1' }), newBlock('given'), newBlock('question'), newBlock('choices', { items: ['', '', '', ''] }), newBlock('work', { h: 30 })]],
  ['ข้อสอบตอบเป็นตัวเลข (ข้อละ 1 หน้า แบบสมาคมฯ)', () => [newBlock('problem', { pts: '3' }), newBlock('given'), newBlock('question'), newBlock('work', { h: 60, full: true, wl: 'พื้นที่แสดงวิธีทำ / พื้นที่สำหรับทด' })]],
  ['แบบฝึก: ผลการเรียนรู้', () => [newBlock('box', { kind: 'key', title: 'ผลการเรียนรู้', html: '1. ...<br>2. ...<br>3. ...' })]],
  ['แบบฝึก: ระดับความยากของแบบฝึก (ดาว)', () => [newBlock('subsection', { html: 'ระดับความยากของแบบฝึกทักษะ' }), newBlock('table', { rows: [['ระดับ', 'ความหมาย'], ['S1', 'ใช้สูตรหรือบทนิยามแทนค่าได้โดยตรง'], ['S2', 'ต้องเลือกใช้หลักการให้ถูกก่อนคำนวณ'], ['S3', 'ต้องแยกกรณีหรือใช้หลายหลักการร่วมกัน'], ['S4', 'แนวข้อสอบ A-Level / ประยุกต์'], ['S5', 'ท้าทาย แนวข้อสอบแข่งขัน']].map((r, i) => i ? [Array(i).fill('<span class=\"ic\" contenteditable=\"false\" data-ic=\"ดาว\"></span>').join(''), r[1]] : r) })]],
  ['แบบฝึก: ตารางประเมินตนเอง', () => [newBlock('subsection', { html: 'แบบประเมินตนเองหลังเรียน' }), newBlock('table', { rows: [['หัวข้อ', 'เข้าใจดีมาก', 'พอใช้', 'ต้องทบทวน'], ['1.1 ...', '', '', ''], ['1.2 ...', '', '', ''], ['1.3 ...', '', '', '']] })]],
  ['แบบฝึก: ทดสอบความพร้อมก่อนเรียน', () => [newBlock('section', { html: 'ทดสอบความพร้อมก่อนเรียน' }), newBlock('box', { kind: 'inst', title: '', html: '<b>คำชี้แจง</b> ทำแบบทดสอบนี้เพื่อตรวจว่าความรู้พื้นฐานพร้อมสำหรับหน่วยนี้หรือไม่ ข้อที่ทำไม่ได้ให้ทบทวนเรื่องที่ระบุไว้ก่อนเริ่มเรียน' }), newBlock('problem', { html: 'ข้อ 1', skill: 'ทักษะ: ' }), newBlock('given'), newBlock('question'), newBlock('work', { h: 30, ans: true })]],
  ['แบบฝึก: บทสรุป + การเชื่อมโยง', () => [newBlock('box', { kind: 'key', title: 'บทสรุป', html: '1) ...<br>2) ...' }), newBlock('box', { kind: 'link', title: 'การเชื่อมโยงกับวิชาอื่น', html: '...' })]],
  ['เฉลยละเอียด (แนวคิด วิธีทำ ตรวจ ระวัง ตอบ)', () => [newBlock('problem'), newBlock('question'), newBlock('idea'), newBlock('solution'), newBlock('check'), newBlock('caution'), newBlock('answer')]],
  ['ข้อแบบฝึกพร้อมทักษะ + เส้นคำตอบ', () => [newBlock('problem', { skill: 'ทักษะ: ' }), newBlock('given'), newBlock('question'), newBlock('work', { ans: true })]],
  ['กิจกรรม (หัวกิจกรรม + เนื้อหา + กรอบทด)', () => [newBlock('activity'), newBlock('para'), newBlock('question'), newBlock('work'), newBlock('actend')]],
  ['เขียนด้วยคำพูดของตนเอง + บรรทัด', () => [newBlock('box', { kind: 'write', html: '(ก) ...' }), newBlock('lines', { n: 4 })]],
  ['คำชี้แจง', () => [newBlock('box', { kind: 'inst', title: 'คำชี้แจง', html: 'ให้นักเรียน...' })]],
];
function nextEx() { let n = 0; doc.blocks.forEach(b => { if (b.t === 'problem') { const m = /ตัวอย่างที่\s*[\d.]*?(\d+)$/.exec(b.html.replace(/<[^>]+>/g, '').trim()); if (m) n = Math.max(n, +m[1]); } }); return n + 1; }
$('#bAddQ').onclick = () => insertBlocks(TEMPLATES[0][1]());
/* ชุดสำเร็จรูปแบ่งหมวด: [ชื่อหมวด, [[ลำดับใน TEMPLATES, ชื่อที่แสดง, คำอธิบาย] หรือ ['ACT', ชื่อ, คำอธิบาย, การทำงาน]]] */
const TPL_GROUPS = [
  ['ข้อแบบฝึกและตัวอย่าง', [[0, 'ข้อแบบฝึก', 'โจทย์ คำถาม และกรอบทด'], [12, 'ข้อแบบฝึกพร้อมทักษะ', 'ป้ายทักษะ โจทย์ คำถาม กรอบทด และเส้นคำตอบ'], [1, 'ข้อปรนัย', 'โจทย์ คำถาม ตัวเลือก 5 ข้อ และกรอบทด'], [2, 'ตัวอย่างพร้อมวิธีทำ', 'ตัวอย่างที่ ... โจทย์ แนวคิด วิธีทำ ตอบ']]],
  ['เฉลย', [[11, 'เฉลยละเอียด (แบบฝึก)', 'แนวคิด วิธีทำ ตรวจคำตอบ ข้อควรระวัง ตอบ'], ['ACT', 'เฉลยข้อสอบแนวสมาคมฯ ทั้งชุด…', 'หัวเฉลย สรุปคำตอบแยกตอน แล้วข้อละหน้า ตามรูปแบบชุด L', () => { openExamBuilder(); $('#ebPreset').value = 'assoc'; ebLoad('assoc'); }], ['ACT', 'เฉลยข้อสอบ 1 ข้อ (แบบสมาคมฯ)', 'แถบ ข้อ · คะแนน · คำตอบ → ทวนโจทย์ → แนวคิดหลัก → สิ่งที่ให้มา → ขั้นที่ 1–3 → ข้อควรระวัง → ตรวจคำตอบ → ตอบ', () => { const n = doc.blocks.filter(x => x.t === 'solhead').length + 1; insertBlocks(solBlocks(n, 3)); }], [3, 'เฉลยข้อสอบ ข้อละหน้า (แบบกล่อง)', 'หัวแถบ ทวนโจทย์ แนวคิดหลัก ขั้นที่ 1–3 ระวัง ตรวจ ตอบ'], ['ACT', 'ตารางสรุปคำตอบ', 'ตารางข้อ / คำตอบ ใส่คำตอบในแผงรูปแบบ', () => insertBlocks([newBlock('keytable')])]]],
  ['ข้อสอบ', [['ACT', 'สร้างชุดข้อสอบทั้งชุด…', 'A-Level · สมาคมฯ · PMC · NETSAT · ชุดเก็ง · กลางภาค หรือกำหนดเอง พร้อมปกและกระดาษคำตอบ', () => openExamBuilder()], [4, 'ข้อสอบปรนัย 4 ตัวเลือก', 'ป้ายข้อพร้อมคะแนน โจทย์ คำถาม ตัวเลือก กรอบทด'], [5, 'ข้อสอบตอบเป็นตัวเลข (ข้อละหน้า)', 'แบบสมาคมฯ กรอบทดเต็มที่เหลือของหน้า'], ['ACT', 'จัดหน้าข้อสอบ (ข้อต่อหน้า)…', 'กำหนดทีละข้อว่าจะให้กี่ข้อต่อหน้า ข้อสั้นรวมหน้า ข้อยาวแยกหน้า', () => openPagePlan()], ['ACT', 'กระดาษคำตอบแบบฝน…', 'เลือกแบบสำเร็จรูปหรือกำหนดจำนวนข้อ ชนิด หลักตัวเลขเอง', () => openAnswerSheet(null)], ['ACT', 'ปกข้อสอบ', 'โลโก้ ตารางจำนวนข้อ คะแนน เวลา ชื่อ–ชั้น–เลขที่ คำชี้แจง', () => insertBlocks([newBlock('examcover')])], ['ACT', 'หัวตอน', 'แถบ “ตอนที่ ...” พร้อมช่วงข้อและคะแนน', () => insertBlocks([newBlock('part')])]]],
  ['ส่วนประกอบแบบฝึกทักษะ', [['ACT', 'หน้าปกแบบฝึก', 'ป้าย ม.5 ชื่อบท วงกลมสูตร แถบผู้จัดทำ', () => insertBlocks([newBlock('cover')])], [9, 'ทดสอบความพร้อมก่อนเรียน', 'หัวข้อ คำชี้แจง ข้อพร้อมทักษะ และเส้นคำตอบ'], [13, 'กิจกรรม', 'แถบหัวกิจกรรม เนื้อหา คำถาม กรอบทด และกรอบล้อม'], [14, 'เขียนด้วยคำพูดของตนเอง', 'กล่องคำถาม + บรรทัดสำหรับเขียน'], [15, 'คำชี้แจง', 'กล่องเหลืองเส้นประ'], [6, 'ผลการเรียนรู้', 'กล่องสรุปรายการ'], [7, 'ระดับความยาก (ดาว)', 'ตารางระดับ 1–5 ดาว พร้อมความหมาย'], [8, 'ตารางประเมินตนเอง', 'หัวข้อ · เข้าใจดีมาก · พอใช้ · ต้องทบทวน'], [10, 'บทสรุป + การเชื่อมโยง', 'กล่องบทสรุปและกล่องเชื่อมโยงกับวิชาอื่น'], ['ACT', 'บุคคลสำคัญ', 'การ์ดภาพบุคคล ชื่อ ปี ผลงาน', () => insertBlocks([newBlock('people')])]]],
];
let tplCat = 0;
function partsOf(list) { const seen = []; list.forEach(b => { const n = b.t === 'box' ? (BOXES[b.kind] || 'กล่อง') : (TYPES[b.t] || b.t).replace(/ \(.*\)$/, ''); if (!seen.includes(n)) seen.push(n); }); return seen; }
function openQuick() {
  $('#qkCats').innerHTML = TPL_GROUPS.map(([n], i) => `<button data-c="${i}" class="${i === tplCat ? 'on' : ''}">${n}</button>`).join('');
  showQuick(); openDlg('#dQuick');
}
function showQuick() {
  $$('#qkCats button').forEach((b, i) => b.classList.toggle('on', i === tplCat));
  $('#qkList').innerHTML = TPL_GROUPS[tplCat][1].map((it, j) => {
    const chips = typeof it[0] === 'number' ? partsOf(TEMPLATES[it[0]][1]()).map(c => `<i>${esc(c)}</i>`).join('') : '';
    return `<button class="qk" data-j="${j}"><b>${esc(it[1])}</b><span>${esc(it[2])}</span>${chips ? `<div class="chips">${chips}</div>` : ''}</button>`;
  }).join('');
}
$('#qkCats').onclick = e => { const b = e.target.closest('[data-c]'); if (!b) return; tplCat = +b.dataset.c; showQuick(); };
$('#qkList').onclick = e => { const b = e.target.closest('.qk'); if (!b) return; const it = TPL_GROUPS[tplCat][1][+b.dataset.j]; closeDlg('#dQuick'); if (it[0] === 'ACT') it[3](); else insertBlocks(TEMPLATES[it[0]][1]()); };
$('#bQuick').onclick = () => openQuick();
function buildInsertMenu() {
  const m = $('#mInsert'); m.classList.add('cols');
  const grp = (title, inner) => `<div class="g"><div class="hd">${title}</div>${inner}</div>`;
  const btns = ts => ts.map(t => `<button data-ins="${t}">${TYPES[t].replace(/ \(.*\)$/, '')}</button>`).join('');
  let h = `<div class="g wide"><button data-ins="quick" class="big">▦ ชุดสำเร็จรูป… <small>ข้อแบบฝึก เฉลย ข้อสอบ ส่วนประกอบแบบฝึก</small></button></div>`;
  h += grp('ข้อความและหัวข้อ', btns(['chapter', 'section', 'subsection', 'para', 'activity', 'actend', 'pagebreak'].concat(TYPES.divider ? ['divider'] : [])));
  h += grp('ส่วนของข้อ', btns(['problem', 'given', 'question', 'choices', 'idea', 'solution', 'check', 'caution', 'answer', 'work', 'lines'].concat(['anstab', 'scorebox'].filter(t => TYPES[t]))));
  const bx = ks => ks.map(k => `<button data-box="${k}"><span class="dot" style="background:${BOXCOL[k]}"></span>${BOXES[k]}</button>`).join('');
  h += grp('กล่องคณิตศาสตร์', bx(['def', 'thmf', 'lem', 'cor', 'prop', 'axm', 'formula', 'rule', 'crit', 'notat', 'conv', 'proof', 'cex', 'conj', 'algo']));
  h += grp('กล่องการเรียนรู้', bx(['thm', 'key', 'obj', 'prior', 'tip', 'note', 'remark', 'warn', 'caution2', 'try', 'exam', 'app', 'hist', 'link', 'write', 'inst', 'recap', 'plain']));
  h += grp('รูป ตาราง และสื่อ', `<button data-ins="lib">วาดรูป…</button><button data-ins="image">รูปภาพจากเครื่อง</button>` + btns(['table', 'divide', 'timeline', 'people']));
  h += grp('หน้าพิเศษ', btns(['cover', 'examcover', 'part', 'asheet'].concat(TYPES.scoresum ? ['scoresum'] : [])));
  h += grp('เฉลยข้อสอบ', btns(['soltitle', 'keytable', 'solhead', 'h3']));
  if (TYPES.wbban) h += grp('แบบฝึกทักษะ', btns(['wbban', 'skull', 'reflect']));
  if (typeof npInsertMenuGroup === 'function') { const g = npInsertMenuGroup(); h = (typeof npMode === 'function' && npMode() === 'phys') ? h.replace('</div>', '</div>' + g) : h + g; }
  if (typeof QTYPES === 'object') h += grp('ข้อสอบ (แทรกทั้งข้อ)', Object.entries(QTYPES).map(([k, v]) => `<button data-qins="${k}">${v}</button>`).join(''));
  if (TYPES.pjch) h += grp('งานเอกสาร (โครงงาน · บันทึกข้อความ · ใบปะหน้า)', btns(['logohead', 'pjcover', 'pjch', 'pjsec', 'pjtext', 'pjinfo', 'toc', 'memohead', 'memocmt', 'cshead', 'signln'].filter(t => TYPES[t])));
  h += grp('แผนการสอน', `<button data-ins="lessonplan"><b>ตัวสร้างแผนการสอน…</b></button>` + btns(['lphead', 'lpsec', 'lpbar', 'lpstep', 'lpsign']));
  m.innerHTML = h;
  m.onclick = e => {
    const b = e.target.closest('button'); if (!b) return;
    closeMenus();
    if (b.dataset.qins) { insertQ(b.dataset.qins); return; }
    if (b.dataset.box) insertBlocks([newBlock('box', { kind: b.dataset.box })]);
    else if (b.dataset.ins === 'quick') openQuick();
    else if (b.dataset.ins === 'figure' || b.dataset.ins === 'lib') openLibrary(null);
    else if (b.dataset.ins === 'image') { imgReplace = null; $('#imgIn').click(); }
    else if (b.dataset.ins === 'divide') openDivision(null);
    else if (b.dataset.ins === 'asheet') openAnswerSheet(null);
    else if (b.dataset.ins === 'lessonplan') openLessonPlan();
    else insertBlocks([newBlock(b.dataset.ins)]);
  };
}
function openMenuAt(menu, anchor) {
  closeMenus();
  const r = anchor.getBoundingClientRect();
  menu.style.left = Math.max(8, Math.min(r.left, innerWidth - (menu.classList.contains('cols') ? 740 : 300))) + 'px'; menu.style.top = (r.bottom + 4) + 'px';
  menu.style.position = 'fixed';
  menu.classList.add('open');
}
function closeMenus() { $$('.menu').forEach(m => m.classList.remove('open')); }
function openInsertMenu(anchor) { openMenuAt($('#mInsert'), anchor); }
$('#bInsert').onclick = e => { e.stopPropagation(); openInsertMenu(e.currentTarget); };
document.addEventListener('mousedown', e => { if (!e.target.closest('.menu') && !e.target.closest('#bInsert,#fFg,#fHi,#fIcon,[data-act="add"]')) closeMenus(); });
let imgReplace = null;
function readImage(f) {
  return new Promise((res, rej) => {
    const rd = new FileReader();
    rd.onload = () => {
      // ย่อรูปที่ใหญ่มากเพื่อไม่ให้ไฟล์งานหนักเกินไป
      const im = new Image(); im.onload = () => {
        const max = 1800; if (/svg|gif/.test(f.type) || (im.width <= max && im.height <= max && f.size < 900000)) return res(rd.result);
        const k = Math.min(1, max / Math.max(im.width, im.height)); const cv = document.createElement('canvas'); cv.width = Math.round(im.width * k); cv.height = Math.round(im.height * k);
        const g = cv.getContext('2d'); g.fillStyle = '#fff'; g.fillRect(0, 0, cv.width, cv.height); g.drawImage(im, 0, 0, cv.width, cv.height);
        res(cv.toDataURL(/png/.test(f.type) ? 'image/png' : 'image/jpeg', 0.9));
      }; im.onerror = () => res(rd.result); im.src = rd.result;
    };
    rd.onerror = rej; rd.readAsDataURL(f);
  });
}
async function addImages(files) {
  const list = [...files].filter(f => /^image\//.test(f.type)); if (!list.length) return;
  const bs = []; for (const f of list) bs.push(newBlock('image', { src: await readImage(f), w: 60 }));
  insertBlocks(bs);
}
$('#imgIn').onchange = async e => {
  const fs = e.target.files; if (!fs.length) return;
  if (imgReplace) { const b = byId(imgReplace); imgReplace = null; if (b) { b.src = await readImage(fs[0]); rerender(b.id); changed(true); } }
  else await addImages(fs);
  e.target.value = '';
};
$('#bImg').onclick = () => { imgReplace = null; $('#imgIn').click(); };
document.addEventListener('paste', e => {
  const all = [...((e.clipboardData && e.clipboardData.items) || [])];
  const items = all.filter(i => i.type.startsWith('image/'));
  if (!items.length || all.some(i => i.type === 'text/plain')) return; e.preventDefault(); e.stopPropagation(); addImages(items.map(i => i.getAsFile()));
}, true);
$('#scroller').addEventListener('dragover', e => { if ([...e.dataTransfer.types].includes('Files')) e.preventDefault(); });
$('#scroller').addEventListener('drop', e => {
  if (!e.dataTransfer.files.length) return; e.preventDefault();
  const blk = e.target.closest && e.target.closest('.blk'); if (blk) selectBlock(blk.dataset.id);
  addImages(e.dataTransfer.files);
});
$('#bFig').onclick = () => openLibrary(null);

/* ---------------- จัดรูปแบบข้อความ ---------------- */
$$('[data-cmd]').forEach(b => b.addEventListener('mousedown', e => { e.preventDefault(); document.execCommand(b.dataset.cmd); }));

function mkMath(tex, disp) { const sp = document.createElement('span'); sp.className = 'mx'; sp.setAttribute('contenteditable', 'false'); sp.dataset.tex = tex; if (disp) sp.dataset.disp = '1'; return sp; }
function autoMath(ed) {
  const w = document.createTreeWalker(ed, NodeFilter.SHOW_TEXT);
  let n; const hits = [];
  while ((n = w.nextNode())) { if (n.parentElement.closest('.mx')) continue; if (/\$[^$\n]+\$/.test(n.nodeValue)) hits.push(n); }
  hits.forEach(node => {
    const m = /\$([^$\n]+)\$/.exec(node.nodeValue);
    const after = node.splitText(m.index); const rest = after.splitText(m[0].length);
    const sp = mkMath(m[1].trim()); after.replaceWith(sp);
    if (!/^\s/.test(rest.nodeValue)) rest.nodeValue = ' ' + rest.nodeValue;
    renderMath(ed);
    const r = document.createRange(); r.setStart(rest, 1); r.collapse(true); const s = getSelection(); s.removeAllRanges(); s.addRange(r);
  });
}

/* ---------------- บันทึก / เปิด ---------------- */
let DL = null;
async function initDownloads() {
  try { if (window.claude && claude.use) DL = await claude.use('downloads'); } catch (e) { DL = null; }
}
async function saveFile(filename, data) {
  if (!DL) await initDownloads();
  if (DL) {
    try { await DL.save({ filename, data }); toast('บันทึกไฟล์แล้ว'); return true; }
    catch (e) { if (e && e.code === 'declined') { toast('ยกเลิกการบันทึก'); return false; } }
  }
  // สำรอง: ดาวน์โหลดผ่านลิงก์ (ใช้ได้เมื่อเปิดไฟล์นอก claude.ai)
  try {
    const blob = data instanceof Blob ? data : new Blob([data]);
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = filename; document.body.appendChild(a); a.click(); a.remove();
    toast('กำลังดาวน์โหลด ' + filename); return true;
  } catch (e) { toast('บันทึกไฟล์ไม่ได้ในหน้านี้'); return false; }
}
function fname(ext) { return (doc.settings.name || 'เอกสาร').replace(/[\\/:*?"<>|]/g, ' ').trim() + '.' + ext; }
$('#bSave').onclick = async () => {
  const name = await askName(); if (!name) return;
  doc.settings.name = name; changed(true);
  saveFile(fname('npress'), JSON.stringify(doc));
};
function askName() {
  return new Promise(res => {
    ask('บันทึกงาน', `<div class="row"><label for="askName">ชื่อไฟล์</label><input type="text" id="askName" style="flex:1" value="${esc(doc.settings.name || 'เอกสาร')}"></div><p style="font-size:16px;color:#7b746c;margin:4px 0">ได้ไฟล์ .npress เก็บไว้ในเครื่อง แล้วกด “เปิด” เพื่อแก้ต่อภายหลัง</p>`, 'บันทึก')
      .then(ok => res(ok ? ($('#askName').value.trim() || 'เอกสาร') : null));
  });
}
$('#bOpen').onclick = () => $('#fileOpen').click();
$('#fileOpen').onchange = e => {
  const f = e.target.files[0]; if (!f) return;
  const rd = new FileReader();
  rd.onload = () => setTimeout(() => {
    try { const d = JSON.parse(rd.result); if (!d.blocks) throw 0; delete d.cloud; delete d.lfid; d.lfl = 1; doc = d; doc.settings = Object.assign(sampleDoc().settings, d.settings || {}); renderAll(); hist.stack = []; hist.pos = -1; snapshot(); autosave(); toast('เปิด ' + f.name + ' แล้ว'); }
    catch (err) { toast('เปิดไฟล์นี้ไม่ได้ ต้องเป็นไฟล์ .npress หรือ .json ที่บันทึกจากโปรแกรมนี้'); }
    busy(false);
  }, 60);
  busy(true, 'กำลังเปิดไฟล์ “' + f.name + '”'); rd.onerror = () => { busy(false); toast('อ่านไฟล์ไม่ได้'); };
  rd.readAsText(f); e.target.value = '';
};
$('#bNew').onclick = async () => {
  if (!(await ask('เริ่มเอกสารใหม่', '<p>งานที่ยังไม่ได้บันทึกเป็นไฟล์จะหายไป ต้องการเริ่มใหม่ไหม</p>', 'เลือกแม่แบบ'))) return;
  openTemplates();
};
$('#zoom').onchange = e => { $('#zoomwrap').style.zoom = e.target.value; };

/* ---------------- เริ่มต้น ---------------- */
function init() {
  let d = null;
  try { const s = localStorage.getItem('en-editor-draft'); if (s) { d = JSON.parse(s); if (!d.blocks) d = null; } } catch (e) { d = null; }
  // เปิดแอป = หน้าว่างเสมอ (งานครั้งก่อนเก็บไว้ให้กด “เปิดต่อ” ได้ — ดู tabs.js)
  { const sd = sampleDoc(); doc = { app: 'en-editor', v: 2, settings: Object.assign(sd.settings, { name: 'เอกสารใหม่', hl: '' }), blocks: [newBlock('para', { html: '' })] }; try { localStorage.removeItem('en-editor-draft'); } catch (e) { } }
  buildInsertMenu(); buildPalette(); buildFigTools(); initFormat(); buildIconMenu(); initNav();
  renderAll(); snapshot();
  if (document.fonts) document.fonts.ready.then(() => schedulePaginate());
  setTimeout(schedulePaginate, 600);
  initDownloads();
}

/* ===================== วงเล็บ/ปีกกา/ขีดเซต ปรับขนาดตามเนื้อหาอัตโนมัติ ===================== */
// ( ) [ ] \{ \} ที่ข้างในมีของสูง (เศษส่วน ราก ตัวยก ∑ ∫ \left …) → \left … \right ; \mid ในเซต → \middle|
const AD_TALL = /\\(?:d?frac|tfrac|genfrac|d?binom|sum|prod|int|iint|oint|lim|begin|overset|underset|underbrace|overbrace|stackrel|cfrac)\b/, AD_MID = /\\(?:left|sqrt|overline|hat|vec|bar|tilde|widehat)\b|\^\{?[^}]*[_^]/;
const AD_TEXT = /^\\(?:text|textbf|textit|mathrm|mathbf|operatorname|mbox|hbox|label|tag|color|textcolor)$/;
const AD_SIZED = /^\\(?:left|right|middle|big|Big|bigg|Bigg|bigl|bigr|Bigl|Bigr|biggl|biggr|Biggl|Biggr)$/;
function adTokens(t) { const T = []; let i = 0; while (i < t.length) { const c = t[i]; if (c === '\\') { const m = /^\\[a-zA-Z]+|^\\./.exec(t.slice(i)); const v = m ? m[0] : '\\'; T.push(v); i += v.length; } else { T.push(c); i++; } } return T; }
function autoDelims(t) {
  if (!t || !/[(\[]|\\\{/.test(t)) return t;
  const T = adTokens(t); const pre = Array(T.length).fill(''); const rep = {}; let depth = 0; const st = [];
  const OPEN = { '(': ')', '[': ']', '\\{': '\\}' }, CLOSE = { ')': '(', ']': '[', '\\}': '\\{' };
  for (let i = 0; i < T.length; i++) {
    const v = T[i];
    if (AD_TEXT.test(v)) { // ข้ามอาร์กิวเมนต์ข้อความ
      let j = i + 1; while (j < T.length && T[j] === ' ') j++; if (T[j] === '{') { let d = 0; for (; j < T.length; j++) { if (T[j] === '{') d++; else if (T[j] === '}' && --d === 0) break; } i = j; } continue; }
    if (v === '{') { depth++; continue; } if (v === '}') { depth--; continue; }
    const sized = i > 0 && AD_SIZED.test(T[i - 1]);
    if (OPEN[v] && !sized) { st.push({ i, v, depth, mids: [] }); continue; }
    if ((v === '\\mid' || v === '|') && st.length) { const top = st[st.length - 1]; if (top.v === '\\{' && top.depth === depth) top.mids.push(i); continue; }
    if (CLOSE[v] && !sized) {
      let k = st.length - 1; while (k >= 0 && st[k].depth > depth) k--; if (k < 0) continue; const o = st[k];
      if (o.v !== CLOSE[v] || o.depth !== depth) { if (o.depth === depth) st.splice(k, 1); continue; }
      st.splice(k, 1); const inner = T.slice(o.i + 1, i).join('');
      const big = AD_TALL.test(inner) ? 2 : AD_MID.test(inner) ? 1 : 0;
      if (big) { pre[o.i] = big === 2 ? '\\left' : '\\bigl'; pre[i] = big === 2 ? '\\right' : '\\bigr'; const bars = o.mids.filter(m => T[m] === '\\mid'); const pipes = o.mids.filter(m => T[m] === '|'); (bars.length ? bars : pipes.length === 1 ? pipes : []).forEach(m => rep[m] = big === 2 ? '\\;\\middle|\\;' : '\\;\\bigm|\\;'); }
    }
  }
  return T.map((v, i) => rep[i] ? ' ' + rep[i] + ' ' : (pre[i] ? pre[i] + (v.length === 1 ? v : v) : v)).join('').replace(/\\left\\\{/g, '\\left\\{').replace(/\\right\\\}/g, '\\right\\}');
}
const _prepTexAD = prepTex;
prepTex = function (t) { const s = _prepTexAD(t); try { const r = autoDelims(s); katex.renderToString(r, { throwOnError: true, strict: false }); return r; } catch (e) { return s; } };

/* ===================== หน้าปก ===================== */
function defaultCover() {
  const m = t => `<span class="mx" contenteditable="false" data-tex="${esc(t)}"></span>`;
  return {
    badge: 'แบบฝึกทักษะ', grade: 'ม.5', num: 'บทที่ 11', title: 'หลักการนับ', suf: '(เบื้องต้น)',
    f0: m('n!'), f1: m('P_{n,r}'), f2: m('\\binom{n}{r}'), f3: m('(a+b)^{n}'),
    subj: 'วิชาคณิตศาสตร์เพิ่มเติม ม.5 เล่ม 2',
    curr: 'ตามมาตรฐานการเรียนรู้และตัวชี้วัด<br>กลุ่มสาระการเรียนรู้คณิตศาสตร์ (ฉบับปรับปรุง พ.ศ. 2560)<br>ตามหลักสูตรแกนกลางการศึกษาขั้นพื้นฐาน พุทธศักราช 2551',
    auth: 'นายศาสตราวุฒิ อาชนะชัย', info: 'การศึกษาบัณฑิต สาขาคณิตศาสตร์<br>คณะศึกษาศาสตร์', brand: 'Earth &amp; Newton Education', circles: 4,
  };
}
function coverHTML(b) {
  const n = b.circles ?? 4;
  return `<div class="b-cover"><div class="cv">
    <div class="cv-top"></div>
    <div class="cv-badge" contenteditable="true" data-f="badge" data-ph="แบบฝึกทักษะ"></div>
    <div class="cv-grade"><div contenteditable="true" data-f="grade" data-ph="ม.5"></div></div>
    <div class="cv-num" contenteditable="true" data-f="num" data-ph="บทที่ ..."></div>
    <div class="cv-title"><span contenteditable="true" data-f="title" data-ph="ชื่อเรื่อง"></span><span class="cv-suf" contenteditable="true" data-f="suf" data-ph="(คำต่อท้าย)"></span></div>
    <div class="cv-circles">${Array.from({ length: n }, (_, i) => `<div class="cv-c"><div contenteditable="true" data-f="f${i}" data-ph="สูตร"></div></div>`).join('')}</div>
    <div class="cv-subj" contenteditable="true" data-f="subj" data-ph="ชื่อวิชา"></div>
    <div class="cv-curr" contenteditable="true" data-f="curr" data-ph="หลักสูตร"></div>
    <div class="cv-bot"><img class="cv-logo" alt=""><div class="cv-by" contenteditable="true" data-f="by" data-def="จัดทำโดย"></div>
      <div class="cv-auth" contenteditable="true" data-f="auth" data-ph="ชื่อผู้จัดทำ"></div>
      <div class="cv-info" contenteditable="true" data-f="info" data-ph="วุฒิ / สังกัด"></div>
      <div class="cv-brand" contenteditable="true" data-f="brand" data-ph="แบรนด์"></div></div>
  </div></div>`;
}
function fillCover(el, b) {
  $('.cv-logo', el).src = coverLogo(b);
  const cv = $('.cv', el);
  if (b.ca) cv.style.setProperty('--cvA', b.ca); if (b.cb) cv.style.setProperty('--cvB', b.cb);
}

