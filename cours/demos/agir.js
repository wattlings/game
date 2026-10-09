/**
 * Démo de l'étape 7 : composer un plan d'action.
 */
import { FACTEURS_CO2, PRIX_KWH_ELEC, PRIX_KWH_GAZ, TARIF_ELEC } from "../../commun/donnees/references.js";
import { icone } from "../blocs/icones.js";
import { echapper, euros, nombre, texteRiche, tous, un } from "../blocs/outils.js";
import { anneeCivile, anneeDeReference, repartitionUsages, totalElec, totalGaz } from "../modele/simulation.js";

const FAMILLES_ACTIONS = [
  {
    id: "regler",
    nom: "Régler et changer les habitudes",
    sous: "sobriété",
  },
  {
    id: "contrat",
    nom: "Optimiser le contrat",
    sous: "sans toucher au bâtiment",
  },
  {
    id: "investir",
    nom: "Investir",
    sous: "efficacité et production",
  },
];

const ACTIONS = [
  {
    id: "consigne",
    f: "regler",
    nom: "Baisser la consigne de chauffage de 1 °C",
    gaz: 0.07,
    cout: 0,
    note: "environ 7 % de chauffage en moins par degré",
  },
  {
    id: "reduit",
    f: "regler",
    nom: "Programmer le chauffage réduit la nuit, le week-end et en vacances",
    gaz: 0.1,
    cout: 1500,
    note: "réglage de la régulation",
  },
  {
    id: "veilles",
    f: "regler",
    nom: "Couper les veilles et l’informatique le soir",
    elecKwh: 10950,
    cout: 800,
    note: "−1,5 kW de talon, prises programmables",
  },
  {
    id: "fourniture",
    f: "contrat",
    nom: "Renégocier le prix de la fourniture à l’échéance",
    euros: 0.08,
    cout: 0,
    note: "−8 % sur le prix du kWh, aucune énergie économisée",
  },
  {
    id: "ps",
    f: "contrat",
    nom: "Baisser la puissance souscrite de 60 à 58 kVA",
    eurosFixe: TARIF_ELEC.turpePuissanceKvaAn * 2,
    cout: 0,
    note: "gain faible, risque de dépassement l’hiver",
  },
  {
    id: "led",
    f: "investir",
    nom: "Passer l’éclairage en LED avec détection de présence",
    elecKwh: 8000,
    cout: 35000,
    note: "environ la moitié de l’éclairage",
  },
  {
    id: "combles",
    f: "investir",
    nom: "Isoler les combles",
    gaz: 0.12,
    cout: 30000,
    note: "moins de chaleur perdue par le toit",
  },
  {
    id: "chaudiere",
    f: "investir",
    nom: "Installer une chaudière à condensation",
    gaz: 0.12,
    cout: 45000,
    note: "meilleur rendement",
  },
  {
    id: "pv",
    f: "investir",
    nom: "Poser 36 kWc de panneaux solaires en autoconsommation",
    elecKwh: 21780,
    cout: 50000,
    note: "55 % de la production consommée sur place (école fermée l’été)",
  },
];

