/**
 * Démo de l'étape 8 : mesurer les économies à climat égal.
 */
import { graphique } from "../blocs/graphique.js";
import { icone } from "../blocs/icones.js";
import { nombre, pourcent, texteRiche, tous, un } from "../blocs/outils.js";
import { MOIS } from "../modele/calendrier.js";
import { anneeCivile, anneeDeReference } from "../modele/simulation.js";

const ECONOMIE_CHAUFFAGE = 0.16299999999999992;

export function demoMesurer(zone, options) {
  const t = anneeDeReference();
  const a = anneeCivile(t);
  const c = [];
  for (const s of a) {
    const r = s.iso.slice(0, 7);
    let i = c.find((p) => p.k === r);
    if (!i) {
      i = {
        k: r,
        dju: 0,
        gaz: 0,
        base: 0,
      };
      c.push(i);
    }
    i.dju += s.dju;
    i.gaz += s.gazKwh;
    i.base += s.chauffe
      ? {
          classe: 75,
          mercredi: 20,
        }[s.type] || 4
      : s.gazKwh;
  }
  let o = -15;
  let d = "brut";
  let u = null;
  zone.innerHTML = `
    <p>${texteRiche("L’école a baissé sa consigne de 1 °C et programmé le chauffage réduit. On compare l’année de référence (N) à l’année suivante (N+1).")}</p>
    <div class="grid-2">
      <div class="field"><label for="m-hiver">Hiver de l’année N+1 : <span id="m-hiver-txt"></span></label><input type="range" id="m-hiver" min="-25" max="20" step="5" value="${o}"></div>
      <div class="stack" style="gap:4px"><span class="eyebrow" id="lbl-mode">Comparaison</span>
        <div class="segmented" role="group" aria-labelledby="lbl-mode"><button type="button" data-m="brut" aria-pressed="true">Brute</button><button type="button" data-m="corrige" aria-pressed="false">Corrigée des DJU</button></div></div>
    </div>
    <div id="m-graph"></div>
    <div class="kpis" id="m-kpis"></div>
    <div id="m-msg" aria-live="polite"></div>`;
  function l() {
    const s = 1 + o / 100;
    const r = c.map(($) => {
      const T = $.gaz - $.base;
      const q = $.base + T * s * (1 - ECONOMIE_CHAUFFAGE);
      const y = $.base + T * (1 - ECONOMIE_CHAUFFAGE);
      if (d === "brut") {
        return q;
      } else {
        return y;
      }
    });
    const i = c.reduce(($, T) => $ + T.gaz, 0);
    const p = c.reduce(($, T) => $ + T.base + (T.gaz - T.base) * s * (1 - ECONOMIE_CHAUFFAGE), 0);
    const m = c.reduce(($, T) => $ + T.base + (T.gaz - T.base) * (1 - ECONOMIE_CHAUFFAGE), 0);
    const f = c.reduce(($, T) => $ + T.dju, 0);
    un("#m-hiver-txt", zone).textContent =
      o === 0 ? "identique à N" : `${o > 0 ? "+" : ""}${o} % de DJU (${o < 0 ? "plus doux" : "plus froid"})`;
    const h = {
      hauteur: 220,
      description: "Consommation de gaz mensuelle, année N et année N+1",
      marge: {
        g: 52,
      },
      x: {
        n: c.length,
        ticks: c.map(($, T) => ({
          i: T,
          texte: MOIS[+$.k.slice(5) - 1].slice(0, 3),
        })),
        label: ($) => MOIS[+c[$].k.slice(5) - 1],
        espace: 22,
      },
      y: {
        unite: "kWh",
        format: ($) => `${nombre($)} kWh`,
      },
      series: [
        {
          nom: "Année N (référence)",
          type: "barres",
          couleur: "var(--muted)",
          opacite: 0.55,
          valeurs: c.map(($) => $.gaz),
        },
        {
          nom: d === "brut" ? "Année N+1, brute" : "Année N+1, corrigée des DJU",
          type: "barres",
          couleur: "var(--energie)",
          valeurs: r,
        },
      ],
    };
    if (u) {
      u.maj(h);
    } else {
      u = graphique(un("#m-graph", zone), h);
    }
    const x = 1 - p / i;
    const v = 1 - m / i;
    un("#m-kpis", zone).innerHTML = `
      <div class="kpi"><span class="v">${nombre(f)} → ${nombre(f * s)}</span><span class="l">DJU de N à N+1</span></div>
      <div class="kpi ${d === "brut" ? "energie" : ""}"><span class="v">${x >= 0 ? "−" : "+"}${pourcent(Math.abs(x))}</span><span class="l">économie brute (ce qu’on voit)</span></div>
      <div class="kpi ${d === "corrige" ? "ok" : ""}"><span class="v">−${pourcent(v)}</span><span class="l">économie corrigée (l’effet réel de l’action)</span></div>`;
    const j = Math.round((x - v) * 100);
    let w;
    if (o === 0) {
      w = "Même météo les deux années : brut et corrigé donnent le même résultat. C’est rare en vrai.";
    } else if (o < 0) {
      w = `L’hiver doux gonfle l’économie apparente de **${j} points**. Sans correction, on attribuerait à l’action un gain qui vient de la météo.`;
    } else {
      w = `L’hiver froid masque **${-j} points** d’économie. Sans correction, on pourrait croire que l’action n’a ${x <= 0 ? "pas du tout " : ""}marché et l’abandonner à tort.`;
    }
    un("#m-msg", zone).innerHTML =
      `<div class="feedback ${d === "corrige" ? "ok" : "info"}">${icone(d === "corrige" ? "ok" : "info")}<div>${texteRiche(w)} ${texteRiche("La correction divise le chauffage par le rapport des {{dju}} : c’est le principe de la {{mv}}.")}</div></div>`;
  }
  un("#m-hiver", zone).addEventListener("input", (s) => {
    o = +s.target.value;
    options.toucher();
    l();
  });
  tous("[data-m]", zone).forEach((s) =>
    s.addEventListener("click", () => {
      d = s.dataset.m;
      options.toucher();
      tous("[data-m]", zone).forEach((r) => r.setAttribute("aria-pressed", r === s));
      l();
    }),
  );
  l();
  return () => u?.detruire();
}
