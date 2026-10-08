# Audit pédagogique de Wattlings, et plan d'amélioration

*Rapport seul : aucun fichier du jeu n'a été modifié. Les chemins sont relatifs à la racine du dépôt.*

**Contexte rappelé**

| | |
|---|---|
| Objectif pédagogique | Comprendre ce qu'est une démarche d'energy management à travers la donnée, dans un EMS |
| Public | Tous les salariés d'un éditeur de logiciel d'EMS |
| Usage | En autonomie, avec seulement un accès au jeu en ligne |

**Méthode**
- J'ai lu le code, les données et les textes du jeu (`jeu/`), du cours (`cours/`), des données communes (`commun/`) et du pilotage (`pilotage/`).
- J'ai reconstitué le parcours avec l'outil de lecture du pilotage (`pilotage/parcours.js`).
- J'ai lancé le jeu dans un navigateur automatisé : partie complète sans compte, écrans titre, présentation, avatar, bureau, ville, arène, duel, épreuve, carte, voyage, menu, sur ordinateur et sur mobile. La suite de vérification `outils/verifier.mjs` (341 contrôles) passe.

Dans tout le rapport :
- **Constat** désigne ce que le code fait, avec la preuve (fichier, fonction, ligne ou texte cité) ;
- **Supposition** désigne une lecture de ma part ;
- **À tester** désigne ce qui ne peut être tranché qu'avec de vrais joueurs : plaisir ressenti, difficulté perçue, temps réel.

---

## 1. Le parcours du joueur, du premier écran à la fin

> À relire en premier : si je me trompe ici, les notes qui suivent sont fausses.

