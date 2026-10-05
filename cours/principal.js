/**
 * Point d'entrée du cours : barre du haut, navigation, progression et routeur (une adresse #… = une page).
 */
import { icone } from "./blocs/icones.js";
import { echapper, un } from "./blocs/outils.js";
import { ETAPES } from "./contenu/index.js";
import { magasin } from "./coquille/etat.js";
import { brancherGlossaire, ouvrirGlossaire } from "./coquille/glossaire.js";
import { appliquerTheme, themeActuel } from "./coquille/theme.js";
import { pageAccueil } from "./pages/accueil.js";
import { pageEcole } from "./pages/ecole.js";
import { pageEtape } from "./pages/etape.js";
import { pageGlossaire } from "./pages/glossaire.js";
import { pageQuizFinal } from "./pages/quiz-final.js";

const racine = document.getElementById("app");

racine.innerHTML = `
  <a class="skip" href="#contenu">Aller au contenu</a>
  <header class="topbar">
    <div class="topbar-in">
      <a class="brand" href="#accueil" aria-label="Accueil : l'Energy Management par la donnée">
        <svg width="34" height="34" viewBox="0 0 34 34" aria-hidden="true"><path d="M17 3a14 14 0 0 1 0 28" fill="none" stroke="var(--energie)" stroke-width="5" stroke-linecap="round"/><path d="M17 31A14 14 0 0 1 17 3" fill="none" stroke="var(--data)" stroke-width="5" stroke-linecap="round"/></svg>
        <span>L’Energy Management<small>par la donnée</small></span>
      </a>
      <nav class="nav" aria-label="Navigation principale">
        <a href="#accueil" data-route="accueil">Le cycle</a>
        <a href="#ecole" data-route="ecole">${icone("ecole")}L’école</a>
        <a href="#glossaire" data-route="glossaire">${icone("livre")}Glossaire</a>
        <a href="#quiz-final" data-route="quiz-final">${icone("ok")}Quiz final</a>
      </nav>
      <div class="progress" id="progress" title="Une étape est terminée quand son Essentiel est lu et sa démo manipulée">
        <span class="progress-bar" aria-hidden="true"><span class="pd"></span><span class="pe"></span></span>
        <span id="progress-txt"></span>
      </div>
      <button class="icon-btn" id="btn-theme" type="button"></button>
    </div>
    <nav class="steps-strip" aria-label="Les 8 étapes" id="strip"></nav>
  </header>
  <main id="contenu" tabindex="-1"></main>
  <button class="fab" type="button" id="fab">${icone("livre")}<span>Glossaire</span></button>`;

function majProgression() {
  const e = ETAPES.filter((a) => magasin.estFaite(a.num));
  const n = e.filter((a) => a.famille === "data").length;
  const t = e.length - n;
  un("#progress .pd").style.width = `${(n / 8) * 100}%`;
  un("#progress .pe").style.width = `${(t / 8) * 100}%`;
  un("#progress-txt").textContent = `${e.length}/8 étapes`;
  un("#progress").setAttribute("aria-label", `Progression : ${e.length} étapes terminées sur 8`);
  un("#strip").innerHTML = ETAPES.map(
    (a) =>
      `<a href="#etape-${a.num}" class="fam-${a.famille} ${magasin.estFaite(a.num) ? "done" : ""}" data-num="${a.num}"><span class="pastille"><span>${a.num}</span></span>${echapper(a.titre)}</a>`,
  ).join("");
  majNavigation();
}

let demonterPage = null;

let routeCourante = "";

function majNavigation() {
  document.querySelectorAll(".nav a, .steps-strip a").forEach((n) => n.removeAttribute("aria-current"));
  const e = routeCourante.match(/^etape-(\d)/);
  if (e) {
    document.querySelector(`.steps-strip a[data-num="${e[1]}"]`)?.setAttribute("aria-current", "page");
  } else {
    document
      .querySelector(`.nav a[data-route="${routeCourante || "accueil"}"]`)
      ?.setAttribute("aria-current", "page");
  }
}

function afficherRoute() {
  const e = decodeURIComponent(location.hash.slice(1)) || "accueil";
  if (e.startsWith("g-")) {
    return;
  }
  const n = un("#contenu");
  if (typeof demonterPage == "function") {
    demonterPage();
  }
  demonterPage = null;
  n.className = "";
  const t = e.match(/^etape-(\d)(?:-(essentiel|comprendre|approfondir))?$/);
  if (t && ETAPES.some((a) => a.num === +t[1])) {
    routeCourante = e;
    demonterPage = pageEtape(n, +t[1], t[2]);
    document.title = `${t[1]}. ${ETAPES[+t[1] - 1].titre} · Energy Management`;
  } else if (e === "ecole") {
    routeCourante = e;
    demonterPage = pageEcole(n);
    document.title = "L’école Jean-Jaurès · Energy Management";
  } else if (e === "quiz-final") {
    routeCourante = e;
    demonterPage = pageQuizFinal(n);
    document.title = "Quiz de synthèse · Energy Management";
  } else if (e === "glossaire") {
    routeCourante = e;
    demonterPage = pageGlossaire(n);
    document.title = "Glossaire · Energy Management";
  } else {
    routeCourante = "accueil";
    demonterPage = pageAccueil(n);
    document.title = "L’Energy Management par la donnée";
  }
  majNavigation();
  window.scrollTo(0, 0);
  if (
    document.activeElement &&
    document.activeElement !== document.body &&
    !n.contains(document.activeElement)
  ) {
    n.focus({
      preventScroll: true,
    });
  }
}

appliquerTheme(magasin.get().theme || null);

un("#btn-theme").addEventListener("click", () => {
  const e = themeActuel() === "dark" ? "light" : "dark";
  appliquerTheme(e);
  magasin.set({
    theme: e,
  });
});

matchMedia("(prefers-color-scheme: dark)").addEventListener?.("change", () =>
  appliquerTheme(document.documentElement.dataset.theme),
);

un("#fab").addEventListener("click", () => ouvrirGlossaire());

brancherGlossaire();

magasin.on(majProgression);

window.addEventListener("hashchange", afficherRoute);

majProgression();

afficherRoute();
