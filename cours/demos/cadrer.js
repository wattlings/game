/**
 * Démo de l'étape 1 : relier chaque élément à son compteur.
 */
import { ECOLE } from "../../commun/donnees/ecole.js";
import { icone } from "../blocs/icones.js";
import { echapper, texteRiche, tous, un } from "../blocs/outils.js";

const ETIQUETTES = [
  {
    id: "pdl",
    txt: `PDL ${ECOLE.pdl}`,
    k: "identifiant",
    bon: "elec",
    pourquoi: "Le PDL identifie un raccordement électrique chez Enedis.",
  },
  {
    id: "pce",
    txt: `PCE ${ECOLE.pce}`,
    k: "identifiant",
    bon: "gaz",
    pourquoi: "Le PCE identifie un point de livraison de gaz chez GRDF.",
  },
  {
    id: "enedis",
    txt: "Enedis",
    k: "distributeur",
    bon: "elec",
    pourquoi: "Enedis gère le réseau électrique et les compteurs d’électricité.",
  },
  {
    id: "grdf",
    txt: "GRDF",
    k: "distributeur",
    bon: "gaz",
    pourquoi: "GRDF gère le réseau de gaz et le compteur Gazpar.",
  },
  {
    id: "eclairage",
    txt: "Éclairage des classes",
    k: "usage",
    bon: "elec",
    pourquoi: "Les lampes fonctionnent à l’électricité.",
  },
  {
    id: "info",
    txt: "Ordinateurs et tableaux numériques",
    k: "usage",
    bon: "elec",
    pourquoi: "L’informatique fonctionne à l’électricité.",
  },
  {
    id: "ventil",
    txt: "Ventilation",
    k: "usage",
    bon: "elec",
    pourquoi: "Les ventilateurs sont des moteurs électriques.",
  },
  {
    id: "chaudiere",
    txt: "Chaudière (chauffage)",
    k: "usage",
    bon: "gaz",
    pourquoi: "Le chauffage de l’école est produit par une chaudière au gaz.",
  },
  {
    id: "kva",
    txt: "Contrat de 60 kVA",
    k: "contrat",
    bon: "elec",
    pourquoi: "La puissance souscrite en kVA est une notion de contrat d’électricité.",
  },
  {
    id: "m3",
    txt: "Mesure en m³",
    k: "unité",
    bon: "gaz",
    pourquoi: "Le compteur de gaz mesure un volume (m³), converti ensuite en kWh.",
  },
];

const COMPTEURS = {
  elec: {
    nom: "Compteur électrique",
    ico: "prise",
  },
  gaz: {
    nom: "Compteur gaz (Gazpar)",
    ico: "flamme",
  },
};

