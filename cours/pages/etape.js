/**
 * La page d'une étape : en-tête, onglets Essentiel / Comprendre / Approfondir, démo, termes.
 */
import { FAMILLES } from "../../commun/donnees/etapes.js";
import { GLOSSAIRE } from "../../commun/donnees/glossaire.js";
import { monterBlocs } from "../blocs/blocs.js";
import { icone } from "../blocs/icones.js";
import { echapper, texteRiche, tous, un } from "../blocs/outils.js";
import { ETAPES } from "../contenu/index.js";
import { magasin } from "../coquille/etat.js";
import { DEMOS } from "../demos/index.js";
import { SCHEMAS } from "../schemas/index.js";

const NIVEAUX = [
  {
    id: "essentiel",
    nom: "Essentiel",
    dots: 1,
  },
  {
    id: "comprendre",
    nom: "Comprendre",
    dots: 2,
    version: "V2",
    versionEnergie: "V3",
  },
  {
    id: "approfondir",
    nom: "Approfondir",
    dots: 3,
    version: "V2",
    versionEnergie: "V3",
  },
];

const badgeFamille = (e, n = false) =>
  `<span class="badge ${e} ${n ? "plus" : ""}">${icone(FAMILLES[e].icone)}${n ? "+ " : ""}${FAMILLES[e].nom}</span>`;

