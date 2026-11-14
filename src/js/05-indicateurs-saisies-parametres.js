/* ---------- calculs ---------- */
const H=a=>a.reduce((s,e)=>s+(e.dur||0),0)/60;
function stats(list){const c=t=>list.filter(e=>t.includes(e.type)),P=c(['proposition']),A=P.filter(e=>e.statut=='acceptee');return{
 h:H(c(COACH)),conv:c(['conversation']).length,convH:H(c(['conversation'])),
 coach:new Set(c(COACH).filter(e=>e.pid!=null).map(e=>e.pid)).size,
 delib:H(c(DELIB)),prop:P.reduce((s,e)=>s+(+e.eur||0),0),
 nprop:P.filter(e=>+e.eur>0).length,nacc:A.filter(e=>+e.eur>0).length,   // une proposition = un montant proposé (> 0 €)
 ca:A.reduce((s,e)=>s+(+e.eur||0),0),inv:c(['invitation']).length,sup:c(['supervision']).reduce((s,e)=>s+supCost(e),0),mois:A.reduce((s,e)=>s+(+e.engagement_mois||0),0)}}
const range=(a,b)=>E().filter(e=>e.date>=a&&e.date<=b);
const yearData=y=>E().filter(e=>e.date.startsWith(y));
const years=()=>{const s=new Set(E().map(e=>e.date.slice(0,4)));s.add(today().slice(0,4));return[...s].sort()};

function toast(m,label,fn){const t=$('toast');t.innerHTML=`<span>${esc(m)}</span>${label?`<button>${label}</button>`:''}`;if(label)t.querySelector('button').onclick=()=>{fn();t.classList.remove('show')};
  t.classList.add('show');clearTimeout(toast.t);toast.t=setTimeout(()=>t.classList.remove('show'),label?5000:2200)}

/* ---------- KPI ---------- */
function spark(vals){if(vals.length<2)vals=[0,...vals];const mx=Math.max(...vals,1);return `<svg width="96" height="34"><polyline fill="none" stroke="rgba(255,255,255,.55)" stroke-width="2" stroke-linejoin="round" points="${vals.map((v,i)=>`${i*(96/(vals.length-1))},${32-v/mx*28}`).join(' ')}"/></svg>`}
function kpiBg(i){const K=CFG().couleurs,base=mix(K.fonce,K.bleu,[0,.12,.24][i]),end=mix(base,K.bleu,.32);
  return `linear-gradient(150deg,${base} 0%,${base} 38%,${end} 100%)`}
/* =========================================================
   CATALOGUE D'INDICATEURS
   Chaque indicateur : pilier, libellé, fenêtre de calcul, valeur, détail, courbe (facultative), utilité.
   ========================================================= */
const num=v=>(Math.round(v||0)||0).toLocaleString(LOC);
const pl=(n,w)=>`${n} ${w}${n>1?'s':''}`;
const pct=v=>v==null||isNaN(v)?'—':Math.round(v*100);
const PILLARS=[{k:1,l:'Coacher beaucoup',c:'var(--jet)'},{k:2,l:'Pratiquer délibérément',c:'var(--am)'},{k:3,l:'Développer ton activité',c:'var(--afb)'},{k:4,l:'Piloter',c:'var(--grey)'}];
const winTxt={an:D=>D.Y,j31:()=>'31 j',j90:()=>'90 j',s12:()=>'12 sem.',m12:()=>'12 mois',now:()=>'en cours',tri:D=>'T'+D.Q};
function kctx(){const t=today(),Y=t.slice(0,4),cm=+t.slice(5,7),c={Y,cm,Q:Math.floor((cm-1)/3)+1,t,
  s:stats(yearData(Y)),r:stats(range(addDays(t,-30),t)),win:(a,b)=>range(addDays(t,-a),addDays(t,-b))};
  c.monthly=f=>Array.from({length:cm},(_,i)=>f(yearData(Y+'-'+pad(i+1))));return c}
const pids=(L,types)=>new Set(L.filter(e=>types.includes(e.type)&&e.pid!=null).map(e=>e.pid));
function firstCoach(){const m={};E().forEach(e=>{if(COACH.includes(e.type)&&e.pid!=null&&(!m[e.pid]||e.date<m[e.pid]))m[e.pid]=e.date});return m}
function weeksActive(D){const d=new Date(D.t+'T12:00:00Z'),mon=addDays(D.t,-((d.getUTCDay()+6)%7));
  return Array.from({length:12},(_,i)=>{const a=addDays(mon,-7*(11-i)),b=addDays(a,6);return E().some(e=>COACH.includes(e.type)&&e.date>=a&&e.date<=b)?1:0})}
function discipline(L){const f=L.filter(e=>TM[e.type]?.cr),a=L.filter(e=>xpBudget(e)>0),r=[];
  const cr=f.length?f.filter(e=>e.cr).length/f.length:null,sy=f.length?f.filter(e=>e.syn).length/f.length:null,no=a.length?a.filter(e=>xpLeft(e)<=0).length/a.length:null;
  [cr,sy,no].forEach(v=>{if(v!=null)r.push(v)});return{g:r.length?r.reduce((x,y)=>x+y,0)/r.length:null,cr,sy,no,n:f.length}}
function aisAvg(L,id){const v=[];L.forEach(e=>{if(!e.ais)return;Object.entries(e.ais).forEach(([k,x])=>{if(x&&(!id||k==id))v.push(x)})});return v.length?v.reduce((a,b)=>a+b,0)/v.length:null}
/* 3.0.0 : XP gagnés (budget de pratique + Facultés commerciales) sur une liste de saisies */
const xpWin=L=>L.reduce((s,e)=>s+xpEarned(e),0);
const delta=(a,b)=>a==null||b==null?'':` · ${a-b>=0?'+':''}${n1(a-b)} vs 90 j précédents`;
const KPIDEF={
 h:{p:1,l:'Heures de coaching',w:'an',u:'Le volume qui muscle ta pratique.',v:D=>[n1(D.s.h),'h'],d:D=>`31 derniers jours : <b>${n1(D.r.h)} h</b>`,sp:D=>D.monthly(L=>stats(L).h)},
 conv:{p:1,l:'Conversations',w:'an',u:'Ton élan pour faire découvrir le coaching.',v:D=>[D.s.conv,''],d:D=>`31 derniers jours : <b>${D.r.conv}</b> · ${n1(D.r.convH)} h`,sp:D=>D.monthly(L=>stats(L).conv)},
 coach:{p:1,l:'Personnes coachées',w:'an',u:'La diversité de ta pratique.',v:D=>[D.s.coach,''],d:D=>`31 derniers jours : <b>${D.r.coach}</b>`,sp:D=>D.monthly(L=>stats(L).coach)},
 reg:{p:1,l:'Régularité',w:'s12',u:'Coacher chaque semaine compte autant que le volume.',v:D=>{const w=weeksActive(D);return[w.reduce((a,b)=>a+b,0),'/ 12 sem.']},
   d:D=>{const w=weeksActive(D);return `semaines avec au moins une séance · 4 dernières : <b>${w.slice(-4).reduce((a,b)=>a+b,0)}/4</b>`},bars:D=>weeksActive(D)},
 newp:{p:1,l:'Nouvelles personnes',w:'an',u:'Ton activité se renouvelle-t-elle ?',v:D=>{const f=firstCoach();return[Object.values(f).filter(d=>d.startsWith(D.Y)).length,'']},
   d:D=>{const f=firstCoach(),a=addDays(D.t,-30);return `31 derniers jours : <b>${Object.values(f).filter(d=>d>=a&&d<=D.t).length}</b>`},sp:D=>{const f=Object.values(firstCoach());return Array.from({length:D.cm},(_,i)=>f.filter(d=>d.startsWith(D.Y+'-'+pad(i+1))).length)}},
 active:{p:1,l:'Clients actifs',w:'j31',u:'Les accompagnements réellement en cours.',v:D=>[pids(range(addDays(D.t,-30),D.t),['session']).size,''],
   d:D=>`avec une session ces 31 jours · <b>${pids(range(addDays(D.t,-30),D.t),['conversation']).size}</b> en conversation`},
 delib:{p:2,l:'Pratique délibérée',w:'an',u:'Débriefs et supervision : ce qui transforme l\'expérience en compétence.',v:D=>[n1(D.s.delib),'h'],d:D=>`31 derniers jours : <b>${n1(D.r.delib)} h</b> · ${D.s.h?n1(D.s.delib/D.s.h):'—'} h par h de coaching`,sp:D=>D.monthly(L=>stats(L).delib)},
 disc:{p:2,l:'Discipline post-séance',w:'j90',u:'CR, synthèse et XP répartis après les entretiens.',v:D=>{const x=discipline(D.win(89,0));return[pct(x.g),x.g==null?'':'%']},
   d:D=>{const x=discipline(D.win(89,0));return x.n?`CR <b>${pct(x.cr)} %</b> · synthèse <b>${pct(x.sy)} %</b> · XP répartis <b>${pct(x.no)} %</b>`:'aucun entretien sur 90 jours'}},
 aism:{p:2,l:'XP de pratique',w:'j90',u:'Les XP gagnés en coachant et en pratiquant : le temps investi dans tes compétences.',v:D=>[num(xpWin(D.win(89,0))),'XP'],
   d:D=>{const a=xpWin(D.win(89,0)),b=xpWin(D.win(179,90));return `XP gagnés en 90 jours · <b>${a-b>=0?'+':''}${num(a-b)}</b> vs 90 j précédents`},sp:D=>D.monthly(xpWin)},
 inv:{p:3,l:'Invitations',w:'an',u:'Proposer une conversation de coaching : le geste qui nourrit tout le reste.',v:D=>[D.s.inv,''],d:D=>`31 derniers jours : <b>${D.r.inv}</b>`,sp:D=>D.monthly(L=>stats(L).inv)},
 caprop:{p:3,l:'CA accepté / proposé',w:'an',u:'Ce que tu signes, face à ce que tu proposes.',v:D=>[num(D.s.ca),`€ <span class="of">/ ${num(D.s.prop)} € proposés</span>`],
   d:D=>`${D.s.nacc} acceptée${D.s.nacc>1?'s':''} sur ${pl(D.s.nprop,'proposition')} · 31 derniers jours : <b>${eur(D.r.ca)}</b> signés`,sp:D=>D.monthly(L=>stats(L).ca)},
 transfo:{p:3,l:'Taux de transformation',w:'m12',u:'Part des personnes en conversation qui signent un contrat payant.',
   v:D=>{const P=pids(D.win(364,0),['conversation']),S=new Set(E().filter(e=>e.type=='proposition'&&e.statut=='acceptee'&&+e.eur>0).map(e=>e.pid)),n=[...P].filter(p=>S.has(p)).length;return[P.size?pct(n/P.size):'—',P.size?'%':'']},
   d:D=>{const P=pids(D.win(364,0),['conversation']),S=new Set(E().filter(e=>e.type=='proposition'&&e.statut=='acceptee'&&+e.eur>0).map(e=>e.pid));return `<b>${[...P].filter(p=>S.has(p)).length}</b> sur ${pl(P.size,'personne')} en conversation`}},
 pending:{p:3,l:'Propositions en attente',w:'now',u:'Ton portefeuille d\'affaires en cours.',v:()=>[num(E().filter(e=>e.type=='proposition'&&e.statut=='attente').reduce((s,e)=>s+(+e.eur||0),0)),'€'],
   d:()=>`${pl(E().filter(e=>e.type=='proposition'&&e.statut=='attente'&&+e.eur>0).length,'proposition')} en attente de réponse`},
 accept:{p:3,l:'Taux d\'acceptation',w:'an',u:'Tes propositions convainquent-elles ?',v:D=>{const P=yearData(D.Y).filter(e=>e.type=='proposition'&&+e.eur>0),a=P.filter(e=>e.statut=='acceptee').length,r=P.filter(e=>e.statut=='refusee').length;return[a+r?pct(a/(a+r)):'—',a+r?'%':'']},
   d:D=>{const P=yearData(D.Y).filter(e=>e.type=='proposition'&&+e.eur>0);return `<b>${P.filter(e=>e.statut=='acceptee').length}</b> acceptée(s) · ${P.filter(e=>e.statut=='refusee').length} refusée(s) · ${P.filter(e=>e.statut=='attente').length} en attente`}},
 basket:{p:3,l:'Panier moyen',w:'an',u:'La valeur moyenne d\'un contrat signé.',v:D=>[D.s.nacc?num(D.s.ca/D.s.nacc):'—',D.s.nacc?'€':''],
   d:D=>{const A=yearData(D.Y).filter(e=>e.type=='proposition'&&e.statut=='acceptee'&&+e.eur>0);return A.length?`par contrat · engagement moyen <b>${n1(A.reduce((s,e)=>s+(+e.engagement_mois||0),0)/A.length)} mois</b>`:'aucun contrat signé cette année'}},
 rate:{p:3,l:'Taux horaire réel',w:'an',u:'Ce que vaut vraiment ton heure : CA moins tes charges (supervisions comprises), rapporté à toutes tes heures.',
   v:D=>{const h=H(yearData(D.Y)),C=chargesYTD(D),net=D.s.ca-C.sup-C.urs-(D.s.nacc?C.lines:0);return[h&&D.s.ca?num(net/h):'—',h&&D.s.ca?'€/h':'']},
   d:D=>{const C=chargesYTD(D),h=H(yearData(D.Y));if(!D.s.nacc)return `aucun contrat payant signé en ${D.Y}`;
    return `(${eur(D.s.ca)} CA − ${eur(C.v)} charges, dont ${eur(C.sup)} de supervision${C.urs?` et ${eur(C.urs)} d'URSSAF`:''}${C.pr?` · autres charges à ${C.pr} % de l'année`:''} ; soit ${eur(C.v/D.s.nacc)} par contrat payant) ÷ <b>${n1(h)} h</b>`}},
 late:{p:4,l:'Actions en retard',w:'now',u:'Ce qui glisse dans ton plan d\'action.',v:D=>[DB.actions.filter(a=>a.s=='encours'&&a.d&&a.d<D.t).length,''],
   d:()=>`${pl(DB.actions.filter(a=>a.s=='encours').length,'action')} en cours · ${DB.actions.filter(a=>a.s=='realisee').length} réalisée(s)`},
 target:{p:4,l:'Cibles du trimestre',w:'tri',u:'Où tu en es de tes objectifs chiffrés.',
   v:D=>{const x=targetProgress(D);return[x.length?pct(x.reduce((a,b)=>a+b.p,0)/x.length):'—',x.length?'%':'']},
   d:D=>{const x=targetProgress(D);return x.length?x.slice(0,3).map(t=>`${t.l} <b>${pct(t.p)} %</b>`).join(' · '):'aucune cible définie pour ce trimestre'}},
 /* 2.4.0 : entretien du réseau */
 rnet:{p:3,l:'Réseau entretenu',w:'now',u:'Les personnes que tu veux voir régulièrement : les vois-tu à leur rythme ?',v:()=>{const x=rnetStat();return[x.n?x.ok:'—',x.n?`/ ${x.n}`:'']},
   d:()=>{const x=rnetStat();return x.n?`personnes avec un rythme, contactées dans leur rythme · <b>${x.n-x.ok}</b> à relancer`:'aucune personne avec un rythme et un premier échange'}},
 pvues:{p:3,l:'Personnes vues',w:'j90',u:'Combien de personnes différentes tu as vues ces 90 derniers jours.',v:D=>[pvN(D.win(89,0)),''],
   d:D=>{const a=pvN(D.win(89,0)),b=pvN(D.win(179,90));return `personnes distinctes en 90 jours · <b>${a-b>=0?'+':''}${a-b}</b> vs 90 j précédents`},sp:D=>D.monthly(pvN)},
 recos:{p:3,l:'Recommandations',w:'an',u:'Les personnes qui te sont recommandées ou présentées : ton réseau travaille pour toi.',v:D=>[recoOf(D.Y).length,''],
   d:D=>{const L=recoOf(D.Y),S=signedPids();return `recommandé·es ou présenté·es · <b>${L.filter(p=>S.has(String(p.id))).length}</b> devenu·es client·es`}},
 share:{p:4,l:'Part du coaching',w:'an',u:'La place du coaching dans tout ton temps.',v:D=>{const h=H(yearData(D.Y));return[h?pct(D.s.h/h):'—',h?'%':'']},
   d:D=>{const h=H(yearData(D.Y));return h?`pratique délibérée <b>${pct(D.s.delib/h)} %</b> · annexe ${pct(H(yearData(D.Y).filter(e=>e.type=='annexe'))/h)} %`:'aucune saisie cette année'}}};
