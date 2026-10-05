/**
 * Le patrimoine d'Ampère-sur-Loire (fictif) : 20 bâtiments municipaux, et les calculs pour les comparer.
 * Utilisé par la page « Piloter un patrimoine » du cours et par le chapitre 10 du jeu.
 */
import { fmt } from "../texte.js";
import { ECOLE } from "./ecole.js";
import { FACTEURS_CO2, PRIX_KWH_ELEC, PRIX_KWH_GAZ } from "./references.js";

/** Les activités du patrimoine et leur référence nationale (kWh/m²/an). */
export const ACT = {
  ens: { lab: "Enseignement", ref: 155 },
  pe: { lab: "Petite enfance", ref: 160 },
  sport: { lab: "Sport (hors piscine)", ref: 148 },
  pisc: { lab: "Piscine", ref: 3249, unit: "kWh/m² de bassin" },
  adm: { lab: "Administratif", ref: 156 },
  cult: { lab: "Culture et vie sociale", ref: 143 },
  ehpad: { lab: "Résidence seniors", ref: 250 },
};
/** Les 20 sites : [nom, activité, surface m², électricité MWh/an, gaz MWh/an, surface de bassin]. */
export const PSITES = [
  [ECOLE.nom, "ens", ECOLE.surface, 86, 208],
  ["École Pasteur", "ens", 2400, 95, 470],
  ["Maternelle Les Tilleuls", "ens", 900, 38, 110],
  ["Groupe scolaire Victor-Hugo", "ens", 3200, 120, 330],
  ["École Marie-Curie", "ens", 1800, 68, 190],
  ["Crèche Les Lucioles", "pe", 600, 32, 62],
  ["Crèche Pom’Pouce", "pe", 450, 28, 88],
  ["Gymnase Coubertin", "sport", 1800, 62, 200],
  ["Gymnase des Sablons", "sport", 1500, 48, 330],
  ["Dojo municipal", "sport", 700, 25, 72],
  ["Piscine Aqualoire", "pisc", 3000, 700, 1150, 500],
  ["Hôtel de ville", "adm", 2500, 190, 215],
  ["Annexe Le Carré", "adm", 1500, 165, 120],
  ["Centre technique municipal", "adm", 1200, 58, 130],
  ["Médiathèque", "cult", 1400, 95, 110],
  ["Salle des fêtes", "cult", 1000, 26, 180],
  ["École de musique", "cult", 500, 20, 50],
  ["Centre social", "cult", 800, 38, 80],
  ["Maison des associations", "cult", 600, 22, 60],
  ["Résidence Les Glycines", "ehpad", 4200, 330, 720],
].map(([n, a, surf, e, g, bassin], i) => ({ i, n, a, surf, e, g, bassin }));
/** Prix moyens en €/MWh et émissions en tCO2e/MWh : tirés des références du cours. */
export const PX = { e: Math.round(PRIX_KWH_ELEC * 1000), g: Math.round(PRIX_KWH_GAZ * 10000) / 10 },
  CX = { e: FACTEURS_CO2.elec, g: Math.round(FACTEURS_CO2.gaz * 1000) / 1000 };
/** Les trois indicateurs de classement : consommation, coût, émissions. */
export const IND = {
  mwh: { lab: "Consommation", u: "MWh", f: (v) => fmt(Math.round(v)) + " MWh" },
  eur: { lab: "Coût", u: "€ HT", f: (v) => fmt(Math.round(v / 100) * 100) + " €" },
  co2: { lab: "Émissions", u: "tCO₂e", f: (v) => fmt(Math.round(v)) + " t" },
};
export const parts = (s, ind) =>
  ind === "mwh" ? [s.e, s.g] : ind === "eur" ? [s.e * PX.e, s.g * PX.g] : [s.e * CX.e, s.g * CX.g];
export const tot = (s, ind) => {
  const p = parts(s, ind);
  return p[0] + p[1];
};
/** kWh par m² (par m² de bassin pour une piscine). */
export const ratio = (s) => ((s.e + s.g) * 1000) / (s.bassin || s.surf);
export const refOf = (s) => ACT[s.a].ref;
/** Écart du ratio à la référence nationale de l'activité (0,2 = +20 %). */
export const ecart = (s) => ratio(s) / refOf(s) - 1;
/** Gisement : les MWh/an gagnés si le site revenait à la référence. */
export const gis = (s) => (Math.max(0, ratio(s) - refOf(s)) * (s.bassin || s.surf)) / 1000;
export const median = (a) => {
  const v = a.slice().sort((x, y) => x - y),
    m = v.length >> 1;
  return v.length % 2 ? v[m] : (v[m - 1] + v[m]) / 2;
};
export const medAct = (a) => median(PSITES.filter((s) => s.a === a).map(ratio));
/** Classement des sites du plus gros au plus petit, avec part et cumul. */
export function pareto(ind, list) {
  list = (list || PSITES).map((s) => ({ s, v: tot(s, ind), p: parts(s, ind) })).sort((x, y) => y.v - x.v);
  const T = list.reduce((a, r) => a + r.v, 0);
  let c = 0;
  list.forEach((r) => {
    c += r.v;
    r.share = r.v / T;
    r.cum = c / T;
  });
  return { list, T, n80: list.findIndex((r) => r.cum >= 0.8) + 1 };
}
export const rankOf = (ind) => {
  const m = {};
  pareto(ind).list.forEach((r, k) => (m[r.s.n] = k + 1));
  return m;
};
/** Le même classement, regroupé par activité. */
export function byActivity(ind) {
  const rows = Object.keys(ACT)
    .map((a) => {
      const ss = PSITES.filter((s) => s.a === a);
      const p = [0, 0];
      ss.forEach((s) => {
        const q = parts(s, ind);
        p[0] += q[0];
        p[1] += q[1];
      });
      return { a, lab: ACT[a].lab, n: ss.length, p, v: p[0] + p[1] };
    })
    .sort((x, y) => y.v - x.v);
  const T = rows.reduce((a, r) => a + r.v, 0);
  let c = 0;
  rows.forEach((r) => {
    c += r.v;
    r.share = r.v / T;
    r.cum = c / T;
  });
  return { rows, T };
}
export const pct = (v) => Math.round(v * 100) + " %";
export const sgn = (v) => (v >= 0 ? "+" : "−") + Math.abs(Math.round(v * 100)) + " %";
