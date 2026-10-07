/**
 * Les sauvegardes dans le navigateur (localStorage).
 * Ne pas renommer les clés : les progressions et les parties existantes en dépendent.
 */

// ---- cours : progression, thème, réglages des démos
export const CLE_ETAT_COURS = "ems-pedagogie-v1";

// ---- jeu : une seule partie, celle du compte du joueur (sans compte, rien n'est enregistré)
/** La partie. Son nom date des 3 emplacements de sauvegarde, dont c'était le premier : ne pas le renommer. */
export const CLE_PARTIE = "wattlings-slot-1";
/** Les parties d'avant (emplacements 2 et 3, première version du jeu) : lues pour reprendre une partie, jamais écrites. */
const ANCIENNES_PARTIES = ["wattlings-slot-2", "wattlings-slot-3", "quete-kilowatt-v1"];
const CLE_ANCIENNES_REPRISES = "wattlings-anciennes-reprises";
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
  CLE_PARTIE,
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

const lirePartie = (cle) => {
  try {
    const partie = JSON.parse(lire(cle) || "null");
    return partie && partie.site ? partie : null;
  } catch {
    return null;
  }
};

/** La partie de ce navigateur, ou null si aucune partie n'a commencé. */
export const partieEnCours = () => lirePartie(CLE_PARTIE);

/**
 * Au temps des 3 emplacements, une partie pouvait être ailleurs que dans le premier. S'il est vide, la plus récente
 * des parties d'avant y est recopiée : c'est elle que le joueur retrouvera (et qui rejoindra son compte).
 * Une seule fois par navigateur (sinon la partie reviendrait après chaque déconnexion). Les anciennes clés ne sont
 * ni modifiées ni effacées.
 */
export function reprendreAnciennePartie() {
  if (lire(CLE_ANCIENNES_REPRISES) || !ANCIENNES_PARTIES.some((c) => lire(c) != null)) return;
  ecrire(CLE_ANCIENNES_REPRISES, "1");
  if (partieEnCours()) return;
  const anciennes = ANCIENNES_PARTIES.filter(lirePartie).sort((a, b) => (lirePartie(b).savedAt || 0) - (lirePartie(a).savedAt || 0));
  if (anciennes.length) ecrire(CLE_PARTIE, lire(anciennes[0]));
}
