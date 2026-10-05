/**
 * Démo « anatomieFacture » (niveaux Comprendre / Approfondir).
 */
import { TARIF_ELEC } from "../../commun/donnees/references.js";
import { icone } from "../blocs/icones.js";
import { echapper, euros, nombre, pourcent, texteRiche, tous, un } from "../blocs/outils.js";
import { dateFr } from "../modele/calendrier.js";
import { factures } from "../modele/factures.js";
import { anneeAvecDerives } from "../modele/simulation.js";

const LIGNES = {
  abonnement: {
    famille: "fournisseur",
    quoi: "Le droit d’être client, indépendamment de la consommation.",
    qui: "Le fournisseur.",
    fixe: "Fixe (par mois)",
  },
  fourniture: {
    famille: "fournisseur",
    quoi: "L’énergie elle-même : chaque kWh consommé, au prix du contrat (différent selon le poste horosaisonnier pour l’électricité).",
    qui: "Le fournisseur.",
    fixe: "Variable (par kWh)",
  },
  acheminement: {
    famille: "reseau",
    quoi: "Le transport de l’énergie par les réseaux jusqu’à l’école : TURPE pour l’électricité, ATRD et transport pour le gaz. Une part dépend de la puissance souscrite, une autre des kWh.",
    qui: "Le distributeur (Enedis ou GRDF) et le transporteur, via le fournisseur.",
    fixe: "Part fixe + part variable",
  },
  depassement: {
    famille: "reseau",
    quoi: "La pénalité quand la puissance appelée dépasse la puissance souscrite (calcul simplifié ici).",
    qui: "Le distributeur, via le fournisseur.",
    fixe: "Dépend des pointes",
  },
  regularisation: {
    famille: "fournisseur",
    quoi: "Le rattrapage de l’écart entre la consommation estimée sur la facture précédente et la consommation réelle.",
    qui: "Le fournisseur (et les réseaux et taxes correspondants).",
    fixe: "Ponctuel",
  },
  accise: {
    famille: "taxes",
    quoi: "Une taxe sur chaque MWh consommé (26,35 €/MWh pour l’électricité et 16,66 €/MWh pour le gaz au 1er août 2026).",
    qui: "L’État.",
    fixe: "Variable (par MWh)",
  },
  cta: {
    famille: "taxes",
    quoi: "Contribution tarifaire d’acheminement : un pourcentage de la part fixe de l’acheminement (15 % pour l’électricité depuis février 2026, 20,80 % pour le gaz).",
    qui: "La caisse de retraite des industries électriques et gazières.",
    fixe: "Fixe (suit la part fixe)",
  },
  tva: {
    famille: "taxes",
    quoi: "La TVA, à 20 % sur l’ensemble de la facture.",
    qui: "L’État.",
    fixe: "Proportionnelle au total",
  },
};

const FAMILLES_DE_LIGNES = {
  fournisseur: ["Fournisseur", "var(--data)"],
  reseau: ["Réseaux", "color-mix(in srgb, var(--data) 50%, var(--surface))"],
  taxes: ["Taxes", "var(--energie)"],
};

const dependDeLaConsommation = (e) =>
  e.cle === "fourniture" ||
  e.cle === "accise" ||
  (e.cle === "acheminement" && /énergie|variable/.test(e.libelle));

