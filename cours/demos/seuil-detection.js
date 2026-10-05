/**
 * Démo « seuilDetection » (niveaux Comprendre / Approfondir).
 */
import { graphique } from "../blocs/graphique.js";
import { icone } from "../blocs/icones.js";
import { interrupteur, nombre, pourcent, texteRiche, tous, un } from "../blocs/outils.js";
import { DEBUT_SIMULATION, JOURS_PAR_AN, dateCourte, dateFr } from "../modele/calendrier.js";
import { courbeDeCharge } from "../modele/releves.js";
import { simulerAnnee } from "../modele/simulation.js";

const DEBUT_DERIVE = "2026-01-12";

let cacheScenario = null;

function scenarioTalon() {
  if (cacheScenario) {
    return cacheScenario;
  }
  const e = simulerAnnee({
    derives: {
      talonNocturne: true,
    },
  });
  const n = e.jours.slice(0, JOURS_PAR_AN);
  const t = n.map((d) => d.elec.reduce((u, l) => u + l, 0) / 6);
  const a = courbeDeCharge(e, DEBUT_SIMULATION, JOURS_PAR_AN, {
    doublons: true,
    aberrantes: true,
    trous: true,
  });
  const c = new Array(n.length).fill(0);
  const o = new Map(n.map((d, u) => [d.iso, u]));
  a.forEach((d) => {
    c[o.get(d.iso)] += d.kw / 6;
  });
  cacheScenario = {
    jours: n,
    propre: t,
    brut: c,
  };
  return cacheScenario;
}

