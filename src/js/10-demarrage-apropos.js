/* =========================================================
   PARCOURS DE DÉMARRAGE
   ========================================================= */
const WZ=['hello','valeur','mode','ident'];
const WZL={hello:'Bienvenue',valeur:'À quoi sert ton carnet',mode:'Ton mode',principe:'Le principe',ident:'Ton identité',types:'Tes entretiens',suivi:'Le suivi',axes:'Tes axes de progression',prio:'Priorités et objectifs',actions:'Premières actions',activite:'Personnes et coûts',first:'Premier entretien',secu:'Sécurité',done:'C\'est prêt'};
const ICO={home:'<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 11l9-7 9 7"/><path d="M5 10v10h14V10"/></svg>',
 lock:'<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>',
 save:'<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 3v12"/><path d="M7 10l5 5 5-5"/><path d="M4 19h16"/></svg>'};
let WI=0,WFIRST=true,WBACK=false,WTMP={};
function openWizard(i=0,first=true,back=false){WI=i;WFIRST=first;WBACK=back;WTMP={};$('lock').classList.add('hide');$('wiz').classList.remove('hide');renderWiz()}
function closeWizard(){$('wiz').classList.add('hide')}
function showWelcome(back){$('main').style.visibility='hidden';openWizard(0,true,back)}
function wzSide(){const C=DB?CFG():defaultConfig(),K=C.couleurs,ini=(C.nom||'?').split(/\s+/).map(w=>w[0]).join('').slice(0,2).toUpperCase();
 $('wzSide').style.background=C.bandeau?`linear-gradient(180deg,${K.fonce}d9,${K.fonce}f5),url("${C.bandeau}") center/cover`:`linear-gradient(165deg,${mix(K.fonce,K.bleu,.3)} 0%,${K.fonce} 75%)`;
 $('wzBrand').innerHTML=`${C.logo?`<img src="${C.logo}" alt="">`:`<div class="ini">${esc(ini)}</div>`}<div><b>${esc(DB?C.nom:'Ton carnet')}</b><span>${esc(C.outil||'')}</span></div>`;
 $('wzSteps').innerHTML=wzVis().map((k,i)=>{const n=i+1,j=WZ.indexOf(k);return `<li class="${j<WI?'ok':j==WI?'cur':''}"><b>${j<WI?'✓':n}</b>${WZL[k]}</li>`}).join('');
 $('wzQuote').textContent=DB?C.sousTitre:''}
function renderWiz(){const k=WZ[WI],st=WS[k]();wzSide();
 $('wzKicker').textContent=k=='hello'?'':`Étape ${wzVis().indexOf(WZ[WI])+1} sur ${wzVis().length}`;
 $('wiz').classList.toggle('hello',k=='hello');$('wzTitle').textContent=st.t;$('wzLead').innerHTML=st.lead||'';$('wzBody').innerHTML=st.html;
 $('wzBack').classList.toggle('hide',WI==0||k=='done');$('wzSkip').classList.toggle('hide',!st.skip);$('wzNext').textContent=st.next||'Continuer';
 if(st.bind)st.bind();
 $('wzNext').onclick=async()=>{let ok=true;if(st.go){$('wzNext').disabled=true;try{ok=await st.go()}catch(e){ok=false;toast('Une erreur est survenue')}$('wzNext').disabled=false}if(ok!==false)wzGo(1)};
 $('wzSkip').onclick=()=>wzGo(1);$('wzBack').onclick=()=>wzGo(-1);$('wzMain').scrollTop=0}
const WZSKIP=['types','axes','prio','actions','activite'];
const wzVis=()=>WZ.filter(k=>!(SIMPLE()&&WZSKIP.includes(k)));
function wzGo(d){WI=Math.max(0,Math.min(WZ.length-1,WI+d));while(SIMPLE()&&WZSKIP.includes(WZ[WI])&&WI>0&&WI<WZ.length-1)WI+=d>=0?1:-1;renderWiz()}
const wzLive=()=>{touch();applyConfig();wzSide()};
async function wzPickDir(){let nd;try{nd=await window.showDirectoryPicker({id:'aocoach',mode:'readwrite'})}catch(e){return}
 const t=await readFile(nd,FILE);if(t){let f=null;try{f=JSON.parse(t)}catch(e){}if(!f||!sameBook(f,DB)){toast('Ce dossier contient déjà un autre carnet : choisis un dossier vide');return}}
 DIR=nd;NEEDPERM=false;await idb.set('dir',nd);clearTimeout(saveT);await persist();banner(null);renderWiz()}
async function activateEnc(pwd){await setDEK(crypto.getRandomValues(new Uint8Array(32)));const key=newRecoveryKey();
 ENV={cles:{mdp:await wrapWith(pwd,IT_PWD),secours:await wrapWith(normRec(key),IT_REC)}};DB.prefs.autolock=DB.prefs.autolock??15;
 touch();clearTimeout(saveT);await persist();await encryptOldBackups();updLockBtn();return key}

