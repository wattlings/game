/**
 * Le thème clair ou sombre.
 */
import { icone } from "../blocs/icones.js";
import { un } from "../blocs/outils.js";

export function themeActuel() {
  const e = document.documentElement.dataset.theme;
  return e || (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
}

export function appliquerTheme(theme) {
  if (theme) {
    document.documentElement.dataset.theme = theme;
  } else {
    delete document.documentElement.dataset.theme;
  }
  const n = un("#btn-theme");
  if (n) {
    const t = themeActuel() === "dark";
    n.innerHTML = icone(t ? "soleil" : "lune");
    n.setAttribute("aria-label", t ? "Passer en mode clair" : "Passer en mode sombre");
  }
}
