/* Wattlings · jeu/voyages/barrage/textes.js
   Barrage de Val-Turbine : tout ce qui se lit et se dit sur le site, de la vallée à la crête.
   - la fiche du site et ses informations à collecter (infos) : un titre (t), un texte (x), une phrase à retenir, l'indice (ou) ;
   - les répliques des personnages et des objets (BAR.dit) ;
   - les questions du défi final (BAR.questions).
   Le site est inventé ; les ordres de grandeur sont réels (sources en bas de la fiche, affichées dans le passeport). */

voyDeclarer('barrage',{
  nom:'Barrage de Val-Turbine',
  gare:'Val-Turbine',
  region:'Alpes',
  theme:'Hydraulique',
  ouvert:true,
  carte:'barrage',
  arrivee:[19,28,'up'],
  accroche:"Un lac, un mur, une chute. La seule batterie de France qui se remplit quand il pleut.",
  pret:"Infos clés réunies : Mme Lachute t'attend devant l'usine !",
  bravo:"Tu sais multiplier un débit par une hauteur, reconnaître une turbine, et gagner de l'argent en remontant de l'eau. Mme Lachute a tamponné d'un coup sec : ici, tout tombe droit.",
  paysage:[['#8fc8f0','#dceefa'],['#8a93a8','#6f7890'],['#6fc47c','#4fa860']],relief:2.3,
  annonces:[
    "Mesdames et messieurs, ce train monte à Val-Turbine. Il monte lentement. Rassurez-vous : au retour, il descendra tout seul. C'est le principe de l'endroit.",
    "Sur votre droite, le torrent. Chaque mètre cube que vous voyez passer a déjà travaillé une fois, là-haut. Il ne s'en vante pas.",
    "Val-Turbine, terminus. Altitude : mille mètres. Le barrage est six cents mètres plus haut. Le personnel de bord vous souhaite de bons mollets."],
  annoncesRetour:[
    "Mesdames et messieurs, nous quittons Val-Turbine. Le train n'utilise pas ses moteurs dans la descente. Il aimerait qu'on le félicite.",
    "Prochain arrêt : Ampère-sur-Loire. Si une lampe s'allume à 19 h ce soir sans que personne s'inquiète, pensez au lac."],

  infos:[
    {id:'formule',ou:"M. Newton, au pied de la conduite forcée",cle:1,t:"Débit × hauteur",
      x:"La puissance d'une chute tient en une ligne : 9,81 × le débit (en m³ par seconde) × la hauteur (en mètres) × le rendement, et l'on obtient des kilowatts. Ici : 80 m³/s tombant de 600 m, avec 90 % de rendement, soit 420 MW. Un mètre cube d'eau qui descend de 367 mètres libère 1 kWh, pas davantage : l'hydraulique, c'est beaucoup d'eau, ou beaucoup de hauteur.",
      retiens:"Puissance = 9,81 × débit × hauteur × rendement. Peu de hauteur ? Il faut énormément d'eau."},
    {id:'types',ou:"la table d'orientation, à mi-pente du sentier",cle:1,t:"Quatre familles",
      x:"Au fil de l'eau : pas de réserve, on turbine ce que le fleuve apporte, jour et nuit. L'éclusée : un petit bassin, de quoi décaler la production de quelques heures. Le lac : des semaines ou des mois de réserve, pour produire quand il le faut. La STEP : deux bassins, et l'on remonte l'eau pour la faire resservir. En France : 25,7 GW au total, dont 10 GW de lacs et 5 GW de STEP.",
      retiens:"Fil de l'eau, éclusée, lac, STEP : ce qui les distingue, c'est la taille de la réserve."},
    {id:'flexible',ou:"M. Vanne, à la porte de l'usine",cle:1,t:"En trois minutes",
      x:"Une centrale de lac passe de l'arrêt à la pleine puissance en quelques minutes : on ouvre la vanne, l'eau arrive, la turbine tourne. La plus grande de France, Grand'Maison, livre 1 800 MW en trois minutes. Aucun autre moyen de production ne réagit aussi vite à cette échelle : c'est l'hydraulique qui rattrape les écarts du réseau, à la pointe comme en cas de panne ailleurs.",
      retiens:"L'hydraulique de lac démarre en minutes : c'est le pompier du réseau."},
    {id:'stock',ou:"Mme Stock et son échelle, sur la crête du barrage",cle:1,t:"Le lac est une batterie",
      x:"Le lac de Val-Turbine retient 180 millions de mètres cubes, 600 mètres au-dessus de l'usine : 265 GWh en réserve, de quoi tourner à pleine puissance pendant 26 jours. Il se remplit au printemps, avec les pluies et la fonte des neiges, et se vide en hiver, quand le pays en a besoin. C'est le seul grand stock d'électricité que l'on sache garder d'une saison à l'autre.",
      retiens:"Un lac stocke de l'énergie pour des mois : on le remplit au printemps, on le vide en hiver."},
    {id:'step',ou:"Mme Reflux, au bord du bassin aval",cle:1,t:"La STEP : remonter l'eau",
      x:"Deux des quatre groupes de l'usine sont réversibles : quand l'électricité abonde, la nuit ou en plein midi solaire, ils pompent l'eau du bassin aval vers le lac. À la pointe, elle redescend. On récupère environ 80 % de l'énergie dépensée. La France compte six grandes STEP, 5 GW en tout ; elles ont pompé 8,1 TWh en 2025.",
      retiens:"Pomper quand l'électricité abonde, turbiner quand elle manque : on perd 20 %, et on y gagne."},
    {id:'pointe',ou:"M. Spot et son écran des prix, près du bassin",cle:1,t:"La pointe, et ton bâtiment",
      x:"La consommation française culmine les soirs d'hiver, entre 18 h et 20 h : 102 GW au record de février 2012, et 2,4 GW de plus par degré en moins. Les prix suivent : en 2025, l'écart moyen entre l'heure la moins chère et la plus chère d'une même journée a atteint 90 €/MWh. Un bâtiment qui décale ses usages hors de la pointe, ou qui chauffe son eau à midi, rend au réseau le même service qu'un petit barrage.",
      retiens:"Décaler une consommation hors de la pointe vaut autant que produire à la pointe."},
    {id:'turbines',ou:"Mlle Pelton et sa roue, devant l'usine",t:"À chaque chute sa turbine",
      x:"Trois grandes familles. La Pelton, une roue à augets frappée par un jet, pour les hautes chutes : au-delà de 300 mètres. La Francis, une roue noyée, pour les chutes moyennes : de 30 à 300 mètres. La Kaplan, une hélice à pales orientables, pour les basses chutes et les gros débits : moins de 30 mètres. Ici, 600 mètres : des Pelton, et des pompes-turbines pour les deux groupes qui remontent l'eau.",
      retiens:"Pelton pour la hauteur, Kaplan pour le débit, Francis entre les deux."},
    {id:'conduite',ou:"la plaque de la conduite forcée, au bord du sentier",t:"La conduite forcée",
      x:"Un tuyau d'acier descend du lac à l'usine : 600 mètres de dénivelé. En bas, l'eau pousse à 60 bars, soit soixante fois la pression de l'air. C'est cette pression, et non la vitesse de l'eau dans le tuyau, qui fait la puissance. Tout en haut, une cheminée d'équilibre absorbe les à-coups quand on ferme la vanne.",
      retiens:"10 mètres de chute, c'est 1 bar. La hauteur se transforme en pression."},
    {id:'surete',ou:"M. Capteur, sur la crête du barrage",t:"Un mur sous surveillance",
      x:"Un barrage bouge : il se dilate l'été, se contracte l'hiver, s'incline de quelques centimètres selon le niveau du lac. Des pendules, des capteurs et des géomètres le suivent en permanence : EDF en compte 90 000 sur 400 ouvrages. Tous les dix ans, les grands barrages subissent un examen complet, parfois lac vidé.",
      retiens:"Un barrage se mesure tous les jours et s'examine à fond tous les dix ans."},
    {id:'aval',ou:"le panneau jaune, au bord du torrent",t:"Calme apparent, risque présent",
      x:"En aval d'un barrage, le niveau de la rivière peut monter en quelques minutes, à tout moment, même par grand beau temps : l'usine démarre quand le réseau l'appelle, pas quand il pleut. Le débit peut être multiplié par cent. D'où les panneaux jaunes le long des berges : on ne s'installe pas dans le lit du torrent.",
      retiens:"Sous un barrage, l'eau monte sans prévenir : on reste hors du lit de la rivière."},
    {id:'reserve',ou:"Mme Truite, garde-pêche, au bord de la rivière",t:"Le débit réservé",
      x:"Un barrage ne peut pas garder toute l'eau. La loi lui impose de laisser passer en permanence au moins un dixième du débit moyen de la rivière : c'est le débit réservé, qui maintient la vie en aval. S'y ajoutent des passes pour que les poissons franchissent l'ouvrage, et des chasses pour les sédiments.",
      retiens:"Au moins un dixième du débit moyen reste à la rivière, toujours."},
    {id:'usages',ou:"le Père Anselme, devant son chalet",t:"L'eau a plusieurs métiers",
      x:"L'électricité n'est qu'un des usages d'un lac de barrage. Il irrigue les cultures, fournit l'eau potable, soutient le débit des rivières en été, retient les crues et fait vivre le tourisme. En Provence, la chaîne de la Durance alimente ainsi trois millions de personnes en eau potable. En été, le niveau du lac se négocie entre l'électricien, l'agriculteur et le loueur de pédalos.",
      retiens:"Un lac sert à tout le monde : produire de l'électricité n'est qu'une de ses missions."},
    {id:'carbone',ou:"la plaque de 1957, sur la crête du barrage",t:"Un siècle de service",
      x:"L'hydroélectricité émet environ 6 g de CO₂e par kWh, presque tout à la construction. Un barrage dure un siècle et davantage ; l'âge moyen du parc français approche 70 ans. C'est la première source d'électricité renouvelable du pays, et la deuxième source tout court.",
      retiens:"6 g de CO₂e par kWh, et des ouvrages qui durent cent ans."},
    {id:'france',ou:"l'affiche de la halte",t:"L'hydraulique en France",
      x:"Environ 2 500 installations, 25,7 GW. En 2025, elles ont produit 62,4 TWh, soit 11 % de l'électricité du pays. En 2024, année très pluvieuse : 75 TWh. D'une année à l'autre, la production suit la pluie et la neige ; ce qui ne change pas, c'est la capacité à produire au bon moment.",
      retiens:"11 % de l'électricité française, plus ou moins selon la pluie."}
  ],

  sources:[
    ["RTE, Bilan électrique 2025 (hydraulique, pompage, prix)","https://analysesetdonnees.rte-france.com/bilan-electrique-2025/production"],
    ["EDF, l'hydraulique en chiffres","https://www.edf.fr/groupe-edf/comprendre/production/hydraulique/hydraulique-en-chiffres"],
    ["EDF, les stations de transfert d'énergie par pompage (Grand'Maison en 3 minutes)","https://www.edf.fr/groupe-edf/comprendre/production/hydraulique/stations-de-transfert-d-energie-par-pompage"],
    ["Ministère, l'hydroélectricité (répartition par type)","https://www.ecologie.gouv.fr/politiques-publiques/hydroelectricite"],
    ["Connaissance des énergies, fiche hydroélectricité (formule, turbines)","https://www.connaissancedesenergies.org/fiche-pedagogique/hydroelectricite"],
    ["RTE, prix de l'électricité en 2025 (amplitude journalière)","https://analysesetdonnees.rte-france.com/en/annual-review-2025/prices"],
    ["EDF, « Calme apparent, risque présent » (prudence en aval des barrages)","https://www.edf.fr/sites/groupe/files/2024-03/EDF_Hydro_De%CC%81pliant_Calme%20apparent%20risque%20present.pdf"]
  ]
});

