/**
 * Pilotage · suivi.js
 * Ce que les joueurs font dans le jeu, lu dans la table « events » du projet Supabase (celle que remplit commun/suivi.js).
 *
 * La lecture demande une connexion (adresse e-mail et mot de passe d'un utilisateur créé dans Supabase) : la clé
 * « publishable » du site sait écrire des événements, pas les relire. Le mot de passe n'est gardé nulle part ;
 * le jeton de connexion reste en mémoire et disparaît quand on ferme la page.
 */
import { lisible } from "./lecture.js";

const racineDe = (url) => String(url || "").trim().replace(/\/+$/, "");

/** Se connecter : renvoie le jeton. */
export async function connecter({ url, cle, email, mdp }) {
  let r;
  try {
    r = await fetch(racineDe(url) + "/auth/v1/token?grant_type=password", { method: "POST", headers: { apikey: cle, "Content-Type": "application/json" }, body: JSON.stringify({ email, password: mdp }) });
  } catch { throw new Error("Le projet Supabase ne répond pas. Vérifie son adresse (https://….supabase.co) et ta connexion."); }
  const j = await r.json().catch(() => ({}));
  if (!r.ok || !j.access_token) {
    const m = String(j.error_description || j.msg || j.message || j.error || "");
    if (/invalid login|invalid_grant|credentials/i.test(m)) throw new Error("Adresse ou mot de passe refusés.");
    if (/api key|apikey/i.test(m) || r.status === 401) throw new Error("La clé du projet est refusée. C'est la clé « publishable » qu'il faut, celle de commun/config.js.");
    if (/not confirmed/i.test(m)) throw new Error("Cet utilisateur n'est pas confirmé. Dans Supabase : Authentication, Users, puis confirme-le.");
    throw new Error("Connexion refusée" + (m ? " : " + m : " (" + r.status + ")."));
  }
  return j.access_token;
}

/** Lire les événements, par paquets de 1 000. surProgres(n) est appelé à chaque paquet. */
export async function charger({ url, cle, jeton, depuis, surProgres, plafond = 60000 }) {
  const base = racineDe(url) + "/rest/v1/events", H = { apikey: cle, Authorization: "Bearer " + jeton };
  // l'ordre : par date (la colonne s'appelle « ts » dans la table du projet ; « created_at » ailleurs), sinon par numéro, sinon tel quel
  const essais = ["ts", "created_at", "id", null];
  for (const ordre of essais) {
    const lignes = [];
    let rate = false;
    for (let debut = 0; debut < plafond; debut += 1000) {
      const q = new URLSearchParams({ select: "*", limit: "1000", offset: String(debut) });
      if (ordre) q.set("order", ordre + ".asc");
      if ((ordre === "ts" || ordre === "created_at") && depuis) q.set(ordre, "gte." + depuis.toISOString());
      let r;
      try { r = await fetch(base + "?" + q, { headers: H }); } catch { throw new Error("La lecture s'est interrompue. Vérifie ta connexion et recommence."); }
      if (r.status === 400 && debut === 0 && ordre) { rate = true; break; } // cette colonne n'existe pas : on essaie autrement
      if (r.status === 401 || r.status === 403) throw new Error("Lecture refusée. Il manque sans doute la règle de lecture sur la table « events » (voir l'encadré plus bas).");
      if (!r.ok) throw new Error("Lecture impossible (" + r.status + ").");
      const L = await r.json();
      lignes.push(...L);
      if (surProgres) surProgres(lignes.length);
      if (L.length < 1000) break;
    }
    if (!rate) return lignes;
  }
  return [];
}

const dateDe = (l) => { const d = l.ts || l.created_at || l.inserted_at || l.date || l.t; const x = d ? new Date(d) : null; return x && !isNaN(x) ? x : null; };
const mediane = (L) => { if (!L.length) return null; const s = L.slice().sort((a, b) => a - b), m = s.length >> 1; return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2; };

