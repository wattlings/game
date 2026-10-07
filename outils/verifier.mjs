// Vérifie que le site fonctionne après une modification : à lancer avant de publier.
//
//   node outils/verifier.mjs            → tout (environ 3 minutes)
//   node outils/verifier.mjs cours      → seulement le cours   (ou : jeu, voyages, liens, comptes, sources, pilotage)
//
// Ce que fait la vérification :
//   cours : ouvre chaque page, manipule chaque démo, et relève toute erreur ;
//   jeu   : lance chaque chapitre, joue 20 secondes au hasard, ouvre le menu et la carte, et relève toute erreur ;
//   voyages : prend le train vers chaque destination ouverte, vérifie que tout ce qui s'examine est accessible à pied,
//             examine tout, manipule les simulations, fait tamponner le passeport et rentre ;
//   liens : fait l'aller-retour cours → jeu → cours et contrôle sauvegarde, reprise et anciennes adresses ;
//   guidage : la ligne d'objectif (une action, sa progression), la flèche au bord de l'écran, les aides montrées en jouant,
//             l'avatar et l'écran titre simplifiés, le message à la porte d'une arène, les textes adaptés au tactile ;
//   menu : la liste façon Rouge Feu (curseur, aide, A ouvre, B revient, M referme), poches du carnet, options, patine par défaut ;
//   comptes : sans compte, le jeu propose de se connecter ou de jouer sans rien enregistrer, et n'enregistre rien ;
//             la présentation du début de partie, l'avertissement en quittant une partie non sauvegardée ;
//   (toutes les autres vérifications jouent connectées à un compte d'essai simulé : voir compteDEssai dans essais.mjs)
//   sources : contrôle que chaque source citée existe, et que chaque fait relevé a la sienne (voir outils/sources.mjs).
//   pilotage : ouvre la page de pilotage, chaque pastille, modifie un texte, et lance des essais dans le jeu.
import {
  ROUTES_COURS, TOUCHES, agirCours, agirJeu, avancer, contenuCours, demarrer, ecouterErreurs, hasardEtHorlogeFixes, hasardFixe, nbCiblesCours, tirage, validerAvatar,
} from "./essais.mjs";
import { controler } from "./sources.mjs";

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

