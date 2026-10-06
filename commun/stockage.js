/**
 * Les sauvegardes dans le navigateur (localStorage).
 * Ne pas renommer les clés : les progressions et les parties existantes en dépendent.
 */

// ---- cours : progression, thème, réglages des démos
export const CLE_ETAT_COURS = "ems-pedagogie-v1";

// ---- jeu : 3 emplacements de sauvegarde
export const NB_EMPLACEMENTS = 3;
export const cleEmplacement = (n) => "wattlings-slot-" + n;
export const CLE_EMPLACEMENT_ACTIF = "wattlings-active";
/** Sauvegarde unique de la première version du jeu : reprise dans l'emplacement 1. */
export const CLE_ANCIENNE_SAUVEGARDE = "quete-kilowatt-v1";
export const CLE_PREFERENCES_JEU = "wattlings-prefs";
export const CLE_SON = "wattlings-son";
/** Petite image de l'avatar, écrite par le jeu et affichée par le cours sur les boutons « Jouer ». */
export const CLE_AVATAR = "wattlings-avatar";

// ---- compte joueur (commun/compte.js) : ces deux clés n'existent que quand quelqu'un est connecté
export const CLE_COMPTE = "wattlings-compte";
export const CLE_COMPTE_SYNCHRO = "wattlings-compte-synchro";
/** Ce qui suit le joueur d'un appareil à l'autre quand il est connecté à son compte. */
export const CLES_SYNCHRONISEES = [
  CLE_ETAT_COURS,
  ...Array.from({ length: NB_EMPLACEMENTS }, (_, i) => cleEmplacement(i + 1)),
  CLE_EMPLACEMENT_ACTIF,
  CLE_PREFERENCES_JEU,
  CLE_SON,
  CLE_AVATAR,
];

// ---- suivi d'audience
export const CLES_SUIVI = {
  visiteur: "wattlings-vid",
  refus: "wattlings-ne-pas-compter",
  derniereActivite: "wattlings-last",
  session: "wattlings-sid", // dans sessionStorage
};

export const lire = (cle) => {
  try {
    return localStorage.getItem(cle);
  } catch {
    return null;
  }
};

export const ecrire = (cle, valeur) => {
  try {
    localStorage.setItem(cle, valeur);
    return true;
  } catch {
    return false;
  }
};

export const supprimer = (cle) => {
  try {
    localStorage.removeItem(cle);
  } catch {}
};

/** Le numéro de l'emplacement de sauvegarde utilisé en dernier (1 à 3). */
export const emplacementActif = () =>
  Math.min(NB_EMPLACEMENTS, Math.max(1, +lire(CLE_EMPLACEMENT_ACTIF) || 1));

/** La partie de l'emplacement actif, ou null si aucune partie n'a commencé. */
export function partieEnCours() {
  const n = emplacementActif();
  let brut = lire(cleEmplacement(n));
  if (!brut && n === 1) brut = lire(CLE_ANCIENNE_SAUVEGARDE);
  try {
    const partie = JSON.parse(brut || "null");
    return partie && partie.site ? partie : null;
  } catch {
    return null;
  }
}
