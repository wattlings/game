/**
 * Les adresses qui relient les deux pages du site : le cours (à la racine) et le jeu (dans jeu/).
 * Chaque page indique où est la racine dans <html data-racine="…">.
 *
 * Adresses du cours : #accueil, #etape-3, #etape-3-comprendre, #ecole, #patrimoine, #glossaire, #quiz-final
 * Adresses du jeu   : jeu/ (écran titre), jeu/#reprendre (continuer la partie), jeu/#chapitre-3 (jouer ce chapitre)
 */
const racine = () => new URL(document.documentElement.dataset.racine || "./", document.baseURI);

export const adresseCours = (page = "") => new URL(page ? "#" + page : "", racine()).href;
export const adresseJeu = (suite = "") => new URL("jeu/" + (suite ? "#" + suite : ""), racine()).href;

/** Version « fichier unique » : les deux pages vivent dans le même fichier et se passent la main. */
const embarque = () => globalThis.WATTLINGS_EMBARQUE || null;

/** Vient-on du cours, par un lien, dans ce même onglet ? */
function vientDuCours() {
  if (!document.referrer || history.length < 2) return false;
  try {
    const d = new URL(document.referrer);
    const c = new URL(adresseCours());
    return d.origin === c.origin && d.pathname.replace(/index\.html$/, "") === c.pathname.replace(/index\.html$/, "");
  } catch {
    return false;
  }
}

/** Va à la page du jeu. suite : "" (écran titre), "reprendre" ou "chapitre-3". */
export function allerAuJeu(suite = "", { remplacer = false } = {}) {
  const e = embarque();
  if (e) return e.versJeu(suite);
  if (remplacer) location.replace(adresseJeu(suite));
  else location.assign(adresseJeu(suite));
}

export const LIENS = {
  adresseCours,
  adresseJeu,

  /** Quitte le jeu pour le cours, dans le même onglet. Sans page précisée : retour là d'où l'on venait. */
  quitterVersCours(page) {
    const e = embarque();
    if (e) return e.versCours(page, true);
    if (!page && vientDuCours()) return history.back();
    location.href = adresseCours(page || "accueil");
  },

  /** Ouvre une page du cours dans un autre onglet : le jeu reste ouvert, la partie continue. */
  consulterCours(page) {
    const e = embarque();
    if (e) return e.versCours(page, false);
    const w = window.open(adresseCours(page || "accueil"), "wattlings-cours");
    if (w) {
      try {
        w.focus();
      } catch {}
    } else location.href = adresseCours(page || "accueil"); // fenêtres bloquées : on y va dans cet onglet
  },
};
