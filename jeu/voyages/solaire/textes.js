/* Wattlings · jeu/voyages/solaire/textes.js
   Centrale solaire de Saint-Photon : tout ce qui se lit et se dit sur le site.
   - la fiche du site et ses informations à collecter (infos) : une information = un titre (t), un texte (x), une phrase à retenir, et l'indice affiché tant qu'on ne l'a pas trouvée (ou) ;
   - les répliques des personnages et des objets (SOL.dit) ;
   - les questions du défi final (SOL.questions).
   Le site est inventé ; les ordres de grandeur sont réels (sources en bas de la fiche, affichées dans le passeport). */

voyDeclarer('solaire',{
  nom:'Centrale solaire de Saint-Photon',
  gare:'Saint-Photon-les-Cigales',
  region:'Provence, arrière-pays',
  theme:'Photovoltaïque',
  ouvert:true,
  carte:'solaire',
  /* sur la carte du pays (touche K, puis dézoomer) : où est le site, et par où passe sa ligne depuis Ampère-sur-Loire */
  pays:[5.95,44.0],rail:[[3.16,46.99],[4.85,45.75],[4.9,44.93],[4.8,43.95]],cote:'droite',
  arrivee:[22,26,'up'],
  accroche:"Douze mégawatts-crête, vingt-huit mille modules, deux cents brebis. Aucune ne sait ce qu'est un onduleur.",
  pret:"Infos clés réunies : Mme Zénith t'attend au poste de livraison !",
  bravo:"Tu sais lire une cloche, distinguer un kWc d'un kWh et déplacer une consommation vers midi. Mme Zénith a tamponné sans soupirer : c'est rare.",
  /* ciel, collines, premier plan : le paysage du trajet glisse de la Loire vers la Provence */
  paysage:[['#6cc0f0','#d8eefa'],['#b8b48a','#9c9a6c'],['#d9c98a','#b8a660']],
  annonces:[
    "Mesdames et messieurs, bienvenue à bord. Ce train relie Ampère-sur-Loire à Saint-Photon-les-Cigales. Il n'avait jamais roulé : soyez indulgents avec les virages.",
    "Regardez par la fenêtre : la ligne électrique suit la voie. Depuis ce matin, c'est elle qui nous tire. D'où vient son courant ? C'est tout l'objet du voyage.",
    "Nous arrivons en Provence. Température extérieure : élevée. Le personnel de bord vous rappelle que la clim consomme, et que vous le savez mieux que personne."],
  annoncesRetour:[
    "Mesdames et messieurs, nous quittons Saint-Photon-les-Cigales. Vérifiez que vous n'emportez ni brebis, ni module, ni coup de soleil.",
    "Prochain arrêt : Ampère-sur-Loire, terminus. Là-bas, les bâtiments consomment. Vous venez de voir d'où ça peut venir à midi."],

  infos:[
    {id:'effet',refs:['cea-cellules-pv','enedis-technologies-enr'],ou:"la vitrine de l'espace d'accueil",cle:1,t:"L'effet photovoltaïque",
      x:"Un grain de lumière, un photon, frappe une cellule en silicium et y bouscule un électron. Des milliards d'électrons bousculés dans le même sens, c'est un courant. Aucune pièce ne bouge, rien ne brûle : la cellule fournit du courant continu tant qu'elle est éclairée.",
      retiens:"Lumière → courant continu, directement. Ni turbine, ni vapeur."},
    {id:'module',refs:['solartraders-module-430','fraunhofer-pv-report'],ou:"M. Crête, à l'espace d'accueil",cle:1,t:"Le module et le kilowatt-crête",
      x:"Un module de cette centrale mesure 1,95 m² et affiche 430 watts-crête (Wc). La puissance crête est celle qu'il fournit en laboratoire : 1 000 W de soleil par m², cellules à 25 °C. Dehors, il s'en approche parfois et l'atteint rarement. Son rendement : environ 22 % de la lumière reçue devient de l'électricité.",
      retiens:"Le kWc est une puissance de référence, pas une promesse de production."},
    {id:'productible',refs:['gsa-saint-photon','gsa-orleans','gsa-lille'],ou:"le grand panneau du site, à la sortie du quai",cle:1,t:"Le productible : des kWc aux kWh",
      x:"Ici, chaque kWc installé produit environ 1 450 kWh par an. À Ampère-sur-Loire, ce serait plutôt 1 070 ; à Lille, autour de 1 000. La centrale : 12 MWc, 28 000 modules, environ 17 GWh par an. C'est comme si elle tournait à pleine puissance 1 450 heures sur les 8 760 de l'année : un facteur de charge de 16,6 %.",
      retiens:"Production annuelle = puissance crête × productible du lieu."},
    {id:'chaleur',refs:['solartraders-module-430','pveducation-noct'],ou:"la station météo, dans le champ de panneaux fixes",t:"Le soleil, oui. La chaleur, non.",
      x:"Un module perd environ 0,3 % de puissance par degré au-dessus de 25 °C. En plein été, ses cellules montent à 65 °C : 12 % de moins que sur l'étiquette. Les meilleures heures de l'année tombent souvent au printemps, par temps clair, frais et un peu venté.",
      retiens:"Le photovoltaïque aime la lumière, pas la canicule."},
    {id:'onduleur',refs:['enedis-technologies-enr','krannich-onduleur-350','enedis-protections-decouplage'],ou:"M. Sinus, devant les armoires des onduleurs",cle:1,t:"L'onduleur",
      x:"Les modules produisent du courant continu ; le réseau est en alternatif, à 50 hertz. L'onduleur fait la conversion, avec environ 98 % de rendement. Il cherche aussi en permanence le meilleur point de fonctionnement des modules, et se coupe tout seul si le réseau disparaît. Il y en a six ici : quand l'un tombe, un sixième de la production s'éteint.",
      retiens:"Pas d'onduleur, pas d'injection. C'est aussi lui qui surveille le mieux la production."},
    {id:'reseau',refs:['enedis-technologies-enr','enedis-nmo-cf-015e'],ou:"le transformateur, près du poste de livraison",t:"Du champ à la prise",
      x:"En sortie d'onduleur, le courant est à quelques centaines de volts. Un transformateur l'élève à 20 000 volts, la tension du réseau de distribution, puis le poste de livraison le remet au gestionnaire de réseau. C'est là que se trouve le compteur de production : une courbe de charge au pas de 10 minutes, exactement comme pour un bâtiment, mais dans l'autre sens.",
      retiens:"Un producteur a lui aussi un point de livraison, un compteur et une courbe de charge."},
    {id:'tracker',refs:['iea-pvps-trackers'],ou:"le pupitre de Mlle Azimut, dans le champ des trackers",t:"Suivre le soleil",
      x:"Un tracker fait pivoter les modules d'est en ouest au fil de la journée. Gain : environ 20 % de production en plus, et surtout une courbe plus large, le matin et le soir. Prix à payer : un moteur, des pièces qui bougent, de l'entretien, et plus d'espace entre les rangées.",
      retiens:"Orientation et inclinaison décident de la quantité produite, et de l'heure à laquelle on la produit."},
    {id:'cloche',refs:['rte-be2025-production'],ou:"l'écran de supervision de Mlle Cloche",cle:1,t:"La courbe en cloche",
      x:"La production d'une journée dessine une cloche : zéro la nuit, un sommet en début d'après-midi, plus large en juin qu'en décembre. Un nuage y creuse une dent. Un plateau au sommet signale un écrêtage ; une marche brutale, une panne ; une cloche plus basse que prévu, des modules sales. Elle se lit comme la courbe d'un bâtiment.",
      retiens:"On compare toujours la production mesurée à la production attendue pour la météo du jour."},
    {id:'variable',refs:['iea-pvps-prevision','panorama-enr-2025','rte-be2025-production'],ou:"Dr Nuage et sa caméra de ciel",t:"Variable, mais prévisible",
      x:"Le solaire ne produit pas à la demande : il suit le soleil et les nuages. En revanche il se prévoit bien, la veille, à quelques pour cent près à l'échelle d'une région. Entre décembre et juin, la production mensuelle varie du simple au triple. Le réseau compense avec ce qui se pilote : barrages, centrales, stockage, et consommateurs qui acceptent de décaler leurs usages.",
      retiens:"Variable ne veut pas dire imprévisible."},
    {id:'surface',refs:['lbnl-surface-pv','inrae-paturage-pv'],ou:"Marius, le berger",t:"La place que ça prend",
      x:"Au sol, il faut compter 1 à 1,5 hectare par MWc. Cette centrale occupe 14 hectares, une vingtaine de terrains de football, sur une ancienne carrière dont personne ne voulait. L'herbe pousse sous les modules : deux cents brebis la tondent, sans carburant et sans préavis de grève.",
      retiens:"Environ 1 hectare par MWc : l'ordre de grandeur à garder en tête."},
    {id:'carbone',refs:['ademe-empreinte-pv-2026','nrel-degradation','soren-rapport-2025'],ou:"la palette de vieux modules, au bord du chemin",t:"Le bilan carbone et la fin de vie",
      x:"Fabrication comprise, l'électricité solaire produite en France émet entre 20 et 30 g de CO₂e par kWh. Une centrale à gaz dépasse 400 g. Un module vit une trentaine d'années et perd environ 0,5 % de puissance par an. En fin de vie, il est collecté puis valorisé à plus de 90 % : verre, aluminium, cuivre.",
      retiens:"Le solaire émet à la fabrication, presque rien ensuite : tout se joue sur sa durée de vie."},
    {id:'batiment',refs:['ministere-autoconsommation'],ou:"la maquette de l'école, à l'espace d'accueil",cle:1,t:"Et sur mon toit ?",
      x:"Deux taux à ne pas confondre. Autoconsommation : la part de ma production que je consomme sur place. Autoproduction : la part de ma consommation couverte par mes panneaux. Une petite installation est presque entièrement autoconsommée, mais couvre peu ; une grande couvre davantage, mais déborde à midi. Le levier le moins cher : déplacer vers le milieu de journée ce qui peut l'être.",
      retiens:"Autoconsommation = part de la production. Autoproduction = part de la consommation."},
    {id:'midi',refs:['rte-be2025-prix','cre-prix-negatifs','cre-heures-creuses'],ou:"M. Riverain, près du champ de lavande",t:"Quand tout le monde produit à midi",
      x:"Les jours de grand soleil et de faible demande, il y a trop d'électricité au même moment : en 2025, le prix de gros a été négatif pendant 513 heures en France. Les grandes centrales doivent alors réduire leur production. Pour un bâtiment, c'est un signal : consommer à ces heures-là soulage le réseau et, avec le bon contrat, la facture.",
      retiens:"L'électricité la moins chère de la journée est de plus en plus souvent celle de midi."},
    {id:'france',refs:['rte-be2025-production','rte-be2025-synthese','panorama-enr-2025'],ou:"l'affiche de la halte",t:"Le solaire en France",
      x:"Fin 2025, la France comptait 30,4 GW de solaire installés : plus que tous ses barrages réunis (25,7 GW). Production 2025 : 32,9 TWh, soit 6 % de l'électricité du pays. Les barrages, avec moins de puissance, ont produit presque deux fois plus : 62,4 TWh.",
      retiens:"Puissance installée et énergie produite ne se comparent pas : entre les deux, il y a le nombre d'heures."}
  ],

  /* les références : chaque information porte les siennes (refs, ci-dessus) ; celles-ci appuient ce que disent les habitants,
     les panneaux et les simulations. Les clés sont celles du registre commun/donnees/sources.js. */
  refs:['rte-be2025-rapport','rte-be2025-consommation','rte-interconnexions','edf-solaire-chiffres','edf-consommation-chiffres','insee-bilan-demographique-2025','edf-gravelines','edf-chooz',
    'iea-pvps-salissures','iea-pvps-acv','fraunhofer-pv-report','gsa-nevers','cre-services-systeme','enedis-nmo-cf-077e','utrecht-cameras-ciel','kippzonen-pyranometre','reussir-patre-moutons','rex-transformateur-bourdonnement']
});

