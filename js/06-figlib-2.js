'use strict';
/* ===================== คลังรูปตามบทเรียน: ฟังก์ชัน ตรีโกณ จำนวนเชิงซ้อน ลำดับ แคลคูลัส สถิติ ===================== */
/* แกนพิกัดที่สเกล x, y แยกกันได้ */
function axes(o) {
  const W = o.W || 460, H = o.H || 320, pad = 30, x0 = o.x0, x1 = o.x1, y0 = o.y0, y1 = o.y1;
  const kx = (W - 2 * pad) / (x1 - x0), ky = (H - 2 * pad) / (y1 - y0);
  const X = x => pad + (x - x0) * kx, Y = y => pad + (y1 - y) * ky;
  const cid = 'clp' + Math.random().toString(36).slice(2, 8);
  let s = `<defs><clipPath id="${cid}"><rect x="${pad}" y="${pad - 4}" width="${W - 2 * pad}" height="${H - 2 * pad + 8}"/></clipPath></defs>`;
  const xt = o.xt || [], yt = o.yt || [];
  if (o.grid) { xt.forEach(([v]) => s += `<path d="M${X(v)} ${Y(y0)}V${Y(y1)}" stroke="#eceef2"/>`); yt.forEach(([v]) => s += `<path d="M${X(x0)} ${Y(v)}H${X(x1)}" stroke="#eceef2"/>`); }
  const ax = (x0 <= 0 && 0 <= x1) ? X(0) : X(x0), ay = (y0 <= 0 && 0 <= y1) ? Y(0) : Y(y0);
  s += `<path d="M${X(x0) - 6} ${ay}H${X(x1) + 12}" stroke="${CL.dark}" stroke-width="1.3"/><path d="M${X(x1) + 14} ${ay}l-8 -4v8z" fill="${CL.dark}"/>`;
  if (!o.noY) s += `<path d="M${ax} ${Y(y0) + 6}V${Y(y1) - 12}" stroke="${CL.dark}" stroke-width="1.3"/><path d="M${ax} ${Y(y1) - 14}l-4 8h8z" fill="${CL.dark}"/>`;
  s += svgMath(X(x1) + 16, ay + 18, o.xl || 'x', { fs: 15 }); if (!o.noY) s += svgMath(ax - 12, Y(y1) - 8, o.yl || 'y', { fs: 15, a: 'end' });
  xt.forEach(([v, l]) => { if (Math.abs(v) < 1e-9 && !o.noY) return; s += `<path d="M${X(v)} ${ay - 3}V${ay + 3}" stroke="${CL.dark}"/>` + svgMath(X(v), ay + 16, l, { fs: 11.5 }); });
  if (!o.noY) yt.forEach(([v, l]) => { if (Math.abs(v) < 1e-9) return; s += `<path d="M${ax - 3} ${Y(v)}H${ax + 3}" stroke="${CL.dark}"/>` + svgMath(ax - 6, Y(v) + 4, l, { fs: 11.5, a: 'end' }); });
  if (!o.noY && x0 <= 0 && 0 <= x1 && y0 <= 0 && 0 <= y1) s += svgMath(ax - 6, ay + 15, 'O', { fs: 12, a: 'end' });
  return { s, X, Y, cid, x0, x1, y0, y1, w: W + 16, h: H };
}
const ticks = (a, b, st) => { const out = []; st = +st || 1; for (let v = Math.ceil(a / st) * st, k = 0; v <= b + 1e-9 && k < 80; v += st, k++) { const r = Math.round(v * 1e6) / 1e6; out.push([r, fmt(r)]); } return out; };
const AXP = (x0, x1, y0, y1, st = '1') => [['x0', 'x น้อยสุด', x0], ['x1', 'x มากสุด', x1], ['y0', 'y น้อยสุด', y0], ['y1', 'y มากสุด', y1], ['st', 'ระยะห่างของสเกล', st], yn('grid', 'เส้นตาราง')];
const ax0 = p => axes({ x0: +p.x0, x1: +p.x1, y0: +p.y0, y1: +p.y1, grid: ON(p.grid), xt: ticks(+p.x0, +p.x1, p.st), yt: ticks(+p.y0, +p.y1, p.st) });
const dfn = (f, x, h = 1e-4) => (f(x + h) - f(x - h)) / (2 * h);
const shade = (pts, c = '#f6d3bd', o = .8) => `<path d="M${pts.map(p => p.map(v => v.toFixed(1)).join(' ')).join('L')}Z" fill="${c}" opacity="${o}"/>`;
const piLab = v => { const k = Math.round(v / (Math.PI / 2)); if (k === 0) return '0'; const n = k % 2 === 0 ? k / 2 : k; const d = k % 2 === 0 ? 1 : 2; const sign = n < 0 ? '−' : ''; const a = Math.abs(n); return sign + (a === 1 ? '' : a) + 'π' + (d === 2 ? '/2' : ''); };

