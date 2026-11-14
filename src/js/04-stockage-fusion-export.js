/* =========================================================
   STOCKAGE : serveur local (lanceur) ou dossier (Chrome/Edge), + copie navigateur
   ========================================================= */
let NEEDPERM=false;
const FS_OK=!!window.showDirectoryPicker;
const BKRE=/^coaching-data_.*\.json$/;
async function writeFile(dir,name,text){const fh=await dir.getFileHandle(name,{create:true});const w=await fh.createWritable();await w.write(text);await w.close()}
async function readFile(dir,name){try{const fh=await dir.getFileHandle(name);return await (await fh.getFile()).text()}catch(e){return null}}
/* Copies de sécurité : avant chaque écriture, l'état précédent du fichier est copié dans /sauvegardes
   (une copie par heure, gardée 48 h ; au-delà, une par jour pendant 30 jours ; + une copie avant chaque fusion). */
async function snapshot(txt,tag){if(!DIR||!txt)return;const b=await DIR.getDirectoryHandle(BKDIR,{create:true}),d=new Date(),h=pad(d.getHours());
  const name=tag?`coaching-data_${today()}_${h}${pad(d.getMinutes())}${pad(d.getSeconds())}_${tag}.json`:`coaching-data_${today()}_${h}h.json`;
  if(!tag){try{await b.getFileHandle(name);return}catch(e){}}
  await writeFile(b,name,txt);await pruneBackups(b)}
async function pruneBackups(b){const L=[];for await(const [n] of b.entries()){const m=n.match(/^coaching-data_(\d{4}-\d{2}-\d{2})(?:_(\d{2}))?.*\.json$/);if(m)L.push({n,day:m[1],h:m[2]||'00'})}
  L.sort((x,y)=>(y.day+y.h+y.n).localeCompare(x.day+x.h+x.n));const now=Date.now(),seen=new Set(),del=[];
  for(const f of L){const age=now-new Date(`${f.day}T${f.h}:00:00`).getTime();if(age<=48*3600e3)continue;if(age>KEEP*86400e3||seen.has(f.day))del.push(f.n);else seen.add(f.day)}
  for(const n of del){try{await b.removeEntry(n)}catch(e){}}}
async function listBackups(){
  if(DIR&&!NEEDPERM){const b=await DIR.getDirectoryHandle(BKDIR,{create:true}),n=[];for await(const [k] of b.entries())if(BKRE.test(k))n.push(k);return n}return[]}
async function readBackup(n){return readFile(await DIR.getDirectoryHandle(BKDIR),n)}
async function writeBackup(n,txt){await writeFile(await DIR.getDirectoryHandle(BKDIR),n,txt)}
async function encryptOldBackups(){let k=0;try{for(const n of await listBackups()){try{const t=await readBackup(n);if(!t)continue;const o=JSON.parse(t);if(isEnc(o))continue;
  await writeBackup(n,JSON.stringify(await sealObj(o),null,1));k++}catch(e){}}}catch(e){}return k}

async function payload(){return DEKK?await sealObj(DB):DB}

/* =========================================================
   FUSION : on ne remplace jamais un carnet par un autre, on fusionne.
   - saisies, personnes, actions : réunies par identifiant ; une même saisie modifiée des deux côtés
     garde la modification la plus récente ; deux saisies différentes portant le même identifiant sont gardées toutes les deux ;
   - suppressions : mémorisées (registre « supprimes ») pour ne pas faire réapparaître une saisie effacée ;
   - réglages, objectifs, priorités : ceux de la copie la plus récente.
   ========================================================= */
const compatBook=(a,b)=>!a?.id||!b?.id||a.id===b.id;
const sig=e=>`${e.date}|${e.type}|${e.pid}`;
/* Après une fusion, on met à jour le carnet EN PLACE : les fenêtres ouvertes (fiche, paramètres, parcours)
   gardent ainsi les mêmes objets, et ce qu'on tape ensuite est bien enregistré. */
const isObj=x=>x&&typeof x=='object'&&!Array.isArray(x);
/* BASE = dernier état commun connu (ce qui a été lu ou écrit dans le fichier).
   Fusion à trois voies : ce qu'une seule fenêtre a modifié est gardé ; en cas de conflit, la fenêtre courante l'emporte. */
let BASE=null;
const emptyV=v=>v==null||v===''||v===0||(Array.isArray(v)&&!v.length);
function m3(b,l,r){const J=JSON.stringify,cl=x=>x===undefined?undefined:JSON.parse(J(x)),hasB=b!==undefined&&b!==null;
 if(J(l)===J(r))return cl(l);if(hasB){if(J(l)===J(b))return cl(r);if(J(r)===J(b))return cl(l)}
 if(l===undefined)return cl(r);if(r===undefined)return cl(l);
 if(isObj(l)&&isObj(r)){const B=isObj(b)?b:{},o={};new Set([...Object.keys(l),...Object.keys(r)]).forEach(k=>{const iL=k in l,iR=k in r;
   if(iL&&iR){o[k]=m3(B[k],l[k],r[k]);return}const v=iL?l[k]:r[k];if(k in B&&J(B[k])===J(v))return;o[k]=cl(v)});return o}
 if(Array.isArray(l)&&Array.isArray(r)&&l.concat(r).every(x=>isObj(x)&&x.id!=null)){const Bm=new Map((Array.isArray(b)?b:[]).filter(isObj).map(x=>[String(x.id),x])),Rm=new Map(r.map(x=>[String(x.id),x])),Lm=new Map(l.map(x=>[String(x.id),x])),out=[];
   l.forEach(x=>{const k=String(x.id);if(Rm.has(k))out.push(m3(Bm.get(k),x,Rm.get(k)));else if(!(Bm.has(k)&&J(Bm.get(k))===J(x)))out.push(cl(x))});
   r.forEach(x=>{const k=String(x.id);if(Lm.has(k))return;if(!(Bm.has(k)&&J(Bm.get(k))===J(x)))out.push(cl(x))});return out}
 if(!hasB&&emptyV(l)&&!emptyV(r))return cl(r);
 return cl(l)}
