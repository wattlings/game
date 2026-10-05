/* Wattlings · jeu/monde/sites.js
   Les trois sites jouables : école, bureaux, boulangerie (adresse, surface, compteurs, dérives). */

/* ================= SITES ================= */
const SITES={
  ecole:{id:'ecole',name:ECOLE.nom,short:"l'école",kind:'une école primaire',addr:'12 rue Jean-Jaurès',cp:'45100 Ampère-sur-Loire',
    surface:ECOLE.surface,activite:'Enseignement (école primaire)',annee:1972,occ:'250 élèves, 18 adultes',kva:ECOLE.puissanceSouscrite,pointe:57,souscrit:80,psOpts:[50,60,80,100],psOk:60,
    pdl:ECOLE.pdl,serie:'021472215896',pce:'GI084512',gazSerie:'0C19123456',elec:86,gaz:208,titulaire:"Mairie d'Ampère-sur-Loire",siret:'21450123400017',
    sub:'Sous-compteur de la cuisine',subShort:'la cuisine',roof:'#c0503a',wall:'#f0e0c8',floor:['#d9d2b5','#cfc7a6'],
    derRdc:['Tableau numérique et PC de la salle info restés en veille tout le week-end',1.6],derCave:['Chauffe-eau électrique en marche pendant les vacances',0.9]},
  bureau:{id:'bureau',name:'Bureaux Le Carré',short:'les bureaux',kind:'un immeuble de bureaux',addr:'3 place de la Gare',cp:'45100 Ampère-sur-Loire',
    surface:1500,activite:'Bureaux',annee:1994,occ:'90 salariés',kva:120,pointe:104,souscrit:150,psOpts:[90,110,150,180],psOk:110,
    pdl:'25893076451208',serie:'113620894417',pce:'GI217703',gazSerie:'0C21558204',elec:165,gaz:120,titulaire:'SCI Le Carré',siret:'81234567800024',
    sub:'Sous-compteur de la salle serveurs',subShort:'la salle serveurs',roof:'#3f7f8f',wall:'#d6dde6',floor:['#9fb0c2','#95a6b8'],
    derRdc:['Écrans, imprimantes et machine à café en veille toute la nuit',1.3],derCave:['Centrale de ventilation qui tourne 24 h/24',1.2]},
  boulangerie:{id:'boulangerie',name:'Boulangerie du Moulin',short:'la boulangerie',kind:'une boulangerie',addr:'7 rue du Four',cp:'45100 Ampère-sur-Loire',
    surface:140,activite:'Commerce alimentaire (boulangerie)',annee:1958,occ:'6 salariés',kva:36,pointe:27,souscrit:36,psOpts:[24,30,36],psOk:30,
    pdl:'19427730562814',serie:'061925504731',pce:'GI390156',gazSerie:'0C17430981',elec:62,gaz:48,titulaire:'SARL Boulangerie du Moulin',siret:'49876543200031',
    sub:'Sous-compteur du fournil',subShort:'le fournil',roof:'#b8864a',wall:'#f3e2c4',floor:['#e8e0d0','#d8cdb8'],
    derRdc:['Vitrine réfrigérée ouverte, sans rideau de nuit',1.7],derCave:['Chambre froide dont la porte ferme mal',0.8]}
};
const site=()=>SITES[S.site]||SITES.ecole;
const elecChannel=s=>s.kva>36?'SGE':'Data Connect';
const assujetti=s=>s.surface>=1000;
