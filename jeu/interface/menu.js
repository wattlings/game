/* Wattlings · jeu/interface/menu.js
   Le menu, à la manière de Pokémon Rouge Feu : une liste courte en haut à droite de l'écran, un curseur ▶, et en bas
   un bandeau qui explique l'entrée choisie. Haut et bas déplacent le curseur, A (Espace, Entrée) ouvre l'entrée,
   B (Échap) revient en arrière, M referme tout. Chaque entrée ouvre un écran ; B y ramène à la liste, le curseur à la
   même place (il est gardé d'une ouverture à l'autre).
   openMenu() ouvre la liste ; openMenu('energie'), openMenu('sources')… ouvrent directement un écran. Les noms des
   anciens onglets restent compris (MENU_ALIAS). */

const MENU={cur:0,poche:'site',opt:0,avaler:false};
/* les anciens onglets → écran (et poche du carnet) */
const MENU_ALIAS={badges:'joueur',avatar:'joueur',sec:'carnet:secrets',passeport:'carnet:passeport',sources:'carnet:sources',ciel:'opt'};

const MENU_ENTREES=()=>[
  {k:'objectif',l:'Objectif',d:"Ce que tu dois faire maintenant et où aller. Un lien t'emmène à la bonne page du cours."},
  {k:'carte',l:'Carte',d:"La carte de la ville : quartiers, arènes, ton objectif et les infos clés qui te manquent. (Touche K)"},
  {k:'energie',l:'Énergie',d:"Ton tableau de bord : les kWh économisés, les consommations de ton site et tes actions."},
  {k:'dex',l:'Anomalidex',d:"Les anomalies de données que tu as repérées et corrigées."},
  {k:'classeur',l:'Classeur',d:"Tes fiches savoir, étape par étape. Les fiches clés ouvrent les portes des arènes."},
  {k:'carnet',l:'Carnet',d:`Ce que tu as noté sur ton site, tes secrets${S.voy&&S.voy.pass?', ton passeport de voyage':''} et les sources du jeu.`},
  {k:'joueur',l:S.name||'Alex',d:"Ta carte de joueur : rang, niveau, badges et collection. C'est là que tu changes d'avatar."},
  {k:'etapes',l:'Étapes',d:"Aller directement à une étape du jeu, pour la rejouer ou la reprendre."},
  {k:'save',l:'Sauver',d:INVITE?"Partie sans compte : rien n'est sauvegardé. Crée un compte pour garder ta progression.":"Enregistrer ta partie maintenant. Elle se sauvegarde aussi toute seule à chaque progrès."},
  {k:'opt',l:'Options',d:"Musique, plein écran, ciel et météo, patine de la ville, commandes, retour au cours."},
  {k:'fermer',l:'Retour',d:"Refermer le menu et reprendre le jeu. (Touche M ou Échap)"},
];

function openMenu(k){
  if(typeof k!=='string')k=null;   // $('menuBtn').onclick=openMenu reçoit l'évènement du clic
  if(busy||dlg.open||AR.lock)return;
  if(!k)return menuListe();
  const [e,p]=(MENU_ALIAS[k]||k).split(':');if(p)MENU.poche=p;
  if(e==='carte')return openMap();
  if(!MENU_ECRANS[e])return menuListe();
  menuEcran(e);
}

/* le clavier tant que le menu est ouvert : fn(t,e) reçoit la touche traduite (haut, bas, gauche, droite, a, b, m)
   et renvoie vrai si elle l'a traitée. La croix et les boutons A / B de l'écran tactile passent par la même fonction */