**Entrée**
- Le joueur arrive par le cours (`index.html`, « Commencer par l'étape 1 ») ou directement par `jeu/`. En fin de chaque étape du cours, un bandeau « Mettre en pratique » ouvre le jeu au bon chapitre.
- Écran titre (`jeu/interface/titre.js`) : sans compte, un grand bouton « Jouer » ; se connecter et créer un compte restent dessous.
- Ensuite viennent une présentation en 2 pages, passable (`jeu/interface/presentation.js` : 3 commandes, puis l'objectif en 3 puces), et le choix de l'avatar (`jeu/interface/avatar.js`).

**Chapitre 0 · Le bureau**
- Le joueur est « gestionnaire de site », guidé par Mme Joule, energy manager senior.
- Il choisit son site parmi trois maquettes, à la manière d'un starter Pokémon (`jeu/recit/histoire.js`) : école Jean-Jaurès (recommandée), bureaux Le Carré, boulangerie du Moulin. Ce choix fixe les données utilisées ensuite (`jeu/monde/sites.js` : surface, puissance souscrite, PDL, PCE, profils de consommation).

**Chapitres 1 à 9 · Une boucle de 8 quartiers, un par étape de la démarche**

Le schéma est le même à chaque étape (`jeu/recit/objectifs.js`, `objectiveText0`) :
1. **Trouver les « infos clés » en ville.** On parle à des habitants ou on examine des objets, ce qui donne des fiches savoir (`jeu/recit/fiches-savoir.js` : 47 fiches, dont 20 clés). Une flèche orange et la ligne d'objectif guident en permanence.
2. **Entrer dans l'arène.** La porte reste fermée tant qu'il manque une info clé (`jeu/epreuves/arenes.js`, `arenaMissing`, et `jeu/moteur/savoir.js`, `missingReq`).
3. **Battre 3 dresseurs.** Chacun pose une question à 3 choix, et une seule bonne réponse suffit.
4. **Passer l'épreuve du champion** : une suite d'exercices (choix, cases à cocher, formulaires, remises en ordre, curseur, plan d'action sous budget).
5. **Recevoir le badge** et un « bilan de l'étape », puis la barrière du quartier suivant s'ouvre.

Quelques étapes ont une activité de terrain en plus :

| Chapitre | Activité de terrain |
|---|---|
| 1-2 | Lire l'adresse et la fiche technique, trouver les compteurs (PDL / PCE), puis l'arène du Cadastre |
| 4 | Combats contre des anomalies de données (Anomalidex) |
| 5 | Ouvrir l'armoire à archives |
| 7 | Ronde de nuit : trouver 4 dérives dans le bâtiment |
| 8 | L'épreuve contient le plan d'action sous budget |
| 9 | Mesurer (DJU, PDCA) ; la championne est Mme Joule |

En chemin :
- Un tableau de bord d'énergie (`jeu/interface/tableau-de-bord.js`, `jeu/simulation/`) compte les kWh économisés.
- À partir de l'étape Agir, des alertes arrivent, avec 3 réponses possibles.
- Le joueur gagne XP, rangs (gestionnaire de site → energy manager → gestionnaire de patrimoine) et secrets.

**Chapitre 10 · Gestionnaire de patrimoine**
- Le maire confie 20 sites. Six missions se font au « PC patrimoine » à côté de graphiques vivants (`jeu/epreuves/patrimoine.js`) : périmètre, Pareto, coût et CO₂, par activité, bâtiments similaires, priorités.
- Viennent ensuite une finale de 4 questions (`jeu/epreuves/finale.js`) et l'écran de fin, un « Diplôme de l'Energy Management par la donnée » (`jeu/interface/evolution-fin.js`, `endScreen`).

**Chapitre 11 · Épilogue**
- Objectif libre : faire baisser de 40 % la consommation du parc, en choisissant les sites à suivre et les actions, sous contrainte de fonds (`jeu/simulation/partie.js`, `enPct`).
- La gare ouvre 5 voyages facultatifs : solaire, éolien, nucléaire, barrage, data center (`jeu/voyages/`). Chacun propose des fiches, des manipulations et un défi pour gagner un tampon.

**Ce qui fait réussir ou échouer**
- **Duels.** Chaque erreur coûte un tiers de la « crédibilité ». À zéro, retour à l'entrée de l'arène ; les dresseurs déjà battus le restent.
- **Épreuves.** Aucun échec définitif : on réessaie la même étape sans limite.
- **Anomalies.** Une défaite renvoie au bureau.

**Ce qui fait évoluer la difficulté**
- Le contenu passe de définitions (étape 1) à des calculs (index, kWh, DJU, temps de retour).
- **Constat** : je n'ai trouvé aucun mécanisme d'adaptation au niveau du joueur.

**Durée**
- Le pilotage estime le parcours à environ 1 h 40 à 2 h 40 jusqu'à l'épilogue (`pilotage/duree.js`).
- **À tester** : le temps réel, visible dans `pilotage/` → « Les joueurs ».

---

## 2. Les huit notes en un coup d'œil

| # | Principe | Note | En une phrase |
|---|---|:-:|---|
| 1 | Objectif pédagogique précis | **3** | Le parcours principal suit fidèlement les 8 étapes de la démarche ; le lien avec *un EMS* reste mince, et un gros tiers du code (voyages) parle d'autre chose. |
| 2 | Apprentissage dans la mécanique | **2** | Pour l'essentiel, on se déplace pour collecter des fiches puis on répond à des quiz. Quelques moments font vraiment manipuler la donnée (curseur du talon, plan d'action, parc à −40 %). |
| 3 | Difficulté bien dosée | **2** · *à tester* | Même structure d'arène en arène, pas d'adaptation au joueur ; un duel se gagne en une bonne réponse. |
| 4 | Retour immédiat et clair | **3** | Chaque mauvaise réponse a son explication ; les remises en ordre se contentent de « Ce n'est pas le bon ordre ». |
| 5 | Droit à l'erreur | **3** | Réessayer coûte peu, mais l'élimination des mauvaises réponses permet de réussir au hasard. |
| 6 | Motivation intrinsèque | **2** · *à tester* | Beaucoup de récompenses externes (XP, badges, rangs, compteurs de collection) ; l'histoire et l'humour existent, mais les choix et la maîtrise viennent tard. |
| 7 | Autonomie | **2** | Un chemin unique jusqu'à l'épilogue ; les vraies décisions arrivent au chapitre 8, et surtout dans le parc facultatif. |
| 8 | Transfert vers le réel | **2** | Notions réelles bien présentes (PDL, PCE, mandat, DJU, décret tertiaire), mais presque jamais reliées au métier ni au logiciel des joueurs ; pas de support de débriefing. |

---

## 3. Analyse détaillée par principe

### Principe 1 · Objectif pédagogique précis : 3 / 4

**Preuves (constats)**
- Le parcours principal est calqué sur les 8 étapes du cycle (Cadrer → Mesurer). Chaque chapitre correspond à une page du cours (`commun/donnees/etapes.js`, `CHAPITRES_JEU`).
- Les fiches savoir reprennent l'Essentiel du cours, parfois mot pour mot (`jeu/recit/fiches-savoir.js` ; voir aussi `README.md`).
- Les questions d'arène suivent le thème de l'étape (`jeu/recit/arenes/arene-1.js` à `arene-8.js` : 68 questions de dresseurs). Les épreuves traitent les notions métier :
  - fiche patrimoine ;
  - mandat et consentement d'accès aux données (`jeu/epreuves/collecter.js` : « Le logiciel appelle l'API pour un PDL sans consentement valide… ») ;
  - conversions d'unités, talon, dérives, plan d'action, mesure et vérification avec les DJU.
- Le chapitre 10 (Pareto, indicateurs, bâtiments similaires) ouvre au pilotage d'un parc, ce qui est dans l'objectif.

**Ce qui doit être préservé**
- La correspondance une étape = un quartier = une arène.
- Le site choisi qui sert de fil rouge chiffré.
- Le chapitre patrimoine.

**Manques**
- **Le « dans un EMS » est faible.** « Logiciel » n'apparaît que 6 fois dans les textes du jeu (`cadrer.js:57`, `collecter.js:36,41`…) et « EMS » une seule fois. L'objectif déclaré est de comprendre la démarche *à travers la donnée, dans un EMS*. Or le joueur ne voit jamais ce qu'un EMS affiche ou fait à chaque étape : connecteurs, contrôles de qualité, modèle de données, courbes, alertes, plan d'action, suivi M&V.
  - Exemple : à l'étape Fiabiliser, on combat des anomalies, mais on ne voit jamais l'écran où un EMS les signale.
- **Les voyages pèsent environ 400 ko, soit à peu près 36 % du code du jeu.** Quatre sites sur cinq portent sur la *production* d'énergie (effet photovoltaïque, limite de Betz, fission, turbines) ; seuls le data center (PUE, chaleur fatale) et une partie du solaire (autoconsommation, courbe de charge de l'école) touchent l'energy management. Ils sont facultatifs et viennent après l'épilogue.
  - **Supposition** : utiles pour la culture énergie, mais hors objectif.
