/* =========================================================
   PERSONNES (CRM léger) : étape, fiche, photo, relances
   ========================================================= */
const ETAPES=[['contact','Rencontre'],['conversation','En conversation'],['proposition','Proposition envoyée'],['client','Client.e'],['termine','Accompagnement terminé'],['perdu','Sans suite'],['superviseur','Superviseur.e']];
const ETL=Object.fromEntries(ETAPES);
const ETC={contact:'#9A9DA1',conversation:'#2F8C93',proposition:'var(--afb)',client:'var(--am)',termine:'var(--jet)',perdu:'#C9727B',superviseur:'#8B78A8'};
const pEntries=pid=>E().filter(e=>e.pid==pid).sort((a,b)=>a.date.localeCompare(b.date));
const lastContact=pid=>pEntries(pid).filter(e=>e.date<=today()).at(-1)||null;
/* étape proposée automatiquement à partir des saisies */
/* contrat en cours d'une personne : dernière proposition acceptée */
const addMonths=(d,m)=>{const x=new Date(d+'T12:00:00Z');x.setUTCMonth(x.getUTCMonth()+(+m||0));return x.toISOString().slice(0,10)};
function contractOf(pid){const A=pEntries(pid).filter(e=>e.type=='proposition'&&e.statut=='acceptee');if(!A.length)return null;const e=A.at(-1),debut=e.debut||e.date,
 fin=e.engagement_mois?addMonths(debut,e.engagement_mois):null,S=pEntries(pid).filter(x=>x.type=='session'&&x.date>=debut&&(!fin||x.date<=fin));
 return{e,debut,fin,prevues:+e.seances||null,faites:S.length,eur:+e.eur||0}}
/* alerte « bilan ou renouvellement » : une seule fois par contrat (identifié par la proposition acceptée) */
function endWinStart(K){let s=K.fin?addDays(K.fin,-21):null;
 if(K.prevues){const S=pEntries(K.e.pid).filter(x=>x.type=='session'&&x.date>=K.debut&&(!K.fin||x.date<=K.fin)),x=S[K.prevues-2],d=x?x.date:K.debut;if(!s||d<s)s=d}
 return !s||s<K.debut?K.debut:s}
function bilanDone(p,K){if(p.bilanFait!=null)return String(p.bilanFait)===String(K.e.id);const s=endWinStart(K);/* carnets antérieurs à la 2.3.1 : bilan déjà planifié */
 return DB.actions.some(a=>String(a.pid)===String(p.id)&&/^\s*(Bilan \/ renouvellement|Review \/ renewal)/i.test(a.a||'')&&(a.d||'')>=s)}
function contractTxt(K){if(!K)return'';return `${K.prevues?`${K.faites}/${K.prevues} séances`:`${pl(K.faites,'séance')}`}${K.fin?` · fin ${K.fin<today()?'le ':'prévue le '}${dShort(K.fin)}`:''}`}
function contractBar(K){if(!K?.prevues)return'';const p=Math.min(100,K.faites/K.prevues*100);return `<div class="bar" style="margin-top:4px"><b style="width:${p}%;background:var(--am)"></b></div>`}
function autoStage(pid){const L=pEntries(pid);if(!L.length)return'contact';const P=L.filter(e=>e.type=='proposition'),last=L.at(-1).date;
 if(L.some(e=>e.type=='supervision')&&!P.some(e=>e.statut=='acceptee'))return'superviseur';
 if(P.some(e=>e.statut=='acceptee')){const K=contractOf(pid);
  if(K.fin){if(K.fin>=today()||L.some(e=>e.date>K.fin&&COACH.includes(e.type)))return'client';return'termine'}
  return last<addDays(today(),-120)?'termine':'client'}
 if(P.some(e=>e.statut=='attente'))return'proposition';
 if(P.length&&P.every(e=>e.statut=='refusee')&&!L.some(e=>e.date>P.at(-1).date))return'perdu';
 if(L.some(e=>COACH.includes(e.type)))return'conversation';
 return'contact'}
/* une étape choisie à la main reste valable tant qu'aucune nouvelle saisie n'arrive ensuite */
function stageOf(p){const a=autoStage(p.id);if(p.etape?.v){const at=p.etape.at.slice(0,10);if(!pEntries(p.id).some(e=>e.date>at))return p.etape.v}return a}
const stagePill=st=>`<span class="stp" style="background:${ETC[st]}">${ETL[st]}</span>`;
function avatar(p,sz){const ini=(p?.nom||'?').split(/\s+/).map(w=>w[0]).join('').slice(0,2).toUpperCase(),h=[...(p?.nom||'')].reduce((a,c)=>a+c.charCodeAt(0),0);
 const bg=PAL[h%PAL.length]||'#999';
 return p?.photo?`<img class="av" src="${p.photo}" style="width:${sz}px;height:${sz}px" alt="">`:`<span class="av" style="width:${sz}px;height:${sz}px;font-size:${Math.round(sz*.38)}px;background:${bg};color:${tc(bg)}">${esc(ini)}</span>`}
const openActs=pid=>DB.actions.filter(a=>a.pid==pid&&a.s=='encours').sort((a,b)=>(a.d||'9').localeCompare(b.d||'9'));
const pById=id=>DB.personnes.find(x=>String(x.id)===String(id));

/* ---------- à relancer (tableau de bord) ---------- */
function relItems(){const t=today(),soon=addDays(t,7),seuil=+CFG().crm.froid||30,items=[];
 DB.actions.filter(a=>a.s=='encours'&&a.pid!=null&&a.d&&a.d<=soon).forEach(a=>{const p=pById(a.pid);if(p)items.push({k:'act',p,a,late:a.d<t,ord:a.d})});
 const withProp=new Set();
 E().filter(e=>e.type=='proposition'&&e.statut=='attente'&&e.pid!=null&&!(e.snz&&e.snz>t)).forEach(e=>{const p=pById(e.pid);if(!p||p.archive||openActs(p.id).length)return;
  withProp.add(p.id);const days=Math.max(0,Math.round((new Date(t)-new Date(e.date))/864e5));items.push({k:'prop',p,e,days,late:days>=14,ord:'0'+e.date})});
 DB.personnes.filter(p=>!p.archive&&!withProp.has(p.id)&&!(p.snooze&&p.snooze>t)&&['conversation','proposition'].includes(stageOf(p))&&!openActs(p.id).length).forEach(p=>{
  const l=lastContact(p.id),days=l?Math.round((new Date(t)-new Date(l.date))/864e5):999;if(days>=seuil&&days<=365)items.push({k:'cold',p,days,ord:'0'+String(9999-days).padStart(4,'0')})});
 DB.personnes.filter(p=>!p.archive&&!(p.snoozeK&&p.snoozeK>t)&&!openActs(p.id).length).forEach(p=>{const K=contractOf(p.id);if(!K||bilanDone(p,K))return;
  const nearEnd=K.fin&&K.fin<=addDays(t,21)&&K.fin>=addDays(t,-45),lastSes=K.prevues&&K.faites>=K.prevues-1&&(!K.fin||K.fin>=t);
  if(nearEnd||lastSes)items.push({k:'end',p,K,late:!!K.fin&&K.fin<t,ord:'1'+(K.fin||t)})});
 return items.sort((x,y)=>(y.late?1:0)-(x.late?1:0)||x.ord.localeCompare(y.ord))}
