/* Wattlings · jeu/interface/presentation.js
   La présentation du début de partie, en deux temps : les commandes, puis le jeu et son objectif.
   Elle se lance à chaque nouvelle partie, avant le choix de l'avatar, et se passe à tout moment (bouton « Passer »
   ou touche Échap). Elle se revoit depuis le menu → Options. Les commandes sont décrites une seule fois, ici :
   le menu affiche le même tableau (keysTable). */

/* le tableau des commandes, au clavier ou à l'écran tactile */
function keysTable(touch){
  return `<div class="tbl keys-t"><table>
      <tr><td>${touch?'Croix':'Flèches · ZQSD / WASD'}</td><td>Marcher</td></tr>
      <tr><td>${touch?'A':'Espace · Entrée · E'}</td><td>Parler, lire, interagir, faire défiler un dialogue</td></tr>
      <tr><td>${touch?'Menu':'M'}</td><td>${touch?'Ouvrir le menu':'Ouvrir et refermer le menu'} : objectif, carnet, collection, options</td></tr>
      <tr><td>${touch?'CARTE':'K'}</td><td>Carte de la ville : quartiers, arènes, objectif. Dans la carte : ${touch?'touche un endroit pour savoir ce que c’est, glisse pour déplacer, + et − pour zoomer':'les flèches déplacent le curseur, Espace ou + et − zooment, K referme'}${typeof wmEtages==='function'&&wmEtages()?'. Depuis que la gare a rouvert : dézoome encore pour voir tout le pays et ses lignes de train, puis zoome sur un site pour voir son plan':''}</td></tr>
      <tr><td>${touch?'Courir':'Maj (maintenue) · R'}</td><td>Courir</td></tr>
      <tr><td>${touch?'Roulade':'C'}</td><td>Roulade avant : trois cases d'une traite, plus vite qu'en courant</td></tr>
      ${touch?'':'<tr><td>F</td><td>Plein écran</td></tr>'}</table></div><p class="dnote">Le bouton MENU, en haut à droite de l'écran, ouvre aussi le menu. À côté : « CARTE » ouvre la carte de la ville, « ← Cours » ramène au cours${touch?'':', « ⧉ Vignette » détache le jeu dans une petite fenêtre flottante'}.</p>`;
}

function openPresentation(onDone){
  const touch=matchMedia('(pointer:coarse)').matches,avant=busy;
  busy=true;clearKeys();
  const etapes=[1,2,3,4,5,6,7,8].map(n=>`<li><b>${n}. ${esc(STEP_T[n])}</b></li>`).join('');
  const pages=[
    {titre:'Les commandes',corps:`<p>Voici comment te déplacer et agir${touch?' sur cet écran tactile':' au clavier'}. Tu retrouves ce tableau dans le menu → Options → Commandes.</p>${keysTable(touch)}`},
    {titre:'Le jeu et son objectif',corps:`<p>Tu es <b>gestionnaire de site</b> dans la ville d'Ampère-sur-Loire, et tu ne connais rien à l'énergie. Mme Joule, l'energy manager senior, va te guider.</p>
      <p><b>Ton objectif :</b> faire baisser la consommation d'énergie (le compteur de kWh économisés, en haut de l'écran) en suivant la démarche de l'energy management, étape par étape, jusqu'à devenir <b>gestionnaire de patrimoine</b>.</p>
      <p>La ville est une boucle de <b>8 quartiers</b>, un par étape de la démarche :</p><ol class="pr-etapes">${etapes}</ol>
      <p>Dans chaque quartier :</p>
      <ul><li><b>Trouve les informations clés</b> en ville : parle aux habitants, lis les panneaux et les documents. Les flèches orange et la carte te montrent où chercher.</li>
      <li><b>Entre dans l'arène</b> : trois dresseurs, puis un champion, te posent des questions sur l'étape.</li>
      <li><b>Gagne le badge</b> : il ouvre la barrière du quartier suivant.</li></ul>
      <p>En chemin, complète ta collection : fiches savoir, Anomalidex, secrets. Un doute ? Le menu donne ton objectif, et « Cours de cette étape » t'emmène à la bonne page du cours.</p>`},
  ];
  const ov=document.createElement('div');ov.className='overlay presentation';
  let i=0;
  const fin=(passee)=>{removeEventListener('keydown',touche,true);ov.remove();busy=avant;clearKeys();trk('intro',{vue:i+1,passee});if(onDone)onDone()};
  const afficher=()=>{const p=pages[i],der=i===pages.length-1;
    ov.innerHTML=`<div class="panel" role="dialog" aria-modal="true" aria-labelledby="prT"><header><span id="prT">${p.titre}</span><span class="step">${i+1} / ${pages.length}</span></header>
      <div class="pbody">${p.corps}
      <div class="row pr-nav"><button type="button" class="btn alt" id="prSkip">Passer la présentation</button><span class="pr-sep"></span>${i?'<button type="button" class="btn alt" id="prPrev">← Précédent</button>':''}<button type="button" class="btn" id="prNext">${der?"C'est parti !":'Suivant →'}</button></div></div></div>`;
    ov.querySelector('#prSkip').onclick=()=>fin(!der);
    ov.querySelector('#prNext').onclick=()=>{if(der)fin(false);else{i++;afficher()}};
    const pv=ov.querySelector('#prPrev');if(pv)pv.onclick=()=>{i--;afficher()};
    ov.scrollTop=0;ov.querySelector('#prNext').focus()};
  /* Échap passe ; les flèches gauche et droite tournent les pages */
  const touche=e=>{if(!ov.isConnected)return;
    if(e.key==='Escape'){e.preventDefault();e.stopPropagation();fin(true)}
    else if(e.key==='ArrowRight'){e.preventDefault();e.stopPropagation();ov.querySelector('#prNext').click()}
    else if(e.key==='ArrowLeft'&&i){e.preventDefault();e.stopPropagation();i--;afficher()}};
  addEventListener('keydown',touche,true);
  afficher();$('layer').appendChild(ov);ov.querySelector('#prNext').focus();
}
