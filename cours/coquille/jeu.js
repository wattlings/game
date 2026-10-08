/**
 * Passerelles du cours vers le jeu. Le cours passe d'abord : le bandeau « Mode jeu » vient en fin d'étape (« mettre en pratique »),
 * et le lien « Le jeu » de la barre du haut devient « Reprendre le jeu » quand une partie existe.
 * Le cours ne charge pas le jeu : ce sont de simples liens vers la page voisine jeu/.
 * (Les classes commencent par « qk- », du premier nom du jeu : La Quête du Kilowatt.)
 */
import { CHAPITRES_JEU, ETAPES_DE_BASE, chapitresDeLEtape } from "../../commun/donnees/etapes.js";
import { AVATAR_DEFAUT } from "../../commun/images/avatar-defaut.js";
import { adresseJeu, allerAuJeu } from "../../commun/liens.js";
import { CLE_AVATAR, lire, partieEnCours } from "../../commun/stockage.js";
import { esc } from "../../commun/texte.js";

/** L'avatar du joueur (ou celui par défaut tant qu'aucune partie n'existe), dessiné point par point. */
function avatar() {
  const c = document.createElement("canvas");
  c.width = 20;
  c.height = 20;
  c.className = "qk-sprite";
  c.setAttribute("aria-hidden", "true");
  const image = new Image();
  image.onload = () => c.getContext("2d").drawImage(image, 0, 0);
  image.src = (partieEnCours() && lire(CLE_AVATAR)) || AVATAR_DEFAUT;
  return c;
}

/** Un lien vers le jeu. suite : "" (écran titre), "reprendre" ou "chapitre-3". */
function lienJeu(suite, classe) {
  const a = document.createElement("a");
  a.className = classe;
  a.href = adresseJeu(suite);
  a.dataset.jeu = suite;
  return a;
}

/**
 * Le bandeau « Mode jeu ». chapitres : les chapitres proposés, ou null pour un seul bouton « Lancer le jeu ».
 * direct : sans partie en cours, un seul bouton « Commencer le jeu » (le début), et ces chapitres en liens secondaires,
 * pour qui veut aller droit à l'étape.
 */
function bandeau(surtitre, titre, texte, chapitres, direct) {
  const b = document.createElement("section");
  b.className = "qk-band";
  b.setAttribute("aria-label", "Le jeu");
  b.appendChild(avatar());
  const t = document.createElement("div");
  t.className = "qk-band-txt";
  t.innerHTML = `<span class="qk-eyebrow">${surtitre}</span><h3>${titre}</h3><p>${texte}</p>`;
  b.appendChild(t);
  const actions = document.createElement("div");
  actions.className = "qk-band-act";
  if (direct) {
    const debut = lienJeu("", "qk-play");
    debut.innerHTML = "▶ Commencer le jeu<small>Depuis le début : ton bureau, Mme Joule, le choix de ton site</small>";
    actions.appendChild(debut);
    const p = document.createElement("p");
    p.className = "qk-direct";
    p.append("ou aller directement à : ");
    direct.forEach((ch, i) => {
      const l = lienJeu("chapitre-" + ch, "");
      l.textContent = CHAPITRES_JEU[ch].titre;
      if (i) p.append(" · ");
      p.append(l);
    });
    actions.appendChild(p);
    b.appendChild(actions);
    return b;
  }
  (chapitres || [null]).forEach((ch) => {
    const lien = lienJeu(ch === null ? "" : "chapitre-" + ch, "qk-play");
    lien.innerHTML =
      ch === null
        ? "▶ Lancer le jeu"
        : `▶ ${esc(CHAPITRES_JEU[ch].titre)}<small>${esc(CHAPITRES_JEU[ch].resume)}</small>`;
    actions.appendChild(lien);
  });
  b.appendChild(actions);
  return b;
}

