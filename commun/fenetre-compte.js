/**
 * La fenêtre « Mon compte », commune au cours et au jeu : se connecter, créer un compte, se déconnecter.
 * Elle porte ses propres styles, ce qui lui permet de s'afficher aussi dans le jeu (dessiné dans un shadow DOM).
 */
import { compteActuel, concernePage, messageErreur, seConnecter, seDeconnecter } from "./compte.js";

const STYLES = `
.cpt-fond{position:fixed;inset:0;z-index:2147483000;background:rgba(8,12,24,.62);display:flex;align-items:center;justify-content:center;padding:16px;font:16px/1.45 system-ui,-apple-system,"Segoe UI",sans-serif}
.cpt{background:#fff;color:#14203a;border-radius:14px;box-shadow:0 18px 50px rgba(0,0,0,.35);width:100%;max-width:400px;max-height:calc(100vh - 32px);overflow:auto;padding:22px 22px 18px;position:relative}
.cpt h2{margin:0 0 6px;font-size:20px;line-height:1.25}
.cpt p{margin:0 0 12px;color:#45506a;font-size:14.5px}
.cpt-onglets{display:flex;gap:4px;background:#eef1f7;border-radius:10px;padding:4px;margin:6px 0 14px}
.cpt-onglets button{flex:1;border:0;background:transparent;border-radius:7px;padding:8px 6px;font:inherit;font-size:14.5px;font-weight:600;color:#45506a;cursor:pointer}
.cpt-onglets button[aria-selected=true]{background:#fff;color:#14203a;box-shadow:0 1px 3px rgba(0,0,0,.15)}
.cpt label{display:block;font-size:14px;font-weight:600;margin:0 0 4px}
.cpt input{box-sizing:border-box;width:100%;font:inherit;padding:9px 11px;border:1.5px solid #c5cbd9;border-radius:8px;background:#fff;color:#14203a;margin:0 0 4px}
.cpt input:focus{outline:2px solid #2f6fdd;outline-offset:1px;border-color:#2f6fdd}
.cpt small{display:block;color:#5e6882;font-size:12.5px;margin:0 0 12px}
.cpt-erreur{background:#fdecea;color:#8a1f12;border-radius:8px;padding:8px 10px;font-size:14px;margin:0 0 12px}
.cpt-erreur:empty{display:none}
.cpt-actions{display:flex;gap:8px;flex-wrap:wrap;justify-content:flex-end;margin-top:6px}
.cpt-actions button{font:inherit;font-size:15px;font-weight:600;border-radius:8px;padding:9px 14px;cursor:pointer;border:1.5px solid #c5cbd9;background:#fff;color:#14203a}
.cpt-actions .cpt-principal{background:#14203a;border-color:#14203a;color:#fff}
.cpt-actions .cpt-danger{border-color:#b3261e;color:#b3261e}
.cpt-actions button:disabled{opacity:.6;cursor:wait}
.cpt-fermer{position:absolute;top:10px;right:10px;border:0;background:transparent;font-size:22px;line-height:1;color:#5e6882;cursor:pointer;padding:4px 8px;border-radius:6px}
.cpt-identite{display:flex;align-items:center;gap:10px;background:#eef1f7;border-radius:10px;padding:10px 12px;margin:4px 0 12px;font-weight:600;overflow-wrap:anywhere}
`;

const echapper = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);

/**
 * Ouvre la fenêtre. parent : l'élément où l'accrocher (le corps de la page par défaut) ;
 * onglet : "connexion" ou "creation", celui montré d'abord à qui n'est pas connecté.
 * Après une déconnexion, ou une connexion qui change ce que la page garde en mémoire, celle-ci est rechargée.
 */
