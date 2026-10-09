/**
 * La page d'une étape : en-tête, onglets Essentiel / Comprendre / Approfondir, démo, termes.
 */
import { FAMILLES } from "../../commun/donnees/etapes.js";
import { GLOSSAIRE } from "../../commun/donnees/glossaire.js";
import { monterBlocs, sourcesDeLaDemo } from "../blocs/blocs.js";
import { majNotes, ouvrirNotes } from "../blocs/notes.js";
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

// les démos de l'Essentiel qui se terminent par une vérification : elles ne comptent qu'une fois vérifiées
const DEMOS_A_VERIFIER = new Set(["cadrer", "analyser"]);

const badgeFamille = (e, n = false) =>
  `<span class="badge ${e} ${n ? "plus" : ""}">${icone(FAMILLES[e].icone)}${n ? "+ " : ""}${FAMILLES[e].nom}</span>`;

/** Affiche l'étape `num` dans `conteneur`, ouverte sur le niveau demandé. Renvoie la fonction qui démonte la page. */
export function pageEtape(conteneur, num, niveauDemande) {
  const a = ETAPES.find((m) => m.num === num);
  const c = ETAPES.find((m) => m.num === num - 1);
  const o = ETAPES.find((m) => m.num === num + 1);
  // les mots de l'Essentiel d'abord ; les autres mots de l'étape (souvent ceux d'Approfondir) restent repliés
  const d = [...new Set([...[a.phrase, ...a.retenir, a.analogie.texte].join(" ").matchAll(/\{\{([a-z0-9-]+)/g)].map((m) => m[1]))].filter((m) => GLOSSAIRE[m]);
  const dAutres = Object.keys(GLOSSAIRE).filter((m) => GLOSSAIRE[m].etapes.includes(num) && !d.includes(m));
  const pastilleTerme = (m) => `<button type="button" class="badge neutre terme" data-g="${m}" style="text-decoration:none">${echapper(GLOSSAIRE[m].terme)}</button>`;
  conteneur.className = `fam-${a.famille}`;
  ouvrirNotes(); // les appels de note de la page repartent de 1
  conteneur.innerHTML = `
  <div class="stack" style="gap:24px">
    <header class="etape-head">
      <div class="titre">
        <div class="row">${badgeFamille(a.famille)}${a.aussi ? badgeFamille(a.aussi, true) : ""}<span class="eyebrow">Étape ${a.num} sur 8</span></div>
        <h1><span class="accent-txt num">${String(a.num).padStart(2, "0")}</span> ${echapper(a.titre)}</h1>
        <p class="question">${echapper(a.question)}</p>
        ${a.objectifs?.length ? `<div class="objectifs"><span class="eyebrow">À la fin de cette étape, tu sauras</span><ul>${a.objectifs.map((m) => `<li>${echapper(m)}</li>`).join("")}</ul></div>` : ""}
      </div>
    </header>

    ${(() => {
      // le laboratoire de l'école modifie toutes les démos : on le signale ici, pour qu'une démo changée ne surprenne pas
      const nA = Object.values(magasin.get().anomalies || {}).filter(Boolean).length;
      const nD = Object.values(magasin.get().derives || {}).filter(Boolean).length;
      if (!nA && !nD) return "";
      const quoi = [nA && `${nA} anomalie${nA > 1 ? "s" : ""} de données`, nD && `${nD} dérive${nD > 1 ? "s" : ""}`].filter(Boolean).join(" et ");
      return `<p class="feedback info labo-actif" role="note">${icone("info")}<span><b>Laboratoire actif :</b> ${quoi} modifie${nA + nD > 1 ? "nt" : ""} les démos. <a href="#ecole">Voir le laboratoire</a> · <button type="button" class="lien-discret" id="labo-off">Tout désactiver</button></span></p>`;
    })()}
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
            <div class="stack" style="gap:4px"><h2 class="eyebrow">Analogie</h2><h3>${echapper(a.analogie.titre)}</h3><p>${texteRiche(a.analogie.texte)}</p></div>
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
        ${sourcesDeLaDemo(a.demo.id)}
      </section>
      <div id="fin-etape" role="status" aria-live="polite"></div>

      <div class="stack" style="gap:8px">
        <h2 class="eyebrow">Les mots de cette étape</h2>
        <div class="termes">${d.map(pastilleTerme).join("")}</div>
        ${dAutres.length ? `<details class="termes-autres"><summary>${d.length ? "Et" : "Voir"} ${dAutres.length} autre${dAutres.length > 1 ? "s" : ""} mot${dAutres.length > 1 ? "s" : ""} de l’étape</summary><div class="termes">${dAutres.map(pastilleTerme).join("")}</div></details>` : ""}
      </div>
      ${a.niveaux ? `<div class="aller-plus-loin"><span><b>Tu as compris l’idée ?</b> Le niveau Comprendre la met en pratique avec l’école, chiffres à l’appui.</span><button type="button" class="btn primary" data-aller="comprendre">Passer à Comprendre ${icone("fleche")}</button></div>` : ""}
    </section>

    ${["comprendre", "approfondir"]
      .map(
        (m) => `
    <section id="pan-${m}" role="tabpanel" aria-labelledby="tab-${m}" hidden>
      ${
        a.niveaux?.[m]
          ? `<div class="niveau-intro"><h2 class="eyebrow">${m === "comprendre" ? "Niveau 2 · Comprendre" : "Niveau 3 · Approfondir"}</h2><p class="muted">${m === "comprendre" ? "Des démos avec l’école et des exemples chiffrés pas à pas." : "Règles métier, cas limites, vocabulaire technique, puis un mini-quiz."}</p></div><div data-niveau="${m}"></div>${
              m === "comprendre"
                ? `<div class="aller-plus-loin"><span><b>Envie d’aller plus loin ?</b> Le niveau Approfondir donne les règles métier, les cas limites et un mini-quiz.</span><button type="button" class="btn primary" data-aller="approfondir">Passer à Approfondir ${icone("fleche")}</button></div>`
                : o
                  ? `<div class="aller-plus-loin"><span><b>Étape suivante :</b> ${o.num}. ${echapper(o.titre)}, ${echapper(o.question.charAt(0).toLowerCase() + o.question.slice(1))}</span><a class="btn primary" href="#etape-${o.num}">Continuer ${icone("fleche")}</a></div>`
                  : `<div class="aller-plus-loin"><span><b>Tu as fait le tour du cycle.</b> Au-delà des 8 étapes : piloter tout un patrimoine, puis le quiz de synthèse.</span><a class="btn primary" href="#patrimoine">Piloter un patrimoine ${icone("fleche")}</a></div>`
            }`
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

    ${num === 8 ? `<a class="boucle" href="#etape-1" style="text-decoration:none;color:var(--ink)">${icone("boucle")}<span><b>La boucle recommence.</b> Les résultats mesurés servent à recadrer : nouveaux objectifs, nouveau périmètre. Retour à l’étape 1, Cadrer.</span></a><a class="aller-plus-loin" href="#patrimoine" style="text-decoration:none;color:var(--ink)">${icone("fleche")}<span><b>Et après ?</b> Au-delà des 8 étapes : piloter tout un patrimoine (bonus). Puis le quiz de synthèse, 12 questions sur les 8 étapes.</span></a>` : ""}

    <section class="bloc sources" data-notes hidden></section>

    <nav class="pager" aria-label="Étapes voisines">
      ${c ? `<a href="#etape-${c.num}"><small>← Étape précédente</small><b>${c.num}. ${echapper(c.titre)}</b></a>` : '<a href="#accueil"><small>← Retour</small><b>Le cycle</b></a>'}
      ${o ? `<a class="next" href="#etape-${o.num}"><small>Étape suivante →</small><b>${o.num}. ${echapper(o.titre)}</b></a>` : '<a class="next" href="#etape-1"><small>On boucle →</small><b>1. Cadrer</b></a>'}
    </nav>
  </div>`;
  un("#labo-off", conteneur)?.addEventListener("click", () => {
    magasin.set({ anomalies: {}, derives: {} });
    dispatchEvent(new HashChangeEvent("hashchange")); // la page se redessine, démos remises à l'état normal
  });
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
    // l'onglet ouvert va dans l'adresse (partage, rechargement) et devient le point de reprise de l'accueil
    const route = `etape-${num}${m === "essentiel" ? "" : "-" + m}`;
    if (decodeURIComponent(location.hash.slice(1)) !== route) history.replaceState(history.state, "", "#" + route);
    if (magasin.get().derniere !== route) magasin.set({ derniere: route });
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
          toucher: () => {}, // seule la démo de l'Essentiel compte pour terminer l'étape
          marquerQuiz: (v) =>
            magasin.set({
              quiz: {
                ...(magasin.get().quiz || {}),
                [num]: Math.max(v, magasin.get().quiz?.[num] || 0),
              },
            }),
        }),
      );
      majNotes(conteneur); // le niveau qu'on vient d'ouvrir peut citer de nouvelles sources
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
  majNotes(conteneur);
  // une étape est terminée quand son Essentiel a été affiché et que sa démo a été menée jusqu'à son résultat
  const demoMenee = () => {
    const avant = magasin.estFaite(num);
    magasin.marquer(num, "demo");
    if (!avant && magasin.estFaite(num)) {
      un("#fin-etape", conteneur).innerHTML = `<p class="feedback ok">${icone("ok")}<span><b>Étape ${num} terminée.</b> ${o ? `Tu peux approfondir avec le niveau Comprendre, ou passer à l’étape ${o.num}, ${echapper(o.titre)}.` : "Tu peux approfondir avec le niveau Comprendre, ou faire le quiz de synthèse."}</span></p>`;
    }
  };
  const r = un("#demo-zone", conteneur);
  const i = DEMOS[a.demo.id];
  let p = null;
  try {
    p = i(r, {
      // les démos à vérification ne comptent qu'une fois vérifiées ; les autres, dès qu'on les manipule
      toucher: () => {
        if (!DEMOS_A_VERIFIER.has(a.demo.id)) demoMenee();
      },
      aboutir: demoMenee,
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
