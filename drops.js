/* כמו שתי טיפות מים · the two drops. Mounted by app.js into the Now screen; gets real records through Drops.sync(). Needs GSAP. */
window.Drops=(()=>{
let api=null, root=null, syncFn=null, pending=null;
const MARKUP='<div class="alerts" id="dAlerts" hidden></div>\n  <section class="stage" id="dStage" aria-label="שתי הטיפות">\n    <button class="score" id="score" aria-label="מי מוביל היום"></button>\n    <button class="bothbtn" id="bothBtn" aria-pressed="false" aria-label="הפעולה הבאה לשניהם"><svg viewBox="0 0 30 24" aria-hidden="true"><path d="M19 2C19 2 12 10 12 14.5a7 7 0 0 0 14 0C26 10 19 2 19 2Z" fill="#2F8BEA"/><path d="M10 4C10 4 3 12 3 16.5a7 7 0 0 0 14 0C17 12 10 4 10 4Z" fill="#F2604E" opacity=".95"/></svg>לשניהם</button>\n    <svg id="stg" viewBox="0 0 400 320" preserveAspectRatio="xMidYMax meet">\n      <defs>\n        <radialGradient id="gA" cx=".56" cy=".74" r=".78" fx=".6" fy=".8"><stop offset="0" stop-color="#C9EEFF"/><stop offset=".32" stop-color="#7FC8FA"/><stop offset=".72" stop-color="#3B91EA"/><stop offset="1" stop-color="#2463D2"/></radialGradient>\n        <radialGradient id="gB" cx=".56" cy=".74" r=".78" fx=".6" fy=".8"><stop offset="0" stop-color="#FFE0D2"/><stop offset=".32" stop-color="#FFA285"/><stop offset=".72" stop-color="#F26550"/><stop offset="1" stop-color="#D9443A"/></radialGradient>\n        <linearGradient id="gN" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2B3168"/><stop offset="1" stop-color="#3A3F7C"/></linearGradient>\n        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFF1E6"/><stop offset=".55" stop-color="#FDE9F1"/><stop offset="1" stop-color="#E6F1FF"/></linearGradient>\n        <radialGradient id="glowA" cx=".5" cy=".6" r=".5"><stop offset="0" stop-color="#D6EEFF"/><stop offset="1" stop-color="#D6EEFF" stop-opacity="0"/></radialGradient>\n        <radialGradient id="glowB" cx=".5" cy=".6" r=".5"><stop offset="0" stop-color="#FFE0D4"/><stop offset="1" stop-color="#FFE0D4" stop-opacity="0"/></radialGradient>\n        <filter id="goo" filterUnits="userSpaceOnUse" x="-40" y="-120" width="480" height="520">\n          <feGaussianBlur in="SourceGraphic" stdDeviation="6.5" result="b"/>\n          <feColorMatrix in="b" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 24 -10"/>\n        </filter>\n        <clipPath id="clipA"><rect x="200" y="-200" width="260" height="560"/></clipPath>\n        <clipPath id="clipB"><rect x="-60" y="-200" width="260" height="560"/></clipPath>\n      </defs>\n      <!-- backdrops -->\n      <g id="scene">\n        <rect x="-100" y="-300" width="600" height="640" fill="url(#sky)"/>\n        <circle cx="30" cy="70" r="92" fill="#FFD9C9" opacity=".5"/><circle cx="380" cy="40" r="104" fill="#CFE6FF" opacity=".6"/><circle cx="210" cy="170" r="64" fill="#FFF2C6" opacity=".55"/>\n        <g fill="#fff" opacity=".9"><path class="cloud" d="M52 118 a18 18 0 0 1 30 -12 a22 22 0 0 1 40 6 a14 14 0 0 1 4 28 h-70 a14 14 0 0 1 -4 -22z"/><path class="cloud" d="M268 84 a14 14 0 0 1 24 -10 a18 18 0 0 1 32 5 a11 11 0 0 1 3 22 h-56 a11 11 0 0 1 -3 -17z"/></g>\n        <g id="bubbles"></g>\n      </g>\n      <g id="nightA" clip-path="url(#clipA)" opacity="0"><rect x="200" y="-300" width="260" height="600" fill="url(#gN)"/><g fill="var(--star)"><circle cx="230" cy="70" r="1.8"/><circle cx="350" cy="50" r="2.2"/><circle cx="380" cy="130" r="1.5"/><circle cx="250" cy="150" r="1.3"/><circle cx="330" cy="105" r="1.2"/></g><path d="M370 34a16 16 0 1 0 12 26a13 13 0 0 1-12-26z" fill="var(--star)"/></g>\n      <g id="nightB" clip-path="url(#clipB)" opacity="0"><rect x="-60" y="-300" width="260" height="600" fill="url(#gN)"/><g fill="var(--star)"><circle cx="30" cy="70" r="1.8"/><circle cx="150" cy="50" r="2.2"/><circle cx="170" cy="130" r="1.5"/><circle cx="50" cy="150" r="1.3"/><circle cx="110" cy="40" r="1.2"/></g><path d="M40 34a16 16 0 1 0 12 26a13 13 0 0 1-12-26z" fill="var(--star)"/></g>\n      <!-- floor -->\n      <ellipse cx="200" cy="308" rx="236" ry="32" fill="#F7DCCB"/>\n      <ellipse cx="200" cy="305" rx="200" ry="21" fill="none" stroke="#EEC6AF" stroke-width="2.5" stroke-dasharray="1 9" stroke-linecap="round"/>\n      <ellipse id="shA" cx="290" cy="302" rx="46" ry="7" fill="#22203A" opacity=".1"/>\n      <ellipse id="shB" cx="110" cy="302" rx="46" ry="7" fill="#22203A" opacity=".1"/>\n      <ellipse id="caA" cx="300" cy="303" rx="18" ry="3.5" fill="#BDE7FF" opacity=".9"/><ellipse id="caB" cx="120" cy="303" rx="18" ry="3.5" fill="#FFD3C4" opacity=".9"/>\n      <!-- liquid layer: bodies, liquid hands, puddles and splashes all melt together -->\n      <g id="pbA"></g><g id="pbB"></g>\n      <g id="liquid" filter="url(#goo)" opacity=".9">\n        <ellipse id="pudA" cx="290" cy="300" rx="0" ry="11" fill="#4AA6F2"/>\n        <ellipse id="pudB" cx="110" cy="300" rx="0" ry="11" fill="#F7806A"/>\n        <g id="bodyA"><path d="M0 -170 C3 -152 15 -131 32 -108 C51 -83 62 -64 61 -42 C60 -13 33 2 0 2 C-33 2 -60 -13 -61 -42 C-62 -64 -51 -83 -32 -108 C-15 -131 -3 -152 0 -170 Z" fill="url(#gA)"/><circle id="hA1" cx="-26" cy="-50" r="0" fill="#3A93EC"/><circle id="hA2" cx="26" cy="-50" r="0" fill="#3A93EC"/></g>\n        <g id="bodyB"><path d="M0 -170 C3 -152 15 -131 32 -108 C51 -83 62 -64 61 -42 C60 -13 33 2 0 2 C-33 2 -60 -13 -61 -42 C-62 -64 -51 -83 -32 -108 C-15 -131 -3 -152 0 -170 Z" fill="url(#gB)"/><circle id="hB1" cx="-26" cy="-50" r="0" fill="#F2705C"/><circle id="hB2" cx="26" cy="-50" r="0" fill="#F2705C"/></g>\n        <g id="drops"></g>\n      </g>\n      <!-- faces -->\n      <g id="faceA" class="face" data-e="open" data-m="smile"></g>\n      <g id="faceB" class="face" data-e="closed" data-m="sleep"></g>\n      <g id="pfA"></g><g id="pfB"></g>\n      <g id="spl"></g>\n      <g id="fx"></g>\n    </svg>\n  </section>\n\n  <section class="ctl" id="ctl">\n    <div class="half a" id="halfA"></div>\n    <div class="half b" id="halfB"></div>\n  </section>\n\n<div class="dscrim" id="dScrim"></div>\n<div class="dsheet" id="dSheet" role="dialog" aria-modal="true"></div>\n<div class="dtoast" id="dToast" role="status"></div>\n';
function mount(el,a){ api=a; root=el; el.innerHTML=MARKUP; run(); if(pending){ syncFn(pending); pending=null; } }
function sync(st){ if(syncFn) syncFn(st); else pending=st; }
function run(){

const $=s=>root.querySelector(s), M=6e4, H=36e5;
const K=['a','b'];
const pad=n=>String(n).padStart(2,'0');
const hm=ms=>{ const m=Math.max(0,Math.floor(ms/M)); return Math.floor(m/60)+':'+pad(m%60); };
const clk=ms=>{ const s=Math.max(0,Math.floor(ms/1000)); return Math.floor(s/60)+':'+pad(s%60); };
const hhmm=t=>{ const d=new Date(t); return pad(d.getHours())+':'+pad(d.getMinutes()); };
const rnd=(a,b)=>a+Math.random()*(b-a);
const pick=xs=>xs[Math.floor(Math.random()*xs.length)];
const NS='http://www.w3.org/2000/svg';
const el=(tag,attrs,parent)=>{ const e=document.createElementNS(NS,tag); for(const k in attrs) e.setAttribute(k,attrs[k]); parent&&parent.appendChild(e); return e; };

/* ---------- icons ---------- */
const I={
  bottle:'<path d="M9 2.5h6M10 2.5v2.8L7.8 8.2V19a2.5 2.5 0 0 0 2.5 2.5h3.4A2.5 2.5 0 0 0 16.2 19V8.2L14 5.3V2.5"/><path d="M7.8 12.5h8.4"/>',
  nurse:'<path d="M12 21c-5-3.2-8.5-6.6-8.5-10.2A4.3 4.3 0 0 1 12 8.6a4.3 4.3 0 0 1 8.5 2.2C20.5 14.4 17 17.8 12 21z"/><circle cx="12" cy="13" r="1.6" fill="currentColor"/>',
  diaper:'<path d="M3 7.5h18v2.8a9 9 0 0 1-18 0z"/><path d="M8 11c1.2 1.8 2.6 2.7 4 2.7s2.8-.9 4-2.7"/>',
  moon:'<path d="M19.5 14.5A8 8 0 1 1 9.5 4.5a6.5 6.5 0 0 0 10 10z"/>',
  sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4"/>',
  wet:'<path d="M12 3C12 3 6 10 6 14a6 6 0 0 0 12 0C18 10 12 3 12 3Z"/>',
  poop:'<path d="M7 19h10a3 3 0 0 0 .6-5.9A3 3 0 0 0 14.5 9a2.6 2.6 0 0 0-2.6-3.6c.4 1.2-.3 2.2-1.6 2.6A3 3 0 0 0 8.6 12a3.1 3.1 0 0 0-1.6 7z"/>',
  both:'<path d="M9 4C9 4 4 10 4 13.5a5 5 0 0 0 10 0C14 10 9 4 9 4Z"/><path d="M16 9.5c.4-.4 4 3.7 4 6a4 4 0 0 1-7.4 2.1"/>',
  dry:'<circle cx="12" cy="12" r="8"/><path d="M8 12h8"/>',
  left:'<circle cx="12" cy="12" r="8.5"/><path d="M13.5 8.5 10 12l3.5 3.5"/>',
  right:'<circle cx="12" cy="12" r="8.5"/><path d="M10.5 8.5 14 12l-3.5 3.5"/>',
  crib:'<path d="M3 20V8M21 20V8M3 11h18M3 17h18M7 11v6M11 11v6M15 11v6M19 11v6"/>',
  bassinet:'<path d="M3 11h18a9 9 0 0 1-18 0z"/><path d="M21 11c0-4-3-7-8-7"/><path d="M8 20l-1.5 2M16 20l1.5 2"/>',
  arms:'<path d="M3 13c3 4 15 4 18 0"/><circle cx="12" cy="8" r="3.5"/>',
  stroller:'<path d="M4 6h3l2 8h10l2-7"/><path d="M9 14a6 6 0 0 1-1-5h13"/><circle cx="9" cy="19" r="2"/><circle cx="18" cy="19" r="2"/>',
  burp:'<circle cx="9" cy="14" r="5"/><circle cx="16.5" cy="7" r="3"/><circle cx="19" cy="14" r="1.6"/>',
  spit:'<path d="M12 4C12 4 8 9 8 12a4 4 0 0 0 8 0C16 9 12 4 12 4Z"/><path d="M4 18l2-1.5M20 18l-2-1.5M7 21.5l1.5-2M17 21.5l-1.5-2"/>',
  wake:'<path d="M4 18h16"/><path d="M7 18a5 5 0 0 1 10 0"/><path d="M12 6v3M5 10l2 1.6M19 10l-2 1.6"/>',
  swap:'<path d="M7 7h11l-3-3M17 17H6l3 3"/>',
  formula:'<path d="M7 3h10v4H7zM6 7h12v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1z"/><path d="M9 12h6"/>',
  pumped:'<path d="M12 3C12 3 7 9 7 12.5a5 5 0 0 0 10 0C17 9 12 3 12 3Z"/><path d="M10 14.5c.6.8 1.3 1.2 2 1.2"/>'
};
const ico=(k,extra='')=>`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" ${extra}>${I[k]}</svg>`;

/* ---------- state: filled by the app through Drops.sync() ---------- */
const S={
  a:{name:'תאום א׳', girl:false, feed:null, next:null, sleep:null, loc:null, wake:null, diaper:null, nurse:null, lastMl:null},
  b:{name:'תאומה ב׳', girl:true, feed:null, next:null, sleep:null, loc:null, wake:null, diaper:null, nurse:null, lastMl:null}
};
let tally={burp:{a:0,b:0}, poop:{a:0,b:0}, spit:{a:0,b:0}, night:{a:0,b:0}};
let league={people:[], rows:[]};
let canWrite=true, alerts=[];
const CATS=[['burp','גרעפסים היום','burp'],['poop','קקי היום','poop'],['spit','פליטות היום','spit'],['night','הקפיצו בלילה','moon']];
let both=false, catI=0;
const g=(k,m,f)=>S[k].girl?f:m;
const other=k=>k==='a'?'b':'a';
const homeX={a:290,b:110};
const dirTo=k=>k==='a'?-1:1; // direction toward the other twin, in stage x
const visible=()=>root.offsetParent!==null && !document.hidden;
const esc=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));

/* ---------- faces ---------- */
function buildFace(k){
  const f=$('#face'+k.toUpperCase());
  const top = k==='a'
    ? '<path d="M0 -156 C-5 -175 11 -181 12 -170 C12.5 -163 5 -163 5.5 -169" fill="none" stroke="#3B91EA" stroke-width="5.5" stroke-linecap="round"/>'
    : '<g transform="translate(-24 -118) rotate(-18)"><path d="M0 0 L-16 -9 L-16 9 Z M0 0 L16 -9 L16 9 Z" fill="#FFF" stroke="#FFD7CB" stroke-width="1.5" stroke-linejoin="round"/><circle r="4.5" fill="#FFE3DA"/></g>';
  f.innerHTML=`
   <ellipse cx="6" cy="-24" rx="34" ry="15" fill="#fff" opacity=".16"/>
   <ellipse cx="-31" cy="-88" rx="8" ry="17" transform="rotate(32 -31 -88)" fill="#fff" opacity=".55"/>
   

   ${top}
   <g class="cheeks" id="ck${k}"><ellipse cx="-36" cy="-45" rx="10" ry="6" fill="var(--cheek)" opacity="${k==='a'?.45:.5}"/><ellipse cx="36" cy="-45" rx="10" ry="6" fill="var(--cheek)" opacity="${k==='a'?.45:.5}"/></g>
   <g class="eyes" id="ey${k}">
     <g class="e e-open"><ellipse cx="-20" cy="-64" rx="9.5" ry="12" fill="var(--ink)"/><ellipse cx="20" cy="-64" rx="9.5" ry="12" fill="var(--ink)"/>
       <circle cx="-23.5" cy="-68.5" r="3.8" fill="#fff"/><circle cx="16.5" cy="-68.5" r="3.8" fill="#fff"/><circle cx="-16.5" cy="-59" r="1.7" fill="#fff"/><circle cx="23.5" cy="-59" r="1.7" fill="#fff"/></g>
     <g class="e e-closed" fill="none" stroke="var(--ink)" stroke-width="3.6" stroke-linecap="round"><path d="M-29 -63 Q-20 -55 -11 -63"/><path d="M11 -63 Q20 -55 29 -63"/></g>
     <g class="e e-happy" fill="none" stroke="var(--ink)" stroke-width="3.8" stroke-linecap="round"><path d="M-29 -59 Q-20 -72 -11 -59"/><path d="M11 -59 Q20 -72 29 -59"/></g>
     <g class="e e-squeeze" fill="none" stroke="var(--ink)" stroke-width="3.8" stroke-linecap="round" stroke-linejoin="round"><path d="M-29 -71 L-13 -64 L-29 -57"/><path d="M29 -71 L13 -64 L29 -57"/></g>
     <g class="e e-side" ><ellipse cx="-20" cy="-64" rx="9.5" ry="6" fill="var(--ink)"/><ellipse cx="20" cy="-64" rx="9.5" ry="6" fill="var(--ink)"/><path d="M-31 -71 H-9 M9 -71 H31" stroke="var(--ink)" stroke-width="3.4" stroke-linecap="round"/></g>
   </g>
   <g class="mouth">
     <path class="m m-smile" d="M-10 -44 Q0 -33 10 -44" fill="none" stroke="var(--ink)" stroke-width="3.8" stroke-linecap="round"/>
     <g class="m m-open"><path d="M-12 -47 Q0 -24 12 -47 Z" fill="var(--ink)" stroke="var(--ink)" stroke-width="2" stroke-linejoin="round"/><ellipse cx="0" cy="-34" rx="6" ry="3.6" fill="#FF8DA0"/></g>
     <ellipse class="m m-o" cx="0" cy="-40" rx="5.5" ry="7" fill="var(--ink)"/>
     <ellipse class="m m-sleep" cx="0" cy="-41" rx="3.4" ry="2.6" fill="var(--ink)"/>
     <g class="m m-cry"><ellipse cx="0" cy="-38" rx="13" ry="11" fill="var(--ink)"/><ellipse cx="0" cy="-32" rx="7" ry="4" fill="#FF8DA0"/></g>
     <path class="m m-pout" d="M-9 -37 Q0 -46 9 -37" fill="none" stroke="var(--ink)" stroke-width="3.8" stroke-linecap="round"/>
     <g class="m m-tongue"><path d="M-11 -45 Q0 -36 11 -45" fill="none" stroke="var(--ink)" stroke-width="3.8" stroke-linecap="round"/><path d="M-5 -41 Q-5 -27 0 -27 Q5 -27 5 -41 Z" fill="#FF7A92" stroke="var(--ink)" stroke-width="2.2" stroke-linejoin="round"/></g>
     <path class="m m-flat" d="M-8 -40 H8" fill="none" stroke="var(--ink)" stroke-width="3.8" stroke-linecap="round"/>
     <path class="m m-wavy" d="M-12 -40 Q-6 -46 0 -40 Q6 -34 12 -40" fill="none" stroke="var(--ink)" stroke-width="3.6" stroke-linecap="round"/>
   </g>
   <g id="tr${k}" opacity="0"><path class="tear" d="M-26 -50 c0 0 -5 7 -5 10.5 a5 5 0 0 0 10 0 c0 -3.5 -5 -10.5 -5 -10.5z" fill="#BFE6FF" stroke="#fff" stroke-width="1"/><path class="tear" d="M26 -50 c0 0 -5 7 -5 10.5 a5 5 0 0 0 10 0 c0 -3.5 -5 -10.5 -5 -10.5z" fill="#BFE6FF" stroke="#fff" stroke-width="1"/></g>
   <g id="cr${k}" opacity="0" transform="translate(0 -194)"><path d="M-20 0 L-24 -22 L-11 -11 L0 -28 L11 -11 L24 -22 L20 0 Z" fill="#FFC93C" stroke="#E0A10D" stroke-width="2" stroke-linejoin="round"/><circle cx="0" cy="-28" r="3" fill="#FF6B6B"/></g>`;
}
const css=document.createElement('style');
css.textContent='.face .e,.face .m{display:none}'+['open','closed','happy','squeeze','side'].map(e=>`.face[data-e="${e}"] .e-${e}`).join(',')+'{display:inline}'
  +['smile','open','o','sleep','cry','pout','tongue','flat','wavy'].map(m=>`.face[data-m="${m}"] .m-${m}`).join(',')+'{display:inline}';
document.head.appendChild(css);
K.forEach(buildFace);

/* ---------- character rig ---------- */
const C={}; K.forEach(k=>C[k]={x:homeX[k], y:300, jy:0, sx:1, sy:1, r:0, rk:0, ox:0, sz:1, br:0, lx:0, ly:0, bl:1, fo:1});
const E={}; K.forEach(k=>{ const U=k.toUpperCase(); E[k]={body:$('#body'+U), face:$('#face'+U), sh:$('#sh'+U), eyes:$('#ey'+k), h1:$('#h'+U+'1'), h2:$('#h'+U+'2'), pud:$('#pud'+U), ca:$('#ca'+U), night:$('#night'+U), tears:$('#tr'+k), crown:$('#cr'+k), cheeks:$('#ck'+k), propB:$('#pb'+U), propF:$('#pf'+U), loc:null}; });
function apply(){
  for(const k of K){ const c=C[k], e=E[k];
    const x=c.x+c.ox, sy=c.sy*c.sz*(1+c.br), sx=c.sx*c.sz*(1-c.br*.7);
    const t=`translate(${x.toFixed(2)} ${(c.y+c.jy).toFixed(2)}) rotate(${(c.r+c.rk).toFixed(2)}) scale(${sx.toFixed(3)} ${sy.toFixed(3)})`;
    const pt=`translate(${x.toFixed(2)} ${c.y}) rotate(${c.rk.toFixed(2)})`; e.propB.setAttribute('transform',pt); e.propF.setAttribute('transform',pt);
    e.body.setAttribute('transform',t); e.face.setAttribute('transform',t); e.face.setAttribute('opacity',c.fo);
    e.eyes.setAttribute('transform',`translate(${c.lx.toFixed(2)} ${c.ly.toFixed(2)}) translate(0 -64) scale(1 ${c.bl.toFixed(3)}) translate(0 64)`);
    const lift=Math.min(1,Math.max(0,-c.jy/90));
    e.ca.setAttribute('cx',x+10); e.ca.setAttribute('rx',18*sx*(1-lift*.5)); e.ca.setAttribute('opacity',.9*(1-lift)*c.fo+.0);
    e.sh.setAttribute('cx',x); e.sh.setAttribute('rx',46*sx*(1-lift*.45)); e.sh.setAttribute('opacity',.1*(1-lift*.6));
  }
}
gsap.ticker.add(apply);

const face=(k,e,m)=>{ const f=E[k].face; if(e) f.dataset.e=e; if(m) f.dataset.m=m; };
function baseFace(k){
  const s=S[k];
  if(s.nurse) return ['happy','o'];
  if(s.sleep) return ['closed','sleep'];
  if(hungry(k)) return ['squeeze','cry'];
  return ['open','smile'];
}
const hungry=k=>!!S[k].feed && !S[k].sleep && !S[k].nurse && Date.now()-S[k].feed>2.6*H;
const busy={a:0,b:0};
const isBusy=k=>Date.now()<busy[k];
const hold=(k,ms)=>{ busy[k]=Math.max(busy[k],Date.now()+ms); };
function rest(k){ const [e,m]=baseFace(k); face(k,e,m); }
function express(k,e,m,ms){ face(k,e,m); hold(k,ms); gsap.delayedCall(ms/1000,()=>{ if(!isBusy(k)) rest(k); }); }

/* breathing and blinking */
const breath={};
function setBreath(k){
  breath[k]?.kill(); C[k].br=0;
  const sl=!!S[k].sleep;
  breath[k]=gsap.to(C[k],{br:sl?.045:.022,duration:sl?2.4:1.4,yoyo:true,repeat:-1,ease:'sine.inOut',delay:k==='b'?.6:0});
}
function blinkLoop(k){
  gsap.delayedCall(rnd(2.2,5.2),()=>{ if(E[k].face.dataset.e==='open') gsap.to(C[k],{bl:.08,duration:.07,yoyo:true,repeat:1}); blinkLoop(k); });
}

/* posture for sleep */
function posture(k,instant){
  const sl=!!S[k].sleep, d=instant?0:.8;
  gsap.to(C[k],{sx:sl?1.13:1, sy:sl?.84:1, r:sl?(k==='a'?7:-7):0, duration:d, ease:'power2.inOut'});
  gsap.to(E[k].night,{attr:{opacity:sl?1:0},duration:instant?0:1.1});
  if(typeof setProp==='function') setProp(k);
}

/* ---------- effects ---------- */
const drops=$('#spl'), fx=$('#fx');
function splash(k,big=1,color){
  const x=C[k].x, col=color||(k==='a'?'#4AA6F2':'#F7806A');
  for(let i=0;i<14*big;i++){
    const c=el('circle',{cx:x+rnd(-20,20), cy:296, r:rnd(4,8.5)*Math.max(.8,big), fill:col},drops);
    const ang=rnd(-Math.PI*.95,-Math.PI*.05), v=rnd(110,210)*big;
    const dx=Math.cos(ang)*v, up=Math.sin(ang)*v;
    gsap.to(c,{attr:{cx:x+dx},duration:.9,ease:'none'});
    gsap.to(c,{attr:{cy:296+up},duration:.38,ease:'power2.out'});
    gsap.to(c,{attr:{cy:300},duration:.5,delay:.38,ease:'power2.in'});
    gsap.to(c,{attr:{r:0},duration:.4,delay:.75,onComplete:()=>c.remove()});
  }
}
function puddle(k,stay){
  const p=E[k].pud; p.setAttribute('cx',C[k].x);
  gsap.fromTo(p,{attr:{rx:24,ry:8}},{attr:{rx:96,ry:13},duration:.6,ease:'power2.out'});
  if(!stay) gsap.to(p,{attr:{rx:0,ry:4},duration:1.6,delay:1.2,ease:'power1.in'});
  // steam as the puddle evaporates
  if(!stay) for(let i=0;i<3;i++){ const s=el('path',{d:`M${C[k].x-30+i*30} 296 q-6 -10 0 -20 q6 -10 0 -20`,fill:'none',stroke:'#C9BBAA','stroke-width':3,'stroke-linecap':'round',opacity:0},fx);
    gsap.fromTo(s,{opacity:0,y:0},{opacity:.8,y:-18,duration:.7,delay:1.4+i*.18,yoyo:true,repeat:1,onComplete:()=>s.remove()}); }
}
function heart(x,y,size=1,color='#FF5D7A'){
  const h=el('path',{d:'M0 6 C-12 -4 -10 -16 0 -10 C10 -16 12 -4 0 6 Z',fill:color,transform:`translate(${x} ${y}) scale(0)`},fx);
  const o={s:0,y:y};
  gsap.to(o,{s:size*1.6,duration:.45,ease:'back.out(3)',onUpdate:()=>h.setAttribute('transform',`translate(${x} ${o.y}) scale(${o.s})`)});
  gsap.to(o,{y:y-60,duration:1.6,delay:.3,ease:'power1.out',onUpdate:()=>h.setAttribute('transform',`translate(${x} ${o.y}) scale(${o.s})`)});
  gsap.to(h,{opacity:0,duration:.5,delay:1.3,onComplete:()=>h.remove()});
}
function zzz(k){
  const x=C[k].x+(k==='a'?34:-34), t=el('text',{x, y:150, 'font-family':'Fredoka, Varela Round, sans-serif','font-weight':600,'font-size':18,fill:'#FFF1BF','text-anchor':'middle'},fx); t.textContent='z';
  gsap.fromTo(t,{opacity:0,attr:{y:150,'font-size':14}},{opacity:1,attr:{y:92,'font-size':30,x:x+(k==='a'?18:-18)},duration:2.4,ease:'sine.out'});
  gsap.to(t,{opacity:0,duration:.6,delay:1.9,onComplete:()=>t.remove()});
}
function milk(k,then,color){
  const x=C[k].x, d=el('path',{d:'M0 -18 C0 -18 -11 -3 -11 4 A11 11 0 0 0 11 4 C11 -3 0 -18 0 -18 Z',fill:color||'var(--milk)',stroke:'#E9DCCB','stroke-width':2,transform:`translate(${x} -30)`},fx);
  const o={y:-30};
  gsap.to(o,{y:130,duration:.55,ease:'power2.in',onUpdate:()=>d.setAttribute('transform',`translate(${x} ${o.y})`),onComplete:()=>{ d.remove(); then&&then(); }});
}
function rays(k){
  const g=el('g',{transform:`translate(${C[k].x} 150)`},fx);
  for(let i=0;i<10;i++){ const a=i/10*Math.PI*2; el('path',{d:`M${Math.cos(a)*86} ${Math.sin(a)*86} L${Math.cos(a)*112} ${Math.sin(a)*112}`,stroke:'#FFC93C','stroke-width':5,'stroke-linecap':'round'},g); }
  gsap.fromTo(g,{opacity:0,scale:.6,transformOrigin:'0 0'},{opacity:1,scale:1,duration:.4,ease:'back.out(2)'});
  gsap.to(g,{opacity:0,rotation:25,duration:.6,delay:.7,onComplete:()=>g.remove()});
}
/* a liquid hand pushes out of the drop for a moment: poke, cover ears, wave */
function hand(k,which,to,dur=.35,back=.35,delay=0){
  const h=which===1?E[k].h1:E[k].h2;
  const tl=gsap.timeline({delay});
  tl.set(h,{attr:{cx:which===1?-26:26,cy:-50,r:0}})
    .to(h,{attr:{r:16},duration:.12})
    .to(h,{attr:{cx:to[0],cy:to[1],r:13},duration:dur,ease:'back.out(1.6)'})
    .to(h,{attr:{cx:which===1?-26:26,cy:-50,r:16},duration:back,ease:'power2.in',delay:to[2]||.15})
    .to(h,{attr:{r:0},duration:.12});
  return tl;
}
const hop=(k,h=38,d=.42)=>gsap.timeline()
  .to(C[k],{sy:.86,sx:1.1,duration:.12,ease:'power2.out'})
  .to(C[k],{jy:-h,sy:1.1,sx:.92,duration:d/2,ease:'power2.out'})
  .to(C[k],{jy:0,sy:1,sx:1,duration:d/2,ease:'power2.in'})
  .to(C[k],{sy:.88,sx:1.08,duration:.08}).to(C[k],{sy:1,sx:1,duration:.25,ease:'elastic.out(1,.4)'});
const look=(k,dx,dy=0,d=.3)=>gsap.to(C[k],{lx:dx,ly:dy,duration:d,ease:'power2.out'});

/* ---------- idle behaviour between the twins ---------- */
const BEH={
  poke(f){ const t=other(f), d=dirTo(f);
    hold(f,3200); hold(t,3200); look(f,d*5); look(t,0);
    const reach=[d*92, -66, .2];
    gsap.to(C[f],{r:d*9,duration:.3}); gsap.to(C[f],{r:0,duration:.4,delay:.9});
    face(f,'happy','smile');
    hand(f, d<0?1:2, reach, .32, .3, .1);
    gsap.delayedCall(.45,()=>{ express(t,'squeeze','o',700); gsap.fromTo(C[t],{sx:1.14,sy:.88},{sx:1,sy:1,duration:.6,ease:'elastic.out(1.1,.35)'});
      gsap.delayedCall(.7,()=>{ face(t,'side','pout'); look(t,-d*-6); gsap.to(C[t],{r:-d*-6,duration:.3}); gsap.to(E[t].cheeks,{scale:1.25,transformOrigin:'0 -45',duration:.25});
        gsap.delayedCall(1.6,()=>{ gsap.to(C[t],{r:0,duration:.3}); look(t,0); gsap.to(E[t].cheeks,{scale:1,duration:.3}); }); });
      gsap.delayedCall(.6,()=>{ face(f,'happy','open'); hop(f,14,.3); }); });
    gsap.delayedCall(3.1,()=>{ rest(f); rest(t); look(f,0); });
  },
  copy(f){ const t=other(f); hold(f,2600); hold(t,2600);
    face(f,'open','open'); look(t,dirTo(t)*5);
    hop(f,46); gsap.delayedCall(.55,()=>{ face(t,'open','open'); hop(t,46); });
    gsap.delayedCall(1.4,()=>{ look(f,dirTo(f)*5); look(t,dirTo(t)*5); face(f,'happy','smile'); face(t,'happy','smile'); });
    gsap.delayedCall(2.5,()=>{ look(f,0); look(t,0); rest(f); rest(t); });
  },
  love(){ hold('a',3000); hold('b',3000);
    K.forEach(k=>{ look(k,dirTo(k)*6); gsap.to(C[k],{x:homeX[k]+dirTo(k)*26,r:dirTo(k)*8,duration:.6,ease:'power2.inOut'}); face(k,'happy','smile'); });
    gsap.delayedCall(.5,()=>{ heart(200,150,1.2); heart(214,170,.7,'#FF8FA3'); });
    gsap.delayedCall(2.2,()=>K.forEach(k=>gsap.to(C[k],{x:homeX[k],r:0,duration:.6,ease:'power2.inOut'})));
    gsap.delayedCall(2.9,()=>K.forEach(k=>{ look(k,0); rest(k); }));
  },
  tongue(f){ const t=other(f); hold(f,2800); hold(t,2800);
    look(f,dirTo(f)*6); face(f,'happy','tongue'); gsap.to(C[f],{r:dirTo(f)*6,duration:.25,yoyo:true,repeat:3});
    gsap.delayedCall(.6,()=>{ look(t,dirTo(t)*6); face(t,'open','pout'); gsap.to(E[t].cheeks,{scale:1.3,transformOrigin:'0 -45',duration:.25}); });
    gsap.delayedCall(2.5,()=>{ K.forEach(k=>{ look(k,0); rest(k); }); gsap.to(E[t].cheeks,{scale:1,duration:.3}); });
  },
  snub(f){ const t=other(f); hold(f,2600); hold(t,2600);
    look(t,dirTo(t)*6); face(t,'open','smile');
    face(f,'side','flat'); look(f,-dirTo(f)*7,-3); gsap.to(C[f],{r:-dirTo(f)*7,duration:.35});
    gsap.delayedCall(1.1,()=>{ face(t,'open','wavy'); });
    gsap.delayedCall(2.3,()=>{ gsap.to(C[f],{r:0,duration:.3}); K.forEach(k=>{ look(k,0); rest(k); }); });
  },
  peek(f){ const t=other(f), d=dirTo(f); hold(f,3600);
    face(f,'open','o'); look(f,d*6,2);
    gsap.to(C[f],{x:homeX[f]+d*44,duration:1,ease:'steps(5)'});
    gsap.to(C[f],{jy:-6,duration:.1,yoyo:true,repeat:9});
    gsap.delayedCall(1.2,()=>{ face(f,'happy','smile'); hand(f, d<0?1:2, [d*70,-40,.5], .3, .3); zzz(t); });
    gsap.delayedCall(2.4,()=>{ face(f,'open','smile'); gsap.to(C[f],{x:homeX[f],duration:.9,ease:'power2.inOut'}); });
    gsap.delayedCall(3.4,()=>{ look(f,0); rest(f); });
  },
  earmuffs(cryer){ const t=other(cryer); if(S[t].sleep||S[t].nurse||isBusy(t)) return; hold(t,2600);
    face(t,'squeeze','wavy');
    hand(t,1,[-46,-104,1.4],.25,.3); hand(t,2,[46,-104,1.4],.25,.3);
    gsap.delayedCall(2.4,()=>rest(t));
  },
  jealous(nurser){ const t=other(nurser); if(S[t].sleep||isBusy(t)) return; hold(t,2400);
    look(t,dirTo(t)*7); face(t,'open','pout'); gsap.to(E[t].cheeks,{scale:1.3,transformOrigin:'0 -45',duration:.25});
    gsap.delayedCall(2.2,()=>{ look(t,0); rest(t); gsap.to(E[t].cheeks,{scale:1,duration:.3}); });
  }
};
function idle(){
  gsap.delayedCall(rnd(4.5,7.5),idle);
  if(!visible() || sheetOpen) return;
  const free=K.filter(k=>!isBusy(k));
  const aw=K.filter(k=>!S[k].sleep && !S[k].nurse && !hungry(k));
  const cry=K.find(hungry), nur=K.find(k=>S[k].nurse);
  if(cry){ BEH.earmuffs(cry); return; }
  if(nur){ BEH.jealous(nur); return; }
  if(free.length<2 && !(aw.length===1 && free.includes(aw[0]))) return;
  if(aw.length===2) BEH[pick(['poke','copy','love','tongue','snub','sip','splashAt','bubble','hide','sip','poke'])](pick(K));
  else if(aw.length===1) BEH.peek(aw[0]);
}
/* crying: shake and tears while hungry */
const cryTl={};
function cryLoop(k){
  const on=hungry(k);
  if(on && !cryTl[k]){
    const tl=gsap.timeline({repeat:-1});
    tl.to(C[k],{r:3.5,duration:.09,ease:'sine.inOut'}).to(C[k],{r:-3.5,duration:.18,ease:'sine.inOut'}).to(C[k],{r:0,duration:.09}).to({}, {duration:.5});
    const tears=E[k].tears.querySelectorAll('.tear');
    const tt=gsap.timeline({repeat:-1}); tt.fromTo(tears,{y:0,opacity:1},{y:34,opacity:0,duration:.9,ease:'power1.in',stagger:.25});
    gsap.to(E[k].tears,{attr:{opacity:1},duration:.3});
    cryTl[k]=[tl,tt];
  } else if(!on && cryTl[k]){ cryTl[k].forEach(t=>t.kill()); cryTl[k]=null; gsap.to(C[k],{r:S[k].sleep?(k==='a'?7:-7):0,duration:.3}); gsap.to(E[k].tears,{attr:{opacity:0},duration:.2}); }
}
/* the drop that has not been changed for 4+ hours leaks a little */
const leakT={};
function leakLoop(k){
  const on=!!S[k].diaper && Date.now()-S[k].diaper>4*H;
  if(on && !leakT[k]){ leakT[k]=setInterval(()=>{ if(!visible()) return;
      const x=C[k].x+(k==='a'?-14:14), d=el('circle',{cx:x,cy:288,r:6,fill:k==='a'?'#4AA6F2':'#F7806A'},drops);
      gsap.to(d,{attr:{cy:300,r:3},duration:.6,ease:'power2.in',onComplete:()=>d.remove()});
      const p=E[k].pud; p.setAttribute('cx',C[k].x); if(+p.getAttribute('rx')<70) gsap.to(p,{attr:{rx:Math.max(40,+p.getAttribute('rx')+5)},duration:.4});
    },1400); }
  else if(!on && leakT[k]){ clearInterval(leakT[k]); leakT[k]=null; }
}
/* hearts while nursing, z's while asleep */
setInterval(()=>{ if(!visible()) return; K.forEach(k=>{ if(S[k].sleep && !isBusy(k)) zzz(k); if(S[k].nurse) heart(C[k].x+rnd(-30,30),110,.6); }); },2200);

/* ---------- competition, woven into the stage ---------- */
function showScore(){
  const [id,label,icon]=CATS[catI], v=tally[id], lead=v.a===v.b?null:(v.a>v.b?'a':'b');
  const s=$('#score');
  s.innerHTML=`<span class="ic">${ico(icon)}</span><span class="n a ${lead==='a'?'win':''}">${v.a}</span><span class="sep">:</span><span class="n b ${lead==='b'?'win':''}">${v.b}</span><span class="lbl">${label}</span>`;
  s.classList.remove('score-in'); void s.offsetWidth; s.classList.add('score-in');
  s.setAttribute('aria-label',`${label}: ${S.a.name} ${v.a}, ${S.b.name} ${v.b}. הקשה לפירוט`);
  K.forEach(k=>gsap.to(E[k].crown,{attr:{opacity:0},duration:.2}));
  if(lead){ const l=lead, lo=other(lead);
    const cr=E[l].crown; gsap.fromTo(cr,{attr:{opacity:0}},{attr:{opacity:1},duration:.25});
    if(!S[l].sleep && !isBusy(l)){ hold(l,1600); face(l,'happy','open'); hop(l,22,.36); gsap.delayedCall(1.4,()=>rest(l)); }
    if(!S[lo].sleep && !hungry(lo) && !S[lo].nurse && !isBusy(lo)){ hold(lo,1800); gsap.delayedCall(.3,()=>{ face(lo,'side','pout'); look(lo,-dirTo(lo)*6,-2); });
      gsap.delayedCall(1.7,()=>{ look(lo,0); rest(lo); }); }
    gsap.to(cr,{attr:{opacity:0},duration:.4,delay:3.6});
  } else K.forEach(k=>{ if(!S[k].sleep && !isBusy(k) && !hungry(k)){ hold(k,1000); hop(k,18,.34); } });
}
setInterval(()=>{ if(sheetOpen||!visible()) return; catI=(catI+1)%CATS.length; showScore(); },6500);

/* ---------- controls ---------- */
function half(k){
  const s=S[k], now=Date.now(), h=$('#half'+k.toUpperCase());
  const sinceFeed=s.feed?now-s.feed:null, frac=sinceFeed==null?0:Math.max(0,1-sinceFeed/(3*H));
  const sleepChip = s.sleep ? `<span class="chip">${ico('moon')}${hm(now-s.sleep)}</span>` : `<span class="chip">${ico('sun')}${s.wake?hm(now-s.wake):'—'}</span>`;
  const dLate=s.diaper && now-s.diaper>4*H;
  const dis=canWrite?'':'disabled';
  const top = s.nurse
    ? `<div class="nm">${esc(s.name)}</div><div class="big"><span class="t">${clk(now-s.nurse.t)}</span><span class="l">הנקה · ${s.nurse.side==='L'?'שמאל':'ימין'}</span></div>
       <div class="nurse-ctl"><button data-swap="${k}" ${dis}>${ico('swap','style="width:18px;height:18px;vertical-align:-4px"')} צד</button><button data-stop="${k}" ${dis}>סיום</button></div>`
    : `<div class="nm">${esc(s.name)}</div><div class="big"><span class="t">${sinceFeed==null?'—':hm(sinceFeed)}</span><span class="l">מהאכלה${s.next?' · הבא '+(s.next==='L'?'שמאל':'ימין'):''}</span></div>
       <div class="tube" role="img" aria-label="${sinceFeed==null?'אין האכלה רשומה':hm(sinceFeed)+' מאז האכלה'}"><i style="width:${(frac*100).toFixed(1)}%"></i></div>
       <div class="chips">${sleepChip}<span class="chip ${dLate?'warn':''}">${ico('diaper')}${s.diaper?hm(now-s.diaper):'—'}</span></div>`;
  const acts=[['feed','bottle','האכלה'],['nurse','nurse',s.nurse?'בהנקה':'הנקה'],['diaper','diaper','חיתול'],['sleep',s.sleep?'sun':'moon',s.sleep?g(k,'קם','קמה'):'שינה']];
  h.innerHTML = top + `<div class="acts">${acts.map(([a,i,l])=>`<button class="act ${a==='nurse'&&s.nurse?'on':''}" data-act="${a}" data-k="${k}" aria-label="${l} · ${esc(s.name)}" ${dis}>${ico(i)}<span>${l}</span></button>`).join('')}</div>`;
}
function renderCtl(){ K.forEach(half); $('#ctl').classList.toggle('both',both); $('#bothBtn').setAttribute('aria-pressed',both); $('#bothBtn').disabled=!canWrite; }
function renderAlerts(){
  const box=$('#dAlerts');
  const one=a=>`<div class="al ${a.lvl}" role="${a.lvl==='urgent'?'alert':'status'}" ${a.go?`data-go="${a.go}" style="cursor:pointer"`:''}>${esc(a.txt)}${a.note?`<small>${esc(a.note)}</small>`:''}</div>`;
  const urgent=alerts.filter(a=>a.lvl==='urgent'), rest=alerts.filter(a=>a.lvl!=='urgent'), open=box.classList.contains('open');
  box.innerHTML=urgent.map(one).join('') + (rest.length>1 && !open
    ? `<div class="al sum" role="status" aria-expanded="false"><b>${rest.length} תזכורות</b> · ${esc(rest[0].txt)}</div>`
    : rest.map(one).join('') + (rest.length>1?'<div class="al sum less" aria-expanded="true">הסתרה</div>':''));
  box.hidden=!alerts.length;
}
setInterval(()=>{ if(!visible()) return; if(!sheetOpen) renderCtl(); K.forEach(k=>{ cryLoop(k); leakLoop(k); if(!isBusy(k)) rest(k); }); },1000);

/* ---------- actions: animation first, then the record through the app ---------- */
function toast(msg){ const t=$('#dToast'); t.textContent=msg; t.classList.add('on'); clearTimeout(toast.t); toast.t=setTimeout(()=>t.classList.remove('on'),2200); }
async function doAct(a,k){
  if(!canWrite) return;
  const ks=both?['a','b']:[k]; const wasBoth=both; both=false; renderCtl();
  let ids={};
  if(a==='feed'||a==='diaper'){ ids=await api.add(a,ks,wasBoth&&a==='feed'?{together:true}:{}); }
  if(a==='nurse'){ for(const x of ks){ if(S[x].nurse){ stopNurse(x); } else { S[x].nurse={t:Date.now(),side:S[x].next||'L'}; api.nurseStart(x,wasBoth); } } }
  if(a==='sleep'){
    const waking = wasBoth ? ks.every(x=>S[x].sleep) : !!S[k].sleep;
    if(waking){ for(const x of ks) if(S[x].sleep) api.sleepEnd(x); }
    else { const need=ks.filter(x=>!S[x].sleep); ids=await api.add('sleep',need,{end:null}); }
    ks.forEach(x=>{ S[x]._wake=waking; });
  }
  const run=()=>ks.forEach((x,i)=>gsap.delayedCall(i*.12,()=>effect(a,x,wasBoth,ids)));
  if(wasBoth) merge(run); else run();
}
function effect(a,k,isBoth,ids){
  const s=S[k]; const now=Date.now(), id=ids&&ids[k];
  if(a==='feed'){ hold(k,2600); face(k,'open','open'); look(k,0,-5);
    milk(k,()=>{ face(k,'happy','o'); gsap.fromTo(C[k],{sy:.8,sx:1.18},{sy:1,sx:1,duration:.8,ease:'elastic.out(1,.35)'}); heart(C[k].x,70,.7,'#FFB3C1');
      s.feed=now; renderCtl(); gsap.delayedCall(1,()=>{ look(k,0); face(k,'happy','smile'); }); });
    if(!isBoth && id) gsap.delayedCall(.75,()=>openFeed(k,id)); react(other(k),'look');
  }
  if(a==='nurse'){
    if(!s.nurse) return;
    s.sleep=null; posture(k); hold(k,900); hop(k,16,.3); gsap.delayedCall(.9,()=>rest(k)); heart(C[k].x,90,1);
    renderCtl(); toast(`הנקה התחילה · ${s.name}`); react(other(k),'envy');
  }
  if(a==='diaper'){ hold(k,2400);
    face(k,'squeeze','o');
    gsap.timeline().to(C[k],{sy:.75,sx:1.22,duration:.18}).to(C[k],{jy:-70,sy:1.15,sx:.9,duration:.32,ease:'power2.out'}).to(C[k],{jy:0,sy:1,sx:1,duration:.3,ease:'power2.in'})
      .add(()=>{ splash(k,1.15); puddle(k); face(k,'happy','open'); }).to(C[k],{sy:.8,sx:1.2,duration:.08}).to(C[k],{sy:1,sx:1,duration:.6,ease:'elastic.out(1,.35)'});
    gsap.delayedCall(1.8,()=>rest(k));
    s.diaper=now; renderCtl();
    if(!isBoth && id) gsap.delayedCall(.9,()=>openDiaper(k,id)); react(other(k),'giggle');
  }
  if(a==='sleep'){
    if(s._wake){ s.sleep=null; s.wake=now; hold(k,1500); face(k,'open','open'); rays(k);
      gsap.timeline().to(C[k],{sy:1.25,sx:.88,r:0,duration:.35,ease:'power2.out'}).to(C[k],{sy:1,sx:1,duration:.7,ease:'elastic.out(1,.35)'});
      gsap.to(E[k].night,{attr:{opacity:0},duration:1}); setBreath(k); setProp(k); gsap.delayedCall(1.4,()=>rest(k)); toast(`${s.name} ${g(k,'התעורר','התעוררה')}`); react(other(k),'greet');
    } else if(id){ hold(k,1600); face(k,'closed','open');
      gsap.delayedCall(.8,()=>{ s.sleep=now; s.nurse=null; posture(k); setBreath(k); rest(k); });
      if(!isBoth) gsap.delayedCall(1.2,()=>openSleep(k,id)); }
    renderCtl();
  }
}
/* both: the drops melt into one drop, then part again */
function merge(after){
  K.forEach(k=>hold(k,2600));
  const tl=gsap.timeline();
  tl.to(C.a,{x:226,duration:.55,ease:'power2.in'},0).to(C.b,{x:174,duration:.55,ease:'power2.in'},0)
    .to([C.a,C.b],{fo:0,duration:.2},.35)
    .to([C.a,C.b],{sy:1.12,sx:1.06,duration:.25},.55)
    .add(()=>{ heart(200,40,1.4); splash('a',.6,'#9C8CF0'); },.6)
    .to([C.a,C.b],{sy:1,sx:1,duration:.3},.85)
    .to(C.a,{x:homeX.a,duration:.9,ease:'elastic.out(1,.5)'},1.25).to(C.b,{x:homeX.b,duration:.9,ease:'elastic.out(1,.5)'},1.25)
    .to([C.a,C.b],{fo:1,duration:.25},1.35)
    .add(after,1.45);
}
function stopNurse(k){ const s=S[k]; if(!s.nurse) return; s.feed=s.nurse.t; s.nurse=null; renderCtl(); rest(k); api.nurseStop(k); FX.full(k); }

/* ---------- sheets: details by picture, each choice moves the drops ---------- */
let sheetOpen=false;
const sh=$('#dSheet');
function openSheet(html,bind){ sh.innerHTML=html; sh.classList.add('on'); $('#dScrim').classList.add('on'); sheetOpen=true; bind&&bind(sh);
  const tm=sh.querySelector('[data-tm]'); if(tm) tm.onchange=()=>{ if(tm.value) api.setTime(JSON.parse(tm.dataset.tm),tm.value); };
  const ed=sh.querySelector('[data-edit]'); if(ed) ed.onclick=()=>{ closeSheet(); api.edit(ed.dataset.edit); };
  const f=sh.querySelector('button'); f&&f.focus({preventScroll:true}); }
function closeSheet(){ sh.classList.remove('on'); $('#dScrim').classList.remove('on'); sheetOpen=false; renderCtl(); }
$('#dScrim').onclick=closeSheet;
document.addEventListener('keydown',e=>{ if(e.key==='Escape'&&sheetOpen) closeSheet(); });
const top=(k,title,ids)=>`<div class="sh-top"><span class="dot" style="background:${k==='a'?'var(--a2)':'var(--b2)'}"></span><b>${title} · ${esc(S[k].name)}</b>${ids?`<input class="tm" type="time" aria-label="שעה" value="${hhmm(Date.now())}" data-tm='${JSON.stringify(ids)}'>`:''}<button class="ghost" data-x>ביטול</button></div>`;
const editLink=id=>`<button class="more" data-edit="${id}">כל הפרטים</button>`;
function pressGroup(root,sel,cb){ root.querySelectorAll(sel).forEach(b=>b.onclick=()=>{ b.parentElement.querySelectorAll('button').forEach(x=>x.setAttribute('aria-pressed',x===b)); cb&&cb(b); }); }

function openDiaper(k,id){
  openSheet(`${top(k,'חיתול',[id])}
    <div class="tiles" style="--n:4"><button class="tile" data-v="wet">${ico('wet','style="color:#4AA6F2"')}רטוב</button><button class="tile" data-v="dirty">${ico('poop','style="color:#9A6A3A"')}קקי</button><button class="tile" data-v="mixed">${ico('both','style="color:#7B6AD8"')}שניהם</button><button class="tile" data-v="dry">${ico('dry','style="color:#B9A27E"')}יבש</button></div>
    <button class="more" data-more>צבע וכמות</button>`, s=>{
    s.querySelector('[data-x]').onclick=()=>{ closeSheet(); api.remove([id]); toast('החיתול בוטל'); FX.cancel(k); };
    pressGroup(s,'.tile',b=>{ const v=b.dataset.v; api.patch(id,{kind:v});
      gsap.delayedCall(.25,()=>{ closeSheet(); if(v==='wet') FX.wet(k); if(v==='dirty') FX.dirty(k); if(v==='mixed'){ FX.wet(k); gsap.delayedCall(.5,()=>FX.dirty(k)); } if(v==='dry') FX.dry(k);
        toast(`חיתול ${b.textContent.trim()} · ${S[k].name}`); if(v==='dirty'||v==='mixed'){ gsap.delayedCall(2.4,()=>{ catI=1; showScore(); }); } }); });
    s.querySelector('[data-more]').onclick=()=>diaperMore(k,id);
  });
}
function diaperMore(k,id){
  const COL=[['yellow','#E8C23A','צהוב'],['mustard','#B98A2E','חרדל'],['green','#6F8F3C','ירוק'],['brown','#7A5233','חום'],['black','#2B2420','שחור',1],['red','#B8352B','אדום',1],['pale','#E4E0D6','לבן',1]];
  const drop=s=>`<svg viewBox="0 0 24 24" style="width:${s}px;height:${s}px"><path d="M12 3C12 3 6 10 6 14a6 6 0 0 0 12 0C18 10 12 3 12 3Z" fill="#9A6A3A"/></svg>`;
  openSheet(`${top(k,'חיתול')}
    <div class="sec">צבע</div><div class="sw">${COL.map(([key,c,l,w])=>`<button data-w="${w?1:0}" data-key="${key}" data-c="${c}" aria-pressed="false"><i style="background:${c}"></i>${l}</button>`).join('')}</div>
    <div class="alertline" id="dWarnC" hidden>צבע שדורש בדיקה. כדאי לפנות לרופא הילדים היום.</div>
    <div class="sec">כמות</div><div class="amt">${[16,24,34].map((s,i)=>`<button aria-pressed="false" data-amt="${['light','medium','heavy'][i]}" aria-label="${['קל','בינוני','כבד'][i]}">${drop(s)}</button>`).join('')}</div>
    <button class="save" data-save>שמירה</button>${editLink(id)}`, s=>{
    s.querySelector('[data-x]').onclick=closeSheet;
    pressGroup(s,'.sw button',b=>{ s.querySelector('#dWarnC').hidden=b.dataset.w!=='1'; FX.color(k,b.dataset.c); api.patch(id,{color:b.dataset.key}); });
    pressGroup(s,'.amt button',b=>{ FX.amount(k,[...b.parentElement.children].indexOf(b)); api.patch(id,{amount:b.dataset.amt}); });
    s.querySelector('[data-save]').onclick=()=>{ closeSheet(); toast('נשמר'); };
  });
}
function openFeed(k,id){
  const nx=S[k].next;
  openSheet(`${top(k,'האכלה',[id])}
    <div class="tiles"><button class="tile" data-v="R">${ico('right')}ימין${nx==='R'?' ✓':''}</button><button class="tile" data-v="L">${ico('left')}שמאל${nx==='L'?' ✓':''}</button><button class="tile" data-v="bottle">${ico('bottle')}בקבוק</button></div>
    <div class="sec">עוד משהו?</div>
    <div class="tiles" style="--n:2"><button class="tile" data-x2="burp" style="min-height:80px">${ico('burp')}גרעפס</button><button class="tile" data-x2="spit" style="min-height:80px">${ico('spit')}פליטה</button></div>${editLink(id)}`, s=>{
    s.querySelector('[data-x]').onclick=()=>{ closeSheet(); api.remove([id]); toast('ההאכלה בוטלה'); FX.cancel(k); };
    pressGroup(s,'.tile[data-v]',b=>{ if(b.dataset.v==='bottle'){ openBottle(k,id); return; } api.patch(id,{side:b.dataset.v});
      gsap.delayedCall(.25,()=>{ closeSheet(); FX.side(k,b.dataset.v); toast(`האכלה · ${b.dataset.v==='L'?'שמאל':'ימין'} · ${S[k].name}`); }); });
    s.querySelectorAll('[data-x2]').forEach(b=>b.onclick=()=>{ const t=b.dataset.x2; api.add(t,[k],{}); b.setAttribute('aria-pressed','true');
      busy[k]=0; if(t==='burp') FX.burp(k); else FX.spit(k);
      gsap.delayedCall(.6,()=>{ catI=t==='burp'?0:2; showScore(); }); });
  });
}
function openBottle(k,id){
  let ml=S[k].lastMl||80; const MAX=240, last=S[k].lastMl;
  const levelY=v=>214-v/MAX*168;
  openSheet(`${top(k,'בקבוק',[id])}
    <div class="bottle">
      <svg viewBox="0 0 140 240" id="dBtl" role="slider" aria-label="כמות בבקבוק" aria-valuemin="0" aria-valuemax="${MAX}" aria-valuenow="${ml}" tabindex="0">
        <defs><clipPath id="dBc"><path d="M38 46 H102 V206 Q102 222 86 222 H54 Q38 222 38 206 Z"/></clipPath></defs>
        <path d="M58 6 H82 V24 H58 Z" fill="#FFD8C9"/><path d="M50 24 H90 Q96 24 96 32 V46 H44 V32 Q44 24 50 24 Z" fill="#F7B8A3"/>
        <g clip-path="url(#dBc)"><rect x="30" y="0" width="80" height="240" fill="#F7F1E8"/><g id="dMilkLv"><path d="M30 0 Q50 -6 70 0 T110 0 V260 H30 Z" fill="#FFFDF7" stroke="#EADBC6" stroke-width="2"/></g></g>
        <path d="M38 46 H102 V206 Q102 222 86 222 H54 Q38 222 38 206 Z" fill="none" stroke="#22203A" stroke-width="2.5"/>
        ${[40,80,120,160,200,240].map(v=>`<path d="M102 ${levelY(v)} h-12" stroke="#22203A" stroke-width="1.5"/><text x="86" y="${levelY(v)+4}" text-anchor="end" font-size="10" fill="#6E6A80" font-family="Fredoka, sans-serif">${v}</text>`).join('')}
      </svg>
      <div style="display:flex;flex-direction:column;gap:12px;min-width:0">
        <div class="ml"><span id="dMlv">${ml}</span> <small>מ״ל</small></div>
        <div class="hint">גוררים את החלב בבקבוק למעלה או למטה</div>
        <div class="qchips">${last?`<button data-ml="${last}">כמו בפעם הקודמת · ${last}</button>`:''}<button data-ml="60">60</button><button data-ml="90">90</button><button data-ml="120">120</button></div>
      </div>
    </div>
    <div class="tiles milkt" style="--n:2"><button class="tile" aria-pressed="true" data-milk="pumped" style="min-height:64px;flex-direction:row;gap:10px">${ico('pumped')}חלב אם</button><button class="tile" data-milk="formula" style="min-height:64px;flex-direction:row;gap:10px" aria-pressed="false">${ico('formula')}תמ״ל</button></div>
    <button class="save" data-save>שמירה</button>`, s=>{
    const svg=s.querySelector('#dBtl'), lv=s.querySelector('#dMilkLv');
    const set=v=>{ ml=Math.max(0,Math.min(MAX,Math.round(v/5)*5)); s.querySelector('#dMlv').textContent=ml; svg.setAttribute('aria-valuenow',ml); gsap.to(lv,{y:levelY(ml),duration:.25,ease:'power2.out'}); };
    gsap.set(lv,{y:levelY(ml)});
    gsap.to(lv.firstChild,{x:-40,duration:1.6,repeat:-1,ease:'none'});
    const fromEv=e=>{ const r=svg.getBoundingClientRect(); const y=(e.clientY-r.top)/r.height*240; set((214-y)/168*MAX); };
    let drag=false;
    svg.addEventListener('pointerdown',e=>{ drag=true; svg.setPointerCapture(e.pointerId); fromEv(e); });
    svg.addEventListener('pointermove',e=>{ if(drag) fromEv(e); });
    svg.addEventListener('pointerup',()=>drag=false);
    svg.addEventListener('keydown',e=>{ if(e.key==='ArrowUp'){ set(ml+5); e.preventDefault(); } if(e.key==='ArrowDown'){ set(ml-5); e.preventDefault(); } });
    s.querySelectorAll('[data-ml]').forEach(b=>b.onclick=()=>set(+b.dataset.ml));
    let milkType='pumped'; pressGroup(s,'.milkt .tile',b=>{ milkType=b.dataset.milk; });
    s.querySelector('[data-x]').onclick=closeSheet;
    s.querySelector('[data-save]').onclick=()=>{ api.patch(id,{side:'bottle',ml,milk:milkType}); closeSheet(); busy[k]=0; FX.bottle(k,ml,milkType==='formula'); toast(`בקבוק ${ml} מ״ל · ${S[k].name}`); };
  });
}
function openSleep(k,id){
  openSheet(`${top(k,g(k,'נרדם','נרדמה'),[id])}
    <div class="tiles" style="--n:4">${[['crib','מיטה'],['bassinet','עריסה'],['arms','ידיים'],['stroller','עגלה']].map(([i,l])=>`<button class="tile" data-v="${i}" style="min-height:92px">${ico(i)}${l}</button>`).join('')}</div>${editLink(id)}`, s=>{
    s.querySelector('[data-x]').onclick=()=>{ closeSheet(); api.remove([id]); S[k].sleep=null; S[k].wake=Date.now(); posture(k); setBreath(k); rest(k); toast('השינה בוטלה'); FX.cancel(k); };
    pressGroup(s,'.tile',b=>{ api.patch(id,{loc:b.dataset.v}); gsap.delayedCall(.25,()=>{ closeSheet(); FX.sleepLoc(k,b.dataset.v); toast(`${S[k].name} ${g(k,'ישן','ישנה')} · ${b.textContent.trim()}`); }); });
  });
}
function openLead(){
  const drop=c=>`<svg viewBox="0 0 24 24"><path d="M12 3C12 3 6 10 6 14a6 6 0 0 0 12 0C18 10 12 3 12 3Z" fill="${c}"/></svg>`;
  const lg = league.people.length ? `<div class="sec" style="margin-top:4px">ההורים · 7 ימים</div>`+league.rows.map(([l,vals])=>`<div class="par"><span>${l}</span><span>${vals.map((v,i)=>`<b>${v}</b> ${esc(league.people[i])}`).join(' · ')}</span></div>`).join('') : '';
  openSheet(`<div class="sh-top"><b>מי מוביל היום</b><button class="ghost" data-x>סגירה</button></div>
    <div class="lead" style="font-size:14px;color:var(--muted)"><span style="text-align:center;color:var(--a-ink);font-family:var(--display);font-weight:600;font-size:17px">${esc(S.a.name)}</span><span></span><span style="text-align:center;color:var(--b-ink);font-family:var(--display);font-weight:600;font-size:17px">${esc(S.b.name)}</span></div>
    ${CATS.map(([id,l,i])=>{ const v=tally[id]; return `<div class="lead lrow"><div class="col stack"><span class="num" style="color:var(--a-ink)">${v.a}</span>${Array.from({length:Math.min(v.a,12)},()=>drop('#4AA6F2')).join('')}</div>
      <div class="mid">${ico(i)}${l}</div><div class="col stack"><span class="num" style="color:var(--b-ink)">${v.b}</span>${Array.from({length:Math.min(v.b,12)},()=>drop('#F7806A')).join('')}</div></div>`; }).join('')}
    ${lg}<p class="hint" style="margin:0">כל טיפה היא רישום אחד מהיום.</p>`, s=>{ s.querySelector('[data-x]').onclick=closeSheet; });
}

/* ---------- wiring ---------- */
root.addEventListener('click',e=>{
  e.stopPropagation();
  const al=e.target.closest('.al'); if(al && !al.dataset.go){ $('#dAlerts').classList.toggle('open'); renderAlerts(); return; }
  const b=e.target.closest('button,[data-go]'); if(!b || b.closest('#dSheet')) return;
  if(b.dataset.go){ api.go(b.dataset.go); return; }
  if(b.dataset.act){ doAct(b.dataset.act,b.dataset.k); return; }
  if(b.dataset.swap){ const k=b.dataset.swap, n=S[k].nurse; if(n&&canWrite){ n.side=n.side==='L'?'R':'L'; renderCtl(); FX.swap(k); api.nurseSwap(k); } return; }
  if(b.dataset.stop){ if(canWrite) stopNurse(b.dataset.stop); return; }
  if(b.id==='bothBtn'){ if(!canWrite) return; both=!both; renderCtl(); if(both){ K.forEach(k=>{ if(!S[k].sleep&&!isBusy(k)){ look(k,dirTo(k)*6); gsap.delayedCall(.8,()=>look(k,0)); } }); } return; }
  if(b.id==='score'){ openLead(); return; }
});

/* ---------- the room ---------- */
(function room(){
  const bb=$('#bubbles');
  for(let i=0;i<9;i++){ const c=el('circle',{cx:rnd(10,390),cy:330,r:rnd(3,8),fill:'#fff','fill-opacity':.35,stroke:'#fff','stroke-width':1.5,opacity:.85},bb);
    gsap.fromTo(c,{attr:{cy:rnd(260,330)}},{attr:{cy:-20},duration:rnd(10,17),repeat:-1,delay:-rnd(0,14),ease:'none'});
    gsap.to(c,{attr:{cx:'+='+Math.round(rnd(-20,20))},duration:rnd(2,4),yoyo:true,repeat:-1,ease:'sine.inOut'}); }
  root.querySelectorAll('.cloud').forEach((c,i)=>gsap.to(c,{x:i?-26:30,duration:14+i*4,yoyo:true,repeat:-1,ease:'sine.inOut'}));
})();

/* ---------- where a sleeping twin lies: crib, bassinet, arms, stroller ---------- */
const PROPS={
  crib:{back:'<g stroke="#D9B797" stroke-width="5" stroke-linecap="round"><path d="M-86 6 V-152 M86 6 V-152 M-86 -134 H86"/><path d="M-58 -134 V0 M-29 -134 V0 M0 -134 V0 M29 -134 V0 M58 -134 V0"/></g>',
        front:'<path d="M-92 -14 H92" stroke="#C49A74" stroke-width="9" stroke-linecap="round"/><path d="M-86 -14 V8 M86 -14 V8" stroke="#C49A74" stroke-width="7" stroke-linecap="round"/>'},
  bassinet:{back:'<path d="M-90 -50 Q-94 -164 0 -162 Q44 -160 66 -140 L-30 -50 Z" fill="#F7DDEB" stroke="#E7BCD3" stroke-width="3" stroke-linejoin="round"/>',
        front:'<path d="M-94 -24 H94 Q90 12 0 14 Q-90 12 -94 -24 Z" fill="#FBE8F2" stroke="#E7BCD3" stroke-width="3"/><path d="M-72 -12 Q-36 -2 0 -12 Q36 -2 72 -12" fill="none" stroke="#E7BCD3" stroke-width="2.5"/><path d="M-70 16 Q0 30 70 16" fill="none" stroke="#C49A74" stroke-width="6" stroke-linecap="round"/>'},
  arms:{back:'',
        front:'<path d="M-92 -58 Q-98 14 0 14 Q98 14 92 -58" fill="none" stroke="#F1C7A5" stroke-width="22" stroke-linecap="round"/><circle cx="-92" cy="-62" r="14" fill="#F1C7A5"/><circle cx="92" cy="-62" r="14" fill="#F1C7A5"/><path d="M-60 6 Q0 22 60 6" fill="none" stroke="#E2AE88" stroke-width="3" stroke-linecap="round"/>'},
  stroller:{back:'<path d="M-98 -36 Q-102 -170 8 -170 L8 -36 Z" fill="#D7E6FA" stroke="#B5C9E6" stroke-width="3"/><path d="M90 -30 L118 -150 h18" fill="none" stroke="#8A8FA8" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>',
        front:'<path d="M-100 -30 H98 Q92 4 0 6 Q-94 4 -100 -30Z" fill="#E4EEFB" stroke="#B5C9E6" stroke-width="3"/><circle cx="-58" cy="10" r="10" fill="#fff" stroke="#6E6A80" stroke-width="5"/><circle cx="58" cy="10" r="10" fill="#fff" stroke="#6E6A80" stroke-width="5"/>'}
};
const rockTl={};
function setProp(k){
  const loc=S[k].sleep?(S[k].loc||'crib'):null, e=E[k];
  if(e.loc===loc) return; e.loc=loc;
  e.propB.innerHTML=loc?PROPS[loc].back:''; e.propF.innerHTML=loc?PROPS[loc].front:'';
  if(loc) gsap.fromTo([e.propB,e.propF],{opacity:0},{opacity:1,duration:.6});
  rockTl[k]?.kill(); rockTl[k]=null; gsap.to(C[k],{rk:0,ox:0,duration:.4});
  if(loc==='bassinet'||loc==='arms'){ C[k].rk=-5; rockTl[k]=gsap.to(C[k],{rk:5,duration:1.6,yoyo:true,repeat:-1,ease:'sine.inOut'}); }
  if(loc==='stroller'){ C[k].ox=-8; rockTl[k]=gsap.to(C[k],{ox:8,duration:1.8,yoyo:true,repeat:-1,ease:'sine.inOut'}); }
}

/* ---------- more ways the twins play ---------- */
Object.assign(BEH,{
  /* one drinks a little of the other through a liquid straw; the small one wants it back */
  sip(f){ const t=other(f), d=dirTo(f); if(S[t].sleep||S[f].sleep) return; hold(f,5200); hold(t,5200);
    look(f,d*7); face(f,'happy','o'); gsap.to(C[f],{r:d*8,duration:.4}); face(t,'open','smile');
    const x0=C[f].x+d*44, x1=C[t].x-d*40, y=C[f].y-50, n=8, beads=[];
    for(let i=0;i<n;i++){ const c=el('circle',{cx:x0+(x1-x0)*i/(n-1),cy:y-Math.sin(i/(n-1)*Math.PI)*16,r:0,fill:f==='a'?'#5AAEF3':'#F6826C'},$('#drops')); beads.push(c); }
    gsap.to(beads,{attr:{r:10},duration:.18,stagger:.05});
    for(let j=0;j<4;j++){ const gb=el('circle',{cx:x1,cy:y-8,r:0,fill:t==='a'?'#4AA6F2':'#F7806A'},$('#drops'));
      gsap.timeline({delay:.8+j*.35}).set(gb,{attr:{r:14}}).to(gb,{attr:{cx:x0},duration:.5,ease:'power1.in'}).set(gb,{attr:{r:0},onComplete:()=>gb.remove()}); }
    gsap.to(C[t],{sz:.74,duration:1.5,delay:.8,ease:'power1.inOut'}); gsap.to(C[f],{sz:1.2,duration:1.5,delay:.8,ease:'power1.inOut'});
    gsap.delayedCall(1.3,()=>{ face(t,'open','o'); look(t,dirTo(t)*7); });
    gsap.delayedCall(2.3,()=>{ gsap.to(beads,{attr:{r:0},duration:.2,stagger:-.04,onComplete:()=>beads.forEach(b=>b.remove())}); gsap.to(C[f],{r:0,duration:.3}); face(f,'happy','smile'); face(t,'squeeze','wavy'); });
    gsap.delayedCall(3.1,()=>{ face(t,'side','pout'); hand(t, dirTo(t)<0?1:2, [dirTo(t)*92,-62,.2],.3,.3); });
    gsap.delayedCall(3.5,()=>{ face(f,'squeeze','o'); gsap.to(C[f],{sz:1,duration:.9,ease:'elastic.out(1,.4)'}); gsap.to(C[t],{sz:1,duration:.9,ease:'elastic.out(1,.4)'}); });
    gsap.delayedCall(4.6,()=>K.forEach(k=>{ look(k,0); rest(k); }));
  },
  /* a splash fight */
  splashAt(f){ const t=other(f), d=dirTo(f); hold(f,3600); hold(t,3600);
    face(f,'happy','open'); look(f,d*6);
    gsap.timeline().to(C[f],{r:-d*10,duration:.25}).to(C[f],{r:d*12,duration:.15}).to(C[f],{r:0,duration:.4});
    gsap.delayedCall(.4,()=>throwDrops(f,t));
    gsap.delayedCall(.95,()=>{ face(t,'squeeze','o'); gsap.fromTo(C[t],{sx:1.15,sy:.88},{sx:1,sy:1,duration:.6,ease:'elastic.out(1,.3)'}); });
    gsap.delayedCall(1.8,()=>{ face(t,'happy','open'); look(t,dirTo(t)*6); throwDrops(t,f); gsap.timeline().to(C[t],{r:-dirTo(t)*10,duration:.2}).to(C[t],{r:dirTo(t)*12,duration:.15}).to(C[t],{r:0,duration:.4}); });
    gsap.delayedCall(2.35,()=>{ face(f,'squeeze','open'); gsap.fromTo(C[f],{sx:1.12,sy:.9},{sx:1,sy:1,duration:.6,ease:'elastic.out(1,.3)'}); });
    gsap.delayedCall(3.3,()=>K.forEach(k=>{ look(k,0); rest(k); }));
  },
  /* one blows a bubble, the other heads it */
  bubble(f){ const t=other(f), d=dirTo(f); hold(f,4200); hold(t,4200);
    face(f,'open','o'); look(f,d*6);
    const b=el('circle',{cx:C[f].x+d*24,cy:256,r:2,fill:'#fff','fill-opacity':.35,stroke:'#7DBCEB','stroke-width':2.5},$('#fx'));
    gsap.to(b,{attr:{r:22},duration:.9,ease:'power1.out'}); gsap.to(C[f],{sy:.9,sx:1.08,duration:.9});
    gsap.delayedCall(.9,()=>{ gsap.to(C[f],{sy:1,sx:1,duration:.4}); face(f,'happy','smile');
      gsap.to(b,{attr:{cx:C[t].x,cy:118},duration:1.4,ease:'sine.inOut'}); look(t,dirTo(t)*6,-6); face(t,'open','o'); });
    gsap.delayedCall(2.15,()=>hop(t,40,.42));
    gsap.delayedCall(2.4,()=>{ b.remove(); for(let i=0;i<8;i++){ const a=i/8*Math.PI*2, p=el('circle',{cx:C[t].x,cy:118,r:3.5,fill:'#7DBCEB'},$('#fx')); gsap.to(p,{attr:{cx:C[t].x+Math.cos(a)*36,cy:118+Math.sin(a)*36,r:0},duration:.45,onComplete:()=>p.remove()}); }
      face(t,'happy','open'); face(f,'happy','open'); hop(f,20,.3); });
    gsap.delayedCall(3.8,()=>K.forEach(k=>{ look(k,0); rest(k); }));
  },
  /* one melts into a puddle, slides over and pops up: boo */
  hide(f){ const t=other(f); hold(f,4600); hold(t,4600);
    face(f,'happy','smile');
    gsap.to(C[f],{sy:.12,sx:1.7,fo:0,duration:.45,ease:'power2.in'});
    gsap.delayedCall(.6,()=>{ face(t,'open','o'); look(t,-6); });
    gsap.delayedCall(1.2,()=>look(t,6)); gsap.delayedCall(1.8,()=>{ look(t,0,-4); face(t,'open','wavy'); });
    gsap.delayedCall(2.3,()=>gsap.to(C[f],{x:homeX[f]+dirTo(f)*72,duration:.6,ease:'power1.inOut'}));
    gsap.delayedCall(3.0,()=>{ face(f,'open','open'); gsap.to(C[f],{sy:1.2,sx:.9,fo:1,duration:.25,ease:'back.out(3)'}); gsap.to(C[f],{sy:1,sx:1,duration:.5,delay:.25,ease:'elastic.out(1,.4)'});
      face(t,'squeeze','o'); hop(t,56,.45); gsap.to(C[t],{ox:-dirTo(t)*24,duration:.3}); });
    gsap.delayedCall(3.7,()=>{ face(f,'happy','open'); gsap.to(C[f],{x:homeX[f],duration:.8,ease:'power2.inOut'}); gsap.to(C[t],{ox:0,duration:.6}); face(t,'side','pout'); });
    gsap.delayedCall(4.5,()=>K.forEach(k=>{ look(k,0); rest(k); }));
  },
  /* jealousy: pushes the favourite aside and asks for attention itself */
  shove(f,t){ const d=dirTo(f); hold(f,3600); hold(t,3600);
    face(f,'side','pout'); look(f,d*7); gsap.to(E[f].cheeks,{scale:1.3,transformOrigin:'0 -45',duration:.2});
    gsap.to(C[f],{x:homeX[f]+d*40,duration:.35,ease:'power2.in'});
    hand(f, d<0?1:2, [d*82,-60,.15],.2,.3,.25);
    gsap.delayedCall(.5,()=>{ face(t,'squeeze','o'); gsap.to(C[t],{ox:d*46,r:d*12,duration:.25,ease:'power2.out'}); gsap.to(C[t],{ox:0,r:0,duration:1,delay:1.4,ease:'elastic.out(1,.5)'}); });
    gsap.delayedCall(.9,()=>{ gsap.to(E[f].cheeks,{scale:1,duration:.2}); look(f,0,-3); face(f,'open','open'); hop(f,40,.4); gsap.delayedCall(.55,()=>hop(f,30,.36)); });
    gsap.delayedCall(1.6,()=>{ face(t,'side','pout'); look(t,d*7); });
    gsap.delayedCall(2.6,()=>gsap.to(C[f],{x:homeX[f],duration:.6}));
    gsap.delayedCall(3.5,()=>K.forEach(k=>{ look(k,0); rest(k); }));
  }
});
function throwDrops(f,t){ const x0=C[f].x+dirTo(f)*40, x1=C[t].x, col=f==='a'?'#4AA6F2':'#F7806A';
  for(let i=0;i<7;i++){ const c=el('circle',{cx:x0,cy:230,r:rnd(4,7),fill:col},$('#spl')); const tx=x1+rnd(-30,30), ty=rnd(170,240), dl=i*.03;
    gsap.to(c,{attr:{cx:tx},duration:.5,ease:'none',delay:dl}); gsap.to(c,{attr:{cy:150},duration:.25,ease:'power1.out',delay:dl}); gsap.to(c,{attr:{cy:ty},duration:.25,ease:'power1.in',delay:.25+dl});
    gsap.to(c,{attr:{r:0},duration:.3,delay:.55+dl,onComplete:()=>c.remove()}); } }

/* ---------- every logged detail has its own move, and the twin reacts ---------- */
function milkArc(k,s,color){ const x1=C[k].x, d=el('path',{d:'M0 -12 C0 -12 -8 -2 -8 3 A8 8 0 0 0 8 3 C8 -2 0 -12 0 -12 Z',fill:color||'#FFFDF8',stroke:'#E9DCCB','stroke-width':1.5},$('#fx'));
  const o={x:x1+s*130,y:120}; const up=()=>d.setAttribute('transform',`translate(${o.x} ${o.y})`); up();
  gsap.to(o,{x:x1+s*8,duration:.6,ease:'none',onUpdate:up}); gsap.to(o,{y:86,duration:.25,ease:'power1.out'}); gsap.to(o,{y:258,duration:.35,delay:.25,ease:'power2.in',onComplete:()=>d.remove()}); }
function burpBubble(k){ const x=C[k].x, b=el('circle',{cx:x,cy:256,r:6,fill:'#fff','fill-opacity':.5,stroke:'#7DBCEB','stroke-width':2.5},$('#fx'));
  gsap.to(b,{attr:{r:22,cy:140},duration:1,ease:'power1.out'}); gsap.to(b,{attr:{r:32},opacity:0,duration:.25,delay:1,onComplete:()=>b.remove()}); }
function spitDrops(k){ const x=C[k].x; for(let i=0;i<7;i++){ const c=el('circle',{cx:x,cy:262,r:rnd(3,6),fill:'#FFFDF5',stroke:'#E2D3BE','stroke-width':1.2},$('#fx')); const dx=rnd(-56,56);
  gsap.to(c,{attr:{cx:x+dx},duration:.6,ease:'none'}); gsap.to(c,{attr:{cy:226},duration:.2,ease:'power1.out'}); gsap.to(c,{attr:{cy:300},duration:.4,delay:.2,ease:'power2.in',onComplete:()=>c.remove()}); } }
function stink(k){ for(let i=0;i<3;i++){ const x=C[k].x-30+i*30; const p=el('path',{d:`M${x} 236 q-8 -12 0 -24 q8 -12 0 -24 q-8 -12 0 -24`,fill:'none',stroke:'#8BAA4A','stroke-width':4,'stroke-linecap':'round',opacity:0},$('#fx'));
  gsap.fromTo(p,{opacity:0,y:0},{opacity:.9,y:-40,duration:.8,delay:i*.15}); gsap.to(p,{opacity:0,y:-80,duration:.7,delay:.9+i*.15,onComplete:()=>p.remove()}); } }
function sparkle(k){ for(let i=0;i<6;i++){ const a=rnd(0,Math.PI*2), r=rnd(64,92), x=C[k].x+Math.cos(a)*r, y=200+Math.sin(a)*r*.8;
  const s=el('path',{d:`M${x} ${y-9} L${x+2.5} ${y-2.5} L${x+9} ${y} L${x+2.5} ${y+2.5} L${x} ${y+9} L${x-2.5} ${y+2.5} L${x-9} ${y} L${x-2.5} ${y-2.5}Z`,fill:'#FFC93C',opacity:0},$('#fx'));
  gsap.to(s,{opacity:1,duration:.25,delay:i*.08,yoyo:true,repeat:1,repeatDelay:.3,onComplete:()=>s.remove()}); } }
function react(o,kind){
  if(S[o].sleep){ if(kind!=='look') gsap.delayedCall(.6,()=>zzz(o)); return; }
  if(isBusy(o) || S[o].nurse && kind!=='envy') return;
  const d=dirTo(o);
  gsap.delayedCall(.35,()=>{
    if(kind==='lick'){ hold(o,1800); look(o,d*7); face(o,'open','tongue'); gsap.delayedCall(1.6,()=>{ look(o,0); rest(o); }); }
    if(kind==='envy'){ hold(o,1900); look(o,d*7); face(o,'open','pout'); gsap.to(E[o].cheeks,{scale:1.3,transformOrigin:'0 -45',duration:.2}); gsap.delayedCall(1.7,()=>{ gsap.to(E[o].cheeks,{scale:1,duration:.3}); look(o,0); rest(o); }); }
    if(kind==='laugh'){ hold(o,1500); look(o,d*6); face(o,'happy','open'); hop(o,22,.3); gsap.delayedCall(.38,()=>hop(o,16,.28)); gsap.delayedCall(1.4,()=>{ look(o,0); rest(o); }); }
    if(kind==='recoil'){ hold(o,1600); face(o,'squeeze','wavy'); gsap.to(C[o],{ox:-d*28,duration:.25,ease:'power2.out'}); gsap.to(C[o],{ox:0,duration:.7,delay:1,ease:'elastic.out(1,.5)'}); gsap.delayedCall(1.5,()=>rest(o)); }
    if(kind==='nose'){ hold(o,2200); face(o,'squeeze','wavy'); hand(o,1,[-10,-50,1.2],.2,.3); gsap.to(C[o],{ox:-d*22,r:-d*8,duration:.3}); gsap.to(C[o],{ox:0,r:0,duration:.6,delay:1.6}); gsap.delayedCall(2.1,()=>rest(o)); }
    if(kind==='giggle'){ hold(o,1200); look(o,d*6); face(o,'happy','open'); gsap.to(C[o],{r:4,duration:.08,yoyo:true,repeat:5}); gsap.delayedCall(1.1,()=>{ look(o,0); rest(o); }); }
    if(kind==='look'){ hold(o,900); look(o,d*6); gsap.delayedCall(.9,()=>look(o,0)); }
    if(kind==='greet'){ hold(o,1800); face(o,'happy','open'); gsap.to(C[o],{ox:d*32,duration:.4,ease:'power2.out'}); hop(o,24,.32); gsap.delayedCall(.4,()=>heart(200,150,.9)); gsap.to(C[o],{ox:0,duration:.6,delay:1.1}); gsap.delayedCall(1.7,()=>rest(o)); }
    if(kind==='yawn'){ hold(o,2300); look(o,d*6); gsap.delayedCall(.5,()=>face(o,'closed','open')); gsap.delayedCall(1.4,()=>{ face(o,'open','smile'); hand(o, d<0?1:2,[d*14,-44,.6],.25,.3); }); gsap.delayedCall(2.2,()=>{ look(o,0); rest(o); }); }
  });
}
const FX={
  side(k,side){ const s=side==='R'?1:-1; hold(k,2300); look(k,s*7,-2); face(k,'happy','o');
    gsap.timeline().to(C[k],{r:s*12,duration:.35,ease:'power2.out'}).to(C[k],{r:0,duration:.8,delay:1,ease:'elastic.out(1,.4)'});
    for(let i=0;i<3;i++) gsap.delayedCall(i*.28,()=>milkArc(k,s));
    gsap.delayedCall(1.9,()=>{ look(k,0); rest(k); }); react(other(k),'lick'); },
  bottle(k,ml,formula){ const n=Math.max(1,Math.round(ml/40)); hold(k,.3*n*1000+2600); face(k,'happy','o');
    for(let i=0;i<n;i++) gsap.delayedCall(i*.24,()=>milk(k,null,formula?'#FFF0C2':'#FFFDF8'));
    gsap.to(C[k],{sz:1+Math.min(ml,240)/600,duration:.24*n+.5,ease:'power1.out'});
    gsap.delayedCall(.24*n+1.2,()=>{ face(k,'happy','smile'); gsap.to(C[k],{sz:1,duration:1.2,ease:'elastic.out(1,.4)'}); });
    gsap.delayedCall(.24*n+2.2,()=>rest(k)); react(other(k),'envy'); },
  burp(k){ hold(k,1800); face(k,'squeeze','o'); gsap.to(C[k],{sz:1.14,duration:.35,ease:'power1.in'});
    gsap.delayedCall(.4,()=>{ gsap.to(C[k],{sz:1,duration:.6,ease:'elastic.out(1,.3)'}); face(k,'happy','open'); burpBubble(k); });
    gsap.delayedCall(1.6,()=>rest(k)); react(other(k),'laugh'); },
  spit(k){ hold(k,1800); face(k,'squeeze','wavy'); gsap.timeline().to(C[k],{sy:.86,sx:1.1,duration:.15}).to(C[k],{sy:1,sx:1,duration:.5,ease:'elastic.out(1,.35)'});
    spitDrops(k); gsap.delayedCall(1.4,()=>rest(k)); react(other(k),'recoil'); },
  wet(k){ splash(k,.8); puddle(k); react(other(k),'giggle'); },
  dirty(k){ stink(k); hold(k,1500); face(k,'happy','smile'); gsap.to(C[k],{r:6,duration:.1,yoyo:true,repeat:5}); gsap.delayedCall(1.4,()=>rest(k)); react(other(k),'nose'); },
  dry(k){ sparkle(k); hold(k,1100); face(k,'happy','smile'); hop(k,18,.3); gsap.delayedCall(1,()=>rest(k)); react(other(k),'look'); },
  color(k,c){ const p=el('ellipse',{cx:C[k].x,cy:302,rx:20,ry:6,fill:c,opacity:.9},$('#spl')); gsap.to(p,{attr:{rx:74,ry:10},duration:.5}); gsap.to(p,{opacity:0,duration:.8,delay:1,onComplete:()=>p.remove()}); },
  amount(k,i){ splash(k,[.45,.85,1.4][i]); if(i===2){ puddle(k); react(other(k),'recoil'); } },
  sleepLoc(k,loc){ S[k].loc=loc; setProp(k); react(other(k),'yawn'); },
  swap(k){ const s=S[k].nurse?.side==='L'?-1:1; hold(k,1200); face(k,'open','o');
    gsap.timeline().to(C[k],{r:-s*14,duration:.25}).to(C[k],{r:s*10,duration:.25}).to(C[k],{r:0,duration:.6,ease:'elastic.out(1,.4)'}); gsap.delayedCall(1.1,()=>rest(k)); },
  full(k){ hold(k,2600); face(k,'happy','smile'); gsap.to(C[k],{sz:1.1,sx:1.08,duration:.5}); gsap.delayedCall(.7,()=>face(k,'closed','smile'));
    gsap.delayedCall(2.1,()=>{ gsap.to(C[k],{sz:1,sx:1,duration:.8}); rest(k); }); react(other(k),'envy'); },
  cancel(k){ hold(k,1300); face(k,'open','flat'); hand(k,1,[-66,-98,.4],.2,.25); hand(k,2,[66,-98,.4],.2,.25); gsap.delayedCall(1.2,()=>rest(k)); react(other(k),'laugh'); }
};

/* ---------- touching the drops ---------- */
const taps={a:[],b:[]}; let wantsLove=null;
function tapDrop(k){
  const now=Date.now(), o=other(k);
  if(S[k].sleep){ hold(k,800); gsap.fromTo(C[k],{sx:1.25},{sx:1.13,duration:.6,ease:'elastic.out(1,.3)'}); zzz(k);
    if(!S[o].sleep&&!isBusy(o)){ hold(o,1000); face(o,'open','o'); look(o,dirTo(o)*6); hand(o, dirTo(o)<0?1:2,[dirTo(o)*14,-44,.5],.2,.3); gsap.delayedCall(1,()=>{ look(o,0); rest(o); }); }
    return; }
  taps[k]=taps[k].filter(t=>now-t<8000); taps[k].push(now); taps[o]=[];
  if(wantsLove===k){ wantsLove=null; hold(k,2000); face(k,'happy','open'); hop(k,36,.38); heart(C[k].x,110,1);
    gsap.delayedCall(.6,()=>{ if(!S[o].sleep){ look(k,dirTo(k)*7); face(k,'happy','tongue'); hold(o,1500); face(o,'side','pout'); look(o,-dirTo(o)*6); gsap.delayedCall(1.4,()=>{ look(o,0); rest(o); }); } });
    gsap.delayedCall(2,()=>{ look(k,0); rest(k); }); return; }
  const n=taps[k].length;
  hold(k,1200); face(k,'happy','open'); hop(k,26+Math.min(n,4)*5,.36); gsap.to(C[k],{r:6,duration:.08,yoyo:true,repeat:5});
  if(n>=2) heart(C[k].x+rnd(-20,20),100,.6+n*.08);
  gsap.delayedCall(1.2,()=>rest(k));
  if(S[o].sleep||isBusy(o)||hungry(o)||S[o].nurse) return;
  if(n<=2){ hold(o,1000); look(o,dirTo(o)*6); face(o,'open','smile'); gsap.delayedCall(1,()=>{ look(o,0); rest(o); }); }
  else if(n<=4){ hold(o,1500); look(o,dirTo(o)*7); face(o,'side','pout'); gsap.to(E[o].cheeks,{scale:1.2+(n-3)*.15,transformOrigin:'0 -45',duration:.2}); gsap.to(C[o],{ox:dirTo(o)*12*(n-2),duration:.4});
    gsap.delayedCall(1.5,()=>{ gsap.to(E[o].cheeks,{scale:1,duration:.3}); gsap.to(C[o],{ox:0,duration:.5}); look(o,0); rest(o); }); }
  else { taps[k]=[]; gsap.delayedCall(.35,()=>{ BEH.shove(o,k); wantsLove=o; setTimeout(()=>{ if(wantsLove===o) wantsLove=null; },8000); }); }
}
const stg=$('#stg'); let drag=null;
const toSvg=e=>{ const p=stg.createSVGPoint(); p.x=e.clientX; p.y=e.clientY; return p.matrixTransform(stg.getScreenCTM().inverse()); };
const hitDrop=q=>K.find(k=>Math.abs(q.x-(C[k].x+C[k].ox))<64 && q.y>120 && q.y<312);
stg.addEventListener('pointerdown',e=>{ const q=toSvg(e), k=hitDrop(q); if(!k) return; drag={k,x0:q.x,y0:q.y,moved:false}; try{ stg.setPointerCapture(e.pointerId); }catch(_){} });
stg.addEventListener('pointermove',e=>{ if(!drag) return; const k=drag.k; if(S[k].sleep) return; const q=toSvg(e), dx=q.x-drag.x0, dy=q.y-drag.y0;
  if(!drag.moved && Math.hypot(dx,dy)>10){ drag.moved=true; hold(k,60000); face(k,'squeeze','open'); gsap.killTweensOf(C[k],'r,sx,sy,ox');
    const o=other(k); if(!S[o].sleep&&!isBusy(o)){ hold(o,1200); face(o,'open','o'); look(o,dirTo(o)*6); } }
  if(drag.moved){ const c=C[k]; c.ox=Math.max(-60,Math.min(60,dx*.45)); c.r=Math.max(-28,Math.min(28,dx*.3)); c.sy=Math.max(.7,Math.min(1.45,1-dy/200)); c.sx=1/Math.sqrt(c.sy); } });
const endDrag=()=>{ if(!drag) return; const {k,moved}=drag; drag=null;
  if(!moved){ if(!isBusy(k)||S[k].sleep) tapDrop(k); return; }
  busy[k]=0; hold(k,1400); face(k,'happy','open');
  gsap.to(C[k],{ox:0,r:0,sx:1,sy:1,duration:1.1,ease:'elastic.out(1.2,.3)'});
  const o=other(k); if(!S[o].sleep){ busy[o]=0; hold(o,1200); face(o,'happy','open'); hop(o,20,.3); gsap.delayedCall(1.1,()=>{ look(o,0); rest(o); }); }
  gsap.delayedCall(1.3,()=>rest(k)); };
stg.addEventListener('pointerup',endDrag); stg.addEventListener('pointercancel',endDrag);

/* ---------- start ---------- */
K.forEach(k=>{ posture(k,true); setBreath(k); blinkLoop(k); rest(k); });
renderCtl(); showScore(); gsap.delayedCall(2.5,idle);
gsap.from([C.a,C.b],{jy:-180,duration:.9,ease:'bounce.out',stagger:.18});

/* the app pushes the real records in here */
let prev={a:{},b:{}};
syncFn=st=>{
  canWrite=st.canWrite!==false; alerts=st.alerts||[]; if(st.league) league=st.league;
  if(st.tally){ const changed=JSON.stringify(st.tally)!==JSON.stringify(tally); tally=st.tally; if(changed && !sheetOpen) showScore(); }
  for(const k of K){ const n=st[k]; if(!n) continue; const s=S[k], p=prev[k];
    Object.assign(s,{name:n.name, girl:n.girl, feed:n.feed, next:n.next, wake:n.wake, diaper:n.diaper, lastMl:n.lastMl});
    const sleepChanged=(!!n.sleep)!==(!!p.sleep), locChanged=n.loc!==p.loc, nurseChanged=(!!n.nurse)!==(!!p.nurse);
    s.sleep=n.sleep; s.loc=n.loc; s.nurse=n.nurse;
    if(sleepChanged||locChanged){ E[k].loc=undefined; posture(k,!p.init); setBreath(k); }
    if(sleepChanged||nurseChanged) { if(!isBusy(k)) rest(k); }
    prev[k]={sleep:n.sleep, loc:n.loc, nurse:n.nurse, init:true};
    cryLoop(k); leakLoop(k);
  }
  if(!sheetOpen) renderCtl(); renderAlerts();
  // the faces names on the stage
};

}
return {mount, sync};
})();
