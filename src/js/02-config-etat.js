/* =========================================================
   Suivi de pratique de coaching : application générique et personnalisable.
   Aucune donnée dans ce fichier : tout est dans coaching-data.json
   (identité, couleurs, types, métriques, saisies, objectifs…).
   ========================================================= */
const VERSION=4, FILE='coaching-data.json', BKDIR='sauvegardes', KEEP=30;
/* Version affichée : x.y.z (x = version majeure, y = nouvelle fonctionnalité, z = correctif).
   APP_VERSION = numéro de publication interne, +1 à chaque publication quelle qu'elle soit :
   il est enregistré dans le carnet (app_version) et met en lecture seule les versions plus anciennes. */
const APP_SEMVER='3.1.0', APP_VERSION=50, APP_DATE='14 novembre 2026';
let READONLY=false, LASTSEEN=null;

/* ---------- structure fixe (rôle des types dans les calculs) ---------- */
const BUILTIN=['conversation','proposition','session','reseau','debrief','supervision','annexe','invitation'];
let TYPE_KEYS=[...BUILTIN];
const MAX_TYPES=11;
/* rôle d'un type dans les calculs : intégrés = fixes ; types ajoutés = choisis par l'utilisateur */
const ROLES={coaching:'Heures de coaching',delib:'Pratique délibérée',dev:'Développement',autre:'Autre'};
const BUILTIN_ROLE={conversation:'coaching',session:'coaching',debrief:'delib',supervision:'delib',proposition:'dev',reseau:'dev',invitation:'dev',annexe:'autre'};
const typeRole=(k,C)=>C.types[k]?.role||BUILTIN_ROLE[k]||'autre';
const keysOf=c=>[...BUILTIN,...Object.keys(c.types||{}).filter(k=>!BUILTIN.includes(k)&&c.types[k]?.perso)];
const P_REQ_DEF=['conversation','session','proposition','debrief','reseau','invitation'];
const pReq=k=>{const t=TM[k];if(!t?.p)return false;const v=CFG().types[k]?.pReq;return v==null?P_REQ_DEF.includes(k):!!v};
const TYPE_ROLE={conversation:{p:1,cr:1},proposition:{p:1,prop:1},session:{p:1,cr:1},reseau:{p:1},debrief:{p:1},supervision:{p:1},invitation:{p:1},annexe:{}};
const KPI_DEFAULT=['h','delib','conv','coach','reg','caprop'];
const KPI_ALL=['h','conv','coach','reg','newp','active','delib','disc','aism','caprop','transfo','pending','accept','basket','rate','late','target','share','inv','rnet','pvues','recos'];
const DEF_ORDER=['session','supervision','debrief','proposition','conversation','invitation','reseau','annexe'];
let STACK=[...DEF_ORDER];
let COACH=['conversation','session'],DELIB=['debrief','supervision'];
const DURS=[30,45,60,75,90,120,135,150];
const MO=[...(LANG==='en'?MO_EN:MO_FR)];
const STAT={attente:'En attente',acceptee:'Acceptée',refusee:'Refusée'};
const BRAND=[['accent','Accent'],['fonce','Foncé'],['fond','Fond'],['gris','Gris'],['bleu','Bleu']];

const PALETTES=[
 {n:'Océan',c:{accent:'#C8553D',fonce:'#13293D',fond:'#F7F9FB',gris:'#7B8794',bleu:'#2A6F97'}},
 {n:'Forêt',c:{accent:'#B35C37',fonce:'#1F3A2E',fond:'#F7F8F3',gris:'#7A7F76',bleu:'#5B8C5A'}},
 {n:'Prune',c:{accent:'#9B3D6E',fonce:'#2B1B33',fond:'#FAF7FB',gris:'#7E7884',bleu:'#6C6FB0'}},
 {n:'Sable',c:{accent:'#A85A32',fonce:'#3A3226',fond:'#FBF8F2',gris:'#857C70',bleu:'#B98D45'}},
 {n:'Ardoise',c:{accent:'#D9734E',fonce:'#2E3440',fond:'#F8F9FA',gris:'#7B818C',bleu:'#5E81AC'}},
 {n:'Lagune',c:{accent:'#E07A5F',fonce:'#0F3B3A',fond:'#F6FAF9',gris:'#76807F',bleu:'#2A9D8F'}}];
