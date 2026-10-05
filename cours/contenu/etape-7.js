/**
 * Étape 7 · Agir : tout le contenu de l'étape.
 * - en tête : l'Essentiel (question, phrase clé, à retenir, analogie, schéma, démo)
 * - niveaux.comprendre et niveaux.approfondir : la suite de blocs affichés dans chaque onglet
 * - quiz : le mini-quiz en fin d'Approfondir
 */
import { etapeDeBase } from "../../commun/donnees/etapes.js";
import { sourcesEnergie } from "./sources.js";

export default {
  ...etapeDeBase(7),
  question: "Que fait-on concrètement pour consommer mieux ?",
  phrase: "On passe à l’action, du moins cher au plus lourd : régler, optimiser le contrat, puis investir.",
  retenir: [
    "**Sobriété** d’abord : régler les horaires, baisser la consigne, éteindre. Coût quasi nul.",
    "Puis le **contrat** : {{puissance-souscrite}} ajustée, bonne option tarifaire.",
    "Enfin l’**efficacité** et la **production** : travaux, équipements, panneaux solaires. Coûteux, rentable sur plusieurs années.",
  ],
  analogie: {
    icone: "cle",
    titre: "Réduire les dépenses d’un foyer",
    texte:
      "D’abord on éteint les lumières et on baisse le chauffage. Ensuite on renégocie ses abonnements. Enfin, si ça vaut le coup, on isole la maison.",
  },
  schema: "agir",
  legendeSchema: "Trois marches : chaque marche coûte plus cher et prend plus de temps.",
  demo: {
    id: "agir",
    titre: "Compose ton plan d’action",
    consigne:
      "Coche des actions : tu vois l’économie annuelle, le coût et le temps de retour (valeurs fictives).",
  },
  avenir: {
    comprendre: [
      "Exemple chiffré : baisser la consigne d’un degré",
      "Exemple chiffré : ajuster la puissance souscrite",
    ],
    approfondir: [
      "Sobriété, efficacité, production",
      "Autoconsommation",
      "Temps de retour, impact sur abonnement et consommation",
      "Mini-quiz",
    ],
  },
  niveaux: {
    comprendre: [
      {
        type: "exemple",
        titre: "Baisser la consigne d’un degré",
        intro: "On passe la consigne des classes de 20 °C à 19 °C.",
        etapes: [
          {
            t: "Règle d’ordre de grandeur souvent citée : **1 °C de moins ≈ 7 % de chauffage en moins**.",
          },
          {
            t: "Chauffage de l’école sur l’année : **196 000 kWh** de gaz.",
            calc: "196 157 × 7 % ≈ 13 730 kWh",
          },
          {
            t: "Économie financière, au prix du kWh de gaz évité (≈ 0,089 € HT) :",
            calc: "13 730 × 0,0887 ≈ 1 220 € HT par an",
          },
          {
            t: "CO2 évité (≈ 0,204 kgCO2e par kWh de gaz facturé) :",
            calc: "13 730 × 0,204 ≈ 2,8 tCO2e",
          },
        ],
        conclusion:
          "Coût : zéro. Temps de retour : immédiat. C’est pour ça qu’on commence toujours par la sobriété.",
      },
      {
        type: "exemple",
        titre: "Ajuster la puissance souscrite",
        etapes: [
          {
            t: "La pointe de l’école est de **57 kVA** ; elle a souscrit 60 kVA.",
          },
          {
            t: "Passer à 58 kVA économise, au tarif fictif de 13,50 €/kVA/an :",
            calc: "2 × 13,50 = 27 € HT par an",
          },
          {
            t: "Si l’école avait souscrit 80 kVA par prudence, revenir à 60 kVA rapporterait :",
            calc: "20 × 13,50 = 270 € HT par an",
          },
        ],
        conclusion:
          "Un levier gratuit, mais modeste ici, et risqué si on descend trop près de la pointe. Il agit sur la part fixe de la facture, pas sur les kWh.",
      },
      {
        type: "demo",
        id: "autoconso",
        titre: "Produire son électricité",
        consigne:
          "Choisis la taille de l’installation solaire : observe la production, la part consommée sur place et le temps de retour.",
      },
    ],
    approfondir: [
      {
        type: "tableau",
        titre: "Sobriété, efficacité, production",
        entetes: ["Levier", "Principe", "Exemples à l’école", "Coût"],
        lignes: [
          [
            "{{sobriete|Sobriété}}",
            "Consommer moins en changeant les usages et les réglages",
            "Consigne à 19 °C, réduit la nuit, extinction des veilles",
            "Faible",
          ],
          [
            "Efficacité",
            "Obtenir le même service avec moins d’énergie",
            "LED, isolation des combles, chaudière à condensation",
            "Moyen à élevé",
          ],
          [
            "Production",
            "Produire une partie de son énergie",
            "Panneaux photovoltaïques en autoconsommation",
            "Élevé",
          ],
        ],
        note: "L’ordre compte : isoler un bâtiment qu’on chauffe le week-end, c’est payer des travaux pour chauffer du vide.",
      },
      {
        type: "texte",
        titre: "Autoconsommation",
        paragraphes: [
          "En {{autoconsommation}} individuelle, l’école consomme directement ce que ses panneaux produisent ; le surplus est injecté sur le réseau et peut être vendu. En **autoconsommation collective**, plusieurs bâtiments proches partagent une production.",
          "Deux taux à ne pas confondre : le **taux d’autoconsommation** (part de la production consommée sur place) et le **taux d’autoproduction** (part des besoins couverts par la production). Une école fermée l’été autoconsomme mal sa production estivale.",
        ],
      },
      {
        type: "texte",
        titre: "Temps de retour et impact sur la facture",
        paragraphes: [
          "Le {{temps-de-retour}} simple = investissement / économie annuelle. Il ignore la hausse des prix, la durée de vie de l’équipement, la maintenance et les aides (par exemple les certificats d’économies d’énergie) : c’est un premier filtre, pas une étude financière.",
          "Une action sur les **kWh** réduit la fourniture, la part variable de l’acheminement et l’accise. Une action sur la **puissance** réduit la part fixe de l’acheminement (et donc la CTA). L’abonnement fournisseur, lui, ne bouge pas.",
        ],
      },
      {
        type: "encadre",
        ton: "qa",
        texte:
          "Cas utiles : actions cumulées (les pourcentages se multiplient, ils ne s’additionnent pas), action avec coût nul (temps de retour immédiat, pas de division par zéro), économie négative, production solaire supérieure à la consommation, action sur la puissance qui ne change pas les kWh.",
      },
    ],
  },
  quiz: [
    {
      q: "Dans quel ordre recommande-t-on d’agir ?",
      choix: [
        "Production, efficacité, sobriété",
        "Sobriété, efficacité, production",
        "Efficacité, production, sobriété",
      ],
      bonne: 1,
      explication: "On réduit d’abord le besoin (souvent gratuit), puis on consomme mieux, puis on produit.",
    },
    {
      q: "Deux actions de 10 % chacune sur le chauffage donnent au total…",
      choix: ["20 %", "19 %", "10 %"],
      bonne: 1,
      explication: "La seconde s’applique à ce qui reste : 1 − 0,9 × 0,9 = 19 %.",
    },
    {
      q: "Un investissement de 30 000 € économise 2 500 € par an. Temps de retour simple ?",
      choix: ["8 ans", "12 ans", "25 ans"],
      bonne: 1,
      explication: "30 000 / 2 500 = 12 ans.",
    },
    {
      q: "L’école installe beaucoup de panneaux solaires. Pourquoi son taux d’autoconsommation baisse-t-il ?",
      choix: [
        "Parce que les panneaux produisent moins",
        "Parce que la production estivale tombe pendant les vacances, école fermée",
        "Parce que le réseau refuse le surplus",
      ],
      bonne: 1,
      explication:
        "Plus la production est grande, plus une part dépasse la consommation instantanée, surtout l’été.",
    },
    {
      q: "Baisser la puissance souscrite réduit surtout…",
      choix: ["la part fixe de l’acheminement", "la fourniture", "l’accise"],
      bonne: 0,
      explication: "La puissance souscrite fixe une partie de l’acheminement, indépendante des kWh.",
    },
  ],
};
