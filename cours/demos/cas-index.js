/**
 * Démo « casIndex » (niveaux Comprendre / Approfondir).
 */
import { icone } from "../blocs/icones.js";
import { echapper, nombre, tous, un } from "../blocs/outils.js";
import { POSTES_HORAIRES, indexMensuels } from "../modele/releves.js";
import { anneeAvecDerives } from "../modele/simulation.js";

const CAS_INDEX = [
  {
    titre: "Plusieurs cadrans",
    unite: "kWh",
    build: () => {
      const e = indexMensuels(anneeAvecDerives(), {});
      const n = e.find((o) => o.date === "2026-01-01").elec;
      const t = e.find((o) => o.date === "2026-02-01").elec;
      const a = POSTES_HORAIRES.map((o) => [o, n[o], t[o]]);
      const c = POSTES_HORAIRES.reduce((o, d) => o + t[d] - n[d], 0);
      return {
        lignes: a,
        entetes: ["Cadran", "1er janv.", "1er févr."],
        bonne: c,
        naif: t.HPH - n.HPH,
        naifTxt: "Ne regarder que le cadran HPH",
        explication: `Il faut additionner les différences de tous les cadrans : ${POSTES_HORAIRES.map((o) => `${o} ${nombre(t[o] - n[o])}`).join(" + ")}. En janvier (saison haute), HPB et HCB ne bougent pas.`,
      };
    },
  },
  {
    titre: "Bouclage",
    unite: "m³",
    build: () => ({
      lignes: [["Gaz (5 chiffres)", 99850, 420]],
      entetes: ["Compteur", "1er mars", "1er avril"],
      bonne: 570,
      naif: -99430,
      naifTxt: "Fin − début",
      explication: "Le compteur est passé par 99 999 puis 00 000 : (100 000 − 99 850) + 420 = 570 m³.",
    }),
  },
  {
    titre: "Changement de compteur",
    unite: "m³",
    build: () => ({
      lignes: [
        ["Ancien compteur", 48454, "50 100 (dépose le 15)"],
        ["Nouveau compteur", "0 (pose le 15)", 1950],
      ],
      entetes: ["Compteur", "Début", "Fin"],
      bonne: 3596,
      naif: -46504,
      naifTxt: "Index nouveau − index ancien",
      explication:
        "On additionne ce que chaque compteur a mesuré : (50 100 − 48 454) + (1 950 − 0) = 1 646 + 1 950 = 3 596 m³.",
    }),
  },
  {
    titre: "Index estimé puis réel",
    unite: "m³",
    build: () => ({
      lignes: [
        ["Gaz", "1er janv. : 48 454 (réel)", "1er févr. : 50 850 (estimé)"],
        ["Gaz", "1er févr. : 50 850 (estimé)", "1er mars : 55 602 (réel)"],
      ],
      entetes: ["Compteur", "Début", "Fin"],
      bonne: 7148,
      naif: 2396,
      naifTxt: "Garder janvier = 50 850 − 48 454",
      question: "Consommation réelle de janvier et février cumulés ?",
      explication:
        "Seuls les relevés réels comptent : 55 602 − 48 454 = 7 148 m³. Janvier seul avait été estimé à 2 396 m³ ; sa vraie valeur (3 852 m³) n’est connue qu’après coup, donc un bilan de janvier peut changer.",
    }),
  },
];

export function demoCasIndex(zone, options) {
  let t = 0;
  const a = {};
  zone.innerHTML = `<div class="row" role="group" aria-label="Cas">${CAS_INDEX.map((o, d) => `<button type="button" class="btn" data-k="${d}" aria-pressed="${d === 0}">${d + 1}. ${echapper(o.titre)}</button>`).join("")}</div><div id="ci-cas" class="stack" style="gap:12px"></div>`;
  function c() {
    const o = CAS_INDEX[t];
    const d = o.build();
    const u = a[t];
    const l = (s) => (typeof s == "number" ? nombre(s) : echapper(s));
    un("#ci-cas", zone).innerHTML = `
      <div class="table-wrap"><table><thead><tr>${d.entetes.map((s) => `<th>${s}</th>`).join("")}</tr></thead><tbody>${d.lignes.map((s) => `<tr>${s.map((r, i) => `<td class="${i ? "r mono" : ""}">${l(r)}</td>`).join("")}</tr>`).join("")}</tbody></table></div>
      <form class="saisie" id="ci-form"><label for="ci-in"><b>${echapper(d.question || "Consommation de la période ?")}</b></label><input id="ci-in" type="number" inputmode="numeric" value="${u ?? ""}"><span>${o.unite}</span><button type="submit" class="btn data">Vérifier</button></form>
      <div id="ci-res" aria-live="polite">${
        u == null
          ? ""
          : `
        <div class="feedback ${Math.abs(u - d.bonne) <= 1 ? "ok" : "bad"}">${icone(Math.abs(u - d.bonne) <= 1 ? "ok" : "alerte")}<div><b>${Math.abs(u - d.bonne) <= 1 ? "Juste !" : `Réponse attendue : ${nombre(d.bonne)} ${o.unite}.`}</b> ${echapper(d.explication)}
        <p style="margin-top:6px" class="muted">Calcul naïf (${echapper(d.naifTxt)}) : ${nombre(d.naif)} ${o.unite}${d.naif < 0 ? " : une consommation négative, qui aurait dû déclencher une alerte." : "."}</p></div></div>`
      }</div>`;
    un("#ci-form", zone).addEventListener("submit", (s) => {
      s.preventDefault();
      const r = parseFloat(un("#ci-in", zone).value.replace(",", "."));
      if (!Number.isNaN(r)) {
        a[t] = r;
        options.toucher();
        c();
      }
    });
  }
  tous("[data-k]", zone).forEach((o) =>
    o.addEventListener("click", () => {
      t = +o.dataset.k;
      tous("[data-k]", zone).forEach((d) => d.setAttribute("aria-pressed", d === o));
      c();
    }),
  );
  c();
}
