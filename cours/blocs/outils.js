/**
 * Petits outils d'affichage : sélection d'éléments, échappement, texte enrichi, formats de nombres.
 */
import { GLOSSAIRE } from "../../commun/donnees/glossaire.js";

export const un = (selecteur, parent = document) => parent.querySelector(selecteur);

export const tous = (selecteur, parent = document) => [...parent.querySelectorAll(selecteur)];

export const echapper = (texte) =>
  String(texte).replace(
    /[&<>"']/g,
    (n) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      })[n],
  );

export function texteRiche(texte) {
  return echapper(texte)
    .replace(/\{\{([a-z0-9-]+)(?:\|([^}]+))?\}\}/g, (n, t, a) => {
      const c = GLOSSAIRE[t];
      if (c) {
        return `<button type="button" class="terme" data-g="${t}">${a || c.terme}</button>`;
      } else {
        console.warn("Terme de glossaire inconnu :", t);
        return a || t;
      }
    })
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
}

const formatNombre = (decimales) =>
  new Intl.NumberFormat("fr-FR", {
    maximumFractionDigits: decimales,
    minimumFractionDigits: decimales,
  });

export const nombre = (valeur, decimales = 0) => formatNombre(decimales).format(valeur);

export const euros = (valeur, decimales = 0) => `${nombre(valeur, decimales)} €`;

export const pourcent = (valeur, decimales = 0) => `${nombre(valeur * 100, decimales)} %`;

export function interrupteur(id, libelle, aide = "", coche = false) {
  return `<label class="switch" for="${id}"><input type="checkbox" id="${id}" ${coche ? "checked" : ""}><span class="track" aria-hidden="true"></span><span>${echapper(libelle)}${aide ? `<small>${echapper(aide)}</small>` : ""}</span></label>`;
}
