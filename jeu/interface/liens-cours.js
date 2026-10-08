/* Wattlings · jeu/interface/liens-cours.js
   Liens entre le jeu et le cours : quitter vers le cours, consulter le cours, démarrer selon l'adresse de la page. */

/* ================= LIENS JEU ⇄ COURS =================
   Le jeu est une page à part (jeu/) ; le cours est la page voisine.
   - « ← Cours » quitte le jeu : la partie est sauvegardée, on revient au cours dans le même onglet.
   - « Cours de cette étape ↗ » ouvre le cours dans un autre onglet : la partie reste ouverte ici, telle quelle.
   Adresses comprises par la page du jeu : jeu/#chapitre-3 (jouer ce chapitre), jeu/#reprendre (continuer la partie),
   jeu/#essai-… (mode essai de la page de pilotage, voir moteur/essai.js). */
function courseHash(){return CH2HASH[S.ch]||'accueil'}
function courseLabel(){const h=courseHash(),m=h.match(/^etape-(\d)/);return m?`Étape ${m[1]} · ${STEP_T[+m[1]]}`:h==='quiz-final'?'Quiz final':h==='patrimoine'?'Piloter un patrimoine':'Le cycle'}
/* la partie est écrite dès que la fenêtre passe à l'arrière-plan ou se ferme : au retour, elle reprend au même endroit */
function qkSaveNow(){if(EN_ON&&S.site)save()}
addEventListener('pagehide',qkSaveNow);addEventListener('blur',qkSaveNow);
document.addEventListener('visibilitychange',()=>{if(document.hidden)qkSaveNow()});
/* consulter le cours sans quitter le jeu */
function goCourse(hash){
  hash=hash||courseHash();trk('game_to_course',{target:hash,ch:S.ch});qkSaveNow();clearKeys();
  LIENS.consulterCours(hash);
}
/* ---- sans compte, rien n'est enregistré : avant de quitter une partie commencée, le joueur est prévenu ---- */
let qkSansEnregistrer=false;   // le joueur a choisi de quitter sans enregistrer (ou la page se recharge sur la partie de son compte)
let qkQuitterApres=null;       // il crée un profil pour sauvegarder : une fois connecté, il quitte comme il le voulait (titre.js)
const qkPartieNonSauvee=()=>INVITE&&!qkSansEnregistrer&&(EN_ON||!!S.site);
function qkAvertirDepart(hash){
  const avant=busy;busy=true;clearKeys();
  const ov=document.createElement('div');ov.className='overlay invite-quit';
  ov.innerHTML=`<div class="panel" role="dialog" aria-modal="true" aria-labelledby="iqT"><header><span id="iqT">Ta partie n'est pas sauvegardée</span></header><div class="pbody">
    <p>Tu joues sans compte : si tu quittes maintenant, ta progression sera perdue.</p>
    <p>Crée un profil (un identifiant et un mot de passe) pour l'enregistrer et la retrouver plus tard, sur n'importe quel appareil.</p>
    <div class="row"><button type="button" class="btn" data-a="creer">Créer un profil et sauvegarder</button><button type="button" class="btn danger" data-a="quitter">Quitter sans enregistrer</button><button type="button" class="btn alt" data-a="rester">Continuer à jouer</button></div></div></div>`;
  const fermer=()=>{removeEventListener('keydown',touche,true);ov.remove();busy=avant;clearKeys()};
  const touche=e=>{if(e.key==='Escape'&&ov.isConnected){e.preventDefault();e.stopPropagation();fermer()}};
  addEventListener('keydown',touche,true);
  ov.querySelector('[data-a=rester]').onclick=()=>{trk('guest_leave',{choix:'rester'});fermer()};
  ov.querySelector('[data-a=quitter]').onclick=()=>{trk('guest_leave',{choix:'quitter'});fermer();qkSansEnregistrer=true;leaveGame(hash)};
  ov.querySelector('[data-a=creer]').onclick=()=>{trk('guest_leave',{choix:'profil'});fermer();
    qkQuitterApres={hash};COMPTE.ouvrir(ROOT,'creation',()=>{qkQuitterApres=null})};
  $('layer').appendChild(ov);ov.querySelector('[data-a=creer]').focus();
}
/* fermer l'onglet ou recharger la page : le navigateur demande confirmation (il n'affiche que son propre message) */
addEventListener('beforeunload',e=>{if(qkPartieNonSauvee()){e.preventDefault();e.returnValue=''}});

