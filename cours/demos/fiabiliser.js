/**
 * Démo de l'étape 3 : corriger les anomalies d'une courbe.
 */
import { graphique } from "../blocs/graphique.js";
import { icone } from "../blocs/icones.js";
import { echapper, nombre, tous, un } from "../blocs/outils.js";
import { ajouterJours, dateLongue } from "../modele/calendrier.js";
import { courbeDeCharge } from "../modele/releves.js";
import { anneeDeReference } from "../modele/simulation.js";

const ANOMALIES_INJECTEES = {
  trous: true,
  doublons: true,
  aberrantes: true,
  changementHeure: true,
};

const SEUIL_ABERRANT_KW = 80;

const CAS_ANOMALIES = [
  {
    iso: "2025-11-18",
    nom: "Le trou",
    choix: [
      {
        t: "Relier les deux bords par une ligne droite",
        v: "bad",
        e: "Le trou dure 5 heures en pleine journée : une ligne droite efface le pic du déjeuner et sous-estime la consommation.",
      },
      {
        t: "Remplir avec le profil d’un mardi comparable et marquer les points « estimés »",
        v: "ok",
        e: "Bonne pratique : le profil d’un jour similaire respecte la forme de la journée, et le statut « estimé » garde la trace de la correction.",
      },
      {
        t: "Remplacer les points manquants par 0",
        v: "bad",
        e: "Zéro est une vraie valeur : l’école aurait été totalement éteinte. On invente une donnée fausse.",
      },
      {
        t: "Laisser le trou et le signaler",
        v: "bof",
        e: "Honnête, mais les totaux de la journée seront faux. Souvent, on signale ET on estime.",
      },
    ],
  },
  {
    iso: "2025-12-02",
    nom: "Les doublons",
    choix: [
      {
        t: "Additionner les valeurs en double",
        v: "bad",
        e: "On compterait deux fois la même énergie : la consommation de 10 h à 11 h doublerait.",
      },
      {
        t: "Supprimer les lignes identiques (même horodatage, même valeur)",
        v: "ok",
        e: "C’est la règle : une mesure par pas de temps. Les doublons exacts sont retirés.",
      },
      {
        t: "Rejeter toute la journée",
        v: "bad",
        e: "Trop radical : les 144 vraies mesures sont bonnes, seuls 6 doublons posent problème.",
      },
    ],
  },
  {
    iso: "2026-01-20",
    nom: "Le pic impossible",
    choix: [
      {
        t: "Garder la valeur : c’est peut-être vrai",
        v: "bad",
        e: "999,9 kW dans une école de 60 kVA, c’est 17 fois la puissance maximale du raccordement. Physiquement impossible.",
      },
      {
        t: "Rejeter la valeur et l’estimer à partir de ses voisines",
        v: "ok",
        e: "Un seul point de 10 minutes : l’interpolation est fiable ici. La valeur brute est conservée avec le statut « rejetée ».",
      },
      {
        t: "La plafonner à 60 kW",
        v: "bad",
        e: "On remplace une erreur par une autre valeur inventée, sans rapport avec la réalité.",
      },
    ],
  },
  {
    iso: "2026-03-29",
    nom: "La journée de 23 h",
    choix: [
      {
        t: "Ajouter les 6 points manquants de 2 h à 3 h par interpolation",
        v: "bad",
        e: "Cette heure n’a jamais existé : à 2 h, il était 3 h. On créerait de l’énergie fictive.",
      },
      {
        t: "C’est normal : stocker en UTC, où la journée compte bien 23 h de mesures",
        v: "ok",
        e: "Passage à l’heure d’été : la journée locale dure 23 h, donc 138 points. En UTC, il n’y a ni trou ni doublon.",
      },
      {
        t: "Supprimer la journée",
        v: "bad",
        e: "Toutes les mesures sont justes : il n’y a rien à supprimer.",
      },
    ],
  },
  {
    iso: "2025-10-26",
    nom: "La journée de 25 h",
    choix: [
      {
        t: "Supprimer les 6 « doublons » de 2 h à 3 h",
        v: "bad",
        e: "Ce ne sont pas des doublons : l’heure de 2 h à 3 h a vraiment eu lieu deux fois. Les supprimer fait perdre de l’énergie réelle.",
      },
      {
        t: "C’est normal : horodater en UTC (ou avec le décalage +02:00 / +01:00)",
        v: "ok",
        e: "Passage à l’heure d’hiver : 25 h, donc 150 points. Avec l’UTC ou le décalage horaire, chaque mesure a un horodatage unique.",
      },
      {
        t: "Faire la moyenne des deux mesures de chaque pas",
        v: "bof",
        e: "Les valeurs restent plausibles, mais on perd une heure d’énergie dans le total de la journée.",
      },
    ],
  },
  {
    iso: "2026-02-03",
    nom: "La journée disparue",
    choix: [
      {
        t: "Interpoler entre la veille à minuit et le lendemain à minuit",
        v: "bad",
        e: "Une ligne droite sur 24 h donnerait une journée plate au niveau du talon : toute l’activité de la classe disparaît.",
      },
      {
        t: "Estimer avec un jour comparable, recaler sur l’index mensuel et marquer « estimé »",
        v: "ok",
        e: "L’index (source fiable) donne le total du mois : on s’en sert pour ajuster l’estimation. C’est le recoupement entre sources.",
      },
      {
        t: "Ignorer la journée dans les calculs et la signaler",
        v: "bof",
        e: "Défendable pour une moyenne, mais les totaux mensuels seront faux.",
      },
    ],
  },
];

