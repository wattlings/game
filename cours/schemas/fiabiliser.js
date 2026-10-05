/**
 * Schéma de l'étape « fiabiliser » (affiché dans l'Essentiel).
 */
import { cadreSchema, texteSchema, texteSchemaMono } from "./outils.js";

export default () =>
  cadreSchema(
    "Schéma : une courbe avec un trou et un pic aberrant, repérés par des contrôles",
    `
    <path d="M20 162 H300" stroke="var(--line)" stroke-width="1.5"/>
    <path d="M20 140 L45 138 L70 110 L95 104 L110 108" fill="none" stroke="var(--data)" stroke-width="2.5"/>
    <path d="M110 108 L150 106" fill="none" stroke="var(--bad)" stroke-width="2" stroke-dasharray="4 4"/>
    <path d="M150 106 L175 100 L190 104 L200 30 L210 102 L240 118 L270 138 L300 140" fill="none" stroke="var(--data)" stroke-width="2.5"/>
    <circle cx="130" cy="107" r="16" fill="none" stroke="var(--bad)" stroke-width="2"/>${texteSchema(130, 140, "trou", 'text-anchor="middle" fill="var(--bad)" font-weight="700"')}
    <circle cx="200" cy="30" r="12" fill="none" stroke="var(--bad)" stroke-width="2"/>${texteSchema(216, 26, "pic aberrant", 'fill="var(--bad)" font-weight="700"')}
    ${["Complétude", "Doublons", "Plausibilité", "Cohérence"].map((e, n) => `<g transform="translate(${20 + (n % 2) * 150} ${184 + Math.floor(n / 2) * 14})"><circle cx="5" cy="-4" r="5" fill="${n === 1 ? "var(--ok)" : n === 3 ? "var(--muted)" : "var(--bad)"}"/>${texteSchemaMono(14, 0, e)}</g>`).join("")}`,
  );