export function pageEtape(conteneur, num, niveauDemande) {
  const a = ETAPES.find((m) => m.num === num);
  const c = ETAPES.find((m) => m.num === num - 1);
  const o = ETAPES.find((m) => m.num === num + 1);
  const d = [...new Set([...a.retenir.join(" ").matchAll(/\{\{([a-z0-9-]+)/g)].map((m) => m[1]))]
    .concat(Object.keys(GLOSSAIRE).filter((m) => GLOSSAIRE[m].etapes.includes(num)))
    .filter((m, f, h) => h.indexOf(m) === f);
  conteneur.className = `fam-${a.famille}`;
  conteneur.innerHTML = `
  <div class="stack" style="gap:24px">
    <header class="etape-head">
      <div class="titre">
        <div class="row">${badgeFamille(a.famille)}${a.aussi ? badgeFamille(a.aussi, true) : ""}<span class="eyebrow">Étape ${a.num} sur 8</span></div>
        <h1><span class="accent-txt num">${String(a.num).padStart(2, "0")}</span> ${echapper(a.titre)}</h1>
        <p class="question">${echapper(a.question)}</p>
      </div>
    </header>

    <div class="tabs" role="tablist" aria-label="Niveau de lecture">
      ${NIVEAUX.map((m) => {
        const f = a.niveaux?.[m.id] ? null : a.famille === "data" ? m.version : m.versionEnergie;
        return `<button role="tab" type="button" id="tab-${m.id}" aria-controls="pan-${m.id}" data-niv="${m.id}">${m.nom}${f ? ` <span class="soon">${f}</span>` : ""}</button>`;
      }).join("")}
    </div>

    <section id="pan-essentiel" role="tabpanel" aria-labelledby="tab-essentiel" class="stack" style="gap:24px">
      <div class="essentiel">
        <div class="stack" style="gap:18px">
          <p class="phrase-cle">${texteRiche(a.phrase)}</p>
          <ul class="a-retenir">${a.retenir.map((m) => `<li><span>${texteRiche(m)}</span></li>`).join("")}</ul>
          <aside class="analogie" aria-label="Analogie">
            <span class="ico">${icone(a.analogie.icone)}</span>
            <div class="stack" style="gap:4px"><span class="eyebrow">Analogie</span><h3>${echapper(a.analogie.titre)}</h3><p>${texteRiche(a.analogie.texte)}</p></div>
          </aside>
        </div>
        <figure class="schema" style="margin:0">
          ${SCHEMAS[a.schema]()}
          <figcaption>${echapper(a.legendeSchema)}</figcaption>
        </figure>
      </div>

      <section class="demo" aria-labelledby="demo-titre">
        <div class="demo-head">
          <span class="demo-tag">Démo</span>
          <h2 id="demo-titre">${echapper(a.demo.titre)}</h2>
          <p class="consigne">${echapper(a.demo.consigne)}</p>
        </div>
        <div class="demo-body" id="demo-zone"></div>
      </section>

      <div class="stack" style="gap:8px">
        <span class="eyebrow">Les mots de cette étape</span>
        <div class="termes">${d.map((m) => `<button type="button" class="badge neutre terme" data-g="${m}" style="text-decoration:none">${echapper(GLOSSAIRE[m].terme)}</button>`).join("")}</div>
      </div>
      ${a.niveaux ? `<div class="aller-plus-loin"><span><b>Tu as compris l’idée ?</b> Le niveau Comprendre la met en pratique avec l’école, chiffres à l’appui.</span><button type="button" class="btn primary" data-aller="comprendre">Passer à Comprendre ${icone("fleche")}</button></div>` : ""}
    </section>

    ${["comprendre", "approfondir"]
      .map(
        (m) => `
    <section id="pan-${m}" role="tabpanel" aria-labelledby="tab-${m}" hidden>
      ${
        a.niveaux?.[m]
          ? `<div class="niveau-intro"><span class="eyebrow">${m === "comprendre" ? "Niveau 2 · Comprendre" : "Niveau 3 · Approfondir"}</span><p class="muted">${m === "comprendre" ? "Des démos avec l’école et des exemples chiffrés pas à pas." : "Règles métier, cas limites, vocabulaire technique, puis un mini-quiz."}</p></div><div data-niveau="${m}"></div>`
          : `
      <div class="placeholder-niveau">
        <span class="eyebrow">Arrive dans la ${a.famille === "data" ? "version 2 (partie Data)" : "version 3 (partie Énergie)"}</span>
        <h2>${m === "comprendre" ? "Comprendre" : "Approfondir"} : au programme</h2>
        <ul>${a.avenir[m].map((f) => `<li>${echapper(f)}</li>`).join("")}</ul>
        <p class="muted">En attendant, l’onglet Essentiel et sa démo couvrent l’idée principale de l’étape.</p>
      </div>`
      }
    </section>`,
      )
      .join("")}

    ${num === 8 ? `<a class="boucle" href="#etape-1" style="text-decoration:none;color:var(--ink)">${icone("boucle")}<span><b>La boucle recommence.</b> Les résultats mesurés servent à recadrer : nouveaux objectifs, nouveau périmètre. Retour à l’étape 1, Cadrer.</span></a><a class="aller-plus-loin" href="#quiz-final" style="text-decoration:none;color:var(--ink)">${icone("ok")}<span><b>Tu as fait le tour du cycle ?</b> Teste-toi avec le quiz de synthèse : 12 questions sur les 8 étapes.</span></a>` : ""}

    <nav class="pager" aria-label="Étapes voisines">
      ${c ? `<a href="#etape-${c.num}"><small>← Étape précédente</small><b>${c.num}. ${echapper(c.titre)}</b></a>` : '<a href="#accueil"><small>← Retour</small><b>Le cycle</b></a>'}
      ${o ? `<a class="next" href="#etape-${o.num}"><small>Étape suivante →</small><b>${o.num}. ${echapper(o.titre)}</b></a>` : '<a class="next" href="#etape-1"><small>On boucle →</small><b>1. Cadrer</b></a>'}
    </nav>
  </div>`;
  const u = tous('[role="tab"]', conteneur);
  const l = (m, f = false) => {
    u.forEach((x) => {
      const v = x.dataset.niv === m;
      x.setAttribute("aria-selected", v);
      x.tabIndex = v ? 0 : -1;
      if (v && f) {
        x.focus();
      }
    });
    NIVEAUX.forEach((x) => {
      un(`#pan-${x.id}`, conteneur).hidden = x.id !== m;
    });
    magasin.marquer(num, m);
    const h = un(`[data-niveau="${m}"]`, conteneur);
    if (h && !h.dataset.monte) {
      h.dataset.monte = "1";
      const x = [...a.niveaux[m]];
      if (m === "approfondir" && a.quiz) {
        x.push({
          type: "quiz",
        });
      }
      s.push(
        monterBlocs(h, x, {
          num,
          quiz: a.quiz,
          toucher: () => magasin.marquer(num, "demo"),
          marquerQuiz: (v) =>
            magasin.set({
              quiz: {
                ...(magasin.get().quiz || {}),
                [num]: Math.max(v, magasin.get().quiz?.[num] || 0),
              },
            }),
        }),
      );
    }
  };
  const s = [];
  u.forEach((m, f) => {
    m.addEventListener("click", () => l(m.dataset.niv));
    m.addEventListener("keydown", (h) => {
      if (h.key === "ArrowRight" || h.key === "ArrowLeft") {
        const x = (f + (h.key === "ArrowRight" ? 1 : u.length - 1)) % u.length;
        l(u[x].dataset.niv, true);
      }
    });
  });
  tous("[data-aller]", conteneur).forEach((m) =>
    m.addEventListener("click", () => {
      l(m.dataset.aller);
      un(".tabs", conteneur).scrollIntoView({
        block: "start",
      });
      window.scrollBy(0, -130);
    }),
  );
  l(niveauDemande && NIVEAUX.some((m) => m.id === niveauDemande) ? niveauDemande : "essentiel");
  magasin.marquer(num, "essentiel");
  const r = un("#demo-zone", conteneur);
  const i = DEMOS[a.demo.id];
  let p = null;
  try {
    p = i(r, {
      toucher: () => magasin.marquer(num, "demo"),
    });
  } catch (m) {
    console.error(m);
    r.innerHTML =
      '<p class="feedback bad">La démo n’a pas pu se charger. Recharge la page ; si le problème persiste, signale-le à l’équipe.</p>';
  }
  return () => {
    if (typeof p == "function") {
      p();
    }
    s.forEach((m) => m());
  };
}
