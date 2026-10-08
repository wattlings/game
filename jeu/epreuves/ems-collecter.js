/* Wattlings · jeu/epreuves/ems-collecter.js
   Étape 2 · Collecter, l'atelier : raccorder les deux points du site en tapant le PDL et le PCE relevés en ville (le carnet),
   avec les réponses de l'API comme en vrai, puis comparer ce qu'apportent la courbe, l'index et la facture sur une même semaine. */

/* la réponse de l'API à un identifiant tapé : [code, message] ; 200 si le point est raccordé */
function colReponse(kind,saisi){
  const s=site(),o=Object.values(SITES).filter(x=>x.id!==s.id),brut=String(saisi).toUpperCase().replace(/[\s.\-]/g,'');
  if(kind==='pdl'){
    if(!brut)return ['400',"Requête vide. L'API ne lit pas encore dans les pensées."];
    if(!/^\d+$/.test(brut))return ['400',"Format invalide : un PDL ne contient que des chiffres."];
    if(brut.length!==14)return ['400',`Format invalide : un PDL a 14 chiffres, tu en as tapé ${brut.length}. L'API compte mieux que nous.`];
    if(brut===s.serie)return ['404',"Ça, c'est le numéro de série du compteur. Le compteur peut changer demain ; le point, jamais. L'API veut le point."];
    const autre=o.find(x=>x.pdl===brut);if(autre)return ['403',`Aucun consentement pour ce point. C'est le PDL de ${autre.name} : son titulaire n'a rien signé.`];
    if(brut!==s.pdl)return ['404',"Point inconnu. Un chiffre de travers, et l'EMS interroge le vide. Le vide n'a pas répondu."];
    return ['200',`Point raccordé. Consentement de ${s.titulaire} valide. Les données arrivent.`];
  }
  if(!brut)return ['400',"Requête vide. Le gaz est invisible, son identifiant ne doit pas l'être."];
  if(/^G1/.test(brut))return ['400',"Format invalide : c'est « GI », avec un I, pas un 1. L'API, elle, ne plaisante pas avec la typographie."];
  if(!/^GI\d{6}$/.test(brut))return ['400',"Format invalide : ici, un PCE s'écrit GI suivi de 6 chiffres."];
  const autre=o.find(x=>x.pce===brut);if(autre)return ['403',`Aucun consentement pour ce point. C'est le PCE de ${autre.name}.`];
  if(brut!==s.pce)return ['404',"Point inconnu. Ton carnet dit autre chose, et ton carnet a raison."];
  return ['200',`Point raccordé. Consentement de ${s.titulaire} valide. Les volumes journaliers arrivent.`];
}

function raccordStep(el,next){
  const s=site(),ok={};let essais=0;
  el.innerHTML=`<div class="ems">${emsBarre('raccorder les points')}
    <p>Le mandat est signé. Reste à dire à l'EMS <b>quels points</b> interroger. Tape le PDL et le PCE que tu as relevés sur les compteurs : ils sont dans ton carnet.</p>${emsCarnet()}
    <div class="ff"><div class="field"><label for="colPdl">PDL (électricité · Enedis)</label><input id="colPdl" inputmode="numeric" autocomplete="off" class="mono"><small class="m"></small></div>
    <div class="field"><label for="colPce">PCE (gaz · GRDF)</label><input id="colPce" autocomplete="off" autocapitalize="characters" class="mono"><small class="m"></small></div></div>
    <button class="btn" type="button" id="colGo">Lancer la collecte ▸</button><div class="ems-api" aria-live="polite"></div><div class="fbz"></div></div>`;
  const api=el.querySelector('.ems-api'),fbz=el.querySelector('.fbz');
  el.querySelector('#colGo').onclick=()=>{
    const lignes=[];
    [['pdl','colPdl','Enedis'],['pce','colPce','GRDF']].forEach(([k,id,qui])=>{if(ok[k])return;const inp=el.querySelector('#'+id),[c,t]=colReponse(k,inp.value);
      lignes.push(`<li class="${c==='200'?'ok':'ko'}"><span class="mono">${qui} · ${c}</span> ${esc(t)}</li>`);
      inp.parentNode.querySelector('.m').textContent=c==='200'?'✔ raccordé':'';
      if(c==='200'){ok[k]=1;inp.disabled=true}else emsRate('Raccorder les points',k+' '+c)});
    api.innerHTML=`<ul class="ems-log">${lignes.join('')}</ul>`;
    if(!(ok.pdl&&ok.pce)){essais++;if(essais>=2)fbz.innerHTML=`<p class="dnote">Le carnet s'ouvre juste au-dessus. Personne ne retient 14 chiffres par cœur, pas même Mme Joule.</p>`;return}
    el.querySelector('#colGo').remove();emsSet('raccord',{essais});
    fbz.innerHTML=`<div class="fb ok">✔ Deux points raccordés, deux sources ouvertes.${essais?' Les erreurs de l’API n’étaient pas de la méchanceté : c’était de la précision.':''}</div>${emsTransfert('la collecte est automatique, mais elle part d’identifiants saisis un jour par quelqu’un. Un PDL mal recopié, c’est un site vide dans l’outil, ou pire, les données du voisin. Et une collecte s’arrête toute seule quand le consentement expire.')}`;
    gainXP(essais?5:20);contBtn(fbz,next)};
}

