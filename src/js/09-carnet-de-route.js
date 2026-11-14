/* =========================================================
   1.9.0 : carnet de route (missions), célébrations, victoires illustrées
   ========================================================= */
const QS=()=>{const p=DB.prefs;if(!p.q||typeof p.q!='object')p.q={};const q=p.q;q.done=q.done||{};q.f=q.f||{};q.ch=q.ch||{};return q};
const qFlag=k=>{if(!DB)return;const q=QS();if(!q.f[k]){q.f[k]=today();touch()}};
const CHAP=[{k:'pas',t:'Premiers pas',hf:'Premiers pas'},{k:'act',t:'Développer ton activité',hf:'Sur les rails'},{k:'pd',t:'Pratiquer délibérément',hf:'En pratique',full:1},{k:'pil',t:'Piloter',hf:'Aux commandes',full:1}];
const ANY=f=>E().some(f);
const QUESTS=[
 {id:'entry',c:'pas',t:'Enregistrer ton premier entretien',w:"Le geste de chaque jour : le type, la durée, la personne. Moins de 30 secondes.",ok:()=>E().length>0,sel:'#openLog',how:"Après chaque entretien, ce bouton. Essaie avec ton dernier rendez-vous."},
 {id:'person',c:'pas',t:'Relier un entretien à une personne',w:"Pour suivre chaque parcours, de l'invitation au contrat.",ok:()=>ANY(e=>e.pid!=null),sel:'#openLog',how:"Dans la saisie, choisis la personne, ou « + Nouvelle » pour la créer."},
 {id:'notes',c:'pas',t:'Écrire une note sur l\'entretien',w:"Ce que tu veux garder en mémoire, en quelques lignes.",ok:()=>ANY(e=>e.notes&&e.notes.trim()),sel:'#openLog',how:"Dans la saisie, la zone « Notes sur l'entretien ». Facultative, mais précieuse."},
 {id:'metrics',c:'pas',t:'Regarder ton suivi d\'activité',w:"Ton temps passé et tes indicateurs, d'un coup d'œil.",ok:()=>!!QS().f.metrics,tab:'metrics',sel:'.tabs [data-tab=metrics]',how:"Ton temps passé chaque mois, et tes indicateurs principaux."},
 {id:'fiche',c:'pas',t:'Ouvrir la fiche d\'une personne',w:"Tout son parcours au même endroit.",ok:()=>!!QS().f.fiche,tab:'people',sel:'#ppPipe .pcard, #ppList .ppc',how:"Clique sur une carte pour ouvrir sa fiche : coordonnées, échanges, contrat."},
 {id:'dir',c:'pas',t:'Choisir où ranger ton carnet',w:"Un seul fichier chez toi, sauvegardé tout seul.",ok:()=>!!DIR,sel:'#bannerBtn',tab:'settings',alt:'#setStore',how:"Choisis un dossier, idéalement synchronisé (OneDrive, Drive) : ton carnet y sera enregistré en continu."},
 {id:'enc',c:'pas',t:'Protéger ton carnet',w:"Un mot de passe, et une clé de secours en cas d'oubli.",ok:()=>!!DEKK,tab:'settings',sel:'#setSec',how:"Paramètres > Sécurité > Activer le chiffrement. Garde bien ta clé de secours."},
 {id:'pipe',c:'act',t:'Comprendre ton pipeline',w:"Le chemin d'une personne, de la rencontre au contrat.",ok:()=>!!QS().f.pipe,act:()=>openPipe()},
 {id:'netc',c:'act',t:'Enregistrer un contact réseau',w:"Un café, un événement, un appel : entretenir ton réseau, sans rien vendre.",ok:()=>ANY(e=>e.type=='reseau'&&e.pid!=null),sel:'#openLog',how:"Type Rencontre réseau, avec la personne : qui, dans quel contexte, ce qui s'est dit."},
 {id:'ryth',c:'act',t:'Donner un rythme à une personne',w:"Tous les mois, tous les 3 mois, une fois par an : elle revient dans « À relancer » quand c'est le moment.",ok:()=>!!QS().f.rythme,tab:'people',sel:'#ppPipe .pcard, #ppList .ppc',how:"Ouvre sa fiche : « Rythme de contact », dans l'onglet Infos."},
 {id:'reseau',c:'act',full:1,t:'Regarder ton réseau',w:"Tes personnes autour de leurs cercles : qui fait le pont, quel groupe réchauffer, où inviter.",ok:()=>!!QS().f.reseau,tab:'reseau',sel:'.tabs [data-tab=reseau]',how:"L'onglet Réseau, en mode complet : un clic sur un point ouvre la fiche, un clic sur un groupe le met en avant."},
 {id:'inv',c:'act',t:'Enregistrer une invitation',w:"Proposer une conversation : le geste qui nourrit tout le reste.",ok:()=>ANY(e=>e.type=='invitation'),sel:'#openLog',how:"Chaque fois que tu proposes à quelqu'un de découvrir le coaching : type Invitation."},
 {id:'prop',c:'act',t:'Envoyer une proposition',w:"Le montant, les séances, la durée d'engagement.",ok:()=>ANY(e=>e.type=='proposition'),sel:'#openLog',how:"Type Proposition : le montant, le nombre de séances, la durée. Elle part « En attente »."},
 {id:'propend',c:'act',t:'Suivre une proposition jusqu\'au bout',w:"Acceptée ou refusée : ton entonnoir se met à jour.",ok:()=>ANY(e=>e.type=='proposition'&&e.statut&&e.statut!='attente'),tab:'people',sel:'#ppRelCard',how:"Dans « À relancer », note la réponse : Acceptée ou Refusée."},
 {id:'full',c:'act',simple:1,t:'Découvrir le mode complet',w:"XP de pratique, fiche de coach, objectifs, coûts : quand tu te sens prêt.",ok:()=>!!QS().f.full,sel:'#modeBtn',how:"Ce bouton bascule en mode complet. Tu peux revenir au mode simplifié quand tu veux."},
 {id:'profile',c:'pd',t:'Compléter ton profil de coach',w:"Ta fiche, ton rang, ton niveau : ton carnet à ton image.",ok:()=>!!(CO().nom&&CO().titre),tab:'coach',sel:'#coEditBtn',how:"Ta photo, ton titre, ton micro-pitch, ta formation, ton parcours."},
 {id:'comp3',c:'pd',t:'Nommer au moins 3 compétences que tu travailles',w:"Trois pour que ta boussole prenne forme ; davantage si tu veux.",ok:()=>mActive().filter(m=>!m.fc).length>=3,prog:()=>`${Math.min(3,mActive().filter(m=>!m.fc).length)} / 3`,tab:'pd',sel:'#pd [data-mets]',how:"Les compétences entre lesquelles tu répartiras tes XP après tes entretiens : à toi de les nommer."},
 {id:'xp1',c:'pd',t:'Répartir tes premiers XP',w:"Dis quelles compétences tu as travaillées : chacune gagne des XP et monte de niveau.",ok:()=>ANY(e=>xpPut(e)>0),sel:'#openLog',how:"Dans la saisie, bloc « XP de pratique » : + et − pour chaque compétence, ou « Tout sur le focus ». Ce qui n'est pas réparti t'attend dans Mes saisies."},
 {id:'focus',c:'pd',t:'Choisir ton premier focus',w:"Ce que tu travailles en ce moment, en tête de chaque saisie.",ok:()=>PD().focus.length>0,tab:'pd',sel:'#pdSide .pdfcs',how:"Choisis jusqu'à 3 compétences à travailler en ce moment."},
 {id:'action',c:'pd',t:'Créer ta première action',w:"Un geste précis à tenter à chaque séance.",ok:()=>actsCours().length>0,tab:'pd',sel:'#pdSide [data-addact], #pdSide [data-lib]',how:"Un geste précis et observable, vérifié à chaque saisie concernée."},
 {id:'rem',c:'pd',t:'Noter une remarque et la retenir',w:"Ta matière pour la prochaine supervision.",ok:()=>ANY(e=>e.rem&&Object.values(e.rem).some(r=>r&&r.sup)),sel:'#openLog',how:"Dans la saisie, sous un focus : « Ce que j'ai remarqué », puis « Retenir pour la prochaine supervision »."},
 {id:'sup',c:'pd',t:'Enregistrer une supervision préparée',w:"Ce que tu en retiens revient dans tes compétences.",ok:()=>ANY(e=>e.retours&&e.retours.length),tab:'pd',sel:'#pdSupCard',how:"Après la supervision, écris ce que tu retiens sous chaque remarque, puis « Enregistrer la supervision »."},
 {id:'kpi',c:'pil',t:'Choisir tes indicateurs',w:"Peu d'indicateurs, regardés souvent.",ok:()=>!!QS().f.kpi||JSON.stringify(CFG().kpis)!=JSON.stringify(KPI_DEFAULT),tab:'dash',sel:'#dash [data-kcat]',how:"Jusqu'à 6 indicateurs ; les 3 premiers sont les principaux."},
 {id:'obj',c:'pil',t:'Fixer ton objectif prioritaire',w:"Ton cap pour les mois qui viennent.",ok:()=>DB.priorites.length>0,tab:'dash',sel:'#prioCard',how:"Un à trois objectifs, pas plus : c'est ce qui donne le cap."},
 {id:'cost',c:'pil',t:'Renseigner tes coûts',w:"Pour connaître ton vrai taux horaire.",ok:()=>(CFG().finances.lignes||[]).length>0||+CFG().finances.urssaf>0||+CFG().finances.supDefaut>0,tab:'settings',sel:'#setFin',how:"Tes coûts annuels, ton taux URSSAF, le prix moyen d'une supervision."}];