export function demoCadrer(zone, options) {
  let t = {};
  let a = null;
  let c = false;
  const o = [...ETIQUETTES].sort(
    (s, r) => ((s.id.length * 7 + s.txt.length) % 5) - ((r.id.length * 7 + r.txt.length) % 5),
  );
  zone.innerHTML = `
    <div class="pioche" id="pioche" aria-label="Étiquettes à placer"></div>
    <div class="dnd">
      ${Object.entries(COMPTEURS)
        .map(
          ([s, r]) => `
        <div class="bac" data-bac="${s}" role="group" aria-labelledby="bac-${s}">
          <h3 id="bac-${s}" style="color:var(--${s === "elec" ? "data-ink" : "energie-ink"})">${icone(r.ico)} ${r.nom}</h3>
          <div class="contenu"></div>
          <button type="button" class="btn poser" data-bac="${s}" disabled>Placer ici</button>
        </div>`,
        )
        .join("")}
    </div>
    <div class="row"><button type="button" class="btn data" id="verifier">Vérifier</button><button type="button" class="btn" id="recommencer">Recommencer</button><span id="etat" class="muted" style="font-size:var(--t-s)" aria-live="polite"></span></div>
    <div id="retour" aria-live="polite"></div>`;
  const d = (s) => {
    const r = c && t[s.id] ? (t[s.id] === s.bon ? "ok" : "bad") : "";
    return `<button type="button" class="chip ${r}" draggable="true" data-id="${s.id}" aria-pressed="${a === s.id}"><span class="k">${echapper(s.k)}</span>${echapper(s.txt)}${r === "ok" ? " ✓" : r === "bad" ? " ✗" : ""}</button>`;
  };
  function u() {
    un("#pioche", zone).innerHTML =
      o
        .filter((s) => !t[s.id])
        .map(d)
        .join("") ||
      '<span class="muted" style="font-size:var(--t-s)">Toutes les étiquettes sont placées. Clique sur « Vérifier ».</span>';
    for (const s of Object.keys(COMPTEURS)) {
      un(`.bac[data-bac="${s}"] .contenu`, zone).innerHTML = o
        .filter((r) => t[r.id] === s)
        .map(d)
        .join("");
    }
    tous(".poser", zone).forEach((s) => {
      s.disabled = !a;
    });
    tous(".bac", zone).forEach((s) => s.classList.toggle("cible", !!a));
    un("#etat", zone).textContent =
      `${Object.keys(t).length} / ${ETIQUETTES.length} placées${a ? ` · « ${ETIQUETTES.find((s) => s.id === a).txt} » sélectionnée` : ""}`;
  }
  function l(s, r) {
    t[s] = r;
    a = null;
    c = false;
    un("#retour", zone).innerHTML = "";
    options.toucher();
    u();
  }
  zone.addEventListener("click", (s) => {
    const r = s.target.closest(".chip");
    if (r) {
      a = a === r.dataset.id ? null : r.dataset.id;
      u();
      zone.querySelector(`.chip[data-id="${r.dataset.id}"]`)?.focus();
      return;
    }
    const i = s.target.closest(".poser");
    if (i && a) {
      const m = a;
      l(m, i.dataset.bac);
      zone.querySelector(`.chip[data-id="${m}"]`)?.focus();
      return;
    }
    const p = s.target.closest(".bac");
    if (p && a) {
      l(a, p.dataset.bac);
    }
  });
  zone.addEventListener("dragstart", (s) => {
    const r = s.target.closest(".chip");
    if (r) {
      s.dataTransfer.setData("text/plain", r.dataset.id);
    }
  });
  tous(".bac", zone).forEach((s) => {
    s.addEventListener("dragover", (r) => {
      r.preventDefault();
      s.classList.add("over");
    });
    s.addEventListener("dragleave", () => s.classList.remove("over"));
    s.addEventListener("drop", (r) => {
      r.preventDefault();
      s.classList.remove("over");
      const i = r.dataTransfer.getData("text/plain");
      if (i) {
        l(i, s.dataset.bac);
      }
    });
  });
  un("#pioche", zone).addEventListener("dragover", (s) => s.preventDefault());
  un("#pioche", zone).addEventListener("drop", (s) => {
    s.preventDefault();
    const r = s.dataTransfer.getData("text/plain");
    delete t[r];
    u();
  });
  un("#verifier", zone).addEventListener("click", () => {
    c = true;
    options.toucher();
    const s = ETIQUETTES.filter((m) => t[m.id] && t[m.id] !== m.bon);
    const r = ETIQUETTES.filter((m) => !t[m.id]).length;
    if (!r) options.aboutir?.(); // toutes les étiquettes placées : la démo est menée jusqu'au bout
    const i = ETIQUETTES.filter((m) => t[m.id] === m.bon).length;
    u();
    const p = un("#retour", zone);
    if (!s.length && !r) {
      p.innerHTML = `<div class="feedback ok">${icone("ok")}<div><b>Parfait, 10 sur 10.</b> ${texteRiche("Tu viens de faire le travail de cadrage : chaque énergie a son {{point-de-comptage}}, son identifiant et ses usages. C’est la base du modèle de données « site → compteur → mesure ».")}</div></div>`;
    } else {
      p.innerHTML = `<div class="feedback ${s.length ? "bad" : "info"}">${icone(s.length ? "alerte" : "info")}<div><b>${i} bonne${i > 1 ? "s" : ""} réponse${i > 1 ? "s" : ""} sur ${ETIQUETTES.length}.</b>${r ? ` Il reste ${r} étiquette${r > 1 ? "s" : ""} à placer.` : ""}
        ${s.length ? `<ul style="margin:6px 0 0;padding-left:1.1em">${s.map((m) => `<li>« ${echapper(m.txt)} » : ${echapper(m.pourquoi)}</li>`).join("")}</ul><p style="margin-top:6px">Déplace les étiquettes marquées ✗ puis vérifie à nouveau.</p>` : ""}</div></div>`;
    }
  });
  un("#recommencer", zone).addEventListener("click", () => {
    t = {};
    a = null;
    c = false;
    un("#retour", zone).innerHTML = "";
    u();
  });
  u();
}