/* 2.4.0 : indicateurs du réseau */
const pvN=L=>new Set(L.filter(e=>e.pid!=null).map(e=>String(e.pid))).size;
function rnetStat(){const t=today();let n=0,ok=0;DB.personnes.forEach(p=>{if(p.archive)return;const N=nextContact(p);if(!N.next)return;n++;if(N.next>=t)ok++});return{n,ok}}
const signedPids=()=>new Set(E().filter(e=>e.type=='proposition'&&e.statut=='acceptee'&&+e.eur>0&&e.pid!=null).map(e=>String(e.pid)));
/* recommandations de l'année : personnes « recommandé·es ou présenté·es par », datées par leur premier échange */
function recoOf(Y){return DB.personnes.filter(p=>p.reco_par&&p.reco_par.pid!=null&&(!Y||(pEntries(p.id)[0]?.date||'').startsWith(Y)))}
/* 2.4.0 : niveau (échelle de la fiche coach) et total toutes années, en haut à droite des bandeaux */
const KLV={h:'h',conv:'conv',coach:'pers',delib:'delib',inv:'inv',caprop:'ca'};
function kLevel(k){try{const key=KLV[k];let L=null,tot=null;
  if(key){const row=coachStats().flatMap(g=>g.s).find(r=>r[2]==key);if(row){L=rowLvl(row).L;
   tot=key=='ca'?eur(E().filter(e=>e.type=='proposition'&&e.statut=='acceptee'&&+e.eur>0).reduce((s,e)=>s+(+e.eur||0),0)+avN('ca')):fmtV(row[1],row[3])+row[3]}}
  else if(k=='newp')tot=String(Object.keys(firstCoach()).length);
  else if(k=='recos')tot=String(recoOf(null).length);
  else if(k=='pvues')tot=String(pvN(E()));
  else if(k=='aism'){const t=xpWin(E());L=xpLvl(t).L;tot=num(t)+' XP'}
  if(L==null&&tot==null)return'';
  return `<div class="lvb" title="${L!=null?'Niveau · total toutes années':'Total toutes années'}">${L!=null?`<b>Niv. ${L}</b>`:''}<small class="${L==null?'alone':''}">${tot}</small></div>`}catch(e){return''}}
/* charges de l'année : en entier, ou au prorata des jours écoulés */
/* coût d'une supervision : 0 si non payante, sinon son coût saisi, ou à défaut le prix moyen */
Object.values(KPIDEF).forEach(K=>{const f=K.v;K.v=D=>{const r=f(D);if(LANG==='en'&&r&&typeof r[1]==='string'){const u=r[1].trim();if(u==='€')return['€'+r[0],''];if(u.startsWith('€/'))return['€'+r[0],u.slice(1)]}return r}});
function supCost(e){if(e.gratuit)return 0;return +e.cout>0?+e.cout:(+CFG().finances.supDefaut||0)}
const linesTotal=()=>(CFG().finances.lignes||[]).reduce((s,l)=>s+(+l.eur||0),0);
const urssafRate=()=>Math.max(0,+CFG().finances.urssaf||0);
const caYear=Y=>E().filter(e=>e.type=='proposition'&&e.statut=='acceptee'&&e.date.startsWith(Y)).reduce((s,e)=>s+(+e.eur||0),0);
const urssafYear=Y=>caYear(Y)*urssafRate()/100;
const supYear=Y=>E().filter(e=>e.type=='supervision'&&e.date.startsWith(Y)),supYearCost=Y=>supYear(Y).reduce((s,e)=>s+supCost(e),0);
function chargesYTD(D){const F=CFG().finances,sup=supYearCost(D.Y),L=linesTotal();let r=1,pr=0;
 if(F.mode=='prorata'){const y=+D.Y,start=Date.UTC(y,0,1),end=Date.UTC(y+1,0,1),now=new Date(D.t+'T12:00:00Z').getTime();r=Math.min(1,(now-start)/(end-start));pr=Math.round(r*100)}
 const urs=urssafYear(D.Y);
 return{sup,urs,lines:L*r,v:sup+urs+L*r,pr,full:sup+urs+L}}
function chargesYTD_old(D){const F=CFG().finances,c=+F.charges||0;if(F.mode!='prorata')return{v:c,pr:0};
 const y=+D.Y,start=Date.UTC(y,0,1),end=Date.UTC(y+1,0,1),now=new Date(D.t+'T12:00:00Z').getTime(),r=Math.min(1,(now-start)/(end-start));return{v:c*r,pr:Math.round(r*100)}}
function targetProgress(D){const q=`${D.Y}T${D.Q}`,O=DB.objectifs[q]||{},per=periods(q)[0],st=stats(range(per.a,per.b));
  return OROWS.filter(r=>+O[r.k]>0).map(r=>({l:r.l.split(' ')[0],p:Math.min(1,st[r.k]/O[r.k])}))}
const kOrder=()=>{const o=CFG().kpis;return Array.isArray(o)&&o.length?o.filter(k=>KPIDEF[k]):[...KPI_DEFAULT]};
const kLabel=(k,D)=>`${KPIDEF[k].l}<span class="win">${winTxt[KPIDEF[k].w](D)}</span>`;
function bars(v){const w=96/v.length;return `<svg width="96" height="34">${v.map((x,i)=>`<rect x="${i*w+1}" y="${x?6:28}" width="${w-2}" height="${x?26:4}" rx="1.5" fill="rgba(255,255,255,${x?.6:.2})"/>`).join('')}</svg>`}
function tileBig(k,i,D,drag){const K=KPIDEF[k],[v,u]=K.v(D);
 return `<div class="kpi ${drag?'drg':''}" data-k="${k}" ${drag?'draggable="true"':''} style="background:${kpiBg(i)}">${kLevel(k)}<div class="l">${kLabel(k,D)}</div><div class="v">${v}<small>${u?' '+u:''}</small></div><div class="d">${K.d(D)}</div>${K.bars?bars(K.bars(D)):K.sp?spark(K.sp(D)):''}</div>`}
function tileSmall(k,D){const K=KPIDEF[k],[v,u]=K.v(D);
 return `<div class="k2 drg" data-k="${k}" draggable="true"><span class="v">${v}${u?' '+u:''}</span><span class="l">${K.l.toLowerCase()}<span class="win">${winTxt[K.w](D)}</span></span><div class="d">${K.d(D)}</div></div>`}