const qAvail=q=>SIMPLE()?(!CHAP.find(c=>c.k==q.c).full&&!q.full):!q.simple;
const qOfChap=c=>QUESTS.filter(q=>q.c==c&&qAvail(q));
function qCheck(silent){if(!DB||READONLY)return;const Q=QS();let ch=false,news=[];
 QUESTS.forEach(q=>{if(!Q.done[q.id]){let ok=false;try{ok=q.ok()}catch(e){}if(ok){Q.done[q.id]=today();ch=true;if(!silent&&qAvail(q))news.push(q)}}});
 CHAP.forEach(c=>{const L=qOfChap(c.k);if(L.length&&!Q.ch[c.k]&&L.every(q=>Q.done[q.id])){Q.ch[c.k]=today();ch=true}});
 if(ch)touch();
 if(news.length&&!silent){const q=news[0],nx=qNext();toastQuest(q,nx)}}
function qNext(){for(const c of CHAP){const L=qOfChap(c.k);if(!L.length)continue;const n=L.find(q=>!QS().done[q.id]);if(n)return n}return null}
function qChapCur(){for(const c of CHAP){const L=qOfChap(c.k);if(L.length&&L.some(q=>!QS().done[q.id]))return c}return null}
function toastQuest(q,nx){const t=$('qToast');t.innerHTML=`<div class="m">✓</div><div><b>Mission accomplie : ${esc(q.t.charAt(0).toLowerCase()+q.t.slice(1))}</b><span>${nx?'Prochaine mission : '+esc(nx.t.charAt(0).toLowerCase()+nx.t.slice(1)):'Carnet de route terminé : bravo !'}</span></div>`;
 t.classList.add('show');clearTimeout(t._t);t._t=setTimeout(()=>t.classList.remove('show'),4200)}