const SECTIONS=['config','objectifs','priorites','prefs','pd','coach'];
function inPlace(o,n){
  if(Array.isArray(o)&&Array.isArray(n)){const byId=new Map(o.filter(x=>isObj(x)&&x.id!=null).map(x=>[String(x.id),x]));
    const r=n.map((x,i)=>{if(!isObj(x))return x;const old=x.id!=null?byId.get(String(x.id)):(isObj(o[i])&&o[i].id==null?o[i]:null);if(old){inPlace(old,x);return old}return x});
    o.splice(0,o.length,...r);return o}
  Object.keys(o).forEach(k=>{if(!(k in n))delete o[k]});
  Object.keys(n).forEach(k=>{const a=o[k],b=n[k];if((Array.isArray(a)&&Array.isArray(b))||(isObj(a)&&isObj(b)))inPlace(a,b);else o[k]=b});return o}
function adoptDB(n){if(!DB){DB=n;return}inPlace(DB,n)}
function mergeDB(A,B,base,prefA){
  const [N,O]=(A.enregistre_le||'')>=(B.enregistre_le||'')?[A,B]:[B,A],R=JSON.parse(JSON.stringify(N));
  const sup={e:{...(O.supprimes?.e||{}),...(N.supprimes?.e||{})},a:{...(O.supprimes?.a||{}),...(N.supprimes?.a||{})},p:{...(O.supprimes?.p||{}),...(N.supprimes?.p||{})},t:{...(O.supprimes?.t||{}),...(N.supprimes?.t||{})}};R.supprimes=sup;
  const remap={},fromO=new Set();let added=0;
  (O.personnes||[]).forEach(p=>{if(sup.p[String(p.id)])return;const q=R.personnes.find(x=>String(x.id)===String(p.id));
    if(q&&(byName(q.nom,p.nom)==0||(q.maj&&p.maj))){if((p.maj||'')>(q.maj||'')){Object.assign(q,JSON.parse(JSON.stringify(p)));fromO.add(q)}return}
    const same=R.personnes.find(x=>byName(x.nom,p.nom)==0);if(same){remap[p.id]=same.id;return}
    if(!q){const n=JSON.parse(JSON.stringify(p));R.personnes.push(n);fromO.add(n);return}
    const nid=nextId(R.personnes),n={...JSON.parse(JSON.stringify(p)),id:nid};remap[p.id]=nid;R.personnes.push(n);fromO.add(n)});
  const strip=x=>JSON.stringify({...x,maj:0});
  const mergeList=(dst,src,key,isSame)=>{src.forEach(x=>{const k=String(x.id),r=dst.find(y=>String(y.id)===k);
    if(!r){if(sup[key][k])return;dst.push(x);added+=key=='e';return}
    if(strip(r)===strip(x))return;
    if(isSame(r,x)){if((x.maj||'')>(r.maj||''))Object.assign(r,x);return}
    dst.push({...x,id:nextId(dst)});added+=key=='e'});
    return dst.filter(x=>!sup[key][String(x.id)])};
  R.entrees=mergeList(R.entrees,(O.entrees||[]).map(e=>e.pid!=null&&sup.p[String(e.pid)]?{...e,pid:null,psup:true}:e).map(e=>({...e,pid:e.pid!=null&&remap[e.pid]!=null?remap[e.pid]:e.pid})),'e',(r,x)=>sig(r)===sig(x));
  R.personnes=R.personnes.filter(p=>!sup.p[String(p.id)]);
  /* 2.4.0 : « recommandé·e ou présenté·e par » suit les renumérotations et s'efface si la personne a été supprimée */
  R.personnes.forEach(p=>{const r=p.reco_par;if(!r||r.pid==null)return;let pid=r.pid;
   if(fromO.has(p)&&remap[pid]!=null)pid=remap[pid];
   p.reco_par=sup.p[String(pid)]||String(pid)===String(p.id)||!R.personnes.some(x=>String(x.id)===String(pid))?null:{...r,pid}});R.entrees.forEach(e=>{if(e.pid!=null&&sup.p[String(e.pid)]){e.pid=null;e.psup=true}});
  R.actions=mergeList(R.actions,(O.actions||[]).map(a=>({...a})),'a',(r,x)=>r.a===x.a);
  SECTIONS.forEach(k=>{if(A[k]===undefined&&B[k]===undefined)return;R[k]=base?m3(base[k],A[k],B[k]):prefA?m3(null,A[k],B[k]):m3(null,N[k],O[k])});
  /* 3.0.0 : transferts d'XP réunis par identifiant (fusion de la section pd), sans faire réapparaître un transfert annulé */
  if(isObj(R.pd)){const L=[...(Array.isArray(R.pd.transferts)?R.pd.transferts:[])],seen=new Set(L.map(t=>String(t?.id)));
   [A,B].forEach(X=>(X.pd?.transferts||[]).forEach(t=>{if(t&&!seen.has(String(t.id))&&!(base&&(base.pd?.transferts||[]).some(b=>String(b.id)===String(t.id)))){seen.add(String(t.id));L.push(JSON.parse(JSON.stringify(t)))}}));
   R.pd.transferts=L.filter(t=>t&&!sup.t[String(t.id)])}
  /* 3.2.0 : modules = réglage de la copie où ils ont été changés le plus récemment (modules_maj), sinon de la copie la plus récente ; jamais mélangés case par case */
  {const ma=A.prefs?.modules,mb=B.prefs?.modules;if(isObj(ma)||isObj(mb)){const ta=A.prefs?.modules_maj||'',tb=B.prefs?.modules_maj||'',W=!isObj(mb)?A:!isObj(ma)?B:ta!==tb?(ta>tb?A:B):N;
   R.prefs=R.prefs||{};R.prefs.modules=JSON.parse(JSON.stringify(W.prefs.modules));R.prefs.simple=!MODS.some(k=>R.prefs.modules[k]);if(W.prefs.modules_maj)R.prefs.modules_maj=W.prefs.modules_maj;else delete R.prefs.modules_maj}}
  R.app_version=Math.max(+A.app_version||0,+B.app_version||0);R.app_semver=((+A.app_version||0)>=(+B.app_version||0)?A:B).app_semver;if(!R.app_semver)delete R.app_semver;
  {const a=A.prefs?.nouveautes_vues,b=B.prefs?.nouveautes_vues;if(a!=null||b!=null){R.prefs=R.prefs||{};R.prefs.nouveautes_vues=Math.max(+a||0,+b||0)}}
  return{db:R,added}}

