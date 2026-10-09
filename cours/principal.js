/**
 * Point d'entrée du cours : barre du haut, navigation, progression et routeur (une adresse #… = une page).
 */
// en premier : le compte joueur note ce qui a changé dans le navigateur avant que le cours ne le lise
import { comptesDisponibles, compteActuel, reglerCompte, surChangementDeCompte } from "../commun/compte.js";
import { ouvrirFenetreCompte } from "../commun/fenetre-compte.js";
import { CLE_AVATAR, CLE_ETAT_COURS, CLE_PARTIE } from "../commun/stockage.js";
import { icone } from "./blocs/icones.js";
import { echapper, un } from "./blocs/outils.js";
import { adresseJeu } from "../commun/liens.js";
import { FAMILLES } from "../commun/donnees/etapes.js";
import { ETAPES } from "./contenu/index.js";
import { magasin, maitrisee, NB_QUESTIONS } from "./coquille/etat.js";
import { brancherGlossaire, ouvrirGlossaire } from "./coquille/glossaire.js";
import { ancienLienVersJeu, brancherJeu } from "./coquille/jeu.js";
import { brancherSuiviCours } from "./coquille/suivi-cours.js";
import { appliquerTheme, themeActuel } from "./coquille/theme.js";
import { pageAccueil } from "./pages/accueil.js";
import { pageEcole } from "./pages/ecole.js";
import { pageEtape } from "./pages/etape.js";
import { pageGlossaire } from "./pages/glossaire.js";
import { pagePatrimoine } from "./pages/patrimoine.js";
import { pageQuizFinal } from "./pages/quiz-final.js";
import { pageSources } from "./pages/sources.js";

const racine = document.getElementById("app");

racine.innerHTML = `
  <a class="skip" href="#contenu">Aller au contenu</a>
  <header class="topbar">
    <div class="topbar-in">
      <a class="brand" href="#accueil" aria-label="Accueil : l'Energy Management par la donnée">
        <svg width="34" height="34" viewBox="0 0 34 34" aria-hidden="true"><path d="M17 3a14 14 0 0 1 0 28" fill="none" stroke="var(--energie)" stroke-width="5" stroke-linecap="round"/><path d="M17 31A14 14 0 0 1 17 3" fill="none" stroke="var(--data)" stroke-width="5" stroke-linecap="round"/></svg>
        <span>L’Energy Management<small>par la donnée</small></span>
      </a>
      <button class="icon-btn btn-menu" id="btn-menu" type="button" aria-expanded="false" aria-controls="nav-principale">${icone("menu")}<span>Menu</span></button>
      <nav class="nav" id="nav-principale" aria-label="Navigation principale">
        <a href="#accueil" data-route="accueil">Le cycle</a>
        <a href="#ecole" data-route="ecole">L’école</a>
        <a href="#patrimoine" class="qk-nav-p" data-route="patrimoine">Patrimoine</a>
        <a href="#quiz-final" data-route="quiz-final">Quiz final</a>
        <a href="#glossaire" data-route="glossaire">Glossaire</a>
        <a href="#sources" data-route="sources">Sources</a>
        <a href="${adresseJeu()}" class="qk-nav" id="qk-jeu" data-jeu="">Le jeu</a>
      </nav>
      <button class="icon-btn" id="btn-theme" type="button"></button>
      <button class="icon-btn btn-compte" id="btn-compte" type="button" hidden></button>
    </div>
    <div class="steps-row">
      <nav class="steps-strip" aria-label="Les 8 étapes" id="strip"></nav>
      <div class="progress" id="progress" title="Une étape est terminée quand son Essentiel est lu et sa démo menée jusqu’à son résultat">
        <span class="progress-bar" aria-hidden="true"><span class="pd"></span><span class="pe"></span></span>
        <span id="progress-txt"></span>
      </div>
    </div>
  </header>
  <main id="contenu" tabindex="-1"></main>
  <button class="fab" type="button" id="fab" aria-label="Glossaire" title="Glossaire">${icone("livre")}</button>`;

ETAPES.forEach((e) => (NB_QUESTIONS[e.num] = e.quiz?.length || 0));

/** Met à jour la barre de progression et le bandeau des 8 étapes. */
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
      `<a href="#etape-${a.num}" class="fam-${a.famille} ${magasin.estFaite(a.num) ? "done" : ""}" data-num="${a.num}"><span class="pastille"><span>${a.num}</span></span>${echapper(a.titre)}${maitrisee(a.num) ? '<span class="etoile" aria-hidden="true">★</span>' : ""}<span class="sr"> (${FAMILLES[a.famille].nom}${magasin.estFaite(a.num) ? ", terminée" : ""}${maitrisee(a.num) ? ", maîtrisée" : ""})</span></a>`,
  ).join("");
  majNavigation();
}

