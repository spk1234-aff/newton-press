'use strict';
/* ===================== แม่แบบของฉัน + ข้อมูลประจำแบบฟอร์ม =====================
   · บันทึกงานที่เปิดอยู่เป็นแม่แบบ (เก็บในเครื่อง + ซิงก์ Google Drive) · ใช้/เปลี่ยนชื่อ/แทนที่/ลบ
   · ข้อมูลที่กรอกซ้ำทุกครั้ง (โรงเรียน ครู หัวหน้ากลุ่มสาระ รองฯ ผอ. รายวิชา ปีการศึกษา) ตั้งครั้งเดียว ทุกแบบฟอร์มดึงไปใช้ */
(function () {
  const s = document.createElement('style');
  s.textContent = `.tplmine .tplc{position:relative}.tplmine .tplm{position:absolute;top:6px;right:6px;border:1px solid var(--ui-line);background:#fff;border-radius:7px;width:28px;height:26px;cursor:pointer;font-size:15px;line-height:1}
.tplbar{display:flex;gap:8px;flex-wrap:wrap;margin:0 0 10px}.tplempty{color:var(--ui-mute);font-size:15px;padding:6px 2px}
#fpBody h4{margin:12px 0 6px;color:var(--ui-accent)}#fpBody .fpg{display:grid;grid-template-columns:1fr 1fr;gap:6px 12px}#fpBody label{display:flex;flex-direction:column;font-size:14px;color:var(--ui-mute)}
#fpBody input{font:inherit;font-size:16px;color:var(--ui-ink);padding:4px 8px;border:1px solid var(--ui-line);border-radius:7px}#fpBody .w{grid-column:1/-1}`;
  document.head.appendChild(s);
})();

/* ---------- ข้อมูลประจำแบบฟอร์ม ---------- */
const FP_FIELDS = [
  ['h', 'โรงเรียน'], ['school', 'ชื่อโรงเรียน'], ['amphoe', 'อำเภอ จังหวัด'], ['aff', 'สังกัด', 1], ['memoNo', 'เลขที่หนังสือ (ช่อง “ที่”) เช่น ศธ ๐๔๓๑๒.๐๓/'],
  ['h', 'ครูผู้สอน (ผู้ลงนาม)'], ['meName', 'ชื่อ–สกุล'], ['mePos', 'ตำแหน่ง'], ['group', 'กลุ่มสาระการเรียนรู้', 1],
  ['h', 'ผู้ลงนามความเห็น'], ['headName', 'หัวหน้ากลุ่มสาระ: ชื่อ'], ['headPos', 'หัวหน้ากลุ่มสาระ: ตำแหน่ง'],
  ['acadName', 'หัวหน้างานวิชาการ: ชื่อ'], ['acadPos', 'หัวหน้างานวิชาการ: ตำแหน่ง'], ['measName', 'หัวหน้างานวัดผล: ชื่อ'], ['measPos', 'หัวหน้างานวัดผล: ตำแหน่ง'],
  ['depName', 'รองฯ ฝ่ายวิชาการ: ชื่อ'], ['depPos', 'รองฯ ฝ่ายวิชาการ: ตำแหน่ง'], ['hrName', 'รองฯ ฝ่ายบุคคล: ชื่อ'], ['hrPos', 'รองฯ ฝ่ายบุคคล: ตำแหน่ง'],
  ['dirName', 'ผู้อำนวยการ: ชื่อ'], ['dirPos', 'ผู้อำนวยการ: ตำแหน่ง'],
  ['h', 'ค่าเริ่มต้นรายวิชา'], ['subj', 'รายวิชา'], ['code', 'รหัสวิชา'], ['en', 'ชื่อภาษาอังกฤษ + รหัส', 1], ['grade', 'ชั้น'], ['term', 'ภาคเรียน'], ['year', 'ปีการศึกษา'],
];
const FP_DEF = (() => { const c = id => (COURSE_F.find(f => f[0] === id) || [])[2] || ''; return {
  school: SCHOOL, amphoe: AMPHOE, aff: AFF, memoNo: 'ศธ ๐๔๓๑๒.๐๓/', meName: PPL.me[0], mePos: PPL.me[1], group: c('group'),
  headName: PPL.head[0], headPos: PPL.head[1], acadName: PPL.acad[0], acadPos: PPL.acad[1], measName: PPL.meas[0], measPos: PPL.meas[1],
  depName: PPL.dep[0], depPos: PPL.dep[1], hrName: PPL.hr[0], hrPos: PPL.hr[1], dirName: PPL.dir[0], dirPos: PPL.dir[1],
  subj: c('subj'), code: c('code'), en: c('en'), grade: c('grade'), term: c('term'), year: c('year') }; })();
let FP = (() => { try { return JSON.parse(localStorage.getItem('np-fprof') || 'null'); } catch (e) { return null; } })();
const fp = k => (FP && FP[k] !== undefined && FP[k] !== '' ? FP[k] : FP_DEF[k]);
function fpApply() {
  SCHOOL = fp('school'); AMPHOE = fp('amphoe'); AFF = fp('aff');
  PPL.me = [fp('meName'), fp('mePos')]; PPL.head = [fp('headName'), fp('headPos')]; PPL.acad = [fp('acadName'), fp('acadPos')]; PPL.acad2 = [fp('acadName'), PPL.acad2 ? PPL.acad2[1] : fp('acadPos')];
  PPL.meas = [fp('measName'), fp('measPos')]; PPL.dep = [fp('depName'), fp('depPos')]; PPL.hr = [fp('hrName'), fp('hrPos')]; PPL.dir = [fp('dirName'), fp('dirPos')];
  const map = { subj: 'subj', code: 'code', en: 'en', grade: 'grade', term: 'term', year: 'year', teacher: 'meName', pos: 'mePos', group: 'group' };
  COURSE_F.forEach(f => { if (map[f[0]]) f[2] = fp(map[f[0]]); });
  const d = $('#dLP'); if (d) d.remove(); // ตัวสร้างแผนจะสร้างใหม่พร้อมค่าใหม่
}
fpApply();
// ช่อง “ที่” ในบันทึกข้อความ + เลขหนังสือในหัวบันทึกที่สร้าง
(function () {
  const _dd = docDlg;
  docDlg = function (title, fields, build, note) {
    const F = fields.map(f => f[0] === 'no' && typeof f[2] === 'string' ? [f[0], f[1], f[2].replace('ศธ ๐๔๓๑๒.๐๓/', fp('memoNo')), ...f.slice(3)] : f);
    const B = V => { const r = build(V); (r && r.blocks || []).forEach(b => { if (b.t === 'memohead' && typeof b.no === 'string') b.no = b.no.replace('ศธ ๐๔๓๑๒.๐๓/', esc(fp('memoNo'))); }); return r; };
    const r = _dd(title, F, B, note);
    const act = $('#dDoc .actions'); if (act && !$('#ddProf')) { const x = document.createElement('button'); x.className = 'tb'; x.id = 'ddProf'; x.style.marginRight = 'auto'; x.textContent = '⚙︎ ตั้งค่าข้อมูลแบบฟอร์ม'; x.title = 'ชื่อโรงเรียน ครู ผู้ลงนาม ค่าเริ่มต้นรายวิชา'; x.onclick = () => { closeDlg('#dDoc'); openFormProfile(); }; act.prepend(x); }
    return r;
  };
  // ตัวสร้างแผนการจัดการเรียนรู้: ค่าเริ่มต้น + ชื่อผู้ลงนามความเห็น
  const _lpd = lpDlg;
  lpDlg = function () {
    const had = !!$('#dLP'); const r = _lpd.apply(this, arguments); if (had) return r;
    const set = (id, v) => { const e = $('#' + id); if (e && v) e.value = v; };
    set('lpSubj', fp('subj')); set('lpGrade', fp('grade')); set('lpTerm', fp('term')); set('lpYear', fp('year')); set('lpTeacher', fp('meName')); set('lpPos', fp('mePos'));
    const act = $('#dLP .actions'); if (act) { const x = document.createElement('button'); x.className = 'tb'; x.style.marginRight = 'auto'; x.textContent = '⚙︎ ตั้งค่าข้อมูลแบบฟอร์ม'; x.onclick = () => { closeDlg('#dLP'); openFormProfile(); }; act.prepend(x); }
    return r;
  };
  const _lb = lpBuild;
  lpBuild = function (fresh) {
    const keep = new Set(fresh ? [] : doc.blocks.map(b => b.id)); const r = _lb.apply(this, arguments);
    if (!FP) return r; let n = 0;
    doc.blocks.forEach(b => {
      if (keep.has(b.id) || b.t !== 'lpsign' || !/^\(\.+\)$/.test(b.name || '')) return;
      if (/^หัวหน้ากลุ่มสาระ/.test(b.pos || '')) { b.name = `(${esc(fp('headName'))})`; b.pos = esc(fp('headPos')); n++; }
      else if (/^ผู้อำนวยการ/.test(b.pos || '')) { b.name = `(${esc(fp('dirName'))})`; b.pos = esc(fp('dirPos')); n++; }
    });
    if (n) { renderAll(); changed(true); }
    return r;
  };
})();
function openFormProfile() {
  let d = $('#dFP');
  if (!d) { d = document.createElement('div'); d.className = 'dlg-back'; d.id = 'dFP'; d.innerHTML = `<div class="dlg" style="width:760px;max-height:92vh;overflow:auto"><h3>ข้อมูลประจำแบบฟอร์ม</h3><p class="hint" style="margin:-4px 0 4px">กรอกครั้งเดียว แบบฟอร์มทุกชนิด (แผนการสอน ปกแผน กำหนดการ บันทึกข้อความ โครงงาน ข้อสอบ) จะเติมค่าเหล่านี้ให้อัตโนมัติ · ซิงก์ผ่าน Google Drive ใช้ได้ทุกเครื่อง</p><div id="fpBody"></div>
<div class="actions"><button class="tb" id="fpReset" style="margin-right:auto">คืนค่าเดิมของแอป</button><button class="tb" id="fpNo">ยกเลิก</button><button class="tb primary" id="fpOk">บันทึก</button></div></div>`; document.body.appendChild(d);
    $('#fpNo').onclick = () => closeDlg('#dFP');
    $('#fpReset').onclick = async () => { if (!(await ask('คืนค่าเดิม', '<p>ล้างข้อมูลแบบฟอร์มที่ตั้งไว้ กลับไปใช้ค่าเดิมของแอปใช่ไหม?</p>', 'คืนค่าเดิม'))) return; FP = null; fpSave(); fpApply(); fpFill(); toast('คืนค่าเดิมแล้ว'); };
    $('#fpOk').onclick = () => { const o = {}; FP_FIELDS.forEach(([k]) => { if (k === 'h') return; const v = $('#fp_' + k).value.trim(); if (v && v !== FP_DEF[k]) o[k] = v; }); o.mod = Date.now(); FP = o; fpSave(); fpApply(); closeDlg('#dFP'); toast('บันทึกข้อมูลแบบฟอร์มแล้ว · แบบฟอร์มที่เปิดครั้งถัดไปจะใช้ค่าใหม่'); };
  }
  fpFill(); openDlg('#dFP');
}
function fpFill() {
  let h = '', open = false;
  FP_FIELDS.forEach(([k, lab, w]) => { if (k === 'h') { if (open) h += '</div>'; h += `<h4>${lab}</h4><div class="fpg">`; open = true; return; } h += `<label class="${w ? 'w' : ''}">${lab}<input id="fp_${k}" value="${esc(fp(k))}"></label>`; });
  $('#fpBody').innerHTML = h + (open ? '</div>' : '');
}
function fpSave() { try { if (FP) localStorage.setItem('np-fprof', JSON.stringify(FP)); else localStorage.removeItem('np-fprof'); } catch (e) { } tpSyncProfileUp(); }

