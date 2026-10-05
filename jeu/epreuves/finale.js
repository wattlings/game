/* Wattlings · jeu/epreuves/finale.js
   Finale : le passage au patrimoine. */

/* ================= FINALE : PATRIMOINE ================= */
function gameFinale(){
  const rows=Object.values(SITES).map(s=>({s,r:Math.round((s.elec+s.gaz)*1000/s.surface)}));
  runSteps('Final · Gestionnaire de patrimoine',[
    info(`<h3>Ton patrimoine</h3><div class="tbl"><table><tr><th>Site</th><th>Surface</th><th>Élec</th><th>Gaz</th><th>Ratio</th></tr>${rows.map(({s,r})=>`<tr><td>${esc(s.name)}</td><td>${fmt(s.surface)} m²</td><td>${s.elec} MWh</td><td>${s.gaz} MWh</td><td>${fmt(r)} kWh/m²</td></tr>`).join('')}</table></div><p>À l'échelle d'un patrimoine, on compare, on classe et on priorise.</p>`),
    choice({q:'Quels sites sont assujettis au décret tertiaire ?',opts:[['L\'école et les bureaux',1,'Tous deux dépassent 1 000 m². La boulangerie (140 m²) n\'est pas concernée.'],['Les trois',0,'La boulangerie fait 140 m².'],['Seulement la boulangerie, qui a le pire ratio',0,'Le seuil porte sur la surface, pas sur le ratio.']]}),
    choice({q:'La boulangerie a le plus gros ratio (786 kWh/m²). Faut-il l\'isoler en priorité ?',opts:[['Non : son ratio vient surtout du process (fours, froid). Il se lit avec son contexte',1,'Un ratio compare des bâtiments comparables. Pour la boulangerie, on regarde plutôt kWh par fournée ou le talon du froid.'],['Oui, c\'est le pire ratio donc le pire bâtiment',0,'Un fournil n\'est pas une salle de classe.'],['Oui, et fermer le fournil la nuit',0,'Le pain se fait la nuit !']]}),
    choice({q:'Par où commencer à l\'échelle du patrimoine ?',opts:[['Sobriété partout (quasi gratuite), puis travaux sur les sites assujettis au plus gros potentiel en kWh',1,'On combine l\'ordre sobriété → efficacité → production avec l\'obligation réglementaire et le potentiel.'],['Panneaux solaires sur tous les toits d\'abord',0,'La production vient en dernier.'],['Attendre l\'échéance 2030',0,'Chaque année compte, et la sobriété ne coûte presque rien.']]}),
    choice({q:'Pour suivre les trois sites d\'une année à l\'autre, que faut-il faire avant de comparer le chauffage ?',opts:[['Corriger du climat avec les DJU de la station locale',1,'La normalisation climatique rend les hivers comparables.'],['Rien, les kWh suffisent',0,'Un hiver doux fausserait tout.'],['Diviser par le nombre de salariés',0,'Ça ne corrige pas la météo.']]})
  ],()=>{S.ch=11;save();hud();endScreen()});
}
