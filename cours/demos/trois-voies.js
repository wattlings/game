/**
 * Démo « troisVoies » (niveaux Comprendre / Approfondir).
 */
import { icone } from "../blocs/icones.js";
import { echapper, interrupteur, nombre, pourcent, texteRiche, tous, un } from "../blocs/outils.js";
import { magasin } from "../coquille/etat.js";
import { factures } from "../modele/factures.js";
import { POSTES_HORAIRES, courbeDeCharge, indexMensuels } from "../modele/releves.js";
import { anneeAvecDerives, anomaliesActives } from "../modele/simulation.js";

export function demoTroisVoies(zone, options) {
  let t = "elec";
  let a = "mois";
  const c = {
    trous: "Trous de données",
    indexEstime: "Index estimé",
  };
  zone.innerHTML = `
    <div class="row" style="gap:16px">
      <div class="segmented" role="group" aria-label="Énergie"><button type="button" data-e="elec" aria-pressed="true">${icone("prise")}Électricité</button><button type="button" data-e="gaz" aria-pressed="false">${icone("flamme")}Gaz</button></div>
      <div class="segmented" role="group" aria-label="Période"><button type="button" data-p="mois" aria-pressed="true">Janvier 2026 (mois civil)</button><button type="button" data-p="facture" aria-pressed="false">14 janv. → 13 févr. (facture)</button></div>
    </div>
    <div class="switch-list">${Object.entries(c)
      .map(([u, l]) =>
        interrupteur(
          `tv-${u}`,
          l,
          u === "trous"
            ? "Supprime la journée du 3 février dans la courbe"
            : "Le relevé gaz du 1er février est estimé",
          magasin.get().anomalies?.[u],
        ),
      )
      .join("")}</div>
    <div id="tv-res" class="stack" style="gap:12px"></div>`;
  function o() {
    const u = anneeAvecDerives();
    const l = anomaliesActives();
    const [s, r] = a === "mois" ? ["2026-01-01", "2026-01-31"] : ["2026-01-14", "2026-02-13"];
    const i = u.jours.findIndex((w) => w.iso === s);
    const p = u.jours.findIndex((w) => w.iso === r) - i + 1;
    let m;
    if (t === "elec") {
      m = courbeDeCharge(u, s, p, l).reduce((w, $) => w + $.kw / 6, 0);
    } else {
      m = u.jours.slice(i, i + p).reduce((w, $) => w + $.gazKwh, 0);
    }
    let f = null;
    let h = "";
    if (a === "mois") {
      const w = indexMensuels(u, l);
      const $ = w.find((q) => q.date === "2026-01-01");
      const T = w.find((q) => q.date === "2026-02-01");
      if (t === "elec") {
        f = POSTES_HORAIRES.reduce((q, y) => q + T.elec[y] - $.elec[y], 0);
        h = "somme des 4 cadrans";
      } else {
        const q = u.jours.slice(i, i + p).reduce((k, L) => k + L.coef, 0) / p;
        const y = T.gaz - $.gaz;
        f = y * q;
        h = `${nombre(y)} m³ × ${nombre(q, 2)} kWh/m³${T.statutGaz === "estimé" ? " · relevé du 1er févr. estimé" : ""}`;
      }
    } else {
      h = "Pas de relevé d’index le 14 : impossible de comparer directement sur cette période.";
    }
    const x = factures(u)[t];
    let v;
    let j;
    if (a === "facture") {
      const w = x.find(($) => $.debut === "2026-01-14");
      v = t === "elec" ? w.total : w.kwh;
      j = `facture n° ${w.n}${w.estimee ? " · consommation ESTIMÉE" : ""}`;
    } else {
      const w = x.find((q) => q.debut === "2025-12-14");
      const $ = x.find((q) => q.debut === "2026-01-14");
      const T = (q) => (t === "elec" ? q.total : q.kwh);
      v = T(w) * (13 / w.nbJ) + T($) * (18 / $.nbJ);
      j = "au prorata des jours de deux factures (13 j + 18 j)";
    }
    return {
      tele: m,
      index: f,
      indexNote: h,
      fac: v,
      facNote: j,
      deb: s,
      fin: r,
    };
  }
  function d() {
    const u = o();
    const l = u.index ?? u.tele;
    const s = (m) =>
      m == null
        ? ""
        : `<span class="${Math.abs(m / l - 1) > 0.02 ? "bad" : ""}" style="color:var(--${Math.abs(m / l - 1) > 0.02 ? "bad" : "muted"})">${m === l ? "référence" : `${m >= l ? "+" : "−"}${pourcent(Math.abs(m / l - 1), 1)}`}</span>`;
    const r = Math.max(u.tele, u.index || 0, u.fac);
    const i = (m, f, h, x, v) => `<div class="stack" style="gap:4px">
      <div class="row" style="justify-content:space-between"><span><b>${m}</b> <span class="muted" style="font-size:var(--t-xs)">${f}</span></span><span class="num">${h == null ? "—" : `${nombre(h)} kWh`} ${s(h)}</span></div>
      <div style="height:14px;border-radius:4px;background:var(--surface-2)"><div style="height:100%;width:${h == null ? 0 : (h / r) * 100}%;background:${v};border-radius:4px"></div></div>
      <span class="muted" style="font-size:var(--t-xs)">${echapper(x)}</span></div>`;
    const p = [];
    if (a === "mois") {
      p.push(
        "Index et télérelevé couvrent exactement le mois : ils doivent concorder. La facture, elle, ne couvre pas le mois civil : on l’a répartie au prorata des jours, ce qui crée un écart.",
      );
    } else {
      p.push(
        "Sur la période de la facture, on compare directement télérelevé et facture. Il n’y a pas d’index à ces dates : les relevés mensuels tombent le 1er.",
      );
    }
    if (anomaliesActives().trous && t === "elec" && a === "facture") {
      p.push(
        "La journée du 3 février manque dans la courbe : sa somme est trop basse par rapport à la facture. C’est le recoupement qui permet de le repérer.",
      );
    }
    if (a === "facture" && t === "gaz") {
      p.push(
        "La facture gaz de cette période est **estimée** : elle sous-estime la réalité d’environ 30 %. La suivante contiendra une régularisation.",
      );
    }
    if (anomaliesActives().indexEstime && t === "gaz" && a === "mois") {
      p.push(
        "Le relevé d’index du 1er février est **estimé** : la différence d’index est fausse jusqu’au relevé réel suivant.",
      );
    }
    un("#tv-res", zone).innerHTML =
      `${i("Télérelevé", "pour analyser", u.tele, t === "elec" ? "somme de la courbe de charge (kW × 1/6 h)" : "somme des consommations journalières Gazpar", "var(--data)") + i("Index", "pour contrôler", u.index, u.indexNote, "color-mix(in srgb, var(--data) 55%, var(--surface))") + i("Facture", "pour chiffrer", u.fac, u.facNote, "var(--energie)")}<div class="feedback info">${icone("info")}<div><b>Message clé n° 2 : trois sources, une même vérité.</b> ${p.map((m) => texteRiche(m)).join(" ")}</div></div>`;
  }
  tous("[data-e]", zone).forEach((u) =>
    u.addEventListener("click", () => {
      t = u.dataset.e;
      tous("[data-e]", zone).forEach((l) => l.setAttribute("aria-pressed", l === u));
      options.toucher();
      d();
    }),
  );
  tous("[data-p]", zone).forEach((u) =>
    u.addEventListener("click", () => {
      a = u.dataset.p;
      tous("[data-p]", zone).forEach((l) => l.setAttribute("aria-pressed", l === u));
      options.toucher();
      d();
    }),
  );
  tous('input[type="checkbox"]', zone).forEach((u) =>
    u.addEventListener("change", () => {
      magasin.set({
        anomalies: {
          ...magasin.get().anomalies,
          [u.id.slice(3)]: u.checked,
        },
      });
      options.toucher();
      d();
    }),
  );
  d();
}
