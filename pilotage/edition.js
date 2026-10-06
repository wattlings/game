/**
 * Pilotage · edition.js
 * Modifier les textes du jeu depuis la page, puis récupérer les fichiers à déposer sur GitHub.
 *
 * Rien n'est envoyé nulle part : les modifications restent dans ce navigateur (clé « pilotage-modifs-v1 ») jusqu'au
 * téléchargement. Un fichier rendu est le fichier du jeu, où seuls les textes modifiés ont changé, au caractère près ;
 * il est relu avant d'être proposé, pour être sûr que le jeu saura encore le lire.
 */
import { parse, parseExpressionAt } from "./tiers/acorn.mjs";

const CLE = "pilotage-modifs-v1";
const SEP = new RegExp("[" + String.fromCharCode(0x2028, 0x2029) + "]", "g"); // deux caractères de fin de ligne qu'une chaîne ne peut pas contenir tels quels
const cleDe = (T) => T.f + ":" + T.a;

/** fichiers : Map chemin → { source }. */
export function creerEdition(fichiers) {
  /** clé → { f, a, b, orig, lit, avant, apres, exprs, t, etat } */
  const M = new Map();
  const ecouteurs = [];
  let enLigne = 0; // les modifications retrouvées telles quelles dans les fichiers en ligne : elles sont arrivées
  const prevenir = () => ecouteurs.forEach((f) => f());

  // ---- garder d'une visite à l'autre
  const garder = () => { try { localStorage.setItem(CLE, JSON.stringify([...M.values()])); } catch { /* pas de stockage : on continue sans */ } };
  (function relire() {
    let L = [];
    try { L = JSON.parse(localStorage.getItem(CLE) || "[]"); } catch { L = []; }
    if (!Array.isArray(L)) return;
    L.forEach((m) => {
      const F = fichiers.get(m.f);
      if (!F || typeof m.orig !== "string" || typeof m.lit !== "string") return;
      const s = F.source;
      if (s.slice(m.a, m.b) === m.orig) m.etat = "ok";
      else if (s.slice(m.a, m.a + m.lit.length) === m.lit) { enLigne++; return; }
      else {
        const i = s.indexOf(m.orig), unique = i >= 0 && s.indexOf(m.orig, i + 1) < 0;
        if (unique) { m.a = i; m.b = i + m.orig.length; m.etat = "ok"; }
        else if (i < 0 && s.includes(m.lit)) { enLigne++; return; }
        else m.etat = "perime";
      }
      M.set(m.etat === "ok" ? m.f + ":" + m.a : "perime:" + m.f + ":" + m.a + ":" + m.t, m);
    });
    garder();
  })();

  // ---- du texte saisi au morceau de fichier
  /** Ce qu'on donne à modifier : le texte tel qu'il s'affiche ; pour un texte à morceaux calculés, tel qu'il est écrit. */
  const saisieDe = (T) => { const m = M.get(cleDe(T)); return m ? m.apres : String(T.v); };

  function coder(T, saisie) {
    if (T.q === "`" && T.calc) {
      const lit = "`" + saisie + "`";
      let n;
      try { n = parseExpressionAt(lit, 0, { ecmaVersion: "latest" }); } catch { return { erreur: "Ce texte n'est plus lisible par le jeu. Vérifie qu'il ne contient pas d'accent grave (`) et que chaque ${…} est resté entier." }; }
      if (n.type !== "TemplateLiteral" || n.end !== lit.length) return { erreur: "Ce texte n'est plus lisible par le jeu. Vérifie qu'il ne contient pas d'accent grave (`)." };
      const avant = (T.exprs || []).map((x) => x.trim()).sort(), apres = n.expressions.map((e) => lit.slice(e.start, e.end).trim()).sort();
      if (avant.length !== apres.length || avant.some((x, i) => x !== apres[i])) return { erreur: "Les morceaux calculés ${…} doivent rester exactement les mêmes (tu peux les déplacer dans la phrase, pas les changer). Attendus : " + (T.exprs || []).map((x) => "${" + x + "}").join("  ") };
      return { lit, exprs: n.expressions.map((e) => lit.slice(e.start, e.end)) };
    }
    const q = T.q;
    const lit = q === "`" ? "`" + saisie.replace(/\\/g, "\\\\").replace(/`/g, "\\`").replace(/\$\{/g, "\\${") + "`"
      : q + saisie.replace(/\\/g, "\\\\").split(q).join("\\" + q).replace(/\r?\n/g, "\\n").replace(SEP, (c) => "\\u" + c.charCodeAt(0).toString(16)) + q;
    // contrôle : relu par le jeu, ce morceau redonne bien le texte saisi
    try {
      const n = parseExpressionAt(lit, 0, { ecmaVersion: "latest" });
      const relu = n.type === "Literal" ? n.value : n.type === "TemplateLiteral" && !n.expressions.length ? n.quasis[0].value.cooked : null;
      if (n.end !== lit.length || relu !== saisie.replace(/\r\n/g, "\n")) return { erreur: "Ce texte contient un caractère que la page ne sait pas écrire dans le fichier." };
    } catch { return { erreur: "Ce texte contient un caractère que la page ne sait pas écrire dans le fichier." }; }
    return { lit };
  }

  function poser(T, saisie) {
    const F = fichiers.get(T.f);
    if (!F) return { erreur: "Fichier introuvable : " + T.f };
    const orig = F.source.slice(T.a, T.b), k = cleDe(T);
    if (saisie === String(T.v)) { M.delete(k); garder(); prevenir(); return { ok: true, retire: true }; }
    if (!saisie.trim()) return { erreur: "Un texte vide ferait un trou dans le jeu. Pour ne rien dire, mets au moins un mot." };
    const gene = [...M.values()].find((m) => m.etat === "ok" && m.f === T.f && cleDe(m) !== k && m.a < T.b && T.a < m.b);
    if (gene) return { erreur: "Ce texte fait partie d'un autre texte déjà modifié (« " + gene.apres.slice(0, 50) + "… »). Modifie l'un ou l'autre, pas les deux." };
    const c = coder(T, saisie);
    if (c.erreur) return c;
    M.set(k, { f: T.f, a: T.a, b: T.b, orig, lit: c.lit, avant: String(T.v), apres: saisie, exprs: c.exprs, t: Date.now(), etat: "ok" });
    garder(); prevenir();
    return { ok: true };
  }
  function retirer(k) { M.delete(k); garder(); prevenir(); }
  function toutRetirer() { M.clear(); garder(); prevenir(); }

  // ---- les fichiers à déposer
  function fichiersModifies() {
    const parFichier = new Map();
    [...M.values()].filter((m) => m.etat === "ok").forEach((m) => { if (!parFichier.has(m.f)) parFichier.set(m.f, []); parFichier.get(m.f).push(m); });
    return [...parFichier.entries()].sort((a, b) => (a[0] < b[0] ? -1 : 1)).map(([chemin, L]) => {
      let s = fichiers.get(chemin).source, erreur = null;
      L.sort((x, y) => y.a - x.a).forEach((m) => { if (s.slice(m.a, m.b) !== m.orig) erreur = "le fichier en ligne a changé depuis la modification"; else s = s.slice(0, m.a) + m.lit + s.slice(m.b); });
      if (!erreur) { try { parse(s, { ecmaVersion: "latest", sourceType: "script" }); } catch (e) { erreur = "le fichier modifié ne serait plus lisible par le jeu (" + e.message + ")"; } }
      return { chemin, contenu: s, modifs: L.slice().sort((x, y) => x.a - y.a), erreur };
    });
  }
  function journal(F) {
    const d = new Date().toLocaleString("fr-FR");
    return ["Wattlings · textes modifiés depuis la page de pilotage", "Le " + d, "", "Ces fichiers remplacent ceux du même nom dans le dépôt GitHub, au même endroit.", ""]
      .concat(F.flatMap((f) => [f.chemin, ...f.modifs.flatMap((m) => ["  avant : " + m.avant.replace(/\s+/g, " "), "  après : " + m.apres.replace(/\s+/g, " "), ""])])).join("\n");
  }
  function archive() {
    const F = fichiersModifies().filter((f) => !f.erreur);
    return zip([...F.map((f) => ({ nom: f.chemin, texte: f.contenu })), { nom: "MODIFICATIONS.txt", texte: journal(F) }]);
  }

  return {
    lire: (T) => { const m = M.get(cleDe(T)); return m && m.etat === "ok" ? m : null; },
    saisieDe, poser, retirer, toutRetirer, fichiersModifies, archive,
    /** Contrôle : ce texte, réécrit tel quel, redonnerait-il le même fichier lisible ? (null si oui, sinon la raison) */
    controler: (T) => { const c = coder(T, String(T.v)); if (c.erreur) return c.erreur; const F = fichiers.get(T.f); return T.calc && c.lit !== F.source.slice(T.a, T.b) ? "le texte calculé ne se réécrit pas à l'identique" : null; },
    liste: () => [...M.entries()].map(([k, m]) => Object.assign({ k }, m)).sort((x, y) => (x.f === y.f ? x.a - y.a : x.f < y.f ? -1 : 1)),
    get nombre() { return [...M.values()].filter((m) => m.etat === "ok").length; },
    get perimees() { return [...M.values()].filter((m) => m.etat !== "ok").length; },
    get arrivees() { return enLigne; },
    surChangement: (f) => ecouteurs.push(f),
  };
}

// ---------------------------------------------------------------- une archive .zip, sans compression
const TABLE = (() => { const t = new Uint32Array(256); for (let n = 0; n < 256; n++) { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; t[n] = c >>> 0; } return t; })();
const crc32 = (o) => { let c = 0xffffffff; for (let i = 0; i < o.length; i++) c = TABLE[(c ^ o[i]) & 0xff] ^ (c >>> 8); return (c ^ 0xffffffff) >>> 0; };

/** entrees : [{ nom, texte }] → Blob (zip « stocké » : les fichiers y sont tels quels). */
export function zip(entrees) {
  const enc = new TextEncoder(), morceaux = [], centre = [];
  const d = new Date(), heure = (d.getHours() << 11) | (d.getMinutes() << 5) | (d.getSeconds() >> 1), jour = ((d.getFullYear() - 1980) << 9) | ((d.getMonth() + 1) << 5) | d.getDate();
  let pos = 0;
  entrees.forEach(({ nom, texte }) => {
    const n = enc.encode(nom), o = enc.encode(texte), crc = crc32(o);
    const e = new DataView(new ArrayBuffer(30));
    e.setUint32(0, 0x04034b50, true); e.setUint16(4, 20, true); e.setUint16(6, 0x0800, true); e.setUint16(8, 0, true); e.setUint16(10, heure, true); e.setUint16(12, jour, true);
    e.setUint32(14, crc, true); e.setUint32(18, o.length, true); e.setUint32(22, o.length, true); e.setUint16(26, n.length, true); e.setUint16(28, 0, true);
    const c = new DataView(new ArrayBuffer(46));
    c.setUint32(0, 0x02014b50, true); c.setUint16(4, 20, true); c.setUint16(6, 20, true); c.setUint16(8, 0x0800, true); c.setUint16(10, 0, true); c.setUint16(12, heure, true); c.setUint16(14, jour, true);
    c.setUint32(16, crc, true); c.setUint32(20, o.length, true); c.setUint32(24, o.length, true); c.setUint16(28, n.length, true); c.setUint32(42, pos, true);
    morceaux.push(e.buffer, n, o); centre.push(c.buffer, n);
    pos += 30 + n.length + o.length;
  });
  const tailleCentre = centre.reduce((s, x) => s + x.byteLength, 0);
  const fin = new DataView(new ArrayBuffer(22));
  fin.setUint32(0, 0x06054b50, true); fin.setUint16(8, entrees.length, true); fin.setUint16(10, entrees.length, true); fin.setUint32(12, tailleCentre, true); fin.setUint32(16, pos, true);
  return new Blob([...morceaux, ...centre, fin.buffer], { type: "application/zip" });
}
