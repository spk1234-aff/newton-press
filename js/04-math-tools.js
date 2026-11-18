'use strict';
/* ===================== การหารยาว · การหารพหุนาม · การหารสังเคราะห์ ===================== */
/* เศษส่วน (ใช้ BigInt เพื่อไม่ให้ตัวเลขล้น) */
const bgcd = (a, b) => { a = a < 0n ? -a : a; b = b < 0n ? -b : b; while (b) [a, b] = [b, a % b]; return a; };
class Fr {
  constructor(n, d = 1n) { n = BigInt(n); d = BigInt(d); if (d < 0n) { n = -n; d = -d; } const g = bgcd(n, d) || 1n; this.n = n / g; this.d = d / g; }
  static parse(s) {
    s = String(s).trim(); if (!s) return new Fr(0);
    let m = /^([+-]?\d+)\s*\/\s*(\d+)$/.exec(s); if (m) return new Fr(m[1], m[2]);
    m = /^([+-]?)(\d*)\.(\d+)$/.exec(s); if (m) { const d = 10n ** BigInt(m[3].length); return new Fr(BigInt(m[1] + (m[2] || '0') + m[3]), d); }
    if (/^[+-]?\d+$/.test(s)) return new Fr(s);
    throw new Error('อ่านตัวเลข “' + s + '” ไม่ได้');
  }
  add(o) { return new Fr(this.n * o.d + o.n * this.d, this.d * o.d); }
  sub(o) { return new Fr(this.n * o.d - o.n * this.d, this.d * o.d); }
  mul(o) { return new Fr(this.n * o.n, this.d * o.d); }
  div(o) { if (o.n === 0n) throw new Error('หารด้วยศูนย์ไม่ได้'); return new Fr(this.n * o.d, this.d * o.n); }
  get zero() { return this.n === 0n; }
  get neg() { return this.n < 0n; }
  abs() { return new Fr(this.n < 0n ? -this.n : this.n, this.d); }
  isOne() { return this.n === 1n && this.d === 1n; }
  tex() { const a = this.abs(); const t = a.d === 1n ? String(a.n) : `\\frac{${a.n}}{${a.d}}`; return (this.neg ? '-' : '') + t; }
}
/* อ่านพหุนาม เช่น "x^3-2x^2+4", "2x^2 - 3/2x + 1" หรือสัมประสิทธิ์ "1, -2, 0, 4" */
function parsePoly(str, vHint) {
  str = String(str || '').replace(/−/g, '-').replace(/\s+/g, '').replace(/\*/g, '');
  if (!str) throw new Error('ยังไม่ได้ใส่พหุนาม');
  if (/^[-+\d./,]+$/.test(str) && str.includes(',')) {
    const cs = str.split(',').filter(x => x !== '').map(Fr.parse); const n = cs.length - 1;
    return { c: cs.map((_, i) => cs[i]).reverse(), v: vHint || 'x', deg: n };
  }
  const vm = /[a-z]/i.exec(str); const v = vm ? vm[0] : (vHint || 'x');
  const terms = str.match(/[+-]?[^+-]+/g) || [];
  const map = {};
  terms.forEach(t => {
    const m = new RegExp(`^([+-]?)([\\d./]*)(${v}(?:\\^\\{?(\\d+)\\}?)?)?$`).exec(t);
    if (!m) throw new Error('อ่านพจน์ “' + t + '” ไม่ได้');
    let coef = m[2] ? Fr.parse(m[2]) : new Fr(1); if (m[1] === '-') coef = new Fr(-coef.n, coef.d);
    if (!m[2] && !m[3]) throw new Error('อ่านพจน์ “' + t + '” ไม่ได้');
    const d = m[3] ? (m[4] ? +m[4] : 1) : 0;
    map[d] = (map[d] || new Fr(0)).add(coef);
  });
  let deg = Math.max(...Object.keys(map).map(Number)); while (deg > 0 && (!map[deg] || map[deg].zero)) deg--;
  const c = []; for (let i = 0; i <= deg; i++) c[i] = map[i] || new Fr(0);
  return { c, v, deg };
}
/* พจน์เดียวในรูป LaTeX: first = พจน์แรกของแถว (ไม่ใส่ +) */
function termTex(coef, d, v, first) {
  const a = coef.abs();
  let body = d === 0 ? a.tex() : ((a.isOne() ? '' : a.tex()) + v + (d > 1 ? `^{${d}}` : ''));
  if (first) return (coef.neg ? '-' : '') + body;
  return (coef.neg ? '-\\,' : '+\\,') + body;
}
function polyTex(P, zero) {
  let s = '', first = true;
  for (let d = P.deg; d >= 0; d--) { const c = P.c[d]; if (c.zero && !(zero && P.deg > 0)) continue; s += (first ? '' : ' ') + termTex(c, d, P.v, first); first = false; }
  return s || '0';
}
/* ---------- สร้างตาราง ---------- */
/* cell: {t: tex, c: 'คลาส'} */
function divLong(A, B, steps) {
  A = String(A).replace(/[,\s]/g, ''); B = String(B).replace(/[,\s]/g, '');
  if (!/^\d+$/.test(A) || !/^\d+$/.test(B)) throw new Error('การหารยาวใช้จำนวนเต็มบวก เช่น 7865 ÷ 23');
  const D = BigInt(A), d = BigInt(B); if (d === 0n) throw new Error('หารด้วยศูนย์ไม่ได้');
  const dig = A.split(''), n = dig.length, C = n + 2;
  const rows = [];
  const blank = () => Array.from({ length: C }, () => ({ t: '' }));
  const qrow = blank(), drow = blank();
  drow[0] = { t: B, c: 'dv-div' }; drow[1] = { t: '', c: 'dv-br ot' };
  dig.forEach((x, i) => drow[i + 2] = { t: x, c: 'ot' });
  rows.push(qrow, drow);
  // ขั้นตอน
  let cur = 0n, started = false; const stepsList = [];
  for (let i = 0; i < n; i++) {
    cur = cur * 10n + BigInt(dig[i]);
    if (!started && cur < d && i < n - 1) continue;
    const q = cur / d; qrow[i + 2] = { t: String(q), c: 'dv-q' }; started = true;
    stepsList.push({ i, cur, q, p: q * d, r: cur - q * d });
    cur = cur - q * d;
  }
  if (steps) {
    const put = (row, num, endCol, cls) => { const s = String(num); for (let k = 0; k < s.length; k++) row[endCol - s.length + 1 + k + 2] = { t: s[k], c: cls }; };
    const nz = stepsList.filter(s => s.q > 0n);
    nz.forEach((s, k) => {
      const pr = blank(); const w = Math.max(String(s.p).length, String(s.cur).length);
      put(pr, s.p, s.i, '');
      for (let c = s.i - w + 1; c <= s.i; c++) pr[c + 2] = Object.assign({}, pr[c + 2], { c: (pr[c + 2].c || '') + ' ub' });
      pr[s.i - w + 1 + 2 - 1] = { t: '-', c: 'dv-minus' };
      rows.push(pr);
      const nx = nz[k + 1]; const rr = blank();
      if (nx) put(rr, nx.cur, nx.i, ''); else put(rr, stepsList[stepsList.length - 1].r, n - 1, '');
      rows.push(rr);
    });
    if (!nz.length) { const rr = blank(); put(rr, D, n - 1, ''); rows.push(rr); }
  }
  return { rows, res: `ผลหาร $${D / d}$ เศษ $${D % d}$` };
}
function divPoly(Astr, Bstr, o) {
  const A = parsePoly(Astr), B = parsePoly(Bstr, A.v); if (B.deg === 0 && B.c[0].zero) throw new Error('หารด้วยศูนย์ไม่ได้');
  const v = A.v, n = A.deg, m = B.deg, C = n + 3;
  const col = d => n - d + 2;
  const blank = () => Array.from({ length: C }, () => ({ t: '' }));
  const showTerms = (row, P, from, to, cls, wrap) => { // พจน์ดีกรี from..to
    let first = true; const cells = [];
    for (let d = from; d >= to; d--) { const c = P[d] || new Fr(0); if (c.zero && !o.zero && !(from === to)) continue; row[col(d)] = { t: termTex(c, d, v, first), c: cls }; cells.push(col(d)); first = false; }
    if (!cells.length && from >= to) { row[col(to)] = { t: '0', c: cls }; cells.push(col(to)); }
    if (wrap && cells.length) { const a = cells[0], b = cells[cells.length - 1]; row[a].t = '-\\bigl(' + row[a].t; row[b].t = row[b].t + '\\bigr)'; }
    return cells;
  };
  const rows = []; const qrow = blank(), drow = blank();
  drow[0] = { t: polyTex(B, false), c: 'dv-div' }; drow[1] = { t: '', c: 'dv-br ot' };
  for (let d = n; d >= 0; d--) drow[col(d)] = { t: '', c: 'ot' };
  showTerms(drow, A.c, n, 0, 'ot', false);
  rows.push(qrow, drow);
  const rem = A.c.map(x => x); const Q = []; let firstQ = true;
  const work = [];
  for (let dl = n; dl >= m; dl--) {
    const c = rem[dl].div(B.c[m]); const k = dl - m; Q[k] = c;
    if (c.zero) continue;
    qrow[col(k)] = { t: termTex(c, k, v, firstQ), c: 'dv-q' }; firstQ = false;
    const prod = []; for (let j = 0; j <= m; j++) { prod[k + j] = B.c[j].mul(c); rem[k + j] = rem[k + j].sub(prod[k + j]); }
    work.push({ dl, prod: prod.slice(), after: rem.slice() });
  }
  for (let k = 0; k <= n - m; k++) if (!Q[k]) Q[k] = new Fr(0);
  if (o.steps) {
    work.forEach((w, i) => {
      const pr = blank(); const cells = showTerms(pr, w.prod, w.dl, w.dl - m, '', o.minus !== false);
      cells.forEach(c => pr[c].c = (pr[c].c || '') + ' ub'); rows.push(pr);
      const nx = work[i + 1]; const lo = Math.max(0, w.dl - 1 - m);
      const rr = blank(); showTerms(rr, w.after, w.dl - 1, nx ? lo : 0, '', false); rows.push(rr);
    });
  }
  const Rp = { c: rem.slice(0, Math.max(1, m)).map(x => x || new Fr(0)), v, deg: Math.max(0, m - 1) };
  while (Rp.deg > 0 && Rp.c[Rp.deg].zero) Rp.deg--;
  const Qp = { c: Q, v, deg: n - m < 0 ? 0 : n - m };
  return { rows, res: `ผลหาร $${n < m ? '0' : polyTex(Qp)}$ เศษเหลือ $${polyTex(Rp)}$` };
}
function divSynth(Astr, Bstr, o) {
  const A = parsePoly(Astr); let c;
  const s = String(Bstr).replace(/\s+/g, '').replace(/−/g, '-');
  if (/^[+-]?[\d./]+$/.test(s)) c = Fr.parse(s);
  else { const B = parsePoly(s, A.v); if (B.deg !== 1 || !B.c[1].isOne()) throw new Error('การหารสังเคราะห์ใช้ตัวหารรูป x − c เช่น x−3 หรือใส่ค่า c เลย'); c = new Fr(-B.c[0].n, B.c[0].d); }
  const n = A.deg, C = n + 2; const co = []; for (let d = n; d >= 0; d--) co.push(A.c[d]);
  const r1 = [{ t: c.tex(), c: 'vr dv-c' }].concat(co.map(x => ({ t: x.tex() })));
  const r2 = [{ t: '', c: 'vr' }, { t: '' }]; const r3 = [{ t: '', c: '' }];
  let acc = co[0]; r3.push({ t: acc.tex(), c: 'ot' });
  for (let i = 1; i <= n; i++) { const p = acc.mul(c); r2.push({ t: o.steps ? p.tex() : '' }); acc = co[i].add(p); r3.push({ t: o.steps ? (i === n ? `\\boxed{${acc.tex()}}` : acc.tex()) : '', c: 'ot' }); }
  if (n === 0) r3[1].c = 'ot dv-rem';
  // ผลลัพธ์
  const q = []; let a = co[0]; const qs = [a]; for (let i = 1; i < n; i++) { a = co[i].add(a.mul(c)); qs.push(a); }
  const R = co.reduce((s0, x, i) => i === 0 ? x : x.add(s0.mul(c)), new Fr(0));
  const Qp = { c: qs.slice().reverse(), v: A.v, deg: Math.max(0, n - 1) };
  return { rows: [r1, r2, r3], synth: true, res: `ผลหาร $${n === 0 ? '0' : polyTex(Qp)}$ เศษเหลือ $${R.tex()}$` };
}
function divisionModel(b) {
  const o = { steps: b.steps !== false, zero: !!b.zero, minus: b.minus !== false };
  if (b.kind === 'poly') return divPoly(b.a, b.b, o);
  if (b.kind === 'synth') return divSynth(b.a, b.b, o);
  return divLong(b.a, b.b, o.steps);
}
function divisionHTML(b) {
  let M; try { M = divisionModel(b); } catch (e) { return `<div class="dv-err">${esc(e.message)}</div>`; }
  const cell = x => `<td class="${x.c || ''}">${x.c && x.c.includes('dv-br') ? '<svg viewBox="0 0 10 40" preserveAspectRatio="none"><path d="M1 0 Q9 20 1 40" fill="none" stroke="currentColor" stroke-width="1.6" vector-effect="non-scaling-stroke"/></svg>' : (x.t ? kx(texFor(x.t, {})) : '')}</td>`;
  let h = `<table class="dv${M.synth ? ' dv-syn' : ''}">${M.rows.map(r => `<tr>${r.map(cell).join('')}</tr>`).join('')}</table>`;
  if (b.res && b.steps !== false) h += `<div class="dv-res">${M.res.replace(/\$([^$]+)\$/g, (_, t) => kx(texFor(t, {})))}</div>`;
  return h;
}
/* ---------- หน้าต่างตั้งค่าการหาร ---------- */
let divTarget = null;
const DIV_EX = { long: ['7865', '23'], poly: ['x^3 - 2x^2 + 4', 'x - 3'], synth: ['2x^3 - 3x^2 + 0x - 5', 'x - 2'] };
function openDivision(id, kind) {
  divTarget = id || null; const k0 = kind || 'long'; const b = id ? byId(id) : { kind: k0, a: DIV_EX[k0][0], b: DIV_EX[k0][1], res: true };
  $('#dvKind').value = b.kind || 'long'; $('#dvA').value = b.a || ''; $('#dvB').value = b.b || '';
  $('#dvSteps').checked = b.steps !== false; $('#dvRes').checked = !!b.res; $('#dvZero').checked = !!b.zero; $('#dvMinus').checked = b.minus !== false;
  dvHints(); dvPreview(); openDlg('#dDiv');
}
function dvRead() { return { kind: $('#dvKind').value, a: $('#dvA').value.trim(), b: $('#dvB').value.trim(), steps: $('#dvSteps').checked ? undefined : false, res: $('#dvRes').checked || undefined, zero: $('#dvZero').checked || undefined, minus: $('#dvMinus').checked ? undefined : false }; }
function dvHints() {
  const k = $('#dvKind').value;
  $('#dvLA').textContent = k === 'long' ? 'ตัวตั้ง (จำนวนเต็ม)' : 'ตัวตั้ง (พหุนาม)';
  $('#dvLB').textContent = k === 'long' ? 'ตัวหาร' : k === 'synth' ? 'ตัวหาร x − c (หรือค่า c)' : 'ตัวหาร (พหุนาม)';
  $('#dvA').placeholder = DIV_EX[k][0]; $('#dvB').placeholder = DIV_EX[k][1];
  $('#dvZeroR').style.display = k === 'poly' ? '' : 'none'; $('#dvMinusR').style.display = k === 'poly' ? '' : 'none';
}
function dvPreview() { const b = dvRead(); $('#dvPrev').innerHTML = `<div class="b-divide">${divisionHTML(b)}</div>`; }
$('#dvKind').onchange = () => { const k = $('#dvKind').value; $('#dvA').value = DIV_EX[k][0]; $('#dvB').value = DIV_EX[k][1]; dvHints(); dvPreview(); };
['dvA', 'dvB'].forEach(i => $('#' + i).addEventListener('input', dvPreview));
['dvSteps', 'dvRes', 'dvZero', 'dvMinus'].forEach(i => $('#' + i).addEventListener('change', dvPreview));
$('#dvCancel').onclick = () => closeDlg('#dDiv');
$('#dvOk').onclick = () => {
  const v = dvRead(); try { divisionModel(v); } catch (e) { toast(e.message); return; }
  closeDlg('#dDiv');
  if (divTarget) { const b = byId(divTarget); ['steps', 'res', 'zero', 'minus'].forEach(k => delete b[k]); Object.assign(b, JSON.parse(JSON.stringify(v))); rerender(b.id); changed(true); }
  else insertBlocks([Object.assign(newBlock('divide'), JSON.parse(JSON.stringify(v)))]);
};