/* ================= CE QUE DISENT LES GENS ET LES CHOSES =================
   Pour chaque source d'information : [ce qui est dit la première fois], [ce qui est dit ensuite]. */
const BAR={};
BAR.dit={
  arrivee:["Val-Turbine. L'air est frais, le torrent fait du bruit, et tout là-haut un mur de béton ferme la vallée.",
    "L'usine est juste devant, au pied de la conduite. Pour le barrage, il y a un sentier à l'ouest. Il monte. Longtemps."],

  // --- dans la vallée
  newton:[["M. Newton, hydraulicien. Oui, comme la pomme. Ici, la pomme pèse quatre-vingts tonnes par seconde et tombe de six cents mètres. On a remplacé le verger par une conduite forcée.",
      "Deux nombres font tout le métier : le débit, et la hauteur. Tu veux voir ce que ça donne quand on les multiplie ? Le pupitre est là."],
    ["9,81 fois le débit, fois la hauteur, fois le rendement. Ma grand-mère disait que la vie est compliquée. Elle n'avait jamais fait d'hydraulique."]],
  vanne:[["M. Vanne, chef de quart. Quand le réseau a besoin de 400 mégawatts, le téléphone sonne, j'ouvre, et trois minutes plus tard c'est fait. Le plus long, c'est de décrocher.",
      "Une panne dans une centrale à l'autre bout du pays ? Dans la minute, c'est une vanne comme la mienne qui rattrape l'écart. Personne ne le sait. Je ne suis pas rancunier. Un peu."],
    ["On me demande si je m'ennuie, entre deux appels. Je regarde le lac. Deux cent soixante-cinq gigawattheures qui attendent mon signal. C'est très apaisant."]],
  pelton:[["Mlle Pelton, mécanicienne. Cette roue vient du groupe 2 : vingt augets, trois mètres de diamètre. Un jet d'eau la frappe à plus de trois cents kilomètres à l'heure. Elle a tourné quarante ans avant de prendre sa retraite sur ce socle.",
      "À chaque chute sa turbine. Les gens croient qu'on choisit selon l'humeur. Tiens, j'ai trois chantiers sur mon bureau : dis-moi quelle turbine tu y mettrais."],
    ["Pelton pour la hauteur, Kaplan pour le débit, Francis entre les deux. Mes parents ont choisi mon nom de famille avant ma naissance, mais j'ai fait le reste toute seule."]],
  reflux:[["Mme Reflux, exploitation de la STEP. La nuit dernière, j'ai remonté un million de mètres cubes dans le lac. Ce soir à 19 h, ils redescendront. Les gens trouvent ça absurde. Les gens achètent bien du pain le matin pour le manger le soir.",
      "Je dépense dix, je récupère huit. Mais j'achète quand personne n'en veut et je revends quand tout le monde en cherche. Demande à M. Spot : c'est lui qui tient les comptes."],
    ["Six stations comme la mienne en France, cinq gigawatts. On en voudrait davantage. Il faut deux lacs et une montagne entre les deux : ça ne se trouve pas dans le catalogue."]],
  spot:[["M. Spot, optimisation. Cet écran affiche le prix de l'électricité, heure par heure, pour demain. À midi, presque rien : le soleil brade. À 19 h, c'est le sommet : tout le monde rentre, allume, chauffe et cuisine en même temps.",
      "Mon travail : garder l'eau pour 19 h. Le tien, si tu gères des bâtiments : ne pas avoir besoin de mon eau à 19 h. Si tu fais bien ton travail, je perds des clients. Je te félicite d'avance, à contrecœur."],
    ["Cinq cent treize heures à prix négatif l'an dernier. On me payait pour consommer. J'ai pompé tout ce que j'ai pu. C'est le seul métier où l'on est payé pour remplir son stock."]],
  truite:[["Mme Truite, garde-pêche. Oui, c'est mon vrai nom. Non, je ne mange pas de poisson. La rivière garde toujours un dixième de son débit, barrage ou pas : c'est la loi, et je viens vérifier avec un seau et un chronomètre.",
      "Tu vois les marches, là, le long du seuil ? C'est une passe à poissons. La truite remonte palier par palier. Elle met moins de temps que les randonneurs."],
    ["Les pêcheurs me demandent où sont les truites. Je leur réponds : dans la rivière. Ils trouvent que je manque de précision."]],
  anselme:[["Père Anselme. Soixante-dix ans que je regarde ce barrage. L'ancien hameau est sous le lac. On a déménagé l'église pierre par pierre, et on a gardé le clocher pour les jours de vidange.",
      "Les gens croient que le lac sert à faire du courant. Demande aux maraîchers de la plaine : sans lui, pas de salades en août. Demande au loueur de pédalos. L'électricien passe en troisième, et il le sait."],
    ["En été, tout le monde veut le lac plein : c'est plus joli sur les cartes postales. En hiver, tout le monde veut de l'électricité. On ne peut pas vider un lac qu'on a gardé plein pour la photo. Enfin si, mais ça se voit."]],
  plaqueConduite:[["Une plaque rivée sur un énorme tuyau vert : « Conduite forcée. Dénivelé : 600 m. Pression en pied : 60 bars. Ne pas percer. »",
      "En dessous, une main anonyme : « 10 mètres d'eau = 1 bar. J'ai compté les mètres en montant. Je confirme. »"],
    ["La conduite forcée. Pose la main dessus : elle vibre. Quatre-vingts tonnes d'eau par seconde passent là-dedans, sans un bruit, ou presque."]],
  jaune:[["Un panneau jaune, planté dans les galets : « DANGER. Montée brutale des eaux, même par beau temps. Ne stationnez pas dans le lit de la rivière. »",
      "Un autocollant de randonneur, collé dessus : « Testé. Mes chaussures sont à Avignon. »"],
    ["Le panneau jaune. Le torrent a l'air sage. Il a l'air sage tous les jours, jusqu'à ce que le téléphone de M. Vanne sonne."]],
  affiche:[["Une affiche à la halte : « L'hydraulique en France ». Un barrage, un chiffre, et un nuage de pluie dessiné avec la mention : « Fournisseur officiel. Ne garantit aucun délai. »"],
    ["L'affiche de la halte. Onze pour cent de l'électricité, les bonnes années un peu plus. Le nuage dessiné ne s'engage toujours à rien."]],

  // --- sur le sentier et la crête
  table:[["Une table d'orientation en lave émaillée. En face : le barrage. En bas : l'usine. Sur le pourtour, quatre dessins : un fleuve, un petit bassin, un grand lac, et deux lacs reliés par une flèche qui monte et qui descend.",
      "La légende : « Les quatre familles de l'hydraulique. Vous regardez la troisième, et la quatrième. Vous êtes essoufflé : c'est la première leçon sur l'énergie potentielle. »"],
    ["La table d'orientation. Fil de l'eau, éclusée, lac, STEP. Quelqu'un a gravé « et moi » avec une flèche vers un banc."]],
  stock:[["Mme Stock, gestion de la réserve. Cette échelle graduée, c'est mon tableau de bord. Aujourd'hui, le lac est à la cote 1 592. Chaque centimètre vaut de l'électricité pour un gros village pendant un jour.",
      "Au printemps, la neige fond, je remplis. En hiver, je vide. Entre les deux, tout le monde me téléphone pour savoir combien il en reste. Je réponds en gigawattheures. Ils voulaient des mètres."],
    ["Deux cent soixante-cinq gigawattheures quand il est plein. Il faudrait plus de quatre millions de batteries de voiture électrique pour en garder autant. Et la mienne ne s'use pas."]],
  capteur:[["M. Capteur, auscultation. Le barrage bouge. Ne faites pas cette tête : c'est normal, c'est même rassurant. En été, il penche de trois centimètres vers l'amont. Je le sais parce qu'un pendule de cent mètres me le dit.",
      "Quatre-vingt-dix mille capteurs sur les ouvrages du pays. Celui-ci en a six cents. Il est mieux suivi que moi par mon médecin."],
    ["Tous les dix ans, examen complet. On inspecte tout, parfois lac vidé. Les anciens du village montent voir le clocher. C'est le seul contrôle technique qui attire des touristes."]],
  plaque1957:[["Une plaque de bronze, scellée dans le parapet : « Barrage de Val-Turbine. Mis en eau en 1957. Hauteur : 130 mètres. 900 000 m³ de béton. »",
      "Gravé plus bas : « Soixante-dix ans de service, zéro combustible. La facture de 1957 est payée. »"],
    ["La plaque de 1957. Le bronze a verdi, le béton a grisé, et l'eau tombe toujours de la même hauteur."]],

  // --- les vannes (aucune information à la clé)
  randonneur:["Un randonneur, écarlate, assis sur son sac. « Six cents mètres de montée. J'ai calculé : avec mes quatre-vingts kilos, j'ai stocké 0,13 kWh d'énergie potentielle. Une barre de céréales. J'en ai mangé trois. Mon rendement est catastrophique. »"],
  marmotte:["Une marmotte, dressée sur un rocher. Elle siffle. Dans la vallée, c'est le seul système d'alerte qui n'a jamais eu besoin de maintenance."],
  vache:["Une vache d'alpage. Elle regarde le barrage depuis 1957, par générations interposées. Elle n'a toujours pas d'avis."],
  pedalo:["Un panneau en bois : « Base nautique du lac · Pédalos · La cote du lac peut varier de 40 mètres dans l'année. Le ponton aussi. Prévoir de la marche. »"],
  longuevue:["Une longue-vue tournée vers le lac. Au fond de l'eau, par temps clair, on devine le clocher de l'ancien hameau. Il sonne encore, disent les anciens. Les ingénieurs disent que c'est la vanne de fond."],
  roue:["La roue Pelton du groupe 2. Vingt augets en forme de double cuillère, polis par quarante ans d'eau. Un enfant y a oublié un bonnet. Personne n'ose le retirer : il est devenu réglementaire."],
  ecran:["L'écran de M. Spot. Vingt-quatre barres : le prix de demain, heure par heure. Celle de 19 h dépasse du cadre. Celle de 13 h est si petite qu'on a collé une flèche pour la montrer."],
  passe:["La passe à poissons : une vingtaine de petits bassins en escalier. Une truite est en train de la remonter. Elle te regarde comme on regarde quelqu'un qui prend l'ascenseur."],
  chefHalte:["Halte de Val-Turbine. Le train repart quand vous voulez. Il descend tout seul : je n'ai qu'à lâcher le frein.",
    "On m'a demandé pourquoi la halte n'est pas plus près du barrage. J'ai montré la pente. On ne m'a plus rien demandé."],
  lachuteAttente:"Mme Lachute, cheffe d'aménagement. Un tampon ? Il se mérite. Va voir l'usine, monte au barrage, et reviens me dire ce que tu as compris.",
  lachuteApres:["Tampon donné. Si un jour tu installes un ballon d'eau chaude qui chauffe à midi au lieu de 19 h, envoie-moi une carte postale. On fait le même métier, toi en plus petit.",
    "Le lac se remplit tout seul, gratuitement, depuis 1957. Les économistes n'aiment pas cette phrase. Les montagnards, si."]
};

