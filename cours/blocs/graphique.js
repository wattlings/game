/**
 * Le composant graphique (courbes, aires, barres, points) utilisé par les démos.
 */
import { echapper, nombre } from "./outils.js";

const SVG_NS = "http://www.w3.org/2000/svg";

const MARGES = {
  h: 22,
  d: 14,
  b: 26,
  g: 46,
};

function bornePropre(e) {
  if (e <= 0) {
    return 1;
  }
  const n = 10 ** Math.floor(Math.log10(e));
  const t = e / n;
  return [1, 1.2, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10].find((a) => t <= a) * n;
}

/** Crée un graphique dans `conteneur`. Renvoie { maj(config), detruire() }.
 * La configuration décrit l'axe x, l'axe y et les séries (courbes, aires, barres, points), plus zones, seuils et marqueurs éventuels. */
export function graphique(conteneur, configInitiale) {
  let t = configInitiale;
  conteneur.classList.add("chart");
  const a = document.createElement("div");
  a.className = "chart-legend";
  const c = document.createElement("div");
  c.style.position = "relative";
  const o = document.createElement("div");
  o.className = "tip";
  o.hidden = true;
  const d = document.createElement("details");
  d.className = "chart-table";
  // ce que lit un lecteur d'écran quand on parcourt le graphique aux flèches
  const ann = document.createElement("p");
  ann.className = "sr";
  ann.setAttribute("aria-live", "polite");
  conteneur.replaceChildren(a, c, d, ann);
  c.appendChild(o);
  let u = null;
  let l = null;
  let s = null;
  function r() {
    const v = Math.max(280, conteneur.clientWidth || 600);
    const j = t.hauteur || 240;
    const w = t.x.n;
    const $ = t.series.filter((C) => C.type === "barres");
    const T = t.series.flatMap((C) => C.valeurs.filter((S) => S != null && isFinite(S)));
    const q = t.y?.min ?? 0;
    const y = t.y?.max ?? bornePropre(Math.max(...T, ...(t.lignesH || []).map((C) => C.y), 0) * 1.05);
    const k = t.marge?.g ?? MARGES.g;
    const L = v - k - MARGES.d;
    const D = j - MARGES.h - MARGES.b;
    const de = $.length ? L / w : 0;
    const xe = (C) => ($.length ? k + de * (C + 0.5) : k + (w <= 1 ? L / 2 : (C / (w - 1)) * L));
    const pe = (C) => MARGES.h + D - ((Math.min(C, y * 1.02) - q) / (y - q)) * D;
    s = {
      X: xe,
      Y: pe,
      n: w,
      g: k,
      L,
      W: v,
      H: j,
      bande: de,
    };
    const F = [];
    for (const C of t.zones || []) {
      const S = $.length ? k + de * C.i0 : xe(C.i0);
      const U = $.length ? k + de * (C.i1 + 1) : xe(Math.min(C.i1, w - 1));
      F.push(
        `<rect x="${S}" y="${MARGES.h}" width="${Math.max(1, U - S)}" height="${D}" fill="${C.couleur || "var(--surface-2)"}" ${C.opacite ? `fill-opacity="${C.opacite}"` : ""}/>`,
      );
      if (C.texte) {
        F.push(`<text x="${S + 4}" y="${MARGES.h + 11}">${echapper(C.texte)}</text>`);
      }
    }
    const gt = t.y?.ticks ?? 4;
    F.push('<g class="grid">');
    for (let C = 0; C <= gt; C++) {
      const S = q + ((y - q) * C) / gt;
      const U = pe(S);
      F.push(`<line x1="${k}" x2="${k + L}" y1="${U}" y2="${U}"/>`);
      F.push(
        `<text x="${k - 6}" y="${U + 3}" text-anchor="end">${nombre(S, S < 10 && y <= 10 ? 1 : 0)}</text>`,
      );
    }
    F.push("</g>");
    if (t.y?.unite) {
      F.push(
        `<text x="${k - 6}" y="${MARGES.h - 11}" text-anchor="end" style="font-weight:600">${echapper(t.y.unite)}</text>`,
      );
    }
    F.push(`<line x1="${k}" x2="${k + L}" y1="${MARGES.h + D}" y2="${MARGES.h + D}" stroke="var(--line)"/>`);
    let bt = -Infinity;
    for (const C of t.x.ticks || []) {
      const S = xe(C.i);
      if (!(S - bt < (t.x.espace ?? 38))) {
        bt = S;
        F.push(
          `<line x1="${S}" x2="${S}" y1="${MARGES.h + D}" y2="${MARGES.h + D + 4}" stroke="var(--line)"/>`,
        );
        F.push(`<text x="${S}" y="${j - 8}" text-anchor="middle">${echapper(C.texte)}</text>`);
      }
    }
    $.forEach((C, S) => {
      const U = Math.max(1.5, (de - 4) / $.length - ($.length > 1 ? 2 : 0));
      C.valeurs.forEach((J, ae) => {
        if (J == null) {
          return;
        }
        const me = k + de * ae + 2 + S * (U + 2);
        const oe = pe(Math.max(J, q));
        const Ye = Math.max(0, MARGES.h + D - oe);
        const Re = Math.min(4, U / 2, Ye);
        const ca = typeof C.couleur == "function" ? C.couleur(ae, J) : C.couleur;
        F.push(
          `<path d="M${me},${oe + Ye}V${oe + Re}Q${me},${oe} ${me + Re},${oe}H${me + U - Re}Q${me + U},${oe} ${me + U},${oe + Re}V${oe + Ye}Z" fill="${ca}" ${C.opacite ? `fill-opacity="${C.opacite}"` : ""}/>`,
        );
      });
    });
    for (const C of t.series.filter((S) => S.type !== "barres" && S.type !== "points")) {
      const S = [];
      let U = [];
      C.valeurs.forEach((J, ae) => {
        if (J == null || !isFinite(J)) {
          if (U.length) {
            S.push(U);
          }
          U = [];
          return;
        }
        U.push([xe(ae), pe(J)]);
      });
      if (U.length) {
        S.push(U);
      }
      for (const J of S) {
        const ae = J.map((me, oe) => `${oe ? "L" : "M"}${me[0].toFixed(1)},${me[1].toFixed(1)}`).join("");
        if (C.type === "aire") {
          F.push(
            `<path d="${ae}L${J.at(-1)[0]},${pe(q)}L${J[0][0]},${pe(q)}Z" fill="${C.couleur}" fill-opacity="${C.opacite ?? 0.14}"/>`,
          );
        }
        F.push(
          `<path d="${ae}" fill="none" stroke="${C.couleur}" stroke-width="${C.epaisseur || 2}" stroke-linejoin="round" stroke-linecap="round" ${C.tirets ? 'stroke-dasharray="5 4"' : ""}/>`,
        );
      }
    }
    for (const C of t.series.filter((S) => S.type === "points")) {
      C.valeurs.forEach((S, U) => {
        if (S == null) {
          return;
        }
        const J = C.xs ? C.xs[U] : U;
        F.push(
          `<circle cx="${xe(J)}" cy="${pe(S)}" r="${C.rayon || 4}" fill="${C.couleur}" fill-opacity="${C.opacite ?? 0.75}" stroke="var(--surface)" stroke-width="1.5"/>`,
        );
      });
    }
    for (const C of t.lignesH || []) {
      const S = pe(C.y);
      F.push(
        `<line x1="${k}" x2="${k + L}" y1="${S}" y2="${S}" stroke="${C.couleur || "var(--ink)"}" stroke-width="${C.epaisseur || 1.5}" ${C.tirets !== false ? 'stroke-dasharray="6 4"' : ""}/>`,
      );
      if (C.texte) {
        F.push(
          `<text x="${k + L - 4}" y="${S - 5}" text-anchor="end" style="fill:${C.couleurTexte || "var(--ink)"};font-weight:600">${echapper(C.texte)}</text>`,
        );
      }
    }
    for (const C of t.marqueurs || []) {
      const S = xe(C.i);
      const U = pe(C.v);
      F.push(
        `<circle cx="${S}" cy="${U}" r="${C.r || 7}" fill="none" stroke="${C.couleur || "var(--bad)"}" stroke-width="2.5"/>`,
      );
      if (C.texte) {
        F.push(
          `<text x="${Math.min(S + 10, k + L - 4)}" y="${Math.max(U - 10, MARGES.h + 10)}" text-anchor="${S > k + L * 0.75 ? "end" : "start"}" style="fill:${C.couleur || "var(--bad)"};font-weight:700">${echapper(C.texte)}</text>`,
        );
      }
    }
    F.push(`<line class="cross" x1="0" x2="0" y1="${MARGES.h}" y2="${MARGES.h + D}" visibility="hidden"/>`);
    F.push(`<rect class="hit" x="${k}" y="${MARGES.h}" width="${L}" height="${D}"/>`);
    if (u) {
      u.remove();
    }
    u = document.createElementNS(SVG_NS, "svg");
    u.setAttribute("viewBox", `0 0 ${v} ${j}`);
    u.setAttribute("width", v);
    u.setAttribute("height", j);
    u.setAttribute("role", "img");
    u.setAttribute("tabindex", "0");
    u.setAttribute("aria-label", `${t.description || "Graphique"}.${t.pasDeSurvol ? "" : " Flèches gauche et droite pour lire les valeurs, Échap pour fermer."}`);
    u.innerHTML = F.join("");
    c.insertBefore(u, o);
    a.innerHTML =
      t.series
        .filter((C) => C.nom && !C.sansLegende)
        .map((C) => {
          const S = typeof C.couleur == "function" ? C.couleurLegende : C.couleur;
          return `<span><i class="${C.type === "barres" || C.type === "points" ? "bar" : ""} ${C.tirets ? "dash" : ""}" style="background:${S};color:${S}"></i>${echapper(C.nom)}</span>`;
        })
        .join("") + (t.legendeExtra || "");
    a.hidden = !a.innerHTML;
    const Xe = t.series.filter((C) => C.nom && C.type !== "points");
    if (t.x.n <= 60 && Xe.length && t.x.label) {
      const C = d.open;
      const S = (U, J) =>
        J == null ? "—" : (U.format || t.y?.format || ((ae) => `${nombre(ae, 1)} ${t.y?.unite || ""}`))(J);
      d.innerHTML = `<summary>Voir les données en tableau</summary><div class="table-wrap"><table><caption class="sr">Données du graphique : ${echapper(t.description || "")}</caption><thead><tr><th scope="col">${echapper(t.x.titre || "Période")}</th>${Xe.map((U) => `<th scope="col" class="r">${echapper(U.nom)}</th>`).join("")}</tr></thead><tbody>${Array.from(
        {
          length: t.x.n,
        },
        (U, J) =>
          `<tr><th scope="row">${echapper(t.x.label(J))}</th>${Xe.map((ae) => `<td class="r mono">${echapper(S(ae, ae.valeurs[J]))}</td>`).join("")}</tr>`,
      ).join("")}</tbody></table></div>`;
      d.open = C;
      d.hidden = false;
    } else if (Xe.length && t.x.label) {
      // trop de points pour un tableau (une courbe de charge) : un résumé, série par série, plus les seuils et les repères
      const C = d.open;
      const S = (U, J) => (U.format || t.y?.format || ((ae) => `${nombre(ae, 1)} ${t.y?.unite || ""}`))(J);
      const lignes = Xe.map((U) => {
        const v = U.valeurs.map((J, i) => [J, i]).filter(([J]) => J != null && isFinite(J));
        if (!v.length) return `<li>${echapper(U.nom)} : aucune valeur</li>`;
        const [mn, imn] = v.reduce((x, y) => (y[0] < x[0] ? y : x));
        const [mx, imx] = v.reduce((x, y) => (y[0] > x[0] ? y : x));
        const moy = v.reduce((x, [J]) => x + J, 0) / v.length;
        return `<li><b>${echapper(U.nom)}</b> : ${v.length} valeurs, de ${echapper(S(U, mn))} (${echapper(t.x.label(imn))}) à ${echapper(S(U, mx))} (${echapper(t.x.label(imx))}), moyenne ${echapper(S(U, moy))}.</li>`;
      });
      for (const L of t.lignesH || []) if (L.texte) lignes.push(`<li>Ligne repère : ${echapper(L.texte)}${/\d/.test(L.texte) ? "" : ` (${echapper(S({}, L.y))})`}.</li>`);
      for (const M of t.marqueurs || []) if (M.texte) lignes.push(`<li>Point signalé : ${echapper(M.texte)}${t.x.label ? `, ${echapper(t.x.label(M.i))}` : ""}.</li>`);
      // une zone sans texte qui prolonge la précédente (le dimanche après le samedi) la complète
      const zs = [];
      for (const Z of t.zones || []) {
        const prec = zs[zs.length - 1];
        if (!Z.texte && prec && Z.i0 <= prec.i1 + 1) prec.i1 = Math.max(prec.i1, Z.i1);
        else if (Z.texte) zs.push({ texte: Z.texte, i0: Z.i0, i1: Z.i1 });
      }
      for (const Z of zs) lignes.push(`<li>Zone : ${echapper(Z.texte)}, de ${echapper(t.x.label(Z.i0))} à ${echapper(t.x.label(Math.min(Z.i1, t.x.n - 1)))}.</li>`);
      d.innerHTML = `<summary>Résumé des données</summary><ul class="chart-resume">${lignes.join("")}</ul>`;
      d.open = C;
      d.hidden = false;
    } else {
      d.hidden = true;
    }
    f();
  }
  function i(v, auClavier = false) {
    if (!s || t.x.n === 0) {
      return;
    }
    v = Math.max(0, Math.min(t.x.n - 1, v));
    l = v;
    const j = s.X(v);
    const w = u.querySelector(".cross");
    w.setAttribute("x1", j);
    w.setAttribute("x2", j);
    w.setAttribute("visibility", "visible");
    const $ = t.series
      .filter((y) => y.nom && y.type !== "points")
      .map((y) => {
        const k = y.valeurs[v];
        return `<div><span class="sw" style="background:${typeof y.couleur == "function" ? y.couleur(v, k) : y.couleur}"></span>${echapper(y.nom)} : <b>${k == null ? "—" : (y.format || t.y?.format || ((D) => `${nombre(D, 1)} ${t.y?.unite || ""}`))(k)}</b></div>`;
      })
      .join("");
    const T = t.tooltipExtra ? t.tooltipExtra(v) : "";
    o.innerHTML = `<div>${echapper(t.x.label ? t.x.label(v) : v)}</div>${$}${T}`;
    o.hidden = false;
    const q = o.offsetWidth;
    o.style.left = `${Math.min(Math.max(j, q / 2 + 2), s.W - q / 2 - 2)}px`;
    o.style.top = `${MARGES.h + 6}px`;
    o.style.transform = "translate(-50%, 0)";
    if (auClavier) ann.textContent = [...o.children].map((x) => x.textContent.trim()).filter(Boolean).join(" ; ");
    t.onSurvol?.(v);
  }
  function p() {
    o.hidden = true;
    u?.querySelector(".cross")?.setAttribute("visibility", "hidden");
  }
  function m(v) {
    const j = u.getBoundingClientRect();
    const w = ((v.clientX - j.left) / j.width) * s.W;
    if (s.bande) {
      return Math.floor((w - s.g) / s.bande);
    } else {
      return Math.round(((w - s.g) / s.L) * (s.n - 1));
    }
  }
  function f() {
    if (!t.pasDeSurvol) {
      u.addEventListener("pointermove", (v) => i(m(v)));
      u.addEventListener("pointerleave", p);
      u.addEventListener("click", (v) => t.onClic?.(m(v)));
      u.addEventListener("blur", p);
      u.addEventListener("keydown", (v) => {
        const j = v.shiftKey ? Math.max(1, Math.round(t.x.n / 20)) : 1;
        if (v.key === "ArrowRight") {
          i((l ?? -1) + j, true);
          v.preventDefault();
        }
        if (v.key === "ArrowLeft") {
          i((l ?? 1) - j, true);
          v.preventDefault();
        }
        if (v.key === "Escape" && !o.hidden) {
          p();
          v.stopPropagation();
        }
        if (v.key === "Enter" && l != null) {
          t.onClic?.(l);
        }
      });
    }
  }
  r();
  let h = conteneur.clientWidth;
  const x = new ResizeObserver(() => {
    if (Math.abs(conteneur.clientWidth - h) > 4) {
      h = conteneur.clientWidth;
      r();
    }
  });
  x.observe(conteneur);
  return {
    maj(v) {
      t = {
        ...t,
        ...v,
      };
      r();
      if (!o.hidden && l != null) {
        i(l);
      }
    },
    detruire() {
      x.disconnect();
    },
  };
}
