/**
 * La page d'accueil : le cycle, les chiffres de l'école, le programme.
 */
import { ECOLE } from "../../commun/donnees/ecole.js";
import { comptesDisponibles, compteActuel } from "../../commun/compte.js";
import { adresseJeu } from "../../commun/liens.js";
import { esc as echapperHTML } from "../../commun/texte.js";
import { FAMILLES } from "../../commun/donnees/etapes.js";
import { icone } from "../blocs/icones.js";
import { euros, nombre, texteRiche, tous, un } from "../blocs/outils.js";
import { ETAPES } from "../contenu/index.js";
import { QUESTIONS_QUIZ_FINAL } from "../contenu/quiz-final.js";
import { magasin, maitrisee } from "../coquille/etat.js";
import { factures } from "../modele/factures.js";
import { anneeCivile, anneeDeReference, totalElec, totalGaz } from "../modele/simulation.js";
import { brancherRoue, roueDuCycle } from "../schemas/cycle.js";
import { vignetteEcole } from "../schemas/vignette-ecole.js";

/** Le bouton principal : « Reprendre » là où on s'est arrêté, sinon « Commencer par l'étape 1 ». */
function boutonDepart() {
  const route = magasin.get().derniere;
  const m = route && route.match(/^etape-(\d)(?:-(comprendre|approfondir))?$/);
  const etape = m && ETAPES.find((e) => e.num === +m[1]);
  if (!etape) return `<a class="btn primary" href="#etape-1">Commencer par l’étape 1 ${icone("fleche")}</a>`;
  const niveau = m[2] === "comprendre" ? " · Comprendre" : m[2] === "approfondir" ? " · Approfondir" : "";
  return `<a class="btn primary" href="#${route}">Reprendre : ${etape.num}. ${etape.titre}${niveau} ${icone("fleche")}</a><a class="btn" href="#etape-1">Recommencer à l’étape 1</a>`;
}

