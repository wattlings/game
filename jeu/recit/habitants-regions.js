/* Wattlings · jeu/recit/habitants-regions.js
   Les habitants des régions et leurs répliques. */

/* ---- habitants des régions (ajoutés aux habitants de la ville) ---- */
const REG_FOLK=[
  {who:'Fromagère',at:[67,14],dir:'left',pal:{skin:'#a8714a',shirt:'#3a5fa8',pants:'#2c2c34',skirt:1,apron:'#f7f0dc',hair:'#5a3a22',bun:1,hat:'#1c1c24',hatType:'straw',lash:1},
    lines:["Mon saint-nectaire s'affine six semaines en cave, à 10 °C. La cave ne consomme rien : c'est la terre qui tient la température.","Avant de faire un fromage, on décide lequel. Avant de mesurer un bâtiment, c'est pareil : on cadre."]},
  {who:'Carillonneur',at:[77,24],dir:'down',pal:{skin:'#e0ac7e',shirt:'#f7f0dc',pants:'#2c2c34',jacket:'#5a3a2a',hair:'#9a9aa2',hat:'#2c2c34',hatType:'cap',beard:'#9a9aa2'},
    lines:["Je remonte l'horloge du beffroi chaque matin. Une heure sautée, et toute la ville est en retard. Une donnée manquante, c'est pareil.","Du haut du beffroi, on voit les fils partir dans toutes les directions. Tout arrive ici par des réseaux."]},
  {who:'Friturier',at:[85,44],dir:'left',pal:{skin:'#7a4e30',shirt:'#f7f0dc',pants:'#2f3a5c',apron:'#c43d3d',hair:'#b8431f',hat:'#f7f0dc',hatType:'toque',beard:'#b8431f'},
    lines:["Une frite, c'est deux bains. Une facture, c'est deux parts : l'abonnement et la consommation. Dans les deux cas, on confond souvent.","Par chez nous, il pleut parfois. Alors on a inventé la chaleur humaine : ça ne passe par aucun compteur."]},
  {who:'Fermière',at:[78,56],dir:'down',pal:{skin:'#f6d3b3',shirt:'#8ec9e8',pants:'#6b4a2b',skirt:1,apron:'#f7f0dc',hair:'#d9a441',style:'long',lash:1,scarf:'#c43d3d',prop:'basket'},
    lines:["Mes pommes, je les trie une par une : les véreuses d'un côté, les bonnes de l'autre. Et je garde les véreuses pour savoir d'où elles viennent.","Une haie bien tenue, et rien ne s'échappe du pré. Un contrôle bien tenu, et rien de faux n'entre dans le tableau."]},
  {who:'Marchande de bretzels',at:[65,61],dir:'left',pal:{skin:'#f1c7a1',shirt:'#f7f0dc',pants:'#c43d3d',skirt:1,apron:'#1c1c24',hair:'#d9a441',style:'long',lash:1,hat:'#1c1c24',hatType:'noeud',prop:'bretzel'},
    lines:["Chez nous, la charpente se voit sur la façade. On sait tout de suite ce qui porte quoi. Tes données devraient être aussi lisibles.","Un bretzel bien fait, c'est toujours le même nœud. Site, compteur, date : toujours le même ordre."]},
  {who:'Vigneron',at:[34,63],dir:'left',pal:{skin:'#e0ac7e',shirt:'#7a8a4a',pants:'#5a3a22',apron:'#5a2a4a',hair:'#5a3a22',hat:'#2c2c34',hatType:'beret',beard:'#5a3a22',prop:'basket'},
    lines:["Mon grand-père notait tout : la date des vendanges, le degré, la pluie. Cent ans de carnets. Sans historique, on ne compare rien.","Regarde les rangs : ils suivent la pente. Une bonne courbe, ça se lit comme un coteau : les creux, les bosses, et ce qui ne bouge jamais."]},
  {who:'Gardien du phare',at:[16,44],dir:'down',pal:{skin:'#e0ac7e',shirt:'#f7f0dc',stripes:'#27457a',pants:'#27325a',coat:'#f2c12e',hair:'#9a9aa2',hat:'#27325a',hatType:'cap',beard:'#9a9aa2'},
    lines:["Mon phare ne dort jamais : c'est son métier. Tes bâtiments, eux, n'ont aucune excuse pour veiller toute la nuit.","Quand la lumière clignote de travers, je le vois tout de suite. Une dérive, c'est ça : un rythme qui change sans prévenir."]},
  {who:'Crêpière',at:[12,58],dir:'left',pal:{skin:'#f6d3b3',shirt:'#1c1c24',pants:'#1c1c24',skirt:1,apron:'#f7f0dc',hair:'#5a3a22',hat:'#f7f0dc',hatType:'coiffe',lash:1},
    lines:["Complète, beurre-sucre ou caramel au beurre salé ? Le beurre est toujours salé, ici. C'est la seule donnée qu'on ne discute pas.","Ma galettière a un voyant. Quand il reste allumé après le service, je le vois de loin. Tout devrait avoir un voyant."]},
  {who:'Joueur de boules',at:[10,39],dir:'right',pal:{skin:'#c68a5c',shirt:'#f7f0dc',pants:'#6d7896',hair:'#9a9aa2',hat:'#e3cf98',hatType:'straw',beard:'#9a9aa2',prop:'boule'},
    lines:["Tu tires ou tu pointes ? En énergie, c'est pareil : on pointe d'abord, les réglages, tout en douceur. On tire ensuite : les travaux.","Ne mesure pas à l'œil, malheureux ! Sors la ficelle. Une action sans mesure, c'est une galéjade."]},
  {who:'Joueuse de boules',at:[13,39],dir:'left',pal:{skin:'#e0ac7e',shirt:'#e9a0a8',pants:'#f7f0dc',hair:'#2b1d14',style:'boucle',lash:1,scarf:'#7f8fd0',prop:'boule'},
    lines:["À l'heure de la sieste, on ferme les volets. La fraîcheur, ici, ça ne s'achète pas : ça se garde.","Avec ce soleil, les panneaux d'à côté chantent plus fort que les cigales."]},
  {who:'Berger',at:[29,9],dir:'down',pal:{skin:'#c68a5c',shirt:'#8a5a2b',pants:'#3a3530',jacket:'#5a4a3a',hair:'#2b1d14',hat:'#c43d3d',hatType:'bonnet',beard:'#2b1d14',prop:'crook'},
    lines:["Je compte mes brebis matin et soir, au même endroit, de la même façon. Sinon, comment prouver qu'il n'en manque pas ?","En altitude, on ne compare pas juillet à janvier. On compare juillet à juillet, à météo égale. Le reste, c'est du vent."]}
];
const REG_WHEN={'Fromagère':()=>hr(8,19),'Carillonneur':()=>hr(7,21),'Friturier':()=>hr(11,22),'Fermière':()=>hr(7,19)&&!SKY.storm,'Marchande de bretzels':()=>hr(8,19)&&!SKY.storm,'Vigneron':()=>hr(7,19.5)&&!SKY.storm,
  'Gardien du phare':null,'Crêpière':()=>hr(11,22),'Joueur de boules':()=>hr(10,21)&&!skWet(),'Joueuse de boules':()=>hr(10,21)&&!skWet(),'Berger':()=>hr(6,21)};
