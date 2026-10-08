/* Wattlings · jeu/recit/arenes/arene-7.js
   Arène 7 · Agir — Arène du Chantier : couleurs, champion (Chef Sobriété), ses répliques, les trois dresseurs et leurs questions.
   Une question : Q("question", "bonne réponse", "explication", "mauvaise réponse 1", "pourquoi", "mauvaise réponse 2", "pourquoi"). */

const ARENE_7={id:7,badge:'Agir',name:'Arène du Chantier',champ:'Chef Sobriété',theme:'chantier',col:'#e2573b',wall:'#f6ece6',b:L.arena[7],
  cpal:{shirt:'#e2573b',pants:'#2c2c34',hair:'#2b1d14',hat:'#f2c12e',vest:1,skin:'#c68a5c'},
  cIntro:["Arène du Chantier. Avant de sortir la bétonnière, on éteint la lumière.","Budget : 12 000 €. Objectif : 4 000 € d'économies par an. Compose ton plan, dans le bon ordre."],
  cWin:["Sobriété, contrat, puis travaux. Voici le badge Agir.","Un an passe, les actions sont en place. Reste à prouver que ça a marché."],
  next:"Badge Agir ! Reste la question qui fâche : est-ce que ça a vraiment marché ? Renseigne-toi en ville sur la mesure et la vérification. Ensuite… rendez-vous à la dernière arène.",
  tr:[
   {n:'Apprenti Rémi',pal:{shirt:'#8a5a2b',pants:'#2f3a5c',hair:'#b8431f',hat:'#e2a13a',skin:'#fbe3d0'},intro:"Casque obligatoire ! Et question obligatoire.",lose:"T'es moins bleu que moi, dis donc.",qs:[
    Q("Laquelle de ces actions est de la sobriété ?","Baisser la consigne et régler les horaires de chauffage","Coût quasi nul, effet immédiat : c'est par là qu'on commence.","Changer la chaudière","Ça, c'est de l'efficacité, et c'est cher.","Poser des panneaux solaires","Ça, c'est de la production : en dernier."),
    Q("Isoler un bâtiment qu'on chauffe à vide tout le week-end, c'est…","Payer des travaux pour chauffer du vide : on règle d'abord","Avant d'investir, on arrête de gaspiller.","La priorité absolue","L'isolation vient après les réglages.","Inutile dans tous les cas","Utile, mais pas en premier.")]},
   {n:'Cheffe d’équipe Anna',pal:{shirt:'#f2c12e',pants:'#2f3a5c',hair:'#141216',hat:'#f7f0dc',skin:'#7a4e30',style:'afro',lash:1},intro:"On ne passe pas ! Enfin, si. Après une question.",lose:"Beau boulot. Le chef est sur l'estrade.",qs:[
    Q("Après la sobriété, quelle est la marche suivante ?","Le contrat : puissance souscrite ajustée, bonne option tarifaire","Beaucoup de sites paient une puissance qu'ils n'utilisent jamais.","Les panneaux solaires","La production vient en dernier.","Un nouvel audit","On a déjà de quoi agir."),
    Q("Une école installe beaucoup de panneaux solaires. Pourquoi son taux d'autoconsommation baisse-t-il ?","La production d'été tombe pendant les vacances, école fermée","Plus la production est grande, plus une part dépasse la consommation instantanée.","Les panneaux produisent moins","Ils produisent autant ; c'est la consommation qui manque.","Le réseau refuse le surplus","Le surplus est injecté, mais il n'est pas autoconsommé.")]},
   {n:'Conducteur de travaux Ali',pal:{shirt:'#2f6db5',pants:'#2f6db5',hair:'#141216',hat:'#c43d3d',skin:'#a8714a',beard:'#141216'},intro:"Stop chantier ! Un devis, ça se vérifie. Toi aussi.",lose:"Tes calculs tiennent debout. Comme mes murs.",qs:[
    Q("Des panneaux coûtent 40 000 € et rapportent 3 200 € par an. Temps de retour simple ?","12,5 ans","40 000 / 3 200 = 12,5 ans.","8 ans","Refais la division.","128 ans","On divise l'investissement par le gain annuel."),
    Q("Pourquoi la production vient-elle en dernier ?","Sinon, on produit pour alimenter le gaspillage","On réduit d'abord le besoin, puis on consomme mieux, puis on produit.","Parce que le soleil se lève tard","Poétique, mais non.","Parce que c'est interdit avant","Rien ne l'interdit ; c'est une question d'ordre."),
    Q("Dans un foyer, l'ordre logique des économies, c'est…","Éteindre, renégocier ses abonnements, puis isoler","Du moins cher au plus lourd : pour un bâtiment, c'est pareil.","Isoler, puis éteindre","On commence par ce qui ne coûte rien.","Renégocier, isoler, puis éteindre","Éteindre vient en premier : c'est gratuit.")]}]};
