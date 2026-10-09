/**
 * Démo « indicateurs » (niveaux Comprendre / Approfondir).
 */
import { ECOLE } from "../../commun/donnees/ecole.js";
import { FACTEURS_CO2 } from "../../commun/donnees/references.js";
import { icone } from "../blocs/icones.js";
import { euros, nombre, pourcent, texteRiche, tous, un } from "../blocs/outils.js";
import { factures } from "../modele/factures.js";
import { anneeCivile, anneeDeReference, totalElec, totalGaz } from "../modele/simulation.js";

const INDICATEURS = {
  kwh: {
    nom: "kWh",
    f: (e, n) => [e, n],
    fmt: (e) => `${nombre(e / 1000, 1)} MWh`,
  },
  m2: {
    nom: "kWh/m²",
    f: (e, n) => [e / ECOLE.surface, n / ECOLE.surface],
    fmt: (e) => `${nombre(e)} kWh/m²`,
  },
  eur: {
    nom: "€ TTC",
    f: (e, n, t, a) => [t, a],
    fmt: (e) => euros(e),
  },
  co2: {
    nom: "tCO2e",
    f: (e, n) => [(e * FACTEURS_CO2.elec) / 1000, (n * FACTEURS_CO2.gaz) / 1000],
    fmt: (e) => `${nombre(e, 1)} t`,
  },
};

export function demoIndicateurs(zone, options) {
  let t = "kwh";
  const a = anneeDeReference();
  const c = anneeCivile(a);
  const o = totalElec(c);
  const d = totalGaz(c);
  const u = factures(a);
  const l = u.elec.reduce((i, p) => i + p.ttc, 0);
  const s = u.gaz.reduce((i, p) => i + p.ttc, 0);
  zone.innerHTML = `<div class="segmented" role="group" aria-label="Indicateur">${Object.entries(INDICATEURS)
    .map(([i, p]) => `<button type="button" data-i="${i}" aria-pressed="${i === t}">${p.nom}</button>`)
    .join("")}</div><div id="in-res" aria-live="polite" class="stack" style="gap:10px"></div>`;
  function r() {
    const i = INDICATEURS[t];
    const [p, m] = i.f(o, d, l, s);
    const f = p + m;
    un("#in-res", zone).innerHTML = `
      <div class="kpis"><div class="kpi data"><span class="v">${i.fmt(p)}</span><span class="l">électricité</span></div><div class="kpi energie"><span class="v">${i.fmt(m)}</span><span class="l">gaz</span></div><div class="kpi"><span class="v">${i.fmt(f)}</span><span class="l">total</span></div></div>
      <div class="barre-empilee" role="img" aria-label="Électricité ${pourcent(p / f)}, gaz ${pourcent(m / f)}"><span style="flex:${p};background:var(--data);color:var(--on-data)">${pourcent(p / f)}</span><span style="flex:${m};background:var(--energie);color:var(--on-energie)">${pourcent(m / f)}</span></div>
      <p class="feedback info">${icone("info")}<span>${texteRiche(
        {
          kwh: "En énergie, le gaz pèse plus des deux tiers : le chauffage domine.",
          m2: "Le ratio par m² permet de comparer l’école à d’autres bâtiments, quelle que soit leur taille. C’est aussi l’unité des seuils en valeur absolue du décret tertiaire.",
          eur: "En euros, l’électricité pèse beaucoup plus qu’en kWh : son kWh coûte environ deux fois plus cher que celui du gaz.",
          co2: `En CO2, le gaz écrase tout : l’électricité française est peu carbonée (≈ ${nombre(FACTEURS_CO2.elec * 1000)} g/kWh, contre ≈ ${nombre(FACTEURS_CO2.gaz * 1000)} g/kWh pour le gaz). Facteurs à vérifier dans la Base Empreinte de l’ADEME.`,
        }[t],
      )}</span></p>
      <p class="note">${icone("info")}<span>Le même bâtiment, quatre classements différents : l’indicateur choisi change les priorités. On le décide à l’étape Cadrer.</span></p>`;
  }
  tous("[data-i]", zone).forEach((i) =>
    i.addEventListener("click", () => {
      t = i.dataset.i;
      tous("[data-i]", zone).forEach((p) => p.setAttribute("aria-pressed", p === i));
      options.toucher();
      r();
    }),
  );
  r();
}