function renderRel(R=$('relList'),N=$('relN')){const I=relItems();N.textContent=I.length||'';
 R.innerHTML=I.map((x,i)=>`<div class="rel">${avatar(x.p,36)}<div><span class="who" data-pf="${x.p.id}">${esc(x.p.nom)}</span> ${stagePill(stageOf(x.p))}
  <div class="what">${x.k=='prop'?`Proposition de <b>${eur(x.e.eur)}</b>${x.e.engagement_mois?` · ${x.e.engagement_mois} mois`:''}${x.e.seances?` · ${x.e.seances} séances`:''} envoyée le ${dShort(x.e.date)} : où en est-elle ?`:x.k=='act'?esc(x.a.a||'Action'):x.k=='end'?`Accompagnement ${x.late?'terminé':'bientôt terminé'} (${contractTxt(x.K)}) : bilan ou renouvellement ?`:'Pas de nouvelles depuis un moment : une relance ?'}</div></div>
  <div style="text-align:right"><div class="when ${x.late||x.k=='cold'?'late':''}">${x.k=='prop'?`En attente depuis ${x.days} j`:x.k=='act'?(x.late?'En retard · ':'')+dShort(x.a.d):x.k=='end'?(x.K.fin?`Fin ${x.late?'le':'prévue le'} ${dShort(x.K.fin)}`:'Dernière séance prévue'):`Sans contact depuis ${x.days>900?'toujours':x.days+' j'}`}</div>
  <div class="btns" style="justify-content:flex-end;margin-top:4px">${x.k=='prop'?`<button class="btn2" data-pacc="${x.e.id}">Acceptée</button><button class="btn2" data-pref="${x.e.id}">Refusée</button><button class="btn2" data-plan="${x.p.id}">Planifier une relance</button><button class="lnk" data-psnz="${x.e.id}">Plus tard</button>`:x.k=='act'?`<button class="btn2" data-done="${x.a.id}">Fait</button>`:x.k=='end'?`<button class="btn2" data-bilan="${x.p.id}">Planifier le bilan</button><button class="lnk" data-snzk="${x.p.id}">Plus tard</button>`:`<button class="btn2" data-plan="${x.p.id}">Planifier une relance</button><button class="lnk" data-snz="${x.p.id}">Plus tard</button><button class="lnk" data-lost="${x.p.id}">Sans suite</button>`}</div></div></div>`).join('')
  ||'<div class="empty">Rien à relancer pour l\'instant.</div>';
 R.querySelectorAll('[data-pf]').forEach(b=>b.onclick=()=>openFiche(b.dataset.pf));
 const eById=id=>E().find(x=>String(x.id)===String(id));
 R.querySelectorAll('[data-pacc]').forEach(b=>b.onclick=()=>{const e=eById(b.dataset.pacc);e.statut='acceptee';e.maj=new Date().toISOString();touch();renderAll();toast('Proposition acceptée : contrat enregistré','Ouvrir la fiche',()=>openFiche(e.pid))});
 R.querySelectorAll('[data-pref]').forEach(b=>b.onclick=()=>{const e=eById(b.dataset.pref),old=e.statut;e.statut='refusee';e.maj=new Date().toISOString();touch();renderAll();toast('Proposition refusée','Annuler',()=>{e.statut=old;e.maj=new Date().toISOString();touch();renderAll()})});
 R.querySelectorAll('[data-psnz]').forEach(b=>b.onclick=()=>{const e=eById(b.dataset.psnz);e.snz=addDays(today(),7);e.maj=new Date().toISOString();touch();renderAll();toast('Reportée d\'une semaine')});
 R.querySelectorAll('[data-done]').forEach(b=>b.onclick=()=>{const a=DB.actions.find(x=>String(x.id)===b.dataset.done);a.s='realisee';a.maj=new Date().toISOString();touch();renderAll();toast('Action réalisée ✓')});
 R.querySelectorAll('[data-plan]').forEach(b=>b.onclick=()=>{const p=pById(b.dataset.plan);DB.actions.push({id:nextId(DB.actions),p:'Relance',a:`Relancer ${p.nom.split(' ')[0]}`,d:addDays(today(),2),r:'',s:'encours',pid:p.id,maj:new Date().toISOString()});touch();renderAll();toast('Relance planifiée dans 2 jours')});
 R.querySelectorAll('[data-bilan]').forEach(b=>b.onclick=()=>{const p=pById(b.dataset.bilan),K=contractOf(p.id),d=K?.fin&&K.fin>today()?(K.fin<addDays(today(),7)?K.fin:addDays(today(),7)):addDays(today(),2);
  const now=new Date().toISOString();if(K){p.bilanFait=K.e.id;p.maj=now}
  DB.actions.push({id:nextId(DB.actions),p:'Relance',a:`Bilan / renouvellement avec ${p.nom.split(' ')[0]}`,d,r:'',s:'encours',pid:p.id,maj:now});touch();renderAll();toast('Bilan planifié')});
 R.querySelectorAll('[data-snzk]').forEach(b=>b.onclick=()=>{const p=pById(b.dataset.snzk);p.snoozeK=addDays(today(),14);p.maj=new Date().toISOString();touch();renderAll()});
 R.querySelectorAll('[data-lost]').forEach(b=>b.onclick=()=>{const p=pById(b.dataset.lost);p.etape={v:'perdu',at:new Date().toISOString()};p.maj=p.etape.at;touch();renderAll();toast(`${p.nom} classé « Sans suite »`)});
 R.querySelectorAll('[data-snz]').forEach(b=>b.onclick=()=>{const p=pById(b.dataset.snz);p.snooze=addDays(today(),+CFG().crm.froid||30);p.maj=new Date().toISOString();touch();renderAll()})}