function touch(){if(!DB)return;if(READONLY){toast('Lecture seule : cette version de l\'application est périmée. Recharge-la (Ctrl+F5).');return}
  DB.enregistre_le=new Date().toISOString();setStatus('busy');clearTimeout(saveT);saveT=setTimeout(persist,400);clearTimeout(CELT);CELT=setTimeout(celCheck,700)}
/* les écritures passent une par une (file d'attente) pour ne jamais se chevaucher */
let PQ=Promise.resolve();
function persist(){PQ=PQ.then(_persist,_persist);return PQ}
async function _persist(){if(!DB||READONLY)return;
  if((+DB.app_version||0)<=APP_VERSION){DB.app_version=APP_VERSION;DB.app_semver=APP_SEMVER}
  if(!(DIR&&!NEEDPERM)){await idb.set('data',await payload());setStatus('local');return}
  try{
    const cur=await readFile(DIR,FILE);let curObj=null;if(cur){try{curObj=JSON.parse(cur)}catch(e){setStatus('err',`${FILE} illisible : non écrasé`);return}}
    if(curObj&&!compatBook(curObj,DB)){setStatus('err','Le dossier contient un autre carnet : non écrasé');banner('reconnect');return}
    if(curObj&&(curObj.enregistre_le||'')!==(LASTSEEN||'')){
      /* le fichier a été modifié ailleurs (autre fenêtre, autre version, autre ordinateur) : on fusionne au lieu d'écraser */
      const p=isEnc(curObj)?await tryCurrentKey(curObj):curObj;
      if(!p){setStatus('err','Fichier modifié ailleurs avec un autre mot de passe : non écrasé');return}
      if((+p.app_version||0)>APP_VERSION){READONLY=true;banner('old');setStatus('err','Lecture seule');return}
      await snapshot(cur,'avant-fusion');
      const m=mergeDB(DB,migrate(p),BASE);adoptDB(m.db);DB.enregistre_le=new Date().toISOString();DB.app_version=Math.max(+DB.app_version||0,APP_VERSION);
      if(m.added)toast(`${m.added} saisie(s) enregistrée(s) ailleurs ont été réunies dans ton carnet`);renderAll()}
    else if(cur)await snapshot(cur);
    const ws=DB.enregistre_le,snap=JSON.stringify(DB),obj=await payload(),txt=JSON.stringify(obj,null,1);await idb.set('data',obj);
    await writeFile(DIR,FILE,txt);LASTSEEN=ws;BASE=JSON.parse(snap);setStatus(DB.enregistre_le===ws?'ok':'busy')
  }catch(e){await idb.set('data',await payload());setStatus('err','Écriture du fichier impossible');NEEDPERM=true;banner('reconnect')}}
window.addEventListener('beforeunload',e=>{if($('status').classList.contains('busy')){e.preventDefault();e.returnValue=''}});

const sameBook=(a,b)=>(a?.id||null)===(b?.id||null);
/* Relier un dossier. Si ce dossier contient un AUTRE carnet, on l'ouvre sans jamais écraser son fichier. */
async function connectDir(useExisting){
  if(useExisting){try{if(await DIR.requestPermission({mode:'readwrite'})!=='granted')return}catch(e){return}NEEDPERM=false;if(DB){clearTimeout(saveT);await idb.set('data',await payload())}return boot()}
  const prevDir=await idb.get('dir');let nd;try{nd=await window.showDirectoryPicker({id:'aocoach',mode:'readwrite'})}catch(e){return}
  const t=await readFile(nd,FILE);let f=null;if(t){try{f=JSON.parse(t)}catch(e){toast(`${FILE} est illisible dans ce dossier`);return}}
  if(!f&&!DB){toast(`Aucun carnet (${FILE}) dans ce dossier`);return}
  const cur=DB||await idb.get('data');let other=f&&cur&&!sameBook(f,cur);
  if(other&&!prevDir&&!confirm(`Ce dossier contient un autre carnet.\nTon carnet actuel n'est enregistré que dans ce navigateur : il sera remplacé. Exporte-le d'abord (Exporter JSON) si tu veux le garder.\n\nOuvrir le carnet de ce dossier ?`))return;
  if(DB&&!other){clearTimeout(saveT);await idb.set('data',await payload())}
  DIR=nd;LASTSEEN=null;BASE=null;NEEDPERM=false;await idb.set('dir',nd);
  if(other){await idb.set('data',null);DB=null;await setDEK(null);ENV=null;toast(LANG==='en'?`Notebook from the “${nd.name}” folder opened`:`Carnet du dossier « ${nd.name} » ouvert`)}/* i18n-ok : nom de dossier, traduit sur place */
  boot()}
async function startFresh(){const c=await idb.get('data'),d=await idb.get('dir');
  if(c&&!d&&!confirm("Le carnet actuel n'est enregistré que dans ce navigateur et sera remplacé par un nouveau carnet. Exporte-le d'abord (Exporter JSON) si tu veux le garder.\n\nContinuer ?"))return false;
  if(DB){clearTimeout(saveT);await persist()}
  DIR=null;NEEDPERM=false;await idb.set('dir',null);await setDEK(null);ENV=null;DB=migrate(null);i18nLocalizeDefaults(DB);DB.prefs.nouveautes_vues=APP_VERSION;touch();await afterLoad();return true}