/* ================= LE DÉFI DE MME LACHUTE : LES QUESTIONS =================
   Q("question", "bonne réponse", "explication", "mauvaise réponse 1", "pourquoi", "mauvaise réponse 2", "pourquoi") */
BAR.questions=[
  Q("Une chute de 100 m, un débit de 50 m³/s, 90 % de rendement. Quelle puissance ?","Environ 44 MW","9,81 × 50 × 100 × 0,9 = 44 145 kW. Débit fois hauteur, toujours.","Environ 4,4 MW","Il manque un zéro : 50 tonnes d'eau par seconde, ça compte.","Environ 440 MW","Il faudrait dix fois plus d'eau, ou une chute de mille mètres."),
  Q("Un lac de barrage et une centrale au fil de l'eau ont la même puissance. Quelle est la vraie différence ?","Le lac choisit quand il produit, le fil de l'eau produit quand l'eau passe","Tout est dans la réserve : des mois pour le lac, rien pour le fil de l'eau.","Le lac produit plus d'énergie sur l'année","C'est souvent l'inverse : le fil de l'eau tourne presque tout le temps.","Le fil de l'eau est plus dangereux","Ni plus ni moins. Ce n'est pas ce qui les distingue."),
  Q("19 h, un soir de janvier. Une centrale tombe en panne à l'autre bout du pays. Qui compense dans les minutes qui suivent ?","Les centrales hydrauliques de lac et les STEP","De l'arrêt à la pleine puissance en quelques minutes : rien d'autre n'est aussi rapide à cette échelle.","Les panneaux solaires","À 19 h en janvier, ils dorment depuis deux heures.","On attend que la panne soit réparée","Le réseau doit rester équilibré à chaque seconde. Il n'attend personne."),
  Q("Une STEP consomme 10 MWh pour remonter de l'eau. Combien en récupère-t-elle en la turbinant ?","Environ 8 MWh","80 % de rendement sur un aller-retour. On perd 2 MWh, et on déplace 8 MWh vers l'heure où ils valent cher.","10 MWh : rien ne se perd","Les pompes, les turbines et les tuyaux prélèvent leur part.","12 MWh : l'eau prend de la vitesse en descendant","Ce serait une machine à mouvement perpétuel. M. Newton s'y oppose."),
  Q("Le lac se remplit surtout…","Au printemps, avec la fonte des neiges et les pluies","Et il se vide en hiver, quand la consommation est la plus forte.","En hiver, quand il neige","La neige reste sur les pentes : elle ne remplit le lac qu'en fondant.","En été, pendant les orages","Les orages aident, mais l'essentiel arrive avec la fonte."),
  Q("Ta mairie veut « aider le réseau » sans rien construire. Le geste le plus utile ?","Décaler hors de 18 h-20 h, en hiver, ce qui peut attendre","Chauffe-eau, recharge, lavage : chaque kW évité à la pointe est un kW que M. Vanne n'a pas à sortir du lac.","Éteindre l'éclairage public à midi","Il est déjà éteint à midi. Enfin, on espère.","Consommer le moins possible à 13 h en été","C'est l'heure où l'électricité abonde : c'est justement là qu'il vaut mieux consommer.")
];
