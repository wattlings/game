/* Wattlings · jeu/recit/arenes/arene-2.js
   Arène 2 · Collecter — Arène des Flux : couleurs, champion (M. Relève), ses répliques, les trois dresseurs et leurs questions.
   Une question : Q("question", "bonne réponse", "explication", "mauvaise réponse 1", "pourquoi", "mauvaise réponse 2", "pourquoi"). */

const ARENE_2={id:2,badge:'Collecter',name:'Arène des Flux',champ:'M. Relève',theme:'flux',col:'#00968a',wall:'#eef3f2',b:L.arena[2],
  /* les références de ce qu'affirment les questions (registre commun/donnees/sources.js) : listées dans le menu, onglet Sources */
  refs:['enedis-nmo-cf-015e','grdf-adict-faq','grdf-coefficient-conversion','mne-releve-compteur','mne-elements-facture','mne-taxes-facture','mne-prix'],
  cpal:{shirt:'#0d5f58',pants:'#1c2440',hair:'#2b1d14',hat:'#f2c12e'},
  cIntro:["Arène des Flux. À gauche l'électricité, à droite le gaz, et au milieu : le consentement.","Personne ne touche à mes données sans mandat. Remplis-le, signe-le, et on verra si elles coulent."],
  cWin:["Mandat en règle, données en route. Le badge Collecter est à toi.","Un conseil : surveille la date de fin du consentement. Les données, elles, ne préviennent pas."],
  next:"Badge Collecter ! Mais les données brutes sont sauvages : doublons, trous, pics absurdes. Apprends à les contrôler, puis va affronter le Dr Doublon à l'Arène du Tamis.",
  tr:[
   {n:'Releveur Sami',pal:{shirt:'#4a78c9',pants:'#333',hair:'#a0602a'},intro:"Stop ! Relevé de connaissances. Ça ne prendra qu'une question.",lose:"Relevé conforme. Continue.",qs:[
    Q("Par quels canaux la donnée d'énergie arrive-t-elle ?","Le télérelevé, les index et les factures","Même énergie, trois formes différentes.","Un seul : le compteur","Le compteur produit plusieurs données, par des chemins différents.","Le courrier, le téléphone et le fax","Presque. En 1987."),
    Q("Index gaz au 1er mars : 99 850 m³. Au 1er avril : 00 420 m³ (compteur à 5 chiffres). Consommation ?","570 m³","Le compteur a bouclé : (100 000 − 99 850) + 420 = 570 m³.","−99 430 m³","Une consommation négative ? Le compteur a simplement fait un tour.","420 m³","Il manque les 150 m³ d'avant le passage à zéro.")]},
   {n:'Releveuse Inès',pal:{shirt:'#e2573b',pants:'#333',hair:'#333',hat:'#1c6fb3'},intro:"Pas si vite. Le gaz, ça se compte en m³ et ça se paie en kWh. Tu suis ?",lose:"Tu convertis sans trembler. Vas-y.",qs:[
    Q("En janvier, ton site consomme 4 000 m³ de gaz avec un coefficient de 11,2 kWh/m³. Combien de kWh ?","44 800 kWh","kWh = m³ × coefficient = 4 000 × 11,2.","357 kWh","On multiplie, on ne divise pas.","4 000 kWh","Ça, ce sont des m³."),
    Q("Au pas de 10 minutes, combien de points compte une journée de courbe de charge électrique ?","144","6 points par heure × 24 heures.","24","Ce serait un point par heure.","1 440","Ce serait un point par minute."),
    Q("Pour obtenir une consommation à partir d'index, on…","Soustrait deux relevés","L'index est le compteur qui tourne : la différence entre deux relevés donne la consommation.","Additionne deux relevés","On obtiendrait un nombre sans signification.","Multiplie l'index par le prix","L'index n'est pas une consommation.")]},
   {n:'Comptable Rose',pal:{shirt:'#00968a',pants:'#2c2c34',hair:'#d9a441',style:'long'},intro:"Minute. Une facture, ça se lit. Montre-moi.",lose:"Tes comptes sont justes. Le champion t'attend.",qs:[
    Q("Ton site consomme 10 % d'électricité en moins. Quelle ligne de la facture ne baisse pas ?","L'abonnement","L'abonnement (et la part fixe de l'acheminement) ne dépend pas des kWh.","La fourniture","Elle est proportionnelle aux kWh.","L'accise","Elle aussi suit les kWh."),
    Q("La somme de la courbe de charge de janvier ne correspond pas à la facture « janvier ». Première chose à vérifier ?","Que les deux couvrent bien la même période","La facture va souvent du 14 au 13 : elle ne suit pas le mois civil.","Que le compteur n'est pas en panne","Avant d'accuser le compteur, on aligne les périodes.","Que la facture n'est pas une erreur","Possible, mais on vérifie d'abord les dates."),
    Q("Que donne la facture que la courbe de charge ne donne pas ?","Le coût en euros","Avec du retard, et sur des périodes qui ne suivent pas les mois.","La puissance à chaque instant","Ça, c'est la courbe de charge.","La météo du jour","Ni l'une ni l'autre.")]}]};