const SXK=['disc','aism','rate','target','late'];
const kOrder3=()=>SIMPLE()?[...new Set([...kOrder().filter(k=>!SXK.includes(k)),...KPI_DEFAULT.filter(k=>!SXK.includes(k))])].slice(0,3):kOrder().slice(0,3);
function bigKPI(el,drag){const D=kctx();if(SIMPLE())drag=false;$(el).innerHTML=kOrder3().map((k,i)=>tileBig(k,i,D,drag)).join('');if(drag)bindKpiDrag()}
function smallKPI(){const D=kctx(),o=kOrder().slice(3);$('kpis2').innerHTML=o.map(k=>tileSmall(k,D)).join('');$('kpis2').classList.toggle('hide',!o.length);bindKpiDrag()}
let dragK=null;
function swapK(a,b){const o=[...kOrder()],i=o.indexOf(a),j=o.indexOf(b);if(i<0||j<0||i==j)return;[o[i],o[j]]=[o[j],o[i]];CFG().kpis=o;touch()}
function bindKpiDrag(){document.querySelectorAll('#kpisM [data-k],#kpis2 [data-k]').forEach(t=>{
 t.ondragstart=e=>{dragK=t.dataset.k;t.classList.add('drag');try{e.dataTransfer.setData('text/plain',dragK)}catch(_){}};t.ondragend=()=>t.classList.remove('drag');
 t.ondragover=e=>{e.preventDefault();t.classList.add('over')};t.ondragleave=()=>t.classList.remove('over');
 t.ondrop=e=>{e.preventDefault();t.classList.remove('over');if(dragK&&dragK!=t.dataset.k){swapK(dragK,t.dataset.k);renderAll()}dragK=null}})}

/* ---------- fenêtre de choix des indicateurs ---------- */
function renderKcat(){const D=kctx(),o=kOrder();
 $('kcSlots').innerHTML=`<div class="kslab"><span>Principaux</span><span>Secondaires</span></div>`+Array.from({length:6},(_,i)=>{const k=o[i];
  if(!k)return `<div class="ks e ${i<3?'pe':''}">+ emplacement libre</div>`;const [v,u]=KPIDEF[k].v(D);
  return `<div class="ks ${i<3?'p':'s'} drg" draggable="true" data-sk="${k}"><span class="n">${i+1}</span><b>${KPIDEF[k].l}</b><span>${v} ${u.replace(/<[^>]+>/g,'')}</span><button class="rm" data-rm="${k}" title="Retirer">✕</button></div>`}).join('');
 $('kcCols').innerHTML=PILLARS.map(P=>`<div class="kcol"><h4><i style="background:${P.c}">${P.k}</i>${P.l}</h4>${Object.entries(KPIDEF).filter(([,K])=>K.p==P.k).map(([k,K])=>{const [v,u]=K.v(D),r=o.indexOf(k);
  return `<div class="kc ${r>=0?'on':''}" data-ck="${k}"><span class="rk">${r>=0?r+1:'+'}</span><span class="w">${winTxt[K.w](D)}</span><b>${K.l}</b><div class="pv">${v}<small> ${u.replace(/<[^>]+>/g,'')}</small></div><p>${K.u}</p></div>`}).join('')}</div>`).join('');
 $('kcCols').querySelectorAll('[data-ck]').forEach(c=>c.onclick=()=>{const k=c.dataset.ck,L=[...kOrder()],i=L.indexOf(k);
  if(i>=0)L.splice(i,1);else{if(L.length>=6){toast('6 indicateurs maximum : retires-en un d\'abord');return}L.push(k)}
  if(!L.length){toast('Garde au moins un indicateur');return}CFG().kpis=L;touch();renderKcat()});
 $('kcSlots').querySelectorAll('[data-rm]').forEach(b=>b.onclick=e=>{e.stopPropagation();const L=kOrder().filter(x=>x!=b.dataset.rm);if(!L.length){toast('Garde au moins un indicateur');return}CFG().kpis=L;touch();renderKcat()});
 $('kcSlots').querySelectorAll('[data-sk]').forEach(t=>{
  t.ondragstart=e=>{dragK=t.dataset.sk;t.classList.add('drag');try{e.dataTransfer.setData('text/plain',dragK)}catch(_){}};t.ondragend=()=>t.classList.remove('drag');
  t.ondragover=e=>{e.preventDefault();t.classList.add('over')};t.ondragleave=()=>t.classList.remove('over');
  t.ondrop=e=>{e.preventDefault();t.classList.remove('over');if(dragK&&dragK!=t.dataset.sk){swapK(dragK,t.dataset.sk);renderKcat()}dragK=null}})}
function openKcat(){renderKcat();$('kcat').classList.add('show')}
function closeKcat(){$('kcat').classList.remove('show');renderAll()}
document.querySelectorAll('[data-kcat]').forEach(b=>b.onclick=openKcat);
$('kcClose').onclick=closeKcat;$('kcOk').onclick=closeKcat;$('kcat').onclick=e=>{if(e.target==$('kcat'))closeKcat()};

/* ---------- temps passé par mois ---------- */
let YSEL=null;
function renderYears(){const ys=years();if(!YSEL||!ys.includes(YSEL))YSEL=today().slice(0,4);
 $('yChips').innerHTML=ys.map(y=>`<button class="chip ${y==YSEL?'on':''}" data-y="${y}">${y}</button>`).join('');
 $('yChips').querySelectorAll('.chip').forEach(b=>b.onclick=()=>{YSEL=b.dataset.y;renderAll()})}
/* largeur réelle du cadre : texte à taille normale, barres réparties sur tout l'espace */
const svgW=id=>{const el=$(id),w=Math.round(el?.getBoundingClientRect().width||0);const W=w>200?w:720;el.setAttribute('viewBox',`0 0 ${W} 260`);return W};
function renderMonthly(){const y=YSEL,W=svgW('monthly'),Hh=260,l=36,b=26,top=16,cur=today();
 const ST=STACK.map(k=>TM[k]),M=MO.map((_,i)=>ST.map(t=>H(E().filter(e=>e.type==t.k&&e.date.startsWith(y+'-'+pad(i+1))))));
 const tot=M.map(r=>r.reduce((a,b)=>a+b,0)),mx=Math.max(...tot),stepv=mx>60?20:mx>20?10:mx>8?4:2,max=Math.max(4,Math.ceil(mx/stepv)*stepv),step=(W-l-10)/12,bw=Math.max(14,Math.min(56,step*.62));let g='';
 for(let v=0;v<=max;v+=stepv){const yy=Hh-b-(v/max)*(Hh-b-top);g+=`<line x1="${l}" x2="${W-6}" y1="${yy}" y2="${yy}" stroke="#EEE"/><text x="${l-8}" y="${yy+4}" text-anchor="end">${v}h</text>`}
 M.forEach((row,i)=>{const x=l+i*step+(step-bw)/2;let yy=Hh-b;const isCur=y==cur.slice(0,4)&&i==+cur.slice(5,7)-1;
  g+=`<text x="${x+bw/2}" y="${Hh-8}" text-anchor="middle" style="${isCur?'fill:var(--jet);font-weight:800':''}">${MO[i]}</text>`;
  if(!tot[i]){g+=`<rect x="${x}" y="${Hh-b-4}" width="${bw}" height="4" rx="2" fill="#EEE"/>`;return}
  row.forEach((v,j)=>{if(!v)return;const h=v/max*(Hh-b-top);yy-=h;g+=`<rect x="${x}" y="${yy}" width="${bw}" height="${Math.max(h-1.5,1)}" rx="2" fill="${ST[j].c}"><title>${MO[i]} · ${esc(ST[j].l)} : ${n1(v)} h</title></rect>`});
  g+=`<text x="${x+bw/2}" y="${yy-5}" text-anchor="middle" style="fill:var(--jet);font-weight:700">${n1(tot[i])}</text>`});
 $('monthly').innerHTML=g}

/* ---------- aisance dans le temps ---------- */
let EVIEW='met',EMET=null,EHIDE=new Set(),dragM=null;
const posColor=(i,n)=>PAL[n<=1?0:Math.round(i*(PAL.length-1)/(n-1))];   // gauche → droite : rouge … gris
function renderEase(){const y=YSEL,W=svgW('ease'),Hh=260,l=36,b=26,top=16,step=(W-l-10)/12;
 $('easeView').innerHTML=`<button data-v="met" class="${EVIEW=='met'?'on':''}">Toutes les métriques</button><button data-v="type" class="${EVIEW=='type'?'on':''}">Une métrique par type</button>`;
 $('easeView').querySelectorAll('button').forEach(b=>b.onclick=()=>{EVIEW=b.dataset.v;EHIDE.clear();renderEase()});
 const pts=E().filter(e=>e.date.startsWith(y)&&hasAis(e));
 if(!EMET||!metrics().some(m=>m.id==EMET))EMET=(mActive()[0]||metrics()[0])?.id;
 let series=[],drag=false;
 if(EVIEW=='met'){
  $('easeMet').classList.add('hide');drag=true;
  const list=metrics().filter(m=>m.actif||pts.some(e=>e.ais[m.id]));
  series=list.map((m,i)=>({key:m.id,label:m.l+(m.actif?'':' (archivée)'),color:posColor(i,list.length),pts:pts.filter(e=>e.ais[m.id]).map(e=>({e,v:e.ais[m.id]}))}));
 }else{
  $('easeMet').classList.remove('hide');
  $('easeMet').innerHTML=`<select class="sel" id="emSel">${metrics().map(m=>`<option value="${m.id}" ${m.id==EMET?'selected':''}>${esc(m.l)}${m.actif?'':' (archivée)'}</option>`).join('')}</select>`;
  $('emSel').onchange=e=>{EMET=e.target.value;EHIDE.clear();renderEase()};
  series=STACK.map(k=>TM[k]).filter(t=>t.ais||pts.some(e=>e.type==t.k&&e.ais[EMET])).map(t=>({key:t.k,label:t.l,color:t.c,pts:pts.filter(e=>e.type==t.k&&e.ais[EMET]).map(e=>({e,v:e.ais[EMET]}))}));
 }
 $('easeLg').innerHTML=series.map(s=>`<span class="${drag?'drg':''} ${EHIDE.has(s.key)?'off':''}" ${drag?'draggable="true"':''} data-k="${s.key}" title="Cliquer pour masquer / afficher${drag?' · glisser pour réordonner':''}"><i style="background:${s.color}"></i>${esc(s.label)}</span>`).join('');
 $('easeLg').querySelectorAll('span').forEach(sp=>{const k=sp.dataset.k;
  sp.onclick=()=>{EHIDE.has(k)?EHIDE.delete(k):EHIDE.add(k);renderEase()};
  if(!drag)return;
  sp.ondragstart=()=>{dragM=k;sp.classList.add('drag')};sp.ondragend=()=>sp.classList.remove('drag');
  sp.ondragover=e=>{e.preventDefault();sp.classList.add('over')};sp.ondragleave=()=>sp.classList.remove('over');
  sp.ondrop=e=>{e.preventDefault();const M=metrics(),from=M.findIndex(m=>m.id==dragM),to=M.findIndex(m=>m.id==k);if(from<0||to<0||from==to)return;const [x]=M.splice(from,1);M.splice(to,0,x);touch();renderEase()}});
 const sy=v=>Hh-b-(v-1)/4*(Hh-b-top),bx=i=>l+i*step;let g='';
 [1,2,3,4,5].forEach(v=>g+=`<line x1="${l}" x2="${W-6}" y1="${sy(v)}" y2="${sy(v)}" stroke="#EEE"/><text x="${l-8}" y="${sy(v)+4}" text-anchor="end">${v}</text>`);
 if(EVIEW=='type'){const m=metrics().find(x=>x.id==EMET);if(m){g+=`<text x="${W-8}" y="${sy(5)-4}" text-anchor="end" style="font-style:italic">${esc(m.max||'')}</text><text x="${W-8}" y="${sy(1)-4}" text-anchor="end" style="font-style:italic">${esc(m.min||'')}</text>`}}
 MO.forEach((mo,i)=>g+=`<text x="${bx(i)+step/2}" y="${Hh-8}" text-anchor="middle">${mo}</text>`);
 const vis=series.filter(s=>!EHIDE.has(s.key)&&s.pts.length);
 if(!vis.length){g+=`<text x="${W/2}" y="${Hh/2-8}" text-anchor="middle" style="font-size:14px;fill:var(--jet);font-weight:700">Pas encore de notes en ${y}</text><text x="${W/2}" y="${Hh/2+14}" text-anchor="middle" style="font-size:12.5px">Note tes séances à l'enregistrement ou dans « Mes saisies »</text>`;$('ease').innerHTML=g;return}
 [...vis].reverse().forEach((s,ri)=>{const off=((vis.length-1-ri)-(vis.length-1)/2)*.05;
  s.pts.forEach(({e,v})=>{const i=+e.date.slice(5,7)-1,x=bx(i)+6+(+e.date.slice(8,10)-1)/31*(step-12);
   g+=`<circle cx="${x}" cy="${sy(v+off)}" r="3.2" fill="${s.color}" opacity=".35"><title>${dShort(e.date)} · ${esc(pname(e.pid))} · ${esc(s.label)} : ${v}</title></circle>`});
  const av=MO.map((_,i)=>{const a=s.pts.filter(p=>+p.e.date.slice(5,7)==i+1);return a.length?a.reduce((t,p)=>t+p.v,0)/a.length:null});
  const P=av.map((v,i)=>v==null?null:[bx(i)+step/2,sy(v)]).filter(Boolean);
  if(P.length>1)g+=`<polyline fill="none" stroke="${s.color}" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round" points="${P.map(p=>p.join(',')).join(' ')}"/>`;
  av.forEach((v,i)=>{if(v!=null)g+=`<circle cx="${bx(i)+step/2}" cy="${sy(v)}" r="5" fill="${s.color}" stroke="#fff" stroke-width="2"><title>${MO[i]} · ${esc(s.label)} : moyenne ${n1(v)}</title></circle>`})});
 $('ease').innerHTML=g}

