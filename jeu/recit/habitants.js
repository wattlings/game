/* Wattlings · jeu/recit/habitants.js
   Les habitants de la ville : qui ils sont, où ils vont, ce qu'ils disent selon l'heure et la météo. */

/* ================= LA VIE DE LA VILLE =================
   Des habitants qui ont chacun leur métier et leur mot à dire, des passants qui vont et viennent, des oiseaux, des papillons,
   l'eau qui miroite, la fumée des cheminées, les drapeaux, les nuages. Chacun a ses horaires et ses habitudes selon le temps qu'il fait.
   Rien ici n'est nécessaire à la quête : c'est du décor vivant. */
/* habitants immobiles (z = quartier, at = case logique) */
const TOWNSFOLK=[
  {who:'Boulangère',at:[49,48],dir:'down',pal:{skin:'#f1c7a1',shirt:'#f7f0dc',pants:'#6b4a2b',apron:'#f7f0dc',hair:'#8a5a2b',bun:1,hat:'#fff',hatType:'toque',lash:1,prop:'baguette'},
    lines:["Le four tourne dès 3 h du matin. La nuit, c'est le fournil qui consomme, pas la boutique.","Une baguette ? Elle sort du four. Le four, lui, ne sort jamais de ma facture."]},
  {who:'Chef de gare',at:[58,11],dir:'down',pal:{skin:'#e0ac7e',shirt:'#1c2440',pants:'#1c2440',jacket:'#27325a',hair:'#5a3a22',hat:'#c43d3d',hatType:'cap',beard:'#5a3a22',tie:'#f2c12e'},
    lines:["Aucun train aujourd'hui. Ni demain. Mais le quai est balayé, on ne sait jamais.","Un jour, cette ligne mènera vers d'autres villes. D'ici là, je garde l'horloge à l'heure."]},
  {who:'Pêcheur',at:[29,36],dir:'left',pal:{skin:'#c68a5c',shirt:'#6d7896',pants:'#5a3a22',hair:'#9a9aa2',hat:'#e3cf98',hatType:'straw',beard:'#9a9aa2',prop:'rod'},
    lines:["Ça ne mord pas. Remarque, je ne compte pas mes prises : je n'ai aucune preuve que ça ne mord pas.","Chut. Les canards écoutent."]},
  {who:'Jardinier',at:[60,63],dir:'down',pal:{skin:'#9a6440',shirt:'#5fa854',pants:'#6b4a2b',apron:'#3f8a3a',hair:'#2b1d14',hat:'#e3cf98',hatType:'straw',prop:'broom'},
    lines:["J'arrose le soir. Et je relève le compteur d'eau tous les lundis : un index, une soustraction, et je vois tout de suite s'il y a une fuite.","Les fleurs, c'est comme les données : si on ne s'en occupe pas chaque semaine, ça devient vite n'importe quoi."]},
  {who:'Étudiante',at:[58,62],dir:'right',pal:{skin:'#f6d3b3',shirt:'#e2573b',pants:'#2f3a5c',hair:'#2b1d14',style:'long',glasses:1,lash:1,prop:'book'},
    lines:["Je révise au jardin. À la médiathèque, tout est rangé par site, par compteur, par date. Ça calme.","Mon mémoire porte sur un tableur nommé « final_v7_vraiment_final ». C'est une tragédie."]},
  {who:'Ouvrier',at:[14,34],dir:'down',pal:{skin:'#e0ac7e',shirt:'#e2573b',pants:'#2f3a5c',hair:'#2b1d14',hat:'#f2c12e',hatType:'helmet',vest:1,beard:'#2b1d14',prop:'wrench'},
    lines:["On isole la toiture la semaine prochaine. Le chef dit : d'abord on règle, ensuite on isole. Il a raison, le chef.","Le chantier est interdit au public. Toi, tu as une tête à lire les compteurs : passe."]},
  {who:'Cliente du marché',at:[31,46],dir:'left',pal:{skin:'#6b4128',shirt:'#f2a33a',pants:'#8a3b8f',skirt:1,hair:'#2b1d14',style:'boucle',lash:1,bag:'#c9a26e'},
    lines:["Je compare les prix au kilo, jamais au cageot. Pour les bâtiments, c'est pareil : on compare au mètre carré.","Tout vient à vélo, ici. Même les pastèques. Surtout les pastèques."]},
  {who:'Réparateur de vélos',at:[52,39],dir:'down',pal:{skin:'#f1c7a1',shirt:'#2aa198',pants:'#333',apron:'#1c2440',hair:'#d9a441',style:'boucle',hat:'#2aa198',hatType:'cap',prop:'wrench'},
    lines:["Une crevaison ? La borne est là pour ça. En ville, on répare avant de remplacer.","Pas une voiture à Ampère-sur-Loire. Mon métier, c'est le dérailleur."]},
  {who:'Guetteur de vent',at:[85,45],dir:'right',pal:{skin:'#f6d3b3',shirt:'#5b6380',pants:'#2c2c34',coat:'#6d7896',hair:'#ece6d6',scarf:'#c43d3d',hat:'#3a3a44',hatType:'beret'},
    lines:["Écoute. De l'autre côté de la forêt, quelque chose tourne. Le vent ne laisse passer personne.","Un jour sans vent, peut-être. Je n'en ai jamais vu."]}
];
/* passants : ils vont et viennent entre deux points de leur quartier */
const WALKERS=[
  {who:'Écolier',a:[66,34],b:[59,37],pal:{skin:'#e0ac7e',shirt:'#f2c12e',pants:'#2f6db5',hair:'#5a3a22',hat:'#c43d3d',hatType:'cap',bag:'#2f9e7a'},v:.75,
    lines:["On a compté les fenêtres ouvertes de l'école avec le chauffage allumé. Il y en avait onze. La maîtresse a dit que c'était un très bon exercice.","Chat ! C'est toi le chat. Non ? Tant pis."]},
  {who:'Factrice',a:[50,33],b:[62,49],pal:{skin:'#c68a5c',shirt:'#f2c12e',pants:'#27325a',jacket:'#27325a',hair:'#2b1d14',style:'queue',hat:'#27325a',hatType:'cap',lash:1,bag:'#8a5f36'},v:.55,
    lines:["Je distribue les factures d'énergie. Elles arrivent toujours après la consommation, et jamais le jour qu'on croit.","Ma tournée se fait à vélo. Aujourd'hui, il est chez le réparateur."]},
  {who:'Touriste',a:[53,13],b:[60,20],pal:{skin:'#f6d3b3',shirt:'#e57399',pants:'#c9b28a',hair:'#d9a441',hat:'#f7f0dc',hatType:'straw',prop:'plan'},v:.45,
    lines:["Je cherche la gare. On m'a dit qu'elle rouvrait « prochainement ». Ça fait trois jours.","Votre ville est sur aucune carte routière. Normal, me direz-vous."]},
  {who:'Technicienne réseau',a:[75,32],b:[84,40],pal:{skin:'#9a6440',shirt:'#2f6db5',pants:'#274f8f',overall:'#274f8f',hair:'#2b1d14',style:'queue',hat:'#f2c12e',hatType:'helmet',lash:1,prop:'tablet'},v:.55,
    lines:["Un compteur communicant, c'est un relevé sans se déplacer. Mes mollets regrettent un peu.","Distributeur d'un côté, fournisseur de l'autre. On me confond tous les jours."]},
  {who:'Chasseur de données',a:[76,56],b:[83,57],pal:{skin:'#f1c7a1',shirt:'#2f9e7a',pants:'#6b4a2b',hair:'#b8431f',hat:'#2f6d34',hatType:'cap',prop:'net'},v:.7,
    lines:["J'attrape des données sauvages ! Celle-là avait un trou de trois heures.","Les doublons, je les relâche. Enfin, un sur deux."]},
  {who:'Lecteur',a:[57,60],b:[52,57],pal:{skin:'#f6d3b3',shirt:'#8a3b8f',pants:'#2c2c34',hair:'#9a9aa2',glasses:1,scarf:'#f2a33a',prop:'book'},v:.4,
    lines:["Je rapporte mes livres en retard. La borne le sait. La borne sait tout.","À chaque donnée sa place, et une place pour chaque donnée. C'est écrit sur le fronton."]},
  {who:'Joggeuse',a:[26,61],b:[38,61],pal:{skin:'#6b4128',shirt:'#f2a33a',pants:'#2c2c34',hair:'#2b1d14',style:'queue',lash:1,scarf:'#f7f0dc'},v:1.05,
    lines:["Trois tours du parc chaque matin. Je note mes temps : sans mesure, je croirais que je progresse.","Pff... Mon cœur a un talon et des pics. Comme un bâtiment."]},
  {who:'Promeneur',a:[5,50],b:[16,50],pal:{skin:'#f1c7a1',shirt:'#5b6ee0',pants:'#2f3a5c',jacket:'#39426a',hair:'#5a3a22',beard:'#5a3a22',prop:'leash'},v:.45,pet:1,
    lines:["Il s'appelle Talon. Il ne dort jamais vraiment, même la nuit.","On se promène à la tombée du jour. C'est là qu'on voit ce qui reste allumé."]},
  {who:'Cheffe de chantier',a:[5,32],b:[16,31],pal:{skin:'#e0ac7e',shirt:'#f7f0dc',pants:'#2f3a5c',hair:'#b8431f',style:'carre',hat:'#f7f0dc',hatType:'helmet',vest:1,lash:1,prop:'clipboard'},v:.5,
    lines:["Mon planning tient en trois lignes : ce qui ne coûte rien, ce qui se négocie, ce qui se construit. Dans cet ordre.","Attention où tu marches. Les palettes ne sont pas rangées par ordre alphabétique."]},
  {who:'Auditrice',a:[27,21],b:[40,21],pal:{skin:'#9a6440',shirt:'#f7f0dc',pants:'#2c2c34',jacket:'#c9a227',hair:'#2b1d14',bun:1,glasses:1,lash:1,prop:'clipboard'},v:.5,
    lines:["Avant, après, à météo comparable. Sinon ce n'est pas une preuve, c'est une impression.","Je vérifie tout. Même cette phrase : je l'ai relue deux fois."]},
  {who:'Marchande de fleurs',a:[35,37],b:[41,44],pal:{skin:'#f6d3b3',shirt:'#e57399',pants:'#2f6d34',skirt:1,apron:'#f7f0dc',hair:'#d9a441',style:'long',lash:1,hat:'#e3cf98',hatType:'straw'},v:.4,
    lines:["Des fleurs pour l'hôtel de ville ! Le maire en veut partout depuis qu'il a un tableau de bord.","Elles poussent toutes seules. C'est la seule production de la ville qui n'a pas de compteur."]}
];
/* qui est dehors, et quand (h : heure, j : jour de la semaine, 0 = dimanche). Sans règle : toujours là. */
const wkd=()=>SKY.wd>=1&&SKY.wd<=5,hr=(a,b)=>SKY.clock>=a&&SKY.clock<b;
const LIFE_WHEN={
  'Boulangère':()=>hr(6.5,19.5),'Chef de gare':()=>hr(6,22.5),'Pêcheur':()=>hr(6,20.5)&&!SKY.storm&&!SKY.snow,'Jardinier':()=>hr(8,18.5)&&!skWet(),
  'Étudiante':()=>hr(10,19.5)&&!skWet()&&SKY.T>7,'Ouvrier':()=>wkd()&&hr(7.5,17.5)&&!SKY.storm,'Cliente du marché':()=>hr(8,13.5)&&!SKY.storm,'Réparateur de vélos':()=>hr(9,19),
  'Écolier':()=>(S.en&&PREF.cal!=='reel'&&enVac(enDate(S.en.day)))?hr(9,19.5):wkd()?(hr(7.5,8.5)||hr(11.5,13.5)||hr(16.5,19)):hr(9,19),'Factrice':()=>SKY.wd!==0&&hr(8,15),'Touriste':()=>hr(9,21.5),'Technicienne réseau':()=>(wkd()&&hr(8,18))||SKY.storm,
  'Chasseur de données':()=>hr(9,20)&&!skWet(),'Lecteur':()=>hr(10,19),'Joggeuse':()=>(hr(6.5,9.5)||hr(17.5,20.5))&&!SKY.storm,'Promeneur':()=>hr(7,9)||hr(12,14)||hr(17.5,23),
  'Cheffe de chantier':()=>wkd()&&hr(7.5,18),'Auditrice':()=>wkd()&&hr(9,18),'Marchande de fleurs':()=>hr(8,19)&&!SKY.storm&&!SKY.snow};
