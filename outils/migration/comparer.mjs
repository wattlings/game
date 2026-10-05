// Compare le site découpé à la version 18 d'origine (version-18.html, dans ce dossier).
// A servi à prouver que la migration ne change rien ; ne reste valable que tant que le contenu n'a pas évolué.
//
//   node outils/migration/comparer.mjs            → tout (environ 30 minutes)
//   node outils/migration/comparer.mjs cours      → le cours, page par page, démos manipulées (contenu affiché identique)
//   node outils/migration/comparer.mjs visuel     → le cours, au pixel : clair, sombre, téléphone
//   node outils/migration/comparer.mjs jeu        → les 11 chapitres, 2 minutes de jeu chacun, image par image
//   node outils/migration/comparer.mjs epreuves   → 25 épreuves et écrans du jeu, cliqués au hasard
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  ROUTES_COURS, TOUCHES, agirCours, agirJeu, avancer, contenuCours, demarrer, ecouterErreurs, etatJeu, hasardEtHorlogeFixes, hasardFixe, nbCiblesCours, tirage, validerAvatar,
} from "../essais.mjs";

const ICI = path.dirname(fileURLToPath(import.meta.url));
const quoi = process.argv[2] || "tout";
const { adresse, navigateur, fermer } = await demarrer();
const ORIGINE = adresse + "outils/migration/version-18.html";
let total = 0, differences = 0;
const resultat = (ok, texte) => { total++; if (!ok) differences++; console.log((ok ? "ok   " : "DIFF ") + texte); };
const ecart = (a, b) => { let i = 0; while (i < a.length && a[i] === b[i]) i++; return `\n     origine : ${a.slice(Math.max(0, i - 60), i + 120)}\n     nouveau : ${b.slice(Math.max(0, i - 60), i + 120)}`; };

// ---------------------------------------------------------------- cours : contenu affiché
if (quoi === "tout" || quoi === "cours") {
  console.log("\nCours : contenu affiché, page par page, avec manipulation des démos");
  for (const route of ROUTES_COURS) {
    const contexte = await navigateur.newContext({ viewport: { width: 1200, height: 900 } });
    const pages = [], erreurs = [];
    for (const url of [ORIGINE, adresse]) {
      const p = await contexte.newPage();
      await p.addInitScript(hasardFixe);
      if (url === adresse) ecouterErreurs(p, erreurs);
      await p.goto(url + "#" + route);
      await p.waitForSelector("#contenu > *");
      await p.waitForTimeout(350);
      pages.push(p);
    }
    let [a, b] = await Promise.all(pages.map((p) => p.evaluate(contenuCours)));
    let pb = a !== b ? "à l'affichage" + ecart(a, b) : "";
    let actions = 0;
    if (!pb) {
      const cibles = await pages[0].evaluate(nbCiblesCours);
      for (let i = 0; i < Math.min(170, Math.ceil(cibles * 1.5)); i++) {
        const [da, db] = await Promise.all(pages.map((p) => p.evaluate(agirCours, i)));
        await pages[0].waitForTimeout(25);
        [a, b] = await Promise.all(pages.map((p) => p.evaluate(contenuCours)));
        actions++;
        if (da !== db || a !== b) { pb = `après l'action ${i} (${da})` + ecart(a, b); break; }
      }
    }
    const [sa, sb] = await Promise.all(pages.map((p) => p.evaluate(() => localStorage.getItem("ems-pedagogie-v1"))));
    if (!pb && sa !== sb) pb = "progression enregistrée différente";
    if (!pb && erreurs.length) pb = "erreur : " + erreurs[0];
    resultat(!pb, `${route} (${actions} manipulations)${pb ? " : " + pb : ""}`);
    await contexte.close();
  }
}