export function demoSeuilDetection(zone, options) {
  let t = 10;
  let a = 2;
  let c = "modele";
  let o = false;
  let d = null;
  zone.innerHTML = `
    <p>${texteRiche("Scénario : à partir du **12 janvier**, un équipement reste allumé la nuit et le week-end (+3 kW). Règle ton alerte pour la détecter vite, sans fausses alertes.")}</p>
    <div class="grid-2">
      <div class="field"><label for="sd-seuil">Seuil : écart de plus de <span id="sd-seuil-txt" class="num"></span> au-dessus de la référence</label><input type="range" id="sd-seuil" min="2" max="40" step="1" value="${t}"></div>
      <div class="field"><label for="sd-pers">Persistance : pendant <span id="sd-pers-txt" class="num"></span> jour(s) d’affilée</label><input type="range" id="sd-pers" min="1" max="7" step="1" value="${a}"></div>
    </div>
    <div class="row" style="gap:16px">
      <div class="segmented" role="group" aria-label="Référence"><button type="button" data-r="modele" aria-pressed="true">Référence fixe (sept.–déc.)</button><button type="button" data-r="glissante" aria-pressed="false">Référence glissante (4 semaines)</button></div>
      ${interrupteur("sd-sale", "Données non fiabilisées", "Doublons, pic à 999,9 kW, trous", false)}
    </div>
    <div id="sd-g"></div><div class="kpis" id="sd-kpis"></div><div id="sd-msg" aria-live="polite"></div>`;
  function u() {
    const { jours: s, propre: r, brut: i } = scenarioTalon();
    const p = o ? i : r;
    const m = {};
    s.forEach((q, y) => {
      if (q.iso < "2026-01-01") {
        const k = q.type;
        m[k] = m[k] || [0, 0];
        m[k][0] += p[y];
        m[k][1]++;
      }
    });
    const f = s.map((q, y) => {
      if (c === "modele") {
        const L = m[q.type];
        if (L) {
          return L[0] / L[1];
        } else {
          return null;
        }
      }
      const k = [];
      for (let L = y - 7; L >= 0 && k.length < 4; L -= 7) {
        if (s[L].type === q.type) {
          k.push(p[L]);
        }
      }
      if (k.length >= 2) {
        return k.reduce((L, D) => L + D, 0) / k.length;
      } else {
        return null;
      }
    });
    const h = p.map((q, y) => (f[y] ? q / f[y] - 1 : 0));
    const x = new Array(s.length).fill(false);
    let v = 0;
    for (let q = 0; q < s.length; q++) {
      v = h[q] > t / 100 ? v + 1 : 0;
      if (v >= a) {
        x[q] = true;
      }
    }
    const j = s.findIndex((q) => q.iso === DEBUT_DERIVE);
    const w = x.findIndex((q, y) => q && y >= j);
    const $ = x.filter((q, y) => q && y < j).length;
    const T = x.filter((q, y) => q && y >= j).length;
    return {
      jours: s,
      serie: p,
      ref: f,
      alerte: x,
      iDerive: j,
      premiere: w,
      fauxPos: $,
      vraisJours: T,
    };
  }
  function l() {
    const s = u();
    un("#sd-seuil-txt", zone).textContent = pourcent(t / 100);
    un("#sd-pers-txt", zone).textContent = a;
    const r = {
      hauteur: 240,
      description: "Consommation électrique journalière, référence et jours en alerte",
      marge: {
        g: 50,
      },
      x: {
        n: s.jours.length,
        ticks: s.jours
          .map((m, f) =>
            m.iso.endsWith("-01")
              ? {
                  i: f,
                  texte: dateCourte(m.iso).split(" ")[1],
                }
              : null,
          )
          .filter(Boolean),
        label: (m) => dateFr(s.jours[m].iso),
        espace: 30,
      },
      y: {
        unite: "kWh",
        max: 600,
        format: (m) => `${nombre(m)} kWh`,
      },
      zones: [
        {
          i0: s.iDerive,
          i1: s.jours.length - 1,
          texte: "dérive active",
          couleur: "var(--bad-soft)",
        },
      ],
      series: [
        {
          nom: "Consommation du jour",
          couleur: "var(--energie)",
          valeurs: s.serie,
          epaisseur: 1.5,
        },
        {
          nom: "Référence",
          couleur: "var(--ink)",
          tirets: true,
          valeurs: s.ref,
          epaisseur: 1.5,
        },
      ],
      marqueurs: s.alerte
        .map((m, f) =>
          m
            ? {
                i: f,
                v: Math.min(590, s.serie[f]),
                r: 3,
                couleur: "var(--bad)",
              }
            : null,
        )
        .filter(Boolean),
      legendeExtra: '<span><i class="bar" style="background:var(--bad)"></i>jour en alerte</span>',
    };
    if (d) {
      d.maj(r);
    } else {
      d = graphique(un("#sd-g", zone), r);
    }
    const i = s.premiere >= 0 ? s.premiere - s.iDerive : null;
    un("#sd-kpis", zone).innerHTML = `
      <div class="kpi ${i == null ? "bad" : i <= 7 ? "ok" : ""}"><span class="v">${i == null ? "jamais" : `${i} j`}</span><span class="l">délai de détection${s.premiere >= 0 ? ` (${dateCourte(s.jours[s.premiere].iso)})` : ""}</span></div>
      <div class="kpi ${s.fauxPos ? "bad" : "ok"}"><span class="v">${s.fauxPos}</span><span class="l">jours de fausse alerte avant la dérive</span></div>
      <div class="kpi"><span class="v">${s.vraisJours}</span><span class="l">jours en alerte après le 12 janvier</span></div>`;
    const p = [];
    if (i == null) {
      p.push({
        c: "bad",
        t: "La dérive n’est jamais détectée : **faux négatif**. Baisse le seuil ou la persistance.",
      });
    }
    if (s.fauxPos > 5) {
      p.push({
        c: "bad",
        t: `${s.fauxPos} jours de **faux positifs** : trop d’alertes inutiles, l’équipe finira par les ignorer.${o ? " Une partie vient des données non fiabilisées (pic aberrant, doublons) : la détection dépend de l’étape 3." : ""}`,
      });
    }
    if (c === "glissante" && s.vraisJours < 25 && i != null) {
      p.push({
        c: "info",
        t: "Avec une référence glissante, la dérive finit par entrer dans la référence : après quelques semaines, l’alerte s’éteint alors que le gaspillage continue.",
      });
    }
    if (!p.length) {
      p.push({
        c: "ok",
        t: `Bon réglage : dérive repérée en ${i} jour${i > 1 ? "s" : ""}, avec peu de fausses alertes.`,
      });
    }
    un("#sd-msg", zone).innerHTML = p
      .map(
        (m) =>
          `<div class="feedback ${m.c}" style="margin-top:8px">${icone(m.c === "ok" ? "ok" : m.c === "bad" ? "alerte" : "info")}<span>${texteRiche(m.t)}</span></div>`,
      )
      .join("");
  }
  un("#sd-seuil", zone).addEventListener("input", (s) => {
    t = +s.target.value;
    options.toucher();
    l();
  });
  un("#sd-pers", zone).addEventListener("input", (s) => {
    a = +s.target.value;
    options.toucher();
    l();
  });
  tous("[data-r]", zone).forEach((s) =>
    s.addEventListener("click", () => {
      c = s.dataset.r;
      tous("[data-r]", zone).forEach((r) => r.setAttribute("aria-pressed", r === s));
      options.toucher();
      l();
    }),
  );
  un("#sd-sale", zone).addEventListener("change", (s) => {
    o = s.target.checked;
    options.toucher();
    l();
  });
  l();
  return () => d?.detruire();
}
