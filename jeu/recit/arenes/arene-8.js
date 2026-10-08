/* Wattlings · jeu/recit/arenes/arene-8.js
   Arène 8 · Mesurer — Arène de la Preuve : couleurs, champion (Mme Joule), ses répliques, les trois dresseurs et leurs questions.
   Une question : Q("question", "bonne réponse", "explication", "mauvaise réponse 1", "pourquoi", "mauvaise réponse 2", "pourquoi"). */

const ARENE_8={id:8,badge:'Piloter',name:'Arène de la Preuve',champ:'Mme Joule',theme:'preuve',col:'#c9a227',wall:'#f7f2e2',b:L.arena[8],
  cpal:{shirt:'#8a3b8f',pants:'#2f3a5c',hair:'#9a9aa2',glasses:1,skin:'#e0ac7e',style:'carre',bun:1,lash:1},
  cIntro:["Alors, {name}. Tu croyais que la dernière championne serait une inconnue ?","Arène de la Preuve. Une action n'a marché que si on le prouve à conditions égales. Convaincs-moi."],
  cWin:["Preuve faite. Tu as bouclé les 8 étapes : voici le badge Mesurer.","Passe me voir au bureau. J'ai une nouvelle à t'annoncer."],
  next:"",
  tr:[
   {n:'Greffier Louis',pal:{shirt:'#1c2440',pants:'#1c2440',hair:'#9a9aa2',tie:'#c43d3d',skin:'#e8b98f',hat:'#1c2440',hatType:'kippa'},intro:"Silence dans la salle ! Le candidat est prié de répondre.",lose:"La cour prend note. Avancez.",qs:[
    Q("Vérifier qu'une action a marché, ça se fait…","À conditions comparables","Sinon, on attribue à l'action ce qui revient à la météo.","En regardant la facture suivante","Elle dépend aussi du climat et des prix.","En demandant à celui qui a fait les travaux","Il trouvera que ça a très bien marché."),
    Q("À partir de quelle surface tertiaire un site est-il concerné par le décret tertiaire ?","1 000 m²","Au moins 1 000 m² d'activités tertiaires, surfaces cumulées sur le site.","500 m²","Le seuil est plus haut.","5 000 m²","Le seuil est plus bas.")]},
   {n:'Experte Clara',pal:{shirt:'#2f9e7a',pants:'#2c2c34',hair:'#d9a441',style:'carre',skin:'#6b4128',lash:1},intro:"Objection ! Je conteste tes économies. Défends-les.",lose:"Objection retirée.",qs:[
    Q("Avec quoi corrige-t-on une consommation de chauffage pour la comparer d'une année à l'autre ?","Les DJU (degrés-jours unifiés)","C'est le principe de la mesure et vérification.","Le prix du gaz","Le prix ne change pas les kWh.","Le nombre de factures","Sans rapport avec le climat."),
    Q("L'hiver a été doux : le gaz baisse de 12 % dans toute la ville, sans aucune action. C'est…","L'effet de la météo","Tout le monde a baissé, personne n'a rien fait, tout le monde s'en est félicité.","Une belle réussite collective","Personne n'a rien fait.","Une erreur de comptage","Les compteurs vont bien ; c'est l'hiver qui était doux."),
    Q("Où déclare-t-on les consommations au titre du décret tertiaire ?","Sur OPERAT (ADEME)","Chaque année, avant le 30 septembre, pour l'année précédente.","Sur l'espace client du distributeur","On y trouve des données, pas la déclaration.","Dans la facture du fournisseur","La facture ne déclare rien.")]},
   {n:'Auditeur Yann',pal:{shirt:'#6d7896',pants:'#2c2c34',hair:'#2b1d14',glasses:1,skin:'#f6d3b3'},intro:"Dernier contrôle avant le verdict. Je ne laisse rien passer.",lose:"Rien à signaler. La championne vous attend.",qs:[
    Q("Dans ISO 50001 (Planifier, Faire, Vérifier, Agir), « Vérifier » correspond surtout à…","Mesurer et détecter","On contrôle les résultats avant de relancer la boucle.","Cadrer","Cadrer, c'est plutôt « Planifier ».","Signer le devis","Ça, c'est « Faire »."),
    Q("Une fois l'effet d'une action mesuré, on…","Repart au début de la boucle","Nouvelles données, nouveaux objectifs : la boucle continue.","Range le dossier pour toujours","Un bâtiment dérive dès qu'on cesse de le regarder.","Supprime les compteurs","Surtout pas."),
    Q("Tu te pèses en manteau en janvier et en t-shirt en juillet : −3 kg. Le régime a-t-il marché ?","Impossible à dire : il faut se peser dans les mêmes conditions","Pour un bâtiment, les « mêmes conditions », c'est d'abord la météo.","Oui, −3 kg","Le manteau a fait tout le travail.","Non, le régime fait grossir","Rien ne le montre.")]}]};
