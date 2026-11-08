// Boot: Firebase init, Google sign-in, membership check, and a small adapter that gives
// app.js the same data API it used inside Claude (db / user / assets / downloads).
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js';
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithRedirect, getRedirectResult, onAuthStateChanged, signOut }
  from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js';
import { initializeFirestore, persistentLocalCache, persistentMultipleTabManager, doc as fdoc, collection as fcol,
  setDoc, updateDoc, deleteDoc, getDoc, getDocs, onSnapshot, query, where, orderBy, limit as flimit }
  from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';
import { getMessaging, getToken, onMessage, isSupported } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging.js';
import { CONFIG, VAPID } from './config.js';

const fbApp = initializeApp(CONFIG);
const auth = getAuth(fbApp);
const fs = initializeFirestore(fbApp, { localCache: persistentLocalCache({ tabManager: persistentMultipleTabManager() }) });

let swReg = null;
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./sw.js').then(r => { swReg = r; }).catch(() => {});
}
let installEvt = null;
window.addEventListener('beforeinstallprompt', e => {
  e.preventDefault(); installEvt = e;
  const b = document.querySelector('#installBtn'); if (b) b.hidden = false;
});
window.addEventListener('appinstalled', () => { installEvt = null; const b = document.querySelector('#installBtn'); if (b) b.hidden = true; });

const $ = s => document.querySelector(s);
const gate = (msg, { signin = false, signout = false } = {}) => {
  $('#gate').hidden = false; $('#appRoot').hidden = true;
  $('#gateMsg').textContent = msg; $('#signinBtn').hidden = !signin; $('#signoutBtn').hidden = !signout;
};

/* ---------- data adapter ---------- */
const errOf = e => ({ code: e?.code === 'permission-denied' ? 'invalid_argument' : e?.code === 'resource-exhausted' ? 'quota_exceeded' : 'unavailable', message: e?.message || String(e) });
const clean = o => JSON.parse(JSON.stringify(o)); // drops undefined values, which Firestore rejects
// Writes resolve as soon as they are applied locally, so the app keeps working offline;
// a later server rejection is reported through an event the app listens to.
const fire = p => { p.catch(e => window.dispatchEvent(new CustomEvent('tt-write-error', { detail: errOf(e) }))); return Promise.resolve(); };
const meta = m => ({ fromCache: m.fromCache, hasPendingWrites: m.hasPendingWrites });
const wrapDoc = s => ({ id: s.id, exists: s.exists(), data: () => (s.exists() ? s.data() : undefined), metadata: meta(s.metadata) });
const wrapQuery = qs => { const docs = qs.docs.map(wrapDoc); return { docs, size: docs.length, empty: !docs.length, metadata: meta(qs.metadata), docChanges: () => [] }; };
function docRef(path) {
  const r = fdoc(fs, path);
  return {
    id: r.id, path: r.path,
    get: async () => wrapDoc(await getDoc(r)),
    set: d => fire(setDoc(r, clean(d))),
    update: d => fire(updateDoc(r, clean(d))),
    delete: () => fire(deleteDoc(r)),
    onSnapshot: (next, error) => onSnapshot(r, s => next(wrapDoc(s)), x => error && error(errOf(x))),
    collection: p => colRef(r.path + '/' + p),
  };
}
function qWrap(base, cons) {
  const q = () => (cons.length ? query(base, ...cons) : base);
  return {
    where: (f, op, v) => qWrap(base, [...cons, where(f, op, v)]),
    orderBy: (f, dir) => qWrap(base, [...cons, orderBy(f, dir || 'asc')]),
    limit: n => qWrap(base, [...cons, flimit(n)]),
    get: async () => wrapQuery(await getDocs(q())),
    onSnapshot: (next, error) => onSnapshot(q(), s => next(wrapQuery(s)), x => error && error(errOf(x))),
  };
}
function colRef(path) {
  const c = fcol(fs, path);
  return { ...qWrap(c, []), path: c.path,
    doc: id => docRef(id ? c.path + '/' + id : fdoc(c).path),
    add: async d => { const r = docRef(fdoc(c).path); await r.set(d); return r; } };
}
const dbShim = { doc: docRef, collection: colRef };

