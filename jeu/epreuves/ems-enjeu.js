/* Wattlings · jeu/epreuves/ems-enjeu.js
   L'enjeu propre au site, dans l'arène du Chantier (étape Agir), avant le plan d'action : une décision qui compte,
   simulée par l'EMS du bureau, dont le résultat revient à l'étape Mesurer et dans la console.
     école : les vacances d'hiver (régime de chauffage et heure de relance) ;
     bureaux : la climatisation de l'été (consigne, coupure hors occupation, rafraîchissement de nuit) ;
     boulangerie : le four (heure d'allumage) et le contrat (option tarifaire calculée sur sa propre courbe).
   Tous les chiffres sont fictifs, d'ordre de grandeur réaliste. */

/* des pastilles à choix unique : [[valeur, libellé], …] */
const enjChips=(nom,opts,v)=>`<div class="ems-chips" role="group" data-nom="${nom}">${opts.map(([k,l])=>`<button type="button" class="ems-zone" data-v="${k}" aria-pressed="${k===v}">${l}</button>`).join('')}</div>`;
function enjLier(el,etat,maj){el.querySelectorAll('.ems-chips[data-nom]').forEach(g=>g.querySelectorAll('.ems-zone').forEach(b=>b.onclick=()=>{etat[g.dataset.nom]=b.dataset.v;g.querySelectorAll('.ems-zone').forEach(z=>z.setAttribute('aria-pressed',String(z===b)));maj()}))}

