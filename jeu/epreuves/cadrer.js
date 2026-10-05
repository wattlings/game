/* Wattlings · jeu/epreuves/cadrer.js
   Étape 1 · Cadrer : repérage du site, compteurs, fiche patrimoine et plan de comptage. */

function actMailbox(id){
  const s=SITES[id];
  if(id!==S.site)return say([{t:`Boîte aux lettres : ${s.name}, ${s.addr}. Ce n'est pas ton site.`}]);
  if(S.ch<1)return;
  if(S.notes.adresse)return say([{t:`${s.name} · ${s.addr}, ${s.cp}. C'est noté dans ton carnet.`}]);
  S.notes.adresse=`${s.addr}, ${s.cp}`;save();gainXP(10);
  say([{t:`Sur la boîte aux lettres : « ${s.name} · ${s.addr} · ${s.cp} ».`},{t:"Adresse notée dans ton carnet ! L'adresse donne la localisation : la commune, donc la station météo et la zone climatique. Elle servira à corriger la consommation de la météo."}],checkCh1);
}
function actPanel(id){
  const s=SITES[id],txt=`FICHE TECHNIQUE · ${s.name} · Activité : ${s.activite} · Surface de plancher : ${fmt(s.surface)} m² · Construit en ${s.annee} · Occupants : ${s.occ}.`;
  if(id!==S.site||S.ch<1)return say([{t:txt}]);
  if(S.notes.surface)return say([{t:txt}]);
  S.notes.surface=s.surface;S.notes.activite=s.activite;save();gainXP(10);
  say([{t:txt},{t:"Surface et activité notées ! La surface sert aux ratios (kWh/m²) et à savoir si le décret tertiaire s'applique."}],checkCh1);
}
function checkCh1(){if(S.ch!==1||!S.notes.adresse||!S.notes.surface)return;
  if(missingReq(1).length)return say([{t:"Adresse et surface notées. Mais il te manque encore des notions pour cadrer ton site."},...missingLines(1)]);
  S.ch=2;save();hud();say([{t:"Repérage terminé : adresse, surface et activité sont dans ton carnet."},{w:'Mme Joule',t:"(au téléphone) Bien ! Maintenant, entre dans le bâtiment et trouve les compteurs. Ensuite, direction l'Arène du Cadastre, au sud."}])}