/* ---------- แม่แบบของฉัน ---------- */
const TP = { list: [], loaded: false };
async function tpLoad() { if (TP.loaded) return; try { TP.list = (await tabIdbGet('mytpl')) || []; } catch (e) { TP.list = []; } TP.loaded = true; }
async function tpStore() { try { await tabIdbSet('mytpl', TP.list); } catch (e) { toast('บันทึกแม่แบบในเครื่องไม่สำเร็จ: ' + (e.message || e)); } }
function tpSnapshot() { const d = JSON.parse(JSON.stringify({ settings: doc.settings, blocks: doc.blocks })); delete d.settings.cloud; return d; }
async function tpSaveCurrent(replaceId) {
  await tpLoad(); const old = replaceId && TP.list.find(t => t.id === replaceId);
  if (!old) {
    const ok = await ask('บันทึกเป็นแม่แบบของฉัน', `<div class="row"><label for="tpName" style="width:90px">ชื่อแม่แบบ</label><input type="text" id="tpName" style="flex:1" value="${esc(doc.settings.name || 'แม่แบบของฉัน')}"></div>
<div class="row"><label for="tpDesc" style="width:90px">คำอธิบาย</label><input type="text" id="tpDesc" style="flex:1" placeholder="เช่น ใบงานคาบเรียน ม.5 แบบมีตาราง"></div>
<p class="hint">เก็บทั้งหน้าตา ตั้งค่าหน้า หัว/ท้ายกระดาษ และเนื้อหาทั้งหมดของงานนี้ · ลบหรือแก้ข้อความตัวอย่างออกก่อนบันทึกได้</p>`, 'บันทึกแม่แบบ');
    if (!ok) return; const name = ($('#tpName').value || '').trim() || 'แม่แบบของฉัน', desc = ($('#tpDesc').value || '').trim();
    TP.list.unshift({ id: 't' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6), name, desc, mod: Date.now(), doc: tpSnapshot() });
    toast(`บันทึกแม่แบบ “${name}” แล้ว · เลือกใช้ได้ที่ “ใหม่ → แม่แบบของฉัน”`);
  } else {
    if (!(await ask('แทนที่แม่แบบ', `<p>แทนที่แม่แบบ “${esc(old.name)}” ด้วยงานที่เปิดอยู่ตอนนี้ใช่ไหม?</p>`, 'แทนที่'))) return;
    old.doc = tpSnapshot(); old.mod = Date.now(); old.synced = false; toast('อัปเดตแม่แบบแล้ว');
  }
  await tpStore(); tpSyncUp(); if ($('#dTpl.open')) openTemplates();
}
function tpUse(t) {
  let s = JSON.stringify(t.doc); const ids = (t.doc.blocks || []).map(b => b.id).filter(Boolean);
  ids.forEach(id => { s = s.split('"' + id + '"').join('"' + uid() + '"'); });
  const d = JSON.parse(s); closeDlg('#dTpl');
  doc = { app: 'en-editor', v: 2, settings: Object.assign(sampleDoc().settings, d.settings || {}, { name: t.name }), blocks: d.blocks || [] };
  curId = null; applySettings(); renderAll(); changed(true); refreshInspector(); $('#scroller').scrollTop = 0;
  if (typeof clStatus === 'function') clStatus(); toast(`สร้างงานใหม่จากแม่แบบ “${t.name}” แล้ว`);
}
function tpMenu(btn, t) {
  $$('.cl-menu').forEach(m => m.remove()); const m = document.createElement('div'); m.className = 'cl-menu';
  m.innerHTML = [['use', '▶ ใช้แม่แบบนี้'], ['ren', '✎ เปลี่ยนชื่อ / คำอธิบาย'], ['rep', '⟳ แทนที่ด้วยงานที่เปิดอยู่'], ['del', '🗑 ลบแม่แบบ']].map(([k, x]) => `<button data-m="${k}">${x}</button>`).join('');
  document.body.appendChild(m); const r = btn.getBoundingClientRect(); m.style.top = Math.min(innerHeight - 180, r.bottom + 4) + 'px'; m.style.left = Math.max(8, r.right - 220) + 'px'; m.style.zIndex = 10000;
  const off = ev => { if (!m.contains(ev.target)) { m.remove(); document.removeEventListener('pointerdown', off, true); } }; setTimeout(() => document.addEventListener('pointerdown', off, true), 0);
  m.onclick = async ev => {
    const k = ev.target.dataset.m; if (!k) return; m.remove();
    if (k === 'use') tpUse(t);
    if (k === 'rep') tpSaveCurrent(t.id);
    if (k === 'ren') { const ok = await ask('แก้ไขแม่แบบ', `<div class="row"><label for="tpName" style="width:90px">ชื่อ</label><input type="text" id="tpName" style="flex:1" value="${esc(t.name)}"></div><div class="row"><label for="tpDesc" style="width:90px">คำอธิบาย</label><input type="text" id="tpDesc" style="flex:1" value="${esc(t.desc || '')}"></div>`, 'บันทึก'); if (!ok) { openDlg('#dTpl'); return; } t.name = ($('#tpName').value || '').trim() || t.name; t.desc = ($('#tpDesc').value || '').trim(); t.mod = Date.now(); t.synced = false; await tpStore(); tpSyncUp(); openTemplates(); }
    if (k === 'del') { const ok = await ask('ลบแม่แบบ', `<p>ลบแม่แบบ “${esc(t.name)}” ใช่ไหม?</p><p class="hint">งานที่เคยสร้างจากแม่แบบนี้ไม่ได้รับผลกระทบ${t.drive ? ' · ไฟล์ใน Google Drive จะถูกย้ายไปถังขยะ (กู้คืนได้ภายใน 30 วัน)' : ''}</p>`, 'ลบ'); if (!ok) { openDlg('#dTpl'); return; } TP.list = TP.list.filter(x => x !== t); await tpStore(); if (t.drive && CLD.user && tokOk()) { try { await gd(DRIVE + '/' + t.drive, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ trashed: true }) }); } catch (e) { } } openTemplates(); toast('ลบแม่แบบแล้ว'); }
  };
}
(function () {
  const _ot = openTemplates;
  openTemplates = function () {
    _ot.apply(this, arguments);
    const box = $('#tplList'); if (!box) return;
    const sec = document.createElement('div'); sec.className = 'tplg tplmine';
    const render = () => {
      const L = TP.list;
      sec.innerHTML = `<div class="tplgh"><b>แม่แบบของฉัน</b><span>งานที่บันทึกไว้เป็นแม่แบบ · ซิงก์ทุกเครื่องผ่าน Google Drive</span></div>
<div class="tplbar"><button class="tb" data-tp="save">＋ บันทึกงานที่เปิดอยู่เป็นแม่แบบ</button><button class="tb" data-tp="prof">⚙︎ ตั้งค่าข้อมูลแบบฟอร์ม (โรงเรียน ครู ผู้ลงนาม)</button></div>
${L.length ? `<div class="tplgrid">${L.map((t, i) => `<button class="tplc" data-my="${i}">${tplThumb('blank')}<div class="tpltx"><b>${esc(t.name)}</b><span>${esc(t.desc || ((t.doc.blocks || []).length + ' ส่วน'))}</span></div><span class="tplm" data-tpm="${i}" title="จัดการแม่แบบ">⋯</span></button>`).join('')}</div>` : '<div class="tplempty">ยังไม่มี · จัดหน้างานให้ถูกใจ แล้วกด “บันทึกงานที่เปิดอยู่เป็นแม่แบบ”</div>'}`;
    };
    render(); box.prepend(sec);
    tpLoad().then(() => { render(); tpSyncDown().then(n => { if (n) render(); }); });
    sec.addEventListener('click', e => {
      e.stopPropagation();
      const a = e.target.closest('[data-tp]'); if (a) { if (a.dataset.tp === 'save') { closeDlg('#dTpl'); tpSaveCurrent(); } else { closeDlg('#dTpl'); openFormProfile(); } return; }
      const mm = e.target.closest('[data-tpm]'); if (mm) { tpMenu(mm, TP.list[+mm.dataset.tpm]); return; }
      const c = e.target.closest('[data-my]'); if (c) tpUse(TP.list[+c.dataset.my]);
    });
  };
})();

/* ---------- ซิงก์ผ่าน Google Drive ---------- */
const tpOn = () => typeof CLD !== 'undefined' && CLD.user && tokOk() && navigator.onLine;
async function tpUpload(driveId, md, obj) {
  const bd = 'np' + Math.random().toString(36).slice(2);
  const body = new Blob([`--${bd}\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n${JSON.stringify(md)}\r\n--${bd}\r\nContent-Type: application/json\r\n\r\n`, JSON.stringify(obj), `\r\n--${bd}--`]);
  return gd((driveId ? DUP + '/' + driveId : DUP) + '?uploadType=multipart&fields=id', { method: driveId ? 'PATCH' : 'POST', headers: { 'Content-Type': 'multipart/related; boundary=' + bd }, body });
}
async function tpSyncUp() {
  if (!tpOn()) return; await tpLoad();
  try {
    const root = await ensureRoot(); let ch = false;
    for (const t of TP.list.filter(x => !x.synced)) {
      const md = { name: 'แม่แบบ ' + t.name + '.nptpl', mimeType: 'application/json', appProperties: { np: 'tpl', tid: t.id, mod: String(t.mod || 0) } }; if (!t.drive) md.parents = [root];
      const o = Object.assign({}, t); delete o.drive; delete o.synced;
      const r = await tpUpload(t.drive, md, o); t.drive = r.id; t.synced = true; ch = true;
    }
    if (ch) await tpStore();
  } catch (e) { console.warn('tpl sync up', e); }
}
async function tpSyncDown() {
  if (!tpOn()) return 0; await tpLoad(); let got = 0;
  try {
    const r = await gd(DRIVE + '?' + gq({ q: "appProperties has { key='np' and value='tpl' } and trashed=false", fields: 'files(id,appProperties)', spaces: 'drive', pageSize: 200 }));
    const files = r.files || [], seen = new Set(files.map(f => f.id));
    // แม่แบบที่ถูกลบจากอีกเครื่อง
    const before = TP.list.length; TP.list = TP.list.filter(t => !t.drive || seen.has(t.drive) || !t.synced); if (TP.list.length !== before) got++;
    for (const f of files) {
      const a = f.appProperties || {}; const have = TP.list.find(t => t.id === a.tid);
      if (have && (have.mod || 0) >= (+a.mod || 0)) { if (!have.drive) { have.drive = f.id; have.synced = true; } continue; }
      const t = await gd(DRIVE + '/' + f.id + '?alt=media'); if (!t || !t.doc) continue;
      t.drive = f.id; t.synced = true; TP.list = TP.list.filter(x => x.id !== t.id); TP.list.push(t); got++;
    }
    TP.list.sort((x, y) => (y.mod || 0) - (x.mod || 0)); if (got) await tpStore();
    tpSyncUp();
  } catch (e) { console.warn('tpl sync down', e); }
  return got;
}
async function tpSyncProfileUp() {
  if (!tpOn()) return;
  try {
    const r = await gd(DRIVE + '?' + gq({ q: "appProperties has { key='np' and value='prof' } and trashed=false", fields: 'files(id)', spaces: 'drive' }));
    const id = r.files && r.files[0] && r.files[0].id; const md = { name: 'ข้อมูลแบบฟอร์ม.npprof', mimeType: 'application/json', appProperties: { np: 'prof', mod: String((FP && FP.mod) || Date.now()) } };
    if (!id) md.parents = [await ensureRoot()];
    await tpUpload(id, md, FP || { mod: Date.now(), reset: true });
  } catch (e) { console.warn('prof sync', e); }
}
async function tpSyncProfileDown() {
  if (!tpOn()) return;
  try {
    const r = await gd(DRIVE + '?' + gq({ q: "appProperties has { key='np' and value='prof' } and trashed=false", fields: 'files(id,appProperties)', spaces: 'drive' }));
    const f = r.files && r.files[0]; if (!f) { if (FP) tpSyncProfileUp(); return; }
    const m = +(f.appProperties || {}).mod || 0; if (FP && (FP.mod || 0) >= m) { if ((FP.mod || 0) > m) tpSyncProfileUp(); return; }
    const p = await gd(DRIVE + '/' + f.id + '?alt=media'); FP = p && !p.reset ? p : null;
    try { if (FP) localStorage.setItem('np-fprof', JSON.stringify(FP)); else localStorage.removeItem('np-fprof'); } catch (e) { }
    fpApply();
  } catch (e) { console.warn('prof sync down', e); }
}
(function () {
  if (typeof clRefresh === 'function') { const _r = clRefresh; clRefresh = async function () { const x = await _r.apply(this, arguments); tpSyncProfileDown(); tpSyncDown(); return x; }; }
  if (typeof CLD !== 'undefined' && CLD.loaded) { tpSyncProfileDown(); tpSyncDown(); }
})();

/* ===================== แทรกลายเซ็น =====================
   · เซ็นด้วยเมาส์ / นิ้ว / Apple Pencil (รับแรงกด) หรือถ่ายรูปลายเซ็นบนกระดาษ → ตัดพื้นขาวออกอัตโนมัติ
   · เก็บลายเซ็นไว้ใช้ซ้ำ (ในเครื่อง + ซิงก์ Google Drive)
   · แทรกที่เคอร์เซอร์ · ถ้าอยู่บรรทัด “ลงชื่อ ......” จะวางทับเส้นจุดให้พอดี */
(function () {
  const s = document.createElement('style');
  s.textContent = `#flow .sigw{display:inline-block;width:0;height:1em;position:relative;vertical-align:baseline}
#flow .sigw img.ii.sig{position:absolute;left:.4em;bottom:-.35em;max-width:none;z-index:2}
#flow img.ii.sig{max-width:none}
#sigBody{display:flex;gap:14px}#sigLib{width:190px;flex:none;max-height:420px;overflow:auto}#sigLib h4,#sigMain h4{margin:0 0 6px}
#sigLib .sg{position:relative;border:1px solid var(--ui-line);border-radius:9px;padding:6px;margin-bottom:6px;background:#fff;cursor:pointer;text-align:center}
#sigLib .sg:hover{border-color:var(--ui-accent)}#sigLib .sg.on{box-shadow:0 0 0 2px var(--ui-accent)}#sigLib .sg img{max-width:100%;max-height:60px}#sigLib .sg small{display:block;color:var(--ui-mute);font-size:13px}
#sigLib .sg .x{position:absolute;top:2px;right:4px;border:0;background:none;color:#999;cursor:pointer;font-size:15px}
#sigMain{flex:1;min-width:0}#sigTabs{display:flex;gap:6px;margin-bottom:8px}#sigTabs .tb.on{border-color:var(--ui-accent);color:var(--ui-accent);font-weight:700}
#sigPad{width:100%;height:230px;border:1px dashed #b9aea5;border-radius:10px;background:#fff linear-gradient(transparent 74%,#e7ddd3 74%,#e7ddd3 74.6%,transparent 74.6%);touch-action:none;cursor:crosshair;display:block}
#sigPrev{width:100%;height:230px;border:1px dashed #b9aea5;border-radius:10px;background:repeating-conic-gradient(#f3eee9 0 25%,#fff 0 50%) 0 0/16px 16px;display:flex;align-items:center;justify-content:center;overflow:hidden}
#sigPrev img{max-width:96%;max-height:96%}
#sigMain .r{display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin:8px 0}#sigMain .r label{color:var(--ui-mute);font-size:15px}
#sigMain .ink{width:22px;height:22px;border-radius:50%;border:2px solid #fff;box-shadow:0 0 0 1px #0003;cursor:pointer}#sigMain .ink.on{box-shadow:0 0 0 2px var(--ui-accent)}`;
  document.head.appendChild(s);
})();
const SG = { list: [], loaded: false, ink: '#1a1a1a', w: 2.6, strokes: [], cur: null, mode: 'draw', photo: null, pick: null, range: null, blkId: null };
async function sgLoad() { if (SG.loaded) return; try { SG.list = (await tabIdbGet('sigs')) || []; } catch (e) { SG.list = []; } SG.loaded = true; }
async function sgStore() { try { await tabIdbSet('sigs', SG.list); } catch (e) { } }

