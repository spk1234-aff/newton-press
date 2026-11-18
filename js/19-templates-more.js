'use strict';
/* ===================== แม่แบบเพิ่มเติม: แบบทดสอบย่อย (ข้อเขียน) · ใบลา · PA1/ส · PA2/ส · PA3 ===================== */
const FORM_SET = { name: 'เอกสาร', hl: '', hr: '', au: '', ft: '', size: 'exam', nologo: true, hline: 'none', pnPos: 'none' };
const fmClone = L => JSON.parse(JSON.stringify(L)).map(b => { b.id = uid(); return b; });
const fmDots = n => '.'.repeat(n);
function fmLeave() {
  const P = (html, al) => Object.assign({ id: uid(), t: 'para', html }, al ? { st: { al } } : {}), tab = '<span class="tab">\t</span>';
  const sign = (role, name, pos) => `(ลงชื่อ)${fmDots(46)}${role || ''}<br>( ${name || fmDots(44)} )<br>ตำแหน่ง ${pos || fmDots(40)}`;
  return { settings: Object.assign({}, FORM_SET, { name: 'ใบลาป่วย ลาคลอดบุตร ลากิจส่วนตัว' }), blocks: [
    P('<b>แบบใบลาป่วย ลาคลอดบุตร ลากิจส่วนตัว</b>', 'center'),
    P(`เขียนที่ โรงเรียน${esc(typeof SCHOOL === 'string' && SCHOOL ? SCHOOL.replace(/^โรงเรียน/, '') : fmDots(30))}<br>วันที่${fmDots(10)}เดือน${fmDots(30)}พ.ศ.${fmDots(10)}`, 'right'),
    P(`เรื่อง ${fmDots(50)}<br>เรียน ผู้อำนวยการโรงเรียน${esc(typeof SCHOOL === 'string' && SCHOOL ? SCHOOL.replace(/^โรงเรียน/, '') : fmDots(30))}`),
    P(`${tab}ข้าพเจ้า${fmDots(70)}ตำแหน่ง${fmDots(50)}<br>สังกัด ${fmDots(120)}<br>${tab}ขอลา${tab}☐ ป่วย${tab}☐ กิจส่วนตัว${tab}☐ คลอดบุตร<br>เนื่องจาก${fmDots(150)}<br>ตั้งแต่วันที่${fmDots(10)}เดือน${fmDots(28)}พ.ศ.${fmDots(12)}ถึงวันที่${fmDots(10)}เดือน${fmDots(28)}พ.ศ.${fmDots(12)}<br>มีกำหนด${fmDots(12)}วัน ข้าพเจ้าได้ลา ☐ ป่วย ☐ กิจส่วนตัว ☐ คลอดบุตร<br>ครั้งสุดท้ายตั้งแต่วันที่${fmDots(8)}เดือน${fmDots(18)}พ.ศ.${fmDots(8)}ถึงวันที่${fmDots(8)}เดือน${fmDots(18)}พ.ศ.${fmDots(8)} มีกำหนด${fmDots(8)}วัน<br>ในระหว่างลาจะติดต่อข้าพเจ้าได้ที่${fmDots(56)}โทรศัพท์${fmDots(26)}`),
    { id: uid(), t: 'table', full: true, rs: {}, nob: true, pad: 's', cw: '50,50', rows: [['', `ขอแสดงความนับถือ<br>${sign('', '', '')}`]], ca: { '0,1': ['c', ''] } },
    P('<b>สถิติการลา</b> ☐ ต.ค.–มี.ค. ☐ เม.ย.–ก.ย.'),
    { id: uid(), t: 'table', tw: 62, rs: {}, compact: true, pad: 's', tfs: 0.9, tst: { k: 'plain', hr: 2, hc: 0, fr: 1 }, cw: '28,12,12,12,12,12,12', mg: { '0,0': [2, 1], '0,1': [1, 2], '0,3': [1, 2], '0,5': [1, 2], '5,0': [1, 5] }, ca: { '2,0': ['l', ''], '3,0': ['l', ''], '4,0': ['l', ''], '5,0': ['r', ''] },
      rows: [['ประเภทการลา', 'ลามาแล้ว', '', 'ลาครั้งนี้', '', 'รวมเป็น', ''], ['', 'ครั้ง', 'วัน', 'ครั้ง', 'วัน', 'ครั้ง', 'วัน'], ['ลาป่วย', '', '', '', '', '=B3+D3', '=C3+E3'], ['ลากิจส่วนตัว', '', '', '', '', '=B4+D4', '=C4+E4'], ['ลาคลอดบุตร', '', '', '', '', '=B5+D5', '=C5+E5'], ['รวม', '', '', '', '', '=SUM(F3:F5)', '=SUM(G3:G5)']] },
    { id: uid(), t: 'table', full: true, rs: {}, nob: true, tfs: 0.92, pad: 's', cw: '50,50', ca: { '0,0': ['c', 't'], '0,1': ['c', 't'], '1,0': ['c', 't'], '1,1': ['c', 't'] },
      rows: [[sign('เจ้าหน้าที่', '', ''), `<b>ความเห็นผู้บังคับบัญชา</b><br>${fmDots(70)}<br>${sign('', '', 'รองผู้อำนวยการกลุ่มบริหารงานบุคคล')}<br>วันที่${fmDots(10)}เดือน${fmDots(20)}พ.ศ.${fmDots(10)}`],
        [sign('', '', 'หัวหน้ากลุ่มงานบริหารงานบุคคล'), `<b>คำสั่ง</b> ☐ อนุญาต ☐ ไม่อนุญาต<br>${sign('', '', 'ผู้อำนวยการโรงเรียน')}<br>วันที่${fmDots(10)}เดือน${fmDots(20)}พ.ศ.${fmDots(10)}`]] }] };
}
const fmPA = (k, name) => () => ({ settings: Object.assign({}, FORM_SET, { name, pnPos: 'none' }), blocks: fmClone(FORM_DATA[k]) });
/* ---------- แบบทดสอบย่อย: ไม่มีปก · ไม่มีเส้นบรรทัด · ข้อเขียน + เติมคำตอบ ---------- */
const QZ_KEY = 'np-quiz2';
((o) => Object.keys(o).forEach(k => { if (!(k in ICONS)) ICONS[k] = o[k]; }))({
  'ข้อสอบ': `<rect x="4.5" y="4" width="15" height="18" rx="2.2" fill="#fff" stroke="#c9ced6" stroke-width=".8"/><rect x="8.5" y="2" width="7" height="4" rx="1.3" fill="#ffd95a" stroke="#b8860b" stroke-width=".7"/><path d="M8 11h8M8 14.5h8M8 18h5" stroke="#9aa3af" stroke-width="1.4" stroke-linecap="round"/>`,
  'นาฬิกา': `<circle cx="12" cy="12" r="9.5" fill="#fff" stroke="#2c4a7a" stroke-width="1.8"/><path d="M12 6.5V12l3.6 2.2" fill="none" stroke="#c0392b" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>`,
  'ปฏิทิน': `<rect x="3" y="4.5" width="18" height="16.5" rx="2.5" fill="#fff" stroke="#2c4a7a" stroke-width="1.4"/><path d="M3 9.5h18V7a2.5 2.5 0 0 0-2.5-2.5h-13A2.5 2.5 0 0 0 3 7z" fill="#c0392b"/><path d="M8 2.5v4M16 2.5v4" stroke="#2c4a7a" stroke-width="1.8" stroke-linecap="round"/><path d="M7.5 13.5h2M11 13.5h2M14.5 13.5h2M7.5 17h2M11 17h2" stroke="#2c4a7a" stroke-width="1.6" stroke-linecap="round"/>`,
  'หมวกบัณฑิต': `<path d="M12 4 1.5 9.5 12 15l10.5-5.5z" fill="#2c4a7a"/><path d="M6 12.5v4.2c1.6 1.6 3.6 2.3 6 2.3s4.4-.7 6-2.3v-4.2L12 15.6z" fill="#3d5f96"/><path d="M21 10v6" stroke="#b8860b" stroke-width="1.5" stroke-linecap="round"/><circle cx="21" cy="17" r="1.3" fill="#f2b632"/>`,
  'ถ้วยรางวัล': `<path d="M7 3h10v5a5 5 0 0 1-10 0z" fill="#f2b632" stroke="#b8860b" stroke-width="1"/><path d="M7 4.5H3.5c0 3 1.5 5 4 5.3M17 4.5h3.5c0 3-1.5 5-4 5.3" fill="none" stroke="#b8860b" stroke-width="1.4"/><path d="M12 13v4M8 21h8M9.5 17h5v4h-5z" fill="#b8860b" stroke="#b8860b" stroke-width="1.2" stroke-linejoin="round"/>`,
  'ปากกา': `<path d="M14.5 3.5 20.5 9.5 9 21H3v-6z" fill="#3d5f96" stroke="#2c4a7a" stroke-width="1.2" stroke-linejoin="round"/><path d="M3 21v-6l6 6z" fill="#f3c26b"/><path d="m12.5 5.5 6 6" stroke="#fff" stroke-width="1.2"/>`,
  'เป้าหมาย': `<circle cx="12" cy="12" r="9.5" fill="#fff" stroke="#c0392b" stroke-width="1.8"/><circle cx="12" cy="12" r="5.5" fill="#fff" stroke="#c0392b" stroke-width="1.8"/><circle cx="12" cy="12" r="2" fill="#c0392b"/>`
});
(function () { const N = '#2c4a7a', R = '#c0392b', G = '#2e7d32', Y = '#f2b632', O = '#d9682b', B = '#b8860b', P = '#7b3f8c', T = '#2b7a8c', S = (d, c, w = 1.8, f = 'none') => `<path d="${d}" fill="${f}" stroke="${c}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`;
((o) => Object.keys(o).forEach(k => { if (!(k in ICONS)) ICONS[k] = o[k]; }))({
  'ไม้บรรทัด': `<rect x="2" y="8" width="20" height="8" rx="1.5" fill="#ffe08a" stroke="${B}" stroke-width="1.2"/>${S('M6 8v3M10 8v4M14 8v3M18 8v4', B, 1.3)}`,
  'ไม้ฉาก': `<path d="M3 21V4l17 17z" fill="#cfe3f7" stroke="${N}" stroke-width="1.5" stroke-linejoin="round"/><path d="M7 17v-4l4 4z" fill="#fff" stroke="${N}" stroke-width="1.2" stroke-linejoin="round"/>`,
  'วงเวียน': `<circle cx="12" cy="4.5" r="2" fill="${Y}" stroke="${B}" stroke-width="1.2"/>${S('M11 6.3 5.5 21M13 6.3 18.5 21', N, 2)}${S('M7 15.5c3 1.8 7 1.8 10 0', R, 1.4)}`,
  'เครื่องคิดเลข': `<rect x="4.5" y="2" width="15" height="20" rx="2.5" fill="${N}"/><rect x="7" y="4.5" width="10" height="4.5" rx="1" fill="#d7f0e0"/>${[0, 1, 2].map(i => [0, 1, 2].map(j => `<rect x="${7 + j * 3.6}" y="${11 + i * 3.4}" width="2.8" height="2.3" rx=".6" fill="${i === 2 && j === 2 ? O : '#fff'}"/>`).join('')).join('')}`,
  'กระดานดำ': `<rect x="2.5" y="4" width="19" height="13" rx="1.5" fill="#2f5d50" stroke="${B}" stroke-width="1.5"/>${S('M6 9h6M6 12.5h9', '#fff', 1.4)}${S('M8 17l-2 4M16 17l2 4', B, 1.6)}`,
  'แว่นขยาย': `<circle cx="10.5" cy="10.5" r="6.5" fill="#dff1fb" stroke="${N}" stroke-width="2"/>${S('M15.5 15.5 21 21', N, 2.6)}`,
  'กราฟแท่ง': `${S('M3 21h18', N, 1.6)}<rect x="5" y="12" width="3.5" height="8" rx=".6" fill="${T}"/><rect x="10.3" y="7" width="3.5" height="13" rx=".6" fill="${O}"/><rect x="15.6" y="3.5" width="3.5" height="16.5" rx=".6" fill="${G}"/>`,
  'กราฟเส้น': `${S('M3 3v18h18', N, 1.6)}${S('M6 16l4-5 3.5 3L20 6', R, 2)}<circle cx="20" cy="6" r="1.6" fill="${R}"/>`,
  'แผนภูมิวงกลม': `<circle cx="12" cy="12" r="9.5" fill="${T}"/><path d="M12 12V2.5A9.5 9.5 0 0 1 21.5 12z" fill="${Y}"/><path d="M12 12h9.5a9.5 9.5 0 0 1-4 7.7z" fill="${O}"/>`,
  'สมุดโน้ต': `<rect x="5" y="2.5" width="14.5" height="19" rx="2" fill="#fff" stroke="${N}" stroke-width="1.4"/><rect x="5" y="2.5" width="3.5" height="19" fill="${N}"/>${S('M11 8h6M11 11.5h6M11 15h4', '#9aa3af', 1.3)}`,
  'เช็กลิสต์': `<rect x="3.5" y="2.5" width="17" height="19" rx="2" fill="#fff" stroke="${N}" stroke-width="1.4"/>${S('M6.5 8l1.4 1.4L10.5 6.8M6.5 14l1.4 1.4 2.6-2.6', G, 1.6)}${S('M13 8.2h4.5M13 14.2h4.5', '#9aa3af', 1.4)}`,
  'แฟ้ม': `<path d="M2.5 6.5a2 2 0 0 1 2-2h4.5l2 2.2h8.5a2 2 0 0 1 2 2V18a2 2 0 0 1-2 2h-15a2 2 0 0 1-2-2z" fill="${Y}" stroke="${B}" stroke-width="1.2" stroke-linejoin="round"/>`,
  'ระฆัง': `<path d="M12 3a6 6 0 0 0-6 6v4.5L4 17h16l-2-3.5V9a6 6 0 0 0-6-6z" fill="${Y}" stroke="${B}" stroke-width="1.3" stroke-linejoin="round"/><path d="M9.8 19.5a2.3 2.3 0 0 0 4.4 0z" fill="${B}"/>`,
  'ธง': `${S('M5 2.5v19', N, 2)}<path d="M5 4h13l-3 4 3 4H5z" fill="${R}"/>`,
  'เหรียญรางวัล': `<path d="M8 2h3l1 5-3 2zM16 2h-3l-1 5 3 2z" fill="${N}"/><circle cx="12" cy="15" r="6.5" fill="${Y}" stroke="${B}" stroke-width="1.3"/><path d="M12 11.3l1.2 2.4 2.6.3-1.9 1.8.5 2.6-2.4-1.3-2.4 1.3.5-2.6-1.9-1.8 2.6-.3z" fill="#fff"/>`,
  'หัวใจ': `<path d="M12 21C5 15.5 2.5 12 2.5 8.5A5 5 0 0 1 12 6a5 5 0 0 1 9.500 2.500C21.500 12 19 15.500 12 21z" fill="${R}"/>`,
  'ยกนิ้ว': `<path d="M7 10.5 11 3c1.800 0 2.800 1.200 2.500 3L13 9.500h5.500a2 2 0 0 1 2 2.400l-1.300 6.500a2 2 0 0 1-2 1.600H7z" fill="${Y}" stroke="${B}" stroke-width="1.200" stroke-linejoin="round"/><rect x="2.500" y="10" width="4" height="10" rx="1" fill="${N}"/>`,
  'คำถาม': `<circle cx="12" cy="12" r="10" fill="${N}"/>${S('M9 9.300a3 3 0 1 1 4.300 2.700c-.900.500-1.300 1.100-1.300 2', '#fff', 2)}<circle cx="12" cy="17.300" r="1.300" fill="#fff"/>`,
  'ข้อมูล': `<circle cx="12" cy="12" r="10" fill="${T}"/><circle cx="12" cy="7.300" r="1.400" fill="#fff"/>${S('M12 11v6.500', '#fff', 2.400)}`,
  'ตกใจ': `<circle cx="12" cy="12" r="10" fill="${O}"/>${S('M12 6.500v7', '#fff', 2.400)}<circle cx="12" cy="17.300" r="1.400" fill="#fff"/>`,
  'ลูกศรขวา': `<circle cx="12" cy="12" r="10" fill="${G}"/>${S('M7 12h10M13 7.500l4.500 4.500-4.500 4.500', '#fff', 2.200)}`,
  'หมุด': `<path d="M12 22s7-7.500 7-12.500a7 7 0 0 0-14 0C5 14.500 12 22 12 22z" fill="${R}"/><circle cx="12" cy="9.500" r="2.800" fill="#fff"/>`,
  'โรงเรียน': `<path d="M12 2.500 2.500 9h19z" fill="${R}"/><rect x="4" y="9" width="16" height="12" fill="#fdf6ec" stroke="${B}" stroke-width="1.200"/><rect x="10" y="14" width="4" height="7" fill="${N}"/><rect x="5.800" y="11.500" width="2.800" height="2.800" fill="#9cc7e8"/><rect x="15.400" y="11.500" width="2.800" height="2.800" fill="#9cc7e8"/>`,
  'นาฬิกาทราย': `${S('M6 2.500h12M6 21.500h12', N, 2)}<path d="M7 3.500h10c0 5-3.500 6-3.500 8.500s3.500 3.500 3.500 8.500H7c0-5 3.500-6 3.500-8.500S7 8.500 7 3.500z" fill="#fff" stroke="${N}" stroke-width="1.400" stroke-linejoin="round"/><path d="M9 19.500c.500-2.500 2-3 3-4 1 1 2.500 1.500 3 4z" fill="${Y}"/>`,
  'กุญแจ': `<circle cx="7.500" cy="12" r="4.500" fill="none" stroke="${B}" stroke-width="2.400"/>${S('M12 12h9.500M18 12v3.500M21 12v2.500', B, 2.400)}`,
  'ลูกโลก': `<circle cx="12" cy="12" r="9.500" fill="#bfe3f5" stroke="${N}" stroke-width="1.500"/>${S('M2.500 12h19M12 2.500c3 3 3 16 0 19M12 2.500c-3 3-3 16 0 19', N, 1.200)}`,
  'จรวด': `<path d="M12 2c3.500 2.500 5 6.500 4 12H8C7 8.500 8.500 4.500 12 2z" fill="#eef2f7" stroke="${N}" stroke-width="1.300" stroke-linejoin="round"/><circle cx="12" cy="8.500" r="2" fill="${T}"/><path d="M8 12l-3 4h3.500zM16 12l3 4h-3.500z" fill="${R}"/><path d="M10 15h4l-2 6z" fill="${O}"/>`,
  'ประกาย': `<path d="M12 2l2 7 7 3-7 3-2 7-2-7-7-3 7-3z" fill="${Y}" stroke="${B}" stroke-width="1" stroke-linejoin="round"/>`,
  'ปริศนา': `<path d="M4 8h4a2.500 2.500 0 1 1 4 0h4v4a2.500 2.500 0 1 1 0 4v4H4z" fill="${P}"/>`,
  'ลูกเต๋าสุ่ม': `<rect x="3" y="3" width="18" height="18" rx="4" fill="${P}"/>${[[8, 8], [16, 8], [12, 12], [8, 16], [16, 16]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="1.600" fill="#fff"/>`).join('')}`,
  'อีเมล': `<rect x="2.500" y="5" width="19" height="14" rx="2" fill="#fff" stroke="${N}" stroke-width="1.500"/>${S('M3.500 7l8.500 6 8.500-6', N, 1.500)}`,
  'โทรศัพท์': `<rect x="6.500" y="2" width="11" height="20" rx="2.500" fill="${N}"/><rect x="8" y="4.500" width="8" height="12.500" fill="#dff1fb"/><circle cx="12" cy="19.300" r="1.100" fill="#fff"/>`,
  'ทีม': `<circle cx="7" cy="9" r="3" fill="${T}"/><circle cx="17" cy="9" r="3" fill="${O}"/><path d="M1.500 20c0-3.500 2.500-6 5.500-6s5.500 2.500 5.500 6zM11.500 20c0-3.500 2.500-6 5.500-6s5.500 2.500 5.500 6z" fill="${N}" opacity=".85"/>`,
  'เครื่องพิมพ์': `<rect x="6" y="2.500" width="12" height="6" fill="#fff" stroke="${N}" stroke-width="1.300"/><rect x="2.500" y="8" width="19" height="9" rx="2" fill="${N}"/><rect x="6" y="14" width="12" height="7.500" fill="#fff" stroke="${N}" stroke-width="1.300"/>${S('M8.500 17h7M8.500 19.300h5', '#9aa3af', 1.200)}`
}); })();
try { buildIconMenu(); } catch (e) { }
const qzIc = k => `<span class="ic" contenteditable="false" data-ic="${k}"></span>`;
const QZ_COLORS = [['#0f7b3f', 'เขียว'], ['#1f5fbf', 'น้ำเงิน'], ['#d9480f', 'ส้ม'], ['#7b3fc4', 'ม่วง'], ['#d6336c', 'ชมพู'], ['#0b7285', 'น้ำทะเล'], ['#b8860b', 'ทอง'], ['#343a40', 'เทาเข้ม']];
function qzDefaults() { let o = {}; try { o = JSON.parse(localStorage.getItem(QZ_KEY) || '{}'); } catch (e) { } return Object.assign({ title: 'แบบทดสอบย่อย ครั้งที่ 1', topic: '', subj: 'คณิตศาสตร์เพิ่มเติม', code: '', grade: 'ม.6', term: '1/2569', time: '20', teacher: '', nf: 2, pf: 1, nw: 3, pw: 2, space: '60mm', score: true, name: true, note: 'แสดงวิธีทำอย่างละเอียดทุกข้อ', foot: '', color: '#0f7b3f', icons: true }, o); }
function qzBlocks(o) {
  const B = [], nf = Math.max(0, +o.nf || 0), nw = Math.max(0, +o.nw || 0), pf = +o.pf || 0, pw = +o.pw || 0, total = nf * pf + nw * pw, num = x => String(+(+x).toFixed(2));
  const M = cpNorm(o.color) || '#0f7b3f', tint = cpMix(M, '#ffffff', .88), soft = cpMix(M, '#ffffff', .94), dark = cpMix(M, '#000000', .35), col = (c, t) => `<span style="color:${c}">${t}</span>`;
  const I = k => o.icons ? qzIc(k) + ' ' : '';
  const chip = (k, v, ic) => v ? `<span class="nw" style="white-space:nowrap;display:inline-block">${I(ic)}${col(dark, '<b>' + k + '</b>')} ${esc(v)}</span>` : '';
  const info = [chip('รายวิชา', o.subj + (o.code ? ' (' + o.code + ')' : ''), 'หนังสือ'), chip('ชั้น', o.grade, 'หมวกบัณฑิต'), chip('ภาคเรียนที่', o.term, 'ปฏิทิน'), chip('เวลา', o.time ? o.time + ' นาที' : '', 'นาฬิกา'), chip('ครูผู้สอน', o.teacher, 'คน (น้ำเงิน)')].filter(Boolean).join(' &nbsp;&nbsp;&nbsp; ');
  const title = `<b><span style="font-size:1.45em">${I('ข้อสอบ')}${esc(o.title || 'แบบทดสอบย่อย')}</span></b>${o.topic ? `<br><b><span style="font-size:1.08em">เรื่อง ${esc(o.topic)}</span></b>` : ''}`;
  const bd = [1, 'solid', M], box = { t: bd, b: bd, l: bd, r: bd };
  if (o.score) B.push({ id: uid(), t: 'table', full: true, rs: {}, cw: '80,20', pad: 'l', mg: { '0,1': [2, 1] }, rows: [[title, `${o.icons ? '<span style="font-size:1.5em">' + qzIc('ถ้วยรางวัล') + '</span><br>' : ''}<b>คะแนน</b><br>${o.icons ? '' : '<br>'}<span style="font-size:1.5em"><b>${fmDots(6)}</b></span><br>เต็ม ${total ? num(total) : fmDots(4)}`], [info || '&nbsp;', '']],
    cf: { '0,0': [M, '#ffffff'], '1,0': [tint, ''], '0,1': [soft, dark] }, ca: { '0,0': ['l', 'm'], '1,0': ['l', 'm'], '0,1': ['c', 'm'] }, bd: { '0,0': box, '1,0': box, '0,1': box } });
  else B.push({ id: uid(), t: 'table', full: true, rs: {}, pad: 'l', rows: [[title], [info || '&nbsp;']], cf: { '0,0': [M, '#ffffff'], '1,0': [tint, ''] }, ca: { '0,0': ['c', 'm'], '1,0': ['c', 'm'] }, bd: { '0,0': box, '1,0': box } });
  if (o.name) B.push({ id: uid(), t: 'para', html: `${I('คน (เขียว)')}${col(dark, '<b>ชื่อ–สกุล</b>')} ${fmDots(70)} ${col(dark, '<b>ชั้น</b>')} ${fmDots(14)} ${col(dark, '<b>เลขที่</b>')} ${fmDots(10)}`, st: { mt: 10 } });
  if (o.note) B.push({ id: uid(), t: 'para', html: `${I('หลอดไฟ (ไอเดีย)')}${col(M, '<b>คำชี้แจง</b>')} ${esc(o.note)}${total ? ` &nbsp;(${nf + nw} ข้อ รวม ${num(total)} คะแนน)` : ''}`, st: { mb: 4 } });
  const part = (t, d, ic) => ({ id: uid(), t: 'para', html: `${I(ic)}<b>${t}</b> &nbsp;${d}`, st: { bg: tint, fg: dark, rad: 8, mt: 10, mb: 4, bw: 0 } });
  let n = 0; const both = nf && nw;
  if (nf) { if (both) B.push(part('ตอนที่ 1 เติมคำตอบ', `${nf} ข้อ ข้อละ ${num(pf)} คะแนน`, 'ดินสอ'));
    for (let i = 0; i < nf; i++) { n++; B.push({ id: uid(), t: 'problem', html: String(n), skill: '', pts: num(pf) }, { id: uid(), t: 'para', html: `${col(M, '<b>ตอบ</b>')} <span class="blank" contenteditable="false" data-w="16"></span>`, st: { ml: 29, mb: 10 } }); } }
  if (nw) { if (both) B.push(part('ตอนที่ 2 แสดงวิธีทำ', `${nw} ข้อ ข้อละ ${num(pw)} คะแนน`, 'ปากกา'));
    for (let i = 0; i < nw; i++) { n++; const w = { id: uid(), t: 'work', nolab: true, st: { bw: 0 } }; if (/^[1-6]$/.test(String(o.space))) { if (+o.space === 1) w.full = true; else w.share = +o.space; w.h = 40; } else w.h = +String(o.space).replace('mm', '') || 60;
      B.push({ id: uid(), t: 'problem', html: String(n), skill: '', pts: num(pw) }, w); } }
  return B;
}
async function openQuiz2() {
  const o = qzDefaults(), f = (k, lab, w, type) => `<label style="display:flex;flex-direction:column;gap:2px;font-size:14px;color:#666;${w ? 'width:' + w : 'flex:1;min-width:0'}">${lab}<input type="${type || 'text'}" id="qz_${k}" value="${esc(String(o[k] ?? ''))}" ${type === 'number' ? 'min="0" step="0.5"' : ''} style="font-size:16px;min-width:0"></label>`;
  const ok = await ask('แบบทดสอบย่อย (ข้อเขียน)', `<div style="display:flex;flex-direction:column;gap:10px;width:min(580px,86vw)">
<div style="display:flex;gap:8px;align-items:center"><span style="font-size:14px;color:#666">สี</span>${QZ_COLORS.map(([c, n]) => `<label title="${n}" style="cursor:pointer"><input type="radio" name="qz_c" value="${c}" ${o.color === c ? 'checked' : ''} style="display:none"><span class="qzsw" style="background:${c}"></span></label>`).join('')}<input type="color" id="qz_cc" value="${esc(o.color)}" title="สีอื่น"></div>
<div style="display:flex;gap:8px">${f('title', 'ชื่อแบบทดสอบ')}${f('topic', 'เรื่อง')}</div>
<div style="display:flex;gap:8px">${f('subj', 'รายวิชา')}${f('code', 'รหัสวิชา', '100px')}${f('grade', 'ชั้น', '74px')}${f('term', 'ภาคเรียน', '84px')}${f('time', 'เวลา (นาที)', '84px')}</div>
<div style="display:flex;gap:8px;align-items:flex-end">${f('nf', 'ข้อเติมคำตอบ', '105px', 'number')}${f('pf', 'ข้อละ (คะแนน)', '105px', 'number')}<span style="flex:1"></span>${f('nw', 'ข้อแสดงวิธีทำ', '105px', 'number')}${f('pw', 'ข้อละ (คะแนน)', '105px', 'number')}</div>
<div style="display:flex;gap:8px;align-items:flex-end"><label style="display:flex;flex-direction:column;gap:2px;font-size:14px;color:#666;flex:1">พื้นที่เขียนตอบ (ข้อแสดงวิธีทำ)<select id="qz_space" style="font-size:16px">${[['35mm', 'สูง 3.5 ซม.'], ['60mm', 'สูง 6 ซม.'], ['90mm', 'สูง 9 ซม.'], ['2', '2 ข้อต่อหน้า'], ['3', '3 ข้อต่อหน้า'], ['4', '4 ข้อต่อหน้า'], ['5', '5 ข้อต่อหน้า'], ['1', '1 ข้อต่อหน้า']].map(([v, n]) => `<option value="${v}"${String(o.space) === v ? ' selected' : ''}>${n}</option>`).join('')}</select></label>
<label style="font-size:15px"><input type="checkbox" id="qz_score" ${o.score ? 'checked' : ''}> ช่องคะแนน</label><label style="font-size:15px"><input type="checkbox" id="qz_name" ${o.name ? 'checked' : ''}> บรรทัดชื่อ</label><label style="font-size:15px"><input type="checkbox" id="qz_icons" ${o.icons ? 'checked' : ''}> ไอคอน</label></div>
<div style="display:flex;gap:8px">${f('teacher', 'ครูผู้สอน (ไม่ใส่ก็ได้)')}${f('note', 'คำชี้แจง')}</div>
${f('foot', 'ข้อความท้ายหน้า (ไม่ใส่ก็ได้) เช่น ทุจริตปรับตกทุกกรณี')}</div>`, 'สร้าง');
  if (!ok) return; ['title', 'topic', 'subj', 'code', 'grade', 'term', 'time', 'teacher', 'nf', 'pf', 'nw', 'pw', 'space', 'note', 'foot'].forEach(k => { o[k] = $('#qz_' + k).value; }); o.score = $('#qz_score').checked; o.name = $('#qz_name').checked; o.icons = $('#qz_icons').checked;
  const rc = $('input[name="qz_c"]:checked'); o.color = (window.__qzc || (rc && rc.value) || o.color); window.__qzc = null;
  try { localStorage.setItem(QZ_KEY, JSON.stringify(o)); } catch (e) { }
  doc = { app: 'en-editor', v: 2, settings: Object.assign({}, doc.settings, FORM_SET, { name: (o.title || 'แบบทดสอบย่อย') + (o.topic ? ' ' + o.topic : ''), pnPos: 'none', ft: o.foot || '', qz: 1, qzc: cpNorm(o.color) || '#0f7b3f' }), blocks: qzBlocks(o) };
  curId = null; applySettings(); renderAll(); changed(true); refreshInspector(); $('#scroller').scrollTop = 0;
}
document.addEventListener('change', e => { if (e.target.id === 'qz_cc') { window.__qzc = e.target.value; $$('input[name="qz_c"]').forEach(r => { r.checked = false; }); } else if (e.target.name === 'qz_c') window.__qzc = null; });
(function () {
  const css = document.createElement('style'); css.textContent = `.b-work{transition:none}.blk[data-t="work"] .b-work.plain{border-color:transparent!important;background:none!important}.blk[data-t="work"]:hover .b-work.plain,.blk[data-t="work"].sel .b-work.plain{border-color:#d9d9de!important}.exporting .blk[data-t="work"] .b-work.plain,#npPrint .b-work.plain{border-color:transparent!important}`; document.head.appendChild(css);
  css.textContent += `.qz .b-problem{border-top:0;padding-top:3px;margin-top:8px;align-items:flex-start;font-weight:400;color:var(--ink);gap:10px}
.qz .b-problem .pl{font-weight:700;min-width:1.75em;height:1.6em;line-height:1.6em;text-align:center;background:var(--qzc,#0f7b3f);color:#fff;border-radius:7px;padding:0 .25em;flex:none}
.qz .b-problem .sk{color:inherit;font-weight:400;padding-top:.02em}.qz .b-problem .sk:empty::before{content:'พิมพ์โจทย์…'!important}
.qz .b-problem .pp{white-space:nowrap;margin-left:10px;padding:0 .7em;border-radius:999px;background:color-mix(in srgb,var(--qzc,#0f7b3f) 13%,#fff);color:color-mix(in srgb,var(--qzc,#0f7b3f) 70%,#000);font-weight:700;font-size:.86em;line-height:1.75em}
.qzsw{display:inline-block;width:24px;height:24px;border-radius:50%;border:2px solid #fff;box-shadow:0 0 0 1px #0003;vertical-align:middle}input[name=qz_c]:checked+.qzsw{box-shadow:0 0 0 2.5px #0a84ff}`;
  const _as = applySettings; applySettings = function () { const r = _as.apply(this, arguments); const q = !!(doc && doc.settings && doc.settings.qz); document.body.classList.toggle('qz', q); if (q) document.documentElement.style.setProperty('--qzc', doc.settings.qzc || '#0f7b3f'); else document.documentElement.style.removeProperty('--qzc'); return r; };
  const _fb = fillBlock; fillBlock = function (el, b) { const r = _fb.apply(this, arguments); if (b.t === 'work') { const w = $('.b-work', el); if (w) w.classList.toggle('plain', !!(b.st && String(b.st.bw) === '0')); } return r; };
  DOC_TEMPLATES.push(['แบบทดสอบย่อย (ข้อเขียน)', 'ไม่มีปก · ไม่มีเส้นบรรทัด · ข้อแสดงวิธีทำ / เติมคำตอบ · กำหนดจำนวนข้อและพื้นที่เขียนเอง', 'QUIZ2'],
    ['ใบลา', 'ลาป่วย · ลากิจส่วนตัว · ลาคลอดบุตร · ตารางสถิติรวมให้อัตโนมัติ', fmLeave],
    ['PA 1/ส ข้อตกลงในการพัฒนางาน', 'ครู (ยังไม่มีวิทยฐานะ) · แก้ไขได้ทุกส่วน', fmPA('pa1', 'PA1 ข้อตกลงในการพัฒนางาน')],
    ['PA 2/ส แบบประเมินผลการพัฒนางาน', 'ตารางประเมินตามมาตรฐานตำแหน่ง', fmPA('pa2', 'PA2 แบบประเมินผลการพัฒนางาน')],
    ['PA 3 แบบสรุปผลการประเมิน', 'สรุปคะแนนกรรมการ 3 คน', fmPA('pa3', 'PA3 แบบสรุปผลการประเมิน')]);
  const _ot = openTemplates; openTemplates = function () { const r = _ot.apply(this, arguments); const box = $('#tplList'); if (box && !box.dataset.qz) { box.dataset.qz = 1; box.addEventListener('click', e => { const b = e.target.closest('.tplc'); if (!b || DOC_TEMPLATES[+b.dataset.i][2] !== 'QUIZ2') return; e.stopImmediatePropagation(); closeDlg('#dTpl'); openQuiz2(); }, true); } return r; };
})();


/* ---------- สถานะการโหลดรูป (ไฟล์จาก iCloud / Google Drive มาช้า · ต้องบอกว่ามาหรือไม่มา) ---------- */
const IML = { n: 0, done: 0, bad: [], t: null, wait: null };
function imlEl() {
  let el = $('#imlBox'); if (el) return el;
  const css = document.createElement('style');
  css.textContent = `#imlBox{position:fixed;left:50%;bottom:26px;transform:translateX(-50%);z-index:8000;display:none;align-items:center;gap:10px;max-width:min(560px,92vw);background:#2b2622;color:#fff;border-radius:999px;padding:9px 12px 9px 16px;font-size:16.5px;box-shadow:0 8px 28px #0004}
#imlBox.on{display:flex}#imlBox.ok{background:#256b3a}#imlBox.bad{background:#a12f2f;border-radius:16px}
#imlBox .sp{width:16px;height:16px;border:2.5px solid #fff5;border-top-color:#fff;border-radius:50%;animation:imlsp .8s linear infinite;flex:none}
#imlBox.ok .sp,#imlBox.bad .sp{display:none}#imlBox .tx{min-width:0;line-height:1.25}#imlBox .tx small{display:block;opacity:.8;font-size:13.5px}
#imlBox button{flex:none;border:0;background:#fff2;color:#fff;border-radius:999px;width:26px;height:26px;font-size:15px;cursor:pointer}
@keyframes imlsp{to{transform:rotate(360deg)}}`;
  document.head.appendChild(css);
  el = document.createElement('div'); el.id = 'imlBox'; el.innerHTML = '<span class="sp"></span><span class="tx"></span><button title="ปิด">✕</button>';
  document.body.appendChild(el); $('button', el).onclick = () => imlHide(); return el;
}
function imlShow(kind, msg, sub, ms) { const el = imlEl(); el.className = 'on ' + (kind || ''); $('.tx', el).innerHTML = esc(msg) + (sub ? `<small>${esc(sub)}</small>` : ''); clearTimeout(IML.t); if (ms) IML.t = setTimeout(imlHide, ms); }
function imlHide() { const el = $('#imlBox'); if (el) el.className = ''; clearTimeout(IML.t); clearTimeout(IML.wait); }
const imlSize = n => n >= 1048576 ? (n / 1048576).toFixed(1) + ' MB' : Math.max(1, Math.round(n / 1024)) + ' KB';
const imlIsImg = f => !!f && (/^image\//.test(f.type) || /\.(png|jpe?g|gif|webp|svg|bmp|heic|heif|avif|tiff?)$/i.test(f.name || ''));
function imlEnd() {
  if (IML.done < IML.n) return; clearTimeout(IML.e);
  IML.e = setTimeout(() => { // รอสักครู่เผื่อมีรูปถัดไปในชุดเดียวกัน แล้วค่อยสรุปครั้งเดียว
    if (IML.done < IML.n) return; const ok = IML.n - IML.bad.length, bad = IML.bad.slice(); IML.n = IML.done = 0; IML.bad = [];
    if (bad.length) imlShow('bad', `โหลดรูปไม่สำเร็จ ${bad.length} รูป${ok ? ' (สำเร็จ ' + ok + ' รูป)' : ''}`, bad.join(' · '));
    else imlShow('ok', `✓ โหลดรูปแล้ว ${ok} รูป`, '', 2600);
  }, 350);
}
(function () {
  const _rd = readImage;
  // อ่านรูปพร้อมแจ้งสถานะ · จับเวลา · ตรวจว่าเปิดเป็นรูปได้จริง
  readImage = function (f) {
    IML.n++; clearTimeout(IML.wait); clearTimeout(IML.e); const nm = (f && f.name) || 'รูปที่วาง';
    imlShow('', `กำลังโหลดรูป ${IML.done + 1}/${IML.n}…`, nm + (f && f.size ? ' · ' + imlSize(f.size) : ''));
    const fail = why => { IML.bad.push(nm + ' — ' + why); IML.done++; imlEnd(); const e = new Error(why); e.iml = 1; throw e; };
    if (!f || !f.size) { try { fail('ไฟล์ยังไม่ถูกดาวน์โหลดจากคลาวด์ หรือเป็นไฟล์ว่าง'); } catch (e) { return Promise.reject(e); } }
    let to; const slow = setTimeout(() => imlShow('', `กำลังโหลดรูป… ไฟล์มาจากคลาวด์ อาจใช้เวลาสักครู่`, nm + ' · ' + imlSize(f.size)), 4000);
    const timeout = new Promise((_, rej) => { to = setTimeout(() => rej(new Error('timeout')), 90000); });
    return Promise.race([_rd(f), timeout]).then(async src => {
      // ตรวจว่ารูปเปิดได้จริง (เช่น HEIC บนบางเบราว์เซอร์เปิดไม่ได้)
      const ok = await new Promise(r => { const im = new Image(); im.onload = () => r(im.naturalWidth > 0 || /svg/.test(src.slice(0, 40))); im.onerror = () => r(false); im.src = src; });
      if (!ok) throw new Error('decode'); return src;
    }).then(src => { IML.done++; imlEnd(); return src; }, err => {
      const why = err && err.message === 'timeout' ? 'รอนานเกิน 90 วินาที (ตรวจอินเทอร์เน็ต แล้วลองอีกครั้ง)' : err && err.message === 'decode' ? 'เบราว์เซอร์เปิดไฟล์ชนิดนี้ไม่ได้ (ลองแปลงเป็น JPG/PNG)' : 'อ่านไฟล์ไม่ได้ (ไฟล์บนคลาวด์อาจยังดาวน์โหลดไม่เสร็จ)';
      try { fail(why); } catch (e) { throw e; }
    }).finally(() => { clearTimeout(to); clearTimeout(slow); });
  };
  // รูปหนึ่งเสียต้องไม่ทำให้รูปที่เหลือหาย · ไฟล์ที่ไม่มีชนิด (จากคลาวด์) ให้ดูจากนามสกุล
  addImages = async function (files) {
    const all = [...files].filter(Boolean), list = all.filter(imlIsImg);
    if (!list.length) { if (all.length) imlShow('bad', 'ไฟล์ที่เลือกไม่ใช่รูปภาพ', all.map(f => f.name || '').join(' · ')); return; }
    const bs = []; for (const f of list) { try { bs.push(newBlock('image', { src: await readImage(f), w: 60 })); } catch (e) { if (!e.iml) console.warn(e); } }
    if (bs.length) insertBlocks(bs);
  };
  // ระหว่างรอหน้าต่างเลือกไฟล์ (คลาวด์กำลังดาวน์โหลดให้) → บอกว่ากำลังรอ · ยกเลิก → ซ่อน
  const inp = $('#imgIn'); if (!inp) return;
  inp.addEventListener('click', () => { clearTimeout(IML.wait); IML.wait = setTimeout(() => { if (!IML.n) imlShow('', 'กำลังรอรูปจากหน้าต่างเลือกไฟล์…', 'รูปบน iCloud / Google Drive ต้องดาวน์โหลดก่อน อาจใช้เวลาสักครู่'); }, 2500); });
  inp.addEventListener('cancel', () => { if (!IML.n) imlHide(); });
  addEventListener('focus', () => setTimeout(() => { if (!IML.n && !inp.files.length && $('#imlBox.on:not(.ok):not(.bad)')) { clearTimeout(IML.wait); IML.wait = setTimeout(() => { if (!IML.n) imlHide(); }, 6000); } }, 300));
  const _ch = inp.onchange;
  inp.onchange = async function (e) { clearTimeout(IML.wait); const fs = [...e.target.files]; if (fs.length && !fs.some(imlIsImg)) { imlShow('bad', 'ไฟล์ที่เลือกไม่ใช่รูปภาพ', fs.map(f => f.name).join(' · ')); e.target.value = ''; return; } try { return await _ch.call(this, e); } catch (err) { if (!err || !err.iml) { console.warn(err); imlShow('bad', 'แทรกรูปไม่สำเร็จ', String(err && err.message || err)); } e.target.value = ''; } };
})();


/* ---------- รายการแบบกำหนดเอง: หัวข้อย่อย 1.1 / 1.1.1 · A) a) (ก) · ข้อความนำหน้า/ต่อท้าย · เลขเริ่มต้น ---------- */
const LX_NUM = [['decimal', '1 2 3'], ['lower-alpha', 'a b c'], ['upper-alpha', 'A B C'], ['thai-alpha', 'ก ข ค'], ['thai', '๑ ๒ ๓'], ['lower-roman', 'i ii iii'], ['upper-roman', 'I II III']];
const LX_OLD = { 'decimal': ['decimal', '', '.'], 'dec-paren': ['decimal', '', ')'], 'paren-dec': ['decimal', '(', ')'], 'lower-alpha': ['lower-alpha', '', '.'], 'upper-alpha': ['upper-alpha', '', '.'], 'lower-roman': ['lower-roman', '', '.'], 'upper-roman': ['upper-roman', '', '.'], 'thai-alpha': ['thai-alpha', '', '.'], 'thai': ['thai', '', '.'] };
function lxNum(ln, k) {
  k = Math.max(1, k | 0);
  const al = (s, n) => { let o = ''; while (n > 0) { n--; o = s[n % s.length] + o; n = Math.floor(n / s.length); } return o; };
  switch (ln) {
    case 'lower-alpha': return al('abcdefghijklmnopqrstuvwxyz', k); case 'upper-alpha': return al('ABCDEFGHIJKLMNOPQRSTUVWXYZ', k);
    case 'thai-alpha': return al(THAI_AL, k); case 'thai': return String(k).replace(/\d/g, d => '๐๑๒๓๔๕๖๗๘๙'[d]);
    case 'lower-roman': return toRoman(k); case 'upper-roman': return toRoman(k).toUpperCase(); default: return String(k);
  }
}
function lxUnNum(ln, s) { // ข้อความเลข → ลำดับ
  const al = (set) => { let n = 0; for (const ch of s) { const i = set.indexOf(ch); if (i < 0) return 0; n = n * set.length + i + 1; } return n; };
  switch (ln) {
    case 'lower-alpha': return al('abcdefghijklmnopqrstuvwxyz'); case 'upper-alpha': return al('ABCDEFGHIJKLMNOPQRSTUVWXYZ'); case 'thai-alpha': return al(THAI_AL);
    case 'thai': return +s.replace(/[๐-๙]/g, d => '๐๑๒๓๔๕๖๗๘๙'.indexOf(d)) || 0;
    case 'lower-roman': case 'upper-roman': { const v = { i: 1, v: 5, x: 10, l: 50, c: 100, d: 500, m: 1000 }; let n = 0; const t = s.toLowerCase(); for (let i = 0; i < t.length; i++) { const a = v[t[i]], b = v[t[i + 1]] || 0; if (!a) return 0; n += a < b ? -a : a; } return n; }
    default: return +s || 0;
  }
}
const lxDepth = lst => { let d = 0; for (let a = lst.parentElement; a; a = a.parentElement) if (/^(OL|UL)$/.test(a.tagName)) d++; return d; };
const lxParentLi = lst => { const p = lst.parentElement; if (!p) return null; if (p.tagName === 'LI') return p; if (/^(OL|UL)$/.test(p.tagName)) { let s = lst.previousElementSibling; while (s && s.tagName !== 'LI') s = s.previousElementSibling; return s; } return null; };
function lxSpec(lst) { // [ชนิดเลข, นำหน้า, ต่อท้าย]
  const d = lst.dataset;
  if (d.lf) return [d.ln || 'decimal', d.lm ? lxAutoPrefix(lst) : (d.lp || ''), d.lx || ''];
  return LX_OLD[d.ls] || LX_OLD[['decimal', 'lower-alpha', 'lower-roman'][Math.min(lxDepth(lst), 2)]];
}
const lxIndex = li => { const lst = li.parentElement; return [...lst.children].filter(c => c.tagName === 'LI').indexOf(li) + (+(lst.getAttribute('start') || 1)); };
function lxCore(li) { const lst = li.parentElement; if (!lst || lst.tagName !== 'OL') return ''; const s = lxSpec(lst); return s[1].replace(/^\(/, '') + lxNum(s[0], lxIndex(li)); }
function lxAutoPrefix(lst) { const p = lxParentLi(lst); const c = p ? lxCore(p) : ''; return c ? c + '.' : ''; }
function listMarkerOf(li) { const s = lxSpec(li.parentElement); return s[1] + lxNum(s[0], lxIndex(li)) + s[2]; }
// ปรับรายการให้ถูกต้อง: รายการย่อยของแบบหลายระดับ → เลขตามหัวข้อแม่ · สร้างรูปแบบตัวนับ
let LX_SIG = '';
function lxFix(root) {
  root = root || document;
  $$('ol', root).forEach(lst => {
    const d = lst.dataset; if (d.lf || d.ls) return; const pl = lxParentLi(lst), pp = pl && pl.parentElement; if (!pp || pp.tagName !== 'OL' || !pp.dataset.lf) return;
    if ((pp.dataset.ln || 'decimal') === 'decimal' && (pp.dataset.lm || /\.$/.test(pp.dataset.lp || '')) && !(pp.dataset.lx || '')) { d.lf = '1'; d.ln = 'decimal'; d.lm = '1'; d.lx = ''; }
  });
  $$('ol[data-lf]', root).forEach(lst => { const d = lst.dataset; if (d.lm) { const p = lxAutoPrefix(lst); if (d.lp !== p) d.lp = p; } if (d.lp == null) d.lp = ''; if (d.lx == null) d.lx = ''; if (!d.ln) d.ln = 'decimal'; });
  const keys = new Map(); $$('ol[data-lf]').forEach(lst => { const d = lst.dataset; keys.set(d.ln + '\u0001' + d.lp + '\u0001' + d.lx, [d.ln, d.lp, d.lx]); });
  const sig = [...keys.keys()].sort().join('\u0002'); if (sig === LX_SIG) return; LX_SIG = sig;
  let st = $('#lxCss'); if (!st) { st = document.createElement('style'); st.id = 'lxCss'; document.head.appendChild(st); }
  const q = s => '"' + String(s).replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, ' ') + '"'; let css = '', i = 0;
  keys.forEach(([ln, lp, lx]) => {
    const nm = 'npl' + (i++); const w = [...(lp + lx)].length + (ln === 'decimal' || ln === 'thai' ? 2 : /roman/.test(ln) ? 3 : 1.6);
    css += `@counter-style ${nm}{system:extends ${ln};prefix:${q(lp)};suffix:${q(lx + ' ')}}\n:is(#flow,html) ol[data-lf][data-ln=${q(ln)}][data-lp=${q(lp)}][data-lx=${q(lx)}]{list-style-type:${nm};padding-left:${Math.max(2, (w * 0.5 + 0.9)).toFixed(2)}em}\n`;
  });
  st.textContent = css; try { CSS_CACHE = null; } catch (e) { }
}
function lxApply(lst, o) {
  const d = lst.dataset; d.lf = '1'; d.ln = o.ln || 'decimal'; d.lp = o.lp || ''; d.lx = o.lx || ''; delete d.ls; lst.style.listStyleType = '';
  if (o.lm) d.lm = '1'; else delete d.lm; if (o.start > 1) lst.setAttribute('start', o.start); else if (o.start != null) lst.removeAttribute('start');
}
function lxParse(text, ln0) { // "7.1" "C)" "(ค)" "ข้อ 3." → {lp, ln, start, lx}
  const t = String(text || '').replace(/​/g, ''); let m;
  if ((m = /^(.*?)(\d+)(\D*)$/.exec(t))) return { lp: m[1], ln: 'decimal', start: +m[2] || 1, lx: m[3] };
  if ((m = /^(.*?)([๐-๙]+)([^๐-๙]*)$/.exec(t))) return { lp: m[1], ln: 'thai', start: lxUnNum('thai', m[2]) || 1, lx: m[3] };
  if (/roman/.test(ln0 || '') && (m = /^(.*?)([ivxlcdm]+|[IVXLCDM]+)([^A-Za-z]*)$/.exec(t)) && lxUnNum('lower-roman', m[2])) return { lp: m[1], ln: /[a-z]/.test(m[2]) ? 'lower-roman' : 'upper-roman', start: lxUnNum('lower-roman', m[2]), lx: m[3] };
  if ((m = /^(.*?)([A-Za-zก-ฮ])([^A-Za-zก-ฮ]*)$/.exec(t))) { const ln = /[a-z]/.test(m[2]) ? 'lower-alpha' : /[A-Z]/.test(m[2]) ? 'upper-alpha' : 'thai-alpha'; return { lp: m[1], ln, start: lxUnNum(ln, m[2]) || 1, lx: m[3] }; }
  return null;
}
function lxCurList(make) { restoreSel(); let li = curLi(); if ((!li || li.parentElement.tagName !== 'OL') && make) { listToggle('ol'); li = curLi(); } return li && li.parentElement.tagName === 'OL' ? li.parentElement : null; }
function lxDone(lst) { lxFix(); const ed = lst.closest('[contenteditable="true"]'); if (ed) syncFrom(ed); if (typeof schedulePaginate === 'function') schedulePaginate(); }
function lxPreset(o) { const lst = lxCurList(true); if (!lst) { toast('คลิกตำแหน่งในข้อความก่อน'); return; } lxApply(lst, Object.assign({ start: null }, o)); lxDone(lst); }
function lxMulti() {
  const lst = lxCurList(true); if (!lst) { toast('คลิกตำแหน่งในข้อความก่อน'); return; }
  const pl = lxParentLi(lst), nested = pl && pl.parentElement.tagName === 'OL', subs = $$('ol', lst);
  if (nested) { lxApply(lst, { ln: 'decimal', lm: 1, lx: '', start: null }); subs.forEach(s => lxApply(s, { ln: 'decimal', lm: 1, lx: '', start: null })); lxDone(lst); return; }
  if (subs.length) { subs.forEach(s => lxApply(s, { ln: 'decimal', lm: 1, lx: '', start: null })); lxDone(lst); toast('รายการย่อยเป็น 1.1 · 1.1.1 ตามหัวข้อแม่แล้ว'); return; }
  lxCustom('1.1');
}
async function lxCustom(first) {
  let lst = lxCurList(true); if (!lst) { toast('คลิกตำแหน่งในข้อความก่อน'); return; }
  const li0 = curLi(), sp = lxSpec(lst), st0 = +(lst.getAttribute('start') || 1), pl = lxParentLi(lst), nested = !!(pl && pl.parentElement.tagName === 'OL');
  const S = { ln: sp[0], lp: lst.dataset.lm ? '' : sp[1], lx: sp[2], start: st0, lm: !!lst.dataset.lm };
  if (first) { const p = lxParse(first); if (p) Object.assign(S, p, { lm: false }); }
  const show = () => (S.lm ? '' : S.lp) + lxNum(S.ln, S.start) + S.lx;
  const html = `<div class="lxd"><label>พิมพ์เลขแรกตามที่ต้องการ <small>เช่น 7.1 · 2.3.1 · C) · (ค) · ข้อ 3.</small><input id="lxFirst" value="${esc(show())}" autocomplete="off"></label>
<label>ชนิดตัวนับ<select id="lxLn">${LX_NUM.map(([k, n]) => `<option value="${k}">${n}</option>`).join('')}</select></label>
<label class="ck"${nested ? '' : ' style="display:none"'}><input type="checkbox" id="lxLm"> นำหน้าด้วยเลขของหัวข้อแม่อัตโนมัติ (เช่น แม่เป็น 2. → 2.1, 2.2)</label>
<div class="lxp">ตัวอย่าง: <b id="lxPv"></b></div></div>`;
  const pr = ask('รูปแบบเลขรายการ', html, 'ใช้รูปแบบนี้');
  const f = $('#lxFirst'), sel = $('#lxLn'), lm = $('#lxLm'), pv = $('#lxPv'); sel.value = S.ln; lm.checked = S.lm;
  const prev = () => { const pre = S.lm ? (lxAutoPrefix(lst) || '') : S.lp; pv.textContent = [0, 1, 2].map(i => pre + lxNum(S.ln, S.start + i) + S.lx).join('   '); };
  f.oninput = () => { const p = lxParse(f.value, sel.value); if (p) { if (S.lm) p.lp = ''; Object.assign(S, p); sel.value = S.ln; } prev(); };
  sel.onchange = () => { S.ln = sel.value; f.value = show(); prev(); };
  lm.onchange = () => { S.lm = lm.checked; if (S.lm) S.lp = ''; f.value = show(); prev(); };
  prev(); setTimeout(() => { f.focus(); f.select(); }, 60);
  if (!(await pr)) return;
  if (!lst.isConnected) { restoreSel(); const li = curLi(); lst = li && li.parentElement; if (!lst || lst.tagName !== 'OL') return; }
  lxApply(lst, S); lxDone(lst);
}
(function () {
  const css = document.createElement('style');
  css.textContent = `.lxd{display:flex;flex-direction:column;gap:10px;min-width:min(420px,80vw)}.lxd label{display:flex;flex-direction:column;gap:3px;font-size:16px}.lxd label small{color:#8a7f76;font-size:13.5px}.lxd label.ck{flex-direction:row;align-items:center;gap:8px}
.lxd input:not([type=checkbox]),.lxd select{font:inherit;font-size:18px;padding:6px 10px;border:1px solid #d9cfc4;border-radius:8px}.lxd .lxp{background:#f6f2ec;border-radius:8px;padding:8px 12px;font-size:17px}.lxd .lxp b{white-space:pre}`;
  document.head.appendChild(css);
  // เมนูรูปแบบรายการ: เพิ่มหมวดหัวข้อย่อย + กำหนดเอง
  const m = $('#mLs'); if (m) {
    const old = $('[data-ls="start"]', m); const hd = old && old.previousElementSibling; if (hd && hd.classList.contains('hd')) hd.remove(); if (old) old.remove();
    const PRE = [['1.1  1.2  1.3 (หัวข้อย่อย)', 'multi'], ['A)  B)  C)', { ln: 'upper-alpha', lx: ')' }], ['a)  b)  c)', { ln: 'lower-alpha', lx: ')' }], ['(a)  (b)  (c)', { ln: 'lower-alpha', lp: '(', lx: ')' }], ['ก)  ข)  ค)', { ln: 'thai-alpha', lx: ')' }], ['(ก)  (ข)  (ค)', { ln: 'thai-alpha', lp: '(', lx: ')' }]];
    const box = document.createElement('div'); box.innerHTML = `<div class="hd">หัวข้อย่อย / แบบอื่น</div>${PRE.map((p, i) => `<button data-lxp="${i}">${p[0]}</button>`).join('')}<div class="hd">กำหนดเอง</div><button data-lxp="c">✎ กำหนดรูปแบบ / เลขเริ่มต้น…</button>`;
    const first = m.firstChild; while (box.firstChild) m.insertBefore(box.firstChild, null);
    m.addEventListener('click', e => { const x = e.target.closest('[data-lxp]'); if (!x) return; e.stopPropagation(); closeMenus(); const k = x.dataset.lxp; if (k === 'c') lxCustom(); else if (PRE[+k][1] === 'multi') lxMulti(); else lxPreset(PRE[+k][1]); }, true);
    // เลือกแบบเดิม (1. a. ก.) → ล้างรูปแบบกำหนดเอง
    m.addEventListener('click', e => { const x = e.target.closest('[data-ls]'); if (!x) return; setTimeout(() => { const li = curLi(), lst = li && li.parentElement; if (lst && lst.dataset.lf) { ['lf', 'ln', 'lp', 'lx', 'lm'].forEach(k => delete lst.dataset[k]); lxDone(lst); } }, 0); });
  }
  const _sync = syncFrom; syncFrom = function (el) { try { if (el && el.querySelector && el.querySelector('ol')) lxFix(el.closest('.blk') || el); } catch (e) { } return _sync.apply(this, arguments); };
  const _ra = renderAll; renderAll = function () { const r = _ra.apply(this, arguments); try { lxFix(); } catch (e) { } return r; };
  if (typeof rerender === 'function') { const _rr = rerender; rerender = function () { const r = _rr.apply(this, arguments); try { lxFix(); } catch (e) { } return r; }; }
  setTimeout(() => { try { lxFix(); } catch (e) { } }, 300);
  // พิมพ์ "A) " หรือ "ก) " ต้นบรรทัด → รายการอัตโนมัติ
  flowEl.addEventListener('keydown', e => {
    if (e.key !== ' ' || e.isComposing) return; const t = e.target.closest && e.target.closest('[contenteditable="true"]'); if (!t || curLi()) return;
    const blk = t.closest('.blk'); if (!blk || ONE_LINE.has(blk.dataset.t) || t.dataset.cell || t.dataset.pf) return;
    const s = getSelection(); if (!s.rangeCount || !s.isCollapsed) return; const r = s.getRangeAt(0), n = r.startContainer; if (n.nodeType !== 3) return;
    const p = n.previousSibling; if (p && p.nodeName !== 'BR') return; if (n.parentElement !== t && !/^(DIV|P)$/.test(n.parentElement.tagName)) return;
    const m2 = /^\s*(?:([A-Z])\)|([ก-ฮ])\)|\(([a-zก-ฮ])\))$/.exec(n.nodeValue.slice(0, r.startOffset).replace(/​/g, '')); if (!m2) return;
    e.preventDefault(); e.stopImmediatePropagation(); const o = lxParse(m2[0].trim()); n.nodeValue = n.nodeValue.slice(r.startOffset) || '​';
    lineToList(t, n, 0, 'ol', null, 0); const li = curLi(); if (li) { lxApply(li.parentElement, o); lxDone(li.parentElement); }
  }, true);
})();


