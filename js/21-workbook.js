'use strict';
/* ===================== กล่องตามสีประจำบท =====================
   เปิดใน ตั้งค่า → "กล่องใช้สีประจำบท" (settings.bxth)
   ชนิดเดียวกันใช้รูปแบบเดียวกัน · สีมาจากธีมของไฟล์ เปลี่ยนสีบทแล้วกล่องเปลี่ยนตาม · ข้อควรระวังคงโทนแดง */
(function () {
  const s = document.createElement('style');
  const M = p => `color-mix(in srgb,var(--brown) ${p}%,#fff)`;
  const R = ':root.bxth #flow ';
  s.textContent = `
${R}.b-box.k-def{background:${M(7)};border:1.3px solid var(--dark);border-radius:7px}
${R}.b-box.k-def .bt{color:#fff;background:var(--dark);margin:-4px -12px 5px;padding:2px 12px;border-radius:5px 5px 0 0}
${R}.b-box:is(.k-thmf,.k-thm,.k-prop,.k-formula,.k-rule,.k-lem,.k-cor,.k-axm,.k-crit){background:${M(5)};border:1.2px solid var(--brown);border-left:5px solid var(--brown);border-radius:4px}
${R}.b-box:is(.k-thmf,.k-thm,.k-prop,.k-formula,.k-rule,.k-lem,.k-cor,.k-axm,.k-crit) .bt{color:var(--brown)}
${R}.b-box:is(.k-key,.k-conv,.k-notat){background:${M(3)};border:1.3px dashed ${M(65)};border-radius:10px}
${R}.b-box:is(.k-key,.k-conv,.k-notat) .bt{color:var(--dark)}
${R}.b-box.k-proof{background:transparent;border:0;border-left:3px solid ${M(55)};border-radius:0}
${R}.b-box.k-proof .bt{color:var(--brown)}
${R}.b-box:is(.k-note,.k-remark,.k-tip,.k-hist,.k-link,.k-obj,.k-prior,.k-exam,.k-app,.k-plain,.k-try,.k-write){background:#fff;border:1px solid ${M(40)}}
${R}.b-box:is(.k-note,.k-remark,.k-tip,.k-hist,.k-obj,.k-prior,.k-exam,.k-app,.k-try,.k-write) .bt{color:var(--brown)}
${R}.b-box.k-inst{background:${M(4)};border:1px dashed ${M(45)}}
${R}.b-box.k-inst .bt{color:var(--brown)}
${R}.b-box.k-recap{border-color:var(--brown)}
${R}.mx:not([data-disp]):has(.mfrac,.mop.op-limits){display:inline-block;margin:3px 0}
`;
  document.head.appendChild(s);
})();
(function () {
  const _as = applySettings;
  applySettings = function () { const r = _as.apply(this, arguments); document.documentElement.classList.toggle('bxth', !!(doc && doc.settings && doc.settings.bxth)); return r; };
  const _os = openSettings;
  openSettings = function () {
    const r = _os.apply(this, arguments);
    const box = $('#sThemes'); if (!box) return r;
    let w = $('#sBxth');
    if (!w) { w = document.createElement('label'); w.id = 'sBxth'; w.style.cssText = 'display:flex;gap:6px;align-items:center;margin-top:6px'; w.innerHTML = '<input type="checkbox"> กล่อง (บทนิยาม ทฤษฎีบท ข้อสรุป บทพิสูจน์) ใช้สีประจำบท'; box.parentNode.insertBefore(w, box.nextSibling); $('input', w).onchange = e => { doc.settings.bxth = e.target.checked || undefined; applySettings(); changed(true); }; }
    $('input', w).checked = !!doc.settings.bxth;
    return r;
  };
})();

// รูปโหลดเสร็จทีหลัง: จัดหน้าใหม่ (เดิมจัดหน้าก่อนรูปมีความสูง ทำให้ตัดหน้าผิด)
document.addEventListener('load', e => { const t = e.target; if (t && t.tagName === 'IMG' && t.closest && t.closest('#flow')) schedulePaginate(); }, true);
// กล่องที่มีพื้นที่เขียนในกรอบ (b.minh มม.)
(function () { const _fb = fillBlock; fillBlock = function (el, b) { _fb(el, b); if (b && b.t === 'box') { const bx = $('.b-box', el); if (bx) bx.style.minHeight = b.minh ? (b.minh + 'mm') : ''; } }; })();

/* ===================== รูปสไตล์แบบฝึกทักษะ (วาดด้วยคำสั่ง แก้ไขได้) =====================
   รูปทุกรูปในหมวด "แบบฝึกทักษะ" ของคลังรูป ใช้ตัววาดเดียวกัน: คำสั่งบรรทัดละ 1 อย่าง
   แก้ตัวเลข/ข้อความในช่อง "คำสั่งวาด" แล้วรูปเปลี่ยนทันที · เพิ่มบรรทัดเพื่อเพิ่มของในรูป */