function qInit(){if(!DB)return;const Q=QS();if(!Q.init){Q.init=today();if(E().length){qCheck(true);Q.open=false}else Q.open=true;touch()}else qCheck(true);renderQuest()}
function renderQuest(){const box=$('qp');if(!DB||READONLY){box.innerHTML='';return}const Q=QS(),c=qChapCur();
 if(Q.hide||!c||!$('wiz').classList.contains('hide')){box.innerHTML='';return}
 const L=qOfChap(c.k),dn=L.filter(q=>Q.done[q.id]).length,cur=L.find(q=>!Q.done[q.id]),pct=Math.round(dn/L.length*100),ci=CHAP.filter(x=>qOfChap(x.k).length).indexOf(c),nxC=CHAP.filter(x=>qOfChap(x.k).length)[ci+1];
 if(!Q.open){box.innerHTML=`<button class="qpill" id="qOpen" title="Carnet de route"><i style="background:conic-gradient(#D9B66A 0 ${pct}%,rgba(255,255,255,.18) 0)"><span>${dn}/${L.length}</span></i>Carnet de route</button>`;$('qOpen').onclick=()=>{Q.open=true;touch();renderQuest()};return}
 box.innerHTML=`<div class="qpanel"><div class="qh"><b>Carnet de route</b><span>${dn} / ${L.length}</span><button class="qx" id="qMin" title="Replier">–</button></div>
  <div class="qch"><div class="t"><span>Chapitre ${ci+1} · ${c.t}</span><span>${pct} %</span></div><div class="qbar"><i style="width:${pct}%"></i></div></div>
  ${L.map(q=>{const d=Q.done[q.id],isC=q===cur;return `<div class="qi ${d?'done':''} ${isC?'cur':''}" data-q="${q.id}"><span class="c">${d?'✓':''}</span><div>${isC?`<b>${esc(q.t)}</b>${q.prog?` <em>${q.prog()}</em>`:''}<small>${esc(q.w)}</small><button class="qgo" data-go="${q.id}">Montre-moi →</button>`:`<span class="qt">${esc(q.t)}</span>${q.prog&&!d?` <em>${q.prog()}</em>`:''}`}</div></div>`}).join('')}
  <div class="qf"><span>${nxC?'Ensuite : '+nxC.t:'Dernier chapitre'}</span><button class="lnk0" id="qHide">Masquer</button></div></div>`;
 $('qMin').onclick=()=>{Q.open=false;touch();renderQuest()};
 $('qHide').onclick=()=>{Q.hide=true;touch();renderQuest();toast('Carnet de route masqué : tu peux le réafficher dans Paramètres > Parcours de démarrage')};
 box.querySelectorAll('[data-go]').forEach(b=>b.onclick=e=>{e.stopPropagation();showMe(QUESTS.find(q=>q.id==b.dataset.go))});
 box.querySelectorAll('.qi:not(.cur) .qt').forEach(s=>s.onclick=()=>showMe(QUESTS.find(q=>q.id==s.closest('.qi').dataset.q)))}
