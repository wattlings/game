/**
 * Démo « horodatage » (niveaux Comprendre / Approfondir).
 */
import { icone } from "../blocs/icones.js";
import { nombre, texteRiche, tous, un } from "../blocs/outils.js";
import { dateCourte } from "../modele/calendrier.js";
import { heureDuPas } from "../modele/releves.js";
import { anneeDeReference } from "../modele/simulation.js";

export function demoHorodatage(zone, options) {
  let t = "debut";
  let a = "debut";
  zone.innerHTML = `
    <div class="grid-2">
      <div class="stack" style="gap:6px"><span class="eyebrow" id="h-api">L’API étiquette chaque mesure par…</span><div class="segmented" role="group" aria-labelledby="h-api"><button type="button" data-a="debut" aria-pressed="true">le début du pas</button><button type="button" data-a="fin" aria-pressed="false">la fin du pas</button></div></div>
      <div class="stack" style="gap:6px"><span class="eyebrow" id="h-lec">Le logiciel suppose…</span><div class="segmented" role="group" aria-labelledby="h-lec"><button type="button" data-l="debut" aria-pressed="true">le début du pas</button><button type="button" data-l="fin" aria-pressed="false">la fin du pas</button></div></div>
    </div>
    <div id="h-res" aria-live="polite" class="stack" style="gap:12px"></div>`;
  function c() {
    const o = anneeDeReference();
    const d = o.jours.find((h) => h.iso === "2026-01-31");
    const u = o.jours.find((h) => h.iso === "2026-02-01");
    const l = [
      {
        jour: "2026-01-31",
        slot: 142,
        kw: d.elec[142],
      },
      {
        jour: "2026-01-31",
        slot: 143,
        kw: d.elec[143],
      },
      {
        jour: "2026-02-01",
        slot: 0,
        kw: u.elec[0],
      },
      {
        jour: "2026-02-01",
        slot: 1,
        kw: u.elec[1],
      },
    ];
    const s = (h) =>
      t === "debut"
        ? {
            jour: h.jour,
            h: heureDuPas(h.slot),
          }
        : h.slot === 143
          ? {
              jour: "2026-02-01",
              h: "00:00",
            }
          : {
              jour: h.jour,
              h: heureDuPas(h.slot + 1),
            };
    const r = (h) =>
      a === "debut" ? h.jour : h.h === "00:00" && h.jour === "2026-02-01" ? "2026-01-31" : h.jour;
    const i = t === a;
    const p = l.map((h) => {
      const x = s(h);
      const v = r(x);
      return {
        ...h,
        et: x,
        r: v,
        faux: v !== h.jour,
      };
    });
    const m = d.elec.reduce((h, x) => h + x, 0) / 6;
    const f = p.find((h) => h.faux);
    un("#h-res", zone).innerHTML = `
      <div class="table-wrap"><table><thead><tr><th>Mesure réelle</th><th>Étiquette envoyée</th><th>Rattachée par le logiciel au</th><th class="r">kW</th></tr></thead><tbody>
      ${p.map((h) => `<tr class="${h.faux ? "grave" : ""}"><td class="mono">${dateCourte(h.jour)} ${heureDuPas(h.slot)}–${h.slot === 143 ? "24:00" : heureDuPas(h.slot + 1)}</td><td class="mono">${dateCourte(h.et.jour)} ${h.et.h}</td><td>${dateCourte(h.r)} ${h.faux ? `<span class="badge bad">${icone("alerte")} mauvais jour</span>` : ""}</td><td class="r mono">${nombre(h.kw, 2)}</td></tr>`).join("")}
      </tbody></table></div>
      <p class="feedback ${i ? "ok" : "bad"}">${icone(i ? "ok" : "alerte")}<span>${texteRiche(i ? "Les deux conventions concordent : chaque mesure est rattachée au bon jour. Pour s’en assurer, il faut que la documentation de l’API dise clairement si l’horodatage marque le début ou la fin du pas." : `Conventions différentes : un pas de 10 minutes (${nombre(f.kw / 6, 1)} kWh) change de jour, et ici même de mois, sur un total journalier de ${nombre(m)} kWh. C’est peu en énergie, mais tous les pics sont décalés de 10 minutes. Avec des données journalières, ce serait une journée entière de décalage.`)}</span></p>
      <p class="note">${icone("info")}<span>Côté gaz, attention aussi à la journée gazière, qui court en général de 6 h à 6 h le lendemain, et non de minuit à minuit.</span></p>`;
  }
  tous("[data-a]", zone).forEach((o) =>
    o.addEventListener("click", () => {
      t = o.dataset.a;
      tous("[data-a]", zone).forEach((d) => d.setAttribute("aria-pressed", d === o));
      options.toucher();
      c();
    }),
  );
  tous("[data-l]", zone).forEach((o) =>
    o.addEventListener("click", () => {
      a = o.dataset.l;
      tous("[data-l]", zone).forEach((d) => d.setAttribute("aria-pressed", d === o));
      options.toucher();
      c();
    }),
  );
  c();
}
