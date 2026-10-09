# Audit de la partie « Cours »

Date : 9 octobre 2026. Périmètre : le cours (`index.html`, `cours/`, et ce qu'il utilise dans `commun/`) et ses passerelles vers le jeu. Le jeu lui-même (`jeu/`) est hors périmètre ; il a son propre audit dans `AUDIT_PEDAGOGIQUE.md`.

**Aucun fichier du projet n'a été modifié**, à part ce rapport.

## Comment lire ce rapport

**Statut de chaque affirmation :**
- **CONSTAT** : vérifié dans le code (fichier:ligne) ou sur la page rendue.
- **SUPPOSITION** : une interprétation, non vérifiée.
- **RESSENTI** ou **À TESTER** : ce que seuls des tests avec de vrais apprenants peuvent trancher (clarté perçue, facilité de navigation, temps passé).

**Notes :** 1 = problème majeur, 2 = insuffisant, 3 = correct, 4 = très bon.

**Méthode.** Le site a été lancé en local (`outils/serveur.mjs`) et piloté dans Chromium (Playwright) :
- formats : ordinateur (1280 × 860) et téléphone (390 × 844, tactile), thème clair et thème sombre ;
- pages examinées : toutes, avec les 24 onglets des 8 étapes ;
- vérifications automatiques : 70 captures, toutes regardées, aucune erreur JavaScript sur les chargements ; 120 analyses axe-core ;
- tests manuels scriptés : parcours au clavier, zoom et reflow, contraste mesuré sur les pixels rendus ;
- textes : longueur des phrases et vocabulaire mesurés sur le texte rendu ;
- exemples chiffrés recalculés à la main ;
- sources : `node outils/verifier.mjs sources` lancé en lecture seule.

Les scripts, les captures et les mesures brutes sont dans le dossier temporaire de la session de travail, pas dans le dépôt.

**Ce qui n'a pas été fait :**
- aucun test avec un lecteur d'écran (NVDA, VoiceOver, TalkBack) ;
- aucun test avec de vrais apprenants ;
- les liens externes n'ont pas pu être testés, car le réseau de l'environnement refuse les connexions sortantes. Il faut lancer `node outils/sources.mjs liens` sur ton poste.

**Points recoupés.** J'ai revérifié à la main dans le code les points les plus graves :
- le schéma de l'étape 8 ;
- l'exemple « 413 → 404 » ;
- le quiz « 100 kVA » ;
- la page Sources ;
- le focus de la fenêtre « Mon compte » ;
- les onglets absents de l'adresse ;
- les facteurs CO₂.

**Une nuance par rapport aux analyses détaillées : les facteurs CO₂ du gaz.** Le tableau de l'étape 8 affiche « ≈ 0,227 kg/kWh PCI », mais le total de 42 t est calculé avec 0,2043 par kWh facturé (`commun/donnees/references.js:45`).
- Ce n'est pas une erreur de calcul : 0,227 / 0,2043 ≈ 1,11, soit le rapport PCS/PCI du gaz.
- C'est une incohérence de présentation : le facteur affiché n'est pas celui du calcul, et la différence PCS/PCI n'est expliquée nulle part.

---

## Décisions de l'auteur après relecture (9 octobre 2026)

Ces décisions s'appliquent à tout le rapport et priment sur les questions ouvertes de la section 6.

| Question | Décision | Effet sur l'audit |
|---|---|---|
| Public visé | **Tous les salariés.** | L'accueil (« Tu développes ou tu testes un logiciel… ») est à réécrire. Le jargon technique sans définition pèse plus lourd : API, UTC, Σ, segments C1-C5, taux de taxes, versions d'API. Les encadrés « Pour tester le logiciel » deviennent du bruit pour la majorité : à replier ou à retirer. La note « facile à comprendre » reste à 3 pour l'Essentiel et Comprendre, mais tombe à **2 pour l'Approfondir**. |
| Étape « faite » | **Laissée à mon choix.** Je retiens **« manipulée »** : une étape est faite quand l'onglet Essentiel a réellement été affiché **et** que la démo de l'Essentiel a été menée jusqu'à son résultat (une vérification ou un résultat obtenu, juste ou faux). La réussite au mini-quiz s'affiche à part, comme une mention « maîtrisée ★ » qui ne bloque rien. | « Vue » est trop faible : c'est déjà le défaut actuel. « Réussie » découragerait un public non spécialiste et ferait de la progression un examen. « Manipulée » garde l'esprit « on apprend en faisant ». La correction de la priorité 12 suit cette règle, avec un message « Étape N terminée » quand elle devient vraie. |
| Pas de temps de l'école | **10 minutes**, choix assumé de cas d'école. | Les « 144 points par jour » et les démos restent tels quels. Il reste à corriger ce qui présente 10 min comme la règle générale : écrire « au pas de 10 min, celui de l'école » et signaler une fois, avec ses sources, que les compteurs réels sont souvent à 5 min (plus de 36 kVA) ou à 30 min (Linky). La priorité 16 est allégée en conséquence. |
| Déclaration d'accessibilité | **Pas besoin.** | Aucun audit formel ni test exhaustif au lecteur d'écran. On garde les corrections qui gênent vraiment des personnes : fenêtre « Mon compte », focus perdu, tableaux, courbes, contrastes, messages de statut. Les écarts purement formels passent en facultatif : plan du site (12.1), `lang` sur « Energy Management » (8.7), menus sans liste (9.3), `role` des figures (1.9). |

---

## 1. Résumé du parcours de l'apprenant

*Corrige-moi ici si j'ai mal compris quelque chose : tout le reste de l'audit en dépend.*

### Le public et la promesse

L'accueil (`cours/pages/accueil.js:33-34`) annonce une « Formation interne · niveau débutant ». Il s'adresse au lecteur ainsi : « Tu développes ou tu testes un logiciel d'energy management ? Ce site t'explique le métier en 8 étapes, avec une école fictive comme terrain de jeu. »

Le jeu, lui, vise « tous les salariés ». Cette différence de public change plusieurs jugements de l'audit : voir les questions ouvertes.

### Le parcours

1. **Accueil** (`#accueil`) :
   - titre « De la donnée à l'énergie économisée » ;
   - roue du cycle cliquable : étapes 1 à 4 = Data (« produisent une donnée fiable »), étapes 5 à 8 = Énergie (« s'en servent pour consommer moins ») ;
   - action principale « Commencer par l'étape 1 », action secondaire « Ou jouer à Wattlings » ;
   - « mode d'emploi » des 3 niveaux : Essentiel « 30 secondes », Comprendre, Approfondir ;
   - tableau « Ta progression » ;
   - carte de l'école Jean-Jaurès (2 000 m², 250 élèves, 86 MWh d'électricité, 208 MWh de gaz, 44 000 € TTC).
2. **Les 8 étapes** (`#etape-N`). Chacune a la même structure :
   - en-tête : famille, « Étape N sur 8 », titre, **question directrice** ;
   - onglet **Essentiel** : phrase clé, 3 points « à retenir », analogie, schéma légendé, démo, « Les mots de cette étape », puis un bouton « Passer à Comprendre » ;
   - onglet **Comprendre** : démos avec l'école et exemples chiffrés pas à pas ;
   - onglet **Approfondir** : règles métier, cas limites, encadré « Pour tester le logiciel », mini-quiz de 5 ou 6 questions ;
   - bas de page : liens « Étape précédente / Étape suivante » et bandeau « Mettre en pratique » vers le chapitre correspondant du jeu.

   | # | Étape | Question directrice | Démo de l'Essentiel |
   |---|---|---|---|
   | 1 | Cadrer | Qu'est-ce qu'on mesure, où, et pourquoi ? | Relie chaque élément à son compteur |
   | 2 | Collecter | D'où viennent les données et sous quelle forme ? | Ouvre les trois robinets de données |
   | 3 | Fiabiliser | Peut-on faire confiance à ces données ? | Chasse aux anomalies |
   | 4 | Structurer | Comment organiser les données pour les exploiter ? | Change le pas de temps |
   | 5 | Analyser | Comment le bâtiment consomme-t-il ? | Trouve le talon de l'école |
   | 6 | Détecter | Où y a-t-il gaspillage ou dérive ? | Déclenche des dérives |
   | 7 | Agir | Que fait-on concrètement pour consommer mieux ? | Compose ton plan d'action |
   | 8 | Mesurer | L'action a-t-elle marché ? On recommence ? | Avant / après : brut ou corrigé ? |

   L'étape 8 se termine par « La boucle recommence » (retour à l'étape 1) et un renvoi vers le quiz de synthèse.
3. **Pages annexes**, dans la barre du haut :
   - **L'école** : fiche, courbes, et le « Laboratoire » qui injecte anomalies et dérives dans toutes les démos ;
   - **Glossaire** : 66 termes, avec recherche ;
   - **Quiz final** : 12 questions ; chaque correction renvoie à l'étape à relire ;
   - **Sources** : 41 sources affichées ;
   - **Patrimoine** : « Au-delà des 8 étapes », piloter vingt bâtiments ;
   - **Le jeu**.
4. **Progression** (`cours/coquille/etat.js:74-77`) : une étape est « faite » quand son Essentiel est marqué lu **et** qu'une démo a été manipulée. La barre affiche « N/8 étapes ».
   - CONSTAT : l'Essentiel est marqué lu dès qu'on ouvre l'étape, quel que soit l'onglet (`cours/pages/etape.js:188`).
   - CONSTAT : il suffit d'un clic dans n'importe quelle démo de l'étape, même pour une mauvaise réponse.
   - CONSTAT : les quiz, l'école et Patrimoine ne comptent pas.
   - Rien ne mémorise la dernière page lue : il n'y a pas de « Reprendre ».

Le détail étape par étape (contenu de chaque onglet, nombre de questions, chapitre du jeu associé) est en section 3.1.

---

## 2. Tableau récapitulatif des notes

| Axe | Question | Note | En une phrase |
|---|---|---|---|
| Pédagogie | Est-ce facile à comprendre ? | **3** (Essentiel et Comprendre) ; **2** pour l'Approfondir, le public étant tous les salariés | Essentiel court et régulier (13,7 mots par phrase en moyenne, analogies, exemples justes). Approfondir dense (jusqu'à 1 037 mots). Infobulles absentes hors Essentiel. Notions utilisées avant d'être expliquées. |
| Pédagogie | Les étapes sont-elles claires ? | **3** | Question et phrase clé par étape, gabarit constant. Mais aucun objectif d'apprentissage explicite et presque aucune transition entre étapes. |
| Pédagogie | Information représentée de plusieurs manières ? | **3** | Texte + schéma + exemple + tableau + démo + quiz pour presque toutes les notions. Aucune image réelle, ni audio ni vidéo. IPMVP sous une seule forme. |
| Accessibilité | Le site respecte-t-il le RGAA (4.1.2) ? | **2** | Base solide (onglets ARIA, clavier, reflow, thème sombre sans défaut de contraste). Mais 26 critères non conformes sur 65 applicables évalués, dont la fenêtre « Mon compte » inutilisable au clavier. Taux indicatif ≈ 60 %, sans valeur de déclaration. |
| Métier | Grandes informations et façon de les communiquer | **3** | 40 messages clés bien répétés et sous plusieurs formes ; calculs justes. Quelques contradictions internes, dont le schéma de l'étape 8. |
| Métier | Tout est-il sourcé ? | **2** | Mécanisme exemplaire (registre, appels de note, relevés), mais seule l'étape 2 est référencée. Réglementation (décret tertiaire, OPERAT, sanctions, facteurs CO₂) sans source officielle. La page Sources promet des listes que 6 étapes n'affichent pas. |
| Expérience utilisateur | Informations au bon endroit ? | **3** | Essentiel bien ordonné, jeu après la leçon. Mais l'école et son laboratoire sont mal placés, et la suite après l'étape 8 se raconte de trois façons. |
| Expérience utilisateur | Facile de retrouver la bonne étape ? | **3 sur ordinateur, 2 sur téléphone** | Bandeau des étapes collant et adresses stables sur ordinateur. Pas de « Reprendre », onglets absents de l'adresse. Sur téléphone, la barre du haut défile et l'étape en cours sort de l'écran. |
| Expérience utilisateur | Boutons et informations bien placés ? | **2** (2,5 avant arrondi) | Composants cohérents d'une page à l'autre. Mais le gros bloc bleu du jeu concurrence « Passer à Comprendre », rien ne mène à Approfondir, et le bouton du glossaire recouvre du contenu sur téléphone. |

---

## 3. Analyse détaillée

### 3.1 Axe 1 : pédagogie

#### 3.1.0 Détail du parcours (constats)

##### 1.1 Accueil (`#accueil`, `cours/pages/accueil.js`)
- Titre « De la donnée à l'énergie économisée ». Vient ensuite une roue du cycle cliquable (« Survole ou choisis une étape »), avec un filtre Data 1 à 4 / Énergie 5 à 8 et la phrase : « Les étapes 1 à 4 (Data) produisent une donnée fiable. Les étapes 5 à 8 (Énergie) s'en servent pour consommer moins. »
- Il y a deux appels à l'action : « Commencer par l'étape 1 » et « Ou jouer à Wattlings ».
- Un « mode d'emploi » présente les 3 niveaux. Essentiel : « 30 secondes : l'idée en une phrase, un schéma, une analogie, et une démo à manipuler » (accueil.js:60). Comprendre : « démos plus riches… exemple chiffré pas à pas ». Approfondir : « règles métier, cas limites, vocabulaire technique et un mini-quiz ».
- Une note annonce que les mots soulignés en pointillés s'expliquent au survol ou au clic, et rappelle le glossaire flottant.
- Un tableau « Ta progression » affiche, pour chaque étape : Essentiel, Démo, Comprendre, Approfondir, Quiz (score).
- Une carte présente l'école Jean-Jaurès : 2 000 m², 250 élèves, 86 MWh d'électricité, 208 MWh de gaz, 44 000 € TTC.
- **Aucun objectif d'apprentissage global, aucune durée estimée, aucun prérequis** (CONSTAT : une recherche de « objectif », « tu sauras », « prérequis » et « durée » dans `cours/pages` et `cours/contenu` ne renvoie que des emplois métier).

##### 1.2 Structure commune d'une étape (`cours/pages/etape.js`)
- En-tête : famille, « Étape N sur 8 », titre, **question** (etape.js:58-60).
- **Essentiel** : phrase clé, 3 puces « à retenir », analogie, schéma SVG avec légende, démo, liste « Les mots de cette étape », puis le bouton « Tu as compris l'idée ? … Passer à Comprendre » (etape.js:107).
- **Comprendre** : l'intro « Des démos avec l'école et des exemples chiffrés pas à pas. », identique pour les 8 étapes (etape.js:116), suivie des blocs de `niveaux.comprendre`.
- **Approfondir** : l'intro « Règles métier, cas limites, vocabulaire technique, puis un mini-quiz. », puis les blocs, l'encadré « Pour tester le logiciel » (cas utiles) et le mini-quiz.
- En bas de page :
  - un pager « ← Étape précédente / Étape suivante → » qui ne donne que le titre ;
  - un bandeau jeu « Mettre en pratique · Étape N — Joue « X » dans Wattlings », avec « ▶ Commencer le jeu » et des liens directs vers les chapitres (`cours/coquille/jeu.js`, `CHAPITRES_JEU` dans `commun/donnees/etapes.js`).
- **Comprendre n'a pas de bouton vers Approfondir** (CONSTAT : aucune occurrence dans les 8 textes rendus de Comprendre).

##### 1.3 Étape par étape

| # | Titre / question (rendus) | Objectif annoncé | Démo de l'Essentiel | Comprendre | Approfondir | Quiz | Passerelle jeu |
|---|---|---|---|---|---|---|---|
| 1 | Cadrer · « Qu'est-ce qu'on mesure, où, et pourquoi ? » | Aucun objectif formel. Phrase clé : « Avant de mesurer quoi que ce soit, on décide quoi suivre, où, et dans quel but. » | « Relie chaque élément à son compteur » (glisser-déposer, Vérifier) | texte « Du patrimoine au point de comptage » ; démos « Écris la fiche de cadrage », « Ce que mesure un compteur… » ; encadré sous-compteur | tableau des niveaux de périmètre ; texte sur les identifiants ; démo « Valide un identifiant » ; encadré plusieurs-à-plusieurs ; « L'objectif décide des données » ; cas utiles | 5 | Arène 1 (2 chapitres) |
| 2 | Collecter · « D'où viennent les données et sous quelle forme ? » | Aucun. Phrase : « …trois canaux : le télérelevé, les index et les factures. » | « Ouvre les trois robinets de données » (exploratoire) | « Qui envoie quoi ? » ; démo « Signe un consentement (simulé) » ; « Message clé n° 1 » ; démo « Trois sources, une même vérité » | accès Enedis (C5/C1-C4, Data Connect, SGE) ; encadré « bascule v2 » ; GRDF/ADICT et coefficient ; démos « Calcule la consommation à partir des index », « Anatomie d'une facture » ; taux 2026 ; tableau des 3 sources ; RGPD ; cas utiles | 6 | Arène 2 |
| 3 | Fiabiliser · « Peut-on faire confiance à ces données ? » | Aucun. Phrase : « …complète, sans doublon, plausible et cohérente entre sources. » | « Chasse aux anomalies » (6 journées pièges, choix d'une correction) | démo changement d'heure ; exemple « Un index qui recule » ; démo « Écart entre la courbe et l'index : quel seuil ? » | tableau des règles de contrôle ; « Puissance, énergie et unités » ; exemple « De la puissance à l'énergie » ; démo « Début ou fin de période ? » ; tableau des statuts ; cas utiles | 5 | Arène 3 |
| 4 | Structurer · « Comment organiser les données pour les exploiter ? » | Aucun. Phrase : « On range les données dans un modèle commun… » | « Change le pas de temps » (exploratoire) | exemple « 144 points deviennent une journée » ; démo « Agrège les compteurs du site » ; encadré « piège du sous-compteur » | schéma du modèle ; tableau des objets ; « Gérer l'historique » ; démo « Rattacher une facture au calendrier » ; tableau des granularités ; cas utiles | 5 | Arène 4 |
| 5 | Analyser · « Comment le bâtiment consomme-t-il ? » | Aucun. Phrase : « …quand le bâtiment consomme, combien il consomme à vide, et comment il réagit au froid. » | « Trouve le talon de l'école » (estimation puis Vérifier) | démos profils, signature énergétique, puissance souscrite ; exemple « Les ratios de l'école » | « Consommation de base et variable » (E = a + b × DJU) ; exemple de normalisation climatique ; « Les DJU en pratique » ; tableau des ratios ; cas utiles | 5 | Arène 5 |
| 6 | Détecter · « Où y a-t-il gaspillage ou dérive ? » | Aucun. Phrase : « On compare la consommation réelle à ce qu'elle devrait être… » | « Déclenche des dérives » (4 scénarios) | exemple « Un talon qui monte de 3 kW » ; démo « Règle ton alerte » (référence, seuil, persistance) | tableaux « Quelle référence ? » et « Types d'alertes » ; « Faux positifs, faux négatifs » ; cas utiles | 5 | Arène 6 |
| 7 | Agir · « Que fait-on concrètement pour consommer mieux ? » | Aucun. Phrase : « …régler, optimiser le contrat, puis investir. » | « Compose ton plan d'action » (cases à cocher, économies, temps de retour) | exemples « Baisser la consigne d'un degré » et « Ajuster la puissance souscrite » ; démo « Produire son électricité » | tableau sobriété / efficacité / production ; autoconsommation ; temps de retour et impact sur la facture ; cas utiles | 5 | Arène 7 |
| 8 | Mesurer · « L'action a-t-elle marché ? On recommence ? » | Aucun. Phrase : « On vérifie que l'action a vraiment marché, à conditions comparables, puis on repart au début de la boucle. » | « Avant / après : brut ou corrigé ? » (curseur météo, bascule brut/corrigé) | exemple « Mesure et vérification d'une économie » ; démos « Un bâtiment, quatre indicateurs » et « La trajectoire du décret tertiaire » | tableau des indicateurs ; texte décret tertiaire ; encadré « À revérifier » ; tableau ISO 50001 ; texte M&V / IPMVP ; cas utiles ; sources | 6 | Arène 8 + chapitre 10 ; liens « La boucle recommence » (→ étape 1) et « quiz de synthèse » |

##### 1.4 Pages annexes
- **#ecole** : fiche de l'école et courbes mensuelles. Elle contient le **« Laboratoire »**, 12 interrupteurs (8 anomalies de données, 4 dérives) qui s'appliquent à toutes les démos, avec un renvoi : « Où les voir : … étape 3 ; … étape 2 ; dérives dans l'étape 6 ». S'y ajoutent le calendrier zone C, les changements d'heure, les hypothèses tarifaires et un bandeau jeu (« Accueil · choix du site »). La page compte 544 mots.
- **#patrimoine** : « Au-delà des 8 étapes · Piloter un patrimoine ». Question « Où agir en premier quand on gère vingt bâtiments ? ». On y trouve une phrase clé, 4 puces, l'analogie du ticket de caisse, 2 démos (Pareto, bâtiments similaires), un exemple chiffré (gisement de l'école Pasteur), « Les pièges du benchmark » et le bandeau du chapitre 10. La page compte 893 mots. **Elle n'entre pas dans la progression.**
- **#glossaire** : 66 termes, chacun avec une définition, un exemple tiré de l'école, une source éventuelle et les étapes liées. Il y a un champ de recherche. 2 864 mots rendus.
- **#quiz-final** : 12 questions, 1 ou 2 par étape. « Chaque correction renvoie à l'étape à relire » (`cours/pages/quiz-final.js:50`). Le score est conservé (`quizFinal`) mais n'entre pas dans la progression.
- **#sources** : 41 sources. CONSTAT, texte affiché : « Référencement en cours. Déjà traité : étape 2, Collecter. Les autres étapes gardent pour l'instant leur liste de liens en bas du niveau Approfondir. »

##### 1.5 Comment la progression est calculée (CONSTAT)
- `cours/coquille/etat.js:74-77` : `estFaite(e) = !!progression[e].essentiel && !!progression[e].demo`. La barre indique « N/8 étapes » (`principal.js:62-66`), avec l'infobulle « Une étape est terminée quand son Essentiel est lu et sa démo manipulée ».
- `essentiel` est marqué **dès l'ouverture de la page de l'étape, quel que soit l'onglet demandé** (`cours/pages/etape.js:188`, `magasin.marquer(num, "essentiel")`, appel inconditionnel). Ouvrir un onglet marque aussi `comprendre` ou `approfondir` (etape.js:142).
- `demo` est marqué par **n'importe quelle démo de l'étape**, Comprendre et Approfondir compris (`toucher` transmis aux blocs, etape.js:155 ; démo de l'Essentiel, etape.js:195). Il suffit d'une première interaction, quelle qu'elle soit : dans `cours/demos/cadrer.js:197`, cliquer « Vérifier » avec 0 étiquette placée suffit.
- Vérification en navigateur vierge : ouvrir `#etape-5-comprendre` puis cliquer le premier bouton de la démo « Profils » fait passer la barre de « 0/8 » à **« 1/8 étapes »**, sans que l'Essentiel ait jamais été affiché.
- Les quiz (score par étape, `quiz[num]`) et le quiz final sont affichés dans le tableau de l'accueil mais **ne comptent pas** dans « fait ». Patrimoine et école ne sont pas suivis.
- SUPPOSITION : la progression dit donc « visité et cliqué », pas « compris ». Comme indicateur de motivation c'est acceptable ; c'est trompeur si on la lit comme un indicateur d'acquisition.

---

#### 3.1.1 Question 1 : « Facile à comprendre ? » Note : **3 / 4** (Essentiel 3,5 ; Approfondir 2,5)

##### 2.1 Mesures (CONSTAT)

- Phrases : prose des fichiers `contenu/etape-N.js`, après retrait de `{{…}}`, `**` et `[[…]]`. Sont comptés : la phrase clé, les puces, l'analogie, la légende, les consignes, les paragraphes, les encadrés, les exemples et les notes de tableau. Les cellules de tableau ne sont pas comptées. Le découpage se fait sur « . ! ? … » suivis d'une majuscule (heuristique).
- « Mots rendus » : texte visible de l'onglet dans Chromium, interface des démos comprise (boutons, axes, valeurs).
- « Infobulles » : termes `{{…}}` distincts dans le texte de l'onglet, hors liste « Les mots de cette étape ».

| Étape · onglet | Mots rendus | Mots de prose | Phrases | Moy. mots/phrase | Max | Phrases > 25 mots | Infobulles distinctes | Hauteur (px) |
|---|---|---|---|---|---|---|---|---|
| 1 · Essentiel | 231 | 121 | 9 | 13,4 | 24 | 0 | 4 | 1 131 |
| 1 · Comprendre | 322 | 141 | 9 | 15,7 | 24 | 0 | 2 | 1 398 |
| 1 · Approfondir | 572 | 267 | 14 | 19,1 | 36 | 5 | 5 | 2 338 |
| 2 · Essentiel | 426 | 141 | 10 | 14,1 | 27 | 1 | 8 | 2 009 |
| 2 · Comprendre | 411 | 161 | 11 | 14,6 | 24 | 0 | 4 | 1 756 |
| 2 · Approfondir | **1 037** | **537** | 27 | 19,9 | 36 | **10** | 13 | **4 143** |
| 3 · Essentiel | 300 | 130 | 8 | 16,3 | 24 | 0 | 2 | 1 520 |
| 3 · Comprendre | 408 | 184 | 17 | 10,8 | 22 | 0 | **0** | 1 893 |
| 3 · Approfondir | 669 | 216 | 13 | 16,6 | **54** | 2 | **0** | 2 607 |
| 4 · Essentiel | 347 | 125 | 8 | 15,6 | 25 | 0 | 4 | 1 756 |
| 4 · Comprendre | 224 | 125 | 12 | 10,4 | 15 | 0 | **0** | 1 140 |
| 4 · Approfondir | 658 | 135 | 6 | 22,5 | 41 | 3 | **0** | 2 894 |
| 5 · Essentiel | 241 | 127 | 9 | 14,1 | 21 | 0 | 2 | 1 271 |
| 5 · Comprendre | 407 | 98 | 9 | 10,9 | 26 | 1 | 2 | 2 293 |
| 5 · Approfondir | 457 | 273 | 16 | 17,1 | 46* | 3 | 2 | 1 887 |
| 6 · Essentiel | 355 | 122 | 9 | 13,6 | 19 | 0 | 2 | 1 405 |
| 6 · Comprendre | 203 | 88 | 9 | 9,8 | 16 | 0 | **0** | 1 040 |
| 6 · Approfondir | 457 | 134 | 6 | 22,3 | 40 | 2 | 1 | 1 759 |
| 7 · Essentiel | 442 | 104 | 11 | 9,5 | 16 | 0 | 1 | 1 864 |
| 7 · Comprendre | 227 | 157 | 14 | 11,2 | 19 | 0 | **0** | 1 182 |
| 7 · Approfondir | 403 | 202 | 11 | 18,4 | 43 | 3 | 3 | 1 663 |
| 8 · Essentiel | 312 | 119 | 8 | 14,9 | 18 | 0 | 4 | 1 437 |
| 8 · Comprendre | 298 | 111 | 11 | 10,1 | 18 | 0 | 1 | 1 526 |
| 8 · Approfondir | 681 | 312 | 14 | 22,3 | 37 | 5 | 5 | 2 584 |

\* 46 = deux phrases fusionnées par l'heuristique (« … × DJU. a est… »), car la seconde commence par une minuscule.

Phrases des mini-quiz (questions et explications) : moyenne de 8,4 à 10,7 mots selon l'étape, maximum 20. Elles sont courtes.

Phrases de 35 mots ou plus (11 au total, toutes en Approfondir) :
- 8 sont des listes « Cas utiles : … » de l'encadré « Pour tester le logiciel ». Exemple (3 · Approfondir, 54 mots) : « Cas utiles : jours de 23 h et de 25 h, fuseau UTC ou local, horodatage de début ou de fin, doublons exacts et doublons de valeurs différentes, valeur 0 en journée, valeur négative, W au lieu de kW, … ».
- Les autres sont « Data Connect a basculé vers une nouvelle version le 28 septembre 2026 : … API v5 … » (2 · Approfondir, 36 mots) et « Objectifs de réduction de la consommation d'énergie finale : −40 % en 2030, … » (8 · Approfondir, 37 mots).

Écran : à 900 px de haut, un onglet occupe de 1,2 (6 · Comprendre) à **4,6 écrans** (2 · Approfondir).

##### 2.2 Ce qui marche (CONSTAT)
- **Essentiel court et régulier** : 104 à 141 mots de prose, 13,7 mots par phrase en moyenne, aucune phrase au-delà de 27 mots. Le même gabarit se répète sur 8 étapes : question, phrase clé, 3 puces, analogie, schéma, démo.
- **Analogies de la vie courante** dans chaque Essentiel : bilan de santé, appli bancaire, thermomètre, bibliothèque, électrocardiogramme, robinet qui goutte, dépenses d'un foyer, « se peser en manteau ». Exemple (`etape-8.js:22-23`) : « Tu te pèses en manteau en janvier et en t-shirt en juillet : tu as « perdu » 3 kg. »
- **Un fil rouge chiffré et cohérent**, l'école Jean-Jaurès, partout. J'ai recalculé à la main les exemples des étapes 3 à 8 et ils sont justes :
  - 24 kW × 1/6 h = 4 kWh ;
  - 2 503,5 / 6 = 417 kWh ;
  - 150 000 × 2 244 / 1 900 = 177 158 kWh, soit −9,7 % (contre −23,5 % sans correction) ;
  - 3 kW × 7 240 h = 21 720 kWh ;
  - 87,4 × 1 900 = 166 060 kWh, soit −16,3 % (contre −29,1 % en brut).
- **Des exemples pas à pas** (bloc `exemple` avec calculs) : 1 en Comprendre aux étapes 3 à 6, 2 en Comprendre à l'étape 7, 1 en Comprendre à l'étape 8, 1 en Approfondir aux étapes 3 et 5.
- **Correction immédiate des quiz** : « Exact. » ou « Pas tout à fait. » suivi de l'explication (`cours/blocs/quiz.js:36`). Un score trop bas renvoie à « Relis le niveau Comprendre, puis retente ».
- **Infobulles `{{terme}}`** : 50 des 66 termes du glossaire sont liés au moins une fois dans les étapes. Sigles introduits avec infobulle dès leur première apparition : PDL (avec PRM), PCE, OPERAT, tCO2e, kW, SGE (développé : « système de gestion des échanges »), ADICT, PCS, M&V, ISO 50001, IPMVP.
- Le tutoiement et les verbes d'action dans les consignes (« Glisse », « Choisis », « Bouge ») abaissent le registre.

##### 2.3 Problèmes (CONSTAT, avec exemples)

1. **Infobulles concentrées dans l'Essentiel, quasi absentes plus loin.** Comprendre et Approfondir n'ont aucune infobulle aux étapes 3 et 4, ni en Comprendre aux étapes 6 et 7, alors que ces onglets emploient « UTC », « horodatage », « puissance apparente », « HPB (heures pleines, saison basse) », « interpolation », « profil type », « granularité », « option tarifaire ». **16 termes du glossaire ne sont jamais liés dans le texte des étapes** : energie, cadran, hp-hc, c4, rgpd, turpe, accise, tva, fourniture, facture-estimee, horodatage, utc, interpolation, ratio, seuil-alerte, kwc. On ne les trouve que dans la liste « Les mots de cette étape » et dans la page Glossaire.

2. **Termes et sigles employés sans définition et absents du glossaire.**
   - PCI (`etape-8.js:102`, « ≈ 0,227 kg/kWh PCI (gaz) »).
   - R² (démo signature : « R² : qualité de la droite (1 = parfaite) », définition minimale) et « régression ».
   - « persistance » (démo « Règle ton alerte », définie seulement dans la définition de `seuil-alerte`).
   - API, « web services », COSTIC (`etape-5.js`, « comme celle du COSTIC », jamais développé), LED, HT/TTC.
   - « consigne », « réduit » (chauffage réduit), « chaudière à condensation ».
   - la notation Σ (« E (kWh) = Σ P (kW) × 1/6 », `etape-3.js`).
   - « Pareto », « gisement », « médiane » (page patrimoine).
   - Notions centrales du cycle **sans entrée de glossaire** : *périmètre*, *dérive*, *pointe*, *anomalie*, *indicateur*, *plan d'action*.

3. **Le cours utilise des notions avant de les expliquer.**
   - Étape 1 · Comprendre, démo « fiche de cadrage » (`cours/demos/perimetre.js:15`) : « Indicateurs : Talon, kWh par DJU, kWh hors occupation ». Le talon et les DJU ne sont expliqués qu'à l'étape 5.
   - Étape 1 · Essentiel, démo cadrer : l'étiquette « Contrat de 60 kVA » arrive avant toute définition. kVA a sa première infobulle à l'étape 3, la puissance souscrite à l'étape 5.
   - « kWh » sert dès l'étape 1 · Comprendre, mais sa première infobulle dans le texte d'une étape n'arrive qu'à l'étape 4 · Essentiel. L'accueil le lie bien une fois.

4. **Promesse de durée non tenue.** L'accueil annonce « 30 secondes » pour l'Essentiel (accueil.js:60). Or un Essentiel rendu compte 231 à 442 mots et une démo, et occupe 1,3 à 2,2 écrans. SUPPOSITION : la prose seule (≈ 120 mots) se lit en 30 à 40 s, mais l'onglet avec sa démo demande plutôt 2 à 5 minutes. À TESTER : mesurer le temps réel.

5. **Surcharge de vocabulaire dans l'Essentiel de l'étape 2** : la liste « Les mots de cette étape » affiche **33 termes** (Télérelevé, Courbe de charge, …, TURPE, Accise, CTA, TVA, …, SGE, GRDF ADICT). Les autres étapes en affichent 5 à 12. Cause : `etape.js:43-45` ajoute tous les termes du glossaire dont `etapes` contient le numéro, même ceux qui ne servent qu'en Approfondir.

6. **Densité de l'Approfondir de l'étape 2** : 1 037 mots, 4,6 écrans, 10 phrases de plus de 25 mots. On y trouve des taux réglementaires datés (« Accise … 26,35 €/MWh … CTA : 15 % de la part fixe du TURPE depuis le 1er février 2026 (21,93 % avant) … TURPE 7 : +3,04 % »), des segments C1 à C5 et une bascule d'API « v2 / v5 ». SUPPOSITION : c'est trop pointu pour un public « niveau débutant ». Ce niveau assume ce choix (« vocabulaire technique »), mais rien n'indique ce qui est facultatif.

7. **Incohérences chiffrées qui peuvent semer le doute.**
   - `etape-5.js:162`, quiz : « La pointe annuelle de l'école est 57 kVA et elle a souscrit **100 kVA** ». Partout ailleurs, l'école a souscrit 60 kVA (page école : « souscrit : 60 » ; `etape-7.js:76`).
   - Le schéma de l'étape 8 (`cours/schemas/mesurer.js:12-13`) affiche « −27 % » sous le libellé « **à météo et occupation égales** ». La démo juste en dessous affiche « −27 % économie brute (ce qu'on voit) » et « −15 % économie corrigée (l'effet réel de l'action) ». Le schéma dit donc le contraire de la leçon, sur le même écran.
   - Étape 7, ordre des leviers : l'Essentiel dit « Sobriété → contrat → efficacité et production » (`etape-7.js:14-17`, schéma « Régler / Optimiser contrat / Investir »). Le tableau d'Approfondir et le quiz demandent « Sobriété, efficacité, production » (quiz Q1). Le contrat disparaît.
   - Baisser la consigne de 1 °C rapporte « ≈ 1 220 € HT par an » dans l'exemple de Comprendre, mais la démo de l'Essentiel affiche « 1 290 €/an ». Passer à 58 kVA rapporte 27 € dans l'exemple et 30 €/an dans la démo.
   - Facteur CO2 du gaz : 0,204 dans l'étape 7 et le patrimoine (« par kWh de gaz facturé »), 0,227 « PCI » dans l'étape 8. La différence PCS/PCI n'est jamais expliquée.
   - « 196 000 kWh » dans le texte, 196 157 dans le calcul (`etape-5.js:112`, `etape-7.js:56-57`).

8. **Vocabulaire du jeu dans le cours.** Démo de l'étape 3 (`cours/demos/fiabiliser.js:190`) : « Dans ce **jeu**, les anomalies sont toujours présentes, quels que soient les réglages du **laboratoire**. » SUPPOSITION : l'apprenant peut confondre ce « jeu » avec Wattlings, et « laboratoire » n'est expliqué que sur la page #ecole.

9. **Encadrés « Pour tester le logiciel »** dans tous les Approfondir : ce sont des listes de 35 à 54 mots, utiles à un testeur. SUPPOSITION : pour un salarié non technique, c'est du bruit. Cela dépend du public visé (voir l'introduction).