/* ---------- suivi indicateurs ---------- */
const OROWS=[{k:'h',l:'Heures de coaching',u:'h'},{k:'conv',l:'Conversations',u:''},{k:'coach',l:'Personnes coachées',u:''},{k:'delib',l:'Pratique délibérée',u:'h'},{k:'ca',l:'CA accepté',u:'€'}];
const curQ=()=>{const t=today();return t.slice(0,4)+'T'+(Math.floor((+t.slice(5,7)-1)/3)+1)};
function periods(qk){const y=+qk.slice(0,4),q=+qk.slice(5),s=q<=2?1:2;return[
 {k:qk,l:'Trimestre',s:`T${q} ${y}`,a:`${y}-${pad(q*3-2)}-01`,b:`${y}-${pad(q*3)}-${[31,30,30,31][q-1]}`},
 {k:`${y}S${s}`,l:'Semestre',s:`S${s} ${y}`,a:s==1?`${y}-01-01`:`${y}-07-01`,b:s==1?`${y}-06-30`:`${y}-12-31`},
 {k:`${y}`,l:'Année',s:`${y}`,a:`${y}-01-01`,b:`${y}-12-31`}]}
let QSEL=null;
function renderObj(){
 const ys=years(),cq=curQ();if(!QSEL)QSEL=cq;
 const opts=[];ys.forEach(y=>[1,2,3,4].forEach(q=>opts.push(`${y}T${q}`)));
 $('qSel').innerHTML=opts.map(o=>`<option value="${o}" ${o==QSEL?'selected':''}>${o}${o==cq?' (en cours)':''}</option>`).join('');
 $('qSel').onchange=()=>{QSEL=$('qSel').value;renderObj()};
 const C=periods(QSEL),t=today(),fv=(r,v)=>r.u=='€'?eur(v):n1(v)+(r.u?' '+r.u:''),O=k=>DB.objectifs[k]||{};
 let h=`<tr><th></th>${C.map((c,i)=>`<th class="l${i}"><div class="h">${c.l}</div><div class="s">${c.s}${c.a<=t&&t<=c.b?' · en cours':''}</div></th>`).join('')}</tr>`;
 h+=`<tr><td>Ambition</td>${C.map((c,i)=>`<td class="l${i}"><textarea class="ed" rows="1" data-amb="${c.k}" placeholder="Écrire l'ambition…">${esc(O(c.k).amb)}</textarea></td>`).join('')}</tr>`;
 OROWS.forEach(r=>{h+=`<tr><td>${r.l}</td>${C.map((c,i)=>{const real=stats(range(c.a,c.b))[r.k],tg=O(c.k)[r.k],p=tg?Math.min(100,real/tg*100):0;
  return `<td class="l${i}"><input class="ed big" data-k="${r.k}" data-p="${c.k}" value="${tg!=null&&tg!==''?fv(r,tg):''}" placeholder="—"><div class="prog"><span>${fv(r,real)}</span>${tg?`<div class="bar"><b style="width:${p}%"></b></div><span>${Math.round(real/tg*100)} %</span>`:'<span style="flex:1"></span>'}</div></td>`}).join('')}</tr>`});
 $('obj').innerHTML=h;
 const fit=ta=>{ta.style.height='auto';ta.style.height=ta.scrollHeight+'px'};
 $('obj').querySelectorAll('textarea').forEach(ta=>{fit(ta);ta.oninput=()=>{fit(ta);(DB.objectifs[ta.dataset.amb]??={}).amb=ta.value;touch()}});
 $('obj').querySelectorAll('input[data-k]').forEach(i=>{const o=()=>DB.objectifs[i.dataset.p]??={};
  i.onfocus=()=>{i.value=o()[i.dataset.k]??'';i.select()};
  i.onblur=()=>{const raw=i.value.replace(/[\s€h]/g,'').replace(',','.'),v=parseFloat(raw);if(raw==='')delete o()[i.dataset.k];else if(!isNaN(v))o()[i.dataset.k]=v;touch();renderObj()};
  i.onkeydown=e=>{if(e.key=='Enter')i.blur()}});
}

/* ---------- objectifs prioritaires ---------- */
let dragI=null;
function renderPrio(){const P=DB.priorites;
 $('prios').innerHTML=P.map((p,i)=>`<li draggable="true" data-i="${i}"><span class="handle" title="Glisser">⋮⋮</span><span class="rank">${i+1}</span>
 <div><input class="ed t" data-f="o" value="${esc(p.o)}" placeholder="Objet"><input class="ed dsc" data-f="d" value="${esc(p.d)}" placeholder="Description"></div>
 <div><button class="ibtn" data-mv="-1" title="Monter">↑</button><button class="ibtn" data-mv="1" title="Descendre">↓</button><button class="ibtn del" data-del title="Supprimer">✕</button></div></li>`).join('')||'<li class="empty">Aucun objectif prioritaire pour l\'instant.</li>';
 $('prios').querySelectorAll('li[data-i]').forEach(li=>{const i=+li.dataset.i;
  li.querySelectorAll('input').forEach(inp=>{inp.onchange=()=>{const old=P[i].o;P[i][inp.dataset.f]=inp.value;if(inp.dataset.f=='o'&&old)DB.actions.forEach(a=>{if(a.p==old)a.p=inp.value});touch();renderActs()}});
  li.querySelectorAll('[data-mv]').forEach(b=>b.onclick=()=>move(i,i+ +b.dataset.mv));
  li.querySelector('[data-del]').onclick=()=>{const [x]=P.splice(i,1);touch();renderPrio();renderActs();toast('Objectif prioritaire supprimé','Annuler',()=>{P.splice(i,0,x);touch();renderPrio();renderActs()})};
  li.ondragstart=()=>{dragI=i;li.classList.add('drag')};li.ondragend=()=>li.classList.remove('drag');
  li.ondragover=e=>{e.preventDefault();li.classList.add('over')};li.ondragleave=()=>li.classList.remove('over');
  li.ondrop=e=>{e.preventDefault();move(dragI,i)}})}
function move(a,b){const P=DB.priorites;if(b<0||b>=P.length||a==b)return;const [x]=P.splice(a,1);P.splice(b,0,x);touch();renderPrio();renderActs()}
$('addPrio').onclick=()=>{DB.priorites.push({o:'',d:''});touch();renderPrio();$('prios').lastChild.querySelector('input').focus()};

/* ---------- plan d'action ---------- */
let AF='encours';
const SL={encours:'En cours',realisee:'Réalisées',annulee:'Annulées'},SS={encours:'En cours',realisee:'Réalisée',annulee:'Annulée'};
function renderActs(){const A=DB.actions,t=today();
 $('pills').innerHTML=Object.keys(SL).map(k=>`<button class="pill ${k} ${AF==k?'on':''}" data-f="${k}">${SL[k]}<span>${A.filter(a=>a.s==k).length}</span></button>`).join('');
 $('pills').querySelectorAll('.pill').forEach(b=>b.onclick=()=>{AF=b.dataset.f;renderActs()});
 const names=DB.priorites.map(p=>p.o).filter(Boolean);
 const rows=A.filter(a=>a.s==AF).sort((x,y)=>(x.d||'9').localeCompare(y.d||'9'));
 $('acts').innerHTML=rows.map(a=>{const custom=!names.includes(a.p),late=a.s=='encours'&&a.d&&a.d<t;
  return `<tr data-id="${a.id}" class="${a.s=='realisee'?'done':a.s=='annulee'?'cancel':''}">
  <td><div class="prio-cell"><select class="ed" data-k="psel">${names.map(n=>`<option ${n==a.p?'selected':''}>${esc(n)}</option>`).join('')}<option value="__o" ${custom?'selected':''}>Autre…</option></select>
   ${custom?`<input class="ed" data-k="p" value="${esc(a.p)}" placeholder="Saisir une valeur" style="font-size:13px;color:var(--am)">`:''}</div></td>
  <td><input class="ed" data-k="a" value="${esc(a.a)}" placeholder="Décrire l'action"></td>
  <td><button type="button" class="ed pbtn" data-pp title="Choisir la personne">${a.pid!=null&&pById(a.pid)?esc(pname(a.pid)):'—'}</button></td>
  <td class="${late?'late':''}"><input type="date" class="ed" data-k="d" value="${a.d||''}">${late?'<div style="font-size:11px;color:var(--am);font-weight:800;padding-left:7px">En retard</div>':''}</td>
  <td><input class="ed" data-k="r" value="${esc(a.r)}" placeholder="—"></td>
  <td><select class="st ${a.s}" data-k="s">${Object.keys(SS).map(k=>`<option value="${k}" ${k==a.s?'selected':''}>${SS[k]}</option>`).join('')}</select></td>
  <td><button type="button" class="ibtn del" data-adel title="Supprimer cette action">✕</button></td></tr>`}).join('')||`<tr><td colspan="7" class="empty">Aucune action ${SL[AF].toLowerCase()}.</td></tr>`;
 $('acts').querySelectorAll('tr[data-id]').forEach(tr=>{const a=A.find(x=>x.id==tr.dataset.id);
  tr.querySelector('[data-adel]').onclick=()=>{const L=DB.actions,idx=L.indexOf(a);if(idx<0)return;L.splice(idx,1);DB.supprimes.a[a.id]=new Date().toISOString();touch();renderAll();
   toast('Action supprimée','Annuler',()=>{const M=DB.actions;if(M.some(x=>String(x.id)===String(a.id)))return;M.splice(Math.min(idx,M.length),0,a);delete DB.supprimes.a[a.id];touch();renderAll()})};
  {const pb=tr.querySelector('[data-pp]');if(pb)pb.onclick=()=>pkOpen(pb,{cur:a.pid,none:true,onPick:id=>{a.pid=id;a.maj=new Date().toISOString();touch();renderActs()}})}
  tr.querySelectorAll('[data-k]').forEach(el=>el.onchange=()=>{const k=el.dataset.k;
   if(k=='psel'){a.p=el.value=='__o'?'':el.value;touch();renderActs();if(el.value=='__o')$('acts').querySelector(`tr[data-id="${a.id}"] [data-k=p]`)?.focus();return}
   a[k]=el.value;a.maj=new Date().toISOString();touch();
   if(k=='s'){tr.className=a.s=='realisee'?'done':a.s=='annulee'?'cancel':'';el.className='st '+a.s;
    toast(a.s=='realisee'?'Action réalisée ✓':a.s=='annulee'?'Action annulée':'Action remise en cours');
    setTimeout(()=>{tr.classList.add('fade');setTimeout(renderActs,450)},700)}
   else if(k=='d')renderActs()})})}
