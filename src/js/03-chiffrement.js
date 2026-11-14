/* =========================================================
   CHIFFREMENT (Web Crypto, natif du navigateur)
   - une clé de données aléatoire (AES-256-GCM) chiffre tout le carnet ;
   - cette clé est elle-même chiffrée deux fois : par le mot de passe et par la clé de secours
     (dérivation PBKDF2-SHA256), ce qui permet de changer de mot de passe sans tout rechiffrer.
   ========================================================= */
const FMT='suivi-coaching-chiffre',ALGO='AES-256-GCM, clé dérivée PBKDF2-SHA256',IT_PWD=600000,IT_REC=200000;
const enc=new TextEncoder(),dec=new TextDecoder();
let DEK=null,DEKK=null,ENV=null;          // clé de données (en mémoire uniquement tant que le carnet est ouvert)
const isEnc=o=>o&&o.format===FMT;
function toB64(buf){let s='';const u=new Uint8Array(buf);for(let i=0;i<u.length;i+=0x8000)s+=String.fromCharCode.apply(null,u.subarray(i,i+0x8000));return btoa(s)}
function fromB64(s){const b=atob(s),u=new Uint8Array(b.length);for(let i=0;i<b.length;i++)u[i]=b.charCodeAt(i);return u}
async function kek(secret,salt,iter){const base=await crypto.subtle.importKey('raw',enc.encode(secret),'PBKDF2',false,['deriveKey']);
  return crypto.subtle.deriveKey({name:'PBKDF2',salt,iterations:iter,hash:'SHA-256'},base,{name:'AES-GCM',length:256},false,['encrypt','decrypt'])}
async function aesEnc(key,data){const iv=crypto.getRandomValues(new Uint8Array(12));return{iv:toB64(iv),ct:toB64(await crypto.subtle.encrypt({name:'AES-GCM',iv},key,data))}}
async function aesDec(key,o){return new Uint8Array(await crypto.subtle.decrypt({name:'AES-GCM',iv:fromB64(o.iv)},key,fromB64(o.ct)))}
async function setDEK(raw){DEK=raw;DEKK=raw?await crypto.subtle.importKey('raw',raw,'AES-GCM',false,['encrypt','decrypt']):null}
async function wrapWith(secret,iter){const salt=crypto.getRandomValues(new Uint8Array(16));return{salt:toB64(salt),iter,...await aesEnc(await kek(secret,salt,iter),DEK)}}
async function unwrap(secret,w){return aesDec(await kek(secret,fromB64(w.salt),w.iter),w)}
const normRec=s=>s.toUpperCase().replace(/[^A-Z2-7]/g,'');
function newRecoveryKey(){const A='ABCDEFGHIJKLMNOPQRSTUVWXYZ234567',b=crypto.getRandomValues(new Uint8Array(24));let s='';b.forEach(x=>s+=A[x&31]);return s.match(/.{4}/g).join('-')}
async function sealObj(obj){return{format:FMT,id:obj.id,version_schema:obj.version_schema,enregistre_le:obj.enregistre_le||'',algo:ALGO,cles:ENV.cles,donnees:await aesEnc(DEKK,enc.encode(JSON.stringify(obj)))}}
/* ouvre une enveloppe ; adopt=true : la clé devient celle de la session */
async function openEnv(env,secret,which,adopt){
  const raw=await unwrap(which=='secours'?normRec(secret):secret,env.cles[which]);
  const k=await crypto.subtle.importKey('raw',raw,'AES-GCM',false,['decrypt']);
  const plain=JSON.parse(dec.decode(await aesDec(k,env.donnees)));
  if(adopt){await setDEK(raw);ENV={cles:env.cles}}
  return plain}
async function tryCurrentKey(env){if(!DEKK)return null;try{return JSON.parse(dec.decode(await aesDec(DEKK,env.donnees)))}catch(e){return null}}