/* ---------- วาดลายเซ็น ---------- */
function sgPadInit() {
  const cv = $('#sigPad'), r = cv.getBoundingClientRect(), k = 2; cv.width = Math.round(r.width * k); cv.height = Math.round(r.height * k);
  sgRedraw();
  cv.onpointerdown = e => { e.preventDefault(); cv.setPointerCapture(e.pointerId); const p = sgPt(e); SG.cur = { ink: SG.ink, w: SG.w, pts: [p] }; SG.strokes.push(SG.cur); sgRedraw(); };
  cv.onpointermove = e => { if (!SG.cur) return; const evs = e.getCoalescedEvents ? e.getCoalescedEvents() : [e]; evs.forEach(x => SG.cur.pts.push(sgPt(x))); sgRedraw(); };
  cv.onpointerup = cv.onpointercancel = () => { SG.cur = null; };
}
function sgPt(e) { const cv = $('#sigPad'), r = cv.getBoundingClientRect(); const pr = e.pointerType === 'mouse' || !e.pressure ? 0.5 : e.pressure; return [(e.clientX - r.left) * cv.width / r.width, (e.clientY - r.top) * cv.height / r.height, pr]; }
function sgDrawStrokes(g, strokes, scale = 2) {
  g.lineCap = 'round'; g.lineJoin = 'round';
  strokes.forEach(s => {
    const P = s.pts; g.strokeStyle = s.ink; g.fillStyle = s.ink;
    if (P.length === 1) { g.beginPath(); g.arc(P[0][0], P[0][1], s.w * scale * 0.6, 0, 7); g.fill(); return; }
    for (let i = 1; i < P.length; i++) { // เส้นหนาบางตามแรงกด
      const a = P[i - 1], b = P[i], m0 = i > 1 ? [(P[i - 2][0] + a[0]) / 2, (P[i - 2][1] + a[1]) / 2] : a, m1 = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
      g.lineWidth = s.w * scale * (0.55 + (a[2] + b[2]) * 0.6); g.beginPath(); g.moveTo(m0[0], m0[1]); g.quadraticCurveTo(a[0], a[1], m1[0], m1[1]); g.stroke();
    }
  });
}
function sgRedraw() { const cv = $('#sigPad'); if (!cv) return; const g = cv.getContext('2d'); g.clearRect(0, 0, cv.width, cv.height); sgDrawStrokes(g, SG.strokes); }
function sgCrop(cv, pad = 10) { // ตัดขอบว่างรอบลายเซ็น → PNG โปร่งใส
  const g = cv.getContext('2d'), d = g.getImageData(0, 0, cv.width, cv.height).data; let l = cv.width, t = cv.height, r = -1, b = -1;
  for (let y = 0; y < cv.height; y++) for (let x = 0; x < cv.width; x++) if (d[(y * cv.width + x) * 4 + 3] > 16) { if (x < l) l = x; if (x > r) r = x; if (y < t) t = y; if (y > b) b = y; }
  if (r < 0) return null; l = Math.max(0, l - pad); t = Math.max(0, t - pad); r = Math.min(cv.width - 1, r + pad); b = Math.min(cv.height - 1, b + pad);
  const o = document.createElement('canvas'); o.width = r - l + 1; o.height = b - t + 1; o.getContext('2d').drawImage(cv, l, t, o.width, o.height, 0, 0, o.width, o.height); return o.toDataURL('image/png');
}
/* ---------- ลายเซ็นจากรูปถ่าย: ตัดพื้นขาว ---------- */
async function sgFromPhoto() {
  const P = SG.photo; if (!P) return null; const im = P.img, k = Math.min(1, 1400 / Math.max(im.naturalWidth, im.naturalHeight));
  const cv = document.createElement('canvas'); cv.width = Math.round(im.naturalWidth * k); cv.height = Math.round(im.naturalHeight * k); const g = cv.getContext('2d'); g.drawImage(im, 0, 0, cv.width, cv.height);
  const D = g.getImageData(0, 0, cv.width, cv.height), d = D.data, th = +$('#sgTh').value, keep = $('#sgKeep').checked; const ink = SG.ink, ir = parseInt(ink.slice(1, 3), 16), ig = parseInt(ink.slice(3, 5), 16), ib = parseInt(ink.slice(5, 7), 16);
  for (let i = 0; i < d.length; i += 4) {
    const L = 0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2];
    if (L >= th) { d[i + 3] = 0; continue; }
    d[i + 3] = Math.min(255, Math.round((th - L) / Math.max(1, th - 40) * 255 * 1.4));
    if (!keep) { d[i] = ir; d[i + 1] = ig; d[i + 2] = ib; }
  }
  g.putImageData(D, 0, 0); return sgCrop(cv, 6);
}
async function sgPhotoPrev() { const u = await sgFromPhoto(); $('#sigPrev').innerHTML = u ? `<img src="${u}">` : '<span class="hint">ไม่พบเส้นลายเซ็น ลองเลื่อนความไวของการตัดพื้น</span>'; SG.photoOut = u; }

/* ---------- หน้าต่าง ---------- */
async function openSignature() {
  if (typeof pgRangeNow === 'function') SG.range = pgRangeNow(); SG.blkId = curId;
  await sgLoad();
  let d = $('#dSig');
  if (!d) {
    d = document.createElement('div'); d.className = 'dlg-back'; d.id = 'dSig';
    d.innerHTML = `<div class="dlg" style="width:880px;max-width:96vw"><h3>แทรกลายเซ็น</h3><div id="sigBody"><div id="sigLib"></div><div id="sigMain">
<div id="sigTabs"><button class="tb on" data-m="draw">✍ เซ็นบนจอ</button><button class="tb" data-m="photo">📷 จากรูปถ่ายลายเซ็น</button></div>
<div id="sgDraw"><canvas id="sigPad"></canvas><div class="r"><label>สีหมึก</label>${['#1a1a1a', '#1f3fa8', '#0b2a6f'].map((c, i) => `<span class="ink${i ? '' : ' on'}" data-ink="${c}" style="background:${c}"></span>`).join('')}<label style="margin-left:10px">ความหนา</label><input type="range" id="sgW" min="1.2" max="5" step=".2" value="2.6"><button class="tb" id="sgUndo">↶ ย้อน</button><button class="tb" id="sgClr">ล้าง</button></div></div>
<div id="sgPhoto" style="display:none"><div id="sigPrev"><span class="hint">เลือกรูปถ่ายลายเซ็นบนกระดาษขาว (ถ่ายตรง ๆ แสงสว่าง)</span></div><div class="r"><button class="tb" id="sgPick">เลือกรูป…</button><label>ความไวการตัดพื้น</label><input type="range" id="sgTh" min="90" max="235" value="170"><label><input type="checkbox" id="sgKeep"> ใช้สีหมึกจริงจากรูป</label></div><input type="file" id="sgFile" accept="image/*" hidden></div>
<div class="r"><label>ชื่อลายเซ็น</label><input type="text" id="sgName" placeholder="เช่น ลายเซ็นของฉัน" style="flex:1;min-width:140px"><label><input type="checkbox" id="sgSave" checked> เก็บไว้ใช้ครั้งต่อไป</label></div>
<div class="r"><label>ขนาด (กว้าง)</label><select id="sgSize"><option value="2.8">2.8 ซม.</option><option value="3.5" selected>3.5 ซม.</option><option value="4.5">4.5 ซม.</option><option value="6">6 ซม.</option></select><label>การวาง</label><select id="sgPlace"><option value="free" selected>วางอิสระ ลากย้ายไปตรงไหนก็ได้</option><option value="over">อยู่ในบรรทัด ทับเส้น “ลงชื่อ ......”</option><option value="inl">อยู่ในบรรทัดที่เคอร์เซอร์</option></select></div>
</div></div><div class="actions"><span class="hint" id="sgWhere" style="margin-right:auto"></span><button class="tb" id="sgNo">ยกเลิก</button><button class="tb primary" id="sgOk">แทรกลายเซ็น</button></div></div>`;
    document.body.appendChild(d);
    $('#sgNo').onclick = () => closeDlg('#dSig');
    $('#sigTabs').onclick = e => { const b = e.target.closest('[data-m]'); if (!b) return; SG.mode = b.dataset.m; SG.pick = null; sgLib(); $$('#sigTabs .tb').forEach(x => x.classList.toggle('on', x === b)); $('#sgDraw').style.display = SG.mode === 'draw' ? '' : 'none'; $('#sgPhoto').style.display = SG.mode === 'photo' ? '' : 'none'; if (SG.mode === 'draw') sgPadInit(); };
    d.querySelector('#sgDraw .r').onclick = e => { const k = e.target.closest('[data-ink]'); if (!k) return; SG.ink = k.dataset.ink; $$('#dSig .ink').forEach(x => x.classList.toggle('on', x === k)); };
    $('#sgW').oninput = e => { SG.w = +e.target.value; };
    $('#sgUndo').onclick = () => { SG.strokes.pop(); sgRedraw(); }; $('#sgClr').onclick = () => { SG.strokes = []; sgRedraw(); };
    $('#sgPick').onclick = () => $('#sgFile').click();
    $('#sgFile').onchange = e => { const f = e.target.files[0]; e.target.value = ''; if (!f) return; const rd = new FileReader(); rd.onload = () => { const im = new Image(); im.onload = () => { SG.photo = { img: im }; sgPhotoPrev(); }; im.src = rd.result; }; rd.readAsDataURL(f); };
    $('#sgTh').oninput = () => { clearTimeout(SG.tt); SG.tt = setTimeout(sgPhotoPrev, 120); }; $('#sgKeep').onchange = sgPhotoPrev;
    d.querySelector('#sgPhoto').addEventListener('click', e => { if (e.target.closest('[data-ink]')) setTimeout(sgPhotoPrev, 0); });
    $('#sgOk').onclick = sgInsertFromDlg;
  }
  SG.strokes = []; SG.pick = null; $('#sgName').value = ''; sgLib(); openDlg('#dSig'); setTimeout(sgPadInit, 30);
  const blk = SG.blkId && byId(SG.blkId);
  $('#sgWhere').textContent = SG.range ? 'จะแทรกตรงตำแหน่งเคอร์เซอร์' : blk && blk.t === 'lpsign' ? 'จะแทรกในช่องลงชื่อของกล่องที่เลือก' : 'จะแทรกเป็นรูปต่อจากส่วนที่เลือก (คลิกในข้อความก่อน เพื่อแทรกในบรรทัด)';
  sgSyncDown().then(n => { if (n) sgLib(); });
}
function sgLib() {
  const L = SG.list; $('#sigLib').innerHTML = `<h4>ลายเซ็นที่เก็บไว้</h4>` + (L.length ? L.map((s, i) => `<div class="sg${SG.pick === i ? ' on' : ''}" data-i="${i}"><button class="x" data-del="${i}" title="ลบ">✕</button><img src="${s.src}"><small>${esc(s.name || 'ลายเซ็น')}</small></div>`).join('') : '<p class="hint">ยังไม่มี · เซ็นทางขวาแล้วติ๊ก “เก็บไว้ใช้ครั้งต่อไป”</p>');
  $('#sigLib').onclick = async e => {
    const x = e.target.closest('[data-del]'); if (x) { e.stopPropagation(); const s = SG.list[+x.dataset.del]; if (!(await ask('ลบลายเซ็น', `<p>ลบลายเซ็น “${esc(s.name || 'ลายเซ็น')}” ออกจากรายการใช่ไหม?</p><p class="hint">ลายเซ็นที่แทรกในเอกสารแล้วไม่หายไป${s.drive ? ' · ไฟล์ใน Drive ย้ายไปถังขยะ (กู้คืนได้ 30 วัน)' : ''}</p>`, 'ลบ'))) { openDlg('#dSig'); return; } SG.list = SG.list.filter(y => y !== s); await sgStore(); if (s.drive && tpOn()) { try { await gd(DRIVE + '/' + s.drive, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ trashed: true }) }); } catch (er) { } } SG.pick = null; openDlg('#dSig'); sgLib(); return; }
    const c = e.target.closest('[data-i]'); if (!c) return; SG.pick = SG.pick === +c.dataset.i ? null : +c.dataset.i; sgLib();
    if (SG.pick !== null) { $('#sgOk').textContent = 'แทรกลายเซ็นที่เลือก'; } else $('#sgOk').textContent = 'แทรกลายเซ็น';
  };
  $$('#sigLib .sg').forEach(el => el.addEventListener('dblclick', () => { SG.pick = +el.dataset.i; sgInsertFromDlg(); }));
}
async function sgInsertFromDlg() {
  let src = null, name = $('#sgName').value.trim();
  if (SG.pick !== null && SG.list[SG.pick]) src = SG.list[SG.pick].src;
  else if (SG.mode === 'draw') { if (!SG.strokes.length) { toast('เซ็นในกรอบก่อน หรือเลือกลายเซ็นที่เก็บไว้'); return; } src = sgCrop($('#sigPad'), 10); }
  else { src = SG.photoOut || null; if (!src) { toast('เลือกรูปถ่ายลายเซ็นก่อน'); return; } }
  if (!src) return;
  if (SG.pick === null && $('#sgSave').checked) { SG.list.unshift({ id: 's' + Date.now().toString(36), name: name || 'ลายเซ็น ' + (SG.list.length + 1), src, mod: Date.now() }); await sgStore(); sgSyncUp(); }
  closeDlg('#dSig'); const pl = $('#sgPlace').value; if (pl === 'free') sgInsertFree(src, +$('#sgSize').value); else sgInsert(src, +$('#sgSize').value, pl === 'over');
}
/* ---------- แทรกลงเอกสาร ---------- */
// วางอิสระ: เริ่มที่เส้น “ลงชื่อ” ถ้ามี ไม่งั้นที่เคอร์เซอร์ หรือกลางจอ แล้วลากย้ายได้ทุกที่
async function sgInsertFree(src, cm) {
  const im = await pgLoadImg(src).catch(() => null); const wpx = cm * PG_PX_CM; const blk0 = SG.blkId && byId(SG.blkId); const z = ($('#flow').getBoundingClientRect().width / $('#flow').offsetWidth) || 1;
  const hpx = im ? wpx * im.naturalHeight / im.naturalWidth : wpx * 0.4; let cx = null, cy = null;
  let ed = SG.range && SG.range.startContainer.isConnected ? pgEdOf(SG.range.startContainer) : null;
  if (ed && ed.closest('.b-lpsign')) ed = ed.closest('.blk').querySelector('[data-f="l1"]') || ed;
  if (!ed && blk0 && blk0.t === 'lpsign') ed = $(`.blk[data-id="${blk0.id}"] [data-f="l1"]`);
  if (ed && /ลงชื่อ/.test(ed.textContent)) { const tw = document.createTreeWalker(ed, NodeFilter.SHOW_TEXT); let n; while ((n = tw.nextNode())) { const m = /ลงชื่อ\)?\s*/.exec(n.nodeValue); if (!m) continue; const rr = document.createRange(); rr.setStart(n, m.index + m[0].length); rr.collapse(true); const q = rr.getClientRects()[0] || rr.getBoundingClientRect(); if (q && (q.left || q.top)) { cx = q.left + 6 * z; cy = q.bottom - hpx * z * 0.82; } break; } }
  if (cx === null && SG.range && SG.range.startContainer.isConnected) { const q = SG.range.getClientRects()[0] || SG.range.getBoundingClientRect(); if (q && (q.left || q.top)) { cx = q.left; cy = q.top - hpx * z * 0.6; } }
  if (cx === null) { const el = blk0 && $(`.blk[data-id="${blk0.id}"]`); const sr = $('#scroller').getBoundingClientRect(), fr = $('#flow').getBoundingClientRect(); if (el) { const r = el.getBoundingClientRect(); cx = r.left + r.width - wpx * z - 20; cy = r.top; } else { cx = fr.left + fr.width / 2 - wpx * z / 2; cy = sr.top + sr.height / 2 - hpx * z / 2; } }
  flAddAt(src, wpx, cx, cy, true); schedulePaginate(); toast('ลากลายเซ็นไปวางตรงไหนก็ได้ · ลากมุมเพื่อปรับขนาด · ลูกศรขยับทีละนิด');
}
function sgImg(src, cm) { const im = document.createElement('img'); im.className = 'ii sig'; im.alt = 'ลายเซ็น'; im.src = src; im.draggable = false; im.style.width = Math.round(cm * PG_PX_CM) + 'px'; return im; }
function sgInsert(src, cm, over) {
  let r = SG.range && SG.range.startContainer.isConnected ? SG.range : null; let ed = r && pgEdOf(r.startContainer);
  const blk0 = SG.blkId && byId(SG.blkId);
  if (!ed && blk0 && blk0.t === 'lpsign') { const el = $(`.blk[data-id="${blk0.id}"] [data-f="l1"]`); if (el) { ed = el; r = document.createRange(); r.selectNodeContents(el); r.collapse(true); } }
  if (ed && over && ed.closest('.b-lpsign') && ed.dataset.f !== 'l1') { const l1 = ed.closest('.blk').querySelector('[data-f="l1"]'); if (l1) { ed = l1; r = document.createRange(); r.selectNodeContents(l1); r.collapse(false); } }
  if (!ed) { // ไม่มีเคอร์เซอร์ในข้อความ → เป็นรูปแยกบรรทัด
    const nb = newBlock('image', { src, w: Math.round(cm * PG_PX_CM / 658 * 100) }); nb.st = { al: 'right' }; insertBlocks([nb]); toast('แทรกลายเซ็นแล้ว'); return;
  }
  const im = sgImg(src, cm);
  // อยู่ในบรรทัดที่มี “ลงชื่อ” → วางหลังคำว่าลงชื่อ ทับเส้นจุด
  const lineHasSign = /ลงชื่อ/.test(ed.textContent);
  if (over && lineHasSign) {
    const tw = document.createTreeWalker(ed, NodeFilter.SHOW_TEXT); let n, done = false;
    while ((n = tw.nextNode())) { const m = /ลงชื่อ\)?\s*/.exec(n.nodeValue); if (!m) continue; const rr = document.createRange(); rr.setStart(n, m.index + m[0].length); rr.collapse(true); const w = document.createElement('span'); w.className = 'sigw'; w.contentEditable = 'false'; w.appendChild(im); rr.insertNode(w); done = true; break; }
    if (!done) { r.insertNode(im); }
  } else { r.collapse(false); r.insertNode(im); }
  syncFrom(ed); changed(true); schedulePaginate(); const b = ed.closest('.blk'); if (b) selectBlock(b.dataset.id);
  setTimeout(() => { if (typeof pgSelect === 'function') pgSelect(im); }, 60);
  toast('แทรกลายเซ็นแล้ว · ลากมุมเพื่อปรับขนาดได้');
}
// ปุ่มบนแถบเครื่องมือ
(function () {
  const bi = $('#bImg'); if (!bi) return;
  const b = document.createElement('button'); b.className = 'tb'; b.id = 'bSig'; b.title = 'แทรกลายเซ็น (เซ็นบนจอ หรือจากรูปถ่าย)'; b.textContent = '✍ ลายเซ็น';
  b.addEventListener('mousedown', e => e.preventDefault()); b.onclick = openSignature; bi.after(b);
})();
/* ---------- ซิงก์ลายเซ็นผ่าน Google Drive ---------- */
async function sgSyncUp() {
  if (!tpOn()) return; await sgLoad();
  try { const root = await ensureRoot(); let ch = false;
    for (const s of SG.list.filter(x => !x.drive)) { const md = { name: 'ลายเซ็น ' + s.name + '.npsig', mimeType: 'application/json', parents: [root], appProperties: { np: 'sig', sid: s.id, mod: String(s.mod || 0) } }; const o = Object.assign({}, s); delete o.drive; const r = await tpUpload('', md, o); s.drive = r.id; ch = true; }
    if (ch) await sgStore(); } catch (e) { console.warn('sig sync', e); }
}
async function sgSyncDown() {
  if (!tpOn()) return 0; await sgLoad(); let got = 0;
  try {
    const r = await gd(DRIVE + '?' + gq({ q: "appProperties has { key='np' and value='sig' } and trashed=false", fields: 'files(id,appProperties)', spaces: 'drive', pageSize: 100 }));
    const files = r.files || [], seen = new Set(files.map(f => f.id)); const n0 = SG.list.length;
    SG.list = SG.list.filter(s => !s.drive || seen.has(s.drive)); if (SG.list.length !== n0) got++;
    for (const f of files) { const a = f.appProperties || {}; const have = SG.list.find(s => s.id === a.sid); if (have) { have.drive = f.id; continue; } const s = await gd(DRIVE + '/' + f.id + '?alt=media'); if (!s || !s.src) continue; s.drive = f.id; SG.list.push(s); got++; }
    if (got) { SG.list.sort((x, y) => (y.mod || 0) - (x.mod || 0)); await sgStore(); }
    sgSyncUp();
  } catch (e) { console.warn('sig sync down', e); }
  return got;
}

