/**
 * Pilotage · rendu.js
 * Dessine le parcours : une frise de pastilles par chapitre (ou par site, par quartier…), et, sous la frise,
 * le détail de la pastille choisie : répliques, fiches, questions avec leurs bonnes et mauvaises réponses, retours.
 *
 * Tout texte du jeu passe par texteJeu() : c'est ce qui le rend modifiable (clic, en mode « Modifier les textes »).
 */
import { estProse, estTexte, lisible } from "./lecture.js";
import { estLibelle } from "./parcours.js";

// ---------------------------------------------------------------- petits outils
export const h = (balise, attrs, ...enfants) => {
  const e = document.createElement(balise);
  for (const k in attrs || {}) {
    const v = attrs[k];
    if (v === false || v === null || v === undefined) continue;
    if (k === "class") e.className = v;
    else if (k === "html") e.innerHTML = v;
    else if (k.startsWith("on")) e.addEventListener(k.slice(2), v);
    else e.setAttribute(k, v === true ? "" : v);
  }
  enfants.flat(Infinity).forEach((c) => c !== null && c !== undefined && c !== false && e.append(c.nodeType ? c : document.createTextNode(String(c))));
  return e;
};
/** Remplace le contenu d'un élément (les valeurs vides sont ignorées, les listes aplaties). */
export const remplir = (e, ...enfants) => e.replaceChildren(...enfants.flat(Infinity).filter((c) => c !== null && c !== undefined && c !== false));
export const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
export const nombre = (n) => Math.round(n).toLocaleString("fr-FR");
export const pluriel = (n, mot, mots) => `${nombre(n)} ${n > 1 ? mots || mot + "s" : mot}`;
const cleDe = (T) => T.f + ":" + T.a;

const ICONES = {
  depart: '<path d="M4 14V2.5M4 3h7.5l-1.8 2.6L11.5 8H4"/>',
  scene: '<path d="M2.5 3.5h11v7h-6l-3 2.5v-2.5h-2z"/>',
  fiche: '<path d="M3.5 2.5h9v11h-9zM6 5.5h4M6 8h4M6 10.5h2.5"/>',
  porte: '<path d="M4 14V2.5h8V14M2.5 14h11"/><circle cx="9.8" cy="8.5" r=".6" fill="currentColor"/>',
  epreuve: '<path d="M2.5 4.5h11M2.5 8h11M2.5 11.5h11"/><circle cx="6" cy="4.5" r="1.6" fill="var(--pastille-fond)"/><circle cx="10.5" cy="8" r="1.6" fill="var(--pastille-fond)"/><circle cx="5" cy="11.5" r="1.6" fill="var(--pastille-fond)"/>',
  secret: '<path d="M5.8 6a2.3 2.3 0 1 1 3.4 2c-.8.5-1.2.9-1.2 1.9"/><circle cx="8" cy="12.3" r=".7" fill="currentColor"/>',
  oeuf: '<path d="M6 11.5V4l5.5-1.2V10"/><circle cx="4.6" cy="11.6" r="1.5"/><circle cx="10.1" cy="10.1" r="1.5"/>',
  joueur: '<circle cx="8" cy="5.2" r="2.6"/><path d="M3 13.5c.6-2.6 2.5-4 5-4s4.4 1.4 5 4"/>',
  crayon: '<path d="M3 13l.6-2.8L11 2.8l2.2 2.2-7.4 7.4zM9.8 4l2.2 2.2"/>',
  jouer: '<path d="M5 3.2v9.6l8-4.8z" fill="currentColor" stroke="none"/>',
  lien: '<path d="M6.8 9.2a2.6 2.6 0 0 0 3.7 0l2-2a2.6 2.6 0 0 0-3.7-3.7l-.7.7M9.2 6.8a2.6 2.6 0 0 0-3.7 0l-2 2a2.6 2.6 0 0 0 3.7 3.7l.7-.7"/>',
  fermer: '<path d="M4 4l8 8M12 4l-8 8"/>',
  cle: '<circle cx="5.2" cy="8" r="2.4"/><path d="M7.6 8h6M11.4 8v2.2M13.2 8v1.6"/>',
};
export const icone = (nom, taille = 16) => `<svg class="ic" viewBox="0 0 16 16" width="${taille}" height="${taille}" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONES[nom] || ""}</svg>`;

