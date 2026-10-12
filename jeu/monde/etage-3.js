/* Wattlings · jeu/monde/etage-3.js
   Le 3e étage du bâtiment « Bureau » : 107 cases sur 33, d'après le plan fourni. 89 postes.
   (Moteur commun et légende des plans : monde/etage.js ; dessin : rendu/etage.js.) */
etageDeclarer('etage',{num:3,resume:'Les open spaces, Voltaire, Watterloo, le Perco (la cafétéria).',
  plan:[
'xxxxxxxxxxxxxxxxxxxWWWwwwWWwwwWWWWwwwWWWwwwWwwwWWwwwWwwwWWWWWWWWWWwwwWWWWWWwwwWWWWWwwWWwwWWWwwwWWwwwWWwwwWW',
'xxxxxxxxxxxxxxxxxxxWooooooooooooWoooooWoooooooooooooooooooWooooWooooooooWooooooooWooooooooWoooooooooooooooW',
'xxxxxxxxxxxxxxxxxxWWooooooooooooWoooooWoooooooooooooooooooWooooWooooooooWooooooooWooooooooWooooooooooooooow',
'xxxxxxxxxxxxxxxxxWWoooooooooooooWoooooWoooooooooooooooooooWooooWooooooooWooooooooWooooooooWooooooooooooooow',
'xxxxxxxxxxxxxxxxxWooooooooooooooWoooooWoooooooooooooooooooWooooWooooooooWooooooooWooooooooWoooooooooooooooW',
'xxxxxxxxxxxxxxxxWWooooooooooooooWWdWWWWoooooooooooooooooooWooooWooooooooWooooooooWooooooooWoooooooooooooooW',
'xxxxxxxxxxxxxxxxWooooooooooooooooooWooWoooooooooooooooooooWooooWooooooooWooooooooWooooooooWooooooooooooooow',
'xxxxxxxxxxxxxxxWWooooooooooooooooooWooWoooooooooooooooooooWooooWooooooooWooooooooWooooooooWooooooooooooooow',
'xxxxxxxxxxxxxxWWoooooooooooooooooooWooWoooooooooooooooooooWooooWooooooooWooooooooWooooooooWoooooooooooooooW',
'xxxxxxxxxxxxxxWWWWWWoooooooooooooooWoWWoooooooooooooooooooWWhWWWoooooooooooooooooWWWWWWWWdWoooooWWWWWWWWWWW',
'xxxxxxxxxxxxxWWooooWooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooWoooooooooW',
'xxxxxxxxxxxxWWooooodooBBBBBBBBBBBBBBBoWWWWWWWWWWWWWWWWdWWWWWWWWWWWBBBBBBoWWWWWWooWWWWWWWdWWoooooWooooooooow',
'xxxxxxxxxxxxWooooooWooBBBBBBBBBBBBBBBoWccccccccccccccWoorrrrrrrrooBBBBBBoWcccccWcWcccWooooWoooooWooooooooow',
'xxxxxxxxxxxWWWWWWWWWooBBBBBBBBBBBBBBBoWccccccccccccccWoorrrrrrrrooBBBBBBoWcccccWcWcccWooooWWWWWoWooooooooow',
'xxxxxxxxxxWWoooooooWooBBBBBBBBBBBBBBBoWccccccccccccccWoWWWWWWWWWooBBBBBBoWcccccWcWcccWooooWoooWodoooooooooW',
'xxxxxxxxxxWoooooooohooBBPPBBPPBBPPBBBoWccccccccccccccWoWrrrrrrrrooBBBBBBoWcccccdcdcccWooooWoooWoWWWWWWWWWWW',
'xxxxxxxxxWWooooooooWooWoooooooooooWoooWccccccccccccccWoWrrrrrrrrooBBPPBBoWWWWWWWdWWWWWWWWWWoooWoWoooooooooW',
'xxxxxxxxWWWWWWWWWWWWooWoooooooooooWoooWccccccccccccccWoWWWWWWWWWWoWooooWoWcccccccWoooWooooWoooWodooooooooow',
'xxxxxxxxWWooooooooodooWoooooooooooWoooWccccccccccccccWooooooooooooWooooWoWcccccccWoooWooooWoooWoWooooooooow',
'xxxxxxxWWooooooooooWooWWWWWWgggWWWWoooWccccccccccccccWooooooooooooWooooWoWcccccccWoooWooooWoooWoWoooooooooW',
'xxxxxxWWWWWWWWWWWWWWooooooooooooooooooWWWWWWWddWWWWWWWWWWWWWWWWWWoWoooWooWWWWWWWWWoWWWWWdWWWhWWoWWWWWWWWWWW',
'xxxxxxWWooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooW',
'xxxxxWWoooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooW',
'xxxxxWoooooooooooooWWWWdWfffffffddfffffffffWoooooooooWWWdWWWWdWWdWWWWooooooooooooooooooWWWWdWdWWWWoooooooow',
'xxxxWWoooooooooooooWooooWqqqqqqqqqqqqqqqqqqWoooooooooWooooWooooWooooWooooooooooooooooooWooooWooooWoooooooow',
'xxxWWooooooooooooooWooooWqqqqqqqqqqqqqqqqqqWoooooooooWooooWooooWooooWooooooooooooooooooWooooWooooWoooooooow',
'xxxWoooooooooooooooWooooWqqqqqqqqqqqqqqqqqqWoooooooooWooooWooooWooooWooooooooooooooooooWooooWooooWooooooooW',
'xxWWoooooooooooooooWooooWqqqqqqqqqqqqqqqqqqWoooooooooWooooWooooWooooWooooooooooooooooooWooooWooooWooooooooW',
'xxWooooooooooooooooWooooWqqqqqqqqqqqqqqqqqqWoooooooooWooooWooooWooooWooooooooooooooooooWooooWooooWoooooooow',
'xWWooooooooooooooooWooooWqqqqqqqqqqqqqqqqqqWoooooooooWooooWooooWooooWooooooooooooooooooWooooWooooWoooooooow',
'WWoooooooooooooooooWooooWqqqqqqqqqqqqqqqqqqWoooooooooWooooWooooWooooWooooooooooooooooooWooooWooooWoooooooow',
'WooooooooooooooooooWooooWqqqqqqqqqqqqqqqqqqWoooooooooWooooWooooWooooWooooooooooooooooooWooooWooooWooooooooW',
'WWWwwwWWWwwwWWwwwWWWWwwWWWwwwWwwWWWwwWWwwwWWWwwWWwwWWWWwwWWWwwWWWwwWWWwwwWwwwWWwwwWwwwWWWwwWWWwwWWWwwWWwwWW'],
  meubles(){
    const {M,m,poste,ilot,ilot3,seul,chaises}=etageAtelier();

    // ---- espaces de bureaux (89 postes)
    ilot(20,3,7,[3,5,7]);ilot(27,3,7,[3,5,7]);                                  // nord-ouest
    ilot(40,2,6,[2,4,6]);ilot(46,2,6,[2,4,6]);ilot(52,2,6,[2,4,6]);              // nord
    seul(61,2,'down');                                                           // le bureau fermé
    ilot(65,2,4,[2,4]);seul(65,8,'up');                                          // bureau violet
    ilot(74,2,4,[2,4]);seul(79,8,'up');                                          // bureau rose
    ilot(92,3,5,[3,5]);ilot(99,3,5,[3,5]);                                       // nord-est
    [6,13].forEach(x=>{m('table',x,26,{w:4,h:5,bois:1});[28,30].forEach(y=>{poste(x-1,y,'right');poste(x+4,y,'left')});poste(x+1,25,'down')});   // sud-ouest
    m('table',44,25,{w:3,h:2,bois:1});poste(44,24,'down');poste(47,26,'left');  // espace calme
    m('table',49,25,{w:3,h:2,bois:1});poste(51,24,'down');poste(48,26,'right');
    seul(47,31,'up');seul(50,31,'up');
    ilot3(70,25,29,[25,27,29]);ilot3(76,25,29,[25,27,29]);ilot3(82,25,29,[25,27,29]);   // sud (un passage entre chaque îlot)
    m('table',100,25,{w:4,h:6,bois:1});[27,28].forEach(y=>{poste(99,y,'right');poste(104,y,'left')});poste(101,24,'down');poste(102,31,'up');   // sud-est

    // ---- salles de réunion : une table blanche, quelques chaises, l'écran au mur indiqué
    m('table',34,2,{w:3,h:2});chaises([[34,1],[36,1]],'down');chaises([[33,2],[33,3]],'right');m('ecran',38,2,{h:2,mur:'e'});   // Voltaire
    m('table',84,3,{w:4,h:4});chaises([[85,2],[86,2]],'down');chaises([[85,7],[86,7]],'up');chaises([[88,4],[88,5]],'left');m('ecran',81,4,{h:2,mur:'w'});   // Watterloo
    m('table',99,11,{w:5,h:2});chaises([[100,10],[102,10]],'down');chaises([[98,11]],'right');chaises([[104,11]],'left');m('ecran',100,15,{w:3,mur:'s'});   // Jouliette
    m('table',99,17,{w:5,h:2});chaises([[100,16],[102,16]],'down','haute');chaises([[98,17]],'right','haute');chaises([[104,17]],'left','haute');m('ecran',100,20,{w:3,mur:'s'});   // Ampérium
    const salle=(x,mur,st)=>{   // les salles du sud : 4 cases de large, table au milieu, écran à l'est ou à l'ouest
      m('table',x+1,26,{w:2,h:4});chaises([[x+1,25]],'down',st);chaises([[x+2,30]],'up',st);
      if(mur==='e'){chaises([[x,26],[x,28]],'right',st);m('ecran',x+4,27,{h:2,mur:'e'})}else{chaises([[x+3,26],[x+3,28]],'left',st);m('ecran',x-1,27,{h:2,mur:'w'})}};
    salle(20,'w','haute');salle(54,'e');salle(64,'e');salle(88,'w');salle(93,'e');   // Ohméga, Tempête, Bobine, Dynamo, Pile Poil
    // Veille (le repos) : pas de table, pas d'écran
    m('canape',59,31,{w:3,d:'up',col:'#9ba0aa'});m('fatboy',59,26);m('pouf',60,28,{col:'#e2573b'});m('pouf',62,29,{col:'#f2c12e'});m('ballon',62,25);
    // le Nid et le Terrier (les alcôves) : écran au mur, table blanche, une banquette de chaque côté
    m('table',86,13,{w:2,h:2});m('banquette',86,12,{w:2,d:'down'});m('banquette',86,15,{w:2,d:'up'});m('ecran',85,13,{h:2,mur:'w'});
    m('table',86,18,{w:2});m('banquette',86,17,{w:2,d:'down'});m('banquette',86,19,{w:2,d:'up'});m('ecran',85,18,{mur:'w'});

    // ---- le Perco (la cafétéria)
    // la cuisine occupe tout le mur est, du nord au sud
    m('frigo',42,24);m('comptoir',42,25);m('vaisselle',42,26);m('evier',42,27);m('comptoir',42,28);m('microondes',42,29);m('cafe',42,30);m('cafe',42,31);
    // la grande table en bois, dans le sens nord-sud, un bout contre le mur sud ; on longe la cuisine par la colonne 41
    m('table',38,28,{w:2,h:4,bois:1});chaises([[37,28],[37,29],[37,30],[37,31]],'right');chaises([[40,28],[40,29],[40,30],[40,31]],'left');
    m('armoire',31,31,{w:3});
    // trois tables rondes alignées sur l'armoire, un passage entre elles (la dernière n'a pas de chaise côté est : la grande table est là)
    [28,32,36].forEach(x=>{m('rond',x,28);chaises([[x,27]],'down');chaises([[x,29]],'up');chaises([[x-1,28]],'right');if(x<36)chaises([[x+1,28]],'left')});
    // le coin salon, contre le mur ouest : canapé, table basse, deux fauteuils verts en face ; plus au nord l'écran et le babyfoot
    m('canape',25,29,{h:3,d:'right',col:'#9ba0aa'});m('tbasse',26,30);chaises([[27,29],[27,31]],'left','verte');
    m('ecran',24,25,{h:2,mur:'w'});m('babyfoot',26,25,{w:2});

    // ---- sanitaires
    // le bloc central (d'après le croquis) : un petit hall commun au sud ; de chaque côté une cabine au nord, une cabine en long
    // au centre qui ouvre sur ses toilettes, et les lavabos le long du mur extérieur
    m('cabine',41,12,{w:3,h:2,porte:'s'});m('cabine',44,12,{w:2,h:5,porte:'w'});m('lavabos',39,14,{h:5,mur:'w',n:3});m('serviettes',39,13,{mur:'w'});m('poubelle',39,19);   // femmes
    m('cabine',46,12,{w:2,h:5,porte:'e'});m('cabine',48,12,{w:3,h:2,porte:'s'});m('urinoir',51,12);m('lavabos',52,14,{h:5,mur:'e',n:3});m('serviettes',52,13,{mur:'e'});m('poubelle',52,19);   // hommes
    m('cabine',74,12,{w:2,h:2,porte:'s'});m('urinoir',77,12);m('lavabos',75,15,{w:2,mur:'s',n:2,savon:0});   // hommes (est)
    m('pmr',83,12);                                                                                      // PMR
    m('cabine',74,18,{w:2,h:2,porte:'n'});m('cabine',76,18,{w:2,h:2,porte:'n'});                       // femmes (est)

    // ---- casiers, ménage, reprographie
    m('casiers',36,6,{w:2,d:'down'});m('casiers',37,7,{d:'left'});
    m('casiers',35,17,{h:2,d:'right'});
    m('casiers',82,17,{w:3,d:'down'});
    m('casiers',91,12,{w:2,d:'up'});
    m('casiers',8,21,{w:11,d:'down'});
    m('chariot',15,10);m('balais',16,10);m('seau',14,12);
    m('imprimante',13,18,{w:2});m('fournitures',16,18,{w:2});
    return M;
  },
  // les salles et les open spaces (moquette claire) ; tout le reste de la moquette est couloir (moquette foncée)
  salles:[[0,1,31,8],[33,1,37,4],[36,6,37,8],[39,1,57,8],[59,1,62,8],[64,1,71,8],[73,1,80,8],[82,1,89,8],[91,1,105,8],
  [0,10,18,12],[0,14,18,16],[0,18,18,19],[23,16,33,18],[86,12,89,15],[86,17,89,19],[91,14,93,19],[82,17,84,19],[97,10,105,14],[97,16,105,19],
  [0,23,18,31],[20,24,23,31],[44,23,52,31],[54,24,57,31],[59,24,62,31],[64,24,67,31],[69,23,86,31],[88,24,91,31],[93,24,96,31],[98,23,105,31]],
  plaques:[['VOLTAIRE',35,5],['WATTERLOO',82,9],['JOULIETTE',96,12],['AMPERIUM',96,18],['OHMEGA',20,23],['LE PERCO',25,23],['TEMPETE',53,23],['VEILLE',59,23],['BOBINE',65,23],['DYNAMO',88,23],['PILE POIL',94,23],
  ['WC F',42,20],['WC H',47,20],['WC',78,11],['NID',86,11],['TERRIER',86,20],['RGT',93,20]],
  // la façade ouest est en biais, avec trois fenêtres ; au-delà, le dehors
  biais:[{a:[20.45,0],b:[0,32.27],fen:[[2.2/32.27,5.6/32.27],[22.6/32.27,25.2/32.27],[27.4/32.27,30.2/32.27]]}],
  dehors:[[[0,0],[20.45,0],[0,32.27]]],
  arrivee:[29,16],ascenseurs:[[24,15],[25,15],[28,15],[29,15],[32,15],[33,15]],service:[[68,16],[69,16]],
  sas:{portes:[28,30,19],lecteur:[31,19]},
  fermes:{'60,9':["La porte est fermée. Une étiquette : « Bureau. Merci de frapper. »","Tu frappes. Personne. Le bureau a des fenêtres sur le couloir… ah non, aucune. Mystère complet."],
    '19,15':["RGT : local technique. Fermé à clé.","Derrière la porte, quelque chose ronronne. Probablement le réseau. Ou un chat. Personne n'a jamais vérifié."],
    '92,20':["RGT : local technique. Fermé à clé.","Derrière la porte, quelque chose ronronne. Probablement le réseau. Ou un chat. Personne n'a jamais vérifié."]},
  escalier:()=>["Escalier de secours. Il ne sert qu'en cas d'alarme.","Certains le prennent quand même pour garder la forme. Leur consommation électrique : zéro. Leur dignité dans les marches du 3e : variable."]
});
