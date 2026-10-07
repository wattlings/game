/**
 * Suivi d'audience anonyme (Supabase), partagé par le cours et le jeu.
 *
 * Aucun cookie : un identifiant aléatoire (13 mois) par navigateur. Quand le joueur est connecté à son compte
 * (commun/compte.js), chaque événement porte aussi son identifiant (props.profil) : on peut alors compter les joueurs
 * par profil, d'un appareil à l'autre, et suivre ce que fait chacun. Sans compte, rien ne dit qui joue.
 * Ne fait rien tant que commun/config.js n'est pas renseigné, en navigation « Ne pas me pister »,
 * après un clic sur « Ne pas me compter », ou hors d'un site web (fichier local, aperçu, localhost).
 *
 * Chaque événement part dans la table « events » : vid, sid, name, page, device, lang, props, ref.
 */
import { compteActuel } from "./compte.js";
import { SUIVI } from "./config.js";
import { CLES_SUIVI, ecrire, lire, supprimer } from "./stockage.js";

const hote = location.hostname || "";
const surLeWeb = /^https?:$/.test(location.protocol) && !/claude|anthropic|localhost|127\.0\.0\.1/.test(hote);

const hasard = (n) => {
  const a = new Uint8Array(n);
  (crypto || window.msCrypto).getRandomValues(a);
  return [...a].map((b) => (b % 36).toString(36)).join("");
};

/** Le navigateur demande-t-il à ne pas être pisté ? */
export const nePasPister = () =>
  navigator.doNotTrack === "1" || window.doNotTrack === "1" || navigator.globalPrivacyControl === true;

/** Ce navigateur a-t-il cliqué sur « Ne pas me compter » ? */
export const aRefuse = () => lire(CLES_SUIVI.refus) === "1";

/** Le suivi est-il branché (réglages remplis, site en ligne) ? Sert à afficher ou non la mention. */
export const suiviBranche = () => !!SUIVI.url && surLeWeb;

/** Le suivi compte-t-il réellement ce navigateur ? */
export const suiviActif = () => !!(SUIVI.url && SUIVI.cle) && surLeWeb && !nePasPister() && !aRefuse();

function visiteur() {
  let v = null;
  try {
    v = JSON.parse(lire(CLES_SUIVI.visiteur) || "null");
  } catch {}
  if (!v || !v.id || Date.now() - v.t > 396 * 864e5) {
    v = { id: hasard(20), t: Date.now() };
    ecrire(CLES_SUIVI.visiteur, JSON.stringify(v));
  }
  return v.id;
}

let premierEvenement = false;
function session() {
  const maintenant = Date.now();
  const derniere = +lire(CLES_SUIVI.derniereActivite) || 0;
  let s = null;
  try {
    s = sessionStorage.getItem(CLES_SUIVI.session);
  } catch {}
  if (!s || maintenant - derniere > 30 * 6e4) {
    s = hasard(14);
    premierEvenement = true;
    try {
      sessionStorage.setItem(CLES_SUIVI.session, s);
    } catch {}
  }
  ecrire(CLES_SUIVI.derniereActivite, String(maintenant));
  return s;
}

const appareil = () => {
  const w = Math.min(screen.width || innerWidth, innerWidth || 9999);
  const tactile = matchMedia("(pointer:coarse)").matches;
  return tactile ? (w >= 700 ? "tablet" : "mobile") : w < 700 ? "mobile" : "desktop";
};

/** Le nom de la page en cours. Le cours le lit dans l'adresse (#etape-3) ; le jeu le fixe à « jeu ». */
let pageCourante = () => {
  const h = decodeURIComponent(location.hash.slice(1));
  return (h && !/^g-/.test(h) ? h : "accueil").slice(0, 80);
};

/** Chaque page règle le suivi à son démarrage. */
export function reglerSuivi({ page } = {}) {
  if (page) pageCourante = page;
  pageLue = pageCourante();
}

let file = [];
let minuterie = null;

function envoyer(options) {
  if (!file.length || !suiviActif()) return;
  const lignes = file.splice(0, 50);
  try {
    fetch(SUIVI.url.replace(/\/$/, "") + "/rest/v1/events", {
      method: "POST",
      keepalive: !!(options && options.balise),
      headers: { apikey: SUIVI.cle, "Content-Type": "application/json", Prefer: "return=minimal" },
      body: JSON.stringify(lignes),
    }).catch(() => {});
  } catch {}
}

/** Enregistre un événement (envoyé par paquets, au plus tard 4 secondes après). */
export function suivre(nom, props) {
  if (!suiviActif()) return;
  const s = session();
  const ligne = {
    vid: visiteur(),
    sid: s,
    name: nom,
    page: pageCourante(),
    device: appareil(),
    lang: (navigator.language || "").slice(0, 12),
    props: Object.assign({}, props || {}),
  };
  const profil = compteActuel();
  if (profil) ligne.props.profil = profil;
  if (premierEvenement) {
    premierEvenement = false;
    ligne.props.first = true;
    try {
      const r = document.referrer && new URL(document.referrer).hostname;
      ligne.ref = (r && r !== hote ? r : "").slice(0, 120);
    } catch {
      ligne.ref = "";
    }
  }
  for (const k in ligne.props) {
    const v = ligne.props[k];
    if (typeof v === "string") ligne.props[k] = v.slice(0, 120);
  }
  file.push(ligne);
  clearTimeout(minuterie);
  minuterie = setTimeout(envoyer, 4000);
  if (file.length >= 20) envoyer();
}

// ---- temps de lecture par page (temps visible uniquement)
let pageLue = pageCourante();
let tempsLu = 0;
let debutLecture = document.visibilityState === "visible" ? Date.now() : 0;

function solderLecture() {
  if (debutLecture) {
    tempsLu += Date.now() - debutLecture;
    debutLecture = document.visibilityState === "visible" ? Date.now() : 0;
  }
  const s = Math.round(tempsLu / 1000);
  if (s >= 3 && pageLue !== "jeu") suivre("read_time", { p: pageLue, s });
  tempsLu = 0;
}

/** À appeler quand la page affichée change : solde le temps de lecture et compte la nouvelle page. */
export function nouvellePage() {
  solderLecture();
  pageLue = pageCourante();
  debutLecture = document.visibilityState === "visible" ? Date.now() : 0;
  if (!/^jeu/.test(pageLue)) suivre("pageview");
}

addEventListener("visibilitychange", () => {
  if (document.visibilityState === "hidden") {
    solderLecture();
    envoyer({ balise: true });
  }
});
addEventListener("pagehide", () => {
  solderLecture();
  envoyer({ balise: true });
});
addEventListener("visibilitychange", () => {
  if (document.visibilityState === "visible") debutLecture = Date.now();
  else if (debutLecture) {
    tempsLu += Date.now() - debutLecture;
    debutLecture = 0;
  }
});

// ---- « Ne pas me compter »
export function refuserLeSuivi() {
  ecrire(CLES_SUIVI.refus, "1");
  file = [];
}
export function accepterLeSuivi() {
  supprimer(CLES_SUIVI.refus);
}

/** Petit message éphémère en haut de page. */
export function annoncer(texte) {
  const d = document.createElement("div");
  d.textContent = texte;
  d.style.cssText =
    "position:fixed;left:50%;top:16px;transform:translateX(-50%);z-index:2000;background:#0a1a33;color:#fff;padding:10px 16px;border-radius:10px;font:15px system-ui;box-shadow:0 6px 20px rgba(0,0,0,.3)";
  document.body.appendChild(d);
  setTimeout(() => d.remove(), 3500);
}
