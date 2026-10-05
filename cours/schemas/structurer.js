/**
 * Schéma de l'étape « structurer » (affiché dans l'Essentiel).
 */
import { cadreSchema, texteSchema, texteSchemaMono } from "./outils.js";

export default () =>
  cadreSchema(
    "Schéma : un site contient des compteurs, qui contiennent des mesures, regroupables par pas de temps",
    `
    <rect x="110" y="10" width="100" height="32" rx="8" fill="var(--data)"/><text x="160" y="31" text-anchor="middle" fill="var(--on-data)" font-family="var(--f-display)" font-weight="800" font-size="13">Site : école</text>
    <path d="M160 42 V54 M80 54 H240 M80 54 V66 M240 54 V66" stroke="var(--ink)" stroke-width="1.5" fill="none"/>
    <rect x="30" y="66" width="100" height="30" rx="8" fill="var(--surface)" stroke="var(--data)" stroke-width="2"/>${texteSchema(80, 85, "Compteur élec", 'text-anchor="middle" font-weight="700"')}
    <rect x="190" y="66" width="100" height="30" rx="8" fill="var(--surface)" stroke="var(--data)" stroke-width="2"/>${texteSchema(240, 85, "Compteur gaz", 'text-anchor="middle" font-weight="700"')}
    <path d="M80 96 V108 M240 96 V108" stroke="var(--ink)" stroke-width="1.5"/>
    ${texteSchemaMono(80, 120, "mesures kW / 10 min", 'text-anchor="middle"')}${texteSchemaMono(240, 120, "mesures m³ / jour", 'text-anchor="middle"')}
    ${[
      ["10 min", 144],
      ["1 h", 24],
      ["1 jour", 1],
    ]
      .map(
        ([e, n], t) =>
          `<g transform="translate(${30 + t * 96} 140)"><rect width="80" height="44" rx="8" fill="var(--surface-2)"/>${texteSchema(40, 19, e, 'text-anchor="middle" font-weight="700"')}${texteSchemaMono(40, 34, `${n} point${n > 1 ? "s" : ""}/jour`, 'text-anchor="middle"')}</g>`,
      )
      .join("")}`,
  );
