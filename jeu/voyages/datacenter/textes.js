/* Wattlings · jeu/voyages/datacenter/textes.js
   Data center du quai des Octets, à Marseille : tout ce qui se lit et se dit sur le site.
   - la fiche du site et ses informations à collecter (infos) : un titre (t), un texte (x), une phrase à retenir, l'indice (ou) ;
   - les répliques des personnages et des objets (DAT.dit) ;
   - les questions du défi final (DAT.questions).
   Le site est inventé ; les ordres de grandeur sont réels (sources en bas de la fiche, affichées dans le passeport). */

voyDeclarer('datacenter',{
  nom:'Data center du quai des Octets',
  gare:'Marseille · quai des Octets',
  region:'Marseille, le port',
  theme:'Data center',
  ouvert:true,
  carte:'datacenter',
  /* sur la carte du pays (touche K, puis dézoomer) : où est le site, et par où passe sa ligne depuis Ampère-sur-Loire */
  pays:[5.35,43.3],rail:[[3.16,46.99],[4.85,45.75],[4.9,44.93],[4.8,43.95]],cote:'gauche',
  arrivee:[21,24,'up'],
  accroche:"Des milliers de serveurs, un seul objectif : rester au frais. Vos photos de vacances y sont, et elles consomment.",
  pret:"Infos clés réunies : Mme Quatreneuf t'attend dans le hall !",
  bravo:"Tu sais calculer un PUE, lire une courbe plate, compter une autonomie et repérer un serveur qui dort. Mme Quatreneuf a tamponné deux fois : la seconde, c'est la redondance.",
  paysage:[['#6cc0f0','#d8eefa'],['#c9b79a','#b09a78'],['#d9c98a','#b8a660']],
  annonces:[
    "Mesdames et messieurs, ce train est à destination de Marseille, quai des Octets. Le wifi à bord est indisponible. Nous allons justement voir où il habite.",
    "Les quatre autres lignes mènent là où l'on produit l'électricité. Celle-ci mène là où on la consomme. Jour et nuit. Dimanche compris.",
    "Marseille. Le mistral est annoncé. Le data center, lui, n'ouvre jamais les fenêtres : il n'en a pas."],
  annoncesRetour:[
    "Mesdames et messieurs, nous quittons Marseille. Les photos que vous venez de prendre sont déjà stockées dans le bâtiment que vous quittez. En trois exemplaires.",
    "Prochain arrêt : Ampère-sur-Loire, terminus. Cinq lignes, cinq façons de regarder un kilowattheure. La sixième, c'est votre prochain relevé de compteur."],

  infos:[
    {id:'chaleur',ou:"la sonde de l'allée chaude, dans la salle des serveurs",cle:1,t:"Tout finit en chaleur",
      x:"Un serveur ne fabrique rien de matériel : chaque kilowattheure qu'il consomme ressort en chaleur, intégralement. Dix mégawatts de serveurs, ce sont dix mégawatts de radiateurs allumés jour et nuit dans une pièce fermée. Tout le reste du bâtiment n'existe que pour évacuer cette chaleur, et pour que le courant n'y manque jamais.",
      retiens:"1 kWh d'informatique = 1 kWh de chaleur à évacuer."},
    {id:'pue',ou:"Mme Ratio, en salle de contrôle",cle:1,t:"Le PUE",
      x:"Le PUE compare toute l'électricité qui entre dans le bâtiment à celle qui arrive vraiment aux serveurs. Ici : 13 MW au compteur pour 10 MW d'informatique, soit 1,3. Les 3 MW de différence refroidissent, convertissent, éclairent. Moyenne mondiale : 1,54. Moyenne française : 1,42. Les meilleurs sites descendent vers 1,1. Un PUE de 2 signifie qu'un watt sur deux ne calcule rien.",
      retiens:"PUE = énergie totale ÷ énergie informatique. Plus il est proche de 1, mieux c'est."},
    {id:'plate',ou:"M. Talon, en salle de contrôle",cle:1,t:"La courbe plate",
      x:"Une école consomme le jour, en semaine, en hiver. Un data center consomme tout le temps : 13 MW à 3 h du matin comme à midi, le dimanche comme le mardi. Sur un an : 114 GWh, la consommation domestique d'une ville de 50 000 habitants. Sa courbe de charge est une ligne droite : il n'a pas de talon, il n'est que talon.",
      retiens:"Une puissance modeste, tenue 8 760 heures, fait une énorme énergie."},
    {id:'secours',ou:"Mmes Redondance, dans le local des batteries",cle:1,t:"Ne jamais s'arrêter",
      x:"Deux arrivées électriques distinctes. Si le réseau tombe, des batteries prennent le relais instantanément et tiennent une dizaine de minutes : le temps que les groupes électrogènes démarrent, en dix à trente secondes, et se stabilisent. Les cuves de fioul donnent 72 heures d'autonomie. Tout est en double, parfois en triple : la disponibilité se paie en matériel qui attend.",
      retiens:"Réseau, puis batteries, puis groupes : la continuité se construit par couches."},
    {id:'fatale',ou:"Mme Calorie, à l'échangeur, côté quai",cle:1,t:"La chaleur fatale",
      x:"Dix mégawatts de chaleur s'échappent en permanence. Les jeter est un gâchis ; les récupérer, c'est chauffer un quartier. L'air sort des serveurs à 30-35 °C : une pompe à chaleur le remonte à la température d'un réseau de chaleur. Désormais, les sites de plus d'un mégawatt doivent valoriser leur chaleur ou justifier pourquoi ils ne le font pas. À Saint-Denis, un data center chauffe ainsi le centre aquatique olympique.",
      retiens:"La chaleur d'un data center est une ressource, à condition d'avoir un voisin qui en veut."},
    {id:'salle',ou:"M. Placard, en visite dans le hall",cle:1,t:"Et dans mon bâtiment ?",
      x:"Beaucoup de mairies, d'écoles et de bureaux abritent un local serveur : une pièce climatisée à 18 °C toute l'année, des machines dont plus personne ne sait à quoi elles servent, un PUE proche de 2. Trois gestes : remonter la consigne vers 24-25 °C, éteindre ou regrouper les serveurs inutiles, fermer la porte. Et se souvenir que ce qui part « dans le cloud » consomme toujours, ailleurs, hors de la facture.",
      retiens:"Un local serveur est un talon à lui tout seul : consigne, extinction, regroupement."},
    {id:'consigne',ou:"l'affichette du thermostat, dans la salle des serveurs",t:"Pas besoin d'un frigo",
      x:"Les constructeurs de serveurs recommandent un air d'entrée entre 18 et 27 °C. Refroidir une salle à 18 °C ne protège rien de plus et coûte cher : chaque degré de consigne en plus allège le froid. On sépare aussi les allées : l'air froid arrive devant les machines, l'air chaud repart derrière, et les deux ne se mélangent pas.",
      retiens:"Jusqu'à 27 °C en entrée des serveurs : inutile de climatiser comme une chambre froide."},
    {id:'zombies',ou:"Mlle Octet, dans la salle des serveurs",t:"Les serveurs zombies",
      x:"Dans les salles informatiques d'entreprise, un serveur ne travaille en moyenne qu'à 12 à 18 % de sa capacité. Une étude en a trouvé un quart « comateux » : aucune activité depuis six mois, mais toujours branchés. Or un serveur qui ne fait rien consomme encore près de la moitié de sa puissance maximale. Regrouper six machines sur une seule, c'est la virtualisation.",
      retiens:"Un serveur au repos consomme encore la moitié de sa puissance maximale : celui qui ne sert à rien, on l'éteint."},
    {id:'ia',ou:"M. Token, dans la salle de calcul",t:"Les baies qui chauffent",
      x:"Une baie de serveurs classique appelle 3 à 10 kW. Une baie de calcul pour l'intelligence artificielle : 40 à plus de 100 kW, dans le même mètre carré. L'air ne suffit plus : de l'eau circule au contact des processeurs et ressort à 45-60 °C. Une réponse d'assistant consomme une fraction de wattheure ; c'est leur nombre qui pèse.",
      retiens:"Dix fois plus de puissance par baie : le refroidissement passe de l'air à l'eau."},
    {id:'monde',ou:"le mur d'écrans, dans le hall",t:"Les ordres de grandeur",
      x:"Dans le monde, les data centers ont consommé 415 TWh en 2024 : 1,5 % de l'électricité mondiale, presque autant que toute la France. L'Agence internationale de l'énergie attend environ 945 TWh en 2030. En France : une dizaine de TWh, soit 2 % de la consommation, en comptant les salles des entreprises ; 15 à 20 TWh attendus en 2030.",
      retiens:"Environ 2 % de l'électricité aujourd'hui, et une croissance rapide."},
    {id:'tier',ou:"M. Badge, à l'accueil",t:"Combien de minutes par an ?",
      x:"La disponibilité d'un data center se classe en quatre niveaux. Au niveau III, on peut tout entretenir sans rien arrêter : on vise moins de deux heures d'interruption par an. Au niveau IV, une panne n'importe où ne doit rien couper : moins d'une demi-heure par an. Chaque « neuf » de plus après la virgule coûte une rangée de machines en double.",
      retiens:"La disponibilité s'achète avec de la redondance : du matériel qui consomme en attendant de servir."},
    {id:'eau',ou:"les grosses conduites bleues, côté quai",t:"Refroidir sans climatiser",
      x:"Ce site ne fabrique presque pas de froid : il le pompe. Une ancienne galerie de mine lui fournit une eau à 15 °C toute l'année, qui traverse des échangeurs et repart tiédie. Des data centers marseillais font réellement ainsi, et économisent des milliers de MWh par an. Ailleurs, on utilise l'air extérieur dès qu'il est assez frais : c'est le « free cooling ».",
      retiens:"Le meilleur froid est celui qu'on ne produit pas : eau fraîche, air extérieur."},
    {id:'cables',ou:"la trappe aux câbles, sur le quai",t:"Pourquoi Marseille",
      x:"Une vingtaine de câbles sous-marins sortent de la mer à Marseille, venus d'Afrique, du Moyen-Orient et d'Asie : c'est l'un des tout premiers carrefours mondiaux de l'internet. Les data centers s'installent là où les câbles arrivent. L'un d'eux occupe même une ancienne base de sous-marins de 1943, sous un toit de plus de cinq mètres de béton.",
      retiens:"Un data center s'installe où arrivent les réseaux, et où il y a du courant."},
    {id:'carbone',ou:"l'affiche de la halte",t:"Le même calcul, pas le même carbone",
      x:"Un data center consomme la même chose où qu'il soit ; ce qu'il émet dépend du courant local. En 2025, l'électricité française a émis 19,6 g de CO₂ par kWh produit, contre 344 en Allemagne et plus de 600 en Pologne. En Irlande, les data centers absorbent déjà près d'un quart de l'électricité du pays.",
      retiens:"Le carbone d'un service numérique dépend du pays où tournent ses serveurs."}
  ],

  sources:[
    ["AIE, « Energy and AI », 2025 (415 TWh en 2024, 945 TWh en 2030)","https://www.iea.org/reports/energy-and-ai/executive-summary"],
    ["RTE, l'essor des data centers en France","https://www.rte-france.com/bases-electricite/consommation-electricite/essor-data-centers-france"],
    ["ARCEP, enquête « Pour un numérique soutenable », édition 2026 (PUE moyen en France)","https://www.arcep.fr/fileadmin/user_upload/observatoire/enquete-pns/edition-2026/enquete-annuelle-pour-un-numerique-soutenable_edition2026_mai2026.pdf"],
    ["Uptime Institute, enquête mondiale 2025 (PUE moyen mondial)","https://datacenter.uptimeinstitute.com/rs/711-RIA-145/images/2025.Annual.Survey.Report.pdf?version=0"],
    ["ASHRAE, températures recommandées pour les salles informatiques","https://xp20.ashrae.org/datacom1_4th/ReferenceCard.pdf"],
    ["Anthesis et J. Koomey, « Comatose Servers Redux » (un quart de serveurs inactifs)","https://info.anthesisgroup.com/hubfs/Website%20PDFs/Comatose-Servers-Redux.pdf"],
    ["Data Center Dynamics, le refroidissement par l'eau de galerie à Marseille","https://www.datacenterdynamics.com/en/news/interxion-switches-on-river-cooling-at-marseille-data-centers/"],
    ["Engie Solutions, la chaleur d'un data center pour le centre aquatique olympique","https://www.engie-solutions.com/fr/presse/mise-en-service-equinix"],
    ["RTE, Bilan électrique 2025, émissions de CO₂","https://analysesetdonnees.rte-france.com/en/annual-review-2025/ghg-emissions"]
  ]
});

