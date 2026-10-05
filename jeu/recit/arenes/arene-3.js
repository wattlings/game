/* Wattlings · jeu/recit/arenes/arene-3.js
   Arène 3 · Fiabiliser — Arène du Tamis : couleurs, champion (Dr Doublon), ses répliques, les trois dresseurs et leurs questions.
   Une question : Q("question", "bonne réponse", "explication", "mauvaise réponse 1", "pourquoi", "mauvaise réponse 2", "pourquoi"). */

const ARENE_3={id:3,badge:'Fiabiliser',name:'Arène du Tamis',champ:'Dr Doublon',theme:'labo',col:'#2f9e7a',wall:'#eef5f1',b:L.arena[3],
  cpal:{shirt:'#f7f0dc',pants:'#2c2c34',hair:'#9a9aa2',style:'boucle',glasses:1,tie:'#2f9e7a'},
  cIntro:["Arène du Tamis. Mes sept spécimens sont les pires anomalies de la région, élevées en bocal.","Corrige-les une par une. Et n'oublie pas : on ne corrige jamais en silence."],
  cWin:["Sept sur sept. Mes bocaux sont vides et tes données sont propres.","Badge Fiabiliser. Garde toujours la donnée brute, avec son statut."],
  next:"Badge Fiabiliser ! On détecte sur des données fiabilisées, et on garde toujours la brute. Maintenant, il faut ranger tout ça : passe à l'armoire à archives du bureau, puis à l'Arène des Archives.",
  tr:[
   {n:'Laborantin Noé',pal:{shirt:'#f7f0dc',pants:'#6d7896',hair:'#333',glasses:1},intro:"Halte. Rien n'entre au labo sans contrôle. Toi non plus.",lose:"Contrôle passé. Suivant.",qs:[
    Q("Avant d'analyser, une donnée doit être…","Complète, sans doublon, plausible et cohérente entre sources","Les quatre contrôles de base.","Récente, arrondie et en couleur","Joli, mais ça ne prouve rien.","Validée par le fournisseur","Le fournisseur facture ; il ne contrôle pas tes mesures."),
    Q("Au pas de 10 min, combien de mesures compte le jour du passage à l'heure d'été, en heure locale ?","138","La journée dure 23 h : 23 × 6 = 138. Ce n'est pas un trou.","144","C'est une journée normale.","150","Ça, c'est le passage à l'heure d'hiver.")]},
   {n:'Contrôleuse Jade',pal:{shirt:'#f7f0dc',pants:'#2f6d34',hair:'#d9a441',style:'queue'},intro:"Stop ! Contrôle de plausibilité. Réfléchis avant de répondre.",lose:"Plausible. Très plausible, même.",qs:[
    Q("Tu reçois 22 500 pour la puissance d'une école à midi. Le plus probable ?","La valeur est en W : 22,5 kW","Pour un raccordement de 60 kVA, 22 500 kW est impossible. Toujours vérifier l'unité.","L'école consomme 22 500 kW","Autant qu'une petite ville ? Non.","C'est un doublon","Un doublon répète une valeur, il ne la multiplie pas par mille."),
    Q("Une mesure indique 24 kW pendant 10 minutes. Quelle énergie ?","4 kWh","24 kW × 10/60 h = 4 kWh.","24 kWh","Il faudrait une heure entière à 24 kW.","240 kWh","On multiplie par 1/6 d'heure, pas par 10."),
    Q("Un pic à 999,9 kW dans une école de 60 kVA, c'est…","Un bug de mesure","Une valeur impossible physiquement : on ne l'analyse pas, on la rejette.","Un record de consommation","Le raccordement ne le permet pas.","La cantine un jour de frites","Même avec beaucoup de frites.")]},
   {n:'Archiviste Paul',pal:{shirt:'#cfe8dc',pants:'#6d7896',hair:'#8a5a2b'},intro:"Un moment. Ici, on garde tout. Surtout les erreurs.",lose:"Tu corriges sans rien cacher. Le docteur t'attend.",qs:[
    Q("Tu corriges un pic aberrant. Que fais-tu de la valeur brute ?","Tu la conserves, avec le statut « rejetée »","La correction doit rester traçable et réversible.","Tu l'écrases avec la valeur corrigée","Plus personne ne pourrait vérifier ta correction.","Tu la supprimes","Une correction qu'on ne peut pas expliquer, c'est une rumeur."),
    Q("Pourquoi stocker les horodatages en UTC ?","Pour que chaque mesure ait un horodatage unique, même les jours de changement d'heure","En heure locale, 2 h 00 à 2 h 50 existe deux fois le jour du passage à l'heure d'hiver.","Parce que c'est plus court","Ce n'est pas une question de place.","Parce que le distributeur l'impose","C'est surtout une question de bon sens."),
    Q("Le thermomètre affiche 45 °C. Que fait un bon médecin ?","Il vérifie d'abord le thermomètre","Une mauvaise mesure mène à un mauvais diagnostic.","Il conclut à une fièvre mortelle","Avant de paniquer, on contrôle l'instrument.","Il divise par deux","Corriger au hasard, c'est pire que ne rien faire.")]}]};