/* ===================== รูป/ลายเซ็นลอยอิสระ =====================
   วางได้ทุกตำแหน่งบนหน้ากระดาษ ลากย้ายได้อิสระ (ไม่ดันข้อความ) · ผูกกับส่วนที่อยู่ใต้รูป จึงเลื่อนตามเนื้อหา
   เก็บใน b.fl = [{ fid, src, x, y, w, sig }] — x, y เป็น px จากมุมซ้ายบนของกล่อง */
(function () {
  const s = document.createElement('style');
  s.textContent = `#flow img.flimg{position:absolute;z-index:6;max-width:none;cursor:move;-webkit-user-drag:none;user-select:none;-webkit-user-select:none;touch-action:none}
#flow img.flimg:hover{outline:1px dashed #2f7de1aa}
.fldragging,.fldragging *{cursor:move!important}`;
  document.head.appendChild(s);
})();
const flId = () => 'f' + Math.random().toString(36).slice(2, 9);
// วาดรูปลอยของกล่อง
const _fbFl = fillBlock;
fillBlock = function (el, b) {
  _fbFl(el, b); $$(':scope > img.flimg', el).forEach(x => x.remove());
  (b.fl || []).forEach(f => { const im = document.createElement('img'); im.className = 'flimg' + (f.sig ? ' sig' : ''); im.dataset.fid = f.fid; im.alt = f.sig ? 'ลายเซ็น' : 'รูป'; im.draggable = false; im.src = f.src; Object.assign(im.style, { left: f.x + 'px', top: f.y + 'px', width: f.w + 'px' }); if (f.look) pgApplyLook(im, f.look); el.appendChild(im); });
};
function flFind(fid) { for (const b of doc.blocks) { const f = (b.fl || []).find(x => x.fid === fid); if (f) return { b, f }; } return null; }
function flSave(T) { const r = flFind(T.fid); if (!r) return; r.f.w = Math.round(parseFloat(T.img.style.width) || r.f.w); changed(true); }
function flRemove(id, fid) { const b = byId(id); if (!b || !b.fl) return; b.fl = b.fl.filter(x => x.fid !== fid); if (!b.fl.length) delete b.fl; const im = $(`#flow img.flimg[data-fid="${fid}"]`); if (im) im.remove(); changed(true); toast('ลบแล้ว'); }
function flBar() {
  $('#ibar').innerHTML = '<span style="padding:0 8px;color:var(--ui-mute);font-size:14px">✥ ลากเพื่อย้ายได้อิสระ</span><span class="sep"></span><button data-a="flinl" title="กลับไปอยู่ในบรรทัดข้อความ">▭ ใส่ในบรรทัด</button><button data-a="flfront" title="ซ้อนไว้บนสุด">⬆ บนสุด</button><button data-a="del" title="ลบ">🗑</button>';
}
// ปุ่มบนแถบของรูปลอย
document.addEventListener('click', e => {
  const b = e.target.closest && e.target.closest('#ibar [data-a="flinl"], #ibar [data-a="flfront"]'); if (!b || !PG.T || !PG.T.fl) return; e.stopImmediatePropagation();
  const T = PG.T, r = flFind(T.fid); if (!r) return;
  if (b.dataset.a === 'flfront') { r.b.fl = r.b.fl.filter(x => x !== r.f); r.b.fl.push(r.f); rerender(r.b.id); changed(true); pgReselect(); return; }
  // ใส่กลับในบรรทัด: ไปไว้ท้ายข้อความช่องแรกของกล่อง (หรือกล่องข้อความใหม่)
  pgSelect(null); r.b.fl = r.b.fl.filter(x => x !== r.f); if (!r.b.fl.length) delete r.b.fl;
  const el = $(`.blk[data-id="${r.b.id}"]`); rerender(r.b.id); const ed = edsOf($(`.blk[data-id="${r.b.id}"]`))[0];
  const im = document.createElement('img'); im.className = 'ii' + (r.f.sig ? ' sig' : ''); im.src = r.f.src; im.draggable = false; im.style.width = r.f.w + 'px';
  if (ed) { ed.appendChild(im); syncFrom(ed); } else { const nb = newBlock('para', { html: '' }); doc.blocks.splice(idx(r.b.id) + 1, 0, nb); nb.html = im.outerHTML; renderAll(); }
  changed(true); schedulePaginate();
}, true);
// แปลงรูปในบรรทัด → ลอยอิสระ (คงตำแหน่งเดิมบนจอ)
function flFromImg(T) {
  if (!T || !T.inl) return; const img = T.img, blk = img.closest('.blk'), z = pgZ(img), r = img.getBoundingClientRect(), br = blk.getBoundingClientRect();
  const b = byId(blk.dataset.id); const f = { fid: flId(), src: img.src, x: Math.round((r.left - br.left) / z), y: Math.round((r.top - br.top) / z), w: Math.round(r.width / z) };
  if (img.classList.contains('sig')) f.sig = true; const lk = pgLookOfInline(img); if (Object.keys(lk).length) f.look = lk;
  const ed = T.ed; pgSelect(null); const w = img.closest('.sigw'); (w || img).remove(); if (ed) syncFrom(ed);
  b.fl = (b.fl || []).concat(f); rerender(b.id); changed(true); schedulePaginate();
  setTimeout(() => { const n = $(`#flow img.flimg[data-fid="${f.fid}"]`); if (n) pgSelect(n); }, 40);
  toast('ลากไปวางตรงไหนก็ได้บนหน้ากระดาษ');
}
// เพิ่มรูปลอยที่ตำแหน่งบนจอ (clientX, clientY = มุมซ้ายบนของรูป)
function flAddAt(src, wpx, cx, cy, sig) {
  const blk = flBlockAt(cy) || $('#flow > .blk'); if (!blk) return null; const z = blk.getBoundingClientRect().width / blk.offsetWidth || 1, br = blk.getBoundingClientRect();
  const b = byId(blk.dataset.id), f = { fid: flId(), src, x: Math.round((cx - br.left) / z), y: Math.round((cy - br.top) / z), w: Math.round(wpx) }; if (sig) f.sig = true;
  b.fl = (b.fl || []).concat(f); rerender(b.id); changed(true);
  setTimeout(() => { const n = $(`#flow img.flimg[data-fid="${f.fid}"]`); if (n) pgSelect(n); }, 40); return f;
}
// กล่องที่อยู่ ณ ระดับความสูงนี้ (ใช้ผูกรูปลอย)
function flBlockAt(cy) { let last = null; for (const el of $$('#flow > .blk')) { const r = el.getBoundingClientRect(); if (r.top <= cy) last = el; else break; } return last; }
// ลากย้าย
let flD = null;
addEventListener('pointerdown', e => {
  if (e.button !== 0) return; const img = e.target.closest && e.target.closest('#flow img.flimg'); if (!img) return;
  e.preventDefault(); e.stopPropagation();
  pgSelect(img); const r = img.getBoundingClientRect(); flD = { img, dx: e.clientX - r.left, dy: e.clientY - r.top, x0: e.clientX, y0: e.clientY, z: pgZ(img), moved: false, l0: parseFloat(img.style.left) || 0, t0: parseFloat(img.style.top) || 0 };
  try { img.setPointerCapture(e.pointerId); } catch (er) { }
}, true);
addEventListener('pointermove', e => {
  if (!flD) return; const d = flD; if (!d.moved && Math.hypot(e.clientX - d.x0, e.clientY - d.y0) < 3) return;
  if (!d.moved) { d.moved = true; document.body.classList.add('fldragging'); $('#ibar').classList.remove('on'); }
  d.img.style.left = (d.l0 + (e.clientX - d.x0) / d.z) + 'px'; d.img.style.top = (d.t0 + (e.clientY - d.y0) / d.z) + 'px';
  const sc = $('#scroller'), cr = sc.getBoundingClientRect(); if (e.clientY > cr.bottom - 30) sc.scrollTop += 14; else if (e.clientY < cr.top + 30) sc.scrollTop -= 14;
}, true);
addEventListener('pointerup', () => {
  if (!flD) return; const d = flD; flD = null; document.body.classList.remove('fldragging'); if (PG.T) { $('#ibar').classList.add('on'); }
  if (!d.moved) return; const r = d.img.getBoundingClientRect(), fid = d.img.dataset.fid, F = flFind(fid); if (!F) return;
  // ผูกกับกล่องที่อยู่ใต้มุมบนของรูป
  const nb = flBlockAt(r.top) || $('#flow > .blk') || d.img.closest('.blk'); const z = d.z, br = nb.getBoundingClientRect();
  F.f.x = Math.round((r.left - br.left) / z); F.f.y = Math.round((r.top - br.top) / z);
  if (nb.dataset.id !== F.b.id) { F.b.fl = F.b.fl.filter(x => x !== F.f); if (!F.b.fl.length) delete F.b.fl; const t = byId(nb.dataset.id); t.fl = (t.fl || []).concat(F.f); rerender(F.b.id); rerender(t.id); setTimeout(() => { const n = $(`#flow img.flimg[data-fid="${fid}"]`); if (n) pgSelect(n); }, 30); }
  else { d.img.style.left = F.f.x + 'px'; d.img.style.top = F.f.y + 'px'; }
  changed(true);
}, true);
// ลูกศรขยับทีละนิด (Shift = ทีละมาก)
addEventListener('keydown', e => {
  if (!PG.T || !PG.T.fl || !/^Arrow/.test(e.key) || e.metaKey || e.ctrlKey) return; e.preventDefault(); e.stopImmediatePropagation();
  const F = flFind(PG.T.fid); if (!F) return; const st = e.shiftKey ? 10 : 1;
  if (e.key === 'ArrowLeft') F.f.x -= st; if (e.key === 'ArrowRight') F.f.x += st; if (e.key === 'ArrowUp') F.f.y -= st; if (e.key === 'ArrowDown') F.f.y += st;
  PG.T.img.style.left = F.f.x + 'px'; PG.T.img.style.top = F.f.y + 'px'; clearTimeout(flD && 0); clearTimeout(window.__flk); window.__flk = setTimeout(() => changed(true), 300);
}, true);

