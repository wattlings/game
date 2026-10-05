/**
 * Suivi d'audience côté cours : pages vues, onglets, démos, quiz, glossaire, et la mention en bas de page.
 * Le moteur (anonymat, envoi, « Ne pas me compter ») est dans commun/suivi.js.
 */
import {
  aRefuse,
  accepterLeSuivi,
  annoncer,
  nePasPister,
  nouvellePage,
  refuserLeSuivi,
  suiviBranche,
  suivre,
} from "../../commun/suivi.js";

let demosVues = new Set();

/** Lien discret : https://…/#ne-pas-compter exclut définitivement ce navigateur des statistiques. */
function lienDeRefus() {
  if (location.hash !== "#ne-pas-compter") return;
  refuserLeSuivi();
  history.replaceState(null, "", location.pathname + location.search + "#accueil");
  dispatchEvent(new HashChangeEvent("hashchange"));
  annoncer("Ce navigateur n’est plus compté dans les statistiques.");
}

function changementDePage() {
  lienDeRefus();
  nouvellePage();
  demosVues = new Set();
}

function clic(e) {
  const t = e.target.closest ? e.target : null;
  if (!t) return;
  const onglet = t.closest("[data-niv]");
  if (onglet) return suivre("course_tab", { niv: onglet.dataset.niv });
  const terme = t.closest(".terme[data-g]");
  if (terme) return suivre("glossary_open", { term: terme.dataset.g });
  const reponse = t.closest(".quiz-choix button[data-c]");
  if (reponse) {
    const li = reponse.closest(".quiz-q");
    const boite = li && li.closest(".quiz") && li.closest(".quiz").parentElement;
    const rang = li && li.dataset.q;
    const enonce = ((li && li.querySelector(".quiz-enonce")) || {}).textContent || "";
    if (li && !li.querySelector(".feedback"))
      setTimeout(() => {
        const retour = boite && boite.querySelector(`.quiz-q[data-q="${rang}"] .feedback`);
        if (retour)
          suivre("quiz_answer", {
            q: enonce.replace(/^\d+/, "").trim().slice(0, 100),
            ok: retour.classList.contains("ok"),
          });
      }, 30);
  }
}

/** Première manipulation d'une démo sur la page. */
function usageDeDemo(e) {
  const d = e.target.closest && e.target.closest("section.demo");
  if (!d || d.classList.contains("quiz-bloc")) return;
  const titre = (d.querySelector("h2") || {}).textContent || "démo";
  if (demosVues.has(titre)) return;
  demosVues.add(titre);
  suivre("demo_use", { demo: titre.trim().slice(0, 90) });
}

/** Mention de confidentialité et interrupteur, en bas de chaque page du cours. */
function mention() {
  if (!suiviBranche()) return;
  const c = document.getElementById("contenu");
  if (!c || c.querySelector(".qk-privacy")) return;
  const p = document.createElement("p");
  p.className = "qk-privacy";
  const afficher = () => {
    p.innerHTML = aRefuse()
      ? 'Mesure d’audience : ce navigateur n’est pas compté. <button type="button">Me compter à nouveau</button>'
      : nePasPister()
        ? "Mesure d’audience : désactivée par le réglage « Ne pas me pister » de ton navigateur."
        : 'Mesure d’audience anonyme, sans cookie ni donnée personnelle, conservée 13 mois, réservée à l’auteur du site. <button type="button">Ne pas me compter</button>';
    const b = p.querySelector("button");
    if (b)
      b.onclick = () => {
        if (aRefuse()) accepterLeSuivi();
        else refuserLeSuivi();
        afficher();
      };
  };
  afficher();
  c.appendChild(p);
}

/** À appeler une fois au démarrage du cours, avant de brancher le routeur. */
export function brancherSuiviCours() {
  addEventListener("hashchange", changementDePage);
  document.addEventListener("click", clic, true);
  document.addEventListener("click", usageDeDemo, true);
  document.addEventListener("input", usageDeDemo, true);
  new MutationObserver(() => mention()).observe(document.documentElement, { childList: true, subtree: true });
  lienDeRefus();
  setTimeout(changementDePage, 300);
}
