/**
 * Démo « profils » (niveaux Comprendre / Approfondir).
 */
import { graphique } from "../blocs/graphique.js";
import { icone } from "../blocs/icones.js";
import { nombre, texteRiche, tous, un } from "../blocs/outils.js";
import { LIBELLES_TYPE_JOUR, MOIS, MOIS_COURTS } from "../modele/calendrier.js";
import { agreger, anneeCivile, anneeDeReference, kwhElecDuJour } from "../modele/simulation.js";

const JOURS_COURTS = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

export function demoProfils(zone, options) {
  let t = "jour";
  const a = anneeCivile(anneeDeReference());
  let c = null;
  zone.innerHTML = `<div class="segmented" role="group" aria-label="Profil"><button type="button" data-v="jour" aria-pressed="true">Journée type</button><button type="button" data-v="semaine" aria-pressed="false">Semaine type</button><button type="button" data-v="saison" aria-pressed="false">Saisons</button></div>
    <div id="pr-g"></div><p id="pr-msg" class="feedback info" aria-live="polite"></p>`;
  const o = (u) => {
    const l = new Array(24).fill(0);
    u.forEach((s) =>
      agreger(s.elec, 6).forEach((r, i) => {
        l[i] += r;
      }),
    );
    return l.map((s) => s / Math.max(1, u.length));
  };
  function d() {
    let u;
    let l;
    if (t === "jour") {
      const s = ["classe", "mercredi", "vacances", "weekend"];
      const r = {
        classe: "var(--energie)",
        mercredi: "color-mix(in srgb, var(--energie) 55%, var(--surface))",
        vacances: "var(--data)",
        weekend: "var(--muted)",
      };
      u = {
        hauteur: 240,
        description: "Puissance moyenne heure par heure selon le type de journée",
        x: {
          n: 24,
          ticks: [0, 6, 12, 18, 23].map((i) => ({
            i,
            texte: `${i} h`,
          })),
          label: (i) => `${i} h – ${i + 1} h`,
        },
        y: {
          unite: "kW",
          max: 50,
        },
        series: s.map((i) => ({
          nom: LIBELLES_TYPE_JOUR[i],
          couleur: r[i],
          valeurs: o(a.filter((p) => p.type === i)),
          tirets: i === "weekend",
        })),
      };
      l =
        "Un jour de classe monte vers 8 h, culmine au déjeuner (cuisine) et redescend après 17 h. Un jour de vacances reste plat, au niveau du talon, comme un week-end.";
    } else if (t === "semaine") {
      const s = a.filter((p) => p.iso >= "2026-01-05" && p.iso < "2026-02-21");
      const r = new Array(168).fill(0);
      const i = new Array(168).fill(0);
      s.forEach((p) => {
        const m = (p.dow + 6) % 7;
        agreger(p.elec, 6).forEach((f, h) => {
          r[m * 24 + h] += f;
          i[m * 24 + h]++;
        });
      });
      u = {
        hauteur: 240,
        description: "Semaine type de janvier-février : puissance moyenne heure par heure",
        x: {
          n: 168,
          ticks: JOURS_COURTS.map((p, m) => ({
            i: m * 24 + 12,
            texte: p,
          })),
          label: (p) => `${JOURS_COURTS[Math.floor(p / 24)]} ${p % 24} h`,
        },
        y: {
          unite: "kW",
          max: 50,
        },
        zones: [
          {
            i0: 120,
            i1: 167,
            texte: "week-end",
          },
        ],
        series: [
          {
            nom: "Semaine type (janvier-février, hors vacances)",
            type: "aire",
            couleur: "var(--energie)",
            valeurs: r.map((p, m) => p / Math.max(1, i[m])),
          },
        ],
      };
      l =
        "Quatre jours pleins, un mercredi matin, puis un week-end au talon. Les nuits aussi restent au talon : c’est là que se cachent souvent les gaspillages.";
    } else {
      const s = [];
      for (const r of a) {
        const i = r.iso.slice(0, 7);
        let p = s.find((m) => m.k === i);
        if (!p) {
          p = {
            k: i,
            e: 0,
            g: 0,
          };
          s.push(p);
        }
        p.e += kwhElecDuJour(r);
        p.g += r.gazKwh;
      }
      u = {
        hauteur: 240,
        description: "Consommation mensuelle d’électricité et de gaz",
        marge: {
          g: 52,
        },
        x: {
          n: 12,
          ticks: s.map((r, i) => ({
            i,
            texte: MOIS_COURTS[+r.k.slice(5) - 1],
          })),
          label: (r) => MOIS[+s[r].k.slice(5) - 1],
          espace: 26,
        },
        y: {
          unite: "kWh",
          format: (r) => `${nombre(r)} kWh`,
        },
        series: [
          {
            nom: "Électricité",
            type: "barres",
            couleur: "var(--data)",
            valeurs: s.map((r) => r.e),
          },
          {
            nom: "Gaz",
            type: "barres",
            couleur: "var(--energie)",
            valeurs: s.map((r) => r.g),
          },
        ],
      };
      l =
        "Le gaz suit l’hiver (chauffage de mi-octobre à fin avril). L’électricité suit le calendrier scolaire : elle s’effondre en août, école fermée.";
    }
    if (c) {
      c.maj(u);
    } else {
      c = graphique(un("#pr-g", zone), u);
    }
    un("#pr-msg", zone).innerHTML = `${icone("info")}<span>${texteRiche(l)}</span>`;
  }
  tous("[data-v]", zone).forEach((u) =>
    u.addEventListener("click", () => {
      t = u.dataset.v;
      tous("[data-v]", zone).forEach((l) => l.setAttribute("aria-pressed", l === u));
      c?.detruire();
      c = null;
      options.toucher();
      d();
    }),
  );
  d();
  return () => c?.detruire();
}
