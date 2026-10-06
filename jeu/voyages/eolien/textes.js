/* Wattlings · jeu/voyages/eolien/textes.js
   Parc éolien de Port-Rafale : tout ce qui se lit et se dit sur le site, à terre (la lande) et en mer (le poste électrique).
   - la fiche du site et ses informations à collecter (infos) : un titre (t), un texte (x), une phrase à retenir, l'indice (ou) ;
   - les répliques des personnages et des objets (EOL.dit) ;
   - les questions du défi final (EOL.questions).
   Le site est inventé ; les ordres de grandeur sont réels (sources en bas de la fiche, affichées dans le passeport). */

voyDeclarer('eolien',{
  nom:'Parc éolien de Port-Rafale',
  gare:'Port-Rafale',
  region:'Bretagne, côte ouest',
  theme:'Éolien',
  ouvert:true,
  carte:'eolien',cartes:['eolien','eolienMer'],
  arrivee:[22,24,'up'],
  accroche:"Douze éoliennes sur la lande, quarante en mer. Les goélands ont déposé un recours. Il est à l'étude.",
  pret:"Infos clés réunies : Mme Suroît t'attend devant le poste de livraison !",
  bravo:"Tu sais lire une courbe de puissance, calculer un facteur de charge et expliquer une offre verte sans mentir. Mme Suroît a tamponné face au vent : l'encre a un peu bavé.",
  paysage:[['#9cc4e0','#d8e8ef'],['#5f9a6a','#4a8358'],['#5cb064','#3f944c']],
  annonces:[
    "Mesdames et messieurs, ce train est à destination de Port-Rafale. Vent d'ouest à l'arrivée, comme hier, comme demain, comme depuis le Néolithique.",
    "Sur votre gauche, les premières éoliennes. Elles tournent lentement. C'est une illusion : le bout de la pale file à trois cents kilomètres à l'heure.",
    "Port-Rafale, deux minutes d'arrêt. Tenez vos chapeaux, vos billets et vos certitudes sur la météo."],
  annoncesRetour:[
    "Mesdames et messieurs, nous quittons Port-Rafale. Le vent, lui, reste. Il a un contrat à durée indéterminée.",
    "Prochain arrêt : Ampère-sur-Loire. Si vos cheveux ont changé de côté, c'est normal."],

  infos:[
    {id:'cube',ou:"le mât de mesure, sur la lande",cle:1,t:"Le vent au cube",
      x:"La puissance du vent varie comme le cube de sa vitesse : deux fois plus de vent, huit fois plus de puissance. Entre un site à 6 m/s et un site à 7 m/s de moyenne, l'écart de production approche 50 %. C'est pour cela qu'on mesure le vent pendant un an, à hauteur de nacelle, avant de couler le moindre mètre cube de béton.",
      retiens:"Double de vent, huit fois plus de puissance. Un mètre par seconde change tout."},
    {id:'courbe',ou:"le pupitre de M. Rafale, au pied de l'éolienne n° 1",cle:1,t:"La courbe de puissance",
      x:"Une éolienne de 3 MW démarre vers 3 m/s (11 km/h), atteint sa pleine puissance vers 13 m/s (47 km/h) et s'arrête à 25 m/s (90 km/h) pour se protéger. Entre le démarrage et la pleine puissance, la production grimpe très vite ; au-delà, les pales pivotent pour laisser filer le vent en trop, et la courbe devient un plateau.",
      retiens:"Trois vitesses à connaître : démarrage, nominale, coupure."},
    {id:'charge',ou:"Mme Bourrasque, près du mât de mesure",cle:1,t:"Le facteur de charge",
      x:"Le parc de la lande : 12 éoliennes de 3 MW, soit 36 MW. Il ne les produit que lorsque le vent dépasse 47 km/h. Sur une année, il fournit environ 24 % de ce maximum : 76 GWh. C'est le facteur de charge. En France, il tourne entre 22 et 26 % à terre (21,4 % en 2025, année peu ventée), et approche 40 % en mer.",
      retiens:"Énergie annuelle = puissance × 8 760 heures × facteur de charge."},
    {id:'anatomie',ou:"la plaque au pied de l'éolienne n° 2",t:"Cent mètres de mât",
      x:"Un mât d'une centaine de mètres, trois pales de 57 m, un rotor de 117 m de diamètre. Dans la nacelle, la génératrice. Le rotor tourne à 14 tours par minute au plus : cela semble lent, mais le bout de la pale file à plus de 300 km/h. Plus on monte, plus le vent est fort et régulier : c'est la raison de la hauteur.",
      retiens:"Lente au centre, très rapide au bout : 14 tours par minute, 300 km/h en bout de pale."},
    {id:'betz',ou:"le vieux moulin de Kerwatt",t:"La limite de Betz",
      x:"Même parfaite, une éolienne ne peut pas prendre toute l'énergie du vent : si elle l'arrêtait net, l'air s'entasserait derrière elle et plus rien ne passerait. Le maximum théorique est de 16/27, soit 59,3 % : c'est la limite de Betz, établie en 1919. Les meilleures machines atteignent environ 45 %.",
      retiens:"Au mieux 59 % de l'énergie du vent : il faut bien que l'air ressorte."},
    {id:'saison',ou:"Yann, le pêcheur, sur la grève",t:"Le vent d'hiver",
      x:"En France, il y a plus de vent en hiver qu'en été : le facteur de charge de l'éolien passe d'environ 10 % en juin à 35 % en février. En 2025, six dixièmes de la production sont tombés en automne et en hiver, au moment où le pays se chauffe. Le solaire fait l'inverse : les deux se complètent sur l'année.",
      retiens:"L'éolien produit surtout en hiver, le solaire surtout en été."},
    {id:'voisins',ou:"Mme Le Goff, à la crêperie",t:"Cinq cents mètres",
      x:"En France, une éolienne s'installe à 500 mètres au moins des habitations. À cette distance, elle s'entend à environ 35 décibels : moins qu'une conversation à voix basse. Au pied du mât, comptez 55 décibels. La réglementation limite surtout le bruit qu'elle ajoute au bruit ambiant : 5 décibels le jour, 3 la nuit.",
      retiens:"500 m des maisons, environ 35 dB à cette distance."},
    {id:'bridage',ou:"Loïc, au pied de l'éolienne arrêtée",t:"Arrêtée exprès",
      x:"Une éolienne immobile n'est pas forcément en panne. On la bride la nuit pour les chauves-souris, par vent précis pour le bruit, et de plus en plus souvent parce qu'il y a trop d'électricité : en 2025, les prix ont été négatifs 513 heures en France, et environ 1,3 TWh d'éolien terrestre a été volontairement retenu.",
      retiens:"Une éolienne à l'arrêt par bon vent, c'est souvent une décision, pas une panne."},
    {id:'carbone',ou:"la pale posée au bord du chemin",t:"Bilan carbone et fin de vie",
      x:"Fabrication, transport, chantier et démontage compris, l'éolien émet environ 14 g de CO₂e par kWh à terre et 16 g en mer. Une éolienne « rembourse » en un an l'énergie qu'elle a coûtée, puis tourne 20 à 25 ans. Environ 90 % de sa masse se recycle : acier, béton, cuivre. Les pales, en composite, restent le point dur.",
      retiens:"Environ 15 g de CO₂e par kWh, un an pour rembourser l'énergie de fabrication."},
    {id:'verte',ou:"Mme Origine, devant le poste de livraison",cle:1,t:"L'offre verte et la garantie d'origine",
      x:"Une garantie d'origine certifie qu'un MWh renouvelable a été injecté quelque part sur le réseau. Un fournisseur d'« offre verte » en achète autant que tu consommes. Dans tes prises, rien ne change : les électrons sont les mêmes pour tout le monde. Ce que tu choisis, c'est à qui va une partie de ton argent. Un contrat direct avec un producteur, sur 15 à 20 ans, s'appelle un PPA.",
      retiens:"Une offre verte change la destination de l'argent, pas le courant qui sort de la prise."},
    {id:'mer',ou:"la longue-vue du poste en mer",cle:1,t:"Pourquoi aller en mer",
      x:"Au large, rien ne freine le vent : il est plus fort et plus régulier. Les machines y sont géantes : 8 MW pièce ici, des pales de 81 mètres, 207 mètres du bas au sommet. Quarante éoliennes, 320 MW, environ 1 100 GWh par an : un facteur de charge proche de 40 %. Le revers : un chantier en mer, du sel partout, et un bateau pour chaque tournevis oublié.",
      retiens:"En mer : plus de vent, plus régulier, des machines bien plus grandes. Et tout coûte plus cher."},
    {id:'cable',ou:"Mlle Alizé, sur le poste en mer",cle:1,t:"Du large à la prise",
      x:"Chaque éolienne en mer sort son courant à 66 000 volts. Des câbles posés au fond le rassemblent au poste électrique en mer, qui l'élève à 225 000 volts. Deux liaisons sous-marines, puis souterraines, le ramènent à terre. En France, c'est RTE qui construit ce raccordement.",
      retiens:"Éolienne → câble → poste en mer → 225 000 V → liaison sous-marine → réseau."},
    {id:'fondations',ou:"la maquette du poste en mer",t:"Tenir debout dans l'eau",
      x:"Quatre façons de planter une éolienne en mer. Le monopieu : un tube d'acier enfoncé dans le fond (Saint-Nazaire). Le jacket : un treillis à plusieurs pieds (Saint-Brieuc). La fondation gravitaire : 5 000 tonnes de béton simplement posées (Fécamp). Et le flotteur, ancré par des chaînes, pour les grands fonds : trois fermes pilotes tournent en Méditerranée.",
      retiens:"Monopieu, jacket, gravitaire, flottant : le fond de la mer décide."},
    {id:'france',ou:"l'affiche de la halte",t:"L'éolien en France",
      x:"Fin 2025, la France comptait 23,9 GW d'éolien à terre et 1,9 GW en mer. Production 2025 : 49,6 TWh, soit 9 % de l'électricité du pays, dont 5,7 TWh venus de la mer. Quatre grands parcs en mer sont en service : Saint-Nazaire, Fécamp, Saint-Brieuc, Yeu-Noirmoutier.",
      retiens:"Environ 9 % de l'électricité française, surtout à terre pour l'instant."}
  ],

  sources:[
    ["RTE, Bilan électrique 2025 (puissances, productions, facteurs de charge, prix négatifs)","https://analysesetdonnees.rte-france.com/bilan-electrique-2025/production"],
    ["SDES, tableau de bord de l'éolien, quatrième trimestre 2025","https://www.statistiques.developpement-durable.gouv.fr/tableau-de-bord-eolien-quatrieme-trimestre-2025"],
    ["ADEME, « Le défi éolien en 10 questions » (bruit, durée de vie, recyclage)","https://energiesrenouvelables.cnr.tm.fr/wp-content/uploads/2023/05/guide-defi-eolien-10-questions.pdf"],
    ["Ministère, fiche « L'éolien terrestre » (distance, saisonnalité)","https://concertation-strategie-energie-climat.gouv.fr/fiche-thematique-ndeg2-leolien-terrestre"],
    ["Siemens Gamesa, éolienne en mer SG 8.0-167 DD","https://www.siemensgamesa.com/global/en/home/products-and-services/offshore/wind-turbine-sg-8-0-167-dd.html"],
    ["énergie-info (Médiateur de l'énergie) : qu'est-ce qu'une offre verte ?","https://www.energie-info.fr/fiche_pratique/quest-ce-quune-offre-delectricite-verte/"],
    ["RTE, raccordement d'un parc éolien en mer","https://www.rte-france.com/projets/nos-projets/raccordement-du-parc-eolien-en-mer-des-iles-dyeu-et-de-noirmoutier"]
  ]
});

