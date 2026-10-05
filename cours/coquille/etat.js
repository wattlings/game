/**
 * L'état du cours (progression, thème, réglages des démos), sauvegardé dans le navigateur.
 */
import { CLE_ETAT_COURS } from "../../commun/stockage.js";

let etatEnMemoire = {};

let stockageDisponible = true;

function lireEtat() {
  try {
    const e = localStorage.getItem(CLE_ETAT_COURS);
    if (e) {
      return JSON.parse(e);
    } else {
      return {};
    }
  } catch {
    stockageDisponible = false;
    return etatEnMemoire;
  }
}

function ecrireEtat(nouvelEtat) {
  etatEnMemoire = nouvelEtat;
  try {
    localStorage.setItem(CLE_ETAT_COURS, JSON.stringify(nouvelEtat));
  } catch {
    stockageDisponible = false;
  }
}

let etat = {
  progression: {},
  filtre: "tout",
  anomalies: {},
  derives: {},
  ...lireEtat(),
};

const abonnes = new Set();

/** L'état du cours. get() le lit, set({…}) le modifie et l'enregistre, on(fn) prévient à chaque changement.
 * marquer(etape, quoi) note une progression ; estFaite(etape) dit si l'Essentiel est lu et la démo manipulée. */
export const magasin = {
  get: () => etat,
  persistant: () => stockageDisponible,
  set(e) {
    etat = {
      ...etat,
      ...e,
    };
    ecrireEtat(etat);
    abonnes.forEach((n) => n(etat));
  },
  on(e) {
    abonnes.add(e);
    return () => abonnes.delete(e);
  },
  marquer(e, n) {
    const t = etat.progression[e] || {};
    if (!t[n]) {
      magasin.set({
        progression: {
          ...etat.progression,
          [e]: {
            ...t,
            [n]: true,
          },
        },
      });
    }
  },
  estFaite: (e) => {
    const n = etat.progression[e] || {};
    return !!n.essentiel && !!n.demo;
  },
  reinitialiser() {
    magasin.set({
      progression: {},
    });
  },
};
