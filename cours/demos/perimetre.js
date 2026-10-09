/**
 * Démo « perimetre » (niveaux Comprendre / Approfondir).
 */
import { icone } from "../blocs/icones.js";
import { echapper, texteRiche, tous, un } from "../blocs/outils.js";

const OBJECTIFS = {
  economies: {
    nom: "Faire des économies",
    fiche: {
      Périmètre: "Le site, et si possible chaque usage",
      Sources: "Courbe de charge électrique, gaz journalier, météo",
      "Pas de temps": "10 min (élec, celui de l’école), 1 jour (gaz)",
      Historique: "Au moins 1 an, pour comparer les saisons",
      Indicateurs: "{{talon|Talon}}, kWh par {{dju|DJU}}, kWh hors occupation (vus à l’étape 5)",
      Suivi: "Chaque semaine",
    },
  },
  budget: {
    nom: "Tenir le budget",
    fiche: {
      Périmètre: "Le site, par contrat",
      Sources: "Factures",
      "Pas de temps": "1 mois (période de facturation)",
      Historique: "2 à 3 ans de factures",
      Indicateurs: "€ TTC, €/kWh moyen, écart au budget",
      Suivi: "Chaque mois",
    },
  },
  decret: {
    nom: "Respecter le décret tertiaire",
    fiche: {
      Périmètre: "Le bâtiment (≥ 1 000 m² de surface tertiaire)",
      Sources: "Consommations annuelles par énergie, surface, activité",
      "Pas de temps": "1 an",
      Historique: "Une année de référence (2010 au plus tôt)",
      Indicateurs: "kWh d’énergie finale, kWh/m², écart à l’objectif 2030",
      Suivi: "Chaque année (déclaration {{operat|OPERAT}})",
    },
  },
  climat: {
    nom: "Réduire le CO2",
    fiche: {
      Périmètre: "Le site, par énergie",
      Sources: "Consommations par énergie, facteurs d’émission",
      "Pas de temps": "1 mois à 1 an",
      Historique: "Une année de référence",
      Indicateurs: "tCO2e, kgCO2e/m²",
      Suivi: "Chaque trimestre",
    },
  },
};

export function demoPerimetre(zone, options) {
  const t = new Set(["economies"]);
  zone.innerHTML = `
    <div class="stack" style="gap:6px"><span class="eyebrow" id="obj-lbl">Objectifs de la mairie (plusieurs choix possibles)</span>
    <div class="row" role="group" aria-labelledby="obj-lbl">${Object.entries(OBJECTIFS)
      .map(
        ([c, o]) =>
          `<button type="button" class="btn" data-o="${c}" aria-pressed="${t.has(c)}">${echapper(o.nom)}</button>`,
      )
      .join("")}</div></div>
    <div id="p-fiche"></div>
    <p id="p-msg" class="feedback info" aria-live="polite"></p>`;
  function a() {
    const c = [...t].map((u) => OBJECTIFS[u]);
    const o = Object.keys(OBJECTIFS.economies.fiche);
    un("#p-fiche", zone).innerHTML = c.length
      ? `<div class="table-wrap"><table class="tab-texte"><thead><tr><th>Fiche de cadrage</th>${c.map((u) => `<th>${echapper(u.nom)}</th>`).join("")}</tr></thead><tbody>
      ${o.map((u) => `<tr><td class="col1">${u}</td>${c.map((l) => `<td>${texteRiche(l.fiche[u])}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`
      : "";
    const d = t.has("economies");
    un("#p-msg", zone).innerHTML = c.length
      ? `${icone("info")}<span>${texteRiche(d ? `Pour chercher des économies, il faut la donnée la plus fine : environ **52 560 mesures électriques par an** (10 min) et 365 relevés de gaz. ${t.size > 1 ? "Les autres objectifs se calculent ensuite à partir de ces mêmes données, agrégées." : ""}` : `Sans l’objectif « économies », des données mensuelles ou annuelles suffisent : ${t.has("budget") ? "12 factures par énergie et par an." : "quelques valeurs par an."} Mais on ne pourra pas expliquer **pourquoi** l’école consomme.`)}</span>`
      : `${icone("info")}<span>Choisis au moins un objectif.</span>`;
  }
  tous("[data-o]", zone).forEach((c) =>
    c.addEventListener("click", () => {
      if (t.has(c.dataset.o)) {
        t.delete(c.dataset.o);
      } else {
        t.add(c.dataset.o);
      }
      c.setAttribute("aria-pressed", t.has(c.dataset.o));
      options.toucher();
      a();
    }),
  );
  a();
}