/* ================= CE QUE DISENT LES GENS ET LES CHOSES =================
   Pour chaque source d'information : [ce qui est dit la première fois], [ce qui est dit ensuite]. */
const EOL={};
EOL.dit={
  arrivee:["Port-Rafale. Le panneau de la halte penche vers l'est. Les arbres aussi. Le chef de halte aussi.",
    "Devant toi, la lande et ses éoliennes. Le poste de livraison est au bout du chemin ; à l'ouest, un ponton et un bateau pour le parc en mer."],

  // --- sur la lande
  mat:[["Un mât de mesure, cent mètres de treillis, un anémomètre tous les vingt mètres. Une plaque : « Ici, on a écouté le vent pendant un an avant de lui demander quoi que ce soit. »",
      "En dessous, gravé au couteau : « Si v double, P fait fois huit. Vérifié. Signé : un stagiaire décoiffé. »"],
    ["Le mât de mesure. L'anémomètre du haut tourne plus vite que celui du bas. C'est tout le métier, résumé en deux moulinets."]],
  bourrasque:[["Mme Bourrasque, ingénieure vent. Je mesure, je moyenne, je prévois. On me demande souvent si « ça souffle assez ». Je réponds avec une distribution de Rayleigh. En général, la conversation s'arrête là.",
      "Tu veux comprendre pourquoi un parc de 36 MW ne produit pas 36 MW ? J'ai un an de vent dans ma tablette. Regarde."],
    ["Un jour sur quatre à pleine puissance, en moyenne. Les gens trouvent ça peu. Leur voiture, elle, roule une heure sur vingt-quatre, et personne ne parle de facteur de charge."]],
  rafale:[["M. Rafale, exploitation. Ce pupitre commande l'éolienne n° 1. Enfin, il la commandait : depuis qu'un visiteur a appuyé sur « arrêt d'urgence » pour voir, il est en mode démonstration.",
      "Tu règles le vent, tu regardes ce qu'elle produit. C'est plus simple que la vraie vie : dans la vraie vie, on ne règle pas le vent."],
    ["Démarrage à 3 mètres par seconde, pleine puissance à 13, arrêt à 25. Je le récite la nuit. Ma femme aussi, maintenant."]],
  plaque:[["Une plaque au pied du mât : « Éolienne n° 2 · 3 MW · mât 100 m · pales 57 m · 14 tours par minute au plus ».",
      "Lève la tête. Plus haut. Encore. Voilà. La nacelle, là-haut, a la taille d'un autocar. Elle n'en a pas le confort."],
    ["L'éolienne n° 2. Le bout de sa pale va aussi vite qu'un TGV. Le centre, lui, fait tranquillement un tour toutes les quatre secondes."]],
  moulin:[["Les ruines du moulin de Kerwatt, 1742. Quatre ailes en bois, un meunier, de la farine. Une plaque : « Premier parc éolien de la commune. Puissance : quelques kilowatts. Disponibilité : quand le meunier était réveillé. »",
      "Plus bas : « Limite de Betz : aucune machine ne prend plus de 59 % de l'énergie du vent. Le meunier l'ignorait. Ses ailes de toile en étaient loin, et il s'en portait très bien. »"],
    ["Le vieux moulin. Trois siècles de moins que les éoliennes, et déjà le même problème : pas de vent, pas de pain."]],
  yann:[["Yann, pêcheur. Le vent, je le connais depuis avant les éoliennes. En février, il te couche les casiers. En juin, il fait la sieste, et moi avec.",
      "Les ingénieurs sont venus m'expliquer que l'éolien produit surtout l'hiver. Je leur ai dit que mon grand-père le savait. Ils ont noté."],
    ["Les éoliennes en mer ? Les homards adorent les fondations. Moi, je dois contourner. Chacun son avis, le homard a le sien."]],
  legoff:[["Mme Le Goff, crêperie « Au Vent Complet ». L'éolienne la plus proche est à 520 mètres. J'ai mesuré : 500, c'est la loi, les 20 autres, c'est moi qui ai insisté.",
      "Le bruit ? Trente-cinq décibels à cette distance. Ma crêpière en fait soixante. Personne n'a jamais déposé de recours contre ma crêpière."],
    ["On me demande si elles me gênent. Les jours sans vent, oui : les clients ne viennent pas voir tourner des éoliennes qui ne tournent pas."]],
  loic:[["Loïc, maintenance. Celle-là ne tourne pas. Non, elle n'est pas en panne. Tout le monde me pose la question, j'ai failli faire un panneau.",
      "Aujourd'hui, c'est le prix : il y a trop de courant sur le réseau, il vaut moins que zéro. On nous demande d'attendre. La nuit en été, c'est pour les chauves-souris. Elle a un agenda plus chargé que le mien."],
    ["Mon bureau est à cent mètres de haut, sans ascenseur les jours de malchance. Plus de trois cents barreaux d'échelle. Je ne paie pas d'abonnement à la salle de sport."]],
  pale:[["Une pale, posée sur des tréteaux : 57 mètres de fibre de verre et de résine. Un écriteau : « Remplacée après un impact de foudre. Départ pour la filière de recyclage : dès qu'on aura trouvé un camion assez long. »",
      "Le reste de l'éolienne se recycle sans histoire : c'est de l'acier, du béton, du cuivre. La pale, elle, finit broyée en cimenterie. Les ingénieurs travaillent à mieux. Ils ont vingt ans devant eux : c'est sa durée de vie."],
    ["La pale au repos. De près, elle ressemble moins à une aile qu'à une très longue excuse pour ne pas la déplacer."]],
  origine:[["Mme Origine, commerciale. Je vends des garanties d'origine. Un certificat par mégawattheure renouvelable injecté. Non, ça ne se mange pas, et non, ça ne s'accroche pas au mur.",
      "Ta mairie a une « offre verte » ? Alors son fournisseur m'en achète. Ses ampoules, elles, brillent avec le même courant que celles du voisin : le réseau ne trie pas les électrons. Il a d'autres soucis."],
    ["Si un jour ta mairie veut vraiment financer un parc, qu'elle signe un contrat direct avec le producteur, sur vingt ans. Ça s'appelle un PPA. C'est plus engageant qu'un certificat, et beaucoup plus long à lire."]],
  affiche:[["Une affiche à la halte : « L'éolien en France, fin 2025 ». Une carte, des chiffres, et un goéland dessiné dans un coin, avec une bulle : « Je maintiens mon recours. »"],
    ["L'affiche de la halte. Neuf pour cent de l'électricité du pays. Le goéland dessiné a l'air de vouloir vérifier les calculs."]],

  // --- en mer
  longuevue:[["Une longue-vue fixée au garde-corps. Dans l'œilleton, une éolienne : 207 mètres de haut, des pales de 81 mètres. Elle paraît petite. Elle est à deux kilomètres.",
      "Une étiquette : « Ne cherchez pas le technicien à l'œil nu. Il est là, sur la plateforme, de la taille d'une fourmi. Il vous salue. Ou il appelle à l'aide. On ne sait jamais. »"],
    ["La longue-vue. Quarante machines de 8 MW : à elles seules, autant d'énergie que quatorze parcs comme celui de la lande."]],
  alize:[["Mlle Alizé, ingénieure du poste en mer. Ici, on rassemble le courant de quarante éoliennes et on l'envoie à terre. C'est une multiprise. Une multiprise de deux mille tonnes, posée sur l'Atlantique.",
      "Tu sais par où passe le courant, entre la pale et ta prise ? Remets-moi ça dans l'ordre. Les stagiaires se trompent toujours au même endroit."],
    ["225 000 volts sous la mer. Les poissons ne sentent rien. Les ancres de chalutiers, si : le câble est enfoui, et tout le monde s'en porte mieux."]],
  fondations:[["Une maquette sous plexiglas : quatre éoliennes miniatures, quatre façons de tenir debout. Un tube, un treillis, un énorme socle de béton, et un flotteur retenu par des chaînes.",
      "Une note : « Le socle de béton pèse 5 000 tonnes. Il n'est pas fixé. On a essayé de le pousser. Il n'a pas remarqué. »"],
    ["La maquette des fondations. Le flotteur a l'air de s'ennuyer moins que les autres."]],

  // --- les vannes (aucune information à la clé)
  goeland:["Un goéland. Il te fixe. D'après le dossier, c'est lui qui a déposé le recours contre le parc. Motif : « concurrence déloyale sur l'usage du vent ». L'instruction suit son cours."],
  goelandMer:["Un goéland, en mer aussi. Il a suivi le bateau. Il affirme être délégué du personnel."],
  menhirs:["Un alignement de menhirs. Première tentative locale de capter une énergie venue du ciel, il y a six mille ans. Rendement : nul. Durée de vie : excellente. Aucun démantèlement prévu."],
  calvaire:["Un calvaire de granit, tourné vers l'ouest. Il tient tête au vent depuis quatre siècles, sans permis de construire ni étude d'impact."],
  casiers:["Des casiers à homards. Une étiquette : « Pêchés au pied de l'éolienne n° 17. Le homard est livré sans garantie d'origine. »"],
  phare:["Au large, le phare de Port-Rafale. Il éclaire depuis 1867, à heure fixe, sans se soucier du prix de gros. C'est le dernier usage de la commune qui ne s'efface jamais."],
  mouton:["Une brebis de pré-salé. Elle broute sous une machine de trois mégawatts avec un détachement que beaucoup d'ingénieurs lui envient."],
  transfo:["Le transformateur du poste en mer. Il bourdonne plus fort que celui de Saint-Photon : normal, il fait plus de vingt-cinq fois le travail. Une plaque : « 66 000 V → 225 000 V. Ne pas toucher. Ne pas penser à toucher. »"],
  grue:["Une grue de pont. Elle sert à hisser les pièces depuis les bateaux. Sa charge maximale est inscrite en gros. En plus petit : « Stagiaires non compris. »"],
  helico:["Un grand H peint sur le pont. Par mauvaise mer, on vient ici en hélicoptère. Par très mauvaise mer, on ne vient pas : le poste se débrouille très bien tout seul."],
  chefHalte:["Halte de Port-Rafale. Le train repart quand vous voulez. Les horaires affichés sont indicatifs, comme la météo marine.",
    "On m'a proposé un abri de quai. J'ai dit non : ici, un abri, ça devient un cerf-volant."],
  capitaine:["Capitaine Noroît. La navette part pour le poste en mer quand vous montez. Seize kilomètres, vingt minutes, et un sac en papier dans la poche du siège. On ne juge pas.",
    "On dit « noroît » pour le vent de nord-ouest. Mes parents avaient de l'ambition : ils auraient pu m'appeler Brise."],
  capitaineMer:["On rentre quand vous voulez. La mer est belle. Enfin, belle pour ici : elle ne ferait pas la couverture d'un catalogue."],
  suroitAttente:"Mme Suroît, cheffe de parc. Un tampon ? Reviens quand tu auras vu le parc entier : la lande, et la mer.",
  suroitApres:["Tampon donné. Si tu installes un jour une éolienne dans la cour de ton école, appelle-moi avant. Pas après. Avant.",
    "Le parc en mer produit quatorze fois plus que la lande. Les gens d'ici ne voient que la lande. C'est très reposant pour le parc en mer."]
};