const REG_WX={
  'Fromagère':[[()=>SKY.T>26,"Par cette chaleur, je garde les fromages à la cave. Elle reste à 10 °C sans rien demander à personne."]],
  'Carillonneur':[[()=>SKY.fog>.4,"Par temps de brouillard, on n'y voit rien, mais on entend les cloches. Une bonne alerte, c'est ça : elle passe même quand tout est flou."]],
  'Friturier':[[()=>skWet(),"Sous la pluie, la frite se vend mieux. Je le sais : je note mes ventes et le temps qu'il fait. C'est ma signature énergétique à moi."]],
  'Fermière':[[()=>SEA.se===2,"C'est la saison des pommes. Le pressoir tourne : viens voir comme on trie avant de presser."],[()=>SEA.se===0,"Les pommiers sont en fleurs. Une gelée cette nuit, et la récolte est perdue : je surveille le thermomètre."]],
  'Marchande de bretzels':[[()=>SEA.se===3,"L'hiver, la cigogne s'en va. Elle revient toujours au même nid : elle au moins, elle sait où sont rangées ses affaires."]],
  'Vigneron':[[()=>SEA.se===2,"Les vendanges ! Les feuilles rougissent, le raisin est mûr. Je note la date dans le carnet, comme chaque année depuis cent ans."],[()=>SKY.wet>.4,"Après la pluie, les escargots sortent. Regarde par terre."],[()=>SEA.se===3,"L'hiver, on taille. La vigne dort, mais le carnet reste ouvert."]],
  'Gardien du phare':[[()=>SKY.storm,"Tempête ! C'est maintenant que le phare sert à quelque chose. Rentre te mettre à l'abri."],[()=>SKY.dark>.4,"Regarde le faisceau tourner. Tout ce qu'il éclaire à cette heure-ci et qui consomme, c'est du talon."],[()=>SKY.fog>.4,"Par ce brouillard, je sonne la corne de brume. Quand on ne voit plus, il reste la mesure."]],
  'Crêpière':[[()=>skWet(),"Il pleut ? Non : il fait breton. Entre te réchauffer, la galettière est déjà chaude."]],
  'Joueur de boules':[[()=>SKY.T>26,"Écoute les cigales : elles ne chantent qu'au-dessus de 25 °C. Un vrai thermomètre, et sans pile."]],
  'Berger':[[()=>SKY.snow>0||SKY.snowG,"Avec la neige, je garde les bêtes tout près de la bergerie. Je les ai recomptées ce matin : le compte est bon."],[()=>SKY.wind>.7,"Quand le vent se lève sur l'alpage, on plante le bâton et on attend. Là-haut, on ne discute pas avec la météo, on la note."]]};
