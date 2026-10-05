/**
 * Démo de l'étape 4 : changer de pas de temps et d'unité.
 */
import { graphique } from "../blocs/graphique.js";
import { icone } from "../blocs/icones.js";
import { nombre, texteRiche, tous, un } from "../blocs/outils.js";
import { ajouterJours, dateCourte, nomDuJour } from "../modele/calendrier.js";
import { agreger, anneeDeReference, kwhElecDuJour } from "../modele/simulation.js";

const PAS_DE_TEMPS = {
  "10min": {
    libelle: "10 min",
    pas: 1,
  },
  "30min": {
    libelle: "30 min",
    pas: 3,
  },
  heure: {
    libelle: "1 heure",
    pas: 6,
  },
  jour: {
    libelle: "1 jour",
    pas: 144,
  },
};

const SEMAINE_EXEMPLE = "2026-01-12";

export function demoStructurer(zone, options) {
  let t = "10min";
  let a = "m3";
  const c = anneeDeReference();
  const o = c.jours.findIndex((i) => i.iso === SEMAINE_EXEMPLE);
  const d = c.jours.slice(o, o + 7);
  const u = d.flatMap((i) => [...i.elec]);
  let l = null;
  let s = null;
  zone.innerHTML = `
    <div class="stack" style="gap:10px">
      <span class="eyebrow" id="lbl-pas">A · Pas de temps de la courbe (semaine du ${dateCourte(SEMAINE_EXEMPLE)})</span>
      <div class="segmented" role="group" aria-labelledby="lbl-pas">${Object.entries(PAS_DE_TEMPS)
        .map(
          ([i, p]) => `<button type="button" data-pas="${i}" aria-pressed="${i === t}">${p.libelle}</button>`,
        )
        .join("")}</div>
      <div id="s-g1"></div>
      <div class="kpis" id="s-kpis"></div>
      <p id="s-msg" class="feedback info" aria-live="polite"></p>
    </div>
    <div class="stack" style="gap:10px;border-top:1px solid var(--line);padding-top:16px">
      <span class="eyebrow" id="lbl-u">B · Comparer le gaz et l’électricité</span>
      <div class="segmented" role="group" aria-labelledby="lbl-u">
        <button type="button" data-u="m3" aria-pressed="true">Gaz en m³ (brut)</button>
        <button type="button" data-u="kwh" aria-pressed="false">Gaz converti en kWh</button>
      </div>
      <div id="s-g2"></div>
      <p id="s-msg2" class="feedback info" aria-live="polite"></p>
    </div>`;
  function r() {
    const i = PAS_DE_TEMPS[t].pas;
    const p = agreger(u, i);
    const m = p.length;
    const f = 144 / i;
    const h = p.reduce((L, D) => L + D * (i / 6), 0);
    const x = Math.max(...p);
    const v = {
      hauteur: 220,
      description: `Courbe de charge de la semaine au pas ${PAS_DE_TEMPS[t].libelle}`,
      x: {
        n: m,
        ticks: Array.from(
          {
            length: 7,
          },
          (L, D) => ({
            i: t === "jour" ? D : D * f + f / 2,
            texte: nomDuJour(ajouterJours(SEMAINE_EXEMPLE, D)).slice(0, 3),
          }),
        ),
        label: (L) => {
          const D = Math.floor(L / f);
          const de = (L % f) * i * 10;
          return `${nomDuJour(ajouterJours(SEMAINE_EXEMPLE, D))}${t === "jour" ? "" : `, ${String(Math.floor(de / 60)).padStart(2, "0")}:${String(de % 60).padStart(2, "0")}`}`;
        },
      },
      y: {
        unite: "kW",
        max: 60,
      },
      series: [
        {
          nom: `Puissance moyenne par pas de ${PAS_DE_TEMPS[t].libelle}`,
          type: t === "jour" ? "barres" : "aire",
          couleur: "var(--data)",
          valeurs: p,
          epaisseur: 1.5,
        },
      ],
    };
    if (l) {
      l.maj(v);
    } else {
      l = graphique(un("#s-g1", zone), v);
    }
    un("#s-kpis", zone).innerHTML = `
      <div class="kpi"><span class="v">${nombre(m)}</span><span class="l">points sur la semaine (${nombre(f)} par jour)</span></div>
      <div class="kpi data"><span class="v">${nombre(h)} kWh</span><span class="l">énergie de la semaine</span></div>
      <div class="kpi"><span class="v">${nombre(x, 1)} kW</span><span class="l">puissance maximale visible</span></div>`;
    const j = Math.max(...u);
    un("#s-msg", zone).innerHTML =
      t === "10min"
        ? `${icone("info")}<span>${texteRiche("Au pas de 10 min, tu vois chaque pic du déjeuner. Change le pas pour voir ce qui se passe.")}</span>`
        : `${icone("info")}<span>${texteRiche(`L’énergie reste **${nombre(h)} kWh** : l’{{agregation}} ne crée ni ne perd d’énergie. Mais le pic visible passe de ${nombre(j, 1)} à **${nombre(x, 1)} kW** : un pas trop grossier cache les pointes, ce qui compte pour la {{puissance-souscrite}}.`)}</span>`;
    const w = d.map(kwhElecDuJour);
    const $ = d.map((L) => (a === "m3" ? L.gazM3 : L.gazKwh));
    const T = {
      hauteur: 190,
      description: "Consommation journalière d’électricité et de gaz",
      marge: {
        g: 52,
      },
      x: {
        n: 7,
        ticks: d.map((L, D) => ({
          i: D,
          texte: nomDuJour(L.iso).slice(0, 3),
        })),
        label: (L) => `${nomDuJour(d[L].iso)} ${dateCourte(d[L].iso)}`,
      },
      y: {
        unite: a === "m3" ? "kWh | m³" : "kWh",
      },
      series: [
        {
          nom: "Électricité (kWh)",
          type: "barres",
          couleur: "var(--data)",
          valeurs: w,
          format: (L) => `${nombre(L)} kWh`,
        },
        {
          nom: a === "m3" ? "Gaz (m³)" : "Gaz (kWh)",
          type: "barres",
          couleur: "var(--energie)",
          valeurs: $,
          format: (L) => `${nombre(L)} ${a === "m3" ? "m³" : "kWh"}`,
        },
      ],
    };
    if (s) {
      s.maj(T);
    } else {
      s = graphique(un("#s-g2", zone), T);
    }
    const q = w.reduce((L, D) => L + D, 0);
    const y = d.reduce((L, D) => L + D.gazKwh, 0);
    const k = d.reduce((L, D) => L + D.gazM3, 0);
    un("#s-msg2", zone).innerHTML =
      a === "m3"
        ? `${icone("alerte")}<span>${texteRiche(`Attention : tu compares des kWh et des m³. On dirait que l’électricité (${nombre(q)} kWh) pèse ${nombre(q / k, 1)} fois plus que le gaz (${nombre(k)} m³)… c’est faux. Convertis le gaz.`)}</span>`
        : `${icone("ok")}<span>${texteRiche(`Avec le {{coef-conversion}} (${nombre(d[0].coef, 2)} kWh/m³ en janvier), le gaz pèse ${nombre(y)} kWh : ${nombre(y / q, 1)} fois l’électricité. En hiver, le chauffage domine.`)}</span>`;
  }
  tous("[data-pas]", zone).forEach((i) =>
    i.addEventListener("click", () => {
      t = i.dataset.pas;
      options.toucher();
      tous("[data-pas]", zone).forEach((p) => p.setAttribute("aria-pressed", p === i));
      r();
    }),
  );
  tous("[data-u]", zone).forEach((i) =>
    i.addEventListener("click", () => {
      a = i.dataset.u;
      options.toucher();
      tous("[data-u]", zone).forEach((p) => p.setAttribute("aria-pressed", p === i));
      r();
    }),
  );
  r();
  return () => {
    l?.detruire();
    s?.detruire();
  };
}
