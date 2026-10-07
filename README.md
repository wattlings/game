# L'Energy Management par la donnée · Wattlings

Un cours en 8 étapes (Cadrer → Mesurer) et son jeu, Wattlings, pour former à l'energy management.

Le site tient en **deux pages** qui partagent un socle commun :

| Page | Adresse | Dossier |
|---|---|---|
| Le cours | `index.html` | `cours/` |
| Le jeu | `jeu/index.html` | `jeu/` |
| Ce qu'ils partagent | | `commun/` |
| Le pilotage du jeu (page de travail, liée nulle part) | `pilotage/index.html` | `pilotage/` |
| Les statistiques d'audience du cours et du jeu (page de travail, liée nulle part, protégée par mot de passe) | `stats.html` | un seul fichier, à la racine |

Il n'y a **aucune compilation** : les fichiers du dépôt sont ceux que le navigateur charge. Modifier un fichier et l'enregistrer dans le dépôt, c'est publier.

## Publier sur GitHub Pages

1. Créer un dépôt sur GitHub et y déposer tout le contenu de ce dossier.
2. Dans le dépôt : **Settings → Pages → Build and deployment → Deploy from a branch**, branche `main`, dossier `/ (root)`.
3. Une à deux minutes plus tard, le site est à l'adresse `https://<compte>.github.io/<dépôt>/`.

Chaque modification enregistrée sur la branche `main` est en ligne après une à deux minutes.

## Pour changer…

### L'apparence

| Je veux changer… | J'ouvre… |
|---|---|
| Les couleurs, polices et tailles du cours (clair et sombre) | `commun/styles/jetons.css` |
| Une police | `commun/styles/polices.css` et le dossier `polices/` à côté |
| La barre du haut, la navigation | `cours/styles/coquille.css` |
| La mise en page d'une étape, de l'accueil | `cours/styles/etape.css`, `accueil.css` |
| Boutons, champs, tableaux, graphiques des démos | `cours/styles/controles.css`, `demos.css`, `niveaux.css` |
| Le bandeau « Mode jeu » et le bouton « Jouer » | `cours/styles/bandeau-jeu.css` |
| Une icône du cours | `cours/blocs/icones.js` |
| Le schéma d'une étape | `cours/schemas/<étape>.js` |
| Les couleurs des menus et panneaux du jeu | `jeu/interface/styles/jetons.css` |
| Un écran du jeu (titre, menu, carte, combat…) | `jeu/interface/styles/<écran>.css` |
| Une palette du jeu (peaux, vêtements, herbe des saisons, pierre et fleurs des régions) | `jeu/rendu/palettes.js` |
| Un dessin du jeu (un bâtiment, un personnage, un décor) | le fichier concerné dans `jeu/rendu/` |

### Les sources

Chaque fait et chaque règle enseignés renvoient à une source qui a été ouverte et lue. Le référencement avance périmètre par périmètre : sont traités l'étape 2 du cours, l'étape 2 du jeu (fiches, arène, épreuve, habitants) et la centrale solaire.

| Je veux… | J'ouvre… |
|---|---|
| Ajouter ou corriger une référence (titre, éditeur, date, lien) | `commun/donnees/sources.js` : le registre, commun au cours et au jeu. Chaque source y figure une seule fois, sous une clé. |
| Citer une source dans un texte du cours | Écrire `[[cle]]` (ou `[[cle-1,cle-2]]`) juste après l'information : cela affiche un appel de note numéroté, et la liste se construit seule en bas de la page. |
| Donner ses sources à une démo du cours | `cours/contenu/sources.js` (`SOURCES_DEMOS`) |
| Donner ses sources à un terme du glossaire | `commun/donnees/glossaire.js` : `src: ["cle"]` sur le terme |
| Donner ses sources à une fiche savoir, une arène | `refs:['cle']` dans `jeu/recit/fiches-savoir.js`, `jeu/recit/arenes/arene-N.js` |
| Référencer ce que disent les habitants et l'épreuve d'une étape | `jeu/recit/references.js` |
| Donner ses sources à une information de voyage, à un site | `refs:['cle']` dans `jeu/voyages/<site>/textes.js` |
| Changer l'allure des notes, de la page Sources, de la poche Sources du carnet du jeu | `cours/blocs/notes.js`, `cours/pages/sources.js`, `cours/styles/niveaux.css` ; `jeu/interface/sources.js`, `jeu/interface/styles/tableau-de-bord.css` |
| Voir la preuve : pour chaque information, son type, son verdict et le passage lu dans la source | `outils/sources/releve-*.json` (les relevés), ou le tableau de relecture ci-dessous |

