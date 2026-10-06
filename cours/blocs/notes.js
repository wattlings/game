/**
 * Les sources dans le cours : les appels de note (les petits numéros après une information) et la liste des sources d'une page.
 *
 * Dans un texte du contenu, [[cle]] ou [[cle-1,cle-2]] cite une source du registre (commun/donnees/sources.js).
 * Chaque page numérote ses sources dans l'ordre où elles apparaissent ; le numéro est un lien direct vers la source.
 */
import { SOURCES, libelleSource, sourcesVuesLe } from "../../commun/donnees/sources.js";

const sur = (texte) =>
  String(texte).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

/** Les clés citées par la page affichée, dans l'ordre de leur première apparition. */
let cles = [];

/** À appeler quand on commence à afficher une page : la numérotation repart de 1. */
export function ouvrirNotes() {
  cles = [];
}

/** Le numéro d'une source dans la page (attribué à sa première citation). */
function numero(cle) {
  let i = cles.indexOf(cle);
  if (i < 0) {
    cles.push(cle);
    i = cles.length - 1;
  }
  return i + 1;
}

/** Le HTML des appels de note pour une liste de clés : de petits numéros, chacun lié à sa source. */
export function appelsDeNote(liste) {
  const liens = liste
    .map((cle) => cle.trim())
    .filter((cle) => {
      if (SOURCES[cle]) {
        return true;
      }
      console.warn("Source inconnue :", cle);
      return false;
    })
    .map((cle) => {
      const n = numero(cle);
      return `<a class="appel" href="${sur(SOURCES[cle].url)}" target="_blank" rel="noopener" title="${sur(libelleSource(cle))}" aria-label="Source ${n} : ${sur(libelleSource(cle))}">${n}</a>`;
    });
  return liens.length ? `<sup class="notes">${liens.join("")}</sup>` : "";
}

/** Une ligne de la liste : numéro, éditeur, titre lié, date, et la mention « source secondaire » s'il y a lieu. */
export function ligneSource(cle, n) {
  const s = SOURCES[cle];
  return `<li${n ? ` value="${n}"` : ""}><b>${sur(s.ed)}</b>, <a href="${sur(s.url)}" target="_blank" rel="noopener">${sur(s.t)}</a>${s.date ? ` <span class="quand">(${sur(s.date)})</span>` : ""}${s.niveau === "secondaire" ? ' <span class="badge neutre secondaire" title="Presse, fabricant ou projet open source : à défaut de source d’origine">source secondaire</span>' : ""}</li>`;
}

/** La liste numérotée des sources citées jusqu'ici dans la page ("" si la page n'en cite aucune). */
export function listeNotes() {
  if (!cles.length) {
    return "";
  }
  return `<span class="eyebrow">Sources de cette page (consultées le ${sur(sourcesVuesLe())})</span><ol>${cles.map((cle, i) => ligneSource(cle, i + 1)).join("")}</ol><p class="muted">Chaque numéro du texte renvoie à l’une de ces sources. L’école Jean-Jaurès, ses relevés et ses prix sont inventés pour l’exemple. <a href="#sources">Toutes les sources du cours</a></p>`;
}

/** Remplit (ou vide) l'emplacement [data-notes] de la page avec la liste à jour. */
export function majNotes(conteneur) {
  const zone = conteneur.querySelector("[data-notes]");
  if (!zone) {
    return;
  }
  zone.innerHTML = listeNotes();
  zone.hidden = !cles.length;
}
