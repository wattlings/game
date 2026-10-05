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
function objectiveText(){
  const mr=missingReq();if(mr.length&&[1,2,3,4,5,6,7,8,9,10].includes(S.ch))return `Trouve ${mr.length} info${mr.length>1?'s':''} clé${mr.length>1?'s':''} (suis les flèches) : ${mr.map(f=>SRC[f.src].where).join(' ; ')}. `+objectiveText0();
  return objectiveText0();
}
function objectiveText0(){
  const s=site(),d=Object.keys(S.derives).length,A=ARENAS.find(a=>ARENA_CH[a.id]===S.ch),cur=curArena();
  const go=a=>cur===a?`${a.name} : bats les dresseurs (${[0,1,2].filter(k=>trBeaten(a,k)).length}/3), puis ${a.champ} sur l'estrade.`:`Va à l'${a.name}, ${qAu(a.id)} : 3 dresseurs, puis ${a.champ}. La carte (touche K) montre le chemin.`;
  if(S.ch===0)return "Parle à Mme Joule, dans ton bureau, place de la Donnée.";
  if(S.ch===1)return `Explore l'extérieur ${enDe(s)} : trouve l'adresse (boîte aux lettres) et la surface (fiche technique).`;
  if(S.ch===2&&!(S.flags.elec&&S.flags.gas))return `Entre dans ${s.short} et trouve les compteurs : l'électrique dans un mur, le gaz à la cave.`;
  if(S.ch===5&&!S.flags.arch)return "Récupère l'inventaire de tes données dans l'armoire à archives du bureau.";
  if(S.ch===7&&d<4)return `Ronde de nuit dans ${s.short} : trouve les 4 dérives (${d}/4).`;
  if(A)return go(A);
  if(S.ch===10)return `Hôtel de ville, place de l'Énergie (de l'autre côté du Grand pont) : analyse les 20 sites sur le PC patrimoine (${Math.min(6,S.pm||0)}/6 missions).`;
  if(S.ch>=11&&S.site){const p=enPct();if(p<.4)return `Fais baisser la consommation du parc de 40 % : ton tableau de bord Énergie s'ouvre d'un clic sur le compteur de kWh. Tu en es à −${(p*100).toFixed(1).replace('.',',')} %.`;return "Objectif atteint : −40 % sur le parc ! Tu peux rejouer avec un autre site depuis le menu."}
  return "Quête terminée ! Rejoue avec un autre site depuis le menu.";
}