/* ===================== ตัวอ่านสมการ (พิมพ์แบบธรรมดา หรือ LaTeX จากตัวแก้สมการ) ===================== */
const MP_FN = {
  sin: Math.sin, cos: Math.cos, tan: Math.tan, sec: x => 1 / Math.cos(x), csc: x => 1 / Math.sin(x), cosec: x => 1 / Math.sin(x), cot: x => 1 / Math.tan(x),
  arcsin: Math.asin, arccos: Math.acos, arctan: Math.atan, asin: Math.asin, acos: Math.acos, atan: Math.atan,
  sinh: Math.sinh, cosh: Math.cosh, tanh: Math.tanh, ln: Math.log, log: Math.log10, exp: Math.exp,
  sqrt: Math.sqrt, cbrt: Math.cbrt, abs: Math.abs, floor: Math.floor, ceil: Math.ceil, sgn: Math.sign, sign: Math.sign,
};
const MP_TEXN = { asin: '\\arcsin', acos: '\\arccos', atan: '\\arctan', cosec: '\\csc', sgn: '\\operatorname{sgn}', sign: '\\operatorname{sgn}', floor: '\\operatorname{floor}', ceil: '\\operatorname{ceil}' };
const MP_NAMES = Object.keys(MP_FN).concat(['pi', 'e', 'x', 'y', 't', 'n', 'theta']).sort((a, b) => b.length - a.length);
const mpErr = m => { const e = new Error(m); e.mp = 1; return e; };

