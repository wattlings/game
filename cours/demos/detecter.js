/**
 * Démo de l'étape 6 : activer des dérives et les repérer.
 */
import { TARIF_ELEC } from "../../commun/donnees/references.js";
import { graphique } from "../blocs/graphique.js";
import { icone } from "../blocs/icones.js";
import { echapper, euros, interrupteur, nombre, texteRiche, tous, un } from "../blocs/outils.js";
import { magasin } from "../coquille/etat.js";
import { MOIS } from "../modele/calendrier.js";
import { factures } from "../modele/factures.js";
import { DERIVES } from "../modele/releves.js";
import { anneeAvecDerives, anneeCivile, anneeDeReference, kwhElecDuJour } from "../modele/simulation.js";

function totauxMensuels(jours, energie) {
  const t = new Map();
  for (const a of jours) {
    const c = a.iso.slice(0, 7);
    t.set(c, (t.get(c) || 0) + (energie === "elec" ? kwhElecDuJour(a) : a.gazKwh));
  }
  return [...t.entries()];
}

export function demoDetecter(zone, options) {
  let t = null;
  let a = null;
  zone.innerHTML = `
    <div class="switch-list">${Object.entries(DERIVES)
      .map(([d, u]) => interrupteur(`dt-${d}`, u.libelle, u.aide, magasin.get().derives?.[d]))
      .join("")}</div>
    <div class="kpis" id="d-kpis"></div>
    <div class="grid-2">
      <div class="stack" style="gap:4px"><h3 style="font-size:var(--t-m)">Électricité par mois</h3><div id="d-ge"></div></div>
      <div class="stack" style="gap:4px"><h3 style="font-size:var(--t-m)">Gaz par mois</h3><div id="d-gg"></div></div>
    </div>
    <div id="d-msg" aria-live="polite"></div>
    <p class="note">${icone("info")}<span>Ces dérives s’appliquent aussi aux autres démos et à la page de l’école. Pense à les couper ensuite.</span></p>`;
  function c(d, u, l) {
    const s = l === "elec" ? "var(--data)" : "var(--energie)";
    return {
      hauteur: 200,
      description: `Consommation mensuelle de ${l === "elec" ? "l’électricité" : "gaz"} comparée à la référence`,
      marge: {
        g: 50,
      },
      x: {
        n: d.length,
        ticks: d.map(([r], i) => ({
          i,
          texte: MOIS[+r.slice(5) - 1].slice(0, 1).toUpperCase(),
        })),
        label: (r) => `${MOIS[+d[r][0].slice(5) - 1]} ${d[r][0].slice(0, 4)}`,
        espace: 14,
      },
      y: {
        unite: "kWh",
        format: (r) => `${nombre(r)} kWh`,
      },
      series: [
        {
          nom: "Réel",
          type: "barres",
          couleur: (r, i) => (i > d[r][1] * 1.03 ? "var(--bad)" : s),
          couleurLegende: s,
          valeurs: u.map((r) => r[1]),
        },
        {
          nom: "Référence",
          couleur: "var(--ink)",
          tirets: true,
          valeurs: d.map((r) => r[1]),
        },
      ],
      legendeExtra: '<span><i class="bar" style="background:var(--bad)"></i>au-dessus de la référence</span>',
    };
  }
  function o() {
    const d = anneeDeReference();
    const u = anneeAvecDerives();
    const l = anneeCivile(d);
    const s = anneeCivile(u);
    const r = totauxMensuels(l, "elec");
    const i = totauxMensuels(s, "elec");
    const p = totauxMensuels(l, "gaz");
    const m = totauxMensuels(s, "gaz");
    if (t) {
      t.maj(c(r, i, "elec"));
    } else {
      t = graphique(un("#d-ge", zone), c(r, i, "elec"));
    }
    if (a) {
      a.maj(c(p, m, "gaz"));
    } else {
      a = graphique(un("#d-gg", zone), c(p, m, "gaz"));
    }
    const f = i.reduce((k, L) => k + L[1], 0) - r.reduce((k, L) => k + L[1], 0);
    const h = m.reduce((k, L) => k + L[1], 0) - p.reduce((k, L) => k + L[1], 0);
    const x = factures(d);
    const v = factures(u);
    const j = (k) => [...k.elec, ...k.gaz].reduce((L, D) => L + D.ttc, 0);
    const w = j(v) - j(x);
    const $ = v.elec
      .flatMap((k) => k.lignes)
      .filter((k) => k.cle === "depassement")
      .reduce((k, L) => k + L.montant, 0);
    let T = 0;
    s.forEach((k) =>
      k.elec.forEach((L) => {
        if (L > T) {
          T = L;
        }
      }),
    );
    const q = T / TARIF_ELEC.cosPhi;
    un("#d-kpis", zone).innerHTML = `
      <div class="kpi ${f > 1 ? "bad" : ""}"><span class="v">+${nombre(Math.max(0, f))} kWh</span><span class="l">d’électricité en trop sur l’année</span></div>
      <div class="kpi ${h > 1 ? "bad" : ""}"><span class="v">+${nombre(Math.max(0, h))} kWh</span><span class="l">de gaz en trop sur l’année</span></div>
      <div class="kpi ${w > 1 ? "bad" : ""}"><span class="v">+${euros(Math.max(0, w))}</span><span class="l">de surcoût TTC (fictif)</span></div>
      <div class="kpi ${q > 60 ? "bad" : ""}"><span class="v">${nombre(q)} kVA</span><span class="l">puissance max. (souscrit : 60)</span></div>`;
    const y = Object.entries(magasin.get().derives || {})
      .filter(([, k]) => k)
      .map(([k]) => DERIVES[k].libelle);
    un("#d-msg", zone).innerHTML = y.length
      ? `<div class="feedback bad">${icone("alerte")}<div><b>${y.length} dérive${y.length > 1 ? "s" : ""} détectée${y.length > 1 ? "s" : ""} :</b> ${echapper(y.join(", "))}. ${texteRiche(`Les mois en rouge dépassent la {{baseline}} de plus de 3 %.${$ > 0 ? ` Le {{depassement}} de puissance coûte à lui seul ${euros($)} HT de pénalités.` : ""}`)}</div></div>`
      : `<div class="feedback info">${icone("info")}<div>${texteRiche("Aucune dérive : le réel colle à la {{baseline}}. Active un scénario pour voir ce que l’outil repère.")}</div></div>`;
  }
  tous('input[type="checkbox"]', zone).forEach((d) =>
    d.addEventListener("change", () => {
      options.toucher();
      magasin.set({
        derives: {
          ...magasin.get().derives,
          [d.id.slice(3)]: d.checked,
        },
      });
      o();
    }),
  );
  o();
  return () => {
    t?.detruire();
    a?.detruire();
  };
}
