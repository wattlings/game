/* Wattlings · jeu/epreuves/structurer.js
   Étape 4 · Structurer : ranger et convertir les données. */

/* ================= STRUCTURER ================= */
function actArchives(){
  if(S.ch!==5)return say([{t:"L'armoire à archives : plans, contrats, factures, et des données qui attendent d'être rangées."}]);
  if(S.flags.arch)return say([{t:"Tu as déjà l'inventaire. Mlle Hiérarchie t'attend à l'Arène des Archives."}]);
  S.flags.arch=1;save();gainXP(10);
  say([{t:"Tu sors l'inventaire de tes données : 1 site, 2 points de comptage, 3 compteurs, et des dizaines de milliers de mesures en vrac."},{t:"Inventaire en poche ! Reste à tout ranger : direction l'Arène des Archives, au Quartier des Colombages, au sud de la place de la Donnée."}],()=>{hud();pendingCheck()});
}
function gameStructurer(done){
  const s=site();
  runSteps('Arène des Archives · Ranger les données',[
    info(`<h3>Ranger pour pouvoir comparer</h3><p>On range les données dans un modèle commun, à la même unité et au bon pas de temps. C'est comme une bibliothèque : le classement ne change pas les livres, mais il change ce que tu trouves facilement.</p>`),
    order({q:'Remets le modèle de données dans l\'ordre, du plus large au plus fin.',items:['Site','Point de comptage','Compteur','Mesure'],okMsg:'Un site regroupe des points de comptage, qui portent des compteurs successifs, qui produisent des mesures.'}),
    choice({ctx:'Le lundi 12 janvier, le compteur électrique a envoyé 144 puissances moyennes au pas de 10 min. Leur somme : <span class="num">2 503,5 kW</span>.',q:'Quelle énergie pour la journée ?',opts:[['417 kWh',1,'Chaque pas dure 1/6 h : E = 2 503,5 × 1/6 = 417 kWh.'],['2 503,5 kWh',0,'Additionner des kW sans tenir compte du pas donne 6 fois trop.'],['17,4 kWh',0,'Ça, c\'est la moyenne des puissances, en kW.']]}),
    choice({gas:1,ctx:'Le même jour : <span class="num">229,1 m³</span> de gaz, coefficient <span class="num">11,21 kWh/m³</span>.',q:'Consommation totale du site ce jour-là ?',opts:[['2 985 kWh (417 + 2 568)',1,'On convertit d\'abord le gaz en kWh, puis on additionne des énergies dans la même unité.'],['646,1 (417 + 229,1)',0,'Tu additionnes des kWh et des m³.'],['2 568 kWh',0,'Tu as oublié l\'électricité.']]}),
    multi({q:'Coche les compteurs à additionner pour obtenir la consommation du site.',items:[['Compteur principal électrique (PDL)',true],['Compteur gaz converti en kWh (PCE)',true],[s.sub,false,'Il est déjà inclus dans le principal : tu compterais deux fois la même énergie.'],['Compteur gaz en m³ bruts',false,'Pas dans la même unité.']],okMsg:'Agréger, c\'est additionner des énergies dans la même unité, sans les sous-compteurs.'}),
    choice({ctx:'La facture couvre du 14 janvier au 13 février.',q:'Pour le bilan de janvier, la méthode la plus juste ?',opts:[['Répartir selon la courbe de charge réelle',1,'La courbe dit quelle part a vraiment été consommée en janvier. Le prorata au nombre de jours n\'est qu\'une approximation.'],['Compter toute la facture en janvier',0,'Elle déborde sur février.'],['Compter toute la facture en février',0,'La moitié de la période est en janvier.']]}),
    choice({q:'Le compteur gaz est remplacé le 15 janvier. Dans le modèle, on…',opts:[['Ajoute un nouveau compteur au même point, avec dates de pose et de dépose',1,'Le PCE reste le même. Tout ce qui change dans le temps porte des dates de validité.'],['Crée un nouveau point de comptage',0,'Le point de raccordement n\'a pas changé.'],['Écrase l\'ancien compteur',0,'Tu perdrais l\'historique.']]})
  ],done);
}
