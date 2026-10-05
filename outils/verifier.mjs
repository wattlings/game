// Vérifie que le site fonctionne après une modification : à lancer avant de publier.
//
//   node outils/verifier.mjs            → tout (environ 3 minutes)
//   node outils/verifier.mjs cours      → seulement le cours   (ou : jeu, liens)
//
// Ce que fait la vérification :
//   cours : ouvre chaque page, manipule chaque démo, et relève toute erreur ;
//   jeu   : lance chaque chapitre, joue 20 secondes au hasard, ouvre le menu et la carte, et relève toute erreur ;
//   liens : fait l'aller-retour cours → jeu → cours et contrôle sauvegarde, reprise et anciennes adresses.
import {
  ROUTES_COURS, TOUCHES, agirCours, avancer, contenuCours, demarrer, ecouterErreurs, hasardEtHorlogeFixes, hasardFixe, nbCiblesCours, tirage, validerAvatar,
} from "./essais.mjs";

const quoi = process.argv[2] || "tout";
const { adresse, navigateur, fermer } = await demarrer();
let reussis = 0;
const echecs = [];
const verif = (nom, condition, detail = "") => {
  if (condition) reussis++;
  else { echecs.push(nom + (detail ? " — " + detail : "")); console.log("  ÉCHEC :", nom, detail); }
};

// ---------------------------------------------------------------- cours
if (quoi === "tout" || quoi === "cours") {
  console.log("Cours : chaque page, chaque démo");
  for (const route of ROUTES_COURS) {
    const contexte = await navigateur.newContext({ viewport: { width: 1200, height: 900 } });
    const page = await contexte.newPage();
    await page.addInitScript(hasardFixe);
    const erreurs = ecouterErreurs(page);
    await page.goto(adresse + "#" + route);
    await page.waitForSelector("#contenu > *");
    await page.waitForTimeout(300);
    const etat = await page.evaluate(() => ({
      vide: document.getElementById("contenu").textContent.trim().length < 50,
      demosEnPanne: [...document.querySelectorAll("#contenu .feedback.bad")].filter((e) => /Démo introuvable|n’a pas pu se charger/.test(e.textContent)).length,
      demosVides: [...document.querySelectorAll("#contenu .demo-body, #contenu [data-demo]")].filter((e) => e.offsetParent !== null && !e.children.length).length,
      termesInconnus: 0,
    }));
    verif(`${route} : la page s'affiche`, !etat.vide);
    verif(`${route} : toutes les démos se chargent`, etat.demosEnPanne === 0 && etat.demosVides === 0, JSON.stringify(etat));
    const cibles = await page.evaluate(nbCiblesCours);
    for (let i = 0; i < Math.min(60, cibles); i++) { await page.evaluate(agirCours, i); await page.waitForTimeout(15); }
    verif(`${route} : la page reste affichée après manipulation`, (await page.evaluate(contenuCours)).length > 200);
    verif(`${route} : aucune erreur`, erreurs.length === 0, erreurs.slice(0, 3).join(" | "));
    await contexte.close();
  }
}

// ---------------------------------------------------------------- jeu
if (quoi === "tout" || quoi === "jeu") {
  console.log("Jeu : chaque chapitre, 20 secondes de jeu au hasard");
  for (let chapitre = 1; chapitre <= 11; chapitre++) {
    const contexte = await navigateur.newContext({ viewport: { width: 1000, height: 760 } });
    const page = await contexte.newPage();
    await page.addInitScript(hasardEtHorlogeFixes);
    const erreurs = ecouterErreurs(page);
    await page.goto(adresse + "jeu/#chapitre-" + chapitre);
    await page.waitForTimeout(900);
    await avancer(page, 5);
    await page.waitForTimeout(300);
    await validerAvatar(page);
    await avancer(page, 600);
    const alea = tirage(chapitre * 7 + 1);
    for (let t = 0; t < 20000; ) {
      const r = alea();
      if (r < 0.55) { const k = TOUCHES[Math.floor(alea() * 4)], d = 150 + Math.floor(alea() * 700); await page.keyboard.down(k); await avancer(page, d); await page.keyboard.up(k); await avancer(page, 60); t += d + 60; }
      else if (r < 0.85) { await page.keyboard.press("Space"); await avancer(page, 350); t += 350; }
      else if (r < 0.92) { await page.keyboard.press("m"); await avancer(page, 300); await page.keyboard.press("Escape"); await avancer(page, 300); t += 600; }
      else { await page.keyboard.press("k"); await avancer(page, 400); await page.keyboard.press("k"); await avancer(page, 300); t += 700; }
    }
    const etat = await page.evaluate(() => ({ chapitre: S.ch, enCours: EN_ON, images: tick, sauvegarde: !!localStorage.getItem("wattlings-slot-1"), ecran: document.getElementById("qk-host").shadowRoot.getElementById("screen").width }));
    verif(`chapitre ${chapitre} : la partie tourne`, etat.enCours && etat.images > 800 && etat.chapitre >= chapitre && etat.ecran > 100, JSON.stringify(etat));
    verif(`chapitre ${chapitre} : la partie est sauvegardée`, etat.sauvegarde);
    verif(`chapitre ${chapitre} : aucune erreur`, erreurs.length === 0, erreurs.slice(0, 3).join(" | "));
    await contexte.close();
  }
}