// ---------------------------------------------------------------- voyages en train
if (quoi === "tout" || quoi === "voyages") {
  console.log("Voyages : la gare, le train, chaque destination ouverte");
  const contexte = await navigateur.newContext({ viewport: { width: 1000, height: 760 } });
  const page = await contexte.newPage();
  await page.addInitScript(hasardFixe);
  const erreurs = ecouterErreurs(page);
  const dansLaPage = (f, ...a) => page.evaluate(f, ...a);
  const finDialogue = async () => { for (let i = 0; i < 80 && (await dansLaPage(() => dlg.open)); i++) { await page.keyboard.press("Space"); await page.waitForTimeout(40); } };
  const cliquer = (sel) => dansLaPage((s) => { const e = document.getElementById("qk-host").shadowRoot.querySelector(s); if (e) e.click(); return !!e; }, sel);
  await page.goto(adresse + "jeu/#chapitre-11");
  await page.waitForTimeout(1200);
  await validerAvatar(page);
  await page.waitForTimeout(900);
  await finDialogue();
  await dansLaPage(() => { if (panelEl) closePanel(); const b = BLD.find((b) => b.id === "gare"); enterDoor(b.door[0], b.door[1]); });
  await page.waitForTimeout(700);
  await finDialogue();
  verif("à l'épilogue, la porte de la gare ouvre sur le hall", await dansLaPage(() => S.map === "gare"));
  await dansLaPage(() => gareGuichet());
  await finDialogue();
  await page.waitForTimeout(200);
  verif("le guichet remet le passeport", await dansLaPage(() => !!(S.voy && S.voy.pass)));
  const destinations = await dansLaPage(() => VOY.ordre.filter((id) => VOY.sites[id].ouvert));
  verif("au moins une destination est ouverte", destinations.length > 0);
  const alea = tirage(99);
  for (const id of destinations) {
    await dansLaPage(() => gareDeparts());
    await page.waitForTimeout(200);
    verif(`${id} : le tableau des départs propose la ligne`, await cliquer(`[data-d="${id}"]`));
    await page.waitForTimeout(400);
    await page.keyboard.press("Enter");
    await page.waitForTimeout(900);
    await finDialogue();
    verif(`${id} : le train arrive sur le site`, await dansLaPage((id) => S.map === VOY.sites[id].carte && !isSolid(P.x, P.y), id));
    // la carte (touche K) : sur un site, elle s'ouvre sur le plan du site, où chaque information a sa place
    await page.keyboard.press("k");
    await page.waitForTimeout(300);
    verif(`${id} : la carte s'ouvre sur le plan du site`, await dansLaPage((id) => WM.open && WM.lieu === VOY.sites[id].carte, id));
    await page.keyboard.press("Escape");
    await page.waitForTimeout(150);
    const plan = await dansLaPage((id) => {
      const s = VOY.sites[id], cartes = s.cartes || [s.carte], vues = new Set(), defauts = [];
      if (!s.pays) defauts.push("pas de position sur la carte du pays (pays:[longitude, latitude])");
      cartes.forEach((c, i) => {
        const m = MAPS[c], w = m.g[0].length, h = m.g.length;
        if (i && !m.pays) defauts.push(`${c} : pas de position sur la carte du pays`);
        if (!m.zones || !m.ailleurs) defauts.push(`${c} : zones ou ailleurs manquant`);
        (m.zones || []).forEach((z) => { if (!z.t || !z.d || (!z.r && !z.c)) defauts.push(`${c} : zone incomplète (${z.t || "sans nom"})`); if (z.r && (z.r[0] < 0 || z.r[1] < 0 || z.r[2] >= w || z.r[3] >= h || z.r[0] > z.r[2] || z.r[1] > z.r[3])) defauts.push(`${c} : zone « ${z.t} » hors du plan`); });
        atlasSources(c, id).forEach((x) => vues.add(x.f.id));
      });
      s.infos.forEach((f) => { if (!vues.has(f.id)) defauts.push(`information « ${f.id} » introuvable sur le plan`); });
      if (!cartes.some((c) => atlasObjets(c).some((o) => o.chef))) defauts.push("pas de responsable du site (chef:1)");
      return defauts;
    }, id);
    verif(`${id} : le plan nomme ses zones et situe chaque information`, plan.length === 0, plan.join(" ; "));
    // un site peut avoir plusieurs cartes (site.cartes) : on les visite toutes
    const cartes = await dansLaPage((id) => VOY.sites[id].cartes || [VOY.sites[id].carte], id);
    const allerSur = (carte) => dansLaPage(([id, carte]) => { const s = VOY.sites[id], p = carte === s.carte ? s.arrivee : MAPS[carte].depart; if (S.map !== carte || isSolid(P.x, P.y)) warp(carte, p[0], p[1], p[2] || "up"); }, [id, carte]);
    const finTrajet = async () => { if (await dansLaPage(() => !!VOY.trajet)) { await page.keyboard.press("Enter"); await page.waitForTimeout(600); await finDialogue(); } };
    for (const carte of cartes) {
      await allerSur(carte);
      await page.waitForTimeout(300);
      await finDialogue();
      // tout ce qui s'examine doit avoir une case voisine accessible à pied depuis le point d'arrivée de la carte
      const bilan = await dansLaPage((id) => {
        const g = MAPS[S.map].g, H = g.length, W = g[0].length, vu = new Set([P.x + "," + P.y]), file = [[P.x, P.y]];
        while (file.length) { const [x, y] = file.pop(); [[1, 0], [-1, 0], [0, 1], [0, -1]].forEach(([dx, dy]) => { const a = x + dx, b = y + dy, k = a + "," + b; if (a < 0 || b < 0 || a >= W || b >= H || vu.has(k) || isSolid(a, b)) return; vu.add(k); file.push([a, b]); }); }
        const objets = objsFor(S.map).filter((o) => o.act), hors = objets.filter((o) => ![[1, 0], [-1, 0], [0, 1], [0, -1]].some(([dx, dy]) => vu.has(o.x + dx + "," + (o.y + dy))));
        const cles = VOY.sites[id].infos.filter((f) => f.cle).length, fleches = targets();
        return { objets: objets.map((o) => [o.x, o.y]), hors: hors.map((o) => o.kind + "@" + o.x + "," + o.y), cibles: fleches.length, flechesHors: fleches.filter(([x, y]) => !objets.some((o) => o.x === x && o.y === y)).map((p) => p.join(",")), cles };
      }, id);
      verif(`${id} (${carte}) : tout ce qui s'examine est accessible à pied`, bilan.hors.length === 0, bilan.hors.join(" "));
      verif(`${id} (${carte}) : les flèches pointent vers quelque chose qui s'examine`, bilan.cibles >= 1 && bilan.cibles <= bilan.cles + 1 && bilan.flechesHors.length === 0, `${bilan.cibles} flèches, hors cible : ${bilan.flechesHors.join(" ")}`);
      // examiner chaque objet, parler à chacun, manipuler ce qui s'ouvre
      for (const [x, y] of bilan.objets) {
        await dansLaPage(([x, y]) => { const o = objAt(x, y); if (o && o.act) o.act(); }, [x, y]);
        await page.waitForTimeout(40);
        await finDialogue();
        await page.waitForTimeout(120);
        for (let i = 0; i < 25 && (await dansLaPage(() => !!panelEl)); i++) { await dansLaPage(agirJeu, alea()); await page.waitForTimeout(30); await finDialogue(); }
        if (await dansLaPage(() => !!panelEl)) { if (!(await cliquer(".voy-plus-tard"))) await dansLaPage(() => closePanel()); }
        await finTrajet();
        await finDialogue();
        await allerSur(carte);
        await finDialogue();
      }
    }
    await allerSur(cartes[0]);
    verif(`${id} : des informations sont notées en examinant le site`, await dansLaPage((id) => voyInfosVues(id).length >= 5, id));
    // le tampon, puis le passeport
    await dansLaPage((id) => { VOY.sites[id].infos.forEach((f) => { voyEtat().infos[id + "." + f.id] = 1; }); voyTamponner(id); }, id);
    await page.waitForTimeout(300);
    verif(`${id} : le tampon s'affiche`, await cliquer("#vOk"));
    await finDialogue();
    await dansLaPage(() => openMenu("passeport"));
    await page.waitForTimeout(200);
    const passeport = await dansLaPage((id) => { const r = document.getElementById("qk-host").shadowRoot; return { visas: r.querySelectorAll(".voy-visa").length, poses: r.querySelectorAll(".voy-visa.pose").length, fiches: r.querySelectorAll(".cls .fiche").length, attendu: VOY.ordre.filter((i) => VOY.sites[i].ouvert).reduce((n, i) => n + VOY.sites[i].infos.length, 0), sites: VOY.ordre.length }; }, id);
    verif(`${id} : le passeport montre le tampon et les informations`, passeport.visas === passeport.sites && passeport.poses >= 1 && passeport.fiches === passeport.attendu, JSON.stringify(passeport));
    await dansLaPage(() => closePanel());
    await dansLaPage((id) => voyTrajet("retour", id), id);
    await page.waitForTimeout(300);
    await page.keyboard.press("Enter");
    await page.waitForTimeout(900);
    await finDialogue();
    verif(`${id} : le train du retour ramène à la gare`, await dansLaPage(() => S.map === "gare" && !isSolid(P.x, P.y)));
  }
  await dansLaPage(() => MAPS.gare.sortie());
  await page.waitForTimeout(500);
  verif("la sortie de la gare ramène en ville", await dansLaPage(() => S.map === "town" && !isSolid(P.x, P.y)));
  // la carte à étages : la ville, puis le pays en dézoomant, puis le plan de chaque lieu en zoomant dessus
  await page.keyboard.press("k");
  await page.waitForTimeout(300);
  verif("en ville, la carte s'ouvre sur la ville", await dansLaPage(() => WM.open && WM.lieu === "town"));
  await page.keyboard.press("-");
  await page.waitForTimeout(1100);
  verif("dézoomer mène à la carte du pays", await dansLaPage(() => WM.lieu === "pays" && !WM.anim));
  const lieux = await dansLaPage(() => atlasPlaces().filter((l) => !l.ferme).map((l) => l.id));
  verif("la carte du pays montre la ville et tous les sites ouverts", lieux.includes("town") && destinations.every((id) => lieux.includes(id)), lieux.join(" "));
  for (const lieu of lieux) {
    await dansLaPage((lieu) => { const c = ATLAS_PAYS.caseDe(lieu); WM.cx = c[0]; WM.cy = c[1]; }, lieu);
    await page.waitForTimeout(80);
    await page.keyboard.press("+");
    await page.waitForTimeout(1100);
    const vu = await dansLaPage(() => ({ lieu: WM.lieu, anim: !!WM.anim, titre: WM.el.querySelector(".wm-top b").textContent, info: WM.el.querySelector(".wm-info b").textContent }));
    verif(`carte : zoomer sur « ${lieu} » montre son plan`, vu.lieu === lieu && !vu.anim && !!vu.titre && !!vu.info, JSON.stringify(vu));
    await page.keyboard.press("-");
    await page.waitForTimeout(1100);
    verif(`carte : dézoomer depuis « ${lieu} » revient au pays`, await dansLaPage(() => WM.lieu === "pays" && !WM.anim));
  }
  await page.keyboard.press("Escape");
  await page.waitForTimeout(200);
  verif("la carte se referme", await dansLaPage(() => !WM.open && !busy));
  const sauvegarde = await dansLaPage(() => JSON.parse(localStorage.getItem("wattlings-slot-1") || "null"));
  verif("le passeport est dans la sauvegarde", !!(sauvegarde && sauvegarde.voy && sauvegarde.voy.pass && Object.keys(sauvegarde.voy.tampons).length === destinations.length));
  verif("voyages : aucune erreur", erreurs.length === 0, erreurs.slice(0, 3).join(" | "));
  await contexte.close();
}

