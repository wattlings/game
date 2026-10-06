# L'Energy Management par la donnée · Wattlings

Un cours en 8 étapes (Cadrer → Mesurer) et son jeu, Wattlings, pour former à l'energy management.

Le site tient en **deux pages** qui partagent un socle commun :

| Page | Adresse | Dossier |
|---|---|---|
| Le cours | `index.html` | `cours/` |
| Le jeu | `jeu/index.html` | `jeu/` |
| Ce qu'ils partagent | | `commun/` |

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
| Les conseils de Mme Joule, le choix du site | `jeu/recit/histoire.js` |
| Le texte de l'objectif de chaque chapitre | `jeu/recit/objectifs.js` |
| Les habitants et leurs répliques | `jeu/recit/habitants.js`, `habitants-regions.js`, `meteo.js` |
| Les secrets et clins d'œil | `jeu/recit/secrets.js`, `clins-d-oeil.js` |
| Le nom et le résumé d'un chapitre | `commun/donnees/etapes.js` (`CHAPITRES_JEU`) |
| L'épreuve d'une étape (mini-jeu du champion) | `jeu/epreuves/<étape>.js` |
| Le plan de la ville, les quartiers | `jeu/monde/plan-ville.js`, `cartes.js` |
| Les trois sites jouables | `jeu/monde/sites.js` |
| Les économies d'énergie, les actions, les événements | `jeu/simulation/` |
| Une musique | `jeu/audio/partitions.js` |
| Le menu, la carte, le tableau de bord, l'avatar | `jeu/interface/<écran>.js` |

### Les voyages en train (après la fin du jeu)

| Je veux changer… | J'ouvre… |
|---|---|
| Ce que disent les gens et les panneaux d'un site, ses informations à collecter, ses sources | `jeu/voyages/<site>/textes.js` |
| Le plan d'un site, la place de chaque personnage et de chaque objet | `jeu/voyages/<site>/carte.js` |
| Les simulations et le défi final d'un site (missions, seuils, messages) | `jeu/voyages/<site>/simulations.js` |
| Un dessin d'un site (panneaux, onduleur, totem…) | `jeu/voyages/<site>/dessins.js` |
| Les destinations annoncées « prochainement » | `jeu/voyages/prochainement.js` |
| Le hall de la gare, le guichet, le tableau des départs, le trajet | `jeu/voyages/gare.js` |
| Le passeport et ses tampons | `jeu/voyages/passeport.js` |
| L'allure des sols (chemin, gravier, quai, grillage…) et des graphiques, pour tous les sites | `jeu/voyages/peinture.js`, `graphes.js` |
| Les couleurs et la mise en page des écrans de voyage | `jeu/interface/styles/voyages.css` |

### Les réglages

| Je veux… | J'ouvre… |
|---|---|
| Brancher la mesure d'audience (Supabase) | `commun/config.js` |
| Voir les clés de sauvegarde | `commun/stockage.js` (ne pas les renommer) |

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
  moteur/                 boucle, déplacements, dialogues, sauvegarde, entrées
  interface/              menus, carte, tableau de bord, avatar, plein écran, vignette, styles
  voyages/                la gare, le passeport, puis un dossier par destination (solaire/…)
  audio/                  moteur sonore, partitions
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

Une destination est ouverte : la **centrale solaire de Saint-Photon** (`jeu/voyages/solaire/`). Quatre autres sont annoncées dans `jeu/voyages/prochainement.js` : parc éolien, centrale nucléaire, barrage, data center.

Ce que les voyages enregistrent vit dans la sauvegarde du jeu, sous `voy` (passeport, informations notées, tampons) : les clés de sauvegarde n'ont pas changé, et une ancienne partie s'ouvre comme avant.

### Ajouter une destination

Prendre `jeu/voyages/solaire/` comme modèle : quatre fichiers, chacun son rôle.

