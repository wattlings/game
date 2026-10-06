// Les sources du cours et du jeu : contrôle, tableau de relecture, test des liens.
//
//   node outils/sources.mjs             → contrôle (quelques secondes, sans navigateur)
//   node outils/sources.mjs relecture   → fabrique outils/sortie/sources-relecture.html et sources-relecture.csv
//   node outils/sources.mjs liens       → ouvre chaque lien du registre et signale ceux qui ne répondent plus (demande Internet)
//
// Trois choses à connaître :
//   - le registre  commun/donnees/sources.js : chaque référence, une seule fois, avec sa clé ;
//   - les citations : [[cle]] dans un texte du cours, refs:['cle'] dans le jeu, src:["cle"] dans le glossaire ;
//   - les relevés  outils/sources/releve-*.json : pour chaque information d'un périmètre, son type (fait, règle, fictif,
//     méthode, calcul, vanne), son verdict (confirmé, corrigé, à corriger, sans source, sans objet) et, pour chaque source,
//     le passage exact qui l'appuie.
//
// Le contrôle échoue si : une clé citée n'existe pas dans le registre ; un relevé parle d'un texte qui n'est plus dans le site ;
// un fait ou une règle confirmé n'a pas de source ; ou sa source n'est affichée nulle part à l'endroit où il est enseigné.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const RACINE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const lire = (f) => fs.readFileSync(path.join(RACINE, f), "utf8");
const existe = (f) => fs.existsSync(path.join(RACINE, f));
const sansNotes = (t) => t.replace(/\s*\[\[[a-z0-9, -]+\]\]/g, "");
const fichiers = (dossier, filtre) =>
  fs.readdirSync(path.join(RACINE, dossier), { recursive: true }).map((f) => path.join(dossier, String(f)).replaceAll("\\", "/")).filter((f) => filtre.test(f));

const VERDICTS = { confirme: "Confirmé", corrige: "Corrigé", "a-corriger": "À corriger", "sans-source": "Sans source", "sans-objet": "Sans objet" };
const TYPES = { fait: "Fait", regle: "Règle", fictif: "Fictif", methode: "Méthode", calcul: "Calcul", vanne: "Vanne" };
const PERIMETRES = { "releve-cours-etape-2.json": "Cours · étape 2", "releve-jeu-etape-2.json": "Jeu · étape 2", "releve-voyage-solaire.json": "Jeu · centrale solaire" };

/** Le registre (on l'importe tel quel : c'est un module du site). */
async function registre() {
  process.removeAllListeners("warning"); // Node signale que le site n'a pas de package.json : sans intérêt ici
  return (await import(pathToFileURL(path.join(RACINE, "commun/donnees/sources.js")).href)).SOURCES;
}
const EXEMPLE = /^cle(-\d)?$/; // « cle », « cle-1 » : les exemples écrits dans les commentaires
const cles = (liste) => [...liste.matchAll(/["']([a-z0-9-]+)["']/g)].map((m) => m[1]).filter((k) => !EXEMPLE.test(k));

/** Tout ce que le site cite, endroit par endroit : { "fichier ou zone": Set(clés) }. */
function citations() {
  const C = {};
  const noter = (ou, liste) => { (C[ou] ||= new Set()); liste.forEach((k) => C[ou].add(k)); };
  // le cours : [[cle]] dans les contenus
  for (const f of fichiers("cours/contenu", /\.js$/)) {
    noter(f, [...lire(f).matchAll(/\[\[([a-z0-9, -]+)\]\]/g)].flatMap((m) => m[1].split(",").map((k) => k.trim())).filter((k) => !EXEMPLE.test(k)));
  }
  // les démos : SOURCES_DEMOS dans cours/contenu/sources.js
  const demos = lire("cours/contenu/sources.js").match(/SOURCES_DEMOS = \{([\s\S]*?)\n\};/);
  if (demos) for (const m of demos[1].matchAll(/(\w+): \[([^\]]*)\]/g)) noter("demo:" + m[1], cles(m[2]));
  // le glossaire : src:[…] sur un terme
  for (const m of lire("commun/donnees/glossaire.js").matchAll(/\n  "?([a-z0-9-]+)"?: \{\n((?:    .*\n)*?)  \},/g)) {
    const src = m[2].match(/src: \[([^\]]*)\]/);
    if (src) noter("glossaire:" + m[1], cles(src[1]));
  }
  // le jeu : refs:[…] (fiches, arènes, informations et sites de voyage) et REFS_ETAPES
  for (const f of fichiers("jeu", /\.js$/)) {
    const t = lire(f);
    const trouve = [...t.matchAll(/refs:\[([^\]]*)\]/g)].flatMap((m) => cles(m[1]));
    if (f.endsWith("recit/references.js")) for (const m of t.matchAll(/\n\s+(\w+):\[([^\]]*)\]/g)) { noter("jeu:etape-" + m[1], cles(m[2])); trouve.push(...cles(m[2])); }
    if (trouve.length) noter(f, trouve);
  }
  return C;
}