/** Les chiffres : qui est arrivé où, ce qui a été trouvé, ce qui a été raté. */
export function agreger(lignes, { depuis } = {}) {
  const A = {
    evenements: 0, joueurs: new Set(), nouvelles: new Set(), finies: new Set(), chapitres: {}, fiches: {}, duels: {}, badges: {}, erreurs: new Map(), nbErreurs: 0,
    secrets: {}, trains: {}, infos: {}, tampons: {}, defis: {}, sims: {}, sites: {}, passeports: new Set(), premier: null, dernier: null, sansDate: false,
  };
  const ens = (o, k) => (o[k] ||= new Set());
  for (const l of lignes) {
    const d = dateDe(l);
    if (!d) A.sansDate = true;
    if (d && depuis && d < depuis) continue;
    const p = l.props && typeof l.props === "object" ? l.props : {}, v = l.vid, n = l.name;
    if (!n || !v) continue;
    const duJeu = /^(game_|chapter_|fiche$|battle$|badge$|wrong_answer$|secret$|voyage_|site_choice$|mission$|evolve$|jump$)/.test(n);
    if (!duJeu) continue;
    A.evenements++;
    A.joueurs.add(v);
    if (d) { if (!A.premier || d < A.premier) A.premier = d; if (!A.dernier || d > A.dernier) A.dernier = d; }
    switch (n) {
      case "game_new": A.nouvelles.add(v); break;
      case "game_end": A.finies.add(v); break;
      case "chapter_start": if (Number.isInteger(p.ch)) (A.chapitres[p.ch] ||= { debut: new Set(), fin: new Set(), durees: [] }).debut.add(v); break;
      case "chapter_end": if (Number.isInteger(p.ch)) { const c = (A.chapitres[p.ch] ||= { debut: new Set(), fin: new Set(), durees: [] }); c.fin.add(v); if (p.s > 0 && p.s < 4 * 3600) c.durees.push(p.s); } break;
      case "fiche": if (p.id) ens(A.fiches, p.id).add(v); break;
      case "battle": { const k = String(p.a); const x = (A.duels[k] ||= { win: 0, lose: 0, flee: 0 }); if (p.r in x) x[p.r]++; break; }
      case "badge": if (p.name) ens(A.badges, p.name).add(v); break;
      case "wrong_answer": {
        const q = String(p.q || "").replace(/\s+/g, " ").trim(); if (!q) break;
        A.nbErreurs++;
        const e = A.erreurs.get(q) || { n: 0, t: p.t || "", q, joueurs: new Set(), reponses: new Map() };
        e.n++; e.joueurs.add(v); const a = String(p.a || "").replace(/\s+/g, " ").trim(); if (a) e.reponses.set(a, (e.reponses.get(a) || 0) + 1);
        A.erreurs.set(q, e); break;
      }
      case "secret": if (p.id) ens(A.secrets, p.id).add(v); break;
      case "voyage_train": if (p.vers) ens(A.trains, p.vers).add(v); break;
      case "voyage_info": if (p.site && p.id) ens(A.infos, p.site + "." + p.id).add(v); break;
      case "voyage_tampon": if (p.site) ens(A.tampons, p.site).add(v); break;
      case "voyage_defi": if (p.site) ens(A.defis, p.site).add(v); break;
      case "voyage_sim": if (p.site) ens(A.sims, p.site + "." + p.sim).add(v); break;
      case "voyage_passeport": A.passeports.add(v); break;
      case "site_choice": if (p.site) ens(A.sites, p.site).add(v); break;
    }
  }
  A.mediane = (ch) => { const c = A.chapitres[ch]; return c ? mediane(c.durees) : null; };
  return A;
}

/** Ce qu'il faut afficher près d'un rang ou d'une pastille (texte court), ou rien. */
export function etiquettes(A, P) {
  const n = (S) => (S ? S.size : 0), rangs = {}, noeuds = {};
  const duree = (s) => (s === null ? "" : s < 90 ? Math.round(s) + " s" : Math.round(s / 60) + " min");
  P.sections.forEach((sec) => sec.rangs.forEach((r) => {
    const s = r.suivi || {};
    if (s.ch !== undefined) { const c = A.chapitres[s.ch]; if (c && c.debut.size) { const m = A.mediane(s.ch); rangs[r.id] = `${n(c.debut)} arrivés · ${Math.round((100 * n(c.fin)) / n(c.debut))} % le terminent${m ? " · " + duree(m) : ""}`; } }
    if (s.site) { const t = n(A.trains[s.site]); if (t || n(A.tampons[s.site])) rangs[r.id] = `${t} voyageurs · ${n(A.tampons[s.site])} tampons`; }
    r.noeuds.forEach((nd) => {
      const u = nd.suivi || {}; let t = "";
      if (u.fiche) t = n(A.fiches[u.fiche]) ? n(A.fiches[u.fiche]) + " l'ont" : "";
      else if (u.duel) { const d = A.duels[u.duel.slice(0, 100)]; if (d && d.win + d.lose) t = Math.round((100 * d.win) / (d.win + d.lose)) + " % gagnent"; }
      else if (u.badge) t = n(A.badges[u.badge]) ? n(A.badges[u.badge]) + " badges" : "";
      else if (u.info) t = n(A.infos[u.info]) ? n(A.infos[u.info]) + " l'ont" : "";
      else if (u.defi) t = n(A.defis[u.defi]) || n(A.tampons[u.defi]) ? `${n(A.tampons[u.defi])} tampons` : "";
      else if (u.secret) t = n(A.secrets[u.secret]) ? n(A.secrets[u.secret]) + " l'ont trouvé" : "";
      else if (u.train) t = n(A.trains[u.train]) ? n(A.trains[u.train]) + " voyageurs" : "";
      if (t) noeuds[nd.id] = t;
    });
  }));
  return { rangs, noeuds };
}