/* ---------- บันทึกลงไฟล์ในเครื่อง: แก้จุดอ่อน + บันทึกอัตโนมัติ + แสดงสถานะ ---------- */
const LFX = { dirty: new Set(), saved: {}, need: {}, err: {}, q: Promise.resolve(), t: null };
// ไม่เก็บรหัสผูกไฟล์ (lfid) ลงในไฟล์ → ไฟล์ที่ถูกทำสำเนา/ย้าย จะไม่ไปบันทึกทับไฟล์ต้นฉบับ
lfData = function (d) { d = Object.assign({}, d || doc); delete d.lfid; if (d.cloud && d.cloud.id) d.cloud = { id: d.cloud.id, folder: d.cloud.folder || '' }; else delete d.cloud; return JSON.stringify(d); };
function lfxWrite(h, text) { const run = async () => { const w = await h.createWritable(); try { await w.write(text); await w.close(); } catch (e) { try { await w.abort(); } catch (e2) { } throw e; } }; const p = LFX.q.then(run, run); LFX.q = p.catch(() => { }); return p; }
const lfxTime = () => { const d = new Date(); return String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0'); };
function lfxStat() {
  let el = $('#lfStat'); if (!el) { const a = $('#clStat'); if (!a) return; el = document.createElement('span'); el.id = 'lfStat'; el.style.cssText = 'font-size:14px;white-space:nowrap;cursor:pointer;padding:2px 8px;border-radius:999px'; a.after(el); el.onclick = () => $('#bSave').click(); }
  const h = typeof lfGet === 'function' && lfGet(), k = doc && doc.lfid; if (!h) { el.style.display = 'none'; return; }
  el.style.display = ''; const nm = h.name.replace(/\.(json|npress)$/i, '');
  let t, c = '#6b7280', bg = 'transparent';
  if (LFX.err[k]) { t = '💾 บันทึกลงเครื่องไม่ได้ · กดเพื่อบันทึก'; c = '#b91c1c'; bg = '#fee2e2'; }
  else if (LFX.dirty.has(k)) { if (LFX.need[k]) { t = '💾 ยังไม่ได้บันทึกลงเครื่อง · กดเพื่อบันทึก'; c = '#9a3412'; bg = '#ffedd5'; } else t = '💾 กำลังจะบันทึก…'; }
  else t = '💾 ' + (LFX.saved[k] ? 'บันทึกลงเครื่องแล้ว ' + LFX.saved[k] : nm);
  el.textContent = t; el.style.color = c; el.style.background = bg; el.title = `ไฟล์ในเครื่อง: ${h.name}\nบันทึกอัตโนมัติหลังแก้ไข · กดเพื่อบันทึกทันที`;
}
// บันทึกอัตโนมัติทุกงานที่ผูกไฟล์ในเครื่องและมีการแก้ไข (รวมแท็บที่ไม่ได้เปิดอยู่)
async function lfxFlush() {
  if (!LFX.dirty.size || document.body.classList.contains('exporting')) return;
  await lfLoad(); const docs = (typeof TB !== 'undefined' && TB.list.length ? TB.list.map((t, i) => i === TB.i ? doc : t.doc) : [doc]);
  for (const k of [...LFX.dirty]) {
    const d = docs.find(x => x && x.lfid === k), h = LFH.map.get(k); if (!d || !h) { LFX.dirty.delete(k); continue; }
    try {
      if (h.queryPermission && (await h.queryPermission({ mode: 'readwrite' })) !== 'granted') { LFX.need[k] = 1; continue; }
      const text = lfData(d); await lfxWrite(h, text); if (lfData(d) === text) LFX.dirty.delete(k); delete LFX.need[k]; delete LFX.err[k]; LFX.saved[k] = lfxTime();
    } catch (e) { LFX.err[k] = (e && e.name) || 'err'; }
  }
  lfxStat();
}
(function () {
  const pick = () => showSaveFilePicker({ suggestedName: fname('npress'), types: [{ description: 'ไฟล์ Newton Press', accept: { 'application/x-newton-press': ['.npress'] } }] });
  saveLocal = async function (asNew) {
    await lfLoad();
    if (!window.showSaveFilePicker) { // Safari / iPad: เบราว์เซอร์ไม่ยอมให้เขียนทับไฟล์เดิม → ได้เป็นไฟล์ดาวน์โหลด
      doc.lfl = 1; const ok = await saveFile(fname('npress'), lfData()); if (ok) setTimeout(() => toast('บันทึกเป็นไฟล์ดาวน์โหลดแล้ว · Safari เขียนทับไฟล์เดิมไม่ได้ (ถ้าต้องการบันทึกทับไฟล์เดิม ให้เปิดแอปด้วย Chrome)', 6000), 800); return ok;
    }
    let h = !asNew && lfGet(), k0 = doc.lfid;
    try {
      if (h && h.queryPermission && (await h.queryPermission({ mode: 'readwrite' })) !== 'granted') { if ((await h.requestPermission({ mode: 'readwrite' })) !== 'granted') { toast('ยังไม่ได้รับอนุญาตให้แก้ไฟล์ “' + h.name + '” · กดบันทึกอีกครั้งแล้วเลือก “อนุญาต”', 5000); LFX.need[k0] = 1; lfxStat(); return false; } }
      if (h) { try { await lfxWrite(h, lfData()); } catch (e) { if (e && e.name === 'AbortError') throw e; const nm = h.name; h = null; toast(`เขียนทับ “${nm}” ไม่ได้ (ไฟล์อาจถูกย้าย ลบ หรือเปลี่ยนชื่อ) · เลือกที่เก็บใหม่`, 5000); } }
      if (!h) {
        try { h = await pick(); } catch (e) { if (e && e.name === 'AbortError') return false; if (k0) { LFX.err[k0] = 1; lfxStat(); } toast('กด “บันทึก” อีกครั้งเพื่อเลือกที่เก็บไฟล์ใหม่'); if (k0 && LFH.map.has(k0) && !asNew) { LFH.map.delete(k0); await lfStore(); } return false; }
        if (asNew) delete doc.lfid; await lfSet(h); const nm = h.name.replace(/\.(json|npress)$/i, ''); if (nm && nm !== doc.settings.name) { doc.settings.name = nm; changed(true); }
        await lfxWrite(h, lfData());
      }
      const k = doc.lfid; LFX.dirty.delete(k); delete LFX.need[k]; delete LFX.err[k]; LFX.saved[k] = lfxTime(); doc.lfl = 1; lfBadge(); lfxStat();
      toast(`บันทึกลงไฟล์ “${h.name}” แล้ว`); return true;
    } catch (e) { if (e && e.name === 'AbortError') return false; if (doc.lfid) LFX.err[doc.lfid] = 1; lfxStat(); toast('บันทึกลงเครื่องไม่สำเร็จ: ' + (e.message || e), 5000); return false; }
  };
  openLocal = async function () {
    if (typeof tabFull === 'function' && tabFull()) { toast(`เปิดได้พร้อมกันสูงสุด ${TABMAX} แท็บ · ปิดแท็บที่ไม่ใช้ก่อน`, 3500); return; }
    try {
      const [h] = await showOpenFilePicker({ types: [{ description: 'ไฟล์ Newton Press', accept: { 'application/x-newton-press': ['.npress'], 'application/json': ['.json'] } }] }); await lfOpenHandle(h);
    } catch (e) { if (!(e && e.name === 'AbortError')) toast('เปิดไฟล์ไม่ได้: ' + (e.message || e)); }
  };
  // เปิดไฟล์จาก handle (ใช้ทั้งปุ่มเปิดไฟล์ และดับเบิลคลิกไฟล์ .npress ในเครื่อง)
  window.lfOpenHandle = async function (h) {
    if (typeof tabFull === 'function' && tabFull()) { toast(`เปิดได้พร้อมกันสูงสุด ${TABMAX} แท็บ · ปิดแท็บที่ไม่ใช้ก่อน`, 3500); return; }
    try {
      await lfLoad();
      // ไฟล์นี้เปิดอยู่แล้วในอีกแท็บ → สลับไปแท็บนั้น (กันสองแท็บบันทึกทับกัน)
      if (typeof TB !== 'undefined') for (let j = 0; j < TB.list.length; j++) { const d = j === TB.i ? doc : TB.list[j].doc, o = d && d.lfid && LFH.map.get(d.lfid); let same = false; try { same = !!o && await o.isSameEntry(h); } catch (e) { } if (same) { if (j !== TB.i) await tabGo(j); toast(`“${h.name}” เปิดอยู่แล้วในแท็บนี้`); return; } }
      const f = await h.getFile(); let data; try { data = JSON.parse(await f.text()); } catch (e) { throw new Error('ไฟล์เสียหายหรือไม่ใช่ไฟล์ของ Newton Press'); } if (!data || !data.blocks) throw new Error('ไม่ใช่ไฟล์ของ Newton Press');
      delete data.lfid; data.lfl = 1; data.settings = Object.assign(sampleDoc().settings, data.settings || {}); data.settings.name = f.name.replace(/\.(json|npress)$/i, '') || data.settings.name; if (!(data.cloud && data.cloud.id)) delete data.cloud;
      doc = data; curId = null; applySettings(); renderAll();
      if (doc !== data) return; // เปิดไม่ได้ (เช่น แท็บเต็ม) → ไม่ผูกไฟล์กับงานเดิม
      await lfSet(h); hist.stack = []; hist.pos = -1; snapshot(); autosave(); refreshInspector(); $('#scroller').scrollTop = 0; if (typeof clStatus === 'function') clStatus();
      LFX.dirty.delete(doc.lfid); LFX.saved[doc.lfid] = ''; lfxStat(); if (typeof tplAsk === 'function') setTimeout(() => tplAsk(true), 700); toast(`เปิด “${f.name}” แล้ว · แก้ไขแล้วจะบันทึกลงไฟล์นี้ให้อัตโนมัติ`);
    } catch (e) { if (!(e && e.name === 'AbortError')) toast('เปิดไฟล์ไม่ได้: ' + (e.message || e)); }
  };
  // ย้อนกลับ/ทำซ้ำ ต้องไม่ทำให้งานหลุดจากไฟล์ในเครื่อง / Drive
  const _rs = restore; restore = function (pos) { const k = doc && doc.lfid, l = doc && doc.lfl, c = doc && doc.cloud; const r = _rs.apply(this, arguments); if (doc) { if (k) doc.lfid = k; else delete doc.lfid; if (l) doc.lfl = 1; if (c) doc.cloud = Object.assign({}, c, { dirty: true }); else delete doc.cloud; } if (k) { LFX.dirty.add(k); kick(); } lfBadge(); lfxStat(); return r; };
  const kick = () => { clearTimeout(LFX.t); LFX.t = setTimeout(lfxFlush, 5000); };
  const _ch = changed; changed = function () { const r = _ch.apply(this, arguments); if (doc && doc.lfid && LFH.map.has(doc.lfid)) { const was = LFX.dirty.has(doc.lfid); LFX.dirty.add(doc.lfid); kick(); if (!was) lfxStat(); } return r; };
  setInterval(lfxFlush, 30000);
  const _lb = lfBadge; lfBadge = function () { const r = _lb.apply(this, arguments); try { lfxStat(); } catch (e) { } return r; };
  const _ra = renderAll; renderAll = function () { const r = _ra.apply(this, arguments); try { lfxStat(); } catch (e) { } return r; };
  if (typeof tabGo === 'function') { const _tg = tabGo; tabGo = async function () { try { await lfxFlush(); } catch (e) { } const r = await _tg.apply(this, arguments); lfBadge(); return r; }; }
  // ปิดแท็บงานที่ผูกไฟล์ในเครื่อง: บันทึกให้ก่อน แล้วปิดได้เลย (ไม่ต้องเตือนว่างานจะหาย)
  if (typeof tabClose === 'function') { const _tc = tabClose; tabClose = async function (j) { try { const d = j === TB.i ? doc : TB.list[j] && TB.list[j].doc; if (d && d.lfid && LFH.map.has(d.lfid) && !(d.cloud && d.cloud.id)) { await lfxFlush(); if (!LFX.dirty.has(d.lfid)) TB.list[j].fresh = true; } } catch (e) { } return _tc.apply(this, arguments); }; }
  addEventListener('visibilitychange', () => { if (document.hidden) lfxFlush(); });
  addEventListener('pagehide', () => { lfxFlush(); });
  addEventListener('beforeunload', e => { if ([...LFX.dirty].some(k => LFH.map.has(k))) { lfxFlush(); e.preventDefault(); e.returnValue = ''; } });
  // Safari: งานที่เปิดจากไฟล์ในเครื่อง กดบันทึก = ได้ไฟล์เลย ไม่ต้องถามทุกครั้ง
  const bs = $('#bSave'); if (bs && !window.showSaveFilePicker) { const _sv = bs.onclick; bs.onclick = function (e) { if (doc.lfl && !(doc.cloud && doc.cloud.id)) return saveLocal(false); return _sv && _sv.call(this, e); }; }
  lfLoad().then(() => { lfBadge(); });
})();


/* ---------- กันหน้าจอกระโดดเมื่อกด Enter / ย้ายเคอร์เซอร์ด้วยโปรแกรม (Safari เลื่อนเองตอน focus) ---------- */
(function () {
  const sc = $('#scroller'); if (!sc) return;
  const caretRect = () => {
    const s = getSelection(); if (!s.rangeCount) return null; const r = s.getRangeAt(0); let n = r.startContainer; const el = n.nodeType === 1 ? n : n.parentElement; if (!el || !el.closest || !el.closest('#flow')) return null;
    let rc = r.getClientRects()[0];
    if (!rc || (!rc.height && !rc.width && !rc.top)) { // บรรทัดว่าง: ใช้ตำแหน่งของโหนดถัดจากเคอร์เซอร์ หรือกล่องข้อความ
      const c = n.nodeType === 1 ? (n.childNodes[r.startOffset] || n.childNodes[r.startOffset - 1]) : null; const e2 = c && c.nodeType === 1 ? c : el; rc = e2.getBoundingClientRect();
      if (c && c.nodeType === 1 && c.tagName === 'BR') rc = { top: rc.top, bottom: rc.bottom || rc.top + 24 }; else if (e2 === el && rc.height > 80) return null;
    }
    return rc;
  };
  // เลื่อนเท่าที่จำเป็นให้เห็นเคอร์เซอร์ (ไม่จัดกลางจอ)
  const reveal = () => { const rc = caretRect(); if (!rc) return; const v = sc.getBoundingClientRect(), top = v.top + 24, bot = v.bottom - 48; if (rc.bottom > bot) sc.scrollTop += rc.bottom - bot; else if (rc.top < top) sc.scrollTop -= top - rc.top; };
  window.npReveal = reveal;
  // focus ในหน้ากระดาษ: ไม่ให้เบราว์เซอร์เลื่อนเอง
  const _focus = HTMLElement.prototype.focus;
  HTMLElement.prototype.focus = function (o) { if (this.closest && this.closest('#flow') && !(o && o.preventScroll)) { const y = sc.scrollTop; _focus.call(this, { preventScroll: true }); if (sc.scrollTop !== y) sc.scrollTop = y; return; } return _focus.apply(this, arguments); };
  // Enter: ตรึงตำแหน่งหน้าจอไว้ แล้วเลื่อนเฉพาะเมื่อเคอร์เซอร์หลุดจอ
  let pin = null;
  addEventListener('keydown', e => {
    if (e.key !== 'Enter' || e.isComposing || !(e.target.closest && e.target.closest('#flow'))) return;
    const y = sc.scrollTop, id = {}; pin = id;
    const fix = () => { if (pin !== id) return; if (Math.abs(sc.scrollTop - y) > 2) sc.scrollTop = y; reveal(); };
    setTimeout(fix, 0); requestAnimationFrame(() => { fix(); requestAnimationFrame(fix); }); setTimeout(fix, 60); setTimeout(fix, 140); setTimeout(() => { if (pin === id) pin = null; }, 160);
  }, true);
  ['wheel', 'touchmove', 'mousedown'].forEach(k => addEventListener(k, () => { pin = null; }, { passive: true, capture: true }));
  addEventListener('keydown', e => { if (e.key !== 'Enter') pin = null; }, true);
  // จัดหน้าใหม่แล้วเคอร์เซอร์ตกไปหน้าถัดไป → เลื่อนตามทันที (ไม่ปล่อยให้หลุดจอแล้วค่อยกระโดดตอนกดปุ่มถัดไป)
  if (typeof paginate === 'function') { const _pg = paginate; paginate = function () { const rc0 = caretRect(), v = sc.getBoundingClientRect(), vis = rc0 && rc0.bottom > v.top && rc0.top < v.bottom && document.activeElement && document.activeElement.closest && document.activeElement.closest('#flow'); const r = _pg.apply(this, arguments); if (vis) { try { reveal(); } catch (e) { } Promise.resolve(r).then(() => { try { reveal(); } catch (e) { } }); } return r; }; }
})();

/* ---------- หลังกดปุ่มในแถบเครื่องมือ/แผงข้าง โฟกัสหลุดจากข้อความ: พิมพ์ต่อได้ที่เดิม ----------
   เดิม: Enter = เคอร์เซอร์กระโดดไปช่องแรกของกล่องที่เลือกไว้ (หน้าจอเลื่อนไปไกล) · Backspace = ลบทั้งกล่อง/ทั้งตาราง */
addEventListener('keydown', e => {
  if (e.isComposing || e.metaKey || e.ctrlKey || e.altKey) return;
  if (typeof dlgOpen === 'function' && dlgOpen()) return;
  if (typeof blockMode !== 'undefined' && blockMode) return; if (typeof selSet !== 'undefined' && selSet.size > 1) return;
  const a = document.activeElement, k = e.key;
  if (a && a !== document.body && a !== document.documentElement) {
    if (/^(INPUT|TEXTAREA|SELECT)$/.test(a.tagName) || a.isContentEditable || (a.closest && a.closest('#flow,.dlg,.menu,.uim,.tbm,#cpk,#egp'))) return;
    if (a.tagName === 'BUTTON' && k !== 'Enter' && k !== 'Backspace' && k !== 'Delete') return; // ปุ่มที่ยังโฟกัสอยู่: เว้นวรรค/ลูกศรทำงานตามปกติ
  }
  const edit = k === 'Enter' || k === 'Backspace' || k === 'Delete', arrow = /^Arrow/.test(k), ch = k.length === 1 && k !== ' ';
  if (!edit && !arrow && !ch && k !== ' ') return;
  const r = typeof lastRange !== 'undefined' && lastRange, n = r && r.startContainer, el = n && (n.nodeType === 1 ? n : n.parentElement), ed = n && n.isConnected && el && el.closest && el.closest('#flow [contenteditable="true"]');
  if (!ed && NP_POS) { // ข้อความถูกวาดใหม่ (เช่น หลังเปลี่ยนเส้นตาราง) → หาตำแหน่งเดิมจากรหัสกล่อง/ช่อง
    try { const blk = $(`#flow .blk[data-id="${NP_POS.id}"]`), t = blk && $$('[contenteditable="true"]', blk).find(x => (x.dataset.cell || '') === NP_POS.cell && (x.dataset.f || '') === NP_POS.f && (x.dataset.pf || '') === NP_POS.pf);
      if (t) { const pt = xsPoint(t, NP_POS.off); const rr = pt && pt.startContainer ? pt : null; if (rr) { e.preventDefault(); e.stopImmediatePropagation(); t.focus({ preventScroll: true }); const s = getSelection(); s.removeAllRanges(); s.addRange(rr); lastRange = rr.cloneRange(); if (window.npReveal) setTimeout(window.npReveal, 0); return; } } } catch (err) { }
  }
  if (!ed) { if (edit && typeof selSet !== 'undefined' && selSet.size) { e.preventDefault(); e.stopImmediatePropagation(); toast(k === 'Enter' ? 'คลิกตำแหน่งในข้อความก่อน' : 'คลิกที่ ⠿ ของกล่องก่อน ถ้าต้องการลบทั้งกล่อง'); } return; }
  e.preventDefault(); e.stopImmediatePropagation();
  const multi = typeof PG !== 'undefined' && PG.ts && PG.ts.a && PG.ts.z && String(PG.ts.a) !== String(PG.ts.z);
  ed.focus({ preventScroll: true }); const s = getSelection(); s.removeAllRanges(); s.addRange(r);
  if (multi) return; // เลือกหลายช่องอยู่: แค่คืนเคอร์เซอร์ ไม่แก้ข้อความ
  try {
    if (ch || k === ' ') document.execCommand('insertText', false, k);
    else if (k === 'Backspace') document.execCommand('delete');
    else if (k === 'Delete') document.execCommand('forwardDelete');
    else if (k === 'Enter' && ed.dataset.cell && !el.closest('li')) document.execCommand('insertLineBreak');
    if (ch || edit || k === ' ') syncFrom(ed);
  } catch (err) { }
  if (window.npReveal) setTimeout(window.npReveal, 0);
}, true);

var NP_POS = null; // ตำแหน่งเคอร์เซอร์ล่าสุดแบบไม่ผูกกับโหนด (ใช้เมื่อกล่องถูกวาดใหม่)
document.addEventListener('selectionchange', () => { try { const s = getSelection(); if (!s.rangeCount) return; const r = s.getRangeAt(0), n = r.startContainer, el = n.nodeType === 1 ? n : n.parentElement, t = el && el.closest && el.closest('#flow [contenteditable="true"]'), blk = t && t.closest('.blk'); if (!blk) return; NP_POS = { id: blk.dataset.id, cell: t.dataset.cell || '', f: t.dataset.f || '', pf: t.dataset.pf || '', off: xsOff(t, n, r.startOffset) }; } catch (e) { } });


/* ---------- เล่มโครงงานตามแบบ สมาคมคณิตศาสตร์ฯ + สารบัญเชื่อมกับเนื้อหา (คลิกไปยังหัวข้อ · ลิงก์ใน PDF · มีสมการในสารบัญ) ---------- */
(function () {
  const css = document.createElement('style');
  css.textContent = `.b-pjcover.std{font-weight:400;padding-top:24px}.b-pjcover.std .pc-k{font-weight:700;font-size:1.15em;margin-bottom:30px}
.b-pjcover.std .pc-t{align-self:stretch;text-align:left;margin-bottom:26px}.b-pjcover.std .pc-by{margin:6px 0 2px}
.b-pjcover.std .pc-l{font-weight:400;min-width:0;text-align:left}.b-pjcover.std .pcn{display:inline-block;min-width:9.2em}
.b-pjcover.std .pc-sp{flex:0 0 34px}.b-pjcover.std .pc-n{margin-top:70px}
.b-toc.nodot .toc-r .dd{border-bottom-color:transparent}.b-toc .toc-r{padding-top:3px;padding-bottom:3px}.b-toc .toc-r .tt{flex:0 1 auto;min-width:0}.b-toc .toc-r .pg{min-width:2.2em;text-align:center}
.b-toc .toc-r .tt .mx{cursor:inherit}body:not(.exporting) .b-toc .toc-r[data-go]{cursor:pointer}body:not(.exporting) .b-toc .toc-r[data-go]:hover .tt{color:#1d4ed8;text-decoration:underline}
.b-toc.loose .toc-r{padding-top:7px;padding-bottom:7px}`;
  document.head.appendChild(css);
  // ข้อความหัวข้อ → HTML สำหรับสารบัญ (คงสมการไว้ ตัดรูปแบบอื่นออก)
  const tocHTML = h => { const d = document.createElement('div'); d.innerHTML = h || ''; let o = ''; (function walk(n) { n.childNodes.forEach(c => { if (c.nodeType === 3) o += esc(c.nodeValue.replace(/​/g, '')); else if (c.nodeType === 1) { if (c.classList.contains('mx')) o += `<span class="mx" contenteditable="false" data-tex="${esc(c.dataset.tex || '')}"></span>`; else if (c.tagName === 'BR') o += ' '; else walk(c); } }); })(d); return o.replace(/\s+/g, ' ').trim(); };
  const TOC_HEAD = { '': 'เรื่อง', tbl: 'ตาราง', fig: 'ภาพ' };
  tocEntries = function (tb) {
    const i0 = doc.blocks.indexOf(tb), P = PAGE_H + PAGE_G, n = $('#sheets').childElementCount, out = [];
    const pgOf = el => { const L = pageLabel(Math.floor(el.offsetTop / P), n, doc.settings); return L.hide ? '' : (String(L.text).match(/[0-9๐-๙ivxlcdm]+|[ก-ฮ]$/i) || [''])[0]; };
    if (tb.kind === 'tbl' || tb.kind === 'fig') {
      const m = capNums();
      doc.blocks.forEach(b => { if (!m[b.id] || CAP_T[b.t] !== tb.kind) return; const el = $(`.blk[data-id="${b.id}"]`); if (!el) return; const lab = capLabel(b, m[b.id]); out.push({ lv: 0, id: b.id, text: lab + '  ' + plainText(b.cap || ''), html: esc(lab) + '&nbsp;&nbsp;' + tocHTML(b.cap), page: pgOf(el), plain: 1 }); });
      return out;
    }
    const lvMax = tb.nosub ? 1 : (+tb.depth || 3);
    doc.blocks.forEach((b, k) => {
      if (k <= i0 || TOC_SKIP.has(b.t) || b.nobm) return; const el = $(`.blk[data-id="${b.id}"]`); if (!el) return; let lv, text, html;
      if (b.t === 'pjch') { if (/^\s*สารบัญ/.test(plainText(b.title || ''))) return; text = [plainText(b.num || ''), plainText(b.title || '')].filter(Boolean).join(' '); html = [tocHTML(b.num), tocHTML(b.title)].filter(Boolean).join(' '); lv = b.num ? 1 : 0; }
      else if (b.t === 'pjsec' || b.t === 'lpsec') { text = plainText(b.html || ''); html = tocHTML(b.html); lv = b.sub ? 3 : 2; }
      else { lv = OUT_LV[b.t]; if (lv === undefined) return; if (b.t === 'chapter') { text = [plainText(b.num || ''), plainText(b.title || '')].filter(Boolean).join(' '); html = [tocHTML(b.num), tocHTML(b.title)].filter(Boolean).join(' '); } else { text = plainText(b.html || b.title || ''); html = tocHTML(b.html || b.title); } }
      if (+b.tl) lv = +b.tl;
      if (!text || Math.max(lv, 1) > lvMax) return; out.push({ lv, id: b.id, text, html, page: pgOf(el) });
    });
    return out;
  };
  updateTOC = function () {
    let again = false;
    doc.blocks.filter(b => b.t === 'toc').forEach(tb => {
      const box = $(`.blk[data-id="${tb.id}"] .b-toc`), el = box && $('.toc-body', box); if (!el) return;
      box.classList.toggle('nodot', !!tb.nodot); box.classList.toggle('loose', !!tb.loose); const h0 = $('.toc-h span', box); if (h0) h0.textContent = TOC_HEAD[tb.kind || ''] || 'เรื่อง';
      const E = tocEntries(tb), sig = JSON.stringify(E); if (el.dataset.sig === sig) return; const cnt = (el.dataset.sig ? JSON.parse(el.dataset.sig).length : -1); el.dataset.sig = sig;
      el.innerHTML = E.map(e => `<div class="toc-r lv${e.plain ? 0 : e.lv}${e.plain ? ' pl' : ''}" data-go="${e.id}" title="คลิกเพื่อไปยังหัวข้อนี้"><span class="tt"${e.plain ? ' style="font-weight:400"' : ''}>${e.html || esc(e.text)}</span><span class="dd"></span><span class="pg">${esc(e.page)}</span></div>`).join('') || `<div class="hint">${tb.kind === 'tbl' ? 'ยังไม่มีตารางที่ติ๊ก “มีชื่อตาราง”' : tb.kind === 'fig' ? 'ยังไม่มีภาพที่ติ๊ก “มีชื่อภาพ”' : 'ยังไม่มีหัวบทถัดจากสารบัญ'}</div>`;
      try { renderMath(el); } catch (e) { }
      again = true;
    });
    if (again && typeof schedulePaginate === 'function') schedulePaginate();
  };
  // สารบัญยาวเกินหน้า → ตัดขึ้นหน้าใหม่ทีละรายการ
  window.tocSplit = function (el) {
    const flow = $('#flow'), fr = flow.getBoundingClientRect(), z = (fr.height / flow.offsetHeight) || 1, P = PAGE_H + PAGE_G;
    $$('.toc-r', el).forEach(r => { const rc = r.getBoundingClientRect(), y = (rc.top - fr.top) / z, h = rc.height / z, p = Math.floor(y / P), re = p * P + PAGE_H - BOT; if (y + h > re) r.style.marginTop = Math.max(0, (p + 1) * P + TOP - y) + 'px'; });
  };
  // คลิกรายการในสารบัญ → ไปยังหัวข้อนั้น
  flowEl.addEventListener('click', e => { const r = e.target.closest && e.target.closest('.toc-r[data-go]'); if (!r || document.body.classList.contains('exporting')) return; const el = $(`.blk[data-id="${r.dataset.go}"]`); if (!el) return; e.preventDefault(); selectBlock(r.dataset.go); const sc = $('#scroller'); sc.scrollTop += el.getBoundingClientRect().top - sc.getBoundingClientRect().top - 60; el.classList.add('tocflash'); setTimeout(() => el.classList.remove('tocflash'), 1200); });
  css.textContent += `.blk.tocflash{animation:tocfl 1.2s}@keyframes tocfl{0%,60%{background:#fff3c4}100%{background:transparent}}`;
  // ลิงก์ในไฟล์ PDF: คลิกรายการสารบัญแล้วกระโดดไปหน้านั้น
  window.tocPdfLinks = function (pdf, n) {
    const P = PAGE_H + PAGE_G, st = $('#stage').getBoundingClientRect(), mm = 210 / 794;
    $$('#flow .toc-r[data-go]').forEach(r => { const t = $(`.blk[data-id="${r.dataset.go}"]`); if (!t) return; const rc = r.getBoundingClientRect(), y = rc.top - st.top, pi = Math.floor(y / P), tp = Math.min(n - 1, Math.max(0, Math.floor(t.offsetTop / P))); if (pi < 0 || pi >= n) return; pdf.setPage(pi + 1); pdf.link((rc.left - st.left) * mm, (y - pi * P) * mm, rc.width * mm, rc.height * mm, { pageNumber: tp + 1 }); });
  };
  const _ei = extInspector; extInspector = function (b) {
    let h = _ei(b);
    if (b.t === 'toc') h += `<div class="ir"><label><input type="checkbox" data-bc2="nodot" ${b.nodot ? 'checked' : ''}> ไม่มีเส้นจุดไข่ปลา</label></div><div class="ir"><label><input type="checkbox" data-bc2="loose" ${b.loose ? 'checked' : ''}> เว้นบรรทัดห่าง</label></div><p class="hint" style="font-size:14px">คลิกรายการในสารบัญเพื่อไปยังหัวข้อ · ส่งออก PDF แล้วคลิกในสารบัญได้เช่นกัน</p>`;
    if (b.t === 'pjch') h += `<div class="ir"><label>ระดับในสารบัญ</label><select data-b="tl">${[['', 'หัวบท (ตัวหนา ชิดซ้าย)'], ['2', 'หัวข้อย่อย (เยื้องเข้า) เช่น ภาคผนวก ก'], ['3', 'ย่อยอีกชั้น']].map(([k, v]) => `<option value="${k}"${String(b.tl || '') === k ? ' selected' : ''}>${v}</option>`).join('')}</select></div><div class="ir"><label><input type="checkbox" data-bc2="nobm" ${b.nobm ? 'checked' : ''}> ไม่แสดงในสารบัญ</label></div>`;
    if (b.t === 'pjcover') h += `<div class="ir"><label><input type="checkbox" data-bc2="std" ${b.std ? 'checked' : ''}> ปกแบบรายงานโครงงาน (ตัวธรรมดา ชื่อเรื่องชิดซ้าย)</label></div>`;
    return h;
  };
  /* ---------- แม่แบบเล่มโครงงาน (ตามแบบรายงานโครงงานคณิตศาสตร์ สมาคมคณิตศาสตร์ฯ) ---------- */
  openProject = function () {
    docDlg('เล่มโครงงานสมบูรณ์', [
      ['kind', 'ประเภทโครงงาน', 'โครงงานคณิตศาสตร์'], ['title', 'ชื่อเรื่อง', ''], ['stu', 'ผู้จัดทำ (บรรทัดละคน)', '', 't', 4], ['adv', 'ครูที่ปรึกษา (บรรทัดละคน)', 'นายศาสตราวุฒิ อาชนะชัย', 't', 2],
      ['level', 'ระดับชั้น', 'มัธยมศึกษาตอนปลาย'], ['school', 'โรงเรียน', SCHOOL], ['aff', 'สังกัด', 'สังกัด' + AFF],
      ['note', 'ข้อความท้ายปก', 'รายงานฉบับนี้เป็นส่วนประกอบของโครงงานคณิตศาสตร์ ระดับมัธยมศึกษาตอนปลาย\nเนื่องในการประกวดโครงงานคณิตศาสตร์ ประจำปี ' + (new Date().getFullYear() + 543) + '\nจัดโดย สมาคมคณิตศาสตร์แห่งประเทศไทย ในพระบรมราชูปถัมภ์', 't', 3],
      ['kw', 'คำสำคัญ', ''], ['apx', 'ภาคผนวก (บรรทัดละหัวข้อ)', 'พิสูจน์ทฤษฎีบทเพิ่มเติม\nประมวลภาพการดำเนินการ', 't', 3],
      ['h', 'ส่วนประกอบ', '', 'h'], ['inner', 'ปกใน', true, 'c'], ['tbl', 'สารบัญตาราง', true, 'c'], ['fig', 'สารบัญรูปภาพ', true, 'c'], ['dot', 'สารบัญมีเส้นจุดไข่ปลา', false, 'c'],
    ], V => {
      const B = []; const add = (t, x) => { const b = newBlock(t, x || {}); B.push(b); return b; }; const S = lnz(V('stu')), A = lnz(V('adv')), kind = V('kind') || 'โครงงานคณิตศาสตร์', ttl = esc(V('title') || '...');
      const two = L => L.map((x, i) => { const k = x.lastIndexOf(' '); return k > 0 ? `<span class="pcn">${i + 1}. ${esc(x.slice(0, k))} </span>${esc(x.slice(k + 1))}` : `${i + 1}. ${esc(x)}`; }).join('<br>') || '1. ...';
      const num = L => L.map((x, i) => `${i + 1}. ${esc(x)}`).join('<br>');
      const cover = () => add('pjcover', { std: 1, kick: esc(kind), title: 'เรื่อง&nbsp; ' + ttl, by: 'โดย', stu: two(S), advl: 'อาจารย์ที่ปรึกษาโครงงาน', adv: two(A), school: esc(V('school')), aff: esc(V('aff')), note: brs(V('note')) });
      cover(); if (V('inner')) cover();
      add('pjch', { num: '', title: 'บทคัดย่อ' + esc(kind), nobm: 1 });
      add('pjinfo', { n: 4, l0: 'ชื่อโครงงาน', v0: ttl, l1: 'ผู้จัดทำโครงงาน', v1: num(S), l2: 'ครูที่ปรึกษาโครงงาน', v2: num(A), l3: 'ระดับชั้น', v3: esc(V('level')) });
      add('lptext', { ind: 0, html: '<div style="text-align:center"><b>บทคัดย่อ</b></div>' });
      add('pjtext', { html: 'โครงงานนี้จัดทำขึ้นโดยมีวัตถุประสงค์เพื่อ ...' }); add('pjtext', { noind: true, html: '<b>คำสำคัญ:</b> ' + esc(V('kw') || '...') });
      add('pjch', { num: '', title: 'กิตติกรรมประกาศ', nobm: 1 }); add('pjtext', { html: `การศึกษา${esc(kind)} เรื่อง${ttl} เล่มนี้ สำเร็จลุล่วงโดยได้รับความอนุเคราะห์อย่างดี จาก ... ซึ่งได้กรุณาให้คำปรึกษาแนะนำแนวคิด วิธีการ และสละเวลาอันมีค่าแก้ไขข้อบกพร่องของเนื้อหา และสำนวนภาษา ด้วยความเอาใจใส่อย่างดียิ่ง คณะผู้จัดทำขอขอบพระคุณเป็นอย่างสูง ณ โอกาสนี้` });
      add('pjtext', { html: 'ขอขอบพระคุณ ... ที่ให้การสนับสนุนการดำเนินการศึกษาโครงงานเล่มนี้จนสำเร็จด้วยดี' }); add('lptext', { ind: 0, html: '<br><div style="text-align:right">คณะผู้จัดทำ</div>' });
      const T = x => Object.assign({ nodot: !V('dot'), loose: true }, x);
      add('pjch', { num: '', title: 'สารบัญ' }); add('toc', T({}));
      if (V('tbl')) { add('pjch', { num: '', title: 'สารบัญตาราง' }); add('toc', T({ kind: 'tbl' })); }
      if (V('fig')) { add('pjch', { num: '', title: 'สารบัญรูปภาพ' }); add('toc', T({ kind: 'fig' })); }
      const CH = [['บทนำ', ['ที่มาและความสำคัญ', 'วัตถุประสงค์', 'ขอบเขตของการศึกษา', 'ประโยชน์ที่คาดว่าจะได้รับ', 'นิยามศัพท์เฉพาะ']], ['เอกสารที่เกี่ยวข้อง', ['ความรู้พื้นฐานเรื่องที่ 1', 'ความรู้พื้นฐานเรื่องที่ 2']], ['วิธีการดำเนินการ', ['เครื่องมือ', 'วิธีการดำเนินการ']], ['ผลการดำเนินการ', ['ผลการศึกษา ...', 'ผลการศึกษา ...']], ['สรุป อภิปรายผล และข้อเสนอแนะ', ['สรุปและอภิปรายผล', 'ประโยชน์ที่ได้รับ', 'ข้อเสนอแนะ']]];
      let first = null;
      CH.forEach(([t, secs], k) => {
        const c = add('pjch', { num: `บทที่ ${k + 1}`, title: t }); if (!first) first = c;
        if (k === 1) add('pjtext', { html: `การจัดทำ${esc(kind)} เรื่อง “<b>${ttl}</b>” ในครั้งนี้ คณะผู้จัดทำโครงงานได้ศึกษาเนื้อหาที่เกี่ยวข้องประกอบด้วย<br>${TAB}2.1 ${secs[0]}<br>${TAB}2.2 ${secs[1]}` });
        secs.forEach((s, j) => {
          add('pjsec', { html: `${k + 1}.${j + 1}&nbsp; ${s}` });
          if (k === 0 && (j === 1 || j === 3)) { add('pjtext', { html: `<b>${k + 1}.${j + 1}.1</b>${TAB}${j === 1 ? 'เพื่อศึกษา ...' : 'ได้ทราบถึง ...'}` }); add('pjtext', { html: `<b>${k + 1}.${j + 1}.2</b>${TAB}${j === 1 ? 'เพื่อศึกษา ...' : 'ได้ทราบถึง ...'}` }); }
          else add('pjtext', { html: '' });
          if (k === 1 && j === 0) { add('table', { capOn: true, cap: 'ชื่อตาราง (แก้ไขได้ · เลขตารางและสารบัญตารางเดินเอง)', rows: [['หัวข้อ', 'รายละเอียด'], ['', '']], full: true, rs: { 0: 'L' } }); }
        });
      });
      add('pjch', { num: '', title: 'บรรณานุกรม' }); add('pjtext', { hang: true, html: 'ชื่อผู้แต่ง. (ปีที่พิมพ์). <i>ชื่อหนังสือ</i>. สถานที่พิมพ์: สำนักพิมพ์.' });
      const AP = lnz(V('apx')); if (AP.length) { add('pjch', { num: '', title: 'ภาคผนวก' }); AP.forEach((t, i) => { add('pjch', { num: '', title: `ภาคผนวก ${THAI_AL[i] || i + 1}: ${esc(t)}`, tl: 2 }); add('pjtext', { html: '' }); }); }
      return { blocks: B, settings: Object.assign({ name: 'โครงงาน ' + (V('title') || '') }, NOHEAD, { pnPos: 'tr', pnFmt: '{n}', pnStart: 1, pnAnchor: first.id, pnFront: 'hide', pnRules: [], figLab: 'รูปภาพที่ ', tblLab: 'ตารางที่ ', tpl: 'project', pj: { kind, title: V('title'), stu: S, adv: A, level: V('level'), school: V('school'), aff: V('aff'), note: V('note'), kw: V('kw') } }), msg: 'สร้างเล่มโครงงานแล้ว · สารบัญ สารบัญตาราง สารบัญรูปภาพ และเลขหน้าเดินเองอัตโนมัติ' };
    }, 'ตามแบบรายงานโครงงาน: ปก ปกใน บทคัดย่อ กิตติกรรมประกาศ สารบัญ 3 แบบ บทที่ 1–5 บรรณานุกรม ภาคผนวก · เลขหน้ามุมบนขวาเริ่ม 1 ที่บทที่ 1 · คลิกรายการในสารบัญเพื่อไปยังหัวข้อ');
  };
})();

/* ---------- ข้อมูลโครงงาน: กรอก/แก้ครั้งเดียว ปก ปกใน บทคัดย่อ และข้อความที่อ้างชื่อเรื่อง เปลี่ยนตามทั้งเล่ม ---------- */
const pjT2H = t => esc(String(t || '')).replace(/\$([^$\n]+)\$/g, (m, x) => `<span class="mx" contenteditable="false" data-tex="${x.replace(/&amp;/g, '&amp;')}"></span>`);
const pjH2T = h => { const d = document.createElement('div'); d.innerHTML = h || ''; $$('.mx', d).forEach(s => s.replaceWith('$' + (s.dataset.tex || '') + '$')); $$('br', d).forEach(b => b.replaceWith('\n')); return d.textContent.replace(/[​ ]/g, ' ').replace(/[ \t]+/g, ' ').trim(); };
const pjLines = h => pjH2T(h).split('\n').map(x => x.replace(/^\s*\d+[.)]\s*/, '').replace(/\s+/g, ' ').trim()).filter(x => x && x !== '...');
function pjRead() { // ข้อมูลที่เก็บไว้ หรืออ่านจากปก/ตารางข้อมูลของไฟล์ที่นำเข้า
  const s = doc.settings.pj; if (s) return Object.assign({ kind: '', title: '', stu: [], adv: [], level: '', school: '', aff: '', note: '', kw: '' }, s);
  const c = doc.blocks.find(b => b.t === 'pjcover') || {}, inf = doc.blocks.find(b => b.t === 'pjinfo') || {}, row = re => { const n = Math.max(1, +inf.n || 4); for (let i = 0; i < n; i++) if (re.test(plainText(inf['l' + i] || ''))) return inf['v' + i] || ''; return ''; };
  const kwb = doc.blocks.find(b => b.t === 'pjtext' && /^\s*คำสำคัญ/.test(plainText(b.html || '')));
  return { kind: pjH2T(c.kick) || 'โครงงานคณิตศาสตร์', title: pjH2T(c.title).replace(/^เรื่อง\s*/, '') || pjH2T(row(/ชื่อโครงงาน|ชื่อเรื่อง/)), stu: pjLines(c.stu).length ? pjLines(c.stu) : pjLines(row(/ผู้จัดทำ/)), adv: pjLines(c.adv).length ? pjLines(c.adv) : pjLines(row(/ที่ปรึกษา/)),
    level: pjH2T(row(/ระดับชั้น/)), school: pjH2T(c.school), aff: pjH2T(c.aff), note: pjH2T(c.note), kw: kwb ? pjH2T(kwb.html).replace(/^คำสำคัญ\s*[:：]?\s*/, '') : '' };
}
function pjApply(N, O) {
  const tH = pjT2H(N.title) || '...', two = L => L.map((x, i) => { const k = x.lastIndexOf(' '); return k > 0 ? `<span class="pcn">${i + 1}. ${esc(x.slice(0, k))} </span>${esc(x.slice(k + 1))}` : `${i + 1}. ${esc(x)}`; }).join('<br>') || '1. ...', num = L => L.map((x, i) => `${i + 1}. ${esc(x)}`).join('<br>') || '1. ...';
  let n = 0;
  doc.blocks.forEach(b => {
    if (b.t === 'pjcover') { b.kick = esc(N.kind); b.title = 'เรื่อง&nbsp; ' + tH; b.stu = b.std ? two(N.stu) : num(N.stu); b.adv = b.std ? two(N.adv) : num(N.adv); b.school = esc(N.school); b.aff = esc(N.aff); b.note = brs(N.note); n++; }
    else if (b.t === 'pjinfo') { const k = Math.max(1, +b.n || 4); for (let i = 0; i < k; i++) { const l = plainText(b['l' + i] || ''); if (/ชื่อโครงงาน|ชื่อเรื่อง/.test(l)) b['v' + i] = tH; else if (/ผู้จัดทำ/.test(l)) b['v' + i] = num(N.stu); else if (/ที่ปรึกษา/.test(l)) b['v' + i] = num(N.adv); else if (/ระดับชั้น/.test(l)) b['v' + i] = esc(N.level); } n++; }
    else if (b.t === 'pjch' && !b.num && O.kind && plainText(b.title || '') === 'บทคัดย่อ' + O.kind) { b.title = 'บทคัดย่อ' + esc(N.kind); n++; }
    else if (b.t === 'pjtext' && /^\s*คำสำคัญ/.test(plainText(b.html || ''))) { b.html = '<b>คำสำคัญ:</b> ' + esc(N.kw || '...'); n++; }
  });
  // ข้อความในเล่มที่อ้างชื่อเรื่องเดิม / ประเภทโครงงานเดิม → เปลี่ยนตาม (เฉพาะชื่อเรื่องที่ไม่มีสมการ)
  let m = 0; const rep = (from, to) => { if (!from || from === to || from.length < 6) return; doc.blocks.forEach(b => { if (!['pjtext', 'lptext', 'para'].includes(b.t) || typeof b.html !== 'string' || !b.html.includes(from)) return; b.html = b.html.split(from).join(to); m++; }); };
  if (O.title && !/\$/.test(O.title)) rep(esc(O.title), tH);
  doc.settings.pj = N; doc.settings.name = 'โครงงาน ' + N.title.replace(/\$/g, '');
  renderAll(); changed(true); return [n, m];
}
async function openPjInfo() {
  const O = pjRead(), F = (id, lab, v, rows) => rows ? `<label class="pjf wide"><small>${lab}</small><textarea id="pj_${id}" rows="${rows}">${esc(v)}</textarea></label>` : `<label class="pjf"><small>${lab}</small><input type="text" id="pj_${id}" value="${esc(v)}"></label>`;
  const html = `<div class="pjgrid">${F('kind', 'ประเภทโครงงาน', O.kind)}${F('level', 'ระดับชั้น', O.level)}${F('title', 'ชื่อเรื่อง (ใส่สมการได้โดยพิมพ์ระหว่าง $ … $ เช่น $\\cos^k(\\theta)$)', O.title, 3)}${F('stu', 'ผู้จัดทำ (บรรทัดละคน)', O.stu.join('\n'), 4)}${F('adv', 'ครูที่ปรึกษา (บรรทัดละคน)', O.adv.join('\n'), 2)}${F('school', 'โรงเรียน', O.school)}${F('aff', 'สังกัด', O.aff)}${F('note', 'ข้อความท้ายปก', O.note, 3)}${F('kw', 'คำสำคัญ', O.kw, 1)}${doc.blocks.some(b => b.t === 'pjcover') ? '' : '<label class="pjf wide" style="flex-direction:row;gap:8px;align-items:center"><input type="checkbox" id="pj_addc" checked> ไฟล์นี้ยังไม่มีปกแบบแม่แบบ → เพิ่มปก ปกใน และตารางข้อมูลหน้าบทคัดย่อให้ (แทนหน้าปกเดิมที่พิมพ์เป็นข้อความ)</label>'}</div><p class="hint" style="margin:6px 0 0">กด “ใช้ข้อมูลนี้” แล้ว ปก ปกใน ตารางข้อมูลหน้าบทคัดย่อ คำสำคัญ และข้อความที่อ้างชื่อเรื่อง จะเปลี่ยนตามทั้งเล่ม · กลับมาแก้ได้ทุกเมื่อที่เมนู ไฟล์ → ข้อมูลโครงงาน</p>`;
  const pr = ask('ข้อมูลโครงงาน', html, 'ใช้ข้อมูลนี้'); const dl = $('#dAsk .dlg'); const w0 = dl ? dl.style.width : ''; if (dl) dl.style.width = 'min(780px, 94vw)';
  const ok = await pr; if (dl) dl.style.width = w0; if (!ok) return;
  const v = id => ($('#pj_' + id) || {}).value || '', N = { kind: v('kind').trim() || 'โครงงานคณิตศาสตร์', title: v('title').replace(/\s*\n\s*/g, ' ').trim(), stu: lnz(v('stu')).map(x => x.replace(/^\d+[.)]\s*/, '')), adv: lnz(v('adv')).map(x => x.replace(/^\d+[.)]\s*/, '')), level: v('level').trim(), school: v('school').trim(), aff: v('aff').trim(), note: v('note').trim(), kw: v('kw').trim() };
  if (!doc.blocks.some(b => b.t === 'pjcover') && ($('#pj_addc') || {}).checked) pjAddFront(N);
  const [n, m] = pjApply(N, O); toast(`อัปเดตข้อมูลโครงงานแล้ว ${n} จุด` + (m ? ` · แก้ชื่อเรื่องในเนื้อหาอีก ${m} ย่อหน้า` : ''), 4000);
}
(function () {
  const css = document.createElement('style'); css.textContent = `#dAsk .dlg.pjw{width:min(760px,94vw)}.pjgrid{display:grid;grid-template-columns:1fr 1fr;gap:8px 14px;max-height:62vh;overflow:auto;padding:2px}.pjf{display:flex;flex-direction:column;gap:2px}.pjf.wide{grid-column:1/-1}.pjf small{color:#7b746c;font-size:14px}.pjf input,.pjf textarea{font:inherit;font-size:17px;padding:4px 8px;border:1px solid var(--ui-line,#d9cfc4);border-radius:6px}`; document.head.appendChild(css);
  const _ei = extInspector; extInspector = function (b) { let h = _ei(b); if (b.t === 'pjcover' || b.t === 'pjinfo') h = `<div class="ir"><button class="tb primary" onclick="openPjInfo()">✎ ข้อมูลโครงงาน (แก้ครั้งเดียว เปลี่ยนทั้งเล่ม)…</button></div>` + h; return h; };
})();

