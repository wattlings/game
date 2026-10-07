/* Wattlings · jeu/interface/aides.js
   Apprendre en jouant : chaque commande est montrée une fois, au moment où elle sert, dans une petite bulle qui ne
   bloque rien (au lieu de tout expliquer d'un coup au début). Une aide déjà montrée ne revient pas (S.aides).
   Les textes suivent l'appareil : touches au clavier, boutons à l'écran tactile. */

const TACTILE=()=>matchMedia('(pointer:coarse)').matches;
const AIDES={
  bouger:()=>TACTILE()?'Utilise la croix pour te déplacer.':'Flèches (ou Z Q S D) pour te déplacer.',
  parler:()=>TACTILE()?'Touche le bouton A pour parler ou examiner ce qui est devant toi.':'Appuie sur Espace pour parler ou examiner ce qui est devant toi.',
  carte:()=>TACTILE()?'Le bouton CARTE montre toute la ville et ton objectif.':'Touche K : la carte de toute la ville et ton objectif.',
  fleche:()=>"La flèche orange au bord de l'écran indique la direction de ton objectif.",
  menu:()=>TACTILE()?'Le bouton Menu : ton objectif, ton carnet et tes fiches.':'Touche M : le menu (ton objectif, ton carnet et tes fiches).',
};
let aideFin=0,aideFlecheHors=false;

/* les textes du jeu citent les touches du clavier ; à l'écran tactile, ils parlent des boutons (dialogues, messages) */
const selonAppareil=t=>!TACTILE()?t:String(t).replace(/\(touche K([^)]*)\)/g,'(bouton CARTE$1)').replace(/\(touche M\)/g,'(bouton Menu)')
  .replace(/\btouche K\b/g,'bouton CARTE').replace(/\btouche M\b/g,'bouton Menu').replace(/\bA \(Espace\)/g,'A');

function aide(k){
  if(ESSAI||!AIDES[k])return false;
  S.aides=S.aides||{};if(S.aides[k])return false;
  if(performance.now()<aideFin)return false;   // une seule bulle à la fois
  S.aides[k]=1;aideFin=performance.now()+6500;trk('aide',{k});
  let el=ROOT.getElementById('aide');
  if(!el){el=document.createElement('div');el.id='aide';el.className='aide-bulle';el.setAttribute('role','status');$('wrap').appendChild(el)}
  el.textContent=AIDES[k]();el.hidden=false;el.classList.remove('on');void el.offsetWidth;el.classList.add('on');
  qkClear(aide.t);aide.t=qkTimeout(()=>{el.hidden=true},6000);
  return true;
}

/* regardée deux fois par seconde (moteur/boucle.js) : quelle commande sert maintenant ? */
function aidesVeille(){
  const el=ROOT.getElementById('aide');if(el&&!el.hidden&&(busy||dlg.open))el.hidden=true;   // un dialogue ou un panneau s'ouvre : la bulle s'efface
  if(busy||dlg.open||!EN_ON||ESSAI||QK_HOST.hidden)return;
  const A=S.aides||{};
  if(!A.bouger){aide('bouger');return}
  const [dx,dy]=DIRS[P.dir],o=objAt(P.x+dx,P.y+dy);
  if(!A.parler&&o&&o.act){aide('parler');return}
  if(!A.carte&&S.map==='town'){aide('carte');return}
  if(!A.fleche&&aideFlecheHors){aide('fleche');return}
  if(!A.menu&&S.ch>=1&&(S.notes.adresse||Object.keys(S.fiches||{}).length))aide('menu');
}
