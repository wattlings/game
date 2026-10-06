/**
 * La page « Sources » : toutes les références citées par le cours, rangées par éditeur, avec l'endroit où chacune est citée.
 * Le registre lui-même est dans commun/donnees/sources.js ; cette page ne fait que le présenter.
 */
import { GLOSSAIRE } from "../../commun/donnees/glossaire.js";
import { SOURCES, sourcesVuesLe } from "../../commun/donnees/sources.js";
import { ligneSource } from "../blocs/notes.js";
import { echapper } from "../blocs/outils.js";
import { ETAPES } from "../contenu/index.js";
import { SOURCES_DEMOS } from "../contenu/sources.js";

/** Où chaque source est citée dans le cours : { cle: ["Étape 2", "Glossaire"…] }. */
function usages() {
  const ou = {};
  const noter = (cle, lieu) => {
    if (SOURCES[cle]) {
      (ou[cle] ||= new Set()).add(lieu);
    }
  };
  ETAPES.forEach((etape) => {
    const texte = JSON.stringify(etape);
    [...texte.matchAll(/\[\[([a-z0-9, -]+)\]\]/g)].forEach((m) =>
      m[1].split(",").forEach((cle) => noter(cle.trim(), `<a href="#etape-${etape.num}">Étape ${etape.num} · ${echapper(etape.titre)}</a>`)),
    );
    // les démos de l'étape
    [...texte.matchAll(/"id":"([A-Za-z]+)"/g)].forEach((m) =>
      (SOURCES_DEMOS[m[1]] || []).forEach((cle) => noter(cle, `<a href="#etape-${etape.num}">Étape ${etape.num} · ${echapper(etape.titre)}</a>`)),
    );
  });
  Object.values(GLOSSAIRE).forEach((terme) => (terme.src || []).forEach((cle) => noter(cle, '<a href="#glossaire">Glossaire</a>')));
  return ou;
}

/** Affiche la page des sources dans `conteneur`. */
export function pageSources(conteneur) {
  const ou = usages();
  const cles = Object.keys(ou).sort((a, b) => (SOURCES[a].ed + SOURCES[a].t).localeCompare(SOURCES[b].ed + SOURCES[b].t, "fr"));
  const traitees = ETAPES.filter((etape) => /\[\[[a-z][a-z0-9, -]*\]\]/.test(JSON.stringify(etape)));
  const autres = Object.keys(SOURCES).length - cles.length;
  conteneur.innerHTML = `
  <div class="stack" style="gap:20px">
    <div class="stack" style="gap:8px">
      <span class="eyebrow">${cles.length} sources · consultées le ${echapper(sourcesVuesLe())}</span>
      <h1>Sources</h1>
      <p class="prose muted">Chaque fait et chaque règle du cours renvoie à une source qui a été ouverte et lue : un petit numéro dans le texte y mène directement. Les sources d’origine sont privilégiées (textes officiels, régulateur, gestionnaires de réseau, organismes publics) ; à défaut, la source est signalée comme secondaire.</p>
      <p class="prose muted">Trois choses n’ont pas de source, et c’est voulu : ce qui est <b>inventé pour l’exemple</b> (l’école Jean-Jaurès, ses relevés, ses prix de fourniture), ce qui relève de la <b>méthode du cours</b> (le découpage en 8 étapes, les analogies), et les <b>calculs</b> qui se vérifient à la main.</p>
      <p class="prose muted"><b>Référencement en cours.</b> ${traitees.length ? `Déjà traité : ${traitees.map((etape) => `<a href="#etape-${etape.num}">étape ${etape.num}, ${echapper(etape.titre)}</a>`).join(" ; ")}.` : ""} Les autres étapes gardent pour l’instant leur liste de liens en bas du niveau Approfondir.${autres > 0 ? ` Le jeu cite ${autres} autres sources : elles sont dans son menu, onglet Sources.` : ""}</p>
    </div>
    <section class="bloc sources page-sources">
      <ul>${cles.map((cle) => ligneSource(cle).replace("</li>", `<span class="ou">Citée dans : ${[...ou[cle]].join(", ")}</span></li>`)).join("")}</ul>
    </section>
  </div>`;
  return () => {};
}