export function demoAnatomieFacture(zone, options) {
  let t = "elec";
  let a = null;
  zone.innerHTML = `<div class="segmented" role="group" aria-label="Énergie"><button type="button" data-e="elec" aria-pressed="true">${icone("prise")}Électricité</button><button type="button" data-e="gaz" aria-pressed="false">${icone("flamme")}Gaz</button></div><div id="af"></div>`;
  function c() {
    const o = factures(anneeAvecDerives())[t].find((p) => p.debut === "2026-01-14");
    const d = [
      ...o.lignes,
      {
        cle: "tva",
        libelle: "TVA 20 %",
        montant: o.tva,
      },
    ];
    const u = {
      fournisseur: 0,
      reseau: 0,
      taxes: 0,
    };
    d.forEach((p) => {
      u[LIGNES[p.cle].famille] += p.montant;
    });
    const s =
      o.lignes.reduce((p, m) => p + m.montant * (dependDeLaConsommation(m) ? 0.9 : 1), 0) *
      (1 + TARIF_ELEC.tva);
    const r = a != null ? d[a] : null;
    const i = r ? LIGNES[r.cle] : null;
    un("#af", zone).innerHTML = `
      <div class="split" style="margin-top:12px">
        <article class="facture"><header><div><b>${t === "elec" ? "Électricité" : "Gaz naturel"}</b><br><span class="muted">Du ${dateFr(o.debut)} au ${dateFr(o.fin)}</span></div><div style="text-align:right"><b>${euros(o.ttc, 2)} TTC</b><br><span class="muted">${nombre(t === "elec" ? o.total : o.kwh)} kWh</span></div></header>
          ${o.estimee ? '<span class="tampon">Consommation estimée</span>' : ""}
          <div class="lignes lignes-cliquables">${d.map((p, m) => `<button type="button" class="ligne" data-l="${m}" aria-pressed="${a === m}"><span>${echapper(p.libelle)}${p.detail ? `<small>${echapper(p.detail)}</small>` : ""}</span><span class="mono">${euros(p.montant, 2)}</span></button>`).join("")}
          <div class="ligne tot"><span>Total TTC</span><span class="mono">${euros(o.ttc, 2)}</span></div></div>
        </article>
        <aside class="panneau" aria-live="polite">${
          i
            ? `
          <span class="eyebrow">${echapper(FAMILLES_DE_LIGNES[i.famille][0])}</span><h3>${echapper(r.libelle)}</h3>
          <p><b>Ce que ça paie :</b> ${echapper(i.quoi)}</p><p><b>Qui reçoit l’argent :</b> ${echapper(i.qui)}</p><p><b>Nature :</b> ${echapper(i.fixe)}</p>
          <p><b>Si l’école consomme 10 % de moins :</b> ${r.cle === "tva" ? `elle baisse avec le reste, à ${euros(s - s / (1 + TARIF_ELEC.tva), 2)}.` : dependDeLaConsommation(r) ? `${euros(r.montant * 0.9, 2)} au lieu de ${euros(r.montant, 2)}.` : "elle ne bouge pas."}</p>`
            : '<p class="muted">Clique sur une ligne de la facture pour l’expliquer.</p>'
        }</aside>
      </div>
      <div class="stack" style="gap:6px"><span class="eyebrow">Où va l’argent</span>
        <div class="barre-empilee" role="img" aria-label="${Object.entries(u)
          .map(([p, m]) => `${FAMILLES_DE_LIGNES[p][0]} ${pourcent(m / o.ttc)}`)
          .join(", ")}">${Object.entries(u)
          .map(
            ([p, m]) =>
              `<span style="flex:${m};background:${FAMILLES_DE_LIGNES[p][1]};color:${p === "taxes" ? "var(--on-energie)" : p === "fournisseur" ? "var(--on-data)" : "var(--ink)"}">${pourcent(m / o.ttc)}</span>`,
          )
          .join("")}</div>
        <div class="legend-row">${Object.entries(u)
          .map(
            ([p, m]) =>
              `<span class="key"><i style="background:${FAMILLES_DE_LIGNES[p][1]}"></i>${FAMILLES_DE_LIGNES[p][0]} : ${euros(m)}</span>`,
          )
          .join("")}</div></div>
      <p class="feedback info">${icone("info")}<span>${texteRiche(`Avec 10 % de kWh en moins, cette facture passerait de ${euros(o.ttc)} à **${euros(s)}** TTC, soit −${pourcent(1 - s / o.ttc, 1)} : moins de 10 %, car l’{{abonnement}}, la part fixe de l’{{acheminement}} et la {{cta}} ne dépendent pas des kWh.`)}</span></p>`;
    tous("[data-l]", zone).forEach((p) =>
      p.addEventListener("click", () => {
        a = +p.dataset.l;
        options.toucher();
        c();
        un(`[data-l="${a}"]`, zone)?.focus();
      }),
    );
  }
  tous("[data-e]", zone).forEach((o) =>
    o.addEventListener("click", () => {
      t = o.dataset.e;
      a = null;
      tous("[data-e]", zone).forEach((d) => d.setAttribute("aria-pressed", d === o));
      options.toucher();
      c();
    }),
  );
  c();
}
