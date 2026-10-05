/* Wattlings · jeu/epreuves/detecter.js
   Étape 6 · Détecter : la ronde de nuit et les dérives. */

/* ================= DÉTECTER ================= */
function actDerive(id){
  const s=site();if(S.ch!==7)return;
  if(S.derives[id])return say([{t:'Déjà noté dans ton rapport de ronde.'}]);
  const D={light:['Éclairage des circulations resté allumé toute la nuit',0.5],rdc:s.derRdc,cave:s.derCave,boiler:null};
  S.derives[id]=1;save();gainXP(15);
  const lines=id==='boiler'?[{t:"La chaudière tourne un samedi soir, bâtiment vide ! Dérive gaz : le réduit de week-end n'est pas programmé."},{t:"Une règle métier liée au calendrier (« chaudière en marche le week-end ») la repère tout de suite."}]:[{t:`Dérive trouvée : ${D[id][0]}.`},{t:`+${String(D[id][1]).replace('.',',')} kW sur le talon, toutes les nuits et tous les week-ends.`}];
  const n=Object.keys(S.derives).length;
  say([...lines,{t:`Rapport de ronde : ${n}/4 dérives.`}],()=>{hud();if(n>=4)say(missingReq(7).length?[{t:"Ronde terminée ! Mais il te manque encore des notions avant l'arène."},...missingLines(7)]:[{t:"Ronde terminée ! Va présenter ton rapport à la Veilleuse, à l'Arène de la Nuit."}])});
}
function gameDetect(done){
  runSteps('Arène de la Nuit · Rapport de ronde',[
    info(`<h3>Rapport de ronde</h3><p>Les trois dérives électriques font monter le talon de <b>3 kW</b> au total. À midi, c'est invisible. Sur une année, c'est une autre histoire.</p><div class="ctx">Heures « bâtiment vide » sur un an (nuits, week-ends, vacances) : environ <span class="num">7 240 h</span>.</div>`),
    choice({q:'Combien d\'énergie gaspillée par an ?',opts:[['21 720 kWh',1,'3 kW × 7 240 h = 21 720 kWh, soit environ 21,7 MWh.'],['3 kWh',0,'Des kW multipliés par des heures donnent des kWh.'],['2 413 kWh',0,'On multiplie, on ne divise pas.']]}),
    choice({ctx:'Prix du kWh électrique évité : environ <span class="num">0,186 € HT</span>.',q:'Coût annuel de ces dérives ?',opts:[['≈ 4 040 € HT par an',1,'21 720 × 0,186 ≈ 4 040 €. Une petite puissance devient une grosse facture.'],['≈ 40 € HT par an',0,'Refais le calcul : 21 720 × 0,186.'],['≈ 116 000 € HT par an',0,'On multiplie par 0,186, on ne divise pas.']]}),
    choice({title:'Régler les alertes',q:'Quelle référence (baseline) pour repérer une dérive sans fausse alerte ?',opts:[['Une régression sur DJU, occupation et calendrier',1,'Elle compare à ce que le site aurait dû consommer. Elle demande un historique propre.'],['La moyenne des 4 dernières semaines',0,'Elle apprend la dérive et finit par la cacher.'],['Le même mois l\'an dernier',0,'Météo et calendrier différents.']]}),
    choice({q:'Une alerte se déclenche le 20 janvier à cause d\'une valeur de 999,9 kW. C\'est…',opts:[['Un faux positif dû à la qualité des données',1,'D\'où l\'étape Fiabiliser avant Détecter. Trop de fausses alertes, et plus personne ne les lit.'],['Une vraie surconsommation',0,'Souviens-toi de Picatron !'],['Un faux négatif',0,'Un faux négatif, c\'est un vrai problème sans alerte.']]}),
    choice({q:'Exiger qu\'un écart dure 2 jours de suite avant d\'alerter (persistance) permet surtout de…',opts:[['Réduire les fausses alertes ponctuelles',1,'En contrepartie, la détection est un peu plus lente.'],['Détecter plus vite',0,'C\'est l\'inverse.'],['Supprimer tous les faux négatifs',0,'Au contraire, un seuil plus strict peut en ajouter.']]})
  ],done);
}