function setStatus(s,msg){const el=$('status');el.className='status '+(s=='ok'?'':s);
  const h=new Date().toLocaleTimeString(LOC,{hour:'2-digit',minute:'2-digit'}),lockTxt=DEKK?' · chiffré':'';
  el.lastChild.textContent={ok:`Enregistré dans ${FILE}${lockTxt} · ${h}`,busy:'Enregistrement…',local:`Enregistré dans ce navigateur seulement${lockTxt} · ${h}`,err:msg||'Erreur'}[s];
  $('footInfo').textContent=DIR?`Dossier : ${DIR.name} · ${FILE} · copies automatiques dans /${BKDIR}`:'Aucun dossier relié';
}
function banner(kind){const b=$('banner');if(!kind){b.classList.add('hide');return}
  const M={nodir:['Tes saisies sont gardées dans ce navigateur uniquement. Choisis un dossier (idéalement synchronisé, OneDrive ou Drive) pour les enregistrer dans un fichier.','Choisir le dossier',()=>connectDir(false)],
   reconnect:['Le navigateur demande ton autorisation pour accéder au dossier de données. Choisis « Autoriser à chaque visite » pour ne plus avoir à le refaire.','Reconnecter le dossier',()=>connectDir(true)],
   old:['Cette version de l\'application est plus ancienne que celle qui a enregistré ton carnet : elle est en lecture seule pour protéger tes données.','Recharger',()=>location.reload()],
   nofs:['Ce navigateur ne sait pas enregistrer dans un fichier : utilise Chrome ou Edge sur ordinateur. En attendant, tes saisies sont gardées dans le navigateur ; exporte régulièrement.','Exporter JSON',exportJson]}[kind];
  $('bannerTxt').textContent=M[0];$('bannerBtn').textContent=M[1];$('bannerBtn').onclick=M[2];b.classList.remove('hide')}

/* ---------- export / import ---------- */
function download(name,text,type){const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([text],{type}));a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),2000)}
async function exportJson(){download(`coaching-data_export_${today()}.json`,JSON.stringify(await payload(),null,1),'application/json');if(DEKK)toast('Export chiffré avec ton mot de passe actuel')}
function exportCsv(){if(DEKK&&!confirm('L\'export CSV est lisible en clair (noms, commentaires). Continuer ?'))return;
  const q=v=>`"${String(v??'').replace(/"/g,'""')}"`,M=metrics();
  /* 3.0.0 : XP gagnés, XP non répartis, XP par compétence, commentaire des Facultés commerciales */
  const fc=fcMet(),head=['Date','Type','Personne','Durée (min)','Durée (h)','Commentaire','Notes','XP gagnés','XP non répartis',...M.map(m=>'XP '+m.l+(m.actif?'':' (archivée)')),(fc?fc.l:'Facultés commerciales')+' : commentaire','CR','Synthèse','Montant €','Engagement (mois)','Statut proposition','Coût €'];
  const L=[...E()].sort((a,b)=>a.date.localeCompare(b.date)).map(e=>[e.date,TM[e.type]?.l,pname(e.pid),e.dur,String(e.dur/60).replace('.',','),e.com,e.notes||'',xpEarned(e),Math.max(0,xpLeft(e)),...M.map(m=>e.xp?.[m.id]??''),e.fcom||'',e.cr?'oui':'',e.syn?'oui':'',e.eur??'',e.engagement_mois??'',e.statut?STAT[e.statut]:'',e.cout??'']);
  download(`coaching-saisies_${today()}.csv`,'﻿'+[head,...L].map(r=>r.map(q).join(';')).join('\r\n'),'text/csv')}
/* 2.4.0 : export des personnes (cercles, proximité, rythme, recommandé·e par) */
function exportCsvP(){if(DEKK&&!confirm('L\'export CSV est lisible en clair (noms, coordonnées). Continuer ?'))return;
  const q=v=>`"${String(v??'').replace(/"/g,'""')}"`,PXL={proche:'Proche',regulier:'Régulier',occasionnel:'Occasionnel'};
  const head=['Nom','Fonction','Étape','Cercles','Proximité','Rythme de contact (mois)','Recommandé·e ou présenté·e par','Recommandé·e / présenté·e','Provenance','Public','Problématique','Téléphone','E-mail','Site','Dernier contact','Prochain sujet à évoquer','Archivée'].map(TR);
  const L=[...DB.personnes].sort((a,b)=>byName(a.nom,b.nom)).map(p=>{const r=p.reco_par&&pById(p.reco_par.pid),l=lastContact(p.id);
   return[p.nom,p.titre||'',TR(ETL[stageOf(p)]),(p.cercles||[]).join(' ; '),TR(PXL[p.proximite||'regulier']),rythmeOf(p),r?r.nom:'',r?TR(p.reco_par.mode=='presente'?'présenté·e':'recommandé·e'):'',p.provenance||'',p.public||'',p.probl||'',p.tel||'',p.email||'',p.site||'',l?l.date:'',p.sujet||'',p.archive?TR('oui'):'']});
  download(`coaching-personnes_${today()}.csv`,'\ufeff'+[head,...L].map(r=>r.map(q).join(';')).join('\r\n'),'text/csv')}
$('expJson').onclick=exportJson;$('expCsv').onclick=exportCsv;$('expCsvP').onclick=exportCsvP;
$('impJson').onclick=()=>$('impFile').click();
$('impFile').onchange=async e=>{const f=e.target.files[0];e.target.value='';if(!f)return;let d;
  try{d=JSON.parse(await f.text())}catch(err){toast('Fichier JSON non reconnu');return}
  await importData(d)};