$('addAct').onclick=()=>{DB.actions.push({id:nextId(DB.actions),p:DB.priorites[0]?.o||'',a:'',d:'',r:'',s:'encours'});AF='encours';touch();renderActs();
 $('acts').querySelector(`tr[data-id="${DB.actions.at(-1).id}"] [data-k=a]`)?.focus()};

/* ---------- mes saisies ---------- */
const F={y:new Set(),t:new Set(),p:new Set()};
function filtered(ignore){return E().filter(e=>(ignore=='y'||!F.y.size||F.y.has(e.date.slice(0,4)))&&(ignore=='t'||!F.t.size||F.t.has(e.type))&&(ignore=='p'||!F.p.size||F.p.has(e.pid)))}
function chipRow(el,items,set,cls){$(el).innerHTML=items.map((it,i)=>`<button class="chip ${cls||''} ${set.has(it.v)?'on':''}" data-i="${i}" style="${it.c?`--c:${it.c};--t:${tc(it.c)}`:''}">${esc(it.l)} <small>${it.n}</small></button>`).join('')+(set.size?`<button class="reset" data-r>Tout</button>`:'');
 $(el).querySelectorAll('.chip').forEach(b=>b.onclick=()=>{const v=items[b.dataset.i].v;set.has(v)?set.delete(v):set.add(v);renderList()});
 const r=$(el).querySelector('[data-r]');if(r)r.onclick=()=>{set.clear();renderList()}}
function renderList(){
 const cY=filtered('y'),cT=filtered('t'),cP=filtered('p');
 chipRow('fY',years().reverse().map(y=>({v:y,l:y,n:cY.filter(e=>e.date.startsWith(y)).length})),F.y);
 chipRow('fT',T.map(t=>({v:t.k,l:t.l,c:t.c,n:cT.filter(e=>e.type==t.k).length})),F.t,'type');
 const pc=DB.personnes.filter(p=>!p.archive||F.p.has(p.id)).map(p=>({v:p.id,l:p.nom,n:cP.filter(e=>e.pid==p.id).length})).filter(x=>x.n||F.p.has(x.v)).sort((a,b)=>b.n-a.n||byName(a.l,b.l));
 chipRow('fP',pc,F.p);
 const AR=DB.personnes.filter(p=>p.archive&&!F.p.has(p.id)).sort((a,b)=>byName(a.nom,b.nom));
 if(AR.length){$('fP').insertAdjacentHTML('beforeend',`<select class="sel pa" id="fPA"><option value="">Personnes archivées (${AR.length})…</option>${AR.map(p=>`<option value="${p.id}">${esc(p.nom)} (${cP.filter(e=>e.pid==p.id).length})</option>`).join('')}</select>`);
  $('fPA').onchange=e=>{const p=DB.personnes.find(x=>String(x.id)===e.target.value);if(p){F.p.add(p.id);renderList()}}}
 const L=filtered(),s=stats(L),f2f=L.filter(e=>TM[e.type]?.cr);
 $('sum').innerHTML=[[L.length,'saisies'],[n1(H(L))+' h','temps total'],[n1(s.h)+' h','dont coaching'],[n1(s.delib)+' h','pratique délibérée'],[f2f.length?Math.round(f2f.filter(e=>e.cr).length/f2f.length*100)+' %':'—','CR faits'],[f2f.length?Math.round(f2f.filter(e=>e.syn).length/f2f.length*100)+' %':'—','synthèses faites']].map(([v,l])=>`<div><b>${v}</b>${l}</div>`).join('');
 renderPCards();bindArch();renderRows(L)}
function badge(all){const P=all.filter(e=>e.type=='proposition'&&e.statut=='acceptee');
 if(all.some(e=>e.type=='session'))return P.some(e=>+e.eur>0)?['Client.e','']:['Pro bono','pb'];
 if(all.some(e=>e.type=='conversation'))return['Pro bono','pb'];
 return[all.some(e=>e.type=='supervision')?'Superviseur.e':'Réseau','ot']}
function bindArch(){$('pcards').querySelectorAll('[data-pfo]').forEach(b=>b.onclick=()=>openFiche(b.dataset.pfo));$('pcards').querySelectorAll('[data-arch]').forEach(b=>b.onclick=()=>{const p=DB.personnes.find(x=>String(x.id)===b.dataset.arch);if(!p)return;p.archive=!p.archive;p.maj=new Date().toISOString();touch();renderList();toast(p.archive?`${p.nom} archivé : retrouvable dans « Personnes archivées »`:`${p.nom} réactivé`)})}
let PCTAB=null;
function renderPCards(){const ids=[...F.p].filter(pid=>E().some(e=>e.pid==pid));$('lsTop').classList.toggle('has',ids.length>0);
 if(!ids.length){$('pcards').innerHTML='';return}
 if(!ids.some(x=>String(x)===String(PCTAB)))PCTAB=ids[0];
 const pid=ids.find(x=>String(x)===String(PCTAB)),all=E().filter(e=>e.pid==pid).sort((a,b)=>a.date.localeCompare(b.date));
 const s=stats(all),[bl,bc]=badge(all),first=all[0].date,last=all.at(-1).date,props=all.filter(e=>e.type=='proposition'),per=DB.personnes.find(x=>x.id==pid);
 const tabs=ids.length>1?`<div class="pctabs">${ids.map(id=>`<button data-pct="${id}" class="${String(id)===String(pid)?'on':''}">${esc(pname(id))}</button>`).join('')}</div>`:'';
 $('pcards').innerHTML=`<div class="pc pc2">${tabs}<div class="pc2g"><div class="pc2l">
   <div class="nm">${avatar(per,42)}<div style="min-width:0"><div class="pn2">${esc(pname(pid))}</div><div style="margin-top:3px">${per?stagePill(stageOf(per)):`<span class="bd ${bc}">${bl}</span>`}${per?.archive?' <span class="bd ar">Archivé</span>':''}</div></div></div>
   ${per?.titre||per?.site?`<div class="meta" style="margin-top:8px">${per?.titre?esc(per.titre):''}${per?.titre&&per?.site?' · ':''}${siteLink(per)}</div>`:''}
   <div class="meta">Depuis le ${dShort(first)} · dernière fois le ${dShort(last)}</div>
   <div class="nums"><div><b>${all.filter(e=>e.type=='conversation').length}</b>conversations</div><div><b>${all.filter(e=>e.type=='session').length}</b>sessions</div><div><b>${n1(s.h)} h</b>coaching · ${n1(H(all.filter(e=>e.type=='debrief')))} h débrief</div><div><b>${props.some(e=>e.statut=='acceptee')?eur(s.ca):props.length?'en attente':'—'}</b>contrat${s.mois?' · '+s.mois+' mois':''}</div></div>
   <div class="pcb"><button class="arch-btn" data-pfo="${pid}">Fiche</button><button class="arch-btn" data-arch="${pid}">${per?.archive?'Réactiver':'Archiver'}</button></div>
  </div><div class="pc2sep cx"></div><div class="cx" style="min-width:0"><div class="lab2">XP investis avec cette personne</div><div class="pfais one">${aisBlock(all)}</div></div></div>
  <div class="pc2tl"><div class="lab2">Échanges</div>${timelineSVG(all,700)}</div></div>`;
 $('pcards').querySelectorAll('[data-pct]').forEach(b=>b.onclick=()=>{PCTAB=b.dataset.pct;renderPCards();bindArch()})}
const AC=['#fff','#E8C6CD','#EED8DC','#D3E3EC','#A9C8DA','#7FAAC2'];
const short=s=>{s=TR(s);return s.length>12?s.slice(0,11)+'.':s};
const LV={notes:false,k:false};
/* 3.0.0 : état des XP d'une saisie dans Mes saisies (mode complet) : à répartir (jaune), dépassement (rouge) */
const xpRowCls=e=>{const B=xpBudget(e),l=xpLeft(e);return l<0?'xpov':B>0&&l>0?'xpna':''};
function xpStat(e){const B=xpBudget(e),l=xpLeft(e),fc=xpFcOf(e);if(!B&&!xpPut(e))return isCom(e.type)?(fc?`<small>${fc} XP</small>`:''):'<small>—</small>';
 return `<b>${B}</b>${l>0?`<small class="na">${l} à répartir</small>`:l<0?`<small class="ov">${-l} de trop</small>`:'<small class="ok">✓</small>'}`}
function xpSumTxt(e,MS){const B=xpBudget(e),l=xpLeft(e),p=MS.filter(m=>+e.xp?.[m.id]>0).map(m=>`${xpAbbr(m.l)} ${e.xp[m.id]}`);
 if(!B&&!p.length)return '';const h=[B?`${B} XP`:'',...p].filter(Boolean).join(' · ');return `${h}${B&&l>0?` <small class="na">· ${l} à répartir</small>`:l<0?` <small class="ov">· ${-l} de trop</small>`:''}`}
