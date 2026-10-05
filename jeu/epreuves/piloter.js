/* Wattlings · jeu/epreuves/piloter.js
   Étape 8 · Mesurer : prouver l'effet des actions (badge Piloter). */

/* ================= PILOTER ================= */
function gamePiloter(done){
  const s=site(),a=assujetti(s);
  runSteps('Arène de la Preuve · Mesure et vérification',[
    info(`<h3>L'action a-t-elle marché ?</h3><p>Tu te pèses en manteau en janvier et en t-shirt en juillet : tu as « perdu » 3 kg. Pour savoir si le régime a marché, il faut se peser dans les mêmes conditions. Pour un bâtiment, les conditions, c'est surtout la météo : on corrige avec les DJU. C'est la <b>mesure et vérification</b> (M&V).</p>`),
    choice({q:'L\'hiver a été 15 % plus doux et le chauffage a baissé de 15 %. L\'action a-t-elle marché ?',opts:[['On ne peut pas conclure sans corriger du climat : l\'effet réel est proche de 0',1,'La météo explique toute la baisse.'],['Oui, −15 %, bravo !',0,'L\'hiver doux a fait tout le travail.'],['Non, elle a augmenté la consommation',0,'Rien ne le montre.']]}),
    choice({gas:1,ctx:'Année de référence : <span class="num">196 157 kWh</span> de chauffage pour <span class="num">2 244 DJU</span>, soit 87,4 kWh/DJU.<br>Année suivante : <span class="num">1 900 DJU</span> et <span class="num">139 000 kWh</span> mesurés.',q:'Quelle économie est vraiment due à l\'action ?',opts:[['−16,3 %',1,'Sans action : 87,4 × 1 900 = 166 060 kWh. Économie : 166 060 − 139 000 = 27 060 kWh, soit −16,3 %.'],['−29,1 %',0,'C\'est la comparaison brute : 13 points viennent de la météo.'],['−9,7 %',0,'Refais le calcul avec 87,4 kWh/DJU.']]}),
    choice({title:'Décret tertiaire',q:'Objectif de réduction pour 2030, par rapport à l\'année de référence ?',opts:[['−40 % (puis −50 % en 2040, −60 % en 2050)',1,'Ou atteindre un seuil en valeur absolue (kWh/m²/an) fixé par activité.'],['−10 %',0,'Bien plus ambitieux que ça.'],['−100 %',0,'Pas tout à fait !']]}),
    a?choice({q:`${s.name} est assujetti. Avant quelle date déclarer les consommations de l'année précédente sur OPERAT ?`,opts:[['Avant le 30 septembre, chaque année',1,'Sur la plateforme OPERAT de l\'ADEME. Ces paramètres évoluent par arrêté : toujours revérifier sur les textes officiels.'],['Avant le 31 décembre',0,'Non, c\'est le 30 septembre.'],['Uniquement tous les 10 ans',0,'La déclaration est annuelle.']]})
     :choice({q:`${s.name} doit-elle déclarer ses consommations sur OPERAT ?`,opts:[['Non : moins de 1 000 m² de surface tertiaire',1,'Pas d\'obligation. Mais le suivi reste utile : la facture et le climat, eux, ne connaissent pas de seuil.'],['Oui, avant le 30 septembre',0,'Seulement au-delà de 1 000 m².'],['Oui, tous les mois',0,'Même les assujettis déclarent une fois par an.']]}),
    choice({q:'Pour ton site, quel indicateur fait le plus ressortir le gaz ?',opts:[['Les émissions de CO₂ (tCO₂e)',1,'Le gaz émet environ 4 fois plus de CO₂ par kWh que l\'électricité française.'],['Les kWh d\'énergie finale',0,'Le gaz pèse lourd, mais le CO₂ l\'amplifie.'],['Les kWh/m²',0,'C\'est un ratio de consommation, pas d\'émissions.']]}),
    order({title:'ISO 50001',q:'La norme ISO 50001 impose une boucle d\'amélioration continue. Remets-la dans l\'ordre.',items:['Planifier','Faire','Vérifier','Agir'],okMsg:'Et on repart au début : nouvelles données, nouveaux objectifs, nouveau périmètre.'})
  ],done);
}
