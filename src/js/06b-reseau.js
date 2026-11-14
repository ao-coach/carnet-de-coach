/* =========================================================
   RÉSEAU (2.5.0) : vue Pivots (cercles, public, problématique), vue Orbites,
   panneau « Ce que montre ton réseau ». SVG et simulation de forces maison,
   graine fixe : le dessin est recalculé à l'identique, rien n'est enregistré.
   ========================================================= */
const NET={v:'cercles',reco:true,rel:true,arch:false,fil:null,L:null,key:'',pos:null,dk:'',drg:new Map(),drag:null};
const NETSANS='\u0001';
const NETNONE={cercles:'Sans cercle',public:'Non renseigné',probl:'Non renseigné',orbites:'Sans cercle'};
const NETGOLD='#D9B66A',NETARR='#C9A04E',NETRED='#C8414B',NETOFF='#C9CBCE';
/* hasard reproductible : mulberry32 et hachage FNV d'un identifiant */
function netRng(seed){let a=seed>>>0;return()=>{a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
const netHash=s=>[...String(s)].reduce((a,c)=>Math.imul(a^c.charCodeAt(0),16777619)>>>0,2166136261);
/* couleur d'étape résolue (certaines sont des variables CSS du thème) */
function netCol(st){const c=ETC[st]||'#9A9DA1',m=/^var\((--[\w-]+)\)$/.exec(c);return m?(getComputedStyle(document.documentElement).getPropertyValue(m[1]).trim()||'#797D81'):c}
const netFirst=p=>String(p.nom||'?').trim().split(/\s+/)[0];
const netIni=p=>String(p.nom||'?').trim().split(/\s+/).map(w=>w[0]).join('').slice(0,2).toUpperCase();
/* groupes d'une personne selon le regroupement : cercles (liste), public ou problématique (texte, séparé par , ou ;) */
function netGroups(p,v){const L=v=='cercles'||v=='orbites'?(p.cercles||[]):String(p[v]||'').split(/[;,]/),m=new Map();
 L.forEach(s=>{s=String(s||'').trim();const k=fold(s);if(k&&!m.has(k))m.set(k,s)});return[...m.entries()]}

/* ---------- données du graphe ---------- */
function netData(v){const rel=new Map();relItems().forEach(x=>{if(x.k=='ryt'||x.k=='cold')rel.set(String(x.p.id),x)});
 const P=[];DB.personnes.forEach(p=>{const st=stageOf(p),off=!!p.archive||st=='perdu';if(off&&!NET.arch)return;
  const L=pEntries(p.id),n=L.length;P.push({p,id:String(p.id),st,off,n,last:L.filter(e=>e.date<=today()).at(-1)||null,r:Math.min(24,6+2.2*Math.sqrt(n)),rel:off?null:rel.get(String(p.id))||null,gk:[]})});
 const G=new Map(),sans={k:NETSANS,l:NETNONE[v],sans:true,m:[]};
 P.forEach(x=>{const L=netGroups(x.p,v);if(!L.length){sans.m.push(x);x.gk=[NETSANS];return}
  L.forEach(([k,l])=>{if(!G.has(k))G.set(k,{k,l,m:[]});G.get(k).m.push(x);x.gk.push(k)})});
 const GL=[...G.values()].sort((a,b)=>b.m.length-a.m.length||byName(a.l,b.l));if(sans.m.length)GL.push(sans);
 GL.forEach((g,i)=>{g.c=g.sans?'#A9ADB2':(v=='cercles'||v=='orbites')?crCol(g.l):CRCOL[i%CRCOL.length];g.r=Math.min(42,15+4.5*Math.sqrt(g.m.length))});
 const byId=new Map(P.map(x=>[x.id,x])),R=[];
 P.forEach(x=>{const rp=x.p.reco_par;if(rp&&rp.pid!=null){const s=byId.get(String(rp.pid));if(s&&s!==x)R.push({s,t:x,mode:rp.mode=='presente'?'presente':'reco'})}});
 /* étiquettes : toutes jusqu'à ~60 personnes ; au-delà, passerelles, à relancer et plus gros points (les autres au survol) */
 if(P.length<=60)P.forEach(x=>x.lab=true);
 else{const big=[...P].sort((a,b)=>b.n-a.n)[Math.max(0,Math.round(P.length*.12)-1)]?.n??0,sc=x=>(x.gk.length>1?4:0)+(x.rel?2:0)+(x.n>=big&&x.n>0?1:0);
  P.forEach(x=>x.lab=false);P.filter(x=>sc(x)>0).sort((a,b)=>sc(b)-sc(a)||b.n-a.n||byName(a.p.nom,b.p.nom)).slice(0,45).forEach(x=>x.lab=true)}
 return{v,P,G:GL,R,byId}}

/* ---------- mise en page Pivots : simulation de forces ---------- */
/* netSim renvoie une fonction step(budget ms) : la simulation peut se faire par tranches sans figer l'interface */
function netSim(D){const G=D.G,P=D.P,ng=G.length,np=P.length,N=ng+np;
 const x=new Float64Array(N),y=new Float64Array(N),fx=new Float64Array(N),fy=new Float64Array(N),rad=new Float64Array(N),pv=new Uint8Array(N),gi=new Map();
 const RX=150+45*ng+8*Math.sqrt(np),RY=RX*.6;
 G.forEach((g,i)=>{const a=-Math.PI/2+i/ng*2*Math.PI;x[i]=ng>1?RX*Math.cos(a):0;y[i]=ng>1?RY*Math.sin(a):0;rad[i]=g.r;pv[i]=1;gi.set(g.k,i)});
 const links=[];P.forEach((p,j)=>{const i=ng+j,r=netRng(netHash(p.id));let sx=0,sy=0;p.gk.forEach(k=>{const g=gi.get(k);sx+=x[g];sy+=y[g];links.push(i,g)});
  x[i]=sx/p.gk.length+(r()-.5)*90;y[i]=sy/p.gk.length+(r()-.5)*90;rad[i]=p.r});
 const pix=new Map(P.map((p,j)=>[p,ng+j])),rl=[];D.R.forEach(e=>rl.push(pix.get(e.s),pix.get(e.t)));
 const spring=(i,j,L,k)=>{const dx=x[j]-x[i],dy=y[j]-y[i],d=Math.sqrt(dx*dx+dy*dy)||.01,f=(d-L)*k,ux=dx/d*f,uy=dy/d*f;fx[i]+=ux;fy[i]+=uy;fx[j]-=ux;fy[j]-=uy};
 const I=N>120?Math.max(260,Math.round(500*120/N)):500;let it=0;
 return budget=>{const T0=performance.now();
 for(;it<I;){const cool=1-it/I;fx.fill(0);fy.fill(0);
  for(let i=0;i<N;i++){const xi=x[i],yi=y[i],ri=rad[i],pi=pv[i];for(let j=i+1;j<N;j++){let dx=xi-x[j],dy=yi-y[j],d2=dx*dx+dy*dy;if(d2>90000&&!pi&&!pv[j])continue;if(d2<.01){dx=.1*(i-j);dy=.1;d2=dx*dx+dy*dy}
   const k=pi&&pv[j]?40000:pi||pv[j]?3000:1600,d=Math.sqrt(d2),mn=ri+rad[j]+(pi&&pv[j]?60:pi||pv[j]?10:16);let f=k/d2;if(d<mn)f+=(mn-d)*.5;
   const ux=dx/d*f,uy=dy/d*f;fx[i]+=ux;fy[i]+=uy;fx[j]-=ux;fy[j]-=uy}}
  for(let l=0;l<links.length;l+=2)spring(links[l],links[l+1],105,.06);
  for(let l=0;l<rl.length;l+=2)spring(rl[l],rl[l+1],120,.03);
  const mx=2+28*cool;
  for(let i=0;i<N;i++){const gv=pv[i]?1:.35;fx[i]-=x[i]*.008*gv;fy[i]-=y[i]*.016*gv;const m=pv[i]?.25:1;let sx=fx[i]*m*cool,sy=fy[i]*m*cool;const L=Math.sqrt(sx*sx+sy*sy);if(L>mx){sx*=mx/L;sy*=mx/L}x[i]+=sx;y[i]+=sy}
  it++;if(performance.now()-T0>budget)break}
 if(it<I)return false;G.forEach((g,i)=>{g.x=x[i];g.y=y[i]});P.forEach((p,j)=>{p.x=x[ng+j];p.y=y[ng+j]});return true}}
function netForce(D){netSim(D)(1e9)}
const netPos=D=>new Map([...D.G.map(g=>['g'+g.k,[g.x,g.y]]),...D.P.map(x=>[x.id,[x.x,x.y]])]);

/* ---------- mise à l'échelle de l'écran : positions étirées pour remplir la zone, tailles et textes inchangés ---------- */
function netFit(D,W,H){const N=[...D.G.map(g=>({o:g,r:g.r,pv:1})),...D.P.map(x=>({o:x,r:x.r,pv:0}))];if(!N.length)return;
 let a=1e9,b=1e9,c=-1e9,d=-1e9;N.forEach(n=>{a=Math.min(a,n.o.x);c=Math.max(c,n.o.x);b=Math.min(b,n.o.y);d=Math.max(d,n.o.y)});
 const mx=Math.min(110,Math.max(46,...D.G.map(g=>g.l.length*3.9))),mt=34+Math.max(10,...D.G.map(g=>g.r)),mb=26,bw=Math.max(1,c-a),bh=Math.max(1,d-b);
 let sx=(W-2*mx)/bw,sy=(H-mt-mb)/bh;const s=Math.min(sx,sy);sx=Math.min(sx,s*1.5,1.8);sy=Math.min(sy,s*1.5,1.8);
 const ox=W/2-(a+c)/2*sx,oy=mt+(H-mt-mb)/2-(b+d)/2*sy;N.forEach(n=>{n.x=n.o.x*sx+ox;n.y=n.o.y*sy+oy});
 /* chevauchements créés par la réduction : quelques passes de séparation */
 for(let it=0;it<80;it++){let mv=0;for(let i=0;i<N.length;i++)for(let j=i+1;j<N.length;j++){const p=N[i],q=N[j];let dx=q.x-p.x,dy=q.y-p.y,dd=dx*dx+dy*dy;const m=p.r+q.r+(p.pv&&q.pv?44:p.pv||q.pv?12:14);if(dd>=m*m)continue;
   let dl=Math.sqrt(dd);if(dl<.01){dx=.5;dy=.3;dl=.58}const o=(m-dl)/2,wp=p.pv?.3:1,wq=q.pv?.3:1,ux=dx/dl,uy=dy/dl;p.x-=ux*o*wp;p.y-=uy*o*wp;q.x+=ux*o*wq;q.y+=uy*o*wq;mv++}
  N.forEach(n=>{n.x=Math.min(W-n.r-4,Math.max(n.r+4,n.x));n.y=Math.min(H-n.r-14,Math.max(n.r+(n.pv?24:4),n.y))});if(!mv)break}
 N.forEach(n=>{n.o.x=n.x;n.o.y=n.y})}

/* ---------- mise en page Orbites : anneaux = proximité, parts = cercles ---------- */
const NETRK=['proche','regulier','occasionnel'];
function netOrbit(D,W,H){const G=D.G,place=new Map(G.map(g=>[g.k,[]]));D.P.forEach(p=>place.get(p.gk[0]).push(p));
 const w=G.map(g=>Math.max(.6,place.get(g.k).length)),Wt=w.reduce((a,b)=>a+b,0)||1;let a0=-Math.PI/2;
 G.forEach((g,i)=>{const da=2*Math.PI*w[i]/Wt;g.a0=a0;g.a1=a0+da;g.am=a0+da/2;a0+=da});
 /* rayon : la place en hauteur, et en largeur celle des noms de cercles écrits à l'extérieur */
 const lim=G.map(g=>{const c=Math.abs(Math.cos(g.am)),lw=(g.l.length+5)*7.4;return c<.25?W/2-lw/2:(W/2-16-lw)/Math.max(c,.5)});
 const cx=W/2,cy=H/2,Ro=Math.max(130,Math.min(420,H/2-22,...lim)),k=Math.min(1,Math.max(.62,Ro/300)),ring={};
 NETRK.forEach((rk,i)=>ring[rk]=40+(Ro-40)*[.32,.63,.92][i]);D.cx=cx;D.cy=cy;D.Ro=Ro;D.ring=ring;D.P.forEach(x=>x.r*=k);
 G.forEach(g=>{const da=g.a1-g.a0;
  const pad=Math.min(.1,da*.12),span=Math.max(.0001,da-2*pad);
  NETRK.forEach(rk=>{const L=place.get(g.k).filter(p=>(ring[p.p.proximite]?p.p.proximite:'regulier')==rk).sort((a,b)=>b.n-a.n||byName(a.p.nom,b.p.nom)),R=ring[rk],n=L.length;if(!n)return;
   const step=span/n,need=Math.max(...L.map(p=>2*p.r+5)),rows=Math.min(3,Math.max(1,Math.ceil(need/(R*step)-.15))),amp=Math.min(24,(Ro-40)*.16);
   L.forEach((p,j)=>{const t=g.a0+pad+(j+.5)*step,rr=R+(rows>1?((j%rows)-(rows-1)/2)*(2*amp/(rows-1)):0);p.x=cx+rr*Math.cos(t);p.y=cy+rr*Math.sin(t)})})})}

/* ---------- rendu ---------- */
/* clé de mise en page : les positions sont gardées tant que la structure du graphe ne change pas (et le glisser avec, jusque-là) */
function netKey(D){return [D.v,NET.arch,D.P.map(x=>`${x.id}:${x.gk.join('/')}:${Math.round(x.r)}${D.v=='orbites'?':'+(x.p.proximite||''):''}`).join(','),D.R.map(e=>e.s.id+'>'+e.t.id).join(',')].join('|')}
function netArrow(s,t,cls){const dx=t.x-s.x,dy=t.y-s.y,d=Math.sqrt(dx*dx+dy*dy)||1,ux=dx/d,uy=dy/d,a=s.r+3,b=t.r+(NET.rel&&t.rel?6:4);
 if(d<a+b+4)return'';const x1=s.x+ux*a,y1=s.y+uy*a,x2=t.x-ux*b,y2=t.y-uy*b,cx=(x1+x2)/2-uy*d*.12,cy=(y1+y2)/2+ux*d*.12;
 return `<path class="nra${cls?' '+cls:''}" data-rs="${esc(s.id)}" data-rt="${esc(t.id)}" d="M${x1.toFixed(1)},${y1.toFixed(1)} Q${cx.toFixed(1)},${cy.toFixed(1)} ${x2.toFixed(1)},${y2.toFixed(1)}" marker-end="url(#netArr)"/>`}
function netNode(x,D){const fil=NET.fil,dim=fil!=null&&!x.gk.includes(fil),col=x.off?NETOFF:netCol(x.st),pale=NET.rel&&x.rel,pass=x.gk.length>1&&!x.gk.includes(NETSANS);
 const ini=x.r>=11?`<text class="nin" y="${(x.r*.36).toFixed(1)}" style="font-size:${Math.round(x.r*.78)}px;fill:${tc(col.length==7?col:'#797D81')}" data-noi18n>${esc(netIni(x.p))}</text>`:'';
 const lab=x.lab||fil!=null&&!dim?`<text class="nlb${x.off?' off':''}" y="${(x.r+12).toFixed(1)}" data-noi18n>${esc(netFirst(x.p))}</text>`:'';
 return `<g class="nnd${dim?' dim':''}" data-pid="${esc(x.id)}" transform="translate(${x.x.toFixed(1)},${x.y.toFixed(1)})">${pale?`<circle r="${x.r+4}" class="nrel"/>`:''}<circle r="${x.r}" style="fill:${col}" fill-opacity="${pale?.45:1}" class="${pass?'npass':'nbody'}"/>${ini}${lab}</g>`}
function netSvgPivots(D){const fil=NET.fil,out=[];
 D.P.forEach(x=>x.gk.forEach(k=>{const g=D.G.find(g=>g.k==k);out.push(`<line class="nln${fil!=null&&fil!=k?' dim':''}" data-l="${esc(x.id)}" x1="${x.x.toFixed(1)}" y1="${x.y.toFixed(1)}" x2="${g.x.toFixed(1)}" y2="${g.y.toFixed(1)}" stroke="${g.c}"/>`)}));
 if(NET.reco)D.R.forEach(e=>out.push(netArrow(e.s,e.t,(e.mode=='presente'?'pres':'')+(fil!=null&&!(e.s.gk.includes(fil)&&e.t.gk.includes(fil))?' dim':''))));
 D.G.forEach(g=>{
  out.push(`<g class="ngp${fil!=null&&fil!=g.k?' dim':''}${fil==g.k?' on':''}" data-g="${esc(g.k)}" transform="translate(${g.x.toFixed(1)},${g.y.toFixed(1)})"><circle r="${g.r.toFixed(1)}" style="fill:${g.c};stroke:${g.c}"/><text class="ngn" y="5">${g.m.length}</text></g>`)});
 D.P.forEach(x=>out.push(netNode(x,D)));
 netLabels(D);D.G.forEach(g=>out.push(`<g class="nglg${fil!=null&&fil!=g.k?' dim':''}" transform="translate(${g.x.toFixed(1)},${g.y.toFixed(1)})"><text class="nglb" x="${g.lx}" y="${g.ly}"${g.sans?'':' data-noi18n'}>${esc(g.l)}</text></g>`));return out.join('')}
/* étiquettes des groupes : au-dessus du disque, sinon en dessous, sinon décalée, pour ne pas se recouvrir */
function netLabels(D){const B=[],hit=(a)=>B.some(b=>a.x1<b.x2&&a.x2>b.x1&&a.y1<b.y2&&a.y2>b.y1);
 D.G.forEach(g=>B.push({x1:g.x-g.r,x2:g.x+g.r,y1:g.y-g.r,y2:g.y+g.r}));
 [...D.G].sort((a,b)=>b.m.length-a.m.length).forEach(g=>{const w=g.l.length*7.3+6,c=[[0,-g.r-7],[0,g.r+17],[w/2+g.r*.4,-g.r-2],[-w/2-g.r*.4,-g.r-2],[w/2+g.r*.4,g.r+12],[-w/2-g.r*.4,g.r+12]];
  let pick=c[0];for(const[dx,dy]of c){const bx={x1:g.x+dx-w/2,x2:g.x+dx+w/2,y1:g.y+dy-13,y2:g.y+dy+3};if(!hit(bx)){pick=[dx,dy];break}}
  g.lx=pick[0].toFixed(1);g.ly=pick[1].toFixed(1);B.push({x1:g.x+pick[0]-w/2,x2:g.x+pick[0]+w/2,y1:g.y+pick[1]-13,y2:g.y+pick[1]+3})})}
function netSvgOrbit(D){const fil=NET.fil,out=[],R3=D.Ro,R0=40,gk=new Map(D.G.map(g=>[g.k,g])),cx=D.cx,cy=D.cy,p=(a,r)=>`${(cx+r*Math.cos(a)).toFixed(1)},${(cy+r*Math.sin(a)).toFixed(1)}`;
 D.G.forEach(g=>{if(D.G.length>1){const large=g.a1-g.a0>Math.PI?1:0;
   out.push(`<path class="nsec${fil!=null&&fil!=g.k?' dim':''}" data-g="${esc(g.k)}" d="M${p(g.a0,R0)} L${p(g.a0,R3)} A${R3},${R3} 0 ${large} 1 ${p(g.a1,R3)} L${p(g.a1,R0)} A${R0},${R0} 0 ${large} 0 ${p(g.a0,R0)}Z" style="fill:${g.c};stroke:${g.c}"/>`)}
  const c=Math.cos(g.am),sn=Math.sin(g.am),anc=Math.abs(c)<.25?'middle':c>0?'start':'end';
  out.push(`<text class="nolb${fil!=null&&fil!=g.k?' dim':''}" data-g="${esc(g.k)}" x="${(cx+(R3+10)*c).toFixed(1)}" y="${(cy+(R3+10)*sn+(sn>.5?10:sn<-.5?-2:4)).toFixed(1)}" text-anchor="${anc}" style="fill:${g.c}"><tspan${g.sans?'':' data-noi18n'}>${esc(g.l)}</tspan> (${g.m.length})</text>`)});
 NETRK.forEach(k=>{const r=D.ring[k];out.push(`<circle class="nring" cx="${cx}" cy="${cy}" r="${r.toFixed(1)}"/>`)});
 out.push(`<circle class="nme" cx="${cx}" cy="${cy}" r="26"/><text class="nmet" x="${cx}" y="${cy+6}" data-noi18n>${esc((CFG().nom||'?').split(/\s+/).map(w=>w[0]).join('').slice(0,2).toUpperCase())}</text>`);
 D.P.forEach(x=>x.gk.slice(1).forEach(k=>{const g=gk.get(k);if(!g)return;const X=x.x-cx,Y=x.y-cy,rr=Math.sqrt(X*X+Y*Y)||1,a=Math.atan2(Y,X);let da=g.am-a;while(da>Math.PI)da-=2*Math.PI;while(da<-Math.PI)da+=2*Math.PI;
  const t=a+Math.sign(da)*Math.min(Math.abs(da),(x.r+14)/rr);
  out.push(`<line class="ntk${fil!=null&&!x.gk.includes(fil)?' dim':''}" data-l="${esc(x.id)}" x1="${x.x.toFixed(1)}" y1="${x.y.toFixed(1)}" x2="${(cx+rr*Math.cos(t)).toFixed(1)}" y2="${(cy+rr*Math.sin(t)).toFixed(1)}" stroke="${g.c}"/>`)}));
 if(NET.reco)D.R.forEach(e=>out.push(netArrow(e.s,e.t,(e.mode=='presente'?'pres':'')+(fil!=null&&!(e.s.gk.includes(fil)&&e.t.gk.includes(fil))?' dim':''))));
 D.P.forEach(x=>out.push(netNode(x,D)));
 NETRK.forEach(k=>out.push(`<text class="nrlb" x="${cx+4}" y="${(cy-D.ring[k]-5).toFixed(1)}">${PROX.find(z=>z[0]==k)[1]}</text>`));return out.join('')}
function renderNet(){if(!DB||!$('netSvg'))return;const t0=performance.now(),svg=$('netSvg'),W=Math.round(svg.clientWidth)||900,H=Math.round(svg.clientHeight)||520;
 $('netView').querySelectorAll('[data-nv]').forEach(b=>b.classList.toggle('on',b.dataset.nv==NET.v));
 $('netReco').checked=NET.reco;$('netRel').checked=NET.rel;$('netArch').checked=NET.arch;
 const D=netData(NET.v),key=netKey(D);
 if(D.v=='orbites')netOrbit(D,W,H);
 else{if(key===NET.key&&NET.pos){D.G.forEach(g=>{const q=NET.pos.get('g'+g.k);g.x=q[0];g.y=q[1]});D.P.forEach(x=>{const q=NET.pos.get(x.id);x.x=q[0];x.y=q[1]})}
  else if(D.P.length>60){/* gros carnet : calcul par tranches, puis nouveau rendu */
   if(NET.job?.key!==key){const job={key,D,step:netSim(D),t0};NET.job=job;const tick=()=>setTimeout(()=>{if(NET.job!==job)return;
     if(job.step(25)){NET.pos=netPos(job.D);NET.key=job.key;NET.job=null;NET.ms=Math.round(performance.now()-job.t0);if(TAB=='reseau')renderNet()}else tick()},0);tick()}
   NET.L=D;svg.setAttribute('viewBox',`0 0 ${W} ${H}`);svg.innerHTML=`<text class="nempty" x="${W/2}" y="${H/2}" text-anchor="middle">Calcul du dessin du réseau…</text>`;
   $('netLeg').innerHTML=netLegend(D);$('netSide').innerHTML=netSide(D);return}
  else{netForce(D);NET.pos=netPos(D);NET.ms=Math.round(performance.now()-t0)}
  netFit(D,W,H)}
 const dk=key+'|'+W+'x'+H;if(NET.dk!==dk){NET.dk=dk;NET.drg=new Map()}NET.drg.forEach((q,id)=>{const x=D.byId.get(id);if(x){x.x=q[0];x.y=q[1]}});
 NET.key=key;NET.L=D;if(NET.fil!=null&&!D.G.some(g=>g.k==NET.fil))NET.fil=null;
 svg.setAttribute('viewBox',`0 0 ${W} ${H}`);
 if(!D.P.length){svg.innerHTML=`<text class="nempty" x="${W/2}" y="${H/2}" text-anchor="middle">Pas encore de personnes à afficher.</text>`;$('netLeg').innerHTML='';$('netSide').innerHTML=netSide(D);return}
 svg.innerHTML=`<defs><marker id="netArr" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0L10,5L0,10z" fill="${NETARR}"/></marker></defs><rect class="nbg" x="0" y="0" width="${W}" height="${H}"/>`+(D.v=='orbites'?netSvgOrbit(D):netSvgPivots(D));
 $('netLeg').innerHTML=netLegend(D);$('netSide').innerHTML=netSide(D);NET.rms=Math.round(performance.now()-t0)}
function netLegend(D){const st=['reseau','invite','conversation','proposition','client','termine','superviseur'].filter(s=>D.P.some(x=>!x.off&&x.st==s));
 const dot=(c,extra)=>`<svg width="16" height="16" viewBox="-8 -8 16 16"><circle r="6" style="fill:${c}" ${extra||''}/></svg>`;
 return st.map(s=>`<span>${dot(netCol(s))}${ETL[s]}</span>`).join('')
  +`<span class="nlsep"></span><span><svg width="30" height="16" viewBox="-4 -8 30 16"><circle r="3" cx="0" fill="#9A9DA1"/><circle r="7" cx="17" fill="#9A9DA1"/></svg>Taille = nombre d'échanges</span>`
  +(NET.rel?`<span><svg width="20" height="20" viewBox="-10 -10 20 20"><circle r="9" class="nrel"/><circle r="6" fill="#9A9DA1" fill-opacity=".45"/></svg>À relancer</span>`:'')
  +(D.v!='orbites'||D.P.some(x=>x.gk.length>1)?`<span>${dot('#fff',`class="npass"`)}Passerelle : plusieurs groupes</span>`:'')
  +(NET.reco&&D.R.length?`<span><svg width="26" height="12" viewBox="0 0 26 12"><path d="M2,6 L19,6" stroke="${NETARR}" stroke-width="2" marker-end="url(#netArr)"/></svg>Recommandation</span><span><svg width="26" height="12" viewBox="0 0 26 12"><path d="M2,6 L19,6" stroke="${NETARR}" stroke-width="2" stroke-dasharray="4 3" marker-end="url(#netArr)"/></svg>Présentation</span>`:'')
  +(NET.arch&&D.P.some(x=>x.off)?`<span>${dot(NETOFF)}Archivé·e ou sans suite</span>`:'')}

/* ---------- panneau « Ce que montre ton réseau » ---------- */
function netChains(D){const ch=new Map(),hasIn=new Set();D.R.forEach(e=>{if(!ch.has(e.s))ch.set(e.s,[]);ch.get(e.s).push(e.t);hasIn.add(e.t)});
 const out=[],walk=(x,path)=>{const nx=(ch.get(x)||[]).filter(y=>!path.includes(y));if(!nx.length){if(path.length>1)out.push(path);return}nx.forEach(y=>walk(y,[...path,y]))};
 [...ch.keys()].filter(x=>!hasIn.has(x)).forEach(x=>walk(x,[x]));
 return out.sort((a,b)=>b.length-a.length||byName(a[0].p.nom,b[0].p.nom))}
function netInsights(D){const A=D.P.filter(x=>!x.off),G=D.G.filter(g=>!g.sans).map(g=>({g,m:g.m.filter(x=>!x.off)})).filter(z=>z.m.length);
 return{pass:A.filter(x=>x.gk.length>1&&!x.gk.includes(NETSANS)).sort((a,b)=>b.gk.length-a.gk.length||b.n-a.n),
  warm:G.filter(z=>z.m.length>=2&&z.m.filter(x=>x.rel).length*2>=z.m.length).map(z=>({...z,k:z.m.filter(x=>x.rel).length})),
  dev:G.filter(z=>z.m.length>=2&&z.m.every(x=>x.st=='reseau'||x.st=='invite')),
  ch:netChains(D)}}
function netSide(D){const I=netInsights(D),gl=new Map(D.G.map(g=>[g.k,g])),G=k=>{const g=gl.get(k);return `<span class="crp" style="--c:${g.c}" data-g="${esc(k)}"${g.sans?'':' data-noi18n'}>${esc(g.l)}</span>`};
 const who=x=>`<a class="npl" data-pid="${esc(x.id)}" data-noi18n>${esc(x.p.nom)}</a>`,more=(L,n)=>L.length>n?`<li class="nmore">${L.length-n>1?`et ${L.length-n} autres`:'et 1 autre'}</li>`:'';
 const grpW=D.v=='public'?'publics':D.v=='probl'?'problématiques':'cercles',nG=D.G.filter(g=>!g.sans).length;
 const sec=(t,n,hint,body,empty)=>`<div class="nsec2"><h3>${t}${n?` <span class="cntb">${n}</span>`:''}</h3>${n?`<p class="nhint">${hint}</p><ul>${body}</ul>`:`<p class="nhint">${empty}</p>`}</div>`;
 const and=L=>L.map(G).reduce((s,x,i)=>s+(i==0?'':i==L.length-1?' <span>et</span> ':', ')+x,'');
 const fil=NET.fil!=null&&gl.get(NET.fil)?`<div class="nfil"><span>Filtre</span>${G(NET.fil)}<button class="lnk" id="netFilX">Tout afficher</button></div>`:'';
 return `<h2>Ce que montre ton réseau</h2>${fil}<div class="nsum"><span>${pl(D.P.filter(x=>!x.off).length,'personne')}</span><span>${nG} ${grpW}</span></div>`
  +sec('Passerelles',I.pass.length,"Elles relient deux mondes : demande-leur qui, de l'autre côté, gagnerait à te connaître.",
   I.pass.slice(0,6).map(x=>`<li>${who(x)} <span>relie</span> ${and(x.gk)}</li>`).join('')+more(I.pass,6),
   D.v=='cercles'||D.v=='orbites'?"Aucune pour l'instant : une personne dans deux cercles fait le pont entre eux.":"Aucune : ici, chaque personne a une seule valeur.")
  +sec('À réchauffer',I.warm.length,'Au moins la moitié de leurs membres attendent de tes nouvelles.',
   I.warm.map(z=>`<li>${G(z.g.k)} <span>${z.k} sur ${z.m.length} à relancer</span></li>`).join(''),"Rien à réchauffer : tes groupes sont entretenus.")
  +sec('Pistes de développement',I.dev.length,'Des liens sans conversation de coaching pour l\'instant : une invitation ?',
   I.dev.map(z=>`<li>${G(z.g.k)} <span>${z.m.length} personnes, aucune en conversation</span></li>`).join(''),"Chaque groupe compte déjà au moins une conversation de coaching.")
  +sec('Chaînes de recommandation',I.ch.length,"Qui t'a recommandé ou présenté qui : remercie, et pense à demander à nouveau.",
   I.ch.slice(0,6).map(c=>`<li class="nch">${c.map(who).join(' <i>→</i> ')}</li>`).join('')+more(I.ch,6),"Aucune pour l'instant : renseigne « Recommandé·e ou présenté·e par » dans la fiche.")}

/* ---------- bulle de survol ---------- */
function netTip(x,ev){const t=$('netTip'),gl=new Map(NET.L.G.map(g=>[g.k,g])),rp=x.p.reco_par,src=rp&&pById(rp.pid);
 t.innerHTML=`<div class="ntt"><b data-noi18n>${esc(x.p.nom)}</b>${stagePill(x.st)}</div>${x.p.titre?`<div class="nts" data-noi18n>${esc(x.p.titre)}</div>`:''}
  <div>${x.n?pl(x.n,'échange'):'Aucun échange encore'}${x.last?` <span>·</span> <span>dernier contact le ${dShort(x.last.date)}</span>`:''}</div>
  ${x.gk.includes(NETSANS)?'':`<div class="ntg">${x.gk.map(k=>`<span class="crp" style="--c:${gl.get(k).c}" data-noi18n>${esc(gl.get(k).l)}</span>`).join('')}</div>`}
  ${x.rel?`<div class="ntr">À relancer : sans contact depuis ${x.rel.days} j</div>`:''}
  ${src?`<div><span>${rp.mode=='presente'?'Présenté·e par':'Recommandé·e par'}</span> <b data-noi18n>${esc(src.nom)}</b></div>`:''}
  ${x.p.archive?'<div class="nts">Archivé·e</div>':''}`;
 netTipMove(ev)}
function netTipMove(ev){const t=$('netTip'),B=$('netG').getBoundingClientRect();if(!t.innerHTML)return;t.classList.add('show');
 let L=ev.clientX-B.left+14,T=ev.clientY-B.top+14;if(L+t.offsetWidth>B.width-4)L=ev.clientX-B.left-t.offsetWidth-14;if(T+t.offsetHeight>B.height-4)T=Math.max(4,ev.clientY-B.top-t.offsetHeight-14);
 t.style.left=Math.max(4,L)+'px';t.style.top=T+'px'}
function netTipX(){const t=$('netTip');t.classList.remove('show');t.innerHTML=''}

/* ---------- interactions : survol, clic (fiche ou filtre), glisser temporaire ---------- */
function netPt(ev){const s=$('netSvg'),p=s.createSVGPoint();p.x=ev.clientX;p.y=ev.clientY;return p.matrixTransform(s.getScreenCTM().inverse())}
function netMoveNode(x){const g=$('netSvg').querySelector(`.nnd[data-pid="${CSS.escape(x.id)}"]`);if(g)g.setAttribute('transform',`translate(${x.x.toFixed(1)},${x.y.toFixed(1)})`);
 $('netSvg').querySelectorAll(`line[data-l="${CSS.escape(x.id)}"]`).forEach(l=>{const dx=x.x-+l.getAttribute('x1'),dy=x.y-+l.getAttribute('y1');l.setAttribute('x1',x.x.toFixed(1));l.setAttribute('y1',x.y.toFixed(1));
  if(l.classList.contains('ntk')){l.setAttribute('x2',(+l.getAttribute('x2')+dx).toFixed(1));l.setAttribute('y2',(+l.getAttribute('y2')+dy).toFixed(1))}});
 NET.L.R.filter(e=>e.s===x||e.t===x).forEach(e=>{const o=$('netSvg').querySelector(`path[data-rs="${CSS.escape(e.s.id)}"][data-rt="${CSS.escape(e.t.id)}"]`);if(!o)return;
  const h=document.createElementNS('http://www.w3.org/2000/svg','g');h.innerHTML=netArrow(e.s,e.t,'');const n=h.firstChild;o.setAttribute('d',n?n.getAttribute('d'):'M0,0')})}
function netFilter(k){NET.fil=NET.fil==k||k==null?null:k;netTipX();renderNet()}
(function netBind(){const s=$('netSvg');if(!s)return;
 s.addEventListener('pointerover',ev=>{if(NET.drag)return;const g=ev.target.closest('.nnd');if(g){const x=NET.L?.byId.get(g.dataset.pid);if(x)netTip(x,ev)}});
 s.addEventListener('pointermove',ev=>{const d=NET.drag;if(d){const p=netPt(ev);if(!d.moved&&Math.hypot(p.x-d.p0.x,p.y-d.p0.y)<4)return;d.moved=true;netTipX();d.x.x=d.x0+p.x-d.p0.x;d.x.y=d.y0+p.y-d.p0.y;NET.drg.set(d.x.id,[d.x.x,d.x.y]);netMoveNode(d.x);return}
  if(ev.target.closest('.nnd'))netTipMove(ev);else netTipX()});
 s.addEventListener('pointerleave',()=>{if(!NET.drag)netTipX()});
 s.addEventListener('pointerdown',ev=>{const g=ev.target.closest('.nnd');if(!g||ev.button)return;const x=NET.L?.byId.get(g.dataset.pid);if(!x)return;
  const p=netPt(ev);NET.drag={x,p0:p,x0:x.x,y0:x.y,moved:false};try{s.setPointerCapture(ev.pointerId)}catch(e){}ev.preventDefault()});
 s.addEventListener('pointerup',ev=>{const d=NET.drag;NET.drag=null;if(d){if(!d.moved){netTipX();openFiche(d.x.id)}return}
  const g=ev.target.closest('[data-g]');if(g){netFilter(g.dataset.g);return}if(ev.target.classList.contains('nbg')&&NET.fil!=null)netFilter(null)});
 $('netView').querySelectorAll('[data-nv]').forEach(b=>b.onclick=()=>{NET.v=b.dataset.nv;NET.fil=null;renderNet()});
 $('netReco').onchange=e=>{NET.reco=e.target.checked;renderNet()};
 $('netRel').onchange=e=>{NET.rel=e.target.checked;renderNet()};
 $('netArch').onchange=e=>{NET.arch=e.target.checked;renderNet()};
 $('netSide').addEventListener('click',ev=>{const a=ev.target.closest('[data-pid]');if(a){openFiche(a.dataset.pid);return}const g=ev.target.closest('[data-g]');if(g){netFilter(g.dataset.g);return}if(ev.target.id=='netFilX')netFilter(null)});
})();
