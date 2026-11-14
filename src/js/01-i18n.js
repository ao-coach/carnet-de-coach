/* ---------- langue : couche de traduction FR → EN ----------
   Le code et le HTML sont écrits en français. En anglais, chaque texte affiché est traduit à la volée :
   les nombres, montants et dates deviennent des jetons {0}, {1}… ; les libellés de types, compétences
   et noms de personnes deviennent des jetons {e0}… ; la phrase normalisée est cherchée dans I18N_EN. */
let LANG=(()=>{try{const q=new URLSearchParams(location.search).get('lang');if(q==='fr'||q==='en'){localStorage.setItem('cdc-lang',q);return q}
 const s=localStorage.getItem('cdc-lang');if(s==='fr'||s==='en')return s}catch(e){}return (navigator.language||'fr').slice(0,2)==='fr'?'fr':'en'})();
let LOC=LANG==='en'?'en-GB':'fr-FR';
const MO_FR=['Jan','Fév','Mar','Avr','Mai','Juin','Juil','Août','Sep','Oct','Nov','Déc'],MO_EN=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const MOL_FR=['janvier','février','mars','avril','mai','juin','juillet','août','septembre','octobre','novembre','décembre'],MOL_EN=['January','February','March','April','May','June','July','August','September','October','November','December'];
/* changement de langue à chaud : pas de rechargement, le carnet reste déverrouillé */
function setLang(l){if(l===LANG)return;try{localStorage.setItem('cdc-lang',l)}catch(e){}
 try{const u=new URL(location.href);if(u.searchParams.has('lang')){u.searchParams.delete('lang');history.replaceState(null,'',u.toString())}}catch(e){}
 LANG=l;LOC=l==='en'?'en-GB':'fr-FR';try{MO.splice(0,12,...(l==='en'?MO_EN:MO_FR));MOL.splice(0,12,...(l==='en'?MOL_EN:MOL_FR))}catch(e){}
 I18N.on=l==='en'||I18N.collect;document.documentElement.lang=l;
 if(I18N.on){i18nNode(document.body);document.title=TR(I18N_TITLE)}else{i18nRestore(document.body);document.title=I18N_TITLE}
 document.querySelectorAll('.langsw [data-lg]').forEach(b=>b.classList.toggle('on',b.dataset.lg===LANG));
 try{if(typeof DB!=='undefined'&&DB){if(DB.demo&&DB.demoLang&&DB.demoLang!==l){openDemo();return}renderAll();if(typeof renderAbout==='function'&&TAB==='about')renderAbout()}
  if(!document.getElementById('wiz').classList.contains('hide'))renderWiz()}catch(e){}}
let I18N_TITLE=document.title;
const I18N={on:LANG==='en'||/i18ncollect/.test(location.search),collect:/i18ncollect/.test(location.search),keys:new Map(),miss:new Map()};
const MOS=[...new Set('janvier|février|avril|juillet|septembre|octobre|novembre|décembre|january|february|march|april|june|july|august|september|october|november|december|janv|févr|mars|avr|mai|juin|juil|août|sept|oct|nov|déc|fév|sep|jan|feb|mar|apr|may|jun|jul|aug|dec'.split('|'))].sort((a,b)=>b.length-a.length).join('|');
const I18N_NUM=new RegExp(`(?:\\d{1,2}(?:er)? (?:${MOS})\\.?(?![a-zà-ÿ])(?: \\d{4}| \\d{2}(?!\\d))?)|(?:(?:${MOS}) \\d{4})|€\\s?-?\\d{1,3}(?:[\\u202f\\u00a0,.]\\d{3}|\\s(?=\\d{3}(?!\\d))\\d{3})*(?:[.,]\\d+)?(?!\\d)|-?\\d{1,3}(?:[\\u202f\\u00a0,.]\\d{3}|\\s(?=\\d{3}(?!\\d))\\d{3})*(?:[.,]\\d+)?(?!\\d)\\s?€|[+−-]?\\d{1,3}(?:[\\u202f\\u00a0,.]\\d{3}|\\s(?=\\d{3}(?!\\d))\\d{3})*(?:[.,]\\d+)?(?!\\d)|\\d+`,'gi');
let I18N_DEFTL=null;
function i18nEntities(){const E=[];try{if(typeof DB!=='undefined'&&DB){const C=DB.config||{};Object.values(C.types||{}).forEach(t=>t?.l&&E.push(t.l));
 try{(I18N_DEFTL=I18N_DEFTL||Object.values(defaultConfig().types).map(t=>t.l)).forEach(l=>E.push(l))}catch(e){}(C.metriques||[]).forEach(m=>{m?.l&&E.push(m.l);m?.min&&E.push(m.min);m?.max&&E.push(m.max);m?.disc&&E.push(m.disc)});(DB.personnes||[]).forEach(p=>{if(p?.nom){E.push(p.nom);const f=p.nom.split(/\s+/)[0];if(f&&f.length>2)E.push(f)}});
 (C.finances?.lignes||[]).forEach(x=>x?.l&&E.push(x.l));if(C.nom)E.push(C.nom);if(C.outil)E.push(C.outil);if(DB.coach?.nom)E.push(DB.coach.nom)}}catch(e){}
 return [...new Set(E.filter(x=>x&&x.trim().length>1))].sort((a,b)=>b.length-a.length)}
