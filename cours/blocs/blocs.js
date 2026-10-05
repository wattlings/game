/**
 * L'affichage des blocs de contenu d'un niveau : texte, encadré, exemple pas à pas, tableau, schéma, démo, quiz, sources.
 */
import { icone } from "./icones.js";
import { echapper, texteRiche, tous, un } from "./outils.js";
import { monterQuiz } from "./quiz.js";
import { DEMOS } from "../demos/index.js";
import { SCHEMAS } from "../schemas/index.js";

const ENCADRES = {
  info: {
    ico: "info",
    titre: "À savoir",
  },
  attention: {
    ico: "alerte",
    titre: "Attention",
  },
  qa: {
    ico: "loupe",
    titre: "Pour tester le logiciel",
  },
  verifier: {
    ico: "alerte",
    titre: "À vérifier régulièrement",
  },
};

/** Le HTML d'un bloc de contenu, selon son type. */
function rendreBloc(bloc, indice) {
  const t = bloc.titre ? `<h3>${texteRiche(bloc.titre)}</h3>` : "";
  switch (bloc.type) {
    case "texte":
      return `<section class="bloc prose">${t}${bloc.paragraphes.map((a) => `<p>${texteRiche(a)}</p>`).join("")}</section>`;
    case "liste":
      return `<section class="bloc prose">${t}<ul class="a-retenir">${bloc.items.map((a) => `<li><span>${texteRiche(a)}</span></li>`).join("")}</ul></section>`;
    case "encadre": {
      const a = ENCADRES[bloc.ton || "info"];
      return `<aside class="encadre ton-${bloc.ton || "info"}">${icone(a.ico)}<div class="stack" style="gap:4px"><span class="eyebrow">${echapper(bloc.titre || a.titre)}</span>${(Array.isArray(bloc.texte) ? bloc.texte : [bloc.texte]).map((c) => `<p>${texteRiche(c)}</p>`).join("")}</div></aside>`;
    }
    case "tableau":
      return `<section class="bloc">${t}<div class="table-wrap"><table class="tab-texte"><thead><tr>${bloc.entetes.map((a) => `<th>${echapper(a)}</th>`).join("")}</tr></thead><tbody>${bloc.lignes.map((a) => `<tr>${a.map((c, o) => `<td${o === 0 ? ' class="col1"' : ""}>${texteRiche(c)}</td>`).join("")}</tr>`).join("")}</tbody></table></div>${bloc.note ? `<p class="note">${icone("info")}<span>${texteRiche(bloc.note)}</span></p>` : ""}</section>`;
    case "exemple":
      return `<section class="bloc exemple" data-exemple="${indice}">
        <div class="row" style="justify-content:space-between"><h3>${icone("tableau")} ${texteRiche(bloc.titre)}</h3><span class="badge neutre">Exemple chiffré</span></div>
        ${bloc.intro ? `<p class="prose">${texteRiche(bloc.intro)}</p>` : ""}
        <ol class="pas-a-pas">${bloc.etapes.map((a, c) => `<li ${c > 0 ? "hidden" : ""}><span class="n">${c + 1}</span><div><p>${texteRiche(a.t)}</p>${a.calc ? `<code class="calc">${echapper(a.calc)}</code>` : ""}</div></li>`).join("")}</ol>
        <div class="row"><button type="button" class="btn suivant">Étape suivante</button><button type="button" class="btn tout">Tout afficher</button></div>
        ${bloc.conclusion ? `<p class="feedback ok conclusion" hidden>${icone("ok")}<span>${texteRiche(bloc.conclusion)}</span></p>` : ""}
      </section>`;
    case "demo":
      return `<section class="demo" aria-labelledby="demo-${bloc.id}-t"><div class="demo-head"><span class="demo-tag">Démo</span><h2 id="demo-${bloc.id}-t">${echapper(bloc.titre)}</h2>${bloc.consigne ? `<p class="consigne">${echapper(bloc.consigne)}</p>` : ""}</div><div class="demo-body" data-demo="${bloc.id}"></div></section>`;
    case "schema":
      return `<figure class="schema" style="margin:0">${SCHEMAS[bloc.id]()}${bloc.legende ? `<figcaption>${echapper(bloc.legende)}</figcaption>` : ""}</figure>`;
    case "quiz":
      return `<section class="demo quiz-bloc" aria-labelledby="quiz-t"><div class="demo-head"><span class="demo-tag">Quiz</span><h2 id="quiz-t">${echapper(bloc.titre || "Mini-quiz")}</h2><p class="consigne">Choisis une réponse : la correction s’affiche tout de suite.</p></div><div class="demo-body" data-quiz></div></section>`;
    case "sources":
      return `<section class="bloc sources"><span class="eyebrow">Sources consultées${bloc.date ? ` (${echapper(bloc.date)})` : ""}</span><ul>${bloc.liens.map((a) => `<li><a href="${echapper(a.url)}" target="_blank" rel="noopener">${echapper(a.t)}</a></li>`).join("")}</ul></section>`;
    default:
      return "";
  }
}

/** Affiche une suite de blocs dans `conteneur`, puis branche les démos, les exemples pas à pas et le quiz.
 * Renvoie la fonction qui démonte le tout quand on quitte la page. */
export function monterBlocs(conteneur, blocs, { num: t, quiz: a, toucher: c, marquerQuiz: o }) {
  conteneur.innerHTML = `<div class="stack" style="gap:28px">${blocs.map(rendreBloc).join("")}</div>`;
  const d = [];
  tous("[data-demo]", conteneur).forEach((l) => {
    const s = DEMOS[l.dataset.demo];
    if (!s) {
      l.innerHTML = `<p class="feedback bad">Démo introuvable : ${echapper(l.dataset.demo)}</p>`;
      return;
    }
    try {
      const r = s(l, {
        toucher: c,
        num: t,
      });
      if (typeof r == "function") {
        d.push(r);
      }
    } catch (r) {
      console.error(r);
      l.innerHTML =
        '<p class="feedback bad">La démo n’a pas pu se charger. Recharge la page ; si le problème persiste, signale-le à l’équipe.</p>';
    }
  });
  tous("[data-exemple]", conteneur).forEach((l) => {
    const s = tous(".pas-a-pas li", l);
    const r = () => {
      un(".suivant", l).hidden = true;
      un(".tout", l).hidden = true;
      const i = un(".conclusion", l);
      if (i) {
        i.hidden = false;
      }
    };
    un(".suivant", l).addEventListener("click", () => {
      const i = s.find((p) => p.hidden);
      if (i) {
        i.hidden = false;
        c();
      }
      if (!s.some((p) => p.hidden)) {
        r();
      }
    });
    un(".tout", l).addEventListener("click", () => {
      s.forEach((i) => {
        i.hidden = false;
      });
      c();
      r();
    });
    if (s.length === 1) {
      r();
    }
  });
  const u = un("[data-quiz]", conteneur);
  if (u && a) {
    monterQuiz(u, a, o);
  }
  return () => d.forEach((l) => l());
}
