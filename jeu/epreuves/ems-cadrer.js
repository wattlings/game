/* Wattlings · jeu/epreuves/ems-cadrer.js
   Étape 1 · Cadrer, l'atelier : créer son site dans l'EMS du bureau avec ce que le carnet contient, tracer le périmètre
   sur le plan, puis choisir l'objectif. L'objectif choisi décide de l'indicateur suivi jusqu'à l'étape Mesurer (ems-mesurer.js).

   Pour changer le plan d'un site : CAD_ZONES (ce qu'on voit sur le plan, dedans ou dehors, et pourquoi). */

const CAD_ZONES={
  ecole:[
    ['Les salles de classe',1,"Le cœur du site. Sans elles, tu suis une cour de récré."],
    ['La cantine',1,"Même bâtiment, même compteur. Elle a un sous-compteur, mais elle reste dans le site."],
    ['L’éclairage de la cour',1,"Il est branché sur le compteur de l'école : il est dans le périmètre, qu'on le veuille ou non."],
    ['Le logement de fonction du gardien',0,"Il a son propre contrat et paie sa facture. L'ajouter, c'est compter ses soirées télé dans les kWh/m² de l'école."],
    ['Le gymnase municipal, de l’autre côté de la rue',0,"Un autre site du patrimoine, avec son propre compteur et ses propres problèmes."],
    ['Les lampadaires de la rue',0,"Éclairage public : c'est le réseau de la ville, pas ton compteur."]],
  bureau:[
    ['Les plateaux de bureaux',1,"Le cœur du site. Sans eux, tu suis une cage d'escalier."],
    ['La salle serveurs',1,"Même compteur. Elle a un sous-compteur, mais elle reste dans le site, et c'est même elle qui ne dort jamais."],
    ['Le parking souterrain',1,"Sa ventilation et son éclairage passent par le compteur de l'immeuble. L'exclure, c'est inventer une énergie fantôme."],
    ['Le restaurant du rez-de-chaussée, loué à un traiteur',0,"Un locataire avec son propre compteur et son propre contrat. Ses frites ne sont pas tes kWh."],
    ['La borne de recharge publique, sur le trottoir',0,"Elle appartient à l'opérateur de la borne, qui a son propre raccordement."],
    ['L’antenne de téléphonie, sur le toit',0,"L'opérateur télécom a son compteur à lui. Il paie même un loyer pour être là."]],
  boulangerie:[
    ['Le fournil',1,"Le cœur du site : le four, le pétrin, la chambre de pousse."],
    ['La boutique',1,"Même compteur, même site. Les vitrines réfrigérées comprises."],
    ['L’enseigne lumineuse',1,"Elle est branchée sur le compteur de la boutique : dedans. Et allumée toute la nuit, on en reparlera."],
    ['L’appartement du boulanger, à l’étage',0,"Compteur à part, vie privée à part. Le four, oui. La douche du boulanger, non."],
    ['La terrasse du café voisin',0,"Un autre commerce, un autre compteur. Même si ses clients mangent tes croissants."],
    ['Le lampadaire devant la vitrine',0,"Éclairage public : c'est le réseau de la ville, pas ton compteur."]]
};
/* les trois objectifs et l'indicateur qui les suit jusqu'à l'étape Mesurer */
const CAD_OBJ={
  facture:{t:'Baisser la facture',ind:'les euros économisés par an',u:'€'},
  decret:{t:'Respecter le décret tertiaire',ind:'les kWh/m² par rapport à l’année de référence (−40 % en 2030)',u:'kWh/m²'},
  co2:{t:'Réduire le CO₂',ind:'les tonnes de CO₂ évitées par an',u:'tCO₂e'}
};
const emsObjectif=()=>emsGet('objectif')||(assujetti(site())?'decret':'facture');

