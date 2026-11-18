'use strict';
/* ===================== ไอคอน · คลังรูปพื้นฐาน · บุคคลสำคัญ ===================== */
const CL = { dark: '#401a01', brown: '#713408', gold: '#b8860b', orange: '#d9682b', gray: '#9aa3af', light: '#e5e7eb', teal: '#2b7a8c', red: '#c0392b', navy: '#2c4a7a', purple: '#7b3f8c', green: '#2e7d32', cream: '#fdf6ec' };
const svgI = (body, vb = '0 0 24 24') => `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="${vb}">${body}</svg>`;
const person = c => `<circle cx="12" cy="7" r="4.3" fill="${c}"/><path d="M3.8 22.5c0-5.2 3.7-8.8 8.2-8.8s8.2 3.6 8.2 8.8z" fill="${c}"/>`;
const pip = (x, y) => `<circle cx="${x}" cy="${y}" r="1.7" fill="#401a01"/>`;
const DICE = { 1: [[12, 12]], 2: [[7.5, 7.5], [16.5, 16.5]], 3: [[7, 7], [12, 12], [17, 17]], 4: [[7.5, 7.5], [16.5, 7.5], [7.5, 16.5], [16.5, 16.5]], 5: [[7, 7], [17, 7], [12, 12], [7, 17], [17, 17]], 6: [[7.5, 6.5], [16.5, 6.5], [7.5, 12], [16.5, 12], [7.5, 17.5], [16.5, 17.5]] };
const dice = n => `<rect x="2" y="2" width="20" height="20" rx="4" fill="#fff" stroke="#401a01" stroke-width="1.5"/>${DICE[n].map(([x, y]) => pip(x, y)).join('')}`;
const ball = c => `<circle cx="12" cy="12" r="9.5" fill="${c}" stroke="#401a01" stroke-width=".8"/><ellipse cx="8.8" cy="8.3" rx="3" ry="2" fill="#fff" opacity=".55"/>`;
const ICONS = {
  'คน (แดง)': person(CL.red), 'คน (น้ำเงิน)': person(CL.navy), 'คน (ม่วง)': person(CL.purple), 'คน (น้ำตาล)': person(CL.brown), 'คน (เขียว)': person(CL.green),
  'กลุ่มคน': `<g transform="translate(-4 2) scale(.8)">${person(CL.navy)}</g><g transform="translate(8 2) scale(.8)">${person(CL.red)}</g><g transform="translate(2 -1) scale(.85)">${person(CL.brown)}</g>`,
  'ภาพสัญลักษณ์บุคคล': `<defs><linearGradient id="gp" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f8e3da"/><stop offset="1" stop-color="#e8a08a"/></linearGradient></defs><rect x="1.5" y="1" width="21" height="22" rx="3" fill="url(#gp)" stroke="#c98b78" stroke-width=".7"/><circle cx="12" cy="8.6" r="4.6" fill="#7a2614"/><path d="M3.5 23c0-6 3.8-9.2 8.5-9.2s8.5 3.2 8.5 9.2z" fill="#7a2614"/>`,
  'บีกเกอร์ (กิจกรรม)': `<path d="M8.5 2.5h7M9.7 2.5v6.3L4.2 19.6A1.6 1.6 0 0 0 5.6 22h12.8a1.6 1.6 0 0 0 1.4-2.4L14.3 8.8V2.5" fill="none" stroke="${CL.brown}" stroke-width="1.8" stroke-linejoin="round"/><path d="M6.6 15.5h10.8l2 4.1a.8.8 0 0 1-.7 1.2H5.3a.8.8 0 0 1-.7-1.2z" fill="${CL.orange}" opacity=".75"/>`,
  'ดินสอ': `<path d="M4 20l1.2-4.6L15.8 4.8a2 2 0 0 1 2.8 0l.6.6a2 2 0 0 1 0 2.8L8.6 18.8z" fill="#f3c26b" stroke="${CL.brown}" stroke-width="1.4" stroke-linejoin="round"/><path d="M4 20l1.2-4.6 3.4 3.4z" fill="${CL.brown}"/>`,
  'หนังสือ': `<path d="M3 5.5c3-1.4 6-1.4 9 .5v14c-3-1.9-6-1.9-9-.5z" fill="#fff" stroke="${CL.brown}" stroke-width="1.4"/><path d="M21 5.5c-3-1.4-6-1.4-9 .5v14c3-1.9 6-1.9 9-.5z" fill="${CL.cream}" stroke="${CL.brown}" stroke-width="1.4"/>`,
  'หลอดไฟ (ไอเดีย)': `<path d="M12 2.5a6.5 6.5 0 0 0-3.8 11.8c.7.5 1.1 1.3 1.1 2.1v.9h5.4v-.9c0-.8.4-1.6 1.1-2.1A6.5 6.5 0 0 0 12 2.5z" fill="#ffd95a" stroke="${CL.brown}" stroke-width="1.3"/><path d="M9.5 19.5h5M10.3 21.7h3.4" stroke="${CL.brown}" stroke-width="1.5" stroke-linecap="round"/>`,
  'ดาว': `<path d="M12 2.6l2.8 6 6.5.7-4.9 4.4 1.4 6.4L12 16.8l-5.8 3.3 1.4-6.4-4.9-4.4 6.5-.7z" fill="#f2b632" stroke="${CL.brown}" stroke-width="1" stroke-linejoin="round"/>`,
  'ถูก': `<circle cx="12" cy="12" r="10" fill="${CL.green}"/><path d="M7 12.5l3.2 3.2L17.2 8.6" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>`,
  'ผิด': `<circle cx="12" cy="12" r="10" fill="${CL.red}"/><path d="M8 8l8 8M16 8l-8 8" stroke="#fff" stroke-width="2.4" stroke-linecap="round"/>`,
  'ระวัง': `<path d="M12 2.8L22 20.5H2z" fill="#f2b632" stroke="${CL.brown}" stroke-width="1.3" stroke-linejoin="round"/><path d="M12 9v5.5" stroke="${CL.dark}" stroke-width="2.2" stroke-linecap="round"/><circle cx="12" cy="17.6" r="1.3" fill="${CL.dark}"/>`,
  'ธง': `<path d="M5 22V3" stroke="${CL.dark}" stroke-width="1.8" stroke-linecap="round"/><path d="M5.8 3.5h12l-2.8 4 2.8 4h-12z" fill="${CL.red}"/>`,
  'เป้าหมาย': `<circle cx="12" cy="12" r="10" fill="#fff" stroke="${CL.red}" stroke-width="2"/><circle cx="12" cy="12" r="6" fill="#fff" stroke="${CL.red}" stroke-width="2"/><circle cx="12" cy="12" r="2.3" fill="${CL.red}"/>`,
  'ลูกเต๋า 1': dice(1), 'ลูกเต๋า 2': dice(2), 'ลูกเต๋า 3': dice(3), 'ลูกเต๋า 4': dice(4), 'ลูกเต๋า 5': dice(5), 'ลูกเต๋า 6': dice(6),
  'เหรียญหัว (H)': `<circle cx="12" cy="12" r="10" fill="#f2c94c" stroke="#a87b12" stroke-width="1.4"/><circle cx="12" cy="12" r="7.6" fill="none" stroke="#a87b12" stroke-width=".8"/><text x="12" y="16.3" font-family="KaTeX_Main,serif" font-size="11.5" font-weight="700" text-anchor="middle" fill="#6b4a00">H</text>`,
  'เหรียญก้อย (T)': `<circle cx="12" cy="12" r="10" fill="#d9dde3" stroke="#7d8590" stroke-width="1.4"/><circle cx="12" cy="12" r="7.6" fill="none" stroke="#7d8590" stroke-width=".8"/><text x="12" y="16.3" font-family="KaTeX_Main,serif" font-size="11.5" font-weight="700" text-anchor="middle" fill="#3b424b">T</text>`,
  'ลูกบอลแดง': ball(CL.red), 'ลูกบอลน้ำเงิน': ball('#3567b5'), 'ลูกบอลเขียว': ball('#3c9a4f'), 'ลูกบอลเหลือง': ball('#f2c94c'), 'ลูกบอลขาว': ball('#ffffff'),
  'ไพ่': `<rect x="5" y="2" width="14" height="20" rx="2" fill="#fff" stroke="${CL.dark}" stroke-width="1.3"/><text x="8" y="8.5" font-family="KaTeX_Main,serif" font-size="6" fill="${CL.red}">A</text><path d="M12 17.3s-4-2.6-4-5.1a2.1 2.1 0 0 1 4-1 2.1 2.1 0 0 1 4 1c0 2.5-4 5.1-4 5.1z" fill="${CL.red}"/>`,
  'เก้าอี้': `<path d="M7 3v18M7 12h10v9M7 12h10" stroke="${CL.brown}" stroke-width="2" fill="none" stroke-linecap="round"/><rect x="6" y="10.5" width="12" height="2.6" rx="1" fill="${CL.orange}"/>`,
  'กล่อง': `<path d="M3 8l9-4 9 4v9l-9 4-9-4z" fill="${CL.cream}" stroke="${CL.brown}" stroke-width="1.3" stroke-linejoin="round"/><path d="M3 8l9 4 9-4M12 12v9" fill="none" stroke="${CL.brown}" stroke-width="1.3"/>`,
  'ถุง': `<path d="M8 6.5c0-2 1.8-3.5 4-3.5s4 1.5 4 3.5" fill="none" stroke="${CL.brown}" stroke-width="1.5"/><path d="M5 7h14l1.5 14.5h-17z" fill="#e9c9a5" stroke="${CL.brown}" stroke-width="1.4" stroke-linejoin="round"/>`,
  'บ้าน': `<path d="M3 11.5L12 4l9 7.5" fill="none" stroke="${CL.brown}" stroke-width="1.8" stroke-linejoin="round"/><path d="M5.5 10v10.5h13V10" fill="${CL.cream}" stroke="${CL.brown}" stroke-width="1.5"/><rect x="10" y="14" width="4" height="6.5" fill="${CL.orange}"/>`,
  'นาฬิกา': `<circle cx="12" cy="12" r="9.5" fill="#fff" stroke="${CL.brown}" stroke-width="1.6"/><path d="M12 6.5V12l4 2.5" fill="none" stroke="${CL.dark}" stroke-width="1.8" stroke-linecap="round"/>`,
  'เครื่องคิดเลข': `<rect x="5" y="2" width="14" height="20" rx="2" fill="${CL.cream}" stroke="${CL.brown}" stroke-width="1.4"/><rect x="7.5" y="4.5" width="9" height="4" fill="#cfe3d4"/>${[0, 1, 2].map(r => [0, 1, 2].map(c => `<rect x="${7.5 + c * 3.2}" y="${11 + r * 3.4}" width="2.4" height="2.4" rx=".5" fill="${CL.brown}"/>`).join('')).join('')}`,
  'ลูกศรขวา': `<path d="M3 12h15M13 6.5l5.5 5.5-5.5 5.5" fill="none" stroke="${CL.brown}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>`,
  'มือชี้': `<path d="M3 11h9.5a1.6 1.6 0 0 0 0-3.2H8.5" fill="none" stroke="${CL.brown}" stroke-width="1.5" stroke-linecap="round"/><path d="M8.5 7.8h-1C5 7.8 3 10 3 13v1.5c0 3 2.4 5.5 5.5 5.5h5a2 2 0 0 0 0-4h1a1.9 1.9 0 0 0 0-3.8" fill="#f6dcc6" stroke="${CL.brown}" stroke-width="1.4" stroke-linejoin="round"/>`,
  'ถ้วยรางวัล': `<path d="M7 3h10v5a5 5 0 0 1-10 0z" fill="#f2b632" stroke="${CL.brown}" stroke-width="1.3"/><path d="M7 5H4v1.5A3.5 3.5 0 0 0 7.5 10M17 5h3v1.5A3.5 3.5 0 0 1 16.5 10" fill="none" stroke="${CL.brown}" stroke-width="1.3"/><path d="M12 13v4M8 21h8l-1-4H9z" fill="#f2b632" stroke="${CL.brown}" stroke-width="1.3" stroke-linejoin="round"/>`,
};
function iconSVG(name) { const b = ICONS[name]; return b ? svgI(b) : ''; }
function renderIcons(root) { $$('.ic', root).forEach(s => { s.setAttribute('contenteditable', 'false'); if (!s.firstChild) s.innerHTML = iconSVG(s.dataset.ic); }); }
function buildIconMenu() {
  const m = $('#mIcon');
  m.innerHTML = `<div class="icgrid">${Object.keys(ICONS).map(k => `<button data-ic="${esc(k)}" title="${esc(k)}">${iconSVG(k)}</button>`).join('')}</div><div class="hint" style="padding:4px 6px">ไอคอนจะอยู่ในบรรทัดข้อความ · เปลี่ยนขนาดด้วยปุ่มขนาดตัวอักษร</div>`;
  m.addEventListener('mousedown', e => e.preventDefault());
  m.onclick = e => {
    const b = e.target.closest('[data-ic]'); if (!b) return; closeMenus();
    restoreSel(); const ed = curEditable(); if (!ed) { toast('คลิกตำแหน่งในข้อความที่จะใส่ไอคอนก่อน'); return; }
    const r = getSelection().getRangeAt(0); const sp = document.createElement('span'); sp.className = 'ic'; sp.dataset.ic = b.dataset.ic; sp.setAttribute('contenteditable', 'false'); sp.innerHTML = iconSVG(b.dataset.ic);
    r.deleteContents(); r.insertNode(document.createTextNode('​')); r.insertNode(sp);
    const nr = document.createRange(); nr.setStartAfter(sp.nextSibling); nr.collapse(true); const s = getSelection(); s.removeAllRanges(); s.addRange(nr);
    syncFrom(ed);
  };
  $('#fIcon').addEventListener('mousedown', e => { e.preventDefault(); openMenuAt(m, e.currentTarget); });
}

