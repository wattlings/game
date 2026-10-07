/* Wattlings · jeu/interface/menu.js
   Le menu : objectif, carnet, classeur de fiches, collection, options. */

function openMenu(tab0){
  if(busy||dlg.open||AR.lock)return;
  const ov=openPanel('Menu'),b=ov.querySelector('.pbody'),s=S.site?site():null;
  const G=[['Partie',[['objectif','Objectif'],['energie','Énergie'],['carte','Carte'],['carnet','Carnet'],['etapes','Étapes'],['save','Sauvegarde']]],['Collection',[['badges','Badges'],['classeur','Classeur'],['dex','Anomalidex'],['sec','Secrets']].concat(S.voy&&S.voy.pass?[['passeport','Passeport']]:[],[['sources','Sources']])],['Réglages',[['opt','Options'],['ciel','Ciel et météo'],['avatar','Avatar'],['keys','Commandes']]]];
  b.innerHTML=`<div class="pcard"><canvas width="20" height="20"></canvas><div class="pc-m"><div class="pc-n"><b>${esc(S.name)}</b><span>${RANKS[S.rank]}${S.hades?' · Hadès':''}</span></div>
    <div class="pc-x"><span>Nv ${level()}</span><div class="xpbar" title="Expérience"><i style="width:${(S.xp%90)/90*100}%"></i></div><small>${S.xp%90} / 90 XP</small></div>
    <div class="badges" aria-label="Badges : ${S.badges.length} sur 8">${BADGES.map(x=>`<span class="${S.badges.includes(x)?'on':''}" title="Badge ${x}${S.badges.includes(x)?'':' (à gagner)'}"></span>`).join('')}</div></div></div>
  <div class="menu-tabs">${G.map(([g,L])=>`<div class="mgrp"><span class="mg">${g}</span>${L.map(([k,l])=>`<button data-t="${k}">${l}</button>`).join('')}</div>`).join('')}</div><div id="mt"></div><button class="btn" id="mClose">Reprendre le jeu</button>`;
  drawChar(b.querySelector('.pcard canvas').getContext('2d'),2,3,'down',0,PAL[S.rank]);
  const mt=b.querySelector('#mt'),touch=matchMedia('(pointer:coarse)').matches;
  const tabs={
    objectif:()=>`<h3>Objectif</h3><div class="obj-box"><p>${esc(objectiveText())}</p></div><p class="dnote">${s?esc(s.name)+' · ':''}${esc(CHAPTERS[S.ch]||'')}. Les flèches orange dans le décor indiquent où aller ; un point d'exclamation signale un personnage qui a une information pour toi. La carte montre ton objectif et les infos clés qui te manquent.</p><div class="row"><button class="btn" id="oMap">Voir sur la carte (K)</button><button class="btn" id="oCourse">Comprendre cette étape : ${esc(courseLabel())} ↗</button></div>`,
    carnet:()=>s?`<h3>${esc(s.name)}</h3><div class="tbl"><table>
      <tr><th>Adresse</th><td>${S.notes.adresse?esc(S.notes.adresse):'<i>à trouver (boîte aux lettres)</i>'}</td></tr>
      <tr><th>Surface</th><td>${S.notes.surface?fmt(S.notes.surface)+' m²':'<i>à trouver (fiche technique)</i>'}</td></tr>
      <tr><th>Activité</th><td>${S.notes.activite?esc(S.notes.activite):'<i>à trouver</i>'}</td></tr>
      <tr><th>Localisation</th><td>${S.notes.adresse?'Ampère-sur-Loire (45), zone H1, météo Orléans-Bricy':'<i>—</i>'}</td></tr>
      <tr><th>PDL (élec)</th><td class="num">${S.notes.pdl||'<i>à trouver</i>'}</td></tr>
      <tr><th>PCE (gaz)</th><td class="num">${S.notes.pce||'<i>à trouver</i>'}</td></tr>
      <tr><th>Décret tertiaire</th><td>${S.ch>=2?(assujetti(s)?'Assujetti (≥ 1 000 m²)':'Non concerné (< 1 000 m²)'):'<i>—</i>'}</td></tr></table></div>`:'<p>Parle à Mme Joule pour choisir ton site.</p>',
    badges:()=>`<p>Un badge par arène. Rang : <b>${RANKS[S.rank]}</b>, niveau ${level()} (${S.xp} XP).</p><div class="dex">${ARENAS.map(A=>{const got=S.badges.includes(A.badge);return `<div class="${got?'':'unk'}"><canvas width="16" height="16" data-bd="${A.id}" style="width:48px;height:48px;image-rendering:pixelated;${got?'':'filter:grayscale(1) opacity(.45)'}"></canvas><br><b>${A.id}. Badge ${BLAB(A.badge)}</b><br>${A.name}<br><small>${got?'Remis par '+esc(A.champ):'À gagner'}</small></div>`}).join('')}</div><p style="margin-top:10px">Évolutions : Gestionnaire de site → Energy Manager (4e badge) → Gestionnaire de patrimoine (8e badge).</p>`,
    classeur:()=>`<p>${Object.keys(S.fiches||{}).length} / ${FICHES.length} fiches savoir. Les fiches <b>clés</b> ouvrent les portes des arènes ; les autres rapportent de l'XP.</p>`+[0,1,2,3,4,5,6,7,8,'P'].map(st=>{const L=FICHES.filter(f=>f.st===st);return `<div class="cls"><div class="cls-h"><b>${st===0?'Le cycle':st==='P'?'Patrimoine':'Étape '+st+' · '+STEP_NAMES[st]}</b><span>${L.filter(f=>fGot(f.id)).length}/${L.length}</span><button type="button" class="course-link dark" data-h="${STEP_HASH(st)}">Cours ↗</button></div>${L.map(f=>fGot(f.id)?`<div class="fiche mini${f.req?' req':''}"><b>${esc(f.t)}</b><p>${esc(f.x)}</p>${refsHTML(f.refs)}</div>`:`<div class="fiche mini unk"><b>???${f.req?' · info clé':''}</b><p>${fAvail(f)?'Indice : '+esc(SRC[f.src].where):'Disponible à partir de cette étape du jeu.'}</p></div>`).join('')}</div>`}).join(''),
    dex:()=>`<p>${Object.keys(S.dex).length}/7 anomalies corrigées.</p><div class="dex" id="dexg"></div>`,
    sec:()=>`<p>${Object.keys(S.secrets).length}/${NSEC} secrets trouvés. Explore, parle à tout le monde, examine tout (et pas seulement les compteurs).</p><div class="dex">${Object.entries(SECRETS).map(([k,v])=>`<div class="${S.secrets[k]?'':'unk'}">${S.secrets[k]?'<b>'+esc(v)+'</b>':'???'}</div>`).join('')}</div><h3 style="margin-top:14px">Clins d’œil aux jeux vidéo</h3><p>${Object.keys(EGGS).filter(k=>S.secrets[k]).length}/${Object.keys(EGGS).length} trouvés. Un par jeu : un carton, un prêtre, un mouton, un mur qui sonne creux…</p><div class="dex">${Object.entries(EGGS).map(([k,v])=>`<div class="${S.secrets[k]?'':'unk'}">${S.secrets[k]?'<b>'+esc(v)+'</b>':'???'}</div>`).join('')}</div>`,
    etapes:()=>`<div id="chl"></div>`,
    passeport:()=>passeportHTML(),   // les voyages en train (jeu/voyages/passeport.js)
    sources:()=>sourcesHTML(),       // les références de tout ce que le jeu enseigne (jeu/interface/sources.js)
    avatar:()=>`<p>Change de tête, de coiffure ou de tenue quand tu veux : chapeaux, vestes, tabliers, objets en main… Tu y trouveras aussi une tenue par région, les tenues de rang, et celle de chaque personnage à qui tu as parlé (${Object.keys(S.models||{}).length} débloquée${Object.keys(S.models||{}).length>1?'s':''}).</p><button class="btn" id="avEdit">Modifier mon avatar</button>`,
    save:()=>INVITE?`<p><b>Partie sans compte</b> : rien n'est sauvegardé, la partie s'arrête quand tu fermes la page.</p><p>Connecte-toi ou crée un compte pour l'enregistrer et la retrouver sur tous tes appareils. Si ton compte a déjà une partie, c'est elle qui reprend.</p><div class="row"><button class="btn" id="svCompte">Se connecter ou créer un compte</button></div>`
      :`<p>${COMPTE.disponible&&COMPTE.identifiant()?`Compte <b>${esc(COMPTE.identifiant())}</b>`:'Dans ce navigateur'}${S.hades?' · <b>mode Hadès</b>':''} · dernière sauvegarde : <b>${fmtDate(S.savedAt)}</b>.</p><p>Le jeu sauvegarde tout seul à chaque progrès${COMPTE.disponible&&COMPTE.identifiant()?', sur ton compte : tu retrouves ta partie sur tous tes appareils':', dans ce navigateur'}. Ta collection (badges, secrets, fiches, Anomalidex, XP) est conservée même si tu rejoues une étape.</p><div class="row"><button class="btn" id="svNow">Sauvegarder maintenant</button>${COMPTE.disponible?'<button class="btn alt" id="svCompte">Mon compte</button>':''}</div><div id="svMsg"></div>`,
    opt:()=>`<h3>Options</h3><div class="optg"><button class="btn alt" id="sndT">${AUD.on?'♪ Couper la musique':'♪ Activer la musique'}</button>${PIP.win||PIP.isPop?'':`<button class="btn alt" id="oFs">${QK_APP.classList.contains('fs')?'✕ Quitter le plein écran':'⛶ Plein écran'}</button>`}${PIPB.hidden||PIP.isPop?'':`<button class="btn alt" id="oPip">${PIP.win?'↩ Remettre le jeu dans l’onglet':'⧉ Vignette flottante'}</button>`}<button class="btn alt" id="oBack">← Retour au cours</button></div>
      <p class="dnote">La partie est sauvegardée automatiquement dans ce navigateur (voir Sauvegarde).</p><div class="row"><button class="btn alt" id="rst">Recommencer l'histoire</button></div><div id="rstc"></div>`,
    energie:()=>enTab(),
    ciel:()=>{skyUpdate(true);const seg=(k,opts)=>`<div class="seg" role="group" data-k="${k}">${opts.map(([v,l])=>`<button type="button" data-v="${v}" class="${String(PREF[k])===String(v)?'on':''}" aria-pressed="${String(PREF[k])===String(v)}">${l}</button>`).join('')}</div>`;
      return `<h3>Ciel et météo</h3><div class="obj-box"><p>${esc(skyLine())}</p></div>
      <p class="dnote">Degrés-jours du jour (base 18) : <b>${djuTxt()}</b> · Solaire : <b>${Math.round(SKY.pv*100)} %</b> de la puissance crête · Vent : <b>${Math.round(SKY.wind*62)} km/h</b></p>
      <p class="dnote">La ville suit l'heure de ton appareil et le calendrier du jeu. Le temps qu'il fait est simulé : le jeu ne se connecte à aucun service météo.</p>
      <h4 class="segh">Calendrier</h4>${seg('cal',[['jeu','Celui du jeu (une minute = une semaine)'],['reel','Date réelle']])}<p class="dnote">Le calendrier du jeu fait défiler les saisons et les vacances scolaires : c'est lui qui fait varier les consommations dans ton tableau de bord Énergie.</p>
      <h4 class="segh">Moment de la journée</h4>${seg('hour',[['auto','Heure réelle'],['aube','Aube'],['jour','Jour'],['crepuscule','Crépuscule'],['nuit','Nuit']])}${S.ch===7?'<p class="dnote">La ronde de nuit se joue toujours de nuit.</p>':''}
      <h4 class="segh">Temps</h4>${seg('meteo',[['auto','Selon la date'],['clair','Soleil'],['nuageux','Nuageux'],['couvert','Couvert'],['pluie','Pluie'],['orage','Orage'],['brouillard','Brouillard'],['neige','Neige'],['vent','Grand vent']])}
      <h4 class="segh">Saison</h4>${seg('saison',[['auto','Selon la date'],['printemps','Printemps'],['été','Été'],['automne','Automne'],['hiver','Hiver']])}
      <h4 class="segh">Patine de la ville</h4>${seg('wear',WEAR_NAMES.map((n,i)=>[i+1,(i+1)+' · '+n]))}<p class="dnote">Usure, traces de vie, herbes folles, petits défauts : de la ville neuve (1) à la ville qui a beaucoup vécu (5).</p>`},
    keys:()=>`<h3>Commandes</h3><div class="tbl keys-t"><table>
      <tr><td>${touch?'Croix':'Flèches · ZQSD / WASD'}</td><td>Marcher</td></tr>
      <tr><td>${touch?'A':'Espace · Entrée · E'}</td><td>Parler, lire, interagir, faire défiler un dialogue</td></tr>
      <tr><td>${touch?'Menu':'M'}</td><td>${touch?'Ouvrir ce menu':'Ouvrir et refermer ce menu'}</td></tr>
      <tr><td>${touch?'CARTE':'K'}</td><td>Carte de la ville : quartiers, arènes, objectif. Dans la carte : ${touch?'touche un endroit pour savoir ce que c’est, glisse pour déplacer, + et − pour zoomer':'les flèches déplacent le curseur, Espace ou + et − zooment, K referme'}${wmEtages()?'. Depuis que la gare a rouvert : dézoome encore pour voir tout le pays et ses lignes de train, puis zoome sur un site pour voir son plan':''}</td></tr>
      <tr><td>${touch?'Courir':'Maj (maintenue) · R'}</td><td>Courir</td></tr>
      <tr><td>${touch?'Roulade':'C'}</td><td>Roulade avant : trois cases d'une traite, plus vite qu'en courant</td></tr>
      ${touch?'':'<tr><td>F</td><td>Plein écran</td></tr>'}</table></div><p class="dnote">Le bouton MENU, en haut à droite de l'écran, ouvre aussi ce menu. À côté : « CARTE » ouvre la carte de la ville, « ← Cours » ramène au cours${touch?'':', « ⧉ Vignette » détache le jeu dans une petite fenêtre flottante'}.</p>`
  };
  const show=k=>{if(k==='carte'){closePanel();openMap();return}b.querySelectorAll('.menu-tabs button').forEach(x=>x.classList.toggle('on',x.dataset.t===k));mt.innerHTML=tabs[k]();
    if(k==='objectif'){mt.querySelector('#oCourse').onclick=()=>{closePanel();goCourse()};mt.querySelector('#oMap').onclick=()=>{closePanel();openMap()}}
    if(k==='badges')mt.querySelectorAll('canvas[data-bd]').forEach(c=>c.getContext('2d').drawImage(badgeCanvas(+c.dataset.bd),0,0));
    if(k==='dex'){const g=mt.querySelector('#dexg');ANOM.forEach(a=>{const d=document.createElement('div');const got=S.dex[a.id];if(!got)d.className='unk';d.appendChild(monCanvas(got?a:{...a,col:'#999',sym:'?'},40));d.insertAdjacentHTML('beforeend',`<br><b>${got?a.name:'???'}</b><br>${got?esc(a.data):''}`);g.appendChild(d)})}
    if(k==='classeur')mt.querySelectorAll('[data-h]').forEach(x=>x.onclick=()=>{closePanel();goCourse(x.dataset.h)});
    if(k==='etapes')chapterList(mt.querySelector('#chl'),(ch,sid)=>{closePanel();jumpTo(ch,sid)});
    if(k==='energie')enBind(mt,show);
    if(k==='ciel')mt.querySelectorAll('.seg button').forEach(x=>x.onclick=()=>{const kk=x.parentNode.dataset.k,v=kk==='wear'?+x.dataset.v:x.dataset.v;prefSet(kk,v);skyUpdate(true);skyApply();trk('setting',{k:'ciel_'+kk,v});show('ciel')});
    if(k==='passeport')passeportLier(mt);
    if(k==='avatar')mt.querySelector('#avEdit').onclick=()=>{closePanel();openAvatar()};
    if(k==='save'){const sn=mt.querySelector('#svNow');if(sn)sn.onclick=()=>{save();mt.querySelector('#svMsg').innerHTML=saveOK?`<div class="fb ok">✔ Partie sauvegardée (${fmtDate(S.savedAt)}).</div>`:'<div class="fb ko">✘ Le navigateur refuse la sauvegarde (navigation privée ou stockage bloqué).</div>'};const sc=mt.querySelector('#svCompte');if(sc)sc.onclick=()=>{closePanel();COMPTE.ouvrir(ROOT,'connexion')}}
    if(k==='opt'){mt.querySelector('#sndT').onclick=e=>{setSound(!AUD.on);e.target.textContent=AUD.on?'♪ Couper la musique':'♪ Activer la musique'};
      const f=mt.querySelector('#oFs'),p=mt.querySelector('#oPip');if(f)f.onclick=()=>{closePanel();FSB.click()};if(p)p.onclick=()=>{closePanel();PIPB.click()};
      mt.querySelector('#oBack').onclick=()=>{closePanel();$('qkBack').click()};
      mt.querySelector('#rst').onclick=()=>{mt.querySelector('#rstc').innerHTML='<p>L\'histoire repart du début. Tes badges, secrets, fiches, ton Anomalidex et ton XP sont conservés.</p><button class="btn" id="rstOk">Confirmer : recommencer l\'histoire</button>';mt.querySelector('#rstOk').onclick=()=>{restartStory();closePanel();boot()}}}};
  b.querySelectorAll('.menu-tabs button').forEach(x=>x.onclick=()=>show(x.dataset.t));show(tabs[tab0]?tab0:'objectif');
  b.querySelector('#mClose').onclick=closePanel;
}
