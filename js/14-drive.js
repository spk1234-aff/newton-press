'use strict';
/* ===================== คลังงานบน Google Drive (โฟลเดอร์ · ซิงก์ Mac ↔ iPad) =====================
   ล็อกอินด้วย Google (Firebase Auth) แล้วใช้สิทธิ์ drive.file เก็บงานเป็นไฟล์ .json ในโฟลเดอร์ “Newton Press” ของ Drive */
const FB_CFG = '{"apiKey": "AIzaSyDL1pPHI5T5dZ8b1I66TL1UYbH03kOeiBU", "authDomain": "newton-press-a9c0f.firebaseapp.com", "projectId": "newton-press-a9c0f", "storageBucket": "newton-press-a9c0f.firebasestorage.app", "messagingSenderId": "757660078449", "appId": "1:757660078449:web:dca69a407981dc80fda6d0"}';
const FB_V = '10.12.2';
const DRIVE = 'https://www.googleapis.com/drive/v3/files', DUP = 'https://www.googleapis.com/upload/drive/v3/files';
const SCOPE = 'https://www.googleapis.com/auth/drive.file';
const CLD = { user: null, root: '', folders: [], docs: [], cur: '', view: 'all', q: '', ready: null, timer: null, busy: false, mode: 'open', needAuth: false, loaded: false };
const TOK = (() => { try { return JSON.parse(localStorage.getItem('np-gtok') || '{}'); } catch (e) { return {}; } })();
function setTok(t) { if (!t) return; TOK.t = t; TOK.exp = Date.now() + 55 * 60e3; try { localStorage.setItem('np-gtok', JSON.stringify(TOK)); } catch (e) { } CLD.needAuth = false; }
const tokOk = () => TOK.t && Date.now() < (TOK.exp || 0);
function fbLoad() {
  if (CLD.ready) return CLD.ready;
  const s = src => new Promise((ok, no) => { const e = document.createElement('script'); e.src = src; e.onload = ok; e.onerror = () => no(new Error('โหลด ' + src + ' ไม่ได้')); document.head.appendChild(e); });
  const B = `https://www.gstatic.com/firebasejs/${FB_V}/`;
  CLD.ready = s(B + 'firebase-app-compat.js').then(() => Promise.all([s(B + 'firebase-auth-compat.js'), s(B + 'firebase-firestore-compat.js')])).then(() => {
    firebase.initializeApp(JSON.parse(FB_CFG));
    firebase.auth().getRedirectResult().then(r => { if (r && r.credential && r.credential.accessToken) { setTok(r.credential.accessToken); clRefresh(); } }).catch(() => { });
    return new Promise(ok => { let first = true; firebase.auth().onAuthStateChanged(u => { CLD.user = u; if (u) { if (!tokOk()) CLD.needAuth = true; else clRefresh(); } clStatus(); clRender(); if (first) { first = false; ok(); } }); });
  }).catch(e => { CLD.ready = null; throw e; });
  return CLD.ready;
}
const now = () => Date.now();
const newRev = () => now().toString(36) + Math.random().toString(36).slice(2, 7);
const DEV = (() => { try { let d = localStorage.getItem('np-dev'); if (!d) { d = /iPad|Macintosh.*Mobile|iPhone/.test(navigator.userAgent) || (navigator.maxTouchPoints > 1 && /Mac/.test(navigator.platform)) ? 'iPad' : 'Mac'; localStorage.setItem('np-dev', d); } return d; } catch (e) { return 'เครื่องนี้'; } })();
function gProv() { const P = new firebase.auth.GoogleAuthProvider(); P.addScope(SCOPE); const hint = CLD.user && CLD.user.email; P.setCustomParameters(hint ? { login_hint: hint } : { prompt: 'select_account' }); return P; }
/* ต้องเรียกจากการกดปุ่มโดยตรง (Safari บล็อกหน้าต่างล็อกอินที่ไม่ได้มาจากการกด) */
async function clSignIn() {
  if (!window.firebase || !firebase.apps.length) { await fbLoad(); }
  const P = gProv(); const u = firebase.auth().currentUser;
  try { const r = u ? await u.reauthenticateWithPopup(P) : await firebase.auth().signInWithPopup(P); setTok(r.credential && r.credential.accessToken); try { localStorage.setItem('np-cloud', '1'); } catch (e) { } await clRefresh(); clStatus(); return true; }
  catch (e) {
    const c = e.code || '';
    if (c === 'auth/popup-closed-by-user' || c === 'auth/cancelled-popup-request') return false;
    if (/popup-blocked|operation-not-supported/.test(c)) { try { localStorage.setItem('np-cloud', '1'); } catch (x) { } await (u ? u.reauthenticateWithRedirect(P) : firebase.auth().signInWithRedirect(P)); return false; }
    toast('เข้าสู่ระบบไม่ได้: ' + (e.message || e)); return false;
  }
}
async function clSignOut() { await fbLoad(); await firebase.auth().signOut(); TOK.t = ''; TOK.exp = 0; try { localStorage.removeItem('np-gtok'); localStorage.setItem('np-cloud', ''); } catch (e) { } CLD.folders = []; CLD.docs = []; CLD.root = ''; CLD.loaded = false; clStatus(''); clRender(); }
/* ---------- เรียก Drive API ---------- */
class NeedAuth extends Error { constructor() { super('ต้องเชื่อมต่อ Google Drive ใหม่ (กดเข้าสู่ระบบอีกครั้ง)'); this.need = true; } }
async function gd(url, opt = {}) {
  if (!tokOk()) { CLD.needAuth = true; throw new NeedAuth(); }
  const r = await fetch(url, Object.assign({}, opt, { headers: Object.assign({ Authorization: 'Bearer ' + TOK.t }, opt.headers || {}) }));
  if (r.status === 401) { TOK.exp = 0; CLD.needAuth = true; throw new NeedAuth(); }
  if (!r.ok) { let m = r.status + ''; try { const j = await r.json(); m = (j.error && j.error.message) || m; } catch (e) { } throw new Error('Google Drive: ' + m); }
  return opt.raw ? r : (r.status === 204 ? null : r.json());
}
const gq = o => Object.entries(o).map(([k, v]) => k + '=' + encodeURIComponent(v)).join('&');
const FOLDER = 'application/vnd.google-apps.folder';
async function ensureRoot() {
  if (CLD.root) return CLD.root;
  const r = await gd(DRIVE + '?' + gq({ q: "appProperties has { key='np' and value='root' } and trashed=false", fields: 'files(id,appProperties)', spaces: 'drive' }));
  if (r.files && r.files.length) { CLD.root = r.files[0].id; CLD.rootProps = r.files[0].appProperties || {}; return CLD.root; }
  const f = await gd(DRIVE + '?fields=id,appProperties', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: 'Newton Press', mimeType: FOLDER, appProperties: { np: 'root' } }) });
  CLD.root = f.id; CLD.rootProps = f.appProperties || {}; return CLD.root;
}
const stripExt = n => String(n || '').replace(/\.(json|npress)$/i, '');
async function clRefresh() {
  if (!CLD.user) return;
  try {
    const root = await ensureRoot(); const all = []; let page = '';
    do {
      const r = await gd(DRIVE + '?' + gq(Object.assign({ q: "appProperties has { key='np' and value='folder' } or appProperties has { key='np' and value='doc' }", fields: 'nextPageToken,files(id,name,parents,modifiedTime,trashed,appProperties)', pageSize: 1000, spaces: 'drive' }, page ? { pageToken: page } : {})));
      all.push(...(r.files || [])); page = r.nextPageToken || '';
    } while (page);
    const par = f => { const p = (f.parents || [])[0] || ''; return p === root ? '' : p; };
    CLD.folders = all.filter(f => f.appProperties.np === 'folder' && !f.trashed).map(f => ({ id: f.id, name: f.name, parent: par(f) }));
    const fid = new Set(CLD.folders.map(f => f.id));
    CLD.docs = all.filter(f => f.appProperties.np === 'doc').map(f => { const a = f.appProperties; let folder = par(f); if (folder && !fid.has(folder)) folder = ''; return { id: f.id, name: stripExt(f.name), folder, ts: Date.parse(f.modifiedTime), dev: a.dev || '', pages: +a.pages || 0, rev: a.rev || '', trash: !!f.trashed }; });
    CLD.loaded = true; CLD.needAuth = false; clRender(); clStatus(); clCheckRemote();
    if (!(CLD.rootProps || {}).migrated) clMigrate();
  } catch (e) { if (e.need) { clStatus('แตะเพื่อเชื่อม Drive', true); clRender(); } else toast('โหลดรายการจาก Drive ไม่ได้: ' + (e.message || e)); }
}
/* ---------- อ่าน/เขียนเอกสาร ---------- */
async function clWrite(id, meta, data) {
  const rev = newRev(); const body = JSON.stringify(data);
  const md = { name: (meta.name || 'เอกสาร') + '.json', mimeType: 'application/json', appProperties: { np: 'doc', rev, dev: DEV, pages: String(meta.pages || 0) } };
  if (!id) md.parents = [meta.folder || await ensureRoot()];
  const bd = 'np' + Math.random().toString(36).slice(2);
  const mp = new Blob([`--${bd}\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n${JSON.stringify(md)}\r\n--${bd}\r\nContent-Type: application/json\r\n\r\n`, body, `\r\n--${bd}--`]);
  const f = await gd((id ? DUP + '/' + id : DUP) + '?uploadType=multipart&fields=id,modifiedTime', { method: id ? 'PATCH' : 'POST', headers: { 'Content-Type': 'multipart/related; boundary=' + bd }, body: mp });
  return { id: f.id, rev };
}
async function clMeta(id) { return gd(DRIVE + '/' + id + '?fields=id,name,parents,trashed,modifiedTime,appProperties'); }
async function clRead(id) {
  const m = await clMeta(id); const r = await gd(DRIVE + '/' + id + '?alt=media', { raw: true }); const data = JSON.parse(await r.text());
  const root = await ensureRoot(); const p = (m.parents || [])[0] || '';
  return { meta: { name: stripExt(m.name), folder: p === root ? '' : p, rev: (m.appProperties || {}).rev || '', dev: (m.appProperties || {}).dev || '', pages: +(m.appProperties || {}).pages || 0, ts: Date.parse(m.modifiedTime) }, data };
}
const isDirty = () => !!(doc && doc.cloud && doc.cloud.id && doc.cloud.dirty);
function pagesNow() { const s = $('#sheets'); return (s && s.childElementCount) || 0; }
/* ---------- บันทึก ---------- */
async function clSave(opts = {}) {
  if (!CLD.user) { openCloud('save'); return false; }
  const c = doc.cloud || {}; if (!c.new && (!c.id || opts.asNew)) { openCloud('save'); return false; }
  if (CLD.busy) return false; CLD.busy = true; clStatus('กำลังบันทึก…'); const seq0 = CLD.seq || 0;
  try {
    if (c.id && !opts.force) {
      const m = await clMeta(c.id); const a = m.appProperties || {};
      if (a.rev && c.rev && a.rev !== c.rev) {
        CLD.busy = false; clStatus('มีฉบับใหม่กว่าจาก' + (a.dev || 'อีกเครื่อง'), true);
        if (opts.silent) return false;
        const ok = await ask('มีการแก้ไขจากอีกเครื่อง', `<p>งาน “${esc(stripExt(m.name))}” ถูกบันทึกจาก <b>${esc(a.dev || 'อีกเครื่อง')}</b> เมื่อ ${clTime(Date.parse(m.modifiedTime))} หลังจากที่เปิดไว้ในเครื่องนี้</p><p>กด “บันทึกทับ” เพื่อใช้ฉบับในเครื่องนี้แทน หรือกดยกเลิกแล้วเปิดจากคลังงานเพื่อโหลดฉบับล่าสุด</p>`, 'บันทึกทับ');
        if (!ok) return false; return clSave(Object.assign({}, opts, { force: true }));
      }
    }
    const data = Object.assign({}, doc); delete data.cloud;
    const r = await clWrite(c.id || '', { name: doc.settings.name || 'เอกสาร', folder: c.folder || '', pages: pagesNow() }, data);
    doc.cloud = { id: r.id, folder: c.folder || '', rev: r.rev, dirty: (CLD.seq || 0) !== seq0 }; autosave(); clStatus(doc.cloud.dirty ? 'ยังไม่บันทึก' : 'บันทึกแล้ว'); if (!opts.silent) toast('บันทึกลง Google Drive แล้ว');
    CLD.busy = false; clRefresh(); return true;
  } catch (e) {
    if (e.need) { clStatus('แตะเพื่อบันทึกลง Drive', true); if (!opts.silent) toast('ต้องยืนยันบัญชี Google อีกครั้ง กดป้าย ☁︎ หรือปุ่มบันทึก'); }
    else { clStatus('บันทึกไม่สำเร็จ', true); if (!opts.silent) toast('บันทึกไม่สำเร็จ: ' + (e.message || e)); }
    return false;
  } finally { CLD.busy = false; }
}
async function clSaveNew(name, folder) {
  doc.settings.name = name; doc.cloud = { id: '', new: true, folder, rev: '' };
  const ok = await clSave({ force: true }); if (ok) { CLD.cur = folder; clRender(); } else if (doc.cloud && !doc.cloud.id) delete doc.cloud; return ok;
}
async function clOpen(id) {
  if (isDirty() && doc.cloud.id !== id) { await clSave({ silent: true }); }
  clStatus('กำลังเปิด…');
  try {
    const { meta, data } = await clRead(id);
    doc = data; doc.settings = Object.assign(sampleDoc().settings, data.settings || {}); doc.settings.name = meta.name; doc.cloud = { id, folder: meta.folder || '', rev: meta.rev };
    CLD.loading = true; curId = null; applySettings(); renderAll(); hist.stack = []; hist.pos = -1; snapshot(); autosave(); setTimeout(() => { CLD.loading = false; if (doc.cloud) { doc.cloud.dirty = false; autosave(); } clStatus(); }, 2500); refreshInspector(); $('#scroller').scrollTop = 0;
    closeDlg('#dCloud'); clStatus('บันทึกแล้ว'); toast('เปิด “' + meta.name + '” แล้ว');
  } catch (e) { clStatus(e.need ? 'แตะเพื่อเชื่อม Drive' : '', !!e.need); toast('เปิดไม่ได้: ' + (e.message || e)); }
}
/* เปิดแอปมาแล้วงานเดิมมีฉบับใหม่จากอีกเครื่อง → โหลดให้อัตโนมัติ (ถ้าเครื่องนี้ไม่มีอะไรค้างบันทึก) */
async function clCheckRemote() {
  const c = doc && doc.cloud; if (!c || !c.id || CLD.busy) return; const m = CLD.docs.find(d => d.id === c.id); if (!m) return;
  if (m.trash) { clStatus('งานนี้อยู่ในถังขยะ', true); return; }
  if (!m.rev || m.rev === c.rev) return;
  if (!isDirty()) { await clOpen(c.id); toast('โหลดฉบับล่าสุดที่บันทึกจาก ' + (m.dev || 'อีกเครื่อง') + ' แล้ว'); }
  else clStatus('มีฉบับใหม่กว่าจาก' + (m.dev || 'อีกเครื่อง'), true);
}
/* บันทึกอัตโนมัติ (เมื่องานนี้อยู่ในคลังแล้ว) */
const _changedCL = changed;
changed = function (imm) {
  _changedCL(imm);
  if (CLD.loading) return;
  if (!(doc && doc.cloud && doc.cloud.id)) { if (CLD.user) clStatus(NOT_IN); else { const st = $('#clStat'); if (st && st.style.display !== 'none') clStatus(''); } return; }
  CLD.seq = (CLD.seq || 0) + 1; doc.cloud.dirty = true;
  if (CLD.user) { clStatus(tokOk() ? 'ยังไม่บันทึก' : 'แตะเพื่อบันทึกลง Drive', !tokOk()); clearTimeout(CLD.timer); if (tokOk()) CLD.timer = setTimeout(() => clSave({ silent: true }), 12000); }
};
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'hidden' && isDirty() && CLD.user && tokOk()) { clearTimeout(CLD.timer); clSave({ silent: true }); }
  if (document.visibilityState === 'visible' && CLD.user && tokOk()) clRefresh();
});
/* ---------- โฟลเดอร์ (เป็นโฟลเดอร์จริงใน Drive) ---------- */
const fById = id => CLD.folders.find(f => f.id === id);
function fPath(id) { const out = []; let f = fById(id), k = 0; while (f && k++ < 20) { out.unshift(f.name); f = fById(f.parent || ''); } return out; }
const kids = p => CLD.folders.filter(f => (f.parent || '') === p).sort((a, b) => a.name.localeCompare(b.name, 'th'));
async function mkFolder(name, parent) { const f = await gd(DRIVE + '?fields=id', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name, mimeType: FOLDER, parents: [parent || await ensureRoot()], appProperties: { np: 'folder' } }) }); return f.id; }
const patch = (id, body, qs = '') => gd(DRIVE + '/' + id + '?fields=id' + qs, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body || {}) });
const guard = fn => async (...a) => { try { await fn(...a); } catch (e) { toast((e.message || e) + ''); if (e.need) { clStatus('แตะเพื่อเชื่อม Drive', true); clRender(); } } };
const clNewFolder = guard(async () => {
  const ok = await ask('โฟลเดอร์ใหม่', `<div class="row"><label for="cfName">ชื่อโฟลเดอร์</label><input type="text" id="cfName" style="flex:1" placeholder="เช่น ม.4 เทอม 2"></div><p class="hint">สร้างไว้ใน: ${esc(['คลังงาน'].concat(fPath(CLD.cur)).join(' › '))}</p>`, 'สร้าง');
  const name = ok && $('#cfName').value.trim(); if (!name) return;
  const id = await mkFolder(name, CLD.cur); CLD.folders.push({ id, name, parent: CLD.cur || '' }); CLD.cur = id; CLD.view = 'all'; clRender(); clRefresh();
});
const clRenameFolder = guard(async id => {
  const f = fById(id); if (!f) return;
  const ok = await ask('เปลี่ยนชื่อโฟลเดอร์', `<div class="row"><input type="text" id="cfName" style="flex:1" value="${esc(f.name)}"></div>`, 'บันทึก');
  const name = ok && $('#cfName').value.trim(); if (!name) return; await patch(id, { name }); f.name = name; clRender();
});
const clDelFolder = guard(async id => {
  const f = fById(id); if (!f) return;
  const inside = CLD.docs.filter(d => (d.folder || '') === id && !d.trash).length, sub = kids(id).length;
  if (inside || sub) { await ask('ลบโฟลเดอร์ไม่ได้', `<p>โฟลเดอร์ “${esc(f.name)}” ยังมีงาน ${inside} ไฟล์ และโฟลเดอร์ย่อย ${sub} โฟลเดอร์ ย้ายหรือลบข้างในออกก่อน</p>`, 'เข้าใจแล้ว'); return; }
  if (!(await ask('ลบโฟลเดอร์', `<p>ย้ายโฟลเดอร์ว่าง “${esc(f.name)}” ไปถังขยะของ Google Drive ใช่ไหม</p>`, 'ลบโฟลเดอร์'))) return;
  await patch(id, { trashed: true }); CLD.cur = f.parent || ''; clRefresh();
});
function folderOptions(sel) {
  const out = [`<option value=""${!sel ? ' selected' : ''}>คลังงาน (ชั้นนอกสุด)</option>`];
  const walk = (p, d) => kids(p).forEach(f => { out.push(`<option value="${f.id}"${f.id === sel ? ' selected' : ''}>${'　'.repeat(d)}📁 ${esc(f.name)}</option>`); walk(f.id, d + 1); });
  walk('', 1); return out.join('');
}
/* ---------- งาน: ย้าย เปลี่ยนชื่อ สำเนา ลบ ---------- */
const clMove = guard(async (id, folder) => {
  const d = CLD.docs.find(x => x.id === id); const root = await ensureRoot(); const from = (d && d.folder) || root, to = folder || root; if (from === to) return;
  await patch(id, {}, '&' + gq({ addParents: to, removeParents: from })); if (d) d.folder = folder; if (doc.cloud && doc.cloud.id === id) { doc.cloud.folder = folder; autosave(); } clRender(); toast('ย้ายแล้ว');
});
async function clMoveAsk(id) {
  const d = CLD.docs.find(x => x.id === id); if (!d) return;
  const ok = await ask('ย้ายไปโฟลเดอร์', `<p>ย้าย “${esc(d.name)}” ไปที่</p><select id="cfTo" style="width:100%;font:inherit;padding:4px">${folderOptions(d.folder || '')}</select>`, 'ย้าย');
  if (ok) await clMove(id, $('#cfTo').value);
}
const clRename = guard(async id => {
  const d = CLD.docs.find(x => x.id === id); if (!d) return;
  const ok = await ask('เปลี่ยนชื่องาน', `<div class="row"><input type="text" id="cfName" style="flex:1" value="${esc(d.name)}"></div>`, 'บันทึก');
  const name = ok && $('#cfName').value.trim(); if (!name) return;
  await patch(id, { name: name + '.json' }); d.name = name; if (doc.cloud && doc.cloud.id === id) { doc.settings.name = name; autosave(); } clRender();
});
const clCopy = guard(async id => {
  clStatus('กำลังทำสำเนา…'); const { meta, data } = await clRead(id); data.settings = Object.assign({}, data.settings, { name: meta.name + ' (สำเนา)' });
  await clWrite('', { name: meta.name + ' (สำเนา)', folder: meta.folder || '', pages: meta.pages }, data); toast('ทำสำเนาแล้ว'); clStatus(); clRefresh();
});
const clTrash = guard(async (id, on) => { await patch(id, { trashed: !!on }); const d = CLD.docs.find(x => x.id === id); if (d) d.trash = !!on; clRender(); toast(on ? 'ย้ายไปถังขยะแล้ว (กู้คืนได้)' : 'กู้คืนแล้ว'); });
const clPurge = guard(async id => {
  const d = CLD.docs.find(x => x.id === id); if (!d) return;
  if (!(await ask('ลบถาวร', `<p>ลบ “${esc(d.name)}” ออกจาก Google Drive ถาวร กู้คืนไม่ได้อีก ใช่ไหม</p>`, 'ลบถาวร'))) return;
  await gd(DRIVE + '/' + id, { method: 'DELETE' }); CLD.docs = CLD.docs.filter(x => x.id !== id); clRender();
  if (doc.cloud && doc.cloud.id === id) { delete doc.cloud; autosave(); clStatus(''); }
});
async function clBackup() { // ดาวน์โหลดสำรองทั้งคลังเป็นไฟล์เดียว
  clStatus('กำลังรวมไฟล์สำรอง…');
  try { const out = { app: 'newton-press-library', ts: now(), folders: CLD.folders, docs: [] }; for (const d of CLD.docs.filter(x => !x.trash)) { const { meta, data } = await clRead(d.id); out.docs.push({ meta, data }); }
    saveFile('คลังงาน Newton Press ' + new Date().toISOString().slice(0, 10) + '.json', JSON.stringify(out)); }
  catch (e) { toast('สำรองไม่สำเร็จ: ' + (e.message || e)); } clStatus();
}
/* ---------- ย้ายงานจากคลังเดิม (Firebase) ไป Drive ครั้งเดียว ---------- */
async function clMigrate() {
  if (CLD.migrating) return; CLD.migrating = true;
  try {
    const uref = firebase.firestore().collection('users').doc(CLD.user.uid);
    const [fs, ds] = await Promise.all([uref.collection('folders').get(), uref.collection('docs').get()]);
    const oldF = fs.docs.map(d => Object.assign({ id: d.id }, d.data())), oldD = ds.docs.map(d => Object.assign({ id: d.id }, d.data())).filter(d => !d.trash);
    if (oldF.length || oldD.length) {
      clStatus('กำลังย้ายงานเดิมไป Drive…'); const map = {}; let left = oldF.slice(), guardN = 0;
      while (left.length && guardN++ < 50) { const next = []; for (const f of left) { const p = f.parent || ''; if (p && !(p in map)) { next.push(f); continue; } map[f.id] = await mkFolder(f.name, p ? map[p] : ''); } left = next; }
      for (const d of oldD) {
        const ps = await uref.collection('docs').doc(d.id).collection('parts').get(); const arr = []; ps.docs.forEach(p => { arr[+p.id] = p.data(); });
        if (arr.length < d.n) continue; const data = JSON.parse(arr.slice(0, d.n).map(p => p.d).join(''));
        const r = await clWrite('', { name: d.name, folder: d.folder ? map[d.folder] || '' : '', pages: d.pages }, data);
        if (doc.cloud && doc.cloud.id === d.id) { doc.cloud = { id: r.id, folder: d.folder ? map[d.folder] || '' : '', rev: r.rev, dirty: doc.cloud.dirty }; autosave(); }
      }
      toast(`ย้ายงานเดิม ${oldD.length} งาน และ ${oldF.length} โฟลเดอร์ ไปไว้ใน Google Drive แล้ว`);
    }
    await patch(CLD.root, { appProperties: { np: 'root', migrated: '1' } }); CLD.rootProps = { np: 'root', migrated: '1' };
    if (oldF.length || oldD.length) clRefresh();
  } catch (e) { console.warn('migrate', e); } finally { CLD.migrating = false; clStatus(); }
}
/* ---------- หน้าต่างคลังงาน ---------- */
function clTime(t) { if (!t) return ''; const d = new Date(t), n = new Date(); const hm = d.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }); if (d.toDateString() === n.toDateString()) return 'วันนี้ ' + hm; const y = new Date(n - 864e5); if (d.toDateString() === y.toDateString()) return 'เมื่อวาน ' + hm; return d.toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: '2-digit' }) + ' ' + hm; }
function clDlg() {
  let d = $('#dCloud'); if (d) return d;
  d = document.createElement('div'); d.id = 'dCloud'; d.className = 'dlg-back'; d.addEventListener('mousedown', e => { if (e.target === d) closeDlg('#dCloud'); });
  d.innerHTML = `<div class="dlg cl-dlg"><div class="cl-top"><h3>คลังงาน</h3><div id="clAcc"></div><button class="tb" id="clX" title="ปิด">✕</button></div><div id="clMain"></div></div>`;
  const ref = $('#dAsk'); ref.parentNode.insertBefore(d, ref); $('#clX', d).onclick = () => closeDlg('#dCloud'); return d;
}
function openCloud(mode = 'open') {
  CLD.mode = mode; clDlg(); if (doc.cloud && doc.cloud.id && mode === 'save') CLD.cur = doc.cloud.folder || ''; openDlg('#dCloud'); clRender();
  if (CLD.user && tokOk() && CLD.loaded) clRefresh();
  if (!CLD.ready) fbLoad().then(clRender).catch(e => { $('#clMain').innerHTML = `<p class="hint">เชื่อมต่อคลังงานไม่ได้ (${esc(e.message || e)}) ตรวจสอบอินเทอร์เน็ตแล้วลองใหม่</p>` + localBox(); bindLocal(); });
}
function localBox() { return `<div class="cl-local"><b>ไฟล์ในเครื่อง</b><button class="tb" id="clFOpen">เปิดไฟล์จากเครื่อง</button><button class="tb" id="clFSave">บันทึกเป็นไฟล์ .json</button></div>`; }
function bindLocal() { const a = $('#clFOpen'), b = $('#clFSave'); if (a) a.onclick = () => { closeDlg('#dCloud'); $('#fileOpen').click(); }; if (b) b.onclick = async () => { closeDlg('#dCloud'); const name = await askName(); if (!name) return; doc.settings.name = name; changed(true); const data = Object.assign({}, doc); delete data.cloud; saveFile(fname('json'), JSON.stringify(data)); }; }
function clRender() {
  const d = $('#dCloud'); if (!d || !d.classList.contains('open')) return;
  const acc = $('#clAcc'), main = $('#clMain');
  if (!CLD.ready) { acc.innerHTML = ''; main.innerHTML = '<p class="hint">กำลังเชื่อมต่อคลังงาน…</p>'; return; }
  if (!CLD.user) {
    acc.innerHTML = ''; main.innerHTML = `<div class="cl-signin"><div class="cl-big">☁︎</div><p>เข้าสู่ระบบด้วยบัญชี Google เพื่อเก็บงานไว้ใน <b>Google Drive</b> (โฟลเดอร์ “Newton Press”) แยกเป็นโฟลเดอร์ และเปิดงานเดียวกันได้ทั้งบน Mac และ iPad</p><button class="tb primary" id="clIn">เข้าสู่ระบบด้วย Google</button><p class="hint">ตอนเข้าสู่ระบบ Google จะขออนุญาตให้แอปจัดการเฉพาะไฟล์ที่แอปสร้างใน Drive ของคุณ</p></div>` + localBox();
    $('#clIn').onclick = () => clSignIn(); bindLocal(); return;
  }
  if (!tokOk() || CLD.needAuth) {
    acc.innerHTML = `<span class="cl-me">${esc(CLD.user.email || '')}</span><button class="tb" id="clOut">ออกจากระบบ</button>`;
    main.innerHTML = `<div class="cl-signin"><div class="cl-big">☁︎</div><p>เพื่อความปลอดภัย Google ให้ยืนยันบัญชีใหม่ทุกประมาณ 1 ชั่วโมง กดปุ่มด้านล่างเพื่อเชื่อมต่อ Google Drive ต่อ</p><button class="tb primary" id="clIn">เชื่อมต่อ Google Drive</button></div>` + localBox();
    $('#clIn').onclick = async () => { if (await clSignIn()) { clRender(); if (isDirty()) clSave({ silent: true }); } }; $('#clOut').onclick = () => clSignOut(); bindLocal(); return;
  }
  if (!CLD.loaded) { acc.innerHTML = ''; main.innerHTML = '<p class="hint" style="padding:30px;text-align:center">กำลังโหลดรายการจาก Google Drive…</p>'; return; }
  acc.innerHTML = `<span class="cl-me">${CLD.user.photoURL ? `<img src="${esc(CLD.user.photoURL)}" alt="">` : ''}${esc(CLD.user.email || CLD.user.displayName || '')}</span><button class="tb" id="clOut">ออกจากระบบ</button>`;
  $('#clOut').onclick = async () => { if (await ask('ออกจากระบบ', '<p>ออกจากระบบบนเครื่องนี้ใช่ไหม งานใน Google Drive ยังอยู่ครบ</p>', 'ออกจากระบบ')) clSignOut(); };
  if (CLD.cur && !fById(CLD.cur)) CLD.cur = '';
  const tree = (p, dep) => kids(p).map(f => { const n = CLD.docs.filter(x => (x.folder || '') === f.id && !x.trash).length; return `<div class="cl-f${CLD.view === 'all' && CLD.cur === f.id ? ' on' : ''}" data-f="${f.id}" style="padding-left:${10 + dep * 16}px">📁 <span>${esc(f.name)}</span><i>${n || ''}</i></div>` + tree(f.id, dep + 1); }).join('');
  const nTrash = CLD.docs.filter(x => x.trash).length;
  const side = `<div class="cl-side"><div class="cl-f${CLD.view === 'all' && !CLD.cur ? ' on' : ''}" data-f="">🗂 <span>คลังงาน</span><i>${CLD.docs.filter(x => !x.folder && !x.trash).length || ''}</i></div>${tree('', 1)}<div class="cl-f${CLD.view === 'recent' ? ' on' : ''}" data-v="recent">🕘 <span>ล่าสุด</span></div><div class="cl-f${CLD.view === 'trash' ? ' on' : ''}" data-v="trash">🗑 <span>ถังขยะ</span><i>${nTrash || ''}</i></div><button class="tb cl-nf" id="clNF">＋ โฟลเดอร์ใหม่</button></div>`;
  let list = CLD.docs.slice(); const q = CLD.q.trim().toLowerCase();
  if (q) list = list.filter(x => !x.trash && (x.name || '').toLowerCase().includes(q));
  else if (CLD.view === 'trash') list = list.filter(x => x.trash);
  else if (CLD.view === 'recent') list = list.filter(x => !x.trash).sort((a, b) => (b.ts || 0) - (a.ts || 0)).slice(0, 20);
  else list = list.filter(x => !x.trash && (x.folder || '') === CLD.cur);
  if (CLD.view !== 'recent' || q) list.sort((a, b) => (b.ts || 0) - (a.ts || 0));
  const subs = !q && CLD.view === 'all' ? kids(CLD.cur) : [];
  const crumbs = q ? `ผลการค้นหา “${esc(CLD.q)}”` : CLD.view === 'trash' ? 'ถังขยะ <small>(กู้คืนได้ · ลบถาวรได้)</small>' : CLD.view === 'recent' ? 'แก้ไขล่าสุด' : ['<a data-f="">คลังงาน</a>'].concat((() => { const o = []; let f = fById(CLD.cur), k = 0; while (f && k++ < 20) { o.unshift(`<a data-f="${f.id}">${esc(f.name)}</a>`); f = fById(f.parent || ''); } return o; })()).join(' › ');
  const curId2 = doc.cloud && doc.cloud.id;
  const row = x => `<div class="cl-d${x.id === curId2 ? ' cur' : ''}" data-d="${x.id}" draggable="true"><div class="cl-dn">📄 <b>${esc(x.name || 'ไม่มีชื่อ')}</b>${x.id === curId2 ? '<em>กำลังเปิดอยู่</em>' : ''}<small>${clTime(x.ts)}${x.dev ? ' · ' + esc(x.dev) : ''}${x.pages ? ' · ' + x.pages + ' หน้า' : ''}${(q || CLD.view === 'recent') && x.folder ? ' · 📁 ' + esc(fPath(x.folder).join(' › ')) : ''}</small></div><div class="cl-da">${x.trash ? `<button class="tb" data-a="restore">กู้คืน</button><button class="tb" data-a="purge">ลบถาวร</button>` : `<button class="tb primary" data-a="open">เปิด</button><button class="tb" data-a="more" title="ตัวเลือก">⋯</button>`}</div></div>`;
  const body = subs.map(f => `<div class="cl-d cl-sub" data-f="${f.id}"><div class="cl-dn">📁 <b>${esc(f.name)}</b><small>${CLD.docs.filter(x => (x.folder || '') === f.id && !x.trash).length} งาน</small></div><div class="cl-da"><button class="tb" data-fa="ren" title="เปลี่ยนชื่อ">✎</button><button class="tb" data-fa="del" title="ลบโฟลเดอร์">🗑</button></div></div>`).join('') + list.map(row).join('');
  const saveBar = CLD.view === 'trash' ? '' : `<div class="cl-save"><label>บันทึกงานที่เปิดอยู่ลงใน <b>${esc(['คลังงาน'].concat(fPath(CLD.cur)).join(' › '))}</b></label><div class="row"><input type="text" id="clName" value="${esc(doc.settings.name || 'เอกสาร')}" placeholder="ชื่องาน"><button class="tb primary" id="clSaveHere">${curId2 ? 'บันทึกเป็นงานใหม่ที่นี่' : 'บันทึกที่นี่'}</button>${curId2 ? '<button class="tb" id="clSaveNow">บันทึกทับงานเดิม</button>' : ''}</div></div>`;
  main.innerHTML = `<div class="cl-wrap">${side}<div class="cl-mainc"><div class="cl-bar"><div class="cl-crumb">${crumbs}</div><input type="search" id="clQ" placeholder="ค้นหาชื่องาน" value="${esc(CLD.q)}"></div>${CLD.mode === 'save' ? saveBar : ''}<div class="cl-list">${body || `<p class="hint cl-empty">${CLD.view === 'trash' ? 'ถังขยะว่าง' : q ? 'ไม่พบงานที่ค้นหา' : 'ยังไม่มีงานในโฟลเดอร์นี้'}</p>`}</div>${CLD.mode !== 'save' ? saveBar : ''}<div class="cl-foot"><button class="tb" id="clFOpen">เปิดไฟล์จากเครื่อง</button><button class="tb" id="clFSave">บันทึกเป็นไฟล์ .json</button><button class="tb" id="clBak" title="ดาวน์โหลดงานทั้งหมดในคลังเป็นไฟล์เดียว เก็บสำรองไว้">สำรองทั้งคลัง</button><button class="tb" id="clRef" title="โหลดรายการใหม่จาก Drive">↻ รีเฟรช</button><a class="tb" href="https://drive.google.com/drive/folders/${CLD.root}" target="_blank" rel="noopener">เปิดใน Google Drive ↗</a></div></div></div>`;
  bindLocal(); $('#clBak').onclick = clBackup; $('#clRef').onclick = () => clRefresh(); $('#clNF').onclick = clNewFolder;
  const qi = $('#clQ'); qi.oninput = () => { CLD.q = qi.value; const p = qi.selectionStart; clRender(); const n = $('#clQ'); n.focus(); n.setSelectionRange(p, p); };
  $$('[data-f]', main).forEach(e => { if (e.matches('.cl-d') ) return; e.onclick = () => { CLD.cur = e.dataset.f; CLD.view = 'all'; CLD.q = ''; clRender(); }; });
  $$('[data-v]', main).forEach(e => e.onclick = () => { CLD.view = e.dataset.v; CLD.q = ''; clRender(); });
  $$('.cl-sub', main).forEach(e => { e.onclick = ev => { const b = ev.target.closest('[data-fa]'); if (b) { ev.stopPropagation(); if (b.dataset.fa === 'ren') clRenameFolder(e.dataset.f); else clDelFolder(e.dataset.f); return; } CLD.cur = e.dataset.f; clRender(); }; });
  $$('.cl-d[data-d]', main).forEach(e => {
    const id = e.dataset.d;
    e.ondblclick = () => { const x = CLD.docs.find(y => y.id === id); if (x && !x.trash) clOpen(id); };
    e.onclick = ev => { const b = ev.target.closest('[data-a]'); if (!b) return; const a = b.dataset.a;
      if (a === 'open') clOpen(id); else if (a === 'restore') clTrash(id, false); else if (a === 'purge') clPurge(id); else if (a === 'more') clMenu(b, id); };
    e.ondragstart = ev => { ev.dataTransfer.setData('text/np-doc', id); ev.dataTransfer.effectAllowed = 'move'; };
  });
  $$('.cl-side .cl-f[data-f], .cl-sub', main).forEach(t => {
    t.ondragover = ev => { if ([...ev.dataTransfer.types].includes('text/np-doc')) { ev.preventDefault(); t.classList.add('drop'); } };
    t.ondragleave = () => t.classList.remove('drop');
    t.ondrop = ev => { ev.preventDefault(); t.classList.remove('drop'); const id = ev.dataTransfer.getData('text/np-doc'); if (id) clMove(id, t.dataset.f); };
  });
  const sh = $('#clSaveHere'); if (sh) sh.onclick = async () => { const name = $('#clName').value.trim() || 'เอกสาร'; if (await clSaveNew(name, CLD.cur)) { CLD.mode = 'open'; clRender(); } };
  const sn = $('#clSaveNow'); if (sn) sn.onclick = async () => { if (await clSave()) closeDlg('#dCloud'); };
}
function clMenu(btn, id) {
  $$('.cl-menu').forEach(m => m.remove()); const m = document.createElement('div'); m.className = 'cl-menu';
  m.innerHTML = [['ren', '✎ เปลี่ยนชื่อ'], ['mv', '📁 ย้ายไปโฟลเดอร์…'], ['cp', '⧉ ทำสำเนา'], ['tr', '🗑 ย้ายไปถังขยะ']].map(([k, t]) => `<button data-m="${k}">${t}</button>`).join('');
  document.body.appendChild(m); const r = btn.getBoundingClientRect(); m.style.top = Math.min(innerHeight - 180, r.bottom + 4) + 'px'; m.style.left = Math.max(8, r.right - 200) + 'px';
  const off = ev => { if (!m.contains(ev.target)) { m.remove(); document.removeEventListener('pointerdown', off, true); } }; setTimeout(() => document.addEventListener('pointerdown', off, true), 0);
  m.onclick = ev => { const k = ev.target.dataset.m; if (!k) return; m.remove(); if (k === 'ren') clRename(id); else if (k === 'mv') clMoveAsk(id); else if (k === 'cp') clCopy(id); else if (k === 'tr') clTrash(id, true); };
}
/* ---------- สถานะบนแถบเครื่องมือ ---------- */
const NOT_IN = 'ยังไม่อยู่ในคลัง · แตะเพื่อบันทึกลง Drive';
function clStatus(t, warn) {
  const s = $('#clStat'); if (!s) return;
  if (t === undefined) t = doc && doc.cloud && doc.cloud.id ? (doc.cloud.dirty ? 'ยังไม่บันทึก' : 'บันทึกแล้ว') : (CLD.user ? NOT_IN : '');
  if (t === NOT_IN) warn = true;
  const busy = /^กำลัง/.test(t || ''), ok = t === 'บันทึกแล้ว';
  s.innerHTML = t ? (busy ? '<i class="cl-spin"></i>' : ok ? '<b class="cl-ok">✓</b>' : '☁︎ ') + esc(t) : '';
  s.classList.toggle('warn', !!warn); s.classList.toggle('busy', busy); s.style.display = t ? '' : 'none';
  if (ok && s._was === 'busy') { s.classList.remove('flash'); void s.offsetWidth; s.classList.add('flash'); }
  s._was = busy ? 'busy' : '';
  s.title = doc && doc.cloud && doc.cloud.id ? 'งานนี้อยู่ใน Google Drive: ' + ['Newton Press'].concat(fPath(doc.cloud.folder || '')).join(' › ') + ' · บันทึกอัตโนมัติ' : '';
}
(function initCloud() {
  const bOpen = $('#bOpen'), bSave = $('#bSave'); if (!bOpen) return;
  bOpen.textContent = 'คลังงาน'; bOpen.title = 'เปิดงานจาก Google Drive · จัดโฟลเดอร์ · ซิงก์ Mac ↔ iPad';
  bOpen.onclick = () => openCloud('open');
  bSave.title = 'บันทึกลง Google Drive (⌘S)';
  bSave.onclick = async () => {
    if (CLD.user && doc.cloud && doc.cloud.id) { if (!tokOk()) { if (!(await clSignIn())) return; } clSave(); }
    else openCloud('save');
  };
  const st = document.createElement('span'); st.id = 'clStat'; st.style.display = 'none';
  st.onclick = async () => { if (CLD.user && !tokOk()) { if (await clSignIn()) { if (isDirty()) clSave(); } return; } openCloud(doc.cloud && doc.cloud.id ? 'open' : 'save'); }; bSave.after(st);
  // ปุ่มเปิดไฟล์จากเครื่อง (ไฟล์ที่ยังไม่อยู่ในคลัง) — ยังเชื่อม Google Drive อยู่ กดบันทึกเพื่อเก็บเข้าคลังได้
  const bFile = document.createElement('button'); bFile.className = 'tb'; bFile.id = 'bFile'; bFile.textContent = 'เปิดไฟล์'; bFile.title = 'เปิดไฟล์จากเครื่อง (ไฟล์ที่ไม่ได้อยู่ในคลังงาน)'; bFile.onclick = () => $('#fileOpen').click(); bOpen.after(bFile);
  const nb = $('#bNew'); if (nb) { const o = nb.onclick; nb.onclick = async () => { if (isDirty() && CLD.user) await clSave({ silent: true }); return o(); }; }
  // ไฟล์ที่เปิดจากเครื่องไม่ผูกกับคลังงาน
  const fo = $('#fileOpen'); if (fo) fo.addEventListener('change', () => setTimeout(() => { clStatus(); if (CLD.user) toast('เปิดไฟล์จากเครื่องแล้ว · กด “บันทึก” เพื่อเก็บเข้าคลังงานใน Google Drive', 4000); }, 300));
  let signedBefore = false; try { signedBefore = !!localStorage.getItem('np-cloud'); } catch (e) { }
  // โหลดระบบล็อกอินไว้ก่อน เพื่อให้กดปุ่มแล้วหน้าต่าง Google ขึ้นได้ทันที (Safari/iPad)
  fbLoad().then(() => { if (CLD.user && !tokOk()) clStatus('แตะเพื่อเชื่อม Drive', true); else clStatus(); }).catch(() => { if (signedBefore) clStatus('ออฟไลน์', true); });
})();

