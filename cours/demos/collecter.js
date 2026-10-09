/**
 * Démo de l'étape 2 : les trois sources de données.
 */
import { graphique } from "../blocs/graphique.js";
import { icone } from "../blocs/icones.js";
import { echapper, euros, nombre, texteRiche, tous, un } from "../blocs/outils.js";
import { MOIS, ajouterJours, dateCourte, dateFr, jourDeSemaine, nomDuJour } from "../modele/calendrier.js";
import { factures } from "../modele/factures.js";
import {
  LIBELLES_POSTES,
  POSTES_HORAIRES,
  courbeDeCharge,
  indexMensuels,
  relevesGaz,
} from "../modele/releves.js";
import { anneeAvecDerives, anomaliesActives } from "../modele/simulation.js";

const SOURCES = {
  tele: {
    nom: "Télérelevé",
    ico: "courbe",
    sous: "Courbe de charge",
    fiche: {
      Fréquence: "10 min pour l’école (5 à 30 min selon le compteur), 1 jour (gaz)",
      Délai: "le lendemain (élec), 1 à 3 jours (gaz)",
      Finesse: 5,
      Fiabilité: 3,
    },
    usage: "Analyser : voir quand et comment on consomme.",
  },
  index: {
    nom: "Index",
    ico: "tableau",
    sous: "Relevés du compteur",
    fiche: {
      Fréquence: "1 relevé par mois",
      Délai: "quelques jours",
      Finesse: 2,
      Fiabilité: 4,
    },
    usage: "Contrôler : c’est la référence du comptage, qui recoupe le reste.",
  },
  facture: {
    nom: "Facture",
    ico: "facture",
    sous: "Document du fournisseur",
    fiche: {
      Fréquence: "1 par période",
      Délai: "2 à 6 semaines",
      Finesse: 1,
      Fiabilité: 4,
    },
    usage: "Chiffrer : c’est la référence financière, ce qu’on paie vraiment.",
  },
};

const MOIS_DISPONIBLES = Array.from(
  {
    length: 12,
  },
  (e, n) => new Date(Date.UTC(2025, 8 + n, 1)).toISOString().slice(0, 7),
);

const jauge = (e) =>
  `<span class="jauge" role="img" aria-label="${e} sur 5">${[1, 2, 3, 4, 5].map((n) => `<i class="${n <= e ? "on" : ""}"></i>`).join("")}</span>`;