/* ---------------- คลังรูปพื้นฐาน (สร้างจากค่าที่กรอก) ---------------- */
const T = (x, y, s, o = {}) => (!o.up && o.f !== 0 && !/[\u0E00-\u0E7F]/.test(String(s)) && /[A-Za-z0-9α-ωΑ-Ω]/.test(String(s))) ? svgMath(x, y, String(s), o) : `<text x="${x}" y="${y}" font-family="${o.m ? 'KaTeX_Math' : o.r ? 'KaTeX_Main' : 'THS'}" font-size="${o.fs || 15}"${o.m ? ' font-style="italic"' : ''} text-anchor="${o.a || 'middle'}" fill="${o.c || CL.dark}"${o.b ? ' font-weight="700"' : ''}>${esc(String(s))}</text>`;
const isVar = s => /^[A-Za-z]('|_\w)?$/.test(s);
const lab = (x, y, s, o = {}) => T(x, y, s, Object.assign({ m: isVar(s), r: /^[\d.\-−+]+$/.test(s) }, o));
const svgTop = body => { let top = ''; body = String(body).replace(/<g class="plnum"[^>]*>[\s\S]*?<\/g>/g, m => { top += m; return ''; }); return body + top; };
const svgW = (w, h, body) => `<svg xmlns="http://www.w3.org/2000/svg" width="${Math.round(w)}" height="${Math.round(h)}" viewBox="0 0 ${Math.round(w)} ${Math.round(h)}">${svgTop(body)}</svg>`;
const list = s => String(s ?? '').split(',').map(x => x.trim()).filter(x => x !== '');
const LIB = {
  venn2: { name: 'แผนภาพเวนน์ 2 เซต', p: [['A', 'ชื่อเซตซ้าย', 'A'], ['B', 'ชื่อเซตขวา', 'B'], ['U', 'เอกภพสัมพัทธ์', 'U'], ['n1', 'ในส่วน A อย่างเดียว', ''], ['n2', 'ในส่วน A∩B', ''], ['n3', 'ในส่วน B อย่างเดียว', ''], ['n4', 'นอกทั้งสองเซต', ''], ['sh', 'ระบายสีบริเวณ', 'none', ['none:ไม่ระบาย', 'AB:A∩B', 'AuB:A∪B', 'A-B:A−B', 'B-A:B−A', 'out:(A∪B)′', 'A:A', 'B:B', 'Ac:A′', 'Bc:B′', 'sym:A Δ B', 'nAB:(A∩B)′', 'ex:พิมพ์เอง (ช่องด้านล่าง)']], ['ex', 'บริเวณที่ระบาย (พิมพ์เอง) เช่น A∪B′', ''], ['pat', 'ลักษณะการระบาย', 'fill', ['fill:ระบายทึบ', 'hatch:เส้นทแยง', 'dot:จุด']], ['ppl', 'ใส่ไอคอนคนตามจำนวน', 'no', ['no:ไม่ใส่', 'yes:ใส่']]],
    gen: p => {
      const W = 360, H = 220, cx1 = 140, cx2 = 220, cy = 118, r = 78;
      const SHX = { AB: 'A∩B', AuB: 'A∪B', 'A-B': 'A−B', 'B-A': 'B−A', out: '(A∪B)′', A: 'A', B: 'B', Ac: 'A′', Bc: 'B′', sym: 'AΔB', nAB: '(A∩B)′', ex: p.ex }; const shade = p.sh && p.sh !== 'none' ? vennShade([[cx1, cy, r, 'A'], [cx2, cy, r, 'B']], [10, 10, W - 20, H - 20], SHX[p.sh] || '', p.pat, { A: p.A, B: p.B, U: p.U }) : '';
      function lens() { const d = (cx2 - cx1) / 2, h = Math.sqrt(r * r - d * d), mx = (cx1 + cx2) / 2; return `M${mx} ${cy - h}A${r} ${r} 0 0 1 ${mx} ${cy + h}A${r} ${r} 0 0 1 ${mx} ${cy - h}z`; }
      const ppl = (n, x, y, col) => { n = Math.min(12, +n || 0); let s = ''; const per = n <= 2 ? n : 2; for (let i = 0; i < n; i++) { const row = Math.floor(i / per), c = i % per; s += `<g transform="translate(${x - per * 9 + c * 18} ${y - 20 + row * 22}) scale(.75)">${person(col)}</g>`; } return s; };
      let b = `<rect x="10" y="10" width="${W - 20}" height="${H - 20}" fill="#fff" stroke="${CL.dark}" stroke-width="1.3"/>${shade}<rect x="10" y="10" width="${W - 20}" height="${H - 20}" fill="none" stroke="${CL.dark}" stroke-width="1.3"/>`;
      b += `<circle cx="${cx1}" cy="${cy}" r="${r}" fill="${p.ppl === 'yes' ? 'rgba(192,57,43,.08)' : 'none'}" stroke="${CL.red}" stroke-width="1.6"/><circle cx="${cx2}" cy="${cy}" r="${r}" fill="${p.ppl === 'yes' ? 'rgba(44,74,122,.08)' : 'none'}" stroke="${CL.navy}" stroke-width="1.6"/>`;
      b += lab(26, 30, p.U, { a: 'start' }) + lab(cx1 - 52, 50, p.A, { c: CL.red, fs: 15 }) + lab(cx2 + 52, 50, p.B, { c: CL.navy, fs: 15 });
      if (p.ppl === 'yes') b += ppl(p.n1, cx1 - 38, cy, CL.red) + ppl(p.n2, (cx1 + cx2) / 2, cy, CL.purple) + ppl(p.n3, cx2 + 38, cy, CL.navy);
      else { if (p.n1) b += lab(cx1 - 38, cy + 6, p.n1, { fs: 17 }); if (p.n2) b += lab((cx1 + cx2) / 2, cy + 6, p.n2, { fs: 17 }); if (p.n3) b += lab(cx2 + 38, cy + 6, p.n3, { fs: 17 }); }
      if (p.n4) b += lab(W - 32, H - 22, p.n4, { fs: 17 });
      return svgW(W, H, b);
    } },
  venn3: { name: 'แผนภาพเวนน์ 3 เซต', p: [['A', 'เซตที่ 1', 'A'], ['B', 'เซตที่ 2', 'B'], ['C', 'เซตที่ 3', 'C'], ['U', 'เอกภพสัมพัทธ์', 'U'], ['n', 'ตัวเลขในส่วนต่าง ๆ (A, AB, B, AC, ABC, BC, C) คั่นด้วย ,', ''], ['sh', 'ระบายสีบริเวณ', 'none', ['none:ไม่ระบาย', 'A∩B∩C:A∩B∩C', 'A∪B∪C:A∪B∪C', '(A∩B)−C:(A∩B)−C', 'A−(B∪C):A−(B∪C)', '(A∪B)∩C:(A∪B)∩C', '(A∪B∪C)′:(A∪B∪C)′', 'A∩B:A∩B', 'A∩C:A∩C', 'B∩C:B∩C', 'ex:พิมพ์เอง (ช่องด้านล่าง)']], ['ex', 'บริเวณที่ระบาย (พิมพ์เอง) เช่น (A∩B)∪C′', ''], ['pat', 'ลักษณะการระบาย', 'fill', ['fill:ระบายทึบ', 'hatch:เส้นทแยง', 'dot:จุด']]],
    gen: p => {
      const W = 360, H = 300, r = 78, A = [140, 120], B = [220, 120], C = [180, 188];
      let b = `<rect x="10" y="10" width="${W - 20}" height="${H - 20}" fill="#fff" stroke="${CL.dark}" stroke-width="1.3"/>`;
      if (p.sh && p.sh !== 'none') b += vennShade([[A[0], A[1], r, 'A'], [B[0], B[1], r, 'B'], [C[0], C[1], r, 'C']], [10, 10, W - 20, H - 20], p.sh === 'ex' ? p.ex : p.sh, p.pat, { A: p.A, B: p.B, C: p.C, U: p.U }) + `<rect x="10" y="10" width="${W - 20}" height="${H - 20}" fill="none" stroke="${CL.dark}" stroke-width="1.3"/>`;
      [[A, CL.red], [B, CL.navy], [C, CL.green]].forEach(([c, col]) => b += `<circle cx="${c[0]}" cy="${c[1]}" r="${r}" fill="none" stroke="${col}" stroke-width="1.6"/>`);
      b += lab(26, 30, p.U, { a: 'start' }) + lab(72, 52, p.A, { c: CL.red }) + lab(288, 52, p.B, { c: CL.navy }) + lab(180, 286, p.C, { c: CL.green });
      const pos = [[100, 110], [180, 92], [260, 110], [138, 172], [180, 146], [222, 172], [180, 228]];
      list(p.n).forEach((v, i) => { if (pos[i]) b += lab(pos[i][0], pos[i][1] + 6, v, { fs: 16 }); });
      return svgW(W, H, b);
    } },
  numline: { name: 'เส้นจำนวน', p: [['a', 'เริ่ม', '-3'], ['b', 'สิ้นสุด', '3'], ['st', 'ระยะห่างของขีด', '1'], ['pts', 'จุดทึบ (คั่นด้วย ,)', '1'], ['opn', 'จุดโปร่ง (คั่นด้วย ,)', ''], ['ray', 'ช่วงที่ระบาย เช่น 1,3 หรือ 1,inf', '']],
    gen: p => {
      const a = +p.a, bb = +p.b, st = +p.st || 1, W = 560, x0 = 40, x1 = W - 40, y = 50;
      const X = v => x0 + (v - a) / (bb - a || 1) * (x1 - x0);
      let s = `<path d="M${x0 - 22} ${y}H${x1 + 22}" stroke="${CL.dark}" stroke-width="1.5"/><path d="M${x1 + 22} ${y}l-8 -4.5v9z" fill="${CL.dark}"/><path d="M${x0 - 22} ${y}l8 -4.5v9z" fill="${CL.dark}"/>`;
      const r = list(p.ray); if (r.length === 2) { const u = r[0] === '-inf' ? x0 - 18 : X(+r[0]), v = r[1] === 'inf' ? x1 + 18 : X(+r[1]); s += `<path d="M${u} ${y}H${v}" stroke="${CL.orange}" stroke-width="5" opacity=".8"/>`; }
      for (let v = a, k = 0; v <= bb + 1e-9 && k < 200; v += st, k++) { const vv = Math.round(v * 1e6) / 1e6; s += `<path d="M${X(vv)} ${y - 6}V${y + 6}" stroke="${CL.dark}" stroke-width="1.3"/>` + T(X(vv), y + 26, vv < 0 ? '−' + (-vv) : vv, { r: 1, fs: 15 }); }
      list(p.pts).forEach(v => s += `<circle cx="${X(+v)}" cy="${y}" r="5.5" fill="${CL.red}"/>`);
      list(p.opn).forEach(v => s += `<circle cx="${X(+v)}" cy="${y}" r="5.5" fill="#fff" stroke="${CL.red}" stroke-width="2"/>`);
      return svgW(W, 90, s);
    } },
  grid: { name: 'ตารางทางเดิน', p: [['m', 'จำนวนช่องแนวนอน', '4'], ['n', 'จำนวนช่องแนวตั้ง', '3'], ['A', 'ชื่อจุดเริ่ม (ล่างซ้าย)', 'A'], ['B', 'ชื่อจุดปลาย (บนขวา)', 'B'], ['path', 'เส้นทางตัวอย่าง R=ขวา U=ขึ้น เช่น RRURUR', ''], ['blk', 'จุดห้ามผ่าน (x:y คั่นด้วย ,)', '']],
    gen: p => {
      const m = Math.max(1, Math.min(12, +p.m || 4)), n = Math.max(1, Math.min(10, +p.n || 3)), c = 44, ox = 36, oy = 24, W = m * c + ox * 2, H = n * c + oy * 2 + 10;
      const P = (i, j) => [ox + i * c, oy + (n - j) * c];
      let s = '';
      for (let i = 0; i <= m; i++) s += `<path d="M${P(i, 0)}V${oy}" stroke="${CL.gray}" stroke-width="1.4"/>`.replace(/M([\d.]+),([\d.]+)/, 'M$1 $2');
      for (let j = 0; j <= n; j++) s += `<path d="M${ox} ${P(0, j)[1]}H${ox + m * c}" stroke="${CL.gray}" stroke-width="1.4"/>`;
      if (p.path) { let i = 0, j = 0, d = `M${P(0, 0).join(' ')}`; for (const ch of p.path.toUpperCase()) { if (ch === 'R') i++; else if (ch === 'U') j++; else continue; d += `L${P(i, j).join(' ')}`; } s += `<path d="${d}" fill="none" stroke="${CL.orange}" stroke-width="4" stroke-linejoin="round" stroke-linecap="round"/>`; }
      list(p.blk).forEach(t => { const [i, j] = t.split(':').map(Number); if (!isNaN(i) && !isNaN(j)) { const [x, y] = P(i, j); s += `<path d="M${x - 7} ${y - 7}l14 14M${x + 7} ${y - 7}l-14 14" stroke="${CL.red}" stroke-width="2.6"/>`; } });
      const [ax, ay] = P(0, 0), [bx, by] = P(m, n);
      s += `<circle cx="${ax}" cy="${ay}" r="5" fill="${CL.dark}"/><circle cx="${bx}" cy="${by}" r="5" fill="${CL.dark}"/>` + lab(ax - 16, ay + 18, p.A, { fs: 17 }) + lab(bx + 16, by - 8, p.B, { fs: 17 });
      return svgW(W, H, s);
    } },
  seats: { name: 'เก้าอี้/ช่องเรียงแถว', p: [['n', 'จำนวนช่อง', '7'], ['sel', 'ช่องที่เลือก (คั่นด้วย ,)', '1,3,6'], ['num', 'ใส่หมายเลขใต้ช่อง', 'yes', ['yes:ใส่', 'no:ไม่ใส่']], ['txt', 'ข้อความในช่อง (คั่นด้วย ,)', '']],
    gen: p => {
      const n = Math.max(1, Math.min(16, +p.n || 7)), w = 40, g = 10, W = n * (w + g) + 20; const sel = list(p.sel).map(Number); const tx = list(p.txt);
      let s = ''; for (let i = 0; i < n; i++) { const x = 10 + i * (w + g), on = sel.includes(i + 1); s += `<rect x="${x}" y="12" width="${w}" height="${w}" rx="7" fill="${on ? '#f6d3bd' : '#fff'}" stroke="${on ? CL.orange : CL.gray}" stroke-width="${on ? 2 : 1.5}"/>`; if (tx[i]) s += lab(x + w / 2, 38, tx[i], { fs: 16 }); else if (on) s += `<circle cx="${x + w / 2}" cy="32" r="7" fill="${CL.orange}"/>`; if (p.num !== 'no') s += T(x + w / 2, 72, i + 1, { r: 1, fs: 14, c: CL.brown }); }
      return svgW(W, p.num !== 'no' ? 82 : 62, s);
    } },
  round: { name: 'โต๊ะกลม', p: [['n', 'จำนวนที่นั่ง', '6'], ['lbl', 'ชื่อแต่ละที่นั่ง (คั่นด้วย ,) เว้นว่างได้', 'A,B,C,D,E,F'], ['sel', 'ที่นั่งที่ระบายสี (ลำดับ คั่นด้วย ,)', '']],
    gen: p => {
      const n = Math.max(2, Math.min(16, +p.n || 6)), R = 70, cx = 130, cy = 120, L = list(p.lbl), sel = list(p.sel).map(Number);
      let s = `<circle cx="${cx}" cy="${cy}" r="${R - 26}" fill="${CL.cream}" stroke="${CL.brown}" stroke-width="1.6"/>`;
      for (let i = 0; i < n; i++) { const t = -Math.PI / 2 + i * 2 * Math.PI / n, x = cx + R * Math.cos(t), y = cy + R * Math.sin(t), on = sel.includes(i + 1); s += `<circle cx="${x}" cy="${y}" r="15" fill="${on ? '#f6d3bd' : '#fff'}" stroke="${on ? CL.orange : CL.gray}" stroke-width="1.8"/>`; if (L[i]) s += lab(x, y + 5.5, L[i], { fs: 15 }); }
      return svgW(260, 240, s);
    } },
  slots: { name: 'ช่องนับ (หลักการคูณ)', p: [['lbl', 'หัวช่อง (คั่นด้วย ,)', 'หลักร้อย,หลักสิบ,หลักหน่วย'], ['val', 'จำนวนวิธีในแต่ละช่อง', '9,10,10'], ['op', 'เครื่องหมายระหว่างช่อง', '×', ['×:×', '+:+', ' :ไม่มี']], ['res', 'ผลลัพธ์ท้าย เช่น = 900 วิธี', '']],
    gen: p => {
      const L = list(p.lbl), V = list(p.val), n = Math.max(L.length, V.length, 1), w = 78, g = 36; let W = n * w + (n - 1) * g + 20; const extra = p.res ? 30 + p.res.length * 9 : 0; W += extra;
      let s = ''; for (let i = 0; i < n; i++) { const x = 10 + i * (w + g); if (L[i]) s += T(x + w / 2, 22, L[i], { fs: 14, c: CL.brown }); s += `<rect x="${x}" y="30" width="${w}" height="46" rx="7" fill="#fff6ee" stroke="${CL.orange}" stroke-width="1.6"/>`; if (V[i]) s += lab(x + w / 2, 60, V[i], { fs: 19, b: 1 }); if (i < n - 1 && p.op.trim()) s += T(x + w + g / 2, 60, p.op, { r: 1, fs: 20, c: CL.gray }); }
      if (p.res) s += T(10 + n * (w + g) - g + 14, 60, p.res, { a: 'start', fs: 18, b: 1, c: CL.red });
      return svgW(W, 88, s);
    } },
  dice: { name: 'ตารางผลลัพธ์ลูกเต๋า 2 ลูก', p: [['show', 'ในช่องแสดง', 'pair', ['pair:คู่อันดับ (a, b)', 'sum:ผลบวก', 'blank:เว้นว่าง']], ['hl', 'ระบายช่องที่ผลบวกเท่ากับ (คั่นด้วย ,)', ''], ['L1', 'ชื่อลูกที่ 1', 'ลูกที่ 1'], ['L2', 'ชื่อลูกที่ 2', 'ลูกที่ 2']],
    gen: p => {
      const c = p.show === 'pair' ? 58 : 40, ox = 64, oy = 50, W = ox + 6 * c + 12, H = oy + 6 * c + 12, hl = list(p.hl).map(Number);
      let s = T(ox + 3 * c, 18, p.L2, { fs: 14, c: CL.brown }) + `<text x="16" y="${oy + 3 * c}" font-family="THS" font-size="14" fill="${CL.brown}" text-anchor="middle" transform="rotate(-90 16 ${oy + 3 * c})">${esc(p.L1)}</text>`;
      for (let i = 1; i <= 6; i++) { s += T(ox + (i - .5) * c, oy - 10, i, { r: 1, fs: 15, b: 1 }); s += T(ox - 16, oy + (i - .5) * c + 5, i, { r: 1, fs: 15, b: 1 }); }
      for (let a = 1; a <= 6; a++) for (let b2 = 1; b2 <= 6; b2++) { const x = ox + (b2 - 1) * c, y = oy + (a - 1) * c, on = hl.includes(a + b2); s += `<rect x="${x}" y="${y}" width="${c}" height="${c}" fill="${on ? '#f6d3bd' : '#fff'}" stroke="${CL.gray}" stroke-width="1"/>`; if (p.show !== 'blank') s += T(x + c / 2, y + c / 2 + 5, p.show === 'sum' ? a + b2 : `(${a}, ${b2})`, { r: 1, fs: p.show === 'sum' ? 15 : 12.5 }); }
      return svgW(W, H, s);
    } },
  tree: { name: 'แผนภาพต้นไม้ (สร้างอัตโนมัติ)', p: [['lv', 'กิ่งแต่ละขั้น คั่นขั้นด้วย ; และกิ่งด้วย , เช่น H,T;H,T;H,T', 'H,T;H,T'], ['head', 'หัวแต่ละขั้น (คั่นด้วย ,)', 'เหรียญที่ 1,เหรียญที่ 2'], ['out', 'แสดงผลลัพธ์ท้ายกิ่ง', 'yes', ['yes:แสดง', 'no:ไม่แสดง']], ['pr', 'ความน่าจะเป็นบนกิ่ง (คั่นขั้นด้วย ; กิ่งด้วย ,) เช่น 1/2,1/2;1/3,2/3', '']],
    gen: p => {
      const PR = String(p.pr || '').split(';').map(list);
      const lv = p.lv.split(';').map(list).filter(x => x.length).slice(0, 5); if (!lv.length) return svgW(100, 40, '');
      const leaves = lv.reduce((a, l) => a * l.length, 1); if (leaves > 64) return svgW(300, 40, T(150, 25, 'กิ่งมากเกินไป (เกิน 64 ปลายกิ่ง)', { fs: 15, c: CL.red }));
      const dy = Math.max(22, Math.min(34, 520 / leaves)), dx = PR.some(x => x.length) ? 140 : 110, H = leaves * dy + 40, W = 30 + lv.length * dx + (p.out === 'yes' ? 90 : 20); const heads = list(p.head);
      let s = ''; heads.forEach((h, i) => { if (i < lv.length) s += T(30 + (i + 1) * dx, 16, h, { fs: 13, c: CL.brown }); });
      let leaf = 0;
      const node = (d, path) => { // คืนตำแหน่ง y
        if (d === lv.length) { const y = 34 + (leaf++ + .5) * dy; if (p.out === 'yes') s += lab(30 + d * dx + 22, y + 5, path.join(''), { a: 'start', fs: 14, c: CL.teal }); return y; }
        const ys = lv[d].map(br => { const y = node(d + 1, path.concat(br)); return [br, y]; });
        const y = (ys[0][1] + ys[ys.length - 1][1]) / 2; const x = 30 + d * dx;
        ys.forEach(([br, yy], j) => { s += `<path d="M${x + 6} ${y}L${x + dx - 14} ${yy}" stroke="${CL.gray}" stroke-width="1.4"/>`; const pv = (PR[d] || [])[j]; if (pv) s += svgMath(x + dx * .48, (y + yy) / 2 + (yy < y ? -5 : 13), pv, { fs: 12.5, c: CL.red }); s += `<circle cx="${x + dx}" cy="${yy}" r="12" fill="#fff" stroke="${CL.brown}" stroke-width="1.4"/>` + lab(x + dx, yy + 5, br, { fs: 14 }); });
        return y;
      };
      const y0 = node(0, []); s += `<circle cx="30" cy="${y0}" r="5" fill="${CL.dark}"/>`;
      return svgW(W, H, s);
    } },
  stars: { name: 'ดาวและแท่ง', p: [['pat', 'รูปแบบ * = ดาว | = แท่ง เช่น **|*|***', '**|*|***'], ['lbl', 'ป้ายใต้กลุ่ม (คั่นด้วย ,)', '']],
    gen: p => {
      const pat = (p.pat || '').replace(/[^*|]/g, '').slice(0, 30); const w = 30; let x = 14, s = ''; const L = list(p.lbl);
      const star = (cx, cy) => `<path transform="translate(${cx - 12} ${cy - 12})" d="${'M12 2.6l2.8 6 6.5.7-4.9 4.4 1.4 6.4L12 16.8l-5.8 3.3 1.4-6.4-4.9-4.4 6.5-.7z'}" fill="#f2b632" stroke="${CL.brown}" stroke-width="1"/>`;
      x = 14; let gi = 0, start = 14; s = '';
      for (const ch of pat) { if (ch === '*') { s += star(x + w / 2, 30); x += w; } else { if (L[gi]) s += T((start + x) / 2, 66, L[gi], { fs: 13, c: CL.brown }); gi++; s += `<path d="M${x + 8} 10V50" stroke="${CL.brown}" stroke-width="3" stroke-linecap="round"/>`; x += 16; start = x; } }
      if (L[gi]) s += T((start + x) / 2, 66, L[gi], { fs: 13, c: CL.brown });
      return svgW(x + 14, L.length ? 76 : 58, s);
    } },
  balls: { name: 'ลูกบอลในกล่อง/ถุง', p: [['c', 'จำนวนแต่ละสี แดง,น้ำเงิน,เขียว,เหลือง,ขาว', '3,2,1'], ['box', 'ภาชนะ', 'box', ['box:กล่อง', 'bag:ถุง', 'none:ไม่มี']], ['lbl', 'ใส่เลขบนลูกบอล', 'no', ['no:ไม่ใส่', 'yes:ใส่']]],
    gen: p => {
      const cols = [CL.red, '#3567b5', '#3c9a4f', '#f2c94c', '#ffffff']; const cnt = list(p.c).map(Number); const bs = []; cnt.forEach((n, i) => { for (let k = 0; k < Math.min(n || 0, 20); k++) bs.push(cols[i] || '#ccc'); });
      const per = Math.min(6, Math.max(3, Math.ceil(Math.sqrt(bs.length * 1.6)))), rows = Math.ceil(bs.length / per) || 1, d = 32, W = per * d + 50, H = rows * d + 50;
      let s = p.box === 'box' ? `<path d="M14 18V${H - 10}H${W - 14}V18" fill="${CL.cream}" stroke="${CL.brown}" stroke-width="2"/>` : p.box === 'bag' ? `<path d="M20 22Q${W / 2} 6 ${W - 20} 22L${W - 10} ${H - 8}H10z" fill="#f1dcc3" stroke="${CL.brown}" stroke-width="2" stroke-linejoin="round"/>` : '';
      bs.forEach((c, i) => { const r = Math.floor(i / per), k = i % per; const x = 25 + k * d + d / 2 - 4 + (r % 2) * 6, y = H - 22 - r * d; s += `<g transform="translate(${x - 14} ${y - 14}) scale(1.17)">${ball(c)}</g>`; if (p.lbl === 'yes') s += T(x, y + 5, i + 1, { r: 1, fs: 12, c: c === '#ffffff' || c === '#f2c94c' ? CL.dark : '#fff', b: 1 }); });
      return svgW(W, H, s);
    } },
  people: { name: 'คนเรียงแถว', p: [['n', 'จำนวนคน', '5'], ['lbl', 'ชื่อใต้แต่ละคน (คั่นด้วย ,)', 'A,B,C,D,E'], ['col', 'สี', 'mix', ['mix:สลับสี', 'red:แดง', 'navy:น้ำเงิน', 'brown:น้ำตาล']]],
    gen: p => {
      const n = Math.max(1, Math.min(14, +p.n || 5)), w = 44, L = list(p.lbl); const cs = [CL.red, CL.navy, CL.brown, CL.green, CL.purple];
      let s = ''; for (let i = 0; i < n; i++) { const c = p.col === 'mix' ? cs[i % cs.length] : CL[p.col] || CL.brown; s += `<g transform="translate(${10 + i * w + 4} 6) scale(1.5)">${person(c)}</g>`; if (L[i]) s += lab(10 + i * w + 22, 62, L[i], { fs: 15 }); }
      return svgW(n * w + 20, L.length ? 72 : 48, s);
    } },
};
function libSVG(b) { const L = LIB[b.lib.kind]; if (!L) return ''; const p = {}; L.p.forEach(([k, , d]) => p[k] = b.lib.p && b.lib.p[k] !== undefined ? b.lib.p[k] : d); const q = b.lib.p || {}; try { return libStyleApply(L.gen(p), q); } catch (e) { return svgW(300, 40, T(150, 25, 'ค่าที่กรอกไม่ถูกต้อง', { fs: 15, c: CL.red })); } }
let libTarget = null, libKind = 'venn2';
function openLibrary(id) {
  libTarget = id || null; const b = id ? byId(id) : null; libKind = b ? b.lib.kind : libKind;
  let cat = LIBCAT.findIndex((c, i) => i > 0 && c[1] && c[1].includes(libKind)); if (cat < 0) cat = LIBCAT.findIndex(c => c[1] && c[1].includes(libKind));
  $('#lbCats').innerHTML = `<input type="search" id="lbSearch" placeholder="ค้นหารูป เช่น รีมันน์ ทรงกลม" style="width:100%;box-sizing:border-box;margin-bottom:6px">` + LIBCAT.map(([n, ks], i) => ks ? `<button class="${i === cat ? 'on' : ''}" data-c="${i}">${n} <small>${ks[0] === 'FREE' ? '' : ks.length}</small></button>` : `<div class="lbh">${n.replace(/—/g, '').trim()}</div>`).join('');
  $('#lbSearch').oninput = e => libSearch(e.target.value.trim());
  showLibCat(cat < 0 ? 0 : cat, b ? b.lib.p : null); openDlg('#dLib');
}
function libSearch(q) {
  if (!q) { showLibCat(LIBCAT.findIndex(c => c[1] && c[1].includes(libKind)) || 0, null); return; }
  const hits = Object.keys(LIB).filter(k => (LIB[k].name + ' ' + LIBCAT.filter(c => c[1] && c[1].includes(k)).map(c => c[0]).join(' ')).toLowerCase().includes(q.toLowerCase()));
  $$('#lbCats button').forEach(x => x.classList.remove('on'));
  $('#lbKinds').innerHTML = hits.length ? hits.map(k => `<button class="tb${k === libKind ? ' on' : ''}" data-k="${k}">${LIB[k].name}</button>`).join('') : '<span class="hint">ไม่พบ ลองคำอื่น</span>';
  if (hits.length) { libKind = hits.includes(libKind) ? libKind : hits[0]; $$('#lbKinds .tb').forEach(x => x.classList.toggle('on', x.dataset.k === libKind)); libForm(null); }
}
function showLibCat(ci, vals) {
  if (ci < 0 || !LIBCAT[ci] || !LIBCAT[ci][1]) ci = 0;
  $$('#lbCats button').forEach(x => x.classList.toggle('on', +x.dataset.c === ci));
  const kinds = LIBCAT[ci][1];
  if (kinds[0] === 'FREE') { $('#lbKinds').innerHTML = ''; $('#lbForm').innerHTML = '<p class="hint" style="font-size:18px">วาดเองด้วยจุด เส้น วงกลม มุม ข้อความ กราฟ และแผนภาพต้นไม้ ลากจุดได้อิสระ</p><button class="tb primary" id="lbFree">เปิดกระดานวาดอิสระ</button>'; $('#lbPrev').innerHTML = ''; $('#lbCmap').innerHTML = ''; cmapKey = ''; $('#lbFree').onclick = () => { closeDlg('#dLib'); openFigure(null); }; return; }
  if (!kinds.includes(libKind)) libKind = kinds[0];
  $('#lbKinds').innerHTML = kinds.map(k => `<button class="tb${k === libKind ? ' on' : ''}" data-k="${k}">${LIB[k].name}</button>`).join('');
  libForm(vals);
}
$('#lbCats').onclick = e => { const b = e.target.closest('[data-c]'); if (b) { $('#lbSearch').value = ''; showLibCat(+b.dataset.c, null); } };
let libFormVals = null;
function libForm(vals) {
  const L = LIB[libKind]; libFormVals = vals || null;
  $('#lbForm').innerHTML = L.p.map(([k, n, d, opts]) => { const v = vals && vals[k] !== undefined ? vals[k] : d; return `<div class="row"><label style="width:260px">${esc(n)}</label>${opts === 'col' ? `<input type="color" data-k="${k}" value="${esc(v)}" style="width:64px;height:34px;padding:2px">` : opts === 'ta' ? `<textarea data-k="${k}" rows="8" style="flex:1;font-size:15px;min-height:150px">${esc(v)}</textarea>` : opts ? `<select data-k="${k}">${opts.map(o => { const [ov, on] = o.split(':'); return `<option value="${esc(ov)}"${ov === v ? ' selected' : ''}>${esc(on)}</option>`; }).join('')}</select>` : `<input type="text" data-k="${k}" value="${esc(v)}" style="flex:1">`}</div>`; }).join('') + libStyleHTML(vals);
  libEnhance(); libPrev();
}
function libRead() { const p = {}; $$('#lbForm [data-k]').forEach(e => p[e.dataset.k] = e.value); return { kind: libKind, p }; }
function libPrev() { $('#lbPrev').innerHTML = libSVG({ lib: libRead() }); }
$('#lbKinds').onclick = e => { const b = e.target.closest('[data-k]'); if (!b) return; libKind = b.dataset.k; $$('#lbKinds .tb').forEach(x => x.classList.toggle('on', x === b)); libForm(null); };
$('#lbForm').addEventListener('input', () => libPrev()); $('#lbForm').addEventListener('change', () => libPrev());
$('#lbCancel').onclick = () => closeDlg('#dLib');
$('#lbOk').onclick = () => {
  const lib = libRead(); closeDlg('#dLib');
  if (libTarget) { const b = byId(libTarget); b.lib = lib; b.svg = libSVG(b); rerender(b.id); changed(true); }
  else { const b = newBlock('figure', { lib, w: 70 }); b.svg = libSVG(b); insertBlocks([b]); }
};

/* ---------------- บุคคลสำคัญ ---------------- */
function peopleHTML(b) {
  const items = b.items || [];
  return `<div class="b-people" style="grid-template-columns:repeat(${b.cols || 3},1fr)">${items.map((it, i) => `<div class="pc">
    <div class="pimg" data-pi="${i}" title="คลิกเพื่อใส่รูปจริง">${it.img ? `<img src="${it.img}" alt="">` : `<div class="sil"><i></i><b></b><span class="psym" contenteditable="true" data-pf="${i}.sym" data-ph="สัญลักษณ์"></span><small>ภาพสัญลักษณ์</small></div>`}</div>
    <div class="pn" contenteditable="true" data-pf="${i}.name" data-ph="ชื่อ"></div><div class="pe" contenteditable="true" data-pf="${i}.en" data-ph="ชื่อภาษาอังกฤษ"></div>
    <div class="py" contenteditable="true" data-pf="${i}.yrs" data-ph="ปี"></div><div class="pd" contenteditable="true" data-pf="${i}.desc" data-ph="ผลงาน"></div></div>`).join('')}</div>`;
}
function fillPeople(el, b) { $$('[data-pf]', el).forEach(e => { const [i, k] = e.dataset.pf.split('.'); setHTML(e, (b.items[+i] || {})[k] || ''); }); }
let peopleImg = null;
document.addEventListener('click', e => {
  const p = e.target.closest('#flow .pimg'); if (!p || e.target.closest('[contenteditable="true"]')) return;
  peopleImg = { id: p.closest('.blk').dataset.id, i: +p.dataset.pi }; $('#pplIn').click();
});
$('#pplIn').onchange = async e => {
  const f = e.target.files[0]; if (!f || !peopleImg) return; const b = byId(peopleImg.id); if (!b) return;
  b.items[peopleImg.i].img = await readImage(f); e.target.value = ''; rerender(b.id); changed(true); refreshInspector();
};

/* ===================== คลังรูป: เรขาคณิต 2 มิติ · 3 มิติ · กราฟ · เวกเตอร์ · ภาคตัดกรวย ===================== */
const STK = (c = CL.dark, w = 1.7, dash) => `fill="none" stroke="${c}" stroke-width="${w}"${dash ? ' stroke-dasharray="6 4"' : ''} stroke-linejoin="round" stroke-linecap="round"`;
const pl = (pts, o = '') => `<polyline points="${pts.map(p => p.map(v => v.toFixed(1)).join(',')).join(' ')}" ${o}/>`;
const pg = (pts, o = '') => `<polygon points="${pts.map(p => p.map(v => v.toFixed(1)).join(',')).join(' ')}" ${o}/>`;
const dot = (p, c = CL.dark, r = 3.2) => `<circle cx="${p[0].toFixed(1)}" cy="${p[1].toFixed(1)}" r="${r}" fill="${c}"/>`;
const mid = (a, b) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
const sub2 = (a, b) => [a[0] - b[0], a[1] - b[1]], len2 = v => Math.hypot(v[0], v[1]), nrm = v => { const l = len2(v) || 1; return [v[0] / l, v[1] / l]; };
/* ป้ายจุดยอดวางออกจากจุดศูนย์กลางรูป */
function vlab(p, c, s, d = 14, o = {}) { const v = nrm(sub2(p, c)); return lab(p[0] + v[0] * d, p[1] + v[1] * d + 5, s, Object.assign({ fs: 16 }, o)); }
function sideLab(a, b, c, s, d = 13) { const m = mid(a, b); const n = nrm([-(b[1] - a[1]), b[0] - a[0]]); const toC = sub2(c, m); const k = (n[0] * toC[0] + n[1] * toC[1]) > 0 ? -1 : 1; return lab(m[0] + n[0] * d * k, m[1] + n[1] * d * k + 5, s, { fs: 15, c: CL.teal }); }
function rightMark(p, a, b, s = 11) { const u = nrm(sub2(a, p)), v = nrm(sub2(b, p)); const q1 = [p[0] + u[0] * s, p[1] + u[1] * s], q3 = [p[0] + v[0] * s, p[1] + v[1] * s], q2 = [q1[0] + v[0] * s, q1[1] + v[1] * s]; return pl([q1, q2, q3], STK(CL.dark, 1.2)); }
function arcMark(p, a, b, r = 20, c = CL.orange, txt) {
  const u = nrm(sub2(a, p)), v = nrm(sub2(b, p)); const s = [p[0] + u[0] * r, p[1] + u[1] * r], e = [p[0] + v[0] * r, p[1] + v[1] * r];
  const cr = u[0] * v[1] - u[1] * v[0]; let out = `<path d="M${s[0].toFixed(1)} ${s[1].toFixed(1)}A${r} ${r} 0 0 ${cr > 0 ? 1 : 0} ${e[0].toFixed(1)} ${e[1].toFixed(1)}" ${STK(c, 1.4)}/>`;
  if (txt) { const m = nrm([u[0] + v[0], u[1] + v[1]]); out += lab(p[0] + m[0] * (r + 13), p[1] + m[1] * (r + 13) + 5, txt, { fs: 14, c }); }
  return out;
}
function fit(pts, W = 380, H = 280, pad = 34) { // จัดจุดให้อยู่ในกรอบ (y ขึ้นบน)
  const xs = pts.map(p => p[0]), ys = pts.map(p => p[1]); const x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys);
  const k = Math.min((W - 2 * pad) / (x1 - x0 || 1), (H - 2 * pad) / (y1 - y0 || 1)); const w = (x1 - x0) * k + 2 * pad, h = (y1 - y0) * k + 2 * pad;
  return { P: p => [pad + (p[0] - x0) * k, pad + (y1 - p[1]) * k], w, h, k };
}
const ON = v => v === 'yes';
const yn = (k, n, d = 'yes') => [k, n, d, ['yes:แสดง', 'no:ไม่แสดง']];
const vtx = s => list(s);