async function openDemo(){let d;try{const r=await fetch(LANG==='en'?'carnet-demo-en.json':'carnet-demo.json',{cache:'no-cache'});d=await r.json()}catch(err){toast("Le carnet de démonstration n'est pas disponible hors ligne");return}
  d.demo=true;d.demoLang=LANG;if(DB&&E().length&&!DB.demo&&!confirm("Ouvrir le carnet de démonstration remplacera ton carnet dans cette fenêtre. Exporte-le d'abord si besoin.\n\nContinuer ?"))return;
  if(DB&&!DB.demo){clearTimeout(saveT);await persist()}
  DIR=null;NEEDPERM=false;await idb.set('dir',null);await idb.set('data',null);await setDEK(null);ENV=null;DB=null;await importData(d)}
async function importData(d){
  if(!DB){const c=await idb.get('data'),dd=await idb.get('dir');if(c&&!dd&&!confirm("Le carnet actuel n'est enregistré que dans ce navigateur et sera remplacé. Continuer ?"))return;DIR=null;await idb.set('dir',null);await setDEK(null);ENV=null}
  if(isEnc(d)){const r=await askSecret({title:'Fichier chiffré',text:'Saisis le mot de passe de ce fichier, ou sa clé de secours.',cancelable:true,verify:(s,w)=>openEnv(d,s,w,!DEKK&&!DB)});if(!r)return;d=r.r}
  if(!d.entrees){toast('Fichier JSON non reconnu');return}
  if(DB&&E().length){
   if(compatBook(d,DB)&&confirm(`Récupérer dans ton carnet les saisies de ce fichier qui n'y sont pas ?\nRien n'est supprimé ni remplacé : c'est la bonne option pour retrouver des saisies perdues.\n\nOK = fusionner · Annuler = autres options`)){
    const m=mergeDB(DB,migrate(d));adoptDB(m.db);touch();await afterLoad();toast(`${m.added} saisie(s) récupérée(s)`);return}
   if(!confirm(`Remplacer entièrement ton carnet (${E().length} saisies) par ce fichier (${d.entrees.length} saisies) ?\nL'état actuel reste dans /${BKDIR}.`))return}
  const first=!DB;DB=migrate(d);closeWizard();touch();await afterLoad();if(first&&!d.entrees.length){openWizard(WZ.indexOf('ident'),true);toast('Modèle importé : ajuste-le à ta pratique')}else if(!d.demo)toast('Données importées');if(DB.demo){DB.prefs.nouveautes_vues=APP_VERSION;i18nLocalizeDefaults(DB);applyConfig();touch();renderAll()}demoBar();demoTourAuto()}
