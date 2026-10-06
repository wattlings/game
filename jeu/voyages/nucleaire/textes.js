/* Wattlings · jeu/voyages/nucleaire/textes.js
   Centrale nucléaire de Neutron-sur-Mer : tout ce qui se lit et se dit sur le site.
   - la fiche du site et ses informations à collecter (infos) : un titre (t), un texte (x), une phrase à retenir, l'indice (ou) ;
   - les répliques des personnages et des objets (NUC.dit) ;
   - les questions du défi final (NUC.questions).
   Le site est inventé ; les ordres de grandeur sont réels (sources en bas de la fiche, affichées dans le passeport). */

voyDeclarer('nucleaire',{
  nom:'Centrale nucléaire de Neutron-sur-Mer',
  gare:'Neutron-sur-Mer',
  region:'Nord, littoral',
  theme:'Nucléaire',
  ouvert:true,
  carte:'nucleaire',
  arrivee:[21,26,'up'],
  accroche:"Deux réacteurs, une digue, et la plus grande bouilloire de la région. On ne touche à rien, surtout pas au bouton rouge. Il n'y a pas de bouton rouge.",
  pret:"Infos clés réunies : Mme Isotope t'attend au bout de l'allée des visiteurs !",
  bravo:"Tu sais ce qui chauffe, ce qui tourne, ce qui refroidit, et pourquoi on arrête un réacteur en été plutôt qu'en janvier. Mme Isotope a tamponné après avoir vérifié trois fois : c'est la procédure.",
  paysage:[['#a9c6dc','#dfe8ee'],['#8fa58a','#7a9178'],['#b9c48a','#9aa870']],
  annonces:[
    "Mesdames et messieurs, ce train est à destination de Neutron-sur-Mer. Le contrôle des billets sera suivi d'un contrôle des billets, par sécurité.",
    "Vous cherchez de grandes tours qui fument ? Rangez les jumelles : la centrale est au bord de la mer, elle n'en a pas. Et les tours ne fument pas. Nous y reviendrons.",
    "Neutron-sur-Mer. Température de l'eau : 14 degrés. Un peu plus près de la digue. Le personnel de bord ne commentera pas."],
  annoncesRetour:[
    "Mesdames et messieurs, nous quittons Neutron-sur-Mer. Vous n'êtes pas plus radioactifs qu'à l'aller. Le trajet en train, lui, vous a exposés à quatre heures de rayons cosmiques. C'est offert.",
    "Prochain arrêt : Ampère-sur-Loire. À l'arrivée, sept lampes sur dix seront allumées par ce que vous venez de voir."],

  infos:[
    {id:'fission',ou:"la maquette du cœur, devant le centre d'information",cle:1,t:"La fission",
      x:"Un neutron frappe un noyau d'uranium 235. Le noyau se casse en deux, dégage de la chaleur et libère deux ou trois neutrons, qui vont casser d'autres noyaux : c'est la réaction en chaîne. Dans un réacteur, on s'arrange pour qu'un seul de ces neutrons, en moyenne, provoque une nouvelle fission. Rien ne brûle : pas de flamme, pas de fumée, pas de CO₂.",
      retiens:"Un noyau cassé, de la chaleur, des neutrons. Un seul doit recommencer."},
    {id:'bouilloire',ou:"Mlle Vapeur, devant la salle des machines",cle:1,t:"Une très grosse bouilloire",
      x:"Le cœur chauffe l'eau du circuit primaire : 320 °C, sous 155 bars pour qu'elle ne bouille pas. Elle transmet sa chaleur à un second circuit, dont l'eau devient vapeur et fait tourner la turbine, puis l'alternateur. Un troisième circuit, ici de l'eau de mer, refroidit la vapeur. Rendement : un tiers. Pour 1 300 MW d'électricité, le réacteur produit 3 800 MW de chaleur.",
      retiens:"Trois circuits séparés. Un tiers en électricité, deux tiers en chaleur rendue à la mer."},
    {id:'pilotage',ou:"M. Bore et son simulateur de conduite",cle:1,t:"Piloter la réaction",
      x:"Des barres de contrôle, qui avalent les neutrons, descendent plus ou moins dans le cœur : enfoncées, la puissance baisse. En cas d'alerte, elles tombent toutes en deux secondes. Un réacteur français peut passer de 100 % à 20 % de sa puissance en une demi-heure, et remonter : en 2025, le parc a ainsi retenu 33 TWh pour suivre la consommation et laisser passer le solaire de midi.",
      retiens:"La puissance se règle, lentement. Le nucléaire français suit la consommation."},
    {id:'pastille',ou:"la vitrine de la pastille, devant le centre d'information",t:"Sept grammes",
      x:"Le combustible : des pastilles d'oxyde d'uranium de 7 grammes, grosses comme une gomme de crayon. Chacune libère autant d'énergie qu'une tonne de charbon. Empilées dans des tubes de quatre mètres, les crayons, réunis par 264 en assemblages : il y en a 193 dans le cœur d'un réacteur de 1 300 MW. L'uranium y est enrichi à 3 à 5 %.",
      retiens:"Une pastille de 7 g vaut une tonne de charbon."},
    {id:'ordres',ou:"Mme Gigawatt, au pied du transformateur",cle:1,t:"Les ordres de grandeur",
      x:"Un réacteur de 1 300 MW produit 8 à 9 TWh par an ; les deux de Neutron-sur-Mer, 17 TWh, la consommation de plus de trois millions de foyers. La France compte 57 réacteurs sur 18 sites : 63 GW, 373 TWh en 2025, soit 68 % de son électricité. En moyenne, un réacteur est disponible les trois quarts du temps.",
      retiens:"Un réacteur : 8 à 9 TWh par an. Le parc : deux tiers de l'électricité française."},
    {id:'inertie',ou:"la baie vitrée de la salle des machines",t:"1 500 tours par minute",
      x:"L'alternateur tourne à 1 500 tours par minute, ni plus ni moins : c'est ce qui donne les 50 hertz du réseau. L'ensemble turbine et alternateur pèse des centaines de tonnes. Cette masse lancée ne ralentit pas d'un coup : quand un incident survient sur le réseau, elle amortit le choc pendant les premières secondes. On appelle cela l'inertie.",
      retiens:"Les grosses machines tournantes stabilisent la fréquence du réseau."},
    {id:'barrieres',ou:"l'inspectrice Rigueur, devant le bâtiment réacteur",t:"Trois barrières",
      x:"Entre le combustible et l'extérieur, trois enveloppes successives : la gaine métallique des crayons, le circuit primaire en acier épais, et l'enceinte de béton du bâtiment réacteur. Une autorité indépendante, l'ASNR, contrôle l'exploitant et peut arrêter un réacteur. Tous les dix ans, chaque réacteur subit une visite complète avant d'être autorisé à continuer.",
      retiens:"Gaine, circuit primaire, enceinte : trois barrières, et un contrôleur indépendant."},
    {id:'refroidissement',ou:"Gaston, le pêcheur de la digue",t:"Pas de tour ici",
      x:"Au bord de la mer, pas de grande tour : chaque réacteur pompe 40 à 60 m³ d'eau de mer par seconde, s'en sert pour refroidir sa vapeur, et la rend presque entièrement, une dizaine de degrés plus chaude. Les tours des centrales de rivière servent à prélever beaucoup moins d'eau ; ce qui en sort est de la vapeur d'eau, pas de la fumée.",
      retiens:"En bord de mer, la mer refroidit. Le panache d'une tour, c'est de l'eau."},
    {id:'arret',ou:"M. Planning et son tableau, près de la salle des machines",t:"L'arrêt de tranche",
      x:"Tous les 12 à 18 mois, on arrête le réacteur pour remplacer un tiers ou un quart du combustible et tout inspecter : environ 35 jours pour un simple rechargement, 60 pour une visite partielle, plusieurs mois pour la visite des dix ans. Ces arrêts se programment au printemps et en été, quand le pays consomme le moins.",
      retiens:"On arrête pour recharger quand la demande est basse : jamais en plein hiver si on peut l'éviter."},
    {id:'dechets',ou:"le fût factice, devant le centre d'information",t:"Les déchets",
      x:"La France produit environ 2 kg de déchets radioactifs par habitant et par an, toutes origines confondues. Les plus dangereux, dits de haute activité, pèsent 0,2 % du volume et 97 % de la radioactivité : 4 720 m³ en tout, moins de deux piscines olympiques. Ils sont vitrifiés et entreposés ; leur stockage à 500 mètres sous terre, le projet Cigéo, attend son autorisation.",
      retiens:"Très peu de volume, presque toute la radioactivité : c'est eux qu'il faut isoler très longtemps."},
    {id:'doses',ou:"M. Sievert, au portique d'entrée",t:"Les doses",
      x:"Un habitant de la France reçoit en moyenne 7,1 millisieverts par an : plus de la moitié vient du radon, un gaz naturel du sol, près d'un quart des examens médicaux. Habiter à côté d'une centrale y ajoute environ un millième de millisievert. La limite légale pour le public, hors nature et médecine, est de 1 millisievert par an.",
      retiens:"L'essentiel de la dose reçue vient du sol et des examens médicaux, pas des centrales."},
    {id:'carbone',ou:"Mme Carbone et son compteur, sur l'esplanade",cle:1,t:"Ce que pèse un kWh français",
      x:"Sur tout son cycle de vie, le nucléaire émet 4 à 6 g de CO₂e par kWh. Résultat : en 2025, l'électricité produite en France a émis 19,6 g de CO₂ par kWh, contre 344 en Allemagne. Pour un bilan carbone de bâtiment, l'ADEME retient environ 50 g par kWh consommé, tout compris. Un kWh de gaz en pèse plus de 200 : passer d'une chaudière à une pompe à chaleur change tout.",
      retiens:"L'électricité française est très peu carbonée : l'électrification des usages y a un sens."},
    {id:'creuses',ou:"le vieux chauffe-eau, sur l'esplanade",cle:1,t:"Les heures creuses",
      x:"Un réacteur aime tourner régulièrement, jour et nuit. Dans les années 1960, on a donc inventé les heures creuses : de l'électricité moins chère la nuit, pour y déplacer les chauffe-eau. Depuis novembre 2025, elles migrent : jusqu'à trois heures creuses passent l'après-midi, entre 11 h et 17 h, là où le solaire abonde. Plus aucune entre 7 h et 11 h, ni entre 17 h et 23 h.",
      retiens:"Les heures creuses suivent la production : la nuit hier, la nuit et le début d'après-midi aujourd'hui."},
    {id:'epr',ou:"l'affiche de la halte",t:"L'EPR et la suite",
      x:"Le 57e réacteur français est l'EPR de Flamanville : 1 600 MW, raccordé au réseau en décembre 2024, à pleine puissance pour la première fois le 14 décembre 2025. Fin septembre 2026, il s'est arrêté près d'un an pour sa première grande visite. Six réacteurs d'un modèle voisin, les EPR2, sont en projet à Penly, Gravelines et au Bugey.",
      retiens:"Un nouveau réacteur se compte en décennies, de la décision à la pleine puissance."}
  ],

  sources:[
    ["RTE, Bilan électrique 2025 (production nucléaire, disponibilité, émissions)","https://analysesetdonnees.rte-france.com/bilan-electrique-2025/production"],
    ["ASNR, le parc de réacteurs français","https://recherche-expertise.asnr.fr/savoir-comprendre/surete/parc-reacteurs-nucleaires-francais"],
    ["EDF, l'uranium et le combustible (la pastille de 7 g)","https://www.edf.fr/groupe-edf/comprendre/production/nucleaire/uranium-combustible-nucleaire"],
    ["EDF, étude sur la modulation du parc nucléaire, février 2026","https://www.edf.fr/sites/groupe/files/2026-02/2026_02_16_ETUDE_MODULATION.pdf"],
    ["EDF, analyse du cycle de vie du kWh nucléaire (3,7 g CO₂e)","https://www.edf.fr/sites/groupe/files/2022-06/edfgroup_acv-4_etude_20220616.pdf"],
    ["ANDRA, Inventaire national, Les essentiels 2026","https://www.andra.fr/sites/default/files/2026-02/ANDRA_Inventaire%20national_Essentiel%202026_Web.pdf"],
    ["ASNR, bilan de l'exposition de la population aux rayonnements, septembre 2026","https://www.asnr.fr/actualites/lasnr-publie-le-nouveau-bilan-de-lexposition-de-la-population-francaise-aux-rayonnements"],
    ["ASNR, rejets thermiques des centrales (débits de refroidissement)","https://www.asnr.fr/rejets-thermiques-des-centrales-nucleaires-pendant-les-periodes-estivales"],
    ["CRE, évolution des heures creuses (TURPE 7)","https://www.cre.fr/fileadmin/Documents/Communiques_de_presse/2025/250206_Annexe_CP_TURPE_7_HPHC.pdf"]
  ]
});