Object.assign(LIB, {
  /* ---------- ฟังก์ชัน ---------- */
  parab: { name: 'พาราโบลา y = a(x − h)² + k', p: [['a', 'a', '1'], ['h', 'h', '1'], ['k', 'k', '-4'], yn('v', 'จุดยอดและแกนสมมาตร'), yn('r', 'จุดตัดแกน x'), ...AXP('-4', '6', '-5', '6')],
    gen: p => { const A = ax0(p); let s = A.s; const a = +p.a || 1, h = +p.h || 0, k = +p.k || 0; const f = x => a * (x - h) ** 2 + k; s += curve(f, A, CL.navy);
      if (ON(p.v)) s += pl([[A.X(h), A.Y(A.y0)], [A.X(h), A.Y(A.y1)]], STK(CL.gray, 1.2, 1)) + ptLab(A, h, k, `(${fmt(h)}, ${fmt(k)})`, CL.red, 8, a > 0 ? 18 : -8);
      if (ON(p.r) && -k / a >= 0) { const d = Math.sqrt(-k / a); [h - d, h + d].forEach(x => s += ptLab(A, x, 0, fmt(x), CL.green, 4, -8)); }
      return svgW(A.w, A.h, s); } },
  explog: { name: 'ฟังก์ชันเอกซ์โพเนนเชียลและลอการิทึม', p: [['b', 'ฐาน a', '2'], ['show', 'แสดง', 'both', ['both:y = aˣ และ y = logₐx', 'exp:y = aˣ', 'log:y = logₐx']], yn('id', 'เส้น y = x (สมมาตร)'), ...AXP('-4', '6', '-4', '6')],
    gen: p => { const A = ax0(p); let s = A.s; const b = +p.b || 2; if (ON(p.id)) s += curve(x => x, A, CL.gray, 1.2, 1);
      if (p.show !== 'log') { s += curve(x => b ** x, A, CL.navy); s += ptLab(A, 0, 1, '(0, 1)', CL.navy, 8, -6); }
      if (p.show !== 'exp') { s += curve(x => x > 0 ? Math.log(x) / Math.log(b) : NaN, A, CL.red); s += ptLab(A, 1, 0, '(1, 0)', CL.red, 6, 16); }
      return svgW(A.w, A.h, s); } },
  piece: { name: 'ฟังก์ชันเป็นช่วง', p: [['f', 'ช่วง: นิพจน์ ถ้า a<x<b คั่นด้วย ; เช่น x+2 ถ้า -4<x<0; x^2 ถ้า 0<=x<2; 4 ถ้า 2<=x<5', 'x+2 ถ้า -4<x<0; x^2 ถ้า 0<=x<2; 4 ถ้า 2<=x<5'], ...AXP('-5', '6', '-3', '6')],
    gen: p => { const A = ax0(p); let s = A.s;
      p.f.split(';').map(t => t.trim()).filter(Boolean).forEach((t, i) => { const m = /^(.*?)\s*(?:ถ้า|if|,)\s*([-\d.]+)\s*(<=|<)\s*x\s*(<=|<)\s*([-\d.]+)/.exec(t); if (!m) return; try { const f = evalFunc(m[1]); const a = +m[2], b = +m[5]; const c = GCOL[i % 5]; let d = ''; const n = 120; for (let j = 0; j <= n; j++) { const x = a + (b - a) * j / n; const y = f(x); if (isFinite(y)) d += (d ? 'L' : 'M') + A.X(x).toFixed(1) + ' ' + A.Y(y).toFixed(1); } s += `<path d="${d}" ${STK(c, 2.2)} clip-path="url(#${A.cid})"/>`;
        const end = (x, closed) => { const y = f(x); if (isFinite(y)) s += `<circle cx="${A.X(x)}" cy="${A.Y(y)}" r="4" fill="${closed ? c : '#fff'}" stroke="${c}" stroke-width="1.8"/>`; }; end(a, m[3] === '<='); end(b, m[4] === '<='); } catch (e) { } });
      return svgW(A.w, A.h, s); } },
  /* ---------- ตรีโกณมิติ ---------- */
  ucircle: { name: 'วงกลมหนึ่งหน่วย', p: [['t', 'มุม θ (องศา)', '60'], yn('pr', 'เส้นฉาย cos θ, sin θ'), yn('pt', 'พิกัดจุด'), yn('sp', 'มุมพิเศษ 30°, 45°, 60° ...', 'no')],
    gen: p => { const A = axes({ x0: -1.35, x1: 1.35, y0: -1.25, y1: 1.25, W: 360, H: 340, xt: [[-1, '−1'], [1, '1']], yt: [[-1, '−1'], [1, '1']] }); let s = A.s; const R = A.X(1) - A.X(0);
      s += `<circle cx="${A.X(0)}" cy="${A.Y(0)}" r="${R}" ${STK(CL.dark, 1.6)}/>`;
      if (ON(p.sp)) [30, 45, 60, 120, 135, 150, 210, 225, 240, 300, 315, 330].forEach(d => { const r = d * Math.PI / 180; s += dot([A.X(Math.cos(r)), A.Y(Math.sin(r))], CL.gray, 2.3); s += T(A.X(1.17 * Math.cos(r)), A.Y(1.17 * Math.sin(r)) + 4, d + '°', { fs: 10.5, c: CL.gray, r: 1 }); });
      const t = (+p.t || 0) * Math.PI / 180, c = Math.cos(t), sn = Math.sin(t); const P = [A.X(c), A.Y(sn)];
      s += pl([[A.X(0), A.Y(0)], P], STK(CL.navy, 2)) + arcMark([A.X(0), A.Y(0)], [A.X(1), A.Y(0)], P, 26, CL.orange, 'θ');
      if (ON(p.pr)) s += pl([P, [P[0], A.Y(0)]], STK(CL.red, 1.6, 1)) + pl([P, [A.X(0), P[1]]], STK(CL.green, 1.6, 1)) + svgMath(P[0], A.Y(0) + (sn >= 0 ? 16 : -6), 'cos θ', { fs: 12, c: CL.red }) + svgMath(A.X(0) + (c >= 0 ? -6 : 6), P[1] + 4, 'sin θ', { fs: 12, c: CL.green, a: c >= 0 ? 'end' : 'start' });
      s += dot(P, CL.navy, 4) + (ON(p.pt) ? svgMath(P[0] + (c >= 0 ? 8 : -8), P[1] - 8, 'P(cos θ, sin θ)', { fs: 13, c: CL.navy, a: c >= 0 ? 'start' : 'end' }) : '');
      return svgW(A.w + 40, A.h, s); } },
  trigg: { name: 'กราฟฟังก์ชันตรีโกณมิติ', p: [['f', 'ฟังก์ชัน (x เป็นเรเดียน) คั่นด้วย ;', 'sin(x); cos(x)'], ['lb', 'ชื่อกราฟ (คั่นด้วย ;)', 'y = sin x; y = cos x'], ['n', 'ช่วงแกน x: 0 ถึง nπ (หรือ -nπ ถึง nπ)', '2'], ['sym', 'ช่วง', 'pos', ['pos:0 ถึง nπ', 'both:−nπ ถึง nπ']], ['a', 'ค่า y มากสุด', '1.5'], yn('grid', 'เส้นตาราง')],
    gen: p => { const n = +p.n || 2, x0 = p.sym === 'both' ? -n * Math.PI : 0, x1 = n * Math.PI, a = +p.a || 1.5;
      const xt = []; for (let k = Math.ceil(x0 / (Math.PI / 2)); k * Math.PI / 2 <= x1 + 1e-9; k++) xt.push([k * Math.PI / 2, piLab(k * Math.PI / 2)]);
      const A = axes({ x0, x1, y0: -a, y1: a, W: 520, H: 260, grid: ON(p.grid), xt, yt: ticks(-Math.floor(a), Math.floor(a), 1) }); let s = A.s;
      const F = p.f.split(';').map(x => x.trim()).filter(Boolean), L = (p.lb || '').split(';').map(x => x.trim());
      F.forEach((f, i) => { try { const fx = evalFunc(f); s += curve(fx, A, GCOL[i % 5]); if (L[i]) s += svgMath(A.X(x1) - 4, 16 + i * 17, L[i], { fs: 13.5, a: 'end', c: GCOL[i % 5] }); } catch (e) { } });
      return svgW(A.w, A.h, s); } },
  /* ---------- จำนวนเชิงซ้อน ---------- */
  argand: { name: 'ระนาบเชิงซ้อน (แผนภาพอาร์กองด์)', p: [['z', 'จำนวนเชิงซ้อน ชื่อ=a+bi คั่นด้วย ; เช่น z=3+2i; w=-1+i', 'z=3+2i'], yn('mod', 'ขนาด |z| และอาร์กิวเมนต์ θ'), yn('cj', 'สังยุค z̄', 'no'), ...AXP('-4', '5', '-4', '4')],
    gen: p => { const A = axes({ x0: +p.x0, x1: +p.x1, y0: +p.y0, y1: +p.y1, grid: ON(p.grid), xt: ticks(+p.x0, +p.x1, p.st), yt: ticks(+p.y0, +p.y1, p.st), xl: 'Re', yl: 'Im' }); let s = A.s;
      p.z.split(';').map(t => t.trim()).filter(Boolean).forEach((t, i) => { const m = /^(?:([^=]+)=)?\s*([-+]?[\d.]*)\s*(?:([-+])\s*([\d.]*)\s*i)?\s*$/.exec(t.replace(/\s/g, '')); if (!m) return; const a = +(m[2] || 0), b = m[3] ? (m[3] === '-' ? -1 : 1) * (m[4] === '' ? 1 : +m[4]) : 0; const n = (m[1] || '').trim(); const c = GCOL[i % 5]; const P = [A.X(a), A.Y(b)], O = [A.X(0), A.Y(0)];
        if (ON(p.mod)) { s += pl([O, P], STK(c, 2)) + pl([P, [P[0], O[1]]], STK(CL.gray, 1.1, 1)) + arcMark(O, [A.X(1), O[1]], P, 22, CL.orange, 'θ') + svgMath((O[0] + P[0]) / 2 - 8, (O[1] + P[1]) / 2 - 6, '|' + (n || 'z') + '|', { fs: 13, c, a: 'end' }); }
        s += dot(P, c, 4) + svgMath(P[0] + 7, P[1] - 7, `${n ? n + ' = ' : ''}${fmt(a)}${b >= 0 ? ' + ' : ' − '}${fmt(Math.abs(b))}i`, { fs: 13, c, a: 'start' });
        if (ON(p.cj)) { const Q = [A.X(a), A.Y(-b)]; s += dot(Q, c, 3.5) + pl([P, Q], STK(CL.gray, 1, 1)) + svgMath(Q[0] + 7, Q[1] + 14, (n || 'z') + '̄', { fs: 13, c, a: 'start' }); } });
      return svgW(A.w, A.h, s); } },
  /* ---------- ลำดับและอนุกรม ---------- */
  seq: { name: 'กราฟของลำดับ', p: [['f', 'พจน์ทั่วไป aₙ (ใช้ x แทน n) เช่น 1/x หรือ 2^x', '(x+1)/x'], ['N', 'จำนวนพจน์', '12'], ['L', 'เส้นลิมิต y = (เว้นว่างได้)', '1'], yn('st', 'เส้นประลงแกน', 'yes'), ['y0', 'y น้อยสุด', '0'], ['y1', 'y มากสุด', '2.5'], ['ys', 'ระยะห่างแกน y', '0.5']],
    gen: p => { const N = Math.max(2, Math.min(40, +p.N || 12)); const A = axes({ x0: 0, x1: N + 1, y0: +p.y0, y1: +p.y1, xt: ticks(1, N, N > 20 ? 5 : N > 12 ? 2 : 1), yt: ticks(+p.y0, +p.y1, p.ys), xl: 'n', yl: 'aₙ' }); let s = A.s;
      if (p.L !== '') s += pl([[A.X(0), A.Y(+p.L)], [A.X(N + 1), A.Y(+p.L)]], STK(CL.red, 1.3, 1)) + svgMath(A.X(N + 1) - 2, A.Y(+p.L) - 6, 'y = ' + p.L, { fs: 12.5, c: CL.red, a: 'end' });
      try { const f = evalFunc(p.f); for (let n = 1; n <= N; n++) { const y = f(n); if (!isFinite(y)) continue; if (ON(p.st)) s += pl([[A.X(n), A.Y(Math.max(+p.y0, 0))], [A.X(n), A.Y(y)]], STK(CL.gray, 1, 1)); s += dot([A.X(n), A.Y(y)], CL.navy, 3.6); } } catch (e) { }
      return svgW(A.w, A.h, s); } },
  /* ---------- แคลคูลัส ---------- */
  sketch: { name: 'การเขียนกราฟเส้นโค้ง (จุดวิกฤต จุดเปลี่ยนเว้า)', p: [['f', 'f(x)', 'x^3-3x'], yn('ex', 'จุดสูงสุด/ต่ำสุดสัมพัทธ์'), yn('inf', 'จุดเปลี่ยนเว้า'), yn('rt', 'จุดตัดแกน x', 'no'), yn('hz', 'เส้นสัมผัสแนวนอนที่จุดวิกฤต', 'no'), ...AXP('-3', '3', '-4', '4')],
    gen: p => { const A = ax0(p); let s = A.s; let f; try { f = evalFunc(p.f); } catch (e) { return svgW(A.w, A.h, s); } s += curve(f, A, CL.navy);
      const n = 800, xs = Array.from({ length: n + 1 }, (_, i) => A.x0 + (A.x1 - A.x0) * i / n); const find = g => { const r = []; for (let i = 0; i < n; i++) { const a = g(xs[i]), b = g(xs[i + 1]); if (isFinite(a) && isFinite(b) && (a * b < 0 || (Math.abs(a) < 1e-9 && i > 0 && g(xs[i - 1]) * b < 0))) { let lo = xs[i], hi = xs[i + 1]; for (let k = 0; k < 40; k++) { const m = (lo + hi) / 2; if (g(lo) * g(m) <= 0) hi = m; else lo = m; } r.push((lo + hi) / 2); } } return r; };
      if (ON(p.ex)) find(x => dfn(f, x)).forEach(x => { const y = f(x); const mx = dfn(f, x - .01) > 0; if (ON(p.hz)) s += pl([[A.X(x - .6), A.Y(y)], [A.X(x + .6), A.Y(y)]], STK(CL.orange, 1.4, 1)); s += ptLab(A, x, y, `${mx ? 'สูงสุด' : 'ต่ำสุด'} (${fmt(x)}, ${fmt(y)})`, CL.red, 8, mx ? -10 : 18).replace('font-family="KaTeX_Main"', 'font-family="THS"'); });
      if (ON(p.inf)) find(x => dfn(y => dfn(f, y), x, 1e-3)).forEach(x => { const y = f(x); s += `<circle cx="${A.X(x)}" cy="${A.Y(y)}" r="4" fill="#fff" stroke="${CL.green}" stroke-width="2"/>` + T(A.X(x) + 8, A.Y(y) + 16, `จุดเปลี่ยนเว้า (${fmt(x)}, ${fmt(y)})`, { fs: 12, c: CL.green, a: 'start' }); });
      if (ON(p.rt)) find(f).forEach(x => s += ptLab(A, x, 0, fmt(x), CL.teal, 4, -8));
      return svgW(A.w, A.h, s); } },
  tangent: { name: 'ความชันของเส้นโค้ง (เส้นตัด → เส้นสัมผัส)', p: [['f', 'f(x)', 'x^2'], ['a', 'จุดสัมผัส x = a', '1'], ['h', 'ระยะ h ของเส้นตัด (0 = ไม่แสดง)', '1.5'], yn('m', 'แสดงค่าความชัน'), ...AXP('-1', '4', '-1', '7')],
    gen: p => { const A = ax0(p); let s = A.s; let f; try { f = evalFunc(p.f); } catch (e) { return svgW(A.w, A.h, s); } const a = +p.a, h = +p.h, fa = f(a), m = dfn(f, a); s += curve(f, A, CL.navy);
      s += curve(x => fa + m * (x - a), A, CL.red, 1.8); if (ON(p.m)) s += T(A.X(a) + 12, A.Y(fa) + 24, `ความชัน = ${fmt(m)}`, { fs: 13, c: CL.red, a: 'start' });
      if (h) { const b = a + h, fb = f(b), ms = (fb - fa) / h; s += curve(x => fa + ms * (x - a), A, CL.green, 1.6, 1) + ptLab(A, b, fb, 'Q', CL.green, 8, -6) + pl([[A.X(a), A.Y(fa)], [A.X(b), A.Y(fa)], [A.X(b), A.Y(fb)]], STK(CL.gray, 1.1, 1)) + svgMath((A.X(a) + A.X(b)) / 2, A.Y(fa) + 15, 'h', { fs: 13, c: CL.gray }); }
      s += ptLab(A, a, fa, 'P', CL.red, -14, -6);
      return svgW(A.w, A.h, s); } },
  rate: { name: 'อัตราการเปลี่ยนแปลงเฉลี่ย (Δy/Δx)', p: [['f', 'f(x)', '0.5x^2+1'], ['a', 'x₁', '1'], ['b', 'x₂', '3'], yn('d', 'แสดง Δx, Δy'), ...AXP('-1', '5', '-1', '8')],
    gen: p => { const A = ax0(p); let s = A.s; let f; try { f = evalFunc(p.f); } catch (e) { return svgW(A.w, A.h, s); } const a = +p.a, b = +p.b, fa = f(a), fb = f(b); s += curve(f, A, CL.navy) + curve(x => fa + (fb - fa) / (b - a) * (x - a), A, CL.orange, 1.6, 1);
      if (ON(p.d)) s += pl([[A.X(a), A.Y(fa)], [A.X(b), A.Y(fa)], [A.X(b), A.Y(fb)]], STK(CL.teal, 1.6)) + svgMath((A.X(a) + A.X(b)) / 2, A.Y(fa) + 16, 'Δx = ' + fmt(b - a), { fs: 12.5, c: CL.teal }) + svgMath(A.X(b) + 6, (A.Y(fa) + A.Y(fb)) / 2 + 4, 'Δy = ' + fmt(fb - fa), { fs: 12.5, c: CL.teal, a: 'start' });
      s += ptLab(A, a, fa, `(${fmt(a)}, ${fmt(fa)})`, CL.red, -8, -8).replace(/text-anchor="start"/, 'text-anchor="end"') + ptLab(A, b, fb, `(${fmt(b)}, ${fmt(fb)})`, CL.red, -8, -8).replace(/text-anchor="start"/, 'text-anchor="end"');
      return svgW(A.w, A.h, s); } },
  riemann: { name: 'ผลบวกรีมันน์ (สี่เหลี่ยมใต้กราฟ)', p: [['f', 'f(x)', 'x^2/2+1'], ['a', 'a', '0'], ['b', 'b', '4'], ['n', 'จำนวนช่วงย่อย n', '6'], ['m', 'วิธี', 'right', ['left:จุดปลายซ้าย', 'right:จุดปลายขวา', 'mid:จุดกึ่งกลาง', 'trap:สี่เหลี่ยมคางหมู', 'upper:ผลบวกบน', 'lower:ผลบวกล่าง']], yn('v', 'แสดงค่าผลบวกโดยประมาณ'), ...AXP('-0.5', '4.5', '-0.5', '10')],
    gen: p => { const A = ax0(p); let s = A.s; let f; try { f = evalFunc(p.f); } catch (e) { return svgW(A.w, A.h, s); } const a = +p.a, b = +p.b, n = Math.max(1, Math.min(60, +p.n || 6)), dx = (b - a) / n; let sum = 0;
      for (let i = 0; i < n; i++) { const l = a + i * dx, r = l + dx; let pts, ar;
        if (p.m === 'trap') { pts = [[A.X(l), A.Y(0)], [A.X(l), A.Y(f(l))], [A.X(r), A.Y(f(r))], [A.X(r), A.Y(0)]]; ar = (f(l) + f(r)) / 2 * dx; }
        else { let h; if (p.m === 'left') h = f(l); else if (p.m === 'right') h = f(r); else if (p.m === 'mid') h = f(l + dx / 2); else { let mx = -Infinity, mn = Infinity; for (let k = 0; k <= 20; k++) { const v = f(l + dx * k / 20); mx = Math.max(mx, v); mn = Math.min(mn, v); } h = p.m === 'upper' ? mx : mn; } pts = [[A.X(l), A.Y(0)], [A.X(l), A.Y(h)], [A.X(r), A.Y(h)], [A.X(r), A.Y(0)]]; ar = h * dx; }
        sum += ar; s += pg(pts, `fill="#f6d3bd" stroke="${CL.orange}" stroke-width="1.2"`); }
      s += curve(f, A, CL.navy) + svgMath(A.X(a), A.Y(0) + 30, 'a', { fs: 13, c: CL.red }) + svgMath(A.X(b), A.Y(0) + 30, 'b', { fs: 13, c: CL.red });
      if (ON(p.v)) s += T(A.w - 24, 18, `ผลบวกโดยประมาณ ≈ ${fmt(sum)}  (n = ${n})`, { fs: 13, a: 'end', c: CL.brown });
      return svgW(A.w, A.h, s); } },
  integ: { name: 'ปริพันธ์จำกัดเขต (พื้นที่ใต้กราฟ / ระหว่างกราฟ)', p: [['f', 'f(x)', '4-x^2'], ['g', 'g(x) (เว้นว่าง = แกน x)', ''], ['a', 'a', '-2'], ['b', 'b', '2'], ['lb', 'ป้ายพื้นที่', 'A'], yn('ab', 'ป้าย a, b ใต้แกน'), ...AXP('-3', '3', '-1', '5')],
    gen: p => { const A = ax0(p); let s = A.s; let f, g; try { f = evalFunc(p.f); g = p.g.trim() ? evalFunc(p.g) : (() => 0); } catch (e) { return svgW(A.w, A.h, s); } const a = +p.a, b = +p.b, n = 160;
      const top = [], bot = []; for (let i = 0; i <= n; i++) { const x = a + (b - a) * i / n; top.push([A.X(x), A.Y(f(x))]); bot.push([A.X(x), A.Y(g(x))]); }
      s += shade(top.concat(bot.reverse()), '#f6d3bd', .85).replace('<path ', `<path clip-path="url(#${A.cid})" `) + curve(f, A, CL.navy); if (p.g.trim()) s += curve(g, A, CL.red);
      s += pl([[A.X(a), A.Y(f(a))], [A.X(a), A.Y(g(a))]], STK(CL.orange, 1.2, 1)) + pl([[A.X(b), A.Y(f(b))], [A.X(b), A.Y(g(b))]], STK(CL.orange, 1.2, 1));
      if (ON(p.ab)) s += svgMath(A.X(a), A.Y(0) + 30, 'a', { fs: 13, c: CL.red }) + svgMath(A.X(b), A.Y(0) + 30, 'b', { fs: 13, c: CL.red });
      if (p.lb) { const xm = (a + b) / 2; s += svgMath(A.X(xm), A.Y((f(xm) + g(xm)) / 2) + 5, p.lb, { fs: 17, c: CL.brown }); }
      return svgW(A.w, A.h, s); } },
  /* ---------- สถิติ ---------- */
  hist: { name: 'ฮิสโทแกรม / รูปหลายเหลี่ยมความถี่', p: [['c', 'ขอบชั้น คั่นด้วย , เช่น 0,10,20,30,40,50', '0,10,20,30,40,50'], ['f', 'ความถี่แต่ละชั้น', '3,7,12,6,2'], ['xl', 'ชื่อแกนนอน', 'คะแนน'], yn('poly', 'รูปหลายเหลี่ยมความถี่', 'no'), yn('val', 'ตัวเลขความถี่บนแท่ง')],
    gen: p => { const C = list(p.c).map(Number), F = list(p.f).map(Number); if (C.length < 2) return svgW(100, 40, ''); const mx = Math.max(...F, 1); const st = mx > 20 ? 5 : mx > 10 ? 2 : 1;
      const A = axes({ x0: C[0] - (C[1] - C[0]) * .3, x1: C[C.length - 1] + (C[1] - C[0]) * .5, y0: 0, y1: Math.ceil(mx / st) * st + st, W: 480, H: 300, xt: C.map(v => [v, fmt(v)]), yt: ticks(0, Math.ceil(mx / st) * st + st, st), xl: ' ', yl: 'f', grid: false }); let s = A.s;
      F.forEach((f, i) => { if (i + 1 >= C.length) return; s += pg([[A.X(C[i]), A.Y(0)], [A.X(C[i]), A.Y(f)], [A.X(C[i + 1]), A.Y(f)], [A.X(C[i + 1]), A.Y(0)]], `fill="#dbe4f1" stroke="${CL.navy}" stroke-width="1.3"`); if (ON(p.val)) s += T((A.X(C[i]) + A.X(C[i + 1])) / 2, A.Y(f) - 5, f, { fs: 12.5, r: 1 }); });
      if (ON(p.poly)) { const w = C[1] - C[0]; const pts = [[C[0] - w / 2, 0], ...F.map((f, i) => [(C[i] + C[i + 1]) / 2, f]), [C[F.length] + w / 2, 0]]; s += pl(pts.map(([x, y]) => [A.X(x), A.Y(y)]), STK(CL.red, 1.8)) + pts.map(([x, y]) => dot([A.X(x), A.Y(y)], CL.red, 3)).join(''); }
      s += T(A.X((C[0] + C[C.length - 1]) / 2), A.h - 2, p.xl, { fs: 13, c: CL.brown });
      return svgW(A.w, A.h + 8, s); } },
  boxp: { name: 'แผนภาพกล่อง', p: [['d1', 'ชุดที่ 1: ต่ำสุด, Q1, Q2, Q3, สูงสุด', '12,20,26,31,45'], ['n1', 'ชื่อชุดที่ 1', ''], ['d2', 'ชุดที่ 2 (เว้นว่างได้)', ''], ['n2', 'ชื่อชุดที่ 2', ''], ['x0', 'สเกลเริ่ม', '10'], ['x1', 'สเกลสิ้นสุด', '50'], ['st', 'ระยะห่างสเกล', '5']],
    gen: p => { const sets = [[p.d1, p.n1], [p.d2, p.n2]].filter(([d]) => list(d).length === 5); const H = 90 + sets.length * 70; const A = axes({ x0: +p.x0, x1: +p.x1, y0: 0, y1: sets.length + .6, W: 500, H, xt: ticks(+p.x0, +p.x1, p.st), yt: [], noY: true, xl: ' ' }); let s = A.s;
      sets.forEach(([d, n], i) => { const [mn, q1, q2, q3, mx] = list(d).map(Number); const y = sets.length - i, yy = A.Y(y), hh = 20; const c = GCOL[i % 5];
        s += pl([[A.X(mn), yy], [A.X(q1), yy]], STK(c, 1.6)) + pl([[A.X(q3), yy], [A.X(mx), yy]], STK(c, 1.6)) + pl([[A.X(mn), yy - 9], [A.X(mn), yy + 9]], STK(c, 1.6)) + pl([[A.X(mx), yy - 9], [A.X(mx), yy + 9]], STK(c, 1.6));
        s += `<rect x="${A.X(q1)}" y="${yy - hh}" width="${A.X(q3) - A.X(q1)}" height="${hh * 2}" fill="#dbe4f1" stroke="${c}" stroke-width="1.6"/>` + pl([[A.X(q2), yy - hh], [A.X(q2), yy + hh]], STK(c, 2));
        [mn, q1, q2, q3, mx].forEach((v, j) => s += T(A.X(v), yy - hh - 6, fmt(v), { fs: 11.5, r: 1, c: CL.gray }));
        if (n) s += T(A.X(A.x0) + 2, yy + 4, n, { fs: 13, a: 'start', c }); });
      return svgW(A.w, A.h, s); } },
  normal: { name: 'โค้งปกติ (พื้นที่ใต้โค้ง)', p: [['z1', 'z₁ (เว้นว่าง = −∞)', '-1'], ['z2', 'z₂ (เว้นว่าง = ∞)', '1'], yn('lb', 'ป้ายค่า z'), ['ar', 'ข้อความพื้นที่ (เว้นว่างได้)', '0.6826']],
    gen: p => { const A = axes({ x0: -3.6, x1: 3.6, y0: 0, y1: 0.45, W: 500, H: 240, xt: [-3, -2, -1, 0, 1, 2, 3].map(v => [v, fmt(v)]), yt: [], noY: true, xl: 'z' }); let s = A.s; const phi = x => Math.exp(-x * x / 2) / Math.sqrt(2 * Math.PI);
      const a = p.z1 === '' ? -3.6 : +p.z1, b = p.z2 === '' ? 3.6 : +p.z2; const top = []; for (let i = 0; i <= 120; i++) { const x = a + (b - a) * i / 120; top.push([A.X(x), A.Y(phi(x))]); }
      s += shade(top.concat([[A.X(b), A.Y(0)], [A.X(a), A.Y(0)]]), '#f6d3bd', .9) + curve(phi, A, CL.navy) + pl([[A.X(0), A.Y(0)], [A.X(0), A.Y(phi(0))]], STK(CL.gray, 1, 1));
      if (ON(p.lb)) { if (p.z1 !== '') s += svgMath(A.X(a), A.Y(0) + 30, 'z₁', { fs: 13, c: CL.red }); if (p.z2 !== '') s += svgMath(A.X(b), A.Y(0) + 30, 'z₂', { fs: 13, c: CL.red }); }
      if (p.ar) s += T(A.X((Math.max(a, -3) + Math.min(b, 3)) / 2), A.Y(phi((a + b) / 2) / 2.6), p.ar, { fs: 14, b: 1, c: CL.brown, r: 1 });
      return svgW(A.w, A.h + 10, s); } },
  scatter: { name: 'แผนภาพการกระจาย + เส้นถดถอย', p: [['pts', 'จุด x,y คั่นด้วย ;', '1,2; 2,3; 3,5; 4,4; 5,6; 6,8'], yn('reg', 'เส้นถดถอยเชิงเส้น (กำลังสองน้อยสุด)'), yn('eq', 'สมการเส้นถดถอย'), ...AXP('0', '7', '0', '9')],
    gen: p => { const A = ax0(p); let s = A.s; const P = p.pts.split(';').map(t => t.split(',').map(Number)).filter(q => q.length === 2 && q.every(isFinite));
      if (ON(p.reg) && P.length > 1) { const n = P.length, sx = P.reduce((a, q) => a + q[0], 0), sy = P.reduce((a, q) => a + q[1], 0), sxx = P.reduce((a, q) => a + q[0] * q[0], 0), sxy = P.reduce((a, q) => a + q[0] * q[1], 0); const b = (n * sxy - sx * sy) / (n * sxx - sx * sx), a = (sy - b * sx) / n; s += curve(x => a + b * x, A, CL.red, 1.8); if (ON(p.eq)) s += svgMath(A.X(A.x1) - 6, 20, `ŷ = ${fmt(a)} ${b < 0 ? '−' : '+'} ${fmt(Math.abs(b))}x`, { fs: 13.5, c: CL.red, a: 'end' }); }
      P.forEach(([x, y]) => s += dot([A.X(x), A.Y(y)], CL.navy, 4));
      return svgW(A.w, A.h, s); } },
});
/* หมวดหมู่ตามบทเรียน */
LIBCAT.length = 0;
LIBCAT.push(
  ['เซต', ['venn2', 'venn3']],
  ['จำนวนจริง (เส้นจำนวน ช่วง)', ['numline']],
  ['ฟังก์ชัน', ['fgraph', 'parab', 'piece', 'explog']],
  ['ตรีโกณมิติ', ['ucircle', 'trigg', 'tri']],
  ['เรขาคณิตวิเคราะห์ ภาคตัดกรวย', ['aline', 'conic']],
  ['เวกเตอร์', ['vec2', 'vec3']],
  ['จำนวนเชิงซ้อน', ['argand']],
  ['ลำดับและอนุกรม', ['seq']],
  ['แคลคูลัส', ['sketch', 'tangent', 'rate', 'riemann', 'integ']],
  ['การนับ ความน่าจะเป็น', ['slots', 'seats', 'round', 'tree', 'dice', 'grid', 'stars', 'balls', 'people']],
  ['สถิติ', ['hist', 'boxp', 'normal', 'scatter']],
  ['เรขาคณิต 2 มิติ', ['tri', 'quad', 'circ', 'poly', 'paral']],
  ['เรขาคณิต 3 มิติ', ['solid']],
  ['วาดเอง (อิสระ)', ['FREE']],
);

