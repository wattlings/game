/**
 * Pilotage · duree.js
 * Une estimation du temps de jeu, chapitre par chapitre, calculée à partir de ce que la page lit dans les fichiers du jeu.
 *
 * Le modèle (les constantes ci-dessous se règlent ici) :
 *   - lecture : les répliques, fiches et questions du chemin principal, à LECTURE mots par seconde,
 *     plus PAR_REPLIQUE secondes par réplique (le texte qui s'écrit, l'appui sur A) ;
 *   - réflexion : un temps par question, case à cocher, remise en ordre, champ de formulaire, manipulation ;
 *   - duels : le jeu tire une question au hasard parmi celles du dresseur : une seule est comptée ;
 *   - déplacements : un temps par endroit où il faut se rendre (info clé, scène, porte d'arène, dresseur…) ;
 *   - au chapitre 0, le démarrage : écran titre, présentation, avatar (DEMARRAGE).
 * La fourchette basse suit le chemin obligatoire ; la haute ajoute les hésitations et les erreurs (MARGE), et les fiches
 * facultatives. Ce qui ne se voit qu'en dehors du chemin (répliques des fois suivantes, à la reprise, sans fiche à
 * donner) n'est pas compté. Le temps réellement mesuré chez les joueurs est dans l'onglet « Les joueurs ».
 */
import { lisible, textesDe } from "./lecture.js";

const LECTURE = 200 / 60;      // mots par seconde : un lecteur moyen, à l'écran
const PAR_REPLIQUE = 1;        // secondes par réplique : le texte qui s'écrit, l'appui sur A
const REFLEXION = { question: 10, choix: 10, cases: 15, ordre: 15, champ: 8, atelier: 60, mission: 20, signature: 10, calcule: 15 };
const MARCHE = { fiche: 35, facultative: 30, scene: 15, porte: 30, dresseur: 15, champion: 15, epreuve: 20, depart: 20 };
const MARGE = 1.35;            // hésitations, mauvaises réponses, retours en arrière
/* le démarrage, hors des fichiers de l'histoire : écran titre, présentation (qu'on peut passer), choix de l'avatar ; compté au chapitre 0 */
const DEMARRAGE = { min: 90, max: 180 };

/* ce qui ne se voit pas sur le chemin principal */
const HORS_CHEMIN = /reprise|autres cas|fois suivantes|n'a pas \(ou plus\)|L'objectif affiché|indice du menu/i;

const mots = (v) => { if (v === undefined || v === null) return 0; const T = typeof v === "string" ? [v] : v && v._t ? [v] : textesDe(v);
  return T.map((t) => (typeof t === "string" ? t : lisible(t))).join(" ").replace(/⟨[^⟩]*⟩/g, " x ").split(/\s+/).filter(Boolean).length; };
const lire = (v) => mots(v) / LECTURE;

