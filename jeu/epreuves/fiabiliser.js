/* Wattlings · jeu/epreuves/fiabiliser.js
   Étape 3 · Fiabiliser : les combats contre les anomalies. */

/* ================= COMBATS : ANOMALIES ================= */
const ANOM=[
  {id:'doublon',name:'Doublonix',col:'#8a5fc9',sym:'×2',data:'2 décembre : le créneau 10 h – 11 h arrive deux fois (12 mesures au lieu de 6).',moves:[['Retirer le doublon, statut « corrigée », garder la brute',1,'Un doublon ressemblait à une surconsommation. Correction tracée et réversible.'],['Additionner les deux séries',0,'Tu doubles l\'énergie de cette heure.'],['Supprimer toute la journée',0,'Tu crées un trou bien plus gros.'],['Garder : c\'est une vraie surconsommation',0,'La consommation réelle n\'a pas doublé : c\'est la transmission.']]},
  {id:'trou',name:'Lacunor',col:'#5a6b8c',sym:'∅',data:'18 novembre : aucune mesure de 8 h à 20 h.',moves:[['Estimer avec un profil type, statut « estimée »',1,'Le trou est comblé et marqué comme estimé. Il sera remplacé si la vraie donnée arrive.'],['Mettre 0 kWh',0,'Un trou ressemble alors à une économie !'],['Copier le 19 novembre sans le signaler',0,'On ne corrige jamais en silence.'],['Ignorer, ça ne change rien',0,'Les totaux et les alertes seront faux.']]},
  {id:'pic',name:'Picatron',col:'#e2573b',sym:'999',data:'20 janvier, 14 h 10 : 999,9 kW, pour un site qui plafonne bien en dessous.',moves:[['Rejeter la valeur (statut « rejetée »), conserver la brute',1,'999,9 kW est physiquement impossible pour ce raccordement : c\'est un bug de mesure.'],['La remplacer par 20 kW sans le noter',0,'Une correction doit rester traçable.'],['La garder : c\'est une vraie pointe',0,'Impossible physiquement.'],['Augmenter la puissance souscrite',0,'Tu paierais pour une pointe qui n\'existe pas.']]},
  {id:'recule',name:'Reculax',col:'#c9a82a',sym:'↩',data:'Index HPB : 413 989 kWh le 1er mars, 404 989 kWh le 1er avril.',moves:[['Signaler une erreur de saisie et estimer en attendant',1,'413 → 404 : deux chiffres inversés. Un index doit toujours croître.'],['Consommation de mars = −9 000 kWh',0,'Une consommation négative est impossible.'],['C\'est un bouclage du compteur',0,'Le compteur est loin de son maximum.'],['Accepter le relevé',0,'Un index qui recule déclenche toujours une vérification.']]},
  {id:'boucle',name:'Boucloop',col:'#2aa198',sym:'∞',data:'Compteur gaz à 5 chiffres : 99 850 m³ le 1er mars, 00 420 m³ le 1er avril.',moves:[['570 m³ : (100 000 − 99 850) + 420',1,'Le compteur a bouclé, comme un vieux compteur kilométrique.'],['−99 430 m³',0,'Consommation négative : c\'est le signe d\'un bouclage.'],['420 m³',0,'Tu oublies les 150 m³ avant le passage à zéro.'],['Rejeter le relevé',0,'Le relevé est juste : il faut le bon calcul.']]},
  {id:'unite',name:'Wattomix',col:'#4a78c9',sym:'W?',data:'À midi, l\'API renvoie « 22 500 » pour la puissance du site.',moves:[['C\'est en W : 22,5 kW',1,'Toujours vérifier l\'unité : W, kW, kVA, m³, kWh.'],['Le site appelle 22 500 kW',0,'Impossible pour ce raccordement.'],['Rejeter la valeur',0,'Elle est juste, dans une autre unité.'],['Diviser par 6',0,'Ça, c\'est pour passer de kW au pas 10 min à des kWh.']]},
  {id:'heure',name:'Horlogix',col:'#8a3b3b',sym:'23h',data:'29 mars 2026, au pas de 10 min : seulement 138 mesures au lieu de 144.',moves:[['Normal : passage à l\'heure d\'été, journée de 23 h. Stocker en UTC',1,'23 × 6 = 138. En UTC, chaque mesure a un horodatage unique.'],['C\'est un trou : estimer 6 mesures',0,'Ce n\'est pas un trou : la journée dure 23 h.'],['Dupliquer la dernière heure',0,'Tu inventerais une heure qui n\'existe pas.'],['Rejeter la journée',0,'Elle est complète.']]}
];
/* une anomalie à l'écran : sa créature (rendu/creatures.js), agrandie sans flou ; à défaut, l'ancienne goutte */
function monCanvas(a,size=40){
  const cr=typeof crImage==='function'&&a&&crImage(a.id,a.inconnue);
  if(cr){const c=document.createElement('canvas');c.width=size;c.height=size;const x=c.getContext('2d');x.imageSmoothingEnabled=false;x.drawImage(cr,0,0,size,size);return c}
  const c=document.createElement('canvas');c.width=size;c.height=size;const x=c.getContext('2d'),k=size/40;x.scale(k,k);
  x.fillStyle='rgba(0,0,0,.2)';x.fillRect(8,35,24,3);
  x.fillStyle=a.col;x.beginPath();x.moveTo(6,34);x.quadraticCurveTo(2,8,20,6);x.quadraticCurveTo(38,8,34,34);x.closePath();x.fill();
  x.fillStyle='rgba(255,255,255,.25)';x.fillRect(11,11,5,3);
  R(x,12,16,5,5,'#fff');R(x,23,16,5,5,'#fff');R(x,14,18,2,2,'#111');R(x,25,18,2,2,'#111');R(x,15,26,10,2,'#111');
  x.fillStyle='#fff';x.font='bold 7px monospace';x.textAlign='center';x.fillText(a.sym,20,33);
  return c;
}
function startEncounter(){
  const rest=ANOM.filter(a=>!S.dex[a.id]),pool=rest.length&&Math.random()<.85?rest:ANOM;
  battle(pool[Math.floor(Math.random()*pool.length)]);
}
function battle(a,opt){
  opt=opt||{};busy=true;clearKeys();let cred=100,over=false;const after=opt.onWin||afterCapture;
  const ov=document.createElement('div');ov.className='battle';ov.innerHTML=`<div class="arena" role="dialog" aria-label="Combat"><div class="field2"><div class="hpbox enemy"><b>${a.name}</b> <small>${opt.owner?'spécimen de '+esc(opt.owner)+' · '+opt.n+'/'+(opt.total||7):opt.conso?'dérive sauvage':'anomalie sauvage'}</small><div class="bar"><i style="width:100%"></i></div></div><div class="hpbox me"><b>${esc(S.name)}</b> <small>Nv ${level()}</small><div class="bar"><i style="width:100%"></i></div><small>Crédibilité</small></div></div><div class="bmsg"></div><div class="moves"></div></div>`;
  $('layer').appendChild(ov);sfx('encounter');updateMusic();
  const f=ov.querySelector('.field2'),mon=monCanvas(a,48);mon.className='mon';f.appendChild(mon);
  const hc=document.createElement('canvas');hc.width=20;hc.height=20;hc.className='hero';const hx=hc.getContext('2d');drawChar(hx,2,3,'up',0,PAL[S.rank]);f.appendChild(hc);
  const msg=ov.querySelector('.bmsg'),mv=ov.querySelector('.moves'),ebar=ov.querySelector('.enemy i'),mbar=ov.querySelector('.me i');
  const end=cb=>{ov.remove();busy=false;clearKeys();hud();save();updateMusic();if(cb)cb()};
  msg.innerHTML=`${opt.owner?esc(opt.owner)+' envoie':opt.conso?'Une dérive sauvage surgit dans le noir :':'Une anomalie sauvage apparaît :'} <b>${a.name}</b> !<div class="bdata">${a.data}</div>`;
  const moves=shuffle(a.moves);
  moves.forEach(m=>{const b=document.createElement('button');b.textContent=m[0];mv.appendChild(b);b.onclick=()=>{if(over)return;
    if(m[1]){over=true;mv.querySelectorAll('button').forEach(x=>x.disabled=true);ebar.style.width='0%';mon.classList.add('hit');
      msg.innerHTML=`C'est super efficace ! ${m[2]}`;jingle('victory');qkTimeout(()=>mon.classList.add('ko'),600);
      trk('battle',{a:a.id,r:'win'});const first=!S.dex[a.id];S.dex[a.id]=1;S.xp+=first?30:10;
      qkTimeout(()=>{msg.innerHTML=`<b>${a.name}</b> est ${opt.conso?'maîtrisé':'corrigée'}${first?' et rejoint ton Anomalidex':''} ! +${first?30:10} XP`;const c=document.createElement('button');c.textContent='Continuer ▸';c.style.gridColumn='1/-1';mv.innerHTML='';mv.appendChild(c);c.focus();c.onclick=()=>end(cred>=100&&!S.secrets.smash?()=>eggSmash(after):after)},1300)}
    else{trk('wrong_answer',{t:'Combat',q:a.name,a:m[0].slice(0,80)});cred-=expert()?50:34;mbar.style.width=Math.max(0,cred)+'%';mbar.style.background=cred<40?'var(--bad)':'var(--amber)';
      msg.innerHTML=`Ce n'est pas très efficace… ${m[2]}<br><b>${a.name}</b> sème le doute : ta crédibilité baisse !`;
      if(cred<=0){trk('battle',{a:a.id,r:'lose'});over=true;mv.innerHTML='';qkTimeout(()=>{msg.innerHTML=opt.perdu?opt.perdu.msg:opt.onLose?'Ta crédibilité est à zéro ! Le spécimen retourne dans son bocal, et toi à l\'entrée de l\'arène.':'Ta crédibilité est à zéro ! Même le fournisseur ne te croit plus. Tu te replies au bureau pour relire tes notes.';const c=document.createElement('button');c.textContent=opt.perdu?opt.perdu.bouton:opt.onLose?"Retour à l'entrée ▸":'Retour au bureau ▸';c.style.gridColumn='1/-1';mv.appendChild(c);c.onclick=()=>end(opt.perdu?opt.perdu.cb:opt.onLose||(()=>warp('office',5,6,'up')))},900)}}}});
  const cb2=document.createElement('button');cb2.className='course-btn';cb2.textContent=opt.conso?'Cours de cette étape : Détecter ↗':'Cours de cette étape : Fiabiliser ↗';cb2.onclick=()=>goCourse(opt.conso?'etape-6':'etape-3');const run=document.createElement('button');run.textContent='Fuir';run.onclick=()=>{if(!over){trk('battle',{a:a.id,r:'flee'});over=true;S.flees=(S.flees||0)+1;end(S.flees===3?()=>secret('fuite',["Tu fuis. Encore.","L'anomalie reste dans la base. Elle attendra le prochain audit, comme toutes les autres. Stratégie validée par 80 % des organisations."]):null)}};mv.appendChild(run);mv.appendChild(cb2);
  if(opt.owner)run.remove();
  mv.querySelector('button').focus();
}
function afterCapture(){if(S.ch>=4)toast(`Anomalidex · données : ${dexCompte('donnees')}/7`)}
function actTech(){
  if(srcTry('tech'))return;
  if(S.ch<4)return say([{w:'Technicien',t:"Le Parc des Données est fermé. Aucune donnée n'arrive ici tant que le mandat n'est pas signé à l'Arène des Flux."}]);
  say([{w:'Technicien',t:"Les hautes herbes grouillent de données brutes sauvages. C'est un bon entraînement avant d'affronter les spécimens du Dr Doublon, à l'Arène du Tamis."},{w:'Technicien',t:`Anomalidex · données : ${dexCompte('donnees')}/7 espèces corrigées.`}]);
}
