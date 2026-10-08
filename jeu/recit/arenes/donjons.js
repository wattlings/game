/* Wattlings · jeu/recit/arenes/donjons.js
   Le plan des huit arènes, en mini-donjons à la Zelda : des salles, des portes (ouvertes, à clé, à énigme, du champion),
   un coffre qui contient la petite clé, une énigme liée à l'étape, trois dresseurs et le champion dans la dernière salle.
   Le moteur est dans jeu/epreuves/donjons.js. On peut toujours passer le donjon et aller directement au champion.

   Une salle : [colonne, rang, largeur, hauteur, nom] sur une grille de 3 × 3 ; une salle fait 13 × 9 cases utiles (l'écran).
   Une porte : [salle, salle, sorte] ; sorte : o ouverte, k à clé, e ouverte par l'énigme, b du champion (3 dresseurs battus),
   x un pont qui apparaît quand l'énigme est résolue.
   Le contenu d'une salle : des éléments [sorte, x, y, …] en coordonnées de la salle (1 à 13 de gauche à droite, 1 à 9 de haut en bas) :
     d : un dresseur (n° 0 à 2, direction) ; c : le champion ; k : le coffre (la petite clé) ; x : un obstacle du thème ;
     o : un objet de décor (sa sorte, voir DG_DECOR) ; t : un panneau (son texte) ; puis les pièces de l'énigme de l'arène. */