/* projecteur « Montre-moi » */
function spotOff(){$('spot').classList.remove('show');$('spotB').classList.remove('show');document.removeEventListener('click',spotClick,true);window.removeEventListener('scroll',spotOff);window.removeEventListener('resize',spotOff)}
function spotClick(){setTimeout(spotOff,0)}
function showMe(q){if(!q)return;spotOff();if(q.act){q.act();return}
 if(q.tab&&TAB!=q.tab&&!(SIMPLE()&&['dash','coach','pd'].includes(q.tab)))goTab(q.tab);
 setTimeout(()=>{const vis=el=>el&&el.getClientRects().length&&getComputedStyle(el).visibility!='hidden';
  let el=[...document.querySelectorAll(q.sel||'#none')].find(vis);if(!el&&q.alt)el=[...document.querySelectorAll(q.alt)].find(vis);if(!el&&q.tab)el=document.querySelector(`.tabs [data-tab=${q.tab}]`);if(!vis(el))return;
  el.scrollIntoView({block:'center',behavior:'instant'});
  setTimeout(()=>{const r=el.getBoundingClientRect(),s=$('spot'),b=$('spotB'),pad=6;Object.assign(s.style,{left:(r.left-pad)+'px',top:(r.top-pad)+'px',width:(r.width+pad*2)+'px',height:(r.height+pad*2)+'px'});s.classList.add('show');
   const L=qOfChap(q.c),i=L.indexOf(q)+1;b.innerHTML=`<div class="k">Mission ${i} sur ${L.length} · ${esc(CHAP.find(c=>c.k==q.c).t)}</div><b>${esc(q.t)}</b><p>${esc(q.how||q.w)}</p><div class="act">Clique où tu veux pour continuer</div>`;
   const bw=330,below=r.bottom+14+170<innerHeight;b.style.left=Math.max(12,Math.min(innerWidth-bw-12,r.left+r.width/2-bw/2))+'px';b.style.top=(below?r.bottom+16:Math.max(12,r.top-16-170))+'px';b.classList.add('show');
   setTimeout(()=>{document.addEventListener('click',spotClick,true);window.addEventListener('scroll',spotOff,{once:true});window.addEventListener('resize',spotOff,{once:true})},50)},60)},q.tab?120:0)}
/* écran « Comprendre ton pipeline » */


/* ---------- célébrations ---------- */
let CELS=null,CELT=0,CELQ=[];
const HFDESC=k=>{if(String(k).startsWith('ch_'))return "Un chapitre du carnet de route bouclé : tu maîtrises une nouvelle part de l'outil.";if(k=='victoire')return '';const m=String(k).match(/^([a-z_]+?)(\d+)?$/),f=m?m[1]:'',n=m&&m[2]?+m[2]:0;
 return({ses:n==1?"Ta première séance sous contrat : le coaching devient ton métier.":"Des séances qui s'enchaînent : la pratique s'installe.",h:"Les heures font le coach : chacune compte.",pers:"Autant de personnes qui t'ont fait confiance.",
  cli:n==1?"Ton premier client payant : le cap que beaucoup de coachs mettent des mois à franchir.":"Des contrats signés : ton activité prend racine.",ca:"Te faire payer pour ton coaching : la preuve que ta valeur est reconnue.",
  wk:"La régularité, ton meilleur allié.",delib:"Revenir sur sa pratique, c'est ce qui transforme l'expérience en compétence.",sup:n==1?"Ta première supervision : tu n'es plus seul·e face à ta pratique.":"Te faire superviser, encore et encore : la marque des coachs qui progressent.",
  inv:"Inviter, encore et encore : c'est ce qui nourrit tout le reste.",non:n==1?"Ton premier non : la preuve que tu as osé proposer.":"Le oui vit au pays du non : ceux qui reçoivent le plus de non font le plus de propositions.",acq:"Un geste devenu naturel : la pratique délibérée porte ses fruits.",ch_:"Un chapitre du carnet de route bouclé : tu maîtrises une nouvelle part de l'outil."})[f]||'Un pas de plus sur ton chemin de coach.'};
