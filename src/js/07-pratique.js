/* =========================================================
   PRATIQUE DÉLIBÉRÉE (1.5.0) : boussole d'aisance, focus, actions,
   remarques par compétence, préparation de la supervision
   ========================================================= */
const PD=()=>DB.pd;
const mById=id=>metrics().find(m=>String(m.id)===String(id));
const PAST={cours:'en cours',pause:'en pause',acquise:'★ acquise'};
const MAXF=3,MAXA=3;
const actTypes=a=>a.types&&a.types.length?a.types:COACH;
const actsCours=()=>PD().lib.filter(a=>a.st=='cours');
const byDate=(a,b)=>a.date.localeCompare(b.date)||a.id-b.id;
function actRes(a,n=10){const all=E().filter(e=>e.pa&&e.pa[a.id]!=null).sort(byDate).map(e=>e.pa[a.id]),last=all.slice(-n);
 return{last,n:all.length,pct:last.length?Math.round(last.reduce((s,v)=>s+v,0)/2/last.length*100):null}}
function aisNow(mid){const s=E().filter(e=>e.ais&&e.ais[mid]).sort(byDate).map(e=>e.ais[mid]);const avg=a=>a.reduce((x,y)=>x+y,0)/a.length;
 const cur=s.slice(-5),pr=s.slice(-10,-5),v=cur.length?avg(cur):null,p=pr.length?avg(pr):null;
 return{s,v,p,tr:v==null||p==null?0:v-p>=.3?1:v-p<=-.3?-1:0}}
const trTxt=t=>t>0?' ↗':t<0?' ↘':'';
const starsH=(v,cls)=>`<span class="pdst ${cls||''}">${[1,2,3,4,5].map(j=>`<i class="${v!=null&&j<=Math.round(v)?'on':''}">★</i>`).join('')}</span>`;
const dotsH=a=>`<span class="pdots">${a.last.map(v=>`<i class="r${v}"></i>`).join('')}${'<i class="r-"></i>'.repeat(Math.max(0,10-a.last.length))}</span>`;
const typesTxt=a=>actTypes(a).map(k=>TM[k]?.l||k).join(', ').toLowerCase();
/* remarques retenues pour la prochaine supervision */
function supPool(){const R=[];E().forEach(e=>{if(!e.rem)return;Object.entries(e.rem).forEach(([mid,r])=>{if(r&&r.sup&&!r.sid)R.push({e,mid,r,key:e.id+':'+mid})})});
 return R.sort((a,b)=>byDate(b.e,a.e))}
const prepOf=k=>{const P=PD().prep;if(!P[k])P[k]={on:true,t:''};return P[k]};

/* ---------- boussole d'aisance (graphique en toile, regroupé par discipline) ---------- */
const DISC_COL=['#C2416A','#2FA6AD','#4D8FB5','#9374C9','#D08A3C','#5E9E5A','#B5655B'];
function discGroups(M){const G=[];M.forEach(m=>{const d=(m.disc||'').trim();let g=G.find(x=>x.d.toLowerCase()==d.toLowerCase());if(!g){g={d,ms:[]};G.push(g)}g.ms.push(m)});
 let k=0;G.forEach(g=>{g.c=g.d?DISC_COL[k++%DISC_COL.length]:null});return G}