/* ================= LE DÉFI DE MME SUROÎT : LES QUESTIONS =================
   Q("question", "bonne réponse", "explication", "mauvaise réponse 1", "pourquoi", "mauvaise réponse 2", "pourquoi") */
EOL.questions=[
  Q("Le vent passe de 5 à 10 m/s. La puissance qu'il transporte est multipliée par…","8","Le cube : 2 × 2 × 2. C'est la loi qui explique tout le reste, y compris l'acharnement de Mme Bourrasque.","2","Ce serait trop simple. Et les parcs seraient installés n'importe où.","4","Presque : ça, c'est le carré. Le vent, lui, compte au cube."),
  Q("Un parc de 36 MW à terre, facteur de charge 24 %. Que produit-il en un an ?","Environ 76 GWh","36 MW × 8 760 h × 0,24. La puissance installée ne dit rien sans le facteur de charge.","Environ 315 GWh","Ce serait 36 MW à chaque heure de l'année : il faudrait un vent de 47 km/h, jour et nuit, sans pause.","Environ 8,6 GWh","Ça, c'est 36 MW × 24 % × 1 000 heures. Une année en compte 8 760."),
  Q("Tempête : 110 km/h de vent sur la lande. Que font les éoliennes ?","Elles se mettent à l'arrêt, pales en drapeau","Au-delà de 90 km/h, elles se protègent. Trop de vent, c'est comme pas de vent : zéro.","Elles produisent plus que jamais","Passé la vitesse nominale, la production plafonne ; passé la coupure, elle tombe à zéro.","Elles tournent à l'envers","M. Rafale aimerait voir ça. Une seule fois."),
  Q("Pourquoi construire en mer, alors que tout y coûte plus cher ?","Le vent y est plus fort et plus régulier : le facteur de charge approche 40 %","Et les machines peuvent être géantes : 8 MW ici, davantage sur les parcs récents.","Parce que l'eau refroidit les éoliennes","Elles n'ont pas besoin d'être refroidies par la mer. Elles ont assez d'air.","Parce qu'aucune règle ne s'y applique","Demande à Mlle Alizé ce qu'elle pense du nombre de dossiers à remplir."),
  Q("Ta mairie passe à une « offre verte ». Qu'est-ce qui change dans ses prises ?","Rien : le fournisseur achète des garanties d'origine pour le même volume","Le courant livré est le même pour tous. Ce qui change, c'est où va une partie de l'argent.","Elle reçoit des électrons renouvelables par un câble réservé","Il n'existe qu'un réseau, et il ne trie rien.","Son courant vient désormais de l'éolienne la plus proche","Physiquement, c'était peut-être déjà le cas. Commercialement, ça n'a aucun rapport."),
  Q("Un dimanche de mai, grand vent, grand soleil, peu de consommation. Une éolienne de la lande est à l'arrêt. Le plus probable ?","Elle est bridée : les prix sont négatifs","513 heures de prix négatifs en 2025. On retient la production quand personne n'en veut.","Elle est en panne","Possible, mais un dimanche de mai venteux et ensoleillé, pariez d'abord sur le prix.","Elle fait grève par solidarité avec les goélands","Le recours est encore à l'étude.")
];