/* ===================== คลังรูปเพิ่มเติม: พื้นที่หลายส่วน · ระนาบรวม · 3 มิติตัดระนาบ · เวกเตอร์ครอส · การนับ · ความน่าจะเป็น ===================== */
const SUBN = n => String(n).split('').map(d => '₀₁₂₃₄₅₆₇₈₉'[+d] || d).join('');
const AREA_COL = ['#f6c9a8', '#bcd3ea', '#c9e3c4', '#f0c9e0', '#f1e3a6', '#d6ccef'];
function numInt(f, a, b, n = 400) { const h = (b - a) / n; let s = f(a) + f(b); for (let i = 1; i < n; i++) s += (i % 2 ? 4 : 2) * f(a + i * h); return s * h / 3; }
function roots(g, a, b, n = 1200) { const r = []; let pa = g(a); for (let i = 1; i <= n; i++) { const x = a + (b - a) * i / n, v = g(x); if (isFinite(pa) && isFinite(v) && pa * v < 0) { let lo = x - (b - a) / n, hi = x; for (let k = 0; k < 50; k++) { const m = (lo + hi) / 2; if (g(lo) * g(m) <= 0) hi = m; else lo = m; } r.push((lo + hi) / 2); } else if (v === 0 && i < n) r.push(x); pa = v; } return r; }
/* ระบบพิกัด 3 มิติแบบเฉียง: x ไปทางขวา y ลึกเข้าไป z ขึ้นบน */
function obl(ox, oy, u, ang = 35, k = .55) { const c = Math.cos(ang * Math.PI / 180) * k, s = Math.sin(ang * Math.PI / 180) * k; return (x, y, z) => [ox + (x + y * c) * u, oy - (z + y * s) * u]; }
const poly3 = (P, pts, o) => pg(pts.map(q => P(...q)), o);

