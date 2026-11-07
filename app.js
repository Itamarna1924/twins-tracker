
(() => {
const $ = s => document.querySelector(s);
const H=36e5, D=864e5, M=6e4;
const SV = p => `<svg class="i" viewBox="0 0 24 24">${p}</svg>`;
const ICON = {
  feed:'<path d="M9 2h6M10 2v3l-2 3v12a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2V8l-2-3V2"/><path d="M8 12h8"/>',
  nurse:'<circle cx="12" cy="13" r="8"/><path d="M12 9v4l3 2M10 2h4"/>',
  diaper:'<path d="M3 7h18v3a9 9 0 0 1-18 0z"/><path d="M8 10.5c1 2 3 3 4 3s3-1 4-3"/>',
  sleep:'<path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z"/>',
  wake:'<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5 19 19M5 19l1.5-1.5M17.5 6.5 19 5"/>',
  now:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  list:'<path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/>',
  sum:'<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',
  health:'<path d="M12 21s-8-4.5-8-11a5 5 0 0 1 8-4 5 5 0 0 1 8 4c0 6.5-8 11-8 11z"/><path d="M12 9v6M9 12h6"/>',
  milk:'<path d="M8 2h8M9 2v4L6 10v10a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V10l-3-4V2"/><path d="M6 14h12"/>',
  drops:'<path d="M9 3C9 3 4 9 4 12.5a5 5 0 0 0 10 0C14 9 9 3 9 3Z"/><path d="M16 7c0 0-3.5 4-3.5 6.5"/><path d="M16 7c0 0 4 4.4 4 7a4 4 0 0 1-6.6 3"/>',
  more:'<circle cx="5" cy="12" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="19" cy="12" r="1.5"/>'
};
const ALLERGENS = {milk:'חלב פרה', egg:'ביצה', peanut:'בוטנים', nuts:'אגוזים', sesame:'שומשום', wheat:'חיטה', soy:'סויה', fish:'דגים', shellfish:'פירות ים'};
const REACT = {none:'ללא תגובה', mild:'תגובה קלה', strong:'תגובה משמעותית'};
const MOODS = [[5,'טוב מאוד'],[4,'טוב'],[3,'ככה ככה'],[2,'קשה'],[1,'קשה מאוד']];
const COMMON_INV = [['חיתולים','יח׳',30],['מגבונים','חבילות',2],['תמ״ל','קופסאות',1],['משחת החתלה','יח׳',1],['ויטמין D','בקבוקונים',1],['שקיות לאחסון חלב','יח׳',10]];
const ico = (k,cls='') => `<svg class="${cls}" viewBox="0 0 24 24">${ICON[k]}</svg>`;

const TYPE = {burp:'גרעפס', spit:'פליטה', feed:'האכלה', diaper:'חיתול', sleep:'שינה', pump:'שאיבה', med:'תרופה', temp:'חום', note:'הערה', care:'טיפול'};
const SIDE = {L:'שמאל', R:'ימין', both:'שני הצדדים', bottle:'בקבוק'};
const MILK = {pumped:'חלב שאוב', formula:'תמ״ל', special:'תמ״ל מיוחד', mixed:'מעורב'};
const DIAPER = {wet:'רטוב', dirty:'קקי', mixed:'רטוב+קקי', dry:'יבש'};
const DAMT = {light:'קל', medium:'בינוני', heavy:'כבד'};
const STOOL = {yellow:['צהוב','#e2b934'], mustard:['חרדל','#b8862b'], green:['ירוק','#6c8a3a'], brown:['חום','#7a5232'], black:['שחור / מקוניום','#2b2420'], red:['אדום / דם','#b23a2e'], pale:['לבן / אפור','#d9d6cf']};
const TEXTURE = {watery:'נוזלי', soft:'רך', seedy:'גרגירי', formed:'מוצק', mucus:'רירי'};
const SLOC = {crib:'מיטה', bassinet:'עריסה', stroller:'עגלה', arms:'על הידיים', carrier:'מנשא', car:'רכב', bed:'מיטת הורים'};
const SPOS = {back:'גב', side:'צד', tummy:'בטן'};
const PERIOD = {day:'יום', night:'לילה'};
const TMETH = {rectal:'פי הטבעת', axillary:'בית שחי', ear:'אוזן', forehead:'מצח'};
const CARE = {tummy:'זמן על הבטן', bath:'אמבטיה', nails:'גזירת ציפורניים', cord:'טיפול בטבור', jaundice:'צהבת'};
const WHERE = {fridge:'מקרר', freezer:'מקפיא', thawed:'מופשר (מקרר)'};

/* WHO Child Growth Standards (2006), LMS by age in days: weekly 0–13 wk, monthly 4–24 mo. Source tables: WHO expanded tables via the pygrowup package. */
const WHO={"wfa_boys":[[0,0.3487,3.3464,0.14602],[7,0.2776,3.4879,0.14483],[14,0.2581,3.7529,0.14142],[21,0.2442,4.0603,0.13807],[28,0.2331,4.3671,0.13497],[35,0.2237,4.659,0.13215],[42,0.2155,4.9303,0.1296],[49,0.2081,5.1817,0.12729],[56,0.2014,5.4149,0.1252],[63,0.1952,5.6319,0.1233],[70,0.1894,5.8346,0.12157],[77,0.184,6.0242,0.12001],[84,0.1789,6.2019,0.1186],[91,0.174,6.369,0.11732],[122,0.1553,7.0023,0.11316],[152,0.1395,7.5105,0.1108],[183,0.1257,7.934,0.10958],[213,0.1134,8.297,0.10902],[244,0.1021,8.6151,0.10882],[274,0.0917,8.9014,0.10881],[304,0.082,9.1649,0.10891],[335,0.073,9.4122,0.10906],[365,0.0644,9.6479,0.10925],[396,0.0563,9.8749,0.10949],[426,0.0487,10.0953,0.10976],[457,0.0413,10.3108,0.11007],[487,0.0343,10.5228,0.11041],[517,0.0275,10.7319,0.11079],[548,0.0211,10.9385,0.11119],[578,0.0148,11.143,0.11164],[609,0.0087,11.3462,0.11211],[639,0.0029,11.5486,0.11261],[670,-0.0028,11.7504,0.11314],[700,-0.0083,11.9514,0.11369],[730,-0.0137,12.1515,0.11426]],"wfa_girls":[[0,0.3809,3.2322,0.14171],[7,0.2671,3.3388,0.146],[14,0.2304,3.5693,0.14339],[21,0.2024,3.8352,0.1406],[28,0.1789,4.0987,0.13805],[35,0.1582,4.3476,0.13583],[42,0.1395,4.5793,0.13392],[49,0.1224,4.795,0.13228],[56,0.1065,4.9959,0.13087],[63,0.0918,5.1842,0.12966],[70,0.0779,5.3618,0.12861],[77,0.0648,5.5295,0.1277],[84,0.0525,5.6883,0.12691],[91,0.0407,5.8393,0.12622],[122,-0.005,6.4237,0.12402],[152,-0.043,6.8985,0.12274],[183,-0.0756,7.297,0.12204],[213,-0.1039,7.6422,0.12178],[244,-0.1288,7.9487,0.12181],[274,-0.1507,8.2254,0.12199],[304,-0.17,8.48,0.12223],[335,-0.1872,8.7192,0.12247],[365,-0.2024,8.9481,0.12268],[396,-0.2158,9.1699,0.12283],[426,-0.2278,9.387,0.12294],[457,-0.2384,9.6008,0.12299],[487,-0.2478,9.8124,0.12303],[517,-0.2562,10.0226,0.12306],[548,-0.2637,10.2315,0.12309],[578,-0.2703,10.4393,0.12315],[609,-0.2762,10.6464,0.12323],[639,-0.2815,10.8534,0.12335],[670,-0.2862,11.0608,0.1235],[700,-0.2903,11.2688,0.12369],[730,-0.2941,11.4775,0.1239]],"lhfa_boys":[[0,1.0,49.8842,0.03795],[7,1.0,51.1152,0.03723],[14,1.0,52.3461,0.03652],[21,1.0,53.3905,0.03609],[28,1.0,54.3881,0.0357],[35,1.0,55.3374,0.03534],[42,1.0,56.2357,0.03501],[49,1.0,57.0851,0.0347],[56,1.0,57.8889,0.03442],[63,1.0,58.6536,0.03416],[70,1.0,59.3872,0.03392],[77,1.0,60.0894,0.03369],[84,1.0,60.7605,0.03348],[91,1.0,61.4013,0.03329],[122,1.0,63.886,0.03257],[152,1.0,65.9026,0.03204],[183,1.0,67.6236,0.03165],[213,1.0,69.1645,0.03139],[244,1.0,70.5994,0.03124],[274,1.0,71.9687,0.03117],[304,1.0,73.2812,0.03118],[335,1.0,74.5388,0.03125],[365,1.0,75.7488,0.03137],[396,1.0,76.9186,0.03154],[426,1.0,78.0497,0.03174],[457,1.0,79.1458,0.03197],[487,1.0,80.2113,0.03222],[517,1.0,81.2487,0.0325],[548,1.0,82.2587,0.03279],[578,1.0,83.2418,0.0331],[609,1.0,84.1996,0.03342],[639,1.0,85.1348,0.03376],[670,1.0,86.0477,0.0341],[700,1.0,86.941,0.03445],[730,1.0,87.8161,0.03479],[730,1.0,87.1161,0.03507]],"lhfa_girls":[[0,1.0,49.1477,0.0379],[7,1.0,50.3298,0.03742],[14,1.0,51.512,0.03694],[21,1.0,52.4695,0.03669],[28,1.0,53.3809,0.03647],[35,1.0,54.2454,0.03627],[42,1.0,55.0642,0.03609],[49,1.0,55.8406,0.03593],[56,1.0,56.5767,0.03578],[63,1.0,57.2761,0.03564],[70,1.0,57.9436,0.03552],[77,1.0,58.5816,0.0354],[84,1.0,59.1922,0.0353],[91,1.0,59.7773,0.0352],[122,1.0,62.0899,0.03486],[152,1.0,64.0301,0.03463],[183,1.0,65.7311,0.03448],[213,1.0,67.2873,0.03441],[244,1.0,68.7498,0.0344],[274,1.0,70.1435,0.03444],[304,1.0,71.4818,0.03452],[335,1.0,72.771,0.03464],[365,1.0,74.015,0.03479],[396,1.0,75.2176,0.03496],[426,1.0,76.3817,0.03514],[457,1.0,77.5099,0.03534],[487,1.0,78.6055,0.03555],[517,1.0,79.671,0.03576],[548,1.0,80.7079,0.03598],[578,1.0,81.7182,0.0362],[609,1.0,82.7036,0.03643],[639,1.0,83.6654,0.03666],[670,1.0,84.604,0.03688],[700,1.0,85.5202,0.03711],[730,1.0,86.4153,0.03734],[730,1.0,85.7153,0.03764]],"hcfa_boys":[[0,1.0,34.4618,0.03686],[7,1.0,35.1634,0.03472],[14,1.0,35.8649,0.03258],[21,1.0,36.5216,0.03197],[28,1.0,37.0926,0.03148],[35,1.0,37.601,0.03107],[42,1.0,38.0609,0.03072],[49,1.0,38.4824,0.03041],[56,1.0,38.8724,0.03014],[63,1.0,39.2368,0.0299],[70,1.0,39.5797,0.02969],[77,1.0,39.9033,0.0295],[84,1.0,40.2096,0.02933],[91,1.0,40.5008,0.02918],[122,1.0,41.6317,0.02868],[152,1.0,42.5576,0.02837],[183,1.0,43.3306,0.02817],[213,1.0,43.9803,0.02804],[244,1.0,44.53,0.02796],[274,1.0,44.9998,0.02792],[304,1.0,45.4051,0.0279],[335,1.0,45.7573,0.02789],[365,1.0,46.0661,0.02789],[396,1.0,46.3395,0.02789],[426,1.0,46.5844,0.02791],[457,1.0,46.806,0.02792],[487,1.0,47.0088,0.02795],[517,1.0,47.1962,0.02797],[548,1.0,47.3711,0.028],[578,1.0,47.5357,0.02803],[609,1.0,47.6919,0.02806],[639,1.0,47.8408,0.0281],[670,1.0,47.9833,0.02813],[700,1.0,48.1201,0.02817],[730,1.0,48.2515,0.02821]],"hcfa_girls":[[0,1.0,33.8787,0.03496],[7,1.0,34.5529,0.03374],[14,1.0,35.2272,0.03251],[21,1.0,35.843,0.03231],[28,1.0,36.3761,0.03215],[35,1.0,36.8472,0.03202],[42,1.0,37.2711,0.03191],[49,1.0,37.6584,0.03182],[56,1.0,38.0167,0.03173],[63,1.0,38.3516,0.03166],[70,1.0,38.6673,0.03158],[77,1.0,38.9661,0.03152],[84,1.0,39.2501,0.03146],[91,1.0,39.521,0.0314],[122,1.0,40.5817,0.03119],[152,1.0,41.459,0.03102],[183,1.0,42.1995,0.03087],[213,1.0,42.829,0.03075],[244,1.0,43.3671,0.03063],[274,1.0,43.83,0.03053],[304,1.0,44.2319,0.03044],[335,1.0,44.5844,0.03035],[365,1.0,44.8965,0.03027],[396,1.0,45.1752,0.03019],[426,1.0,45.4265,0.03012],[457,1.0,45.6551,0.03006],[487,1.0,45.865,0.02999],[517,1.0,46.0598,0.02993],[548,1.0,46.2424,0.02987],[578,1.0,46.4152,0.02982],[609,1.0,46.5801,0.02977],[639,1.0,46.7384,0.02972],[670,1.0,46.8913,0.02967],[700,1.0,47.0391,0.02962],[730,1.0,47.1822,0.02957]]};
function lmsAt(key, day){ const t=WHO[key]; if(!t) return null; let a=t[0], b=t[t.length-1]; if(day<=a[0]) return a.slice(1); if(day>=b[0]) return b.slice(1);
  for(let i=1;i<t.length;i++){ if(t[i][0]>=day){ a=t[i-1]; b=t[i]; if(b[0]===a[0]) return a.slice(1); const f=(day-a[0])/(b[0]-a[0]); return [a[1]+(b[1]-a[1])*f, a[2]+(b[2]-a[2])*f, a[3]+(b[3]-a[3])*f]; } } return b.slice(1); }
const valAtZ=(lms,z)=>{ const [L,Mm,S]=lms; return Math.abs(L)<1e-6 ? Mm*Math.exp(S*z) : Mm*Math.pow(1+L*S*z,1/L); };
const zOf=(lms,x)=>{ const [L,Mm,S]=lms; return Math.abs(L)<1e-6 ? Math.log(x/Mm)/S : (Math.pow(x/Mm,L)-1)/(L*S); };
function normCdf(z){ const t=1/(1+0.2316419*Math.abs(z)); const d=0.3989423*Math.exp(-z*z/2); const p=d*t*(0.3193815+t*(-0.3565638+t*(1.781478+t*(-1.821256+t*1.330274)))); return z>0?1-p:p; }
const pctTxt = z => { const p=normCdf(z)*100; return p<1?'מתחת ל־1':p>99?'מעל 99':String(Math.round(p)); };
/* ---------- state ---------- */
let db=null, user=null, assets=null, me=null, canWrite=null;
const DEFAULT_CFG = {a:{name:'תאום א׳',sideMode:'alt',photo:null,sex:null}, b:{name:'תאומה ב׳',sideMode:'alt',photo:null,sex:null},
  birth:'', ga:'', routineSync:false, th:{feeds:8, wet:6, noWetH:8, feverC:38}};
let cfg = structuredClone(DEFAULT_CFG);
let events=[], timers={}, meds=[], stock=[], growth=[], appts=[], solids=[], inv=[], shop=[], psleep=[], mine=[];
let downloads=null;
let loaded=false, offsetMin=0, tab='now', tlBaby='all', tlType='all', sumMode='night', moreSub='milk', rep={baby:'a',days:7};
let night=false; try{ night=localStorage.getItem('night')==='1'; tab=localStorage.getItem('tab')||'now'; moreSub=localStorage.getItem('more')||'milk'; }catch(e){}
if(tab==='health'){ tab='more'; moreSub='health'; }
if(!['now','tl','sum','more'].includes(tab)) tab='now';
document.body.classList.toggle('night',night);

const nm = k => { if(k==='mom') return 'אמא'; const n=cfg[k]?.name || (k==='a'?'תאום א׳':'תאומה ב׳'); return (n==='תאום ב׳' && (cfg.b?.sex||'girl')==='girl') ? 'תאומה ב׳' : n; };
const pad = n => String(n).padStart(2,'0');
const hhmm = t => { const d=new Date(t); return pad(d.getHours())+':'+pad(d.getMinutes()); };
const dmy = t => new Date(t).toLocaleDateString('he-IL',{day:'numeric',month:'numeric'});
const dur = ms => { const m=Math.max(0,Math.round(ms/M)); if(m<60) return m+' דק׳'; return Math.floor(m/60)+':'+pad(m%60)+' ש׳'; };
const clock = ms => { const s=Math.max(0,Math.floor(ms/1000)); return Math.floor(s/60)+':'+pad(s%60); };
const ago = t => (Date.now()-t)<M ? 'עכשיו' : 'לפני '+dur(Date.now()-t);
const esc = s => String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const av = (k,sm='') => { const p=cfg[k]?.photo; const n=(nm(k)||'').trim(); const ini=n.startsWith('תאום')?(k==='a'?'א':'ב'):(n[0]||'?'); return `<span class="av ${k} ${sm}">${p?`<img src="${esc(p)}" alt="">`:esc(ini)}</span>`; };
const isNight = t => { const h=new Date(t).getHours(); return h>=19 || h<7; };

function ageDays(){ if(!cfg.birth) return null; const b=new Date(cfg.birth+'T00:00:00').getTime(); return isNaN(b)?null:Math.floor((Date.now()-b)/D); }
function ageText(){
  const d=ageDays(); if(d==null) return '';
  const fmt = n => n<0 ? '' : n<14 ? n+' ימים' : n<70 ? Math.floor(n/7)+' שבועות' : Math.floor(n/30.44)+' חודשים';
  let s='גיל '+fmt(d);
  const ga=parseFloat(cfg.ga); if(ga && ga<37){ const c=d-Math.round((40-ga)*7); s+= c>=0 ? ' · מתוקן '+fmt(c) : ' · לפני תאריך הלידה המשוער'; }
  return s;
}

/* ---------- derived ---------- */
const ofBaby = k => events.filter(e=>e.baby===k);
const lastOf = (k,type) => ofBaby(k).find(e=>e.type===type);
const openSleep = k => ofBaby(k).find(e=>e.type==='sleep' && !e.end);
function lastWake(k){ const s=ofBaby(k).filter(e=>e.type==='sleep'&&e.end).sort((x,y)=>y.end-x.end)[0]; return s?.end; }
function suggestSide(k){
  if(cfg[k]?.sideMode==='L'||cfg[k]?.sideMode==='R') return cfg[k].sideMode;
  const f=ofBaby(k).find(e=>e.type==='feed' && (e.side==='L'||e.side==='R'||e.lastSide));
  if(!f) return null; const s=f.lastSide||f.side; return s==='L'?'R':'L';
}
const lastBottle = k => ofBaby(k).find(e=>e.type==='feed' && e.side==='bottle' && e.ml);
const isWet = e => e.type==='diaper' && (e.kind==='wet'||e.kind==='mixed');
const isDirty = e => e.type==='diaper' && (e.kind==='dirty'||e.kind==='mixed');
function sleepMs(e, from, to, which){ // which: 'all'|'day'|'night'
  const s=Math.max(e.t,from), en=Math.min(e.end||Date.now(), to); if(en<=s) return 0;
  if(which==='all') return en-s;
  let ms=0; for(let x=s; x<en; x+=5*M){ const step=Math.min(5*M,en-x); if(isNight(x)===(which==='night')) ms+=step; } return ms;
}
function stats(k, from, to){
  const ev=ofBaby(k).filter(e=>e.t>=from && e.t<to);
  const feeds=ev.filter(e=>e.type==='feed');
  const sleeps=ofBaby(k).filter(e=>e.type==='sleep' && (e.end||Date.now())>from && e.t<to);
  return {
    feeds:feeds.length,
    nurseMin: feeds.reduce((a,e)=>a+(+e.minsL||0)+(+e.minsR||0)+((!e.minsL&&!e.minsR)?(+e.mins||0):0),0),
    ml: feeds.reduce((a,e)=>a+Math.max(0,(+e.ml||0)-(+e.mlLeft||0)),0),
    wet: ev.filter(isWet).length, dirty: ev.filter(isDirty).length,
    diapers: ev.filter(e=>e.type==='diaper').length,
    sleepDay: sleeps.reduce((a,e)=>a+sleepMs(e,from,to,'day'),0),
    sleepNight: sleeps.reduce((a,e)=>a+sleepMs(e,from,to,'night'),0),
    wakings: sleeps.reduce((a,e)=>a+(+e.wakings||0),0),
    meds: ev.filter(e=>e.type==='med').length,
    notes: ev.filter(e=>e.note)
  };
}
function coverageSince(){ const o=events[events.length-1]; return o?o.t:Date.now(); }
function alertsFor(k){
  const out=[], now=Date.now(), age=ageDays(), th=cfg.th||DEFAULT_CFG.th;
  const temp=ofBaby(k).find(e=>e.type==='temp' && now-e.t<24*H);
  if(temp && +temp.c>=+th.feverC){
    if(age!=null && age<90) out.push({lvl:'urgent', txt:`חום ${temp.c}° אצל ${nm(k)}, מתחת לגיל 3 חודשים. לפנות לרופא עכשיו.`});
    else out.push({lvl:'warn', txt:`חום ${temp.c}° אצל ${nm(k)} (${hhmm(temp.t)}). לפעול לפי הנחיות רופא הילדים.`});
  }
  const st=ofBaby(k).find(e=>e.type==='diaper' && now-e.t<48*H && (e.color==='pale'||e.color==='red'));
  if(st) out.push({lvl:'urgent', txt:`${st.color==='pale'?'צואה בצבע לבן או אפור':'דם בצואה'} אצל ${nm(k)} (${hhmm(st.t)}). לפנות לרופא.`});
  const covered = now-coverageSince() >= 24*H;
  if(covered){
    const s=stats(k, now-24*H, now);
    if(age!=null && age<=28 && s.feeds < +th.feeds) out.push({lvl:'warn', txt:`${nm(k)}: ${s.feeds} האכלות ב־24 השעות האחרונות (סף: ${th.feeds}).`});
    if(age!=null && age>=5 && s.wet < +th.wet){
      const unk=ofBaby(k).filter(e=>e.type==='diaper'&&!e.kind&&now-e.t<24*H).length;
      out.push({lvl:'warn', txt:`${nm(k)}: ${s.wet} חיתולים רטובים ב־24 השעות האחרונות (סף: ${th.wet}).${unk?` ${unk} חיתולים נרשמו בלי פירוט.`:''}`});
    }
  }
  const lw=ofBaby(k).find(isWet);
  const refT = lw ? lw.t : null;
  if(refT && now-refT > (+th.noWetH)*H) out.push({lvl:'warn', txt:`${nm(k)}: אין חיתול רטוב כבר ${dur(now-refT)}.`});
  return out;
}
function medsDue(){
  const out=[]; const now=Date.now();
  for(const m of meds){ for(const k of (m.babies||[])){
    const last=events.find(e=>e.type==='med' && e.medId===m.id && e.baby===k);
    const every=+m.everyH||24;
    if(!last || now-last.t >= every*H) out.push({m,k,last});
  }} return out;
}
function summary(e){
  if(e.type==='burp'||e.type==='spit') return e.note||'';
  const p=[];
  if(e.type==='feed'){
    if(e.side) p.push(SIDE[e.side]);
    if(e.minsL||e.minsR) p.push(['L','R'].filter(s=>e['mins'+s]).map(s=>SIDE[s]+' '+e['mins'+s]+'׳').join(', '));
    else if(e.mins) p.push(e.mins+' דק׳');
    if(e.ml) p.push(e.ml+' מ״ל'+(e.mlLeft?` (נשארו ${e.mlLeft})`:''));
    if(e.milk) p.push(MILK[e.milk]); if(e.fortify) p.push('העשרה: '+e.fortify);
    if(e.together) p.push('יחד');
  }
  if(e.type==='diaper'){ if(e.kind) p.push(DIAPER[e.kind]); if(e.amount) p.push(DAMT[e.amount]); if(e.color) p.push(STOOL[e.color][0]); if(e.texture) p.push(TEXTURE[e.texture]); if(e.rash) p.push('פריחה'); }
  if(e.type==='sleep'){
    p.push((PERIOD[e.period]||(isNight(e.t)?'לילה':'יום')));
    p.push(e.end ? hhmm(e.t)+'–'+hhmm(e.end)+' · '+dur(e.end-e.t) : 'ישן/ה עכשיו · '+dur(Date.now()-e.t));
    if(e.loc) p.push(SLOC[e.loc]); if(e.pos) p.push(SPOS[e.pos]); if(e.wakings) p.push(e.wakings+' התעוררויות'); if(e.hard) p.push('הירדמות קשה');
  }
  if(e.type==='pump'){ if(e.side) p.push(SIDE[e.side]); if(e.ml) p.push(e.ml+' מ״ל'); }
  if(e.type==='med'){ p.push(e.medName||''); if(e.dose) p.push(e.dose); }
  if(e.type==='temp'){ p.push(e.c+'°'); if(e.method) p.push(TMETH[e.method]); }
  if(e.type==='care'){ p.push(CARE[e.care]||''); if(e.mins) p.push(e.mins+' דק׳'); }
  if(e.note) p.push(e.note);
  return p.filter(Boolean).length ? p.filter(Boolean).join(' · ') : 'בלי פרטים · הקשה להשלמה';
}
const label = e => e.type==='care' ? (CARE[e.care]||'טיפול') : TYPE[e.type];

/* ---------- names of loggers ---------- */
const byNames={};
async function resolveNames(ids){
  ids=ids.filter(i=>i && i!==me && !(i in byNames)); if(!user||!ids.length) return;
  try{ const ps=await user.profiles(ids); for(const id of ids) byNames[id]=ps?.[id]?.name||''; render(); }catch(e){}
}
const whoTxt = id => !id ? '' : id===me ? 'אני' : (byNames[id]||'');

/* ---------- views ---------- */
const TABS=[['now','עכשיו','drops'],['tl','יומן','list'],['sum','סיכום','sum'],['more','עוד','more']];
function renderTabs(){
  $('#tabs').innerHTML = TABS.map(([id,l,i])=>`<button data-tab="${id}" ${tab===id?'aria-current="page"':''}>${ico(i,'i')}<span>${l}</span></button>`).join('');
}
function render(){
  renderTabs();
  const v=$('#view');
  document.body.classList.toggle('on-now', tab==='now');
  $('#dropsRoot').hidden = tab!=='now';
  if(tab==='now'){ v.innerHTML=''; syncDrops(); }
  else v.innerHTML = tab==='tl'?viewTimeline() : tab==='sum'?viewSummary() : viewMore();
  if(tab==='more' && moreSub==='parents') resolveNames([...new Set(psleep.map(e=>e.by))]);
  if(tab==='tl') resolveNames([...new Set(events.map(e=>e.by))]);
  if(tab==='more' && moreSub==='health') resolveNames([...new Set(events.filter(e=>e.type==='med').map(e=>e.by))]);
  tick();
}

/* ---------- Now: כמו שתי טיפות מים — the drops engine lives in drops.js; here it gets the records ---------- */
const isGirl = k => (cfg[k]?.sex || (k==='b'?'girl':'boy'))==='girl';
const g = (k,m,f) => isGirl(k)?f:m;
const hm = ms => { const m=Math.max(0,Math.floor(ms/M)); return pad(Math.floor(m/60))+':'+pad(m%60); };
const SMALL = 'M0 -11 C0 -11 -6.5 -2 -6.5 2.5 A6.5 6.5 0 0 0 6.5 2.5 C6.5 -2 0 -11 0 -11 Z';
function nightWindow(){ const s=new Date(); if(s.getHours()<12) s.setDate(s.getDate()-1); s.setHours(19,0,0,0); const e=new Date(s); e.setDate(e.getDate()+1); e.setHours(7,0,0,0); return [s.getTime(), e.getTime()]; }
const deepNight = t => { const h=new Date(t).getHours(); return h>=22 || h<6; };
function nowAlerts(){
  const al=[...alertsFor('a'),...alertsFor('b')].sort((x,y)=>(x.lvl==='urgent'?0:1)-(y.lvl==='urgent'?0:1));
  for(const s of solids){ if(s.reaction==='strong' && Date.now()-s.t<48*H) al.unshift({lvl:'urgent', txt:`תגובה משמעותית אצל ${nm(s.baby)} אחרי ${s.foods||'טעימה'} (${hhmm(s.t)}). לפנות לרופא. קושי בנשימה, התנפחות או הקאות חוזרות: מד״א 101.`}); }
  const low=inv.filter(i=>(+i.qty||0)<=(+i.low||0));
  if(low.length) al.push({lvl:'warn', txt:`עומד להיגמר: ${low.map(i=>i.name).join(', ')}.`, home:true});
  const water=mine.find(d=>d.id==='water');
  if(me && water && water.day===new Date().toDateString() && Date.now()-water.last>3*H) al.push({lvl:'warn', txt:`עברו ${dur(Date.now()-water.last)} מאז ששתית. כוס מים?`, home:true});
  return {al, due:medsDue()};
}
let dropsMounted=false;
const dropsApi={
  async add(type, ks, extra){ const t=Date.now(), out={};
    for(const k of ks){ const body={type,baby:k,t,...(extra||{})}; if(type==='sleep') body.period=isNight(t)?'night':'day';
      const id=await addDoc('events',body); if(id) out[k]=id; }
    return out; },
  patch(id,data){ if(id) patchEvent(id,data); },
  remove(ids){ ids=ids.filter(Boolean); if(ids.length) removeEvents(ids); },
  setTime(ids,val){ for(const id of ids){ const e=events.find(x=>x.id===id); if(e) patchEvent(id,{t:fromTime(val,e.t)}); } },
  nurseStart(k,together){ const sl=openSleep(k); if(sl) patchEvent(sl.id,{end:Math.max(Date.now(),sl.t+M)}); if(!timers[k]) startTimer(k,Date.now(),together); },
  nurseStop(k){ timerAct('stop',k); },
  nurseSwap(k){ timerAct('switch',k); },
  sleepEnd(k){ const s=openSleep(k); if(s) patchEvent(s.id,{end:Math.max(Date.now(),s.t+M)}); },
  edit(id){ if(canWrite!==false) editEvent(id); },
  go(where){ if(where==='health'){ tab='more'; moreSub='health'; render(); } }
};
function syncDrops(){
  if(!window.Drops) return;
  if(!dropsMounted){ window.Drops.mount($('#dropsRoot'), dropsApi); dropsMounted=true; }
  const now=Date.now(), d0=new Date(); d0.setHours(0,0,0,0); const from=d0.getTime();
  const st={canWrite:canWrite!==false};
  for(const k of ['a','b']){
    const f=lastOf(k,'feed'), s=openSleep(k), d=lastOf(k,'diaper'), tm=timers[k], lb=lastBottle(k);
    st[k]={name:nm(k), girl:isGirl(k), feed:f?.t||null, next:suggestSide(k), sleep:s?.t||null, loc:s?.loc||null, wake:s?null:(lastWake(k)||null),
      diaper:d?.t||null, nurse:tm?{t:tm.startedAt, side:tm.side}:null, lastMl:lb?.ml||null};
  }
  const [n0,n1]=nightWindow();
  const cnt=(k,f)=>ofBaby(k).filter(e=>e.t>=from && f(e)).length;
  const two=f=>({a:f('a'),b:f('b')});
  st.tally={ burp:two(k=>cnt(k,e=>e.type==='burp')), poop:two(k=>cnt(k,isDirty)), spit:two(k=>cnt(k,e=>e.type==='spit')),
    night:two(k=>ofBaby(k).filter(e=>e.type==='sleep'&&e.end&&e.end>=n0&&e.end<Math.min(n1,now)&&deepNight(e.end)).length) };
  const wk=events.filter(e=>e.t>=now-7*D && e.by && e.baby!=='mom'); const ids=[...new Set(wk.map(e=>e.by))].slice(0,3);
  st.league={ people:ids.map(id=>whoTxt(id)||'הורה'), rows:[['חיתולים',e=>e.type==='diaper'],['האכלות בלילה',e=>e.type==='feed'&&deepNight(e.t)],['הרדמות',e=>e.type==='sleep']].map(([l,f])=>[l, ids.map(id=>wk.filter(e=>e.by===id&&f(e)).length)]) };
  if(ids.length) resolveNames(ids);
  const {al,due}=nowAlerts();
  st.alerts=[...al.map(a=>({lvl:a.lvl, txt:a.txt, note:a.lvl==='urgent'||a.home?'':'התראה בלבד, לא אבחנה. כדאי לאשר את הספים מול רופא הילדים.'})),
    ...due.map(d=>({lvl:'warn', txt:`${d.m.name} ל${nm(d.k)}: ${d.last?'ניתן לאחרונה '+ago(d.last.t):'עוד לא ניתן'}`, note:'הקשה לסימון "ניתן"', go:'health'}))];
  window.Drops.sync(st);
}

/* ---------- Report: the same numbers, as water ---------- */
function gaugesHtml(from,to){
  const W=358, span=Math.max(1,to-from), X=t=>Math.max(0,Math.min(W,(t-from)/span*W));
  const ticks=[0,.25,.5,.75,1].map((f,i)=>({x:f*W, l:hhmm(from+f*span), a:i===0?'start':i===4?'end':'middle'}));
  const nights=[]; { const s=new Date(from); s.setHours(19,0,0,0); s.setDate(s.getDate()-1);
    for(let t=s.getTime(); t<to; t+=D){ const a=Math.max(t,from), b=Math.min(t+12*H,to); if(b>a) nights.push([X(a),X(b)]); } }
  const tick=y=>ticks.map(t=>`<text x="${t.x}" y="${y}" text-anchor="${t.a}">${t.l}</text>`).join('');
  // tide: sleep, A above the line, B below
  const sl=k=>ofBaby(k).filter(e=>e.type==='sleep'&&(e.end||Date.now())>from&&e.t<to);
  const band=(k,up)=>sl(k).map(e=>{ const x1=X(e.t), x2=X(e.end||Date.now()); const w=Math.max(1.5,x2-x1); return up?`M${x1} 92 V14 Q${x1+w/2} 6 ${x1+w} 14 V92 Z`:`M${x1} 92 V170 Q${x1+w/2} 178 ${x1+w} 170 V92 Z`; }).join(' ');
  const A=stats('a',from,to), B=stats('b',from,to);
  let h=`<section><div class="gauge-h"><b>גאות ושפל</b><span>שינה</span></div>
    <div class="big2"><div class="a"><div class="n">${hm(A.sleepDay+A.sleepNight)}</div><small>${esc(nm('a'))} · לילה ${hm(A.sleepNight)}</small></div><div class="b"><div class="n">${hm(B.sleepDay+B.sleepNight)}</div><small>${esc(nm('b'))} · לילה ${hm(B.sleepNight)}</small></div></div>
    <svg class="gauge" viewBox="0 0 ${W} 200" role="img" aria-label="שינה לאורך הזמן: ${esc(nm('a'))} מעל הקו, ${esc(nm('b'))} מתחתיו">
      ${nights.map(([a,b])=>`<rect x="${a}" y="0" width="${b-a}" height="184" style="fill:var(--surface-2)"/>`).join('')}
      <path d="${band('a',true)}" style="fill:var(--a)"/><path d="${band('b',false)}" style="fill:var(--b)"/>
      <line x1="0" x2="${W}" y1="92" y2="92" style="stroke:var(--fg);stroke-opacity:.3"/>
      ${ticks.map(t=>`<line x1="${t.x}" x2="${t.x}" y1="184" y2="190" style="stroke:var(--fg)"/>`).join('')}${tick(200)}
    </svg></section>`;
  // drip: feeds
  const fd=k=>ofBaby(k).filter(e=>e.type==='feed'&&e.t>=from&&e.t<to).sort((x,y)=>x.t-y.t);
  const fa=fd('a'), fb=fd('b');
  const gap=xs=>xs.length<2?'—':hm((xs[xs.length-1].t-xs[0].t)/(xs.length-1));
  const drops=(xs,y,k)=>xs.map(e=>`<path transform="translate(${X(e.t)} ${y})" d="${SMALL}" style="fill:var(--${k})"/>`).join('');
  h+=`<section style="padding-top:22px"><div class="gauge-h"><b>טפטוף</b><span>האכלות</span></div>
    <svg class="gauge" viewBox="0 0 ${W} 104" role="img" aria-label="האכלות: ${esc(nm('a'))} ${fa.length}, ${esc(nm('b'))} ${fb.length}">
      <line x1="0" x2="${W}" y1="34" y2="34" style="stroke:var(--fg);stroke-opacity:.25"/><line x1="0" x2="${W}" y1="80" y2="80" style="stroke:var(--fg);stroke-opacity:.25"/>
      ${drops(fa,28,'a')}${drops(fb,74,'b')}${tick(102)}
    </svg>
    <div class="two" style="font-size:13px;margin-top:8px"><span><b class="mono">${fa.length}</b> טיפות · מרווח <span class="mono">${gap(fa)}</span></span><span style="text-align:left"><b class="mono">${fb.length}</b> טיפות · מרווח <span class="mono">${gap(fb)}</span></span></div></section>`;
  // rain gauge: diapers
  const th=+(cfg.th?.wet||6), full=span>=23*H;
  const mx=Math.max(8, A.wet, B.wet, A.dirty, B.dirty, full?th:0);
  const RY=v=>190-v/mx*180;
  const col=(x,v,k,fill)=>`<rect x="${x}" y="${RY(v)}" width="22" height="${190-RY(v)}" style="${fill?`fill:var(--${k})`:`fill:none;stroke:var(--${k});stroke-width:1.2`}"/>`;
  const leaks=['a','b'].filter(k=>{ const d=lastOf(k,'diaper'); return d && Date.now()-d.t>4*H; });
  h+=`<section style="padding-top:22px"><div class="gauge-h"><b>מד גשם</b><span>חיתולים</span></div>
    <div class="rain"><svg class="gauge" viewBox="0 0 150 200" role="img" aria-label="${esc(nm('a'))} ${A.wet} רטובים ו־${A.dirty} קקי, ${esc(nm('b'))} ${B.wet} רטובים ו־${B.dirty} קקי">
      ${[0,.25,.5,.75,1].map(f=>{ const v=Math.round(mx*f); return `<line x1="22" x2="30" y1="${RY(v)}" y2="${RY(v)}" style="stroke:var(--fg)"/><text x="16" y="${RY(v)+3}" text-anchor="end">${v}</text>`; }).join('')}
      ${col(40,A.wet,'a',true)}${col(66,A.dirty,'a',false)}${col(92,B.wet,'b',true)}${col(118,B.dirty,'b',false)}
      ${full?`<line x1="30" x2="146" y1="${RY(th)}" y2="${RY(th)}" style="stroke:var(--fg);stroke-dasharray:2 3"/>`:''}
      <line x1="30" x2="146" y1="190" y2="190" style="stroke:var(--fg)"/>
    </svg><div style="display:flex;flex-direction:column;gap:8px">
      <div><span style="display:inline-block;width:10px;height:10px;background:var(--fg);vertical-align:middle"></span> רטוב &nbsp; <span style="display:inline-block;width:10px;height:10px;border:1px solid var(--fg);vertical-align:middle"></span> קקי</div>
      <div><span style="color:var(--a)">${esc(nm('a'))}</span> <span class="mono">${A.wet}/${A.dirty}</span> · <span style="color:var(--b)">${esc(nm('b'))}</span> <span class="mono">${B.wet}/${B.dirty}</span></div>
      ${full?`<div>קו מקווקו: ${th} רטובים ביממה.</div>`:'<div class="note">קו הסף מוצג בחלונות של 24 שעות.</div>'}
      ${leaks.length?`<div style="border-top:1px solid var(--hair);padding-top:8px"><b>דליפה.</b> ${leaks.map(k=>`${esc(nm(k))}: ${hm(Date.now()-lastOf(k,'diaper').t)} מהחיתול האחרון`).join(' · ')}.</div>`:''}
    </div></div></section>`;
  return h;
}

function syncHint(){
  const now=Date.now();
  for(const [k,o] of [['a','b'],['b','a']]){
    const fk=lastOf(k,'feed'); const fo=lastOf(o,'feed');
    const kFeeding = timers[k] || (fk && now-fk.t<20*M);
    if(kFeeding && !timers[o] && (!fo || now-fo.t>2*H) && openSleep(o))
      return `<b>סנכרון שגרות:</b> ${esc(nm(k))} אוכל/ת עכשיו, ו${esc(nm(o))} לא אכל/ה ${fo?dur(now-fo.t):'מאז תחילת הרישום'}. אפשר להעיר להאכלה משותפת.`;
  }
  return '';
}
function itemHtml(e){
  const who=whoTxt(e.by);
  return `<button class="item" data-id="${e.id}"><span class="time tn">${hhmm(e.t)}</span>
    <span class="what"><b>${label(e)}</b><span class="sub tn">${esc([summary(e),who].filter(Boolean).join(' · '))}</span></span>
    <span class="tag ${e.baby}">${esc(nm(e.baby))}</span></button>`;
}
function viewTimeline(){
  const types=[['all','הכל'],['feed','האכלה'],['diaper','חיתול'],['sleep','שינה'],['health','בריאות'],['pump','שאיבה']];
  let h=`<div class="wrap" style="gap:10px"><h3 class="sec">ציר זמן משולב</h3>
    <div class="seg" role="group" aria-label="תאום">${[['all','שניהם'],['a',nm('a')],['b',nm('b')]].map(([v,l])=>`<button data-tlb="${v}" aria-pressed="${tlBaby===v}">${esc(l)}</button>`).join('')}</div>
    <div class="chips" role="group" aria-label="סוג">${types.map(([v,l])=>`<button class="chip" data-tlt="${v}" aria-pressed="${tlType===v}">${l}</button>`).join('')}</div>
    <div class="actions w"><button class="sbtn" data-add="note">+ הערה</button><button class="sbtn" data-add="care">+ אמבטיה, בטן, ציפורניים…</button></div>`;
  const list=events.filter(e=>(tlBaby==='all'||e.baby===tlBaby||(tlType==='pump'&&e.baby==='mom'))
    && (tlType==='all' || (tlType==='health'?['med','temp','care','note'].includes(e.type):e.type===tlType))).slice(0,250);
  if(!loaded) return h+'<div class="empty">טוען רישומים…</div></div>';
  if(!list.length) return h+'<div class="empty">אין רישומים בסינון הזה.</div></div>';
  let cur=''; const today=new Date().toDateString(), yest=new Date(Date.now()-D).toDateString();
  for(const e of list){ const ds=new Date(e.t).toDateString();
    if(ds!==cur){ if(cur) h+='</div>'; cur=ds; h+=`<div class="day">${ds===today?'היום':ds===yest?'אתמול':new Date(e.t).toLocaleDateString('he-IL',{weekday:'long',day:'numeric',month:'numeric'})}</div><div class="list">`; }
    h+=itemHtml(e); }
  return h+'</div><p class="note">מוצגים 14 הימים האחרונים. הקשה על רישום פותחת אותו לעריכה.</p></div>';
}
function sumWindow(){
  const now=Date.now(), d0=new Date(); d0.setHours(0,0,0,0);
  if(sumMode==='night'){ const s=new Date(); if(s.getHours()<12){ s.setDate(s.getDate()-1);} s.setHours(22,0,0,0); const e=new Date(s); e.setDate(e.getDate()+1); e.setHours(7,0,0,0); return [s.getTime(), Math.min(e.getTime(),now), 'לילה אחרון, 22:00–07:00']; }
  if(sumMode==='12') return [now-12*H, now, '12 השעות האחרונות'];
  if(sumMode==='24') return [now-24*H, now, '24 השעות האחרונות'];
  if(sumMode==='today') return [d0.getTime(), now, 'היום מחצות'];
  return [d0.getTime()-D, d0.getTime(), 'אתמול'];
}
function viewSummary(){
  const [from,to,lbl]=sumWindow();
  const A=stats('a',from,to), B=stats('b',from,to);
  const rows=[['האכלות',x=>x.feeds],['דקות הנקה',x=>x.nurseMin||'—'],['בקבוק (מ״ל ששתה)',x=>x.ml||'—'],['חיתולים רטובים',x=>x.wet],['חיתולי קקי',x=>x.dirty],['סך חיתולים',x=>x.diapers],['שינת יום',x=>x.sleepDay?dur(x.sleepDay):'—'],['שינת לילה',x=>x.sleepNight?dur(x.sleepNight):'—'],['התעוררויות',x=>x.wakings||'—'],['תרופות שניתנו',x=>x.meds||'—']];
  let h=`<div class="wrap" style="gap:12px"><div class="duel-h"><h2>סיכום</h2></div>
    <div class="chips" role="group">${[['night','מה היה בלילה'],['12','12 ש׳'],['24','24 ש׳'],['today','היום'],['yest','אתמול']].map(([v,l])=>`<button class="chip" data-sum="${v}" aria-pressed="${sumMode===v}">${l}</button>`).join('')}</div>
    <p class="note">${lbl}${to<from?'':' · '+hhmm(from)+'–'+hhmm(to)}</p>
    ${gaugesHtml(from,to)}
    <h3 class="sec">במספרים</h3>
    <div class="tbl-wrap"><table><thead><tr><th></th><th><span class="dot a"></span> ${esc(nm('a'))}</th><th><span class="dot b"></span> ${esc(nm('b'))}</th></tr></thead><tbody>
    ${rows.map(([l,f])=>`<tr><th scope="row">${l}</th><td>${f(A)}</td><td>${f(B)}</td></tr>`).join('')}</tbody></table></div>`;
  const notes=[...A.notes,...B.notes].sort((x,y)=>x.t-y.t);
  if(notes.length) h+='<div class="card"><h4>הערות מהזמן הזה</h4>'+notes.map(e=>`<div class="note"><span class="dot ${e.baby}"></span> ${hhmm(e.t)} · ${label(e)}: ${esc(e.note)}</div>`).join('')+'</div>';
  // weekly
  const days=[]; const d0=new Date(); d0.setHours(0,0,0,0);
  for(let i=6;i>=0;i--){ const s=d0.getTime()-i*D; days.push([s,s+D]); }
  const wk = (k,f) => days.map(([s,e])=>f(stats(k,s,Math.min(e,Date.now()))));
  const chart=(title,f,fmt)=>{ const va=wk('a',f), vb=wk('b',f); const mx=Math.max(1,...va,...vb);
    const one=(k,vals)=>`<div class="bars">${vals.map((v,i)=>`<div class="bar ${k}"><em>${fmt(v)}</em><i style="height:${Math.round(v/mx*60)}px"></i><span>${new Date(days[i][0]).toLocaleDateString('he-IL',{weekday:'narrow'})}</span></div>`).join('')}</div>`;
    return `<div class="card"><h4>${title}</h4><div class="duo"><div><div class="note"><span class="dot a"></span> ${esc(nm('a'))}</div>${one('a',va)}</div><div><div class="note"><span class="dot b"></span> ${esc(nm('b'))}</div>${one('b',vb)}</div></div></div>`; };
  h+='<h3 class="sec">7 הימים האחרונים</h3>';
  h+=chart('האכלות ביום',x=>x.feeds,v=>v||'');
  h+=chart('שעות שינה ביום',x=>Math.round((x.sleepDay+x.sleepNight)/H*10)/10,v=>v||'');
  h+=chart('חיתולים רטובים ביום',x=>x.wet,v=>v||'');
  return h+'</div>';
}
const GM = {w:{label:'משקל', key:'wfa', unit:'ק״ג', get:x=>x.w?x.w/1000:null, dec:1}, len:{label:'אורך', key:'lhfa', unit:'ס״מ', get:x=>x.len||null, dec:0}, head:{label:'היקף ראש', key:'hcfa', unit:'ס״מ', get:x=>x.head||null, dec:0}};
let gMeasure='w';
const ZL=[[-1.881,'3'],[-1.036,'15'],[0,'50'],[1.036,'85'],[1.881,'97']];
function gAge(dateStr){ // corrected age in days at a measurement date
  if(!cfg.birth) return null; const b=new Date(cfg.birth+'T00:00:00').getTime(), d=new Date(dateStr+'T12:00:00').getTime(); if(isNaN(b)||isNaN(d)) return null;
  let a=Math.floor((d-b)/D); const ga=parseFloat(cfg.ga); if(ga && ga<37 && a<=730) a-=Math.round((40-ga)*7); return a; }
function gPoint(k,x,m){ const sex=cfg[k]?.sex; const v=GM[m].get(x), age=gAge(x.date); if(!sex||v==null||age==null||age<0||age>730) return null;
  const lms=lmsAt(GM[m].key+'_'+(sex==='boy'?'boys':'girls'),age); return {age,v,z:zOf(lms,v)}; }
function growthChart(k,m){
  const sex=cfg[k]?.sex, g=GM[m];
  const head=`<h4><span class="dot ${k}"></span>${esc(nm(k))} · ${g.label}</h4>`;
  if(!sex || !cfg.birth) return `<div class="card">${head}<p class="note">כדי להציג עקומה צריך להגדיר ${!sex?'את המין של '+esc(nm(k)):''}${!sex&&!cfg.birth?' ו':''}${!cfg.birth?'את תאריך הלידה':''} בהגדרות.</p></div>`;
  const pts=growth.filter(x=>x.baby===k).map(x=>gPoint(k,x,m)).filter(Boolean).sort((a,b)=>a.age-b.age);
  const lastAge=pts.length?pts[pts.length-1].age:Math.max(0,gAge(new Date().toISOString().slice(0,10))||0);
  const xMax=Math.min(730, Math.max(91, Math.ceil((lastAge+45)/30.4375)*30.4375));
  const key=g.key+'_'+(sex==='boy'?'boys':'girls');
  const xs=[]; for(let d=0; d<=xMax; d+=Math.max(2,Math.round(xMax/80))) xs.push(d); if(xs[xs.length-1]!==xMax) xs.push(xMax);
  const lines=ZL.map(([z])=>xs.map(d=>[d,valAtZ(lmsAt(key,d),z)]));
  let yMin=Math.min(...lines[0].map(p=>p[1]), ...pts.map(p=>p.v)), yMax=Math.max(...lines[4].map(p=>p[1]), ...pts.map(p=>p.v));
  const pad=(yMax-yMin)*0.06; yMin-=pad; yMax+=pad;
  const W=340,Hh=210,l=34,r=26,t=10,bt=26; const X=d=>l+(d/xMax)*(W-l-r), Y=v=>t+(1-(v-yMin)/(yMax-yMin))*(Hh-t-bt);
  const step = (yMax-yMin)>20?5:(yMax-yMin)>8?2:1;
  let svg=`<svg viewBox="0 0 ${W} ${Hh}" width="100%" style="direction:ltr;display:block" role="img" aria-label="עקומת ${g.label} של ${esc(nm(k))}">`;
  for(let v=Math.ceil(yMin/step)*step; v<=yMax; v+=step) svg+=`<line x1="${l}" x2="${W-r}" y1="${Y(v).toFixed(1)}" y2="${Y(v).toFixed(1)}" stroke="var(--line)" stroke-width="1"/><text x="${l-5}" y="${(Y(v)+4).toFixed(1)}" text-anchor="end" font-size="10" fill="var(--muted)">${v}</text>`;
  const monthStep = xMax>400?3:xMax>200?2:1;
  if(xMax<=91){ for(let w=0; w*7<=xMax; w+=2) svg+=`<text x="${X(w*7).toFixed(1)}" y="${Hh-8}" text-anchor="middle" font-size="10" fill="var(--muted)">${w}</text>`; svg+=`<text x="${W-r}" y="${Hh-8}" text-anchor="start" font-size="10" fill="var(--muted)">שב׳</text>`; }
  else { for(let mo=0; mo*30.4375<=xMax; mo+=monthStep) svg+=`<text x="${X(mo*30.4375).toFixed(1)}" y="${Hh-8}" text-anchor="middle" font-size="10" fill="var(--muted)">${mo}</text>`; svg+=`<text x="${W-r}" y="${Hh-8}" text-anchor="start" font-size="10" fill="var(--muted)">ח׳</text>`; }
  lines.forEach((ln,i)=>{ const med=i===2; svg+=`<polyline points="${ln.map(p=>X(p[0]).toFixed(1)+','+Y(p[1]).toFixed(1)).join(' ')}" fill="none" stroke="${med?'var(--fg)':'var(--muted)'}" stroke-width="${med?1.6:1}" stroke-opacity="${med?.7:.45}" ${i===0||i===4?'stroke-dasharray="3 3"':''}/>`;
    const e=ln[ln.length-1]; svg+=`<text x="${(X(e[0])+3).toFixed(1)}" y="${(Y(e[1])+3).toFixed(1)}" font-size="9" fill="var(--muted)">${ZL[i][1]}</text>`; });
  if(pts.length>1) svg+=`<polyline points="${pts.map(p=>X(p.age).toFixed(1)+','+Y(p.v).toFixed(1)).join(' ')}" fill="none" stroke="var(--${k})" stroke-width="2"/>`;
  pts.forEach((p,i)=>{ svg+=`<circle cx="${X(p.age).toFixed(1)}" cy="${Y(p.v).toFixed(1)}" r="${i===pts.length-1?4.5:3.2}" fill="var(--${k})" stroke="var(--surface)" stroke-width="1.5"/>`; });
  svg+='</svg>';
  const last=pts[pts.length-1];
  const sub = last ? `אחרון: ${last.v.toFixed(m==='w'?2:1)} ${g.unit} · אחוזון ${pctTxt(last.z)}` : 'אין עדיין מדידות של המדד הזה.';
  return `<div class="card">${head}<div class="note tn">${sub}</div>${svg}</div>`;
}
function viewHealth(){
  let h='<div class="wrap" style="gap:12px">';
  h+=`<h3 class="sec">חום</h3><div class="actions w"><button class="btn a" data-temp="a">מדידה ל${esc(nm('a'))}</button><button class="btn b" data-temp="b">מדידה ל${esc(nm('b'))}</button></div>`;
  const temps=events.filter(e=>e.type==='temp').slice(0,6);
  h+= temps.length ? '<div class="list">'+temps.map(itemHtml).join('')+'</div>' : '<p class="note">אין מדידות חום ב־14 הימים האחרונים.</p>';
  // meds
  h+=`<h3 class="sec"><span class="grow">תרופות ותוספים</span><button class="sbtn w" data-med-new>+ הוספה</button></h3>`;
  if(!meds.length) h+='<div class="empty">אין תרופות או תוספים ברשימה. מוסיפים אותם לפי הנחיית הרופא או טיפת חלב, עם המינון שקיבלתם.</div>';
  else h+='<div class="list">'+meds.map(m=>{
    return `<div class="row" style="flex-direction:column;align-items:stretch"><div style="display:flex;gap:8px;align-items:center"><div class="main"><b>${esc(m.name)}</b><div class="sub">${esc(m.dose||'')}${m.everyH?' · כל '+m.everyH+' ש׳':''}</div></div><button class="sbtn w" data-med-edit="${m.id}">עריכה</button></div>
      <div class="duo">${(m.babies||[]).map(k=>{ const last=events.find(e=>e.type==='med'&&e.medId===m.id&&e.baby===k);
        const dueNow=!last || Date.now()-last.t >= (+m.everyH||24)*H;
        return `<div class="card" style="padding:10px;gap:6px"><div class="note"><span class="dot ${k}"></span> ${esc(nm(k))} <span class="tag ${dueNow?'warn':'ok'}">${dueNow?'הגיע הזמן':'ניתן'}</span></div>
          <div class="note tn">${last?'אחרון: '+hhmm(last.t)+', '+ago(last.t)+(whoTxt(last.by)?' · '+esc(whoTxt(last.by)):''):'עוד לא ניתן'}</div>
          <button class="sbtn ${k} w" data-give="${m.id}" data-baby="${k}">ניתן עכשיו</button></div>`; }).join('')}</div></div>`; }).join('')+'</div>';
  // growth
  h+=`<h3 class="sec"><span class="grow">משקל, אורך והיקף ראש</span><button class="sbtn w" data-growth-new>+ מדידה</button></h3>`;
  h+='<div class="duo">'+['a','b'].map(k=>{
    const g=growth.filter(x=>x.baby===k).sort((x,y)=>y.date.localeCompare(x.date));
    if(!g.length) return `<div class="card"><h4><span class="dot ${k}"></span>${esc(nm(k))}</h4><p class="note">אין מדידות.</p></div>`;
    const l=g[0], p=g.find(x=>x.date<l.date && x.w);
    let rate=''; if(l.w && p){ const days=(new Date(l.date)-new Date(p.date))/D; if(days>0) rate=`${Math.round((l.w-p.w)/days)} גרם ליום מאז ${dmy(new Date(p.date))}`; }
    const ws=g.filter(x=>x.w).slice(0,8).reverse();
    let spark=''; if(ws.length>1){ const mn=Math.min(...ws.map(x=>x.w)), mx=Math.max(...ws.map(x=>x.w)); const W=140,Hh=36;
      const pts=ws.map((x,i)=>`${(i/(ws.length-1)*W).toFixed(1)},${(Hh-4-((x.w-mn)/Math.max(1,mx-mn))*(Hh-8)).toFixed(1)}`);
      spark=`<svg viewBox="-4 -2 ${W+8} ${Hh+4}" width="100%" height="40" style="direction:ltr" aria-hidden="true"><polyline points="${pts.join(' ')}" fill="none" stroke="var(--${k})" stroke-width="2" stroke-linejoin="round"/><circle cx="${pts[pts.length-1].split(',')[0]}" cy="${pts[pts.length-1].split(',')[1]}" r="3" fill="var(--${k})"/></svg>`; }
    return `<div class="card"><h4><span class="dot ${k}"></span>${esc(nm(k))}</h4>
      <div class="stat"><span class="k">${dmy(new Date(l.date))}</span><span class="v tn">${l.w?l.w+' גרם':'—'}</span><span class="s tn">${[l.len?l.len+' ס״מ':'',l.head?'ראש '+l.head+' ס״מ':''].filter(Boolean).join(' · ')}</span></div>
      ${spark}<div class="note">${rate}</div>${(()=>{ const ps=Object.keys(GM).map(m=>{ const p=gPoint(k,l,m); return p?GM[m].label+' '+pctTxt(p.z):''; }).filter(Boolean); return ps.length?`<div class="note">אחוזונים: ${ps.join(' · ')}</div>`:''; })()}
      <button class="sbtn" data-growth-list="${k}">כל המדידות (${g.length})</button></div>`; }).join('')+'</div>';
  h+=`<h3 class="sec">עקומות גדילה</h3><div class="chips" role="group" aria-label="מדד">${Object.entries(GM).map(([k,v])=>`<button class="chip" data-gm="${k}" aria-pressed="${gMeasure===k}">${v.label}</button>`).join('')}</div>`;
  h+=['a','b'].map(k=>growthChart(k,gMeasure)).join('');
  h+=`<p class="note">תקני הגדילה של ארגון הבריאות העולמי (2006). הקווים הם האחוזונים 3, 15, 50, 85 ו־97.${(parseFloat(cfg.ga)<37)?' הגיל מחושב כגיל מתוקן, לפי שבוע הלידה שבהגדרות. מדידות מלפני תאריך הלידה המשוער לא מופיעות על העקומה, כי לתקופה הזו משתמשים בעקומות לפגים.':''} אחוזון בודד לא אומר הרבה. מה שחשוב הוא המגמה לאורך זמן, ואת הפירוש עושים עם רופא הילדים או אחות טיפת חלב.</p>`;
  // appts
  h+=`<h3 class="sec"><span class="grow">תורים וחיסונים</span><button class="sbtn w" data-appt-new>+ הוספה</button></h3>`;
  const ap=[...appts].sort((x,y)=>(x.done-y.done)||String(x.date).localeCompare(String(y.date)));
  h+= ap.length ? '<div class="list">'+ap.map(a=>`<div class="row"><div class="main"><b>${esc(a.title)}</b><div class="sub tn">${a.date?new Date(a.date).toLocaleString('he-IL',{weekday:'short',day:'numeric',month:'numeric',hour:'2-digit',minute:'2-digit'}):''} · ${a.baby==='both'?'שניהם':esc(nm(a.baby))}${a.note?' · '+esc(a.note):''}</div></div>
      <span class="tag ${a.done?'ok':(a.date&&new Date(a.date).getTime()<Date.now()?'warn':a.baby)}">${a.done?'בוצע':'מתוכנן'}</span><button class="sbtn w" data-appt-edit="${a.id}">עריכה</button></div>`).join('')+'</div>' : '<div class="empty">אין תורים. טיפת חלב, רופא ילדים, בדיקות שמיעה, חיסונים ומעקבים נכנסים לכאן.</div>';
  h+=`<h3 class="sec">טיפולים ותיעוד</h3><div class="actions w"><button class="sbtn" data-add="care">+ טבור, צהבת, אמבטיה…</button><button class="sbtn" data-add="note">+ תסמין או הערה</button></div>`;
  return h+'</div>';
}
function stockStatus(s){
  const now=Date.now();
  const exp = s.where==='thawed' ? (s.thawedAt||now)+24*H : s.where==='freezer' ? s.pumpedAt+182*D : s.pumpedAt+4*D;
  const left=exp-now; return {exp, left, lvl: left<=0?'bad':left<12*H?'warn':'ok'};
}
function viewMilk(){
  let h='<div class="wrap" style="gap:12px">';
  const p24=events.filter(e=>e.type==='pump' && Date.now()-e.t<24*H);
  h+=`<h3 class="sec">שאיבה</h3><button class="btn primary w" data-pump>רישום שאיבה</button>
    <p class="note tn">ב־24 השעות האחרונות: ${p24.length} שאיבות, ${p24.reduce((a,e)=>a+(+e.ml||0),0)} מ״ל.</p>`;
  const live=stock.filter(s=>!s.used).map(s=>({...s,st:stockStatus(s)})).sort((x,y)=>x.st.exp-y.st.exp);
  const tot=w=>live.filter(s=>s.where===w).reduce((a,s)=>a+(+s.ml||0),0);
  h+=`<h3 class="sec"><span class="grow">מלאי חלב</span><button class="sbtn w" data-stock-new>+ מנה</button></h3>
    <div class="duo"><div class="card"><div class="stat"><span class="k">מקרר (כולל מופשר)</span><span class="v tn">${tot('fridge')+tot('thawed')} מ״ל</span></div></div><div class="card"><div class="stat"><span class="k">מקפיא</span><span class="v tn">${tot('freezer')} מ״ל</span></div></div></div>`;
  const oldestFrozen=live.filter(s=>s.where==='freezer').sort((x,y)=>x.pumpedAt-y.pumpedAt)[0];
  if(oldestFrozen) h+=`<div class="hint">המנה הוותיקה במקפיא: ${oldestFrozen.ml} מ״ל מ־${dmy(oldestFrozen.pumpedAt)}. היא הבאה בתור להפשרה.</div>`;
  h+= live.length ? '<div class="list">'+live.map(s=>`<div class="row"><div class="main"><b class="tn">${s.ml} מ״ל</b> · ${WHERE[s.where]}<div class="sub tn">נשאב ${dmy(s.pumpedAt)} ${hhmm(s.pumpedAt)}${s.thawedAt?' · הופשר '+hhmm(s.thawedAt):''}</div></div>
      <span class="tag ${s.st.lvl}">${s.st.left<=0?'פג תוקף':'עוד '+(s.st.left>2*D?Math.floor(s.st.left/D)+' ימים':dur(s.st.left))}</span>
      <div class="acts w">${s.where==='freezer'?`<button class="sbtn" data-thaw="${s.id}">הפשרה</button>`:''}<button class="sbtn dark" data-use="${s.id}">שימוש</button><button class="sbtn" data-stock-del="${s.id}" aria-label="מחיקה">✕</button></div></div>`).join('')+'</div>'
    : '<div class="empty">אין מנות במלאי. כשרושמים שאיבה אפשר לסמן שהיא נכנסה למקרר או למקפיא.</div>';
  h+='<p class="note">זמני האחסון לפי ה־CDC לחלב אם בבית: עד 4 ימים במקרר, עד 6 חודשים במקפיא (עד 12 מקובל), ולאחר הפשרה עד 24 שעות במקרר. בפגים או בהנחיה אחרת מהצוות, הנחיית הצוות קובעת.</p>';
  const recent=events.filter(e=>e.type==='pump').slice(0,6);
  if(recent.length) h+='<h3 class="sec">שאיבות אחרונות</h3><div class="list">'+recent.map(itemHtml).join('')+'</div>';
  return h+'</div>';
}

function viewMore(){
  const subs=[['health','בריאות'],['milk','חלב'],['food','מזון מוצק'],['home','בית'],['parents','הורים'],['report','דוח לרופא']];
  return `<div class="wrap" style="gap:12px"><div class="seg" role="group" aria-label="קטגוריה">${subs.map(([v,l])=>`<button data-more="${v}" aria-pressed="${moreSub===v}">${l}</button>`).join('')}</div>`
    + (moreSub==='health'?viewHealth(): moreSub==='milk'?viewMilk(): moreSub==='food'?viewFood(): moreSub==='home'?viewHome(): moreSub==='parents'?viewParents(): viewReport()) + '</div>';
}
function viewFood(){
  let h=`<h3 class="sec">מזון מוצק</h3><div class="actions w"><button class="btn a" data-solid-new="a">טעימה ל${esc(nm('a'))}</button><button class="btn b" data-solid-new="b">טעימה ל${esc(nm('b'))}</button></div>`;
  h+=`<h3 class="sec">חשיפה לאלרגנים</h3><div class="tbl-wrap"><table><thead><tr><th></th><th><span class="dot a"></span> ${esc(nm('a'))}</th><th><span class="dot b"></span> ${esc(nm('b'))}</th></tr></thead><tbody>`
    + Object.entries(ALLERGENS).map(([k,l])=>`<tr><th scope="row">${l}</th>${['a','b'].map(b=>{ const xs=solids.filter(s=>s.baby===b&&(s.allergens||[]).includes(k)).sort((x,y)=>y.t-x.t);
      if(!xs.length) return '<td style="color:var(--muted);font-weight:400">טרם</td>';
      const r=xs.some(s=>s.reaction==='strong')?'bad':xs.some(s=>s.reaction==='mild')?'warn':'ok';
      return `<td>${xs.length}× <span class="tag ${r}">${r==='ok'?'תקין':r==='warn'?'תגובה קלה':'תגובה'}</span><div class="note">אחרון ${dmy(xs[0].t)}</div></td>`; }).join('')}</tr>`).join('')
    + '</tbody></table></div><p class="note">היומן מתעד בלבד. מתי ובאיזה סדר לחשוף לאלרגנים מחליטים עם רופא הילדים, במיוחד בפגות.</p>';
  const rec=[...solids].sort((x,y)=>y.t-x.t).slice(0,30);
  h+='<h3 class="sec">טעימות אחרונות</h3>';
  h+= rec.length ? '<div class="list">'+rec.map(s=>`<button class="item" data-solid-edit="${s.id}"><span class="time tn">${dmy(s.t)}</span><span class="what"><b>${esc(s.foods||'טעימה')}</b><span class="sub">${[(s.allergens||[]).map(a=>ALLERGENS[a]).join(', '), s.reaction&&s.reaction!=='none'?REACT[s.reaction]:'', s.note||''].filter(Boolean).map(esc).join(' · ')||'ללא תגובה'}</span></span><span class="tag ${s.baby}">${esc(nm(s.baby))}</span></button>`).join('')+'</div>'
    : '<div class="empty">עוד אין טעימות. כשמתחילים מזון מוצק, כל טעימה נרשמת כאן עם המזונות, האלרגנים והתגובה.</div>';
  return h;
}
function viewHome(){
  const sorted=[...inv].sort((x,y)=>((+x.qty<=+x.low)?0:1)-((+y.qty<=+y.low)?0:1) || String(x.name).localeCompare(y.name,'he'));
  let h=`<h3 class="sec"><span class="grow">מלאי בבית</span><button class="sbtn w" data-inv-new>+ פריט</button></h3>`;
  h+= sorted.length ? '<div class="list">'+sorted.map(i=>{ const lowNow=(+i.qty||0)<=(+i.low||0);
    return `<div class="row"><div class="main"><b>${esc(i.name)}</b> ${lowNow?'<span class="tag warn">עומד להיגמר</span>':''}<div class="sub">התראה מתחת ל־${i.low??0} ${esc(i.unit||'')}</div></div>
      <div class="qty"><button class="w" data-inv-step="-1" data-inv="${i.id}" aria-label="פחות">−</button><output>${i.qty??0}</output><button class="w" data-inv-step="1" data-inv="${i.id}" aria-label="יותר">+</button></div>
      <button class="sbtn w" data-inv-edit="${i.id}">עריכה</button></div>`; }).join('')+'</div>'
    : `<div class="empty">אין פריטים במלאי. <button class="sbtn w" data-inv-common>הוספת פריטים נפוצים</button></div>`;
  const lowN=inv.filter(i=>(+i.qty||0)<=(+i.low||0) && !shop.some(s=>!s.done && s.text===i.name)).length;
  h+=`<h3 class="sec"><span class="grow">רשימת קניות</span>${lowN?`<button class="sbtn w" data-shop-low>+ ${lowN} שעומדים להיגמר</button>`:''}</h3>
    <form class="free w" id="shopForm" autocomplete="off"><input id="shopIn" placeholder="מה לקנות" aria-label="פריט לרשימת הקניות"><button class="sbtn dark" type="submit">הוספה</button></form>`;
  const sl=[...shop].sort((x,y)=>(x.done-y.done)||(x.created-y.created));
  h+= sl.length ? '<div class="list">'+sl.map(s=>`<div class="row ${s.done?'done':''}"><button class="check" data-shop-toggle="${s.id}" aria-pressed="${!!s.done}" aria-label="סימון">${s.done?'✓':''}</button><div class="main"><b>${esc(s.text)}</b></div><button class="sbtn w" data-shop-del="${s.id}" aria-label="מחיקה">✕</button></div>`).join('')+'</div>'
    + (shop.some(s=>s.done)?'<button class="sbtn w" data-shop-clear>ניקוי מה שנקנה</button>':'')
    : '<p class="note">הרשימה ריקה. היא משותפת לשני ההורים.</p>';
  return h;
}
function viewParents(){
  let h='';
  const now=Date.now();
  const mySleep=psleep.find(e=>e.by===me && !e.end);
  const people=[...new Set([me,...psleep.map(e=>e.by)].filter(Boolean))];
  h+=`<h3 class="sec">שינה של ההורים</h3>`;
  if(me) h+=`<button class="btn ${mySleep?'ghost':'primary'} w" data-psleep>${mySleep?'קמתי':'הולך/ת לישון'}</button>`;
  h+='<div class="list">'+people.map(id=>{ const xs=psleep.filter(e=>e.by===id); const open=xs.find(e=>!e.end);
    const tot=xs.reduce((a,e)=>a+Math.max(0,Math.min(e.end||now,now)-Math.max(e.t,now-24*H)),0);
    return `<div class="row"><div class="main"><b>${esc(id===me?'אני':(byNames[id]||'הורה'))}</b><div class="sub tn">${open?'ישן/ה כבר '+dur(now-open.t):'ער/ה'}</div></div><span class="tag mom tn">${dur(tot)} ב־24 ש׳</span></div>`; }).join('')+'</div>';
  // water
  const w=mine.find(d=>d.id==='water'); const today=new Date().toDateString(); const cnt=w&&w.day===today?w.count:0;
  h+=`<h3 class="sec">מים</h3><div class="card"><div class="stat"><span class="k">היום</span><span class="v tn">${cnt} כוסות</span><span class="s">${w&&w.day===today?'אחרונה '+ago(w.last):'עוד לא נרשם היום'}</span></div>
    ${me?'<button class="btn primary w" data-water>שתיתי כוס</button>':''}<p class="note">אם עוברות 3 שעות בלי כוס, מופיעה תזכורת במסך עכשיו. נשמר רק אצלך.</p></div>`;
  // mom meds
  const mm=meds.filter(m=>(m.babies||[]).includes('mom'));
  h+=`<h3 class="sec"><span class="grow">התאוששות ותרופות של האם</span><button class="sbtn w" data-med-new-mom>+ תרופה</button></h3>`;
  h+= mm.length ? '<div class="list">'+mm.map(m=>{ const last=events.find(e=>e.type==='med'&&e.medId===m.id&&e.baby==='mom'); const dueNow=!last||now-last.t>=(+m.everyH||24)*H;
    return `<div class="row"><div class="main"><b>${esc(m.name)}</b> <span class="tag ${dueNow?'warn':'ok'}">${dueNow?'הגיע הזמן':'ניתן'}</span><div class="sub tn">${esc(m.dose||'')} · ${last?'אחרון '+hhmm(last.t)+', '+ago(last.t):'עוד לא ניתן'}</div></div><button class="sbtn mom w" data-give="${m.id}" data-baby="mom">ניתן</button><button class="sbtn w" data-med-edit="${m.id}">עריכה</button></div>`; }).join('')+'</div>'
    : '<p class="note">אין תרופות לאם ברשימה. משככי כאבים, ברזל או כל תרופה אחרת לפי הנחיית הרופא נכנסים לכאן, עם אותה הגנה מפני מנה כפולה.</p>';
  // feelings
  const feels=mine.filter(d=>d.kind==='feel').sort((x,y)=>y.t-x.t);
  const recentLow=feels.slice(0,3).filter(f=>f.mood<=2).length;
  h+=`<h3 class="sec">איך את/ה מרגיש/ה</h3><div class="card"><p class="note">נשמר רק אצלך. גם ההורה השני לא רואה את זה.</p>
    ${me?`<div class="mood" role="group" aria-label="מצב רוח">${MOODS.map(([v,l])=>`<button data-mood="${v}" aria-pressed="false">${l}</button>`).join('')}</div>
    <textarea id="feelTxt" placeholder="כמה מילים, אם בא לך"></textarea><button class="btn primary w" data-feel-save>שמירה</button>`:'<p class="note">צריך להיות מחובר/ת כדי לשמור.</p>'}</div>`;
  h+=`<div class="help"${recentLow?'':' style="background:var(--surface-2)"'}>${recentLow?'<div><b style="user-select:auto">לא חייבים להתמודד עם זה לבד.</b></div>':''}
    <div>אפשר לדבר עם אחות טיפת חלב, רופא/ת המשפחה או הגניקולוג/ית. דיכאון וחרדה אחרי לידה נפוצים ומטופלים.</div>
    <div>ער״ן, עזרה נפשית ראשונה, 24/7: <b>1201</b></div><div>במצב חירום: מד״א <b>101</b></div></div>`;
  if(feels.length) h+='<div class="list">'+feels.slice(0,10).map(f=>`<div class="row"><div class="main"><b>${MOODS.find(m=>m[0]===f.mood)?.[1]||''}</b><div class="sub tn">${dmy(f.t)} ${hhmm(f.t)}${f.text?' · '+esc(f.text):''}</div></div></div>`).join('')+'</div>';
  return h;
}
function viewReport(){
  let h=`<h3 class="sec">דוח לגורם מטפל</h3><p class="note">דוח של עמוד אחד לרופא, לאחות טיפת חלב או ליועצת הנקה או שינה.</p>
    <div class="field"><span>תאום</span><div class="seg">${[['a',nm('a')],['b',nm('b')]].map(([v,l])=>`<button data-rep-baby="${v}" aria-pressed="${rep.baby===v}">${esc(l)}</button>`).join('')}</div></div>
    <div class="field"><span>תקופה</span><div class="chips">${[[1,'יממה'],[3,'3 ימים'],[7,'שבוע'],[14,'שבועיים']].map(([v,l])=>`<button class="chip" data-rep-days="${v}" aria-pressed="${rep.days===v}">${l}</button>`).join('')}</div></div>
    <div class="actions">${downloads?'<button class="btn primary" data-rep-dl>הורדה כקובץ</button>':''}<button class="btn ghost" data-rep-copy>העתקה כטקסט</button></div>`;
  h+=`<div class="preview" dir="rtl">${reportBody(rep.baby,rep.days)}</div>`;
  if(!downloads) h+='<p class="note">הורדת קובץ לא זמינה בתצוגה הזו. אפשר להעתיק את הדוח כטקסט ולהדביק במייל או בוואטסאפ.</p>';
  return h;
}
function reportData(k,days){
  const now=Date.now(), d0=new Date(); d0.setHours(0,0,0,0);
  const rows=[]; for(let i=days-1;i>=0;i--){ const s=d0.getTime()-i*D; rows.push({s, st:stats(k,s,Math.min(s+D,now))}); }
  const from=rows[0].s;
  const inP=e=>e.baby===k && e.t>=from;
  return {rows, from,
    temps:events.filter(e=>inP(e)&&e.type==='temp').sort((x,y)=>x.t-y.t),
    flags:events.filter(e=>inP(e)&&e.type==='diaper'&&(e.color==='pale'||e.color==='red'||e.rash)),
    medsGiven:Object.entries(events.filter(e=>inP(e)&&e.type==='med').reduce((a,e)=>{ a[e.medName]=(a[e.medName]||0)+1; return a; },{})),
    notes:events.filter(e=>inP(e)&&e.note).sort((x,y)=>x.t-y.t).slice(-15),
    g:growth.filter(x=>x.baby===k).sort((x,y)=>y.date.localeCompare(x.date)).slice(0,4),
    sol:solids.filter(s=>s.baby===k&&s.t>=from&&s.reaction&&s.reaction!=='none')};
}
function reportBody(k,days){
  const r=reportData(k,days); const sum=f=>r.rows.reduce((a,x)=>a+f(x.st),0); const n=r.rows.length;
  const avg=(f,dec=0)=>{ const v=sum(f)/n; return dec?v.toFixed(dec):Math.round(v); };
  let h=`<h1>${esc(nm(k))}</h1><div class="note">${cfg.birth?'נולד/ה '+new Date(cfg.birth).toLocaleDateString('he-IL')+' · ':''}${esc(ageText())}${cfg.ga?' · שבוע לידה '+esc(cfg.ga):''}</div>
    <div class="note">${new Date(r.from).toLocaleDateString('he-IL')}–${new Date().toLocaleDateString('he-IL')} · הופק ${new Date().toLocaleString('he-IL',{dateStyle:'short',timeStyle:'short'})}</div>
    <h2>ממוצע ליממה</h2><div class="note tn">${avg(x=>x.feeds)} האכלות · ${avg(x=>x.nurseMin)} דק׳ הנקה · ${avg(x=>x.ml)} מ״ל בקבוק · ${avg(x=>x.wet)} רטובים · ${avg(x=>x.dirty)} קקי · ${avg(x=>(x.sleepDay+x.sleepNight)/H,1)} ש׳ שינה</div>
    <h2>פירוט יומי</h2><div class="tbl-wrap"><table><thead><tr><th>יום</th><th>האכלות</th><th>הנקה (דק׳)</th><th>בקבוק (מ״ל)</th><th>רטובים</th><th>קקי</th><th>שינה יום</th><th>שינה לילה</th></tr></thead><tbody>
    ${r.rows.map(x=>`<tr><td>${new Date(x.s).toLocaleDateString('he-IL',{weekday:'short',day:'numeric',month:'numeric'})}</td><td>${x.st.feeds}</td><td>${x.st.nurseMin||'—'}</td><td>${x.st.ml||'—'}</td><td>${x.st.wet}</td><td>${x.st.dirty}</td><td>${x.st.sleepDay?dur(x.st.sleepDay):'—'}</td><td>${x.st.sleepNight?dur(x.st.sleepNight):'—'}</td></tr>`).join('')}</tbody></table></div>`;
  if(r.g.length) h+=`<h2>מדידות</h2>`+r.g.map(x=>`<div class="note tn">${dmy(new Date(x.date))}: ${[x.w?x.w+' גרם':'',x.len?x.len+' ס״מ':'',x.head?'ראש '+x.head+' ס״מ':''].filter(Boolean).join(' · ')}</div>`).join('');
  if(r.temps.length) h+=`<h2>חום</h2>`+r.temps.map(e=>`<div class="note tn">${dmy(e.t)} ${hhmm(e.t)}: ${e.c}°${e.method?' ('+TMETH[e.method]+')':''}</div>`).join('');
  if(r.medsGiven.length) h+=`<h2>תרופות ותוספים שניתנו</h2>`+r.medsGiven.map(([m,c])=>`<div class="note">${esc(m)}: ${c} פעמים</div>`).join('');
  if(r.flags.length) h+=`<h2>חיתולים לתשומת לב</h2>`+r.flags.map(e=>`<div class="note tn">${dmy(e.t)} ${hhmm(e.t)}: ${esc(summary(e))}</div>`).join('');
  if(r.sol.length) h+=`<h2>תגובות למזון</h2>`+r.sol.map(s=>`<div class="note">${dmy(s.t)}: ${esc(s.foods||'')} · ${REACT[s.reaction]}${s.note?' · '+esc(s.note):''}</div>`).join('');
  if(r.notes.length) h+=`<h2>הערות ההורים</h2>`+r.notes.map(e=>`<div class="note tn">${dmy(e.t)} ${hhmm(e.t)} · ${label(e)}: ${esc(e.note)}</div>`).join('');
  h+=`<p class="note" style="margin-top:12px">הנתונים נרשמו על ידי ההורים ביומן התאומים.</p>`;
  return h;
}
function reportFile(k,days){
  return `<!doctype html><html lang="he" dir="rtl"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>דוח · ${esc(nm(k))}</title>
<style>body{font-family:Arial,"Assistant",sans-serif;color:#111;background:#fff;max-width:780px;margin:24px auto;padding:0 16px;font-size:14px;line-height:1.45}h1{font-size:22px;margin:0 0 4px}h2{font-size:15px;margin:16px 0 6px;border-bottom:1px solid #ccc;padding-bottom:3px}.note{color:#333}table{border-collapse:collapse;width:100%;font-size:13px}th,td{border:1px solid #ccc;padding:4px 6px;text-align:start}th{background:#f2f2f2}.tbl-wrap{overflow-x:auto}@media print{body{margin:0}}</style></head><body>${reportBody(k,days)}</body></html>`;
}
function reportText(k,days){
  const div=document.createElement('div'); div.innerHTML=reportBody(k,days);
  div.querySelectorAll('tr').forEach(tr=>{ tr.textContent=[...tr.children].map(c=>c.textContent.trim()).join(' | ')+'\n'; });
  div.querySelectorAll('h1,h2,div.note,p').forEach(el=>el.append('\n'));
  return div.textContent.replace(/\n{3,}/g,'\n\n').trim();
}

/* ---------- free text ---------- */
function parseFree(txt){
  const norm = x => x.replace(/ך/g,'כ').replace(/ם/g,'מ').replace(/ן/g,'נ').replace(/ף/g,'פ').replace(/ץ/g,'צ');
  const segs=txt.split(/[,;\n،]+|\.(?!\d)|\s+וגם\s+/).map(s=>s.trim()).filter(Boolean);
  const A=nm('a').trim(), B=nm('b').trim(); let baby=null; const out=[];
  for(const raw of segs){
    const ia=!!A && raw.includes(A), ib=!!B && raw.includes(B);
    const s=norm(raw); const T=p=>new RegExp(norm(p)).test(s);
    if(T('שניהם|שתיהן|שניהן|שתיהם|שני התאומים|התאומים') || (ia&&ib)) baby='both'; else if(ia) baby='a'; else if(ib) baby='b';
    if(!baby) continue;
    let t=Date.now(), m;
    if(m=s.match(/לפני\s*(\d+)\s*(?:דק׳|דקות|דק)/)) t-=(+m[1])*M;
    else if(m=s.match(/לפני\s*(\d+(?:\.\d+)?)\s*(?:שעות|שעה|ש׳)/)) t-=(+m[1])*H;
    else if(T('לפני\\s*חצי\\s*שעה')) t-=30*M; else if(T('לפני\\s*שעתיים')) t-=2*H; else if(T('לפני\\s*שעה')) t-=H;
    else if(m=s.match(/(\d{1,2}):(\d{2})/)) t=fromTime(pad(+m[1])+':'+m[2])||t;
    const it={baby,t};
    const ml=s.match(/(\d+)\s*(?:מ["״׳']?ל|ml|סמ["״]ק)/i);
    const tc=s.match(/(3[4-9](?:\.\d)?|4[0-2](?:\.\d)?)/);
    const word = w => new RegExp('(^|\\s)('+norm(w)+')(\\s|$)').test(s);
    if(T('חום') && tc){ it.type='temp'; it.c=+tc[1]; }
    else if(T('חיתול|החלפ|קקי|פיפי|רטוב|צואה|יבש')){ it.type='diaper'; const poo=T('קקי|צואה'), wet=T('פיפי|רטוב'); it.kind=poo&&wet?'mixed':poo?'dirty':wet?'wet':T('יבש')?'dry':null; if(T('פריחה')) it.rash=true; }
    else if(T('התעורר') || word('קם|קמה|קמו|ער|ערה|ערים')) it.type='wake';
    else if(T('נרדמ|הלכ לישונ|הלכה לישונ|הלכו לישונ|השכבנו|השכבתי') || word('ישן|ישנה|ישנים|ישנות')) it.type='sleep';
    else if(ml || T('בקבוק|האכל|אכל|ינק|הנק|שמאל|ימין')){
      it.type='feed';
      if(ml || T('בקבוק')){ it.side='bottle'; if(ml) it.ml=+ml[1]; if(/תמ["״]?ל|פורמולה/.test(s)) it.milk='formula'; else if(T('שאוב|חלב אם')) it.milk='pumped'; }
      else if(T('שני הצדדים|שני צדדים')) it.side='both'; else if(T('שמאל')) it.side='L'; else if(T('ימין')) it.side='R';
      const mm=s.match(/(?<!לפני\s{0,3})(\d+)\s*(?:דק׳|דקות|דק)/); if(mm && it.side!=='bottle') it.mins=+mm[1];
    }
    if(!it.type) continue;
    const nt=[]; if(T('פליט')) nt.push('פליטה'); if(T('הקא')) nt.push('הקאה'); if(T('גרעפס')) nt.push('גרעפס'); if(nt.length) it.note=nt.join(', ');
    out.push(it);
  }
  return out;
}
function describeParsed(it){
  if(it.type==='wake') return 'התעורר/ה · '+hhmm(it.t);
  if(it.type==='sleep') return 'נרדם/ה · '+hhmm(it.t);
  const s=summary({...it}); return TYPE[it.type]+' · '+hhmm(it.t)+(s.startsWith('בלי פרטים')?'':' · '+s);
}
function freeSubmit(txt){
  const items=parseFree(txt);
  if(!items.length){ toastMsg(`לא זיהיתי רישום. כתבו את שם התאום ומה קרה, למשל: ״${nm('a')} 90 מ״ל, ${nm('b')} חיתול קקי״.`); return; }
  openSheet(`<h4>לרשום את זה?</h4><div class="list">${items.map(it=>`<div class="row">${it.baby==='both'?'<span class="tag mom">שניהם</span>':av(it.baby,'sm')}<div class="main"><b>${it.baby==='both'?'שניהם':esc(nm(it.baby))}</b><div class="sub tn">${esc(describeParsed(it))}</div></div></div>`).join('')}</div>
    <p class="note">אפשר להשלים או לתקן כל רישום אחר כך מציר הזמן.</p>
    <div class="actions"><button class="btn ghost" id="x-close">ביטול</button><button class="btn primary" id="x-save">רישום</button></div>`, sh=>{
    sh.querySelector('#x-close').onclick=closeSheet;
    sh.querySelector('#x-save').onclick=async()=>{ closeSheet(); $('#freeIn').value='';
      for(const it of items){ const {baby,type,...rest}=it;
        for(const k of baby==='both'?['a','b']:[baby]){
          if(type==='wake'){ const o=openSleep(k); if(o) await patchEvent(o.id,{end:Math.max(it.t,o.t+M)}); }
          else if(type==='sleep'){ if(!openSleep(k)) await addDoc('events',{type:'sleep',baby:k,t:it.t,end:null,period:isNight(it.t)?'night':'day'}); }
          else await addDoc('events',{type,baby:k,...rest});
        } }
      toastMsg(items.length===1?'נרשם':`נרשמו ${items.length} רישומים`); };
  });
}

/* ---------- more: sheets ---------- */
function editSolid(sid, babyDefault){
  const s=solids.find(x=>x.id===sid)||{baby:babyDefault||'a',foods:'',allergens:[],reaction:'none',note:'',t:Date.now()};
  const st={baby:s.baby, reaction:s.reaction||'none'}; let al=[...(s.allergens||[])];
  const local=new Date(s.t-new Date().getTimezoneOffset()*M).toISOString().slice(0,16);
  openSheet(`<h4>${sid?'עריכת':''} טעימה</h4><div class="field"><span>למי</span>${babyPicker(st.baby,!sid)}</div>
    <label class="field"><span>מה אכל/ה</span><input id="o-f" value="${esc(s.foods||'')}" placeholder="אבוקדו, בטטה"></label>
    <div class="field"><span>אלרגנים בטעימה (אפשר כמה)</span><div class="opts" id="o-al">${Object.entries(ALLERGENS).map(([k,l])=>`<button type="button" data-al="${k}" aria-pressed="${al.includes(k)}">${l}</button>`).join('')}</div></div>
    <div class="field"><span>תגובה</span>${optsHtml('reaction',REACT,st.reaction)}</div>
    <label class="field"><span>מתי</span><input id="o-t" type="datetime-local" value="${local}"></label>
    <label class="field"><span>הערה (מה הייתה התגובה, כמה זמן אחרי)</span><textarea id="o-n">${esc(s.note||'')}</textarea></label>${actionsHtml(!!sid)}`, sh=>{
    bindOpts(sh,st); sh.querySelector('#x-close').onclick=closeSheet; bindDel(sh,()=>delDoc('solids/'+sid));
    sh.querySelector('#o-al').addEventListener('click',ev=>{ const b=ev.target.closest('[data-al]'); if(!b) return; const k=b.dataset.al; al=al.includes(k)?al.filter(x=>x!==k):[...al,k]; b.setAttribute('aria-pressed',al.includes(k)); });
    sh.querySelector('#x-save').onclick=async()=>{ const tv=sh.querySelector('#o-t').value; const body={foods:sh.querySelector('#o-f').value.trim(),allergens:al,reaction:st.reaction||'none',note:sh.querySelector('#o-n').value.trim()||null,t:tv?new Date(tv).getTime():Date.now()};
      if(!body.foods && !al.length) return; closeSheet();
      if(sid) await setDoc('solids/'+sid,{...body,baby:st.baby||s.baby,by:s.by||me||null});
      else for(const k of (st.baby==='both'?['a','b']:[st.baby||'a'])) await addDoc('solids',{...body,baby:k}); };
  });
}
function editInv(iid){
  const i=inv.find(x=>x.id===iid)||{name:'',qty:0,unit:'יח׳',low:1};
  openSheet(`<h4>${iid?'עריכת':'הוספת'} פריט</h4><label class="field"><span>שם</span><input id="i-n" value="${esc(i.name)}"></label>
    <div class="two"><label class="field"><span>כמה יש</span><input id="i-q" type="number" inputmode="numeric" min="0" value="${i.qty??0}"></label><label class="field"><span>יחידה</span><input id="i-u" value="${esc(i.unit||'')}"></label></div>
    <label class="field"><span>להתריע כשנשארים (או פחות)</span><input id="i-l" type="number" inputmode="numeric" min="0" value="${i.low??1}"></label>${actionsHtml(!!iid)}`, sh=>{
    sh.querySelector('#x-close').onclick=closeSheet; bindDel(sh,()=>delDoc('inv/'+iid));
    sh.querySelector('#x-save').onclick=async()=>{ const name=sh.querySelector('#i-n').value.trim(); if(!name) return;
      const body={name,qty:num(sh,'#i-q')??0,unit:sh.querySelector('#i-u').value.trim(),low:num(sh,'#i-l')??0}; closeSheet();
      if(iid) await setDoc('inv/'+iid,body); else await addDoc('inv',body); };
  });
}
const invTimers={};
function invStep(id,step){
  const i=inv.find(x=>x.id===id); if(!i) return; i.qty=Math.max(0,(+i.qty||0)+step); render();
  clearTimeout(invTimers[id]); invTimers[id]=setTimeout(()=>updDoc('inv/'+id,{qty:i.qty}),700);
}

/* ---------- live tick ---------- */
function tick(){
  for(const k of ['a','b']){ const t=timers[k]; if(!t) continue;
    const now=Date.now(), cur=now-t.segStart, L=(t.L||0)+(t.side==='L'?cur:0), R=(t.R||0)+(t.side==='R'?cur:0);
    const el=document.querySelector(`[data-live="tel-${k}"]`); if(el) el.textContent=clock(cur);
    const rd=document.getElementById('rd-'+k); if(rd) rd.textContent=clock(now-t.startedAt);
    const mt=document.querySelector(`[data-live="tmeta-${k}"]`); if(mt) mt.textContent=`סה״כ ${clock(now-t.startedAt)} · שמאל ${clock(L)} · ימין ${clock(R)}`;
  }
}
setInterval(tick,1000);
setInterval(()=>{ if($('#scrim').hidden && $('#toast').hidden && !document.activeElement?.matches?.('input,textarea,select')) render(); },30000);

/* ---------- writes ---------- */
function setSync(state,txt){ $('#sync').className='sync '+state; $('#syncTxt').textContent=txt; }
const whenTs = () => Date.now()-offsetMin*M;
function resetWhen(){ offsetMin=0; }
function writeFail(e){ if(e?.code==='invalid_argument' && canWrite!==true){ canWrite=false; applyRO(); toastMsg('אין הרשאה לרשום בעמוד הזה. מצב צפייה בלבד.'); return; }
  toastMsg(e?.code==='quota_exceeded'?'המאגר מלא. צריך למחוק רישומים ישנים.':'הפעולה לא נשמרה. בדקו חיבור ונסו שוב.'); }
async function addDoc(col, data){
  if(!db){ toastMsg('אין חיבור למאגר. הרישום לא נשמר.'); return null; }
  const ref=db.collection(col).doc(); const body={...data, by:me||null, created:Date.now()};
  if(col==='events'){ events=[{id:ref.id,...body},...events].sort((x,y)=>y.t-x.t); render(); }
  try{ await ref.set(body); return ref.id; }catch(e){ if(col==='events'){ events=events.filter(x=>x.id!==ref.id); render(); } writeFail(e); return null; }
}
async function patchEvent(id,data){
  const i=events.findIndex(e=>e.id===id); if(i<0||!db) return;
  events[i]={...events[i],...data}; events.sort((x,y)=>y.t-x.t); render();
  try{ await db.doc('events/'+id).update(data); }catch(e){ writeFail(e); }
}
async function removeEvents(ids){ events=events.filter(e=>!ids.includes(e.id)); render(); for(const id of ids){ try{ await db.doc('events/'+id).delete(); }catch(e){} } }
async function setDoc(path,data){ if(!db) return; try{ await db.doc(path).set(data); }catch(e){ writeFail(e); } }
async function updDoc(path,data){ if(!db) return; try{ await db.doc(path).update(data); }catch(e){ writeFail(e); } }
async function delDoc(path){ if(!db) return; try{ await db.doc(path).delete(); }catch(e){ writeFail(e); } }

async function act(type, baby){
  const t=whenTs(); resetWhen();
  const babies = baby==='both'?['a','b']:[baby];
  if(type==='nurse'){ for(const k of babies) if(!timers[k]) await startTimer(k, t, baby==='both'); return; }
  if(type==='sleep'){
    const open=babies.map(openSleep);
    const waking = baby==='both' ? open.every(Boolean) : !!open[0];
    if(waking){ const ids=[]; for(const s of open){ if(s){ ids.push(s.id); await patchEvent(s.id,{end:Math.max(t,s.t+M)}); } }
      toast({msg:(baby==='both'?'שניהם התעוררו':nm(baby)+' '+g(baby,'התעורר','התעוררה'))+' · '+hhmm(t), undo:async()=>{ for(const id of ids) await patchEvent(id,{end:null}); }, edit:ids[0]});
    } else { const ids=[]; for(const k of babies){ if(!openSleep(k)){ const id=await addDoc('events',{type:'sleep',baby:k,t,end:null,period:isNight(t)?'night':'day'}); if(id) ids.push(id);} }
      if(ids.length) toast({msg:(baby==='both'?'שניהם נרדמו':nm(baby)+' '+g(baby,'נרדם','נרדמה'))+' · '+hhmm(t), undo:()=>removeEvents(ids), quick:{field:'loc', opts:[['crib','מיטה'],['bassinet','עריסה'],['arms','ידיים'],['stroller','עגלה']]}, ids}); }
    return;
  }
  const extra = (type==='feed'&&baby==='both') ? {together:true} : {};
  const ids=[]; for(const k of babies){ const id=await addDoc('events',{type,baby:k,t,...extra}); if(id) ids.push(id); }
  if(!ids.length) return;
  let quick=null;
  if(type==='feed'){ const sug=baby==='both'?null:suggestSide(baby);
    quick={field:'side', opts: baby==='both' ? [['both','הנקה'],['bottle','בקבוק']] : [['L','שמאל'+(sug==='L'?' ✓':'')],['R','ימין'+(sug==='R'?' ✓':'')],['bottle','בקבוק']]}; }
  if(type==='diaper') quick={field:'kind', opts:[['wet','רטוב'],['dirty','קקי'],['mixed','שניהם'],['dry','יבש']]};
  const extraBtns = type==='feed' ? [['burp','+ גרעפס'],['spit','+ פליטה']].map(([ty,l])=>[l,()=>quickLog(ty,baby)]) : null;
  toast({msg:TYPE[type]+' · '+(baby==='both'?'שניהם':nm(baby))+' · '+hhmm(t), undo:()=>removeEvents(ids), quick, ids, edit:ids.length===1?ids[0]:null, extra:extraBtns});
}

/* timers */
async function startTimer(k, t, together){
  const side=suggestSide(k)||'L';
  const body={baby:k, startedAt:t, segStart:t, side, L:0, R:0, together:!!together, by:me||null};
  timers[k]=body; render();
  await setDoc('timers/'+k, body);
}
async function timerAct(a,k){
  const t=timers[k]; if(!t) return; const now=Date.now();
  if(a==='switch'){ const cur=now-t.segStart; const n={...t, [t.side]:(t[t.side]||0)+cur, side:t.side==='L'?'R':'L', segStart:now}; timers[k]=n; render(); await setDoc('timers/'+k,n); return; }
  if(a==='cancel'){ delete timers[k]; render(); await delDoc('timers/'+k); toastMsg('השעון בוטל. לא נרשמה האכלה.'); return; }
  if(a==='stop'){
    const cur=now-t.segStart; const L=(t.L||0)+(t.side==='L'?cur:0), R=(t.R||0)+(t.side==='R'?cur:0);
    const minsL=Math.round(L/M), minsR=Math.round(R/M);
    const side = (minsL&&minsR)?'both':(minsR>minsL?'R':'L');
    delete timers[k]; render(); await delDoc('timers/'+k);
    const id=await addDoc('events',{type:'feed',baby:k,t:t.startedAt,side,minsL:minsL||null,minsR:minsR||null,lastSide:t.side,together:!!t.together});
    if(id) toast({msg:`הנקה · ${nm(k)} · ${dur(now-t.startedAt)}`, undo:()=>removeEvents([id]), edit:id});
  }
}

/* ---------- toast ---------- */
let toastTimer=null;
function hideToast(){ $('#toast').hidden=true; clearTimeout(toastTimer); }
function arm(ms){ clearTimeout(toastTimer); toastTimer=setTimeout(hideToast,ms); }
const toastMsg = msg => toast({msg});
async function quickLog(type, baby){ const ks=baby==='both'?['a','b']:[baby]; const ids=[]; for(const k of ks){ const id=await addDoc('events',{type,baby:k,t:Date.now()}); if(id) ids.push(id); } return ids; }
function toast({msg, undo, quick, ids, edit, extra}){
  const box=$('#toast .in');
  box.innerHTML=`<div class="r"><span class="msg tn"></span>${edit?'<button class="undo" data-t="edit">פרטים</button>':''}${undo?'<button class="undo" data-t="undo">ביטול</button>':''}</div>${quick?'<div class="quick"></div>':''}${extra?'<div class="quick extra"></div>':''}`;
  box.querySelector('.msg').textContent=msg;
  if(undo) box.querySelector('[data-t="undo"]').onclick=async()=>{ hideToast(); await undo(); };
  if(edit) box.querySelector('[data-t="edit"]').onclick=()=>{ hideToast(); editEvent(edit); };
  if(quick){ const q=box.querySelector('.quick');
    quick.opts.forEach(([v,l])=>{ const b=document.createElement('button'); b.textContent=l; b.setAttribute('aria-pressed','false');
      b.onclick=async()=>{ q.querySelectorAll('button').forEach(x=>x.setAttribute('aria-pressed',x===b));
        const data={[quick.field]:v};
        if(v==='bottle'){ const k=events.find(e=>e.id===ids[0])?.baby; const lb=lastBottle(k); if(lb){ data.ml=lb.ml; if(lb.milk) data.milk=lb.milk; } }
        for(const id of ids) await patchEvent(id,data); arm(4000); };
      q.appendChild(b); }); }
  if(extra){ const q=box.querySelector('.extra'); extra.forEach(([l,fn])=>{ const b=document.createElement('button'); b.textContent=l; let n=0; b.onclick=async()=>{ n++; b.textContent=l+(n>1?' ×'+n:' ✓'); await fn(); arm(6000); }; q.appendChild(b); }); }
  $('#toast').hidden=false; arm(quick||extra?9000:6000);
}

/* ---------- sheets ---------- */
function openSheet(html,bind){ $('#sheet').innerHTML=html; $('#scrim').hidden=false; bind && bind($('#sheet')); }
function closeSheet(){ $('#scrim').hidden=true; $('#sheet').innerHTML=''; }
$('#scrim').addEventListener('click',e=>{ if(e.target.id==='scrim') closeSheet(); });
document.addEventListener('keydown',e=>{ if(e.key==='Escape' && !$('#scrim').hidden) closeSheet(); });
const optsHtml=(name,map,cur,sw)=>`<div class="opts ${sw?'sw':''}" data-name="${name}">`+Object.entries(map).map(([v,l])=>sw?`<button type="button" data-v="${v}" aria-pressed="${cur===v}"><i style="background:${l[1]}"></i>${l[0]}</button>`:`<button type="button" data-v="${v}" aria-pressed="${cur===v}">${l}</button>`).join('')+'</div>';
function bindOpts(sh,state,onPick){ sh.querySelectorAll('.opts[data-name]').forEach(g=>g.addEventListener('click',ev=>{ const b=ev.target.closest('button'); if(!b) return;
  const n=g.dataset.name, v=b.dataset.v; state[n]= state[n]===v?null:v; g.querySelectorAll('button').forEach(x=>x.setAttribute('aria-pressed',x.dataset.v===state[n])); onPick&&onPick(n,state[n]); })); }
const tIn = t => t?hhmm(t):'';
function fromTime(val, ref){ if(!val) return null; const [h,m]=val.split(':').map(Number); const d=new Date(ref||Date.now()); d.setHours(h,m,0,0); if(d.getTime()>Date.now()+M) d.setDate(d.getDate()-1); return d.getTime(); }
const num = (sh,id) => { const v=parseFloat(sh.querySelector(id)?.value); return isNaN(v)?null:v; };
const actionsHtml = (del=true) => `<div class="actions">${del?'<button class="btn danger" id="x-del">מחיקה</button>':''}<button class="btn ghost" id="x-close">סגירה</button><button class="btn primary w" id="x-save">שמירה</button></div>`;
function bindDel(sh, fn){ const b=sh.querySelector('#x-del'); if(!b) return; let armed=false; b.onclick=async()=>{ if(!armed){ armed=true; b.textContent='למחוק?'; return; } closeSheet(); await fn(); }; }

function editEvent(id){
  const e=events.find(x=>x.id===id); if(!e) return; const st={...e};
  let body='';
  const timeRow = e.type==='sleep'
    ? `<div class="two"><label class="field"><span>נרדם/ה</span><input id="f-t" type="time" value="${tIn(e.t)}"></label><label class="field"><span>התעורר/ה</span><input id="f-end" type="time" value="${tIn(e.end)}"></label></div>`
    : `<label class="field"><span>שעה</span><input id="f-t" type="time" value="${tIn(e.t)}"></label>`;
  if(e.type==='feed') body=`<div class="field"><span>סוג</span>${optsHtml('side',SIDE,e.side)}</div>
    <div class="two"><label class="field"><span>דקות בשמאל</span><input id="f-ml-l" type="number" inputmode="numeric" min="0" value="${e.minsL??''}"></label><label class="field"><span>דקות בימין</span><input id="f-ml-r" type="number" inputmode="numeric" min="0" value="${e.minsR??''}"></label></div>
    <h5>בקבוק</h5><div class="two"><label class="field"><span>ניתן (מ״ל)</span><input id="f-ml" type="number" inputmode="numeric" min="0" step="5" value="${e.ml??''}"></label><label class="field"><span>נשאר (מ״ל)</span><input id="f-left" type="number" inputmode="numeric" min="0" step="5" value="${e.mlLeft??''}"></label></div>
    <div class="field"><span>סוג חלב</span>${optsHtml('milk',MILK,e.milk)}</div>
    <label class="field"><span>העשרה או תוספת (לפי הנחיית הצוות)</span><input id="f-fort" value="${esc(e.fortify||'')}"></label>
    <div class="field"><span>תיוג</span>${optsHtml('flags',{burp:'גרעפס',spit:'פליטה',vomit:'הקאה',distress:'מצוקה'},null)}</div>`;
  if(e.type==='diaper') body=`<div class="field"><span>מה היה</span>${optsHtml('kind',DIAPER,e.kind)}</div><div class="field"><span>כמות</span>${optsHtml('amount',DAMT,e.amount)}</div>
    <div class="field"><span>צבע</span>${optsHtml('color',STOOL,e.color,true)}</div><div class="field"><span>מרקם</span>${optsHtml('texture',TEXTURE,e.texture)}</div>
    <div class="field"><span>עור</span>${optsHtml('rash',{yes:'יש פריחה'},e.rash?'yes':null)}</div>`;
  if(e.type==='sleep') body=`<div class="field"><span>שנת</span>${optsHtml('period',PERIOD,e.period||(isNight(e.t)?'night':'day'))}</div>
    <div class="field"><span>מיקום</span>${optsHtml('loc',SLOC,e.loc)}</div><div class="field"><span>תנוחה</span>${optsHtml('pos',SPOS,e.pos)}</div>
    <div class="field"><span>התעוררויות באמצע</span><div class="stepper"><button type="button" data-step="-1" aria-label="פחות">−</button><output id="f-wk">${e.wakings||0}</output><button type="button" data-step="1" aria-label="יותר">+</button></div></div>
    <div class="field"><span>הירדמות</span>${optsHtml('hard',{yes:'הירדמות קשה'},e.hard?'yes':null)}</div>`;
  if(e.type==='pump') body=`<div class="field"><span>צד</span>${optsHtml('side',{L:'שמאל',R:'ימין',both:'שניהם'},e.side)}</div><label class="field"><span>כמות (מ״ל)</span><input id="f-ml" type="number" inputmode="numeric" min="0" step="5" value="${e.ml??''}"></label>`;
  if(e.type==='temp') body=`<label class="field"><span>חום (°C)</span><input id="f-c" type="number" inputmode="decimal" step="0.1" value="${e.c??''}"></label><div class="field"><span>שיטת מדידה</span>${optsHtml('method',TMETH,e.method)}</div>`;
  if(e.type==='care') body=`<div class="field"><span>סוג</span>${optsHtml('care',CARE,e.care)}</div><label class="field"><span>משך (דק׳)</span><input id="f-mins" type="number" inputmode="numeric" min="0" value="${e.mins??''}"></label>`;
  const who=whoTxt(e.by);
  openSheet(`<h4>${e.baby==='mom'?'':av(e.baby)}${label(e)} · ${esc(nm(e.baby))}</h4>${who?`<p class="note">נרשם על ידי ${esc(who)}</p>`:''}
    ${timeRow}${body}<label class="field"><span>הערה</span><textarea id="f-note">${esc(e.note||'')}</textarea></label>${actionsHtml()}`, sh=>{
    st.flags=null; bindOpts(sh,st,(n,v)=>{
      if(n==='side' && v==='bottle' && !sh.querySelector('#f-ml').value){ const lb=lastBottle(e.baby); if(lb){ sh.querySelector('#f-ml').value=lb.ml; if(lb.milk&&!st.milk){ st.milk=lb.milk; sh.querySelectorAll('[data-name="milk"] button').forEach(x=>x.setAttribute('aria-pressed',x.dataset.v===lb.milk)); } } }
      if(n==='flags' && v){ const ta=sh.querySelector('#f-note'); const w={burp:'גרעפס',spit:'פליטה',vomit:'הקאה',distress:'מצוקה'}[v]; if(!ta.value.includes(w)) ta.value=(ta.value?ta.value+', ':'')+w; }
    });
    sh.querySelectorAll('[data-step]').forEach(b=>b.onclick=()=>{ const o=sh.querySelector('#f-wk'); o.textContent=Math.max(0,(+o.textContent)+(+b.dataset.step)); });
    sh.querySelector('#x-close').onclick=closeSheet; bindDel(sh,()=>removeEvents([id]));
    sh.querySelector('#x-save').onclick=async()=>{
      const d={}; const t=fromTime(sh.querySelector('#f-t').value,e.t); if(t) d.t=t;
      if(e.type==='sleep'){ const en=sh.querySelector('#f-end').value; d.end=en?fromTime(en,e.end||t||e.t):null; if(d.end&&d.end<(d.t||e.t)) d.end+=D; if(d.end&&d.end>Date.now()) d.end=Date.now();
        d.period=st.period||null; d.loc=st.loc||null; d.pos=st.pos||null; d.wakings=+sh.querySelector('#f-wk').textContent||0; d.hard=st.hard==='yes'; }
      if(e.type==='feed'){ d.side=st.side||null; d.milk=st.milk||null; d.minsL=num(sh,'#f-ml-l'); d.minsR=num(sh,'#f-ml-r'); d.ml=num(sh,'#f-ml'); d.mlLeft=num(sh,'#f-left'); d.fortify=sh.querySelector('#f-fort').value.trim()||null; }
      if(e.type==='diaper'){ d.kind=st.kind||null; d.amount=st.amount||null; d.color=st.color||null; d.texture=st.texture||null; d.rash=st.rash==='yes'; }
      if(e.type==='pump'){ d.side=st.side||null; d.ml=num(sh,'#f-ml'); }
      if(e.type==='temp'){ d.c=num(sh,'#f-c'); d.method=st.method||null; }
      if(e.type==='care'){ d.care=st.care||null; d.mins=num(sh,'#f-mins'); }
      d.note=sh.querySelector('#f-note').value.trim()||null;
      closeSheet(); await patchEvent(id,d);
    };
  });
}
function babyPicker(cur, both=true){ const m={a:nm('a'),b:nm('b')}; if(both) m.both='שניהם'; return optsHtml('baby',m,cur); }
function addFree(kind){
  const st={baby:'a', care:null};
  openSheet(`<h4>${kind==='care'?'טיפול או פעילות':'הערה או תסמין'}</h4><div class="field"><span>למי</span>${babyPicker('a')}</div>
    ${kind==='care'?`<div class="field"><span>סוג</span>${optsHtml('care',CARE,null)}</div><label class="field"><span>משך (דק׳)</span><input id="f-mins" type="number" inputmode="numeric" min="0"></label>`:''}
    <label class="field"><span>שעה</span><input id="f-t" type="time" value="${hhmm(Date.now())}"></label><label class="field"><span>${kind==='care'?'הערה':'מה קרה'}</span><textarea id="f-note"></textarea></label>${actionsHtml(false)}`, sh=>{
    bindOpts(sh,st); sh.querySelector('#x-close').onclick=closeSheet;
    sh.querySelector('#x-save').onclick=async()=>{ const note=sh.querySelector('#f-note').value.trim()||null; if(kind==='note'&&!note) return; if(kind==='care'&&!st.care) return;
      const t=fromTime(sh.querySelector('#f-t').value)||Date.now(); closeSheet();
      for(const k of (st.baby==='both'||!st.baby)?['a','b']:[st.baby]) await addDoc('events',{type:kind,baby:k,t,note,care:st.care||null,mins:kind==='care'?num(sh,'#f-mins'):null}); toastMsg('נשמר'); };
  });
}
function addTemp(k){
  const st={method:events.find(e=>e.type==='temp')?.method||'rectal'};
  openSheet(`<h4>${av(k)}מדידת חום · ${esc(nm(k))}</h4><label class="field"><span>חום (°C)</span><input id="f-c" type="number" inputmode="decimal" step="0.1" min="34" max="43" placeholder="37.2"></label>
    <div class="field"><span>שיטת מדידה</span>${optsHtml('method',TMETH,st.method)}</div><label class="field"><span>שעה</span><input id="f-t" type="time" value="${hhmm(Date.now())}"></label><label class="field"><span>הערה</span><textarea id="f-note"></textarea></label>${actionsHtml(false)}`, sh=>{
    bindOpts(sh,st); sh.querySelector('#x-close').onclick=closeSheet; setTimeout(()=>sh.querySelector('#f-c').focus(),50);
    sh.querySelector('#x-save').onclick=async()=>{ const c=num(sh,'#f-c'); if(!c) return; closeSheet();
      await addDoc('events',{type:'temp',baby:k,t:fromTime(sh.querySelector('#f-t').value)||Date.now(),c,method:st.method||null,note:sh.querySelector('#f-note').value.trim()||null}); };
  });
}
function editMed(id, forWho){
  const m=meds.find(x=>x.id===id)||{name:'',dose:'',everyH:24,babies:forWho==='mom'?['mom']:['a','b']};
  const st={a:(m.babies||[]).includes('a')?'y':null, b:(m.babies||[]).includes('b')?'y':null, mom:(m.babies||[]).includes('mom')?'y':null};
  openSheet(`<h4>${id?'עריכת':'הוספת'} תרופה או תוסף</h4><label class="field"><span>שם</span><input id="m-n" value="${esc(m.name)}" placeholder="למשל ויטמין D"></label>
    <label class="field"><span>מינון, כפי שקיבלתם מהרופא או מטיפת חלב</span><input id="m-d" value="${esc(m.dose||'')}"></label>
    <label class="field"><span>כל כמה שעות</span><input id="m-e" type="number" inputmode="numeric" min="1" value="${m.everyH||24}"></label>
    <div class="field"><span>למי</span><div class="opts" style="gap:12px">${optsHtml('a',{y:nm('a')},st.a)}${optsHtml('b',{y:nm('b')},st.b)}${optsHtml('mom',{y:'אמא'},st.mom)}</div></div>${actionsHtml(!!id)}`, sh=>{
    bindOpts(sh,st); sh.querySelector('#x-close').onclick=closeSheet; bindDel(sh,()=>delDoc('meds/'+id));
    sh.querySelector('#x-save').onclick=async()=>{ const name=sh.querySelector('#m-n').value.trim(); if(!name) return;
      const body={name,dose:sh.querySelector('#m-d').value.trim(),everyH:num(sh,'#m-e')||24,babies:['a','b','mom'].filter(k=>st[k])}; closeSheet();
      if(id) await setDoc('meds/'+id,body); else await addDoc('meds',body); };
  });
}
function giveMed(id,k){
  const m=meds.find(x=>x.id===id); if(!m) return;
  const last=events.find(e=>e.type==='med'&&e.medId===id&&e.baby===k);
  const tooSoon = last && Date.now()-last.t < (+m.everyH||24)*H;
  openSheet(`<div class="confirm ${k}">${av(k)}<div class="note">לתת ל</div><div class="big">${esc(nm(k))}</div><div><b>${esc(m.name)}</b> ${esc(m.dose||'')}</div></div>
    ${tooSoon?`<div class="warnbox">כבר ניתן ל${esc(nm(k))} ${ago(last.t)} (${hhmm(last.t)})${whoTxt(last.by)?' על ידי '+esc(whoTxt(last.by)):''}. המרווח שהוגדר הוא ${m.everyH} שעות.</div>`:''}
    <div class="actions"><button class="btn ghost" id="x-close">ביטול</button><button class="btn ${k}" id="x-ok">${tooSoon?'לתת בכל זאת':'כן, ניתן עכשיו'}</button></div>`, sh=>{
    sh.querySelector('#x-close').onclick=closeSheet;
    sh.querySelector('#x-ok').onclick=async()=>{ closeSheet(); const eid=await addDoc('events',{type:'med',baby:k,t:Date.now(),medId:id,medName:m.name,dose:m.dose||null});
      if(eid) toast({msg:`${m.name} ניתן ל${nm(k)}`, undo:()=>removeEvents([eid])}); };
  });
}
function editGrowth(gid, babyDefault){
  const g=growth.find(x=>x.id===gid)||{baby:babyDefault||'a',date:new Date().toISOString().slice(0,10)};
  const st={baby:g.baby};
  openSheet(`<h4>${gid?'עריכת':'הוספת'} מדידה</h4><div class="field"><span>למי</span>${babyPicker(st.baby,false)}</div>
    <label class="field"><span>תאריך</span><input id="g-d" type="date" value="${g.date}"></label>
    <div class="two"><label class="field"><span>משקל (גרם)</span><input id="g-w" type="number" inputmode="numeric" value="${g.w??''}"></label><label class="field"><span>אורך (ס״מ)</span><input id="g-l" type="number" inputmode="decimal" step="0.1" value="${g.len??''}"></label></div>
    <label class="field"><span>היקף ראש (ס״מ)</span><input id="g-h" type="number" inputmode="decimal" step="0.1" value="${g.head??''}"></label>
    <label class="field"><span>איפה נמדד</span><input id="g-n" value="${esc(g.note||'')}" placeholder="טיפת חלב, רופא, בבית"></label>${actionsHtml(!!gid)}`, sh=>{
    bindOpts(sh,st); sh.querySelector('#x-close').onclick=closeSheet; bindDel(sh,()=>delDoc('growth/'+gid));
    sh.querySelector('#x-save').onclick=async()=>{ const body={baby:st.baby||'a',date:sh.querySelector('#g-d').value,w:num(sh,'#g-w'),len:num(sh,'#g-l'),head:num(sh,'#g-h'),note:sh.querySelector('#g-n').value.trim()||null};
      if(!body.date||(!body.w&&!body.len&&!body.head)) return; closeSheet(); if(gid) await setDoc('growth/'+gid,body); else await addDoc('growth',body); };
  });
}
function growthList(k){
  const g=growth.filter(x=>x.baby===k).sort((x,y)=>y.date.localeCompare(x.date));
  openSheet(`<h4>${av(k)}מדידות · ${esc(nm(k))}</h4><div class="tbl-wrap"><table><thead><tr><th>תאריך</th><th>משקל</th><th>אורך</th><th>ראש</th></tr></thead><tbody>
    ${g.map(x=>`<tr data-g="${x.id}" style="cursor:pointer"><td>${dmy(new Date(x.date))}</td><td>${x.w??'—'}</td><td>${x.len??'—'}</td><td>${x.head??'—'}</td></tr>`).join('')}</tbody></table></div>
    <p class="note">הקשה על שורה לעריכה.</p><div class="actions"><button class="btn ghost" id="x-close">סגירה</button></div>`, sh=>{
    sh.querySelector('#x-close').onclick=closeSheet; sh.querySelectorAll('[data-g]').forEach(r=>r.onclick=()=>{ if(canWrite!==false) editGrowth(r.dataset.g); });
  });
}
function editAppt(aid){
  const a=appts.find(x=>x.id===aid)||{title:'',date:'',baby:'both',note:'',done:false};
  const st={baby:a.baby, done:a.done?'y':null};
  const local = a.date ? new Date(new Date(a.date).getTime()-new Date().getTimezoneOffset()*M).toISOString().slice(0,16) : '';
  openSheet(`<h4>${aid?'עריכת':'הוספת'} תור או חיסון</h4><label class="field"><span>מה</span><input id="p-t" value="${esc(a.title)}" placeholder="טיפת חלב, חיסון, בדיקת שמיעה"></label>
    <label class="field"><span>מתי</span><input id="p-d" type="datetime-local" value="${local}"></label><div class="field"><span>למי</span>${babyPicker(st.baby)}</div>
    <label class="field"><span>הערות, כולל תופעות לוואי אחרי חיסון</span><textarea id="p-n">${esc(a.note||'')}</textarea></label>
    <div class="field">${optsHtml('done',{y:'בוצע'},st.done)}</div>${actionsHtml(!!aid)}`, sh=>{
    bindOpts(sh,st); sh.querySelector('#x-close').onclick=closeSheet; bindDel(sh,()=>delDoc('appts/'+aid));
    sh.querySelector('#x-save').onclick=async()=>{ const title=sh.querySelector('#p-t').value.trim(); if(!title) return; const dv=sh.querySelector('#p-d').value;
      const body={title,date:dv?new Date(dv).toISOString():'',baby:st.baby||'both',note:sh.querySelector('#p-n').value.trim(),done:st.done==='y'}; closeSheet();
      if(aid) await setDoc('appts/'+aid,body); else await addDoc('appts',body); };
  });
}
function addPump(){
  const st={side:'both', where:'fridge'};
  openSheet(`<h4>רישום שאיבה</h4><div class="field"><span>צד</span>${optsHtml('side',{L:'שמאל',R:'ימין',both:'שניהם'},'both')}</div>
    <label class="field"><span>כמות (מ״ל)</span><input id="u-ml" type="number" inputmode="numeric" min="0" step="5"></label>
    <label class="field"><span>שעה</span><input id="f-t" type="time" value="${hhmm(Date.now())}"></label>
    <div class="field"><span>לאן החלב הולך</span>${optsHtml('where',{fridge:'למקרר',freezer:'למקפיא',now:'ניתן מיד'},'fridge')}</div>${actionsHtml(false)}`, sh=>{
    bindOpts(sh,st); sh.querySelector('#x-close').onclick=closeSheet;
    sh.querySelector('#x-save').onclick=async()=>{ const ml=num(sh,'#u-ml'); const t=fromTime(sh.querySelector('#f-t').value)||Date.now(); closeSheet();
      await addDoc('events',{type:'pump',baby:'mom',t,side:st.side||null,ml});
      if(ml && (st.where==='fridge'||st.where==='freezer')) await addDoc('stock',{ml,pumpedAt:t,where:st.where,used:false}); toastMsg('השאיבה נרשמה'); };
  });
}
function addStock(){
  const st={where:'freezer'};
  openSheet(`<h4>מנה למלאי</h4><label class="field"><span>כמות (מ״ל)</span><input id="s-ml" type="number" inputmode="numeric" min="0" step="5"></label>
    <label class="field"><span>תאריך שאיבה</span><input id="s-d" type="datetime-local" value="${new Date(Date.now()-new Date().getTimezoneOffset()*M).toISOString().slice(0,16)}"></label>
    <div class="field"><span>איפה</span>${optsHtml('where',{fridge:'מקרר',freezer:'מקפיא'},'freezer')}</div>${actionsHtml(false)}`, sh=>{
    bindOpts(sh,st); sh.querySelector('#x-close').onclick=closeSheet;
    sh.querySelector('#x-save').onclick=async()=>{ const ml=num(sh,'#s-ml'); const d=sh.querySelector('#s-d').value; if(!ml||!d) return; closeSheet();
      await addDoc('stock',{ml,pumpedAt:new Date(d).getTime(),where:st.where||'freezer',used:false}); };
  });
}

async function settings(){
  const st={sideA:cfg.a.sideMode||'alt', sideB:cfg.b.sideMode||'alt', rs:cfg.routineSync?'y':null, sexA:cfg.a.sex||null, sexB:cfg.b.sex||null};
  const rem={on:true,feedH:3,meds:true,...(cfg.remind||{})};
  st.remOn=rem.on?'y':null; st.remMeds=rem.meds?'y':null;
  const sexOpts={boy:'בן',girl:'בת'};
  const th=cfg.th||DEFAULT_CFG.th;
  const sideOpts={alt:'מתחלף',L:'קבוע שמאל',R:'קבוע ימין'};
  const TT=window.TT; const isOwner=TT?.role()==='owner';
  let mem=null; if(isOwner){ try{ mem=await TT.getMembers(); }catch(e){} }
  const push=TT?TT.pushStatus():'unsupported';
  const pushLine={on:'התראות פעילות בטלפון הזה.',granted:'יש הרשאה, אבל הטלפון עוד לא נרשם. לחצו להפעלה.',default:'התראות כבויות בטלפון הזה.',denied:'ההתראות חסומות בהגדרות הדפדפן לאתר הזה. צריך לאפשר אותן שם.',unsupported:'הדפדפן הזה לא תומך בהתראות. באנדרואיד: Chrome.'}[push];
  openSheet(`<h4>הגדרות</h4>
    <h5>זהות</h5>
    <div class="two"><label class="field"><span>${av('a','sm')} שם (כחול)</span><input id="s-a" maxlength="20" value="${esc(nm('a'))}"></label><label class="field"><span>${av('b','sm')} שם (כתום)</span><input id="s-b" maxlength="20" value="${esc(nm('b'))}"></label></div>
    ${assets?`<div class="two"><label class="field"><span>תמונה ל${esc(nm('a'))}</span><input id="s-pa" type="file" accept="image/*"></label><label class="field"><span>תמונה ל${esc(nm('b'))}</span><input id="s-pb" type="file" accept="image/*"></label></div>`:''}
    <div class="two"><div class="field"><span>${esc(nm('a'))}</span>${optsHtml('sexA',sexOpts,st.sexA)}</div><div class="field"><span>${esc(nm('b'))}</span>${optsHtml('sexB',sexOpts,st.sexB)}</div></div>
    <p class="note">הצבע, השם והתמונה של כל תאום מופיעים תמיד יחד, בכל מסך. המין קובע את עקומות הגדילה.</p>
    <h5>לידה</h5>
    <div class="two"><label class="field"><span>תאריך לידה</span><input id="s-birth" type="date" value="${cfg.birth||''}"></label><label class="field"><span>שבוע לידה (לגיל מתוקן)</span><input id="s-ga" type="number" inputmode="decimal" min="22" max="42" step="0.5" value="${cfg.ga||''}" placeholder="למשל 36"></label></div>
    <h5>צד הנקה</h5>
    <div class="field"><span>${esc(nm('a'))}</span>${optsHtml('sideA',sideOpts,st.sideA)}</div>
    <div class="field"><span>${esc(nm('b'))}</span>${optsHtml('sideB',sideOpts,st.sideB)}</div>
    <div class="field">${optsHtml('rs',{y:'סנכרון שגרות: להציע מתי להעיר את התאום השני להאכלה משותפת'},st.rs)}</div>
    <h5>התראות לטלפון</h5>
    <p class="note">${pushLine}</p>
    ${push!=='on'&&push!=='denied'&&push!=='unsupported'?'<button class="btn primary" id="s-push" type="button">הפעלת התראות בטלפון הזה</button>':''}
    <div class="field">${optsHtml('remOn',{y:'לשלוח תזכורות'},st.remOn)}</div>
    <div class="two"><label class="field"><span>תזכורת אחרי כמה שעות בלי האכלה</span><input id="r-f" type="number" inputmode="decimal" step="0.5" min="1" value="${rem.feedH}"></label>
    <div class="field"><span>תרופות ותוספים</span>${optsHtml('remMeds',{y:'להזכיר כשמגיע הזמן'},st.remMeds)}</div></div>
    <p class="note">התזכורות נבדקות כל 10 דקות בערך, ולפעמים באיחור קצר. חום וצואה חריגה נשלחים כהתראה דחופה.</p>
    <h5>ספי התראה</h5>
    <p class="note">ברירת המחדל לפי האקדמיה האמריקאית לרפואת ילדים, לתינוקות שנולדו במועד. לאשר מול רופא הילדים, במיוחד בפגות או בצהבת.</p>
    <div class="two"><label class="field"><span>מינימום האכלות ב־24 ש׳ (4 שבועות ראשונים)</span><input id="t-f" type="number" inputmode="numeric" value="${th.feeds}"></label>
    <label class="field"><span>מינימום חיתולים רטובים ב־24 ש׳ (מהיום ה־5)</span><input id="t-w" type="number" inputmode="numeric" value="${th.wet}"></label>
    <label class="field"><span>שעות בלי חיתול רטוב</span><input id="t-n" type="number" inputmode="numeric" value="${th.noWetH}"></label>
    <label class="field"><span>חום שמפעיל התראה (°C)</span><input id="t-c" type="number" inputmode="decimal" step="0.1" value="${th.feverC}"></label></div>
    <h5>מי משתמש</h5>
    ${isOwner?`<label class="field"><span>יכולים לרשום (כתובת Gmail בכל שורה)</span><textarea id="m-ed" dir="ltr" placeholder="name@gmail.com">${esc((mem?.editors||[]).join('\n'))}</textarea></label>
    <label class="field"><span>צפייה בלבד: סבתא, מטפלת, בייביסיטר</span><textarea id="m-vw" dir="ltr">${esc((mem?.viewers||[]).join('\n'))}</textarea></label>
    <p class="note">כל רישום מסומן בשם מי שרשם אותו. מי שבצפייה בלבד רואה הכול ולא יכול לשנות.</p>`
    :`<p class="note">מחובר/ת בתור ${esc(TT?.email()||'')}${TT?.role()==='viewer'?' (צפייה בלבד)':''}.</p>`}
    ${TT?.canInstall()?'<button class="btn ghost" id="s-inst" type="button">התקנה במסך הבית</button>':''}
    ${TT?'<button class="btn ghost" id="s-out" type="button">יציאה מהחשבון</button>':''}
    ${actionsHtml(false)}`, sh=>{
    bindOpts(sh,st); sh.querySelector('#x-close').onclick=closeSheet;
    sh.querySelector('#s-push')?.addEventListener('click',async ev=>{ ev.target.disabled=true; ev.target.textContent='מפעיל…';
      try{ await TT.enablePush(); ev.target.textContent='ההתראות הופעלו'; toastMsg('ההתראות הופעלו בטלפון הזה'); }
      catch(e){ ev.target.disabled=false; ev.target.textContent='הפעלת התראות בטלפון הזה'; toastMsg(e?.message==='denied'?'לא ניתנה הרשאה להתראות.':'לא הצלחתי להפעיל התראות. נסו שוב עם חיבור לאינטרנט.'); } });
    sh.querySelector('#s-inst')?.addEventListener('click',()=>TT.install());
    sh.querySelector('#s-out')?.addEventListener('click',()=>TT.signOut());
    const up = async (inp,k) => { const f=inp?.files?.[0]; if(!f||!assets) return null; try{ const r=await assets.upload(f); return r.url; }catch(e){ toastMsg('התמונה לא הועלתה.'); return null; } };
    sh.querySelector('#x-save').onclick=async()=>{
      const pa=await up(sh.querySelector('#s-pa'),'a'), pb=await up(sh.querySelector('#s-pb'),'b');
      const next={...cfg,
        a:{...cfg.a,name:sh.querySelector('#s-a').value.trim()||'תאום א׳',sideMode:st.sideA||'alt',photo:pa||cfg.a.photo||null,sex:st.sexA||null},
        b:{...cfg.b,name:sh.querySelector('#s-b').value.trim()||'תאום ב׳',sideMode:st.sideB||'alt',photo:pb||cfg.b.photo||null,sex:st.sexB||null},
        birth:sh.querySelector('#s-birth').value||'', ga:sh.querySelector('#s-ga').value||'', routineSync:st.rs==='y',
        th:{feeds:num(sh,'#t-f')??8, wet:num(sh,'#t-w')??6, noWetH:num(sh,'#t-n')??8, feverC:num(sh,'#t-c')??38},
        remind:{on:st.remOn==='y', feedH:num(sh,'#r-f')??3, meds:st.remMeds==='y'}};
      if(isOwner){ const list=id=>[...new Set((sh.querySelector(id)?.value||'').split(/[\s,;]+/).map(x=>x.trim().toLowerCase()).filter(x=>/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(x)))];
        try{ await TT.setMembers({owner:(mem?.owner||TT.email()).toLowerCase(), editors:list('#m-ed'), viewers:list('#m-vw')}); }catch(e){ toastMsg('רשימת המשתמשים לא נשמרה.'); } }
      cfg=next; closeSheet(); render(); await setDoc('config/babies',next); toastMsg('ההגדרות נשמרו');
    };
  });
}

/* ---------- event wiring ---------- */
document.addEventListener('click',async e=>{
  const t=e.target.closest('button,[data-id]'); if(!t || !t.isConnected || t.closest('#sheet') || t.closest('#toast') || t.closest('#dropsRoot')) return;
  const d=t.dataset;
  if(d.tab){ tab=d.tab; try{localStorage.setItem('tab',tab);}catch(_){} render(); window.scrollTo(0,0); return; }
  if(d.go){ tab=d.go; render(); window.scrollTo(0,0); return; }
  if(d.quick){ if(canWrite===false) return; const ids=await quickLog(d.quick,d.baby); if(ids.length) toast({msg:TYPE[d.quick]+' · '+nm(d.baby)+' · '+hhmm(Date.now()), undo:()=>removeEvents(ids)}); return; }
  if(d.act){ if(canWrite===false) return; act(d.act,d.baby); return; }
  if(d.tact){ timerAct(d.tact,d.baby); return; }
  if(d.off!=null){ offsetMin=+d.off; render(); return; }
  if(d.id && t.classList.contains('item')){ if(canWrite===false) return; editEvent(d.id); return; }
  if(d.tlb){ tlBaby=d.tlb; render(); return; } if(d.tlt){ tlType=d.tlt; render(); return; }
  if(d.sum){ sumMode=d.sum; render(); return; }
  if(d.add){ addFree(d.add); return; }
  if(d.temp){ addTemp(d.temp); return; }
  if('medNew' in d){ editMed(null); return; } if(d.medEdit){ editMed(d.medEdit); return; }
  if(d.give){ giveMed(d.give,d.baby); return; }
  if('growthNew' in d){ editGrowth(null); return; } if(d.growthList){ growthList(d.growthList); return; }
  if('apptNew' in d){ editAppt(null); return; } if(d.apptEdit){ editAppt(d.apptEdit); return; }
  if('pump' in d){ addPump(); return; } if('stockNew' in d){ addStock(); return; }
  if(d.gm){ gMeasure=d.gm; render(); return; }
  if(d.more){ moreSub=d.more; try{localStorage.setItem('more',moreSub);}catch(_){} render(); return; }
  if('medNewMom' in d){ editMed(null,'mom'); return; }
  if(d.solidNew){ editSolid(null,d.solidNew); return; } if(d.solidEdit){ if(canWrite!==false) editSolid(d.solidEdit); return; }
  if('invNew' in d){ editInv(null); return; } if(d.invEdit){ editInv(d.invEdit); return; }
  if(d.invStep){ invStep(d.inv,+d.invStep); return; }
  if('invCommon' in d){ for(const [name,unit,low] of COMMON_INV) await addDoc('inv',{name,unit,low,qty:0}); return; }
  if('shopLow' in d){ for(const i of inv.filter(i=>(+i.qty||0)<=(+i.low||0) && !shop.some(s=>!s.done&&s.text===i.name))) await addDoc('shop',{text:i.name,done:false}); return; }
  if(d.shopToggle){ const s=shop.find(x=>x.id===d.shopToggle); if(s&&canWrite!==false){ s.done=!s.done; render(); await updDoc('shop/'+s.id,{done:s.done}); } return; }
  if(d.shopDel){ shop=shop.filter(x=>x.id!==d.shopDel); render(); await delDoc('shop/'+d.shopDel); return; }
  if('shopClear' in d){ const done=shop.filter(s=>s.done); shop=shop.filter(s=>!s.done); render(); for(const s of done) await delDoc('shop/'+s.id); return; }
  if('psleep' in d){ const o=psleep.find(e=>e.by===me&&!e.end); if(o){ o.end=Date.now(); render(); await updDoc('psleep/'+o.id,{end:o.end}); toastMsg('בוקר טוב'); } else { await addDoc('psleep',{t:Date.now(),end:null}); toastMsg('לילה טוב'); } return; }
  if('water' in d){ const w=mine.find(x=>x.id==='water'); const today=new Date().toDateString(); const body={day:today,count:(w&&w.day===today?w.count:0)+1,last:Date.now()};
    mine=[...mine.filter(x=>x.id!=='water'),{id:'water',...body}]; render(); if(db&&me){ try{ await db.doc('data/users/'+me+'/water').set(body); }catch(e){} } return; }
  if(d.mood){ selMood=+d.mood; document.querySelectorAll('[data-mood]').forEach(b=>b.setAttribute('aria-pressed',b===t)); return; }
  if('feelSave' in d){ if(!selMood||!db||!me) { if(!selMood) toastMsg('בחרו קודם איך את/ה מרגיש/ה.'); return; } const text=$('#feelTxt')?.value.trim()||null;
    try{ await db.collection('data/users/'+me).doc('f'+Date.now()).set({kind:'feel',mood:selMood,text,t:Date.now()}); selMood=null; toastMsg('נשמר. רק את/ה רואה את זה.'); }catch(e){ toastMsg('לא נשמר.'); } return; }
  if(d.repBaby){ rep.baby=d.repBaby; render(); return; } if(d.repDays){ rep.days=+d.repDays; render(); return; }
  if('repDl' in d){ if(!downloads) return; try{ await downloads.save({filename:`דוח-${nm(rep.baby)}-${new Date().toISOString().slice(0,10)}.html`, data:reportFile(rep.baby,rep.days)}); }catch(e){ if(e?.code!=='declined') toastMsg('ההורדה לא הצליחה.'); } return; }
  if('repCopy' in d){ const txt=reportText(rep.baby,rep.days); try{ await navigator.clipboard.writeText(txt); toastMsg('הדוח הועתק'); }catch(e){ openSheet(`<h4>העתקת הדוח</h4><textarea id="cp" style="min-height:50vh">${esc(txt)}</textarea><div class="actions"><button class="btn ghost" id="x-close">סגירה</button></div>`, sh=>{ sh.querySelector('#x-close').onclick=closeSheet; const ta=sh.querySelector('#cp'); ta.focus(); ta.select(); }); } return; }
  if(d.thaw){ const s=stock.find(x=>x.id===d.thaw); if(s){ s.where='thawed'; s.thawedAt=Date.now(); render(); await updDoc('stock/'+s.id,{where:'thawed',thawedAt:s.thawedAt}); toastMsg('סומן כמופשר. עד 24 שעות במקרר.'); } return; }
  if(d.use){ const s=stock.find(x=>x.id===d.use); if(s){ s.used=true; render(); await updDoc('stock/'+s.id,{used:true,usedAt:Date.now()}); toast({msg:`${s.ml} מ״ל סומנו כמשומשים`, undo:async()=>{ s.used=false; render(); await updDoc('stock/'+s.id,{used:false}); }}); } return; }
  if(d.stockDel){ const s=stock.find(x=>x.id===d.stockDel); if(s){ stock=stock.filter(x=>x!==s); render(); await delDoc('stock/'+s.id); toast({msg:'המנה נמחקה', undo:async()=>{ await setDoc('stock/'+s.id,{ml:s.ml,pumpedAt:s.pumpedAt,where:s.where,thawedAt:s.thawedAt||null,used:false}); }}); } return; }
});
let selMood=null;
$('#freeForm').addEventListener('submit',e=>{ e.preventDefault(); const v=$('#freeIn').value.trim(); if(v && canWrite!==false){ freeSubmit(v); $('#freeForm').hidden=true; } });
$('#freeBtn').onclick=()=>{ const f=$('#freeForm'); f.hidden=!f.hidden; if(!f.hidden) $('#freeIn').focus(); };
document.addEventListener('submit',async e=>{ if(e.target.id!=='shopForm') return; e.preventDefault(); const inp=$('#shopIn'); const v=inp.value.trim(); if(!v) return; inp.value=''; await addDoc('shop',{text:v,done:false}); });

window.addEventListener('tt-write-error',e=>writeFail(e.detail));
window.addEventListener('tt-push',e=>{ const n=e.detail||{}; toastMsg([n.title,n.body].filter(Boolean).join(' · ')); });
window.addEventListener('offline',()=>setSync('off','לא מקוון · נשמר בטלפון'));
window.addEventListener('online',()=>setSync('on','מסונכרן'));
$('#setBtn').onclick=()=>{ if(canWrite===false && window.TT?.role()!=='viewer'){ toastMsg('ההגדרות זמינות רק למי שיכול לרשום.'); return; } settings(); };
$('#nightBtn').onclick=()=>{ night=!night; document.body.classList.toggle('night',night); try{localStorage.setItem('night',night?'1':'0');}catch(e){} };
document.addEventListener('visibilitychange',()=>{ if(!document.hidden && $('#scrim').hidden) render(); });
try{ navigator.wakeLock?.request?.('screen').catch(()=>{}); }catch(e){}
function applyRO(){ document.body.classList.toggle('ro',canWrite===false); $('#roNote').hidden = canWrite!==false; }

render();

/* ---------- connect ---------- */
(async()=>{
  if(!window.claude?.use){ setSync('off','לא מחובר'); loaded=true; render(); return; }
  user = await window.claude.use('user');
  try{ me = user ? await user.id() : null; }catch(e){}
  try{ const c = user ? await user.can('data.write') : null; if(c===false){ canWrite=false; applyRO(); } else if(c===true) canWrite=true; }catch(e){}
  db = await window.claude.use('db');
  if(!db){ setSync('off','לא מחובר'); loaded=true; render(); return; }
  window.claude.use('assets').then(a=>{ assets=a; }).catch(()=>{});
  window.claude.use('downloads').then(x=>{ downloads=x; if(tab==='more') render(); }).catch(()=>{});
  const timer=setTimeout(()=>{ if(!loaded){ loaded=true; render(); } setSync('off', navigator.onLine?'מתחבר…':'לא מקוון · נשמר בטלפון'); },10000);
  let deferred=false;
  const soft = () => { const typing=document.activeElement?.closest?.('#view') && document.activeElement.matches('input,textarea,select');
    if($('#scrim').hidden && !typing) render(); else deferred=true; };
  document.addEventListener('focusout',()=>setTimeout(()=>{ if(deferred && $('#scrim').hidden && !document.activeElement?.matches?.('#view input,#view textarea')){ deferred=false; render(); } },200));
  db.doc('config/babies').onSnapshot(s=>{ if(s.exists){ const v=s.data(); cfg={...DEFAULT_CFG,...v, a:{...DEFAULT_CFG.a,...v.a}, b:{...DEFAULT_CFG.b,...v.b}, th:{...DEFAULT_CFG.th,...(v.th||{})}}; soft(); } },()=>{});
  db.collection('events').where('t','>=',Date.now()-14*D).orderBy('t','desc').limit(1000).onSnapshot(snap=>{
    events=snap.docs.map(d=>({id:d.id,...d.data()})); loaded=true; soft();
    if(!snap.metadata.fromCache){ clearTimeout(timer); setSync('on','מסונכרן'); }
  }, err=>{ clearTimeout(timer); loaded=true; render(); setSync('off','החיבור נותק'); });
  db.collection('timers').onSnapshot(snap=>{ const n={}; snap.docs.forEach(d=>{ n[d.id]=d.data(); }); timers=n; soft(); },()=>{});
  db.collection('meds').onSnapshot(snap=>{ meds=snap.docs.map(d=>({id:d.id,...d.data()})); soft(); },()=>{});
  db.collection('stock').where('used','==',false).onSnapshot(snap=>{ stock=snap.docs.map(d=>({id:d.id,...d.data()})); soft(); },()=>{});
  db.collection('growth').onSnapshot(snap=>{ growth=snap.docs.map(d=>({id:d.id,...d.data()})); soft(); },()=>{});
  db.collection('appts').onSnapshot(snap=>{ appts=snap.docs.map(d=>({id:d.id,...d.data()})); soft(); },()=>{});
  db.collection('solids').onSnapshot(snap=>{ solids=snap.docs.map(d=>({id:d.id,...d.data()})); soft(); },()=>{});
  db.collection('inv').onSnapshot(snap=>{ inv=snap.docs.map(d=>({id:d.id,...d.data()})); soft(); },()=>{});
  db.collection('shop').onSnapshot(snap=>{ shop=snap.docs.map(d=>({id:d.id,...d.data()})); soft(); },()=>{});
  db.collection('psleep').where('t','>=',Date.now()-3*D).onSnapshot(snap=>{ psleep=snap.docs.map(d=>({id:d.id,...d.data()})); soft(); },()=>{});
  if(me){ try{ db.collection('data/users/'+me).onSnapshot(snap=>{ mine=snap.docs.map(d=>({id:d.id,...d.data()})); soft(); },()=>{}); }catch(e){} }
})();
})();