/** Le portrait d'un personnage, d'après les couleurs que le jeu lui donne (pal). */
function portrait(pal) {
  const c = (k, defaut) => { const x = pal && pal[k], s = estTexte(x) ? x.v : x; return typeof s === "string" && /^#[0-9a-f]{3,8}$/i.test(s) ? s : defaut; };
  const peau = c("skin", "#e0ac7e"), cheveux = c("hair", "#3a2a1a"), haut = c("coat") || c("jacket") || c("overall") || c("shirt", "#59627c"), chapeau = c("hat"), barbe = c("beard");
  const lunettes = pal && pal.glasses;
  return `<svg viewBox="0 0 32 32" width="100%" height="100%" aria-hidden="true">
    <path d="M4 32c0-7 5-11 12-11s12 4 12 11z" fill="${haut}"/>
    <circle cx="16" cy="14" r="7.2" fill="${peau}"/>
    <path d="M8.6 13.6c-.4-5 2.9-8 7.4-8s7.8 3 7.4 8c-1.600-2.300-3.300-3.600-7.400-3.600s-5.800 1.300-7.400 3.600z" fill="${cheveux}"/>
    ${barbe ? `<path d="M10 16.500c.8 3.800 3 5.200 6 5.200s5.200-1.400 6-5.200c-1.700 1.700-3.600 2.300-6 2.300s-4.300-.6-6-2.300z" fill="${barbe}"/>` : ""}
    ${chapeau ? `<path d="M7.200 10.600c.6-4.400 4-6.800 8.800-6.800s8.200 2.400 8.800 6.800z" fill="${chapeau}"/><rect x="5.500" y="9.800" width="21" height="2.200" rx="1.100" fill="${chapeau}"/>` : ""}
    ${lunettes ? `<g fill="none" stroke="#1c2440" stroke-width="1"><circle cx="13" cy="14.600" r="2.100"/><circle cx="19" cy="14.600" r="2.100"/><path d="M15.100 14.600h1.800"/></g>` : `<circle cx="13.200" cy="14.600" r=".9" fill="#1c2440"/><circle cx="18.800" cy="14.600" r=".9" fill="#1c2440"/>`}
  </svg>`;
}

// ---------------------------------------------------------------- les textes du jeu
const PERMIS = "b|i|em|strong|u|small|sup|sub|p|ul|ol|li|br|code|h3|h4|table|thead|tbody|tr|td|th";
/** Un texte du jeu, prêt à être montré : gras et retours à la ligne gardés, morceaux calculés en pastilles grises. */
export function mettreEnForme(texte, exprs) {
  let s = esc(texte);
  (exprs || []).forEach((x) => { s = s.split(esc("${" + x + "}")).join(`<span class="calc" title="Calculé par le jeu : ${esc(x)}">${esc(x.length > 26 ? x.slice(0, 24) + "…" : x)}</span>`); });
  s = s.replace(new RegExp(`&lt;(/?)(${PERMIS})(?:\\s(?:(?!&gt;).)*)?&gt;`, "gi"), "<$1$2>").replace(/&lt;\/?[a-z][a-z0-9-]*(?:\s(?:(?!&gt;).)*)?&gt;/gi, " ");
  return s.replace(/\n/g, "<br>").replace(/&amp;(nbsp|thinsp|#\d+|[a-z]+);/g, "&$1;");
}

/**
 * Fabrique le rendu d'un nœud. ctx : { sources, edition, stats, textes (Map clé → texte, remplie ici) }.
 */
export function creerRendu(ctx) {
  /** Une valeur du jeu (texte, texte composé, alternative, morceau calculé) → des éléments. */
  function texteJeu(v, { brut = false, verrou = false } = {}) {
    if (v === undefined || v === null || v === false) return null;
    if (typeof v === "string" || typeof v === "number") return document.createTextNode(String(v));
    if (estTexte(v) && verrou && ctx.repere && ctx.repere(v)) {
      // un mot de données qui sert aussi de repère au jeu (nom de badge, d'étape…) : on le montre, sans le laisser modifier ici
      return h("span", { class: "tx-verrou", title: "Ce mot sert aussi de repère au jeu (il y est écrit " + ctx.repere(v) + " fois, ou comparé par le code). Le changer ici seulement casserait quelque chose : il se change dans les fichiers." }, String(v.v));
    }
    if (estTexte(v)) {
      const k = cleDe(v), m = ctx.edition && ctx.edition.lire(v);
      ctx.textes.set(k, v);
      const e = h("span", { class: "tx" + (m ? " modifie" : "") + (v.calc ? " tx-calc" : ""), "data-k": k });
      if (brut) e.textContent = m ? m.apres : String(v.v);
      else e.innerHTML = m ? mettreEnForme(m.apres, v.calc ? m.exprs : null) : mettreEnForme(String(v.v), v.exprs);
      return e;
    }
    if (Array.isArray(v)) return h("span", null, v.map((x, i) => [i ? h("br") : null, texteJeu(x)]));
    if (v._cat) return h("span", null, v._cat.map((x) => texteJeu(x)));
    if (v._si) return h("span", { class: "alt" }, h("span", { class: "si" }, condition(v._si)), " ", texteJeu(v.oui) || h("i", null, "rien"), h("span", { class: "si" }, "sinon"), " ", texteJeu(v.non) || h("i", null, "rien"));
    if (v._ou) return h("span", null, v._ou.map((x) => texteJeu(x)).filter(Boolean).flatMap((x, i) => (i ? [" ", h("span", { class: "si" }, "ou"), " ", x] : [x])));
    if (v._f) return v.retour ? h("span", null, texteJeu(v.retour)) : calcule("calculé par le jeu");
    if (v._x !== undefined) return calcule(v._x);
    if (v._appel) return calcule(v._appel + "(…)");
    if (typeof v === "object" && "t" in v) return texteJeu(v.t);
    return null;
  }
  const calcule = (code) => h("span", { class: "calc", title: "Calculé par le jeu : " + code }, String(code).length > 34 ? String(code).slice(0, 32) + "…" : String(code));

  /** Une condition du code, dite simplement quand c'est possible. */
  function condition(si) {
    if (!si) return "";
    const sinon = /^sinon \(/.test(si), c = sinon ? si.slice(7, -1) : si;
    let m;
    const dit = (m = c.match(/^S\.ch===(\d+)$/)) ? "au chapitre " + m[1]
      : (m = c.match(/^S\.ch>=(\d+)$/)) ? "à partir du chapitre " + m[1]
      : (m = c.match(/^S\.ch<(\d+)$/)) ? "avant le chapitre " + m[1]
      : (m = c.match(/^S\.ch>(\d+)$/)) ? "après le chapitre " + m[1]
      : (m = c.match(/^!S\.site$/)) ? "avant le choix du site"
      : (m = c.match(/^!?vue\('(\w+)'\)$/)) ? (c[0] === "!" ? "tant que l'info « " + m[1] + " » manque" : "une fois l'info « " + m[1] + " » obtenue")
      : null;
    if (sinon) return dit ? "sinon (pas " + dit + ")" : "sinon";
    return dit || "si " + c;
  }
  const etiquetteSi = (si) => (si ? h("span", { class: "si", title: si }, condition(si)) : null);

  const refs = (cles) => {
    const L = (cles || []).map((c) => (estTexte(c) ? c.v : c)).filter((c) => typeof c === "string");
    if (!L.length) return null;
    return h("div", { class: "refs" }, h("span", { class: "refs-t" }, L.length > 1 ? "Sources" : "Source"), h("ul", null, L.map((c) => {
      const s = ctx.sources[c];
      return h("li", null, s ? [h("a", { href: s.url, target: "_blank", rel: "noopener" }, s.t), h("span", { class: "muet" }, " · " + s.ed + (s.date ? " · " + s.date : ""))] : h("code", null, c + " (clé inconnue du registre)"));
    })));
  };

  // ---- ce que les joueurs ont fait (quand le suivi est chargé)
  const cleSuivi = (T) => lisible(T).replace(/\s+/g, " ").trim();
  function erreursDe(q) {
    const S = ctx.stats && ctx.stats(); if (!S) return null;
    const k = cleSuivi(q).slice(0, 100); if (!k) return null;
    return S.erreurs.get(k) || null;
  }
  const pastilleErreurs = (n, titre) => h("span", { class: "err-n", title: titre || "" }, nombre(n) + " ✘");

  // ---- les réponses d'une question
  function reponses(rep, err) {
    return h("ul", { class: "reps" }, (rep || []).map((r) => {
      if (r.calc !== undefined) return h("li", { class: "r-calc" }, h("span", { class: "m" }, "…"), h("div", null, calcule(r.calc)));
      const ok = r.ok === true, ko = r.ok === false;
      const n = err && !ok ? err.reponses.get(cleSuivi(r.t).slice(0, 80)) : 0;
      return h("li", { class: ok ? "r-ok" : ko ? "r-ko" : "r-calc" }, h("span", { class: "m", title: ok ? "Bonne réponse" : ko ? "Mauvaise réponse" : "Dépend du jeu" }, ok ? "✔" : ko ? "✘" : "?"),
        h("div", null, h("div", { class: "r" }, texteJeu(r.t), n ? pastilleErreurs(n, "Choisie " + n + " fois par erreur") : null, !ok && !ko && r.ok && r.ok._x ? [" ", calcule(r.ok._x)] : null),
          r.fb ? h("div", { class: "fb" }, texteJeu(r.fb)) : null));
    }));
  }
  function entete(b, defaut) {
    const t = b.titre !== undefined && b.titre !== null ? texteJeu(b.titre) : defaut || null;
    const si = etiquetteSi(b.si);
    return t || si ? h("div", { class: "b-t" }, t ? h("span", { class: "b-tt" }, t) : null, si) : null;
  }
  function lignes(L, genre = "rep") {
    let dernier = null;
    return (L || []).map((l) => {
      const nom = l.qui === null || l.qui === undefined ? "" : lisible(l.qui);
      const montre = nom && nom !== dernier; dernier = nom || dernier;
      if (l.si) return h("div", { class: "rep-si" }, h("div", { class: "rep-cas" }, h("span", { class: "si", title: l.si }, condition(l.si)), lignes(l.oui)), (l.non || []).length ? h("div", { class: "rep-cas" }, h("span", { class: "si" }, "sinon"), lignes(l.non)) : null);
      return h("div", { class: genre + (nom ? "" : " rep-narr") }, montre ? h("span", { class: "qui" }, nom) : null,
        h("div", { class: "bulle" }, l.t !== undefined ? texteJeu(l.t) : l.ref ? [calcule(l.ref), h("span", { class: "muet" }, " (répliques rangées ailleurs)")] : calcule(l.calc || "calculé")));
    });
  }

  // ---- les données en vrac : un arbre, où seuls les textes lisibles restent
  const NOMS_CLES = { t: "texte", q: "question", n: "nom", name: "nom", nom: "nom", d: "description", x: "contenu", who: "qui", lines: "répliques", note: "note", titre: "titre", title: "titre", bravo: "si c'est réussi", indice: "indice", html: "énoncé", label: "libellé",
    fb: "retour", okMsg: "si c'est réussi", ctx: "contexte", legende: "légende", bouton: "bouton", sub: "sous-titre", reg: "région", step: "étape", short: "nom court", why: "pourquoi", diag: "diagnostic", rep: "réponses", opts: "réponses", items: "éléments", missions: "missions",
    reglages: "réglages", unite: "unité", accroche: "accroche", e: "étiquette", oui: "si oui", non: "sinon", where: "où", idle: "au repos", s: "texte court", l: "libellé", m: "message", c: "commentaire", k: "nom", w: "qui", p: "phrase", desc: "description", txt: "texte" };
  function arbre(v, prof = 0, verrou = false) {
    if (v === null || v === undefined || typeof v !== "object" || prof > 12) return null;
    if (estTexte(v)) return estProse(v.v) || estLibelle(v.v) || ctx.textes.has(cleDe(v)) ? texteJeu(v, { verrou }) : null;
    if (v._q) return bloc({ genre: "question", q: v.q, rep: v.rep });
    if (v._cat) return v._cat.some((x) => estTexte(x) && (estProse(x.v) || estLibelle(x.v))) ? texteJeu(v) : null;
    if (v._si) { const a = arbre(v.oui, prof + 1, verrou), b = arbre(v.non, prof + 1, verrou); return a || b ? h("div", { class: "arbre-si" }, a ? h("div", null, h("span", { class: "si", title: v._si }, condition(v._si)), " ", a) : null, b ? h("div", null, h("span", { class: "si" }, "sinon"), " ", b) : null) : null; }
    if (v._ou) { const L = v._ou.map((x) => arbre(x, prof + 1, verrou)).filter(Boolean); return L.length ? h("div", null, L) : null; }
    if (v._f) return arbre(v.retour, prof + 1, verrou);
    if (v._appel) { const L = (v.args || []).map((x) => arbre(x, prof + 1, verrou)).filter(Boolean); return L.length ? h("div", null, L) : null; }
    if (v._x !== undefined) return null;
    if (Array.isArray(v)) { const L = v.map((x) => arbre(x && x.etale ? x.etale : x, prof + 1, verrou)).filter(Boolean); return !L.length ? null : L.length === 1 && prof > 0 ? L[0] : h("ul", { class: "arbre" }, L.map((x) => h("li", null, x))); }
    const L = Object.entries(v).filter(([k]) => !/^_/.test(k)).map(([k, x]) => [k, arbre(x, prof + 1, verrou)]).filter(([, x]) => x);
    if (!L.length) return null;
    if (L.length === 1 && prof > 0) return h("div", { class: "arbre-1" }, h("span", { class: "etq" }, NOMS_CLES[L[0][0]] || L[0][0]), L[0][1]);
    return h("dl", { class: "arbre" }, L.map(([k, x]) => [h("dt", null, NOMS_CLES[k] || k), h("dd", null, x)]));
  }

  // ---- un bloc
  function bloc(b) {
    if (!b) return null;
    let corps;
    switch (b.genre) {
      case "note": return h("p", { class: "b b-note" }, b.t);
      case "dialogue": case "source": {
        const L = lignes(b.lignes).concat(b.ensuite && b.ensuite.length ? [h("div", { class: "b-t" }, h("span", { class: "b-tt" }, "Les fois suivantes")), ...lignes(b.ensuite)] : []);
        if (!L.length) return null;
        corps = h("div", { class: "b b-dialogue" }, entete(b), L); break;
      }
      case "secret": corps = h("div", { class: "b b-dialogue b-secret" }, h("div", { class: "b-t" }, h("span", { class: "b-tt" }, b.oeuf ? "Clin d'œil déclenché" : "Secret déclenché", b.cle ? [" : ", h("code", null, b.cle)] : null), etiquetteSi(b.si)), lignes(b.lignes)); break;
      case "fiche": corps = h("div", { class: "b b-fiche" + (b.cle ? " cle" : "") },
        h("div", { class: "fiche-tete" }, h("span", { class: "fiche-genre" }, b.cle ? [h("span", { html: icone("cle", 13) }), " Info clé"] : "Fiche savoir", b.sorte ? " · " + b.sorte : ""), h("strong", null, texteJeu(b.titre))),
        h("div", { class: "fiche-x" }, texteJeu(b.texte)), b.retiens ? h("div", { class: "fiche-r" }, h("span", { class: "etq" }, "À retenir"), texteJeu(b.retiens)) : null, refs(b.refs)); break;
      case "refs": corps = h("div", { class: "b" }, refs(b.refs)); break;
      case "question": case "choix": {
        const err = erreursDe(b.q);
        corps = h("div", { class: "b b-q" }, entete(b), b.ctx ? h("div", { class: "q-ctx" }, texteJeu(b.ctx)) : null,
          h("div", { class: "q-e" }, h("span", { class: "q-m" }, "Question"), texteJeu(b.q), err ? pastilleErreurs(err.n, pluriel(err.n, "mauvaise réponse", "mauvaises réponses") + " enregistrées") : null), reponses(b.rep, err)); break;
      }
      case "cases": {
        const err = erreursDe(b.q);
        corps = h("div", { class: "b b-q" }, entete(b), b.ctx ? h("div", { class: "q-ctx" }, texteJeu(b.ctx)) : null,
          h("div", { class: "q-e" }, h("span", { class: "q-m" }, "Cases à cocher"), texteJeu(b.q), err ? pastilleErreurs(err.n) : null), reponses(b.rep, null), b.bravo ? h("div", { class: "fb fb-ok" }, h("span", { class: "etq" }, "si c'est réussi"), texteJeu(b.bravo)) : null); break;
      }
      case "formulaire": corps = h("div", { class: "b b-q" }, entete(b), b.ctx ? h("div", { class: "q-ctx" }, texteJeu(b.ctx)) : null,
        (b.champs || []).map((c) => (c.calc !== undefined ? h("div", null, calcule(c.calc || "champs calculés")) : h("div", { class: "champ" }, h("div", { class: "q-e" }, h("span", { class: "q-m" }, "Liste"), texteJeu(c.label)), reponses(c.rep)))),
        b.bravo ? h("div", { class: "fb fb-ok" }, h("span", { class: "etq" }, "si c'est réussi"), texteJeu(b.bravo)) : null); break;
      case "ordre": corps = h("div", { class: "b b-q" }, entete(b), b.ctx ? h("div", { class: "q-ctx" }, texteJeu(b.ctx)) : null,
        h("div", { class: "q-e" }, h("span", { class: "q-m" }, "À remettre dans l'ordre"), texteJeu(b.q)),
        Array.isArray(b.etapes) && b.etapes.length ? h("ol", { class: "ordre" }, b.etapes.map((e) => h("li", null, texteJeu(e)))) : b.etapes && b.etapes._x ? h("div", null, calcule(b.etapes._x)) : null,
        b.bravo ? h("div", { class: "fb fb-ok" }, h("span", { class: "etq" }, "si c'est réussi"), texteJeu(b.bravo)) : null); break;
      case "info": corps = h("div", { class: "b b-info" }, entete(b), h("div", { class: "info-x" }, texteJeu(b.html)), b.bouton ? h("span", { class: "faux-bouton" }, texteJeu(b.bouton)) : null); break;
      case "suite": corps = h("div", { class: "b b-suite" }, h("div", { class: "b-t" }, h("span", { class: "b-tt" }, "Panneau : ", b.titre ? texteJeu(b.titre) : "sans titre"), h("span", { class: "muet" }, " · " + pluriel(b.etapes.length, "écran")), etiquetteSi(b.si)),
        h("ol", { class: "etapes" }, b.etapes.map((e) => h("li", null, bloc(e) || calcule("écran calculé"))))); break;
      case "atelier": {
        const A = b.reglages || {};
        if (A._x !== undefined) { corps = h("div", { class: "b b-atelier" }, entete(b, "Manipulation"), h("p", { class: "muet" }, "Réglages : ", calcule(A._x))); break; }
        const reg = Array.isArray(A.reglages) ? A.reglages : A.reglages && A.reglages._appel && A.reglages.args[0] && A.reglages.args[0].retour ? [A.reglages.args[0].retour] : [];
        const missions = Array.isArray(A.missions) ? A.missions : [];
        const reste = Object.fromEntries(Object.entries(A).filter(([k]) => !["reglages", "missions", "legende", "suivi", "etat"].includes(k)));
        corps = h("div", { class: "b b-atelier" }, h("div", { class: "b-t" }, h("span", { class: "b-tt" }, "Manipulation", b.titre ? [" : ", texteJeu(b.titre)] : null), etiquetteSi(b.si)),
          A.legende ? h("p", { class: "muet" }, texteJeu(A.legende)) : null,
          reg.length ? h("div", { class: "reglages" }, h("span", { class: "etq" }, "Ce qu'on règle"), h("ul", null, reg.map((r) => h("li", null, texteJeu(r.nom) || calcule("réglage"), r.note ? [h("span", { class: "muet" }, " · "), texteJeu(r.note)] : null, Array.isArray(r.choix) ? [" : ", r.choix.map((c, i) => [i ? ", " : "", texteJeu(Array.isArray(c) ? c[1] : c && c.nom !== undefined ? c.nom : c)])] : null)))) : null,
          missions.length ? h("ol", { class: "etapes" }, missions.map((m) => h("li", null, h("div", { class: "b b-q" }, h("div", { class: "b-t" }, h("span", { class: "b-tt" }, texteJeu(m.t) || "Mission"), m.xp ? h("span", { class: "muet" }, " · +" + m.xp + " XP") : null),
            m.html ? h("div", { class: "info-x" }, texteJeu(m.html)) : null, m.bouton ? h("span", { class: "faux-bouton" }, texteJeu(m.bouton)) : null,
            m.bravo ? h("div", { class: "fb fb-ok" }, h("span", { class: "etq" }, "si c'est réussi"), texteJeu(m.bravo)) : null, m.indice ? h("div", { class: "fb fb-ko" }, h("span", { class: "etq" }, "sinon, l'indice"), texteJeu(m.indice)) : null)))) : null,
          arbre(reste, 1));
        break;
      }
      case "donnees": { const a = arbre(b.valeur, 0, !!b.filet); if (!a) return null; corps = h("div", { class: "b b-donnees" }, h("div", { class: "b-t" }, h("span", { class: "b-tt" }, b.titre || (b.filet ? "Autres textes" : "Textes")), h("code", { class: "muet" }, b.nom), etiquetteSi(b.si)), a); break; }
      case "texte": { const t = texteJeu(b.t); if (!t) return null; corps = h("div", { class: "b b-texte" }, entete(b), h("div", { class: "texte-x" }, t)); break; }
      case "toast": corps = h("div", { class: "b b-toast" }, h("span", { class: "etq" }, "Message éclair"), h("span", { class: "toast-x" }, texteJeu(b.t)), etiquetteSi(b.si)); break;
      case "groupe": { const L = (b.blocs || []).map(bloc).filter(Boolean); if (!L.length) return null; corps = h("div", { class: "b b-groupe" }, entete(b), L); break; }
      case "signature": corps = h("div", { class: "b b-toast" }, h("span", { class: "etq" }, "Écran"), "La signature du mandat (le joueur signe à l'écran)"); break;
      case "calcule": corps = h("div", { class: "b b-toast" }, h("span", { class: "etq" }, "Écran calculé"), calcule(b.code)); break;
      case "defi": return null;
      default: return null;
    }
    if (b.suite && b.suite.length) { const S = b.suite.map(bloc).filter(Boolean); if (S.length) corps.append(h("div", { class: "puis" }, h("span", { class: "puis-t" }, "puis"), S)); }
    return corps;
  }

  // ---------------------------------------------------------------- la pastille et le détail
  function pastille(n) {
    const perso = ["dresseur", "champion", "habitant"].includes(n.genre) || (n.genre === "fiche" && n.pal);
    const ic = perso ? portrait(n.pal) : icone(n.genre === "secret" && /^oeufs?|^egg/.test(n.id) ? "oeuf" : n.genre === "champion" ? "joueur" : n.genre === "habitant" ? "joueur" : n.genre);
    return h("button", { class: `noeud g-${n.genre}${n.cle ? " cle" : ""}${perso ? " perso" : ""}${n.technique ? " technique" : ""}`, type: "button", "data-n": n.id, "aria-expanded": "false", title: n.titre + (n.sous ? " · " + n.sous : "") },
      h("span", { class: "pastille", html: ic }), n.genre === "champion" ? h("span", { class: "etoile", "aria-hidden": "true" }, "★") : null, n.cle ? h("span", { class: "clef", "aria-hidden": "true", html: icone("cle", 11) }) : null,
      h("span", { class: "n-t" }, n.titre), n.sous ? h("span", { class: "n-s" }, n.sous) : null, h("span", { class: "n-suivi", "data-suivi": n.id }));
  }
  function detail(n, rang) {
    const B = n.blocs.map(bloc).filter(Boolean);
    return h("section", { class: "detail", "data-detail": n.id, tabindex: "-1" },
      h("header", { class: "detail-tete" }, h("div", null, h("h3", null, n.titre), h("p", { class: "muet" }, [rang.titre, n.sous].filter(Boolean).join(" · "))),
        h("div", { class: "detail-actions" },
          n.essai ? h("a", { class: "bouton plein", href: "../jeu/#essai-" + n.essai, target: "_blank", rel: "noopener", title: "Ouvre le jeu à cet endroit, dans un nouvel onglet. Rien n'est enregistré." }, h("span", { html: icone("jouer", 13) }), " Tester ici") : null,
          h("button", { class: "bouton", type: "button", "data-copier": "#n=" + n.id, title: "Copier l'adresse de cette pastille" }, h("span", { html: icone("lien", 14) }), " Lien"),
          h("button", { class: "bouton", type: "button", "data-fermer": "1", "aria-label": "Refermer" }, h("span", { html: icone("fermer", 14) })))),
      h("div", { class: "detail-suivi", "data-suivi-detail": n.id }),
      B.length ? B : h("p", { class: "muet" }, "Rien à lire ici : tout est calculé par le jeu."));
  }
  return { texteJeu, bloc, pastille, detail, condition };
}

/** Surligne un mot cherché dans un morceau de page. */
export function surligner(racine, terme) {
  if (!terme || terme.length < 2) return;
  const sans = (s) => s.normalize("NFD").replace(/\p{M}/gu, "").toLowerCase(), t = sans(terme);
  const w = document.createTreeWalker(racine, NodeFilter.SHOW_TEXT), L = [];
  while (w.nextNode()) if (sans(w.currentNode.nodeValue).includes(t)) L.push(w.currentNode);
  L.forEach((n) => {
    const s = n.nodeValue, bas = sans(s);
    if (bas.length !== s.length) return; // un caractère composé : on ne découpe pas au hasard
    const f = document.createDocumentFragment(); let i = 0, j;
    while ((j = bas.indexOf(t, i)) >= 0) { f.append(s.slice(i, j)); const m = document.createElement("mark"); m.textContent = s.slice(j, j + t.length); f.append(m); i = j + t.length; }
    f.append(s.slice(i)); n.replaceWith(f);
  });
}
