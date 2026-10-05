/**
 * Schéma de l'étape « analyser » (affiché dans l'Essentiel).
 */
import { cadreSchema, texteSchema, texteSchemaMono } from "./outils.js";

export default () => {
  const e = [];
  for (let t = 0; t <= 24; t += 0.5) {
    let a = 6;
    if (t >= 7 && t < 18) {
      a += 4;
    }
    if (t >= 8 && t < 17) {
      a += 22;
    }
    if (t >= 10.5 && t < 13.5) {
      a += Math.exp(-(((t - 12) / 0.7) ** 2)) * 12;
    }
    e.push([20 + (t / 24) * 280, 170 - a * 3]);
  }
  const n = e.map((t, a) => `${a ? "L" : "M"}${t[0].toFixed(1)},${t[1].toFixed(1)}`).join("");
  return cadreSchema(
    "Schéma : la courbe d'une journée de classe, avec le talon, la journée et le pic du déjeuner",
    `
      <rect x="20" y="152" width="280" height="18" fill="var(--energie-soft)"/>
      <path d="${n}L300,170L20,170Z" fill="var(--energie)" fill-opacity=".16"/><path d="${n}" fill="none" stroke="var(--energie)" stroke-width="2.5"/>
      <path d="M20 152 H300" stroke="var(--energie-ink)" stroke-width="1.5" stroke-dasharray="5 4"/>
      ${texteSchema(24, 146, "talon (bâtiment vide)", 'fill="var(--energie-ink)" font-weight="700"')}
      ${texteSchema(160, 44, "pic du déjeuner", 'text-anchor="middle" font-weight="700"')}
      ${["0 h", "6 h", "12 h", "18 h", "24 h"].map((t, a) => texteSchemaMono(20 + a * 70, 186, t, 'text-anchor="middle"')).join("")}`,
  );
};
