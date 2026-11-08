/* כמו שתי טיפות מים · demo mode. No sign-in, no cloud: an in-memory database filled with example days.
   Everything the visitor logs lives only in this tab and is gone on reload. */
(() => {
const M = 6e4, H = 36e5, D = 864e5, now = Date.now();
const store = {};                    // path -> {id: data}
const listeners = new Set();
let seq = 0;
const coll = p => (store[p] ||= {});
const notify = () => setTimeout(() => listeners.forEach(f => f()), 0);
const clone = o => JSON.parse(JSON.stringify(o));
const OPS = { '>=': (a, b) => a >= b, '<=': (a, b) => a <= b, '>': (a, b) => a > b, '<': (a, b) => a < b, '==': (a, b) => a === b };

function docRef(path) {
  const i = path.lastIndexOf('/'), cp = path.slice(0, i), id = path.slice(i + 1);
  const snap = () => { const d = coll(cp)[id]; return { id, exists: !!d, data: () => (d ? clone(d) : undefined), metadata: { fromCache: false, hasPendingWrites: false } }; };
  return { id, path,
    get: async () => snap(),
    set: async d => { coll(cp)[id] = clone(d); notify(); },
    update: async d => { coll(cp)[id] = { ...(coll(cp)[id] || {}), ...clone(d) }; notify(); },
    delete: async () => { delete coll(cp)[id]; notify(); },
    onSnapshot: next => { const f = () => next(snap()); listeners.add(f); setTimeout(f, 0); return () => listeners.delete(f); },
    collection: p => colRef(path + '/' + p) };
}
function query(path, cons) {
  const run = () => {
    let rows = Object.entries(coll(path)).map(([id, d]) => ({ id, d }));
    for (const c of cons) if (c.w) rows = rows.filter(r => OPS[c.w[1]](r.d[c.w[0]], c.w[2]));
    const o = cons.find(c => c.o); if (o) rows.sort((x, y) => ((x.d[o.o[0]] ?? 0) - (y.d[o.o[0]] ?? 0)) * (o.o[1] === 'desc' ? -1 : 1));
    const l = cons.find(c => c.l); if (l) rows = rows.slice(0, l.l);
    const docs = rows.map(r => ({ id: r.id, exists: true, data: () => clone(r.d), metadata: { fromCache: false } }));
    return { docs, size: docs.length, empty: !docs.length, metadata: { fromCache: false, hasPendingWrites: false }, docChanges: () => [] };
  };
  return {
    where: (f, op, v) => query(path, [...cons, { w: [f, op, v] }]),
    orderBy: (f, dir) => query(path, [...cons, { o: [f, dir || 'asc'] }]),
    limit: n => query(path, [...cons, { l: n }]),
    get: async () => run(),
    onSnapshot: next => { const f = () => next(run()); listeners.add(f); setTimeout(f, 0); return () => listeners.delete(f); } };
}
function colRef(path) {
  return { ...query(path, []), path,
    doc: id => docRef(path + '/' + (id || ('d' + (++seq) + Math.random().toString(36).slice(2, 7)))),
    add: async d => { const r = docRef(path + '/d' + (++seq)); await r.set(d); return r; } };
}

/* ---------- example days: two parents, two babies about seven weeks old ---------- */
const TAHEL = 'demo-tahel', TAL = 'demo-tal';
const add = (p, d) => { coll(p)['s' + (++seq)] = d; };
const birth = new Date(now - 49 * D).toISOString().slice(0, 10);
coll('config').babies = { a: { name: 'תאום א׳', sex: 'boy', sideMode: 'alt', photo: null }, b: { name: 'תאומה ב׳', sex: 'girl', sideMode: 'alt', photo: null },
  birth, ga: '36', routineSync: false, th: { feeds: 8, wet: 6, noWetH: 8, feverC: 38 } };
const nightAt = t => { const h = new Date(t).getHours(); return h >= 19 || h < 7; };
// each twin: a rhythm of feed → diaper → sleep, shifted a little from the other
for (const [k, offset, bottle] of [['a', 100 * M, false], ['b', 150 * M, true]]) {
  let t = now - offset; const sides = ['L', 'R']; let i = 0;
  while (t > now - 60 * H) {
    const by = i % 3 ? TAHEL : TAL, night = nightAt(t);
    const feed = { type: 'feed', baby: k, t, by };
    if (bottle || i % 4 === 3) Object.assign(feed, { side: 'bottle', ml: [80, 90, 100, 110][i % 4], milk: i % 5 ? 'pumped' : 'formula' });
    else { const s = sides[i % 2]; Object.assign(feed, { side: s, [s === 'L' ? 'minsL' : 'minsR']: 12 + (i * 7) % 11 }); }
    add('events', feed);
    if (i % 2 === 0) add('events', { type: 'burp', baby: k, t: t + 14 * M, by });
    if (i % 5 === 2) add('events', { type: 'spit', baby: k, t: t + 22 * M, by });
    const dk = i % 4 === 1 ? 'dirty' : i % 6 === 2 ? 'mixed' : 'wet';
    if (i > 0) add('events', { type: 'diaper', baby: k, t: t + 25 * M, by: i % 2 ? TAL : TAHEL, kind: dk, ...(dk !== 'wet' ? { color: ['yellow', 'mustard', 'green'][i % 3], amount: ['light', 'medium', 'heavy'][i % 3] } : {}) });
    const gap = (night ? 3.4 : 2.8) * H + ((i * 13) % 20) * M;
    if (i > 0) { const s0 = t + 40 * M, s1 = t + gap - 15 * M; add('events', { type: 'sleep', baby: k, t: s0, end: s1, by, period: nightAt(s0) ? 'night' : 'day', loc: night ? 'crib' : ['bassinet', 'arms', 'stroller', 'crib'][i % 4] }); }
    t -= gap; i++;
  }
}
// right now: twin b fell asleep an hour ago, twin a is awake
add('events', { type: 'sleep', baby: 'b', t: now - 64 * M, end: null, by: TAHEL, period: nightAt(now - 64 * M) ? 'night' : 'day', loc: 'crib' });
add('events', { type: 'diaper', baby: 'a', t: now - 42 * M, by: TAL, kind: 'wet' });
add('events', { type: 'care', baby: 'a', t: now - 26 * H, care: 'bath', by: TAL });
add('events', { type: 'care', baby: 'b', t: now - 26 * H, care: 'bath', by: TAL });
add('events', { type: 'pump', baby: 'mom', t: now - 5 * H, side: 'both', ml: 140, by: TAHEL });
add('meds', { name: 'ויטמין D', dose: '400 יחב״ל', everyH: 24, babies: ['a', 'b'] });
for (const k of ['a', 'b']) for (const [d, w, len, head] of [[0, k === 'a' ? 2480 : 2310, 46, 32.5], [14, k === 'a' ? 2950 : 2760, 48, 33.6], [28, k === 'a' ? 3520 : 3290, 50.5, 34.8], [42, k === 'a' ? 4180 : 3880, 53, 36]])
  add('growth', { baby: k, date: new Date(now - (49 - d) * D).toISOString().slice(0, 10), w, len, head, note: d ? 'טיפת חלב' : 'בלידה' });
add('stock', { t: now - 20 * H, ml: 120, where: 'fridge', used: false });
add('stock', { t: now - 3 * D, ml: 150, where: 'freezer', used: false });

const names = { [TAHEL]: 'תהל', [TAL]: 'טל' };
const user = { id: async () => TAHEL, me: async () => ({ id: TAHEL, name: 'תהל' }), isOwner: () => true, canEdit: () => true,
  can: async n => (n === 'data.write' ? true : null), profiles: async ids => Object.fromEntries(ids.map(i => [i, { name: names[i] || '' }])) };
const assets = { upload: async f => ({ id: 'inline', url: URL.createObjectURL(f) }) };
window.claude = { use: async n => ({ db: { doc: docRef, collection: colRef }, user, assets })[n] || null };
window.TT = { role: () => 'owner', email: () => 'מצב הדגמה', signOut: () => location.reload(), canInstall: () => false, install: async () => false,
  pushStatus: () => 'unsupported', enablePush: async () => { throw new Error('unsupported'); }, getMembers: async () => ({ owner: '', editors: [], viewers: [] }), setMembers: async () => {} };
document.getElementById('gate')?.setAttribute('hidden', '');
document.getElementById('appRoot')?.removeAttribute('hidden');
const s = document.createElement('script'); s.src = 'app.js?v=16'; document.body.appendChild(s);
})();