Object.assign(LIB, {
  /* ---------- พื้นที่หลายส่วน ---------- */
  areas: { name: 'พื้นที่ระหว่างเส้นโค้ง แบ่งเป็นหลายส่วน (A₁, A₂, …)', p: [['f', 'f(x)', 'x^3-4x'], ['g', 'g(x) (เว้นว่าง = แกน x)', ''], ['a', 'a', '-2'], ['b', 'b', '2'], ['cut', 'จุดแบ่งเพิ่มเติม (คั่นด้วย ,) เว้นว่าง = หาจุดตัดเอง', ''], yn('val', 'ค่าพื้นที่แต่ละส่วน', 'no'), yn('xl', 'ป้ายจุดแบ่งบนแกน x'), ...AXP('-3', '3', '-4', '4')],
    gen: p => { const A = ax0(p); let s = A.s; let f, g; try { f = evalFunc(p.f); g = p.g.trim() ? evalFunc(p.g) : (() => 0); } catch (e) { return svgW(A.w, A.h, s); }
      const a = +p.a, b = +p.b; let cuts = list(p.cut).map(Number).filter(x => x > a && x < b); if (!cuts.length) cuts = roots(x => f(x) - g(x), a, b).filter(x => x > a + 1e-6 && x < b - 1e-6);
      const pts = [a, ...cuts.sort((x, y) => x - y), b]; let lbl = '';
      for (let i = 0; i < pts.length - 1; i++) { const l = pts[i], r = pts[i + 1], n = 80, top = [], bot = []; for (let j = 0; j <= n; j++) { const x = l + (r - l) * j / n; top.push([A.X(x), A.Y(f(x))]); bot.push([A.X(x), A.Y(g(x))]); }
        s += shade(top.concat(bot.reverse()), AREA_COL[i % AREA_COL.length], .9).replace('<path ', `<path clip-path="url(#${A.cid})" `); const xm = (l + r) / 2; const ar = Math.abs(numInt(x => f(x) - g(x), l, r));
        lbl += svgMath(A.X(xm), A.Y((f(xm) + g(xm)) / 2) + 5, 'A' + SUBN(i + 1), { fs: 15, c: CL.dark }) + (ON(p.val) ? T(A.X(xm), A.Y((f(xm) + g(xm)) / 2) + 20, '≈ ' + fmt(ar), { fs: 11.5, r: 1, c: CL.brown }) : ''); }
      s += curve(f, A, CL.navy); if (p.g.trim()) s += curve(g, A, CL.red);
      pts.forEach(x => { s += pl([[A.X(x), A.Y(f(x))], [A.X(x), A.Y(g(x))]], STK(CL.gray, 1.1, 1)); if (ON(p.xl)) s += svgMath(A.X(x), A.Y(0) + 30, fmt(x), { fs: 12, c: CL.red }); });
      return svgW(A.w, A.h, s + lbl); } },
  /* ---------- ระนาบรวม (ซ้อนหลายอย่าง) ---------- */
  combo: { name: 'ระนาบรวม: ซ้อนกราฟ จุด เวกเตอร์ วงกลม รูปหลายเหลี่ยม พื้นที่ ข้อความ', p: [['src', 'คำสั่งบรรทัดละ 1 อย่าง (ดูตัวอย่าง)', 'f: x^2/4\nf: 4-x | red\ncircle: (0,0) 2 | dash\nellipse: (0,0) 4 2 | purple\nvec: (0,0)->(3,2) u\nseg: (-4,-2)-(4,-2)\npoly: (-3,-1),(-1,-1),(-2,1) | fill\narea: x^2/4 ; 4-x ; -5.5 ; 2.4\npt: A(2,1)\ntext: (2.5,3.5) บริเวณ R\nvline: -1\nhline: 3', 'ta'], ...AXP('-5', '5', '-3', '5')],
    gen: p => { const A = ax0(p); let s = A.s; const colOf = o => (/#[0-9a-fA-F]{6}/.exec(o) || [])[0] || ({ red: CL.red, blue: CL.navy, green: CL.green, orange: CL.orange, purple: CL.purple, teal: CL.teal, gray: CL.gray, brown: CL.brown })[(/\b(red|blue|green|orange|purple|teal|gray|brown)\b/.exec(o) || [])[1]] || null; let ci = 0;
      const P = t => { const m = /\(\s*([-\d.]+)\s*,\s*([-\d.]+)\s*\)/.exec(t); return m ? [+m[1], +m[2]] : null; }; const PP = t => [...t.matchAll(/\(\s*([-\d.]+)\s*,\s*([-\d.]+)\s*\)/g)].map(m => [+m[1], +m[2]]); const S = q => [A.X(q[0]), A.Y(q[1])];
      String(p.src).split('\n').forEach(line => { const [main, opt = ''] = line.split('|').map(x => x.trim()); const m = /^(\w+)\s*:\s*(.*)$/.exec(main); if (!m) return; const k = m[1].toLowerCase(), v = m[2]; const c = colOf(opt) || GCOL[ci % 5]; const dash = /dash/.test(opt); const fill = /fill/.test(opt);
        try {
          if (k === 'f' || k === 'y') { s += plotAny(v, A, c, 2, dash); ci++; }
          else if (k === 'pt') { const q = P(v); const n = (/^([^(]*)\(/.exec(v) || [])[1] || ''; if (q) s += dot(S(q), c, 3.8) + (n.trim() ? svgMath(S(q)[0] + 7, S(q)[1] - 7, n.trim(), { fs: 14, c, a: 'start' }) : ''); }
          else if (k === 'seg') { const [q1, q2] = PP(v); if (q2) s += pl([S(q1), S(q2)], STK(c, 1.8, dash)); }
          else if (k === 'vec') { const [q1, q2] = PP(v); if (q2) { const a2 = S(q1), b2 = S(q2), d = nrm(sub2(b2, a2)), n2 = [-d[1], d[0]], h = [b2[0] - d[0] * 10, b2[1] - d[1] * 10]; s += pl([a2, h], STK(c, 2.2)) + pg([b2, [h[0] + n2[0] * 4.5, h[1] + n2[1] * 4.5], [h[0] - n2[0] * 4.5, h[1] - n2[1] * 4.5]], `fill="${c}"`); const nm = v.split(')').pop().trim(); if (nm) { const mm = mid(a2, b2); s += vecLab(mm[0] + n2[0] * 15, mm[1] + n2[1] * 15 + 5, nm, c); } } }
          else if (k === 'circle') { const q = P(v); const r = +v.split(')').pop().trim().split(/\s+/)[0]; if (q && r) s += pcurve(t => q[0] + r * Math.cos(t), t => q[1] + r * Math.sin(t), 0, 2 * Math.PI, A, c, 2, dash); ci++; }
          else if (k === 'ellipse') { const q = P(v); const [ra, rb] = v.split(')').pop().trim().split(/\s+/).map(Number); if (q && ra && rb) s += pcurve(t => q[0] + ra * Math.cos(t), t => q[1] + rb * Math.sin(t), 0, 2 * Math.PI, A, c, 2, dash); ci++; }
          else if (k === 'poly') { const Q = PP(v); if (Q.length > 2) s += pg(Q.map(S), `fill="${fill ? c : 'none'}" fill-opacity="${fill ? .25 : 0}" ${STK(c, 1.8, dash).replace('fill="none" ', '')}`); }
          else if (k === 'area') { const [fs, gs, a, b] = v.split(';').map(x => x.trim()); const f = evalFunc(fs), g = gs ? evalFunc(gs) : (() => 0); const top = [], bot = []; for (let j = 0; j <= 100; j++) { const x = +a + (+b - +a) * j / 100; top.push([A.X(x), A.Y(f(x))]); bot.push([A.X(x), A.Y(g(x))]); } s = s.replace(/(<\/defs>)/, `$1${shade(top.concat(bot.reverse()), colOf(opt) ? c : '#f6c9a8', .75).replace('<path ', `<path clip-path="url(#${A.cid})" `)}`); }
          else if (k === 'text') { const q = P(v); if (q) s += T(S(q)[0], S(q)[1], v.split(')').slice(1).join(')').trim(), { fs: 14, c: colOf(opt) || CL.dark }); }
          else if (k === 'vline') s += pl([[A.X(+v), A.Y(A.y0)], [A.X(+v), A.Y(A.y1)]], STK(colOf(opt) || CL.gray, 1.3, true));
          else if (k === 'hline') s += pl([[A.X(A.x0), A.Y(+v)], [A.X(A.x1), A.Y(+v)]], STK(colOf(opt) || CL.gray, 1.3, true));
        } catch (e) { } });
      return svgW(A.w, A.h, s); } },
  /* ---------- 3 มิติ: ตัดด้วยระนาบ ---------- */
  cubecut: { name: 'ลูกบาศก์ตัดด้วยระนาบ (ภาคตัดใส)', p: [['cut', 'ภาคตัด', 'hex', ['h:แนวนอน (สี่เหลี่ยมจัตุรัส)', 'v:แนวตั้ง', 'diag:ผ่านขอบตรงข้าม (สี่เหลี่ยมผืนผ้า)', 'tri:ตัดมุม (สามเหลี่ยม)', 'hex:ผ่านกึ่งกลาง (หกเหลี่ยม)', 'trap:เฉียง (สี่เหลี่ยมคางหมู)']], ['t', 'ตำแหน่งระนาบ (0–1)', '0.5'], yn('pl', 'แสดงระนาบตัดใส ๆ'), ['v', 'ชื่อจุดยอด (8 ตัว เว้นว่างได้)', 'A,B,C,D,E,F,G,H'], yn('hid', 'ขอบด้านหลังเป็นเส้นประ')],
    gen: p => { const P = obl(70, 300, 200); const t = Math.max(.02, Math.min(.98, +p.t || .5)); let s = '';
      const V = [[0, 0, 0], [1, 0, 0], [1, 1, 0], [0, 1, 0], [0, 0, 1], [1, 0, 1], [1, 1, 1], [0, 1, 1]]; const E = [[0, 1], [1, 2], [2, 3], [3, 0], [4, 5], [5, 6], [6, 7], [7, 4], [0, 4], [1, 5], [2, 6], [3, 7]];
      const pl3 = { h: [[0, 0, 1], t], v: [[1, 0, 0], t], diag: [[0, 1, -1], 0], tri: [[-1, 1, -1], -2 + t * 1.4], hex: [[1, -1, 1], .5], trap: [[1, -1, -(1 - t)], 0] }[p.cut]; const [n, d] = pl3;
      const val = q => n[0] * q[0] + n[1] * q[1] + n[2] * q[2] - d; const pts = [];
      E.forEach(([i, j]) => { const a = val(V[i]), b = val(V[j]); if (Math.abs(a) < 1e-9) pts.push(V[i]); if (a * b < 0) { const u = a / (a - b); pts.push(V[i].map((c, k) => c + (V[j][k] - c) * u)); } });
      const uniq = []; pts.forEach(q => { if (!uniq.some(w => Math.hypot(w[0] - q[0], w[1] - q[1], w[2] - q[2]) < 1e-6)) uniq.push(q); });
      const C = uniq.reduce((a, q) => a.map((v, k) => v + q[k] / uniq.length), [0, 0, 0]); const e1 = nrm3(sub3(uniq[0] || [1, 0, 0], C)), e2 = cross3(n, e1); uniq.sort((a, b) => Math.atan2(dot3(sub3(a, C), e2), dot3(sub3(a, C), e1)) - Math.atan2(dot3(sub3(b, C), e2), dot3(sub3(b, C), e1)));
      const hidden = 3; // จุดยอดด้านหลังล่างซ้าย
      if (ON(p.pl) && uniq.length > 2) { const big = uniq.map(q => q.map((v, k) => C[k] + (v - C[k]) * 1.25)); s += poly3(P, big, `fill="#9fc3e6" fill-opacity=".18" stroke="#6f9ccc" stroke-width="1" stroke-dasharray="4 3"`); }
      s += poly3(P, [V[0], V[1], V[5], V[4]], `fill="${CL.cream}" fill-opacity=".35"`) + poly3(P, [V[1], V[2], V[6], V[5]], `fill="#f6e6d6" fill-opacity=".35"`) + poly3(P, [V[4], V[5], V[6], V[7]], `fill="#fbf0e4" fill-opacity=".35"`);
      if (uniq.length > 2) s += poly3(P, uniq, `fill="${CL.orange}" fill-opacity=".35" stroke="${CL.orange}" stroke-width="2"`);
      E.forEach(([i, j]) => { const hid = (i === hidden || j === hidden); s += pl([P(...V[i]), P(...V[j])], hid ? STK(CL.gray, 1.3, ON(p.hid)) : STK(CL.dark, 1.8)); });
      uniq.forEach(q => s += dot(P(...q), CL.orange, 3));
      const L = list(p.v); const off = [[-12, 14], [10, 14], [12, 6], [-12, 4], [-12, -6], [8, -8], [12, -6], [-10, -8]]; V.forEach((q, i) => { if (L[i]) { const z = P(...q); s += lab(z[0] + off[i][0], z[1] + off[i][1], L[i], { fs: 15 }); } });
      return svgW(380, 330, s); } },
  solidcut: { name: 'ทรงกลม / ทรงกระบอก / กรวย ตัดด้วยระนาบ', p: [['kind', 'ทรง', 'sph', ['sph:ทรงกลม', 'cyl:ทรงกระบอก', 'cone:กรวย']], ['h', 'ระยะระนาบจากจุดศูนย์กลาง/ฐาน (0–1)', '0.45'], yn('pl', 'แสดงระนาบตัดใส ๆ'), yn('lb', 'ป้าย R, r, d')],
    gen: p => { const cx = 190, R = 110, ry = .28; const h = Math.max(-.95, Math.min(.95, +p.h || 0)); let s = ''; const ell = (y, rx, dashBack, col, fill) => `<path d="M${cx - rx} ${y}A${rx} ${rx * ry} 0 0 0 ${cx + rx} ${y}" ${STK(col, 1.6)}/><path d="M${cx - rx} ${y}A${rx} ${rx * ry} 0 0 1 ${cx + rx} ${y}" ${STK(col, 1.3, dashBack)}/>` + (fill ? `<ellipse cx="${cx}" cy="${y}" rx="${rx}" ry="${rx * ry}" fill="${fill}" fill-opacity=".35"/>` : '');
      const planeAt = (y, w) => `<path d="M${cx - w} ${y + 22}L${cx - w + 70} ${y - 22}L${cx + w + 30} ${y - 22}L${cx + w - 40} ${y + 22}Z" fill="#9fc3e6" fill-opacity=".2" stroke="#6f9ccc" stroke-dasharray="4 3"/>`;
      if (p.kind === 'sph') { const cy = 170, y = cy - h * R, r = Math.sqrt(1 - h * h) * R;
        s += `<circle cx="${cx}" cy="${cy}" r="${R}" fill="${CL.cream}" fill-opacity=".35" ${STK(CL.dark, 1.8).replace('fill="none" ', '')}/>` + ell(cy, R, true, CL.gray);
        if (ON(p.pl)) s += planeAt(y, R + 40); s += ell(y, r, true, CL.orange, CL.orange);
        s += dot([cx, cy]) + dot([cx, y], CL.orange, 2.6); if (ON(p.lb)) s += pl([[cx, cy], [cx, y]], STK(CL.teal, 1.4, 1)) + pl([[cx, y], [cx + r, y]], STK(CL.orange, 1.6)) + pl([[cx, cy], [cx + r, y]], STK(CL.navy, 1.4)) + rightMark([cx, y], [cx, cy], [cx + r, y], 8) + svgMath(cx - 8, (cy + y) / 2 + 4, 'd', { fs: 14, c: CL.teal, a: 'end' }) + svgMath(cx + r / 2, y - 6, 'r', { fs: 14, c: CL.orange }) + svgMath(cx + r / 2 + 8, (cy + y) / 2 + 12, 'R', { fs: 14, c: CL.navy, a: 'start' }) + svgMath(cx - 6, cy + 16, 'O', { fs: 13, a: 'end' });
        return svgW(400, 300, s); }
      const top = 50, bot = 270, rb = 95, yv = bot - (h + 1) / 2 * (bot - top) * (p.kind === 'cone' ? 1 : 1); const y = Math.max(top + 10, Math.min(bot - 10, bot - Math.abs(h) * (bot - top)));
      if (p.kind === 'cyl') { s += `<path d="M${cx - rb} ${top}V${bot}A${rb} ${rb * ry} 0 0 0 ${cx + rb} ${bot}V${top}" fill="${CL.cream}" fill-opacity=".35" ${STK(CL.dark, 1.8).replace('fill="none" ', '')}/>` + `<ellipse cx="${cx}" cy="${top}" rx="${rb}" ry="${rb * ry}" ${STK(CL.dark, 1.8)}/>` + ell(bot, rb, true, CL.dark); if (ON(p.pl)) s += planeAt(y, rb + 40); s += ell(y, rb, true, CL.orange, CL.orange); if (ON(p.lb)) s += pl([[cx, y], [cx + rb, y]], STK(CL.orange, 1.6)) + svgMath(cx + rb / 2, y - 6, 'r', { fs: 14, c: CL.orange }) + pl([[cx, y], [cx, bot]], STK(CL.teal, 1.3, 1)) + svgMath(cx - 6, (y + bot) / 2, 'd', { fs: 14, c: CL.teal, a: 'end' }); return svgW(400, 310, s); }
      const r = rb * (y - top) / (bot - top); s += `<path d="M${cx - rb} ${bot}L${cx} ${top}L${cx + rb} ${bot}" fill="${CL.cream}" fill-opacity=".35" ${STK(CL.dark, 1.8).replace('fill="none" ', '')}/>` + ell(bot, rb, true, CL.dark); if (ON(p.pl)) s += planeAt(y, rb + 40); s += ell(y, r, true, CL.orange, CL.orange);
      if (ON(p.lb)) s += pl([[cx, y], [cx + r, y]], STK(CL.orange, 1.6)) + svgMath(cx + r / 2, y - 6, 'r', { fs: 14, c: CL.orange }) + pl([[cx, top], [cx, bot]], STK(CL.teal, 1.2, 1)) + pl([[cx, bot], [cx + rb, bot]], STK(CL.navy, 1.4)) + svgMath(cx + rb / 2, bot + 18, 'R', { fs: 14, c: CL.navy });
      return svgW(400, 310, s); } },
  /* ---------- เวกเตอร์: พื้นที่จากผลคูณเชิงเวกเตอร์ ---------- */
  crossar: { name: 'พื้นที่จากผลคูณเชิงเวกเตอร์ (u × v)', p: [['u', 'u = (a₁, a₂, a₃)', '3,-1,2'], ['v', 'v = (b₁, b₂, b₃)', '0,3,2'], ['sh', 'รูป', 'par', ['par:สี่เหลี่ยมด้านขนาน', 'tri:สามเหลี่ยม (ครึ่งหนึ่ง)']], yn('n', 'เวกเตอร์ u × v (ตั้งฉาก)'), yn('val', 'แสดงค่าพื้นที่', 'no')],
    gen: p => { const u = list(p.u).map(Number), v = list(p.v).map(Number); if (u.length < 3 || v.length < 3) return svgW(100, 40, ''); const w = cross3(u, v); const area = Math.hypot(...w);
      const sc = 34 * 4 / Math.max(4, ...u.map(Math.abs), ...v.map(Math.abs), ...u.map((c, i) => Math.abs(c + v[i]))); const Q = (x, y, z) => [150 + (y - .55 * x) * sc, 210 - (z - .42 * x) * sc]; // x พุ่งเข้าหาผู้ดู
      let s = ''; const axis = (q, n) => { const a = Q(0, 0, 0), b = Q(...q); return pl([a, b], STK(CL.dark, 1.2)) + T(b[0] + (b[0] - a[0]) * .06, b[1] + (b[1] - a[1]) * .06 + 4, n, { m: 1, fs: 15 }); };
      s += axis([4.6, 0, 0], 'x') + axis([0, 4.6, 0], 'y') + axis([0, 0, 4.2], 'z');
      const O = [0, 0, 0], U = u, Vv = v, UV = u.map((c, i) => c + v[i]);
      s += pg((p.sh === 'tri' ? [O, U, Vv] : [O, U, UV, Vv]).map(q => Q(...q)), `fill="${CL.orange}" fill-opacity=".3" stroke="${CL.orange}" stroke-width="1.4"`);
      if (p.sh !== 'tri') s += pl([Q(...U), Q(...UV)], STK(CL.gray, 1.2, 1)) + pl([Q(...Vv), Q(...UV)], STK(CL.gray, 1.2, 1));
      const arrow = (q, c, n) => { const a = Q(0, 0, 0), b = Q(...q), d = nrm(sub2(b, a)), n2 = [-d[1], d[0]], h = [b[0] - d[0] * 10, b[1] - d[1] * 10]; return pl([a, h], STK(c, 2.3)) + pg([b, [h[0] + n2[0] * 4.5, h[1] + n2[1] * 4.5], [h[0] - n2[0] * 4.5, h[1] - n2[1] * 4.5]], `fill="${c}"`) + svgMath(b[0] + d[0] * 14 + (d[0] < -.3 ? -4 : d[0] > .3 ? 4 : 0), b[1] + d[1] * 14 + 5, n, { fs: 15, c, a: d[0] < -.3 ? 'end' : d[0] > .3 ? 'start' : 'middle' }); };
      s += arrow(U, CL.navy, 'u') + arrow(Vv, CL.red, 'v');
      if (ON(p.n)) { const sc = 3.2 / (Math.hypot(...w) || 1); s += arrow(w.map(c => c * sc), CL.green, 'u × v'); }
      if (ON(p.val)) s += T(14, 22, `พื้นที่ = |u × v|${p.sh === 'tri' ? ' / 2' : ''} = ${fmt(p.sh === 'tri' ? area / 2 : area)}`, { fs: 13.5, a: 'start', c: CL.brown });
      return svgW(380, 320, s); } },
  /* ---------- หลักการนับ ---------- */
  pascal: { name: 'สามเหลี่ยมปาสคาล', p: [['n', 'จำนวนแถว (ถึง n)', '6'], ['form', 'แสดงเป็น', 'num', ['num:ตัวเลข', 'binom:สัญลักษณ์ C(n,r)']], ['hl', 'ระบายแถว (เลขแถว เว้นว่างได้)', '4']],
    gen: p => { const N = Math.max(1, Math.min(12, +p.n || 6)); const dx = p.form === 'binom' ? 46 : 34, dy = p.form === 'binom' ? 40 : 30, W = (N + 1) * dx + 60; let s = ''; const C = (n, r) => { let c = 1; for (let i = 1; i <= r; i++) c = c * (n - i + 1) / i; return Math.round(c); };
      for (let n = 0; n <= N; n++) { s += T(16, 30 + n * dy, 'n = ' + n, { fs: 12, c: CL.gray, a: 'start' }); for (let r = 0; r <= n; r++) { const x = W / 2 + (r - n / 2) * dx + 20, y = 26 + n * dy; const on = String(n) === String(p.hl); s += `<circle cx="${x}" cy="${y}" r="${p.form === 'binom' ? 18 : 14}" fill="${on ? '#f6d3bd' : '#fff'}" stroke="${on ? CL.orange : CL.gray}" stroke-width="1.2"/>`; s += p.form === 'binom' ? svgMath(x, y + 4.5, `C(${n},${r})`, { fs: 10.5 }) : T(x, y + 5, C(n, r), { fs: 13.5, r: 1 }); } }
      return svgW(W + 20, 30 + (N + 1) * dy, s); } },
  letters: { name: 'การเรียงสับเปลี่ยนตัวอักษร (ของซ้ำ)', p: [['w', 'คำ', 'MISSISSIPPI'], yn('cnt', 'จำนวนตัวซ้ำใต้ตัวอักษร')],
    gen: p => { const w = String(p.w || '').slice(0, 16).split(''); const kinds = [...new Set(w)]; const cols = ['#f6d3bd', '#bcd3ea', '#c9e3c4', '#f0c9e0', '#f1e3a6', '#d6ccef', '#e5e7eb']; let s = '';
      w.forEach((ch, i) => { const k = kinds.indexOf(ch); s += `<rect x="${10 + i * 38}" y="10" width="32" height="38" rx="5" fill="${cols[k % cols.length]}" stroke="${CL.brown}" stroke-width="1"/>` + T(26 + i * 38, 37, ch, { fs: 20, b: 1, f: 0, r: !/[ก-๙]/.test(ch) }); });
      if (ON(p.cnt)) s += kinds.map((ch, k) => `<rect x="${10 + k * 76}" y="62" width="14" height="14" rx="3" fill="${cols[k % cols.length]}"/>` + T(30 + k * 76, 74, `${ch} : ${w.filter(c => c === ch).length}`, { fs: 13, a: 'start', r: 1 })).join('');
      return svgW(Math.max(20 + w.length * 38, 20 + kinds.length * 76), ON(p.cnt) ? 86 : 58, s); } },
  roads: { name: 'เส้นทางระหว่างเมือง (หลักการคูณ/บวก)', p: [['t', 'ชื่อเมือง (คั่นด้วย ,)', 'A,B,C'], ['k', 'จำนวนถนนระหว่างเมืองที่ติดกัน', '3,2'], ['d', 'ถนนตรงจากเมืองแรกถึงเมืองสุดท้าย (0 = ไม่มี)', '1']],
    gen: p => { const Tn = list(p.t), K = list(p.k).map(Number), D = +p.d || 0; const gap = 170, W = 60 + (Tn.length - 1) * gap + 40, cy = 110; let s = ''; const X = i => 40 + i * gap;
      K.forEach((k, i) => { if (i + 1 >= Tn.length) return; for (let j = 0; j < k; j++) { const off = (j - (k - 1) / 2) * 26; s += `<path d="M${X(i) + 20} ${cy}Q${(X(i) + X(i + 1)) / 2} ${cy + off * 1.6} ${X(i + 1) - 20} ${cy}" ${STK(GCOL[j % 5], 1.8)}/>`; } s += T((X(i) + X(i + 1)) / 2, cy - 40 - k * 4, k + ' เส้นทาง', { fs: 12.5, c: CL.brown }); });
      if (D > 0) for (let j = 0; j < D; j++) s += `<path d="M${X(0)} ${cy + 20}Q${(X(0) + X(Tn.length - 1)) / 2} ${cy + 110 + j * 22} ${X(Tn.length - 1)} ${cy + 20}" ${STK(CL.purple, 1.8, 1)}/>`;
      Tn.forEach((n, i) => s += `<circle cx="${X(i)}" cy="${cy}" r="20" fill="${CL.cream}" stroke="${CL.brown}" stroke-width="1.8"/>` + lab(X(i), cy + 6, n, { fs: 17, b: 1 }));
      return svgW(W, D > 0 ? 250 : 190, s); } },
  menu: { name: 'เลือกของหลายกลุ่ม (เสื้อ กางเกง รองเท้า ...)', p: [['g', 'กลุ่ม:จำนวน คั่นด้วย , เช่น เสื้อ:3, กางเกง:2', 'เสื้อ:3, กางเกง:2, รองเท้า:2'], ['op', 'เครื่องหมาย', '×', ['×:× (หลักการคูณ)', '+:+ (หลักการบวก)']], yn('res', 'ผลลัพธ์ท้าย')],
    gen: p => { const G = list(p.g).map(t => { const [n, c] = t.split(':'); return [n.trim(), Math.min(8, +c || 1)]; }); const icon = (n, x, y, c) => /เสื้อ|shirt/.test(n) ? `<path d="M${x - 11} ${y - 10}l6 -4h10l6 4 4 7-5 3-2-3v15h-18v-15l-2 3-5-3z" fill="${c}" stroke="${CL.dark}" stroke-width=".8"/>` : /กางเกง/.test(n) ? `<path d="M${x - 9} ${y - 13}h18l2 26h-7l-4-17-4 17h-7z" fill="${c}" stroke="${CL.dark}" stroke-width=".8"/>` : /รองเท้า/.test(n) ? `<path d="M${x - 12} ${y + 6}v-12h7l2 5 13 3c3 1 3 4 0 4z" fill="${c}" stroke="${CL.dark}" stroke-width=".8"/>` : `<circle cx="${x}" cy="${y}" r="10" fill="${c}" stroke="${CL.dark}" stroke-width=".8"/>`;
      let s = '', x = 14; const cols = ['#d9534f', '#3567b5', '#3c9a4f', '#f2b632', '#8e4fa3', '#e07b39', '#7a7a7a', '#2b7a8c'];
      G.forEach(([n, c], i) => { const w = Math.max(90, Math.ceil(c / 2) * 34 + 20); s += `<rect x="${x}" y="24" width="${w}" height="88" rx="9" fill="#fffaf5" stroke="${CL.brown}" stroke-width="1.2"/>` + T(x + w / 2, 18, `${n} ${c} แบบ`, { fs: 13.5, c: CL.brown });
        for (let j = 0; j < c; j++) s += icon(n, x + 24 + Math.floor(j / 2) * 34, 50 + (j % 2) * 38, cols[j % 8]); x += w; if (i < G.length - 1) { s += T(x + 16, 74, p.op, { fs: 22, c: CL.gray, r: 1 }); x += 32; } });
      if (ON(p.res)) { const tot = p.op === '+' ? G.reduce((a, g) => a + g[1], 0) : G.reduce((a, g) => a * g[1], 1); s += T(x + 14, 74, `= ${tot} วิธี`, { fs: 18, b: 1, c: CL.red, a: 'start' }); x += 110; }
      return svgW(x + 10, 122, s); } },
  gaps: { name: 'วิธีช่องว่าง (เลือกไม่ติดกัน / แทรกระหว่าง)', p: [['n', 'จำนวนของที่วางก่อน', '5'], ['sym', 'สัญลักษณ์ของ', 'B'], ['sel', 'ช่องที่เลือก (คั่นด้วย ,)', '1,3,6'], ['lbl', 'ข้อความใต้รูป', 'ช่องว่าง 6 ช่อง']],
    gen: p => { const n = Math.max(1, Math.min(14, +p.n || 5)), sel = list(p.sel).map(Number); const w = 44; let s = '';
      for (let i = 0; i <= n; i++) { const x = 20 + i * w * 2; const on = sel.includes(i + 1); s += `<path d="M${x + 4} 46l${w / 2 - 4} -18l${w / 2 - 4} 18" ${STK(on ? CL.orange : CL.gray, on ? 2.4 : 1.4)}/>` + T(x + w / 2, 66, i + 1, { fs: 12, r: 1, c: on ? CL.orange : CL.gray }); if (on) s += `<circle cx="${x + w / 2}" cy="20" r="11" fill="#f6d3bd" stroke="${CL.orange}" stroke-width="1.8"/>`; if (i < n) s += `<rect x="${x + w}" y="30" width="${w - 6}" height="30" rx="6" fill="${CL.cream}" stroke="${CL.brown}" stroke-width="1.4"/>` + lab(x + w * 1.5 - 3, 51, p.sym, { fs: 16, b: 1 }); }
      if (p.lbl) s += T(20 + n * w + w / 2, 92, p.lbl, { fs: 14, c: CL.brown });
      return svgW(40 + (n + 1) * w * 2 - w, 102, s); } },
  glue: { name: 'มัดรวมกัน (จัดเรียงให้ติดกัน)', p: [['p', 'ชื่อทุกคน (คั่นด้วย ,)', 'A,B,C,D,E'], ['g', 'คนที่ต้องอยู่ติดกัน (คั่นด้วย ,)', 'A,B'], yn('ar', 'ลูกศรสลับที่ภายในกลุ่ม')],
    gen: p => { const all = list(p.p), g = list(p.g); const rest = all.filter(x => !g.includes(x)); const w = 46; let x = 16, s = ''; const person2 = (cx, n, c) => `<g transform="translate(${cx - 15} 18) scale(1.25)">${person(c)}</g>` + lab(cx, 66, n, { fs: 15 });
      s += `<rect x="${x - 6}" y="10" width="${g.length * w + 6}" height="66" rx="10" fill="#f6d3bd" fill-opacity=".6" stroke="${CL.orange}" stroke-width="2" stroke-dasharray="5 3"/>`; g.forEach((n, i) => s += person2(x + i * w + w / 2 - 3, n, CL.red));
      if (ON(p.ar) && g.length > 1) s += `<path d="M${x + w / 2} 84q${(g.length - 1) * w / 2} 18 ${(g.length - 1) * w} 0" ${STK(CL.orange, 1.4)}/><path d="M${x + w / 2 + (g.length - 1) * w} 84l-7 -2 2 6z" fill="${CL.orange}"/>` + T(x + g.length * w / 2, 108, `สลับกันเองได้ ${g.length}! แบบ`, { fs: 12.5, c: CL.orange });
      x += g.length * w + 14; rest.forEach((n, i) => s += person2(x + i * w + w / 2, n, CL.navy)); x += rest.length * w;
      s += T(x / 2 + 6, 132, `มองกลุ่มเป็น 1 หน่วย → จัด ${rest.length + 1} หน่วย`, { fs: 13.5, c: CL.brown });
      return svgW(x + 20, 142, s); } },
  pick: { name: 'เลือกคณะกรรมการ (การจัดหมู่)', p: [['n', 'จำนวนคนทั้งหมด', '8'], ['sel', 'คนที่ถูกเลือก (ลำดับ คั่นด้วย ,)', '2,5,7'], ['two', 'แบ่งสองกลุ่ม (ชาย/หญิง) จำนวนกลุ่มแรก', '5']],
    gen: p => { const n = Math.max(1, Math.min(16, +p.n || 8)), sel = list(p.sel).map(Number), g1 = +p.two || 0; const w = 46; let s = '';
      for (let i = 0; i < n; i++) { const x = 16 + i * w, on = sel.includes(i + 1); if (on) s += `<rect x="${x - 4}" y="4" width="${w - 4}" height="70" rx="9" fill="#f6d3bd" stroke="${CL.orange}" stroke-width="1.8"/>`; s += `<g transform="translate(${x + 4} 12) scale(1.3)">${person(g1 && i >= g1 ? CL.red : CL.navy)}</g>` + T(x + w / 2 - 2, 66, i + 1, { fs: 12, r: 1, c: CL.gray }); }
      s += T(16 + n * w / 2, 96, `เลือก ${sel.length} คน จาก ${n} คน`, { fs: 14, c: CL.brown });
      return svgW(30 + n * w, 106, s); } },
  boxes: { name: 'แจกของเหมือนกันลงกล่องต่างกัน', p: [['d', 'จำนวนของในแต่ละกล่อง (คั่นด้วย ,)', '2,0,3,1'], ['lb', 'ชื่อกล่อง (คั่นด้วย ,)', 'A,B,C,D']],
    gen: p => { const D = list(p.d).map(Number), L = list(p.lb); const w = 92; let s = '';
      D.forEach((k, i) => { const x = 14 + i * (w + 14); s += `<path d="M${x} 30V118H${x + w}V30" fill="${CL.cream}" stroke="${CL.brown}" stroke-width="2"/>`; for (let j = 0; j < Math.min(k, 9); j++) s += `<g transform="translate(${x + 8 + (j % 3) * 26} ${92 - Math.floor(j / 3) * 26}) scale(1.05)">${ball('#3567b5')}</g>`; s += T(x + w / 2, 138, (L[i] || '') + ' : ' + k, { fs: 14, r: !/[ก-๙]/.test(L[i] || '') }); });
      return svgW(28 + D.length * (w + 14), 148, s); } },
  envel: { name: 'จดหมายกับซองจดหมาย (จัดให้ผิดที่)', p: [['perm', 'จดหมายที่ใส่ในซอง 1, 2, 3, … (คั่นด้วย ,)', '2,3,1,4']],
    gen: p => { const P = list(p.perm).map(Number); const n = P.length, w = 70; let s = '';
      P.forEach((v, i) => { const x = 20 + i * w; const ok = v === i + 1; s += `<rect x="${x}" y="14" width="44" height="30" rx="3" fill="#fff" stroke="${CL.navy}" stroke-width="1.5"/><path d="M${x} 14l22 16 22 -16" ${STK(CL.navy, 1.2)}/>` + T(x + 22, 60, 'ซอง ' + (i + 1), { fs: 12.5 });
        const xs = 20 + (v - 1) * w + 22; s += `<rect x="${x + 6}" y="110" width="32" height="38" fill="#fffaf0" stroke="${CL.brown}" stroke-width="1.3"/>` + T(x + 22, 134, v, { fs: 15, r: 1, b: 1 }) + `<path d="M${x + 22} 108L${x + 22} 66" ${STK(ok ? CL.red : CL.green, 1.8)}/><path d="M${x + 22} 66l-4 8h8z" fill="${ok ? CL.red : CL.green}"/>`; if (ok) s += T(x + 32, 92, '✕ ถูกที่', { fs: 11.5, c: CL.red, a: 'start' }); });
      return svgW(40 + n * w, 160, s); } },
  coinrow: { name: 'ลำดับผลการโยนเหรียญ / ลูกเต๋า', p: [['s', 'ผลลัพธ์ (H/T หรือเลข 1–6) เช่น HTHHT หรือ 3,5,1', 'HTHHT'], ['lb', 'ข้อความใต้รูป', '']],
    gen: p => { const raw = String(p.s || ''); const seq = raw.includes(',') ? list(raw) : raw.replace(/\s/g, '').split(''); let s = '';
      seq.forEach((c, i) => { const x = 14 + i * 44; const ic = /^[1-6]$/.test(c) ? `ลูกเต๋า ${c}` : /h/i.test(c) ? 'เหรียญหัว (H)' : 'เหรียญก้อย (T)'; s += `<g transform="translate(${x} 8) scale(1.6)">${ICONS[ic] || ''}</g>`; });
      if (p.lb) s += T(14 + seq.length * 22, 70, p.lb, { fs: 13.5, c: CL.brown });
      return svgW(24 + seq.length * 44, p.lb ? 80 : 54, s); } },
  stripes: { name: 'ระบายสีแถบ / ธง', p: [['c', 'สีแต่ละแถบ (แดง น้ำเงิน เขียว เหลือง ขาว ม่วง ส้ม เทา) คั่นด้วย ,', 'แดง,ขาว,น้ำเงิน,ขาว,แดง'], ['dir', 'แนวแถบ', 'h', ['h:แนวนอน', 'v:แนวตั้ง']], yn('num', 'หมายเลขแถบ')],
    gen: p => { const map = { แดง: '#d9534f', น้ำเงิน: '#2c4a7a', เขียว: '#3c9a4f', เหลือง: '#f2c94c', ขาว: '#ffffff', ม่วง: '#8e4fa3', ส้ม: '#e07b39', เทา: '#9aa3af', ดำ: '#222' }; const C = list(p.c); const n = C.length || 1; const W = 260, H = 160; let s = '';
      C.forEach((c, i) => { const col = map[c] || c || '#fff'; if (p.dir === 'v') s += `<rect x="${10 + i * W / n}" y="10" width="${W / n}" height="${H}" fill="${col}"/>`; else s += `<rect x="10" y="${10 + i * H / n}" width="${W}" height="${H / n}" fill="${col}"/>`; if (ON(p.num)) s += p.dir === 'v' ? T(10 + (i + .5) * W / n, H + 28, i + 1, { fs: 12, r: 1 }) : T(W + 22, 10 + (i + .5) * H / n + 4, i + 1, { fs: 12, r: 1 }); });
      s += `<rect x="10" y="10" width="${W}" height="${H}" fill="none" stroke="${CL.dark}" stroke-width="1.5"/>`;
      return svgW(W + 40, H + 40, s); } },
  /* ---------- ความน่าจะเป็น ---------- */
  spinner: { name: 'วงล้อหมุน (แป้นหมุน)', p: [['s', 'ป้ายแต่ละช่อง (คั่นด้วย ,)', '1,2,3,4,5,6'], ['w', 'ขนาดสัมพัทธ์ของช่อง (เว้นว่าง = เท่ากัน)', ''], ['ang', 'ตำแหน่งเข็ม (องศา)', '40']],
    gen: p => { const L = list(p.s); const W = list(p.w).map(Number); const n = L.length || 1; const tot = W.length === n ? W.reduce((a, b) => a + b, 0) : n; const cx = 140, cy = 140, R = 110; let s = '', a0 = -Math.PI / 2; const cols = ['#f6c9a8', '#bcd3ea', '#c9e3c4', '#f0c9e0', '#f1e3a6', '#d6ccef', '#e5e7eb', '#fbd5c0'];
      L.forEach((t, i) => { const fr = (W.length === n ? W[i] : 1) / tot, a1 = a0 + fr * 2 * Math.PI; const P1 = [cx + R * Math.cos(a0), cy + R * Math.sin(a0)], P2 = [cx + R * Math.cos(a1), cy + R * Math.sin(a1)]; s += `<path d="M${cx} ${cy}L${P1[0].toFixed(1)} ${P1[1].toFixed(1)}A${R} ${R} 0 ${fr > .5 ? 1 : 0} 1 ${P2[0].toFixed(1)} ${P2[1].toFixed(1)}Z" fill="${cols[i % cols.length]}" stroke="${CL.brown}" stroke-width="1.3"/>`; const am = (a0 + a1) / 2; s += lab(cx + R * .66 * Math.cos(am), cy + R * .66 * Math.sin(am) + 6, t, { fs: 17, b: 1 }); a0 = a1; });
      const ang = (+p.ang || 0) * Math.PI / 180 - Math.PI / 2; s += `<path d="M${cx} ${cy}L${cx + R * .85 * Math.cos(ang)} ${cy + R * .85 * Math.sin(ang)}" ${STK(CL.dark, 3.2)}/><circle cx="${cx}" cy="${cy}" r="7" fill="${CL.dark}"/>`;
      return svgW(280, 280, s); } },
  pmodel: { name: 'แบบจำลองพื้นที่ (ความน่าจะเป็นของเหตุการณ์อิสระ)', p: [['a', 'P(A)', '0.6'], ['b', 'P(B)', '0.3'], ['na', 'ชื่อเหตุการณ์ A', 'A'], ['nb', 'ชื่อเหตุการณ์ B', 'B']],
    gen: p => { const a = Math.max(0, Math.min(1, +p.a || 0)), b = Math.max(0, Math.min(1, +p.b || 0)); const S = 240, x0 = 50, y0 = 30; let s = '';
      s += `<rect x="${x0}" y="${y0}" width="${S * a}" height="${S}" fill="#bcd3ea" fill-opacity=".7"/><rect x="${x0}" y="${y0}" width="${S}" height="${S * b}" fill="#f6c9a8" fill-opacity=".7"/><rect x="${x0}" y="${y0}" width="${S}" height="${S}" fill="none" stroke="${CL.dark}" stroke-width="1.6"/>`;
      s += pl([[x0 + S * a, y0], [x0 + S * a, y0 + S]], STK(CL.navy, 1.4, 1)) + pl([[x0, y0 + S * b], [x0 + S, y0 + S * b]], STK(CL.red, 1.4, 1));
      s += svgMath(x0 + S * a / 2, y0 + S + 18, `${p.na} : ${fmt(a)}`, { fs: 13, c: CL.navy }) + svgMath(x0 - 6, y0 + S * b / 2 + 4, `${p.nb} : ${fmt(b)}`, { fs: 13, c: CL.red, a: 'end' });
      s += T(x0 + S * a / 2, y0 + S * b / 2 + 5, `${fmt(a * b)}`, { fs: 14, b: 1, r: 1 });
      return svgW(x0 + S + 20, y0 + S + 30, s); } },
});
const sub3 = (a, b) => a.map((v, i) => v - b[i]), dot3 = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2], cross3 = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]], nrm3 = v => { const l = Math.hypot(...v) || 1; return v.map(x => x / l); };