/** Les clés affichées là où une ligne de relevé est enseignée. */
function affichees(ligne, C, nomReleve) {
  const f = ligne.fichier, U = new Set(), ajoute = (ou) => (C[ou] || []).forEach((k) => U.add(k));
  if (f.startsWith("cours/contenu/")) ajoute(f);
  else if (f.startsWith("cours/demos/")) ajoute("demo:" + path.basename(f, ".js").replace(/-(\w)/g, (m, c) => c.toUpperCase()));
  else if (f === "commun/donnees/glossaire.js") { const m = ligne.repere.match(/glossaire › ([a-z0-9-]+)/); if (m) ajoute("glossaire:" + m[1]); }
  else if (f === "commun/donnees/references.js") Object.keys(C).filter((k) => k.startsWith("demo:") || k.startsWith("cours/")).forEach(ajoute);
  else if (f.startsWith("jeu/voyages/")) Object.keys(C).filter((k) => k.startsWith(path.dirname(f) + "/")).forEach(ajoute);
  else if (f.startsWith("jeu/")) {
    // une étape du jeu : ses fiches, son arène, ses habitants et son épreuve
    const etape = (nomReleve.match(/etape-(\d)/) || [])[1];
    ajoute("jeu/recit/fiches-savoir.js"); ajoute(`jeu/recit/arenes/arene-${etape}.js`); ajoute("jeu:etape-" + etape);
  }
  return U;
}

const releves = () => fichiers("outils/sources", /releve-.*\.json$/).sort().map((f) => ({ nom: path.basename(f), lignes: JSON.parse(lire(f)) }));

