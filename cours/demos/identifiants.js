/**
 * Démo « identifiants » (niveaux Comprendre / Approfondir).
 */
import { icone } from "../blocs/icones.js";
import { echapper, texteRiche, tous, un } from "../blocs/outils.js";

const EXEMPLES = [
  "30001234567890",
  "3000 1234 5678 90",
  "3000123456789",
  "GI123456",
  "21456789O12345",
  "300012345678901",
];

function verifierIdentifiant(saisie) {
  const n = saisie.trim();
  const t = n.replace(/[\s.-]/g, "");
  const a = [];
  if (!n) {
    return {
      ok: false,
      pbs: ["Identifiant vide."],
    };
  }
  if (/^GI\d{6}$/i.test(t)) {
    return {
      ok: true,
      type: "Ancien format de PCE (GI + 6 chiffres)",
      normalise: t.toUpperCase(),
      pbs: a,
    };
  }
  if (t !== n) {
    a.push(`Des espaces ou séparateurs ont été retirés : « ${t} ».`);
  }
  if (/[^0-9]/.test(t)) {
    a.push(
      `Caractère non numérique : « ${t.match(/[^0-9]/)[0]} »${/O/i.test(t) ? " (la lettre O à la place du chiffre 0 ?)" : ""}.`,
    );
  }
  if (t.length !== 14) {
    a.push(`${t.length} caractères au lieu de 14.`);
  }
  const c = /^\d{14}$/.test(t);
  return {
    ok: c,
    type: c ? "14 chiffres : format de PDL (PRM) ou de PCE" : null,
    normalise: t,
    pbs: a,
  };
}

export function demoIdentifiants(zone, options) {
  zone.innerHTML = `
    <div class="saisie field"><label for="id-in">Identifiant à vérifier</label><input id="id-in" type="text" value="30001234567890" autocomplete="off" spellcheck="false" style="width:220px"></div>
    <div class="row" style="gap:6px"><span class="muted" style="font-size:var(--t-s)">Essaie :</span>${EXEMPLES.map((c) => `<button type="button" class="chip" data-x="${echapper(c)}">${echapper(c)}</button>`).join("")}</div>
    <div id="id-res" aria-live="polite"></div>`;
  const t = un("#id-in", zone);
  function a() {
    const c = verifierIdentifiant(t.value);
    un("#id-res", zone).innerHTML =
      `<div class="feedback ${c.ok ? "ok" : "bad"}">${icone(c.ok ? "ok" : "ko")}<div><b>${c.ok ? "Format valide." : "Format invalide."}</b> ${c.type ? echapper(c.type) + "." : ""}
      ${c.pbs.length ? `<ul style="margin:6px 0 0;padding-left:1.1em">${c.pbs.map((o) => `<li>${echapper(o)}</li>`).join("")}</ul>` : ""}
      ${c.ok ? `<p style="margin-top:6px">${texteRiche("Le format seul ne dit pas si c’est un {{pdl}} ou un {{pce}}, ni si le point existe : seul le distributeur peut le confirmer. On stocke donc toujours l’énergie avec l’identifiant.")}</p>` : ""}</div></div>`;
  }
  t.addEventListener("input", () => {
    options.toucher();
    a();
  });
  tous("[data-x]", zone).forEach((c) =>
    c.addEventListener("click", () => {
      t.value = c.dataset.x;
      options.toucher();
      a();
    }),
  );
  a();
}
