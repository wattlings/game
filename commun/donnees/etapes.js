/**
 * Les 8 étapes du cycle et leurs deux familles (Data, Énergie).
 * Seule source des noms d'étapes pour le cours comme pour le jeu.
 */
export const FAMILLES = {
  data: {
    nom: "Data",
    icone: "data",
    description: "Obtenir une donnée juste et bien rangée",
  },
  energie: {
    nom: "Énergie",
    icone: "energie",
    description: "Comprendre la consommation et la réduire",
  },
};

export const ETAPES_DE_BASE = [
  {
    num: 1,
    slug: "cadrer",
    titre: "Cadrer",
    famille: "data",
    aussi: "energie",
  },
  {
    num: 2,
    slug: "collecter",
    titre: "Collecter",
    famille: "data",
  },
  {
    num: 3,
    slug: "fiabiliser",
    titre: "Fiabiliser",
    famille: "data",
  },
  {
    num: 4,
    slug: "structurer",
    titre: "Structurer",
    famille: "data",
  },
  {
    num: 5,
    slug: "analyser",
    titre: "Analyser",
    famille: "energie",
  },
  {
    num: 6,
    slug: "detecter",
    titre: "Détecter",
    famille: "energie",
  },
  {
    num: 7,
    slug: "agir",
    titre: "Agir",
    famille: "energie",
  },
  {
    num: 8,
    slug: "mesurer",
    titre: "Mesurer",
    famille: "energie",
    aussi: "data",
  },
];

/** La base d'une étape : numéro, identifiant, titre, famille. */
export const etapeDeBase = (num) => ETAPES_DE_BASE.find((e) => e.num === num);

/**
 * Les chapitres du jeu, dans l'ordre (le rang dans la liste est le numéro du chapitre).
 * - titre  : le nom affiché dans le jeu et sur les boutons « Jouer » du cours
 * - resume : la phrase affichée sous le bouton, côté cours
 * - page   : la page du cours qui explique ce chapitre
 * - etape  : l'étape du cycle à laquelle le chapitre se rattache (absent hors étapes)
 */
export const CHAPITRES_JEU = [
  { titre: "Accueil · choix du site", resume: "Choisis ton site", page: "accueil" },
  {
    titre: "Arène 1 · Cadrer : repérage du site",
    resume: "Repère ton site de l’extérieur : adresse, surface, activité",
    page: "etape-1",
    etape: 1,
  },
  {
    titre: "Arène 1 · Cadrer : compteurs et Arène du Cadastre",
    resume: "Trouve les compteurs, puis affronte Mme Périmètre à l’Arène du Cadastre",
    page: "etape-1-comprendre",
    etape: 1,
  },
  {
    titre: "Arène 2 · Collecter (Arène des Flux)",
    resume: "Arène des Flux : trois dresseurs, puis le mandat de M. Relève",
    page: "etape-2",
    etape: 2,
  },
  {
    titre: "Arène 3 · Fiabiliser (Arène du Tamis)",
    resume: "Arène du Tamis : trois dresseurs, puis les 7 anomalies du Dr Doublon",
    page: "etape-3",
    etape: 3,
  },
  {
    titre: "Arène 4 · Structurer (Arène des Archives)",
    resume: "Arène des Archives : range et convertis les données",
    page: "etape-4",
    etape: 4,
  },
  {
    titre: "Arène 5 · Analyser (Arène des Courbes)",
    resume: "Arène des Courbes : trouve le talon, règle la puissance souscrite",
    page: "etape-5",
    etape: 5,
  },
  {
    titre: "Arène 6 · Détecter (ronde, puis Arène de la Nuit)",
    resume: "Ronde de nuit sur ton site, puis Arène de la Nuit",
    page: "etape-6",
    etape: 6,
  },
  {
    titre: "Arène 7 · Agir (Arène du Chantier)",
    resume: "Arène du Chantier : compose un plan d’action sous budget",
    page: "etape-7",
    etape: 7,
  },
  {
    titre: "Arène 8 · Mesurer (Arène de la Preuve)",
    resume: "Arène de la Preuve : mesure l’effet réel, décret tertiaire et OPERAT",
    page: "etape-8",
    etape: 8,
  },
  {
    titre: "Chapitre 10 · Gestionnaire de patrimoine",
    resume: "Analyse 20 sites : Pareto, activités, bâtiments similaires",
    page: "patrimoine",
    etape: 8,
  },
  { titre: "Épilogue · exploration libre", resume: "Exploration libre", page: "quiz-final" },
];

/** Les numéros des chapitres du jeu rattachés à une étape (étape 1 : [1, 2] ; étape 8 : [9, 10]). */
export const chapitresDeLEtape = (num) =>
  CHAPITRES_JEU.map((c, i) => (c.etape === num ? i : -1)).filter((i) => i >= 0);
