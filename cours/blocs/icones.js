/**
 * Les icônes du cours, dessinées en SVG.
 */
const svgIcone = (e, n = "") =>
  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false" ${n}>${e}</svg>`;

const ICONES = {
  data: svgIcone(
    '<ellipse cx="12" cy="5.5" rx="7" ry="2.8"/><path d="M5 5.5v6c0 1.5 3.1 2.8 7 2.8s7-1.3 7-2.8v-6"/><path d="M5 11.5v6c0 1.5 3.1 2.8 7 2.8s7-1.3 7-2.8v-6"/>',
  ),
  energie: svgIcone('<path d="M13 2 4.5 13.5H12L11 22l8.5-11.5H12L13 2Z"/>'),
  flamme: svgIcone(
    '<path d="M12 22c4 0 7-2.7 7-6.8 0-3.5-2.3-5.6-3.6-8.2-.6 2-1.6 3-2.9 3.4.3-3.2-1.2-5.8-3.5-7.4.2 3.3-1.6 5.4-3 7.3C4.8 12 5 13.4 5 15.2 5 19.3 8 22 12 22Z"/>',
  ),
  prise: svgIcone('<path d="M9 2v5M15 2v5M6 7h12v4a6 6 0 0 1-12 0V7ZM12 17v5"/>'),
  livre: svgIcone(
    '<path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v17H6.5A2.5 2.5 0 0 0 4 21.5v-17Z"/><path d="M4 21.5A2.5 2.5 0 0 1 6.5 19H20v3H6.5"/><path d="M9 7h7M9 11h5"/>',
  ),
  soleil: svgIcone(
    '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
  ),
  lune: svgIcone('<path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5Z"/>'),
  boucle: svgIcone(
    '<path d="M4 12a8 8 0 0 1 13.7-5.6L20 8.7"/><path d="M20 4v4.7h-4.7"/><path d="M20 12a8 8 0 0 1-13.7 5.6L4 15.3"/><path d="M4 20v-4.7h4.7"/>',
  ),
  ok: svgIcone('<path d="m5 12.5 4.5 4.5L19 7.5"/>'),
  ko: svgIcone('<path d="M6 6l12 12M18 6 6 18"/>'),
  alerte: svgIcone('<path d="M12 3 2 20h20L12 3Z"/><path d="M12 10v4M12 17.5v.01"/>'),
  info: svgIcone('<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.5v.01"/>'),
  ecole: svgIcone(
    '<path d="M3 10.5 12 5l9 5.5"/><path d="M5 9.5V20h14V9.5"/><path d="M10 20v-5h4v5"/><path d="M12 5V2.5h3"/>',
  ),
  courbe: svgIcone('<path d="M3 20h18"/><path d="M3 16c2 0 2.5-6 4.5-6s2 4 4 4 2.5-9 4.5-9 2.5 7 5 7"/>'),
  tableau: svgIcone(
    '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 9.5h18M3 15h18M9.5 4v16"/>',
  ),
  facture: svgIcone(
    '<path d="M6 2h9l4 4v16l-2.5-1.5L14 22l-2-1.5L10 22l-2.5-1.5L5 22V3a1 1 0 0 1 1-1Z"/><path d="M9 8h6M9 12h6M9 16h3"/>',
  ),
  loupe: svgIcone('<circle cx="11" cy="11" r="6.5"/><path d="m20 20-4.2-4.2"/>'),
  cle: svgIcone('<circle cx="8" cy="15" r="4.5"/><path d="m11.5 11.5 8-8M16.5 6.5l2.5 2.5"/>'),
  stetho: svgIcone(
    '<path d="M6 3v5a5 5 0 0 0 10 0V3"/><path d="M11 13v3a4.5 4.5 0 0 0 9 0v-2"/><circle cx="20" cy="12" r="2"/>',
  ),
  fleche: svgIcone('<path d="M5 12h14M13 6l6 6-6 6"/>'),
  flecheG: svgIcone('<path d="M19 12H5M11 6l-6 6 6 6"/>'),
  menu: svgIcone('<path d="M4 7h16M4 12h16M4 17h16"/>'),
};

export const icone = (nom) => ICONES[nom] || "";