/* ---- l'école : deux semaines de vacances d'hiver ---- */
const ENJ_ECOLE={regime:[['20','Normal, 20 °C'],['16','Réduit, 16 °C'],['8','Hors-gel, 8 °C'],['0','Tout couper']],relance:[['dim','Dimanche 14 h'],['lun4','Lundi 4 h'],['lun7','Lundi 7 h']]};
function enjEcole(e){
  const jour=Math.round(SITES.ecole.gaz*1000*EN_PROF.ecole.gHeat*360/2435/28),brut=jour*14,T=+e.regime,heures={dim:18.5,lun4:4.5,lun7:1.5}[e.relance];
  const part={20:0,16:.25,8:.6,0:.8}[T],relance=T===20?0:Math.round(heures*jour/24*1.5),net=Math.round(brut*part-relance),lundi=T===20?20:Math.min(20,(T||4)+.8*heures);
  return {net,lundi:Math.round(lundi*10)/10,ok:T!==0&&T!==20&&lundi>=19,
    msg:T===0?"Tout couper en février : les canalisations gèlent, la chaudière proteste, l'assureur rit jaune. Le hors-gel existe pour une raison."
      :T===20?"Deux semaines à 20 °C pour 250 chaises vides. Elles te remercient. Le budget, moins."
      :lundi<19?`Lundi 8 h 30 : ${String(Math.round(lundi*10)/10).replace('.',',')} °C en CP. Les élèves gardent leurs moufles et la directrice t'appelle. Relance plus tôt.`:''};
}
/* ---- les bureaux : la climatisation de l'été (aujourd'hui : 22 °C, 24 h/24) ---- */
function enjBureau(e){
  const an=SITES.bureau.elec*1000*EN_PROF.bureau.eCool,f=c=>({22:1.24,24:1,26:.78}[c.consigne])*(c.coupe==='oui'?.72:1)*(c.nuit==='oui'?.88:1);
  const avant=an*1.24,apres=an*f(e),pct=Math.round((1-apres/avant)*100);
  return {net:Math.round(avant-apres),pct,ok:pct>=50,
    msg:pct>=50?'':`−${pct} % seulement : le directeur voulait la moitié.${e.consigne==='22'?' Et à 22 °C, les salariés sortent leurs pulls en juillet. C’est un look.':e.coupe!=='oui'?' La clim refroidit toujours des bureaux vides la nuit et le week-end.':' Encore un effort.'}`};
}
/* ---- la boulangerie : le four, puis le contrat ---- */
const ENJ_PRIX={base:.186,hp:.205,hc:.145};
function enjBoulangerie(e){
  const c=weekCurve('boulangerie'),tot=c.reduce((a,v)=>a+v,0),hc0=c.reduce((a,v,i)=>{const H=(i%48)/2;return a+(H<6||H>=22?v:0)},0)/tot,hc=Math.min(.9,hc0+(e.decale==='oui'?.08:0)),E=SITES.boulangerie.elec*1000;
  const cout={base:Math.round(E*ENJ_PRIX.base),hphc:Math.round(E*(hc*ENJ_PRIX.hc+(1-hc)*ENJ_PRIX.hp))},chauffe={'1.5':120,'2.25':75,'2.75':45,'3.25':15}[e.four],gaz=Math.round((120-chauffe)/60*12*310);
  const moins=cout.hphc<cout.base?'hphc':'base',fourOk=chauffe>=40;
  return {hc:Math.round(hc*100),cout,chauffe,net:gaz,eur:Math.round((e.contrat==='base'?0:cout.base-cout.hphc)+gaz*EN_PG),ok:fourOk&&e.contrat===moins,
    msg:!fourOk?`${chauffe} minutes de chauffe : à 3 h 30, le four est tiède, les baguettes aussi. Les clients de 7 h ne pardonnent pas.`
      :e.contrat!==moins?`L'option ${e.contrat==='base'?'Base':'heures creuses'} te coûte ${fmt(Math.abs(cout.base-cout.hphc))} € de plus par an que l'autre, avec ta propre courbe. Le fournisseur te dit merci.`:''};
}
function enjeuStep(el,next){
  const s=site(),id=s.id;let essais=0;
  const D={ecole:{titre:'Les vacances d’hiver',etat:{regime:'20',relance:'lun7'},
      intro:"Deux semaines de vacances d'hiver. Aujourd'hui, l'école reste chauffée comme un jour de classe. Choisis le régime pendant les vacances et l'heure où la chaudière se relance avant la rentrée du lundi 8 h 30.",
      champs:e=>`<p class="lbl">Pendant les vacances</p>${enjChips('regime',ENJ_ECOLE.regime,e.regime)}<p class="lbl">Relance de la chaudière</p>${enjChips('relance',ENJ_ECOLE.relance,e.relance)}`,
      calc:enjEcole,vue:r=>`Lundi 8 h 30 : <b>${String(r.lundi).replace('.',',')} °C</b> en classe · gaz économisé sur les vacances : <b>${emsKwh(Math.max(0,r.net))} kWh</b>`,
      bravo:(r,e)=>`Lundi 8 h 30, ${String(r.lundi).replace('.',',')} °C en classe et ${emsKwh(r.net)} kWh de gaz économisés sur deux semaines. ${e.regime==='8'&&e.relance==='dim'?'Hors-gel et relance la veille : le meilleur réglage. Quatre périodes de vacances par an, et ça se répète.':"Bien. Mais le hors-gel, relancé la veille, ferait encore mieux : regarde le compteur."}`},
    bureau:{titre:'La climatisation de l’été',etat:{consigne:'22',coupe:'non',nuit:'non'},
      intro:"L'été arrive, et la clim tourne aujourd'hui à 22 °C, 24 h sur 24. Le directeur veut diviser sa consommation par deux sans que personne ne fonde.",
      champs:e=>`<p class="lbl">Consigne de climatisation</p>${enjChips('consigne',[['22','22 °C'],['24','24 °C'],['26','26 °C']],e.consigne)}<p class="lbl">Couper la nuit et le week-end</p>${enjChips('coupe',[['non','Non'],['oui','Oui']],e.coupe)}<p class="lbl">Rafraîchir la nuit avec l'air extérieur</p>${enjChips('nuit',[['non','Non'],['oui','Oui']],e.nuit)}`,
      calc:enjBureau,vue:r=>`Climatisation de l'été : <b>−${r.pct} %</b>, soit ${emsKwh(r.net)} kWh d'électricité en moins`,
      bravo:(r,e)=>`−${r.pct} % sur la clim, soit ${emsKwh(r.net)} kWh par an. ${e.consigne==='26'?'26 °C, c’est la consigne que recommandent les pouvoirs publics : personne ne fond, promis.':''}${e.nuit==='oui'?' Et l’air de la nuit, lui, est gratuit.':''}`},
    boulangerie:{titre:'Le four et le contrat',etat:{four:'1.5',contrat:'base',decale:'non'},
      intro:"Deux décisions qui pèsent dans une boulangerie. Le four : il est allumé à 1 h 30 pour une première fournée à 3 h 30, et il lui faut 40 minutes pour chauffer. Le contrat d'électricité : l'EMS compare les deux options sur ta propre courbe.",
      champs:e=>`<p class="lbl">Allumage du four</p>${enjChips('four',[['1.5','1 h 30 (l’habitude)'],['2.25','2 h 15'],['2.75','2 h 45'],['3.25','3 h 15']],e.four)}<p class="lbl">Décaler la chambre de pousse et le lave-vaisselle la nuit</p>${enjChips('decale',[['non','Non'],['oui','Oui']],e.decale)}<p class="lbl">Option tarifaire</p>${enjChips('contrat',[['base','Base (un seul prix)'],['hphc','Heures pleines / heures creuses']],e.contrat)}`,
      calc:enjBoulangerie,vue:r=>`Four : ${r.chauffe} min de chauffe · ${r.hc} % de l'électricité en heures creuses · Base : <b>${fmt(r.cout.base)} €</b> / heures creuses : <b>${fmt(r.cout.hphc)} €</b> par an`,
      bravo:(r,e)=>`Le four chauffe ${r.chauffe} minutes au lieu de 120 : ${emsKwh(r.net)} kWh de gaz en moins par an. Et le contrat colle à ta courbe : ${fmt(r.eur)} € d'économie au total.${e.decale==='oui'?' Décaler la pousse la nuit, c’est faire travailler les heures creuses.':''} ${e.four!=='2.75'?'Allumer à 2 h 45 ferait encore mieux.':''}`}}[id]||null;
  if(!D)return next();
  const e=Object.assign({},D.etat);
  el.innerHTML=`<div class="ems">${emsBarre('enjeu du site · '+D.titre)}<p>${D.intro}</p><div class="enj-champs"></div><p class="ems-cur enj-vue" aria-live="polite"></p>
    <button class="btn" type="button" id="enjOk">Appliquer ▸</button><div class="fbz" aria-live="polite"></div></div>`;
  const ch=el.querySelector('.enj-champs'),vue=el.querySelector('.enj-vue'),fbz=el.querySelector('.fbz');
  const maj=()=>{vue.innerHTML=D.vue(D.calc(e))};
  ch.innerHTML=D.champs(e);enjLier(ch,e,maj);maj();
  el.querySelector('#enjOk').onclick=()=>{const r=D.calc(e);
    if(!r.ok){essais++;emsRate('Enjeu du site : '+D.titre,JSON.stringify(e));fbz.innerHTML=`<div class="fb ko">✘ ${r.msg} ${essais>=3?revoirFiche():''}</div>`;return}
    el.querySelector('#enjOk').remove();ch.querySelectorAll('button').forEach(b=>b.disabled=true);
    emsSet('enjeu',{t:D.titre,kwh:Math.max(0,r.net),eur:r.eur||Math.round(Math.max(0,r.net)*(id==='bureau'?EN_PE:EN_PG)),choix:e});trk('setting',{k:'enjeu_'+id,v:Object.values(e).join('/')});
    fbz.innerHTML=`<div class="fb ok">✔ ${D.bravo(r,e)}</div>${emsTransfert('l’outil simule le réglage avant qu’on le fasse : confort, kWh, euros. Mais ce sont les usages du site (les vacances, l’été, la première fournée) qui décident du bon réglage. Un EMS qui ne connaît pas le calendrier du site donne des conseils dangereux.')}`;
    gainXP(essais?5:20);contBtn(fbz,next)};
}