/* Visite du carnet de démonstration : 3 écrans d'introduction, puis 9 bulles sur l'interface */
const DTX={
fr:{side:['Bienvenue','La démarche','Le tour'],brand:'Carnet de Camille',brandSub:'Carnet de démonstration',quote:'Coacher beaucoup, pratiquer délibérément, développer mon activité',
 skip:'Passer et explorer librement',back:'Retour',next:'Continuer',go:"C'est parti",stop:'Arrêter la visite',suiv:'Suivant',step:(n,t)=>`Étape ${n} sur ${t}`,
 i1t:'Bienvenue dans le carnet de Camille',
 i1:`<p>Camille Martin est coach de managers depuis un peu plus d'un an. <b class="hl">Personnage fictif, données fictives</b> : tout ce que tu vois ici sert d'exemple.</p><p>Clique, ouvre, modifie : rien n'est enregistré. Ton propre carnet, si tu en crées un, démarre vide.</p><p>En deux minutes : la démarche qui sous-tend le carnet, puis un tour rapide des pages.</p>`,
 i2t:'La démarche : le coaching se vend par le coaching',
 cite:'Une démarche transmise par Gianni Bergandi et Magali Wagner (Odyssée), et par Rich Litvin.',
 i2a:`<p>Plutôt que de miser sur le marketing, le carnet t'aide à <b class="hl">multiplier les occasions de coacher</b>. Chaque conversation de coaching est à la fois de la pratique et la meilleure façon de faire connaître ton travail.</p>`,
 flow:[['Rencontrer','des gens, sans rien vendre'],['Inviter','à vivre une vraie conversation de coaching'],['Coacher','pour de vrai, une ou plusieurs fois, offert'],['Proposer',"un accompagnement, quand c'est juste"],['Accompagner','et en parler autour de toi']],
 i2b:`<p>Une invitation n'est pas une vente : l'autre est libre de dire non, et <b class="hl">chaque « non » compte comme un pas</b>. Le carnet suit tout cela, avec trois repères : coacher beaucoup, pratiquer délibérément, développer ton activité.</p>`,
 i3t:'Un tour rapide ?',
 i3:`<p>Une minute pour repérer les pages et les boutons utiles. Tu peux l'arrêter à tout moment et le relancer depuis le bandeau du bas.</p>`,
 c1:['Faire le tour','11 étapes, une minute'],c2:['Explorer librement','Tu découvres seul, à ton rythme'],
 t:[
  ['Enregistrer un temps',"Chaque moment de ta pratique, en quelques secondes : une rencontre, une invitation, une conversation, une séance, une supervision. C'est la seule saisie régulière."],
  ['Tes trois repères',"Heures de coaching, pratique délibérée et conversations : l'année en cours et les 31 derniers jours. La petite courbe montre la tendance."],
  ['Mes saisies',"Tout l'historique, à filtrer par type, par personne ou par période. Chaque temps se retrouve et se corrige ici."],
  ['Personnes',"Chaque personne rencontrée, invitée ou accompagnée a sa fiche. C'est ici que se voit le chemin de chacune."],
  ['À relancer',"Le carnet repère les personnes sans nouvelles depuis un moment, les accompagnements qui se terminent et les actions prévues. « Traiter » : c'est fait, une autre date, plus tard, ou un commentaire."],
  ['Relance au rythme',"Chaque personne a un rythme de contact, tous les 3 mois par défaut. Quand il est dépassé, elle revient ici, avec ses cercles et le sujet à reprendre. Entretenir ton réseau, sans rien vendre."],
  ['Préparer le contact',"« Préparer » ouvre l'onglet Notes de sa fiche : ce qu'il faut garder en tête, le prochain sujet à évoquer et les notes de vos derniers échanges."],
  ['Le chemin de chaque personne',"De la rencontre à l'accompagnement : chaque personne change de colonne à mesure que tu enregistres vos échanges. Le bouton « ? Les étapes » explique chaque colonne."],
  ['Le carnet de route',"Une mission à la fois pour prendre le carnet en main. Dans ton propre carnet, il te guide dès le premier jour."],
  ['Mon carnet',"Camille a tout activé. « Mon carnet » choisit les modules affichés : ① Coacher beaucoup (tableau de bord, objectifs), ② Affûter mes compétences (pratique délibérée, XP), ③ Créer mon activité (réseau, coûts), ④ Le jeu (fiche de coach, rang). « Essentiel » garde le suivi de tes entretiens et de tes personnes. Masquer un module ne fait rien perdre."],
  ['Ton réseau',"Avec le module « Créer mon activité », l'onglet Réseau dessine tes personnes autour de leurs cercles : la couleur dit l'étape, la taille le nombre d'échanges, les pointillés rouges qui relancer, le contour doré qui fait le pont entre deux cercles. À droite, ce que ton réseau montre : qui réchauffer, où inviter, qui remercier."],
  ['XP de pratique',"Avec le module « Affûter mes compétences », chaque entretien rapporte des XP selon sa durée et son type : une séance de 1h30, 18 XP. Tu les répartis entre les compétences travaillées ; chacune monte de niveau, la boussole montre où tu investis, et un transfert déplace des XP sans en créer."],
  ['À toi de jouer',"Explore librement : rien n'est enregistré. Quand tu le souhaites, « Créer mon propre carnet » démarre le tien, vide et rien qu'à toi. Pour revoir ce tour : « Revoir la visite », ici."]],
 openPeople:'Ouvrir Personnes',end:'Terminer'},
en:{side:['Welcome','The approach','The tour'],brand:"Camille's notebook",brandSub:'Demo notebook',quote:'Coach a lot, practise deliberately, grow my practice',
 skip:'Skip and explore freely',back:'Back',next:'Continue',go:"Let's go",stop:'Stop the tour',suiv:'Next',step:(n,t)=>`Step ${n} of ${t}`,
 i1t:"Welcome to Camille's notebook",
 i1:`<p>Camille Martin has been coaching managers for a little over a year. <b class="hl">Fictional character, fictional data</b>: everything you see here is an example.</p><p>Click, open, edit: nothing is saved. Your own notebook, if you create one, starts empty.</p><p>In two minutes: the approach behind the notebook, then a quick tour of the pages.</p>`,
 i2t:'The approach: coaching sells through coaching',
 cite:'An approach taught by Gianni Bergandi and Magali Wagner (Odyssée), and by Rich Litvin.',
 i2a:`<p>Rather than betting on marketing, the notebook helps you <b class="hl">create more opportunities to coach</b>. Every coaching conversation is both practice and the best way to make your work known.</p>`,
 flow:[['Meet','people, without selling anything'],['Invite','them to experience a real coaching conversation'],['Coach','for real, once or several times, for free'],['Propose','an engagement, when it is right'],['Accompany','and talk about it around you']],
 i2b:`<p>An invitation is not a sale: the other person is free to say no, and <b class="hl">every “no” counts as a step</b>. The notebook tracks all of it, with three markers: coach a lot, practise deliberately, grow your practice.</p>`,
 i3t:'A quick tour?',
 i3:`<p>One minute to find the useful pages and buttons. You can stop it at any time and restart it from the bar at the bottom.</p>`,
 c1:['Take the tour','11 steps, one minute'],c2:['Explore freely','Discover on your own, at your pace'],
 t:[
  ['Log time','Every moment of your practice, in a few seconds: a meeting, an invitation, a conversation, a session, a supervision. It is the only regular entry.'],
  ['Your three markers','Coaching hours, deliberate practice and conversations: the current year and the last 31 days. The small curve shows the trend.'],
  ['My entries','Your whole history, filtered by type, person or period. Every logged time can be found and corrected here.'],
  ['People','Everyone you meet, invite or accompany has a profile. This is where each person’s path shows.'],
  ['To follow up','The notebook spots people you have not heard from in a while, engagements coming to an end and planned actions. “Handle”: done, another date, later, or a comment.'],
  ['Follow-up at your pace','Each person has a contact frequency, every 3 months by default. When it is overdue, they come back here, with their circles and the topic to pick up. Keeping your network alive, without selling anything.'],
  ['Prepare the contact','“Prepare” opens the Notes tab of their profile: what to keep in mind, the next topic to raise and the notes from your last exchanges.'],
  ["Each person's path","From first meeting to engagement: each person moves from one column to the next as you log your exchanges. The “? The stages” button explains each column."],
  ['The roadmap','One mission at a time to get to grips with the notebook. In your own notebook, it guides you from day one.'],
  ['My notebook','Camille has everything switched on. “My notebook” picks the modules on display: ① Coach a lot (dashboard, goals), ② Sharpen my skills (deliberate practice, XP), ③ Build my practice (network, costs), ④ The game (coach profile, rank). “Essentials” keeps the tracking of your sessions and your people. Hiding a module loses nothing.'],
  ['Your network',"With the “Build my practice” module, the Network tab draws your people around their circles: colour shows the stage, size the number of exchanges, red dots who to follow up, a gold outline who bridges two circles. On the right, what your network shows: who to warm up, where to invite, who to thank."],
  ['Practice XP','With the “Sharpen my skills” module, every session earns XP based on its length and type: a 1h30 session earns 18 XP. You assign them to the skills you worked on; each skill levels up, the compass shows where you invest, and a transfer moves XP without creating any.'],
  ['Your turn','Explore freely: nothing is saved. Whenever you like, “Create my own notebook” starts yours, empty and yours alone. To see this tour again: “Replay the tour”, here.']],
 openPeople:'Open People',end:'Finish'}};
