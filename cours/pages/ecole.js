/**
 * La page « L'école Jean-Jaurès » : fiche, calendrier, consommations, réglages des dérives.
 */
import { ECOLE } from "../../commun/donnees/ecole.js";
import { NOTE_TARIFS, TARIF_ELEC, TARIF_GAZ } from "../../commun/donnees/references.js";
import { graphique } from "../blocs/graphique.js";
import { icone } from "../blocs/icones.js";
import { echapper, euros, interrupteur, nombre, texteRiche, tous, un } from "../blocs/outils.js";
import { magasin } from "../coquille/etat.js";
import { MOIS, MOIS_COURTS, VACANCES, dateCourte } from "../modele/calendrier.js";
import { factures } from "../modele/factures.js";
import { ANOMALIES, DERIVES } from "../modele/releves.js";
import {
  anneeAvecDerives,
  anneeCivile,
  anneeDeReference,
  kwhElecDuJour,
  totalElec,
  totalGaz,
} from "../modele/simulation.js";
import { vignetteEcole } from "../schemas/vignette-ecole.js";

function totauxParMois(jours) {
  const n = new Map();
  for (const t of jours) {
    const a = t.iso.slice(0, 7);
    const c = n.get(a) || {
      elec: 0,
      gaz: 0,
    };
    c.elec += kwhElecDuJour(t);
    c.gaz += t.gazKwh;
    n.set(a, c);
  }
  return [...n.entries()].map(([t, a]) => ({
    mois: t,
    ...a,
  }));
}