(function () {
  const WC = { or: '#c8611a', nv: '#2c4a7a', rd: '#a33424', lo: '#e3a03c', gr: '#8f8f8f', bk: '#262626', pu: '#7b3f8c', gn: '#2e7d32', pk: '#f8e4df', bl: '#e6ebf5', cr: '#fdf0e3', wh: '#ffffff', lr: '#fbeeeb' };
  const TH = { ส้ม: 'or', น้ำเงิน: 'nv', แดง: 'rd', ส้มอ่อน: 'lo', เทา: 'gr', ดำ: 'bk', ม่วง: 'pu', เขียว: 'gn', ชมพู: 'pk', ฟ้า: 'bl', ครีม: 'cr', ขาว: 'wh' };
  const col = (s, d) => { if (!s) return d; s = String(s).trim(); if (/^#[0-9a-f]{6}$/i.test(s)) return s; s = TH[s] || s; return WC[s] || d; };
  const NUM = '(-?\\d*\\.?\\d+(?:\\/\\d+)?)';
  const num = v => { v = String(v).trim().replace('−', '-'); if (v.includes('/')) { const [a, b] = v.split('/'); return +a / +b; } return +v; };
  const PTS = t => [...String(t).matchAll(new RegExp('\\(\\s*' + NUM + '\\s*,\\s*' + NUM + '\\s*\\)', 'g'))].map(m => [num(m[1]), num(m[2])]);
  const after = (t, n) => { let r = String(t); const re = new RegExp('^\\s*\\(\\s*' + NUM + '\\s*,\\s*' + NUM + '\\s*\\)'); for (let i = 0; i < n; i++) r = r.replace(re, ''); return r.trim(); };
  function opts(s) { // or dash w=2 fill=pk pos=se ...
    const o = { flags: {} }; String(s || '').trim().split(/\s+/).filter(Boolean).forEach(t => { const m = /^([^=]+)=(.*)$/.exec(t); if (m) o[m[1]] = m[2]; else if (col(t, null)) o.c = col(t); else o.flags[t] = 1; }); return o;
  }
  const f1 = v => (+v).toFixed(1);
  const fmtN = v => { const r = Math.round(v * 1000) / 1000; return (r < 0 ? '−' : '') + Math.abs(r); };
  const txt = (x, y, s, o = {}) => svgMath(f1(x), f1(y + (o.fs || 16) * 0.34), s, o);
  const arrowHead = (a, b, c, sz = 10) => { const d = nrm(sub2(b, a)), n = [-d[1], d[0]], h = [b[0] - d[0] * sz, b[1] - d[1] * sz]; return pg([b, [h[0] + n[0] * sz * .45, h[1] + n[1] * sz * .45], [h[0] - n[0] * sz * .45, h[1] - n[1] * sz * .45]], `fill="${c}"`); };
  const sty = (c, w, dash) => `fill="none" stroke="${c}" stroke-width="${w}"${dash ? ` stroke-dasharray="${typeof dash === 'string' && /\d/.test(dash) ? dash.replace(/,/g, ' ') : '7 5'}"` : ''} stroke-linejoin="round" stroke-linecap="round"`;

  const TK = (t, a, b) => { t = String(t || '').trim(); if (!t || t === '0') return []; if (t.includes(',')) return t.split(',').map(num).filter(isFinite); const st = num(t); const r = []; for (let x = Math.ceil(a / st - 1e-9) * st; x <= b + 1e-9; x += st) r.push(Math.round(x * 1e6) / 1e6); return r; };
  function wbGen(p) {
    const x0 = num(p.x0), x1 = num(p.x1), y0 = num(p.y0), y1 = num(p.y1), sx = num(p.sx) || 40, sy = num(p.sy) || sx, pad = 14, FS = num(p.fs) || 16;
    const axOn = p.ax === 'yes', pR = axOn ? 34 : pad, pT = axOn ? 26 : pad;
    const X = x => pad + (x - x0) * sx, Y = y => pT + (y1 - y) * sy, S = q => [X(q[0]), Y(q[1])];
    const W = (x1 - x0) * sx + pad + pR, H = (y1 - y0) * sy + pad + pT;
    let ax = { on: p.ax === 'yes', xa: x0, xb: x1, ya: y0, yb: y1 };
    const lines = String(p.src || '').split('\n').map((l, i) => ({ l: l.trim(), i })).filter(x => x.l && !x.l.startsWith('#'));
    lines.forEach(({ l }) => { const m = /^(axes|แกน)\s*:\s*(.*)$/i.exec(l.split('|')[0]); if (m) { const v = m[2].trim().split(/[\s,]+/).map(num); if (v.length >= 4 && v.every(isFinite)) ax = { on: true, xa: v[0], xb: v[1], ya: v[2], yb: v[3] }; } });
    const cid = 'wbc' + Math.random().toString(36).slice(2, 8);
    let bg = '', s = '', top = '';
    // ---------- กันตัวอักษรทับ: เก็บสิ่งกีดขวาง (เส้น จุด ข้อความตายตัว) แล้ววางป้ายในที่ว่าง ----------
    const OBP = [], OBB = [], OBD = [], LAB = [], TICKS = [], LBX = [];
    const tw = (str, fs) => { const t = String(str).replace(/[\^_{}$]/g, ''); let w = 0; for (const ch of t) { if (/[\u0E31\u0E34-\u0E3A\u0E47-\u0E4E]/.test(ch)) continue; w += /[\u0E00-\u0E7F]/.test(ch) ? .5 : /[A-Za-z]/.test(ch) ? .56 : /\s/.test(ch) ? .3 : .52; } return w * fs; };
    const bx = (x, y, str, fs, a) => { const w = tw(str, fs), h = fs * (/[\u0E00-\u0E7F]/.test(str) ? 1.3 : 1.1); const L = a === 'start' ? x : a === 'end' ? x - w : x - w / 2; return [L, y - h / 2, L + w, y + h / 2]; };
    const addSeg = (a, b) => { const n = Math.max(1, Math.ceil(Math.hypot(b[0] - a[0], b[1] - a[1]) / 4)); for (let i = 0; i <= n; i++) OBP.push([a[0] + (b[0] - a[0]) * i / n, a[1] + (b[1] - a[1]) * i / n]); };
    const addPoly = (Q, close) => { for (let i = 0; i < Q.length - 1; i++) addSeg(Q[i], Q[i + 1]); if (close && Q.length > 2) addSeg(Q[Q.length - 1], Q[0]); };
    const clipSeg = (a, b) => { let t0 = 0, t1 = 1; const dx = b[0] - a[0], dy = b[1] - a[1]; const ck = (pp, q) => { if (!pp) return q >= 0; const r = q / pp; if (pp < 0) { if (r > t1) return false; if (r > t0) t0 = r; } else { if (r < t0) return false; if (r < t1) t1 = r; } return true; }; if (!(ck(-dx, a[0]) && ck(dx, W - a[0]) && ck(-dy, a[1]) && ck(dy, H - a[1]))) return null; return [[a[0] + t0 * dx, a[1] + t0 * dy], [a[0] + t1 * dx, a[1] + t1 * dy]]; };
    // ---------- แกนและเส้นตาราง ----------
    if (ax.on) {
      const tx = String(p.tx).includes(',') ? 0 : num(p.tx) || 0, ty = String(p.ty).includes(',') ? 0 : num(p.ty) || 0, gx = num(p.gx) || tx, gy = num(p.gy) || ty, brk = p.yb === 'yes';
      const oy = brk ? ax.ya : Math.min(Math.max(0, ax.ya), ax.yb), ox = Math.min(Math.max(0, ax.xa), ax.xb);
      if (p.grid === 'yes') {
        if (gx) for (let x = Math.ceil(ax.xa / gx - 1e-9) * gx; x <= ax.xb + 1e-9; x += gx) bg += `<path d="M${f1(X(x))} ${f1(Y(ax.ya))}V${f1(Y(ax.yb))}" stroke="#dde1ec" stroke-width="1"/>`;
        if (gy) for (let y = Math.ceil(ax.ya / gy - 1e-9) * gy; y <= ax.yb + 1e-9; y += gy) bg += `<path d="M${f1(X(ax.xa))} ${f1(Y(y))}H${f1(X(ax.xb))}" stroke="#dde1ec" stroke-width="1"/>`;
      }
      const AC = '#333333', ex = 12;
      bg += `<path d="M${f1(X(ax.xa) - 4)} ${f1(Y(oy))}H${f1(X(ax.xb) + ex)}" stroke="${AC}" stroke-width="1.5"/>` + arrowHead([X(ax.xb), Y(oy)], [X(ax.xb) + ex + 6, Y(oy)], AC, 11);
      bg += `<path d="M${f1(X(ox))} ${f1(Y(ax.ya) + (brk ? 0 : 4))}V${f1(Y(ax.yb) - ex)}" stroke="${AC}" stroke-width="1.5"/>` + arrowHead([X(ox), Y(ax.yb)], [X(ox), Y(ax.yb) - ex - 6], AC, 11);
      if (brk) { const yy = Y(ax.ya) - 22, xx = X(ox); bg += `<path d="M${f1(xx)} ${f1(yy + 12)}l-6 -3 12 -6 -12 -6 6 -3" fill="#fff" stroke="${AC}" stroke-width="1.5"/>`; }
      const tf = FS * 1.05;
      addSeg([X(ax.xa) - 4, Y(oy)], [X(ax.xb) + ex, Y(oy)]); addSeg([X(ox), Y(ax.ya)], [X(ox), Y(ax.yb) - ex]);
      // ตัวเลขบนแกน: เก็บไว้ก่อน ยังไม่วาด — ตัวที่ชนกันเอง (เช่น −1 กับ 0 หรือเลขแกน y ที่ลงมาทับเลขแกน x) หรือถูกจุด/ป้ายทับ จะไม่วาด
      const tkHit = (A, B) => A[0] < B[2] - .5 && A[2] > B[0] + .5 && A[1] < B[3] - .5 && A[3] > B[1] + .5;
      const tkAdd = (svg, B) => { if (TICKS.some(t => tkHit(t.B, B))) return; TICKS.push({ svg, B }); OBB.push(B); };
      if (p.o !== 'no') tkAdd(svgMath(f1(X(ox) - 7), f1(Y(oy) + tf + 6), '0', { fs: tf, a: 'end', c: '#222' }), bx(X(ox) - 7, Y(oy) + tf * .66 + 6, '0', tf, 'end'));
      const byAbs = (u, w) => Math.abs(w) - Math.abs(u);   // เก็บตัวที่ไกลจุดกำเนิดก่อน ตัวที่ชิดจุดกำเนิดแล้วชนจึงถูกตัด
      TK(p.tx, ax.xa, ax.xb).filter(v => Math.abs(v - ox) >= 1e-9).map(v => { bg += `<path d="M${f1(X(v))} ${f1(Y(oy) - 4)}V${f1(Y(oy) + 4)}" stroke="${AC}" stroke-width="1.3"/>`; return v; }).sort(byAbs).forEach(v => tkAdd(svgMath(f1(X(v)), f1(Y(oy) + tf + 6), fmtN(v), { fs: tf, c: '#222' }), bx(X(v), Y(oy) + tf * .66 + 6, fmtN(v), tf, 'middle')));
      TK(p.ty, ax.ya, ax.yb).filter(v => Math.abs(v - oy) >= 1e-9).map(v => { bg += `<path d="M${f1(X(ox) - 4)} ${f1(Y(v))}H${f1(X(ox) + 4)}" stroke="${AC}" stroke-width="1.3"/>`; return v; }).sort(byAbs).forEach(v => tkAdd(svgMath(f1(X(ox) - 8), f1(Y(v) + tf * .35), fmtN(v), { fs: tf, a: 'end', c: '#222' }), bx(X(ox) - 8, Y(v), fmtN(v), tf, 'end')));
      bg += '\u0001TK\u0001';
      if (p.xl) OBB.push(bx(X(ax.xb) + ex + 4, Y(oy) + tf * .7 + 8, p.xl, tf * 1.1, 'middle')); if (p.yl) OBB.push(bx(X(ox) + 10, Y(ax.yb) - ex + 2 - tf * .35, p.yl, tf * 1.1, 'start'));
      if (p.xl) bg += svgMath(f1(X(ax.xb) + ex + 4), f1(Y(oy) + tf + 8), p.xl, { fs: tf * 1.1, c: '#222' });
      if (p.yl) bg += svgMath(f1(X(ox) + 10), f1(Y(ax.yb) - ex + 2), p.yl, { fs: tf * 1.1, a: 'start', c: '#222' });
      bg = `<defs><clipPath id="${cid}"><rect x="${f1(X(ax.xa) - 2)}" y="${f1(Y(ax.yb) - 2)}" width="${f1((ax.xb - ax.xa) * sx + 4)}" height="${f1((ax.yb - ax.ya) * sy + 4)}"/></clipPath></defs>` + bg;
    }
    const posOff = { n: [0, -1], s: [0, 1], e: [1, 0], w: [-1, 0], ne: [.75, -.75], nw: [-.75, -.75], se: [.75, .75], sw: [-.75, .75], c: [0, 0] };
    // ---------- คำสั่ง ----------
    lines.forEach(({ l: line, i: LI }) => {
      const bar = line.indexOf('|'); const main = bar < 0 ? line : line.slice(0, bar), o = opts(bar < 0 ? '' : line.slice(bar + 1));
      const m = /^([a-zก-๙]+)\s*:\s*(.*)$/i.exec(main.trim()); if (!m) return;
      const k = m[1].toLowerCase(), v = m[2]; const P = PTS(v), rest = after(v, (k === 'rect' || k === 'กล่อง') ? 2 : 1);
      const c = o.c, w = o.w ? num(o.w) : null, dash = o.flags.dash ? true : (o.dash || false), fs = o.size ? num(o.size) : FS;
      try {
        if (k === 'f' || k === 'กราฟ') {
          const [ex, a, b] = v.split(';').map(t => t.trim()); const fn = evalFunc(ex); const lo = a !== undefined && a !== '' ? num(a) : ax.xa, hi = b !== undefined && b !== '' ? num(b) : ax.xb;
          let d = '', pen = false; const n = 400;
          let prev = null; for (let i = 0; i <= n; i++) { const x = lo + (hi - lo) * i / n, y = fn(x); if (!isFinite(y) || Math.abs(y) > 1e6) { pen = false; prev = null; continue; } d += (pen ? 'L' : 'M') + f1(X(x)) + ' ' + f1(Y(y)); pen = true; const q = [X(x), Y(y)]; if (prev && q[1] > -50 && q[1] < H + 50 && (!ax.on || (y >= ax.ya && y <= ax.yb))) addSeg(prev, q); prev = q; }
          s += `<path d="${d}" ${sty(c || WC.or, w || 2.8, dash)}${ax.on ? ` clip-path="url(#${cid})"` : ''}/>`;
        } else if (k === 'line' || k === 'เส้นตรง') {
          if (P.length < 2) return; const [a, b] = P; const dx = b[0] - a[0], dy = b[1] - a[1]; const ext = 1e3; const A2 = [a[0] - dx * ext, a[1] - dy * ext], B2 = [a[0] + dx * ext, a[1] + dy * ext];
          const lo = o.from !== undefined ? num(o.from) : null, hi = o.to !== undefined ? num(o.to) : null;
          if (lo !== null && hi !== null && dx) { const yA = a[1] + dy / dx * (lo - a[0]), yB = a[1] + dy / dx * (hi - a[0]); s += pl([S([lo, yA]), S([hi, yB])], sty(c || WC.nv, w || 2.4, dash)); const cs = clipSeg(S([lo, yA]), S([hi, yB])); if (cs) addSeg(cs[0], cs[1]); }
          else { const cs = clipSeg(S(A2), S(B2)); if (cs) addSeg(cs[0], cs[1]); } if (!(lo !== null && hi !== null && dx)) s += pl([S(A2), S(B2)], sty(c || WC.nv, w || 2.4, dash) + (ax.on ? ` clip-path="url(#${cid})"` : ''));
        } else if (k === 'seg' || k === 'เส้น') {
          if (P.length < 2) return; const Q = P.map(S); const cc = c || WC.bk;
          s += pl(Q, sty(cc, w || 2.2, dash)); addPoly(Q); if (o.flags.arrow) s += arrowHead(Q[Q.length - 2], Q[Q.length - 1], cc, 11);
        } else if (k === 'poly' || k === 'รูปหลายเหลี่ยม') {
          if (P.length < 3) return; addPoly(P.map(S), true); s += pg(P.map(S), sty(c || WC.rd, w || 2.2, dash).replace('fill="none"', `fill="${col(o.fill, 'none')}"`));
        } else if (k === 'rect' || k === 'กล่อง') {
          if (P.length < 2) return; const [a, b] = P.map(S); const xL = Math.min(a[0], b[0]), yT = Math.min(a[1], b[1]), ww = Math.abs(b[0] - a[0]), hh = Math.abs(b[1] - a[1]); const r = o.r ? num(o.r) : 0; const cc = c || WC.rd;
          if (o.flags.shadow) s += `<rect x="${f1(xL + 4)}" y="${f1(yT + 4)}" width="${f1(ww)}" height="${f1(hh)}" rx="${r}" fill="#e3d3cf"/>`;
          s += `<rect x="${f1(xL)}" y="${f1(yT)}" width="${f1(ww)}" height="${f1(hh)}" rx="${r}" ${sty(cc, w || 2.2, dash).replace('fill="none"', `fill="${col(o.fill, 'none')}"`)}/>`;
          addPoly([[xL, yT], [xL + ww, yT], [xL + ww, yT + hh], [xL, yT + hh]], true);
          if (rest) { s += txt(xL + ww / 2, yT + hh / 2, rest, { fs, c: col(o.tc, cc) }); OBB.push(bx(xL + ww / 2, yT + hh / 2, rest, fs, 'middle')); }
        } else if (k === 'circle' || k === 'วงกลม') {
          if (!P.length) return; const r = num(rest.split(/\s+/)[0]) || 1; const q = S(P[0]);
          { const C = []; for (let i = 0; i <= 72; i++) C.push([q[0] + r * sx * Math.cos(i * Math.PI / 36), q[1] + r * sx * Math.sin(i * Math.PI / 36)]); addPoly(C); }
          s += `<circle cx="${f1(q[0])}" cy="${f1(q[1])}" r="${f1(r * sx)}" ${sty(c || WC.rd, w || 2.2, dash).replace('fill="none"', `fill="${col(o.fill, 'none')}"${o.op ? ` fill-opacity="${o.op}"` : ''}`)}/>`;
        } else if (k === 'arc' || k === 'ส่วนโค้ง') {
          if (!P.length) return; const [rx, ry, a0, a1] = rest.split(/\s+/).map(num); const q = P[0]; let d = '';
          for (let i = 0; i <= 120; i++) { const t = (a0 + (a1 - a0) * i / 120) * Math.PI / 180; d += (i ? 'L' : 'M') + f1(X(q[0] + rx * Math.cos(t))) + ' ' + f1(Y(q[1] + ry * Math.sin(t))); if (i) addSeg([X(q[0] + rx * Math.cos((a0 + (a1 - a0) * (i - 1) / 120) * Math.PI / 180)), Y(q[1] + ry * Math.sin((a0 + (a1 - a0) * (i - 1) / 120) * Math.PI / 180))], [X(q[0] + rx * Math.cos(t)), Y(q[1] + ry * Math.sin(t))]); }
          if (o.fill) d += 'Z';
          s += `<path d="${d}" ${sty(c || WC.or, w || 2.2, dash).replace('fill="none"', `fill="${col(o.fill, 'none')}"`)}/>`;
        } else if (k === 'curve' || k === 'เส้นโค้ง') {
          if (P.length < 3) return; const Q = P.map(S); const d = P.length >= 4 ? `M${Q[0].map(f1)}C${Q[1].map(f1)} ${Q[2].map(f1)} ${Q[3].map(f1)}` : `M${Q[0].map(f1)}Q${Q[1].map(f1)} ${Q[2].map(f1)}`;
          { const B = t => Q.length >= 4 ? [0, 1].map(j => (1 - t) ** 3 * Q[0][j] + 3 * (1 - t) ** 2 * t * Q[1][j] + 3 * (1 - t) * t * t * Q[2][j] + t ** 3 * Q[3][j]) : [0, 1].map(j => (1 - t) ** 2 * Q[0][j] + 2 * (1 - t) * t * Q[1][j] + t * t * Q[2][j]); const C = []; for (let i = 0; i <= 40; i++) C.push(B(i / 40)); addPoly(C); }
          s += `<path d="${d}" ${sty(c || WC.rd, w || 2.2, dash)}/>`;
        } else if (k === 'smooth' || k === 'โค้งผ่านจุด') {
          if (P.length < 2) return; const Q = P.map(S); let d = `M${Q[0].map(f1)}`;
          for (let i = 0; i < Q.length - 1; i++) { const p0 = Q[i - 1] || Q[i], p1 = Q[i], p2 = Q[i + 1], p3 = Q[i + 2] || p2; const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6], c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6]; d += `C${c1.map(f1)} ${c2.map(f1)} ${p2.map(f1)}`; }
          addPoly(Q);
          s += `<path d="${d}" ${sty(c || WC.nv, w || 2.2, dash)}/>`;
        } else if (k === 'pt' || k === 'จุด') {
          if (!P.length) return; const q = S(P[0]); const cc = c || WC.or, r = o.r ? num(o.r) : 5.5;
          top += o.flags.open ? `<circle cx="${f1(q[0])}" cy="${f1(q[1])}" r="${r}" fill="#fff" stroke="${cc}" stroke-width="2"/>` : `<circle cx="${f1(q[0])}" cy="${f1(q[1])}" r="${r}" fill="${cc}"/>`;
          OBD.push([q[0], q[1], r]);
          if (rest) LAB.push({ kind: 'pt', q, r, pos: o.pos || 'ne', str: rest, fs, c: col(o.tc, cc === WC.or || cc === WC.nv ? WC.bk : cc), LI });
        } else if (k === 'node' || k === 'ปม') {
          if (!P.length) return; const q = S(P[0]); const cc = c || WC.bk, r = o.r ? num(o.r) : 16;
          top += `<circle cx="${f1(q[0])}" cy="${f1(q[1])}" r="${r}" fill="${col(o.fill, '#fff')}" stroke="${cc}" stroke-width="2"/>`;
          OBD.push([q[0], q[1], r]); if (rest) top += txt(q[0], q[1], rest, { fs, c: col(o.tc, cc) });
        } else if (k === 'text' || k === 'ข้อความ') {
          if (!P.length) return; const q = S(P[0]); LAB.push({ kind: 'text', q, str: rest, fs, c: c || WC.bk, a: o.anchor || 'middle', b: !!o.flags.bold, pin: !!o.flags.pin, LI });
        } else if (k === 'person' || k === 'คน') {
          if (!P.length) return; const q = S(P[0]); const z = (o.size ? num(o.size) : 30) / 24; OBB.push([q[0] - 12 * z, q[1] - 12 * z, q[0] + 12 * z, q[1] + 12 * z]);
          top += `<g transform="translate(${f1(q[0] - 12 * z)} ${f1(q[1] - 12 * z)}) scale(${z.toFixed(3)})"><circle cx="12" cy="6.5" r="4.6" fill="${c || WC.rd}"/><path d="M4 23v-5.5c0-3.6 3.4-6.3 8-6.3s8 2.7 8 6.3V23z" fill="${c || WC.rd}"/></g>`;
        } else if (k === 'tree' || k === 'แผนภาพต้นไม้') {
          s += treeDraw(v, o, X, Y, sx, sy, FS);
        }
      } catch (e) { }
    });
    // ---------- วางป้าย/ข้อความไม่ให้ทับกัน ----------
    const ov = [];
    const hits = B => { let n = 0; const e = 1; if (B[0] < 0 || B[1] < 0 || B[2] > W || B[3] > H) n += 3;
      for (const b of OBB) if (B[0] < b[2] - e && B[2] > b[0] + e && B[1] < b[3] - e && B[3] > b[1] + e) n += 2;
      for (const d of OBD) { const cx = Math.max(B[0], Math.min(d[0], B[2])), cy = Math.max(B[1], Math.min(d[1], B[3])); if (Math.hypot(cx - d[0], cy - d[1]) < d[2] + 1.5) n += 2; }
      for (const q of OBP) if (q[0] > B[0] + e && q[0] < B[2] - e && q[1] > B[1] + e && q[1] < B[3] - e) { n++; if (n > 40) break; }
      return n; };
    LAB.forEach(L => {
      let cands = [];
      if (L.kind === 'pt') { const order = [L.pos, 'ne', 'nw', 'se', 'sw', 'n', 's', 'e', 'w'].filter((v, i, a) => a.indexOf(v) === i);
        [1, 1.7].forEach(m => order.forEach(ps => { const po = posOff[ps] || posOff.ne; const dd = (L.r + 7) * m; const a = po[0] > .1 ? 'start' : po[0] < -.1 ? 'end' : 'middle'; cands.push({ x: L.q[0] + po[0] * dd, y: L.q[1] + po[1] * dd * (po[0] ? 1 : 1.25), a }); })); }
      else if (L.pin) cands.push({ x: L.q[0], y: L.q[1], a: L.a });   // pin = วางตรงพิกัดที่กำหนดเสมอ ไม่ขยับหลบ
      else { const k = L.fs * .55; [[0, 0], [0, -1], [0, 1], [1, 0], [-1, 0], [1, -1], [-1, -1], [1, 1], [-1, 1], [0, -2], [0, 2], [2, 0], [-2, 0]].forEach(([i, j]) => cands.push({ x: L.q[0] + i * k * 1.4, y: L.q[1] + j * k, a: L.a })); }
      let best = null, bn = 1e9;
      for (const c of cands) { const B = bx(c.x, c.y, L.str, L.fs, c.a); const n = hits(B); if (n < bn) { bn = n; best = { c, B }; } if (n === 0) break; }
      if (bn > 0 && !L.pin) ov.push(L.LI);
      // ป้ายล้นขอบรูป (ถูกตัดขาด) → เลื่อนกลับเข้ามาในกรอบ
      { const B = best.B; let dx = 0, dy = 0; if (B[2] > W - 2) dx = W - 2 - B[2]; if (B[0] + dx < 2) dx = 2 - B[0]; if (B[3] > H - 1) dy = H - 1 - B[3]; if (B[1] + dy < 1) dy = 1 - B[1]; if (dx || dy) { best = { c: { x: best.c.x + dx, y: best.c.y + dy, a: best.c.a }, B: [B[0] + dx, B[1] + dy, B[2] + dx, B[3] + dy] }; } }
      OBB.push(best.B); LBX.push(best.B); top += txt(best.c.x, best.c.y, L.str, { fs: L.fs, c: L.c, a: best.c.a, b: L.b });
    });
    window.__wbOv = ov;
    // ตัวเลขบนแกนที่ถูกจุดหรือป้ายข้อความทับ → ไม่วาด
    const tkOK = t => !LBX.some(B => t.B[0] < B[2] + 4 && t.B[2] > B[0] - 4 && t.B[1] < B[3] + 1.5 && t.B[3] > B[1] - 1.5) && !OBD.some(d => { const cx = Math.max(t.B[0], Math.min(d[0], t.B[2])), cy = Math.max(t.B[1], Math.min(d[1], t.B[3])); return Math.hypot(cx - d[0], cy - d[1]) < d[2] + 1; });
    bg = bg.replace('\u0001TK\u0001', TICKS.filter(tkOK).map(t => t.svg).join(''));
    return svgW(W, H, bg + s + top);
  }

  /* แผนภาพต้นไม้: tree: ป้ายระดับ1 ; ป้ายระดับ2 ; ... | at=(x,y) w=.. h=.. mode=edge|node cols=rd,or,nv out=ผล1;ผล2;... outbox */
  function treeDraw(v, o, X, Y, sx, sy, FS) {
    const L = v.split(';').map(t => t.split(',').map(x => x.trim()).filter(Boolean)).filter(l => l.length);
    if (!L.length) return '';
    const at = PTS(o.at || '(0,0)')[0] || [0, 0], w = num(o.w || 10), h = num(o.h || 8), mode = o.mode || 'edge';
    const cols = String(o.cols || 'rd,or,nv').split(',').map(c => col(c, WC.rd));
    const outs = o.out ? o.out.split(';') : null; const N = L.reduce((a, l) => a * l.length, 1);
    const cw = w / (L.length + (outs || o.flags.outbox ? 1 : 0)); const rowH = h / N;
    let s = '', top = ''; const leaves = [];
    const root = [X(at[0]), Y(at[1] - h / 2)];
    top += `<circle cx="${f1(root[0])}" cy="${f1(root[1])}" r="9" fill="#fff" stroke="${WC.bk}" stroke-width="2"/>`;
    const nr = mode === 'node' ? 14 : 6.5;
    function rec(lev, i0, i1, px, pr) {
      if (lev === L.length) { leaves.push(px); return; }
      const n = L[lev].length, span = (i1 - i0) / n, cc = cols[lev % cols.length];
      L[lev].forEach((lab, j) => {
        const a = i0 + span * j, b = a + span; const q = [X(at[0] + cw * (lev + 1)), Y(at[1] - (a + b) / 2 * rowH)];
        const d = nrm(sub2(q, px)); const p1 = [px[0] + d[0] * pr, px[1] + d[1] * pr], p2 = [q[0] - d[0] * (nr + 2), q[1] - d[1] * (nr + 2)];
        s += pl([p1, p2], sty(cc, 2.4));
        if (mode === 'node') { top += `<circle cx="${f1(q[0])}" cy="${f1(q[1])}" r="${nr}" fill="${mixHex(cc, '#ffffff', .82)}" stroke="${cc}" stroke-width="1.8"/>` + txt(q[0], q[1], lab, { fs: FS * .95, c: cc }); }
        else {
          top += `<circle cx="${f1(q[0])}" cy="${f1(q[1])}" r="${nr}" fill="${cc}"/>`;
          const mm = mid(p1, p2), up = j < n / 2; top += txt(mm[0] - (up ? 4 : 4), mm[1] + (up ? -15 : 15), lab, { fs: FS * .95, c: cc });
        }
        rec(lev + 1, a, b, q, nr + 2);
      });
    }
    rec(0, 0, N, root, 10);
    leaves.forEach((q, i) => {
      if (o.flags.outbox) { const x = q[0] + nr + 24; s += pl([[q[0] + nr + 2, q[1]], [x, q[1]]], sty('#b9b9b9', 1.2, '2 3')) + `<rect x="${f1(x)}" y="${f1(q[1] - rowH * sy * .32)}" width="${f1(cw * sx * .78)}" height="${f1(rowH * sy * .64)}" rx="3" fill="none" stroke="#b9b9b9" stroke-width="1.3" stroke-dasharray="5 4"/>`; }
      if (outs && outs[i] !== undefined) top += txt(q[0] + nr + 18, q[1], outs[i].trim(), { fs: FS * 1.25, c: WC.bk, a: 'start' });
    });
    return s + top;
  }

  /* ---------- ชุดค่าตั้งต้นของรูป ---------- */
  const P = (src, d) => [['src', 'คำสั่งวาด (บรรทัดละ 1 อย่าง)', src, 'ta'],
    ['x0', 'กรอบ x น้อยสุด', d.x0], ['x1', 'กรอบ x มากสุด', d.x1], ['y0', 'กรอบ y น้อยสุด', d.y0], ['y1', 'กรอบ y มากสุด', d.y1],
    ['sx', 'ขนาด 1 หน่วยแกน x (px)', d.sx], ['sy', 'ขนาด 1 หน่วยแกน y (px)', d.sy || d.sx],
    ['ax', 'แกน x–y', d.ax || 'no', ['yes:แสดง', 'no:ไม่แสดง']], ['tx', 'ระยะตัวเลขแกน x (0 = ไม่แสดง)', d.tx || '1'], ['ty', 'ระยะตัวเลขแกน y (0 = ไม่แสดง)', d.ty || '1'],
    ['grid', 'เส้นตาราง', d.grid || 'yes', ['yes:แสดง', 'no:ไม่แสดง']], ['gx', 'ระยะเส้นตารางแนวตั้ง (เว้น = ตามตัวเลข)', d.gx || ''], ['gy', 'ระยะเส้นตารางแนวนอน (เว้น = ตามตัวเลข)', d.gy || ''],
    ['xl', 'ชื่อแกนนอน', d.xl === undefined ? 'x' : d.xl], ['yl', 'ชื่อแกนตั้ง', d.yl === undefined ? 'y' : d.yl], ['yb', 'แกน y เริ่มไม่ใช่ 0 (หยัก)', d.yb || 'no', ['yes:ใช่', 'no:ไม่ใช่']],
    ['fs', 'ขนาดตัวอักษร', d.fs || '16']];
  window.WBFIG_P = P; window.wbGen = wbGen;
    const HELP = 'คำสั่งบรรทัดละ 1 อย่าง ตัวเลือกต่อท้ายหลัง | เช่น สี (or ส้ม · nv น้ำเงิน · rd แดง · lo ส้มอ่อน · gr เทา · bk ดำ · pu ม่วง · gn เขียว หรือ #รหัสสี) dash = เส้นประ w=ความหนา<br>' +
      '<code>f: x^2 ; -1 ; 2</code> กราฟ (ช่วง x ใส่หรือไม่ก็ได้) · <code>pt: (2,3) P(2,3) | pos=se open</code> จุด · <code>line: (0,0) (1,2) | dash</code> เส้นตรงยาวตลอด · <code>seg: (0,0) (1,2) (3,1) | arrow</code> เส้นต่อจุด<br>' +
      '<code>poly: (0,0) (2,0) (1,2) | fill=pk</code> · <code>rect: (0,0) (2,1) ข้อความ | r=6 fill=bl</code> · <code>circle: (0,0) 2 | fill=pk</code> · <code>arc: (0,0) 3 1 0 180 | dash</code> (rx ry องศาเริ่ม องศาจบ)<br>' +
      '<code>curve: (0,0) (2,3) (4,0)</code> เส้นโค้ง · <code>smooth: (0,0) (1,1) (2,0)</code> โค้งผ่านจุด · <code>node: (0,0) A | r=16</code> วงกลมมีชื่อ · <code>text: (1,2) ข้อความ $x^2$ | size=18 anchor=start</code> · <code>person: (1,1) | rd size=30</code><br>' +
      '<code>tree: ใส่,ไม่ใส่ ; ใส่,ไม่ใส่ | at=(0,8) w=10 h=8 mode=edge cols=rd,or,nv out=ผล1;ผล2;…</code> แผนภาพต้นไม้ (mode=node = ป้ายในวงกลม, outbox = กล่องว่าง) · <code>axes: -2 3 -1 5</code> กำหนดช่วงแกน';
  window.WB_LIB = {};
  window.wbReg = function (items) { items.forEach(([k, name, src, d]) => { LIB[k] = { name, p: P(src, d), gen: wbGen }; WB_LIB[k] = 1; if (typeof KIND_HELP === 'object') KIND_HELP[k] = HELP; }); }; // รูปในเล่ม: ลงทะเบียนให้เปิดไฟล์เดิมและแก้ไขได้ แต่ไม่แสดงในเมนูแทรก
  window.wbAdd = function (cat, items) { // items: [kind, ชื่อ, src, frame]
    const kinds = items.map(([k, name, src, d]) => { LIB[k] = { name, p: P(src, d), gen: wbGen }; WB_LIB[k] = 1; if (typeof KIND_HELP === 'object') KIND_HELP[k] = HELP; return k; });
    // วางรูปไว้ในหมวดของบทนั้น ๆ ในคลังรูป (ไม่สร้างหมวด "แบบฝึกทักษะ" แยก) — ชื่อหมวดที่ส่งมา เช่น "แบบฝึกทักษะ: ม.2 บทที่ 5 การแยกตัวประกอบ"
    const nm = String(cat).replace(/^แบบฝึกทักษะ\s*:\s*/, ''), grade = +((/ม\.\s*(\d)/.exec(nm) || [])[1] || 0);
    let ch = nm.replace(/ม\.\s*\d\s*/, '').replace(/บทที่\s*\d+\s*/, '').replace(/\(.*?\)/g, '').trim();
    const ALIAS = { 'หลักการนับ': 'หลักการนับ', 'หลักการนับเบื้องต้น': 'หลักการนับ', 'แคลคูลัส': 'แคลคูลัส', 'แคลคูลัสเบื้องต้น': 'แคลคูลัส', 'การแยกตัวประกอบ': 'การแยกตัวประกอบของพหุนาม', 'ลำดับและอนุกรม': 'ลำดับและอนุกรม', 'ความน่าจะเป็น': 'ความน่าจะเป็น', 'วาดเอง': '★ ใช้บ่อย' };
    ch = ALIAS[ch] || ch;
    let i = LIBCAT.findIndex(c => c[1] && c[0] === ch); if (i < 0) i = LIBCAT.findIndex(c => c[1] && c[0].replace(/\s*\(.*$/, '') === ch);
    if (i < 0) { // ยังไม่มีหมวดของบทนี้ → สร้างหมวดบทใต้หัวระดับชั้น
      const head = grade && grade <= 3 ? '— ม.ต้น —' : grade ? `— ม.${grade} —` : null; let h = head ? LIBCAT.findIndex(c => c[0] === head) : -1;
      if (head && h < 0) { const at = grade <= 3 ? LIBCAT.findIndex(c => /^— ม\.4/.test(c[0])) : -1; h = at < 0 ? LIBCAT.length : at; LIBCAT.splice(h, 0, [head]); }
      let j = h < 0 ? LIBCAT.length : h + 1; while (h >= 0 && LIBCAT[j] && LIBCAT[j][1]) j++; LIBCAT.splice(j, 0, [ch, []]); i = j;
    }
    LIBCAT[i][1] = LIBCAT[i][1].concat(kinds.filter(k => !LIBCAT[i][1].includes(k)));
  };
  wbAdd('แบบฝึกทักษะ: วาดเอง', [['wbfree', 'วาดเอง: จุด เส้น กล่อง ข้อความ กราฟ (ไม่ต้องพิมพ์โค้ด)', 'f: x^2/2 | or\npt: (1,0.5) P(1, 1/2) | pos=se', { x0: '-3', x1: '3', y0: '-1', y1: '4', sx: '50', ax: 'yes' }]]);
})();
// คำบรรยายใต้รูปวาด (b.cap) — ใช้เมื่อรูปมีคำบรรยาย เช่น รูปจากแบบฝึกทักษะ
(function () {
  const st = document.createElement('style'); st.textContent = '.figcap{font-size:.92em;color:#5b4f47;text-align:center;margin:2px 0 6px}'; document.head.appendChild(st);
  const _bh = blockHTML;
  blockHTML = function (b) { const h = _bh.apply(this, arguments); return (b && b.t === 'figure' && b.cap !== undefined) ? h + '<div class="figcap" contenteditable="true" data-f="cap" data-ph="คำบรรยายรูป (เว้นว่างได้)"></div>' : h; };
})();

/* ===================== รูปจากแบบฝึกทักษะ (สร้างใหม่ด้วยตัววาดสไตล์แบบฝึก แก้ไขได้) ===================== */
wbAdd("แบบฝึกทักษะ: บทที่ 11 หลักการนับ", [["wb11_routes", "ทางถนน–ทางเรือ บ้านไปโรงเรียน", "# ทางถนน (เส้นโค้งสีแดง)\ncurve: (2,0.15) (8,5.8) (13,0.15) | rd\ncurve: (2,0.1) (8,4.4) (13,0.1) | rd\ncurve: (2,0.05) (8,3.0) (13,0.05) | rd\ntext: (8,3.3) r_1 | rd\ntext: (8,2.6) r_2 | rd\ntext: (8,1.9) r_3 | rd\ntext: (3.4,3.4) ทางถนน | rd bold\n# ทางเรือ (เส้นคลื่นสีน้ำเงิน)\nsmooth: (2,-0.05) (3,-0.9) (4.3,-1.3) (5.3,-0.8) (6.4,-1.45) (7.6,-0.9) (8.7,-1.5) (9.8,-0.9) (11,-1.35) (12,-0.8) (13,-0.05) | nv\nsmooth: (2,-0.1) (3,-1.6) (4.3,-2.3) (5.3,-1.8) (6.4,-2.5) (7.6,-1.9) (8.7,-2.6) (9.8,-1.9) (11,-2.3) (12,-1.6) (13,-0.1) | nv\ntext: (8.7,-0.85) c_1 | nv\ntext: (8.7,-1.95) c_2 | nv\ntext: (4,-3.3) ทางเรือ | nv bold\n# สถานที่\nrect: (-0.4,-0.55) (2,0.55) บ้าน | bk r=6 fill=wh w=2\nrect: (13,-0.55) (15.7,0.55) โรงเรียน | bk r=6 fill=wh w=2", {"x0": "-0.6", "x1": "15.9", "y0": "-3.8", "y1": "3.8", "sx": "32", "fs": "19"}], ["wb11_venn", "แผนภาพเวนน์ สมาชิกชมรม (รูปคน)", "rect: (0,0) (10,7) | bk w=2.4\ntext: (0.45,6.45) U | bk size=20\ncircle: (3.6,3.0) 2.55 | rd fill=pk op=0.75\ncircle: (6.4,3.0) 2.55 | nv fill=bl op=0.75\ntext: (2.5,6.0) ชมรมกีฬา | rd bold size=19\ntext: (7.6,6.0) ชมรมดนตรี | nv bold size=19\n# คนในชมรมกีฬาอย่างเดียว\nperson: (2.3,4.0) | rd\nperson: (2.0,2.1) | rd\nperson: (2.9,2.5) | rd\n# คนที่อยู่ทั้งสองชมรม\nperson: (5.0,3.8) | pu\nperson: (5.0,2.1) | pu\n# คนในชมรมดนตรีอย่างเดียว\nperson: (7.4,4.0) | nv\nperson: (7.8,2.4) | nv", {"x0": "-0.1", "x1": "10.1", "y0": "-0.1", "y1": "7.1", "sx": "40", "fs": "17"}], ["wb11_shirt", "แผนภาพต้นไม้ เสื้อ–กางเกง", "text: (4,9.7) เสื้อ | rd bold\ntext: (8,9.7) กางเกง | nv bold\ntext: (10.6,9.7) ชุดที่ได้ | bk bold\ntree: s_1,s_2,s_3 ; p_1,p_2 | at=(0,9) w=12 h=9 mode=node cols=rd,nv outbox", {"x0": "-0.5", "x1": "12.4", "y0": "-0.2", "y1": "10.3", "sx": "40", "fs": "16"}], ["wb11_subset", "แผนภาพต้นไม้ การสร้างสับเซต", "text: (3.5,9.7) ตัดสินใจเรื่อง a | rd bold size=15\ntext: (7,9.7) ตัดสินใจเรื่อง b | or bold size=15\ntext: (10.5,9.7) ตัดสินใจเรื่อง c | rd bold size=15\ntext: (14.4,9.7) สับเซตที่ได้ | bk bold\ntree: ใส่,ไม่ใส่ ; ใส่,ไม่ใส่ ; ใส่,ไม่ใส่ | at=(0,9) w=14 h=9 mode=edge cols=rd,or,nv out={a,b,c};{a,b};{a,c};{a};{b,c};{b};{c};∅", {"x0": "-0.4", "x1": "15.8", "y0": "-0.2", "y1": "10.3", "sx": "40", "fs": "17"}], ["wb11_cards", "บัตรตัวเลข 0–4 และหลักของจำนวน", "text: (5.2,3.3) บัตรตัวเลข | bk\nrect: (0,0) (1.7,2.2) 0 | rd r=8 shadow fill=wh\nrect: (2.2,0) (3.9,2.2) 1 | rd r=8 shadow fill=wh\nrect: (4.4,0) (6.1,2.2) 2 | rd r=8 shadow fill=wh\nrect: (6.6,0) (8.3,2.2) 3 | rd r=8 shadow fill=wh\nrect: (8.8,0) (10.5,2.2) 4 | rd r=8 shadow fill=wh\nseg: (11.1,1.1) (12.3,1.1) | gr arrow w=1.6\ntext: (14.0,2.75) หลักร้อย | bk\ntext: (17.1,2.75) หลักสิบ | bk\ntext: (20.2,2.75) หลักหน่วย | bk\nrect: (12.8,0.1) (15.2,2.0) | rd r=8 fill=pk\nrect: (15.9,0.1) (18.3,2.0) | rd r=8 fill=lr\nrect: (19.0,0.1) (21.4,2.0) | rd r=8 fill=pk", {"x0": "-0.3", "x1": "21.7", "y0": "-0.4", "y1": "3.9", "sx": "36", "fs": "21"}], ["wb11_cities", "ถนนระหว่างเมือง A, B, C", "# A ไป B: 2 สาย · B ไป C: 3 สาย (สีแดง)\ncurve: (0,0) (2.4,3.7) (6.5,4.2) | rd\ncurve: (0,0) (3.6,2.9) (6.5,4.2) | rd\ncurve: (6.5,4.2) (10.8,3.8) (13,0) | rd\ncurve: (6.5,4.2) (10.2,3.2) (13,0) | rd\ncurve: (6.5,4.2) (9.6,2.5) (13,0) | rd\n# A ไป C โดยไม่ผ่าน B: 2 สาย (สีน้ำเงิน)\ncurve: (0,0) (6.5,-2.6) (13,0) | nv\ncurve: (0,0) (6.5,-4.4) (13,0) | nv\nnode: (0,0) A | r=18\nnode: (6.5,4.2) B | r=18\nnode: (13,0) C | r=18\ntext: (6.5,-3.4) ถนนระหว่างเมือง A, B และ C | #444444 size=20", {"x0": "-0.8", "x1": "13.8", "y0": "-3.9", "y1": "5", "sx": "34", "fs": "19"}], ["wb11_flag3", "ธงแถบแนวตั้ง 3 แถบ", "seg: (-0.08,1.75) (-0.08,-0.65) | gr w=7\nrect: (0,0) (1.1,1.6) | rd w=3\nrect: (1.1,0) (2.2,1.6) | rd w=3\nrect: (2.2,0) (3.3,1.6) | rd w=3\ntext: (0.55,-0.33) แถบที่ 1 | bk\ntext: (1.65,-0.33) แถบที่ 2 | bk\ntext: (2.75,-0.33) แถบที่ 3 | bk", {"x0": "-0.2", "x1": "3.4", "y0": "-0.7", "y1": "1.8", "sx": "100", "fs": "22"}], ["wb11_flag4", "ธงแถบแนวนอน 4 แถบ", "seg: (-0.08,1.75) (-0.08,-0.15) | gr w=7\nrect: (0,1.275) (2.2,1.7) | rd w=3\nrect: (0,0.85) (2.2,1.275) | rd w=3\nrect: (0,0.425) (2.2,0.85) | rd w=3\nrect: (0,0) (2.2,0.425) | rd w=3\ntext: (2.35,1.49) แถบที่ 1 | bk anchor=start\ntext: (2.35,1.06) แถบที่ 2 | bk anchor=start\ntext: (2.35,0.64) แถบที่ 3 | bk anchor=start\ntext: (2.35,0.21) แถบที่ 4 | bk anchor=start", {"x0": "-0.2", "x1": "3.15", "y0": "-0.2", "y1": "1.8", "sx": "120", "fs": "22"}], ["wb11_tri3", "สามเหลี่ยมด้านเท่าแบ่ง 9 รูป", "poly: (0,0.000) (1,0.000) (0.5,0.866) | rd fill=lr w=2.6\npoly: (1,0.000) (2,0.000) (1.5,0.866) | rd fill=lr w=2.6\npoly: (2,0.000) (3,0.000) (2.5,0.866) | rd fill=lr w=2.6\npoly: (0.5,0.866) (1.5,0.866) (1,1.732) | rd fill=lr w=2.6\npoly: (1.5,0.866) (2.5,0.866) (2,1.732) | rd fill=lr w=2.6\npoly: (1,1.732) (2,1.732) (1.5,2.598) | rd fill=lr w=2.6\npoly: (0,0) (3,0) (1.5,2.598) | rd w=2.8", {"x0": "-0.05", "x1": "3.05", "y0": "-0.05", "y1": "2.65", "sx": "120", "fs": "18"}], ["wb11_tri4", "สามเหลี่ยมด้านเท่าแบ่ง 16 รูป", "poly: (0,0.000) (1,0.000) (0.5,0.866) | rd fill=lr w=2.6\npoly: (1,0.000) (2,0.000) (1.5,0.866) | rd fill=lr w=2.6\npoly: (2,0.000) (3,0.000) (2.5,0.866) | rd fill=lr w=2.6\npoly: (3,0.000) (4,0.000) (3.5,0.866) | rd fill=lr w=2.6\npoly: (0.5,0.866) (1.5,0.866) (1,1.732) | rd fill=lr w=2.6\npoly: (1.5,0.866) (2.5,0.866) (2,1.732) | rd fill=lr w=2.6\npoly: (2.5,0.866) (3.5,0.866) (3,1.732) | rd fill=lr w=2.6\npoly: (1,1.732) (2,1.732) (1.5,2.598) | rd fill=lr w=2.6\npoly: (2,1.732) (3,1.732) (2.5,2.598) | rd fill=lr w=2.6\npoly: (1.5,2.598) (2.5,2.598) (2,3.464) | rd fill=lr w=2.6\npoly: (0,0) (4,0) (2,3.464) | rd w=2.8", {"x0": "-0.05", "x1": "4.05", "y0": "-0.05", "y1": "3.51", "sx": "90", "fs": "18"}], ["wb11_map", "แผนที่ 4 เขต A, B, C, D", "rect: (0,0) (2,3) A | rd fill=lr w=2.8\nrect: (2,1.5) (4.5,3) B | rd fill=bl w=2.8\nrect: (2,0) (4.5,1.5) C | rd fill=lr w=2.8\nrect: (4.5,0) (6.5,3) D | rd fill=bl w=2.8", {"x0": "-0.1", "x1": "6.6", "y0": "-0.1", "y1": "3.1", "sx": "70", "fs": "26"}]]);
wbAdd("แบบฝึกทักษะ: บทที่ 14 แคลคูลัส", [["wb14_secant", "เส้นตัดโค้งเข้าใกล้เส้นสัมผัส (y = x²)", "axes: -1.15 2.45 -0.35 5.1\nf: x^2 ; -1.1 ; 2.3 | or\nline: (1,1) (2,4) | or w=1.8 from=0.62 to=2.28\nline: (1,1) (1.5,2.25) | lo w=1.8 from=0.45 to=2.42\nline: (1,1) (0,0) | #d9a066 w=1.6 from=-0.45 to=2.5\nline: (0,-1) (1,1) | nv dash from=0.35 to=2.4\npt: (2,4) Q_1 | lo pos=w tc=or\npt: (1.5,2.25) Q_2 | lo pos=w tc=or\npt: (0,0) Q_3 | lo pos=nw tc=or\npt: (1,1) P(1, 1) | or pos=se\ntext: (-0.62,1.15) y = x^2 | or size=18", {"x0": "-1.25", "x1": "2.75", "y0": "-0.45", "y1": "5.3", "sx": "88", "sy": "54", "tx": "1,2", "ty": "1,4", "grid": "no", "ax": "yes"}], ["wb14_tangents", "เส้นสัมผัส y = x² ที่ x = −2 ถึง 3", "f: x^2 ; -2.55 ; 3.37 | or\nseg: (-2.4,5.6) (-1.6,2.4) | nv w=2.6\nseg: (-1.4,1.8) (-0.6,0.2) | nv w=2.6\nseg: (-0.4,0) (0.4,0) | nv w=2.6\nseg: (0.6,0.2) (1.4,1.8) | nv w=2.6\nseg: (1.6,2.4) (2.4,5.6) | nv w=2.6\nseg: (2.65,6.9) (3.35,11.1) | nv w=2.6\npt: (-2,4) | or\npt: (-1,1) | or\npt: (0,0) | or\npt: (1,1) | or\npt: (2,4) | or\npt: (3,9) | or", {"x0": "-2.9", "x1": "3.9", "y0": "-0.7", "y1": "11.6", "sx": "52", "sy": "27", "tx": "1", "ty": "2", "ax": "yes", "grid": "no"}], ["wb14_grid", "ตารางพิกัดเปล่า (แกน a, m)", "axes: -3.3 4.4 -7 9", {"x0": "-3.6", "x1": "4.9", "y0": "-7.4", "y1": "9.6", "sx": "36", "sy": "18", "tx": "1", "ty": "2", "gx": "1", "gy": "1", "xl": "a", "yl": "m", "ax": "yes", "grid": "yes"}], ["wb14_absx", "y = |x| และการขยายรอบจุด O", "axes: -2.2 2.35 -0.15 2.5\nseg: (-2.1,2.1) (0,0) | nv w=3\nseg: (0,0) (2.1,2.1) | or w=3\npt: (-1.9,1.9) | nv\npt: (-1.3,1.3) | nv\npt: (-0.6,0.6) | nv\npt: (0.6,0.6) | or\npt: (1.3,1.3) | or\npt: (1.9,1.9) | or\npt: (0,0) | bk r=7\ntext: (-1.4,2.5) ความชัน −1 | nv\ntext: (1.35,2.5) ความชัน 1 | or\nseg: (0.4,0.25) (3.15,0.42) | gr arrow w=1.5\nrect: (3.35,-0.22) (6.6,2.3) | gr fill=cr w=1.6\nseg: (3.35,1.65) (4.97,0.4) | nv w=3\nseg: (4.97,0.4) (6.6,1.7) | or w=3\npt: (4.97,0.4) | bk r=7\ntext: (4.97,-0.6) ขยายรอบ O 10 เท่า: ยังเป็นมุม | bk", {"x0": "-2.45", "x1": "6.75", "y0": "-0.85", "y1": "2.75", "sx": "70", "sy": "70", "tx": "1", "ty": "1", "grid": "no", "ax": "yes", "fs": "19"}], ["wb14_tangentP", "กราฟ y = f(x) และเส้นสัมผัสที่ P(2,3)", "f: x^2/2+1 ; -1.6 ; 4.8 | or w=3\nline: (0,-1) (2,3) | nv dash from=-0.6 to=4.7\npt: (2,3) P(2, 3) | or pos=se\ntext: (2.6,7.6) y = f(x) | or size=19", {"x0": "-1.75", "x1": "5.6", "y0": "-2.6", "y1": "9.1", "sx": "54", "sy": "23", "tx": "1", "ty": "2", "gy": "1", "ax": "yes", "grid": "yes"}], ["wb14_temp", "อุณหภูมิ T(t) แกนตั้งเริ่มที่ 25", "axes: 0 5.35 24 35.3\nf: 30+4x-x^2 ; 0 ; 5 | or w=3.4\npt: (0,30) | or r=6.5\npt: (5,25) | or r=6.5\ntext: (4.25,31.3) T(t) | or size=24", {"x0": "-0.7", "x1": "5.8", "y0": "23.4", "y1": "35.9", "sx": "62", "sy": "22", "tx": "1", "ty": "2", "grid": "no", "ax": "yes", "yb": "yes", "xl": "", "yl": "", "fs": "20"}], ["wb14_cone", "กรวยสูง 6 ซม. รัศมี r", "poly: (-2.4,0) (0,6) (2.4,0) | or fill=cr w=2.6\narc: (0,0) 2.4 0.62 180 360 | or w=2.6 fill=cr\narc: (0,0) 2.4 0.62 0 180 | or w=1.8 dash\nseg: (-2.4,0) (0,0) | or w=1.4\nseg: (0,6) (0,0) | nv w=2.2 dash\nseg: (0,0) (2.4,0) | nv w=2.8\ntext: (0.7,2.3) 6 ซม. | nv size=20\ntext: (1.25,0.27) r | nv size=21", {"x0": "-2.6", "x1": "2.6", "y0": "-0.85", "y1": "6.15", "sx": "44", "fs": "20"}], ["wb14_corners", "กราฟมีจุดหักและจุดไม่ต่อเนื่อง", "seg: (-1,0) (1,2) (3,0) | or w=3\nseg: (3,3) (5,2) | or w=3\npt: (-1,0) | or r=6.5\npt: (3,0) | or r=6.5 open\npt: (3,3) | or r=6.5\npt: (5,2) | or r=6.5", {"x0": "-1.5", "x1": "5.6", "y0": "-0.7", "y1": "3.45", "sx": "62", "sy": "56", "tx": "1", "ty": "1", "xl": "", "yl": "", "fs": "20", "ax": "yes", "grid": "yes"}], ["wb14_tangent06", "เส้นโค้ง y = f(x) และเส้นผ่าน P กับ (4,6)", "f: 3+1.5(x-2)-0.25(x-2)^2 ; 0.2 ; 5.3 | or w=3\nline: (0,0) (4,6) | nv from=-0.12 to=4.3\npt: (2,3) P | or pos=se tc=or\npt: (4,6) (4, 6) | nv pos=w tc=nv\ntext: (4.5,4.6) y = f(x) | or size=19", {"x0": "-0.6", "x1": "5.9", "y0": "-0.6", "y1": "6.7", "sx": "52", "sy": "40", "tx": "1", "ty": "1", "ax": "yes", "grid": "yes"}]]);

/* รูปแบบฝึกทักษะ ม.2 บทที่ 5 การแยกตัวประกอบ (เพิ่มจากอีกแชต) */
wbAdd("แบบฝึกทักษะ: ม.2 บทที่ 5 การแยกตัวประกอบ", [["wbm2_tiles_legend", "แผ่นพื้นที่ x², x และ 1", "rect: (0,0) (3,3) x^2 | #5e5700 fill=#d9d5a4 w=2\ntext: (1.5,-0.5) ด้าน x × x | bk\nrect: (4.6,0) (5.35,3) | #c8611a fill=#fbe3cc w=1.8\ntext: (4.975,1.5) x | #c8611a\ntext: (4.975,-0.5) ด้าน 1 × x | bk\nrect: (7.4,0) (8.15,0.75) | #2e7d32 fill=#dcedc8 w=1.6\ntext: (7.775,1.2) 1 | #2e7d32\ntext: (7.775,-0.5) ด้าน 1 × 1 | bk", {"x0": "-0.3", "x1": "8.9", "y0": "-1.0", "y1": "3.3", "sx": "42", "fs": "17"}], ["wbm2_tiles_x2_5x_6", "แผ่นของ x² + 5x + 6 เรียงเป็น (x + 2)(x + 3)", "rect: (0,1.5) (3,4.5) x^2 | #5e5700 fill=#d9d5a4 w=2\nrect: (3,1.5) (3.75,4.5) | #c8611a fill=#fbe3cc w=1.6\nrect: (3.75,1.5) (4.5,4.5) | #c8611a fill=#fbe3cc w=1.6\nrect: (4.5,1.5) (5.25,4.5) | #c8611a fill=#fbe3cc w=1.6\nrect: (0,0) (3,0.75) | #c8611a fill=#fbe3cc w=1.6\nrect: (3,0) (3.75,0.75) | #2e7d32 fill=#dcedc8 w=1.4\nrect: (3.75,0) (4.5,0.75) | #2e7d32 fill=#dcedc8 w=1.4\nrect: (4.5,0) (5.25,0.75) | #2e7d32 fill=#dcedc8 w=1.4\nrect: (0,0.75) (3,1.5) | #c8611a fill=#fbe3cc w=1.6\nrect: (3,0.75) (3.75,1.5) | #2e7d32 fill=#dcedc8 w=1.4\nrect: (3.75,0.75) (4.5,1.5) | #2e7d32 fill=#dcedc8 w=1.4\nrect: (4.5,0.75) (5.25,1.5) | #2e7d32 fill=#dcedc8 w=1.4\ntext: (2.625,-0.55) x + 3 | bk\ntext: (-0.35,2.25) x + 2 | bk anchor=end", {"x0": "-2.3", "x1": "5.6", "y0": "-1.0", "y1": "4.8", "sx": "40", "fs": "17"}], ["wbm2_tiles_2x2_7x_3", "แผ่นของ 2x² + 7x + 3 เรียงเป็น (2x + 1)(x + 3)", "rect: (0,0.75) (3,3.75) x^2 | #5e5700 fill=#d9d5a4 w=2\nrect: (3,0.75) (3.75,3.75) | #c8611a fill=#fbe3cc w=1.6\nrect: (3.75,0.75) (4.5,3.75) | #c8611a fill=#fbe3cc w=1.6\nrect: (4.5,0.75) (5.25,3.75) | #c8611a fill=#fbe3cc w=1.6\nrect: (0,3.75) (3,6.75) x^2 | #5e5700 fill=#d9d5a4 w=2\nrect: (3,3.75) (3.75,6.75) | #c8611a fill=#fbe3cc w=1.6\nrect: (3.75,3.75) (4.5,6.75) | #c8611a fill=#fbe3cc w=1.6\nrect: (4.5,3.75) (5.25,6.75) | #c8611a fill=#fbe3cc w=1.6\nrect: (0,0) (3,0.75) | #c8611a fill=#fbe3cc w=1.6\nrect: (3,0) (3.75,0.75) | #2e7d32 fill=#dcedc8 w=1.4\nrect: (3.75,0) (4.5,0.75) | #2e7d32 fill=#dcedc8 w=1.4\nrect: (4.5,0) (5.25,0.75) | #2e7d32 fill=#dcedc8 w=1.4\ntext: (2.625,-0.55) x + 3 | bk\ntext: (-0.35,3.375) 2x + 1 | bk anchor=end", {"x0": "-2.6", "x1": "5.6", "y0": "-1.0", "y1": "7.1", "sx": "32", "fs": "17"}], ["wbm2_tiles_loose", "แผ่น x² สองแผ่น แผ่น x เจ็ดแผ่น และแผ่น 1 หกแผ่น", "rect: (0,1.4) (3,4.4) x^2 | #5e5700 fill=#d9d5a4 w=2\nrect: (3.5,1.4) (6.5,4.4) x^2 | #5e5700 fill=#d9d5a4 w=2\nrect: (7.3,1.4) (8.05,4.4) | #c8611a fill=#fbe3cc w=1.6\nrect: (8.35,1.4) (9.1,4.4) | #c8611a fill=#fbe3cc w=1.6\nrect: (9.4,1.4) (10.15,4.4) | #c8611a fill=#fbe3cc w=1.6\nrect: (10.45,1.4) (11.2,4.4) | #c8611a fill=#fbe3cc w=1.6\nrect: (11.5,1.4) (12.25,4.4) | #c8611a fill=#fbe3cc w=1.6\nrect: (12.55,1.4) (13.3,4.4) | #c8611a fill=#fbe3cc w=1.6\nrect: (13.6,1.4) (14.35,4.4) | #c8611a fill=#fbe3cc w=1.6\nrect: (0,0) (0.75,0.75) | #2e7d32 fill=#dcedc8 w=1.4\nrect: (1.05,0) (1.8,0.75) | #2e7d32 fill=#dcedc8 w=1.4\nrect: (2.1,0) (2.85,0.75) | #2e7d32 fill=#dcedc8 w=1.4\nrect: (3.15,0) (3.9,0.75) | #2e7d32 fill=#dcedc8 w=1.4\nrect: (4.2,0) (4.95,0.75) | #2e7d32 fill=#dcedc8 w=1.4\nrect: (5.25,0) (6,0.75) | #2e7d32 fill=#dcedc8 w=1.4", {"x0": "-0.3", "x1": "14.65", "y0": "-0.3", "y1": "4.7", "sx": "30", "fs": "17"}], ["wbm2_rect_xm_xn", "รูปสี่เหลี่ยมผืนผ้ากว้าง x + n ยาว x + m", "rect: (0,1.4) (4,5.4) x^2 | #5e5700 fill=#d9d5a4 w=2\nrect: (4,1.4) (5.8,5.4) mx | #c8611a fill=#fbe3cc w=2\nrect: (0,0) (4,1.4) nx | #c8611a fill=#fbe3cc w=2\nrect: (4,0) (5.8,1.4) mn | #2e7d32 fill=#dcedc8 w=2\ntext: (2,5.95) x | bk\ntext: (4.9,5.95) m | bk\ntext: (-0.35,3.4) x | bk anchor=end\ntext: (-0.35,0.7) n | bk anchor=end", {"x0": "-1.0", "x1": "6.1", "y0": "-0.3", "y1": "6.4", "sx": "40", "fs": "18"}], ["wbm2_foil", "การตรวจพจน์กลางของ (2x + 1)(x + 3)", "text: (2.1,2) (2x + 1)(x + 3) | bk size=28\ncurve: (0.75,2.5) (2.35,3.5) (3.95,2.5) | #c8611a w=2\ncurve: (1.85,1.5) (2.3,0.95) (2.75,1.5) | #2c4a7a w=2\ntext: (2.3,3.85) ผลคูณพจน์นอก 2x · 3 = 6x | #c8611a\ntext: (2.3,0.45) ผลคูณพจน์ใน 1 · x = x | #2c4a7a\ntext: (6.4,2.2) 6x + x = 7x | bk bold\ntext: (6.4,1.45) พจน์กลาง | bk", {"x0": "-0.4", "x1": "7.9", "y0": "0", "y1": "4.3", "sx": "46", "fs": "17"}], ["wbm2_act511", "รูปสี่เหลี่ยมผืนผ้ารู้ความกว้างและพื้นที่", "rect: (0,0) (5,1.6) 3x + 12 | #5e5700 fill=#d9d5a4 w=2\ntext: (-0.3,0.8) 3 | bk anchor=end\ntext: (2.5,-0.5) ? | bk bold\ntext: (2.5,-1.25) รูป (1) | bk\nrect: (7,-0.4) (12,2.2) 6x^2 + 4x | #c8611a fill=#fbe3cc w=2\ntext: (6.7,0.9) 2x | bk anchor=end\ntext: (9.5,-0.9) ? | bk bold\ntext: (9.5,-1.6) รูป (2) | bk", {"x0": "-0.9", "x1": "12.3", "y0": "-2.0", "y1": "2.5", "sx": "34", "fs": "18"}], ["wbm2_ab_ac", "รูปสี่เหลี่ยมผืนผ้าสูง a แบ่งเป็นสองส่วน ab และ ac", "rect: (0,0) (4,2.6) ab | #5e5700 fill=#d9d5a4 w=2\nrect: (4,0) (6.4,2.6) ac | #c8611a fill=#fbe3cc w=2\nseg: (0,3.0) (4,3.0) | gr w=1.2\nseg: (4,3.0) (6.4,3.0) | gr w=1.2\ntext: (2,3.45) b | bk\ntext: (5.2,3.45) c | bk\ntext: (-0.35,1.3) a | bk anchor=end\nseg: (0,-0.45) (6.4,-0.45) | gr w=1.2\ntext: (3.2,-0.95) b + c | bk", {"x0": "-0.9", "x1": "6.7", "y0": "-1.3", "y1": "3.8", "sx": "40", "fs": "18"}], ["wbm2_act514", "รูปสองรูปสูง n + 3 เท่ากัน ยาว m และ 5", "rect: (0,0) (4.2,2.6) | #5e5700 fill=#d9d5a4 w=2\nrect: (4.2,0) (6.6,2.6) | #c8611a fill=#fbe3cc w=2\ntext: (2.1,1.3) m(n + 3) | bk\ntext: (5.4,1.3) 5(n + 3) | bk\ntext: (-0.35,1.3) n + 3 | bk anchor=end\ntext: (2.1,-0.5) m | bk\ntext: (5.4,-0.5) 5 | bk", {"x0": "-1.8", "x1": "6.9", "y0": "-1.0", "y1": "2.9", "sx": "40", "fs": "18"}], ["wbm2_act515", "รูปพื้นที่สี่ส่วน ax, ay, bx, by", "rect: (0,1.4) (3.4,3.8) ax | #5e5700 fill=#d9d5a4 w=2\nrect: (3.4,1.4) (5.4,3.8) ay | #c8611a fill=#fbe3cc w=2\nrect: (0,0) (3.4,1.4) bx | #c8611a fill=#fbe3cc w=2\nrect: (3.4,0) (5.4,1.4) by | #2e7d32 fill=#dcedc8 w=2\ntext: (1.7,4.25) x | bk\ntext: (4.4,4.25) y | bk\ntext: (-0.3,2.6) a | bk anchor=end\ntext: (-0.3,0.7) b | bk anchor=end", {"x0": "-0.8", "x1": "5.7", "y0": "-0.3", "y1": "4.6", "sx": "40", "fs": "18"}], ["wbm2_plot_6x2_9x", "แปลงผักพื้นที่ 6x² + 9x กว้าง 3x", "rect: (0,0) (5.6,2.4) 6x^2 + 9x | #5e5700 fill=#d9d5a4 w=2\ntext: (-0.3,1.2) 3x | bk anchor=end\ntext: (2.8,-0.5) ? | bk bold", {"x0": "-1.3", "x1": "5.9", "y0": "-1.0", "y1": "2.7", "sx": "38", "fs": "18"}], ["wbm2_rect_8x2_12x", "รูปสี่เหลี่ยมผืนผ้าพื้นที่ 8x² + 12x กว้าง 4x", "rect: (0,0) (5.6,2.4) 8x^2 + 12x | #5e5700 fill=#d9d5a4 w=2\ntext: (-0.3,1.2) 4x | bk anchor=end\ntext: (2.8,-0.5) ? | bk bold", {"x0": "-1.3", "x1": "5.9", "y0": "-1.0", "y1": "2.7", "sx": "38", "fs": "18"}], ["wbm2_two_plots", "แปลงผัก ก และแปลงผัก ข วางต่อกัน", "rect: (0,0) (4.6,2.4) 3x^2 + 12x | #5e5700 fill=#d9d5a4 w=2\nrect: (4.6,0) (7.0,2.4) 5x + 20 | #2e7d32 fill=#dcedc8 w=2\ntext: (2.3,2.85) แปลง ก | #5e5700 bold\ntext: (5.8,2.85) แปลง ข | #2e7d32 bold\ntext: (-0.3,1.2) ? | bk bold anchor=end\nseg: (0,-0.4) (7.0,-0.4) | gr w=1.2\ntext: (3.5,-0.9) ? | bk bold", {"x0": "-0.9", "x1": "7.3", "y0": "-1.3", "y1": "3.3", "sx": "40", "fs": "18"}], ["wbm2_magic3", "จัตุรัสกลขนาด 3 × 3 ค่ากล 15", "rect: (0,2) (1,3) 2 | #5e5700 fill=#ffffff w=2\nrect: (1,2) (2,3) 7 | #5e5700 fill=#ffffff w=2\nrect: (2,2) (3,3) 6 | #5e5700 fill=#ffffff w=2\nrect: (0,1) (1,2) 9 | #5e5700 fill=#ffffff w=2\nrect: (1,1) (2,2) 5 | #5e5700 fill=#d9d5a4 w=2\nrect: (2,1) (3,2) 1 | #5e5700 fill=#ffffff w=2\nrect: (0,0) (1,1) 4 | #5e5700 fill=#ffffff w=2\nrect: (1,0) (2,1) 3 | #5e5700 fill=#ffffff w=2\nrect: (2,0) (3,1) 8 | #5e5700 fill=#ffffff w=2\ntext: (1.5,-0.45) ค่ากล = 15 | bk", {"x0": "-0.2", "x1": "3.2", "y0": "-0.9", "y1": "3.2", "sx": "48", "fs": "22"}], ["wbm2_rect_x2_7x_12", "รูปสี่เหลี่ยมผืนผ้าพื้นที่ x² + 7x + 12", "rect: (0,0) (5.2,2.4) x^2 + 7x + 12 | #5e5700 fill=#d9d5a4 w=2\ntext: (-0.3,1.2) ? | bk anchor=end\ntext: (2.6,-0.5) ? | bk bold", {"x0": "-0.9", "x1": "5.5", "y0": "-1.0", "y1": "2.7", "sx": "40", "fs": "18"}], ["wbm2_rect_x2_11x_28", "รูปสี่เหลี่ยมผืนผ้าพื้นที่ x² + 11x + 28 ยาว x + 7", "rect: (0,0) (5.6,2.4) x^2 + 11x + 28 | #5e5700 fill=#d9d5a4 w=2\ntext: (-0.3,1.2) ? | bk anchor=end\ntext: (2.8,-0.5) x + 7 | bk bold", {"x0": "-0.9", "x1": "5.9", "y0": "-1.0", "y1": "2.7", "sx": "40", "fs": "18"}], ["wbm2_rect_6x2_x_12", "รูปสี่เหลี่ยมผืนผ้าพื้นที่ 6x² + x − 12 กว้าง 2x + 3", "rect: (0,0) (5.6,2.4) 6x^2 + x - 12 | #5e5700 fill=#d9d5a4 w=2\ntext: (-0.3,1.2) 2x + 3 | bk anchor=end\ntext: (2.8,-0.5) ? | bk bold", {"x0": "-2.2", "x1": "5.9", "y0": "-1.0", "y1": "2.7", "sx": "38", "fs": "18"}], ["wbm2_sq_ab", "รูปสี่เหลี่ยมจัตุรัสด้าน A + B", "rect: (0,1.6) (3.4,5.0) A^2 | #5e5700 fill=#d9d5a4 w=2\nrect: (3.4,1.6) (5.0,5.0) AB | #c8611a fill=#fbe3cc w=2\nrect: (0,0) (3.4,1.6) AB | #c8611a fill=#fbe3cc w=2\nrect: (3.4,0) (5.0,1.6) B^2 | #2e7d32 fill=#dcedc8 w=2\ntext: (1.7,5.45) A | bk\ntext: (4.2,5.45) B | bk\ntext: (-0.3,3.3) A | bk anchor=end\ntext: (-0.3,0.8) B | bk anchor=end", {"x0": "-0.8", "x1": "5.3", "y0": "-0.3", "y1": "5.8", "sx": "38", "fs": "18"}], ["wbm2_sq_amb", "จัตุรัสด้าน A ตัดแถบกว้าง B ออกสองแถบ", "rect: (0,0) (5,5) | #5e5700 w=2\nrect: (0,2) (3,5) (A - B)^2 | #5e5700 fill=#d9d5a4 w=2\nrect: (3,2) (5,5) B(A - B) | #c8611a fill=#fbe3cc w=1.6 size=14\nrect: (0,0) (3,2) B(A - B) | #c8611a fill=#fbe3cc w=1.6 size=14\nrect: (3,0) (5,2) B^2 | #2e7d32 fill=#dcedc8 w=1.6\ntext: (1.5,5.45) A - B | bk\ntext: (4,5.45) B | bk\ntext: (-0.3,3.5) A - B | bk anchor=end\ntext: (-0.3,1) B | bk anchor=end\nseg: (0,-0.45) (5,-0.45) | gr w=1.2\ntext: (2.5,-0.95) A | bk", {"x0": "-1.7", "x1": "5.3", "y0": "-1.3", "y1": "5.8", "sx": "36", "fs": "17"}], ["wbm2_L_x2_6x", "แผ่นของ x² + 6x จัดเป็นรูปตัวแอล", "rect: (0,2.25) (3,5.25) x^2 | #5e5700 fill=#d9d5a4 w=2\nrect: (3,2.25) (3.75,5.25) | #c8611a fill=#fbe3cc w=1.6\nrect: (3.75,2.25) (4.5,5.25) | #c8611a fill=#fbe3cc w=1.6\nrect: (4.5,2.25) (5.25,5.25) | #c8611a fill=#fbe3cc w=1.6\nrect: (0,0) (3,0.75) | #c8611a fill=#fbe3cc w=1.6\nrect: (0,0.75) (3,1.5) | #c8611a fill=#fbe3cc w=1.6\nrect: (0,1.5) (3,2.25) | #c8611a fill=#fbe3cc w=1.6\nrect: (3,0) (5.25,2.25) ? | gr w=1.6 dash\ntext: (1.5,5.7) x | bk\ntext: (4.125,5.7) 3 | bk\ntext: (-0.3,3.75) x | bk anchor=end\ntext: (-0.3,1.125) 3 | bk anchor=end", {"x0": "-0.8", "x1": "5.6", "y0": "-0.3", "y1": "6.0", "sx": "40", "fs": "18"}], ["wbm2_lawn", "แปลงหญ้ารูปสี่เหลี่ยมจัตุรัสพื้นที่ 9x² + 42x + 49", "rect: (0,0) (3.6,3.6) 9x^2 + 42x + 49 | #2e7d32 fill=#dcedc8 w=2\ntext: (1.8,-0.45) ? | bk bold\ntext: (-0.3,1.8) ? | bk bold anchor=end", {"x0": "-0.8", "x1": "3.9", "y0": "-0.9", "y1": "3.9", "sx": "46", "fs": "17"}], ["wbm2_diff_sq", "ตัดจัตุรัส b² ออกจาก a² แล้วต่อเป็นรูปกว้าง a − b ยาว a + b", "rect: (0,1.5) (4,4) ชิ้นที่ 1 | #5e5700 fill=#d9d5a4 w=1.8\nrect: (0,0) (2.5,1.5) ชิ้นที่ 2 | #c8611a fill=#fbe3cc w=1.8\nrect: (2.5,0) (4,1.5) b^2 | gr w=1.4 dash\ntext: (2,4.45) a | bk\ntext: (-0.3,2) a | bk anchor=end\ntext: (3.25,-0.45) b | bk\ntext: (4.3,0.75) b | bk anchor=start\nseg: (4.9,2.6) (6.0,2.6) | gr arrow w=1.6\nrect: (7.6,0.9) (11.6,3.4) ชิ้นที่ 1 | #5e5700 fill=#d9d5a4 w=1.8\nrect: (11.6,0.9) (13.1,3.4) ชิ้นที่ 2 | #c8611a fill=#fbe3cc w=1.8 size=13\ntext: (7.3,2.15) a - b | bk anchor=end\ntext: (9.6,3.85) a | bk\ntext: (12.35,3.85) b | bk\ntext: (10.35,0.4) a + b | bk", {"x0": "-0.8", "x1": "13.4", "y0": "-0.9", "y1": "4.8", "sx": "32", "fs": "17"}], ["wbm2_ring_89_65", "วงกลมสองวงจุดศูนย์กลางเดียวกัน รัศมี 89 และ 65", "circle: (0,0) 2.6 | #5e5700 fill=#d9d5a4 w=2\ncircle: (0,0) 1.9 | #5e5700 fill=#ffffff w=2\nseg: (0,0) (2.080,1.560) | #c8611a w=1.8\nseg: (0,0) (-1.520,1.140) | #2c4a7a w=1.8\ntext: (1.092,1.352) 89 | #c8611a\ntext: (-0.684,1.045) 65 | #2c4a7a\npt: (0,0) | bk", {"x0": "-2.8", "x1": "2.8", "y0": "-2.8", "y1": "2.8", "sx": "40", "fs": "18"}], ["wbm2_pipe", "หน้าตัดท่อน้ำ รัศมีด้านนอก 13.5 ด้านใน 11.5 เซนติเมตร", "circle: (0,0) 2.7 | #5e5700 fill=#d9d5a4 w=2\ncircle: (0,0) 2.3 | #5e5700 fill=#ffffff w=2\nseg: (0,0) (2.160,1.620) | #c8611a w=1.8\nseg: (0,0) (-1.840,1.380) | #2c4a7a w=1.8\ntext: (1.134,1.404) 13.5 | #c8611a\ntext: (-0.828,1.265) 11.5 | #2c4a7a\npt: (0,0) | bk", {"x0": "-2.9", "x1": "2.9", "y0": "-2.9", "y1": "2.9", "sx": "40", "fs": "17"}], ["wbm2_frame", "กรอบรูปด้านนอกยาว x + 3 ช่องด้านในยาว x − 3", "rect: (0,0) (4,4) | #5e5700 fill=#d9d5a4 w=2\nrect: (0.8,0.8) (3.2,3.2) | #5e5700 fill=#ffffff w=2\ntext: (2,-0.45) x + 3 | bk\ntext: (2,1.2) x - 3 | bk", {"x0": "-0.3", "x1": "4.3", "y0": "-0.9", "y1": "4.3", "sx": "40", "fs": "18"}], ["wbm2_tri_abe", "รูปสามเหลี่ยม ABC มี AD ตั้งฉาก BC และจุด E บน AD", "poly: (-2.4,0) (2.4,0) (0,4.5) | #5e5700 fill=#f3f1dd w=2\nseg: (0,4.5) (0,0) | #2c4a7a w=1.6 dash\nseg: (-2.4,0) (0,0.7) | #c8611a w=1.8\nseg: (0,0.25) (0.25,0.25) (0.25,0) | bk w=1.2\npt: (0,0.7) | #c8611a\ntext: (0,4.85) A | bk\ntext: (-2.7,-0.15) B | bk\ntext: (2.7,-0.15) C | bk\ntext: (0,-0.4) D | bk\ntext: (0.35,0.85) E | bk\ntext: (-1.65,2.5) 51 | bk\ntext: (1.65,2.5) 51 | bk\ntext: (0.4,2.6) 38 | #2c4a7a\ntext: (-1.25,0.7) 25 | #c8611a", {"x0": "-3.0", "x1": "3.0", "y0": "-0.8", "y1": "5.2", "sx": "42", "fs": "17"}]]);

/* ===================== ส่วนประกอบแบบฝึกทักษะ: แถบแบบฝึก · ป้ายระดับ (หัวกะโหลก) · บันทึกหลังเรียน · หัวข้อขนาดใหญ่ =====================
   wbban   แถบใหญ่ "แบบฝึกทักษะ 11.1" มีไอคอนและคำอธิบาย
   skull   ป้ายระดับความยาก 1–5 หัวกะโหลก (คลิกที่ป้ายเพื่อเปลี่ยนระดับ)
   reflect บันทึกหลังเรียน: หัวข้อมีไอคอน + หัวข้อย่อยพร้อมช่องเขียน
   settings.wbh = หัวข้อ (section/subsection/กิจกรรม) ตัวใหญ่กว่าเนื้อหา แบบแบบฝึกทักษะ
   <span class="skl" style="--n:3"></span> = หัวกะโหลก 3 หัว ใช้ในตาราง/ข้อความได้ */
(function () {
  const SK = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill-rule='evenodd' d='M12 2.2C6.9 2.2 3.3 5.7 3.3 10.2c0 2.6 1.2 4.6 3 5.8v3c0 .6.4 1 1 1h1.9v-2.2h1.7V20h2.2v-2.2h1.7V20h1.9c.6 0 1-.4 1-1v-3c1.8-1.2 3-3.2 3-5.8 0-4.5-3.6-8-8.7-8zM8.6 9.4a2.1 2.1 0 1 0 0 4.2 2.1 2.1 0 0 0 0-4.2zm6.8 0a2.1 2.1 0 1 0 0 4.2 2.1 2.1 0 0 0 0-4.2zM12 13.6l-1.3 2.2h2.6z'/%3E%3C/svg%3E";
  const PEN = '<svg viewBox="0 0 24 24" width="26" height="26"><path d="M4 20l1.2-4.6L15.6 5a2 2 0 0 1 2.8 0l.6.6a2 2 0 0 1 0 2.8L8.6 18.8z" fill="none" stroke="#fff" stroke-width="2.2" stroke-linejoin="round"/><path d="M13.8 6.8l3.4 3.4" stroke="#fff" stroke-width="2.2"/></svg>';
  const BOOK = '<svg viewBox="0 0 24 24" width="17" height="17"><path d="M5 3.5h11.5a1.5 1.5 0 0 1 1.5 1.5v14.5H6.5A1.5 1.5 0 0 1 5 18z M5 18a1.5 1.5 0 0 1 1.5-1.5H18" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round"/></svg>';
  const ICONS = { pen: PEN, book: BOOK.replace(/17/g, '26').replace('currentColor', '#fff'), star: '<svg viewBox="0 0 24 24" width="26" height="26"><path d="M12 3l2.7 5.6 6.1.8-4.4 4.3 1 6.1L12 17l-5.4 2.8 1-6.1-4.4-4.3 6.1-.8z" fill="none" stroke="#fff" stroke-width="2" stroke-linejoin="round"/></svg>', link: '<svg viewBox="0 0 24 24" width="26" height="26"><path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round"/></svg>' };
  window.WB_SKULL = n => `<span class="skl" contenteditable="false" style="--n:${n}"></span>`;
  const s = document.createElement('style');
  const M = p => `color-mix(in srgb,var(--brown) ${p}%,#fff)`;
  s.textContent = `
.skl{display:inline-block;vertical-align:-.18em;height:1.12em;width:calc(var(--n,1)*1.16em);background:currentColor;-webkit-mask:url("${SK}") left center/1.16em 1.12em repeat-x;mask:url("${SK}") left center/1.16em 1.12em repeat-x}
td .skl,th .skl{color:var(--dark)}
.b-wbban{display:flex;align-items:center;gap:14px;background:linear-gradient(90deg,var(--dark),var(--brown) 68%,${M(72)});color:#fff;border-radius:11px;padding:9px 18px 10px 12px;box-shadow:0 4px 0 ${M(62)};margin:12px 0 12px}
.b-wbban .wi{flex:0 0 auto;width:52px;height:52px;border-radius:50%;background:rgba(255,255,255,.17);display:flex;align-items:center;justify-content:center}
.b-wbban .wb{flex:1;min-width:0}.b-wbban .wt{font-size:1.62em;font-weight:700;line-height:1.25}.b-wbban .ws{font-size:.93em;opacity:.92;line-height:1.35}
.b-wbban [contenteditable]:empty::before{color:#f1d9c6}
.b-skull{display:flex;align-items:center;margin:10px 0 4px;padding-bottom:7px;border-bottom:1.2px dashed ${M(42)}}
.b-skull .pill{display:inline-flex;align-items:center;background:var(--dark);color:#fff;border-radius:999px;padding:3px 13px 3px 12px;cursor:pointer;font-size:1.05em}
.b-skull .sk-t{margin-left:10px;color:var(--brown);font-weight:700}
.b-reflect{--rc:#2c4a7a;border:1.4px solid var(--rc);border-radius:10px;padding:5px 14px 11px;color:var(--rc);margin:8px 0}
.b-reflect .rh{display:flex;align-items:center;gap:7px;font-weight:700;font-size:1.02em}.b-reflect .rh>div{flex:1}
.b-reflect .rl{font-weight:700;margin-top:5px}
.b-reflect .ra{border:1.2px dashed #9a9a9a;border-radius:9px;margin-top:3px}
:root.wbh #flow .b-section{font-size:1.5em;color:#fff;background:linear-gradient(90deg,var(--dark),var(--brown) 75%,${M(78)});border:0;border-radius:9px;padding:5px 16px 6px;margin:12px 0 10px;line-height:1.3}
:root.wbh #flow .b-section:empty::before{color:#f1d9c6}
:root.wbh #flow .b-subsection{font-size:1.3em;color:var(--dark);border-bottom:2px solid ${M(70)};padding-bottom:3px;margin:12px 0 7px}
:root.wbh #flow .b-activity{font-size:1.08em;padding:5px 13px}
`;
  document.head.appendChild(s);

  Object.assign(TYPES, { wbban: 'แถบแบบฝึกทักษะ (หัวใหญ่ มีไอคอน)', skull: 'ป้ายระดับความยาก (หัวกะโหลก 1–5)', reflect: 'บันทึกหลังเรียน (มีไอคอน แบ่งหัวข้อ)' });
  try { HEADINGS.add('wbban'); HEADINGS.add('skull'); } catch (e) { }
  try { OUT_LV.wbban = 2; } catch (e) { }
  const _nb = extNewBlock;
  extNewBlock = function (b) {
    _nb(b);
    if (b.t === 'wbban') Object.assign(b, { html: 'แบบฝึกทักษะ 1.1', sub: 'ชื่อหัวข้อ · 20 ข้อ เรียงจากง่ายไปยาก', icon: 'pen' });
    if (b.t === 'skull') Object.assign(b, { n: 1, txt: '' });
    if (b.t === 'reflect') Object.assign(b, { html: 'บันทึกหลังเรียน หัวข้อ ...', n: 3, h: 12, l0: 'สิ่งที่ฉันเข้าใจแล้ว', l1: 'สิ่งที่ฉันยังสงสัย', l2: 'ข้อผิดพลาดที่ฉันทำบ่อย และวิธีป้องกัน' });
  };
  const _bh = extBlockHTML;
  extBlockHTML = function (b) {
    const r = _bh(b); if (r) return r;
    const E = (f, ph, cls = '') => `<div class="${cls}" contenteditable="true" data-f="${f}" data-ph="${ph}"></div>`;
    if (b.t === 'wbban') return `<div class="b-wbban"><div class="wi">${ICONS[b.icon] || PEN}</div><div class="wb">${E('html', 'แบบฝึกทักษะ ...', 'wt')}${E('sub', 'คำอธิบาย (เว้นว่างได้)', 'ws')}</div></div>`;
    if (b.t === 'skull') { const n = Math.max(1, Math.min(5, +b.n || 1)); return `<div class="b-skull"><span class="pill" title="คลิกเพื่อเปลี่ยนระดับ (1–5)">${WB_SKULL(n)}</span>${E('txt', '', 'sk-t')}</div>`; }
    if (b.t === 'reflect') { const n = Math.max(1, Math.min(8, +b.n || 3)), h = Math.max(6, +b.h || 12);
      return `<div class="b-reflect"${b.rc ? ` style="--rc:${esc(b.rc)}"` : ''}><div class="rh">${BOOK}${E('html', 'บันทึกหลังเรียน', '')}</div>${Array.from({ length: n }, (_, i) => E('l' + i, 'หัวข้อ', 'rl') + `<div class="ra" style="height:${h}mm"></div>`).join('')}</div>`; }
    return '';
  };
  const _ei = extInspector;
  extInspector = function (b) {
    let h = _ei(b); const num = (k, lab, v, mn, mx) => `<div class="ir"><label>${lab}</label><input type="number" min="${mn}" max="${mx}" data-bn="${k}" value="${v}"></div>`;
    if (b.t === 'skull') h += num('n', 'จำนวนหัวกะโหลก (ระดับ)', b.n || 1, 1, 5);
    if (b.t === 'reflect') h += num('n', 'จำนวนหัวข้อ', b.n || 3, 1, 8) + num('h', 'ความสูงช่องเขียน (มม.)', b.h || 12, 6, 80);
    if (b.t === 'wbban') h += `<div class="ir"><label>ไอคอน</label><select data-bt="icon">${[['pen', 'ดินสอ'], ['book', 'หนังสือ'], ['star', 'ดาว'], ['link', 'ข้อต่อ']].map(([k, v]) => `<option value="${k}"${(b.icon || 'pen') === k ? ' selected' : ''}>${v}</option>`).join('')}</select></div>`;
    return h;
  };
  // คลิกป้ายหัวกะโหลก = เพิ่มระดับ (5 → 1)
  document.addEventListener('click', e => { const p = e.target.closest && e.target.closest('#flow .b-skull .pill'); if (!p) return; const blk = p.closest('.blk'); const b = blk && byId(blk.dataset.id); if (!b) return; b.n = (Math.max(1, Math.min(5, +b.n || 1)) % 5) + 1; rerender(b.id); changed(true); });
  // หัวข้อตัวใหญ่ (settings.wbh)
  const _as = applySettings;
  applySettings = function () { const r = _as.apply(this, arguments); document.documentElement.classList.toggle('wbh', !!(doc && doc.settings && doc.settings.wbh)); return r; };
  const _os = openSettings;
  openSettings = function () {
    const r = _os.apply(this, arguments); const box = $('#sThemes'); if (!box) return r;
    let w = $('#sWbh');
    if (!w) { w = document.createElement('label'); w.id = 'sWbh'; w.style.cssText = 'display:flex;gap:6px;align-items:center;margin-top:6px'; w.innerHTML = '<input type="checkbox"> หัวข้อตัวใหญ่แบบแบบฝึกทักษะ (หัวข้อเป็นแถบสี หัวข้อย่อยมีเส้นใต้)'; const ref = $('#sBxth') || box; ref.parentNode.insertBefore(w, ref.nextSibling); $('input', w).onchange = e => { doc.settings.wbh = e.target.checked || undefined; applySettings(); changed(true); }; }
    $('input', w).checked = !!doc.settings.wbh; return r;
  };
})();

/* ===================== แบบฝึกทักษะ "แบบต้นฉบับ" (settings.wbo = true) =====================
   เปิดด้วย doc.settings.wbo — เอกสารอื่นไม่ได้รับผลใด ๆ
   กล่อง:  key = บทสรุป (ไล่สี + แถบซ้าย) · def/thmf = แถบซ้าย · caution2 = กรอบเหลือง · write = การ์ดเขียนด้วยคำพูดของตนเอง
           verify = ✓ ภาพยืนยันทฤษฎีบท · tryp = ลองพิสูจน์ด้วยตนเอง (ใช้ในกรอบทฤษฎีบท)
   กรอบ (บล็อก activity + var):  ex = ตัวอย่าง · thm = ทฤษฎีบท (แถบซ้ายยาวตลอด) · tf = จริงหรือไม่ · err = ตามหาที่ผิด · sumf = สรุปสูตรสำคัญ
   บล็อกใหม่:  pill = ป้าย "ฝึกทันที" · tf = ข้อความจริง/ไม่จริง + เพราะ · frow = แถวสูตรมีเลขในวงกลม
   ป้ายข้อ (problem + pk):  ft = (1) ต่อบรรทัดเดียวกับคำถาม · more = ฝึกเพิ่ม 14.1.1 */
(function () {
  const on = () => !!(doc && doc.settings && doc.settings.wbo);
  const st = document.createElement('style');
  const LP = '#a77aa9', LB = '#e2d3e3';
  st.textContent = `
:root body.wbo #flow .k-key{background:linear-gradient(180deg,color-mix(in srgb,var(--brown) 20%,#fff),color-mix(in srgb,var(--brown) 9%,#fff) 55%,color-mix(in srgb,var(--brown) 4%,#fff))!important;border:1px solid ${LP}!important;border-left:9px solid var(--brown)!important;border-radius:8px!important;padding:9px 14px 9px 18px!important;margin:8px 0}
:root body.wbo #flow .k-key .bt{color:var(--dark);font-size:1.13em;margin-bottom:5px}
:root body.wbo #flow .k-key .bt::before{content:'';display:inline-block;width:1em;height:1em;margin-right:7px;vertical-align:-.12em;background:var(--dark);-webkit-mask:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='none' stroke='%23000' stroke-width='2.2' d='M8 12a4 4 0 1 1 0 .01M12 12h9M17.5 12v4M21 12v3'/%3E%3C/svg%3E") center/contain no-repeat;mask:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='none' stroke='%23000' stroke-width='2.2' d='M8 12a4 4 0 1 1 0 .01M12 12h9M17.5 12v4M21 12v3'/%3E%3C/svg%3E") center/contain no-repeat}
:root body.wbo #flow .k-def{background:color-mix(in srgb,var(--brown) 6%,#fff)!important;border:1px solid ${LP}!important;border-left:6px solid var(--brown)!important;border-radius:6px!important;padding:5px 14px 7px 14px!important}
:root body.wbo #flow .k-def .bt{background:none!important;color:var(--dark)!important;padding:0!important;margin:0 0 2px!important;border-radius:0!important}
:root body.wbo #flow .k-thmf{background:color-mix(in srgb,var(--brown) 10%,#fff);border:1px solid ${LB};border-left:6px solid ${LP};border-radius:6px;padding:5px 14px 7px 12px}
:root body.wbo #flow .k-thmf .bt{color:var(--brown)}
:root body.wbo #flow .k-caution2{background:#fff8e1;border:1px solid #e6c65c;border-radius:7px;padding:6px 12px}
:root body.wbo #flow .k-caution2 .bt{color:#a8760a}
:root body.wbo #flow .k-write{border:1.2px solid ${LP};border-radius:8px;padding:7px 12px}
:root body.wbo #flow .k-write .bt{color:var(--brown);font-weight:400}
:root body.wbo #flow .k-verify,:root body.wbo #flow .k-tryp{background:none;border:0;border-radius:0;padding:3px 0 2px;margin:2px 0}
:root body.wbo #flow .k-verify .bt,:root body.wbo #flow .k-tryp .bt{display:inline;margin-right:7px}
:root body.wbo #flow .k-verify .bt{color:#2f4b7c;font-style:italic}:root body.wbo #flow .k-verify .bt::before{content:'✓ ';font-style:normal}
:root body.wbo #flow .k-tryp .bt{color:var(--brown)}
:root body.wbo #flow .k-verify [data-f=html],:root body.wbo #flow .k-tryp [data-f=html]{display:inline}
/* กรอบแบบต่าง ๆ */
body.wbo .blk[data-var=ex] .b-activity{background:#fff;color:var(--dark);border:1px solid ${LP};border-bottom:0;border-radius:8px 8px 0 0;padding:5px 12px 0}
body.wbo .blk[data-var=ex] .b-activity .aic{display:none}
body.wbo .blk.inact[data-av=ex]{border-left:1px solid ${LP};border-right:1px solid ${LP}}
body.wbo .blk.actlast[data-av=ex],body.wbo .blk.actbrk[data-av=ex]{border-bottom:1px solid ${LP}}
body.wbo .blk[data-var=thm] .b-activity{background:color-mix(in srgb,var(--brown) 10%,#fff);color:var(--brown);border:1px solid ${LB};border-left:6px solid ${LP};border-bottom:0;border-radius:6px 6px 0 0;padding:5px 12px 0}
body.wbo .blk[data-var=thm] .b-activity .aic{display:none}
body.wbo .blk.inact[data-av=thm]{border-left:6px solid ${LP};border-right:1px solid ${LB};padding-left:12px}
body.wbo .blk.actlast[data-av=thm],body.wbo .blk.actbrk[data-av=thm]{border-bottom:1px solid ${LB};border-radius:0 0 6px 6px}
body.wbo .blk.inact[data-av=thm].thmst{background:color-mix(in srgb,var(--brown) 10%,#fff);border-bottom:1px solid ${LB}}
body.wbo .blk[data-var=tf] .b-activity,body.wbo .blk[data-var=err] .b-activity{background:#fff;color:var(--dark);border:1.2px solid var(--dark);border-bottom:0;padding-top:6px}
body.wbo .blk.inact[data-av=tf]{border-color:var(--dark);border-width:0 1.2px}
body.wbo .blk.actlast[data-av=tf],body.wbo .blk.actbrk[data-av=tf]{border-bottom:1.2px solid var(--dark)}
body.wbo .blk[data-var=err] .b-activity{border-color:#c0392b;color:#c0392b}
body.wbo .blk.inact[data-av=err]{border-color:#c0392b;border-width:0 1.2px}
body.wbo .blk.actlast[data-av=err],body.wbo .blk.actbrk[data-av=err]{border-bottom:1.2px solid #c0392b}
body.wbo .blk[data-var=sumf] .b-activity{background:var(--dark)}
body.wbo .blk[data-var=sumf] .b-activity .aic{display:none}
body.wbo .blk.inact[data-av=sumf]{border-color:${LP}}
body.wbo .blk.actlast[data-av=sumf]{border-bottom-color:${LP}}
body.wbo .blk.actcont[data-av=ex]::before,body.wbo .blk.actcont[data-av=wr]::before{background:#fff;color:var(--dark);border:1px solid ${LP};border-bottom:0}
body.wbo .blk.actcont[data-av=thm]::before{display:none}
body.wbo .blk[data-var=wr] .b-activity .aic{display:none}
body.wbo .blk[data-var=wr] .b-activity{background:#fff;color:var(--brown);font-weight:400;border:1.2px solid ${LP};border-bottom:0;border-radius:8px 8px 0 0;padding:5px 12px 0}
body.wbo .blk.inact[data-av=wr]{border-left:1.2px solid ${LP};border-right:1.2px solid ${LP}}
body.wbo .blk.actlast[data-av=wr],body.wbo .blk.actbrk[data-av=wr]{border-bottom:1.2px solid ${LP}}
/* ข้อย่อย 1) 2) (ก) (ข): เลขข้อที่แท็บ 1 ข้อความที่แท็บ 2 บรรทัดต่อไปตรงกับข้อความ */
.wli{display:flex;align-items:baseline;gap:.4em;margin-left:1.7em}
.wli>.wn{flex:0 0 auto;min-width:1.55em;white-space:nowrap}
.wli>.wt{flex:1;min-width:0}
.b-question .wli,.wrow .wli{margin-left:0}
.b-question .qb>.w0{margin-top:-1.7em;margin-top:-1lh}
/* ตัวเลือก 5 ข้อ: กระจายเต็มความกว้างบรรทัด */
body.wbo .b-choices[style*="repeat(5"]{grid-template-columns:repeat(5,1fr)!important;justify-content:stretch!important;margin-right:16px}
.wrow{display:flex;gap:1.2em;margin-left:0}.wrow>.wli{flex:1}
.b-para .wli:first-child,.bb>.wli:first-child{margin-top:1px}
/* ป้ายฝึกทันที */
.b-pill{display:inline-flex;align-items:center;gap:6px;background:${LP};color:#fff;font-weight:700;border-radius:999px;padding:1px 14px 2px 10px;margin:8px 0 2px}
.b-pill .pi{font-weight:400}
/* แถวจริง/ไม่จริง */
.b-tf{border-top:1px dashed var(--sep);padding:5px 0 4px}
.b-tf .ts{display:flex;gap:7px}.b-tf .ts::before{content:counter(tfn) '.';counter-increment:tfn}
.b-tf .tr{display:flex;align-items:center;gap:14px;margin:3px 0 0 18px;color:#555}
.b-tf .tr b{color:var(--dark)}.b-tf .tr i{flex:1;height:2.1em;border:1px dashed #b9b0bd;border-radius:6px}
.blk.acthead[data-var=tf]{counter-reset:tfn}
/* แถวสูตร */
.b-frow{display:flex;gap:10px;align-items:flex-start;border-top:1px dashed var(--sep);padding:5px 0 4px}
.b-frow::before{content:counter(frn);counter-increment:frn;flex:0 0 1.35em;height:1.35em;border-radius:50%;background:${LP};color:#fff;font-size:.82em;font-weight:700;display:flex;align-items:center;justify-content:center;margin-top:.25em}
.b-frow .fn{color:#666;font-size:.94em}
.blk.acthead[data-var=sumf]{counter-reset:frn}
/* ป้ายข้อ: ไม่มีเส้นประคั่นระหว่างข้อ */
body.wbo .b-problem{border-top:0;padding-top:2px;margin-top:9px}
body.wbo .b-tf{border-top:0}
body.wbo .b-tf+.b-tf{margin-top:2px}
body.wbo .blk[data-pk=ft] .b-problem .pl{font-weight:400;color:#555}
body.wbo .blk[data-pk=more] .b-problem .pl{font-weight:400;color:${LP}}
body.wbo .blk[data-pk=ft] .b-problem,body.wbo .blk[data-pk=more] .b-problem{margin-bottom:-1.52em}
body.wbo .blk[data-pk=more]+.blk .b-given{text-indent:var(--pkw,4.6em)}
body.wbo .blk[data-pk=more]+.blk .b-question{text-indent:var(--pkq,2.7em)}
/* รูปด้านขวาของพื้นที่ทด: figure ที่มี side = 'r' + บล็อกถัดไป */
body.wbo .blk[data-side=r]{height:0!important;overflow:visible;position:relative;z-index:2}
body.wbo .blk[data-side=r] .b-figure{position:absolute;right:2px;top:8px;width:var(--sw,34%);margin:0}
body.wbo .blk[data-side=r] .figcap{display:none}
body.wbo .blk.sidew .b-work{margin-right:calc(var(--sw,34%) + 14px)}
body.wbo .blk.sidew .wbo2{margin-right:calc(var(--sw,34%) + 14px)}
/* ตารางคู่ในกิจกรรม */
.wbo2{display:flex;justify-content:space-around;align-items:flex-start;margin:4px 0}
.wbo2 table{border-collapse:collapse}.wbo2 td,.wbo2 th{border:1px solid ${LP};padding:2px 14px;text-align:center;min-width:2.4em;height:1.55em}
.wbo2 th{background:#f6e7f6;font-weight:400}.wbo2 .cap{text-align:center;margin-bottom:3px}
`;
  document.head.appendChild(st);

  Object.assign(BOXES, { verify: 'ทำความเข้าใจ', tryp: 'ลองพิสูจน์ด้วยตนเอง' });
  Object.assign(TYPES, { pill: 'ป้ายฝึกทันที', tf: 'จริงหรือไม่ เพราะอะไร', frow: 'แถวสูตร (เลขในวงกลม)' });
  const _nb = extNewBlock; extNewBlock = function (b) { _nb(b); if (b.t === 'pill') b.html = 'ฝึกทันที'; if (b.t === 'tf') b.html = ''; if (b.t === 'frow') { b.html = ''; b.note = ''; } };
  const _bh = extBlockHTML; extBlockHTML = function (b) {
    const r = _bh(b); if (r) return r;
    if (b.t === 'pill') return `<div class="b-pill"><span class="pi">◎</span><div contenteditable="true" data-f="html" data-ph="ฝึกทันที"></div></div>`;
    if (b.t === 'tf') return `<div class="b-tf"><div class="ts"><div contenteditable="true" data-f="html" data-ph="ข้อความ..." style="flex:1"></div></div><div class="tr"><span>○ จริง</span><span>○ ไม่จริง</span><b>เพราะ</b><i></i></div></div>`;
    if (b.t === 'frow') return `<div class="b-frow"><div style="flex:1"><div contenteditable="true" data-f="html" data-ph="สูตร..."></div><div class="fn" contenteditable="true" data-f="note" data-ph="คำอธิบาย"></div></div></div>`;
    return '';
  };
  // ติดป้ายชนิดกรอบ/ป้ายข้อบนบล็อก (ใช้กับ CSS)
  const _ma = markActivities;
  markActivities = function () {
    const r = _ma.apply(this, arguments);
    if (!on()) return r;
    let av = '';
    $$('#flow > .blk').forEach(el => {
      const b = byId(el.dataset.id); if (!b) return;
      if (el.classList.contains('acthead')) { av = b.var || ''; if (av) el.dataset.var = av; else delete el.dataset.var; }
      if (el.classList.contains('inact') && av) el.dataset.av = av; else delete el.dataset.av;
      el.classList.toggle('thmst', !!b.thmst);
      el.classList.remove('sidew');
      if (b.t === 'figure' && b.side) { el.dataset.side = b.side; el.style.setProperty('--sw', b.sw || '34%'); const nx = el.nextElementSibling; if (nx) { nx._sw = b.sw || '34%'; } } else delete el.dataset.side;
      const pv = el.previousElementSibling; if (pv && pv.dataset.side) { el.classList.add('sidew'); el.style.setProperty('--sw', pv.style.getPropertyValue('--sw')); }
      if (b.t === 'problem' && b.pk) { el.dataset.pk = b.pk; if (b.pkw) el.style.setProperty('--pkw', b.pkw); } else delete el.dataset.pk;
    });
    return r;
  };
  // ป้ายฝึกทันทีอยู่หน้าเดียวกับข้อแรก · กรอบตัวอย่าง/เขียนด้วยคำพูดของตนเอง ไม่ถูกแบ่งข้ามหน้า
  try { HEADINGS.add('pill'); } catch (e) { }
  const _un = units;
  units = function () {
    const out = _un.apply(this, arguments); if (!on()) return out;
    // กรอบ (ตัวอย่าง ทฤษฎีบท จริงหรือไม่ ตามหาที่ผิด สรุปสูตร เขียนด้วยคำพูดของตนเอง) อยู่หน้าเดียวทั้งกรอบ · กิจกรรมอยู่หน้าเดียวถ้าสูงไม่เกินหนึ่งหน้า
    const PH = PAGE_H - TOP - BOT, res = []; let i = 0;
    while (i < out.length) {
      const u = out[i]; const h = u.els.find(el => el.dataset.t === 'activity'); const b = h && byId(h.dataset.id);
      if (b && !u.els.some(el => el.dataset.t === 'actend')) {
        let j = i; const els = [...u.els];
        while (j + 1 < out.length) { j++; els.push(...out[j].els); if (out[j].els.some(el => el.dataset.t === 'actend')) break; }
        const tot = els.reduce((a, el) => a + el.offsetHeight, 0);
        if (b.var || tot <= PH * 0.97) { if (tot <= PH) { u.els = els; res.push(u); i = j + 1; continue; } }
      }
      res.push(u); i++;
    }
    // รูปด้านขวา (สูง 0) ต้องอยู่หน่วยเดียวกับบล็อกก่อนหน้าและบล็อกถัดไป
    const mg = [];
    res.forEach(u => { const pv = mg[mg.length - 1]; if (pv && !u.forced && (u.els[0].dataset.side || pv.els[pv.els.length - 1].dataset.side)) pv.els.push(...u.els); else mg.push(u); });
    return mg;
  };
  // ที่ว่างท้ายหน้าที่เหลือ (หน้าที่ไม่มีกล่องให้ขยาย): กระจายเป็นระยะห่างระหว่างกรอบในหน้านั้น
  const _pgo = paginate;
  paginate = function () {
    if (on()) $$('#flow > .blk[data-side]').forEach(el => { const nx = el.nextElementSibling, f = $('.b-figure', el); if (nx) nx.style.minHeight = (f && !$('.b-work', nx)) ? (f.offsetHeight + 14) + 'px' : ''; });
    const r = _pgo.apply(this, arguments);
    if (!on() || document.getElementById('npPrint')) return r;
    try {
      const P = PAGE_H + PAGE_G, els = $$('#flow > .blk'), pages = {};
      els.forEach(el => { if (!el.offsetHeight && !el.dataset.side) return; const p = Math.floor((el.offsetTop + 3) / P); (pages[p] = pages[p] || []).push(el); });
      const keys = Object.keys(pages).map(Number).sort((a, b) => a - b);
      keys.forEach((p, ki) => {
        const L = pages[p], lastPg = ki === keys.length - 1, nx = lastPg ? L[0] : pages[keys[ki + 1]][0];
        const bot = () => Math.max(...L.map(el => el.offsetTop + el.offsetHeight));
        const O0 = nx.offsetTop, fix = () => { if (lastPg) return; for (let q = 0; q < 3; q++) { const d = nx.offsetTop - O0; if (Math.abs(d) < 0.5) break; nx.style.marginTop = Math.max(0, (parseFloat(getComputedStyle(nx).marginTop) || 0) - d) + 'px'; } };
        let left = p * P + PAGE_H - BOT - bot() - 3; if (left < 10) return;
        // 1) ขยายกรอบทดในหน้านั้นเพิ่ม (รวมแล้วไม่เกิน 3 เท่าของขนาดที่ตั้งไว้)
        const ws = []; L.forEach(el => { const w = $('.b-work', el), bb = byId(el.dataset.id); if (w && bb) ws.push([w, (bb.h || 40) * 3.7795]); });
        if (ws.length) { const cap = (lastPg || nx.dataset.t === 'section' || nx.dataset.t === 'pagebreak') ? 4.5 : 2.5, room = ws.map(([w, h0]) => Math.max(0, h0 * cap - w.offsetHeight)), tot = room.reduce((x, y) => x + y, 0);
          if (tot > 0) { const o0 = nx.offsetTop, use = Math.min(left, tot); ws.forEach(([w], i) => { w.style.height = (w.offsetHeight + use * room[i] / tot) + 'px'; }); fix(); left = p * P + PAGE_H - BOT - bot() - 3; } }
        if (left < 10 || lastPg) return;
        // 2) ที่เหลือเฉลี่ยเป็นระยะห่างระหว่างกรอบ/ข้อ
        const cand = L.filter((el, k) => { if (!k || el.classList.contains('inact')) return false; const t = el.dataset.t, pt = el.previousElementSibling ? el.previousElementSibling.dataset.t : ''; if (['pill', 'skull', 'wbban', 'section', 'subsection'].includes(pt)) return false; return ['activity', 'box', 'problem', 'pill', 'wbban', 'skull', 'reflect', 'para', 'image'].includes(t); });
        if (!cand.length) return; const add = Math.min(left / cand.length, 34), o0 = nx.offsetTop;
        cand.forEach(el => { el.style.marginTop = ((parseFloat(getComputedStyle(el).marginTop) || 0) + add) + 'px'; });
        fix();
      });
    } catch (e) { console.error('wbo justify', e); }
    return r;
  };
  const _as = applySettings;
  applySettings = function () { const r = _as.apply(this, arguments); document.body.classList.toggle('wbo', on()); return r; };
})();

/* ===================== ตัวแก้รูปแบบคลิก (ไม่ต้องพิมพ์โค้ด) สำหรับรูปสไตล์แบบฝึก =====================
   ใช้กับรูปทุกชนิดที่วาดด้วยคำสั่ง (WB_LIB) · แต่ละบรรทัดคำสั่ง = 1 การ์ด มีช่องกรอกตัวเลข/ข้อความ ปุ่มสี
   ลากจุดสีส้มบนภาพตัวอย่างเพื่อย้ายตำแหน่ง · ปุ่ม "เพิ่ม" เพิ่มจุด เส้น กล่อง ข้อความ ฯลฯ · มีโหมดโค้ดสำหรับผู้ชำนาญ */
(function () {
  const st = document.createElement('style');
  st.textContent = `
#lbForm.wbmode{flex:0 1 540px!important;max-height:70vh}
.wbe{font-size:16px}.wbe .wbtop{display:flex;gap:6px;flex-wrap:wrap;align-items:center;margin:0 0 8px}
.wbe .wbadd{display:grid;grid-template-columns:repeat(4,1fr);gap:6px;margin:6px 0 10px;padding:8px;border:1px dashed var(--ui-line,#ccc);border-radius:10px;background:#fffaf5}
.wbe .wbadd button{font:inherit;font-size:15px;padding:7px 4px;border:1px solid #e3d6c9;border-radius:8px;background:#fff;cursor:pointer}.wbe .wbadd button:hover{background:#fdeee0}
.wbr{border:1px solid #e6dcd2;border-radius:10px;margin:0 0 6px;background:#fff}.wbr.on{border-color:#d9682b;box-shadow:0 0 0 2px #f7d9c2}
.wbr .wh{display:flex;align-items:center;gap:6px;padding:6px 8px;cursor:pointer}.wbr .wh b{min-width:92px;color:#7a3608}.wbr .wh .sum{flex:1;color:#666;font-size:14px;overflow:hidden;white-space:nowrap;text-overflow:ellipsis}
.wbr .wh button{border:1px solid #e3d6c9;background:#fff;border-radius:6px;width:30px;height:28px;cursor:pointer;font-size:14px}
.wbr .wf{display:none;padding:4px 10px 10px;border-top:1px dashed #eee}.wbr.on .wf{display:block}
.wbr .fr{display:flex;align-items:center;gap:6px;margin:5px 0;flex-wrap:wrap}.wbr .fr>label{min-width:84px;color:#555;font-size:15px}
.wbr input[type=number]{width:74px;font:inherit;font-size:16px;padding:3px 5px}.wbr input[type=text]{flex:1;min-width:140px;font:inherit;font-size:16px;padding:4px 7px}
.wbr .sw{width:26px;height:26px;border-radius:50%;border:2px solid #fff;box-shadow:0 0 0 1px #bbb;cursor:pointer;padding:0}.wbr .sw.on{box-shadow:0 0 0 3px #d9682b}.wbr .sw.none{background:repeating-linear-gradient(45deg,#fff 0 4px,#ddd 4px 8px)}
.wbr .pt{display:inline-flex;align-items:center;gap:3px;background:#faf6f1;border-radius:7px;padding:2px 5px}.wbr .pt small{color:#999}
.wbe details.wbframe{margin-top:10px;border-top:1px solid #eee;padding-top:6px}.wbe details.wbframe summary{cursor:pointer;font-weight:700;color:#7a3608}
.wbe .wbcode{width:100%;min-height:200px;font-size:15px;font-family:ui-monospace,Menlo,monospace}
#lbPrev .wbh-g{opacity:0;transition:opacity .12s}#lbPrev:hover .wbh-g,#lbPrev .wbh-g.sel{opacity:1}
.wbq{display:grid;grid-template-columns:auto minmax(0,1fr);gap:6px 8px;align-items:center;margin:0 0 10px}.wbq label{font-size:14.5px;color:#6b6158;white-space:nowrap}
.wbq input{font:inherit;font-size:16.5px;padding:5px 8px;min-width:0;width:100%;box-sizing:border-box}.wbq .qh{grid-column:1/-1;font-weight:700;color:#7a3608;font-size:14.5px;margin-top:4px}
.wbq-t{font-weight:700;color:#7a3608;margin:0 0 6px}.wbq-t small{font-weight:400;color:#8a8078}
.wbe details.wbadv{border-top:1px solid #eee;padding-top:6px;margin-top:4px}.wbe details.wbadv>summary{cursor:pointer;font-weight:700;color:#7a3608;margin-bottom:6px}
#lbPrev .wbh-dot{cursor:grab}#lbPrev .wbh-dot:hover{r:9}
.wbhint{font-size:14px;color:#8a6d55;margin:2px 0 8px}
.wbr.ov{border-color:#e39a3c}.wbr .ovt{flex:0 0 auto;font-size:13px;color:#b45f06;background:#fff3e0;border-radius:6px;padding:1px 6px}`;
  document.head.appendChild(st);

  const COLS = [['or', '#c8611a', 'ส้ม'], ['nv', '#2c4a7a', 'น้ำเงิน'], ['rd', '#a33424', 'แดง'], ['lo', '#e3a03c', 'ส้มอ่อน'], ['gn', '#2e7d32', 'เขียว'], ['pu', '#7b3f8c', 'ม่วง'], ['gr', '#8f8f8f', 'เทา'], ['bk', '#262626', 'ดำ']];
  const FILLS = [['', '', 'ไม่ระบาย'], ['pk', '#f8e4df', 'ชมพู'], ['lr', '#fbeeeb', 'ชมพูอ่อน'], ['bl', '#e6ebf5', 'ฟ้า'], ['cr', '#fdf0e3', 'ครีม'], ['wh', '#ffffff', 'ขาว'], ['#dcedc8', '#dcedc8', 'เขียวอ่อน'], ['#fbe3cc', '#fbe3cc', 'ส้มอ่อน']];
  const T = { // ชนิด: ชื่อไทย, จำนวนจุด (n=หลายจุด), ช่องเพิ่มเติม
    pt: ['จุด', 1, ['text:ชื่อจุด', 'c', 'pos', 'open', 'r:ขนาดจุด']], text: ['ข้อความ', 1, ['text:ข้อความ', 'c', 'size', 'bold', 'anchor']],
    seg: ['เส้นต่อจุด', 'n', ['c', 'w', 'dash', 'arrow']], line: ['เส้นตรงยาว', 2, ['c', 'w', 'dash', 'from', 'to']],
    rect: ['กล่องสี่เหลี่ยม', 2, ['text:ข้อความในกล่อง', 'c', 'fill', 'w', 'r:มุมมน', 'dash', 'shadow']], poly: ['รูปหลายเหลี่ยม', 'n', ['c', 'fill', 'w', 'dash']],
    circle: ['วงกลม', 1, ['rad', 'c', 'fill', 'w', 'dash']], arc: ['ส่วนโค้ง / วงรี', 1, ['arc', 'c', 'fill', 'w', 'dash']],
    curve: ['เส้นโค้ง', 3, ['c', 'w', 'dash']], smooth: ['เส้นโค้งผ่านจุด', 'n', ['c', 'w', 'dash']],
    node: ['วงกลมมีชื่อ', 1, ['text:ชื่อ', 'c', 'fill', 'r:ขนาด']], person: ['รูปคน', 1, ['c', 'size']],
    f: ['กราฟฟังก์ชัน', 0, ['expr', 'c', 'w', 'dash']], axes: ['ช่วงแกน x–y', 0, ['axes']], tree: ['แผนภาพต้นไม้', 0, ['tree']], '#': ['หัวข้อ (ป้ายกำกับ)', 0, ['note']]
  };
  const ADD = ['pt', 'text', 'seg', 'line', 'rect', 'poly', 'circle', 'arc', 'curve', 'smooth', 'node', 'person', 'f', 'tree', 'axes', '#'];
  const NUMRE = /\(\s*(-?\d*\.?\d+(?:\/\d+)?)\s*,\s*(-?\d*\.?\d+(?:\/\d+)?)\s*\)/;
  const num = v => { v = String(v).trim(); if (v.includes('/')) { const [a, b] = v.split('/'); return +a / +b; } return +v; };
  const r2 = v => Math.round(v * 100) / 100;

  /* ---------- แปลงบรรทัด ⇄ วัตถุ ---------- */
  function parse(line) {
    const L = line.trim(); if (!L) return null;
    if (L.startsWith('#')) return { k: '#', note: L.replace(/^#\s*/, '') };
    const bar = L.indexOf('|'), main = (bar < 0 ? L : L.slice(0, bar)).trim(), os = bar < 0 ? '' : L.slice(bar + 1).trim();
    const m = /^([a-zก-๙]+)\s*:\s*(.*)$/i.exec(main); if (!m) return { k: '?', raw: L };
    const k = m[1].toLowerCase(), o = { k, opt: {}, flags: {}, c: '' };
    os.split(/\s+/).filter(Boolean).forEach(t => { const q = /^([^=]+)=(.*)$/.exec(t); if (q) o.opt[q[1]] = q[2]; else if (/^(#[0-9a-f]{6}|or|nv|rd|lo|gr|bk|pu|gn|pk|bl|cr|wh|lr)$/i.test(t)) o.c = t; else o.flags[t] = 1; });
    let v = m[2];
    if (k === 'f') { const [e, a, b] = v.split(';').map(x => x.trim()); Object.assign(o, { expr: e || '', a: a || '', b: b || '' }); return o; }
    if (k === 'axes') { o.ax = v.trim().split(/[\s,]+/).map(num); return o; }
    if (k === 'tree') { o.lv = v.trim(); return o; }
    o.P = []; let n = (T[k] || [])[1]; const take = n === 'n' ? 99 : (n || 0);
    while (o.P.length < take) { const q = new RegExp('^\\s*' + NUMRE.source).exec(v); if (!q) break; o.P.push([num(q[1]), num(q[2])]); v = v.slice(q[0].length); }
    o.rest = v.trim();
    if (k === 'circle') o.rad = o.rest.split(/\s+/)[0] || '1';
    if (k === 'arc') o.arcv = o.rest.split(/\s+/).slice(0, 4);
    return o;
  }
  function ser(o) {
    if (o.k === '#') return '# ' + (o.note || '');
    if (o.k === '?') return o.raw;
    let v = '';
    if (o.k === 'f') v = [o.expr, o.a, o.b].filter((x, i) => x !== '' || i === 0).join(' ; ').replace(/( ; )+$/, '');
    else if (o.k === 'axes') v = (o.ax || []).join(' ');
    else if (o.k === 'tree') v = o.lv || '';
    else { v = (o.P || []).map(p => `(${r2(p[0])},${r2(p[1])})`).join(' '); const rest = o.k === 'circle' ? o.rad : o.k === 'arc' ? (o.arcv || []).join(' ') : o.rest; if (rest) v += ' ' + rest; }
    const opts = [o.c].concat(Object.keys(o.flags || {})).concat(Object.entries(o.opt || {}).filter(([, x]) => x !== '' && x !== undefined).map(([a, b]) => a + '=' + b)).filter(Boolean);
    return `${o.k}: ${v}${opts.length ? ' | ' + opts.join(' ') : ''}`;
  }
  const sumOf = o => o.k === '#' ? (o.note || '') : o.k === 'f' ? 'y = ' + (o.expr || '') : o.k === 'axes' ? (o.ax || []).join(' ') : o.k === 'tree' ? o.lv : ((o.rest && o.k !== 'circle' && o.k !== 'arc') ? o.rest + ' ' : '') + (o.P || []).map(p => `(${r2(p[0])}, ${r2(p[1])})`).join(' ');

  /* ---------- สถานะ ---------- */
  let objs = [], sel = -1, ta = null;
  const isWB = () => typeof WB_LIB === 'object' && WB_LIB[libKind];
  function push(rebuildCards) { ta.value = objs.map(ser).join('\n'); libPrev(); if (rebuildCards) cards(); else { const c = $(`.wbr[data-i="${sel}"] .sum`); if (c && objs[sel]) c.textContent = sumOf(objs[sel]); } }
  const frame = () => { const g = k => num(($(`#lbForm [data-k="${k}"]`) || {}).value); const sx = g('sx') || 40; return { x0: g('x0'), x1: g('x1'), y0: g('y0'), y1: g('y1'), sx, sy: g('sy') || sx, ax: ($('#lbForm [data-k="ax"]') || {}).value === 'yes' }; };

  /* ---------- การ์ด ---------- */
  function swatches(list, cur, key) { return list.map(([v, hex, nm]) => `<button class="sw${v === '' ? ' none' : ''}${(cur || '') === v ? ' on' : ''}" title="${nm}" data-sw="${key}" data-v="${v}" style="${hex ? 'background:' + hex : ''}"></button>`).join('') + `<input type="color" data-swc="${key}" value="${/^#/.test(cur || '') ? cur : '#888888'}" title="สีอื่น" style="width:34px;height:28px;padding:0;border:0">`; }
  function fields(o, i) {
    const t = T[o.k] || ['คำสั่ง', 0, []]; let h = '';
    if (o.k === '?') return `<div class="fr"><input type="text" data-f="raw" value="${esc(o.raw)}"></div>`;
    if (o.P) { h += `<div class="fr"><label>${t[1] === 2 && o.k === 'rect' ? 'มุมตรงข้าม' : 'ตำแหน่ง'}</label>${o.P.map((p, j) => `<span class="pt"><small>${o.P.length > 1 ? j + 1 + '.' : ''}x</small><input type="number" step="0.1" data-px="${j}" value="${r2(p[0])}"><small>y</small><input type="number" step="0.1" data-py="${j}" value="${r2(p[1])}">${t[1] === 'n' && o.P.length > 2 ? `<button class="tb" data-pdel="${j}" title="ลบจุดนี้">✕</button>` : ''}</span>`).join(' ')}${t[1] === 'n' ? '<button class="tb" data-padd="1">+ เพิ่มจุด</button>' : ''}</div>`; }
    t[2].forEach(f => {
      const [key, lab] = f.split(':');
      if (key === 'text') h += `<div class="fr"><label>${lab}</label><input type="text" data-f="rest" value="${esc(o.rest || '')}" placeholder="เช่น P(2, 3) หรือ y = x^2"></div>`;
      if (key === 'c') h += `<div class="fr"><label>สี</label>${swatches(COLS, o.c, 'c')}</div>`;
      if (key === 'fill') h += `<div class="fr"><label>สีพื้น</label>${swatches(FILLS, o.opt.fill || '', 'fill')}</div>`;
      if (key === 'w') h += `<div class="fr"><label>ความหนา</label><input type="number" step="0.2" min="0.5" data-o="w" value="${o.opt.w || ''}" placeholder="ปกติ"></div>`;
      if (key === 'r') h += `<div class="fr"><label>${lab}</label><input type="number" step="1" min="0" data-o="r" value="${o.opt.r || ''}" placeholder="ปกติ"></div>`;
      if (key === 'size') h += `<div class="fr"><label>ขนาดตัวอักษร</label><input type="number" step="1" min="8" data-o="size" value="${o.opt.size || ''}" placeholder="ปกติ"></div>`;
      if (key === 'from') h += `<div class="fr"><label>ช่วง x</label>จาก <input type="number" step="0.1" data-o="from" value="${o.opt.from ?? ''}" placeholder="สุดขอบ"> ถึง <input type="number" step="0.1" data-o="to" value="${o.opt.to ?? ''}" placeholder="สุดขอบ"></div>`;
      if (['dash', 'arrow', 'open', 'bold', 'shadow'].includes(key)) h += `<label style="margin-right:12px;font-size:15px"><input type="checkbox" data-fl="${key}" ${o.flags[key] ? 'checked' : ''}> ${{ dash: 'เส้นประ', arrow: 'หัวลูกศร', open: 'จุดโปร่ง (วงกลมกลวง)', bold: 'ตัวหนา', shadow: 'เงา' }[key]}</label>`;
      if (key === 'pos') h += `<div class="fr"><label>ตำแหน่งชื่อ</label><select data-o="pos">${[['ne', 'บนขวา'], ['nw', 'บนซ้าย'], ['se', 'ล่างขวา'], ['sw', 'ล่างซ้าย'], ['n', 'บน'], ['s', 'ล่าง'], ['e', 'ขวา'], ['w', 'ซ้าย']].map(([v, n]) => `<option value="${v}"${(o.opt.pos || 'ne') === v ? ' selected' : ''}>${n}</option>`).join('')}</select></div>`;
      if (key === 'anchor') h += `<div class="fr"><label>จัดข้อความ</label><select data-o="anchor">${[['middle', 'กึ่งกลาง'], ['start', 'ชิดซ้าย'], ['end', 'ชิดขวา']].map(([v, n]) => `<option value="${v}"${(o.opt.anchor || 'middle') === v ? ' selected' : ''}>${n}</option>`).join('')}</select></div>`;
      if (key === 'rad') h += `<div class="fr"><label>รัศมี</label><input type="number" step="0.1" min="0.1" data-f="rad" value="${o.rad || 1}"></div>`;
      if (key === 'arc') { const a = o.arcv || ['2', '1', '0', '180']; h += `<div class="fr"><label>รัศมี</label>แนวนอน <input type="number" step="0.1" data-arc="0" value="${a[0]}"> แนวตั้ง <input type="number" step="0.1" data-arc="1" value="${a[1]}"></div><div class="fr"><label>มุม (องศา)</label>เริ่ม <input type="number" step="5" data-arc="2" value="${a[2]}"> จบ <input type="number" step="5" data-arc="3" value="${a[3]}"></div>`; }
      if (key === 'expr') h += `<div class="fr"><label>y =</label><input type="text" data-f="expr" value="${esc(o.expr || '')}" placeholder="เช่น x^2 - 2x + 1"></div><div class="fr"><label>ช่วง x</label>จาก <input type="number" step="0.1" data-f="a" value="${o.a}" placeholder="สุดขอบ"> ถึง <input type="number" step="0.1" data-f="b" value="${o.b}" placeholder="สุดขอบ"></div>`;
      if (key === 'axes') { const a = o.ax || [-3, 3, -3, 3]; h += `<div class="fr"><label>แกน x</label>จาก <input type="number" step="0.5" data-ax="0" value="${a[0]}"> ถึง <input type="number" step="0.5" data-ax="1" value="${a[1]}"></div><div class="fr"><label>แกน y</label>จาก <input type="number" step="0.5" data-ax="2" value="${a[2]}"> ถึง <input type="number" step="0.5" data-ax="3" value="${a[3]}"></div>`; }
      if (key === 'tree') h += `<div class="fr"><label>กิ่งแต่ละชั้น</label><input type="text" data-f="lv" value="${esc(o.lv || '')}" placeholder="ชั้นคั่นด้วย ; กิ่งคั่นด้วย , เช่น H,T ; H,T"></div><div class="fr"><label>แบบ</label><select data-o="mode"><option value="edge"${o.opt.mode !== 'node' ? ' selected' : ''}>ชื่ออยู่บนกิ่ง</option><option value="node"${o.opt.mode === 'node' ? ' selected' : ''}>ชื่ออยู่ในวงกลม</option></select></div><div class="fr"><label>ผลลัพธ์ปลายกิ่ง</label><input type="text" data-o="out" value="${esc(o.opt.out || '')}" placeholder="คั่นด้วย ; (เว้นว่างได้)"></div><div class="fr"><label>ขนาด</label>กว้าง <input type="number" step="0.5" data-o="w" value="${o.opt.w || 10}"> สูง <input type="number" step="0.5" data-o="h" value="${o.opt.h || 8}"></div><label><input type="checkbox" data-fl="outbox" ${o.flags.outbox ? 'checked' : ''}> กล่องว่างท้ายกิ่ง</label>`;
      if (key === 'note') h += `<div class="fr"><input type="text" data-f="note" value="${esc(o.note || '')}" placeholder="ป้ายกำกับ เช่น ทางถนน (ไม่แสดงในรูป)"></div>`;
    });
    return h;
  }
  const QK = { text: ['ข้อความ', 'rest'], pt: ['ชื่อจุด', 'rest'], node: ['ชื่อในวงกลม', 'rest'], rect: ['ข้อความในกล่อง', 'rest'], f: ['กราฟ y =', 'expr'], tree: ['กิ่งแต่ละชั้น', 'lv'] };
  function quick() { // ค่าที่แก้บ่อย (ข้อความ ชื่อจุด สูตรกราฟ) รวมไว้ด้านบน ไม่ต้องยุ่งกับพิกัด
    const box = $('#wbQuick'); if (!box) return; if (box.contains(document.activeElement)) return;
    let h = '', n = 0;
    objs.forEach((o, i) => { if (o.k === '#') { if (o.note) h += `<div class="qh">${esc(o.note)}</div>`; return; } const q = QK[o.k]; if (!q) return; const v = o[q[1]] || ''; if (!v && o.k !== 'text' && o.k !== 'f') return; n++; h += `<label>${q[0]}</label><input type="text" data-q="${i}" data-qf="${q[1]}" value="${esc(v)}">`; });
    h = h.replace(/(<div class="qh">[^<]*<\/div>)+(?=<div class="qh">|$)/g, '');
    box.innerHTML = n ? `<div class="wbq-t">ข้อความและสูตรในรูป <small>พิมพ์แก้ได้เลย · ตัวยก x^2 ตัวห้อย x_1</small></div><div class="wbq">${h}</div>` : '';
    const adv = $('.wbe details.wbadv'); if (adv && !n) adv.open = true;
  }
  function cards() { quick(); setTimeout(() => { if (typeof markOv === 'function') markOv(); }, 0);
    const box = $('#wbCards'); if (!box) return;
    box.innerHTML = objs.map((o, i) => `<div class="wbr${i === sel ? ' on' : ''}" data-i="${i}"><div class="wh"><b>${(T[o.k] || ['คำสั่ง'])[0]}</b><span class="sum">${esc(sumOf(o))}</span><button data-mv="-1" title="เลื่อนขึ้น">↑</button><button data-mv="1" title="เลื่อนลง">↓</button><button data-dup="1" title="ทำซ้ำ">⧉</button><button data-del="1" title="ลบ">✕</button></div><div class="wf">${i === sel ? fields(o, i) : ''}</div></div>`).join('') || '<p class="wbhint">ยังไม่มีของในรูป กด “+ เพิ่ม” เพื่อเริ่ม</p>';
  }
  function select(i) { sel = sel === i ? -1 : i; cards(); handles(); const c = $(`.wbr[data-i="${sel}"]`); if (c) c.scrollIntoView({ block: 'nearest' }); }

  function newObj(k) {
    const F = frame(), cx = r2((F.x0 + F.x1) / 2), cy = r2((F.y0 + F.y1) / 2), dx = r2((F.x1 - F.x0) / 6), dy = r2((F.y1 - F.y0) / 6);
    const o = { k, opt: {}, flags: {}, c: '' };
    if (k === '#') return { k, note: 'หัวข้อ' };
    if (k === 'f') return Object.assign(o, { expr: 'x^2', a: '', b: '', c: 'or' });
    if (k === 'axes') return Object.assign(o, { ax: [r2(F.x0 + dx / 2), r2(F.x1 - dx / 2), r2(F.y0 + dy / 2), r2(F.y1 - dy / 2)] });
    if (k === 'tree') return Object.assign(o, { lv: 'H,T ; H,T', opt: { at: `(${r2(F.x0 + dx / 2)},${r2(F.y1 - dy / 2)})`, w: r2(dx * 4), h: r2(dy * 4) } });
    const P = { pt: [[cx, cy]], text: [[cx, cy]], node: [[cx, cy]], person: [[cx, cy]], circle: [[cx, cy]], arc: [[cx, cy]], seg: [[cx - dx, cy], [cx + dx, cy]], line: [[cx - dx, cy - dy], [cx + dx, cy + dy]], smooth: [[cx - dx, cy], [cx, cy + dy], [cx + dx, cy]], curve: [[cx - dx, cy], [cx, cy + 2 * dy], [cx + dx, cy]], rect: [[cx - dx, cy - dy], [cx + dx, cy + dy]], poly: [[cx - dx, cy - dy], [cx + dx, cy - dy], [cx, cy + dy]] }[k];
    o.P = P.map(p => p.map(r2)); o.rest = { pt: 'A', text: 'ข้อความ', node: 'A' }[k] || '';
    if (k === 'circle') o.rad = String(r2(Math.min(dx, dy))); if (k === 'arc') o.arcv = [String(dx), String(dy / 2), '0', '180'];
    return o;
  }

  /* ---------- จุดลากบนภาพตัวอย่าง ---------- */
  function handles() {
    const svg = $('#lbPrev svg'); if (!svg || !isWB()) return;
    $$('.wbh-g', svg).forEach(g => g.remove());
    const F = frame(), pT = F.ax ? 26 : 14, X = x => 14 + (x - F.x0) * F.sx, Y = y => pT + (F.y1 - y) * F.sy;
    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g'); g.setAttribute('class', 'wbh-g' + (sel >= 0 ? ' sel' : ''));
    const list = sel >= 0 ? [sel] : objs.map((_, i) => i);
    list.forEach(i => { const o = objs[i]; (o && o.P || []).forEach((p, j) => { const c = document.createElementNS('http://www.w3.org/2000/svg', 'circle'); c.setAttribute('cx', X(p[0])); c.setAttribute('cy', Y(p[1])); c.setAttribute('r', sel >= 0 ? 7 : 4); c.setAttribute('fill', sel >= 0 ? 'rgba(217,104,43,.55)' : 'rgba(44,74,122,.12)'); c.setAttribute('stroke', sel >= 0 ? '#d9682b' : 'rgba(44,74,122,.35)'); c.setAttribute('class', 'wbh-dot'); c.dataset.i = i; c.dataset.j = j; g.appendChild(c); }); });
    svg.appendChild(g);
  }
  let drag = null;
  document.addEventListener('pointerdown', e => {
    const d = e.target.closest && e.target.closest('#lbPrev .wbh-dot'); if (!d || !isWB()) return;
    e.preventDefault(); const svg = d.ownerSVGElement; const i = +d.dataset.i; { const adv = $('.wbe details.wbadv'); if (adv) adv.open = true; } if (sel !== i) { sel = i; cards(); }
    drag = { svg, i, j: +d.dataset.j }; svg.setPointerCapture && svg.setPointerCapture(e.pointerId);
  });
  document.addEventListener('pointermove', e => {
    if (!drag) return; const F = frame(), pT = F.ax ? 26 : 14;
    const svg = $('#lbPrev svg'); if (!svg) return; const pt = svg.createSVGPoint(); pt.x = e.clientX; pt.y = e.clientY; const q = pt.matrixTransform(svg.getScreenCTM().inverse());
    const st = Math.max(0.05, Math.pow(10, Math.floor(Math.log10((F.x1 - F.x0) / 40))));
    const snap = v => Math.round(v / st) * st;
    const o = objs[drag.i]; o.P[drag.j] = [r2(snap(F.x0 + (q.x - 14) / F.sx)), r2(snap(F.y1 - (q.y - pT) / F.sy))];
    ta.value = objs.map(ser).join('\n'); libPrev();
    const ix = $(`.wbr[data-i="${drag.i}"] [data-px="${drag.j}"]`), iy = $(`.wbr[data-i="${drag.i}"] [data-py="${drag.j}"]`); if (ix) ix.value = o.P[drag.j][0]; if (iy) iy.value = o.P[drag.j][1];
    const s = $(`.wbr[data-i="${drag.i}"] .sum`); if (s) s.textContent = sumOf(o);
  });
  document.addEventListener('pointerup', () => { if (drag) { drag = null; handles(); } });
  // วาดจุดลากใหม่ทุกครั้งที่ภาพตัวอย่างเปลี่ยน
  function markOv() {
    if (!ta) return; const ov = new Set(window.__wbOv || []); const raw = ta.value.split('\n'); let k = -1; const map = {}; raw.forEach((l, i) => { if (l.trim()) { k++; map[i] = k; } });
    const bad = new Set([...ov].map(i => map[i]));
    $$('#wbCards .wbr').forEach(c => { const on = bad.has(+c.dataset.i); c.classList.toggle('ov', on); let t = c.querySelector('.ovt'); if (on && !t) { t = document.createElement('span'); t.className = 'ovt'; t.textContent = '⚠ ข้อความทับ'; t.title = 'ข้อความนี้ยังทับเส้นหรือข้อความอื่น ลองลากจุดหรือเปลี่ยนตำแหน่งชื่อ'; c.querySelector('.sum').after(t); } else if (!on && t) t.remove(); });
  }
  const _lp = libPrev; libPrev = function () { const r = _lp.apply(this, arguments); if (isWB() && $('#wbCards')) { handles(); markOv(); } return r; };

  /* ---------- สร้างตัวแก้เมื่อเปิดรูปชนิดนี้ ---------- */
  const _le = libEnhance;
  libEnhance = function () {
    _le.apply(this, arguments);
    const form = $('#lbForm'); form.classList.toggle('wbmode', !!isWB());
    if (!isWB()) return;
    ta = $('#lbForm [data-k="src"]'); if (!ta) return;
    objs = ta.value.split('\n').map(parse).filter(Boolean); sel = -1;
    const srcRow = ta.closest('.row'); const rows = $$('#lbForm > .row').filter(r => r !== srcRow);
    const help = $('#lbForm .fnhelpbox'); if (help) help.remove();
    const ed = document.createElement('div'); ed.className = 'wbe';
    ed.innerHTML = `<div id="wbQuick"></div><details class="wbadv"><summary>ตำแหน่ง สี เพิ่มหรือลบชิ้นส่วน (แก้ละเอียด)</summary><div class="wbhint">คลิกการ์ดเพื่อแก้ · <b>ลากจุดบนภาพตัวอย่าง</b>เพื่อย้ายตำแหน่ง</div>
<div class="wbtop"><button class="tb primary" data-wb="add">+ เพิ่ม</button><button class="tb" data-wb="code">แก้แบบโค้ด (ขั้นสูง)</button></div>
<div class="wbadd" style="display:none">${ADD.map(k => `<button data-new="${k}">${T[k][0]}</button>`).join('')}</div>
<div id="wbCards"></div><textarea class="wbcode" style="display:none"></textarea></details>
<details class="wbframe"><summary>ขนาดรูป แกน และเส้นตาราง</summary></details>`;
    srcRow.style.display = 'none'; form.insertBefore(ed, form.firstChild);
    const det = $('details.wbframe', ed); rows.forEach(r => det.appendChild(r));
    cards(); handles();
    ed.addEventListener('focusin', e => { const t = e.target; if (t.dataset && t.dataset.q !== undefined) { sel = +t.dataset.q; handles(); } });
    const code = $('.wbcode', ed);
    ed.onclick = e => {
      const b = e.target.closest('button'), card = e.target.closest('.wbr'); if (!b && !card) return;
      if (b && b.dataset.wb === 'add') { const a = $('.wbadd', ed); a.style.display = a.style.display === 'none' ? 'grid' : 'none'; return; }
      if (b && b.dataset.wb === 'code') { const on = code.style.display === 'none'; code.style.display = on ? 'block' : 'none'; $('#wbCards').style.display = on ? 'none' : ''; code.value = ta.value; b.textContent = on ? 'กลับไปแก้แบบคลิก' : 'แก้แบบโค้ด (ขั้นสูง)'; if (!on) { objs = ta.value.split('\n').map(parse).filter(Boolean); cards(); handles(); } return; }
      if (b && b.dataset.new) { objs.push(newObj(b.dataset.new)); sel = objs.length - 1; $('.wbadd', ed).style.display = 'none'; push(true); handles(); return; }
      if (!card) return; const i = +card.dataset.i, o = objs[i];
      if (b && b.dataset.del) { objs.splice(i, 1); sel = -1; push(true); return; }
      if (b && b.dataset.dup) { objs.splice(i + 1, 0, JSON.parse(JSON.stringify(o))); sel = i + 1; push(true); return; }
      if (b && b.dataset.mv) { const j = i + +b.dataset.mv; if (j < 0 || j >= objs.length) return; [objs[i], objs[j]] = [objs[j], objs[i]]; sel = j; push(true); return; }
      if (b && b.dataset.sw) { const k = b.dataset.sw, v = b.dataset.v; if (k === 'c') o.c = v; else o.opt[k] = v; push(true); return; }
      if (b && b.dataset.padd) { const l = o.P[o.P.length - 1]; o.P.push([r2(l[0] + 0.5), r2(l[1])]); push(true); return; }
      if (b && b.dataset.pdel) { o.P.splice(+b.dataset.pdel, 1); push(true); return; }
      if (!b && e.target.closest('.wh')) select(i);
    };
    ed.addEventListener('input', e => {
      const t = e.target; if (t === code) { ta.value = code.value; libPrev(); return; }
      if (t.dataset.q !== undefined) { const o = objs[+t.dataset.q]; if (o) { o[t.dataset.qf] = t.value; e.stopPropagation(); ta.value = objs.map(ser).join('\n'); libPrev(); cards(); } return; }
      const card = t.closest('.wbr'); if (!card) return; const o = objs[+card.dataset.i]; const d = t.dataset;
      if (d.px !== undefined) o.P[+d.px][0] = num(t.value || 0); else if (d.py !== undefined) o.P[+d.py][1] = num(t.value || 0);
      else if (d.f) o[d.f] = t.value; else if (d.o) o.opt[d.o] = t.value; else if (d.arc !== undefined) { o.arcv = o.arcv || ['2', '1', '0', '180']; o.arcv[+d.arc] = t.value; }
      else if (d.ax !== undefined) { o.ax = o.ax || [0, 0, 0, 0]; o.ax[+d.ax] = num(t.value || 0); }
      else if (d.swc) { if (d.swc === 'c') o.c = t.value; else o.opt[d.swc] = t.value; }
      else return;
      e.stopPropagation(); push(false);
    }, true);
    ed.addEventListener('change', e => { const t = e.target; const card = t.closest('.wbr'); if (!card) return; const o = objs[+card.dataset.i]; if (t.dataset.fl) { if (t.checked) o.flags[t.dataset.fl] = 1; else delete o.flags[t.dataset.fl]; e.stopPropagation(); push(false); } else if (t.tagName === 'SELECT' && t.dataset.o) { o.opt[t.dataset.o] = t.value; e.stopPropagation(); push(false); } }, true);
  };
})();