- **Contenu d'ambiance**, environ 2 % du code (`jeu/recit/secrets.js`, `clins-d-oeil.js`) : 18 secrets, 16 clins d'œil à des jeux vidéo, mode Hadès. Plusieurs secrets portent un message métier (le chat de la chaufferie : la chaudière qui tourne l'été). Ce n'est pas un problème en soi, s'il reste en marge.

### Principe 2 · Apprentissage dans la mécanique : 2 / 4

**Le test demandé : si on retirait le contenu éducatif, le jeu resterait-il identique ?**

Constat : **en grande partie, oui.**
- Le cœur du jeu (marcher jusqu'à un habitant, appuyer sur A, ouvrir une porte une fois les fiches réunies, répondre à des QCM) fonctionnerait à l'identique avec des fiches et des questions sur n'importe quel sujet.
- Les fiches comptent comme lues dès qu'elles s'affichent (`jeu/moteur/savoir.js:27-29`, `showFiche` : `S.fiches[f.id]=1`) : la porte s'ouvre sans que rien ne vérifie la lecture.
- Le formulaire de la fiche patrimoine ne lit pas ce que le joueur a noté en ville (`S.notes`) : il propose des valeurs à reconnaître (`jeu/epreuves/cadrer.js`, `gamePatrimoine`).

**Les exceptions, qui montrent la voie (constats)**

| Moment | Ce que le joueur manipule |
|---|---|
| Talon, étape Analyser | On place une ligne sur la courbe d'une semaine du site (`jeu/epreuves/analyser.js`, `talonStep`), avec « Trop haut : regarde les nuits… ». Lire une courbe, *c'est* l'action. |
| Plan d'action, étape Agir | On coche des actions sous le budget du fonds de travaux, avec un objectif de kWh (`jeu/epreuves/agir.js`, `planStep`). Deux pièges réalistes : `ps` (« la facture baisse, pas la consommation ») et `pv` (« produire n'est pas économiser »), dans `jeu/simulation/modele-energie.js`. |
| Anomalies, étape Fiabiliser | On choisit le traitement d'une donnée aberrante (`jeu/epreuves/fiabiliser.js`, `ANOM`) : rejeter, convertir, signaler. Proche du vrai geste, même si c'est un QCM habillé en combat. |
| Alertes du tableau de bord, dès l'étape Agir | On répond à des événements avec des conséquences en kWh et en euros (`jeu/simulation/evenements.js`). |
| Parc à −40 %, épilogue | La seule boucle de pilotage libre : quels sites suivre, quelles actions, sous contrainte de fonds (`jeu/simulation/partie.js`, `enPct`). |
| Manipulations des voyages | Curseurs, calcul et courbe en direct (`jeu/voyages/ateliers.js`). |

**Ce qui doit être préservé** : ces manipulations, et le fil rouge « un site, ses vraies données ».

**Manques, avec des exemples**
- **Collecter** (étape 2) : on ne choisit pas une source de données et on n'en voit pas les conséquences (pas de temps, retard, complétude). On répond à des questions sur les canaux.
- **Structurer** (étape 4) : on « ouvre l'armoire à archives » d'un seul appui (`jeu/epreuves/structurer.js:5-9`), puis on répond à des questions. On ne construit jamais la hiérarchie site → compteur → mesure.
- **Détecter** (étape 6) : la ronde de nuit consiste à cliquer 4 objets qui brillent (`jeu/epreuves/detecter.js`). La détection, c'est-à-dire comparer une courbe à sa référence, n'est pas faite par le joueur.

**Verdict franc** : c'est un problème de conception. Le jeu est un *parcours de quiz dans un monde de RPG*, enrichi de quelques vraies manipulations. Le plan de la partie 4 propose une option ambitieuse et une option minimale.

### Principe 3 · Difficulté bien dosée : 2 / 4 (à tester)

**Constats**
- **La structure est identique d'arène en arène** : infos clés, 3 dresseurs, champion. Le contenu passe de définitions (arène 1 : « Un périmètre, c'est… ») à des calculs (arène 2 : passage de l'index par zéro ; arène 5 : DJU ; arène 7 : temps de retour). Des calculs apparaissent cependant dès les arènes 2 à 4.
- **Un duel se gagne en une seule bonne réponse**, sur une question tirée au hasard parmi 2 ou 3 (`jeu/epreuves/arenes.js:65-87`). Avec 3 options, le hasard pur gagne un duel sur trois.
- **Aucune adaptation.** Pas d'indice après plusieurs erreurs, pas de question plus simple, pas de défi plus dur pour qui réussit tout. Les seules différences sont l'XP réduite après erreur (`gainXP(tries?5:20)`) et le sens du curseur du talon. Le mode Hadès ne change que les dialogues (`jeu/recit/clins-d-oeil.js`).
- **Paliers longs** : les chapitres 2 et 10 sont estimés à environ 13 à 21 minutes (`pilotage/duree.js`), contre 8 à 14 minutes pour les autres.
- **Saut probable au chapitre 10** : on passe d'un site à un parc de 20 sites, avec six missions d'analyse sur graphiques.

**À tester** : la difficulté perçue. Les données existent déjà :
- l'onglet « Les joueurs » du pilotage donne les 15 questions les plus ratées et la mauvaise réponse la plus choisie (`pilotage/vue-joueurs.js`) ;
- l'entonnoir montre où les joueurs abandonnent.

### Principe 4 · Retour immédiat et clair : 3 / 4

**Constats, ce qui fonctionne**
- **Duels** : chaque option porte sa propre explication. La bonne réponse affiche « Bonne réponse ! » suivi de l'explication ; une mauvaise affiche « Raté. » suivi de *pourquoi cette option est fausse* (`jeu/epreuves/arenes.js:80-84` ; les questions sont construites par `Q(q, ok, fb, faux1, pourquoi1, faux2, pourquoi2)`).
- **Questions à choix, cases et formulaires des épreuves** : « ✘ » suivi de la raison précise, puis « Réessaie » ; « N cases à revoir », « N champs à corriger » (`jeu/moteur/panneaux.js`, `choice`, `multi`, `form`). Exemple : « Relis la fiche technique : il manque un zéro. »
- **Curseur du talon** : « Trop haut : regarde les nuits… ». **Plan d'action** : « Le fonds ne suffit pas… », « il manque X… As-tu pris toutes les actions de sobriété ? ».
- **Après chaque badge** : un « Bilan de l'étape » (`jeu/simulation/partie.js`, `enBadge`, par exemple « Identifié n'est pas économisé : il faut agir »).

**Manques**
- **Remises en ordre** : seulement « ✘ Ce n'est pas le bon ordre. » et un bouton « Recommencer », sans dire quelle étape est mal placée ni pourquoi (`jeu/moteur/panneaux.js:47-57`, `order`). Cela touche notamment la hiérarchie Site → Point de comptage → Compteur → Mesure et le cycle PDCA.
- **Duels** : après une erreur, on passe à *une autre* question (« … enchaîne avec une autre question », `arenes.js:84`). La bonne réponse de la question ratée n'est jamais montrée, et on ne revient pas dessus.
- **Fiches** : rien ne vérifie la compréhension au moment où on les reçoit. 5 fiches sur 47 seulement ont une question.
- **Alertes** : une alerte ignorée affiche « … qui ne seront jamais économisés », mais on ne sait pas quelle réponse aurait été la bonne. **Supposition** : je n'ai lu que le texte, pas toutes les branches.