/* 1. créer le site : on tape ce que l'on a relevé (le carnet est là), l'EMS en déduit la localisation */
function ficheEmsStep(el,next){
  const s=site(),n=S.notes||{},acts=shuffle([s.activite,...others('activite'),'Logement collectif']);let essais=0;
  el.innerHTML=`<div class="ems">${emsBarre('nouveau site')}
    <p>L'EMS du bureau attend ton site. Il croira tout ce que tu tapes : c'est précisément le problème. Recopie ce que tu as relevé dehors.</p>${emsCarnet()}
    <div class="ff"><div class="field"><label for="cadAd">Adresse</label><input id="cadAd" autocomplete="off" placeholder="numéro, rue, code postal"><small class="m"></small></div>
    <div class="field"><label for="cadSu">Surface de référence (m²)</label><input id="cadSu" inputmode="numeric" autocomplete="off"><small class="m"></small></div>
    <div class="field"><label for="cadAc">Activité (liste de l'EMS)</label><select id="cadAc"><option value="">— choisir —</option>${acts.map(a=>`<option>${esc(a)}</option>`).join('')}</select><small class="m"></small></div></div>
    <button class="btn" type="button" id="cadOk">Créer le site ▸</button><div class="fbz" aria-live="polite"></div></div>`;
  const f=id=>el.querySelector('#'+id),m=id=>f(id).parentNode.querySelector('.m'),fbz=el.querySelector('.fbz');
  const norme=t=>String(t).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/[^a-z0-9]/g,'');
  f('cadOk').onclick=()=>{let bad=[];
    const ad=norme(f('cadAd').value),num=s.addr.match(/^\d+/)[0],rue=norme(s.addr.replace(/^\d+\s*/,''));
    const okAd=ad.startsWith(num)&&ad.includes(rue.replace(/^(rue|place)/,'')),su=emsNombre(f('cadSu').value),ac=f('cadAc').value;
    m('cadAd').textContent=okAd?'✔ Adresse reconnue.':!ad?'✘ Un site sans adresse, c’est une station météo au hasard.':others('addr').some(a=>ad.startsWith(norme(a)))?'✘ C’est l’adresse d’un autre site de la ville. Ton carnet dit autre chose.':'✘ Le facteur s’en sortira peut-être. La station météo, jamais. Relis ton carnet.';
    m('cadSu').textContent=su===s.surface?'✔':su===null?'✘ Un site sans surface, c’est un ratio divisé par zéro. L’EMS refuse, et il a raison.':su===s.surface*10||su*10===s.surface?'✘ Il y a un zéro qui se promène. Relis ta fiche technique.':'✘ Ce n’est pas la surface de la fiche technique. L’EMS l’aurait gobée, et tous tes kWh/m² avec.';
    m('cadAc').textContent=ac===s.activite?'✔':!ac?'✘ Choisis une activité.':'✘ Ce n’est pas l’activité de ton site. Et c’est elle qui dira à quoi te comparer.';
    if(!okAd)bad.push('adresse');if(su!==s.surface)bad.push('surface');if(ac!==s.activite)bad.push('activité');
    if(bad.length){essais++;emsRate('Créer le site dans l’EMS',bad.join(', '));fbz.innerHTML=`<div class="fb ko">✘ ${bad.length} champ${bad.length>1?'s':''} à corriger. ${essais>=2?revoirFiche():''}</div>`;return}
    el.querySelectorAll('input,select').forEach(i=>i.disabled=true);f('cadOk').remove();
    fbz.innerHTML=`<div class="fb ok">✔ Site créé. L'EMS déduit de l'adresse la localisation : <b>Ampère-sur-Loire (45), zone climatique H1, station météo Orléans-Bricy</b>. C'est elle qui fournira les DJU pour corriger la consommation de l'hiver.</div>${emsTransfert('la fiche du site (adresse, surface, activité) est la base de tout le reste : ratios, comparaison entre sites, correction météo. Une surface fausse, et tous les kWh/m² sont faux, sans que personne ne s’en aperçoive.')}`;
    gainXP(essais?5:20);contBtn(fbz,next)};
}

