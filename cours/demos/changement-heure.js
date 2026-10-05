/**
 * Démo « changementHeure » (niveaux Comprendre / Approfondir).
 */
import { icone } from "../blocs/icones.js";
import { nombre, texteRiche, tous, un } from "../blocs/outils.js";
import { dateCourte } from "../modele/calendrier.js";
import { courbeDeCharge } from "../modele/releves.js";
import { anneeDeReference } from "../modele/simulation.js";

const surDeuxChiffres = (e) => String(e).padStart(2, "0");

function versUtc(e, n, t) {
  const [a, c] = n.split(":").map(Number);
  return `${new Date(Date.UTC(+e.slice(0, 4), +e.slice(5, 7) - 1, +e.slice(8, 10), a - t, c)).toISOString().slice(0, 16).replace("T", " ")}Z`;
}

export function demoChangementHeure(zone, options) {
  let t = "ete";
  zone.innerHTML = `
    <div class="segmented" role="group" aria-label="Changement d’heure"><button type="button" data-c="ete" aria-pressed="true">29 mars 2026 : heure d’été</button><button type="button" data-c="hiver" aria-pressed="false">26 oct. 2025 : heure d’hiver</button></div>
    <div id="ch-res" class="stack" style="gap:12px"></div>`;
  function a() {
    const c = t === "ete" ? "2026-03-29" : "2025-10-26";
    const o = anneeDeReference();
    const d = courbeDeCharge(o, c, 1, {
      changementHeure: true,
    });
    let u = false;
    const s = d
      .map((m) => {
        let f;
        if (t === "ete") {
          f = m.slot < 12 ? 1 : 2;
        } else {
          if (m.repetee) {
            u = true;
          }
          f = u || m.slot >= 18 ? 1 : 2;
        }
        return {
          ...m,
          dec: f,
          utc: versUtc(c, m.heure, f),
        };
      })
      .filter((m) => m.slot >= 9 && m.slot <= 20);
    const r = d.reduce((m, f) => m + f.kw / 6, 0);
    const i = o.jours.find((m) => m.iso === (t === "ete" ? "2026-03-22" : "2025-10-19"));
    const p = i.elec.reduce((m, f) => m + f, 0) / 6;
    un("#ch-res", zone).innerHTML = `
      <div class="table-wrap"><table><thead><tr><th>Heure locale affichée</th><th>Décalage</th><th>Horodatage UTC</th><th class="r">kW</th></tr></thead><tbody>
      ${s.map((m) => `<tr class="${m.repetee ? "alerte" : ""}"><td class="mono">${m.heure}${m.repetee ? " (2e fois)" : ""}</td><td class="mono">+${surDeuxChiffres(m.dec)}:00</td><td class="mono">${m.utc}</td><td class="r mono">${nombre(m.kw, 2)}</td></tr>`).join("")}
      ${t === "ete" ? '<tr class="grave"><td colspan="4">De 02:00 à 02:50 : ces heures n’existent pas ce jour-là (à 2 h, il est 3 h).</td></tr>' : ""}
      </tbody></table></div>
      <div class="kpis">
        <div class="kpi"><span class="v">${d.length}</span><span class="l">mesures ce jour (au lieu de 144)</span></div>
        <div class="kpi"><span class="v">${t === "ete" ? 23 : 25} h</span><span class="l">durée de la journée locale</span></div>
        <div class="kpi data"><span class="v">${nombre(r)} kWh</span><span class="l">énergie de la journée</span></div>
        <div class="kpi"><span class="v">${nombre(p)} kWh</span><span class="l">un dimanche normal (${dateCourte(i.iso)})</span></div>
      </div>
      <p class="feedback info">${icone("info")}<span>${texteRiche(t === "ete" ? "En UTC, les horodatages se suivent sans trou : 00:50Z puis 01:00Z. En heure locale, on saute de 01:50 à 03:00. Un contrôle de complétude qui attend 144 points lèverait une fausse alerte. La journée consomme environ 1/24 de moins qu’un dimanche normal." : "En heure locale, 02:00 à 02:50 apparaît deux fois : sans le décalage (+02:00 puis +01:00), on croirait à des doublons et on supprimerait une heure d’énergie réelle. En {{utc}}, chaque mesure a un horodatage unique.")}</span></p>`;
  }
  tous("[data-c]", zone).forEach((c) =>
    c.addEventListener("click", () => {
      t = c.dataset.c;
      tous("[data-c]", zone).forEach((o) => o.setAttribute("aria-pressed", o === c));
      options.toucher();
      a();
    }),
  );
  a();
}