function others(key){return Object.values(SITES).filter(x=>x.id!==S.site).map(x=>x[key])}
function gamePatrimoine(done){
  const s=site();
  runSteps('Arène du Cadastre · Fiche patrimoine',[
    info(`<h3>Du patrimoine au point de comptage</h3><p>Un energy manager suit des objets emboîtés :</p><div class="ctx"><b>Patrimoine</b> (tous les sites d'un propriétaire) → <b>Site</b> (${esc(s.name)}) → <b>Bâtiment</b> → <b>Points de comptage</b> (un par énergie livrée).</div><p>Tout ce que le logiciel affichera ensuite sera rattaché à l'un de ces objets. Remplis la fiche de ton site avec ce que tu as trouvé dehors.</p>`),
    form({title:'Fiche patrimoine',fields:[
      {label:'Adresse du site',opts:[[`${s.addr}, ${s.cp}`,1,'Lue sur la boîte aux lettres.'],...others('addr').map(a=>[`${a}, 45100 Ampère-sur-Loire`,0,"C'est l'adresse d'un autre site de la ville."])]},
      {label:'Localisation',opts:[['Ampère-sur-Loire (45) · zone climatique H1 · météo Orléans-Bricy',1,'La commune donne la station météo de référence.'],['Ampère-sur-Loire (45) · zone climatique H3',0,'H3 correspond au pourtour méditerranéen.'],['Siège du fournisseur d\'énergie, à Paris',0,'On localise le bâtiment, pas le fournisseur.']]},
      {label:'Activité',opts:[[s.activite,1],...others('activite').map(a=>[a,0,"Ce n'est pas l'activité de ton site."])]},
      {label:'Surface de référence',opts:[[`${fmt(s.surface)} m²`,1,'Lue sur la fiche technique.'],[`${fmt(s.surface/10)} m²`,0,'Relis la fiche technique : il manque un zéro.'],[`${fmt(s.surface*10)} m²`,0,'Relis la fiche technique : un zéro de trop.']]}
    ],okMsg:'Fiche patrimoine complète : adresse, localisation, activité, surface.'}),
    choice({q:'Pourquoi la localisation est-elle importante pour un energy manager ?',opts:[
      ['Elle donne la météo locale (DJU), pour corriger la consommation de chauffage du climat',1,'Un hiver doux fait baisser le chauffage sans que personne n\'ait rien fait. Sans météo locale, impossible de comparer deux années.'],
      ['Elle sert uniquement à envoyer les factures',0,'La facture utilise l\'adresse, mais l\'energy manager s\'en sert surtout pour la météo.'],
      ['Elle détermine le prix du kWh',0,'Le prix dépend du contrat, pas de la commune.']]}),
    choice({title:'Décret tertiaire',ctx:`Le décret tertiaire (dispositif Éco Énergie Tertiaire) vise les bâtiments accueillant des activités tertiaires sur <b>au moins 1 000 m²</b> (surfaces cumulées sur le site). Ton site : <span class="num">${fmt(s.surface)} m²</span>.`,q:'Ton site est-il concerné ?',opts:[
      ['Oui, il a au moins 1 000 m² de surface tertiaire',assujetti(s),assujetti(s)?'Il devra réduire sa consommation (−40 % en 2030) et la déclarer chaque année sur OPERAT.':`${fmt(s.surface)} m², c'est sous le seuil.`],
      ['Non, il fait moins de 1 000 m²',!assujetti(s),!assujetti(s)?'Pas d\'obligation réglementaire, mais le suivi reste utile pour la facture et le climat.':`${fmt(s.surface)} m², c'est au-dessus du seuil.`],
      ['Oui, tous les bâtiments de France sont concernés',0,'Le décret ne vise que le tertiaire, à partir de 1 000 m².']]})
  ],()=>say([{w:'Mme Périmètre',t:"Fiche patrimoine complète. Deuxième manche : ton plan de comptage."}],done));
}
function actElec(){
  const s=site();
  if(S.ch<2)return say([{t:'Un coffret électrique.'}]);
  if(!S.flags.elec&&gate(2))return;
  if(S.flags.elec)return say([{t:`Compteur électrique. PDL ${s.pdl}, ${s.kva} kVA souscrits à l'origine.`}]);
  const other=others('pdl')[0];
  runSteps('Jeu 2 · Plan de comptage : électricité',[
    withArt('elec',choice({ctx:`Tu ouvres le coffret encastré dans le mur. Plusieurs étiquettes sont collées sur le compteur, sans légende :<br>${[s.pdl,s.serie,s.pdl.slice(0,13),s.pdl+'1'].map(n=>`<span class="sticker">${n}</span>`).join('')}`,q:'Lequel est le PDL (Point De Livraison, appelé PRM chez Enedis) ?',opts:[
      [`<span class="mono">${s.pdl}</span>`,1,'14 chiffres : c\'est le PDL. Il identifie le point de raccordement au réseau.'],
      [`<span class="mono">${s.serie}</span>`,0,'12 chiffres : c\'est le numéro de série du compteur. Il désigne l\'appareil, pas le point.'],
      [`<span class="mono">${s.pdl.slice(0,13)}</span>`,0,'13 chiffres : il en manque un. Un PDL en compte exactement 14.'],
      [`<span class="mono">${s.pdl}1</span>`,0,'15 chiffres : un de trop.'],
      [`<span class="mono">${s.pdl.slice(0,2)}-${s.pdl.slice(2,6)}-${s.pdl.slice(6,10)}-${s.pdl.slice(10,12)}</span>`,0,'Tirets et seulement 12 chiffres : ce n\'est pas un format de PDL.']]})),
    choice({q:'Demain, Enedis remplace ce compteur par un neuf. Que devient le PDL ?',opts:[
      ['Il reste le même : il désigne le raccordement, pas l\'appareil',1,'Seul le numéro de série change. Le logiciel doit donc distinguer « point de comptage » et « compteur ».'],
      ['Il change, comme le numéro du compteur',0,'Le PDL est attaché au raccordement.'],
      ['Il est supprimé jusqu\'à la prochaine facture',0,'Le point de livraison ne disparaît pas.']]}),
    choice({ctx:`Puissance souscrite de ton site : <span class="num">${s.souscrit} kVA</span>.`,q:'Quel type de compteur et quel pas de temps ?',opts:[
      ['Compteur Linky, courbe de charge au pas de 30 minutes',s.souscrit<=36,s.souscrit<=36?'Jusqu\'à 36 kVA (segment C5), c\'est un Linky. Pas de 30 minutes.':'Linky, c\'est jusqu\'à 36 kVA.'],
      ['Compteur professionnel télérelevé, courbe au pas de 10 minutes',s.souscrit>36,s.souscrit>36?'Au-delà de 36 kVA (segments C1 à C4), compteur pro télérelevé, courbe plus fine.':'Au-delà de 36 kVA seulement.'],
      ['Un compteur à relever à la main une fois par an',0,'Les compteurs communicants sont télérelevés.']]})
  ],()=>{S.flags.elec=true;S.notes.pdl=s.pdl;save();hud();say([{t:`Compteur électrique identifié : PDL ${s.pdl}.`}],checkCh2)});
}
function actGas(){
  const s=site();
  if(S.ch<2)return say([{t:'Un compteur gaz.'}]);
  if(!S.flags.gas&&gate(2))return;
  if(S.flags.gas)return say([{t:`Compteur gaz Gazpar. PCE ${s.pce}.`}]);
  runSteps('Jeu 2 · Plan de comptage : gaz',[
    withArt('gas',choice({gas:1,ctx:`À la cave, un compteur Gazpar jaune. Sur la plaque et les étiquettes :<br>${[s.gazSerie,s.pce,'41 940 m³',s.pce.slice(0,7)].map(n=>`<span class="sticker">${n}</span>`).join('')}`,q:'Lequel est le PCE (Point de Comptage et d\'Estimation) ?',opts:[
      [`<span class="mono">${s.pce}</span>`,1,'« GI » suivi de 6 chiffres : c\'est un format de PCE (on trouve aussi des PCE à 14 chiffres).'],
      [`<span class="mono">${s.pce.slice(0,7)}</span>`,0,'Seulement 5 chiffres après GI : il en faut 6.'],
      [`<span class="mono">G1${s.pce.slice(2)}</span>`,0,'Regarde bien : c\'est un 1, pas un I.'],
      ['<span class="mono">41 940 m³</span>',0,'C\'est l\'index : le totalisateur du compteur, en m³.'],
      [`<span class="mono">${s.gazSerie}</span>`,0,'C\'est le numéro de série du Gazpar : l\'appareil, pas le point.']]})),
    choice({gas:1,q:'Que mesure ce compteur gaz ?',opts:[
      ['Un volume en m³, converti en kWh avec un coefficient de conversion',1,'kWh = m³ × coefficient (en général entre 10 et 11,5 kWh/m³, variable selon la commune et le mois).'],
      ['Directement des kWh',0,'Le compteur mesure un volume.'],
      ['Une puissance en kW',0,'Gazpar transmet un volume par jour.']]}),
    choice({gas:1,ctx:'En janvier : <span class="num">4 000 m³</span>, coefficient <span class="num">11,2 kWh/m³</span>.',q:'Combien de kWh ?',opts:[['44 800 kWh',1,'4 000 × 11,2 = 44 800 kWh.'],['4 000 kWh',0,'Il faut convertir les m³.'],['357 kWh',0,'On multiplie, on ne divise pas.']]})
  ],()=>{S.flags.gas=true;S.notes.pce=s.pce;save();hud();say([{t:`Compteur gaz identifié : PCE ${s.pce}.`}],checkCh2)});
}
function actSub(){
  const s=site();
  if(S.ch<2||S.flags.sub)return say([{t:`${s.sub}. Il mesure une partie de ce que mesure déjà le compteur principal.`}]);
  runSteps('Bonus · Sous-compteur',[
    choice({ctx:`Tu trouves un petit compteur : « ${s.sub} ». Il mesure uniquement ${s.subShort}.`,q:'Le compteur principal indique 80 MWh sur l\'année, ce sous-compteur 10 MWh. Quelle est la consommation électrique du site ?',opts:[
      ['80 MWh',1,`${s.subShort[0].toUpperCase()+s.subShort.slice(1)} est déjà comptée dans le principal. Un sous-compteur est un « enfant » du compteur principal.`],['90 MWh',0,'Tu comptes deux fois la même énergie.'],['70 MWh',0,'Le principal mesure déjà tout le site.']]})
  ],()=>{S.flags.sub=true;save();say([{t:'Sous-compteur ajouté au plan de comptage.'}])});
}
function checkCh2(){
  if(S.ch!==2||!S.flags.elec||!S.flags.gas||S.flags.cad)return;
  if(missingReq(2).length)return say([{t:"Les deux compteurs sont relevés. Mais il te manque encore des notions avant l'arène."},...missingLines(2)]);
  S.flags.cad=1;save();hud();say([{t:"Compteurs relevés, notions en poche : tu es prêt pour l'Arène du Cadastre, au Puy du Cadastre, au nord de la place de la Donnée."}]);
}
function gamePlan(done){
  const s=site();
  runSteps('Arène du Cadastre · Plan de comptage',[
    info(`<h3>Plan de comptage de ${esc(s.name)}</h3><div class="tbl"><table><tr><th>Objet</th><th>Identifiant</th><th>Rôle</th></tr>
      <tr><td>Site</td><td>${esc(s.addr)}</td><td>${fmt(s.surface)} m², ${esc(s.activite)}</td></tr>
      <tr><td>Point de comptage élec</td><td class="num">PDL ${s.pdl}</td><td>Enedis · ${s.souscrit} kVA</td></tr>
      <tr><td>↳ compteur</td><td class="num">n° ${s.serie}</td><td>${s.souscrit>36?'Compteur pro télérelevé':'Linky'}</td></tr>
      ${S.flags.sub?`<tr><td>↳ sous-compteur</td><td>${esc(s.subShort)}</td><td>Partie du principal</td></tr>`:''}
      <tr><td>Point de comptage gaz</td><td class="num">PCE ${s.pce}</td><td>GRDF</td></tr>
      <tr><td>↳ compteur</td><td class="num">Gazpar ${s.gazSerie}</td><td>Volume journalier</td></tr></table></div>
      ${S.flags.sub?'':'<p><i>Astuce : un sous-compteur se cache aussi dans le bâtiment. Tu peux encore le trouver.</i></p>'}`),
    choice({q:'Combien de points de comptage a ton site ?',opts:[['Deux : un pour l\'électricité, un pour le gaz',1,'Un point de comptage par énergie livrée. Les usages ne sont pas des points de comptage, sauf s\'ils ont un sous-compteur.'],['Autant que d\'usages (chauffage, éclairage…)',0,'Un compteur mesure un point, pas un usage.'],['Un seul, pour tout le site',0,'Électricité et gaz arrivent par deux raccordements.']]}),
    choice({ctx:'Cas réel : un seul PDL alimente l\'école et le gymnase voisin.',q:'Comment le modéliser ?',opts:[['Un lien « plusieurs à plusieurs » entre sites et points, avec une clé de répartition (ex. 80 % / 20 %) et des dates de validité',1,'Un site peut avoir plusieurs PDL, un PDL peut alimenter plusieurs bâtiments, et ça change avec le temps.'],['On attribue tout au bâtiment le plus grand',0,'Le gymnase disparaîtrait des bilans.'],['On crée un faux PDL pour le gymnase',0,'Un identifiant inventé ne correspondra à aucune donnée.']]})
  ],done);
}
