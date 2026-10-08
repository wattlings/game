// Briques communes aux outils de vérification : navigateur de test, hasard et horloge fixés, clics au hasard.
import { chromium } from "playwright";
import { servir } from "./serveur.mjs";

export async function demarrer() {
  const serveur = await servir(0);
  const navigateur = await chromium.launch();
  // chaque contexte (un « appareil ») est connecté à un compte d'essai, sauf si on demande { sansCompte: true }
  const nouveau = navigateur.newContext.bind(navigateur);
  navigateur.newContext = async ({ sansCompte = false, ...options } = {}) => {
    const contexte = await nouveau(options);
    if (!sansCompte) await compteDEssai(contexte);
    return contexte;
  };
  return { adresse: serveur.adresse, navigateur, fermer: async () => { await navigateur.close(); await serveur.fermer(); } };
}

/**
 * Connecte un contexte à un compte d'essai : le site croit parler à Supabase (commun/compte.js), mais les appels
 * sont interceptés et servis ici, comme le ferait outils/supabase/comptes-joueurs.sql. Rien ne sort de la machine.
 */
export async function compteDEssai(contexte, identifiant = "essai") {
  const donnees = {};
  await contexte.addInitScript((c) => {
    try {
      if (!localStorage.getItem("wattlings-compte")) localStorage.setItem("wattlings-compte", JSON.stringify({ identifiant: c, jeton: "jeton-d-essai" }));
    } catch {} // about:blank : pas de stockage
  }, identifiant);
  await contexte.route(/\/rest\/v1\/rpc\/wattlings_/, async (route) => {
    const fonction = route.request().url().split("/").pop();
    const p = JSON.parse(route.request().postData() || "{}");
    let reponse = { ok: true };
    if (fonction === "wattlings_connexion" || fonction === "wattlings_inscription") reponse = { identifiant, jeton: "jeton-d-essai" };
    if (fonction === "wattlings_synchroniser") {
      for (const [cle, d] of Object.entries(p.p_donnees || {})) if (!donnees[cle] || d.t >= donnees[cle].t) donnees[cle] = d;
      reponse = { donnees };
    }
    await route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify(reponse) });
  });
}

/** Relève les erreurs d'une page (erreurs de script, messages d'erreur de la console, fichiers introuvables). */
export function ecouterErreurs(page, liste = []) {
  page.on("pageerror", (e) => liste.push("erreur de script : " + e.message));
  page.on("console", (m) => { if (m.type() === "error") liste.push("console : " + m.text()); });
  page.on("response", (r) => { if (r.status() >= 400) liste.push(r.status() + " " + r.url()); });
  return liste;
}

/** À injecter avant le chargement d'une page : hasard reproductible. */
export const hasardFixe = () => {
  let s = 4242;
  Math.random = () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; };
};

/** À injecter avant le chargement d'une page : hasard reproductible ET horloge à l'arrêt.
    Le temps n'avance que par __avance(ms), image par image (1/60 s) : deux pages jouent alors exactement la même partie. */
export const hasardEtHorlogeFixes = () => {
  let s = 4242;
  Math.random = () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; };
  let now = 1773307800000;
  const t0 = now, PAS = 1000 / 60, VraieDate = Date;
  class FausseDate extends VraieDate { constructor(...a) { if (a.length === 0) super(now); else super(...a); } static now() { return now; } }
  window.Date = FausseDate;
  performance.now = () => now - t0;
  let id = 1, images = [], image = 0;
  const minuteries = new Map();
  window.setTimeout = (fn, ms = 0, ...args) => { const i = id++; minuteries.set(i, { due: now + Math.max(0, +ms || 0), fn, args, seq: i }); return i; };
  window.clearTimeout = (i) => { minuteries.delete(i); };
  window.setInterval = (fn, ms, ...args) => { const i = id++; const armer = () => minuteries.set(i, { due: now + Math.max(1, +ms || 0), fn: () => { armer(); fn(...args); }, args: [], seq: id++ }); armer(); return i; };
  window.clearInterval = window.clearTimeout;
  window.requestAnimationFrame = (fn) => { const i = id++; images.push({ i, fn }); return i; };
  window.cancelAnimationFrame = (i) => { images = images.filter((r) => r.i !== i); };
  window.__avance = (ms) => {
    const fin = now + ms;
    for (;;) {
      const prochaineImage = t0 + (image + 1) * PAS;
      let m = null;
      for (const [i, t] of minuteries) if (t.due <= fin && (!m || t.due < m.due || (t.due === m.due && t.seq < m.seq))) m = { ...t, i };
      const img = prochaineImage <= fin;
      if (!m && !img) break;
      if (m && (!img || m.due <= prochaineImage)) { now = Math.max(now, m.due); minuteries.delete(m.i); try { m.fn(...m.args); } catch (e) { console.error(String((e && e.stack) || e)); } }
      else { now = prochaineImage; image++; const cour = images; images = []; for (const r of cour) { try { r.fn(now - t0); } catch (e) { console.error(String((e && e.stack) || e)); } } }
    }
    now = fin;
  };
};

/** Générateur de nombres reproductible côté outil. */
export function tirage(graine) {
  let g = graine >>> 0;
  return () => { g = (g * 1103515245 + 12345) >>> 0; return g / 4294967296; };
}

