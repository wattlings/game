/* Wattlings · jeu/interface/evolution-fin.js
   Changement de rang et écran de fin. */

/* ================= ÉVOLUTION, FIN, TITRE, MENU ================= */
function evolve(rank,cb){
  if(S.rank>=rank){hud();if(cb)cb();return}
  trk('evolve',{rank});
  busy=true;clearKeys();const old=S.rank,cur=avLook(),fit=rankOutfit(cur,rank);
  jingle('evo');const ov=document.createElement('div');ov.className='evo';ov.innerHTML=`<div class="t">Quoi ? ${esc(S.name)}, ${RANKS[old]}, évolue !</div><canvas width="20" height="20" aria-hidden="true"></canvas><div class="row" style="justify-content:center"></div>`;
  $('layer').appendChild(ov);const c=ov.querySelector('canvas'),x=c.getContext('2d'),t=ov.querySelector('.t');let start=performance.now();
  const reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const drawP=q=>{x.clearRect(0,0,20,20);drawChar(x,2,3,'down',0,q)};
  (function anim(now){const el=now-start,period=Math.max(60,300-el/12);if(!reduce&&el<3200){drawP(Math.floor(el/period)%2?fit:cur);qkRAF(anim)}else{
    drawP(fit);S.rank=rank;avSet(cur);const need=rank===1?9:19;if(level()<need+1)S.xp=need*90;save();hud();
    t.innerHTML=`Félicitations ! Tu deviens <b style="color:var(--amber)">${RANKS[rank]}</b> !<small style="display:block;font-size:.7em;margin-top:6px">Ta tenue de rang t'attend : ${RANK_FIT[rank].d}. Tu pourras toujours changer d'avis dans le menu, sur ta carte de joueur (l’entrée à ton prénom).</small>`;
    const row=ov.querySelector('.row'),done=wear=>{avSet(wear?fit:cur);trk('setting',{k:'tenue_rang',v:rank+(wear?':oui':':non')});save();ov.remove();busy=false;hud();if(cb)cb()};
    const b=document.createElement('button');b.className='btn';b.style.background='var(--amber)';b.style.color='var(--ink)';b.textContent='Porter la tenue ▸';b.onclick=()=>done(true);
    const k=document.createElement('button');k.className='btn alt';k.textContent='Garder ma tenue';k.onclick=()=>done(false);k.onmouseenter=k.onfocus=()=>drawP(cur);b.onmouseenter=b.onfocus=()=>drawP(fit);
    row.appendChild(b);row.appendChild(k);b.focus()}})(start);
}
/* le diplôme : ce que je sais faire, ce que fait un EMS, mes décisions, ce que je retiens, ma courbe. Imprimable. */
const DIP_SAVOIR={1:'Délimiter un périmètre, créer la fiche du site, choisir un objectif',2:'Distributeur ≠ fournisseur ; raccorder PDL et PCE avec le consentement du titulaire ; courbe, index, facture',
  3:'Repérer trous, doublons, pics, valeurs figées ; traiter sans effacer la donnée brute',4:'Ranger site → point → compteur → mesures ; kW → kWh, m³ → kWh',
  5:'Talon, DJU, signature énergétique, puissance souscrite, ratios',6:'Référence, seuil et persistance d’une alerte ; faux positifs ; coût d’une dérive',
  7:'Sobriété → efficacité → production ; plan chiffré sous budget ; enjeu du site',8:'Mesure et vérification corrigée des DJU ; décret tertiaire, OPERAT, ISO 50001'};
