'use strict';
/* ===================== ตัวแก้สมการ (แบบ CodeCogs) ===================== */
/* ช่องว่างในแม่แบบเขียนเป็น {} · หลังแทรก เคอร์เซอร์ไปอยู่ในช่องแรก · กด Tab ไปช่องถัดไป */
let mathTarget = null; // span ที่กำลังแก้ หรือ null = แทรกใหม่
let mathCb = null; // เรียกกลับเมื่อใช้ตัวแก้สมการกับช่องฟังก์ชันของรูป
const MXCAT = [
  ['พื้นฐาน', '+\\,\\times', [
    ['+', '+'], ['-', '-'], ['\\times', '\\times '], ['\\div', '\\div '], ['\\pm', '\\pm '], ['\\mp', '\\mp '], ['\\cdot', '\\cdot '], ['\\ast', '\\ast '],
    ['=', '='], ['\\ne', '\\ne '], ['\\approx', '\\approx '], ['\\equiv', '\\equiv '], ['<', '<'], ['>', '>'], ['\\le', '\\le '], ['\\ge', '\\ge '],
    ['\\ll', '\\ll '], ['\\gg', '\\gg '], ['\\propto', '\\propto '], ['\\infty', '\\infty '], ['x^{\\circ}', '^{\\circ}'], ["x'", "'"], ['\\%', '\\%'],
    ['\\therefore', '\\therefore '], ['\\because', '\\because '], ['\\ldots', '\\ldots '], ['\\cdots', '\\cdots '], ['\\vdots', '\\vdots '], ['\\ddots', '\\ddots '],
    ['a\\,b', '\\,'], ['a\\;\\;b', '\\quad '],
  ]],
  ['เศษส่วน ราก กำลัง', '\\frac{a}{b}', [
    ['\\dfrac{\\square}{\\square}', '\\frac{}{}'], ['\\tfrac{\\square}{\\square}', '\\tfrac{}{}'], ['\\square/\\square', '{}/{}'], ['\\square\\dfrac{\\square}{\\square}', '{}\\frac{}{}'],
    ['\\cfrac{1}{1+\\cfrac{1}{\\square}}', '\\cfrac{}{}'], ['\\sqrt{\\square}', '\\sqrt{}'], ['\\sqrt[\\square]{\\square}', '\\sqrt[]{}'], ['\\sqrt[3]{\\square}', '\\sqrt[3]{}'],
    ['\\square^{\\square}', '{}^{}'], ['\\square_{\\square}', '{}_{}'], ['\\square_{\\square}^{\\square}', '{}_{}^{}'], ['{}^{\\square}_{\\square}\\square', '{}^{}_{}{}'],
    ['x^{2}', '^{2}'], ['x^{3}', '^{3}'], ['x^{-1}', '^{-1}'], ['e^{\\square}', 'e^{}'], ['10^{\\square}', '10^{}'], ['\\binom{\\square}{\\square}', '\\binom{}{}'],
  ]],
  ['วงเล็บ', '\\left(\\square\\right)', [
    ['\\left(\\square\\right)', '\\left( {} \\right)'], ['\\left[\\square\\right]', '\\left[ {} \\right]'], ['\\left\\{\\square\\right\\}', '\\left\\{ {} \\right\\}'],
    ['\\left|\\square\\right|', '\\left| {} \\right|'], ['\\left\\|\\square\\right\\|', '\\left\\| {} \\right\\|'], ['\\left\\langle\\square\\right\\rangle', '\\left\\langle {} \\right\\rangle'],
    ['\\left\\lfloor\\square\\right\\rfloor', '\\left\\lfloor {} \\right\\rfloor'], ['\\left\\lceil\\square\\right\\rceil', '\\left\\lceil {} \\right\\rceil'],
    ['\\left(\\square\\right]', '\\left( {} \\right]'], ['\\left[\\square\\right)', '\\left[ {} \\right)'], ['\\left.\\square\\right|_{a}^{b}', '\\left. {} \\right|_{}^{}'],
    ['\\begin{cases}\\square & \\square\\\\ \\square & \\square\\end{cases}', '\\begin{cases} {} & {} \\\\ {} & {} \\end{cases}'],
    ['\\left\\{\\begin{aligned}\\square\\\\\\square\\end{aligned}\\right.', '\\left\\{ \\begin{aligned} {} \\\\ {} \\end{aligned} \\right.'],
    ['\\overbrace{\\square}^{\\square}', '\\overbrace{}^{}'], ['\\underbrace{\\square}_{\\square}', '\\underbrace{}_{}'],
  ]],
  ['แคลคูลัส', '\\int', [
    ['\\int', '\\int '], ['\\int_{\\square}^{\\square}', '\\int_{}^{} '], ['\\int\\square\\,dx', '\\int {}\\,dx'], ['\\int_{a}^{b}\\square\\,dx', '\\int_{}^{} {}\\,dx'],
    ['\\iint', '\\iint '], ['\\iiint', '\\iiint '], ['\\oint', '\\oint '], ['\\sum', '\\sum '], ['\\sum_{\\square}^{\\square}', '\\sum_{}^{} '], ['\\sum_{k=1}^{n}', '\\sum_{k=1}^{n} '],
    ['\\prod_{\\square}^{\\square}', '\\prod_{}^{} '], ['\\lim_{\\square\\to\\square}', '\\lim_{{} \\to {}} '], ['\\lim_{x\\to\\infty}', '\\lim_{x \\to \\infty} '], ['\\lim_{h\\to 0}', '\\lim_{h \\to 0} '],
    ['\\dfrac{d}{dx}', '\\frac{d}{dx}'], ['\\dfrac{dy}{dx}', '\\frac{dy}{dx}'], ['\\dfrac{d\\square}{d\\square}', '\\frac{d{}}{d{}}'], ['\\dfrac{d^{2}y}{dx^{2}}', '\\frac{d^{2}y}{dx^{2}}'],
    ['\\dfrac{\\partial\\square}{\\partial\\square}', '\\frac{\\partial {}}{\\partial {}}'], ["f'(x)", "f'(x)"], ["f''(x)", "f''(x)"], ['\\Delta', '\\Delta '], ['\\nabla', '\\nabla '],
    ['\\left.\\square\\right|_{a}^{b}', '\\left. {} \\right|_{}^{}'], ['\\bigcup_{\\square}^{\\square}', '\\bigcup_{}^{} '], ['\\bigcap_{\\square}^{\\square}', '\\bigcap_{}^{} '],
  ]],
  ['ฟังก์ชัน', '\\sin', [
    ['\\sin', '\\sin '], ['\\cos', '\\cos '], ['\\tan', '\\tan '], ['\\cot', '\\cot '], ['\\sec', '\\sec '], ['\\csc', '\\csc '], ['\\sin^{2}', '\\sin^{2} '], ['\\sin^{-1}', '\\sin^{-1} '],
    ['\\arcsin', '\\arcsin '], ['\\arccos', '\\arccos '], ['\\arctan', '\\arctan '], ['\\log', '\\log '], ['\\log_{\\square}', '\\log_{} '], ['\\ln', '\\ln '], ['\\exp', '\\exp '],
    ['\\max', '\\max '], ['\\min', '\\min '], ['f(x)', 'f(x)'], ['f^{-1}(x)', 'f^{-1}(x)'], ['(f\\circ g)(x)', '(f\\circ g)(x)'], ['\\operatorname{\\square}', '\\operatorname{}'],
    ['\\theta', '\\theta '], ['\\pi', '\\pi '],
  ]],
  ['เซต ตรรกศาสตร์', '\\cup', [
    ['\\in', '\\in '], ['\\notin', '\\notin '], ['\\ni', '\\ni '], ['\\subset', '\\subset '], ['\\subseteq', '\\subseteq '], ['\\not\\subset', '\\not\\subset '], ['\\supset', '\\supset '], ['\\supseteq', '\\supseteq '],
    ['\\cup', '\\cup '], ['\\cap', '\\cap '], ['\\setminus', '\\setminus '], ['-', '-'], ['\\varnothing', '\\varnothing '], ['\\emptyset', '\\emptyset '], ["A'", "'"], ['\\overline{A}', '\\overline{}'],
    ['\\{\\square\\}', '\\{ {} \\}'], ['\\{x\\mid\\square\\}', '\\left\\{ x \\;\\middle|\\; {} \\right\\}'], ['\\mid', '\\mid '], ['n(A)', 'n()'],
    ['\\mathbb{N}', '\\mathbb{N}'], ['\\mathbb{Z}', '\\mathbb{Z}'], ['\\mathbb{Q}', '\\mathbb{Q}'], ['\\mathbb{R}', '\\mathbb{R}'], ['\\mathbb{C}', '\\mathbb{C}'], ['\\mathbb{R}^{+}', '\\mathbb{R}^{+}'],
    ['\\wedge', '\\wedge '], ['\\vee', '\\vee '], ['\\sim', '\\sim '], ['\\neg', '\\neg '], ['\\to', '\\to '], ['\\leftrightarrow', '\\leftrightarrow '], ['\\Rightarrow', '\\Rightarrow '], ['\\Leftrightarrow', '\\Leftrightarrow '],
    ['\\forall', '\\forall '], ['\\exists', '\\exists '], ['\\nexists', '\\nexists '], ['\\equiv', '\\equiv '],
  ]],
  ['ลูกศร สัญลักษณ์บน', '\\vec{v}', [
    ['\\vec{\\square}', '\\vec{}'], ['\\overrightarrow{\\square}', '\\overrightarrow{}'], ['\\overleftarrow{\\square}', '\\overleftarrow{}'], ['\\overleftrightarrow{\\square}', '\\overleftrightarrow{}'],
    ['\\overline{\\square}', '\\overline{}'], ['\\underline{\\square}', '\\underline{}'], ['\\hat{\\square}', '\\hat{}'], ['\\widehat{\\square}', '\\widehat{}'], ['\\bar{\\square}', '\\bar{}'],
    ['\\dot{\\square}', '\\dot{}'], ['\\ddot{\\square}', '\\ddot{}'], ['\\tilde{\\square}', '\\tilde{}'], ['\\overset{\\frown}{\\square}', '\\overset{\\frown}{}'], ['\\overset{\\square}{\\square}', '\\overset{}{}'],
    ['\\underset{\\square}{\\square}', '\\underset{}{}'], ['\\xrightarrow{\\square}', '\\xrightarrow{}'], ['\\rightarrow', '\\rightarrow '], ['\\leftarrow', '\\leftarrow '], ['\\leftrightarrow', '\\leftrightarrow '],
    ['\\uparrow', '\\uparrow '], ['\\downarrow', '\\downarrow '], ['\\mapsto', '\\mapsto '], ['\\longrightarrow', '\\longrightarrow '], ['\\Rightarrow', '\\Rightarrow '], ['\\rightleftharpoons', '\\rightleftharpoons '],
  ]],
  ['เรขาคณิต', '\\angle', [
    ['\\angle', '\\angle '], ['\\measuredangle', '\\measuredangle '], ['\\triangle', '\\triangle '], ['\\square', '\\square '], ['\\parallel', '\\parallel '], ['\\perp', '\\perp '],
    ['\\cong', '\\cong '], ['\\sim', '\\sim '], ['\\simeq', '\\simeq '], ['90^{\\circ}', '^{\\circ}'], ['\\overline{AB}', '\\overline{AB}'], ['\\overleftrightarrow{AB}', '\\overleftrightarrow{AB}'],
    ['\\overrightarrow{AB}', '\\overrightarrow{AB}'], ['\\overset{\\frown}{AB}', '\\overset{\\frown}{AB}'], ['\\angle ABC', '\\angle ABC'], ['\\triangle ABC', '\\triangle ABC'], ['\\odot', '\\odot '], ['\\pi r^{2}', '\\pi r^{2}'],
  ]],
  ['การนับ สถิติ', 'n!', [
    ['n!', '!'], ['P_{n,r}', 'P_{n,r}'], ['P_{\\square,\\square}', 'P_{{},{}}'], ['C_{n,r}', 'C_{n,r}'], ['\\binom{n}{r}', '\\binom{n}{r}'], ['\\binom{\\square}{\\square}', '\\binom{}{}'],
    ['\\dfrac{n!}{r!(n-r)!}', '\\frac{n!}{r!(n-r)!}'], ['P(E)', 'P(E)'], ['P(A\\mid B)', 'P(A\\mid B)'], ["P(A')", "P(A')"], ['n(S)', 'n(S)'], ['n(A\\cup B)', 'n(A\\cup B)'],
    ['\\dfrac{n(E)}{n(S)}', '\\frac{n(E)}{n(S)}'], ['\\bar{x}', '\\bar{x}'], ['\\mu', '\\mu '], ['\\sigma', '\\sigma '], ['\\sigma^{2}', '\\sigma^{2}'], ['s^{2}', 's^{2}'],
    ['\\sum_{i=1}^{n}x_{i}', '\\sum_{i=1}^{n} x_{i}'], ['\\dfrac{\\sum x}{N}', '\\frac{\\sum x}{N}'], ['Q_{1}', 'Q_{1}'], ['a_{n}', 'a_{n}'], ['a_{n-1}', 'a_{n-1}'], ['S_{n}', 'S_{n}'],
  ]],
  ['เมทริกซ์', '\\begin{bmatrix}a&b\\\\c&d\\end{bmatrix}', [
    ['\\begin{bmatrix}\\square&\\square\\\\\\square&\\square\\end{bmatrix}', '\\begin{bmatrix} {} & {} \\\\ {} & {} \\end{bmatrix}'],
    ['\\begin{pmatrix}\\square&\\square\\\\\\square&\\square\\end{pmatrix}', '\\begin{pmatrix} {} & {} \\\\ {} & {} \\end{pmatrix}'],
    ['\\begin{vmatrix}\\square&\\square\\\\\\square&\\square\\end{vmatrix}', '\\begin{vmatrix} {} & {} \\\\ {} & {} \\end{vmatrix}'],
    ['\\begin{bmatrix}\\square&\\square&\\square\\\\\\square&\\square&\\square\\\\\\square&\\square&\\square\\end{bmatrix}', '\\begin{bmatrix} {} & {} & {} \\\\ {} & {} & {} \\\\ {} & {} & {} \\end{bmatrix}'],
    ['\\begin{vmatrix}\\square&\\square&\\square\\\\\\square&\\square&\\square\\\\\\square&\\square&\\square\\end{vmatrix}', '\\begin{vmatrix} {} & {} & {} \\\\ {} & {} & {} \\\\ {} & {} & {} \\end{vmatrix}'],
    ['\\begin{bmatrix}\\square\\\\\\square\\end{bmatrix}', '\\begin{bmatrix} {} \\\\ {} \\end{bmatrix}'], ['\\begin{bmatrix}\\square&\\square\\end{bmatrix}', '\\begin{bmatrix} {} & {} \\end{bmatrix}'],
    ['\\left[\\begin{array}{cc|c}\\square&\\square&\\square\\\\\\square&\\square&\\square\\end{array}\\right]', '\\left[ \\begin{array}{cc|c} {} & {} & {} \\\\ {} & {} & {} \\end{array} \\right]'],
    ['\\begin{bmatrix}1&0\\\\0&1\\end{bmatrix}', '\\begin{bmatrix} 1 & 0 \\\\ 0 & 1 \\end{bmatrix}'], ['A^{T}', '^{T}'], ['A^{-1}', '^{-1}'], ['\\det(A)', '\\det()'], ['\\operatorname{adj}A', '\\operatorname{adj}'],
    ['a_{ij}', 'a_{ij}'], ['\\left[a_{ij}\\right]_{m\\times n}', '\\left[ a_{ij} \\right]_{m\\times n}'],
  ]],
  ['กรีก', '\\alpha', [
    ...'alpha beta gamma delta epsilon varepsilon zeta eta theta vartheta iota kappa lambda mu nu xi pi rho sigma tau upsilon phi varphi chi psi omega'.split(' ').map(g => ['\\' + g, '\\' + g + ' ']),
    ...'Gamma Delta Theta Lambda Xi Pi Sigma Phi Psi Omega'.split(' ').map(g => ['\\' + g, '\\' + g + ' ']),
  ]],
  ['เวกเตอร์', '\\vec{u}', [
    ['\\vec{u}', '\\vec{u}'], ['\\vec{\\square}', '\\vec{}'], ['\\overrightarrow{AB}', '\\overrightarrow{AB}'], ['\\overrightarrow{\\square}', '\\overrightarrow{}'], ['\\left|\\vec{u}\\right|', '\\left| \\vec{u} \\right|'], ['\\hat{\\imath}', '\\hat{\\imath}'], ['\\hat{\\jmath}', '\\hat{\\jmath}'], ['\\hat{k}', '\\hat{k}'],
    ['\\begin{bmatrix}\\square\\\\\\square\\end{bmatrix}', '\\begin{bmatrix} {} \\\\ {} \\end{bmatrix}'], ['\\begin{bmatrix}\\square\\\\\\square\\\\\\square\\end{bmatrix}', '\\begin{bmatrix} {} \\\\ {} \\\\ {} \\end{bmatrix}'], ['a\\hat{\\imath}+b\\hat{\\jmath}', '{}\\hat{\\imath} + {}\\hat{\\jmath}'], ['a\\hat{\\imath}+b\\hat{\\jmath}+c\\hat{k}', '{}\\hat{\\imath} + {}\\hat{\\jmath} + {}\\hat{k}'],
    ['\\vec{u}\\cdot\\vec{v}', '\\vec{u}\\cdot\\vec{v}'], ['\\vec{u}\\times\\vec{v}', '\\vec{u}\\times\\vec{v}'], ['\\sqrt{a^{2}+b^{2}}', '\\sqrt{{}^{2}+{}^{2}}'], ['\\sqrt{a^{2}+b^{2}+c^{2}}', '\\sqrt{{}^{2}+{}^{2}+{}^{2}}'],
    ['\\cos\\theta=\\dfrac{\\vec{u}\\cdot\\vec{v}}{\\left|\\vec{u}\\right|\\left|\\vec{v}\\right|}', '\\cos\\theta = \\frac{\\vec{u}\\cdot\\vec{v}}{\\left|\\vec{u}\\right|\\left|\\vec{v}\\right|}'], ['\\vec{u}\\parallel\\vec{v}', '\\vec{u}\\parallel\\vec{v}'], ['\\vec{u}\\perp\\vec{v}', '\\vec{u}\\perp\\vec{v}'], ['\\vec{0}', '\\vec{0}'],
    ['\\begin{vmatrix}\\hat{\\imath}&\\hat{\\jmath}&\\hat{k}\\\\a_1&a_2&a_3\\\\b_1&b_2&b_3\\end{vmatrix}', '\\begin{vmatrix} \\hat{\\imath} & \\hat{\\jmath} & \\hat{k} \\\\ {} & {} & {} \\\\ {} & {} & {} \\end{vmatrix}'],
  ]],
  ['เรขาคณิตวิเคราะห์ ภาคตัดกรวย', 'x^2+y^2', [
    ['\\sqrt{(x_2-x_1)^{2}+(y_2-y_1)^{2}}', '\\sqrt{(x_2-x_1)^{2}+(y_2-y_1)^{2}}', 'ระยะทาง'], ['\\left(\\dfrac{x_1+x_2}{2},\\dfrac{y_1+y_2}{2}\\right)', '\\left(\\frac{x_1+x_2}{2}, \\frac{y_1+y_2}{2}\\right)', 'จุดกึ่งกลาง'], ['m=\\dfrac{y_2-y_1}{x_2-x_1}', 'm = \\frac{y_2-y_1}{x_2-x_1}', 'ความชัน'],
    ['y-y_1=m(x-x_1)', 'y-y_1 = m(x-x_1)', 'จุด-ความชัน'], ['y=mx+c', 'y = mx + c', 'เส้นตรง'], ['Ax+By+C=0', 'Ax + By + C = 0', 'รูปทั่วไป'], ['d=\\dfrac{|Ax_1+By_1+C|}{\\sqrt{A^{2}+B^{2}}}', 'd = \\frac{\\left|Ax_1+By_1+C\\right|}{\\sqrt{A^{2}+B^{2}}}', 'ระยะจุดถึงเส้น'],
    ['(x-h)^{2}+(y-k)^{2}=r^{2}', '(x-h)^{2}+(y-k)^{2}=r^{2}', 'วงกลม'], ['x^{2}+y^{2}+Dx+Ey+F=0', 'x^{2}+y^{2}+Dx+Ey+F=0', 'วงกลมทั่วไป'],
    ['(y-k)^{2}=4c(x-h)', '(y-k)^{2}=4c(x-h)', 'พาราโบลาตะแคง'], ['(x-h)^{2}=4c(y-k)', '(x-h)^{2}=4c(y-k)', 'พาราโบลาหงาย/คว่ำ'],
    ['\\dfrac{(x-h)^{2}}{a^{2}}+\\dfrac{(y-k)^{2}}{b^{2}}=1', '\\frac{(x-h)^{2}}{a^{2}}+\\frac{(y-k)^{2}}{b^{2}}=1', 'วงรี'], ['\\dfrac{(x-h)^{2}}{a^{2}}-\\dfrac{(y-k)^{2}}{b^{2}}=1', '\\frac{(x-h)^{2}}{a^{2}}-\\frac{(y-k)^{2}}{b^{2}}=1', 'ไฮเพอร์โบลา'],
    ['c^{2}=a^{2}-b^{2}', 'c^{2}=a^{2}-b^{2}', 'วงรี'], ['c^{2}=a^{2}+b^{2}', 'c^{2}=a^{2}+b^{2}', 'ไฮเพอร์โบลา'], ['e=\\dfrac{c}{a}', 'e=\\frac{c}{a}', 'ความเยื้องศูนย์กลาง'], ['y=\\pm\\dfrac{b}{a}x', 'y = \\pm\\frac{b}{a}x', 'เส้นกำกับ'],
    ['F(c,0)', 'F(c, 0)', 'โฟกัส'], ['x=-c', 'x = -c', 'ไดเรกตริกซ์'],
  ]],
  ['การหาร', '\\div', 'DIV'],
  ['ตัวอักษร กรอบ', '\\mathbb{R}', [
    ['\\mathbb{R}', '\\mathbb{}', 'ตัวทึบคู่'], ['\\mathrm{dx}', '\\mathrm{}', 'ตัวตรง'], ['\\mathbf{v}', '\\mathbf{}', 'ตัวหนา'], ['\\boldsymbol{\\alpha}', '\\boldsymbol{}', 'หนาเอียง'], ['\\mathcal{L}', '\\mathcal{}', 'ตัวเขียน'],
    ['\\text{abc}', '\\text{}', 'ข้อความ'], ['\\boxed{x=2}', '\\boxed{}', 'กรอบ'], ['\\cancel{x}', '\\cancel{}', 'ขีดฆ่า'], ['\\bcancel{x}', '\\bcancel{}', 'ขีดฆ่า'],
    ['\\color{#c0392b}{x}', '\\color{#c0392b}{}', 'แดง'], ['\\color{#1f4e9a}{x}', '\\color{#1f4e9a}{}', 'น้ำเงิน'], ['\\color{#2e7d32}{x}', '\\color{#2e7d32}{}', 'เขียว'],
    ['\\colorbox{#fff3a3}{$x$}', '\\colorbox{#fff3a3}{$ {} $}', 'ไฮไลต์'],
    ['a\\,b', '\\,', 'เว้นเล็ก'], ['a\\;b', '\\;', 'เว้นกลาง'], ['a\\quad b', '\\quad ', 'เว้น 1 ช่อง'], ['a\\qquad b', '\\qquad ', 'เว้น 2 ช่อง'],
  ]],
];
const MXSWATCH = ['', '#222222', '#c0392b', '#1f4e9a', '#2e7d32', '#d9682b', '#7b3fa0', '#b8860b', '#713408'];
let mxCat = 0;
function kx(tex, opt = {}) { try { return katex.renderToString(tex, Object.assign({ throwOnError: false, strict: false }, opt)); } catch (e) { return esc(tex); } }
function buildPalette() {
  const tabs = $('#mxTabs');
  tabs.innerHTML = MXCAT.map(([n, icon], i) => `<button data-i="${i}" title="${n}"><span class="ic">${kx(icon)}</span><span class="nm">${n}</span></button>`).join('');
  tabs.onclick = e => { const b = e.target.closest('button'); if (!b) return; mxCat = +b.dataset.i; showCat(); };
  $('#mxBtns').onclick = e => { const b = e.target.closest('button'); if (!b) return; if (b.dataset.div) { closeDlg('#dMath'); openDivision(null, b.dataset.div); return; } mxInsert(b.dataset.tex); };
  $('#mxBtns').addEventListener('mousedown', e => e.preventDefault());
  tabs.addEventListener('mousedown', e => e.preventDefault());
  $('#mxCol').innerHTML = MXSWATCH.map(c => `<button class="sw${c ? '' : ' none'}" data-c="${c}" title="${c || 'ตามข้อความ'}" style="background:${c || '#fff'}"></button>`).join('') + '<input type="color" id="mxColPick" title="เลือกสีเอง">';
  $('#mxCol').onclick = e => { const b = e.target.closest('button'); if (!b) return; setMxCol(b.dataset.c); };
  $('#mxColPick').oninput = e => setMxCol(e.target.value);
  showCat();
}
let mxColor = '';
function setMxCol(c) { mxColor = c; $$('#mxCol .sw').forEach(b => b.classList.toggle('on', b.dataset.c === c)); mxPreview(); }
function showCat() {
  $$('#mxTabs button').forEach((b, i) => b.classList.toggle('on', i === mxCat));
  const [, , items] = MXCAT[mxCat];
  if (items === 'DIV') {
    $('#mxBtns').innerHTML = [['long', 'การหารยาว', '7865\\div 23'], ['poly', 'การหารพหุนามแบบยาว', '\\dfrac{x^{3}-2x^{2}+4}{x-3}'], ['synth', 'การหารสังเคราะห์', '\\begin{array}{c|ccc}2&1&-3&2\\\\ \\hline &1&-1&\\boxed{0}\\end{array}']]
      .map(([k, n, t]) => `<button class="dvbtn" data-div="${k}">${kx(t)}<small>${n}</small></button>`).join('') +
      '<div class="hint" style="width:100%">การหารจะแทรกเป็นกรอบแยกต่อจากบรรทัดที่คลิกไว้ โปรแกรมคิดผลและเขียนวิธีทำให้ · ดับเบิลคลิกที่รูปเพื่อแก้ตัวเลข</div>';
    $('#mxMat').style.display = 'none'; return;
  }
  $('#mxBtns').innerHTML = items.map(([show, ins, cap]) => `<button data-tex="${esc(ins)}" title="${esc(cap ? cap + ' · ' : '')}${esc(ins.replace(/\{\}/g, '{ }'))}">${kx(show, { displayMode: false })}${cap ? `<small>${esc(cap)}</small>` : ''}</button>`).join('');
  $('#mxMat').style.display = MXCAT[mxCat][0] === 'เมทริกซ์' ? 'flex' : 'none';
}
function mxInsert(tpl) {
  const ta = $('#mxSrc'); const s = ta.selectionStart, en = ta.selectionEnd; const sel = ta.value.slice(s, en);
  let t = tpl, caret;
  const k = t.indexOf('{}');
  if (k >= 0) { if (sel) { t = t.slice(0, k + 1) + sel + t.slice(k + 1); } }
  const k2 = t.indexOf('{}');
  caret = k2 >= 0 ? s + k2 + 1 : s + t.length;
  if (sel && k >= 0 && k2 < 0) caret = s + t.length;
  ta.value = ta.value.slice(0, s) + t + ta.value.slice(en);
  ta.focus(); ta.selectionStart = ta.selectionEnd = caret; mxPreview();
}
/* ช่องว่าง {} ถัดไป */
function mxNextSlot(back) {
  const ta = $('#mxSrc'), v = ta.value, p = ta.selectionStart;
  let k;
  if (back) { k = v.lastIndexOf('{}', p - 2); } else { k = v.indexOf('{}', p); if (k === p - 1) k = v.indexOf('{}', p + 1); }
  if (k < 0) k = back ? v.lastIndexOf('{}') : v.indexOf('{}');
  if (k >= 0) { ta.selectionStart = ta.selectionEnd = k + 1; return true; }
  return false;
}
$('#mxSrc').addEventListener('keydown', e => {
  if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) { e.preventDefault(); $('#mxOk').click(); return; }
  if (e.key === 'Tab') { e.preventDefault(); mxNextSlot(e.shiftKey); }
});
function mxBuildMatrix() {
  const r = Math.max(1, Math.min(10, +$('#mxR').value || 2)), c = Math.max(1, Math.min(10, +$('#mxC').value || 2)), env = $('#mxEnv').value;
  const row = Array(c).fill('{}').join(' & ');
  let body = Array(r).fill(row).join(' \\\\ ');
  let t;
  if (env === 'aug') { const cols = 'c'.repeat(Math.max(1, c - 1)) + '|c'; t = `\\left[ \\begin{array}{${cols}} ${body} \\end{array} \\right]`; }
  else t = `\\begin{${env}} ${body} \\end{${env}}`;
  mxInsert(t);
}
function texFor(tex, o) { return (o.ts ? '' : '\\displaystyle ') + prepTex(tex || '\\square'); }
function mxOpts() { return { disp: $('#mxDisp').value === '1', ts: !$('#mxFull').checked, ns: !$('#mxStr').checked, sz: $('#mxSz').value, col: mxColor }; }
function mxPreview() {
  const o = mxOpts(), pv = $('#mxPrev');
  const src = ($('#mxSrc').value || '').replace(/\{\}/g, '{\\square}');
  const ta = $('#mxSrc'); let srcC = src; try { const raw = ta.value, p = ta.selectionStart; if (document.activeElement === ta && p === ta.selectionEnd && !/\\[a-zA-Z]*$/.test(raw.slice(0, p)) && !(raw[p - 1] === '\\')) { const a = raw.slice(0, p), b = raw.slice(p); srcC = (a + '\\htmlClass{mxcur}{\\rule{0px}{0.9em}}' + b).replace(/\{\}/g, '{\\square}'); } } catch (e) { }
  try { try { katex.render(texFor(srcC, o), pv, { throwOnError: true, displayMode: false, strict: false, trust: c => c.command === '\\htmlClass' }); } catch (e1) { katex.render(texFor(src, o), pv, { throwOnError: true, displayMode: false, strict: false }); } pv.style.color = o.col || ''; pv.style.fontSize = (26 * (+o.sz || 1)) + 'px'; requestAnimationFrame(() => stretchInts(pv)); }
  catch (e) { pv.style.fontSize = ''; pv.innerHTML = '<span class="err">สมการยังไม่สมบูรณ์: ' + esc(e.message.replace('KaTeX parse error: ', '')) + '</span>'; }
}
['mxSrc', 'mxDisp', 'mxFull', 'mxStr', 'mxSz'].forEach(id => $('#' + id).addEventListener(id === 'mxSrc' ? 'input' : 'change', mxPreview));
['keyup', 'click', 'focus', 'blur', 'select'].forEach(ev => $('#mxSrc').addEventListener(ev, () => setTimeout(mxPreview, 0)));
$('#mxMk').onclick = mxBuildMatrix;
function openMathCb(tex, cb) {
  mathTarget = null; mathCb = cb; $('#dMath').classList.add('over');
  $('#mxSrc').value = tex || ''; $('#mxDisp').value = '0'; $('#mxFull').checked = true; $('#mxSz').value = '1'; $('#mxStr').checked = true; setMxCol(''); $('#mxDel').style.display = 'none';
  mxPreview(); openDlg('#dMath'); setTimeout(() => { const ta = $('#mxSrc'); ta.focus(); ta.selectionStart = ta.selectionEnd = ta.value.length; }, 50);
}
function openMath(span) {
  mathCb = null; $('#dMath').classList.remove('over');
  mathTarget = span || null;
  if (!span && !lastRange) { toast('คลิกตำแหน่งในข้อความที่จะใส่สมการก่อน'); return; }
  $('#mxSrc').value = span ? span.dataset.tex : '';
  $('#mxDisp').value = span && span.dataset.disp === '1' ? '1' : '0';
  $('#mxFull').checked = !(span && span.dataset.ts === '1');
  $('#mxSz').value = span && span.dataset.sz ? span.dataset.sz : '1';
  $('#mxStr').checked = !(span && span.dataset.ns === '1');
  setMxCol(span && span.dataset.col ? span.dataset.col : '');
  $('#mxDel').style.display = span ? '' : 'none';
  mxPreview(); openDlg('#dMath'); setTimeout(() => { const ta = $('#mxSrc'); ta.focus(); ta.selectionStart = ta.selectionEnd = ta.value.length; }, 50);
}
function applyMxAttrs(sp, o) {
  if (o.disp) sp.dataset.disp = '1'; else delete sp.dataset.disp;
  if (o.ts) sp.dataset.ts = '1'; else delete sp.dataset.ts;
  if (o.sz && o.sz !== '1') sp.dataset.sz = o.sz; else delete sp.dataset.sz;
  if (o.ns) sp.dataset.ns = '1'; else delete sp.dataset.ns;
  if (o.col) sp.dataset.col = o.col; else delete sp.dataset.col;
}
$('#bMath').addEventListener('mousedown', e => e.preventDefault());
$('#bMath').onclick = () => openMath(null);
$('#mxCancel').onclick = () => { mathCb = null; closeDlg('#dMath'); };
$('#mxDel').onclick = () => { if (mathTarget) { const ed = mathTarget.closest('[contenteditable="true"]'); mathTarget.remove(); if (ed) syncFrom(ed); } closeDlg('#dMath'); };
$('#mxOk').onclick = () => {
  const tex = $('#mxSrc').value.trim(); const o = mxOpts();
  closeDlg('#dMath');
  if (mathCb) { const cb = mathCb; mathCb = null; if (tex) cb(tex); return; }
  if (!tex) return;
  if (mathTarget) {
    mathTarget.dataset.tex = tex; applyMxAttrs(mathTarget, o);
    renderMath(mathTarget.parentElement); const ed = mathTarget.closest('[contenteditable="true"]'); if (ed) syncFrom(ed); return;
  }
  const sp = mkMath(tex); applyMxAttrs(sp, o);
  const r = lastRange; const ed = r && (r.startContainer.nodeType === 1 ? r.startContainer : r.startContainer.parentElement).closest('[contenteditable="true"]');
  if (!ed) return;
  r.deleteContents(); r.insertNode(document.createTextNode(' ')); r.insertNode(sp);
  renderMath(ed); syncFrom(ed);
  const nr = document.createRange(); nr.setStartAfter(sp.nextSibling || sp); nr.collapse(true); ed.focus({ preventScroll: true }); const s = getSelection(); s.removeAllRanges(); s.addRange(nr);
};

