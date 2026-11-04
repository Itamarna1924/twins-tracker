// Pure reminder logic: given the current data, return the reminders that apply right now.
// Each reminder has a stable `key`; the runner uses it to avoid sending the same thing twice.
const H = 36e5, M = 6e4;
const pad = n => String(n).padStart(2, '0');
export const fmt = t => new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Jerusalem', hour: '2-digit', minute: '2-digit', hour12: false }).format(new Date(t));
export const dur = ms => { const m = Math.max(0, Math.round(ms / M)); return m < 60 ? m + ' דק׳' : Math.floor(m / 60) + ':' + pad(m % 60) + ' ש׳'; };

export function computeReminders({ cfg = {}, events = [], timers = {}, meds = [], inv = [], now = Date.now() }) {
  const nm = k => (k === 'mom' ? 'אמא' : (cfg[k]?.name || (k === 'a' ? 'תאום א׳' : 'תאום ב׳')));
  const th = { feeds: 8, wet: 6, noWetH: 8, feverC: 38, ...(cfg.th || {}) };
  const rem = { on: true, feedH: 3, meds: true, ...(cfg.remind || {}) };
  if (rem.on === false) return [];
  const evs = [...events].sort((a, b) => b.t - a.t);
  const ageDays = cfg.birth ? Math.floor((now - Date.parse(cfg.birth + 'T00:00:00+02:00')) / 864e5) : null;
  const out = [];
  for (const k of ['a', 'b']) {
    const ev = evs.filter(e => e.baby === k);
    const f = ev.find(e => e.type === 'feed');
    if (f && !timers[k] && now - f.t > (+rem.feedH || 3) * H)
      out.push({ key: `feed-${k}-${f.id}`, tag: `feed-${k}`, title: `האכלה · ${nm(k)}`, body: `עברו ${dur(now - f.t)} מההאכלה האחרונה (${fmt(f.t)})` });
    const w = ev.find(e => e.type === 'diaper' && (e.kind === 'wet' || e.kind === 'mixed'));
    if (w && now - w.t > (+th.noWetH || 8) * H)
      out.push({ key: `wet-${k}-${w.id}`, tag: `wet-${k}`, title: `חיתול · ${nm(k)}`, body: `אין חיתול רטוב כבר ${dur(now - w.t)}` });
    const tp = ev.find(e => e.type === 'temp' && now - e.t < 3 * H && +e.c >= +th.feverC);
    if (tp) out.push({ key: `fever-${tp.id}`, tag: `fever-${k}`, urgent: true, once: true, title: `חום ${tp.c}° · ${nm(k)}`,
      body: ageDays != null && ageDays < 90 ? 'מתחת לגיל 3 חודשים: לפנות לרופא עכשיו.' : 'לפעול לפי הנחיות רופא הילדים.' });
    const st = ev.find(e => e.type === 'diaper' && now - e.t < 3 * H && (e.color === 'pale' || e.color === 'red'));
    if (st) out.push({ key: `stool-${st.id}`, tag: `stool-${k}`, urgent: true, once: true, title: `צואה חריגה · ${nm(k)}`,
      body: (st.color === 'pale' ? 'צבע לבן או אפור' : 'דם בצואה') + '. לפנות לרופא.' });
  }
  if (rem.meds !== false) for (const m of meds) for (const k of (m.babies || [])) {
    const last = evs.find(e => e.type === 'med' && e.medId === m.id && e.baby === k);
    const every = (+m.everyH || 24) * H;
    if (!last || now - last.t >= every)
      out.push({ key: `med-${m.id}-${k}-${last ? last.id : 'none'}`, tag: `med-${m.id}-${k}`, repeatMin: last ? 60 : 12 * 60,
        title: `${m.name} · ${nm(k)}`, body: last ? `הגיע הזמן. ניתן לאחרונה ב־${fmt(last.t)}` : 'לא נרשם שניתן ב־48 השעות האחרונות' });
  }
  const low = inv.filter(i => (+i.qty || 0) <= (+i.low || 0)).map(i => i.name);
  const hourIL = +fmt(now).slice(0, 2);
  if (low.length && hourIL >= 9 && hourIL < 21) {
    const day = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Jerusalem' }).format(new Date(now));
    out.push({ key: `inv-${day}`, tag: 'inv', once: true, title: 'עומד להיגמר', body: low.join(', ') });
  }
  return out.sort((a, b) => (b.urgent ? 1 : 0) - (a.urgent ? 1 : 0));
}

// Which of the current reminders should be sent now, given when each key was last sent.
export function dueToSend(reminders, sent = {}, now = Date.now(), repeatMin = 60) {
  return reminders.filter(r => {
    const last = sent[r.key];
    if (!last) return true;
    if (r.once) return false;
    return now - last >= (r.repeatMin || repeatMin) * M;
  });
}
