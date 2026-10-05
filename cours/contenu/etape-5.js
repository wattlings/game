/**
 * Étape 5 · Analyser : tout le contenu de l'étape.
 * - en tête : l'Essentiel (question, phrase clé, à retenir, analogie, schéma, démo)
 * - niveaux.comprendre et niveaux.approfondir : la suite de blocs affichés dans chaque onglet
 * - quiz : le mini-quiz en fin d'Approfondir
 */
import { etapeDeBase } from "../../commun/donnees/etapes.js";
import { sourcesEnergie } from "./sources.js";

export default {
  ...etapeDeBase(5),
  question: "Comment le bâtiment consomme-t-il ?",
  phrase:
    "On lit la consommation pour comprendre quand le bâtiment consomme, combien il consomme à vide, et comment il réagit au froid.",
  retenir: [
    "Le {{talon}}, c’est ce que le bâtiment consomme quand il est vide. Chez l’école, il pèse lourd dans le total.",
    "Une journée de classe et une journée de vacances n’ont pas du tout le même profil.",
    "Le chauffage suit la météo : on la mesure avec les {{dju}}.",
  ],
  analogie: {
    icone: "courbe",
    titre: "Lire un électrocardiogramme",
    texte:
      "Le cardiologue regarde le rythme au repos, les pics à l’effort et ce qui sort de l’ordinaire. Une courbe de charge se lit de la même façon.",
  },
  schema: "analyser",
  legendeSchema: "Une journée de classe : le talon, la journée, le pic du déjeuner.",
  demo: {
    id: "analyser",
    titre: "Trouve le talon de l’école",
    consigne:
      "Choisis une semaine : le talon est calculé la nuit et le week-end, et tu vois sa part dans la consommation.",
  },
  avenir: {
    comprendre: [
      "Profils : journée type, semaine type, saison",
      "Signature énergétique : DJU et gaz",
      "Puissance souscrite : sur-souscription ou dépassement",
    ],
    approfondir: [
      "Ratios kWh/m² et kWh/élève",
      "Consommation de base et variable, normalisation climatique",
      "Mini-quiz",
    ],
  },
  niveaux: {
    comprendre: [
      {
        type: "demo",
        id: "profils",
        titre: "Journée type, semaine type, saisons",
        consigne: "Bascule entre les trois vues : chaque profil raconte une partie de la vie de l’école.",
      },
      {
        type: "demo",
        id: "signature",
        titre: "La signature énergétique du chauffage",
        consigne:
          "Chaque point est une journée. Bouge la température pour voir la consommation de gaz attendue.",
      },
      {
        type: "demo",
        id: "puissance",
        titre: "Régler la puissance souscrite",
        consigne:
          "Déplace la puissance souscrite : trop haut, on paie pour rien ; trop bas, on paie des pénalités.",
      },
      {
        type: "exemple",
        titre: "Les ratios de l’école",
        etapes: [
          {
            t: "Électricité sur l’année scolaire : **86 000 kWh**, pour 2 000 m² et 250 élèves.",
            calc: "86 000 / 2 000 = 43 kWh/m²    86 000 / 250 = 344 kWh/élève",
          },
          {
            t: "Gaz : **208 000 kWh**.",
            calc: "208 000 / 2 000 = 104 kWh/m²    208 000 / 250 = 832 kWh/élève",
          },
          {
            t: "Tous usages :",
            calc: "(86 000 + 208 000) / 2 000 = 147 kWh/m²",
          },
        ],
        conclusion:
          "Les ratios rendent les bâtiments comparables. Mais une école ouverte le soir ou le mercredi après-midi ne se compare pas à une école fermée : un ratio se lit toujours avec son contexte.",
      },
    ],
    approfondir: [
      {
        type: "texte",
        titre: "Consommation de base et consommation variable",
        paragraphes: [
          "La signature énergétique s’écrit **E = a + b × DJU**. **a** est la consommation de base, qui ne dépend pas de la météo (cuisine, eau chaude : environ 83 kWh un jour de classe). **b** est la {{thermosensibilite}}, en kWh par DJU (environ 134 kWh/DJU un jour de classe).",
          "Si **a** augmente, un usage permanent a dérivé. Si **b** augmente, le bâtiment chauffe moins bien (réglage, isolation, chaudière). Si les points s’éparpillent (R² faible), le chauffage n’est pas piloté par la météo : horaires, fenêtres ouvertes, régulation défaillante.",
        ],
      },
      {
        type: "exemple",
        titre: "Corriger du climat (normalisation)",
        intro:
          "On veut comparer deux hivers qui n’ont pas eu la même rigueur : c’est la {{normalisation-climatique}}.",
        etapes: [
          {
            t: "Année de référence : **2 244 DJU**. Une année plus douce : **1 900 DJU**, avec 150 000 kWh de chauffage mesurés.",
          },
          {
            t: "On ramène la consommation aux DJU de la référence :",
            calc: "150 000 × 2 244 / 1 900 = 177 158 kWh",
          },
          {
            t: "C’est cette valeur « corrigée du climat » qu’on compare aux 196 000 kWh de chauffage de l’année de référence.",
            calc: "177 158 / 196 157 − 1 = −9,7 %",
          },
        ],
        conclusion:
          "Sans correction, on aurait cru à −23,5 %. On ne corrige que la part qui dépend de la météo (le chauffage), pas la cuisine.",
      },
      {
        type: "encadre",
        ton: "info",
        titre: "Les DJU en pratique",
        texte: [
          "Le seuil de 18 °C est une convention : en dessous, on considère qu’il faut chauffer. La température moyenne du jour se calcule souvent comme la moyenne du minimum et du maximum (méthode dite « météo ») ; d’autres méthodes existent, comme celle du COSTIC.",
          "Les DJU viennent d’une station météo proche (Météo-France ou fournisseurs de données). Le décret tertiaire prévoit lui aussi un ajustement climatique des consommations.",
        ],
      },
      {
        type: "tableau",
        titre: "Les ratios les plus courants",
        entetes: ["Ratio", "École Jean-Jaurès", "Utile pour"],
        lignes: [
          ["kWh/m²/an", "43 (élec), 104 (gaz), 147 (total)", "Comparer des bâtiments, décret tertiaire"],
          ["kWh/élève/an", "344 (élec), 832 (gaz)", "Comparer des écoles de tailles différentes"],
          ["kWh/DJU", "≈ 87 (tous jours confondus)", "Suivre l’efficacité du chauffage"],
          ["Talon / puissance max.", "≈ 6 kW / 57 kVA", "Repérer les usages permanents, régler la puissance"],
          ["Part hors occupation", "plus de la moitié de l’électricité", "Chiffrer le potentiel de sobriété"],
        ],
      },
      {
        type: "encadre",
        ton: "qa",
        texte:
          "Cas utiles : régression avec moins de 10 points, journées à 0 DJU, jours de vacances mélangés aux jours de classe, surface modifiée en cours d’année, ratio par élève avec un effectif nul, puissance en kW affichée comme des kVA.",
      },
    ],
  },
  quiz: [
    {
      q: "Un jour à 8 °C de moyenne compte combien de DJU (base 18 °C) ?",
      choix: ["8", "10", "26"],
      bonne: 1,
      explication: "18 − 8 = 10 DJU.",
    },
    {
      q: "Dans E = a + b × DJU, que représente b ?",
      choix: ["La consommation de base", "Les kWh supplémentaires par degré-jour de froid", "Le coût du kWh"],
      bonne: 1,
      explication: "b est la pente : la sensibilité au froid, en kWh/DJU.",
    },
    {
      q: "La pointe annuelle de l’école est 57 kVA et elle a souscrit 100 kVA. C’est…",
      choix: ["un dépassement", "une sur-souscription", "le réglage idéal"],
      bonne: 1,
      explication: "Elle paie 43 kVA de puissance qu’elle n’utilise jamais.",
    },
    {
      q: "L’école consomme plus de la moitié de son électricité quand elle est…",
      choix: ["pleine, à midi", "vide (nuits, week-ends, vacances)", "en réunion de parents"],
      bonne: 1,
      explication: "Le talon tourne 24 h/24, et l’école est vide plus de 80 % des heures de l’année.",
    },
    {
      q: "Pour comparer deux écoles de tailles différentes, on utilise plutôt…",
      choix: ["les kWh totaux", "un ratio (kWh/m² ou kWh/élève)", "le montant de la facture"],
      bonne: 1,
      explication:
        "Le ratio neutralise l’effet de taille. Le contexte (horaires, usages) reste à prendre en compte.",
    },
  ],
};