function celSnap(){if(!DB||SIMPLE())return null;try{const R=coachStats().flatMap(g=>g.s),L={};R.forEach(r=>L[r[2]]={l:r[0],L:rowLvl(r).L,v:r[1],u:r[3],x:rowLvl(r)});const g=coachLevel(),H=hautsFaits().got.filter(x=>!x.man),hf={};H.forEach(x=>hf[x.k]=x);return{L,g:g.L,rk:rangOf(g.L),hf}}catch(e){return null}}
function celCheck(){const s=celSnap();if(!s||!CELS){CELS=s;return}const o=CELS;CELS=s;if(DB.prefs.anim===false)return;
 const nh=Object.keys(s.hf).filter(k=>!o.hf[k]).map(k=>s.hf[k]),ups=Object.keys(s.L).filter(k=>o.L[k]&&s.L[k].L>o.L[k].L).map(k=>s.L[k]);
 nh.slice(0,3).forEach(x=>CELQ.push(()=>cel3(x,nh.length>3&&x===nh[2]?nh.length-3:0)));
 if(s.g>o.g)CELQ.push(()=>cel2(s.g,s.rk!=o.rk?s.rk:null));
 if(ups.length)CELQ.push(()=>cel1(ups));
 if(!$('cel2').classList.contains('show')&&!$('cel3').classList.contains('show'))celNext()}
function celNext(){const f=CELQ.shift();if(f)f()}
function cel1(ups){const b=$('cel1');b.innerHTML=ups.slice(0,4).map(x=>`<div class="c1r"><div class="t"><b>${esc(x.l)}</b><em>Niv. ${x.L} ↑</em></div><div class="bar"><i></i></div><small>${x.L>=100?'niveau maximum':`niveau suivant à ${fmtV(Math.ceil(x.x.next-1e-9),x.u)}${x.u}`}</small></div>`).join('');
 b.classList.remove('show');void b.offsetWidth;b.classList.add('show');clearTimeout(b._t);b._t=setTimeout(()=>{b.classList.remove('show');celNext()},4600)}
const confetti=()=>Array.from({length:14},(_,i)=>`<i style="left:${4+i*7}%;background:${['#D9B66A','#822239','#2F8C93','#508AA8'][i%4]};animation-delay:${(i*.23)%2}s"></i>`).join('');
function cel2(L,rk){const m=$('cel2');m.innerHTML=`<div class="c2"><div class="conf">${confetti()}</div><div class="k">Niveau supérieur</div><div class="ring"><span>${L}</span></div><b>Tu passes niveau ${L}</b><p>La moyenne de tes statistiques progresse.</p>${rk?`<span class="rk">Nouveau rang : ${esc(rk)}</span><br>`:''}<button class="cta" id="c2ok">Continuer</button></div>`;
 m.classList.add('show');$('c2ok').onclick=()=>{m.classList.remove('show');celNext()}}
function cel3(x,more){const m=$('cel3');m.innerHTML=`<div class="rays"></div><div class="c3"><div class="medal t-${x.tier}" ${x.img?`style="background:url('${x.img}') center/cover"`:''}>${x.img?'':esc(String(x.ic))}</div><div class="k">Haut fait débloqué · ${TIERS[x.tier]}</div><b>${esc(x.t)}</b><p>${esc(x.desc||HFDESC(x.k))}</p>${more?`<p style="color:#F1DCA4">et ${more} autre${more>1?'s':''} haut${more>1?'s':''} fait${more>1?'s':''} !</p>`:''}
 <div class="c3b"><button class="cta gold" id="c3ok">Continuer</button>${SIMPLE()?'':'<button class="lnk0" id="c3go">Voir ma fiche</button>'}</div></div>`;
 m.classList.add('show');$('c3ok').onclick=()=>{m.classList.remove('show');celNext()};const g=$('c3go');if(g)g.onclick=()=>{m.classList.remove('show');CELQ=[];goTab('coach');window.scrollTo({top:0})}}

