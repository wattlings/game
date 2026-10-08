/* Wattlings · jeu/interface/ems-bureau.js
   La console de l'EMS du bureau, ouverte depuis le PC du bureau. Un module par badge : il montre ce que le joueur a fait
   et décidé dans l'atelier de l'étape (S.ems), et permet de rejouer l'atelier pour s'entraîner (sans XP, sans rien changer
   au plan d'action lancé). Les ateliers eux-mêmes sont dans jeu/epreuves/ems-*.js et serie-brute.js. */

let emsRejeu=false;   // pendant un rejeu, gainXP ne donne rien (interface/hud.js)
/* [badge (= arène), nom du module, résumé, atelier à rejouer (lu au moment du clic : les ateliers sont chargés après ce fichier)] */
const EMS_MODULES=[
  [1,'Site et objectif',()=>{const n=S.notes||{},o=CAD_OBJ[emsObjectif()];return `${esc(n.adresse||site().addr)} · ${fmt(n.surface||site().surface)} m² · ${esc(n.activite||site().activite)}<br>Objectif : <b>${esc(o.t)}</b>. Indicateur suivi : ${esc(o.ind)}.`},()=>perimetreStep],
  [2,'Collecte',()=>{const s=site();return `PDL <span class="num">${esc(s.pdl)}</span> · PCE <span class="num">${esc(s.pce)}</span> : raccordés, consentement de ${esc(s.titulaire)} valide.<br>Trois sources : courbe pour analyser, index pour contrôler, facture pour chiffrer.`},()=>sourcesStep],
  [3,'Qualité des données',()=>{const f=emsGet('fiab');return f?`Semaine fiabilisée : ${emsKwh(f.net)} kWh. Brute, elle en annonçait ${emsKwh(f.brut)}. La donnée d'origine est conservée.`:"Les contrôles de qualité tournent. Aucune semaine traitée à la main pour l'instant : tu as sauté l'atelier."},()=>serieBruteStep],
  [4,'Modèle de données',()=>{const s=site(),t=emsGet('structure');return `${esc(s.name)} → PDL et PCE → un compteur chacun → leurs mesures, en kWh par jour.${t?` Mardi type : ${emsKwh(t.e)} kWh d'électricité et ${emsKwh(t.g)} kWh de gaz.`:''}`},()=>arbreStep],
  [5,'Analyse',()=>{const g=emsGet('signature')||(()=>{const r=sigRegression(sigPoints(site().id).pts);return {a:Math.round(r.a),b:Math.round(r.b*10)/10}})();
    return `Talon électrique : ${BASE[site().id]} kW, jour et nuit.<br>Signature gaz : <b>${emsKwh(g.a)} kWh/mois + ${g.b.toLocaleString('fr-FR')} kWh par DJU</b>. C'est la référence du site.`},()=>signatureStep],
  [6,'Alertes',()=>{const a=emsGet('alerte');return a?`Alerte au-delà de <b>+${a.seuil} %</b> de la référence, ${a.persist>1?'deux jours de suite':'dès le premier jour'}. Dernière dérive attrapée : +3 kW de talon, confirmée par ta ronde de nuit.`:"Alertes réglées par défaut. Le commercial jure que c'est « optimal ». Rejoue l'atelier pour en juger."},()=>seuilStep],
  [7,'Plan d’action',()=>{const p=emsGet('plan'),ids=p&&p.ids||Object.keys((S.en&&S.en.acts)||{});return ids.length?`${ids.map(id=>enAct(id)).filter(Boolean).map(a=>esc(a.t.split(' :')[0])).join(' · ')}${p&&p.kwh?`<br>Gain attendu : ${emsKwh(p.kwh)} kWh par an.`:''} Le compteur en haut de l'écran suit les kWh économisés.`:"Aucune action lancée."},null],
  [8,'Mesure et vérification',()=>{const m=emsGet('mv');return m?`Promis : ${emsKwh(m.prevu)} kWh. Prouvé, à météo comparable : <b>${emsKwh(m.reel)} kWh</b>. Le chiffre brut disait −${m.brut} % : la météo avait fait une partie du travail.`:"Rien de prouvé pour l'instant : une économie annoncée n'est qu'une promesse."},()=>mvStep]
];
function openEmsBureau(){
  const s=site(),ov=openPanel('EMS du bureau',{sansCours:true}),b=ov.querySelector('.pbody');
  const A=ARENAS.find(a=>ARENA_CH[a.id]===S.ch),rappel=A?`Rappel : ${esc(A.name)}, ${esc(qAu(A.id))}. ${esc(A.champ)} t'attend.`:'';
  const ouvert=n=>arenaDone(ARENAS[n-1]);
  b.innerHTML=`<div class="ems">${emsBarre('tableau de bord du site')}
    <p>L'outil de tout energy manager, version générique : chaque badge y ajoute un module. Tout ce que tu y vois, c'est toi qui l'as fait. ${rappel?'<br><b>'+rappel+'</b>':''}</p>
    <div class="ems-modules">${EMS_MODULES.map(([n,t,res,fn],i)=>ouvert(n)
      ?`<section class="ems-module"><h4>${n} · ${esc(t)}</h4><p>${res()}</p>${fn?`<button type="button" class="btn alt" data-r="${i}">Rejouer l'atelier</button>`:''}</section>`
      :`<section class="ems-module ferme"><h4>${n} · ${esc(t)}</h4><p>🔒 Module livré avec le badge ${esc(BLAB(ARENAS[n-1].badge))}. Le commercial avait pourtant juré qu'il était inclus.</p></section>`).join('')}</div>
    <p class="dnote">Rejouer un atelier sert à s'entraîner : pas d'XP, et ton plan d'action ne bouge pas.</p>
    <div class="row"><button type="button" class="btn" id="emsFermer">Fermer ▸</button></div></div>`;
  b.querySelectorAll('[data-r]').forEach(x=>x.onclick=()=>{const M=EMS_MODULES[+x.dataset.r];closePanel();emsRejeu=true;trk('setting',{k:'ems_rejeu',v:M[1]});
    runSteps('EMS du bureau · '+M[1],[M[3]()],()=>{emsRejeu=false;openEmsBureau()})});
  const f=b.querySelector('#emsFermer');f.onclick=()=>closePanel();f.focus();
}