/* ================= CE QUE DISENT LES GENS ET LES CHOSES =================
   Pour chaque source d'information : [ce qui est dit la première fois], [ce qui est dit ensuite]. */
const DAT={};
DAT.dit={
  arrivee:["Marseille, quai des Octets. Un grand bâtiment gris, sans une fenêtre, sans une enseigne. On dirait qu'il n'a rien à dire. Il contient une bonne partie de ce que tout le monde a dit.",
    "L'entrée est droit devant. Derrière le bâtiment, le quai et la mer : c'est par là qu'arrivent les câbles, et que repart la chaleur."],

  // --- le hall
  badge:[["M. Badge, accueil et sûreté. Votre passeport des énergies. Votre pièce d'identité. Votre passeport des énergies, de nouveau : je vérifie que c'est le même.",
      "Ici, on promet à nos clients de ne jamais s'arrêter. Jamais, ça se mesure : moins de deux heures par an. Ma pause déjeuner est plus longue. On m'a demandé de ne pas le dire."],
    ["On ne prend pas de photos. Ce n'est pas que ce soit secret. C'est que ce n'est pas très photogénique : des armoires, puis des armoires."]],
  ecrans:[["Un mur d'écrans. Au centre, une carte du monde constellée de points. Un compteur tourne : « Électricité consommée par les data centers de la planète cette année ». Il tourne vite.",
      "Un bandeau défile : « 415 TWh en 2024. Environ 945 en 2030. Merci de ne pas demander à l'écran s'il est lui-même compté. Il l'est. »"],
    ["Le mur d'écrans. Le compteur a pris quelques gigawattheures depuis ton passage. Personne n'a rien remarqué."]],
  placard:[["M. Placard, responsable informatique d'une mairie. Je suis en visite, comme vous. Chez nous, la « salle serveur », c'est l'ancien placard à balais. Il y fait 17 degrés. Les balais, eux, sont dans mon bureau.",
      "J'ai compté : six serveurs. J'en ai trouvé un qui héberge le site du jumelage avec une ville qui a changé de nom en 1998. Il tourne. Il est climatisé. Il a sa propre ligne au budget."],
    ["En rentrant, je monte la consigne à 24 degrés et j'éteins le serveur du jumelage. Si personne ne téléphone d'ici un mois, c'est qu'il était mort depuis longtemps. C'est ma méthode. Elle est très scientifique."]],

  // --- la salle des serveurs
  sonde:[["Une sonde de température, au milieu de l'allée chaude : 34 °C. Derrière chaque armoire, un souffle tiède, régulier, comme celui d'un très gros sèche-cheveux réglé au minimum.",
      "Une étiquette : « Tout ce que ces machines consomment ressort ici. Tout. Les données, elles, ne pèsent rien et ne chauffent pas : c'est de les déplacer qui chauffe. »"],
    ["La sonde de l'allée chaude. 34 degrés devant, 22 de l'autre côté des armoires. Le bâtiment entier sert à entretenir cet écart."]],
  thermostat:[["Sur le mur, un thermostat sous un capot verrouillé : 22 °C. À côté, une affichette plastifiée : « Consigne d'entrée d'air : entre 18 et 27 °C. Les serveurs ne sont pas des yaourts. »",
      "Plus bas, au stylo : « À celui qui a baissé à 16 pendant la canicule : on sait que c'est toi, Régis. »"],
    ["Le thermostat. 22 degrés, et un capot. Le capot a été ajouté après Régis."]],
  octet:[["Mlle Octet, administratrice. Deux mille armoires, vingt mille serveurs. La moitié de mon travail consiste à trouver ceux qui ne font rien. Ils ne se dénoncent jamais. Ils clignotent comme les autres.",
      "On les appelle les zombies : pas tout à fait morts, plus du tout vivants, et ils consomment. Tiens, voici une liste. Dis-moi lesquels tu débranches."],
    ["Un serveur éteint consomme zéro. C'est le seul équipement de ce bâtiment dont je peux garantir le rendement."]],

  // --- la salle de calcul
  token:[["M. Token, salle de calcul. Ces armoires-là ne stockent rien : elles calculent. Quatre-vingts kilowatts chacune. Une seule consomme autant que seize armoires de la salle voisine, et elle est plus bruyante que les seize réunies.",
      "On ne les refroidit plus à l'air, il faudrait un ouragan. De l'eau passe directement sur les processeurs et ressort à 50 degrés. C'est une très bonne température pour chauffer une piscine. On y travaille."],
    ["On me demande combien consomme une question posée à une IA. Une fraction de wattheure. Ensuite on me demande combien de questions sont posées par jour. Là, je change de sujet."]],

  // --- la salle de contrôle
  ratio:[["Mme Ratio, efficacité énergétique. J'ai un seul chiffre sur mon badge, sur mon écran et sur ma tasse : le PUE. 1,3 ici. Le jour où il passe à 1,29, j'apporte des croissants.",
      "Tu veux voir de quoi il dépend ? Prends le pupitre. Tu as la température, les allées, l'eau de la galerie, les onduleurs. Tu ne peux rien casser : c'est un jumeau numérique. Le vrai, je ne le prête pas."],
    ["Un PUE, ça ne dit pas si les serveurs servent à quelque chose. On peut avoir un excellent PUE avec dix mille zombies. C'est la limite de mon indicateur, et le début du travail de Mlle Octet."]],
  talon:[["M. Talon, suivi des consommations. Regarde cet écran : c'est notre courbe de charge sur une semaine. Oui, c'est une ligne. Non, l'écran n'est pas en panne. J'ai fait vérifier trois fois.",
      "Dans une école, on cherche le talon : ce qui consomme quand il n'y a personne. Ici, il n'y a jamais personne, et tout consomme. Treize mégawatts, 8 760 heures. Je n'ai jamais eu à commenter un graphique. C'est un métier très calme."],
    ["On me demande ce que je surveille, puisque rien ne bouge. Justement : le jour où ça bouge, c'est que quelque chose ne va pas."]],

  // --- le local des batteries
  redondance:[["Mme Redondance. Et voici ma collègue, Mme Redondance. Nous occupons le même poste. Si l'une de nous est absente, l'autre vous répond exactement la même chose. C'est le principe.",
      "Derrière nous : dix minutes d'autonomie en batteries. Dehors : huit groupes électrogènes et trois jours de fioul. Entre les deux : trente secondes pendant lesquelles tout le monde retient son souffle, sauf les serveurs, qui ne remarquent rien."],
    ["Les groupes démarrent le premier mardi de chaque mois, pour vérifier. Le quartier croit qu'il y a une panne. Il n'y a jamais de panne. C'est bien pour ça qu'on vérifie."]],
  redondance2:["Mme Redondance. Ma collègue vous a tout dit ? Alors je confirme. C'est mon rôle : confirmer."],

  // --- côté quai
  calorie:[["Mme Calorie, récupération de chaleur. Ce bâtiment produit dix mégawatts de chaleur. Pendant vingt ans, on a payé pour s'en débarrasser. Maintenant, on la vend. Mon métier a été inventé par quelqu'un qui en avait assez de chauffer les mouettes.",
      "L'air sort à 32 degrés. Trop tiède pour un radiateur, parfait pour une pompe à chaleur, qui le remonte à 70. La piscine du quartier nage dans vos courriels. Je trouve ça poétique. Le directeur trouve ça rentable."],
    ["Le plus dur n'est pas de récupérer la chaleur. C'est de trouver un voisin qui en veut, toute l'année, à moins d'un kilomètre. En août, à Marseille, les candidats sont rares."]],
  conduites:[["Deux grosses conduites bleues sortent du sol et entrent dans le bâtiment. Une plaque : « Eau de galerie · 15 °C · toute l'année ». Elle vient d'une ancienne mine, à des kilomètres d'ici, et coulait déjà vers la mer avant qu'on ait l'idée de s'en servir.",
      "Une seconde plaque, plus récente : « Elle entre à 15 degrés, elle ressort tiédie, elle retourne à la mer. Aucun compresseur n'a été dérangé pour produire ce froid. »"],
    ["Les conduites bleues. Pose la main : celle de gauche est fraîche, celle de droite tiède. Tout le refroidissement du site tient dans cette différence."]],
  trappe:[["Une trappe d'acier jaune dans le quai. Dessous, on devine des câbles gros comme le bras, qui plongent dans le port. Une plaque : « Chambre d'atterrage. Ces câbles relient Marseille à l'Afrique, au Moyen-Orient et à l'Asie. »",
      "En dessous : « Un message pour Singapour met un dixième de seconde. Ne marchez pas dessus : ça n'abîme rien, mais c'est une question de principe. »"],
    ["La trappe aux câbles. La moitié de l'internet de trois continents passe sous tes pieds, sans un bruit."]],
  affiche:[["Une affiche à la halte : « Pourquoi ici ? » Trois arguments, par ordre de taille : les câbles, le courant, le soleil. Le soleil est barré, avec la mention : « Non. Vraiment pas. Il chauffe. »"],
    ["L'affiche de la halte. Même calcul, dix-sept fois moins de carbone qu'en Allemagne. Le soleil est toujours barré."]],

  // --- les vannes (aucune information à la clé)
  cafe:["Une machine à café. C'est le seul équipement du bâtiment à tourner à 100 % de sa capacité, le seul sans redondance, et le seul dont la panne déclenche une cellule de crise."],
  baie:["Une armoire de serveurs. Des centaines de diodes vertes clignotent. Quelque part là-dedans, une photo de ton déjeuner de 2017 attend qu'on la regarde. Elle attendra."],
  baieIA:["Une armoire de calcul. Des tuyaux bleus y entrent, des tuyaux rouges en sortent. Elle ronfle. Une étiquette : « Ne pas demander à cette armoire ce qu'elle pense. Elle répondrait. »"],
  groupe:["Un groupe électrogène de la taille d'un conteneur. Une plaque : « Démarrage en moins de trente secondes. Testé le premier mardi du mois. » Une autre : « Ceci n'est pas une source d'énergie. C'est une assurance. »"],
  cuve:["La cuve de fioul. Soixante-douze heures d'autonomie. C'est le seul endroit du voyage où l'on stocke de l'énergie fossile sans jamais avoir envie de s'en servir."],
  gabian:["Un gabian. C'est le goéland d'ici, en plus gros et en plus sûr de lui. Il se réchauffe sur la bouche d'air chaud. Il a signé un contrat de fourniture avant la piscine."],
  conteneurs:["Des conteneurs empilés. L'un d'eux porte l'inscription « SERVEURS · HAUT ». Quelqu'un a ajouté, à la bombe : « BAS AUSSI, SI ON VA PAR LÀ »."],
  pointu:["Un pointu, la barque des pêcheurs d'ici. Le pêcheur capte quatre barres de réseau au milieu du port. Il dit que le poisson, lui, n'a jamais eu de si bon débit."],
  bureau:["Un poste de travail vide, trois écrans allumés. Sur le clavier, un mot : « Parti en astreinte. Ne rien toucher. Surtout pas le bouton vert. » Il n'y a pas de bouton vert. C'est le but."],
  chefHalte:["Halte du quai des Octets. Le train repart quand vous voulez. Les horaires sont en ligne. Ils sont stockés juste là, d'ailleurs.",
    "On m'a proposé de remplacer le sifflet par une notification. J'ai refusé. Il faut bien que quelque chose, ici, fonctionne sans électricité."],
  quatreneufAttente:"Mme Quatreneuf, directrice du site. Un tampon ? Nous avons un processus. Visitez les salles, voyez le quai, et revenez : je vous attends ici, disponible à 99,99 %.",
  quatreneufApres:["Tampon donné. En double, par sécurité. Si vous revenez un jour avec la courbe de charge de votre mairie, je vous montre où sont vos zombies. C'est offert.",
    "Quatre lignes pour produire de l'électricité, une pour la consommer sans jamais s'arrêter. La sixième étape, c'est la vôtre : ne pas en avoir besoin."]
};