/* ---------- fenêtres de saisie de secret ---------- */
function askSecret({title,text,allowRec=true,cancelable=false,other=false,verify}){return new Promise(res=>{
  $('lkOther').classList.toggle('hide',!other);$('lkOther').onclick=()=>{$('lock').classList.add('hide');showWelcome(true)};
  let which='mdp';const L=$('lock'),P=$('lkPwd');
  const setMode=w=>{which=w;P.value='';$('lkErr').textContent='';P.type=w=='mdp'?'password':'text';
    P.placeholder=w=='mdp'?'Mot de passe':'Clé de secours (XXXX-XXXX-…)';$('lkRec').textContent=w=='mdp'?"J'ai oublié mon mot de passe : utiliser la clé de secours":'Revenir au mot de passe';setTimeout(()=>P.focus(),50)};
  $('lkTitle').textContent=title;$('lkTxt').textContent=text;$('lkRec').classList.toggle('hide',!allowRec);$('lkCancel').classList.toggle('hide',!cancelable);
  L.classList.toggle('dim',cancelable);L.classList.remove('hide');setMode('mdp');
  const go=async()=>{if(!P.value)return;$('lkGo').disabled=true;$('lkGo').textContent='Vérification…';
    try{const r=await verify(P.value,which);L.classList.add('hide');res({r,which})}catch(e){$('lkErr').textContent=which=='mdp'?'Mot de passe incorrect.':'Clé de secours incorrecte.';P.select()}
    $('lkGo').disabled=false;$('lkGo').textContent='Valider'};
  $('lkGo').textContent=cancelable?'Valider':'Déverrouiller';
  $('lkGo').onclick=go;P.onkeydown=e=>{if(e.key=='Enter')go()};
  $('lkRec').onclick=()=>setMode(which=='mdp'?'secours':'mdp');
  $('lkCancel').onclick=()=>{L.classList.add('hide');res(null)};
})}
function askNewPassword(title){return new Promise(res=>{const M=$('pwdM');$('pwTitle').textContent=title;$('pw1').value=$('pw2').value='';$('pwErr').textContent='';M.classList.remove('hide');setTimeout(()=>$('pw1').focus(),50);
  $('pwOk').onclick=()=>{const a=$('pw1').value,b=$('pw2').value;if(a.length<10){$('pwErr').textContent='Au moins 10 caractères.';return}if(a!==b){$('pwErr').textContent='Les deux saisies sont différentes.';return}M.classList.add('hide');res(a)};
  $('pw2').onkeydown=e=>{if(e.key=='Enter')$('pwOk').click()};
  $('pwCancel').onclick=()=>{M.classList.add('hide');res(null)}})}
function showRecoveryKey(key){return new Promise(res=>{$('recKey').textContent=key;$('recOk').checked=false;$('recClose').disabled=true;$('recClose').style.opacity=.5;$('recM').classList.remove('hide');
  $('recOk').onchange=()=>{$('recClose').disabled=!$('recOk').checked;$('recClose').style.opacity=$('recOk').checked?1:.5};
  $('recCopy').onclick=()=>{navigator.clipboard?.writeText(key);toast('Clé copiée')};
  $('recDl').onclick=()=>download(`cle-de-secours_${(CFG().nom||'carnet').replace(/\W+/g,'-')}_${today()}.txt`,`Clé de secours du carnet « ${CFG().nom} »\nCréée le ${today()}\n\n${key}\n\nElle permet de rouvrir coaching-data.json si le mot de passe est oublié.\nÀ conserver hors de l'ordinateur.`,'text/plain');
  $('recClose').onclick=()=>{$('recM').classList.add('hide');res()}})}

/* ---------- actions de sécurité ---------- */
async function enableEncryption(){
  const pwd=await askNewPassword('Activer le chiffrement');if(!pwd)return;
  toast('Chiffrement en cours…');await setDEK(crypto.getRandomValues(new Uint8Array(32)));
  const key=newRecoveryKey();ENV={cles:{mdp:await wrapWith(pwd,IT_PWD),secours:await wrapWith(normRec(key),IT_REC)}};
  DB.prefs.autolock=DB.prefs.autolock??15;touch();clearTimeout(saveT);await persist();
  const n=await encryptOldBackups();renderSettings();updLockBtn();
  await showRecoveryKey(key);toast(`Chiffrement activé${n?` · ${n} sauvegarde(s) chiffrée(s)`:''}`)}
async function changePassword(){
  const ok=await askSecret({title:'Mot de passe actuel',text:'Confirme ton mot de passe actuel.',allowRec:false,cancelable:true,verify:s=>unwrap(s,ENV.cles.mdp)});if(!ok)return;
  const pwd=await askNewPassword('Nouveau mot de passe');if(!pwd)return;
  ENV.cles.mdp=await wrapWith(pwd,IT_PWD);touch();toast('Mot de passe changé')}
async function newRecovery(){
  const ok=await askSecret({title:'Nouvelle clé de secours',text:'Confirme ton mot de passe. L\'ancienne clé de secours ne fonctionnera plus pour le fichier courant.',allowRec:false,cancelable:true,verify:s=>unwrap(s,ENV.cles.mdp)});if(!ok)return;
  const key=newRecoveryKey();ENV.cles.secours=await wrapWith(normRec(key),IT_REC);touch();await showRecoveryKey(key)}
async function disableEncryption(){
  const ok=await askSecret({title:'Désactiver le chiffrement',text:'Ton fichier redeviendra lisible en clair. Les sauvegardes déjà chiffrées le restent. Confirme ton mot de passe.',allowRec:false,cancelable:true,verify:s=>unwrap(s,ENV.cles.mdp)});if(!ok)return;
  await setDEK(null);ENV=null;touch();renderSettings();updLockBtn();toast('Chiffrement désactivé')}
async function lock(){if(!DEKK||!DB)return;clearTimeout(saveT);await persist();closeM();closeWizard();DB=null;await setDEK(null);ENV=null;$('main').style.visibility='hidden';boot()}
function updLockBtn(){$('lockBtn').classList.toggle('hide',!DEKK)}
$('lockBtn').onclick=lock;
let lastAct=Date.now();['mousemove','keydown','click','scroll','touchstart'].forEach(ev=>document.addEventListener(ev,()=>{lastAct=Date.now()},{passive:true}));
setInterval(()=>{const m=DB?.prefs?.autolock??15;if(DEKK&&DB&&m&&Date.now()-lastAct>m*60000)lock()},20000);