/* 7 couleurs de stack, de la base (rang 1, la plus forte) au sommet, dérivées des couleurs de marque */
function stackColors(K){return[K.accent,mix(K.accent,'#ffffff',.45),mix(K.fonce,K.bleu,.3),K.bleu,mix(K.bleu,'#ffffff',.45),mix(K.fonce,'#ffffff',.6),mix(K.gris,'#ffffff',.45),mix(K.accent,K.fonce,.45),mix(K.bleu,K.fonce,.55),mix(K.gris,'#ffffff',.15)]}
function applyStackColors(C){const S=stackColors(C.couleurs);C.ordre.forEach((k,i)=>C.types[k].c=S[i])}
function defaultConfig(){const K={...PALETTES[0].c},S=stackColors(K),col=k=>S[DEF_ORDER.indexOf(k)];return{
 nom:'Mon cabinet',outil:'Suivi de pratique',sousTitre:'',
 couleurs:K,couleursAuto:true,ordre:[...DEF_ORDER],
 types:{conversation:{l:'Conversation',c:col('conversation'),d:60,ais:true},proposition:{l:'Proposition',c:col('proposition'),d:60,ais:true},session:{l:'Session',c:col('session'),d:90,ais:true},
  reseau:{l:'Rencontre réseau',c:col('reseau'),d:60,ais:true},debrief:{l:'Débrief',c:col('debrief'),d:90,ais:false},supervision:{l:'Supervision',c:col('supervision'),d:90,ais:false},annexe:{l:'Annexe',c:col('annexe'),d:60,ais:false},invitation:{l:'Invitation',c:col('invitation'),d:0,ais:false}},
 logo:null,bandeau:null,
 metriques:[]}}
/* reprise d'un fichier v2 (avant la personnalisation) */
function legacyConfig(){const c=defaultConfig();c.nom='AO Coach';c.couleursAuto=false;
 c.couleurs={accent:'#822239',fonce:'#002327',fond:'#FBF9FF',gris:'#797D81',bleu:'#508AA8'};
 Object.entries({conversation:'#2F8C93',proposition:'#508AA8',session:'#822239',reseau:'#9CC1D4',debrief:'#234E66',supervision:'#C98A97',annexe:'#C4C6C9'}).forEach(([k,v])=>c.types[k].c=v);
 c.metriques=[{id:'m1',l:"Atteinte de l'obj. du rdv",actif:true,min:'Pas atteint',max:'Atteint'},{id:'m2',l:'Métamodèle',actif:true,min:'Challengé',max:'À l\'aise'},{id:'m3',l:'Modélisation du pattern',actif:true,min:'Challengé',max:'À l\'aise'},
  {id:'m4',l:'Conduite & rapport',actif:true,min:'Challengé',max:'À l\'aise'},{id:'m5',l:'Niveau de jeu',actif:true,min:'Faible',max:'Élevé'},{id:'m6',l:'Curseur câlin/challenge',actif:true,min:'Câlin',max:'Challenge'}];return c}

