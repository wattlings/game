/**
 * Schéma du modèle de données : patrimoine, site, bâtiment, point de comptage.
 */
import { SCHEMAS } from "./index.js";

export default () => {
  const e = (a, c, o, d, u, l = "var(--data)") => `<g transform="translate(${a} ${c})">
    <rect width="${o}" height="${28 + u.length * 13}" rx="8" fill="var(--surface)" stroke="${l}" stroke-width="2"/>
    <path d="M0 8 a8 8 0 0 1 8 -8 h${o - 16} a8 8 0 0 1 8 8 v12 h-${o} z" fill="${l}"/>
    <text x="${o / 2}" y="15" text-anchor="middle" font-family="var(--f-display)" font-weight="800" font-size="11" fill="${l === "var(--data)" ? "var(--on-data)" : "var(--on-energie)"}">${d}</text>
    ${u.map((s, r) => `<text x="8" y="${35 + r * 13}" font-family="var(--f-mono)" font-size="8.5" fill="var(--ink)">${s}</text>`).join("")}</g>`;
  const n = (a, c, o) =>
    `<text x="${a}" y="${c}" text-anchor="middle" font-family="var(--f-mono)" font-size="8.5" fill="var(--muted)">${o}</text>`;
  const t = (a) => `<path d="${a}" fill="none" stroke="var(--muted)" stroke-width="1.5"/>`;
  return `<svg viewBox="0 0 320 256" role="img" aria-label="Modèle de données : un site est relié à plusieurs points de comptage (et inversement) ; chaque point de comptage a des contrats, des factures et des compteurs successifs ; chaque compteur produit des mesures">
    ${e(4, 8, 76, "Site", ["nom", "surface m²"])}
    ${e(100, 8, 120, "Point de comptage", ["id PDL / PCE", "énergie", "du… au…"])}
    ${e(242, 8, 74, "Contrat", ["puissance", "du… au…"])}
    ${e(100, 108, 120, "Compteur", ["n° de série", "pose, dépose", "nb de chiffres"])}
    ${e(242, 108, 74, "Facture", ["période", "lignes en €"])}
    ${e(100, 196, 120, "Mesure", ["horodatage UTC", "valeur, unité"], "var(--energie)")}
    ${t("M80 30 H100")}${n(90, 24, "n–n")}
    ${t("M220 30 H242")}${n(231, 24, "1–n")}
    ${t("M160 75 V108")}${n(174, 95, "1–n")}
    ${t("M220 60 C 234 60, 234 128, 242 128")}${n(236, 96, "1–n")}
    ${t("M160 175 V196")}${n(174, 189, "1–n")}
  </svg>`;
};
