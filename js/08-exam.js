'use strict';
/* ===================== ตัวแก้แบบทีละรายการ (เพิ่ม/ลบ/เลื่อน ทีละข้อ ทีละสมการ) ===================== */
const RW_COL = [['', 'สีอัตโนมัติ'], ['red', 'แดง'], ['blue', 'น้ำเงิน'], ['green', 'เขียว'], ['orange', 'ส้ม'], ['purple', 'ม่วง'], ['teal', 'เขียวน้ำทะเล'], ['brown', 'น้ำตาล'], ['gray', 'เทา'], ['black', 'ดำ']];
const RW_OP = ['=', '<=', '<', '>=', '>'], RW_OPL = { '=': '=', '<=': '≤', '<': '<', '>=': '≥', '>': '>' };
const RW_OP2 = ['<=', '<'];
const colKey = w => { if (!w) return ''; if (/^#[0-9a-f]{6}$/i.test(w)) return w.toLowerCase(); const c = colOfWord(w); if (!c) return ''; const e = Object.entries(COLNAME).find(([k, v]) => v === c && /^[a-z]+$/.test(k)); return e ? e[0] : ''; };
const num = v => String(v ?? '').trim();
const rwP = '\\(\\s*([-\\d.]+)\\s*,\\s*([-\\d.]+)\\s*\\)';

/* ---------- ระนาบรวม ---------- */
const COMBO_T = [
  { k: 'f', n: 'กราฟ y = f(x)', f: [['e', 'y =', 'fn', 'x^2'], ['dash', 'เส้นประ', 'chk']], ser: v => `f: ${v.e}`, par: s => { const m = /^(?:f|y)\s*:\s*(.+)$/.exec(s); return m && { e: m[1].trim() }; } },
  { k: 'area', n: 'ระบายพื้นที่ระหว่างกราฟ', f: [['e', 'กราฟบน y =', 'fn', '4-x^2'], ['g', 'กราฟล่าง y = (ว่าง = แกน x)', 'fn', ''], ['a', 'จาก x =', 'num', '-2'], ['b', 'ถึง x =', 'num', '2']], ser: v => `area: ${v.e} ; ${v.g || ''} ; ${v.a} ; ${v.b}`, par: s => { const m = /^area\s*:\s*(.*)$/.exec(s); if (!m) return null; const [e, g, a, b] = m[1].split(';').map(x => x.trim()); return { e, g, a, b }; } },
  { k: 'pt', n: 'จุด', f: [['n', 'ชื่อ', 'txt', 'A'], ['x', 'x', 'num', '1'], ['y', 'y', 'num', '1']], ser: v => `pt: ${v.n}(${v.x},${v.y})`, par: s => { const m = new RegExp(`^pt\\s*:\\s*([^(]*)${rwP}`).exec(s); return m && { n: m[1].trim(), x: m[2], y: m[3] }; } },
  { k: 'seg', n: 'ส่วนของเส้นตรง', f: [['x1', 'x₁', 'num', '0'], ['y1', 'y₁', 'num', '0'], ['x2', 'x₂', 'num', '2'], ['y2', 'y₂', 'num', '2'], ['dash', 'เส้นประ', 'chk']], ser: v => `seg: (${v.x1},${v.y1})-(${v.x2},${v.y2})`, par: s => { const m = new RegExp(`^seg\\s*:\\s*${rwP}\\s*-\\s*${rwP}`).exec(s); return m && { x1: m[1], y1: m[2], x2: m[3], y2: m[4] }; } },
  { k: 'vec', n: 'เวกเตอร์ (ลูกศร)', f: [['x1', 'ต้น x', 'num', '0'], ['y1', 'ต้น y', 'num', '0'], ['x2', 'ปลาย x', 'num', '3'], ['y2', 'ปลาย y', 'num', '2'], ['n', 'ชื่อ', 'txt', 'u']], ser: v => `vec: (${v.x1},${v.y1})->(${v.x2},${v.y2}) ${v.n || ''}`.trim(), par: s => { const m = new RegExp(`^vec\\s*:\\s*${rwP}\\s*->\\s*${rwP}\\s*(.*)$`).exec(s); return m && { x1: m[1], y1: m[2], x2: m[3], y2: m[4], n: m[5].trim() }; } },
  { k: 'circle', n: 'วงกลม', f: [['h', 'จุดศูนย์กลาง x', 'num', '0'], ['kk', 'y', 'num', '0'], ['r', 'รัศมี', 'num', '2'], ['dash', 'เส้นประ', 'chk']], ser: v => `circle: (${v.h},${v.kk}) ${v.r}`, par: s => { const m = new RegExp(`^circle\\s*:\\s*${rwP}\\s*([-\\d.]+)`).exec(s); return m && { h: m[1], kk: m[2], r: m[3] }; } },
  { k: 'ellipse', n: 'วงรี', f: [['h', 'ศูนย์กลาง x', 'num', '0'], ['kk', 'y', 'num', '0'], ['a', 'ครึ่งแกนนอน', 'num', '4'], ['b', 'ครึ่งแกนตั้ง', 'num', '2'], ['dash', 'เส้นประ', 'chk']], ser: v => `ellipse: (${v.h},${v.kk}) ${v.a} ${v.b}`, par: s => { const m = new RegExp(`^ellipse\\s*:\\s*${rwP}\\s*([-\\d.]+)\\s+([-\\d.]+)`).exec(s); return m && { h: m[1], kk: m[2], a: m[3], b: m[4] }; } },
  { k: 'poly', n: 'รูปหลายเหลี่ยม', f: [['pts', 'จุดยอด (x,y) เรียงกัน', 'txt', '(-3,-1),(-1,-1),(-2,1)', 'wide'], ['fill', 'ระบายสี', 'chk'], ['dash', 'เส้นประ', 'chk']], ser: v => `poly: ${v.pts}`, par: s => { const m = /^poly\s*:\s*(.*)$/.exec(s); return m && { pts: m[1].trim() }; } },
  { k: 'text', n: 'ข้อความ', f: [['x', 'x', 'num', '2'], ['y', 'y', 'num', '3'], ['t', 'ข้อความ', 'txt', 'บริเวณ R', 'wide']], ser: v => `text: (${v.x},${v.y}) ${v.t}`, par: s => { const m = new RegExp(`^text\\s*:\\s*${rwP}\\s*(.*)$`).exec(s); return m && { x: m[1], y: m[2], t: m[3] }; } },
  { k: 'vline', n: 'เส้นประแนวตั้ง x = c', f: [['x', 'x =', 'num', '1']], ser: v => `vline: ${v.x}`, par: s => { const m = /^vline\s*:\s*([-\d.]+)/.exec(s); return m && { x: m[1] }; } },
  { k: 'hline', n: 'เส้นประแนวนอน y = c', f: [['y', 'y =', 'num', '1']], ser: v => `hline: ${v.y}`, par: s => { const m = /^hline\s*:\s*([-\d.]+)/.exec(s); return m && { y: m[1] }; } },
];
/* ---------- จำนวนเชิงซ้อน ---------- */
const cz = v => { v = num(v); return !v || v === '0' ? '' : /^[\d.]+i?$/.test(v) ? ` - ${v}` : /^[-+]/.test(v) && !/[+-]/.test(v.slice(1)) ? (v[0] === '-' ? ` + ${v.slice(1)}` : ` - ${v.slice(1)}`) : ` - (${v})`; };
const czBack = (sg, v) => { if (!sg) return '0'; v = (v || '').trim(); if (sg === '-') return v; return /^[\d.]*i?$/.test(v) ? '-' + v : '-(' + v + ')'; };
const ABS = '\\|\\s*z\\s*(?:([+-])\\s*\\(?([^|]*?)\\)?)?\\s*\\|', ARG = 'arg\\s*\\(?\\s*z\\s*(?:([+-])\\s*\\(?([^)]*?)\\)?)?\\s*\\)?';
const CPLOT_T = [
  { k: 'circ', n: 'วงกลม / ในวง / นอกวง  |z − a| ? r', f: [['a', 'จุดศูนย์กลาง a', 'cz', '1+i'], ['op', 'เงื่อนไข', 'sel', '=', RW_OP], ['r', 'รัศมี r', 'num', '2']], ser: v => `|z${cz(v.a)}| ${v.op} ${v.r}`, par: s => { const m = new RegExp(`^${ABS}\\s*(<=|>=|<|>|=)\\s*([\\d.]+)$`).exec(s); return m && { a: czBack(m[1], m[2]), op: m[3], r: m[4] }; } },
  { k: 'ann', n: 'วงแหวน  r₁ ? |z − a| ? r₂', f: [['r1', 'r₁', 'num', '1'], ['o1', '', 'sel', '<=', RW_OP2], ['a', 'จุดศูนย์กลาง a', 'cz', '0'], ['o2', '', 'sel', '<=', RW_OP2], ['r2', 'r₂', 'num', '2']], ser: v => `${v.r1} ${v.o1} |z${cz(v.a)}| ${v.o2} ${v.r2}`, par: s => { const m = new RegExp(`^([\\d.]+)\\s*(<=|<)\\s*${ABS}\\s*(<=|<)\\s*([\\d.]+)$`).exec(s); return m && { r1: m[1], o1: m[2], a: czBack(m[3], m[4]), o2: m[5], r2: m[6] }; } },
  { k: 'bis', n: 'เส้นแบ่งครึ่งตั้งฉาก  |z − a| ? |z − b|', f: [['a', 'a', 'cz', '0'], ['op', '', 'sel', '=', RW_OP], ['b', 'b', 'cz', '4']], ser: v => `|z${cz(v.a)}| ${v.op} |z${cz(v.b)}|`, par: s => { const m = new RegExp(`^${ABS}\\s*(<=|>=|<|>|=)\\s*${ABS}$`).exec(s); return m && { a: czBack(m[1], m[2]), op: m[3], b: czBack(m[4], m[5]) }; } },
  { k: 'ray', n: 'รังสี / ครึ่งระนาบมุม  arg(z − a) ? θ', f: [['a', 'จุดเริ่ม a', 'cz', '0'], ['op', '', 'sel', '=', RW_OP], ['t', 'มุม θ (เช่น π/4, 60°)', 'ang', 'π/4']], ser: v => `arg(z${cz(v.a)}) ${v.op} ${v.t}`, par: s => { const m = new RegExp(`^${ARG}\\s*(<=|>=|<|>|=)\\s*(.+)$`).exec(s); return m && { a: czBack(m[1], m[2]), op: m[3], t: m[4].trim() }; } },
  { k: 'sec', n: 'เซกเตอร์  θ₁ ? arg(z − a) ? θ₂', f: [['t1', 'θ₁', 'ang', '0'], ['o1', '', 'sel', '<=', RW_OP2], ['a', 'จุดยอด a', 'cz', '0'], ['o2', '', 'sel', '<=', RW_OP2], ['t2', 'θ₂', 'ang', 'π/2']], ser: v => `${v.t1} ${v.o1} arg(z${cz(v.a)}) ${v.o2} ${v.t2}`, par: s => { const m = new RegExp(`^(.+?)\\s*(<=|<)\\s*${ARG}\\s*(<=|<)\\s*(.+)$`).exec(s); return m && { t1: m[1].trim(), o1: m[2], a: czBack(m[3], m[4]), o2: m[5], t2: m[6].trim() }; } },
  { k: 're', n: 'Re(z) หรือ Im(z) เทียบค่าคงที่', f: [['w', '', 'sel', 'Re', ['Re', 'Im']], ['op', '', 'sel', '>=', RW_OP], ['c', 'ค่า', 'num', '0']], ser: v => `${v.w}(z) ${v.op} ${v.c}`, par: s => { const m = /^(Re|Im)\s*\(?\s*z\s*\)?\s*(<=|>=|<|>|=)\s*([-\d.]+)$/.exec(s); return m && { w: m[1], op: m[2], c: m[3] }; } },
  { k: 'strip', n: 'แถบ  a ? Re(z) ? b', f: [['a', 'a', 'num', '-1'], ['o1', '', 'sel', '<=', RW_OP2], ['w', '', 'sel', 'Re', ['Re', 'Im']], ['o2', '', 'sel', '<=', RW_OP2], ['b', 'b', 'num', '2']], ser: v => `${v.a} ${v.o1} ${v.w}(z) ${v.o2} ${v.b}`, par: s => { const m = /^([-\d.]+)\s*(<=|<)\s*(Re|Im)\s*\(?\s*z\s*\)?\s*(<=|<)\s*([-\d.]+)$/.exec(s); return m && { a: m[1], o1: m[2], w: m[3], o2: m[4], b: m[5] }; } },
  { k: 'roots', n: 'รากที่ n  zⁿ = w', f: [['n', 'n', 'num', '6'], ['w', 'w', 'cz', '1']], ser: v => `z^${v.n} = ${v.w}`, par: s => { const m = /^z\s*\^\s*(\d+)\s*=\s*(.+)$/.exec(s); return m && { n: m[1], w: m[2].trim() }; } },
  { k: 'pt', n: 'จุด  z = a + bi', f: [['n', 'ชื่อ', 'txt', 'z₁'], ['z', 'ค่า', 'cz', '3+2i']], ser: v => `${v.n ? v.n + ' = ' : ''}${v.z}`, par: s => { if (/[|<>]|arg|Re|Im|\^/.test(s)) return null; const m = /^(?:([^=]+)=)?\s*([-+\d.\si]+)$/.exec(s); return m && /\d|i/.test(m[2]) && { n: (m[1] || '').trim(), z: m[2].trim() }; } },
  { k: 'free', n: 'พิมพ์เงื่อนไขเอง', f: [['t', 'เงื่อนไข', 'cond', '|z| <= 1', 'wide']], ser: v => v.t, par: s => ({ t: s }) },
];
/* ---------- ฉากกำหนดเอง ---------- */
const SN = (k, w, n, nums, flags = [], o = {}) => ({ k, n, w, nums, flags, lb: o.lb !== false, tail: o.tail });
const SCENE_T = [
  SN('building', 'ตึก', 'ตึก/อาคาร', [['x', 'ตำแหน่ง x', '30'], ['h', 'สูง', '40'], ['w', 'กว้าง (ว่างได้)', '']], [['ซ้าย', 'หันไปทางซ้าย']]),
  SN('tree', 'ต้นไม้', 'ต้นไม้', [['x', 'x', '10'], ['h', 'สูง', '8']]), SN('pole', 'เสาธง', 'เสาธง', [['x', 'x', '10'], ['h', 'สูง', '12']]),
  SN('light', 'ประภาคาร', 'ประภาคาร', [['x', 'x', '0'], ['h', 'สูง', '30']]), SN('tower', 'หอคอย', 'หอคอย/เสาส่งสัญญาณ', [['x', 'x', '0'], ['h', 'สูง', '40']]),
  SN('cliff', 'หน้าผา', 'หน้าผา', [['x', 'ขอบผา x', '0'], ['h', 'สูง', '50']], [['ขวา', 'ผาอยู่ทางขวา']]), SN('mountain', 'ภูเขา', 'ภูเขา', [['x', 'ยอด x', '0'], ['h', 'สูง', '300'], ['w', 'ฐานกว้าง (ว่างได้)', '']]),
  SN('wall', 'กำแพง', 'กำแพง', [['x', 'x', '5'], ['h', 'สูง', '4']]),
  SN('man', 'ชาย', 'ผู้ชาย', [['x', 'x', '0'], ['b', 'ยืนบนความสูง (ว่างได้)', '']]), SN('woman', 'หญิง', 'ผู้หญิง', [['x', 'x', '4'], ['b', 'ยืนบนความสูง (ว่างได้)', '']]),
  SN('boat', 'เรือ', 'เรือ', [['x', 'x', '40']]), SN('car', 'รถ', 'รถ', [['x', 'x', '20']]),
  SN('balloon', 'บอลลูน', 'บอลลูน', [['x', 'x', '20'], ['y', 'สูง', '50']]), SN('plane', 'เครื่องบิน', 'เครื่องบิน', [['x', 'x', '20'], ['y', 'สูง', '60']]), SN('bird', 'นก', 'นก', [['x', 'x', '15'], ['y', 'สูง', '25']]),
  SN('kite', 'ว่าว', 'ว่าว', [['x', 'x', '30'], ['y', 'สูง', '25'], ['fx', 'มือ x', '0'], ['fy', 'มือ y', '1.2']]),
  SN('sun', 'ดวงอาทิตย์', 'ดวงอาทิตย์ (มุมแสงกับพื้น)', [['a', 'มุม (องศา)', '45']], [['ขวา', 'อยู่ทางขวา'], ['เงา', 'วาดเงา']], { lb: true }),
  SN('river', 'แม่น้ำ', 'แม่น้ำ', [['x', 'จาก x', '5'], ['x2', 'ถึง x', '25']], [], { lb: false, tail: 'ชื่อ' }), SN('road', 'ถนน', 'ถนน', [['x', 'จาก x', '5'], ['x2', 'ถึง x', '25']], [], { lb: false }),
  SN('ladder', 'บันได', 'บันได', [['x', 'โคน x', '0'], ['x2', 'กำแพง x', '3'], ['h', 'ปลายสูง', '4']], [], { lb: false }),
  SN('sight', 'มอง', 'แนวสายตา + มุม', [['x', 'จาก x', '0'], ['y', 'จาก y', '1.5'], ['x2', 'ถึง x', '30'], ['y2', 'ถึง y', '40']], [['เต็ม', 'เส้นระดับยาวเต็ม'], ['ฉาก', 'มุมฉาก'], ['ไม่มีระดับ', 'ไม่มีเส้นระดับ']], { tail: 'ป้ายมุม', lb: true }),
  SN('dim', 'วัด', 'เส้นบอกระยะ', [['x', 'จาก x', '0'], ['y', 'จาก y', '0'], ['x2', 'ถึง x', '30'], ['y2', 'ถึง y', '0']], [['ซ้าย', 'ไว้ด้านซ้าย'], ['บน', 'ไว้ด้านบน']], { tail: 'ป้าย', lb: false }),
  SN('line', 'เส้น', 'เส้นตรง', [['x', 'จาก x', '0'], ['y', 'จาก y', '0'], ['x2', 'ถึง x', '10'], ['y2', 'ถึง y', '10']], [['ประ', 'เส้นประ']], { lb: false }),
  SN('point', 'จุด', 'จุด + ชื่อ', [['x', 'x', '0'], ['y', 'y', '0']], [], { tail: 'ชื่อ', lb: false }), SN('text', 'ข้อความ', 'ข้อความ', [['x', 'x', '0'], ['y', 'y', '10']], [], { tail: 'ข้อความ', lb: false }),
].map(t => Object.assign(t, {
  f: [...t.nums.map(([id, l, d]) => [id, l, 'num', d]), ...t.flags.map(([w, l]) => ['F_' + w, l, 'chk']), ...(t.tail ? [['tail', t.tail, 'txt', '']] : []), ...(t.lb ? [['lb', t.k === 'sight' ? 'ป้ายมุมแย้ง (ว่างได้)' : t.k === 'sun' ? 'ป้ายมุม' : 'ชื่อบนยอด', 'txt', '']] : [])],
  ser: v => [t.w, ...t.nums.map(([id]) => num(v[id])).filter((x, i, a) => x !== '' || a.slice(i + 1).some(y => y !== '')).map(x => x === '' ? '0' : x), ...t.flags.filter(([w]) => v['F_' + w]).map(([w]) => w), v.tail || ''].filter(x => x !== '').join(' '),
  par: s => { const tk = s.trim().split(/\s+/); if (scType(tk[0]) !== t.k && !(t.k === 'man' && scType(tk[0]) === 'person' && !tk.includes('หญิง')) && !(t.k === 'woman' && scType(tk[0]) === 'person' && tk.includes('หญิง'))) return null;
    const v = {}; let i = 1; t.nums.forEach(([id]) => { if (i < tk.length && isFinite(Number(tk[i]))) v[id] = tk[i++]; else v[id] = ''; }); const rest = [];
    tk.slice(i).forEach(w => { const fl = t.flags.find(([x]) => x === w); if (fl) v['F_' + w] = true; else if (w !== 'หญิง' && w !== 'ชาย') rest.push(w); }); v.tail = rest.join(' '); return v; },
}));
/* ---------- รายการคั่นด้วย ; ---------- */
const PAIR_T = { k: 'g', n: 'กราฟ', f: [['e', 'y =', 'fn', ''], ['lb', 'ชื่อกราฟที่แสดงบนรูป (ว่าง = ไม่แสดง)', 'txt', '']] };
const PIECE_T = { k: 'p', n: 'ช่วง', f: [['e', 'y =', 'fn', 'x^2'], ['a', 'ถ้า', 'num', '0'], ['o1', '', 'sel', '<', RW_OP2], ['xx', '', 'lab', 'x'], ['o2', '', 'sel', '<=', RW_OP2], ['b', '', 'num', '2']],
  ser: v => `${v.e} ถ้า ${v.a}${v.o1}x${v.o2}${v.b}`, par: s => { const m = /^(.*?)\s*(?:ถ้า|if|เมื่อ|,)\s*([-\d.]+)\s*(<=|<|≤)\s*x\s*(<=|<|≤)\s*([-\d.]+)\s*$/.exec(s); return m ? { e: m[1].trim(), a: m[2], o1: m[3].replace('≤', '<='), o2: m[4].replace('≤', '<='), b: m[5] } : { e: s, a: '0', o1: '<', o2: '<=', b: '1' }; } };
const VEC_T = { k: 'v', n: 'เวกเตอร์', f: [['n', 'ชื่อ', 'txt', 'w'], ['x', 'x', 'num', '1'], ['y', 'y', 'num', '1']], ser: v => `${v.n}=${v.x},${v.y}`, par: s => { const m = /^([^=]*)=\s*([-\d.]+)\s*,\s*([-\d.]+)/.exec(s); return m ? { n: m[1].trim(), x: m[2], y: m[3] } : null; } };
const ARG_T = { k: 'z', n: 'จำนวนเชิงซ้อน', f: [['n', 'ชื่อ', 'txt', 'w'], ['z', 'ค่า a+bi', 'cz', '1+i']], ser: v => `${v.n ? v.n + '=' : ''}${v.z}`, par: s => { const m = /^(?:([^=]+)=)?\s*(.+)$/.exec(s); return m && { n: (m[1] || '').trim(), z: m[2].trim() }; } };

const ROWED = {
  combo: { mode: 'lines', key: 'src', types: COMBO_T, col: true, add: 'เพิ่ม', optStyle: 'pipe' },
  cplot: { mode: 'lines', key: 'src', types: CPLOT_T, col: true, add: 'เพิ่มเงื่อนไข', optStyle: 'tail', and: true },
  scene: { mode: 'lines', key: 'src', types: SCENE_T, col: true, add: 'เพิ่มสิ่งของ', optStyle: 'scene' },
  fgraph: { mode: 'pair', keys: ['f', 'lb'], type: PAIR_T, add: 'เพิ่มกราฟ' },
  trigg: { mode: 'pair', keys: ['f', 'lb'], type: PAIR_T, add: 'เพิ่มกราฟ' },
  piece: { mode: 'semi', key: 'f', type: PIECE_T, add: 'เพิ่มช่วง' },
  vec2: { mode: 'semi', key: 'v', type: VEC_T, add: 'เพิ่มเวกเตอร์' },
  argand: { mode: 'semi', key: 'z', type: ARG_T, add: 'เพิ่มจุด' },
};
['fgraph', 'trigg', 'piece', 'combo'].forEach(k => delete FN_FIELDS[k]);

/* ---------- แปลงข้อความ ⇄ รายการ ---------- */
function rwParseLine(E, line) {
  let core = line.trim(), c = '', extra = {};
  if (E.optStyle === 'pipe') { const i = core.indexOf('|'); if (i >= 0) { const opt = core.slice(i + 1); core = core.slice(0, i).trim(); c = colKey((/#[0-9a-fA-F]{6}|\b(?:red|blue|green|orange|purple|teal|gray|brown|black)\b/.exec(opt) || [])[0]); extra.dash = /dash/.test(opt); extra.fill = /fill/.test(opt); } }
  else if (E.optStyle === 'scene') { const i = core.indexOf('|'); if (i >= 0) { extra.lb = core.slice(i + 1).trim(); core = core.slice(0, i).trim(); } const m = /\s+(\S+)$/.exec(core); if (m && colOfWord(m[1]) && !isFinite(Number(m[1]))) { c = colKey(m[1]); core = core.slice(0, m.index); } }
  else { const m = /\s+(\S+)$/.exec(core); if (m && colOfWord(m[1])) { c = colKey(m[1]); core = core.slice(0, m.index); } }
  if (E.and) { const parts = core.split(/\s*(?:และ|&&|&|\band\b|,)\s*/).filter(Boolean); return parts.map((p, i) => Object.assign(rwParse1(E.types, p), i ? { _and: true } : { _c: c })); }
  const r = rwParse1(E.types, core); return [Object.assign(r, extra, { _c: c })];
}
function rwParse1(types, s) { for (const t of types) { const v = t.par(s); if (v) return Object.assign({ _t: t.k }, v); } const fr = types.find(t => t.k === 'free'); return fr ? { _t: 'free', t: s } : { _t: '_raw', raw: s }; }
function rwSerRows(E, rows) {
  const lines = [];
  rows.forEach(v => {
    const t = E.types.find(x => x.k === v._t); if (t && t.f.some(([id, , k]) => (k === 'fn' || k === 'cond') && id !== 'g' && !String(v[id] ?? '').trim())) return; let core = t ? t.ser(v) : (v.raw || ''); if (!core) return;
    if (E.and && v._and && lines.length) { lines[lines.length - 1].core += ' และ ' + core; return; }
    lines.push({ core, v });
  });
  return lines.map(({ core, v }) => {
    if (E.optStyle === 'pipe') { const o = [v._c, v.dash ? 'dash' : '', v.fill ? 'fill' : ''].filter(Boolean).join(' '); return core + (o ? ' | ' + o : ''); }
    if (E.optStyle === 'scene') return core + (v._c ? ' ' + v._c : '') + (v.lb ? ' | ' + v.lb : '');
    return core + (v._c ? ' ' + v._c : '');
  }).join('\n');
}
function rwRead(E) {
  if (E.mode === 'lines') return String($(`#lbForm [data-k="${E.key}"]`).value).split('\n').filter(l => l.trim()).flatMap(l => rwParseLine(E, l));
  const sp = k => String($(`#lbForm [data-k="${k}"]`).value).split(';').map(x => x.trim());
  if (E.mode === 'pair') { const a = sp(E.keys[0]), b = sp(E.keys[1]); return a.map((e, i) => ({ _t: 'g', e, lb: b[i] || '' })).filter(v => v.e); }
  return sp(E.key).filter(Boolean).map(s => Object.assign({ _t: E.type.k }, E.type.par(s) || {}));
}
function rwWrite(E, rows) {
  const set = (k, v) => { const el = $(`#lbForm [data-k="${k}"]`); el.value = v; el.dispatchEvent(new Event('input', { bubbles: true })); };
  if (E.mode === 'lines') set(E.key, rwSerRows(E, rows));
  else if (E.mode === 'pair') { const R = rows.filter(v => String(v.e ?? '').trim()); set(E.keys[1], R.map(v => v.lb || '').join('; ')); set(E.keys[0], R.map(v => v.e).join('; ')); }
  else set(E.key, rows.filter(v => !E.type.f.some(([id, , k]) => k === 'fn' && !String(v[id] ?? '').trim())).map(v => E.type.ser(v)).join('; '));
}

/* ---------- หน้าตา ---------- */
let rwLastFn = null;
function rwFieldHTML(f, v, i) {
  const [id, label, kind, def, opts] = f; const blank = kind === 'fn' || kind === 'cond'; const val = v[id] !== undefined ? v[id] : blank ? '' : (def ?? ''); const ph = blank && def ? `เช่น ${def}` : '';
  if (kind === 'lab') return `<span class="rwx">${label || 'x'}</span>`;
  if (kind === 'chk') return `<label class="rwc"><input type="checkbox" data-f="${id}"${v[id] ? ' checked' : ''}> ${esc(label)}</label>`;
  if (kind === 'sel') return `<label class="rwf"><small>${esc(label)}</small><select data-f="${id}">${opts.map(o => `<option value="${esc(o)}"${o === val ? ' selected' : ''}>${esc(RW_OPL[o] || o)}</option>`).join('')}</select></label>`;
  if (kind === 'cond') return `<div class="rwfn"><small>${esc(label)}</small><div class="rwfnr"><input type="text" data-f="${id}" data-cond="1" value="${esc(val)}" placeholder="${esc(ph || 'เช่น |z - (1+i)| <= 2')}"><button type="button" class="tb rwmx" data-ce="${id}" title="พิมพ์ด้วยตัวแก้สมการ">∑</button></div><div class="fnchips cchips">${COND_CHIPS.map(([n, sn]) => `<button type="button" class="tb" data-cs="${esc(sn)}">${n}</button>`).join('')}</div><div class="rwpv" data-pv="${id}"></div></div>`;
  if (kind === 'cz' || kind === 'ang') return `<label class="rwf"><small>${esc(label)}</small><input type="text" data-f="${id}" data-${kind}="1" value="${esc(val)}"><span class="rwpv mini"></span><span class="fnchips mchips">${(kind === 'cz' ? [['i', 'i'], ['√', '√'], ['−', '-']] : [['π', 'π'], ['/', '/'], ['°', '°'], ['−', '-']]).map(([n, sn]) => `<button type="button" class="tb" data-cs="${esc(sn)}">${n}</button>`).join('')}</span></label>`;
  if (kind === 'fn') return `<div class="rwfn"><small>${esc(label)}</small><div class="rwfnr"><input type="text" data-f="${id}" data-fn="1" value="${esc(val)}" placeholder="${esc(ph || 'เช่น x^2 - 2x + 1')}"><button type="button" class="tb rwmx" data-fe="${id}" title="พิมพ์ด้วยตัวแก้สมการ">∑</button></div><div class="rwpv" data-pv="${id}"></div></div>`;
  return `<label class="rwf${f[4] === 'wide' ? ' wide' : ''}${kind === 'num' ? ' n' : ''}"><small>${esc(label)}</small><input type="text" data-f="${id}" value="${esc(val)}"></label>`;
}
function rwRowHTML(E, v, i, n) {
  const types = E.types || [E.type]; const t = types.find(x => x.k === v._t);
  const head = `<div class="rwh"><b class="rwn">${i + 1}</b>${E.types ? `<select class="rwt">${types.map(x => `<option value="${x.k}"${x.k === v._t ? ' selected' : ''}>${esc(x.n)}</option>`).join('')}${t ? '' : '<option value="_raw" selected>(อ่านไม่ออก — แก้เป็นข้อความ)</option>'}</select>` : `<span class="rwtn">${esc(E.type.n)} ${i + 1}</span>`}
    ${E.col && !v._and ? `<select class="rwcol">${RW_COL.map(([k, l]) => `<option value="${k}"${k === (v._c || '') ? ' selected' : ''}>${l}</option>`).join('')}${/^#/.test(v._c || '') ? `<option value="${v._c}" selected>สีที่เลือกเอง</option>` : ''}</select><input type="color" class="rwcolp" title="เลือกสีเอง" value="${/^#/.test(v._c || '') ? v._c : colOfWord(v._c) || '#2c4a7a'}">` : ''}
    ${E.and && i > 0 ? `<label class="rwc rwand" title="ใช้ร่วมกับเงื่อนไขข้างบน (ระบายเฉพาะบริเวณที่ซ้อนกัน)"><input type="checkbox" class="rwandc"${v._and ? ' checked' : ''}> และ (ร่วมกับข้อบน)</label>` : ''}
    <span class="sp"></span><button type="button" class="tb rwb" data-a="up" title="เลื่อนขึ้น"${i ? '' : ' disabled'}>▲</button><button type="button" class="tb rwb" data-a="dn" title="เลื่อนลง"${i < n - 1 ? '' : ' disabled'}>▼</button><button type="button" class="tb rwb" data-a="dup" title="ทำซ้ำ">⧉</button><button type="button" class="tb rwb rwdel" data-a="del" title="ลบ">✕</button></div>`;
  const body = t ? t.f.map(f => rwFieldHTML(f, v, i)).join('') : `<label class="rwf wide"><small>ข้อความเดิม</small><input type="text" data-f="raw" value="${esc(v.raw || '')}"></label>`;
  return `<div class="rw${v._and ? ' and' : ''}" data-i="${i}">${head}<div class="rwbd">${body}</div></div>`;
}
function rwInit() {
  const E = ROWED[libKind]; if (!E) return; const keys = E.mode === 'pair' ? E.keys : [E.key];
  const rows0 = $(`#lbForm [data-k="${keys[0]}"]`).closest('.row'); keys.forEach(k => $(`#lbForm [data-k="${k}"]`).closest('.row').classList.add('rwhide'));
  const box = document.createElement('div'); box.className = 'rwed'; rows0.before(box);
  let rows = rwRead(E); const types = E.types || [E.type]; if (!rows.length && !libFormVals) { const t = E.types ? (E.types.find(x => x.k === 'free') || E.types[0]) : E.type; const nv = { _t: t.k }; t.f.forEach(([id, , k, d]) => { if (d !== undefined && k !== 'fn' && k !== 'cond') nv[id] = d; }); rows.push(nv); } const hasFn = types.some(t => t.f.some(f => f[2] === 'fn'));
  const commit = () => rwWrite(E, rows);
  const pv = el => { const d = el.closest('.rwfn').querySelector('.rwpv'); const s = el.value.trim(); if (!s) { d.innerHTML = '<span class="hint">ว่าง</span>'; return; } const r = mpCheck(s, { implicit: IMPL_OK.includes(libKind) }); d.innerHTML = r.ok ? `<span class="fok">✓ ${kx((r.implicit ? '' : 'y = ') + r.tex)}</span>` : `<span class="fbad">✗ ${esc(r.err)}</span>`; };
  const draw = () => {
    box.innerHTML = (hasFn ? `<div class="fnchips rwchips"><span class="hint">ปุ่มลัด (ใส่ในช่องสมการที่คลิกล่าสุด):</span>${FN_CHIPS.concat(IMPL_OK.includes(libKind) ? [['y', 'y'], ['=', ' = ']] : []).map(([n, sn]) => `<button type="button" class="tb" data-sn="${esc(sn)}">${n}</button>`).join('')}</div>` : '')
      + `<div class="rwlist">${rows.map((v, i) => rwRowHTML(E, v, i, rows.length)).join('') || '<div class="hint" style="padding:8px">ยังไม่มีรายการ กดปุ่มเพิ่มด้านล่าง</div>'}</div>`
      + `<div class="rwadd">${E.types ? `<select class="rwaddt">${E.types.map(t => `<option value="${t.k}">${esc(t.n)}</option>`).join('')}</select>` : ''}<button type="button" class="tb primary rwaddb">＋ ${E.add}</button><button type="button" class="tb rwraw">แก้แบบข้อความ</button></div>`;
    $$('[data-fn]', box).forEach(pv); $$('[data-cond],[data-cz],[data-ang]', box).forEach(pv2);
  };
  const pv2 = el => { const d = el.dataset.cond ? el.closest('.rwfn').querySelector('.rwpv') : el.parentElement.querySelector('.rwpv'); const r = el.dataset.cond ? condCheck(el.value) : el.dataset.cz ? czCheck(el.value) : angCheck(el.value); d.innerHTML = r.ok ? `<span class="fok">✓ ${r.html}</span>` : `<span class="fbad">✗ ${esc(r.err)}</span>`; };
  const rowOf = el => +el.closest('.rw').dataset.i;
  box.addEventListener('focusin', e => { if (e.target.dataset && e.target.dataset.fn) rwLastFn = e.target; });
  box.addEventListener('input', e => {
    const el = e.target; if (!el.closest('.rw')) return; e.stopPropagation(); const i = rowOf(el), v = rows[i];
    if (el.classList.contains('rwcolp')) { v._c = el.value.toLowerCase(); commit(); return; }
    if (el.dataset.f) { v[el.dataset.f] = el.type === 'checkbox' ? el.checked : el.value; if (el.dataset.fn) pv(el); if (el.dataset.cond || el.dataset.cz || el.dataset.ang) pv2(el); }
    commit();
  });
  box.addEventListener('change', e => {
    const el = e.target; if (!el.closest('.rw')) { return; } e.stopPropagation(); const i = rowOf(el), v = rows[i];
    if (el.classList.contains('rwt')) { const t = types.find(x => x.k === el.value); const nv = { _t: t.k, _c: v._c, _and: v._and }; t.f.forEach(([id, , k, d]) => { if (d !== undefined && k !== 'fn' && k !== 'cond') nv[id] = d; }); rows[i] = nv; commit(); draw(); return; }
    if (el.classList.contains('rwcol')) { v._c = el.value; commit(); draw(); return; }
    if (el.classList.contains('rwcolp')) { v._c = el.value.toLowerCase(); commit(); draw(); return; }
    else if (el.classList.contains('rwandc')) { v._and = el.checked; commit(); draw(); return; }
    else if (el.dataset.f) v[el.dataset.f] = el.type === 'checkbox' ? el.checked : el.value;
    commit();
  });
  box.addEventListener('mousedown', e => { const c = e.target.closest('[data-cs]'); if (c) { e.preventDefault(); const inp = c.closest('.rwfn, .rwf').querySelector('input[type=text]'); condInsert(inp, c.dataset.cs); } });
  box.addEventListener('mousedown', e => { const b = e.target.closest('[data-sn]'); if (b && rwLastFn && box.contains(rwLastFn)) { e.preventDefault(); fnInsert(rwLastFn, b.dataset.sn); } });
  box.addEventListener('click', e => {
    const b = e.target.closest('button'); if (!b) return;
    if (b.dataset.cs) return;
    if (b.dataset.ce) { const inp = b.closest('.rwfn').querySelector('input'); const ri = rowOf(b), fid = b.dataset.ce; openMathCb(condTex(inp.value), tex => { if (rows[ri]) { rows[ri][fid] = cnorm(tex); commit(); draw(); } }); return; }
    if (b.dataset.sn) { if (!rwLastFn || !box.contains(rwLastFn)) toast('คลิกช่องสมการที่ต้องการก่อน'); return; }
    if (b.classList.contains('rwaddb')) { const t = E.types ? types.find(x => x.k === $('.rwaddt', box).value) : E.type; const nv = { _t: t.k }; t.f.forEach(([id, , k, d]) => { if (d !== undefined && k !== 'fn' && k !== 'cond') nv[id] = d; }); rows.push(nv); commit(); draw(); const l = $$('.rw', box).pop(); if (l) { l.scrollIntoView({ block: 'nearest' }); const inp = l.querySelector('input[type=text]'); if (inp) inp.focus(); } return; }
    if (b.classList.contains('rwraw')) { keys.forEach(k => $(`#lbForm [data-k="${k}"]`).closest('.row').classList.toggle('rwhide')); b.classList.toggle('on'); if (!b.classList.contains('on')) { rows = rwRead(E); draw(); } return; }
    if (b.dataset.fe) { const inp = b.closest('.rwfn').querySelector('input'); const ri = rowOf(b), fid = b.dataset.fe; const r = inp.value.trim() ? mpCheck(inp.value, { implicit: IMPL_OK.includes(libKind) }) : null; openMathCb(r && r.ok ? r.tex : inp.value, tex => { const q = mpCheck(tex, { implicit: IMPL_OK.includes(libKind) }); if (rows[ri]) { rows[ri][fid] = q.ok ? q.plain : tex; commit(); draw(); } }); return; }
    const a = b.dataset.a; if (!a) return; const i = rowOf(b);
    if (a === 'del') rows.splice(i, 1); else if (a === 'dup') rows.splice(i + 1, 0, JSON.parse(JSON.stringify(rows[i]))); else if (a === 'up' && i > 0) [rows[i - 1], rows[i]] = [rows[i], rows[i - 1]]; else if (a === 'dn' && i < rows.length - 1) [rows[i + 1], rows[i]] = [rows[i], rows[i + 1]];
    if (E.and && rows[0]) delete rows[0]._and;
    commit(); draw();
  });
  // ถ้าแก้ในกล่องข้อความเอง → อ่านกลับเมื่อเลิกแก้
  keys.forEach(k => $(`#lbForm [data-k="${k}"]`).addEventListener('change', () => { rows = rwRead(E); draw(); }));
  draw();
}
const _libEnhance1 = libEnhance;
libEnhance = function () { _libEnhance1(); rwInit(); };


/* ---------- เงื่อนไขจำนวนเชิงซ้อน: แทรก ตรวจ แสดงผล ---------- */
const COND_CHIPS = [['|z|', '|z|'], ['|z − a|', '|z - (‸)|'], ['arg', 'arg(z‸)'], ['Re', 'Re(z)'], ['Im', 'Im(z)'], ['≤', ' <= '], ['≥', ' >= '], ['<', ' < '], ['>', ' > '], ['=', ' = '], ['i', 'i'], ['π', 'π'], ['°', '°'], ['zⁿ', 'z^‸'], ['และ', ' และ ']];
function condInsert(el, snip) { const a = el.selectionStart ?? el.value.length, b = el.selectionEnd ?? a; const k = snip.indexOf('‸'); const t = snip.replace('‸', ''); el.value = el.value.slice(0, a) + t + el.value.slice(b); el.focus(); el.selectionStart = el.selectionEnd = a + (k >= 0 ? k : t.length); el.dispatchEvent(new Event('input', { bubbles: true })); }
function cnorm(s) {
  return String(s ?? '').replace(/\\(?:left|right)(?![a-zA-Z])/g, '').replace(/\\(?:lvert|rvert|vert|mid)(?![a-zA-Z])/g, '|').replace(/\\\|/g, '|')
    .replace(/\\(?:leq?|leqslant)(?![a-zA-Z])/g, '<=').replace(/\\(?:geq?|geqslant)(?![a-zA-Z])/g, '>=').replace(/≤|⩽/g, '<=').replace(/≥|⩾/g, '>=').replace(/\\lt(?![a-zA-Z])/g, '<').replace(/\\gt(?![a-zA-Z])/g, '>')
    .replace(/\\arg(?![a-zA-Z])/g, 'arg').replace(/\\(?:operatorname|mathrm|text)\{(Re|Im|arg)\}/g, '$1').replace(/\\Re(?![a-zA-Z])/g, 'Re').replace(/\\Im(?![a-zA-Z])/g, 'Im')
    .replace(/\^\s*\{\s*\\circ\s*\}|\^\\circ|\\circ|\\degree/g, '°').replace(/\\pi(?![a-zA-Z])/g, 'π').replace(/\\text\{\s*และ\s*\}/g, ' และ ').replace(/\\(?:quad|qquad|,|;|:|!)\s*/g, ' ')
    .replace(/z\s*\^\s*\{\s*(\d+)\s*\}/g, 'z^$1').replace(/\\cdot/g, '*').replace(/[−–]/g, '-').replace(/\s*\\land\s*|\s*\\wedge\s*|\s*\\cap\s*/g, ' และ ').replace(/[ \t]+/g, ' ').trim();
}
function condTex(s) {
  let k = 0; return cnorm(s).replace(/\|/g, () => (k++ % 2 ? '\\right|' : '\\left|')).replace(/<=/g, '\\le ').replace(/>=/g, '\\ge ').replace(/\barg\b/g, '\\arg').replace(/\b(Re|Im)\b/g, '\\operatorname{$1}').replace(/π/g, '\\pi ').replace(/°/g, '^\\circ').replace(/\s*และ\s*/g, ',\\ ').replace(/z\^(\d+)/g, 'z^{$1}');
}
function condKinds(c) { const out = []; const parts = cnorm(c).split(/\s*(?:และ|&&|&|\band\b|,)\s*/).filter(Boolean); parts.forEach(p => { const t = CPLOT_T.find(t => t.k !== 'free' && t.par(p)); out.push(t ? t.n.split('  ')[0] : null); }); return { parts, kinds: out }; }
function condCheck(s) {
  if (!String(s).trim()) return { ok: false, err: 'ยังไม่ได้พิมพ์เงื่อนไข' };
  const { parts, kinds } = condKinds(s); const bad = parts.filter((p, i) => !kinds[i]);
  let tex = condTex(s);
  if (bad.length) return { ok: false, err: `ยังอ่านไม่ได้: “${bad.join(' , ')}” — ใช้รูป |z − a| ≤ r, |z − a| = |z − b|, arg(z − a) = θ, Re(z) ≥ c, a ≤ |z| ≤ b, zⁿ = w (กดปุ่มแทรกด้านบนได้)` };
  return { ok: true, html: kx(tex) + ` <small style="color:#6b7280">(${kinds.join(' และ ')})</small>` };
}
function czCheck(s) { try { const z = cplx(String(s).replace(/√(\d+(?:\.\d+)?)/g, 'sqrt($1)')); const re = fmt(z[0]).replace('−', '-'), im = Math.abs(z[1]) === 1 ? '' : fmt(Math.abs(z[1])); return { ok: true, html: kx(z[1] === 0 ? re : z[0] === 0 ? (z[1] < 0 ? '-' : '') + im + 'i' : `${re}${z[1] > 0 ? '+' : '-'}${im}i`) }; } catch (e) { return { ok: false, err: 'เขียนแบบ a+bi เช่น 1+i, -2, 3i, 1-2i' }; } }
function angCheck(s) { try { const v = angOf(cnorm(s)); if (!isFinite(v)) throw 0; return { ok: true, html: kx(`= ${fmt(v * 180 / Math.PI)}^\\circ`) }; } catch (e) { return { ok: false, err: 'เช่น π/4, 3π/4, -π/2, 60°' }; } }

/* ===================== ข้อสอบ: ปกข้อสอบ · หัวตอน · กระดาษคำตอบแบบฝน · ตารางเฉลย · ตัวสร้างชุดข้อสอบ ===================== */
const FILL_TXT = 'ใช้ดินสอดำ 2B ระบายวงกลมหมายเลขตัวเลือกที่ถูกต้องที่สุดในกระดาษคำตอบ (หน้าสุดท้าย) ให้เต็มวง ข้อละ 1 คำตอบ';
const QTYPES = { mc4: 'ปรนัย 4 ตัวเลือก', mc5: 'ปรนัย 5 ตัวเลือก', int: 'ระบายตัวเลขจำนวนเต็ม', dec: 'ระบายตัวเลขทศนิยม', write: 'เขียนตอบ / แสดงวิธีทำ' };
const WORKS = { none: ['ไม่มีกรอบทด', 0], small: ['กรอบเล็ก 3 ซม.', 30, 0], q5: ['5 ข้อต่อหน้า', 30, 5], q4: ['4 ข้อต่อหน้า', 30, 4], third: ['3 ข้อต่อหน้า', 40, 3], half: ['2 ข้อต่อหน้า', 60, 2], full: ['1 ข้อต่อหน้า (กรอบเต็มหน้า)', 60, 1] };
const EXAM_PRESETS = {
  alevel: { name: 'A-Level (คณิต 1 / คณิต 2 / ฟิสิกส์)', subj: 'คณิตศาสตร์ประยุกต์ 1 (A-Level)', set: 'ชุดที่ 1 · แนวข้อสอบปี 2569', time: 90, lab: '(1)',
    parts: [{ n: 'ตอนที่ 1 แบบปรนัย 5 ตัวเลือก', c: 25, t: 'mc5', p: 3, w: 'third' }, { n: 'ตอนที่ 2 แบบระบายตัวเลข', c: 5, t: 'dec', d: 4, f: 2, p: 5, w: 'half' }] },
  assoc: { name: 'แนวสมาคมคณิตศาสตร์ฯ', subj: 'แนวข้อสอบแข่งขันคณิตศาสตร์ สมาคมฯ', set: 'ชุดที่ 1 · แนวข้อสอบปี 2568', time: 180, lab: '(1)',
    parts: [{ n: 'ตอนที่ 1', c: 10, t: 'int', d: 4, p: 3, w: 'full' }, { n: 'ตอนที่ 2', c: 10, t: 'int', d: 4, p: 4, w: 'full' }, { n: 'ตอนที่ 3', c: 6, t: 'int', d: 4, p: 5, w: 'full' }] },
  pmc: { name: 'แนว PMC', subj: 'คณิตศาสตร์ (แนว PMC)', set: 'ชุดที่ 1', time: 180, lab: '(1)', parts: [{ n: 'แบบปรนัย 5 ตัวเลือก', c: 40, t: 'mc5', p: 2.5, w: 'third' }] },
  netsat: { name: 'NETSAT', subj: 'คณิตศาสตร์ (NETSAT)', set: 'ชุดที่ 1', time: 90, lab: '(1)', parts: [{ n: 'แบบปรนัย 4 ตัวเลือก', c: 30, t: 'mc4', p: 1, w: 'small' }] },
  guess: { name: 'ชุดเก็ง / ทดสอบท้ายบท', subj: 'แบบทดสอบ เรื่อง ...', set: 'ชุดเก็ง ชุดที่ 1', time: 60, lab: '(1)', parts: [{ n: 'ตอนที่ 1 ปรนัย', c: 15, t: 'mc4', p: 1, w: 'small' }, { n: 'ตอนที่ 2 แสดงวิธีทำ', c: 3, t: 'write', p: 5, w: 'half' }] },
  school: { name: 'ข้อสอบกลางภาค / ปลายภาค', subj: 'แบบทดสอบกลางภาค วิชาคณิตศาสตร์', set: 'ภาคเรียนที่ 1 ปีการศึกษา 2569', time: 60, lab: 'ก.', parts: [{ n: 'ตอนที่ 1 ปรนัย 4 ตัวเลือก', c: 20, t: 'mc4', p: 1, w: 'none' }, { n: 'ตอนที่ 2 อัตนัย', c: 4, t: 'write', p: 5, w: 'third' }] },
};
function workOpts(w) { const W = WORKS[w] || WORKS.third; return { h: W[1], share: W[2] && W[2] > 1 ? W[2] : undefined, full: w === 'full' || undefined, wl: w === 'full' ? 'พื้นที่แสดงวิธีทำ / พื้นที่สำหรับทด' : undefined }; }
const total = parts => parts.reduce((a, q) => a + q.c * q.p, 0), count = parts => parts.reduce((a, q) => a + q.c, 0);
const ptsTxt = v => (Math.round(v * 100) / 100).toString();
function partSummary(parts) {
  let k = 1; return parts.map(q => { const a = k, b = k + q.c - 1; k += q.c; return `${q.n} ข้อ ${a}${b > a ? '–' + b : ''} (${q.c} ข้อ) ${QTYPES[q.t]}${q.t === 'dec' ? ` ${'x'.repeat(q.d || 4)}.${'x'.repeat(q.f || 2)}` : q.t === 'int' ? ` ${q.d || 4} หลัก` : ''} ข้อละ ${ptsTxt(q.p)} คะแนน`; });
}
/* ---------- ปกข้อสอบ ---------- */
function defaultExamCover(cfg) {
  cfg = cfg || EXAM_PRESETS.alevel; const P = cfg.parts; const hasMC = P.some(q => q.t.startsWith('mc')), hasNum = P.some(q => q.t === 'int' || q.t === 'dec');
  const ins = ['ข้อสอบชุดนี้มี ' + count(P) + ' ข้อ คะแนนเต็ม ' + ptsTxt(total(P)) + ' คะแนน เวลา ' + cfg.time + ' นาที'].concat(partSummary(P));
  if (hasMC) ins.push(FILL_TXT);
  if (hasNum) ins.push('ข้อที่ตอบเป็นตัวเลข ให้เขียนตัวเลขลงในช่อง แล้วระบายวงกลมตัวเลขให้ตรงกับแต่ละหลัก' + (P.some(q => q.t === 'dec') ? ' (เช่น ตอบ 2.4 ระบายเป็น 0002.40)' : ''));
  ins.push('ห้ามนำเครื่องคำนวณเข้าห้องสอบ และห้ามนำข้อสอบออกจากห้องสอบ');
  return { subj: cfg.subj, set: cfg.set, items: String(count(P)), score: ptsTxt(total(P)), time: cfg.time + ' นาที', ins: ins.map((x, i) => `${i + 1}. ${esc(x)}`).join('<br>'), note: 'เอกสารนี้เป็นชุดฝึกเพื่อเตรียมสอบ ไม่ใช่ข้อสอบจริง', brand: 'Earth &amp; Newton Education' };
}
function examCoverHTML(b) {
  return `<div class="b-examcover"><div class="ec">
    <img class="ec-logo" alt=""><div class="ec-brand" contenteditable="true" data-f="brand"></div>
    <div class="ec-subj" contenteditable="true" data-f="subj" data-ph="ชื่อวิชา"></div>
    <div class="ec-set" contenteditable="true" data-f="set" data-ph="ชุด / ระดับ"></div>
    <table class="ec-info"><tr><th contenteditable="true" data-f="l1" data-def="จำนวน"></th><th contenteditable="true" data-f="l2" data-def="คะแนนเต็ม"></th><th contenteditable="true" data-f="l3" data-def="เวลา"></th></tr><tr><td><span contenteditable="true" data-f="items"></span> <span contenteditable="true" data-f="u1" data-def="ข้อ"></span></td><td><span contenteditable="true" data-f="score"></span> <span contenteditable="true" data-f="u2" data-def="คะแนน"></span></td><td contenteditable="true" data-f="time"></td></tr></table>
    <div class="ec-name"><span contenteditable="true" data-f="n1" data-def="ชื่อ–นามสกุล"></span><i style="flex:3"></i><span contenteditable="true" data-f="n2" data-def="ชั้น"></span><i></i><span contenteditable="true" data-f="n3" data-def="เลขที่"></span><i></i></div>
    <div class="ec-ins"><div class="ec-h" contenteditable="true" data-f="insh" data-def="คำชี้แจง"></div><div contenteditable="true" data-f="ins" data-ph="คำชี้แจง"></div></div>
    <div class="ec-note" contenteditable="true" data-f="note"></div>
  </div></div>`;
}
function fillExamCover(el, b) { const im = $('.ec-logo', el); im.src = coverLogo(b); im.style.display = (doc.settings.nologo && !b.logo) ? 'none' : ''; }
/* ---------- หัวตอน ---------- */
function partHTML() { return `<div class="b-part"><div contenteditable="true" data-f="html" data-ph="ตอนที่ 1 ..."></div><div class="pi" contenteditable="true" data-f="info" data-ph="ข้อ 1–10 ข้อละ 3 คะแนน"></div></div>`; }

/* ---------- กระดาษคำตอบแบบฝน (SVG) ---------- */
const ASHEET_DEF = { title: 'กระดาษคำตอบ', sub: '', id: 0, lab: '(1)', key: '', secs: [{ t: 'mc5', from: 1, to: 25 }, { t: 'dec', from: 26, to: 30, d: 4, f: 2 }] };
function sheetFromParts(parts, lab) { let k = 1; const secs = parts.map(q => { const t = ['mc4', 'mc5', 'int', 'dec'].includes(q.t) ? q.t : q.t === 'fill' ? 'dec' : 'write', m = /ตอนที่\s*[\dก-ฮ]+/.exec(q.n || ''); const s = { t, from: k, to: k + q.c - 1, d: q.d || 4, f: q.f || 2 }; if (+q.p) s.p = +q.p; if (m) s.part = m[0]; if (t === 'write' && q.t !== 'write') s.qt = q.t; k += q.c; return s; }); return { title: 'กระดาษคำตอบ', sub: '', id: 0, lab: lab || '(1)', key: '', secs }; }
function choiceLabels(n, lab) { if (lab === 'ก.') return 'กขคงจ'.slice(0, n).split(''); if (lab === 'A.') return 'ABCDE'.slice(0, n).split(''); return Array.from({ length: n }, (_, i) => String(i + 1)); }
function answerSheetSVG(cfg) {
  const W = 658, ink = CL.dark, br = cfg.color || (typeof themeOf === 'function' ? themeOf(doc.settings).brown : CL.brown); let s = '', y = 0;
  const lay = { v: 1, W: W, id: [], q: {} }, R1 = v => Math.round(v * 10) / 10; // ตำแหน่งวงระบายทั้งหมด (ใช้ตรวจด้วยเครื่อง)
  /* โหมดตรวจด้วยเครื่อง: พิมพ์กระดาษเปล่า เฉลยไปอยู่ในรหัสตรวจ */ const keys = cfg.omr ? [] : String(cfg.key || '').split(/[,\s]+/).filter(Boolean); const keyOf = q => keys[q - 1];
  const txt = (x, yy, t, o = {}) => `<text x="${x}" y="${yy}" font-family="${o.f || 'THS'}" font-size="${o.fs || 15}" text-anchor="${o.a || 'middle'}" fill="${o.c || ink}"${o.b ? ' font-weight="700"' : ''}>${esc(String(t))}</text>`;
  const bub = (x, yy, t, on, r = 8.2) => `<circle cx="${x}" cy="${yy}" r="${r}" fill="${on ? '#222' : '#fff'}" stroke="${br}" stroke-width="1.1"/>` + (on ? '' : txt(x, yy + 3.6, t, { fs: t.length > 1 ? 9 : 10.5, c: '#9b6b4a', f: /[ก-ฮ]/.test(t) ? 'THS' : 'KaTeX_Main' }));
  // หัว
  if (cfg.logo) { const src = coverLogo(null); s += `<image href="${src}" x="0" y="0" width="52" height="52" preserveAspectRatio="xMidYMid meet"/>`; }
  if (cfg.score) s += `<rect x="${W - 92}" y="2" width="90" height="50" rx="6" fill="#fff" stroke="${br}"/>` + txt(W - 47, 21, 'คะแนนที่ได้', { fs: 12, c: br }) + txt(W - 47, 44, '/ ' + cfg.score, { fs: 18, f: 'KaTeX_Main' });
  s += txt(W / 2, 26, cfg.title || 'กระดาษคำตอบ', { fs: 24, b: 1, c: br });
  let subLines = 0;
  if (cfg.sub) { // ตัดบรรทัดไม่ให้ทับกล่องคะแนน/ตรา
    const L0 = cfg.logo ? 60 : 0, R0 = cfg.score ? 100 : 0, maxW = W - 2 * Math.max(L0, R0) - 8;
    let mw = t => t.length * 7.2; try { const cx = document.createElement('canvas').getContext('2d'); cx.font = '16px THS'; mw = t => cx.measureText(t).width; } catch (e) { }
    const words = String(cfg.sub).split(/(\s+)/); const lines = []; let cur = '';
    words.forEach(w => { if (mw((cur + w).trim()) > maxW && cur.trim()) { lines.push(cur.trim()); cur = w.trimStart(); } else cur += w; }); if (cur.trim()) lines.push(cur.trim());
    lines.forEach((l, i) => s += txt(W / 2, 48 + i * 19, l, { fs: 16, c: ink })); subLines = lines.length;
  }
  y = Math.max(cfg.sub ? 60 + (subLines - 1) * 19 : 40, cfg.logo || cfg.score ? 60 : 0);
  const idW = cfg.id ? cfg.id * 22 + 24 : 0; const hH = cfg.id ? 270 : 104;
  s += `<rect x="1" y="${y}" width="${W - 2}" height="${hH}" rx="8" fill="#fffaf5" stroke="${br}" stroke-width="1.2"/>`;
  const line = (x1, x2, yy, label) => txt(x1, yy, label, { a: 'start', fs: 15 }) + `<path d="M${x1 + label.length * 6.3 + 8} ${yy + 3}H${x2}" stroke="${ink}" stroke-width=".8" stroke-dasharray="1.5 3"/>`;
  const L = W - idW - 30;
  s += line(16, L, y + 28, cfg.n1 ?? 'ชื่อ–นามสกุล') + line(16, L * 0.55, y + 58, cfg.n2 ?? 'ชั้น') + line(L * 0.58, L, y + 58, cfg.n3 ?? 'เลขที่');
  // คำชี้แจง + ตัวอย่าง
  const iy = y + 88, ex = 210; s += txt(16, iy, cfg.ins ?? 'ใช้ดินสอดำ 2B ระบายให้เต็มวง', { a: 'start', fs: 14 });
  s += cfg.noex ? '' : txt(ex, iy, 'ระบายถูก', { a: 'start', fs: 13, c: CL.green }) + bub(ex + 58, iy - 5, '', true, 7) + txt(ex + 80, iy, 'ระบายผิด', { a: 'start', fs: 13, c: CL.red });
  const wx = ex + 140; s += cfg.noex ? '' : `<circle cx="${wx}" cy="${iy - 5}" r="7" fill="#fff" stroke="${br}"/><path d="M${wx - 5} ${iy - 10}l10 10M${wx + 5} ${iy - 10}l-10 10" stroke="#222" stroke-width="1.6"/><circle cx="${wx + 22}" cy="${iy - 5}" r="7" fill="#fff" stroke="${br}"/><path d="M${wx + 18} ${iy - 5}l3 4 6 -8" stroke="#222" stroke-width="1.6" fill="none"/><circle cx="${wx + 44}" cy="${iy - 5}" r="7" fill="#fff" stroke="${br}"/><circle cx="${wx + 44}" cy="${iy - 5}" r="3.5" fill="#222"/>`;
  if (cfg.id) { // เลขประจำตัวผู้สอบ
    const x0 = W - idW - 6; s += txt(x0 + idW / 2, y + 22, 'เลขประจำตัว', { fs: 14, b: 1, c: br });
    for (let j = 0; j < cfg.id; j++) { const x = x0 + 12 + j * 22 + 11; s += `<rect x="${x - 9}" y="${y + 30}" width="18" height="20" fill="#fff" stroke="${br}"/>`; lay.id[j] = []; for (let d = 0; d <= 9; d++) { s += bub(x, y + 64 + d * 20, String(d), false, 7.5); lay.id[j].push([R1(x), R1(y + 64 + d * 20)]); } } lay.idr = 7.5;
  }
  y += hH + 22;
  // ส่วนต่าง ๆ
  const secs = [];
  (cfg.secs || []).forEach(q => { const L = secs[secs.length - 1]; if (L && L.t === q.t && (q.t === 'int' || q.t === 'dec') && +L.d === +q.d && +L.f === +q.f && +q.from === +L.to + 1) L.to = q.to; else secs.push(Object.assign({}, q)); });
  const numTotal = secs.filter(q => q.t === 'int' || q.t === 'dec').reduce((a, q) => a + (q.to - q.from + 1), 0);
  secs.forEach(sec => {
    const items = []; for (let q = +sec.from; q <= +sec.to; q++) items.push(q); if (!items.length) return;
    if (sec.t === 'mc4' || sec.t === 'mc5') {
      const n = sec.t === 'mc4' ? 4 : 5; const labs = choiceLabels(n, cfg.lab);
      const colW = 32 + n * 22 + 18; const cols = Math.max(1, Math.min(Math.floor((W + 10) / colW), Math.ceil(items.length / 5))); const rows = Math.ceil(items.length / cols); const gx = (W - cols * colW) / Math.max(1, cols);
      s += txt(4, y, `${sec.part ? sec.part + ' · ' : ''}ข้อ ${sec.from}–${sec.to} ${QTYPES[sec.t]}${+sec.p ? ' · ข้อละ ' + ptsTxt(+sec.p) + ' คะแนน' : ''}`, { a: 'start', fs: 15, b: 1, c: br }); y += 12;
      items.forEach((q, i) => { const c = Math.floor(i / rows), r = i % rows; const x = 4 + c * (colW + gx), yy = y + 14 + r * 23; if (r % 5 === 0 && r) s += ''; s += `<rect x="${x}" y="${yy - 11}" width="${colW - 6}" height="22" fill="${r % 2 ? '#fcf6f0' : '#fff'}"/>` + txt(x + 24, yy + 5, q, { a: 'end', fs: 14, b: 1, f: 'KaTeX_Main' }); const k = keyOf(q); labs.forEach((t, j) => s += bub(x + 42 + j * 22, yy, t, k && (k === t || k === String(j + 1)))); lay.q[q] = { t: 'mc', n: n, r: 8.2, l: labs, o: labs.map((t, j) => [R1(x + 42 + j * 22), R1(yy)]) }; if (+sec.p) lay.q[q].pt = +sec.p; });
      y += rows * 23 + 22;
    } else if (sec.t === 'int' || sec.t === 'dec') {
      const d = +sec.d || 4, f = sec.t === 'dec' ? (+sec.f || 2) : 0, nd = d + f; const compact = numTotal > 10; const bw = compact ? 16.5 : 22, vs = compact ? 15.5 : 20, rr = compact ? 6.3 : 7.5, BH = 60 + 9 * vs + 14; const boxW = nd * bw + (f ? 10 : 0) + 18; const per = Math.max(1, Math.floor((W + 4) / (boxW + 10))); const gx = per > 1 ? (W - 8 - per * boxW) / (per - 1) : 0;
      s += txt(4, y, `${sec.part ? sec.part + ' · ' : ''}ข้อ ${sec.from}–${sec.to} ${QTYPES[sec.t]} ${sec.t === 'dec' ? 'x'.repeat(d) + '.' + 'x'.repeat(f) : d + ' หลัก'}${+sec.p ? ' · ข้อละ ' + ptsTxt(+sec.p) : ''}`, { a: 'start', fs: 15, b: 1, c: br });
      if (sec.t === 'dec') s += txt(W - 4, y, `ตัวอย่าง ตอบ 2.4 เขียนและระบายเป็น ${'0'.repeat(Math.max(0, d - 1))}2.4${'0'.repeat(Math.max(0, f - 1))}`, { a: 'end', fs: 13, c: CL.teal });
      y += 10;
      items.forEach((q, i) => {
        const c = i % per, r = Math.floor(i / per); const x = 4 + c * (boxW + gx), y0 = y + r * (BH + 10);
        s += `<rect x="${x}" y="${y0}" width="${boxW}" height="${BH}" rx="6" fill="#fff" stroke="${br}" stroke-width="1"/>` + txt(x + boxW / 2, y0 + 18, `ข้อ ${q}`, { fs: 14, b: 1 });
        let k = keyOf(q); let digs = null; if (k !== undefined) { const v = Math.abs(parseFloat(k)); if (isFinite(v)) { const str = f ? v.toFixed(f) : String(Math.round(v)); const [a, bpart = ''] = str.split('.'); digs = (a.padStart(d, '0').slice(-d) + bpart).split(''); } }
        const LQ = lay.q[q] = { t: sec.t, d: d, f: f, r: rr, c: [] }; if (+sec.p) LQ.pt = +sec.p;
        for (let j = 0; j < nd; j++) { const xx = x + 9 + j * bw + (f && j >= d ? 10 : 0) + bw / 2; LQ.c[j] = []; for (let v = 0; v <= 9; v++) LQ.c[j].push([R1(xx), R1(y0 + 60 + v * vs)]); s += `<rect x="${xx - bw / 2 + 1}" y="${y0 + 26}" width="${bw - 2}" height="20" fill="#fff" stroke="${br}"/>` + (digs ? txt(xx, y0 + 41, digs[j], { fs: 14, f: 'KaTeX_Main' }) : ''); for (let v = 0; v <= 9; v++) s += bub(xx, y0 + 60 + v * vs, String(v), digs && digs[j] === String(v), rr); }
        if (f) { const xp = x + 9 + d * bw + 5; s += `<circle cx="${xp}" cy="${y0 + 43}" r="2.2" fill="${ink}"/>`; }
      });
      y += Math.ceil(items.length / per) * (BH + 10) + 16;
    } else if (sec.t === 'write') { // ข้อเขียน: ช่องให้ครูระบายคะแนน
      const p = Math.max(0.5, +sec.p || 10), tens = Math.floor(p / 10), units = p >= 10 ? 9 : Math.floor(p), rr = 7.2, gap = 19;
      s += txt(4, y, `${sec.part ? sec.part + ' · ' : ''}ข้อ ${sec.from}–${sec.to} ${QTYPES[sec.qt] || QTYPES.write} · คะแนนครู (เต็ม ${ptsTxt(p)})`, { a: 'start', fs: 15, b: 1, c: br }); y += 12;
      const rowW = 70 + (tens ? (tens + 1) * gap + 14 : 0) + (units + 1) * gap + 14 + gap + 6, per = Math.max(1, Math.floor((W + 6) / (rowW + 6)));
      items.forEach((q, i) => {
        const c = i % per, r = Math.floor(i / per), x = 4 + c * (rowW + 6), yy = y + 14 + r * 26;
        s += `<rect x="${x}" y="${yy - 12}" width="${rowW}" height="24" rx="5" fill="#fff" stroke="${br}" stroke-width=".8"/>` + txt(x + 8, yy + 5, `ข้อ ${q}`, { a: 'start', fs: 14, b: 1 });
        const LQ = lay.q[q] = { t: 'w', p: p, r: rr, tens: [], units: [] }; let xx = x + 62;
        if (tens) { if (!r) s += txt(xx + 2, yy - 13.5, 'สิบ', { a: 'start', fs: 9, c: '#9b6b4a' }); for (let v = 0; v <= tens; v++) { xx += gap; s += bub(xx - gap / 2, yy, String(v), false, rr); LQ.tens.push([R1(xx - gap / 2), R1(yy)]); } xx += 14; }
        if (!r) s += txt(xx + 2, yy - 13.5, 'หน่วย', { a: 'start', fs: 9, c: '#9b6b4a' });
        for (let v = 0; v <= units; v++) { xx += gap; s += bub(xx - gap / 2, yy, String(v), false, rr); LQ.units.push([R1(xx - gap / 2), R1(yy)]); }
        xx += 14 + gap; s += bub(xx - gap / 2, yy, '½', false, rr); LQ.half = [R1(xx - gap / 2), R1(yy)];
      });
      y += Math.ceil(items.length / per) * 26 + 22;
    }
  });
  s += `<text x="${W - 4}" y="${y + 4}" font-family="THS" font-size="12" text-anchor="end" fill="#9b8b80">${esc(cfg.brand ?? 'Earth & Newton Education')}</text>`;
  const H = y + 10;
  if (cfg.omr) { // จุดสี่เหลี่ยม 4 มุม ให้Sir’Earth Classจัดภาพสแกนและหาหน้ากระดาษคำตอบ
    const M = 26, F = 18, cs = [[-M + F / 2, -M + F / 2], [W + M - F / 2, -M + F / 2], [-M + F / 2, H + M - F / 2], [W + M - F / 2, H + M - F / 2]];
    cs.forEach(c => s += `<rect x="${c[0] - F / 2}" y="${c[1] - F / 2}" width="${F}" height="${F}" fill="#000"/>`);
    s += `<text x="${W / 2}" y="${H + M - 6}" font-family="THS" font-size="11" text-anchor="middle" fill="#9b8b80">ตรวจด้วย Sir’Earth Class · ห้ามเขียนหรือขีดทับจุดดำทั้ง 4 มุม</text>`;
    lay.fid = cs; lay.fs = F; lay.vb = [-M, -M, W + 2 * M, Math.round(H) + 2 * M];
  } else lay.vb = [0, 0, W, Math.round(H)];
  lay.H = Math.round(H); window.__asLay = lay;
  const vb = lay.vb, maxH = 935; const scale = Math.min(1, maxH / vb[3], W / vb[2]);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${Math.round(vb[2] * scale)}" height="${Math.round(vb[3] * scale)}" viewBox="${vb.join(' ')}">${s}</svg>`;
}
function ashtHTML(b) { return `<div class="b-asheet">${answerSheetSVG(b.cfg || ASHEET_DEF)}</div>`; }
/* ---------- ตารางสรุปคำตอบ ---------- */
function keyTableHTML(b) {
  const ks = String(b.key || '').split(/[,\s]+/).filter(Boolean); const per = +b.cols || 10; const st = +b.from || 1;
  if (!ks.length) return '<div class="b-keytable"><div class="dv-err">ใส่คำตอบในแผงรูปแบบด้านขวา เช่น 3,1,5,2,4</div></div>';
  let h = '<table class="kt">'; for (let i = 0; i < ks.length; i += per) { const row = ks.slice(i, i + per); h += '<tr class="kh">' + row.map((_, j) => `<td>ข้อ ${st + i + j}</td>`).join('') + '</tr><tr>' + row.map(k => `<td>${kx(texFor(k.replace(/^(-?\d+)\/(\d+)$/, '\\frac{$1}{$2}'), {}))}</td>`).join('') + '</tr>'; }
  return `<div class="b-keytable">${h}</table></div>`;
}

/* ---------- ข้อสอบในเอกสาร → กระดาษคำตอบ (ชนิด/คะแนนตรงกันเสมอ) ---------- */
function examQs() {
  const B = doc.blocks, out = []; let part = '', k = 0;
  B.forEach((b, i) => {
    if (b.t === 'part') { const t = plainText(b.html || ''); const m = /ตอนที่\s*[\dก-ฮ]+/.exec(t); part = m ? m[0].replace(/\s+/, ' ') : t.slice(0, 24); return; }
    if (b.t !== 'problem' || b.nobm) return;
    const tx = plainText(b.html || ''); if (/ตัวอย่าง/.test(tx)) return;
    const m = /ข้อ\s*(\d+)/.exec(tx); const q = m ? +m[1] : k + 1; k = q;
    let t = b.qt; if (!t) { for (let j = i + 1; j < B.length && B[j].t !== 'problem' && B[j].t !== 'part'; j++) if (B[j].t === 'choices') { t = (B[j].items || []).length >= 5 ? 'mc5' : 'mc4'; break; } }
    const p = parseFloat(String(b.pts || '').replace(/[^\d.]/g, '')) || 0;
    const st = t === 'mc4' || t === 'mc5' ? t : t === 'int' ? 'int' : t === 'dec' || t === 'fill' ? 'dec' : 'write';
    out.push({ q, t: st, qt: t || 'write', p, part, id: b.id });
  });
  return out;
}
function sheetFromDoc(old) {
  const qs = examQs(), secs = [], prev = q => (old || []).find(s => q >= +s.from && q <= +s.to && s.t === 'dec');
  qs.forEach(x => { const L = secs[secs.length - 1]; if (L && L.t === x.t && L.p === x.p && L.part === x.part && (L.qt || '') === (x.t === 'write' ? x.qt : '') && x.q === L.to + 1) L.to = x.q; else { const o = prev(x.q); secs.push({ t: x.t, from: x.q, to: x.q, d: o ? +o.d : 4, f: o ? +o.f : 2, p: x.p, part: x.part, qt: x.t === 'write' ? x.qt : undefined }); } });
  return { secs, total: Math.round(qs.reduce((a, x) => a + x.p, 0) * 100) / 100, n: qs.length };
}
function rangeTxt(a) { const r = []; a.sort((x, y) => x - y).forEach(q => { const L = r[r.length - 1]; if (L && q === L[1] + 1) L[1] = q; else r.push([q, q]); }); return r.map(x => x[0] === x[1] ? x[0] : x[0] + '–' + x[1]).join(', '); }
/* เทียบกระดาษคำตอบกับข้อสอบ: คืนรายการสิ่งที่ไม่ตรงกัน */
function asCheck(cfg) {
  const qs = examQs().filter(x => x.p); if (!qs.length) return [];
  const on = {}; (cfg.secs || []).forEach(s => { for (let q = +s.from; q <= +s.to; q++) on[q] = s; });
  const miss = [], typ = [], pts = []; qs.forEach(x => { const s = on[x.q]; if (!s) miss.push(x.q); else { if (s.t !== x.t) typ.push(x.q); if (+s.p && Math.abs(+s.p - x.p) > 1e-9 || s.t === 'write' && !+s.p) pts.push(x.q); } });
  const ex = Object.keys(on).map(Number).filter(q => !qs.some(x => x.q === q));
  const out = []; if (miss.length) out.push('ข้อ ' + rangeTxt(miss) + ' ไม่มีในกระดาษคำตอบ'); if (ex.length) out.push('ข้อ ' + rangeTxt(ex) + ' ไม่มีในข้อสอบ');
  if (typ.length) out.push('ข้อ ' + rangeTxt(typ) + ' ชนิดไม่ตรงกับข้อสอบ'); if (pts.length) out.push('ข้อ ' + rangeTxt(pts) + ' คะแนนเต็มไม่ตรงกับข้อสอบ');
  const tot = Math.round(qs.reduce((a, x) => a + x.p, 0) * 100) / 100; if (cfg.score && +cfg.score !== tot) out.push(`ช่องคะแนนเต็มเขียน ${cfg.score} แต่ข้อสอบรวม ${ptsTxt(tot)}`);
  return out;
}
/* ตำแหน่งข้อในเล่ม (หน้า + ช่วงความสูง) ให้ Sir’Earth Class ตัดภาพมาให้ครูตรวจบนจอ */
function examBook(qs) {
  try {
    const P = PAGE_H + PAGE_G, els = $$('#flow > .blk'), idx = {}; els.forEach((el, i) => idx[el.dataset.id] = i);
    const reg = {}, R4 = v => Math.round(v * 1e4) / 1e4;
    qs.forEach(x => {
      const i0 = idx[x.id]; if (i0 == null) return; let i1 = i0;
      while (i1 + 1 < els.length && !/^(problem|part|asheet|pagebreak|keytable)$/.test(els[i1 + 1].dataset.t)) i1++;
      const top = els[i0].offsetTop, bot = els[i1].offsetTop + els[i1].offsetHeight, segs = [];
      for (let p = Math.floor(top / P); p <= Math.floor((bot - 1) / P); p++) { const a = Math.max(top, p * P) - p * P, b = Math.min(bot, p * P + PAGE_H) - p * P; if (b - a > 8) segs.push([p, R4(a / PAGE_H), R4(b / PAGE_H)]); }
      if (segs.length) reg[x.q] = segs;
    });
    const sh = els.find(el => el.dataset.t === 'asheet');
    return { n: $('#sheets').childElementCount, sheet: sh ? Math.floor(sh.offsetTop / P) : -1, reg };
  } catch (e) { return null; }
}

/* ---------- หน้าต่างกระดาษคำตอบ ---------- */
let asTarget = null;
const AS_PRESETS = {
  alevel: () => sheetFromParts(EXAM_PRESETS.alevel.parts), assoc: () => sheetFromParts(EXAM_PRESETS.assoc.parts), pmc: () => sheetFromParts(EXAM_PRESETS.pmc.parts),
  netsat: () => sheetFromParts(EXAM_PRESETS.netsat.parts), mc20: () => ({ title: 'กระดาษคำตอบ', sub: '', id: 0, lab: '(1)', key: '', secs: [{ t: 'mc4', from: 1, to: 20 }] }),
  mc50: () => ({ title: 'กระดาษคำตอบ', sub: '', id: 5, lab: 'ก.', key: '', secs: [{ t: 'mc4', from: 1, to: 50 }] }), mc100: () => ({ title: 'กระดาษคำตอบ', sub: '', id: 0, lab: '(1)', key: '', secs: [{ t: 'mc5', from: 1, to: 100 }] }),
};
function openAnswerSheet(id, cfg) {
  asTarget = id || null; const c = id ? byId(id).cfg : (cfg || AS_PRESETS.alevel());
  $('#asIns').value = c.ins ?? 'ใช้ดินสอดำ 2B ระบายให้เต็มวง'; $('#asN1').value = c.n1 ?? 'ชื่อ–นามสกุล'; $('#asN2').value = c.n2 ?? 'ชั้น'; $('#asN3').value = c.n3 ?? 'เลขที่';
  $('#asTitle').value = c.title || ''; $('#asSub').value = c.sub || ''; $('#asLogoC').checked = !!c.logo; $('#asScore').value = c.score || ''; $('#asColor').value = c.color || themeOf(doc.settings).brown; $('#asBrand').value = c.brand ?? (doc.settings.ft ?? 'Earth & Newton Education'); $('#asId').value = c.id || 0; $('#asLab').value = c.lab || '(1)'; $('#asKey').value = c.key || ''; $('#asOmr').checked = !!c.omr;
  asSecs(c.secs || []); asPrev(); openDlg('#dAsht');
}
function asSecs(secs) {
  $('#asSecs').innerHTML = secs.map((q, i) => asRow(q, i)).join('');
}
function asRow(q, i) {
  return `<div class="row asr" data-i="${i}"><label>ข้อ</label><input type="number" data-k="from" value="${q.from}" min="1" style="width:64px"><label>ถึง</label><input type="number" data-k="to" value="${q.to}" min="1" style="width:64px">
    <select data-k="t">${['mc4', 'mc5', 'int', 'dec', 'write'].map(t => `<option value="${t}"${q.t === t ? ' selected' : ''}>${QTYPES[t]}</option>`).join('')}</select>
    <label class="dg">หลักจำนวนเต็ม</label><input class="dg" type="number" data-k="d" value="${q.d || 4}" min="1" max="6" style="width:52px"><label class="dc">ทศนิยม</label><input class="dc" type="number" data-k="f" value="${q.f || 2}" min="1" max="3" style="width:52px"><label>คะแนน/ข้อ</label><input type="number" data-k="p" value="${q.p != null && q.p !== '' ? q.p : (q.t === 'write' ? 10 : '')}" min="0" max="30" step="0.5" style="width:60px" placeholder="–">${q.part ? `<input type="hidden" data-k="part" value="${esc(q.part)}">` : ''}${q.qt ? `<input type="hidden" data-k="qt" value="${esc(q.qt)}">` : ''}
    <button class="tb" data-del="${i}" title="ลบส่วนนี้">✕</button></div>`;
}
function asRead() {
  const secs = $$('#asSecs .asr').map(r => { const g = k => { const e = $(`[data-k="${k}"]`, r); return e ? e.value : ''; }; const o = { t: g('t'), from: +g('from'), to: +g('to'), d: +g('d'), f: +g('f') }; const p = parseFloat(g('p')); if (o.t === 'write') o.p = p > 0 ? p : 10; else if (p > 0) o.p = p; if (g('part')) o.part = g('part'); if (g('qt') && o.t === 'write') o.qt = g('qt'); return o; });
  return { ins: $('#asIns').value, n1: $('#asN1').value, n2: $('#asN2').value, n3: $('#asN3').value, title: $('#asTitle').value, sub: $('#asSub').value, id: +$('#asId').value || 0, lab: $('#asLab').value, key: $('#asKey').value.trim(), secs, logo: $('#asLogoC').checked || undefined, score: $('#asScore').value.trim() || undefined, color: $('#asColor').value, brand: $('#asBrand').value, omr: $('#asOmr').checked || undefined };
}
function asWarn() { const w = asCheck(asRead()), el = $('#asWarn'); el.style.display = w.length ? '' : 'none'; el.innerHTML = w.length ? '⚠️ กระดาษคำตอบไม่ตรงกับข้อสอบในเอกสาร: ' + w.map(esc).join(' · ') + ' — กด <b>🔄 จัดตามข้อสอบในเอกสาร</b>' : ''; }
function asPrev() { setTimeout(asWarn, 0); $$('#asSecs .asr').forEach(r => { const t = $('[data-k="t"]', r).value; $$('.dg', r).forEach(e => e.style.display = t === 'int' || t === 'dec' ? '' : 'none'); $$('.dc', r).forEach(e => e.style.display = t === 'dec' ? '' : 'none'); $$('.dw', r).forEach(e => e.style.display = t === 'write' ? '' : 'none'); }); $('#asPrev').innerHTML = answerSheetSVG(asRead()); }
$('#asSecs').addEventListener('input', asPrev); $('#asSecs').addEventListener('change', asPrev);
['asIns', 'asN1', 'asN2', 'asN3', 'asTitle', 'asSub', 'asId', 'asLab', 'asKey', 'asScore', 'asColor', 'asBrand'].forEach(i => $('#' + i).addEventListener('input', asPrev)); $('#asLogoC').addEventListener('change', asPrev); $('#asLab').addEventListener('change', asPrev);
$('#asSecs').addEventListener('click', e => { const d = e.target.closest('[data-del]'); if (!d) return; const c = asRead(); c.secs.splice(+d.dataset.del, 1); asSecs(c.secs); asPrev(); });
$('#asAdd').onclick = () => { const c = asRead(); const last = c.secs[c.secs.length - 1]; const st = last ? last.to + 1 : 1; c.secs.push({ t: 'mc5', from: st, to: st + 9, d: 4, f: 2 }); asSecs(c.secs); asPrev(); };
$('#asPreset').onchange = e => { const f = AS_PRESETS[e.target.value]; if (!f) return; const c = f(); c.title = $('#asTitle').value || c.title; c.sub = $('#asSub').value; asSecs(c.secs); $('#asId').value = c.id || 0; $('#asLab').value = c.lab; asPrev(); e.target.value = ''; };
$('#asCancel').onclick = () => closeDlg('#dAsht');
$('#asSync').onclick = () => {
  const x = sheetFromDoc(asRead().secs); if (!x.n) { toast('ยังไม่พบข้อสอบ (บล็อก "ข้อ …" ที่มีคะแนน) ในเอกสารนี้'); return; }
  asSecs(x.secs); if (x.total) $('#asScore').value = ptsTxt(x.total); if (!(+$('#asId').value)) $('#asId').value = 5; $('#asOmr').checked = true; asPrev();
  toast(`จัดตามข้อสอบแล้ว: ${x.n} ข้อ · รวม ${ptsTxt(x.total)} คะแนน · ข้อเขียนให้คะแนนบนจอใน Sir’Earth Class หรือระบายก็ได้`);
};
/* รหัสสำหรับตรวจด้วยเครื่องในSir’Earth Class: รูปแบบกระดาษ + ตำแหน่งวงระบาย + เฉลย */
function omrCode(cfg) {
  const c = Object.assign({}, cfg, { omr: true }); answerSheetSVG(c); const lay = window.__asLay;
  const o = { v: 2, app: 'newton-press', title: [c.title, c.sub].filter(Boolean).join(' · '), lab: c.lab, key: c.key || '', secs: c.secs, lay: lay };
  const wq = examQs().filter(x => (c.secs || []).some(s => s.t === 'write' && x.q >= +s.from && x.q <= +s.to)); if (wq.length) { const bk = examBook(wq); if (bk) o.book = bk; }
  return 'NPOMR1:' + btoa(unescape(encodeURIComponent(JSON.stringify(o))));
}
$('#asCode').onclick = () => {
  const cfg = asRead();
  if (!cfg.omr) { $('#asOmr').checked = true; asPrev(); }
  const w = asCheck(asRead()); if (w.length && !confirm('กระดาษคำตอบยังไม่ตรงกับข้อสอบ:\n• ' + w.join('\n• ') + '\n\nคัดลอกรหัสต่อเลยไหม? (แนะนำกด "ยกเลิก" แล้วกด 🔄 จัดตามข้อสอบในเอกสาร)')) return;
  const code = omrCode(asRead()), keys = String(cfg.key || '').split(/[,\s]+/).filter(Boolean).length;
  const done = () => alert('คัดลอกรหัสแล้ว ✓' + (keys ? '' : '\n(ยังไม่ได้ใส่คำตอบที่ถูก — ใส่เฉลยใน Sir’Earth Class ได้ หรือใส่ที่ช่อง "คำตอบที่ถูก" ก่อนคัดลอก)') + '\n\nไปที่ Sir’Earth Class (หน้าครู) → แท็บลงคะแนน → เลือกรายการ → 📝 ตรวจข้อสอบ → วางรหัส\n* อย่าลืมกด "ใส่ลงเอกสาร" แล้วพิมพ์กระดาษคำตอบแบบมีจุดดำ 4 มุม');
  if (navigator.clipboard) navigator.clipboard.writeText(code).then(done, () => prompt('คัดลอกรหัสนี้:', code)); else prompt('คัดลอกรหัสนี้:', code);
};
$('#asOk').onclick = () => {
  const cfg = asRead(); closeDlg('#dAsht');
  if (asTarget) { const b = byId(asTarget); b.cfg = cfg; rerender(b.id); changed(true); }
  else { const pb = doc.blocks.length && doc.blocks[doc.blocks.length - 1].t !== 'pagebreak' ? [newBlock('pagebreak')] : []; const b = newBlock('asheet', { cfg }); insertBlocks(pb.concat([b])); }
};


/* ===================== 📤 ส่งข้อสอบไป Sir’Earth Class (ผ่าน Google Drive · ไม่ต้องคัดลอกรหัส) =====================
   ไฟล์เดียวจบ: ข้อสอบ (บล็อก “ข้อ …” ที่มีคะแนน) + กระดาษคำตอบแบบตรวจด้วยเครื่อง + คำตอบที่ถูก
   คำตอบที่ถูกดึงเองจาก: ตารางสรุปคำตอบ · หัวเฉลยข้อ (คำตอบ) · ช่องคำตอบในกระดาษคำตอบ · หรือไฟล์เฉลยอื่นใน Drive */
const SND = { extra: null, extraName: '', typed: null, busy: false, done: null };
function sndNorm(v, t) {
  v = String(v ?? '').replace(/<[^>]*>/g, '').replace(/[()（）\s]/g, '').replace(/^ตอบ/, '').replace(/[.。]$/, '');
  if (!v || v === '-') return '';
  if (t === 'mc4' || t === 'mc5') {
    if (/^[1-5]$/.test(v)) return v;
    const th = 'กขคงจ'.indexOf(v[0]), en = 'ABCDE'.indexOf(v[0].toUpperCase());
    if (v.length === 1 && th >= 0) return String(th + 1); if (v.length === 1 && en >= 0) return String(en + 1);
    return '';
  }
  if (t === 'write') return '';
  const n = v.replace(/,/g, '').replace(/−/g, '-');
  if (/^-?\d+\/\d+$/.test(n)) { const [a, b] = n.split('/'); return String(Math.round(a / b * 1e6) / 1e6); }
  return n !== '' && isFinite(+n) ? n : '';
}
/* คำตอบจากบล็อกในเอกสาร → { ข้อ: คำตอบ } */
function sndKeysFrom(blocks) {
  const K = {}, src = new Set(), put = (q, v, s) => { v = String(v ?? '').trim(); if (!q || !v || v === '-' || K[q] != null) return; K[q] = v; src.add(s); };
  (blocks || []).forEach(b => {
    if (b.t === 'keytable') { const st = +b.from || 1; String(b.key || '').split(/[,\s]+/).filter(Boolean).forEach((k, i) => put(st + i, k, 'ตารางสรุปคำตอบ')); }
    if (b.t === 'solhead') { const m = /(\d+)/.exec(plainText(b.num || '')); if (m) put(+m[1], plainText(b.ans || ''), 'หัวเฉลยข้อ'); }
    if (b.t === 'asheet' && b.cfg && b.cfg.key) { const s = String(b.cfg.key); (s.includes(',') ? s.split(',') : s.split(/\s+/)).forEach((k, i) => put(i + 1, k, 'ช่องคำตอบในกระดาษคำตอบ')); }
  });
  return { K, src: [...src] };
}
function sndState() {
  const qs = examQs().filter(x => x.p), sheet = doc.blocks.find(b => b.t === 'asheet'), cfg = sheet ? sheet.cfg || {} : null;
  const on = {}; (cfg ? cfg.secs || [] : []).forEach(s => { for (let q = +s.from; q <= +s.to; q++) on[q] = s; });
  const sq = Object.keys(on).map(Number).sort((a, b) => a - b);
  const mine = sndKeysFrom(doc.blocks), ex = SND.extra ? sndKeysFrom(SND.extra) : { K: {}, src: [] };
  const typed = SND.typed || {}, key = {}, need = [], miss = [];
  sq.forEach(q => {
    const t = on[q].t; if (t === 'write') return; need.push(q);
    const v = sndNorm(typed[q] ?? mine.K[q] ?? ex.K[q], t); if (v) key[q] = v; else miss.push(q);
  });
  const warn = cfg ? asCheck(cfg) : [];
  return { qs, sheet, cfg, sq, on, key, need, miss, warn, src: mine.src.concat(SND.extra ? ['ไฟล์ “' + SND.extraName + '”'] : []).concat(SND.typed && Object.keys(SND.typed).length ? ['ที่พิมพ์ในหน้านี้'] : []),
    total: Math.round(qs.reduce((a, x) => a + x.p, 0) * 100) / 100, w: sq.filter(q => on[q].t === 'write').length };
}
function sndTitle(S) {
  if (doc.npSend && doc.npSend.name) return doc.npSend.name;
  const cv = doc.blocks.find(b => b.t === 'examcover'); const c = cv ? [plainText(cv.subj || cv.title || ''), plainText(cv.set || '')].filter(Boolean).join(' ') : '';
  return c || (S.cfg && [S.cfg.title !== 'กระดาษคำตอบ' ? S.cfg.title : '', S.cfg.sub].filter(Boolean).join(' ')) || (doc.cloud && doc.cloud.name) || 'ข้อสอบ';
}
function sndRow(ok, title, sub, act) { return `<div class="snr ${ok === 1 ? 'ok' : ok === 0 ? 'bad' : 'wn'}"><span class="si">${ok === 1 ? '✅' : ok === 0 ? '❌' : '⚠️'}</span><div class="sx"><b>${title}</b>${sub ? `<small>${sub}</small>` : ''}</div>${act || ''}</div>`; }
function sndRender() {
  const S = sndState(), box = $('#sndBody');
  if (SND.done) {
    box.innerHTML = `<div class="snd-done"><div style="font-size:46px">✅</div><b>ส่ง “${esc(SND.done)}” ไป Sir’Earth Class แล้ว</b>
      <ol><li>พิมพ์ข้อสอบ + <b>กระดาษคำตอบ</b> (ส่งออก PDF แล้วพิมพ์ตามปกติ)</li><li>สอบเสร็จ สแกนกระดาษคำตอบเป็น PDF — <b>ทุกห้องรวมไฟล์เดียวได้</b></li><li>เปิด Sir’Earth Class → <b>📝 ตรวจข้อสอบ</b> → เลือกชุดนี้ → เลือกวิชา → เลือกไฟล์สแกน</li></ol>
      <small>แก้ข้อสอบหรือเฉลยทีหลัง กดส่งอีกครั้งได้ ระบบแทนที่ชุดเดิมให้</small></div>`;
    $('#sndGo').style.display = 'none'; $('#sndCopy').style.display = 'none'; return;
  }
  $('#sndGo').style.display = ''; $('#sndCopy').style.display = '';
  let h = '';
  // 1) ข้อสอบ
  h += S.qs.length ? sndRow(1, `ข้อสอบ ${S.qs.length} ข้อ · รวม ${ptsTxt(S.total)} คะแนน`, [...new Set(S.qs.map(x => x.part).filter(Boolean))].join(' · '))
    : sndRow(2, 'ไม่พบบล็อก “ข้อ …” ที่มีคะแนนในไฟล์นี้', 'ส่งได้ แต่คะแนนต่อข้อจะใช้ค่าในกระดาษคำตอบ — แนะนำสร้างข้อสอบด้วย “สร้างชุดข้อสอบ”');
  // 2) กระดาษคำตอบ
  if (!S.sheet) h += sndRow(0, 'ยังไม่มีกระดาษคำตอบ', 'ระบบสร้างให้ท้ายข้อสอบ ตรงกับข้อ ชนิด และคะแนนในข้อสอบ', S.qs.length ? '<button class="tb primary" data-sa="add">➕ ใส่กระดาษคำตอบ</button>' : '');
  else if (!S.cfg.omr || S.warn.length) h += sndRow(0, !S.cfg.omr ? 'กระดาษคำตอบยังไม่ใช่แบบตรวจด้วยเครื่อง' : 'กระดาษคำตอบไม่ตรงกับข้อสอบ', (S.warn.length ? S.warn.map(esc).join(' · ') + ' · ' : '') + 'กดปรับแล้วพิมพ์กระดาษคำตอบใหม่', '<button class="tb primary" data-sa="fix">🔄 ปรับให้ตรง</button>');
  else h += sndRow(1, `กระดาษคำตอบตรวจด้วยเครื่อง ${S.sq.length} ข้อ`, (+S.cfg.id ? `ช่องเลขประจำตัว ${S.cfg.id} หลัก (แยกห้อง/คนให้อัตโนมัติ)` : '⚠️ ไม่มีช่องเลขประจำตัว — ต้องสแกนเรียงตามเลขที่ทีละห้อง') + (S.w ? ` · อัตนัย ${S.w} ข้อ ครูให้คะแนนบนจอ` : ''), +S.cfg.id ? '' : '<button class="tb" data-sa="id5">ใส่ช่องเลขประจำตัว</button>');
  // 3) เฉลย
  if (S.sheet && S.need.length) {
    const preview = S.need.slice(0, 60).map(q => `<span class="${S.key[q] ? '' : 'm'}"><i>${q}</i>${esc(S.key[q] || '?')}</span>`).join('') + (S.need.length > 60 ? '<span>…</span>' : '');
    h += sndRow(S.miss.length ? 2 : 1, S.miss.length ? `เฉลยยังขาด ${S.miss.length} ข้อ (มี ${S.need.length - S.miss.length}/${S.need.length})` : `เฉลยครบ ${S.need.length} ข้อ`,
      (S.src.length ? 'ดึงจาก ' + S.src.join(' + ') : 'ใส่ “ตารางสรุปคำตอบ” หรือ “หัวเฉลยข้อ” ในไฟล์นี้ · หรือเลือกไฟล์เฉลยที่แยกไว้ · หรือพิมพ์ด้านล่าง') + `<div class="snk">${preview}</div>`);
    h += `<div class="snx"><button class="tb" data-sa="pick">📄 เฉลยอยู่อีกไฟล์ (เลือกจาก Drive)</button><button class="tb" data-sa="type">✏️ พิมพ์/แก้เฉลย</button>${SND.extra ? '<button class="tb" data-sa="unpick">✕ ไม่ใช้ไฟล์ “' + esc(SND.extraName) + '”</button>' : ''}</div><div id="sndPick"></div>`;
    if (SND.typing) h += `<div class="snt"><label>คำตอบเรียงตามข้อ ${S.need[0]}–${S.need[S.need.length - 1]} (คั่นด้วย , · ข้อไม่รู้ใส่ - )</label><input type="text" id="sndKeyIn" value="${esc(S.need.map(q => S.key[q] || '-').join(','))}"><button class="tb primary" data-sa="typed">ใช้เฉลยนี้</button></div>`;
  } else if (S.sheet && !S.need.length) h += sndRow(1, 'อัตนัยทั้งหมด — ไม่ต้องใช้เฉลยปรนัย', 'ครูให้คะแนนบนจอใน Sir’Earth Class');
  // 4) ชื่อชุด
  h += `<div class="snt"><label>ชื่อชุดข้อสอบที่จะเห็นใน Sir’Earth Class</label><input type="text" id="sndName" value="${esc(sndTitle(S))}"></div>`;
  // บัญชี Drive
  const u = typeof CLD !== 'undefined' && CLD.user;
  h += `<div class="sna">${u && tokOk() ? '☁️ ส่งผ่าน Google Drive: ' + esc(u.email || '') + ' (ต้องเป็นบัญชีเดียวกับ Sir’Earth Class)' : u ? '☁️ ต้องยืนยัน Google Drive อีกครั้งตอนกดส่ง' : '☁️ กดส่งแล้วเข้าสู่ระบบ Google (บัญชีเดียวกับ Sir’Earth Class) ครั้งแรกครั้งเดียว'}</div>`;
  box.innerHTML = h;
  const ok = S.sheet && S.cfg.omr && !S.warn.length;
  $('#sndGo').disabled = !ok; $('#sndCopy').disabled = !ok;
}
function sndOpen() { SND.done = null; SND.typing = false; if (typeof fbLoad === 'function') fbLoad().then(() => { if ($('#dSend').classList.contains('open')) sndRender(); }).catch(() => { }); sndRender(); openDlg('#dSend'); }
function sndFixSheet(b) {
  const x = sheetFromDoc(b.cfg.secs); if (x.n) { b.cfg.secs = x.secs; if (x.total) b.cfg.score = ptsTxt(x.total); }
  b.cfg.omr = true; if (!(+b.cfg.id)) b.cfg.id = 5; rerender(b.id); changed(true);
}
$('#dSend').addEventListener('click', async e => {
  const a = e.target.closest('[data-sa]'); if (!a) return; const k = a.dataset.sa, S = sndState();
  if (k === 'add') {
    const x = sheetFromDoc([]); const cfg = Object.assign(AS_PRESETS.mc20(), { title: 'กระดาษคำตอบ', sub: sndTitle(S) === 'ข้อสอบ' ? '' : sndTitle(S), id: 5, lab: '(1)', omr: true, secs: x.secs, score: x.total ? ptsTxt(x.total) : undefined });
    const add = [newBlock('pagebreak'), newBlock('asheet', { cfg })]; const last = doc.blocks[doc.blocks.length - 1]; if (last && last.t === 'pagebreak') add.shift();
    doc.blocks.push(...add); renderAll(); paginate(); changed(true); toast('ใส่กระดาษคำตอบท้ายข้อสอบแล้ว ✓'); sndRender(); return;
  }
  if (k === 'fix') { sndFixSheet(S.sheet); toast('ปรับกระดาษคำตอบแล้ว — อย่าลืมพิมพ์กระดาษคำตอบใหม่'); sndRender(); return; }
  if (k === 'id5') { S.sheet.cfg.id = 5; rerender(S.sheet.id); changed(true); sndRender(); return; }
  if (k === 'type') { SND.typing = !SND.typing; sndRender(); if (SND.typing) $('#sndKeyIn').focus(); return; }
  if (k === 'typed') {
    const v = $('#sndKeyIn').value.split(','); SND.typed = {}; S.need.forEach((q, i) => { const x = (v[i] || '').trim(); if (x && x !== '-') SND.typed[q] = x; });
    SND.typing = false; sndRender(); return;
  }
  if (k === 'unpick') { SND.extra = null; SND.extraName = ''; sndRender(); return; }
  if (k === 'pick') {
    const box = $('#sndPick');
    if (!(CLD.user && tokOk())) { if (!(await clSignIn())) return; }
    if (!CLD.loaded) { box.innerHTML = '<div class="hint">กำลังโหลดรายการไฟล์…</div>'; await clRefresh(); }
    const L = CLD.docs.filter(d => !d.trash && (!doc.cloud || d.id !== doc.cloud.id)).sort((a, b) => (/เฉลย/.test(b.name) - /เฉลย/.test(a.name)) || b.ts - a.ts).slice(0, 40);
    box.innerHTML = '<div class="snp">' + (L.length ? L.map(d => `<button class="tb" data-sp="${esc(d.id)}">${/เฉลย/.test(d.name) ? '🔑 ' : '📄 '}${esc(d.name)}</button>`).join('') : '<div class="hint">ไม่พบไฟล์อื่นใน Drive</div>') + '</div>';
    return;
  }
});
$('#dSend').addEventListener('click', async e => {
  const p = e.target.closest('[data-sp]'); if (!p) return;
  try { p.disabled = true; const r = await clRead(p.dataset.sp); SND.extra = (r.data && r.data.blocks) || []; SND.extraName = r.meta.name;
    const n = Object.keys(sndKeysFrom(SND.extra).K).length; toast(n ? `ดึงคำตอบจาก “${r.meta.name}” ได้ ${n} ข้อ` : `ไม่พบคำตอบใน “${r.meta.name}” (ต้องมีตารางสรุปคำตอบ หรือหัวเฉลยข้อ)`); sndRender();
  } catch (er) { p.disabled = false; toast('เปิดไฟล์ไม่ได้: ' + (er.message || er)); }
});
function sndPack() {
  const S = sndState(), cfg = Object.assign({}, S.cfg, { omr: true });
  const mx = S.sq.length ? S.sq[S.sq.length - 1] : 0, ks = []; for (let q = 1; q <= mx; q++) ks.push(S.key[q] || '');
  cfg.key = ks.join(',');
  const raw = JSON.parse(decodeURIComponent(escape(atob(omrCode(cfg).slice(7)))));
  const name = ($('#sndName').value || '').trim() || 'ข้อสอบ';
  return { S, name, raw, file: { kind: 'npexam', v: 1, title: name, sent: new Date().toISOString(), dev: DEV, doc: doc.cloud ? { id: doc.cloud.id, name: doc.cloud.name } : null, n: S.sq.length, total: S.total, w: S.w, keyN: S.need.length - S.miss.length, need: S.need.length, exam: raw } };
}
$('#sndGo').onclick = async () => {
  if (SND.busy) return; const P = sndPack(), S = P.S;
  if (S.miss.length && !confirm(`ยังไม่มีเฉลย ${S.miss.length} ข้อ (${rangeTxt(S.miss.slice())})\nส่งไปก่อนแล้วใส่เฉลยใน Sir’Earth Class ภายหลังก็ได้ — ส่งเลยไหม?`)) return;
  SND.busy = true; const btn = $('#sndGo'); btn.textContent = 'กำลังส่ง…';
  try {
    await fbLoad(); if (!(CLD.user && tokOk())) { if (!(await clSignIn())) throw new Error('ยังไม่ได้เข้าสู่ระบบ Google'); }
    const md = { name: P.name + '.npexam.json', mimeType: 'application/json', properties: { npexam: '1', n: String(P.file.n), total: String(P.file.total), keyN: String(P.file.keyN), need: String(P.file.need), w: String(P.file.w), idd: String(+S.cfg.id || 0) }, appProperties: { np: 'exam' } };
    let id = doc.npSend && doc.npSend.id;
    if (id) { try { const m = await clMeta(id); if (m.trashed) id = ''; } catch (er) { id = ''; } }
    if (!id) md.parents = [await ensureRoot()];
    const f = await tpUpload(id || '', md, P.file);
    doc.npSend = { id: f.id, name: P.name, at: Date.now() }; changed(true);
    SND.done = P.name; sndRender(); toast('ส่งแล้ว ✓');
  } catch (er) { if (er && er.need) toast('กดส่งอีกครั้งเพื่อยืนยัน Google Drive'); else toast('ส่งไม่สำเร็จ: ' + (er.message || er)); }
  finally { SND.busy = false; btn.textContent = '📤 ส่งไป Sir’Earth Class'; }
};
$('#sndCopy').onclick = () => {
  const P = sndPack(), code = 'NPOMR1:' + btoa(unescape(encodeURIComponent(JSON.stringify(P.raw))));
  const done = () => toast('คัดลอกรหัสแล้ว — ใน Sir’Earth Class กด 📝 ตรวจข้อสอบ → 📋 วางรหัส');
  if (navigator.clipboard) navigator.clipboard.writeText(code).then(done, () => prompt('คัดลอกรหัสนี้:', code)); else prompt('คัดลอกรหัสนี้:', code);
};
$('#sndClose').onclick = () => closeDlg('#dSend');
$('#bSend').onclick = sndOpen;

/* ---------- ตัวสร้างชุดข้อสอบ ---------- */
let ebLogo = undefined;
function ebLook() {
  const s = doc.settings; ebLogo = s.logo; ebCLogo = s.clogo; $('#ebLogoImg').src = headLogo(s); $('#ebCLogoImg').src = coverLogo(null); $('#ebNoLogo').checked = !!s.nologo;
  $('#ebBrand').value = s.ft ?? 'Earth & Newton Education'; $('#ebAu').value = s.au || ''; $('#ebHl').value = ''; $('#ebHr').value = '';
  $('#ebTheme').innerHTML = Object.entries(THEMES).map(([k, t]) => `<option value="${k}"${s.theme === k ? ' selected' : ''}>${t.name}</option>`).join('') + `<option value="custom"${s.theme === 'custom' ? ' selected' : ''}>กำหนดเอง</option>`;
  const cu = s.custom || { dark: '#1f3864', brown: '#2e5597', gold: '#b8912f' }; $('#ebC1').value = cu.dark; $('#ebC2').value = cu.brown; $('#ebC3').value = cu.gold;
}
let ebCLogo;
$('#ebLogoBtn').onclick = () => pickLogo('โลโก้หัวกระดาษ', d => { ebLogo = d || undefined; $('#ebLogoImg').src = d || LOGOS.winged; });
$('#ebCLogoBtn').onclick = () => pickLogo('โลโก้บนปก / หัวเฉลย / กระดาษคำตอบ', d => { ebCLogo = d || undefined; $('#ebCLogoImg').src = d || LOGOS.round; });
$('#ebLogoIn').onchange = async e => { const f = e.target.files[0]; if (!f) return; ebLogo = await readImage(f); $('#ebLogoImg').src = ebLogo; e.target.value = ''; };

$('#ebUseC').onclick = () => { $('#ebTheme').value = 'custom'; };
function ebApplyLook(c) {
  const s = doc.settings; s.logo = ebLogo; if (!ebLogo) delete s.logo; s.clogo = ebCLogo; if (!ebCLogo) delete s.clogo; s.nologo = $('#ebNoLogo').checked || undefined;
  s.ft = $('#ebBrand').value; s.au = $('#ebAu').value; s.theme = $('#ebTheme').value; if (s.theme === 'custom') s.custom = { dark: $('#ebC1').value, brown: $('#ebC2').value, gold: $('#ebC3').value };
  s.hl = $('#ebHl').value.trim() || c.subj; s.hr = $('#ebHr').value.trim() || c.set;
  const brand = esc(s.ft || ''); doc.blocks.forEach(b => { if (b.t === 'examcover' || b.t === 'soltitle') b.brand = brand; if (b.t === 'asheet') { b.cfg.brand = s.ft; b.cfg.logo = !s.nologo; b.cfg.score = String(total(c.parts)); } if (b.t === 'examcover' && s.nologo) b.nologo = true; });
}
function openExamBuilder() {
  ebLook();
  $('#ebPreset').innerHTML = Object.entries(EXAM_PRESETS).map(([k, v]) => `<option value="${k}">${v.name}</option>`).join('') + '<option value="custom">กำหนดเองทั้งหมด</option>';
  ebLoad('alevel'); openDlg('#dExam');
}
function ebLoad(k) {
  const v = EXAM_PRESETS[k] || { subj: 'แบบทดสอบ', set: 'ชุดที่ 1', time: 60, lab: '(1)', parts: [{ n: 'ตอนที่ 1', c: 10, t: 'mc4', p: 1, w: 'small' }] };
  $('#ebSubj').value = v.subj; $('#ebSet').value = v.set; $('#ebTime').value = v.time; $('#ebLab').value = v.lab;
  $('#ebParts').innerHTML = v.parts.map(ebRow).join(''); ebSum();
}
function ebRow(q) {
  return `<div class="row ebr"><input type="text" data-k="n" value="${esc(q.n)}" style="width:200px" title="ชื่อตอน"><input type="number" data-k="c" value="${q.c}" min="1" max="120" style="width:58px" title="จำนวนข้อ"><label>ข้อ</label>
    <select data-k="t">${Object.entries(QTYPES).map(([t, n]) => `<option value="${t}"${q.t === t ? ' selected' : ''}>${n}</option>`).join('')}</select>
    <input class="dg" type="number" data-k="d" value="${q.d || 4}" min="1" max="6" style="width:46px" title="จำนวนหลัก"><input class="dc" type="number" data-k="f" value="${q.f || 2}" min="1" max="3" style="width:46px" title="ทศนิยม">
    <label>ข้อละ</label><input type="number" data-k="p" value="${q.p}" min="0" step="0.5" style="width:58px"><label>คะแนน</label>
    <select data-k="w">${Object.entries(WORKS).map(([w, [n]]) => `<option value="${w}"${q.w === w ? ' selected' : ''}>${n}</option>`).join('')}</select><button class="tb" data-del title="ลบตอนนี้">✕</button></div>`;
}
function ebRead() {
  const parts = $$('#ebParts .ebr').map(r => { const g = k => $(`[data-k="${k}"]`, r).value; return { n: g('n'), c: Math.max(1, +g('c') || 1), t: g('t'), d: +g('d') || 4, f: +g('f') || 2, p: +g('p') || 0, w: g('w') }; });
  return { subj: $('#ebSubj').value, set: $('#ebSet').value, time: +$('#ebTime').value || 60, lab: $('#ebLab').value, parts, cover: $('#ebCover').checked, sheet: $('#ebSheet').checked, partHead: $('#ebPartH').checked, q: $('#ebQ').checked };
}
function ebSum() {
  $$('#ebParts .ebr').forEach(r => { const t = $('[data-k="t"]', r).value; $('.dg', r).style.display = t === 'int' || t === 'dec' ? '' : 'none'; $('.dc', r).style.display = t === 'dec' ? '' : 'none'; });
  const c = ebRead(); $('#ebSum').textContent = `รวม ${count(c.parts)} ข้อ · ${ptsTxt(total(c.parts))} คะแนน · ${c.time} นาที`;
}
$('#ebPreset').onchange = e => ebLoad(e.target.value);
$('#ebParts').addEventListener('input', ebSum); $('#ebParts').addEventListener('change', ebSum); $('#ebTime').addEventListener('input', ebSum);
$('#ebParts').addEventListener('click', e => { if (e.target.closest('[data-del]')) { e.target.closest('.ebr').remove(); ebSum(); } });
$('#ebAdd').onclick = () => { $('#ebParts').insertAdjacentHTML('beforeend', ebRow({ n: 'ตอนที่ ' + ($$('#ebParts .ebr').length + 1), c: 5, t: 'mc4', p: 1, w: 'small' })); ebSum(); };
$('#ebCancel').onclick = () => closeDlg('#dExam');
function buildExam(c) {
  const B = []; if (c.cover) B.push(newBlock('examcover', defaultExamCover(c)));
  let k = 1;
  c.parts.forEach((q, pi) => {
    if (c.partHead) B.push(newBlock('part', { html: q.n, info: `ข้อ ${k}–${k + q.c - 1} · ${QTYPES[q.t]} · ข้อละ ${ptsTxt(q.p)} คะแนน` }));
    for (let i = 0; i < q.c; i++, k++) {
      B.push(newBlock('problem', { html: 'ข้อ ' + k, pts: ptsTxt(q.p) }));
      B.push(newBlock('given', { html: '' }));
      if (c.q) B.push(newBlock('question', { html: '' }));
      if (q.t === 'mc4' || q.t === 'mc5') B.push(newBlock('choices', { items: Array(q.t === 'mc4' ? 4 : 5).fill(''), cf: c.lab }));
      if (q.w !== 'none') B.push(newBlock('work', workOpts(q.w)));
    }
  });
  if (c.sheet && c.parts.some(q => q.t !== 'write')) { B.push(newBlock('asheet', { cfg: Object.assign(sheetFromParts(c.parts, c.lab), { sub: (c.subj + ' ' + c.set).trim() }) })); }
  return B;
}
$('#ebNew').onclick = () => {
  const c = ebRead(); closeDlg('#dExam');
  doc = { app: 'en-editor', v: 2, settings: Object.assign({}, doc.settings, { name: c.subj, hl: c.subj, hr: 'Earth & Newton Education', size: 'exam', bmq: true }), blocks: [] };
  doc.blocks = buildExam(c); ebApplyLook(c); curId = null; selSet = new Set(); applySettings(); renderAll(); changed(true); refreshInspector(); $('#scroller').scrollTop = 0;
  toast('สร้างชุดข้อสอบแล้ว · คลิกช่องว่างเพื่อพิมพ์โจทย์ได้เลย', 3600);
};
$('#ebAppend').onclick = () => { const c = ebRead(); closeDlg('#dExam'); insertBlocks(buildExam(c)); };

/* ===================== รูปแบบเฉลยข้อสอบแนวสมาคมฯ (ตามชุด L) ===================== */
function solTitleHTML() {
  return `<div class="b-soltitle"><img class="st-logo" alt=""><div class="st-txt"><div class="st-brand" contenteditable="true" data-f="brand"></div><div class="st-title" contenteditable="true" data-f="title" data-ph="เฉลยละเอียด"></div><div class="st-sub" contenteditable="true" data-f="sub" data-ph="ชื่อชุดข้อสอบ"></div></div></div>`;
}
function fillSolTitle(el, b) { const im = $('.st-logo', el); im.src = coverLogo(b); im.style.display = (doc.settings.nologo && !b.logo) ? 'none' : ''; }
/* ตารางสรุปคำตอบแบ่งตามตอน */
function keyTablePartsHTML(b) {
  const ks = String(b.key || '').split(/[,\s]+/).filter(Boolean); const per = +b.cols || 10;
  let h = `<div class="kp-cap" contenteditable="true" data-f="cap" data-ph="สรุปคำตอบ"></div><table class="kp">`;
  (b.parts || []).forEach(p => {
    const n = p.to - p.from + 1; const rows = Math.ceil(n / per);
    for (let r = 0; r < rows; r++) {
      const nums = [], ans = [];
      for (let j = 0; j < per; j++) { const q = p.from + r * per + j; nums.push(q <= p.to ? q : ''); ans.push(q <= p.to && ks[q - 1] !== undefined ? ks[q - 1] : ''); }
      h += `<tr class="kn">${r === 0 ? `<th rowspan="${rows * 2}">${esc(p.name)}<br><small>(${esc(String(p.pts))} คะแนน)</small></th>` : ''}${nums.map(x => `<td>${x}</td>`).join('')}</tr><tr class="ka">${ans.map(x => `<td>${x === '' ? '' : kx(texFor(String(x), {}))}</td>`).join('')}</tr>`;
    }
  });
  return `<div class="b-keyparts">${h}</table></div>`;
}
function solBlocks(n, pts, ans) {
  const Q = '<font color="#b8912f"><b>คำถาม</b></font> จงหา...';
  return [
    newBlock('solhead', { num: 'ข้อ ' + n, pts: String(pts), ans: ans || '' }),
    newBlock('box', { kind: 'recap', title: '', html: 'ทวนโจทย์...<br>' + Q }),
    newBlock('h3', { tone: 'gold', html: 'แนวคิดหลัก' }), newBlock('para', { html: '' }),
    newBlock('h3', { tone: 'gold', html: 'สิ่งที่โจทย์ให้มาและสิ่งที่ต้องหา' }), newBlock('para', { html: '• ...<br>• ...' }),
    newBlock('h3', { tone: 'navy', html: 'ขั้นที่ 1 ...' }), newBlock('para', { html: '' }),
    newBlock('h3', { tone: 'navy', html: 'ขั้นที่ 2 ...' }), newBlock('para', { html: '' }),
    newBlock('h3', { tone: 'navy', html: 'ขั้นที่ 3 ...' }), newBlock('para', { html: '' }),
    newBlock('box', { kind: 'caution2', title: 'ข้อควรระวัง', html: '' }),
    newBlock('h3', { tone: 'teal', html: 'ตรวจคำตอบ' }), newBlock('para', { html: '' }),
    newBlock('answer', { v: 'box', html: ans || '' }),
  ];
}
function buildSolution(c) {
  let k = 1; const parts = c.parts.map(q => { const p = { name: q.n.replace(/\s.*$/, '') === 'ตอนที่' ? q.n.split(' ').slice(0, 2).join(' ') : q.n, pts: ptsTxt(q.p), from: k, to: k + q.c - 1 }; k += q.c; return p; });
  const B = [newBlock('soltitle', { brand: 'Earth &amp; Newton Education', title: 'เฉลยละเอียด', sub: esc((c.subj + ' · ' + c.set).trim()) }),
    newBlock('keytable', { mode: 'parts', parts, key: '', cols: 10, cap: 'สรุปคำตอบ (ตรงกับที่ระบายในกระดาษคำตอบ)' }),
    newBlock('para', { html: '<font color="#8a7d73">เฉลยแต่ละข้อขึ้นหน้าใหม่ และเรียงเป็น แนวคิดหลัก → สิ่งที่โจทย์ให้มา → ขั้นตอนการคิดทีละขั้น → ข้อควรระวัง → ตรวจคำตอบ → คำตอบ คำตอบที่ระบายให้เติมศูนย์นำหน้าให้ครบสี่หลัก (เช่น 80 → 0080)</font>' })];
  k = 1; c.parts.forEach(q => { for (let i = 0; i < q.c; i++, k++) B.push(...solBlocks(k, ptsTxt(q.p))); });
  return B;
}
$('#ebSol').onclick = () => {
  const c = ebRead(); closeDlg('#dExam');
  doc = { app: 'en-editor', v: 2, settings: Object.assign({}, doc.settings, { name: 'เฉลย ' + c.subj, size: 'exam', bmq: false }), blocks: [] };
  doc.blocks = buildSolution(c); const hlGiven = $('#ebHl').value.trim(); ebApplyLook(c); if (!hlGiven) doc.settings.hl = 'เฉลยละเอียด · ' + doc.settings.hl; curId = null; selSet = new Set(); applySettings(); renderAll(); changed(true); refreshInspector(); $('#scroller').scrollTop = 0;
  toast('สร้างเฉลยแล้ว · ใส่คำตอบในตารางสรุปได้ที่แผงรูปแบบด้านขวา', 4000);
};

/* ---------- จัดหน้าข้อสอบ: กำหนดข้อต่อหน้าทีละข้อ ---------- */
function examItems() {
  const out = []; const B = doc.blocks;
  B.forEach((b, i) => { if (b.t !== 'problem') return; let w = null; for (let j = i + 1; j < B.length && B[j].t !== 'problem' && (GROUP_MEMBERS.has(B[j].t)); j++) if (B[j].t === 'work') w = B[j];
    const g = B[i + 1] && B[i + 1].t === 'given' ? plainText(B[i + 1].html) : ''; out.push({ p: b, w, txt: g }); });
  return out;
}
function wKey(w) { if (!w) return 'none'; if (w.full) return 'full'; if (w.share) return { 5: 'q5', 4: 'q4', 3: 'third', 2: 'half' }[w.share] || 'third'; return 'fix'; }
function openPagePlan() {
  const items = examItems(); if (!items.length) { toast('ยังไม่มีข้อในเอกสาร'); return; }
  const opts = k => Object.entries(WORKS).map(([v, [n]]) => `<option value="${v}"${k === v ? ' selected' : ''}>${n}</option>`).join('') + `<option value="fix"${k === 'fix' ? ' selected' : ''}>กำหนดความสูงเอง</option>`;
  $('#ppList').innerHTML = items.map((it, i) => { const k = wKey(it.w); return `<div class="row ppr" data-i="${i}"><b style="width:80px">${esc(plainText(it.p.html))}</b><span class="pptx">${esc(it.txt.slice(0, 60) || '(ยังไม่มีโจทย์)')}</span><select>${opts(k)}</select><input type="number" min="10" max="250" step="5" value="${it.w ? it.w.h || 40 : 40}" style="width:64px;${k === 'fix' ? '' : 'display:none'}" title="มม."></div>`; }).join('');
  $('#ppAll').innerHTML = opts('third').replace('<option value="fix">กำหนดความสูงเอง</option>', '');
  openDlg('#dPlan');
}
$('#ppList').addEventListener('change', e => { const r = e.target.closest('.ppr'); if (r && e.target.tagName === 'SELECT') $('input', r).style.display = e.target.value === 'fix' ? '' : 'none'; });
$('#ppApplyAll').onclick = () => { const v = $('#ppAll').value; $$('#ppList .ppr').forEach(r => { if (!$('input[type=checkbox]', r) || true) { $('select', r).value = v; $('input', r).style.display = 'none'; } }); };
$('#ppOk').onclick = () => {
  const items = examItems();
  $$('#ppList .ppr').forEach(r => {
    const it = items[+r.dataset.i]; if (!it) return; const v = $('select', r).value; const i = idx(it.p.id);
    let w = it.w;
    if (v === 'none') { if (w) doc.blocks.splice(idx(w.id), 1); return; }
    if (!w) { let j = i + 1; while (j < doc.blocks.length && GROUP_MEMBERS.has(doc.blocks[j].t) && doc.blocks[j].t !== 'problem') j++; w = newBlock('work'); doc.blocks.splice(j, 0, w); }
    ['share', 'full', 'wl'].forEach(k => delete w[k]);
    if (v === 'fix') w.h = +$('input', r).value || 40; else Object.assign(w, JSON.parse(JSON.stringify(workOpts(v))));
  });
  closeDlg('#dPlan'); renderAll(); changed(true); toast('จัดหน้าใหม่แล้ว');
};

