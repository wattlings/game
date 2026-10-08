/* Wattlings · jeu/interface/aides.js
   Apprendre en jouant : chaque commande est montrée une fois, au moment où elle sert, dans une petite bulle qui ne
   bloque rien (au lieu de tout expliquer d'un coup au début). Une aide déjà montrée ne revient pas (S.aides).
   Les textes suivent l'appareil : touches au clavier, boutons à l'écran tactile. */

const TACTILE=()=>matchMedia('(pointer:coarse)').matches;
const AIDES={
  bouger:()=>TACTILE()?'Utilise la croix pour te déplacer.':'Flèches (ou Z Q S D) pour te déplacer.',
  parler:()=>TACTILE()?'Touche le bouton A pour parler ou examiner ce qui est devant toi.':'Appuie sur Espace pour parler ou examiner ce qui est devant toi.',
  carte:()=>TACTILE()?'Le bouton Carte montre toute la ville et ton objectif.':'Touche K : la carte de toute la ville et ton objectif.',
  fleche:()=>"La flèche orange au bord de l'écran indique la direction de ton objectif.",
  menu:()=>TACTILE()?'Le bouton Menu : ton objectif, ton carnet et tes fiches.':'Touche M : le menu (ton objectif, ton carnet et tes fiches).',
};
let aideFin=0,aideFlecheHors=false;

/* les textes du jeu citent les touches du clavier ; à l'écran tactile, ils parlent des boutons (dialogues, messages) */
const selonAppareil=t=>!TACTILE()?t:String(t).replace(/\(touche K([^)]*)\)/g,'(bouton Carte$1)').replace(/\(touche M\)/g,'(bouton Menu)')
  .replace(/\btouche K\b/g,'bouton Carte').replace(/\btouche M\b/g,'bouton Menu').replace(/\bA \(Espace\)/g,'A');

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

/* sans compte : après le premier badge gagné en jouant (pas ceux offerts en sautant à une étape : choix-etape.js), une seule fois, proposer de créer un profil pour garder la partie */
function proposerProfil(){
  S.flags.profilPropose=1;trk('guest_prompt');
  const ov=openPanel('Garde ta progression',{sansCours:true}),b=ov.querySelector('.pbody');
  b.innerHTML=`<p>Bravo pour ton premier badge ! Tu joues <b>sans compte</b> : ta partie s'arrêtera quand tu fermeras la page.</p>
    <p>Crée un profil (un identifiant et un mot de passe, sans adresse e-mail) : ta partie y est enregistrée, et tu la retrouves sur tous tes appareils.</p>
    <div class="row"><button class="btn" type="button" data-p="oui">Créer mon profil</button><button class="btn alt" type="button" data-p="non">Plus tard</button></div>
    <p class="dnote">Tu pourras le faire à tout moment : menu → Créer un profil.</p>`;
  b.querySelector('[data-p=oui]').onclick=()=>{trk('guest_prompt_oui');closePanel();COMPTE.ouvrir(ROOT,'creation')};
  b.querySelector('[data-p=non]').onclick=()=>closePanel();
  b.querySelector('[data-p=oui]').focus();
}

/* regardée deux fois par seconde (moteur/boucle.js) : quelle commande sert maintenant ? */
function aidesVeille(){
  if(INVITE&&COMPTE.disponible&&!ESSAI&&!busy&&!dlg.open&&EN_ON&&(S.badges||[]).length>(S.flags.badgesOfferts||0)&&!S.flags.profilPropose){proposerProfil();return}
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