/** Affiche la page d'accueil dans `conteneur`. */
export function pageAccueil(conteneur) {
  const n = anneeDeReference();
  const t = anneeCivile(n);
  const a = totalElec(t);
  const c = totalGaz(t);
  const o = factures(n);
  const d = [...o.elec, ...o.gaz].reduce((p, m) => p + m.ttc, 0);
  const u = magasin.get().filtre || "tout";
  conteneur.innerHTML = `
  <div class="stack" style="gap:48px">
    <section class="hero">
      <div class="hero-text">
        <span class="eyebrow">Formation interne · pour tous les salariés · niveau débutant</span>
        <h1>De la <span class="d">donnée</span> à l’<span class="e">énergie</span> économisée</h1>
        <p class="lead">Comment passe-t-on des chiffres d’un compteur à de l’énergie vraiment économisée ? Le métier de l’energy management expliqué en 8 étapes, sans prérequis technique, avec une école fictive comme terrain de jeu.</p>
        <div class="stack" style="gap:8px">
          <span class="eyebrow" id="lbl-filtre">Les deux familles d’étapes, sur le cycle</span>
          <div class="segmented" role="group" aria-labelledby="lbl-filtre">
            <button type="button" data-f="tout" aria-pressed="${u === "tout"}">Les 8</button>
            <button type="button" data-f="data" aria-pressed="${u === "data"}">${icone("data")}Data · 1 à 4</button>
            <button type="button" data-f="energie" aria-pressed="${u === "energie"}">${icone("energie")}Énergie · 5 à 8</button>
          </div>
        </div>
        <p class="muted" style="font-size:var(--t-s)" id="desc-filtre"></p>
        <div class="row">${boutonDepart()}<a class="btn" href="${adresseJeu()}" data-jeu="">Ou jouer à Wattlings</a></div>
        <p class="muted" style="font-size:var(--t-s);margin:0">Tu peux aussi cliquer sur n’importe quelle étape du cycle.</p>
      </div>
      <div>
        <div id="cycle-zone">${roueDuCycle()}</div>
        <ol class="cycle-liste" aria-label="Les 8 étapes">${ETAPES.map((p) => `<li><a href="#etape-${p.num}" class="fam-${p.famille}"><span class="pastille">${p.num}</span><span><b>${p.titre}</b><small>${p.question}</small></span></a></li>`).join("")}</ol>
      </div>
    </section>

    <section class="stack">
      <div class="stack" style="gap:6px"><span class="eyebrow">Mode d’emploi</span><h2>Chaque étape se lit à trois niveaux</h2></div>
      <div class="grid-3">
        ${[
          [
            "Essentiel",
            1,
            "2 à 5 minutes : l’idée en une phrase, un schéma, une analogie, et une démo à manipuler.",
            "Pour tous",
          ],
          [
            "Comprendre",
            2,
            "Environ 5 à 10 minutes : des démos plus riches avec l’école et un exemple chiffré pas à pas.",
            "Recommandé",
          ],
          [
            "Approfondir",
            3,
            "Environ 10 à 20 minutes : les règles métier, les cas limites, le vocabulaire technique et un mini-quiz.",
            "Pour aller plus loin",
          ],
        ]
          .map(
            ([p, m, f, h]) => `
          <article class="card niveau-card">
            <h3><span class="dots">${[1, 2, 3].map((x) => `<i class="${x <= m ? "on" : ""}"></i>`).join("")}</span>${p}</h3>
            <p>${f}</p>
            <p style="margin-top:10px"><span class="badge neutre">${h}</span></p>
          </article>`,
          )
          .join("")}
      </div>
      <p class="note">${icone("info")}<span>${texteRiche("Les mots soulignés en pointillés, comme {{kwh}} ou {{index}}, sont expliqués au survol ou au clic. Le glossaire complet reste accessible en bas à droite.")}</span></p>
    </section>

    <section class="stack" aria-labelledby="prog-t">
      <div class="row" style="justify-content:space-between"><div class="stack" style="gap:6px"><span class="eyebrow">Ton parcours</span><h2 id="prog-t">Ta progression</h2></div>
      <div class="row"><a class="btn" href="#quiz-final">${icone("ok")} Quiz de synthèse${magasin.get().quizFinal != null ? ` · ${magasin.get().quizFinal}/${QUESTIONS_QUIZ_FINAL.length}` : ""}</a></div></div>
      <p class="muted" style="margin:0">Une étape est <b>terminée</b> quand tu as lu son Essentiel et mené sa démo jusqu’à son résultat, juste ou faux. L’étoile ★ dit que tu as <b>maîtrisé</b> l’étape : au moins 80 % de bonnes réponses à son mini-quiz.</p>
      <div class="table-wrap"><table class="progression"><caption class="sr">Ta progression, étape par étape</caption><thead><tr><th scope="col">Étape</th><th scope="col">Essentiel</th><th scope="col">Démo</th><th scope="col">Comprendre</th><th scope="col">Approfondir</th><th scope="col">Quiz</th></tr></thead><tbody id="prog-body"></tbody></table></div>
      <p class="note" id="prog-note">${icone("info")}<span>${!magasin.persistant() ? "Le stockage du navigateur est indisponible : ta progression sera perdue en fermant la page." : compteActuel() ? `Ta progression est enregistrée sur ton compte ${echapperHTML(compteActuel())} : tu la retrouves sur tous tes appareils.` : comptesDisponibles() ? "Ta progression est gardée dans ce navigateur. Connecte-toi (en haut à droite) pour la retrouver sur tous tes appareils." : "Ta progression est gardée dans ce navigateur."}</span></p>
      <p class="note"><button type="button" class="lien-discret" id="prog-reset">Effacer ma progression</button></p>
    </section>

    <section class="card ecole-card">
      ${vignetteEcole()}
      <div class="stack" style="gap:14px">
        <div class="stack" style="gap:6px"><span class="eyebrow">Le fil rouge</span><h2>${ECOLE.nom}</h2>
        <p class="prose">Une école élémentaire fictive, présente dans toutes les démos. Ses données couvrent une année scolaire (septembre 2025 à août 2026, calendrier de la zone C) et sont générées dans ton navigateur : aucune donnée réelle.</p></div>
        <div class="facts">
          <div class="fact"><b>${nombre(ECOLE.surface)} m²</b><span>${ECOLE.eleves} élèves</span></div>
          <div class="fact"><b>${nombre(a / 1000)} MWh</b><span>électricité par an (${nombre(a / ECOLE.surface)} kWh/m²)</span></div>
          <div class="fact"><b>${nombre(c / 1000)} MWh</b><span>gaz par an (${nombre(c / ECOLE.surface)} kWh/m²)</span></div>
          <div class="fact"><b>${euros(Math.round(d / 1000) * 1000)}</b><span>de factures TTC (fictives)</span></div>
        </div>
        <div class="row"><a class="btn" href="#ecole">${icone("ecole")} Voir les données de l’école</a></div>
      </div>
    </section>
  </div>`;
  const l = {
    tout: "Les étapes 1 à 4 (Data) produisent une donnée fiable. Les étapes 5 à 8 (Énergie) s’en servent pour consommer moins.",
    data: "Famille Data : cadrer, collecter, fiabiliser et structurer. Le but est d’obtenir une donnée juste et bien rangée.",
    energie:
      "Famille Énergie : analyser, détecter, agir et mesurer. Le but est de comprendre la consommation et de la réduire.",
  };
  const s = () => {
    un("#desc-filtre", conteneur).textContent = l[magasin.get().filtre || "tout"];
    brancherRoue(un("#cycle-zone", conteneur));
  };
  tous(".segmented button", conteneur).forEach((p) =>
    p.addEventListener("click", () => {
      magasin.set({
        filtre: p.dataset.f,
      });
      tous(".segmented button", conteneur).forEach((m) => m.setAttribute("aria-pressed", m === p));
      un("#cycle-zone", conteneur).innerHTML = roueDuCycle();
      s();
    }),
  );
  s();
  const r = () => {
    const p = magasin.get();
    const m = (f, h) =>
      f
        ? `<span class="badge ok">${icone("ok")}<span class="sr">${h} : fait</span></span>`
        : `<span class="muted"><span aria-hidden="true">—</span><span class="sr">${h} : à faire</span></span>`;
    un("#prog-body", conteneur).innerHTML = ETAPES.map((f) => {
      const h = p.progression?.[f.num] || {};
      const x = p.quiz?.[f.num];
      return `<tr><th scope="row"><a href="#etape-${f.num}" class="fam-${f.famille}" style="display:inline-flex;gap:8px;align-items:center;text-decoration:none;color:var(--ink)"><span class="pastille">${f.num}</span>${f.titre}</a> <span class="sr">(${FAMILLES[f.famille].nom})</span></th>
        <td>${m(h.essentiel, "Essentiel")}</td><td>${m(h.demo, "Démo")}</td><td>${m(h.comprendre, "Comprendre")}</td><td>${m(h.approfondir, "Approfondir")}</td>
        <td>${x != null ? `<span class="num">${x} / ${f.quiz?.length ?? "?"}</span>${maitrisee(f.num) ? ' <span class="etoile" aria-hidden="true">★</span><span class="sr">, étape maîtrisée</span>' : ""}` : '<span class="muted">—</span>'}</td></tr>`;
    }).join("") +
      `<tr class="bonus"><th scope="row"><a href="#patrimoine" style="text-decoration:none;color:var(--ink)">Bonus · Piloter un patrimoine</a></th><td colspan="5">${p.patrimoineVu ? `<span class="badge ok">${icone("ok")}<span class="sr">Bonus : </span>vu</span>` : '<span class="muted">À découvrir après l’étape 8 (hors progression)</span>'}</td></tr>`;
  };
  r();
  let i = false;
  un("#prog-reset", conteneur).addEventListener("click", (p) => {
    if (!i) {
      i = true;
      p.currentTarget.textContent = "Confirmer : effacer toute ma progression du cours";
      p.currentTarget.classList.add("energie");
      return;
    }
    magasin.set({
      progression: {},
      quiz: {},
      quizFinal: null,
    });
    i = false;
    p.currentTarget.textContent = "Progression effacée";
    p.currentTarget.classList.remove("energie");
    r();
  });
}
