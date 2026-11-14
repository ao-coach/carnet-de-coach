/* =========================================================
   FICHE COACH (1.6.0) : identité, rang, niveaux, boussole, statistiques
   ========================================================= */
const CO=()=>DB.coach;
const w3=(f,m,i)=>({f,m,i})[CO().genre||'i']??i;
/* échelle des niveaux : ancienneté équivalente d'un coach régulier (années), par niveau.
   Chaque statistique est rapportée au rythme annuel d'un coach régulier : niveau = ancienneté qu'il lui faudrait pour l'atteindre. */
const LVY=[[0,0],[1,1/52],[5,1/12],[10,2/12],[15,4/12],[20,.5],[25,1],[30,1.5],[40,3],[50,5],[60,8],[70,12],[80,17],[90,23],[100,30]];
const yAt=L=>{for(let i=1;i<LVY.length;i++)if(L<=LVY[i][0]){const[a,ya]=LVY[i-1],[b,yb]=LVY[i];return ya+(yb-ya)*(L-a)/(b-a)}return 30};
/* rythme d'un coach régulier : [1re année, croisière (atteinte en 2 ans de montée progressive)] */
const RAMP={h:[300,300],conv:[60,60],pers:[36,30],ses:[80,200],delib:[400,100],suph:[24,12],inv:[80,100],prop:[12,12],cli:[6,10]};
const cumY=(V1,Vs,t)=>t<=1?V1*t:t<=3?V1+V1*(t-1)+(Vs-V1)*(t-1)**2/4:3*V1+(Vs-V1)+Vs*(t-3);
/* CA : paliers symboliques jusqu'à 5 000 € cumulés, puis meilleur CA sur 12 mois glissants */
const CAP=[[0,0],[2,1],[3,100],[4,200],[5,500],[6,800],[7,1000],[8,1500],[10,3000],[12,5000],[15,10000],[20,20000],[25,30000],[28,45000],[33,60000],[40,80000],[50,100000],[60,120000],[70,150000],[80,180000],[90,220000],[100,300000]];
const interpT=(T,L)=>{for(let i=1;i<T.length;i++)if(L<=T[i][0]){const[a,va]=T[i-1],[b,vb]=T[i];return va+(vb-va)*(L-a)/(b-a)}return T.at(-1)[1]};
const CURVES={};Object.entries(RAMP).forEach(([k,[a,b]])=>CURVES[k]=Array.from({length:101},(_,L)=>cumY(a,b,yAt(L))));CURVES.ca=Array.from({length:101},(_,L)=>interpT(CAP,L));
function lvlOf(v,k){const c=CURVES[k];v=+v||0;if(v<=0)return{L:0,pct:0,next:c[1],cont:0};let L=0;while(L<100&&c[L+1]<=v+1e-9)L++;
 const lo=c[L],hi=c[Math.min(100,L+1)],fr=L>=100?0:Math.max(0,Math.min(1,(v-lo)/(hi-lo)));
 const loD=Math.ceil(lo-1e-9),hiD=Math.ceil(hi-1e-9),fd=hiD>loD?Math.max(0,Math.min(1,(v-loD)/(hiD-loD))):fr;return{L,pct:L>=100?100:Math.round(fd*100),next:hi,cont:L+fr}}
function caInfo(A){const cum=A.reduce((s,e)=>s+(+e.eur||0),0)+avN('ca');
 if(cum<5000){const x=lvlOf(cum,'ca');return{l:'CA cumulé',v:cum,x,nx:`prochain palier : ${fmtV(x.next,' €')} €`}}
 const S=[...A].sort(byDate),win=d=>S.filter(e=>e.date>addDays(d,-365)&&e.date<=d).reduce((s,e)=>s+(+e.eur||0),0);
 const rec=Math.max(0,...S.map(e=>win(e.date))),cur=win(today()),y=lvlOf(rec,'ca'),x=y.L<12?{L:12,pct:0,next:CURVES.ca[13],cont:12}:y;
 return{l:'CA sur 12 mois · ton record',v:rec,x,nx:`actuellement ${fmtV(cur,' €')} € (≈ ${fmtV(cur/12,' €')} € par mois) · niveau suivant à ${fmtV(x.next,' €')} €`}}
const rowLvl=r=>r[4]?.x||lvlOf(r[1],r[2]);
const RANGS=[[0,'Débutante','Débutant','Débutant·e'],[10,'Apprentie','Apprenti','Apprenti·e'],[20,'Praticienne','Praticien','Praticien·ne'],[30,'Praticienne confirmée','Praticien confirmé','Praticien·ne confirmé·e'],
 [40,'Praticienne aguerrie','Praticien aguerri','Praticien·ne aguerri·e'],[50,'Experte','Expert','Expert·e'],[60,'Experte reconnue','Expert reconnu','Expert·e reconnu·e'],[70,'Coach de référence','Coach de référence','Coach de référence'],
 [80,'Mentore','Mentor','Mentor·e'],[90,'Élite','Élite','Élite'],[100,'Légende','Légende','Légende']];
const rangOf=L=>{let r=RANGS[0];RANGS.forEach(x=>{if(L>=x[0])r=x});return w3(r[1],r[2],r[3])};
const MOL=[...(LANG==='en'?MOL_EN:MOL_FR)];
const moisAn=d=>d?MOL[+d.slice(5,7)-1]+' '+d.slice(0,4):'';
const firstCoachDate=()=>E().filter(e=>COACH.includes(e.type)).map(e=>e.date).sort()[0]||'';
function ageOf(d){if(!d)return null;const t=today();let a=+t.slice(0,4)-+d.slice(0,4);if(t.slice(5)<d.slice(5))a--;return a>=0&&a<120?a:null}
function anneesTxt(d){if(!d)return'';const ms=new Date(today()+'T12:00:00Z')-new Date(d+'T12:00:00Z'),y=ms/864e5/365.25;if(y<0)return'';
 if(y<1){const m=Math.max(1,Math.round(y*12));return `${m} mois de coaching`}const v=Math.floor(y*10)/10;return `${n1(v)} ${v<2?'année':'années'} de coaching`}
const fmtV=(v,u)=>u==' h'&&v<10?n1(v):Math.round(v).toLocaleString(LOC);
function coachStats(){const all=E(),c=t=>all.filter(e=>t.includes(e.type)),A=c(['proposition']).filter(e=>e.statut=='acceptee'&&+e.eur>0),CA=caInfo(A);
 return[{t:'Coacher beaucoup',c:'#822239',cj:'#F0124F',s:[['Heures de coaching',H(c(COACH))+avN('h'),'h',' h'],['Conversations',c(['conversation']).length+avN('conv'),'conv',''],['Séances',c(['session']).length+avN('ses'),'ses',''],['Personnes coachées',new Set(c(COACH).filter(e=>e.pid!=null).map(e=>e.pid)).size+avN('pers'),'pers','']]},
  {t:'Pratiquer délibérément',c:'#2F8C93',cj:'#00C2CC',s:[['Pratique délibérée',H(c(DELIB))+avN('delib'),'delib',' h'],['Supervision',H(c(['supervision']))+avN('suph'),'suph',' h']]},
  {t:"Développer l'activité",c:'#508AA8',cj:'#1186FF',s:[['Invitations',c(['invitation']).length+avN('inv'),'inv',''],['Propositions',c(['proposition']).filter(e=>+e.eur>0).length+avN('prop'),'prop',''],['Clients et renouvellements',A.length+avN('cli'),'cli',''],[CA.l,CA.v,'ca',' €',CA],...fcRow()]}]}
/* 3.0.0 : Facultés commerciales (XP des rencontres réseau, invitations et propositions, transferts compris), courbe commune des XP */
function fcRow(){const f=fcMet();if(!f)return[];const v=Math.max(0,xpTotals()[f.id]||0),x=xpLvl(v);
 return[[f.l,v,'fcxp',' XP',{x:{...x,cont:x.L+x.pct/100},nx:x.L>=100?'niveau maximum':`niveau suivant à ${fmtN(x.next)} XP`}]]}
