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
function endScreen(){
  trk('game_end',{site:S.site,niveau:level()});
  const ov=openPanel('Quête terminée'),b=ov.querySelector('.pbody');
  b.innerHTML=`<h3>Diplôme de l'Energy Management par la donnée</h3><p><b>${esc(S.name)}</b>, ${RANKS[S.rank]}, niveau ${level()}${S.hades?' · <b>mention Hadès</b> (tout a été demandé deux fois, et obtenu quand même)':''}.</p><p>Tu as remporté les 8 arènes de la démarche avec ${esc(site().name)}, puis tu as pris en main un patrimoine entier.</p><div class="tbl"><table><tr><th>Étape</th><th>Ce que tu sais faire</th></tr>
  <tr><td>Cadrer</td><td>Périmètre, fiche patrimoine, PDL et PCE, plan de comptage</td></tr><tr><td>Collecter</td><td>Distributeur ≠ fournisseur, mandats, consentement</td></tr><tr><td>Fiabiliser</td><td>Doublons, trous, pics, index, bouclage, unités, heure</td></tr><tr><td>Structurer</td><td>Site → point → compteur → mesure, kW → kWh, m³ → kWh</td></tr><tr><td>Analyser</td><td>Talon, DJU, signature, puissance souscrite, ratios</td></tr><tr><td>Détecter</td><td>Dérives, baseline, faux positifs, coût d'une dérive</td></tr><tr><td>Agir</td><td>Sobriété → efficacité → production, temps de retour</td></tr><tr><td>Patrimoine</td><td>Pareto en MWh, € et CO₂, comparaison par activité, benchmark, gisements</td></tr><tr><td>Piloter</td><td>M&V corrigée des DJU, décret tertiaire, OPERAT, ISO 50001</td></tr></table></div><p><b>La suite :</b> ${fmtKwh(enTotal())} économisés jusqu'ici. Le fonds de travaux de toute la ville est maintenant entre tes mains. Vingt bâtiments, un seul compteur, un objectif : <b>−40 %</b>.</p>${voyAnnonce()}<div class="row"><button class="btn" id="endPark">Piloter le parc ▸</button><button class="btn alt" id="endStay">Continuer à explorer</button><button class="btn alt" id="endNew">Rejouer avec un autre site (collection conservée)</button></div>`;
  b.querySelector('#endStay').onclick=closePanel;b.querySelector('#endPark').onclick=()=>{closePanel();EN_V.v='parc';openMenu('energie')};b.querySelector('#endNew').onclick=()=>{restartStory();closePanel();boot()};
}