// ---------------------------------------------------------------- cours : rendu au pixel
if (quoi === "tout" || quoi === "visuel") {
  console.log("\nCours : rendu au pixel (clair, sombre, téléphone)");
  const { PNG } = await import("pngjs");
  const pixelmatch = (await import("pixelmatch")).default;
  const routes = ["accueil", "ecole", "glossaire", "quiz-final", "patrimoine", ...[1, 2, 3, 4, 5, 6, 7, 8].flatMap((i) => [`etape-${i}`, `etape-${i}-comprendre`, `etape-${i}-approfondir`])];
  for (const [nom, theme, largeur, hauteur] of [["clair", "light", 1280, 900], ["sombre", "dark", 1280, 900], ["téléphone", "light", 390, 800]]) {
    for (const route of routes) {
      const captures = [];
      for (const url of [ORIGINE, adresse]) {
        const contexte = await navigateur.newContext({ viewport: { width: largeur, height: hauteur }, colorScheme: theme, deviceScaleFactor: 1 });
        const p = await contexte.newPage();
        await p.goto(url + "#" + route);
        await p.waitForSelector("#contenu > *");
        await p.evaluate(() => document.fonts.ready);
        await p.waitForTimeout(500);
        await p.evaluate(() => document.fonts.ready);
        captures.push(await p.screenshot({ fullPage: true, animations: "disabled" }));
        await contexte.close();
      }
      const a = PNG.sync.read(captures[0]), b = PNG.sync.read(captures[1]);
      let pb = "";
      if (a.width !== b.width || a.height !== b.height) pb = `tailles ${a.width}×${a.height} / ${b.width}×${b.height}`;
      else { const n = pixelmatch(a.data, b.data, null, a.width, a.height, { threshold: 0.1 }); if (n) pb = `${n} pixels diffèrent`; }
      if (pb) { const d = path.join(ICI, "ecarts"); fs.mkdirSync(d, { recursive: true }); fs.writeFileSync(path.join(d, `${nom}-${route}-origine.png`), captures[0]); fs.writeFileSync(path.join(d, `${nom}-${route}-nouveau.png`), captures[1]); }
      resultat(!pb, `${nom} · ${route}${pb ? " : " + pb : ` (${a.width}×${a.height})`}`);
    }
  }
}

// ---------------------------------------------------------------- jeu : deux pages jouent la même partie
async function deuxJeux(chapitre) {
  const pages = [], erreurs = [[], []];
  for (const [k, url] of [ORIGINE + "#jeu-" + chapitre, adresse + "jeu/#chapitre-" + chapitre].entries()) {
    const contexte = await navigateur.newContext({ viewport: { width: 1000, height: 760 } });
    const p = await contexte.newPage();
    await p.addInitScript(hasardEtHorlogeFixes);
    ecouterErreurs(p, erreurs[k]);
    await p.goto(url);
    await p.waitForTimeout(900);
    pages.push(p);
  }
  const tous = (f) => Promise.all(pages.map(f));
  await tous((p) => avancer(p, 5));
  await tous((p) => p.waitForTimeout(500));
  await tous(validerAvatar);
  await tous((p) => avancer(p, 600));
  await tous((p) => p.waitForTimeout(300));
  let ecarts = 0, comparaisons = 0, premier = "";
  const comparer = async (quand) => {
    const [a, b] = await tous((p) => p.evaluate(etatJeu));
    comparaisons++;
    const d = Object.keys(a).filter((k) => a[k] !== b[k]);
    if (d.length) { ecarts++; if (!premier) premier = `après « ${quand} » : ${d.join(", ")}` + ecart(String(a[d[0]]), String(b[d[0]])); }
  };
  const fermerTout = () => Promise.all(pages.map((p) => p.context().close()));
  return { pages, tous, comparer, erreurs, bilan: () => ({ ecarts, comparaisons, premier }), fermerTout };
}

