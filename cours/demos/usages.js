/**
 * Démo « usages » (niveaux Comprendre / Approfondir).
 */
import { icone } from "../blocs/icones.js";
import { echapper, nombre, pourcent, texteRiche, tous, un } from "../blocs/outils.js";
import { anneeDeReference, repartitionUsages } from "../modele/simulation.js";

const USAGES_ELEC = [
  ["talon", "Talon (nuits, week-ends, veilles)"],
  ["eclairage", "Éclairage"],
  ["informatique", "Informatique"],
  ["ventilation", "Ventilation"],
  ["cuisine", "Cuisine (fours, lave-vaisselle)"],
  ["periscolaire", "Périscolaire"],
];

const USAGES_GAZ = [
  ["chauffage", "Chauffage"],
  ["cuisine", "Cuisson et eau chaude"],
];

export function demoUsages(zone, options) {
  const t = repartitionUsages(anneeDeReference());
  let a = false;
  zone.innerHTML = `
    <div class="segmented" role="group" aria-label="Affichage"><button type="button" data-d="0" aria-pressed="true">Ce que mesure le compteur</button><button type="button" data-d="1" aria-pressed="false">Répartition estimée par usage</button></div>
    <div id="u-vue" class="stack" style="gap:18px"></div>`;
  const c = (d, u, l) => {
    const s = u.length <= 2 ? 45 : 14;
    const r = u.reduce((i, p) => i + p.v, 0);
    return `<div class="stack" style="gap:8px"><div class="row" style="justify-content:space-between"><b>${d}</b><span class="num">${nombre(r / 1000, 1)} MWh/an</span></div>
      <div class="barre-empilee" role="img" aria-label="${echapper(d)} : ${u.map((i) => `${i.l} ${pourcent(i.v / r)}`).join(", ")}">${u.map((i, p) => `<span style="flex:${i.v};background:color-mix(in srgb, var(--${l}) ${100 - p * s}%, var(--surface))"></span>`).join("")}</div>
      ${u.length > 1 ? `<ul class="stack" style="gap:4px;margin:0;padding:0;list-style:none;font-size:var(--t-s)">${u.map((i, p) => `<li class="row" style="gap:8px"><i style="width:12px;height:12px;border-radius:3px;background:color-mix(in srgb, var(--${l}) ${100 - p * s}%, var(--surface))"></i><span style="flex:1">${echapper(i.l)}</span><span class="num">${nombre(i.v)} kWh</span><span class="num muted" style="width:3.5em;text-align:right">${pourcent(i.v / r)}</span></li>`).join("")}</ul>` : ""}</div>`;
  };
  function o() {
    const d = a
      ? USAGES_ELEC.map(([l, s]) => ({
          l: s,
          v: t.elec[l],
        }))
      : [
          {
            l: "Total",
            v: Object.values(t.elec).reduce((l, s) => l + s, 0),
          },
        ];
    const u = a
      ? USAGES_GAZ.map(([l, s]) => ({
          l: s,
          v: t.gaz[l],
        }))
      : [
          {
            l: "Total",
            v: t.gaz.chauffage + t.gaz.cuisine,
          },
        ];
    un("#u-vue", zone).innerHTML =
      `${c("Compteur électrique", d, "data") + c("Compteur gaz", u, "energie")}<p class="feedback info">${icone("info")}<span>${texteRiche(a ? "Cette répartition est **estimée** à partir du modèle de l’école : aucun compteur ne la mesure. Surprise : le talon pèse plus de la moitié de l’électricité, car l’école est vide la plupart du temps." : "Un compteur ne donne qu’un total par énergie. Pour savoir ce que consomme chaque usage, il faut des sous-compteurs ou une estimation.")}</span></p>`;
  }
  tous("[data-d]", zone).forEach((d) =>
    d.addEventListener("click", () => {
      a = d.dataset.d === "1";
      tous("[data-d]", zone).forEach((u) => u.setAttribute("aria-pressed", u === d));
      options.toucher();
      o();
    }),
  );
  o();
}