/* ================= CE QUE DISENT LES GENS ET LES CHOSES =================
   Pour chaque source d'information : [ce qui est dit la première fois], [ce qui est dit ensuite]. */
const NUC={};
NUC.dit={
  arrivee:["Neutron-sur-Mer. Deux dômes de béton, une salle des machines longue comme un paquebot, et pas la moindre tour à l'horizon.",
    "Le centre d'information est juste là, à gauche. Pour entrer sur le site, il faut passer le portique, au bout de la route."],

  // --- l'esplanade du centre d'information
  maquette:[["Une maquette animée : une bille lumineuse frappe une grosse boule, qui se casse en deux et lâche trois billes. Deux tombent dans un filet marqué « barres de contrôle ». La troisième repart.",
      "Un bouton : « Appuyez pour retirer le filet. » Il est sous une cloche en plexiglas. Vissée. Avec un cadenas."],
    ["La maquette de la fission. Un neutron entre, un seul ressort travailler. Les deux autres ont été absorbés, ce qui est, paraît-il, une belle fin pour un neutron."]],
  pastille:[["Une vitrine, une loupe, et au fond un petit cylindre noir de la taille d'une gomme. L'étiquette : « Pastille factice. 7 grammes. La vraie vaut une tonne de charbon. »",
      "En dessous : « Non, on ne peut pas en emporter une. Oui, on nous le demande toutes les semaines. »"],
    ["La pastille factice. Sept grammes contre une tonne. Les charbonniers du coin n'ont jamais aimé cette vitrine."]],
  fut:[["Un fût jaune, factice, coupé en deux pour montrer l'intérieur : du verre noir dans de l'acier. Un panneau : « Déchets de haute activité de toute la France depuis soixante ans : moins de deux piscines olympiques. »",
      "Plus bas : « Durée de dangerosité : très supérieure à celle de ce panneau. D'où le projet de les mettre à 500 mètres sous terre, plutôt que derrière un panneau. »"],
    ["Le fût factice. Il est vide, mais les visiteurs le contournent quand même. Le jaune fait son effet."]],
  carbone:[["Mme Carbone, service environnement. Ce compteur affiche les émissions de l'électricité française, en direct. Les visiteurs croient qu'il est en panne : il affiche presque toujours la même chose, et c'est presque rien.",
      "Moins de 20 grammes par kWh l'an dernier. Chez nos voisins allemands, dix-sept fois plus. Je ne dis pas ça pour me vanter. Si, un peu."],
    ["Si ton école se chauffe au gaz, chaque kWh pèse plus de 200 grammes. À l'électricité, avec une pompe à chaleur, trois à quatre fois moins de kWh, et chacun pèse quatre fois moins. Fais la multiplication, je t'attends."]],
  ballon:[["Un vieux chauffe-eau de 1968, posé sur un socle comme une statue. Une plaque : « Premier appareil de la commune piloté en heures creuses. Il a chauffé chaque nuit pendant quarante ans, parce que les réacteurs n'aiment pas ralentir. »",
      "Ajouté au marqueur : « Depuis novembre 2025, ses petits-enfants chauffent aussi l'après-midi. Le soleil a pris le relais de la nuit. Personne ne l'a prévenu. »"],
    ["Le chauffe-eau de 1968. Un contacteur, une horloge, et l'idée la plus rentable de l'histoire de l'électricité : consommer quand ça arrange le réseau."]],
  affiche:[["Une affiche à la halte : « Le 57e réacteur ». Une photo de dôme, une frise chronologique très, très longue, et une flèche « Vous êtes ici » qui a été déplacée plusieurs fois."],
    ["L'affiche de l'EPR. La frise chronologique dépasse du cadre. Quelqu'un a scotché une feuille pour la prolonger."]],

  // --- sur le site
  sievert:[["M. Sievert, radioprotection. Portique à l'entrée, portique à la sortie. Si ça sonne à l'entrée, c'est que vous revenez de chez le radiologue. Ça arrive toutes les semaines.",
      "Vous voulez un chiffre ? Vous recevez sept millisieverts par an, comme tout le monde. La moitié vient de votre cave. Vivre ici en ajoute un millième. Les gens ont peur de ma centrale et pas de leur cave. Je ne juge pas, je mesure."],
    ["Une banane contient du potassium, donc un peu de radioactivité : un dixième de microsievert. Il faudrait en manger dix par an pour égaler ce que la centrale ajoute à un riverain. On me demande si c'est vrai. C'est vrai. On me demande si c'est grave. Non. Ni la banane, ni le reste."]],
  rigueur:[["Inspectrice Rigueur, ASNR. Non, je ne travaille pas pour l'exploitant. C'est tout l'intérêt. Je peux faire arrêter ce réacteur avec un courrier. J'ai un très bon stylo.",
      "Derrière ce mur : un mètre de béton, puis une cuve d'acier de vingt centimètres, puis des gaines de métal autour de chaque pastille. Trois barrières. On vérifie les trois, et on recommence."],
    ["Tous les dix ans, visite complète. Le réacteur est vidé, ausculté, éprouvé. S'il passe, il repart pour dix ans. Sinon, il attend. Moi aussi, j'attends. J'ai une excellente patience."]],
  vapeur:[["Mlle Vapeur, salle des machines. Derrière moi, une turbine de soixante mètres et un alternateur. Tout ce bâtiment sert à une seule chose : faire tourner un aimant. Très vite. Très gros.",
      "Les visiteurs croient que le nucléaire, c'est compliqué. La partie compliquée, c'est de chauffer l'eau. Après, c'est une bouilloire et un moulin. Tiens, remets-moi les étapes dans l'ordre."],
    ["Deux tiers de la chaleur partent à la mer. Ce n'est pas du gâchis, c'est de la thermodynamique : toutes les centrales à vapeur font pareil, au charbon comme au gaz. La nôtre, au moins, ne fume pas."]],
  baie:[["Une baie vitrée sur la salle des machines. En bas, un cylindre vert long comme deux autobus : l'alternateur. Un compteur au mur : « 1 500 tours par minute ». Il n'a pas bougé d'un tour depuis que tu regardes.",
      "Une note : « Si ce chiffre change, toute l'Europe change avec. Merci de ne pas souffler sur la vitre. »"],
    ["La baie vitrée. 1 500 tours par minute, 50 hertz. C'est le métronome du réseau, et il pèse plusieurs centaines de tonnes."]],
  gigawatt:[["Mme Gigawatt, exploitation. On m'appelle comme ça parce que je refuse de parler en mégawatts. Le site : 2,6 gigawatts. Le transformateur derrière moi : 400 000 volts. Mon café : une tasse, je sais rester raisonnable.",
      "Dix-sept térawattheures par an sortent d'ici. C'est mille fois la centrale solaire de Saint-Photon. Je ne dis pas ça contre eux : ils ont des brebis, c'est charmant."],
    ["Cinquante-sept réacteurs en France. Quand on en arrête un pour le recharger, les cinquante-six autres ne s'en aperçoivent pas. C'est ça, un parc."]],
  planning:[["M. Planning. Je programme les arrêts. Un arrêt, c'est dix mille gestes, des milliers de personnes, et un tableau. Le tableau, c'est moi. Si une case glisse, tout glisse.",
      "Règle numéro un : on ne recharge pas en janvier. En janvier, le pays a froid et le réseau a besoin de tout le monde. Alors on s'arrête quand il fait beau. Mes collègues prennent leurs vacances en novembre. Ils me détestent."],
    ["Trente-cinq jours pour un rechargement, soixante pour une visite partielle, des mois pour la décennale. Et toujours quelqu'un pour demander si on ne pourrait pas « faire un peu plus vite »."]],
  gaston:[["Gaston. Je pêche ici depuis trente ans. Le bar adore la sortie du canal : l'eau y est dix degrés plus chaude qu'ailleurs. Les touristes cherchent la tour qui fume. Je leur dis qu'il n'y en a pas. Ils ont l'air déçus.",
      "Cinquante mètres cubes à la seconde, par réacteur. Ça entre froid, ça sort tiède, et ça retourne à la mer. La tour, c'est pour ceux qui n'ont qu'une rivière. Et ça ne fume pas, ça fait des nuages. J'ai expliqué ça mille fois. Le bar, lui, a compris tout de suite."],
    ["On me demande si mes poissons sont radioactifs. Je réponds : moins que le granit de votre cuisine. Ensuite on me demande une recette."]],

  // --- les vannes (aucune information à la clé)
  bouton:["Sur le pupitre du simulateur, sous un capot, un gros bouton rouge. Une étiquette : « Arrêt automatique du réacteur. Ce bouton ne fait rien exploser. Il fait exactement le contraire. C'est très décevant pour les scénaristes. »"],
  beignets:["Une boîte de beignets vide, sur une chaise. Un mot : « Interdits en salle de commande depuis qu'un dessin animé a donné une mauvaise image de la profession. »"],
  zone:["Une porte lourde, un trèfle jaune et noir, un lecteur de badge. « Zone contrôlée. Accès réservé. » Ton passeport des énergies n'ouvre pas cette porte. Tu as essayé. Le lecteur a émis un petit bip navré."],
  mouette:["Une mouette sur la clôture. Elle surveille la sortie du canal, où les poissons sont nombreux et tièdes. C'est la seule riveraine à avoir déposé un avis favorable."],
  camera:["Une caméra de surveillance. Elle te suit. Tu fais un pas à gauche : elle suit. Tu lui fais un signe. Quelque part, quelqu'un soupire."],
  pompe:["La station de pompage. Derrière les grilles, des tambours filtrent l'eau de mer : algues, méduses, et de temps en temps un poisson très étonné. Un écriteau : « Par forte arrivée de méduses, on baisse la puissance. Ce n'est pas une blague. »"],
  ligne:["Les lignes à 400 000 volts partent vers l'intérieur des terres. Elles grésillent par temps humide. Ici, c'est-à-dire tout le temps."],
  chefHalte:["Halte de Neutron-sur-Mer. Le train repart quand vous voulez. Présentez votre billet, puis votre billet.",
    "On me demande si la halte est sûre. Madame, monsieur, c'est la halte la plus contrôlée de France. Même l'horloge a été inspectée."],
  isotopeAttente:"Mme Isotope, directrice. Un tampon ? Ici, on ne signe rien sans avoir tout vérifié. Faites le tour du site, puis revenez.",
  isotopeApres:["Tampon donné, consigné, archivé. Si vous l'égarez, il existe une procédure. Elle fait quarante pages. Ne l'égarez pas.",
    "On me demande ce qui est le plus difficile dans mon métier. Ce n'est pas la physique. C'est d'expliquer à tout le monde, chaque jour, que les tours ne fument pas. Et nous n'avons même pas de tour."]
};