/** Le contrôle. Renvoie { verifs: [[nom, ok, détail]], bilan } ; utilisé aussi par outils/verifier.mjs. */
export async function controler() {
  const S = await registre(), C = citations(), R = releves(), verifs = [];
  const v = (nom, ok, detail = "") => verifs.push([nom, !!ok, detail]);
  // 1. le registre
  const mauvaises = Object.entries(S).filter(([, s]) => !s.t || !s.ed || !/^https:\/\//.test(s.url || "") || !["officiel", "secondaire"].includes(s.niveau) || !/^\d{4}-\d{2}-\d{2}$/.test(s.vu || "")).map(([k]) => k);
  v("registre : chaque source a un titre, un éditeur, un lien https, un niveau et une date de consultation", !mauvaises.length, mauvaises.join(" "));
  const urls = Object.values(S).map((s) => s.url), doublons = urls.filter((u, i) => urls.indexOf(u) !== i);
  v("registre : aucun lien en double", !doublons.length, doublons.join(" "));
  // 2. les citations
  const citees = new Set(Object.values(C).flatMap((s) => [...s]));
  const inconnues = Object.entries(C).flatMap(([ou, s]) => [...s].filter((k) => !S[k]).map((k) => `${k} (${ou})`));
  v("citations : chaque clé citée par le cours ou le jeu existe dans le registre", !inconnues.length, inconnues.join(" ; "));
  // 3. les relevés
  const bilan = [];
  for (const { nom, lignes } of R) {
    const titre = PERIMETRES[nom] || nom, perdues = [], sansSource = [], clesInconnues = [], nonAffichees = [], cache = {};
    for (const l of lignes) {
      if (!existe(l.fichier)) { perdues.push(`${l.id} (fichier ${l.fichier} introuvable)`); continue; }
      const texte = (cache[l.fichier] ||= sansNotes(lire(l.fichier)));
      if (!texte.includes(sansNotes(l.texte))) perdues.push(l.id);
      l.sources.forEach((s) => { if (!S[s.cle]) clesInconnues.push(`${l.id}:${s.cle}`); });
      if (["fait", "regle"].includes(l.type) && ["confirme", "corrige"].includes(l.verdict)) {
        if (!l.sources.length) sansSource.push(l.id);
        else { const A = affichees(l, C, nom); if (!l.sources.some((s) => A.has(s.cle))) nonAffichees.push(l.id); }
      }
    }
    v(`${titre} : chaque ligne du relevé retrouve son texte dans le site`, !perdues.length, perdues.join(" "));
    v(`${titre} : chaque source du relevé est dans le registre`, !clesInconnues.length, clesInconnues.join(" "));
    v(`${titre} : chaque fait ou règle confirmé a une source`, !sansSource.length, sansSource.join(" "));
    v(`${titre} : la source de chaque fait ou règle est affichée là où il est enseigné`, !nonAffichees.length, nonAffichees.join(" "));
    // le bilan compte les faits et les règles : c'est eux qu'il faut sourcer
    const F = lignes.filter((l) => ["fait", "regle"].includes(l.type)), n = (verdict) => F.filter((l) => l.verdict === verdict).length;
    bilan.push({ titre, total: lignes.length, aSourcer: F.length, confirmes: n("confirme"), corriges: n("corrige"), aCorriger: n("a-corriger"), sansSource: n("sans-source"), sansObjet: lignes.length - F.length });
  }
  const inutiles = Object.keys(S).filter((k) => !citees.has(k));
  return { verifs, bilan, inutiles, nbSources: Object.keys(S).length, registre: S, releves: R };
}

// ---------------------------------------------------------------- le tableau de relecture
const esc = (t) => String(t ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
function relecture({ registre: S, releves: R, bilan }) {
  const lignes = R.flatMap(({ nom, lignes }) => lignes.map((l) => ({ ...l, perimetre: PERIMETRES[nom] || nom })));
  const rang = (l) => `<tr data-p="${esc(l.perimetre)}" data-v="${l.verdict}" data-t="${l.type}">
    <td class="id">${l.id}<small>${esc(l.perimetre)}</small></td>
    <td><small>${esc(l.fichier)} · ${esc(l.repere)}</small>${l.avant ? `<del>${esc(l.avant)}</del><ins>${esc(l.texte)}</ins>` : `<q>${esc(l.texte)}</q>`}<p>${esc(l.affirmation)}</p></td>
    <td><span class="t t-${l.type}">${TYPES[l.type]}</span><span class="v v-${l.verdict}">${VERDICTS[l.verdict]}</span>${l.attente ? `<small class="att">${esc(l.attente)}</small>` : ""}</td>
    <td>${l.sources.map((s) => `<div class="src"><a href="${esc(S[s.cle]?.url)}" target="_blank" rel="noopener">${esc(S[s.cle]?.ed)}, ${esc(S[s.cle]?.t)}</a>${S[s.cle]?.niveau === "secondaire" ? ' <i>(source secondaire)</i>' : ""}<blockquote>${esc(s.passage)}${s.page ? ` <small>(${esc(s.page)})</small>` : ""}${s.doute ? " <small>(citation à recontrôler)</small>" : ""}</blockquote></div>`).join("") || "<small>—</small>"}
      ${l.verdict !== "corrige" && l.correction ? `<p class="prop"><b>Proposition :</b> ${esc(l.correction)}</p>` : ""}${l.note ? `<p class="note">${esc(l.note)}</p>` : ""}</td></tr>`;
  const boutons = (attr, valeurs, libelles) => valeurs.map((x) => `<button type="button" data-f="${attr}" data-x="${esc(x)}">${esc(libelles?.[x] || x)}</button>`).join("");
  return `<!doctype html><html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Sources · tableau de relecture</title>
<style>
:root{--ink:#0a1a33;--muted:#4a5b76;--line:#d6deea;--bg:#f5f7fb;--card:#fff}
body{margin:0;font:15px/1.45 system-ui,"Segoe UI",sans-serif;color:var(--ink);background:var(--bg)}
header{padding:18px 20px 10px;max-width:1500px;margin:auto}h1{margin:0 0 6px;font-size:24px}header p{margin:4px 0;color:var(--muted);max-width:75ch}
.bilan{display:flex;flex-wrap:wrap;gap:10px;margin:12px 0}.bilan div{background:var(--card);border:1px solid var(--line);border-radius:10px;padding:8px 12px;min-width:210px}.bilan b{display:block}.bilan small{display:block;color:var(--muted)}
.filtres{position:sticky;top:0;background:var(--bg);padding:8px 20px;border-bottom:1px solid var(--line);display:flex;flex-wrap:wrap;gap:6px 14px;align-items:center;z-index:2}
.filtres span{display:inline-flex;gap:4px;flex-wrap:wrap;align-items:center}.filtres b{font-size:12px;text-transform:uppercase;letter-spacing:.04em;color:var(--muted);margin-right:2px}
button{font:inherit;font-size:13px;border:1px solid var(--line);background:var(--card);border-radius:999px;padding:3px 10px;cursor:pointer}button.on{background:var(--ink);color:#fff;border-color:var(--ink)}
input[type=search]{font:inherit;padding:5px 10px;border:1px solid var(--line);border-radius:8px;min-width:220px}#compte{color:var(--muted);font-size:13px;margin-left:auto}
.table{overflow-x:auto;padding:0 20px 40px}table{border-collapse:collapse;width:100%;max-width:1500px;margin:12px auto;background:var(--card)}
th,td{border:1px solid var(--line);padding:8px 10px;vertical-align:top;text-align:left}th{background:#eef2f8;font-size:13px;position:sticky;top:0}
td.id{white-space:nowrap;font-variant-numeric:tabular-nums;font-weight:600}td small,td.id small{display:block;color:var(--muted);font-weight:400;font-size:12px}
q{display:block;quotes:"« " " »";font-weight:600}del{display:block;color:#a12a2f;text-decoration-color:#a12a2f88}ins{display:block;color:#17603a;text-decoration:none;font-weight:600}td p{margin:4px 0 0;color:var(--muted);font-size:13.5px}
.t,.v{display:inline-block;border-radius:999px;padding:1px 9px;font-size:12.5px;margin:0 4px 4px 0;white-space:nowrap}.t{background:#eef2f8}
.v-confirme{background:#e2f4e8;color:#17603a}.v-corrige{background:#dcebff;color:#0b3f86}.v-a-corriger{background:#ffe9c7;color:#7a4a00}.v-sans-source{background:#fde6e7;color:#a12a2f}.v-sans-objet{background:#eee;color:#555}
.att{color:#7a4a00!important}.src{margin-bottom:6px}.src a{color:#0b3f86}blockquote{margin:2px 0 0;padding-left:8px;border-left:3px solid var(--line);color:var(--muted);font-size:13px}
.prop{color:#7a4a00!important}.note{font-style:italic}
td:nth-child(2){min-width:300px;width:34%}td:nth-child(4){min-width:320px;width:42%}
</style></head><body>
<header><h1>Sources : tableau de relecture</h1>
<p>Chaque ligne est une information du cours ou du jeu. Les faits et les règles ont une source, ouverte et lue le ${esc(new Date(Object.values(S).map((s) => s.vu).sort().pop() + "T12:00:00").toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" }))}, avec le passage qui les appuie. Ce qui est inventé pour l’exemple, la méthode du cours, les calculs et les vannes sont « sans objet ».</p>
<div class="bilan">${bilan.map((b) => `<div><b>${esc(b.titre)}</b><small>${b.total} informations, dont ${b.aSourcer} faits et règles :</small><small>${b.confirmes} confirmés · ${b.corriges} corrigés · ${b.aCorriger} à corriger · ${b.sansSource} sans source</small></div>`).join("")}</div></header>
<div class="filtres"><span><b>Périmètre</b>${boutons("p", [...new Set(lignes.map((l) => l.perimetre))])}</span><span><b>Verdict</b>${boutons("v", Object.keys(VERDICTS), VERDICTS)}</span><span><b>Type</b>${boutons("t", Object.keys(TYPES), TYPES)}</span><input type="search" id="q" placeholder="Chercher un mot…" aria-label="Chercher"><span id="compte"></span></div>
<div class="table"><table><thead><tr><th>N°</th><th>Information</th><th>Type et verdict</th><th>Sources, passage lu, remarques</th></tr></thead><tbody>${lignes.map(rang).join("")}</tbody></table></div>
<script>
const F={p:new Set(),v:new Set(),t:new Set()},R=[...document.querySelectorAll('tbody tr')],q=document.getElementById('q');
function maj(){const m=q.value.trim().toLowerCase();let n=0;R.forEach(r=>{const ok=['p','v','t'].every(k=>!F[k].size||F[k].has(r.dataset[k]))&&(!m||r.textContent.toLowerCase().includes(m));r.hidden=!ok;if(ok)n++});document.getElementById('compte').textContent=n+' ligne'+(n>1?'s':'')+' sur '+R.length}
document.querySelectorAll('button[data-f]').forEach(b=>b.onclick=()=>{const s=F[b.dataset.f];s.has(b.dataset.x)?s.delete(b.dataset.x):s.add(b.dataset.x);b.classList.toggle('on');maj()});q.oninput=maj;maj();
</script></body></html>`;
}
function csv({ registre: S, releves: R }) {
  const c = (t) => `"${String(t ?? "").replaceAll('"', '""')}"`;
  const L = [["N°", "Périmètre", "Fichier", "Repère", "Texte avant", "Texte", "Information", "Type", "Verdict", "En attente", "Proposition", "Remarque", "Sources", "Passages lus", "Liens"].map(c).join(";")];
  R.forEach(({ nom, lignes }) => lignes.forEach((l) => L.push([l.id, PERIMETRES[nom] || nom, l.fichier, l.repere, l.avant, l.texte, l.affirmation, TYPES[l.type], VERDICTS[l.verdict], l.attente, l.verdict === "corrige" ? "" : l.correction, l.note,
    l.sources.map((s) => `${S[s.cle]?.ed}, ${S[s.cle]?.t}`).join(" | "), l.sources.map((s) => s.passage).join(" | "), l.sources.map((s) => S[s.cle]?.url).join(" | ")].map(c).join(";"))));
  return "﻿" + L.join("\r\n");
}

// ---------------------------------------------------------------- en ligne de commande
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const quoi = process.argv[2] || "controle";
  const r = await controler();
  if (quoi === "liens") {
    console.log(`Test des ${r.nbSources} liens du registre (10 secondes au plus par lien)…`);
    let morts = 0;
    for (const [cle, s] of Object.entries(r.registre)) {
      let etat;
      try { const rep = await fetch(s.url, { redirect: "follow", signal: AbortSignal.timeout(10000), headers: { "user-agent": "Mozilla/5.0 (verification des sources)" } }); etat = rep.status; } catch (e) { etat = e.name === "TimeoutError" ? "pas de réponse" : "erreur : " + (e.cause?.code || e.message); }
      if (etat !== 200) { morts++; console.log(`  ${etat} · ${cle} · ${s.url}`); }
    }
    console.log(morts ? `${morts} lien(s) à ouvrir à la main : un site peut refuser les robots (403) tout en s'ouvrant dans un navigateur.` : "Tous les liens répondent.");
  } else {
    r.verifs.forEach(([nom, ok, detail]) => console.log(ok ? "  ok   " : "  ÉCHEC", nom, ok ? "" : "— " + detail));
    console.log(`\n${r.nbSources} sources au registre.`);
    r.bilan.forEach((b) => console.log(`${b.titre} : ${b.total} informations, dont ${b.aSourcer} faits et règles → ${b.confirmes} confirmés, ${b.corriges} corrigés, ${b.aCorriger} à corriger, ${b.sansSource} sans source. Les ${b.sansObjet} autres (fictif, méthode, calcul, vanne) n'en demandent pas.`));
    if (r.inutiles.length) console.log(`Sources du registre que rien ne cite (gardées comme preuve dans les relevés) : ${r.inutiles.join(", ")}`);
    if (quoi === "relecture") {
      fs.mkdirSync(path.join(RACINE, "outils/sortie"), { recursive: true });
      fs.writeFileSync(path.join(RACINE, "outils/sortie/sources-relecture.html"), relecture(r));
      fs.writeFileSync(path.join(RACINE, "outils/sortie/sources-relecture.csv"), csv(r));
      console.log("\nTableau de relecture écrit : outils/sortie/sources-relecture.html (et .csv pour un tableur)");
    }
    if (r.verifs.some(([, ok]) => !ok)) process.exitCode = 1;
  }
}