/* ---------- นำไฟล์เข้าแล้วเลือกว่าเป็นแม่แบบอะไร → ปรับให้ใช้ระบบของแม่แบบนั้น (สารบัญ เลขหน้า ข้อมูลโครงงาน) ---------- */
const TPL_KINDS = { project: 'เล่มโครงงาน', lesson: 'แผนการจัดการเรียนรู้', exam: 'ข้อสอบ / แบบทดสอบ', form: 'แบบฟอร์ม / บันทึกข้อความ', general: 'เอกสารทั่วไป' };
function tplGuess() {
  const B = doc.blocks, has = t => B.some(b => b.t === t), txt = b => plainText(b.html || b.title || '');
  if (has('pjcover') || has('pjinfo') || has('pjch')) return 'project';
  if (has('lphead')) return 'lesson'; if (doc.settings.qz || has('examcover') || B.filter(b => b.t === 'problem').length >= 3) return 'exam'; if (has('memohead') || has('cshead')) return 'form';
  const ch = B.filter(b => /^บทที่\s*[0-9๑-๙]/.test(b.t === 'chapter' ? plainText(b.num || '') : txt(b))).length; if (ch >= 2 || (ch && B.some(b => /^(บทคัดย่อ|กิตติกรรมประกาศ)/.test(txt(b))))) return 'project';
  return 'general';
}
function pjAddFront(N) { // เพิ่มปก ปกใน และตารางข้อมูล ให้ไฟล์ที่ยังไม่มี
  const mk = () => newBlock('pjcover', { std: 1, by: 'โดย', advl: 'อาจารย์ที่ปรึกษาโครงงาน' }); const add = [mk(), mk()];
  if (!doc.blocks.some(b => b.t === 'pjinfo')) { const inf = newBlock('pjinfo', { n: 4, l0: 'ชื่อโครงงาน', l1: 'ผู้จัดทำโครงงาน', l2: 'ครูที่ปรึกษาโครงงาน', l3: 'ระดับชั้น' }); const k = doc.blocks.findIndex(b => b.t === 'pjch' && /^บทคัดย่อ/.test(plainText(b.title || ''))); if (k >= 0) doc.blocks.splice(k + 1, 0, inf); else add.push(newBlock('pjch', { num: '', title: 'บทคัดย่อ' + esc(N.kind), nobm: 1 }), inf); }
  // หน้าปกเดิมที่พิมพ์เป็นข้อความธรรมดา (ก่อนหัวข้อแรก) → เอาออก เพราะมีปกแบบแม่แบบแทนแล้ว (ย้อนกลับได้ด้วย ⌘Z)
  const k0 = doc.blocks.findIndex(b => b.t === 'pjch'), old = k0 > 0 ? doc.blocks.slice(0, k0) : [];
  if (old.length && old.length <= 16 && old.every(b => ['para', 'pjtext', 'lptext', 'pagebreak', 'spacer', 'h3'].includes(b.t)) && old.map(b => plainText(b.html || '')).join('').length < 900) doc.blocks.splice(0, k0);
  doc.blocks.unshift(...add);
}
function pjAdopt() { // แปลงหัวบท/หัวข้อที่พิมพ์เป็นข้อความธรรมดา ให้เป็นหัวบท/หัวข้อของแม่แบบ → สารบัญและเลขหน้าเดินเอง
  const B = doc.blocks, HT = new Set(['para', 'pjtext', 'lptext', 'section', 'subsection', 'h3', 'given']), one = b => HT.has(b.t) && typeof b.html === 'string' && !/<br|<li|<div[^>]*>.*<div/i.test(b.html.replace(/(<br>\s*)+$/, ''));
  const bold = b => b.t === 'section' || b.t === 'subsection' || b.t === 'h3' || /^\s*(<div[^>]*>)?\s*<(b|strong)[ >]/i.test(b.html || '') && plainText((b.html || '').replace(/<(b|strong)[^>]*>[\s\S]*?<\/\1>/gi, '')).trim().length < 2;
  const keepSt = (b, t, x) => { const st = b.st, id = b.id; Object.keys(b).forEach(k => delete b[k]); Object.assign(b, { id, t }, x); };
  let n = 0; const FRONT = /^(บทคัดย่อ.{0,30}|กิตติกรรมประกาศ|สารบัญ.{0,12}|บรรณานุกรม|เอกสารอ้างอิง|ภาคผนวก.{0,80})$/;
  for (let i = 0; i < B.length; i++) {
    const b = B[i];
    if (b.t === 'chapter') { keepSt(b, 'pjch', { num: b.num || '', title: b.title || '' }); n++; continue; }
    if (!one(b)) continue; const t = plainText(b.html).replace(/\s+/g, ' ').trim(); if (!t || t.length > 160) continue; let m;
    if ((m = /^(บทที่\s*[0-9๑-๙]+)\s*(.*)$/.exec(t))) { let title = m[2]; const nx = B[i + 1]; if (!title && nx && one(nx) && plainText(nx.html).trim().length < 90 && !/^\d+\.\d/.test(plainText(nx.html).trim())) { title = nx.html.replace(/<\/?(b|strong|div)[^>]*>/gi, ''); B.splice(i + 1, 1); } keepSt(b, 'pjch', { num: m[1], title: title ? (m[2] ? esc(title) : title) : '' }); n++; continue; }
    if (FRONT.test(t) && (bold(b) || /center/.test(b.html) || (b.st && b.st.al === 'center') || t.length < 22)) { const x = { num: '', title: b.html.replace(/<\/?(b|strong|div)[^>]*>/gi, '') }; if (/^ภาคผนวก\s*\S/.test(t)) x.tl = 2; if (/^(บทคัดย่อ|กิตติกรรม)/.test(t)) x.nobm = 1; keepSt(b, 'pjch', x); n++; continue; }
    if (/^\d+\.\d+\.\d+\s+\S/.test(t) && bold(b) && t.length < 110) { keepSt(b, 'pjsec', { html: b.html.replace(/<\/?(b|strong)[^>]*>/gi, ''), sub: 1 }); n++; continue; }
    if (/^\d+\.\d+\s+\S/.test(t) && bold(b)) { keepSt(b, 'pjsec', { html: b.html.replace(/<\/?(b|strong)[^>]*>/gi, '') }); n++; continue; }
    if (b.t === 'section') { keepSt(b, 'pjsec', { html: b.html }); n++; } else if (b.t === 'subsection') { keepSt(b, 'pjsec', { html: b.html, sub: 1 }); n++; }
  }
  // สารบัญ: ใส่ตัวสารบัญอัตโนมัติถ้ายังไม่มี (สารบัญที่พิมพ์มือไว้เดิมยังอยู่ ลบเองได้)
  const first = B.find(b => b.t === 'pjch' && b.num); let addToc = 0;
  if (first && !B.some(b => b.t === 'toc')) {
    const mk = (title, kind) => { const k = B.findIndex(b => b.t === 'pjch' && plainText(b.title || '').replace(/\s/g, '') === title); const tb = newBlock('toc', Object.assign({ nodot: true, loose: true }, kind ? { kind } : {})); if (k >= 0) { B.splice(k + 1, 0, tb); return 1; } if (kind) return 0; B.splice(B.indexOf(first), 0, newBlock('pjch', { num: '', title }), tb); return 1; };
    addToc += mk('สารบัญ', ''); addToc += mk('สารบัญตาราง', 'tbl'); addToc += mk('สารบัญรูปภาพ', 'fig') || mk('สารบัญภาพ', 'fig');
  }
  Object.assign(doc.settings, NOHEAD, { pnPos: 'tr', pnFmt: '{n}', pnStart: 1, pnFront: 'hide', pnRules: [], tpl: 'project' }, first ? { pnAnchor: first.id } : {}); if (!doc.settings.figLab) doc.settings.figLab = 'รูปภาพที่ ';
  return [n, addToc];
}
// อ่านชื่อเรื่อง/รายชื่อ จากหน้าปกที่พิมพ์เป็นข้อความธรรมดา
function pjSniff() {
  const B = doc.blocks, k = B.findIndex(b => (b.t === 'pjch' && b.num) || /^บทที่\s*[0-9๑-๙]/.test(plainText(b.html || ''))), front = B.slice(0, k < 0 ? Math.min(B.length, 40) : k), L = [];
  front.forEach(b => { if (typeof b.html === 'string') pjH2T(b.html.replace(/<\/(div|p|li)>/gi, '\n')).split('\n').forEach(x => { x = x.replace(/\s+/g, ' ').trim(); if (x) L.push(x); }); });
  const R = { stu: [], adv: [] }; let mode = '';
  for (const x of L) {
    if (!R.title && /^เรื่อง\s*\S/.test(x)) { R.title = x.replace(/^เรื่อง\s*[:：]?\s*/, ''); continue; }
    if (/ที่ปรึกษา/.test(x) && x.length < 40) { mode = 'adv'; continue; } if (/^(โดย|ผู้จัดทำ|คณะผู้จัดทำ)\s*$/.test(x)) { mode = 'stu'; continue; }
    const m = /^(?:\d+[.)]\s*)?((?:นาย|นางสาว|นาง|เด็กชาย|เด็กหญิง|ด\.ช\.|ด\.ญ\.|ว่าที่)\s*\S.*)$/.exec(x); if (m && x.length < 70) { const a = R[mode || 'stu']; if (!a.includes(m[1]) && a.length < 8) a.push(m[1]); continue; }
    if (!R.school && /^โรงเรียน\S/.test(x) && x.length < 60) R.school = x; else if (!R.aff && /^สังกัด/.test(x)) R.aff = x; else if (!R.kind && /^โครงงาน\S{2,30}$/.test(x)) R.kind = x;
    if (R.adv.length && /^(บทคัดย่อ|กิตติกรรม)/.test(x)) break;
  }
  return R;
}
async function tplAsk(auto) {
  if (auto && (doc.settings.tpl || (typeof dlgOpen === 'function' && dlgOpen()))) return;
  const g = doc.settings.tpl || tplGuess();
  const html = `<div class="tplk">${Object.entries(TPL_KINDS).map(([k, v]) => `<label><input type="radio" name="tplk" value="${k}" ${k === g ? 'checked' : ''}> <b>${v}</b>${k === g && !doc.settings.tpl ? ' <small>(โปรแกรมเดาว่าเป็นแบบนี้)</small>' : ''}${k === 'project' ? '<small style="display:block;margin-left:24px">จัดหัวบท/หัวข้อให้สารบัญและเลขหน้าเดินเอง แล้วให้กรอกชื่อเรื่อง ผู้จัดทำ ครั้งเดียวเปลี่ยนทั้งเล่ม</small>' : ''}</label>`).join('')}</div><p class="hint" style="margin:6px 0 0">เลือกครั้งเดียว โปรแกรมจะจำไว้ในไฟล์ · เปลี่ยนภายหลังได้ที่เมนู ไฟล์ → ชนิดแม่แบบของไฟล์นี้</p>`;
  if (!(await ask('ไฟล์นี้เป็นแม่แบบอะไร', html, 'ใช้แบบนี้'))) return;
  const k = ($('input[name="tplk"]:checked') || {}).value || 'general'; const was = doc.settings.tpl; doc.settings.tpl = k;
  if (k !== 'project') { changed(true); toast('บันทึกชนิดแม่แบบ: ' + TPL_KINDS[k]); return; }
  const had = !!doc.settings.pj, [n, t] = pjAdopt();
  if (!had) { const cur = pjRead(), sn = pjSniff(); doc.settings.pj = { kind: cur.kind || sn.kind || 'โครงงานคณิตศาสตร์', title: cur.title || sn.title || '', stu: cur.stu.length ? cur.stu : sn.stu, adv: cur.adv.length ? cur.adv : sn.adv, level: cur.level || 'มัธยมศึกษาตอนปลาย', school: cur.school || sn.school || SCHOOL, aff: cur.aff || sn.aff || 'สังกัด' + AFF, note: cur.note, kw: cur.kw }; doc.settings.pjNew = 1; }
  renderAll(); changed(true); toast(`จัดเป็นเล่มโครงงานแล้ว · แปลงหัวบท/หัวข้อ ${n} จุด${t ? ' · เพิ่มสารบัญอัตโนมัติ ' + t + ' ชุด' : ''}`, 4500);
  setTimeout(() => openPjInfo(), 500);
}
(function () {
  const css = document.createElement('style'); css.textContent = `.tplk{display:flex;flex-direction:column;gap:8px;min-width:min(460px,84vw)}.tplk label{display:block;font-size:17px;padding:7px 10px;border:1px solid var(--ui-line,#d9cfc4);border-radius:10px;cursor:pointer}.tplk label:has(input:checked){border-color:#b45309;background:#fff7ed}.tplk small{color:#7b746c;font-size:14px}`; document.head.appendChild(css);
  const fo = $('#fileOpen'); if (fo) fo.addEventListener('change', () => setTimeout(() => { if (doc && doc.lfl) tplAsk(true); }, 1500));
})();


