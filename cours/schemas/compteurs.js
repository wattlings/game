/**
 * Illustration : les deux compteurs communicants, électricité et gaz, dessinés (génériques, sans logo),
 * avec ce qu'on y lit : l'index, l'identifiant (PDL ou PCE), le module qui transmet.
 */
const t = (x, y, s, a = "") => `<text x="${x}" y="${y}" font-family="var(--f-body)" font-size="11" ${/fill=/.test(a) ? "" : 'fill="#1c2440"'} ${a}>${s}</text>`;
const m = (x, y, s, a = "") => `<text x="${x}" y="${y}" font-family="var(--f-mono)" font-size="10" ${/fill=/.test(a) ? "" : 'fill="#1c2440"'} ${a}>${s}</text>`;
const repere = (x, y, n) =>
  `<circle cx="${x}" cy="${y}" r="9" fill="var(--energie)"/><text x="${x}" y="${y + 4}" text-anchor="middle" font-family="var(--f-display)" font-weight="800" font-size="11" fill="var(--on-energie)">${n}</text>`;

export default () => `<svg viewBox="0 0 480 250" role="img" aria-label="Illustration : à gauche, le compteur électrique communicant (Linky), avec son écran qui affiche l'index en kWh, l'étiquette du numéro PDL à 14 chiffres et le voyant qui clignote avec la consommation. À droite, le compteur de gaz communicant (Gazpar), avec son index à rouleaux en mètres cubes, l'étiquette du numéro PCE et le module radio qui transmet un relevé par jour.">
  <!-- électricité -->
  <rect x="30" y="20" width="160" height="200" rx="22" fill="#cfe6a8" stroke="#1c2440" stroke-width="2"/>
  <rect x="48" y="42" width="124" height="44" rx="6" fill="#20303a" stroke="#1c2440" stroke-width="1.5"/>
  ${m(58, 60, "BASE", 'fill="#b6f0c0" font-size="9"')}
  ${m(58, 78, "0045 216 kWh", 'fill="#b6f0c0" font-size="12"')}
  <circle cx="64" cy="104" r="5" fill="#f2c12e" stroke="#1c2440" stroke-width="1"/>
  ${m(74, 108, "voyant", 'font-size="9"')}
  <rect x="48" y="122" width="124" height="34" rx="4" fill="#ffffff" stroke="#1c2440" stroke-width="1"/>
  ${m(54, 136, "PDL / PRM", 'font-size="8.5"')}${m(54, 150, "30001234567890", 'font-size="9.5"')}
  <rect x="62" y="170" width="96" height="32" rx="8" fill="#b5d48c" stroke="#1c2440" stroke-width="1"/>
  ${t(110, 190, "boutons", 'text-anchor="middle" font-size="9.5"')}
  ${repere(182, 64, 1)}${repere(182, 139, 2)}${repere(52, 104, 3)}
  ${t(110, 240, "Électricité (Linky)", 'text-anchor="middle" font-weight="700"')}
  <!-- gaz -->
  <rect x="290" y="40" width="160" height="150" rx="10" fill="#f0e2a0" stroke="#1c2440" stroke-width="2"/>
  <rect x="312" y="62" width="116" height="36" rx="4" fill="#ffffff" stroke="#1c2440" stroke-width="1.5"/>
  ${[0, 1, 2, 3, 4].map((i) => `<rect x="${318 + i * 18}" y="68" width="16" height="24" rx="2" fill="${i < 5 ? "#1c2440" : "#c43d3d"}"/>${m(322 + i * 18, 85, "04521"[i], 'fill="#ffffff" font-size="13"')}`).join("")}
  ${m(412, 85, "m³", 'font-size="11"')}
  <rect x="312" y="110" width="116" height="30" rx="4" fill="#ffffff" stroke="#1c2440" stroke-width="1"/>
  ${m(318, 123, "PCE", 'font-size="8.5"')}${m(318, 136, "21456789012345", 'font-size="9.5"')}
  <rect x="380" y="150" width="56" height="30" rx="6" fill="#e2d184" stroke="#1c2440" stroke-width="1"/>
  <path d="M396 158 q12 -10 24 0 M400 164 q8 -6 16 0" fill="none" stroke="#1c2440" stroke-width="1.5"/>
  ${repere(442, 80, 1)}${repere(442, 125, 2)}${repere(372, 165, 4)}
  ${t(370, 210, "Gaz (Gazpar)", 'text-anchor="middle" font-weight="700"')}
</svg>`;