/* ================= LE DÉFI DE MME QUATRENEUF : LES QUESTIONS =================
   Q("question", "bonne réponse", "explication", "mauvaise réponse 1", "pourquoi", "mauvaise réponse 2", "pourquoi") */
DAT.questions=[
  Q("Le site appelle 13 MW au compteur, dont 10 MW pour les serveurs. Quel est son PUE ?","1,3","13 ÷ 10. Tout ce qui dépasse 1, c'est le froid, les pertes électriques et le reste.","0,77","C'est la division à l'envers. Un PUE ne peut pas descendre sous 1.","3","Ça, ce sont les mégawatts qui ne calculent rien, pas le rapport."),
  Q("Que devient l'électricité consommée par un serveur ?","De la chaleur, intégralement","Un serveur est un radiateur qui réfléchit. D'où tout le bâtiment autour.","Elle est stockée dans les données","Les données ne contiennent pas d'énergie. Un disque plein ne pèse pas plus lourd.","Moitié chaleur, moitié calcul","Le calcul n'est pas une forme d'énergie : tout finit en chaleur."),
  Q("13 MW appelés en continu, toute l'année. Quelle énergie sur un an ?","Environ 114 GWh","13 MW × 8 760 heures. La courbe plate fait de petites puissances d'énormes énergies.","Environ 13 GWh","Il manque les heures : une année en compte 8 760, pas 1 000.","Environ 4,7 GWh","Ça, c'est 13 MW fois 365 : des jours, pas des heures."),
  Q("3 h du matin, le réseau tombe. Les groupes électrogènes mettent trente secondes à démarrer. Qui alimente les serveurs entre-temps ?","Les batteries des onduleurs","Elles prennent le relais sans la moindre coupure, pour une dizaine de minutes au plus.","Personne : trente secondes de coupure, c'est acceptable","Pour un serveur, une coupure d'un dixième de seconde est déjà un redémarrage.","Les panneaux solaires du toit","À 3 h du matin, ils ont d'autres projets."),
  Q("Le local serveur de ta mairie est climatisé à 18 °C toute l'année. Que proposes-tu ?","Remonter la consigne vers 24-25 °C","Les serveurs acceptent jusqu'à 27 °C en entrée d'air. Chaque degré gagné allège la climatisation.","Descendre à 16 °C, par prudence","On refroidirait davantage une salle qui n'en a pas besoin. Demande à Régis.","Couper la climatisation","La chaleur des machines doit bien sortir : on règle, on ne coupe pas."),
  Q("Un serveur qui ne fait rien depuis six mois consomme…","Encore près de la moitié de sa puissance maximale","D'où la chasse aux zombies : un serveur inutile coûte presque autant qu'un serveur utile.","Rien, puisqu'il ne travaille pas","Il est allumé, ventilé, refroidi. Seul un serveur éteint consomme zéro.","Autant qu'à pleine charge","Pas tout à fait : la moitié environ. C'est déjà beaucoup trop pour ne rien faire.")
];