/* niveau global = moyenne des niveaux des statistiques déjà saisies (une statistique entre dans la moyenne à sa première saisie) */
function coachLevel(){const L=coachStats().flatMap(g=>g.s).filter(r=>+r[1]>0).map(r=>rowLvl(r).cont),m=L.length?L.reduce((a,b)=>a+b,0)/L.length:0,n=Math.min(100,Math.floor(m+1e-9));return{L:n,pct:n>=100?100:Math.round((m-n)*100),moy:m}}

/* ---------- rendu de la fiche ---------- */
function coachHTML(){const C=CO(),jeu=C.theme=='jeu',me=coachLevel(),rk=rangOf(me.L),deb=C.debut||firstCoachDate(),age=ageOf(C.naissance);
 const nom=C.nom||'Ton nom',ini=(C.nom||'?').split(/\s+/).map(w=>w[0]).join('').slice(0,2).toUpperCase();
 const meta=[C.titre,age!=null?age+' ans':'',deb?`${anneesTxt(deb)} (depuis ${moisAn(deb)})`:''].filter(Boolean).map(esc).join(' · ');
 const PLUS='<button class="cfplus" data-coedit title="Modifier">+</button>';
 const chips=a=>(a||[]).filter(x=>x&&x.trim()).map(x=>`<span class="chip0">${esc(x)}</span>`).join(jeu?'':' · ');
 const photo=C.photo?`<img src="${C.photo}" alt="">`:`<span>${esc(ini)}</span>`;
 let ring='';if(jeu){const sz=146,sw=8,r=(sz-sw)/2,cc=2*Math.PI*r;ring=`<svg width="${sz}" height="${sz}" class="cfring"><defs><linearGradient id="cfrg" x1="0" x2="1"><stop offset="0" stop-color="#C9973F"/><stop offset="1" stop-color="#F1DCA4"/></linearGradient></defs><circle cx="${sz/2}" cy="${sz/2}" r="${r}" fill="none" stroke="rgba(255,255,255,.12)" stroke-width="${sw}"/><circle cx="${sz/2}" cy="${sz/2}" r="${r}" fill="none" stroke="url(#cfrg)" stroke-width="${sw}" stroke-dasharray="${cc*me.pct/100} ${cc}" stroke-linecap="round" transform="rotate(-90 ${sz/2} ${sz/2})"/></svg>`}
 const lvlTxt=me.L>=100?`Niveau <b>100</b>`:`Niveau <b>${me.L}</b> · moyenne de tes statistiques · niveau suivant : ${me.L+1}`;
 const head=`<div class="cfhd">
  <div class="cfav">${ring}<div class="cfph" data-coedit title="Modifier mon profil">${photo}</div>${jeu?`<span class="cflb"><span class="o"><span class="i">Niveau ${me.L}</span></span></span>`:''}</div>
  <div class="cfid"><div class="cfnm ${C.nom?'':'ph'}">${esc(nom)}</div>${meta?`<div class="cfmeta">${meta}</div>`:''}${C.pitch?`<div class="cfpitch">« ${esc(C.pitch)} »</div>`:`<div class="cfpitch ph" data-coedit>Ton micro-pitch, en une phrase…</div>`}</div>
  <div class="cfrk"><small>Rang</small><b>${esc(rk)}</b><div class="cflvl">${lvlTxt}</div><div class="cfbar"><i style="width:${me.pct}%"></i></div></div>
  <div class="cfcv"><span><span class="k">${jeu?'Diplômes':'Formation'}</span>${chips(C.formation)||'<em>à compléter</em>'}${PLUS}</span><span><span class="k">Parcours</span>${chips(C.parcours)||'<em>à compléter</em>'}${PLUS}</span></div></div>`;
 const M=mActive(),bous=M.length>=3?boussoleSVG(jeu?'jeu':'pro'):boussoleList();
 const bloc=`<div class="cfpanel"><div class="cfsh">Boussole de pratique <span>oriente la pratique délibérée · part des XP de chaque compétence · en pointillé : les 30 derniers jours</span><button class="cfmets" data-mets>Gérer mes compétences</button></div><div class="pdbx"><div class="cfbous">${bous}</div><div class="cfside">${pdSideHTML()}</div></div></div>`;
 const G=coachStats();
 const stats=`<div class="cfpanel cfstp"><div class="cfsh">Statistiques <span>depuis le début · chaque niveau correspond au rythme d'un coach régulier · ton niveau global est la moyenne des statistiques déjà saisies</span></div><div class="cfst">${G.map(gr=>{const col=jeu?gr.cj:gr.c,GS=gr.s.filter(r=>+r[1]>0),lv=GS.length?Math.round(GS.reduce((a,r)=>a+rowLvl(r).L,0)/GS.length):0;
  return `<div class="cfsg" style="--c:${col}"><h4>${jeu?'<i class="dot"></i>':''}${gr.t}${jeu?`<em>moy. Niv. ${lv}</em>`:''}</h4>${gr.s.map(r=>{const[l,v,f,u,M]=r,x=rowLvl(r);
   return `<div class="cfr"><span class="l">${l}</span><span class="vv"><span class="v">${fmtV(v,u)}${u}</span><span class="lv">Niv. ${x.L}</span></span><span class="bb"><i style="width:${Math.max(3,x.pct)}%"></i></span><span class="nx">${x.L>=100?'niveau maximum':!(+v>0)?'pas encore de saisie : hors moyenne':M?.nx||`niveau suivant à ${fmtV(Math.ceil(x.next-1e-9),u)}${u}`}</span></div>`}).join('')}</div>`}).join('')}</div></div>`;
 return `<div class="cf ${jeu?'jeu':'pro'}">${head}${bloc}${stats}${jeu?hautsFaitsHTML(true)+affinitesHTML(true):`<div class="cfcols">${hautsFaitsHTML(false)}${affinitesHTML(false)}</div>`}</div>`}
function renderCoach(){const C=CO();
 $('coTheme').querySelectorAll('button').forEach(b=>b.classList.toggle('on',b.dataset.th==(C.theme||'pro')));
 $('coEmpty').classList.toggle('hide',!!C.nom);
 $('coFiche').innerHTML=coachHTML();const R=$('coFiche');
 R.querySelectorAll('[data-coedit]').forEach(b=>b.onclick=()=>openCoEdit());R.querySelectorAll('[data-covic]').forEach(b=>b.onclick=()=>openVic(null));R.querySelectorAll('[data-vicd]').forEach(b=>b.onclick=()=>openVicD(+b.dataset.vicd));
 R.querySelectorAll('[data-hfall]').forEach(b=>b.onclick=()=>{HFALL=!HFALL;renderCoach()});
 R.querySelectorAll('.cfbous [data-cmp]').forEach(b=>b.onclick=()=>openCmp(b.dataset.cmp));
 bindPdSide(R.querySelector('.cfside'))}
$('coTheme').querySelectorAll('button').forEach(b=>b.onclick=()=>{CO().theme=b.dataset.th;touch();renderCoach()});
$('coEditBtn').onclick=$('coEmptyBtn').onclick=()=>openCoEdit();
$('logoBox').onclick=()=>{goTab('coach');window.scrollTo({top:0,behavior:'smooth'})};$('logoBox').title='Ma fiche de coach';