const DONJONS={
  1:{titre:'Le Puy du Cadastre',salles:[[1,2,1,1,'Hall des plans'],[0,2,1,1,'Salle des bornes'],[0,1,1,1,'Salle des plaques'],[1,1,1,1,'Galerie des cartes'],[1,0,1,1,'Estrade']],
    portes:[[0,1,'o'],[1,2,'e'],[2,3,'k'],[3,4,'b']],entree:0,
    enigme:{sorte:'bornes',salle:1,texte:"Les bornes du géomètre : pousse une borne sur chaque marque, pour fermer le périmètre autour de la maquette du site. Le logement du gardien et le lampadaire restent dehors.",
      indice:"Quatre marques, quatre coins autour de la maquette. Pousse une borne en marchant contre elle. Coincée ? Le plan de bornage, près de la porte, remet tout en place.",
      bravo:"Clac ! Le périmètre est fermé : le site, rien que le site. Une porte s'ouvre au nord."},
    contenu:[
      [['o','plan',3,1],['o','plan',11,1],['o','theodolite',2,7],['o','theodolite',12,7],['t',7,3,"Puy du Cadastre. Un périmètre, c'est ce qu'on suit. Le reste, on l'ignore poliment."]],
      [['d',0,12,8,'left'],['o','maquette',6,4],['o','maquette',7,4],['o','maquette',8,4],['o','maquette',6,5],['o','maquette',7,5],['o','maquette',8,5],['o','gardien',1,1],['o','lampadaire',13,1],
       ['cible',4,3,'A'],['cible',10,3,'B'],['cible',4,7,'C'],['cible',10,7,'D'],['bloc',4,5,'borne'],['bloc',10,5,'borne'],['bloc',7,2,'borne'],['bloc',7,7,'borne'],['reset',12,9,'Le plan de bornage']],
      [['d',1,2,5,'right'],['k',11,2],['o','compteur',5,1],['o','compteur',7,1],['o','compteur',9,1],['o','plan',13,8]],
      [['d',2,12,5,'left'],['o','carte',3,1],['o','carte',5,1],['o','carte',9,1],['o','carte',11,1],['x',3,7],['x',11,7],['x',3,3],['x',11,3]],
      [['c',7,3],['o','plan',2,1],['o','plan',12,1],['o','theodolite',2,7],['o','theodolite',12,7]]]},
  2:{titre:'La centrale des Flux',salles:[[0,2,1,1,'Sas'],[1,2,1,1,'Salle des compteurs'],[1,1,1,1,'Salle du mandat'],[2,1,1,1,'Salle des serveurs'],[2,0,1,1,'Poste de M. Relève']],
    portes:[[0,1,'o'],[1,2,'e'],[2,3,'k'],[3,4,'b']],entree:0,
    enigme:{sorte:'cables',salle:1,texte:"Raccorder les flux : fais pivoter les dalles de câble pour relier le Linky au poste Enedis. Quand c'est juste, les données circulent.",
      indice:"Touche une dalle pour la faire tourner d'un quart de tour. Le câble part du Linky, à gauche, et doit arriver au poste Enedis, en haut à droite, sans coupure.",
      bravo:"Les paquets de données filent le long du câble : Linky, Enedis, et bientôt l'EMS. La porte du nord s'ouvre."},
    contenu:[
      [['o','gazpar',2,2],['o','linky',12,2],['o','serveur',2,8],['t',7,3,"Centrale des Flux. Aucune donnée ne passe sans mandat. Aucun mandat ne passe sans signature."]],
      [['d',0,12,8,'left'],['o','linky',2,6],['o','enedis',9,3],['o','serveur',13,1],['o','serveur',1,1],
       ['cable',4,6,'h',1],['cable',5,6,'c3',0],['cable',5,5,'v',0],['cable',5,4,'v',1],['cable',5,3,'c1',2],['cable',6,3,'h',1],['cable',7,3,'h',0]],
      [['d',1,2,5,'right'],['k',7,2],['o','bureau',6,2],['o','bureau',8,2],['o','horloge',12,1]],
      [['d',2,7,7,'up'],['o','serveur',2,2],['o','serveur',2,4],['o','serveur',2,6],['o','serveur',12,2],['o','serveur',12,4],['o','serveur',12,6]],
      [['c',7,3],['o','serveur',2,1],['o','serveur',12,1],['o','linky',2,7],['o','gazpar',12,7]]]},
  3:{titre:'Le laboratoire du Dr Doublon',salles:[[1,2,1,1,'Vestiaire'],[1,1,1,1,'Couloir des dalles'],[0,1,1,1,'Serre des bocaux'],[2,1,1,1,'Salle du tamis'],[1,0,1,1,'Paillasse du Dr Doublon']],
    portes:[[0,1,'o'],[1,2,'e'],[1,3,'k'],[1,4,'b']],entree:0,
    enigme:{sorte:'dalles',salle:1,texte:"Le couloir des dalles : chaque dalle affiche une mesure. Ne marche que sur les valeurs plausibles. Un pic, un trou, un doublon, une valeur négative : la dalle s'effondre.",
      indice:"Une consommation de ce site tourne autour de 18 kW à cette heure-là. 999,9, « — », « ×2 » ou un nombre négatif : on n'y pose pas le pied.",
      bravo:"Tu as traversé sans une seule donnée fausse sous les pieds. Les dalles se stabilisent, et la serre s'ouvre à l'ouest."},
    contenu:[
      [['o','blouse',2,1],['o','blouse',3,1],['o','paillasse',11,2],['o','paillasse',12,2],['t',7,3,"Laboratoire. Blouse obligatoire. Esprit critique aussi."]],
      [['dalles',1,6,13,3]],
      [['d',0,12,3,'left'],['d',1,2,8,'up'],['k',2,2],['o','bocal-trou',5,1],['o','bocal-doublon',7,1],['o','bocal-pic',9,1],['o','bocal-recule',5,9],['o','bocal-boucle',9,9]],
      [['d',2,7,7,'up'],['o','tamis',6,3],['o','tamis',7,3],['o','tamis',8,3],['o','paillasse',2,2],['o','paillasse',12,2],['o','tableau',11,1]],
      [['c',7,3],['o','paillasse',2,2],['o','paillasse',3,2],['o','paillasse',11,2],['o','paillasse',12,2],['o','bocal-unite',2,7],['o','bocal-heure',12,7]]]},
  4:{titre:'Les archives de Mlle Hiérarchie',salles:[[0,2,1,1,'Accueil'],[1,2,1,1,'Labyrinthe des rayonnages'],[1,1,1,1,'Salle de classement'],[0,1,1,1,'Salle des conversions'],[2,1,1,1,'Réserve'],[1,0,1,1,'Salle de lecture']],
    portes:[[0,1,'o'],[1,2,'o'],[2,3,'o'],[2,4,'e'],[2,5,'k']],entree:0,
    enigme:{sorte:'cartons',salle:2,texte:"Ranger l'arbre : pousse chaque carton sur son étage, du plus large en haut au plus fin en bas : Site, Point de comptage, Compteur, Mesures.",
      indice:"Les étagères sont à droite, numérotées de 1 (en haut) à 4 (en bas). Site en 1, Point de comptage en 2, Compteur en 3, Mesures en 4. Le tampon « À reclasser » remet les cartons à leur place.",
      bravo:"L'arbre est rangé : site, point, compteur, mesures. La réserve s'ouvre à l'est."},
    contenu:[
      [['o','comptoir',6,2],['o','comptoir',7,2],['o','comptoir',8,2],['o','lampe',2,1],['o','lampe',12,1],['t',7,4,"Archives. Silence : on range."]],
      [['d',0,7,2,'down'],['x',3,3],['x',4,3],['x',5,3],['x',9,3],['x',10,3],['x',11,3],['x',3,7],['x',4,7],['x',5,7],['x',6,7],['x',8,7],['x',9,7],['x',10,7],['x',11,7],['o','echelle',13,5]],
      [['cible',11,2,'1 · Site'],['cible',11,4,'2 · Point'],['cible',11,6,'3 · Compteur'],['cible',11,8,'4 · Mesures'],
       ['bloc',4,3,'Site'],['bloc',7,5,'Point de comptage'],['bloc',4,7,'Compteur'],['bloc',7,8,'Mesures'],['reset',2,9,'Le tampon « À reclasser »'],['o','etagere',12,2],['o','etagere',12,4],['o','etagere',12,6],['o','etagere',12,8]],
      [['d',1,12,5,'left'],['o','balance',6,3],['o','lampe',2,1],['o','etagere',1,8],['o','etagere',2,8]],
      [['d',2,7,7,'up'],['k',11,2],['o','carton',2,2],['o','carton',3,2],['o','carton',2,3],['o','chariot',6,3],['o','etagere',12,7]],
      [['c',7,3],['o','lampe',3,6],['o','lampe',11,6],['o','etagere',1,2],['o','etagere',13,2],['o','table',5,6],['o','table',9,6]]]},
  5:{titre:"L'observatoire des Courbes",salles:[[1,2,1,1,'Coupole'],[2,2,1,1,'Salle de la signature'],[2,1,1,1,'Salle de la pointe'],[0,2,1,1,'Salle du talon'],[0,1,1,1,'Passerelle des étoiles'],[1,1,1,1,'Bureau du Pr Talon']],
    portes:[[0,1,'o'],[1,2,'o'],[0,3,'k'],[3,4,'x'],[4,5,'b']],entree:0,
    enigme:{sorte:'talon',salle:3,texte:"Le sol est une courbe de charge : une journée, heure par heure. Pose-toi sur le talon, le creux de la nuit, ce que le bâtiment consomme quand il dort.",
      indice:"Le talon, c'est le plus bas de la nuit, pas le pic de midi. Cherche le creux, entre minuit et 5 h.",
      bravo:"Le talon s'illumine, et un pont d'étoiles se déploie vers le nord."},
    contenu:[
      [['o','telescope',7,2],['o','ecran',2,1],['o','ecran',12,1],['t',7,5,"Observatoire. Une courbe ne ment pas. Elle se laisse mal lire."]],
      [['d',1,7,7,'up'],['o','projecteur',4,3],['o','projecteur',7,4],['o','projecteur',10,5],['o','ecran',2,1],['o','ecran',12,1]],
      [['d',2,2,5,'right'],['k',12,2],['o','ecran',6,1],['o','ecran',8,1],['o','thermometre',12,7]],
      [['d',0,12,3,'left'],['talon',1,6,12]],
      [['o','etoile',3,3],['o','etoile',9,2],['o','etoile',5,7],['o','etoile',11,6],['t',4,5,"Passerelle des étoiles. Chaque étoile est une mesure de nuit. Toutes pareilles : c'est bon signe."]],
      [['c',7,3],['o','ecran',2,1],['o','ecran',12,1],['o','telescope',2,7],['o','thermometre',12,7]]]},
  6:{titre:'Le manoir de la Nuit',salles:[[1,2,1,1,'Vestibule'],[0,2,1,1,'Couloir des portraits'],[0,1,1,1,'Salon des veilles'],[1,1,1,1,'Chaufferie'],[2,1,1,1,'Bibliothèque'],[2,0,1,1,'Tour de guet']],
    portes:[[0,1,'o'],[1,2,'o'],[2,3,'e'],[3,4,'o'],[4,5,'k']],entree:0,
    enigme:{sorte:'voyants',salle:2,texte:"Le salon des veilles : quatre voyants rouges brillent dans le noir. Trouve-les et éteins-les. Ils ne consomment presque rien. Ensemble, si.",
      indice:"Ta lampe éclaire autour de toi. Les voyants sont dans les coins du salon : touche-les pour les éteindre.",
      bravo:"Le dernier voyant s'éteint. Dans le silence, une porte grince à l'est."},
    contenu:[
      [['o','horloge',2,1],['o','portrait',6,1],['o','portrait',8,1],['o','fauteuil',12,2],['t',7,4,"Manoir de la Nuit. Ici, tout ce qui consomme brille. Ouvre l'œil."]],
      [['d',0,7,8,'up'],['o','portrait',3,1],['o','portrait',5,1],['o','portrait',9,1],['o','portrait',11,1],['o','armure',2,5],['o','armure',12,5]],
      [['voyant',1,1],['voyant',13,1],['voyant',1,9],['voyant',13,9],['o','fauteuil',5,4],['o','fauteuil',9,4],['o','tele',7,2]],
      [['d',1,7,7,'up'],['o','chaudiere',6,3],['o','chaudiere',7,3],['o','chaudiere',8,3],['o','tuyau',3,2],['o','tuyau',11,2]],
      [['d',2,7,7,'up'],['k',12,8],['o','etagere',2,2],['o','etagere',3,2],['o','etagere',11,2],['o','etagere',12,2],['o','lampe',7,2]],
      [['c',7,3],['o','lune',7,1],['o','horloge',2,1],['o','portrait',12,1]]]},
  7:{titre:'Le chantier du Chef Sobriété',salles:[[0,2,1,1,'Base vie'],[1,2,1,1,'Zone sobriété'],[2,2,1,1,'Zone efficacité'],[2,1,1,1,'Zone production'],[0,1,2,1,'Grue du chef']],
    portes:[[0,1,'o'],[1,2,'e'],[2,3,'o'],[3,4,'k']],entree:0,
    enigme:{sorte:'leviers',salle:1,texte:"Trois leviers, trois marches : Sobriété, Efficacité, Production. Abaisse-les dans le bon ordre. Le mauvais ordre fait tout remonter, et le chef soupire.",
      indice:"On réduit d'abord le besoin, puis on consomme mieux, puis on produit. Toujours dans cet ordre.",
      bravo:"Les trois leviers sont baissés dans l'ordre. La barrière de la zone efficacité se lève."},
    contenu:[
      [['o','casque',3,2],['o','casque',4,2],['o','cone',10,3],['o','cone',11,3],['o','betonniere',11,7],['t',7,4,"Base vie. Casque obligatoire. Bon sens aussi."]],
      [['d',0,12,8,'left'],['levier',4,2,'Efficacité',2],['levier',7,2,'Production',3],['levier',10,2,'Sobriété',1],['o','sacs',2,8],['o','sacs',3,8],['o','cone',6,6],['o','cone',8,6]],
      [['d',1,7,7,'up'],['o','echafaudage',3,2],['o','echafaudage',4,2],['o','echafaudage',10,2],['o','echafaudage',11,2],['o','sacs',2,8]],
      [['d',2,2,5,'right'],['k',12,2],['o','panneaupv',5,2],['o','panneaupv',6,2],['o','panneaupv',8,2],['o','panneaupv',9,2],['o','cone',12,8]],
      [['c',14,3],['o','grue',4,2],['o','grue',4,3],['o','grue',4,4],['o','betonniere',22,7],['o','sacs',8,8],['o','sacs',9,8],['o','cone',18,6],['o','cone',20,6],['o','echafaudage',24,2],['o','echafaudage',25,2]]]},
  8:{titre:'Le palais de la Preuve',salles:[[1,2,1,1,'Salle des pas perdus'],[0,2,1,1,'Greffe'],[1,1,1,1,'Salle de la balance'],[2,1,1,1,'Salle des témoins'],[1,0,1,1,"Salle d'audience"]],
    portes:[[0,1,'o'],[0,2,'k'],[2,3,'o'],[2,4,'e']],entree:0,
    enigme:{sorte:'balance',salle:2,texte:"La balance de la preuve : d'un côté l'année de référence, de l'autre l'année de suivi, plus douce. Pousse le poids de la météo sur le bon plateau pour comparer à conditions égales.",
      indice:"L'hiver de suivi a été plus doux : la référence doit être corrigée de la météo. Le poids « météo » va sur le plateau de la référence.",
      bravo:"La balance s'équilibre : on compare enfin à météo égale. Les portes de la salle d'audience s'ouvrent."},
    contenu:[
      [['o','colonne',2,2],['o','colonne',12,2],['o','colonne',2,7],['o','colonne',12,7],['o','banc',6,7],['o','banc',8,7],['t',7,4,"Palais de la Preuve. Ici, on ne croit que ce qu'on mesure."]],
      [['d',0,7,7,'up'],['k',11,2],['o','archives',2,2],['o','archives',3,2],['o','archives',2,4],['o','bureau',7,2]],
      [['o','balancecentre',7,3],['cible',4,4,'Référence'],['cible',10,4,'Suivi'],['bloc',7,7,'Météo'],['reset',2,9,'La cloche du greffier'],['o','colonne',2,2],['o','colonne',12,2]],
      [['d',1,2,5,'right'],['d',2,12,5,'left'],['o','thermometre',7,1],['o','jury',5,8],['o','jury',7,8],['o','jury',9,8]],
      [['c',7,3],['o','colonne',2,2],['o','colonne',12,2],['o','vitrail',5,1],['o','vitrail',9,1],['o','banc',4,7],['o','banc',10,7]]]}
};
/* l'énigme de la balance : le poids « météo » va sur le plateau de la référence ; les autres énigmes à cibles exigent leur étiquette */
const DG_CIBLE_OK={balance:(bloc,cible)=>cible==='Référence',cartons:(bloc,cible)=>cible.slice(4).startsWith(bloc.split(' ')[0]),bornes:()=>true};