const ALLAN_PH='data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBAUEBAYFBQUGBgYHCQ4JCQgICRINDQoOFRIWFhUSFBQXGiEcFxgfGRQUHScdHyIjJSUlFhwpLCgkKyEkJST/2wBDAQYGBgkICREJCREkGBQYJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCT/wAARCACwALADASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD2bbRt+tP2mjaa9C5w2I8GipMUYo5mKxHRT8UbafMFiPAox70/bSbafMFhmKAmaeVA6igN1x2pOQWGMpBxSYpsN9DcSNGHHmr1jbhh+FSt7d6FIbRHijFP2+lJg1VyRuKXFLS8elFwsNxRin/hR+FFwsMowPSn49qcFFHMFiHbSbanYKo9ajPNCkHKWtpo2n0qQoV60lY8xpZkdFSU049KfMIYQKTFOqK4uILSF57iaOGFBlpJGCqo9yaLgOpDgDNcBq/xo0K3Vxo0UmrlSVNwreTag/8AXRh83/AAa878SfG3xPOXi02ezibGStrD8sY95HJJ/ICpnNQV2XTpym7I9t1bXBpkLTPZXU8YByYomOB+WP1rjh8avCrM5TUHtzFgNBPAwd26YXHH45r5v1nxPrOtTPJqWtXd/Ic5VpzsH4f4CsKW7b/nqi9uuaw9u3sdH1dL4j6T1344aDJbfLoupXBDYWfesJjb1U5JzWPYftB39rGV1PSHlgB+S5XiQD0ZeAT/ALQwPavAkvimCs7hgc5BNPk1SUj55pJPY8/zo9ow9lE+lrX9obRZvlk024VsDkXEag/ma04fjloLH99puqRJjPmIIplH12OT+lfKS346nOPcVas9VaFv3eUwc/eAFaxqr7REqK6H1/oPxM8M+I9TTS7G8f7bIpdIZYyhYAZOD0PHNdYOe1fHOj+Ll07xPoGoQwW0S6dMrNNCcvMjEBw7dyPmx6A4r6+s7lZ1RlcSRyLujkHRx/jWinfYxlDl3LOKMCnCjFO5FhMUmKdijFFwsMI9aaVqXFIRTuFi40+8fdxUIYkkGn7aMVyLQ6JO4lIaWmk1pciwjV85+NdUn1/xP4us9b1hhY2FykGn2PksftDFuVBBGAApyT69a918WeIbfwxoN1qlw4VYlwg/vOeFH518yOZtd1Ca/aSR3uZWduc7jnnnPr+grmxGJ9lsdWGw3tSOaSS7DklcoNoPRIRjoq1zms6lbQW4srNfMQHc7nq7erH+QrX1mZElWyG95CwH2eL+M+rGsfVdKuioEzAEHCxIPlT2FcH1h1JqVRnqLD8kXGmjmLiWWUnJCr6A4quF5+5/Wuw0rwDqepkOIfLjPduK6SD4XtbqDJtJ9+laPGUou1zOOX1p+9Y8tEXsfwqWOGQfdBYelernwBZIuJEBPr0qRfC+nwKMQKSO/etFiE1oS8DNPU8km0+4X5vLYDr0qqEO/a52eua9kuNGhdceWuPYVyuveE1kjaSJNrj9acayvqRPCtK6ORSfcEtosiPOSP7x9TXvv7O/xCdz/wAIlqc5YMPN055G5GPvRfzI/EV8/QBrS6y4wU457VraTqMmmXdrfWrtHLayq8bjg7gc11Rl1OGUb6H3UKUCq2n3iX9lb3SY2zxJKMdPmUH+tWQ6itlM53BocF9aekYJ600MuM0vmAdDik5N7FKPcV4sduKb5R9KcZWI9RSpNg+1LmkPkiT4FAVT1qs1wQetKt0M1jctLXUnMeT6U1owAcnml84NUTkt3pczKtE8h/aL1OK18NWtm+5zNIz7AeBgAbj+fH1rxHT9beysVAYAkHdgcJnnbn1r0H4z6VrniHxBfSokn2WziYqXTaCFHROpYZOSeBn6V5Da2b3sbRhyqRLkH+8eeR9Sa5MRFS1kd2Gk4aROx8D6Q2pTXGourPNOxEII5Udz7V6JpXgGJGFxep5sg+6p+6v+Jq/8LfDsNh4ctJmXM0q7mJ7DsK7cqq5UAV87WrSnN22PqMPTjCnG+5y76bHCAAgUDsKrXVsu32rc1CPJIwAM9ax7t/LQ5596ukl0NakrnOaiuyTbn8qobQevSr9wWmZvl6dKqOjLjnGK9Snojy6m9ysyqDg1DNbJMpBGQallbFJHLlsV0xOaR5p4z0L7DcrcRqAr8GufhBZ4lAxk7cV634u0oX2jyMq7ig3CvLoEEcsbMpby2ztzjP411U3pY8vEQtK6PszwjKreGNJMZbYLSIDcMEYQCtpZOOawfA9rFD4U0sQPuia3R1IORgjOB7VuiMit0cZJvOOlNBPvTlB9KX9KoVwLMRxSeYwoLU0H2oEWvspp32ZRVrFGK5rmxAY1UALmmbSepqyQKaUBppgc14r0mO70bUSiYlmgZGYDkjB/+vXy7HZrDcS28KLtz8x7knoP5V9hzW6yxtGwyGBBz718hzu+meIdSsb4bbm2meLb2ypIrjxd7XR24Nq9j3DwW5TQ4EIAZFAwK25Xx0rm/AjM2iw5PPTg9q3NSvbewVTM/J6Ad6+bScm7H1V1GKuR3Ee8Enk1g6qhRWZuOKrat8RdEsARPdhcdgOTXPXfxD0nWHbyJpcD1QiuylTknsZTqx2uSLITOQ2ADxUl5HFGgyfmrNkuRIqyxnINZus6xPHFiPl8V6EVdqxxSlZO5pS+VjJIAqkb+wjfBmX04Oa4iSDVtVmxJqDoueimtC18KtGu77VK7f7WOa648qOFyk9kd/DGl3alQQ6OMZHQivHtbsf7O1a4tgPuucfzr0rw8JdMlWMyEwscMhPT3Fcl8R7JrTxM7gZWeMOAO56VvG17o5q6drSPp7wHD5Pg3RUHazi/LbXQhBWB4AlWbwhpCl0MsVpFHIisCUYKBg46Guk2ZrW557QzAAppUGpdlGyncgrlMmgrU+ykKU+YC5mjNR76Xf7Vy8xvyj80tR7qXcPWncLDjyK+afjx4dbS/HsWqIn+j6miOzY4Ei/Kw/Lafxr6W7V498WZ18UveaFEsf2nTisqo0Zzycblb9CPeufE1owj73U68Fh6lWb9mttSf4dyJL4ajlHWNT+eKq6vp32+NpLmaUZB3EPjGetS/CiM/wDCOTxjPyTFOfoKTxN4T1DxDIbeXUWsNOX/AFnlf6yX2z2FeBNcsrI+npPmjdnlHia+8K6ZK0RZZ5l6hPnb8a56LVYJZIzDZtHHI2xWbB598fhXomr+CPCmlwrbW2nzXTIxZRguSfc1J4V8HXd3qMbizisraNsldo3EelejGrT5OpySo1efojofD+hw3fhgXElt5EwHzLnP41w3ia2xFtToGwSPSvbpLBYNNlhVQpIPArym+twLmaKQZ5PWowDbumXjYpRTR5XcabfTM/zMr7/kG/C7ffFW9N0LV1iO24kjkyNreaSvvkGututFid842nsaLfS1jYDLH8TivV1SsjyfZJu4mijU7d0jvmjnGeJFPIqz8RtIF9Y6dqKKcwyiKQjrtbGD+B/nWhBbBRnaBWvPZjUdCubNuS6kDPY44P54qqehNaN0R/CvUJtC8bWmlLMDYXduYkXsW5IJ9TkfrXvYGa+afAE1xf8AiDTDP8tzY3PXGD907h+Yr2qTXrlMBTxVUIykmc+OjFSTXY6zbRisrTtehuECyna/etMSoy7gwIrR3W5xWFxSYqrcarbwcFgTVIa+rNgLTSYWRdbUrdGwZBmpluY3Xcrgj61xudxyxp/2iSLAVyB6Zo9iXznZCVT/ABCnBwe4rko9RmXqSfxqaLU5N/zE4pOix851IcHgGvOPFIg0LxLrGrXcReG5solG3rnf2/I1051DyxkMa5nxyG13SXgyEk27Fc9M5yM+2f515+Y0G6N+x62TVlHEKL2lp+v6EHw4voLnSZ54IjCktzI+wnOOldReQK8JIwciuP8ABtvPo1mNGurfyri3HmM6nckgYk5B9ea622mUtiQZHavAlO0j6GVOzdjBOmBpMyDj0q1p8qLdeUgAUelWtVdY0YqOMdRXP6XfrFqIZxuxngVu2nEUI3OjmnEySII2GOjeteXa6m3VHZRnPOKuXPxR1lvEz6Za6HLNZt8jvE2CvvgjkD61yfiO/wBSh1G8iSP/AEhD+7VzgHPTn0rrwb5ZpHNi17j8izI8rIXkjIUHqBToCCcZrn9Ev9caOeHU8NvHBVcAVr2g2ybyoDkYJ9RXqXPLSNhBge9X7WbYjL61Qt+VzU0BZ5fL/vEAGk3qRJaEfgLSmg8SJcKzO5V57hycjccgAfnXpG0Svg1kaHo6aHasgk8yZzl3xgfQe1aiyY5zzXdSpuMfM83EVVUnpsMlgkibIzj2qRL66hXG9ttWrdRKmSc09okC/MAar2vRmfsbq6M5rtmJOCfrURuSejDP1qLWi8VnPJH8uFODXA+C9Uvb/VZo5pWdVJwKHXSko23BUHyuVzPvviPqMkreSwRc8VZbxD4lu4VdJEAxnjOayrfwawjzcNuYciuj0PAtGhaIsy/KGry/bS3udaoLqjGt/irqGn3Bt7xVfYcHFdOvxQsWt1k3YJ6j0rjrj4fxXOovcXExQSNuxmpLzwXY+SYoJCGHcGtlX7Mx9hNHdRfESwmdFNwoDDk5qLUfHVpDcRokkckbcMDyCPQ15k3hK5STC5YDpzVuDwhNcgF5TG3pmpdXmXK9hRU1JNLU9qtdXsrtIJIZSqlQME5B9Oa1B98jpg5ryjTtCubW1Ea3DlVHTNelaTdG80+3mf8A1gUK/wBRwa8LG4eNP3obH1GBxU6vu1Ny1qibrUnOeKwtLtYxJJIMbicbu9a97Pm2dTzxXASfEHStMvlsbm6WEk84Unn04rCk21ZHXN8trnX3t2II3ZB8wHOBya8zuUk1e7uLhVJZASW9RmtLVvHMrRSpYwrHuyPMkUszfQVxV14m1NY2gs4p1EnLskDAkfjXfg47tbmGIhJrXY1AjRHlcinJdKrAelcuNU1mNvuyj/rqBT7dNckuFupvLCH/AJZhcHHrXrO9tTx5Jxeh39nLlc9sVbsWUXSE9Nw/nWLYynyVzkE1rabF9puljLbd3U+grLm1Ca0bO4mnCRGUkFcZ4qpa6xFdKWXAUcZNZ7boLYxGYuOlU7m3EtpHaQHYzHqOK6ZYmSfkcEcPFrzOng12FBt8xM/Wp21NpFyo615RqXh3Ura8wl3IvIJ5PSux0oXDQhI5DIUX5iaFiI25mL2U78tjdmhk1C3mhLYBWsTwZ4MWy1GaXzSSfep9Nub25mljUg9uO1WbTUv+EavWW6ZnDrn6Vx1cRzT9zc6YUeWn72xzUMqEbRycU/T0aCMkqeW5xXPaLp+tzHKwSBfVziurs9D1PaPNlRfbrVzjrdEU5WVmZWtm6mIWGKQj2FZ8SXsOS0EoA7kV3NtpEgdDJOpGfStZLe2RXjcI3HekptdBuz2ZwNv5hQOwIPpiq+oRyPcoY2dPpW3q2oW+mlpGQBc9qx7fxPp9xM7thVUFix6KB3NCk97BGPM1FbstwtNDHlpTtUZJPT60/wAAeOo9c1vUtKhUtBbxCVZT1Y7tp/DkYriPHPjUyaEFtF8mO7ZghPDNGOM/jUf7PccsviHVrl1xF9kCfiXH+Fc2JSnRlJnsUqH1arCEtZP8Ee4zOGDA965vTPCVjb6jc3rwJI8xP3lBwPxrblYo3lsTg9DU8cX7vgjNfPwqON7HsTgnZszJ7e3toCkSpGOeCua86165jgvXA3A4IHIAxXpF9ZSzErgHPSuN8Q+FIAXmlbEgHSvQwlaSlqY4icuS0dzlLdYGk3kB3HbOa09on2hhkjpiq1tYRw/IvBrRt4drcV7SbZ4c5XeoiKYzjHvVf/hLdO07W49Nmm8uaRAQ/wDCpJ4BPYmrN3KsY2g815N4uYS+KL1QehQD/vgURp87aMZyske4STXZXfGN0YOCauqktpNBOX3Z5A9K4D4ZeNg8P9i6pIoKj9zM5xkf3Sf5GvQdVkCWu5SMr0rmn7SnLlZfs425rDdVmmmkVhHuLdT6Vf0e5Sxt5g6kvIOtVbCUTWyM2Mkc1aYpjjFYVajaszWnC2qE8L3H9kTzvcZZZGyPaq/iGY6nfeZFwuMVd8tGiHFQmFc5xShK0udbinC8eR7Ea63sGFwo9hTZdeIUnJJrn/3vXbUW2VpgxBxXp8y7Hm+z8zpINfYRgvH8wbNTX+tfaTGYMrkANXOMzA56fWsnWfFUGktHbKyyXcxAAXkRj+8f6Cob10OmhhJ1XyxNfxWweyjiLgNI2AT/AJ9K84vL8alcR6JpW4pI4DykcyfX29qv3FzeXOnalqV1dTTASNBAGbgDjdgduOPxrK8DFY9cV5F+cqwTjof85qZTfLKXY+iweXKhOEJfFJ79l5epV8fMF1JbNM+XZxJEtdr8DLyO2vbiA4DXEQx9Qc/41wnixvO16+zn7+D+VP8ABmsyaVqsbK+1lYEGoqUnPD8vkceMqcmNdV7Xt+h9KXeGBpttqIgISXGOzdqp2GpR6pYpcxkfMPmH90+lRyyKWCGvlpJxZ7KtJXNuTUI1+bIzXEeKNVWSblunbtWndwK0Z2SvH/umvPvE8N3DPgXBYf3ivNdmDfNOzOPFpxhdIU36+ccEHmrA1JQPl5PtXMxRtv8A3sjt+lakJAj2IoUegr307HhvXct7y7F2OSa818Wr/wATme5UZ3Ng/wAq9CMuxMk9K8712USySk92J/WtqO5z4jZFe0lBKSZx/C3uDXc+FPHdxZJ/ZupKbyCP7p3fOoHYE9foa4C2OI8Hq3Aq4kjJLHMhwx/nXTKKkrM6KLvFcx7vpes6XfwJLZXKOjfw5wwPoV6g1px6haoD/Ea+fppTBOkkWUPDKR1U/WuqsvHtwwVJUiWXGCzcBj61yTwbekTSqlTi2r3PU5daggHzsAKdFqsc6b48EV5bd+Irq/QB44ivUFTUlt4mv7KIRxJGB71cMunbVHmrH0/Z+83zHfXl/DbQlioyRxXOXmuzWdjPetgRRKWC/wB49l/E1e1y9tJAAFLlTxjvXE+KrqS4sjEzYiBBCqTgH6d6y5oc3LE97DZPW5PbVlZLW3+ZlReLdRuZZLq8upJc52wg4Qfh6e1ZN3qEt3dm4d2Z89c9qoq+3KZxg1PZIs1zGrNhWYAk9h611cqWpjHEylGNNM73VYmtvBlhASQzIJH9yxzj+Vc54fne11i3kOAA4zk9B0603xJ45h1GUQW9oy20Q2IWPzEDgGseLU4JQfmKHsD0rClSlyNSW56dfM8O60fZz+H9C5rL+fqd5OGyjStgnuM1nQyGK8Vgcc1YuZAUTAxu56VS+7MJD0B5raMbKx4uPlzNtd7nr3hDxO9nErZ3IRhkz1rs49TgvF86KQEnqD1FeL6XdMka7T8tb0GqumCrMpHcGvFxWDUpXR0YbGuMUmeoxZu4mwc4rkPFTtFA6Ec9MkVFpfi6e0ysgEqnuetVdc16G+GVyCezVyUsNKFRXWh21MTGdPR6mTaDzD83Jq4SE4z+VZ8d2ByKHuMgk8V7J47JdQusRHb6VwOpH52B7muqu5SUOTXJ6i2+6KjoOtdNFHJWd2kRpghQOKtZ2nPBHUexqvGNrDPSpJXZIQ6YbHUV0I6KekWy7uMsKqT8y8ZqGRWB4HPf3qg2oXKg42D6UPc3LorGQjPoKocsVCWlmbGn6o9q/lsA8ZONrHkV0Mc0VygMZB9u4riYCdhJbJyOT3q9BcugzkjHTB6VtSrOGnQ5amDhiPeeku5//9k=';
/* ---------- À quoi sert ton carnet (3.1.0) : parcours de démarrage et onglet À propos ---------- */
const VAL_T="Moins de dispersion, plus de pratique.",VAL_L="Ton carnet t'aide à faire les trois choses qui font de toi un coach, et à les faire en jouant.",VAL_F='Trente secondes après chaque entretien suffisent.';
const VAL=[["Coacher beaucoup.","Marketing, formations, veille : intéressant, mais ça ne remplace pas l'essentiel : rencontrer, coacher, proposer. Ton carnet compte ces heures-là, les met en graphiques et fait monter ta fiche de coach niveau après niveau, comme dans un jeu."],
 ["Affûter quelques compétences.","On sort de l'école en sachant beaucoup et en maîtrisant peu. Choisis une ou deux compétences, investis-y chaque séance et ta supervision jusqu'à en faire des automatismes, puis passe aux suivantes. C'est ce qui donne du poids à tout ce que tu as appris."],
 ["Créer ton activité par la relation.","Le coaching se vend en coachant. Ton carnet te pousse aux gestes qui créent des rencontres : entretenir ton réseau, inviter, proposer, t'entourer de pairs qui partagent tes défis. Ce qu'on vit souvent comme une épreuve devient un jeu."]];