// ---------------------------------------------------------------- guidage
if (quoi === "tout" || quoi === "guidage") {
  console.log("Guidage : objectif, flèche, aides, premières minutes");
  const ombreDe = (page) => (s) => page.evaluate((s) => { const e = document.getElementById("qk-host").shadowRoot.querySelector(s); return e ? e.textContent : null; }, s);
  const finDialogue = async (page) => { for (let i = 0; i < 40 && (await page.evaluate(() => dlg.open)); i++) { await page.evaluate(() => nextLine()); await page.waitForTimeout(40); } };
  // une vraie première partie, sans compte : écran titre, avatar, première aide
  {
    const contexte = await navigateur.newContext({ viewport: { width: 1280, height: 800 }, sansCompte: true });
    const page = await contexte.newPage(); const erreurs = ecouterErreurs(page); const ombre = ombreDe(page);
    await page.goto(adresse + "jeu/"); await page.waitForTimeout(1000);
    await page.evaluate(() => document.getElementById("qk-host").shadowRoot.querySelector("[data-a=guest]").click()); await page.waitForTimeout(300);
    verif("titre : un seul bouton pour commencer, le reste sous « Plus d'options »", await page.evaluate(() => { const r = document.getElementById("qk-host").shadowRoot; return !!r.querySelector("[data-a=new]") && !r.querySelector("details.plus").open && !!r.querySelector("details.plus [data-hades]"); }));
    await page.evaluate(() => { const r = document.getElementById("qk-host").shadowRoot; r.querySelector("#pn1").value = "Léa"; r.querySelector("[data-a=new]").click(); }); await page.waitForTimeout(300);
    await page.evaluate(() => document.getElementById("qk-host").shadowRoot.getElementById("prSkip").click()); await page.waitForTimeout(300);
    const av = await page.evaluate(() => { const b = document.getElementById("qk-host").shadowRoot.getElementById("avOk"), r = b.getBoundingClientRect(); return { txt: b.textContent, vu: r.bottom <= innerHeight && r.top >= 0, cours: !!document.getElementById("qk-host").shadowRoot.querySelector(".panel .course-link") }; });
    verif("avatar : « C'est parti » visible sans faire défiler, sans lien vers le cours", /C'est parti/.test(av.txt) && av.vu && !av.cours, JSON.stringify(av));
    await page.evaluate(() => document.getElementById("qk-host").shadowRoot.getElementById("avOk").click()); await page.waitForTimeout(1500);
    verif("début : pas de long dialogue d'accueil, la ligne d'objectif est là", !(await page.evaluate(() => dlg.open)) && /Parle à Mme Joule/.test((await ombre("#objFlash")) || ""));
    verif("début : l'aide montre comment se déplacer", /déplacer/.test((await ombre("#aide")) || ""));
    await page.waitForTimeout(7000);
    verif("début : la ligne d'objectif reste affichée", await page.evaluate(() => !document.getElementById("qk-host").shadowRoot.getElementById("objFlash").hidden));
    await page.evaluate(() => { P.x = 8; P.y = 5; P.dir = "up"; P.px = P.x * TS; P.py = P.y * TS; }); await page.waitForTimeout(1200);
    verif("début : devant Mme Joule, l'aide montre comment parler", /Espace pour parler/.test((await ombre("#aide")) || ""), await ombre("#aide"));
    // le choix du site, comme le starter de Pokémon Rouge Feu : trois maquettes sur la table
    await page.evaluate(() => actMaquette("ecole")); await page.waitForTimeout(200);
    verif("maquettes : avant Mme Joule, on les regarde sans pouvoir choisir", (await page.evaluate(() => dlg.open && /Mme Joule t'en dira plus/.test(dlg.cur.full))) && !(await ombre(".maquette-vue")));
    await finDialogue(page);
    await page.evaluate(() => actJoule()); await finDialogue(page); await page.waitForTimeout(700);
    verif("maquettes : Mme Joule les présente, l'objectif et la flèche y mènent", /Choisis ton site.*1\/2/.test((await ombre("#objFlash")) || "") && JSON.stringify(await page.evaluate(() => targets())) === "[[3,4]]", await ombre("#objFlash"));
    await page.evaluate(() => actMaquette("bureau")); await page.waitForTimeout(200);
    verif("maquette : A la montre en grand, « Tu choisis… ? » Oui / Non, sans lien vers le cours", /Tu choisis les Bureaux Le Carré/.test((await ombre(".pbody")) || "") && !!(await ombre("#csOui")) && !(await page.evaluate(() => !!document.getElementById("qk-host").shadowRoot.querySelector(".panel .course-link"))));
    await page.evaluate(() => document.getElementById("qk-host").shadowRoot.getElementById("csNon").click()); await page.waitForTimeout(150);
    verif("maquette : Non referme, rien n'est choisi", (await page.evaluate(() => !panelEl && S.ch === 0 && !S.site)));
    await page.evaluate(() => actMaquette("ecole")); await page.waitForTimeout(200);
    verif("maquette : l'école est recommandée", /Recommandé/.test((await ombre(".maquette-vue")) || ""));
    await page.evaluate(() => document.getElementById("qk-host").shadowRoot.getElementById("csOui").click()); await page.waitForTimeout(300);
    verif("maquette : Oui choisit le site et lance l'étape 1", await page.evaluate(() => S.site === "ecole" && S.ch === 1 && dlg.open));
    verif("guidage : aucune erreur (première partie)", erreurs.length === 0, erreurs.slice(0, 3).join(" | "));
    await contexte.close();
  }
  // le guidage étape par étape
  {
    const contexte = await navigateur.newContext({ viewport: { width: 1280, height: 800 } });
    const page = await contexte.newPage(); const erreurs = ecouterErreurs(page); const ombre = ombreDe(page);
    await page.goto(adresse + "jeu/#essai-chapitre-1"); await page.waitForTimeout(2200); await finDialogue(page); await page.waitForTimeout(700);
    verif("chapitre 1 : une seule action, dans l'ordre de Mme Joule, avec sa progression", /^▶Lis l'adresse.*0\/4$/.test((await ombre("#objFlash")) || ""), await ombre("#objFlash"));
    verif("chapitre 1 : une seule cible pour la flèche", (await page.evaluate(() => targets().length)) === 1);
    await page.evaluate(() => { S.notes.adresse = "x"; }); await page.waitForTimeout(800);
    verif("chapitre 1 : l'adresse lue, l'objectif passe à la surface (1/4)", /surface.*1\/4$/.test((await ombre("#objFlash")) || ""), await ombre("#objFlash"));
    await page.evaluate(() => { const [x, y] = targets()[0]; P.x = x + 40; P.y = y; P.px = P.x * TS; P.py = P.y * TS; }); await page.waitForTimeout(400);
    verif("flèche : la cible hors de l'écran, la flèche se pose au bord", await page.evaluate(() => aideFlecheHors === true));
    await page.goto(adresse + "jeu/#essai-chapitre-3"); await page.waitForTimeout(2200); await finDialogue(page);
    verif("porte d'arène : combien d'infos clés manquent, et la prochaine", /^Il te manque 3 infos clés sur 3\. Prochaine : parle à/.test(await page.evaluate(() => missingLines(3)[0].t)), await page.evaluate(() => missingLines(3)[0].t));
    await page.evaluate(() => openMenu("objectif")); await page.waitForTimeout(200);
    verif("menu → Objectif : la liste des tâches de l'étape, la prochaine marquée", (await page.evaluate(() => document.getElementById("qk-host").shadowRoot.querySelectorAll(".obj-liste li").length)) >= 4 && (await page.evaluate(() => document.getElementById("qk-host").shadowRoot.querySelectorAll(".obj-liste li.cur").length)) === 1);
    verif("guidage : aucune erreur (étapes)", erreurs.length === 0, erreurs.slice(0, 3).join(" | "));
    await contexte.close();
  }
  // à l'écran tactile, les textes parlent des boutons
  {
    const contexte = await navigateur.newContext({ viewport: { width: 390, height: 760 }, hasTouch: true, isMobile: true });
    const page = await contexte.newPage();
    await page.goto(adresse + "jeu/#essai-chapitre-3"); await page.waitForTimeout(2200); await finDialogue(page);
    const t = await page.evaluate(() => { say([{ t: "La carte (touche K) montre le chemin ; le menu (touche M)." }]); return dlg.cur.full; });
    verif("tactile : « touche K » devient « bouton CARTE »", /bouton CARTE/.test(t) && /bouton Menu/.test(t) && !/touche/.test(t), t);
    await contexte.close();
  }
}

// ---------------------------------------------------------------- menu
if (quoi === "tout" || quoi === "menu") {
  console.log("Menu : la liste, ses écrans, les options");
  const contexte = await navigateur.newContext({ viewport: { width: 1000, height: 760 } });
  const page = await contexte.newPage();
  const erreurs = ecouterErreurs(page);
  const dansLaPage = (f, ...a) => page.evaluate(f, ...a);
  const ombre = (s) => dansLaPage((s) => { const e = document.getElementById("qk-host").shadowRoot.querySelector(s); return e ? e.textContent : null; }, s);
  await page.goto(adresse + "jeu/#chapitre-2");
  await page.waitForTimeout(1200);
  await validerAvatar(page);
  await page.waitForTimeout(900);
  await dansLaPage(() => { dlg.q = []; if (dlg.open) nextLine(); if (panelEl) closePanel(); });
  await page.waitForTimeout(200);
  verif("menu : la patine de la ville est à 1 par défaut", await dansLaPage(() => PREF.wear === 1 && wearLvl() === 1));
  await page.keyboard.press("m"); await page.waitForTimeout(200);
  const liste = await dansLaPage(() => [...document.getElementById("qk-host").shadowRoot.querySelectorAll(".fr-menu .fr-item")].map((b) => b.dataset.k));
  verif("menu : M ouvre la liste (objectif, carte, énergie, anomalidex, classeur, carnet, joueur, étapes, sauver, options, retour)", liste.join() === "objectif,carte,energie,dex,classeur,carnet,joueur,etapes,save,opt,fermer", liste.join());
  const aide1 = await ombre(".fr-aide");
  await page.keyboard.press("ArrowDown"); await page.keyboard.press("ArrowDown"); await page.waitForTimeout(100);
  verif("menu : le curseur descend et le bandeau explique l'entrée choisie", (await ombre(".fr-item.on")) === "Énergie" && (await ombre(".fr-aide")) !== aide1 && /tableau de bord/.test(await ombre(".fr-aide")));
  await page.keyboard.press("Enter"); await page.waitForTimeout(300);
  verif("menu : A ouvre l'écran Énergie", /Énergie/i.test((await ombre(".fr-ecran .fr-titre")) || "") && !(await ombre(".fr-menu")));
  await page.keyboard.press("Escape"); await page.waitForTimeout(200);
  verif("menu : B ramène à la liste, curseur à la même place", (await ombre(".fr-item.on")) === "Énergie");
  await page.keyboard.press("m"); await page.waitForTimeout(200);
  verif("menu : M referme tout", await dansLaPage(() => !panelEl && !busy));
  await dansLaPage(() => openMenu("sec")); await page.waitForTimeout(200);
  verif("menu : un ancien onglet (secrets) ouvre la bonne poche du carnet", /Secrets/i.test((await ombre(".fr-poche.on")) || "") && /secrets trouvés/.test((await ombre("#mt")) || ""));
  await page.keyboard.press("ArrowRight"); await page.waitForTimeout(150);
  verif("menu : droite change de poche", !/Secrets/i.test((await ombre(".fr-poche.on")) || ""));
  await dansLaPage(() => { closePanel(); openMenu("badges"); }); await page.waitForTimeout(200);
  verif("menu : la carte de joueur montre les 8 badges", (await dansLaPage(() => document.getElementById("qk-host").shadowRoot.querySelectorAll(".fr-badges canvas").length)) === 8);
  await dansLaPage(() => { closePanel(); MENU.opt = 0; openMenu("opt"); }); await page.waitForTimeout(200);
  for (let i = 0; i < 5; i++) await page.keyboard.press("ArrowDown");
  await page.keyboard.press("ArrowRight"); await page.waitForTimeout(200);
  verif("menu : dans les options, droite change la patine (1 → 2) et l'enregistre", await dansLaPage(() => PREF.wear === 2 && JSON.parse(localStorage.getItem("wattlings-prefs") || "{}").wear === 2));
  await page.keyboard.press("ArrowLeft"); await page.waitForTimeout(150);
  await dansLaPage(() => closePanel());
  await dansLaPage(() => openMenu()); await page.waitForTimeout(150);
  await dansLaPage(() => document.getElementById("qk-host").shadowRoot.querySelector('.fr-menu [data-k=save]').click()); await page.waitForTimeout(200);
  await dansLaPage(() => document.getElementById("qk-host").shadowRoot.getElementById("svNow").click()); await page.waitForTimeout(150);
  verif("menu : Sauver → Oui sauvegarde la partie", /sauvegardé la partie/.test((await ombre("#svMsg")) || ""));
  await dansLaPage(() => closePanel());
  // à l'écran tactile : la croix déplace le curseur, A ouvre, B revient
  const toucher = (sel) => dansLaPage((sel) => document.getElementById("qk-host").shadowRoot.querySelector(sel).dispatchEvent(new PointerEvent("pointerdown", { bubbles: true, composed: true })), sel);
  await dansLaPage(() => { MENU.cur = 0; openMenu(); }); await page.waitForTimeout(100);
  await toucher('.dpad button[data-k="down"]'); await page.waitForTimeout(100);
  verif("menu tactile : la croix déplace le curseur", (await ombre(".fr-item.on")) === "Carte");
  await toucher('.dpad button[data-k="down"]'); await toucher(".ab .a"); await page.waitForTimeout(250);
  verif("menu tactile : A ouvre l'écran", /Énergie/i.test((await ombre(".fr-ecran .fr-titre")) || ""));
  await toucher(".ab .b"); await page.waitForTimeout(200);
  verif("menu tactile : B revient à la liste", (await ombre(".fr-item.on")) === "Énergie");
  await dansLaPage(() => closePanel());
  verif("menu : aucune erreur", erreurs.length === 0, erreurs.slice(0, 3).join(" | "));
  await contexte.close();
}

// ---------------------------------------------------------------- comptes : jouer sans compte
if (quoi === "tout" || quoi === "comptes") {
  console.log("Comptes : jouer sans compte, sans rien enregistrer");
  const contexte = await navigateur.newContext({ viewport: { width: 1000, height: 760 }, sansCompte: true });
  const page = await contexte.newPage();
  const erreurs = ecouterErreurs(page);
  const dansLaPage = (f, ...a) => page.evaluate(f, ...a);
  const ombre = (s) => dansLaPage((s) => { const e = document.getElementById("qk-host").shadowRoot.querySelector(s); return e ? e.textContent : null; }, s);
  const cliquer = (s) => dansLaPage((s) => { const e = document.getElementById("qk-host").shadowRoot.querySelector(s); if (e) e.click(); return !!e; }, s);
  // une partie d'avant les comptes, restée dans ce navigateur : elle doit être annoncée, pas jouée
  await page.goto(adresse + "pilotage/");
  await dansLaPage(() => localStorage.setItem("wattlings-slot-2", JSON.stringify({ site: "ecole", ch: 2, name: "Ancien", savedAt: 5 })));
  await page.goto(adresse + "jeu/#chapitre-3");
  await page.waitForTimeout(1200);
  verif("sans compte : l'écran titre propose de se connecter", /Connecte-toi/.test((await ombre(".title-screen .slot.auth")) || "") && /sans s'authentifier/.test((await ombre(".title-screen [data-a=guest]")) || ""));
  verif("sans compte : la demande « chapitre 3 » attend le choix du joueur", await dansLaPage(() => !EN_ON && /chapitre-3/.test(location.hash)));
  verif("sans compte : une partie d'avant les comptes est annoncée", /Ancien/.test((await ombre(".title-screen .slot.auth")) || ""));
  await cliquer("[data-a=guest]");
  await page.waitForTimeout(600);
  // nouvelle partie : la présentation d'abord (les commandes, puis le jeu), qu'on peut passer
  verif("présentation : elle s'ouvre sur les commandes", /Les commandes/.test((await ombre(".presentation header")) || "") && /Marcher/.test((await ombre(".presentation .keys-t")) || ""));
  await cliquer("#prNext"); await page.waitForTimeout(150);
  verif("présentation : puis le jeu et son objectif", /Le jeu et son objectif/.test((await ombre(".presentation header")) || "") && /8 quartiers/.test((await ombre(".presentation .pbody")) || ""));
  await page.keyboard.press("ArrowLeft"); await page.waitForTimeout(150);
  verif("présentation : on revient en arrière", /Les commandes/.test((await ombre(".presentation header")) || ""));
  await cliquer("#prSkip"); await page.waitForTimeout(300);
  verif("présentation : « Passer » mène à l'avatar", !(await ombre(".presentation")) && (await dansLaPage(() => !!document.getElementById("qk-host").shadowRoot.getElementById("avOk"))));
  await validerAvatar(page);
  await page.waitForTimeout(1200);
  verif("« Continuer sans s'authentifier » ouvre le chapitre demandé", await dansLaPage(() => INVITE === true && EN_ON === true && S.ch === 3 && location.hash === ""), JSON.stringify(await dansLaPage(() => ({ invite: INVITE, en: EN_ON, ch: S.ch, h: location.hash }))));
  for (let i = 0; i < 6; i++) { await page.keyboard.press("Space"); await page.waitForTimeout(200); }
  await dansLaPage(() => { save(); qkSaveNow(); });
  await page.keyboard.press("m"); await page.waitForTimeout(300);
  await cliquer(".fr-menu [data-k=save]"); await page.waitForTimeout(200);
  const ongletSauvegarde = await dansLaPage(() => document.getElementById("qk-host").shadowRoot.querySelector(".pbody")?.textContent || "");
  await page.keyboard.press("m");
  await page.waitForTimeout(300);
  // quitter sans compte : le joueur est prévenu, peut rester, créer un profil ou quitter sans enregistrer
  await cliquer("#qkBack"); await page.waitForTimeout(200);
  verif("quitter sans compte : le joueur est prévenu", /n'est pas sauvegardée/.test((await ombre(".invite-quit")) || "") && !!(await ombre(".invite-quit [data-a=creer]")) && !!(await ombre(".invite-quit [data-a=quitter]")));
  await cliquer(".invite-quit [data-a=rester]"); await page.waitForTimeout(200);
  verif("quitter sans compte : « Continuer à jouer » referme l'avertissement", !(await ombre(".invite-quit")) && (await dansLaPage(() => EN_ON && !busy)));
  await cliquer("#qkBack"); await page.waitForTimeout(200);
  await cliquer(".invite-quit [data-a=creer]"); await page.waitForTimeout(200);
  verif("quitter sans compte : « Créer un profil » ouvre la création de compte", /Créer mon compte/.test((await ombre(".cpt")) || ""));
  await page.keyboard.press("Escape"); await page.waitForTimeout(200);
  await cliquer("#qkBack"); await page.waitForTimeout(200);
  await Promise.all([page.waitForURL((u) => !u.pathname.includes("/jeu/")), cliquer(".invite-quit [data-a=quitter]")]);
  verif("quitter sans compte : « Quitter sans enregistrer » ramène au cours", !page.url().includes("/jeu/"));
  await page.goto(adresse);
  const cles = await dansLaPage(() => ({ partie: JSON.parse(localStorage.getItem("wattlings-slot-1") || "null"), compte: localStorage.getItem("wattlings-compte") }));
  verif("sans compte : la partie jouée n'est pas enregistrée", !cles.partie || cles.partie.name === "Ancien", JSON.stringify(cles.partie && cles.partie.name));
  verif("sans compte : aucune clé de compte", !cles.compte);
  verif("sans compte : le menu dit que rien n'est sauvegardé", /sans compte/.test(ongletSauvegarde), ongletSauvegarde.slice(0, 80));
  verif("comptes : aucune erreur", erreurs.length === 0, erreurs.slice(0, 3).join(" | "));
  await contexte.close();
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
  verif("bandeau « Mode jeu » sur l'étape 3 : sans partie, « Commencer le jeu » et un lien direct vers l'étape", await dansLaPage(() => /Commencer le jeu/.test(document.querySelector(".qk-band .qk-play").textContent) && /Fiabiliser/.test(document.querySelector(".qk-band .qk-direct").textContent)));
  verif("bouton flottant « Jouer » tant qu'aucune partie n'existe", await dansLaPage(() => document.querySelector("#qk-fab span").textContent === "Jouer"));
  await page.click(".qk-band .qk-direct a");
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
  verif("« Cours de cette étape » ouvre le cours dans un autre onglet", /#etape-3$/.test(onglet.url()) && !onglet.url().includes("/jeu/"), onglet.url());
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

// ---------------------------------------------------------------- sources
if (quoi === "tout" || quoi === "sources") {
  console.log("Sources : le registre, les citations, les relevés");
  const r = await controler();
  r.verifs.forEach(([nom, ok, detail]) => verif("sources · " + nom, ok, detail));
  // dans le cours : les appels de note de l'étape 2 mènent à une source, et la page Sources les réunit
  const contexte = await navigateur.newContext({ viewport: { width: 1200, height: 900 } });
  const page = await contexte.newPage();
  const erreurs = ecouterErreurs(page);
  await page.goto(adresse + "#etape-2-approfondir");
  await page.waitForSelector("[data-notes] li");
  const notes = await page.evaluate(() => ({ appels: [...document.querySelectorAll(".notes .appel")].map((a) => a.href), liste: document.querySelectorAll("[data-notes] li").length, brut: document.body.innerText.includes("[[") }));
  verif("sources · cours : l'étape 2 affiche ses appels de note et la liste de ses sources", notes.appels.length > 20 && notes.liste > 10 && notes.appels.every((u) => /^https:/.test(u)) && !notes.brut, JSON.stringify({ appels: notes.appels.length, liste: notes.liste, brut: notes.brut }));
  await page.goto(adresse + "#sources");
  await page.waitForSelector(".page-sources li");
  verif("sources · cours : la page Sources liste les références citées", (await page.locator(".page-sources li").count()) > 20);
  // dans le jeu : l'onglet Sources du menu, et le volet Sources d'une fiche
  await page.goto(adresse + "jeu/#chapitre-3");
  await page.waitForTimeout(1500);
  await validerAvatar(page);
  await page.waitForTimeout(800);
  const jeu = await page.evaluate(() => {
    dlg.q = []; if (dlg.open) nextLine(); if (panelEl) closePanel();
    S.fiches = S.fiches || {}; S.fiches.s2r1 = 1;
    openMenu("sources");
    const r = document.getElementById("qk-host").shadowRoot, onglet = { blocs: r.querySelectorAll("#mt .cls").length, liens: [...r.querySelectorAll("#mt .refs-l a")].map((a) => a.href) };
    closePanel(); openMenu("classeur");
    const fiche = r.querySelectorAll("#mt .fiche .refs a").length;
    closePanel();
    return { onglet, fiche };
  });
  verif("sources · jeu : l'onglet Sources du menu liste des références", jeu.onglet.blocs >= 1 && jeu.onglet.liens.length >= 10 && jeu.onglet.liens.every((u) => /^https:/.test(u)), JSON.stringify({ blocs: jeu.onglet.blocs, liens: jeu.onglet.liens.length }));
  verif("sources · jeu : une fiche savoir référencée montre son volet Sources", jeu.fiche >= 1, String(jeu.fiche));
  verif("sources : aucune erreur", erreurs.length === 0, erreurs.slice(0, 3).join(" | "));
  await contexte.close();
}

// ---------------------------------------------------------------- page de pilotage
if (quoi === "tout" || quoi === "pilotage") {
  console.log("Pilotage : la page lit le jeu, montre chaque pastille, modifie un texte, lance un essai");
  const contexte = await navigateur.newContext({ viewport: { width: 1300, height: 900 } });
  const page = await contexte.newPage();
  const erreurs = ecouterErreurs(page);
  await page.goto(adresse + "pilotage/");
  const pret = await page.waitForFunction(() => window.PILOTAGE, null, { timeout: 20000 }).then(() => true, () => false);
  verif("pilotage : la page démarre", pret);
  if (pret) {
    const bilan = await page.evaluate(() => {
      const { P, edition, ouvrir, noeuds } = PILOTAGE, sec = (id) => P.sections.find((s) => s.id === id);
      const chapitres = sec("histoire").rangs.filter((r) => r.suivi), sites = sec("voyages").rangs.filter((r) => r.suivi);
      // chaque pastille s'ouvre et montre quelque chose
      const muettes = [];
      for (const id of noeuds.keys()) { try { if (!ouvrir(id, { defiler: false, adresse: false }) || document.querySelector(".detail").textContent.trim().length < 20) muettes.push(id); } catch (e) { muettes.push(id + " (" + e.message + ")"); } }
      // chaque texte, réécrit tel quel, redonne un fichier que le jeu sait lire
      const vus = new Set(), fragiles = [];
      for (const { n } of noeuds.values()) for (const T of n.textes) { const k = T.f + ":" + T.a; if (vus.has(k)) continue; vus.add(k); const e = edition.controler(T); if (e) fragiles.push(k + " " + e); }
      // une modification : un seul fichier rendu, lisible, et rien d'autre n'y a bougé
      const x = noeuds.get("arene-2-dresseur-0").n, T = x.textes.find((t) => !t.calc && String(t.v).length > 30), avant = edition.nombre;
      const pose = edition.poser(T, String(T.v) + " (essai « d'apostrophe »)"), F = edition.fichiersModifies();
      const refus = edition.poser(x.textes.find((t) => t !== T && !t.calc), "   ");
      const calc = [...noeuds.values()].flatMap((y) => y.n.textes).find((t) => t.calc && t.exprs.length), refusCalc = calc ? edition.poser(calc, String(calc.v).replace("${" + calc.exprs[0] + "}", "${autreChose}")) : { erreur: "pas de texte calculé" };
      const rendu = F[0] || {}, source = P && F.length === 1 ? rendu.contenu : "";
      edition.retirer(T.f + ":" + T.a);
      ouvrir("donnees-BADGES", { defiler: false, adresse: false });
      const badges = { verrous: document.querySelectorAll(".detail .tx-verrou").length, libres: document.querySelectorAll(".detail .tx").length };
      const essais = [...new Set([...noeuds.values()].map((y) => y.n.essai).concat(P.sections.flatMap((s) => s.rangs.map((r) => r.essai))).filter(Boolean))];
      return { stats: P.stats, chapitres: chapitres.map((r) => r.noeuds.length), arenes: chapitres.map((r) => r.noeuds.filter((n) => n.genre === "dresseur").length + "/" + r.noeuds.filter((n) => n.genre === "champion").length).filter((t) => t !== "0/0"),
        sites: sites.map((r) => r.noeuds.filter((n) => n.genre === "fiche").length + "/" + r.noeuds.filter((n) => n.genre === "champion").length), fiches: chapitres.reduce((s, r) => s + r.noeuds.filter((n) => n.genre === "fiche").length, 0),
        muettes, fragiles, pose, nbFichiers: F.length, erreurFichier: rendu.erreur || null, chemin: rendu.chemin, ajout: source.includes("(essai « d\\'apostrophe »)") || source.includes('(essai « d\'apostrophe »)'), refus: !!refus.erreur, refusCalc: !!refusCalc.erreur, reste: edition.nombre - avant, essais, badges };
    });
    verif("pilotage : tous les fichiers du jeu sont lus", bilan.stats.fichiers >= 120 && bilan.stats.illisibles.length === 0, JSON.stringify(bilan.stats));
    verif("pilotage : 12 chapitres, chacun avec ses pastilles", bilan.chapitres.length === 12 && bilan.chapitres.every((n) => n >= 3), bilan.chapitres.join(","));
    verif("pilotage : 8 arènes, 3 dresseurs et 1 champion chacune", bilan.arenes.length === 8 && bilan.arenes.every((t) => t === "3/1"), bilan.arenes.join(" "));
    verif("pilotage : 5 sites, leurs informations et leur défi", bilan.sites.length === 5 && bilan.sites.every((t) => +t.split("/")[0] >= 10 && t.endsWith("/1")), bilan.sites.join(" "));
    verif("pilotage : les fiches savoir sont toutes là", bilan.fiches >= 40, String(bilan.fiches));
    // le temps de jeu estimé (pilotage/duree.js) : chaque chapitre et chaque site, et le total jusqu'à l'épilogue
    const temps = await page.evaluate(() => ({ total: document.querySelector(".intro .tuile")?.textContent || "", rangs: [...document.querySelectorAll('#s-histoire .rang, #s-voyages .rang')].filter((r) => r.querySelector(".rang-num").textContent !== "+").map((r) => r.querySelector(".rang-duree")?.textContent || ""), ailleurs: document.querySelectorAll('.section:not(#s-histoire):not(#s-voyages) .rang-duree').length }));
    verif("pilotage : un temps estimé pour chaque chapitre et chaque site, et le total jusqu'à l'épilogue", /^≈ \d+ h( \d\d)? à \d+ h.*jusqu'à l'épilogue/.test(temps.total) && temps.rangs.length >= 18 && temps.rangs.every((t) => /^≈ \d/.test(t)) && temps.ailleurs === 0, JSON.stringify(temps).slice(0, 300));
    verif("pilotage : chaque pastille s'ouvre et montre son contenu", bilan.muettes.length === 0, bilan.muettes.slice(0, 5).join(" | "));
    verif("pilotage : chaque texte se réécrit sans abîmer son fichier", bilan.fragiles.length === 0, bilan.fragiles.length + " : " + bilan.fragiles.slice(0, 3).join(" | "));
    verif("pilotage : une modification rend un seul fichier, lisible", bilan.pose.ok && bilan.nbFichiers === 1 && !bilan.erreurFichier && bilan.ajout, JSON.stringify({ pose: bilan.pose, n: bilan.nbFichiers, e: bilan.erreurFichier, ajout: bilan.ajout }));
    verif("pilotage : un texte vide, ou un morceau calculé changé, est refusé", bilan.refus && bilan.refusCalc && bilan.reste === 0, JSON.stringify({ vide: bilan.refus, calc: bilan.refusCalc, reste: bilan.reste }));
    verif("pilotage : les noms de badges, repères du jeu et des sauvegardes, ne sont pas modifiables", bilan.badges.verrous === 8 && bilan.badges.libres === 0, JSON.stringify(bilan.badges));
    // l'onglet « Les joueurs » avec les données d'exemple
    await page.click('.onglet[data-vue="joueurs"]');
    await page.click(".connexion-actions .bouton:not(.plein)");
    await page.waitForTimeout(400);
    const joueurs = await page.evaluate(() => ({ barres: document.querySelectorAll(".graphe button.barre-ligne").length, tuiles: document.querySelectorAll(".resultats .tuile").length, etiquettes: [...document.querySelectorAll("[data-suivi]")].filter((e) => e.textContent).length, mention: /inventées/.test(document.querySelector(".resultats").textContent) }));
    verif("pilotage : l'onglet des joueurs s'affiche avec des données d'exemple, signalées comme telles", joueurs.barres === 12 && joueurs.tuiles >= 4 && joueurs.etiquettes > 50 && joueurs.mention, JSON.stringify(joueurs));
    const profils = await page.evaluate(async () => {
      const tuiles = document.querySelector(".resultats > .tuiles").textContent, lignes = document.querySelectorAll(".profils tbody tr").length;
      document.querySelector(".profils tbody button.lien").click();
      await new Promise((r) => setTimeout(r, 200));
      const actions = document.querySelectorAll(".profil-detail .journal li").length, cours = document.querySelectorAll(".profil-detail .journal li.a-cours").length;
      const recherche = document.querySelector(".profils input[type=search]"); recherche.value = "zzz"; recherche.dispatchEvent(new Event("input"));
      return { profil: /avec un profil/.test(tuiles) && /sans profil/.test(tuiles), lignes, actions, cours, filtre: document.querySelectorAll(".profils tbody tr").length };
    });
    verif("pilotage : les joueurs comptés par profil, et le journal des actions d'un profil", profils.profil && profils.lignes > 10 && profils.actions > 5 && profils.cours > 0 && profils.filtre === 0, JSON.stringify(profils));
    verif("pilotage : aucune erreur", erreurs.length === 0, erreurs.slice(0, 3).join(" | "));

    // côté jeu : chaque bouton « Tester » mène quelque part, et le mode essai ne touche ni à la sauvegarde ni au suivi
    const jeu = await contexte.newPage();
    const erreursJeu = ecouterErreurs(jeu);
    await jeu.goto(adresse + "jeu/#chapitre-3");
    await jeu.waitForTimeout(1500);
    await validerAvatar(jeu);
    await jeu.waitForTimeout(800);
    const inconnus = await jeu.evaluate((essais) => essais.filter((e) => {
      const m = e.match(/^(chapitre|fiche|arene|dresseur|champion|epreuve|voyage|info|defi|sim)-([\w.]{1,40})$/); if (!m) return true;
      const [, g, a] = m, [x, y] = a.split(".");
      return !(g === "chapitre" ? +a >= 0 && +a <= 11 : g === "fiche" ? FICHES.some((f) => f.id === a) : g === "arene" || g === "champion" || g === "epreuve" ? !!ARENAS[+a - 1] : g === "dresseur" ? !!(ARENAS[+x - 1] && ARENAS[+x - 1].tr[+y])
        : g === "voyage" || g === "defi" ? !!VOY.sites[a] : g === "info" ? !!(VOY.sites[x] && VOY.sites[x].infos.some((f) => f.id === y)) : typeof window[a] === "function");
    }), bilan.essais);
    verif("pilotage : chaque bouton « Tester » désigne un endroit qui existe dans le jeu", bilan.essais.length > 150 && inconnus.length === 0, bilan.essais.length + " essais ; inconnus : " + inconnus.slice(0, 5).join(", "));
    // les sauvegardes sont relevées depuis la page de pilotage (même site), une fois la vraie partie quittée : elle s'enregistre en partant
    const sauvegardes = () => page.evaluate(() => JSON.stringify(Object.entries(localStorage).filter(([k]) => /^wattlings|^quete|^ems/.test(k) && !/^wattlings-compte/.test(k)).sort()));
    await jeu.goto("about:blank");
    const sauvegarde = await sauvegardes();
    for (const essai of ["dresseur-2.1", "fiche-s2r1", "champion-4", "info-solaire.module", "defi-barrage", "sim-datSimPue"]) {
      await jeu.goto("about:blank"); // comme un clic sur « Tester » : le jeu s'ouvre dans un onglet neuf
      await jeu.goto(adresse + "jeu/#essai-" + essai);
      await jeu.waitForTimeout(2600);
      const e = await jeu.evaluate(() => ({ essai: ESSAI, nom: S.name, quelqueChose: !!(panelEl || dlg.open || document.getElementById("qk-host").shadowRoot.querySelector("#layer > *")), tag: !!document.getElementById("qk-host").shadowRoot.querySelector(".essai-tag") }));
      verif(`pilotage · essai ${essai} : le jeu s'ouvre à cet endroit, en mode essai`, e.essai === true && e.nom === "Essai" && e.quelqueChose && e.tag, JSON.stringify(e));
    }
    await jeu.goto("about:blank");
    verif("pilotage : les essais n'ont pas touché aux sauvegardes", (await sauvegardes()) === sauvegarde);
    await jeu.goto(adresse + "jeu/#essai-chapitre-5");
    await jeu.waitForTimeout(1200);
    await jeu.reload();
    await jeu.waitForTimeout(1200);
    verif("pilotage : après un essai, recharger la page rend le jeu normal", (await jeu.evaluate(() => ESSAI)) === false);
    verif("pilotage · jeu : aucune erreur", erreursJeu.length === 0, erreursJeu.slice(0, 3).join(" | "));
  }
  await contexte.close();
}

await fermer();
console.log(`\n${reussis} vérifications réussies, ${echecs.length} échec(s).`);
if (echecs.length) { console.log(echecs.map((e) => " - " + e).join("\n")); process.exit(1); }