const DT={on:false,kind:null,i:0,choice:'tour',full:false};
const dtX=()=>DTX[typeof LANG!=='undefined'&&LANG==='en'?'en':'fr'];
const dtFirstTab=()=>[...document.querySelectorAll('.tabs button[data-tab]')].find(b=>b.offsetParent)?.dataset.tab||'dash';
function dtRoot(){let r=$('dtour');if(!r){r=document.createElement('div');r.id='dtour';r.setAttribute('data-noi18n','');document.body.appendChild(r);
  addEventListener('resize',()=>DT.on&&DT.kind==='tip'&&dtPlace());addEventListener('scroll',()=>DT.on&&DT.kind==='tip'&&dtPlace(),true);
  addEventListener('keydown',e=>{if(DT.on&&e.key==='Escape')dtClose()})}return r}
function dtClose(){DT.on=false;DT.kind=null;const r=$('dtour');if(r)r.innerHTML='';document.body.classList.remove('dt-lock')}
function dtIntro(i=0){DT.on=true;DT.kind='intro';DT.i=i;const X=dtX(),r=dtRoot();document.body.classList.add('dt-lock');
 const body=i===0?X.i1:i===1?`${CITE?`<p class="dt-cite">${X.cite}</p>`:''}${X.i2a}<div class="dt-flow">${X.flow.map(f=>`<div><b>${f[0]}</b><span>${f[1]}</span></div>`).join('<i>→</i>')}</div>${X.i2b}`
  :`${X.i3}<div class="dt-ch"><button class="${DT.choice==='tour'?'on':''}" data-c="tour"><b>${X.c1[0]}</b><span>${X.c1[1].replace(/\d+/,dtVis().length)}</span></button><button class="${DT.choice==='free'?'on':''}" data-c="free"><b>${X.c2[0]}</b><span>${X.c2[1]}</span></button></div>`;
 r.innerHTML=`<div class="dt-veil"></div><div class="dt-wrap"><div class="dt-card" role="dialog" aria-modal="true"><div class="dt-side"><div class="dt-brand"><div class="ini">CM</div><div><b>${X.brand}</b><span>${X.brandSub}</span></div></div>
  <ul class="dt-steps">${X.side.map((x,j)=>`<li class="${j<i?'ok':j==i?'cur':''}"><b>${j<i?'✓':j+1}</b>${x}</li>`).join('')}</ul><div class="dt-q">${X.quote}</div></div>
  <div class="dt-main"><h2>${[X.i1t,X.i2t,X.i3t][i]}</h2>${body}<div class="dt-foot">${i>0?`<button class="dt-bk" id="dtBack">${X.back}</button>`:''}<a href="#" id="dtSkip">${X.skip}</a><button class="dt-go" id="dtGo">${i<2?X.next:X.go}</button></div></div></div></div>`;
 $('dtSkip').onclick=e=>{e.preventDefault();dtClose()};if($('dtBack'))$('dtBack').onclick=()=>dtIntro(i-1);
 r.querySelectorAll('.dt-ch button').forEach(b=>b.onclick=()=>{DT.choice=b.dataset.c;dtIntro(2)});
 $('dtGo').onclick=()=>{if(i<2)dtIntro(i+1);else if(DT.choice==='tour')dtTour(0);else dtClose()};$('dtGo').focus()}
/* bulles : sel = élément éclairé ; pre = action avant affichage */
const DTS=[
 {sel:'#openLog',pre:()=>{goTab(dtFirstTab());scrollTo(0,0)}},
 {sel:'#kpisM',pre:()=>{if(!$('kpisM')?.offsetParent)goTab('metrics');scrollTo(0,0)}},
 {sel:'.tabs button[data-tab=list]',pre:()=>{goTab('list');scrollTo(0,0)}},
 {sel:'.tabs button[data-tab=people]',btn:'openPeople'},
 {sel:'#ppRelCard',pre:()=>{dtFicheX();goTab('people');scrollTo(0,0)}},
 {sel:'#ppRelList .rel[data-k=ryt]',pre:()=>{dtFicheX();goTab('people');const e=document.querySelector('#ppRelList .rel[data-k=ryt]');if(e)scrollTo(0,e.getBoundingClientRect().top+scrollY-160)}},
 {sel:'#pfM .pftab.on .gold',pre:()=>{goTab('people');const R=relItems().filter(y=>y.k=='ryt'),x=R.find(y=>y.p.notes)||R[0];if(x)openFiche(x.p.id,'notes')}},
 {sel:'#ppPipe',pre:()=>{dtFicheX();goTab('people');const e=$('ppPipe');if(e)scrollTo(0,e.getBoundingClientRect().top+scrollY-110)},big:true},
 {sel:'#qOpen',pre:()=>{goTab(dtFirstTab());scrollTo(0,0)}},
 {sel:'#modBtn',pre:()=>{dtFicheX();goTab(dtFirstTab());scrollTo(0,0)}},
 {sel:'#netSvg',mod:'activite',big:true,pre:()=>{dtFicheX();goTab('reseau');const e=$('netView');if(e)scrollTo(0,e.getBoundingClientRect().top+scrollY-90)}},
 {sel:'#pdXpCard',mod:'competences',big:true,pre:()=>{dtFicheX();goTab('pd');const e=$('pdXpCard');if(e)scrollTo(0,e.getBoundingClientRect().top+scrollY-90)}},
 {sel:'#demoBar',last:true}];
/* 3.2.0 : une bulle marquée mod n'apparaît que si son module est affiché (onglets Réseau et Pratique délibérée) */
const dtVis=()=>DTS.filter(s=>!s.mod||MOD(s.mod));
const dtFicheX=()=>{if($('pfM')?.classList.contains('show'))closeFiche()};
function dtTour(i=0,dir=1){if(DTS[i]?.mod&&!MOD(DTS[i].mod)){dtTour(i+dir,dir);return}DT.on=true;DT.kind='tip';DT.i=i;dtRoot();document.body.classList.add('dt-lock');const s=DTS[i];
 if(s.pre)try{s.pre()}catch(e){}requestAnimationFrame(()=>requestAnimationFrame(dtDraw))}
