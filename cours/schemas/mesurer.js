/**
 * Schéma de l'étape « mesurer » (affiché dans l'Essentiel).
 */
import { cadreSchema, texteSchema, texteSchemaMono } from "./outils.js";

export default () =>
  cadreSchema(
    "Schéma : comparaison avant et après à conditions égales, −15 % une fois corrigé de la météo contre −27 % en brut, puis retour à l'étape Cadrer",
    `
    <rect x="40" y="50" width="56" height="110" rx="6" fill="var(--muted)" fill-opacity=".35"/><rect x="120" y="66" width="56" height="94" rx="6" fill="var(--energie)"/>
    ${texteSchema(68, 176, "avant", 'text-anchor="middle"')}${texteSchema(148, 176, "après", 'text-anchor="middle"')}
    <path d="M96 50 H148 V62" fill="none" stroke="var(--ink)" stroke-width="1.5" stroke-dasharray="4 3"/>${texteSchema(150, 44, "−15 %", 'font-weight="800" font-size="13"')}
    ${texteSchemaMono(40, 196, "à météo égale (brut : −27 %)")}
    <path d="M214 150 C 300 150, 300 40, 230 40" fill="none" stroke="var(--data)" stroke-width="2.5" marker-end="url(#fl2)"/>
    <defs><marker id="fl2" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" fill="var(--data)"/></marker></defs>
    <circle cx="214" cy="40" r="16" fill="var(--data)"/><text x="214" y="45" text-anchor="middle" fill="var(--on-data)" font-weight="800" font-size="14" font-family="var(--f-mono)">1</text>
    ${texteSchema(248, 100, "on", 'font-weight="700"')}${texteSchema(248, 114, "recommence", 'font-weight="700"')}`,
  );