/* ---------- modifier le profil ---------- */
let CRT=null;
function openCoEdit(sec){renderCoEdit();$('coM').classList.add('show');if(typeof sec=='string'){const el=$('coS_'+sec);if(el)setTimeout(()=>el.scrollIntoView({behavior:'smooth',block:'start'}),60)}}
function renderCoEdit(){const C=CO(),fc=firstCoachDate();
 const list=k=>(C[k]||[]).map((x,i)=>`<div class="colr"><input class="fin" data-li="${k}" data-i="${i}" value="${esc(x)}"><button class="ibtn del" data-lx="${k}" data-i="${i}" title="Retirer">✕</button></div>`).join('');
 $('coB').innerHTML=`<div class="cophr"><div class="coph">${C.photo?`<img src="${C.photo}" alt="">`:'<span>Photo</span>'}</div><div><button class="btn2" id="coPh">${C.photo?'Changer la photo':'Ajouter une photo'}</button>${C.photo?' <button class="btn2 warn" id="coPhDel">Retirer</button>':''}</div></div>
  <div class="field"><label>Nom</label><input class="fin" data-co="nom" value="${esc(C.nom||'')}" placeholder="Prénom Nom"></div>
  <div class="field"><label>Titre</label><input class="fin" data-co="titre" value="${esc(C.titre||'')}" placeholder="Ton titre de coach"></div>
  <div class="two2"><div class="field"><label>Date de naissance</label><input type="date" class="fin" data-co="naissance" value="${esc(C.naissance||'')}"></div>
   <div class="field"><label>Début du coaching</label><input type="date" class="fin" data-co="debut" value="${esc(C.debut||'')}"><div class="hint" style="margin:4px 0 0">${fc?`Vide = ta première séance enregistrée (${dShort(fc)})`:'Vide = ta première séance enregistrée'}</div></div></div>
  <div class="field"><label>Micro-pitch</label><textarea class="fin" data-co="pitch" rows="2" placeholder="En une phrase : qui tu accompagnes, et vers quoi">${esc(C.pitch||'')}</textarea></div>
  <div class="field"><label>Accord des libellés</label><select class="sel" data-co="genre" style="margin-left:0">${[['f','Féminin (Praticienne confirmée)'],['m','Masculin (Praticien confirmé)'],['i','Inclusif (Praticien·ne confirmé·e)']].map(([v,l])=>`<option value="${v}" ${(C.genre||'i')==v?'selected':''}>${l}</option>`).join('')}</select></div>
  <div class="lab2" style="margin:14px 0 6px">Formation, diplômes et certifications</div>${list('formation')}<button class="addl" data-la="formation" style="margin-top:4px">+ Ajouter une formation</button>
  <div class="lab2" style="margin:14px 0 6px">Parcours</div>${list('parcours')}<button class="addl" data-la="parcours" style="margin-top:4px">+ Ajouter une expérience</button>
  <div class="lab2" id="coS_vic" style="margin:20px 0 4px">Mes victoires</div><div class="hint" style="margin:0 0 8px">Les réussites que l'outil ne peut pas compter seul : une promotion obtenue par un client, un premier dirigeant accompagné, une recommandation… Elles s'ajoutent à tes hauts faits.</div>
  ${(C.victoires||[]).map((v,i)=>`<div class="vli"><span class="vth" style="${v.img?`background-image:url('${v.img}')`:''}">${v.img?'':'★'}</span><div><b>${esc(v.t||'Sans titre')}</b><span>${TIERS[v.tier||'or']}${v.d?' · '+dShort(v.d):''}${v.desc?' · '+esc(v.desc.slice(0,60))+(v.desc.length>60?'…':''):''}</span></div><button class="lnk0" data-ve="${i}">modifier</button></div>`).join('')}
  <button class="addl" id="coVicAdd" style="margin-top:4px">+ Ajouter une victoire</button>
  <div class="lab2" id="coS_hist" style="margin:20px 0 4px">Reprendre ton historique</div>
  <div class="hint" style="margin:0 0 8px">Tu coachais avant d'utiliser l'outil ? Deux façons d'en tenir compte :</div>
  <div class="cohist"><b>1. Importer tes saisies</b> depuis un tableur (Excel : « Enregistrer sous » CSV). Colonnes reconnues : Date, Type, Durée, Personne, Commentaire, Montant, Statut. Les lignes déjà présentes sont ignorées.<div style="margin-top:8px;display:flex;gap:8px;flex-wrap:wrap"><button class="btn2" id="coCsvM">Télécharger le modèle</button><button class="btn2" id="coCsvI">Importer un fichier CSV</button></div></div>
  <div class="cohist"><b>2. Ou déclarer tes totaux</b> d'avant l'outil. Ils comptent dans ta fiche (niveaux, rang, hauts faits), pas dans tes indicateurs ni tes graphiques.
   <div class="avg">${[['h','Heures de coaching'],['ses','Séances'],['conv','Conversations'],['pers','Personnes coachées'],['delib','Heures de pratique délibérée'],['suph','Heures de supervision'],['sup','Supervisions (nombre)'],['inv','Invitations'],['prop','Propositions'],['ca','CA signé (€)'],['cli','Contrats signés (renouvellements compris)']].map(([k,l])=>`<label>${l}<input class="fin" type="number" min="0" data-av="${k}" value="${esc(C.avant?.[k]??'')}"></label>`).join('')}
    <label>Jusqu'au<input class="fin" type="date" data-av="date" value="${esc(C.avant?.date||'')}"></label></div></div>`;
 const B=$('coB');
 B.querySelectorAll('[data-co]').forEach(i=>i[i.tagName=='SELECT'?'onchange':'oninput']=()=>{C[i.dataset.co]=i.value;if(i.dataset.co=='nom')C.nom=i.value;touch()});
 B.querySelectorAll('[data-li]').forEach(i=>i.oninput=()=>{C[i.dataset.li][+i.dataset.i]=i.value;touch()});
 B.querySelectorAll('[data-lx]').forEach(b=>b.onclick=()=>{C[b.dataset.lx].splice(+b.dataset.i,1);touch();renderCoEdit()});
 B.querySelectorAll('[data-la]').forEach(b=>b.onclick=()=>{const k=b.dataset.la;C[k]=C[k]||[];C[k].push('');renderCoEdit();const L=B.querySelectorAll(`[data-li="${k}"]`);L[L.length-1]?.focus()});
 B.querySelectorAll('[data-ve]').forEach(b=>b.onclick=()=>openVic(+b.dataset.ve));
 B.querySelectorAll('[data-vd]').forEach(i=>i.onchange=()=>{C.victoires[+i.dataset.vd].d=i.value;touch()});
 B.querySelectorAll('[data-vr]').forEach(i=>i.onchange=()=>{C.victoires[+i.dataset.vr].tier=i.value;touch()});
 B.querySelectorAll('[data-vx]').forEach(b=>b.onclick=()=>{C.victoires.splice(+b.dataset.vx,1);touch();renderCoEdit()});
 $('coVicAdd').onclick=()=>openVic(null);
 B.querySelectorAll('[data-av]').forEach(i=>i.oninput=()=>{C.avant=C.avant||{};const k=i.dataset.av;if(k=='date')C.avant.date=i.value;else if(i.value==='')delete C.avant[k];else C.avant[k]=Math.max(0,+i.value||0);touch()});
 $('coCsvM').onclick=csvModel;$('coCsvI').onclick=()=>$('csvFile').click();
 $('coPh').onclick=()=>$('coFile').click();const d=$('coPhDel');if(d)d.onclick=()=>{delete C.photo;touch();renderCoEdit()}}
$('coFile').onchange=e=>{const f=e.target.files[0];e.target.value='';if(!f)return;const fr=new FileReader();fr.onload=()=>{const im=new Image();im.onload=()=>{CRT='coach';CR.img=im;CR.z=1;CR.ox=0;CR.oy=0;$('crZoom').value=1;crDraw($('crCv'),300,true);$('cropM').classList.add('show')};im.onerror=()=>toast('Image non reconnue');im.src=fr.result};fr.readAsDataURL(f)};
$('coX').onclick=()=>{const C=CO();['formation','parcours'].forEach(k=>C[k]=(C[k]||[]).map(x=>x.trim()).filter(Boolean));C.victoires=(C.victoires||[]).filter(v=>(v.t||'').trim());['nom','titre','pitch'].forEach(k=>{if(C[k])C[k]=C[k].trim()});touch();$('coM').classList.remove('show');renderAll()};
$('coOk').onclick=()=>$('coX').click();

