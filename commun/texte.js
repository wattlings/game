/**
 * Petits outils de texte partagés par les graphiques du cours et du jeu.
 */

/** Rend un texte sûr à insérer dans du HTML. */
export const esc = (s) =>
  String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);

/** Nombre au format français (1 234,5). */
export const fmt = (n) => Number(n).toLocaleString("fr-FR");
