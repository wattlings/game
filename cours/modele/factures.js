/**
 * Le calcul des factures mensuelles d'électricité et de gaz de l'école.
 */
import { TARIF_ELEC, TARIF_GAZ } from "../../commun/donnees/references.js";
import { POSTES_HORAIRES, posteHoraire } from "./releves.js";
import { PAS_PAR_JOUR } from "./simulation.js";

function periodesDeFacturation() {
  const e = [];
  for (let n = 0; n < 12; n++) {
    const t = new Date(Date.UTC(2025, 8 + n, 14)).toISOString().slice(0, 10);
    const a = new Date(Date.UTC(2025, 9 + n, 13)).toISOString().slice(0, 10);
    e.push({
      debut: t,
      fin: a,
    });
  }
  return e;
}

const arrondiCentime = (e) => Math.round(e * 100) / 100;

export function factures(annee) {
  const n = periodesDeFacturation();
  const t = [];
  const a = [];
  let c = 0;
  n.forEach((o, d) => {
    const u = annee.jours.filter((k) => k.iso >= o.debut && k.iso <= o.fin);
    const l = u.length;
    const s = l / 30.4;
    const r = {
      HPH: 0,
      HCH: 0,
      HPB: 0,
      HCB: 0,
    };
    let i = 0;
    let p = 0;
    for (const k of u) {
      for (let L = 0; L < PAS_PAR_JOUR; L++) {
        r[posteHoraire(k.iso, L, k.dow)] += k.elec[L] / 6;
        const D = k.elec[L] / TARIF_ELEC.cosPhi;
        p = Math.max(p, D);
        if (D > TARIF_ELEC.puissanceSouscriteKva) {
          i += (D - TARIF_ELEC.puissanceSouscriteKva) ** 2;
        }
      }
    }
    const m = POSTES_HORAIRES.reduce((k, L) => k + r[L], 0);
    const f =
      (TARIF_ELEC.turpeFixeMois + (TARIF_ELEC.turpePuissanceKvaAn * TARIF_ELEC.puissanceSouscriteKva) / 12) *
      s;
    const h = [
      {
        cle: "abonnement",
        libelle: "Abonnement (fournisseur)",
        montant: arrondiCentime(TARIF_ELEC.abonnementMois * s),
      },
      ...POSTES_HORAIRES.filter((k) => r[k] > 0.5).map((k) => ({
        cle: "fourniture",
        libelle: `Fourniture ${k}`,
        detail: `${Math.round(r[k]).toLocaleString("fr-FR")} kWh × ${TARIF_ELEC.fourniture[k].toFixed(3).replace(".", ",")} €`,
        montant: arrondiCentime(r[k] * TARIF_ELEC.fourniture[k]),
      })),
      {
        cle: "acheminement",
        libelle: "Acheminement (TURPE), part fixe et puissance",
        montant: arrondiCentime(f),
      },
      {
        cle: "acheminement",
        libelle: "Acheminement (TURPE), part énergie",
        montant: arrondiCentime(POSTES_HORAIRES.reduce((k, L) => k + r[L] * TARIF_ELEC.turpeEnergie[L], 0)),
      },
    ];
    if (i > 0) {
      h.push({
        cle: "depassement",
        libelle: "Pénalité de dépassement de puissance",
        detail: `Puissance max. atteinte : ${Math.round(p)} kVA`,
        montant: arrondiCentime(TARIF_ELEC.penaliteDepassement * Math.sqrt(i)),
      });
    }
    h.push(
      {
        cle: "accise",
        libelle: "Accise sur l'électricité",
        detail: `${Math.round(m).toLocaleString("fr-FR")} kWh × ${TARIF_ELEC.acciseMWh} €/MWh`,
        montant: arrondiCentime((m / 1000) * TARIF_ELEC.acciseMWh),
      },
      {
        cle: "cta",
        libelle: "Contribution tarifaire d'acheminement (CTA)",
        montant: arrondiCentime(f * TARIF_ELEC.ctaTaux),
      },
    );
    const x = arrondiCentime(h.reduce((k, L) => k + L.montant, 0));
    t.push({
      n: d + 1,
      ...o,
      nbJ: l,
      kwh: r,
      total: Math.round(m),
      pmaxKva: Math.round(p),
      lignes: h,
      ht: x,
      tva: arrondiCentime(x * TARIF_ELEC.tva),
      ttc: arrondiCentime(x * (1 + TARIF_ELEC.tva)),
      estimee: false,
    });
    const v = u.reduce((k, L) => k + L.gazKwh, 0);
    let j = v;
    const w = d === 4;
    if (w) {
      j = Math.round(v * 0.7);
      c = v - j;
    }
    const $ = TARIF_GAZ.distributionFixeMois * s;
    const T = [
      {
        cle: "abonnement",
        libelle: "Abonnement (fournisseur)",
        montant: arrondiCentime(TARIF_GAZ.abonnementMois * s),
      },
      {
        cle: "fourniture",
        libelle: w ? "Fourniture (consommation estimée)" : "Fourniture",
        detail: `${Math.round(j).toLocaleString("fr-FR")} kWh × ${TARIF_GAZ.fournitureKwh.toFixed(3).replace(".", ",")} €`,
        montant: arrondiCentime(j * TARIF_GAZ.fournitureKwh),
      },
    ];
    if (d === 5 && c) {
      T.push({
        cle: "regularisation",
        libelle: "Régularisation de la période précédente",
        detail: `+${Math.round(c).toLocaleString("fr-FR")} kWh`,
        montant: arrondiCentime(
          c *
            (TARIF_GAZ.fournitureKwh +
              TARIF_GAZ.distributionKwh +
              TARIF_GAZ.transportKwh +
              TARIF_GAZ.acciseKwh),
        ),
      });
    }
    T.push(
      {
        cle: "acheminement",
        libelle: "Acheminement distribution (ATRD), part fixe",
        montant: arrondiCentime($),
      },
      {
        cle: "acheminement",
        libelle: "Acheminement distribution et transport, part variable",
        montant: arrondiCentime(j * (TARIF_GAZ.distributionKwh + TARIF_GAZ.transportKwh)),
      },
      {
        cle: "accise",
        libelle: "Accise sur le gaz naturel",
        montant: arrondiCentime(j * TARIF_GAZ.acciseKwh),
      },
      {
        cle: "cta",
        libelle: "Contribution tarifaire d'acheminement (CTA)",
        montant: arrondiCentime($ * TARIF_GAZ.ctaTaux),
      },
    );
    const q = arrondiCentime(T.reduce((k, L) => k + L.montant, 0));
    const y = u.reduce((k, L) => k + L.gazM3, 0);
    a.push({
      n: d + 1,
      ...o,
      nbJ: l,
      kwh: Math.round(j),
      kwhReel: Math.round(v),
      m3: Math.round(y),
      lignes: T,
      ht: q,
      tva: arrondiCentime(q * TARIF_GAZ.tva),
      ttc: arrondiCentime(q * (1 + TARIF_GAZ.tva)),
      estimee: w,
    });
  });
  return {
    elec: t,
    gaz: a,
  };
}
