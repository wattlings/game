/**
 * Graphiques en barres du patrimoine (Pareto, écarts, comparaison, gisement, inventaire), produits en HTML.
 * Les couleurs sont passées en paramètre (C) : le cours donne les siennes, le jeu aussi.
 * Styles : graphiques.css, dans ce dossier.
 */
import {
  ACT,
  IND,
  PSITES,
  byActivity,
  ecart,
  gis,
  medAct,
  pareto,
  pct,
  ratio,
  refOf,
  sgn,
} from "../donnees/patrimoine.js";
import { esc, fmt } from "../texte.js";

/** Active les infobulles d'un graphique (survol ou focus d'une ligne). */
export function tipify(box) {
  const tip = document.createElement("div");
  tip.className = "pc-tip";
  tip.hidden = true;
  box.appendChild(tip);
  box.querySelectorAll("[data-tip]").forEach((r) => {
    const show = () => {
      tip.innerHTML = r.dataset.tip;
      tip.hidden = false;
      const bb = box.getBoundingClientRect(),
        rb = r.getBoundingClientRect();
      tip.style.top = rb.bottom - bb.top + 4 + "px";
      tip.style.left = Math.max(0, Math.min(bb.width - 240, rb.left - bb.left + 120)) + "px";
    };
    r.addEventListener("mouseenter", show);
    r.addEventListener("focus", show);
    r.addEventListener("mouseleave", () => (tip.hidden = true));
    r.addEventListener("blur", () => (tip.hidden = true));
  });
}
export function paretoHTML(ind, C, opt) {
  opt = opt || {};
  const P = opt.act ? { list: [], ...byActivity(ind) } : pareto(ind),
    rows = opt.act ? P.rows : P.list,
    max = rows[0].v;
  let cutDone = false;
  const lab = (r) =>
    opt.act ? `${esc(r.lab)} <small>(${r.n} site${r.n > 1 ? "s" : ""})</small>` : esc(r.s.n);
  let h = `<div class="pc"><div class="pc-legend"><span><i style="background:${C.e}"></i>Électricité</span><span><i style="background:${C.g}"></i>Gaz</span><span>${IND[ind].lab} en ${IND[ind].u}, du plus gros au plus petit · cumul à droite</span></div>`;
  h += `<div class="pc-row pc-head"><span>${opt.act ? "Activité" : "Site"}</span><span></span><span class="pc-v">${IND[ind].u}</span><span class="pc-c">cumul</span></div>`;
  rows.forEach((r, k) => {
    const p = opt.act ? r.p : r.p,
      w = p.map((x) => (x / max) * 100);
    const tipTxt = `<b>${opt.act ? esc(r.lab) : esc(r.s.n)}</b><br>${IND[ind].f(r.v)} · ${pct(r.share)} du total<br>dont électricité ${pct(p[0] / r.v)}${opt.act ? "" : `<br>${fmt(r.s.surf)} m² · ${ACT[r.s.a].lab}`}`;
    h += `<div class="pc-row" tabindex="0" data-tip="${esc(tipTxt)}"><span class="pc-l">${k + 1}. ${lab(r)}</span><span class="pc-track"><i style="width:${w[0]}%;background:${C.e}"></i><i style="width:${w[1]}%;background:${C.g}"></i></span><span class="pc-v">${IND[ind].f(r.v)}</span><span class="pc-c">${pct(r.cum)}</span></div>`;
    if (!cutDone && r.cum >= 0.8 && !opt.act) {
      cutDone = true;
      h += `<div class="pc-cut">▲ 80 % atteint avec ${k + 1} site${k ? "s" : ""} sur ${rows.length} (${pct((k + 1) / rows.length)} des sites)</div>`;
    }
  });
  return h + `</div>`;
}
export function statusChip(e, C) {
  if (e >= 0.2) return `<span class="chip" style="color:${C.warn}">▲ À investiguer</span>`;
  if (e <= -0.1) return `<span class="chip" style="color:${C.good}">✓ Performant</span>`;
  return `<span class="chip" style="color:${C.muted}">● Dans la norme</span>`;
}
export function ecartHTML(C) {
  const rows = PSITES.slice().sort((a, b) => ecart(b) - ecart(a));
  let h = `<div class="pc"><div class="pc-legend"><span><i style="background:${C.over}"></i>Consomme plus que la référence</span><span><i style="background:${C.under}"></i>Consomme moins</span><span>Écart du ratio (kWh/m²) à la référence nationale de l'activité</span></div>`;
  h += `<div class="pc-row pc-head"><span>Site</span><span style="text-align:center">−100 %  ·  0  ·  +100 %</span><span class="pc-v">écart</span><span class="pc-c"></span></div>`;
  rows.forEach((s) => {
    const e = ecart(s),
      w = Math.min(1, Math.abs(e)) * 50;
    const tipTxt = `<b>${esc(s.n)}</b><br>${fmt(Math.round(ratio(s)))} ${s.bassin ? "kWh/m² de bassin" : "kWh/m²"} · référence ${fmt(refOf(s))}<br>Médiane interne (${esc(ACT[s.a].lab)}) : ${fmt(Math.round(medAct(s.a)))}<br>Gisement : ${fmt(Math.round(gis(s)))} MWh`;
    h += `<div class="pc-row" tabindex="0" data-tip="${esc(tipTxt)}"><span class="pc-l">${esc(s.n)}</span><span class="pc-track" style="display:block"><span class="pc-mid"></span><i style="position:absolute;top:0;height:100%;${e >= 0 ? `left:50%;width:${w}%;background:${C.over};border-radius:0 4px 4px 0` : `right:50%;width:${w}%;background:${C.under};border-radius:4px 0 0 4px`}"></i></span><span class="pc-v">${sgn(e)}</span><span class="pc-c">${statusChip(e, C).replace(/À investiguer|Performant|Dans la norme/, "")}</span></div>`;
  });
  return h + `</div>`;
}
export function benchHTML(act, C) {
  const rows = PSITES.filter((s) => s.a === act).sort((a, b) => ratio(b) - ratio(a)),
    ref = ACT[act].ref,
    med = medAct(act),
    max = Math.max(ref, ...rows.map(ratio)) * 1.12;
  let h = `<div class="pc pc-wc"><div class="pc-legend"><span><i style="background:${C.bar}"></i>Ratio du site (${ACT[act].unit || "kWh/m²/an"})</span><span><i class="tick" style="background:${C.ink}"></i>Médiane du patrimoine (${fmt(Math.round(med))})</span><span><i class="dia" style="border:2px solid ${C.ink}"></i>Référence nationale (${fmt(ref)})</span></div>`;
  rows.forEach((s) => {
    const r = ratio(s),
      e = ecart(s);
    const tipTxt = `<b>${esc(s.n)}</b><br>${fmt(s.e + s.g)} MWh ÷ ${fmt(s.bassin || s.surf)} m²${s.bassin ? " de bassin" : ""} = ${fmt(Math.round(r))}<br>Écart à la référence : ${sgn(e)}<br>Gisement : ${fmt(Math.round(gis(s)))} MWh`;
    h += `<div class="pc-row" tabindex="0" data-tip="${esc(tipTxt)}"><span class="pc-l">${esc(s.n)}</span><span class="pc-track" style="display:block"><i style="position:absolute;left:0;top:1px;height:12px;width:${(r / max) * 100}%;background:${C.bar};border-radius:0 4px 4px 0"></i><span class="pc-mark" style="left:${(med / max) * 100}%"></span><span class="pc-dia" style="left:${(ref / max) * 100}%"></span></span><span class="pc-v">${fmt(Math.round(r))}</span><span class="pc-c">${statusChip(e, C)}</span></div>`;
  });
  return h + `</div>`;
}
export function gisHTML(C) {
  const rows = PSITES.filter((s) => gis(s) >= 1).sort((a, b) => gis(b) - gis(a)),
    max = gis(rows[0]),
    T = rows.reduce((a, s) => a + gis(s), 0);
  let h = `<div class="pc"><div class="pc-legend"><span><i style="background:${C.over}"></i>Gisement = (ratio − référence) × surface, en MWh/an</span><span>Total : ${fmt(Math.round(T))} MWh/an</span></div>`;
  rows.forEach((s) => {
    const tipTxt = `<b>${esc(s.n)}</b><br>(${fmt(Math.round(ratio(s)))} − ${fmt(refOf(s))}) × ${fmt(s.bassin || s.surf)} m² = ${fmt(Math.round(gis(s)))} MWh<br>${s.surf >= 1000 ? "Assujetti au décret tertiaire" : "Sous le seuil de 1 000 m²"}`;
    h += `<div class="pc-row" tabindex="0" data-tip="${esc(tipTxt)}"><span class="pc-l">${esc(s.n)}</span><span class="pc-track"><i style="width:${(gis(s) / max) * 100}%;background:${C.over};border-radius:0 4px 4px 0"></i></span><span class="pc-v">${fmt(Math.round(gis(s)))} MWh</span><span class="pc-c">${sgn(ecart(s))}</span></div>`;
  });
  return h + `</div>`;
}
export function invHTML() {
  return `<div class="tbl"><table><tr><th>Site</th><th>Activité</th><th>Surface</th><th>Élec</th><th>Gaz</th></tr>${PSITES.map((s) => `<tr><td>${esc(s.n)}</td><td>${esc(ACT[s.a].lab)}</td><td>${fmt(s.surf)} m²${s.bassin ? `<br><small>dont bassin ${s.bassin} m²</small>` : ""}</td><td>${s.e} MWh</td><td>${s.g} MWh</td></tr>`).join("")}</table></div>`;
}