/* ---------- ส่งออก Word: วางรูปลอยแบบยึดตำแหน่ง ---------- */
(function () {
  const _dx = exportDOCX;
  exportDOCX = async function () { for (const b of doc.blocks) for (const f of (b.fl || [])) if (!PG_ISZ[f.src]) PG_ISZ[f.src] = await imgSize(f.src); return _dx.apply(this, arguments); };
  const bd = $('#bDocx'); if (bd) bd.onclick = () => exportDOCX();
  const _bx = blockXML;
  blockXML = async function (b, keep) {
    let x = await _bx(b, keep); if (!b.fl || !b.fl.length) return x;
    const anch = b.fl.map(f => {
      const m = /^data:image\/(png|jpeg|jpg|gif);base64,(.*)$/.exec(f.src); if (!m) return ''; const sz = PG_ISZ[f.src] || { w: 400, h: 200 };
      const rid = addMedia(m[2], m[1] === 'jpeg' ? 'jpg' : m[1]), id = ++DX.pic; const cx = Math.round(f.w / 3.7795 * EMU), cy = Math.round(f.w / 3.7795 * sz.h / sz.w * EMU);
      return `<w:r><w:drawing><wp:anchor distT="0" distB="0" distL="0" distR="0" simplePos="0" relativeHeight="${251660000 + id}" behindDoc="0" locked="0" layoutInCell="1" allowOverlap="1"><wp:simplePos x="0" y="0"/><wp:positionH relativeFrom="column"><wp:posOffset>${Math.round(f.x / 3.7795 * EMU)}</wp:posOffset></wp:positionH><wp:positionV relativeFrom="paragraph"><wp:posOffset>${Math.round(f.y / 3.7795 * EMU)}</wp:posOffset></wp:positionV><wp:extent cx="${cx}" cy="${cy}"/><wp:effectExtent l="0" t="0" r="0" b="0"/><wp:wrapNone/><wp:docPr id="${id}" name="Float ${id}"/><wp:cNvGraphicFramePr/><a:graphic xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main"><a:graphicData uri="http://schemas.openxmlformats.org/drawingml/2006/picture"><pic:pic xmlns:pic="http://schemas.openxmlformats.org/drawingml/2006/picture"><pic:nvPicPr><pic:cNvPr id="${id}" name="fl${id}"/><pic:cNvPicPr/></pic:nvPicPr><pic:blipFill><a:blip r:embed="${rid}"/><a:stretch><a:fillRect/></a:stretch></pic:blipFill><pic:spPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="${cx}" cy="${cy}"/></a:xfrm><a:prstGeom prst="rect"><a:avLst/></a:prstGeom></pic:spPr></pic:pic></a:graphicData></a:graphic></wp:anchor></w:drawing></w:r>`;
    }).join('');
    return `<w:p><w:pPr><w:spacing w:before="0" w:after="0" w:line="20" w:lineRule="exact"/></w:pPr>${anch}</w:p>` + (x || '');
  };
})();

/* ---------- รูปภาพ/รูปวาดแยกบล็อก → ลอยอิสระ (เก็บบล็อกเดิมไว้ คืนกลับเป็นบล็อกแก้ไขได้) ---------- */
function flVisualOf(el, b) { return b.t === 'image' ? $('.b-image img', el) : b.t === 'figure' ? ($('svg', el) || $('.b-figure', el)) : el.firstElementChild; }
async function flSrcOf(b, vis) {
  if (b.t === 'image') return b.src;
  const svg = vis && vis.tagName.toLowerCase() === 'svg' ? vis : null; if (!svg) return null;
  const c = svg.cloneNode(true); const r = svg.getBoundingClientRect(); if (!c.getAttribute('xmlns')) c.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  if (!c.getAttribute('width')) c.setAttribute('width', Math.round(r.width)); if (!c.getAttribute('height')) c.setAttribute('height', Math.round(r.height));
  // ฝังฟอนต์/สไตล์ไม่ได้ทั้งหมด → แปลงเป็น PNG ความละเอียดสูงจากหน้าจอ
  const url = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(new XMLSerializer().serializeToString(c))));
  try { const im = await pgLoadImg(url); const k = 3, cv = document.createElement('canvas'); cv.width = Math.round(r.width * k / pgZ(svg)); cv.height = Math.round(r.height * k / pgZ(svg)); cv.getContext('2d').drawImage(im, 0, 0, cv.width, cv.height); return cv.toDataURL('image/png'); } catch (e) { return url; }
}
async function flFromBlock(id) {
  const b = byId(id), el = $(`.blk[data-id="${id}"]`); if (!b || !el) return; const vis = flVisualOf(el, b); if (!vis) return;
  const src = await flSrcOf(b, vis); if (!src) { toast('แปลงส่วนนี้เป็นภาพลอยไม่ได้'); return; }
  const r = vis.getBoundingClientRect(), z = pgZ(vis.tagName === 'IMG' ? vis : el) || 1;
  const i = idx(id), anc = doc.blocks[i - 1] || doc.blocks[i + 1]; if (!anc) { toast('ต้องมีส่วนอื่นในเอกสารอย่างน้อย 1 ส่วน'); return; }
  const ae = $(`.blk[data-id="${anc.id}"]`), ar = ae.getBoundingClientRect(); const ez = ar.width / ae.offsetWidth || 1;
  const orig = JSON.parse(JSON.stringify(b)); delete orig.id;
  const f = { fid: flId(), src, x: Math.round((r.left - ar.left) / ez), y: Math.round((r.top - ar.top) / ez), w: Math.round(r.width / ez), orig };
  if (b.ist) f.look = b.ist;
  pgSelect(null); doc.blocks.splice(i, 1); el.remove(); anc.fl = (anc.fl || []).concat(f); rerender(anc.id); curId = null; changed(true); schedulePaginate(); refreshInspector();
  setTimeout(() => { const n = $(`#flow img.flimg[data-fid="${f.fid}"]`); if (n) pgSelect(n); }, 60);
  toast('ลากไปวางตรงไหนก็ได้ · กด “ใส่ในบรรทัด” เพื่อคืนเป็นแบบเดิม');
}
// “ใส่ในบรรทัด” ของรูปที่มาจากบล็อก → คืนเป็นบล็อกเดิม (แก้ไขรูปวาดได้อีก)
addEventListener('click', e => {
  const b = e.target.closest && e.target.closest('#ibar [data-a="flinl"]'); if (!b || !PG.T || !PG.T.fl) return; const F = flFind(PG.T.fid); if (!F || !F.f.orig) return;
  e.stopImmediatePropagation(); e.preventDefault(); pgSelect(null);
  F.b.fl = F.b.fl.filter(x => x !== F.f); if (!F.b.fl.length) delete F.b.fl;
  const nb = Object.assign(JSON.parse(JSON.stringify(F.f.orig)), { id: uid() }); doc.blocks.splice(idx(F.b.id) + 1, 0, nb); renderAll(); changed(true); selectBlock(nb.id); toast('คืนเป็นส่วนแยกบรรทัดแล้ว');
}, true);
// แทรกรูปใหม่แบบลอยอิสระ (กลางจอ)
async function flAddFiles(files) {
  const L = [...files].filter(f => imlIsImg(f)); const sr = $('#scroller').getBoundingClientRect(), fr = $('#flow').getBoundingClientRect(); let k = 0;
  for (const f of L) { let src; try { src = await readImage(f); } catch (e) { continue; } const im = await pgLoadImg(src).catch(() => null); const w = Math.min(260, im ? im.naturalWidth : 260); const z = fr.width / $('#flow').offsetWidth || 1;
    flAddAt(src, w, fr.left + fr.width / 2 - w * z / 2 + k * 20, sr.top + sr.height / 3 + k * 20, false); k++; }
  if (k) toast('ลากรูปไปวางตรงไหนก็ได้ · ลากมุมเพื่อปรับขนาด');
}
// แผงขวา: ปุ่ม “วางอิสระ” สำหรับรูปภาพและรูปวาด
(function () {
  const _ex = extInspector;
  extInspector = function (b) { let h = _ex(b); if (b.t === 'image' || b.t === 'figure') h += `<div class="ir"><button class="tb" data-flx="1" title="ลากไปวางตรงไหนก็ได้บนหน้ากระดาษ ไม่ดันข้อความ">✥ วางอิสระ (ลากไปไหนก็ได้)</button></div>`; return h; };
  document.addEventListener('click', e => { const x = e.target.closest && e.target.closest('[data-flx]'); if (!x || !curId) return; e.preventDefault(); flFromBlock(curId); }, true);
})();

