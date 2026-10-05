/**
 * Les questions du quiz de synthèse (page « Quiz final »).
 */
export const QUESTIONS_QUIZ_FINAL = [
  {
    etape: 1,
    q: "Qu’identifie un PDL ?",
    choix: [
      "Un compteur précis, par son numéro de série",
      "Un point de raccordement électrique",
      "Un contrat de fourniture",
    ],
    bonne: 1,
    explication:
      "Le PDL (ou PRM) désigne le point de raccordement ; il reste le même si le compteur est remplacé.",
  },
  {
    etape: 2,
    q: "Quelle source sert d’abord à chiffrer le coût ?",
    choix: ["La courbe de charge", "Les index", "La facture"],
    bonne: 2,
    explication:
      "La facture est la référence financière ; le télérelevé sert à analyser, l’index à contrôler.",
  },
  {
    etape: 2,
    q: "Que faut-il pour qu’un logiciel tiers accède aux données d’un compteur ?",
    choix: [
      "Rien, elles sont publiques",
      "Le consentement du titulaire du contrat",
      "Un abonnement chez le fournisseur",
    ],
    bonne: 1,
    explication:
      "Le tiers autorisé agit avec le consentement du client, pour un périmètre et une durée donnés.",
  },
  {
    etape: 3,
    q: "Au pas de 10 min, une journée de 25 h compte…",
    choix: ["144 mesures", "150 mesures", "138 mesures"],
    bonne: 1,
    explication: "25 × 6 = 150. Ce ne sont pas des doublons : l’heure de 2 h à 3 h a eu lieu deux fois.",
  },
  {
    etape: 3,
    q: "Un index passe de 413 989 à 404 989 kWh. Que fais-tu ?",
    choix: ["Tu comptes −9 000 kWh", "Tu rejettes et signales le relevé", "Tu ignores le signe"],
    bonne: 1,
    explication: "Un index ne recule pas : erreur de saisie, bouclage ou changement de compteur à vérifier.",
  },
  {
    etape: 4,
    q: "Pour additionner gaz et électricité, on convertit le gaz…",
    choix: ["de kWh en m³", "de m³ en kWh avec le coefficient de conversion", "en euros"],
    bonne: 1,
    explication: "kWh = m³ × coefficient (≈ 11 kWh/m³).",
  },
  {
    etape: 5,
    q: "Le talon, c’est…",
    choix: ["la pointe du déjeuner", "la consommation du bâtiment vide", "la puissance souscrite"],
    bonne: 1,
    explication: "La puissance appelée la nuit, le week-end et en vacances : ce qui ne s’arrête jamais.",
  },
  {
    etape: 5,
    q: "Un jour à 3 °C de moyenne compte combien de DJU (base 18 °C) ?",
    choix: ["3", "15", "21"],
    bonne: 1,
    explication: "18 − 3 = 15 DJU.",
  },
  {
    etape: 6,
    q: "Sans référence (baseline), on ne peut pas…",
    choix: ["mesurer une consommation", "dire si une consommation est anormale", "payer la facture"],
    bonne: 1,
    explication: "Détecter, c’est comparer au « normal ». Il faut donc d’abord définir ce normal.",
  },
  {
    etape: 7,
    q: "Quelle action est la plus rentable pour l’école ?",
    choix: ["Des panneaux solaires", "Baisser la consigne de 1 °C", "Une chaudière neuve"],
    bonne: 1,
    explication: "Environ 1 200 € par an pour un coût nul : la sobriété d’abord.",
  },
  {
    etape: 8,
    q: "Pourquoi corrige-t-on une comparaison avant/après avec les DJU ?",
    choix: [
      "Pour que l’hiver plus doux ou plus froid ne fausse pas le résultat",
      "Pour convertir les m³ en kWh",
      "Parce que c’est obligatoire sur la facture",
    ],
    bonne: 0,
    explication:
      "La météo explique une partie des écarts de chauffage ; on ne garde que l’effet de l’action.",
  },
  {
    etape: 8,
    q: "Après l’étape Mesurer, que se passe-t-il ?",
    choix: [
      "Le projet est terminé",
      "On revient à Cadrer avec de nouveaux objectifs",
      "On supprime les données",
    ],
    bonne: 1,
    explication: "C’est une boucle d’amélioration continue, comme dans ISO 50001.",
  },
];