/* ---------- victoires : image, titre, date, niveau, récit ---------- */
let VICE=null;
function openVic(i){const L=CO().victoires||(CO().victoires=[]);VICE=i==null?{i:null,v:{id:Date.now(),t:'',d:today(),tier:'or',desc:'',img:''}}:{i,v:{...L[i]}};renderVic();$('vicM').classList.add('show');setTimeout(()=>$('vicT')?.focus(),60)}
function renderVic(){const v=VICE.v;$('vicH').textContent=VICE.i==null?'Nouvelle victoire':'Ma victoire';
 $('vicB').innerHTML=`<div class="vrow"><button class="vimg" id="vicImg" style="${v.img?`background-image:url('${v.img}')`:''}">${v.img?'':'+ Image<br><small>photo, capture, souvenir</small>'}</button>
  <div><div class="lab2">Titre</div><input class="fin" id="vicT" value="${esc(v.t)}" placeholder="Ta victoire, en quelques mots">
   <div class="two2" style="margin-top:8px"><div><div class="lab2">Date</div><input type="date" class="fin" id="vicD" value="${esc(v.d||'')}"></div>
   <div><div class="lab2">Niveau</div><div class="tiers">${Object.entries(TIERS).map(([k,l])=>`<button class="${(v.tier||'or')==k?'on':''}" data-tier="${k}">${l}</button>`).join('')}</div></div></div></div></div>
  ${v.img?'<button class="lnk0" id="vicImgDel" style="font-size:12px;color:var(--grey);text-decoration:underline;margin-top:6px">Retirer l\'image</button>':''}
  <div class="lab2" style="margin-top:12px">Ce que c'était, pour t'en souvenir</div><textarea class="fin pdta" id="vicDesc" rows="4" placeholder="Le contexte, ce qui s'est passé, ce que ça a changé pour toi…">${esc(v.desc||'')}</textarea>
  <div style="display:flex;gap:10px;margin-top:14px;align-items:center">${VICE.i!=null?'<button class="btn2 warn" id="vicDel">Supprimer</button>':''}<button class="save" id="vicOk" style="margin:0 0 0 auto;width:auto;padding:10px 22px">${VICE.i==null?'Ajouter à mes hauts faits':'Enregistrer'}</button></div>`;
 $('vicT').oninput=e=>v.t=e.target.value;$('vicD').onchange=e=>v.d=e.target.value;$('vicDesc').oninput=e=>v.desc=e.target.value;
 $('vicB').querySelectorAll('[data-tier]').forEach(b=>b.onclick=()=>{v.tier=b.dataset.tier;renderVic()});
 $('vicImg').onclick=()=>$('vicFile').click();const d=$('vicImgDel');if(d)d.onclick=()=>{v.img='';renderVic()};
 const x=$('vicDel');if(x)x.onclick=()=>{if(!confirm('Supprimer cette victoire ?'))return;CO().victoires.splice(VICE.i,1);touch();$('vicM').classList.remove('show');VICE=null;renderAll();if($('coM').classList.contains('show'))renderCoEdit()};
 $('vicOk').onclick=()=>{if(!(v.t||'').trim()){toast('Donne un titre à ta victoire');return}v.t=v.t.trim();v.desc=(v.desc||'').trim();const L=CO().victoires;if(VICE.i==null)L.push(v);else L[VICE.i]=v;touch();$('vicM').classList.remove('show');
  const isNew=VICE.i==null;VICE=null;renderAll();if($('coM').classList.contains('show'))renderCoEdit();if(isNew&&DB.prefs.anim!==false&&!SIMPLE())cel3({ic:'★',t:v.t,tier:v.tier,k:'victoire',img:v.img,desc:v.desc},0)}}
$('vicX').onclick=()=>{$('vicM').classList.remove('show');VICE=null};
$('vicFile').onchange=e=>{const f=e.target.files[0];e.target.value='';if(!f)return;const fr=new FileReader();fr.onload=()=>{const im=new Image();im.onload=()=>{CRT='vic';CR.img=im;CR.z=1;CR.ox=0;CR.oy=0;$('crZoom').value=1;crDraw($('crCv'),300,true);$('cropM').classList.add('show')};im.onerror=()=>toast('Image non reconnue');im.src=fr.result};fr.readAsDataURL(f)};
function openVicD(i){const v=(CO().victoires||[])[i];if(!v)return;$('vicDB').innerHTML=`${v.img?`<img class="vdimg" src="${v.img}" alt="">`:''}<div class="vdk">${TIERS[v.tier||'or']} · victoire · ${v.d?dShort(v.d):''}</div><h3 class="vdt">${esc(v.t)}</h3>${v.desc?`<p class="vdp">${esc(v.desc).replace(/\n/g,'<br>')}</p>`:'<p class="vdp" style="color:var(--grey)">Pas encore de récit.</p>'}
 <div style="display:flex;justify-content:flex-end;margin-top:12px"><button class="btn2" id="vicDE">Modifier</button></div>`;$('vicDM').classList.add('show');$('vicDE').onclick=()=>{$('vicDM').classList.remove('show');openVic(i)}}
$('vicDX').onclick=()=>$('vicDM').classList.remove('show');