Quatre sortes d'information n'ont pas de source, et c'est voulu : ce qui est inventé pour l'exemple (l'école, la ville, les sites visités), la méthode du cours, les calculs, les vannes. Les relevés les classent « sans objet ».

`node outils/sources.mjs` contrôle l'ensemble en quelques secondes (clé citée absente du registre, relevé qui parle d'un texte disparu, fait sans source, source affichée nulle part). `node outils/sources.mjs relecture` fabrique `outils/sortie/sources-relecture.html`, le tableau de toutes les informations relevées, à filtrer par verdict. `node outils/sources.mjs liens` ouvre chaque lien du registre et signale ceux qui ne répondent plus : à lancer de temps en temps, et avant chaque rentrée pour les taux (accise, CTA, TURPE) qui changent tous les ans.

### Le contenu du cours

| Je veux changer… | J'ouvre… |
|---|---|
| Le texte d'une étape, ses exemples, son mini-quiz | `cours/contenu/etape-N.js` |
| Le nom d'une étape | `commun/donnees/etapes.js` (seul endroit : cours et jeu suivent) |
| Un terme du glossaire | `commun/donnees/glossaire.js` |
| Le quiz de synthèse | `cours/contenu/quiz-final.js` |
| Les sources citées | `cours/contenu/sources.js` |
| Les prix, taxes, facteurs CO₂ (à revoir chaque année) | `commun/donnees/references.js` |
| La fiche de l'école Jean-Jaurès | `commun/donnees/ecole.js` |
| Les 20 sites du patrimoine | `commun/donnees/patrimoine.js` |
| Une démo | `cours/demos/<démo>.js` |
| Les consommations simulées de l'école | `cours/modele/simulation.js` (et `factures.js`, `releves.js`, `calendrier.js`) |

### Le jeu