/* les habitants de toujours prennent l'accent du quartier */
{const add=(L,who,line,pal)=>{const f=L.find(q=>q.who===who);if(!f)return;f.lines.push(line);if(pal)Object.assign(f.pal,pal)};
  add(WALKERS,'Touriste',"Des volcans au bout du quai, un beffroi à l'est, un phare à l'ouest… Votre ville, c'est la France en miniature. Mon guide n'y comprend rien.");
  add(TOWNSFOLK,'Chef de gare',"La gare est en pierre de lave, comme tout le Puy. Sombre dehors, fraîche dedans : l'inertie, on connaît ça depuis longtemps.");
  add(TOWNSFOLK,'Jardinier',"Les géraniums aux fenêtres, c'est moi. Un par jardinière, tous arrosés le même jour : je tiens un registre.");
  add(WALKERS,'Promeneur',"Par ici, on dit qu'il fait beau plusieurs fois par jour. Talon adore : il y a toujours une flaque quelque part.",{stripes:'#27457a',shirt:'#f7f0dc',jacket:null});
  add(TOWNSFOLK,'Ouvrier',"On refait la toiture en tuiles canal, à l'ancienne. Et dessous, vingt centimètres d'isolant, à la moderne.");
  add(WALKERS,'Auditrice',"En montagne, on dit : ce qui n'est pas compté à la montée n'existe pas à la descente.");
  add(WALKERS,'Technicienne réseau',"Sous les pavés, les câbles. Toute la Cité des Beffrois est branchée là-dessous.");
  add(WALKERS,'Chasseur de données',"Dans le bocage, les données se cachent derrière les haies. Comme les vaches.");
  add(WALKERS,'Joggeuse',"Je cours entre les rangs de vigne : ça monte, ça descend. Mon profil d'effort ressemble à un coteau.")}
TOWNSFOLK.push(...REG_FOLK);Object.assign(LIFE_WHEN,REG_WHEN);Object.keys(LIFE_WHEN).forEach(k=>{if(!LIFE_WHEN[k])delete LIFE_WHEN[k]});Object.assign(LIFE_WX,REG_WX);
