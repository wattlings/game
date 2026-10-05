// Assemble tout le site (cours + jeu) dans un seul fichier HTML autonome : envoi par mail, usage hors ligne.
//
//   node outils/fichier-unique.mjs               → écrit outils/sortie/wattlings.html
//   node outils/fichier-unique.mjs chemin.html   → écrit à l'endroit indiqué
//
// Le site en ligne n'utilise pas ce fichier : c'est une copie figée, à régénérer après chaque modification.
// Dans le fichier unique, le jeu s'ouvre dans un cadre par-dessus le cours (une seule page au lieu de deux)
// et la vignette flottante n'est pas proposée.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { build } from "esbuild";

const RACINE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SORTIE = path.resolve(process.argv[2] || path.join(RACINE, "outils/sortie/wattlings.html"));
const lire = (f) => fs.readFileSync(path.join(RACINE, f), "utf8");

/** Une feuille de style, avec ses polices converties en données intégrées. */
function style(fichier) {
  const dossier = path.dirname(fichier);
  return lire(fichier).replace(/url\((["']?)(?!data:)([^)"']+)\1\)/g, (_, q, adresse) => {
    const f = path.join(RACINE, dossier, adresse);
    const type = { ".woff2": "font/woff2", ".png": "image/png", ".svg": "image/svg+xml" }[path.extname(f)];
    if (!type) throw new Error("Type de fichier non prévu dans une feuille de style : " + adresse);
    return `url(data:${type};base64,${fs.readFileSync(f).toString("base64")})`;
  });
}

/** Remplace chaque <link rel="stylesheet"> d'une page par le contenu de la feuille. */
const integrerStyles = (html, dossierPage) =>
  html.replace(/<link rel="stylesheet" href="([^"]+)">/g, (_, href) => `<style>\n${style(path.join(dossierPage, href))}</style>`);

/** Un module et tout ce qu'il importe, réunis en un seul script. */
async function paquet(entree) {
  const r = await build({
    entryPoints: [path.join(RACINE, entree)],
    bundle: true,
    format: "iife",
    write: false,
    minify: true,
    charset: "utf8",
    legalComments: "none",
    logLevel: "warning",
  });
  return r.outputFiles[0].text;
}

const script = (code) => `<script>\n${code.replace(/<\/script/gi, "<\\/script")}\n</script>`;

// ---------- la page du jeu
let jeu = integrerStyles(lire("jeu/index.html"), "jeu");
const scriptsJeu = [...jeu.matchAll(/<script defer src="([^"]+)"><\/script>/g)].map((m) => m[1]);
if (!scriptsJeu.length) throw new Error("Aucun script trouvé dans jeu/index.html");
const pontJeu = `/* version « fichier unique » : le jeu vit dans un cadre posé sur la page du cours */
window.WATTLINGS_EMBARQUE = {
  demande: (parent.WATTLINGS_EMBARQUE && parent.WATTLINGS_EMBARQUE.demande) || "",
  versCours(page) {
    try { if (typeof AUD !== "undefined" && AUD.ctx) AUD.ctx.suspend(); } catch (e) {}
    parent.WATTLINGS_EMBARQUE.retourAuCours(page);
  },
};`;
const socle = await paquet("jeu/socle.js");
const corpsJeu = scriptsJeu.map((f) => script(`/* jeu/${f} */\n` + lire("jeu/" + f))).join("\n");
if (!/<script type="module" src="socle\.js"><\/script>/.test(jeu)) throw new Error("socle.js introuvable dans jeu/index.html");
jeu = jeu.replace(/<script type="module" src="socle\.js"><\/script>/, () => script(pontJeu) + "\n" + script(socle));
jeu = jeu.replace(/(?:<script defer src="[^"]+"><\/script>\s*)+/, () => corpsJeu + "\n");

// ---------- la page du cours, qui embarque celle du jeu
let cours = integrerStyles(lire("index.html"), ".");
const pontCours = `/* version « fichier unique » : le jeu s'ouvre dans un cadre par-dessus le cours, au lieu d'une page à part */
(function () {
  let cadre = null;
  const E = (window.WATTLINGS_EMBARQUE = {
    demande: "",
    /** Ouvre le jeu. suite : "" (le jeu tel qu'il est), "reprendre" ou "chapitre-3". */
    versJeu(suite) {
      if (!cadre) {
        E.demande = suite || "";
        cadre = document.createElement("iframe");
        cadre.id = "cadre-jeu";
        cadre.title = "Wattlings, le jeu";
        cadre.allowFullscreen = true;
        cadre.style.cssText = "position:fixed;inset:0;width:100%;height:100%;border:0;z-index:1000;background:#131a2b";
        cadre.srcdoc = JSON.parse(document.getElementById("page-jeu").textContent);
        document.body.appendChild(cadre);
      } else {
        cadre.hidden = false;
        cadre.contentWindow.qkRoute(suite === "reprendre" ? "" : suite || "");
      }
      document.documentElement.style.overflow = "hidden";
      setTimeout(() => { try { cadre.contentWindow.focus(); } catch (e) {} }, 50);
    },
    /** Referme le jeu (il reste en mémoire, la partie continue là où elle en était) et montre le cours. */
    retourAuCours(page) {
      if (cadre) cadre.hidden = true;
      document.documentElement.style.overflow = "";
      if (page && decodeURIComponent(location.hash.slice(1)) !== page) location.hash = page;
      window.focus();
    },
  });
  /* tous les liens vers le jeu ouvrent le cadre */
  document.addEventListener("click", (e) => {
    const a = e.target.closest && e.target.closest("a[data-jeu]");
    if (!a) return;
    e.preventDefault();
    E.versJeu(a.dataset.jeu);
  }, true);
})();`;
const paquetCours = await paquet("cours/principal.js");
if (!/<script type="module" src="cours\/principal\.js"><\/script>/.test(cours)) throw new Error("cours/principal.js introuvable dans index.html");
const jeuEnTexte = JSON.stringify(jeu).replace(/<\//g, "<\\/").replace(/<!--/g, "\\u003c!--");
cours = cours.replace(
  /<script type="module" src="cours\/principal\.js"><\/script>/,
  () => `<script type="application/json" id="page-jeu">${jeuEnTexte}</script>\n` + script(pontCours) + "\n" + script(paquetCours),
);

fs.mkdirSync(path.dirname(SORTIE), { recursive: true });
fs.writeFileSync(SORTIE, cours);
console.log(`Fichier unique écrit : ${SORTIE} (${(fs.statSync(SORTIE).size / 1e6).toFixed(2)} Mo)`);