/* ===================== เส้นขอบตารางแบบ Pages + บันทึกไฟล์ลงเครื่อง ===================== */
(function () {
  const s = document.createElement('style');
  s.textContent = `.bdg{display:grid;grid-template-columns:repeat(3,34px);gap:4px;padding:6px;border:1px solid var(--ui-line);border-radius:10px;background:#fff;width:max-content}
.bdg button{width:34px;height:30px;border:1px solid transparent;border-radius:6px;background:none;cursor:pointer;padding:0;display:grid;place-items:center}.bdg button:hover{background:#f3ece4;border-color:var(--ui-line)}
.bdrow{display:flex;gap:10px;align-items:flex-start;flex-wrap:wrap}.bdopt{display:flex;flex-direction:column;gap:6px;min-width:150px;flex:1}.bdopt select,.bdopt input[type=number]{font:inherit;font-size:15px}
.bdopt .bdc{display:flex;gap:4px;align-items:center;flex-wrap:wrap}.bdopt .bdc .sw{width:20px;height:20px;border-radius:50%;border:1px solid #0002;cursor:pointer;padding:0}.bdopt .bdc .sw.on{box-shadow:0 0 0 2px var(--ui-accent)}`;
  document.head.appendChild(s);
})();
const BD = { st: 'solid', pt: 0.5, c: '#000000' };
const BD_ST = [['solid', 'เส้นทึบ'], ['dashed', 'เส้นประ'], ['dotted', 'เส้นจุด'], ['double', 'เส้นคู่'], ['none', 'ไม่มีเส้น']];
// ไอคอนปุ่มเลือกขอบ (ขอบที่จะถูกตั้ง = เส้นเข้ม)
function bdIcon(k) {
  const on = { all: 'tlbrvh', inner: 'vh', outer: 'tlbr', l: 'l', iv: 'v', r: 'r', t: 't', ih: 'h', b: 'b' }[k];
  const L = (x1, y1, x2, y2, c) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${on.includes(c) ? '#222' : '#c9c1b9'}" stroke-width="${on.includes(c) ? 1.8 : 1}"/>`;
  return `<svg width="22" height="22" viewBox="0 0 22 22">${L(2, 2, 20, 2, 't')}${L(2, 20, 20, 20, 'b')}${L(2, 2, 2, 20, 'l')}${L(20, 2, 20, 20, 'r')}${L(11, 2, 11, 20, 'v')}${L(2, 11, 20, 11, 'h')}</svg>`;
}
const BD_KEYS = [['all', 'ทุกเส้น'], ['inner', 'เส้นด้านใน'], ['outer', 'เส้นรอบนอก'], ['l', 'ขอบซ้าย'], ['iv', 'เส้นแนวตั้งด้านใน'], ['r', 'ขอบขวา'], ['t', 'ขอบบน'], ['ih', 'เส้นแนวนอนด้านใน'], ['b', 'ขอบล่าง']];
(function () {
  const _ex = extInspector;
  extInspector = function (b) {
    let h = _ex(b); if (b.t !== 'table') return h;
    const sel = PG.ts && PG.ts.id === b.id && PG.ts.z && PG.ts.n > 1;
    h += `<div class="sec">เส้นขอบ</div><div class="hint" style="margin:-2px 0 6px">${sel ? `ใช้กับช่องที่เลือก ${PG.ts.n} ช่อง` : 'ใช้กับทั้งตาราง · ลากคลุมช่องในตารางก่อน เพื่อตั้งเฉพาะบางช่อง'}</div>
<div class="bdrow"><div class="bdg">${BD_KEYS.map(([k, t]) => `<button data-bdk="${k}" title="${t}">${bdIcon(k)}</button>`).join('')}</div>
<div class="bdopt"><select data-bdo="st">${BD_ST.map(([v, t]) => `<option value="${v}"${BD.st === v ? ' selected' : ''}>${t}</option>`).join('')}</select>
<label style="display:flex;gap:6px;align-items:center">ความหนา <input type="number" data-bdo="pt" min="0.25" max="6" step="0.25" value="${BD.pt}" style="width:70px"> pt</label>
<div class="bdc">${['#000000', '#7a3e10', '#1f3864', '#2e8b57', '#c0392b', '#9a8576', '#ffffff'].map(c => `<button class="sw${BD.c === c ? ' on' : ''}" data-bdc="${c}" style="background:${c}" title="${c}"></button>`).join('')}<input type="color" data-bdo="c" value="${BD.c}" style="width:30px;height:24px;border:0;padding:0;background:none"></div>
<button class="tb" data-bdx="1">ล้างเส้นที่ตั้งเอง${sel ? ' (ช่องที่เลือก)' : ''}</button></div></div>`;
    return h;
  };
  document.addEventListener('mousedown', e => { if (e.target.closest && e.target.closest('.bdg, [data-bdc], [data-bdx]')) e.preventDefault(); }, true);
  document.addEventListener('click', e => {
    const t = e.target.closest && e.target.closest('[data-bdk], [data-bdc], [data-bdx]'); if (!t) return; const b = curId && byId(curId); if (!b || b.t !== 'table') return;
    e.preventDefault(); e.stopPropagation();
    if (t.dataset.bdc) { BD.c = t.dataset.bdc; $$('[data-bdc]').forEach(x => x.classList.toggle('on', x === t)); const ci = $('[data-bdo="c"]'); if (ci) ci.value = BD.c; return; }
    if (t.dataset.bdx) { bdClear(b); return; }
    bdApplyScope(b, t.dataset.bdk);
  }, true);
  document.addEventListener('change', e => { const d = e.target.dataset; if (!d || !d.bdo) return; e.stopImmediatePropagation(); BD[d.bdo] = d.bdo === 'pt' ? Math.max(0.25, +e.target.value || 0.5) : e.target.value; }, true);
  document.addEventListener('input', e => { const d = e.target.dataset; if (d && d.bdo === 'c') BD.c = e.target.value; }, true);
})();
function bdGrid(b) { // เจ้าของช่อง (กรณีผสานเซลล์)
  const rows = b.rows || [], n = Math.max(...rows.map(r => r.length)), own = {}; const { span } = tblSpans(b);
  for (let i = 0; i < rows.length; i++) for (let j = 0; j < n; j++) own[i + ',' + j] = i + ',' + j;
  Object.entries(span).forEach(([k, v]) => { const [i, j] = k.split(',').map(Number); for (let a = 0; a < v[0]; a++) for (let c = 0; c < v[1]; c++) own[(i + a) + ',' + (j + c)] = k; });
  return { own, R: rows.length, C: n };
}
function bdRange(b) { const G = bdGrid(b); if (PG.ts && PG.ts.id === b.id && PG.ts.z && PG.ts.R) return Object.assign({}, PG.ts.R, { G }); return { r0: 0, r1: G.R - 1, c0: 0, c1: G.C - 1, G }; }
function bdApplyScope(b, k) {
  const X = bdRange(b), G = X.G, v = [BD.pt, BD.st, BD.c]; b.bd = b.bd || {}; let n = 0;
  const S = { t: [-1, 0, 'b'], b: [1, 0, 't'], l: [0, -1, 'r'], r: [0, 1, 'l'] };
  const inR = (i, j) => i >= X.r0 && i <= X.r1 && j >= X.c0 && j <= X.c1;
  for (let i = X.r0; i <= X.r1; i++) for (let j = X.c0; j <= X.c1; j++) {
    const me = G.own[i + ',' + j];
    Object.entries(S).forEach(([side, [di, dj, opp]]) => {
      const ni = i + di, nj = j + dj, nk = G.own[ni + ',' + nj]; if (nk === me) return; // ภายในช่องที่ผสาน
      const outer = !inR(ni, nj) || nk === undefined, vert = side === 'l' || side === 'r';
      const ok = k === 'all' || (k === 'outer' && outer) || (k === 'inner' && !outer) || (k === side && outer) || (k === 'iv' && !outer && vert) || (k === 'ih' && !outer && !vert); if (!ok) return;
      (b.bd[me] = b.bd[me] || {})[side] = v; n++;
      if (nk !== undefined) (b.bd[nk] = b.bd[nk] || {})[opp] = v;
    });
  }
  if (!n) { toast('ไม่มีเส้นในตำแหน่งนี้ (เช่น เลือกช่องเดียวแล้วกดเส้นด้านใน)'); return; }
  rerender(b.id); changed(true); schedulePaginate(); setTimeout(() => { if (PG.ts && PG.ts.id === b.id) pgPaintCells(); }, 30);
}
function bdClear(b) {
  if (!b.bd) return; const X = bdRange(b), G = X.G, full = !(PG.ts && PG.ts.id === b.id && PG.ts.z);
  if (full) delete b.bd; else { for (let i = X.r0; i <= X.r1; i++) for (let j = X.c0; j <= X.c1; j++) delete b.bd[G.own[i + ',' + j]]; if (!Object.keys(b.bd).length) delete b.bd; }
  rerender(b.id); changed(true); toast('ล้างเส้นที่ตั้งเองแล้ว');
}
const bdCss = v => !v ? '' : v[1] === 'none' ? '0 none' : `${Math.max(v[1] === 'double' ? 3 : 0.5, v[0] * 1.3333).toFixed(2)}px ${v[1]} ${v[2]}`;
const _btBd = buildTable;
buildTable = function (el, b) {
  const r = _btBd.apply(this, arguments); if (!b.bd) return r;
  $$('td[data-cell]', el).forEach(td => { const o = b.bd[td.dataset.cell]; if (!o) return; if (o.t) td.style.borderTop = bdCss(o.t); if (o.b) td.style.borderBottom = bdCss(o.b); if (o.l) td.style.borderLeft = bdCss(o.l); if (o.r) td.style.borderRight = bdCss(o.r); });
  return r;
};
// ส่งออก Word
function bdWordO(b, k, o) {
  const x = b.bd && b.bd[k]; if (!x) return {}; const def = side => b.nob ? `<w:${side} w:val="nil"/>` : `<w:${side} w:val="single" w:sz="4" w:color="${o.bc || 'CDB9AD'}"/>`;
  const W = { solid: 'single', dashed: 'dashed', dotted: 'dotted', double: 'double', none: 'nil' };
  const one = (side, v) => !v ? def(side) : v[1] === 'none' ? `<w:${side} w:val="nil"/>` : `<w:${side} w:val="${W[v[1]] || 'single'}" w:sz="${Math.max(2, Math.round(v[0] * 8))}" w:color="${String(v[2] || '#000').replace('#', '').toUpperCase()}"/>`;
  return { border: one('top', x.t) + one('left', x.l) + one('bottom', x.b) + one('right', x.r) };
}

document.addEventListener('pointerup', () => { if (PG.ts && PG.ts.z && curId === PG.ts.id) setTimeout(() => { refreshInspector(); }, 20); });

/* ===================== สีพื้นหลัง / สีตัวอักษรในช่องตาราง ===================== */
const CF_BG = ['#fbefe7', '#f6dcc8', '#fff4c2', '#e3f1dc', '#dceaf7', '#ece4f5', '#fde2e2', '#eeeeee', '#7a3e10', '#1f3864', '#2e8b57', '#c0392b'];
const CF_FG = ['#000000', '#ffffff', '#7a3e10', '#1f3864', '#2e8b57', '#c0392b', '#9a8576', '#e67e22'];
let CF_LAST = null; // ช่องที่เคอร์เซอร์อยู่ล่าสุด {id, k}
document.addEventListener('focusin', e => { const td = e.target.closest && e.target.closest('#flow td[data-cell]'); const bl = td && td.closest('.blk'); if (bl) CF_LAST = { id: bl.dataset.id, k: td.dataset.cell }; });
function cfTarget(b) { // คืนรายการคีย์ช่อง + คำอธิบาย
  const G = bdGrid(b), keys = new Set();
  if (PG.ts && PG.ts.id === b.id && PG.ts.z && PG.ts.n > 1 && PG.ts.R) { const R = PG.ts.R; for (let i = R.r0; i <= R.r1; i++) for (let j = R.c0; j <= R.c1; j++) keys.add(G.own[i + ',' + j]); return { keys: [...keys].filter(Boolean), what: `ช่องที่เลือก ${PG.ts.n} ช่อง` }; }
  if (CF_LAST && CF_LAST.id === b.id && G.own[CF_LAST.k]) { const [i, j] = CF_LAST.k.split(',').map(Number); return { keys: [G.own[CF_LAST.k]], what: `ช่องที่เคอร์เซอร์อยู่ (แถว ${i + 1} คอลัมน์ ${j + 1})` }; }
  Object.values(G.own).forEach(k => keys.add(k)); return { keys: [...keys], what: 'ทั้งตาราง' };
}
function cfApply(b, slot, c) {
  const T = cfTarget(b); b.cf = b.cf || {};
  T.keys.forEach(k => { const v = b.cf[k] = b.cf[k] || ['', '']; v[slot] = c || ''; if (!v[0] && !v[1]) delete b.cf[k]; });
  if (!Object.keys(b.cf).length) delete b.cf;
  rerender(b.id); changed(true); setTimeout(() => { if (PG.ts && PG.ts.id === b.id) pgPaintCells(); refreshInspector(); }, 30);
}
(function () {
  const s = document.createElement('style');
  s.textContent = `.cfrow{display:flex;gap:4px;align-items:center;flex-wrap:wrap;margin:2px 0 8px}.cfrow .cfs{width:22px;height:22px;border-radius:5px;border:1px solid #0003;cursor:pointer;padding:0}.cfrow .cfs.no{background:linear-gradient(135deg,#fff 45%,#c0392b 46%,#c0392b 54%,#fff 55%)}.cfrow input[type=color]{width:30px;height:24px;border:0;padding:0;background:none;cursor:pointer}.cflb{font-size:14px;color:var(--ui-muted,#7a6a5d)}`;
  document.head.appendChild(s);
  const _ex = extInspector;
  extInspector = function (b) {
    let h = _ex(b); if (b.t !== 'table') return h; const T = cfTarget(b);
    const row = (slot, list) => `<div class="cfrow">${list.map(c => `<button class="cfs" data-cfs="${slot}" data-cfc="${c}" style="background:${c}" title="${c}"></button>`).join('')}<input type="color" data-cfi="${slot}" title="เลือกสีเอง" value="${slot ? '#000000' : '#fbefe7'}"><button class="cfs no" data-cfs="${slot}" data-cfc="" title="ไม่มีสี (กลับเป็นค่าเดิม)"></button></div>`;
    h += `<div class="sec">สีในตาราง</div><div class="hint" style="margin:-2px 0 6px">ใช้กับ: <b>${T.what}</b> · คลิกในช่อง หรือลากคลุมหลายช่องก่อน</div>
<div class="cflb">สีพื้นหลังช่อง</div>${row(0, CF_BG)}<div class="cflb">สีตัวอักษรในช่อง</div>${row(1, CF_FG)}`;
    return h;
  };
  document.addEventListener('mousedown', e => { if (e.target.closest && e.target.closest('[data-cfs]')) e.preventDefault(); }, true);
  document.addEventListener('click', e => { const t = e.target.closest && e.target.closest('[data-cfs]'); if (!t) return; const b = curId && byId(curId); if (!b || b.t !== 'table') return; e.preventDefault(); e.stopPropagation(); cfApply(b, +t.dataset.cfs, t.dataset.cfc); }, true);
  document.addEventListener('change', e => { const d = e.target.dataset; if (!d || d.cfi === undefined) return; e.stopImmediatePropagation(); const b = curId && byId(curId); if (b && b.t === 'table') cfApply(b, +d.cfi, e.target.value); }, true);
})();
const _btCf = buildTable;
buildTable = function (el, b) {
  const r = _btCf.apply(this, arguments); if (!b.cf) return r;
  $$('td[data-cell]', el).forEach(td => { const v = b.cf[td.dataset.cell]; if (!v) return; if (v[0]) td.style.background = v[0]; if (v[1]) td.style.color = v[1]; });
  return r;
};

/* ===================== ไฟล์ในเครื่อง (บันทึกทับไฟล์เดิม) + วางแล้วจอไม่กระโดด + คัดลอกข้ามหน้า ===================== */

/* ---------- 1) จอไม่กระโดดเมื่อวาด/วางเนื้อหาใหม่ ----------
   renderAll ล้างเนื้อหาทั้งหมดแล้ววาดใหม่ → ความสูงหน้าหดชั่วคราว จอเลยเด้งขึ้นบน
   ตรึงความสูงเดิมไว้จนจัดหน้าเสร็จ ตำแหน่งที่ดูอยู่จึงคงเดิม */