/* trois sources, une semaine : ce que chacune dit, et à quelle question elle répond */
const COL_Q=[
  ['À quelle heure le site démarre-t-il le matin ?',['courbe'],"Seule la courbe voit les heures. L'index et la facture ne connaissent que des totaux."],
  ['Combien d’énergie a été consommée cette semaine ?',['courbe','index'],"La courbe et l'index le disent tous les deux, et ils doivent dire la même chose : c'est comme ça qu'on se contrôle."],
  ['Combien a coûté le mois dernier ?',['facture'],"Seule la facture parle en euros : taxes, abonnement, acheminement. Une courbe multipliée par un prix, c'est une estimation, pas une facture."]
];
function sourcesStep(el,next){
  const s=site(),c=weekCurve(s.id),E=Math.round(c.reduce((a,v)=>a+v*.5,0)),i0=s.id==='bureau'?482317:s.id==='ecole'?215604:96412,i1=i0+E;
  const jours=Math.round(E*30/7/10)*10,euros=Math.round((jours*EN_PE*1.25+(s.souscrit*13.5/12))/10)*10;
  let etape=0,essais=0;
  el.innerHTML=`<div class="ems">${emsBarre('trois sources, une semaine')}
    <p>Les données arrivent. Même énergie, trois formes. Regarde ce que chacune dit de la même semaine.</p>
    <div class="ems-sources">
      <div class="ems-src"><b>Courbe de charge</b><small>pas de ${s.souscrit>36?'10':'30'} min</small><canvas width="300" height="110" aria-label="Courbe de la semaine"></canvas></div>
      <div class="ems-src"><b>Index</b><small>le totalisateur du compteur</small><p class="num">lundi 0 h : ${emsKwh(i0)} kWh<br>lundi suivant 0 h : ${emsKwh(i1)} kWh</p></div>
      <div class="ems-src"><b>Facture</b><small>du fournisseur, chaque mois</small><p class="num">30 jours · ${emsKwh(jours)} kWh<br>${fmt(euros)} € TTC</p></div></div>
    <div class="ems-diag" aria-live="polite"></div></div>`;
  const cv=el.querySelector('canvas'),x=cv.getContext('2d'),mx=Math.max(...c);
  x.fillStyle='#fffaf0';x.fillRect(0,0,300,110);x.strokeStyle='#2aa198';x.lineWidth=1.5;x.beginPath();c.forEach((v,i)=>{const px=4+292*i/c.length,py=104-v/mx*96;i?x.lineTo(px,py):x.moveTo(px,py)});x.stroke();
  const diag=el.querySelector('.ems-diag');
  /* 1. l'index : la semaine, c'est la différence */
  diag.innerHTML=`<div class="field"><label for="colIdx">D'après l'index, combien de kWh cette semaine ?</label><input id="colIdx" inputmode="numeric" autocomplete="off"><small class="m"></small></div><button class="btn" type="button" id="colIv">Vérifier ▸</button><div class="fbz"></div>`;
  const fbz=()=>diag.querySelector('.fbz');
  diag.querySelector('#colIv').onclick=()=>{const v=emsNombre(diag.querySelector('#colIdx').value);
    if(v!==null&&Math.abs(v-E)<=1){diag.querySelector('#colIv').remove();diag.querySelector('input').disabled=true;
      fbz().innerHTML=`<div class="fb ok">✔ ${emsKwh(E)} kWh : la fin moins le début. Et la courbe, en additionnant ses ${c.length} demi-heures, dit <b>${emsKwh(E)} kWh</b> aussi. Deux sources qui se contrôlent : si un jour elles divergent, l'une des deux ment.</div>`;contBtn(fbz(),questions,'Et pour le reste ?');return}
    essais++;emsRate('Index : énergie de la semaine',v);
    fbz().innerHTML=`<div class="fb ko">✘ ${v===null?'Tape un nombre.':Math.abs(v-i1)<2||Math.abs(v-i0)<2?'Ça, c’est le compteur depuis sa pose. Ton bâtiment n’a pas consommé tout ça cette semaine, rassure-toi.':Math.abs(v-(i0+i1))<3?'Tu as additionné les deux index. Un index se soustrait : c’est un compteur kilométrique, pas une tirelire.':'Un index, c’est un compteur kilométrique : le trajet, c’est l’arrivée moins le départ.'} ${essais>=2?revoirFiche():''}</div>`};
  /* 2. quelle source répond à quelle question ? (on peut en cocher plusieurs) */
  const questions=()=>{
    const q=COL_Q[etape],choix={};
    diag.innerHTML=`<p><b>${esc(q[0])}</b> <small class="dnote">(${etape+1}/${COL_Q.length} · touche la ou les sources qui y répondent)</small></p><div class="ems-chips">${['courbe','index','facture'].map(k=>`<button type="button" class="ems-zone" aria-pressed="false" data-k="${k}">${k==='courbe'?'Courbe de charge':k==='index'?'Index':'Facture'}</button>`).join('')}</div><button class="btn" type="button" id="colQv">Valider ▸</button><div class="fbz"></div>`;
    diag.querySelectorAll('.ems-zone').forEach(b=>b.onclick=()=>{choix[b.dataset.k]=!choix[b.dataset.k];b.setAttribute('aria-pressed',String(!!choix[b.dataset.k]))});
    diag.querySelector('#colQv').onclick=()=>{const pris=['courbe','index','facture'].filter(k=>choix[k]),juste=pris.join()===q[1].join();
      if(!juste){essais++;emsRate(q[0],pris.join('+')||'rien');
        const manque=q[1].filter(k=>!choix[k]),trop=pris.filter(k=>!q[1].includes(k));
        fbz().innerHTML=`<div class="fb ko">✘ ${trop.length?`${trop.map(k=>k==='courbe'?'La courbe':k==='index'?"L'index":'La facture').join(' et ')} ne ${trop.length>1?'peuvent':'peut'} pas répondre à ça. `:''}${manque.length?`Il manque une source qui y répond aussi. `:''}${essais>=3?revoirFiche():''}</div>`;return}
      diag.querySelectorAll('.ems-zone').forEach(b=>b.disabled=true);diag.querySelector('#colQv').remove();
      fbz().innerHTML=`<div class="fb ok">✔ ${esc(q[2])}</div>`;
      etape++;if(etape<COL_Q.length)return contBtn(fbz(),questions,'Question suivante');
      emsSet('sources',1);fbz().insertAdjacentHTML('beforeend',emsTransfert('les trois sources sont rangées côte à côte : la courbe pour analyser, l’index pour contrôler, la facture pour chiffrer. Un écart entre elles n’est pas un détail : c’est souvent la première alerte.'));
      gainXP(essais?5:20);contBtn(fbz(),next)};
  };
}