/* ---------- หมวดหมู่ใหม่: ใช้บ่อย → ตามระดับชั้น/บทเรียน ---------- */
LIBCAT.length = 0;
LIBCAT.push(
  ['★ ใช้บ่อย', ['combo', 'fgraph', 'areas', 'tree', 'venn2', 'tri']],
  ['— ม.4 —'],
  ['เซต', ['venn2', 'venn3']],
  ['จำนวนจริง (เส้นจำนวน ช่วง)', ['numline']],
  ['ฟังก์ชัน', ['fgraph', 'parab', 'piece', 'explog', 'combo']],
  ['เรขาคณิตวิเคราะห์ ภาคตัดกรวย', ['aline', 'conic', 'combo']],
  ['— ม.5 —'],
  ['ตรีโกณมิติ', ['ucircle', 'trigg', 'tri']],
  ['เวกเตอร์', ['vec2', 'vec3', 'crossar']],
  ['จำนวนเชิงซ้อน', ['argand']],
  ['หลักการนับ', ['slots', 'menu', 'roads', 'tree', 'pascal', 'letters', 'seats', 'round', 'glue', 'gaps', 'pick', 'boxes', 'stars', 'grid', 'envel', 'stripes', 'people']],
  ['ความน่าจะเป็น', ['tree', 'dice', 'coinrow', 'balls', 'spinner', 'pmodel', 'venn2']],
  ['— ม.6 —'],
  ['ลำดับและอนุกรม', ['seq']],
  ['แคลคูลัส', ['sketch', 'tangent', 'rate', 'riemann', 'integ', 'areas']],
  ['สถิติ', ['hist', 'boxp', 'scatter', 'normal']],
  ['— เรขาคณิต —'],
  ['เรขาคณิต 2 มิติ', ['tri', 'quad', 'circ', 'poly', 'paral']],
  ['เรขาคณิต 3 มิติ', ['solid', 'cubecut', 'solidcut']],
  ['วาดเอง (อิสระ)', ['FREE']],
);