/* ================= LE DÉFI DE MME ISOTOPE : LES QUESTIONS =================
   Q("question", "bonne réponse", "explication", "mauvaise réponse 1", "pourquoi", "mauvaise réponse 2", "pourquoi") */
NUC.questions=[
  Q("Dans un réacteur en fonctionnement stable, combien de neutrons issus d'une fission doivent, en moyenne, en provoquer une autre ?","Un seul","Moins d'un, la réaction s'éteint ; plus d'un, elle s'emballe. Les barres de contrôle servent à tenir ce « un ».","Tous, pour produire le maximum","La puissance doublerait en une fraction de seconde. C'est précisément ce qu'on empêche.","Aucun","Alors plus de fission, plus de chaleur, plus de courant. C'est un arrêt."),
  Q("Un réacteur produit 3 800 MW de chaleur et 1 300 MW d'électricité. Où passe la différence ?","Dans l'eau de refroidissement : ici, la mer","Un tiers en électricité, deux tiers en chaleur rejetée : c'est le lot de toutes les centrales à vapeur.","Elle est stockée dans le cœur pour la nuit","La chaleur ne se garde pas dans un cœur : il faut l'évacuer en permanence.","Elle est perdue dans les lignes à haute tension","Les pertes en ligne se comptent en quelques pour cent, pas en deux tiers."),
  Q("Un réacteur de 1 300 MW, disponible les trois quarts du temps. Que produit-il en un an, à peu près ?","8,5 TWh","1,3 GW × 8 760 h × 0,75. Retiens l'ordre de grandeur : 8 à 9 TWh par réacteur.","11,4 TWh","Ce serait à pleine puissance, sans un seul arrêt. M. Planning en rêve.","850 GWh","Il manque un zéro : ça, c'est un parc éolien en mer."),
  Q("Midi, un dimanche de juin : le solaire couvre une bonne part de la consommation. Que font les réacteurs français ?","Ils baissent leur puissance, puis remontent le soir","C'est le suivi de charge : 33 TWh ainsi modulés en 2025.","Rien : un réacteur ne peut tourner qu'à 100 %","Idée répandue, et fausse pour le parc français, conçu pour moduler.","Ils s'arrêtent tous jusqu'au soir","Un arrêt complet coûte des heures de redémarrage. On baisse, on ne coupe pas."),
  Q("Ta mairie remplace une chaudière gaz par une pompe à chaleur. Pour son bilan carbone, quel facteur compte pour l'électricité consommée en France ?","Environ 50 g de CO₂e par kWh","Contre plus de 200 g pour un kWh de gaz, et la pompe à chaleur consomme trois à quatre fois moins de kWh.","Environ 500 g, comme partout","C'est l'ordre de grandeur de pays qui brûlent du charbon. Pas celui de la France.","Zéro, puisque c'est du nucléaire","Jamais zéro : il y a la mine, le béton, et le reste du mix. Peu, mais pas rien."),
  Q("Depuis novembre 2025, le chauffe-eau d'un abonné « heures creuses » peut se déclencher…","La nuit, et en début d'après-midi","Jusqu'à trois heures creuses entre 11 h et 17 h, au moins cinq la nuit : on suit le solaire.","Uniquement la nuit, comme toujours","C'était le cas le plus courant pendant soixante ans. Plus maintenant.","À 19 h, quand tout le monde rentre","C'est la pointe : exactement l'heure à éviter.")
];
