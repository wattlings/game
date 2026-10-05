/**
 * Petits outils d'affichage : sélection d'éléments, échappement, texte enrichi, formats de nombres.
 */
import { GLOSSAIRE } from "../../commun/donnees/glossaire.js";

/** Le premier élément qui correspond au sélecteur (dans la page, ou dans `parent`). */
export const un = (selecteur, parent = document) => parent.querySelector(selecteur);

/** Tous les éléments qui correspondent au sélecteur, sous forme de liste. */
export const tous = (selecteur, parent = document) => [...parent.querySelectorAll(selecteur)];

/** Rend un texte sûr à insérer dans du HTML. */
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

/** Met en forme un texte du contenu : {{terme}} devient un lien vers le glossaire, **gras** devient du gras. */
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

/** Nombre au format français, avec le nombre de décimales voulu. */
export const nombre = (valeur, decimales = 0) => formatNombre(decimales).format(valeur);

/** Montant en euros au format français. */
export const euros = (valeur, decimales = 0) => `${nombre(valeur, decimales)} €`;

/** Proportion (0,25) affichée en pourcentage (25 %). */
export const pourcent = (valeur, decimales = 0) => `${nombre(valeur * 100, decimales)} %`;

/** Le HTML d'un interrupteur (case à cocher habillée) avec son libellé et son aide. */
export function interrupteur(id, libelle, aide = "", coche = false) {
  return `<label class="switch" for="${id}"><input type="checkbox" id="${id}" ${coche ? "checked" : ""}><span class="track" aria-hidden="true"></span><span>${echapper(libelle)}${aide ? `<small>${echapper(aide)}</small>` : ""}</span></label>`;
}
