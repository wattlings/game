/**
 * Schéma de l'étape « agir » (affiché dans l'Essentiel).
 */
import { cadreSchema, texteSchema, texteSchemaMono } from "./outils.js";

export default () =>
  cadreSchema(
    "Schéma : trois marches de leviers, du moins cher au plus lourd",
    `
    ${[
      ["Régler", "comportements, horaires", "€"],
      ["Optimiser", "contrat, puissance", "€€"],
      ["Investir", "travaux, solaire", "€€€"],
    ]
      .map(
        ([e, n, t], a) => `
      <rect x="${16 + a * 100}" y="${130 - a * 44}" width="92" height="${44 + a * 44}" rx="8" fill="var(--energie)" fill-opacity="${0.35 + a * 0.3}"/>
      <text x="${62 + a * 100}" y="${150 - a * 44}" text-anchor="middle" font-family="var(--f-display)" font-weight="800" font-size="13" fill="var(--ink)">${e}</text>
      ${texteSchemaMono(62 + a * 100, 164 - a * 44, n, 'text-anchor="middle" fill="var(--ink)"')}
      ${texteSchema(62 + a * 100, 118 - a * 44, t, 'text-anchor="middle" font-weight="700" fill="var(--energie-ink)"')}`,
      )
      .join("")}
    ${texteSchemaMono(16, 192, "coût et délai croissants →")}`,
  );