(function () {
  const _ra = renderAll; let tm = 0;
  renderAll = function () {
    const flow = $('#flow'), sc = $('#scroller'); const top = sc ? sc.scrollTop : 0;
    if (flow) flow.style.minHeight = Math.max(flow.offsetHeight, parseFloat(flow.style.minHeight) || 0) + 'px';
    const r = _ra.apply(this, arguments);
    if (sc && Math.abs(sc.scrollTop - top) > 1) sc.scrollTop = top;
    clearTimeout(tm); tm = setTimeout(() => { if (flow) flow.style.minHeight = ''; }, 400);
    return r;
  };
})();

/* ---------- 2) คัดลอกข้อความข้ามย่อหน้า/ข้ามหน้า แล้ววางได้ครบทุกส่วน ---------- */
const NPX = '<!--npblocks:';
function pgXsBlocks() { // ส่วนที่เลือก → รายการบล็อก (ตัดส่วนต้น/ท้าย)
  const X = PG.xs; if (!X) return []; const els = $$('#flow > .blk'), ia = els.indexOf(X.a), ib = els.indexOf(X.b); const out = [];
  for (let k = ia; k <= ib; k++) {
    const el = els[k], b = byId(el.dataset.id); if (!b) continue; const c = JSON.parse(JSON.stringify(b)); delete c.fl;
    if ((k === ia || k === ib) && pgOne(el)) { const ed = edsOf(el)[0], r = document.createRange(); r.selectNodeContents(ed); if (k === ia) r.setStart(X.A.n, X.A.o); if (k === ib) r.setEnd(X.B.n, X.B.o); const d = document.createElement('div'); d.appendChild(r.cloneContents()); c.html = cleanHTML(d); }
    out.push(c);
  }
  return out;
}
const b64e = s => btoa(unescape(encodeURIComponent(s))), b64d = s => decodeURIComponent(escape(atob(s)));
addEventListener('copy', e => {
  if (!PG.xs) return; const L = pgXsBlocks(); if (!L.length) return;
  e.preventDefault(); e.stopImmediatePropagation();
  e.clipboardData.setData('text/plain', pgXsText()); e.clipboardData.setData('text/html', NPX + b64e(JSON.stringify(L)) + '-->' + pgXsHTML());
  toast(`คัดลอกแล้ว (${L.length} ย่อหน้า)`);
}, true);
addEventListener('cut', e => {
  if (!PG.xs) return; const L = pgXsBlocks(); if (!L.length) return;
  e.preventDefault(); e.stopImmediatePropagation();
  e.clipboardData.setData('text/plain', pgXsText()); e.clipboardData.setData('text/html', NPX + b64e(JSON.stringify(L)) + '-->' + pgXsHTML()); pgXsDelete();
}, true);
function pgPasteBlocks(list) {
  list = list.map(b => Object.assign(JSON.parse(JSON.stringify(b)), { id: uid() }));
  const s = getSelection(), t = s.rangeCount && pgEdOf(s.getRangeAt(0).startContainer), blk = t && t.closest('.blk');
  if (!t || !pgOne(blk) || t.closest('li')) { pasteBlocks(list); return; }
  const B = byId(blk.dataset.id);
  if (list.length === 1 && PG_TXT.has(list[0].t)) { document.execCommand('insertHTML', false, list[0].html || ''); syncFrom(t); return; }
  // แยกย่อหน้าปัจจุบันที่เคอร์เซอร์ แล้วแทรกส่วนที่คัดลอกไว้ตรงกลาง
  if (!s.isCollapsed) s.getRangeAt(0).deleteContents();
  const r = s.getRangeAt(0), tail = document.createRange(); tail.selectNodeContents(t); tail.setStart(r.endContainer, r.endOffset);
  const box = document.createElement('div'); box.appendChild(tail.extractContents()); let tailH = cleanHTML(box); if (!box.textContent.replace(/[​\s]/g, '') && !box.querySelector('img,.mx,.ic')) tailH = '';
  syncFrom(t); const first = list[0]; let ins = list;
  if (PG_TXT.has(first.t)) { B.html = String(B.html || '').replace(/(<br>\s*)+$/, '') + (first.html || ''); ins = list.slice(1); }
  const last = ins[ins.length - 1] || B; const mk = '<span id="pgmk"></span>';
  if (PG_TXT.has(last.t) && last.html !== undefined) last.html = (last.html || '') + mk + tailH;
  else { const nb = newBlock(B.t, { html: mk + tailH }); if (B.st) nb.st = JSON.parse(JSON.stringify(B.st)); ins.push(nb); }
  doc.blocks.splice(idx(B.id) + 1, 0, ...ins); renderAll(); changed(true);
  setTimeout(() => { const m = $('#pgmk'); if (!m) return; const ed = pgEdOf(m); const el = m.closest('.blk'); if (el) selectBlock(el.dataset.id); if (ed) { ed.focus({ preventScroll: true }); const rr = document.createRange(); rr.setStartBefore(m); rr.collapse(true); const ss = getSelection(); ss.removeAllRanges(); ss.addRange(rr); m.remove(); syncFrom(ed); } if (el) el.scrollIntoView({ block: 'nearest' }); }, 60);
  toast(`วาง ${list.length} ย่อหน้าแล้ว`);
}
addEventListener('paste', e => {
  if (typeof dlgOpen === 'function' && dlgOpen()) return;
  const h = (e.clipboardData && e.clipboardData.getData('text/html')) || ''; const i = h.indexOf(NPX); if (i < 0) return;
  let list; try { list = JSON.parse(b64d(h.slice(i + NPX.length, h.indexOf('-->', i)))); } catch (er) { return; }
  if (!list || !list.length) return; e.preventDefault(); e.stopImmediatePropagation(); if (PG.xs) pgXsDelete();
  setTimeout(() => pgPasteBlocks(list), PG.xs ? 60 : 0);
}, true);

/* ---------- 3) บันทึกทับไฟล์เดิมในเครื่อง ---------- */
const LFH = { map: new Map(), loaded: false }; // รหัสงาน (doc.lfid) → ไฟล์ในเครื่อง
const lfKey = () => doc && doc.lfid;
async function lfLoad() { if (LFH.loaded) return; LFH.loaded = true; try { const o = await tabIdbGet('lfiles'); if (o) Object.entries(o).forEach(([k, h]) => LFH.map.set(k, h)); } catch (e) { } }
async function lfStore() { try { await tabIdbSet('lfiles', Object.fromEntries(LFH.map)); } catch (e) { } }
function lfGet() { return lfKey() ? LFH.map.get(lfKey()) : null; }
async function lfSet(h) { if (h) { if (!doc.lfid) doc.lfid = 'L' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6); LFH.map.set(doc.lfid, h); } else if (doc.lfid) LFH.map.delete(doc.lfid); await lfStore(); lfBadge(); }
function lfBadge() { const b = $('#bLocal'); if (!b) return; const h = lfGet(); b.textContent = h ? '💾 ' + h.name.replace(/\.(json|npress)$/i, '').slice(0, 18) : '💾 ลงเครื่อง'; b.title = h ? `บันทึกทับไฟล์ “${h.name}” (${IS_MAC ? '⌘S' : 'Ctrl+S'}) · Option+คลิก = บันทึกเป็นไฟล์ใหม่` : 'บันทึกเป็นไฟล์ลงเครื่อง'; }
let lfData = () => { const d = Object.assign({}, doc); if (d.cloud && d.cloud.id) d.cloud = { id: d.cloud.id, folder: d.cloud.folder || '' }; else delete d.cloud; return JSON.stringify(d); };
async function saveLocal(asNew) {
  await lfLoad();
  if (!window.showSaveFilePicker) { // Safari / iPad / แอปจาก Dock: เขียนทับไม่ได้ → ดาวน์โหลดไฟล์
    const ok = await saveFile(fname('npress'), lfData()); if (ok) setTimeout(() => toast('Safari บันทึกทับไฟล์เดิมไม่ได้ · ใช้ Chrome จะบันทึกทับไฟล์เดิมได้'), 2500); return ok;
  }
  try {
    let h = !asNew && lfGet();
    if (h && h.queryPermission && (await h.queryPermission({ mode: 'readwrite' })) !== 'granted') { if ((await h.requestPermission({ mode: 'readwrite' })) !== 'granted') h = null; }
    if (!h) { h = await showSaveFilePicker({ suggestedName: fname('npress'), types: [{ description: 'ไฟล์ Newton Press', accept: { 'application/x-newton-press': ['.npress'] } }] }); const nm = h.name.replace(/\.(json|npress)$/i, ''); if (nm && nm !== doc.settings.name) { doc.settings.name = nm; changed(true); } }
    await lfSet(h); const w = await h.createWritable(); await w.write(lfData()); await w.close();
    toast(`บันทึกทับไฟล์ “${h.name}” แล้ว`); return true;
  } catch (e) { if (e && e.name === 'AbortError') return false; toast('บันทึกไม่สำเร็จ: ' + (e.message || e)); return false; }
}
async function openLocal() {
  try {
    const [h] = await showOpenFilePicker({ types: [{ description: 'ไฟล์ Newton Press', accept: { 'application/json': ['.json'] } }] }); const f = await h.getFile(); const data = JSON.parse(await f.text()); if (!data.blocks) throw new Error('ไม่ใช่ไฟล์ของ Newton Press');
    doc = data; doc.settings = Object.assign(sampleDoc().settings, data.settings || {}); doc.settings.name = doc.settings.name || f.name.replace(/\.(json|npress)$/i, ''); if (!(doc.cloud && doc.cloud.id)) delete doc.cloud;
    curId = null; applySettings(); renderAll(); hist.stack = []; hist.pos = -1; snapshot(); autosave(); refreshInspector(); $('#scroller').scrollTop = 0; if (typeof clStatus === 'function') clStatus();
    await lfLoad(); delete doc.lfid; await lfSet(h); toast(`เปิด “${f.name}” แล้ว · กด “บันทึก” จะบันทึกทับไฟล์นี้`);
  } catch (e) { if (!(e && e.name === 'AbortError')) toast('เปิดไฟล์ไม่ได้: ' + (e.message || e)); }
}
(function () {
  const bs = $('#bSave'); if (!bs) return;
  const b = document.createElement('button'); b.className = 'tb'; b.id = 'bLocal'; b.onclick = e => saveLocal(e.altKey); bs.after(b);
  // “บันทึก” / ⌘S: งานที่เปิดจากไฟล์ในเครื่อง → บันทึกทับไฟล์นั้น · งานใน Drive → บันทึกลง Drive ตามเดิม
  const _sv = bs.onclick;
  bs.onclick = async function (e) { // บันทึกไปทุกที่ที่งานนี้ผูกไว้: ไฟล์ในเครื่อง และ/หรือ Drive
    await lfLoad(); const hasL = !!lfGet(), hasD = !!(doc.cloud && doc.cloud.id);
    if (hasL) { const ok = await saveLocal(false); if (ok && hasD) { if (typeof CLD !== 'undefined' && CLD.user) { if (typeof tokOk !== 'function' || tokOk() || await clSignIn()) clSave({ silent: true }); } else setTimeout(() => toast('บันทึกลงเครื่องแล้ว · ยังไม่ได้เข้าสู่ระบบ Drive จึงยังไม่ได้อัปเดตสำเนาใน Drive'), 1800); } return ok; }
    if (hasD) return _sv && _sv.call(this, e);
    const a = $('#bSaveQ') || this; if (typeof uiMenu === 'function') { uiMenu(a, [['บันทึกลงเครื่อง…', () => saveLocal(false)], ['บันทึกลง Drive…', () => openCloud('save')]]); return; }
    return _sv && _sv.call(this, e); };
  window.npSaveDrive = () => { if (doc.cloud && doc.cloud.id && typeof CLD !== 'undefined' && CLD.user) clSave(); else openCloud('save'); };
  window.npUnlink = k => { if (k === 'local') { lfSet(null); toast('เลิกบันทึกลงไฟล์ในเครื่องแล้ว (ไฟล์เดิมยังอยู่)'); } else { delete doc.cloud; if (typeof clStatus === 'function') clStatus(); changed(true); toast('เลิกบันทึกลง Drive แล้ว (สำเนาใน Drive ยังอยู่)'); } };
  addEventListener('keydown', e => { if ((IS_MAC ? e.metaKey : e.ctrlKey) && e.shiftKey && e.code === 'KeyS') { e.preventDefault(); e.stopImmediatePropagation(); saveLocal(true); } }, true);
  if (typeof scAdd === 'function') scAdd(IS_MAC ? '⌘⇧S' : 'Ctrl+Shift+S', 'บันทึกเป็นไฟล์ใหม่ในเครื่อง', 'ไฟล์', () => saveLocal(true), () => false);
  // ทุกทางที่เปิดไฟล์จากเครื่อง (ปุ่มเปิดไฟล์ / คลังงาน) → ใช้หน้าต่างของ Chrome เพื่อจำไฟล์ไว้บันทึกทับ
  if (window.showOpenFilePicker) { const fo = $('#fileOpen'); if (fo) fo.click = () => openLocal(); const bf = $('#bFile'); if (bf) bf.onclick = () => openLocal(); }
  
  // งานใหม่ / สลับแท็บ → อัปเดตป้ายชื่อไฟล์
  const _ra = renderAll; renderAll = function () { const r = _ra.apply(this, arguments); lfBadge(); return r; };
  lfLoad().then(lfBadge);
})();
// วางกล่อง: เลื่อนจอไปที่ส่วนที่วางหลังจัดหน้าเสร็จ (ไม่เด้งไปที่อื่น)
insertAfterSel = function (blocks) {
  const ids = selIds(); let at = ids.length ? idx(ids[ids.length - 1]) + 1 : doc.blocks.length;
  doc.blocks.splice(at, 0, ...blocks);
  selSet = new Set(blocks.map(b => b.id)); curId = blocks[0].id; blockMode = true;
  renderAll(); changed(true); refreshInspector();
  const go = () => { const el = $(`.blk[data-id="${blocks[blocks.length - 1].id}"]`); if (!el) return; const sc = $('#scroller'), r = el.getBoundingClientRect(), cr = sc.getBoundingClientRect(); if (r.bottom > cr.bottom - 20) sc.scrollTop += r.bottom - cr.bottom + 40; else if (r.top < cr.top + 20) sc.scrollTop -= cr.top - r.top + 40; };
  setTimeout(go, 180);
};

