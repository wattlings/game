/**
 * Démo « rattachement » (niveaux Comprendre / Approfondir).
 */
import { icone } from "../blocs/icones.js";
import { nombre, pourcent, texteRiche, tous, un } from "../blocs/outils.js";
import { factures } from "../modele/factures.js";
import { anneeDeReference, kwhElecDuJour } from "../modele/simulation.js";

const REGLES = {
  debut: "Tout dans le mois de début",
  fin: "Tout dans le mois de fin",
  prorata: "Au prorata du nombre de jours",
  courbe: "Selon les données journalières réelles",
};

export function demoRattachement(zone, options) {
  let t = "gaz";
  let a = "prorata";
  zone.innerHTML = `
    <div class="row" style="gap:16px">
      <div class="segmented" role="group" aria-label="Énergie"><button type="button" data-e="elec" aria-pressed="false">${icone("prise")}Électricité</button><button type="button" data-e="gaz" aria-pressed="true">${icone("flamme")}Gaz</button></div>
    </div>
    <div class="stack" style="gap:6px"><span class="eyebrow" id="rt-lbl">Méthode de rattachement</span><div class="row" role="group" aria-labelledby="rt-lbl">${Object.entries(
      REGLES,
    )
      .map(
        ([o, d]) => `<button type="button" class="btn" data-m="${o}" aria-pressed="${o === a}">${d}</button>`,
      )
      .join("")}</div></div>
    <div id="rt-res" aria-live="polite" class="stack" style="gap:12px"></div>`;
  function c() {
    const o = anneeDeReference();
    const d = factures(o)[t].find((h) => h.debut === "2026-01-14");
    const u = o.jours.filter((h) => h.iso >= d.debut && h.iso <= d.fin);
    const l = (h) => (t === "elec" ? kwhElecDuJour(h) : h.gazKwh);
    const s = u.filter((h) => h.iso < "2026-02-01").reduce((h, x) => h + l(x), 0);
    const r = u.filter((h) => h.iso >= "2026-02-01").reduce((h, x) => h + l(x), 0);
    const i = s + r;
    const p = u.filter((h) => h.iso < "2026-02-01").length;
    const m = {
      debut: [i, 0],
      fin: [0, i],
      prorata: [(i * p) / u.length, (i * (u.length - p)) / u.length],
      courbe: [s, r],
    }[a];
    const f = (h, x) =>
      Math.abs(h - x) < 1
        ? '<span class="badge ok">exact</span>'
        : `<span class="badge ${Math.abs(h / x - 1) > 0.05 ? "bad" : "warn"}">${h > x ? "+" : "−"}${pourcent(Math.abs(h / x - 1), 1)}</span>`;
    un("#rt-res", zone).innerHTML = `
      <p>${texteRiche(`Facture ${t === "elec" ? "d’électricité" : "de gaz"} du 14 janvier au 13 février 2026 : **${nombre(i)} kWh** sur ${u.length} jours (${p} en janvier, ${u.length - p} en février).`)}</p>
      <div class="table-wrap"><table><thead><tr><th>Mois</th><th class="r">Rattaché (kWh)</th><th class="r">Réellement consommé (kWh)</th><th>Écart</th></tr></thead><tbody>
        <tr><td>Janvier (14 → 31)</td><td class="r mono">${nombre(m[0])}</td><td class="r mono">${nombre(s)}</td><td>${f(m[0], s)}</td></tr>
        <tr><td>Février (1 → 13)</td><td class="r mono">${nombre(m[1])}</td><td class="r mono">${nombre(r)}</td><td>${f(m[1], r)}</td></tr>
      </tbody></table></div>
      <p class="feedback ${a === "courbe" ? "ok" : a === "prorata" ? "info" : "bad"}">${icone(a === "courbe" ? "ok" : a === "prorata" ? "info" : "alerte")}<span>${texteRiche(
        {
          debut:
            "Tout mettre en janvier gonfle janvier et vide février : les bilans mensuels deviennent faux.",
          fin: "Tout mettre en février : même problème, dans l’autre sens.",
          prorata: `Le prorata suppose une consommation identique chaque jour. ${t === "gaz" ? "Pour le gaz, qui suit la météo, l’erreur peut être importante d’un mois à l’autre." : "Pour l’électricité, l’erreur vient des week-ends et des vacances répartis inégalement."}`,
          courbe:
            "Avec les données journalières (télérelevé ou index quotidiens), on sait exactement quelle part tombe dans chaque mois. Le montant en euros peut ensuite être réparti avec la même clé.",
        }[a],
      )}</span></p>`;
  }
  tous("[data-e]", zone).forEach((o) =>
    o.addEventListener("click", () => {
      t = o.dataset.e;
      tous("[data-e]", zone).forEach((d) => d.setAttribute("aria-pressed", d === o));
      options.toucher();
      c();
    }),
  );
  tous("[data-m]", zone).forEach((o) =>
    o.addEventListener("click", () => {
      a = o.dataset.m;
      tous("[data-m]", zone).forEach((d) => d.setAttribute("aria-pressed", d === o));
      options.toucher();
      c();
    }),
  );
  c();
}
