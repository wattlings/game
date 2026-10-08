/**
 * Pilotage · vue-profils.js
 * Dans l'onglet « Les joueurs » : la liste des profils (les comptes des joueurs) et, pour chacun, le journal de ce qu'il a
 * fait, visite par visite, dans le cours comme dans le jeu. Les événements viennent de pilotage/suivi.js (agreger).
 */
import { h, nombre, pluriel, remplir } from "./rendu.js";
import { dateDe, estDuJeu } from "./suivi.js";

const APPAREILS = { desktop: "ordinateur", mobile: "mobile", tablet: "tablette" };
const jourHeure = (d) => d.toLocaleString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" });
const heure = (d) => d.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
const date = (d) => (d ? d.toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" }) : "–");
const duree = (s) => (s < 90 ? Math.round(s) + " s" : s < 5400 ? Math.round(s / 60) + " min" : (s / 3600).toFixed(1).replace(".", ",") + " h");
const g = (t) => "« " + String(t) + " »";

/** Les noms lisibles, tirés du parcours : chapitres, fiches, secrets, sites de voyage. */
function index(P) {
  const ch = {}, fiches = {}, secrets = {}, sites = {};
  P.sections.forEach((sec) => sec.rangs.forEach((r) => {
    const s = r.suivi || {};
    if (s.ch !== undefined) ch[s.ch] = r.titre;
    if (s.site) sites[s.site] = r.titre;
    r.noeuds.forEach((n) => { const u = n.suivi || {}; if (u.fiche) fiches[u.fiche] = n.titre; if (u.secret) secrets[u.secret] = n.titre; });
  }));
  return { ch, fiches, secrets, sites };
}

/** Une phrase pour un événement : [genre (jeu, cours, compte), texte]. */
function decrire(l, I) {
  const p = l.props && typeof l.props === "object" ? l.props : {}, chap = (c) => (I.ch[c] ? I.ch[c] : "chapitre " + c), site = (s) => I.sites[s] || s;
  const pg = (x) => (!x || x === "accueil" ? "l'accueil du cours" : /^etape-(\d)/.test(x) ? "l'étape " + x.match(/^etape-(\d)/)[1] + " du cours" + (x.includes("/") ? " (" + x.split("/").slice(1).join(" › ") + ")" : "") : g(x));
  const T = {
    account_signup: ["compte", "Crée son profil"], account_login: ["compte", "Se connecte à son profil"], account_logout: ["compte", "Se déconnecte"],
    pageview: ["cours", "Ouvre " + pg(l.page)], read_time: ["cours", "Lit " + pg(p.p) + " pendant " + duree(p.s || 0)],
    course_tab: ["cours", "Passe au niveau " + g(p.niv)], demo_use: ["cours", "Manipule la démo " + g(p.demo)], glossary_open: ["cours", "Ouvre le glossaire : " + g(p.term)],
    quiz_answer: ["cours", "Répond au quiz" + (p.q || p.question ? " " + g(p.q || p.question) : "") + (p.ok === true ? " : juste" : p.ok === false ? " : faux" : "")],
    game_open: ["jeu", "Ouvre le jeu" + (p.from === "cours" ? " depuis le cours" : "")], game_new: ["jeu", "Commence une nouvelle partie" + (p.hades ? " (mode Hadès)" : "")],
    game_continue: ["jeu", "Reprend sa partie (" + chap(p.ch) + ")"], game_guest: ["jeu", "Joue sans profil"], game_restart: ["jeu", "Recommence sa partie"], slot_erase: ["jeu", "Efface sa partie"],
    game_end: ["jeu", "Termine l'histoire : arrivé à l'épilogue"], video: ["jeu", p.fin === "passee" ? "Passe la vidéo d'introduction (au bout de " + p.s + " s)" : "Regarde la vidéo d'introduction jusqu'au bout"], intro: ["jeu", p.passee ? "Passe la présentation (page " + p.vue + ")" : "Lit la présentation jusqu'au bout"],
    avatar: ["jeu", "Choisit son avatar"], site_choice: ["jeu", "Choisit son site : " + (p.site || "?")], aide: ["jeu", "Voit l'aide " + g(p.k)], menu: ["jeu", "Ouvre le menu → " + (p.k || "?")],
    chapter_start: ["jeu", (p.via === "reprise" ? "Reprend au " : p.via === "jump" ? "Saute au " : "Arrive au ") + chap(p.ch)], chapter_end: ["jeu", "Termine " + chap(p.ch) + (p.s ? " en " + duree(p.s) : "")],
    jump: ["jeu", "Saute à " + chap(p.ch)], fiche: ["jeu", "Trouve la fiche " + g(I.fiches[p.id] || p.id)], badge: ["jeu", "Gagne le badge " + g(p.name)],
    battle: ["jeu", "Duel " + (p.a ? "contre " + p.a : "") + " : " + ({ win: "gagné", lose: "perdu", flee: "fuite" }[p.r] || p.r)],
    wrong_answer: ["jeu", "Se trompe" + (p.t ? " (" + p.t + ")" : "") + " : " + g(p.q) + (p.a ? " → " + g(p.a) : "")],
    secret: ["jeu", "Trouve le secret " + g(I.secrets[p.id] || p.id)], mission: ["jeu", "Termine la mission " + (p.n || "") + (p.titre ? " " + g(p.titre) : "")], evolve: ["jeu", "Passe au rang " + p.rank],
    setting: ["jeu", "Réglage : " + p.k + " = " + p.v], guest_leave: ["jeu", "Quitte sans profil : " + ({ profil: "crée un profil", quitter: "quitte sans enregistrer", rester: "reste" }[p.choix] || p.choix)],
    game_to_course: ["jeu", "Va au cours : " + pg(p.target)],
    voyage_train: ["jeu", "Prend le train vers " + site(p.vers)], voyage_info: ["jeu", "Trouve une info à " + site(p.site)], voyage_defi: ["jeu", "Commence le défi de " + site(p.site)],
    voyage_tampon: ["jeu", "Obtient le tampon de " + site(p.site)], voyage_sim: ["jeu", "Essaie le simulateur " + g(p.sim) + " (" + site(p.site) + ")"], voyage_passeport: ["jeu", "Reçoit le passeport des énergies"],
  }[l.name];
  return T || [estDuJeu(l.name) ? "jeu" : "cours", l.name];
}

/** Le journal d'un profil : ses visites, de la plus récente à la plus ancienne, et ce qu'il y a fait. */
function journal(F, I, { cours }) {
  const L = F.lignes.filter((l) => cours || l.name.startsWith("account_") || estDuJeu(l.name)).map((l) => ({ l, d: dateDe(l) })).sort((a, b) => (a.d || 0) - (b.d || 0));
  const visites = [];
  for (const x of L) { const k = (x.l.sid || "") + "|" + x.l.vid, v = visites.at(-1); if (v && v.k === k) v.L.push(x); else visites.push({ k, L: [x] }); }
  if (!visites.length) return h("p", { class: "muet" }, "Aucune action sur la période.");
  return h("div", { class: "journal" }, visites.reverse().map((v, i) => {
    const d0 = v.L[0].d, d1 = v.L.at(-1).d, l0 = v.L[0].l, s = d0 && d1 ? (d1 - d0) / 1000 : 0;
    return h("details", { class: "visite", open: i === 0 },
      h("summary", null, h("strong", null, d0 ? jourHeure(d0) : "Sans date"), h("span", { class: "muet" }, [APPAREILS[l0.device] || l0.device, s >= 60 ? duree(s) : "", pluriel(v.L.length, "action")].filter(Boolean).join(" · "))),
      h("ol", { class: "actions" }, v.L.map(({ l, d }) => { const [genre, t] = decrire(l, I); return h("li", { class: "action a-" + genre }, h("time", null, d ? heure(d) : ""), h("span", { class: "genre" }, genre), h("span", null, t)); })));
  }));
}

/** Les actions d'un profil, en CSV (séparateur point-virgule, pour un tableur réglé en français). */
function csv(F, I) {
  const q = (v) => '"' + String(v ?? "").replace(/"/g, '""') + '"';
  const L = F.lignes.map((l) => ({ l, d: dateDe(l) })).sort((a, b) => (a.d || 0) - (b.d || 0));
  const lignes = [["date", "visite", "navigateur", "appareil", "genre", "action", "événement", "détails"].join(";"), ...L.map(({ l, d }) => { const [genre, t] = decrire(l, I); const { profil, ...reste } = l.props || {}; return [d ? d.toISOString() : "", l.sid, l.vid, l.device, genre, t, l.name, JSON.stringify(reste)].map(q).join(";"); })];
  const a = h("a", { href: URL.createObjectURL(new Blob(["﻿" + lignes.join("\n")], { type: "text/csv" })), download: "wattlings-" + F.id + ".csv" });
  document.body.append(a); a.click(); a.remove();
}

/** La section « Les profils » : un champ de recherche, la liste, puis le journal du profil choisi. */
export function sectionProfils(A, { P }) {
  const I = index(P), F = [...A.profils.values()].sort((a, b) => (b.dernier || 0) - (a.dernier || 0));
  const chap = (c) => (c < 0 ? "–" : (P.sections.find((s) => s.id === "histoire").rangs.find((r) => r.suivi && r.suivi.ch === c) || { num: c }).num);
  const detail = h("div", { class: "profil-detail" }), liste = h("tbody"), compte = h("p", { class: "muet", role: "status" });
  const cherche = h("input", { type: "search", placeholder: "Chercher un profil…", "aria-label": "Chercher un profil", autocomplete: "off", spellcheck: "false" });
  let choisi = null, cours = true;

  const montrerProfil = (p) => {
    choisi = p;
    [...liste.children].forEach((tr) => tr.classList.toggle("choisi", tr.dataset.profil === p.id));
    const temps = p.lignes.filter((l) => l.name === "chapter_end" && l.props && l.props.s > 0 && l.props.s < 4 * 3600).reduce((t, l) => t + l.props.s, 0);
    const caseCours = h("input", { type: "checkbox", checked: cours, onchange: () => { cours = caseCours.checked; montrerProfil(p); } });
    remplir(detail, h("section", { class: "bloc-page", "aria-labelledby": "profil-titre" },
      h("div", { class: "profil-tete" }, h("h3", { id: "profil-titre" }, "👤 " + p.id),
        h("button", { class: "bouton", type: "button", onclick: () => csv(p, I) }, "Télécharger ses actions (CSV)")),
      h("p", { class: "muet" }, [pluriel(p.navigateurs.size, "navigateur"), [...p.appareils].map((a) => APPAREILS[a] || a).join(", "), pluriel(p.visites.size, "visite"), "du " + date(p.premier) + " au " + date(p.dernier)].filter(Boolean).join(" · ")),
      h("div", { class: "tuiles" },
        h("div", { class: "tuile" }, h("strong", null, p.fini ? "Épilogue" : p.chMax < 0 ? "–" : "Ch. " + chap(p.chMax)), h("span", null, p.fini ? "histoire terminée" : "le plus loin dans l'histoire"), p.chMax >= 0 && I.ch[p.chMax] ? h("small", null, I.ch[p.chMax]) : null),
        h("div", { class: "tuile" }, h("strong", null, temps ? duree(temps) : "–"), h("span", null, "de jeu dans les chapitres terminés")),
        h("div", { class: "tuile" }, h("strong", null, nombre(p.fiches.size)), h("span", null, "fiches trouvées")),
        h("div", { class: "tuile" }, h("strong", null, nombre(p.badges.size)), h("span", null, "badges")),
        h("div", { class: "tuile" }, h("strong", null, nombre(p.erreurs)), h("span", null, "mauvaises réponses"))),
      h("div", { class: "profil-filtre" }, h("label", null, caseCours, " Montrer aussi le cours"), h("span", { class: "muet" }, pluriel(p.jeu, "action") + " dans le jeu, " + pluriel(p.cours, "action") + " dans le cours")),
      journal(p, I, { cours })));
  };

  const afficher = () => {
    const q = cherche.value.trim().toLowerCase(), T = F.filter((p) => !q || p.id.includes(q)), V = T.slice(0, 100);
    remplir(liste, V.map((p) => h("tr", { "data-profil": p.id, class: choisi === p ? "choisi" : "" },
      h("td", null, h("button", { class: "lien", type: "button", onclick: () => { montrerProfil(p); detail.scrollIntoView({ behavior: "smooth", block: "start" }); } }, p.id)),
      h("td", { class: "num" }, nombre(p.navigateurs.size)), h("td", { class: "num" }, nombre(p.visites.size)),
      h("td", null, p.fini ? "Épilogue" : p.chMax < 0 ? "–" : "Ch. " + chap(p.chMax)),
      h("td", { class: "num" }, nombre(p.jeu + p.cours)), h("td", { class: "muet" }, date(p.premier)), h("td", { class: "muet" }, date(p.dernier)))));
    compte.textContent = T.length > V.length ? `${nombre(V.length)} profils affichés sur ${nombre(T.length)} : affine la recherche.` : q ? pluriel(T.length, "profil trouvé", "profils trouvés") : "";
  };
  cherche.addEventListener("input", afficher);
  afficher();

  return h("section", { class: "bloc-page profils" },
    h("h3", null, "Les profils"),
    h("p", { class: "muet" }, "Chaque joueur connecté à son compte, avec ce qu'il a fait d'un appareil à l'autre. Un clic sur un profil ouvre son journal : ses visites, de la plus récente à la plus ancienne, et chacune de ses actions."),
    F.length ? [h("div", { class: "profils-recherche" }, cherche, compte),
      h("div", { class: "defile" }, h("table", { class: "table-large" }, h("thead", null, h("tr", null, ["Profil", "Navigateurs", "Visites", "Le plus loin", "Actions", "Première venue", "Dernière venue"].map((t) => h("th", null, t)))), liste)), detail]
      : h("p", { class: "muet" }, "Aucun profil sur la période : aucun joueur connecté à son compte n'a encore été compté. Les événements ne portent le profil que depuis cette version du site."));
}