/* ---------- ปุ่มรีเฟรช / อัปเดตแอป ---------- */
/* NP_BUILD อยู่ใน index.html */
(function initUpdate() {
  const bSave = $('#bSave'); if (!bSave) return;
  const b = document.createElement('button'); b.className = 'tb'; b.id = 'bUpd'; b.title = 'รีเฟรชแอป (โหลดเวอร์ชันล่าสุด)'; b.textContent = '⟳'; bSave.after(b);
  b.onclick = async () => {
    if (isDirty() && CLD.user && tokOk()) { await clSave({ silent: true }); }
    autosave(); b.innerHTML = '<i class="cl-spin"></i>'; location.replace(location.pathname + '?u=' + Date.now());
  };
  async function check() {
    try {
      const t = await (await fetch(location.pathname + '?v=' + Date.now(), { cache: 'no-store' })).text();
      const m = /const NP_BUILD = '(\d+)'/.exec(t);
      if (m && m[1] !== NP_BUILD && !/%%/.test(NP_BUILD)) { b.classList.add('upd'); b.textContent = '⟳ มีอัปเดต'; b.title = 'มีเวอร์ชันใหม่ กดเพื่ออัปเดตแอป (งานที่ทำอยู่จะบันทึกก่อน)'; }
    } catch (e) { }
  }
  if (location.protocol.startsWith('http')) { setTimeout(check, 5000); setInterval(check, 10 * 60e3); document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible') check(); }); }
})();

/* ---------- แท็บเอกสาร: เปิดได้พร้อมกันสูงสุด 12 ไฟล์ ---------- */
const TABMAX = 12;
const TB = { list: [], i: 0, ref: null, sw: false, busy: false, t: null };
const tabKey = () => 't' + Math.random().toString(36).slice(2, 9);
const tabCloud = d => !!(d && d.cloud && d.cloud.id);
const tabSleep = ms => new Promise(r => setTimeout(r, ms));

/* ---- เก็บแท็บทั้งหมดไว้ใน IndexedDB (พื้นที่มากกว่า localStorage) ---- */
let tabDB = null;
function tabIDB() {
  if (tabDB) return tabDB;
  tabDB = new Promise((ok, no) => { try { const r = indexedDB.open('newton-press', 1); r.onupgradeneeded = () => r.result.createObjectStore('kv'); r.onsuccess = () => ok(r.result); r.onerror = () => no(r.error); } catch (e) { no(e); } });
  return tabDB;
}
async function tabIdbGet(k) { const db = await tabIDB(); return new Promise(ok => { const q = db.transaction('kv').objectStore('kv').get(k); q.onsuccess = () => ok(q.result); q.onerror = () => ok(null); }); }
async function tabIdbSet(k, v) { const db = await tabIDB(); return new Promise(ok => { const tx = db.transaction('kv', 'readwrite'); tx.objectStore('kv').put(v, k); tx.oncomplete = () => ok(true); tx.onerror = () => ok(false); }); }
function tabStore(now) {
  clearTimeout(TB.t);
  const go = () => { if (!TB.list.length || TB.hold) return; const L = TB.list.map((t, k) => ({ key: t.key, doc: JSON.stringify(k === TB.i ? doc : t.doc) })); tabIdbSet('tabs', { i: TB.i, list: L }).catch(() => { }); };
  if (now) go(); else TB.t = setTimeout(go, 1500);
}
const _autosaveT = autosave;
autosave = function () { _autosaveT(); try { if (TB.list[TB.i]) localStorage.setItem('np-tabkey', TB.list[TB.i].key); } catch (e) { } tabStore(); tabBar(); };

/* ---- เอกสารถูกแทนที่ (เปิดไฟล์ / เปิดจากคลัง / แม่แบบใหม่ / สร้างเฉลย) → แยกเป็นแท็บใหม่ ---- */
function tabAdopt() {
  const nd = doc, od = TB.ref, cur = TB.list[TB.i];
  if (!cur) return;
  const keepCur = () => { cur.doc = od; cur.hist = { stack: hist.stack, pos: hist.pos }; cur.top = $('#scroller').scrollTop; };
  if (tabCloud(nd)) { // งานนี้เปิดอยู่แล้วในอีกแท็บ → อัปเดตแท็บนั้นแล้วสลับไป
    const j = TB.list.findIndex((t, k) => k !== TB.i && tabCloud(t.doc) && t.doc.cloud.id === nd.cloud.id);
    if (j >= 0) { keepCur(); TB.list[j].doc = nd; TB.list[j].hist = null; TB.i = j; hist.stack = []; hist.pos = -1; curId = null; return; }
    if (tabCloud(od) && od.cloud.id === nd.cloud.id) return; // โหลดฉบับใหม่ของงานเดิม
  }
  if (cur.fresh) { cur.fresh = false; return; } // แท็บตัวอย่างที่ยังไม่ได้แก้ → ใช้แทนได้เลย
  if (TB.list.length >= TABMAX) { // เต็ม → คงงานเดิมไว้
    doc = od; setTimeout(() => toast(`เปิดได้พร้อมกันสูงสุด ${TABMAX} แท็บ · ปิดแท็บที่ไม่ใช้ก่อน`, 3500), 400); return;
  }
  keepCur();
  TB.list.splice(TB.i + 1, 0, { key: tabKey(), doc: nd, hist: null, top: 0 });
  TB.i++; hist.stack = []; hist.pos = -1; curId = null; try { selSet.clear(); } catch (e) { }
}
const _renderAllT = renderAll;
renderAll = function () {
  if (TB.ref && doc !== TB.ref && !hist.lock && !TB.sw) tabAdopt();
  _renderAllT();
  TB.ref = doc; tabBar();
};

/* ---- สลับ / ปิดแท็บ ---- */
async function tabFlushCloud() {
  if (typeof CLD === 'undefined') return true;
  for (let n = 0; CLD.loading && n < 40; n++) await tabSleep(100);
  clearTimeout(CLD.timer);
  if (isDirty() && CLD.user && tokOk()) await clSave({ silent: true });
  for (let n = 0; CLD.busy && n < 100; n++) await tabSleep(150);
  return true;
}
function tabLoad(j) {
  const t = TB.list[j]; TB.i = j; TB.sw = true;
  doc = t.doc; hist.stack = t.hist ? t.hist.stack : []; hist.pos = t.hist ? t.hist.pos : -1;
  curId = null; try { selSet.clear(); blockMode = false; } catch (e) { }
  applySettings(); renderAll(); TB.sw = false;
  if (hist.pos < 0) snapshot();
  try { refreshInspector(); } catch (e) { }
  schedulePaginate(); setTimeout(() => { $('#scroller').scrollTop = t.top || 0; }, 120);
  if (typeof clStatus === 'function') clStatus();
  autosave(); tabStore(true);
}
async function tabGo(j) {
  if (j === TB.i || TB.busy || !TB.list[j]) return;
  TB.busy = true; tabBar();
  try {
    await tabFlushCloud();
    clearTimeout(saveTimer); snapshot();
    const cur = TB.list[TB.i]; cur.doc = doc; cur.hist = { stack: hist.stack, pos: hist.pos }; cur.top = $('#scroller').scrollTop; cur.fresh = false;
    await tabLoad(j);
  } finally { TB.busy = false; tabBar(); }
}
async function tabClose(j) {
  if (TB.busy || TB.list.length < 2) return;
  if (j !== TB.i) { await tabGo(j); if (TB.i !== j) return; }
  const d = doc;
  if (tabCloud(d)) { await tabFlushCloud(); if (isDirty()) { if (!(await ask('ปิดแท็บ', '<p>งานนี้ยังบันทึกลง Drive ไม่สำเร็จ ถ้าปิดตอนนี้ส่วนที่แก้ล่าสุดจะหายไป ต้องการปิดไหม</p>', 'ปิดแท็บ'))) return; } }
  else if (!TB.list[j].fresh && !(await ask('ปิดแท็บ', `<p>“${esc(d.settings.name || 'เอกสาร')}” ยังไม่อยู่ในคลังงาน Drive ถ้ายังไม่ได้บันทึกเป็นไฟล์ งานจะหายไปเมื่อปิดแท็บ</p><p>ต้องการปิดแท็บนี้ไหม</p>`, 'ปิดแท็บ'))) return;
  TB.list.splice(j, 1);
  await tabLoad(Math.min(j, TB.list.length - 1));
}
function tabNew() {
  if (TB.list.length >= TABMAX && !TB.list[TB.i].fresh) { toast(`เปิดได้พร้อมกันสูงสุด ${TABMAX} แท็บ · ปิดแท็บที่ไม่ใช้ก่อน`, 3500); return false; }
  openTemplates(); return true;
}
const tabFull = () => TB.list.length >= TABMAX && !(TB.list[TB.i] && TB.list[TB.i].fresh);

/* ---- แถบแท็บ ---- */
function tabBar() {
  let el = $('#docTabs');
  if (!el) { el = document.createElement('div'); el.id = 'docTabs'; $('#main').before(el); }
  const one = TB.list.length < 2;
  el.innerHTML = TB.list.map((t, k) => {
    const d = k === TB.i ? doc : t.doc, nm = esc((d && d.settings && d.settings.name) || 'เอกสาร'), dirty = d && d.cloud && d.cloud.dirty;
    return `<div class="dt${k === TB.i ? ' on' : ''}" data-k="${k}" title="${nm}${tabCloud(d) ? ' · อยู่ในคลัง Drive' : ' · ยังไม่อยู่ในคลัง'}"><span class="dt-ic">${tabCloud(d) ? '☁︎' : '📄'}</span><span class="dt-n">${nm}</span>${dirty ? '<span class="dt-d" title="ยังไม่บันทึก">●</span>' : ''}${one ? '' : `<button class="dt-x" data-x="${k}" title="ปิดแท็บ">✕</button>`}</div>`;
  }).join('') + `<button class="dt-add" title="เอกสารใหม่ในแท็บใหม่ (สูงสุด ${TABMAX} แท็บ)"${tabFull() ? ' disabled' : ''}>＋</button>${TB.busy ? '<span class="dt-busy">กำลังสลับ…</span>' : ''}`;
}
(function tabInit() {
  const css = document.createElement('style');
  css.textContent = `#docTabs{flex:0 0 auto;display:flex;align-items:flex-end;gap:2px;padding:4px 10px 0;background:var(--ui-bg);border-bottom:1px solid var(--ui-line);overflow-x:auto;scrollbar-width:thin}
#docTabs .dt{display:flex;align-items:center;gap:5px;max-width:230px;min-width:0;padding:5px 8px 5px 10px;border:1px solid var(--ui-line);border-bottom:0;border-radius:8px 8px 0 0;background:var(--ui-panel);opacity:.72;cursor:pointer;font-size:16px;white-space:nowrap;user-select:none}
#docTabs .dt.on{opacity:1;background:#fff;box-shadow:0 -2px 0 var(--ui-accent) inset;margin-bottom:-1px;padding-bottom:6px}
#docTabs .dt:hover{opacity:1}
#docTabs .dt-n{overflow:hidden;text-overflow:ellipsis;min-width:0}
#docTabs .dt-ic{font-size:13px;opacity:.7}
#docTabs .dt-d{color:#c2410c;font-size:11px}
#docTabs .dt-x{border:0;background:none;cursor:pointer;color:#8a8178;font-size:13px;padding:0 2px;border-radius:4px;line-height:1}
#docTabs .dt-x:hover{background:#0001;color:#b91c1c}
#docTabs .dt-add{border:1px dashed var(--ui-line);background:none;border-radius:8px;cursor:pointer;font-size:17px;padding:2px 10px;margin:0 0 4px 4px;color:var(--ui-accent)}
#docTabs .dt-add:disabled{opacity:.35;cursor:not-allowed}
#docTabs .dt-busy{font-size:14px;color:#8a8178;margin:0 0 6px 8px}
@media print{#docTabs{display:none}}.exporting #docTabs{display:none}`;
  document.head.appendChild(css);
  let fresh = false; try { fresh = !localStorage.getItem('en-editor-draft'); } catch (e) { }
  TB.list = [{ key: tabKey(), doc, hist: null, top: 0, fresh }]; TB.i = 0; TB.ref = doc;
  tabBar();
  $('#bar').parentNode.addEventListener('click', e => {
    const tb = e.target.closest('#docTabs'); if (!tb) return;
    const x = e.target.closest('.dt-x'); if (x) { e.stopPropagation(); tabClose(+x.dataset.x); return; }
    if (e.target.closest('.dt-add')) { tabNew(); return; }
    const t = e.target.closest('.dt'); if (t) tabGo(+t.dataset.k);
  });
  // คลิกกลาง = ปิดแท็บ
  document.addEventListener('auxclick', e => { const t = e.target.closest && e.target.closest('#docTabs .dt'); if (t && e.button === 1) { e.preventDefault(); tabClose(+t.dataset.k); } });
  // ปุ่ม "ใหม่" = เอกสารใหม่ในแท็บใหม่ (ไม่ต้องเตือนว่างานจะหาย)
  const nb = $('#bNew'); if (nb) nb.onclick = async () => { if (tabFull()) { toast(`เปิดได้พร้อมกันสูงสุด ${TABMAX} แท็บ · ปิดแท็บที่ไม่ใช้ก่อน`, 3500); return; } if (typeof CLD !== 'undefined' && isDirty() && CLD.user) await clSave({ silent: true }); openTemplates(); };
  // เปิดไฟล์จากเครื่อง: เช็กจำนวนแท็บก่อนเปิดหน้าต่างเลือกไฟล์
  const fo = $('#fileOpen'); if (fo) fo.addEventListener('click', e => { if (tabFull()) { e.preventDefault(); toast(`เปิดได้พร้อมกันสูงสุด ${TABMAX} แท็บ · ปิดแท็บที่ไม่ใช้ก่อน`, 3500); } });
  // เปิดจากคลัง: ถ้างานนั้นเปิดอยู่แล้วในอีกแท็บ → สลับไปเลย
  if (typeof clOpen === 'function') {
    const _o = clOpen;
    clOpen = async function (id) {
      const j = TB.list.findIndex((t, k) => tabCloud(k === TB.i ? doc : t.doc) && (k === TB.i ? doc : t.doc).cloud.id === id);
      if (j >= 0 && j !== TB.i) { closeDlg('#dCloud'); await tabGo(j); toast('งานนี้เปิดอยู่แล้วในแท็บนี้'); return; }
      if (j < 0 && tabFull()) { toast(`เปิดได้พร้อมกันสูงสุด ${TABMAX} แท็บ · ปิดแท็บที่ไม่ใช้ก่อน`, 3500); return; }
      return _o(id);
    };
  }
  // คีย์ลัด Ctrl/⌘ + Alt + ← / → สลับแท็บ
  document.addEventListener('keydown', e => {
    if ((e.ctrlKey || e.metaKey) && e.altKey && (e.key === 'ArrowLeft' || e.key === 'ArrowRight') && TB.list.length > 1) {
      e.preventDefault(); const n = TB.list.length; tabGo((TB.i + (e.key === 'ArrowRight' ? 1 : n - 1)) % n);
    }
  });
  document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden') tabStore(true); });
  window.addEventListener('pagehide', () => tabStore(true));
  // กู้แท็บที่เปิดค้างไว้ครั้งก่อน
  // เปิดแอป = หน้าว่าง · งานครั้งก่อนเก็บไว้ที่ 'prev' ให้กด “เปิดต่อ”
  TB.hold = true;
  const live = d => { try { const o = typeof d === 'string' ? JSON.parse(d) : d; return o && o.blocks && (o.blocks.length > 1 || (o.blocks[0] && (o.blocks[0].t !== 'para' || String(o.blocks[0].html || '').replace(/<[^>]+>|&nbsp;|\s/g, '')))); } catch (e) { return false; } };
  tabIdbGet('tabs').then(async s => {
    if (s && s.list && s.list.some(t => live(t.doc))) { s.list = s.list.filter(t => live(t.doc)); s.i = Math.min(s.i || 0, s.list.length - 1); await tabIdbSet('prev', s); } else s = await tabIdbGet('prev');
    TB.hold = false; if (s && s.list && s.list.length) { window.NP_PREV = s; if (typeof npPrevChip === 'function') npPrevChip(); }
  }).catch(() => { TB.hold = false; });
})();

function npRestorePrev() {
  const s = window.NP_PREV; if (!s || !s.list) return; const L = [];
  s.list.slice(0, TABMAX).forEach(t => { try { const d = JSON.parse(t.doc); if (d && d.blocks) L.push({ key: t.key || tabKey(), doc: d, hist: null, top: 0 }); } catch (e) { } });
  if (!L.length) return; const ai = Math.min(s.i || 0, L.length - 1);
  doc = L[ai].doc; TB.list = L; TB.i = ai; TB.ref = doc; curId = null; hist.stack = []; hist.pos = -1; applySettings(); renderAll(); snapshot(); autosave(); try { refreshInspector(); } catch (e) { } $('#scroller').scrollTop = 0; tabBar();
  window.NP_PREV = null; const c = $('#npPrev'); if (c) c.remove(); if (typeof clStatus === 'function') clStatus();
}

/* ---------- หน้าต่างแจ้งสถานะงานที่ใช้เวลานาน (ส่งออก เปิดไฟล์ สลับแท็บ) ---------- */
const BZ = { on: false, t0: 0, tick: null, saved: false };
// แสดงผลก่อนเริ่มงานหนัก · ถ้าแท็บถูกซ่อน rAF จะไม่ทำงาน จึงใช้ MessageChannel แทน (ไม่ค้าง)
const paintNow = () => new Promise(r => { if (document.hidden) { const c = new MessageChannel(); c.port1.onmessage = () => r(); c.port2.postMessage(0); return; } let done = false; const fin = () => { if (!done) { done = true; r(); } }; requestAnimationFrame(() => requestAnimationFrame(() => fin())); setTimeout(fin, 120); });
const BZ_TITLE = { base: '' };
function bzTitle(t) { if (!BZ_TITLE.base) BZ_TITLE.base = document.title.replace(/^[(⏳✓].*?[)] /, ''); document.title = t ? t + ' ' + BZ_TITLE.base : BZ_TITLE.base; }
function bzEl() {
  let el = $('#bzBox'); if (el) return el;
  const css = document.createElement('style');
  css.textContent = `#bzBox{position:fixed;inset:0;z-index:9000;display:none;align-items:center;justify-content:center;background:rgba(40,30,20,.18);backdrop-filter:blur(1.5px);-webkit-backdrop-filter:blur(1.5px);cursor:progress}
#bzBox.on{display:flex}
#bzBox .bz{min-width:300px;max-width:min(440px,90vw);background:#fff;border-radius:14px;box-shadow:0 12px 40px #0003;padding:18px 22px 16px;font-family:var(--ui-font);color:var(--ui-ink)}
#bzBox .bz-h{display:flex;align-items:center;gap:12px;font-size:19px;font-weight:700}
#bzBox .bz-sp{flex:none;width:26px;height:26px;border-radius:50%;border:3px solid #e8dfd4;border-top-color:var(--ui-accent);animation:bzrot .8s linear infinite}
#bzBox.done .bz-sp{animation:none;border-color:#2e8b57;background:#2e8b57;position:relative}
#bzBox.done .bz-sp::after{content:'✓';position:absolute;inset:0;display:grid;place-items:center;color:#fff;font-size:16px;font-weight:700}
#bzBox .bz-bar{height:7px;border-radius:4px;background:#f0e9e0;margin:14px 0 6px;overflow:hidden;display:none}
#bzBox .bz-bar>i{display:block;height:100%;width:0;background:var(--ui-accent);border-radius:4px;transition:width .25s}
#bzBox .bz-s{font-size:15px;color:#8a8178;display:flex;justify-content:space-between;gap:10px;margin-top:6px}
@keyframes bzrot{to{transform:rotate(360deg)}}
.exporting #bzBox{display:flex}`;
  document.head.appendChild(css);
  el = document.createElement('div'); el.id = 'bzBox';
  el.innerHTML = '<div class="bz"><div class="bz-h"><span class="bz-sp"></span><span class="bz-m"></span></div><div class="bz-bar"><i></i></div><div class="bz-s"><span class="bz-n">กรุณารอสักครู่ อย่าเพิ่งปิดหรือสลับหน้านี้</span><span class="bz-t"></span></div></div>';
  document.body.appendChild(el); return el;
}
function bzTime() { const s = Math.round((Date.now() - BZ.t0) / 1000); const t = $('#bzBox .bz-t'); if (t) t.textContent = s >= 2 ? s + ' วินาที' : ''; }
busy = function (on, msg) {
  const el = bzEl();
  document.body.style.cursor = on ? 'progress' : '';
  status(on ? msg : '');
  if (on) {
    if (!BZ.on) { BZ.on = true; BZ.t0 = Date.now(); BZ.saved = false; clearInterval(BZ.tick); BZ.tick = setInterval(bzTime, 500); }
    clearTimeout(BZ.hide); el.classList.remove('done'); el.classList.add('on');
    const m = String(msg || 'กำลังทำงาน…'), p = m.match(/(\d+)\s*\/\s*(\d+)/);
    el.querySelector('.bz-m').textContent = p ? m.replace(/\s*(หน้า|ส่วนที่)?\s*\d+\s*\/\s*\d+\s*$/, '') : m;
    const bar = el.querySelector('.bz-bar');
    bzTitle(p ? `(⏳ ${Math.round(+p[1] / +p[2] * 100)}%)` : '(⏳)');
    if (p) { const a = +p[1], b = +p[2]; bar.style.display = 'block'; bar.firstChild.style.width = Math.round(a / b * 100) + '%'; el.querySelector('.bz-n').textContent = (/หน้า/.test(m) ? 'หน้า ' : 'ส่วนที่ ') + a + ' จาก ' + b + ' (' + Math.round(a / b * 100) + '%)'; }
    else { bar.style.display = 'none'; el.querySelector('.bz-n').textContent = 'กรุณารอสักครู่ อย่าเพิ่งปิดหรือสลับหน้านี้'; }
    bzTime();
  } else {
    if (!BZ.on) return; BZ.on = false; clearInterval(BZ.tick); schedulePaginate();
    if (BZ.saved) { bzTitle('(✓ เสร็จ)'); setTimeout(() => bzTitle(''), document.hidden ? 60000 : 4000); if (document.hidden) { const back = () => { document.removeEventListener('visibilitychange', back); setTimeout(() => bzTitle(''), 4000); }; document.addEventListener('visibilitychange', back); } } else bzTitle('');
    if (BZ.saved) { el.classList.add('done'); el.querySelector('.bz-m').textContent = BZ.saved; el.querySelector('.bz-bar').style.display = 'none'; el.querySelector('.bz-n').textContent = 'ใช้เวลา ' + Math.max(1, Math.round((Date.now() - BZ.t0) / 1000)) + ' วินาที'; el.querySelector('.bz-t').textContent = ''; BZ.hide = setTimeout(() => el.classList.remove('on', 'done'), 1500); }
    else el.classList.remove('on', 'done');
  }
};
/* ทำงานหนักแบบมีหน้าต่างแจ้ง: แสดงก่อนแล้วค่อยเริ่มงาน เพื่อให้ข้อความขึ้นทันที */
async function withBusy(msg, fn) {
  const was = BZ.on; busy(true, msg); await paintNow();
  try { return await fn(); } finally { if (!was) busy(false); }
}
(function bzInit() {
  bzEl();
  // ไฟล์ที่ส่งออกบันทึกสำเร็จ → แสดง ✓ แจ้งเสร็จ
  const _sf = saveFile;
  saveFile = async function (name, data) { const r = await _sf(name, data); if (BZ.on && r !== false) BZ.saved = /\.pdf$/i.test(name) ? 'ส่งออก PDF เสร็จแล้ว' : /\.docx$/i.test(name) ? 'ส่งออกไฟล์ Word เสร็จแล้ว' : 'บันทึกไฟล์เสร็จแล้ว'; return r; };
  const _pdf = exportPDF;
  exportPDF = () => withBusy('กำลังเตรียมส่งออก PDF…', _pdf);
  const bp = $('#bPdf'); if (bp) bp.onclick = exportPDF;
  const _dx = exportDOCX;
  exportDOCX = () => withBusy('กำลังเตรียมส่งออกไฟล์ Word…', _dx);
  // เปิดงานจาก Drive
  if (typeof clOpen === 'function') { const _o = clOpen; clOpen = id => withBusy('กำลังเปิดงานจาก Google Drive…', () => _o(id)); }
  // สลับแท็บไปเอกสารที่ยาว
  if (typeof tabLoad === 'function') {
    const _tl = tabLoad;
    tabLoad = function (j) {
      const t = TB.list[j], big = t && t.doc && t.doc.blocks && t.doc.blocks.length > 60;
      if (!big) return _tl(j);
      busy(true, 'กำลังเปิดแท็บ “' + ((t.doc.settings && t.doc.settings.name) || 'เอกสาร') + '”');
      return paintNow().then(() => { try { _tl(j); } finally { busy(false); } });
    };
  }
})();

/* ---------- ฟอนต์: เลือกฟอนต์ของเอกสาร / ของข้อความ · เพิ่มฟอนต์ของตัวเอง · ฟอนต์ฟรีออนไลน์ ---------- */
const FONT_CAT = [ // ฟอนต์ฟรี (SIL OFL) จาก Fontsource — โหลดครั้งแรกแล้วเก็บไว้ในเครื่อง
  ['sarabun', 'Sarabun', 'ไม่มีหัว อ่านง่าย (คล้าย TH Sarabun)', [400, 700]],
  ['noto-sans-thai', 'Noto Sans Thai', 'ไม่มีหัว ทันสมัย', [400, 700]],
  ['noto-serif-thai', 'Noto Serif Thai', 'มีหัว แบบหนังสือ', [400, 700]],
  ['anuphan', 'Anuphan', 'ไม่มีหัว เรียบ', [400, 700]],
  ['ibm-plex-sans-thai', 'IBM Plex Sans Thai', 'ไม่มีหัว ทางการ', [400, 700]],
  ['kanit', 'Kanit', 'หัวเรื่อง โปสเตอร์', [400, 700]],
  ['prompt', 'Prompt', 'หัวเรื่อง กลม', [400, 700]],
  ['mitr', 'Mitr', 'หัวเรื่อง หนา', [400, 700]],
  ['chakra-petch', 'Chakra Petch', 'เหลี่ยม เทคโนโลยี', [400, 700]],
  ['bai-jamjuree', 'Bai Jamjuree', 'เหลี่ยม ทันสมัย', [400, 700]],
  ['k2d', 'K2D', 'ไม่มีหัว กว้าง', [400, 700]],
  ['niramit', 'Niramit', 'กึ่งลายมือ', [400, 700]],
  ['mali', 'Mali', 'ลายมือ น่ารัก', [400, 700]],
  ['pridi', 'Pridi', 'มีหัว คลาสสิก', [400, 700]],
  ['trirong', 'Trirong', 'มีหัว หนังสือพิมพ์', [400, 700]],
  ['charmonman', 'Charmonman', 'ตัวเขียน ลายมือสวย', [400, 700]],
  ['itim', 'Itim', 'ลายมือ กลม', [400]]
];
const FONT_ADJ = 78; // ฟอนต์สากลตัวใหญ่กว่าตระกูล TH → ย่อให้ขนาดใกล้เคียง TH Sarabun New
const FT = { list: [], warned: {} };
const fontStack = id => !id || id === 'THS' ? "'THS'" : `'NPF-${id}','THS'`;
const fontById = id => FT.list.find(f => f.id === id);
const fontLabel = id => !id || id === 'THS' ? 'TH Sarabun New' : (fontById(id) || {}).name || id;
const fontReal = id => !id || id === 'THS' ? 'TH Sarabun New' : (fontById(id) || {}).real || fontLabel(id);
async function fontsLoad() { try { FT.list = (await tabIdbGet('fonts')) || []; } catch (e) { FT.list = []; } fontsCSS(); }
async function fontsSave() { try { await tabIdbSet('fonts', FT.list); } catch (e) { toast('บันทึกฟอนต์ในเครื่องไม่สำเร็จ'); } fontsCSS(); }
function fontsCSS() {
  let st = $('#npFonts'); if (!st) { st = document.createElement('style'); st.id = 'npFonts'; document.head.appendChild(st); }
  st.textContent = FT.list.map(f => f.faces.map(x => `@font-face{font-family:'NPF-${f.id}';src:url(${x.data});font-weight:${x.w};font-style:${x.it ? 'italic' : 'normal'};${f.adj && f.adj !== 100 ? `size-adjust:${f.adj}%;` : ''}font-display:block}`).join('\n')).join('\n');
  if (typeof CSS_CACHE !== 'undefined') CSS_CACHE = null;
  fontSelFill();
}
/* ฟอนต์ที่เอกสารนี้ใช้จริง (ใช้ตอนส่งออก PDF เพื่อไม่ฝังฟอนต์ที่ไม่ได้ใช้) */
function fontsUsed() { const s = new Set(); if (doc && doc.settings && doc.settings.font) s.add(doc.settings.font); const j = JSON.stringify(doc ? doc.blocks : []); (j.match(/data-font=\\"([^"\\]+)\\"/g) || []).forEach(m => s.add(m.replace(/^data-font=\\"|\\"$/g, ''))); return s; }
function fontCssKeep(t) { if (!/^@font-face/.test(t) || !/NPF-/.test(t)) return true; const m = /NPF-([^'"]+)/.exec(t); return !!m && fontsUsed().has(m[1]); }

/* ---- อ่านชื่อฟอนต์จากตาราง name ของไฟล์ TTF/OTF ---- */
function fontNameInfo(buf) {
  try {
    const v = new DataView(buf), n = v.getUint16(4); let off = -1, os2 = -1;
    for (let i = 0; i < n; i++) { const p = 12 + i * 16, tag = String.fromCharCode(v.getUint8(p), v.getUint8(p + 1), v.getUint8(p + 2), v.getUint8(p + 3)); if (tag === 'name') off = v.getUint32(p + 8); if (tag === 'OS/2') os2 = v.getUint32(p + 8); }
    const out = {}; if (os2 >= 0) { out.w = v.getUint16(os2 + 4); out.it = !!(v.getUint16(os2 + 62) & 1); }
    if (off < 0) return out;
    const cnt = v.getUint16(off + 2), so = off + v.getUint16(off + 4);
    for (let i = 0; i < cnt; i++) {
      const r = off + 6 + i * 12, pid = v.getUint16(r), nid = v.getUint16(r + 6), len = v.getUint16(r + 8), o = v.getUint16(r + 10);
      if (![1, 2, 4, 16, 17].includes(nid)) continue;
      let s = '';
      if (pid === 3 || pid === 0) { for (let k = 0; k < len; k += 2) s += String.fromCharCode(v.getUint16(so + o + k)); } else if (pid === 1) { for (let k = 0; k < len; k++) s += String.fromCharCode(v.getUint8(so + o + k)); } else continue;
      const key = { 1: 'fam', 2: 'sub', 4: 'full', 16: 'tfam', 17: 'tsub' }[nid]; if (!out[key] || pid === 3) out[key] = s;
    }
    return out;
  } catch (e) { return {}; }
}
const readBuf = f => new Promise((ok, no) => { const r = new FileReader(); r.onload = () => ok(r.result); r.onerror = no; r.readAsArrayBuffer(f); });
const bufURL = (buf, mime) => new Promise(ok => { const r = new FileReader(); r.onload = () => ok(r.result); r.readAsDataURL(new Blob([buf], { type: mime })); });
const fontMime = n => /\.woff2$/i.test(n) ? 'font/woff2' : /\.woff$/i.test(n) ? 'font/woff' : /\.otf$/i.test(n) ? 'font/otf' : 'font/ttf';
async function fontAddFiles(files) {
  const groups = {};
  for (const f of files) {
    if (!/\.(ttf|otf|woff2?)$/i.test(f.name)) { toast('รองรับไฟล์ฟอนต์ .ttf .otf .woff .woff2'); continue; }
    const buf = await readBuf(f), info = /\.(ttf|otf)$/i.test(f.name) ? fontNameInfo(buf) : {};
    const base = f.name.replace(/\.[^.]+$/, '');
    const sub = (info.tsub || info.sub || base).toLowerCase();
    const num = +((/(?:^|[-_ ])([1-9]00)(?:[-_ ]|$)/.exec(base) || [])[1] || 0);
    const bold = info.w ? info.w >= 600 : num ? num >= 600 : /bold|bd\b|หนา/i.test(sub + ' ' + base);
    const it = info.it !== undefined ? info.it : /italic|oblique|เอียง/i.test(sub + ' ' + base);
    const real = (info.tfam || info.fam || base.replace(/[-_ ](thai|latin-ext|latin|vietnamese)(?=[-_ ]|$)/gi, '').replace(/[-_ ][1-9]00(?=[-_ ]|$)/g, '').replace(/[\s_-]*(normal|bold\s*italic|bolditalic|bold|italic|regular|bd|it)$/i, '').replace(/[\s_-]*(normal|regular)$/i, '').replace(/[-_]+/g, ' ')).trim();
    (groups[real] = groups[real] || []).push({ w: bold ? 700 : 400, it, data: await bufURL(buf, fontMime(f.name)) });
  }
  let added = [];
  for (const [real, faces] of Object.entries(groups)) {
    let f = FT.list.find(x => x.real === real);
    if (!f) { f = { id: 'u' + Date.now().toString(36) + Math.random().toString(36).slice(2, 5), name: real, real, src: 'file', adj: 100, faces: [] }; FT.list.push(f); }
    faces.forEach(x => { f.faces = f.faces.filter(y => !(y.w === x.w && !!y.it === !!x.it)); f.faces.push(x); });
    f.mod = Date.now(); f.synced = false; added.push(real);
  }
  if (added.length) { await fontsSave(); toast('เพิ่มฟอนต์ ' + added.join(', ') + ' แล้ว'); fontSyncUp(); }
  return added;
}
async function fontAddCatalog(key) {
  const c = FONT_CAT.find(x => x[0] === key); if (!c) return;
  if (FT.list.find(f => f.src === 'cat' && f.key === key)) return fontById('c-' + key);
  const url = (sub, w) => `https://cdn.jsdelivr.net/npm/@fontsource/${key}@5.3.0/files/${key}-${sub}-${w}-normal.woff2`;
  const faces = [];
  try {
    await withBusy(`กำลังดาวน์โหลดฟอนต์ ${c[1]}…`, async () => {
      for (const w of c[3]) for (const sub of ['thai', 'latin']) { const r = await fetch(url(sub, w)); if (!r.ok) throw new Error(r.status); faces.push({ w, it: false, sub, data: await bufURL(await r.arrayBuffer(), 'font/woff2') }); }
    });
  } catch (e) { toast('ดาวน์โหลดฟอนต์ไม่สำเร็จ (ต้องต่ออินเทอร์เน็ต)'); return null; }
  const f = { id: 'c-' + key, key, name: c[1], real: c[1], src: 'cat', adj: FONT_ADJ, faces, mod: Date.now() };
  FT.list = FT.list.filter(x => x.id !== f.id); FT.list.push(f); await fontsSave(); toast('ติดตั้งฟอนต์ ' + c[1] + ' แล้ว'); return f;
}

/* ---- ใช้ฟอนต์ ---- */
function applyDocFont() { document.documentElement.style.setProperty('--dfont', fontStack(doc && doc.settings && doc.settings.font)); }
const _applySetF = applySettings;
applySettings = function () { _applySetF(); applyDocFont(); fontCheckMissing(); };
function setDocFont(id) { if (id === 'THS') delete doc.settings.font; else doc.settings.font = id; applySettings(); renderAll(); changed(true); }
function setTextFont(id) {
  restoreSel(); const ed = curEditable(); if (!ed) { toast('เลือกข้อความที่จะเปลี่ยนฟอนต์ก่อน'); return; }
  const sel = getSelection(); if (!sel.rangeCount || sel.isCollapsed) { toast('ลากเลือกข้อความก่อน แล้วค่อยเลือกฟอนต์'); return; }
  document.execCommand('styleWithCSS', false, false);
  document.execCommand('fontName', false, 'NPTMPFONT');
  $$('font[face="NPTMPFONT"]', ed).forEach(f => { const sp = document.createElement('span'); if (id !== 'DOC') { sp.dataset.font = id; sp.style.fontFamily = fontStack(id).replace(/'/g, '"'); } sp.innerHTML = f.innerHTML; f.replaceWith(sp); });
  $$('span[style*="NPTMPFONT"]', ed).forEach(sp => { sp.style.fontFamily = id === 'DOC' ? '' : fontStack(id).replace(/'/g, '"'); if (id === 'DOC') delete sp.dataset.font; else sp.dataset.font = id; });
  if (id === 'DOC') $$('span[data-font]', ed).forEach(sp => { if (sel.containsNode(sp, true)) { sp.style.fontFamily = ''; delete sp.dataset.font; } });
  syncFrom(ed);
}
function fontSelFill() {
  const s = $('#fFont'); if (!s) return;
  s.innerHTML = '<option value="">ฟอนต์</option><option value="DOC">ฟอนต์ของเอกสาร</option><option value="THS">TH Sarabun New</option>' + FT.list.map(f => `<option value="${f.id}">${esc(f.name)}</option>`).join('') + '<option value="MANAGE">＋ เพิ่ม / จัดการฟอนต์…</option>';
}
function fontCheckMissing() {
  if (!doc) return; const miss = [...fontsUsed()].filter(id => id !== 'THS' && !fontById(id) && !FT.warned[id]); if (!miss.length) return;
  miss.forEach(id => FT.warned[id] = 1);
  const cat = miss.filter(id => /^c-/.test(id)).map(id => id.slice(2));
  cat.forEach(k => fontAddCatalog(k).then(f => { if (f) { applyDocFont(); schedulePaginate(); } }));
  const own = miss.filter(id => !/^c-/.test(id));
  if (own.length) setTimeout(() => toast('เอกสารนี้ใช้ฟอนต์ที่เพิ่มจากเครื่องอื่น · เข้าสู่ระบบ Drive เพื่อซิงก์ฟอนต์ หรือเพิ่มไฟล์ฟอนต์ในเครื่องนี้ (ตอนนี้แสดงเป็น TH Sarabun New)', 5000), 1500);
}

/* ---- ซิงก์ฟอนต์ที่เพิ่มเองผ่าน Google Drive (ใช้ได้ทุกเครื่องที่ล็อกอินบัญชีเดียวกัน) ---- */
async function fontSyncUp() {
  if (typeof CLD === 'undefined' || !CLD.user || !tokOk()) return;
  try {
    const root = await ensureRoot();
    for (const f of FT.list.filter(x => x.src === 'file' && !x.synced)) {
      const md = { name: 'ฟอนต์ ' + f.name + '.npfont', mimeType: 'application/json', appProperties: { np: 'font', fid: f.id, mod: String(f.mod || 0) } };
      if (!f.drive) md.parents = [root];
      const bd = 'np' + Math.random().toString(36).slice(2);
      const body = new Blob([`--${bd}\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n${JSON.stringify(md)}\r\n--${bd}\r\nContent-Type: application/json\r\n\r\n`, JSON.stringify(f), `\r\n--${bd}--`]);
      const r = await gd((f.drive ? DUP + '/' + f.drive : DUP) + '?uploadType=multipart&fields=id', { method: f.drive ? 'PATCH' : 'POST', headers: { 'Content-Type': 'multipart/related; boundary=' + bd }, body });
      f.drive = r.id; f.synced = true;
    }
    await tabIdbSet('fonts', FT.list);
  } catch (e) { console.warn('font sync up', e); }
}
async function fontSyncDown() {
  if (typeof CLD === 'undefined' || !CLD.user || !tokOk()) return;
  try {
    const r = await gd(DRIVE + '?' + gq({ q: "appProperties has { key='np' and value='font' } and trashed=false", fields: 'files(id,appProperties)', spaces: 'drive' }));
    let got = 0;
    for (const x of r.files || []) {
      const a = x.appProperties || {}, have = FT.list.find(f => f.id === a.fid);
      if (have && (have.mod || 0) >= (+a.mod || 0)) { if (!have.drive) { have.drive = x.id; have.synced = true; } continue; }
      const f = await gd(DRIVE + '/' + x.id + '?alt=media'); if (!f || !f.faces) continue;
      f.drive = x.id; f.synced = true; FT.list = FT.list.filter(y => y.id !== f.id); FT.list.push(f); got++;
    }
    if (got) { await fontsSave(); applyDocFont(); schedulePaginate(); toast('ซิงก์ฟอนต์จาก Drive แล้ว ' + got + ' ฟอนต์'); }
    await fontSyncUp();
  } catch (e) { console.warn('font sync down', e); }
}
async function fontDelete(id) {
  const f = fontById(id); if (!f) return;
  if (!(await ask('ลบฟอนต์', `<p>ลบฟอนต์ “${esc(f.name)}” ออกจากเครื่องนี้${f.drive ? 'และจาก Drive' : ''}ไหม</p><p>เอกสารที่ใช้ฟอนต์นี้จะแสดงเป็น TH Sarabun New แทน</p>`, 'ลบฟอนต์'))) return;
  FT.list = FT.list.filter(x => x.id !== id); await fontsSave();
  if (f.drive && typeof CLD !== 'undefined' && CLD.user && tokOk()) { try { await gd(DRIVE + '/' + f.drive, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ trashed: true }) }); } catch (e) { } }
  applyDocFont(); schedulePaginate(); openFonts();
}

/* ---- หน้าต่างจัดการฟอนต์ ---- */
function openFonts(onPick) {
  let d = $('#dFonts');
  if (!d) {
    d = document.createElement('div'); d.className = 'dlg-back'; d.id = 'dFonts';
    d.innerHTML = `<div class="dlg" style="width:760px;max-height:92vh;overflow:auto"><h3>ฟอนต์</h3><div id="fnBody"></div><div class="actions"><button class="tb primary" id="fnOk">เสร็จ</button></div></div>`;
    document.body.appendChild(d); $('#fnOk').onclick = () => closeDlg('#dFonts');
    const css = document.createElement('style');
    css.textContent = `#fnBody h4{margin:12px 0 6px}#fnBody .fn-row{display:flex;align-items:center;gap:10px;padding:7px 10px;border:1px solid var(--ui-line);border-radius:9px;margin-bottom:6px;background:#fff}
#fnBody .fn-row.on{border-color:var(--ui-accent);box-shadow:0 0 0 2px #7a3e1022}#fnBody .fn-n{width:190px;flex:none;font-size:17px}#fnBody .fn-n small{display:block;color:#8a8178;font-size:13px}
#fnBody .fn-pv{flex:1;min-width:0;font-size:24px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}#fnBody .fn-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(210px,1fr));gap:6px}
#fnBody .fn-cat{display:flex;justify-content:space-between;align-items:center;gap:6px;padding:6px 10px;border:1px dashed var(--ui-line);border-radius:9px;font-size:16px}#fnBody .fn-cat small{display:block;color:#8a8178;font-size:13px}
#fnBody .fn-drop{border:2px dashed var(--ui-line);border-radius:12px;padding:14px;text-align:center;color:#6b6259;background:#fbf8f4}#fnBody .fn-drop.hov{border-color:var(--ui-accent);background:#f6eee5}`;
    document.head.appendChild(css);
  }
  const cur = doc.settings.font || 'THS', PV = 'กขฃค ฎฏ ปี่ป้า ๑๒๓ ABC 123';
  const row = (id, name, sub, x) => `<div class="fn-row${cur === id ? ' on' : ''}"><div class="fn-n">${esc(name)}<small>${sub}</small></div><div class="fn-pv" style="font-family:${fontStack(id).replace(/'/g, '&quot;')}">${PV}</div>
    <button class="tb" data-doc="${id}">${cur === id ? '✓ ใช้ทั้งเอกสาร' : 'ใช้ทั้งเอกสาร'}</button>${x || ''}</div>`;
  const own = FT.list.map(f => row(f.id, f.name, f.src === 'cat' ? 'ฟอนต์ฟรีออนไลน์' : (f.faces.some(z => z.w >= 600) ? 'ปกติ + ตัวหนา' : 'ตัวปกติเท่านั้น') + (f.src === 'file' ? (f.synced ? ' · ซิงก์ Drive แล้ว' : ' · เฉพาะเครื่องนี้') : ''),
    `<label class="tb" title="ปรับขนาดให้ใกล้เคียงฟอนต์อื่น">ขนาด <input type="number" min="50" max="150" step="2" value="${f.adj || 100}" data-adj="${f.id}" style="width:56px">%</label><button class="tb" data-del="${f.id}" title="ลบฟอนต์">🗑</button>`)).join('');
  const cat = FONT_CAT.filter(c => !fontById('c-' + c[0])).map(c => `<div class="fn-cat"><span>${c[1]}<small>${c[2]}</small></span><button class="tb" data-cat="${c[0]}">ติดตั้ง</button></div>`).join('');
  $('#fnBody').innerHTML = `<h4>ฟอนต์ในเครื่องนี้</h4>${row('THS', 'TH Sarabun New', 'ฟอนต์มาตรฐานของแอป')}${own}
    <h4>เพิ่มฟอนต์ของตัวเอง (เช่น TH SarabunIT๙, TH Niramit AS, TH Charm of AU)</h4>
    <div class="fn-drop" id="fnDrop">ลากไฟล์ฟอนต์มาวางที่นี่ หรือ <label class="tb primary" style="display:inline-flex">เลือกไฟล์ฟอนต์…<input type="file" id="fnFile" accept=".ttf,.otf,.woff,.woff2" multiple hidden></label>
      <div style="font-size:14px;margin-top:6px">เลือกได้หลายไฟล์พร้อมกัน (ตัวปกติ ตัวหนา ตัวเอียง) · แอปอ่านชื่อฟอนต์และน้ำหนักจากไฟล์ให้เอง${typeof CLD !== 'undefined' && CLD.user ? ' · ซิงก์ไปเครื่องอื่นผ่าน Google Drive อัตโนมัติ' : ' · ล็อกอิน Drive เพื่อให้ใช้ได้ทุกเครื่อง'}</div></div>
    ${cat ? `<h4>ฟอนต์ฟรีออนไลน์ (ดาวน์โหลดครั้งเดียว ใช้ออฟไลน์ได้)</h4><div class="fn-grid">${cat}</div>` : ''}
    <p style="font-size:14px;color:#8a8178;margin:10px 0 0">เปลี่ยนฟอนต์เฉพาะบางคำ: ลากเลือกข้อความ แล้วเลือกจากช่อง “ฟอนต์” บนแถบจัดรูปแบบ · ไฟล์ Word จะใช้ชื่อฟอนต์เดียวกัน (เครื่องที่เปิดต้องมีฟอนต์นั้น)</p>`;
  const B = $('#fnBody');
  B.onclick = async e => {
    const t = e.target.closest('button'); if (!t) return;
    if (t.dataset.doc) { setDocFont(t.dataset.doc); if (onPick) onPick(t.dataset.doc); openFonts(onPick); }
    else if (t.dataset.del) fontDelete(t.dataset.del);
    else if (t.dataset.cat) { const f = await fontAddCatalog(t.dataset.cat); openFonts(onPick); }
  };
  $$('[data-adj]', B).forEach(i => i.onchange = async () => { const f = fontById(i.dataset.adj); if (!f) return; f.adj = Math.max(50, Math.min(150, +i.value || 100)); f.mod = Date.now(); f.synced = f.src !== 'file'; await fontsSave(); schedulePaginate(); fontSyncUp(); });
  $('#fnFile').onchange = async e => { const fs = [...e.target.files]; e.target.value = ''; if (fs.length) { await fontAddFiles(fs); openFonts(onPick); } };
  const dp = $('#fnDrop');
  dp.ondragover = e => { e.preventDefault(); dp.classList.add('hov'); }; dp.ondragleave = () => dp.classList.remove('hov');
  dp.ondrop = async e => { e.preventDefault(); dp.classList.remove('hov'); const fs = [...e.dataTransfer.files]; if (fs.length) { await fontAddFiles(fs); openFonts(onPick); } };
  openDlg('#dFonts');
}

(async function fontsInit() {
  // ช่องเลือกฟอนต์บนแถบจัดรูปแบบ
  const fsz = $('#fSize');
  if (fsz && !$('#fFont')) {
    const s = document.createElement('select'); s.id = 'fFont'; s.title = 'ฟอนต์ของข้อความที่เลือก'; s.style.maxWidth = '150px'; fsz.before(s);
    s.addEventListener('mousedown', () => { const ed = curEditable(); if (ed && getSelection().rangeCount) lastRange = getSelection().getRangeAt(0).cloneRange(); });
    s.onchange = () => { const v = s.value; s.value = ''; if (!v) return; if (v === 'MANAGE') { openFonts(); return; } setTextFont(v); };
  }
  // ปุ่มในหน้าตั้งค่าเอกสาร
  const sz = $('#sSize');
  if (sz && !$('#sFontRow')) {
    const r = document.createElement('div'); r.className = 'row'; r.id = 'sFontRow';
    r.innerHTML = '<label style="width:140px">ฟอนต์ของเอกสาร</label><span id="sFontName" style="font-weight:700;min-width:150px"></span><button class="tb" id="sFontBtn">เลือก / เพิ่มฟอนต์…</button>';
    sz.closest('.row').before(r);
    $('#sFontBtn').onclick = () => openFonts(() => { $('#sFontName').textContent = fontLabel(doc.settings.font); });
    const _os = openSettings; openSettings = function () { _os(); $('#sFontName').textContent = fontLabel(doc.settings.font); };
  }
  await fontsLoad(); applyDocFont(); schedulePaginate(); fontCheckMissing();
  // ล็อกอิน Drive แล้ว → ซิงก์ฟอนต์
  if (typeof clRefresh === 'function') { const _r = clRefresh; clRefresh = async function () { const x = await _r.apply(this, arguments); fontSyncDown(); return x; }; }
  if (typeof CLD !== 'undefined' && CLD.loaded) fontSyncDown();
})();
if (document.fonts && document.fonts.addEventListener) document.fonts.addEventListener('loadingdone', () => schedulePaginate());