/* =========================================================
   1.7.0 : développement de l'activité (Métriques), hauts faits, affinités, reprise de l'historique
   ========================================================= */
const AV=()=>CO().avant||{};
const avN=k=>+AV()[k]||0;

/* ---------- Métriques : développer ton activité ---------- */
let BVIEW='fun';
/* 3.0.0 : Facultés commerciales de l'année (XP de 0 à 5 par rencontre réseau, invitation ou proposition) */
function aisCom(L){const f=fcMet();if(!f)return null;const V=L.filter(e=>isCom(e.type)&&e.xp&&e.xp[f.id]!=null);
 return{n:V.length,xp:V.reduce((s,e)=>s+(+e.xp[f.id]||0),0),N:L.filter(e=>isCom(e.type)).length,l:f.l}}
function bizYear(y){const L=E().filter(e=>e.date.startsWith(y)),P=f=>new Set(L.filter(e=>f(e)&&e.pid!=null).map(e=>e.pid)).size;
 const acc=L.filter(e=>e.type=='proposition'&&e.statut=='acceptee'&&+e.eur>0);
 return{inv:L.filter(e=>e.type=='invitation').length,conv:P(e=>e.type=='conversation'),prop:P(e=>e.type=='proposition'&&+e.eur>0),cli:P(e=>e.type=='proposition'&&e.statut=='acceptee'&&+e.eur>0),
  ca:acc.reduce((s,e)=>s+(+e.eur||0),0),nacc:acc.length,ac:aisCom(L),non:L.filter(e=>(e.type=='invitation'&&e.non)||(e.type=='proposition'&&e.statut=='refusee')).length}}
const rate=(a,b)=>b>0&&a<=b?Math.round(a/b*100):null;
function renderBiz(){const y=YSEL||today().slice(0,4),py=String(+y-1),B=bizYear(y),Pv=bizYear(py),box=$('bizBox');if(!box)return;
 $('bizView').innerHTML=`<button data-v="fun" class="${BVIEW=='fun'?'on':''}">Entonnoir</button><button data-v="mois" class="${BVIEW=='mois'?'on':''}">Par mois</button>`;
 $('bizView').querySelectorAll('button').forEach(b=>b.onclick=()=>{BVIEW=b.dataset.v;renderBiz()});
 const col=k=>TM[k]?.c||'#999',ST=[['inv','Invitations','invitation',col('invitation')],['conv','Personnes en conversation','conversation',col('conversation')],['prop','Personnes avec une proposition','proposition',col('proposition')],['cli','Clients signés','',CFG().couleurs.accent]];
 if(BVIEW=='fun'){const mx=Math.max(1,...ST.map(s=>B[s[0]]));
  const rows=ST.map((s,i)=>{const v=B[s[0]],w=Math.max(v?8:2,v/mx*100),r=i?rate(v,B[ST[i-1][0]]):null,pr=i?rate(Pv[s[0]],Pv[ST[i-1][0]]):null;
   return `${i?`<div class="bzr">${r!=null?`↓ <b>${r} %</b>`:'↓ —'}${pr!=null?` <span>(${pr} % en ${py})</span>`:''}</div>`:''}<div class="bzl"><span class="bzn">${s[1]}</span><div class="bzb"><i style="width:${w}%;background:${s[3]}"></i><b>${v}</b></div></div>`}).join('');
  const glob=rate(B.cli,B.inv)??rate(B.cli,B.conv),gl=rate(B.cli,B.inv)!=null?'des invitations':'des conversations';
  box.innerHTML=`<div class="bzg"><div class="bzf">${rows}</div><div class="bzk">
   <div><small>Transformation</small><b>${glob!=null?glob+' %':'—'}</b><span>${glob!=null?gl+' deviennent des clients':'pas encore de données'}</span></div>
   <div><small>CA signé ${y}</small><b>${eur(B.ca)}</b><span>${Pv.ca?`${eur(Pv.ca)} en ${py}`:'&nbsp;'}</span></div>
   <div><small>Panier moyen</small><b>${B.nacc?eur(B.ca/B.nacc):'—'}</b><span>${B.nacc?pl(B.nacc,'contrat')+' signé'+(B.nacc>1?'s':''):'&nbsp;'}</span></div>
   ${B.ac&&MOD('activite')?`<div><small>${esc(B.ac.l)}</small><b>${num(B.ac.xp)}<span style="font-size:15px;color:var(--grey)"> XP</span></b><span>${B.ac.N?`sur ${pl(B.ac.N,'rencontre')}, invitations et propositions · ${n1(B.ac.n?B.ac.xp/B.ac.n:0)} XP en moyenne`:'de 0 à 5 XP après chaque rencontre réseau, invitation ou proposition'}</span></div>`:''}
   <div class="bznon"><small>Non reçus ${y}</small><b>${B.non}</b><span>${B.non?'chaque non prouve que tu as proposé':'invitations déclinées et propositions refusées'}</span></div></div></div>
   ${!B.inv?'<div class="hint" style="margin:8px 0 0">Enregistre tes invitations (type Invitation) pour voir le premier taux de l\'entonnoir.</div>':'<div class="hint" style="margin:8px 0 0">Les taux comparent des personnes distinctes sur l\'année ; « — » quand l\'étape précédente n\'est pas renseignée.</div>'}`;return}
 /* par mois */
 const W=Math.max(420,Math.round(box.getBoundingClientRect().width||720)),Hh=250,l=30,b=26,top=14,step=(W-l-10)/12,cur=today();
 const S2=[['Invitations',col('invitation'),(m)=>m.filter(e=>e.type=='invitation').length],['Conversations',col('conversation'),m=>m.filter(e=>e.type=='conversation').length],['Propositions',col('proposition'),m=>m.filter(e=>e.type=='proposition'&&+e.eur>0).length],['Signatures',CFG().couleurs.accent,m=>m.filter(e=>e.type=='proposition'&&e.statut=='acceptee'&&+e.eur>0).length]];
 const D=MO.map((_,i)=>{const m=E().filter(e=>e.date.startsWith(y+'-'+pad(i+1)));return S2.map(s=>s[2](m))}),mx=Math.max(1,...D.flat()),max=Math.max(4,Math.ceil(mx/(mx>20?5:2))*(mx>20?5:2)),bw=Math.max(3,Math.min(13,step*.8/4-2));let g='';
 for(let k=0;k<=4;k++){const v=Math.round(max*k/4),yy=Hh-b-(v/max)*(Hh-b-top);g+=`<line x1="${l}" x2="${W-6}" y1="${yy}" y2="${yy}" stroke="#EEE"/><text x="${l-6}" y="${yy+4}" text-anchor="end">${v}</text>`}
 D.forEach((row,i)=>{const x0=l+i*step+(step-(bw+2)*4)/2,isCur=y==cur.slice(0,4)&&i==+cur.slice(5,7)-1;g+=`<text x="${l+i*step+step/2}" y="${Hh-8}" text-anchor="middle" style="${isCur?'fill:var(--jet);font-weight:800':''}">${MO[i]}</text>`;
  row.forEach((v,j)=>{const h=v/max*(Hh-b-top);if(v)g+=`<rect x="${x0+j*(bw+2)}" y="${Hh-b-h}" width="${bw}" height="${h}" rx="2" fill="${S2[j][1]}"><title>${MO[i]} · ${S2[j][0]} : ${v}</title></rect>`})});
 box.innerHTML=`<div class="legend">${S2.map(s=>`<span><i style="background:${s[1]}"></i>${s[0]}</span>`).join('')}</div><svg viewBox="0 0 ${W} ${Hh}" width="100%" height="${Hh}">${g}</svg>`}