/** Des événements inventés, pour voir à quoi ressemble la page avant de brancher Supabase. */
export function exemple(P) {
  let g = 20260;
  const alea = () => ((g = (g * 1664525 + 1013904223) >>> 0) / 4294967296);
  const L = [], maintenant = Date.now();
  const histoire = P.sections.find((s) => s.id === "histoire").rangs.filter((r) => r.suivi && r.suivi.ch !== undefined), voyages = P.sections.find((s) => s.id === "voyages").rangs.filter((r) => r.suivi);
  const garde = [1, 0.93, 0.9, 0.84, 0.86, 0.9, 0.82, 0.88, 0.9, 0.93, 0.8, 0.95];
  for (let j = 0; j < 214; j++) {
    const vid = "ex" + j, t0 = maintenant - alea() * 60 * 864e5;
    let t = t0;
    const ev = (name, props) => L.push({ vid, sid: "s" + j, name, props, created_at: new Date((t += 20000 + alea() * 90000)).toISOString() });
    ev("game_open", { from: "bouton" }); ev("game_new", { slot: 1 });
    ev("site_choice", { site: ["ecole", "ecole", "mairie", "boulangerie", "gymnase"][Math.floor(alea() * 5)] });
    for (let ch = 0; ch < histoire.length; ch++) {
      const r = histoire[ch];
      if (alea() > (garde[ch] ?? 0.9)) break;
      ev("chapter_start", { ch, site: "ecole", via: "jeu" });
      r.noeuds.forEach((n) => {
        const s = n.suivi || {};
        if (s.fiche && alea() < (n.cle ? 0.97 : 0.62)) ev("fiche", { id: s.fiche, cle: !!n.cle });
        const rate = (b, titre, p) => { if (!b.q || !b.rep) return; const faux = b.rep.filter((x) => x.ok === false); if (faux.length && alea() < p) ev("wrong_answer", { t: titre, q: lisible(b.q).replace(/\s+/g, " ").trim().slice(0, 100), a: lisible(faux[Math.floor(alea() * alea() * faux.length)].t).replace(/\s+/g, " ").trim().slice(0, 80) }); };
        if (s.duel) { const dur = 0.12 + ((n.titre.length * 7) % 10) / 22; n.blocs.filter((b) => b.genre === "question").forEach((b) => rate(b, s.arene, dur * 0.7)); ev("battle", { a: s.duel.slice(0, 100), r: alea() < dur * 0.5 ? "lose" : "win" }); }
        if (s.epreuve) (function tous(B) { B.forEach((b) => { if (b.genre === "choix" || b.genre === "question") rate(b, s.arene, 0.1 + ((lisible(b.q).length * 3) % 10) / 28); if (b.etapes) tous(b.etapes); if (b.suite) tous(b.suite); }); })(n.blocs);
        if (s.badge && alea() < 0.97) ev("badge", { name: s.badge });
      });
      if (alea() < 0.05) break;
      ev("chapter_end", { ch, site: "ecole", s: Math.round(150 + alea() * 500 + (ch % 4) * 80), kwh: 0 });
      if (ch === histoire.length - 1) {
        ev("game_end", { site: "ecole", niveau: 12 });
        if (alea() < 0.7) { ev("voyage_passeport", {}); voyages.forEach((v, i) => { if (alea() > 0.75 - i * 0.1) return; const sid = v.suivi.site; ev("voyage_train", { vers: sid });
          v.noeuds.forEach((n) => { const s = n.suivi || {}; if (s.info && alea() < (n.cle ? 0.9 : 0.55)) ev("voyage_info", { site: sid, id: s.info.split(".")[1], cle: !!n.cle }); });
          if (alea() < 0.7) { ev("voyage_defi", { site: sid }); if (alea() < 0.85) ev("voyage_tampon", { site: sid, n: i + 1 }); } }); }
      }
    }
    P.sections.find((s) => s.id === "secrets").rangs.forEach((r) => r.noeuds.forEach((n) => { if (n.suivi && n.suivi.secret && alea() < 0.07) ev("secret", { id: n.suivi.secret }); }));
  }
  return L;
}
