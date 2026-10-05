/**
 * Le composant quiz : questions à choix, correction immédiate, score.
 */
import { icone } from "./icones.js";
import { texteRiche, tous, un } from "./outils.js";

/** Affiche un quiz dans `conteneur` et appelle `auScore(nombre de bonnes réponses)` quand il est terminé. */
export function monterQuiz(conteneur, questions, auScore = () => {}) {
  const a = questions.map((d, u) => {
    const l = (u * 2 + 1) % d.choix.length;
    const s = d.choix.map((r, i) => (i + l) % d.choix.length);
    return {
      ...d,
      choix: s.map((r) => d.choix[r]),
      bonne: s.indexOf(d.bonne),
    };
  });
  let c = {};
  function o() {
    const d = Object.keys(c).length;
    const u = Object.entries(c).filter(([l, s]) => a[l].bonne === s).length;
    conteneur.innerHTML = `
      <ol class="quiz">${a
        .map((l, s) => {
          const r = c[s];
          return `<li class="quiz-q" data-q="${s}">
          <p class="quiz-enonce"><span class="n">${s + 1}</span>${texteRiche(l.q)}</p>
          <div class="quiz-choix" role="group" aria-label="Réponses à la question ${s + 1}">
            ${l.choix
              .map((i, p) => {
                const m = r == null ? "" : p === l.bonne ? "ok" : p === r ? "bad" : "off";
                return `<button type="button" data-c="${p}" class="${m}" ${r != null ? 'aria-disabled="true"' : ""} aria-pressed="${r === p}">${m === "ok" ? icone("ok") : m === "bad" ? icone("ko") : ""}<span>${texteRiche(i)}</span></button>`;
              })
              .join("")}
          </div>
          ${r != null ? `<p class="feedback ${r === l.bonne ? "ok" : "bad"}" role="status">${icone(r === l.bonne ? "ok" : "alerte")}<span><b>${r === l.bonne ? "Exact." : "Pas tout à fait."}</b> ${texteRiche(l.explication)}</span></p>` : ""}
        </li>`;
        })
        .join("")}</ol>
      <div class="row quiz-score"><span class="score">${d === a.length ? `Score : ${u} / ${a.length}` : `${d} / ${a.length} répondues`}</span>
      ${d === a.length ? `<span class="muted">${u === a.length ? "Sans faute !" : u >= a.length / 2 ? "Bien joué. Relis les explications des erreurs." : "Relis le niveau Comprendre, puis retente."}</span><button type="button" class="btn" id="quiz-reset">Recommencer</button>` : ""}</div>`;
    tous(".quiz-q", conteneur).forEach((l) => {
      const s = +l.dataset.q;
      tous("button[data-c]", l).forEach((r) =>
        r.addEventListener("click", () => {
          if (c[s] == null) {
            c[s] = +r.dataset.c;
            o();
            un(`.quiz-q[data-q="${s}"] .feedback`, conteneur)?.focus?.();
            if (Object.keys(c).length === a.length) {
              auScore(Object.entries(c).filter(([i, p]) => a[i].bonne === p).length);
            }
          }
        }),
      );
    });
    un("#quiz-reset", conteneur)?.addEventListener("click", () => {
      c = {};
      o();
    });
  }
  o();
}