/* ---------- hauts faits ---------- */
const TIERS={br:'Bronze',ar:'Argent',or:'Or',lg:'Légendaire'};
const kfmt=n=>n>=1000&&n%1000==0?(n/1000)+'k':String(n);
const HF=[
 {k:'ses',ic:t=>t==1?'1':kfmt(t),l:t=>t==1?'Première séance':`${fmtN(t)} séances`,th:[[1,'br'],[50,'ar'],[100,'ar'],[250,'or'],[500,'lg']]},
 {k:'h',ic:t=>kfmt(t)+'h',l:t=>`${fmtN(t)} h de coaching`,th:[[10,'br'],[50,'br'],[100,'ar'],[250,'ar'],[500,'or'],[1000,'or'],[2500,'lg'],[5000,'lg'],[10000,'lg']]},
 {k:'pers',ic:t=>t,l:t=>`${t} personnes coachées`,th:[[5,'br'],[10,'ar'],[25,'ar'],[50,'or'],[100,'lg']]},
 {k:'cli',ic:t=>t==1?'€':t,l:t=>t==1?'Premier contrat':`${t} clients payants`,th:[[1,'br'],[5,'ar'],[10,'ar'],[20,'or'],[50,'lg']]},
 {k:'ca',ic:t=>kfmt(t)+'€',l:t=>`${fmtN(t)} € de CA signé`,th:[[1000,'br'],[10000,'ar'],[50000,'or'],[100000,'lg']]},
 {k:'wk',ic:t=>t,l:t=>`${t} semaines d'affilée`,th:[[4,'br'],[8,'ar'],[12,'ar'],[26,'or'],[52,'lg']]},
 {k:'delib',ic:t=>kfmt(t)+'h',l:t=>`${fmtN(t)} h de pratique délibérée`,th:[[10,'br'],[50,'ar'],[100,'or'],[250,'lg']]},
 {k:'sup',ic:t=>t==1?'S':t,l:t=>t==1?'Première supervision':`${t} supervisions`,th:[[1,'br'],[10,'ar'],[25,'or']]},
 {k:'inv',ic:t=>t,l:t=>`${t} invitations`,th:[[10,'br'],[50,'ar'],[100,'or'],[250,'lg']]},
 {k:'non',ic:t=>t==1?'NON':t,l:t=>t==1?'Premier non':`${t} non reçus`,th:[[1,'br'],[10,'br'],[25,'ar'],[50,'or'],[100,'lg']]},
 /* 3.0.0 : XP de pratique */
 {k:'xp',ic:t=>kfmt(t),l:t=>`${fmtN(t)} XP de pratique`,th:[[100,'br'],[500,'ar'],[1000,'or'],[5000,'lg'],[10000,'lg']]},
 {k:'xpl',ic:t=>'N'+t,l:t=>`Niveau ${t} dans une compétence`,th:[[5,'ar'],[10,'or'],[20,'lg']]}];
const fmtN=n=>Math.round(n).toLocaleString(LOC);
function weekKey(d){const x=new Date(d+'T12:00:00Z');x.setUTCDate(x.getUTCDate()-((x.getUTCDay()+6)%7));return x.toISOString().slice(0,10)}
function hautsFaits(){const A=AV(),v={ses:avN('ses'),h:avN('h'),pers:0,cli:0,ca:avN('ca'),wk:0,delib:avN('delib'),sup:avN('sup'),inv:avN('inv'),non:0,xp:0,xpl:0},persA=avN('pers'),cliA=avN('cli');
 const XT={},XF=[...XFERS()].sort((a,b)=>(a.date||'').localeCompare(b.date||''));let xi=0;
 const xpMax=()=>{v.xpl=Math.max(v.xpl,...Object.values(XT).map(x=>xpLvl(x).L),0)},xfUntil=d=>{while(xi<XF.length&&(XF[xi].date||'')<=d){const t=XF[xi++];XT[t.de]=(XT[t.de]||0)-t.xp;XT[t.vers]=(XT[t.vers]||0)+t.xp}xpMax()};
 const P=new Set(),C=new Set(),Wk=new Set(),got=[],done={};const AD=A.date||'';
 const check=d=>HF.forEach(f=>f.th.forEach(([t,tier])=>{const key=f.k+t;if(!done[key]&&v[f.k]>=t){done[key]=1;got.push({k:key,ic:f.ic(t),t:f.l(t),d,tier,auto:1})}}));
 v.pers=persA;v.cli=cliA;check(AD||'avant');
 [...E()].sort(byDate).forEach(e=>{
  if(COACH.includes(e.type)){v.h+=(e.dur||0)/60;if(e.pid!=null){P.add(e.pid);v.pers=persA+P.size}
   const w=weekKey(e.date);if(!Wk.has(w)){Wk.add(w);let n=0,k=w;while(Wk.has(k)){n++;k=addDays(k,-7)}v.wk=Math.max(v.wk,n)}}
  if(e.type=='session')v.ses++;
  if(DELIB.includes(e.type))v.delib+=(e.dur||0)/60;
  if(e.type=='supervision')v.sup++;
  if(e.type=='invitation')v.inv++;
  if((e.type=='invitation'&&e.non)||(e.type=='proposition'&&e.statut=='refusee'))v.non++;
  if(e.type=='proposition'&&e.statut=='acceptee'&&+e.eur>0){v.ca+=+e.eur;if(e.pid!=null){C.add(e.pid);v.cli=cliA+C.size}}
  v.xp+=xpEarned(e);if(e.xp)Object.entries(e.xp).forEach(([k,x])=>XT[k]=(XT[k]||0)+(+x||0));xfUntil(e.date);
  check(e.date)});
 if(xi<XF.length){xfUntil('9999');check(XF.at(-1).date||today())}
 const acq=PD().lib.filter(a=>a.st=='acquise').sort((a,b)=>(a.maj||'').localeCompare(b.maj||''));
 if(acq.length)got.push({k:'acq1',ic:'★',t:'Première action acquise',d:(acq[0].maj||'').slice(0,10)||today(),tier:'ar',auto:1});
 if(acq.length>=5)got.push({k:'acq5',ic:'★',t:'5 actions acquises',d:(acq[4].maj||'').slice(0,10)||today(),tier:'or',auto:1});
 (CO().victoires||[]).forEach((x,i)=>{if(x.t&&x.t.trim())got.push({k:'v'+x.id,ic:'★',t:x.t.trim(),d:x.d||today(),tier:x.tier||'or',man:1,img:x.img,idx:i})});
 Object.entries((DB.prefs.q&&DB.prefs.q.ch)||{}).forEach(([c,d])=>{const C=CHAP.find(x=>x.k==c);if(C)got.push({k:'ch_'+c,ic:'✓',t:'Carnet de route : '+C.hf,d,tier:'br',auto:1})});
 got.sort((a,b)=>(b.d=='avant'?'0':b.d).localeCompare(a.d=='avant'?'0':a.d));
 const todo=[];HF.forEach(f=>{const nx=f.th.find(([t])=>!done[f.k+t]);if(!nx)return;const[t,tier]=nx,cur=v[f.k];todo.push({ic:f.ic(t),t:f.l(t),tier,p:cur/t,rest:t-cur,u:f.k=='h'||f.k=='delib'?' h':f.k=='ca'?' €':f.k=='xp'?' XP':'',k:f.k})});
 todo.sort((a,b)=>b.p-a.p);
 const lim=addDays(today(),-30);got.forEach(x=>x.nw=x.d!='avant'&&x.d>=lim);
 return{got,todo:todo.slice(0,3)}}