/* ================= CE QUE DISENT LES GENS ET LES CHOSES =================
   Pour chaque source d'information : [ce qui est dit la première fois], [ce qui est dit ensuite]. */
const SOL={};
SOL.dit={
  arrivee:["Saint-Photon-les-Cigales. Le quai fait onze mètres. Le train en fait cent quatre-vingt-dix. Tout le monde a l'air de trouver ça normal.",
    "Devant toi, la centrale solaire. Suis le chemin : l'accueil est juste là, le poste de livraison tout au fond."],

  // --- accueil
  totem:[["Un grand panneau : « Centrale solaire de Saint-Photon · 12 MWc · 28 000 modules · 14 hectares · environ 17 GWh par an ».",
      "En dessous, au feutre : « Soit la consommation domestique d'environ 7 000 habitants. Les 7 000 habitants ne sont pas fournis. »"],
    ["Le panneau du site : 12 MWc, 28 000 modules, 14 hectares, environ 17 GWh par an. Quelqu'un a ajouté un soleil souriant. Il a l'air de savoir ce qu'il vaut."]],
  cellule:[["Une vitrine. Dedans, une cellule de silicium coupée en deux, et un schéma : un photon arrive, un électron s'en va.",
      "La légende précise : « Aucun électron n'a été maltraité. Ils sont juste un peu bousculés. »"],
    ["La cellule en vitrine. Un photon, un électron, du courant continu. La physique la plus rentable du site tient dans dix centimètres."]],
  maquette:[["Une maquette : une école, des panneaux sur le toit, et deux curseurs marqués « autoconsommation » et « autoproduction ».",
      "Un écriteau : « Ne pas confondre. Vraiment. Mme Zénith pose la question à tout le monde. »"],
    ["La maquette de l'école. Les deux curseurs sont usés à force d'être confondus."]],
  affiche:[["Une affiche à la halte : « Le solaire en France, fin 2025 ». Un grand soleil, trois chiffres, et un barrage dessiné dans un coin, l'air vexé."],
    ["L'affiche de la halte. Le barrage dessiné dans le coin a toujours l'air vexé. Il a ses raisons : il produit deux fois plus."]],

  // --- les gens
  crete:[["Crête. Kilowatt-Crête, pour les intimes. C'est moi qui visse les modules. Vingt-huit mille. J'ai compté.",
      "Regarde l'étiquette au dos : 430 Wc. Les gens lisent ça comme une promesse. C'est une note obtenue en labo, un jour de printemps, sans vent et sans pigeon."],
    ["Un module qui donne sa puissance crête en plein mois d'août ? Je cherche encore. Par contre, en avril, par mistral, ils se surpassent. Comme quoi le confort, ça ne motive personne."]],
  sinus:[["M. Sinus, exploitation. Mes onduleurs prennent du continu et rendent de l'alternatif, cinquante fois par seconde, sans jamais se plaindre. J'aimerais en dire autant des stagiaires.",
      "Six armoires. Si l'une s'arrête, un sixième du champ produit pour rien. Les modules, eux, ne remarquent rien. Ils sont très détendus, les modules."],
    ["Quatre-vingt-dix-huit pour cent de rendement. Les deux pour cent qui manquent, c'est la chaleur que tu sens sur la porte. On ne peut pas tout réussir."]],
  azimut:[["Mlle Azimut. Je règle les trackers. Mes panneaux regardent le soleil toute la journée ; mes collègues, eux, regardent leur téléphone. Devine qui produit le plus.",
      "Tu veux essayer ? Le pupitre est là. Incline, oriente, et regarde ce que ça donne sur l'année. On en reparle après."],
    ["Un tracker, c'est vingt pour cent de production en plus et un moteur à graisser. Rien n'est gratuit. Sauf le soleil, et encore, il faut venir le chercher."]],
  cloche:[["Mlle Cloche, supervision. Je regarde une cloche toute la journée. La nuit, je regarde une ligne plate. C'est un métier très reposant, sauf quand la cloche a une forme bizarre.",
      "Justement : j'ai cinq courbes de la semaine qui ne ressemblent pas à ce qu'elles devraient. Viens voir l'écran, dis-moi ce qui cloche. Oui, je la fais à tout le monde."],
    ["Une bonne courbe, c'est une courbe qui ressemble à la météo. Une mauvaise courbe, c'est une courbe qui ressemble à autre chose. Tout le métier est là."]],
  nuage:[["Dr Nuage, prévision. Je dis ce soir ce que la région produira demain. Je me trompe de quelques pour cent ; sur une seule centrale, un peu plus. La météo de la télé se trompe de pull.",
      "On me dit souvent : « Le solaire, c'est imprévisible. » Non. C'est variable. Ce n'est pas pareil : la marée aussi est variable, et personne ne s'en étonne."],
    ["Demain ? Beau jusqu'à quinze heures, puis des cumulus. Tu verras les dents sur la courbe. Chaque nuage signe son passage."]],
  capteur:[["Une station météo : un mât, un thermomètre, et une petite coupole de verre qui mesure le rayonnement en watts par mètre carré.",
      "L'écran affiche la température des modules. Elle est nettement plus élevée que la tienne. Ils ne se plaignent pas, mais ils produisent moins."],
    ["La station météo. Le thermomètre des modules grimpe plus vite que celui de l'air. Les panneaux bronzent mal."]],
  berger:[["Marius, berger. Deux cents brebis sous les panneaux. Elles ont de l'ombre, de l'herbe, et aucune opinion sur la transition énergétique. Je les envie.",
      "L'exploitant me paie pour qu'elles broutent. Avant, il payait un tracteur. Le tracteur ne faisait pas d'agneaux."],
    ["On me demande si les panneaux gênent les bêtes. Regarde-les : en août, elles se battent pour être dessous. Le seul qui gêne, c'est le chien. Il s'appelle Watt. Il se prend pour le chef."]],
  palette:[["Une palette de modules démontés, étiquetée « Fin de vie · collecte ». Sur l'un d'eux, un autocollant de 2009 : 180 Wc.",
      "Dix-sept ans de service, toujours fonctionnel, plus de deux fois moins puissant que les neufs. Il part au recyclage avec les honneurs."],
    ["La palette de vieux modules. Verre, aluminium, cuivre : presque tout repart. Il reste le silicium, et la nostalgie."]],
  transfo:[["Un transformateur. Une plaque : « 20 000 V · Danger de mort ». Un bourdonnement grave, régulier, très sûr de lui.",
      "À côté, le poste de livraison et son compteur. Le compteur tourne à l'envers de tous ceux que tu as relevés jusqu'ici : il compte ce qui sort."],
    ["Le transformateur bourdonne à cent hertz : deux fois la fréquence du réseau. C'est la note du réseau, une octave plus haut. Toute l'Europe chante la même."]],
  riverain:[["M. Riverain. J'habite la maison derrière la colline. Je n'ai rien contre le solaire, notez. Mais à midi, quand il y en a trop, on paie des gens pour ne plus en produire. Expliquez-moi ça.",
      "Mon neveu fait tourner son lave-linge à midi depuis qu'il a un contrat qui change de prix selon l'heure. Il dit que c'est l'avenir. Il a huit ans de crédit sur le lave-linge, donc il a intérêt."],
    ["Je vous ai dit pour les cigales ? Elles chantent plus fort près des onduleurs. Je crois qu'elles essaient de s'accorder dessus."]],

  // --- les vannes (aucune information à la clé)
  creme:["Un distributeur de crème solaire, indice 50. Une note manuscrite : « Les modules n'en ont pas besoin. Vous, si. »"],
  cigale:["Une cigale. Puissance sonore : 90 décibels. Consommation électrique : nulle. Facteur de charge : 100 % de juin à août. Aucun moyen de l'effacer aux heures de pointe."],
  danger:["Un panneau : « Défense d'entrer · Danger de mort ». En dessous, plus petit : « Les brebis sont autorisées. Elles ne touchent à rien. Prenez-en de la graine. »"],
  lapin:["Un lapin, à l'ombre d'un module. Il te regarde, puis regarde le câble. Tu as l'impression d'interrompre quelque chose."],
  patou:["Watt, le patou. Il garde deux cents brebis et douze mégawatts-crête. Il ne fait pas la différence. Dans le doute, il aboie sur tout."],
  chefHalte:["Halte de Saint-Photon-les-Cigales, un train par… enfin, un train. Il repart quand vous voulez : montez, et il part.",
    "On m'a nommé chef de halte la semaine dernière. Avant, j'étais chef de rien du tout au même endroit. La promotion se sent surtout à la casquette."],
  zenithAttente:["Mme Zénith, cheffe d'exploitation. Tu veux un tampon ? Tout le monde veut un tampon. Reviens quand tu sauras de quoi tu parles."],
  zenithApres:["Tampon donné, tampon mérité. Reviens quand tu veux. Et si tu poses des panneaux sur ton école, envoie-moi la courbe : j'adore corriger les copies.",
    "Un réacteur nucléaire produit entre 5 et 9 TWh par an, selon sa taille. Ma centrale, 17 GWh. Il en faudrait environ quatre cents comme la mienne pour en égaler un seul. Je le dis avant que tu l'apprennes ailleurs : c'est plus élégant."]
};