function menuClavier(ov,fn){
  MENU.ov=ov;MENU.fn=fn;
  const off=()=>{removeEventListener('keydown',kd,true);removeEventListener('keyup',ku,true)};
  const kd=e=>{if(!ov.isConnected){off();return}if(ROOT.querySelector('.cpt-fond'))return;
    const tag=(((e.composedPath&&e.composedPath()[0])||e.target).tagName||'').toLowerCase();
    if((tag==='input'||tag==='select'||tag==='textarea')&&e.key!=='Escape')return;
    if(e.ctrlKey||e.metaKey||e.altKey)return;
    const t=menuTouche(e);if(t&&fn(t,e)){e.preventDefault();e.stopPropagation()}};
  /* une touche A qui vient d'ouvrir un écran ne doit pas, en remontant, cliquer le bouton qui y a le focus */
  const ku=e=>{if(!ov.isConnected){off();return}if(MENU.avaler&&(e.key===' '||e.key==='Enter')){MENU.avaler=false;e.preventDefault();e.stopPropagation()}};
  addEventListener('keydown',kd,true);addEventListener('keyup',ku,true);
}
const menuTouche=e=>{const k=(e.key||'').toLowerCase(),c=e.code;
  return k==='arrowup'||c==='KeyW'?'haut':k==='arrowdown'||c==='KeyS'?'bas':k==='arrowleft'||c==='KeyA'?'gauche':k==='arrowright'||c==='KeyD'?'droite'
    :k===' '||k==='enter'||c==='KeyE'?'a':k==='escape'||k==='backspace'||c==='KeyX'?'b':k==='m'?'m':null};

/* à l'écran tactile, la croix et les boutons A / B pilotent le menu ouvert (sinon ils gardent leur rôle dans le jeu) */
const menuOuvert=()=>!!(MENU.fn&&MENU.ov&&MENU.ov.isConnected&&panelEl===MENU.ov&&!ROOT.querySelector('.cpt-fond'));
ROOT.querySelector('.ab').addEventListener('pointerdown',e=>{const b=e.target.closest('.a,.b');if(!b||!menuOuvert())return;e.preventDefault();e.stopPropagation();MENU.fn(b.classList.contains('a')?'a':'b',{repeat:false})},true);
ROOT.querySelector('.dpad').addEventListener('pointerdown',e=>{const b=e.target.closest('button[data-k]');if(!b||!menuOuvert())return;e.preventDefault();e.stopPropagation();MENU.fn({up:'haut',down:'bas',left:'gauche',right:'droite'}[b.dataset.k],{repeat:false})},true);

/* placer une boîte contre l'écran de jeu : la liste en haut à droite, le bandeau d'aide en bas */
function menuPlacer(ov){
  const sc=$('screen'),r=sc&&sc.getBoundingClientRect(),ok=r&&r.width>100&&r.height>100;
  const m=ov.querySelector('.fr-menu'),a=ov.querySelector('.fr-aide'),W=innerWidth,H=innerHeight;
  const top=ok?Math.max(8,r.top+8):12,right=ok?Math.max(8,W-r.right+8):12,bottom=ok?Math.max(8,H-r.bottom+8):12,left=ok?Math.max(8,r.left+8):12;
  Object.assign(m.style,{top:top+'px',right:right+'px'});Object.assign(a.style,{left:left+'px',right:right+'px',bottom:bottom+'px'});
}

