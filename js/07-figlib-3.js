'use strict';
/* ===================== กราฟจำนวนเชิงซ้อน (ทางเดินของ z / บริเวณ) ===================== */
function cplx(s) {
  s = String(s).replace(/\s|\(|\)/g, '').replace(/−/g, '-'); if (!s) return [0, 0]; let re = 0, im = 0;
  const terms = s.match(/[+-]?[^+-]+/g); if (!terms) throw 0;
  terms.forEach(t => { if (/i$/.test(t)) { const k = t.slice(0, -1); im += k === '' || k === '+' ? 1 : k === '-' ? -1 : mpCompile(k)(0); } else re += mpCompile(t)(0); });
  if (!isFinite(re) || !isFinite(im)) throw 0; return [re, im];
}
const angOf = s => { s = String(s).trim().replace(/°/g, '*pi/180').replace(/องศา/g, '*pi/180'); return mpCompile(s)(0); };
const CMP = { '<=': 'le', '≤': 'le', '<': 'lt', '>=': 'ge', '≥': 'ge', '>': 'gt', '=': 'eq' };
LIB.cplot = { name: 'กราฟจำนวนเชิงซ้อน: ทางเดินของ z และบริเวณ (|z − a| = r, arg, Re, Im, รากที่ n)', p: [
  ['src', 'เงื่อนไข บรรทัดละ 1 ชุด (เงื่อนไขในบรรทัดเดียวกันคั่นด้วย และ = บริเวณร่วม) ใส่สีท้ายบรรทัดได้', '|z - (1+i)| <= 2\n|z| = |z - 4|\narg(z) = π/4 แดง\nRe(z) >= 0 และ Im(z) >= 0 และ |z| <= 1.5 เขียว\nz1 = 3+2i', 'ta'],
  ...AXP('-3', '5', '-3', '4'), yn('lab', 'เขียนเงื่อนไขกำกับ (คำอธิบายสี)', 'yes')],
  gen: p => {
    const x0 = +p.x0, x1 = +p.x1, y0 = +p.y0, y1 = +p.y1; const W = 470, H = Math.max(200, Math.min(520, 60 + (y1 - y0) * (W - 60) / (x1 - x0)));
    const A = axes({ W, H, x0, x1, y0, y1, grid: ON(p.grid), xt: ticks(x0, x1, p.st), yt: ticks(y0, y1, p.st), xl: 'Re', yl: 'Im' }); let s = A.s, top = '', defs = '', legend = [];
    const k = (A.X(1) - A.X(0)); const big = [[x0 - 1, y0 - 1], [x1 + 1, y0 - 1], [x1 + 1, y1 + 1], [x0 - 1, y1 + 1]];
    const P = q => [A.X(q[0]), A.Y(q[1])], polyD = pts => 'M' + pts.map(q => P(q).map(v => v.toFixed(1)).join(' ')).join('L') + 'Z';
    const circD = (c, r) => { const [cx, cy] = P(c), R = r * k; return `M${(cx - R).toFixed(1)} ${cy.toFixed(1)}a${R} ${R} 0 1 0 ${2 * R} 0a${R} ${R} 0 1 0 ${-2 * R} 0Z`; };
    const halfPlane = (n, d, keepLE) => { // จุด q ที่ n·q <= d (keepLE) หรือ >= d
      let poly = big; const f = q => (n[0] * q[0] + n[1] * q[1] - d) * (keepLE ? 1 : -1); const out = []; poly.forEach((a, i) => { const b = poly[(i + 1) % poly.length], fa = f(a), fb = f(b); if (fa <= 0) out.push(a); if (fa * fb < 0) { const t = fa / (fa - fb); out.push([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]); } }); return out; };
    const lineD = (n, d) => { const pts = []; big.forEach((a, i) => { const b = big[(i + 1) % 4]; const fa = n[0] * a[0] + n[1] * a[1] - d, fb = n[0] * b[0] + n[1] * b[1] - d; if (fa * fb <= 0 && fa !== fb) { const t = fa / (fa - fb); pts.push([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]); } }); return pts.length >= 2 ? pts.slice(0, 2) : null; };
    const R2 = Math.hypot(x1 - x0, y1 - y0) * 2;
    const lines = String(p.src).split('\n').map(x => x.trim()).filter(Boolean); let ci = 0;
    lines.forEach(line0 => {
      let line = cnorm(line0); let col = null; const cm = /\s+(\S+)$/.exec(line); if (cm && colOfWord(cm[1])) { col = colOfWord(cm[1]); line = line.slice(0, cm.index); }
      const c = col || GCOL[ci % 5]; ci++; let any = false;
      // จุด
      const pm = /^(?:จุด\s*)?([A-Za-zก-๙][\w₀-₉']*)?\s*=?\s*([-+]?[\d.]*\s*[-+]?\s*[\d.]*\s*i?)$/.exec(line);
      if (pm && /\d|i/.test(pm[2]) && !/[|<>]|arg|Re|Im/.test(line)) { try { const z = cplx(pm[2]); const q = P(z); top += dot(q, c, 4) + svgMath(q[0] + 7, q[1] - 7, (pm[1] ? pm[1] + ' = ' : '') + pm[2].replace(/\s/g, ''), { fs: 13, c, a: 'start' }); } catch (e) { } return; }
      // รากที่ n
      const rm = /^(?:z\s*\^\s*(\d+)\s*=\s*(.+)|(?:roots?|ราก)\s*:?\s*(\d+)\s*(.*))$/.exec(line);
      if (rm) { const n = +(rm[1] || rm[3]); let w; try { w = cplx(rm[2] || rm[4] || '1'); } catch (e) { return; } const r = Math.pow(Math.hypot(...w), 1 / n), t0 = Math.atan2(w[1], w[0]) / n; const pts = []; for (let j = 0; j < n; j++) { const t = t0 + 2 * Math.PI * j / n; pts.push([r * Math.cos(t), r * Math.sin(t)]); }
        s += `<path d="${circD([0, 0], r)}" ${STK(CL.gray, 1.2, 1)} clip-path="url(#${A.cid})"/>` + `<path d="${polyD(pts)}" fill="${c}" fill-opacity=".12" ${STK(c, 1.6).replace('fill="none" ', '')} clip-path="url(#${A.cid})"/>`;
        pts.forEach((q, j) => { const Q2 = P(q), d = nrm([q[0], -q[1]]); top += dot(Q2, c, 3.8) + svgMath(Q2[0] + d[0] * 16, Q2[1] + d[1] * 16 + 5, `z${'₀₁₂₃₄₅₆₇₈₉'[j] || j}`, { fs: 13, c }); });
        legend.push([c, `z^${n} = ${rm[2] || rm[4] || '1'}`]); return; }
      const conds = line.split(/\s*(?:และ|&&|&|\band\b|,)\s*/).filter(Boolean); const clips = [];
      conds.forEach(cd => {
        cd = cd.trim(); let m;
        const absPart = '\\|\\s*z\\s*(?:([+-])\\s*\\(?([^|]*?)\\)?)?\\s*\\|';
        const cen = (sg, v) => { if (!sg) return [0, 0]; const z = cplx(v); return sg === '-' ? z : [-z[0], -z[1]]; };
        if ((m = new RegExp(`^([\\d.]+)\\s*(<=|<|≤)\\s*${absPart}\\s*(<=|<|≤)\\s*([\\d.]+)$`).exec(cd))) { // วงแหวน
          const C0 = cen(m[3], m[4]), r1 = +m[1], r2 = +m[6]; clips.push(`<path clip-rule="evenodd" d="${circD(C0, r2)}${circD(C0, r1)}"/>`);
          s += `<path d="${circD(C0, r1)}" ${STK(c, 1.8, m[2] === '<')} clip-path="url(#${A.cid})"/><path d="${circD(C0, r2)}" ${STK(c, 1.8, m[5] === '<')} clip-path="url(#${A.cid})"/>`; top += dot(P(C0), c, 3); any = true; return;
        }
        if ((m = new RegExp(`^${absPart}\\s*(<=|>=|<|>|=|≤|≥)\\s*${absPart}$`).exec(cd))) { // เส้นแบ่งครึ่งตั้งฉาก
          const a = cen(m[1], m[2]), b = cen(m[4], m[5]); const n = [b[0] - a[0], b[1] - a[1]], d = (b[0] ** 2 + b[1] ** 2 - a[0] ** 2 - a[1] ** 2) / 2; const op = CMP[m[3]];
          const L = lineD(n, d); if (L) s += pl(L.map(P), STK(c, 2, op === 'lt' || op === 'gt')).replace('/>', ` clip-path="url(#${A.cid})"/>`);
          top += dot(P(a), CL.gray, 3) + dot(P(b), CL.gray, 3) + pl([P(a), P(b)], STK(CL.gray, 1, 1));
          if (op !== 'eq') clips.push(`<path d="${polyD(halfPlane(n, d, op === 'le' || op === 'lt'))}"/>`); any = true; return;
        }
        if ((m = new RegExp(`^${absPart}\\s*(<=|>=|<|>|=|≤|≥)\\s*([\\d.]+)$`).exec(cd))) { // วงกลม
          const C0 = cen(m[1], m[2]), r = +m[4], op = CMP[m[3]]; s += `<path d="${circD(C0, r)}" ${STK(c, 2, op === 'lt' || op === 'gt')} clip-path="url(#${A.cid})"/>`; top += dot(P(C0), c, 3);
          if (op === 'le' || op === 'lt') clips.push(`<path d="${circD(C0, r)}"/>`); else if (op !== 'eq') clips.push(`<path clip-rule="evenodd" d="${polyD(big)}${circD(C0, r)}"/>`); any = true; return;
        }
        const argPart = 'arg\\s*\\(?\\s*z\\s*(?:([+-])\\s*\\(?([^)]*?)\\)?)?\\s*\\)?';
        if ((m = new RegExp(`^(.+?)\\s*(<=|<|≤)\\s*${argPart}\\s*(<=|<|≤)\\s*(.+)$`).exec(cd))) { // เซกเตอร์
          const C0 = cen(m[3], m[4]), t1 = angOf(m[1]), t2 = angOf(m[6]); const pts = [C0]; for (let j = 0; j <= 40; j++) { const t = t1 + (t2 - t1) * j / 40; pts.push([C0[0] + R2 * Math.cos(t), C0[1] + R2 * Math.sin(t)]); }
          clips.push(`<path d="${polyD(pts)}"/>`); [[t1, m[2]], [t2, m[5]]].forEach(([t, o]) => s += pl([P(C0), P([C0[0] + R2 * Math.cos(t), C0[1] + R2 * Math.sin(t)])], STK(c, 2, o === '<')).replace('/>', ` clip-path="url(#${A.cid})"/>`));
          top += `<circle cx="${P(C0)[0]}" cy="${P(C0)[1]}" r="3.5" fill="#fff" stroke="${c}" stroke-width="1.5"/>`; any = true; return;
        }
        if ((m = new RegExp(`^${argPart}\\s*(<=|>=|<|>|=|≤|≥)\\s*(.+)$`).exec(cd))) { // รังสี
          const C0 = cen(m[1], m[2]), t = angOf(m[4]), op = CMP[m[3]]; const E = [C0[0] + R2 * Math.cos(t), C0[1] + R2 * Math.sin(t)];
          s += pl([P(C0), P(E)], STK(c, 2.2, op === 'lt' || op === 'gt')).replace('/>', ` clip-path="url(#${A.cid})"/>`); top += `<circle cx="${P(C0)[0]}" cy="${P(C0)[1]}" r="3.5" fill="#fff" stroke="${c}" stroke-width="1.5"/>`;
          if (op !== 'eq') { const [a1, a2] = (op === 'le' || op === 'lt') ? [-Math.PI, t] : [t, Math.PI]; const pts = [C0]; for (let j = 0; j <= 40; j++) { const tt = a1 + (a2 - a1) * j / 40; pts.push([C0[0] + R2 * Math.cos(tt), C0[1] + R2 * Math.sin(tt)]); } clips.push(`<path d="${polyD(pts)}"/>`); }
          any = true; return;
        }
        const rePart = '(Re|Im)\\s*\\(?\\s*z\\s*\\)?';
        if ((m = new RegExp(`^([-\\d.]+)\\s*(<=|<|≤)\\s*${rePart}\\s*(<=|<|≤)\\s*([-\\d.]+)$`).exec(cd))) {
          const re = m[3] === 'Re', a = +m[1], b = +m[5]; clips.push(`<path d="${polyD(re ? [[a, y0 - 1], [b, y0 - 1], [b, y1 + 1], [a, y1 + 1]] : [[x0 - 1, a], [x1 + 1, a], [x1 + 1, b], [x0 - 1, b]])}"/>`);
          [[a, m[2]], [b, m[4]]].forEach(([v, o]) => s += pl(re ? [P([v, y0]), P([v, y1])] : [P([x0, v]), P([x1, v])], STK(c, 2, o === '<'))); any = true; return;
        }
        if ((m = new RegExp(`^${rePart}\\s*(<=|>=|<|>|=|≤|≥)\\s*([-\\d.]+)$`).exec(cd))) {
          const re = m[1] === 'Re', v = +m[3], op = CMP[m[2]]; s += pl(re ? [P([v, y0]), P([v, y1])] : [P([x0, v]), P([x1, v])], STK(c, 2.2, op === 'lt' || op === 'gt'));
          if (op !== 'eq') clips.push(`<path d="${polyD(halfPlane(re ? [1, 0] : [0, 1], v, op === 'le' || op === 'lt'))}"/>`); any = true; return;
        }
      });
      if (any) legend.push([c, line]);
      if (clips.length) { let g = `<rect x="0" y="0" width="${A.w}" height="${A.h}" fill="${c}" fill-opacity=".17"/>`; clips.forEach(cp => { const id = 'cz' + Math.random().toString(36).slice(2, 8); defs += `<clipPath id="${id}">${cp}</clipPath>`; g = `<g clip-path="url(#${id})">${g}</g>`; }); s = s.replace(/(<\/defs>)/, `$1<g clip-path="url(#${A.cid})">${g}</g>`); }
    });
    let lg = ''; if (ON(p.lab) && legend.length) legend.forEach(([c, t], i) => lg += `<rect x="${A.w + 6}" y="${22 + i * 22}" width="12" height="12" rx="2" fill="${c}" fill-opacity=".5" stroke="${c}"/>` + svgMath(A.w + 24, 32 + i * 22, t.replace(/<=/g, '≤').replace(/>=/g, '≥').replace(/\s*(และ|&&|&)\s*/g, ', '), { fs: 13, a: 'start', c }));
    const lw = ON(p.lab) && legend.length ? 30 + Math.max(...legend.map(([, t]) => t.length)) * 7 : 0;
    return svgW(A.w + lw, A.h, `<defs>${defs}</defs>` + s + top + lg);
  } };

/* ===================== ภาพสถานการณ์ (โจทย์ประยุกต์): ตึก ต้นไม้ คน ดวงอาทิตย์ มุมเงย มุมก้ม ===================== */
const SC_AL = [['building', ['ตึก', 'อาคาร', 'building']], ['tree', ['ต้นไม้', 'tree']], ['pole', ['เสา', 'เสาธง', 'pole', 'flag']], ['light', ['ประภาคาร', 'lighthouse']], ['tower', ['หอคอย', 'เสาส่งสัญญาณ', 'tower']],
  ['cliff', ['หน้าผา', 'cliff']], ['mountain', ['ภูเขา', 'เขา', 'mountain']], ['man', ['ชาย', 'ผู้ชาย', 'man']], ['woman', ['หญิง', 'ผู้หญิง', 'woman']], ['person', ['คน', 'person']], ['boat', ['เรือ', 'boat']], ['car', ['รถ', 'car']],
  ['balloon', ['บอลลูน', 'balloon']], ['plane', ['เครื่องบิน', 'plane']], ['bird', ['นก', 'bird']], ['kite', ['ว่าว', 'kite']], ['sun', ['ดวงอาทิตย์', 'แสงแดด', 'sun']], ['river', ['แม่น้ำ', 'คลอง', 'river']], ['road', ['ถนน', 'road']],
  ['ladder', ['บันได', 'ladder']], ['wall', ['กำแพง', 'wall']], ['sight', ['มอง', 'แนวสายตา', 'sight']], ['dim', ['วัด', 'ระยะ', 'dim']], ['line', ['เส้น', 'line']], ['point', ['จุด', 'point']], ['text', ['ข้อความ', 'text']], ['hline', ['ระดับ', 'แนวระดับ', 'level']]];
const scType = w => { const t = String(w).toLowerCase(); for (const [k, a] of SC_AL) if (a.includes(t)) return k; return null; };
const VERT = ['building', 'tree', 'pole', 'light', 'tower', 'cliff', 'mountain', 'wall', 'man', 'woman', 'person'];
function sceneSVG(items, o = {}) {
  const W0 = o.W || 500, H0 = o.H || 270, real = o.real; const isP = it => it.t === 'man' || it.t === 'woman' || it.t === 'person';
  let xs = [], ys = [0];
  items.forEach(it => {
    const t = it.t;
    if (VERT.includes(t)) { xs.push(it.x); ys.push((isP(it) ? 1.7 : it.h) + (it.base || 0)); if (t === 'building' && it.w) xs.push(it.x + it.w * (it.dir || 1)); }
    else if (['boat', 'car'].includes(t)) xs.push(it.x);
    else if (['balloon', 'plane', 'bird', 'kite', 'point', 'text'].includes(t)) { xs.push(it.x); ys.push(it.y); if (it.fx !== undefined) { xs.push(it.fx); ys.push(it.fy); } }
    else if (['river', 'road'].includes(t)) xs.push(it.x, it.x2);
    else if (t === 'ladder') { xs.push(it.x, it.x2); ys.push(it.h); }
    else if (['sight', 'dim', 'line', 'hline'].includes(t)) { xs.push(it.x, it.x2); ys.push(it.y, it.y2); }
  });
  const sun = items.find(i => i.t === 'sun'); const sgnS = sun && sun.side === 'R' ? -1 : 1;
  if (sun && sun.shadow) items.filter(i => VERT.includes(i.t) && !['cliff', 'mountain'].includes(i.t)).forEach(i => xs.push(i.x + sgnS * (isP(i) ? 1.7 : i.h) / Math.tan(sun.a * Math.PI / 180)));
  if (!xs.length) xs = [0, 10]; let mnx = Math.min(...xs), mxx = Math.max(...xs); if (mxx - mnx < 1e-9) { mnx -= 5; mxx += 5; } const mny = Math.min(...ys), mxy = Math.max(...ys, 1);
  let kx = W0 / (mxx - mnx), ky = H0 / (mxy - mny); if (real) kx = ky = Math.min(kx, ky); else { if (ky > kx * 3) ky = kx * 3; if (kx > ky * 6) kx = ky * 6; }
  const X = x => (x - mnx) * kx, Y = y => (mxy - y) * ky, G = Y(0);
  const php = Math.max(46, Math.min(60, 1.7 * ky));
  let bx0 = 1e9, bx1 = -1e9, by0 = 1e9, by1 = -1e9; const ext = (x, y) => { if (!isFinite(x) || !isFinite(y)) return; bx0 = Math.min(bx0, x); bx1 = Math.max(bx1, x); by0 = Math.min(by0, y); by1 = Math.max(by1, y); };
  const TL = (x, y, s, oo = {}) => { const w = String(s).length * 7.6 * ((oo.fs || 15) / 15); const a = oo.a || 'middle'; const xl = a === 'start' ? x : a === 'end' ? x - w : x - w / 2; ext(xl, y - 15); ext(xl + w, y + 4); return tl(x, y, s, oo); };
  const persons = items.filter(isP);
  const PX = (x, y) => { const pr = persons.find(q => Math.abs(q.x - x) < 1e-6 && y > 0 && y <= 2.2); if (pr) return [X(x), G - php * .9 - (pr.base ? pr.base * ky : 0)]; return [X(x), Y(y)]; };
  let back = '', mdl = '', fore = '', txt = '', lines = '';
  const gc = '#7a5a3a';
  const water = items.filter(i => i.t === 'river'), road = items.filter(i => i.t === 'road');
  water.forEach(w => { const a = X(Math.min(w.x, w.x2)), b = X(Math.max(w.x, w.x2)); ext(a, G + 14); ext(b, G); back += `<rect x="${a}" y="${G - 1}" width="${b - a}" height="14" fill="${tint(CL.navy, .55)}"/>`; for (let x = a + 6; x < b - 10; x += 18) back += `<path d="M${x} ${G + 5}q4 -3 8 0t8 0" ${STK('#ffffff', 1.1)}/>`; if (w.label) txt += TL((a + b) / 2, G + 30, w.label, { fs: 13, c: CL.navy }); });
  road.forEach(w => { const a = X(Math.min(w.x, w.x2)), b = X(Math.max(w.x, w.x2)); ext(a, G + 10); ext(b, G); back += `<rect x="${a}" y="${G - 1}" width="${b - a}" height="10" fill="#9aa0a6"/><path d="M${a + 4} ${G + 4}H${b - 4}" stroke="#fff" stroke-width="1.4" stroke-dasharray="8 6"/>`; });
  const topOf = {}, objW = [];
  items.forEach((it, idx) => {
    const t = it.t, x0 = X(it.x); const c = it.c; let L = 0, R = 0, hp = 0;
    if (t === 'building') { hp = it.h * ky; let wp = it.w ? Math.abs(it.w) * kx : Math.max(26, Math.min(110, hp * .42)); if (!real && it.w) wp = Math.max(22, Math.min(wp, 150)); const dir = it.dir || 1; const xa = dir > 0 ? x0 : x0 - wp; const col = c || CL.navy;
      mdl += `<rect x="${xa}" y="${G - hp}" width="${wp}" height="${hp}" fill="${tint(col, .78)}" stroke="${col}" stroke-width="1.6"/>`;
      const nc = Math.max(1, Math.floor((wp - 6) / 14)), nr = Math.max(1, Math.floor((hp - 10) / 16)); if (hp > 34 && wp > 20) for (let r = 0; r < nr; r++) for (let q = 0; q < nc; q++) mdl += `<rect x="${xa + 5 + q * (wp - 10) / nc + 1}" y="${G - hp + 7 + r * (hp - 12) / nr}" width="${Math.max(3, (wp - 10) / nc - 5)}" height="${Math.max(3, (hp - 12) / nr - 7)}" fill="#fff" opacity=".85"/>`;
      topOf[idx] = [x0, G - hp]; L = dir < 0 ? wp : 0; R = dir > 0 ? wp : 0; }
    else if (t === 'tree') { hp = it.h * ky; const r = Math.max(9, hp * .3), col = c || CL.green; mdl += `<rect x="${x0 - Math.max(2.5, r * .16)}" y="${G - hp * .55}" width="${Math.max(5, r * .32)}" height="${hp * .55}" fill="#8b5a2b"/><ellipse cx="${x0}" cy="${G - hp + r}" rx="${r * .95}" ry="${r}" fill="${tint(col, .45)}" stroke="${col}" stroke-width="1.4"/><ellipse cx="${x0 - r * .35}" cy="${G - hp + r * 1.15}" rx="${r * .45}" ry="${r * .5}" fill="${tint(col, .3)}" opacity=".6"/>`; topOf[idx] = [x0, G - hp]; L = R = r; }
    else if (t === 'pole') { hp = it.h * ky; const col = c || CL.red, fw = Math.max(16, Math.min(40, hp * .22)), fh = Math.max(6, Math.min(14, hp * .06)); mdl += `<path d="M${x0} ${G}V${G - hp}" stroke="${CL.dark}" stroke-width="2.6"/><path d="M${x0 + 1} ${G - hp + 2}h${fw}l-5 ${fh} 5 ${fh}h-${fw}z" fill="${col}"/><circle cx="${x0}" cy="${G - hp}" r="2.4" fill="${CL.dark}"/>`; topOf[idx] = [x0, G - hp]; L = 3; R = fw; }
    else if (t === 'light') { hp = it.h * ky; const bw = Math.max(14, Math.min(40, hp * .13)), tw = bw * .62, col = c || CL.red; const lh = Math.max(10, Math.min(30, hp * .12)); let g = `<path d="M${x0 - bw} ${G}L${x0 - tw} ${G - hp + lh}H${x0 + tw}L${x0 + bw} ${G}z" fill="#fff" stroke="${CL.dark}" stroke-width="1.4"/>`;
      for (let k = 1; k < 5; k += 2) { const y1 = G - (hp - lh) * k / 5, y2 = G - (hp - lh) * (k + 1) / 5, w1 = bw - (bw - tw) * k / 5, w2 = bw - (bw - tw) * (k + 1) / 5; g += `<path d="M${x0 - w1} ${y1}L${x0 - w2} ${y2}H${x0 + w2}L${x0 + w1} ${y1}z" fill="${col}"/>`; }
      g += `<rect x="${x0 - tw * .8}" y="${G - hp + 2}" width="${tw * 1.6}" height="${lh - 2}" fill="#f6d36b" stroke="${CL.dark}" stroke-width="1.2"/><path d="M${x0 - tw} ${G - hp + 2}L${x0} ${G - hp - 5}L${x0 + tw} ${G - hp + 2}z" fill="${CL.dark}"/>`; mdl += g; topOf[idx] = [x0, G - hp]; L = R = bw; }
    else if (t === 'tower') { hp = it.h * ky; const bw = Math.max(12, Math.min(36, hp * .12)); let g = `<path d="M${x0 - bw} ${G}L${x0} ${G - hp}L${x0 + bw} ${G}" ${STK(CL.dark, 1.8)}/>`; for (let k = 1; k < 6; k++) { const y = G - hp * k / 6, w = bw * (1 - k / 6); g += `<path d="M${x0 - w} ${y}H${x0 + w}" ${STK(CL.dark, 1)}/><path d="M${x0 - w - bw / 6} ${y + hp / 6}L${x0 + w} ${y}" ${STK(CL.dark, .7)}/>`; } g += `<circle cx="${x0}" cy="${G - hp}" r="3" fill="${CL.red}"/>`; mdl += g; topOf[idx] = [x0, G - hp]; L = R = bw; }
    else if (t === 'cliff') { hp = it.h * ky; const dir = it.dir || -1, cw = Math.max(50, Math.min(140, hp * .6)), far = x0 + dir * cw; mdl += `<path d="M${far} ${G}V${G - hp}H${x0}l${-dir * 3} ${hp * .2}l${dir * 4} ${hp * .25}l${-dir * 5} ${hp * .25}l${dir * 4} ${hp * .3}z" fill="#e9d5b5" stroke="${gc}" stroke-width="1.6"/>`; topOf[idx] = [x0, G - hp]; L = dir < 0 ? cw : 5; R = dir > 0 ? cw : 5; }
    else if (t === 'mountain') { hp = it.h * ky; const wp = it.w ? it.w * kx : hp * 1.6; mdl += `<path d="M${x0 - wp / 2} ${G}L${x0} ${G - hp}L${x0 + wp / 2} ${G}z" fill="#c9d8b6" stroke="${CL.green}" stroke-width="1.5"/><path d="M${x0 - hp * .12} ${G - hp * .82}L${x0} ${G - hp}L${x0 + hp * .12} ${G - hp * .82}l-${hp * .06} ${hp * .05}l-${hp * .06} -${hp * .04}l-${hp * .06} ${hp * .04}z" fill="#fff"/>`; topOf[idx] = [x0, G - hp]; L = R = wp / 2; }
    else if (isP(it)) { const k = php / 60, by = G - (it.base ? it.base * ky : 0); hp = php; fore += `<g transform="translate(${(x0 - 15 * k).toFixed(1)} ${(by - php).toFixed(1)}) scale(${k.toFixed(3)})">${t === 'woman' ? WOMAN(c || '#c0392b') : MAN(c || CL.navy)}</g>`; topOf[idx] = [x0, by - php]; L = R = 13 * k; ext(x0, by - php); }
    else if (t === 'boat') { mdl += `<path d="M${x0 - 22} ${G - 8}h44l-8 10h-28z" fill="${c || CL.brown}"/><path d="M${x0} ${G - 8}V${G - 40}l18 28z" fill="#fff" stroke="${CL.dark}" stroke-width="1.2"/><path d="M${x0} ${G - 8}V${G - 40}" stroke="${CL.dark}" stroke-width="1.6"/>`; topOf[idx] = [x0, G - 40]; L = R = 22; hp = 40; }
    else if (t === 'car') { mdl += `<g transform="translate(${(x0 - 22.5).toFixed(1)} ${(G - 83).toFixed(1)}) scale(1.5)">${itemIcon('car', c || CL.red)}</g>`; topOf[idx] = [x0, G - 30]; L = R = 22; hp = 30; }
    else if (t === 'balloon') { const [px, py] = [X(it.x), Y(it.y)]; fore += `<path d="M${px - 4} ${py - 6}L${px - 10} ${py - 22}M${px + 4} ${py - 6}L${px + 10} ${py - 22}" stroke="${CL.dark}"/><circle cx="${px}" cy="${py - 36}" r="18" fill="${c || CL.orange}" stroke="${CL.dark}" stroke-width="1.2"/><path d="M${px - 10} ${py - 22}q10 6 20 0" fill="${c || CL.orange}"/><rect x="${px - 5}" y="${py - 6}" width="10" height="7" fill="#8b5a2b"/>`; topOf[idx] = [px, py - 54]; ext(px - 18, py - 54); ext(px + 18, py + 2); }
    else if (t === 'plane') { const [px, py] = [X(it.x), Y(it.y)]; fore += `<g transform="translate(${px} ${py})"><path d="M-26 0q0-5 6-5h30l10-9h5l-5 9h4q4 0 4 5t-4 5h-44q-6 0-6-5z" fill="${c || CL.navy}"/><path d="M-2 0l-10 13h6l14-13z" fill="${mixHex(c || CL.navy, '#000000', .25)}"/></g>`; topOf[idx] = [px, py - 14]; ext(px - 27, py - 15); ext(px + 30, py + 14); }
    else if (t === 'bird') { const [px, py] = [X(it.x), Y(it.y)]; fore += `<path d="M${px - 12} ${py - 4}q6 -6 12 0q6 -6 12 0" ${STK(c || CL.dark, 2)}/>`; topOf[idx] = [px, py - 8]; ext(px - 12, py - 8); ext(px + 12, py); }
    else if (t === 'kite') { const [px, py] = [X(it.x), Y(it.y)]; fore += `<path d="M${px} ${py - 18}l12 14-12 22-12-22z" fill="${c || CL.red}" stroke="${CL.dark}" stroke-width="1"/><path d="M${px} ${py + 18}q-6 10 2 18t-2 16" ${STK(CL.dark, 1)}/>`; topOf[idx] = [px, py - 18]; ext(px - 12, py - 18); ext(px + 12, py + 52); }
    else if (t === 'ladder') { const A0 = [X(it.x), G], B0 = [X(it.x2), Y(it.h)]; const d = nrm(sub2(B0, A0)), n = [-d[1] * 5, d[0] * 5]; mdl += pl([[A0[0] + n[0], A0[1] + n[1]], [B0[0] + n[0], B0[1] + n[1]]], STK('#8b5a2b', 2.4)) + pl([[A0[0] - n[0], A0[1] - n[1]], [B0[0] - n[0], B0[1] - n[1]]], STK('#8b5a2b', 2.4)); const Ln = len2(sub2(B0, A0)); for (let q = 12; q < Ln - 4; q += 13) { const m = [A0[0] + d[0] * q, A0[1] + d[1] * q]; mdl += pl([[m[0] + n[0], m[1] + n[1]], [m[0] - n[0], m[1] - n[1]]], STK('#8b5a2b', 1.6)); } ext(A0[0] - 6, G); ext(B0[0] + 6, B0[1]); }
    else if (t === 'wall') { hp = it.h * ky; mdl += `<rect x="${x0}" y="${G - hp}" width="12" height="${hp}" fill="#e3c7a8" stroke="${gc}" stroke-width="1.4"/>`; for (let y = G - 10; y > G - hp; y -= 10) mdl += `<path d="M${x0} ${y}h12" stroke="${gc}" stroke-width=".6"/>`; topOf[idx] = [x0, G - hp]; R = 12; }
    if (hp && !['balloon', 'plane', 'bird', 'kite'].includes(t)) { ext(x0 - L, G - hp - (it.base ? it.base * ky : 0)); ext(x0 + R, G); objW.push([it.x, R, L]); }
    if (it.label && topOf[idx]) txt += TL(topOf[idx][0] + (it.lx || 0), topOf[idx][1] - 9, it.label, { fs: 15, c: CL.dark });
    if (it.blabel) txt += TL(x0, G + 20, it.blabel, { fs: 15, c: CL.dark });
  });
  if (sun) {
    const a = sun.a * Math.PI / 180; let sunP = null, first = true;
    items.forEach((it, idx) => { if (!sun.shadow || !VERT.includes(it.t) || ['cliff', 'mountain'].includes(it.t)) return; const hw = isP(it) ? 1.7 : it.h; const tip = [X(it.x + sgnS * hw / Math.tan(a)), G]; const tp = topOf[idx] || [X(it.x), Y(hw)]; ext(tip[0], G);
      back += `<path d="M${X(it.x)} ${G - 2}L${tip[0]} ${G - 1}L${tip[0]} ${G + 3}L${X(it.x)} ${G + 3}z" fill="#5a5f66" opacity=".55"/>`;
      fore += pl([tp, tip], STK('#d4a017', 1.5, 1)); if (sun.lab !== '-') fore += angArc(tip, [tip[0] - sgnS * 40, G], tp, 22, '#c27c00', first ? (sun.lab || fmt(sun.a) + '°') : ''); first = false;
      if (it.slab) txt += TL((X(it.x) + tip[0]) / 2, G + 20, it.slab, { fs: 14, c: '#5a5f66' });
      const d = nrm(sub2(tp, tip)); const cand = [tp[0] + d[0] * 60, tp[1] + d[1] * 60]; if (!sunP || cand[1] < sunP[1]) sunP = cand; });
    if (!sunP) sunP = [sgnS > 0 ? X(mnx) - 10 : X(mxx) + 80, Y(mxy) - 40];
    let g = `<circle cx="${sunP[0]}" cy="${sunP[1]}" r="13" fill="#f6c343" stroke="#d4a017" stroke-width="1.4"/>`; for (let k = 0; k < 8; k++) { const t = k * Math.PI / 4; g += `<path d="M${sunP[0] + Math.cos(t) * 17} ${sunP[1] + Math.sin(t) * 17}L${sunP[0] + Math.cos(t) * 23} ${sunP[1] + Math.sin(t) * 23}" stroke="#d4a017" stroke-width="2" stroke-linecap="round"/>`; } back += g; ext(sunP[0] - 24, sunP[1] - 24); ext(sunP[0] + 24, sunP[1] + 24);
  }
  items.forEach(it => {
    if (it.t === 'sight') { const A1 = PX(it.x, it.y), B1 = PX(it.x2, it.y2); const c = it.c || CL.red; if (!it.noline) lines += pl([A1, B1], STK(c, 1.8, it.dash)); ext(...A1); ext(...B1); const dir = B1[0] >= A1[0] ? 1 : -1;
      const hl = it.full ? Math.abs(B1[0] - A1[0]) : Math.min(Math.abs(B1[0] - A1[0]) * .6, 110); if (it.hline !== false) lines += pl([A1, [A1[0] + dir * hl, A1[1]]], STK(CL.gray, 1.3, 1));
      if (it.lab && it.lab !== '-') lines += angArc(A1, [A1[0] + dir * 40, A1[1]], B1, it.r || 28, c, it.lab); else if (it.lab !== '-') lines += angArc(A1, [A1[0] + dir * 40, A1[1]], B1, it.r || 28, c, '');
      if (it.alt) { lines += pl([B1, [B1[0] - dir * Math.min(70, Math.abs(B1[0] - A1[0]) * .5), B1[1]]], STK(CL.gray, 1.3, 1)) + angArc(B1, [B1[0] - dir * 40, B1[1]], A1, it.r || 28, CL.purple, it.alt); }
      if (it.rt) lines += rightMark([B1[0], A1[1]], A1, B1, 9); }
    else if (it.t === 'line') { const A1 = PX(it.x, it.y), B1 = PX(it.x2, it.y2); ext(...A1); ext(...B1); lines += pl([A1, B1], STK(it.c || CL.dark, 1.6, it.dash)); }
    else if (it.t === 'hline') { const A1 = PX(it.x, it.y), B1 = PX(it.x2, it.y2); lines += pl([A1, B1], STK(CL.gray, 1.3, 1)); }
    else if (it.t === 'dim') { let A1 = PX(it.x, it.y), B1 = PX(it.x2, it.y2); const vert = Math.abs(A1[0] - B1[0]) < 1; let off = it.off; if (off === undefined) { off = vert ? 16 : 18; if (vert) { const ow = objW.filter(q => Math.abs(q[0] - it.x) < 1e-6); if (ow.length) off = Math.max(...ow.map(q => it.side === 'L' ? q[2] : q[1])) + 16; } }
      const n = vert ? [off * (it.side === 'L' ? -1 : 1), 0] : [0, off * (it.side === 'U' ? -1 : 1)];
      A1 = [A1[0] + n[0], A1[1] + n[1]]; B1 = [B1[0] + n[0], B1[1] + n[1]]; const d = nrm(sub2(B1, A1)), q = [-d[1] * 4, d[0] * 4]; const c = it.c || CL.teal;
      lines += pl([A1, B1], STK(c, 1.2)) + pg([A1, [A1[0] + d[0] * 8 + q[0], A1[1] + d[1] * 8 + q[1]], [A1[0] + d[0] * 8 - q[0], A1[1] + d[1] * 8 - q[1]]], `fill="${c}"`) + pg([B1, [B1[0] - d[0] * 8 + q[0], B1[1] - d[1] * 8 + q[1]], [B1[0] - d[0] * 8 - q[0], B1[1] - d[1] * 8 - q[1]]], `fill="${c}"`);
      lines += pl([[A1[0] - n[0] * .8, A1[1] - n[1] * .8], [A1[0] + n[0] * .3, A1[1] + n[1] * .3]], STK(c, .9)) + pl([[B1[0] - n[0] * .8, B1[1] - n[1] * .8], [B1[0] + n[0] * .3, B1[1] + n[1] * .3]], STK(c, .9)); ext(...A1); ext(...B1);
      if (it.label) { const m = mid(A1, B1); txt += vert ? TL(m[0] + (it.side === 'L' ? -6 : 6), m[1] + 5, it.label, { fs: 15, c, a: it.side === 'L' ? 'end' : 'start' }) : TL(m[0], m[1] + (it.side === 'U' ? -6 : 18), it.label, { fs: 15, c }); } }
    else if (it.t === 'point') { const q = PX(it.x, it.y); ext(...q); lines += dot(q, it.c || CL.dark, 3.2); if (it.label) txt += TL(q[0] + (it.lx ?? 8), q[1] + (it.ly ?? -6), it.label, { fs: 15, a: it.lx !== undefined && it.lx < 0 ? 'middle' : 'start' }); }
    else if (it.t === 'text') { const q = PX(it.x, it.y); txt += TL(q[0], q[1], it.label || '', { fs: 15, c: it.c || CL.dark }); }
    else if (it.t === 'kite' && it.fx !== undefined) { lines += pl([PX(it.fx, it.fy), [X(it.x), Y(it.y)]], STK(CL.dark, 1.2)); }
  });
  ext(X(mnx), G); ext(X(mxx), G);
  const gx0 = bx0 - 14, gx1 = bx1 + 14; let gr = `<path d="M${gx0} ${G}H${gx1}" stroke="${gc}" stroke-width="1.8"/>`;
  for (let x = gx0 + 4; x < gx1; x += 11) if (!water.some(w => x > X(Math.min(w.x, w.x2)) && x < X(Math.max(w.x, w.x2)))) gr += `<path d="M${x} ${G + 1}l-6 7" stroke="${gc}" stroke-width=".9"/>`;
  ext(gx0, G + 9); const m = 10; const vx = bx0 - 14 - m, vy = by0 - m, vw = bx1 - bx0 + 28 + 2 * m, vh = by1 - by0 + 2 * m;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${Math.round(vw)}" height="${Math.round(vh)}" viewBox="${vx.toFixed(1)} ${vy.toFixed(1)} ${vw.toFixed(1)} ${vh.toFixed(1)}">${gr + back + mdl + lines + fore + txt}</svg>`;
}

/* ---------- ตัวอ่านคำสั่งฉาก ---------- */
function parseScene(src) {
  const out = [];
  String(src).split('\n').forEach(line0 => {
    let [line, opt = ''] = line0.split('|').map(x => x.trim()); if (!line) return;
    const tk = line.split(/\s+/); const t = scType(tk[0]); if (!t) return; const nums = [], words = [];
    const AR = { building: 3, tree: 2, pole: 2, light: 2, tower: 2, cliff: 2, mountain: 3, wall: 2, man: 2, woman: 2, person: 2, boat: 1, car: 1, balloon: 2, plane: 2, bird: 2, kite: 4, point: 2, text: 2, sun: 1, river: 2, road: 2, ladder: 3, sight: 4, dim: 4, line: 4, hline: 4 }[t] || 4;
    tk.slice(1).forEach(w => { const v = Number(w.replace('−', '-')); if (w !== '' && isFinite(v) && words.length === 0 && nums.length < AR) nums.push(v); else words.push(w); });
    const wd = words.join(' '); const c = colOfWord(words[words.length - 1]); const free = c ? words.slice(0, -1).join(' ') : wd;
    const it = { t, c: c || undefined };
    const has = w => words.includes(w);
    if (['building', 'tree', 'pole', 'light', 'tower', 'cliff', 'mountain', 'wall'].includes(t)) { it.x = nums[0] || 0; it.h = nums[1] || 10; if (nums[2]) it.w = nums[2]; if (has('ซ้าย') || has('left')) it.dir = -1; if (has('ขวา') || has('right')) it.dir = 1; it.label = opt; }
    else if (t === 'man' || t === 'woman' || t === 'person') { it.x = nums[0] || 0; if (has('หญิง') || has('ผู้หญิง')) it.t = 'woman'; if (nums[1]) it.base = nums[1]; it.label = opt; }
    else if (t === 'boat' || t === 'car') { it.x = nums[0] || 0; it.label = opt; }
    else if (['balloon', 'plane', 'bird', 'point', 'text'].includes(t)) { it.x = nums[0] || 0; it.y = nums[1] || 0; it.label = (t === 'point' || t === 'text') ? (free || opt) : opt; }
    else if (t === 'kite') { it.x = nums[0] || 0; it.y = nums[1] || 10; if (nums.length >= 4) { it.fx = nums[2]; it.fy = nums[3]; } it.label = opt; }
    else if (t === 'sun') { it.a = nums[0] || 45; it.side = (has('ขวา') || has('right')) ? 'R' : 'L'; it.shadow = has('เงา') || has('shadow'); it.lab = opt || ''; }
    else if (t === 'river' || t === 'road') { it.x = nums[0] || 0; it.x2 = nums[1] ?? 10; it.label = free || opt; }
    else if (t === 'ladder') { it.x = nums[0] || 0; it.x2 = nums[1] ?? 3; it.h = nums[2] ?? 4; }
    else if (['sight', 'dim', 'line', 'hline'].includes(t)) { [it.x, it.y, it.x2, it.y2] = [nums[0] || 0, nums[1] || 0, nums[2] || 0, nums[3] || 0]; it.dash = has('ประ') || has('dash');
      const lb = words.filter(w => !['ประ', 'dash', 'ซ้าย', 'ขวา', 'บน', 'ล่าง', 'เต็ม', 'ฉาก', 'ไม่มีระดับ'].includes(w) && !colOfWord(w)).join(' ');
      if (t === 'sight') { it.lab = lb; it.full = has('เต็ม'); it.rt = has('ฉาก'); if (has('ไม่มีระดับ')) it.hline = false; if (opt) it.alt = opt; } else it.label = lb || opt;
      if (has('ซ้าย')) it.side = 'L'; if (has('บน')) it.side = 'U'; }
    out.push(it);
  });
  return out;
}
const SC_SRC = 'ตึก 30 40 | A\nต้นไม้ 12 8\nคน 0 ชาย\nคน 4 หญิง\nมอง 0 1.5 30 40 θ เต็ม\nวัด 30 0 30 40 40 ม.\nวัด 0 0 30 0 30 ม.\nนก 18 30\nดวงอาทิตย์ 50 ขวา';
const auto = (lbl, v, unit) => lbl === '-' ? '' : (lbl && lbl.trim()) ? lbl.trim() : (v === undefined || !isFinite(v) ? '' : fmt(v) + (unit || ''));
const nz = v => String(v ?? '').trim() === '' ? NaN : +v;
const SC_COMMON = [['real', 'สัดส่วน', 'auto', ['auto:ปรับให้ดูง่าย (ไม่ตามมาตราส่วน)', 'real:ตามมาตราส่วนจริง']], ['u', 'หน่วย', ' ม.']];
const OBJSEL = ['building:ตึก/อาคาร', 'tree:ต้นไม้', 'pole:เสาธง', 'light:ประภาคาร', 'tower:หอคอย/เสาส่งสัญญาณ', 'cliff:หน้าผา', 'balloon:บอลลูน', 'plane:เครื่องบิน', 'kite:ว่าว', 'bird:นก'];
const WHO = ['man:ผู้ชาย', 'woman:ผู้หญิง', 'none:จุด (ไม่มีคน)'];
const HINT = '(ว่าง = ใช้ตัวเลข, - = ซ่อน)';
Object.assign(LIB, {
  selev: { name: 'มุมเงย: มองยอดตึก ต้นไม้ เสา บอลลูน เครื่องบิน', p: [['obj', 'สิ่งที่มอง', 'building', OBJSEL], ['h', 'ความสูงของสิ่งที่มอง', '40'], ['d', 'ระยะห่างตามแนวราบ', '30'], ['a', 'มุมเงย (องศา) เว้นว่าง = คำนวณ', ''],
    ['who', 'ผู้มอง', 'man', WHO], ['e', 'ความสูงระดับสายตา (0 = มองจากพื้น)', '1.5'], ['gr', 'พื้นระหว่างกลาง', 'ground', ['ground:พื้นดิน', 'river:แม่น้ำ', 'road:ถนน']],
    ['lh', 'ป้ายความสูง ' + HINT, ''], ['ld', 'ป้ายระยะห่าง ' + HINT, ''], ['la', 'ป้ายมุม ' + HINT, 'θ'], ['le', 'ป้ายระดับสายตา ' + HINT, '-'], ['nA', 'ชื่อจุดยอด / ฐาน / ผู้มอง (คั่นด้วย ,)', ''], ...SC_COMMON],
    gen: p => { const e = +p.e || 0; let h = nz(p.h), d = nz(p.d), a = nz(p.a); const r = Math.PI / 180;
      if (isNaN(a)) a = Math.atan((h - e) / d) / r; else if (isNaN(d)) d = (h - e) / Math.tan(a * r); else if (isNaN(h)) h = e + d * Math.tan(a * r);
      if (![h, d, a].every(isFinite) || d <= 0) return svgW(320, 40, T(160, 25, 'กรอกอย่างน้อย 2 ใน 3 ค่า (สูง ระยะ มุม)', { fs: 14, c: CL.red }));
      const air = ['balloon', 'plane', 'kite', 'bird'].includes(p.obj); const N = String(p.nA || '').split(',').map(x => x.trim()); const it = [];
      if (p.gr === 'river') it.push({ t: 'river', x: d * .12, x2: d * .92 }); if (p.gr === 'road') it.push({ t: 'road', x: d * .15, x2: d * .85 });
      if (air) it.push({ t: p.obj, x: d, y: h, label: N[0] }); else it.push({ t: p.obj, x: d, h, label: N[0], blabel: N[1] });
      if (p.who !== 'none') it.push({ t: p.who, x: 0, blabel: N[2] }); else if (N[2]) it.push({ t: 'point', x: 0, y: 0, label: N[2], lx: -14, ly: 20 });
      const ey = p.who === 'none' ? 0 : e; it.push({ t: 'sight', x: 0, y: p.who === 'none' ? 0 : (e || 0.0001), x2: d, y2: air ? h : (p.obj === 'light' ? h * .97 : h), lab: auto(p.la, a, '°'), full: true, rt: !air || true });
      if (auto(p.lh, h, p.u)) it.push({ t: 'dim', x: d, y: 0, x2: d, y2: h, label: auto(p.lh, h, p.u) });
      if (auto(p.ld, d, p.u)) it.push({ t: 'dim', x: 0, y: 0, x2: d, y2: 0, label: auto(p.ld, d, p.u), off: 30 });
      if (ey > 0 && auto(p.le, e, p.u)) it.push({ t: 'dim', x: 0, y: 0, x2: 0, y2: e, label: auto(p.le, e, p.u), side: 'L', off: 26 });
      return sceneSVG(it, { real: p.real === 'real' }); } },
  sdep: { name: 'มุมก้ม: มองจากยอดตึก ประภาคาร หน้าผา ลงมาที่เรือ รถ คน', p: [['obj', 'มองจาก', 'light', ['building:ยอดตึก', 'light:ประภาคาร', 'cliff:หน้าผา', 'tower:หอคอย', 'balloon:บอลลูน', 'plane:เครื่องบิน']], ['tg', 'สิ่งที่มองลงไป', 'boat', ['boat:เรือ', 'car:รถ', 'man:ผู้ชาย', 'woman:ผู้หญิง', 'tree:ต้นไม้ (โคน)', 'point:จุด']],
    ['h', 'ความสูง', '60'], ['d', 'ระยะห่างตามแนวราบ', '80'], ['a', 'มุมก้ม (องศา) เว้นว่าง = คำนวณ', ''], yn('alt', 'แสดงมุมเงยที่เท่ากัน (มุมแย้ง) ที่เป้าหมาย', 'no'), yn('who', 'วาดคนยืนบนยอด', 'no'),
    ['lh', 'ป้ายความสูง ' + HINT, ''], ['ld', 'ป้ายระยะห่าง ' + HINT, ''], ['la', 'ป้ายมุม ' + HINT, 'α'], ['nA', 'ชื่อจุดบน / จุดล่าง / เป้าหมาย (คั่นด้วย ,)', ''], ...SC_COMMON],
    gen: p => { let h = nz(p.h), d = nz(p.d), a = nz(p.a); const r = Math.PI / 180; if (isNaN(a)) a = Math.atan(h / d) / r; else if (isNaN(d)) d = h / Math.tan(a * r); else if (isNaN(h)) h = d * Math.tan(a * r);
      if (![h, d, a].every(isFinite) || d <= 0) return svgW(320, 40, T(160, 25, 'กรอกอย่างน้อย 2 ใน 3 ค่า', { fs: 14, c: CL.red }));
      const air = ['balloon', 'plane'].includes(p.obj); const N = String(p.nA || '').split(',').map(x => x.trim()); const it = [];
      if (p.tg === 'boat') it.push({ t: 'river', x: d * .25, x2: d * 1.2 });
      if (air) it.push({ t: p.obj, x: 0, y: h, label: N[0] }); else it.push({ t: p.obj, x: 0, h, dir: -1, label: N[0], blabel: N[1] });
      if (ON(p.who) && !air) it.push({ t: 'man', x: -0.0001, base: h });
      if (p.tg === 'point') it.push({ t: 'point', x: d, y: 0, label: N[2] }); else if (p.tg === 'tree') it.push({ t: 'tree', x: d, h: h * .15, blabel: N[2] }); else it.push({ t: p.tg, x: d, blabel: N[2] });
      it.push({ t: 'sight', x: 0, y: h, x2: d, y2: 0, lab: auto(p.la, a, '°'), full: true, alt: ON(p.alt) ? auto(p.la, a, '°') : '' });
      if (auto(p.lh, h, p.u)) it.push({ t: 'dim', x: 0, y: 0, x2: 0, y2: h, label: auto(p.lh, h, p.u), side: 'L' });
      if (auto(p.ld, d, p.u)) it.push({ t: 'dim', x: 0, y: 0, x2: d, y2: 0, label: auto(p.ld, d, p.u), off: 32 });
      return sceneSVG(it, { real: p.real === 'real' }); } },
  stwo: { name: 'มองยอดจาก 2 ตำแหน่ง (มุมเงยสองค่า)', p: [['obj', 'สิ่งที่มอง', 'building', OBJSEL.slice(0, 6)], ['a1', 'มุมเงยจากจุดไกล (องศา)', '30'], ['a2', 'มุมเงยจากจุดใกล้ (องศา)', '60'], ['s', 'ระยะระหว่าง 2 จุด', '40'], ['h', 'ความสูง (ว่าง = คำนวณ)', ''],
    ['side', 'ตำแหน่งผู้มอง', 'same', ['same:อยู่ข้างเดียวกัน', 'opp:อยู่คนละข้าง']], ['who', 'ผู้มอง', 'none', WHO],
    ['l1', 'ป้ายมุมไกล ' + HINT, 'α'], ['l2', 'ป้ายมุมใกล้ ' + HINT, 'β'], ['ls', 'ป้ายระยะ 2 จุด ' + HINT, ''], ['lx', 'ป้ายระยะที่เหลือ ' + HINT, 'x'], ['lh', 'ป้ายความสูง ' + HINT, 'h'], ['nA', 'ชื่อจุด ยอด, ฐาน, จุดไกล, จุดใกล้', 'A,B,C,D'], ...SC_COMMON],
    gen: p => { const r = Math.PI / 180, a1 = +p.a1 * r, a2 = +p.a2 * r; let s = nz(p.s), h = nz(p.h); const opp = p.side === 'opp';
      if (isNaN(h)) h = opp ? s / (1 / Math.tan(a1) + 1 / Math.tan(a2)) : s / (1 / Math.tan(a1) - 1 / Math.tan(a2)); else if (isNaN(s)) s = opp ? h / Math.tan(a1) + h / Math.tan(a2) : h / Math.tan(a1) - h / Math.tan(a2);
      if (!(h > 0 && s > 0)) return svgW(340, 40, T(170, 25, 'มุมจากจุดไกลต้องเล็กกว่ามุมจากจุดใกล้', { fs: 14, c: CL.red }));
      const n2 = h / Math.tan(a2), n1 = h / Math.tan(a1); const N = String(p.nA || '').split(',').map(x => x.trim()); const it = []; const D = n1;
      const pF = 0, pN = opp ? D + n2 : D - n2; it.push({ t: p.obj, x: D, h, label: N[0], blabel: N[1], dir: opp ? 1 : 1 });
      const who = (x, nm) => { if (p.who !== 'none') it.push({ t: p.who, x, blabel: nm }); else it.push({ t: 'point', x, y: 0, label: nm, lx: -5, ly: 22 }); };
      who(pF, N[2]); who(pN, N[3]);
      it.push({ t: 'sight', x: pF, y: 0, x2: D, y2: h, lab: auto(p.l1, +p.a1, '°'), hline: false, r: 34 }); it.push({ t: 'sight', x: pN, y: 0, x2: D, y2: h, lab: auto(p.l2, +p.a2, '°'), hline: false, r: 26 });
      if (auto(p.lh, h, p.u)) it.push({ t: 'dim', x: D, y: 0, x2: D, y2: h, label: auto(p.lh, h, p.u) });
      if (!opp) { if (auto(p.ls, s, p.u)) it.push({ t: 'dim', x: pF, y: 0, x2: pN, y2: 0, label: auto(p.ls, s, p.u), off: 34 }); if (auto(p.lx, n2, p.u)) it.push({ t: 'dim', x: pN, y: 0, x2: D, y2: 0, label: auto(p.lx, n2, p.u), off: 34 }); }
      else if (auto(p.ls, s, p.u)) it.push({ t: 'dim', x: pF, y: 0, x2: pN, y2: 0, label: auto(p.ls, s, p.u), off: 34 });
      return sceneSVG(it, { real: p.real === 'real' }); } },
  stwob: { name: 'ตึกสองหลัง: มุมเงยถึงยอด และมุมก้มถึงฐาน', p: [['h1', 'ความสูงตึกที่ยืนมอง', '20'], ['h2', 'ความสูงตึกตรงข้าม', '50'], ['d', 'ระยะห่างระหว่างตึก', '30'],
    ['la', 'ป้ายมุมเงย ' + HINT, 'α'], ['lb', 'ป้ายมุมก้ม ' + HINT, 'β'], ['l1', 'ป้ายความสูงตึกแรก ' + HINT, ''], ['l2', 'ป้ายความสูงตึกที่สอง ' + HINT, ''], ['ld', 'ป้ายระยะห่าง ' + HINT, ''], yn('who', 'วาดคนบนตึก', 'yes'), ['nA', 'ชื่อตึก (คั่นด้วย ,)', 'A,B'], ...SC_COMMON],
    gen: p => { const h1 = +p.h1, h2 = +p.h2, d = +p.d; const r = Math.PI / 180; const N = String(p.nA || '').split(',').map(x => x.trim()); const it = [{ t: 'building', x: 0, h: h1, dir: -1, label: N[0] }, { t: 'building', x: d, h: h2, label: N[1] }];
      if (ON(p.who)) it.push({ t: 'man', x: -0.0001, base: h1 });
      it.push({ t: 'sight', x: 0, y: h1, x2: d, y2: h2, lab: auto(p.la, Math.atan((h2 - h1) / d) / r, '°'), full: true, r: 34 }); it.push({ t: 'sight', x: 0, y: h1, x2: d, y2: 0, lab: auto(p.lb, Math.atan(h1 / d) / r, '°'), hline: false, r: 52, c: CL.purple });
      if (auto(p.l1, h1, p.u)) it.push({ t: 'dim', x: 0, y: 0, x2: 0, y2: h1, label: auto(p.l1, h1, p.u), side: 'L' }); if (auto(p.l2, h2, p.u)) it.push({ t: 'dim', x: d, y: 0, x2: d, y2: h2, label: auto(p.l2, h2, p.u) });
      if (auto(p.ld, d, p.u)) it.push({ t: 'dim', x: 0, y: 0, x2: d, y2: 0, label: auto(p.ld, d, p.u), off: 30 });
      return sceneSVG(it, { real: p.real === 'real' }); } },
  sshadow: { name: 'เงาจากแสงอาทิตย์ (ตึก ต้นไม้ คน เสา)', p: [['objs', 'สิ่งของ: ชนิด:ความสูง (คั่นด้วย ,) ชนิด ตึก ต้นไม้ เสาธง ชาย หญิง ประภาคาร หอคอย', 'ตึก:30, ต้นไม้:10, ชาย, หญิง'], ['a', 'มุมของแสงอาทิตย์กับพื้น (องศา)', '40'], ['side', 'ดวงอาทิตย์อยู่ด้าน', 'L', ['L:ซ้าย', 'R:ขวา']],
    ['gap', 'ระยะห่างระหว่างสิ่งของ (ว่าง = อัตโนมัติ)', ''], ['la', 'ป้ายมุม ' + HINT, ''], yn('lh', 'บอกความสูง'), yn('ls', 'บอกความยาวเงา'), ...SC_COMMON],
    gen: p => { const a = +p.a || 40, r = Math.PI / 180, sg = p.side === 'R' ? -1 : 1; const O = list(p.objs).map(t => { const [n, h] = t.split(':').map(x => x.trim()); const ty = scType(n) || (ptypeOf(n) === 'woman' ? 'woman' : ptypeOf(n) === 'man' ? 'man' : null); return ty ? { t: ty, h: +h || (ty === 'man' || ty === 'woman' ? 1.7 : 10) } : null; }).filter(Boolean);
      if (!O.length) return svgW(200, 40, ''); const maxh = Math.max(...O.map(o => o.h)); let x = 0; const it = [{ t: 'sun', a, side: p.side, shadow: true, lab: p.la === '-' ? '-' : p.la || fmt(a) + '°' }];
      const gap = nz(p.gap); O.forEach((o, i) => { const L = o.h / Math.tan(a * r); const q = { t: o.t, x, h: o.h }; if (ON(p.ls)) q.slab = fmt(L) + p.u; it.push(q); if (ON(p.lh) && o.t !== 'man' && o.t !== 'woman') it.push({ t: 'dim', x, y: 0, x2: x, y2: o.h, label: fmt(o.h) + p.u, side: sg > 0 ? 'L' : undefined }); x += isNaN(gap) ? Math.max(L, maxh * .35) + maxh * .45 : gap; });
      if (sg < 0) it.forEach(q => { if (q.x !== undefined) { q.x = -q.x; if (q.x2 !== undefined) q.x2 = -q.x2; } });
      return sceneSVG(it, { real: p.real === 'real' }); } },
  sladder: { name: 'บันไดพาดกำแพง / ตึก / ต้นไม้', p: [['L', 'ความยาวบันได', '5'], ['a', 'มุมที่บันไดทำกับพื้น (องศา) ว่าง = คำนวณ', '60'], ['d', 'ระยะจากโคนบันไดถึงกำแพง (ว่าง = คำนวณ)', ''], ['wall', 'พาดกับ', 'wall', ['wall:กำแพง', 'building:ตึก', 'tree:ต้นไม้']],
    ['lL', 'ป้ายความยาวบันได ' + HINT, ''], ['la', 'ป้ายมุม ' + HINT, 'θ'], ['ld', 'ป้ายระยะโคน ' + HINT, ''], ['lh', 'ป้ายความสูงที่พาด ' + HINT, 'h'], yn('rt', 'เครื่องหมายมุมฉาก'), ...SC_COMMON],
    gen: p => { const r = Math.PI / 180; let L = nz(p.L), a = nz(p.a), d = nz(p.d); if (isNaN(a)) a = Math.acos(d / L) / r; if (isNaN(d)) d = L * Math.cos(a * r); const h = Math.sqrt(Math.max(0, L * L - d * d));
      if (!(h > 0)) return svgW(260, 40, T(130, 25, 'ค่าที่กรอกไม่ถูกต้อง', { fs: 14, c: CL.red })); const it = [];
      it.push(p.wall === 'tree' ? { t: 'tree', x: d, h: h * 1.35 } : p.wall === 'building' ? { t: 'building', x: d, h: h * 1.25 } : { t: 'wall', x: d, h: h * 1.2 });
      it.push({ t: 'ladder', x: 0, x2: d, h });
      if (auto(p.la, a, '°')) it.push({ t: 'sight', x: 0, y: 0, x2: d, y2: h, lab: auto(p.la, a, '°'), hline: false, noline: true, c: CL.orange, r: 30 });
      if (auto(p.lL, L, p.u)) it.push({ t: 'text', x: d * .42, y: h * .58, label: auto(p.lL, L, p.u), c: '#8b5a2b' });
      if (auto(p.ld, d, p.u)) it.push({ t: 'dim', x: 0, y: 0, x2: d, y2: 0, label: auto(p.ld, d, p.u), off: 24 });
      if (auto(p.lh, h, p.u)) it.push({ t: 'dim', x: d, y: 0, x2: d, y2: h, label: auto(p.lh, h, p.u) });
      let svg = sceneSVG(it, { real: p.real === 'real' }); return svg; } },
  skite: { name: 'ว่าวและเชือกว่าว / เสาโยงลวด', p: [['L', 'ความยาวเชือก', '50'], ['a', 'มุมที่เชือกทำกับแนวราบ (องศา)', '40'], ['e', 'ความสูงมือที่ถือเชือก', '1.2'], ['who', 'ผู้ถือ', 'woman', WHO], ['o', 'วัตถุ', 'kite', ['kite:ว่าว', 'balloon:บอลลูน', 'bird:นก']],
    ['lL', 'ป้ายความยาวเชือก ' + HINT, ''], ['la', 'ป้ายมุม ' + HINT, 'θ'], ['lh', 'ป้ายความสูงจากพื้น ' + HINT, 'h'], ...SC_COMMON],
    gen: p => { const r = Math.PI / 180, L = +p.L || 50, a = +p.a || 40, e = p.who === 'none' ? 0 : (+p.e || 0); const dx = L * Math.cos(a * r), dy = L * Math.sin(a * r); const it = [];
      if (p.who !== 'none') it.push({ t: p.who, x: 0 }); it.push({ t: p.o, x: dx, y: e + dy, fx: 0, fy: e || 0.0001 });
      it.push({ t: 'sight', x: 0, y: e || 0.0001, x2: dx, y2: e + dy, lab: auto(p.la, a, '°'), full: true, noline: true, c: CL.orange, rt: true });
      if (auto(p.lL, L, p.u)) it.push({ t: 'text', x: dx * .42, y: e + dy * .58, label: auto(p.lL, L, p.u) });
      if (auto(p.lh, e + dy, p.u)) it.push({ t: 'dim', x: dx, y: 0, x2: dx, y2: e + dy, label: auto(p.lh, e + dy, p.u), off: 26 });
      return sceneSVG(it, { real: p.real === 'real' }); } },
  scene: { name: 'ฉากกำหนดเอง (วางตึก ต้นไม้ คน รถ เรือ ดวงอาทิตย์ แนวสายตา ระยะ ได้อิสระ)', p: [['src', 'คำสั่งบรรทัดละ 1 อย่าง (ตำแหน่ง x และความสูงเป็นเมตร)', SC_SRC, 'ta'], ...SC_COMMON],
    gen: p => sceneSVG(parseScene(p.src), { real: p.real === 'real' }) },
});

/* ---------- คำอธิบายในฟอร์ม ---------- */
const KIND_HELP = {
  scene: '<b>คำสั่ง</b> (ตัวเลขเป็นเมตร x = ตำแหน่งตามแนวราบ):<br>ตึก x สูง [กว้าง] [ซ้าย] | ชื่อ · ต้นไม้ x สูง · เสาธง x สูง · ประภาคาร x สูง · หอคอย x สูง · หน้าผา x สูง [ขวา] · ภูเขา x สูง · กำแพง x สูง<br>คน x [หญิง] [ยืนบนความสูง] · ชาย x · หญิง x · เรือ x · รถ x · บอลลูน x y · เครื่องบิน x y · นก x y · ว่าว x y [มือx มือy]<br>แม่น้ำ x1 x2 · ถนน x1 x2 · บันได โคนx กำแพงx สูง · ดวงอาทิตย์ มุม [ซ้าย/ขวา] [เงา]<br><b>มอง</b> x1 y1 x2 y2 ป้ายมุม [เต็ม] [ฉาก] [ไม่มีระดับ] | ป้ายมุมแย้ง — ถ้า x1 y1 ตรงกับคน (y ≤ 2) เส้นจะออกจากตาคนนั้น<br><b>วัด</b> x1 y1 x2 y2 ป้าย [ซ้าย/บน] · เส้น x1 y1 x2 y2 [ประ] · จุด x y ชื่อ · ข้อความ x y ข้อความ · ใส่สีท้ายบรรทัดได้ เช่น แดง เขียว',
  cplot: '<b>ตัวอย่าง</b>: <code>|z - (1+i)| = 2</code> วงกลม · <code>|z + 2| &lt;= 1</code> ระบายในวง · <code>1 &lt;= |z| &lt;= 2</code> วงแหวน · <code>|z - 1| = |z + i|</code> เส้นแบ่งครึ่งตั้งฉาก · <code>arg(z) = π/4</code> หรือ <code>arg(z - 1) = 60°</code> รังสี · <code>0 &lt;= arg(z) &lt;= π/2</code> เซกเตอร์ · <code>Re(z) &gt;= 1</code> · <code>-1 &lt; Im(z) &lt; 2</code> · <code>z^6 = 1</code> รากที่ 6 ของ 1 · <code>z1 = 3+2i</code> จุด<br>หลายเงื่อนไขในบรรทัดเดียวคั่นด้วย “และ” → ระบายเฉพาะบริเวณร่วม · ใช้ &lt; หรือ &gt; จะได้เส้นประ · ใส่สีท้ายบรรทัดได้',
  crowd: '<b>ตัวอย่างกลุ่ม</b>: <code>ชาย×3, หญิง×2</code> · <code>เด็กชาย×2 เขียว, เด็กหญิง×2 ชมพู</code> · <code>หนังสือ×4, ดาว×2</code> · <code>A×1, B×1, C×1</code> (พิมพ์ตัวอักษร/คำเอง = ป้ายสี่เหลี่ยม) · ชื่อไอคอนในเมนูไอคอนก็ใช้ได้ เช่น ลูกบอลแดง เหรียญหัว (H)<br>ลำดับเอง: เลือก “ตามลำดับที่พิมพ์” แล้วพิมพ์ <code>ช ญ ญ ช ด ก</code> (ช = ชาย ญ = หญิง ด = เด็กชาย ก = เด็กหญิง)',
  trim: 'เลือกข้อมูลที่กำหนด แล้วกรอกเฉพาะค่าที่ใช้ ค่าอื่นระบบคำนวณให้และวาดตามขนาดจริง · ป้ายมุม/ด้านพิมพ์เองได้ เช่น <code>θ,,</code> = ให้มุม A ชื่อ θ ที่เหลือตามตัวเลือก · <code>-</code> = ซ่อน',
};
const _libEnhance0 = libEnhance;
libEnhance = function () { _libEnhance0(); const h = KIND_HELP[libKind]; if (h) { const d = document.createElement('details'); d.className = 'fnhelpbox'; d.innerHTML = '<summary style="cursor:pointer;font-weight:700">วิธีใช้ / ตัวอย่าง</summary>' + h; $('#lbForm').prepend(d); } };

/* ---------- หมวดหมู่ (ปรับใหม่) ---------- */
LIBCAT.length = 0;
LIBCAT.push(
  ['★ ใช้บ่อย', ['combo', 'fgraph', 'areas', 'crowd', 'selev', 'scene', 'tree', 'venn2', 'trim']],
  ['— ม.4 —'],
  ['เซต', ['venn2', 'venn3']],
  ['จำนวนจริง (เส้นจำนวน ช่วง)', ['numline']],
  ['ฟังก์ชัน', ['fgraph', 'parab', 'piece', 'explog', 'combo']],
  ['เรขาคณิตวิเคราะห์ ภาคตัดกรวย', ['aline', 'conic', 'combo']],
  ['— ม.5 —'],
  ['ตรีโกณมิติ', ['trim', 'tri', 'ucircle', 'trigg']],
  ['ตรีโกณมิติ: โจทย์ประยุกต์ (มุมเงย มุมก้ม)', ['selev', 'sdep', 'stwo', 'stwob', 'sshadow', 'sladder', 'skite', 'scene']],
  ['เวกเตอร์', ['vec2', 'vec3', 'crossar', 'vvol']],
  ['จำนวนเชิงซ้อน', ['argand', 'cplot']],
  ['หลักการนับ', ['crowd', 'slots', 'menu', 'roads', 'tree', 'pascal', 'letters', 'seats', 'round', 'glue', 'gaps', 'pick', 'boxes', 'stars', 'grid', 'envel', 'stripes', 'people']],
  ['ความน่าจะเป็น', ['tree', 'dice', 'coinrow', 'balls', 'crowd', 'spinner', 'pmodel', 'venn2']],
  ['— ม.6 —'],
  ['ลำดับและอนุกรม', ['seq']],
  ['แคลคูลัส', ['sketch', 'tangent', 'rate', 'riemann', 'integ', 'areas']],
  ['สถิติ', ['hist', 'boxp', 'scatter', 'normal']],
  ['— เรขาคณิต —'],
  ['เรขาคณิต 2 มิติ', ['tri', 'trim', 'quad', 'circ', 'poly', 'paral']],
  ['เรขาคณิต 3 มิติ', ['solid', 'cubecut', 'solidcut']],
  ['— สร้างภาพตามสถานการณ์ —'],
  ['ภาพสถานการณ์ / ฉากกำหนดเอง', ['scene', 'selev', 'sdep', 'stwo', 'stwob', 'sshadow', 'sladder', 'skite', 'crowd']],
  ['วาดเอง (อิสระ)', ['FREE']],
);


/* ---------- เปลี่ยนสีทีละส่วน (ใช้ได้ทุกรูป) ---------- */
const cmapParse = m => String(m || '').split(',').map(x => x.split(':')).filter(x => /^#[0-9a-f]{6}$/i.test(x[0]) && /^#[0-9a-f]{6}$/i.test(x[1])).map(([a, b]) => [a.toLowerCase(), b.toLowerCase()]);
function tintOf(h, base) { const x = hexRGB(h), b = hexRGB(base); if (Math.max(...x) - Math.min(...x) < 14) return null; let ts = [], w = 0; for (let i = 0; i < 3; i++) if (255 - b[i] > 25) { ts.push((x[i] - b[i]) / (255 - b[i])); w++; } if (!w) return null; const t = ts.reduce((a, c) => a + c, 0) / w; if (t <= .05 || t >= .98) return null; const err = Math.max(...[0, 1, 2].map(i => Math.abs(b[i] + (255 - b[i]) * t - x[i]))); return err < 26 ? t : null; }
function cmapApply(svg, m) {
  const M = cmapParse(m); if (!M.length) return svg; const map = new Map(M);
  return svg.replace(/#[0-9a-fA-F]{6}\b/g, h => { const l = h.toLowerCase(); if (map.has(l)) return map.get(l); for (const [a, b] of M) { const t = tintOf(l, a); if (t !== null) return mixHex(b, '#ffffff', t); } return h; });
}
function svgColors(svg) { // สีหลักที่ใช้ในรูป พร้อมหน้าที่
  const info = new Map(); const add = (c, role) => { c = c.toLowerCase(); const [r, g, b] = hexRGB(c); const L = (.299 * r + .587 * g + .114 * b) / 255; if (L > .93) return; const o = info.get(c) || { n: 0, roles: {} }; o.n++; o.roles[role] = (o.roles[role] || 0) + 1; info.set(c, o); };
  for (const m of svg.matchAll(/<text[^>]*fill="(#[0-9a-fA-F]{6})"/g)) add(m[1], 'ตัวอักษร');
  for (const m of svg.matchAll(/stroke="(#[0-9a-fA-F]{6})"/g)) add(m[1], 'เส้น');
  for (const m of svg.matchAll(/<(?!text)\w+[^>]*?\sfill="(#[0-9a-fA-F]{6})"/g)) add(m[1], 'พื้น/จุด');
  const all = [...info.keys()]; const strong = all.filter(c => !all.some(b => b !== c && tintOf(c, b) !== null));
  return strong.map(c => ({ c, n: info.get(c).n, role: Object.entries(info.get(c).roles).sort((a, b) => b[1] - a[1]).map(x => x[0]).slice(0, 2).join(' · ') })).sort((a, b) => (a.role.startsWith('ตัวอักษร') - b.role.startsWith('ตัวอักษร')) || b.n - a.n).slice(0, 14);
}
let cmapKey = '';
function cmapPanel(svg0) {
  const box = $('#lbCmap'); if (!box) return; const inp = $('#lbForm [data-k="_cmap"]'); const M = new Map(cmapParse(inp.value));
  const cols = svgColors(svg0); const key = libKind + '|' + cols.map(x => x.c).join(',');
  if (key === cmapKey && box.childElementCount) { cols.forEach(x => { const e = box.querySelector(`[data-oc="${x.c}"]`); if (e && document.activeElement !== e) e.value = M.get(x.c) || x.c; }); return; }
  cmapKey = key;
  box.innerHTML = '<div class="lbsh">🎨 สีของแต่ละเส้น/ส่วน <small>(คลิกช่องสีเพื่อเปลี่ยนเฉพาะส่วนนั้น)</small></div>' + (cols.length ? `<div class="cmgrid">${cols.map(x => `<label class="cmit" title="สีเดิม ${x.c}"><input type="color" data-oc="${x.c}" value="${M.get(x.c) || x.c}"><span>${x.role}${M.has(x.c) ? ' <b>✎</b>' : ''}</span></label>`).join('')}</div><button type="button" class="tb cmreset">คืนสีเดิมทั้งหมด</button>` : '<span class="hint">รูปนี้ไม่มีสีให้เปลี่ยน</span>');
  box.querySelectorAll('[data-oc]').forEach(e => e.addEventListener('input', ev => { ev.stopPropagation(); const M2 = new Map(cmapParse(inp.value)); if (e.value.toLowerCase() === e.dataset.oc) M2.delete(e.dataset.oc); else M2.set(e.dataset.oc, e.value.toLowerCase()); inp.value = [...M2].map(([a, b]) => a + ':' + b).join(','); const sp = e.nextElementSibling; if (sp && !sp.querySelector('b') && M2.has(e.dataset.oc)) sp.insertAdjacentHTML('beforeend', ' <b>✎</b>'); libPrev(); }));
  const r = box.querySelector('.cmreset'); if (r) r.onclick = () => { inp.value = ''; cmapKey = ''; libPrev(); };
}
const _libPrev0 = libPrev;
libPrev = function () {
  const lib = libRead(); const q = Object.assign({}, lib.p); delete q._cmap;
  const L = LIB[lib.kind]; if (L && $('#lbCmap') && $('#lbForm [data-k="_cmap"]')) { const p = {}; L.p.forEach(([k, , d]) => p[k] = q[k] !== undefined ? q[k] : d); let svg0 = ''; try { svg0 = libStyleApply(L.gen(p), Object.assign({}, q, { _lw: 1, _fs: 1 })); } catch (e) { } cmapPanel(svg0); }
  _libPrev0();
};

/* ---------- ระบายสีบริเวณในแผนภาพเวนน์ (พิมพ์นิพจน์เซตได้) ---------- */
function setExprFn(src, names) { // คืนฟังก์ชัน m => true/false ; m = { A:0/1, ... }
  const s = String(src || '').replace(/\s+/g, '').replace(/[∪⋃]|\bor\b|หรือ|\+/g, '∪').replace(/[∩⋂]|\band\b|และ|\*|·/g, '∩').replace(/[−\-\\]/g, '−').replace(/['’ᶜ]|\^c/g, '′').replace(/[△⊕]/g, 'Δ');
  let i = 0; const peek = () => s[i];
  const ident = () => { let w = ''; while (i < s.length && /[A-Za-zก-๙0-9]/.test(s[i])) w += s[i++]; return w; };
  const prim = () => { let f; if (peek() === '(') { i++; f = expr(); if (peek() !== ')') throw 0; i++; } else if (peek() === '∅' || peek() === 'Ø') { i++; f = () => false; }
    else { const w = ident(); if (!w) throw 0; if (w === 'U' || w === (names.U || 'U')) f = () => true; else { const k = Object.keys(names).find(k => k !== 'U' && (names[k] === w || k === w)); if (!k) throw 0; f = m => !!m[k]; } }
    while (peek() === '′') { i++; const g = f; f = m => !g(m); } return f; };
  const inter = () => { let f = prim(); while (peek() === '∩') { i++; const a = f, b = prim(); f = m => a(m) && b(m); } return f; };
  function expr() { let f = inter(); while ('∪−Δ'.includes(peek() || '#')) { const op = s[i++]; const a = f, b = inter(); f = op === '∪' ? m => a(m) || b(m) : op === '−' ? m => a(m) && !b(m) : m => a(m) !== b(m); } return f; }
  const f = expr(); if (i < s.length) throw 0; return f;
}
function vennShade(circles, rect, expr, pat, names) {
  let f; try { f = setExprFn(expr, names); } catch (e) { return ''; }
  const id = 'vn' + Math.random().toString(36).slice(2, 7), col = '#f2c9a8', dk = CL.orange; const [rx, ry, rw, rh] = rect;
  let defs = circles.map(([cx, cy, r], k) => `<clipPath id="${id}c${k}"><circle cx="${cx}" cy="${cy}" r="${r}"/></clipPath>`).join('');
  const fill = pat === 'hatch' ? `url(#${id}p)` : pat === 'dot' ? `url(#${id}d)` : col;
  if (pat === 'hatch') defs += `<pattern id="${id}p" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="8" height="8" fill="#fff"/><path d="M0 0V8" stroke="${dk}" stroke-width="1.6"/></pattern>`;
  if (pat === 'dot') defs += `<pattern id="${id}d" width="7" height="7" patternUnits="userSpaceOnUse"><rect width="7" height="7" fill="#fff"/><circle cx="3.5" cy="3.5" r="1.3" fill="${dk}"/></pattern>`;
  let body = ''; const n = circles.length;
  for (let mask = 0; mask < (1 << n); mask++) {
    const m = {}; circles.forEach(([, , , k], j) => m[k] = (mask >> j) & 1); if (!f(m)) continue;
    const outs = circles.map((c, j) => [c, j]).filter(([, j]) => !((mask >> j) & 1)); const mid = `${id}m${mask}`;
    if (outs.length) defs += `<mask id="${mid}"><rect x="${rx}" y="${ry}" width="${rw}" height="${rh}" fill="#fff"/>${outs.map(([[cx, cy, r]]) => `<circle cx="${cx}" cy="${cy}" r="${r}" fill="#000"/>`).join('')}</mask>`;
    let g = `<rect x="${rx}" y="${ry}" width="${rw}" height="${rh}" fill="${fill}"${outs.length ? ` mask="url(#${mid})"` : ''}/>`;
    circles.forEach((c, j) => { if ((mask >> j) & 1) g = `<g clip-path="url(#${id}c${j})">${g}</g>`; }); body += g;
  }
  return `<defs>${defs}</defs>${body}`;
}
KIND_HELP.venn2 = KIND_HELP.venn3 = 'ระบายสีบริเวณ: เลือกจากรายการ หรือเลือก “พิมพ์เอง” แล้วพิมพ์นิพจน์เซต เช่น <code>A∪B′</code> <code>(A∩B)′</code> <code>A−(B∪C)</code> <code>(A∩B)∪C′</code> <code>AΔB</code> — ใช้ชื่อเซตที่ตั้งไว้ได้ · พิมพ์ u, n, - , \' แทน ∪ ∩ − ′ ได้ · กดปุ่มสัญลักษณ์ใต้ช่องเพื่อแทรก';
const _libEnhance2 = libEnhance;
libEnhance = function () { _libEnhance2(); if (libKind === 'venn2' || libKind === 'venn3') { const el = $('#lbForm [data-k="ex"]'); if (!el) return; const d = document.createElement('div'); d.className = 'fnchips'; d.style.margin = '-4px 0 8px'; d.innerHTML = [['∪', '∪'], ['∩', '∩'], ['−', '−'], ['′', '′'], ['Δ', 'Δ'], ['( )', '(‸)'], ['U', 'U'], ['∅', '∅']].map(([n, sn]) => `<button type="button" class="tb" data-vs="${sn}">${n}</button>`).join(''); el.closest('.row').after(d); d.querySelectorAll('[data-vs]').forEach(b => b.onmousedown = e => { e.preventDefault(); const sh = $('#lbForm [data-k="sh"]'); if (sh.value !== 'ex') sh.value = 'ex'; condInsert(el, b.dataset.vs); }); el.addEventListener('input', () => { const sh = $('#lbForm [data-k="sh"]'); if (el.value.trim() && sh.value !== 'ex') { sh.value = 'ex'; libPrev(); } }); } };

