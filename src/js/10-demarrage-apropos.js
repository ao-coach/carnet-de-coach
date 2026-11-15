/* =========================================================
   PARCOURS DE DÉMARRAGE
   ========================================================= */
const WZ=['hello','valeur','mode','ident'];
const WZL={hello:'Bienvenue',valeur:'À quoi sert ton carnet',mode:'Tes modules',ident:'Ton identité'};
let WI=0,WFIRST=true,WBACK=false;
function openWizard(i=0,first=true,back=false){WI=i;WFIRST=first;WBACK=back;$('lock').classList.add('hide');$('wiz').classList.remove('hide');renderWiz()}
function closeWizard(){$('wiz').classList.add('hide')}
function showWelcome(back){$('main').style.visibility='hidden';openWizard(0,true,back)}
function wzSide(){const C=DB?CFG():defaultConfig(),K=C.couleurs,ini=(C.nom||'?').split(/\s+/).map(w=>w[0]).join('').slice(0,2).toUpperCase();
 $('wzSide').style.background=C.bandeau?`linear-gradient(180deg,${K.fonce}d9,${K.fonce}f5),url("${C.bandeau}") center/cover`:`linear-gradient(165deg,${mix(K.fonce,K.bleu,.3)} 0%,${K.fonce} 75%)`;
 $('wzBrand').innerHTML=`${C.logo?`<img src="${C.logo}" alt="">`:`<div class="ini">${esc(ini)}</div>`}<div><b>${esc(DB?C.nom:'Ton carnet')}</b><span>${esc(C.outil||'')}</span></div>`;
 $('wzSteps').innerHTML=WZ.map((k,i)=>{const n=i+1,j=WZ.indexOf(k);return `<li class="${j<WI?'ok':j==WI?'cur':''}"><b>${j<WI?'✓':n}</b>${WZL[k]}</li>`}).join('');
 $('wzQuote').textContent=DB?C.sousTitre:''}
function renderWiz(){const k=WZ[WI],st=WS[k]();wzSide();
 $('wzKicker').textContent=k=='hello'?'':`Étape ${WZ.indexOf(WZ[WI])+1} sur ${WZ.length}`;
 $('wiz').classList.toggle('hello',k=='hello');$('wzTitle').textContent=st.t;$('wzLead').innerHTML=st.lead||'';$('wzBody').innerHTML=st.html;
 $('wzBack').classList.toggle('hide',WI==0);$('wzNext').textContent=st.next||'Continuer';
 if(st.bind)st.bind();
 $('wzNext').onclick=async()=>{let ok=true;if(st.go){$('wzNext').disabled=true;try{ok=await st.go()}catch(e){ok=false;toast('Une erreur est survenue')}$('wzNext').disabled=false}if(ok!==false)wzGo(1)};
 $('wzBack').onclick=()=>wzGo(-1);$('wzMain').scrollTop=0}
function wzGo(d){WI=Math.max(0,Math.min(WZ.length-1,WI+d));renderWiz()}
const wzLive=()=>{touch();applyConfig();wzSide()};

/* 3.2.1 : photo d'Allan en fichier (app/allan.jpg, gardée hors ligne par le service worker) */
const ALLAN_PH='allan.jpg';
/* ---------- À quoi sert ton carnet (3.1.0) : parcours de démarrage et onglet À propos ---------- */
const VAL_T="Moins de dispersion, plus de pratique.",VAL_L="Ton carnet t'aide à faire les trois choses qui font de toi un coach, et à les faire en jouant.",VAL_F='Trente secondes après chaque entretien suffisent.';
const VAL=[["Coacher beaucoup.","Marketing, formations, veille : intéressant, mais ça ne remplace pas l'essentiel : rencontrer, coacher, proposer. Ton carnet compte ces heures-là, les met en graphiques et fait monter ta fiche de coach niveau après niveau, comme dans un jeu."],
 ["Affûter quelques compétences.","On sort de l'école en sachant beaucoup et en maîtrisant peu. Choisis une ou deux compétences, investis-y chaque séance et ta supervision jusqu'à en faire des automatismes, puis passe aux suivantes. C'est ce qui donne du poids à tout ce que tu as appris."],
 ["Créer ton activité par la relation.","Le coaching se vend en coachant. Ton carnet te pousse aux gestes qui créent des rencontres : entretenir ton réseau, inviter, proposer, t'entourer de pairs qui partagent tes défis. Ce qu'on vit souvent comme une épreuve devient un jeu."]];