/* noms des auteurs de la démarche : affichés seulement avec ?cite=1 (en attente de leur accord) */
const CITE=(()=>{try{if(/[?&]cite=1/.test(location.search))localStorage.setItem('cdc-cite','1');return localStorage.getItem('cdc-cite')==='1'}catch(e){return /[?&]cite=1/.test(location.search)}})();
/* écran « Comprendre ton pipeline » : un manifeste, puis les étapes reliées aux saisies */
let PIPEP=0;
function openPipe(){PIPEP=0;renderPipeM();$('pipeM').classList.add('show')}
function renderPipeM(){const B=$('pipeB'),L=k=>esc(TM[k]?.l||k),TP=k=>TM[k]?`<span class="mf-tp" style="background:${TM[k].c};color:${tc(TM[k].c)}">${L(k)}</span>`:'';
 if(PIPEP==0){$('pipeH').textContent='Créer tes clients par la relation';
  B.innerHTML=`<div class="mf-lead">Pour trouver des clients, on conseille souvent aux coachs les réseaux sociaux, le contenu, le marketing. C'est une voie légitime, avec son prix : chaque méthode troque un inconfort contre un autre, et attirer évite de proposer, au risque d'attendre. Ce carnet suit une autre voie, ${CITE?"celle de Gianni Bergandi et Magali Wagner (Odyssée), et de Rich Litvin":"défendue par des coachs qui en vivent depuis des années"} : <b>le coaching se vend par le coaching</b>. Tu ne cherches pas à attirer, tu crées tes clients, une discussion à la fois.</div>
  <div class="mf">
   <div>${TP('reseau')}<i>1</i><b>Rencontrer, chaque jour</b><p>Une personne par jour avec qui tu connectes, c'est 365 dans l'année. Pour la relation, pas pour la transaction : sans le filtre de l'argent, tu vois toutes les autres raisons d'aller vers les gens.</p></div>
   <div>${TP('invitation')}<i>2</i><b>Aider sans rien attendre</b><p>Mets-toi en opportunité d'aider, partout, sans attendre de retour, et propose de faire découvrir le coaching. Tu plantes des graines : certaines germent trois semaines plus tard, d'autres trois ans après.</p></div>
   <div>${TP('conversation')}<i>3</i><b>Faire vivre le coaching</b><p>Raconter le coaching n'a jamais l'impact de le vivre. Une conversation de coaching est une vraie séance, dans un vrai cadre, pas un appel découverte.</p></div>
   <div><i>4</i><b>Choisir tes clients</b><p>La conversation sert les deux côtés : la personne découvre ton coaching, toi tu sens s'il serait juste de l'accompagner. Tu as besoin de clients, pas forcément de cette personne-là.</p></div>
   <div>${TP('proposition')}<i>5</i><b>Proposer, et demander</b><p>Une proposition se fait dans un rendez-vous dédié, jamais en fin de séance. Un non vaut pour ce moment-là. Et la recommandation ne s'attend pas : elle se demande.</p></div>
   <div>${TP('session')}<i>6</i><b>Un cycle, un prix juste</b><p>Tes clients viennent pour des enjeux forts : vous travaillez le fond plutôt que le seul court terme. Cela vous engage dans des cycles de coaching de plusieurs mois plutôt qu'à la séance, à un prix qui reflète cette valeur. Avec moins de clients payants, mais plus engagés dans leur transformation, tu gardes du temps pour faire découvrir le coaching.</p></div></div>
  <div class="mf-net"><b>Le socle : entretenir ton réseau.</b> Rencontrer ne s'arrête pas au premier café. Les personnes que tu connais déjà sont ton terrain le plus fertile : donne à chacune un rythme de contact, et le carnet te la rappelle dans « À relancer » quand c'est le moment, avec le sujet à reprendre. En mode complet, l'onglet Réseau montre tes cercles, les personnes qui font le pont entre eux, les groupes à réchauffer et ceux où personne n'a encore vécu une conversation de coaching.</div>
  <div class="mf-fun"><span>Les repères du carnet, pour un contrat signé</span><b>≈ 13 invitations</b>›<b>4 personnes en conversation</b>›<b>10 conversations</b>›<b>2 propositions</b>›<b>1 contrat</b></div>
  <div class="mf-note">Compte tes non autant que tes oui : ceux qui reçoivent le plus de non sont souvent ceux qui reçoivent le plus de oui, parce qu'ils ont fait le plus de propositions.</div>
  <div class="mf-f"><span></span><button class="cta" id="pipeNx" style="margin:0">Les étapes du pipeline →</button></div>`;
  $('pipeNx').onclick=()=>{PIPEP=1;renderPipeM();$('pipeM').querySelector('.modal').scrollTop=0};return}
 $('pipeH').textContent="Le chemin d'une personne, de la rencontre au contrat";
 const st=[[ETC.invite,'Invité·e',"Tu lui as proposé de découvrir le coaching. Avant cela, une personne rencontrée est un contact réseau : hors du pipeline, elle a sa fiche, ses cercles et son rythme de contact, et revient dans « À relancer » quand ce rythme est dépassé.",`${L('invitation')}, quand tu lui proposes une conversation. Une ${L('reseau')} seule ne la fait pas entrer dans le pipeline.`,"Elle avance dès ta première conversation avec elle."],
  ['#2F8C93','En conversation',"Elle vit ton coaching, lors d'un ou plusieurs échanges offerts (deux ou trois, c'est courant) : comprendre sa réalité et ses enjeux, puis une vraie séance. Une expérience, pas un appel découverte.",`${L('conversation')}, une par rendez-vous.`,"Annonce le chemin dès le début : si ça colle, une vraie séance, puis on parle des modalités."],
  ['var(--afb)','Proposition envoyée',"Tu lui as proposé un accompagnement, dans un rendez-vous dédié. Elle réfléchit : fixez ensemble une date de réponse.",`${L('proposition')} : le montant, les séances, la durée d'engagement.`,"Elle apparaît dans « À relancer ». Un non vaut pour ce moment-là, pour cette proposition-là."],
  ['var(--am)','Client.e',"Elle a dit oui : vous travaillez ensemble, sur un cycle dont la durée est fixée dans le contrat.",`La proposition passe à « Acceptée », puis une saisie ${L('session')} par séance.`,"Le contrat suit les séances faites et prévues."],
  ['var(--jet)','Accompagnement terminé',"Le contrat est fini.",`Rien à saisir : l'étape suit la fin du contrat. Un renouvellement = une nouvelle ${L('proposition')}.`,"Le bon moment pour un bilan, un renouvellement si vous le souhaitez tous les deux, et pour demander une recommandation."]];
 B.innerHTML=`<div class="hint" style="margin:0 0 14px">Dans l'onglet Personnes, chaque personne est à une étape. <b>L'étape change toute seule, au fil de tes saisies</b> ; tu peux aussi la choisir à la main dans sa fiche, ou glisser sa carte dans le pipeline.</div>
  <div class="pipe5">${st.map((s,i)=>`<div class="ps"><span class="n">${i+1}</span><span class="stp" style="background:${s[0]}">${s[1]}</span><p>${s[2]}</p><div class="pss"><b>Dans tes saisies</b>${s[3]}</div><small>${s[4]}</small></div>`).join('')}</div>
  <div class="pipe2"><div class="ps"><span class="stp" style="background:#C9727B">Sans suite</span><p>Pas de suite pour l'instant : elle sort des relances, sans disparaître. Une graine plantée peut germer des années plus tard.</p><div class="pss"><b>Dans tes saisies</b>la proposition passe à « Refusée », ou choisis l'étape à la main.</div></div>
   <div class="ps"><span class="stp" style="background:#8B78A8">Superviseur.e</span><p>La personne qui te supervise.</p><div class="pss"><b>Dans tes saisies</b>${L('supervision')}, avec cette personne.</div></div></div>
  <div class="mf-f"><button class="lnk0 mf-b" id="pipeBk">← Revenir à l'approche</button><button class="cta" id="pipeOk" style="margin:0">J'ai compris</button></div>`;
 $('pipeBk').onclick=()=>{PIPEP=0;renderPipeM()};
 $('pipeOk').onclick=()=>{$('pipeM').classList.remove('show');qFlag('pipe');renderAll()}}
$('pipeX').onclick=()=>{$('pipeM').classList.remove('show');if(PIPEP==1)qFlag('pipe');renderAll()};

$('ppHelp').onclick=openPipe;

/* ---------- rendu ---------- */
function renderAll(){
 if(!DB)return;applyMode();
 if(TAB=='dash'){bigKPI('kpisD');renderRel();renderPrio();renderActs();renderObj()}
 if(TAB=='pd')renderPD();
 if(TAB=='coach')renderCoach();
 if(CMP&&$('cmpM').classList.contains('show'))renderCmp();
 if(TAB=='metrics'){bigKPI('kpisM',true);smallKPI();renderYears();renderMonthly();renderBiz()}
 if(TAB=='list')renderList();
 if(TAB=='people')renderPeople();
 if(TAB=='reseau')renderNet();
 if(TAB=='settings')renderSettings();
 foldSums();
 if(DB.prefs.q&&DB.prefs.q.init)qCheck(false);renderQuest();
}

function goTab(t){document.querySelector(`.tabs button[data-tab="${t}"]`).click()}

