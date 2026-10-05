/**
 * Démo « decretTertiaire » (niveaux Comprendre / Approfondir).
 */
import { graphique } from "../blocs/graphique.js";
import { icone } from "../blocs/icones.js";
import { nombre, texteRiche, tous, un } from "../blocs/outils.js";

const CONSOMMATIONS_PASSEES = {
  2012: 372,
  2014: 355,
  2016: 340,
  2019: 325,
  2022: 301,
  2025: 294,
};

export function demoDecretTertiaire(zone, options) {
  let t = 2016;
  let a = 2;
  let c = null;
  zone.innerHTML = `
    <div class="grid-2">
      <div class="stack" style="gap:6px"><span class="eyebrow" id="dt-ref">Année de référence (entre 2010 et 2022)</span>
        <div class="row" role="group" aria-labelledby="dt-ref">${Object.keys(CONSOMMATIONS_PASSEES)
          .filter((d) => d <= 2022)
          .map(
            (d) =>
              `<button type="button" class="btn" data-a="${d}" aria-pressed="${+d === t}">${d} · ${CONSOMMATIONS_PASSEES[d]} MWh</button>`,
          )
          .join("")}</div></div>
      <div class="field"><label for="dt-baisse">Baisse annuelle à partir de 2026 : <span id="dt-baisse-txt" class="num"></span></label><input type="range" id="dt-baisse" min="0" max="6" step="0.5" value="${a}"></div>
    </div>
    <div id="dt-g"></div><div class="kpis" id="dt-kpis"></div><div id="dt-msg" aria-live="polite"></div>`;
  function o() {
    const d = CONSOMMATIONS_PASSEES[t];
    const u = {
      2030: d * 0.6,
      2040: d * 0.5,
      2050: d * 0.4,
    };
    const l = Array.from(
      {
        length: 41,
      },
      (f, h) => 2010 + h,
    );
    const s = l.map((f) =>
      f < 2025 ? null : CONSOMMATIONS_PASSEES[2025] * (1 - a / 100) ** Math.max(0, f - 2025),
    );
    const r = l.map((f) => CONSOMMATIONS_PASSEES[f] ?? null);
    un("#dt-baisse-txt", zone).textContent = `${nombre(a, 1)} % par an`;
    const i = {
      hauteur: 250,
      description: "Trajectoire de consommation de l’école et objectifs du décret tertiaire",
      marge: {
        g: 46,
      },
      x: {
        n: l.length,
        ticks: [2010, 2020, 2030, 2040, 2050].map((f) => ({
          i: f - 2010,
          texte: String(f),
        })),
        label: (f) => String(l[f]),
      },
      y: {
        unite: "MWh",
        min: 0,
        max: 400,
        format: (f) => `${nombre(f)} MWh`,
      },
      series: [
        {
          nom: "Consommation passée",
          type: "points",
          couleur: "var(--data)",
          xs: l.map((f, h) => h),
          valeurs: r,
          rayon: 5,
        },
        {
          nom: "Projection",
          couleur: "var(--energie)",
          valeurs: s,
          epaisseur: 2.5,
          format: (f) => `${nombre(f)} MWh`,
        },
      ],
      legendeExtra:
        '<span><i class="bar" style="background:none;border:2px solid var(--ink);border-radius:50%"></i>objectifs (−40 %, −50 %, −60 %)</span>',
      lignesH: [
        {
          y: d,
          texte: `référence ${t} : ${d} MWh`,
          couleur: "var(--muted)",
          couleurTexte: "var(--muted)",
        },
      ],
      marqueurs: Object.entries(u).map(([f, h]) => ({
        i: f - 2010,
        v: h,
        r: 9,
        couleur: "var(--ink)",
        texte: `${f} : ${nombre(h)}`,
      })),
    };
    if (c) {
      c.maj(i);
    } else {
      c = graphique(un("#dt-g", zone), i);
    }
    const p = Object.entries(u).map(([f, h]) => {
      const x = s[f - 2010];
      return {
        a: f,
        v: h,
        p: x,
        ok: x <= h,
      };
    });
    un("#dt-kpis", zone).innerHTML = p
      .map(
        (f) =>
          `<div class="kpi ${f.ok ? "ok" : "bad"}"><span class="v">${f.ok ? "✓" : "✗"} ${f.a}</span><span class="l">objectif ${nombre(f.v)} MWh (−${
            {
              2030: 40,
              2040: 50,
              2050: 60,
            }[f.a]
          } %) · projeté ${nombre(f.p)} MWh</span></div>`,
      )
      .join("");
    const m = p.find((f) => !f.ok);
    un("#dt-msg", zone).innerHTML =
      `<div class="feedback ${m ? "bad" : "ok"}">${icone(m ? "alerte" : "ok")}<div>${texteRiche(m ? `Trajectoire insuffisante pour ${m.a}. Change l’année de référence ou accélère la baisse. Choisir une année de référence où l’école consommait plus rend l’objectif relatif plus accessible : c’est permis, et c’est un vrai choix stratégique.` : "Trajectoire conforme aux trois échéances.")} ${texteRiche("Alternative prévue par le texte : atteindre un seuil en **valeur absolue** (kWh/m² par type d’activité) au lieu du pourcentage. Consommations corrigées du climat, déclarées chaque année sur {{operat}}. Historique fictif.")}</div></div>`;
  }
  tous("[data-a]", zone).forEach((d) =>
    d.addEventListener("click", () => {
      t = +d.dataset.a;
      tous("[data-a]", zone).forEach((u) => u.setAttribute("aria-pressed", u === d));
      options.toucher();
      o();
    }),
  );
  un("#dt-baisse", zone).addEventListener("input", (d) => {
    a = +d.target.value;
    options.toucher();
    o();
  });
  o();
  return () => c?.detruire();
}