/* ================= LE DÉFI DE MME ZÉNITH : LES QUESTIONS =================
   Q("question", "bonne réponse", "explication", "mauvaise réponse 1", "pourquoi", "mauvaise réponse 2", "pourquoi") : le même raccourci que dans les arènes. */
SOL.questions=[
  Q("Une installation de 100 kWc en Provence. Que produit-elle en un an, à peu près ?","145 000 kWh","100 kWc × 1 450 kWh par kWc. La puissance crête ne dit rien sans le productible du lieu.","876 000 kWh","Ce serait 100 kW pendant 8 760 heures : il faudrait du soleil la nuit.","100 000 kWh","Presque : c'est ce qu'elle donnerait à Lille."),
  Q("Mi-août, 38 °C, ciel parfaitement bleu. La centrale plafonne à 85 % de sa puissance crête. Pourquoi ?","Les cellules sont trop chaudes","Environ 0,3 % de perte par degré au-dessus de 25 °C : à 65 °C, cela fait déjà 12 %. L'onduleur, les câbles et la poussière font le reste.","Le soleil est trop fort","Plus de lumière, c'est plus de courant. C'est la chaleur qui coûte.","Les onduleurs font la sieste","M. Sinus te ferait répéter ça devant ses armoires."),
  Q("Sur la courbe du jour, la production décroche d'un sixième à 11 h, d'un coup, et ne remonte pas. Tu appelles…","M. Sinus : un onduleur est tombé","Une marche nette, d'une fraction ronde : c'est un équipement qui s'arrête, pas la météo.","Dr Nuage : c'est un nuage","Un nuage creuse une dent, puis s'en va. Il ne retire pas un sixième pile.","Marius : une brebis a débranché un câble","Elles n'ont aucune opinion, et aucun tournevis."),
  Q("Ton école a 36 kWc en toiture. En juillet, elle consomme peu et injecte 70 % de sa production sur le réseau. Son taux d'autoconsommation est de…","30 %","L'autoconsommation, c'est la part de la production consommée sur place : 100 − 70.","70 %","Ça, c'est la part injectée, le surplus.","On ne peut pas savoir sans la facture","La courbe de charge suffit : production moins injection."),
  Q("Fin 2025, la France a plus de puissance solaire installée que de puissance hydraulique. Qui a produit le plus d'électricité en 2025 ?","Les barrages, presque deux fois plus","62,4 TWh contre 32,9 : l'eau tourne bien plus d'heures par an que le soleil ne brille.","Le solaire, forcément","Plus de GW ne veut pas dire plus de TWh. Tout dépend du nombre d'heures.","Égalité","À puissance voisine, le facteur de charge fait toute la différence."),
  Q("Pour un bâtiment équipé de panneaux, quel est le levier le moins cher pour mieux utiliser sa production ?","Déplacer vers midi les usages qui peuvent attendre","Chauffe-eau, recharge, lavage : zéro investissement, juste une programmation.","Ajouter une batterie","Efficace, mais c'est le levier le plus cher. On commence par déplacer.","Doubler la surface de panneaux","On couvre un peu plus, et on déborde beaucoup plus à midi.")
];