const valCards=()=>`<div class="wzcards val">${VAL.map(([t,p],i)=>`<div class="wzc"><div class="ic">${i+1}</div><b>${t}</b><p>${p}</p></div>`).join('')}</div>`;
/* 3.2.0 : les modules dans le parcours de démarrage */
const WZMOD={coacher:['Coacher beaucoup',"Ton tableau de bord : tes indicateurs, ton objectif prioritaire et ton plan d'action, pour garder le cap sur les heures qui comptent."],
 competences:['Affûter mes compétences',"La pratique délibérée : des XP de pratique à répartir après chaque entretien, ta boussole de compétences, la préparation de ta supervision."],
 activite:['Créer mon activité',"Ton réseau en image, la proximité de chaque personne, tes Facultés commerciales, l'entonnoir de tes propositions, tes coûts et ton vrai taux horaire."],
 jeu:['④ Le jeu, en option',"Ta fiche de coach, ton rang, tes hauts faits, et une célébration à chaque niveau passé."]};
/* ---------- À propos ---------- */
function letterHtml(){return `<div class="wzletter">
  <div class="lthead"><img class="ltph" src="${ALLAN_PH}" alt="Allan Oudomphong"><p>Salut à toi, confrère ou consœur coach,</p></div>
  <p>Ce carnet est né de ma propre pratique. Il a un seul but : <b>t'aider à piloter ta pratique en te concentrant sur l'essentiel</b>. Où tu en es, ce sur quoi tu progresses, et la prochaine action à mener.</p>
  <p>On devient un excellent coach en coachant beaucoup et en pratiquant délibérément. Ce carnet rend les deux visibles, en quelques secondes par entretien.</p>
  <p>Le démarrage prend moins d'une minute. Ensuite, un carnet de route te guide, une mission à la fois. Tout reste modifiable.</p>
  <p>Je te souhaite du plaisir et du sens dans ta pratique de coach,</p>
  <p class="sig">Allan Oudomphong</p></div>`}
