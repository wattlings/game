/**
 * Le compte joueur : un identifiant et un mot de passe pour retrouver sa progression (cours et jeu)
 * sur n'importe quel appareil, partagé par le cours et le jeu.
 *
 * Le cours et le jeu continuent d'écrire dans le navigateur comme avant (commun/stockage.js). Quand quelqu'un
 * est connecté, ce module recopie les clés de CLES_SYNCHRONISEES vers le projet Supabase de commun/config.js,
 * et ramène dans le navigateur ce qui a été joué ailleurs. Pour chaque clé, la version la plus récente l'emporte.
 * Côté Supabase : outils/supabase/comptes-joueurs.sql (à installer une fois).
 *
 * Ce module doit être importé avant tout ce qui lit les sauvegardes : il note dès son chargement ce qui a changé
 * dans le navigateur depuis la dernière synchronisation.
 */
import { SUIVI } from "./config.js";
import { CLES_SYNCHRONISEES, CLE_COMPTE, CLE_COMPTE_SYNCHRO, ecrire, lire, supprimer } from "./stockage.js";

/** Les comptes sont-ils proposés (projet Supabase renseigné) ? */
export const comptesDisponibles = () => !!(SUIVI.url && SUIVI.cle);

const lireJSON = (cle) => {
  try {
    return JSON.parse(lire(cle) || "null");
  } catch {
    return null;
  }
};

