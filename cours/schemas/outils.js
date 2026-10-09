/**
 * Briques de dessin communes aux schémas : textes, cadre, école, compteur.
 */
export const texteSchema = (e, n, t, a = "") =>
  `<text x="${e}" y="${n}" font-family="var(--f-body)" font-size="11" fill="var(--ink)" ${a}>${t}</text>`;

export const texteSchemaMono = (e, n, t, a = "") =>
  `<text x="${e}" y="${n}" font-family="var(--f-mono)" font-size="9.5" fill="var(--muted)" ${a}>${t}</text>`;

export const cadreSchema = (e, n) => `<svg viewBox="0 0 320 205" role="img" aria-label="${e}">${n}</svg>`;

export function dessinEcole(e, n, t = 1) {
  return `<g transform="translate(${e} ${n}) scale(${t})">
    <path d="M0 40 L60 8 L120 40 Z" fill="var(--surface)" stroke="var(--ink)" stroke-width="2" stroke-linejoin="round"/>
    <rect x="8" y="40" width="104" height="70" fill="var(--surface)" stroke="var(--ink)" stroke-width="2"/>
    ${[0, 1, 2].map((a) => [0, 1].map((c) => `<rect x="${18 + a * 32}" y="${50 + c * 24}" width="20" height="14" rx="2" fill="var(--data-soft)" stroke="var(--ink)" stroke-width="1.2"/>`).join("")).join("")}
    <rect x="50" y="88" width="20" height="22" fill="var(--surface-2)" stroke="var(--ink)" stroke-width="1.5"/>
    <circle cx="60" cy="28" r="6" fill="var(--surface)" stroke="var(--ink)" stroke-width="1.5"/>
  </g>`;
}

export const dessinCompteur = (e, n, t, a, encre = "var(--surface)") =>
  `<g transform="translate(${e} ${n})"><rect width="42" height="50" rx="8" fill="${t}"/><rect x="6" y="8" width="30" height="12" rx="2" fill="var(--surface)"/>${texteSchemaMono(9, 17.5, "0421", 'font-size="8.5" fill="var(--ink)"')}<text x="21" y="40" text-anchor="middle" font-size="14" fill="${encre}" font-family="var(--f-display)" font-weight="800">${a}</text></g>`;