/* ===== Enter ในช่องตาราง = ขึ้นบรรทัดใหม่ในช่องเดิม (ไม่กระโดดออก ไม่เลื่อนหน้า) · Tab = ไปช่องถัดไป ===== */
addEventListener('keydown', e => {
  if (e.key !== 'Enter' || e.isComposing || e.altKey || e.metaKey || e.ctrlKey) return;
  const td = e.target.closest && e.target.closest('#flow td[data-cell][contenteditable="true"]'); if (!td) return;
  e.preventDefault(); e.stopImmediatePropagation();
  if (!e.shiftKey && (td.dataset.fxe || /^[=＝]/.test(td.textContent.trim()))) { // สูตร: Enter = คำนวณ แล้วลงช่องล่าง
    const [i, j] = td.dataset.cell.split(',').map(Number), nx = td.closest('table').querySelector(`td[data-cell="${i + 1},${j}"]`); syncFrom(td); if (nx) placeCaretEnd(nx); else td.blur(); return; }
  const sc = $('#scroller'), y = sc ? sc.scrollTop : 0;
  if (!document.execCommand('insertLineBreak')) {
    const s = getSelection(); if (!s.rangeCount) return; const r = s.getRangeAt(0); r.deleteContents();
    const br = document.createElement('br'); r.insertNode(br);
    if (!br.nextSibling || (br.nextSibling.nodeType === 3 && !br.nextSibling.nodeValue)) br.after(document.createElement('br'));
    r.setStartAfter(br); r.collapse(true); s.removeAllRanges(); s.addRange(r); td.dispatchEvent(new Event('input', { bubbles: true }));
  }
  const keep = () => { if (!sc) return; const s = getSelection(); const rc = s.rangeCount && s.getRangeAt(0).getBoundingClientRect(); const box = sc.getBoundingClientRect();
    if (Math.abs(sc.scrollTop - y) > 2) { const old = sc.scrollTop; sc.scrollTop = y; const r2 = s.rangeCount && s.getRangeAt(0).getBoundingClientRect(); if (r2 && r2.height && (r2.bottom > box.bottom - 10 || r2.top < box.top)) sc.scrollTop = old; }
    else if (rc && rc.height && rc.bottom > box.bottom - 10) sc.scrollTop += rc.bottom - box.bottom + 40; };
  requestAnimationFrame(keep); setTimeout(keep, 120); setTimeout(keep, 450);
}, true);

/* ===== ก่อนส่งออก PDF: ให้ย่อหน้ายาวไหลต่อหน้าถัดไปอัตโนมัติ (ไม่เว้นช่องว่างท้ายหน้า) ===== */
function lyAutoFlow() {
  if (typeof lyFlowAll !== 'function') return 0;
  const sc = $('#scroller'), y = sc ? sc.scrollTop : 0; let n = 0;
  try { n = lyFlowAll(); } catch (e) { console.warn(e); }
  if (n) { paginate(); if (sc) sc.scrollTop = y; toast(`จัดให้ข้อความไหลต่อหน้าแล้ว ${n} จุด (ไม่เว้นช่องว่างท้ายหน้า)`); }
  return n;
}
['exportPDF', 'exportPrintPDF'].forEach(k => { const f = window[k]; if (typeof f !== 'function') return; window[k] = function () { lyAutoFlow(); return f.apply(this, arguments); }; });

/* ===== PDF แบบภาพ: ล็อกการตัดบรรทัดให้ตรงกับบนจอทุกบรรทัด =====
   ภาพ SVG วาดตัวอักษรกว้าง/แคบต่างจากจอเล็กน้อย ทำให้คำท้ายบรรทัดเด้งขึ้น/ลง → ใส่ตัวขึ้นบรรทัด ณ ตำแหน่งเดียวกับจอ แล้วห้ามตัดบรรทัดเอง */
function npFreezeLines() {
  const flow = $('#flow'); if (!flow) return () => { };
  const BLK = /^(DIV|LI|TD|TH|P|OL|UL|TR|TABLE|TBODY|H\d|BLOCKQUOTE|FIGURE)$/;
  const marks = [], conts = new Map(), spaces = [];
  let prevB = null, prevCont = null;
  const contOf = n => { let e = n.nodeType === 3 ? n.parentElement : n.parentElement; while (e && e !== flow && !BLK.test(e.tagName)) e = e.parentElement; return e; };
  const plan = []; // [node, offset] หรือ [element, -1] = ใส่ก่อน element
  const R = document.createRange();
  const atom = (node, top, bot, cont, off) => {
    if (prevB !== null && cont === prevCont && top >= prevB) plan.push([node, off, cont]);
    prevB = (top + bot) / 2; prevCont = cont;
  };
  const walk = el => {
    for (let c = el.firstChild; c; c = c.nextSibling) {
      if (c.nodeType === 3) { if (c.nodeValue.length) handleText(c); continue; }
      if (c.nodeType !== 1) continue;
      if (c.matches('.tools,.grip,.wh,.band,.dropline,svg,canvas,style,script')) continue;
      if (c.tagName === 'BR') { prevB = null; continue; }
      if (c.matches('.mx.disp') || (c.matches('.mx') && c.dataset.disp)) { prevB = null; continue; } // สมการแยกบรรทัดเป็นบล็อกอยู่แล้ว ห้ามใส่ตัวขึ้นบรรทัดเพิ่ม (เดิมทำให้กรอบสูงขึ้นบรรทัดละ 1 สมการ)
      if (c.matches('.mx,.katex,img,.ic')) { const r = c.getBoundingClientRect(); if (r.height) atom(c, r.top, r.bottom, contOf(c), -1); continue; }
      { const dsp = getComputedStyle(c).display; if (!/^inline/.test(dsp) && dsp !== 'contents' && (BLK.test(c.tagName) || /^(block|flex|grid|table|list-item|flow-root)$/.test(dsp))) { prevB = null; walk(c); prevB = null; continue; } }
      walk(c);
    }
  };
  $$('#flow > .blk').forEach(b => { prevB = null; walk(b); });
  function handleText(t) {
    const len = t.nodeValue.length; R.selectNodeContents(t); const rs = [...R.getClientRects()].filter(r => r.height > 0); if (!rs.length) return;
    const cont = contOf(t);
    const ct = i => { R.setStart(t, i); R.setEnd(t, Math.min(len, i + 1)); const q = [...R.getClientRects()].filter(r => r.height > 0); return q.length ? q[q.length - 1] : null; };
    // จุดเริ่ม
    const f = ct(0) || rs[0]; atom(t, f.top, f.bottom, cont, 0);
    let lo0 = 1;
    for (let k = 1; k < rs.length; k++) {
      if (rs[k].top < (rs[k - 1].top + rs[k - 1].bottom) / 2) continue; // ชิ้นบนบรรทัดเดียวกัน
      let lo = lo0, hi = len - 1, ans = -1;
      while (lo <= hi) { const m = (lo + hi) >> 1, r = ct(m); if (r && r.top >= (rs[k - 1].top + rs[k - 1].bottom) / 2) { ans = m; hi = m - 1; } else lo = m + 1; }
      if (ans > 0) { plan.push([t, ans, cont]); lo0 = ans + 1; }
    }
    const l = ct(len - 1) || rs[rs.length - 1]; prevB = (l.top + l.bottom) / 2; prevCont = cont;
  }
  // ใส่ <br> จากท้ายไปต้น (offset ไม่เพี้ยน)
  for (let i = plan.length - 1; i >= 0; i--) {
    const [node, off, cont] = plan[i]; const br = document.createElement('br'); br.className = 'npfx';
    try {
      if (off <= 0) { const nwA = (node.nodeType === 1 ? node : node.parentElement).closest('.nw'); const ref = nwA && cont && cont.contains(nwA) && nwA !== cont ? nwA : node; ref.parentNode.insertBefore(br, ref); }
      else { const rest = node.splitText(off); rest.parentNode.insertBefore(br, rest); }
      // ช่องว่างท้ายบรรทัด: บนจอ "ห้อย" เลยขอบได้ แต่เมื่อห้ามตัดบรรทัดจะกินความกว้างจนบรรทัดล้น → ถอดออกชั่วคราว (ใส่คืนตอน undo)
      { const pv = br.previousSibling; if (pv && pv.nodeType === 3) { const m = /[ \u00a0]+$/.exec(pv.nodeValue); if (m) { const sp = m.index > 0 ? pv.splitText(m.index) : pv; sp.remove(); spaces.push([sp, br]); } } }
      marks.push(br); if (cont && !conts.has(cont)) conts.set(cont, cont.style.whiteSpace);
    } catch (e) { }
  }
  // nowrap (ไม่ใช่ pre): ช่องว่างท้ายบรรทัดต้องไม่กินความกว้าง มิฉะนั้นบรรทัดแรกที่ต่อท้ายหัวกล่องจะล้นแล้วตกลงบรรทัดใหม่
  const wsNew = new Map(); conts.forEach((v, c) => { wsNew.set(c, /^pre/.test(getComputedStyle(c).whiteSpace) ? 'pre' : 'nowrap'); }); wsNew.forEach((w, c) => { c.style.whiteSpace = w; });
  return () => {
    spaces.forEach(([sp, br]) => { try { if (br.parentNode) br.parentNode.insertBefore(sp, br); } catch (e) { } });
    const par = new Set(); marks.forEach(b => { if (b.parentNode) { par.add(b.parentNode); b.remove(); } });
    par.forEach(p => p.normalize()); conts.forEach((v, c) => { c.style.whiteSpace = v; if (!c.getAttribute('style')) c.removeAttribute('style'); });
  };
}
if (typeof pageRenderer === 'function') {
  const _pr = pageRenderer;
  pageRenderer = function () { let undo = () => { }; try { undo = npFreezeLines(); } catch (e) { console.warn('freeze', e); } let p; try { p = _pr.apply(this, arguments); } finally { undo(); } return p; };
}

/* ===== ลากคลุมข้ามย่อหน้า/ข้ามหน้า แล้วเปลี่ยนฟอนต์ ขนาด สี ตัวหนา ฯลฯ เฉพาะส่วนที่เลือก ===== */
function xsOff(ed, node, off) { const r = document.createRange(); r.selectNodeContents(ed); try { r.setEnd(node, off); } catch (e) { return 0; } return r.toString().length; }
function xsPoint(ed, n) {
  const tw = document.createTreeWalker(ed, NodeFilter.SHOW_TEXT); let t, last = null;
  while ((t = tw.nextNode())) { if (t.parentElement && t.parentElement.closest('.katex')) continue; const L = t.nodeValue.length; if (n <= L) { const r = document.createRange(); r.setStart(t, n); r.collapse(true); return r; } n -= L; last = t; }
  const r = document.createRange(); if (last) r.setStart(last, last.nodeValue.length); else r.setStart(ed, ed.childNodes.length); r.collapse(true); return r;
}
function xsApply(fn, args) {
  const parts = pgXsEds().filter(p => !p.r.collapsed); if (!parts.length) return fn.apply(null, args);
  const X = PG.xs, a = { ed: X.A.ed, o: xsOff(X.A.ed, X.A.n, X.A.o) }, b = { ed: X.B.ed, o: xsOff(X.B.ed, X.B.n, X.B.o) };
  const sc = $('#scroller'), y = sc ? sc.scrollTop : 0; const s = getSelection();
  PG.xs = null; document.body.classList.remove('xsmode'); // ให้ฟังก์ชันเดิมทำงานแบบเลือกปกติ
  const TG = /^(bold|italic|underline|strikeThrough)$/.test(args[0]) && args[0]; let want = null;
  parts.forEach((p, i) => { try { p.ed.focus({ preventScroll: true }); s.removeAllRanges(); s.addRange(p.r); lastRange = p.r.cloneRange();
    if (TG) { document.execCommand('styleWithCSS', false, true); const st = document.queryCommandState(TG); if (want === null) want = !st; if (st === want) return; }
    fn.apply(null, args); syncFrom(p.ed); } catch (e) { console.warn(e); } });
  if (sc) sc.scrollTop = y;
  try { if (a.ed.isConnected && b.ed.isConnected) { s.removeAllRanges(); if (document.activeElement) document.activeElement.blur(); if (pgXsSet(xsPoint(a.ed, a.o), xsPoint(b.ed, b.o))) document.body.classList.add('xsmode'); } } catch (e) { }
  changed(true); schedulePaginate();
}
['exec', 'setFontSize', 'setTextFont', 'stepFont'].forEach(k => {
  const f = window[k]; if (typeof f !== 'function') return;
  window[k] = function () { if (PG.xs && !window.__xsIn) { window.__xsIn = true; try { return xsApply(f, [...arguments]); } finally { window.__xsIn = false; } } return f.apply(this, arguments); };
});
// คลิกแถบจัดรูปแบบ/เมนูสี ไม่ทำให้ส่วนที่เลือกข้ามย่อหน้าหายไป
window.addEventListener('pointerdown', e => {
  if (!PG.xs || !e.target.closest || !e.target.closest('#fbar,.menu,#mFg,#mHi,#mColor')) return;
  const X = PG.xs; setTimeout(() => { if (!PG.xs) { PG.xs = X; document.body.classList.add('xsmode'); pgXsPaint(); } }, 0);
}, true);
// ⌘B ⌘I ⌘U ขณะเลือกข้ามย่อหน้า
window.addEventListener('keydown', e => {
  if (!PG.xs || !(e.metaKey || e.ctrlKey) || e.altKey || e.shiftKey) return;
  const c = { KeyB: 'bold', KeyI: 'italic', KeyU: 'underline' }[e.code]; if (!c) return;
  e.preventDefault(); e.stopImmediatePropagation(); exec(c);
}, true);

