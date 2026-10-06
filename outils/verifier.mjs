// Vérifie que le site fonctionne après une modification : à lancer avant de publier.
//
//   node outils/verifier.mjs            → tout (environ 3 minutes)
//   node outils/verifier.mjs cours      → seulement le cours   (ou : jeu, voyages, liens)
//
// Ce que fait la vérification :
//   cours : ouvre chaque page, manipule chaque démo, et relève toute erreur ;
//   jeu   : lance chaque chapitre, joue 20 secondes au hasard, ouvre le menu et la carte, et relève toute erreur ;
//   voyages : prend le train vers chaque destination ouverte, vérifie que tout ce qui s'examine est accessible à pied,
//             examine tout, manipule les simulations, fait tamponner le passeport et rentre ;
//   liens : fait l'aller-retour cours → jeu → cours et contrôle sauvegarde, reprise et anciennes adresses.
import {
  ROUTES_COURS, TOUCHES, agirCours, agirJeu, avancer, contenuCours, demarrer, ecouterErreurs, hasardEtHorlogeFixes, hasardFixe, nbCiblesCours, tirage, validerAvatar,
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