export const ROUTES_COURS = ["accueil", "ecole", "glossaire", "quiz-final", "sources", "patrimoine", ...[1, 2, 3, 4, 5, 6, 7, 8].flatMap((i) => [`etape-${i}-essentiel`, `etape-${i}-comprendre`, `etape-${i}-approfondir`])];

/** Dans la page du cours : le contenu affiché, sans les passerelles vers le jeu ni la mention de suivi. */
export const contenuCours = () => {
  const c = document.getElementById("contenu").cloneNode(true);
  c.querySelectorAll(".qk-band,.qk-privacy").forEach((e) => e.remove());
  return c.innerHTML.replace(/\s+/g, " ");
};

/** Dans la page du cours : nombre d'éléments manipulables visibles. */
export const nbCiblesCours = () =>
  [...document.getElementById("contenu").querySelectorAll("button, input, select, summary")].filter((e) => !e.matches("[role=tab],[data-aller]") && !e.closest(".qk-band,.qk-privacy") && e.offsetParent !== null).length;
/** Dans la page du cours : manipule le i-ème élément (clic, curseur, liste, saisie) et dit lequel. */
export const agirCours = (i) => {
  const els = [...document.getElementById("contenu").querySelectorAll("button, input, select, summary")].filter((e) => !e.matches("[role=tab],[data-aller]") && !e.closest(".qk-band,.qk-privacy") && e.offsetParent !== null);
  const e = els[i % els.length];
  if (!e) return "rien";
  const d = e.tagName + (e.id ? "#" + e.id : "") + "." + e.className + ":" + (e.textContent || "").trim().slice(0, 30);
  const signaler = () => { e.dispatchEvent(new Event("input", { bubbles: true })); e.dispatchEvent(new Event("change", { bubbles: true })); };
  if (e.tagName === "SELECT") { e.selectedIndex = (e.selectedIndex + 1) % e.options.length; signaler(); }
  else if (e.tagName === "INPUT" && (e.type === "range" || e.type === "number")) { const min = +e.min || 0, max = +e.max || 100; e.value = String(Math.round(min + (max - min) * (((i * 37) % 100) / 100))); signaler(); }
  else if (e.tagName === "INPUT" && (e.type === "text" || e.type === "search")) { e.value = ["3000 1234 5678 90", "kwh", "GI123456", ""][i % 4]; signaler(); }
  else e.click();
  return d;
};

/** Dans la page du jeu (ou la version 18) : un résumé de tout ce qui se voit et se sauvegarde. */
export const etatJeu = () => {
  const r = document.getElementById("qk-host").shadowRoot;
  const h = (t) => { let x = 0; for (let i = 0; i < t.length; i++) x = (x * 31 + t.charCodeAt(i)) | 0; return x; };
  return {
    partie: JSON.stringify(S),
    joueur: [P.x, P.y, P.dir, Math.round(P.px), Math.round(P.py)].join(","),
    image: tick,
    occupe: busy,
    dialogue: dlg.open,
    panneaux: h(r.getElementById("layer").innerHTML),
    bandeau: r.querySelector(".hud").textContent.replace(/\s+/g, " "),
    objectif: r.getElementById("objective").textContent,
    tailleEcran: r.getElementById("screen").width + "x" + r.getElementById("screen").height,
    ecran: h(r.getElementById("screen").toDataURL()),
  };
};

/** Dans la page du jeu : clique un élément visible des panneaux, choisi par r (entre 0 et 1), hors liens vers le cours. */
export const agirJeu = (r) => {
  const racine = document.getElementById("qk-host").shadowRoot;
  const els = [...racine.querySelectorAll("#layer button, #layer input, #layer select, #layer [data-i], #layer [data-k], #layer [role=button], #layer .opt, #layer li[draggable]")].filter((e) => e.offsetParent !== null && !/cours|↗/i.test((e.className || "") + " " + (e.textContent || "").slice(0, 40)));
  if (!els.length) return "(rien)";
  const e = els[Math.floor(r * els.length)];
  const d = e.tagName + "." + (e.className || "") + ":" + (e.textContent || e.value || "").trim().slice(0, 25);
  const signaler = () => { e.dispatchEvent(new Event("input", { bubbles: true })); e.dispatchEvent(new Event("change", { bubbles: true })); };
  if (e.tagName === "SELECT") { e.selectedIndex = (e.selectedIndex + 1) % e.options.length; signaler(); }
  else if (e.tagName === "INPUT" && /range|number/.test(e.type)) { const min = +e.min || 0, max = +e.max || 100; e.value = String(Math.round(min + (max - min) * r)); signaler(); }
  else if (e.tagName === "INPUT" && /text|search|^$/.test(e.type)) { e.value = ["30001234567890", "2000", "Mairie", "12 rue Jean-Jaurès"][Math.floor(r * 4)]; signaler(); }
  else e.click();
  return d;
};

export const TOUCHES = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"];
export const avancer = (page, ms) => page.evaluate((d) => __avance(d), ms);
/** Valide l'écran de l'avatar s'il est affiché. */
/** Passe la vidéo d'introduction et la présentation du début de partie (si elles sont là), puis valide l'avatar proposé. */
export const validerAvatar = (page) => page.evaluate(() => {
  const r = document.getElementById("qk-host").shadowRoot;
  r.querySelector(".iv-passer")?.click();
  r.getElementById("prSkip")?.click();
  r.getElementById("avOk")?.click();
});