export function demoAgir(zone, options) {
  const t = anneeDeReference();
  const a = anneeCivile(t);
  const c = totalElec(a);
  const o = totalGaz(a);
  // les économies de chauffage portent sur le gaz du chauffage, pas sur celui de la cuisine (comme l'exemple chiffré)
  const og = repartitionUsages(t).gaz.chauffage;
  // arrondi à la dizaine d'euros, sauf pour les petits montants
  const arrondi = (v) => (Math.abs(v) < 100 ? Math.round(v) : Math.round(v / 10) * 10);
  const d = new Set(["consigne"]);
  const u = (r) => {
    const i = r.elecKwh || 0;
    const p = (r.gaz || 0) * og;
    return i * PRIX_KWH_ELEC + p * PRIX_KWH_GAZ + (r.euros ? r.euros * c * 0.13 : 0) + (r.eurosFixe || 0);
  };
  const l = (r) => {
    const i = u(r);
    if (r.cout === 0) {
      return "immédiat";
    } else {
      return `${nombre(r.cout / i, 1)} ans`;
    }
  };
  zone.innerHTML = `
    <div class="actions">${FAMILLES_ACTIONS.map(
      (r, i) => `
      <div role="group" aria-labelledby="ag-f-${r.id}" class="actions-groupe" style="display:contents">
      <div class="famille-titre" id="ag-f-${r.id}"><span class="n">${i + 1}</span>${echapper(r.nom)} <span class="badge neutre">${echapper(r.sous)}</span></div>
      ${ACTIONS.filter((p) => p.f === r.id)
        .map(
          (p) => `
        <label class="action" for="ac-${p.id}">
          <input type="checkbox" id="ac-${p.id}" ${d.has(p.id) ? "checked" : ""}>
          <span><b>${echapper(p.nom)}</b><br><small class="muted">${echapper(p.note)}</small></span>
          <span class="meta">${p.cout ? euros(p.cout) : "gratuit"} · ${euros(arrondi(u(p)))}/an<br>retour ${l(p)}</span>
        </label>`,
        )
        .join("")}
      </div>`,
    ).join("")}
    </div>
    <div class="kpis" id="ag-kpis"></div>
    <div id="ag-msg" aria-live="polite"></div>
    <p class="note">${icone("alerte")}<span>Valeurs fictives d’ordre de grandeur. Les économies de gaz se combinent (deux actions de 10 % donnent 19 %, pas 20 %). Prix du kWh évité : ${nombre(PRIX_KWH_ELEC, 3)} € (élec) et ${nombre(PRIX_KWH_GAZ, 3)} € (gaz) HT.</span></p>`;
  function s() {
    const r = ACTIONS.filter((w) => d.has(w.id));
    const i = r.reduce((w, $) => w * (1 - ($.gaz || 0)), 1);
    const p = og * (1 - i);
    const m = r.reduce((w, $) => w + ($.elecKwh || 0), 0);
    const f =
      m * PRIX_KWH_ELEC +
      p * PRIX_KWH_GAZ +
      r.reduce((w, $) => w + ($.euros ? $.euros * c * 0.13 : 0) + ($.eurosFixe || 0), 0);
    const h = r.reduce((w, $) => w + $.cout, 0);
    const x = (m * FACTEURS_CO2.elec + p * FACTEURS_CO2.gaz) / 1000;
    un("#ag-kpis", zone).innerHTML = `
      <div class="kpi energie"><span class="v">−${nombre(((m + p) / (c + o)) * 100)} %</span><span class="l">d’énergie (${nombre((m + p) / 1000)} MWh/an)</span></div>
      <div class="kpi ok"><span class="v">${euros(arrondi(f))}</span><span class="l">économisés par an (HT)</span></div>
      <div class="kpi"><span class="v">${euros(h)}</span><span class="l">d’investissement</span></div>
      <div class="kpi"><span class="v">${f > 0 ? (h === 0 ? "immédiat" : `${nombre(h / f, 1)} ans`) : "—"}</span><span class="l">temps de retour global</span></div>
      <div class="kpi"><span class="v">−${nombre(x, 1)} t</span><span class="l">de CO2e par an (facteurs à vérifier)</span></div>`;
    const v = new Set(r.map((w) => w.f));
    let j;
    if (r.length) {
      if (v.has("investir") && !v.has("regler")) {
        j = {
          c: "bad",
          t: "Tu investis sans avoir réglé l’existant. Les réglages sont gratuits ou presque : on commence toujours par là, sinon on paie des travaux pour chauffer un bâtiment vide.",
        };
      } else if (v.size === 3) {
        j = {
          c: "ok",
          t: "Plan complet : sobriété d’abord, contrat ensuite, investissements en dernier. C’est l’ordre recommandé.",
        };
      } else {
        j = {
          c: "info",
          t: `Retour global de ${h === 0 ? "0 an" : `${nombre(h / f, 1)} ans`}. Les actions gratuites raccourcissent le retour des investissements quand on les combine.`,
        };
      }
    } else {
      j = {
        c: "info",
        t: "Coche au moins une action pour voir son effet.",
      };
    }
    un("#ag-msg", zone).innerHTML =
      `<div class="feedback ${j.c}">${icone(j.c === "ok" ? "ok" : j.c === "bad" ? "alerte" : "info")}<div>${texteRiche(j.t)}</div></div>`;
  }
  tous(".action input", zone).forEach((r) =>
    r.addEventListener("change", () => {
      const i = r.id.slice(3);
      if (r.checked) {
        d.add(i);
      } else {
        d.delete(i);
      }
      options.toucher();
      s();
    }),
  );
  s();
}