10. **Peu d'autoévaluation avant l'Approfondir.** Les mini-quiz n'existent qu'en fin d'Approfondir. Dans l'Essentiel, seules les démos des étapes 1 (Vérifier), 3 (choix d'une correction) et 5 (« Vérifier mon estimation ») corrigent l'apprenant. Celles des étapes 2, 4, 6, 7 et 8 sont exploratoires.

##### 2.4 Prérequis implicites (CONSTAT des emplois, SUPPOSITION sur la difficulté)
- Arithmétique : pourcentages composés (« 1 − 0,9 × 0,9 = 19 % »), règle de trois, et la notation Σ.
- Équation affine et régression : « E = a + b × DJU », R².
- Informatique : API, web services, « relation plusieurs à plusieurs », UTC / ISO 8601 (« 2026-03-29 00:30Z » dans la démo du changement d'heure). C'est naturel pour des développeurs, opaque pour d'autres profils.
- Contexte français : Enedis, GRDF, ADEME, Légifrance, « zone C ». Enedis et GRDF sont expliqués à l'étape 2 (distributeur), mais **GRDF et Enedis apparaissent dès la démo de l'étape 1** (« DISTRIBUTEUR GRDF »).

##### 2.5 À tester avec des apprenants
Temps réel par onglet ; taux de clic sur les infobulles (le suivi `glossary_open` existe déjà dans `cours/coquille/suivi-cours.js`) ; reformulation spontanée de la phrase clé ; réussite aux mini-quiz selon le profil (dev, test, commerce) ; compréhension du schéma de l'étape 8.

---

#### 3.1.2 Question 2 : « Étapes claires ? » Note : **3 / 4**

CONSTAT d'ensemble :
- Chaque étape a un titre-verbe, une question directrice et une phrase clé, qui tiennent lieu d'objectif. Il n'y a **aucun objectif d'apprentissage observable** (« à la fin, tu sauras… »).
- Le champ `avenir` des fichiers de contenu (listes « au programme ») n'est plus affiché, car tous les niveaux existent (`etape.js:118-126`). C'était pourtant le seul sommaire par niveau.
- Le pager ne montre que le nom de l'étape suivante. Il n'y a **pas de phrase de liaison** entre étapes, sauf aux étapes 6 et 8.
- La famille Data / Énergie et la roue de l'accueil donnent une bonne vue d'ensemble.

| Étape | Objectif annoncé | Périmètre net ? | Lien avec la précédente | Lien avec la suivante | Remarques |
|---|---|---|---|---|---|
| 1 Cadrer | Non (question + phrase clé) | Oui : périmètre, identifiants, objectif. Débordement : la fiche de cadrage cite talon et DJU (étape 5) | Accueil → étape 1 | Aucune phrase vers « Collecter » | L'étape 8 renvoie explicitement à l'étape 1 (bouclage) |
| 2 Collecter | Non | Moyennement : trois sources + consentement + facture détaillée + taxes 2026 + RGPD, soit l'étape la plus large (1 037 mots en Approfondir) | Implicite (le PDL réapparaît) | Une démo renvoie à « l'étape Fiabiliser » (`demos/collecter.js:117`) | Anatomie de la facture et taxes débordent vers l'étape 7 (impact des actions) |
| 3 Fiabiliser | Non | Oui : contrôles, unités, horodatage, statuts. Puissance → énergie y est traité, puis répété à l'étape 4 | Implicite (les données de l'étape 2) | Aucune | Le doublon kW → kWh entre les étapes 3 et 4 est voulu mais non signalé |
| 4 Structurer | Non | Oui : modèle, agrégation, historique, rattachement des factures | Aucune | Aucune | Le tableau des granularités annonce DJU et décret tertiaire |
| 5 Analyser | Non | Assez : talon, profils, signature, puissance souscrite, ratios, normalisation. Beaucoup de notions | Aucune phrase (passage de Data à Énergie non commenté) | Aucune | La puissance souscrite revient à l'étape 7, les DJU et la normalisation à l'étape 8 |
| 6 Détecter | Non | Oui : référence, seuil, dérive, faux positifs | **Oui** : « la détection dépend de l'étape Fiabiliser » (`etape-6.js:18`), « (étape 3) » (`etape-6.js:117`), quiz Q2 | Aucune | Bon modèle de liaison |
| 7 Agir | Non | Oui : leviers, temps de retour, autoconsommation | Aucune (alors que les dérives de l'étape 6 justifient les actions) | Aucune | Ordre des leviers incohérent entre Essentiel et quiz |
| 8 Mesurer | Non | Assez large : M&V, indicateurs, décret tertiaire, ISO 50001, IPMVP | Implicite (« L'école a baissé sa consigne… ») | **Oui** : « La boucle recommence… Retour à l'étape 1 » et vers le quiz de synthèse | Le patrimoine est proposé après, via le bandeau du jeu (« Et après ? ») |

SUPPOSITION : la répétition volontaire (DJU aux étapes 5 et 8, puissance souscrite aux étapes 5 et 7, pas de temps aux étapes 2, 3 et 4) aide la rétention. Faute de transitions, l'apprenant risque pourtant de la vivre comme de la redite. À TESTER : demander aux apprenants de remettre les 8 étapes dans l'ordre et de dire ce que chacune apporte à la suivante.

---

#### 3.1.3 Question 3 : « Représentation multiple » Note : **3 / 4**

CONSTAT global :
- **Aucune image (photo, capture), aucun audio ni vidéo dans le cours** : 0 `<img>`, `<video>`, `<audio>` ou `<iframe>` dans les 24 onglets rendus et dans `cours/`. Tous les visuels sont des SVG : un schéma par Essentiel, le schéma du modèle à l'étape 4, la roue du cycle, la vignette de l'école et les graphiques des démos.
- En revanche, texte, schéma, exemple chiffré, tableau, démo interactive et quiz se combinent pour presque toutes les notions.

Légende : ✔ présent ; ~ partiel ; — absent. Colonne « Jeu » : « chap. » si le résumé du chapitre (`CHAPITRES_JEU`) nomme la notion (CONSTAT) ; « mot » si le terme figure seulement dans le code de `jeu/` (grep, nombre de fichiers ; SUPPOSITION sur l'usage réel). QF = quiz final.

| # | Notion | Étape(s) | Texte | Schéma | Image | Ex. chiffré | Tableau | Audio/vidéo | Démo interactive | Quiz | Jeu |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | Périmètre (site / bâtiment / usage) | 1 | ✔ | ✔ cadrer (« PÉRIMÈTRE : 1 SITE ») | — | ~ (clé 80 / 20) | ✔ niveaux de périmètre | — | ✔ cadrer, fiche de cadrage, usages | ✔ É1 Q1, Q5 | chap. (« Mme Périmètre ») |
| 2 | PDL / PCE | 1, 4 | ✔ | ✔ cadrer | — | ✔ identifiants à 14 chiffres | ✔ objets du modèle | — | ✔ cadrer, validateur d'identifiant | ✔ É1 Q2, Q3 ; QF1 | mot (19) |
| 3 | Trois sources de données | 2 | ✔ | ✔ collecter | — | ✔ 9 139 kWh (index) contre 8 695 kWh (facture) | ✔ 3 sources comparées | — | ✔ robinets, trois voies | ✔ É2 Q1, Q6 ; QF2 | chap. Arène 2 |
| 4 | Consentement | 2 | ✔ | — | — | — (seulement « 3 ans ») | — | — | ✔ consentement simulé | ✔ É2 Q2 ; QF3 | chap. (« mandat de M. Relève ») |
| 5 | Index, bouclage | 2, 3 | ✔ | ✔ collecter (compteur) | — | ✔ 99 850 → 00 420 = 570 m³ ; −9 000 kWh | ✔ | — | ✔ calcul à partir des index | ✔ É2 Q3 ; QF5 | mot |
| 6 | Coefficient de conversion m³ → kWh | 2, 4 | ✔ | — | — | ✔ 229,1 × 11,21 = 2 568 kWh | — | — | ✔ index, robinets | ✔ É2 Q4 ; QF6 | chap. (« convertis ») |
| 7 | Facture (lignes, taxes) | 2, 7 | ✔ | — | — (facture stylisée, pas un vrai document) | ✔ 2 881,85 € TTC | ✔ taux 2026 | — | ✔ anatomie d'une facture | ✔ É2 Q5 ; É7 Q5 | mot (40) |
| 8 | Pas de temps, agrégation | 2, 4 | ✔ | ✔ structurer | — | ✔ 144 points → 417 kWh | ✔ granularités | — | ✔ changer le pas | ✔ É4 Q1, Q3 | mot |
| 9 | Puissance contre énergie | 3, 4 | ✔ | — | — | ✔ 24 kW × 1/6 h = 4 kWh | — | — | ~ (courbes en kW) | ✔ É3 Q2, Q3 ; É4 Q1 | non vérifié |
| 10 | Horodatage, changement d'heure, UTC | 3 | ✔ | — | — | ✔ 138 / 150 points | ✔ règles + tableau de la démo | — | ✔ changement d'heure, début/fin, journées 23 h / 25 h | ✔ É3 Q1, Q5 ; QF4 | mot (2) |
| 11 | Anomalies, contrôles de qualité | 3 | ✔ | ✔ fiabiliser (trou, pic) | — | ✔ index qui recule | ✔ règles de contrôle | — | ✔ chasse aux anomalies, seuil d'écart, laboratoire | ✔ É3 Q3 ; QF5 | chap. (« 7 anomalies ») |
| 12 | Statut brut / corrigé / estimé | 3, 4 | ✔ | — | — | — | ✔ statuts | — | ✔ (marquer « estimés ») | ✔ É3 Q4 | ? |
| 13 | Structuration (modèle, arbre, sous-compteur) | 4 | ✔ | ✔ structurer + modèle | — | ✔ 417 + 2 568 ; 80 contre 10 MWh | ✔ objets du modèle | — | ✔ agrégation du site | ✔ É4 Q2, Q5 | chap. Arène 4 |
| 14 | Rattacher une facture au calendrier | 2, 4 | ~ | — | — | ✔ (dans la démo) | — | — | ✔ rattachement | ✔ É4 Q4 ; É2 Q6 | ? |
| 15 | Talon | 5, 6 | ✔ | ✔ analyser | — | ✔ +3 kW → 21 720 kWh, 4 040 € | ✔ ratios | — | ✔ trouver le talon, dérives | ✔ É5 Q4 ; É6 Q1 ; QF7 | chap. Arène 5 |
| 16 | Pointe, profils | 5 | ~ (une puce) | ✔ « pic du déjeuner » | — | ✔ 57 kVA | ✔ (« pointes ») | — | ✔ profils, puissance | ✔ É5 Q3 | mot (33) |
| 17 | Signature énergétique | 5 | ✔ (E = a + b × DJU) | — (nuage de points seulement dans la démo) | — | ✔ a ≈ 83, b ≈ 134 | — | — | ✔ signature | ✔ É5 Q2 | mot (10) |
| 18 | DJU, correction climatique | 5, 8 | ✔ | ✔ mesurer (mais contradictoire, voir 2.3) | — | ✔ deux exemples complets | ✔ kWh/DJU | — | ✔ avant/après, signature | ✔ É5 Q1 ; É8 Q1 ; QF8, QF11 | mot (19) |
| 19 | Ratios kWh/m², benchmark | 5, patrimoine | ✔ | — | — | ✔ 43 / 104 / 147 ; école Pasteur 235 | ✔ ratios | — | ✔ bâtiments similaires | ✔ É5 Q5 | chap. 10 |
| 20 | Baseline (référence) | 6, 8 | ✔ | ✔ detecter | — | — | ✔ « Quelle référence ? » | — | ✔ dérives, règle ton alerte | ✔ É6 Q3 ; QF9 | mot |
| 21 | Seuil de détection, faux positifs, persistance | 6 (3) | ✔ | — | — | ~ (0,5 % / 3 %) | ✔ types d'alertes | — | ✔ règle ton alerte, seuil d'écart | ✔ É6 Q2, Q4 | mot |
| 22 | Dérive | 6 | ✔ | ✔ detecter | — | ✔ +3 kW | ✔ | — | ✔ dérives, laboratoire | ✔ É6 Q1, Q5 | chap. Arène 6 |
| 23 | Plan d'action (hiérarchie des leviers) | 7 | ✔ | ✔ agir (3 marches) | — | ✔ −1 °C → 13 730 kWh | ✔ | — | ✔ plan d'action | ✔ É7 Q1, Q2 ; QF10 | chap. Arène 7 |
| 24 | Sobriété / efficacité | 7 | ✔ | ✔ agir | — | ✔ | ✔ | — | ✔ plan d'action | ✔ É7 Q1 | mot |
| 25 | Temps de retour | 7 | ✔ | — | — | ✔ 30 000 / 2 500 = 12 ans | — | — | ✔ plan d'action, solaire | ✔ É7 Q3 | mot (2) |
| 26 | Puissance souscrite, dépassement | 5, 7 | ✔ | ~ (agir : « contrat, puissance ») | — | ✔ 57 / 60 kVA × 13,50 € | ~ | — | ✔ régler la puissance, scénario de dépassement | ✔ É5 Q3 ; É7 Q5 | chap. Arène 5 |
| 27 | Autoconsommation | 7 | ✔ | — | — | ~ (dans la démo : 36 kWc, 55 %) | ~ (ligne « Production ») | — | ✔ produire son électricité | ✔ É7 Q4 | mot (4) |
| 28 | Mesure avant / après (M&V) | 8 | ✔ | ✔ mesurer (libellé faux) | — | ✔ 27 060 kWh, −16,3 % | ✔ (ISO, ligne Check) | — | ✔ avant/après | ✔ É8 Q1 ; QF11 | chap. Arène 8 |
| 29 | **IPMVP** | 8 | ✔ une phrase (Approfondir) + glossaire | — | — | — | — | — | — | — | — (0 fichier) |
| 30 | Décret tertiaire, OPERAT | 1, 8 | ✔ | — | — | ✔ (trajectoire −40 / −50 / −60 %) | ~ | — | ✔ trajectoire, fiche de cadrage | ✔ É8 Q2 à Q4 | chap. Arène 8 |
| 31 | Indicateurs (kWh, €, CO2) | 8, patrimoine | ✔ | — | — | ✔ 4,5 t + 42 t | ✔ indicateurs clés | — | ✔ quatre indicateurs, Pareto | ✔ É8 Q5 | mot |
| 32 | ISO 50001, boucle d'amélioration | 8 | ✔ | ✔ roue (accueil), mesurer | — | — | ✔ PDCA | — | ~ (roue cliquable) | ✔ É8 Q6 ; QF12 | mot (4) |

**Notions sous une seule forme ou presque (CONSTAT)** :
- **IPMVP** : une seule phrase en Approfondir de l'étape 8, plus l'entrée du glossaire. Aucun exemple, schéma, démo ni quiz.
- **Consentement** : texte, démo et quiz, mais ni schéma (qui donne l'accord, à qui, pour quoi) ni exemple concret de durée ou de périmètre.
- **Statut de la donnée** et **rattachement des factures** : sans schéma, chacun repose sur un seul support visuel (tableau ou démo).
- **Signature énergétique** : aucun schéma statique ; elle n'est visible que si l'apprenant ouvre la démo de Comprendre.
- **Pareto, gisement, médiane** : présents seulement sur la page patrimoine.
- Pour toutes les notions, il manque **les images réelles** (photo d'un compteur Linky ou Gazpar, vraie facture anonymisée, écran d'EMS) et **l'audio ou la vidéo**. SUPPOSITION : une photo de compteur et une vraie facture aideraient les profils non techniques à faire le lien avec le terrain.

À TESTER : savoir quelles représentations les apprenants utilisent vraiment (le suivi `demo_use` et `course_tab` existe déjà) et si la démo seule suffit à comprendre une notion sans schéma.

---

#### 3.1.4 Problèmes de l'axe pédagogie (numérotés PÉD-P1 à PÉD-P19)

| # | Problème (CONSTAT) | Gravité | Effort | Fichiers | Correction recommandée |
|---|---|---|---|---|---|
| P1 | Schéma de l'étape 8 : « −27 % à météo et occupation égales », alors que la démo dit « −27 % brut / −15 % corrigé » | **Élevée** (enseigne le contraire de la leçon) | Petit | `cours/schemas/mesurer.js:12-13` | Afficher « brut −27 % / corrigé −15 % », ou « −15 % à conditions égales » |
| P2 | Aucun objectif d'apprentissage, ni global ni par étape ou niveau ; le champ `avenir` n'est plus affiché | Élevée | Moyen | `cours/contenu/etape-*.js`, `cours/pages/etape.js`, `cours/pages/accueil.js` | Ajouter « À la fin de cette étape, tu sauras… » (2 ou 3 verbes observables) sous la question, et un court sommaire par onglet |
| P3 | La progression « faite » mesure une visite et un clic : l'Essentiel est marqué à l'ouverture de n'importe quel onglet, la démo par n'importe quelle interaction, y compris dans Comprendre ; les quiz ne comptent pas | Élevée (indicateur trompeur) | Petit à moyen | `cours/pages/etape.js:142,155,188,195`, `cours/coquille/etat.js:74-77`, `cours/demos/cadrer.js:197` | Ne marquer `essentiel` que si cet onglet est affiché ; limiter `demo` à la démo de l'Essentiel ou à une action réussie ; option « maîtrisée » si mini-quiz ≥ 60 % ; renommer « vue » / « faite » |
| P4 | Quiz de l'étape 5 : « elle a souscrit 100 kVA », alors que l'école a 60 kVA partout | Moyenne | Petit | `cours/contenu/etape-5.js:162` | « Si l'école avait souscrit 100 kVA… » |
| P5 | Ordre des leviers : Essentiel « sobriété → contrat → efficacité et production », quiz et tableau « sobriété, efficacité, production » | Moyenne | Petit | `cours/contenu/etape-7.js:14-17` et quiz Q1, `cours/schemas/agir.js` | Harmoniser (intégrer le contrat au quiz et au tableau, ou expliquer qu'il est hors hiérarchie) |
| P6 | Infobulles absentes de Comprendre et d'Approfondir aux étapes 3 et 4 (et en Comprendre aux étapes 6 et 7) ; 16 termes du glossaire jamais liés (utc, horodatage, turpe, accise, cadran, hp-hc, ratio, seuil-alerte, kwc…) | Moyenne | Moyen | `cours/contenu/etape-3.js`, `etape-4.js`, `etape-6.js`, `etape-7.js`, `etape-2.js` | Lier `{{terme}}` à la première occurrence dans chaque onglet ; ajouter un test qui le vérifie |
| P7 | Termes absents du glossaire : périmètre, dérive, pointe, anomalie, indicateur, plan d'action, PCI, R², régression, persistance, API, COSTIC, consigne, réduit, LED, HT/TTC, Σ, Pareto, gisement, médiane | Moyenne | Moyen | `commun/donnees/glossaire.js`, `cours/demos/signature.js`, `seuil-detection.js`, `cours/pages/patrimoine.js`, `etape-5.js`, `etape-8.js` | Créer les entrées (au moins les 6 notions du cycle et PCI/PCS) ; développer COSTIC ; expliquer Σ en mots |
| P8 | Notions utilisées avant d'être expliquées : talon et DJU dans la fiche de cadrage de l'étape 1, « Contrat de 60 kVA » dans la démo de l'étape 1, GRDF/Enedis dès l'étape 1 | Moyenne | Petit | `cours/demos/perimetre.js:15,26,37`, `cours/demos/cadrer.js` | Infobulles, ou mention « (vu à l'étape 5) » |
| P9 | Promesse « 30 secondes » contre 231 à 442 mots plus une démo ; 33 termes dans « Les mots de cette étape » à l'étape 2 | Moyenne | Petit | `cours/pages/accueil.js:60`, `cours/pages/etape.js:43-45` | Annoncer « 2 à 5 min » ; limiter la liste aux termes de l'Essentiel et mettre le reste en « Voir tous les termes » |
| P10 | Approfondir de l'étape 2 très dense (1 037 mots, 4,6 écrans, 10 phrases de plus de 25 mots, taux 2026, API v2/v5) | Moyenne | Moyen | `cours/contenu/etape-2.js` | Replier les encadrés « verifier » et « qa » dans des `<details>`, marquer « facultatif », scinder accès Enedis / GRDF / facture |
| P11 | Peu de transitions explicites entre étapes (seulement 6 → 3 et 8 → 1) ; le pager ne donne qu'un titre | Faible à moyenne | Petit à moyen | `cours/contenu/etape-*.js`, `cours/pages/etape.js:136-139` | Ajouter `transition` : « Tu sais maintenant X. Prochaine étape : Y, parce que… » dans le pager |
| P12 | Pas de bouton Comprendre → Approfondir | Faible | Petit | `cours/pages/etape.js` | Ajouter « Passer à Approfondir » en fin de Comprendre |
| P13 | Petites divergences de chiffres : 1 220 contre 1 290 €/an (−1 °C), 27 contre 30 €/an (58 kVA), facteur CO2 du gaz 0,204 contre 0,227 PCI non expliqué, 196 000 contre 196 157 | Faible | Petit | `cours/contenu/etape-7.js:56-65,76-80`, `cours/demos/agir.js`, `cours/contenu/etape-8.js:102`, `cours/pages/patrimoine.js:47`, `etape-5.js:112` | Harmoniser, ou dire « hypothèses différentes » ; expliquer PCS/PCI en une phrase |
| P14 | « Dans ce jeu… réglages du laboratoire » dans la démo de l'étape 3 | Faible | Petit | `cours/demos/fiabiliser.js:190` | « Dans cette démo… quels que soient les réglages du laboratoire (page L'école) », avec un lien |
| P15 | Aucune autoévaluation dans l'Essentiel pour 5 étapes sur 8 ; mini-quiz uniquement en fin d'Approfondir | Faible à moyenne | Moyen | `cours/pages/etape.js`, `cours/contenu/etape-*.js` | 1 ou 2 questions éclair en fin d'Essentiel (réutiliser les questions du quiz final de l'étape) |
| P16 | IPMVP sous une seule forme ; consentement sans schéma ; signature énergétique sans schéma statique | Faible | Moyen | `cours/contenu/etape-8.js`, `etape-2.js`, `cours/schemas/` | Schéma « qui consent à qui » ; mini-schéma de la droite de signature ; un exemple ou une question sur l'IPMVP, ou retirer le sigle |
| P17 | Aucune image réelle ni audio/vidéo | Faible (SUPPOSITION sur l'apport) | Moyen à grand | `cours/` (nouveaux fichiers) | Photos de compteurs Linky et Gazpar, vraie facture anonymisée ; vidéo optionnelle de 1 min par famille |
| P18 | Encadrés « Pour tester le logiciel » : listes de 35 à 54 mots, utiles aux testeurs seulement ; public cible ambigu (dev/test contre tous les salariés) | Faible (selon le public) | Petit | `cours/contenu/etape-*.js` (blocs `ton: "qa"`), `cours/pages/accueil.js:34` | Fixer le public ; mettre ces encadrés en liste à puces repliable |
| P19 | Patrimoine et quiz final hors progression | Faible | Petit | `cours/principal.js:58-70`, `cours/pages/accueil.js` | Ligne « Bonus » dans le tableau de progression |

**À confirmer par des tests avec de vrais apprenants** : temps réel par niveau (P9), compréhension du schéma de l'étape 8 (P1), usage réel des infobulles et du glossaire (P6, P7), utilité des encadrés « tester » selon le profil (P18), apport d'images réelles (P17), et ressenti de redite ou de continuité entre étapes (P11).

### 3.2 Axe 2 : accessibilité (RGAA 4.1.2)

#### 3.2.1 Référentiel et méthode

**Référentiel** : RGAA 4.1.2, la version en vigueur (13 thématiques, 106 critères). La DINUM annonce le RGAA 5 pour fin 2026, mais il n'est pas en vigueur et n'est pas utilisé ici. J'ai repris de mémoire les numéros et les intitulés courts des critères. Deux libellés sont signalés « à vérifier » : 4.11 à 4.13 et 11.12 (le sens est sûr, la formulation exacte peut différer).

**Ce que veut dire chaque statut** :
- **Conforme (C)** : aucun défaut trouvé par les tests automatiques, les tests scriptés et la lecture du code. Une restitution par lecteur d'écran n'a pas été faite.
- **Non conforme (NC)** : au moins un défaut **constaté**, avec sa localisation.
- **Non applicable (NA)** : la page ne contient pas ce type de contenu.
- **Non vérifiable (NV)** : il faut un test humain, ou un comportement côté serveur.

**Méthode** (scripts dans `audit/` : `axe.mjs`, `clavier.mjs`, `contraste-svg.mjs`, `divers.mjs`, `compte.mjs` ; résultats bruts dans `axe-resultats.json`, `clavier.json`, `contraste.json`, `divers.json`) :
1. **axe-core 4.10.2**, injecté dans Chromium (Playwright) avec les règles wcag2a/aa, wcag21a/aa, wcag22aa et best-practice. Il a tourné sur **30 vues** (accueil, école, glossaire, quiz final, sources, patrimoine, puis les 8 étapes × 3 onglets), chacune dans **4 configurations** : 1280 px clair, 1280 px sombre, 390 px clair, 390 px sombre. Cela fait **120 analyses**, sans aucune erreur JavaScript.
2. **Clavier**, avec de vraies frappes de touches :
   - parcours Tab complet de chaque vue, avec relevé de l'ordre, du style de focus (outline et ombre), de la visibilité et des pièges ;
   - lien d'évitement ;
   - onglets au clavier (flèches, Origine) ;
   - quiz, exemple pas à pas, tiroir du glossaire, fenêtre « Mon compte », graphique SVG au clavier, menu en mobile.
3. **Reflow et zoom** :
   - largeur 320 px ;
   - 640 px avec un facteur 2, qui équivaut au zoom 200 % sur une fenêtre de 1280 px ;
   - 320×225, qui équivaut au zoom 400 % ;
   - hauteur 256 px ;
   - police racine à 200 % ;
   - espacement du texte (WCAG 1.4.12) injecté en CSS.
4. **Contrastes** :
   - axe sur le HTML ;
   - script maison pour les textes SVG : rendu par pixels, avec le fond échantillonné une fois les textes masqués, dans les deux thèmes ;
   - calcul des contrastes non textuels à partir des jetons de `commun/styles/jetons.css`.
5. **Inventaire du DOM rendu** : id en double, références ARIA cassées, titres, alternatives des images, liens, tableaux, champs et étiquettes, régions live, anglicismes.
6. **Lecture du code** des fichiers suivants : `principal.js`, `coquille/*.js`, `blocs/*.js`, `pages/*.js`, une quinzaine de démos, `schemas/outils.js`, `commun/fenetre-compte.js`, `commun/graphiques/barres.js`, CSS.

**Limites.** Aucun test n'a été fait avec NVDA, JAWS, VoiceOver ou TalkBack. Les démos ont été testées dans leur état initial, sans parcourir tous leurs états. Les pages sous-jacentes au jeu n'ont pas été testées. Le taux calculé plus bas n'a **pas valeur de déclaration de conformité**.

Dans tout le document, **CONSTAT** désigne un fait mesuré ou lu dans le code, et **SUPPOSITION** une inférence non vérifiée.

---

#### 3.2.2 Résultats axe-core (120 analyses)

| Règle axe (tags) | Impact | Nœuds (toutes config.) | Vues concernées | Exemple / cause | RGAA |
|---|---|---|---|---|---|
| `color-contrast` (wcag143) | sérieux | 144 (thème **clair** uniquement : 78 en 1280 px, 66 en 390 px ; **0 en sombre**) | accueil, sources, étape 2 (3 onglets), étape 3 essentiel/comprendre | `.sources .quand` (dates des sources) : #758297 sur #f5f7fb = **3,62:1**, à cause de `opacity:.75` (`cours/styles/niveaux.css:426-429`) ; `.badge.ok` (« Disponible », « ok ») : #17803d sur #e2f4e8 = **4,37:1**, 13 px gras (`cours/styles/elements.css:35`) ; `.controle .etat` « aucun » : #17803d sur #eef2f8 = **4,45:1** (`cours/demos/fiabiliser.js:355`) | 3.2 |
| `aria-prohibited-attr` (wcag412) | sérieux | 8 (+192 « incomplets ») | étape 2 essentiel (+ toutes les vues pour `#progress`) | `<span class="jauge" aria-label="3 sur 5">` (`cours/demos/collecter.js:65`) ; incomplets : `div#progress[aria-label]` (`cours/principal.js:50`), cellules `span[aria-label="… : fait"]` (`cours/pages/accueil.js:137-138`), `div#pioche[aria-label]` (`cours/demos/cadrer.js:100`) | 7.1, 8.2, 10.10 |
| `scrollable-region-focusable` (wcag211) | sérieux | 26 (390 px uniquement) | école, étapes 1c, 2c, 3c/a, 4a, 5a, 6a, 8a | `.table-wrap` qui défile horizontalement sans être focusable ; `#cs-console` | 7.3 (voir SUPPOSITION dans la thématique 7) |
| `heading-order` (best-practice) | modéré | 96 | 24 vues (toutes les étapes, glossaire, patrimoine) | `h1` puis `h3` (analogie, blocs des onglets, entrées du glossaire) | 9.1 |
| `landmark-unique` (best-practice) | modéré | 16 | étapes 1a, 2a, 5a, 8a | plusieurs `<aside class="encadre">` sans nom (`cours/blocs/blocs.js:388`) | 9.2 / 8.9 (mineur) |
| `landmark-complementary-is-top-level` | modéré | 4 | étape 2 approfondir | `<aside class="panneau" aria-live>` imbriqué (démo anatomie-facture) | 8.9 (mineur) |
| `empty-table-header` (best-practice) | mineur | 4 | étape 2 approfondir | `<th></th>` vide. **CONSTAT** : le même `<th></th>` existe dans *tous* les tableaux des graphiques (`cours/blocs/graphique.js:212`), mais axe ne les voit pas car ils sont dans un `<details>` fermé | 5.6 |
| `target-size` (wcag22aa) | sérieux | 158 | étape 2 (3 onglets) | appels de note `.appel` de 13 à 17 px | **hors RGAA 4.1.2** (WCAG 2.2) : pour information |

Résultats « incomplets » : 1 588 nœuds `color-contrast` que axe n'a pas pu trancher, presque tous des textes SVG (schémas, axes des graphiques). Mon script par pixels les a repris. Un seul texte SVG reste sous le seuil : « m³ » blanc sur orange #ff5e11, **3,06:1**, 14 px (`cours/schemas/vignette-ecole.js:11` → `dessinCompteur` dans `cours/schemas/outils.js`), sur l'accueil en thème clair.

Lecture : **le thème sombre ne présente aucun défaut de contraste détecté**, et les défauts du thème clair sont proches du seuil, à l'exception des dates des sources (3,62:1).

---

#### 3.2.3 Grille des 106 critères

##### Thématique 1 : Images (9 critères)

| N° | Intitulé court | Statut | Preuve / élément fautif | Test manuel à faire |
|---|---|---|---|---|
| 1.1 | Image porteuse d'information : alternative textuelle | C | CONSTAT : les schémas sont des `<svg role="img" aria-label>` (`cours/schemas/outils.js:10`, `modele.js:15`, `vignette-ecole.js:7`), le cycle est un `svg aria-labelledby` + `<title>` (`schemas/cycle.js:65-66`), les graphiques des `svg role="img" aria-label=description` (`blocs/graphique.js:193-195`) et les barres empilées des `div role="img" aria-label` (`demos/indicateurs.js:52`, `usages.js:32`, `anatomie-facture.js:117`). L'inventaire des 30 vues ne trouve aucun SVG visible sans alternative ni `aria-hidden`. | NVDA/VoiceOver : vérifier la restitution des `svg role=img` dans Firefox et Safari. |
| 1.2 | Image de décoration ignorée par les technologies d'assistance | C | CONSTAT : les icônes sont en `aria-hidden="true" focusable="false"` (`blocs/icones.js:4-5`), le logo en `aria-hidden` (`principal.js:32`), le canvas de l'avatar en `aria-hidden` (`coquille/jeu.js:15-19`), et « € » en `aria-hidden` (`pages/patrimoine.js:51`). | — |
| 1.3 | Alternative pertinente | C | CONSTAT : les 33 alternatives relevées sont descriptives (ex. « Schéma : une courbe avec un trou et un pic aberrant, repérés par des contrôles »). Elles se mettent à jour avec l'état (« Fournisseur 54 %, Réseaux 20 %, Taxes 26 % »). | Vérifier humainement la pertinence de chaque schéma par rapport à sa légende. |
| 1.4 | CAPTCHA / image-test : alternative identifiant la nature | NA | Aucun CAPTCHA. | — |
| 1.5 | CAPTCHA : solution d'accès alternative | NA | Aucun CAPTCHA. | — |
| 1.6 | Description détaillée si nécessaire | **NC** | CONSTAT : 6 graphiques complexes n'ont **ni tableau de données ni description détaillée**, seulement une étiquette courte. Le tableau n'est produit que si `x.n <= 60` (`blocs/graphique.js:206`). Graphiques concernés : courbe de charge « semaine du 5 janv. » (étape 2), « courbe de charge brute du mardi 18 novembre 2025 » (étape 3), « semaine au pas 10 min » (étape 4), « semaine avec le niveau du talon » (étape 5), « consommation électrique journalière, référence et jours en alerte » (étape 6 Comprendre). Les valeurs ne sont lisibles qu'au survol ou aux flèches, via une infobulle non restituée (voir 7.1). | Avec NVDA : vérifier qu'on peut connaître les informations clés (talon, pic, jours en alerte) sans voir la courbe. |
| 1.7 | Description détaillée pertinente | **NC** | CONSTAT : le tableau du « Nuage de points : consommation de gaz… en fonction des DJU » exclut les séries `type:"points"` (`blocs/graphique.js:204`). Il ne donne que les droites de régression, pas les points. Les marqueurs, seuils (`lignesH`) et zones (« dérive active ») ne figurent dans aucun tableau. Tous ces tableaux ont aussi un `<th>` vide en première colonne. | Comparer chaque tableau au graphique. |
| 1.8 | Image texte remplacée par du texte stylé | C | CONSTAT : il n'y a aucune image matricielle de texte (aucun `<img>` dans le périmètre). Les textes des schémas sont de vrais `<text>` SVG. | — |
| 1.9 | Légende d'image correctement reliée | **NC** | CONSTAT : `<figure class="schema">` + `<figcaption>`, sans `role="figure"`/`"group"` ni `aria-label` reprenant la légende, comme le demande le test 1.9.1 du RGAA 4.1. Emplacements : `pages/etape.js:77-80`, `blocs/blocs.js:403`, `pages/patrimoine.js:53-57`. | — |

##### Thématique 2 : Cadres (2 critères)

| N° | Intitulé court | Statut | Preuve | Test manuel |
|---|---|---|---|---|
| 2.1 | Chaque cadre a un titre | NA | Aucun `<iframe>`/`<frame>` (recherche dans `cours/`, `commun/`, `index.html`). | — |
| 2.2 | Titre de cadre pertinent | NA | Idem. | — |

##### Thématique 3 : Couleurs (3 critères)

| N° | Intitulé court | Statut | Preuve / élément fautif | Test manuel |
|---|---|---|---|---|
| 3.1 | Information pas donnée uniquement par la couleur | **NC** (faible) | CONSTAT, d'interprétation : dans la barre des 8 étapes, la famille (Data/Énergie) n'est donnée que par la couleur (`.fam-data`/`.fam-energie`, `principal.js:70`). La barre de progression sépare Data et Énergie par la seule couleur (`principal.js:51,64-65`), avec un texte qui ne donne que le total. Points corrects : le quiz affiche icône et « Exact./Pas tout à fait. » (`blocs/quiz.js:244`), cadrer affiche ✓/✗ (`demos/cadrer.js:117`), les courbes de référence sont en tirets et les jours en alerte ont des marqueurs (`demos/seuil-detection.js:165-180`), les KPI ont un libellé texte. | Passer les 27 démos en niveaux de gris, dans tous leurs états. |
| 3.2 | Contraste texte / fond suffisant | **NC** | CONSTAT, en thème clair : dates des sources **3,62:1** (`styles/niveaux.css:426-429`, `opacity:.75`) ; `.badge.ok` **4,37:1** (`styles/elements.css:35`) ; « aucun » vert sur `--surface-2` **4,45:1** (`demos/fiabiliser.js:355`) ; « m³ » blanc sur `--energie` **3,06:1**, texte d'image (`schemas/vignette-ecole.js:11`). Thème sombre : 0 défaut. | Contrôle à la pipette (Colour Contrast Analyser) sur les états survol/actif et sur les démos après manipulation. |
| 3.3 | Contraste des composants d'interface et éléments graphiques (3:1) | **NC** | CONSTAT, calculé à partir des jetons : bordure des champs `select`/`input` (number, search, text) = `--line` sur `--surface` : **1,36:1** en clair et 1,41:1 en sombre (`styles/controles.css:57-68`). Piste de l'interrupteur à l'état non coché = `--line` : **1,36:1**, état « non coché » peu perceptible (`styles/controles.css:93-99`). Points corrects : séries des graphiques `--energie` 3,06:1, `--data` 11,3:1. | Mesurer les curseurs `range` (rendu natif avec `accent-color`) et l'état `aria-pressed` des boutons segmentés. |

##### Thématique 4 : Multimédia (13 critères)

| N° | Intitulé court | Statut | Preuve | Test manuel |
|---|---|---|---|---|
| 4.1 | Média temporel : transcription / audiodescription | NA | Aucun `<video>`/`<audio>` ni lecteur intégré. | — |
| 4.2 | Transcription / audiodescription pertinente | NA | Idem. | — |
| 4.3 | Sous-titres synchronisés | NA | Idem. | — |
| 4.4 | Sous-titres pertinents | NA | Idem. | — |
| 4.5 | Audiodescription synchronisée | NA | Idem. | — |
| 4.6 | Audiodescription pertinente | NA | Idem. | — |
| 4.7 | Média temporel clairement identifiable | NA | Idem. | — |
| 4.8 | Média non temporel : alternative | NA | Les démos sont des scripts HTML (thématique 7), pas des médias non temporels. | — |
| 4.9 | Alternative au média non temporel pertinente | NA | Idem. | — |
| 4.10 | Son déclenché automatiquement contrôlable | NA | Aucun son. | — |
| 4.11 | Média temporel contrôlable au clavier et au pointeur (intitulé à vérifier) | NA | Aucun média. | — |
| 4.12 | Média non temporel contrôlable au clavier et au pointeur (intitulé à vérifier) | NA | Aucun média. | — |
| 4.13 | Média compatible avec les technologies d'assistance (intitulé à vérifier) | NA | Aucun média. | — |

##### Thématique 5 : Tableaux (8 critères)

| N° | Intitulé court | Statut | Preuve / élément fautif | Test manuel |
|---|---|---|---|---|
| 5.1 | Tableau de données complexe : résumé | NA | CONSTAT : les 36 tableaux relevés n'ont qu'une ligne d'en-têtes. | — |
| 5.2 | Résumé pertinent | NA | Idem. | — |
| 5.3 | Tableau de mise en forme : linéarisation compréhensible | NA | Aucun tableau de mise en forme. | — |
| 5.4 | Titre de tableau de données correctement associé | **NC** | CONSTAT : **aucun** tableau n'a de `<caption>`, d'`aria-label`, d'`aria-labelledby` ou de `title` (36 sur 36). Le titre visuel est un `<h3>` voisin non relié (`blocs/blocs.js:391`) ou un `<summary>` « Voir les données en tableau » (`blocs/graphique.js:212`). Exemples : accueil « Ta progression » (`pages/accueil.js:92`), école (3 tableaux). | — |
| 5.5 | Titre de tableau pertinent | NA | Aucun titre n'est associé (voir 5.4). | Une fois 5.4 corrigé, vérifier la pertinence. |
| 5.6 | En-têtes de colonne et de ligne correctement déclarés | **NC** | CONSTAT : (a) les tableaux des graphiques ont un `<th></th>` vide, et les étiquettes de ligne (mois, heures) sont des `<td>` (`blocs/graphique.js:212-217`) ; (b) dans `tab-texte`, la 1re colonne qui nomme la ligne est un `<td class="col1">` (`blocs/blocs.js:391`) ; (c) dans « Ta progression », la colonne Étape est en `<td>` (`pages/accueil.js:142`). | Vérifier tableau par tableau si la 1re colonne est bien un en-tête de ligne. |
| 5.7 | Technique d'association cellules / en-têtes appropriée | C | CONSTAT : tableaux simples avec des `<th>` en `<thead>`, association implicite valable. | Recontrôler après l'ajout de `th scope="row"`. |
| 5.8 | Tableau de mise en forme sans éléments de tableau de données | NA | Aucun tableau de mise en forme. | — |

##### Thématique 6 : Liens (2 critères)

| N° | Intitulé court | Statut | Preuve | Test manuel |
|---|---|---|---|---|
| 6.1 | Lien explicite | C | CONSTAT : les intitulés sont explicites (pagination « ← Étape précédente 2. Collecter », `pages/etape.js:124-125`). Les appels de note visibles « 1 » ont l'`aria-label` « Source 1 : éditeur, titre » (`blocs/notes.js:314`) et les nœuds du cycle un `aria-label` complet (« Étape 1, Cadrer (Data et Énergie) : … »). Réserve mineure : le lien du logo, avec `aria-label` « Accueil : l'Energy Management… » (apostrophe droite) alors que le texte visible porte l'apostrophe typographique, n'est pas strictement identique (`principal.js:31`). 214 liens ouvrent un nouvel onglet sans le signaler, ce qui n'est pas exigé par le RGAA 4.1.2 mais est recommandé. | Liste des liens dans NVDA (Insert+F7) ; test avec la commande vocale (Voice Control) sur les nœuds du cycle. |
| 6.2 | Chaque lien a un intitulé | C | CONSTAT : axe ne relève aucune violation `link-name` sur 120 analyses. | — |

##### Thématique 7 : Scripts (5 critères)

| N° | Intitulé court | Statut | Preuve / élément fautif | Test manuel |
|---|---|---|---|---|
| 7.1 | Script compatible avec les technologies d'assistance | **NC** | CONSTATS : <br>(1) **Fenêtre « Mon compte »** : `focus()` est appelé *avant* que la fenêtre soit insérée dans la page (`commun/fenetre-compte.js:100` puis `162-164`). Mesuré : le focus reste sur `#btn-compte`, et 8 Tab successifs restent hors de la fenêtre modale (`aria-modal="true"`). Ses « onglets » `role="tab"` n'ont ni `tablist` complet, ni `tabpanel`, ni `aria-controls`, ni flèches, et sont tous deux dans l'ordre de tabulation (`:75-77`). <br>(2) **Graphiques** : `svg role="img" tabindex="0"` piloté aux flèches (`blocs/graphique.js:193-195,272-284`). L'infobulle `.tip` n'est pas une région live (mesuré : `aria-live` = null), et les valeurs parcourues ne sont pas restituées. <br>(3) **Quiz** : après une réponse, le quiz est entièrement redessiné et `focus()` vise un `<p>` non focusable (`blocs/quiz.js:257`). Mesuré : `document.activeElement` = BODY, même chose dans le quiz final. <br>(4) **Exemple pas à pas** : « Tout afficher » et « Étape suivante » se masquent eux-mêmes (`blocs/blocs.js:441-442`). Mesuré : focus perdu (BODY). <br>(5) `aria-label` sur des `span`/`div` sans rôle, ignoré par une partie des technologies d'assistance : jauges (`demos/collecter.js:65`), cellules de progression (`pages/accueil.js:137-138`), `#progress` (`principal.js:50`), `#pioche` (`demos/cadrer.js:100`). <br>Points corrects : les onglets d'étape suivent le motif ARIA (`role=tablist/tab/tabpanel`, `aria-selected`, tabindex itinérant, ←/→ vérifiés, `pages/etape.js:60-67,129-177`) ; boutons `aria-pressed` ; tiroir du glossaire `role=dialog aria-modal`, avec focus piégé et rendu (vérifié). | NVDA + Firefox et VoiceOver + Safari : quiz, exemple, graphiques, fenêtre compte, curseurs `range` (la valeur annoncée est un indice 0-51 sans `aria-valuetext`, `demos/analyser.js:34`, `consentement.js:73`). |
| 7.2 | Alternative au script pertinente | NA | Le site exige JavaScript (`<noscript>`, `index.html:30`), et aucun script ne propose d'alternative. | — |
| 7.3 | Script contrôlable au clavier et au pointeur | C | CONSTAT : les démos utilisent des contrôles natifs (button, input, select, range). Le glisser-déposer de « Cadrer » a une alternative au clavier (sélection de l'étiquette puis « Placer ici », `demos/cadrer.js:141-163`). Les lignes du Pareto sont focusables (`commun/graphiques/barres.js:57`). Aucun élément `cursor:pointer` non focusable trouvé sur les 30 vues. SUPPOSITION : les `.table-wrap` qui défilent en 390 px ne sont pas focusables (axe `scrollable-region-focusable`) ; Chromium et Firefox récents rendent ces zones focusables d'office, ce qui n'est pas garanti dans Safari. Limite mineure : une étiquette posée ne peut revenir dans la pioche qu'au glisser-déposer ou via « Recommencer ». | Safari + clavier : défilement des tableaux larges en mobile. |
| 7.4 | Changement de contexte : utilisateur averti ou en contrôle | C | CONSTAT : aucun `change`/`input` ne navigue. Les changements de page passent par des liens, et le routeur déplace le focus sur `<main>` (`principal.js:140-148`). Les onglets ne changent pas l'URL. | — |
| 7.5 | Messages de statut correctement restitués | **NC** | CONSTATS : compteur de résultats de la recherche du glossaire `#g-compte` sans région live (`coquille/glossaire.js:315,336`), et page glossaire sans message ; score « x / n répondues » du quiz sans région live (`blocs/quiz.js:248`) ; message éphémère `annoncer()` sans `role=status` (`commun/suivi.js:189-196`) ; 10 démos sans aucune région live (autoconso, changement-heure, collecter, ecart-sources, horodatage, indicateurs, rattachement, signature, trois-voies, usages). SUPPOSITION : le `role="status"` du quiz est inséré déjà rempli dans un DOM recréé (`blocs/quiz.js:244`), il risque de ne pas être annoncé. Points corrects : 17 démos ont un `aria-live` (ex. `demos/cadrer.js:112-113`), le quiz final a `#qf-fin aria-live`, et la fenêtre compte a `role="alert"`. | NVDA/VoiceOver : répondre au quiz, filtrer le glossaire, manipuler chaque démo et noter ce qui est annoncé. |

##### Thématique 8 : Éléments obligatoires (10 critères)

| N° | Intitulé court | Statut | Preuve / élément fautif | Test manuel |
|---|---|---|---|---|
| 8.1 | Type de document défini | C | `<!doctype html>` (`index.html:1`). | — |
| 8.2 | Code source valide | **NC** (faible) | CONSTAT : aucun id en double, aucune référence ARIA cassée, aucun élément interactif imbriqué, aucun `tabindex` positif (30 vues). Mais des attributs ARIA interdits par ARIA in HTML (`aria-label` sur `span`/`div` génériques, voir 7.1-5). SUPPOSITION : la bulle du glossaire retirée laisse `aria-describedby="bulle-glossaire"` sur le bouton, d'où une référence orpheline (`coquille/glossaire.js:264,248`). | Passer le DOM généré au validateur Nu (W3C). |
| 8.3 | Langue par défaut présente | C | `<html lang="fr">` (`index.html:2`), vérifié sur les 30 vues. | — |
| 8.4 | Code de langue pertinent | C | Contenu en français. | — |
| 8.5 | Titre de page présent | C | `document.title` est mis à jour à chaque route (`principal.js:111-135`). | — |
| 8.6 | Titre de page pertinent | C | CONSTAT : 14 titres distincts, par exemple « 2. Collecter · Energy Management ». Les 3 onglets d'une étape partagent le même titre, ce qui reste acceptable. | — |
| 8.7 | Changements de langue indiqués | **NC** (faible, à arbitrer) | CONSTAT : « Energy Management » (titre, accueil, `pages/accueil.js:34`, démo consentement) et « benchmark » (patrimoine) sont écrits sans `lang="en"`. « Baseline », « reporting » et « Wattlings » peuvent passer pour des termes d'usage ou des noms propres. À arbitrer : si « Energy Management » est considéré comme le nom propre de la formation, le critère devient C. | Écouter ces passages avec NVDA en voix française. |
| 8.8 | Code de langue des changements valide | NA | Aucun attribut `lang` de changement. | — |
| 8.9 | Balises pas utilisées à seule fin de présentation | C | CONSTAT : sémantique globalement juste. Réserve : les encadrés « À savoir » et « Attention » sont des `<aside>` (repères complémentaires) dans le corps du texte (`blocs/blocs.js:388`), d'où les alertes axe `landmark-unique` et `landmark-complementary-is-top-level`. | — |
| 8.10 | Changements du sens de lecture signalés | NA | Aucun texte de droite à gauche. | — |

##### Thématique 9 : Structuration de l'information (4 critères)

| N° | Intitulé court | Statut | Preuve / élément fautif | Test manuel |
|---|---|---|---|---|
| 9.1 | Information structurée par des titres appropriés | **NC** | CONSTATS : la hiérarchie est incohérente plutôt que simplement « sautée ». Onglet Essentiel : `h1` → `h3` (Analogie) → `h2` (Démo) (`pages/etape.js:55,74,86`). Onglets Comprendre et Approfondir : les blocs de texte en `h3` sont frères des démos en `h2` (`blocs/blocs.js:380,401`). Glossaire : `h1` → `h3` directement (`coquille/glossaire.js:289`). Des intertitres visuels ne sont pas des titres : « Les mots de cette étape » (`etape.js:94`), « Sources de cette page » (`notes.js:330`), titres d'encadré en `span.eyebrow` (`blocs.js:388`). Point correct : 1 seul `h1` par vue. Note : le RGAA 4.1 tolère les sauts de niveau si la hiérarchie reste logique, ce qui n'est pas le cas ici. | Liste des titres NVDA (Insert+F7) : vérifier que le plan a du sens. |
| 9.2 | Structure du document cohérente (en-tête, navigation, contenu principal) | C | CONSTAT : `header.topbar` (banner), 2 `nav` avec un nom (« Navigation principale », « Les 8 étapes ») + `nav` « Étapes voisines », un `main#contenu` unique. Pas de pied de page. | — |
| 9.3 | Listes correctement structurées | **NC** (faible, d'interprétation) | CONSTAT : la navigation principale (7 liens) et la barre des 8 étapes (suite ordonnée) sont des `<a>` juxtaposés sans `ul`/`ol` (`principal.js:36-44,68-71`). Les termes de l'étape (`etape.js:95`) aussi. Points corrects : contenus en `ul`/`ol` (à retenir, quiz `ol`, pas à pas `ol`). | — |
| 9.4 | Citations correctement indiquées | NA | Aucun `blockquote`/`q` et aucune citation identifiée. | Relire les contenus pour repérer d'éventuelles citations de textes réglementaires. |

##### Thématique 10 : Présentation de l'information (14 critères)

| N° | Intitulé court | Statut | Preuve / élément fautif | Test manuel |
|---|---|---|---|---|
| 10.1 | Feuilles de style utilisées pour la présentation | C | CONSTAT : aucune balise ou attribut de présentation (les `width`/`height` sont réservés aux `svg`). Les `style=""` en ligne restent du CSS. | — |
| 10.2 | Contenu visible présent sans CSS | **NC** | CONSTAT : l'état « étape terminée » de la barre n'existe qu'en CSS (`content:"✓"` + numéro masqué, `styles/coquille.css:135-140`). Le préfixe « À l’école : » des exemples du glossaire est généré en CSS (`styles/glossaire.css:135`). | Désactiver les CSS (Web Developer) et relire. |
| 10.3 | Information compréhensible sans CSS | NV | SUPPOSITION : l'ordre du DOM suit l'ordre visuel (le parcours Tab est cohérent), mais les barres du Pareto et les barres empilées perdent leurs proportions. Les valeurs restent en texte. | Désactiver les CSS sur chaque vue. |
| 10.4 | Texte lisible à 200 % | **NC** (faible) | CONSTAT : à un zoom équivalent à 200 % (640 px CSS), 5 noms de sites du Pareto et du benchmark sont **tronqués par une ellipse** (`.pc-l { white-space:nowrap; text-overflow:ellipsis }`, `commun/graphiques/graphiques.css:55-59`), par exemple « 4. Groupe scolaire Victor… ». Le nom complet n'existe que dans l'infobulle. Les autres vues ne présentent ni coupure ni défilement horizontal. | Zoom 200 % réel dans Firefox et Safari, et zoom texte seul dans Firefox. |
| 10.5 | Couleurs de police et de fond correctement déclarées | C | CONSTAT : `body { background: var(--bg); color: var(--ink) }` (`styles/base.css:14-17`), et les composants déclarent les deux. | Test avec une feuille de style utilisateur (couleurs forcées / contraste élevé Windows). |
| 10.6 | Liens visibles par rapport au texte | C | CONSTAT : les liens du texte sont soulignés par défaut, les appels de note sont des pastilles, et les termes du glossaire ont un soulignement pointillé (`styles/glossaire.css:3-11`). | — |
| 10.7 | Focus visible | **NC** | CONSTATS : les lignes focusables du Pareto et du benchmark (`div.pc-row tabindex=0`, 25 éléments) ont `outline:none` et ne changent que de fond (`--surface-2` sur `--surface` = **1,12:1**, `commun/graphiques/graphiques.css:50-54`). Le contour de focus global est de 3 px orange #ff5e11 (`styles/base.css:56-60`), avec un contraste de **2,85:1** sur `--bg` et 2,72:1 sur `--surface-2` en thème clair (5,2 à 6,3:1 en sombre). Points corrects : contour présent sur tous les autres éléments du parcours Tab (relevé sur les 30 vues), nœuds du cycle signalés par un anneau orange (`styles/accueil.css:78-83`). | Contrôle visuel du focus sur chaque composant, en clair et en sombre. |
| 10.8 | Contenus cachés ignorés par les technologies d'assistance | C | CONSTAT : les onglets inactifs sont en `hidden`, le menu mobile replié en `display:none` (mesuré), la classe `.sr` est utilisée à bon escient, et axe ne relève aucune violation `aria-hidden-focus`. | — |
| 10.9 | Information pas donnée uniquement par la forme, la taille ou la position | C | CONSTAT : une alternative est prévue partout (légendes texte du benchmark avec valeurs, ▲/✓/● + libellé dans `barres.js:66-68`, jauges avec `aria-label`). | — |
| 10.10 | 10.9 implémenté de façon pertinente | **NC** | CONSTAT : l'alternative des jauges « 3 sur 5 » (pastilles pleines) passe par un `aria-label` sur un `span` générique, que la spécification interdit et qui n'est pas restitué de façon fiable (`demos/collecter.js:65`, signalé par axe). | NVDA/VoiceOver sur la démo de l'étape 2. |
| 10.11 | Pas de défilement dans deux dimensions à 320 px | **NC** (faible) | CONSTAT : à 320 px (et à 320×225), **aucune vue n'a de défilement horizontal**, et les tableaux défilent dans leur conteneur, ce que l'exception autorise. Mais il y a une perte d'information : 17 noms de sites du Pareto sont tronqués (`graphiques.css:55-59`). À 1024×256, la barre du haut collante occupe 112 px sur 256 : ce n'est pas un défaut, mais c'est gênant. | Zoom 400 % réel. |
| 10.12 | Espacement du texte modifiable sans perte | **NC** | CONSTAT, avec l'espacement WCAG 1.4.12 injecté : les pourcentages des barres empilées sont coupés (« 54 % », « 20 % », « 26 % » à l'étape 2 Approfondir et « 29 % / 71 % » à l'étape 8 Comprendre, `.barre-empilee span`, `styles/niveaux.css:291-300`). Les noms du Pareto sont coupés. La démo « Produire son électricité » est rognée (`.demo { overflow:hidden }`, `styles/etape.css:165-169`). | Bookmarklet « text spacing » sur chaque démo. |
| 10.13 | Contenus additionnels au survol ou au focus contrôlables | **NC** | CONSTATS : la bulle du glossaire se ferme dès que le pointeur quitte le terme (`pointerout`, `coquille/glossaire.js:388-393`), on ne peut donc pas la survoler, ce qui contrevient à l'exigence de contenu survolable. L'infobulle des graphiques (`blocs/graphique.js:268-284`) et celle du Pareto (`barres.js:37-40`) ne se ferment pas avec Échap. Point correct : la bulle du glossaire se ferme avec Échap. | Souris + loupe 200 % sur les termes et les graphiques. |
| 10.14 | Contenus additionnels apparus via CSS accessibles au clavier | NA | CONSTAT : aucun contenu n'est révélé par `:hover` seul en CSS. Les infobulles sont en JavaScript (critère 12.11). | — |

##### Thématique 11 : Formulaires (13 critères)

| N° | Intitulé court | Statut | Preuve / élément fautif | Test manuel |
|---|---|---|---|---|
| 11.1 | Chaque champ a une étiquette | **NC** | CONSTAT : tous les champs ont un nom accessible (inventaire des 30 vues : aucun « AUCUNE »). Mais le champ de la démo « Valide un identifiant » n'a **qu'une étiquette masquée** (`label.sr` « Identifiant », `demos/identifiants.js:56`), sans texte visible accolé ni `title`, ce qui ne satisfait pas le test 11.1.3. Les champs de recherche du glossaire n'ont qu'un placeholder visible (`coquille/glossaire.js:313-314`, `pages/glossaire.js:18-19`). Le select « Durée » est correct grâce à la légende visible « Pour combien de temps ? » (`demos/consentement.js:67-68`). | — |
| 11.2 | Étiquette pertinente | C | CONSTAT : les étiquettes sont descriptives et contiennent la valeur courante (« Seuil : écart de plus de 10 % au-dessus de la référence »). | — |
| 11.3 | Étiquettes cohérentes pour une même fonction | C | « Rechercher un terme » dans le tiroir comme dans la page. | — |
| 11.4 | Étiquette et champ accolés | C | CONSTAT : `.field` empile l'étiquette au-dessus du champ (`styles/controles.css:51-56`), les `label.check` et `label.switch` enveloppent le champ. | — |
| 11.5 | Champs de même nature regroupés | **NC** | CONSTAT : des listes de cases à cocher sœurs n'ont ni `fieldset` ni `role=group` : dérives de l'étape 6 (4 cases `dt-*`), plan d'action de l'étape 7 (`ac-*`, `demos/agir.js:128-129`), compteurs de l'étape 4 (`ag-*`), anomalies de l'étape 3 (`es-*`). Point correct : la démo consentement utilise des `fieldset` + `legend` (`demos/consentement.js:53-70`), et les boutons segmentés ont `role=group` + nom. | — |
| 11.6 | Regroupement doté d'une légende | C | Les `fieldset` ont une `legend`, les `role=group` un `aria-label`/`labelledby`. | — |
| 11.7 | Légende pertinente | C | Ex. « Sur quels points ? », « Quelles données ? ». | — |
| 11.8 | Items de même nature d'une liste de choix regroupés | C | Les `select` (mois, durée) sont courts et homogènes, `optgroup` est inutile. | — |
| 11.9 | Intitulé de bouton pertinent | C | CONSTAT : boutons icônes avec `aria-label` (thème « Passer en mode sombre », `coquille/theme.js:28-31` ; fermer ; Glossaire), « Menu » visible. « Placer ici » ×2 est contextualisé par le groupe nommé (`demos/cadrer.js:105-108`). | — |
| 11.10 | Contrôle de saisie pertinent | C | CONSTAT : fenêtre compte avec `required`, erreur en `role="alert"` qui nomme les champs (« Remplis l'identifiant et le mot de passe. », `commun/fenetre-compte.js:87,108`) et format indiqué sous le champ. Réserve : l'indication de format (`<small>`) n'est pas reliée par `aria-describedby`, et il n'y a pas d'`aria-invalid`. | Soumettre les formulaires vides ou invalides avec NVDA. |
| 11.11 | Suggestions de correction | NV | Les messages d'erreur serveur viennent de `messageErreur(err)` (`commun/compte.js`), dont le contenu dépend du serveur. | Provoquer chaque erreur serveur (identifiant pris, format invalide). |
| 11.12 | Données personnelles modifiables, supprimables ou confirmées (intitulé à vérifier) | NV | La création de compte est confirmée par un double mot de passe ; l'existence d'une suppression ou modification du compte n'a pas été trouvée côté client. | Vérifier le parcours de compte complet. |
| 11.13 | Finalité d'un champ déductible (autocomplete) | C | `autocomplete="username"`, `current-password`/`new-password` (`commun/fenetre-compte.js:81,84,86`). Les champs des démos ne portent pas de données de l'utilisateur. | — |

##### Thématique 12 : Navigation (11 critères)

| N° | Intitulé court | Statut | Preuve / élément fautif | Test manuel |
|---|---|---|---|---|
| 12.1 | Au moins deux systèmes de navigation | **NC** | CONSTAT : il y a un menu (et le bandeau des étapes, qui est aussi un menu), mais **ni plan du site ni moteur de recherche** du site. La recherche du glossaire ne filtre que les termes. | — |
| 12.2 | Menus et barres de navigation identiques et à la même place | C | Une coquille commune (`principal.js:27-57`) sur toutes les vues. | — |
| 12.3 | Plan du site pertinent | NA | Pas de plan du site. | — |
| 12.4 | Plan du site atteignable de manière identique | NA | Idem. | — |
| 12.5 | Moteur de recherche atteignable de manière identique | NA | Pas de moteur de recherche du site. | — |
| 12.6 | Zones de regroupement atteignables ou évitables | C | Repères banner, navigation et main (voir 9.2). | — |
| 12.7 | Lien d'évitement ou d'accès rapide | C | CONSTAT : `a.skip` « Aller au contenu » est le 1er élément focusable, visible au focus (8,8 px), et Entrée envoie le focus sur `main#contenu` (mesuré). Source : `principal.js:28`, `styles/base.css:96-107`. | — |
| 12.8 | Ordre de tabulation cohérent | **NC** | CONSTATS : fenêtre « Mon compte » : le focus n'entre pas dans la fenêtre modale et la tabulation parcourt la page derrière (mesuré, voir 7.1). Quiz et exemple pas à pas : focus perdu (BODY). Chromium reprend toutefois au même endroit, le Tab suivant atteint le bouton de la question en cours. Points corrects : ordre logique sur les 30 vues, et menu mobile replié retiré de l'ordre de tabulation (mesuré). | Firefox/Safari : où va le Tab après une réponse au quiz. |
| 12.9 | Pas de piège au clavier | C | CONSTAT : le parcours Tab boucle sur toutes les vues. Le tiroir du glossaire piège volontairement le focus mais se ferme avec Échap ou le bouton, puis rend le focus au déclencheur (mesuré). | — |
| 12.10 | Raccourcis clavier simples contrôlables | NA | Aucun raccourci d'une touche (seulement Échap et les flèches sur l'élément focalisé). | — |
| 12.11 | Contenus additionnels au survol ou au focus atteignables au clavier | C | CONSTAT : la bulle du glossaire s'ouvre au focus (`aria-describedby`, mesuré), l'infobulle des graphiques aux flèches (mesuré) et celle du Pareto au focus. | — |

##### Thématique 13 : Consultation (12 critères)

| N° | Intitulé court | Statut | Preuve / élément fautif | Test manuel |
|---|---|---|---|---|
| 13.1 | Contrôle des limites de temps | NA | Aucune limite de temps. Réserve : le message éphémère `annoncer()` disparaît après 3,5 s (`commun/suivi.js:195`), ce qui ne bloque pas l'utilisateur mais n'est pas restitué (voir 7.5). | — |
| 13.2 | Pas d'ouverture de fenêtre sans action de l'utilisateur | C | Aucun `window.open` automatique. | — |
| 13.3 | Document en téléchargement : version accessible | NA | Le site ne propose pas de document. Les PDF liés (ADEME, Enedis) sont des contenus tiers. | Si des PDF maison sont ajoutés, les vérifier. |
| 13.4 | Version accessible pertinente | NA | Idem. | — |
| 13.5 | Contenu cryptique : alternative | C | CONSTAT : les symboles (↗, ▲, ✓/✗, ←/→) sont toujours accompagnés d'un texte, et les sigles (kWc, DJU, M&V) sont expliqués dans le glossaire. | — |
| 13.6 | Alternative au contenu cryptique pertinente | NA | Aucun contenu cryptique sans texte. | — |
| 13.7 | Pas de flashs ni de changements brusques de luminosité | NA | Aucun flash ni clignotement. | — |
| 13.8 | Contenu en mouvement ou clignotant contrôlable | NA | Seulement des transitions déclenchées par l'utilisateur, désactivées avec `prefers-reduced-motion` (`styles/base.css:108-115`). | — |
| 13.9 | Contenu consultable quelle que soit l'orientation | C | Aucun verrouillage d'orientation, mise en page responsive (320 à 1280 px vérifiés). | Tester en paysage sur téléphone. |
| 13.10 | Gestes complexes : alternative en geste simple | C | Le glisser-déposer de Cadrer a une alternative en clics (`demos/cadrer.js:141-163`). | Tester au tactile (iOS/Android). |
| 13.11 | Actions au pointeur unique annulables | **NC** (faible) | CONSTAT : la fenêtre compte se ferme au **`mousedown`** sur le fond (`commun/fenetre-compte.js:65-67`), une action à l'appui qu'on ne peut pas annuler. Le reste utilise `click` (déclenché au relâchement). | — |
| 13.12 | Fonctionnalités par mouvement de l'appareil : alternative | NA | Aucune utilisation du mouvement de l'appareil. | — |

---

#### 3.2.4 Bilan chiffré

| Statut | Nombre |
|---|---|
| Conforme | 39 |
| Non conforme | 26 |
| Non applicable | 38 |
| Non vérifiable depuis le code | 3 |
| **Total** | **106** |

Taux indicatif calculé à la manière du RGAA, C / (C + NC) = 39 / 65 ≈ **60 %**. Ce chiffre est provisoire : les 3 critères NV et les tests au lecteur d'écran peuvent le faire bouger dans les deux sens. Ce n'est pas une déclaration de conformité.

#### 3.2.5 Note globale : « Le site respecte-t-il le RGAA ? »

**Note : 2 / 4, partiellement.**

Ce qui tire la note vers le haut (CONSTATS) :
- la coquille est bien faite : langue, titres de page, repères, lien d'évitement, focus visible presque partout ;
- les onglets suivent le motif ARIA, au clavier ;
- le tiroir du glossaire est une fenêtre modale correcte ;
- toutes les démos sont utilisables au clavier, et le glisser-déposer a une alternative ;
- les champs ont un nom accessible ;
- les SVG ont des alternatives ;
- 17 démos sur 27 annoncent leurs résultats ;
- le reflow tient à 320 px sans défilement horizontal ;
- le thème sombre n'a aucun défaut de contraste détecté.

Ce qui l'empêche d'atteindre 3 (CONSTATS) :
- la fenêtre « Mon compte » est inutilisable au clavier et au lecteur d'écran sans effort, car le focus n'y entre pas ;
- la perte de focus dans le quiz et l'exemple pas à pas ;
- les courbes de charge sans alternative détaillée ;
- les tableaux sans titre ni en-têtes de ligne ;
- les hiérarchies de titres incohérentes ;
- les contrastes non textuels des champs ;
- les infobulles non conformes à 10.13 ;
- l'absence d'un second système de navigation.

**Il n'est pas possible de conclure à une conformité, même partielle et officielle.** Il reste à faire :
1. Tests au lecteur d'écran (NVDA + Firefox, VoiceOver + Safari macOS et iOS, TalkBack) :
   - restitution des onglets ;
   - quiz (annonce du `role=status` et du score) ;
   - les 27 démos dans tous leurs états (régions live, curseurs `range` sans `aria-valuetext`) ;
   - graphiques ;
   - tiroir du glossaire (contenu de fond lu ou non, car il n'est pas `inert`) ;
   - fenêtre compte.
2. Zoom réel à 200 % et 400 % dans Firefox et Safari, plus le zoom texte seul (10.4, 10.11).
3. Désactivation des CSS (10.2, 10.3) et mode contraste élevé ou couleurs forcées de Windows (10.5).
4. Contrastes des états survol, actif et désactivé, et des démos après manipulation (3.2, 3.3).
5. Validation W3C (Nu) du DOM généré (8.2).
6. Parcours de compte complet avec le serveur : messages d'erreur, suppression du compte (11.11, 11.12).
7. Tests tactiles en mobile (13.9, 13.10) et défilement des tableaux larges au clavier dans Safari (7.3).
8. Relecture éditoriale des passages en anglais (8.7) et des citations éventuelles (9.4).

---

#### 3.2.6 Problèmes de l'axe accessibilité (numérotés A11Y-1 à A11Y-28)

| # | Problème (critère) | Gravité | Effort | Fichiers | Correction recommandée |
|---|---|---|---|---|---|
| 1 | Le focus n'entre pas dans la fenêtre « Mon compte » et la tabulation sort de la fenêtre modale (7.1, 12.8) | **Bloquante** | Petit | `commun/fenetre-compte.js:100,143,162-164` | Insérer `fond` dans la page *avant* d'appeler `afficherConnexion()`/`afficherConnecte()` (ou appeler `focus()` après), piéger Tab dans `.cpt` comme dans le glossaire, et mettre `inert` sur `#app`. |
| 2 | Le focus est perdu après une réponse au quiz (7.1, 12.8, 7.5) | Majeure | Petit | `cours/blocs/quiz.js:240-257` | Ne pas redessiner tout le quiz, ou donner `tabindex="-1"` au `.feedback` avant `focus()`. Ajouter une région live permanente pour le score. |
| 3 | Les courbes de charge (n > 60 points) n'ont aucune alternative détaillée (1.6), et le nuage de points n'est pas dans le tableau (1.7) | Majeure | Moyen | `cours/blocs/graphique.js:204-221` + démos collecter, fiabiliser, structurer, analyser, seuil-detection | Produire un résumé texte (min, max, talon, pics, jours en alerte) ou un tableau agrégé (par heure ou par jour). Inclure les séries `points`, les marqueurs et les seuils dans le tableau. |
| 4 | Infobulle des graphiques non restituée aux flèches (7.1) et non masquable avec Échap (10.13) | Majeure | Petit | `cours/blocs/graphique.js:34-36,268-284` | `aria-live="polite"` sur `.tip` (ou une région `.sr` dédiée), touche Échap pour masquer, et `aria-roledescription` ou une consigne sur l'usage des flèches. |
| 5 | Tableaux sans titre (5.4) ni en-têtes de ligne (5.6) | Majeure | Petit | `cours/blocs/blocs.js:391`, `cours/blocs/graphique.js:212-217`, `cours/pages/accueil.js:92,142`, page école | Ajouter `<caption>` (ou `aria-labelledby` vers le `h3`), passer la 1re colonne en `<th scope="row">` et remplacer le `<th>` vide par un libellé (« Mois », « Heure »). |
| 6 | Hiérarchie de titres incohérente (9.1) | Moyenne | Petit | `cours/pages/etape.js:74,94`, `cours/blocs/blocs.js:380,388`, `cours/coquille/glossaire.js:289` | Onglets : un `h2` par panneau (le nom de l'onglet), blocs en `h3`, démos en `h3`, analogie en `h2` ou en simple `p`. Glossaire en pleine page : `h2` par lettre ou entrées en `h2`. Faire de « Les mots de cette étape » un `h2`. |
| 7 | Bordure des champs (1,36:1) et piste de l'interrupteur (3.3) | Moyenne | Petit | `commun/styles/jetons.css` (`--line`), `cours/styles/controles.css:57-68,93-99` | Jeton dédié `--line-ctrl` d'au moins 3:1 (ex. #8592a8 en clair) pour les contours de champ et la piste non cochée. |
| 8 | Contrastes de texte du thème clair (3.2) | Moyenne | Petit | `cours/styles/niveaux.css:426-429`, `cours/styles/elements.css:35`, `cours/demos/fiabiliser.js:355`, `cours/schemas/outils.js` (`dessinCompteur`) | Retirer `opacity:.75` sur `.quand`. Assombrir `--ok` (≈ #136c33) ou éclaircir `--ok-soft`. Texte foncé (`--on-energie`) sur le compteur orange. |
| 9 | Focus invisible sur les lignes du Pareto (1,12:1) et contour orange à 2,85:1 sur fond clair (10.7) | Moyenne | Petit | `commun/graphiques/graphiques.css:50-54`, `cours/styles/base.css:56-60`, `jetons.css:26` | Ne pas mettre `outline:none` sur `.pc-row` (ou ajouter un contour). En clair, utiliser `--focus` = `--energie-ink` (#b23c00, ≈ 6:1) ou un double contour. |
| 10 | Messages de statut non annoncés (7.5) | Moyenne | Moyen | `cours/coquille/glossaire.js:315`, `cours/pages/glossaire.js`, `cours/blocs/quiz.js:248`, `commun/suivi.js:189`, 10 démos | `aria-live="polite"` (ou `role=status`) sur les compteurs de résultats, le score, `annoncer()` et la zone de résultat de chaque démo (autoconso, changement-heure, collecter, ecart-sources, horodatage, indicateurs, rattachement, signature, trois-voies, usages). |
| 11 | Bulle du glossaire non survolable (10.13) | Moyenne | Petit | `cours/coquille/glossaire.js:381-393` | Garder la bulle ouverte quand le pointeur passe dessus (délai de fermeture + `pointerover` sur `.bulle`). |
| 12 | Cases à cocher sœurs non regroupées (11.5) | Moyenne | Petit | `cours/demos/agir.js`, `detecter.js`, `agregation-site.js`, `ecart-sources.js` | `fieldset` + `legend` (ou `role="group"` + `aria-labelledby` vers la consigne). |
| 13 | Champ « Identifiant » sans étiquette visible, recherches avec placeholder seul (11.1) | Moyenne | Petit | `cours/demos/identifiants.js:56`, `cours/coquille/glossaire.js:313`, `cours/pages/glossaire.js:18` | Rendre l'étiquette visible (retirer `.sr`) ou ajouter un `title`. |
| 14 | Exemple pas à pas : focus perdu quand les boutons se masquent (7.1) | Moyenne | Petit | `cours/blocs/blocs.js:440-464` | Déplacer le focus sur la nouvelle étape affichée (`tabindex=-1`) ou sur la conclusion. |
| 15 | `aria-label` sur des `span`/`div` génériques (7.1, 8.2, 10.10) | Moyenne | Petit | `cours/demos/collecter.js:65`, `cours/pages/accueil.js:137-138`, `cours/principal.js:50`, `cours/demos/cadrer.js:100` | Ajouter `role="img"` (jauges, coches) ou un texte `.sr` (« fait », « à faire », « 3 sur 5 »). Pour `#progress`, retirer l'`aria-label` (le texte visible suffit). |
| 16 | Noms tronqués par une ellipse au zoom et à 320 px (10.4, 10.11, 10.12) | Moyenne | Petit | `commun/graphiques/graphiques.css:55-59` | Permettre le retour à la ligne (`white-space:normal`) en dessous d'une largeur donnée ou au zoom. |
| 17 | Pourcentages des barres empilées et démo coupés avec l'espacement du texte (10.12) | Faible | Petit | `cours/styles/niveaux.css:291-300`, `cours/styles/etape.css:165-169` | Pas de `overflow:hidden` sur les libellés. Légende sous la barre quand le segment est étroit. Revoir `overflow:hidden` sur `.demo`. |
| 18 | Informations portées par le seul CSS : ✓ « terminée », « À l’école : » (10.2) | Faible | Petit | `cours/styles/coquille.css:135-140`, `cours/styles/glossaire.css:135`, `cours/principal.js:70` | Mettre le texte dans le HTML (`<span class="sr">terminée</span>`, préfixe en clair). |
| 19 | Pas de second système de navigation (12.1) | Faible | Moyen | `cours/principal.js`, nouvelle page | Ajouter une page « Plan du site » (liste des étapes, de leurs onglets et des pages annexes), liée depuis la barre ou un pied de page. |
| 20 | `figure`/`figcaption` sans `role` ni `aria-label` (1.9) | Faible | Petit | `cours/pages/etape.js:77`, `cours/blocs/blocs.js:403`, `cours/pages/patrimoine.js:53` | `role="figure" aria-label="{légende}"` sur `<figure>`. |
| 21 | Fermeture de la fenêtre compte au `mousedown` (13.11) | Faible | Petit | `commun/fenetre-compte.js:65-67` | Écouter `click` (vérifier que `pointerdown` et `pointerup` visent tous deux le fond). |
| 22 | Pseudo-onglets de la fenêtre compte (7.1) | Faible | Petit | `commun/fenetre-compte.js:75-77` | Soit de simples boutons `aria-pressed`, soit le motif complet (`tabpanel`, `aria-controls`, flèches). |
| 23 | Menus en liens juxtaposés (9.3) | Faible | Petit | `cours/principal.js:36-44,68-71` | Mettre la navigation principale en `ul` et le bandeau des étapes en `ol`. |
| 24 | Anglicismes sans `lang` (8.7) | Faible | Petit | `index.html:5`, `cours/pages/accueil.js:34`, `cours/demos/consentement.js:53`, `cours/pages/patrimoine.js` | `<span lang="en">Energy Management</span>`, ou arbitrage éditorial (nom propre). |
| 25 | Contour de famille par couleur seule dans le bandeau et la barre de progression (3.1) | Faible | Petit | `cours/principal.js:51,64-70` | Ajouter `(Data)` ou `(Énergie)` en `.sr` dans les liens et un texte « dont x Data, y Énergie ». |
| 26 | Encadrés en `<aside>` (best-practice) | Faible | Petit | `cours/blocs/blocs.js:388` | Utiliser `<div role="note">` ou `<section aria-label>` à la place d'`aside`. |
| 27 | Cibles des appels de note < 24 px (WCAG 2.2 2.5.8, **hors RGAA 4.1.2**) | Information | Petit | `cours/styles/niveaux.css:400-412` | `min-width/min-height: 24px` ou espacement. À anticiper pour le RGAA 5. |
| 28 | Curseurs sans `aria-valuetext` (SUPPOSITION : valeur annoncée = indice) | Faible | Petit | `cours/demos/analyser.js:34`, `consentement.js:73`, autres `range` | `aria-valuetext` = texte affiché (date, valeur et unité). |

### 3.3 Axe 3 : métier

#### 3.3.0 Comment fonctionne la citation des sources (CONSTAT)

| Où | Mécanisme | Contrôlé par `outils/sources.mjs` ? |
|---|---|---|
| Textes du cours (`cours/contenu/etape-N.js`) | `[[cle]]` ou `[[cle-1,cle-2]]` juste après l'information → appel de note numéroté, liste « Sources de cette page » en bas (`cours/blocs/notes.js`) | Oui : la clé doit exister au registre |
| Démos | `SOURCES_DEMOS` dans `cours/contenu/sources.js` → ligne « Sources de cette démo » sous la démo (`cours/blocs/blocs.js:32`) | Oui |
| Glossaire | `src: ["cle"]` sur le terme (`commun/donnees/glossaire.js`) | Oui |
| Anciennes listes | `sourcesData`, `sourcesEnergie` (`cours/contenu/sources.js:19-87`) : liens bruts, **hors registre**, pas de date de consultation | **Non** |
| Page Patrimoine | 3 liens bruts écrits dans le HTML (`cours/pages/patrimoine.js:87`) | **Non** |
| Preuve | Relevés `outils/sources/releve-*.json` : pour chaque information, type (fait, règle, fictif, méthode, calcul, vanne), verdict, passage lu, page | Oui, mais **un seul relevé pour le cours : l'étape 2** |

État du contrôle (`node outils/verifier.mjs sources` et `node outils/sources.mjs`, lancés en lecture seule) : **20 vérifications réussies, 0 échec**. 102 sources au registre. Bilan du relevé « Cours · étape 2 » : 236 informations, dont 116 faits et règles → 94 confirmés, 15 corrigés, **3 à corriger, 4 sans source**.

**Important (CONSTAT)** : le contrôle passe au vert parce qu'il ne vérifie que ce qui a été relevé. Il ne détecte pas qu'un fait d'une étape non relevée (1, 3 à 8) n'a pas de source. « 0 échec » ne veut donc pas dire « tout est sourcé ».

Nombre de citations `[[...]]` par fichier (CONSTAT, `grep -o '\[\[[a-z0-9, -]*\]\]' | wc -l`) : étape 1 : 0 · **étape 2 : 36** · étapes 3 à 8 : 0 · quiz final : 0.
Démos avec sources déclarées : 4 sur 27 (`collecter`, `consentement`, `casIndex`, `anatomieFacture`, toutes à l'étape 2).
Termes du glossaire avec `src` : 29 sur 66 (tous ceux de l'étape 2 ; aucun des termes propres aux étapes 3 à 8).

---

#### 3.3.1 « Quelles grandes informations, et comment ? »

##### Note : **3 / 4**

**Points forts (CONSTAT)**
- Chaque étape suit la même structure : question → phrase clé → 3 « à retenir » → analogie → schéma légendé → démo → niveaux Comprendre / Approfondir → mini-quiz, puis un quiz de synthèse de 12 questions qui reprend au moins un message par étape (`cours/contenu/quiz-final.js`).
- Le fil rouge (école Jean-Jaurès, 2 000 m², 60 kVA, 86 MWh d'électricité, 208 MWh de gaz) relie les chiffres d'une étape à l'autre. J'ai refait les calculs des exemples pas à pas : ils sont justes (ratios 43 / 104 / 147 kWh/m², 417 kWh, 2 568 kWh, −9,7 %, −16,3 %, −29,1 %, 21 720 kWh, 4 040 €, 1 220 €, 2,8 tCO2e, 19 %, 12 ans).
- Les messages structurants reviennent en spirale : le talon (36 lignes), les DJU (62), la puissance souscrite (36), le consentement (33), le pas de 10 min (35).
- Le texte avertit souvent lui-même : « à vérifier », « fictif », « calcul simplifié », « valeurs fictives d'ordre de grandeur ».

**Faiblesses**
- Quelques messages importants n'apparaissent que dans une seule étape et sous une seule forme : « les pourcentages se multiplient » (2 lignes, étape 7 seulement), « W au lieu de kW » (6 lignes), « l'objectif décide des données » (5 lignes).
- Plusieurs incohérences internes (voir §3) : pas de 10 min présenté comme général alors que le relevé de l'étape 2 dit 5 min depuis fin 2025 ; 130 contre 134 kWh/DJU ; facteur gaz 0,227 (PCI) affiché contre 0,204 utilisé dans le calcul ; « deux chiffres inversés » qui n'en est pas une (étape 3).
- Hors étape 2, aucun message à portée réglementaire n'est rattaché à une source affichée (décret tertiaire, OPERAT, facteurs CO2, ISO 50001, IPMVP, DJU).

Le tableau des messages clés est en section 4.

#### 3.3.2 « Tout est-il sourcé ? »

##### Note : **2 / 4**

Le mécanisme est excellent : registre unique, appels de note, relevés avec passage lu et page, contrôle automatique. L'étape 2 est sourcée fait par fait, avec 15 corrections déjà faites. Mais (CONSTAT) **7 étapes sur 8, le quiz final, 37 termes du glossaire sur 66, 23 démos sur 27 et la page Patrimoine n'ont aucune source au registre**. Les affirmations réglementaires les plus engageantes (décret tertiaire, OPERAT, sanctions, facteurs d'émission) ne sont pas sourcées. Le README le dit honnêtement (« le référencement avance périmètre par périmètre »). En revanche, la page Sources affiche une promesse inexacte (voir P1).

##### 2.1 Tableau des affirmations factuelles

Colonnes : affirmation | fichier:ligne | sourcée ? | où | précision de la source (éditeur, titre, date, lien, page).
« Relevé » renvoie à `outils/sources/releve-cours-etape-2.json`, qui garde le passage lu et souvent la page (147 passages sur 283 ont une page).

###### Étape 2 et ses démos (périmètre relevé) : échantillon représentatif

| Affirmation | Fichier:ligne | Sourcée ? | Où | Précision |
|---|---|---|---|---|
| « courbe de charge au pas de 10 min pour l'électricité » | cours/contenu/etape-2.js:17 | Oui, mais **à corriger** | `[[grdf-adict-faq,mne-compteurs-communicants]]` ; relevé ce2-002 | Relevé : 5 min depuis la reprogrammation Enedis (sites > 36 kVA), 30 min pour Linky (`enedis-nmo-cf-015e`, `-077e`, `-016e`, Enedis, 3 juillet 2026, enedis.fr/media/…/download). Non corrigé dans le texte |
| « un volume par jour pour le gaz (Gazpar) » | etape-2.js:17 | Oui | idem | GRDF FAQ ADICT (s.d., sites.grdf.fr) ; MNE 27 mai 2025 |
| Distributeur (Enedis, GRDF) pose et relève ; fournisseur vend | etape-2.js:53 | Oui | `[[mne-releve-compteur,mne-compteurs-communicants]]`, `[[mne-acteurs-marche]]` | MNE, energie-info.fr, datées |
| Consentement du titulaire requis | etape-2.js:54 | Oui | `[[enedis-nmo-cf-015e,grdf-adict-faq]]` | Enedis-NMO-CF_015E v2, 3 juillet 2026 ; GRDF FAQ s.d. |
| Seuil de 36 kVA, segment C5 / Linky ; C1 à C4 au-delà | etape-2.js:87-88 | Oui | `[[enedis-segments-c1-c5]]` | Enedis FAQ « points de connexion C1 à C5 », **s.d.** |
| Courbe Linky au pas de 30 min, enregistrement fin avec l'accord du client | etape-2.js:87 | Oui | `[[enedis-nmo-cf-016e,cnil-linky-gazpar]]` | Enedis 3 juillet 2026 ; CNIL 31 octobre 2017 |
| Data Connect : consentement limité à 3 ans, durée demandée par le tiers | etape-2.js:87 | Oui (corrigé) | `[[enedis-contrat-data-connect]]` ; relevé ce2-020 | Enedis-MOP-NUM_010E, 15 septembre 2025, article 3.2 (selon le relevé) |
| Relève au pas de 5 min depuis fin 2025 ; reconstitution à 10 ou 15 min | etape-2.js:88 | Oui (corrigé) | `[[enedis-nmo-cf-015e]]` ; ce2-022 | Enedis 3 juillet 2026 |
| SGE : autorisation expresse, forme libre, conservée, limitée dans le temps | etape-2.js:88 | Oui (corrigé) | `[[enedis-contrat-sge,enedis-nmo-cf-015e]]` ; ce2-024 | Enedis-MOP-CF_054E v1.2, 1er juin 2026 |
| Mise en place SGE : de plusieurs semaines à plusieurs mois | etape-2.js:88 | Oui (corrigé) | `[[enedis-contrat-sge,consometers-sge-tiers]]` ; ce2-025 | « plusieurs mois » ne vient que de Consometers (GitHub, **secondaire, s.d.**) |
| Data Connect basculé le 28 septembre 2026 (v2), API v5 arrêtées deux semaines plus tard | etape-2.js:96 | Oui, **secondaire seulement** | `[[github-bascule-data-connect,github-eddie-data-connect]]` | 2 pages GitHub, s.d. ; le texte dit bien « à confirmer dans la documentation officielle Enedis » |
| ADICT : consommations quotidiennes, mensuelles, semestrielles ; décalage de 1 à 3 jours | etape-2.js:102 | Oui (corrigé) | `[[grdf-adict-faq,datagouv-grdf-adict]]`, ce2-032 | GRDF FAQ s.d. ; guide GRDF 28 janvier 2026 (J+1 / J+2 / J+3 selon la fréquence de relève, d'après le relevé) |
| kWh = m³ × coefficient ; PCS et conditions de livraison ; selon la commune et le mois ; 9 à 12,5 kWh/m³ | etape-2.js:103 | Oui (corrigé) | `[[mne-coefficient-conversion]]`, `[[grdf-guide-donnees-2026]]`, `[[grdf-coefficient-conversion]]` ; ce2-035 | MNE s.d. ; GRDF 28 janvier 2026 ; GRDF s.d. |
| Accise électricité 26,35 €/MWh (> 36 kVA), 30,62 €/MWh (≤ 36 kVA), gaz 16,66 €/MWh au 1er août 2026 | etape-2.js:125 ; demos/anatomie-facture.js:44 ; commun/donnees/references.js:27,38 | Oui (corrigé) | `[[ministere-guide-fiscalite-2026]]` ; ce2-038, ce2-141 | Ministère chargé de l'énergie, « Guide 2026 sur la fiscalité des énergies », date « 2026 » seulement. Catégorie exacte de l'école (60 kVA, service public communal) laissée « à vérifier » : le relevé indique que Légifrance a répondu 403 |
| CTA élec 15 % depuis le 1er février 2026 (21,93 % avant) ; gaz 20,80 % + quote-part transport | etape-2.js:126 | Oui (corrigé) | `[[cnieg-cta-2026]]`, `[[cnieg-cta-note,mne-taxes-facture]]` | CNIEG 24 février 2026 ; note CNIEG **s.d.** ; MNE 3 septembre 2026 |
| TVA 20 % sur tous les postes | etape-2.js:126 | Oui | `[[mne-taxes-facture]]` | MNE 3 septembre 2026 |
| TURPE 7 : +3,04 % en moyenne au 1er août 2026 | etape-2.js:126 | Oui | `[[cre-deliberation-2026-105]]` | CRE, délibération n° 2026-105 du 21 mai 2026 |
| Délai télérelevé : le lendemain (élec), 1 à 3 jours (gaz) | etape-2.js:141 ; demos/collecter.js (fiche) | Oui (corrigé) | `[[enedis-nmo-cf-077e,grdf-adict-faq]]` ; ce2-050, ce2-077 | Le relevé note que le délai exact de la courbe électrique n'est pas écrit dans les documents lus |
| Délai index « quelques jours » | etape-2.js:141 ; demos/collecter.js | **Non** | ce2-051, ce2-081 | Sans source (le relevé propose « (cas de l'école) ») |
| Délai facture « 2 à 6 semaines » | etape-2.js:141 ; demos/collecter.js | **Non** | ce2-052, ce2-084 | Sans source |
| Finesse « 10 min (élec) » | etape-2.js:137 ; demos/collecter.js (fiche Fréquence) | **À corriger** | ce2-046, ce2-075 | Voir la première ligne |
| Courbe de charge d'un logement = donnée personnelle | etape-2.js:163 | Oui | `[[cnil-linky-courbe-de-charge]]`, `[[cnil-deliberation-2012-404,cnil-donnee-personnelle]]` | CNIL, datées sauf « Définition : donnée personnelle » |
| « La facture donne le coût… avec du retard et sur des périodes qui ne suivent pas les mois » | etape-2.js:19 | Non | relevé ce2-005 : « méthode / sans objet » | SUPPOSITION : c'est un fait (le retard, les périodes non calendaires), pas de la méthode. `mne-frequence-facturation` pourrait l'appuyer s'il le dit (à vérifier dans la source) |

###### Étapes 1, 3 à 8, quiz final, glossaire, autres démos, pages (périmètre non relevé)

| Affirmation | Fichier:ligne | Sourcée ? | Où | Précision / remarque |
|---|---|---|---|---|
| PDL appelé PRM par Enedis, 14 chiffres | cours/contenu/etape-1.js:98 ; quiz étape 1 l.160 | Non dans le texte | Glossaire `pdl` : `enedis-pdl` | Enedis FAQ, 26 août 2026 (lien, pas de page). Le glossaire n'affiche pas d'appel dans É1 |
| PCE chez GRDF, en général 14 chiffres ; anciens « GI » + 6 chiffres | etape-1.js:98 ; demos/identifiants.js:26-29 | Non | Glossaire `pce` : `grdf-guide-donnees-2026` (14 chiffres) | Format « GI + 6 chiffres » : **aucune source** (à vérifier) |
| Le PDL reste le même quand le compteur change | etape-1.js:99, 145-153 ; quiz-final.js:15 | Non | — | Plausible et classique, mais non sourcé |
| Décret tertiaire : bâtiments tertiaires d'au moins 1 000 m² | etape-1.js:121 ; etape-8.js:110 ; quiz É8 ; glossaire.js:416 | **Non** | — | **À vérifier / à sourcer** (texte officiel) |
| Déclaration sur OPERAT (ADEME) | etape-1.js:121 ; etape-8.js:112 ; glossaire.js:410 | Non | — | À sourcer |
| Complétude : 144 points, 138 ou 150 en heure locale | etape-3.js:16, 95 ; quiz l.181-185 ; quiz-final.js:39-42 | Sans objet (calcul) | — | Repose sur le pas de 10 min (voir l'incohérence avec le pas de 5 min) |
| Changements d'heure : 29 mars 2026 (23 h), 26 octobre 2025 (25 h) | etape-3.js:181 ; cours/modele/calendrier.js | Non | — | Faits de calendrier, faible risque ; source possible : texte officiel (non au registre) |
| « Parce qu'Enedis l'impose » (UTC) est présenté comme une mauvaise réponse | etape-3.js:216 | Non | — | SUPPOSITION : je ne sais pas ce qu'imposent les flux Enedis en matière d'horodatage (le guide `enedis-guide-flux-r6x` est au registre) : à vérifier pour ne pas enseigner l'inverse |
| « 413 → 404, deux chiffres inversés » | etape-3.js:68 | — | — | **Erreur de raisonnement (CONSTAT)** : 413 → 404 n'est pas une inversion de chiffres (une inversion donnerait 431 ou 143). Voir P5 |
| France à UTC+1 en hiver, UTC+2 en été | glossaire.js:245 | Non | — | Fait simple, non sourcé |
| Seuil de 18 °C « convention » ; méthode « météo » (moyenne min/max) ; méthode COSTIC | etape-5.js:124 ; glossaire.js:380 | **Non** | — | À sourcer (définitions des DJU) |
| DJU d'une station proche (Météo-France ou fournisseurs) | etape-5.js:125 | Non | — | À sourcer |
| Le décret tertiaire prévoit un ajustement climatique | etape-5.js:125 ; etape-8.js:112 | Non | — | À sourcer |
| « 1 °C de moins ≈ 7 % de chauffage en moins » (« souvent citée ») | etape-7.js:53 ; demos/agir.js:34 ; schemas/mesurer.js | **Non** | — | **À vérifier / à sourcer** : ordre de grandeur répandu, mais « souvent citée » sans dire par qui |
| Facteur CO2 gaz ≈ 0,204 kgCO2e par kWh facturé | etape-7.js:64 ; references.js:45 | Non | — | À sourcer (Base Empreinte ADEME) ; voir l'incohérence avec 0,227 |
| Facteurs « ADEME à vérifier : ≈ 0,052 kg/kWh (élec, mix moyen), ≈ 0,227 kg/kWh PCI (gaz) » | etape-8.js:102 ; demos/indicateurs.js:58 ; references.js:44 | Non au registre | `sourcesEnergie` : Selectra, « émissions de CO2 par source d'énergie (Base Empreinte ADEME) » | Source **secondaire**, hors registre, sans date ; l'origine (Base Empreinte) n'est pas citée directement |
| « Le gaz émet environ 4 fois plus de CO2 par kWh que l'électricité française » | etape-8.js (quiz, explication) | Non | — | Cohérent avec 0,204 / 0,052 ≈ 3,9, mais dépend des facteurs non sourcés |
| Décret tertiaire : −40 % en 2030, −50 % en 2040, −60 % en 2050, ou seuil en valeur absolue par catégorie | etape-8.js:111 ; glossaire.js:416 ; demos/decret-tertiaire.js:37-39, 90, 126-128 ; quiz É8 | **Non** | `sourcesEnergie` (Veolia, Hellio, Lowit) | **À vérifier / à sourcer** sur le texte officiel (code de la construction, décret, arrêtés) ; les liens actuels sont des sites commerciaux |
| Année de référence : 12 mois consécutifs entre 2010 et 2022 ; « borne haute repoussée de 2019 à 2022 en 2024 » | etape-8.js:111 ; demos/decret-tertiaire.js:23-25 | **Non** | (Hellio : « quelle année de référence ») | **À vérifier** : date et texte modificatif non cités ; règle susceptible d'avoir encore évolué |
| Déclaration OPERAT « avant le 30 septembre » | etape-8.js:112 ; quiz É8 | **Non** | — | **À vérifier** : date limite déjà modifiée par le passé, comme le dit le texte lui-même (l.120) |
| Modulations possibles (contraintes techniques, architecturales, coût disproportionné) | etape-8.js:112 | Non | — | À sourcer |
| Sanctions « jusqu'à 7 500 € d'amende pour une personne morale, avec publication » | etape-8.js:112 | **Non** | — | **À vérifier** : montant réglementaire et conditions (pour quel manquement ?) non sourcés |
| Année de référence au choix, « c'est permis, et c'est un vrai choix stratégique » | demos/decret-tertiaire.js:135 | Non | — | À sourcer |
| ISO 50001 version 2018 + amendement 2024 sur le changement climatique ; pas d'objectif chiffré | etape-8.js:136 | Non au registre | `sourcesEnergie` : ministère (ecologie.gouv.fr, ISO 50001) ; iteh.ai (EN ISO 50001:2018/A1:2024) | Liens bruts, sans date de consultation ; iteh.ai est un revendeur de normes (secondaire) |
| IPMVP « le protocole international le plus utilisé » ; fixer à l'avance la période de référence et le modèle | etape-8.js:142 ; glossaire.js:356-357 | **Non** | — | Superlatif non sourcé (à vérifier) ; aucune source EVO / IPMVP au registre |
| kW = kVA × cos φ ; cos φ = 0,93 pour l'école | glossaire.js:33 ; references.js:10 | Non | — | Physique (sans objet) + valeur fictive |
| Dépassement : « En C4, facturé en pénalités ; jusqu'à 36 kVA, le compteur coupe » | glossaire.js:398 ; demos/puissance.js:119 | **Non** | — | À sourcer (la brochure `enedis-turpe7-brochure` au registre pourrait couvrir la partie C4 : à vérifier dans la source) |
| La puissance souscrite fixe une partie de l'acheminement ; la CTA en dépend | etape-7.js:138, 184-187 ; etape-2.js:209 | Partiel | Étape 2 sourcée (CTA = % de la part fixe, `cnieg-cta-note`) ; étape 7 non | — |
| « L'abonnement fournisseur ne bouge pas » quand on baisse la puissance | etape-7.js:138 | Non | — | **À vérifier** : la phrase semble contredire `glossaire.js:392` (« Une partie de l'abonnement et de l'acheminement en dépend »). Voir P7 |
| Taux d'autoconsommation / d'autoproduction (définitions) | etape-7.js:130 ; glossaire.js:332 | Non | — | À sourcer (définitions) |
| Surplus « peut être vendu » ; prix du surplus 0,04 €/kWh | etape-7.js:129 ; demos/autoconso.js:28 | Non | — | La démo dit « valeurs fictives d'ordre de grandeur » ; le registre a des sources PV utilisées par le jeu, pas par le cours |
| Coût 1 400 €/kWc ; ≈ 5 m² par kWc | demos/autoconso.js:30, 72 | Non | — | Ordres de grandeur non sourcés |
| « 36 kWc produisent environ 38 MWh par an en Île-de-France » | glossaire.js:339 | **Non** | — | À sourcer, ou à marquer comme hypothèse |
| CEE (certificats d'économies d'énergie) cités comme aide | etape-7.js:137 | Non | — | Mention simple ; à sourcer si elle est développée |
| Énergie finale = livrée et facturée ; le décret tertiaire compte l'énergie finale | glossaire.js:350-351 ; etape-8.js:111 | Non | — | À sourcer |
| Références nationales kWh/m²/an : enseignement 155, petite enfance 160, sport 148, piscine 3 249 kWh/m² de bassin, administratif 156, culture 143, EHPAD ≈ 250 | commun/donnees/patrimoine.js:11-17 ; cours/pages/patrimoine.js:86-87 | Liens bruts | ADEME « Énergie et patrimoine communal » (synthèse, banquedesterritoires.fr ; data.ademe.fr) ; EHPAD : blog lsmart.co | **Hors registre**, sans date ni page ; données dites « anciennes » ; source EHPAD commerciale et secondaire |
| Vacances zone C 2025-2026, jours fériés 2025-2026 | cours/modele/calendrier.js:4-48 | Non | — | Faits de calendrier ; ils me paraissent cohérents (CONSTAT partiel : Pâques le 5 avril 2026 → lundi 6, Ascension le 14 mai, Pentecôte → lundi 25 mai), mais non sourcés |
| Segment C4 = BT > 36 kVA, compteur télérelevé | glossaire.js:127 ; commun/donnees/ecole.js:66 | Oui (glossaire) | `enedis-segments-c1-c5`, `enedis-nmo-cf-015e` | « pas 10 min » dans ecole.js : même réserve que le pas de 5 min |
| Tarifs de fourniture, TURPE (13,50 €/kVA/an, 32 €/mois), pénalité de 12,4, abonnements | references.js:9-40 | Sans objet (fictif) | `NOTE_TARIFS` le dit | OK, et c'est signalé dans les démos (« fictif ») |

##### 2.2 Liste des affirmations sans source (à traiter)

**Réglementaires, priorité haute**
1. Décret tertiaire : seuil de 1 000 m² (etape-1.js:121, etape-8.js:110, glossaire.js:416, quiz É8).
2. Objectifs −40 / −50 / −60 % et alternative du seuil en valeur absolue (etape-8.js:111, glossaire.js:416, demos/decret-tertiaire.js, quiz É8).
3. Année de référence 2010-2022 et « repoussée de 2019 à 2022 en 2024 » (etape-8.js:111, demos/decret-tertiaire.js:23).
4. Date limite OPERAT « avant le 30 septembre » (etape-8.js:112, quiz É8).
5. Sanctions « jusqu'à 7 500 € … avec publication » (etape-8.js:112).
6. Modulations des objectifs, ajustement climatique, attestation annuelle (etape-8.js:112, etape-5.js:125).
7. OPERAT, plateforme de l'ADEME (glossaire.js:410).
8. ISO 50001 (2018 + A1:2024), absence d'objectif chiffré (etape-8.js:136) : liens hors registre seulement.
9. Dépassement de puissance : pénalités en C4, coupure jusqu'à 36 kVA (glossaire.js:398, demos/puissance.js:119).

**Faits techniques, priorité moyenne**
10. Délais « quelques jours » (index) et « 2 à 6 semaines » (facture) (etape-2.js:141, demos/collecter.js) : verdict « sans source » du relevé.
11. Format PCE ancien « GI + 6 chiffres » (etape-1.js:98, demos/identifiants.js:26).
12. PDL inchangé au changement de compteur (etape-1.js:99).
13. DJU : base 18 °C, méthode « météo », COSTIC, stations Météo-France (etape-5.js:124-125, glossaire.js:380).
14. IPMVP, « protocole le plus utilisé » (etape-8.js:142, glossaire.js:356).
15. Facteurs d'émission 0,052 / 0,204 / 0,227 et « 4 fois plus » (etape-7.js:64, etape-8.js:102, references.js:44-45, demos/indicateurs.js:58).
16. « 1 °C ≈ 7 % de chauffage » (etape-7.js:53, demos/agir.js:34).
17. Autoconsommation : définitions des taux, prix du surplus, coût au kWc, 5 m²/kWc, 38 MWh pour 36 kWc (etape-7.js:129-130, demos/autoconso.js, glossaire.js:332, 339).
18. UTC+1 / UTC+2 ; dates des changements d'heure (glossaire.js:245, etape-3.js:181).
19. Références nationales kWh/m² du patrimoine (patrimoine.js:11-17) : liens bruts hors registre.
20. Énergie finale et décret tertiaire (glossaire.js:350-351).
21. Facture en retard et sur des périodes non calendaires (etape-2.js:19) : classée « méthode » dans le relevé.
22. Pas de 10 min présenté comme général (etape-2.js:17, 137 ; demos/collecter.js ; etape-3.js:16, 95 ; etape-4.js ; glossaire.js:40, 47, 283 ; ecole.js:66 ; pages/ecole.js:51) : « à corriger » pour l'étape 2, non relevé ailleurs.

##### 2.3 Affirmations « à vérifier » (douteuses, datées ou approximatives)

- **Pas de temps de 10 min** (étapes 1 à 4, glossaire, page école) : d'après le relevé de l'étape 2 (sources Enedis du 3 juillet 2026), le pas courant est de 5 min au-delà de 36 kVA depuis fin 2025, et de 30 min pour Linky. Le cours garde 10 min pour l'école (c'est un choix légitime de cas d'école), mais la phrase « à retenir » de l'étape 2 et le tableau comparatif le présentent comme la règle. Pourquoi : écart entre le texte et la source que le projet a lui-même lue.
- **Décret tertiaire, −40 / −50 / −60 %, 1 000 m², 2010-2022, 30 septembre, 7 500 €** : tous datés et réglementaires, et le texte dit lui-même (etape-8.js:120) qu'ils « ont déjà été modifiés par arrêté ». Pourquoi : aucune source officielle n'est citée, et les seules sources affichées sont commerciales (Veolia, Hellio, Lowit). La phrase « borne haute repoussée de 2019 à 2022 en 2024 » est la plus fragile : année et texte modificatif non cités. Je ne propose aucune valeur de remplacement.
- **Facteurs d'émission** : 0,052 kgCO2e/kWh (« mix moyen ») et 0,227 kg/kWh PCI ou 0,204 par kWh facturé pour le gaz. Ces facteurs changent avec les versions de la Base Empreinte, et la source affichée est Selectra (secondaire). Pourquoi : valeurs datées et indirectes.
- **Accise 26,35 €/MWh pour l'école** : la catégorie de l'école (60 kVA, collectivité) reste « à vérifier » ; le relevé dit que Légifrance n'a pas pu être lu (403). Bien signalé dans le texte (etape-2.js:125).
- **Bascule Data Connect du 28 septembre 2026** : sources secondaires (GitHub) seulement. Bien signalé (« à confirmer »).
- **« 1 °C ≈ 7 % »** : ordre de grandeur répandu, présenté comme « souvent citée » sans auteur.
- **Références nationales du patrimoine** : la page dit elle-même « données anciennes » ; EHPAD 250 kWh/m² vient d'un blog commercial.
- **« L'abonnement fournisseur, lui, ne bouge pas »** (etape-7.js:138) : SUPPOSITION, cela peut dépendre de l'offre ; et la phrase est en tension avec glossaire.js:392.
- **Quiz É3 « Parce qu'Enedis l'impose » donné comme faux** : à confirmer dans le guide R6X (horodatage des flux).
- **Taux de CTA, TURPE, accise** : le README rappelle (l. 63) qu'ils changent chaque année. Les valeurs relevées au 1er août 2026 sont valables aujourd'hui (9 octobre 2026), mais devront être revues avant la prochaine rentrée.

##### 2.4 Qualité du registre `commun/donnees/sources.js` (CONSTAT, script `registre.mjs`)

| Critère | Résultat |
|---|---|
| Champs disponibles | `t` (titre), `ed` (éditeur), `date` (date du document), `url`, `niveau` (officiel / secondaire), `vu` (date de consultation). **Pas de champ auteur** (l'éditeur en tient lieu), **pas de champ page** (la page est dans les relevés : 147 passages sur 283 ont une page) |
| Titre, éditeur, lien https, niveau, date de consultation | 102 / 102 (le contrôle automatique le vérifie) |
| Date du document | **32 / 102 sans date** (`date: null`), dont **15 parmi les 41 sources citées par le cours** : cnieg-cta-note, cnil-donnee-personnelle, consometers-sge-tiers, datagouv-grdf-adict, enedis-facturation-acheminement, enedis-linky-facilite, enedis-segments-c1-c5, enedis-sge-fournisseur, github-bascule-data-connect, github-eddie-data-connect, grdf-adict-faq, grdf-coefficient-conversion, minefi-tva, mne-coefficient-conversion, mne-pcs. `ministere-guide-fiscalite-2026` et `sdes-chiffres-cles-2025` n'ont qu'une année |
| Date de consultation | Une seule valeur pour les 102 sources : `2026-10-06`. SUPPOSITION : consultation groupée, ou date mise à jour en bloc. La page Sources affiche « consultées le 6 octobre 2026 » pour tout |
| Sources secondaires | 11 (Consometers ×2, GitHub ×2, EDF ×2, fabricants ou distributeurs ×3, etc.). 3 sont citées par le cours (consometers-sge-tiers, github-bascule-data-connect, github-eddie-data-connect) ; consometers-data-connect ne figure que dans le relevé. Elles sont bien badgées « source secondaire » à l'affichage |
| Doublons d'URL | Aucun (contrôle automatique) |
| Sources présentes mais que rien n'affiche | 11 (cre-avis-cta-2026, cre-compteurs-evolues, cre-tarif-acces, cre-tarifs-gaz, enedis-donnees-personnelles, enedis-linky, enedis-mes-donnees, enedis-turpe6-essentiel, grdf-prescriptions-techniques, mne-contrat-unique, consometers-data-connect) : gardées comme preuves des relevés |
| Liens fragiles possibles (SUPPOSITION) | URL Enedis `…/media/NNNN/download` (l'identifiant change à chaque nouvelle version d'un document) ; PDF GRDF avec jeton `?version=1.0&t=…&download=true` ; PR et ticket GitHub ; PDF CNIL dans un dossier daté `2023-10` ; page `enedis-turpe6-essentiel` (TURPE 6, périmé) |
| Liens morts | **Non testés** : le proxy réseau de cet environnement refuse les connexions sortantes (`curl` → « CONNECT tunnel failed, response 403 »). À lancer chez l'auteur : `node outils/sources.mjs liens` |
| Listes hors registre | `sourcesData` (8 liens) et `sourcesEnergie` (6 liens) dans `cours/contenu/sources.js`, plus 3 liens dans `cours/pages/patrimoine.js:87` : pas de date, pas d'éditeur structuré, pas de date de consultation, pas de niveau, pas de contrôle. 7 sur 17 sont des sites commerciaux (EDF Entreprises, fournisseurs-electricite.com, Veolia, Hellio, Lowit, Selectra, lsmart) |

---

#### 3.3.3 Problèmes de l'axe métier (numérotés MÉT-P1 à MÉT-P16) et questions ouvertes

| # | Problème | Gravité | Effort | Fichiers | Correction recommandée |
|---|---|---|---|---|---|
| P1 | La page Sources affirme que « les autres étapes gardent pour l'instant leur liste de liens en bas du niveau Approfondir ». **CONSTAT** : `sourcesData` est importé mais jamais affiché dans les étapes 1, 3 et 4, et `sourcesEnergie` dans les étapes 5, 6 et 7 ; seule l'étape 8 l'affiche (`etape-8.js:151`). Six étapes n'affichent donc **aucune** source. La page dit aussi : « Chaque fait et chaque règle du cours renvoie à une source » | Haute (promesse inexacte faite à l'apprenant) | Petit | cours/pages/sources.js:45-47 ; cours/contenu/etape-1,3,4,5,6,7.js (imports morts l.8) | Corriger le texte de la page (« seule l'étape 2 est référencée ; les autres étapes ne le sont pas encore »), ou réafficher les listes en attendant ; supprimer les imports inutiles |
| P2 | Décret tertiaire, OPERAT, sanctions, ISO 50001, IPMVP : aucune source officielle au registre ; seules des pages commerciales, hors registre | Haute | Moyen | etape-1.js:121 ; etape-8.js:102-136 ; glossaire.js:354-425 ; demos/decret-tertiaire.js ; cours/contenu/sources.js:58-87 | Lancer le relevé du périmètre « Cours · étape 8 » (même méthode que l'étape 2) en priorité ; ajouter au registre les textes officiels, après les avoir lus ; supprimer ou dégrader en « secondaire » les liens Veolia, Hellio et Lowit |
| P3 | Pas de 10 min présenté comme général (3 lignes « à corriger » toujours ouvertes dans le relevé ; même hypothèse dans les étapes 1, 3, 4, le glossaire et la page école) | Moyenne | Petit | etape-2.js:17, 137 ; demos/collecter.js (fiche) ; glossaire.js:40, 47, 283 ; commun/donnees/ecole.js:66 | Appliquer les corrections déjà rédigées dans le relevé (ce2-002, ce2-046, ce2-075) ; dans É3, É4 et le glossaire, dire « au pas de 10 min, celui de l'école » |
| P4 | Facteurs CO2 incohérents : le tableau d'É8 affiche 0,227 kg/kWh PCI pour le gaz alors que les 42 t sont calculées avec 0,204 (par kWh facturé, PCS : `references.js:45`) | Moyenne | Petit | etape-8.js:101-102 ; etape-7.js:64 ; references.js:43-46 | Afficher la même base (PCS ou PCI) que celle du calcul, avec la source |
| P5 | Erreur de raisonnement : « 413 → 404, deux chiffres inversés » n'est pas une inversion | Moyenne (contenu faux dans un exemple pas à pas) | Petit | etape-3.js:68 | Reformuler (« erreur de saisie : 413 tapé 404 », sans parler d'inversion), ou choisir un exemple qui est vraiment une inversion et qui fait reculer l'index (par exemple 413 989 saisi 143 989) |
| P6 | Valeur de thermosensibilité incohérente : 134 kWh/DJU (É5 l.94, glossaire l.297) contre « environ 130 » (glossaire l.387) | Basse | Petit | glossaire.js:387 | Aligner sur la valeur du modèle |
| P7 | « L'abonnement fournisseur, lui, ne bouge pas » (É7) contre « une partie de l'abonnement… dépend [de la puissance souscrite] » (glossaire) | Basse à moyenne | Petit | etape-7.js:138 ; glossaire.js:392 | Trancher, et sourcer (brochure TURPE, fiche MNE sur les éléments de facture) |
| P8 | 37 termes du glossaire sans `src`, dont des définitions réglementaires (decret-tertiaire, operat, iso50001, ipmvp, depassement, dju, energie-finale, kwc) | Moyenne | Moyen | commun/donnees/glossaire.js | Sourcer les définitions factuelles ; les termes de méthode (talon, baseline, faux positif) peuvent rester sans source si le relevé les classe « méthode » |
| P9 | 23 démos sur 27 sans `SOURCES_DEMOS`, dont `decretTertiaire`, `puissance`, `autoconso`, `indicateurs`, `identifiants`, `changementHeure`, qui affirment des faits | Moyenne | Moyen | cours/contenu/sources.js:12-17 ; cours/demos/*.js | Ajouter une entrée pour chaque démo à mesure des relevés |
| P10 | Délais « quelques jours » et « 2 à 6 semaines » sans source (4 lignes du relevé) | Basse | Petit | etape-2.js:141 ; demos/collecter.js | Appliquer la proposition du relevé (« cas de l'école ») |
| P11 | Le contrôle automatique ne voit que les périmètres relevés : « 0 échec » peut être lu comme « tout est sourcé » | Moyenne (risque de fausse assurance) | Moyen | outils/sources.mjs | Ajouter un indicateur de couverture : par exemple le nombre de fichiers du cours sans aucune citation ni relevé, affiché en avertissement |
| P12 | Liens bruts hors registre (17), sans date de consultation, dont 7 commerciaux ; page Patrimoine avec des références nationales « anciennes » | Moyenne | Moyen | cours/contenu/sources.js:19-87 ; cours/pages/patrimoine.js:86-87 ; commun/donnees/patrimoine.js:11-17 | Migrer vers le registre (ou retirer) ; dater les références nationales et indiquer leur millésime |
| P13 | 32 sources sans date de document (15 citées par le cours) ; toutes avec la même date de consultation | Basse | Petit à moyen | commun/donnees/sources.js | Renseigner la date de mise à jour visible sur la page, ou « page sans date » explicitement ; garder la vraie date de consultation de chaque source |
| P14 | Liens fragiles (identifiants `media/NNNN` Enedis, jeton GRDF, GitHub) ; liens non testés ici | Basse | Petit | commun/donnees/sources.js | Lancer `node outils/sources.mjs liens` ; garder le code du document (Enedis-NMO-CF_015E…) dans le titre, ce qui est déjà fait, pour retrouver un document déplacé |
| P15 | Relevé ce2-005 : « facture en retard, périodes non calendaires » classé « méthode » alors que c'est un fait | Basse | Petit | outils/sources/releve-cours-etape-2.json ; etape-2.js:19 | Requalifier en « fait » et chercher l'appui dans `mne-frequence-facturation` (à lire, pas à supposer) |
| P16 | Messages clés peu repris : « les pourcentages se multiplient » (2 lignes), « W au lieu de kW » (6), « l'objectif décide des données » (5) | Basse (pédagogie) | Petit | etape-7.js ; etape-3.js ; etape-1.js | Les reprendre dans un « à retenir », le quiz final ou une démo |

##### Questions ouvertes pour l'auteur

1. Le pas de 10 min de l'école est-il un **choix assumé** de cas d'école (compteur C4 non encore reprogrammé), ou une hypothèse à mettre à jour vers 5 min ? Cela change les 144 points de l'étape 3 et les démos.
2. Quel est l'ordre prévu pour les prochains périmètres de référencement ? Je recommande l'étape 8 (réglementaire) avant les étapes 3 à 6 (surtout méthode).
3. Les listes `sourcesData` et `sourcesEnergie` doivent-elles être réaffichées en attendant, ou retirées (et le texte de la page Sources corrigé) ?
4. Pour le décret tertiaire, quelles sources officielles voulez-vous retenir (texte consolidé, arrêtés « valeurs absolues », FAQ OPERAT) ? Avez-vous pu les lire malgré le blocage de Légifrance signalé dans le relevé ?
5. Quelle base de facteurs d'émission, et quel millésime, le cours doit-il suivre (Base Empreinte ADEME, en PCS ou en PCI pour le gaz) ?
6. La date de consultation unique (6 octobre 2026) pour 102 sources est-elle réelle ? Sinon, faut-il garder la date de chaque lecture ?
7. Les références nationales du patrimoine (155 kWh/m² pour l'enseignement, etc.) : de quel millésime d'enquête viennent-elles, et à quelle page de la synthèse ?
8. L'école (60 kVA, commune) relève-t-elle de la catégorie « PME » de l'accise ? Le relevé laisse ce point ouvert.

---

### 3.4 Axe 4 : expérience utilisateur

#### 3.4.0 Mesures de base

##### Hauteur des pages (px, `scrollHeight`)

| Page | Ordinateur | Téléphone |
|---|---|---|
| Accueil | 2 134 | 4 028 |
| Étape 1 / 2 / 3 / 4 (Essentiel) | 1 872 / 3 050 / 2 240 / 2 476 | 3 219 / 4 939 / 3 624 / 3 603 |
| Étape 5 / 6 / 7 / 8 (Essentiel) | 1 991 / 2 126 / 2 585 / 2 348 | 2 912 / 3 630 / 4 629 / 3 795 |
| Étape 3 Comprendre / Approfondir | 2 613 / 3 327 | 3 650 / 5 573 |
| Étape 6 Comprendre | 1 761 | 2 605 |
| École | 2 368 | 3 985 |
| Patrimoine | 3 319 | 5 386 |
| Sources | 3 326 | 4 882 |
| Quiz final | 1 762 | 3 418 |
| **Glossaire** | **8 143** | **18 350** |

[CONSTAT] Les pages d'étape font 2 à 3 écrans sur ordinateur et 3,5 à 6,5 écrans sur téléphone, ce qui reste raisonnable. Le glossaire, lui, fait environ 22 écrans de téléphone, sans index alphabétique ni filtre par étape.

##### Comportements testés

| Test | Résultat | Preuve |
|---|---|---|
| Bouton « Reprendre » sur l'accueil | **Absent.** Après avoir avancé, le bouton principal reste « Commencer par l'étape 1 ». La dernière page visitée n'est pas mémorisée. | `tests2.mjs` ; `pages/accueil.js:44` ; `pc-accueil-apres-progression.png` |
| Recharger la page | Garde la page et la position (le navigateur restaure scrollY = 1 131). | `tests.mjs` |
| URL partageable `#etape-3-comprendre` | **Fonctionne à l'ouverture** : l'onglet Comprendre est sélectionné. | `principal.js:107` |
| URL quand on clique sur un onglet | **Ne change pas** : l'adresse reste `#etape-3`. | `pages/etape.js:128-140` (fonction `l`) |
| Retour arrière après avoir changé d'onglet | Ramène à la page d'avant (l'accueil), pas à l'onglet d'avant. | `tests.mjs` |
| Retour arrière depuis l'étape suivante | Revient en haut de la page (scrollY = 0) : la position de lecture est perdue. | `principal.js:139` |
| Fil d'Ariane | **Absent.** Il est remplacé par « Étape N sur 8 » et le bandeau des 8 étapes. | `pages/etape.js:54` |
| Recherche | **Seulement dans le glossaire** (tiroir et pleine page). Aucune recherche dans le contenu des étapes. | `coquille/glossaire.js:80` ; `pages/glossaire.js:20` |
| Étape « faite » | Il faut l'Essentiel (marqué dès l'**ouverture** de la page) et un clic dans une démo. Un seul choix, **même faux**, suffit. Les étapes 1 et 2, avec leurs 3 onglets ouverts mais sans démo, restent « non faites ». Aucun message n'annonce qu'une étape vient d'être terminée. | `pages/etape.js:187`, `etat.js:73-76`, `demos/fiabiliser.js:397-401` |
| Indicateur de progression sur téléphone | **Masqué.** | `styles/petits-ecrans.css:46-48` |
| Pastille de l'étape en cours, bandeau du téléphone | Hors de l'écran à partir de l'étape 4 : à l'étape 7 elle est à x = 613-683 pour un écran de 390. Le bandeau ne défile pas jusqu'à elle. | `tel-etape-7-haut.png` |
| Barre du haut sur téléphone | Pas collante (`position: static`, puis `relative`) : après défilement, plus d'accès à la navigation ni aux étapes. | `petits-ecrans.css:27-28, 63-64` ; `tests.mjs` (top = −1 500) |
| Bouton flottant du glossaire sur téléphone (étape 3) | Recouvre en passant 4 éléments cliquables : 2 réponses de la démo, le terme « Horodatage », le lien « Arène 3 ». | `tests.mjs` ; `tel-etape-3-complet.png` (il chevauche aussi la carte Analogie) |
| Badges « V2/V3 à venir » | Aucun ne s'affiche : les 8 étapes ont leurs niveaux. Le code des espaces réservés n'est plus utilisé. | `pages/etape.js:15-27, 62, 107-114` ; `contenu/etape-*.js` (`niveaux:`) |
| Erreurs JavaScript | Aucune sur les 34 chargements. | `captures.mjs` |

---

#### 3.4.1 Question 1 : les informations sont-elles au bon endroit ?

**Note : 3 / 4**

##### Ce qui fonctionne

- [CONSTAT] L'Essentiel d'une étape suit un ordre clair, du plus simple au plus concret : question, phrase clé, points à retenir, analogie, schéma, démo, mots de l'étape (`pages/etape.js:50-97` ; `pc-etape-3-complet.png`). Sur ordinateur, la hiérarchie se lit bien : phrase clé en grand et en couleur, schéma à droite, démo dans un cadre distinct.
- [CONSTAT] « Les mots de cette étape » regroupe localement le vocabulaire. Les termes sont aussi expliqués au survol ou au clic, sans quitter la page.
- [CONSTAT] À la fin d'une étape, le jeu passe **après** la leçon : son bandeau est placé juste avant les liens d'étape (`coquille/jeu.js:99`). Le cours garde donc la priorité.
- [CONSTAT] Le quiz final renvoie, pour chaque erreur, à l'étape à relire (`pages/quiz-final.js:42-52`). C'est une bonne boucle de remédiation.

##### Problèmes

1. [CONSTAT] **L'école, terrain de toutes les démos, arrive en dernier sur l'accueil.** La carte « Le fil rouge » est sous le tableau de progression (`pc-accueil-complet.png`, en bas). La page « L'école » n'est reliée à aucune étape, sauf par un lien dans une démo de l'étape 2 (`demos/collecter.js:244`). Pourtant, son « Laboratoire » modifie **toutes** les démos (`pages/ecole.js:66-67`).
   - [SUPPOSITION] Un apprenant qui active une anomalie dans le laboratoire puis revient sur une étape ne comprendra pas pourquoi la démo a changé : rien ne signale sur l'étape que le laboratoire est actif.
2. [CONSTAT] **« Mode d'emploi » sur l'accueil.** Les trois cartes affichent un badge « Disponible » vert qui n'apporte rien (`pages/accueil.js:61-81`), car tout est disponible. C'est un reste de la période « V2/V3 à venir », tout comme `NIVEAUX.version` et `placeholder-niveau` dans `etape.js`.
3. [CONSTAT] **Sur ordinateur, la progression vide occupe le centre de l'accueil.** Pour un nouveau venu, c'est un tableau de 8 lignes rempli de « — » (`pc-accueil-complet.png`). Sur téléphone, ce tableau est coupé à droite : la colonne « Comprendre » est tronquée, il faut le faire défiler à l'horizontale (`tel-accueil-complet.png`).
4. [CONSTAT] **Sur téléphone, l'accueil montre deux fois les 8 étapes** (la roue, puis la liste), puis le bandeau d'étapes du haut. Cela fait trois représentations dans le premier écran et demi (`tel-accueil-complet.png`).
5. [CONSTAT] **Patrimoine** est titré « **20** Piloter un patrimoine » dans la même typographie que « 03 Fiabiliser » (`pages/patrimoine.js:41` ; `pc-patrimoine-complet.png`).
   - [SUPPOSITION] Ce « 20 » se lit comme un numéro d'étape alors qu'il s'agit de 20 sites.
   - [CONSTAT] Le seul lien de l'étape 8 vers Patrimoine est **dans le bandeau du jeu** (`coquille/jeu.js:118-122`). C'est une information du cours rangée dans une passerelle vers le jeu.
6. [CONSTAT] **Ordre de fin de parcours incohérent.**
   - Barre du haut : Quiz final, puis Sources, puis Patrimoine.
   - Liens de bas de page de Patrimoine : « 8. Mesurer » ← Patrimoine → « Quiz final » (`patrimoine.js:88`).
   - Liens de bas de page de l'étape 8 : « On boucle → 1. Cadrer », plus deux encarts « La boucle recommence » et « Quiz de synthèse » (`etape.js:119`).
   - Le quiz final, lui, ne propose aucune suite.
   - Résultat : trois récits différents de « ce qui vient après l'étape 8 ».
7. [CONSTAT] **Sources.** La page explique en 3 paragraphes que le référencement est « en cours », avant la liste (`pages/sources.js:43-47`). C'est une information sur l'état du chantier, utile à l'équipe et pas à l'apprenant.
8. [RESSENTI] La règle « étape terminée = Essentiel lu + démo manipulée » n'apparaît que dans une infobulle (`title`, `principal.js:50`), invisible au toucher et masquée sur téléphone. Il faut vérifier si les apprenants comprennent pourquoi une étape lue en entière reste « non faite ».

---

#### 3.4.2 Question 2 : est-il facile de retrouver la bonne étape ?

**Note : 3 / 4 sur ordinateur, 2 / 4 sur téléphone**

##### Ce qui fonctionne

- [CONSTAT] Sur ordinateur, le bandeau des 8 étapes est toujours visible (barre collante) : numéro, couleur de famille, étape en cours encadrée, coche une fois faite (`principal.js:62-72` ; `pc-etape-3-haut.png`).
- [CONSTAT] Chaque étape a une adresse stable, `#etape-N`. Le niveau peut être ciblé à l'ouverture (`#etape-3-comprendre`). Le titre de l'onglet du navigateur suit la page (« 3. Fiabiliser · Energy Management »).
- [CONSTAT] Les fiches du glossaire renvoient aux étapes par des badges colorés. Le tableau de progression de l'accueil relie aussi chaque ligne à son étape.
- [CONSTAT] Liens précédent/suivant en bas de chaque étape, avec numéro et titre (`etape.js:123-126`).

##### Problèmes

1. [CONSTAT] **Pas de « Reprendre là où je me suis arrêté ».** L'état garde la progression, mais pas la dernière page ni le dernier onglet (`etat.js` ; clé `ems-pedagogie-v1`). L'accueil propose toujours « Commencer par l'étape 1 », même avec des étapes faites (`tests2.mjs`). Paradoxe : le jeu, lui, a son « Reprendre le jeu » dans la barre du haut (`coquille/jeu.js:81-88`).
2. [CONSTAT] **Les onglets ne sont pas dans l'URL.**
   - Cliquer sur Comprendre laisse `#etape-3`. On ne peut donc pas copier l'adresse d'un niveau pour la partager.
   - Le retour arrière saute l'onglet.
   - Après un rechargement, on revient sur Essentiel.
   - Seule l'adresse tapée à la main avec `-comprendre` fonctionne.
3. [CONSTAT] **Sur téléphone, on perd ses repères.**
   - La barre du haut n'est pas collante.
   - La progression est masquée.
   - Le bandeau d'étapes ne montre que les étapes 1 à 4 : l'étape en cours (5 à 8) est hors champ (`tel-etape-7-haut.png`).
   - Au milieu d'une étape longue (jusqu'à 5 573 px), le seul moyen de changer d'étape est de remonter tout en haut ou de descendre jusqu'aux liens de bas de page.
4. [CONSTAT] **Pas de recherche dans le contenu.** On ne trouve un mot que s'il est dans le glossaire, puis via ses badges d'étapes. Le glossaire de 66 termes n'a ni index A-Z ni filtre par étape. Sur téléphone, la page fait 18 350 px.
5. [CONSTAT] **Libellé « Étape suivante » ambigu.** Les exemples chiffrés du niveau Comprendre ont un bouton « Étape suivante », au sens de l'étape du calcul (`pc-etape-3-comprendre-complet.png`, bloc « Un index qui recule »). Il cohabite avec le lien « Étape suivante → 4. Structurer » du bas de page.
   - [SUPPOSITION] Risque de confusion entre « étape du calcul » et « étape du cours ».
6. [CONSTAT] **Le retour arrière remet en haut de page** (`principal.js:139`). Revenir à une démo en cours oblige à défiler de nouveau.
7. [CONSTAT] **Pages sans liens de bas de page** : École, Glossaire, Quiz final et Sources se terminent sans « et maintenant ? ». La page École se termine sur le bandeau du jeu (`pc-ecole-complet.png`).
8. [RESSENTI] Le libellé « Le cycle » pour l'accueil est-il compris comme « accueil » ? Le logo mène aussi à l'accueil.

---

#### 3.4.3 Question 3 : les boutons et les informations sont-ils placés au bon endroit ?

**Note : 2,5 / 4**

##### Ce qui fonctionne

- [CONSTAT] Sur l'accueil, l'action principale « Commencer par l'étape 1 » est visible dès le premier écran, sur ordinateur comme sur téléphone. Elle est sombre et pleine, avec le jeu en action secondaire bordée (`pc-accueil-complet.png`, `tel-accueil-haut.png`).
- [CONSTAT] Les liens précédent/suivant ont la même forme et la même place sur toutes les étapes et sur Patrimoine (`.pager`).
- [CONSTAT] Fin de l'Essentiel : un encart « Tu as compris l'idée ? → Passer à Comprendre » (`etape.js:97`). Le défilement place bien les onglets sous la barre (onglets à y = 130 px sur ordinateur).
- [CONSTAT] Les onglets tiennent sur une ligne sur téléphone (`tel-etape-3-haut.png`).

##### Problèmes

1. [CONSTAT] **Trois appels à l'action concurrents en bas de l'Essentiel** (`pc-etape-3-complet.png`, `tel-etape-3-bas.png`) :
   - « Passer à Comprendre » : bouton primaire noir ;
   - « ▶ Commencer le jeu » : gros bloc bleu plein, visuellement **plus fort** ;
   - les liens précédent/suivant.

   [SUPPOSITION] Le bouton bleu du jeu, plus saillant, détourne de la suite logique du cours.
2. [CONSTAT] **Pas de bouton « Passer à Approfondir » en fin de Comprendre**, ni « Étape suivante » en fin d'Approfondir (`tests.mjs` : 0 bouton `[data-aller]` dans `#pan-comprendre`). La progression entre niveaux n'est guidée qu'une seule fois.
3. [CONSTAT] **Accueil : deux boutons primaires** dans des zones voisines, « Commencer par l'étape 1 » et « Quiz de synthèse ». Le quiz est présenté en primaire alors que 0 étape est faite (`accueil.js:91`).
4. [CONSTAT] **Bouton flottant du glossaire sur téléphone.**
   - Il recouvre des réponses de démo, un terme et le lien « Arène 3 » quand on défile.
   - En haut de l'étape, il cache le texte de la carte Analogie (`tel-etape-7-haut.png`, `tel-etape-3-complet.png`).
   - En fin de page, il touche presque le lien « Étape suivante » (`tel-etape-3-bas.png`).
   - C'est une icône seule, sans libellé visible.
   - Il reste affiché sur la page Glossaire elle-même.
5. [CONSTAT] **Menu du téléphone.** Il s'ouvre **sous** le bandeau des étapes et recouvre le haut du contenu. « Le jeu », en orange, se distingue des autres entrées (`tel-menu-ouvert.png`). Aucun bouton « Fermer » visible : on referme avec le même bouton « Menu » ou avec Échap.
6. [CONSTAT] **La progression ne donne aucun retour au bon moment.** Le premier clic dans la démo (même une mauvaise réponse) fait passer l'étape à « faite ». Seule une petite coche apparaît dans le bandeau : aucun message, aucune annonce `aria-live` (`tests2.mjs`). À l'inverse, lire Comprendre et Approfondir sans toucher de démo ne compte pas.
   - [RESSENTI] Faut-il que « faite » demande plus qu'un clic ? À trancher avec l'équipe pédagogique.
7. [CONSTAT] **« Effacer ma progression »** est un lien discret sous le tableau. Il demande une confirmation en 2 clics, ce qui est bien. Mais il est seul, loin du bouton « Se connecter » auquel la note renvoie (« en haut à droite »).
8. [CONSTAT] **Le bandeau du jeu colle** au bloc précédent sur la page École (`margin: 0 0 8px`, `bandeau-jeu.css:13` ; `pc-ecole-complet.png`). Sur ordinateur, son bouton est à droite, à un autre endroit que les boutons primaires du cours, qui sont à gauche ou centrés.

---

#### 3.4.4 Problèmes de l'axe expérience utilisateur (numérotés UX-1 à UX-17)

| # | Problème | Gravité | Effort | Fichiers | Correction recommandée |
|---|---|---|---|---|---|
| 1 | Pas de « Reprendre » : dernière page et dernier onglet non mémorisés, l'accueil propose toujours l'étape 1 | **Haute** | Petit | `coquille/etat.js`, `principal.js` (`afficherRoute`), `pages/accueil.js:44` | Enregistrer `derniere: "etape-3-comprendre"` à chaque route. Sur l'accueil, si une progression existe, transformer le bouton primaire en « Reprendre : 3. Fiabiliser · Comprendre » et garder « Recommencer à l'étape 1 » en secondaire. |
| 2 | Onglets absents de l'URL : pas de partage, le retour arrière et le rechargement perdent le niveau | **Haute** | Petit | `pages/etape.js:128-140`, `principal.js:107` | Au changement d'onglet, `history.replaceState` (ou `pushState`) vers `#etape-N-niveau`, sans relancer le routeur. |
| 3 | Téléphone : barre du haut pas collante, progression masquée, étape en cours hors champ dans le bandeau | **Haute** | Moyen | `styles/petits-ecrans.css:27-48`, `principal.js:62-72` | Garder une barre compacte collante (ou la faire réapparaître quand on remonte). Faire défiler le bandeau jusqu'à l'étape en cours (`scrollIntoView({inline:"center"})`). Afficher « 3/8 » à côté. |
| 4 | Bouton flottant du glossaire qui recouvre du contenu sur téléphone, visible sur la page Glossaire | Moyenne | Petit | `styles/glossaire.css:41-63`, `principal.js:57` | Le cacher sur `#glossaire`. Sur téléphone, le réduire ou le placer dans la barre du haut. Ajouter un `padding-bottom` à `main` égal à sa hauteur. Lui donner un libellé visible « Glossaire » sur ordinateur. |
| 5 | Pas de bouton vers le niveau suivant en fin de Comprendre et d'Approfondir | Moyenne | Petit | `pages/etape.js:97-117` | Ajouter en fin de Comprendre « Passer à Approfondir → ». En fin d'Approfondir, un encart « Étape suivante : N+1 ». |
| 6 | Le bloc bleu du jeu est plus saillant que la suite du cours | Moyenne | Petit | `styles/bandeau-jeu.css`, `coquille/jeu.js` | Passer « Commencer le jeu » en style secondaire (bordé) dans les étapes. Garder un seul bouton primaire par fin de section. |
| 7 | Ambiguïté « Étape suivante » dans les exemples chiffrés | Moyenne | Petit | `cours/blocs/blocs.js:56` | Renommer en « Calcul suivant » ou « Ligne suivante ». |
| 8 | Ordre de fin de parcours incohérent (étape 8, Patrimoine, quiz final), Patrimoine relié seulement depuis le bandeau du jeu | Moyenne | Petit | `pages/etape.js:119-126`, `pages/patrimoine.js:41,88`, `coquille/jeu.js:118-122`, `principal.js:36-43` | Choisir une suite unique, par exemple 8 → Patrimoine → Quiz final. Mettre le lien Patrimoine dans le contenu de l'étape 8, pas dans le bandeau du jeu. Remplacer le « 20 » du titre par un badge « Bonus » ou « Au-delà ». Aligner l'ordre de la barre du haut. |
| 9 | Laboratoire de l'école global et invisible depuis les étapes | Moyenne | Moyen | `pages/ecole.js:66-80`, `pages/etape.js` | Sur une étape, afficher un bandeau « Laboratoire actif : 2 anomalies, [modifier] [désactiver] » quand `anomalies` ou `derives` ne sont pas vides. |
| 10 | Pas de recherche dans le contenu ; glossaire très long sans index | Moyenne | Moyen | `pages/glossaire.js` | Ajouter un index A-Z collant et un filtre par étape (les données `terme.etapes` existent). Une recherche plein texte des étapes est un effort grand, à valider par le besoin réel. |
| 11 | Étape « faite » au premier clic, même faux, sans aucun retour visible | Moyenne | Petit | `coquille/etat.js:73-76`, `principal.js:59-72` | Afficher un message bref « Étape 3 terminée ✓ » (avec `aria-live`). Écrire la règle sous le tableau de l'accueil plutôt que dans un `title`. Revoir le critère avec l'équipe pédagogique. |
| 12 | Retour arrière ramené en haut de page | Basse | Petit | `principal.js:139` | Mémoriser `scrollY` par route dans `sessionStorage` et le restaurer quand on arrive par `popstate`. |
| 13 | Accueil : badges « Disponible », progression vide au centre, deux boutons primaires, école en fin de page, triple affichage des étapes sur téléphone | Basse | Petit | `pages/accueil.js:53-110`, `styles/accueil.css` | Retirer les badges. Masquer le tableau quand la progression est vide (ou le replier). Passer « Quiz de synthèse » en secondaire. Remonter la carte École avant la progression. Sur téléphone, masquer la roue ou la liste. |
| 14 | Code mort « V2/V3 à venir » et espaces réservés | Basse (maintenance) | Petit | `pages/etape.js:15-27, 62, 107-114` ; `avenir` dans `contenu/etape-*.js` | Supprimer, ou documenter que c'est un mécanisme de secours. |
| 15 | Pages École, Glossaire, Quiz final et Sources sans suite | Basse | Petit | `pages/*.js` | Ajouter un lien de fin (« Retour au cycle », « Reprendre l'étape N »). |
| 16 | Page Sources : texte « référencement en cours » placé avant la liste | Basse | Petit | `pages/sources.js:43-47` | Le déplacer après la liste, ou le replier. |
| 17 | Tableau de progression coupé sur téléphone | Basse | Petit | `pages/accueil.js:92`, `styles/petits-ecrans.css` | Sur téléphone, remplacer le tableau par une liste de lignes : étape, 5 pastilles, score. |

---

#### 3.4.5 À valider avec de vrais apprenants

Ces points relèvent du [RESSENTI] et ne peuvent pas être tranchés par le seul audit :

- Le bouton bleu du jeu détourne-t-il vraiment de « Passer à Comprendre » ? Mesurer les clics, ou faire un test d'observation en 5 secondes.
- « Le cycle » est-il compris comme le lien vers l'accueil ?
- Les apprenants trouvent-ils le glossaire via l'icône flottante sans libellé ?
- Comprennent-ils pourquoi une étape reste « non faite » ?
- Le « 20 » de Patrimoine est-il lu comme un numéro d'étape ?
- Les démos modifiées par le laboratoire désorientent-elles ?

Les longueurs de page (étapes de 3 à 6,5 écrans sur téléphone) semblent acceptables, mais le taux d'abandon par niveau, visible dans le suivi d'audience (`coquille/suivi-cours.js`, événement `course_tab`), permettrait de le confirmer.

---

## 4. Tableau des messages clés du cours

**Méthode de comptage (CONSTAT)** : script `compter.mjs`. Pour chaque message, une expression régulière (insensible à la casse, donnée dans `messages.json` / `m2.json`) est appliquée **ligne par ligne** aux fichiers `.js` de `cours/contenu`, `cours/demos`, `cours/pages`, `cours/schemas` et `commun/donnees`. Sont exclus : `commun/donnees/sources.js` et `cours/contenu/sources.js` (titres de sources), `cours/modele/` (code de calcul), les lignes de commentaire et d'import. Le chiffre est un **nombre de lignes** qui contiennent l'expression, pas un nombre de phrases. Une ligne de tableau ou un paragraphe compte pour 1 même s'il cite le mot deux fois. Il reste un peu de bruit (par exemple « référence » est polysémique), et ces nombres sont donc des **ordres de grandeur fiables à ±20 %**. Le détail par fichier est dans `comptes.tsv`.

Abréviations des formes : PC = phrase clé, AR = à retenir, AN = analogie, SC = schéma, DE = démo, TX = texte / tableau / exemple (Comprendre / Approfondir), QZ = mini-quiz, QF = quiz final, GL = glossaire, PE = page école, PP = page patrimoine, AC = page d'accueil.

| # | Message | Étape(s) | Forme(s) | Reprises (lignes) | Source citée |
|---|---|---|---|---|---|
| 1 | Le cycle est une boucle : après Mesurer on revient à Cadrer (logique ISO 50001) | 8 (et accueil) | PC, AR, SC (cycle, mesurer), TX, QZ, QF, GL, AC | 21 | Aucune par fait. Seulement la liste générique `sourcesEnergie` en bas d'É8 (lien ministère « norme NF ISO 50001 », hors registre) |
| 2 | On délimite d'abord un périmètre (patrimoine → site → bâtiment → point → usage) | 1 (rappels 2, 8, patrimoine) | PC, AR, SC, DE (perimetre), TX (tableau), QF, PP | 17 | Aucune (méthode : sans objet) |
| 3 | Le PDL (PRM) a 14 chiffres ; le PCE en général 14 chiffres, anciens « GI » + 6 chiffres | 1 | TX, DE (identifiants), QZ, GL | 5 | Dans É1 : **aucune**. Glossaire : `enedis-pdl` (Enedis, « Où trouver le numéro point de livraison (PDL) du compteur Linky ? », 26 août 2026) ; `grdf-guide-donnees-2026` (GRDF, Guide utilisateur « gestion avancée des données de consommation », v1.6, 28 janvier 2026). Le format « GI + 6 chiffres » : aucune |
| 4 | Un identifiant désigne un point de raccordement, pas un appareil | 1 | TX, QZ, QF | 5 | Aucune |
| 5 | Un compteur mesure un point, pas un usage : « mesuré ou estimé ? » | 1 | TX (encadré), DE (usages), QZ | 6 | Aucune (méthode) |
| 6 | L'objectif (économie, budget, réglementation, climat) décide des données à collecter | 1 | AR, TX, DE (perimetre), QZ | 5 | Aucune (méthode) ; le seuil de 1 000 m² cité dans le même paragraphe n'est pas sourcé |
| 7 | La donnée arrive par trois canaux : télérelevé, index, facture | 2 | PC, AR, AN, SC, DE (collecter, troisVoies), TX (tableau), QF | 10 | `grdf-adict-faq` (GRDF, FAQ du portail API ADICT, s.d.), `mne-compteurs-communicants` (Médiateur national de l'énergie, « Les compteurs communicants Linky et Gazpar », 27 mai 2025), `mne-releve-compteur` (MNE, « Relevé des compteurs et calcul de la consommation », 4 novembre 2025) ; démo `collecter` : 6 sources |
| 8 | Télérelevé = analyser, index = contrôler, facture = chiffrer le coût | 2 | TX (« Message clé n° 1 »), tableau, DE (troisVoies), QF | 5 | Partielle : `enedis-guide-flux-r6x` (Enedis, Guide d'implémentation des flux R6X v2.0, 29 novembre 2023) pour l'index ; le reste est classé « méthode » |
| 9 | Le distributeur mesure, le fournisseur facture | 2 | TX, QZ, GL, DE (cadrer, anatomieFacture) | 3 (+ GL) | `mne-releve-compteur`, `mne-compteurs-communicants`, `mne-acteurs-marche` (MNE, « Les acteurs du marché », 22 mai 2025) |
| 10 | Pas de donnée de mesure sans consentement du titulaire | 2 | TX, DE (consentement), QZ, QF, GL | 33 | `enedis-nmo-cf-015e` (Enedis-NMO-CF_015E v2, 3 juillet 2026), `grdf-adict-faq`, `enedis-contrat-data-connect` (Enedis-MOP-NUM_010E, 15 septembre 2025), `enedis-contrat-sge` (Enedis-MOP-CF_054E v1.2, 1er juin 2026) |
| 11 | La courbe électrique est au pas de 10 min (144 points par jour) | 1, 2, 3, 4 (école) | AR (É2, É3), TX, DE (structurer, fiabiliser), QZ, QF, GL, PE | 35 | É2 `[[grdf-adict-faq,mne-compteurs-communicants]]` sur la phrase, mais verdict du relevé **« à corriger »** (ce2-002, ce2-046, ce2-075) : 5 min depuis fin 2025, 30 min pour Linky (`enedis-nmo-cf-015e`, `enedis-nmo-cf-077e`). É3, É4, glossaire, page école : aucune |
| 12 | Index : différence de deux relevés ; attention au bouclage | 2, 3 | AR, TX, DE (casIndex), QZ, QF, GL | 11 | `mne-releve-compteur` (AR É2) ; démo casIndex : `enedis-turpe7-brochure` (Enedis, brochure TURPE 7 HTA/BT, 1er août 2026). Bouclage lui-même : aucune |
| 13 | kWh = m³ × coefficient de conversion (9 à 12,5 kWh/m³) | 2, 4 | TX, QZ, AR (É4), TX (É4), QF, GL | 8 | É2 : `mne-coefficient-conversion` (MNE, glossaire, s.d.), `grdf-guide-donnees-2026`, `grdf-coefficient-conversion` (GRDF, s.d.). É4 et quiz final (« ≈ 11 kWh/m³ ») : aucune |
| 14 | La facture arrive en retard, sur des périodes qui ne suivent pas les mois | 2, 4 | AR, QZ, DE (rattachement), QZ É4 | 8 | Aucune (relevé ce2-005 : classé « méthode / sans objet », voir §2) ; délai « 2 à 6 semaines » **sans source** (ce2-052) |
| 15 | Complétude : 144 points par jour, 138 ou 150 les jours de changement d'heure | 3 (4) | AR, TX (tableau), DE (fiabiliser, changementHeure), QZ, QF | 34 | Aucune (calcul) |
| 16 | Stocker les horodatages en UTC | 3, 4 | TX, DE (changementHeure, fiabiliser), QZ, GL | 26 | Aucune (« UTC+1 en hiver, UTC+2 en été » non sourcé) |
| 17 | On ne corrige jamais en silence : on garde la donnée brute et un statut | 3, 4 | AR, TX (tableau des statuts), QZ, GL | 21 | Aucune (méthode) |
| 18 | Une courbe contient des kW : énergie = Σ P × durée du pas (÷ 6 au pas de 10 min) | 3, 4 | TX, exemple, QZ (É3, É4), DE | 29 | Aucune (physique / calcul) |
| 19 | Piège d'unités : W au lieu de kW, m³ contre kWh, kVA contre kW | 2, 3 | TX, encadré QA, QZ | 6 | Aucune |
| 20 | Agréger change le pas mais pas l'énergie totale ; ça cache les pointes | 4 | AR, DE (structurer), QZ | 5 | Aucune (calcul) |
| 21 | Un sous-compteur ne s'additionne pas à son compteur parent | 1, 4 | TX (encadrés), DE (agregationSite), QZ, GL | 19 | Aucune (méthode) |
| 22 | Tout ce qui change porte des dates de validité (compteur, contrat, surface) | 1, 4 | TX, tableau, QZ | 5 | Aucune (méthode) |
| 23 | Le talon (bâtiment vide) pèse lourd : plus de la moitié de l'électricité | 5, 6 | AR, SC, DE (analyser), TX, QZ, GL | 36 | Aucune (école fictive) |
| 24 | DJU base 18 °C : le chauffage suit la météo | 5, 8 | AR, TX, encadré, QZ, QF, GL, DE (signature, mesurer) | 62 | Aucune (convention 18 °C, méthode « météo », COSTIC, Météo-France : non sourcés) |
| 25 | Signature énergétique E = a + b × DJU | 5 | TX, DE (signature), GL | 10 | Aucune |
| 26 | Les ratios (kWh/m², kWh/élève) rendent comparables, mais toujours avec le contexte | 5, 8, patrimoine | TX (exemple, tableau), QZ, DE (indicateurs), PP | 44 | Aucune au registre. Page patrimoine : 3 liens bruts (ADEME « Énergie et patrimoine communal » via banquedesterritoires.fr, data.ademe.fr, blog lsmart.co), hors registre |
| 27 | Puissance souscrite : sur-souscription (on paie pour rien) ou dépassement (pénalités) | 4, 5, 6, 7 | TX, DE (puissance), QZ, GL | 36 | Aucune (tarif fictif, « calcul simplifié ») |
| 28 | Sans référence (baseline), pas de détection | 6 | AR, TX (tableau), QF, GL | 7 | Aucune (méthode) |
| 29 | Seuil et persistance : arbitrage faux positifs / faux négatifs | 6 | TX, DE (seuilDetection), QZ, GL | 14 | Aucune (méthode) |
| 30 | On détecte sur des données fiabilisées | 6 (3) | AR, TX, QZ | 6 | Aucune (méthode) |
| 31 | Agir du moins cher au plus lourd : sobriété → contrat → investissement | 7 | PC, AR, AN, SC, TX (tableau), DE (agir), QZ, QF, GL | 17 | Aucune |
| 32 | Deux actions de 10 % font 19 %, pas 20 % | 7 | encadré QA, QZ | 2 | Aucune (calcul) |
| 33 | Temps de retour simple = investissement / économie annuelle ; c'est un premier filtre | 7 | TX, DE (agir, autoconso), QZ, GL | 12 | Aucune |
| 34 | Autoconsommation : taux d'autoconsommation ≠ taux d'autoproduction | 7 | TX, DE (autoconso), QZ, GL | 16 | Aucune |
| 35 | Mesurer une économie à conditions comparables (M&V, correction climatique, IPMVP) | 5, 8 | AR, AN, TX (exemple), DE (mesurer), QZ, QF, GL | 22 | Aucune |
| 36 | Décret tertiaire : ≥ 1 000 m², −40 % / −50 % / −60 % en 2030 / 2040 / 2050, ou seuil en valeur absolue | 1, 4, 5, 8 | AR (É1), TX, DE (decretTertiaire), QZ, GL | 23 | **Aucune** au registre. Seulement `sourcesEnergie` en bas d'É8 : Veolia, Hellio, Lowit (sites commerciaux, hors registre) |
| 37 | Déclaration annuelle sur OPERAT (ADEME) avant le 30 septembre | 1, 8 | TX, QZ, GL, DE | 14 | Aucune (même remarque) |
| 38 | Le gaz émet environ 4 fois plus de CO2 par kWh que l'électricité française | 7, 8 | TX (exemple, tableau), DE (indicateurs), QZ, GL | 25 | Aucune au registre ; Selectra (secondaire, hors registre) dans `sourcesEnergie` |
| 39 | ISO 50001 : démarche d'amélioration continue, sans objectif chiffré (version 2018 + amendement 2024) | 8 | AR, tableau, note, QZ, QF, GL | 10 | `sourcesEnergie` (ministère, iteh.ai), hors registre |
| 40 | La courbe de charge d'un logement est une donnée personnelle (RGPD) | 2 | TX (encadré), GL | 7 | `cnil-linky-courbe-de-charge` (CNIL, 30 novembre 2015), `cnil-deliberation-2012-404` (CNIL, 15 novembre 2012), `cnil-donnee-personnelle` (CNIL, s.d.), `cnil-rgpd` (CNIL, 10 avril 2018) |

Synthèse (CONSTAT) : sur 40 messages clés, **9 renvoient à une source du registre**, et tous sont à l'étape 2 (n° 7, 8 partiellement, 9, 10, 11 à corriger, 12, 13, 40, plus n° 3 par le seul glossaire). Les messages des étapes 3 à 8 sont surtout de la méthode et du calcul, qui n'ont pas besoin de source (README, l. 61). Mais les n° 24, 35, 36, 37, 38 et 39 portent des faits et des règles qui en demandent une.

---

## 5. Liste des problèmes, classés par priorité

### Comment j'ai classé

La priorité croise deux choses : la **gravité pour l'apprenant** (il apprend quelque chose de faux, il est bloqué, il est gêné, ou c'est du confort) et l'**effort de correction** (petit : moins d'une demi-journée ; moyen : un à trois jours ; grand : plus).

Les tableaux détaillés de chaque axe (section 3) gardent la numérotation propre à chaque axe. Les renvois ci-dessous utilisent ces préfixes :
- **PÉD-** : pédagogie ;
- **A11Y-** : accessibilité ;
- **MÉT-** : métier ;
- **UX-** : expérience utilisateur.

### Priorité 1 : graves et faciles à corriger (à faire d'abord)

| # | Problème | Axe | Effort | Fichiers | Correction recommandée |
|---|---|---|---|---|---|
| 1 | Le schéma de l'étape 8 affiche « −27 % à météo et occupation égales ». Or la démo juste en dessous enseigne que −27 % est le chiffre **brut** et −15 % l'effet corrigé. Le schéma enseigne donc le contraire de la leçon. (PÉD-P1) | Pédagogie, Métier | Petit | `cours/schemas/mesurer.js:12-13` | Afficher « −15 % à conditions égales (−27 % brut) », ou deux libellés brut / corrigé. |
| 2 | Exemple faux à l'étape 3 : « 413 → 404, deux chiffres inversés ». Ce n'est pas une inversion de chiffres. (MÉT-P5) | Métier, Pédagogie | Petit | `cours/contenu/etape-3.js:68` | Dire « erreur de saisie », ou prendre un vrai cas d'inversion qui fait reculer l'index. |
| 3 | Quiz de l'étape 5 : « elle a souscrit 100 kVA », alors que l'école a 60 kVA partout ailleurs. (PÉD-P4) | Pédagogie | Petit | `cours/contenu/etape-5.js:162` | « Si l'école avait souscrit 100 kVA… » |
| 4 | La page Sources promet que les étapes non référencées « gardent leur liste de liens » et que « chaque fait renvoie à une source ». En réalité, les étapes 1 et 3 à 7 n'affichent **aucune** source : les listes sont importées mais jamais affichées. (MÉT-P1) | Métier | Petit | `cours/pages/sources.js:45-47`, `cours/contenu/etape-1,3,4,5,6,7.js` | Corriger le texte (seule l'étape 2 est référencée), ou réafficher les listes en attendant. |
| 5 | La fenêtre « Mon compte » est inutilisable au clavier et au lecteur d'écran : le focus n'y entre jamais, car `focus()` est appelé avant l'insertion dans la page. (A11Y-1) | Accessibilité | Petit | `commun/fenetre-compte.js:100,162-164` | Insérer la fenêtre avant de placer le focus, piéger Tab dans la fenêtre, rendre le fond inerte. |
| 6 | Pas de « Reprendre ». L'accueil propose toujours « Commencer par l'étape 1 », et la dernière page lue n'est pas mémorisée. (UX-1) | UX | Petit | `cours/coquille/etat.js`, `cours/principal.js`, `cours/pages/accueil.js:44` | Mémoriser la dernière route et afficher « Reprendre : 3. Fiabiliser · Comprendre » en action principale. |
| 7 | Les onglets ne sont pas dans l'adresse. On ne peut pas partager un niveau, et le retour arrière comme le rechargement le perdent. (UX-2) | UX | Petit | `cours/pages/etape.js:128-140` | `history.replaceState` vers `#etape-N-niveau` à chaque changement d'onglet. |
| 8 | Le focus est perdu (il retombe sur `body`) après une réponse au quiz et après « Tout afficher » dans l'exemple pas à pas. Le score n'est pas annoncé. (A11Y-2, A11Y-14) | Accessibilité | Petit | `cours/blocs/quiz.js:240-257`, `cours/blocs/blocs.js:440-464` | Placer le focus sur le retour de correction (`tabindex=-1`), et ajouter une région live permanente pour le score. |
| 9 | Promesses de l'accueil à revoir : « 30 secondes » par Essentiel, alors qu'il compte 231 à 442 mots plus une démo ; public annoncé « développeurs et testeurs », alors que le public décidé est **tous les salariés**. Les encadrés « Pour tester le logiciel » ne concernent pas ce public. (PÉD-P9, PÉD-P18) | Pédagogie | Petit | `cours/pages/accueil.js:34,60`, blocs `ton: "qa"` de `cours/contenu/etape-*.js` | Réécrire l'accroche pour tous les salariés ; annoncer « 2 à 5 minutes » ; replier les encadrés « Pour tester le logiciel » (ou les retirer). |
| 10 | Tableaux sans titre associé (36 sur 36) et sans en-têtes de ligne. (A11Y-5) | Accessibilité | Petit | `cours/blocs/blocs.js:391`, `cours/blocs/graphique.js:212-217`, `cours/pages/accueil.js:92,142` | Ajouter `<caption>`, mettre la première colonne en `<th scope="row">`, nommer le `<th>` vide. |

### Priorité 2 : graves, effort moyen (à planifier)

| # | Problème | Axe | Effort | Fichiers | Correction recommandée |
|---|---|---|---|---|---|
| 11 | Réglementation sans source officielle. Concerne : décret tertiaire (1 000 m², −40/−50/−60 %, années de référence 2010-2022, 30 septembre, 7 500 €), OPERAT, ISO 50001, IPMVP, facteurs CO₂. Les seuls liens sont des sites commerciaux hors registre. Tous ces points sont « à vérifier ». (MÉT-P2) | Métier | Moyen | `cours/contenu/etape-1.js:121`, `etape-8.js:102-142`, `commun/donnees/glossaire.js`, `cours/demos/decret-tertiaire.js`, `cours/contenu/sources.js:58-87` | Faire le relevé du périmètre « Cours · étape 8 » avec la même méthode que l'étape 2 ; ajouter les textes officiels au registre après les avoir lus. |
| 12 | La progression mesure une visite et un clic, pas un apprentissage : « faite » au premier clic, même faux, et sans aucun retour visible. (PÉD-P3, UX-11) | Pédagogie, UX | Petit à moyen | `cours/pages/etape.js:142,155,188,195`, `cours/coquille/etat.js:74-77` | Règle décidée (« manipulée ») : Essentiel réellement affiché + démo de l'Essentiel menée jusqu'à son résultat ; mention « maîtrisée ★ » à part si le mini-quiz est réussi ; message « Étape 3 terminée » ; règle écrite sous le tableau de progression. |
| 13 | Aucun objectif d'apprentissage, ni global ni par étape. (PÉD-P2) | Pédagogie | Moyen | `cours/contenu/etape-*.js`, `cours/pages/etape.js`, `cours/pages/accueil.js` | Ajouter « À la fin de cette étape, tu sauras… » (2 ou 3 verbes observables) sous la question. |
| 14 | Sur téléphone : barre du haut qui défile avec la page, progression masquée, étape en cours (5 à 8) hors de l'écran dans le bandeau. (UX-3) | UX | Moyen | `cours/styles/petits-ecrans.css:27-48`, `cours/principal.js:62-72` | Garder une barre compacte collante ; faire défiler le bandeau jusqu'à l'étape en cours ; afficher « 3/8 ». |
| 15 | Les courbes de charge de plus de 60 points n'ont ni tableau ni description. Le nuage de points (DJU) est absent du tableau. L'infobulle n'est pas annoncée et ne se ferme pas avec Échap. (A11Y-3, A11Y-4) | Accessibilité | Moyen | `cours/blocs/graphique.js:34-36,204-221,268-284` | Résumé en texte (minimum, maximum, talon, pics, jours en alerte) ou tableau agrégé ; `aria-live` sur l'infobulle ; touche Échap. |
| 16 | Pas de temps de 10 min présenté comme la règle générale. Le relevé de l'étape 2 note 5 min depuis fin 2025 et 30 min pour Linky (3 lignes « à corriger » encore ouvertes). (MÉT-P3) | Métier | Petit | `cours/contenu/etape-2.js:17,137`, `cours/demos/collecter.js`, `commun/donnees/glossaire.js:40,47,283`, `commun/donnees/ecole.js:66` | Décision : on garde 10 min pour l'école. Écrire partout « au pas de 10 min, celui de l'école », et signaler une fois, avec sa source, que les compteurs réels sont souvent à 5 min (plus de 36 kVA) ou à 30 min (Linky). |

### Priorité 3 : gênes réelles (moyennes, effort petit ou moyen)

| # | Problème | Axe | Effort | Fichiers | Correction recommandée |
|---|---|---|---|---|---|
| 17 | Ordre des leviers de l'étape 7 : l'Essentiel dit « sobriété → contrat → efficacité », le quiz et le tableau disent « sobriété, efficacité, production ». (PÉD-P5) | Pédagogie, Métier | Petit | `cours/contenu/etape-7.js:14-17` + quiz, `cours/schemas/agir.js` | Harmoniser. |
| 18 | Petites incohérences chiffrées : PCI/PCS du gaz non expliqué ; 130 contre 134 kWh/DJU ; 1 220 contre 1 290 €/an ; 27 contre 30 €/an ; abonnement et puissance souscrite contradictoires entre l'étape 7 et le glossaire. (PÉD-P13, MÉT-P4, MÉT-P6, MÉT-P7) | Métier | Petit | `etape-7.js:56-80,138`, `etape-8.js:101-102`, `commun/donnees/references.js:43-46`, `glossaire.js:387,392`, `cours/demos/agir.js` | Afficher le facteur qui sert au calcul, avec son unité ; aligner les valeurs ; trancher la question de l'abonnement avec une source. |
| 19 | Infobulles absentes de Comprendre et Approfondir aux étapes 3 et 4 (et de Comprendre aux étapes 6 et 7). 16 termes du glossaire ne sont jamais liés dans le texte. Notions du cycle absentes du glossaire : périmètre, dérive, pointe, anomalie, indicateur, plan d'action, PCI, R²… (PÉD-P6, PÉD-P7) | Pédagogie | Moyen | `cours/contenu/etape-2,3,4,6,7.js`, `commun/donnees/glossaire.js` | Lier `{{terme}}` à la première occurrence de chaque onglet ; créer les entrées manquantes. |
| 20 | Notions utilisées avant d'être expliquées : talon et DJU dans la fiche de cadrage de l'étape 1, « Contrat de 60 kVA » dans la démo de l'étape 1. (PÉD-P8) | Pédagogie | Petit | `cours/demos/perimetre.js:15,26,37`, `cours/demos/cadrer.js` | Infobulle, ou « (vu à l'étape 5) ». |
| 21 | Fin d'Essentiel : le gros bloc bleu « Commencer le jeu » est plus saillant que « Passer à Comprendre ». Rien ne mène de Comprendre à Approfondir. (UX-5, UX-6, PÉD-P12) | UX | Petit | `cours/styles/bandeau-jeu.css`, `cours/coquille/jeu.js`, `cours/pages/etape.js:97-117` | Un seul bouton principal par fin de section ; jeu en style secondaire ; ajouter « Passer à Approfondir ». |
| 22 | Sur téléphone, le bouton rond du glossaire recouvre des réponses de démo et des liens ; il reste affiché sur la page Glossaire elle-même. (UX-4) | UX | Petit | `cours/styles/glossaire.css:41-63`, `cours/principal.js:57` | Le masquer sur `#glossaire`, réserver la place en bas de page, ou le déplacer dans la barre du haut. |
| 23 | Contrastes. Thème clair : dates des sources à 3,62:1, `.badge.ok` à 4,37:1. Bordures de champ et piste des interrupteurs à 1,36:1. Focus des lignes du Pareto à 1,12:1. Contour de focus orange à 2,85:1 sur fond clair. (A11Y-7, A11Y-8, A11Y-9) | Accessibilité | Petit | `commun/styles/jetons.css`, `cours/styles/niveaux.css:426-429`, `cours/styles/elements.css:35`, `cours/styles/controles.css:57-99`, `commun/graphiques/graphiques.css:50-54`, `cours/styles/base.css:56-60` | Un jeton dédié aux contours d'au moins 3:1, retirer `opacity:.75`, contour de focus plus foncé en clair. |
| 24 | Hiérarchie de titres incohérente (h1 → h3 → h2). Messages de statut non annoncés (recherche du glossaire, score, 10 démos). Bulle du glossaire impossible à survoler. Cases à cocher sœurs non regroupées. Champ « Identifiant » sans étiquette visible. (A11Y-6, A11Y-10 à A11Y-13) | Accessibilité | Petit à moyen | voir les problèmes A11Y-6, A11Y-10 à A11Y-13 en section 3.2 | Voir section 3.2. |
| 25 | L'Approfondir de l'étape 2 est très dense (1 037 mots, 4,6 écrans) et la liste « Les mots de cette étape » y affiche 33 termes. (PÉD-P10, PÉD-P9) | Pédagogie | Moyen | `cours/contenu/etape-2.js`, `cours/pages/etape.js:43-45` | Replier les encadrés facultatifs ; limiter la liste aux termes de l'Essentiel. |
| 26 | Suite après l'étape 8 racontée de trois façons. Patrimoine n'est relié que depuis le bandeau du jeu, et titré « 20 » comme une étape. (UX-8) | UX | Petit | `cours/pages/etape.js:119-126`, `cours/pages/patrimoine.js:41,88`, `cours/coquille/jeu.js:118-122`, `cours/principal.js:36-43` | Choisir une seule suite (par exemple 8 → Patrimoine → Quiz final) ; badge « Bonus » au lieu de « 20 ». |
| 27 | Le laboratoire de l'école modifie toutes les démos sans que rien ne le signale sur les étapes. (UX-9) | UX | Moyen | `cours/pages/ecole.js:66-80`, `cours/pages/etape.js` | Bandeau « Laboratoire actif : 2 anomalies [désactiver] » sur les étapes. |
| 28 | Sources incomplètes : 23 démos sur 27 et 37 termes du glossaire sur 66 sans source ; 17 liens hors registre, dont 7 commerciaux ; 32 sources sans date ; le contrôle automatique ne mesure pas la couverture. (MÉT-P8, MÉT-P9, MÉT-P11, MÉT-P12, MÉT-P13) | Métier | Moyen | `commun/donnees/glossaire.js`, `commun/donnees/sources.js`, `cours/contenu/sources.js`, `outils/sources.mjs` | Avancer périmètre par périmètre ; ajouter un indicateur de couverture au contrôle. |
| 29 | Glossaire de 18 350 px sur téléphone, sans index A-Z ni filtre par étape ; pas de recherche dans le contenu. (UX-10) | UX | Moyen | `cours/pages/glossaire.js` | Index A-Z collant et filtre par étape. |

### Priorité 4 : améliorations (faible gravité)

| # | Problème | Axe | Effort | Fichiers | Correction recommandée |
|---|---|---|---|---|---|
| 30 | Peu de transitions entre étapes (seulement 6 → 3 et 8 → 1). (PÉD-P11) | Pédagogie | Petit à moyen | `cours/contenu/etape-*.js`, `cours/pages/etape.js` | « Tu sais maintenant X. Prochaine étape : Y, parce que… » |
| 31 | Pas d'autoévaluation dans l'Essentiel de 5 étapes sur 8. (PÉD-P15) | Pédagogie | Moyen | `cours/pages/etape.js` | 1 ou 2 questions éclair en fin d'Essentiel. |
| 32 | Aucune image réelle (compteur, facture), ni audio ni vidéo. IPMVP sous une seule forme. Consentement et signature sans schéma. (PÉD-P16, PÉD-P17) | Pédagogie | Moyen à grand | `cours/schemas/`, nouveaux médias | Photos de compteurs, facture anonymisée, schémas manquants. Si des vidéos sont ajoutées : sous-titres et transcription obligatoires (thématique 4 du RGAA). |
| 33 | Libellé « Étape suivante » ambigu dans les exemples chiffrés. (UX-7) | UX | Petit | `cours/blocs/blocs.js:56` | « Calcul suivant ». |
| 34 | Accueil : badges « Disponible » inutiles, tableau de progression vide au centre, deux boutons principaux, école en bas de page. Code mort « V2/V3 à venir ». (UX-13, UX-14) | UX | Petit | `cours/pages/accueil.js:53-110`, `cours/pages/etape.js:15-27,107-114` | Nettoyer. |
| 35 | *Facultatif, pas de déclaration d'accessibilité visée.* Pas de plan du site (critère 12.1). Navigation sans liste. Figures sans `role`. Fermeture au `mousedown`. Anglicismes sans `lang`. (A11Y-19 à A11Y-26) | Accessibilité | Petit à moyen | voir les problèmes A11Y-19 à A11Y-26 en section 3.2 | Voir section 3.2. |
| 36 | Retour arrière ramené en haut de page ; pages École, Glossaire, Quiz final et Sources sans suite. (UX-12, UX-15) | UX | Petit | `cours/principal.js:139`, `cours/pages/*.js` | Restaurer la position ; ajouter un lien de fin. |

---

## 6. Questions auxquelles je dois répondre pour affiner l'audit

1. **Public visé.** Le cours s'adresse-t-il aux développeurs et testeurs d'un logiciel d'EMS, comme le dit l'accueil, ou à tous les salariés, comme le jeu ? Cela décide du niveau de vocabulaire attendu, de l'utilité des encadrés « Pour tester le logiciel » et de la note de clarté.
   **Réponse : tous les salariés.**
2. **« Étape faite ».** Que doit-elle signifier : « vue », « manipulée » ou « réussie » (mini-quiz réussi) ? Faut-il compter Patrimoine et le quiz final ?
   **Réponse : laissée à mon choix, « manipulée » (voir les décisions en tête de rapport).**
3. **Pas de temps de l'école.** Le pas de 10 min est-il un choix assumé de cas d'école, ou faut-il passer à 5 min ? Cela change les « 144 points par jour » de l'étape 3 et plusieurs démos.
   **Réponse : 10 minutes.**
4. **Ordre du référencement des sources.** Je recommande l'étape 8 (réglementaire) en premier. Faut-il réafficher les anciennes listes de liens en attendant, ou les retirer et corriger la page Sources ?
5. **Sources réglementaires.** Lesquelles retenir pour le décret tertiaire (texte consolidé, arrêtés, FAQ OPERAT) ? Pour les facteurs d'émission, quelle base et quel millésime, et en PCS ou en PCI ?
6. **Dates de consultation.** La date unique du 6 octobre 2026 pour les 102 sources est-elle réelle ?
7. **Références nationales de Patrimoine.** De quel millésime viennent les ratios (155 kWh/m² pour l'enseignement, etc.) ?
8. **Accessibilité.** As-tu besoin d'une déclaration d'accessibilité formelle ? Le site est-il soumis à une obligation légale ?
   - Si oui, il faut un audit sur un échantillon de pages défini, avec des tests au lecteur d'écran. Cet audit-ci n'en est pas un.
   - Le RGAA 5 est annoncé pour fin 2026 : faut-il anticiper les critères des WCAG 2.2, comme la taille des cibles (les appels de note font 13 à 17 px) ?
   **Réponse : pas de déclaration nécessaire.**
9. **« Energy Management ».** Faut-il le traiter comme le nom propre de la formation ? Si oui, le critère 8.7 devient conforme.
10. **Médias.** Y a-t-il un budget ou une envie pour des photos réelles (compteurs, facture) ou de courtes vidéos ?
11. **Tests apprenants.** Peux-tu réunir 5 à 8 personnes du public visé ? Plusieurs jugements de cet audit ne peuvent être confirmés qu'ainsi, notamment :
    - le temps réel passé par niveau ;
    - la lecture du schéma de l'étape 8 ;
    - l'usage des infobulles ;
    - l'effet du bouton du jeu sur la suite du cours ;
    - la compréhension de « Le cycle » comme lien vers l'accueil.

    Le suivi d'audience déjà en place (`course_tab`, `demo_use`, `glossary_open`) peut aussi apporter des données réelles : as-tu accès à ces statistiques ?
12. **Patrimoine.** Doit-il faire partie du parcours (avec progression), ou rester un bonus ?

---

## 7. Suivi des corrections

### Lot 1 (9 octobre 2026) : priorité 1, accroche de l'accueil, règle d'étape « faite »

| # | Correction | Fichiers |
|---|---|---|
| 1 | Schéma de l'étape 8 : « −15 % à météo égale (brut : −27 %) ». La barre « après » est redessinée à −15 %. | `cours/schemas/mesurer.js` |
| 2 | « 404 989 a été tapé au lieu de 413 989, deux chiffres mal recopiés ». Même correction dans l'atelier du jeu. | `cours/contenu/etape-3.js`, `jeu/epreuves/fiabiliser.js` |
| 3 | Quiz de l'étape 5 : « Si elle avait souscrit 100 kVA, ce serait… » | `cours/contenu/etape-5.js` |
| 4 | La page Sources dit maintenant la vérité : seules les étapes référencées citent leurs sources. | `cours/pages/sources.js` |
| 5 | Fenêtre « Mon compte » : le focus y entre, Tab reste dans la fenêtre, la fermeture se fait au clic (et non plus à l'appui), et les pseudo-onglets deviennent des boutons à bascule. | `commun/fenetre-compte.js` |
| 6 | Bouton « Reprendre : N. Étape · Niveau » sur l'accueil, avec « Recommencer à l'étape 1 » en secondaire. | `cours/pages/accueil.js`, `cours/pages/etape.js` |
| 7 | L'onglet ouvert va dans l'adresse (`#etape-3-comprendre`). | `cours/pages/etape.js` |
| 8 | Quiz : après une réponse, le focus va sur la correction, et la progression ou le score est annoncé par une région live permanente. Exemple pas à pas : le focus va sur ce qui apparaît. Le bouton « Étape suivante » devient « Calcul suivant ». | `cours/blocs/quiz.js`, `cours/blocs/blocs.js` |
| 9 | L'accueil s'adresse à tous les salariés, avec les durées (2 à 5 min, environ 5 à 10, environ 10 à 20). Les badges « Disponible » sont remplacés par « Pour tous / Recommandé / Pour aller plus loin ». Le quiz de synthèse passe en bouton secondaire. Les encadrés « Pour tester le logiciel » sont repliés et marqués facultatifs. | `cours/pages/accueil.js`, `cours/blocs/blocs.js`, `cours/styles/niveaux.css` |
| 10 | Chaque tableau a un titre pour les lecteurs d'écran, y compris ceux des démos. Les tableaux de contenu, des graphiques et de la progression ont des en-têtes de ligne. | `cours/blocs/blocs.js`, `cours/blocs/graphique.js`, `cours/pages/accueil.js`, `cours/principal.js`, `cours/styles/controles.css` |
| 12 | Étape « faite » = « manipulée » : l'Essentiel a été réellement affiché et sa démo menée jusqu'au résultat (Cadrer : toutes les étiquettes placées puis vérifiées ; Analyser : estimation vérifiée ; les autres démos, à la première manipulation). Les démos de Comprendre et d'Approfondir ne comptent plus. Le message « Étape N terminée » est annoncé. La mention ★ « maîtrisée » s'affiche dans le bandeau et le tableau si le mini-quiz est réussi à 80 %. La règle est écrite au-dessus du tableau de progression. | `cours/pages/etape.js`, `cours/coquille/etat.js`, `cours/demos/cadrer.js`, `cours/demos/analyser.js`, `cours/principal.js`, `cours/pages/accueil.js` |

Vérification : `node outils/verifier.mjs` donne 360 réussites et 0 échec. Un test navigateur dédié a contrôlé chaque correction.

### Lot 2 (9 octobre 2026) : priorité 2, points 13 à 16

| # | Correction | Fichiers |
|---|---|---|
| 16 | Pas de temps : l'école garde 10 min, et le texte le dit (« au pas de 10 min pour l'école ; 5 min pour la plupart des sites de plus de 36 kVA, 30 min pour un compteur Linky »), avec les sources Enedis déjà lues. Les 3 lignes « à corriger » du relevé de l'étape 2 passent à « corrigé ». | `cours/contenu/etape-2.js`, `cours/demos/collecter.js`, `outils/sources/releve-cours-etape-2.json` |
| 14 | Téléphone : la barre du haut s'efface quand on descend et revient dès qu'on remonte. Le bandeau centre l'étape en cours. « N/8 étapes » reste affiché. | `cours/styles/petits-ecrans.css`, `cours/principal.js` |
| 15 | Courbes trop longues pour un tableau : un « Résumé des données » (nombre de valeurs, minimum et maximum avec leur date, moyenne, lignes repères, points signalés, zones). Les valeurs lues aux flèches sont annoncées aux lecteurs d'écran. Échap ferme l'infobulle. Le graphique indique comment s'en servir au clavier. | `cours/blocs/graphique.js`, `commun/graphiques/graphiques.css` |
| 13 | Chaque étape annonce « À la fin de cette étape, tu sauras… » (3 objectifs observables) sous sa question. | `cours/contenu/etape-*.js` (`objectifs`), `cours/pages/etape.js`, `cours/styles/etape.css` |

Reste en priorité 2 : le point 11, les sources officielles de l'étape 8 (décret tertiaire, OPERAT, sanctions). Il demande de lire les textes, et le réseau de la session de travail les bloque.

Vérification : `node outils/verifier.mjs` donne 360 réussites et 0 échec. Un test navigateur sur téléphone et sur ordinateur a contrôlé la barre, le bandeau, le résumé, l'annonce au clavier et la touche Échap.

### Lot 3 (9 octobre 2026) : priorité 3

| # | Correction | Fichiers |
|---|---|---|
| 17 | Étape 7 : le tableau devient « Les leviers, du moins cher au plus lourd » avec une ligne Contrat ; la note et le quiz précisent que le contrat baisse la facture, pas l'énergie (sur l'énergie : sobriété, efficacité, production, comme dans le jeu). | `cours/contenu/etape-7.js` |
| 18 | Démo « plan d'action » : la baisse de consigne porte sur le gaz du chauffage (1 220 €/an, comme l'exemple), petits montants non arrondis (27 €) ; étape 8 : le facteur gaz affiché est celui du calcul (0,204 par kWh facturé, soit 0,227 PCI) ; glossaire : 134 kWh/DJU ; abonnement et puissance : même phrase prudente dans l'étape 7 et le glossaire. | `cours/demos/agir.js`, `cours/contenu/etape-8.js`, `commun/donnees/glossaire.js` |
| 19 | Infobulles ajoutées dans Comprendre et Approfondir (étapes 3, 4, 6, 7) ; 6 termes ajoutés au glossaire : périmètre, anomalie, pointe, dérive, indicateur, PCI. « Les mots de cette étape » montre ceux de l'Essentiel, les autres sont repliés. | `cours/contenu/etape-3,4,6,7.js`, `commun/donnees/glossaire.js`, `cours/pages/etape.js` |
| 20 | Étape 1 : talon, DJU et OPERAT ont leur infobulle dans la fiche de cadrage (« vus à l'étape 5 ») ; la puissance souscrite est expliquée dans la correction de la démo. | `cours/demos/perimetre.js`, `cours/demos/cadrer.js` |
| 21 | « Passer à Approfondir » en fin de Comprendre ; « Étape suivante » en fin d'Approfondir ; le bouton du jeu devient bordé, moins voyant que la suite du cours. | `cours/pages/etape.js`, `cours/styles/bandeau-jeu.css` |
| 22 | Téléphone : le bouton du glossaire s'efface quand on descend ; il disparaît sur la page Glossaire. | `cours/principal.js`, `cours/styles/petits-ecrans.css` |
| 23 | Contrastes : contour des champs et interrupteurs (jeton `--line-ctrl`, ≥ 3:1), dates des sources, badge « ok », contour de focus plus foncé en clair, focus visible sur les lignes du Pareto, « m³ » lisible sur le compteur orange. | `commun/styles/jetons.css`, `cours/styles/*.css`, `commun/graphiques/graphiques.css`, `cours/schemas/*.js` |
| 24 | Titres hiérarchisés (h1 → h2 → h3) ; annonces : nombre de résultats du glossaire, message éphémère, 8 démos ; bulle du glossaire survolable ; cases à cocher regroupées ; étiquette visible pour l'identifiant et la recherche ; jauges, encadrés et tableaux corrigés. axe-core : 0 défaut sur 10 pages contrôlées. | `cours/pages/etape.js`, `cours/blocs/blocs.js`, `cours/coquille/glossaire.js`, `commun/suivi.js`, `cours/demos/*.js` |
| 26 | Suite unique après l'étape 8 : Patrimoine (bonus) puis quiz de synthèse ; Patrimoine perd son faux numéro « 20 » ; la barre du haut suit cet ordre. | `cours/pages/etape.js`, `cours/pages/patrimoine.js`, `cours/principal.js` |
| 27 | Sur une étape, « Laboratoire actif : … » quand des anomalies ou des dérives sont activées, avec « Tout désactiver ». | `cours/pages/etape.js` |
| 29 | Page Glossaire : index de A à Z, filtre par étape, nombre de résultats annoncé, termes rangés par lettre. | `cours/pages/glossaire.js`, `cours/styles/glossaire.css` |

Reste : 25 (l'Approfondir de l'étape 2 reste long, seuls les encadrés « Pour tester » sont repliés) et 28 (sources, après décision).

### Lot 4 (9 octobre 2026) : décisions de l'auteur

| Décision | Ce qui a été fait | Fichiers |
|---|---|---|
| Sources des étapes non référencées : « le plus pratique pour les alimenter plus tard » | Les anciennes listes de liens restent dans le code comme pistes de lecture, non affichées (l'étape 8 ne montre plus sa liste provisoire). La méthode pour référencer une étape est écrite en tête du fichier. | `cours/contenu/sources.js`, `cours/contenu/etape-*.js`, `cours/pages/sources.js` |
| Sources officielles de l'étape 8 | En attente de l'ouverture du réseau (domaines à autoriser : legifrance.gouv.fr, operat.ademe.fr, base-empreinte.ademe.fr, ecologie.gouv.fr, enedis.fr). | — |
| Médias : illustrations dessinées | Deux illustrations SVG génériques : les compteurs électricité et gaz (étape 1, Comprendre) et une facture type numérotée (étape 2, Comprendre). Montants et numéros fictifs. | `cours/schemas/compteurs.js`, `cours/schemas/facture.js`, `cours/contenu/etape-1.js`, `cours/contenu/etape-2.js` |
| Patrimoine : bonus hors progression | Ligne « Bonus · Piloter un patrimoine » (vu / à découvrir) dans le tableau de progression ; « Effacer ma progression » la remet à zéro avec le point de reprise. | `cours/pages/patrimoine.js`, `cours/pages/accueil.js`, `cours/coquille/etat.js` |
| Étape 2 : replier le technique | Quatre détails techniques (accès Enedis, changement Data Connect, accès GRDF, taux 2026) sont repliés, titre visible. Nouveau marqueur `replie: true` pour tout bloc. | `cours/contenu/etape-2.js`, `cours/blocs/blocs.js`, `cours/styles/niveaux.css` |
| « Energy Management » = nom propre | Rien à changer (critère 8.7 considéré conforme). | — |
| Tests apprenants : protocole | Protocole de 30 minutes, 8 tâches, grille de notes et règles de lecture. | `PROTOCOLE_TEST_COURS.md` |
| Lien « Le cycle » → « Accueil » | Barre du haut et lien « Retour » de l'étape 1. | `cours/principal.js`, `cours/pages/etape.js` |

Vérification : `node outils/verifier.mjs` donne 360 réussites et 0 échec.

### Lot 5 (9 octobre 2026) : sources officielles de l'étape 8

Textes lus (fournis par l'auteur, les sites officiels refusant la machine de travail) : article R. 174-22 du code de la construction et de l'habitation, arrêté du 10 avril 2020 dans sa version en vigueur au 9 octobre 2026, FAQ Éco Énergie Tertiaire d'OPERAT (mise à jour d'août 2026). Ils sont au registre (`legifrance-cch-r174-22`, `legifrance-arrete-tertiaire-2020`, `ademe-operat-faq`) et le relevé `outils/sources/releve-cours-etape-8.json` garde, pour chaque affirmation, le passage lu et l'article.

| Affirmation | Verdict |
|---|---|
| Seuil de 1 000 m² cumulés sur le site | Confirmé (R. 174-22, II) |
| −40 % / −50 % / −60 % en 2030 / 2040 / 2050 | Confirmé (L. 174-1, cité par la FAQ OPERAT) |
| Objectif alternatif en valeur absolue par catégorie | Confirmé (arrêté, art. 2 et 4) |
| Année de référence : 12 mois consécutifs entre 2010 et 2022 | Confirmé ; l'historique « repoussée de 2019 à 2022 en 2024 » est retiré, faute de source |
| Déclaration sur OPERAT | Corrigé : « au plus tard le 30 septembre » (arrêté, art. 13) |
| Ajustement climatique et attestation annuelle | Confirmé (arrêté, art. 5 et 13), précisé : DJU d'une station Météo-France |
| Modulations des objectifs | Corrigé : ajout du volume d'activité et des contraintes patrimoniales |
| Sanctions | Corrigé : amende par infraction (7 500 € personne morale, 1 500 € personne physique), après mise en demeure, et publication du nom |
| Facteur du gaz 0,227 kgCO2e/kWh PCI, 1 kWh PCS = 0,90 kWh PCI | Confirmé (arrêté, annexes VII et I) |
| Facteur de l'électricité 0,052 kgCO2e/kWh | **À corriger, en attente de décision** : l'arrêté fixe 0,064 pour le dispositif tertiaire |

Citations ajoutées : étape 8 (Approfondir et tableau), étape 1 (Comprendre), glossaire (décret tertiaire, OPERAT, PCI), démo « trajectoire du décret tertiaire ».