/* quitter le jeu pour le cours (sans page précisée : retour à la page d'où l'on venait) */
function leaveGame(hash){
  if(qkPartieNonSauvee()){qkAvertirDepart(hash);return}
  trk('game_to_course',{target:hash||'retour',ch:S.ch});qkSaveNow();clearKeys();
  if(AUD.ctx)AUD.ctx.suspend();
  LIENS.quitterVersCours(hash);
}
function openGame(ch){
  trk('game_open',{from:ch==null?'bouton':'cours',ch:ch==null?null:ch});
  QK_HOST.hidden=false;qkTimeout(fitScreen,30);document.documentElement.classList.add('qk-lock');QK_HOST.scrollTop=0;
  if(AUD.on){audInit();if(AUD.ctx)AUD.ctx.resume()}
  if(ch!==undefined&&ch!==null){
    ROOT.querySelectorAll('#layer > *').forEach(n=>n.remove());busy=false;dlg.q=[];dlg.cb=null;dlg.open=false;if(dlg.el){dlg.el.remove();dlg.el=null}
    const sv=loadSave();S=Object.assign(DEF(),sv||{});
    const go=()=>{if(S.site&&S.ch===ch)boot();else jumpTo(ch,S.site||'ecole')};
    if(!S.av)introVideo(()=>openPresentation(()=>openAvatar(go)));else go();   // nouvelle partie : la vidéo, la présentation, puis l'avatar
  }
  updateMusic();
  qkTimeout(()=>{const b=ROOT.querySelector('.title-screen .slot button, .title-screen .auth button, .overlay button');if(b)b.focus()},60);
}
$('qkBack').onclick=()=>leaveGame();
$('qkCourse').onclick=()=>goCourse();

/* ---- l'avatar du joueur, confié au cours : il l'affiche sur ses boutons « Jouer » ---- */
function qkSync(){
  const sv=loadSave();if(!sv||!sv.site)return;
  try{const c=document.createElement('canvas');c.width=20;c.height=20;
    drawChar(c.getContext('2d'),2,3,'down',0,avPal(sv.rank||0,sv.av||AVDEF('h')));
    const u=c.toDataURL('image/png');if(localStorage.getItem(CLE_AVATAR)!==u)localStorage.setItem(CLE_AVATAR,u)}catch(e){}
}

/* ---- ce que demande l'adresse de la page : "chapitre-3", "reprendre" ou rien (écran titre, ou la partie telle qu'elle est) ---- */
/* une demande (chapitre, reprise) faite avant que le joueur se connecte ou choisisse de jouer sans compte : servie ensuite (titre.js) */
let qkAttente=null;
function qkRoute(h){
  let adresse=false;
  if(typeof h!=='string'){
    const e=window.WATTLINGS_EMBARQUE;
    if(e&&typeof e.demande==='string'){h=e.demande;e.demande=null}   // version « fichier unique » : la demande vient de la page du cours
    else{h=decodeURIComponent(location.hash.slice(1));adresse=true}
  }
  if(h&&!/^essai-/.test(h)&&needAuth()){qkAttente=h;openGame();return}   // l'écran titre demande d'abord un compte ; l'adresse est gardée, pour le cas où la connexion recharge la page
  if(adresse&&h)try{history.replaceState(null,'',location.pathname+location.search)}catch(x){}   // l'adresse redevient neutre : recharger la page ne rejoue pas la demande
  const m=h.match(/^chapitre-(\d{1,2})$/);
  if(m)openGame(Math.min(11,+m[1]));
  else if(/^essai-/.test(h))essaiLancer(h.slice(6));   // page de pilotage : ouvrir le jeu à un endroit précis, sans rien enregistrer (moteur/essai.js)
  else if(h==='reprendre'||h==='vignette'){const sv=loadSave();openGame(sv&&sv.site?sv.ch:undefined)}
  else openGame();
}
addEventListener('hashchange',()=>{if(location.hash.length>1)qkRoute()});
/* le joueur s'est connecté ou joue sans compte : la demande en attente est servie. Seule une demande de chapitre ouvre
   le jeu ; « reprendre » ne change rien, l'écran titre montre déjà la partie du compte. Renvoie vrai si le jeu s'est ouvert */
function qkServirAttente(){const h=qkAttente;qkAttente=null;try{if(location.hash)history.replaceState(null,'',location.pathname+location.search)}catch(x){}if(h&&/^chapitre-/.test(h)){qkRoute(h);return true}return false}

/* ---- une seule fenêtre joue à la fois : si la partie est reprise ailleurs, cette fenêtre lui laisse la main,
        puis recharge la partie sauvegardée la prochaine fois qu'on la regarde ---- */
let qkAilleurs=false;
addEventListener('storage',e=>{
  if(INVITE||ESSAI||e.storageArea!==localStorage||e.key!==SAVE_KEY||e.newValue===null)return;
  if(PIP.isPop){window.close();return}
  if(PIP.win)pipToggle();
  if(qkAilleurs)return;qkAilleurs=true;
  const reprendre=()=>{if(document.hidden)return;document.removeEventListener('visibilitychange',reprendre);qkAilleurs=false;qkRoute('reprendre')};
  if(document.hidden)document.addEventListener('visibilitychange',reprendre);else reprendre();
});