const restTxt=x=>x.k=='wk'?`encore ${x.rest} semaine${x.rest>1?'s':''}`:x.k=='xpl'?`encore ${x.rest} niveau${x.rest>1?'x':''}`:`encore ${fmtN(Math.ceil(x.rest))}${x.u}`;
const dTxt=d=>d=='avant'?'avant l\'outil':dShort(d);
let HFALL=false;
function hautsFaitsHTML(jeu){const{got,todo}=hautsFaits(),PL='<button class="cfplus" data-covic title="Ajouter une victoire">+</button>';
 if(jeu){const show=HFALL?got:got.slice(0,9);
  return `<div class="cfpanel"><div class="cfsh">Hauts faits <span>${got.length} débloqué${got.length>1?'s':''} · les victoires ★ sont celles que tu ajoutes toi-même</span>${PL}</div>
   <div class="hfg">${show.map(x=>`<div class="hfc t-${x.tier} ${x.man?'clk':''}" ${x.man?`data-vicd="${x.idx}"`:''}><span class="ic" ${x.img?`style="background:url('${x.img}') center/cover"`:''}>${x.img?'':esc(String(x.ic))}</span><div><b>${esc(x.t)}${x.nw?'<span class="hfnw">NOUVEAU</span>':''}</b><span>${x.d=='avant'?'Avant l\'outil':'Débloqué le '+dShort(x.d)}${x.man?' · victoire':''}</span></div><em>${TIERS[x.tier]}</em></div>`).join('')}
   ${todo.map(x=>`<div class="hfc t-lk"><span class="ic">${esc(String(x.ic))}</span><div><b>${esc(x.t)}</b><span>${restTxt(x)}</span><i class="hfp"><i style="width:${Math.round(x.p*100)}%"></i></i></div><em>À venir</em></div>`).join('')}</div>
   ${got.length>8?`<button class="lnk0 hfmore" data-hfall>${HFALL?'Réduire':`Voir les ${got.length-8} autres`}</button>`:''}
   ${!got.length?'<div class="hint" style="margin-top:8px">Tes premiers hauts faits arrivent avec ta première séance enregistrée.</div>':''}</div>`}
 /* thème professionnel : frise proportionnelle au temps */
 const dd=got.filter(x=>x.d!='avant'),av=got.filter(x=>x.d=='avant');let h='',y=0,prev=null;const t=d=>{const[a,b]=d.split('-');return +a*12+(+b-1)};
 const yl=(yr,yy)=>`<div class="yl" style="top:${yy}px"></div><div class="yr" style="top:${yy+2}px">${yr}</div>`;
 dd.forEach(x=>{const yr=x.d.slice(0,4);if(prev===null){h+=yl(yr,0);y=12}else{const gap=Math.max(24,(t(prev)-t(x.d))*4.5);if(prev.slice(0,4)!=yr){y+=22;h+=yl(yr,y);y+=Math.max(9,gap-22)}else y+=gap}
  h+=`<div class="it ${x.man?'clk':''}" ${x.man?`data-vicd="${x.idx}"`:''} style="top:${y}px"><span class="d">${dShort(x.d)}</span><span class="k"><i class="${x.man?'m':''} t-${x.tier}"></i></span><span class="t">${esc(x.t)}<small>${TIERS[x.tier].toLowerCase()}${x.man?' · victoire':''}</small></span></div>`;prev=x.d});
 av.forEach(x=>{y+=prev===null&&!h?12:24;if(!h.includes('avant l')){h+=yl('avant l\'outil',y-12)}h+=`<div class="it" style="top:${y}px"><span class="d">—</span><span class="k"><i class="t-${x.tier}"></i></span><span class="t">${esc(x.t)}<small>${TIERS[x.tier].toLowerCase()}</small></span></div>`;prev=prev||'0000-01'});
 return `<div class="cfpanel"><div class="cfsh">Réalisations <span>${got.length} haut${got.length>1?'s':''} fait${got.length>1?'s':''}</span>${PL}</div>
  ${todo.length?`<div class="hfup">À venir : ${todo.map(x=>`${esc(x.t)} (${restTxt(x)})`).join(' · ')}</div>`:''}
  ${got.length?`<div class="tlw"><div class="tlp" style="height:${y+34}px"><div class="ax"></div>${h}</div></div>`:'<div class="hint">Tes premiers hauts faits arrivent avec ta première séance enregistrée.</div>'}</div>`}

/* ---------- affinités : public × problématique ---------- */
function affinites(){const hp={};E().filter(e=>COACH.includes(e.type)&&e.pid!=null).forEach(e=>{hp[e.pid]=(hp[e.pid]||0)+(e.dur||0)/60});
 const cells={},rows={},cols={};let nc=0;
 Object.entries(hp).forEach(([pid,h])=>{const p=pById(pid);const pu=(p?.public||'').trim(),pr=(p?.probl||'').trim();if(!pu||!pr){nc+=h;return}
  const k=pu+'\u0001'+pr;cells[k]=(cells[k]||0)+h;rows[pu]=(rows[pu]||0)+h;cols[pr]=(cols[pr]||0)+h});
 const R=Object.keys(rows).sort((a,b)=>rows[b]-rows[a]).slice(0,5),C=Object.keys(cols).sort((a,b)=>cols[b]-cols[a]).slice(0,5);
 return{R,C,rows,cols,cell:(r,c)=>cells[r+'\u0001'+c]||0,nc}}
function affinitesHTML(jeu){const A=affinites(),SP=50;
 const head=`<div class="cfsh">Affinités <span>heures de coaching par public et par problématique · spécialité à partir de ${SP} h</span></div>`;
 if(!A.R.length)return `<div class="cfpanel">${head}<div class="hint" style="margin:0">Renseigne le <b>public</b> et la <b>problématique</b> dans la fiche de tes clients (onglet Personnes) : tes affinités et tes spécialités apparaîtront ici.${A.nc?` ${fmtV(A.nc,' h')} h de coaching ne sont pas encore classées.`:''}</div></div>`;
 const foot=A.nc?`<div class="hint" style="margin:8px 0 0">${fmtV(A.nc,' h')} h de coaching pas encore classées : renseigne le public et la problématique de ces clients.</div>`:'';
 const nsp=A.R.reduce((s,r)=>s+A.C.filter(c=>A.cell(r,c)>=SP).length,0);
 if(!jeu){const mx=Math.max(1,...A.R.flatMap(r=>A.C.map(c=>A.cell(r,c))));
  return `<div class="cfpanel">${head}<table class="hm"><tr><th></th>${A.C.map(c=>`<th>${esc(c)}</th>`).join('')}<th>Total</th></tr>
   ${A.R.map(r=>`<tr><th class="r">${esc(r)}</th>${A.C.map(c=>{const h=A.cell(r,c),a=h?.08+.62*h/mx:0;return `<td style="background:${h?`rgba(46,94,100,${a.toFixed(2)})`:'#F6F5F8'};color:${a>.42?'#fff':'#1F2A2C'}">${h?fmtV(h,' h')+' h'+(h>=SP?' ✓':''):'—'}</td>`}).join('')}<td class="tot">${fmtV(A.rows[r],' h')} h</td></tr>`).join('')}
   <tr><th class="r">Total</th>${A.C.map(c=>`<td class="tot">${fmtV(A.cols[c],' h')} h</td>`).join('')}<td></td></tr></table>
   <div class="hint" style="margin:8px 0 0">✓ = spécialité (${SP} h et plus) · ${nsp} spécialité${nsp>1?'s':''}</div>${foot}</div>`}
 const W=150+125*A.C.length,y0=58,rh=72,x0=150,cw=125;let g=`<defs><radialGradient id="afB" cx="35%" cy="30%" r="75%"><stop offset="0" stop-color="#fff" stop-opacity=".9"/><stop offset=".4" stop-color="#6FA6C2"/><stop offset="1" stop-color="#3B7391"/></radialGradient><radialGradient id="afO" cx="35%" cy="30%" r="75%"><stop offset="0" stop-color="#FFF6D8"/><stop offset=".45" stop-color="#E2B54E"/><stop offset="1" stop-color="#A57A28"/></radialGradient></defs>`;
 A.C.forEach((c,j)=>{const ct=A.cols[c];g+=`<text x="${x0+cw*j+cw/2}" y="22" text-anchor="middle" style="font-size:12px;font-weight:800;fill:#E8EFEF">${esc((c=TR(c)).length>18?c.slice(0,17)+'…':c)}</text><text x="${x0+cw*j+cw/2}" y="38" text-anchor="middle" style="font-size:11px;font-weight:800;fill:${ct>=SP?'#D9B66A':'#9DB5B8'}">${fmtV(ct,' h')} h</text>`});
 A.R.forEach((r,i)=>{const rt=A.rows[r],y=y0+rh*i+rh/2;g+=`<line x1="10" x2="${x0+cw*A.C.length}" y1="${y0+rh*i}" y2="${y0+rh*i}" stroke="rgba(255,255,255,.08)"/><text x="10" y="${y-2}" style="font-size:12.5px;font-weight:800;fill:#E8EFEF">${esc(r.length>18?r.slice(0,17)+'…':r)}</text><text x="10" y="${y+14}" style="font-size:11px;font-weight:800;fill:${rt>=SP?'#D9B66A':'#9DB5B8'}">${fmtV(rt,' h')} h</text>`;
  A.C.forEach((c,j)=>{const h=A.cell(r,c);if(!h)return;const rr=Math.max(5,Math.min(34,Math.sqrt(h)*2.9)),x=x0+cw*j+cw/2,big=rr>16;g+=`<circle cx="${x}" cy="${y}" r="${rr}" fill="url(#${h>=SP?'afO':'afB'})"/><text x="${x}" y="${big?y+4:y-rr-6}" text-anchor="middle" style="font-size:${big?12:10}px;font-weight:900;fill:${big?(h>=SP?'#4A3206':'#fff'):'#E8EFEF'}">${fmtV(h,' h')}</text>`})});
 return `<div class="cfpanel">${head}<div style="max-width:${Math.min(760,W)}px"><svg viewBox="0 0 ${W} ${y0+rh*A.R.length+6}" width="100%" style="font-family:Nunito,sans-serif">${g}</svg></div><div class="hint" style="margin:6px 0 0;color:#9DB5B8">or = spécialité (${SP} h et plus) · ${nsp} spécialité${nsp>1?'s':''}</div>${foot.replace('class="hint"','class="hint" style="color:#9DB5B8"')}</div>`}

