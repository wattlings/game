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
function nextToast(){const msg=toastQ.shift();if(!msg){toastOn=false;return}toastOn=true;const t=document.createElement('div');t.className='toast';t.textContent=msg;ROOT.appendChild(t);qkTimeout(()=>t.remove(),1700);qkTimeout(nextToast,1750)}
/* rappel de l'objectif : il s'affiche quelques secondes sur l'écran quand il change (il reste lisible dans le menu START) */
let lastObj=null;
function objFlash(force){
  const el=$('objFlash');if(!el||QK_HOST.hidden)return;const t=objectiveText();
  if(!force&&t===lastObj)return;
  if(busy||dlg.open||ROOT.querySelector('.title-screen')){qkClear(objFlash.w);objFlash.w=qkTimeout(()=>objFlash(force),600);return}
  lastObj=t;el.hidden=true;void el.offsetWidth;el.innerHTML='<div><b>Objectif :</b> '+esc(t)+'</div>';el.hidden=false;
  qkClear(objFlash.t);objFlash.t=qkTimeout(()=>{el.hidden=true},6000);
}
function gainXP(n){sfx('good');const before=level();S.xp+=n;save();hud();if(level()>before)qkTimeout(()=>toast(`Niveau ${level()} !`),400);else toast(`+${n} XP`)}
function badge(name){if(!S.badges.includes(name)){trk('badge',{name});S.badges.push(name);S.xp+=60;save();hud();jingle('badge');toast(`Badge ${BLAB(name)} obtenu !`)}}