const FAQ=()=>[
 ['Tes données',[
  ['Où sont mes données ?',"Dans un seul fichier, <code>coaching-data.json</code>, rangé dans le dossier que tu as choisi sur ton ordinateur. Rien n'est envoyé sur internet : l'adresse web sert seulement à télécharger l'application."],
  ["Quelqu'un d'autre peut-il les lire ?","Non, sauf si tu lui donnes ton fichier. Avec le chiffrement (Paramètres > Sécurité), même un fichier copié reste illisible sans ton mot de passe ou ta clé de secours."],
  ["J'ai oublié mon mot de passe.","Déverrouille avec ta clé de secours, puis choisis un nouveau mot de passe. Sans l'un ni l'autre, personne ne peut rouvrir le carnet, pas même l'auteur de l'outil : garde ta clé hors de l'ordinateur."],
  ["J'ai fait une erreur, ou perdu des saisies : comment revenir en arrière ?","Le sous-dossier <code>sauvegardes/</code> garde une copie par heure (48 h), puis une par jour (30 jours). Choisis la bonne dans « Importer un JSON », en bas de page, puis « Fusionner » : rien de ce qui existe n'est effacé."],
  ["Je change d'ordinateur.","Si ton dossier est synchronisé (OneDrive, Google Drive…), ouvre l'application sur le nouvel ordinateur et choisis « J'ai déjà un carnet ». Sinon, « Exporter JSON » sur l'ancien, « Importer » sur le nouveau."],
  ['Ça marche sur téléphone, Safari ou Firefox ?',"Pas encore : il faut Chrome ou Edge sur ordinateur pour écrire dans un dossier. Ailleurs, les saisies restent dans le navigateur : exporte-les régulièrement."]]],
 ['Utiliser le carnet',[
  ['Que faut-il saisir, au minimum ?',"Chaque entretien : le type, la durée et la personne. Trente secondes. Les notes, les XP de pratique et le suivi sont facultatifs et enrichissent ta fiche."],
  ['Comment retrouver ou corriger une saisie ?',"Dans Mes saisies : filtre par type, par personne ou par période, puis modifie directement la ligne (date, type, durée, personne). Le bouton « Fiche » ouvre la saisie entière : infos, notes et, selon tes modules, XP de pratique, contrat et coût ; tout s'y modifie. Un point jaune sur « Fiche » signale des XP à répartir."],
  ["Comment écrire des notes sur plusieurs lignes ?","« Ce qu'on a vu » tient sur une ligne, sauf pour les types où « Notes longues » est cochée dans Paramètres > Types d'activité (la rencontre réseau, par défaut) : la zone s'agrandit et la touche Entrée passe à la ligne, dans la saisie comme dans Mes saisies."],
  ['Comment choisir mes indicateurs ?',"« Changer mes indicateurs », dans Suivi d'activité, ouvre un catalogue classé en trois piliers : coacher, pratiquer, développer ton activité. Jusqu'à 6 indicateurs ; les 3 premiers deviennent tes bandeaux principaux, avec ton niveau. Peu d'indicateurs, regardés souvent."],
  ['Que trouve-t-on dans Paramètres ?',"Ton identité et l'apparence (nom, logo, couleurs), la sécurité (chiffrement, verrouillage), le dossier où ranger ton carnet, tes types d'activité et tes compétences, le suivi des personnes (« Plus tard »), les indicateurs en bandeaux, tes coûts pour le taux horaire réel, le partage à un pair et le parcours de démarrage. En bas de page : exports et imports (JSON, CSV)."],
  ['Que sont les XP de pratique ?',"Avec le module « Affûter mes compétences », chaque entretien rapporte des XP selon sa durée : 10 minutes = 1 XP, multiplié par 2 pour une séance ou une conversation, par 3 pour une supervision, par 1 pour un débrief ou un entraînement. Tu les répartis entre les compétences que tu as travaillées, et chacune monte de niveau (10, 30, 60, 100, 150 XP…). Les rencontres réseau, invitations et propositions rapportent de 0 à 5 XP de Facultés commerciales, avec ce qui a été facile ou difficile. Un transfert, dans l'onglet Pratique délibérée, déplace des XP d'une compétence à une autre sans en créer."],
  ['Que sont devenues mes notes de 1 à 5 ?',"À la mise à jour 3.0.0, chaque entretien noté a reçu ses XP, répartis à parts égales entre les compétences que tu avais notées (le reste va à ton focus). Une rencontre, une invitation ou une proposition notée donne sa note en XP de Facultés commerciales. Une copie de ton carnet a été faite juste avant, dans le dossier sauvegardes, et tes notes d'origine restent gardées dans chaque saisie. Tes anciennes saisies non notées restent sans XP : tu peux les répartir si tu veux, dans leur fiche (Mes saisies, bouton « Fiche »)."],
  ['Invitation, conversation, séance : quelle différence ?',`<b>${esc(TM.invitation?.l||'Invitation')}</b> : tu proposes à quelqu'un de découvrir le coaching. <b>${esc(TM.conversation?.l||'Conversation')}</b> : un échange offert, une vraie séance de découverte. <b>${esc(TM.session?.l||'Séance')}</b> : une séance sous contrat, après une proposition acceptée.`],
  ['Comment noter un non ?',"Pour une invitation déclinée, coche « Elle a dit non » dans la saisie (ou plus tard dans sa fiche, depuis Mes saisies). Pour une proposition, passe-la à « Refusée ». Tes non sont comptés dans Suivi d'activité : ils prouvent que tu proposes."],
  ["Comment l'étape d'une personne change-t-elle ?","Toute seule, au fil de tes saisies : une conversation la fait passer « En conversation », une proposition « Proposition envoyée », etc. Tu peux aussi la choisir à la main dans sa fiche. Le bouton « ? Les étapes » de l'onglet Personnes détaille tout."],
  ['Que fait « Traiter » dans À relancer ?',"Une petite fenêtre pour chaque relance : c'est fait, annulée, une autre date (+2 j, +1 semaine, +1 mois ou la date de ton choix), plus tard (14 jours par défaut, réglable dans Paramètres > Suivi des personnes), et un commentaire. Pour une action, le commentaire s'ajoute, daté, à son « Résultat » ; pour une personne, il devient le prochain sujet à évoquer."],
  ['Qu\'est-ce que le rythme de contact ?',"Chaque personne a un rythme : tous les mois, tous les 3 mois (par défaut), tous les 6 mois, une fois par an, ou pas de relance. Quand le dernier échange est plus ancien, elle revient dans « À relancer ». « Préparer » ouvre alors l'onglet Notes de sa fiche, pour relire ce qu'il faut garder en tête avant de la recontacter."],
  ["À quoi sert l'onglet Réseau ?","Avec le module « Créer mon activité », il dessine tes personnes autour de leurs cercles (ou de leur public, de leur problématique), ou en orbites autour de toi selon la proximité. La couleur dit l'étape, la taille le nombre d'échanges ; les pointillés rouges signalent les personnes à relancer, le contour doré les passerelles entre deux cercles. Le panneau de droite repère les passerelles, les groupes à réchauffer, les pistes de développement et les chaînes de recommandation. Un clic sur un point ouvre la fiche, un clic sur un groupe le met en avant. La molette ou les boutons + et − zooment, glisser le fond déplace la vue, ⟲ recentre ; un point déplacé à la souris reprend sa place à la prochaine ouverture."],
  ['Les personnes archivées ou « Sans suite » sont-elles dans le réseau ?',"Pas par défaut. La case « Inclure archivé·es et sans suite » les affiche en gris. Le dessin est recalculé à l'identique à chaque ouverture ; tu peux déplacer un point à la souris, le temps de la consultation, sans que rien soit enregistré."],
  ['Pourquoi certaines personnes ne sont pas dans le pipeline ?',"Le pipeline commence à l'invitation. Une personne seulement rencontrée (Rencontre réseau), ou sans aucune saisie, est un contact réseau : elle garde sa fiche, ses cercles et son rythme, et se retrouve par la recherche de l'onglet Personnes. Une invitation la fait entrer dans la colonne « Invité·e »."],
  ['Que sont les modules de « Mon carnet » ?',"Le socle est toujours là : tes entretiens, Mes saisies, tes personnes (cercles, rythme de contact), « À relancer » avec les relances au rythme, et ton suivi d'activité avec les niveaux des bandeaux. Tu y ajoutes ce sur quoi tu travailles : ① Coacher beaucoup (tableau de bord, objectifs, plan d'action), ② Affûter mes compétences (pratique délibérée, XP de pratique, supervision), ③ Créer mon activité (réseau, proximité, Facultés commerciales, coûts et taux horaire), ④ Le jeu (fiche de coach, rang, hauts faits). « Essentiel » n'en garde aucun, « Tout » les affiche tous. Le menu « Mon carnet », en haut à droite, ou Paramètres : un module masqué ne fait rien perdre et ne te signale plus rien."],
  ['Comment sont calculés mon niveau et mon rang ?',"Chaque statistique a son niveau, de 1 à 100, calé sur le parcours d'un coach régulier : le niveau 25 correspond à environ un an de pratique, le niveau 100 à une trentaine d'années. Ton niveau global est la moyenne des statistiques que tu as déjà commencé à remplir."],
  ["J'ai déjà des années de pratique : je repars de zéro ?","Non. Dans Coach > Reprendre ton historique, importe tes anciennes saisies en CSV ou déclare simplement tes totaux d'avant l'outil."]]],
 ["L'outil",[
  ['Combien ça coûte ?',"Rien. L'outil est gratuit pour tous les coachs, y compris pour leur activité professionnelle (licence PolyForm Shield). Le revendre ou en faire un service concurrent est interdit sans accord."],
  ['Comment se font les mises à jour ?',"Automatiquement : au lancement, une bannière propose de recharger, puis un écran présente les nouveautés. Tes données ne sont jamais touchées par une mise à jour."],
  ['Comment le partager à un confrère ou une consœur ?',"Envoie simplement l'adresse de l'application. Pour transmettre aussi tes réglages (types, couleurs, indicateurs) sans tes données : Paramètres > Partager à un pair."],
  ['Une idée, un souci ?',"Parles-en à Allan : chaque retour de coach nourrit les prochaines versions."]]]];