1. **`textes.js`** : `voyDeclarer('monsite', {…})` avec le nom, la gare, la région, les annonces du train, la liste des informations (`infos` : un titre, un texte, une phrase à retenir, `cle:1` pour celles qu'exige le défi, `ou` pour l'indice) et les sources des chiffres. Puis les répliques et les questions du défi.
2. **`dessins.js`** : les dessins propres au site (`VOY.dessins.nom = (c, o, X, Y, t) => …`).
3. **`simulations.js`** : ce qui se manipule, et le défi, qui se termine par `voyTamponner('monsite')`.
4. **`carte.js`** : `voyCarte('monsite', {…})` avec le plan (une chaîne par rangée, un caractère par case), la légende (quel pinceau pour quel caractère), et `objets(o)` qui pose personnages et objets. `voySource(site, info, qui, répliques, ensuite)` fabrique un personnage ou un objet qui donne une information.

Ensuite : retirer la destination de `prochainement.js`, ajouter les quatre fichiers dans `jeu/index.html` (dans l'ordre textes, dessins, simulations, carte, comme pour `solaire/`), donner une encre et un motif au tampon dans `passeport.js`, et lancer `node outils/verifier.mjs voyages` : la vérification prend le train, contrôle que tout ce qui s'examine est accessible à pied, examine tout et fait tamponner le passeport.

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
| `node outils/verifier.mjs` | Ouvre chaque page du cours, manipule chaque démo, joue chaque chapitre du jeu, prend le train vers chaque destination, fait l'aller-retour cours ↔ jeu, et signale toute erreur. À lancer avant de publier une modification. |
| `node outils/fichier-unique.mjs` | Assemble tout le site dans un seul fichier, `outils/sortie/wattlings.html`, à envoyer par mail ou à ouvrir hors ligne. |

Sans rien installer : dans le dépôt GitHub, onglet **Actions**, lancer « Fichier unique » ou « Vérifier le site » (bouton *Run workflow*). Le fichier unique se télécharge ensuite depuis la page du lancement, rubrique *Artifacts*.

## Sauvegardes

Tout est enregistré dans le navigateur du visiteur, sous des clés inchangées depuis la version d'origine : la progression du cours (`ems-pedagogie-v1`) et les trois emplacements du jeu (`wattlings-slot-1` à `3`).

Une sauvegarde est attachée à l'adresse du site. Si le site change d'adresse, les visiteurs repartent de zéro sur la nouvelle.

## Ce qui a changé par rapport au fichier unique d'origine (version 18)

Le contenu, les démos et le jeu sont identiques. Ce qui diffère tient au passage à deux pages :

- **« ← Retour au cours »** quitte la page du jeu : la partie est sauvegardée, et « Reprendre le jeu » la rouvre au même endroit.
- **« Comprendre cette étape »** et **« Revoir le cours ↗ »** ouvrent le cours dans un autre onglet : la partie reste ouverte, épreuve en cours comprise.
- **La vignette flottante** (Chrome, Edge) garde le jeu au-dessus des autres fenêtres tant que l'onglet du jeu reste ouvert ; le cours se lit dans un autre onglet.
- **Les anciennes adresses** `#jeu` et `#jeu-3` mènent toujours au jeu.
- La partie est maintenant écrite dès que la fenêtre passe à l'arrière-plan, et une seule fenêtre joue à la fois.

Dans le fichier unique produit par `outils/fichier-unique.mjs`, le jeu s'ouvre par-dessus le cours comme dans la version d'origine, sans vignette flottante.

`outils/migration/` contient la version 18 et l'outil qui a comparé les deux versions. Il peut être supprimé une fois la migration acceptée.

Depuis, le jeu a gagné les voyages en train (voir plus haut) : c'est la seule différence de contenu avec la version 18, et elle n'apparaît qu'à l'épilogue.

## Limites connues

- **Dessins du jeu.** Ils restent du code. `jeu/rendu/palettes.js` réunit les tables de couleurs qui existaient ; la plupart des couleurs sont encore écrites dans les dessins eux-mêmes.
- **Code du cours.** Il a été reconstruit à partir d'une version compilée : les fonctions et les données ont des noms lisibles, mais les variables internes des fonctions sont restées des lettres (`e`, `n`, `t`).
- **Fiches savoir.** Elles reprennent l'Essentiel du cours, parfois mot pour mot, parfois reformulé : les deux textes vivent encore séparément (`jeu/recit/fiches-savoir.js` et `cours/contenu/`).
- **Chiffres dans les textes.** Les prix et taxes utilisés par les calculs sont dans `commun/donnees/references.js` ; ceux cités dans les phrases du cours sont à corriger dans les textes.