### Principe 5 · Droit à l'erreur : 3 / 4

**Constats, ce qui fonctionne**
- Dans les épreuves, l'échec ne coûte presque rien : on réessaie la même étape sans limite, avec seulement moins d'XP.
- Les dresseurs battus le restent. Une défaite en arène renvoie juste à l'entrée, avec un conseil : « Les dresseurs déjà battus te laisseront passer. Un doute ? Relis tes fiches dans Menu → Classeur. » (`arenes.js:60-63`).
- Rejouer une étape est possible à tout moment (menu → Étapes), et la collection est conservée.
- Le parc de l'épilogue permet de tester des stratégies : les mauvais choix (suivre d'abord les petits sites, installer du photovoltaïque) coûtent du temps, pas la partie.

**Manques**
- **On peut réussir au hasard.** Dans les épreuves, une mauvaise réponse est grisée et on réessaie parmi celles qui restent (`panneaux.js`, `choice`). Avec 3 options, on gagne au pire au 3e clic, sans avoir compris.
  - **Supposition** : un joueur pressé peut traverser une épreuve par élimination.
  - **À tester** : la fréquence de ces réussites au 2e ou 3e essai, visible dans le suivi.
- **Les duels punissent l'essai** au lieu de l'encourager. Une erreur coûte un tiers de la crédibilité, et la crédibilité est commune aux 3 dresseurs d'une même visite. Trois erreurs renvoient à l'entrée : on refait le trajet sans rien apprendre de plus.
- **On n'est jamais invité à faire une hypothèse puis à la vérifier**, sauf dans les ateliers des voyages (mode « libre ») et dans le parc.

### Principe 6 · Motivation intrinsèque : 2 / 4 (à tester)

**Constats**
- **Récompenses externes très présentes** : XP à presque chaque action (`gainXP`), 8 badges, 3 rangs avec « évolution » à la Pokémon, compteurs de collection (fiches 47, Anomalidex 7, secrets 34, tampons 5), mention Hadès, diplôme.
- **Ressorts intrinsèques réels, mais secondaires** :
  - une histoire et des personnages (Mme Joule, le maire, des dresseurs aux répliques drôles) ;
  - un site à soi choisi au départ ;
  - de la curiosité (secrets, voyages) ;
  - un compteur de kWh économisés qui traduit l'effet de ses actions (`jeu/simulation/partie.js`, `enTotal`).
- **La maîtrise et les choix arrivent tard.** Le compteur de kWh reste à 0 pendant les quatre premières étapes : « cadrer, collecter, fiabiliser et structurer n'économisent aucun kWh » (`tableau-de-bord.js:47`). C'est juste pédagogiquement, mais cela prive la moitié du jeu d'un retour sur ses effets.

**Ce qui doit être préservé** : le ton, Mme Joule, le site choisi, le compteur de kWh, le parc de l'épilogue.

**À tester** : est-ce que les salariés jouent pour comprendre ou pour cocher ? Ce n'est mesurable qu'avec de vrais joueurs (entretiens, ou taux d'abandon par chapitre dans le pilotage).

### Principe 7 · Autonomie : 2 / 4

**Constats**
- **Un chemin unique** jusqu'à l'épilogue. L'ordre est imposé par les barrières des quartiers, et une seule flèche indique toujours la prochaine action (`jeu/moteur/cibles.js`). Le joueur peut flâner (la ville est ouverte), mais pas décider.
- **Le choix du site** change les valeurs et quelques textes (compteur Linky ou professionnel, canal de données, talon, dérives, entreprise privée pour la boulangerie), mais pas la structure ni les décisions.
- **Les dialogues** n'ont aucun embranchement à conséquence.
- **Les vraies décisions**, toutes tardives :
  - le plan d'action de l'étape Agir (chapitre 8) ;
  - les réponses aux alertes (dès le chapitre 8, facultatives) ;
  - le plan d'action sur son propre site (dès le chapitre 9) ;
  - le parc à −40 % (chapitre 11, facultatif, après le diplôme).
- **Les décisions ne se suivent pas d'une étape à l'autre.** Le plan d'action choisi à l'étape Agir n'est pas celui que l'on « mesure » à l'étape Mesurer : les questions de la championne portent sur des chiffres génériques (`jeu/epreuves/piloter.js`).

### Principe 8 · Transfert vers le réel : 2 / 4

**Constats, ce qui existe**
- **Notions réelles et précises** : PDL/PRM, PCE, SGE et Data Connect, mandat et consentement, Gazpar, pas de 10 minutes et 144 points, DJU, référence, faux positifs, décret tertiaire, OPERAT, ISO 50001.
- **Sources** : un registre partagé d'environ 102 références (`commun/donnees/sources.js`), affiché dans le menu → Carnet → Sources. Il est complet surtout pour l'étape 2 et le site solaire (`README.md`).
- **Liens jeu ↔ cours** : « Cours de cette étape ↗ » dans chaque panneau (`jeu/moteur/panneaux.js`), et le bandeau « Mettre en pratique » en fin d'étape du cours.
- **Récapitulations** : le bilan d'étape après chaque badge ; le Classeur des fiches (menu) ; le diplôme final avec un tableau « Étape / Ce que tu sais faire » (`jeu/interface/evolution-fin.js`).
- **Côté cours** : un encadré « Pour tester le logiciel » à chaque étape (`cours/blocs/blocs.js`). Il vise les développeurs et testeurs, comme l'accueil (« Tu développes ou tu testes un logiciel d'energy management ? »).