/* ---------- reprise de l'historique : import CSV ---------- */
const norm=s=>String(s||'').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/[^a-z0-9]/g,'');
function parseCSV(t){t=t.replace(/^﻿/,'');const l1=t.split(/\r?\n/)[0]||'',sep=(l1.match(/;/g)||[]).length>=(l1.match(/,/g)||[]).length?';':(l1.includes('\t')?'\t':',');
 const rows=[];let row=[],cell='',q=false;for(let i=0;i<t.length;i++){const c=t[i];if(q){if(c=='"'){if(t[i+1]=='"'){cell+='"';i++}else q=false}else cell+=c}
  else if(c=='"')q=true;else if(c==sep){row.push(cell);cell=''}else if(c=='\n'||c=='\r'){if(c=='\r'&&t[i+1]=='\n')i++;row.push(cell);rows.push(row);row=[];cell=''}else cell+=c}
 if(cell||row.length){row.push(cell);rows.push(row)}return rows.filter(r=>r.some(x=>String(x).trim()))}
function parseDateFR(s){s=String(s||'').trim();let m;if(!s)return null;
 if(m=s.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/))return `${m[1]}-${pad(+m[2])}-${pad(+m[3])}`;
 if(m=s.match(/^(\d{1,2})[\/.\-](\d{1,2})[\/.\-](\d{2,4})/)){const y=m[3].length==2?'20'+m[3]:m[3];return `${y}-${pad(+m[2])}-${pad(+m[1])}`}
 if(/^\d{5}(\.\d+)?$/.test(s)){const d=new Date(Date.UTC(1899,11,30)+Math.floor(+s)*864e5);return d.toISOString().slice(0,10)}
 return null}
const CSVH={date:['date','jour'],type:['type','typedactivite','activite','typedentretien'],dur:['duree','dur','temps','heures','duration','time'],pers:['personne','client','cliente','coache','nom','prenomnom','personnecoachee'],
 com:['commentaire','cequonavu','commentaires','theme'],notes:['notes','note','notessurlentretien'],eur:['montant','eur','prix','montanteur'],stat:['statut','status','etat']};
function csvModel(){download('modele-import-saisies.csv','﻿Date;Type;Durée;Personne;Commentaire;Notes;Montant;Statut\n','text/csv')}
async function importCsv(file){let rows;try{rows=parseCSV(await file.text())}catch(e){toast('Fichier CSV illisible');return}
 if(rows.length<2){toast('Le fichier ne contient aucune ligne de saisie');return}
 const hd=rows[0].map(norm),ix={};Object.entries(CSVH).forEach(([k,al])=>{const i=hd.findIndex(h=>al.includes(h));if(i>=0)ix[k]=i});
 if(ix.date==null||ix.type==null){toast('Colonnes « Date » et « Type » introuvables : pars du modèle');return}
 const tmap={};T.forEach(t=>{tmap[norm(t.l)]=t.k;tmap[norm(t.k)]=t.k});Object.assign(tmap,{seance:'session',sessions:'session',seances:'session',conv:'conversation',supervisions:'supervision',invitations:'invitation'});
 const out=[],bad=[],dup=new Set(E().map(e=>`${e.date}|${e.type}|${norm(pname(e.pid))}`));let ndup=0;const newP=new Set();
 rows.slice(1).forEach((r,n)=>{const d=parseDateFR(r[ix.date]),k=tmap[norm(r[ix.type])];if(!d||!k){bad.push(n+2);return}
  const pn=ix.pers!=null?String(r[ix.pers]||'').trim():'',key=`${d}|${k}|${norm(pn)}`;if(dup.has(key)){ndup++;return}dup.add(key);
  const dv=ix.dur!=null?parseDur(r[ix.dur]):null;out.push({d,k,pn,dur:dv!=null?dv:TM[k].d,com:ix.com!=null?String(r[ix.com]||'').trim():'',notes:ix.notes!=null?String(r[ix.notes]||'').trim():'',eur:ix.eur!=null?+String(r[ix.eur]||'').replace(/[^\d,.-]/g,'').replace(',','.')||0:0,st:ix.stat!=null?norm(r[ix.stat]):''});
  if(pn&&!DB.personnes.some(p=>byName(p.nom,pn)==0))newP.add(pn.toLowerCase())});
 if(!out.length){toast(`Aucune saisie à importer${ndup?` (${ndup} déjà présente${ndup>1?'s':''})`:''}${bad.length?` · ${bad.length} ligne${bad.length>1?'s':''} non reconnue${bad.length>1?'s':''}`:''}`);return}
 if(!confirm(`${out.length} saisie${out.length>1?'s':''} à importer, du ${dShort(out.map(x=>x.d).sort()[0])} au ${dShort(out.map(x=>x.d).sort().at(-1))}.${newP.size?`\n${newP.size} nouvelle${newP.size>1?'s':''} personne${newP.size>1?'s':''} sera créée${newP.size>1?'s':''}.`:''}${ndup?`\n${ndup} ligne${ndup>1?'s':''} déjà présente${ndup>1?'s':''} ignorée${ndup>1?'s':''}.`:''}${bad.length?`\nLignes non reconnues (date ou type) : ${bad.slice(0,12).join(', ')}${bad.length>12?'…':''}.`:''}\n\nImporter ?`))return;
 const now=new Date().toISOString();out.forEach(x=>{let pid=null;if(x.pn){let p=DB.personnes.find(q=>byName(q.nom,x.pn)==0);if(!p){p={id:nextId(DB.personnes),nom:x.pn,maj:now};DB.personnes.push(p)}pid=p.id}
  const e={id:nextId(E()),maj:now,date:x.d,type:x.k,dur:x.dur,pid:TM[x.k].p?pid:null,com:x.com,...(x.notes?{notes:x.notes}:{}),cr:false,syn:false,imp:1};
  if(x.k=='proposition'){e.eur=x.eur;e.engagement_mois=3;e.statut=/accept|sign|gagn|oui/.test(x.st)?'acceptee':/refus|perdu|non/.test(x.st)?'refusee':'attente'}
  E().push(e)});
 touch();renderAll();toast(`${out.length} saisie${out.length>1?'s':''} importée${out.length>1?'s':''}`)}