const IMPL_OK = ['fgraph', 'combo'];
/* ===================== ชุดที่ 4: สี/เส้นทุกรูป · ช่องพิมพ์สมการ · คน/ไอคอนกำหนดเอง · ภาพสถานการณ์ · ปริมาตรเวกเตอร์ · กราฟจำนวนเชิงซ้อน · สามเหลี่ยมตามขนาดจริง ===================== */
const tl = (x, y, s, o = {}) => /[ก-๙]/.test(String(s)) ? T(x, y, s, o) : svgMath(x, y, s, o);
const COLNAME = { 'แดง': '#c0392b', 'น้ำเงิน': '#2c4a7a', 'เขียว': '#2e7d32', 'ส้ม': '#d9682b', 'ม่วง': '#7b3f8c', 'ชมพู': '#d1477a', 'เหลือง': '#e0a800', 'น้ำตาล': '#713408', 'ดำ': '#222222', 'เทา': '#8a8f98', 'ฟ้า': '#3a8fd6', 'ทอง': '#b8860b', 'ขาว': '#ffffff',
  red: '#c0392b', blue: '#2c4a7a', green: '#2e7d32', orange: '#d9682b', purple: '#7b3f8c', pink: '#d1477a', yellow: '#e0a800', brown: '#713408', black: '#222222', gray: '#8a8f98', teal: '#2b7a8c' };
const colOfWord = w => !w ? null : /^#[0-9a-f]{6}$/i.test(w) ? w : COLNAME[w] || COLNAME[String(w).toLowerCase()] || null;
const tint = (c, t) => mixHex(c, '#ffffff', t);

