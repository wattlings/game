/* Wattlings · jeu/interface/hud.js
   Bandeau du haut : nom, rang, niveau, XP, badges, objectif, messages éphémères. */

/* ================= HUD / XP ================= */
const level=()=>Math.floor(S.xp/90)+1;
function hud(){
  trkChapter();
  S.maxCh=Math.max(S.maxCh||0,S.ch);updateMusic();
  $('hudName').textContent=S.name;$('hudRank').textContent=RANKS[S.rank]+(S.hades?' · Hadès':'');$('hudLvl').textContent='Nv '+level();
  $('hudXp').style.width=((S.xp%90)/90*100)+'%';
  $('hudBadges').innerHTML=BADGES.map(b=>`<span class="${S.badges.includes(b)?'on':''}" title="Badge ${b}${S.badges.includes(b)?'':' (à gagner)'}"></span>`).join('');
  $('objective').innerHTML='<b>Objectif :</b> '+esc(objectiveText());if(typeof courseLabel==='function'){$('qkStep').textContent=courseLabel();qkSync()}enHud(true);
  objFlash();
}
let toastQ=[],toastOn=false;function toast(msg){toastQ.push(msg);if(!toastOn)nextToast()}
function nextToast(){const msg=toastQ.shift();if(!msg){toastOn=false;return}toastOn=true;const t=document.createElement('div');t.className='toast';t.textContent=selonAppareil(msg);ROOT.appendChild(t);qkTimeout(()=>t.remove(),1700);qkTimeout(nextToast,1750)}
/* la ligne d'objectif, toujours visible en haut de l'écran : la prochaine action et l'avancée de l'étape (recit/objectifs.js).
   Elle s'anime quand l'objectif change ; un clic ouvre le menu → Objectif, qui montre toutes les tâches de l'étape */
let lastObj=null;
function objFlash(){
  const el=$('objFlash');if(!el)return;
  if(QK_HOST.hidden||ROOT.querySelector('.title-screen')||(!S.site&&S.ch>0)){el.hidden=true;lastObj=null;return}
  const a=prochaineAction(),t=a.t+(a.prog?` (${a.prog})`:''),k=t+'|'+a.n;
  el.hidden=false;if(k===lastObj)return;
  const change=lastObj!==null;lastObj=k;
  el.innerHTML=`<button type="button" class="obj-l" title="Voir toutes les tâches de l'étape (menu → Objectif)"><b aria-hidden="true">▶</b><span>${esc(t)}</span>${a.total>1?`<em>${a.n}/${a.total}</em>`:''}</button>`;
  el.querySelector('button').onclick=e=>{e.currentTarget.blur();if(!busy&&!dlg.open)openMenu('objectif')};
  if(change){el.classList.remove('neuf');void el.offsetWidth;el.classList.add('neuf')}
}
function gainXP(n){sfx('good');const before=level();S.xp+=n;save();hud();if(level()>before)qkTimeout(()=>toast(`Niveau ${level()} !`),400);else toast(`+${n} XP`)}
function badge(name){if(!S.badges.includes(name)){trk('badge',{name});S.badges.push(name);S.xp+=60;save();hud();jingle('badge');toast(`Badge ${BLAB(name)} obtenu !`)}}