function renderRows(L){
 const MS=SIMPLE()?[]:$('showArch').checked?metrics():mActive();
 const NH=!MS.length?'':LV.notes?`<th class="c cn fit"><button class="tgl" data-tg="notes" title="Replier les XP">◂</button>XP</th>`+MS.map(m=>`<th class="c cn fit ${m.actif?'':'arch'}" title="${esc(m.l)}">${esc(short(m.l))}</th>`).join(''):`<th class="cn fit"><button class="tgl" data-tg="notes" title="Déplier pour répartir les XP">XP ▸</button></th>`;
 const KH=LV.k?`<th class="kk fit"><button class="tgl" data-tg="k" title="Replier">◂</button>Accepté</th><th class="kk fit">Montant</th><th class="kk fit">Durée</th><th class="kk fit">Séances</th>`:`<th class="kk fit"><button class="tgl" data-tg="k" title="Déplier pour modifier">Contrat / coût ▸</button></th>`;
 $('rowsHead').innerHTML=`<tr><th class="fit">Personne</th><th class="fit">Date</th><th class="fit">Type</th><th class="fit">Durée</th><th class="c fit">CR</th><th class="c fit">Synth.</th><th>Ce qu'on a vu</th>${NH}${KH}<th class="fit"></th></tr>`;
 $('rowsHead').querySelectorAll('[data-tg]').forEach(b=>b.onclick=()=>{LV[b.dataset.tg]=!LV[b.dataset.tg];renderRows(L)});
 L=[...L].sort((a,b)=>b.date.localeCompare(a.date)||b.id-a.id);$('cnt').textContent=L.length+' lignes';
 $('rows').innerHTML=L.map(e=>{const t=TM[e.type]||{l:e.type,c:'#ccc'};return `<tr data-id="${e.id}" class="${MS.length?xpRowCls(e):''}">
 <td class="pcell"><button type="button" class="ed psel pbtn${e.pid==null&&!e.psup&&pReq(e.type)?' miss':''}" data-pp title="${e.pid==null&&!e.psup&&pReq(e.type)?'Personne à renseigner':'Changer la personne'}">${e.pid!=null?esc(pname(e.pid))||'—':e.psup?'Personne supprimée':'—'}</button>${e.pid!=null?`<button class="pflt" data-p="${e.pid}" title="Filtrer sur cette personne"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/></svg></button>`:''}</td>
 <td><input type="date" class="ed" data-k="date" value="${e.date}" style="width:122px"></td>
 <td class="ty"><select class="tysel" data-k="type" style="background:${t.c};color:${tc(t.c)}">${T.map(x=>`<option value="${x.k}" ${x.k==e.type?'selected':''} style="background:#fff;color:#1d1d1f">${esc(x.l)}</option>`).join('')}</select></td>
 <td><select class="ed" data-k="dur" style="width:72px">${(DURS.includes(e.dur)?DURS:[e.dur,...DURS]).map(d=>`<option value="${d}" ${d==e.dur?'selected':''}>${fmtD(d)}</option>`).join('')}<option value="x">Autre…</option></select></td>
 <td>${t.cr?`<div class="ck ${e.cr?'on':''}" data-c="cr">✓</div>`:''}</td><td>${t.cr?`<div class="ck ${e.syn?'on':''}" data-c="syn">✓</div>`:''}</td>
 <td class="grow">${LONGCOM(e.type)||/\n/.test(e.com||'')?`<textarea class="ed comta" data-k="com" rows="${Math.min(8,String(e.com||'').split('\n').length)}" placeholder="—">${esc(e.com)}</textarea>`:`<input class="ed" data-k="com" value="${esc(e.com)}" placeholder="—">`}</td>
 ${!MS.length?'':LV.notes?`<td class="cn xps">${xpStat(e)}</td>`+MS.map(m=>{const v=+e.xp?.[m.id]||0,ok=m.fc?isCom(e.type):xpMult(e.type)>0;return `<td class="cn">${ok||v?`<input type="number" class="ed xpi" min="0" ${m.fc?'max="5"':''} step="1" data-xm="${esc(m.id)}" value="${v||''}" placeholder="·" title="${esc(m.l)}">`:''}</td>`}).join('')
   :`<td class="cn sumc" data-open="notes">${xpSumTxt(e,MS)}</td>`}
 ${LV.k?(e.type=='proposition'?`<td class="kk"><select class="ed" data-k="statut" style="font-weight:800;width:auto;color:${e.statut=='acceptee'?'var(--afb)':e.statut=='refusee'?'var(--red)':'var(--am)'}">${Object.keys(STAT).map(k=>`<option value="${k}" ${k==e.statut?'selected':''}>${STAT[k]}</option>`).join('')}</select></td>
   <td class="kk"><input class="ed" type="number" data-k="eur" value="${e.eur??''}" placeholder="€" style="width:80px"></td>
   <td class="kk"><select class="ed" data-k="engagement_mois" style="width:auto">${[1,2,3,4,5,6,9,12].map(m=>`<option value="${m}" ${m==e.engagement_mois?'selected':''}>${m} mois</option>`).join('')}</select></td>
   <td class="kk"><input class="ed" type="number" min="1" data-k="seances" value="${e.seances??''}" placeholder="—" title="Séances prévues" style="width:62px"></td>`
   :e.type=='invitation'?`<td class="kk"><label class="small" style="display:flex;gap:5px;align-items:center;white-space:nowrap;cursor:pointer;font-weight:800;color:${e.non?'var(--red)':'inherit'}"><input type="checkbox" data-non ${e.non?'checked':''}> Elle a dit non</label></td><td class="kk"></td><td class="kk"></td><td class="kk"></td>`
   :e.type=='supervision'&&!SIMPLE()?`<td class="kk"><label class="small" style="display:flex;gap:5px;align-items:center;white-space:nowrap;cursor:pointer"><input type="checkbox" data-free ${e.gratuit?'checked':''}> non payante</label></td><td class="kk"><input class="ed" type="number" min="0" data-k="cout" value="${+e.cout>0?e.cout:''}" placeholder="${e.gratuit?'—':(+CFG().finances.supDefaut?'moy. '+CFG().finances.supDefaut+' €':'coût €')}" title="Vide = prix moyen" style="width:90px" ${e.gratuit?'disabled':''}></td><td class="kk"></td><td class="kk"></td>`:'<td class="kk"></td><td class="kk"></td><td class="kk"></td><td class="kk"></td>')
   :`<td class="kk sumc" data-open="k">${e.type=='proposition'?`<b style="color:${e.statut=='acceptee'?'var(--afb)':e.statut=='refusee'?'var(--red)':'var(--am)'}">${STAT[e.statut]||'En attente'}</b> · ${eur(e.eur)}${e.engagement_mois?' · '+e.engagement_mois+' mois':''}${e.seances?' · '+e.seances+' séances':''}`:e.type=='invitation'?(e.non?'<b style="color:var(--red)">A dit non</b>':''):e.type=='supervision'&&!SIMPLE()?(e.gratuit?'non payante':`coût ${eur(supCost(e))}${+e.cout>0?'':' (prix moyen)'}`):''}</td>`}
 <td class="nw2"><button class="pdb ${pdHas(e)?'on':''}" data-pde="${e.id}" title="Notes et pratique délibérée de l'entretien">◎</button><button class="del" title="Supprimer">✕</button></td></tr>`}).join('')||`<tr><td colspan="${8+(MS.length?(LV.notes?MS.length+1:1):0)+(LV.k?4:1)}" class="empty">Aucune saisie pour ces filtres.</td></tr>`;
 $('rows').querySelectorAll('[data-open]').forEach(c=>c.ondblclick=c.onclick=()=>{LV[c.dataset.open]=true;renderRows(L)});
 $('rows').querySelectorAll('tr[data-id]').forEach(tr=>{const e=E().find(x=>x.id==tr.dataset.id),fl=()=>{e.maj=new Date().toISOString();touch();tr.classList.add('flash');setTimeout(()=>tr.classList.remove('flash'),60)};
  tr.querySelectorAll('.ck').forEach(c=>c.onclick=()=>{e[c.dataset.c]=!e[c.dataset.c];c.classList.toggle('on');fl()});
  {const pb=tr.querySelector('[data-pp]');if(pb)pb.onclick=()=>pkOpen(pb,{cur:e.pid,none:!pReq(e.type),onPick:id=>{if(id==null&&pReq(e.type)&&!e.psup){toast('La personne est obligatoire pour ce type de saisie');return}e.pid=id;if(id!=null)delete e.psup;fl();renderList()}})}
  tr.querySelectorAll('textarea.comta').forEach(ta=>{ta.addEventListener('input',()=>fitTA(ta));ta.addEventListener('focus',()=>fitTA(ta))});
  const nn=tr.querySelector('[data-non]');if(nn)nn.onchange=()=>{if(nn.checked)e.non=true;else delete e.non;fl();renderList()};
  const fr=tr.querySelector('[data-free]');if(fr)fr.onchange=()=>{if(fr.checked)e.gratuit=true;else delete e.gratuit;fl();renderList()};
  /* 3.0.0 : XP par compétence ; jamais au-delà du budget à la saisie, Facultés commerciales de 0 à 5 */
  tr.querySelectorAll('input.xpi').forEach(i=>i.onchange=()=>{const k=mById(i.dataset.xm)?.id??i.dataset.xm,old=+e.xp?.[k]||0;let v=Math.max(0,Math.round(+i.value||0));
   if(isFc(k))v=Math.min(5,v);else{const room=Math.max(old,old+xpLeft(e));if(v>room){v=room;toast(`Pas plus de ${xpBudget(e)} XP pour cette saisie`)}}
   e.xp=e.xp||{};if(v)e.xp[k]=v;else delete e.xp[k];if(!Object.keys(e.xp).length)delete e.xp;i.value=v||'';tr.className=xpRowCls(e);const st=tr.querySelector('.xps');if(st)st.innerHTML=xpStat(e);fl()});
  tr.querySelectorAll('[data-k]').forEach(i=>i.onchange=()=>{const k=i.dataset.k;
   if(k=='dur'&&i.value==='x'){const inp=document.createElement('input');inp.className='ed';inp.placeholder='2h30';inp.style.width='72px';inp.title='2,5 · 2h30 · 150min';i.replaceWith(inp);inp.focus();let ok=false;
    inp.onkeydown=ev=>{if(ev.key==='Enter')inp.blur();if(ev.key==='Escape'){inp.value='';inp.blur()}};
    inp.onblur=()=>{if(ok)return;ok=true;const v=parseDur(inp.value);if(v>0){e.dur=v;fl()}else if(inp.value.trim())toast('Durée non reconnue : 2,5 · 2h30 · 150min');renderList()};return}
   e[k]=['dur','eur','engagement_mois','cout','seances'].includes(k)?(i.value===''?null:+i.value):i.value;
   if(k=='type'&&e.type=='proposition'&&!e.statut){e.statut='attente';e.engagement_mois=e.engagement_mois||3}
   fl();if(['type','date','statut','dur'].includes(k))renderList()});
  tr.querySelector('[data-pde]').onclick=()=>openPdEdit(e.id);
  tr.querySelector('.del').onclick=()=>{const idx=E().indexOf(e);E().splice(idx,1);DB.supprimes.e[e.id]=new Date().toISOString();touch();renderList();toast('Saisie supprimée','Annuler',()=>{E().splice(idx,0,e);delete DB.supprimes.e[e.id];touch();renderList()})};
  const p=tr.querySelector('.pflt');if(p)p.onclick=()=>{const v=DB.personnes.find(x=>String(x.id)===p.dataset.p)?.id;if(v==null)return;F.p.has(v)?F.p.delete(v):F.p.add(v);renderList();window.scrollTo({top:0,behavior:'smooth'})}})}
$('showArch').onchange=renderList;
$('mFree').onchange=e=>{$('mCout').disabled=e.target.checked};

/* ---------- types ajoutés par l'utilisateur ---------- */
function roleCell(k,C){
 return `<select class="ed" data-role="${k}" style="width:auto">${Object.entries(ROLES).map(([r,l])=>`<option value="${r}" ${r==typeRole(k,C)?'selected':''}>${l}</option>`).join('')}</select>`}
/* nom par défaut d'un type intégré : le libellé français, ou sa traduction (carnet créé en anglais, voir i18nLocalizeDefaults) */
function defTypeL(k){const d=defaultConfig().types[k]?.l;return d?{fr:d,en:I18N_EN[d]||d,loc:LANG==='en'&&I18N_EN[d]?I18N_EN[d]:d}:null}
function delCell(k){if(BUILTIN.includes(k)){const D=defTypeL(k),l=CFG().types[k]?.l,d=D?.fr;return D&&l!==D.fr&&l!==D.en?`<button class="ibtn" data-treset="${k}" title="Rétablir le nom par défaut : ${esc(d)}">↺</button>`:''}const n=E().filter(e=>e.type==k).length;
 return n?`<span class="hint" style="margin:0" title="Utilisé par ${n} saisie(s)">${n} saisie(s)</span>`:`<button class="ibtn del" data-tdel="${k}" title="Supprimer ce type">✕</button>`}
