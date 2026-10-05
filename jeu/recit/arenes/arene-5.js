/* Wattlings · jeu/recit/arenes/arene-5.js
   Arène 5 · Analyser — Arène des Courbes : couleurs, champion (Pr Talon), ses répliques, les trois dresseurs et leurs questions.
   Une question : Q("question", "bonne réponse", "explication", "mauvaise réponse 1", "pourquoi", "mauvaise réponse 2", "pourquoi"). */

const ARENE_5={id:5,badge:'Analyser',name:'Arène des Courbes',champ:'Pr Talon',theme:'courbes',col:'#f2a33a',wall:'#fbf3e4',b:L.arena[5],
  cpal:{shirt:'#c9791a',pants:'#1c2440',hair:'#ece6d6',style:'chauve',glasses:1,tie:'#1c2440'},
  cIntro:["Arène des Courbes. Ici, on lit une consommation comme un électrocardiogramme.","Trouve-moi le talon de ton site, puis on parlera degrés-jours, puissance et ratios."],
  cWin:["Tu sais lire le repos, les pics et le froid. Voici le badge Analyser.","La nuit tombe. C'est l'heure où les bâtiments vides se trahissent."],
  next:"Badge Analyser ! La nuit tombe : parfait pour une ronde. Va dans ton site et repère tout ce qui consomme alors que le bâtiment est vide. Il y a 4 dérives, dont une à la cave. Ensuite, direction l'Arène de la Nuit.",
  tr:[
   {n:'Analyste Lina',pal:{shirt:'#1a73c9',pants:'#2c2c34',hair:'#d9a441'},intro:"Stop ! Avant le professeur, une lecture de courbe. Rapide.",lose:"Belle lecture. Continue.",qs:[
    Q("Le talon, c'est…","Ce que le bâtiment consomme quand il est vide","Ce qui tourne quand il n'y a personne : veilles, serveurs, froid, ventilation.","Le pic de consommation de midi","Ça, c'est la pointe.","La dernière ligne de la facture","Bien tenté."),
    Q("Une école consomme plus de la moitié de son électricité quand elle est…","Vide : nuits, week-ends, vacances","Le talon tourne 24 h/24 et l'école est vide plus de 80 % des heures de l'année.","Pleine, à midi","La pointe est haute mais elle dure peu.","En réunion de parents","Ce n'est pas si long. Quoique.")]},
   {n:'Statisticien Marc',pal:{shirt:'#f2a33a',pants:'#2f3a5c',hair:'#2b1d14',style:'boucle'},intro:"Halte. En moyenne, je gagne mes duels. En médiane aussi.",lose:"Me voilà dans la mauvaise moitié de la distribution.",qs:[
    Q("La pointe annuelle d'un site est de 57 kVA et il a souscrit 100 kVA. C'est…","Une sur-souscription","Il paie 43 kVA de puissance qu'il n'utilise jamais.","Un dépassement","Un dépassement, c'est quand la pointe dépasse le souscrit.","Le réglage idéal","La marge est beaucoup trop large."),
    Q("Pour comparer deux écoles de tailles différentes, on utilise plutôt…","Un ratio : kWh/m² ou kWh/élève","Le ratio neutralise l'effet de taille. Le contexte reste à regarder.","Les kWh totaux","La plus grande perd toujours.","Le montant de la facture","Il dépend aussi des prix et des contrats.")]},
   {n:'Cardiologue Ève',pal:{shirt:'#2c2c34',pants:'#2c2c34',hair:'#ece6d6',glasses:1},intro:"Un instant. Je lis les cœurs et les courbes. Montre-moi la tienne.",lose:"Rythme régulier. Le professeur va t'ausculter.",qs:[
    Q("Un jour à 3 °C de moyenne compte combien de DJU (base 18 °C) ?","15","18 − 3 = 15 DJU.","3","On part du seuil de 18 °C.","21","On soustrait, on n'additionne pas."),
    Q("Comme sur un électrocardiogramme, dans une courbe de charge on regarde…","Le repos, les pics et ce qui sort de l'ordinaire","Le talon, les heures d'occupation, les pointes… et le truc bizarre à 3 h du matin.","Seulement la valeur maximale","On raterait tout ce qui se passe la nuit.","Seulement la moyenne","La moyenne cache le rythme."),
    Q("Une journée de classe et une journée de vacances…","N'ont pas du tout le même profil","D'où l'intérêt de comparer des jours comparables.","Consomment exactement pareil","Le bâtiment vide ne chauffe ni n'éclaire comme le plein.","Ne se comparent jamais","On peut les comparer, justement pour voir le talon.")]}]};