/* ---------- utilitaires ---------- */
const $=id=>document.getElementById(id);
const pad=n=>String(n).padStart(2,'0');
const today=()=>{const d=new Date();return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`};
const fmtD=m=>!m?'—':m<60?m+' min':Math.floor(m/60)+'h'+(m%60?pad(m%60):'');
const n1=v=>(Math.round(v*10)/10).toLocaleString(LOC);
const eur=v=>LANG==='en'?'€'+Math.round(v||0).toLocaleString(LOC):Math.round(v||0).toLocaleString(LOC)+' €';
const esc=s=>String(s??'').replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;');
const dShort=s=>{if(!s)return'';const[y,m,d]=s.split('-');return `${+d} ${LANG==='en'?MO[m-1]:MO[m-1].toLowerCase()}${y==today().slice(0,4)?'':' '+y.slice(2)}`};
const addDays=(s,n)=>{const d=new Date(s+'T12:00:00Z');d.setUTCDate(d.getUTCDate()+n);return d.toISOString().slice(0,10)};
const byName=(a,b)=>a.localeCompare(b,'fr',{sensitivity:'base'});
const nextId=a=>Math.max(a.reduce((m,x)=>Math.max(m,+x.id||0),0)+1,Date.now()*100+Math.floor(Math.random()*100));
function tc(h){const p=[1,3,5].map(i=>parseInt(h.slice(i,i+2),16)/255).map(c=>c<=.03928?c/12.92:((c+.055)/1.055)**2.4);return .2126*p[0]+.7152*p[1]+.0722*p[2]>.42?'#1d1d1f':'#ffffff'}
function mix(a,b,t){const p=h=>[1,3,5].map(i=>parseInt(h.slice(i,i+2),16));const A=p(a),B=p(b);return '#'+A.map((v,i)=>Math.round(v+(B[i]-v)*t).toString(16).padStart(2,'0')).join('')}

/* ---------- état ---------- */
let DB=null,DIR=null,saveT=null,T=[],TM={},PAL=[];
const E=()=>DB.entrees, CFG=()=>DB.config;
const pname=id=>DB.personnes.find(p=>p.id==id)?.nom||'';
const metrics=()=>CFG().metriques, mActive=()=>metrics().filter(m=>m.actif);
const hasAis=e=>e.ais&&Object.values(e.ais).some(v=>v);
/* ---------- 3.0.0 : XP de pratique ----------
   10 min = 1 XP, multiplié selon le type (multiplicateurs fixes) ; arrondi au plus proche ; sans plafond.
   Le budget n'est pas stocké : il se recalcule depuis la durée et le type. e.xp = {idCompétence: XP répartis}.
   Rencontre réseau, invitation, proposition : 0 XP de budget, mais 0 à 5 XP de Facultés commerciales (e.xp[idFC]) avec un commentaire (e.fcom). */
const XP_COM=['reseau','invitation','proposition'];
const XP_MULT={session:2,conversation:2,supervision:3,debrief:1,reseau:0,invitation:0,proposition:0,annexe:0},XP_ROLE={coaching:2,delib:1};
const isCom=k=>XP_COM.includes(k);
function xpMult(k,C){C=C||CFG();if(k in XP_MULT)return XP_MULT[k];return XP_ROLE[typeRole(k,C)]||0}
const xpBudget=(e,C)=>Math.round((+e.dur||0)/10)*xpMult(e.type,C);
const fcMet=()=>metrics().find(m=>m.fc);
const isFc=id=>{const f=fcMet();return!!f&&String(f.id)===String(id)};
/* XP répartis sur les compétences de pratique (hors Facultés commerciales) ; reste = budget − répartis (négatif = dépassement) */
const xpPut=e=>{let s=0;if(e.xp)for(const[k,v] of Object.entries(e.xp))if(!isFc(k))s+=+v||0;return s};
const xpLeft=e=>xpBudget(e)-xpPut(e);
/* « à répartir » n'est signalé que pour les saisies postérieures à la migration (prefs.xp_migre, absente d'un carnet neuf),
   déjà réparties (même en partie) ou issues de la conversion : les anciennes saisies jamais notées restent silencieuses, sans XP. */
const xpSig=e=>{const m=DB?.prefs?.xp_migre;return !m||(e.date||'')>=m||!!e.xp||e.ais_v2!=null};
const xpTodo=e=>xpBudget(e)>0&&xpLeft(e)>0&&xpSig(e);
const xpFcOf=e=>{const f=fcMet();return f&&e.xp?+e.xp[f.id]||0:0};
/* seuils de niveau : 5·L·(L+1) = 10, 30, 60, 100, 150… (même courbe pour toutes les compétences), niveau max 100 */
const xpSeuil=L=>5*L*(L+1);
function xpLvl(x){x=Math.max(0,+x||0);let L=0;while(L<100&&xpSeuil(L+1)<=x)L++;const lo=xpSeuil(L),hi=xpSeuil(L+1);return{L,lo,next:hi,pct:L>=100?100:Math.round((x-lo)/(hi-lo)*100)}}
/* conversion d'une saisie notée de 1 à 5 (avant 3.0.0) : voir spec § 6 et décision 6 ; l'original reste dans e.ais_v2 */
function xpFromAis(e,C,focus){const a=e.ais;delete e.ais;if(!a||typeof a!='object'||Array.isArray(a)||!Object.values(a).some(v=>+v>0))return;
 if(e.ais_v2==null)e.ais_v2=a;if(e.xp)return;const M=C.metriques||[],fc=M.find(m=>m.fc);
 if(isCom(e.type)){if(!fc)return;const om=M.find(m=>!m.fc&&/atteinte|objectif|obj|goal|objective/i.test(m.l||'')&&+a[m.id]>0),vals=Object.values(a).map(Number).filter(v=>v>0);
  const n=om?+a[om.id]:Math.round(vals.reduce((s,v)=>s+v,0)/vals.length);if(n>0)e.xp={[fc.id]:Math.max(0,Math.min(5,n))};return}
 const B=xpBudget(e,C),K=M.filter(m=>!m.fc&&+a[m.id]>0).map(m=>m.id);if(!B||!K.length)return;
 const q=Math.floor(B/K.length),o={};let r=B-q*K.length;K.forEach(id=>o[id]=q);
 const F=K.filter(id=>(focus||[]).map(String).includes(String(id))),R=F.length?F:[K[0]];for(let i=0;r>0;i++,r--)o[R[i%R.length]]++;
 Object.keys(o).forEach(k=>{if(!o[k])delete o[k]});if(Object.keys(o).length)e.xp=o}

function migrate(d){
  d=JSON.parse(JSON.stringify(d||{}));delete d.format;const v=d.version_schema||0;
  d.personnes=d.personnes||[];d.entrees=d.entrees||[];
  d.objectifs=(d.objectifs&&!Array.isArray(d.objectifs))?d.objectifs:{};d.priorites=d.priorites||[];d.actions=d.actions||[];d.prefs=d.prefs||{};
  (d.personnes||[]).forEach(p=>{if(p.linkedin!==undefined){if(p.linkedin&&!p.site)p.site=p.linkedin;delete p.linkedin}});
  /* 2.4.0 : cercles (la provenance devient un premier cercle, sauf une recommandation), proximité, rythme de contact */
  d.personnes.forEach(p=>{if(!Array.isArray(p.cercles)){const s=String(p.provenance||'').trim();p.cercles=[];
    if(/^(recommandation|referral|recommendation)(?![a-zà-ÿ])/i.test(s))p.reco_in=true;else if(s)p.cercles.push(s)}
   if(!['proche','regulier','occasionnel'].includes(p.proximite))p.proximite='regulier';
   if(p.rythme==null||![0,1,3,6,12].includes(+p.rythme))p.rythme=3;else p.rythme=+p.rythme;
   if(p.etape?.v=='contact')p.etape.v='invite'});
  d.entrees.forEach(e=>{
    if(e.contrat&&!e.engagement_mois){e.engagement_mois=e.contrat;delete e.contrat}
    if(Array.isArray(e.ais)){const o={};e.ais.forEach((x,i)=>{if(x)o['m'+(i+1)]=x});e.ais=Object.keys(o).length?o:null}   // v2 : tableau → par identifiant
  });
  if(!d.config)d.config=(v===2&&d.entrees.length)?legacyConfig():defaultConfig();
  const D=defaultConfig(),c=d.config;
  c.couleurs={...D.couleurs,...(c.couleurs||{})};c.types=c.types||{};
  BUILTIN.forEach(k=>c.types[k]={...D.types[k],...(c.types[k]||{})});const KK=keysOf(c);
  c.metriques=c.metriques||D.metriques;
  if(!Array.isArray(c.kpis)||c.kpis.some(k=>k=='prop'||k=='ca'))c.kpis=[...KPI_DEFAULT];
  /* 3.0.0 : l'indicateur « Atteinte de l'objectif » disparaît ; s'il était affiché, « XP de pratique » prend sa place */
  if(c.kpis.includes('obj'))c.kpis=c.kpis.map(k=>k=='obj'?(c.kpis.includes('aism')?null:'aism'):k).filter(Boolean);   // ancienne liste fixe → nouvelle sélection par défaut
  c.kpis=[...new Set(c.kpis.filter(k=>KPI_ALL.includes(k)))].slice(0,6);if(!c.kpis.length)c.kpis=[...KPI_DEFAULT];
  c.finances={charges:0,supDefaut:0,mode:'entier',...(c.finances||{})};if(!Array.isArray(c.finances.lignes)){c.finances.lignes=+c.finances.charges>0?[{id:'c1',l:'Charges diverses',f:'',eur:+c.finances.charges}]:[]}c.crm={froid:30,reporter:14,...(c.crm||{})};
  if(!Array.isArray(c.ordre))c.ordre=[...DEF_ORDER];c.ordre=[...new Set(c.ordre.filter(k=>KK.includes(k)))];KK.forEach(k=>{if(!c.ordre.includes(k))c.ordre.push(k)});['nom','outil','sousTitre'].forEach(k=>{if(c[k]==null)c[k]=D[k]});
  delete d.prefs.aisOrdre;delete d.prefs.kpiStyle;
  d.actions.forEach((a,i)=>{if(!a.id)a.id=i+1});
  if(!d.id)d.id=(crypto.randomUUID?crypto.randomUUID():Date.now().toString(36)+Math.random().toString(36).slice(2));
  if(d.config.sousTitre==="C'est en coachant délibérément et beaucoup qu'on devient un excellent coach")d.config.sousTitre="C'est en coachant beaucoup et en pratiquant délibérément qu'on devient un excellent coach";
  d.pd=(d.pd&&typeof d.pd=='object'&&!Array.isArray(d.pd))?d.pd:{};d.pd.focus=Array.isArray(d.pd.focus)?d.pd.focus.slice(0,3):[];d.pd.lib=Array.isArray(d.pd.lib)?d.pd.lib:[];d.pd.prep=(d.pd.prep&&typeof d.pd.prep=='object'&&!Array.isArray(d.pd.prep))?d.pd.prep:{};
  d.coach={nom:'',titre:'',naissance:'',debut:'',pitch:'',genre:'i',theme:'pro',...((d.coach&&typeof d.coach=='object')?d.coach:{})};['formation','parcours','victoires'].forEach(k=>{if(!Array.isArray(d.coach[k]))d.coach[k]=[]});if(!isObj(d.coach.avant))d.coach.avant={};
  d.supprimes=d.supprimes||{};d.supprimes.e=d.supprimes.e||{};d.supprimes.a=d.supprimes.a||{};d.supprimes.p=d.supprimes.p||{};
  /* 3.0.0 : XP de pratique. Compétence « Facultés commerciales » (non supprimable, renommable), transferts, conversion des notes de 1 à 5.
     La conversion ne touche que les saisies qui ont encore un « ais » : elle ne se rejoue pas, et une copie ancienne fusionnée est convertie à la volée. */
  if(!c.metriques.some(m=>m&&m.fc)){let id='fc',i=2;while(c.metriques.some(m=>String(m.id)===id))id='fc'+i++;
   c.metriques.push({id,l:typeof LANG!=='undefined'&&LANG==='en'?'Sales skills':'Facultés commerciales',actif:true,fc:true,min:'',max:''})}
  c.metriques.forEach(m=>{if(m.fc)m.actif=true});
  d.pd.transferts=Array.isArray(d.pd.transferts)?d.pd.transferts.filter(t=>t&&t.id!=null&&+t.xp>0&&t.de!=null&&t.vers!=null&&String(t.de)!==String(t.vers)):[];
  d.supprimes.t=d.supprimes.t||{};
  d.entrees.forEach(e=>{if('ais' in e)xpFromAis(e,c,d.pd.focus);if(e.xp&&(typeof e.xp!='object'||Array.isArray(e.xp)))delete e.xp;
   else if(e.xp){Object.keys(e.xp).forEach(k=>{const v=Math.max(0,Math.round(+e.xp[k]||0));if(v)e.xp[k]=v;else delete e.xp[k]});if(!Object.keys(e.xp).length)delete e.xp}});
  if(v<4&&v>0&&d.entrees.length&&!d.prefs.xp_migre)d.prefs.xp_migre=today();
  d.version_schema=VERSION;return d;
}

/* ---------- application de la configuration ---------- */
function applyConfig(){const C=CFG(),K=C.couleurs,r=document.documentElement.style;
 try{const fav=document.querySelector('link[rel=icon]');if(fav){fav.href=C.logo||'icon-192.png';fav.type=C.logo?(C.logo.match(/^data:([^;]+)/)||[])[1]||'':'image/png'}}catch(e){}
  TYPE_KEYS=keysOf(C);COACH=TYPE_KEYS.filter(k=>typeRole(k,C)=='coaching');DELIB=TYPE_KEYS.filter(k=>typeRole(k,C)=='delib');
  STACK=C.ordre;T=TYPE_KEYS.map(k=>({k,...(TYPE_ROLE[k]||{p:typeRole(k,C)!='autre'?1:0,cr:typeRole(k,C)=='coaching'?1:0}),...C.types[k]}));TM=Object.fromEntries(T.map(t=>[t.k,t]));PAL=STACK.map(k=>TM[k].c);
  r.setProperty('--am',K.accent);r.setProperty('--jet',K.fonce);r.setProperty('--gw',K.fond);r.setProperty('--grey',K.gris);r.setProperty('--afb',K.bleu);
  r.setProperty('--bluebg',mix(K.bleu,'#ffffff',.85));
  const title=[C.nom,C.outil].filter(Boolean).join(' - ');$('appTitle').textContent=title;document.title=title;$('appSub').textContent=C.sousTitre||'';$('footName').textContent=C.nom||'';
  const ini=(C.nom||'?').split(/\s+/).map(w=>w[0]).join('').slice(0,2).toUpperCase();
  $('logoBox').innerHTML=C.logo?`<img class="logo" src="${C.logo}" alt="">`:`<div class="logo ini">${esc(ini)}</div>`;
  $('side').style.backgroundImage=C.bandeau?`url("${C.bandeau}")`:`linear-gradient(180deg,${mix(K.fonce,K.bleu,.45)} 0%,${K.fonce} 100%)`;
  $('lg').innerHTML=STACK.map(k=>TM[k]).map(t=>`<span><i style="background:${t.c}"></i>${esc(t.l)}</span>`).join('');
}

/* ---------- stockage navigateur (IndexedDB) ---------- */
const idb={db:null,
 open(){return new Promise((res,rej)=>{const r=indexedDB.open('aocoach',1);r.onupgradeneeded=()=>r.result.createObjectStore('kv');r.onsuccess=()=>{this.db=r.result;res()};r.onerror=()=>rej(r.error)})},
 get(k){return new Promise(res=>{try{const r=this.db.transaction('kv').objectStore('kv').get(k);r.onsuccess=()=>res(r.result);r.onerror=()=>res(undefined)}catch(e){res(undefined)}})},
 set(k,v){return new Promise(res=>{try{const t=this.db.transaction('kv','readwrite');t.objectStore('kv').put(v,k);t.oncomplete=()=>res(true);t.onerror=()=>res(false)}catch(e){res(false)}})}};