function renderAbout(){const R=$('about');if(!R)return;
 R.innerHTML=`<div class="ab-h"><div class="ab-ti">À propos</div><p>Pourquoi ce carnet, l'approche qu'il porte, et comment il est construit. <a href="../" target="_blank" rel="noopener" style="color:var(--am);font-weight:800">Le site de Carnet de coach</a></p></div>
 <div class="card ab-t ab-val" id="abVal"><div class="ab-k">À quoi sert ton carnet</div><h2>${VAL_T}</h2><p>${VAL_L}</p>${valCards()}<p class="ab-valf">${VAL_F}</p></div>
 <div class="ab-g">
  <div class="card ab-t ab-l">${letterHtml()}</div>
  <div class="ab-c">
   <div class="card ab-t"><div class="ab-k">La démarche</div><h2>Créer tes clients par la relation</h2><p>Le coaching se vend par le coaching : rencontrer, aider sans rien attendre, faire vivre une vraie séance, choisir tes clients, proposer dans un rendez-vous dédié, travailler sur des cycles à un prix juste.${CITE?" L'approche de Gianni Bergandi et Magali Wagner (Odyssée), et de Rich Litvin.":''}</p><button class="btn2" id="abPipe">Lire la démarche</button></div>
   <div class="card ab-t"><div class="ab-k">Sous le capot</div><h2>Comment l'outil est construit</h2><ul><li>Un seul fichier qui tourne dans ton navigateur, sans serveur ni compte.</li><li>Tes données dans un seul fichier, dans ton dossier.</li><li>Chaque saisie enregistrée en une fraction de seconde, fusionnée si le fichier a changé ailleurs.</li><li>Chiffrement AES-GCM, clé de secours, copies de sécurité.</li></ul><button class="btn2" id="abArch">Voir les schémas</button></div>
  </div></div>
 <div class="card ab-faq"><h2>Questions fréquentes</h2><div class="ab-fgs">${FAQ().map(([g,qs])=>`<div class="ab-fg"><div class="ab-k">${g}</div>${qs.map(([q,a])=>`<details><summary>${q}</summary><p>${a}</p></details>`).join('')}</div>`).join('')}</div></div>
`;
 $('abPipe').onclick=()=>openPipe();$('abArch').onclick=()=>window.open('arch.html','_blank','noopener')}