**Manques**
- **Le jeu ne relie jamais au métier des joueurs.** Rien du type « dans ton travail », « dans notre logiciel », « à quoi ressemble cette étape pour un client ». Or le public est *tous les salariés d'un éditeur d'EMS* (commerciaux, support, consultants, développeurs, fonctions support) : le lien entre la démarche et le produit est exactement ce qu'ils doivent retenir.
- **Le diplôme n'est ni imprimable ni exportable.** Il n'existe aucune fiche de synthèse à garder, ni aucune trace à montrer à son manager.
- **Pas de support de débriefing** : pas de guide d'animation, de questions de discussion ni d'auto-évaluation avant/après. Le pilotage et `stats.html` donnent de bonnes données (questions les plus ratées, journal par joueur), mais pour l'éditeur du jeu, pas pour l'apprenant ou son manager.
- **Le bilan d'étape regarde surtout vers l'étape suivante** (« Mme Joule, au téléphone… ») plutôt qu'il ne récapitule celle qui s'achève.
- **Écart de nom** : l'étape 8 s'appelle « Piloter » sur le diplôme et dans le code du badge, « Mesurer » partout ailleurs (`jeu/recit/arenes/regles.js`, `BLAB`). C'est une petite incohérence pour qui fait le lien avec le cours.

---

## 4. Plan d'amélioration priorisé

Le plan est classé du meilleur rapport impact / effort au moins bon. L'effort est estimé pour une personne qui connaît déjà le code.

### Priorité 1 · Gains rapides : petit effort, fort impact

