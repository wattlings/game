/**
 * Étape 4 · Structurer : tout le contenu de l'étape.
 * - en tête : l'Essentiel (question, phrase clé, à retenir, analogie, schéma, démo)
 * - niveaux.comprendre et niveaux.approfondir : la suite de blocs affichés dans chaque onglet
 * - quiz : le mini-quiz en fin d'Approfondir
 */
import { etapeDeBase } from "../../commun/donnees/etapes.js";
import { sourcesData } from "./sources.js";

export default {
  ...etapeDeBase(4),
  question: "Comment organiser les données pour les exploiter ?",
  // ce que l’apprenant saura faire à la fin de l’étape (affiché sous la question)
  objectifs: [
    "ranger les données du site jusqu’aux mesures du compteur",
    "changer le pas de temps sans perdre d’énergie",
    "éviter de compter deux fois un sous-compteur",
  ],
  phrase:
    "On range les données dans un modèle commun, à la même unité et au bon pas de temps, pour pouvoir les comparer et les additionner.",
  retenir: [
    "Un modèle simple : un **site** contient des **compteurs**, qui produisent des **mesures**.",
    "Changer de {{pas-de-temps}} ({{agregation}}) lisse la courbe mais ne change pas l’énergie totale.",
    "Pour comparer le gaz et l’électricité, on convertit les m³ en {{kwh}} avec le {{coef-conversion}}.",
  ],
  analogie: {
    icone: "tableau",
    titre: "Ranger une bibliothèque",
    texte:
      "Les mêmes livres peuvent être classés par auteur, par thème ou par année. Le classement ne change pas les livres, mais il change ce que tu trouves facilement.",
  },
  schema: "structurer",
  legendeSchema: "Site → compteurs → mesures, puis regroupement par pas de temps.",
  demo: {
    id: "structurer",
    titre: "Change le pas de temps",
    consigne:
      "Passe de 10 minutes à 1 jour : la courbe se lisse, mais l’énergie de la semaine reste la même.",
  },
  avenir: {
    comprendre: [
      "Exemple chiffré : 144 points qui deviennent une journée, m³ qui deviennent kWh",
      "Agréger plusieurs compteurs en un site",
    ],
    approfondir: [
      "Modèle de données site → compteur → mesure",
      "Historique, conversion d’unités, granularités",
      "Rattacher une période de facture au calendrier",
      "Mini-quiz",
    ],
  },
  niveaux: {
    comprendre: [
      {
        type: "exemple",
        titre: "144 points deviennent une journée",
        intro:
          "Le lundi 12 janvier 2026, le compteur électrique de l’école a envoyé 144 puissances moyennes.",
        etapes: [
          {
            t: "On additionne les 144 puissances (en kW) :",
            calc: "Σ P = 2 503,5 kW",
          },
          {
            t: "Chaque pas dure 1/6 d’heure, donc :",
            calc: "E = 2 503,5 × 1/6 = 417 kWh",
          },
          {
            t: "Le même jour, le compteur gaz indique 229,1 m³, avec un coefficient de 11,21 kWh/m³ :",
            calc: "229,1 × 11,21 = 2 568 kWh",
          },
          {
            t: "Les deux énergies sont maintenant dans la même unité et peuvent s’additionner :",
            calc: "417 + 2 568 = 2 985 kWh pour le site ce jour-là",
          },
        ],
        conclusion:
          "{{agregation|Agréger}}, c’est additionner des énergies dans la même unité. Jamais des kW, jamais des m³ avec des kWh.",
      },
      {
        type: "demo",
        id: "agregationSite",
        titre: "Agrège les compteurs du site",
        consigne:
          "Coche les compteurs à additionner pour obtenir la consommation du site. Attention au sous-compteur de la cuisine.",
      },
      {
        type: "encadre",
        ton: "attention",
        titre: "Le piège du sous-compteur",
        texte:
          "Un {{sous-compteur}} mesure une partie de ce que mesure déjà le compteur principal. L’additionner au principal compte deux fois la même énergie. Dans le modèle de données, il faut savoir qui est « parent » de qui.",
      },
    ],
    approfondir: [
      {
        type: "schema",
        id: "modele",
        legende:
          "Modèle de données simplifié : un site regroupe des points de comptage, qui portent des compteurs successifs, qui produisent des mesures.",
      },
      {
        type: "tableau",
        titre: "Les objets du modèle",
        entetes: ["Objet", "Champs utiles", "Remarque"],
        lignes: [
          [
            "Site",
            "nom, adresse, surface, activité",
            "La surface sert aux ratios kWh/m² et au décret tertiaire",
          ],
          [
            "Point de comptage",
            "identifiant (PDL / PCE), énergie, site(s), dates de validité",
            "Stable dans le temps, même si le compteur change",
          ],
          [
            "Compteur",
            "numéro de série, date de pose, date de dépose, nombre de chiffres",
            "Plusieurs compteurs successifs pour un même point",
          ],
          [
            "Contrat",
            "puissance souscrite, option tarifaire, fournisseur, dates",
            "Versionné : un changement de puissance crée une nouvelle version",
          ],
          [
            "Mesure",
            "horodatage (UTC), pas, valeur, unité, statut, source",
            "Jamais écrasée : on ajoute une version corrigée",
          ],
          [
            "Facture",
            "période (début, fin), lignes, montants, statut (estimée, réelle)",
            "À rattacher au calendrier (voir la démo ci-dessous)",
          ],
        ],
      },
      {
        type: "texte",
        titre: "Gérer l’historique",
        paragraphes: [
          "Tout ce qui change dans le temps porte des **dates de validité** : le compteur (pose, dépose), le contrat (puissance souscrite), la surface (extension), le rattachement site ↔ point de comptage. Ainsi, on peut recalculer correctement une année passée.",
          "Les conversions d’unités sont faites au même endroit, avec la valeur en vigueur à la date de la mesure : le coefficient de conversion du gaz de janvier ne s’applique pas en juillet.",
        ],
      },
      {
        type: "demo",
        id: "rattachement",
        titre: "Rattacher une facture au calendrier",
        consigne:
          "La facture couvre du 14 janvier au 13 février. Choisis une méthode pour répartir ses kWh entre janvier et février, et compare avec la réalité.",
      },
      {
        type: "tableau",
        titre: "Quelle granularité pour quel usage ?",
        entetes: ["Pas", "Points par an", "Sert à"],
        lignes: [
          ["10 min", "52 560", "Pointes de puissance, dépassements, talon précis"],
          ["30 min / 1 h", "17 520 / 8 760", "Profils journaliers, comparaison de journées"],
          ["1 jour", "365", "Lien avec la météo (DJU), détection de dérives"],
          ["1 mois", "12", "Budget, comparaison aux factures, reporting"],
          ["1 an", "1", "Décret tertiaire, bilans, classement des sites"],
        ],
      },
      {
        type: "encadre",
        ton: "qa",
        texte:
          "Cas utiles : agrégation avec un sous-compteur, site dont un compteur démarre en cours d’année, coefficient de conversion manquant pour un mois, facture à cheval sur deux années, changement de puissance souscrite en milieu de mois, somme de puissances au lieu d’énergies.",
      },
    ],
  },
  quiz: [
    {
      q: "Pour obtenir la consommation d’une journée à partir de 144 puissances au pas de 10 min, on…",
      choix: [
        "fait la moyenne des 144 valeurs",
        "additionne les 144 valeurs et divise par 6",
        "additionne les 144 valeurs",
      ],
      bonne: 1,
      explication: "Chaque valeur × 1/6 h donne des kWh : E = Σ P / 6.",
    },
    {
      q: "Le site a un compteur principal (80 MWh) et un sous-compteur cuisine (10 MWh). Consommation du site ?",
      choix: ["90 MWh", "80 MWh", "70 MWh"],
      bonne: 1,
      explication:
        "La cuisine est déjà incluse dans le compteur principal. On n’additionne pas un sous-compteur à son parent.",
    },
    {
      q: "Passer du pas 10 min au pas journalier…",
      choix: [
        "réduit l’énergie totale",
        "conserve l’énergie totale mais cache les pointes",
        "augmente la précision",
      ],
      bonne: 1,
      explication:
        "L’agrégation conserve l’énergie. Mais la puissance maximale visible baisse, ce qui compte pour la puissance souscrite.",
    },
    {
      q: "Une facture couvre du 14 janvier au 13 février. Pour le bilan de janvier, la méthode la plus juste est…",
      choix: [
        "compter toute la facture en janvier",
        "répartir selon la courbe de charge réelle",
        "compter toute la facture en février",
      ],
      bonne: 1,
      explication:
        "La courbe (ou les index quotidiens) dit quelle part a vraiment été consommée en janvier. Le prorata au nombre de jours est une approximation.",
    },
    {
      q: "Le compteur gaz est remplacé le 15 janvier. Dans le modèle, on…",
      choix: [
        "crée un nouveau point de comptage",
        "ajoute un nouveau compteur au même point de comptage, avec ses dates",
        "écrase l’ancien compteur",
      ],
      bonne: 1,
      explication:
        "Le PCE reste le même ; on garde l’historique des compteurs successifs avec leurs dates de pose et de dépose.",
    },
  ],
};
