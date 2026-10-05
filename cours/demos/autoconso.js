/**
 * Démo « autoconso » (niveaux Comprendre / Approfondir).
 */
import { FACTEURS_CO2, PRIX_EVITE } from "../../commun/donnees/references.js";
import { graphique } from "../blocs/graphique.js";
import { icone } from "../blocs/icones.js";
import { euros, nombre, pourcent, texteRiche, un } from "../blocs/outils.js";
import { MOIS, MOIS_COURTS } from "../modele/calendrier.js";
import { anneeCivile, anneeDeReference } from "../modele/simulation.js";

const PRODUCTIBLE_MENSUEL = [35, 55, 90, 120, 135, 140, 145, 125, 100, 65, 35, 25];

const HEURES_DE_SOLEIL = [
  [8.6, 17.2],
  [8, 18],
  [7.2, 19.8],
  [7, 20.6],
  [6.2, 21.3],
  [5.8, 21.9],
  [6.1, 21.8],
  [6.8, 21.1],
  [7.4, 20],
  [8, 18.9],
  [8, 17.2],
  [8.6, 16.9],
];

const PRIX_SURPLUS = 0.04;

const COUT_KWC = 1400;

export function demoAutoconso(zone, options) {
  let t = 36;
  let a = null;
  const c = anneeCivile(anneeDeReference());
  zone.innerHTML = `<div class="field"><label for="ac-kwc">Puissance des panneaux : <span id="ac-kwc-txt" class="num"></span></label><input type="range" id="ac-kwc" min="6" max="120" step="3" value="${t}"></div>
    <div id="ac-g"></div><div class="kpis" id="ac-kpis"></div><p class="feedback info" id="ac-msg"></p>`;
  function o(u) {
    const l = MOIS_COURTS.map(() => ({
      prod: 0,
      auto: 0,
      conso: 0,
    }));
    for (const s of c) {
      const r = +s.iso.slice(5, 7) - 1;
      const i = new Date(Date.UTC(+s.iso.slice(0, 4), r + 1, 0)).getUTCDate();
      const p = (u * PRODUCTIBLE_MENSUEL[r]) / i;
      const [m, f] = HEURES_DE_SOLEIL[r];
      const h = [];
      for (let v = 0; v < 144; v++) {
        const j = v / 6 + 0.08333333333333333;
        h.push(j > m && j < f ? Math.sin((Math.PI * (j - m)) / (f - m)) : 0);
      }
      const x = h.reduce((v, j) => v + j, 0) / 6;
      for (let v = 0; v < 144; v++) {
        const j = (h[v] / x) * p;
        const w = s.elec[v];
        l[r].prod += j / 6;
        l[r].auto += Math.min(j, w) / 6;
        l[r].conso += w / 6;
      }
    }
    return l;
  }
  function d() {
    const u = o(t);
    const l = [8, 9, 10, 11, 0, 1, 2, 3, 4, 5, 6, 7];
    const s = u.reduce((f, h) => f + h.prod, 0);
    const r = u.reduce((f, h) => f + h.auto, 0);
    const i = u.reduce((f, h) => f + h.conso, 0);
    const p = r * PRIX_EVITE.elec + (s - r) * PRIX_SURPLUS;
    un("#ac-kwc-txt", zone).textContent = `${t} kWc (≈ ${nombre(t * 5)} m² de panneaux)`;
    const m = {
      hauteur: 230,
      description: "Production solaire, part autoconsommée et consommation électrique par mois",
      marge: {
        g: 52,
      },
      x: {
        n: 12,
        ticks: l.map((f, h) => ({
          i: h,
          texte: MOIS_COURTS[f],
        })),
        label: (f) => MOIS[l[f]],
        espace: 26,
      },
      y: {
        unite: "kWh",
        format: (f) => `${nombre(f)} kWh`,
      },
      series: [
        {
          nom: "Production solaire",
          type: "barres",
          couleur: "color-mix(in srgb, var(--energie) 45%, var(--surface))",
          valeurs: l.map((f) => u[f].prod),
        },
        {
          nom: "Autoconsommée",
          type: "barres",
          couleur: "var(--energie)",
          valeurs: l.map((f) => u[f].auto),
        },
        {
          nom: "Consommation de l’école",
          couleur: "var(--data)",
          valeurs: l.map((f) => u[f].conso),
        },
      ],
    };
    if (a) {
      a.maj(m);
    } else {
      a = graphique(un("#ac-g", zone), m);
    }
    un("#ac-kpis", zone).innerHTML = `
      <div class="kpi"><span class="v">${nombre(s / 1000, 1)} MWh</span><span class="l">produits par an</span></div>
      <div class="kpi energie"><span class="v">${pourcent(r / s)}</span><span class="l">taux d’autoconsommation (part de la production consommée sur place)</span></div>
      <div class="kpi"><span class="v">${pourcent(r / i)}</span><span class="l">taux d’autoproduction (part des besoins couverts)</span></div>
      <div class="kpi ok"><span class="v">${euros(Math.round(p / 10) * 10)}</span><span class="l">gain annuel HT (surplus vendu ${nombre(PRIX_SURPLUS, 2)} €/kWh)</span></div>
      <div class="kpi"><span class="v">${nombre((t * COUT_KWC) / p, 1)} ans</span><span class="l">temps de retour (${euros(t * COUT_KWC)} à ${nombre(COUT_KWC)} €/kWc)</span></div>
      <div class="kpi"><span class="v">−${nombre((r * FACTEURS_CO2.elec) / 1000, 1)} t</span><span class="l">CO2e évité par l’autoconsommation</span></div>`;
    un("#ac-msg", zone).innerHTML =
      `${icone("info")}<span>${texteRiche(`Le soleil produit surtout de mai à août… quand l’école est fermée. ${r / s < 0.6 ? "Une grande partie de la production est donc vendue au réseau, bien moins cher que le kWh acheté." : "À cette taille, presque toute la production est consommée sur place."} Plus l’installation est grande, plus le taux d’autoconsommation baisse. Valeurs fictives d’ordre de grandeur.`)}</span>`;
  }
  un("#ac-kwc", zone).addEventListener("input", (u) => {
    t = +u.target.value;
    options.toucher();
    d();
  });
  d();
  return () => a?.detruire();
}
