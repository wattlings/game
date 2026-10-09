/**
 * La page du glossaire en pleine page : recherche, filtre par étape, index de A à Z, termes rangés par lettre.
 */
import { GLOSSAIRE, termesTries } from "../../commun/donnees/glossaire.js";
import { echapper, un, tous } from "../blocs/outils.js";
import { ETAPES } from "../contenu/index.js";
import { ficheTerme } from "../coquille/glossaire.js";

const sansAccents = (c) =>
  c
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "");
const lettreDe = (cle) => sansAccents(GLOSSAIRE[cle].terme).charAt(0).toUpperCase();

/** Affiche le glossaire en pleine page dans `conteneur`. */
export function pageGlossaire(conteneur) {
  const n = termesTries();
  conteneur.innerHTML = `
  <div class="stack" style="gap:20px">
    <div class="stack" style="gap:8px">
      <span class="eyebrow">${n.length} termes</span>
      <h1>Glossaire</h1>
      <p class="prose muted">Chaque terme a une définition en une phrase, un exemple avec l’école Jean-Jaurès et les étapes où il sert.</p>
    </div>
    <div class="row gp-outils">
      <div class="field" style="flex:1;max-width:420px"><label for="gp-recherche">Rechercher un terme</label><input id="gp-recherche" type="search" placeholder="kWh, index, DJU…"></div>
      <div class="field"><label for="gp-etape">Étape</label><select id="gp-etape"><option value="">Toutes les étapes</option>${ETAPES.map((e) => `<option value="${e.num}">${e.num}. ${echapper(e.titre)}</option>`).join("")}</select></div>
    </div>
    <p class="muted" id="gp-compte" aria-live="polite" style="font-size:var(--t-s)"></p>
    <nav class="gp-index" aria-label="Aller à la lettre" id="gp-index"></nav>
    <div id="gp-liste" class="stack" style="gap:24px"></div>
  </div>`;
  const afficher = () => {
    const c = sansAccents(un("#gp-recherche", conteneur).value.trim());
    const etape = +un("#gp-etape", conteneur).value || 0;
    const o = n.filter(
      (d) => (!c || sansAccents(GLOSSAIRE[d].terme + " " + GLOSSAIRE[d].def).includes(c)) && (!etape || GLOSSAIRE[d].etapes.includes(etape)),
    );
    const lettres = [...new Set(o.map(lettreDe))];
    un("#gp-compte", conteneur).textContent = o.length
      ? `${o.length} terme${o.length > 1 ? "s" : ""}${etape ? ` pour l’étape ${etape}` : ""}.`
      : "Aucun terme ne correspond. Essaie un autre mot.";
    un("#gp-index", conteneur).innerHTML = lettres.map((l) => `<button type="button" class="chip" data-lettre="${l}">${l}</button>`).join("");
    un("#gp-liste", conteneur).innerHTML = lettres
      .map(
        (l) =>
          `<section class="stack" style="gap:10px" aria-labelledby="gp-l-${l}"><h2 class="gp-lettre" id="gp-l-${l}" tabindex="-1">${l}</h2><div class="gloss-page">${o
            .filter((d) => lettreDe(d) === l)
            .map((d) => ficheTerme(d, GLOSSAIRE[d]))
            .join("")}</div></section>`,
      )
      .join("");
    tous("[data-lettre]", conteneur).forEach((b) =>
      b.addEventListener("click", () => {
        const h = un(`#gp-l-${b.dataset.lettre}`, conteneur);
        h.scrollIntoView({ block: "start" });
        window.scrollBy(0, -140); // sous la barre du haut
        h.focus({ preventScroll: true });
      }),
    );
  };
  un("#gp-recherche", conteneur).addEventListener("input", afficher);
  un("#gp-etape", conteneur).addEventListener("change", afficher);
  afficher();
}
