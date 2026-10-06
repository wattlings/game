/**
 * Pilotage · principal.js
 * La page de pilotage du jeu : le parcours (une frise par chapitre), le détail de chaque interaction,
 * la modification des textes et le suivi des joueurs.
 *
 * La page lit les fichiers du jeu tels qu'ils sont en ligne (ceux que liste jeu/index.html) : rien n'est recopié ici,
 * elle est donc toujours à jour. Elle n'est liée depuis aucune autre page.
 *
 *   lecture.js   lit un fichier du jeu sans l'exécuter        parcours.js  range le tout en chapitres, sites, quartiers…
 *   rendu.js     dessine frises, pastilles et détails           edition.js   modifie les textes, rend les fichiers à déposer
 *   suivi.js     lit et compte les événements des joueurs       vue-modifs.js, vue-joueurs.js : les deux autres onglets
 */
import { lireFichier, lisible } from "./lecture.js";
import { construire } from "./parcours.js";
import { creerRendu, h, icone, mettreEnForme, nombre, pluriel, surligner } from "./rendu.js";
import { creerEdition } from "./edition.js";
import { monterModifs } from "./vue-modifs.js";
import { monterJoueurs } from "./vue-joueurs.js";
import { etiquettes } from "./suivi.js";
import { CHAPITRES_JEU } from "../commun/donnees/etapes.js";
import { SOURCES } from "../commun/donnees/sources.js";
import { SUIVI } from "../commun/config.js";

const app = document.getElementById("pilotage");
const lireTexte = async (url) => { const r = await fetch(url, { cache: "no-store" }); if (!r.ok) throw new Error(url + " (" + r.status + ")"); return r.text(); };
const sansAccent = (s) => s.normalize("NFD").replace(/\p{M}/gu, "").toLowerCase();

demarrer();

