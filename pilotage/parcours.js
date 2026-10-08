/**
 * Pilotage · parcours.js
 * Range ce que lecture.js a trouvé dans les fichiers du jeu en un parcours lisible :
 *   Histoire (un rang par chapitre) · Voyages (un rang par site) · La ville · Secrets · Mécanique et interface.
 * Un rang est une frise de nœuds ; un nœud contient des blocs (dialogue, fiche, question, choix, formulaire…).
 * Rien n'est exécuté : tout vient du texte des fichiers, tel qu'il est en ligne.
 *
 * Pour ranger une nouvelle scène dans un chapitre : l'ajouter à SCENES (le nom de la fonction du jeu, puis son titre).
 * Ce qui n'est rangé nulle part reste visible dans « Mécanique et interface » : rien ne disparaît.
 */
import { estProse, estTexte, lisible, textesDe } from "./lecture.js";

/* les scènes de chaque chapitre : [fonction du jeu, titre affiché] */
const SCENES = {
  0: [["introVideo", "La vidéo d'introduction"], ["boot", "Arrivée au bureau"], ["actJoule", "Mme Joule"], ["chooseSite", "Le choix du site"]],
  1: [["actMailbox", "La boîte aux lettres"], ["actPanel", "La fiche technique"], ["checkCh1", "Repérage terminé"]],
  2: [["actElec", "Le compteur électrique"], ["actGas", "Le compteur de gaz"], ["actSub", "Le sous-compteur"], ["checkCh2", "Compteurs trouvés"]],
  3: [["actPC", "L'ordinateur du bureau"], ["openEmsBureau", "La console de l'EMS du bureau"]],
  4: [["actTech", "Le technicien du parc"], ["battle", "Combat contre une anomalie"], ["afterCapture", "Après le combat"]],
  5: [["actArchives", "L'armoire à archives"]],
  7: [["actDerive", "La ronde de nuit"]],
  10: [["actMaire", "Le maire"], ["openDashboard", "Le tableau de bord du patrimoine"], ["missions", "Les missions du patrimoine"], ["finishPatrimoine", "Patrimoine terminé"]],
  11: [["gameFinale", "La finale"], ["evolve", "Les évolutions"], ["endScreen", "L'écran de fin"]],
};
/* les fonctions qui servent une épreuve sans être l'épreuve elle-même */
const AIDES = {
  gamePatrimoine: ["ficheEmsStep", "perimetreStep", "objectifStep"], gameCollecte: ["dataAnim", "raccordStep", "colReponse", "sourcesStep"],
  gameStructurer: ["arbreStep", "strPieces", "strPourquoi", "conversionStep"], gameAnalyse: ["talonStep", "signatureStep"], gameDetect: ["seuilStep"],
  gameAgir: ["enjeuStep", "enjEcole", "enjBureau", "enjBoulangerie", "planStep", "agirDerives"], gamePiloter: ["mvStep"],
};
/* les ateliers de l'EMS du bureau (jeu/epreuves/ems-*.js) : ce qu'on y fait, et les données qu'ils lisent */
const ATELIERS = {
  gamePatrimoine: ["Les ateliers de l'EMS du bureau : créer le site en recopiant le carnet (adresse, surface, activité), tracer le périmètre sur le plan, puis choisir l'objectif. L'objectif choisi décide de l'indicateur affiché à l'arène de la Preuve.", ["CAD_ZONES", "CAD_OBJ"]],
  gameCollecte: ["Les ateliers : raccorder les deux points en tapant le PDL et le PCE du carnet (l'API répond 400, 403 ou 404 comme en vrai), puis comparer la courbe, l'index et la facture d'une même semaine.", ["COL_Q"]],
  gameStructurer: ["Les ateliers : ranger les pièces dans l'arbre site → point → compteur → mesures (chaque erreur est expliquée), puis passer des puissances à l'énergie du jour et des m³ aux kWh.", []],
  gameAnalyse: ["L'atelier de la signature : régler à la main le talon gaz et la pente sur douze mois ; l'EMS montre ensuite la régression.", []],
  gameDetect: ["L'atelier des alertes : régler le seuil et la persistance sur quatre semaines ; il faut attraper la dérive sans fausse alerte.", ["SEU_EVT"]],
  gameAgir: ["D'abord l'enjeu propre au site, simulé dans l'EMS : les vacances d'hiver (école), la climatisation de l'été (bureaux), le four et le contrat (boulangerie). Le résultat revient à l'étape Mesurer. Puis le plan d'action, qui rappelle les dérives de l'étape Détecter ; les actions qui les traitent portent l'étiquette « ta dérive ».", ["ENJ_ECOLE", "AGIR_DER"]],
  gamePiloter: ["L'atelier de la mesure : le plan choisi à l'arène du Chantier est vérifié sur un hiver plus doux. Corriger la météo, conclure, puis lire le résultat dans l'indicateur choisi à l'arène du Cadastre.", ["MES_GRAIN"]],
};
const RANGEES_ATELIERS = ["SB_JOURS", "BILANS", "DONJONS", "DG_CHEMIN", "DG_CIBLE_OK", "RET_TITRES", "RET_IT", "RET_USAGE", "SIG_MOIS", "SIG_DJU", "STR_CASES", ...Object.values(ATELIERS).flatMap((a) => a[1])];
/* un nom lisible pour les fonctions du jeu les plus courantes (section « Mécanique et interface ») */
const NOMS = {
  enterArena: "Entrer dans une arène", duel: "Le duel contre un dresseur", arenaDefeat: "Défaite dans une arène", champTalk: "Parler au champion", arenaWin: "Victoire dans une arène",
  arenaMissing: "Ce qui manque pour entrer dans une arène", champAnomalies: "Le champion des anomalies", gateMsg: "Les barrières des quartiers", enterDoor: "Les portes des bâtiments",
  gainXP: "Gain d'expérience", badge: "Remise d'un badge", srcTry: "Recevoir une fiche", srcAct: "Parler à une source", missingLines: "Infos clés manquantes", showFiche: "Nouvelle fiche savoir",
  pendingCheck: "Infos clés réunies", openMenu: "Le menu", titleScreen: "L'écran titre", openAvatar: "L'avatar", jumpTo: "Reprendre à une étape", chapterList: "Choisir une étape",
  objectiveText: "L'objectif (infos clés)", objectiveText0: "L'objectif", windStep: "Le couloir du vent", actMachine: "La machine du couloir du vent", meteoLines: "Le bulletin météo",
  relaisLines: "Le relais", pvLines: "Les panneaux solaires de la ville", decorBuild: "Le décor de la ville", regDecorBuild: "Le décor des régions", objsFor: "Personnages et objets fixes",
  enBadge: "L'énergie après chaque badge", enTick: "La simulation d'énergie", enEvents: "Les événements d'énergie", enWhy: "Tableau de bord : les explications", enViewSite: "Tableau de bord : le site",
  enViewParc: "Tableau de bord : le parc", enViewPsite: "Tableau de bord : un site du parc", wmPlaceAt: "La carte : les lieux", gareGuichet: "Le guichet", gareDeparts: "Le tableau des départs",
  gareEntrer: "Entrer dans la gare", gareTableauDehors: "Le tableau des départs, dehors", voyTrajet: "Le trajet en train", voyRetour: "Le train du retour", voyDonnerInfo: "Carnet de voyage",
  voyTamponner: "Tampon obtenu", emsCarnet: "Le carnet, dans les ateliers", emsTransfert: "La ligne « Dans un EMS »", emsChoix: "Les choix des ateliers", revoirFiche: "Revoir la fiche", EMS_MODULES: "La console de l'EMS du bureau : les modules", IV_JOULE: "La vidéo d'introduction : les répliques de Mme Joule", CREA_DONNEES: "L'Anomalidex : les anomalies de données (créatures)", CREA_CONSO: "L'Anomalidex : les dérives de consommation (créatures)", DERIVE_CREA: "La ronde de nuit : quelle créature selon le site", MC_ETATS: "Ma courbe : le trophée, état par état", DG_TXT: "Les donjons : ce qu'on lit en examinant le décor",
  dgChoix: "Les donjons : explorer ou aller au champion", dgRaccourci: "Les donjons : le raccourci", dgObjs: "Les donjons : portes, coffre, panneaux, énigmes", dgPas: "Les donjons : les dalles et la courbe du sol",
  dgVerifCibles: "Les donjons : les blocs sur leurs marques", dgPousser: "Les donjons : pousser un bloc", dgResoudre: "Les donjons : l'énigme résolue", dgDalle: "Les donjons : les dalles du laboratoire", voyDefi: "Le défi d'un site (commun)", passeportHTML: "Le passeport", atlasRegion: "Carte du pays : les régions", ATLAS_PAYS: "Carte du pays", atlasPlan: "Carte : le plan d'un site",
  atlasGare: "Carte : la gare", secretObjs: "Objets à secrets", eggObjs: "Objets à clins d'œil", nameEgg: "Les prénoms prédestinés", jouleExtra: "Harceler Mme Joule", actMobilier: "Le mobilier bavard",
};
const NOMS_DONNEES = (N) => Object.assign(N, { QUARTERS: "Les quartiers", WALKERS: "Les passants", LIFE_WX: "Les habitants, selon la météo", REG_WX: "Les régions, selon la météo", LOCALS: "Les bâtiments", MAPS: "Les lieux", SKY_IDLE: "L'horloge du jardin",
  SKY: "Le ciel", WM_BLD: "Carte : les bâtiments", WM_SPOTS: "Carte : les lieux-dits", WM_SHORT: "Carte : les noms courts", WM_VILLE: "Carte : la légende", RANKS: "Les grades", BADGES: "Les badges", STYLES: "Avatar : les coiffures", WEAR_NAMES: "L'usure des bâtiments",
  HATS: "Avatar : les chapeaux", PROPS: "Avatar : les accessoires", REG_MODELS: "Avatar : les tenues régionales", RANK_FIT: "Avatar : les tenues de grade", EN_WD: "Les jours de la semaine", EN_ACT: "Les actions d'économie", EN_PSH: "Les sites du parc",
  EN_EV: "Les événements d'énergie", ATLAS_PAYS: "Carte du pays", POOL_LINE: "La piscine",
  arenaObjs: "Dans l'arène : le décor", arenaUpdate: "Dans l'arène : repéré par un dresseur", metNpc: "Tenue débloquée", openMap: "La carte : ouverture", wmEntrer: "La carte : aide", wmNextMark: "La carte : repère suivant", wmInfo: "La carte : bulle d'un lieu",
  openChapterSelect: "Choisir une étape : l'écran", courseLabel: "Le lien vers le cours", openGame: "Ouverture du jeu", setFsUI: "Plein écran", sourcesHTML: "Le menu Sources", enChart: "Tableau de bord : le graphique", enWhyPk: "Tableau de bord : pourquoi (parc)",
  enEvHtml: "Tableau de bord : l'alerte", enActsHtml: "Tableau de bord : les actions", enTab: "Tableau de bord : l'onglet Énergie", enBind: "Tableau de bord : survol du graphique", renderDash: "Le tableau du patrimoine", setPipUI: "La vignette", pipToggle: "La vignette : indisponible",
  tryMove: "Déplacements", pressA: "Le bouton A", setRun: "La course", essaiLancer: "Le mode essai (pilotage)", savedFlash: "Sauvegarde", openPanel: "Les panneaux : l'en-tête", choice: "Question à choix : messages communs", form: "Formulaire : messages communs",
  order: "Remise en ordre : messages communs", signature: "La signature du mandat", gate: "Les barrières", enTier: "Les paliers d'économie", enHud: "Le compteur d'économies", voyAtelierEtapes: "Les manipulations : textes communs", voyAtelier: "Les manipulations",
  voyAnnonce: "L'annonce de la gare", voyObjectifVille: "L'objectif : la gare", voyCarte: "Le plan d'un site : contrôle", voyEtapes: "Les étapes d'une manipulation" });