/* ---------- ระบบพิกัด ---------- */
function plane(p, W = 440, H = 360) {
  const x0 = +p.x0, x1 = +p.x1, y0 = +p.y0, y1 = +p.y1; const pad = 26;
  const k = Math.min((W - 2 * pad) / (x1 - x0), (H - 2 * pad) / (y1 - y0)); const w = (x1 - x0) * k + 2 * pad, h = (y1 - y0) * k + 2 * pad;
  const X = x => pad + (x - x0) * k, Y = y => pad + (y1 - y) * k;
  const cid = 'clp' + Math.random().toString(36).slice(2, 8);
  let s = `<defs><clipPath id="${cid}"><rect x="${pad}" y="${pad}" width="${w - 2 * pad}" height="${h - 2 * pad}"/></clipPath></defs>`;
  const st = +p.st || 1;
  if (ON(p.grid)) { for (let x = Math.ceil(x0 / st) * st; x <= x1 + 1e-9; x += st) s += `<path d="M${X(x)} ${Y(y0)}V${Y(y1)}" stroke="#eceef2"/>`; for (let y = Math.ceil(y0 / st) * st; y <= y1 + 1e-9; y += st) s += `<path d="M${X(x0)} ${Y(y)}H${X(x1)}" stroke="#eceef2"/>`; }
  const ax = (x0 <= 0 && 0 <= x1) ? X(0) : X(x0), ay = (y0 <= 0 && 0 <= y1) ? Y(0) : Y(y0);
  s += `<path d="M${X(x0) - 8} ${ay}H${X(x1) + 12}" stroke="${CL.dark}" stroke-width="1.3"/><path d="M${X(x1) + 14} ${ay}l-8 -4v8z" fill="${CL.dark}"/>`;
  s += `<path d="M${ax} ${Y(y0) + 8}V${Y(y1) - 12}" stroke="${CL.dark}" stroke-width="1.3"/><path d="M${ax} ${Y(y1) - 14}l-4 8h8z" fill="${CL.dark}"/>`;
  s += T(X(x1) + 16, ay + 18, 'x', { m: 1, fs: 16 }) + T(ax - 12, Y(y1) - 10, 'y', { m: 1, fs: 16 });
  if (ON(p.num)) { let nm = '';
    for (let x = Math.ceil(x0 / st) * st; x <= x1 + 1e-9; x += st) { const v = Math.round(x * 1e6) / 1e6; if (v === 0) continue; s += `<path d="M${X(v)} ${ay - 3}V${ay + 3}" stroke="${CL.dark}"/>`; nm += T(X(v), ay + 15, v < 0 ? '−' + (-v) : v, { r: 1, fs: 11.5 }); }
    for (let y = Math.ceil(y0 / st) * st; y <= y1 + 1e-9; y += st) { const v = Math.round(y * 1e6) / 1e6; if (v === 0) continue; s += `<path d="M${ax - 3} ${Y(v)}H${ax + 3}" stroke="${CL.dark}"/>`; nm += T(ax - 6, Y(v) + 4, v < 0 ? '−' + (-v) : v, { r: 1, fs: 11.5, a: 'end' }); }
    nm += T(ax - 7, ay + 15, 'O', { m: 1, fs: 13, a: 'end' });
    s += `<g class="plnum" paint-order="stroke" stroke="#fff" stroke-width="3" stroke-linejoin="round">${nm}</g>`; // ตัวเลขบนแกน: svgW ย้ายไปวาดทับบนสุด มีขอบขาว จึงไม่ถูกเส้นกราฟทับ
  }
  return { s, X, Y, k, w: w + 14, h, x0, x1, y0, y1, cid };
}
const AX = [['x0', 'x น้อยสุด', '-5'], ['x1', 'x มากสุด', '5'], ['y0', 'y น้อยสุด', '-4'], ['y1', 'y มากสุด', '4'], ['st', 'ระยะห่างของสเกล', '1'], yn('grid', 'เส้นตาราง'), yn('num', 'ตัวเลขบนแกน')];
function curve(fx, A, c, w = 2.2, dash) {
  const n = 900, span = A.y1 - A.y0, lo = A.y0 - 2 * span, hi = A.y1 + 2 * span;
  const ev = x => { let y; try { y = fx(x); } catch (e) { y = NaN; } return isFinite(y) && y >= lo && y <= hi ? y : NaN; };
  const edge = (a, b) => { let ga = !isNaN(ev(a)); for (let k = 0; k < 40; k++) { const m = (a + b) / 2; if (!isNaN(ev(m)) === ga) a = m; else b = m; } return ga ? a : b; }; // หาขอบโดเมน
  let d = '', pen = false, px = null, py = null; const P = (x, y) => A.X(x).toFixed(1) + ' ' + A.Y(y).toFixed(1);
  for (let i = 0; i <= n; i++) {
    const x = A.x0 + (A.x1 - A.x0) * i / n, y = ev(x);
    if (isNaN(y)) { if (pen && px !== null) { const xe = edge(px, x), ye = ev(xe); if (!isNaN(ye)) d += 'L' + P(xe, ye); } pen = false; px = x; py = NaN; continue; }
    if (!pen) { if (px !== null && isNaN(py)) { const xe = edge(x, px), ye = ev(xe); d += 'M' + P(isNaN(ye) ? x : xe, isNaN(ye) ? y : ye); if (!isNaN(ye)) d += 'L' + P(x, y); } else d += 'M' + P(x, y); pen = true; px = x; py = y; continue; }
    if (Math.abs(y - py) > span * .04) { const xm = (x + px) / 2, ym = ev(xm); const between = !isNaN(ym) && ym >= Math.min(y, py) - span * .02 && ym <= Math.max(y, py) + span * .02 && Math.abs(ym - y) > 1e-9 && Math.abs(ym - py) > 1e-9; if (!between) { d += 'M' + P(x, y); px = x; py = y; continue; } }
    d += 'L' + P(x, y); px = x; py = y;
  }
  return `<path d="${d}" ${STK(c, w, dash)} clip-path="url(#${A.cid})"/>`;
}
function implicitCurve(F, A, c, w = 2.2, dash) { // marching squares
  const nx = 220, ny = Math.max(80, Math.round(220 * (A.Y(A.y0) - A.Y(A.y1)) / Math.max(1, A.X(A.x1) - A.X(A.x0)))); const dx = (A.x1 - A.x0) / nx, dy = (A.y1 - A.y0) / ny;
  const v = []; for (let j = 0; j <= ny; j++) { const r = []; for (let i = 0; i <= nx; i++) { let z; try { z = F(A.x0 + i * dx, A.y0 + j * dy); } catch (e) { z = NaN; } r.push(z); } v.push(r); }
  let d = ''; const P = (x, y) => A.X(x).toFixed(1) + ' ' + A.Y(y).toFixed(1);
  for (let j = 0; j < ny; j++) for (let i = 0; i < nx; i++) {
    const a = v[j][i], b = v[j][i + 1], cc = v[j + 1][i + 1], e = v[j + 1][i]; if (![a, b, cc, e].every(isFinite)) continue;
    const x0 = A.x0 + i * dx, y0 = A.y0 + j * dy, pts = [];
    const ed = (p, q, xa, ya, xb, yb) => { if ((p < 0) !== (q < 0)) { const t = p === q ? .5 : p / (p - q); pts.push([xa + (xb - xa) * t, ya + (yb - ya) * t]); } };
    ed(a, b, x0, y0, x0 + dx, y0); ed(b, cc, x0 + dx, y0, x0 + dx, y0 + dy); ed(e, cc, x0, y0 + dy, x0 + dx, y0 + dy); ed(a, e, x0, y0, x0, y0 + dy);
    const big = Math.max(Math.abs(a), Math.abs(b), Math.abs(cc), Math.abs(e)); const sc = Math.max(1e-9, Math.abs(a - b) + Math.abs(a - e)); if (big > 40 * sc && Math.min(Math.abs(a), Math.abs(b), Math.abs(cc), Math.abs(e)) > 5 * sc) continue; // ข้ามจุดกระโดด (เช่น 1/x)
    if (pts.length === 2) d += 'M' + P(...pts[0]) + 'L' + P(...pts[1]);
    else if (pts.length === 4) d += 'M' + P(...pts[0]) + 'L' + P(...pts[1]) + 'M' + P(...pts[2]) + 'L' + P(...pts[3]);
  }
  return `<path d="${d}" ${STK(c, w, dash)} clip-path="url(#${A.cid})"/>`;
}
const plotAny = (src, A, c, w, dash) => { const im = mpImplicit(src); return im ? implicitCurve(im.F, A, c, w, dash) : curve(evalFunc(src), A, c, w, dash); };
function pcurve(fx, fy, t0, t1, A, c, w = 2.2, dash) { let d = ''; const n = 400; for (let i = 0; i <= n; i++) { const t = t0 + (t1 - t0) * i / n; d += (i ? 'L' : 'M') + A.X(fx(t)).toFixed(1) + ' ' + A.Y(fy(t)).toFixed(1); } return `<path d="${d}" ${STK(c, w, dash)} clip-path="url(#${A.cid})"/>`; }
const GCOL = [CL.navy, CL.red, CL.green, CL.orange, CL.purple];
const ptLab = (A, x, y, s, c = CL.dark, dx = 8, dy = -8) => dot([A.X(x), A.Y(y)], c) + (s ? svgMath(A.X(x) + dx, A.Y(y) + dy, s, { fs: 14, a: 'start', c }) : '');
/* ข้อความคณิตในรูป: ตัวอักษรเอียง ตัวเลขตรง ^ เป็นตัวยก */
function svgMath(x, y, str, o = {}) {
  const fs = o.fs || 15, src = String(str).replace(/\*/g, '·').replace(/(^|[^<>])-/g, '$1−');
  let out = '', i = 0;
  let pend = 0; const pd = (u) => { const v = (u || 0) + pend; pend = 0; return v ? ` dy="${+v.toFixed(2)}"` : ''; }; // ระยะยกที่ค้าง ใส่กับตัวอักษรถัดไป (Safari ไม่ใช้ dy ของ tspan ว่าง)
  const span = (t, it, up) => `<tspan font-family="${it ? 'KaTeX_Math' : 'KaTeX_Main'}"${it ? ' font-style="italic"' : ''}${/\S/.test(t) || up ? pd(up) : ''}${up ? ` font-size="${fs * 0.72}"` : ''}>${esc(t)}</tspan>`;
  const L = /[a-zA-Zα-ωΑ-Ωϕϑ]/;
  while (i < src.length) {
    let ch = src[i];
    if ((ch === '^' || ch === '_') && i + 1 < src.length) { const up = ch === '^'; i++; let t = ''; if (src[i] === '{') { i++; while (i < src.length && src[i] !== '}') t += src[i++]; i++; } else if (src[i] === '(' && up) { let dep = 0; do { if (src[i] === '(') dep++; if (src[i] === ')') dep--; t += src[i++]; } while (i < src.length && dep > 0); } else { while (i < src.length && /[\d.a-zA-Z′'+−]/.test(src[i]) && t.length < 4 && !(t.length && /[+−]/.test(src[i]))) { t += src[i++]; if (/[a-z]/i.test(t) && !up) break; if (/[a-z]/i.test(t)) break; } }
      const d = up ? -fs * 0.38 : fs * 0.22; out += t.split(/([a-zA-Zα-ω]+)/).filter(Boolean).map((w, k) => span(w, L.test(w), k ? 0 : d) ).join('').replace(/<tspan([^>]*)>/g, (m0, at, off) => at.includes('font-size=') ? m0 : `<tspan${at} font-size="${fs * 0.72}">`); pend += -d; continue; }
    if (/[฀-๿]/.test(ch)) { let w = ''; while (i < src.length && /[฀-๿\s]/.test(src[i])) w += src[i++]; out += `<tspan font-family="THS" font-size="${fs * 1.12}"${pd()}>${esc(w)}</tspan>`; continue; }
    if (L.test(ch)) { let w = ''; while (i < src.length && L.test(src[i])) w += src[i++]; const fn = /^(sin|cos|tan|sec|csc|cot|log|ln|exp|sqrt|abs|Re|Im|arg|max|min|det|lim|mod|arcsin|arccos|arctan)$/.test(w); out += span(fn ? w + (/^(Re|Im)$/.test(w) ? '' : ' ') : w, !fn); continue; }
    out += span(ch === ' ' ? ' ' : ch, false); i++;
  }
  return `<text x="${x}" y="${y}" font-size="${fs}" text-anchor="${o.a || 'middle'}" fill="${o.c || CL.dark}"${o.b ? ' font-weight="700"' : ''} xml:space="preserve">${out}</text>`;
}
function vecLab(x, y, n, c, fs = 15, a = 'middle') { // ชื่อเวกเตอร์ตัวเอียง + ลูกศรด้านบน
  n = String(n); const w = Math.max(7, n.replace(/\s/g, '').length * fs * .5); const x0 = a === 'start' ? x : a === 'end' ? x - w : x - w / 2, yy = y - fs * .82;
  const plain = /^[A-Za-zα-ω]{1,2}$/.test(n);
  return svgMath(x, y, n, { fs, c, a }) + (plain || n.length <= 3 ? `<path d="M${(x0 + 1).toFixed(1)} ${yy.toFixed(1)}h${(w - 1).toFixed(1)}m-3 -2.6l3 2.6-3 2.6" stroke="${c || CL.dark}" stroke-width="1.1" fill="none"/>` : '');
}
const fmt = v => (Math.round(v * 100) / 100).toString().replace('-', '−');

Object.assign(LIB, {
  /* ---------- 2 มิติ ---------- */
  tri: { name: 'รูปสามเหลี่ยม', p: [['kind', 'ชนิด', 'any', ['any:ทั่วไป', 'right:มุมฉาก', 'iso:หน้าจั่ว', 'equi:ด้านเท่า', 'obtuse:มุมป้าน']], ['v', 'ชื่อจุดยอด', 'A,B,C'], ['s', 'ป้ายด้าน (ตรงข้าม A,B,C)', 'a,b,c'], ['ang', 'ป้ายมุม (A,B,C) เว้นว่างได้', ''], yn('h', 'เส้นส่วนสูงจาก A', 'no'), yn('mk', 'เครื่องหมายด้านเท่า/มุมฉาก')],
    gen: p => {
      const R = { any: [[1.2, 3.2], [0, 0], [5, 0]], right: [[0, 3], [0, 0], [4.5, 0]], iso: [[2.3, 3.6], [0, 0], [4.6, 0]], equi: [[2.3, 3.98], [0, 0], [4.6, 0]], obtuse: [[-1.2, 2.4], [0, 0], [4.6, 0]] }[p.kind] || [[1, 3], [0, 0], [5, 0]];
      const F = fit(R); const [A, B, C] = R.map(F.P); const G = [(A[0] + B[0] + C[0]) / 3, (A[1] + B[1] + C[1]) / 3]; const V = vtx(p.v), S = vtx(p.s), An = vtx(p.ang);
      let s = pg([A, B, C], STK(CL.dark, 1.8) + ` fill="${CL.cream}"`);
      if (ON(p.h)) { const f = [A[0], B[1]]; s += pl([A, f], STK(CL.teal, 1.4, 1)) + rightMark(f, A, C, 9); if (f[0] < B[0] || f[0] > C[0]) s += pl([f, f[0] < B[0] ? B : C], STK(CL.gray, 1.2, 1)); }
      if (ON(p.mk)) { if (p.kind === 'right') s += rightMark(B, A, C); const tick = (a, b, n) => { const m = mid(a, b), d = nrm(sub2(b, a)), q = [-d[1], d[0]]; let t = ''; for (let i = 0; i < n; i++) { const o = (i - (n - 1) / 2) * 4; t += pl([[m[0] + d[0] * o - q[0] * 6, m[1] + d[1] * o - q[1] * 6], [m[0] + d[0] * o + q[0] * 6, m[1] + d[1] * o + q[1] * 6]], STK(CL.red, 1.4)); } return t; };
        if (p.kind === 'iso') s += tick(A, B, 1) + tick(A, C, 1); if (p.kind === 'equi') s += tick(A, B, 1) + tick(A, C, 1) + tick(B, C, 1); }
      [[A, B, C], [B, C, A], [C, A, B]].forEach(([P0, P1, P2], i) => { if (An[i]) s += arcMark(P0, P1, P2, 22, CL.orange, An[i]); });
      [A, B, C].forEach((P0, i) => { if (V[i]) s += vlab(P0, G, V[i]); });
      if (S[0]) s += sideLab(B, C, A, S[0]); if (S[1]) s += sideLab(C, A, B, S[1]); if (S[2]) s += sideLab(A, B, C, S[2]);
      return svgW(F.w, F.h, s);
    } },
  quad: { name: 'รูปสี่เหลี่ยม', p: [['kind', 'ชนิด', 'rect', ['sq:จัตุรัส', 'rect:ผืนผ้า', 'para:ด้านขนาน', 'trap:คางหมู', 'rhom:ขนมเปียกปูน', 'kite:รูปว่าว', 'any:ทั่วไป']], ['v', 'ชื่อจุดยอด (ทวนเข็มจากล่างซ้าย)', 'A,B,C,D'], ['s', 'ป้ายด้าน AB,BC,CD,DA', ''], yn('dg', 'เส้นทแยงมุม', 'no'), yn('mk', 'เครื่องหมายมุมฉาก')],
    gen: p => {
      const R = { sq: [[0, 0], [3, 0], [3, 3], [0, 3]], rect: [[0, 0], [5, 0], [5, 3], [0, 3]], para: [[0, 0], [4.5, 0], [5.8, 2.8], [1.3, 2.8]], trap: [[0, 0], [5.5, 0], [4, 2.8], [1.2, 2.8]], rhom: [[0, 0], [3.4, 0], [5.2, 2.85], [1.8, 2.85]], kite: [[2.5, -1.8], [4.3, 1.4], [2.5, 2.6], [0.7, 1.4]], any: [[0, 0], [5, .4], [4.2, 3.2], [.8, 2.6]] }[p.kind];
      const F = fit(R); const P = R.map(F.P); const G = [P.reduce((a, q) => a + q[0], 0) / 4, P.reduce((a, q) => a + q[1], 0) / 4]; const V = vtx(p.v), S = vtx(p.s);
      let s = pg(P, STK(CL.dark, 1.8) + ` fill="${CL.cream}"`);
      if (ON(p.dg)) s += pl([P[0], P[2]], STK(CL.teal, 1.3, 1)) + pl([P[1], P[3]], STK(CL.teal, 1.3, 1));
      if (ON(p.mk) && (p.kind === 'sq' || p.kind === 'rect')) P.forEach((q, i) => s += rightMark(q, P[(i + 1) % 4], P[(i + 3) % 4], 10));
      P.forEach((q, i) => { if (V[i]) s += vlab(q, G, V[i]); if (S[i]) s += sideLab(q, P[(i + 1) % 4], G, S[i]); });
      return svgW(F.w, F.h, s);
    } },
  circ: { name: 'วงกลม (คอร์ด เส้นสัมผัส เซกเตอร์)', p: [['O', 'ชื่อจุดศูนย์กลาง', 'O'], yn('r', 'รัศมี', 'yes'), ['rl', 'ป้ายรัศมี', 'r'], yn('d', 'เส้นผ่านศูนย์กลาง', 'no'), yn('ch', 'คอร์ด', 'no'), yn('tg', 'เส้นสัมผัส', 'no'), ['sec', 'เซกเตอร์ (มุมเป็นองศา 0 = ไม่มี)', '0'], yn('ins', 'มุมในส่วนโค้ง', 'no')],
    gen: p => {
      const R = 100, c = [150, 140]; const at = d => [c[0] + R * Math.cos(d * Math.PI / 180), c[1] - R * Math.sin(d * Math.PI / 180)]; let s = '';
      const sec = +p.sec || 0; if (sec > 0) { const a = at(0), b = at(sec); s += `<path d="M${c[0]} ${c[1]}L${a[0]} ${a[1]}A${R} ${R} 0 ${sec > 180 ? 1 : 0} 0 ${b[0].toFixed(1)} ${b[1].toFixed(1)}z" fill="#f6d3bd" stroke="${CL.orange}" stroke-width="1.4"/>` + arcMark(c, a, b, 22, CL.orange, sec + '°'); }
      s += `<circle cx="${c[0]}" cy="${c[1]}" r="${R}" ${STK(CL.dark, 1.8)}/>` + dot(c);
      if (ON(p.r)) { const e = at(sec > 0 ? sec : 30); s += pl([c, e], STK(CL.navy, 1.6)) + lab((c[0] + e[0]) / 2 - 4, (c[1] + e[1]) / 2 - 7, p.rl, { fs: 15, c: CL.navy }); }
      if (ON(p.d)) s += pl([at(200), at(20)], STK(CL.teal, 1.6));
      if (ON(p.ch)) { const a = at(120), b = at(240); s += pl([a, b], STK(CL.purple, 1.6)) + dot(a) + dot(b); }
      if (ON(p.tg)) { const t = at(-60); const dv = [Math.cos(30 * Math.PI / 180), Math.sin(30 * Math.PI / 180)]; s += pl([[t[0] - dv[0] * 90, t[1] - dv[1] * 90], [t[0] + dv[0] * 90, t[1] + dv[1] * 90]], STK(CL.red, 1.6)) + pl([c, t], STK(CL.gray, 1.2, 1)) + rightMark(t, c, [t[0] + dv[0] * 30, t[1] + dv[1] * 30], 9) + dot(t); }
      if (ON(p.ins)) { const a = at(160), b = at(20), q = at(260); s += pl([a, q, b], STK(CL.green, 1.5)) + pl([a, c, b], STK(CL.green, 1.2, 1)) + arcMark(q, a, b, 18, CL.green) + arcMark(c, a, b, 16, CL.green); }
      s += lab(c[0] - 12, c[1] + 18, p.O, { fs: 16 });
      return svgW(300, 280, s);
    } },
  poly: { name: 'รูปหลายเหลี่ยมด้านเท่า', p: [['n', 'จำนวนด้าน', '6'], ['v', 'ชื่อจุดยอด (คั่นด้วย ,)', 'A,B,C,D,E,F'], yn('c', 'จุดศูนย์กลางและรัศมี', 'no'), yn('dg', 'เส้นทแยงมุมทั้งหมด', 'no')],
    gen: p => {
      const n = Math.max(3, Math.min(12, +p.n || 6)), R = 100, c = [140, 135]; const P = Array.from({ length: n }, (_, i) => { const t = -Math.PI / 2 - Math.PI / n + i * 2 * Math.PI / n; return [c[0] + R * Math.cos(t), c[1] - R * Math.sin(t)]; }); const V = vtx(p.v);
      let s = pg(P, STK(CL.dark, 1.8) + ` fill="${CL.cream}"`);
      if (ON(p.dg)) for (let i = 0; i < n; i++) for (let j = i + 2; j < n; j++) if (!(i === 0 && j === n - 1)) s += pl([P[i], P[j]], STK(CL.teal, 1, 1));
      if (ON(p.c)) s += dot(c) + pl([c, P[0]], STK(CL.navy, 1.4)) + lab(c[0] + 10, c[1] + 6, 'O', { fs: 15 });
      P.forEach((q, i) => { if (V[i]) s += vlab(q, c, V[i]); });
      return svgW(280, 270, s);
    } },
  paral: { name: 'เส้นขนานและเส้นตัด', p: [['l', 'ชื่อเส้นขนาน', 'ℓ₁,ℓ₂'], ['t', 'ชื่อเส้นตัด', 't'], ['a', 'ป้ายมุม 1–8 (คั่นด้วย ,) เว้นว่างได้', '1,2,3,4,5,6,7,8'], ['hl', 'มุมที่ระบายสี (เลข คั่นด้วย ,)', '']],
    gen: p => {
      const y1 = 70, y2 = 170, W = 400; const L = vtx(p.l); const A = vtx(p.a), H = list(p.hl).map(Number); const sl = 0.55; const xAt = y => 200 + (y - 120) * sl * -1;
      let s = `<path d="M30 ${y1}H${W - 30}M30 ${y2}H${W - 30}" ${STK(CL.dark, 1.8)}/>` + `<path d="M${W - 36} ${y1}l-9 -4v8zM${W - 36} ${y2}l-9 -4v8z" fill="${CL.dark}"/>`;
      const t0 = [xAt(10), 10], t1 = [xAt(230), 230]; s += pl([t0, t1], STK(CL.navy, 1.8));
      const P1 = [xAt(y1), y1], P2 = [xAt(y2), y2];
      const quads = (P, k) => [[[P[0] + 40, P[1]], [P[0] - 22, P[1] - 40]], [[P[0] - 22, P[1] - 40], [P[0] - 40, P[1]]], [[P[0] - 40, P[1]], [P[0] + 22, P[1] + 40]], [[P[0] + 22, P[1] + 40], [P[0] + 40, P[1]]]].map((ab, i) => ({ ab, n: k + i }));
      [...quads(P1, 1), ...quads(P2, 5)].forEach(({ ab: [a, b], n }) => { const P = n <= 4 ? P1 : P2; const lb = A[n - 1]; if (H.includes(n)) s += `<path d="M${P[0]} ${P[1]}L${(P[0] + nrm(sub2(a, P))[0] * 22).toFixed(1)} ${(P[1] + nrm(sub2(a, P))[1] * 22).toFixed(1)}" stroke="none"/>` + arcMark(P, a, b, 20, CL.red); if (lb) { const m = nrm([nrm(sub2(a, P))[0] + nrm(sub2(b, P))[0], nrm(sub2(a, P))[1] + nrm(sub2(b, P))[1]]); s += lab(P[0] + m[0] * 17, P[1] + m[1] * 17 + 5, lb, { fs: 13, c: H.includes(n) ? CL.red : CL.brown }); } });
      if (L[0]) s += lab(W - 20, y1 - 8, L[0], { fs: 15 }); if (L[1]) s += lab(W - 20, y2 - 8, L[1], { fs: 15 }); if (p.t) s += lab(t1[0] - 10, t1[1] - 2, p.t, { fs: 15, c: CL.navy });
      return svgW(W, 240, s);
    } },
  /* ---------- 3 มิติ ---------- */
  solid: { name: 'ทรงสามมิติ', p: [['kind', 'ชนิด', 'cuboid', ['cube:ลูกบาศก์', 'cuboid:ทรงสี่เหลี่ยมมุมฉาก', 'tprism:ปริซึมสามเหลี่ยม', 'pyr:พีระมิดฐานสี่เหลี่ยม', 'tet:พีระมิดฐานสามเหลี่ยม', 'cyl:ทรงกระบอก', 'cone:กรวย', 'sph:ทรงกลม', 'hemi:ครึ่งทรงกลม']], ['dim', 'ป้ายมิติ (กว้าง, ยาว/รัศมี, สูง) คั่นด้วย ,', 'a,b,c'], ['v', 'ชื่อจุดยอด (เว้นว่างได้)', ''], yn('hid', 'เส้นที่มองไม่เห็นเป็นเส้นประ'), yn('h', 'เส้นความสูงภายใน', 'no')],
    gen: p => {
      const D = vtx(p.dim), V = vtx(p.v); const hidC = CL.gray; const HD = ON(p.hid); let s = '';
      const ob = (x, y, z) => [60 + x * 46 + z * 22, 250 - y * 46 - z * 16];
      const edge = (a, b, hid) => pl([a, b], hid ? STK(hidC, 1.3, HD ? 1 : 0) : STK(CL.dark, 1.8));
      const k = p.kind;
      if (k === 'cube' || k === 'cuboid') {
        const [w, d, h] = k === 'cube' ? [3, 3, 3] : [4.5, 2.6, 2.8]; const P = [[0, 0, 0], [w, 0, 0], [w, 0, d], [0, 0, d], [0, h, 0], [w, h, 0], [w, h, d], [0, h, d]].map(q => ob(...q));
        s += pg([P[0], P[1], P[5], P[4]], `fill="${CL.cream}" stroke="none"`) + pg([P[1], P[2], P[6], P[5]], `fill="#f6e6d6" stroke="none"`) + pg([P[4], P[5], P[6], P[7]], `fill="#fbf0e4" stroke="none"`);
        [[0, 1], [1, 2], [1, 5], [0, 4], [4, 5], [5, 6], [6, 7], [7, 4], [2, 6]].forEach(([a, b]) => s += edge(P[a], P[b]));
        [[0, 3], [3, 2], [3, 7]].forEach(([a, b]) => s += edge(P[a], P[b], 1));
        if (D[0]) s += lab(mid(P[0], P[1])[0], P[0][1] + 20, D[0], { fs: 15, c: CL.teal }); if (D[1]) s += lab(mid(P[1], P[2])[0] + 14, mid(P[1], P[2])[1] + 10, D[1], { fs: 15, c: CL.teal }); if (D[2]) s += lab(P[0][0] - 14, mid(P[0], P[4])[1] + 5, D[2], { fs: 15, c: CL.teal });
        const VL = [0, 1, 2, 3, 4, 5, 6, 7]; const off = [[-12, 14], [10, 14], [12, 10], [-10, 12], [-12, -6], [8, -8], [10, -6], [-10, -8]]; V.forEach((n, i) => { if (P[VL[i]]) s += lab(P[i][0] + off[i][0], P[i][1] + off[i][1], n, { fs: 15 }); });
        if (ON(p.h)) s += edge(P[0], P[6], 1);
        return svgW(330, 300, s);
      }
      if (k === 'tprism') { const P = [[0, 0, 0], [4, 0, 0], [1.6, 0, 2.6], [0, 3, 0], [4, 3, 0], [1.6, 3, 2.6]].map(q => ob(...q)); s += pg([P[0], P[1], P[4], P[3]], `fill="${CL.cream}"`); [[0, 1], [1, 4], [0, 3], [3, 4], [4, 5], [5, 3], [1, 2].concat()].slice(0, 6).forEach(([a, b]) => s += edge(P[a], P[b])); s += edge(P[1], P[2], 1) + edge(P[0], P[2], 1) + edge(P[2], P[5], 1); V.forEach((n, i) => { if (P[i]) s += lab(P[i][0] + (i % 3 === 1 ? 12 : -12), P[i][1] + (i < 3 ? 14 : -6), n, { fs: 15 }); }); if (D[2]) s += lab(P[0][0] - 14, mid(P[0], P[3])[1], D[2], { fs: 15, c: CL.teal }); return svgW(300, 300, s); }
      if (k === 'pyr' || k === 'tet') {
        const base = k === 'pyr' ? [[0, 0, 0], [4, 0, 0], [4, 0, 3], [0, 0, 3]] : [[0, 0, 0], [4, 0, 0], [1.8, 0, 3]]; const c3 = base.reduce((a, q) => [a[0] + q[0] / base.length, 0, a[2] + q[2] / base.length], [0, 0, 0]);
        const B = base.map(q => ob(...q)), Ap = ob(c3[0], 4, c3[2]), F = ob(c3[0], 0, c3[2]);
        if (k === 'pyr') { s += pg([B[0], B[1], Ap], `fill="${CL.cream}"`) + pg([B[1], B[2], Ap], `fill="#f6e6d6"`); s += edge(B[0], B[1]) + edge(B[1], B[2]) + edge(B[2], B[3], 1) + edge(B[3], B[0], 1) + edge(Ap, B[0]) + edge(Ap, B[1]) + edge(Ap, B[2]) + edge(Ap, B[3], 1); }
        else { s += pg([B[0], B[1], Ap], `fill="${CL.cream}"`); s += edge(B[0], B[1]) + edge(B[1], B[2], 1) + edge(B[2], B[0], 1) + edge(Ap, B[0]) + edge(Ap, B[1]) + edge(Ap, B[2], 1); }
        if (ON(p.h)) s += edge(Ap, F, 1) + dot(F, CL.gray, 2.5);
        [...B, Ap].forEach((q, i) => { if (V[i]) s += lab(q[0] + (i === B.length ? 0 : q[0] > 150 ? 12 : -12), q[1] + (i === B.length ? -10 : 14), V[i], { fs: 15 }); });
        if (D[2]) s += lab(F[0] + 12, mid(Ap, F)[1], D[2], { fs: 15, c: CL.teal });
        return svgW(320, 300, s);
      }
      const cx = 150, rx = 80, ry = 24;
      if (k === 'cyl') { const yt = 60, yb = 230; s += `<path d="M${cx - rx} ${yt}V${yb}A${rx} ${ry} 0 0 0 ${cx + rx} ${yb}V${yt}" fill="${CL.cream}" ${STK(CL.dark, 1.8)}/><ellipse cx="${cx}" cy="${yt}" rx="${rx}" ry="${ry}" fill="#fbf0e4" ${STK(CL.dark, 1.8)}/><path d="M${cx - rx} ${yb}A${rx} ${ry} 0 0 1 ${cx + rx} ${yb}" ${STK(hidC, 1.3, HD)}/>` + dot([cx, yb], CL.dark, 2.5) + pl([[cx, yb], [cx + rx, yb]], STK(CL.navy, 1.5)); if (D[1]) s += lab(cx + rx / 2, yb - 6, D[1], { fs: 15, c: CL.navy }); if (D[2]) s += lab(cx + rx + 16, (yt + yb) / 2, D[2], { fs: 15, c: CL.teal }); if (ON(p.h)) s += pl([[cx, yt], [cx, yb]], STK(hidC, 1.3, 1)); return svgW(300, 280, s); }
      if (k === 'cone') { const yt = 40, yb = 230; s += `<path d="M${cx - rx} ${yb}L${cx} ${yt}L${cx + rx} ${yb}A${rx} ${ry} 0 0 1 ${cx - rx} ${yb}" fill="${CL.cream}" ${STK(CL.dark, 1.8)}/><path d="M${cx - rx} ${yb}A${rx} ${ry} 0 0 1 ${cx + rx} ${yb}" ${STK(hidC, 1.3, HD)}/>` + dot([cx, yb], CL.dark, 2.5) + pl([[cx, yb], [cx + rx, yb]], STK(CL.navy, 1.5)); if (ON(p.h) || D[2]) s += pl([[cx, yt], [cx, yb]], STK(hidC, 1.3, 1)) + rightMark([cx, yb], [cx, yt], [cx + rx, yb], 8); if (D[1]) s += lab(cx + rx / 2, yb + 18, D[1], { fs: 15, c: CL.navy }); if (D[2]) s += lab(cx - 12, (yt + yb) / 2 + 10, D[2], { fs: 15, c: CL.teal }); if (D[0]) s += lab((cx + cx + rx) / 2 + 14, (yt + yb) / 2 - 4, D[0], { fs: 15, c: CL.purple }); return svgW(300, 280, s); }
      if (k === 'sph' || k === 'hemi') { const cy = 150, R = 95; if (k === 'sph') s += `<circle cx="${cx}" cy="${cy}" r="${R}" fill="${CL.cream}" ${STK(CL.dark, 1.8)}/><path d="M${cx - R} ${cy}A${R} ${ry} 0 0 0 ${cx + R} ${cy}" ${STK(CL.dark, 1.3)}/><path d="M${cx - R} ${cy}A${R} ${ry} 0 0 1 ${cx + R} ${cy}" ${STK(hidC, 1.3, HD)}/>`; else s += `<path d="M${cx - R} ${cy}A${R} ${R} 0 0 1 ${cx + R} ${cy}A${R} ${ry} 0 0 1 ${cx - R} ${cy}" fill="${CL.cream}" ${STK(CL.dark, 1.8)}/><path d="M${cx - R} ${cy}A${R} ${ry} 0 0 1 ${cx + R} ${cy}" ${STK(CL.dark, 1.3)}/>`; s += dot([cx, cy], CL.dark, 2.5) + pl([[cx, cy], [cx + R, cy]], STK(CL.navy, 1.5)); if (D[1]) s += lab(cx + R / 2, cy - 7, D[1], { fs: 15, c: CL.navy }); return svgW(300, k === 'sph' ? 260 : 190, s); }
      return svgW(100, 40, '');
    } },
  /* ---------- กราฟของฟังก์ชัน ---------- */
  fgraph: { name: 'กราฟของฟังก์ชัน', p: [['f', 'ฟังก์ชัน คั่นด้วย ; เช่น x^2-2; 2x+1; sin(x)', 'x^2-2; 2x+1'], ['lb', 'ชื่อกราฟ (คั่นด้วย ;)', 'y = x^2 - 2; y = 2x + 1'], ['pts', 'จุดที่ทำเครื่องหมาย เช่น 3,7; -1,-1', ''], ...AX],
    gen: p => {
      const A = plane(p); let s = A.s; const F = p.f.split(';').map(x => x.trim()).filter(Boolean); const L = (p.lb || '').split(';').map(x => x.trim());
      const placed = [];
      F.forEach((f, i) => { try { const im = mpImplicit(f); const fx = im ? null : evalFunc(f); s += im ? implicitCurve(im.F, A, GCOL[i % 5]) : curve(fx, A, GCOL[i % 5]);
        if (!L[i]) return; const span = A.x1 - A.x0; let best = null;
        const fy = im ? (x => { const Y0 = A.y0 + (A.y1 - A.y0) * .1, Y1 = A.y1 - (A.y1 - A.y0) * .1; let p = im.F(x, Y1); for (let k = 1; k <= 200; k++) { const yy = Y1 - (Y1 - Y0) * k / 200, q = im.F(x, yy); if (isFinite(p) && isFinite(q) && (p < 0) !== (q < 0)) return yy; p = q; } return NaN; }) : fx;
        for (let t = 0; t <= 60; t++) { const x = A.x1 - span * (0.04 + t / 70); const y = fy(x); if (!isFinite(y) || y > A.y1 - (A.y1 - A.y0) * 0.08 || y < A.y0 + (A.y1 - A.y0) * 0.08) continue; best = [x, y]; break; }
        if (!best) return; const wpx = L[i].length * 14 * 0.5; let px = A.X(best[0]) + 8, py = A.Y(best[1]) - 6, an = 'start';
        if (px + wpx > A.w - 8) { px = A.X(best[0]) - 8; an = 'end'; }
        for (let g = 0; g < 6 && placed.some(q => Math.abs(q[1] - py) < 17 && Math.abs(q[0] - px) < wpx + 10); g++) py += 18;
        placed.push([px, py]); s += svgMath(px, py, L[i], { a: an, fs: 14, c: GCOL[i % 5] });
      } catch (e) { } });
      p.pts.split(';').map(x => x.trim()).filter(Boolean).forEach(q => { const [x, y] = q.split(',').map(Number); if (isFinite(x) && isFinite(y)) s += pl([[A.X(x), A.Y(y)], [A.X(x), A.Y(0)]], STK(CL.gray, 1, 1)) + pl([[A.X(x), A.Y(y)], [A.X(0), A.Y(y)]], STK(CL.gray, 1, 1)) + ptLab(A, x, y, `(${fmt(x)}, ${fmt(y)})`, CL.red); });
      return svgW(A.w, A.h, s);
    } },
  /* ---------- เวกเตอร์ ---------- */
  vec2: { name: 'เวกเตอร์ในระนาบ', p: [['v', 'เวกเตอร์: ชื่อ=x,y หรือ ชื่อ=x,y@จุดเริ่ม x,y คั่นด้วย ;', 'u=3,1; v=1,2; u+v=4,3'], yn('pg', 'รูปสี่เหลี่ยมด้านขนาน (2 เวกเตอร์แรก)', 'yes'), yn('cp', 'เส้นแสดงองค์ประกอบ x, y', 'no'), ...AX.map(a => a[0] === 'x0' ? ['x0', a[1], '-1'] : a[0] === 'y0' ? ['y0', a[1], '-1'] : a)],
    gen: p => {
      const A = plane(p); let s = A.s; const VS = p.v.split(';').map(x => x.trim()).filter(Boolean).map(t => { const m = /^([^=]*)=\s*([-\d.]+)\s*,\s*([-\d.]+)(?:\s*@\s*([-\d.]+)\s*,\s*([-\d.]+))?/.exec(t); return m ? { n: m[1].trim(), x: +m[2], y: +m[3], sx: +(m[4] || 0), sy: +(m[5] || 0) } : null; }).filter(Boolean);
      const arrow = (x0, y0, x1, y1, c, n) => { const a = [A.X(x0), A.Y(y0)], b = [A.X(x1), A.Y(y1)], d = nrm(sub2(b, a)), q = [-d[1], d[0]]; const h = [b[0] - d[0] * 11, b[1] - d[1] * 11]; let o = pl([a, h], STK(c, 2.2)) + pg([b, [h[0] + q[0] * 5, h[1] + q[1] * 5], [h[0] - q[0] * 5, h[1] - q[1] * 5]], `fill="${c}"`); if (n) { const m = mid(a, b); o += vecLab(m[0] + q[0] * 15, m[1] + q[1] * 15 + 5, n, c); } return o; };
      if (ON(p.pg) && VS.length >= 2) { const [u, v] = VS; s += pl([[A.X(u.x), A.Y(u.y)], [A.X(u.x + v.x), A.Y(u.y + v.y)]], STK(CL.gray, 1.2, 1)) + pl([[A.X(v.x), A.Y(v.y)], [A.X(u.x + v.x), A.Y(u.y + v.y)]], STK(CL.gray, 1.2, 1)); }
      VS.forEach((v, i) => { if (ON(p.cp)) s += pl([[A.X(v.sx), A.Y(v.sy)], [A.X(v.sx + v.x), A.Y(v.sy)], [A.X(v.sx + v.x), A.Y(v.sy + v.y)]], STK(GCOL[i % 5], 1, 1)); s += arrow(v.sx, v.sy, v.sx + v.x, v.sy + v.y, GCOL[i % 5], v.n); });
      return svgW(A.w, A.h, s);
    } },
  vec3: { name: 'ระบบพิกัดสามมิติ', p: [['pt', 'จุด/เวกเตอร์ (x,y,z) เช่น P=2,3,4', 'P=2,3,4'], yn('box', 'กล่องเส้นประแสดงพิกัด'), yn('arr', 'วาดเป็นเวกเตอร์จากจุดกำเนิด'), ['ijk', 'แสดงเวกเตอร์หน่วย i j k', 'no', ['no:ไม่แสดง', 'yes:แสดง']]],
    gen: p => {
      const O = [150, 192], ex = [-0.5, 0.42], ey = [1, 0], ez = [0, -1], u = 34; const P3 = (x, y, z) => [O[0] + (x * ex[0] + y * ey[0] + z * ez[0]) * u, O[1] + (x * ex[1] + y * ey[1] + z * ez[1]) * u];
      let s = ''; const axis = (v, n) => { const a = P3(0, 0, 0), b = P3(...v.map(t => t * 4.6)); const d = nrm(sub2(b, a)), q = [-d[1], d[0]]; return pl([a, b], STK(CL.dark, 1.4)) + pg([[b[0] + d[0] * 8, b[1] + d[1] * 8], [b[0] + q[0] * 4, b[1] + q[1] * 4], [b[0] - q[0] * 4, b[1] - q[1] * 4]], `fill="${CL.dark}"`) + T(b[0] + d[0] * 18, b[1] + d[1] * 18 + 5, n, { m: 1, fs: 16 }); };
      s += axis([1, 0, 0], 'x') + axis([0, 1, 0], 'y') + axis([0, 0, 1], 'z') + T(O[0] - 10, O[1] + 4, 'O', { m: 1, fs: 13, a: 'end' });
      if (p.ijk === 'yes') [[1, 0, 0, 'i'], [0, 1, 0, 'j'], [0, 0, 1, 'k']].forEach(([x, y, z, n]) => { const b = P3(x, y, z); s += pl([P3(0, 0, 0), b], STK(CL.red, 2.4)) + T(b[0] + 8, b[1] - 4, n, { fs: 14, c: CL.red, r: 1, b: 1 }); });
      p.pt.split(';').map(x => x.trim()).filter(Boolean).forEach((t, i) => {
        const m = /^(?:([^=]*)=)?\s*([-\d.]+)\s*,\s*([-\d.]+)\s*,\s*([-\d.]+)/.exec(t); if (!m) return; const [x, y, z] = [+m[2], +m[3], +m[4]]; const c = GCOL[i % 5];
        if (ON(p.box)) { const B = [[x, 0, 0], [x, y, 0], [0, y, 0], [0, y, z], [0, 0, z], [x, 0, z], [x, y, z]].map(q => P3(...q)); s += pl([B[0], B[1], B[2]], STK(CL.gray, 1.1, 1)) + pl([B[1], B[6]], STK(CL.gray, 1.1, 1)) + pl([B[2], B[3], B[6], B[5], B[4], B[3]], STK(CL.gray, 1.1, 1)) + pl([B[0], B[5]], STK(CL.gray, 1.1, 1)); }
        const q = P3(x, y, z); if (ON(p.arr)) { const a = P3(0, 0, 0), d = nrm(sub2(q, a)), n2 = [-d[1], d[0]], h = [q[0] - d[0] * 10, q[1] - d[1] * 10]; s += pl([a, h], STK(c, 2.2)) + pg([q, [h[0] + n2[0] * 4.5, h[1] + n2[1] * 4.5], [h[0] - n2[0] * 4.5, h[1] - n2[1] * 4.5]], `fill="${c}"`); } else s += dot(q, c, 4);
        s += T(q[0] + 8, q[1] - 8, `${m[1] ? m[1].trim() : ''}(${fmt(x)}, ${fmt(y)}, ${fmt(z)})`, { a: 'start', fs: 14, c, r: 1 });
      });
      return svgW(330, 322, s);
    } },
  /* ---------- เรขาคณิตวิเคราะห์และภาคตัดกรวย ---------- */
  aline: { name: 'เส้นตรง ระยะทาง จุดกึ่งกลาง', p: [['P', 'จุดที่ 1 (ชื่อ=x,y)', 'A=-2,-1'], ['Q', 'จุดที่ 2 (ชื่อ=x,y)', 'B=3,2'], ['mode', 'แสดง', 'line', ['line:เส้นตรงผ่านสองจุด', 'seg:ส่วนของเส้นตรง', 'slope:ส่วนของเส้นตรง + สามเหลี่ยมความชัน', 'mid:ส่วนของเส้นตรง + จุดกึ่งกลาง']], ...AX],
    gen: p => {
      const A = plane(p); let s = A.s; const rd = t => { const m = /^(?:([^=]*)=)?\s*([-\d.]+)\s*,\s*([-\d.]+)/.exec(t || ''); return m ? { n: (m[1] || '').trim(), x: +m[2], y: +m[3] } : null; }; const a = rd(p.P), b = rd(p.Q); if (!a || !b) return svgW(A.w, A.h, s);
      if (p.mode === 'line') { if (a.x === b.x) s += pl([[A.X(a.x), A.Y(A.y0)], [A.X(a.x), A.Y(A.y1)]], STK(CL.navy, 2)); else { const m = (b.y - a.y) / (b.x - a.x); s += curve(x => a.y + m * (x - a.x), A, CL.navy, 2); } }
      else s += pl([[A.X(a.x), A.Y(a.y)], [A.X(b.x), A.Y(b.y)]], STK(CL.navy, 2.2));
      if (p.mode === 'slope') { s += pl([[A.X(a.x), A.Y(a.y)], [A.X(b.x), A.Y(a.y)], [A.X(b.x), A.Y(b.y)]], STK(CL.orange, 1.5, 1)) + T((A.X(a.x) + A.X(b.x)) / 2, A.Y(a.y) + 18, `Δx = ${fmt(b.x - a.x)}`, { fs: 13, c: CL.orange, r: 1 }) + T(A.X(b.x) + 6, (A.Y(a.y) + A.Y(b.y)) / 2 + 4, `Δy = ${fmt(b.y - a.y)}`, { fs: 13, c: CL.orange, a: 'start', r: 1 }); }
      if (p.mode === 'mid') { const mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2; s += ptLab(A, mx, my, `M(${fmt(mx)}, ${fmt(my)})`, CL.green, 8, 16); }
      s += ptLab(A, a.x, a.y, `${a.n}(${fmt(a.x)}, ${fmt(a.y)})`, CL.red, -8, -8).replace('text-anchor="start"', 'text-anchor="end"') + ptLab(A, b.x, b.y, `${b.n}(${fmt(b.x)}, ${fmt(b.y)})`, CL.red);
      return svgW(A.w, A.h, s);
    } },
  conic: { name: 'ภาคตัดกรวย (วงกลม พาราโบลา วงรี ไฮเพอร์โบลา)', p: [['kind', 'ชนิด', 'ellipse', ['circle:วงกลม', 'parab:พาราโบลา', 'ellipse:วงรี', 'hyper:ไฮเพอร์โบลา']], ['h', 'จุดศูนย์กลาง/จุดยอด h', '0'], ['k', 'จุดศูนย์กลาง/จุดยอด k', '0'], ['a', 'a (รัศมี / ครึ่งแกนเอก / ระยะโฟกัส c ของพาราโบลา)', '4'], ['b', 'b (ครึ่งแกนโท)', '2.5'], ['dir', 'แนวแกน / ทิศเปิด', 'h', ['h:แนวนอน (เปิดขวา)', 'v:แนวตั้ง (เปิดขึ้น)', 'hn:แนวนอน (เปิดซ้าย)', 'vn:แนวตั้ง (เปิดลง)']], yn('f', 'โฟกัส'), yn('ax', 'แกนเอก/แกนโท หรือเส้นไดเรกตริกซ์'), yn('as', 'เส้นกำกับ (ไฮเพอร์โบลา)'), ['x0', 'x น้อยสุด', '-6'], ['x1', 'x มากสุด', '6'], ['y0', 'y น้อยสุด', '-5'], ['y1', 'y มากสุด', '5'], ['st', 'ระยะห่างของสเกล', '1'], yn('grid', 'เส้นตาราง'), yn('num', 'ตัวเลขบนแกน')],
    gen: p => {
      const A = plane(p); let s = A.s; const h = +p.h || 0, k = +p.k || 0, a = Math.abs(+p.a || 1), b = Math.abs(+p.b || 1); const V = p.dir[0] === 'v', sg = p.dir.endsWith('n') ? -1 : 1; const C = CL.navy;
      const F = (x, y, n, dx = 6) => ON(p.f) ? ptLab(A, x, y, n, CL.red, dx, -6) : '';
      if (p.kind === 'circle') { s += pcurve(t => h + a * Math.cos(t), t => k + a * Math.sin(t), 0, 2 * Math.PI, A, C) + ptLab(A, h, k, 'C', CL.dark, -17, -8) + pl([[A.X(h), A.Y(k)], [A.X(h + a * Math.cos(.6)), A.Y(k + a * Math.sin(.6))]], STK(CL.teal, 1.5)) + T(A.X(h + a / 2 * Math.cos(.6)) - 4, A.Y(k + a / 2 * Math.sin(.6)) - 6, 'r', { m: 1, fs: 15, c: CL.teal }); }
      if (p.kind === 'parab') { const c = a; const R = Math.max(A.x1 - A.x0, A.y1 - A.y0); if (V) { s += curve(x => k + sg * (x - h) ** 2 / (4 * c), A, C); s += F(h, k + sg * c, 'F'); if (ON(p.ax)) s += pl([[A.X(A.x0), A.Y(k - sg * c)], [A.X(A.x1), A.Y(k - sg * c)]], STK(CL.purple, 1.5, 1)); } else { s += pcurve(t => h + sg * t * t / (4 * c), t => k + t, -R, R, A, C); s += F(h + sg * c, k, 'F'); if (ON(p.ax)) s += pl([[A.X(h - sg * c), A.Y(A.y0)], [A.X(h - sg * c), A.Y(A.y1)]], STK(CL.purple, 1.5, 1)); } s += (h || k) ? ptLab(A, h, k, 'V', CL.dark, 8, 16) : ptLab(A, h, k, 'V', CL.dark, V ? 8 : sg * 9 - 4, V ? -sg * 12 + 4 : -9); }
      if (p.kind === 'ellipse') { const [ra, rb] = V ? [b, a] : [a, b]; s += pcurve(t => h + ra * Math.cos(t), t => k + rb * Math.sin(t), 0, 2 * Math.PI, A, C); const c = Math.sqrt(Math.abs(a * a - b * b)); if (ON(p.ax)) s += pl([[A.X(h - ra), A.Y(k)], [A.X(h + ra), A.Y(k)]], STK(CL.teal, 1.3, 1)) + pl([[A.X(h), A.Y(k - rb)], [A.X(h), A.Y(k + rb)]], STK(CL.teal, 1.3, 1)); s += V ? F(h, k + c, 'F₁') + F(h, k - c, 'F₂') : F(h + c, k, 'F₁') + F(h - c, k, 'F₂'); s += ptLab(A, h, k, 'C', CL.dark, 7, (h || k) ? 16 : -8); }
      if (p.kind === 'hyper') { const R = 4; if (V) { s += pcurve(t => h + b * Math.sinh(t), t => k + a * Math.cosh(t), -R, R, A, C) + pcurve(t => h + b * Math.sinh(t), t => k - a * Math.cosh(t), -R, R, A, C); } else { s += pcurve(t => h + a * Math.cosh(t), t => k + b * Math.sinh(t), -R, R, A, C) + pcurve(t => h - a * Math.cosh(t), t => k + b * Math.sinh(t), -R, R, A, C); } const c = Math.sqrt(a * a + b * b);
        if (ON(p.as)) { const m = V ? a / b : b / a; s += curve(x => k + m * (x - h), A, CL.gray, 1.3, 1) + curve(x => k - m * (x - h), A, CL.gray, 1.3, 1); }
        if (ON(p.ax)) s += V ? pl([[A.X(h - b), A.Y(k - a)], [A.X(h + b), A.Y(k - a)], [A.X(h + b), A.Y(k + a)], [A.X(h - b), A.Y(k + a)], [A.X(h - b), A.Y(k - a)]], STK(CL.teal, 1.1, 1)) : pl([[A.X(h - a), A.Y(k - b)], [A.X(h + a), A.Y(k - b)], [A.X(h + a), A.Y(k + b)], [A.X(h - a), A.Y(k + b)], [A.X(h - a), A.Y(k - b)]], STK(CL.teal, 1.1, 1));
        s += V ? F(h, k + c, 'F₁') + F(h, k - c, 'F₂') : F(h + c, k, 'F₁') + F(h - c, k, 'F₂', -22); }
      return svgW(A.w, A.h, s);
    } },
});
/* หมวดหมู่ของคลังรูป */
const LIBCAT = [
  ['เรขาคณิต 2 มิติ', ['tri', 'quad', 'circ', 'poly', 'paral']],
  ['เรขาคณิต 3 มิติ', ['solid']],
  ['กราฟของฟังก์ชัน', ['fgraph']],
  ['เวกเตอร์', ['vec2', 'vec3']],
  ['เรขาคณิตวิเคราะห์ ภาคตัดกรวย', ['aline', 'conic']],
  ['เซต เส้นจำนวน', ['venn2', 'venn3', 'numline']],
  ['การนับ ความน่าจะเป็น', ['slots', 'seats', 'round', 'tree', 'dice', 'grid', 'stars', 'balls', 'people']],
  ['วาดเอง (อิสระ)', ['FREE']],
];

