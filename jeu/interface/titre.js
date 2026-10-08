/* Wattlings · jeu/interface/titre.js
   L'écran titre. Avec un compte : la partie du joueur (une seule, enregistrée sur son compte).
   Sans compte : « Jouer » d'abord (INVITE : rien n'est enregistré) ; se connecter ou créer un compte reste proposé dessous,
   et la création d'un profil est proposée après le premier badge (aides.js). */

/* une connexion ou une déconnexion sans rechargement de la page */
if(COMPTE.disponible)COMPTE.surChangement((id,reecrites)=>{
  /* connecté pendant une partie sans compte. Si le compte apporte sa propre partie, la page se recharge pour la
     reprendre (commun/fenetre-compte.js) : d'ici là, la partie en cours reste sans compte, pour que la sauvegarde
     faite en quittant la page ne remplace pas celle du compte. Sinon, la partie en cours devient celle du compte */
  if(id&&INVITE&&!reecrites.includes(SAVE_KEY)){INVITE=false;if(S.site||EN_ON){save();toast('✓ Partie enregistrée sur ton compte '+id)}}
  if(id&&reecrites.includes(SAVE_KEY))qkSansEnregistrer=true;   // la page va se recharger : pas d'avertissement « partie non sauvegardée »
  /* le profil a été créé pour sauvegarder avant de quitter (liens-cours.js) : on quitte, partie enregistrée */
  if(id&&qkQuitterApres&&!reecrites.includes(SAVE_KEY)){const q=qkQuitterApres;qkQuitterApres=null;leaveGame(q.hash);return}
  const t=ROOT.querySelector('.title-screen');if(t){t.remove();titleScreen()}
  if(id&&!reecrites.includes(SAVE_KEY))qkServirAttente();
});