// ---------------------------------------------------------------- liens entre les deux pages
if (quoi === "tout" || quoi === "liens") {
  console.log("Liens : cours → jeu → cours");
  const contexte = await navigateur.newContext({ viewport: { width: 1100, height: 800 } });
  const page = await contexte.newPage();
  const erreurs = ecouterErreurs(page);
  const dansLaPage = (f, ...a) => page.evaluate(f, ...a);
  await page.goto(adresse + "#etape-3");
  await page.waitForSelector(".qk-band");
  verif("bandeau « Mode jeu » sur l'étape 3", await dansLaPage(() => document.querySelector(".qk-band .qk-play").textContent.includes("Fiabiliser")));
  verif("bouton flottant « Jouer » tant qu'aucune partie n'existe", await dansLaPage(() => document.querySelector("#qk-fab span").textContent === "Jouer"));
  await page.click(".qk-band .qk-play");
  await page.waitForURL(/\/jeu\//);
  await page.waitForTimeout(1200);
  verif("le bouton du bandeau ouvre la page du jeu", await dansLaPage(() => location.pathname.endsWith("/jeu/") && location.hash === ""));
  await validerAvatar(page);
  await page.waitForTimeout(1200);
  verif("la partie démarre au bon chapitre", await dansLaPage(() => S.ch === 4 && EN_ON === true));
  for (let i = 0; i < 8; i++) { await page.keyboard.press("Space"); await page.waitForTimeout(250); }
  await page.keyboard.down("ArrowDown"); await page.waitForTimeout(900); await page.keyboard.up("ArrowDown"); await page.waitForTimeout(300);
  const position = await dansLaPage(() => ({ x: S.x, y: S.y, carte: S.map }));
  await dansLaPage(() => document.getElementById("qk-host").shadowRoot.getElementById("qkBack").click());
  await page.waitForURL(/#etape-3/);
  await page.waitForSelector(".qk-band");
  verif("« ← Retour au cours » ramène à la page d'où l'on venait", await dansLaPage(() => location.hash === "#etape-3" && !location.pathname.includes("/jeu/")));
  const sauvegarde = await dansLaPage(() => JSON.parse(localStorage.getItem("wattlings-slot-1") || "null"));
  verif("la partie est sauvegardée en quittant le jeu", !!sauvegarde && sauvegarde.x === position.x && sauvegarde.y === position.y && sauvegarde.map === position.carte);
  verif("le bouton flottant devient « Reprendre le jeu »", await dansLaPage(() => document.querySelector("#qk-fab span").textContent === "Reprendre le jeu"));
  await page.click("#qk-fab");
  await page.waitForURL(/\/jeu\//);
  await page.waitForTimeout(1300);
  verif("« Reprendre le jeu » reprend au même endroit", await dansLaPage((p) => EN_ON === true && S.x === p.x && S.y === p.y && S.map === p.carte, position));
  const [onglet] = await Promise.all([contexte.waitForEvent("page"), dansLaPage(() => document.getElementById("qk-host").shadowRoot.getElementById("qkCourse").click())]);
  await onglet.waitForLoadState();
  verif("« Comprendre cette étape » ouvre le cours dans un autre onglet", /#etape-3$/.test(onglet.url()) && !onglet.url().includes("/jeu/"), onglet.url());
  verif("le jeu reste ouvert pendant ce temps", await dansLaPage(() => EN_ON === true));
  await onglet.close();
  await page.goto(adresse + "#jeu-5");
  await page.waitForURL(/\/jeu\//);
  await page.waitForTimeout(1000);
  verif("l'ancienne adresse #jeu-5 mène au chapitre 5 du jeu", await dansLaPage(() => S.ch === 5));
  await page.goto(adresse + "#patrimoine");
  await page.waitForSelector(".qk-patri");
  verif("la page Patrimoine s'affiche avec ses graphiques", await dansLaPage(() => document.querySelectorAll(".pc-row").length > 20));
  verif("liens : aucune erreur", erreurs.length === 0, erreurs.slice(0, 3).join(" | "));
  await contexte.close();
}

await fermer();
console.log(`\n${reussis} vérifications réussies, ${echecs.length} échec(s).`);
if (echecs.length) { console.log(echecs.map((e) => " - " + e).join("\n")); process.exit(1); }