function diplomeDonnees(){
  const e=typeof EN==='function'?EN():{log:[]},miss=(e.log||[]).filter(l=>l[1]==='miss'),perdus=miss.reduce((a,l)=>a+(l[3]||0),0);
  const al=emsGet('alerte'),enj=emsGet('enjeu'),plan=emsGet('plan'),mv=emsGet('mv'),o=CAD_OBJ[emsObjectif()];
  const dec=[['Objectif',`${o.t} (indicateur : ${o.ind})`],
    ['Alerte',al?`au-delà de +${al.seuil} % de la référence, ${al.persist>1?'deux jours de suite':'dès le premier jour'}`:'réglage par défaut'],
    ['Enjeu du site',enj?`${enj.t} : ${emsKwh(enj.kwh)} kWh par an`:'non réglé'],
    ['Plan d’action',plan&&plan.ids?`${plan.ids.map(id=>enAct(id)).filter(Boolean).map(a=>a.t.split(' :')[0]).join(', ')} (${emsKwh(plan.kwh)} kWh attendus par an)`:'non composé'],
    ['Preuve',mv?`${emsKwh(mv.reel)} kWh prouvés à météo comparable, sur ${emsKwh(mv.prevu)} promis`:'pas encore vérifié'],
    ['Alertes ignorées',miss.length?`${miss.length}, soit ${fmtKwh(perdus)} qui ne seront jamais économisés`:'aucune. Chapeau.']];
  return {dec,retiens:[1,2,3,4,5,6,7,8].filter(n=>S.retiens&&S.retiens[n]).map(n=>[STEP_NAMES[n],S.retiens[n]])};
}
function diplomeHtml(){
  const D=diplomeDonnees();
  return `<div class="tbl"><table><tr><th>Étape</th><th>Ce que je sais faire</th><th>Ce que fait un EMS</th></tr>${[1,2,3,4,5,6,7,8].map(n=>`<tr><td>${esc(STEP_NAMES[n])}</td><td>${esc(DIP_SAVOIR[n])}</td><td>${esc(BILANS[n].ems)}</td></tr>`).join('')}
    <tr><td>Patrimoine</td><td>Pareto en MWh, € et CO₂, comparaison par activité, priorités</td><td>Il compare les sites entre eux et classe les priorités du parc.</td></tr></table></div>
    <h4>Mes décisions, de l'étape Cadrer à l'étape Mesurer</h4><div class="tbl"><table>${D.dec.map(([k,v])=>`<tr><th>${esc(k)}</th><td>${esc(v)}</td></tr>`).join('')}</table></div>
    ${D.retiens.length?`<h4>Ce que je retiens</h4><ul class="dip-retiens">${D.retiens.map(([e,r])=>`<li><b>${esc(e)} :</b> ${esc(r)}</li>`).join('')}</ul>`:''}`;
}
/* une page à part, sans le jeu autour, pour l'imprimer ou l'enregistrer en PDF */
function diplomeImprimer(){
  const w=window.open('','_blank');if(!w){toast('Ton navigateur a bloqué la fenêtre du diplôme : autorise-la, puis réessaie.');return}
  const cv=document.createElement('canvas');cv.width=480;cv.height=170;maCourbeDessiner(cv);
  w.document.write(`<!doctype html><html lang="fr"><head><meta charset="utf-8"><title>Diplôme · ${esc(S.name)}</title><style>
    body{font-family:"Atkinson Hyperlegible",system-ui,sans-serif;color:#1c2440;margin:24px;font-size:12.5px}h1{font-size:22px;margin:0}h2{font-size:15px;font-weight:400;margin:4px 0 12px}h4{margin:14px 0 4px}
    table{border-collapse:collapse;width:100%}th,td{border:1px solid #c9bb92;padding:4px 6px;text-align:left;vertical-align:top}th{background:#f3ead6}ul{margin:4px 0;padding-left:18px}
    .tete{display:flex;justify-content:space-between;gap:16px;align-items:flex-start;border-bottom:3px double #1c2440;padding-bottom:8px;margin-bottom:10px}img{width:300px;border:1px solid #c9bb92}
    @page{size:A4;margin:12mm}@media print{body{margin:0}}</style></head><body>
    <div class="tete"><div><h1>Diplôme de l'Energy Management par la donnée</h1><h2><b>${esc(S.name)}</b>, ${esc(RANKS[S.rank])} · ${esc(site().name)} · ${new Date().toLocaleDateString('fr-FR')}</h2></div><img src="${cv.toDataURL()}" alt="Ma courbe"></div>
    ${diplomeHtml()}<p style="margin-top:12px;color:#5b6380">Wattlings · La démarche en 8 étapes, de la donnée à l'économie prouvée. Valeurs du jeu fictives.</p></body></html>`);
  w.document.close();w.focus();setTimeout(()=>{try{w.print()}catch(e){}},300);trk('setting',{k:'diplome',v:'imprimer'});
}
function endScreen(){
  if(S.ch>=11&&!S.flags.finVue){S.flags.finVue=1;trk('game_end',{site:S.site,niveau:level()});save()}
  const ov=openPanel('Quête terminée'),b=ov.querySelector('.pbody');
  b.innerHTML=`<h3>Diplôme de l'Energy Management par la donnée</h3><p><b>${esc(S.name)}</b>, ${RANKS[S.rank]}, niveau ${level()}${S.hades?' · <b>mention Hadès</b> (tout a été demandé deux fois, et obtenu quand même)':''}.</p><p>Tu as remporté les 8 arènes de la démarche avec ${esc(site().name)}, puis tu as pris en main un patrimoine entier.</p>
  ${maCourbeHtml()}${diplomeHtml()}
  <div class="row"><button class="btn alt" id="endPrint">Imprimer mon diplôme</button></div>
  <p><b>La suite :</b> ${fmtKwh(enTotal())} économisés jusqu'ici. Le fonds de travaux de toute la ville est maintenant entre tes mains. Vingt bâtiments, un seul compteur, un objectif : <b>−40 %</b>.</p>${voyAnnonce()}<div class="row"><button class="btn" id="endPark">Piloter le parc ▸</button><button class="btn alt" id="endStay">Continuer à explorer</button><button class="btn alt" id="endNew">Rejouer avec un autre site (collection conservée)</button></div>`;
  maCourbeDessiner(b.querySelector('.mc canvas'));
  b.querySelector('#endPrint').onclick=diplomeImprimer;
  b.querySelector('#endStay').onclick=closePanel;b.querySelector('#endPark').onclick=()=>{closePanel();EN_V.v='parc';openMenu('energie')};b.querySelector('#endNew').onclick=()=>{restartStory();closePanel();boot()};
}
