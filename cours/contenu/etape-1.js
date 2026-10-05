/**
 * Étape 1 · Cadrer : tout le contenu de l'étape.
 * - en tête : l'Essentiel (question, phrase clé, à retenir, analogie, schéma, démo)
 * - niveaux.comprendre et niveaux.approfondir : la suite de blocs affichés dans chaque onglet
 * - quiz : le mini-quiz en fin d'Approfondir
 */
import { etapeDeBase } from "../../commun/donnees/etapes.js";
import { sourcesData } from "./sources.js";

export default {
  ...etapeDeBase(1),
  question: "Qu'est-ce qu'on mesure, où, et pourquoi ?",
  phrase: "Avant de mesurer quoi que ce soit, on décide quoi suivre, où, et dans quel but.",
  retenir: [
    "On délimite un **périmètre** : un site, un bâtiment, parfois un usage (chauffage, éclairage…).",
    "Chaque énergie arrive par un {{point-de-comptage}} qui a un identifiant unique : le {{pdl}} pour l’électricité, le {{pce}} pour le gaz.",
    "On fixe un objectif : baisser la facture, respecter le {{decret-tertiaire}}, réduire le CO2…",
  ],
  analogie: {
    icone: "stetho",
    titre: "Préparer un bilan de santé",
    texte:
      "Avant les examens, le médecin décide qui il examine, quels examens il prescrit et ce qu'il cherche. Sans ça, on accumule des résultats sans savoir quoi en faire.",
  },
  schema: "cadrer",
  legendeSchema: "L'école Jean-Jaurès : un site, deux compteurs, deux identifiants.",
  demo: {
    id: "cadrer",
    titre: "Relie chaque élément à son compteur",
    consigne:
      "Glisse chaque étiquette vers le bon compteur. Au clavier : sélectionne une étiquette avec Entrée, puis choisis le compteur.",
  },
  avenir: {
    comprendre: [
      "Un site avec plusieurs compteurs : que faire quand un PDL alimente deux bâtiments ?",
      "Exemple chiffré : ce que représente chaque usage dans la consommation de l’école",
    ],
    approfondir: [
      "Périmètre site / bâtiment / usage",
      "Objectifs : économie, budget, réglementation",
      "Point de comptage, sous-comptage et identifiants",
      "Mini-quiz",
    ],
  },
  niveaux: {
    comprendre: [
      {
        type: "texte",
        titre: "Du patrimoine au point de comptage",
        paragraphes: [
          "Un energy manager ne suit jamais « l’énergie » en général. Il suit des objets emboîtés : un **patrimoine** (toutes les écoles d’une ville), des **sites**, des **bâtiments**, et pour chacun des {{point-de-comptage|points de comptage}}.",
          "L’école Jean-Jaurès est un site, avec un bâtiment de 2 000 m² et deux points de comptage : un pour l’électricité, un pour le gaz. Tout ce que le logiciel affichera ensuite sera rattaché à l’un de ces objets.",
        ],
      },
      {
        type: "demo",
        id: "perimetre",
        titre: "Écris la fiche de cadrage",
        consigne:
          "Choisis l’objectif de la mairie : la fiche de cadrage (données, pas de temps, historique, indicateurs) se remplit en conséquence.",
      },
      {
        type: "demo",
        id: "usages",
        titre: "Ce que mesure un compteur, et ce qu’il ne mesure pas",
        consigne:
          "Un compteur donne un total. Bascule pour voir la répartition par usage, estimée à partir du modèle de l’école.",
      },
      {
        type: "encadre",
        ton: "info",
        titre: "Un compteur mesure un point, pas un usage",
        texte:
          "Pour connaître la consommation de l’éclairage seul, il faut un {{sous-compteur}} sur son circuit, ou une estimation. Quand un écran affiche « éclairage : 14 MWh », la question à poser est toujours : mesuré ou estimé ?",
      },
    ],
    approfondir: [
      {
        type: "tableau",
        titre: "Les niveaux de périmètre",
        entetes: ["Niveau", "À l’école", "Ce qu’on y suit"],
        lignes: [
          ["Patrimoine", "Les écoles de la ville (fictif)", "Budget global, classement des sites, priorités"],
          ["Site", "École Jean-Jaurès", "Consommation totale, kWh/m², factures"],
          ["Bâtiment", "Bâtiment principal, 2 000 m²", "Surface de référence, {{decret-tertiaire}}"],
          [
            "Point de comptage",
            "{{pdl}} 30001234567890, {{pce}} 21456789012345",
            "Courbe de charge, index, contrat",
          ],
          ["Usage", "Chauffage, éclairage, cuisine…", "Sous-comptage ou estimation"],
        ],
      },
      {
        type: "texte",
        titre: "Les identifiants",
        paragraphes: [
          "Le {{pdl}} (Point De Livraison, appelé **PRM** par Enedis) identifie un raccordement électrique avec **14 chiffres**. Le {{pce}} (Point de Comptage et d’Estimation) identifie un point de livraison de gaz chez GRDF, en général avec 14 chiffres ; certains sites anciens ont encore un identifiant « GI » suivi de 6 chiffres.",
          "Un identifiant désigne un **point de raccordement**, pas un appareil : quand le compteur est remplacé, le PDL ou le PCE reste le même, mais le numéro de série du compteur change. Le logiciel doit donc distinguer « point » et « compteur ».",
        ],
      },
      {
        type: "demo",
        id: "identifiants",
        titre: "Valide un identifiant",
        consigne: "Tape ou choisis un identifiant : le validateur dit s’il a le format d’un PDL ou d’un PCE.",
      },
      {
        type: "encadre",
        ton: "attention",
        titre: "Le lien site ↔ compteurs n’est pas toujours simple",
        texte: [
          "Un site peut avoir **plusieurs** PDL (une extension raccordée à part). Un PDL peut alimenter **plusieurs** bâtiments (l’école et le gymnase voisin). Un bâtiment peut changer de PDL après des travaux.",
          "Il faut donc prévoir une relation « plusieurs à plusieurs » entre sites et points de comptage, avec des dates de validité et parfois une clé de répartition (par exemple 80 % école, 20 % gymnase).",
        ],
      },
      {
        type: "texte",
        titre: "L’objectif décide des données",
        paragraphes: [
          "**Économie** : on cherche le gaspillage, il faut la courbe de charge et un historique. **Budget** : on prévoit les dépenses, les factures suffisent. **Réglementation** : le {{decret-tertiaire}} impose aux bâtiments tertiaires d’au moins 1 000 m² de réduire leur consommation et de la déclarer sur {{operat}} ; il faut des consommations annuelles fiables et une surface. **Climat** : on convertit les kWh en {{tco2}}.",
        ],
      },
      {
        type: "encadre",
        ton: "qa",
        texte:
          "Cas utiles : identifiant à 13 ou 15 chiffres, avec espaces ou tirets, avec des lettres ; ancien PCE « GI123456 » ; site sans compteur ; compteur sans site ; deux sites qui partagent un PDL ; compteur remplacé sans changement de PDL.",
      },
    ],
  },
  quiz: [
    {
      q: "L’école a un {{pdl}} et un {{pce}}. Combien de points de comptage a-t-elle ?",
      choix: [
        "Un seul : le site",
        "Deux : un pour l’électricité, un pour le gaz",
        "Autant que d’usages (chauffage, éclairage…)",
      ],
      bonne: 1,
      explication:
        "Un point de comptage par énergie livrée. Les usages ne sont pas des points de comptage, sauf s’ils ont un sous-compteur.",
    },
    {
      q: "Le compteur électrique de l’école est remplacé. Que devient son PDL ?",
      choix: [
        "Il change, comme le numéro du compteur",
        "Il reste le même : il désigne le raccordement, pas l’appareil",
        "Il est supprimé jusqu’à la prochaine facture",
      ],
      bonne: 1,
      explication:
        "Le PDL (ou PRM) identifie le point de raccordement. Seul le numéro de série du compteur change.",
    },
    {
      q: "Lequel de ces identifiants a le bon format pour un PDL ?",
      choix: ["3000123456789", "30001234567890", "3000-1234-5678"],
      bonne: 1,
      explication:
        "Un PDL compte exactement 14 chiffres. Le premier en a 13, le troisième contient des tirets et 12 chiffres.",
    },
    {
      q: "La mairie veut seulement prévoir son budget énergie de l’an prochain. Quelle source suffit en priorité ?",
      choix: ["La courbe de charge au pas de 10 minutes", "Les factures", "Un sous-compteur par usage"],
      bonne: 1,
      explication:
        "Pour un budget, on a besoin des montants en euros : les factures. La courbe fine sert à chercher des économies.",
    },
    {
      q: "Un écran affiche « Éclairage : 14 MWh/an » alors que l’école n’a qu’un compteur électrique. C’est…",
      choix: ["Une mesure directe", "Une estimation", "Impossible à afficher"],
      bonne: 1,
      explication:
        "Sans sous-compteur sur l’éclairage, cette valeur est calculée à partir d’hypothèses. Le logiciel devrait l’indiquer.",
    },
  ],
};
