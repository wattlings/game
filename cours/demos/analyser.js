/**
 * Démo de l'étape 5 : lire une semaine de courbe de charge.
 */
import { graphique } from "../blocs/graphique.js";
import { icone } from "../blocs/icones.js";
import { euros, nombre, pourcent, texteRiche, un } from "../blocs/outils.js";
import {
  DEBUT_SIMULATION,
  LIBELLES_TYPE_JOUR,
  ajouterJours,
  dateCourte,
  nomDuJour,
} from "../modele/calendrier.js";
import { factures } from "../modele/factures.js";
import { anneeCivile, anneeDeReference, totalElec } from "../modele/simulation.js";

function quantile(valeurs, q) {
  const t = [...valeurs].sort((a, c) => a - c);
  return t[Math.floor(q * (t.length - 1))];
}

export function demoAnalyser(zone, options) {
  const t = anneeDeReference();
  const a = anneeCivile(t);
  const c = totalElec(a);
  const o = factures(t);
  const d = o.elec.reduce((p, m) => p + m.ht, 0) / o.elec.reduce((p, m) => p + m.total, 0);
  let u = 19;
  let l = 15;
  let s = false;
  let r = null;
  zone.innerHTML = `
    <div class="grid-2">
      <div class="field"><label for="a-sem">Semaine : <span id="a-sem-txt"></span></label><input type="range" id="a-sem" min="0" max="51" value="${u}"></div>
      <div class="field"><label for="a-est">Ton estimation du talon : <span id="a-est-txt" class="num"></span></label><input type="range" id="a-est" min="0" max="25" step="0.5" value="${l}"></div>
    </div>
    <div id="a-graph"></div>
    <div class="row"><button type="button" class="btn energie" id="a-verif">Vérifier mon estimation</button><span class="muted" style="font-size:var(--t-s)">Astuce : regarde les nuits et le week-end.</span></div>
    <div id="a-res" aria-live="polite"></div>`;
  function i() {
    const p = ajouterJours(DEBUT_SIMULATION, u * 7);
    const m = t.jours.findIndex((q) => q.iso === p);
    const f = t.jours.slice(m, m + 7);
    const h = f.flatMap((q) => [...q.elec]);
    const x = f.flatMap((q) =>
      q.type === "classe" || q.type === "mercredi" ? [...q.elec].slice(0, 36) : [...q.elec],
    );
    const v = quantile(x, 0.1);
    const j = h.reduce((q, y) => q + y, 0) / 6;
    const w = v * 168;
    un("#a-sem-txt", zone).textContent =
      `du ${dateCourte(p)} au ${dateCourte(ajouterJours(p, 6))}${f[0].vacances ? ` (vacances de ${f[0].vacances})` : ""}`;
    un("#a-est-txt", zone).textContent = `${nombre(l, 1)} kW`;
    const $ = [];
    f.forEach((q, y) => {
      if (q.type !== "classe" && q.type !== "mercredi") {
        $.push({
          i0: y * 144,
          i1: y * 144 + 143,
          texte:
            y === 0 || f[y - 1].type === "classe" || f[y - 1].type === "mercredi"
              ? LIBELLES_TYPE_JOUR[q.type].toLowerCase()
              : "",
        });
      }
    });
    const T = {
      hauteur: 240,
      description: "Courbe de charge de la semaine avec le niveau du talon",
      x: {
        n: h.length,
        ticks: f.map((q, y) => ({
          i: y * 144 + 72,
          texte: nomDuJour(q.iso).slice(0, 3),
        })),
        label: (q) =>
          `${nomDuJour(f[Math.floor(q / 144)].iso)}, ${String(Math.floor((q % 144) / 6)).padStart(2, "0")}:${String((q % 6) * 10).padStart(2, "0")}`,
      },
      y: {
        unite: "kW",
        max: 60,
      },
      zones: $,
      series: [
        {
          nom: "Puissance électrique",
          type: "aire",
          couleur: "var(--energie)",
          valeurs: h,
          epaisseur: 1.5,
        },
      ],
      lignesH: [
        {
          y: l,
          texte: `ton estimation : ${nombre(l, 1)} kW`,
          couleur: "var(--ink)",
        },
        ...(s
          ? [
              {
                y: v,
                texte: `talon calculé : ${nombre(v, 1)} kW`,
                couleur: "var(--data)",
                couleurTexte: "var(--data-ink)",
                tirets: false,
                epaisseur: 2.5,
              },
            ]
          : []),
      ],
    };
    if (r) {
      r.maj(T);
    } else {
      r = graphique(un("#a-graph", zone), T);
    }
    if (s) {
      const q = Math.abs(l - v);
      const y = v * 24 * 365;
      un("#a-res", zone).innerHTML = `
        <div class="feedback ${q <= 1.5 ? "ok" : "info"}">${icone(q <= 1.5 ? "ok" : "info")}<div><b>${q <= 1.5 ? "Bien vu !" : `Écart de ${nombre(q, 1)} kW.`}</b> ${texteRiche(`Le {{talon}} de cette semaine est d’environ **${nombre(v, 1)} kW** : la puissance appelée quand personne n’est là (serveurs, frigos, ventilation réduite, veilles).`)}</div></div>
        <div class="kpis">
          <div class="kpi energie"><span class="v">${nombre(v, 1)} kW</span><span class="l">talon (10 % des mesures « bâtiment vide » les plus basses)</span></div>
          <div class="kpi"><span class="v">${pourcent(w / j)}</span><span class="l">de l’énergie de la semaine part dans le talon</span></div>
          <div class="kpi"><span class="v">${pourcent(y / c)}</span><span class="l">sur l’année (${nombre(y / 1000)} MWh sur ${nombre(c / 1000)})</span></div>
          <div class="kpi"><span class="v">${euros(y * d)}</span><span class="l">par an HT, juste pour le bâtiment vide (fictif)</span></div>
        </div>
        <p class="note">${icone("info")}<span>Une école est vide plus de 80 % des heures de l’année (nuits, week-ends, vacances). C’est pourquoi un talon de quelques kW pèse autant : chaque kW de talon coûte ${nombre(8760)} kWh par an.</span></p>`;
    } else {
      un("#a-res", zone).innerHTML = "";
    }
  }
  un("#a-sem", zone).addEventListener("input", (p) => {
    u = +p.target.value;
    options.toucher();
    i();
  });
  un("#a-est", zone).addEventListener("input", (p) => {
    l = +p.target.value;
    options.toucher();
    i();
  });
  un("#a-verif", zone).addEventListener("click", () => {
    s = true;
    options.toucher();
    i();
  });
  i();
  return () => r?.detruire();
}