export function ouvrirFenetreCompte({ parent = document.body, onglet = "connexion" } = {}) {
  const fond = document.createElement("div");
  fond.className = "cpt-fond";
  const style = document.createElement("style");
  style.textContent = STYLES;
  const boite = document.createElement("div");
  boite.className = "cpt";
  boite.setAttribute("role", "dialog");
  boite.setAttribute("aria-modal", "true");
  boite.setAttribute("aria-labelledby", "cpt-titre");
  fond.append(style, boite);

  const avant = (parent.getRootNode && parent.getRootNode().activeElement) || document.activeElement;
  const fermer = () => {
    fond.remove();
    removeEventListener("keydown", touche, true);
    if (avant && avant.focus) avant.focus();
  };
  const touche = (e) => {
    if (e.key === "Escape") {
      e.stopPropagation();
      fermer();
    }
  };
  addEventListener("keydown", touche, true);
  fond.addEventListener("mousedown", (e) => {
    if (e.target === fond) fermer();
  });

  function afficherConnexion() {
    const creer = onglet === "creation";
    boite.innerHTML = `
      <button type="button" class="cpt-fermer" aria-label="Fermer">×</button>
      <h2 id="cpt-titre">Mon compte</h2>
      <p>Avec un compte, ta progression dans le cours et tes parties du jeu te suivent sur tous tes appareils et navigateurs.</p>
      <div class="cpt-onglets" role="tablist">
        <button type="button" role="tab" data-o="connexion" aria-selected="${!creer}">Se connecter</button>
        <button type="button" role="tab" data-o="creation" aria-selected="${creer}">Créer un compte</button>
      </div>
      <form novalidate>
        <label for="cpt-id">Identifiant</label>
        <input id="cpt-id" name="username" autocomplete="username" autocapitalize="none" spellcheck="false" maxlength="30" required>
        <small>${creer ? "3 à 30 caractères : lettres sans accent, chiffres, point, tiret ou tiret bas. Pas besoin d'adresse e-mail." : "&nbsp;"}</small>
        <label for="cpt-mdp">Mot de passe</label>
        <input id="cpt-mdp" name="password" type="password" autocomplete="${creer ? "new-password" : "current-password"}" maxlength="72" required>
        <small>${creer ? "Au moins 8 caractères. Note-le bien : sans adresse e-mail, il ne peut pas être envoyé en cas d'oubli." : "&nbsp;"}</small>
        ${creer ? `<label for="cpt-mdp2">Mot de passe, encore une fois</label><input id="cpt-mdp2" type="password" autocomplete="new-password" maxlength="72" required><small>&nbsp;</small>` : ""}
        <div class="cpt-erreur" role="alert"></div>
        <div class="cpt-actions"><button type="submit" class="cpt-principal">${creer ? "Créer mon compte" : "Me connecter"}</button></div>
      </form>`;
    boite.querySelector(".cpt-fermer").onclick = fermer;
    boite.querySelectorAll("[data-o]").forEach((b) => {
      b.onclick = () => {
        onglet = b.dataset.o;
        afficherConnexion();
      };
    });
    const formulaire = boite.querySelector("form");
    const erreur = boite.querySelector(".cpt-erreur");
    const id = boite.querySelector("#cpt-id");
    id.focus();
    formulaire.onsubmit = async (e) => {
      e.preventDefault();
      const mdp = boite.querySelector("#cpt-mdp").value;
      erreur.textContent = "";
      if (!id.value.trim() || !mdp) {
        erreur.textContent = "Remplis l'identifiant et le mot de passe.";
        return;
      }
      if (creer && mdp !== boite.querySelector("#cpt-mdp2").value) {
        erreur.textContent = "Les deux mots de passe ne sont pas identiques.";
        return;
      }
      const bouton = formulaire.querySelector("button[type=submit]");
      bouton.disabled = true;
      bouton.textContent = "Un instant…";
      try {
        const reecrites = await seConnecter(id.value, mdp, { creer });
        if (concernePage(reecrites)) {
          location.reload();
          return;
        }
        afficherConnecte(creer ? "Ton compte est créé." : "");
      } catch (err) {
        erreur.textContent = messageErreur(err);
        bouton.disabled = false;
        bouton.textContent = creer ? "Créer mon compte" : "Me connecter";
      }
    };
  }

  function afficherConnecte(message) {
    boite.innerHTML = `
      <button type="button" class="cpt-fermer" aria-label="Fermer">×</button>
      <h2 id="cpt-titre">Mon compte</h2>
      <div class="cpt-identite"><span aria-hidden="true">👤</span><span>${echapper(compteActuel())}</span></div>
      <p>${message ? echapper(message) + " " : ""}Ta progression dans le cours et tes parties du jeu sont enregistrées sur ton compte : connecte-toi avec le même identifiant sur un autre appareil pour les retrouver.</p>
      <p>En te déconnectant, elles sont retirées de ce navigateur (elles restent sur ton compte).</p>
      <div class="cpt-erreur" role="alert"></div>
      <div class="cpt-actions"><button type="button" class="cpt-danger" data-a="sortir">Me déconnecter</button><button type="button" class="cpt-principal" data-a="fermer">Fermer</button></div>`;
    boite.querySelector(".cpt-fermer").onclick = fermer;
    boite.querySelector("[data-a=fermer]").onclick = fermer;
    boite.querySelector("[data-a=fermer]").focus();
    const erreur = boite.querySelector(".cpt-erreur");
    const sortir = boite.querySelector("[data-a=sortir]");
    let forcer = false;
    sortir.onclick = async () => {
      sortir.disabled = true;
      try {
        await seDeconnecter({ forcer });
        location.reload();
      } catch (err) {
        erreur.textContent = messageErreur(err) + " Tes derniers changements ne sont pas encore enregistrés sur ton compte : en te déconnectant maintenant, ils seront perdus.";
        forcer = true;
        sortir.disabled = false;
        sortir.textContent = "Me déconnecter quand même";
      }
    };
  }

  if (compteActuel()) afficherConnecte("");
  else afficherConnexion();
  parent.appendChild(fond);
}
