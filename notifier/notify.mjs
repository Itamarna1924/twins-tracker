// Runs on GitHub Actions every ~10 minutes: reads the log, sends due reminders as push notifications.
import admin from 'firebase-admin';
import { computeReminders, dueToSend } from './reminders.mjs';

const sa = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT || '{}');
if (!sa.project_id) { console.error('FIREBASE_SERVICE_ACCOUNT secret is missing.'); process.exit(1); }
admin.initializeApp({ credential: admin.credential.cert(sa) });
const db = admin.firestore();
const APP_URL = (process.env.APP_URL || '').replace(/\/?$/, '/');
const now = Date.now(), H = 36e5;

const all = async name => (await db.collection(name).get()).docs.map(d => ({ id: d.id, ...d.data() }));
const cfgSnap = await db.doc('config/babies').get();
const cfg = cfgSnap.exists ? cfgSnap.data() : {};
const events = (await db.collection('events').where('t', '>=', now - 48 * H).get()).docs.map(d => ({ id: d.id, ...d.data() }));
const timers = Object.fromEntries((await all('timers')).map(t => [t.id, t]));
const [meds, inv] = await Promise.all([all('meds'), all('inv')]);

const reminders = computeReminders({ cfg, events, timers, meds, inv, now });
const notRef = db.doc('meta/notified');
const sent = (await notRef.get()).data()?.sent || {};
const due = dueToSend(reminders, sent, now);
console.log(`reminders: ${reminders.length}, due: ${due.length}`);

const tokenDocs = (await db.collection('tokens').get()).docs;
const tokens = tokenDocs.map(d => d.id);
if (due.length && tokens.length) {
  const dead = new Set();
  for (const r of due) {
    const res = await admin.messaging().sendEachForMulticast({
      tokens,
      notification: { title: r.title, body: r.body },
      webpush: {
        notification: { icon: APP_URL + 'icons/icon-192.png', badge: APP_URL + 'icons/icon-192.png', tag: r.tag, renotify: true,
          requireInteraction: !!r.urgent, dir: 'rtl', lang: 'he' },
        ...(APP_URL.startsWith('https://') ? { fcmOptions: { link: APP_URL } } : {}),
        headers: { Urgency: r.urgent ? 'high' : 'normal', TTL: '3600' },
      },
    });
    res.responses.forEach((x, i) => {
      const code = x.error?.code || '';
      if (!x.success && (code.includes('registration-token-not-registered') || code.includes('invalid-registration-token') || code.includes('invalid-argument'))) dead.add(tokens[i]);
    });
    console.log(`sent "${r.tag}": ${res.successCount} ok, ${res.failureCount} failed`);
    sent[r.key] = now;
  }
  for (const t of dead) await db.doc('tokens/' + t).delete();
}
// Forget keys older than 3 days so the document stays small.
for (const k of Object.keys(sent)) if (now - sent[k] > 72 * H) delete sent[k];
await notRef.set({ sent, lastRun: now });
process.exit(0);
