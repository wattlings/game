/* Wattlings · jeu/interface/liens-cours.js
   Liens entre le jeu et le cours : quitter vers le cours, consulter le cours, démarrer selon l'adresse de la page. */

/* ================= LIENS JEU ⇄ COURS =================
   Le jeu est une page à part (jeu/) ; le cours est la page voisine.
   - « ← Cours » quitte le jeu : la partie est sauvegardée, on revient au cours dans le même onglet.
   - « Revoir le cours ↗ » ouvre le cours dans un autre onglet : la partie reste ouverte ici, telle quelle.
   Adresses comprises par la page du jeu : jeu/#chapitre-3 (jouer ce chapitre), jeu/#reprendre (continuer la partie). */
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
/* quitter le jeu pour le cours (sans page précisée : retour à la page d'où l'on venait) */
function leaveGame(hash){
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
    if(!S.av)openAvatar(go);else go();
  }
  updateMusic();
  qkTimeout(()=>{const b=ROOT.querySelector('.title-screen .slot button, .overlay button');if(b)b.focus()},60);
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
function qkRoute(h){
  if(typeof h!=='string'){
    const e=window.WATTLINGS_EMBARQUE;
    if(e&&typeof e.demande==='string'){h=e.demande;e.demande=null}   // version « fichier unique » : la demande vient de la page du cours
    else{h=decodeURIComponent(location.hash.slice(1));
      if(h)try{history.replaceState(null,'',location.pathname+location.search)}catch(x){}}   // l'adresse redevient neutre : recharger la page ne rejoue pas la demande
  }
  const m=h.match(/^chapitre-(\d{1,2})$/);
  if(m)openGame(Math.min(11,+m[1]));
  else if(h==='reprendre'||h==='vignette'){const sv=loadSave();openGame(sv&&sv.site?sv.ch:undefined)}
  else openGame();
}
addEventListener('hashchange',()=>{if(location.hash.length>1)qkRoute()});

/* ---- une seule fenêtre joue à la fois : si la partie est reprise ailleurs, cette fenêtre lui laisse la main ---- */
addEventListener('storage',e=>{
  if(e.storageArea!==localStorage||e.key!==SLOT_KEY(SLOT)||e.newValue===null)return;
  if(PIP.isPop){window.close();return}
  if(PIP.win)pipToggle();
  const again=()=>{if(!document.hidden)location.replace(location.pathname+location.search+'#reprendre')};
  if(document.hidden)document.addEventListener('visibilitychange',again);else again();
});