let demonterPage = null;

let routeCourante = "";

/** Marque dans la navigation la page en cours. */
function majNavigation() {
  document.querySelectorAll(".nav a, .steps-strip a").forEach((n) => n.removeAttribute("aria-current"));
  const e = routeCourante.match(/^etape-(\d)/);
  if (e) {
    const lien = document.querySelector(`.steps-strip a[data-num="${e[1]}"]`);
    lien?.setAttribute("aria-current", "page");
    // sur un petit écran, le bandeau défile jusqu'à l'étape en cours
    const bandeau = un("#strip");
    if (lien && bandeau.scrollWidth > bandeau.clientWidth) bandeau.scrollLeft += lien.getBoundingClientRect().left - bandeau.getBoundingClientRect().left - (bandeau.clientWidth - lien.offsetWidth) / 2;
  } else {
    document
      .querySelector(`.nav a[data-route="${routeCourante || "accueil"}"]`)
      ?.setAttribute("aria-current", "page");
  }
}

/** Le routeur : lit l'adresse (#etape-3, #ecole…) et affiche la page correspondante. */
function afficherRoute() {
  const e = decodeURIComponent(location.hash.slice(1)) || "accueil";
  if (e.startsWith("g-")) {
    return;
  }
  if (ancienLienVersJeu(e)) {
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
  } else if (e === "sources") {
    routeCourante = e;
    demonterPage = pageSources(n);
    document.title = "Sources · Energy Management";
  } else if (e === "patrimoine") {
    routeCourante = e;
    demonterPage = pagePatrimoine(n);
    document.title = "Piloter un patrimoine · Energy Management";
  } else {
    routeCourante = "accueil";
    demonterPage = pageAccueil(n);
    document.title = "L’Energy Management par la donnée";
  }
  majNavigation();
  un("#fab").hidden = routeCourante === "glossaire"; // inutile sur la page du glossaire
  fermerMenu();
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

// compte joueur : retrouver sa progression sur tous ses appareils (commun/compte.js)
reglerCompte({ cles: [CLE_ETAT_COURS, CLE_PARTIE, CLE_AVATAR] });
function majBoutonCompte() {
  const b = un("#btn-compte");
  const id = compteActuel();
  b.hidden = !comptesDisponibles();
  b.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></svg><span>${echapper(id || "Se connecter")}</span>`;
  b.title = id ? "Mon compte : " + id : "Se connecter pour retrouver sa progression sur tous ses appareils";
}
majBoutonCompte();
surChangementDeCompte(majBoutonCompte);
un("#btn-compte").addEventListener("click", () => ouvrirFenetreCompte());

un("#fab").addEventListener("click", () => ouvrirGlossaire());

// sur un téléphone, la navigation se replie derrière le bouton « Menu »
function fermerMenu() {
  un(".topbar").classList.remove("menu-ouvert");
  un("#btn-menu").setAttribute("aria-expanded", "false");
}
// sur téléphone, la barre du haut s'efface quand on descend et revient dès qu'on remonte
let dernierY = scrollY;
addEventListener(
  "scroll",
  () => {
    const y = scrollY;
    if (Math.abs(y - dernierY) < 8) return;
    un(".topbar").classList.toggle("cachee", y > dernierY && y > 140);
    un("#fab").classList.toggle("cachee", y > dernierY && y > 140); // le bouton du glossaire aussi : il ne cache pas ce qu'on lit
    dernierY = y;
  },
  { passive: true },
);
un(".topbar").addEventListener("focusin", () => un(".topbar").classList.remove("cachee"));
un("#btn-menu").addEventListener("click", () => {
  const ouvert = un(".topbar").classList.toggle("menu-ouvert");
  un("#btn-menu").setAttribute("aria-expanded", String(ouvert));
});
addEventListener("keydown", (e) => {
  if (e.key === "Escape") fermerMenu();
});

brancherGlossaire();

magasin.on(majProgression);

// le suivi d'audience écoute les changements de page avant le routeur
brancherSuiviCours();

// chaque tableau (y compris ceux que les démos redessinent) reçoit un titre lu par les lecteurs d'écran : celui de sa section
new MutationObserver(() => {
  document.querySelectorAll("#contenu table:not(:has(> caption))").forEach((t) => {
    const titre = t.closest("section, details, .card")?.querySelector("h2, h3, summary")?.textContent.trim();
    const c = document.createElement("caption");
    c.className = "sr";
    c.textContent = titre || "Tableau";
    t.prepend(c);
  });
}).observe(un("#contenu"), { childList: true, subtree: true });

window.addEventListener("hashchange", afficherRoute);

majProgression();

afficherRoute();

// bandeaux du jeu (« Mettre en pratique ») et lien « Le jeu » / « Reprendre le jeu » de la barre du haut
brancherJeu();