/* ---------------- la liste ---------------- */
function menuListe(){
  const E=MENU_ENTREES();MENU.cur=Math.max(0,Math.min(MENU.cur,E.length-1));
  busy=true;clearKeys();
  const ov=document.createElement('div');ov.className='fr-fond';
  ov.innerHTML=`<div class="fr-menu" role="menu" aria-label="Menu">${E.map((e,i)=>`<button type="button" role="menuitem" class="fr-item" data-i="${i}" data-k="${e.k}"${e.k==='fermer'?' id="mClose"':''}>${esc(e.l)}</button>`).join('')}</div><div class="fr-aide" aria-live="polite"></div>`;
  $('layer').appendChild(ov);panelEl=ov;menuPlacer(ov);
  const items=[...ov.querySelectorAll('.fr-item')],aide=ov.querySelector('.fr-aide');
  const marquer=i=>{MENU.cur=i;items.forEach((b,j)=>b.classList.toggle('on',j===i));if(document.activeElement!==QK_HOST||ROOT.activeElement!==items[i])items[i].focus({preventScroll:true});aide.textContent=E[i].d};
  const choisir=i=>{const k=E[i].k;MENU.cur=i;trk('menu',{k});closePanel();if(k==='fermer')return;if(k==='carte'){openMap();return}menuEcran(k)};
  items.forEach((b,i)=>{b.onclick=()=>choisir(i);b.onpointerenter=()=>{if(MENU.cur!==i)marquer(i)};b.onfocus=()=>{if(MENU.cur!==i)marquer(i)}});
  ov.addEventListener('pointerdown',e=>{if(e.target===ov)closePanel()});   // toucher à côté referme
  const replacer=()=>{if(ov.isConnected)menuPlacer(ov);else removeEventListener('resize',replacer)};addEventListener('resize',replacer);
  menuClavier(ov,(t,e)=>{
    if(t==='bas'){marquer((MENU.cur+1)%items.length);return true}
    if(t==='haut'){marquer((MENU.cur-1+items.length)%items.length);return true}
    if(t==='a'){if(!e.repeat){MENU.avaler=e instanceof KeyboardEvent;choisir(MENU.cur)}return true}
    if(t==='b'||t==='m'){if(!e.repeat)closePanel();return true}
    return false});
  marquer(MENU.cur);
}

/* ---------------- les écrans ---------------- */
const MENU_PARENT={keys:'opt'};   // l'écran Commandes s'ouvre depuis les Options, et y ramène

function menuEcran(k){
  const E=MENU_ECRANS[k],ov=openPanel(E.t());ov.classList.add('fr-ecran');
  ov.querySelector('header').innerHTML=`<button type="button" class="fr-retour" id="mBack" title="Retour (B ou Échap)">◀ Retour</button><span class="fr-titre">${esc(E.t())}</span><button type="button" class="fr-x" id="mClose" title="Refermer le menu (M)" aria-label="Refermer le menu">✕</button>`;
  const b=ov.querySelector('.pbody');b.innerHTML=`<div id="mt"></div><p class="fr-touches">${matchMedia('(pointer:coarse)').matches?'« ◀ Retour » ramène au menu.':'B ou Échap : retour au menu · M : refermer'}</p>`;
  const mt=b.querySelector('#mt');
  const retour=()=>{closePanel();const p=MENU_PARENT[k];if(p)menuEcran(p);else menuListe()};
  const show=()=>{const y=ov.scrollTop;mt.innerHTML=E.html(mt);if(E.lier)E.lier(mt,show,retour);ov.scrollTop=y};
  ov.querySelector('#mBack').onclick=retour;ov.querySelector('#mClose').onclick=closePanel;
  menuClavier(ov,(t,e)=>{
    if(t==='b'){if(!e.repeat)retour();return true}
    if(t==='m'){if(!e.repeat)closePanel();return true}
    return E.clavier?E.clavier(t,mt,show,e):false});
  show();ov.scrollTop=0;
  const f=mt.querySelector('[data-focus]')||ov.querySelector('#mBack');if(f)f.focus({preventScroll:true});
}

/* l'aide d'un écran à lignes (options, poches du carnet) : un bandeau sous la ligne choisie, comme dans la liste */
const menuSeg=(vals,cur)=>vals.find(v=>String(v[0])===String(cur))||vals[0];