function boussoleSVG(th){th=th||'app';const jeu=th=='jeu',G=discGroups(mActive()),L=G.flatMap(g=>g.ms.map(m=>({m,g})));if(L.length<3)return '';
 const W=820,H=560,cx=W/2,cy=H/2+4,R=185,n=L.length,ang=i=>-Math.PI/2+i*2*Math.PI/n,F=PD().focus.map(String),P=th;
 const all=L.map(({m,g})=>({m,g,...aisNow(m.id),f:F.includes(String(m.id))}));
 const txt=jeu?'#E8EFEF':'var(--jet)',sub=jeu?'#9DB5B8':'#6B7275',grid=jeu?'rgba(255,255,255,.13)':'#E6E3EC',base=jeu?'#2BC1C8':'var(--am)';
 let g=`<defs><linearGradient id="bsw${P}" x1="0" y1="0" x2="1" y2=".35"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".42" stop-color="#fff" stop-opacity="0"/><stop offset=".5" stop-color="#fff" stop-opacity="${jeu?.3:.55}"/><stop offset=".58" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#fff" stop-opacity="0"/><animateTransform attributeName="gradientTransform" type="translate" values="-1 0;1 0;1 0" keyTimes="0;.55;1" dur="6s" repeatCount="indefinite"/></linearGradient>`;
 if(jeu){g+=`<radialGradient id="pf${P}" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#F1DCA4" stop-opacity=".55"/><stop offset=".6" stop-color="#C2416A" stop-opacity=".35"/><stop offset="1" stop-color="#822239" stop-opacity=".25"/></radialGradient>
  <filter id="gl${P}" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="4" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
  <filter id="sh${P}" x="-50%" y="-50%" width="200%" height="200%"><feDropShadow dx="0" dy="2" stdDeviation="2.5" flood-color="#000" flood-opacity=".35"/></filter>`;
  G.forEach((gr,i)=>{const c=gr.c||base;g+=`<radialGradient id="nd${P}${i}" cx="35%" cy="30%" r="70%"><stop offset="0" stop-color="#fff"/><stop offset=".35" stop-color="${c}"/><stop offset="1" stop-color="${c}" stop-opacity=".8"/></radialGradient>`})}
 g+='</defs>';
 if(G.some(x=>x.d)){let k=0;G.forEach((gr,gi)=>{const len=gr.ms.length;if(gr.d){const a0=ang(k)-Math.PI/n+.04,a1=ang(k+len-1)+Math.PI/n-.04,rr=R+14,large=(a1-a0)>Math.PI?1:0;
   g+=`<path d="M${cx+Math.cos(a0)*rr} ${cy+Math.sin(a0)*rr} A${rr} ${rr} 0 ${large} 1 ${cx+Math.cos(a1)*rr} ${cy+Math.sin(a1)*rr}" stroke="${gr.c}" stroke-width="${jeu?5:2.5}" fill="none" stroke-linecap="round" ${jeu?`filter="url(#gl${P})"`:''}/>`;
   const am=(a0+a1)/2,rt=R+26,bottom=Math.sin(am)>0.15,p0=bottom?a1:a0,p1=bottom?a0:a1;
   const arcL=rt*(a1-a0),nc=gr.d.length,fs=Math.max(8,Math.min(12.5,(arcL*.94/nc-(nc>14?1:2))/.68)),ls=fs<11?1:2;
   g+=`<path id="ap${P}${gi}" d="M${cx+Math.cos(p0)*rt} ${cy+Math.sin(p0)*rt} A${rt} ${rt} 0 ${large} ${bottom?0:1} ${cx+Math.cos(p1)*rt} ${cy+Math.sin(p1)*rt}" fill="none"/><text dy="${bottom?10:-2}" style="font-size:${fs.toFixed(1)}px;font-weight:900;letter-spacing:${ls}px;fill:${gr.c}"><textPath href="#ap${P}${gi}" startOffset="50%" text-anchor="middle">${esc(gr.d.toUpperCase())}</textPath></text>`}k+=len})}
 [1,2,3,4,5].forEach(r=>{g+=`<polygon points="${all.map((_,i)=>[cx+Math.cos(ang(i))*R*r/5,cy+Math.sin(ang(i))*R*r/5].join(',')).join(' ')}" fill="none" stroke="${grid}"/>`});
 all.forEach((_,i)=>g+=`<line x1="${cx}" y1="${cy}" x2="${cx+Math.cos(ang(i))*R}" y2="${cy+Math.sin(ang(i))*R}" stroke="${grid}"/>`);
 const pts=all.map((s,i)=>[cx+Math.cos(ang(i))*R*(s.v||0)/5,cy+Math.sin(ang(i))*R*(s.v||0)/5]),PP=pts.map(p=>p.join(',')).join(' ');
 g+=jeu?`<polygon points="${PP}" fill="url(#pf${P})" stroke="#D9B66A" stroke-width="2.5" stroke-linejoin="round" filter="url(#gl${P})"/>`:`<polygon points="${PP}" fill="var(--am)" fill-opacity=".1" stroke="var(--am)" stroke-width="2" stroke-linejoin="round"/>`;
 g+=`<polygon points="${PP}" fill="url(#bsw${P})"/>`;
 all.forEach((s,i)=>{const a=ang(i),[x,y]=pts[i],c=s.g.c||base,gi=G.indexOf(s.g);
  if(s.f)g+=jeu?`<circle cx="${x}" cy="${y}" r="15" fill="none" stroke="#F1DCA4" stroke-width="2" filter="url(#gl${P})"><animate attributeName="stroke-opacity" values="1;.4;1" dur="3s" repeatCount="indefinite"/></circle>`
   :`<circle cx="${x}" cy="${y}" r="11" fill="none" stroke="var(--am)" stroke-width="1.5"><animate attributeName="stroke-opacity" values="1;.4;1" dur="3s" repeatCount="indefinite"/></circle>`;
  g+=jeu?`<circle cx="${x}" cy="${y}" r="${s.v?9:6}" fill="${s.v?`url(#nd${P}${gi})`:'none'}" stroke="${c}" stroke-width="2" ${s.v?`filter="url(#sh${P})"`:'stroke-dasharray="3 3"'}/>`
   :`<circle cx="${x}" cy="${y}" r="${s.v?5.5:4}" fill="${s.v?c:'#fff'}" stroke="${c}" stroke-width="1.5" ${s.v?'':'stroke-dasharray="2 2"'}/>`;
  const lx=cx+Math.cos(a)*(R+62),ly=cy+Math.sin(a)*(R+54),an=Math.cos(a)>.25?'start':Math.cos(a)<-.25?'end':'middle';
  g+=`<g class="bslab" data-cmp="${esc(s.m.id)}"><text x="${lx}" y="${ly-4}" text-anchor="${an}" style="font-size:16px;font-weight:800;fill:${txt}">${esc(s.m.l)}</text>`;
  if(jeu){g+=`<text x="${lx}" y="${ly+15}" text-anchor="${an}" style="font-size:16.5px;letter-spacing:1.5px">${[1,2,3,4,5].map(j=>`<tspan style="fill:${s.v!=null&&j<=Math.round(s.v)?'#E2B54E':'rgba(255,255,255,.22)'}">★</tspan>`).join('')}${s.v==null?'<tspan style="font-size:12px;font-weight:700;fill:#9DB5B8;letter-spacing:0"> jamais notée</tspan>':''}${s.tr>0?'<tspan style="font-size:13px;fill:#2BC1C8;letter-spacing:0"> ↗</tspan>':s.tr<0?'<tspan style="font-size:13px;fill:#E0466C;letter-spacing:0"> ↘</tspan>':''}</text>`;
   if(s.f){const ww=46,fx=an=='start'?lx:an=='end'?lx-ww:lx-ww/2;g+=`<rect x="${fx}" y="${ly+21}" width="${ww}" height="15" rx="7.5" fill="#D9B66A"/><text x="${fx+ww/2}" y="${ly+32}" text-anchor="middle" style="font-size:9.5px;font-weight:900;fill:#3A2A08;letter-spacing:.8px">FOCUS</text>`}}
  else g+=`<text x="${lx}" y="${ly+14}" text-anchor="${an}" style="font-size:14.5px;fill:${sub}">${s.v!=null?n1(s.v)+' / 5'+trTxt(s.tr):'jamais notée'}${s.f?' · <tspan style="fill:var(--am);font-weight:800">focus</tspan>':''}</text>`;
  g+='</g>'});
 return `<svg viewBox="0 0 ${W} ${H}" width="100%" style="font-family:Nunito,sans-serif;display:block">${g}</svg>`}
function boussoleList(){const F=PD().focus.map(String);return `<div class="bslist">${mActive().map(m=>{const a=aisNow(m.id);return `<button class="bsrow" data-cmp="${esc(m.id)}"><b>${esc(m.l)}</b>${starsH(a.v)}<span>${a.v!=null?n1(a.v)+' / 5'+trTxt(a.tr):'jamais notée'}${F.includes(String(m.id))?' · <em>focus</em>':''}</span></button>`}).join('')||'<div class="hint">Aucune compétence suivie : <button class="lnk0" data-mets style="text-decoration:underline">ajoute tes compétences</button>.</div>'}</div>`}

/* ---------- onglet Pratique délibérée ---------- */
function pdSideHTML(){const F=PD().focus,M=mActive(),AC=actsCours();
 const fo=M.filter(m=>!F.map(String).includes(String(m.id)));
 return `<div class="pdh">Focus du moment <small>${MAXF} au maximum</small></div>
  <div class="pdfcs">${F.map(id=>{const m=mById(id);return m?`<span class="pdfc"><button class="lnk0" data-cmp="${esc(id)}">${esc(m.l)}</button><b data-unf="${esc(id)}" title="Retirer ce focus">×</b></span>`:''}).join('')}
  ${F.length<MAXF&&fo.length?`<select class="sel pdadd" ><option value="">+ Ajouter un focus</option>${fo.map(m=>`<option value="${esc(m.id)}">${esc(m.l)}</option>`).join('')}</select>`:''}</div>
  ${!F.length?'<div class="hint" style="margin-top:4px">Choisis jusqu\'à 3 compétences à travailler en ce moment : elles apparaîtront en tête de chaque saisie, avec un espace pour noter ce que tu remarques.</div>':''}
  <div class="pdh" style="margin-top:16px">Actions en cours <small>${MAXA} au maximum, vérifiées à chaque saisie concernée</small></div>
  ${AC.map((a,i)=>{const r=actRes(a),m=mById(a.mid);return `<div class="pdac"><span class="an">${i+1}</span><div><b>${esc(a.a)}</b><span class="su">${m?esc(m.l)+' · ':''}${esc(typesTxt(a))}</span>
   <div class="rs">${dotsH(r)}<em>${r.pct!=null?r.pct+' %':'—'}</em><button class="lnk0 chg" data-chg="${a.id}">changer</button><button class="lnk0 chg" data-pause="${a.id}">mettre en pause</button></div></div></div>`}).join('')||'<div class="hint">Aucune action en cours. Une action, c\'est un geste précis et observable que tu décides de tenter à chaque entretien concerné.</div>'}
  ${AC.length?'<div class="pdlg">10 dernières saisies concernées :<i class="r2"></i>oui<i class="r1"></i>en partie<i class="r0"></i>non</div>':''}
  <div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:12px">${AC.length<MAXA?'<button class="addl" style="margin:0" data-addact>+ Ajouter une action</button>':''}<button class="btn2" data-lib>Bibliothèque d'actions · ${PD().lib.length}</button></div>`;}
function bindPdSide(R){
 R.querySelectorAll('[data-unf]').forEach(b=>b.onclick=()=>unFocus(b.dataset.unf));
 const af=R.querySelector('.pdadd');if(af)af.onchange=()=>{if(af.value)setFocus(af.value,true)};
 R.querySelectorAll('[data-chg]').forEach(b=>b.onclick=()=>openLib({slot:b.dataset.chg}));
 R.querySelectorAll('[data-pause]').forEach(b=>b.onclick=()=>{const a=PD().lib.find(x=>String(x.id)===b.dataset.pause);if(a){a.st='pause';a.maj=new Date().toISOString();touch();renderAll();toast('Action mise en pause : elle reste dans la bibliothèque')}});
 R.querySelectorAll('[data-addact]').forEach(b=>b.onclick=()=>openLib({}));
 R.querySelectorAll('[data-lib]').forEach(b=>b.onclick=()=>openLib({browse:1}));
 R.querySelectorAll('[data-cmp]').forEach(b=>b.onclick=()=>openCmp(b.dataset.cmp))}
function renderPD(){const M=mActive();
 $('pdBous').innerHTML=(M.length>=3?boussoleSVG('app'):boussoleList())+`<div class="pdleg">Note : moyenne de tes 5 dernières notes sur la compétence · ↗ ↘ tendance par rapport aux 5 précédentes · clique sur une compétence pour voir son historique.</div>`;
 const side=$('pdSide');side.innerHTML=pdSideHTML();bindPdSide(side);
 $('pdBous').querySelectorAll('[data-cmp]').forEach(b=>b.onclick=()=>openCmp(b.dataset.cmp));
 renderSupPrep('pdSup',false);
 const P=supPool();$('pdSupN').textContent=P.length||'';
}
function setFocus(id,on){const F=PD().focus;id=String(id);
 if(on){if(F.map(String).includes(id))return;if(F.length>=MAXF){toast(`${MAXF} focus maximum : retires-en un d'abord`);renderAll();return}F.push(mById(id)?.id??id)}
 else PD().focus=F.filter(x=>String(x)!==id);
 touch();renderAll()}
function unFocus(id){setFocus(id,false);const L=actsCours().filter(a=>String(a.mid)===String(id));
 if(L.length){L.forEach(a=>{a.st='pause';a.maj=new Date().toISOString()});touch();renderAll();toast(`${L.length>1?L.length+' actions liées mises':'Action liée mise'} en pause : ${L.length>1?'elles restent':'elle reste'} dans la bibliothèque`)}}

/* ---------- préparation de la supervision ---------- */
function renderSupPrep(el,inModal){const P=supPool(),box=$(el);if(!box)return;
 if(!P.length){box.innerHTML=`<div class="hint" style="margin:0">${inModal?'Aucune remarque retenue pour cette supervision.':'Aucune remarque retenue pour l\'instant. Dans une saisie, coche « Retenir pour la prochaine supervision » sous une remarque : elle arrivera ici.'}</div>`;return}
 const on=P.filter(x=>prepOf(x.key).on).length;
 box.innerHTML=`<div class="spcnt">${on} remarque${on>1?'s':''} retenue${on>1?'s':''} sur ${P.length}</div>`+P.map(x=>{const pr=prepOf(x.key),m=mById(x.mid);return `<div class="spi ${pr.on?'':'off'}" data-k="${x.key}">
  <label class="cb"><input type="checkbox" data-spon ${pr.on?'checked':''}><span><b>${esc(m?.l||'Compétence supprimée')}</b> · ${dShort(x.e.date)} · ${esc(TM[x.e.type]?.l||x.e.type)}${x.e.pid!=null?' · '+esc(pname(x.e.pid)):''}</span></label>
  <div class="spx">${esc(x.r.t||'')}</div>
  ${pr.on?`<textarea class="fin spt" data-spt rows="2" placeholder="Ce que je retiens de la supervision…">${esc(pr.t)}</textarea>${pr.t.trim()?`<button class="lnk0 addr" data-spact>→ En faire une action</button>`:''}`:''}</div>`}).join('')+
 (inModal?'':`<div style="margin-top:12px;display:flex;gap:10px;align-items:center;flex-wrap:wrap"><button class="cta" style="margin:0" data-supsave>Enregistrer la supervision</button><span class="hint" style="margin:0">Ouvre la saisie de supervision : les remarques cochées et ce que tu en retiens y sont joints. Les remarques décochées sortent de la liste et restent dans l'historique de leur compétence.</span></div>`);
 box.querySelectorAll('.spi').forEach(d=>{const k=d.dataset.k,pr=prepOf(k);
  d.querySelector('[data-spon]').onchange=ev=>{pr.on=ev.target.checked;touch();renderSupPrep(el,inModal);if(!inModal)$('pdSupN').textContent=supPool().length||''};
  const t=d.querySelector('[data-spt]');if(t){t.oninput=()=>{pr.t=t.value;touch()};t.onblur=()=>renderSupPrep(el,inModal)}
  const a=d.querySelector('[data-spact]');if(a)a.onclick=()=>{const[eid,mid]=k.split(':');openLib({nouveau:1,mid,txt:pr.t.trim()})}});
 const s=box.querySelector('[data-supsave]');if(s)s.onclick=()=>openM('supervision')}
/* rattache les remarques retenues à la saisie de supervision e */
function attachSup(e){const P=supPool();if(!P.length)return 0;let n=0;e.retours=[];
 P.forEach(x=>{const pr=prepOf(x.key);if(pr.on){e.retours.push({eid:x.e.id,mid:x.mid,t:(pr.t||'').trim()});x.r.sid=e.id;n++}else{x.r.sup=false}x.e.maj=new Date().toISOString();delete PD().prep[x.key]});
 if(!e.retours.length)delete e.retours;return n}

/* ---------- bloc « pratique délibérée » d'une saisie ---------- */
/* st = {pa:{idAction:2|1|0}, ais:{idComp:1..5}, rem:{idComp:{t,sup,sid?,open?}}} */
function pdForm(st,type){const t=TM[type]||{},AC=actsCours().filter(a=>actTypes(a).includes(type)),M=mActive(),F=PD().focus.map(String);
 const FM=M.filter(m=>F.includes(String(m.id))),OM=M.filter(m=>!F.includes(String(m.id)));let h='';
 const dots=m=>`<div class="dots">${[1,2,3,4,5].map(n=>`<span class="${n<=(st.ais[m.id]||0)?'on':''}" data-ais="${esc(m.id)}" data-n="${n}">${n}</span>`).join('')}</div>`;
 const remBox=(m,ph)=>{const r=st.rem[m.id]||{};return `<textarea class="fin pdta" data-remt="${esc(m.id)}" rows="3" placeholder="${ph}">${esc(r.t||'')}</textarea>
   ${r.sid?`<div class="pdsid">Vue en supervision le ${dShort(E().find(x=>x.id==r.sid)?.date||'')}</div>`:`<label class="cb"><input type="checkbox" data-rems="${esc(m.id)}" ${r.sup?'checked':''}><span>Retenir pour la prochaine supervision</span></label>`}`};
 if(AC.length)h+=`<div class="lab">Actions de pratique délibérée</div>`+AC.map(a=>{const v=st.pa[a.id];return `<div class="pdq"><span>${esc(a.a)}</span><span class="pdseg">${[[2,'Oui'],[1,'En partie'],[0,'Non']].map(([n,l])=>`<b class="${v===n?'on':''}" data-pa="${a.id}" data-n="${n}">${l}</b>`).join('')}</span></div>`}).join('');
 if(t.ais&&M.length){
  if(FM.length)h+=`<div class="lab">Focus <span class="lab0">· tout est facultatif</span></div>`+FM.map(m=>`<div class="pdfq"><div class="pdfh"><b>${esc(m.l)}</b>${dots(m)}</div>${m.min||m.max?`<div class="pdmm">1 = ${esc(m.min)} · 5 = ${esc(m.max)}</div>`:''}${remBox(m,'Ce que j\'ai remarqué…')}</div>`).join('');
  else h+=`<div class="lab">Focus</div><div class="hint" style="margin:0">Choisis jusqu'à 3 compétences à travailler dans l'onglet Pratique délibérée : tu pourras noter ici ce que tu remarques sur chacune.</div>`;
  if(OM.length)h+=`<div class="lab">${FM.length?'Aisance · autres compétences':'Aisance'}</div><div class="pdoth">`+OM.map(m=>{const r=st.rem[m.id],op=r&&(r.open||r.t||r.sup);return `<div class="pdoc ${op?'op':''}"><div class="rate"><span>${esc(m.l)}${m.min||m.max?`<small>1 = ${esc(m.min)} · 5 = ${esc(m.max)}</small>`:''}</span>${dots(m)}</div>
   ${op?`<div class="pdfq sm">${remBox(m,'Ce que j\'ai remarqué sur '+esc(m.l)+'…')}</div>`:`<button class="lnk0 addr" data-remo="${esc(m.id)}">+ Remarque</button>`}</div>`}).join('')+'</div>'}
 return h}
function bindPdForm(box,st,rerender){
 box.querySelectorAll('[data-pa]').forEach(b=>b.onclick=()=>{const k=b.dataset.pa,n=+b.dataset.n;if(st.pa[k]===n)delete st.pa[k];else st.pa[k]=n;rerender()});
 box.querySelectorAll('[data-ais]').forEach(s=>s.onclick=()=>{const k=s.dataset.ais,n=+s.dataset.n;if(st.ais[k]==n)delete st.ais[k];else st.ais[k]=n;rerender()});
 box.querySelectorAll('[data-remt]').forEach(t=>t.oninput=()=>{const k=t.dataset.remt;st.rem[k]=st.rem[k]||{};st.rem[k].t=t.value});
 box.querySelectorAll('[data-rems]').forEach(c=>c.onchange=()=>{const k=c.dataset.rems;st.rem[k]=st.rem[k]||{};st.rem[k].sup=c.checked});
 box.querySelectorAll('[data-remo]').forEach(b=>b.onclick=()=>{const k=b.dataset.remo;st.rem[k]={...(st.rem[k]||{}),open:true};rerender();const t=box.querySelector(`[data-remt="${CSS.escape(k)}"]`);if(t)t.focus()})}
function cleanPd(st){const pa=Object.keys(st.pa).length?{...st.pa}:null,rem={};
 Object.entries(st.rem).forEach(([k,r])=>{if(!r)return;const t=(r.t||'').trim();if(t||r.sup||r.sid){const o={t};if(r.sup)o.sup=true;if(r.sid)o.sid=r.sid;rem[k]=o}});
 return{pa,rem:Object.keys(rem).length?rem:null}}
const pdHas=e=>!!(e.notes&&e.notes.trim())||!!(e.pa&&Object.keys(e.pa).length)||!!(e.rem&&Object.keys(e.rem).length)||!!(e.retours&&e.retours.length);

/* ---------- modifier la pratique délibérée d'une saisie existante ---------- */
let PDE=null;
function openPdEdit(id){const e=E().find(x=>String(x.id)===String(id));if(!e)return;
 PDE={e,notes:e.notes||'',st:{pa:{...(e.pa||{})},ais:{...(e.ais||{})},rem:JSON.parse(JSON.stringify(e.rem||{}))},ret:JSON.parse(JSON.stringify(e.retours||[]))};
 $('pdeT').textContent=`${TM[e.type]?.l||e.type} · ${dShort(e.date)}${e.pid!=null?' · '+pname(e.pid):''}`;renderPdEdit();$('pdeM').classList.add('show')}
function renderPdEdit(){const b=$('pdeB'),R=PDE.ret;let h=`<div class="lab">Notes sur l'entretien</div><textarea class="fin pdta" data-notes rows="3" placeholder="Ce que tu veux garder en mémoire sur cet entretien…">${esc(PDE.notes)}</textarea>`+(SIMPLE()?'':pdForm(PDE.st,PDE.e.type));
 if(R.length&&!SIMPLE())h+=`<div class="lab">Retours de supervision</div>`+R.map((x,i)=>{const src=E().find(y=>y.id==x.eid),m=mById(x.mid);return `<div class="pdfq"><div class="cmh"><b>${esc(m?.l||'Compétence supprimée')}</b>${src?` · ${dShort(src.date)} · ${esc(TM[src.type]?.l||src.type)}${src.pid!=null?' · '+esc(pname(src.pid)):''}`:''}</div>${src?.rem?.[x.mid]?.t?`<div class="spx" style="margin-left:0">${esc(src.rem[x.mid].t)}</div>`:''}<textarea class="fin pdta" data-ret="${i}" rows="2" placeholder="Ce que je retiens de la supervision…">${esc(x.t||'')}</textarea></div>`}).join('');
 b.innerHTML=h||'<div class="hint">Aucune action en cours ne concerne ce type de saisie, et ce type ne prévoit pas de notes d\'aisance (Paramètres > Types d\'activité).</div>';bindPdForm(b,PDE.st,renderPdEdit);
 b.querySelectorAll('[data-ret]').forEach(t=>t.oninput=()=>{R[+t.dataset.ret].t=t.value});b.querySelector('[data-notes]').oninput=ev=>{PDE.notes=ev.target.value}}
$('pdeX').onclick=()=>{$('pdeM').classList.remove('show');PDE=null};
$('pdeS').onclick=()=>{if(!PDE)return;const e=PDE.e,c=cleanPd(PDE.st);
 if(c.pa)e.pa=c.pa;else delete e.pa;if(c.rem)e.rem=c.rem;else delete e.rem;if(PDE.notes.trim())e.notes=PDE.notes.trim();else delete e.notes;if(!SIMPLE()){e.ais=Object.keys(PDE.st.ais).length?{...PDE.st.ais}:null;}if(PDE.ret.length)e.retours=PDE.ret.map(x=>({...x,t:(x.t||'').trim()}));
 e.maj=new Date().toISOString();touch();$('pdeM').classList.remove('show');PDE=null;renderAll();toast('Saisie mise à jour')};

/* ---------- historique d'une compétence ---------- */
let CMP=null;
function openCmp(id){CMP=String(id);renderCmp();$('cmpM').classList.add('show')}
function renderCmp(){const m=mById(CMP);if(!m){$('cmpM').classList.remove('show');return}
 const a=aisNow(m.id),F=PD().focus.map(String).includes(String(m.id)),last=a.s.slice(-10);
 const sp=last.length>1?`<svg viewBox="0 0 200 46" width="200" height="46"><polyline fill="none" stroke="var(--afb)" stroke-width="2" points="${last.map((v,i)=>[8+i*(184/(last.length-1)),42-v*7].join(',')).join(' ')}"/>${last.map((v,i)=>`<circle cx="${8+i*(184/(last.length-1))}" cy="${42-v*7}" r="3" fill="${i>=last.length-5?'var(--afb)':'#C9DCE6'}"/>`).join('')}</svg>`:'';
 const acts=PD().lib.filter(x=>String(x.mid)===String(m.id)).sort((x,y)=>(x.st=='cours'?0:1)-(y.st=='cours'?0:1));
 const items=[];E().forEach(e=>{const r=e.rem?.[m.id];if(r&&r.t)items.push({d:e.date,id:e.id,h:`<div class="cmr"><div class="cmh"><b>${dShort(e.date)}</b> · ${esc(TM[e.type]?.l||e.type)}${e.pid!=null?' · '+esc(pname(e.pid)):''}${e.ais?.[m.id]?' '+starsH(e.ais[m.id],'sm'):''}${r.sid?'<em class="cmsup">vue en supervision</em>':r.sup?'<em class="cmsup">retenue pour supervision</em>':''}<button class="lnk0 cmed" data-pde="${e.id}">modifier</button></div><div>${esc(r.t)}</div></div>`});
  (e.retours||[]).forEach(x=>{if(String(x.mid)===String(m.id)&&x.t)items.push({d:e.date,id:e.id+.5,h:`<div class="cmr ret"><div class="cmh">Retour de supervision · <b>${dShort(e.date)}</b>${e.pid!=null?' · '+esc(pname(e.pid)):''}</div><div class="cmrt">${esc(x.t)}</div></div>`})})});
 items.sort((x,y)=>y.d.localeCompare(x.d)||y.id-x.id);
 $('cmpB').innerHTML=`<div class="cmhd"><div><div class="cmn">${esc(m.l)}</div><div class="hint" style="margin:2px 0 0">Aisance <b style="color:var(--jet)">${a.v!=null?n1(a.v)+' / 5'+trTxt(a.tr):'jamais notée'}</b>${a.v!=null?(a.s.length==1?' · ta seule note pour l\'instant':` · moyenne de tes ${Math.min(5,a.s.length)} dernières notes${a.p!=null?` (${n1(a.p)} avant)`:''}`):''}</div></div>${sp}</div>
  <div style="margin-top:10px"><button class="btn2" data-tgf>${F?'Retirer des focus':'Mettre en focus'}</button></div>
  <div class="lab">Actions liées</div>${acts.map(x=>{const r=actRes(x);return `<div class="pdq"><span>${esc(x.a)} <small class="pdstt s-${x.st}">${PAST[x.st]}</small></span><b style="color:var(--afb)">${r.pct!=null?r.pct+' %':'—'}</b></div>`}).join('')||'<div class="hint" style="margin:0">Aucune action liée à cette compétence.</div>'}
  <button class="lnk0 addr" data-newact>+ Nouvelle action pour cette compétence</button>
  <div class="lab">Remarques et retours de supervision <span class="lab0">· du plus récent au plus ancien</span></div>${items.map(x=>x.h).join('')||'<div class="hint" style="margin:0">Aucune remarque pour l\'instant. Elles se notent dans chaque saisie, sous la compétence.</div>'}`;
 $('cmpB').querySelector('[data-tgf]').onclick=()=>{if(F)unFocus(m.id);else setFocus(m.id,true);renderCmp()};
 $('cmpB').querySelector('[data-newact]').onclick=()=>openLib({nouveau:1,mid:m.id});
 $('cmpB').querySelectorAll('[data-pde]').forEach(b=>b.onclick=()=>openPdEdit(b.dataset.pde))}
$('cmpX').onclick=()=>{$('cmpM').classList.remove('show');CMP=null;renderAll()};

/* ---------- bibliothèque d'actions ---------- */
let LIBO={};
function openLib(o){LIBO={q:'',...o};if(o.nouveau)LIBO.form={a:o.txt||'',mid:o.mid!=null?String(o.mid):(PD().focus[0]!=null?String(PD().focus[0]):''),types:[...COACH]};renderLib();$('libM').classList.add('show');
 setTimeout(()=>{const i=LIBO.form?$('libA'):$('libQ');if(i)i.focus()},60)}
function canStart(except){return actsCours().filter(a=>String(a.id)!==String(except)).length<MAXA}
function setSt(a,st){if(st=='cours'&&a.st!='cours'&&!canStart(LIBO.slot)){toast(`${MAXA} actions en cours maximum : mets-en une en pause d'abord`);return false}a.st=st;a.maj=new Date().toISOString();return true}
function chooseAct(a){if(LIBO.slot&&String(LIBO.slot)!==String(a.id)){const old=PD().lib.find(x=>String(x.id)===String(LIBO.slot));if(old){old.st='pause';old.maj=new Date().toISOString()}}
 if(a.st!='cours'&&!setSt(a,'cours'))return;touch();$('libM').classList.remove('show');renderAll();toast('Action en cours : elle apparaîtra dans tes saisies')}
function renderLib(){const q=(LIBO.q||'').trim().toLowerCase(),L=PD().lib.filter(a=>!q||a.a.toLowerCase().includes(q)||(mById(a.mid)?.l||'').toLowerCase().includes(q)),pc=a=>{const p=actRes(a).pct;return p==null?-1:p};
 const cur=L.filter(a=>a.st=='cours').sort((a,b)=>pc(a)-pc(b)),oth=L.filter(a=>a.st!='cours').sort((a,b)=>pc(a)-pc(b));
 const row=a=>{const r=actRes(a),m=mById(a.mid);return `<div class="lbi ${a.st=='cours'?'cur':''}" data-id="${a.id}"><div class="lbt" ${LIBO.browse?'':'data-pick'}><b>${esc(a.a)}</b><span>${m?esc(m.l)+' · ':''}${esc(typesTxt(a))} · ${r.n?`utilisée ${r.n} fois · ${r.pct} %`:'jamais utilisée'}</span></div>
  <select class="sel lbs s-${a.st}" data-st>${Object.entries(PAST).map(([k,l])=>`<option value="${k}" ${k==a.st?'selected':''}>${l}</option>`).join('')}</select>${r.n?'':'<button class="lnk0 lbx" data-del title="Supprimer">✕</button>'}</div>`};
 const F=LIBO.form;
 $('libT').textContent=LIBO.slot?'Changer d\'action':LIBO.browse?'Bibliothèque d\'actions':'Ajouter une action';
 $('libB').innerHTML=`${LIBO.browse||!LIBO.slot&&!F?'':''}<input class="fin" id="libQ" placeholder="Rechercher une action ou une compétence…" value="${esc(LIBO.q||'')}">
  ${LIBO.browse?'':`<div class="hint" style="margin:8px 0 0">${LIBO.slot?'Choisis l\'action qui remplace celle-ci : l\'ancienne passe en pause, avec son historique.':'Choisis une action de ta bibliothèque, ou crée-en une.'}</div>`}
  ${cur.length?`<div class="lbg">En cours</div>${cur.map(row).join('')}`:''}${oth.length?`<div class="lbg">Les autres, du taux le plus faible au plus élevé</div>${oth.map(row).join('')}`:''}
  ${!L.length&&q?'<div class="hint">Aucune action ne correspond.</div>':''}
  ${F?`<div class="lbnew"><div class="lbg" style="margin-top:0">Nouvelle action</div>
   <textarea class="fin" id="libA" rows="2" placeholder="Un geste précis et observable, à tenter en entretien">${esc(F.a)}</textarea>
   <div class="lab2" style="margin:10px 0 4px">Compétence travaillée</div><select class="sel" id="libMid" style="margin-left:0"><option value="">Aucune en particulier</option>${metrics().filter(m=>m.actif||String(m.id)===F.mid).map(m=>`<option value="${esc(m.id)}" ${String(m.id)===F.mid?'selected':''}>${esc(m.l)}${PD().focus.map(String).includes(String(m.id))?' · focus':''}</option>`).join('')}</select>
   <div class="lab2" style="margin:10px 0 4px">À vérifier dans les saisies de type</div><div class="chips" id="libTy">${T.filter(x=>x.p).map(x=>`<button class="chip ${F.types.includes(x.k)?'on':''}" data-ty="${x.k}">${esc(x.l)}</button>`).join('')}</div>
   <div style="display:flex;gap:10px;margin-top:12px"><button class="cta" style="margin:0" id="libAdd">Ajouter${LIBO.browse?' à la bibliothèque':''}</button><button class="btn2" id="libCancel">Annuler</button></div></div>`
  :`<button class="addl" id="libNew">+ Nouvelle action</button> <span class="hint" style="margin:0">elle sera ajoutée à la bibliothèque</span>`}`;
 const qi=$('libQ');qi.oninput=()=>{LIBO.q=qi.value;const p=qi.selectionStart;renderLib();const n=$('libQ');n.focus();n.setSelectionRange(p,p)};
 $('libB').querySelectorAll('.lbi').forEach(d=>{const a=PD().lib.find(x=>String(x.id)===d.dataset.id);
  const pk=d.querySelector('[data-pick]');if(pk)pk.onclick=()=>chooseAct(a);
  d.querySelector('[data-st]').onchange=ev=>{if(setSt(a,ev.target.value))touch();renderLib();renderAll()};
  const del=d.querySelector('[data-del]');if(del)del.onclick=()=>{PD().lib=PD().lib.filter(x=>x!==a);touch();renderLib();renderAll()}});
 const nw=$('libNew');if(nw)nw.onclick=()=>{LIBO.form={a:LIBO.q||'',mid:PD().focus[0]!=null?String(PD().focus[0]):'',types:[...COACH]};renderLib();$('libA').focus()};
 if(F){$('libA').oninput=()=>F.a=$('libA').value;$('libMid').onchange=()=>F.mid=$('libMid').value;
  $('libTy').querySelectorAll('[data-ty]').forEach(b=>b.onclick=()=>{const k=b.dataset.ty;F.types=F.types.includes(k)?F.types.filter(x=>x!=k):[...F.types,k];renderLib()});
  $('libCancel').onclick=()=>{delete LIBO.form;renderLib()};
  $('libAdd').onclick=()=>{const txt=F.a.trim();if(!txt){toast('Écris l\'action');return}if(!F.types.length){toast('Choisis au moins un type de saisie');return}
   const a={id:nextId(PD().lib),a:txt,mid:F.mid?(mById(F.mid)?.id??F.mid):null,types:[...F.types],st:'pause',cree:today(),maj:new Date().toISOString()};PD().lib.push(a);delete LIBO.form;
   if(LIBO.browse){touch();renderLib();renderAll();toast('Action ajoutée à la bibliothèque');return}
   if(LIBO.slot||canStart())chooseAct(a);else{touch();renderLib();renderAll();toast(`Action ajoutée en pause : ${MAXA} actions sont déjà en cours`)}}}}
$('libX').onclick=()=>{$('libM').classList.remove('show');renderAll()};

