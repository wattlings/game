/**
 * Le calendrier de l'année simulée : vacances, jours fériés, changements d'heure, formats de dates.
 */
export const VACANCES = [
  {
    nom: "Toussaint",
    debut: "2025-10-18",
    reprise: "2025-11-03",
  },
  {
    nom: "Noël",
    debut: "2025-12-20",
    reprise: "2026-01-05",
  },
  {
    nom: "Hiver",
    debut: "2026-02-21",
    reprise: "2026-03-09",
  },
  {
    nom: "Printemps",
    debut: "2026-04-18",
    reprise: "2026-05-04",
  },
  {
    nom: "Pont de l'Ascension",
    debut: "2026-05-14",
    reprise: "2026-05-18",
  },
  {
    nom: "Été",
    debut: "2026-07-04",
    reprise: "2026-09-01",
  },
];

const JOURS_FERIES = {
  "2025-11-01": "Toussaint",
  "2025-11-11": "Armistice",
  "2025-12-25": "Noël",
  "2026-01-01": "Jour de l'an",
  "2026-04-06": "Lundi de Pâques",
  "2026-05-01": "Fête du travail",
  "2026-05-08": "Victoire 1945",
  "2026-05-14": "Ascension",
  "2026-05-25": "Lundi de Pentecôte",
  "2026-07-14": "Fête nationale",
  "2026-08-15": "Assomption",
};

export const CHANGEMENTS_HEURE = {
  "2025-10-26": {
    type: "hiver",
    heures: 25,
    texte: "Passage à l'heure d'hiver : à 3 h il est 2 h, la journée dure 25 h.",
  },
  "2026-03-29": {
    type: "ete",
    heures: 23,
    texte: "Passage à l'heure d'été : à 2 h il est 3 h, la journée dure 23 h.",
  },
};

export const DEBUT_SIMULATION = "2025-09-01";

export const JOURS_PAR_AN = 365;

export const JOURS_SIMULES = 378;

const JOURS_SEMAINE = ["dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"];

const MOIS_ABREGES = [
  "janv.",
  "févr.",
  "mars",
  "avr.",
  "mai",
  "juin",
  "juil.",
  "août",
  "sept.",
  "oct.",
  "nov.",
  "déc.",
];

export const MOIS = [
  "janvier",
  "février",
  "mars",
  "avril",
  "mai",
  "juin",
  "juillet",
  "août",
  "septembre",
  "octobre",
  "novembre",
  "décembre",
];

export function ajouterJours(iso, jours) {
  const t = new Date(iso + "T12:00:00Z");
  t.setUTCDate(t.getUTCDate() + jours);
  return t.toISOString().slice(0, 10);
}

export const jourDeSemaine = (iso) => new Date(iso + "T12:00:00Z").getUTCDay();

export const nomDuJour = (iso) => JOURS_SEMAINE[jourDeSemaine(iso)];

export function dateCourte(iso) {
  const [, n, t] = iso.split("-");
  return `${+t} ${MOIS_ABREGES[+n - 1]}`;
}

export function dateLongue(iso) {
  const [n, t, a] = iso.split("-");
  return `${nomDuJour(iso)} ${+a} ${MOIS[+t - 1]} ${n}`;
}

export const dateFr = (iso) => iso.split("-").reverse().join("/");

export function vacancesDu(iso) {
  return VACANCES.find((n) => iso >= n.debut && iso < n.reprise) || null;
}

export function typeDeJour(e, { mercrediMatin: n = true } = {}) {
  const t = jourDeSemaine(e);
  if (JOURS_FERIES[e]) {
    return "ferie";
  } else if (vacancesDu(e)) {
    return "vacances";
  } else if (t === 0 || t === 6) {
    return "weekend";
  } else if (t === 3) {
    if (n) {
      return "mercredi";
    } else {
      return "weekend";
    }
  } else {
    return "classe";
  }
}

export const LIBELLES_TYPE_JOUR = {
  classe: "Jour de classe",
  mercredi: "Mercredi (matin)",
  weekend: "Week-end",
  vacances: "Vacances scolaires",
  ferie: "Jour férié",
};

export const MOIS_COURTS = MOIS_ABREGES;