let me = null, role = 'none';
const names = {};
const userShim = {
  id: async () => me?.uid || null,
  me: async () => ({ id: me?.uid, name: me?.displayName || '' }),
  isOwner: () => role === 'owner',
  canEdit: () => role === 'owner' || role === 'editor',
  can: async n => (n === 'data.write' ? (role === 'owner' || role === 'editor') : null),
  profiles: async ids => {
    const out = {};
    for (const id of ids) {
      if (!(id in names)) { try { const s = await getDoc(fdoc(fs, 'people/' + id)); names[id] = s.exists() ? (s.data().name || '') : ''; } catch (e) { names[id] = ''; } }
      out[id] = { name: names[id] };
    }
    return out;
  },
};
// Photos are shrunk to a small JPEG and stored inline in the settings document (no file storage needed).
const assetsShim = {
  upload: file => new Promise((res, rej) => {
    const img = new Image(); const url = URL.createObjectURL(file);
    img.onload = () => { const s = 256, c = document.createElement('canvas'); const r = Math.min(1, s / Math.max(img.width, img.height));
      c.width = Math.round(img.width * r); c.height = Math.round(img.height * r); c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
      URL.revokeObjectURL(url); res({ id: 'inline', url: c.toDataURL('image/jpeg', 0.82) }); };
    img.onerror = () => rej(new Error('bad image')); img.src = url;
  }),
};
const downloadsShim = {
  save: async ({ filename, data }) => {
    const blob = data instanceof Blob ? data : new Blob([data], { type: 'text/html;charset=utf-8' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = filename; document.body.appendChild(a); a.click();
    setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 2000);
  },
};
window.claude = { use: async n => ({ db: dbShim, user: userShim, assets: assetsShim, downloads: downloadsShim })[n] || null };

/* ---------- app-level hooks used by settings ---------- */
window.TT = {
  role: () => role,
  email: () => me?.email || '',
  signOut: () => signOut(auth).then(() => location.reload()),
  canInstall: () => !!installEvt,
  install: async () => { if (!installEvt) return false; installEvt.prompt(); const r = await installEvt.userChoice; installEvt = null; return r.outcome === 'accepted'; },
  pushStatus: () => {
    if (!('Notification' in window)) return 'unsupported';
    if (Notification.permission === 'granted') { try { return localStorage.getItem('pushToken') ? 'on' : 'granted'; } catch (e) { return 'granted'; } }
    return Notification.permission; // 'default' | 'denied'
  },
  enablePush: async () => {
    if (!(await isSupported())) throw new Error('unsupported');
    const perm = await Notification.requestPermission();
    if (perm !== 'granted') throw new Error('denied');
    const reg = swReg || await navigator.serviceWorker.ready;
    const token = await getToken(getMessaging(fbApp), { vapidKey: VAPID, serviceWorkerRegistration: reg });
    await setDoc(fdoc(fs, 'tokens/' + token), { uid: me.uid, email: me.email, created: Date.now(), ua: navigator.userAgent.slice(0, 120) });
    try { localStorage.setItem('pushToken', token); } catch (e) {}
    return true;
  },
  getMembers: async () => { const s = await getDoc(fdoc(fs, 'meta/members')); return s.exists() ? s.data() : null; },
  setMembers: m => setDoc(fdoc(fs, 'meta/members'), m),
};

/* ---------- sign-in ---------- */
const provider = new GoogleAuthProvider();
provider.setCustomParameters({ prompt: 'select_account' });
$('#signinBtn').onclick = async () => {
  try { await signInWithPopup(auth, provider); }
  catch (e) {
    if (e?.code === 'auth/popup-blocked' || e?.code === 'auth/operation-not-supported-in-this-environment') { await signInWithRedirect(auth, provider); return; }
    if (e?.code !== 'auth/popup-closed-by-user' && e?.code !== 'auth/cancelled-popup-request') gate('הכניסה לא הצליחה. נסו שוב.', { signin: true });
  }
};
$('#signoutBtn').onclick = () => window.TT.signOut();
$('#installBtn').onclick = () => window.TT.install();
getRedirectResult(auth).catch(() => {});

async function resolveRole(u) {
  const email = (u.email || '').toLowerCase();
  try {
    const s = await getDoc(fdoc(fs, 'meta/members'));
    if (s.exists()) {
      const m = s.data();
      if ((m.owner || '').toLowerCase() === email) return 'owner';
      if ((m.editors || []).map(x => x.toLowerCase()).includes(email)) return 'editor';
      if ((m.viewers || []).map(x => x.toLowerCase()).includes(email)) return 'viewer';
      return 'none';
    }
    // First sign-in by the owner: create the member list. The security rules allow only the owner to do this.
    await setDoc(fdoc(fs, 'meta/members'), { owner: email, editors: [], viewers: [] });
    return 'owner';
  } catch (e) {
    if (e?.code === 'permission-denied') return 'none';
    throw e;
  }
}

let started = false;
onAuthStateChanged(auth, async u => {
  if (!u) { gate('כניסה עם חשבון Google שקיבל הרשאה.', { signin: true }); return; }
  me = u;
  if (started) return;
  gate('בודק הרשאה…');
  try { role = await resolveRole(u); }
  catch (e) { gate('אין חיבור לשרת. בכניסה הראשונה צריך אינטרנט.', { signout: true }); return; }
  if (role === 'none') { gate(`לחשבון ${u.email} אין הרשאה ליומן. אפשר לבקש מבעל היומן להוסיף את הכתובת הזו.`, { signout: true }); return; }
  fire(setDoc(fdoc(fs, 'people/' + u.uid), { name: u.displayName || '', email: (u.email || '').toLowerCase(), seen: Date.now() }));
  started = true;
  $('#gate').hidden = true; $('#appRoot').hidden = false;
  const s = document.createElement('script'); s.src = 'app.js?v=15'; document.body.appendChild(s);
  isSupported().then(ok => { if (ok) onMessage(getMessaging(fbApp), p => window.dispatchEvent(new CustomEvent('tt-push', { detail: p.notification || {} }))); }).catch(() => {});
});