/* ce que le temps leur inspire : la première condition vraie donne une réplique, dite une fois sur deux */
const LIFE_WX={
  'Boulangère':[[()=>SKY.clock<8,"Tu es bien matinal. Le fournil tourne depuis 3 h : regarde ma courbe de charge, tu y verras la bosse de la nuit."],[()=>SKY.T<5,"Par ce froid, tout le monde veut du pain chaud. Le four chauffe la boutique : je n'allume même pas le radiateur."]],
  'Pêcheur':[[()=>SKY.rain>.1,"Sous la pluie, ça mord mieux. C'est du moins ce que je me répète depuis ce matin."],[()=>SKY.fog>.4,"Avec ce brouillard, je ne vois plus mon bouchon. Il est peut-être très occupé, qui sait."]],
  'Jardinier':[[()=>SKY.T>26,"Par cette chaleur, j'arrose à la fraîche. À midi, la moitié de l'eau s'évapore avant d'arriver aux racines."],[()=>SEA.se===2,"L'automne, c'est la saison des tas de feuilles. Et des chaudières qu'on rallume trop tôt."]],
  'Guetteur de vent':[[()=>SKY.wind>.7,"Tu le sens ? Aujourd'hui, il souffle fort jusqu'en ville. Là-bas, les pales doivent tourner à plein régime."],[()=>SKY.wind<.15,"Presque pas un souffle en ville. Derrière la forêt, pourtant, ça tourne encore. Toujours."]],
  'Factrice':[[()=>skWet(),"Par ce temps, les factures arrivent mouillées. Les montants, eux, restent parfaitement lisibles, hélas."]],
  'Cheffe de chantier':[[()=>skWet(),"Avec ce temps, on ne coule pas la dalle aujourd'hui. On en profite pour régler la chaufferie : ça, ça ne craint pas l'eau."]],
  'Écolier':[[()=>SKY.snow>0||SKY.snowG,"Il a neigé ! La maîtresse dit que le chauffage va travailler dur aujourd'hui. Nous, on va surtout faire un bonhomme."]],
  'Réparateur de vélos':[[()=>skWet()||SKY.snowG,"Par ce temps, les freins couinent et les chaînes rouillent. J'ai du travail pour la semaine."]],
  'Joggeuse':[[()=>SKY.rain>.1,"Sous la pluie, je cours quand même. Mais je note le temps qu'il fait : on ne compare que ce qui est comparable."]],
  'Chef de gare':[[()=>SKY.dark>.4,"À cette heure-ci, je laisse deux lampes allumées sur le quai. Deux, pas vingt."]],
  'Marchande de fleurs':[[()=>SEA.se===3,"L'hiver, je vends du houx. Le chauffage de la serre, je préfère ne pas en parler."],[()=>SEA.se===0,"Au printemps, tout pousse d'un coup. C'est ma saison : zéro chauffage, pleine lumière."]],
  'Touriste':[[()=>SKY.fog>.4,"Avec ce brouillard, je ne trouve même plus la rivière. Elle était bien par là, pourtant ?"],[()=>SKY.dark>.4,"Votre ville est jolie, la nuit. Peu de lampes, mais bien placées."]],
  'Promeneur':[[()=>SKY.dark>.4,"La nuit, on voit ce qui reste allumé. Regarde les fenêtres : c'est le talon de la ville."]],
  'Ouvrier':[[()=>SKY.T>27,"Par cette chaleur, on commence à 6 h et on s'arrête à 14 h. Les climatisations, elles, font des heures supplémentaires."]]};