async function demarrer() {
  let liste, contenus;
  try {
    const page = await lireTexte("../jeu/index.html");
    liste = [...page.matchAll(/<script defer src="([^"]+)"/g)].map((m) => m[1]);
    if (!liste.length) throw new Error("aucun fichier listé dans jeu/index.html");
    contenus = await Promise.all(liste.map((f) => lireTexte("../jeu/" + f)));
  } catch (e) {
    app.replaceChildren(h("div", { class: "panne" }, h("h1", null, "Pilotage"), h("p", null, "La page n'a pas pu lire les fichiers du jeu."),
      h("p", { class: "muet" }, location.protocol === "file:" ? "Elle ne fonctionne pas par double-clic : ouvre-la depuis le site en ligne, ou lance « node outils/serveur.mjs » puis va sur http://localhost:8080/pilotage/." : "Détail : " + e.message)));
    return;
  }
  const FF = liste.map((f, i) => lireFichier("jeu/" + f, contenus[i]));
  const P = construire(FF, { chapitres: CHAPITRES_JEU });
  const fichiers = new Map(FF.map((F) => [F.chemin, F]));
  // les textes courts qui servent aussi de repère au jeu (un nom de badge comparé, écrit à plusieurs endroits) : à ne pas changer d'un seul côté
  const ecrit = new Map(), compares = new Set();
  FF.forEach((F) => { (F.compte || []).forEach((n, v) => ecrit.set(v, (ecrit.get(v) || 0) + n)); (F.compares || []).forEach((v) => compares.add(v)); });
  const repere = (T) => { const v = String(T.v); return T.calc || v.length > 40 ? 0 : compares.has(v) ? Math.max(2, ecrit.get(v) || 0) : (ecrit.get(v) || 0) >= 2 ? ecrit.get(v) : 0; };
  const edition = creerEdition(fichiers);
  const etat = { vue: "parcours", ouvert: null, terme: "", modifier: false, stats: null, exemple: false };
  const textes = new Map();
  const rendu = creerRendu({ sources: SOURCES, edition, textes, repere, stats: () => etat.stats });

  // ---- répertoires : chaque pastille, chaque texte, chaque question → où les trouver
  const noeuds = new Map(), ouTexte = new Map(), ouQuestion = new Map();
  P.sections.forEach((section) => section.rangs.forEach((rang) => rang.noeuds.forEach((n) => {
    noeuds.set(n.id, { n, rang, section });
    n.cherche = sansAccent(n.recherche);
    n.textes.forEach((t) => { const k = t.f + ":" + t.a; if (!ouTexte.has(k)) ouTexte.set(k, n.id); });
    (function questions(B) { (B || []).forEach((b) => { if (b.q && (b.genre === "question" || b.genre === "choix" || b.genre === "cases" || b.genre === "ordre")) { const k = lisible(b.q).replace(/\s+/g, " ").trim().slice(0, 100); if (k && !ouQuestion.has(k)) ouQuestion.set(k, n.id); } questions(b.etapes); questions(b.blocs); questions(b.suite); }); })(n.blocs);
  })));

  // ---------------------------------------------------------------- l'en-tête
  const onglet = (id, nom) => h("button", { class: "onglet", type: "button", role: "tab", "data-vue": id, "aria-selected": id === "parcours" ? "true" : "false" }, nom, id === "modifs" ? h("span", { class: "compte", "data-compte": "1", hidden: true }) : null);
  const champ = h("input", { type: "search", class: "cherche", placeholder: "Chercher un mot, un personnage, une réponse…", "aria-label": "Chercher dans tout le jeu" });
  const boutonModifier = h("button", { class: "bouton bascule", type: "button", "aria-pressed": "false", title: "Quand c'est allumé, un clic sur un texte du jeu permet de le réécrire." }, h("span", { html: icone("crayon", 14) }), " Modifier les textes");
  const tete = h("header", { class: "tete" },
    h("div", { class: "marque" }, h("strong", null, "Pilotage"), h("span", null, "Wattlings · le parcours du jeu"), h("span", { class: "prive", title: "Cette page n'est liée nulle part, mais quiconque en connaît l'adresse peut la lire : elle montre toutes les réponses." }, "page non listée")),
    h("nav", { class: "onglets", role: "tablist" }, onglet("parcours", "Le parcours"), onglet("modifs", "Mes modifications"), onglet("joueurs", "Les joueurs")),
    h("div", { class: "outils" }, champ, boutonModifier));

  // ---------------------------------------------------------------- l'onglet « Le parcours »
  const histoire = P.sections.find((s) => s.id === "histoire"), voyages = P.sections.find((s) => s.id === "voyages");
  const compte = (genre) => [...noeuds.values()].filter((x) => x.n.genre === genre).length;
  const tuile = (v, nom) => h("div", { class: "tuile" }, h("strong", null, typeof v === "number" ? nombre(v) : v), h("span", null, nom));
  const exemplePastille = (genre, nom, extra = {}) => h("li", null, (() => { const p = rendu.pastille(Object.assign({ id: "legende-" + nom, genre, titre: "", sous: "" }, extra)); p.disabled = true; p.removeAttribute("data-n"); p.classList.add("mini"); return p; })(), h("span", null, nom));
  const intro = h("section", { class: "intro" },
    h("div", { class: "tuiles" }, tuile(histoire.rangs.filter((r) => r.suivi).length, "chapitres"), tuile(histoire.rangs.reduce((s, r) => s + r.noeuds.filter((n) => n.genre === "champion").length, 0), "arènes"),
      tuile(voyages.rangs.filter((r) => r.suivi).length, "sites en train"), tuile(compte("fiche"), "fiches et informations"), tuile(P.stats.questions, "questions et épreuves"), tuile(P.stats.textes, "textes")),
    h("div", { class: "mode-emploi" },
      h("p", null, h("strong", null, "Une ligne par chapitre, une pastille par moment du jeu."), " Clique une pastille pour lire tout ce qui s'y passe : les répliques, les questions avec leurs bonnes et mauvaises réponses, ce que le jeu répond dans chaque cas."),
      h("ul", { class: "legende" }, exemplePastille("depart", "début du chapitre"), exemplePastille("scene", "scène, dialogue"), exemplePastille("fiche", "fiche savoir"), exemplePastille("fiche", "info clé (exigée)", { cle: true }),
        exemplePastille("porte", "porte d'arène"), exemplePastille("dresseur", "dresseur (duel)", { pal: {} }), exemplePastille("champion", "champion (épreuve)", { pal: { hair: "#b8431f", shirt: "#2f6db5" } }), exemplePastille("epreuve", "manipulation"), exemplePastille("secret", "secret")),
      h("p", { class: "muet" }, "La page lit les ", nombre(P.stats.fichiers), " fichiers du jeu tels qu'ils sont en ligne, sans les faire tourner : elle est toujours à jour. Les morceaux en ", h("span", { class: "calc" }, "gris"), " sont calculés par le jeu au moment de jouer (un prénom, un chiffre).",
        P.stats.illisibles.length ? h("strong", { class: "alerte" }, " " + pluriel(P.stats.illisibles.length, "fichier illisible", "fichiers illisibles") + " : " + P.stats.illisibles.join(" ; ")) : null)));

  const lienSection = (s) => h("a", { class: "puce", href: "#s-" + s.id, "data-section": s.id }, s.titre, h("span", { class: "muet" }, " " + s.rangs.reduce((t, r) => t + r.noeuds.length, 0)));
  const barreSections = h("nav", { class: "sections", "aria-label": "Parties du jeu" }, P.sections.map(lienSection), h("span", { class: "resultat", "aria-live": "polite" }));
  const rangEl = (r) => h("article", { class: "rang", "data-r": r.id },
    h("header", { class: "rang-tete" }, h("span", { class: "rang-num" }, r.num),
      h("div", { class: "rang-titres" }, h("h3", null, r.titre), r.resume ? h("p", { class: "muet" }, r.resume) : null, h("p", { class: "rang-suivi", "data-suivi-rang": r.id, hidden: true })),
      r.essai ? h("a", { class: "bouton", href: "../jeu/#essai-" + r.essai, target: "_blank", rel: "noopener", title: "Ouvre le jeu ici, dans un nouvel onglet. Rien n'est enregistré, ta partie n'est pas touchée." }, h("span", { html: icone("jouer", 13) }), " Tester") : null),
    h("div", { class: "frise" }, r.noeuds.map((n) => rendu.pastille(n))), h("div", { class: "rang-detail" }));
  const vueParcours = h("div", { class: "vue", id: "vue-parcours" }, intro, barreSections,
    P.sections.map((s) => h("section", { class: "section", id: "s-" + s.id, "data-s": s.id }, h("h2", null, s.titre, s.sous ? h("span", { class: "muet" }, " · " + s.sous) : null), s.rangs.map(rangEl))),
    h("p", { class: "vide", hidden: true }, "Aucune pastille ne contient ce mot."));

  // ---- ouvrir, refermer une pastille
  function fermer() {
    if (!etat.ouvert) return;
    app.querySelectorAll(".detail").forEach((d) => d.remove());
    app.querySelectorAll('.noeud[aria-expanded="true"]').forEach((b) => b.setAttribute("aria-expanded", "false"));
    etat.ouvert = null;
  }
  function ouvrir(id, { defiler = true, adresse = true, rester = false } = {}) {
    const x = noeuds.get(id);
    if (!x) return false;
    if (etat.vue !== "parcours" && !rester) montrer("parcours", { adresse: false });
    fermer();
    const bouton = app.querySelector(`.noeud[data-n="${CSS.escape(id)}"]`), rang = bouton && bouton.closest(".rang");
    if (!rang) return false;
    rang.hidden = false; rang.closest(".section").hidden = false;
    const d = rendu.detail(x.n, x.rang);
    rang.querySelector(".rang-detail").append(d);
    bouton.setAttribute("aria-expanded", "true");
    etat.ouvert = id;
    surligner(d, etat.terme);
    suiviDuDetail();
    if (adresse) history.replaceState(null, "", "#n=" + encodeURIComponent(id));
    if (defiler) requestAnimationFrame(() => { const haut = bouton.getBoundingClientRect().top; if (haut < 130 || haut > innerHeight * 0.55) scrollTo({ top: scrollY + haut - 150, behavior: "smooth" }); });
    return true;
  }

  // ---- chercher
  function filtrer() {
    const t = sansAccent(etat.terme.trim());
    let n = 0;
    app.querySelectorAll(".rang").forEach((r) => {
      let dedans = 0;
      r.querySelectorAll(".noeud").forEach((b) => { const x = noeuds.get(b.dataset.n); const ok = !t || (x && x.n.cherche.includes(t)); b.classList.toggle("hors", !ok); if (ok) dedans++; });
      r.hidden = !!t && !dedans; if (t) n += dedans;
    });
    app.querySelectorAll(".section").forEach((s) => (s.hidden = !!t && ![...s.querySelectorAll(".rang")].some((r) => !r.hidden)));
    barreSections.querySelector(".resultat").textContent = t ? (n ? pluriel(n, "pastille contient", "pastilles contiennent") + " « " + etat.terme.trim() + " »" : "") : "";
    vueParcours.querySelector(".vide").hidden = !t || n > 0;
    app.classList.toggle("filtre", !!t);
    if (etat.ouvert) { const id = etat.ouvert; if (t && !noeuds.get(id).n.cherche.includes(t)) fermer(); else ouvrir(id, { defiler: false, adresse: false }); }
  }
  let attente = 0;
  champ.addEventListener("input", () => { clearTimeout(attente); attente = setTimeout(() => { etat.terme = champ.value; if (etat.vue !== "parcours") montrer("parcours"); filtrer(); }, 160); });

  // ---------------------------------------------------------------- modifier un texte
  const editeur = h("dialog", { class: "editeur" });
  function ouvrirEditeur(T) {
    const deja = edition.lire(T), ou = noeuds.get(ouTexte.get(T.f + ":" + T.a));
    const zone = h("textarea", { rows: "6", spellcheck: "true", lang: "fr" });
    zone.value = edition.saisieDe(T);
    const apercu = h("div", { class: "apercu" }), erreur = h("p", { class: "erreur", role: "alert", hidden: true });
    const voir = () => { apercu.innerHTML = mettreEnForme(zone.value, T.calc ? [...zone.value.matchAll(/\$\{((?:[^{}]|\{[^{}]*\})*)\}/g)].map((m) => m[1]) : null); };
    zone.addEventListener("input", () => { voir(); erreur.hidden = true; });
    voir();
    const enregistrer = () => {
      const r = edition.poser(T, zone.value);
      if (r.erreur) { erreur.textContent = r.erreur; erreur.hidden = false; return; }
      editeur.close(); rafraichirTexte(T);
    };
    editeur.replaceChildren(h("form", { method: "dialog", onsubmit: (e) => { e.preventDefault(); enregistrer(); } },
      h("h2", null, "Modifier ce texte"),
      h("p", { class: "muet" }, ou ? ou.rang.titre + " · " + ou.n.titre + " · " : "", h("code", null, T.f)),
      zone,
      repere(T) ? h("p", { class: "conseil alerte" }, "Ce texte est écrit " + repere(T) + " fois à l'identique dans le jeu. Seul cet endroit changera : si c'est un nom que le jeu réutilise ailleurs, les autres garderont l'ancien.") : null,
      T.calc ? h("p", { class: "conseil" }, "Ce texte contient des morceaux calculés par le jeu, écrits ", h("code", null, "${…}"), ". Tu peux les déplacer dans la phrase, mais garde-les tels quels.") : null,
      /<[a-z]/i.test(String(T.v)) ? h("p", { class: "conseil" }, h("code", null, "<b>…</b>"), " met en gras, ", h("code", null, "<br>"), " va à la ligne. Les autres balises sont à laisser comme elles sont.") : null,
      h("div", { class: "apercu-cadre" }, h("span", { class: "etq" }, "Aperçu"), apercu),
      erreur,
      h("div", { class: "editeur-actions" },
        deja ? h("button", { class: "bouton", type: "button", onclick: () => { edition.retirer(T.f + ":" + T.a); editeur.close(); rafraichirTexte(T); } }, "Revenir au texte d'origine") : null,
        h("span", { class: "pousse" }), h("button", { class: "bouton", type: "button", onclick: () => editeur.close() }, "Annuler"), h("button", { class: "bouton plein", type: "submit" }, "Enregistrer"))));
    editeur.showModal();
    zone.focus();
  }
  function rafraichirTexte(T) {
    app.querySelectorAll(`.tx[data-k="${CSS.escape(T.f + ":" + T.a)}"]`).forEach((e) => e.replaceWith(rendu.texteJeu(T)));
  }
  function majCompte() {
    const c = tete.querySelector("[data-compte]"), n = edition.nombre;
    c.hidden = !n; c.textContent = n;
  }
  edition.surChangement(() => { majCompte(); modifs.rafraichir(); });

  // ---------------------------------------------------------------- les deux autres onglets
  const vueModifs = h("div", { class: "vue", id: "vue-modifs", hidden: true }), vueJoueurs = h("div", { class: "vue", id: "vue-joueurs", hidden: true });
  const modifs = monterModifs(vueModifs, { edition, voir: (m) => { const id = ouTexte.get(m.f + ":" + m.a); if (id) ouvrir(id); }, ouEst: (m) => { const x = noeuds.get(ouTexte.get(m.f + ":" + m.a)); return x ? x.rang.titre + " · " + x.n.titre : ""; }, allumer: () => regler(true) });
  monterJoueurs(vueJoueurs, { P, config: SUIVI, ouQuestion: (q) => ouQuestion.get(q), nomDe: (id) => { const x = noeuds.get(id); return x ? x.rang.titre : ""; }, ouvrir, surStats: (A, exemple) => { etat.stats = A; etat.exemple = exemple; poserSuivi(); } });

  // ---- les chiffres des joueurs, posés sur les frises
  function poserSuivi() {
    const E = etat.stats ? etiquettes(etat.stats, P) : { rangs: {}, noeuds: {} };
    app.classList.toggle("avec-suivi", !!etat.stats);
    app.querySelectorAll("[data-suivi-rang]").forEach((e) => { const t = E.rangs[e.dataset.suiviRang]; e.hidden = !t; e.replaceChildren(...(t ? [h("span", { html: icone("joueur", 13) }), " " + t + (etat.exemple ? " (exemple)" : "")] : [])); });
    app.querySelectorAll("[data-suivi]").forEach((e) => { e.textContent = E.noeuds[e.dataset.suivi] || ""; });
    if (etat.ouvert) ouvrir(etat.ouvert, { defiler: false, adresse: false, rester: true });
  }
  function suiviDuDetail() {
    const d = app.querySelector("[data-suivi-detail]");
    if (!d || !etat.stats) return;
    const t = etiquettes(etat.stats, P).noeuds[d.dataset.suiviDetail];
    if (t) d.replaceChildren(h("span", { class: "rang-suivi" }, h("span", { html: icone("joueur", 13) }), " " + t + (etat.exemple ? " (données d'exemple)" : "")));
  }

  // ---------------------------------------------------------------- navigation
  function montrer(vue, { adresse = true } = {}) {
    etat.vue = vue;
    [["parcours", vueParcours], ["modifs", vueModifs], ["joueurs", vueJoueurs]].forEach(([id, e]) => (e.hidden = id !== vue));
    tete.querySelectorAll(".onglet").forEach((b) => b.setAttribute("aria-selected", b.dataset.vue === vue ? "true" : "false"));
    if (vue === "modifs") modifs.rafraichir();
    if (adresse) { history.replaceState(null, "", vue === "parcours" ? (etat.ouvert ? "#n=" + encodeURIComponent(etat.ouvert) : location.pathname + location.search) : "#" + (vue === "modifs" ? "modifications" : "joueurs")); scrollTo({ top: 0 }); }
  }
  function regler(modifier) {
    etat.modifier = modifier;
    boutonModifier.setAttribute("aria-pressed", modifier ? "true" : "false");
    app.classList.toggle("edition", modifier);
  }
  boutonModifier.addEventListener("click", () => regler(!etat.modifier));
  app.addEventListener("click", (e) => {
    const c = (sel) => e.target.closest(sel);
    let x;
    if ((x = c(".onglet"))) return montrer(x.dataset.vue);
    if ((x = c("[data-fermer]"))) { fermer(); history.replaceState(null, "", location.pathname + location.search); return; }
    if ((x = c("[data-copier]"))) { const u = location.origin + location.pathname + x.dataset.copier; (navigator.clipboard ? navigator.clipboard.writeText(u) : Promise.reject()).then(() => { x.lastChild.textContent = " Copié"; setTimeout(() => (x.lastChild.textContent = " Lien"), 1500); }).catch(() => prompt("Adresse de cette pastille :", u)); return; }
    if (etat.modifier && (x = c(".tx[data-k]")) && !c("a")) { const T = textes.get(x.dataset.k); if (T) { e.preventDefault(); ouvrirEditeur(T); } return; }
    if ((x = c(".noeud[data-n]"))) { if (etat.ouvert === x.dataset.n) { fermer(); history.replaceState(null, "", location.pathname + location.search); } else ouvrir(x.dataset.n); return; }
    if ((x = c("a[data-section]"))) { e.preventDefault(); const s = document.getElementById("s-" + x.dataset.section); if (s) scrollTo({ top: scrollY + s.getBoundingClientRect().top - 120, behavior: "smooth" }); }
  });
  addEventListener("keydown", (e) => { if (e.key === "Escape" && etat.ouvert && !editeur.open) fermer(); if (e.key === "/" && !/^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement.tagName) && !editeur.open) { e.preventDefault(); champ.focus(); } });

  app.replaceChildren(tete, h("main", null, vueParcours, vueModifs, vueJoueurs), editeur);
  majCompte();
  const route = () => { const a = decodeURIComponent(location.hash.slice(1)); if (a === "modifications") montrer("modifs", { adresse: false }); else if (a === "joueurs") montrer("joueurs", { adresse: false }); else if (a.startsWith("n=")) ouvrir(a.slice(2), { adresse: false }); };
  route();
  addEventListener("hashchange", route);
  // pour les contrôles automatiques (outils/verifier.mjs)
  window.PILOTAGE = { P, edition, ouvrir, etat, noeuds, repere };
}