if (quoi === "tout" || quoi === "jeu") {
  console.log("\nJeu : la même partie jouée dans les deux versions (état, interface et écran comparés à chaque geste)");
  for (let chapitre = 1; chapitre <= 11; chapitre++) {
    const j = await deuxJeux(chapitre);
    const alea = tirage(chapitre * 13 + 5);
    await j.comparer("démarrage");
    for (let t = 0; t < 120000 && j.bilan().ecarts < 3; ) {
      const r = alea();
      let geste;
      if (r < 0.55) { const k = TOUCHES[Math.floor(alea() * 4)], d = 150 + Math.floor(alea() * 700), course = alea() < 0.25; geste = k; await j.tous(async (p) => { if (course) await p.keyboard.down("Shift"); await p.keyboard.down(k); await avancer(p, d); await p.keyboard.up(k); if (course) await p.keyboard.up("Shift"); await avancer(p, 60); }); t += d + 60; }
      else if (r < 0.85) { geste = "Espace"; await j.tous(async (p) => { await p.keyboard.press("Space"); await avancer(p, 350); }); t += 350; }
      else if (r < 0.9) { geste = "menu"; await j.tous(async (p) => { await p.keyboard.press("m"); await avancer(p, 300); }); await j.comparer("menu ouvert"); await j.tous(async (p) => { await p.keyboard.press("Escape"); await avancer(p, 300); }); t += 600; }
      else if (r < 0.95) { geste = "carte"; await j.tous(async (p) => { await p.keyboard.press("k"); await avancer(p, 400); }); await j.comparer("carte ouverte"); await j.tous(async (p) => { await p.keyboard.press("k"); await avancer(p, 300); }); t += 700; }
      else { geste = "clic"; const r2 = alea(); await j.tous(async (p) => { await p.evaluate(agirJeu, r2); await avancer(p, 300); }); t += 300; }
      await j.comparer(geste);
    }
    const b = j.bilan();
    const pb = b.premier || (j.erreurs[1].length ? "erreur : " + j.erreurs[1][0] : "");
    resultat(!pb, `chapitre ${chapitre} : ${b.comparaisons} comparaisons sur 2 minutes de jeu${pb ? " : " + pb : ""}`);
    await j.fermerTout();
  }
}

if (quoi === "tout" || quoi === "epreuves") {
  console.log("\nJeu : épreuves et écrans lancés directement, puis cliqués au hasard");
  const cas = [
    [2, "champTrial(ARENAS[0])", 90, 3], [2, "duel(ARENAS[0],0)", 50, 3], [3, "champTrial(ARENAS[1])", 90, 3], [4, "champTrial(ARENAS[2])", 90, 3],
    [4, "duel(ARENAS[2],1)", 50, 5], [4, "startEncounter()", 50, 3], [5, "champTrial(ARENAS[3])", 90, 3], [6, "champTrial(ARENAS[4])", 90, 3],
    [7, "champTrial(ARENAS[5])", 90, 3], [8, "champTrial(ARENAS[6])", 90, 3], [9, "champTrial(ARENAS[7])", 90, 3], [10, "openDashboard()", 90, 9],
    [10, "actMaire()", 70, 3], [10, "openMenu('energie')", 80, 3], [11, "openMenu('energie')", 80, 11], [11, "openMenu()", 80, 3], [6, "openMap()", 40, 3],
    [1, "chooseSite()", 40, 3], [1, "openChapterSelect()", 40, 3], [5, "showFiche(FICHES[5])", 20, 3], [9, "enBadge(8)", 30, 3], [11, "gameFinale()", 50, 3],
    [11, "endScreen()", 30, 3], [3, "openAvatar(()=>{})", 60, 3], [7, "evolve(1,()=>{})", 20, 3],
  ];
  for (const [chapitre, lancer, nb, graine] of cas) {
    const j = await deuxJeux(chapitre);
    const alea = tirage(graine);
    for (let i = 0; i < 12; i++) await j.tous(async (p) => { await p.keyboard.press("Space"); await avancer(p, 300); });
    await j.comparer("arrivée");
    await j.tous((p) => p.evaluate((code) => { (0, eval)(code); }, lancer));
    await j.tous((p) => avancer(p, 500));
    await j.comparer("lancement");
    let cibleDifferente = "";
    for (let i = 0; i < nb && j.bilan().ecarts < 3 && !cibleDifferente; i++) {
      const r = alea();
      let geste = "Espace";
      if (r < 0.2) await j.tous(async (p) => { await p.keyboard.press("Space"); await avancer(p, 350); });
      else { const r2 = alea(); const d = await j.tous(async (p) => { const x = await p.evaluate(agirJeu, r2); await avancer(p, 450); return x; }); geste = d[0]; if (d[0] !== d[1]) cibleDifferente = d.join(" / "); }
      await j.comparer(geste);
    }
    const b = j.bilan();
    const pb = cibleDifferente ? "cibles différentes : " + cibleDifferente : b.premier || (j.erreurs[1].length ? "erreur : " + j.erreurs[1][0] : "");
    resultat(!pb, `chapitre ${chapitre} · ${lancer} : ${b.comparaisons} comparaisons${pb ? " : " + pb : ""}`);
    await j.fermerTout();
  }
}

await fermer();
console.log(`\n${total - differences} comparaisons identiques sur ${total}.`);
process.exit(differences ? 1 : 0);