export function demoCollecter(zone, options) {
  let t = "tele";
  let a = "2026-01";
  let c = "elec";
  const o = [];
  zone.innerHTML = `
    <div class="robinets" role="group" aria-label="Source de données">
      ${Object.entries(SOURCES)
        .map(
          ([i, p]) =>
            `<button type="button" class="robinet" data-src="${i}" aria-pressed="${i === t}">${icone(p.ico)}<b>${p.nom}</b><small>${p.sous}</small></button>`,
        )
        .join("")}
    </div>
    <div class="row">
      <div class="field"><label for="c-mois">Mois</label><select id="c-mois">${MOIS_DISPONIBLES.map((i) => `<option value="${i}" ${i === a ? "selected" : ""}>${MOIS[+i.slice(5) - 1]} ${i.slice(0, 4)}</option>`).join("")}</select></div>
    </div>
    <dl class="fiche" id="c-fiche" style="margin:0"></dl>
    <div id="c-vue" class="stack" style="gap:12px"></div>`;
  function d() {
    const i = SOURCES[t];
    un("#c-fiche", zone).innerHTML = Object.entries(i.fiche)
      .map(([p, m]) => `<div><dt>${p}</dt><dd>${typeof m == "number" ? jauge(m) : echapper(m)}</dd></div>`)
      .join("");
  }
  function u() {
    const i = anneeAvecDerives();
    let p = `${a}-01`;
    while (jourDeSemaine(p) !== 1) {
      p = ajouterJours(p, 1);
    }
    const m = courbeDeCharge(i, p, 7, anomaliesActives());
    const f = i.jours.findIndex((v) => v.iso === p);
    const h = [];
    for (let v = 0; v < 7; v++) {
      h.push(...i.jours[f + v].elec);
    }
    const x = relevesGaz(i, `${a}-01`, new Date(Date.UTC(+a.slice(0, 4), +a.slice(5), 0)).getUTCDate());
    un("#c-vue", zone).innerHTML = `
      <p>${texteRiche(`**Électricité**, semaine du ${dateCourte(p)} : une {{courbe-de-charge}} de ${nombre(m.length)} points (7 × 144). Chaque point est une {{puissance}} moyenne sur 10 minutes, en {{kw}}.`)}</p>
      <div id="c-g1"></div>
      <details><summary>Voir les premières lignes brutes, telles que l’API les livre</summary>
        <div class="table-wrap" style="margin-top:8px"><table><thead><tr><th>Date</th><th>Début du pas</th><th class="r">Valeur</th><th>Unité</th></tr></thead><tbody>
        ${m
          .slice(48, 56)
          .map(
            (v) =>
              `<tr><td class="mono">${v.iso}</td><td class="mono">${v.heure}</td><td class="r mono">${nombre(v.kw * 1000)}</td><td>W</td></tr>`,
          )
          .join("")}
        </tbody></table></div><p class="note">${icone("info")}<span>L’API peut livrer des watts (W) : 23 400 W = 23,4 kW. Vérifier l’unité fait partie de l’étape Fiabiliser.</span></p></details>
      <p style="margin-top:6px">${texteRiche("**Gaz** ({{gazpar}}) : une seule valeur par jour, en m³, convertie en kWh avec le {{coef-conversion}}.")}</p>
      <div id="c-g2"></div>`;
    o.push(
      graphique(un("#c-g1", zone), {
        hauteur: 220,
        description: `Courbe de charge électrique de l’école, semaine du ${dateCourte(p)}`,
        x: {
          n: h.length,
          ticks: Array.from(
            {
              length: 7,
            },
            (v, j) => ({
              i: j * 144 + 72,
              texte: nomDuJour(ajouterJours(p, j)).slice(0, 3),
            }),
          ),
          label: (v) =>
            `${nomDuJour(ajouterJours(p, Math.floor(v / 144)))} ${dateCourte(ajouterJours(p, Math.floor(v / 144)))}, ${String(Math.floor((v % 144) / 6)).padStart(2, "0")}:${String((v % 6) * 10).padStart(2, "0")}`,
        },
        y: {
          unite: "kW",
        },
        zones: [
          {
            i0: 720,
            i1: 1007,
            texte: "week-end",
          },
        ],
        series: [
          {
            nom: "Puissance électrique",
            type: "aire",
            couleur: "var(--data)",
            valeurs: h,
            epaisseur: 1.5,
          },
        ],
      }),
    );
    o.push(
      graphique(un("#c-g2", zone), {
        hauteur: 170,
        description: "Consommation de gaz journalière du mois",
        marge: {
          g: 52,
        },
        x: {
          n: x.length,
          ticks: x.map((v, j) => ({
            i: j,
            texte: String(+v.iso.slice(8)),
          })),
          label: (v) => `${nomDuJour(x[v].iso)} ${dateCourte(x[v].iso)}`,
          espace: 22,
        },
        y: {
          unite: "kWh",
          format: (v) => `${nombre(v)} kWh`,
        },
        series: [
          {
            nom: "Gaz",
            type: "barres",
            couleur: "var(--energie)",
            valeurs: x.map((v) => v.kwh),
          },
        ],
        tooltipExtra: (v) => `<div>${nombre(x[v].m3, 1)} m³ × ${nombre(x[v].coef, 2)} kWh/m³</div>`,
      }),
    );
  }
  function l() {
    const i = indexMensuels(anneeAvecDerives(), anomaliesActives());
    const p = `${a}-01`;
    const m = i.findIndex((y) => y.date === p);
    const f = i.findIndex((y, k) => k > m && y.elec);
    const h = i[m];
    const x = i[f];
    const v = POSTES_HORAIRES.map((y) => ({
      p: y,
      d: x.elec[y] - h.elec[y],
    }));
    const j = v.reduce((y, k) => y + k.d, 0);
    const w = f;
    const $ = i.slice(m + 1, f).some((y) => y.evenement);
    const T = i[w].gaz - h.gaz;
    const q = [];
    if (v.some((y) => y.d < 0)) {
      q.push(
        "Un index électrique <b>recule</b> : la différence est négative. C’est impossible physiquement, donc c’est une erreur de relevé ou de saisie.",
      );
    }
    if (T < 0 || $) {
      q.push(
        $
          ? "Le compteur gaz a été <b>changé</b> le 15 janvier : il faut raccorder l’index de dépose de l’ancien et l’index de pose du nouveau."
          : "L’index gaz a <b>bouclé</b> : après 99 999 m³ il repart à 0. La vraie consommation est (100 000 − début) + fin.",
      );
    }
    if (i[w].statutGaz === "estimé" || h.statutGaz === "estimé") {
      q.push("Un relevé gaz est <b>estimé</b> : la consommation de ce mois sera corrigée au relevé suivant.");
    }
    un("#c-vue", zone).innerHTML = `
      <p>${texteRiche("Chaque mois, on relève le totalisateur ({{index}}) de chaque {{cadran}}. **Consommation = index de fin − index de début.**")}</p>
      <div class="table-wrap"><table>
        <thead><tr><th>Relevé du</th>${POSTES_HORAIRES.map((y) => `<th class="r" title="${LIBELLES_POSTES[y]}">${y} (kWh)</th>`).join("")}<th class="r">Gaz (m³)</th><th>Statut gaz</th></tr></thead>
        <tbody>${i
          .map(
            (
              y,
              k,
            ) => `<tr class="${y.statutGaz === "estimé" || y.evenement ? "alerte" : ""}" ${k === m || k === f ? 'style="font-weight:700"' : ""}>
          <td class="mono">${dateFr(y.date)}${y.evenement ? ` · ${echapper(y.evenement)}` : ""}</td>
          ${POSTES_HORAIRES.map((L) => `<td class="r mono">${y.elec ? nombre(y.elec[L]) : "—"}</td>`).join("")}
          <td class="r mono">${String(y.gaz).padStart(5, "0")}</td><td>${echapper(y.statutGaz)}</td></tr>`,
          )
          .join("")}</tbody>
      </table></div>
      <div class="kpis">
        ${v.map((y) => `<div class="kpi ${y.d < 0 ? "bad" : "data"}"><span class="v">${nombre(y.d)}</span><span class="l">kWh en ${y.p}</span></div>`).join("")}
        <div class="kpi ${j < 0 ? "bad" : "data"}"><span class="v">${nombre(j)}</span><span class="l">kWh électricité (somme des cadrans)</span></div>
        <div class="kpi ${T < 0 ? "bad" : "energie"}"><span class="v">${nombre(T)}</span><span class="l">m³ de gaz (${dateCourte(h.date)} → ${dateCourte(i[w].date)})</span></div>
      </div>
      ${q.map((y) => `<div class="feedback bad">${icone("alerte")}<div>${y}</div></div>`).join("")}
      ${q.length ? "" : `<p class="note">${icone("info")}<span>Pour voir des index piégés (recul, bouclage, changement de compteur, index estimé), active-les dans <a href="#ecole">le laboratoire de l’école</a>, puis choisis janvier à avril.</span></p>`}`;
  }
  function s() {
    const p = factures(anneeAvecDerives())[c];
    const m = p.find((f) => f.debut.slice(0, 7) === a) || p[0];
    un("#c-vue", zone).innerHTML = `
      <div class="segmented" role="group" aria-label="Énergie de la facture">
        <button type="button" data-e="elec" aria-pressed="${c === "elec"}">${icone("prise")}Électricité</button>
        <button type="button" data-e="gaz" aria-pressed="${c === "gaz"}">${icone("flamme")}Gaz</button>
      </div>
      <article class="facture" aria-label="Facture simplifiée">
        <header><div><b>Facture n° ${2026000 + m.n}${c === "gaz" ? "G" : "E"}</b><br><span class="muted">${c === "elec" ? "Électricité · PDL 30001234567890" : "Gaz naturel · PCE 21456789012345"}</span></div>
        <div style="text-align:right">Période du <b>${dateFr(m.debut)}</b> au <b>${dateFr(m.fin)}</b><br><span class="muted">${m.nbJ} jours · ${nombre(c === "elec" ? m.total : m.kwh)} kWh</span></div></header>
        ${m.estimee ? `<span class="tampon">${texteRiche("Consommation estimée")}</span>` : ""}
        <div class="lignes">
          ${m.lignes.map((f) => `<div class="ligne"><span>${echapper(f.libelle)}${f.detail ? `<small>${echapper(f.detail)}</small>` : ""}</span><span class="mono">${euros(f.montant, 2)}</span></div>`).join("")}
          <div class="ligne tot"><span>Total HT</span><span class="mono">${euros(m.ht, 2)}</span></div>
          <div class="ligne"><span>TVA 20 %</span><span class="mono">${euros(m.tva, 2)}</span></div>
          <div class="ligne tot"><span>Total TTC</span><span class="mono">${euros(m.ttc, 2)}</span></div>
        </div>
        <p class="note">${icone("info")}<span>Montants fictifs. La période de facturation va du 14 au 13 : elle ne coïncide pas avec le mois civil.</span></p>
      </article>
      <p>${texteRiche(m.estimee ? "Cette facture est une {{facture-estimee}} : le fournisseur n’avait pas de relevé réel. La suivante contiendra une {{regularisation}}." : "Les lignes se regroupent en trois familles : {{abonnement}} et {{fourniture}} (le fournisseur), {{acheminement}} (les réseaux), taxes ({{accise}}, {{cta}}, {{tva}}).")}</p>`;
    tous("[data-e]", zone).forEach((f) =>
      f.addEventListener("click", () => {
        c = f.dataset.e;
        options.toucher();
        r();
      }),
    );
  }
  function r() {
    o.splice(0).forEach((i) => i.detruire());
    d();
    tous(".robinet", zone).forEach((i) => i.setAttribute("aria-pressed", i.dataset.src === t));
    if (t === "tele") {
      u();
    } else if (t === "index") {
      l();
    } else {
      s();
    }
    un("#c-vue", zone).insertAdjacentHTML(
      "beforeend",
      `<p class="feedback info">${icone("info")}<span><b>À quoi ça sert ?</b> ${echapper(SOURCES[t].usage)}</span></p>`,
    );
  }
  tous(".robinet", zone).forEach((i) =>
    i.addEventListener("click", () => {
      t = i.dataset.src;
      options.toucher();
      r();
    }),
  );
  un("#c-mois", zone).addEventListener("change", (i) => {
    a = i.target.value;
    options.toucher();
    r();
  });
  r();
  return () => o.forEach((i) => i.detruire());
}
