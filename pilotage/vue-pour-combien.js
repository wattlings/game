/**
 * Pilotage · vue-pour-combien.js
 * L'onglet « Pour combien ? » : les questions de Mme Combien (jeu/recit/pour-combien.js) et ce qu'ont répondu les joueurs.
 *
 * Les réponses sont les événements « pour_combien » de la table « events » (q = id de la question, eur = montant,
 * jamais = 1), lus par l'onglet « Les joueurs » : il faut d'abord s'y connecter. Chaque joueur compte une fois par question,
 * avec sa dernière réponse ; un joueur, c'est son profil s'il est connecté, sinon son navigateur (anonyme).
 */
import { h, nombre, pluriel, remplir } from "./rendu.js";

const texte = (x) => (x && typeof x === "object" && "_t" in x ? x.v : x);
const slug = (t) => String(t).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 40);
/** La liste du jeu (POUR_COMBIEN_LISTE : « identifiant | question », une par ligne), lue comme le jeu la lit. */
export const lireListe = (t) => String(texte(t) || "").replace(/\\n/g, "\n").split("\n").map((l) => l.trim()).filter(Boolean)
  .map((l) => { const i = l.indexOf("|"); return i > 0 ? { id: slug(l.slice(0, i)), q: l.slice(i + 1).trim() } : { id: slug(l), q: l }; }).filter((x) => x.id && x.q);
const euros = (v) => (v === null || v === undefined ? "–" : v.toLocaleString("fr-FR", { maximumFractionDigits: 2 }) + " €");
const mediane = (L) => { if (!L.length) return null; const s = L.slice().sort((a, b) => a - b), m = s.length >> 1; return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2; };
const jour = (d) => (d ? d.toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" }) : "");

/** Les réponses, la dernière par joueur et par question : Map id → Map joueur → { eur | jamais, profil, d }. */
export function reponsesPourCombien(lignes, dateDe) {
  const R = new Map();
  (lignes || []).filter((l) => l.name === "pour_combien").map((l) => ({ l, d: dateDe(l) })).sort((a, b) => (a.d || 0) - (b.d || 0)).forEach(({ l, d }) => {
    const p = l.props && typeof l.props === "object" ? l.props : {};
    if (!p.q) return;
    const eur = typeof p.eur === "number" && isFinite(p.eur) && p.eur >= 0 ? p.eur : null;
    if (eur === null && !p.jamais) return;
    const qui = p.profil ? "p:" + p.profil : "v:" + (l.vid || "?");
    if (!R.has(p.q)) R.set(p.q, new Map());
    R.get(p.q).set(qui, { eur, jamais: eur === null, profil: p.profil || null, d });
  });
  return R;
}

/** questions : le texte POUR_COMBIEN_LISTE lu dans le fichier du jeu. */
export function monterPourCombien(racine, { questions, dateDe }) {
  const Q = lireListe(questions);
  let lignes = null, exemple = false;

  function rafraichir() {
    const R = lignes ? reponsesPourCombien(lignes, dateDe) : new Map();
    const ids = Q.map((x) => x.id).concat([...R.keys()].filter((id) => !Q.some((x) => x.id === id))); // aussi les questions retirées depuis
    const carte = (id) => {
      const def = Q.find((x) => x.id === id), M = R.get(id) || new Map(), L = [...M.values()];
      const montants = L.filter((r) => !r.jamais).map((r) => r.eur), jamais = L.filter((r) => r.jamais).length;
      const moy = montants.length ? montants.reduce((a, b) => a + b, 0) / montants.length : null;
      const profils = [...M.entries()].filter(([, r]) => r.profil).sort((a, b) => (a[1].jamais ? Infinity : a[1].eur) - (b[1].jamais ? Infinity : b[1].eur));
      const tuile = (v, nom, sous) => h("div", { class: "tuile" }, h("strong", null, v), h("span", null, nom), sous ? h("small", null, sous) : null);
      return h("section", { class: "bloc-page" },
        h("h3", null, def ? def.q : "(question retirée du jeu)"),
        h("p", { class: "muet" }, "Identifiant : ", h("code", null, id)),
        lignes ? [
          h("div", { class: "tuiles" },
            tuile(euros(moy), "prix moyen", montants.length ? pluriel(montants.length, "montant donné", "montants donnés") : "aucun montant"),
            tuile(euros(mediane(montants)), "prix médian", "la moitié demande moins"),
            tuile(nombre(L.length), L.length > 1 ? "joueurs ont répondu" : "joueur a répondu", pluriel(L.length - profils.length, "anonyme")),
            tuile(nombre(jamais), "« Jamais de la vie »", L.length ? Math.round((jamais / L.length) * 100) + " % des réponses" : "")),
          montants.length ? h("p", { class: "muet" }, `De ${euros(Math.min(...montants))} à ${euros(Math.max(...montants))}. Une seule réponse extrême suffit à tirer la moyenne : regarde aussi la médiane.`) : null,
          profils.length ? h("details", { class: "en-tableau" }, h("summary", null, "Les réponses par profil (" + profils.length + ")"),
            h("table", null, h("thead", null, h("tr", null, ["Profil", "Réponse", "Le"].map((t) => h("th", null, t)))),
              h("tbody", null, profils.map(([, r]) => h("tr", null, h("td", null, r.profil), h("td", { class: "num" }, r.jamais ? "Jamais de la vie" : euros(r.eur)), h("td", { class: "muet" }, jour(r.d))))))) : null,
        ] : null);
    };
    remplir(racine,
      h("section", { class: "bloc-page" },
        h("h2", null, "Pour combien ?"),
        h("p", null, "Mme Combien attend sur la place de la Donnée, devant la fontaine. À chaque visite, elle tire au hasard une question à laquelle le joueur n'a pas encore répondu (toutes faites : elle recommence). Le joueur donne un montant en euros, ou « Jamais de la vie »."),
        h("p", { class: "muet" }, "Ajouter, retirer ou réécrire une question : dans « Le parcours », section « La ville », pastille « Mme Combien », allume « Modifier les textes » et clique la liste. Une question par ligne, sous la forme « identifiant | la question », par exemple « sans-chauffage | Pour combien tu passes l'hiver sans chauffage ? ». Puis dépose le fichier depuis « Mes modifications », comme pour les autres textes. Garde l'identifiant d'une question quand tu réécris son texte : c'est lui qui relie ses réponses."),
        lignes ? h("p", { class: "muet" }, exemple ? "Données d'exemple : connecte-toi dans l'onglet « Les joueurs » pour lire les vraies réponses." : "Chaque joueur compte une fois par question, avec sa dernière réponse. Sans profil, un joueur est compté par navigateur, anonymement. Les joueurs qui ont refusé d'être comptés ne sont pas enregistrés.")
          : h("p", { class: "bandeau" }, "Pour voir les réponses, connecte-toi d'abord dans l'onglet « Les joueurs » : elles viennent des mêmes événements.")),
      ids.length ? ids.map(carte) : h("p", null, "Aucune question dans le jeu."));
  }
  rafraichir();
  return { recevoir: (L, ex) => { lignes = L; exemple = !!ex; rafraichir(); }, rafraichir };
}