/* 2. le périmètre : sur le plan, on décide ce qu'on suit. Le reste, on l'ignore poliment. */
function perimetreStep(el,next){
  const s=site(),Z=shuffle(CAD_ZONES[s.id]||CAD_ZONES.ecole),dedans={};let essais=0;
  el.innerHTML=`<div class="ems">${emsBarre('périmètre')}
    <p>Le plan du quartier autour ${esc(enDe(s))}. <b>Touche ce qui fait partie du site que tu suis.</b> Touche encore pour l'en sortir.</p>
    <div class="ems-plan" role="group" aria-label="Plan du site">${Z.map((z,i)=>`<button type="button" class="ems-zone" aria-pressed="false" data-i="${i}">${esc(z[0])}<small></small></button>`).join('')}</div>
    <button class="btn" type="button" id="perOk">Valider le périmètre ▸</button><div class="fbz" aria-live="polite"></div></div>`;
  const zs=[...el.querySelectorAll('.ems-zone')],fbz=el.querySelector('.fbz');
  zs.forEach(b=>b.onclick=()=>{const i=b.dataset.i;dedans[i]=!dedans[i];b.setAttribute('aria-pressed',dedans[i]?'true':'false');b.classList.remove('badc');b.querySelector('small').textContent=''});
  el.querySelector('#perOk').onclick=()=>{let bad=0;
    zs.forEach(b=>{const z=Z[b.dataset.i],faux=!!dedans[b.dataset.i]!==!!z[1];b.classList.toggle('badc',faux);b.querySelector('small').textContent=faux?z[2]:''});
    bad=zs.filter(b=>b.classList.contains('badc')).length;
    if(bad){essais++;emsRate('Tracer le périmètre',zs.filter(b=>b.classList.contains('badc')).map(b=>Z[b.dataset.i][0]).join(' | '));fbz.innerHTML=`<div class="fb ko">✘ ${bad} zone${bad>1?'s':''} mal placée${bad>1?'s':''} (en rouge, avec la raison). ${essais>=2?revoirFiche():''}</div>`;return}
    zs.forEach(b=>{b.disabled=true;b.classList.add(dedans[b.dataset.i]?'good':'hors');b.querySelector('small').textContent=Z[b.dataset.i][2]});el.querySelector('#perOk').remove();
    fbz.innerHTML=`<div class="fb ok">✔ Périmètre tracé : ${Z.filter(z=>z[1]).length} zones suivies, ${Z.filter(z=>!z[1]).length} ignorées poliment.</div>${emsTransfert('le périmètre suit les compteurs, pas les murs. Ce qui passe par ton compteur est dans ton site, ce qui a son propre compteur n’y est pas. Un périmètre flou, et deux sites se disputent les mêmes kWh.')}`;
    gainXP(essais?5:20);contBtn(fbz,next)};
}

/* 3. l'objectif : une décision, pas une bonne réponse. Elle se retrouve à l'étape Mesurer. */
function objectifStep(el,next){
  const s=site(),a=assujetti(s);
  el.innerHTML=`<div class="ems">${emsBarre('objectif')}
    <p>Dernière case de la fiche : <b>pourquoi suis-tu ce site ?</b> L'indicateur que tu choisis maintenant te suivra jusqu'à l'arène de la Preuve. Choisis bien : on te demandera des comptes.</p>
    <div class="opts ems-obj">${Object.entries(CAD_OBJ).map(([k,o])=>`<button type="button" class="opt" data-k="${k}"><b>${esc(o.t)}</b><small>Indicateur suivi : ${esc(o.ind)}</small></button>`).join('')}</div>
    <div class="fbz" aria-live="polite"></div></div>`;
  const fbz=el.querySelector('.fbz');
  el.querySelectorAll('.ems-obj .opt').forEach(b=>b.onclick=()=>{const k=b.dataset.k;
    if(k==='decret'&&!a){emsRate('Choisir l’objectif','décret, site non assujetti');fbz.innerHTML=`<div class="fb ko">✘ ${fmt(s.surface)} m² : le décret tertiaire ne sait même pas que ton site existe (il commence à 1 000 m²). Choisis un objectif qui te concerne.</div>`;return}
    el.querySelectorAll('.ems-obj .opt').forEach(x=>{x.disabled=true;x.classList.toggle('good',x===b)});emsSet('objectif',k);trk('setting',{k:'objectif',v:k});
    const mot={facture:`Va pour la facture. Le directeur financier t'a déjà ajouté à ses favoris.${a?" Le décret tertiaire, lui, reste une obligation : il sera suivi quand même, en tâche de fond.":''}`,
      decret:'Va pour le décret. L’objectif est fixé par la loi, l’indicateur aussi : les kWh/m², corrigés de la météo, par rapport à ton année de référence.',
      co2:`Va pour le CO₂. Attention : ${s.gaz>s.elec*.5?'ton gaz pèse lourd. Un kWh de gaz émet environ quatre fois plus qu’un kWh électrique en France.':'chaque kWh n’a pas le même poids : le gaz émet environ quatre fois plus que l’électricité française.'}${a?' Le décret tertiaire reste une obligation : il sera suivi quand même.':''}`}[k];
    fbz.innerHTML=`<div class="fb ok">✔ ${mot}</div>${emsTransfert('l’objectif décide de ce que l’outil affiche en premier (euros, kWh/m² ou CO₂). Le même plan d’action peut briller sur un indicateur et décevoir sur un autre : on le choisit avant, pas après, sinon on choisit celui qui arrange.')}`;
    gainXP(20);contBtn(fbz,next)});
}