| Je veux changer… | J'ouvre… |
|---|---|
| Les questions, dresseurs et répliques d'une arène | `jeu/recit/arenes/arene-N.js` |
| Les fiches savoir à collecter | `jeu/recit/fiches-savoir.js` |
| Où se trouvent les informations en ville | `jeu/recit/lieux-savoir.js` |
| Les conseils de Mme Joule, le choix du site (comme le choix du starter dans Pokémon Rouge Feu : trois maquettes sur la table du bureau ; A en montre une en grand, puis « Tu choisis… ? » Oui / Non) | `jeu/recit/histoire.js` (`MAQUETTES`, `chooseSite`, `choisirSite`), la table dans `jeu/monde/objets.js` |
| Le guidage : les tâches de chaque étape, dans l'ordre (texte court, cible de la flèche), la prochaine action affichée en permanence en haut de l'écran avec sa progression, la liste cochée du menu → Objectif | `jeu/recit/objectifs.js` (`objectiveText0` : les tâches, `prochaineAction`, `objectiveText`), `jeu/moteur/cibles.js` (la flèche), `jeu/moteur/boucle.js` (`flecheObjectif` : au bord de l'écran quand la cible est hors champ) |
| Les aides montrées en jouant (se déplacer, parler, la carte, la flèche, le menu : chacune une fois, au moment où elle sert) et les textes adaptés au tactile (« touche K » devient « bouton CARTE ») | `jeu/interface/aides.js` |
| La présentation du début de partie (les commandes, puis le jeu et son objectif). Elle s'ouvre à chaque nouvelle partie, avant l'avatar ; « Passer la présentation » ou Échap la saute ; menu → Options → « Revoir la présentation » | `jeu/interface/presentation.js` (textes et tableau des commandes, repris par le menu → Commandes), `jeu/interface/styles/presentation.css` |
| Les habitants et leurs répliques | `jeu/recit/habitants.js`, `habitants-regions.js`, `meteo.js` |
| Les secrets et clins d'œil | `jeu/recit/secrets.js`, `clins-d-oeil.js` |
| Le nom et le résumé d'un chapitre | `commun/donnees/etapes.js` (`CHAPITRES_JEU`) |
| L'épreuve d'une étape (mini-jeu du champion) | `jeu/epreuves/<étape>.js` |
| Le plan de la ville, les quartiers | `jeu/monde/plan-ville.js`, `cartes.js` |
| Les trois sites jouables | `jeu/monde/sites.js` |
| Les économies d'énergie, les actions, les événements | `jeu/simulation/` |
| Une musique | `jeu/audio/partitions.js` |
| Le menu, la carte, le tableau de bord, l'avatar | `jeu/interface/<écran>.js` |
| Le menu (à la manière de Pokémon Rouge Feu : une liste en haut à droite, un curseur ▶, un bandeau d'aide en bas ; A ouvre, B revient, M referme) : ses entrées, leur texte d'aide, leurs écrans | `jeu/interface/menu.js` (`MENU_ENTREES` pour la liste, `MENU_ECRANS` pour les écrans, `MENU_ALIAS` pour les anciens noms d'onglets), `jeu/interface/styles/menu.css` |
| La patine de la ville par défaut (1 · Neuf ; le joueur la change dans menu → Options) | `jeu/monde/ciel.js` (`PREF`) |

### Les voyages en train (après la fin du jeu)

| Je veux changer… | J'ouvre… |
|---|---|
| Ce que disent les gens et les panneaux d'un site, ses informations à collecter, ses sources | `jeu/voyages/<site>/textes.js` |
| Le plan d'un site, la place de chaque personnage et de chaque objet, le nom de ses zones sur la carte | `jeu/voyages/<site>/carte.js` |
| Où se trouve un site sur la carte du pays, par où passe sa ligne de train | `jeu/voyages/<site>/textes.js` (`pays`, `rail`, `cote`) |
| La carte du pays (contours, fleuves, massifs, textes des régions) et ce que montrent les plans des sites | `jeu/voyages/atlas.js` |
| Les simulations et le défi final d'un site (missions, seuils, messages) | `jeu/voyages/<site>/simulations.js` |
| Un dessin d'un site (panneaux, onduleur, totem…) | `jeu/voyages/<site>/dessins.js` |
| Annoncer une future destination (« prochainement ») | `jeu/voyages/prochainement.js` |
| Le hall de la gare, le guichet, le tableau des départs, le trajet | `jeu/voyages/gare.js` |
| Le passeport et ses tampons | `jeu/voyages/passeport.js` |
| L'allure des sols (chemin, gravier, quai, mer, murs…) et des graphiques, pour tous les sites | `jeu/voyages/peinture.js`, `graphes.js` |
| Les objets communs à plusieurs sites (transformateur, pupitre, panneaux) | `jeu/voyages/dessins.js` |
| Le fonctionnement des ateliers à curseurs et du défi final, pour tous les sites | `jeu/voyages/ateliers.js` |
| Les couleurs et la mise en page des écrans de voyage | `jeu/interface/styles/voyages.css` |

### Le pilotage du jeu

`pilotage/` est une page de travail : tout le parcours du jeu sur une seule page, pour le lire, le tester, le corriger et voir ce qu'en font les joueurs. Son adresse est celle du site suivie de `pilotage/`. Aucune autre page n'y mène et elle demande aux moteurs de recherche de l'ignorer, mais **ce n'est pas un secret** : quiconque connaît l'adresse peut la lire, et elle montre toutes les réponses.

| Je veux… | Je fais… |
|---|---|
| Voir le parcours | Onglet « Le parcours » : une ligne par chapitre (puis par site de voyage, par quartier, par secret), une pastille par moment du jeu. Un clic sur une pastille montre tout ce qui s'y passe : répliques, questions avec bonnes et mauvaises réponses, retours, conditions. Le champ de recherche fouille tous les textes du jeu. |
| Tester un endroit précis | Bouton « Tester » d'une ligne ou « Tester ici » d'une pastille : le jeu s'ouvre à cet endroit dans un nouvel onglet, en **mode essai**. Rien n'est enregistré : ni sauvegarde, ni suivi. Recharger l'onglet rend le jeu normal. |
| Corriger un texte | Allumer « Modifier les textes », cliquer un texte, le réécrire. Puis onglet « Mes modifications » : télécharger l'archive, la décompresser, et glisser son dossier `jeu` dans GitHub (*Add file › Upload files*). Chaque fichier rendu est le fichier en ligne où seuls ces textes ont changé. |
| Savoir combien de temps dure le jeu | En haut de l'onglet « Le parcours » : le temps de jeu estimé jusqu'à l'épilogue (finale comprise), et celui des voyages, en plus. Chaque chapitre et chaque site de voyage porte aussi son estimation (⏱). C'est une fourchette calculée à partir des textes du jeu : à comparer avec le temps réellement mesuré, dans « Les joueurs ». |
| Voir ce que font les joueurs | Onglet « Les joueurs » : se connecter avec un compte créé dans Supabase (c'est celui de `stats.html` ; la marche à suivre pour en créer un est dans l'onglet). Les chiffres se posent ensuite sur les frises. Le bouton « Voir avec des données d'exemple » montre la page avec des chiffres inventés, signalés comme tels. |

La page ne recopie rien : elle lit les fichiers du jeu tels qu'ils sont en ligne (ceux que liste `jeu/index.html`), sans les exécuter. Un texte ajouté au jeu y apparaît donc tout seul.

| Je veux changer… | J'ouvre… |
|---|---|
| Ranger une nouvelle scène du jeu dans son chapitre, renommer une pastille | `pilotage/parcours.js` (`SCENES` : le nom de la fonction du jeu, puis son titre ; `NOMS` pour le reste) |
| Faire reconnaître une nouvelle façon d'afficher du texte dans le jeu | `pilotage/lecture.js` (`APPELS`) |
| L'allure des pastilles, d'un bloc du détail | `pilotage/rendu.js`, `pilotage/styles.css` |
| Les chiffres de l'onglet « Les joueurs » | `pilotage/suivi.js` (lecture et comptage), `pilotage/vue-joueurs.js` (affichage) |
| Le calcul du temps de jeu estimé (vitesse de lecture, temps de réflexion par question, déplacements, marge) | `pilotage/duree.js` (les constantes en tête du fichier) |
| Les endroits où « Tester » sait ouvrir le jeu | `jeu/moteur/essai.js` |

Ce qui n'est rangé dans aucun chapitre reste visible dans « Mécanique et interface » : rien ne disparaît. Les mots qui servent aussi de repère au jeu (un nom de badge, d'étape, de jour) s'affichent en gris et ne se modifient pas depuis la page : les changer à un seul endroit casserait les parties en cours ; ils se changent dans les fichiers, partout à la fois. Les modifications en attente vivent dans le navigateur (clé `pilotage-modifs-v1`), pas sur le site.

### Les réglages

| Je veux… | J'ouvre… |
|---|---|
| Brancher la mesure d'audience (Supabase) | `commun/config.js` : l'adresse du projet et sa clé « publishable » (publique par nature, jamais une autre clé). `stats.html` porte les mêmes, en tête de fichier |
| Voir les clés de sauvegarde | `commun/stockage.js` (ne pas les renommer) |
| Changer ce qui suit le joueur d'un appareil à l'autre | `commun/stockage.js` (`CLES_SYNCHRONISEES`) |
| Changer la fenêtre « Mon compte » | `commun/fenetre-compte.js` (textes et styles), `commun/compte.js` (messages d'erreur, synchronisation) |

## Les règles qui tiennent l'ensemble

1. **Sens unique.** Le cours et le jeu ne se connaissent pas. Tous deux lisent `commun/`, et `commun/` ne lit ni l'un ni l'autre.
2. **Liaison par adresse.** Le cours ouvre `jeu/#chapitre-3` ou `jeu/#reprendre` ; le jeu renvoie vers `#etape-3`. Ils ne s'échangent rien d'autre que la sauvegarde du navigateur.
3. **Une seule source.** Un nom d'étape, un chiffre de l'école, un tarif n'est écrit qu'à un endroit.

## Comment c'est organisé

```
index.html                page du cours
jeu/index.html            page du jeu : liste, dans l'ordre, tous les fichiers du jeu
commun/
  donnees/                étapes et chapitres, école, patrimoine, références, glossaire
  graphiques/             graphiques en barres du patrimoine (cours et jeu)
  styles/                 jetons visuels du cours, polices
  stockage.js             clés de sauvegarde
  suivi.js, config.js     mesure d'audience
  compte.js               comptes joueurs : synchronisation avec Supabase
  fenetre-compte.js       la fenêtre « Mon compte », commune au cours et au jeu
  liens.js                adresses entre les deux pages
cours/
  principal.js            point d'entrée : barre du haut, navigation, routeur
  contenu/                une étape = un fichier
  pages/                  accueil, étape, école, patrimoine, glossaire, quiz final
  demos/                  une démo = un fichier
  blocs/                  affichage des blocs de contenu, graphique, quiz, icônes
  schemas/                un schéma = un fichier
  modele/                 l'école simulée : calendrier, consommations, relevés, factures
  coquille/               état et progression, thème, glossaire, liens vers le jeu, suivi
  styles/
jeu/
  socle.js                ce que le jeu reçoit de commun/
  recit/                  textes : arènes, fiches, histoire, habitants, objectifs, secrets
  monde/                  ville, cartes, sites, objets, décor posé
  rendu/                  dessins pixel, palettes
  epreuves/               les mini-jeux de chaque étape, les arènes
  simulation/             kWh économisés, actions, événements
  moteur/                 boucle, déplacements, dialogues, sauvegarde, entrées, mode essai
  interface/              menus, carte, tableau de bord, avatar, plein écran, vignette, styles
  voyages/                la gare, le passeport, puis un dossier par destination (solaire/…)
  audio/                  moteur sonore, partitions
pilotage/                 page de travail : le parcours du jeu, les essais, la modification des textes, le suivi des joueurs
  tiers/                  acorn (licence MIT), qui sert à lire les fichiers du jeu sans les exécuter
outils/                   facultatif : serveur local, vérification, fichier unique
```

### Deux façons d'écrire le code

- **Le cours et `commun/`** sont des modules : chaque fichier dit en tête ce qu'il utilise (`import`) et ce qu'il fournit (`export`).
- **Le jeu** est une suite de scripts qui partagent leurs noms, chargés dans l'ordre écrit dans `jeu/index.html`. Un fichier peut utiliser ce que définissent ceux qui le précèdent. `jeu/socle.js` leur fournit ce qui vient de `commun/`.

## Ajouter quelque chose

- **Un terme de glossaire** : une entrée dans `commun/donnees/glossaire.js`, puis `{{cle}}` dans un texte du cours.
- **Un bloc dans une étape** : dans `cours/contenu/etape-N.js`, ajouter un objet à `niveaux.comprendre` ou `niveaux.approfondir`. Types : `texte`, `liste`, `encadre`, `tableau`, `exemple`, `demo`, `schema`, `sources`.
- **Une démo** : créer `cours/demos/ma-demo.js` (une fonction `(zone, options)` qui remplit `zone`), l'inscrire dans `cours/demos/index.js`, puis l'appeler dans le contenu par `{ type: "demo", id: "maDemo", titre: "…" }`.
- **Une question d'arène** : dans `jeu/recit/arenes/arene-N.js`, une ligne `Q("question", "bonne réponse", "explication", "mauvaise 1", "pourquoi", "mauvaise 2", "pourquoi")`.
- **Un fichier au jeu** : le créer, puis ajouter sa ligne `<script defer src="…">` dans `jeu/index.html`, après les fichiers dont il a besoin. `moteur/demarrage.js` reste le dernier.

## Les voyages en train

À l'épilogue (les 8 badges gagnés, le patrimoine pris en main), la gare d'Ampère-sur-Loire ouvre. Le guichet remet un **passeport des énergies** ; le tableau des départs mène à des sites de production. Sur place : on se promène, on examine, on parle aux gens, on manipule deux simulations, puis le responsable du site fait passer un défi et tamponne le passeport.

Cinq lignes sont ouvertes, une par dossier :

| Destination | Dossier | On y manipule |
|---|---|---|
| Centrale solaire de Saint-Photon (Provence) | `jeu/voyages/solaire/` | l'inclinaison et l'orientation des panneaux, cinq courbes à diagnostiquer, les horaires d'une école |
| Parc éolien de Port-Rafale (Bretagne), sur la lande et en mer | `jeu/voyages/eolien/` | la courbe de puissance, un an de vent, le dosage éolien-solaire |
| Centrale nucléaire de Neutron-sur-Mer (Nord) | `jeu/voyages/nucleaire/` | un simulateur de conduite en temps réel, la chaîne du neutron à la prise, le planning des arrêts |
| Barrage de Val-Turbine (Alpes) | `jeu/voyages/barrage/` | débit et hauteur de chute, le choix d'une turbine, une journée de pompage-turbinage |
| Data center du quai des Octets (Marseille) | `jeu/voyages/datacenter/` | le PUE, la chasse aux serveurs inutiles, une coupure de courant |

Chaque site compte 14 informations à collecter, dont 6 « clés » exigées avant le défi. Les sites sont inventés ; leurs chiffres sont réels, et les sources de chaque site sont listées en bas de son fichier `textes.js` (le joueur les retrouve dans son passeport).

**La carte (touche K) a trois étages** une fois la gare rouverte. Depuis la carte de la ville, dézoomer encore (touche −, molette, pincement, ou bouton « Pays ») mène à la carte du pays : la ville, les destinations, les lignes de train, les tampons obtenus. Zoomer sur un lieu (touche + ou Espace, molette, ou le toucher deux fois) ouvre son plan : les zones du site, les informations déjà notées (coche verte) et celles qui restent (« ! » pour les infos clés, « ? » pour les autres), l'objectif. Sur un site, la carte s'ouvre directement sur son plan. Avant l'épilogue, la carte reste celle de la ville, comme avant. La mécanique commune (zoom, curseur, passage d'un étage à l'autre) est dans `jeu/interface/carte.js` ; ce que montrent le pays et les sites est dans `jeu/voyages/atlas.js`.

Ce que les voyages enregistrent vit dans la sauvegarde du jeu, sous `voy` (passeport, informations notées, tampons) : les clés de sauvegarde n'ont pas changé, et une ancienne partie s'ouvre comme avant.

### Ajouter une destination

Prendre un dossier existant comme modèle (`jeu/voyages/barrage/` est le plus simple) : quatre fichiers, chacun son rôle.

1. **`textes.js`** : `voyDeclarer('monsite', {…})` avec le nom, la gare, la région, les annonces du train, la liste des informations (`infos` : un titre, un texte, une phrase à retenir, `cle:1` pour celles qu'exige le défi, `ou` pour l'indice) et les sources des chiffres. Puis les répliques et les questions du défi.
2. **`dessins.js`** : les dessins propres au site (`VOY.dessins.nom = (c, o, X, Y, t) => …`).
3. **`simulations.js`** : ce qui se manipule. `voyAtelier(titre, {…})` fabrique un atelier à partir de ses réglages (curseurs, choix, cases), de son calcul, de son graphique et de ses missions ; `voyDefi('monsite', {…})` fabrique le défi final (questions, épreuve, tampon). Le mode d'emploi est en tête de `jeu/voyages/ateliers.js`.
4. **`carte.js`** : `voyCarte('monsite', {…})` avec le plan (une chaîne par rangée, un caractère par case), la légende (quel pinceau pour quel caractère), et `objets(o)` qui pose personnages et objets. `voySource(site, info, qui, répliques, ensuite)` fabrique un personnage ou un objet qui donne une information.
5. **Pour la carte** : dans `textes.js`, `pays:[longitude, latitude]` place le site sur la carte du pays, `rail:[[longitude, latitude], …]` donne les étapes de sa ligne depuis Ampère-sur-Loire, `cote` dit de quel côté écrire son nom. Dans `carte.js`, `zones` nomme les endroits du plan (un rectangle, un nom, une phrase, une étiquette facultative) et `ailleurs` dit quoi afficher partout ailleurs ; le responsable du site porte `chef:1`. Le mode d'emploi est en tête de `jeu/voyages/atlas.js`.

Ensuite : ajouter les quatre fichiers dans `jeu/index.html` (`textes.js` avec les autres `textes.js`, dans l'ordre du tableau des départs ; les trois autres après ceux des sites existants), donner une encre et un motif au tampon dans `passeport.js`, un pictogramme dans `voyages/dessins.js`, et lancer `node outils/verifier.mjs voyages` : la vérification prend le train, contrôle que tout ce qui s'examine est accessible à pied, examine tout, manipule les ateliers, fait tamponner le passeport, puis ouvre la carte et contrôle que chaque site y figure, que son plan nomme ses zones et situe chacune de ses informations.

Un site peut tenir sur plusieurs cartes (le parc éolien en a deux, reliées par un bateau) : déclarer `cartes:['a','b']` dans `textes.js`, et voir `eolEmbarquer` dans `jeu/voyages/eolien/carte.js`.

## Les outils (facultatifs)

Le site en ligne n'en a pas besoin. Ils demandent [Node.js](https://nodejs.org) :

```
cd outils
npm install
npx playwright install chromium     # une fois, pour la vérification
```

| Commande | Effet |
|---|---|
| `node outils/serveur.mjs` | Affiche le site sur `http://localhost:8080`. Un double-clic sur `index.html` ne suffit pas : hors d'un serveur, le navigateur refuse de charger les fichiers un par un. |
| `node outils/verifier.mjs` | Ouvre chaque page du cours, manipule chaque démo, joue chaque chapitre du jeu, prend le train vers chaque destination, fait l'aller-retour cours ↔ jeu, ouvre la page de pilotage (chaque pastille, une modification, des essais), et signale toute erreur. À lancer avant de publier une modification. |
| `node outils/sources.mjs` | Contrôle les sources (voir « Les sources »). Avec `relecture` : le tableau de relecture ; avec `liens` : le test des liens. |
| `node outils/fichier-unique.mjs` | Assemble tout le site dans un seul fichier, `outils/sortie/wattlings.html`, à envoyer par mail ou à ouvrir hors ligne. La page de pilotage n'en fait pas partie : elle a besoin des fichiers du jeu, un par un. |

Sans rien installer : dans le dépôt GitHub, onglet **Actions**, lancer « Fichier unique » ou « Vérifier le site » (bouton *Run workflow*). Le fichier unique se télécharge ensuite depuis la page du lancement, rubrique *Artifacts*.

## Sauvegardes

Tout est enregistré dans le navigateur du visiteur, sous des clés inchangées depuis la version d'origine : la progression du cours (`ems-pedagogie-v1`) et la partie du jeu (`wattlings-slot-1`, nom hérité des trois emplacements d'autrefois).

**Le jeu a une seule partie par joueur, celle de son compte** (voir « Comptes joueurs » ci-dessous). Sans compte, l'écran titre propose de se connecter, de créer un compte, ou de **« Continuer sans s'authentifier »** : la partie se joue alors normalement, mais rien n'est enregistré, et elle s'arrête quand on ferme la page. Une demande venue du cours (« jouer le chapitre 3 ») attend ce choix, puis est servie. Un joueur sans compte qui se connecte en cours de partie (menu → Sauvegarde) l'enregistre sur son compte, sauf si le compte a déjà une partie : c'est alors celle du compte qui reprend.

**En quittant une partie sans compte** (« ← Retour au cours », bouton « ← Cours »), un avertissement rappelle que rien n'est sauvegardé et propose trois choix : « Créer un profil et sauvegarder » (la partie est enregistrée sur le nouveau compte, puis on quitte), « Quitter sans enregistrer », ou « Continuer à jouer ». Fermer l'onglet ou recharger la page déclenche la demande de confirmation du navigateur (qui n'affiche que son propre message). Textes et comportement : `jeu/interface/liens-cours.js`.

Les parties d'avant les comptes (emplacements 2 et 3, première version du jeu) ne sont pas perdues : la première fois, la plus récente est reprise comme partie de ce navigateur, et rejoint le compte du joueur à sa connexion s'il n'en a pas encore. Les anciennes clés restent en place, sans être lues à nouveau.

Une sauvegarde est attachée à l'adresse du site. Si le site change d'adresse, les visiteurs repartent de zéro sur la nouvelle.

## Comptes joueurs

Un visiteur peut se créer un compte (un identifiant et un mot de passe, sans adresse e-mail) pour retrouver sa progression du cours et ses parties du jeu sur n'importe quel appareil ou navigateur. Le bouton « Se connecter » est en haut du cours et sur l'écran titre du jeu. Sans compte, le cours garde sa progression dans le navigateur ; le jeu se joue sans rien enregistrer.

**Comment ça marche.** Le cours et le jeu enregistrent toujours dans le navigateur. Quand quelqu'un est connecté, `commun/compte.js` recopie les clés de `CLES_SYNCHRONISEES` (cours, partie du jeu, réglages du jeu, avatar) vers le projet Supabase de `commun/config.js` : dès qu'il y a du nouveau (vérifié toutes les 20 secondes) et quand on quitte la page. Dans l'autre sens, il ramène ce qui a été fait ailleurs à l'ouverture de la page, quand on y revient et chaque minute, et recharge la page si ce qu'elle affiche a changé. Pour chaque clé, la version la plus récente l'emporte. Le mode essai du pilotage n'est jamais rechargé.

- **À la connexion**, ce que le navigateur contenait déjà rejoint le compte : une partie du jeu garde la version la plus récente des deux ; pour le cours et les réglages, le compte l'emporte s'il a déjà quelque chose.
- **À la déconnexion**, les derniers changements partent, puis tout ce qui suit le compte est retiré du navigateur, pour que la personne suivante sur cet appareil ne le retrouve pas. Sans connexion à Internet, la fenêtre prévient avant de rien perdre.
- **Sécurité.** Les mots de passe sont gardés chiffrés (bcrypt) ; après 5 erreurs de suite, le compte refuse toute connexion pendant 5 minutes. Le site n'accède jamais aux tables : seules quatre fonctions `wattlings_*` sont ouvertes à la clé publique. Ces comptes sont indépendants de « Authentication » de Supabase (celui de `stats.html` et du pilotage), dont les inscriptions restent fermées.

**Installer (une fois).** Dans Supabase : **SQL Editor → New query**, coller tout `outils/supabase/comptes-joueurs.sql`, puis **Run**. Le script peut être relancé sans risque. Tant qu'il n'est pas installé, la fenêtre répond « Les comptes ne sont pas encore installés sur ce site ».

**Mot de passe oublié.** Il n'y a pas d'adresse e-mail, donc pas d'envoi possible : dans **SQL Editor**, remplacer l'identifiant et le nouveau mot de passe, puis lancer :

```sql
update public.joueurs set mot_de_passe = extensions.crypt('nouveau-mot-de-passe', extensions.gen_salt('bf', 10)), echecs = 0, bloque_jusqua = null
 where identifiant = 'identifiant';
```

Les comptes sont dans **Table Editor → joueurs** (la sauvegarde de chacun est dans la colonne `donnees`). Supprimer une ligne supprime le compte et sa sauvegarde.

## Ce qui a changé par rapport au fichier unique d'origine (version 18)

Le contenu, les démos et le jeu sont identiques. Ce qui diffère tient au passage à deux pages :

- **« ← Retour au cours »** quitte la page du jeu : la partie est sauvegardée, et « Reprendre le jeu » la rouvre au même endroit.
- **« Comprendre cette étape »** et **« Revoir le cours ↗ »** ouvrent le cours dans un autre onglet : la partie reste ouverte, épreuve en cours comprise.
- **La vignette flottante** (Chrome, Edge) garde le jeu au-dessus des autres fenêtres tant que l'onglet du jeu reste ouvert ; le cours se lit dans un autre onglet.
- **Les anciennes adresses** `#jeu` et `#jeu-3` mènent toujours au jeu.
- La partie est maintenant écrite dès que la fenêtre passe à l'arrière-plan, et une seule fenêtre joue à la fois.

Dans le fichier unique produit par `outils/fichier-unique.mjs`, le jeu s'ouvre par-dessus le cours comme dans la version d'origine, sans vignette flottante.

`outils/migration/` contient la version 18 et l'outil qui a comparé les deux versions. Il peut être supprimé une fois la migration acceptée.

Depuis, le jeu a gagné les voyages en train (voir plus haut), puis le référencement des sources a commencé : textes corrigés à l'étape 2, page Sources dans le cours, onglet Sources dans le menu du jeu (aujourd'hui : menu → Carnet, poche Sources). Le contenu n'est donc plus identique à la version 18, et `outils/migration/comparer.mjs` signale ces écarts : ce n'est plus une alerte. La vérification du site, c'est `outils/verifier.mjs`.

## Limites connues

- **Dessins du jeu.** Ils restent du code. `jeu/rendu/palettes.js` réunit les tables de couleurs qui existaient ; la plupart des couleurs sont encore écrites dans les dessins eux-mêmes.
- **Code du cours.** Il a été reconstruit à partir d'une version compilée : les fonctions et les données ont des noms lisibles, mais les variables internes des fonctions sont restées des lettres (`e`, `n`, `t`).
- **Fiches savoir.** Elles reprennent l'Essentiel du cours, parfois mot pour mot, parfois reformulé : les deux textes vivent encore séparément (`jeu/recit/fiches-savoir.js` et `cours/contenu/`).
- **Chiffres dans les textes.** Les prix et taxes utilisés par les calculs sont dans `commun/donnees/references.js` ; ceux cités dans les phrases du cours sont à corriger dans les textes.