/** Met à jour le lien du jeu dans la barre du haut : « Le jeu » ou « Reprendre le jeu ». */
function majBoutonJeu() {
  const f = document.getElementById("qk-jeu");
  if (!f) return;
  const partie = partieEnCours();
  f.textContent = partie ? "Reprendre le jeu" : "Le jeu";
  f.href = adresseJeu(partie ? "reprendre" : "");
  f.dataset.jeu = partie ? "reprendre" : "";
}

let enAttente = false;

/** Pose, selon la page affichée, le bandeau « Mode jeu » : après la leçon, juste avant les étapes voisines. */
function poser() {
  enAttente = false;
  const c = document.getElementById("contenu");
  if (!c) return;
  majBoutonJeu();
  if (c.querySelector(".qk-band")) return;
  const enFin = (b) => { const pager = c.querySelector(".pager"); if (pager) pager.before(b); else c.append(b); };
  const h = decodeURIComponent(location.hash.slice(1)) || "accueil";
  const m = h.match(/^etape-(\d)/);
  if (m) {
    const n = +m[1];
    const chapitres = chapitresDeLEtape(n);
    if (!chapitres.length) return;
    const enCours = !!partieEnCours();
    const b = bandeau(
      "Mettre en pratique · étape " + n,
      `Joue « ${ETAPES_DE_BASE[n - 1].titre} » dans Wattlings`,
      !enCours
        ? "Le jeu reprend tout le parcours en 8 étapes, version RPG. Le bouton « ← Cours » du jeu te ramène ici à tout moment."
        : chapitres.length > 1
          ? "Cette étape se joue en deux temps : le repérage, puis l’arène. Le jeu reprend directement au bon endroit, avec ton avatar et ton site."
          : "Le jeu reprend directement au bon endroit, avec ton avatar et ton site. Le bouton « ← Cours » du jeu te ramène ici à tout moment.",
      chapitres,
      enCours ? null : chapitres,
    );
    if (n === 8)
      b.querySelector(".qk-band-txt").insertAdjacentHTML(
        "beforeend",
        '<p><a href="#patrimoine">Et après ? Lire « Piloter un patrimoine » →</a></p>',
      );
    enFin(b);
  } else if (h === "patrimoine") {
    if (!c.querySelector(".etape-head")) return;
    enFin(
      bandeau(
        "Mettre en pratique · chapitre 10",
        "Pilote les 20 sites dans Wattlings",
        "Six missions au PC patrimoine de l’hôtel de ville : périmètre, Pareto, coût et CO₂, activités, bâtiments similaires, priorités.",
        [10],
      ),
    );
  } else if (h === "ecole") {
    enFin(
      bandeau(
        "Le jeu Wattlings",
        "Visite l’école dans le jeu",
        "Choisis l’école Jean-Jaurès au début du jeu : mêmes chiffres, mêmes compteurs, mêmes pièges.",
        [0],
      ),
    );
  }
}

/** Les anciens liens (#jeu, #jeu-3) menaient au jeu quand il vivait dans la page du cours : on y conduit toujours. */
export function ancienLienVersJeu(route) {
  const m = route.match(/^jeu(?:-(\d{1,2}|vignette))?$/);
  if (!m) return false;
  allerAuJeu(!m[1] ? "" : m[1] === "vignette" ? "vignette" : "chapitre-" + Math.min(11, +m[1]), { remplacer: true });
  return true;
}

/** À appeler une fois au démarrage du cours. */
export function brancherJeu() {
  // les pages se redessinent souvent : le bandeau est reposé à chaque changement du contenu
  new MutationObserver(() => {
    if (!enAttente) {
      enAttente = true;
      requestAnimationFrame(poser);
    }
  }).observe(document.body, { childList: true, subtree: true });
  // au retour du jeu, le libellé du lien peut avoir changé
  addEventListener("pageshow", majBoutonJeu);
  addEventListener("storage", majBoutonJeu);
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) majBoutonJeu();
  });
  poser();
}