const WS={
 hello:()=>({t:'Bienvenue',html:`${letterHtml()}
  ${WFIRST?`<div class="wzalt">${FS_OK?'<a id="wzOpen">J\'ai déjà un carnet : ouvrir son dossier</a>':''}<a id="wzImp">Importer une sauvegarde ou un modèle</a>${!DB||DB.demo?'<a id="wzDemo">Explorer un carnet de démonstration</a>':''}<a id="wzLang" data-noi18n>${LANG==='en'?'Français':'English'}</a>${WBACK&&!DB?'<a id="wzBackBook">Revenir à mon carnet</a>':''}</div>`:''}`,
  next:WBACK&&DB?'Revenir à mon carnet':'Commencer',
  bind:()=>{if($('wzOpen'))$('wzOpen').onclick=()=>connectDir(false);if($('wzImp'))$('wzImp').onclick=()=>$('impFile').click();if($('wzDemo'))$('wzDemo').onclick=()=>openDemo();if($('wzLang'))$('wzLang').onclick=()=>setLang(LANG==='en'?'fr':'en');if($('wzBackBook'))$('wzBackBook').onclick=()=>{closeWizard();if(DB){$('main').style.visibility='visible';renderAll()}else boot()}},
  go:async()=>{if(WBACK&&DB){closeWizard();$('main').style.visibility='visible';renderAll();return false}return DB?true:await startFresh()}}),

 valeur:()=>({t:VAL_T,lead:VAL_L,html:`${valCards()}<div class="wznote wzvalf">${VAL_F}</div>`,next:'Continuer'}),

 /* 3.2.0 : « Sur quoi veux-tu travailler ? » remplace « Ton mode » ; Essentiel par défaut, comme l'ancien simplifié */
 mode:()=>{if(DB&&!(DB.prefs.modules&&typeof DB.prefs.modules=='object'))setMods(modsAll(false));
  const card=(k,i)=>`<button class="wzmc ${MOD(k)?'on':''}${k=='jeu'?' wzjeu':''}" data-wm="${k}"><span class="wzck">${MOD(k)?'✓':''}</span>${k=='jeu'?'':`<span class="ic">${i+1}</span>`}<b>${WZMOD[k][0]}</b><p>${WZMOD[k][1]}</p></button>`;
  return{t:'Sur quoi veux-tu travailler ?',lead:'Coche ce qui compte pour toi maintenant. Le suivi de tes entretiens et de tes personnes (cercles, rythme de contact, « À relancer ») est toujours là. Tu pourras changer à tout moment avec « Mon carnet », en haut à droite : rien n\'est perdu.',
  html:`<div class="wzmods">${['coacher','competences','activite'].map(card).join('')}</div>${card('jeu',3)}
   <div class="wzsc"><span>Raccourcis :</span><button type="button" class="btn2 ${ESS()?'on':''}" data-wms="0">Essentiel</button><button type="button" class="btn2 ${MODS.every(MOD)?'on':''}" data-wms="1">Tout</button><span>${ESS()?'Essentiel : tes entretiens, tes personnes, ton suivi d\'activité. Idéal pour démarrer.':''}</span></div>`,
  bind:()=>{document.querySelectorAll('[data-wm]').forEach(b=>b.onclick=()=>{const o=Object.fromEntries(MODS.map(k=>[k,MOD(k)]));o[b.dataset.wm]=!o[b.dataset.wm];setMods(o);renderWiz()});
   document.querySelectorAll('[data-wms]').forEach(b=>b.onclick=()=>{setMods(modsAll(b.dataset.wms=='1'));renderWiz()})},
  go:()=>true}},
 ident:()=>{const C=CFG(),K=C.couleurs,cur=PALETTES.findIndex(p=>Object.keys(p.c).every(k=>p.c[k].toLowerCase()==K[k].toLowerCase()));
  return{t:'Ton cabinet',lead:'Ton carnet doit te ressembler. L\'aperçu à gauche se met à jour en direct ; tout reste modifiable dans Paramètres.',next:'Entrer dans mon carnet',
  html:`<label class="wzl" style="margin-top:0">Nom</label><input class="fin" id="wNom" value="${esc(C.nom)}" placeholder="Le nom de ton cabinet">
   <label class="wzl">Logo <span style="text-transform:none;letter-spacing:0;font-weight:600">· facultatif, il sert aussi d'icône à l'application</span></label>
   <div class="imgrow"><div class="imgprev" style="${C.logo?`background-image:url('${C.logo}')`:''}"></div><button class="btn2" id="wLogo">${C.logo?'Changer le logo':'Choisir un logo'}</button></div>
   <label class="wzl">Couleurs</label><div class="pals">${PALETTES.map((p,i)=>`<button class="pal ${i==cur?'on':''}" data-p="${i}"><span>${stackColors(p.c).slice(0,4).concat([p.c.fonce]).map(c=>`<i style="background:${c}"></i>`).join('')}</span>${p.n}</button>`).join('')}</div>`,
  bind:()=>{$('wNom').oninput=e=>{C.nom=e.target.value;wzLive()};$('wLogo').onclick=()=>{IMGT='logo';$('imgFile').click()};
   document.querySelectorAll('.pal').forEach(b=>b.onclick=()=>{C.couleurs={...PALETTES[+b.dataset.p].c};C.couleursAuto=true;applyStackColors(C);wzLive();renderWiz()})},
  go:async()=>{if(!C.nom.trim()){toast('Donne un nom à ton carnet');return false}DB.prefs.onboarded=true;DB.prefs.nouveautes_vues=APP_VERSION;const Q=QS();Q.open=true;Q.hide=false;touch();closeWizard();$('main').style.visibility='visible';await afterLoad();goTab(MOD('coacher')?'dash':'metrics');window.scrollTo({top:0});renderQuest();setTimeout(()=>showMe(qNext()),800);return false}}},
};
$('reTour').onclick=()=>openWizard(WZ.indexOf('ident'),false);

