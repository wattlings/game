/**
 * Schéma de l'étape « detecter » (affiché dans l'Essentiel).
 */
import { cadreSchema, texteSchema, texteSchemaMono } from "./outils.js";

export default () =>
  cadreSchema(
    "Schéma : la consommation réelle dépasse la référence la nuit, ce qui signale une dérive",
    `
    <path d="M20 150 L60 150 L80 80 L140 76 L160 150 L200 150" fill="none" stroke="var(--muted)" stroke-width="2" stroke-dasharray="5 4"/>
    <path d="M200 150 L220 150" fill="none" stroke="var(--muted)" stroke-width="2" stroke-dasharray="5 4"/>
    <path d="M160 150 L160 128 L220 128 L220 150 Z" fill="var(--bad)" fill-opacity=".18"/>
    <path d="M20 150 L60 150 L80 80 L140 76 L160 128 L220 128 L240 82 L300 78" fill="none" stroke="var(--energie)" stroke-width="2.5"/>
    <path d="M220 150 L240 82" stroke="var(--muted)" stroke-width="2" stroke-dasharray="5 4"/>
    <g transform="translate(176 92)"><path d="M14 0 L28 24 H0 Z" fill="var(--bad)"/><text x="14" y="21" text-anchor="middle" fill="#fff" font-weight="800" font-size="13">!</text></g>
    ${texteSchema(190, 146, "nuit", 'text-anchor="middle" fill="var(--bad)" font-weight="700"')}
    <g transform="translate(20 176)"><path d="M0 0 H18" stroke="var(--muted)" stroke-width="2" stroke-dasharray="4 3"/>${texteSchemaMono(24, 3, "référence")}<path d="M100 0 H118" stroke="var(--energie)" stroke-width="2.5"/>${texteSchemaMono(124, 3, "réel")}<rect x="170" y="-5" width="12" height="10" fill="var(--bad)" fill-opacity=".3"/>${texteSchemaMono(188, 3, "écart = gaspillage")}</g>`,
  );