/* ---------- onglet Personnes ---------- */
const PF={st:'',q:'',arch:false,view:'pipe'};
function renderPipe(base){const t=today(),q=PF.q.trim().toLowerCase();
 const L=base.filter(x=>!q||[x.p.nom,x.p.titre,x.p.provenance,x.p.notes,x.p.site].join(' ').toLowerCase().includes(q));
 $('ppPipe').innerHTML=ETAPES.map(([k,l])=>{const C=L.filter(x=>x.st==k),tot=k=='proposition'?C.reduce((s,x)=>s+pEntries(x.p.id).filter(e=>e.type=='proposition'&&e.statut=='attente').reduce((a,e)=>a+(+e.eur||0),0),0):k=='client'?C.reduce((s,x)=>s+(contractOf(x.p.id)?.eur||0),0):0;
  return `<div class="pcol" data-col="${k}"><div class="pch"><span class="dot" style="background:${ETC[k]}"></span>${l}<span class="n">${C.length}</span></div>${tot?`<div class="pct">${eur(tot)}</div>`:''}
   ${C.map(({p,last,next})=>{const K=contractOf(p.id),pend=pEntries(p.id).filter(e=>e.type=='proposition'&&e.statut=='attente').reduce((a,e)=>a+(+e.eur||0),0);
    return `<div class="pcard" draggable="true" data-pid="${p.id}"><div class="pch2">${avatar(p,46)}<div class="pn">${esc(p.nom)}</div></div>
     ${p.titre?`<div class="pt2">${esc(p.titre)}</div>`:''}
     ${k=='client'&&K?`<div class="pt2"><b>${contractTxt(K)}</b></div>${contractBar(K)}`:''}${k=='proposition'&&pend?`<div class="pt2"><b>${eur(pend)}</b> en attente</div>`:''}
     <div class="pt2 pl ${next&&next.d&&next.d<t?'late':''}"><span>${next?'→ '+esc(next.a||'Action')+(next.d?' · '+dShort(next.d):''):last?'Dernier contact '+dShort(last.date):''}</span>${p.site?`<a class="psite" href="${esc(webUrl(p.site))}" target="_blank" rel="noopener" title="${esc(webHost(p.site))}">${SVGI.web}</a>`:''}</div></div>`}).join('')||'<div class="pempty">—</div>'}</div>`}).join('');
 let dragP=null;
 $('ppPipe').querySelectorAll('.pcard').forEach(c=>{c.onclick=e=>{if(e.target.closest('a'))return;openFiche(c.dataset.pid)};c.ondragstart=e=>{dragP=c.dataset.pid;c.classList.add('drag');try{e.dataTransfer.setData('text/plain',dragP)}catch(_){}};c.ondragend=()=>c.classList.remove('drag')});
 $('ppPipe').querySelectorAll('.pcol').forEach(col=>{col.ondragover=e=>{e.preventDefault();col.classList.add('over')};col.ondragleave=e=>{if(!col.contains(e.relatedTarget))col.classList.remove('over')};
  col.ondrop=e=>{e.preventDefault();col.classList.remove('over');const p=pById(dragP);dragP=null;if(!p)return;const k=col.dataset.col;
   p.etape=k==autoStage(p.id)?null:{v:k,at:new Date().toISOString()};p.maj=new Date().toISOString();touch();renderPeople();toast(`${p.nom} : ${ETL[k]}`)}})}
function renderPeople(){renderRel($('ppRelList'),$('ppRelN'));if(SIMPLE())PF.view='pipe';const t=today();
 $('ppView').querySelectorAll('button').forEach(b=>{b.classList.toggle('on',b.dataset.v==PF.view);b.onclick=()=>{PF.view=b.dataset.v;renderPeople()}});
 $('ppList').classList.toggle('hide',PF.view!='list');$('ppPipe').classList.toggle('hide',PF.view!='pipe');$('ppSt').classList.toggle('hide',PF.view!='list');
 const base=DB.personnes.filter(p=>PF.arch?p.archive:!p.archive).map(p=>({p,st:stageOf(p),last:lastContact(p.id),next:openActs(p.id)[0]}));
 $('ppSt').innerHTML=[['','Toutes']].concat(ETAPES).map(([k,l])=>{const n=k?base.filter(x=>x.st==k).length:base.length;return `<button class="chip ${PF.st==k?'on':''}" data-st="${k}">${l} <small>${n}</small></button>`}).join('');
 $('ppSt').querySelectorAll('[data-st]').forEach(b=>b.onclick=()=>{PF.st=b.dataset.st;renderPeople()});
 const q=PF.q.trim().toLowerCase();
 const L=base.filter(x=>(!PF.st||x.st==PF.st)&&(!q||[x.p.nom,x.p.titre,x.p.provenance,x.p.notes,x.p.site].join(' ').toLowerCase().includes(q)))
  .sort((a,b)=>(a.next?0:1)-(b.next?0:1)||(a.next?.d||'').localeCompare(b.next?.d||'')||(b.last?.date||'').localeCompare(a.last?.date||'')||byName(a.p.nom,b.p.nom));
 $('ppList').innerHTML=L.map(({p,st,last,next})=>`<div class="ppc" data-pf="${p.id}"><div class="top">${avatar(p,38)}<div class="tx"><div class="nm">${esc(p.nom)}</div><div class="r2">${stagePill(st)}${p.provenance?`<span class="ti">via ${esc(p.provenance)}</span>`:''}</div>
  ${p.titre||p.site?`<div class="ti">${p.titre?esc(p.titre):''}${p.titre&&p.site?' · ':''}${siteLink(p)}</div>`:''}</div></div>
  <div class="ln">Dernier contact : <b>${last?dShort(last.date)+' · '+esc(TM[last.type]?.l||''):'—'}</b></div>
  ${st=='client'&&contractOf(p.id)?`<div class="ln">Contrat : <b>${contractTxt(contractOf(p.id))}</b>${contractBar(contractOf(p.id))}</div>`:''}
  <div class="ln ${next&&next.d&&next.d<t?'late':''}">Prochaine action : <b>${next?esc(next.a||'Action')+(next.d?' · '+dShort(next.d):''):'—'}</b></div></div>`).join('')||'<div class="empty">Personne pour ces critères.</div>';
 $('ppList').querySelectorAll('[data-pf]').forEach(c=>c.onclick=e=>{if(e.target.closest('a'))return;openFiche(c.dataset.pf)});
 if(PF.view=='pipe')renderPipe(base)}
$('ppQ').oninput=e=>{PF.q=e.target.value;renderPeople()};
$('ppArch').onchange=e=>{PF.arch=e.target.checked;renderPeople()};
$('ppNew').onclick=()=>{const p={id:nextId(DB.personnes),nom:'Nouvelle personne',maj:new Date().toISOString()};DB.personnes.push(p);touch();openFiche(p.id);setTimeout(()=>$('pfNom').select(),60)};

/* ---------- fiche personne ---------- */
let PFID=null;
/* téléphone lisible : 0123456789 → 01 23 45 67 89 ; +33123456789 → +33 1 23 45 67 89 */
function fmtTel(v){const raw=String(v||'').trim();if(!raw)return'';const plus=raw.startsWith('+')||raw.startsWith('00'),d=raw.replace(/\D/g,'').replace(/^00/,'');
 if(d.length<6||d.length>15)return raw;const pairs=x=>{const o=x.length%2?[x[0]]:[];for(let i=x.length%2;i<x.length;i+=2)o.push(x.slice(i,i+2));return o.join(' ')};
 if(!plus)return pairs(d);const cl=/^(1|7)/.test(d)?1:/^(35|37|38|42|50|59|67|68|69|85|88|96|97|99)/.test(d)?3:2;return '+'+d.slice(0,cl)+' '+pairs(d.slice(cl))}
