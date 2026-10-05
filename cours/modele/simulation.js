/**
 * La simulation de l'école : une année de consommation d'électricité et de gaz, pas de 10 minutes.
 */
import { ECOLE } from "../../commun/donnees/ecole.js";
import { magasin } from "../coquille/etat.js";
import { generateurAleatoire } from "./aleatoire.js";
import {
  DEBUT_SIMULATION,
  JOURS_PAR_AN,
  JOURS_SIMULES,
  ajouterJours,
  jourDeSemaine,
  typeDeJour,
  vacancesDu,
} from "./calendrier.js";

export const PAS_PAR_JOUR = 144;

const SCENARIO_DEFAUT = {
  graine: 2025,
  mercrediMatin: true,
  derives: {
    talonNocturne: false,
    chauffageWeekend: false,
    chauffageEte: false,
    depassement: false,
  },
};

const DEBUT_TALON_ANORMAL = "2026-01-12";

const DEBUT_CHAUFFE = "2025-10-13";

const FIN_CHAUFFE = "2026-04-30";

function temperaturesExterieures(alea, nbJours) {
  const t = [];
  let a = 0;
  for (let c = 0; c < nbJours; c++) {
    const o = ajouterJours(DEBUT_SIMULATION, c);
    const d = new Date(o + "T12:00:00Z");
    const u = (d - new Date(Date.UTC(d.getUTCFullYear(), 0, 1))) / 86400000;
    const l = 12.2 - Math.cos((Math.PI * 2 * (u - 20)) / 365) * 7.9;
    a = a * 0.75 + alea.normal(0, 2.1);
    t.push(Math.round((l + a) * 10) / 10);
  }
  return t;
}

function puissanceElec(e, n, t, a, c) {
  const o = e / 6;
  let d = 5.8 + a.normal(0, 0.35);
  const u = (l, s) => o >= l && o < s;
  if (n === "classe" || n === "mercredi") {
    const l = n === "mercredi" ? 12.5 : 18.5;
    if (u(7, l - 0.5)) {
      d += 4;
    }
    if (u(8, l - 1)) {
      d += t * 15;
    }
    if (u(8.5, n === "mercredi" ? 12 : 16.5)) {
      d += 9;
    }
    if (n === "classe" && u(10.5, 13.5)) {
      d += Math.exp(-(((o - 11.9) / 0.7) ** 2)) * 13;
    }
    if (n === "classe" && u(16.5, 18.5)) {
      d += 3;
    }
    d *= 1 + a.normal(0, 0.05);
  } else if (n === "vacances" && u(8, 12) && a() < 0.3) {
    d += 2.5;
  }
  if (c.talon && (n !== "classe" || !u(7, 18))) {
    d += 3;
  }
  if (c.appoint && u(8, 16.5)) {
    d += 16;
  }
  return Math.max(0.5, Math.round(d * 100) / 100);
}

/** Fabrique l'année de l'école : pour chaque jour, sa température, sa courbe électrique (144 points) et son gaz.
 * Le scénario peut activer des dérives (talon nocturne, chauffage le week-end ou l'été, dépassement). */
export function simulerAnnee(scenario = {}) {
  const n = {
    ...SCENARIO_DEFAUT,
    ...scenario,
    derives: {
      ...SCENARIO_DEFAUT.derives,
      ...(scenario.derives || {}),
    },
  };
  const t = generateurAleatoire(n.graine);
  const a = temperaturesExterieures(t, JOURS_SIMULES);
  const c = new Set();
  if (n.derives.depassement) {
    a.map((u, l) => ({
      t: u,
      i: l,
      iso: ajouterJours(DEBUT_SIMULATION, l),
    }))
      .filter((u) => u.iso >= "2026-01-05" && u.iso < "2026-02-21" && typeDeJour(u.iso, n) === "classe")
      .sort((u, l) => u.t - l.t)
      .slice(0, 6)
      .forEach((u) => c.add(u.i));
  }
  const o = [];
  let d = 11.25;
  for (let u = 0; u < JOURS_SIMULES; u++) {
    const l = ajouterJours(DEBUT_SIMULATION, u);
    const s = typeDeJour(l, n);
    const r = new Date(l + "T12:00:00Z");
    const i = (r - new Date(Date.UTC(r.getUTCFullYear(), 0, 1))) / 86400000;
    const p = 0.6 + Math.cos((Math.PI * 2 * (i + 10)) / 365) * 0.4;
    const m = {
      talon: n.derives.talonNocturne && l >= DEBUT_TALON_ANORMAL,
      appoint: c.has(u),
    };
    const f = new Float32Array(PAS_PAR_JOUR);
    for (let L = 0; L < PAS_PAR_JOUR; L++) {
      f[L] = puissanceElec(L, s, p, t, m);
    }
    const h = a[u];
    const x = Math.max(0, Math.round((18 - h) * 10) / 10);
    const v = l >= DEBUT_CHAUFFE && l <= FIN_CHAUFFE;
    const j = l >= "2026-06-01" && l <= "2026-08-31";
    const w = {
      classe: 1,
      mercredi: 0.85,
      weekend: 0.45,
      vacances: 0.4,
      ferie: 0.45,
    }[s];
    const $ = n.derives.chauffageWeekend && (s === "weekend" || s === "ferie") ? 1 : w;
    let T = v ? x * 132 * $ : 0;
    if (n.derives.chauffageEte && j) {
      T += 160 + Math.max(0, 22 - h) * 25;
    }
    const q =
      {
        classe: 75,
        mercredi: 20,
      }[s] || 4;
    const y = Math.max(0, Math.round((T + q) * (1 + t.normal(0, 0.06))));
    if (r.getUTCDate() === 1) {
      d = Math.round((11.1 + t() * 0.35) * 100) / 100;
    }
    const k = Math.round((y / d) * 10) / 10;
    o.push({
      i: u,
      iso: l,
      dow: jourDeSemaine(l),
      type: s,
      vacances: vacancesDu(l)?.nom || null,
      tMoy: h,
      dju: x,
      elec: f,
      gazKwh: y,
      gazM3: k,
      coef: d,
      chauffe: v || (n.derives.chauffageEte && j),
    });
  }
  return {
    ecole: ECOLE,
    options: n,
    jours: o,
  };
}

