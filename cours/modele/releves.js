/**
 * Ce que les compteurs transmettent : courbe de charge, index, relevés de gaz, avec leurs défauts possibles.
 */
import { CHANGEMENTS_HEURE } from "./calendrier.js";
import { PAS_PAR_JOUR } from "./simulation.js";

export const ANOMALIES = {
  trous: {
    libelle: "Trous de données",
    aide: "Le compteur n’a rien transmis pendant quelques heures.",
  },
  doublons: {
    libelle: "Doublons",
    aide: "Une heure de mesures est envoyée deux fois.",
  },
  aberrantes: {
    libelle: "Valeurs aberrantes",
    aide: "Un pic impossible (999,9 kW) et une valeur nulle en pleine journée.",
  },
  changementHeure: {
    libelle: "Changement d'heure",
    aide: "Les journées de 23 h et 25 h apparaissent en heure locale.",
  },
  indexRecule: {
    libelle: "Index qui recule",
    aide: "Une erreur de saisie : un index plus petit que le précédent.",
  },
  indexEstime: {
    libelle: "Index estimé",
    aide: "Un relevé gaz estimé, rectifié au relevé suivant.",
  },
  changementCompteur: {
    libelle: "Changement de compteur",
    aide: "Le compteur gaz est remplacé le 15 janvier.",
  },
  bouclage: {
    libelle: "Bouclage du compteur",
    aide: "Le compteur gaz dépasse 99 999 m³ et repart à zéro.",
  },
};

export const DERIVES = {
  talonNocturne: {
    libelle: "Talon nocturne anormal",
    aide: "+3 kW la nuit et le week-end à partir du 12 janvier.",
  },
  chauffageWeekend: {
    libelle: "Chauffage le week-end",
    aide: "La chaudière reste en régime « occupé » le week-end.",
  },
  chauffageEte: {
    libelle: "Chauffage en été",
    aide: "La chaudière n’est jamais coupée de juin à août.",
  },
  depassement: {
    libelle: "Dépassement de puissance",
    aide: "Des radiateurs électriques d’appoint pendant les grands froids.",
  },
};

const deuxChiffres = (e) => String(e).padStart(2, "0");

export const heureDuPas = (pas) => `${deuxChiffres(Math.floor(pas / 6))}:${deuxChiffres((pas % 6) * 10)}`;

export function posteHoraire(iso, pas, jourSemaine) {
  const a = +iso.slice(5, 7);
  const c = a >= 11 || a <= 3;
  const o = pas / 6;
  return (jourSemaine !== 0 && o >= 6 && o < 22 ? "HP" : "HC") + (c ? "H" : "B");
}

export const POSTES_HORAIRES = ["HPH", "HCH", "HPB", "HCB"];

export const LIBELLES_POSTES = {
  HPH: "Heures pleines, saison haute",
  HCH: "Heures creuses, saison haute",
  HPB: "Heures pleines, saison basse",
  HCB: "Heures creuses, saison basse",
};

export function courbeDeCharge(annee, debut, nbJours, defauts = {}) {
  const c = [];
  const o = annee.jours.findIndex((d) => d.iso === debut);
  for (let d = 0; d < nbJours; d++) {
    const u = annee.jours[o + d];
    if (!u) {
      break;
    }
    const l = defauts.changementHeure ? CHANGEMENTS_HEURE[u.iso] : null;
    for (let s = 0; s < PAS_PAR_JOUR; s++) {
      let r = u.elec[s];
      const i = heureDuPas(s);
      if (
        (l?.type !== "ete" || !(s >= 12) || !(s < 18)) &&
        (!defauts.trous || ((u.iso !== "2025-11-18" || !(s >= 54) || !(s < 84)) && u.iso !== "2026-02-03"))
      ) {
        if (defauts.aberrantes && u.iso === "2026-01-20" && s === 87) {
          r = 999.9;
        }
        if (defauts.aberrantes && u.iso === "2026-05-12" && s === 63) {
          r = 0;
        }
        c.push({
          iso: u.iso,
          slot: s,
          heure: i,
          kw: r,
          statut: "brute",
        });
        if (l?.type === "hiver" && s === 17) {
          for (let p = 12; p < 18; p++) {
            c.push({
              iso: u.iso,
              slot: p,
              heure: heureDuPas(p),
              kw: Math.round(u.elec[p] * 98) / 100,
              statut: "brute",
              repetee: true,
            });
          }
        }
        if (defauts.doublons && u.iso === "2025-12-02" && s >= 60 && s < 66) {
          c.push({
            iso: u.iso,
            slot: s,
            heure: i,
            kw: r,
            statut: "brute",
            doublon: true,
          });
        }
      }
    }
  }
  return c;
}

export const relevesGaz = (annee, debut, nbJours) => {
  const a = annee.jours.findIndex((c) => c.iso === debut);
  return annee.jours.slice(a, a + nbJours).map((c) => ({
    iso: c.iso,
    m3: c.gazM3,
    coef: c.coef,
    kwh: c.gazKwh,
  }));
};

export function indexMensuels(annee, defauts = {}) {
  const t = annee.jours;
  const a = {
    HPH: 184210,
    HCH: 96530,
    HPB: 402118,
    HCB: 211904,
  };
  let c = defauts.bouclage ? 97820 : 41230;
  const o = [];
  let d = 0;
  const u = [];
  for (let l = 0; l <= 12; l++) {
    const s = new Date(Date.UTC(2025, 8 + l, 1));
    u.push(s.toISOString().slice(0, 10));
  }
  u.forEach((l, s) => {
    while (d < t.length && t[d].iso < l) {
      const m = t[d];
      for (let f = 0; f < PAS_PAR_JOUR; f++) {
        a[posteHoraire(m.iso, f, m.dow)] += m.elec[f] / 6;
      }
      c += m.gazM3;
      d++;
    }
    const r = Object.fromEntries(POSTES_HORAIRES.map((m) => [m, Math.round(a[m])]));
    if (defauts.indexRecule && l === "2026-04-01") {
      r.HPB = Math.round(a.HPB) - 9000;
    }
    let i = Math.round(c);
    const p = {
      compteur: "G-1",
      statut: "réel",
    };
    if (defauts.indexEstime && l === "2026-02-01") {
      const m = o[s - 1].gaz;
      i = Math.round(m + (c - m) * 0.62);
      p.statut = "estimé";
    }
    if (defauts.changementCompteur && l >= "2026-02-01") {
      p.compteur = "G-2";
    }
    o.push({
      date: l,
      elec: r,
      gaz: i,
      gazBrut: i,
      statutGaz: p.statut,
      compteurGaz: p.compteur,
    });
  });
  if (defauts.changementCompteur) {
    const l = o.findIndex((i) => i.date === "2026-01-01");
    let s = o[l].gaz;
    for (const i of t) {
      if (i.iso >= "2026-01-01" && i.iso < "2026-01-15") {
        s += i.gazM3;
      }
    }
    const r = Math.round(s);
    o.splice(
      l + 1,
      0,
      {
        date: "2026-01-15",
        elec: null,
        gaz: r,
        statutGaz: "dépose",
        compteurGaz: "G-1",
        evenement: "Dépose ancien compteur",
      },
      {
        date: "2026-01-15",
        elec: null,
        gaz: 0,
        statutGaz: "pose",
        compteurGaz: "G-2",
        evenement: "Pose nouveau compteur",
      },
    );
    for (const i of o) {
      if (i.date >= "2026-02-01") {
        i.gaz = i.gaz - r;
      }
    }
  }
  for (const l of o) {
    l.gaz = ((l.gaz % 100000) + 100000) % 100000;
  }
  return o;
}