function dtDraw(){const X=dtX(),i=DT.i,s=DTS[i],r=$('dtour');const V=dtVis(),n=V.length,vi=Math.max(0,V.indexOf(s));
 let t=X.t[i][0],p=X.t[i][1],btns;
 if(s.btn)btns=`<button id="dtPrev">${X.back}</button><button class="p" id="dtNext">${X[s.btn]}</button>`;
 else btns=`${i>0?`<button id="dtPrev">${X.back}</button>`:''}<button class="p" id="dtNext">${s.last?X.end:X.suiv}</button>`;
 const stop=s.last?'':`<a href="#" id="dtStop">${X.stop}</a>`;
 r.innerHTML=`<div class="dt-catch"></div><div class="dt-hole" id="dtHole"></div><div class="dt-tip" id="dtTip" role="dialog"><div class="k">${X.step(vi+1,n)}</div><h3>${t}</h3><p>${p}</p><div class="b">${stop||'<span></span>'}${btns}</div></div>`;
 dtPlace();
 if($('dtStop'))$('dtStop').onclick=e=>{e.preventDefault();dtClose()};
 if($('dtPrev'))$('dtPrev').onclick=()=>dtTour(i-1,-1);
 $('dtNext').onclick=()=>{if(s.last){dtClose();return}dtTour(i+1)};$('dtNext').focus()}
function dtPlace(){const s=DTS[DT.i],el=document.querySelector(s.sel),h=$('dtHole'),tp=$('dtTip');if(!h||!tp)return;
 const W=innerWidth,H=innerHeight,pad=8,g=16;
 if(!el||!el.getClientRects().length){h.style.display='none';tp.style.left=Math.max(16,(W-tp.offsetWidth)/2)+'px';tp.style.top=Math.max(16,(H-tp.offsetHeight)/2)+'px';return}
 const r=el.getBoundingClientRect();let x=r.left-pad,y=r.top-pad,w=r.width+2*pad,hh=r.height+2*pad;
 if(s.big){hh=Math.min(hh,H-y-100)}
 Object.assign(h.style,{display:'block',left:x+'px',top:y+'px',width:w+'px',height:hh+'px'});
 const tw=tp.offsetWidth,th=tp.offsetHeight;let L,T;
 if(s.big){L=x+w-tw-20;T=y+hh-th-20}
 else{const right=r.left+r.width/2>W/2;L=right?x+w-tw:x;
  if(y+hh+g+th<H-8)T=y+hh+g;else if(y-g-th>8)T=y-g-th;else{T=Math.max(16,(H-th)/2);L=right?x-g-tw:x+w+g}}
 tp.style.left=Math.min(Math.max(L,16),W-tw-16)+'px';tp.style.top=Math.min(Math.max(T,16),H-th-16)+'px'}
/* 3.1.0 : captures du site (tools/captures.py). ?demo=1&shot=<clé> ouvre la démo dans un état précis, sans visite,
   bandeau ni messages, puis pose html[data-shot=ready]. Clés : SHOTS ci-dessous. Sans effet hors du carnet de démonstration. */
const SHOT=(()=>{try{return new URLSearchParams(location.search).get('shot')||''}catch(e){return ''}})();
const SHOTS={dash:{tab:'dash'},log:{tab:'dash',log:1,wait:1500},coach:{tab:'coach'},practice:{tab:'pd'},xp:{tab:'pd',sel:'#pdXpCard'},
 funnel:{tab:'metrics',sel:'#mFunnel'},pipeline:{tab:'people',ess:1},reseau:{tab:'reseau',wait:2500}};
async function demoShot(){const k=SHOTS[SHOT],w=ms=>new Promise(r=>setTimeout(r,ms));dtClose();document.body.classList.add('shot');
 DB.prefs.modules=modsAll(!k.ess);DB.prefs.simple=!!k.ess;applyMode();goTab(k.tab);await w(400);if(k.log)openM();
 const e=k.sel&&document.querySelector(k.sel);if(e)e.scrollIntoView({block:'start'});else scrollTo(0,0);
 await w(k.wait||600);document.documentElement.dataset.shot='ready'}
function demoTourAuto(){if(!DB?.demo)return;if(SHOT&&SHOTS[SHOT]){demoShot();return}if(DT.on){DT.kind==='intro'?dtIntro(DT.i):dtTour(DT.i);return}
 let seen=false;try{seen=sessionStorage.getItem('cdc-tour')==='1';sessionStorage.setItem('cdc-tour','1')}catch(e){}
 if(!seen)dtIntro(0)}

function demoBar(){let b=$('demoBar');if(!DB?.demo){b&&b.remove();return}if(!b){b=document.createElement('div');b.id='demoBar';b.className='demobar';b.innerHTML='<b>Carnet de démonstration</b><span>Camille Martin est un personnage fictif.</span><button id="demoNew">Créer mon propre carnet</button><button id="demoTour" class="lnk">Revoir la visite</button>';document.body.appendChild(b);$('demoTour').onclick=()=>dtIntro(0);$('demoNew').onclick=async()=>{if(!confirm('Quitter le carnet de démonstration et créer ton propre carnet ?'))return;clearTimeout(saveT);DB=null;await idb.set('data',null);location.reload()}}}
$('chDir').onclick=()=>FS_OK?connectDir(false):toast('Utilise Chrome ou Edge pour relier un dossier');
$('expModel').onclick=()=>{const c=JSON.parse(JSON.stringify(CFG()));c.nom='Mon cabinet';c.logo=null;c.bandeau=null;
  download(`modele-suivi-coaching_${today()}.json`,JSON.stringify({version_schema:VERSION,enregistre_le:'',config:c,personnes:[],entrees:[],objectifs:{},priorites:[],actions:[],prefs:{}},null,1),'application/json')};

