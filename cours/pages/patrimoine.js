/**
 * La page « Piloter un patrimoine » : après les 8 étapes, où agir en premier quand on gère vingt bâtiments ?
 * Les 20 sites et leurs calculs sont dans commun/donnees/patrimoine.js, les graphiques dans commun/graphiques/.
 */
import {
  ACT,
  IND,
  PSITES,
  ecart,
  gis,
  medAct,
  pareto,
  pct,
  ratio,
  sgn,
} from "../../commun/donnees/patrimoine.js";
import { benchHTML, paretoHTML, tipify } from "../../commun/graphiques/barres.js";
import { esc, fmt } from "../../commun/texte.js";
import { magasin } from "../coquille/etat.js";

/** Les couleurs des graphiques, prises dans les jetons du cours. */
const SC = {
  e: "var(--data)",
  g: "var(--energie)",
  over: "var(--energie-ink)",
  under: "var(--data)",
  bar: "var(--data)",
  ink: "var(--ink)",
  muted: "var(--muted)",
  warn: "var(--warn)",
  good: "var(--ok)",
};
export function pagePatrimoine(c) {
  if (!magasin.get().patrimoineVu) magasin.set({ patrimoineVu: true }); // le bonus apparaît « vu » dans le tableau de progression
  const P = pareto("mwh"),
    G = PSITES.slice().sort((a, b) => gis(b) - gis(a)),
    GT = PSITES.reduce((a, s) => a + gis(s), 0),
    pas = PSITES[1];
  c.className = "fam-energie";
  c.innerHTML = `<div class="stack qk-patri" style="gap:24px">
    <header class="etape-head"><div class="titre">
      <div class="row"><span class="badge energie">Énergie</span><span class="badge neutre">Bonus</span><span class="eyebrow">Au-delà des 8 étapes</span></div>
      <h1>Piloter un patrimoine</h1>
      <p class="question">Où agir en premier quand on gère vingt bâtiments ?</p></div></header>
    <div class="essentiel"><div class="stack" style="gap:18px">
      <p class="phrase-cle">À l’échelle d’un patrimoine, on ne lit plus une courbe : on classe, on compare et on priorise, pour mettre l’effort là où il rapporte le plus.</p>
      <ul class="a-retenir">
        <li><span>Le <strong>Pareto</strong> classe les sites du plus gros au plus petit et cumule leur part. Une minorité de sites fait souvent l’essentiel : la « règle des 80/20 » est un ordre de grandeur, pas une loi.</span></li>
        <li><span>Le classement dépend de l’indicateur. En euros, l’électricité pèse plus (≈ 186 €/MWh contre ≈ 89 €/MWh pour le gaz). En CO₂, c’est le gaz (≈ 0,204 contre ≈ 0,064 tCO₂e/MWh).</span></li>
        <li><span>Gros ne veut pas dire inefficace. On rapporte la consommation à la surface (kWh/m²) et on compare à des bâtiments de <strong>même activité</strong> : médiane du patrimoine et référence nationale.</span></li>
        <li><span>Le <strong>gisement</strong> = (ratio − référence) × surface. C’est lui qui dit où se jouent les MWh.</span></li>
      </ul>
      <aside class="analogie" aria-label="Analogie"><span class="ico" aria-hidden="true">€</span><div class="stack" style="gap:4px"><span class="eyebrow">Analogie</span><h3>Le ticket de caisse</h3><p>Quelques articles font l’essentiel du ticket : c’est là qu’on regarde d’abord. Mais pour savoir si on paie trop, on compare le prix au kilo, pas le prix total.</p></div></aside>
    </div>
    <figure class="schema" style="margin:0;align-self:start"><div class="kpis">
      <div class="kpi"><span class="v num">${fmt(Math.round(P.T))}</span><span class="l">MWh/an sur 20 sites</span></div>
      <div class="kpi energie"><span class="v num">${P.n80}</span><span class="l">sites font 80 % des MWh</span></div>
      <div class="kpi"><span class="v num">${fmt(Math.round(GT))}</span><span class="l">MWh/an de gisement (${pct(GT / P.T)})</span></div></div>
      <figcaption>Ampère-sur-Loire (fictif) : 20 bâtiments municipaux, électricité et gaz.</figcaption></figure></div>
    <section class="demo" aria-labelledby="pd-t"><div class="demo-head"><span class="demo-tag">Démo</span><h2 id="pd-t">Le Pareto du patrimoine</h2><p class="consigne">Change d’indicateur : regarde quels sites montent ou descendent. Survole une ligne pour le détail.</p></div>
      <div class="demo-body"><div class="qk-seg" role="group" aria-label="Indicateur">${Object.keys(IND)
        .map(
          (k) =>
            `<button type="button" data-ind="${k}" aria-pressed="${k === "mwh"}">${IND[k].lab} (${IND[k].u})</button>`,
        )
        .join(
          "",
        )}<button type="button" data-ind="act" aria-pressed="false">Par activité (MWh)</button></div><div id="pp-chart"></div></div></section>
    <section class="demo" aria-labelledby="pb-t"><div class="demo-head"><span class="demo-tag">Démo</span><h2 id="pb-t">Comparer à des bâtiments similaires</h2><p class="consigne">Choisis une activité. La barre est le ratio du site, le trait la médiane du patrimoine, le losange la référence nationale.</p></div>
      <div class="demo-body"><div class="qk-seg" role="group" aria-label="Activité">${Object.keys(ACT)
        .map(
          (a) => `<button type="button" data-act="${a}" aria-pressed="${a === "ens"}">${ACT[a].lab}</button>`,
        )
        .join("")}</div><div id="pb-chart"></div></div></section>
    <section class="bloc exemple"><div class="row" style="justify-content:space-between"><h3>Le gisement de l’école Pasteur</h3><span class="badge neutre">Exemple chiffré</span></div>
      <ol class="pas-a-pas">
        <li><span class="n">1</span><div><p>Consommation : <strong>${fmt(pas.e + pas.g)} MWh</strong> pour <strong>${fmt(pas.surf)} m²</strong>.</p><code class="calc">${fmt((pas.e + pas.g) * 1000)} / ${fmt(pas.surf)} = ${fmt(Math.round(ratio(pas)))} kWh/m²</code></div></li>
        <li><span class="n">2</span><div><p>Référence nationale des écoles : <strong>${ACT.ens.ref} kWh/m²</strong>. Médiane des 5 écoles de la ville : ${fmt(Math.round(medAct("ens")))} kWh/m².</p><code class="calc">${fmt(Math.round(ratio(pas)))} / ${ACT.ens.ref} − 1 = ${sgn(ecart(pas))}</code></div></li>
        <li><span class="n">3</span><div><p>Gisement si l’école revenait à la référence :</p><code class="calc">(${fmt(Math.round(ratio(pas)))} − ${ACT.ens.ref}) × ${fmt(pas.surf)} = ${fmt(Math.round(gis(pas) * 1000))} kWh ≈ ${fmt(Math.round(gis(pas)))} MWh/an</code></div></li>
      </ol>
      <p class="feedback ok conclusion"><span>Pourtant, le plus gros gisement du patrimoine est celui de ${esc(G[0].n)} (${fmt(Math.round(gis(G[0])))} MWh/an) avec un écart de seulement ${sgn(ecart(G[0]))} : un petit écart sur un énorme volume pèse plus qu’un gros écart sur un petit site.</span></p></section>
    <section class="stack" style="gap:10px"><h2>Les pièges du benchmark</h2><ul class="a-retenir">
      <li><span><strong>La bonne surface.</strong> Une piscine se compare en kWh par m² de <em>bassin</em> : c’est l’eau chauffée qui consomme, pas le hall.</span></li>
      <li><span><strong>Les petits groupes.</strong> Une médiane calculée sur deux crèches n’a pas de sens : on s’appuie alors sur la référence nationale.</span></li>
      <li><span><strong>Le climat.</strong> Des sites d’une même ville se comparent entre eux sans correction. Face à une référence nationale, on corrige du climat (DJU).</span></li>
      <li><span><strong>Le périmètre.</strong> Un bâtiment privé de la ville (la boulangerie) n’entre pas dans le patrimoine ; un local loué par la ville (l’annexe du Carré) y entre.</span></li>
      <li><span><strong>Le contexte.</strong> Une résidence ouverte 24 h/24 ou un fournil ont des ratios élevés et normaux. Un ratio se lit toujours avec l’activité et les horaires.</span></li></ul>
      <p class="muted" style="font-size:var(--t-s)">Références nationales utilisées ici : ordres de grandeur par activité issus de la synthèse de l’enquête ADEME « Énergie et patrimoine communal » (données anciennes, corrigées du climat) et, pour les EHPAD, un ordre de grandeur publié d’environ 250 kWh/m²/an. À actualiser avec les données OPERAT avant tout usage réel. Le patrimoine d’Ampère-sur-Loire est fictif.</p>
      <p class="muted" style="font-size:var(--t-s)">Sources : <a href="https://www.banquedesterritoires.fr/sites/default/files/ra/La%20synth%C3%A8se%20de%20l'%C3%A9tude%20%22Energie%20et%20patrimoine%20communal%22.pdf" target="_blank" rel="noopener">ADEME, Énergie et patrimoine communal (synthèse)</a> · <a href="https://data.ademe.fr/datasets/epc-5-batiments" target="_blank" rel="noopener">ADEME, données « Énergie et patrimoine communal »</a> · <a href="https://www.lsmart.co/blog/conso-energie-ehpad-decret-tertiaire/" target="_blank" rel="noopener">Consommation des EHPAD (ordre de grandeur)</a></p></section>
    <nav class="pager" aria-label="Pages voisines"><a href="#etape-8"><small>← Étape précédente</small><b>8. Mesurer</b></a><a class="next" href="#quiz-final"><small>Pour finir →</small><b>Quiz final</b></a></nav>
  </div>`;
  const pp = c.querySelector("#pp-chart"),
    pb = c.querySelector("#pb-chart");
  const drawP = (k) => {
    pp.innerHTML = k === "act" ? paretoHTML("mwh", SC, { act: true }) : paretoHTML(k, SC);
    tipify(pp.querySelector(".pc"));
  };
  const drawB = (a) => {
    pb.innerHTML = benchHTML(a, SC);
    tipify(pb.querySelector(".pc"));
  };
  c.querySelectorAll("[data-ind]").forEach(
    (x) =>
      (x.onclick = () => {
        c.querySelectorAll("[data-ind]").forEach((y) => y.setAttribute("aria-pressed", y === x));
        drawP(x.dataset.ind);
      }),
  );
  c.querySelectorAll("[data-act]").forEach(
    (x) =>
      (x.onclick = () => {
        c.querySelectorAll("[data-act]").forEach((y) => y.setAttribute("aria-pressed", y === x));
        drawB(x.dataset.act);
      }),
  );
  drawP("mwh");
  drawB("ens");
}