function addCustomType(C){const keys=keysOf(C);if(keys.length>=MAX_TYPES){toast(`${MAX_TYPES} types maximum`);return false}
 let i=1;while(C.types['t'+i])i++;const k='t'+i;C.types[k]={l:'Nouveau type',c:stackColors(C.couleurs)[Math.min(9,keys.length)],d:60,ais:false,perso:true,role:'autre'};C.ordre.push(k);recolor(C);return k}
function bindTypeExtras(root,C,after){
 root.querySelectorAll('[data-role]').forEach(s=>s.onchange=()=>{C.types[s.dataset.role].role=s.value;after()});
 root.querySelectorAll('[data-treset]').forEach(b=>b.onclick=()=>{const k=b.dataset.treset,D=defTypeL(k);if(D&&C.types[k]){C.types[k].l=D.loc;after()}});
 root.querySelectorAll('[data-tdel]').forEach(b=>b.onclick=()=>{const k=b.dataset.tdel;if(E().some(e=>e.type==k))return;delete C.types[k];C.ordre=C.ordre.filter(x=>x!=k);recolor(C);after()})}

/* ---------- réordonner des lignes par glisser-déposer (poignée) ---------- */
function dragRows(tbody,arr,onDone){let from=null;
 tbody.querySelectorAll('tr[data-i]').forEach(tr=>{const h=tr.querySelector('.handle');if(h){h.onmousedown=()=>tr.draggable=true;h.onmouseup=()=>tr.draggable=false}
  tr.ondragstart=e=>{from=+tr.dataset.i;tr.classList.add('drag');e.dataTransfer.effectAllowed='move';try{e.dataTransfer.setData('text/plain','')}catch(_){}};
  tr.ondragend=()=>{tr.classList.remove('drag');tr.draggable=false};
  tr.ondragover=e=>{e.preventDefault();tr.classList.add('over')};tr.ondragleave=()=>tr.classList.remove('over');
  tr.ondrop=e=>{e.preventDefault();tr.classList.remove('over');const to=+tr.dataset.i;if(from==null||from==to)return;const [x]=arr.splice(from,1);arr.splice(to,0,x);from=null;onDone()}})}
const recolor=C=>{if(C.couleursAuto)applyStackColors(C)};

/* ---------- paramètres ---------- */
let IMGT=null;
function readImg(file,kind){return new Promise((res,rej)=>{const fr=new FileReader();fr.onload=()=>{const im=new Image();im.onload=()=>{
  let w=im.width,h=im.height,sx=0,sy=0,sw=w,sh=h,c=document.createElement('canvas');
  if(kind=='logo'){const s=Math.min(w,h);sx=(w-s)/2;sy=(h-s)/2;sw=sh=s;w=h=200}else{const r=Math.min(1,480/w,1400/h);w=Math.round(w*r);h=Math.round(h*r)}
  c.width=w;c.height=h;c.getContext('2d').drawImage(im,sx,sy,sw,sh,0,0,w,h);res(c.toDataURL(kind=='logo'?'image/png':'image/jpeg',.78))};im.onerror=rej;im.src=fr.result};fr.onerror=rej;fr.readAsDataURL(file)})}
function cfgChanged(){touch();applyConfig();renderSettings()}
function renderSecurity(){const on=!!DEKK,al=DB.prefs.autolock??15;
 $('secBody').innerHTML=on?`<div class="secst on"><i></i>Chiffrement activé</div><div class="hint">Ton fichier, ses sauvegardes et la copie du navigateur sont illisibles sans ton mot de passe ou ta clé de secours (${ALGO}).</div>
  <div class="field" style="margin-top:12px"><label>Verrouillage auto</label><select class="fin" id="alSel" style="width:auto">${[[0,'Jamais'],[5,'Après 5 min d\'inactivité'],[15,'Après 15 min'],[30,'Après 30 min'],[60,'Après 1 h']].map(([v,l])=>`<option value="${v}" ${v==al?'selected':''}>${l}</option>`).join('')}</select></div>
  <div class="btns"><button class="btn2" id="sLock">Verrouiller maintenant</button><button class="btn2" id="sPwd">Changer le mot de passe</button><button class="btn2" id="sRec">Nouvelle clé de secours</button><button class="btn2 warn" id="sOff">Désactiver</button></div>
  <div class="hint">Une ancienne sauvegarde s'ouvre avec le mot de passe en vigueur à sa date, ou avec ta clé de secours.</div>`
 :`<div class="secst"><i></i>Chiffrement désactivé</div><div class="hint">Ton fichier est lisible en clair par quiconque y accède (ordinateur, OneDrive, sauvegardes). Le chiffrement le protège par un mot de passe ; une clé de secours te sera remise.</div>
  <div class="btns"><button class="btn2" id="sOn" style="border-color:var(--am);color:var(--am)">Activer le chiffrement</button></div>`;
 if(on){$('alSel').onchange=e=>{DB.prefs.autolock=+e.target.value;touch()};$('sLock').onclick=lock;$('sPwd').onclick=changePassword;$('sRec').onclick=newRecovery;$('sOff').onclick=disableEncryption}
 else $('sOn').onclick=enableEncryption;
 const st=DIR&&!NEEDPERM?`<div class="secst on"><i></i>Dossier : ${esc(DIR.name)}</div><div class="hint">${FILE} est écrit dans ce dossier à chaque modification, avec des copies automatiques dans /${BKDIR} : une par heure (48 h), puis une par jour (${KEEP} jours). Idéalement un dossier synchronisé (OneDrive, Drive).</div><div class="btns"><button class="btn2" id="stDir">Changer de dossier</button></div>`
  :FS_OK?`<div class="secst"><i></i>Aucun dossier relié</div><div class="hint">Tes données ne sont gardées que dans ce navigateur. Choisis un dossier pour les enregistrer dans un fichier.</div><div class="btns"><button class="btn2" id="stDir" style="border-color:var(--am);color:var(--am)">Choisir le dossier</button></div>`
  :`<div class="secst"><i></i>Navigateur sans accès aux fichiers</div><div class="hint">Utilise Chrome ou Edge sur ordinateur. En attendant, exporte régulièrement.</div>`;
 $('storeBody').innerHTML=st+`<div class="hint" style="margin-top:10px">Un seul fichier contient tout : saisies, réglages, objectifs, logo et bandeau.</div><div class="btns">${FS_OK?'<button class="btn2" id="stOther">Ouvrir un autre carnet</button>':''}<button class="btn2" id="stNew">Nouveau carnet</button></div>`;
 if($('stDir'))$('stDir').onclick=()=>connectDir(false);
 if($('stOther'))$('stOther').onclick=()=>connectDir(false);
 $('stNew').onclick=async()=>{if(!confirm('Créer un nouveau carnet vide ?'+(DIR?` Ton carnet actuel reste dans le dossier « ${DIR.name} ».`:'')))return;if(await startFresh())openWizard(0,false)}}
const finColor=i=>{const K=CFG().couleurs,L=[K.bleu,K.fonce,mix(K.bleu,'#ffffff',.45),K.gris,mix(K.fonce,K.bleu,.5),mix(K.gris,'#ffffff',.5),mix(K.accent,K.bleu,.5),mix(K.fonce,'#ffffff',.6)];return L[i%L.length]};
function donut(parts){const tot=parts.reduce((s,p)=>s+p.v,0);if(!tot)return '<div class="hint" style="text-align:center">Le graphique de répartition apparaîtra dès qu\'un coût sera renseigné.</div>';
 let off=0;const segs=parts.map(p=>{const pc=p.v/tot*100,c=`<circle r="15.915" cx="21" cy="21" fill="none" stroke="${p.c}" stroke-width="8" stroke-dasharray="${pc} ${100-pc}" stroke-dashoffset="${-off}"><title>${esc(p.l)} : ${eur(p.v)}</title></circle>`;off+=pc;return c}).join('');
 const lg=[...parts].sort((a,b)=>b.v-a.v).map(p=>`<div><span style="background:${p.c}"></span>${esc(p.l)} <b>${Math.round(p.v/tot*100)} %</b> <small>${eur(p.v)}</small></div>`).join('');
 return `<svg viewBox="0 0 42 42" width="170" height="170" style="transform:rotate(-90deg);flex:none">${segs}</svg><div class="pielg">${lg}</div>`}
