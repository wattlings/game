/**
 * Le petit dessin de l'école affiché sur l'accueil et la page École.
 */
import { dessinCompteur, dessinEcole } from "./outils.js";

export const vignetteEcole =
  () => `<svg viewBox="0 0 200 150" role="img" aria-label="Dessin de l'école Jean-Jaurès avec ses deux compteurs">
  ${dessinEcole(40, 10, 1)}
  <rect x="0" y="120" width="200" height="3" rx="1.5" fill="var(--line)"/>
  ${dessinCompteur(2, 68, "var(--data)", "kWh")}
  ${dessinCompteur(156, 68, "var(--energie)", "m³", "var(--on-energie)")}
</svg>`;
