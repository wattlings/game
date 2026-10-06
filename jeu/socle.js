/**
 * Le socle commun vu depuis le jeu.
 *
 * Les fichiers du jeu sont des scripts classiques qui partagent leurs noms ; ce module, chargé avant eux,
 * leur fournit ce qui vient de commun/ sous les noms qu'ils utilisent déjà. C'est le seul endroit où le jeu
 * touche au socle : pour savoir d'où vient un nom, chercher ici.
 */
import { CHAPITRES_JEU, ETAPES_DE_BASE, chapitresDeLEtape } from "../commun/donnees/etapes.js";
import { ECOLE } from "../commun/donnees/ecole.js";
import * as patrimoine from "../commun/donnees/patrimoine.js";
import { SOURCES, libelleSource, sourcesVuesLe } from "../commun/donnees/sources.js";
import * as graphiques from "../commun/graphiques/barres.js";
import { LIENS } from "../commun/liens.js";
import {
  CLE_ANCIENNE_SAUVEGARDE,
  CLE_AVATAR,
  CLE_EMPLACEMENT_ACTIF,
  CLE_PREFERENCES_JEU,
  CLE_SON,
  NB_EMPLACEMENTS,
  cleEmplacement,
} from "../commun/stockage.js";
import { reglerSuivi, suiviActif, suivre } from "../commun/suivi.js";

// ---- suivi d'audience : pour les statistiques, toute la page du jeu s'appelle « jeu »
reglerSuivi({ page: () => "jeu" });
const TRK = { track: suivre, active: suiviActif };

// ---- étapes du cycle et chapitres du jeu
const STEP_T = ["", ...ETAPES_DE_BASE.map((e) => e.titre)]; // STEP_T[3] = "Fiabiliser"
const STEP_NAMES = { 0: "Le cycle", P: "Patrimoine" };
const STEP_CH = { 0: 0, P: CHAPITRES_JEU.findIndex((c) => c.page === "patrimoine") }; // premier chapitre de chaque étape
for (const e of ETAPES_DE_BASE) {
  STEP_NAMES[e.num] = e.titre;
  STEP_CH[e.num] = chapitresDeLEtape(e.num)[0];
}
const STEP_HASH = (st) => (st === 0 ? "accueil" : st === "P" ? "patrimoine" : "etape-" + st); // page du cours d'une étape
const CHAPTERS = CHAPITRES_JEU.map((c) => c.titre);
const CH2HASH = CHAPITRES_JEU.map((c) => c.page); // page du cours de chaque chapitre

Object.assign(globalThis, {
  TRK,
  LIENS,
  ECOLE,
  STEP_T,
  STEP_NAMES,
  STEP_CH,
  STEP_HASH,
  CHAPTERS,
  CH2HASH,
  // sources : le registre des références, commun au cours et au jeu (affiché par interface/sources.js)
  SOURCES,
  libelleSource,
  sourcesVuesLe,
  // sauvegardes
  SAVE_KEY: CLE_ANCIENNE_SAUVEGARDE,
  SLOT_N: NB_EMPLACEMENTS,
  SLOT_KEY: cleEmplacement,
  ACTIVE_KEY: CLE_EMPLACEMENT_ACTIF,
  PREF_KEY: CLE_PREFERENCES_JEU,
  CLE_SON,
  CLE_AVATAR,
  // patrimoine : ACT, PSITES, IND, pareto, ratio, ecart, gis…
  ...patrimoine,
  // graphiques : paretoHTML, benchHTML, ecartHTML, gisHTML, invHTML, tipify…
  ...graphiques,
});