function renderSettings(){const C=CFG();{const q=$('setQ'),a=$('setAnim');q.checked=!QS().hide;a.checked=DB.prefs.anim!==false;q.onchange=()=>{QS().hide=!q.checked;if(q.checked)QS().open=true;touch();renderQuest()};a.onchange=()=>{DB.prefs.anim=a.checked;touch()}}{const K=C.couleurs,cur=PALETTES.findIndex(p=>Object.keys(p.c).every(k=>(p.c[k]||'').toLowerCase()==(K[k]||'').toLowerCase()));$('palPick').innerHTML=PALETTES.map((p,i)=>`<button class="palb ${i==cur?'on':''}" data-pal="${i}" title="${p.n}">${['accent','fonce','bleu','gris'].map(k=>`<i style="background:${p.c[k]}"></i>`).join('')}<span>${p.n}</span></button>`).join('');$('palPick').querySelectorAll('[data-pal]').forEach(b=>b.onclick=()=>{C.couleurs={...PALETTES[+b.dataset.pal].c};C.couleursAuto=true;applyStackColors(C);cfgChanged()})}{const g=$('coGenreS');g.value=DB.coach.genre||'i';g.onchange=()=>{DB.coach.genre=g.value;touch()}}
 const F=C.finances,Y=today().slice(0,4);
 const finUI=()=>{const m=F.mode||'entier',D=kctx(),keep=F.mode,res={};
  ['entier','prorata'].forEach(x=>{F.mode=x;res[x]={v:KPIDEF.rate.v(D),c:chargesYTD(D)}});F.mode=keep;
  const t=x=>`${res[x].v[0]} ${res[x].v[1].replace(/<[^>]+>/g,'')}`.trim();
  $('finPrev').innerHTML=`<button class="ftile ${m=='entier'?'on':''}" data-m="entier"><i></i><b>En entier : ${t('entier')}</b><span>${eur(res.entier.c.v)} de charges déduites dès le premier contrat de l'année</span></button>
   <button class="ftile ${m=='prorata'?'on':''}" data-m="prorata"><i></i><b>Au prorata : ${t('prorata')}</b><span>${eur(res.prorata.c.v)} déduits (autres charges à ${res.prorata.c.pr} % de l'année écoulée)</span></button>`;
  $('finPrev').querySelectorAll('[data-m]').forEach(b=>b.onclick=()=>{F.mode=b.dataset.m;touch();finUI();foldSums()});
  const sc=supYearCost(Y),paid=supYear(Y).filter(e=>!e.gratuit).length,us=urssafYear(Y),tot=sc+us+linesTotal();
  const ul=$('finUrsLine');if(ul)ul.textContent=eur(us);const un=$('finUrsN');if(un)un.textContent=`% du CA accepté en ${Y} (${eur(caYear(Y))})`;
  $('finFoot').innerHTML=`<tr><td colspan="2" style="font-weight:800">Charges moyennes annuelles</td><td class="fit" style="text-align:right;font-family:'Noto Serif',serif;font-size:19px">${eur(tot)}</td><td></td></tr>`;
  const sl=$('finSupLine');if(sl)sl.innerHTML=`${eur(sc)}`;const sn=$('finSupN');if(sn)sn.textContent=`${paid} séance${paid>1?'s':''} payante${paid>1?'s':''} en ${Y}`;
  const parts=[{l:'Supervision',v:sc,c:TM.supervision?.c||'#C98593'},{l:'Cotisations URSSAF',v:us,c:mix(CFG().couleurs.accent,CFG().couleurs.fonce,.45)},...F.lignes.map((x,i)=>({l:x.l||'Sans nom',v:+x.eur||0,c:finColor(i)}))].filter(x=>x.v>0);
  $('finPie').innerHTML=donut(parts)};
 const finRows=()=>{$('finRows').innerHTML=`<tr class="fixed"><td><b>Supervision</b> <span class="fsm">prix moyen</span> <input class="ed" type="number" min="0" id="finSup" value="${F.supDefaut||''}" placeholder="€" style="width:72px;display:inline-block;border-color:var(--line)"> <span class="fsm">€ · <span id="finSupN"></span></span></td><td class="fsm">selon tes saisies</td><td class="fit" style="text-align:right;font-weight:800" id="finSupLine"></td><td class="fit"></td></tr>
  <tr class="fixed"><td><span class="fdot" style="background:${mix(CFG().couleurs.accent,CFG().couleurs.fonce,.45)}"></span><b>Cotisations URSSAF</b> <span class="fsm">taux moyen</span> <input class="ed" type="number" min="0" max="100" step="0.1" id="finUrs" value="${F.urssaf||''}" placeholder="%" style="width:72px;display:inline-block;border-color:var(--line)"> <span class="fsm" id="finUrsN"></span></td><td class="fsm">URSSAF</td><td class="fit" style="text-align:right;font-weight:800" id="finUrsLine"></td><td class="fit"></td></tr>`+
  F.lignes.map((x,i)=>`<tr data-i="${i}"><td><span class="fdot" style="background:${finColor(i)}"></span><input class="ed" style="width:calc(100% - 20px);display:inline-block" data-fl="l" value="${esc(x.l||'')}" placeholder="Ex. Assurance RC Pro"></td><td><input class="ed" data-fl="f" value="${esc(x.f||'')}" placeholder="Fournisseur"></td><td class="fit"><input class="ed" type="number" min="0" data-fl="eur" value="${x.eur||''}" placeholder="€/an" style="width:90px;text-align:right"></td><td class="fit"><button class="ibtn del" data-fdel title="Supprimer">✕</button></td></tr>`).join('');
  $('finSup').onchange=e=>{F.supDefaut=+e.target.value||0;touch();finUI();foldSums()};
  $('finUrs').onchange=e=>{F.urssaf=Math.min(100,Math.max(0,+String(e.target.value).replace(',','.')||0));touch();finUI();foldSums()};
  $('finRows').querySelectorAll('tr[data-i]').forEach(tr=>{const x=F.lignes[+tr.dataset.i];
   tr.querySelectorAll('[data-fl]').forEach(inp=>inp.onchange=()=>{const k=inp.dataset.fl;x[k]=k=='eur'?(+inp.value||0):inp.value.trim();F.charges=linesTotal();touch();finUI();foldSums()});
   tr.querySelector('[data-fdel]').onclick=()=>{F.lignes.splice(+tr.dataset.i,1);F.charges=linesTotal();touch();finRows();finUI();foldSums()}});
  finUI()};
 finRows();
 $('finAdd').onclick=()=>{F.lignes.push({id:'c'+Date.now(),l:'',f:'',eur:0});touch();finRows();const ins=$('finRows').querySelectorAll('[data-fl=l]');ins[ins.length-1]?.focus()};
 $('crmFroid').value=C.crm.froid;$('crmFroid').onchange=e=>{C.crm.froid=Math.max(7,+e.target.value||30);touch()};
 $('crmRep').value=C.crm.reporter||14;$('crmRep').onchange=e=>{C.crm.reporter=Math.max(1,Math.round(+e.target.value)||14);e.target.value=C.crm.reporter;touch()};
 renderSecurity();
 document.querySelectorAll('[data-c]').forEach(i=>{i.value=C[i.dataset.c]||'';i.oninput=()=>{C[i.dataset.c]=i.value;touch();applyConfig()}});
 $('pLogo').style.backgroundImage=C.logo?`url("${C.logo}")`:'';$('pBand').style.backgroundImage=C.bandeau?`url("${C.bandeau}")`:'';
 document.querySelectorAll('[data-img]').forEach(b=>b.onclick=()=>{IMGT=b.dataset.img;$('imgFile').click()});
 document.querySelectorAll('[data-imgdel]').forEach(b=>b.onclick=()=>{C[b.dataset.imgdel]=null;cfgChanged()});
 $('brandColors').innerHTML=BRAND.map(([k,l])=>`<label>${l}<input type="color" data-bc="${k}" value="${C.couleurs[k]}"></label>`).join('');
 $('brandColors').querySelectorAll('input').forEach(i=>{i.oninput=()=>{C.couleurs[i.dataset.bc]=i.value;recolor(C);touch();applyConfig()};i.onchange=()=>renderSettings()});
 $('typeRows').innerHTML=STACK.map((k,i)=>{const t=C.types[k];return `<tr data-i="${i}"><td><span class="handle" title="Glisser pour réordonner">⋮⋮</span><span class="rk">${i+1}</span></td><td><input type="color" data-tc="${k}" value="${t.c}"></td><td><input class="ed" data-tl="${k}" value="${esc(t.l)}"></td>
  <td><select class="ed" data-td="${k}" style="width:90px">${[0,...DURS].map(d=>`<option value="${d}" ${d==t.d?'selected':''}>${d?fmtD(d):'aucune'}</option>`).join('')}</select></td>
  <td>${TM[k]?.p?`<select class="ed" data-tpr="${k}" style="width:auto"><option value="1" ${pReq(k)?'selected':''}>Obligatoire</option><option value="0" ${pReq(k)?'':'selected'}>Facultative</option></select>`:'<span class="hint" style="margin:0">—</span>'}</td><td>${roleCell(k,C)}</td><td>${delCell(k)}</td></tr>`}).join('');
 bindTypeExtras($('typeRows'),C,cfgChanged);$('addType').textContent=`+ Ajouter un type (${keysOf(C).length}/${MAX_TYPES})`;$('addType').disabled=keysOf(C).length>=MAX_TYPES;
 $('addType').onclick=()=>{if(addCustomType(C)){cfgChanged();const ins=$('typeRows').querySelectorAll('[data-tl]');ins[ins.length-1]?.select()}};
 dragRows($('typeRows'),C.ordre,()=>{recolor(C);cfgChanged()});
 $('typeRows').querySelectorAll('[data-tc]').forEach(i=>i.oninput=()=>{C.types[i.dataset.tc].c=i.value;C.couleursAuto=false;touch();applyConfig()});
 $('typeRows').querySelectorAll('[data-tl]').forEach(i=>i.onchange=()=>{C.types[i.dataset.tl].l=i.value.trim()||defaultConfig().types[i.dataset.tl]?.l||'Type';cfgChanged()});
 $('typeRows').querySelectorAll('[data-td]').forEach(i=>i.onchange=()=>{C.types[i.dataset.td].d=+i.value;cfgChanged()});
 $('typeRows').querySelectorAll('[data-tpr]').forEach(s=>s.onchange=()=>{C.types[s.dataset.tpr].pReq=s.value==='1';cfgChanged()});

}
$('imgFile').onchange=async e=>{const f=e.target.files[0];if(!f)return;try{CFG()[IMGT]=await readImg(f,IMGT);cfgChanged();if(!$('wiz').classList.contains('hide'))renderWiz();toast('Image enregistrée')}catch(err){toast('Image non reconnue')}e.target.value=''};
$('resetColors').onclick=()=>{const C=CFG();C.couleurs={...PALETTES[0].c};C.couleursAuto=true;applyStackColors(C);cfgChanged()};
function renderMets(){$('discList').innerHTML=[...new Set(metrics().map(m=>(m.disc||'').trim()).filter(Boolean))].map(d=>`<option value="${esc(d)}">`).join('');const M=CFG().metriques,F=PD().focus.map(String),cnt=id=>E().filter(e=>+e.xp?.[id]>0||e.ais_v2?.[id]).length+XFERS().filter(t=>String(t.de)===String(id)||String(t.vers)===String(id)).length;
 $('metRows').innerHTML=M.map((m,i)=>`<tr class="${m.actif?'':'arch'}" data-i="${i}"><td><button class="ibtn" data-mv="-1" ${i?'':'disabled'}>↑</button><button class="ibtn" data-mv="1" ${i<M.length-1?'':'disabled'}>↓</button></td>
  <td><input class="ed" data-f="l" value="${esc(m.l)}" style="font-weight:700"></td><td><input class="ed" data-f="disc" list="discList" value="${esc(m.disc||'')}" placeholder="Discipline" style="width:150px"></td>
  <td>${m.fc?'<span class="hint" style="margin:0" title="Elle reçoit les XP de tes rencontres réseau, invitations et propositions">toujours</span>':`<button class="sw ${m.actif?'on':''}" data-act></button>`}</td><td>${m.actif?`<button class="sw ${F.includes(String(m.id))?'on':''}" data-foc></button>`:''}</td><td style="color:var(--grey);font-size:12.5px">${cnt(m.id)}</td>
  <td>${cnt(m.id)||m.fc?'':'<button class="ibtn del" data-del title="Supprimer">✕</button>'}</td></tr>`).join('');
 $('metRows').querySelectorAll('tr').forEach(tr=>{const i=+tr.dataset.i,m=M[i];
  tr.querySelectorAll('[data-f]').forEach(inp=>inp.onchange=()=>{m[inp.dataset.f]=inp.value.trim();if(!m.l)m.l='Compétence '+(i+1);metChanged()});
  const ac=tr.querySelector('[data-act]');if(ac)ac.onclick=()=>{m.actif=!m.actif;if(!m.actif)PD().focus=PD().focus.filter(x=>String(x)!==String(m.id));metChanged()};
  const fo=tr.querySelector('[data-foc]');if(fo)fo.onclick=()=>{if(F.includes(String(m.id)))unFocus(m.id);else setFocus(m.id,true);renderMets()};
  tr.querySelectorAll('[data-mv]').forEach(b=>b.onclick=()=>{const j=i+ +b.dataset.mv;if(j<0||j>=M.length)return;[M[i],M[j]]=[M[j],M[i]];metChanged()});
  const d=tr.querySelector('[data-del]');if(d)d.onclick=()=>{M.splice(i,1);metChanged()}});}
function metChanged(){touch();applyConfig();renderMets();renderAll()}
function openMets(){renderMets();$('metM').classList.add('show')}
$('metX').onclick=()=>{$('metM').classList.remove('show');renderAll()};
document.addEventListener('click',e=>{const b=e.target.closest&&e.target.closest('[data-mets]');if(b){e.preventDefault();openMets()}});
$('addMet').onclick=()=>{const M=CFG().metriques,n=M.reduce((x,m)=>Math.max(x,+String(m.id).slice(1)||0),0)+1;M.push({id:'m'+n,l:'Nouvelle compétence',actif:true,min:'',max:''});metChanged();
 const ins=$('metRows').querySelectorAll('input[data-f=l]');ins[ins.length-1].select()};

/* ---------- onglets ---------- */
let TAB='dash';
document.querySelectorAll('.tabs button').forEach(b=>b.onclick=()=>{TAB=b.dataset.tab;if(TAB=='metrics')qFlag('metrics');if(TAB=='reseau')qFlag('reseau');document.querySelectorAll('.tabs button').forEach(x=>x.classList.toggle('on',x==b));
 ['dash','coach','pd','metrics','list','people','reseau','settings','about'].forEach(id=>$(id).classList.toggle('hide',id!=TAB));if(TAB=='about')renderAbout();renderAll()});