const valCards=()=>`<div class="wzcards val">${VAL.map(([t,p],i)=>`<div class="wzc"><div class="ic">${i+1}</div><b>${t}</b><p>${p}</p></div>`).join('')}</div>`;
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
  ['Comment retrouver ou corriger une saisie ?',"Dans Mes saisies : filtre par type, par personne ou par période, puis modifie directement la ligne (date, durée, personne, montant). Le bouton ◎ ouvre le détail : notes, ce qu'on a vu et, en mode complet, les XP de pratique. Les XP pas encore répartis y sont signalés « à répartir »."],
  ['Comment choisir mes indicateurs ?',"« Changer mes indicateurs », dans Suivi d'activité, ouvre un catalogue classé en trois piliers : coacher, pratiquer, développer ton activité. Jusqu'à 6 indicateurs ; les 3 premiers deviennent tes bandeaux principaux, avec ton niveau. Peu d'indicateurs, regardés souvent."],
  ['Que trouve-t-on dans Paramètres ?',"Ton identité et l'apparence (nom, logo, couleurs), la sécurité (chiffrement, verrouillage), le dossier où ranger ton carnet, tes types d'activité et tes compétences, le suivi des personnes (« Plus tard »), les indicateurs en bandeaux, tes coûts pour le taux horaire réel, le partage à un pair et le parcours de démarrage. En bas de page : exports et imports (JSON, CSV)."],
  ['Que sont les XP de pratique ?',"En mode complet, chaque entretien rapporte des XP selon sa durée : 10 minutes = 1 XP, multiplié par 2 pour une séance ou une conversation, par 3 pour une supervision, par 1 pour un débrief ou un entraînement. Tu les répartis entre les compétences que tu as travaillées, et chacune monte de niveau (10, 30, 60, 100, 150 XP…). Les rencontres réseau, invitations et propositions rapportent de 0 à 5 XP de Facultés commerciales, avec ce qui a été facile ou difficile. Un transfert, dans l'onglet Pratique délibérée, déplace des XP d'une compétence à une autre sans en créer."],
  ['Que sont devenues mes notes de 1 à 5 ?',"À la mise à jour 3.0.0, chaque entretien noté a reçu ses XP, répartis à parts égales entre les compétences que tu avais notées (le reste va à ton focus). Une rencontre, une invitation ou une proposition notée donne sa note en XP de Facultés commerciales. Une copie de ton carnet a été faite juste avant, dans le dossier sauvegardes, et tes notes d'origine restent gardées dans chaque saisie. Tes anciennes saisies non notées restent sans XP : tu peux les répartir si tu veux, dans Mes saisies ou le détail ◎."],
  ['Invitation, conversation, séance : quelle différence ?',`<b>${esc(TM.invitation?.l||'Invitation')}</b> : tu proposes à quelqu'un de découvrir le coaching. <b>${esc(TM.conversation?.l||'Conversation')}</b> : un échange offert, une vraie séance de découverte. <b>${esc(TM.session?.l||'Séance')}</b> : une séance sous contrat, après une proposition acceptée.`],
  ['Comment noter un non ?',"Pour une invitation déclinée, coche « Elle a dit non » dans la saisie (ou plus tard dans Mes saisies). Pour une proposition, passe-la à « Refusée ». Tes non sont comptés dans Suivi d'activité : ils prouvent que tu proposes."],
  ["Comment l'étape d'une personne change-t-elle ?","Toute seule, au fil de tes saisies : une conversation la fait passer « En conversation », une proposition « Proposition envoyée », etc. Tu peux aussi la choisir à la main dans sa fiche. Le bouton « ? Les étapes » de l'onglet Personnes détaille tout."],
  ['Que fait « Traiter » dans À relancer ?',"Une petite fenêtre pour chaque relance : c'est fait, annulée, une autre date (+2 j, +1 semaine, +1 mois ou la date de ton choix), plus tard (14 jours par défaut, réglable dans Paramètres > Suivi des personnes), et un commentaire. Pour une action, le commentaire s'ajoute, daté, à son « Résultat » ; pour une personne, il devient le prochain sujet à évoquer."],
  ['Qu\'est-ce que le rythme de contact ?',"Chaque personne a un rythme : tous les mois, tous les 3 mois (par défaut), tous les 6 mois, une fois par an, ou pas de relance. Quand le dernier échange est plus ancien, elle revient dans « À relancer ». « Préparer » ouvre alors l'onglet Notes de sa fiche, pour relire ce qu'il faut garder en tête avant de la recontacter."],
  ["À quoi sert l'onglet Réseau ?","En mode complet, il dessine tes personnes autour de leurs cercles (ou de leur public, de leur problématique), ou en orbites autour de toi selon la proximité. La couleur dit l'étape, la taille le nombre d'échanges ; les pointillés rouges signalent les personnes à relancer, le contour doré les passerelles entre deux cercles. Le panneau de droite repère les passerelles, les groupes à réchauffer, les pistes de développement et les chaînes de recommandation. Un clic sur un point ouvre la fiche, un clic sur un groupe le met en avant."],
  ['Les personnes archivées ou « Sans suite » sont-elles dans le réseau ?',"Pas par défaut. La case « Inclure archivé·es et sans suite » les affiche en gris. Le dessin est recalculé à l'identique à chaque ouverture ; tu peux déplacer un point à la souris, le temps de la consultation, sans que rien soit enregistré."],
  ['Pourquoi certaines personnes ne sont pas dans le pipeline ?',"Le pipeline commence à l'invitation. Une personne seulement rencontrée (Rencontre réseau), ou sans aucune saisie, est un contact réseau : elle garde sa fiche, ses cercles et son rythme, et se retrouve par la recherche de l'onglet Personnes. Une invitation la fait entrer dans la colonne « Invité·e »."],
  ['Mode simplifié ou complet ?',"Le simplifié garde l'essentiel : tes entretiens, tes personnes, ton activité. Le complet ajoute les XP de pratique, la pratique délibérée, les objectifs et les coûts. Bascule à tout moment, en haut à droite : rien n'est perdu."],
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

 mode:()=>({t:'Comment veux-tu commencer ?',lead:'Tu pourras changer à tout moment avec le bouton « Mode simplifié », en haut à droite. Rien n\'est perdu quand tu changes.',
  html:`<div class="wzmode"><button class="wzmc ${SIMPLE()?'on':''}" data-md="1"><b>Simplifié</b><p>L'essentiel : enregistrer tes entretiens, suivre ton activité et les personnes que tu accompagnes. Idéal pour démarrer.</p></button>
   <button class="wzmc ${DB&&DB.prefs.simple===false?'on':''}" data-md="0"><b>Complet</b><p>Tout l'outil : XP de pratique et pratique délibérée, fiche de coach, objectifs et plan d'action, coûts et taux horaire réel.</p></button></div>`,
  bind:()=>{document.querySelectorAll('[data-md]').forEach(b=>b.onclick=()=>{DB.prefs.simple=b.dataset.md=='1';touch();applyMode();renderWiz()})},
  go:()=>{if(DB&&DB.prefs.simple==null){DB.prefs.simple=true;touch();applyMode()}return true}}),
 principe:()=>({t:'Le principe',lead:'Une application simple, qui travaille pour toi et ne garde rien ailleurs que chez toi.',
  html:`<div class="wzcards">
   <div class="wzc"><div class="ic">${ICO.home}</div><b>Chez toi, pas dans le cloud</b><p>L'application tourne dans ton navigateur. Rien n'est envoyé sur internet : toutes tes données tiennent dans un seul fichier, sur ton ordinateur ou ton OneDrive.</p></div>
   <div class="wzc"><div class="ic">${ICO.lock}</div><b>Chiffré par ton mot de passe</b><p>Noms, notes, objectifs : illisibles sans ton mot de passe. Une clé de secours te permet de retrouver l'accès en cas d'oubli.</p></div>
   <div class="wzc"><div class="ic">${ICO.save}</div><b>Enregistré en continu</b><p>Chaque modification est sauvegardée aussitôt, avec des copies de sécurité automatiques (toutes les heures, puis chaque jour pendant 30 jours).</p></div></div>
   <div class="wznote">Tu choisiras ton dossier et ton mot de passe à la fin du parcours. D'ici là, tout est déjà gardé dans ce navigateur.</div>`,next:'Compris'}),

 ident:()=>{const C=CFG(),K=C.couleurs,cur=PALETTES.findIndex(p=>Object.keys(p.c).every(k=>p.c[k].toLowerCase()==K[k].toLowerCase()));
  return{t:'Ton cabinet',lead:'Ton carnet doit te ressembler. L\'aperçu à gauche se met à jour en direct ; tout reste modifiable dans Paramètres.',next:'Entrer dans mon carnet',
  html:`<label class="wzl" style="margin-top:0">Nom</label><input class="fin" id="wNom" value="${esc(C.nom)}" placeholder="Le nom de ton cabinet">
   <label class="wzl">Logo <span style="text-transform:none;letter-spacing:0;font-weight:600">· facultatif, il sert aussi d'icône à l'application</span></label>
   <div class="imgrow"><div class="imgprev" style="${C.logo?`background-image:url('${C.logo}')`:''}"></div><button class="btn2" id="wLogo">${C.logo?'Changer le logo':'Choisir un logo'}</button></div>
   <label class="wzl">Couleurs</label><div class="pals">${PALETTES.map((p,i)=>`<button class="pal ${i==cur?'on':''}" data-p="${i}"><span>${stackColors(p.c).slice(0,4).concat([p.c.fonce]).map(c=>`<i style="background:${c}"></i>`).join('')}</span>${p.n}</button>`).join('')}</div>`,
  bind:()=>{$('wNom').oninput=e=>{C.nom=e.target.value;wzLive()};$('wLogo').onclick=()=>{IMGT='logo';$('imgFile').click()};
   document.querySelectorAll('.pal').forEach(b=>b.onclick=()=>{C.couleurs={...PALETTES[+b.dataset.p].c};C.couleursAuto=true;applyStackColors(C);wzLive();renderWiz()})},
  go:async()=>{if(!C.nom.trim()){toast('Donne un nom à ton carnet');return false}DB.prefs.onboarded=true;DB.prefs.nouveautes_vues=APP_VERSION;const Q=QS();Q.open=true;Q.hide=false;touch();closeWizard();$('main').style.visibility='visible';await afterLoad();goTab(SIMPLE()?'metrics':'dash');window.scrollTo({top:0});renderQuest();setTimeout(()=>showMe(qNext()),800);return false}}},

 types:()=>{const C=CFG(),O=C.ordre;
  return{t:'Tes types d\'entretien',lead:'Nomme tes activités et classe-les <b>par ordre d\'importance</b> en les faisant glisser. Le n° 1 forme la base des graphiques et reçoit la couleur la plus forte.',
  html:`<div class="wzgrid2 types"><div class="wztbl"><table class="pt tight"><thead><tr><th class="fit">Rang</th><th class="fit"></th><th class="fit">Libellé</th><th class="fit">Durée</th><th class="fit">Compte dans</th><th></th></tr></thead><tbody id="wTypes">${O.map((k,i)=>{const t=C.types[k];return `<tr data-i="${i}">
   <td><span class="handle" title="Glisser pour réordonner">⋮⋮</span><span class="rk">${i+1}</span></td>
   <td><input type="color" data-c="${k}" value="${t.c}"></td><td><input class="ed" data-l="${k}" value="${esc(t.l)}" style="font-weight:700"></td>
   <td><select class="ed" data-du="${k}" style="width:84px">${DURS.map(d=>`<option value="${d}" ${d==t.d?'selected':''}>${fmtD(d)}</option>`).join('')}</select></td>
   <td>${roleCell(k,C)}</td><td>${delCell(k)}</td></tr>`}).join('')}</tbody></table></div>
   <div class="stackprev"><small>Aperçu d'une barre</small>${[...O].reverse().map((k,i)=>`<div class="r"><i style="background:${C.types[k].c}"></i>${esc(C.types[k].l)}</div>`).join('')}<small>↑ n° 1 à la base</small></div></div>
   <button class="addl" id="wAddT" ${O.length>=MAX_TYPES?'disabled':''}>+ Ajouter un type (${O.length}/${MAX_TYPES})</button>
   <div class="hint">« Compte dans » indique le calcul où le type est additionné (heures de coaching, pratique délibérée, développement ou autre). Tu peux ajouter jusqu\'à 10 types.${C.couleursAuto?'':' Tu as personnalisé des couleurs : elles ne suivent plus la palette (choisis une palette à l\'étape précédente pour revenir à l\'automatique).'}</div>`,
  bind:()=>{const B=$('wzBody');
   dragRows($('wTypes'),O,()=>{recolor(C);wzLive();renderWiz()});
   B.querySelectorAll('[data-c]').forEach(i=>i.onchange=()=>{C.types[i.dataset.c].c=i.value;C.couleursAuto=false;wzLive();renderWiz()});
   B.querySelectorAll('[data-l]').forEach(i=>i.onchange=()=>{C.types[i.dataset.l].l=i.value.trim()||defaultConfig().types[i.dataset.l]?.l||'Type';wzLive();renderWiz()});
   B.querySelectorAll('[data-du]').forEach(i=>i.onchange=()=>{C.types[i.dataset.du].d=+i.value;wzLive()});
   bindTypeExtras(B,C,()=>{wzLive();renderWiz()});$('wAddT').onclick=()=>{if(addCustomType(C)){wzLive();renderWiz()}}}}},

 suivi:()=>{const L=k=>`<strong>${esc(TM[k].l)}</strong>`;return{t:'Comment le suivi fonctionne',lead:'Peu d\'indicateurs, regardés souvent : on progresse sur ce que l\'on mesure.',
  html:`<div class="wzcards">
   <div class="wzc"><div class="ic">1</div><b>Coacher beaucoup</b><p>Tes heures de ${L('conversation')} et de ${L('session')}, et le nombre de personnes accompagnées. C'est le volume qui muscle ta pratique.</p></div>
   <div class="wzc"><div class="ic">2</div><b>Pratiquer délibérément</b><p>${L('debrief')}, ${L('supervision')}, et des XP de pratique à répartir après chaque entretien entre les compétences que tu travailles. C'est ce qui transforme l'expérience en compétence.</p></div>
   <div class="wzc"><div class="ic">3</div><b>Développer ton activité</b><p>${L('conversation')} offerte, puis ${L('proposition')} (montant proposé), puis ${L('session')} sous contrat (CA accepté) : le chemin d'un premier échange à un accompagnement. Chaque personne a sa fiche et son étape.</p></div></div>
   <div class="flow3 f4"><div><b>Tableau de bord</b>Ton cap : priorités, plan d'action, personnes à relancer, cibles du trimestre.</div><div><b>Suivi d'activité</b>Tes tendances : temps passé chaque mois, développement de ton activité.</div><div><b>Mes saisies</b>Le détail de chaque entretien, filtrable et modifiable.</div><div><b>Personnes</b>Les fiches de tes clients et prospects, en liste ou en pipeline.</div></div>
   <div class="wznote" style="display:flex;align-items:center;gap:12px"><span>Tes indicateurs se choisissent dans un catalogue de ${Object.keys(KPIDEF).length}, classés selon ces trois piliers.</span><button class="btn2" style="margin-left:auto;white-space:nowrap" data-kcat2>Choisir mes indicateurs</button></div>
   <div class="wznote">Au quotidien : un clic sur « + Enregistrer un temps » après chaque entretien. Moins de 30 secondes.</div>`,next:'Compris',bind:()=>{const b=document.querySelector('[data-kcat2]');if(b)b.onclick=openKcat}}},

 axes:()=>{const M=metrics(),cnt=id=>E().filter(e=>+e.xp?.[id]>0).length;
  const SUG=[['Écoute','',''],['Questionnement','',''],['Reformulation','',''],['Présence','',''],['Gestion du silence','','']].filter(s=>!M.some(m=>m.l==s[0]));
  const add=(l,mi,ma)=>{const n=M.reduce((x,m)=>Math.max(x,+String(m.id).slice(1)||0),0)+1;M.push({id:'m'+n,l,actif:true,min:mi,max:ma});wzLive();renderWiz()};
  return{t:'Tes axes de progression',lead:'Après chaque entretien, tu répartis tes XP de pratique entre les compétences que tu as travaillées : chacune monte de niveau. <b>Deux à cinq axes</b>, c\'est l\'idéal. « Facultés commerciales » reçoit les XP de tes rencontres, invitations et propositions.',
  html:`<div class="wztbl ax"><table class="pt tight"><thead><tr><th class="fit">Axe</th><th></th></tr></thead><tbody>${M.map((m,i)=>`<tr class="${m.actif?'':'arch'}">
   <td><input class="ed" data-f="l" data-i="${i}" value="${esc(m.l)}" style="font-weight:700"></td>
   <td>${m.fc?'':cnt(m.id)?`<button class="sw ${m.actif?'on':''}" data-act="${i}" title="Suivi"></button>`:`<button class="ibtn del" data-del="${i}" title="Retirer">✕</button>`}</td></tr>`).join('')||'<tr><td colspan="2" class="empty">Aucun axe pour l\'instant.</td></tr>'}</tbody></table></div>
   <label class="wzl">Suggestions</label><div class="chips">${SUG.map((s,i)=>`<button class="chip add" data-s="${i}">+ ${esc(s[0])}</button>`).join('')}<button class="chip add" id="wAddM">+ Autre axe</button></div>
   <div class="wznote">Quand un axe est acquis, archive-le et ouvres-en un nouveau : ses XP et son historique sont toujours conservés.</div>`,
  bind:()=>{const B=$('wzBody');
   B.querySelectorAll('[data-f]').forEach(i=>i.onchange=()=>{M[+i.dataset.i][i.dataset.f]=i.value.trim();wzLive()});
   B.querySelectorAll('[data-del]').forEach(b=>b.onclick=()=>{M.splice(+b.dataset.del,1);wzLive();renderWiz()});
   B.querySelectorAll('[data-act]').forEach(b=>b.onclick=()=>{const m=M[+b.dataset.act];m.actif=!m.actif;wzLive();renderWiz()});
   B.querySelectorAll('[data-s]').forEach(b=>b.onclick=()=>add(...SUG[+b.dataset.s]));
   $('wAddM').onclick=()=>{add('Nouvel axe','','');const ins=B.querySelectorAll('[data-f=l]');ins[ins.length-1]?.select()}},
  go:()=>{if(!mActive().length){toast('Garde au moins un axe suivi');return false}return true}}},

 prio:()=>{const P=DB.priorites,q=curQ(),O=DB.objectifs[q]??={},per=periods(q)[0];
  if(!P.length)P.push({o:'',d:''});
  const SUG=[['Développement commercial','Faire connaître mon offre'],['Volume de pratique','Coacher chaque semaine'],['Compétences','Progresser sur un axe précis'],['Structuration','Formaliser mon offre et mes tarifs']].filter(s=>!P.some(p=>p.o==s[0]));
  const TG=[['h','Heures de coaching','h'],['conv','Conversations',''],['coach','Personnes coachées',''],['delib','Pratique délibérée','h'],['ca','CA accepté','€']];
  return{t:'Tes priorités et tes objectifs',lead:'Choisis peu de priorités, et des cibles concrètes pour le trimestre : c\'est l\'horizon où l\'on agit vraiment.',
  html:`<div class="wzh">Tes objectifs prioritaires <small>3 maximum, c'est ce qui compte vraiment</small></div>
   ${P.map((p,i)=>`<div class="prow"><span class="rank">${i+1}</span><input class="fin" data-po="${i}" value="${esc(p.o)}" placeholder="Objet"><input class="fin" data-pd="${i}" value="${esc(p.d)}" placeholder="Ce que ça veut dire pour toi"><button class="ibtn del" data-pdel="${i}">✕</button></div>`).join('')}
   <div class="chips" style="margin:6px 0 4px">${SUG.map((s,i)=>`<button class="chip add" data-ps="${i}">+ ${esc(s[0])}</button>`).join('')}${P.length<5?'<button class="chip add" id="wAddP">+ Autre</button>':''}</div>
   <div class="wzh" style="margin-top:22px">Tes cibles du trimestre <small>${per.s}</small></div>
   <input class="fin" id="wAmb" value="${esc(O.amb||'')}" placeholder="Ton ambition pour ce trimestre, en une phrase">
   <div class="targets" style="margin-top:10px">${TG.map(([k,l,u])=>`<label>${l}<input class="fin" type="number" min="0" data-t="${k}" value="${O[k]??''}" placeholder="${u||'—'}"></label>`).join('')}</div>
   <div class="hint">Semestre et année se fixent plus tard dans « Suivi indicateurs », sur le tableau de bord.</div>`,
  bind:()=>{const B=$('wzBody');
   B.querySelectorAll('[data-po]').forEach(i=>i.oninput=()=>{P[+i.dataset.po].o=i.value;touch()});
   B.querySelectorAll('[data-pd]').forEach(i=>i.oninput=()=>{P[+i.dataset.pd].d=i.value;touch()});
   B.querySelectorAll('[data-pdel]').forEach(b=>b.onclick=()=>{P.splice(+b.dataset.pdel,1);touch();renderWiz()});
   B.querySelectorAll('[data-ps]').forEach(b=>b.onclick=()=>{const s=SUG[+b.dataset.ps],e=P.find(p=>!p.o);if(e){e.o=s[0];e.d=e.d||s[1]}else P.push({o:s[0],d:s[1]});touch();renderWiz()});
   if($('wAddP'))$('wAddP').onclick=()=>{P.push({o:'',d:''});renderWiz();const ins=B.querySelectorAll('[data-po]');ins[ins.length-1]?.focus()};
   $('wAmb').oninput=e=>{O.amb=e.target.value;touch()};
   B.querySelectorAll('[data-t]').forEach(i=>i.oninput=()=>{if(i.value==='')delete O[i.dataset.t];else O[i.dataset.t]=+i.value;touch()})},
  go:()=>{DB.priorites=P.filter(p=>p.o.trim()||p.d.trim());touch();return true}}},

 actions:()=>{const names=DB.priorites.map(p=>p.o).filter(Boolean),A=DB.actions;
  if(!WTMP.actInit){WTMP.actInit=1;if(!A.some(a=>a.s=='encours'))A.push({id:nextId(A),p:names[0]||'',a:'',d:addDays(today(),14),r:'',s:'encours'})}
  const L=A.filter(a=>a.s=='encours');
  return{t:'Tes premières actions',lead:'Une priorité sans action reste une intention. Note les prochains pas concrets, avec une date : ils apparaîtront en rouge s\'ils prennent du retard.',
  html:`${L.map(a=>`<div class="arow"><select class="fin" data-ap="${a.id}">${names.map(n=>`<option ${n==a.p?'selected':''}>${esc(n)}</option>`).join('')}<option value="" ${names.includes(a.p)?'':'selected'}>Sans objectif</option></select>
   <input class="fin" data-aa="${a.id}" value="${esc(a.a)}" placeholder="Décris l'action"><input class="fin" type="date" data-ad="${a.id}" value="${a.d||''}"><button class="ibtn del" data-adel="${a.id}">✕</button></div>`).join('')}
   <button class="addl" id="wAddA">+ Ajouter une action</button>`,
  bind:()=>{const B=$('wzBody'),f=id=>A.find(a=>a.id==id);
   B.querySelectorAll('[data-ap]').forEach(i=>i.onchange=()=>{f(i.dataset.ap).p=i.value;touch()});
   B.querySelectorAll('[data-aa]').forEach(i=>i.oninput=()=>{f(i.dataset.aa).a=i.value;touch()});
   B.querySelectorAll('[data-ad]').forEach(i=>i.onchange=()=>{f(i.dataset.ad).d=i.value;touch()});
   B.querySelectorAll('[data-adel]').forEach(b=>b.onclick=()=>{const x=f(b.dataset.adel);A.splice(A.indexOf(x),1);DB.supprimes.a[x.id]=new Date().toISOString();touch();renderWiz()});
   $('wAddA').onclick=()=>{A.push({id:nextId(A),p:names[0]||'',a:'',d:addDays(today(),14),r:'',s:'encours'});renderWiz();const ins=B.querySelectorAll('[data-aa]');ins[ins.length-1]?.focus()}},
  go:()=>{DB.actions=A.filter(a=>a.s!='encours'||a.a.trim());touch();return true}}},

 activite:()=>{const C=CFG(),F=C.finances;
  return{t:'Tes personnes et tes coûts',lead:'Deux réglages qui transforment tes entretiens en suivi d\'activité. Tu peux passer cette étape et y revenir dans Paramètres.',skip:true,
  html:`<div class="wzgrid2"><div class="wzc"><div class="ic"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-6 8-6s8 2 8 6"/></svg></div><b>Suivre tes personnes</b>
    <p>Chaque personne a une fiche : photo, coordonnées, cercles, provenance, notes, contrat en cours. Son étape (Invité·e, En conversation, Proposition envoyée, Client, Accompagnement terminé) <strong>se met à jour seule</strong> à partir de tes saisies. L'onglet Personnes les montre en liste ou en pipeline.</p>
    <p>Sur le tableau de bord, « À relancer » te signale les relances dues, les fins d'accompagnement, les personnes restées sans nouvelles et celles à recontacter à leur rythme (tous les 3 mois par défaut).</p>
    <label class="wzl">Alerte « sans contact » après</label><div class="wzfld" style="margin-top:0"><input class="fin" type="number" min="7" id="wFroid" value="${C.crm.froid}"> jours sans nouvelles</div></div>
   <div class="wzc"><div class="ic">€</div><b>Connaître ton taux horaire réel</b>
    <p>Ce que te rapporte vraiment une heure de pratique : <strong>(CA accepté − charges) ÷ toutes tes heures</strong>, y compris le temps non facturé. Tes charges sont la somme de tes lignes de coût : supervisions payantes, cotisations URSSAF, assurance, formation, outils… Tu les détailles dans Paramètres, avec un graphique de répartition.</p>
    <label class="wzl">Prix moyen d'une supervision</label><input class="fin" type="number" min="0" id="wSup" value="${F.supDefaut||''}" placeholder="€ par séance">
    <label class="wzl">Taux moyen de prélèvement URSSAF</label><div class="wzfld" style="margin-top:0"><input class="fin" type="number" min="0" max="100" step="0.1" id="wUrs" value="${F.urssaf||''}" placeholder="%"> % de ton CA accepté, compté comme une charge</div>
    <label class="wzl">Tes autres coûts annuels</label><div id="wLines">${F.lignes.map((x,i)=>`<div class="wzline"><input class="fin" data-wl="l" data-i="${i}" value="${esc(x.l||'')}" placeholder="Ex. Assurance RC Pro"><input class="fin" data-wl="f" data-i="${i}" value="${esc(x.f||'')}" placeholder="Fournisseur"><input class="fin" type="number" min="0" data-wl="eur" data-i="${i}" value="${x.eur||''}" placeholder="€/an"><button class="ibtn del" data-wld="${i}">✕</button></div>`).join('')}</div>
    <button class="addl" id="wAddL" style="margin-top:6px">+ Ajouter une ligne</button>
    <label class="wzl">Charges dans le taux horaire</label><span class="seg" id="wMode" style="margin-left:0"><button data-m="entier">En entier</button><button data-m="prorata">Au prorata</button></span>
    <div class="hint" id="wModeH"></div></div></div>`,
  bind:()=>{const mh=()=>{const m=F.mode||'entier';$('wMode').querySelectorAll('button').forEach(b=>b.classList.toggle('on',b.dataset.m==m));
    $('wModeH').textContent=m=='entier'?'Toutes les charges de l\'année sont déduites dès le premier contrat : le taux est prudent en début d\'année.':'Seule la part de charges correspondant à l\'année écoulée est déduite : le taux reflète mieux le rythme en cours.'};mh();
   $('wMode').querySelectorAll('button').forEach(b=>b.onclick=()=>{F.mode=b.dataset.m;touch();mh()});
   $('wFroid').onchange=e=>{C.crm.froid=Math.max(7,+e.target.value||30);touch()};
   $('wSup').onchange=e=>{F.supDefaut=+e.target.value||0;touch()};
   $('wUrs').onchange=e=>{F.urssaf=Math.min(100,Math.max(0,+String(e.target.value).replace(',','.')||0));touch()};
   $('wzBody').querySelectorAll('[data-wl]').forEach(inp=>inp.onchange=()=>{const x=F.lignes[+inp.dataset.i],k=inp.dataset.wl;x[k]=k=='eur'?(+inp.value||0):inp.value.trim();F.charges=linesTotal();touch()});
   $('wzBody').querySelectorAll('[data-wld]').forEach(b=>b.onclick=()=>{F.lignes.splice(+b.dataset.wld,1);F.charges=linesTotal();touch();renderWiz()});
   $('wAddL').onclick=()=>{F.lignes.push({id:'c'+Date.now(),l:'',f:'',eur:0});touch();renderWiz();const ins=$('wzBody').querySelectorAll('[data-wl=l]');ins[ins.length-1]?.focus()}}}},

 first:()=>{const f=WTMP.f=WTMP.f||{type:'session',dur:TM.session.d,date:today(),nom:'',com:'',xp:{}},t=TM[f.type];f.xp=f.xp||{};
  if(WTMP.saved)return{t:'Ton premier entretien',html:`<div class="ok-box">✓ Entretien enregistré. Bravo, ton carnet est lancé.</div><div class="hint" style="margin-top:12px">Ensuite, tu enregistreras chaque entretien avec le bouton « + Enregistrer un temps », en haut à droite.</div>`};
  const types=T.filter(x=>x.p&&x.k!='debrief'&&x.k!='supervision');
  return{t:'Ton premier entretien',lead:'Enregistre ton dernier entretien : c\'est exactement le geste que tu feras après chaque séance.',skip:true,next:'Enregistrer et continuer',
  html:`<div class="wzgrid2"><div>
   <label class="wzl" style="margin-top:0">Type</label><div class="chips">${types.map(x=>`<button class="chip type ${x.k==f.type?'on':''}" style="--c:${x.c};--t:${tc(x.c)}" data-ft="${x.k}">${esc(x.l)}</button>`).join('')}</div>
   <label class="wzl">Date</label><input class="fin" type="date" id="fwD" value="${f.date}">
   <label class="wzl">Durée</label><div class="chips">${DURS.map(d=>`<button class="chip ${d==f.dur?'on':''}" data-fd="${d}">${fmtD(d)}</button>`).join('')}</div>
   <label class="wzl">Personne</label><input class="fin" id="fwP" list="fwPL" value="${esc(f.nom)}" placeholder="Prénom Nom (ou initiales)"><datalist id="fwPL">${DB.personnes.map(p=>`<option value="${esc(p.nom)}">`).join('')}</datalist>
   <label class="wzl">Ce qu'on a vu</label><input class="fin" id="fwC" value="${esc(f.com)}" placeholder="1 ligne : thème, déclic, pattern repéré…">
  </div><div>${SIMPLE()?'<div class="wznote" style="margin-top:0">En mode complet, chaque entretien rapporte des XP de pratique, que tu répartis entre les compétences travaillées.</div>':isCom(f.type)?'<div class="wznote" style="margin-top:0">Ce type rapporte de 0 à 5 XP de Facultés commerciales : tu les noteras dans le détail ◎ de la saisie, avec ce qui a été facile ou difficile.</div>':`<div id="fwXp">${xpBlock(f,f.type,f.dur)}</div>`}</div></div>`,
  bind:()=>{const B=$('wzBody');
   B.querySelectorAll('[data-ft]').forEach(b=>b.onclick=()=>{f.type=b.dataset.ft;f.dur=TM[f.type].d;renderWiz()});
   B.querySelectorAll('[data-fd]').forEach(b=>b.onclick=()=>{f.dur=+b.dataset.fd;renderWiz()});
   {const xb=$('fwXp');if(xb)bindPdForm(xb,{pa:{},rem:{},...f,xp:f.xp},renderWiz)}
   $('fwD').onchange=e=>f.date=e.target.value;$('fwP').oninput=e=>f.nom=e.target.value;$('fwC').oninput=e=>f.com=e.target.value},
  go:()=>{const nom=f.nom.trim();if(!nom){toast('Indique la personne, ou clique sur « Plus tard »');return false}
   let p=DB.personnes.find(x=>byName(x.nom,nom)==0);if(!p){p={id:nextId(DB.personnes),nom};DB.personnes.push(p)}
   const tt=TM[f.type],e={id:nextId(E()),maj:new Date().toISOString(),date:f.date||today(),type:f.type,dur:f.dur,pid:p.id,com:f.com.trim(),cr:false,syn:false};{const x=SIMPLE()||isCom(f.type)?null:xpClean(f,f.type,f.dur,false);if(x)e.xp=x}
   if(tt.prop){e.eur=0;e.engagement_mois=3;e.statut='attente'}
   E().push(e);touch();WTMP.saved=1;return true}}},

 secu:()=>{const s=WTMP.sec=WTMP.sec||{enc:true,p1:'',p2:''};
  return{t:'Mets ton carnet en sécurité',lead:'Dernière étape : où ranger ton fichier, et comment le protéger.',next:'Terminer',
  html:`<div class="wzgrid2"><div class="wzc"><div class="ic">${ICO.home}</div><b>Où ranger ton carnet</b>
   ${FS_OK?(DIR?`<div class="ok-box" style="margin:10px 0">✓ Dossier « ${esc(DIR.name)} »</div><button class="btn2" id="wDir">Changer de dossier</button>`
     :`<p>Choisis un dossier, idéalement synchronisé (OneDrive, Drive) : ton carnet te suit d'un ordinateur à l'autre.</p><button class="btn2" id="wDir" style="margin-top:12px;border-color:var(--am);color:var(--am)">Choisir le dossier</button>`)
   :`<p>Ce navigateur ne sait pas enregistrer dans un dossier. Utilise Chrome ou Edge sur ordinateur, ou exporte régulièrement ton carnet.</p>`}</div>
   <div class="wzc"><div class="ic">${ICO.lock}</div><b>Protéger par un mot de passe</b>
   ${DEKK?`<div class="ok-box" style="margin-top:10px">✓ Ton carnet est déjà chiffré</div>`:`
    <label class="small" style="margin:8px 0"><input type="checkbox" id="wEnc" ${s.enc?'checked':''}> Chiffrer mon carnet (recommandé)</label>
    <div id="wPw" class="${s.enc?'':'hide'}"><input class="fin" type="password" id="wP1" value="${esc(s.p1)}" placeholder="Mot de passe (10 caractères min.)" autocomplete="new-password">
    <input class="fin" type="password" id="wP2" value="${esc(s.p2)}" placeholder="Confirmer" autocomplete="new-password" style="margin-top:8px">
    <div class="hint">Une phrase facile à retenir est idéale. Une clé de secours te sera remise juste après.</div></div>`}</div></div>`,
  bind:()=>{if($('wDir'))$('wDir').onclick=wzPickDir;
   if($('wEnc')){$('wEnc').onchange=e=>{s.enc=e.target.checked;$('wPw').classList.toggle('hide',!s.enc)};$('wP1').oninput=e=>s.p1=e.target.value;$('wP2').oninput=e=>s.p2=e.target.value}},
  go:async()=>{
   if(FS_OK&&!DIR&&!confirm('Sans dossier, ton carnet n\'est gardé que dans ce navigateur. Continuer quand même ?'))return false;
   if(!DEKK&&s.enc){if(s.p1.length<10){toast('Mot de passe : 10 caractères minimum');return false}if(s.p1!==s.p2){toast('Les deux mots de passe sont différents');return false}
    toast('Chiffrement en cours…');const key=await activateEnc(s.p1);s.p1=s.p2='';await showRecoveryKey(key)}
   return true}}},

 done:()=>{const n=(a,x)=>a.length+' '+x+(a.length>1?'s':''),it=(ok,txt)=>`<li class="${ok?'':'no'}"><i>${ok?'✓':'–'}</i>${txt}</li>`;
  return{t:'C\'est prêt',lead:'Ton carnet est configuré. Tout reste modifiable dans Paramètres, et le parcours peut être relancé à tout moment.',next:'Ouvrir mon tableau de bord',
  html:`<ul class="sumlist">
   ${it(true,'Identité : '+esc(CFG().nom))}${it(true,CFG().ordre.length+' types d\'entretien, dans ton ordre')}${it(linesTotal()||CFG().finances.supDefaut||CFG().finances.urssaf,linesTotal()||CFG().finances.supDefaut||CFG().finances.urssaf?'Coûts de l\'activité renseignés':'Coûts de l\'activité à renseigner (Paramètres)')}
   ${it(mActive().length,n(mActive(),'axe')+' de progression')}${it(DB.priorites.length,DB.priorites.length+(DB.priorites.length>1?' objectifs prioritaires':' objectif prioritaire'))}
   ${it(DB.actions.filter(a=>a.s=='encours').length,n(DB.actions.filter(a=>a.s=='encours'),'action'))}${it(E().length,E().length?'Premier entretien enregistré':'Premier entretien à saisir')}
   ${it(DIR&&!NEEDPERM,DIR?'Dossier « '+esc(DIR.name)+' »':'Pas de dossier : gardé dans ce navigateur')}${it(DEKK,DEKK?'Chiffré par mot de passe':'Non chiffré')}</ul>
   <div class="wznote">Le réflexe à prendre : après chaque entretien, « + Enregistrer un temps ». Et une fois par semaine, un coup d'œil au tableau de bord.</div>`,
  go:()=>{DB.prefs.onboarded=true;DB.prefs.nouveautes_vues=APP_VERSION;touch();closeWizard();$('main').style.visibility='visible';afterLoad();goTab('dash');window.scrollTo({top:0});toast('Bonne pratique !');return false}}}
};
$('reTour').onclick=()=>openWizard(WZ.indexOf('ident'),false);

