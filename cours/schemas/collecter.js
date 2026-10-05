/**
 * Schéma de l'étape « collecter » (affiché dans l'Essentiel).
 */
import { cadreSchema, texteSchema, texteSchemaMono } from "./outils.js";

export default () =>
  cadreSchema(
    "Schéma : trois sources de données, courbe télérelevée, index et facture, qui alimentent le logiciel",
    `
    ${[
      ["Télérelevé", "10 min", 22],
      ["Index", "mensuel", 82],
      ["Facture", "mensuel, €", 142],
    ]
      .map(
        ([e, n, t], a) => `
      <rect x="6" y="${t}" width="138" height="44" rx="10" fill="var(--surface)" stroke="var(--data)" stroke-width="2"/>
      ${a === 0 ? `<path d="M20 ${t + 32} q6 -18 10 -6 t10 -10 t10 4 t10 -12" fill="none" stroke="var(--data)" stroke-width="2"/>` : ""}
      ${a === 1 ? `<rect x="20" y="${t + 12}" width="36" height="20" rx="3" fill="var(--data-soft)"/>${texteSchemaMono(24, t + 26, "04521", 'fill="var(--ink)"')}` : ""}
      ${a === 2 ? `<path d="M22 ${t + 8} h24 l6 6 v24 h-30 z" fill="var(--data-soft)" stroke="var(--data)" stroke-width="1.5"/>` : ""}
      ${texteSchema(72, t + 20, e, 'font-weight="700"')}${texteSchemaMono(72, t + 33, n)}
      <path d="M146 ${t + 22} C 176 ${t + 22}, 180 100, 204 100" fill="none" stroke="var(--data)" stroke-width="2" marker-end="url(#fl)"/>`,
      )
      .join("")}
    <defs><marker id="fl" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" fill="var(--data)"/></marker></defs>
    <ellipse cx="258" cy="70" rx="44" ry="12" fill="var(--data)"/><path d="M214 70 v60 a44 12 0 0 0 88 0 v-60" fill="var(--data)"/>
    <ellipse cx="258" cy="70" rx="44" ry="12" fill="none" stroke="var(--surface)" stroke-width="1.5" opacity=".5"/>
    <text x="258" y="112" text-anchor="middle" font-family="var(--f-display)" font-weight="800" font-size="16" fill="var(--on-data)">EMS</text>`,
  );
