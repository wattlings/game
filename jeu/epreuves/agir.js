/* Wattlings · jeu/epreuves/agir.js
   Étape 7 · Agir : composer le plan d'action sous budget. */

/* ---- étape Agir : le plan d'action se compose avec le fonds de travaux, et se compte en kWh ---- */
function planStep(el,next){
  enSync();const e=EN(),f=enFonds(),base=['consigne','veilles','reduit'],goal=Math.round(enYear(S.site,base).kwh*.9/100)*100;let tries=0;
  el.innerHTML=`<h3>Compose ton plan d'action</h3><div class="ctx">Fonds de travaux : <b class="num">${fmt(f)} €</b> pour démarrer. Objectif : au moins <b class="num">${fmtKwh(goal)}</b> économisés par an. Ensuite, chaque euro économisé reviendra dans le fonds. <i>Valeurs fictives.</i></div><div class="opts" id="acts"></div><div class="ctx" id="tot" aria-live="polite"></div><button class="btn" id="pv">Valider le plan ▸</button><div class="fbz"></div>`;
  const box=el.querySelector('#acts'),tot=el.querySelector('#tot'),fbz=el.querySelector('.fbz');
  enActs(S.site).forEach(a=>{const g=enGain(a.id),c=enCost(a),l=document.createElement('label');l.className='chk';l.innerHTML=`<input type="checkbox" id="act_${a.id}" value="${a.id}"><span><span class="tag">${a.cat}</span> ${a.t}<small>${a.zero?'<b>0 kWh</b> · '+fmt(g.eur)+' € par an':a.prod?'<b>0 kWh économisé</b> · '+fmtKwh(g.prod)+' produits par an':'<b>'+fmtKwh(g.kwh)+'</b> par an'} · ${c?fmt(c)+' €':'gratuit'}${c&&g.eur?' · retour '+String(Math.round(c/g.eur*10)/10).replace('.',',')+' ans':''}</small></span>`;box.appendChild(l)});
  const calc=()=>{const sel=enActs(S.site).filter(a=>el.querySelector('#act_'+a.id).checked),ids=sel.map(a=>a.id).sort(),c=sel.reduce((s,a)=>s+enCost(a),0),y=enYear(S.site,ids);
    tot.innerHTML=`Économies : <b class="num">${fmtKwh(Math.round(y.kwh/10)*10)}</b> par an · Coût : <b class="num" style="color:${c>f?'var(--bad)':'inherit'}">${fmt(c)} €</b> / ${fmt(f)} € · Fonds alimenté de <b class="num">${fmt(Math.round(y.eur/10)*10)} €</b> par an`;return{c,k:y.kwh,sel,ids}};
  box.onchange=calc;calc();
  el.querySelector('#pv').onclick=ev=>{const {c,k,sel,ids}=calc(),sob=sel.filter(a=>a.cat==='Sobriété').length,ko=m=>{tries++;trk('wrong_answer',{t:panelTitle(),q:trkTxt('Plan d’action').slice(0,100),a:trkTxt(m).slice(0,80)});sfx('bad')};
    if(c>f){ko('budget dépassé');fbz.innerHTML='<div class="fb ko">✘ Le fonds ne suffit pas. Les gros travaux attendront : commence par ce qui ne coûte presque rien. Les économies rempliront le fonds, et tu pourras les lancer plus tard depuis ton tableau de bord.</div>';return}
    if(k<goal){ko('économies insuffisantes');fbz.innerHTML=`<div class="fb ko">✘ Seulement ${fmtKwh(Math.round(k/10)*10)} par an : il manque ${fmtKwh(Math.round((goal-k)/10)*10)}. As-tu pris toutes les actions de sobriété ? La puissance souscrite, elle, n'économise aucun kWh.</div>`;return}
    ev.target.remove();box.querySelectorAll('input').forEach(i=>i.disabled=true);enBuy(ids);
    fbz.innerHTML=`<div class="fb ok">✔ Plan lancé : ${fmtKwh(Math.round(k/10)*10)} par an pour ${fmt(c)} €. ${sob===3?'Toute la sobriété est dedans : c\'est la base.':'Astuce : la sobriété, presque gratuite, passe toujours en premier.'} Regarde le compteur en haut de l'écran : il vient de démarrer. Isoler un bâtiment qu'on chauffe le week-end, c'est payer des travaux pour chauffer du vide.</div>`;gainXP(tries?5:20);contBtn(fbz,next)};
}

/* ================= AGIR ================= */
/* le plan d'action (planStep) est dans m_energie.js : il se compose avec le fonds de travaux et se compte en kWh */
function gameAgir(done){
  runSteps('Arène du Chantier · Plan d’action',[
    info(`<h3>Trois marches</h3><p>Pour un foyer : d'abord on éteint les lumières et on baisse le chauffage, ensuite on renégocie ses abonnements, enfin, si ça vaut le coup, on isole la maison. Pour un bâtiment, c'est pareil. Chaque marche coûte plus cher et prend plus de temps.</p>`),
    order({q:'Dans quel ordre agir ?',items:['Sobriété','Efficacité','Production'],okMsg:'On réduit d\'abord le besoin (souvent gratuit), puis on consomme mieux, puis on produit.'}),
    planStep,
    choice({q:'Deux actions de 10 % chacune sur le chauffage donnent au total…',opts:[['19 %',1,'La seconde s\'applique à ce qui reste : 1 − 0,9 × 0,9 = 19 %.'],['20 %',0,'Les pourcentages se multiplient, ils ne s\'additionnent pas.'],['10 %',0,'La seconde action compte aussi.']]}),
    choice({q:'Un investissement de 30 000 € économise 2 500 € par an. Temps de retour simple ?',opts:[['12 ans',1,'30 000 / 2 500 = 12 ans. C\'est un premier filtre : il ignore la hausse des prix, la durée de vie et les aides (CEE).'],['8 ans',0,'Refais la division.'],['75 ans',0,'On divise l\'investissement par l\'économie annuelle.']]}),
    choice({q:'Baisser la puissance souscrite réduit surtout…',opts:[['La part fixe de l\'acheminement (et la CTA)',1,'Elle agit sur la part fixe, pas sur les kWh consommés.'],['Les kWh consommés',0,'La puissance souscrite ne change pas les kWh.'],['L\'abonnement du fournisseur',0,'Celui-là ne bouge pas.']]})
  ],done);
}