**1. Carte « Dans un EMS » après chaque badge** (principes 8 et 1)
- **Problème** : le lien avec le logiciel est absent.
- **Changement** : après le bilan d'étape, une carte courte à trois cases :
  - *ce que tu viens de faire* (dans le jeu) ;
  - *ce que fait un EMS à cette étape* (l'écran ou la fonction) ;
  - *qui s'en sert chez un client*.

  Elle se range dans le Classeur. Fichiers :
  - `jeu/epreuves/arenes.js` (`arenaWin`) ;
  - un nouveau fichier de données, `commun/donnees/ems.js`, partagé avec le cours ;
  - `jeu/interface/menu.js` (Classeur).
- **Effort** : petit pour le code ; le contenu dépend de vos réponses (question 1).
- **Impact** : fort sur le transfert, pour tous les profils de salariés.
- **Risques** : un dialogue de plus à chaque badge (environ 30 secondes). Le texte doit rester générique si le produit ne peut pas être nommé.

**2. Des retours qui expliquent partout** (principe 4)
- **Changement** :
  - **Remises en ordre** : après une erreur, marquer la première étape mal placée et dire pourquoi. Les données existent déjà dans les fiches ; il faut une explication par étape dans les définitions `order` de `cadrer.js`, `structurer.js`, `agir.js` et `piloter.js`. Le rendu se fait dans `jeu/moteur/panneaux.js`.
  - **Duels** : après « Raté », montrer la bonne réponse et son explication avant la question suivante. Remettre la question ratée en fin de file (`jeu/epreuves/arenes.js`, `duel`).
- **Effort** : petit.
- **Impact** : moyen à fort, car c'est au moment de l'erreur qu'on apprend le plus.
- **Risques** : aucun sur le reste du jeu ; le suivi `wrong_answer` reste identique.

**3. Plus de réussite par élimination** (principe 5)
- **Changement** : dans les épreuves, après une erreur, montrer l'explication, puis *remélanger* les options et compter la réussite seulement au premier essai d'une question tirée d'un petit lot. Variante plus douce : ne valider l'étape qu'après une bonne réponse sur une *deuxième* question, pour qui s'est trompé. Fichier : `jeu/moteur/panneaux.js` (`choice`), avec un lot de 2 questions par étape là où il n'y en a qu'une.
- **Effort** : petit pour le code, moyen pour le contenu (rédiger des questions jumelles).
- **Impact** : moyen.
- **Risques** : un peu plus long ; à calibrer avec l'estimation de temps du pilotage (tu voulais un jeu plus court).

**4. Le diplôme imprimable, avec une fiche de synthèse** (principe 8)
- **Changement** : depuis l'écran de fin, un bouton « Imprimer ou enregistrer en PDF » ouvre une page propre. Elle reprend :
  - les 8 étapes avec « ce que tu sais faire » ;
  - les notions clés ;
  - le lien vers le cours ;
  - trois questions à se poser dans son travail.

  Fichiers : `jeu/interface/evolution-fin.js`, une page `jeu/diplome.html` ou une impression CSS. Profiter du changement pour corriger l'écart « Piloter » / « Mesurer ».
- **Effort** : petit.
- **Impact** : moyen (trace, discussion possible avec le manager).
- **Risques** : aucun.

### Priorité 2 · Effort moyen, fort impact

**5. Faire servir ce qu'on a trouvé dehors** (principe 2, option minimale)
- **Problème** : les fiches et le carnet ne servent pas aux épreuves.
- **Changement** : les épreuves *demandent* les valeurs notées en ville au lieu de les proposer.
  - Exemple : la fiche patrimoine se remplit en *cherchant dans son carnet* (menu → Carnet → Mon site).
  - Exemple : le mandat de l'étape Collecter exige le PDL relevé sur le compteur. Un PDL mal recopié donne une erreur d'API, comme dans la vraie vie.

  Fichiers : `jeu/epreuves/cadrer.js`, `collecter.js`, `structurer.js`, avec `S.notes`.
- **Effort** : moyen.
- **Impact** : fort. Explorer et noter deviennent la compétence évaluée.
- **Risques** : les joueurs qui sautent une étape depuis le cours n'ont pas leurs notes. Le saut d'étape les remplit déjà (`jeu/interface/choix-etape.js`, `jumpTo`), mais il faut le vérifier pour chaque valeur.

**6. Une manipulation de données par étape** (principe 2, option minimale élargie)
- **Changement** : remplacer, dans chaque épreuve, au moins une question par un geste sur les données du site, en réutilisant les widgets existants (le curseur du talon, les graphiques de `jeu/simulation/` et `jeu/voyages/ateliers.js`).

| Étape | Geste sur les données |
|---|---|
| Collecter | Choisir un canal (index, courbe, facture) et voir ce qu'on obtient sur la même semaine |
| Fiabiliser | Repérer à la souris les points aberrants d'une série, puis choisir leur traitement |
| Structurer | Glisser compteurs et mesures dans l'arbre site → point de comptage → compteur |
| Détecter | Régler un seuil d'alerte sur une courbe et voir les vraies dérives et les fausses alertes |
| Mesurer | Corriger une consommation par les DJU avec un curseur et lire l'économie réelle |

- **Effort** : moyen (5 ateliers de taille comparable au talon).
- **Impact** : fort. C'est la réponse la plus directe au principe 2.
- **Risques** : temps de jeu en plus, que l'on peut compenser en retirant une question par épreuve ; et les manipulations au doigt sur mobile, à tester.

**7. Un coup de pouce après deux erreurs** (principes 3 et 5)
- **Changement** : après deux erreurs sur une même étape d'épreuve ou en duel, proposer « Revoir la fiche » dans le panneau, sans quitter l'épreuve, et faire des duels un apprentissage plutôt qu'une sanction : la crédibilité se recharge si l'on relit la fiche. Fichiers : `jeu/moteur/panneaux.js`, `jeu/epreuves/arenes.js`, `jeu/moteur/savoir.js`.
- **Effort** : petit à moyen.
- **Impact** : moyen, surtout pour les non-techniciens.
- **Risques** : un joueur pourrait lire avant chaque réponse. Ce n'est pas un problème pédagogique.

**8. Faire suivre les décisions d'une étape à l'autre** (principe 7)
- **Changement** :
  - l'étape Mesurer vérifie *le plan choisi à l'étape Agir* : économie attendue contre économie corrigée des DJU, sur le site du joueur ;
  - les alertes ignorées réapparaissent au bilan ;
  - le choix du site oriente un enjeu différent (l'école : les vacances scolaires ; les bureaux : la climatisation ; la boulangerie : le four et le contrat).

  Fichiers : `jeu/epreuves/agir.js`, `piloter.js`, `jeu/simulation/partie.js`, `monde/sites.js`.
- **Effort** : moyen.
- **Impact** : moyen à fort (autonomie, motivation, sens de la boucle).
- **Risques** : plus de cas à tester pour les trois sites.

### Priorité 3 · Grand effort, ou décisions de conception

**9. Option ambitieuse pour le principe 2 : « Mon EMS »**
- **Le jeu deviendrait la prise en main d'un EMS simplifié.** Le PC du bureau ouvre une console qui s'enrichit à chaque badge :
  - périmètre et patrimoine ;
  - connecteurs et mandats ;
  - contrôle de qualité ;
  - modèle de données ;
  - courbes et indicateurs ;
  - alertes ;
  - plan d'action ;
  - mesure et vérification.
- **Les arènes deviennent des cas clients à traiter dans cette console**, avec les données du site, et les dresseurs restent pour vérifier les notions.
- **Effort** : grand ; c'est une refonte des épreuves.
- **Impact** : maximal sur les principes 2, 7 et 8. Pour des salariés d'éditeur, c'est aussi la représentation la plus proche de leur produit.
- **Risques** :
  - il faut décider jusqu'où imiter le vrai logiciel (question 1) ;
  - le temps de jeu augmente ;
  - c'est beaucoup de travail de contenu.
- Les options 5 et 6 en sont un premier pas compatible.

**10. Repositionner les voyages** (principe 1)
- **Option minimale** : les présenter clairement comme une annexe facultative « Culture énergie » (gare, menu, diplôme), et ajouter à chaque site une manipulation tournée vers l'energy management :
  - solaire : autoconsommation sur la courbe de l'école ;
  - data center : PUE et chaleur fatale ;
  - éolien et nucléaire : la garantie d'origine et le contenu carbone dans le contrat.
- **Option forte** : réduire les voyages à 2 sites, ou les sortir du jeu.
- **Effort** : petit pour l'option minimale, grand pour l'option forte.
- **Impact** : clarté de l'objectif.
- **Risques** : perte de contenu déjà rédigé et sourcé, qui plaît peut-être (à vérifier dans le pilotage : combien de joueurs prennent le train ?).

**11. Récompenser par l'effet plutôt que par l'XP** (principe 6)
- **Changement** :
  - montrer dès les étapes Data à quoi sert ce qu'on fait. Exemple : après Fiabiliser, la courbe du site devient lisible, alors qu'elle était bruitée avant ;
  - faire de la courbe du site, qui s'améliore, le vrai trophée ;
  - garder les badges ; réduire l'XP visible et les compteurs de collection à un rôle secondaire.

  Fichiers : `jeu/interface/tableau-de-bord.js`, `jeu/interface/hud.js`, `jeu/moteur/*` (`gainXP`).
- **Effort** : moyen.
- **Impact** : à tester.
- **Risques** : certains joueurs aiment les compteurs ; à confirmer avec des retours de joueurs.

**12. Une difficulté qui s'adapte et un défi pour les experts** (principe 3)
- **Changement** :
  - un duel se gagne en 2 bonnes réponses sur 3, avec une question « cas réel » chiffrée au dernier dresseur ;
  - un mode « Expert » facultatif (questions plus dures, pas d'élimination), pour les développeurs et consultants ;
  - régler la difficulté à partir des questions les plus ratées du pilotage.
- **Effort** : moyen (contenu).
- **Impact** : à tester.
- **Risques** : un temps de jeu plus long ; à mettre en regard de l'objectif d'une heure évoqué plus tôt.

**13. Kit de débriefing** (principe 8)
- **Changement** : une page « Pour les managers » (cours ou pilotage) avec :
  - les objectifs ;
  - le temps de jeu ;
  - 8 questions de discussion ;
  - les erreurs les plus fréquentes, avec les explications ;
  - un auto-positionnement avant et après (5 questions, dans le cours).
- **Effort** : petit à moyen (surtout du contenu).
- **Impact** : fort si un manager ou un formateur s'en sert ; nul sinon.
- **Risques** : aucun.

**Ordre de réalisation que je propose**
1. **Premier lot (1 à 4 + 13)** : quelques jours de travail, essentiellement du contenu une fois tes réponses connues.
2. **Deuxième lot (5 à 8)**, lancé après avoir regardé les données réelles du pilotage (questions ratées, abandons, temps).
3. **Décider de l'option 9** à l'issue du deuxième lot.

---

## 5. Questions ouvertes

1. **Le produit.** Le jeu peut-il nommer votre EMS, ses écrans et ses fonctions (connecteurs, alertes, plan d'action, M&V) ? Ou doit-il rester générique (« un EMS ») ? Avez-vous une liste des fonctions par étape que je peux reprendre ?
2. **Les profils.** Quels métiers jouent vraiment (commerciaux, support, consultants, développeurs, RH, finance) et dans quelles proportions ? Le niveau visé est-il « savoir en parler à un client » ou « savoir ce que fait chaque écran » ?
3. **La durée.** L'objectif d'une heure évoqué plus tôt tient-il toujours ? Il conditionne les points 3, 6, 9 et 12, qui allongent le jeu.
4. **Le débriefing.** Même si l'usage est en autonomie, un manager ou un référent peut-il animer un échange après le jeu ? Si non, le point 13 doit se transformer en auto-bilan intégré au jeu.
5. **Les voyages.** Les garder comme annexe, les réorienter vers l'energy management, ou les réduire ? (point 10)
6. **La preuve d'apprentissage.** Voulez-vous mesurer l'effet du jeu, par exemple avec un même questionnaire de 5 questions avant et après, ou une attestation pour le suivi de formation ?
7. **Le ton et les récompenses.** L'esprit « Pokémon » (badges, rangs, évolutions, clins d'œil) est-il un choix assumé à garder tel quel, ou peut-il passer au second plan derrière l'effet sur le site ? (point 11)
8. **La priorisation.** Parmi les huit principes, lequel compte le plus pour vous ? Je propose le 2 (apprendre en jouant) et le 8 (transfert vers le produit), mais c'est votre choix.

## 6. Réponses reçues et plan affiné

### Tes réponses

| Question | Réponse | Ce que ça change |
|---|---|---|
| 1. Le produit | **Générique**, lié à aucun EMS en particulier | La carte « Dans un EMS » décrit des fonctions génériques (collecte automatique, contrôles de qualité, modèle de données, courbes, alertes, plan d'action, mesure et vérification). Le jeu ne nomme aucun produit ni écran réel. Dans le jeu, l'outil s'appelle simplement « l'EMS du bureau ». |
| 2. Les profils | **Tous les métiers.** On explique la démarche, pas un produit | Pas de jargon de développeur dans le jeu. Le transfert se formule en « à quoi ça sert, pour qui, et quelle erreur éviter », compréhensible par tous. L'encadré « Pour tester le logiciel » reste dans le cours. |
| 3. La durée | **Pas de contrainte** pour l'instant | Les options qui allongent le jeu (manipulations, deuxième question, console) deviennent possibles. |
| 4. Le débriefing | **Tout en autonomie** | Le point 13 devient un **auto-bilan intégré au jeu**, et le diplôme imprimable devient la synthèse que le joueur garde. Pas de kit pour les managers. |
| 5. Les voyages | **Annexe, réorientée vers l'energy management si nécessaire** | Option minimale du point 10 : chaque site garde son contenu et gagne une manipulation tournée vers l'energy management. |
| 6. La preuve d'apprentissage | **Non** | Pas de questionnaire avant et après, pas d'attestation. |
| 7. Le ton et les récompenses | **Garder l'esprit** | Badges, rangs, évolutions et clins d'œil restent tels quels. Le point 11 se réduit à *ajouter* la récompense par l'effet (la courbe du site qui s'améliore), sans rien retirer. |
| 8. La priorité | **Le principe 2** | L'ordre change : apprendre *en manipulant* passe avant tout le reste. |

### Le principe directeur

**Chaque étape se joue dans « l'EMS du bureau », un outil générique, sur les données du site choisi.**
- Le joueur ne répond plus seulement à des questions sur la donnée : il la manipule (il raccorde, nettoie, range, lit, détecte, décide, vérifie), et ce qu'il fait à une étape sert à la suivante.
- Les arènes, les dresseurs et les badges restent. Ils vérifient les notions et gardent l'esprit du jeu.

C'est l'option ambitieuse (point 9), construite pas à pas : chaque lot ajoute de vraies manipulations sans casser ce qui marche.

### Lot 1 · Manipuler la donnée à chaque étape (principe 2)

**1a. L'EMS du bureau.** Une console simple s'ouvre depuis le PC du bureau et depuis l'épreuve de chaque champion. Elle affiche le site du joueur et s'enrichit d'un module par badge. Elle réutilise les graphiques existants (`jeu/simulation/`, le curseur du talon de `jeu/epreuves/analyser.js`, les ateliers de `jeu/voyages/ateliers.js`).

**1b. Une manipulation par étape**, sur les données du site. Elle remplace une partie des questions de l'épreuve. La colonne « Ce qui passe à la suite » montre comment chaque étape sert les suivantes.

| Étape | Ce que le joueur fait dans l'EMS du bureau | Ce qui passe à la suite |
|---|---|---|
| 1 · Cadrer | Délimiter le périmètre sur le plan du site (bâtiment, usages suivis) et choisir l'objectif (facture, décret tertiaire ou CO₂) | L'objectif choisi décide de l'indicateur suivi jusqu'à l'étape Mesurer |
| 2 · Collecter | Raccorder les compteurs en saisissant le PDL et le PCE **relevés en ville** (carnet), donner le consentement, puis comparer sur une même semaine ce qu'apportent la courbe, l'index et la facture | Un PDL mal recopié donne une erreur de raccordement, comme en vrai |
| 3 · Fiabiliser | Sur la série brute du site, repérer à la souris les trous, les pics impossibles et les doublons, puis choisir leur traitement ; la courbe nettoyée apparaît | La courbe propre sert aux étapes 5 et 6 |
| 4 · Structurer | Ranger site → point de comptage → compteur → mesure dans un arbre, convertir les m³ en kWh, passer du pas de 10 minutes à la journée | La structure rangée alimente les graphiques |
| 5 · Analyser | Placer le talon (existe déjà) et tracer la signature énergétique (consommation selon les DJU) | La référence obtenue sert à détecter |
| 6 · Détecter | Régler un seuil d'alerte par rapport à la référence : voir les vraies dérives et les fausses alertes sur quatre semaines ; la ronde de nuit confirme sur place | Les dérives trouvées deviennent des actions possibles |
| 7 · Agir | Le plan d'action sous budget (existe déjà) ; on y retrouve les dérives de l'étape 6 | Le plan choisi est celui que l'on vérifie à l'étape 8 |
| 8 · Mesurer | Comparer avant et après **sur son propre plan**, corriger l'effet de l'hiver avec les DJU, et conclure : ça a marché, ou pas assez | La boucle recommence, et le chapitre 10 passe à 20 sites |

**1c. Les épreuves exigent ce qu'on a trouvé** (point 5). La fiche patrimoine se remplit depuis le carnet, au lieu de reconnaître des valeurs proposées. Un joueur qui saute une étape depuis le cours reçoit les notes correspondantes (`jeu/interface/choix-etape.js`, `jumpTo`).

**1d. Des retours qui font apprendre** (points 2 et 3), indispensables pour que les manipulations aient du sens :
- dire ce qui est faux et pourquoi, partout (remises en ordre comprises) ;
- en duel, montrer la bonne réponse après une erreur ;
- plus de réussite par simple élimination ;
- après deux erreurs, « Revoir la fiche » sans quitter l'épreuve (point 7).

**Fichiers concernés** : `jeu/epreuves/*.js` (les 8 épreuves), `jeu/moteur/panneaux.js`, `jeu/epreuves/arenes.js`, un nouveau module `jeu/interface/ems-bureau.js`, `jeu/simulation/` pour les séries du site, et `outils/verifier.mjs` pour vérifier chaque manipulation.

**Effort** : grand (8 manipulations, le plus gros chantier du plan), mais découpable étape par étape. On peut publier les étapes une par une.

**Avancement** : lot 1 réalisé. Fiabiliser d'abord (étape pilote, `jeu/epreuves/serie-brute.js`), puis les sept autres étapes (`jeu/epreuves/ems-*.js`) :
- les manipulations 1b de chaque étape, sur les données des trois sites, au doigt comme à la souris ;
- ce qui passe d'une étape à l'autre, dans `S.ems` : objectif (Cadrer) → indicateur (Mesurer), alerte et dérives (Détecter) → plan (Agir) → vérification (Mesurer) ;
- 1c : le site se crée en recopiant le carnet, et le raccordement exige le PDL et le PCE relevés (avec les erreurs de l'API) ;
- 1d : plus d'élimination dans les choix (les propositions sont remélangées après une erreur expliquée), les remises en ordre disent ce qui est juste et la première place fausse, les duels montrent la bonne réponse, et « Revoir la fiche » s'ouvre après deux erreurs.

Reste du lot 1, non fait : la console de l'EMS ouverte depuis le PC du bureau (1a). Les ateliers vivent pour l'instant dans les épreuves des champions.

**Risques**
- Le temps de jeu augmente : ce n'est plus une contrainte, mais l'estimation du pilotage le montrera.
- Les gestes à la souris doivent marcher au doigt sur mobile ; je les testerai sur les deux.
- Chaque manipulation doit marcher pour les trois sites.

### Lot 2 · Des décisions qui comptent (principes 7 et 6)

- **Des décisions qui se suivent** (point 8) : l'objectif de l'étape Cadrer, les dérives de l'étape Détecter et le plan de l'étape Agir se retrouvent à l'étape Mesurer et dans le bilan.
- **Un enjeu propre à chaque site** : l'école et les vacances scolaires, les bureaux et la climatisation, la boulangerie et son four et son contrat.
- **La récompense par l'effet**, ajoutée sans rien retirer (point 11 réduit) : la courbe du site, visiblement plus propre puis plus basse étape après étape, devient un trophée de plus dans la carte de joueur.

### Lot 3 · Transfert et auto-bilan, en autonomie (principe 8)

- **Une carte « Dans un EMS »**, générique, après chaque badge. Trois cases : *ce que tu viens de faire* ; *ce que fait un EMS à cette étape* ; *pourquoi c'est important pour un client, et l'erreur à éviter*. Elle est rédigée pour tous les métiers et se range dans le Classeur.
- **L'auto-bilan d'étape** (le point 13 transformé) : en sortant de l'arène, trois questions de rappel sur l'étape, sans pénalité et avec les explications, puis « Ce que je retiens » en une phrase choisie parmi trois.
- **Le diplôme imprimable** (point 4) : la synthèse des 8 étapes (ce que je sais faire, notions clés, ce que fait un EMS) en une page à garder. L'écart « Piloter » / « Mesurer » est corrigé au passage.

### Lot 4 · Les voyages et les finitions

- **Les voyages en annexe assumée** (point 10, option minimale) : présentés comme « Culture énergie », avec une manipulation tournée vers l'energy management par site :
  - solaire : l'autoconsommation sur la courbe de ton site ;
  - data center : le PUE et la chaleur fatale ;
  - barrage : la pointe et le prix de l'heure ;
  - éolien et nucléaire : le contenu carbone et la garantie d'origine dans le contrat.
- **Un mode « Expert » facultatif** (point 12) : des questions plus dures, sans aide.
- **Réglage de la difficulté** à partir des questions les plus ratées du pilotage, une fois les lots 1 et 2 en ligne.

### Ce qui est retiré du plan

- La mesure avant / après et l'attestation (réponse 6).
- Le kit de débriefing pour les managers, remplacé par l'auto-bilan (réponse 4).
- Toute référence à un produit réel (réponse 1).
- La réduction des badges, de l'XP ou des clins d'œil (réponse 7).

### Ma proposition pour démarrer

Commencer le **lot 1 par une seule étape pilote**, l'étape 3 · Fiabiliser (nettoyer la série brute du site). Elle est représentative et montre le mieux la différence entre répondre à une question sur la donnée et la traiter soi-même. Après ton retour sur cette étape, je déroule les sept autres.

*Rapport mis à jour après tes réponses. Je n'ai toujours rien modifié dans le jeu, et j'attends ta validation pour démarrer.*

