/**
 * Pilotage · vue-modifs.js
 * L'onglet « Mes modifications » : la liste des textes réécrits, les fichiers à télécharger, et comment les déposer sur GitHub.
 */
import { h, mettreEnForme, pluriel, remplir } from "./rendu.js";

const telecharger = (blob, nom) => { const a = h("a", { href: URL.createObjectURL(blob), download: nom }); document.body.append(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 2000); };

export function monterModifs(racine, { edition, voir, ouEst, allumer }) {
  let confirme = false;
  function rafraichir() {
    const L = edition.liste(), bonnes = L.filter((m) => m.etat === "ok"), perimees = L.filter((m) => m.etat !== "ok"), F = edition.fichiersModifies();
    const ligne = (m) => h("li", { class: "modif" },
      h("div", { class: "modif-ou muet" }, m.etat === "ok" ? ouEst(m) : "Ce texte a changé en ligne depuis ta modification"),
      h("div", { class: "avant-apres" }, h("div", { class: "avant" }, h("span", { class: "etq" }, "avant"), h("div", { html: mettreEnForme(m.avant, m.exprs) })), h("div", { class: "apres" }, h("span", { class: "etq" }, "après"), h("div", { html: mettreEnForme(m.apres, m.exprs) }))),
      h("div", { class: "modif-actions" }, m.etat === "ok" ? h("button", { class: "bouton", type: "button", onclick: () => voir(m) }, "Voir dans le parcours") : null, h("button", { class: "bouton", type: "button", onclick: () => edition.retirer(m.k) }, m.etat === "ok" ? "Annuler cette modification" : "Retirer de la liste")));

    const vide = !bonnes.length && !perimees.length;
    remplir(racine,
      h("section", { class: "bloc-page" },
        h("h2", null, "Mes modifications"),
        edition.arrivees ? h("p", { class: "bandeau ok" }, pluriel(edition.arrivees, "modification précédente est", "modifications précédentes sont") + " maintenant en ligne : la liste a été vidée d'autant.") : null,
        vide ? [
          h("p", null, "Aucun texte modifié pour l'instant."),
          h("ol", { class: "marche" },
            h("li", null, h("strong", null, "Allume « Modifier les textes »"), " en haut de la page : les textes du jeu se soulignent."),
            h("li", null, h("strong", null, "Clique un texte"), " dans le détail d'une pastille, réécris-le, enregistre. Répliques, questions, réponses, retours, fiches : tout ce qui est souligné se modifie."),
            h("li", null, h("strong", null, "Reviens ici"), " télécharger les fichiers du jeu déjà corrigés, puis dépose-les sur GitHub.")),
          h("p", null, h("button", { class: "bouton plein", type: "button", onclick: () => { allumer(); document.querySelector('.onglet[data-vue="parcours"]').click(); } }, "Commencer à modifier")),
        ] : [
          h("p", null, h("strong", null, pluriel(bonnes.length, "texte modifié", "textes modifiés")), " dans " + pluriel(F.length, "fichier") + ". Rien n'a encore changé en ligne : les modifications attendent dans ce navigateur."),
          F.some((f) => f.erreur) ? h("p", { class: "bandeau alerte" }, "Un fichier ne peut pas être rendu : " + F.filter((f) => f.erreur).map((f) => f.chemin + " (" + f.erreur + ")").join(" ; ") + ". Annule ses modifications et recommence-les.") : null,
          bonnes.length ? h("p", { class: "actions-page" },
            h("button", { class: "bouton plein", type: "button", onclick: () => telecharger(edition.archive(), "wattlings-textes-modifies.zip") }, "Télécharger les fichiers à déposer (.zip)"),
            h("button", { class: "bouton", type: "button", onclick: (e) => { if (!confirme) { confirme = true; e.currentTarget.textContent = "Confirmer : tout annuler"; setTimeout(() => { confirme = false; rafraichir(); }, 4000); } else { confirme = false; edition.toutRetirer(); } } }, "Tout annuler")) : null,
        ]),
      bonnes.length ? h("section", { class: "bloc-page" },
        F.map((f) => h("div", { class: "fichier-modifie" },
          h("header", null, h("code", null, f.chemin), h("span", { class: "muet" }, " · " + pluriel(f.modifs.length, "modification")),
            f.erreur ? null : h("button", { class: "bouton", type: "button", onclick: () => telecharger(new Blob([f.contenu], { type: "text/javascript" }), f.chemin.split("/").pop()) }, "Ce fichier seul")),
          h("ul", { class: "modifs" }, f.modifs.map((m) => ligne(Object.assign({ k: m.f + ":" + m.a }, m))))))) : null,
      perimees.length ? h("section", { class: "bloc-page" }, h("h3", null, "À refaire"), h("p", { class: "muet" }, "Le fichier en ligne a changé à cet endroit depuis ta modification : la page ne sait plus où la poser. Recopie le texte « après » et refais la modification dans le parcours."), h("ul", { class: "modifs" }, perimees.map(ligne))) : null,
      bonnes.length ? h("section", { class: "bloc-page" },
        h("h3", null, "Déposer sur GitHub"),
        h("ol", { class: "marche" },
          h("li", null, "Télécharge l'archive et ", h("strong", null, "décompresse-la"), " : tu obtiens un dossier ", h("code", null, "jeu"), " (qui ne contient que les fichiers modifiés) et un fichier ", h("code", null, "MODIFICATIONS.txt"), " qui résume les changements."),
          h("li", null, "Sur GitHub, ouvre ton dépôt, puis ", h("strong", null, "Add file › Upload files"), "."),
          h("li", null, "Glisse le ", h("strong", null, "dossier ", h("code", null, "jeu")), " dans la page (le dossier lui-même, pas son contenu) : GitHub range chaque fichier à sa place et remplace l'ancien."),
          h("li", null, "Clique ", h("strong", null, "Commit changes"), ". Le site se met à jour en une à deux minutes.")),
        h("p", { class: "muet" }, "Chaque fichier rendu est le fichier en ligne où seuls tes textes ont changé ; il a été relu pour vérifier que le jeu sait encore le lire. Le bouton « Tester » du parcours montre le jeu en ligne : tes modifications n'y apparaissent qu'après le dépôt. Une fois déposées, elles disparaissent de cette liste à ta prochaine visite.")) : null);
  }
  rafraichir();
  return { rafraichir };
}