/** Une empreinte courte d'une valeur, pour savoir si elle a changé sans en garder une copie. */
function empreinte(texte) {
  if (texte == null) return "-";
  let h1 = 0xdeadbeef,
    h2 = 0x41c6ce57;
  for (let i = 0; i < texte.length; i++) {
    const c = texte.charCodeAt(i);
    h1 = Math.imul(h1 ^ c, 2654435761);
    h2 = Math.imul(h2 ^ c, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  return texte.length + ":" + (h2 >>> 0).toString(36) + (h1 >>> 0).toString(36);
}

/** L'heure d'une sauvegarde de partie, si la valeur en est une : plus juste que l'heure où on remarque le changement. */
function heureDeLaPartie(valeur) {
  try {
    const p = JSON.parse(valeur);
    return p && typeof p.savedAt === "number" ? p.savedAt : 0;
  } catch {
    return 0;
  }
}

let compte = lireJSON(CLE_COMPTE); // { identifiant, jeton } ou null
// pour chaque clé : h = empreinte de la valeur au dernier passage, t = son heure, sale = pas encore envoyée
let synchro = lireJSON(CLE_COMPTE_SYNCHRO) || { cles: {}, verif: 0 };
if (!compte || !compte.jeton) compte = null;

const abonnes = new Set();
const prevenir = () => abonnes.forEach((f) => f(compteActuel()));

/** L'identifiant du joueur connecté, ou null. */
export const compteActuel = () => (compte ? compte.identifiant : null);

/** Prévient fn(identifiant ou null) à chaque connexion ou déconnexion. Renvoie de quoi se désabonner. */
export function surChangementDeCompte(fn) {
  abonnes.add(fn);
  return () => abonnes.delete(fn);
}

const enregistrerSynchro = () => ecrire(CLE_COMPTE_SYNCHRO, JSON.stringify(synchro));

/** Note les clés qui ont changé dans le navigateur depuis le dernier passage, à l'heure t. */
function releverChangements(t) {
  let sale = false;
  for (const cle of CLES_SYNCHRONISEES) {
    const valeur = lire(cle);
    const h = empreinte(valeur);
    const connue = synchro.cles[cle];
    if (!connue ? valeur != null : connue.h !== h) {
      synchro.cles[cle] = { h, t: Math.max(t, heureDeLaPartie(valeur)), sale: true };
    }
    if (synchro.cles[cle] && synchro.cles[cle].sale) sale = true;
  }
  synchro.verif = Date.now();
  enregistrerSynchro();
  return sale;
}

// ---- les appels au projet Supabase

class ErreurCompte extends Error {}

async function appeler(fonction, parametres, balise) {
  let r;
  try {
    r = await fetch(SUIVI.url.replace(/\/$/, "") + "/rest/v1/rpc/" + fonction, {
      method: "POST",
      keepalive: !!balise,
      headers: { apikey: SUIVI.cle, "Content-Type": "application/json" },
      body: JSON.stringify(parametres),
    });
  } catch {
    throw new ErreurCompte("hors_ligne");
  }
  if (r.status === 404) throw new ErreurCompte("pas_installe");
  if (!r.ok) throw new ErreurCompte("serveur");
  const reponse = await r.json().catch(() => ({ erreur: "serveur" }));
  if (reponse && reponse.erreur) {
    const e = new ErreurCompte(reponse.erreur);
    e.secondes = reponse.secondes;
    throw e;
  }
  return reponse;
}

/** Le message à montrer pour une erreur des fonctions ci-dessous. */
export function messageErreur(e) {
  const code = e && e.message;
  return (
    {
      hors_ligne: "Impossible de joindre le serveur. Vérifie ta connexion à Internet.",
      pas_installe: "Les comptes ne sont pas encore installés sur ce site.",
      serveur: "Le serveur a rencontré un problème. Réessaie dans un instant.",
      identifiant_invalide: "L'identifiant doit faire de 3 à 30 caractères : lettres sans accent, chiffres, point, tiret ou tiret bas.",
      mot_de_passe_invalide: "Le mot de passe doit faire au moins 8 caractères.",
      identifiant_pris: "Cet identifiant est déjà pris. Choisis-en un autre, ou connecte-toi si c'est le tien.",
      identifiants_incorrects: "Identifiant ou mot de passe incorrect.",
      trop_d_essais: `Trop d'essais : réessaie dans ${Math.ceil((e.secondes || 300) / 60)} minute(s).`,
      trop_d_inscriptions: "Beaucoup de comptes viennent d'être créés : réessaie dans quelques minutes.",
      session_expiree: "Ta connexion a expiré : reconnecte-toi.",
      trop_volumineux: "La sauvegarde est trop volumineuse pour être envoyée.",
    }[code] || "Une erreur inattendue s'est produite."
  );
}

// ---- la synchronisation

let enCours = null;
let encore = false;

/**
 * Envoie ce qui a changé ici et ramène ce qui a changé ailleurs.
 * Renvoie la liste des clés réécrites dans le navigateur (vide si rien n'est venu d'ailleurs).
 */
export async function synchroniser({ balise = false } = {}) {
  if (!compte || !comptesDisponibles()) return [];
  if (enCours) {
    encore = true;
    return enCours;
  }
  enCours = (async () => {
    releverChangements(Date.now());
    const envoi = {};
    for (const [cle, etat] of Object.entries(synchro.cles)) {
      if (etat.sale) envoi[cle] = { v: lire(cle), t: etat.t };
    }
    const corps = { p_jeton: compte.jeton, p_donnees: envoi };
    // une page qui se ferme ne peut envoyer que de petits paquets (64 ko) ; au-delà, on tente un envoi normal
    const petit = JSON.stringify(corps).length < 60000;
    let reponse;
    try {
      reponse = await appeler("wattlings_synchroniser", corps, balise && petit);
    } catch (e) {
      if (e.message === "session_expiree") oublierCompte();
      throw e;
    }
    const reecrites = [];
    for (const [cle, d] of Object.entries(reponse.donnees || {})) {
      if (!CLES_SYNCHRONISEES.includes(cle) || !d) continue;
      const v = d.v == null ? null : String(d.v);
      const hServeur = empreinte(v);
      const hIci = empreinte(lire(cle));
      const connue = synchro.cles[cle];
      if (hIci === hServeur) {
        synchro.cles[cle] = { h: hServeur, t: d.t };
      } else if (connue && connue.h !== hIci) {
        // modifiée ici pendant l'échange : elle partira au prochain passage
      } else if (!connue || !connue.sale || d.t > connue.t) {
        if (v == null) supprimer(cle);
        else ecrire(cle, v);
        synchro.cles[cle] = { h: hServeur, t: d.t };
        reecrites.push(cle);
      }
    }
    enregistrerSynchro();
    return reecrites;
  })();
  try {
    return await enCours;
  } finally {
    enCours = null;
    if (encore) {
      encore = false;
      synchroniser().catch(() => {});
    }
  }
}

// ---- connexion, inscription, déconnexion

function oublierCompte() {
  compte = null;
  synchro = { cles: {}, verif: 0 };
  supprimer(CLE_COMPTE);
  supprimer(CLE_COMPTE_SYNCHRO);
  prevenir();
}

/**
 * Se connecter (ou créer le compte si creer est vrai), puis réunir ce navigateur et le compte.
 * Ce qui est déjà dans ce navigateur rejoint le compte, sauf si le compte a mieux : pour une partie du jeu,
 * la plus récente l'emporte ; pour le reste (cours, réglages), c'est celle du compte.
 * Renvoie la liste des clés réécrites dans le navigateur (la page doit alors se recharger pour les afficher).
 */
export async function seConnecter(identifiant, motDePasse, { creer = false } = {}) {
  const r = await appeler(creer ? "wattlings_inscription" : "wattlings_connexion", {
    p_identifiant: identifiant,
    p_mot_de_passe: motDePasse,
  });
  compte = { identifiant: r.identifiant, jeton: r.jeton };
  ecrire(CLE_COMPTE, JSON.stringify(compte));
  synchro = { cles: {}, verif: 0 };
  releverChangements(0); // heure 0 : le compte l'emporte, sauf pour les parties (leur heure de sauvegarde)
  prevenir();
  demarrer();
  return synchroniser().catch(() => []);
}

/**
 * Se déconnecter : envoie les derniers changements, puis efface de ce navigateur tout ce qui suit le compte,
 * pour que la personne suivante sur cet appareil ne le retrouve pas.
 * Sans forcer, refuse (lève une erreur) si les derniers changements n'ont pas pu partir.
 */
export async function seDeconnecter({ forcer = false } = {}) {
  if (!compte) return;
  try {
    await synchroniser();
  } catch (e) {
    if (!forcer && e.message !== "session_expiree") throw e;
  }
  if (compte) appeler("wattlings_deconnexion", { p_jeton: compte.jeton }).catch(() => {});
  CLES_SYNCHRONISEES.forEach(supprimer);
  oublierCompte();
}

// ---- en arrière-plan, tant que quelqu'un est connecté

let reglages = {
  /** Les clés que la page garde en mémoire : si l'une change ailleurs, la page se recharge pour l'afficher. */
  cles: CLES_SYNCHRONISEES,
  /** La page peut-elle se recharger maintenant ? */
  peutRecharger: () => true,
};

/** Chaque page règle le compte à son démarrage : voir `reglages` ci-dessus. */
export function reglerCompte(r) {
  Object.assign(reglages, r);
}

const MARQUE_RECHARGE = "wattlings-compte-recharge";
function rechargerSiBesoin(reecrites) {
  if (!reecrites.some((c) => reglages.cles.includes(c)) || !reglages.peutRecharger()) return;
  try {
    // jamais deux fois en 20 secondes : pas de boucle si deux appareils se renvoient la balle
    if (Date.now() - (+sessionStorage.getItem(MARQUE_RECHARGE) || 0) < 20000) return;
    sessionStorage.setItem(MARQUE_RECHARGE, String(Date.now()));
  } catch {
    return;
  }
  location.reload();
}

const enFond = (options) =>
  synchroniser(options)
    .then(rechargerSiBesoin)
    .catch(() => {});

let enMarche = false;
function demarrer() {
  if (enMarche || !compte || !comptesDisponibles()) return;
  enMarche = true;
  let tour = 0;
  setInterval(() => {
    tour++;
    // un envoi dès qu'il y a du nouveau ici (vérifié toutes les 20 s), et des nouvelles d'ailleurs chaque minute
    if (!compte || document.visibilityState !== "visible") return;
    if (releverChangements(Date.now()) || tour % 3 === 0) enFond();
  }, 20000);
  addEventListener("visibilitychange", () => {
    if (!compte) return;
    if (document.visibilityState === "hidden") synchroniser({ balise: true }).catch(() => {});
    else enFond();
  });
  addEventListener("pagehide", () => synchroniser({ balise: true }).catch(() => {}));
}

if (compte && comptesDisponibles()) {
  // ce qui a changé ici depuis la dernière visite (hors connexion, page fermée trop vite) date au plus tard de là
  releverChangements(synchro.verif || 0);
  enFond();
  demarrer();
}