/** Électricité consommée dans la journée (kWh). */
export const kwhElecDuJour = (jour) => jour.elec.reduce((n, t) => n + t, 0) / 6;

/** Ce que consomme chaque usage sur l'année (talon, éclairage, chauffage…) : une estimation, comme dans la vraie vie. */
export function repartitionUsages(annee, nbJours = 365) {
  const t = {
    talon: 0,
    ventilation: 0,
    eclairage: 0,
    informatique: 0,
    cuisine: 0,
    periscolaire: 0,
  };
  const a = {
    chauffage: 0,
    cuisine: 0,
  };
  for (const c of annee.jours.slice(0, nbJours)) {
    const o = new Date(c.iso + "T12:00:00Z");
    const d = (o - new Date(Date.UTC(o.getUTCFullYear(), 0, 1))) / 86400000;
    const u = 0.6 + Math.cos((Math.PI * 2 * (d + 10)) / 365) * 0.4;
    for (let s = 0; s < PAS_PAR_JOUR; s++) {
      const r = s / 6;
      const i = (p, m) => r >= p && r < m;
      t.talon += 5.8 / 6;
      if (c.type === "classe" || c.type === "mercredi") {
        const p = c.type === "mercredi" ? 12.5 : 18.5;
        if (i(7, p - 0.5)) {
          t.ventilation += 4 / 6;
        }
        if (i(8, p - 1)) {
          t.eclairage += (u * 15) / 6;
        }
        if (i(8.5, c.type === "mercredi" ? 12 : 16.5)) {
          t.informatique += 9 / 6;
        }
        if (c.type === "classe" && i(10.5, 13.5)) {
          t.cuisine += (Math.exp(-(((r - 11.9) / 0.7) ** 2)) * 13) / 6;
        }
        if (c.type === "classe" && i(16.5, 18.5)) {
          t.periscolaire += 3 / 6;
        }
      }
    }
    const l =
      {
        classe: 75,
        mercredi: 20,
      }[c.type] || 4;
    a.cuisine += Math.min(l, c.gazKwh);
    a.chauffage += Math.max(0, c.gazKwh - l);
  }
  return {
    elec: t,
    gaz: a,
  };
}

const cacheSimulations = new Map();

/** L'année simulée pour un jeu de dérives donné (calculée une fois, puis gardée en mémoire). */
function simulation(derives) {
  const n = Object.fromEntries(
    Object.entries(derives)
      .filter(([, a]) => a)
      .sort(),
  );
  const t = JSON.stringify(n);
  if (!cacheSimulations.has(t)) {
    cacheSimulations.set(
      t,
      simulerAnnee({
        derives: n,
      }),
    );
  }
  return cacheSimulations.get(t);
}

/** L'année sans aucune dérive : la référence de toutes les démos. */
export const anneeDeReference = () => simulation({});

/** L'année avec les dérives activées par le lecteur sur la page École. */
export const anneeAvecDerives = () => simulation(magasin.get().derives || {});

/** Les défauts de données activés par le lecteur sur la page École. */
export const anomaliesActives = () => magasin.get().anomalies || {};

/** Regroupe des valeurs par paquets de `taille` (moyenne) : 10 min → 30 min, 1 h… */
export function agreger(valeurs, taille) {
  const t = [];
  for (let a = 0; a < valeurs.length; a += taille) {
    let c = 0;
    let o = 0;
    for (let d = a; d < Math.min(a + taille, valeurs.length); d++) {
      c += valeurs[d];
      o++;
    }
    t.push(c / o);
  }
  return t;
}

/** Les 365 premiers jours de la simulation. */
export const anneeCivile = (annee) => annee.jours.slice(0, JOURS_PAR_AN);

/** Total d'électricité (kWh) d'une liste de jours. */
export const totalElec = (jours) => jours.reduce((n, t) => n + kwhElecDuJour(t), 0);

/** Total de gaz (kWh) d'une liste de jours. */
export const totalGaz = (jours) => jours.reduce((n, t) => n + t.gazKwh, 0);
