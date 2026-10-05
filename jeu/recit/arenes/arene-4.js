/* Wattlings · jeu/recit/arenes/arene-4.js
   Arène 4 · Structurer — Arène des Archives : couleurs, champion (Mlle Hiérarchie), ses répliques, les trois dresseurs et leurs questions.
   Une question : Q("question", "bonne réponse", "explication", "mauvaise réponse 1", "pourquoi", "mauvaise réponse 2", "pourquoi"). */

const ARENE_4={id:4,badge:'Structurer',name:'Arène des Archives',champ:'Mlle Hiérarchie',theme:'archives',col:'#8a3b8f',wall:'#f3ecf4',b:L.arena[4],
  cpal:{shirt:'#5a2560',pants:'#2c2c34',hair:'#2b1d14',style:'queue',glasses:1},
  cIntro:["Arène des Archives. Chaque chose à sa place : un site, des points, des compteurs, des mesures.","Montre-moi que tu sais ranger sans rien perdre ni compter deux fois."],
  cWin:["Rangé, converti, agrégé. Rien en double. Voici le badge Structurer.","Avec des données justes et bien rangées, tu changes de métier."],
  next:"Tu as des données justes et bien rangées : te voilà Energy Manager ! Place à la deuxième moitié du métier. Apprends à lire une courbe, puis va à l'Arène des Courbes.",
  tr:[
   {n:'Magasinier Tom',pal:{shirt:'#6d7896',pants:'#2c2c34',hair:'#9a9aa2',glasses:1},intro:"Chut ! Et stop. On ne passe pas dans mes rayons sans savoir compter.",lose:"Tu comptes juste. File.",qs:[
    Q("Pourquoi ranger les données dans un modèle commun ?","Pour pouvoir les comparer et les additionner : même unité, bon pas de temps","On n'additionne pas des pommes et des m³.","Pour gagner de la place sur le disque","Ce n'est pas le but.","Pour que personne ne les retrouve","C'est déjà le cas des fichiers « final_v2 »."),
    Q("Le site a un compteur principal (80 MWh) et un sous-compteur cuisine (10 MWh). Consommation du site ?","80 MWh","La cuisine est déjà incluse dans le principal : on n'additionne pas un sous-compteur à son parent.","90 MWh","Tu comptes la cuisine deux fois.","70 MWh","On ne la retire pas non plus du total.")]},
   {n:'Documentaliste Zoé',pal:{shirt:'#2f9e7a',pants:'#6b4a2b',hair:'#b8431f'},intro:"Une seconde. Que tu comptes en minutes ou en jours, la journée dure pareil. Tu en es sûr ?",lose:"Tu changes de pas sans perdre un kWh. Bravo.",qs:[
    Q("Passer du pas 10 minutes au pas journalier…","Conserve l'énergie totale, mais cache les pointes","L'agrégation lisse la courbe : la puissance maximale visible baisse.","Réduit l'énergie totale","L'énergie ne disparaît pas en changeant d'échelle.","Augmente la précision","On perd du détail, on n'en gagne pas."),
    Q("Pour obtenir la consommation d'une journée à partir de 144 puissances au pas de 10 min, on…","Additionne les 144 valeurs et divise par 6","Chaque valeur dure 1/6 d'heure : E = somme des puissances / 6.","Additionne les 144 valeurs","On obtiendrait six fois trop.","Fait la moyenne des 144 valeurs","La moyenne donne des kW, pas des kWh.")]},
   {n:'Classeur Aimé',pal:{shirt:'#8a3b8f',pants:'#2f3a5c',hair:'#2b1d14',style:'carre'},intro:"Minute. Je m'appelle Aimé, et je classe. Oui, c'est mon vrai métier.",lose:"Bien classé. La championne est juste derrière.",qs:[
    Q("Pour comparer le gaz et l'électricité, on…","Convertit les m³ en kWh avec le coefficient de conversion","m³ × coefficient = kWh. Ensuite seulement, on additionne.","Convertit les kWh en m³","On ramène tout à l'énergie, pas au volume.","Compare directement les m³ et les kWh","Ce ne sont pas les mêmes unités."),
    Q("500 m³ de gaz, coefficient 11 kWh/m³. Combien de kWh ?","5 500 kWh","500 × 11 = 5 500 kWh.","45 kWh","On multiplie, on ne divise pas.","511 kWh","On n'additionne pas un volume et un coefficient."),
    Q("Classer les mêmes livres par auteur plutôt que par couleur, ça change…","Ce qu'on trouve facilement, pas les livres","Le classement ne change pas les données : il change ce qu'on peut en faire.","Le contenu des livres","Les livres sont les mêmes.","Rien du tout","Essaie de trouver Zola par couleur.")]}]};
