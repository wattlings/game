/**
 * Le glossaire à l'écran : bulle au survol d'un terme et tiroir latéral.
 */
import { GLOSSAIRE, termesTries } from "../../commun/donnees/glossaire.js";
import { SOURCES, libelleSource } from "../../commun/donnees/sources.js";
import { icone } from "../blocs/icones.js";
import { echapper, tous, un } from "../blocs/outils.js";
import { ETAPES } from "../contenu/index.js";

let bulle = null;

let minuterieBulle = null;

function fermerBulle() {
  bulle?.remove();
  bulle = null;
}

function ouvrirBulle(bouton) {
  const n = GLOSSAIRE[bouton.dataset.g];
  if (!n) {
    return;
  }
  fermerBulle();
  bulle = document.createElement("div");
  bulle.className = "bulle";
  bulle.setAttribute("role", "tooltip");
  bulle.id = "bulle-glossaire";
  bulle.innerHTML = `<b>${echapper(n.terme)}</b><span>${echapper(n.def)}</span><span class="plus">Clique pour voir l’exemple avec l’école</span>`;
  document.body.appendChild(bulle);
  bouton.setAttribute("aria-describedby", "bulle-glossaire");
  const t = bouton.getBoundingClientRect();
  const a = bulle.offsetWidth;
  const c = bulle.offsetHeight;
  let o = t.bottom + 8;
  if (o + c > window.innerHeight - 8) {
    o = t.top - c - 8;
  }
  bulle.style.top = `${Math.max(8, o)}px`;
  bulle.style.left = `${Math.min(Math.max(8, t.left + t.width / 2 - a / 2), window.innerWidth - a - 8)}px`;
}

/** Le HTML de la fiche d'un terme (définition, exemple, étapes liées). */
export function ficheTerme(cle, terme) {
  const t = terme.etapes
    .map((a) => {
      const c = ETAPES.find((o) => o.num === a);
      return `<a class="badge ${c.famille}" href="#etape-${a}">${a}. ${echapper(c.titre)}</a>`;
    })
    .join("");
  // les sources de la définition (src:[clés du registre commun/donnees/sources.js]) : un lien par source, au nom de son éditeur
  const s = (terme.src || [])
    .filter((a) => SOURCES[a])
    .map((a) => `<a href="${echapper(SOURCES[a].url)}" target="_blank" rel="noopener" title="${echapper(libelleSource(a))}">${echapper(SOURCES[a].ed)} ↗</a>`)
    .join(" · ");
  return `<article class="entree" id="g-${cle}"><h3>${echapper(terme.terme)}</h3><p>${echapper(terme.def)}</p><p class="ex">${echapper(terme.ex)}</p>${s ? `<p class="src">Source${terme.src.length > 1 ? "s" : ""} : ${s}</p>` : ""}<div class="liens">${t}</div></article>`;
}

let focusAvantTiroir = null;

/** Ouvre le tiroir du glossaire, éventuellement sur un terme précis. */
export function ouvrirGlossaire(cleAOuvrir = null) {
  fermerBulle();
  if (un(".drawer")) {
    un(".drawer-back").remove();
    un(".drawer").remove();
  }
  focusAvantTiroir = document.activeElement;
  const n = document.createElement("div");
  n.className = "drawer-back";
  const t = document.createElement("div");
  t.className = "drawer";
  t.setAttribute("role", "dialog");
  t.setAttribute("aria-modal", "true");
  t.setAttribute("aria-labelledby", "drawer-titre");
  t.innerHTML = `
    <header>
      <h2 id="drawer-titre">Glossaire</h2>
      <button class="icon-btn close" type="button" aria-label="Fermer le glossaire">${icone("ko")}</button>
      <label for="g-recherche" class="g-label">Rechercher un terme</label>
      <input id="g-recherche" type="search" placeholder="Rechercher : kWh, index, DJU…" autocomplete="off">
      <p class="muted" style="font-size:var(--t-xs)"><span id="g-compte" aria-live="polite"></span> · <a href="#glossaire">Ouvrir en pleine page</a></p>
    </header>
    <div class="liste"></div>`;
  document.body.append(n, t);
  const a = un(".liste", t);
  const c = un("#g-recherche", t);
  const o = () => {
    const u = c.value
      .trim()
      .toLowerCase()
      .normalize("NFD")
      .replace(/\p{Diacritic}/gu, "");
    const l = (r) =>
      r
        .toLowerCase()
        .normalize("NFD")
        .replace(/\p{Diacritic}/gu, "");
    const s = termesTries().filter((r) => !u || l(GLOSSAIRE[r].terme + " " + GLOSSAIRE[r].def).includes(u));
    a.innerHTML =
      s.map((r) => ficheTerme(r, GLOSSAIRE[r])).join("") ||
      '<p class="muted">Aucun terme ne correspond. Essaie un autre mot.</p>';
    un("#g-compte", t).textContent = `${s.length} terme${s.length > 1 ? "s" : ""}`;
  };
  o();
  c.addEventListener("input", o);
  const d = () => {
    n.remove();
    t.remove();
    focusAvantTiroir?.focus?.();
  };
  n.addEventListener("click", d);
  un(".close", t).addEventListener("click", d);
  t.addEventListener("click", (u) => {
    if (u.target.closest("a:not([target])")) {
      d();
    }
  });
  t.addEventListener("keydown", (u) => {
    if (u.key === "Escape") {
      d();
    }
    if (u.key === "Tab") {
      const l = tous("button, a, input", t);
      if (u.shiftKey && document.activeElement === l[0]) {
        l.at(-1).focus();
        u.preventDefault();
      } else if (!u.shiftKey && document.activeElement === l.at(-1)) {
        l[0].focus();
        u.preventDefault();
      }
    }
  });
  if (cleAOuvrir) {
    const u = un(`#g-${cleAOuvrir}`, t);
    u?.classList.add("flash");
    u?.scrollIntoView({
      block: "start",
    });
    un(".close", t).focus();
  } else {
    c.focus();
  }
}

/** Branche le survol et le clic sur les termes soulignés. À appeler une fois au démarrage. */
export function brancherGlossaire() {
  document.addEventListener("pointerover", (e) => {
    const n = e.target.closest?.(".terme");
    if (!!n && e.pointerType !== "touch") {
      clearTimeout(minuterieBulle);
      minuterieBulle = setTimeout(() => ouvrirBulle(n), 250);
    }
  });
  // la bulle reste ouverte le temps d'y amener le pointeur (pour la lire en grand ou la sélectionner)
  document.addEventListener("pointerout", (e) => {
    const quitte = e.target.closest?.(".terme, .bulle");
    if (!quitte || (e.relatedTarget && e.relatedTarget.closest?.(".terme, .bulle"))) return;
    clearTimeout(minuterieBulle);
    minuterieBulle = setTimeout(fermerBulle, 300);
  });
  document.addEventListener("pointerover", (e) => {
    if (e.target.closest?.(".bulle")) clearTimeout(minuterieBulle);
  });
  document.addEventListener("focusin", (e) => {
    if (e.target.classList?.contains("terme")) {
      ouvrirBulle(e.target);
    }
  });
  document.addEventListener("focusout", (e) => {
    if (e.target.classList?.contains("terme")) {
      fermerBulle();
    }
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      fermerBulle();
    }
  });
  document.addEventListener("click", (e) => {
    const n = e.target.closest?.(".terme");
    if (n) {
      ouvrirGlossaire(n.dataset.g);
    }
  });
  window.addEventListener("scroll", fermerBulle, {
    passive: true,
  });
}