/* ---------- ชุดสีและความหนาเส้น ใช้ได้กับทุกรูปในคลัง ---------- */
const FPAL = {
  def: ['ตามค่าเริ่มต้น (หลายสี)', null],
  en: ['Earth & Newton (น้ำตาล–ทอง)', { navy: '#713408', orange: '#b8860b', red: '#a0442a', green: '#6b7f2a', purple: '#8c5a2b', teal: '#2b7a8c' }],
  blue: ['โทนน้ำเงิน–ฟ้า', { navy: '#1f4e9a', orange: '#2a9fd6', red: '#0b5e8c', green: '#3a7bd5', purple: '#5a4fcf', teal: '#1d8a99' }],
  green: ['โทนเขียว', { navy: '#1b5e20', orange: '#7cb342', red: '#00897b', green: '#33691e', purple: '#558b2f', teal: '#26a69a' }],
  pink: ['โทนชมพู–ม่วง', { navy: '#6a1b9a', orange: '#e85d8a', red: '#c2185b', green: '#8e24aa', purple: '#ad1457', teal: '#d16ba5' }],
  warm: ['โทนแดง–ส้ม', { navy: '#b03a2e', orange: '#e67e22', red: '#922b21', green: '#c49000', purple: '#a04000', teal: '#ca6f1e' }],
  bw: ['ขาวดำ (ถ่ายเอกสาร)', 'bw'],
  custom: ['กำหนดเอง (สีหลัก + สีเน้น)', 'custom'],
};
let libStyleLast = { _pal: 'def', _c1: '#2c4a7a', _c2: '#d9682b', _lw: '1', _fs: '1' };
function libStyleHTML(vals) {
  const v = Object.assign({}, libStyleLast); if (vals) ['_pal', '_c1', '_c2', '_lw', '_fs'].forEach(k => { if (vals[k] !== undefined) v[k] = vals[k]; });
  const sel = (k, o) => `<select data-k="${k}">${o.map(([a, b]) => `<option value="${a}"${String(v[k]) === a ? ' selected' : ''}>${b}</option>`).join('')}</select>`;
  return `<div class="lbsty"><div class="lbsh">🎨 สี เส้น และตัวอักษร <small>(ใช้ได้กับทุกรูป)</small></div>
    <div class="row"><label>ชุดสี</label>${sel('_pal', Object.entries(FPAL).map(([k, x]) => [k, x[0]]))}</div>
    <div class="row"><label>สีหลัก · สีเน้น</label><input type="color" data-k="_c1" value="${v._c1}"><input type="color" data-k="_c2" value="${v._c2}"><span class="hint">เลือกแล้วจะเปลี่ยนเป็น “กำหนดเอง”</span></div>
    <div class="row"><label>ความหนาเส้น</label>${sel('_lw', [['.7', 'บาง'], ['1', 'ปกติ'], ['1.4', 'หนา'], ['1.8', 'หนามาก']])}</div>
    <div class="row"><label>ขนาดตัวอักษรในรูป</label>${sel('_fs', [['.85', 'เล็ก'], ['1', 'ปกติ'], ['1.2', 'ใหญ่'], ['1.4', 'ใหญ่มาก']])}</div>
    <input type="hidden" data-k="_cmap" value="${esc(vals && vals._cmap || '')}"></div>`;
}
const hexRGB = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16));
const rgbHex = a => '#' + a.map(v => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0')).join('');
function palMap(h, M) {
  h = h.toLowerCase();
  const base = { navy: CL.navy, red: CL.red, green: CL.green, orange: CL.orange, purple: CL.purple, teal: CL.teal };
  for (const k in M) if (base[k] === h) return M[k];
  const x = hexRGB(h); if (Math.max(...x) - Math.min(...x) < 14) return h; let best = null, be = 1e9;
  for (const k in M) { const b = hexRGB(base[k]); let ts = [], w = 0; for (let i = 0; i < 3; i++) if (255 - b[i] > 25) { ts.push((x[i] - b[i]) / (255 - b[i])); w++; } if (!w) continue; const t = ts.reduce((a, c) => a + c, 0) / w; if (t <= .05 || t >= .98) continue; const err = Math.max(...[0, 1, 2].map(i => Math.abs(b[i] + (255 - b[i]) * t - x[i]))); if (err < be) { be = err; best = [k, t]; } }
  if (best && be < 34) return mixHex(M[best[0]], '#ffffff', best[1]);
  return h;
}
function libStyleApply(svg, q) {
  if (!svg) return svg; const pal = q._pal || 'def', lw = +q._lw || 1, fs = +q._fs || 1;
  if (pal === 'bw') svg = svg.replace(/#[0-9a-fA-F]{6}\b/g, h => { const [r, g, b] = hexRGB(h); const L = (.299 * r + .587 * g + .114 * b) / 255; const sat = Math.max(r, g, b) - Math.min(r, g, b); if (sat < 18) return h; const v = L < .62 ? L * 120 : 140 + L * 110; return rgbHex([v, v, v]); });
  else if (pal !== 'def') { const M = pal === 'custom' ? { navy: q._c1 || CL.navy, orange: q._c2 || CL.orange, red: q._c2 ? mixHex(q._c2, '#000000', .18) : CL.red } : FPAL[pal] && FPAL[pal][1]; if (M) svg = svg.replace(/#[0-9a-fA-F]{6}\b/g, h => palMap(h, M)); }
  if (q._cmap) svg = cmapApply(svg, q._cmap);
  if (lw !== 1) svg = svg.replace(/stroke-width="([\d.]+)"/g, (m, w) => `stroke-width="${(+w * lw).toFixed(2)}"`);
  if (fs !== 1) svg = svg.replace(/font-size="([\d.]+)"/g, (m, w) => `font-size="${(+w * fs).toFixed(1)}"`);
  return svg;
}

/* ---------- ช่องพิมพ์ฟังก์ชัน: ปุ่มลัด · ตัวแก้สมการ · แสดงผลทันที ---------- */
const FN_FIELDS = { fgraph: ['f'], piece: ['f'], trigg: ['f'], seq: ['f'], sketch: ['f'], tangent: ['f'], rate: ['f'], riemann: ['f'], integ: ['f', 'g'], areas: ['f', 'g'], combo: ['src'] };
const FN_CHIPS = [['x²', '^2'], ['xⁿ', '^(|)'], ['√', 'sqrt(|)'], ['∛', 'cbrt(|)'], ['|x|', '|‸|'], ['a/b', '(|)/()'], ['sin', 'sin(|)'], ['cos', 'cos(|)'], ['tan', 'tan(|)'], ['eˣ', 'e^(|)'], ['ln', 'ln(|)'], ['log', 'log(|)'], ['logₐ', 'log_2(|)'], ['π', 'pi']];
const PIECE_RE = /^(.*?)\s*(?:ถ้า|if|เมื่อ|,)\s*([-\d.]+\s*(?:<=|<|≤)\s*x\s*(?:<=|<|≤)\s*[-\d.]+)\s*$/;
function fnSegments(el) { // คืน [{s,e}] ช่วงตัวอักษรของ “สมการ” แต่ละส่วน
  const v = el.value, out = [];
  if (el.tagName === 'TEXTAREA') { let p = 0; v.split('\n').forEach(line => { const m = /^(\s*(?:f|y)\s*:\s*)([^|]*)/.exec(line); if (m) { const s = p + m[1].length, raw = m[2]; out.push({ s, e: s + raw.replace(/\s+$/, '').length, line: true }); } else { const a = /^(\s*area\s*:\s*)(.*)$/.exec(line); if (a) { let q = p + a[1].length; a[2].split(';').slice(0, 2).forEach(part => { const lead = part.length - part.replace(/^\s+/, '').length; const t = part.split('|')[0].trim(); if (t) out.push({ s: q + lead, e: q + lead + t.length }); q += part.length + 1; }); } } p += line.length + 1; }); return out; }
  let p = 0; v.split(';').forEach(part => { const lead = part.length - part.replace(/^\s+/, '').length; let t = part.trim(); const m = PIECE_RE.exec(t); if (m) t = m[1].trim(); if (t) out.push({ s: p + lead, e: p + lead + t.length, cond: m ? m[2] : null }); p += part.length + 1; });
  return out;
}
function fnPreview(box) {
  const el = box._el; const segs = fnSegments(el); const v = el.value;
  if (!segs.length) { box.querySelector('.fnprev').innerHTML = '<span class="hint">ยังไม่มีสมการ</span>'; return; }
  box.querySelector('.fnprev').innerHTML = segs.map((g, i) => { const src = v.slice(g.s, g.e); const r = mpCheck(src, { implicit: IMPL_OK.includes(libKind) }); return r.ok ? `<div class="fok">✓ ${kx((r.implicit ? '' : 'y = ') + r.tex + (g.cond ? '\\quad ;\\ ' + g.cond.replace(/<=/g, '\\le ').replace(/≤/g, '\\le ') : ''))}</div>` : `<div class="fbad">✗ ${segs.length > 1 ? `สมการที่ ${i + 1} ` : ''}“${esc(src)}” — ${esc(r.err)}</div>`; }).join('');
}
function fnInsert(el, snip) {
  const a = el.selectionStart ?? el.value.length, b = el.selectionEnd ?? a; let t = snip.replace('‸', '|'); let caret = t.indexOf('|', snip === '|‸|' ? 1 : 0);
  if (snip === '|‸|') { t = '||'; caret = 1; } else if (caret >= 0 && snip.includes('(|)')) { t = t.replace('(|)', '()'); caret = t.indexOf('()') + 1; } else caret = t.length;
  el.value = el.value.slice(0, a) + t + el.value.slice(b); el.focus(); el.selectionStart = el.selectionEnd = a + caret; el.dispatchEvent(new Event('input', { bubbles: true }));
}
function fnEditor(el) {
  const segs = fnSegments(el), c = el.selectionStart ?? 0; let g = segs.find(x => c >= x.s - 1 && c <= x.e + 1) || (segs.length === 1 ? segs[0] : null);
  const cur = g ? el.value.slice(g.s, g.e) : ''; const r = cur ? mpCheck(cur, { implicit: IMPL_OK.includes(libKind) }) : null;
  openMathCb(r && r.ok ? r.tex : cur, tex => {
    const q = mpCheck(tex, { implicit: IMPL_OK.includes(libKind) }); const txt = q.ok ? q.plain : tex;
    if (g) el.value = el.value.slice(0, g.s) + txt + el.value.slice(g.e);
    else if (el.tagName === 'TEXTAREA') el.value = el.value.replace(/\s*$/, '') + '\nf: ' + txt;
    else el.value = el.value.trim() ? el.value.replace(/\s*;?\s*$/, '') + '; ' + txt : txt;
    el.dispatchEvent(new Event('input', { bubbles: true }));
  });
}
const BLANK_NEW = { combo: ['src'], cplot: ['src'], fgraph: ['f', 'lb'], trigg: ['f', 'lb'], piece: ['f'] };
function libEnhance() {
  const keys = FN_FIELDS[libKind] || [];
  if (!libFormVals) [...keys, ...(BLANK_NEW[libKind] || [])].forEach(k => { const el = $(`#lbForm [data-k="${k}"]`); if (!el) return; if (el.value && el.tagName !== 'TEXTAREA') el.placeholder = 'เช่น ' + el.value; el.value = ''; });
  keys.forEach(k => {
    const el = $(`#lbForm [data-k="${k}"]`); if (!el) return; const row = el.closest('.row');
    const box = document.createElement('div'); box.className = 'fnbox'; box._el = el;
    box.innerHTML = `<div class="fnchips">${FN_CHIPS.map(([n, sn]) => `<button type="button" class="tb" data-sn="${esc(sn)}">${n}</button>`).join('')}<button type="button" class="tb primary fned">∑ พิมพ์ด้วยตัวแก้สมการ</button><button type="button" class="tb fnhelp">?</button></div>
      <div class="fnhelpbox" style="display:none">พิมพ์ได้ 2 แบบ: <b>แบบธรรมดา</b> เช่น <code>2x^2-3x+1</code> <code>sin 2x</code> <code>sqrt(x+1)</code> <code>|x-2|</code> <code>e^(2x)</code> <code>ln x</code> <code>log_2(x)</code> <code>1/(x-1)</code> <code>(x+1)^(1/3)</code> หรือ <b>LaTeX จากตัวแก้สมการ</b> เช่น <code>\\frac{1}{x}</code> <code>\\sqrt[3]{x}</code> <code>\\sin^2 x</code><br>คูณไม่ต้องใส่ * (2x, 3sin x) · ยกกำลังใช้ ^ · หลายสมการคั่นด้วย ; · ตัวแปรใช้ x · บรรทัดเขียวคือระบบอ่านได้แล้ว</div>
      <div class="fnprev"></div>`;
    row.after(box);
    box.querySelectorAll('[data-sn]').forEach(b => b.onmousedown = e => { e.preventDefault(); fnInsert(el, b.dataset.sn); });
    box.querySelector('.fned').onclick = () => fnEditor(el);
    box.querySelector('.fnhelp').onclick = () => { const h = box.querySelector('.fnhelpbox'); h.style.display = h.style.display === 'none' ? '' : 'none'; };
    el.addEventListener('input', () => fnPreview(box)); fnPreview(box);
  });
  $$('#lbForm .lbsty [data-k]').forEach(e => e.addEventListener('input', () => {
    if (e.dataset.k === '_c1' || e.dataset.k === '_c2') $('#lbForm [data-k="_pal"]').value = 'custom'; if (e.dataset.k === '_pal' || e.dataset.k === '_c1' || e.dataset.k === '_c2') $('#lbForm [data-k="_cmap"]').value = '';
    ['_pal', '_c1', '_c2', '_lw', '_fs'].forEach(k => libStyleLast[k] = $(`#lbForm [data-k="${k}"]`).value); libPrev();
  }));
}

/* ---------- คนและไอคอน (ออกแบบในกรอบ 30×60) ---------- */
const MAN = c => `<circle cx="15" cy="8" r="6.2" fill="${c}"/><path d="M8 17h14a3 3 0 0 1 3 3v15h-4v-12h-1v35h-4.5v-20h-1v20h-4.5v-35h-1v12h-4v-15a3 3 0 0 1 3-3z" fill="${c}"/>`;
const WOMAN = c => `<path d="M8.6 9.5a6.4 6.4 0 0 1 12.8 0v6.6l-2.4 .8v-3.4a6.2 6.2 0 0 1-8 0v3.4l-2.4-.8z" fill="${mixHex(c, '#000000', .35)}"/><circle cx="15" cy="9" r="5.6" fill="${c}"/><path d="M10.5 17.5h9l3 2.5 3.4 15.5h-3.8l-2-9 3.4 17.5h-17l3.4-17.5-2 9h-3.8l3.4-15.5z" fill="${c}"/><rect x="11" y="44" width="3.2" height="14" fill="${c}"/><rect x="15.8" y="44" width="3.2" height="14" fill="${c}"/>`;
const PTYPE = [['man', ['ชาย', 'ผู้ชาย', 'ช', 'm', 'man', 'male']], ['woman', ['หญิง', 'ผู้หญิง', 'ญ', 'w', 'f', 'woman', 'female']], ['boy', ['เด็กชาย', 'ด', 'boy']], ['girl', ['เด็กหญิง', 'ก', 'girl']], ['person', ['คน', 'p', 'person']],
  ['circle', ['วงกลม', 'circle']], ['square', ['สี่เหลี่ยม', 'square']], ['triangle', ['สามเหลี่ยม', 'triangle']], ['heart', ['หัวใจ', 'heart']], ['ball', ['ลูกบอล', 'บอล', 'ball']], ['book', ['หนังสือ', 'book']], ['star', ['ดาว', 'star']], ['car', ['รถ', 'car']], ['house', ['บ้าน', 'house']], ['flag', ['ธง', 'flag']], ['apple', ['แอปเปิล', 'ผลไม้', 'apple']], ['pen', ['ปากกา', 'ดินสอ', 'pen']], ['chair', ['เก้าอี้', 'chair']]];
const PDEF = { man: CL.navy, woman: '#c0392b', boy: CL.teal, girl: CL.purple, person: CL.brown, circle: CL.orange, square: CL.navy, triangle: CL.green, heart: '#c0392b', ball: '#c0392b', book: CL.navy, star: '#e0a800', car: CL.red, house: CL.brown, flag: CL.red, apple: CL.red, pen: '#e0a800', chair: CL.brown };
function ptypeOf(w) { const t = String(w).trim(); for (const [k, al] of PTYPE) if (al.includes(t) || al.includes(t.toLowerCase())) return k; return null; }
function itemIcon(type, c, txt) { // ในกรอบ 30×60 (ฐานที่ y=60)
  switch (type) {
    case 'man': case 'person': return MAN(c);
    case 'woman': return WOMAN(c);
    case 'boy': return `<g transform="translate(3.75 15) scale(.75)">${MAN(c)}</g>`;
    case 'girl': return `<g transform="translate(3.75 15) scale(.75)">${WOMAN(c)}</g>`;
    case 'circle': return `<circle cx="15" cy="45" r="12" fill="${c}"/>`;
    case 'square': return `<rect x="4" y="34" width="22" height="22" rx="2" fill="${c}"/>`;
    case 'triangle': return `<path d="M15 32l13 24h-26z" fill="${c}"/>`;
    case 'heart': return `<path d="M15 56C5 48 2 43 2 38a6.5 6.5 0 0 1 13-2 6.5 6.5 0 0 1 13 2c0 5-3 10-13 18z" fill="${c}"/>`;
    case 'ball': return `<circle cx="15" cy="45" r="12" fill="${c}" stroke="${CL.dark}" stroke-width=".8"/><ellipse cx="11" cy="40" rx="3.6" ry="2.4" fill="#fff" opacity=".55"/>`;
    case 'book': return `<path d="M3 38c4-2 8-2 12 .6v18c-4-2.6-8-2.6-12-.6zM27 38c-4-2-8-2-12 .6v18c4-2.6 8-2.6 12-.6z" fill="#fff" stroke="${c}" stroke-width="1.6"/>`;
    case 'star': return `<path d="M15 32l3.6 7.6 8.3.9-6.2 5.6 1.8 8.2L15 50.1l-7.5 4.2 1.8-8.2-6.2-5.6 8.3-.9z" fill="${c}" stroke="${CL.dark}" stroke-width=".6"/>`;
    case 'car': return `<path d="M2 50v-6l4-1 4-7h11l5 7 3 1v6z" fill="${c}"/><circle cx="8" cy="51" r="3.6" fill="${CL.dark}"/><circle cx="22" cy="51" r="3.6" fill="${CL.dark}"/><path d="M11 37.5h4v5.5h-7.5zM17 37.5h3.5l3.5 5.5h-7z" fill="#fff" opacity=".8"/>`;
    case 'house': return `<path d="M3 44l12-11 12 11v13h-24z" fill="${tint(c, .55)}" stroke="${c}" stroke-width="1.5"/><path d="M1 44.5l14-13 14 13" fill="none" stroke="${c}" stroke-width="2.2"/><rect x="12" y="48" width="6" height="9" fill="${c}"/>`;
    case 'flag': return `<path d="M7 58V32" stroke="${CL.dark}" stroke-width="1.6"/><path d="M7.8 32.5h17l-3.5 5 3.5 5h-17z" fill="${c}"/>`;
    case 'apple': return `<path d="M15 39c-3-3-11-2-11 7 0 6 4 11 7.5 11 1.6 0 2.4-.8 3.5-.8s1.9.8 3.5.8C22 57 26 52 26 46c0-9-8-10-11-7z" fill="${c}"/><path d="M15 39c0-3 1-5 3-6" stroke="${CL.brown}" stroke-width="1.4" fill="none"/>`;
    case 'pen': return `<path d="M6 56l1.6-5.6L21 37a2.4 2.4 0 0 1 3.4 3.4L11 53.8z" fill="${c}" stroke="${CL.dark}" stroke-width=".8"/>`;
    case 'chair': return `<path d="M9 30v28M9 44h13v14M9 44h13" stroke="${c}" stroke-width="2.6" fill="none" stroke-linecap="round"/>`;
  }
  if (type === 'icon' && ICONS[txt]) return `<g transform="translate(1 30) scale(1.17)">${ICONS[txt]}</g>`;
  return `<rect x="2" y="32" width="26" height="26" rx="5" fill="${tint(c, .72)}" stroke="${c}" stroke-width="1.4"/>` + lab(15, 51, txt, { fs: 16, b: 1 });
}
function parseGroups(src) { // "ชาย×3 น้ำเงิน, หญิง×2"
  return list(src).map(tok => {
    const m = /^(.+?)\s*(?:[×x*:]\s*|\s+)(\d+)\s*(.*)$/.exec(tok) || [null, tok, '1', ''];
    let name = m[1].trim(), n = Math.min(40, +m[2] || 1); const c = colOfWord(m[3].trim());
    let type = ptypeOf(name), txt = name; if (!type) { const ik = Object.keys(ICONS).find(k => k === name || k.startsWith(name)); if (ik) { type = 'icon'; txt = ik; } else type = 'tile'; }
    return { type, txt, n, c: c || PDEF[type] || CL.brown };
  });
}

/* ---------- ชุดที่ 4: รูปใหม่ ---------- */
Object.assign(LIB, {
  crowd: { name: 'คน/สิ่งของเรียงกัน (กำหนดชาย หญิง จำนวน สี ไอคอนเอง)', p: [
    ['g', 'กลุ่ม: ชนิด×จำนวน สี (คั่นด้วย ,) ชนิด เช่น ชาย หญิง เด็กชาย เด็กหญิง หนังสือ ดาว ลูกบอล รถ บ้าน หัวใจ หรือพิมพ์ตัวอักษรเอง', 'ชาย×3, หญิง×2'],
    ['ord', 'การจัดเรียง', 'grp', ['grp:ตามกลุ่ม', 'alt:สลับกันทีละคน', 'seq:ตามลำดับที่พิมพ์ด้านล่าง']],
    ['seq', 'ลำดับเอง (คั่นด้วยเว้นวรรค ใช้ตัวย่อ ช ญ ด ก หรือชื่อชนิด)', 'ช ญ ช ญ ช'],
    ['lay', 'รูปแบบ', 'row', ['row:แถวเดียว', 'grid:หลายแถว', 'circle:นั่งรอบโต๊ะกลม', 'queue:ต่อแถว (มีลูกศร)']],
    ['per', 'จำนวนต่อแถว (แบบหลายแถว)', '5'],
    ['lbl', 'ป้ายใต้แต่ละตัว', 'abc', ['none:ไม่มี', 'abc:A, B, C, …', 'num:1, 2, 3, …', 'name:ตามชื่อที่พิมพ์']],
    ['names', 'ชื่อ (คั่นด้วย ,)', 'สมชาย, สมหญิง, มานะ, มานี, ปิติ'],
    ['hl', 'ระบายกรอบตำแหน่งที่ (เช่น 1,3)', ''],
    ['grp', 'มัดรวมเป็นกลุ่ม (เช่น 1-2, 4-5)', ''],
    ['sz', 'ขนาด', '1', ['.8:เล็ก', '1:ปกติ', '1.3:ใหญ่']]],
    gen: p => {
      const G = parseGroups(p.g); let seq = [];
      if (p.ord === 'seq') seq = String(p.seq).trim().split(/\s+/).filter(Boolean).map(t => { const g = G.find(x => x.txt === t || ptypeOf(t) === x.type) || parseGroups(t)[0]; return g; }).filter(Boolean);
      else if (p.ord === 'alt') { const left = G.map(g => g.n); for (let k = 0; left.some(v => v > 0) && k < 200; k++) G.forEach((g, i) => { if (left[i] > 0) { seq.push(g); left[i]--; } }); }
      else G.forEach(g => { for (let i = 0; i < g.n; i++) seq.push(g); });
      seq = seq.slice(0, 60); const n = seq.length; if (!n) return svgW(200, 40, T(100, 25, 'ยังไม่มีรายการ', { fs: 14, c: CL.gray }));
      const sz = +p.sz || 1, cw = 40 * sz, ch = 60 * sz * .9, L = p.lbl === 'abc' ? seq.map((_, i) => String.fromCharCode(65 + i % 26)) : p.lbl === 'num' ? seq.map((_, i) => String(i + 1)) : p.lbl === 'name' ? list(p.names) : [];
      const hl = list(p.hl).map(Number); const grps = list(p.grp).map(t => t.split(/[-–]/).map(Number)).filter(a => a[0]);
      const pos = []; let W, H, s = ''; const lh = L.length ? 22 : 4;
      if (p.lay === 'circle') {
        const R = Math.max(92, n * (cw + 10) / (2 * Math.PI) + 34); const cx = R + cw + 26, cy = R + ch + 30;
        s += `<circle cx="${cx}" cy="${cy - ch / 2}" r="${R - ch * .62}" fill="${CL.cream}" stroke="${CL.brown}" stroke-width="1.6"/>`;
        for (let i = 0; i < n; i++) { const a = -Math.PI / 2 + 2 * Math.PI * i / n; pos.push([cx + R * Math.cos(a), cy - ch / 2 + R * Math.sin(a) + ch / 2, a]); }
        W = 2 * cx; H = cy + R + 30;
      } else {
        const per = p.lay === 'grid' ? Math.max(1, +p.per || 5) : n, gap = p.lay === 'queue' ? 22 * sz : 8 * sz;
        for (let i = 0; i < n; i++) { const r = Math.floor(i / per), c = i % per; pos.push([16 + cw / 2 + c * (cw + gap), 8 + ch + r * (ch + lh + 16)]); }
        W = 32 + Math.min(n, per) * (cw + gap) - gap; H = 8 + Math.ceil(n / per) * (ch + lh + 16);
      }
      grps.forEach(([a, b]) => { const P = pos.slice(a - 1, (b || a)).filter(Boolean); if (!P.length) return; const xs = P.map(q => q[0]), ys = P.map(q => q[1]); s += `<rect x="${Math.min(...xs) - cw / 2 - 4}" y="${Math.min(...ys) - ch - 4}" width="${Math.max(...xs) - Math.min(...xs) + cw + 8}" height="${Math.max(...ys) - Math.min(...ys) + ch + 10}" rx="9" fill="${tint(CL.orange, .85)}" stroke="${CL.orange}" stroke-width="1.5" stroke-dasharray="5 3"/>`; });
      seq.forEach((g, i) => {
        const [x, y] = pos[i]; const k = ch / 60;
        if (hl.includes(i + 1)) s += `<rect x="${x - cw / 2 - 2}" y="${y - ch - 3}" width="${cw + 4}" height="${ch + 7}" rx="7" fill="${tint(CL.orange, .75)}" stroke="${CL.orange}" stroke-width="1.8"/>`;
        s += `<g transform="translate(${(x - 15 * k).toFixed(1)} ${(y - ch).toFixed(1)}) scale(${k.toFixed(3)})">${itemIcon(g.type, g.c, g.txt)}</g>`;
        if (L[i]) { if (p.lay === 'circle') { const a = pos[i][2]; s += lab(x + Math.cos(a) * (cw * .5 + 12), y - ch / 2 + Math.sin(a) * (ch * .5 + 14) + 5, L[i], { fs: 14 }); } else s += lab(x, y + 17, L[i], { fs: 14 }); }
        if (p.lay === 'queue' && i < n - 1) s += `<path d="M${x + cw / 2 + 3} ${y - ch / 2}h${22 * sz - 8}" ${STK(CL.gray, 1.4)}/><path d="M${x + cw / 2 + 22 * sz - 4} ${y - ch / 2}l-5 -3.5v7z" fill="${CL.gray}"/>`;
      });
      return svgW(W, H, s);
    } },

  trim: { name: 'สามเหลี่ยมตามขนาดจริง (กำหนดมุม/ด้าน แสดงขนาดมุม)', p: [
    ['mode', 'ข้อมูลที่กำหนด', 'asa', ['sss:ด้าน 3 ด้าน (a, b, c)', 'sas:ด้าน–มุม–ด้าน (b, มุม A, c)', 'asa:มุม–ด้าน–มุม (มุม B, a, มุม C)', 'aas:มุม 2 มุม + ด้าน (มุม A, มุม B, a)']],
    ['a', 'ด้าน a (ตรงข้ามมุม A)', '8'], ['b', 'ด้าน b', '6'], ['c', 'ด้าน c', '7'],
    ['A', 'มุม A (องศา)', '60'], ['B', 'มุม B (องศา)', '45'], ['C', 'มุม C (องศา)', '75'],
    ['v', 'ชื่อจุดยอด A, B, C', 'A,B,C'],
    ['sa', 'แสดงขนาดมุม', 'given', ['all:ทุกมุม', 'given:เฉพาะที่กำหนด', 'none:ไม่แสดง (เส้นโค้งเฉย ๆ)']],
    ['ss', 'แสดงความยาวด้าน', 'given', ['all:ทุกด้าน', 'given:เฉพาะที่กำหนด', 'none:ไม่แสดง']],
    ['al', 'ป้ายมุมเอง A, B, C (เช่น θ,,60° ; - = ซ่อน)', ''], ['sl', 'ป้ายด้านเอง a, b, c (เช่น x,5, ; - = ซ่อน)', ''],
    ['u', 'หน่วยความยาว', ''], yn('h', 'เส้นส่วนสูงจาก A', 'no')],
    gen: p => {
      const r = Math.PI / 180; let a = +p.a, b = +p.b, c = +p.c, A = +p.A, B = +p.B, C = +p.C; const gv = { sss: 'abc', sas: 'bAc', asa: 'BaC', aas: 'ABa' }[p.mode] || '';
      const err = m => svgW(360, 40, T(180, 26, m, { fs: 15, c: CL.red }));
      if (p.mode === 'sss') { if (a + b <= c || a + c <= b || b + c <= a) return err('ความยาวด้านสร้างสามเหลี่ยมไม่ได้'); A = Math.acos((b * b + c * c - a * a) / (2 * b * c)) / r; B = Math.acos((a * a + c * c - b * b) / (2 * a * c)) / r; C = 180 - A - B; }
      else if (p.mode === 'sas') { a = Math.sqrt(b * b + c * c - 2 * b * c * Math.cos(A * r)); B = Math.acos((a * a + c * c - b * b) / (2 * a * c)) / r; C = 180 - A - B; }
      else if (p.mode === 'asa') { if (B + C >= 180) return err('มุมรวมกันต้องน้อยกว่า 180°'); A = 180 - B - C; b = a * Math.sin(B * r) / Math.sin(A * r); c = a * Math.sin(C * r) / Math.sin(A * r); }
      else { if (A + B >= 180) return err('มุมรวมกันต้องน้อยกว่า 180°'); C = 180 - A - B; b = a * Math.sin(B * r) / Math.sin(A * r); c = a * Math.sin(C * r) / Math.sin(A * r); }
      if (![a, b, c, A, B, C].every(v => isFinite(v) && v > 0)) return err('ค่าที่กรอกสร้างสามเหลี่ยมไม่ได้');
      const R = [[c * Math.cos(B * r), c * Math.sin(B * r)], [0, 0], [a, 0]]; const F = fit(R, 400, 300, 44); const [PA, PB, PC] = R.map(F.P); const G = mid(mid(PA, PB), PC);
      const V = vtx(p.v), AL = String(p.al || '').split(',').map(x => x.trim()), SL = String(p.sl || '').split(',').map(x => x.trim()); const u = p.u ? ' ' + p.u : '';
      let s = pg([PA, PB, PC], STK(CL.dark, 1.8) + ` fill="${CL.cream}"`);
      if (ON(p.h)) { const f = [PA[0], PB[1]]; s += pl([PA, f], STK(CL.teal, 1.4, 1)) + rightMark(f, PA, PC, 9); if (f[0] < PB[0] || f[0] > PC[0]) s += pl([f, f[0] < PB[0] ? PB : PC], STK(CL.gray, 1.2, 1)); }
      const angs = [[PA, PB, PC, A, 'A'], [PB, PC, PA, B, 'B'], [PC, PA, PB, C, 'C']];
      angs.forEach(([P, Q, S, deg, k], i) => {
        let t = AL[i]; if (t === '-') t = ''; else if (!t) t = (p.sa === 'all' || (p.sa === 'given' && gv.includes(k))) ? fmt(deg) + '°' : '';
        if (Math.abs(deg - 90) < 1e-6) { s += rightMark(P, Q, S, 12); if (t) { const m = nrm([nrm(sub2(Q, P))[0] + nrm(sub2(S, P))[0], nrm(sub2(Q, P))[1] + nrm(sub2(S, P))[1]]); s += tl(P[0] + m[0] * 30, P[1] + m[1] * 30 + 5, t, { fs: 14, c: CL.orange }); } return; }
        const rr = deg < 35 ? 34 : deg > 110 ? 18 : 24; s += angArc(P, Q, S, rr, GCOL[[3, 0, 2][i]], t);
      });
      [[PB, PC, PA, a, 'a'], [PC, PA, PB, b, 'b'], [PA, PB, PC, c, 'c']].forEach(([P, Q, O, len, k], i) => { let t = SL[i]; if (t === '-') return; if (!t) { if (!(p.ss === 'all' || (p.ss === 'given' && gv.includes(k)))) return; t = fmt(len) + u; } const m = mid(P, Q), nn = nrm([-(Q[1] - P[1]), Q[0] - P[0]]), toO = sub2(O, m), sg = (nn[0] * toO[0] + nn[1] * toO[1]) > 0 ? -1 : 1; s += tl(m[0] + nn[0] * 16 * sg, m[1] + nn[1] * 16 * sg + 5, t, { fs: 15, c: CL.teal }); });
      [PA, PB, PC].forEach((P, i) => { if (V[i]) s += vlab(P, G, V[i], 15); });
      return svgW(F.w, F.h, s);
    } },

  vvol: { name: 'ปริมาตรจากเวกเตอร์ |u · (v × w)| (ทรงสี่เหลี่ยมด้านขนาน ทรงสี่หน้า)', p: [['u', 'u = (a₁, a₂, a₃)', '3,0,0'], ['v', 'v = (b₁, b₂, b₃)', '1,3,0'], ['w', 'w = (c₁, c₂, c₃)', '0.5,1,2.5'],
    ['sh', 'รูปทรง', 'par', ['par:ทรงสี่เหลี่ยมด้านขนาน (|u·(v×w)|)', 'tet:ทรงสี่หน้า (1/6)', 'pri:ปริซึมสามเหลี่ยม (1/2)']], yn('ax', 'แกน x, y, z', 'no'), yn('val', 'แสดงค่าปริมาตร', 'no'), ['nm', 'ชื่อเวกเตอร์ (3 ตัว)', 'u,v,w']],
    gen: p => {
      const u = list(p.u).map(Number), v = list(p.v).map(Number), w = list(p.w).map(Number); if (u.length < 3 || v.length < 3 || w.length < 3 || ![...u, ...v, ...w].every(isFinite)) return svgW(260, 40, T(130, 25, 'กรอกเวกเตอร์ 3 มิติให้ครบ', { fs: 14, c: CL.red }));
      const ad = (...q) => q.reduce((a, b) => a.map((x, i) => x + b[i]), [0, 0, 0]); const O = [0, 0, 0];
      let Vs, Fs; if (p.sh === 'tet') { Vs = [O, u, v, w]; Fs = [[0, 1, 2], [0, 1, 3], [0, 2, 3], [1, 2, 3]]; }
      else if (p.sh === 'pri') { Vs = [O, u, v, w, ad(u, w), ad(v, w)]; Fs = [[0, 1, 2], [3, 4, 5], [0, 1, 4, 3], [0, 2, 5, 3], [1, 2, 5, 4]]; }
      else { Vs = [O, u, ad(u, v), v, w, ad(u, w), ad(u, v, w), ad(v, w)]; Fs = [[0, 1, 2, 3], [4, 5, 6, 7], [0, 1, 5, 4], [3, 2, 6, 7], [0, 3, 7, 4], [1, 2, 6, 5]]; }
      const ext = Math.max(3, ...Vs.flat().map(Math.abs)); const sc = 150 / ext; const Q = (x, y, z) => [170 + (y - .55 * x) * sc, 230 - (z - .42 * x) * sc]; const view = [1, .55, .42];
      const cen = Vs.reduce((a, q) => a.map((x, i) => x + q[i] / Vs.length), [0, 0, 0]);
      const front = Fs.map(f => { const n = cross3(sub3(Vs[f[1]], Vs[f[0]]), sub3(Vs[f[2]], Vs[f[0]])); const fc = f.reduce((a, k) => a.map((x, i) => x + Vs[k][i] / f.length), [0, 0, 0]); const sg = dot3(n, sub3(fc, cen)) < 0 ? -1 : 1; return dot3(n.map(x => x * sg), view) > 0; });
      let s = '';
      if (ON(p.ax)) [[[ext * 1.2, 0, 0], 'x'], [[0, ext * 1.2, 0], 'y'], [[0, 0, ext * 1.1], 'z']].forEach(([q, n]) => { const a = Q(0, 0, 0), b = Q(...q); s += pl([a, b], STK(CL.gray, 1)) + T(b[0] + (b[0] - a[0]) * .05, b[1] + (b[1] - a[1]) * .05 + 4, n, { m: 1, fs: 14, c: CL.gray }); });
      Fs.map((f, i) => [f, i]).sort((A, B) => +front[A[1]] - +front[B[1]]).forEach(([f, i]) => s += pg(f.map(k => Q(...Vs[k])), `fill="${front[i] ? CL.orange : CL.navy}" fill-opacity="${front[i] ? .16 : .08}" stroke="none"`));
      const edges = new Map(); Fs.forEach((f, i) => f.forEach((a, j) => { const b = f[(j + 1) % f.length]; const key = Math.min(a, b) + '-' + Math.max(a, b); edges.set(key, (edges.get(key) || false) || front[i]); }));
      edges.forEach((vis, key) => { const [a, b] = key.split('-').map(Number); s += pl([Q(...Vs[a]), Q(...Vs[b])], vis ? STK(CL.dark, 1.6) : STK(CL.gray, 1.2, 1)); });
      const N = list(p.nm); const arrow = (q, c, n) => { const a = Q(0, 0, 0), b = Q(...q), d = nrm(sub2(b, a)), n2 = [-d[1], d[0]], h = [b[0] - d[0] * 10, b[1] - d[1] * 10]; return pl([a, h], STK(c, 2.4)) + pg([b, [h[0] + n2[0] * 4.5, h[1] + n2[1] * 4.5], [h[0] - n2[0] * 4.5, h[1] - n2[1] * 4.5]], `fill="${c}"`) + (n ? svgMath(b[0] + d[0] * 14 + (d[0] < -.3 ? -4 : d[0] > .3 ? 4 : 0), b[1] + d[1] * 14 + 5, n, { fs: 15, c, a: d[0] < -.3 ? 'end' : d[0] > .3 ? 'start' : 'middle' }) : ''); };
      s += arrow(u, CL.navy, N[0] || '') + arrow(v, CL.red, N[1] || '') + arrow(w, CL.green, N[2] || '');
      const box = Math.abs(dot3(u, cross3(v, w))); const fac = p.sh === 'tet' ? 6 : p.sh === 'pri' ? 2 : 1;
      const pts = Vs.map(q => Q(...q)).concat([Q(0, 0, 0)]); if (ON(p.ax)) [[ext * 1.2, 0, 0], [0, ext * 1.2, 0], [0, 0, ext * 1.1]].forEach(q => pts.push(Q(...q))); const xs = pts.map(q => q[0]), ys = pts.map(q => q[1]);
      const vx = Math.min(...xs) - 40, vy = Math.min(...ys) - 30 - (ON(p.val) ? 26 : 0), vw = Math.max(...xs) + 50 - vx, vh = Math.max(...ys) + 26 - vy;
      if (ON(p.val)) s += svgMath(vx + 10, vy + 20, `V = ${fac > 1 ? '1/' + fac + ' ' : ''}|${N[0] || 'u'} · (${N[1] || 'v'} × ${N[2] || 'w'})| = ${fmt(box / fac)}`, { fs: 14, a: 'start', c: CL.brown });
      return `<svg xmlns="http://www.w3.org/2000/svg" width="${Math.round(vw)}" height="${Math.round(vh)}" viewBox="${vx.toFixed(1)} ${vy.toFixed(1)} ${vw.toFixed(1)} ${vh.toFixed(1)}">${s}</svg>`;
    } },
});

/* ---------- มุม (ใช้ข้อความแบบคณิต) ---------- */
function angArc(p, a, b, r = 22, c = CL.orange, txt, fs = 14) {
  const u = nrm(sub2(a, p)), v = nrm(sub2(b, p)); const s0 = [p[0] + u[0] * r, p[1] + u[1] * r], e = [p[0] + v[0] * r, p[1] + v[1] * r]; const cr = u[0] * v[1] - u[1] * v[0];
  let out = `<path d="M${s0[0].toFixed(1)} ${s0[1].toFixed(1)}A${r} ${r} 0 0 ${cr > 0 ? 1 : 0} ${e[0].toFixed(1)} ${e[1].toFixed(1)}" ${STK(c, 1.5)}/>`;
  if (txt) { const m = nrm([u[0] + v[0], u[1] + v[1]]); const d = r + 8 + String(txt).length * 3; out += tl(p[0] + m[0] * d, p[1] + m[1] * d + 5, txt, { fs, c }); }
  return out;
}