/** Affiche la page de l'école dans `conteneur`. */
export function pageEcole(conteneur) {
  const n = magasin.get();
  conteneur.innerHTML = `
  <div class="stack" style="gap:32px">
    <section class="ecole-card">
      ${vignetteEcole()}
      <div class="stack" style="gap:12px">
        <span class="eyebrow">Bâtiment fil rouge · valeurs fictives</span>
        <h1>${ECOLE.nom}</h1>
        <p class="prose">${texteRiche(`Une école élémentaire de ${nombre(ECOLE.surface)} m² et ${ECOLE.eleves} élèves, ouverte le lundi, mardi, jeudi et vendredi de 8 h 30 à 16 h 30 et le mercredi matin. L’électricité passe par un compteur {{c4|C4}} télérelevé au pas de 10 minutes (60 {{kva}}, 4 postes). Le gaz alimente la chaudière et la cuisine, et passe par un compteur {{gazpar}}.`)}</p>
        <div class="row"><span class="badge data">${icone("prise")} PDL ${ECOLE.pdl}</span><span class="badge energie">${icone("flamme")} PCE ${ECOLE.pce}</span></div>
      </div>
    </section>

    <section class="stack">
      <div class="kpis" id="kpis"></div>
      <div class="card stack" style="gap:8px">
        <h2 style="font-size:var(--t-l)">Consommation mois par mois</h2>
        <p class="muted" style="font-size:var(--t-s)">Électricité et gaz, en kWh, de septembre 2025 à août 2026. Le gaz explose l’hiver (chauffage) ; l’électricité suit surtout l’occupation.</p>
        <div id="g-mensuel"></div>
      </div>
    </section>

    <section class="card stack">
      <div class="stack" style="gap:6px"><span class="eyebrow">Laboratoire</span><h2>Abîme les données, fais dériver l’école</h2>
      <p class="prose muted">Ces interrupteurs s’appliquent à toutes les démos du site. Les <b>anomalies de données</b> abîment la mesure (la consommation réelle ne change pas). Les <b>dérives énergétiques</b> changent la consommation réelle.</p></div>
      <div class="grid-2">
        <fieldset class="stack" style="gap:12px;border:0;padding:0;margin:0">
          <legend class="badge data" style="margin-bottom:10px">${icone("data")} Anomalies de données</legend>
          <div class="stack" style="gap:12px">${Object.entries(ANOMALIES)
            .map(([c, o]) => interrupteur(`an-${c}`, o.libelle, o.aide, n.anomalies?.[c]))
            .join("")}</div>
        </fieldset>
        <fieldset class="stack" style="gap:12px;border:0;padding:0;margin:0">
          <legend class="badge energie" style="margin-bottom:10px">${icone("energie")} Dérives énergétiques</legend>
          <div class="stack" style="gap:12px">${Object.entries(DERIVES)
            .map(([c, o]) => interrupteur(`de-${c}`, o.libelle, o.aide, n.derives?.[c]))
            .join("")}</div>
        </fieldset>
      </div>
      <p class="note">${icone("info")}<span>Où les voir : trous, doublons, valeurs aberrantes et changement d’heure dans l’étape 3 ; index et factures dans l’étape 2 ; dérives dans l’étape 6.</span></p>
    </section>

    <section class="grid-2">
      <div class="card stack" style="gap:10px">
        <h2 style="font-size:var(--t-l)">Calendrier 2025-2026, zone C</h2>
        <div class="table-wrap"><table><thead><tr><th>Vacances</th><th>Du</th><th>Reprise</th></tr></thead><tbody>
          ${VACANCES.map((c) => `<tr><td>${echapper(c.nom)}</td><td>${dateCourte(c.debut)}</td><td>${dateCourte(c.reprise)}</td></tr>`).join("")}
        </tbody></table></div>
        <p class="note">${icone("info")}<span>Changements d’heure : 26 octobre 2025 (journée de 25 h) et 29 mars 2026 (journée de 23 h). Calendrier officiel à revérifier chaque année.</span></p>
      </div>
      <div class="card stack" style="gap:10px">
        <h2 style="font-size:var(--t-l)">Hypothèses tarifaires</h2>
        <div class="table-wrap"><table><thead><tr><th>Poste</th><th class="r">Électricité</th><th class="r">Gaz</th></tr></thead><tbody>
          <tr><td>Abonnement</td><td class="r">${TARIF_ELEC.abonnementMois} €/mois</td><td class="r">${TARIF_GAZ.abonnementMois} €/mois</td></tr>
          <tr><td>Fourniture</td><td class="r">${nombre(TARIF_ELEC.fourniture.HCB, 3)} à ${nombre(TARIF_ELEC.fourniture.HPH, 3)} €/kWh</td><td class="r">${nombre(TARIF_GAZ.fournitureKwh, 3)} €/kWh</td></tr>
          <tr><td>Accise</td><td class="r">${TARIF_ELEC.acciseMWh} €/MWh</td><td class="r">${nombre(TARIF_GAZ.acciseKwh * 1000, 1)} €/MWh</td></tr>
          <tr><td>CTA</td><td class="r">${nombre(TARIF_ELEC.ctaTaux * 100, 2)} %</td><td class="r">${nombre(TARIF_GAZ.ctaTaux * 100, 2)} %</td></tr>
          <tr><td>TVA</td><td class="r">20 %</td><td class="r">20 %</td></tr>
        </tbody></table></div>
        <p class="note">${icone("alerte")}<span>${echapper(NOTE_TARIFS)}. Ce ne sont pas les tarifs officiels : l’accise, la CTA et le TURPE changent au moins une fois par an.</span></p>
      </div>
    </section>
  </div>`;
  let t = null;
  function a() {
    const c = anneeAvecDerives();
    const o = anneeDeReference();
    const d = anneeCivile(c);
    const u = totalElec(d);
    const l = totalGaz(d);
    const s = totalElec(anneeCivile(o));
    const r = totalGaz(anneeCivile(o));
    const i = factures(c);
    const p = [...i.elec, ...i.gaz].reduce((v, j) => v + j.ttc, 0);
    let m = 0;
    d.forEach((v) =>
      v.elec.forEach((j) => {
        if (j > m) {
          m = j;
        }
      }),
    );
    const f = (v, j) =>
      Math.abs(v - j) > 1 ? ` <span style="color:var(--bad)">(+${nombre(((v - j) / j) * 100)} %)</span>` : "";
    un("#kpis", conteneur).innerHTML = `
      <div class="kpi data"><span class="v">${nombre(u / 1000, 1)} MWh</span><span class="l">électricité / an${f(u, s)}</span></div>
      <div class="kpi energie"><span class="v">${nombre(l / 1000, 1)} MWh</span><span class="l">gaz / an${f(l, r)}</span></div>
      <div class="kpi"><span class="v">${nombre((u + l) / ECOLE.surface)}</span><span class="l">kWh/m² tous usages</span></div>
      <div class="kpi"><span class="v">${nombre(m / TARIF_ELEC.cosPhi)} kVA</span><span class="l">puissance max. atteinte (souscrit : 60)</span></div>
      <div class="kpi"><span class="v">${euros(p)}</span><span class="l">factures TTC sur 12 périodes</span></div>`;
    const h = totauxParMois(d);
    const x = {
      hauteur: 260,
      description: "Consommation mensuelle d’électricité et de gaz de l’école en kWh",
      x: {
        n: h.length,
        ticks: h.map((v, j) => ({
          i: j,
          texte: MOIS_COURTS[+v.mois.slice(5) - 1],
        })),
        label: (v) => `${MOIS[+h[v].mois.slice(5) - 1]} ${h[v].mois.slice(0, 4)}`,
        espace: 20,
      },
      y: {
        unite: "kWh",
        format: (v) => `${nombre(v)} kWh`,
      },
      series: [
        {
          nom: "Électricité",
          type: "barres",
          couleur: "var(--data)",
          valeurs: h.map((v) => v.elec),
        },
        {
          nom: "Gaz",
          type: "barres",
          couleur: "var(--energie)",
          valeurs: h.map((v) => v.gaz),
        },
      ],
    };
    if (t) {
      t.maj(x);
    } else {
      t = graphique(un("#g-mensuel", conteneur), x);
    }
  }
  a();
  tous('input[type="checkbox"]', conteneur).forEach((c) =>
    c.addEventListener("change", () => {
      const [o, d] = c.id.split("-");
      const u = o === "an" ? "anomalies" : "derives";
      magasin.set({
        [u]: {
          ...magasin.get()[u],
          [d]: c.checked,
        },
      });
      if (u === "derives") {
        a();
      }
    }),
  );
  return () => t?.detruire();
}