function titleScreen(){
  busy=true;EN_ON=false;
  const ov=document.createElement('div');ov.className='title-screen';
  const id=COMPTE.disponible&&COMPTE.identifiant();
  /* sans compte, la partie n'existe qu'en mémoire */
  const v=INVITE?(S.site?S:null):needAuth()?null:loadSave();
  const partie=v=>`<div class="slot cur"><div class="slot-h"><canvas width="20" height="20" data-av></canvas><div><b>${esc(v.name||'Alex')}</b><small>${RANKS[v.rank||0]} · Nv ${Math.floor((v.xp||0)/90)+1}${v.hades?' · Hadès':''}</small></div></div>
      <small>${esc(SITES[v.site]?SITES[v.site].name:'')} · ${esc(CHAPTERS[v.ch]||'')}</small>
      <span class="stats">${(v.badges||[]).length}/8 badges · ${Object.keys(v.secrets||{}).length}/${NSEC} secrets · ${Object.keys(v.fiches||{}).length}/${FICHES.length} fiches</span>
      <small>${INVITE?'Partie sans compte : non sauvegardée':'Sauvegardé le '+fmtDate(v.savedAt)}</small>
      <div class="acts"><button class="btn" data-a="cont">Continuer</button><button class="btn alt" data-a="chap">Choisir une étape</button><button class="btn alt" data-a="restart">Recommencer l'histoire</button><button class="btn danger" data-a="erase">${INVITE?'Abandonner':'Effacer'}</button></div></div>`;
  /* nouvelle partie : le prénom et un seul bouton ; les choix pour joueurs avertis sont rangés sous « Plus d'options » */
  const nouvelle=`<div class="slot empty"><b>Nouvelle partie</b><label for="pn1">Ton prénom</label><input id="pn1" maxlength="14" value="" placeholder="Ton prénom"><div class="acts"><button class="btn" data-a="new">Commencer ▸</button></div>
    <details class="plus"><summary>Plus d'options</summary><label class="hades"><input type="checkbox" data-hades> Mode Hadès <small>les personnages se font prier : il faut tout leur demander deux fois</small></label><button class="btn alt" data-a="newchap">Commencer directement à une étape</button></details></div>`;
  /* une partie commencée dans ce navigateur avant les comptes : elle rejoindra le compte s'il n'en a pas */
  const ancienne=needAuth()?readSave():null;
  const corps=needAuth()?`<div class="slots solo"><button type="button" class="btn title-play" data-a="guest">Jouer ▸</button>
      <p style="font-size:13px">Sans compte, ta partie n'est pas sauvegardée : tu pourras créer un profil en cours de route pour la garder.</p>
      <div class="slot auth"><b>Déjà un profil, ou envie de sauvegarder dès maintenant ?</b>
      <small>Ta partie est enregistrée sur ton compte : tu la retrouves sur tous tes appareils et navigateurs.</small>
      ${ancienne&&ancienne.site?`<small>La partie commencée dans ce navigateur (${esc(ancienne.name||'Alex')} · ${esc(CHAPTERS[ancienne.ch]||'')}) rejoindra ton compte s'il n'en a pas encore.</small>`:''}
      <div class="acts"><button class="btn alt" data-a="login">Se connecter</button><button class="btn alt" data-a="signup">Créer un compte</button></div></div></div>`
    :`<div class="slots solo">${v&&v.site?partie(v):nouvelle}</div>
    <p style="font-size:13px">${INVITE?'<b>Partie sans compte</b> : rien n\'est sauvegardé.':id?`Sauvegarde automatique sur ton compte <b>${esc(id)}</b>.`:'Sauvegarde automatique dans ce navigateur.'} Le son est coupé par défaut : active-le dans le menu → Options.</p>
    ${COMPTE.disponible?`<button type="button" class="title-back" data-a="compte">${id?'Mon compte':'Se connecter pour sauvegarder ta partie'}</button>`:''}`;
  ov.innerHTML=`<div class="title-box"><button type="button" class="title-back" id="tBack">← Retour au cours</button><div class="logo">Wattlings<small>Energy management par la donnée</small></div>
  <p>Tu es gestionnaire de site et tu ne connais rien à l'énergie. Explore la ville, réunis les informations, puis remporte les 8 arènes et leurs badges… pour devenir gestionnaire de patrimoine.</p>
  ${corps}</div>`;
  $('layer').appendChild(ov);updateMusic();
  ov.querySelector('#tBack').onclick=()=>$('qkBack').click();if(PIP.isPop)ov.querySelector('#tBack').hidden=true;
  const cv=ov.querySelector('canvas[data-av]');if(cv)drawChar(cv.getContext('2d'),2,3,'down',0,avPal(v.rank||0,v.av||AVDEF('h')));
  const leave=()=>{ov.remove();busy=false};
  const pick=()=>{const o2=openPanel('Choisir une étape'),b=o2.querySelector('.pbody'),inner=document.createElement('div');b.appendChild(inner);
    chapterList(inner,(ch,sid)=>{closePanel();jumpTo(ch,sid)});
    const cc=document.createElement('button');cc.className='btn alt';cc.textContent='Retour';cc.onclick=()=>{closePanel();titleScreen()};b.appendChild(cc)};
  ov.querySelectorAll('[data-a]').forEach(btn=>btn.onclick=()=>{const a=btn.dataset.a,el=btn.closest('.slot');
    if(a==='login'||a==='signup'){COMPTE.ouvrir(ROOT,a==='signup'?'creation':'connexion');return}
    if(a==='compte'){COMPTE.ouvrir(ROOT,'connexion');return}
    if(a==='guest'){trk('game_guest');INVITE=true;S=DEF();ov.remove();if(!qkServirAttente())titleScreen();return}
    if(a==='new'||a==='newchap'){const hd=!!el.querySelector('[data-hades]').checked;trk('game_new',{etape:a==='newchap',hades:hd,compte:!INVITE});const nm=(el.querySelector('input').value||'Alex').trim().slice(0,14)||'Alex';S=DEF();S.name=nm;S.hades=hd;save();leave();introVideo(()=>openPresentation(()=>a==='new'?openAvatar(()=>boot()):openAvatar(pick)));return}   // nouvelle partie : la vidéo, les commandes, puis l'avatar
    if(a==='erase'){if(btn.dataset.ok){trk('slot_erase');if(INVITE)S=DEF();else try{localStorage.removeItem(SAVE_KEY)}catch(e){}ov.remove();titleScreen()}else{btn.dataset.ok=1;btn.textContent='Confirmer : tout effacer'}return}
    S=Object.assign(DEF(),v);
    if(a==='cont'){trk('game_continue',{ch:S.ch});leave();if(!S.av)openAvatar(()=>boot());else boot()}
    if(a==='chap'){leave();pick()}
    if(a==='restart'){if(btn.dataset.ok){trk('game_restart');restartStory();leave();boot()}else{btn.dataset.ok=1;btn.textContent='Confirmer (collection gardée)'}}
  });
  const f=ov.querySelector('[data-a=cont]')||ov.querySelector('.title-play')||ov.querySelector('.slot input');if(f)f.focus();
}