function mpNormalize(src) {
  let s = String(src ?? '').trim();
  s = s.replace(/^\$+|\$+$/g, '');
  s = s.replace(/^\s*(?:y|[a-zA-Z]\s*\(\s*[a-z]\s*\))\s*=\s*/, '');           // y = …, f(x) = …
  s = s.replace(/\\(?:left|right|big|Big|bigg|Bigg)(?![a-zA-Z])/g, '').replace(/\\displaystyle|\\textstyle/g, '');
  s = s.replace(/\\[,;:!> ]/g, ' ').replace(/~/g, ' ');
  s = s.replace(/\\[dt]frac/g, '\\frac').replace(/\\operatorname\{(\w+)\}/g, ' $1 ').replace(/\\mathrm\{(\w+)\}/g, ' $1 ').replace(/\\text\{([^}]*)\}/g, ' $1 ');
  s = s.replace(/\\(cdot|times|ast)(?![a-zA-Z])/g, '*').replace(/\\div(?![a-zA-Z])/g, '/').replace(/\\(lvert|rvert|vert|mid)(?![a-zA-Z])/g, '|').replace(/\\\|/g, '|');
  s = s.replace(/\\(pi|theta)(?![a-zA-Z])/g, ' $1 ').replace(/\\(lfloor|rfloor|lceil|rceil)/g, m => ({ '\\lfloor': ' floor(', '\\rfloor': ')', '\\lceil': ' ceil(', '\\rceil': ')' })[m]);
  s = s.replace(/\\([a-zA-Z]+)/g, (m, n) => (n === 'frac' || n === 'sqrt') ? m : MP_FN[n] ? ' ' + n + ' ' : m);
  s = s.replace(/[−–—]/g, '-').replace(/[×·⋅∙]/g, '*').replace(/÷/g, '/').replace(/π/g, ' pi ').replace(/θ/g, ' theta ')
    .replace(/²/g, '^2').replace(/³/g, '^3').replace(/¹/g, '^1').replace(/⁴/g, '^4').replace(/√/g, ' sqrt ').replace(/∛/g, ' cbrt ').replace(/\*\*/g, '^').replace(/，/g, ',');
  return s;
}
function mpTokens(src) {
  const s = mpNormalize(src), out = []; let i = 0;
  while (i < s.length) {
    const c = s[i];
    if (/\s/.test(c)) { i++; continue; }
    if (/[\d.]/.test(c)) { let j = i; while (j < s.length && /[\d.]/.test(s[j])) j++; const t = s.slice(i, j); if (!/^\d*\.?\d+$|^\d+\.$/.test(t)) throw mpErr(`ตัวเลข “${t}” ไม่ถูกต้อง`); out.push({ k: 'num', v: parseFloat(t), s: t }); i = j; continue; }
    if (c === '\\') { const m = /^\\([a-zA-Z]+)/.exec(s.slice(i)); if (!m) throw mpErr('เครื่องหมาย \\ ไม่ถูกต้อง'); if (m[1] !== 'frac' && m[1] !== 'sqrt') throw mpErr(`ยังไม่รองรับคำสั่ง \\${m[1]}`); out.push({ k: 'cmd', v: m[1] }); i += m[0].length; continue; }
    if (/[a-zA-Z]/.test(c)) {
      let j = i; while (j < s.length && /[a-zA-Z]/.test(s[j])) j++; const w = s.slice(i, j); let p = 0;
      while (p < w.length) { const n = MP_NAMES.find(n => w.startsWith(n, p)); if (!n) throw mpErr(`ไม่รู้จัก “${w[p]}” — ใช้ x เป็นตัวแปร`); out.push({ k: 'id', v: n }); p += n.length; }
      i = j; continue;
    }
    if ('+-*/^!()[]{}|_,'.includes(c)) { out.push({ k: 'op', v: c }); i++; continue; }
    throw mpErr(`ไม่รู้จักเครื่องหมาย “${c}”`);
  }
  return out;
}
function mpParse(src) {
  const tk = mpTokens(src); let pos = 0, absOpen = 0;
  if (!tk.length) throw mpErr('ยังไม่ได้พิมพ์สมการ');
  const peek = () => tk[pos], isOp = (v, t = peek()) => t && t.k === 'op' && t.v === v;
  const eat = v => { if (!isOp(v)) throw mpErr(v === ')' ? 'วงเล็บไม่ครบ ขาด “)”' : v === '}' ? 'ขาด “}”' : `ขาด “${v}”`); pos++; };
  const startsPrimary = t => t && (t.k === 'num' || t.k === 'id' || t.k === 'cmd' || (t.k === 'op' && '([{'.includes(t.v)) || (t.k === 'op' && t.v === '|' && absOpen === 0));
  const isFnTok = t => t && t.k === 'id' && MP_FN[t.v];
  function expr() { let a = term(); while (isOp('+') || isOp('-')) { const op = tk[pos++].v; a = { t: 'add', op, a, b: term() }; } return a; }
  function term() {
    let a = unary();
    for (;;) {
      if (isOp('*') || isOp('/')) { const op = tk[pos++].v; a = { t: 'mul', op, a, b: unary() }; continue; }
      if (startsPrimary(peek())) { a = { t: 'mul', op: 'imp', a, b: power() }; continue; }
      return a;
    }
  }
  function unary() { if (isOp('-')) { pos++; return { t: 'neg', a: unary() }; } if (isOp('+')) { pos++; return unary(); } return power(); }
  function power() {
    let b = postfix();
    if (isOp('^')) {
      pos++; let e;
      // e^2x → e^(2x)
      if (b.t === 'const' && b.n === 'e' && peek() && peek().k === 'num' && tk[pos + 1] && tk[pos + 1].k === 'id' && !MP_FN[tk[pos + 1].v]) { const n = tk[pos++]; e = { t: 'mul', op: 'imp', a: { t: 'num', v: n.v }, b: postfix() }; }
      else e = isOp('-') ? (pos++, { t: 'neg', a: power() }) : power();
      b = { t: 'pow', a: b, b: e };
    }
    return b;
  }
  function postfix() { let a = primary(); while (isOp('!')) { pos++; a = { t: 'fact', a }; } return a; }
  function fnArg() {
    if (isOp('(')) { pos++; const e = expr(); eat(')'); return e; }
    if (isOp('{')) { pos++; const e = expr(); eat('}'); return e; }
    if (!startsPrimary(peek())) throw mpErr('ฟังก์ชันต้องมีค่าที่จะหา เช่น sin x หรือ sin(2x)');
    let a = power(); // sin 2x → sin(2x) ; หยุดที่ฟังก์ชันถัดไป
    while (startsPrimary(peek()) && !isFnTok(peek()) && !(peek().k === 'cmd')) a = { t: 'mul', op: 'imp', a, b: power() };
    return a;
  }
  function primary() {
    const t = peek(); if (!t) throw mpErr('สมการจบไม่สมบูรณ์');
    if (t.k === 'num') { pos++; return { t: 'num', v: t.v }; }
    if (t.k === 'op' && (t.v === '(' || t.v === '[' || t.v === '{')) { pos++; const e = expr(); eat({ '(': ')', '[': ']', '{': '}' }[t.v]); return { t: 'par', a: e }; }
    if (t.k === 'op' && t.v === '|') { pos++; absOpen++; const e = expr(); absOpen--; if (!isOp('|')) throw mpErr('ค่าสัมบูรณ์ต้องปิดด้วย “|”'); pos++; return { t: 'abs', a: e }; }
    if (t.k === 'cmd' && t.v === 'frac') { pos++; const a = fracArg(), b = fracArg(); return { t: 'frac', a, b }; }
    if (t.k === 'cmd' && t.v === 'sqrt') { pos++; let k = null; if (isOp('[')) { pos++; k = expr(); eat(']'); } return { t: 'root', a: rootArg(), k }; }
    if (t.k === 'id') {
      pos++;
      if (t.v === 'x' || t.v === 't' || t.v === 'n' || t.v === 'theta' || t.v === 'y') return { t: 'var', n: t.v };
      if (t.v === 'pi') return { t: 'const', n: 'pi' };
      if (t.v === 'e') return { t: 'const', n: 'e' };
      let pw = null, base = null, name = t.v;
      for (let k = 0; k < 2; k++) {
        if (isOp('^')) { pos++; pw = strip(isOp('-') ? (pos++, { t: 'neg', a: postfix() }) : postfix()); if (pw.t === 'neg') pw = { t: 'neg', a: strip(pw.a) }; }
        else if (isOp('_')) { pos++; base = strip(postfix()); }
      }
      if (pw && pw.t === 'neg' && pw.a.t === 'num' && pw.a.v === 1 && /^(sin|cos|tan)$/.test(name)) { name = 'arc' + name; pw = null; }
      if (base && name !== 'log') throw mpErr('ใส่ฐาน _ ได้เฉพาะ log');
      return { t: 'fn', n: name, a: fnArg(), pw, base };
    }
    if (t.k === 'op' && t.v === ')') throw mpErr('มีวงเล็บปิด “)” เกิน');
    throw mpErr(`พิมพ์ “${t.v}” ผิดตำแหน่ง`);
  }
  function fracArg() {
    if (isOp('{')) { pos++; const e = expr(); eat('}'); return e; }
    const t = peek(); if (t && t.k === 'num' && /^\d{2,}$/.test(t.s)) { const d = +t.s[0]; t.s = t.s.slice(1); t.v = +t.s; return { t: 'num', v: d }; }
    return postfix();
  }
  function rootArg() { if (isOp('{') || isOp('(')) { const c = tk[pos].v; pos++; const e = expr(); eat(c === '{' ? '}' : ')'); return e; } return fnArg(); }
  const r = expr();
  if (pos < tk.length) { const t = tk[pos]; throw mpErr(t.k === 'op' && t.v === ')' ? 'มีวงเล็บปิด “)” เกิน' : t.k === 'op' && t.v === '|' ? 'เครื่องหมาย | ไม่ครบคู่' : `พิมพ์ “${t.v}” ผิดตำแหน่ง`); }
  return r;
}
const mpGamma = z => { if (z < .5) return Math.PI / (Math.sin(Math.PI * z) * mpGamma(1 - z)); z -= 1; const g = 7, C = [0.99999999999980993, 676.5203681218851, -1259.1392167224028, 771.32342877765313, -176.61502916214059, 12.507343278686905, -0.13857109526572012, 9.9843695780195716e-6, 1.5056327351493116e-7]; let x = C[0]; for (let i = 1; i < g + 2; i++) x += C[i] / (z + i); const t = z + g + .5; return Math.sqrt(2 * Math.PI) * Math.pow(t, z + .5) * Math.exp(-t) * x; };
const mpFact = n => { if (n !== Math.floor(n)) return n > -1 || Math.abs(n - Math.round(n)) > 1e-9 ? mpGamma(n + 1) : NaN; if (n < 0) return NaN; let r = 1; for (let i = 2; i <= n; i++) r *= i; return r; };
const mpPowR = (u, v) => { // ยกกำลังเศษส่วน เช่น x^(2/3) เมื่อ x < 0
  if (u >= 0 || v === Math.round(v)) return Math.pow(u, v);
  for (let q = 3; q <= 15; q += 2) { const pp = v * q; if (Math.abs(pp - Math.round(pp)) < 1e-9) { const r = Math.pow(-u, v); return Math.round(pp) % 2 ? -r : r; } }
  return NaN;
};
function mpFn(n) {
  switch (n.t) {
    case 'num': { const v = n.v; return () => v; }
    case 'var': return n.n === 'y' ? (x, y) => y : x => x;
    case 'const': { const v = n.n === 'pi' ? Math.PI : Math.E; return () => v; }
    case 'par': return mpFn(n.a);
    case 'neg': { const a = mpFn(n.a); return (x, y) => -a(x, y); }
    case 'add': { const a = mpFn(n.a), b = mpFn(n.b); return n.op === '+' ? (x, y) => a(x, y) + b(x, y) : (x, y) => a(x, y) - b(x, y); }
    case 'mul': { const a = mpFn(n.a), b = mpFn(n.b); return n.op === '/' ? (x, y) => a(x, y) / b(x, y) : (x, y) => a(x, y) * b(x, y); }
    case 'frac': { const a = mpFn(n.a), b = mpFn(n.b); return (x, y) => a(x, y) / b(x, y); }
    case 'pow': { const a = mpFn(n.a), b = mpFn(n.b); return (x, y) => mpPowR(a(x, y), b(x, y)); }
    case 'abs': { const a = mpFn(n.a); return (x, y) => Math.abs(a(x, y)); }
    case 'fact': { const a = mpFn(n.a); return (x, y) => mpFact(a(x, y)); }
    case 'root': { const a = mpFn(n.a), k = n.k ? mpFn(n.k) : null; return (x, y) => { const u = a(x, y); if (!k) return Math.sqrt(u); const q = k(x, y); if (u < 0 && Math.round(q) % 2) return -Math.pow(-u, 1 / q); return Math.pow(u, 1 / q); }; }
    case 'fn': { const f = MP_FN[n.n], a = mpFn(n.a), p = n.pw ? mpFn(n.pw) : null, b = n.base ? mpFn(n.base) : null;
      const g = b ? (x, y) => Math.log(a(x, y)) / Math.log(b(x, y)) : (x, y) => f(a(x, y)); return p ? (x, y) => Math.pow(g(x, y), p(x, y)) : g; }
  }
  throw mpErr('สมการไม่ถูกต้อง');
}
/* ---------- แสดงผลเป็น LaTeX / ข้อความธรรมดา ---------- */
const MP_PREC = { add: 1, neg: 2, mul: 2, frac: 4, pow: 3, fact: 5 };
const mpNum = v => (Math.round(v * 1e9) / 1e9).toString();
function mpTex(n, ctx = 0) {
  const P = n => MP_PREC[n.t] || 6, wrap = (s, need) => need ? `\\left(${s}\\right)` : s;
  switch (n.t) {
    case 'num': return mpNum(n.v);
    case 'var': return n.n === 'theta' ? '\\theta' : n.n;
    case 'const': return n.n === 'pi' ? '\\pi' : 'e';
    case 'par': return wrap(mpTex(n.a), true);
    case 'neg': return wrap('-' + mpTex(n.a, 2), ctx > 2);
    case 'add': { const b = mpTex(n.b, n.op === '-' ? 2 : 1); return wrap(mpTex(n.a, 1) + (n.op === '+' && b.startsWith('-') ? '' : n.op) + b, ctx > 1); }
    case 'mul': {
      if (n.op === '/') return `\\dfrac{${mpTex(strip(n.a))}}{${mpTex(strip(n.b))}}`;
      const a = mpTex(n.a, 2), b = mpTex(n.b, 2.5); const imp = n.op === 'imp' || (/[a-z\\(]/i.test(b[0]) && !/^\d/.test(b)) && n.a.t !== 'fn';
      return wrap(a + (imp && !(/\d$/.test(a) && /^[\d.]/.test(b)) ? (/[a-z]$/i.test(a) && /^[a-z]/i.test(b) ? ' ' : '') : ' \\cdot ') + b, ctx > 2);
    }
    case 'frac': return `\\dfrac{${mpTex(n.a)}}{${mpTex(n.b)}}`;
    case 'pow': return `${mpTex(n.a, 3.5)}^{${mpTex(strip(n.b))}}`;
    case 'abs': return `\\left|${mpTex(n.a)}\\right|`;
    case 'fact': return mpTex(n.a, 5) + '!';
    case 'root': return n.k ? `\\sqrt[${mpTex(n.k)}]{${mpTex(n.a)}}` : `\\sqrt{${mpTex(n.a)}}`;
    case 'fn': {
      if (n.n === 'sqrt') return `\\sqrt{${mpTex(n.a)}}`; if (n.n === 'cbrt') return `\\sqrt[3]{${mpTex(n.a)}}`; if (n.n === 'abs') return `\\left|${mpTex(n.a)}\\right|`;
      if (n.n === 'exp' && !n.pw) return `e^{${mpTex(n.a)}}`;
      const nm = (MP_TEXN[n.n] || '\\' + n.n) + (n.base ? `_{${mpTex(n.base)}}` : '') + (n.pw ? `^{${mpTex(n.pw)}}` : '');
      const atom = n.a.t === 'num' || n.a.t === 'var' || n.a.t === 'const' || (n.a.t === 'mul' && n.a.op === 'imp' && n.a.a.t === 'num' && (n.a.b.t === 'var' || n.a.b.t === 'const'));
      return wrap(atom ? `${nm} ${mpTex(n.a)}` : `${nm}\\left(${mpTex(strip(n.a))}\\right)`, ctx > 2.4 && !atom);
    }
  }
  return '';
}
const strip = n => n.t === 'par' ? n.a : n;
function mpPlain(n, ctx = 0) {
  const w = (s, need) => need ? `(${s})` : s;
  switch (n.t) {
    case 'num': return mpNum(n.v);
    case 'var': return n.n; case 'const': return n.n;
    case 'par': return `(${mpPlain(n.a)})`;
    case 'neg': return w('-' + mpPlain(n.a, 2), ctx > 2);
    case 'add': return w(mpPlain(n.a, 1) + n.op + mpPlain(n.b, n.op === '-' ? 2 : 1), ctx > 1);
    case 'mul': case 'frac': { const op = n.t === 'frac' || n.op === '/' ? '/' : (n.op === 'imp' ? '' : '*'); const a = mpPlain(n.a, op === '' ? 3 : 2), b = mpPlain(n.b, op === '/' ? 3 : 2.5); return w(a + (op === '' && ((/\d$/.test(a) && /^\d/.test(b)) || (/[a-z]$/i.test(a) && /^[a-z]/i.test(b))) ? '*' : op) + b, ctx > 2); }
    case 'pow': return mpPlain(n.a, 3.5) + '^' + w(mpPlain(strip(n.b)), !['num', 'var', 'const'].includes(strip(n.b).t));
    case 'abs': return `|${mpPlain(n.a)}|`;
    case 'fact': return mpPlain(n.a, 5) + '!';
    case 'root': return n.k ? (mpPlain(n.k) === '3' ? `cbrt(${mpPlain(n.a)})` : `(${mpPlain(n.a)})^(1/${mpPlain(n.k, 3)})`) : `sqrt(${mpPlain(n.a)})`;
    case 'fn': return n.n + (n.base ? '_' + mpPlain(n.base, 5) : '') + (n.pw ? '^' + mpPlain(n.pw, 5) : '') + `(${mpPlain(strip(n.a))})`;
  }
  return '';
}
const MP_CACHE = new Map();
function mpCompile(src) {
  const key = String(src); if (MP_CACHE.has(key)) { const c = MP_CACHE.get(key); if (c instanceof Error) throw c; return c; }
  try { if (/=/.test(mpNormalize(src).replace(/<=|>=/g, ''))) throw mpErr('สมการที่มี = (เช่น x^2 + y^2 = 4) วาดได้ในรูป “กราฟของฟังก์ชัน” และ “ระนาบรวม”'); const ast = mpParse(src); if (mpHasY(ast)) throw mpErr('มีตัวแปร y — ช่องนี้ต้องเป็น y = f(x) (พิมพ์เฉพาะ f(x))'); const f0 = mpFn(ast), f = x => f0(x, 0); MP_CACHE.set(key, f); return f; } catch (e) { MP_CACHE.set(key, e); throw e; }
}
function mpCheck(src, o = {}) {
  try {
    if (o.implicit) { const im = mpImplicit(src); if (im) return { ok: true, tex: im.tex, plain: im.plain, implicit: true }; }
    mpCompile(src); const ast = mpParse(src); return { ok: true, tex: mpTex(ast), plain: mpPlain(ast) };
  } catch (e) { return { ok: false, err: e.mp ? e.message : 'สมการไม่ถูกต้อง' }; }
}

/* ---------- สมการความสัมพันธ์ (มี y) เช่น x^2 + y^2 = 4 ---------- */
const mpHasY = n => !n || typeof n !== 'object' ? false : (n.t === 'var' && n.n === 'y') || ['a', 'b', 'k', 'pw', 'base'].some(k => mpHasY(n[k]));
function mpSplitEq(src) { const s = mpNormalize(src).replace(/<=|>=/g, m => m === '<=' ? '≤' : '≥'); const i = s.indexOf('='); if (i < 0) return null; if (s.indexOf('=', i + 1) >= 0) throw mpErr('มีเครื่องหมาย = มากกว่า 1 ตัว'); return [s.slice(0, i), s.slice(i + 1)]; }
function mpImplicit(src) { // คืน { F(x,y), tex } ถ้าเป็นสมการความสัมพันธ์ ; null ถ้าเป็น y = f(x) ธรรมดา
  const eq = mpSplitEq(src);
  if (!eq) { const ast = mpParse(src); if (!mpHasY(ast)) return null; throw mpErr('มี y แต่ไม่มีเครื่องหมาย = เช่น x^2 + y^2 = 4'); }
  if (!eq[0].trim() || !eq[1].trim()) throw mpErr('ด้านหนึ่งของ = ว่างอยู่');
  const L = mpParse(eq[0]), R = mpParse(eq[1]); const fl = mpFn(L), fr = mpFn(R);
  return { F: (x, y) => fl(x, y) - fr(x, y), tex: mpTex(L) + ' = ' + mpTex(R), plain: mpPlain(L) + ' = ' + mpPlain(R) };
}

