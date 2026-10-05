/**
 * La page du quiz de synthèse.
 */
import { icone } from "../blocs/icones.js";
import { echapper } from "../blocs/outils.js";
import { monterQuiz } from "../blocs/quiz.js";
import { ETAPES } from "../contenu/index.js";
import { QUESTIONS_QUIZ_FINAL } from "../contenu/quiz-final.js";
import { magasin } from "../coquille/etat.js";

export function pageQuizFinal(conteneur) {
  const n = magasin.get().quizFinal;
  conteneur.innerHTML = `
  <div class="stack" style="gap:24px">
    <div class="stack" style="gap:8px">
      <span class="eyebrow">${QUESTIONS_QUIZ_FINAL.length} questions · les 8 étapes</span>
      <h1>Quiz de synthèse</h1>
      <p class="prose muted">Une ou deux questions par étape, de Cadrer à Mesurer. Chaque correction renvoie à l’étape à relire.${n != null ? ` Ton meilleur score : ${n} / ${QUESTIONS_QUIZ_FINAL.length}.` : ""}</p>
    </div>
    <section class="demo quiz-bloc"><div class="demo-body" id="qf"></div></section>
    <div id="qf-fin" aria-live="polite"></div>
  </div>`;
  const t = QUESTIONS_QUIZ_FINAL.map((a) => {
    const c = ETAPES.find((o) => o.num === a.etape);
    return {
      ...a,
      q: a.q,
      explication: `${a.explication} (Étape ${c.num}, ${c.titre}.)`,
    };
  });
  monterQuiz(conteneur.querySelector("#qf"), t, (a) => {
    magasin.set({
      quizFinal: Math.max(a, magasin.get().quizFinal || 0),
    });
    const c = [
      ...new Set(
        QUESTIONS_QUIZ_FINAL.filter(
          (o, d) => !!conteneur.querySelector(`.quiz-q[data-q="${d}"] button.bad`),
        ).map((o) => o.etape),
      ),
    ];
    conteneur.querySelector("#qf-fin").innerHTML =
      `<div class="feedback ${a === QUESTIONS_QUIZ_FINAL.length ? "ok" : "info"}">${icone(a === QUESTIONS_QUIZ_FINAL.length ? "ok" : "info")}<div><b>${a} / ${QUESTIONS_QUIZ_FINAL.length}.</b> ${
        a === QUESTIONS_QUIZ_FINAL.length
          ? "Tu maîtrises tout le cycle."
          : `À relire : ${c
              .map((o) => {
                const d = ETAPES.find((u) => u.num === o);
                return `<a href="#etape-${o}">${o}. ${echapper(d.titre)}</a>`;
              })
              .join(", ")}.`
      }</div></div>`;
  });
}