$('csvFile').onchange=e=>{const f=e.target.files[0];e.target.value='';if(f)importCsv(f)};
$('impCsv').onclick=()=>$('csvFile').click();

/* ---------- 3.2.0 : modules à la carte (remplacent le mode simplifié de la 1.8.0) ----------
   prefs.modules = {coacher, competences, activite, jeu} ; aucun module = Essentiel (= ancien simplifié), tous = Tout (= ancien complet).
   Un module désactivé est seulement masqué : aucune donnée n'est touchée, et ce qu'il masque ne signale rien.
   prefs.simple reste écrit (true seulement en Essentiel) pour une application plus ancienne. Sans prefs.modules : comportement d'avant (simple). */
const MODS=['coacher','competences','activite','jeu'];
const MODTAB={dash:'coacher',coach:'jeu',pd:'competences',reseau:'activite'};
const MODL={coacher:['① Coacher beaucoup','Tableau de bord, indicateurs, objectif prioritaire, plan d\'action.'],
 competences:['② Affûter mes compétences','Pratique délibérée, XP de pratique, boussole, supervision.'],
 activite:['③ Créer mon activité','Réseau, proximité, Facultés commerciales, entonnoir, coûts et taux horaire, vue Liste.'],
 jeu:['④ Le jeu','Fiche de coach, rang, hauts faits, célébrations.']};
const MOD=k=>{const p=DB&&DB.prefs;if(!p)return true;const m=p.modules;return m&&typeof m=='object'?!!m[k]:!p.simple};
const ESS=()=>!MODS.some(MOD);
const modsAll=v=>Object.fromEntries(MODS.map(k=>[k,!!v]));
const modLbl=()=>{const n=MODS.filter(MOD).length;return n==0?'Essentiel':n==MODS.length?'Tout':pl(n,'module')};
/* change les modules ; quest=true : un module activé au quotidien accomplit la mission « Activer un module » */
function setMods(o,quest){if(!DB)return;const was=Object.fromEntries(MODS.map(k=>[k,MOD(k)]));DB.prefs.modules=Object.fromEntries(MODS.map(k=>[k,!!o[k]]));
 DB.prefs.simple=!MODS.some(k=>o[k]);DB.prefs.modules_maj=new Date().toISOString();if(quest&&MODS.some(k=>o[k]&&!was[k]))qFlag('mod');touch();applyMode()}
function modListHTML(cls){return MODS.map(k=>`<label class="${cls}"><input type="checkbox" data-mod="${k}" ${MOD(k)?'checked':''}><span><b>${MODL[k][0]}</b><small>${MODL[k][1]}</small></span></label>`).join('')}
function modShortHTML(){const e=ESS(),t=MODS.every(MOD);return `<button type="button" class="btn2 ${e?'on':''}" data-mods="0">Essentiel</button><button type="button" class="btn2 ${t?'on':''}" data-mods="1">Tout</button>`}
function modBind(box,after){box.querySelectorAll('[data-mod]').forEach(i=>i.onchange=()=>{const o=Object.fromEntries(MODS.map(k=>[k,MOD(k)]));o[i.dataset.mod]=i.checked;setMods(o,true);renderAll();if(after)after();toast(i.checked?'Module affiché.':'Module masqué : rien n\'est perdu.')});
 box.querySelectorAll('[data-mods]').forEach(b=>b.onclick=()=>{const v=b.dataset.mods=='1';setMods(modsAll(v),true);renderAll();if(after)after();toast(v?'Tout : tous les modules sont affichés.':'Essentiel : le suivi de tes entretiens et de tes personnes. Rien n\'est perdu.')})}
function renderModMenu(){const m=$('modMenu');if(!m||m.classList.contains('hide'))return;
 m.innerHTML=`<div class="mmk">Sur quoi tu travailles</div>${modListHTML('mmi')}<div class="mmf">${modShortHTML()}</div><div class="mmh">Le suivi de tes entretiens, de tes personnes et « À relancer » est toujours là. Un module désactivé est seulement masqué : rien n'est perdu.</div>`;modBind(m,renderModMenu)}
function renderModSet(){const b=$('setModsL');if(!b)return;if($('setModsN'))$('setModsN').textContent=modLbl();b.innerHTML=`<div class="modset">${modListHTML('msi')}</div><div class="mmf">${modShortHTML()}</div>`;modBind(b,renderModSet)}
function applyMode(){const b=document.body;MODS.forEach(k=>b.classList.toggle('no-'+k,!MOD(k)));b.classList.toggle('ess',ESS());
 if($('modLbl'))$('modLbl').textContent=modLbl();
 /* onglet masqué : retour au Suivi d'activité (pas pendant le parcours de démarrage, qui choisit lui-même l'onglet d'arrivée) */
 if(MODTAB[TAB]&&!MOD(MODTAB[TAB])&&$('wiz').classList.contains('hide'))goTab('metrics')}
$('modBtn').onclick=e=>{e.stopPropagation();if(!DB)return;const m=$('modMenu');m.classList.toggle('hide');$('modBtn').classList.toggle('on',!m.classList.contains('hide'));renderModMenu();
 /* menu calé à droite du bouton, ou à gauche s'il sortirait de l'écran (en-tête replié sur écran étroit) */
 m.style.left=m.style.right='';if(!m.classList.contains('hide')&&m.getBoundingClientRect().left<8){m.style.left='0';m.style.right='auto'}};
document.addEventListener('click',e=>{const m=$('modMenu');if(m&&!m.classList.contains('hide')&&e.target.isConnected&&!e.target.closest('#modMenu,#modBtn')){m.classList.add('hide');$('modBtn').classList.remove('on')}});
const TORD=['reseau','invitation','conversation','proposition','session','debrief','supervision'];
const TDESC={reseau:"J'ai rencontré une personne de mon réseau (café, événement, appel)",invitation:"J'ai proposé à une personne de découvrir le coaching",conversation:"J'ai fait découvrir mon coaching lors d'une session offerte",proposition:"J'ai proposé un contrat de coaching",
 session:"J'ai coaché lors d'une session sous contrat signé",debrief:"J'ai pris le temps de revenir sur mon entretien (contenu, posture, pratique)",supervision:"Je me suis fait superviser dans ma pratique"};
function renderTypeChips(){const main=TORD.filter(k=>TM[k]),rest=STACK.filter(k=>TM[k]&&!main.includes(k)),box=$('mTypes');
 const btn=k=>`<button class="chip type ${k===S.type?'on':''}" data-ty="${k}" style="--c:${TM[k].c};--t:${tc(TM[k].c)}">${esc(TM[k].l)}</button>`;
 if(ESS()){box.className='tylist';box.innerHTML=main.map(k=>`<div class="tyrow">${btn(k)}<span>${TDESC[k]}</span></div>`).join('')+(rest.length?`<div class="tyrest">${rest.map(btn).join('')}</div>`:'')}
 else{box.className='chips tyseq';box.innerHTML=main.map(btn).join('<span class="tysep">›</span>')+(rest.length?'<span class="tybar"></span>'+rest.map(btn).join(''):'')}
 box.querySelectorAll('[data-ty]').forEach(b=>b.onclick=()=>{S.type=b.dataset.ty;S.dur=TM[S.type].d;renderModal()})}

