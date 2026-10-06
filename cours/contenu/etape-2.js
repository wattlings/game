/**
 * Étape 2 · Collecter : tout le contenu de l'étape.
 * - en tête : l'Essentiel (question, phrase clé, à retenir, analogie, schéma, démo)
 * - niveaux.comprendre et niveaux.approfondir : la suite de blocs affichés dans chaque onglet
 * - quiz : le mini-quiz en fin d'Approfondir
 * Les sources : [[cle]] après une information cite une source du registre (commun/donnees/sources.js) ;
 * la liste numérotée s'affiche toute seule en bas de la page.
 */
import { etapeDeBase } from "../../commun/donnees/etapes.js";

export default {
  ...etapeDeBase(2),
  question: "D’où viennent les données et sous quelle forme ?",
  phrase:
    "La donnée d’énergie arrive par trois canaux : le télérelevé, les index et les factures. Même énergie, trois formes différentes.",
  retenir: [
    "Le {{telereleve}} est fin et rapide : une {{courbe-de-charge}} au {{pas-de-temps}} de 10 min pour l’électricité, un volume par jour pour le gaz ({{gazpar}})[[grdf-adict-faq,mne-compteurs-communicants]].",
    "L’{{index}} est le compteur qui tourne : on soustrait deux relevés pour obtenir une consommation[[mne-releve-compteur]].",
    "La facture donne le coût en euros, avec du retard et sur des périodes qui ne suivent pas les mois.",
  ],
  analogie: {
    icone: "facture",
    titre: "Trois façons de suivre ton budget",
    texte:
      "L’appli bancaire te montre chaque dépense en temps réel (télérelevé). Le relevé de fin de mois donne le solde (index). La facture du magasin dit exactement ce que tu as payé et pourquoi (facture).",
  },
  schema: "collecter",
  legendeSchema: "Trois sources, trois rythmes, un seul logiciel qui les reçoit.",
  demo: {
    id: "collecter",
    titre: "Ouvre les trois robinets de données",
    consigne: "Choisis une source et un mois : tu vois la donnée brute telle que le logiciel la reçoit.",
  },
  avenir: {
    comprendre: [
      "Démo de consentement simulé qui débloque l’accès aux données",
      "Exemple chiffré : une même consommation obtenue par les trois voies",
    ],
    approfondir: [
      "API Enedis et GRDF, tiers autorisé, RGPD",
      "Multi-cadrans, bouclage, changement de compteur, index estimé",
      "Anatomie complète d’une facture",
      "Comparaison des trois sources",
      "Mini-quiz",
    ],
  },
  niveaux: {
    comprendre: [
      {
        type: "texte",
        titre: "Qui envoie quoi ?",
        paragraphes: [
          "Les données de mesure viennent du {{distributeur}} (Enedis pour l’électricité, GRDF pour le gaz), qui pose et relève les compteurs[[mne-releve-compteur,mne-compteurs-communicants]]. La facture vient du {{fournisseur}}, qui vend l’énergie[[mne-acteurs-marche]]. Ce ne sont pas les mêmes entreprises, et pas les mêmes canaux.",
          "Avant de recevoir la moindre donnée de mesure, le logiciel a besoin d’un {{consentement}} du titulaire du contrat[[enedis-nmo-cf-015e,grdf-adict-faq]] : ici, la mairie.",
        ],
      },
      {
        type: "demo",
        id: "consentement",
        titre: "Signe un consentement (simulé)",
        consigne:
          "Remplis le formulaire au nom de la mairie, signe, puis appelle l’API. Essaie aussi d’appeler l’API sans consentement, ou après son expiration.",
      },
      {
        type: "encadre",
        ton: "info",
        titre: "Message clé n° 1 : chaque source a son usage",
        texte: [
          "Le **télérelevé** sert à **analyser** : fin, rapide, il montre quand on consomme.",
          "L’**index** sert à **contrôler** : c’est le totalisateur du compteur, la référence du comptage.",
          "La **facture** sert à **chiffrer le coût** : c’est la référence financière, mais elle arrive tard et sur des périodes décalées.",
        ],
      },
      {
        type: "demo",
        id: "troisVoies",
        titre: "Trois sources, une même vérité",
        consigne:
          "Compare la somme de la courbe de charge, la différence d’index et l’énergie facturée sur une même période. Change la période et les anomalies pour voir apparaître les écarts.",
      },
    ],
    approfondir: [
      {
        type: "texte",
        titre: "Électricité : accès aux données Enedis",
        paragraphes: [
          "**Jusqu’à 36 kVA (segment C5, compteur {{linky}})**[[enedis-segments-c1-c5]] : la {{courbe-de-charge}} est au pas de 30 minutes ; son enregistrement fin se fait avec l’accord du client[[enedis-nmo-cf-016e,cnil-linky-gazpar]]. Les tiers y accèdent par {{data-connect}}, une API où le client donne son consentement sur son espace Enedis, pour une durée demandée par le tiers et limitée à 3 ans[[enedis-contrat-data-connect]].",
          "**Au-delà de 36 kVA (segments C1 à C4, comme l’école)**[[enedis-segments-c1-c5]] : les compteurs professionnels sont télérelevés et mesurent une courbe de charge plus fine. Enedis la relève au pas de 5 minutes depuis fin 2025 ; on en reconstitue des pas de 10 ou 15 minutes[[enedis-nmo-cf-015e]] (10 minutes pour l’école). Les tiers y accèdent par le {{sge|SGE}} d’Enedis (système de gestion des échanges, en web services), avec une autorisation expresse du client, de forme libre mais conservée et limitée dans le temps[[enedis-contrat-sge,enedis-nmo-cf-015e]]. La mise en place prend de plusieurs semaines à plusieurs mois[[enedis-contrat-sge,consometers-sge-tiers]].",
        ],
      },
      {
        type: "encadre",
        ton: "verifier",
        titre: "Changement récent chez Enedis",
        texte:
          "Data Connect a basculé vers une nouvelle version le 28 septembre 2026 : nouvelle adresse d’autorisation (v2) et nouvelles API de mesure et de contrat ; les anciennes API v5 doivent être arrêtées environ deux semaines plus tard[[github-bascule-data-connect,github-eddie-data-connect]]. Information issue de projets open source : **à confirmer dans la documentation officielle Enedis** avant tout développement.",
      },
      {
        type: "texte",
        titre: "Gaz : accès aux données GRDF",
        paragraphes: [
          "GRDF met à disposition les données par l’API {{adict}} : consommations quotidiennes, mensuelles et semestrielles, données techniques du compteur et données contractuelles, avec le consentement du client[[grdf-adict-faq,datagouv-grdf-adict]]. Le compteur {{gazpar}} transmet chaque jour[[mne-compteurs-communicants]] : la consommation d’un jour J est disponible avec un décalage de 1 à 3 jours[[grdf-adict-faq]].",
          "Le compteur mesure un **volume** (m³). La consommation en énergie s’obtient avec le {{coef-conversion}} : **kWh = m³ × coefficient**[[mne-coefficient-conversion]]. Ce coefficient combine le {{pcs}} du gaz livré et une correction liée aux conditions de livraison (altitude, pression, température)[[grdf-guide-donnees-2026]]. Il change selon la commune et le mois[[grdf-coefficient-conversion]], entre 9 et 12,5 kWh/m³[[mne-coefficient-conversion]].",
        ],
      },
      {
        type: "demo",
        id: "casIndex",
        titre: "Calcule la consommation à partir des index",
        consigne:
          "Quatre cas réels de relevés. Tape ta réponse en kWh ou en m³ : le calcul naïf et le bon calcul s’affichent ensuite.",
      },
      {
        type: "demo",
        id: "anatomieFacture",
        titre: "Anatomie d’une facture",
        consigne:
          "Clique sur chaque ligne de la facture pour savoir ce qu’elle paie, à qui va l’argent, et ce qui se passe si l’école consomme 10 % de moins.",
      },
      {
        type: "encadre",
        ton: "verifier",
        titre: "Taux relevés en septembre 2026",
        texte: [
          "Accise sur l’électricité au 1er août 2026 : 26,35 €/MWh au-delà de 36 kVA (catégories « PME » et « haute puissance »), 30,62 €/MWh pour les ménages et les sites jusqu’à 36 kVA[[ministere-guide-fiscalite-2026]]. La catégorie exacte de l’école reste à vérifier. Accise sur le gaz naturel : 16,66 €/MWh à la même date[[ministere-guide-fiscalite-2026]].",
          "CTA : 15 % de la part fixe du TURPE depuis le 1er février 2026 (21,93 % avant)[[cnieg-cta-2026]] ; pour le gaz, 20,80 % de la part fixe de distribution, plus une quote-part liée au transport[[cnieg-cta-note,mne-taxes-facture]]. TVA : 20 % sur tous les postes[[mne-taxes-facture]]. TURPE 7 : +3,04 % en moyenne au 1er août 2026[[cre-deliberation-2026-105]].",
          "Les prix de fourniture et d’acheminement de l’école restent **fictifs**.",
        ],
      },
      {
        type: "tableau",
        titre: "Les trois sources comparées",
        entetes: ["", "Télérelevé", "Index", "Facture"],
        lignes: [
          [
            "Finesse",
            "10 min (élec), 1 jour (gaz)",
            "1 relevé par mois et par cadran",
            "1 montant par période de facturation",
          ],
          ["Délai", "Le lendemain (élec), 1 à 3 jours (gaz)[[enedis-nmo-cf-077e,grdf-adict-faq]]", "Quelques jours", "2 à 6 semaines"],
          ["Unité", "kW (puissance moyenne), m³ et kWh[[enedis-guide-flux-r6x]]", "kWh (élec), m³ (gaz)", "kWh et €"],
          [
            "Fiabilité",
            "Trous et doublons possibles[[enedis-guide-flux-r6x]]",
            "Référence du comptage, parfois estimé[[mne-releve-compteur]]",
            "Référence financière, parfois estimée puis régularisée[[mne-frequence-facturation]]",
          ],
          [
            "Pièges",
            "Changement d’heure, unités (W ou kW)[[enedis-guide-flux-r6x]]",
            "{{bouclage}}, changement de compteur, index qui recule",
            "Périodes décalées, {{regularisation}}",
          ],
          ["Usage", "Analyser", "Contrôler", "Chiffrer le coût"],
        ],
      },
      {
        type: "encadre",
        ton: "info",
        titre: "RGPD",
        texte:
          "La courbe de charge d’un **logement** révèle la vie de ses occupants (heures de lever, absences)[[cnil-linky-courbe-de-charge]] : c’est une donnée personnelle, d’où le consentement explicite et limité dans le temps[[cnil-deliberation-2012-404,cnil-donnee-personnelle]]. Pour un bâtiment tertiaire comme l’école, l’enjeu personnel est plus faible, mais l’accès reste encadré par le consentement du titulaire[[enedis-nmo-cf-015e]].",
      },
      {
        type: "encadre",
        ton: "qa",
        texte:
          "Cas utiles : consentement expiré pendant une collecte, consentement révoqué, PDL hors du périmètre consenti, API qui répond en W au lieu de kW, index gaz en m³ sans coefficient, facture estimée suivie d’une régularisation négative.",
      },
    ],
  },
  quiz: [
    {
      q: "Qui fournit la courbe de charge de l’école ?",
      choix: ["Le fournisseur qui envoie la facture", "Le distributeur (Enedis)", "La mairie"],
      bonne: 1,
      explication:
        "La mesure vient du gestionnaire de réseau de distribution, qui pose et relève les compteurs. Le fournisseur facture.",
    },
    {
      q: "Le logiciel appelle l’API de mesure pour un PDL sans consentement. Que doit-il se passer ?",
      choix: [
        "L’API renvoie les données, le consentement est une formalité",
        "L’API refuse l’accès",
        "L’API renvoie des données estimées",
      ],
      bonne: 1,
      explication:
        "Sans consentement valide du titulaire, pour ce point et à cette date, le tiers n’a pas accès aux données.",
    },
    {
      q: "Index au 1er mars : 99 850 m³. Index au 1er avril : 00 420 m³ (compteur à 5 chiffres). Consommation ?",
      choix: ["−99 430 m³", "570 m³", "420 m³"],
      bonne: 1,
      explication: "Le compteur a bouclé : (100 000 − 99 850) + 420 = 570 m³.",
    },
    {
      q: "En janvier, l’école consomme 4 000 m³ de gaz avec un coefficient de 11,2 kWh/m³. Combien de kWh ?",
      choix: ["357 kWh", "4 000 kWh", "44 800 kWh"],
      bonne: 2,
      explication: "kWh = m³ × coefficient = 4 000 × 11,2 = 44 800 kWh.",
    },
    {
      q: "L’école consomme 10 % d’électricité en moins. Quelle ligne de la facture ne baisse pas ?",
      choix: ["La fourniture", "L’accise", "L’abonnement"],
      bonne: 2,
      explication:
        "L’abonnement (et la part fixe de l’acheminement, donc la CTA) ne dépend pas des kWh consommés.",
    },
    {
      q: "La somme de la courbe de charge de janvier ne correspond pas à la facture « janvier ». Première chose à vérifier ?",
      choix: [
        "Que les deux couvrent bien la même période",
        "Que le compteur n’est pas en panne",
        "Que la facture n’est pas une erreur",
      ],
      bonne: 0,
      explication:
        "La période de facturation de l’école va du 14 au 13 : elle ne coïncide pas avec le mois civil. On aligne les périodes avant de comparer.",
    },
  ],
};