let I18N_ENT=null,I18N_ENTK='';
function i18nEntRe(){const E=i18nEntities(),k=E.join('\u0001');if(k!==I18N_ENTK){I18N_ENTK=k;I18N_ENT=E.length?{re:new RegExp(E.map(x=>x.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')).join('|'),'g')}:null}return I18N_ENT}
function i18nNorm(s){const nums=[];let k=s.replace(I18N_NUM,m=>{nums.push(m);return `{${nums.length-1}}`});const ents=[];const R=i18nEntRe();
 if(R&&k.length<400)k=k.replace(R.re,m=>{ents.push(m);return `{e${ents.length-1}}`});return{k,nums,ents}}
function i18nNumEn(v){if(v==null)return v;v=String(v);let m=v.match(/^(-?[\d\s\u202f\u00a0.,]+?)\s?€$/);if(m)return '€'+i18nNumEn(m[1].trim());
 if(/^\d{1,3}([\s\u202f\u00a0]\d{3})+(,\d+)?$/.test(v))return v.replace(/,/,'.').replace(/[\s\u202f\u00a0]/g,',');
 if(/^\d+,\d{1,2}$/.test(v))return v.replace(',','.');return v}
function i18nFill(tpl,nums,ents){return tpl.replace(/\{(e?)(\d+)\}/g,(m,e,i)=>e?(ents[+i]!=null?(I18N_EN[ents[+i]]||ents[+i]):m):(nums[+i]!=null?i18nNumEn(nums[+i]):m))}
/* traduit une chaîne (texte affiché, message, attribut) */
function TR(s){if(!I18N.on||s==null)return s;const str=String(s);const lead=str.match(/^\s*/)[0],trail=str.match(/\s*$/)[0],core=str.trim();if(!core||!/[A-Za-zÀ-ÿ]/.test(core))return s;
 if(I18N.collect){const n=i18nNorm(core);if(I18N_EN[core]===undefined&&I18N_EN[n.k]===undefined)I18N.keys.set(n.k,core);return s}
 if(I18N_EN[core]!=null)return lead+I18N_EN[core]+trail;
 const n=i18nNorm(core);const tp=I18N_EN[n.k];if(tp!=null)return lead+i18nFill(tp,n.nums,n.ents)+trail;
 /* une phrase de plusieurs segments séparés par « · » */
 if(core.includes(' · ')){const parts=core.split(' · ');const tr=parts.map(p=>{const x=TR(p);return x});if(tr.some((x,i)=>x!==parts[i]))return lead+tr.join(' · ')+trail}
 I18N.miss.set(n.k,core);return s}
const I18N_SKIP=new Set(['SCRIPT','STYLE','TEXTAREA','CODE','PRE']);
const I18N_EURO=/^(\s*)(-?\d[\d.,\u202f\u00a0 ]*?)\s?€(\s*)$/;
function i18nPost(t){return t.replace(/«\s?/g,'“').replace(/\s?»/g,'”')}
const I18N_DONE=new WeakMap(),I18N_ORIG=new WeakMap();
function i18nNode(n){if(!I18N.on)return;if(n.nodeType===3){const p=n.parentNode;if(!p||I18N_SKIP.has(p.nodeName)||p.closest?.('[data-noi18n],[contenteditable]'))return;
  if(I18N_DONE.get(n)===n.data)return;I18N_ORIG.set(n,n.data);let t=n.data;const eu=LANG==='en'&&t.match(I18N_EURO);if(eu)t=eu[1]+'€'+i18nNumEn(eu[2].trim())+eu[3];else{t=TR(t);if(LANG==='en'&&t.includes('«'))t=i18nPost(t)}if(t!==n.data)n.data=t;I18N_DONE.set(n,n.data);return}
 if(n.nodeType!==1||n.nodeName==='SCRIPT'||n.nodeName==='STYLE'||n.hasAttribute('data-noi18n'))return;
 for(const a of ['title','placeholder','aria-label','alt','data-tip']){const v=n.getAttribute(a);if(v&&n['__i18n_'+a]!==v){n['__i18n_o_'+a]=v;const t=TR(v);n['__i18n_'+a]=t;if(t!==v)n.setAttribute(a,t)}}
 if(n.nodeName==='INPUT'&&(n.type==='button'||n.type==='submit')&&n.value){const t=TR(n.value);if(t!==n.value)n.value=t}
 if(I18N_SKIP.has(n.nodeName))return;for(let c=n.firstChild;c;c=c.nextSibling)i18nNode(c)}
function i18nRestore(n){if(n.nodeType===3){if(I18N_ORIG.has(n)&&I18N_DONE.get(n)===n.data){n.data=I18N_ORIG.get(n)}I18N_DONE.delete(n);return}
 if(n.nodeType!==1||n.nodeName==='SCRIPT'||n.nodeName==='STYLE')return;
 for(const a of ['title','placeholder','aria-label','alt','data-tip']){if(n['__i18n_o_'+a]!=null&&n.getAttribute(a)===n['__i18n_'+a])n.setAttribute(a,n['__i18n_o_'+a]);delete n['__i18n_'+a];delete n['__i18n_o_'+a]}
 for(let c=n.firstChild;c;c=c.nextSibling)i18nRestore(c)}
function i18nStart(){I18N_TITLE=document.title;document.documentElement.lang=LANG;if(I18N.on){i18nNode(document.body);document.title=TR(document.title)}
 new MutationObserver(ms=>{if(!I18N.on)return;for(const m of ms){if(m.type==='childList')m.addedNodes.forEach(i18nNode);else if(m.type==='characterData')i18nNode(m.target);else if(m.type==='attributes')i18nNode(m.target)}})
  .observe(document.body,{subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:['title','placeholder','aria-label','alt']});
 if(window.__i18nDlg)return;window.__i18nDlg=1;const oc=window.confirm.bind(window),oa=window.alert.bind(window),op=window.prompt.bind(window);
 window.confirm=m=>oc(String(m).split('\n').map(x=>TR(x)).join('\n'));window.alert=m=>oa(String(m).split('\n').map(x=>TR(x)).join('\n'));window.prompt=(m,d)=>op(String(m).split('\n').map(x=>TR(x)).join('\n'),d)}

/* un nouveau carnet (ou le carnet de démonstration) en anglais : libellés par défaut traduits */
function i18nLocalizeDefaults(db){if(LANG!=='en'||!db?.config)return;const c=db.config;
 Object.values(c.types||{}).forEach(t=>{if(t?.l&&I18N_EN[t.l])t.l=I18N_EN[t.l]});
 (c.metriques||[]).forEach(m=>['l','min','max'].forEach(k=>{if(m?.[k]&&I18N_EN[m[k]])m[k]=I18N_EN[m[k]]}));
 ['outil','sousTitre'].forEach(k=>{if(c[k]&&I18N_EN[c[k]])c[k]=I18N_EN[c[k]]})}

