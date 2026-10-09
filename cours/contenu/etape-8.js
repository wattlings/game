/**
 * Étape 8 · Mesurer : tout le contenu de l'étape.
 * - en tête : l'Essentiel (question, phrase clé, à retenir, analogie, schéma, démo)
 * - niveaux.comprendre et niveaux.approfondir : la suite de blocs affichés dans chaque onglet
 * - quiz : le mini-quiz en fin d'Approfondir
 */
import { etapeDeBase } from "../../commun/donnees/etapes.js";

export default {
  ...etapeDeBase(8),
  question: "L’action a-t-elle marché ? On recommence ?",
  // ce que l’apprenant saura faire à la fin de l’étape (affiché sous la question)
  objectifs: [
    "comparer avant et après, à conditions égales",
    "corriger une économie de l’effet de la météo",
    "dire ce que demande le décret tertiaire",
  ],
  phrase:
    "On vérifie que l’action a vraiment marché, à conditions comparables, puis on repart au début de la boucle.",
  retenir: [
    "Un hiver doux fait baisser la consommation de gaz… sans que personne n’ait rien fait.",
    "On corrige donc la comparaison avec les {{dju}} : c’est le principe de la {{mv}}.",
    "Le résultat alimente le prochain tour de boucle (logique {{iso50001}}) et les déclarations {{operat}}.",
  ],
  analogie: {
    icone: "boucle",
    titre: "Se peser en manteau",
    texte:
      "Tu te pèses en manteau en janvier et en t-shirt en juillet : tu as « perdu » 3 kg. Pour savoir si le régime a marché, il faut se peser dans les mêmes conditions.",
  },
  schema: "mesurer",
  legendeSchema: "On compare à conditions égales, puis on revient à l’étape 1.",
  demo: {
    id: "mesurer",
    titre: "Avant / après : brut ou corrigé ?",
    consigne: "Bouge la météo de l’hiver suivant et bascule entre « brut » et « corrigé des DJU ».",
  },
  avenir: {
    comprendre: ["Exemple chiffré de mesure et vérification avec une année de référence corrigée"],
    approfondir: [
      "Indicateurs : kWh, kWh/m², €, tCO2",
      "Décret tertiaire et OPERAT",
      "ISO 50001 et la boucle d’amélioration continue",
      "Mini-quiz et quiz de synthèse",
    ],
  },
  niveaux: {
    comprendre: [
      {
        type: "exemple",
        titre: "Mesure et vérification d’une économie",
        intro: "L’école a baissé sa consigne et programmé le réduit. L’hiver suivant est plus doux.",
        etapes: [
          {
            t: "Année de référence : **196 157 kWh** de chauffage pour **2 244 DJU**.",
            calc: "196 157 / 2 244 = 87,4 kWh par DJU",
          },
          {
            t: "Année suivante : **1 900 DJU** et **139 000 kWh** de chauffage mesurés.",
          },
          {
            t: "Ce qu’on aurait consommé sans rien faire, avec cette météo :",
            calc: "87,4 × 1 900 = 166 060 kWh",
          },
          {
            t: "Économie attribuable à l’action :",
            calc: "166 060 − 139 000 = 27 060 kWh, soit −16,3 %",
          },
          {
            t: "Comparaison brute, sans correction :",
            calc: "139 000 / 196 157 − 1 = −29,1 %",
          },
        ],
        conclusion:
          "L’action a réellement fait gagner 16 %. Les 13 points restants viennent de la météo : les annoncer comme un succès serait une erreur de mesure.",
      },
      {
        type: "demo",
        id: "indicateurs",
        titre: "Un bâtiment, quatre indicateurs",
        consigne: "Change d’indicateur : la part du gaz et de l’électricité change du tout au tout.",
      },
      {
        type: "demo",
        id: "decretTertiaire",
        titre: "La trajectoire du décret tertiaire",
        consigne:
          "Choisis l’année de référence et le rythme de baisse : l’école tient-elle les objectifs 2030, 2040 et 2050 ?",
      },
    ],
    approfondir: [
      {
        type: "tableau",
        titre: "Les indicateurs clés",
        entetes: ["Indicateur", "École Jean-Jaurès (fictif)", "Remarque"],
        lignes: [
          ["kWh", "86 MWh élec + 208 MWh gaz", "Énergie finale, celle qu’on paie"],
          ["kWh/m²", "147 kWh/m² tous usages", "Unité des seuils du décret tertiaire"],
          [
            "€",
            "≈ 44 000 € TTC par an",
            "Dépend des prix : un indicateur qui bouge sans que la consommation change",
          ],
          [
            "tCO2e",
            "≈ 4,5 t (élec) + 42 t (gaz)",
            "Facteurs ADEME à vérifier : ≈ 0,052 kg/kWh (élec, mix moyen) ; gaz ≈ 0,204 kg par kWh facturé, soit 0,227 kg par kWh PCI (le gaz se facture en PCS : 1 kWh PCS = 0,90 kWh PCI)[[legifrance-arrete-tertiaire-2020]]",
          ],
        ],
      },
      {
        type: "texte",
        titre: "Le décret tertiaire (dispositif Éco Énergie Tertiaire)",
        paragraphes: [
          "Il concerne les bâtiments, parties de bâtiments ou ensembles de bâtiments d’un même site accueillant des activités tertiaires sur au moins **1 000 m²** de surface de plancher (surfaces cumulées sur le site)[[legifrance-cch-r174-22]]. L’école, avec 2 000 m², est concernée.",
          "Objectifs de réduction de la consommation d’{{energie-finale|énergie finale}} : **−40 % en 2030, −50 % en 2040, −60 % en 2050**, par rapport à une année de référence[[ademe-operat-faq]] ; ou bien atteindre un **seuil en valeur absolue** (kWh/m²/an) fixé par catégorie d’activité[[legifrance-arrete-tertiaire-2020]]. L’année de référence est une période de 12 mois consécutifs entre **2010 et 2022**[[legifrance-arrete-tertiaire-2020]].",
          "Chaque année, les consommations de l’année précédente sont déclarées sur la plateforme {{operat}} de l’ADEME, **au plus tard le 30 septembre**[[legifrance-arrete-tertiaire-2020]]. La plateforme ajuste les consommations du climat (avec les {{dju|DJU}} d’une station Météo-France) et délivre une attestation annuelle[[legifrance-arrete-tertiaire-2020]]. Les objectifs peuvent être modulés selon le volume d’activité, des contraintes techniques, architecturales ou patrimoniales, ou des coûts manifestement disproportionnés[[ademe-operat-faq]]. En cas de manquement, après mise en demeure restée sans effet : une amende par infraction, jusqu’à 7 500 € pour une personne morale (1 500 € pour une personne physique), et la publication du nom de l’assujetti[[ademe-operat-faq]].",
        ],
      },
      {
        type: "encadre",
        ton: "verifier",
        titre: "À revérifier régulièrement",
        texte:
          "Seuils en valeur absolue, bornes de l’année de référence, date limite OPERAT, facteurs d’émission : l’arrêté du 10 avril 2020 a déjà été modifié plusieurs fois (en dernier lieu en 2025). Vérifier la version en vigueur sur Légifrance et la FAQ OPERAT avant de coder une règle.",
      },
      {
        type: "tableau",
        titre: "ISO 50001 : la boucle du site",
        entetes: ["Phase ISO 50001", "Étapes du site", "Exemple à l’école"],
        lignes: [
          [
            "Planifier (Plan)",
            "1. Cadrer · 2 à 4. Données · 5. Analyser",
            "Revue énergétique, situation de référence, indicateurs ({{ipe}})",
          ],
          ["Faire (Do)", "7. Agir", "Consigne à 19 °C, programmation du réduit"],
          ["Vérifier (Check)", "6. Détecter · 8. Mesurer", "Suivi des alertes, M&V corrigée des DJU"],
          ["Agir / améliorer (Act)", "8 → 1", "Nouveaux objectifs, nouveau périmètre"],
        ],
        note: "La norme ISO 50001 (version 2018, complétée par un amendement de 2024 sur le changement climatique) ne fixe pas d’objectif chiffré : elle impose une démarche d’amélioration continue et documentée.",
      },
      {
        type: "texte",
        titre: "Mesure et vérification (M&V)",
        paragraphes: [
          "La {{mv}} compare la consommation mesurée après l’action à ce qu’on aurait consommé sans elle, dans les mêmes conditions (météo, occupation, surface). Le protocole international le plus utilisé est l’{{ipmvp}}. Il demande de fixer à l’avance la période de référence, le modèle d’ajustement et les facteurs pris en compte.",
        ],
      },
      {
        type: "encadre",
        ton: "qa",
        texte:
          "Cas utiles : année de référence hors bornes, 12 mois non consécutifs, surface qui change entre la référence et l’année courante, DJU manquants, objectif déjà atteint, consommation en PCS comparée à un facteur CO2 en PCI.",
      },
    ],
  },
  quiz: [
    {
      q: "L’hiver a été 15 % plus doux et la consommation de chauffage a baissé de 15 %. L’action a-t-elle marché ?",
      choix: [
        "Oui, de 15 %",
        "On ne peut pas conclure sans corriger du climat : l’effet réel est proche de 0",
        "Non, elle a augmenté la consommation",
      ],
      bonne: 1,
      explication: "La météo explique toute la baisse. Corrigée des DJU, la consommation n’a pas bougé.",
    },
    {
      q: "À partir de quelle surface tertiaire un site est-il concerné par le décret tertiaire ?",
      choix: ["500 m²", "1 000 m²", "5 000 m²"],
      bonne: 1,
      explication: "Au moins 1 000 m² d’activités tertiaires, surfaces cumulées sur le site.",
    },
    {
      q: "Objectif du décret tertiaire pour 2030 par rapport à l’année de référence ?",
      choix: ["−20 %", "−40 %", "−60 %"],
      bonne: 1,
      explication: "−40 % en 2030, −50 % en 2040, −60 % en 2050 (ou un seuil en valeur absolue).",
    },
    {
      q: "Où déclare-t-on les consommations au titre du décret tertiaire ?",
      choix: ["Sur OPERAT (ADEME)", "Sur l’espace client Enedis", "Dans la facture du fournisseur"],
      bonne: 0,
      explication: "La plateforme OPERAT, chaque année au plus tard le 30 septembre pour l’année précédente.",
    },
    {
      q: "Pour l’école, quel indicateur fait le plus ressortir le gaz ?",
      choix: ["Les euros", "Les tonnes de CO2", "Le nombre de compteurs"],
      bonne: 1,
      explication: "Le gaz émet environ 4 fois plus de CO2 par kWh que l’électricité française.",
    },
    {
      q: "Dans ISO 50001, l’étape « Vérifier » correspond surtout à…",
      choix: ["Cadrer", "Mesurer et détecter", "Agir"],
      bonne: 1,
      explication: "On contrôle les résultats (M&V, indicateurs, alertes) avant de relancer la boucle.",
    },
  ],
};
