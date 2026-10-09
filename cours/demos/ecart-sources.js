/**
 * Démo « ecartSources » (niveaux Comprendre / Approfondir).
 */
import { icone } from "../blocs/icones.js";
import { interrupteur, nombre, pourcent, texteRiche, tous, un } from "../blocs/outils.js";
import { magasin } from "../coquille/etat.js";
import { MOIS } from "../modele/calendrier.js";
import { POSTES_HORAIRES, courbeDeCharge, indexMensuels } from "../modele/releves.js";
import { anneeAvecDerives, anomaliesActives } from "../modele/simulation.js";

export function demoEcartSources(zone, options) {
  let t = 1;
  const a = {
    trous: "Trous de données",
    doublons: "Doublons",
    aberrantes: "Valeurs aberrantes",
    indexRecule: "Index qui recule",
  };
  zone.innerHTML = `
    <div class="switch-list" role="group" aria-label="Anomalies à ajouter aux données">${Object.entries(a)
      .map(([o, d]) => interrupteur(`es-${o}`, d, "", magasin.get().anomalies?.[o]))
      .join("")}</div>
    <div class="field"><label for="es-seuil">Seuil d’alerte : écart de plus de <span id="es-seuil-txt" class="num"></span> entre courbe et index</label><input type="range" id="es-seuil" min="0.2" max="5" step="0.1" value="${t}"></div>
    <div id="es-res" aria-live="polite" class="stack" style="gap:12px"></div>`;
  function c() {
    const o = anneeAvecDerives();
    const d = anomaliesActives();
    const u = indexMensuels(o, d).filter((r) => r.elec);
    const l = [];
    for (let r = 0; r < u.length - 1; r++) {
      const i = u[r].date;
      const p = u[r + 1].date;
      const m = o.jours.findIndex((v) => v.iso === i);
      const f = o.jours.findIndex((v) => v.iso === p);
      const h = courbeDeCharge(o, i, f - m, d).reduce((v, j) => v + j.kw / 6, 0);
      const x = POSTES_HORAIRES.reduce((v, j) => v + u[r + 1].elec[j] - u[r].elec[j], 0);
      l.push({
        deb: i,
        courbe: h,
        index: x,
        ecart: h / x - 1,
      });
    }
    un("#es-seuil-txt", zone).textContent = pourcent(t / 100, 1);
    const s = l.filter((r) => Math.abs(r.ecart) > t / 100);
    un("#es-res", zone).innerHTML = `
      <div class="table-wrap"><table><thead><tr><th>Mois</th><th class="r">Somme courbe (kWh)</th><th class="r">Différence d’index (kWh)</th><th class="r">Écart</th><th>Alerte</th></tr></thead><tbody>
      ${l
        .map((r) => {
          const i = Math.abs(r.ecart) > t / 100;
          return `<tr class="${i ? "grave" : ""}"><td>${MOIS[+r.deb.slice(5, 7) - 1]} ${r.deb.slice(0, 4)}</td><td class="r mono">${nombre(r.courbe)}</td><td class="r mono">${nombre(r.index)}</td><td class="r mono">${r.ecart >= 0 ? "+" : "−"}${pourcent(Math.abs(r.ecart), 2)}</td><td>${i ? `<span class="badge bad">${icone("alerte")} alerte</span>` : '<span class="badge ok">ok</span>'}</td></tr>`;
        })
        .join("")}
      </tbody></table></div>
      <p class="feedback ${s.length ? "bad" : "info"}">${icone(s.length ? "alerte" : "info")}<span>${texteRiche(s.length ? `${s.length} mois en alerte. Regarde si chaque alerte correspond à une anomalie réelle (vrai positif) ou si le seuil est trop bas (faux positif). ${t < 0.5 ? "Avec un seuil aussi bas, les arrondis des index suffisent presque à déclencher une alerte." : ""}` : `Aucune alerte. ${Object.values(d).some(Boolean) ? "Si une anomalie est active, le seuil est peut-être trop haut : l’anomalie passe inaperçue (faux négatif)." : "Active une anomalie pour voir l’écart apparaître."}`)}</span></p>
      <p class="note">${icone("info")}<span>Un trou de 5 heures en novembre représente environ 0,5 % du mois ; une journée entière en février, environ 3 %. Le bon seuil dépend de ce qu’on veut attraper.</span></p>`;
  }
  tous('input[type="checkbox"]', zone).forEach((o) =>
    o.addEventListener("change", () => {
      magasin.set({
        anomalies: {
          ...magasin.get().anomalies,
          [o.id.slice(3)]: o.checked,
        },
      });
      options.toucher();
      c();
    }),
  );
  un("#es-seuil", zone).addEventListener("input", (o) => {
    t = +o.target.value;
    options.toucher();
    c();
  });
  c();
}
