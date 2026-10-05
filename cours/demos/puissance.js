/**
 * Démo « puissance » (niveaux Comprendre / Approfondir).
 */
import { TARIF_ELEC } from "../../commun/donnees/references.js";
import { graphique } from "../blocs/graphique.js";
import { icone } from "../blocs/icones.js";
import { euros, interrupteur, nombre, texteRiche, un } from "../blocs/outils.js";
import { magasin } from "../coquille/etat.js";
import { MOIS, MOIS_COURTS } from "../modele/calendrier.js";
import { anneeAvecDerives, anneeCivile } from "../modele/simulation.js";

export function demoPuissance(zone, options) {
  let t = 60;
  let a = null;
  zone.innerHTML = `<div class="grid-2"><div class="field"><label for="pw-ps">Puissance souscrite : <span id="pw-ps-txt" class="num"></span></label><input type="range" id="pw-ps" min="36" max="100" step="1" value="${t}"></div>
    <div>${interrupteur("pw-der", "Radiateurs d’appoint en janvier", "Dérive « dépassement de puissance »", magasin.get().derives?.depassement)}</div></div>
    <div id="pw-g"></div><div class="kpis" id="pw-kpis"></div><div id="pw-msg" aria-live="polite"></div>`;
  function c(d, u) {
    let l = 0;
    const s = new Map();
    for (const r of d) {
      for (const i of r.elec) {
        const p = i / TARIF_ELEC.cosPhi;
        if (p > u) {
          const m = r.iso.slice(0, 7);
          s.set(m, (s.get(m) || 0) + (p - u) ** 2);
        }
      }
    }
    for (const r of s.values()) {
      l += TARIF_ELEC.penaliteDepassement * Math.sqrt(r);
    }
    return {
      fixe: u * TARIF_ELEC.turpePuissanceKvaAn,
      pen: l,
      total: u * TARIF_ELEC.turpePuissanceKvaAn + l,
    };
  }
  function o() {
    const d = anneeCivile(anneeAvecDerives());
    const u = [];
    for (const x of d) {
      const v = x.iso.slice(0, 7);
      let j = u.find((w) => w.k === v);
      if (!j) {
        j = {
          k: v,
          max: 0,
        };
        u.push(j);
      }
      for (const w of x.elec) {
        j.max = Math.max(j.max, w / TARIF_ELEC.cosPhi);
      }
    }
    const l = Math.max(...u.map((x) => x.max));
    const s = c(d, t);
    let r = 36;
    let i = Infinity;
    for (let x = 36; x <= 100; x++) {
      const v = c(d, x).total;
      if (v < i) {
        i = v;
        r = x;
      }
    }
    un("#pw-ps-txt", zone).textContent = `${t} kVA`;
    const p = {
      hauteur: 220,
      description: "Puissance maximale atteinte chaque mois comparée à la puissance souscrite",
      marge: {
        g: 46,
      },
      x: {
        n: 12,
        ticks: u.map((x, v) => ({
          i: v,
          texte: MOIS_COURTS[+x.k.slice(5) - 1],
        })),
        label: (x) => MOIS[+u[x].k.slice(5) - 1],
        espace: 26,
      },
      y: {
        unite: "kVA",
        max: 100,
        format: (x) => `${nombre(x)} kVA`,
      },
      series: [
        {
          nom: "Puissance max. du mois",
          type: "barres",
          couleur: (x, v) => (v > t ? "var(--bad)" : "var(--energie)"),
          couleurLegende: "var(--energie)",
          valeurs: u.map((x) => x.max),
        },
      ],
      lignesH: [
        {
          y: t,
          texte: `souscrit : ${t} kVA`,
          couleur: "var(--ink)",
        },
      ],
    };
    if (a) {
      a.maj(p);
    } else {
      a = graphique(un("#pw-g", zone), p);
    }
    un("#pw-kpis", zone).innerHTML = `
      <div class="kpi"><span class="v">${nombre(l)} kVA</span><span class="l">pointe de l’année</span></div>
      <div class="kpi"><span class="v">${euros(s.fixe)}</span><span class="l">part puissance de l’acheminement / an (fictif)</span></div>
      <div class="kpi ${s.pen > 0 ? "bad" : ""}"><span class="v">${euros(s.pen)}</span><span class="l">pénalités de dépassement / an (calcul simplifié)</span></div>
      <div class="kpi ok"><span class="v">${r} kVA</span><span class="l">puissance la moins chère (${euros(i)} / an)</span></div>`;
    const m = t - l;
    let f;
    let h;
    if (s.pen > 0) {
      f = `**Dépassement** : la pointe (${nombre(l)} kVA) dépasse les ${t} kVA souscrits. En C4, chaque dépassement est facturé ; jusqu’à 36 kVA, le compteur couperait.`;
      h = "bad";
    } else if (m > 15) {
      f = `**Sur-souscription** : ${nombre(m)} kVA de marge jamais utilisés, payés ${euros(m * TARIF_ELEC.turpePuissanceKvaAn)} par an pour rien.`;
      h = "info";
    } else {
      f = `Réglage serré : ${nombre(m)} kVA de marge au-dessus de la pointe. Attention aux hivers plus froids ou à un nouvel équipement.`;
      h = "ok";
    }
    un("#pw-msg", zone).innerHTML =
      `<div class="feedback ${h}">${icone(h === "ok" ? "ok" : h === "bad" ? "alerte" : "info")}<div>${texteRiche(f)} ${texteRiche("On cherche la {{puissance-souscrite}} qui minimise « abonnement + pénalités », en gardant une marge de sécurité.")}</div></div>`;
  }
  un("#pw-ps", zone).addEventListener("input", (d) => {
    t = +d.target.value;
    options.toucher();
    o();
  });
  un("#pw-der", zone).addEventListener("change", (d) => {
    magasin.set({
      derives: {
        ...magasin.get().derives,
        depassement: d.target.checked,
      },
    });
    options.toucher();
    o();
  });
  o();
  return () => a?.detruire();
}