const SVGI={mail:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/></svg>',
 web:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/></svg>',
 tel:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2"/></svg>'};
const IS_TOUCH=(()=>{try{return matchMedia('(pointer:coarse)').matches}catch(e){return false}})();
/* frise des échanges : jj/mm au-dessus, année au milieu de son segment */
function timelineSVG(all,W=520){if(!all.length)return '<div class="hint" style="margin:4px 0 0">Aucun échange pour l\'instant.</div>';
 const ms=d=>new Date(d+'T12:00:00').getTime(),t0=ms(all[0].date),t1=Math.max(ms(today()),ms(all.at(-1).date),t0+864e5),l=14,r=W-14,x=d=>l+(ms(d)-t0)/(t1-t0)*(r-l),y=34;let g=`<line x1="${l}" x2="${r}" y1="${y}" y2="${y}" stroke="#ECEAF0" stroke-width="3" stroke-linecap="round"/>`;
 const y0=+all[0].date.slice(0,4),y1=+new Date(t1).getFullYear();
 for(let a=y0;a<=y1;a++){const s=Math.max(t0,ms(a+'-01-01')),e=Math.min(t1,ms((a+1)+'-01-01'));if(e<=s)continue;const xs=l+(s-t0)/(t1-t0)*(r-l),xe=l+(e-t0)/(t1-t0)*(r-l);
  if(a>y0)g+=`<line x1="${xs}" x2="${xs}" y1="${y-8}" y2="${y+8}" stroke="#C9CBCE"/>`;if(xe-xs>26)g+=`<text x="${(xs+xe)/2}" y="${y+19}" text-anchor="middle" font-size="10" fill="#B5B7BA">${a}</text>`}
 /* pastilles : les types les moins importants d'abord, pour que le n° 1 (ex. Session) soit dessiné au-dessus */
 const rk=k=>{const i=STACK.indexOf(k);return i<0?99:i};
 [...all].sort((a,b)=>rk(b.type)-rk(a.type)||a.date.localeCompare(b.date)).forEach(e=>{const xx=x(e.date),c=TM[e.type]?.c||'#ccc';g+=`<circle cx="${xx}" cy="${y}" r="5.5" fill="${c}" stroke="#fff" stroke-width="1.5"><title>${dShort(e.date)} · ${esc(TM[e.type]?.l||e.type)}${e.com?' · '+esc(e.com):''}</title></circle>`});
 let last=-99;all.forEach(e=>{const xx=x(e.date),tx=Math.min(r-12,Math.max(l+12,xx));
  if(tx-last>=36){g+=`<text x="${tx}" y="${y-11}" text-anchor="middle" font-size="10" fill="#797D81">${e.date.slice(8,10)}/${e.date.slice(5,7)}</text>`;last=tx}});
 return `<svg viewBox="0 0 ${W} 56" width="100%" style="font-family:Nunito,sans-serif;display:block">${g}</svg>`}
function aisBlock(all){const M=mActive().length?mActive():metrics();return M.map(m=>{const a=all.filter(e=>e.ais?.[m.id]),v=a.length?a.reduce((x,e)=>x+e.ais[m.id],0)/a.length:null;
  return `<div class="ar"><span title="${esc(m.l)}">${esc(m.l)}</span><div class="bar"><b style="width:${v?(v-1)/4*100:0}%"></b></div><b>${v?n1(v):'—'}</b></div>`}).join('')}
const webUrl=v=>!v?'':/^https?:\/\//i.test(v.trim())?v.trim():'https://'+v.trim().replace(/^\/+/,'');
const webHost=v=>{try{return new URL(webUrl(v)).hostname.replace(/^www\./,'')}catch(e){return v}};
const siteLink=p=>p?.site?`<a class="site" href="${esc(webUrl(p.site))}" target="_blank" rel="noopener">${esc(webHost(p.site))} ↗</a>`:'';
function openFiche(id){PFID=pById(id)?.id;if(PFID==null)return;qFlag('fiche');renderFiche();$('pfM').classList.add('show')}
function closeFiche(){$('pfM').classList.remove('show');PFID=null;renderAll()}
function renderFiche(){const p=pById(PFID);if(!p)return;const mk=()=>{p.maj=new Date().toISOString();touch()};
 $('pfTitle').textContent='Fiche';
 const ini=(p.nom||'?').split(/\s+/).map(w=>w[0]).join('').slice(0,2).toUpperCase();
 $('pfAv').style.backgroundImage=p.photo?`url("${p.photo}")`:'';$('pfAv').textContent=p.photo?'':ini;$('pfAv').style.background=p.photo?'':PAL[[...(p.nom||'')].reduce((a,c)=>a+c.charCodeAt(0),0)%PAL.length];
 if(p.photo){$('pfAv').style.backgroundImage=`url("${p.photo}")`;$('pfAv').style.backgroundSize='cover'}
 $('pfPhDel').classList.toggle('hide',!p.photo);
 [['pfNom','nom'],['pfTit','titre'],['pfTel','tel'],['pfMail','email'],['pfWeb','site'],['pfSrc','provenance'],['pfPub','public'],['pfPrb','probl'],['pfNotes','notes']].forEach(([id,k])=>{$(id).value=p[k]||'';
  $(id).oninput=e=>{p[k]=e.target.value;if(k=='nom'&&!p.nom.trim())return;mk();if(['email','site','tel'].includes(k))links()}});
 $('pfTel').value=fmtTel(p.tel);$('pfTel').onchange=e=>{const f=fmtTel(e.target.value);if(f!==e.target.value){e.target.value=f;p.tel=f;mk()}};
 $('pfNom').onchange=e=>{if(!e.target.value.trim()){p.nom='Sans nom';e.target.value=p.nom;mk()}};
 const links=()=>{$('pfIcons').innerHTML=[p.email?`<a class="pfi" href="mailto:${esc(p.email)}" title="Écrire un e-mail">${SVGI.mail}</a>`:'',p.site?`<a class="pfi" href="${esc(webUrl(p.site))}" target="_blank" rel="noopener" title="Voir le site">${SVGI.web}</a>`:'',p.tel&&IS_TOUCH?`<a class="pfi" href="tel:${esc(p.tel.replace(/[^\d+]/g,''))}" title="Appeler">${SVGI.tel}</a>`:''].join('')};links();
 [['pfSrc','provenance'],['pfPub','public'],['pfPrb','probl']].forEach(([id,k])=>{const inp=$(id),M=$(id+'M'),vals=()=>[...new Set(DB.personnes.filter(x=>x!==p).map(x=>(x[k]||'').trim()).filter(Boolean))].sort(byName);
  const show=all=>{const q=all?'':inp.value.trim().toLowerCase(),V=vals().filter(v=>!q||v.toLowerCase().includes(q));
   M.innerHTML=V.length?V.map(v=>`<div data-v="${esc(v)}">${esc(v)}</div>`).join(''):`<div class="e">${vals().length?'Aucune valeur proche : la tienne sera ajoutée':'Pas encore de valeur : la première sera proposée ensuite'}</div>`;M.classList.add('show');
   M.querySelectorAll('[data-v]').forEach(d=>d.onmousedown=ev=>{ev.preventDefault();inp.value=d.dataset.v;p[k]=d.dataset.v;mk();M.classList.remove('show')})};
  inp.parentNode.querySelector('.cmbb').onmousedown=ev=>{ev.preventDefault();M.classList.contains('show')?M.classList.remove('show'):(inp.focus(),show(true))};
  inp.onfocus=()=>show(!inp.value.trim());inp.addEventListener('input',()=>show(false));inp.onblur=()=>setTimeout(()=>M.classList.remove('show'),120);
  inp.onkeydown=ev=>{if(ev.key=='Escape')M.classList.remove('show')}});
 [['pfRecIn','reco_in'],['pfRecAsk','reco_dem']].forEach(([id,k])=>{$(id).checked=!!p[k];$(id).onchange=e=>{if(e.target.checked)p[k]=true;else delete p[k];mk()}});
 const auto=autoStage(p.id),cur=stageOf(p),manual=p.etape?.v&&cur==p.etape.v;
 $('pfEt').innerHTML=`<option value="">Automatique : ${ETL[auto]}</option>`+ETAPES.map(([k,l])=>`<option value="${k}" ${manual&&k==cur?'selected':''}>${l}</option>`).join('');
 $('pfEt').onchange=e=>{p.etape=e.target.value?{v:e.target.value,at:new Date().toISOString()}:null;mk()};
 const A=openActs(p.id),t=today();
 $('pfActs').innerHTML=A.map(a=>`<div class="pfa"><div class="ck" data-adone="${a.id}" title="Marquer comme réalisée">✓</div><span>${esc(a.a||'Action')}</span><span class="d ${a.d&&a.d<t?'late':''}">${a.d?dShort(a.d):'sans date'}</span></div>`).join('')||'<div class="hint" style="margin:0">Aucune action prévue.</div>';
 $('pfActs').querySelectorAll('[data-adone]').forEach(c=>c.onclick=()=>{const a=DB.actions.find(x=>String(x.id)===c.dataset.adone);a.s='realisee';a.maj=new Date().toISOString();touch();renderFiche();toast('Action réalisée ✓')});
 $('pfADate').value=addDays(t,7);$('pfANew').value='';
 $('pfAAdd').onclick=()=>{const txt=$('pfANew').value.trim();if(!txt){$('pfANew').focus();return}
  DB.actions.push({id:nextId(DB.actions),p:'Relance',a:txt,d:$('pfADate').value||'',r:'',s:'encours',pid:p.id,maj:new Date().toISOString()});touch();renderFiche()};
 $('pfANew').onkeydown=e=>{if(e.key=='Enter')$('pfAAdd').click()};
 const all=pEntries(p.id),st=stats(all),l=lastContact(p.id);
 $('pfSum').innerHTML=[[l?dShort(l.date):'—','dernier contact'],[n1(st.h)+' h','de coaching'],[all.filter(e=>e.type=='conversation').length,'conversations'],[all.filter(e=>e.type=='session').length,'sessions'],[st.ca?eur(st.ca):'—','contrat'],[all[0]?dShort(all[0].date):'—','premier contact']].map(([v,k])=>`<div><b>${v}</b>${k}</div>`).join('');
 $('pfTL').innerHTML=timelineSVG(all);$('pfAis').innerHTML=aisBlock(all);
 const K=contractOf(p.id);$('pfKS').classList.toggle('hide',!K);
 if(K){$('pfK').innerHTML=`<div class="pfk"><div><b>${eur(K.eur)}</b>${K.e.engagement_mois?` · ${K.e.engagement_mois} mois`:''} · ${contractTxt(K)}${contractBar(K)}</div>
   <label class="pflab">Début<input class="fin" type="date" id="pfKD" value="${K.debut}"></label><label class="pflab">Séances prévues<input class="fin" type="number" min="1" id="pfKN" value="${K.prevues||''}" placeholder="—"></label>
   <label class="pflab">Durée<select class="fin" id="pfKM">${[1,2,3,4,5,6,9,12].map(m=>`<option value="${m}" ${m==K.e.engagement_mois?'selected':''}>${m} mois</option>`).join('')}</select></label></div>`;
  const up=()=>{K.e.maj=new Date().toISOString();touch();clearTimeout(up.t);up.t=setTimeout(renderFiche,0)};
  $('pfKD').onchange=e=>{K.e.debut=e.target.value||K.e.date;up()};$('pfKN').onchange=e=>{K.e.seances=+e.target.value||null;up()};$('pfKM').onchange=e=>{K.e.engagement_mois=+e.target.value;up()}}
 $('pfArch').textContent=p.archive?'Réactiver':'Archiver';
 $('pfArch').onclick=()=>{p.archive=!p.archive;mk();renderFiche();toast(p.archive?`${p.nom} archivé`:`${p.nom} réactivé`)};
 $('pfSeeE').onclick=()=>{const id=p.id;closeFiche();F.p.clear();F.p.add(id);goTab('list')};
 $('pfDel').onclick=()=>delPerson(p)}
function delPerson(p){const n=E().filter(e=>e.pid==p.id).length,en=LANG==='en';
 const msg=en?`Delete ${p.nom}?\n\n${n?`${n} entr${n>1?'ies are':'y is'} kept (your hours and statistics do not change), with no person attached.`:'No entry is linked to this person.'}\nThis cannot be undone.`
  :`Supprimer ${p.nom} ?\n\n${n?`${n>1?`Ses ${n} saisies sont conservées`:'Sa saisie est conservée'} (tes heures et statistiques ne changent pas), sans personne associée.`:'Aucune saisie ne lui est liée.'}\nCette action est définitive.`;
 if(!confirm(msg))return;const now=new Date().toISOString();
 E().forEach(e=>{if(e.pid==p.id){e.pid=null;e.psup=true;e.maj=now}});(DB.actions||[]).forEach(a=>{if(a.pid==p.id){delete a.pid;a.maj=now}});
 DB.personnes=DB.personnes.filter(x=>x.id!==p.id);DB.supprimes.p[String(p.id)]=now;F.p.delete(p.id);
 closeFiche();toast(en?`${p.nom} deleted`:`${p.nom} supprimé·e`)}
$('pfClose').onclick=closeFiche;$('pfOk').onclick=closeFiche;$('pfM').onclick=e=>{if(e.target==$('pfM'))closeFiche()};

/* ---------- photo : recadrage en disque + compression ---------- */
const CR={img:null,z:1,ox:0,oy:0};
function crDraw(cv,size,overlay){const g=cv.getContext('2d'),im=CR.img,b=300/Math.min(im.width,im.height),s=b*CR.z*(size/300),w=im.width*s,h=im.height*s;
 g.fillStyle='#fff';g.fillRect(0,0,size,size);g.drawImage(im,size/2-w/2+CR.ox*size/300,size/2-h/2+CR.oy*size/300,w,h);
 if(overlay){g.fillStyle='rgba(20,20,22,.55)';g.beginPath();g.rect(0,0,size,size);g.arc(size/2,size/2,size/2-6,0,Math.PI*2,true);g.fill('evenodd');
  g.strokeStyle='rgba(255,255,255,.9)';g.lineWidth=2;g.beginPath();g.arc(size/2,size/2,size/2-6,0,Math.PI*2);g.stroke()}}
function crClamp(){const im=CR.img,b=300/Math.min(im.width,im.height),w=im.width*b*CR.z,h=im.height*b*CR.z,mx=Math.max(0,(w-300)/2),my=Math.max(0,(h-300)/2);
 CR.ox=Math.max(-mx,Math.min(mx,CR.ox));CR.oy=Math.max(-my,Math.min(my,CR.oy))}
$('pfPh').onclick=()=>$('pfFile').click();$('pfAv').onclick=()=>$('pfFile').click();
$('pfPhDel').onclick=()=>{const p=pById(PFID);delete p.photo;p.maj=new Date().toISOString();touch();renderFiche()};
$('pfFile').onchange=e=>{CRT=null;const f=e.target.files[0];e.target.value='';if(!f)return;const fr=new FileReader();fr.onload=()=>{const im=new Image();im.onload=()=>{CR.img=im;CR.z=1;CR.ox=0;CR.oy=0;$('crZoom').value=1;crDraw($('crCv'),300,true);$('cropM').classList.add('show')};im.onerror=()=>toast('Image non reconnue');im.src=fr.result};fr.readAsDataURL(f)};
$('crZoom').oninput=e=>{CR.z=+e.target.value;crClamp();crDraw($('crCv'),300,true)};
(()=>{const cv=$('crCv');let d=null;const sc=()=>300/cv.getBoundingClientRect().width;
 cv.onpointerdown=e=>{d={x:e.clientX,y:e.clientY,ox:CR.ox,oy:CR.oy};cv.setPointerCapture(e.pointerId)};
 cv.onpointermove=e=>{if(!d)return;CR.ox=d.ox+(e.clientX-d.x)*sc();CR.oy=d.oy+(e.clientY-d.y)*sc();crClamp();crDraw(cv,300,true)};
 cv.onpointerup=()=>d=null;cv.onwheel=e=>{e.preventDefault();CR.z=Math.max(1,Math.min(4,CR.z*(e.deltaY<0?1.06:.94)));$('crZoom').value=CR.z;crClamp();crDraw(cv,300,true)}})();
$('crOk').onclick=()=>{if(CRT=='vic'){const c=document.createElement('canvas');c.width=c.height=360;crDraw(c,360,false);if(VICE)VICE.v.img=c.toDataURL('image/jpeg',.8);CRT=null;$('cropM').classList.remove('show');if(VICE)renderVic();return}
 if(CRT=='coach'){const c=document.createElement('canvas');c.width=c.height=240;crDraw(c,240,false);CO().photo=c.toDataURL('image/jpeg',.82);CRT=null;touch();$('cropM').classList.remove('show');renderCoEdit();renderAll();toast('Photo enregistrée');return}
 const c=document.createElement('canvas');c.width=c.height=160;crDraw(c,160,false);const p=pById(PFID);
 p.photo=c.toDataURL('image/jpeg',.8);p.maj=new Date().toISOString();touch();$('cropM').classList.remove('show');renderFiche();toast(`Photo enregistrée (${Math.round(p.photo.length*.75/1024)} Ko)`)};
$('crClose').onclick=()=>{CRT=null;$('cropM').classList.remove('show')};

/* ---------- 2.3.0 : choix d'une personne (champ avec suggestions, réutilisé partout) ----------
   Accents et majuscules ignorés ; débuts de mots d'abord, puis le reste ; à rang égal, les personnes récentes.
   « + Créer « … » » quand aucun nom ne correspond exactement. */
const LONGCOM=k=>k=='reseau';
const fitTA=ta=>{if(!ta)return;ta.style.height='auto';if(ta.scrollHeight)ta.style.height=ta.scrollHeight+2+'px'};
const fold=s=>String(s||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/\s+/g,' ').trim();
const PSPLIT=/[\s'’.\-]+/;
function pLast(){const m={};E().forEach(e=>{if(e.pid!=null&&(!m[e.pid]||e.date>m[e.pid]))m[e.pid]=e.date});return m}
function pSearch(q,o={}){const Q=fold(q),toks=Q.split(PSPLIT).filter(Boolean),last=pLast(),boost=(o.boost||[]).map(String),L=[];
 DB.personnes.forEach(p=>{const n=fold(p.nom),w=n.split(PSPLIT).filter(Boolean);let r;
  if(!toks.length){if(p.archive&&p.id!=o.cur)return;r=0}
  else if(toks.every(t=>w.some(x=>x.startsWith(t))))r=0;
  else if(n.includes(Q)||toks.every(t=>n.includes(t)))r=1;else return;
  const b=boost.indexOf(String(p.id));L.push({p,r,a:p.archive?1:0,b:b<0?1e9:b,d:last[p.id]||''})});
 L.sort((x,y)=>x.r-y.r||x.a-y.a||x.b-y.b||y.d.localeCompare(x.d)||byName(x.p.nom,y.p.nom));
 return L.map(x=>x.p)}
const PK={el:null,inp:null,anchor:null,cfg:null,items:[],i:0};
function pkClose(){if(!PK.el)return;PK.el.remove();PK.el=null;PK.inp=null;PK.anchor=null;PK.cfg=null}
function pkPos(){if(!PK.el)return;const r=PK.anchor.getBoundingClientRect(),el=PK.el,W=innerWidth,H=innerHeight;
 if(!r.width&&!r.height){pkClose();return}
 el.style.minWidth=Math.max(250,PK.cfg.input?r.width:0)+'px';const w=el.offsetWidth,h=el.offsetHeight;
 el.style.left=Math.max(8,Math.min(r.left,W-w-8))+'px';
 el.style.top=(H-r.bottom<h+12&&r.top>h+12?r.top-h-4:r.bottom+4)+'px'}
function pkRender(){if(!PK.el)return;const c=PK.cfg,q=PK.inp.value.trim(),Q=fold(q);
 const res=pSearch(q,c).slice(0,8),exact=Q&&DB.personnes.some(p=>fold(p.nom)===Q),it=[];
 if(c.none&&!q&&c.cur!=null)it.push({k:'none'});
 res.forEach(p=>it.push({k:'p',p}));if(q&&!exact)it.push({k:'new',v:q.replace(/\s+/g,' ')});
 PK.items=it;if(PK.i>=it.length)PK.i=it.length-1;if(PK.i<0)PK.i=0;
 const qt=v=>LANG==='en'?`“${esc(v)}”`:`« ${esc(v)} »`;
 PK.el.querySelector('.ppl').innerHTML=(!q&&res.length?`<div class="pph">Récentes</div>`:'')+it.map((x,n)=>`<button type="button" class="ppi ${x.k=='new'?'new':x.k=='none'?'none':''} ${x.k=='p'&&x.p.id==c.cur?'cur':''} ${n==PK.i?'on':''}" data-n="${n}">${
  x.k=='none'?'— Aucune personne':x.k=='new'?`<span>+ Créer</span><span data-noi18n>${qt(x.v)}</span>`:`<span>${esc(x.p.nom)}</span>${x.p.archive?'<small>archivée</small>':''}`}</button>`).join('')
  +(!it.length?`<div class="ppe">Tape un prénom ou un nom</div>`:'');
 PK.el.querySelectorAll('.ppi').forEach(b=>{b.onpointerdown=e=>e.preventDefault();b.onclick=()=>pkPick(+b.dataset.n);b.onmouseenter=()=>{PK.i=+b.dataset.n;PK.el.querySelectorAll('.ppi').forEach(x=>x.classList.toggle('on',x===b))}});
 pkPos()}
function pkPick(n){const x=PK.items[n],c=PK.cfg;if(!x||!c)return;let id=null,created=false;
 if(x.k=='p')id=x.p.id;
 else if(x.k=='new'){let p=DB.personnes.find(y=>fold(y.nom)===fold(x.v));if(!p){p={id:nextId(DB.personnes),nom:x.v};DB.personnes.push(p);touch();created=true;toast(`Nouvelle personne : ${p.nom}`)}id=p.id}
 pkClose();c.onPick(id,created)}
function pkKey(e){if(!PK.el)return;const N=PK.items.length;
 if(e.key=='ArrowDown'||e.key=='ArrowUp'){e.preventDefault();if(!N)return;PK.i=(PK.i+(e.key=='ArrowDown'?1:-1)+N)%N;PK.el.querySelectorAll('.ppi').forEach((b,n)=>{b.classList.toggle('on',n==PK.i);if(n==PK.i)b.scrollIntoView({block:'nearest'})})}
 else if(e.key=='Enter'){e.preventDefault();if(N)pkPick(PK.i)}
 else if(e.key=='Escape'){e.stopPropagation();e.preventDefault();const a=PK.anchor,own=!PK.cfg.input;pkClose();if(own)a?.focus?.()}
 else if(e.key=='Tab')pkClose()}
/* anchor : le champ (cfg.input) ou le bouton sous lequel ouvrir une petite fenêtre avec son propre champ */
function pkOpen(anchor,cfg){if(PK.el&&PK.anchor===anchor){if(!cfg.input){pkClose();return}PK.cfg=cfg;pkRender();return}pkClose();
 const el=document.createElement('div');el.className='ppk';el.innerHTML=(cfg.input?'':`<input class="fin ppq" placeholder="Rechercher ou créer une personne…" autocomplete="off" spellcheck="false">`)+'<div class="ppl"></div>';
 document.body.appendChild(el);PK.el=el;PK.anchor=anchor;PK.cfg=cfg;PK.i=0;PK.inp=cfg.input?anchor:el.querySelector('.ppq');
 if(!cfg.input){PK.inp.oninput=()=>{PK.i=0;pkRender()};PK.inp.onkeydown=pkKey;pkRender();PK.inp.focus()}else pkRender()}
document.addEventListener('pointerdown',e=>{if(PK.el&&!PK.el.contains(e.target)&&e.target!==PK.inp&&e.target!==PK.anchor)pkClose()},true);
addEventListener('resize',()=>pkPos());addEventListener('scroll',e=>{if(PK.el&&!PK.el.contains(e.target))pkPos()},true);
$('mPQ').addEventListener('keydown',e=>{if(PK.el&&PK.inp===$('mPQ'))pkKey(e);else if(e.key=='Enter'&&$('mPQ').value.trim()){e.preventDefault();pkOpen($('mPQ'),mPQcfg())}});

/* ---------- popup ---------- */
/* durée libre, sans plafond : 2,5 / 2.5 → 2h30 · 2h30 / 2h / 2 h 30 → 2h30 · 150min / 150 mn / 150m → 2h30 · 1:30 → 1h30 · 14h → 14h · nombre seul : ≤ 10 = heures, sinon minutes */
function parseDur(x){x=String(x||'').trim().toLowerCase().replace(/\s+/g,'');if(!x)return null;let m;
 if(m=x.match(/^(\d+)(?:h|:)(\d{1,2})?(?:min|mn|m)?$/))return +m[1]*60+(+m[2]||0);
 if(m=x.match(/^(\d+(?:[.,]\d+)?)h$/))return Math.round(parseFloat(m[1].replace(',','.'))*60);
 if(m=x.match(/^(\d+)(?:min|mn|m)$/))return +m[1];
 if(m=x.match(/^(\d+(?:[.,]\d+)?)$/)){const v=parseFloat(m[1].replace(',','.'));return v<=10?Math.round(v*60):Math.round(v)}
 return null}
$('mDurX').oninput=()=>{const v=parseDur($('mDurX').value),o=$('mDurOk');if(!$('mDurX').value.trim()){o.textContent='';o.className='';return}
 if(v&&v>0){S.dur=v;o.textContent='= '+fmtD(v);o.className='';$('mDurs').querySelectorAll('.chip').forEach(c=>c.classList.remove('on'))}else{o.textContent='format non reconnu';o.className='bad'}};
const S={type:'session',dur:90,pid:null,cdur:3,ais:{},pa:{},rem:{}};let NEWP=[],MREC=[];
function mChips(el,items,cur,cls,cb){$(el).innerHTML=items.map(it=>`<button class="chip ${cls||''} ${it.v===cur?'on':''} ${it.add?'add':''}" style="${it.c?`--c:${it.c};--t:${tc(it.c)}`:''}">${esc(it.l)}</button>`).join('');[...$(el).children].forEach((b,i)=>b.onclick=()=>cb(items[i].v))}
function renderModal(){const t=TM[S.type];
 renderTypeChips();
 mChips('mDurs',DURS.filter(d=>d<150).map(d=>({v:d,l:fmtD(d)})),S.dur,'',v=>{S.dur=v;$('mDurX').value='';$('mDurOk').textContent='';renderModal()});
 const recent=[...new Set([...NEWP,...[...E()].sort((a,b)=>b.date.localeCompare(a.date)).filter(e=>e.pid!=null&&(S.type=='supervision'?e.type=='supervision':e.type!='supervision')).map(e=>e.pid)])].slice(0,10);
 const isArch=id=>DB.personnes.find(x=>x.id==id)?.archive;
 for(let i=recent.length-1;i>=0;i--)if(isArch(recent[i])&&recent[i]!==S.pid)recent.splice(i,1);
 if(S.pid!=null&&!recent.includes(S.pid))recent.unshift(S.pid);
 MREC=recent;
 mChips('mPeople',recent.map(id=>({v:id,l:pname(id)})),S.pid,'',v=>{S.pid=S.pid===v?null:v;renderModal()});
 {const c=$('mCom'),lg=LONGCOM(S.type);if(!lg&&/\n/.test(c.value))c.value=c.value.replace(/\s*\n+\s*/g,' · ');
  c.rows=lg?3:1;c.placeholder=lg?"Qui, dans quel contexte, ce qui s'est dit, la suite…":'1 ligne : thème, déclic, pattern repéré…';fitTA(c)}
 mChips('mCdur',[1,2,3,6,9,12].map(n=>({v:n,l:n+' mois'})),S.cdur,'',v=>{S.cdur=v;renderModal()});
 $('mPB').classList.toggle('hide',!t.p);$('mCR').classList.toggle('hide',!t.cr);$('mProp').classList.toggle('hide',!t.prop);$('mInv').classList.toggle('hide',S.type!='invitation');$('mSup').classList.toggle('hide',S.type!='supervision');
 if(S.type=='supervision'){const d=+CFG().finances.supDefaut||0;$('mCout').placeholder=d?`Prix moyen : ${d} €`:'Montant €'}
 const pdh=pdForm(S,S.type);$('mAis').classList.toggle('hide',!pdh);$('mPD').innerHTML=pdh;bindPdForm($('mPD'),S,renderModal);
 const pool=S.type=='supervision'?supPool().length:0;$('mSupP').classList.toggle('hide',!pool);if(pool){$('mSupJ').onchange=()=>$('mSupL').classList.toggle('hide',!$('mSupJ').checked);renderSupPrep('mSupL',true)}}
/* 2.3.0 : recherche de personne dans la saisie (les boutons gardent les personnes récentes) */
const mPQcfg=()=>({input:1,boost:[...NEWP,...MREC],cur:S.pid,onPick:(id,created)=>{if(created)NEWP.unshift(id);S.pid=id;$('mPQ').value='';pkClose();renderModal()}});
$('mPQ').oninput=()=>{PK.i=0;if($('mPQ').value.trim())pkOpen($('mPQ'),mPQcfg());else pkClose()};
$('mPQ').onfocus=()=>{if($('mPQ').value.trim())pkOpen($('mPQ'),mPQcfg())};
/* « Ce qu'on a vu » : une ligne, ou plusieurs pour les types à notes longues (rencontre réseau) */
$('mCom').onkeydown=e=>{if(e.key=='Enter'&&!LONGCOM(S.type)){e.preventDefault()}};
$('mCom').oninput=()=>{const c=$('mCom');if(!LONGCOM(S.type)&&/\n/.test(c.value))c.value=c.value.replace(/\s*\n+\s*/g,' ');fitTA(c)};
['tCR','tSY','tNON'].forEach(i=>$(i).onclick=()=>$(i).classList.toggle('on'));
const openM=ty=>{if(typeof ty=='string'&&TM[ty]){S.type=ty;S.dur=TM[ty].d}$('fDate').value=today();$('mPQ').value='';$('mDurX').value='';$('mDurOk').textContent='';S.ais={};S.pa={};S.rem={};$('mSupJ').checked=true;$('mSupL').classList.remove('hide');renderModal();$('ov').classList.add('show')},closeM=()=>{pkClose();$('ov').classList.remove('show')};
$('openLog').onclick=()=>openM();$('closeLog').onclick=closeM;$('ov').onclick=e=>{if(e.target==$('ov'))closeM()};document.addEventListener('keydown',e=>{if(e.key=='Escape'){if($('cropM').classList.contains('show')){$('crClose').click()}else if($('vicDM').classList.contains('show'))$('vicDX').click();else if($('vicM').classList.contains('show'))$('vicX').click();else if($('pipeM').classList.contains('show'))$('pipeX').click();else if($('cel3').classList.contains('show'))$('c3ok')?.click();else if($('cel2').classList.contains('show'))$('c2ok')?.click();else if($('metM').classList.contains('show'))$('metX').click();else if($('coM').classList.contains('show'))$('coX').click();else if($('libM').classList.contains('show'))$('libX').click();else if($('pdeM').classList.contains('show'))$('pdeX').click();else if($('cmpM').classList.contains('show'))$('cmpX').click();else if($('cropM').classList.contains('show'))$('cropM').classList.remove('show');else if($('pfM').classList.contains('show'))closeFiche();else closeM()}});
$('mSave').onclick=()=>{const t=TM[S.type];
 if(pReq(S.type)&&S.pid==null){toast('Choisis la personne : elle est obligatoire pour ce type de saisie');return}
 const e={id:nextId(E()),maj:new Date().toISOString(),date:$('fDate').value||today(),type:S.type,dur:S.dur,pid:t.p?S.pid:null,com:$('mCom').value.trim(),...($('mNotes').value.trim()?{notes:$('mNotes').value.trim()}:{}),
  cr:!!t.cr&&$('tCR').classList.contains('on'),syn:!!t.cr&&$('tSY').classList.contains('on'),ais:t.ais&&Object.keys(S.ais).length?{...S.ais}:null};
 if(S.type=='supervision'){if($('mFree').checked){e.gratuit=true;e.cout=0}else if($('mCout').value!==''&&+$('mCout').value>0)e.cout=+$('mCout').value;$('mCout').value='';$('mFree').checked=false;$('mCout').disabled=false}
 if(S.type=='invitation'&&$('tNON').classList.contains('on'))e.non=true;$('tNON').classList.remove('on');
 if(t.prop){if(+$('mSea').value)e.seances=+$('mSea').value;$('mSea').value='';e.eur=+$('mEur').value||0;e.engagement_mois=S.cdur;e.statut='attente';$('mEur').value=''}
 {const c=cleanPd(S);if(c.pa)e.pa=c.pa;if(c.rem)e.rem=c.rem}
 let nsup=0;if(!SIMPLE()&&S.type=='supervision'&&supPool().length&&$('mSupJ').checked)nsup=attachSup(e);
 E().push(e);$('mCom').value='';$('mNotes').value='';['tCR','tSY'].forEach(i=>$(i).classList.remove('on'));
 closeM();touch();renderAll();toast(`${t.l}${S.dur?' · '+fmtD(S.dur):''} enregistrée${nsup?` · ${nsup} remarque${nsup>1?'s':''} jointe${nsup>1?'s':''}`:''}`)};

