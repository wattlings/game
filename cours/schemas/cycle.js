/**
 * La roue des 8 étapes affichée sur l'accueil.
 */
import { FAMILLES } from "../../commun/donnees/etapes.js";
import { icone } from "../blocs/icones.js";
import { echapper } from "../blocs/outils.js";
import { ETAPES } from "../contenu/index.js";
import { magasin } from "../coquille/etat.js";

const CENTRE_CYCLE = 240;

const RAYON_CYCLE = 165;

const angleEtape = (e) => (-90 + (e - 1) * 45) * (Math.PI / 180);

const positionEtape = (e, n = RAYON_CYCLE) => [
  CENTRE_CYCLE + n * Math.cos(angleEtape(e)),
  CENTRE_CYCLE + n * Math.sin(angleEtape(e)),
];

function arcCycle(e, n, t = RAYON_CYCLE) {
  const a = (l) => [
    CENTRE_CYCLE + t * Math.cos((l * Math.PI) / 180),
    CENTRE_CYCLE + t * Math.sin((l * Math.PI) / 180),
  ];
  const [c, o] = a(e);
  const [d, u] = a(n);
  return `M${c.toFixed(1)},${o.toFixed(1)} A${t},${t} 0 ${n - e > 180 ? 1 : 0} 1 ${d.toFixed(1)},${u.toFixed(1)}`;
}

/** Le SVG de la roue des 8 étapes. */
export function roueDuCycle() {
  const e = magasin.get().filtre || "tout";
  const n = ETAPES.map((o) => {
    const d = -90 + (o.num - 1) * 45 + 22.5;
    const [u, l] = [
      CENTRE_CYCLE + RAYON_CYCLE * Math.cos((d * Math.PI) / 180),
      CENTRE_CYCLE + RAYON_CYCLE * Math.sin((d * Math.PI) / 180),
    ];
    const s =
      o.num === 8
        ? "var(--ink)"
        : `var(--${o.famille === "data" && o.num < 4 ? "data" : o.num >= 5 ? "energie" : "muted"})`;
    return `<path d="M-5,-6 L5,0 L-5,6" transform="translate(${u.toFixed(1)} ${l.toFixed(1)}) rotate(${d + 90})" fill="none" stroke="${s}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>`;
  }).join("");
  const t = ETAPES.map((o) => {
    const [d, u] = positionEtape(o.num);
    const l = magasin.estFaite(o.num);
    const s = e !== "tout" && e !== o.famille;
    const r = o.aussi ? ` et ${FAMILLES[o.aussi].nom}` : "";
    const i = `Étape ${o.num}, ${o.titre} (${FAMILLES[o.famille].nom}${r}) : ${o.question}${l ? " Étape terminée." : ""}`;
    return `<a href="#etape-${o.num}" class="cycle-node fam-${o.famille} ${s ? "estompe" : ""}" data-num="${o.num}" aria-label="${echapper(i)}">
      <g transform="translate(${d.toFixed(1)} ${u.toFixed(1)})"><g class="disc">
        <rect class="ring" x="-64" y="-21" width="128" height="42" rx="21" fill="var(--${o.famille})" stroke="var(--bg)" stroke-width="3"/>
        <circle cx="-43" cy="0" r="13" fill="var(--bg)" fill-opacity=".92"/>
        <text x="-43" y="4.5" text-anchor="middle" font-family="var(--f-mono)" font-size="13" font-weight="700" fill="var(--ink)">${l ? "✓" : o.num}</text>
        <text x="9" y="5.5" text-anchor="middle" font-family="var(--f-display)" font-weight="800" font-size="14.5" fill="var(--on-${o.famille})">${echapper(o.titre)}</text>
        ${o.aussi ? `<circle cx="58" cy="-17" r="9" fill="var(--${o.aussi})" stroke="var(--bg)" stroke-width="2.5"/><text x="58" y="-13" text-anchor="middle" font-size="12" font-weight="800" fill="var(--on-${o.aussi})">+</text>` : ""}
      </g></g></a>`;
  }).join("");
  const a = e === "energie" ? "estompe" : "";
  const c = e === "data" ? "estompe" : "";
  return `
  <div class="cycle-wrap">
    <svg viewBox="0 0 480 480" aria-labelledby="cycle-titre">
      <title id="cycle-titre">Le cycle de l'energy management en 8 étapes : 1 à 4 famille Data, 5 à 8 famille Énergie. L'étape 8 ramène à l'étape 1.</title>
      <path class="cycle-arc ${a}" d="${arcCycle(-94, 67.5)}" fill="none" stroke="var(--data)" stroke-width="10" stroke-opacity=".22" stroke-linecap="round"/>
      <path class="cycle-arc ${c}" d="${arcCycle(67.5, 226)}" fill="none" stroke="var(--energie)" stroke-width="10" stroke-opacity=".28" stroke-linecap="round"/>
      <path d="${arcCycle(231, 265)}" fill="none" stroke="var(--ink)" stroke-width="2.5" stroke-dasharray="4 5"/>
      <text x="${CENTRE_CYCLE + (RAYON_CYCLE + 32) * Math.cos((Math.PI * 247.5) / 180) - 40}" y="${CENTRE_CYCLE + (RAYON_CYCLE + 32) * Math.sin((Math.PI * 247.5) / 180) - 4}" font-family="var(--f-body)" font-size="12" font-weight="700" fill="var(--ink)" text-anchor="middle">on recommence</text>
      ${n}
      ${t}
    </svg>
    <div class="cycle-centre" aria-live="polite">
      <span class="eyebrow" id="cc-eyebrow">8 étapes · 2 familles</span>
      <span class="q" id="cc-q">Survole ou choisis une étape</span>
      <span class="legend-row" id="cc-leg" style="justify-content:center">
        <span class="badge data">${icone("data")} Data 1 à 4</span><span class="badge energie">${icone("energie")} Énergie 5 à 8</span>
      </span>
    </div>
  </div>`;
}

/** Rend la roue interactive : survol, focus et clic sur une étape. */
export function brancherRoue(conteneur) {
  const n = conteneur.querySelector("#cc-eyebrow");
  const t = conteneur.querySelector("#cc-q");
  const a = conteneur.querySelector("#cc-leg");
  const c = (d) => {
    const u = ETAPES.find((l) => l.num === +d);
    conteneur
      .querySelectorAll(".cycle-node")
      .forEach((l) => l.classList.toggle("actif", +l.dataset.num == +d));
    n.textContent = `Étape ${u.num} · ${FAMILLES[u.famille].nom}${u.aussi ? " + " + FAMILLES[u.aussi].nom : ""}`;
    t.textContent = u.question;
    a.hidden = true;
  };
  const o = () => {
    conteneur.querySelectorAll(".cycle-node").forEach((d) => d.classList.remove("actif"));
    n.textContent = "8 étapes · 2 familles";
    t.textContent = "Survole ou choisis une étape";
    a.hidden = false;
  };
  conteneur.querySelectorAll(".cycle-node").forEach((d) => {
    d.addEventListener("pointerenter", () => c(d.dataset.num));
    d.addEventListener("focus", () => c(d.dataset.num));
    d.addEventListener("pointerleave", o);
    d.addEventListener("blur", o);
  });
}
