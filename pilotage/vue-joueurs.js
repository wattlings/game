/**
 * Pilotage · vue-joueurs.js
 * L'onglet « Les joueurs » : se connecter au projet Supabase, lire les événements du jeu, et montrer
 * jusqu'où vont les joueurs, où ils se trompent, ce qu'ils trouvent. Les mêmes chiffres se posent ensuite sur les frises.
 */
import { h, nombre, pluriel, remplir } from "./rendu.js";
import { agreger, charger, connecter, exemple } from "./suivi.js";

const CLE_PROJET = "pilotage-projet-v1";
const jour = (d) => d.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
const duree = (s) => (s === null || s === undefined ? "–" : s < 90 ? Math.round(s) + " s" : Math.round(s / 60) + " min");

export function monterJoueurs(racine, { P, config, ouQuestion, nomDe, ouvrir, surStats }) {
  let projet = { url: config.url || "", cle: config.cle || "" };
  if (!projet.url) { try { projet = Object.assign(projet, JSON.parse(localStorage.getItem(CLE_PROJET) || "{}")); } catch { /* sans stockage : on redemandera */ } }
  let jeton = null, lignes = null, estExemple = false, periode = 30, charge = null; // charge : { url, cle, periode } de la dernière lecture
  const etatEl = h("p", { class: "etat-lecture", role: "status" }), resultats = h("div", { class: "resultats" });
  const cUrl = h("input", { type: "url", name: "url", placeholder: "https://….supabase.co", value: projet.url, required: true, autocomplete: "off" });
  const cCle = h("input", { type: "text", name: "cle", placeholder: "sb_publishable_…", value: projet.cle, required: true, autocomplete: "off", spellcheck: "false" });
  const cMail = h("input", { type: "email", name: "email", autocomplete: "username", required: true, placeholder: "l'adresse de l'utilisateur créé dans Supabase" });
  const cMdp = h("input", { type: "password", name: "password", autocomplete: "current-password", required: true });
  const cPeriode = h("select", { name: "periode" }, [[7, "7 derniers jours"], [30, "30 derniers jours"], [90, "90 derniers jours"], [0, "Depuis le début"]].map(([v, t]) => h("option", { value: v, selected: v === 30 }, t)));
  const depuis = () => (periode ? new Date(Date.now() - periode * 864e5) : null);

  async function lire(e) {
    e.preventDefault();
    const url = cUrl.value.trim(), cle = cCle.value.trim();
    etatEl.className = "etat-lecture"; etatEl.textContent = "Connexion…";
    try {
      jeton = await connecter({ url, cle, email: cMail.value.trim(), mdp: cMdp.value });
      cMdp.value = "";
      try { if (!config.url) localStorage.setItem(CLE_PROJET, JSON.stringify({ url, cle })); } catch { /* tant pis */ }
      lignes = await charger({ url, cle, jeton, depuis: depuis(), surProgres: (n) => (etatEl.textContent = "Lecture… " + nombre(n) + " événements") });
      estExemple = false; charge = { url, cle, periode };
      etatEl.textContent = "";
      montrer();
    } catch (x) { etatEl.className = "etat-lecture erreur"; etatEl.textContent = x.message; }
  }
  // changer de période : on recompte ; si la nouvelle période remonte plus loin que ce qui a été lu, on relit
  cPeriode.addEventListener("change", async () => {
    periode = +cPeriode.value;
    if (!lignes) return;
    const plusLoin = !estExemple && charge && charge.periode !== 0 && (periode === 0 || periode > charge.periode);
    if (plusLoin) {
      etatEl.className = "etat-lecture"; etatEl.textContent = "Lecture…";
      try { lignes = await charger({ url: charge.url, cle: charge.cle, jeton, depuis: depuis(), surProgres: (n) => (etatEl.textContent = "Lecture… " + nombre(n) + " événements") }); charge.periode = periode; etatEl.textContent = ""; }
      catch { etatEl.className = "etat-lecture erreur"; etatEl.textContent = "La connexion a expiré : reconnecte-toi pour lire cette période."; return; }
    }
    montrer();
  });

  function montrer() {
    const A = agreger(lignes, { depuis: depuis() });
    surStats(A, estExemple);
    const C = Object.keys(A.chapitres).map(Number).sort((a, b) => a - b), base = Math.max(1, ...C.map((c) => A.chapitres[c].debut.size));
    const chapitres = P.sections.find((s) => s.id === "histoire").rangs.filter((r) => r.suivi && r.suivi.ch !== undefined);
    const tuile = (v, nom, sous) => h("div", { class: "tuile" }, h("strong", null, v), h("span", null, nom), sous ? h("small", null, sous) : null);
    const fin = chapitres.length ? A.chapitres[chapitres.at(-1).suivi.ch] : null, arrives = fin ? fin.debut.size : 0, departs = A.chapitres[0] ? A.chapitres[0].debut.size : A.nouvelles.size;

    // ---- jusqu'où vont les joueurs : une barre par chapitre
    const bulle = h("div", { class: "bulle-graphe", hidden: true });
    const ligneGraphe = (r) => {
      const c = A.chapitres[r.suivi.ch] || { debut: new Set(), fin: new Set(), durees: [] }, n = c.debut.size, m = A.mediane(r.suivi.ch);
      const txt = [`${r.titre}`, `${pluriel(n, "joueur arrivé", "joueurs arrivés")} ici`, n ? `${Math.round((100 * c.fin.size) / n)} % terminent le chapitre (${c.fin.size})` : "", m ? `temps médian : ${duree(m)}` : ""].filter(Boolean);
      const e = h("button", { class: "barre-ligne", type: "button", "aria-label": txt.join(", ") },
        h("span", { class: "barre-nom" }, h("span", { class: "rang-num" }, r.num), h("span", null, r.titre.replace(/^Arène \d · |^Chapitre \d+ · |^Épilogue · /, ""))),
        h("span", { class: "barre-piste" }, h("span", { class: "barre", style: `width:${(100 * n) / base}%` }), h("span", { class: "barre-v" }, nombre(n))),
        h("span", { class: "barre-fin muet" }, n ? Math.round((100 * c.fin.size) / n) + " %" : "–"), h("span", { class: "barre-temps muet" }, duree(m)));
      const voir = () => { bulle.replaceChildren(...txt.map((t, i) => h(i ? "div" : "strong", null, t))); bulle.hidden = false; const b = e.getBoundingClientRect(), g = graphe.getBoundingClientRect(); bulle.style.top = b.bottom - g.top + 4 + "px"; bulle.style.left = Math.min(Math.max(8, b.left - g.left + 140), g.width - 260) + "px"; };
      e.addEventListener("pointerenter", voir); e.addEventListener("focus", voir);
      e.addEventListener("pointerleave", () => (bulle.hidden = true)); e.addEventListener("blur", () => (bulle.hidden = true));
      e.addEventListener("click", () => ouvrir("ch-" + r.suivi.ch + "-depart"));
      return e;
    };
    const graphe = h("div", { class: "graphe" },
      h("div", { class: "barre-ligne barre-tete muet", "aria-hidden": "true" }, h("span", null, "Chapitre"), h("span", null, "Joueurs arrivés"), h("span", null, "le terminent"), h("span", null, "temps médian")),
      chapitres.map(ligneGraphe), bulle);
    const tableau = h("details", { class: "en-tableau" }, h("summary", null, "Voir en tableau"),
      h("table", null, h("thead", null, h("tr", null, ["Chapitre", "Arrivés", "L'ont terminé", "Taux", "Temps médian"].map((t) => h("th", null, t)))),
        h("tbody", null, chapitres.map((r) => { const c = A.chapitres[r.suivi.ch] || { debut: new Set(), fin: new Set() }; return h("tr", null, h("td", null, r.num + " · " + r.titre), h("td", { class: "num" }, nombre(c.debut.size)), h("td", { class: "num" }, nombre(c.fin.size)), h("td", { class: "num" }, c.debut.size ? Math.round((100 * c.fin.size) / c.debut.size) + " %" : "–"), h("td", { class: "num" }, duree(A.mediane(r.suivi.ch)))); }))));

    // ---- les questions qui font trébucher
    const erreurs = [...A.erreurs.values()].sort((a, b) => b.n - a.n).slice(0, 15);
    const pire = (e) => { const L = [...e.reponses.entries()].sort((a, b) => b[1] - a[1])[0]; return L ? `« ${L[0]} » (${L[1]} fois)` : ""; };
    const tErreurs = erreurs.length ? h("table", { class: "table-large" }, h("thead", null, h("tr", null, ["Question", "Où", "Erreurs", "Joueurs", "La mauvaise réponse la plus choisie"].map((t) => h("th", null, t)))),
      h("tbody", null, erreurs.map((e) => { const id = ouQuestion(e.q.slice(0, 100)); return h("tr", null,
        h("td", null, id ? h("button", { class: "lien", type: "button", onclick: () => ouvrir(id) }, e.q) : e.q), h("td", { class: "muet" }, id ? nomDe(id) : e.t), h("td", { class: "num" }, nombre(e.n)), h("td", { class: "num" }, nombre(e.joueurs.size)), h("td", null, pire(e))); })))
      : h("p", { class: "muet" }, "Aucune mauvaise réponse enregistrée sur la période.");

    // ---- les duels
    const duels = Object.entries(A.duels).filter(([k, d]) => /·/.test(k) && d.win + d.lose >= 1).map(([k, d]) => ({ k, n: d.win + d.lose, taux: d.win / (d.win + d.lose) })).sort((a, b) => a.taux - b.taux).slice(0, 10);
    const tDuels = duels.length ? h("table", null, h("thead", null, h("tr", null, ["Arène · dresseur", "Duels", "Gagnés par le joueur"].map((t) => h("th", null, t)))),
      h("tbody", null, duels.map((d) => h("tr", null, h("td", null, d.k), h("td", { class: "num" }, nombre(d.n)), h("td", { class: "num" }, Math.round(100 * d.taux) + " %"))))) : h("p", { class: "muet" }, "Aucun duel enregistré sur la période.");

    // ---- les voyages
    const sites = P.sections.find((s) => s.id === "voyages").rangs.filter((r) => r.suivi && r.suivi.site);
    const n = (S) => (S ? S.size : 0);
    const tVoyages = h("table", null, h("thead", null, h("tr", null, ["Site", "Voyageurs", "Défis commencés", "Tampons"].map((t) => h("th", null, t)))),
      h("tbody", null, sites.map((r) => h("tr", null, h("td", null, r.titre), h("td", { class: "num" }, nombre(n(A.trains[r.suivi.site]))), h("td", { class: "num" }, nombre(n(A.defis[r.suivi.site]))), h("td", { class: "num" }, nombre(n(A.tampons[r.suivi.site])))))));

    remplir(resultats,
      estExemple ? h("p", { class: "bandeau alerte" }, h("strong", null, "Données d'exemple, inventées."), " Elles montrent à quoi ressemblera cette page une fois le suivi branché. Aucun de ces chiffres n'est réel.") : null,
      !A.evenements ? h("p", { class: "bandeau" }, "Aucun événement du jeu sur cette période." + (lignes.length ? " (" + nombre(lignes.length) + " événements lus, qui viennent tous du cours.)" : " La table est vide, ou la règle de lecture ne laisse rien passer : voir « Première fois » ci-dessous.")) : [
        h("div", { class: "tuiles" }, tuile(nombre(A.joueurs.size), "joueurs", A.premier ? "du " + jour(A.premier) + " au " + jour(A.dernier) : ""), tuile(nombre(departs), "ont commencé l'histoire"),
          tuile(nombre(arrives), "sont arrivés à l'épilogue", departs ? Math.round((100 * arrives) / departs) + " % de ceux qui ont commencé" : ""), tuile(nombre(A.nbErreurs), "mauvaises réponses", A.joueurs.size ? (A.nbErreurs / A.joueurs.size).toFixed(1).replace(".", ",") + " par joueur" : ""),
          tuile(nombre(A.passeports.size), "passeports des énergies")),
        h("section", { class: "bloc-page" }, h("h3", null, "Jusqu'où vont les joueurs"), h("p", { class: "muet" }, "Le nombre de joueurs arrivés à chaque chapitre. Là où la barre raccourcit d'un coup, des joueurs ont lâché au chapitre d'avant. Un clic ouvre le chapitre."), graphe, tableau),
        h("section", { class: "bloc-page" }, h("h3", null, "Les questions qui font trébucher"), h("p", { class: "muet" }, "Les quinze questions qui récoltent le plus de mauvaises réponses. Beaucoup d'erreurs sur une même mauvaise réponse : la question est peut-être ambiguë, ou le piège trop bon."), tErreurs),
        h("div", { class: "deux" }, h("section", { class: "bloc-page" }, h("h3", null, "Les dresseurs les plus coriaces"), tDuels), h("section", { class: "bloc-page" }, h("h3", null, "Les voyages en train"), tVoyages)),
        h("p", { class: "muet" }, "Ces chiffres sont aussi posés sur les frises du parcours (sous chaque chapitre, sous chaque pastille, à côté de chaque question). Le comptage est anonyme : un joueur est un navigateur. Ne sont pas comptés : les navigateurs qui demandent à ne pas être pistés, ceux qui ont refusé, et tes essais lancés depuis cette page.", A.sansDate ? " La table ne donne pas de date : le choix de la période est ignoré." : ""),
      ]);
  }

  const sql = (mail) => `create policy "lecture par l'auteur"\n  on public.events for select\n  to authenticated\n  using ((auth.jwt() ->> 'email') = '${(mail || "ton-adresse@exemple.fr").replace(/'/g, "")}');`;
  const codeSql = h("pre", { class: "sql" }, sql(""));
  cMail.addEventListener("input", () => (codeSql.textContent = sql(/^[^@\s']+@[^@\s']+$/.test(cMail.value.trim()) ? cMail.value.trim() : "")));

  remplir(racine,
    h("section", { class: "bloc-page" },
      h("h2", null, "Les joueurs"),
      h("p", null, "Ce que le suivi anonyme du jeu a enregistré : jusqu'où vont les joueurs, où ils se trompent, ce qu'ils trouvent. La lecture demande de se connecter : la clé du site sait écrire des événements, pas les relire."),
      h("form", { class: "connexion", onsubmit: lire },
        h("label", null, h("span", null, "Adresse du projet Supabase"), cUrl), h("label", null, h("span", null, "Clé « publishable »"), cCle),
        h("label", null, h("span", null, "Adresse e-mail"), cMail), h("label", null, h("span", null, "Mot de passe"), cMdp),
        h("label", null, h("span", null, "Période"), cPeriode),
        h("div", { class: "connexion-actions" }, h("button", { class: "bouton plein", type: "submit" }, "Se connecter et lire"),
          h("button", { class: "bouton", type: "button", onclick: () => { lignes = exemple(P); estExemple = true; etatEl.textContent = ""; montrer(); } }, "Voir avec des données d'exemple"))),
      h("p", { class: "muet" }, "Le mot de passe part uniquement vers ton projet Supabase et n'est gardé nulle part ; la connexion s'oublie quand tu fermes la page."),
      etatEl),
    resultats,
    h("details", { class: "bloc-page premiere-fois" }, h("summary", null, "Première fois : préparer Supabase (cinq minutes, une seule fois)"),
      h("ol", { class: "marche" },
        h("li", null, "Dans Supabase, ouvre ton projet, puis ", h("strong", null, "Authentication › Users › Add user › Create new user"), ". Mets ton adresse e-mail, choisis un mot de passe long, coche ", h("strong", null, "Auto Confirm User"), ". C'est le compte qui servira ici."),
        h("li", null, "Toujours dans Authentication, ouvre ", h("strong", null, "Sign In / Providers"), " et désactive ", h("strong", null, "Allow new users to sign up"), " : personne d'autre ne pourra créer de compte."),
        h("li", null, "Ouvre ", h("strong", null, "SQL Editor"), ", colle ceci (avec ton adresse à la place de l'exemple : tape-la dans le formulaire ci-dessus, elle se recopie ici), puis ", h("strong", null, "Run"), " :", codeSql),
        h("li", null, "Reviens ici, remplis le formulaire, clique « Se connecter et lire ».")),
      h("p", { class: "muet" }, "Cette règle autorise la lecture de la table « events » à ce seul compte. Tout le reste ne change pas : le site continue d'écrire ses événements avec la clé « publishable », qui ne peut toujours rien lire.")));
}
