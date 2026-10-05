/**
 * Étape 3 · Fiabiliser : tout le contenu de l'étape.
 * - en tête : l'Essentiel (question, phrase clé, à retenir, analogie, schéma, démo)
 * - niveaux.comprendre et niveaux.approfondir : la suite de blocs affichés dans chaque onglet
 * - quiz : le mini-quiz en fin d'Approfondir
 */
import { etapeDeBase } from "../../commun/donnees/etapes.js";
import { sourcesData } from "./sources.js";

export default {
  ...etapeDeBase(3),
  question: "Peut-on faire confiance à ces données ?",
  phrase:
    "Avant d’analyser, on vérifie que la donnée est juste : complète, sans doublon, plausible et cohérente entre sources.",
  retenir: [
    "**Complétude** : une journée au pas de 10 min doit avoir 144 points, sauf les jours de changement d’heure (138 ou 150 en heure locale).",
    "**Plausibilité** : un pic à 999,9 kW dans une école de 60 {{kva}}, c’est un bug de mesure, pas une vraie consommation.",
    "On ne corrige jamais en silence : chaque valeur garde un statut ({{donnee-brute}}).",
  ],
  analogie: {
    icone: "loupe",
    titre: "Vérifier le thermomètre",
    texte:
      "Si le thermomètre affiche 45 °C, on ne conclut pas à une fièvre mortelle : on vérifie d’abord le thermomètre. Une mauvaise mesure mène à un mauvais diagnostic.",
  },
  schema: "fiabiliser",
  legendeSchema: "Les contrôles repèrent le trou et le pic avant toute analyse.",
  demo: {
    id: "fiabiliser",
    titre: "Chasse aux anomalies",
    consigne:
      "Choisis une journée piège, regarde ce que disent les contrôles, puis choisis la bonne correction.",
  },
  avenir: {
    comprendre: [
      "Exemples chiffrés : jour de 23 h ou de 25 h, index qui recule, écart entre courbe et facture",
    ],
    approfondir: [
      "Règles de contrôle : complétude, cohérence, plausibilité",
      "Unités, fuseaux (UTC ou heure locale), horodatage début ou fin",
      "Statut de la donnée : brute, corrigée, estimée",
      "Mini-quiz",
    ],
  },
  niveaux: {
    comprendre: [
      {
        type: "demo",
        id: "changementHeure",
        titre: "Le jour du changement d’heure",
        consigne:
          "Choisis le passage à l’heure d’été ou d’hiver : compare l’heure locale et l’heure UTC, et l’énergie de la journée.",
      },
      {
        type: "exemple",
        titre: "Un index qui recule",
        intro:
          "Relevés du poste HPB (heures pleines, saison basse) du compteur électrique, avec l’anomalie « index qui recule » activée.",
        etapes: [
          {
            t: "Relevé du 1er mars : **413 989 kWh**. Relevé du 1er avril : **404 989 kWh**.",
          },
          {
            t: "Calcul naïf de la consommation de mars :",
            calc: "404 989 − 413 989 = −9 000 kWh",
          },
          {
            t: "Une consommation négative est impossible pour un compteur de consommation. On cherche la cause : bouclage ? Non, le compteur est loin de son maximum. Changement de compteur ? Aucun n’est déclaré. Il reste l’erreur de saisie : 413 → 404, deux chiffres inversés.",
          },
          {
            t: "On rejette le relevé, on le signale, et on l’estime en attendant le suivant. Indice supplémentaire : en mars (saison haute), le poste HPB ne tourne pas, donc son index aurait dû rester à 413 989. Le relevé du 1er mai (418 534 kWh) confirme la hausse normale d’avril.",
            calc: "418 534 − 413 989 = 4 545 kWh en avril",
          },
        ],
        conclusion:
          "Règle de contrôle : un index doit toujours croître. Tout recul déclenche une vérification (saisie, bouclage, changement de compteur).",
      },
      {
        type: "demo",
        id: "ecartSources",
        titre: "Écart entre la courbe et l’index : quel seuil ?",
        consigne:
          "Active les trous de données, puis règle le seuil de tolérance : à partir de quel écart le logiciel doit-il lever une alerte ?",
      },
    ],
    approfondir: [
      {
        type: "tableau",
        titre: "Les règles de contrôle",
        entetes: ["Règle", "Question posée", "Exemple à l’école"],
        lignes: [
          [
            "Complétude",
            "Ai-je toutes les mesures attendues ?",
            "144 points par jour au pas de 10 min (138 ou 150 les jours de changement d’heure, en heure locale)",
          ],
          [
            "Unicité",
            "Chaque pas de temps a-t-il une seule mesure ?",
            "Le 2 décembre, 10 h à 11 h arrive deux fois",
          ],
          [
            "Plausibilité",
            "La valeur est-elle physiquement possible ?",
            "999,9 kW pour un raccordement de 60 kVA : rejeté",
          ],
          ["Continuité", "Les index croissent-ils ?", "HPB passe de 413 989 à 404 989 : rejeté"],
          [
            "Cohérence",
            "Les sources concordent-elles ?",
            "Somme de la courbe ≈ différence d’index, à la tolérance près",
          ],
          [
            "Fraîcheur",
            "La donnée est-elle arrivée à temps ?",
            "Aucune donnée Gazpar depuis 3 jours : alerte de collecte",
          ],
        ],
      },
      {
        type: "texte",
        titre: "Puissance, énergie et unités",
        paragraphes: [
          "Une courbe de charge contient des **puissances moyennes** (kW) sur chaque pas. Pour obtenir de l’énergie (kWh), on multiplie par la durée du pas en heures. Additionner des kW sans tenir compte du pas est l’erreur la plus fréquente.",
          "Autres pièges : une API qui renvoie des **W** au lieu de kW (facteur 1 000), du gaz en **m³** comparé à des kWh, des **kVA** (puissance apparente) comparés à des kW.",
        ],
      },
      {
        type: "exemple",
        titre: "De la puissance à l’énergie",
        etapes: [
          {
            t: "Mesure de 10 h 00 à 10 h 10 : puissance moyenne **24 kW**.",
          },
          {
            t: "Durée du pas en heures :",
            calc: "10 min = 10 / 60 = 0,1667 h",
          },
          {
            t: "Énergie consommée pendant ce pas :",
            calc: "24 kW × 0,1667 h = 4 kWh",
          },
          {
            t: "Pour une journée : somme des 144 puissances, divisée par 6.",
            calc: "E (kWh) = Σ P (kW) × 1/6",
          },
        ],
        conclusion:
          "Additionner les 144 valeurs sans diviser par 6 donnerait une énergie 6 fois trop grande.",
      },
      {
        type: "demo",
        id: "horodatage",
        titre: "Début ou fin de période ?",
        consigne:
          "La même mesure peut être étiquetée par le début ou par la fin de son pas. Bascule la convention et regarde ce qui arrive au dernier pas de la journée.",
      },
      {
        type: "tableau",
        titre: "Le statut d’une donnée",
        entetes: ["Statut", "Sens", "Exemple"],
        lignes: [
          ["Brute", "Telle que reçue, jamais modifiée", "Les 144 valeurs livrées par l’API"],
          ["Validée", "A passé tous les contrôles", "Une journée complète et plausible"],
          ["Corrigée", "Modifiée par une règle documentée", "Doublons retirés le 2 décembre"],
          ["Estimée", "Calculée faute de mesure", "Le trou du 18 novembre rempli par un profil type"],
          ["Rejetée", "Écartée des calculs, conservée pour trace", "Le pic à 999,9 kW"],
        ],
        note: "On garde toujours la donnée brute : une correction doit pouvoir être expliquée et annulée.",
      },
      {
        type: "encadre",
        ton: "qa",
        texte:
          "Cas utiles : jours de 23 h et de 25 h, fuseau UTC ou local, horodatage de début ou de fin, doublons exacts et doublons de valeurs différentes, valeur 0 en journée, valeur négative, W au lieu de kW, trou d’une journée entière, index qui recule, donnée qui arrive en retard puis corrige une estimation.",
      },
    ],
  },
  quiz: [
    {
      q: "Au pas de 10 min, combien de mesures compte la journée du 29 mars 2026 en heure locale ?",
      choix: ["144", "138", "150"],
      bonne: 1,
      explication:
        "Passage à l’heure d’été : la journée dure 23 h, soit 23 × 6 = 138 mesures. Ce n’est pas un trou.",
    },
    {
      q: "Une mesure indique 24 kW pendant 10 minutes. Quelle énergie ?",
      choix: ["24 kWh", "4 kWh", "240 kWh"],
      bonne: 1,
      explication: "24 kW × 10/60 h = 4 kWh.",
    },
    {
      q: "Tu reçois 22 500 pour une puissance d’école à midi. Le plus probable ?",
      choix: ["L’école consomme 22 500 kW", "La valeur est en W : 22,5 kW", "C’est un doublon"],
      bonne: 1,
      explication:
        "Pour un raccordement de 60 kVA, 22 500 kW est impossible ; 22 500 W = 22,5 kW est plausible. Toujours vérifier l’unité.",
    },
    {
      q: "Tu corriges un pic aberrant. Que fais-tu de la valeur brute ?",
      choix: [
        "Tu l’écrases avec la valeur corrigée",
        "Tu la conserves avec le statut « rejetée »",
        "Tu la supprimes",
      ],
      bonne: 1,
      explication:
        "On garde la donnée brute et son statut : la correction doit rester traçable et réversible.",
    },
    {
      q: "Pourquoi stocker les horodatages en UTC ?",
      choix: [
        "Parce que c’est plus court",
        "Pour que chaque mesure ait un horodatage unique, même les jours de changement d’heure",
        "Parce qu’Enedis l’impose",
      ],
      bonne: 1,
      explication:
        "En heure locale, 2 h 00 à 2 h 50 existe deux fois le jour du passage à l’heure d’hiver. En UTC, jamais.",
    },
  ],
};