const MENU_ECRANS={
  /* l'objectif : la prochaine action en grand, puis toutes les tâches de l'étape, cochées (recit/objectifs.js) */
  objectif:{t:()=>'Objectif',
    html:()=>{const s=S.site?site():null,a=prochaineAction(),T=a.voyage?[]:objectiveText0();
      return `<div class="obj-box"><p><b>▶</b> ${esc(objectiveText())}</p></div>
      ${T.length>1?`<h4 class="segh">${esc(CHAPTERS[S.ch]||'Cette étape')}</h4><ol class="obj-liste">${T.map(x=>`<li class="${x.ok?'ok':x===a||x.t===a.t?'cur':''}"><span aria-hidden="true">${x.ok?'✔':x.t===a.t?'▶':'○'}</span><span>${esc(x.t)}${x.prog&&!x.ok?` <small>(${esc(x.prog)})</small>`:''}${x.cle?' <small class="obj-cle">info clé</small>':''}</span></li>`).join('')}</ol>`:''}
      <p class="dnote">${s?esc(s.name)+' · ':''}La flèche orange montre où aller ; au bord de l'écran, elle indique la direction. Un point d'exclamation signale quelqu'un qui a une information pour toi.</p>
      <div class="row"><button class="btn" id="oMap" data-focus>Voir sur la carte</button><button class="btn" id="oCourse">Cours de cette étape ↗</button></div>`},
    lier:mt=>{mt.querySelector('#oCourse').onclick=()=>{closePanel();goCourse()};mt.querySelector('#oMap').onclick=()=>{closePanel();openMap()}}},

  energie:{t:()=>'Énergie',html:()=>enTab(),lier:(mt,show)=>enBind(mt,show)},

  dex:{t:()=>'Anomalidex',
    html:()=>`<p>${Object.keys(S.dex).length}/7 anomalies corrigées.</p><div class="dex" id="dexg"></div>`,
    lier:mt=>{const g=mt.querySelector('#dexg');ANOM.forEach(a=>{const d=document.createElement('div');const got=S.dex[a.id];if(!got)d.className='unk';d.appendChild(monCanvas(got?a:{...a,col:'#999',sym:'?'},40));d.insertAdjacentHTML('beforeend',`<br><b>${got?a.name:'???'}</b><br>${got?esc(a.data):''}`);g.appendChild(d)})}},

  classeur:{t:()=>'Classeur',
    html:()=>`<p>${Object.keys(S.fiches||{}).length} / ${FICHES.length} fiches savoir. Les fiches <b>clés</b> ouvrent les portes des arènes ; les autres rapportent de l'XP.</p>`+[0,1,2,3,4,5,6,7,8,'P'].map(st=>{const L=FICHES.filter(f=>f.st===st);return `<div class="cls"><div class="cls-h"><b>${st===0?'Le cycle':st==='P'?'Patrimoine':'Étape '+st+' · '+STEP_NAMES[st]}</b><span>${L.filter(f=>fGot(f.id)).length}/${L.length}</span><button type="button" class="course-link dark" data-h="${STEP_HASH(st)}">Cours de l'étape ↗</button></div>${L.map(f=>fGot(f.id)?`<div class="fiche mini${f.req?' req':''}"><b>${esc(f.t)}</b><p>${esc(f.x)}</p>${refsHTML(f.refs)}</div>`:`<div class="fiche mini unk"><b>???${f.req?' · info clé':''}</b><p>${fAvail(f)?'Indice : '+esc(SRC[f.src].where):'Disponible à partir de cette étape du jeu.'}</p></div>`).join('')}</div>`}).join(''),
    lier:mt=>mt.querySelectorAll('[data-h]').forEach(x=>x.onclick=()=>{closePanel();goCourse(x.dataset.h)})},

  /* le carnet a des poches, comme le Sac : ◀ ▶ (ou gauche et droite) pour en changer */
  carnet:{t:()=>'Carnet',
    poches:()=>[
      {p:'site',l:'Mon site',html:()=>{const s=S.site?site():null;return s?`<h3>${esc(s.name)}</h3><div class="tbl"><table>
        <tr><th>Adresse</th><td>${S.notes.adresse?esc(S.notes.adresse):'<i>à trouver (boîte aux lettres)</i>'}</td></tr>
        <tr><th>Surface</th><td>${S.notes.surface?fmt(S.notes.surface)+' m²':'<i>à trouver (fiche technique)</i>'}</td></tr>
        <tr><th>Activité</th><td>${S.notes.activite?esc(S.notes.activite):'<i>à trouver</i>'}</td></tr>
        <tr><th>Localisation</th><td>${S.notes.adresse?'Ampère-sur-Loire (45), zone H1, météo Orléans-Bricy':'<i>—</i>'}</td></tr>
        <tr><th>PDL (élec)</th><td class="num">${S.notes.pdl||'<i>à trouver</i>'}</td></tr>
        <tr><th>PCE (gaz)</th><td class="num">${S.notes.pce||'<i>à trouver</i>'}</td></tr>
        <tr><th>Décret tertiaire</th><td>${S.ch>=2?(assujetti(s)?'Assujetti (≥ 1 000 m²)':'Non concerné (< 1 000 m²)'):'<i>—</i>'}</td></tr></table></div>`:'<p>Parle à Mme Joule pour choisir ton site.</p>'}},
      {p:'secrets',l:'Secrets',html:()=>`<p>${Object.keys(S.secrets).length}/${NSEC} secrets trouvés. Explore, parle à tout le monde, examine tout (et pas seulement les compteurs).</p><div class="dex">${Object.entries(SECRETS).map(([k,v])=>`<div class="${S.secrets[k]?'':'unk'}">${S.secrets[k]?'<b>'+esc(v)+'</b>':'???'}</div>`).join('')}</div><h3 style="margin-top:14px">Clins d’œil aux jeux vidéo</h3><p>${Object.keys(EGGS).filter(k=>S.secrets[k]).length}/${Object.keys(EGGS).length} trouvés. Un par jeu : un carton, un prêtre, un mouton, un mur qui sonne creux…</p><div class="dex">${Object.entries(EGGS).map(([k,v])=>`<div class="${S.secrets[k]?'':'unk'}">${S.secrets[k]?'<b>'+esc(v)+'</b>':'???'}</div>`).join('')}</div>`},
      ...(S.voy&&S.voy.pass?[{p:'passeport',l:'Passeport',html:()=>passeportHTML(),lier:passeportLier}]:[]),   // les voyages en train (jeu/voyages/passeport.js)
      {p:'sources',l:'Sources',html:()=>sourcesHTML()},   // les références de tout ce que le jeu enseigne (jeu/interface/sources.js)
    ],
    html(){const P=this.poches(),i=Math.max(0,P.findIndex(x=>x.p===MENU.poche)),p=P[i];MENU.poche=p.p;
      return `<div class="fr-poches" role="tablist" aria-label="Poches du carnet"><button type="button" class="fr-fl" data-d="-1" aria-label="Poche précédente">◀</button>${P.map(x=>`<button type="button" role="tab" class="fr-poche${x.p===p.p?' on':''}" data-p="${x.p}" aria-selected="${x.p===p.p}"${x.p===p.p?' data-focus':''}>${x.l}</button>`).join('')}<button type="button" class="fr-fl" data-d="1" aria-label="Poche suivante">▶</button></div><div class="fr-poche-c">${p.html()}</div>`},
    lier(mt,show){const P=this.poches(),p=P.find(x=>x.p===MENU.poche);if(p&&p.lier)p.lier(mt);
      mt.querySelectorAll('[data-p]').forEach(b=>b.onclick=()=>{MENU.poche=b.dataset.p;show();mt.querySelector('.fr-poche.on').focus()});
      mt.querySelectorAll('.fr-fl').forEach(b=>b.onclick=()=>{this.tourner(+b.dataset.d);show();mt.querySelector('.fr-poche.on').focus()})},
    tourner(d){const P=this.poches(),i=Math.max(0,P.findIndex(x=>x.p===MENU.poche));MENU.poche=P[(i+d+P.length)%P.length].p},
    clavier(t,mt,show){if(t!=='gauche'&&t!=='droite')return false;this.tourner(t==='gauche'?-1:1);show();mt.querySelector('.fr-poche.on').focus();return true}},

  /* la carte de joueur, comme la carte de dresseur : identité, rang, niveau, collection, et les 8 badges */
  joueur:{t:()=>'Carte de '+(S.name||'Alex'),
    html:()=>{const id=COMPTE.disponible&&COMPTE.identifiant();
      return `<div class="fr-carte"><div class="fr-carte-h"><b>Carte de joueur</b><span>${id?'Compte '+esc(id):INVITE?'Partie sans compte':''}</span></div>
      <div class="fr-carte-c"><dl>
        <dt>Nom</dt><dd>${esc(S.name)}</dd>
        <dt>Rang</dt><dd>${RANKS[S.rank]}${S.hades?' · Hadès':''}</dd>
        <dt>Niveau</dt><dd>${level()} <span class="xpbar" title="Expérience"><i style="width:${(S.xp%90)/90*100}%"></i></span> <small>${S.xp%90} / 90 XP</small></dd>
        <dt>Économisés</dt><dd>${S.site&&typeof enTotal==='function'?fmtKwh(enTotal()):'—'}</dd>
        <dt>Fiches</dt><dd>${Object.keys(S.fiches||{}).length} / ${FICHES.length}</dd>
        <dt>Anomalidex</dt><dd>${Object.keys(S.dex).length} / 7</dd>
        <dt>Secrets</dt><dd>${Object.keys(S.secrets).length} / ${NSEC}</dd></dl>
        <canvas width="20" height="20" class="fr-sprite"></canvas></div>
      <div class="fr-badges" aria-label="Badges : ${S.badges.length} sur 8">${ARENAS.map(A=>{const got=S.badges.includes(A.badge);return `<div class="${got?'':'unk'}" title="${got?'Remis par '+esc(A.champ):'À gagner'}"><canvas width="16" height="16" data-bd="${A.id}"></canvas><small>${BLAB(A.badge)}</small></div>`}).join('')}</div></div>
      <p class="dnote">Évolutions : Gestionnaire de site → Energy Manager (4e badge) → Gestionnaire de patrimoine (8e badge).</p>
      <div class="row"><button class="btn" id="avEdit" data-focus>Modifier mon avatar</button></div><p class="dnote">Têtes, coiffures, tenues, objets en main ; une tenue par région, les tenues de rang, et celle de chaque personnage à qui tu as parlé (${Object.keys(S.models||{}).length} débloquée${Object.keys(S.models||{}).length>1?'s':''}).</p>`},
    lier:mt=>{drawChar(mt.querySelector('.fr-sprite').getContext('2d'),2,3,'down',0,avPal(S.rank||0,S.av||AVDEF('h')));
      mt.querySelectorAll('canvas[data-bd]').forEach(c=>c.getContext('2d').drawImage(badgeCanvas(+c.dataset.bd),0,0));
      mt.querySelector('#avEdit').onclick=()=>{closePanel();openAvatar()}}},

  etapes:{t:()=>'Étapes',html:()=>`<p class="dnote">Choisis une étape pour y aller directement. Ta collection (badges, fiches, secrets, XP) est conservée.</p><div id="chl"></div>`,
    lier:mt=>chapterList(mt.querySelector('#chl'),(ch,sid)=>{closePanel();jumpTo(ch,sid)})},

  /* Sauver : la question Oui / Non, avec le résumé de la partie */
  save:{t:()=>'Sauver',
    html:()=>{const id=COMPTE.disponible&&COMPTE.identifiant();
      const resume=`<dl class="fr-resume"><dt>Joueur</dt><dd>${esc(S.name)}</dd><dt>Badges</dt><dd>${S.badges.length} / 8</dd><dt>Fiches</dt><dd>${Object.keys(S.fiches||{}).length} / ${FICHES.length}</dd>${INVITE?'':`<dt>${id?'Compte':'Enregistrée'}</dt><dd>${id?esc(id):'dans ce navigateur'}</dd><dt>Dernière sauvegarde</dt><dd>${fmtDate(S.savedAt)}</dd>`}</dl>`;
      return INVITE?`${resume}<p><b>Partie sans compte</b> : rien n'est sauvegardé, la partie s'arrête quand tu fermes la page.</p><p>Connecte-toi ou crée un compte pour l'enregistrer et la retrouver sur tous tes appareils. Si ton compte a déjà une partie, c'est elle qui reprend.</p><div class="row"><button class="btn" id="svCompte" data-focus>Se connecter ou créer un compte</button><button class="btn alt" id="svNon">Plus tard</button></div>`
        :`${resume}<p class="fr-question">Veux-tu sauvegarder la partie ?</p><div class="row"><button class="btn" id="svNow" data-focus>Oui</button><button class="btn alt" id="svNon">Non</button></div><div id="svMsg"></div><p class="dnote">Le jeu sauvegarde aussi tout seul à chaque progrès${id?', sur ton compte : tu retrouves ta partie sur tous tes appareils':''}. Ta collection (badges, secrets, fiches, Anomalidex, XP) est conservée même si tu rejoues une étape.</p>${COMPTE.disponible?'<div class="row"><button class="btn alt" id="svCompte">Mon compte</button></div>':''}`},
    lier:(mt,show,retour)=>{const sn=mt.querySelector('#svNow');if(sn)sn.onclick=()=>{save();mt.querySelector('#svMsg').innerHTML=saveOK?`<div class="fb ok">✔ ${esc(S.name)} a sauvegardé la partie (${fmtDate(S.savedAt)}).</div>`:'<div class="fb ko">✘ Le navigateur refuse la sauvegarde (navigation privée ou stockage bloqué).</div>'};
      mt.querySelector('#svNon').onclick=retour;
      const sc=mt.querySelector('#svCompte');if(sc)sc.onclick=()=>{closePanel();COMPTE.ouvrir(ROOT,INVITE?'creation':'connexion')}}},

  /* les options : une ligne par réglage, ◀ ▶ (ou gauche et droite) pour changer la valeur ; l'aide de la ligne choisie en dessous */
  opt:{t:()=>'Options',
    lignes:()=>[
      {k:'son',l:'Musique',v:[['on','Oui'],['off','Non']],get:()=>AUD.on?'on':'off',set:v=>setSound(v==='on'),d:"La musique et les bruitages du jeu."},
      {k:'cal',l:'Calendrier',v:[['jeu','Celui du jeu'],['reel','Date réelle']],d:"Le calendrier du jeu (une minute = une semaine) fait défiler les saisons et les vacances scolaires : c'est lui qui fait varier les consommations de ton tableau de bord Énergie."},
      {k:'hour',l:'Moment de la journée',v:[['auto','Heure réelle'],['aube','Aube'],['jour','Jour'],['crepuscule','Crépuscule'],['nuit','Nuit']],d:"« Heure réelle » suit l'horloge de ton appareil."+(S.ch===7?' La ronde de nuit se joue toujours de nuit.':'')},
      {k:'meteo',l:'Temps',v:[['auto','Selon la date'],['clair','Soleil'],['nuageux','Nuageux'],['couvert','Couvert'],['pluie','Pluie'],['orage','Orage'],['brouillard','Brouillard'],['neige','Neige'],['vent','Grand vent']],d:"Le temps qu'il fait est simulé : le jeu ne se connecte à aucun service météo."},
      {k:'saison',l:'Saison',v:[['auto','Selon la date'],['printemps','Printemps'],['été','Été'],['automne','Automne'],['hiver','Hiver']],d:"La saison des arbres, de l'herbe et de la neige."},
      {k:'wear',l:'Patine de la ville',v:WEAR_NAMES.map((n,i)=>[i+1,(i+1)+' · '+n]),d:"Usure, traces de vie, herbes folles, petits défauts : de la ville neuve (1) à la ville qui a beaucoup vécu (5)."},
    ].map(L=>Object.assign({get:()=>PREF[L.k],set:v=>{prefSet(L.k,L.k==='wear'?+v:v);skyUpdate(true);skyApply()}},L)),
    html(){skyUpdate(true);const R=this.lignes();MENU.opt=Math.max(0,Math.min(MENU.opt,R.length-1));
      return `<div class="obj-box"><p>${esc(skyLine())}</p></div>
      <p class="dnote">Degrés-jours du jour (base 18) : <b>${djuTxt()}</b> · Solaire : <b>${Math.round(SKY.pv*100)} %</b> de la puissance crête · Vent : <b>${Math.round(SKY.wind*62)} km/h</b></p>
      <div class="fr-opts" role="list">${R.map((L,i)=>`<div class="fr-opt${i===MENU.opt?' on':''}" role="listitem" data-r="${i}"><span class="fr-ol">${L.l}</span><button type="button" class="fr-fl" data-d="-1" aria-label="${L.l} : valeur précédente">◀</button><span class="fr-ov" aria-live="polite">${esc(menuSeg(L.v,L.get())[1])}</span><button type="button" class="fr-fl" data-d="1" aria-label="${L.l} : valeur suivante"${i===MENU.opt?' data-focus':''}>▶</button></div>`).join('')}</div>
      <div class="fr-aide-l">${esc(R[MENU.opt].d)}</div>
      <h4 class="segh">Jeu</h4><div class="optg">${PIP.win||PIP.isPop?'':`<button class="btn alt" id="oFs">${QK_APP.classList.contains('fs')?'✕ Quitter le plein écran':'⛶ Plein écran'}</button>`}${PIPB.hidden||PIP.isPop?'':`<button class="btn alt" id="oPip">${PIP.win?'↩ Remettre le jeu dans l’onglet':'⧉ Vignette flottante'}</button>`}<button class="btn alt" id="oKeys">Commandes</button><button class="btn alt" id="oIntro">Revoir la présentation</button><button class="btn alt" id="oBack">← Retour au cours</button></div>
      <div class="row"><button class="btn alt" id="rst">Recommencer l'histoire</button></div><div id="rstc"></div>`},
    changer(i,d){const L=this.lignes()[i],k=L.v.findIndex(v=>String(v[0])===String(L.get())),v=L.v[((k<0?0:k)+d+L.v.length)%L.v.length][0];L.set(v);trk('setting',{k:L.k==='son'?'son':'ciel_'+L.k,v})},
    lier(mt,show){
      mt.querySelectorAll('.fr-opt').forEach(r=>{const i=+r.dataset.r;r.onpointerenter=()=>{};r.querySelectorAll('.fr-fl').forEach(b=>b.onclick=()=>{MENU.opt=i;this.changer(i,+b.dataset.d);show();mt.querySelector(`.fr-opt[data-r="${i}"] .fr-fl[data-d="${b.dataset.d}"]`).focus()});r.onclick=e=>{if(e.target.closest('.fr-fl'))return;MENU.opt=i;show()}});
      const f=mt.querySelector('#oFs'),p=mt.querySelector('#oPip');if(f)f.onclick=()=>{closePanel();FSB.click()};if(p)p.onclick=()=>{closePanel();PIPB.click()};
      mt.querySelector('#oKeys').onclick=()=>{closePanel();menuEcran('keys')};
      mt.querySelector('#oIntro').onclick=()=>{closePanel();openPresentation()};
      mt.querySelector('#oBack').onclick=()=>{closePanel();$('qkBack').click()};
      mt.querySelector('#rst').onclick=()=>{mt.querySelector('#rstc').innerHTML='<p>L\'histoire repart du début. Tes badges, secrets, fiches, ton Anomalidex et ton XP sont conservés.</p><button class="btn" id="rstOk">Confirmer : recommencer l\'histoire</button>';mt.querySelector('#rstOk').onclick=()=>{restartStory();closePanel();boot()}}},
    clavier(t,mt,show){const n=this.lignes().length;
      const focus=()=>{const b=mt.querySelector('.fr-opt.on .fr-fl[data-d="1"]');if(b)b.focus({preventScroll:true})};
      if(t==='haut'||t==='bas'){MENU.opt=(MENU.opt+(t==='bas'?1:-1)+n)%n;show();focus();return true}
      if(t==='gauche'||t==='droite'){this.changer(MENU.opt,t==='gauche'?-1:1);show();focus();return true}
      return false}},

  keys:{t:()=>'Commandes',html:()=>`${keysTable(matchMedia('(pointer:coarse)').matches)}<div class="row"><button class="btn alt" id="kIntro" data-focus>Revoir la présentation</button></div>`,
    lier:mt=>{mt.querySelector('#kIntro').onclick=()=>{closePanel();openPresentation()}}},
};