/** Le temps d'un bloc (en secondes). duel : ne compter qu'une question. */
function bloc(b, duel = { vu: false }) {
  if (!b || (b.titre && HORS_CHEMIN.test(lisible(b.titre)))) return 0;
  let s = 0;
  switch (b.genre) {
    case "dialogue": case "source": s = (b.lignes || []).reduce((t, l) => t + lire(l.t) + PAR_REPLIQUE, 0); break;
    case "fiche": s = lire(b.titre) + lire(b.texte) + lire(b.retiens) + PAR_REPLIQUE; break;
    case "info": case "texte": s = lire(b.html ?? b.t) + PAR_REPLIQUE; break;
    case "question": case "choix": {
      if (b.genre === "question") { if (duel.vu) return 0; duel.vu = true; }
      const rep = b.rep || [], une = rep.find((r) => r.ok) || rep[0] || {};
      s = lire(b.ctx) + lire(b.q) + rep.reduce((t, r) => t + lire(r.t), 0) + lire(une.fb) + REFLEXION[b.genre]; break;
    }
    case "cases": s = lire(b.ctx) + lire(b.q) + (b.rep || []).reduce((t, r) => t + lire(r.t), 0) + lire(b.bravo) + REFLEXION.cases; break;
    case "ordre": s = lire(b.ctx) + lire(b.q) + (Array.isArray(b.etapes) ? b.etapes.reduce((t, e) => t + lire(e) + 3, 0) : 10) + lire(b.bravo) + REFLEXION.ordre; break;
    case "formulaire": s = lire(b.ctx) + (b.champs || []).reduce((t, c) => t + lire(c.label) + (c.rep || c.opts || []).length * 1.5 + REFLEXION.champ, 0) + lire(b.bravo); break;
    case "atelier": { const A = b.reglages || {}, M = Array.isArray(A.missions) ? A.missions : [];
      s = REFLEXION.atelier + lire(A.legende) + M.reduce((t, m) => t + lire(m.t) + lire(m.html) + lire(m.bravo) + REFLEXION.mission, 0); break; }
    case "suite": s = (b.etapes || []).reduce((t, e) => t + bloc(e, duel), 0); break;
    case "groupe": s = (b.blocs || []).reduce((t, e) => t + bloc(e, duel), 0); break;
    case "secret": s = (b.lignes || []).reduce((t, l) => t + lire(l.t) + PAR_REPLIQUE, 0); break;
    case "signature": s = REFLEXION.signature; break;
    case "calcule": s = REFLEXION.calcule; break;
    default: s = 0;
  }
  return s + (b.suite || []).reduce((t, e) => t + bloc(e, duel), 0);
}

/** Le temps d'un nœud : { s (secondes), facultatif }. */
export function dureeNoeud(n) {
  const facultatif = n.genre === "secret" || (n.genre === "fiche" && !n.cle);
  if (n.genre === "porte") return { s: MARCHE.porte, facultatif };
  const duel = { vu: false };
  const lecture = (n.blocs || []).reduce((t, b) => t + (b.genre === "note" ? 0 : bloc(b, duel)), 0);
  const marche = n.genre === "fiche" ? (n.cle ? MARCHE.fiche : MARCHE.facultative) : MARCHE[n.genre] ?? MARCHE.scene;
  return { s: lecture + marche, facultatif };
}

/** L'estimation d'un rang (un chapitre, un site de voyage) : { min, max } en secondes. */
export function estimerRang(r) {
  let oblig = 0, fac = 0;
  r.noeuds.forEach((n) => { const d = dureeNoeud(n); if (d.facultatif) fac += d.s; else oblig += d.s; });
  const debut = r.suivi && r.suivi.ch === 0 ? DEMARRAGE : { min: 0, max: 0 };
  return { min: oblig + debut.min, max: oblig * MARGE + fac + debut.max };
}

/** Une somme d'estimations. */
export const additionner = (L) => L.reduce((t, e) => ({ min: t.min + e.min, max: t.max + e.max }), { min: 0, max: 0 });

/** « ≈ 9 à 13 min », « ≈ 2 h 10 à 3 h » : arrondi à la minute (à 5 min au-delà d'une heure). */
export function texteDuree({ min, max }) {
  const m = (s) => { const x = s / 60, r = x >= 60 ? Math.round(x / 5) * 5 : Math.max(1, Math.round(x)); return r; };
  const f = (x) => (x < 60 ? x + " min" : Math.floor(x / 60) + " h" + (x % 60 ? " " + String(x % 60).padStart(2, "0") : ""));
  const a = m(min), b = Math.max(m(max), a);
  return a === b ? "≈ " + f(a) : "≈ " + (a < 60 && b >= 60 ? f(a) : f(a).replace(/ min$/, "")) + " à " + f(b);
}

/** Les réglages, pour les afficher dans la page. */
export const MODELE = { LECTURE: Math.round(LECTURE * 60), PAR_REPLIQUE, MARGE };