const DOSSIERS = { moteur: "Le moteur du jeu", interface: "Menus et écrans", simulation: "La simulation d'énergie", epreuves: "Épreuves : le reste", monde: "La ville : le reste", recit: "Récit : le reste", voyages: "Voyages : ce qui est commun", rendu: "Dessins", audio: "Sons" };

const SCENES_NOMS = Object.fromEntries(Object.values(SCENES).flat());
const v = (T) => (estTexte(T) ? T.v : T);
const note = (t) => ({ genre: "note", t });

export function construire(FF, { chapitres }) {
  NOMS_DONNEES(NOMS);
  const fichiers = FF.filter((F) => !F.erreur);
  // ---------------------------------------------------------------- accès
  const don = (nom) => { for (const F of fichiers) if (nom in F.donnees) return F.donnees[nom]; return undefined; };
  const tout = fichiers.flatMap((F) => F.items.concat(F.libres)).sort((a, b) => (a.f === b.f ? a.pos - b.pos : a.f < b.f ? -1 : 1));
  const parPortee = new Map();
  // la portée d'un élément : le nom de sa fonction ; pour ce qui est écrit hors de toute fonction, son fichier
  const porteeDe = (it) => (it.dans === "(fichier)" ? "(fichier)|" + it.f : it.dans);
  const porteesDe = (F) => [...new Set(F.items.concat(F.libres).map(porteeDe))];
  tout.forEach((it) => { const k = porteeDe(it); if (!parPortee.has(k)) parPortee.set(k, []); parPortee.get(k).push(it); });
  const prendre = (dans, filtre) => (parPortee.get(dans) || []).filter((it) => !it._place && (!filtre || filtre(it))).map((it) => ((it._place = true), it));
  const chDe = (it) => { const m = (it.si || "").match(/S\.ch===(\d+)/g); return m && m.length === 1 ? +m[0].slice(7) : null; };

  const FICHES = don("FICHES") || [], SRC = don("SRC") || {}, ARENA_CH = don("ARENA_CH") || {}, ARENA_OPEN = don("ARENA_OPEN") || {}, JOULE = don("JOULE_HINTS") || {}, ANOM = don("ANOM") || [], BOCAUX = don("BOCAUX") || [], SB_ANOM = don("SB_ANOM") || [];
  const ARENES = [1, 2, 3, 4, 5, 6, 7, 8].map((n) => don("ARENE_" + n)).filter(Boolean);
  const chapitresDeLEtape = (st) => chapitres.map((c, i) => (c.etape === st ? i : -1)).filter((i) => i >= 0);
  const chDeLaFiche = (f) => (typeof f.req === "number" ? f.req : f.st === 0 ? 0 : v(f.st) === "P" ? chapitres.findIndex((c) => c.page === "patrimoine") : chapitresDeLEtape(f.st)[0] ?? 0);
  // l'épreuve de chaque champion : lue dans champTrial ({1:()=>gamePatrimoine(()=>gamePlan(win)),…})
  const EPREUVES = {};
  { const F = fichiers.find((F) => /function champTrial/.test(F.source));
    const corps = F ? F.source.slice(F.source.indexOf("function champTrial")).split("\n").slice(0, 4).join("\n") : "";
    for (const m of corps.matchAll(/(\d):\(\)=>([^,}]+)/g)) EPREUVES[m[1]] = [...m[2].matchAll(/\b(game\w+|champAnomalies)\b/g)].map((x) => x[1]); }

  // ---------------------------------------------------------------- briques de nœuds
  const quiDit = (cle) => { const s = SRC[cle]; return s ? { qui: s.who, ou: s.where, idle: s.idle, pal: s.pal } : {}; };
  function noeudFiche(f) {
    const s = quiDit(v(f.src)), blocs = [];
    blocs.push(note(`${s.qui ? "Donnée par " + lisible(s.qui) : "À examiner"}${s.ou ? " : " + lisible(s.ou) : ""}. ${f.req ? "Info clé : exigée pour entrer dans l'arène. +15 XP." : "+10 XP."}`));
    if (s.ou) blocs.push({ genre: "texte", titre: "L'indice du menu, tant que la fiche manque", t: s.ou });
    if (Array.isArray(f.say) && f.say.length) blocs.push({ genre: "dialogue", titre: "Ce qui est dit avant la fiche", lignes: f.say.map((t) => ({ qui: s.qui, t })) });
    if (f.quiz) blocs.push({ genre: "choix", titre: "La question posée avant de donner la fiche", q: f.quiz.q, rep: (f.quiz.opts || []).map((o) => ({ t: o[0], ok: !!o[1], fb: o[2] })) });
    blocs.push({ genre: "fiche", titre: f.t, texte: f.x, cle: !!f.req, sorte: { phrase: "L'essentiel", analogie: "Analogie", retenir: "À retenir" }[v(f.k)] || "", refs: (f.refs || []).map(v) });
    if (Array.isArray(s.idle) && s.idle.length) blocs.push({ genre: "dialogue", titre: "Quand il n'a pas (ou plus) de fiche à donner", lignes: s.idle.map((t) => ({ qui: s.qui, t })) });
    return { id: "fiche-" + v(f.id), genre: "fiche", titre: lisible(f.t), sous: s.qui ? lisible(s.qui) : "objet", cle: !!f.req, pal: s.pal, blocs, essai: "fiche-" + v(f.id), suivi: { fiche: v(f.id) } };
  }
  function noeudsArene(A) {
    const n = A.id, ch = ARENA_CH[n], nom = lisible(A.name), N = [];
    const cles = FICHES.filter((f) => f.req === ch);
    const manque = prendre("arenaMissing", (it) => new RegExp("A\\.id===" + n + "\\b").test(it.si || ""));
    N.push({ id: `arene-${n}-porte`, genre: "porte", titre: "La porte", sous: nom, blocs: [
      { genre: "texte", titre: "Le nom de l'arène", t: A.name }, ...(estTexte(A.step) ? [{ genre: "texte", titre: "L'étape du cycle", t: A.step }] : []),
      note(`Pour entrer dans l'${nom} : le badge précédent${cles.length ? `, et ${cles.length} info${cles.length > 1 ? "s" : ""} clé${cles.length > 1 ? "s" : ""} : ${cles.map((f) => "« " + lisible(f.t) + " »").join(", ")}` : ""}.`), ...manque], essai: "arene-" + n });
    // le donjon (recit/arenes/donjons.js) : les salles, l'énigme de l'étape, les panneaux
    const D = (don("DONJONS") || {})[n];
    if (D) N.push({ id: `arene-${n}-donjon`, genre: "scene", titre: "Le donjon", sous: lisible(D.titre), essai: "arene-" + n, suivi: { arene: nom }, blocs: [
      note(`Un mini-donjon de ${(D.salles || []).length} salles : ${(D.salles || []).map((s) => lisible(s[4])).join(", ")}. Une énigme ouvre une porte, une petite clé dans un coffre en ouvre une autre, les trois dresseurs ouvrent celle du champion. À la première visite, le joueur choisit : explorer, ou aller directement au champion (les dresseurs l'attendent devant l'estrade).`),
      { genre: "texte", titre: "Le nom du donjon", t: D.titre },
      ...(D.enigme ? [{ genre: "texte", titre: "L'énigme", t: D.enigme.texte }, { genre: "texte", titre: "L'indice (porte scellée)", t: D.enigme.indice }, { genre: "texte", titre: "Énigme résolue", t: D.enigme.bravo }] : []),
      ...(D.contenu || []).flatMap((L, si) => (L || []).filter((it) => v(it[0]) === "t").map((it) => ({ genre: "texte", titre: "Panneau · " + lisible(D.salles[si][4]), t: it[3] })))] });
    (A.tr || []).forEach((T, k) => N.push({ id: `arene-${n}-dresseur-${k}`, genre: "dresseur", titre: lisible(T.n), sous: `dresseur ${k + 1}/${A.tr.length}`, pal: T.pal, essai: `dresseur-${n}.${k}`,
      suivi: { duel: nom + " · " + lisible(T.n), arene: nom }, blocs: [
        { genre: "dialogue", titre: "Quand il repère le joueur", lignes: [{ qui: T.n, t: T.intro }] },
        note("Une question tirée au hasard. Bonne réponse : dresseur battu, +15 XP. Mauvaise réponse : un tiers de crédibilité en moins et une autre question ; à zéro, retour à l'entrée."),
        ...T.qs.map((q) => ({ genre: "question", q: q.q, rep: q.rep, suivi: { t: nom } })),
        { genre: "dialogue", titre: "Une fois battu", lignes: [{ qui: T.n, t: T.lose }] }] }));
    const fns = EPREUVES[n] || [], epreuve = [];
    fns.forEach((fn) => {
      if (fn === "champAnomalies") epreuve.push(note("D'abord les bocaux : les anomalies qu'on ne voit pas sur une courbe, l'une après l'autre. Une erreur coûte de la crédibilité."),
        ...ANOM.filter((a) => !BOCAUX.length || BOCAUX.includes(a.id)).map((a) => ({ genre: "choix", titre: a.name, q: a.data, rep: (a.moves || []).map((o) => ({ t: o[0], ok: !!o[1], fb: o[2] })) })), ...prendre("champAnomalies"),
        note("Puis l'atelier, dans l'EMS du labo : une semaine de données brutes du site. Le joueur repère lui-même chaque anomalie sur la courbe (un clic ailleurs explique pourquoi ce n'en est pas une), puis choisit son traitement ; à la fin, l'écart entre la semaine brute et la semaine fiabilisée."),
        ...prendre("champSerie"), ...SB_ANOM.map((a) => ({ genre: "choix", titre: a.forme, q: a.quoi, rep: (a.opts || []).map((o) => ({ t: o[0], ok: !!o[1], fb: o[2] })) })), ...prendre("sbLeurre"), ...prendre("serieBruteStep"));
      else epreuve.push(...prendre(fn), ...(ATELIERS[fn] ? [note(ATELIERS[fn][0])] : []), ...(AIDES[fn] || []).flatMap((a) => prendre(a)),
        ...(ATELIERS[fn] ? ATELIERS[fn][1] : []).map((nom) => ({ genre: "donnees", nom, valeur: (fichiers.find((F) => F.donnees[nom]) || { donnees: {} }).donnees[nom], filet: true })).filter((b) => b.valeur));
    });
    N.push({ id: `arene-${n}-champion`, genre: "champion", titre: lisible(A.champ), sous: "champion", pal: A.cpal, essai: "champion-" + n, suivi: { arene: nom, badge: lisible(A.badge), epreuve: true },
      blocs: [{ genre: "dialogue", titre: "Avant l'épreuve", lignes: (A.cIntro || []).map((t) => ({ qui: A.champ, t })) }, ...epreuve,
        { genre: "dialogue", titre: "Après la victoire", lignes: (A.cWin || []).map((t) => ({ qui: A.champ, t })).concat(ARENA_OPEN[n] ? [{ t: ARENA_OPEN[n] }] : [], A.next ? [{ t: A.next }] : []) },
        ...(A.refs ? [{ genre: "refs", refs: A.refs.map(v) }] : [])] });
    // après le badge : la carte « Dans un EMS » et l'auto-bilan (recit/bilans.js)
    const B = (don("BILANS") || {})[n];
    if (B) N.push({ id: `arene-${n}-bilan`, genre: "scene", titre: "Bilan de l'étape", sous: "carte et 3 questions", essai: "bilan-" + n, suivi: { arene: nom }, blocs: [
      note("Après le badge : la carte « Dans un EMS », rangée dans le Classeur, puis trois questions de rappel sans pénalité (on peut passer), et « Ce que je retiens », une phrase parmi trois qui va sur la carte et le diplôme."),
      { genre: "texte", titre: "Ce que tu viens de faire", t: B.fait }, { genre: "texte", titre: "Ce que fait un EMS à cette étape", t: B.ems },
      { genre: "texte", titre: "Pourquoi c'est important", t: B.pourquoi }, { genre: "texte", titre: "L'erreur à éviter", t: B.erreur },
      ...(B.q || []).map((q) => ({ genre: "choix", q: q[0], rep: (q[1] || []).map((o) => ({ t: o[0], ok: !!v(o[1]), fb: o[2] })) })),
      { genre: "choix", titre: "Ce que je retiens", q: "Une phrase à garder.", rep: (B.retiens || []).map((r, i) => ({ t: r, ok: i === 0 })) }] });
    return N;
  }
  const scene = (id, titre, blocs, extra) => (blocs.length ? [Object.assign({ id, genre: "scene", titre, sous: resume(blocs), blocs }, extra)] : []);
  const resume = (blocs) => {
    const c = {}; blocs.forEach(function compter(b) { c[b.genre] = (c[b.genre] || 0) + 1; if (b.genre === "suite") b.etapes.forEach(compter); (b.suite || []).forEach(compter); });
    const q = (c.question || 0) + (c.choix || 0) + (c.cases || 0) + (c.formulaire || 0) + (c.ordre || 0), d = (c.dialogue || 0) + (c.secret || 0) + (c.source || 0);
    return [q && `${q} question${q > 1 ? "s" : ""}`, d && `${d} dialogue${d > 1 ? "s" : ""}`, !q && !d && c.texte && `${c.texte} texte${c.texte > 1 ? "s" : ""}`].filter(Boolean).join(" · ") || "";
  };

  // ---------------------------------------------------------------- 1. l'histoire
  const objectifs = (parPortee.get("objectiveText0") || []).concat(parPortee.get("objectiveText") || []);
  const histoire = chapitres.map((c, ch) => {
    const N = [];
    const depart = [note(c.resume)];
    if (JOULE[ch]) depart.push({ genre: "dialogue", titre: "Le conseil de Mme Joule (à la reprise du chapitre)", lignes: JOULE[ch].map((t) => ({ qui: "Mme Joule", t })) });
    const obj = objectifs.filter((o) => !o._place && chDe(o) === ch).map((o) => ((o._place = true), o));
    if (obj.length) depart.push({ genre: "groupe", titre: "L'objectif affiché sous l'écran", blocs: obj });
    N.push({ id: `ch-${ch}-depart`, genre: "depart", titre: "Départ", sous: "objectif", blocs: depart, essai: "chapitre-" + ch });
    (SCENES[ch] || []).forEach(([fn, titre]) => N.push(...scene(`ch-${ch}-${fn}`, titre, prendre(fn, (it) => { const k = chDe(it); return k === null || k === ch; }))));
    // Mme Joule parle à chaque chapitre : ses répliques propres à celui-ci
    if (ch > 0) N.push(...scene(`ch-${ch}-joule`, "Mme Joule", prendre("actJoule", (it) => chDe(it) === ch)));
    FICHES.filter((f) => chDeLaFiche(f) === ch).forEach((f) => N.push(noeudFiche(f)));
    const A = ARENES.find((A) => ARENA_CH[A.id] === ch);
    if (A) N.push(...noeudsArene(A));
    return { id: "ch-" + ch, num: String(ch).padStart(2, "0"), titre: c.titre, resume: c.resume, essai: "chapitre-" + ch, suivi: { ch }, noeuds: N };
  });
  // ce que les scènes de l'histoire n'ont pas rangé dans un chapitre précis (répliques « dans tous les autres cas »)
  const resteHistoire = Object.values(SCENES).flat().concat([["actJoule", "Mme Joule"]]).flatMap(([fn, titre]) => scene("reste-" + fn, titre + " : les autres cas", prendre(fn)));
  if (resteHistoire.length) histoire.push({ id: "ch-reste", num: "+", titre: "À tout moment", resume: "Ce que ces scènes disent en dehors de leur chapitre.", noeuds: resteHistoire });

  // ---------------------------------------------------------------- 2. les voyages
  const declares = fichiers.flatMap((F) => F.appels.filter((a) => a._appel === "voyDeclarer").map((a) => ({ id: a.args[0].v, d: a.args[1], F })));
  const rangees = new Set(RANGEES_ATELIERS); // les constantes de données déjà rangées quelque part (dans l'épreuve de leur atelier, ou de simples libellés)
  const voyages = declares.map(({ id, d }) => {
    const dossier = `jeu/voyages/${id}/`, FS = fichiers.filter((F) => F.chemin.startsWith(dossier));
    const prefixe = Object.keys(Object.assign({}, ...FS.map((F) => F.donnees))).find((k) => /^[A-Z]{3}\.dit$/.test(k))?.slice(0, 3);
    const dit = Object.assign({}, don(prefixe + ".dit")), questions = don(prefixe + ".questions") || [];
    const servi = new Set();
    // qui donne quelle information : une table (SOL_SOURCES), ou les appels source('info','réplique','Qui') du plan
    const lien = {};
    const table = FS.map((F) => Object.entries(F.donnees).find(([k]) => /_SOURCES$/.test(k))).find(Boolean);
    if (table) Object.entries(table[1]).forEach(([info, cle]) => (lien[info] = { cle: v(cle) }));
    FS.forEach((F) => {
      // source('info','réplique','Qui') ; ou, quand une table dit déjà la réplique, source('info','Qui')
      for (const m of F.source.matchAll(/\bsource\('(\w+)'(?:,'([^']*)')?(?:,'([^']*)')?\)/g)) {
        const [, info, b, c] = m;
        if (table) { if (lien[info] && b && !lien[info].qui) lien[info].qui = b; }
        else if (b && (dit[b] || !lien[info])) lien[info] = { cle: b, qui: c || lien[info]?.qui };
      }
      for (const m of F.source.matchAll(/voyAnimateur\(sid,'(\w+)','([^']+)',D\.(\w+)\[0\]/g)) lien[m[1]] = { cle: m[3], qui: m[2], atelier: true };
      // une information donnée après une réplique écrite sur la même ligne du plan : …D.azimut[0]…voyDonnerInfo(sid,'tracker')
      for (const ligne of F.source.split("\n")) {
        const info = ligne.match(/voyDonnerInfo\(sid,'(\w+)'\)/)?.[1] || ligne.match(/\binfo:'(\w+)'/)?.[1], cle = ligne.match(/\bD\.(\w+)\[0\]/)?.[1];
        if (!info || !cle || !dit[cle]) continue;
        const qui = ligne.match(/gens\(\d+,\d+,'([^']+)'/)?.[1] || ligne.match(/\bw:'([^']+)'/)?.[1];
        if (!lien[info] || !dit[lien[info].cle]) lien[info] = { cle, qui, atelier: /Sim[A-Z]/.test(ligne) };
        else if (!lien[info].qui && qui) lien[info].qui = qui;
      }
    });
    // les sources dont les répliques sont écrites directement dans le plan (voyAnimateur(sid,'pilotage','M. Bore',[…],[…],…))
    const directes = {};
    FS.forEach((F) => F.items.filter((it) => it.genre === "source").forEach((it) => { it._place = true; if (typeof it.info === "string" && it.lignes.some((l) => l.t)) directes[it.info] = it; }));
    const repliques = (cle, qui) => {
      const x = dit[cle]; if (!x) return [];
      servi.add(cle);
      const deux = Array.isArray(x) && x.length && Array.isArray(x[0]);
      return deux ? [{ genre: "dialogue", titre: "La première fois", lignes: x[0].map((t) => ({ qui, t })) }, ...(x[1] ? [{ genre: "dialogue", titre: "Les fois suivantes", lignes: x[1].map((t) => ({ qui, t })) }] : [])]
        : [{ genre: "dialogue", lignes: (Array.isArray(x) ? x : [x]).map((t) => (t && !estTexte(t) && t.t ? { qui: t.w ?? qui, t: t.t } : { qui, t })) }];
    };
    const N = [];
    N.push({ id: `voy-${id}-train`, genre: "depart", titre: "Le train", sous: lisible(d.gare), essai: "voyage-" + id, suivi: { train: id }, blocs: [
      note(`${lisible(d.nom)} · ${lisible(d.region)} · ${lisible(d.theme)}`), { genre: "texte", titre: "L'accroche (affiche de la gare, carte du pays)", t: d.accroche },
      { genre: "dialogue", titre: "Annonces à l'aller", lignes: (d.annonces || []).map((t) => ({ t })) }, { genre: "dialogue", titre: "Annonces au retour", lignes: (d.annoncesRetour || []).map((t) => ({ t })) },
      ...repliques("arrivee").map((b) => Object.assign(b, { titre: "À l'arrivée" })), ...repliques("chefHalte", "Chef de halte").map((b) => Object.assign(b, { titre: "Le chef de halte" }))] });
    (d.infos || []).forEach((f) => {
      const L = lien[v(f.id)] || { cle: v(f.id) }, X = directes[v(f.id)];
      if (X && !dit[L.cle]) { L.qui = lisible(X.lignes[0].qui) || L.qui; L.atelier = !!X.atelier; }
      const paroles = dit[L.cle] ? repliques(L.cle, L.qui) : X ? [{ genre: "dialogue", titre: "La première fois", lignes: X.lignes }, ...(X.ensuite.length ? [{ genre: "dialogue", titre: "Les fois suivantes", lignes: X.ensuite }] : [])] : [];
      N.push({ id: `voy-${id}-info-${v(f.id)}`, genre: "fiche", titre: lisible(f.t), sous: L.qui || (f.cle ? "info clé" : "information"), cle: !!f.cle, essai: `info-${id}.${v(f.id)}`, suivi: { info: id + "." + v(f.id) }, blocs: [
        note(`Où la trouver : ${lisible(f.ou)}. ${f.cle ? "Info clé : exigée avant le défi. +15 XP." : "+10 XP."}${L.atelier ? " Donnée après une manipulation." : ""}`),
        ...paroles, { genre: "fiche", titre: f.t, texte: f.x, retiens: f.retiens, cle: !!f.cle, refs: (f.refs || []).map(v) }] });
    });
    // les manipulations : une par fonction de simulations.js
    const sims = FS.find((F) => /simulations\.js$/.test(F.chemin));
    if (sims) {
      const portees = porteesDe(sims);
      const estSim = (p) => /^[a-z]{3}Sim[A-Z]/.test(p), estDefi = (p) => /Defi$/.test(p);
      // un morceau annexe (SOL_MIDI_ATELIER, eolCroquis…) est rangé avec la manipulation qui s'en sert
      const corps = {};
      sims.ast.body.forEach((x) => { const nom = x.type === "FunctionDeclaration" ? x.id.name : x.type === "VariableDeclaration" ? x.declarations[0].id.name : null; if (nom) corps[nom] = sims.source.slice(x.start, x.end); });
      const chez = {};
      const sert = (hote, nom) => hote !== nom && new RegExp("\\b" + nom + "\\b").test(corps[hote] || "");
      for (let tour = 0; tour < 3; tour++) portees.filter((p) => !estSim(p) && !estDefi(p) && !chez[p]).forEach((p) => {
        const hote = portees.find((h) => (estSim(h) || estDefi(h)) && sert(h, p)) || Object.keys(chez).find((h) => sert(h, p));
        if (hote) chez[p] = chez[hote] || hote;
      });
      const constantes = Object.keys(sims.donnees).filter((nom) => !/_ATELIER$|\.(dit|questions|defi)$/.test(nom));
      const avecAnnexes = (p) => [p, ...portees.filter((h) => chez[h] === p)].flatMap((h) => prendre(h))
        .concat(constantes.filter((nom) => !rangees.has(nom) && (sert(p, nom) || portees.some((h) => chez[h] === p && sert(h, nom)))).map((nom) => (rangees.add(nom), { genre: "donnees", nom, valeur: sims.donnees[nom], filet: true })));
      const atelier = (b) => (b.genre === "atelier" && b.reglages && b.reglages._x ? Object.assign(b, { reglages: don(b.reglages._x) || b.reglages }) : b);
      portees.filter(estSim).forEach((p) => {
        const blocs = avecAnnexes(p).map(atelier);
        const titreAtelier = blocs.find((b) => b.genre === "atelier" && b.titre) || blocs.find((b) => b.genre === "suite" && b.titre);
        N.push(...scene(`voy-${id}-sim-${p}`, titreAtelier ? lisible(titreAtelier.titre) : p, blocs, { genre: "epreuve", essai: "sim-" + p, suivi: { sim: id } }));
      });
      const pd = portees.find(estDefi);
      const defi = pd ? avecAnnexes(pd).map(atelier) : [], bd = defi.find((b) => b.genre === "defi") || {}, D = bd.d || {};
      const cleDit = (x) => (x && typeof x._x === "string" && x._x.match(/\.dit\.(\w+)/)?.[1]) || null;
      const epreuves = (bd.epreuves || []).map(atelier);
      N.push({ id: `voy-${id}-defi`, genre: "champion", titre: lisible(D.qui) || "Le défi", sous: "défi final", essai: "defi-" + id, suivi: { defi: id, t: "Le défi de " + (lisible(D.qui) || "") }, blocs: [
        note("Accessible une fois les informations clés réunies. Les questions d'abord, puis l'épreuve pratique ; le tampon du passeport à la fin."),
        ...(cleDit(D.attente) ? repliques(cleDit(D.attente), D.qui).map((b) => Object.assign(b, { titre: "Tant qu'il manque des informations clés" + (b.titre ? " · " + b.titre.toLowerCase() : "") })) : D.attente ? [{ genre: "texte", titre: "Tant qu'il manque des informations clés", t: D.attente }] : []),
        ...(D.entree ? [{ genre: "dialogue", titre: "Pour commencer", lignes: [{ qui: D.qui, t: D.entree }] }] : []),
        ...questions.map((q) => ({ genre: "question", q: q.q, rep: q.rep, suivi: { t: "Le défi de " + (lisible(D.qui) || "") } })),
        ...(epreuves.length ? [{ genre: "groupe", titre: "L'épreuve pratique", blocs: epreuves }] : []), ...defi.filter((b) => b.genre !== "defi"),
        { genre: "groupe", titre: "Verdict et tampon", blocs: [D.verdict, D.merci, d.pret, d.bravo].filter(Boolean).map((t) => ({ genre: "texte", t })) },
        ...(cleDit(D.apres) ? repliques(cleDit(D.apres), D.qui).map((b) => Object.assign(b, { titre: "Ensuite, à chaque visite" })) : Array.isArray(D.apres) ? [{ genre: "dialogue", titre: "Ensuite, à chaque visite", lignes: D.apres.map((t) => ({ qui: D.qui, t })) }] : [])] });
    }
    // de retour au bureau : l'atelier « Culture énergie » que débloque le tampon (voyages/retours.js)
    { const fn = { solaire: "retourSolaire", datacenter: "retourDatacenter", barrage: "retourBarrage", eolien: "retourCarbone", nucleaire: "retourCarbone" }[id], B = fn ? prendre(fn) : [];
      const donnees = ({ datacenter: ["RET_IT"], barrage: ["RET_USAGE"] }[id] || []).map((nom) => ({ genre: "donnees", nom, valeur: (fichiers.find((F) => F.donnees[nom]) || { donnees: {} }).donnees[nom], filet: true })).filter((b) => b.valeur);
      if (fn) N.push(...scene(`voy-${id}-retour`, "De retour au bureau", [note("Débloqué par le tampon, dans la console de l'EMS du bureau (module « Culture énergie ») : la leçon du site, appliquée au site du joueur." + (B.length ? "" : " C'est le même atelier que pour l'éolien : le carbone du contrat.")), ...B, ...donnees], { genre: "epreuve" })); }
    // tout le reste du site : répliques sans information, objets, zones du plan
    const autres = Object.keys(dit).filter((k) => !servi.has(k) && textesDe(dit[k]).length).flatMap((k) => repliques(k).map((b) => Object.assign(b, { titre: (b.titre ? b.titre + " · " : "") + k })));
    FS.forEach((F) => porteesDe(F).forEach((p) => autres.push(...prendre(p))));
    N.push(...scene(`voy-${id}-autres`, "Autour", autres, { sous: "habitants, objets, plan" }));
    return { id: "voy-" + id, num: lisible(d.theme).slice(0, 3).toUpperCase(), titre: lisible(d.nom), resume: lisible(d.accroche), essai: "voyage-" + id, suivi: { site: id }, noeuds: N };
  });
  { const G = fichiers.find((F) => /voyages\/gare\.js$/.test(F.chemin));
    if (G) { const N = porteesDe(G).flatMap((p) => scene("gare-" + p, NOMS[p] || (p === "voyCarte(gare)" ? "Le hall" : p.startsWith("(fichier)") ? "Divers" : p), prendre(p)));
      voyages.unshift({ id: "voy-gare", num: "GARE", titre: "La gare d'Ampère-sur-Loire", resume: "Le hall, le guichet, le passeport, le tableau des départs, le trajet.", essai: "chapitre-11", noeuds: N }); } }

  // ---------------------------------------------------------------- 3. la ville
  const Q = don("QUARTERS") || [], gens = (don("TOWNSFOLK") || []).concat(don("REG_FOLK") || []);
  const quartierDe = (at) => Q.find((q) => Array.isArray(at) && at[0] >= q.r[0] && at[0] <= q.r[2] && at[1] >= q.r[1] && at[1] <= q.r[3]);
  const ville = Q.map((q) => ({ id: "quartier-" + q.n, num: q.step ? String(q.n) : "·", titre: lisible(q.name), resume: [q.step && "Étape " + lisible(q.step), lisible(q.reg), q.sub && lisible(q.sub)].filter(Boolean).join(" · "),
    noeuds: gens.filter((g) => quartierDe(g.at) === q).map((g, i) => ({ id: `hab-${q.n}-${i}`, genre: "habitant", titre: lisible(g.who), sous: `${(g.lines || []).length} répliques`, pal: g.pal, blocs: [{ genre: "dialogue", lignes: (g.lines || []).map((t) => ({ qui: g.who, t })) }] })) })).filter((r) => r.noeuds.length);
  const sansQuartier = gens.filter((g) => !quartierDe(g.at));
  if (sansQuartier.length) ville.push({ id: "quartier-x", num: "·", titre: "Ailleurs en ville", resume: "", noeuds: sansQuartier.map((g, i) => ({ id: `hab-x-${i}`, genre: "habitant", titre: lisible(g.who), sous: `${(g.lines || []).length} répliques`, pal: g.pal, blocs: [{ genre: "dialogue", lignes: (g.lines || []).map((t) => ({ qui: g.who, t })) }] })) });
  const ambiance = [["objsFor", null], ["decorBuild", null], ["regDecorBuild", null], ["lifeObjs", "Les passants"], ["LIFE_WHEN", "Selon l'heure"], ["LIFE_WX", "Selon la météo"], ["REG_WHEN", "Régions : selon l'heure"], ["REG_WX", "Régions : selon la météo"],
    ["meteoLines", null], ["djuPhrase", "Les degrés-jours"], ["relaisLines", null], ["pvLines", null], ["windStep", null], ["actMachine", null], ["skyUpdate", "Le ciel"], ["localDecor", "L'intérieur des bâtiments"], ["regTick", "La vie des régions"]]
    .flatMap(([p, t]) => scene("ville-" + p, t || NOMS[p] || p, prendre(p)));
  { const F = fichiers.find((F) => /habitants-regions\.js$/.test(F.chemin)); if (F) ambiance.push(...scene("ville-reg-divers", "Habitants des régions : divers", F.items.concat(F.libres).filter((it) => !it._place).map((it) => ((it._place = true), it)))); }
  if (ambiance.length) ville.push({ id: "ville-ambiance", num: "·", titre: "Objets, décor, météo", resume: "Ce qu'on peut examiner en ville, et ce que le ciel change.", noeuds: ambiance });

  // ---------------------------------------------------------------- 4. secrets et clins d'œil
  const SECRETS = don("SECRETS") || {}, EGGS = don("EGGS") || {};
  // tous les déclencheurs, où qu'ils soient (y compris à la suite d'un dialogue déjà rangé dans un chapitre : on les montre aux deux endroits)
  const tousSecrets = [];
  (function chercher(L, parent) { L.forEach((it) => { if (it.genre === "secret") tousSecrets.push(Object.assign(it, { dans: it.dans || (parent && parent.dans), f: it.f || (parent && parent.f) })); if (it.suite) chercher(it.suite, it.f ? it : parent); if (it.etapes && it.genre === "suite") chercher(it.etapes.filter((e) => e && e.suite), it); }); })(tout, null);
  const rangSecrets = (table, oeuf, titre, resumeRang) => {
    const N = Object.entries(table).map(([cle, nom]) => {
      const its = tousSecrets.filter((it) => it.cle === cle).map((it) => ((it._place = true), it));
      const ou = [...new Set(its.map((it) => NOMS[it.dans] || SCENES_NOMS[it.dans]).filter(Boolean))];
      return { id: "secret-" + cle, genre: "secret", titre: lisible(nom), sous: its.length ? `${its.length} déclencheur${its.length > 1 ? "s" : ""}` : "déclenché par le jeu", suivi: { secret: cle },
        blocs: [{ genre: "texte", titre: "Son nom dans le menu", t: nom }, note("+15 XP la première fois." + (ou.length ? " Où : " + ou.join(" ; ") + "." : "")), ...its] };
    });
    return { id: oeuf ? "oeufs" : "secrets", num: oeuf ? "♪" : "?", titre, resume: resumeRang, noeuds: N };
  };
  const secrets = [rangSecrets(SECRETS, false, "Les secrets", "Répliques cachées, à trouver en fouillant."), rangSecrets(EGGS, true, "Clins d'œil aux jeux vidéo", "Un par jeu.")];
  const resteSecrets = [["jouleExtra", null], ["secretObjs", null], ["eggObjs", null], ["nameEgg", null], ["actMobilier", null], ["hadesBlock", "Le mode Hadès"], ["eggDofus", "Dofus"], ["eggWii", "Wii"], ["eggArtisan", "L'artisan"], ["eggGardien", "Le gardien"], ["eggSmash", "Smash"], ["poolSay", "La piscine"], ["enterBox", "Le carton"], ["updateGuard", "Le garde"], ["secret", "Secret trouvé"], ["egg", "Clin d'œil trouvé"]]
    .flatMap(([p, t]) => scene("sec-" + p, t || NOMS[p] || p, prendre(p)));
  ["HADES_LINES", "QUIPS", "jouleTalks", "MOBILIER", "PONDT", "WC3", "TREE", "POOL_LINE", "BOX", "HAD"].forEach((nom) => { const d = don(nom); if (d && textesDe(d).some((t) => estProse(t.v) || String(t.v).length > 20)) resteSecrets.push({ id: "sec-d-" + nom, genre: "scene", titre: { HADES_LINES: "Mode Hadès : les rebuffades", QUIPS: "Les réparties", jouleTalks: "Mme Joule, harcelée", MOBILIER: "Le mobilier bavard" }[nom] || NOMS[nom] || nom, sous: "répliques", blocs: [{ genre: "donnees", nom, valeur: d }] }); });
  if (resteSecrets.length) secrets.push({ id: "secrets-reste", num: "·", titre: "Où et comment ils se déclenchent", resume: "", noeuds: resteSecrets });

  // ---------------------------------------------------------------- 5. tout le reste : mécanique et interface
  const restes = new Map();
  tout.filter((it) => !it._place).forEach((it) => { const dossier = it.f.split("/")[1]; const k = dossier + "|" + it.f + "|" + it.dans; if (!restes.has(k)) restes.set(k, []); restes.get(k).push(it); it._place = true; });
  const parDossier = {};
  restes.forEach((blocs, k) => { const [dossier, f, dans] = k.split("|"); (parDossier[dossier] ||= []).push({ id: "reste-" + f + "-" + dans, genre: "scene", titre: NOMS[dans] || (dans === "(fichier)" ? "Divers" : dans), sous: f.replace(/^jeu\//, ""), technique: !NOMS[dans] && dans !== "(fichier)", blocs }); });
  const mecanique = Object.entries(parDossier).map(([dossier, noeuds]) => ({ id: "meca-" + dossier, num: "·", titre: DOSSIERS[dossier] || dossier, resume: "", noeuds }));

  const sections = [
    { id: "histoire", titre: "L'histoire", sous: "12 chapitres, 8 arènes", rangs: histoire },
    { id: "voyages", titre: "Les voyages en train", sous: `${declares.length} sites`, rangs: voyages },
    { id: "ville", titre: "La ville", sous: "habitants et ambiance", rangs: ville },
    { id: "secrets", titre: "Secrets et clins d'œil", sous: "", rangs: secrets },
    { id: "mecanique", titre: "Mécanique et interface", sous: "règles communes, menus, écrans", rangs: mecanique },
  ];
  // ---------------------------------------------------------------- le filet : les textes de données qu'aucun nœud ne montre
  const chaqueNoeud = (f) => sections.forEach((s) => s.rangs.forEach((r) => r.noeuds.forEach((n) => f(n, r, s))));
  const horsFilet = (B, out = []) => { B.forEach((b) => { if (b.filet) return; out.push(...textesDe(Object.assign({}, b, { blocs: null, etapes: null, suite: null }))); ["blocs", "etapes", "suite"].forEach((k) => Array.isArray(b[k]) && horsFilet(b[k], out)); }); return out; };
  const vus = new Set();
  chaqueNoeud((n) => horsFilet(n.blocs).forEach((t) => vus.add(t.f + ":" + t.a)));
  const garde = (t) => !vus.has(t.f + ":" + t.a) && (estProse(t.v) || estLibelle(t.v));
  const elaguer = (x, prof = 0) => {
    if (!x || typeof x !== "object" || prof > 14) return undefined;
    if (x._t) return garde(x) ? x : undefined;
    if (x._f) return elaguer(x.retour, prof + 1);
    if (Array.isArray(x)) { const a = x.map((e) => elaguer(e, prof + 1)).filter((e) => e !== undefined); return a.length ? a : undefined; }
    const o = {}; let n = 0;
    for (const k in x) { const e = elaguer(x[k], prof + 1); if (e !== undefined) { o[k] = e; n++; } }
    return n ? o : undefined;
  };
  const rangAmbiance = ville.find((r) => r.id === "ville-ambiance"), enVille = new Set(["QUARTERS", "WALKERS", "LIFE_WX", "REG_WX", "LOCALS", "MAPS", "SKY_IDLE", "SKY", "WM_BLD", "WM_SPOTS", "WM_SHORT", "WM_VILLE"]);
  fichiers.forEach((F) => Object.entries(F.donnees).forEach(([nom, valeur]) => {
    if (rangees.has(nom) || !elaguer(valeur)) return;
    const bloc = { genre: "donnees", nom, valeur, filet: true }, site = F.chemin.match(/^jeu\/voyages\/(\w+)\//)?.[1];
    const noeud = { id: "donnees-" + nom, genre: "scene", titre: NOMS[nom] || nom, sous: F.chemin.replace(/^jeu\//, ""), technique: !NOMS[nom], blocs: [bloc] };
    const rangSite = site && voyages.find((r) => r.id === "voy-" + site);
    if (nom === "SITES" && histoire[0]) (histoire[0].noeuds.find((n) => /chooseSite$/.test(n.id)) || histoire[0].noeuds[0]).blocs.push(Object.assign(bloc, { titre: "Les sites proposés" }));
    else if (rangSite) (rangSite.noeuds.find((n) => /-autres$/.test(n.id)) || rangSite.noeuds.at(-1)).blocs.push(bloc);
    else if (enVille.has(nom) && rangAmbiance) rangAmbiance.noeuds.push(noeud);
    else { const dossier = F.chemin.split("/")[1]; let r = mecanique.find((r) => r.id === "meca-" + dossier); if (!r) mecanique.push((r = { id: "meca-" + dossier, num: "·", titre: DOSSIERS[dossier] || dossier, resume: "", noeuds: [] })); r.noeuds.push(noeud); }
  }));
  const filets = (B) => B.flatMap((b) => { if (b.filet) { const e = elaguer(b.valeur); return e ? [Object.assign(b, { valeur: e })] : []; } ["blocs", "etapes", "suite"].forEach((k) => Array.isArray(b[k]) && (b[k] = filets(b[k]))); return [b]; });
  chaqueNoeud((n) => (n.blocs = filets(n.blocs)));
  // un nœud sans un seul texte (tout y est calculé par le jeu) n'apprend rien : on ne le montre pas
  sections.forEach((s) => { s.rangs.forEach((r) => (r.noeuds = r.noeuds.filter((n) => n.blocs.length && (n.genre !== "scene" || textesDe(n.blocs).length)))); s.rangs = s.rangs.filter((r) => r.noeuds.length); });

  // chaque nœud connaît ses textes (pour la recherche et les compteurs)
  let nbTextes = 0, nbNoeuds = 0, nbQuestions = 0;
  const uniques = new Set();
  chaqueNoeud((n) => { n.textes = textesDe(n.blocs); n.textes.forEach((t) => uniques.add(t.f + ":" + t.a)); nbNoeuds++; n.recherche = (n.titre + " " + n.sous + " " + n.textes.map((t) => t.v).join(" ")).toLowerCase();
    (function q(B) { B.forEach((b) => { if (["question", "choix", "cases", "formulaire", "ordre"].includes(b.genre)) nbQuestions++; if (b.etapes && b.genre === "suite") q(b.etapes); if (b.blocs) q(b.blocs); if (b.suite) q(b.suite); }); })(n.blocs); });
  nbTextes = uniques.size;
  return { sections, stats: { fichiers: fichiers.length, noeuds: nbNoeuds, textes: nbTextes, questions: nbQuestions, illisibles: FF.filter((F) => F.erreur).map((F) => F.chemin + " : " + F.erreur) } };
}

/** Un libellé court lu par le joueur (« Place de la Donnée », « Casquette »), et pas un repère du code. */
export function estLibelle(t) {
  const s = String(t).trim();
  return /^[A-ZÀ-Ý0-9«]/.test(s) && /[a-zà-ÿ]{2}/.test(s) && !/^[A-Z][a-z]+[A-Z]/.test(s) && !/^[\w.-]+\.(png|js|css|woff2)$/.test(s) && !/^[0-9.,\s-]+(px|rem|em|%)?$/.test(s);
}
