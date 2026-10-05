/**
 * Démo « signature » (niveaux Comprendre / Approfondir).
 */
import { graphique } from "../blocs/graphique.js";
import { icone } from "../blocs/icones.js";
import { nombre, texteRiche, un } from "../blocs/outils.js";
import { anneeCivile, anneeDeReference } from "../modele/simulation.js";

function regressionLineaire(points) {
  const n = points.length;
  const t = points.reduce((r, i) => r + i[0], 0);
  const a = points.reduce((r, i) => r + i[1], 0);
  const c = points.reduce((r, i) => r + i[0] * i[0], 0);
  const o = points.reduce((r, i) => r + i[0] * i[1], 0);
  const d = (n * o - t * a) / (n * c - t * t);
  const u = (a - d * t) / n;
  const l = a / n;
  const s =
    1 -
    points.reduce((r, i) => r + (i[1] - (u + d * i[0])) ** 2, 0) /
      points.reduce((r, i) => r + (i[1] - l) ** 2, 0);
  return {
    a: u,
    b: d,
    r2: s,
  };
}

export function demoSignature(zone, options) {
  const t = anneeCivile(anneeDeReference());
  let a = 5;
  let c = null;
  const o = 20;
  zone.innerHTML = `<div class="field"><label for="sg-t">Température moyenne du jour : <span id="sg-t-txt" class="num"></span></label><input type="range" id="sg-t" min="-5" max="20" step="0.5" value="${a}"></div>
    <div id="sg-g"></div><div class="kpis" id="sg-kpis"></div><p class="feedback info" id="sg-msg"></p>`;
  const d = t.filter((i) => i.chauffe && i.type === "classe" && i.dju <= o);
  const u = t.filter((i) => i.chauffe && (i.type === "weekend" || i.type === "vacances") && i.dju <= o);
  const l = regressionLineaire(d.map((i) => [i.dju, i.gazKwh]));
  const s = regressionLineaire(u.map((i) => [i.dju, i.gazKwh]));
  function r() {
    const i = Math.max(0, 18 - a);
    const p = l.a + l.b * i;
    un("#sg-t-txt", zone).textContent = `${nombre(a, 1)} °C, soit ${nombre(i, 1)} DJU`;
    const m = {
      hauteur: 260,
      description:
        "Nuage de points : consommation de gaz journalière en fonction des DJU, avec droites de régression",
      marge: {
        g: 52,
      },
      x: {
        n: o + 1,
        ticks: [0, 5, 10, 15, 20].map((f) => ({
          i: f,
          texte: `${f} DJU`,
        })),
        label: (f) => `${f} DJU (${18 - f} °C)`,
      },
      y: {
        unite: "kWh",
        max: 3500,
        format: (f) => `${nombre(f)} kWh`,
      },
      series: [
        {
          nom: "Jours de classe",
          type: "points",
          couleur: "var(--energie)",
          xs: d.map((f) => f.dju),
          valeurs: d.map((f) => f.gazKwh),
          rayon: 3.5,
        },
        {
          nom: "Week-ends et vacances",
          type: "points",
          couleur: "var(--data)",
          xs: u.map((f) => f.dju),
          valeurs: u.map((f) => f.gazKwh),
          rayon: 3.5,
          opacite: 0.6,
        },
        {
          nom: "Signature des jours de classe",
          couleur: "var(--energie-ink)",
          valeurs: Array.from(
            {
              length: o + 1,
            },
            (f, h) => l.a + l.b * h,
          ),
          epaisseur: 2.5,
          format: (f) => `${nombre(f)} kWh`,
        },
        {
          nom: "Signature des jours inoccupés",
          couleur: "var(--data-ink)",
          tirets: true,
          valeurs: Array.from(
            {
              length: o + 1,
            },
            (f, h) => s.a + s.b * h,
          ),
          format: (f) => `${nombre(f)} kWh`,
        },
      ],
      marqueurs: [
        {
          i: Math.min(o, i),
          v: p,
          texte: `${nombre(p)} kWh prévus`,
          couleur: "var(--ink)",
        },
      ],
    };
    if (c) {
      c.maj(m);
    } else {
      c = graphique(un("#sg-g", zone), m);
    }
    un("#sg-kpis", zone).innerHTML = `
      <div class="kpi energie"><span class="v">${nombre(l.b)} kWh</span><span class="l">par DJU un jour de classe (pente)</span></div>
      <div class="kpi"><span class="v">${nombre(l.a)} kWh</span><span class="l">base hors chauffage (cuisine, eau chaude)</span></div>
      <div class="kpi"><span class="v">${nombre(s.b)} kWh</span><span class="l">par DJU un jour inoccupé (régime réduit)</span></div>
      <div class="kpi"><span class="v">${nombre(l.r2, 2)}</span><span class="l">R² : qualité de la droite (1 = parfaite)</span></div>`;
    un("#sg-msg", zone).innerHTML =
      `${icone("info")}<span>${texteRiche(`À ${nombre(a, 1)} °C, un jour de classe devrait consommer environ **${nombre(p)} kWh** de gaz. C’est la {{signature}} : chaque degré de froid en plus coûte environ ${nombre(l.b)} kWh. Un jour réel très au-dessus de la droite mérite une enquête.`)}</span>`;
  }
  un("#sg-t", zone).addEventListener("input", (i) => {
    a = +i.target.value;
    options.toucher();
    r();
  });
  r();
  return () => c?.detruire();
}