function diagnostic(e, n) {
  const t = e.map((d) => `${d.heure}`);
  const a = new Map();
  let c = 0;
  e.forEach((d, u) => {
    const l = t[u];
    if (a.has(l)) {
      c++;
    } else {
      a.set(l, u);
    }
  });
  const o = e.filter((d) => d.kw > SEUIL_ABERRANT_KW || (d.kw === 0 && d.slot >= 48 && d.slot < 102)).length;
  return {
    n: e.length,
    doublons: c,
    aberrants: o,
    iso: n,
  };
}

export function demoFiabiliser(zone, options) {
  let t = 0;
  const a = {};
  let c = null;
  const o = anneeDeReference();
  zone.innerHTML = `
    <div class="row" style="justify-content:space-between">
      <div class="pieges" role="group" aria-label="Journées piégées">${CAS_ANOMALIES.map((l, s) => `<button type="button" class="btn" data-p="${s}" aria-pressed="${s === 0}">${s + 1}. ${echapper(l.nom)}</button>`).join("")}</div>
      <span class="score" id="f-score" aria-live="polite"></span>
    </div>
    <p id="f-titre" style="font-weight:700"></p>
    <div id="f-graph"></div>
    <div class="controles" id="f-controles"></div>
    <div class="stack" style="gap:8px"><span class="eyebrow">Quelle correction choisis-tu ?</span><div class="choix" id="f-choix"></div></div>
    <div id="f-retour" aria-live="polite"></div>
    <p class="note">${icone("info")}<span>Dans ce jeu, les anomalies sont toujours présentes, quels que soient les réglages du laboratoire.</span></p>`;
  function d(l, s) {
    if (s) {
      return {
        valeurs: l.map((p) => p.kw),
        ticks: l
          .map((p, m) => ({
            i: m,
            texte: p.heure.replace(":00", " h"),
          }))
          .filter((p, m) => l[m].heure.endsWith(":00") && +l[m].heure.slice(0, 2) % 6 === 0),
      };
    }
    const r = new Array(144).fill(null);
    const i = [];
    l.forEach((p) => {
      if (p.doublon) {
        i.push(p.slot);
      } else {
        r[p.slot] = p.kw;
      }
    });
    return {
      valeurs: r,
      doubles: i,
      ticks: Array.from(
        {
          length: 5,
        },
        (p, m) => ({
          i: Math.min(143, m * 36),
          texte: `${m * 6} h`,
        }),
      ),
    };
  }
  function u() {
    const l = CAS_ANOMALIES[t];
    const s = l.iso === "2026-03-29" || l.iso === "2025-10-26";
    const r = courbeDeCharge(o, l.iso, 1, ANOMALIES_INJECTEES);
    const i = diagnostic(r, l.iso);
    const p = d(r, s);
    const m = a[t];
    const f = m != null && l.choix[m].v === "ok";
    let h = null;
    if (f && !s) {
      let $ = 7;
      while (o.jours.find((y) => y.iso === ajouterJours(l.iso, -$))?.type !== "classe") {
        $ += 7;
      }
      const T = o.jours.find((y) => y.iso === ajouterJours(l.iso, -$)).elec;
      h = p.valeurs.map((y, k) =>
        y == null ? T[k] : y > SEUIL_ABERRANT_KW ? (p.valeurs[k - 1] + p.valeurs[k + 1]) / 2 : null,
      );
      const q = h.slice();
      q.forEach((y, k) => {
        if (y != null) {
          for (const L of [k - 1, k + 1]) {
            if (
              L >= 0 &&
              L < 144 &&
              q[L] == null &&
              p.valeurs[L] != null &&
              p.valeurs[L] <= SEUIL_ABERRANT_KW
            ) {
              h[L] = p.valeurs[L];
            }
          }
        }
      });
    }
    tous("[data-p]", zone).forEach(($) => {
      $.setAttribute("aria-pressed", +$.dataset.p === t);
      const T = a[+$.dataset.p];
      $.innerHTML = `${+$.dataset.p + 1}. ${echapper(CAS_ANOMALIES[+$.dataset.p].nom)}${T != null && CAS_ANOMALIES[+$.dataset.p].choix[T].v === "ok" ? " ✓" : ""}`;
    });
    const x = Object.entries(a).filter(([$, T]) => CAS_ANOMALIES[$].choix[T].v === "ok").length;
    un("#f-score", zone).textContent = `${x} / ${CAS_ANOMALIES.length} journées fiabilisées`;
    un("#f-titre", zone).textContent = `${dateLongue(l.iso)} · ${nombre(i.n)} lignes reçues`;
    const v = {
      hauteur: 220,
      description: `Courbe de charge brute du ${dateLongue(l.iso)}`,
      x: {
        n: p.valeurs.length,
        ticks: p.ticks,
        label: ($) =>
          s
            ? r[$].heure + (r[$].repetee ? " (2e fois)" : "")
            : `${String(Math.floor($ / 6)).padStart(2, "0")}:${String(($ % 6) * 10).padStart(2, "0")}`,
      },
      y: {
        unite: "kW",
        max: Math.max(...p.valeurs.filter(($) => $ != null)) > SEUIL_ABERRANT_KW ? 70 : undefined,
      },
      series: [
        ...(h
          ? [
              {
                nom: "Valeurs corrigées (estimées)",
                couleur: "var(--ok)",
                valeurs: h,
                tirets: true,
                epaisseur: 2.5,
              },
            ]
          : []),
        {
          nom: "Données brutes",
          couleur: "var(--data)",
          valeurs: p.valeurs.map(($) => ($ != null && $ > SEUIL_ABERRANT_KW ? null : $)),
        },
      ],
      marqueurs: [
        ...p.valeurs
          .map(($, T) =>
            $ != null && $ > SEUIL_ABERRANT_KW
              ? {
                  i: T,
                  v: 68,
                  texte: `${nombre($, 1)} kW !`,
                }
              : null,
          )
          .filter(Boolean),
        ...p.valeurs
          .map(($, T) =>
            $ === 0
              ? {
                  i: T,
                  v: 0,
                  texte: "0 kW ?",
                }
              : null,
          )
          .filter(Boolean),
        ...(p.doubles || [])
          .filter(($, T) => T === 0)
          .map(($) => ({
            i: $,
            v: p.valeurs[$],
            texte: "6 doublons",
            couleur: "var(--warn)",
          })),
        ...(s
          ? r
              .map(($, T) =>
                $.repetee && $.slot === 12
                  ? {
                      i: T,
                      v: $.kw,
                      texte: "2 h, 2e fois",
                      couleur: "var(--warn)",
                    }
                  : null,
              )
              .filter(Boolean)
          : []),
      ],
    };
    if (c) {
      c.maj(v);
    } else {
      c = graphique(un("#f-graph", zone), v);
    }
    const j = ($, T, q) =>
      `<div class="controle">${icone(T ? "ok" : "alerte")}<span>${$}</span><span class="etat" style="color:var(--${T ? "ok" : "bad"})">${q}</span></div>`;
    un("#f-controles", zone).innerHTML =
      j("Complétude", i.n === 144, `${i.n} / 144 points`) +
      j(
        "Doublons",
        i.doublons === 0,
        i.doublons ? `${i.doublons} horodatage${i.doublons > 1 ? "s" : ""} en double` : "aucun",
      ) +
      j(
        "Plausibilité",
        i.aberrants === 0,
        i.aberrants
          ? `${i.aberrants} valeur${i.aberrants > 1 ? "s" : ""} suspecte${i.aberrants > 1 ? "s" : ""}`
          : "OK",
      );
    un("#f-choix", zone).innerHTML = l.choix
      .map(
        ($, T) =>
          `<button type="button" data-c="${T}" class="${m === T ? ($.v === "ok" ? "ok" : $.v === "bad" ? "bad" : "") : ""}" aria-pressed="${m === T}">${echapper($.t)}</button>`,
      )
      .join("");
    const w = un("#f-retour", zone);
    if (m == null) {
      w.innerHTML = "";
    } else {
      const $ = l.choix[m];
      const T = $.v === "ok" ? "ok" : $.v === "bad" ? "bad" : "info";
      const q =
        $.v === "ok"
          ? "Bonne correction."
          : $.v === "bad"
            ? "Pas cette fois."
            : "Pas faux, mais il y a mieux.";
      w.innerHTML = `<div class="feedback ${T}">${icone($.v === "ok" ? "ok" : "alerte")}<div><b>${q}</b> ${echapper($.e)}${$.v === "ok" && t < CAS_ANOMALIES.length - 1 ? ' <button type="button" class="btn" id="f-suivant" style="margin-top:8px">Journée suivante</button>' : ""}</div></div>`;
      un("#f-suivant", zone)?.addEventListener("click", () => {
        t++;
        u();
        un("#f-titre", zone).scrollIntoView({
          block: "nearest",
        });
      });
    }
    tous("[data-c]", zone).forEach(($) =>
      $.addEventListener("click", () => {
        a[t] = +$.dataset.c;
        options.toucher();
        u();
      }),
    );
  }
  tous("[data-p]", zone).forEach((l) =>
    l.addEventListener("click", () => {
      t = +l.dataset.p;
      u();
    }),
  );
  u();
  return () => c?.detruire();
}
