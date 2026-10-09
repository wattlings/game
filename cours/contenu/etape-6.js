/**
 * Étape 6 · Détecter : tout le contenu de l'étape.
 * - en tête : l'Essentiel (question, phrase clé, à retenir, analogie, schéma, démo)
 * - niveaux.comprendre et niveaux.approfondir : la suite de blocs affichés dans chaque onglet
 * - quiz : le mini-quiz en fin d'Approfondir
 */
import { etapeDeBase } from "../../commun/donnees/etapes.js";

export default {
  ...etapeDeBase(6),
  question: "Où y a-t-il gaspillage ou dérive ?",
  // ce que l’apprenant saura faire à la fin de l’étape (affiché sous la question)
  objectifs: [
    "comparer la consommation à une référence",
    "régler une alerte : ni trop sensible, ni trop tardive",
    "reconnaître une dérive, comme un talon qui monte",
  ],
  phrase:
    "On compare la consommation réelle à ce qu’elle devrait être, pour repérer gaspillages et dérives et estimer leur coût.",
  retenir: [
    "Sans {{baseline}}, pas de détection : il faut savoir ce qui est « normal ».",
    "Les dérives classiques : talon qui monte, chauffage le week-end ou l’été, {{depassement}} de puissance.",
    "Une alerte sur une donnée fausse fait perdre du temps : la détection dépend de l’étape Fiabiliser.",
  ],
  analogie: {
    icone: "alerte",
    titre: "Le robinet qui goutte",
    texte:
      "Une nuit où personne ne tire d’eau, le compteur d’eau devrait être immobile. S’il tourne, il y a une fuite. Un bâtiment vide qui consomme plus que d’habitude, c’est pareil.",
  },
  schema: "detecter",
  legendeSchema: "La nuit, le réel reste au-dessus de la référence : c’est une dérive.",
  demo: {
    id: "detecter",
    titre: "Déclenche des dérives",
    consigne:
      "Active un ou plusieurs scénarios : le graphique montre l’écart avec la référence et le surcoût estimé.",
  },
  avenir: {
    comprendre: ["Exemple chiffré : un talon qui augmente de 3 kW toute l’année"],
    approfondir: ["Référence, seuil d’alerte, faux positif", "Lien avec la qualité des données", "Mini-quiz"],
  },
  niveaux: {
    comprendre: [
      {
        type: "exemple",
        titre: "Un talon qui monte de 3 kW",
        intro: "Un serveur ou un chauffe-eau reste allumé en permanence : +3 kW dès que l’école est vide.",
        etapes: [
          {
            t: "Heures « bâtiment vide » sur une année (nuits, week-ends, vacances) : environ **7 240 h**.",
          },
          {
            t: "Énergie gaspillée :",
            calc: "3 kW × 7 240 h = 21 720 kWh ≈ 21,7 MWh",
          },
          {
            t: "Coût, au prix du kWh évité (≈ 0,186 € HT) :",
            calc: "21 720 × 0,186 ≈ 4 040 € HT par an",
          },
          {
            t: "Part de la consommation électrique de l’école :",
            calc: "21 720 / 86 000 ≈ 25 %",
          },
        ],
        conclusion:
          "Un petit écart de puissance, invisible à midi, devient énorme sur l’année. D’où l’intérêt d’analyser les nuits et les week-ends.",
      },
      {
        type: "demo",
        id: "seuilDetection",
        titre: "Règle ton alerte",
        consigne:
          "Choisis une référence, un seuil et une persistance. Objectif : repérer la dérive du 12 janvier en moins d’une semaine, sans fausse alerte.",
      },
    ],
    approfondir: [
      {
        type: "tableau",
        titre: "Quelle référence (baseline) ?",
        entetes: ["Référence", "Principe", "Limite"],
        lignes: [
          [
            "Même période l’an passé",
            "Janvier 2026 comparé à janvier 2025",
            "Météo et calendrier différents",
          ],
          [
            "Moyenne par type de jour",
            "Un mardi de classe comparé aux mardis de classe",
            "Ignore la saison (éclairage, chauffage)",
          ],
          [
            "Référence glissante",
            "Moyenne des 4 dernières semaines",
            "Apprend la dérive et finit par la cacher",
          ],
          ["Modèle", "Régression sur DJU, occupation, calendrier", "Demande un historique propre"],
        ],
      },
      {
        type: "tableau",
        titre: "Types d’alertes",
        entetes: ["Type", "Exemple à l’école", "Donnée nécessaire"],
        lignes: [
          ["Seuil fixe", "Plus de 12 kW entre 22 h et 5 h", "Courbe de charge"],
          [
            "Écart relatif",
            "Plus de 10 % au-dessus de la référence, 2 jours de suite",
            "Consommation journalière",
          ],
          ["Écart au modèle", "Gaz au-dessus de la signature énergétique", "Gaz journalier et DJU"],
          ["Règle métier", "Chaudière qui consomme un samedi de juillet", "Gaz journalier et calendrier"],
          ["Puissance", "Pointe au-dessus de 95 % de la puissance souscrite", "Courbe au pas fin"],
        ],
      },
      {
        type: "texte",
        titre: "Faux positifs, faux négatifs",
        paragraphes: [
          "Un {{faux-positif|faux positif}} est une alerte sans vrai problème : trop nombreux, ils font ignorer toutes les alertes. Un **faux négatif** est un vrai problème sans alerte : le gaspillage continue. Baisser le seuil réduit les faux négatifs mais augmente les faux positifs ; la persistance (plusieurs jours de suite, voir {{seuil-alerte|seuil d’alerte}}) filtre les écarts ponctuels.",
          "La détection dépend de la qualité des données (étape 3) : un doublon ressemble à une surconsommation, un trou à une économie, un pic aberrant à une alerte. On détecte sur des données fiabilisées, et on estime le surcoût en kWh puis en euros.",
        ],
      },
      {
        type: "encadre",
        ton: "qa",
        texte:
          "Cas utiles : alerte sur une journée avec trous, jour férié comparé à un jour de classe, changement d’heure, référence absente (nouveau site), seuil à 0 %, dérive qui commence un jour de vacances, alerte qui se déclenche puis s’éteint toute seule.",
      },
    ],
  },
  quiz: [
    {
      q: "Le talon de l’école passe de 6 à 9 kW toute l’année. Ordre de grandeur du gaspillage ?",
      choix: ["Environ 200 kWh", "Environ 20 000 kWh", "Environ 2 000 000 kWh"],
      bonne: 1,
      explication: "3 kW × environ 7 000 h d’inoccupation ≈ 21 000 kWh.",
    },
    {
      q: "Une alerte se déclenche le 20 janvier à cause d’une valeur de 999,9 kW. C’est…",
      choix: ["un vrai positif", "un faux positif dû à la qualité des données", "un faux négatif"],
      bonne: 1,
      explication:
        "La consommation réelle n’a pas bougé : c’est la mesure qui est fausse. D’où l’étape Fiabiliser avant Détecter.",
    },
    {
      q: "Pourquoi une référence glissante peut-elle masquer une dérive ?",
      choix: [
        "Parce qu’elle ne tient pas compte des week-ends",
        "Parce qu’après quelques semaines, la dérive fait partie de la référence",
        "Parce qu’elle est calculée en kW",
      ],
      bonne: 1,
      explication:
        "La référence « apprend » la nouvelle consommation : l’écart disparaît alors que le gaspillage continue.",
    },
    {
      q: "Augmenter la persistance (plusieurs jours d’affilée) permet surtout de…",
      choix: ["détecter plus vite", "réduire les fausses alertes ponctuelles", "corriger les données"],
      bonne: 1,
      explication:
        "Un écart isolé ne déclenche plus d’alerte. En contrepartie, la détection est un peu plus lente.",
    },
    {
      q: "La chaudière consomme un samedi de juillet. Quel type d’alerte le repère le mieux ?",
      choix: [
        "Une règle métier liée au calendrier",
        "Un seuil de puissance électrique",
        "Le montant de la facture annuelle",
      ],
      bonne: 0,
      explication: "En été et le week-end, la chaudière ne devrait pas tourner : une règle simple suffit.",
    },
  ],
};
