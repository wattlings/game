/**
 * La page du glossaire en pleine page.
 */
import { GLOSSAIRE, termesTries } from "../../commun/donnees/glossaire.js";
import { un } from "../blocs/outils.js";
import { ficheTerme } from "../coquille/glossaire.js";

export function pageGlossaire(conteneur) {
  const n = termesTries();
  conteneur.innerHTML = `
  <div class="stack" style="gap:20px">
    <div class="stack" style="gap:8px">
      <span class="eyebrow">${n.length} termes</span>
      <h1>Glossaire</h1>
      <p class="prose muted">Chaque terme a une définition en une phrase, un exemple avec l’école Jean-Jaurès et les étapes où il sert.</p>
    </div>
    <div class="row">
      <label class="sr" for="gp-recherche">Rechercher un terme</label>
      <input id="gp-recherche" type="search" placeholder="Rechercher : kWh, index, DJU…" style="flex:1;max-width:420px">
    </div>
    <div class="gloss-page" id="gp-liste"></div>
  </div>`;
  const t = (c) =>
    c
      .toLowerCase()
      .normalize("NFD")
      .replace(/\p{Diacritic}/gu, "");
  const a = () => {
    const c = t(un("#gp-recherche", conteneur).value.trim());
    const o = n.filter((d) => !c || t(GLOSSAIRE[d].terme + " " + GLOSSAIRE[d].def).includes(c));
    un("#gp-liste", conteneur).innerHTML =
      o.map((d) => ficheTerme(d, GLOSSAIRE[d])).join("") ||
      '<p class="muted">Aucun terme ne correspond. Essaie un autre mot.</p>';
  };
  un("#gp-recherche", conteneur).addEventListener("input", a);
  a();
}
