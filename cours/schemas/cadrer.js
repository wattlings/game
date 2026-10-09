/**
 * Schéma de l'étape « cadrer » (affiché dans l'Essentiel).
 */
import { cadreSchema, dessinCompteur, dessinEcole, texteSchema, texteSchemaMono } from "./outils.js";

export default () =>
  cadreSchema(
    "Schéma : l'école, son périmètre et ses deux compteurs, électricité et gaz, avec leurs identifiants",
    `
    <rect x="72" y="16" width="176" height="150" rx="14" fill="none" stroke="var(--muted)" stroke-width="1.5" stroke-dasharray="5 4"/>
    ${texteSchemaMono(80, 30, "PÉRIMÈTRE : 1 SITE")}
    ${dessinEcole(100, 36, 1)}
    ${dessinCompteur(14, 70, "var(--data)", "kWh")}
    ${dessinCompteur(264, 70, "var(--energie)", "m³", "var(--on-energie)")}
    <path d="M56 95 H108" stroke="var(--data)" stroke-width="2.5"/><path d="M212 95 H264" stroke="var(--energie)" stroke-width="2.5"/>
    ${texteSchema(35, 138, "Électricité", 'text-anchor="middle" font-weight="700"')}${texteSchemaMono(35, 151, "PDL", 'text-anchor="middle"')}
    ${texteSchema(285, 138, "Gaz", 'text-anchor="middle" font-weight="700"')}${texteSchemaMono(285, 151, "PCE", 'text-anchor="middle"')}
    ${texteSchema(160, 188, "Quoi ? Où ? Pourquoi ?", 'text-anchor="middle" font-weight="700" font-size="12"')}`,
  );