/* ---------- ∫ ยืดตามความสูงของฟังก์ชัน ---------- */
const INT_RE = /^[∫∬∭∮]$/;
function stretchInts(root) {
  if (!root) return;
  $$('.op-symbol.large-op', root).forEach(g => {
    if (!INT_RE.test(g.textContent.trim())) return;
    const mx = g.closest('.mx,#mxPrev'); if (!mx || (mx.dataset && mx.dataset.ns === '1') || (mx.id === 'mxPrev' && !$('#mxStr').checked)) { reset(g); return; }
    reset(g); if (mx.classList && mx.classList.contains('mx')) mx.style.paddingTop = mx.style.paddingBottom = '';
    const wrap = g.parentElement.classList.contains('mop') && g.parentElement.querySelector('.msupsub') ? g.parentElement : g;
    const gr = g.getBoundingClientRect(); if (!gr.height || !g.offsetHeight) return;
    const z = gr.height / g.offsetHeight;
    // ฟังก์ชันที่อยู่ถัดจากเครื่องหมาย จนถึงเครื่องหมายเท่ากับ หรืออินทิกรัลตัวถัดไป
    let top = Infinity, bot = -Infinity, n = wrap.nextElementSibling, cnt = 0;
    while (n && cnt < 40) {
      if (n.classList.contains('mrel') || n.querySelector('.op-symbol.large-op') || n.classList.contains('mop') && /[∫∬∭∮∑∏]/.test(n.textContent)) break;
      if (!n.classList.contains('mspace') && n.textContent.trim()) {
        [n, ...n.querySelectorAll('*')].forEach(e => {
          const leaf = (e.children.length === 0 && e.textContent.trim()) || e.tagName.toLowerCase() === 'svg' || (e.classList && (e.classList.contains('frac-line') || e.classList.contains('sqrt-line')));
          if (!leaf) return; const r = e.getBoundingClientRect(); if (r.height) { top = Math.min(top, r.top); bot = Math.max(bot, r.bottom); }
        });
      }
      n = n.nextElementSibling; cnt++;
    }
    if (!isFinite(top)) return;
    const fs = parseFloat(getComputedStyle(g).fontSize);       // px ก่อนย่อขยาย
    const H0 = fs * 2.22;                                        // ความสูงของ ∫ ขนาดเต็ม
    const Hc = (bot - top) / z;
    const k = Math.min(4, Hc * 0.98 / H0);
    if (k <= 1.04) return;
    const gc = (gr.top + gr.bottom) / 2, cc = (top + bot) / 2;
    const dy = (cc - gc) / z;
    g.style.display = 'inline-block';
    g.style.transformOrigin = '50% 50%';
    g.style.transform = `translateY(${dy.toFixed(2)}px) scaleY(${k.toFixed(3)})`;
    g.dataset.st = '1';
    if (mx.classList && mx.classList.contains('mx')) { const pad = Math.max(0, (k - 1) * H0 / 2 - Math.abs(dy)) * 0.5 + 2; mx.style.paddingTop = mx.style.paddingBottom = pad.toFixed(1) + 'px'; }
    const ss = wrap !== g ? $('.msupsub', wrap) : null;
    if (ss) {
      const ext = (k - 1) * H0 / 2;
      $$(':scope > .vlist-t > .vlist-r > .vlist > span', ss).forEach(sp => {
        if (!sp.textContent.trim()) return;
        const up = parseFloat(sp.style.top || '0') < -3;
        sp.style.transform = `translateY(${(dy + (up ? -ext : ext)).toFixed(2)}px)`; sp.dataset.st = '1';
      });
    }
  });
  function reset(g) {
    if (g.dataset.st) { g.style.transform = ''; delete g.dataset.st; }
    const w = g.parentElement; if (w) $$('.msupsub .vlist > span[data-st]', w).forEach(sp => { sp.style.transform = ''; delete sp.dataset.st; });
  }
}

