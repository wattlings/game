/**
 * Démo « agregationSite » (niveaux Comprendre / Approfondir).
 */
import { graphique } from "../blocs/graphique.js";
import { icone } from "../blocs/icones.js";
import { interrupteur, nombre, pourcent, texteRiche, tous, un } from "../blocs/outils.js";
import { MOIS, MOIS_COURTS } from "../modele/calendrier.js";
import { anneeCivile, anneeDeReference, kwhElecDuJour } from "../modele/simulation.js";

let kwhCuisineParJour = 0;

for (let e = 0; e < 144; e++) {
  const n = e / 6;
  if (n >= 10.5 && n < 13.5) {
    kwhCuisineParJour += (Math.exp(-(((n - 11.9) / 0.7) ** 2)) * 13) / 6;
  }
}

const COMPTEURS_DU_SITE = {
  elec: {
    nom: "Compteur électrique principal (PDL)",
    aide: "kWh",
    defaut: true,
  },
  gaz: {
    nom: "Compteur gaz (PCE), converti en kWh",
    aide: "m³ × coefficient",
    defaut: true,
  },
  cuisine: {
    nom: "Sous-compteur électrique de la cuisine",
    aide: "déjà inclus dans le principal",
    defaut: false,
  },
  gazM3: {
    nom: "Compteur gaz en m³ (non converti)",
    aide: "unité brute",
    defaut: false,
  },
};

export function demoAgregationSite(zone, options) {
  const t = new Set(Object.keys(COMPTEURS_DU_SITE).filter((l) => COMPTEURS_DU_SITE[l].defaut));
  const a = anneeDeReference();
  const c = anneeCivile(a);
  const o = [];
  for (const l of c) {
    const s = l.iso.slice(0, 7);
    let r = o.find((i) => i.k === s);
    if (!r) {
      r = {
        k: s,
        elec: 0,
        gaz: 0,
        cuisine: 0,
        gazM3: 0,
      };
      o.push(r);
    }
    r.elec += kwhElecDuJour(l);
    r.gaz += l.gazKwh;
    r.gazM3 += l.gazM3;
    if (l.type === "classe") {
      r.cuisine += kwhCuisineParJour;
    }
  }
  let d = null;
  zone.innerHTML = `<div class="switch-list" role="group" aria-label="Compteurs à additionner pour le site">${Object.entries(COMPTEURS_DU_SITE)
    .map(([l, s]) => interrupteur(`ag-${l}`, s.nom, s.aide, t.has(l)))
    .join("")}</div>
    <div id="ag-g"></div><div class="kpis" id="ag-kpis"></div><div id="ag-msg" aria-live="polite"></div>`;
  function u() {
    const l = o.reduce((h, x) => h + x.elec + x.gaz, 0);
    const s = o.map((h) => [...t].reduce((x, v) => x + h[v], 0));
    const r = s.reduce((h, x) => h + x, 0);
    const i = [...t].map((h) => ({
      nom: COMPTEURS_DU_SITE[h].nom.split(" (")[0],
      type: "barres",
      couleur: {
        elec: "var(--data)",
        gaz: "var(--energie)",
        cuisine: "color-mix(in srgb, var(--data) 45%, var(--surface))",
        gazM3: "color-mix(in srgb, var(--energie) 45%, var(--surface))",
      }[h],
      valeurs: o.map((x) => x[h]),
      format: (x) => `${nombre(x)} ${h === "gazM3" ? "m³" : "kWh"}`,
    }));
    i.push({
      nom: "Total calculé du site",
      couleur: "var(--ink)",
      valeurs: s,
      format: (h) => `${nombre(h)} « kWh »`,
    });
    const p = {
      hauteur: 230,
      description: "Consommation mensuelle par compteur et total du site",
      marge: {
        g: 52,
      },
      x: {
        n: o.length,
        ticks: o.map((h, x) => ({
          i: x,
          texte: MOIS_COURTS[+h.k.slice(5) - 1],
        })),
        label: (h) => `${MOIS[+o[h].k.slice(5) - 1]} ${o[h].k.slice(0, 4)}`,
        espace: 26,
      },
      y: {
        unite: "kWh",
        format: (h) => `${nombre(h)} kWh`,
      },
      series: i,
    };
    if (d) {
      d.maj(p);
    } else {
      d = graphique(un("#ag-g", zone), p);
    }
    const m = r / l - 1;
    un("#ag-kpis", zone).innerHTML =
      `<div class="kpi ${Math.abs(m) > 0.005 ? "bad" : "ok"}"><span class="v">${nombre(r / 1000, 1)} MWh</span><span class="l">total calculé du site</span></div>
      <div class="kpi"><span class="v">${nombre(l / 1000, 1)} MWh</span><span class="l">consommation réelle du site (élec + gaz)</span></div>
      <div class="kpi ${Math.abs(m) > 0.005 ? "bad" : "ok"}"><span class="v">${m >= 0 ? "+" : "−"}${pourcent(Math.abs(m), 1)}</span><span class="l">écart</span></div>`;
    const f = [];
    if (t.has("cuisine")) {
      f.push(
        `Le sous-compteur de la cuisine (${nombre(o.reduce((h, x) => h + x.cuisine, 0))} kWh/an) est compté deux fois : il est déjà dans le compteur principal.`,
      );
    }
    if (t.has("gazM3")) {
      f.push("Des m³ sont additionnés à des kWh : le total n’a plus de sens physique.");
    }
    if (t.has("gazM3") && t.has("gaz")) {
      f.push("Et le gaz est compté deux fois (en m³ et en kWh).");
    }
    if (!t.has("elec") || (!t.has("gaz") && !t.has("gazM3"))) {
      f.push("Il manque une énergie : le site est sous-estimé.");
    }
    un("#ag-msg", zone).innerHTML = f.length
      ? `<div class="feedback bad">${icone("alerte")}<div>${f.map((h) => texteRiche(h)).join(" ")}</div></div>`
      : `<div class="feedback ok">${icone("ok")}<div>${texteRiche("Bonne agrégation : le compteur principal d’électricité et le gaz converti en kWh. Le sous-compteur sert à analyser la cuisine, pas à calculer le total du site.")}</div></div>`;
  }
  tous('input[type="checkbox"]', zone).forEach((l) =>
    l.addEventListener("change", () => {
      const s = l.id.slice(3);
      if (l.checked) {
        t.add(s);
      } else {
        t.delete(s);
      }
      options.toucher();
      u();
    }),
  );
  u();
  return () => d?.detruire();
}
