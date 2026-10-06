/**
 * Pilotage · lecture.js
 * Lit les fichiers du jeu SANS les exécuter : chaque fichier est analysé (avec acorn, dans tiers/), puis on en tire
 *  - ses données (FICHES, SRC, ARENE_2, voyDeclarer(…)…), sous forme de valeurs ordinaires ;
 *  - ses interactions (dialogues, questions, choix, formulaires, secrets…), dans l'ordre du fichier ;
 *  - ses autres textes, pour que rien de ce que lit le joueur ne manque.
 * Chaque texte garde sa place exacte dans son fichier ({ f, a, b }) : c'est ce qui permet de le modifier depuis la page.
 *
 * Un texte : { _t:1, v, f, a, b, q, calc?, exprs? }
 *   v : le texte ; f : le fichier ; a, b : début et fin dans le fichier ; q : le guillemet qui l'entoure (' " ou `) ;
 *   calc : le texte contient des morceaux calculés par le jeu (${…}), listés dans exprs.
 */
import { parse } from "./tiers/acorn.mjs";

export const estTexte = (v) => !!v && v._t === 1;

/* les appels du jeu qui affichent quelque chose au joueur */
const APPELS = new Set(["say", "voyParler", "secret", "egg", "info", "choice", "multi", "form", "order", "runSteps", "voyEtapes", "toast", "Q",
  "voyDire", "voySource", "voyAnimateur", "voyAtelier", "voyAtelierEtapes", "voyDefi", "signature"]);

/** Un fichier analysé : { chemin, source, ast, donnees, appels, items, erreur }. */
export function lireFichier(chemin, source) {
  // compte : combien de fois chaque texte court est écrit dans le fichier ; compares : les textes que le code compare (==='Piloter')
  const F = { chemin, source, donnees: {}, appels: [], items: [], locaux: [], pris: new Set(), compte: new Map(), compares: new Set() };
  try {
    F.ast = parse(source, { ecmaVersion: "latest", sourceType: "script" });
  } catch (e) {
    F.erreur = e.message;
    return F;
  }
  const src = (n) => source.slice(n.start, n.end);
  const court = (t, k = 70) => (t.length > k ? t.slice(0, k - 1) + "…" : t);

  // ---------------------------------------------------------------- textes
  function texte(n) {
    let T;
    if (n.type === "Literal") T = { _t: 1, v: n.value, f: chemin, a: n.start, b: n.end, q: source[n.start] };
    else {
      const calc = n.expressions.length > 0;
      T = { _t: 1, v: calc ? source.slice(n.start + 1, n.end - 1) : n.quasis[0].value.cooked, f: chemin, a: n.start, b: n.end, q: "`" };
      if (calc) { T.calc = true; T.exprs = n.expressions.map(src); }
    }
    F.pris.add(n.start);
    return T;
  }

  // ---------------------------------------------------------------- valeurs (évaluation sans exécution)
  const retour = (fn) => {
    if (fn.body.type !== "BlockStatement") return fn.body;
    const r = fn.body.body.filter((s) => s.type === "ReturnStatement");
    return fn.body.body.length && fn.body.body.at(-1).type === "ReturnStatement" && r.length === 1 ? r[0].argument : null;
  };
  const cle = (p) => (p.computed ? null : p.key.type === "Identifier" ? p.key.name : p.key.type === "Literal" ? String(p.key.value) : null);
  const aplatir = (n) => (n.type === "BinaryExpression" && n.operator === "+" ? [...aplatir(n.left), ...aplatir(n.right)] : [n]);

  function val(n) {
    if (!n) return undefined;
    switch (n.type) {
      case "Literal":
        return typeof n.value === "string" ? texte(n) : n.regex ? { _x: src(n) } : n.value;
      case "TemplateLiteral":
        return texte(n);
      case "ArrayExpression":
        return n.elements.map((e) => (!e ? null : e.type === "SpreadElement" ? { _x: src(e), etale: val(e.argument) } : val(e)));
      case "ObjectExpression": {
        const o = {};
        for (const p of n.properties) {
          if (p.type !== "Property") { (o._reste ||= []).push(court(src(p))); continue; }
          const k = cle(p);
          if (k === null) continue;
          if (p.kind === "get") { const r = retour(p.value); o[k] = r ? val(r) : { _x: court(src(p.value)) }; }
          else o[k] = val(p.value);
        }
        return o;
      }
      case "UnaryExpression":
        if (n.operator === "-" && n.argument.type === "Literal") return -n.argument.value;
        if (n.operator === "!" && n.argument.type === "Literal") return !n.argument.value;
        return { _x: court(src(n)) };
      case "ConditionalExpression":
        return { _si: court(src(n.test), 90), oui: val(n.consequent), non: val(n.alternate) };
      case "BinaryExpression": {
        if (n.operator === "+") {
          const parts = aplatir(n).map(val);
          if (parts.some(estTexte)) return { _cat: parts };
        }
        return { _x: court(src(n)) };
      }
      case "LogicalExpression": {
        // a||b, a&&b : on garde le côté qui porte du texte
        const g = val(n.left), d = val(n.right);
        return contientTexte(d) || contientTexte(g) ? { _ou: [g, d], op: n.operator } : { _x: court(src(n)) };
      }
      case "CallExpression": {
        const nom = n.callee.type === "Identifier" ? n.callee.name : n.callee.type === "MemberExpression" ? court(src(n.callee), 60) : null;
        if (nom === "Q" && n.arguments.length >= 3) {
          const A = n.arguments.map(val), rep = [{ t: A[1], ok: true, fb: A[2] }];
          for (let i = 3; i < A.length; i += 2) rep.push({ t: A[i], ok: false, fb: A[i + 1] });
          return { _q: 1, q: A[0], rep, a: n.start };
        }
        return { _appel: nom, args: n.arguments.map(val), a: n.start, b: n.end };
      }
      case "AssignmentExpression":
        return val(n.right);
      case "ArrowFunctionExpression":
      case "FunctionExpression": {
        const r = retour(n);
        return { _f: 1, n, retour: r && r.type !== "CallExpression" ? val(r) : undefined };
      }
      default:
        return { _x: court(src(n)) };
    }
  }
  function contientTexte(v, vu = 0) {
    if (!v || typeof v !== "object" || vu > 6) return false;
    if (v._t) return true;
    if (v._f) return contientTexte(v.retour, vu + 1);
    return (Array.isArray(v) ? v : Object.values(v)).some((x) => contientTexte(x, vu + 1));
  }
  /** Les fonctions enfouies dans une valeur (act:()=>…, objets(o){…}) : leur corps contient d'autres interactions. */
  function fonctionsDe(v, out = [], vu = 0) {
    if (!v || typeof v !== "object" || vu > 12) return out;
    if (v._f) { out.push(v.n); return out; }
    if (v._t) return out;
    (Array.isArray(v) ? v : Object.values(v)).forEach((x) => fonctionsDe(x, out, vu + 1));
    return out;
  }

  // ---------------------------------------------------------------- interactions
  /** Une variable locale d'une fonction (const L0=[…]) : si on la connaît, on la remplace par sa valeur. */
  function local(v, ctx) {
    const L = v && typeof v._x === "string" && ctx.locaux && ctx.locaux[v._x];
    if (!L) return v;
    L.servi = true;
    return L.v;
  }
  /** Les lignes d'un dialogue : tableau de textes ou de { w: qui, t: texte }. */
  function lignes(v, qui, ctx = {}) {
    v = local(v, ctx);
    if (estTexte(v)) return [{ qui, t: v }];
    if (v && v._appel && /\.map$/.test(v._appel) && v.args[0]?._f) {
      // D.cle.map(t=>({w:'Nom',t})) : les répliques sont ailleurs (ref), le nom est ici
      const r = v.args[0].retour;
      const ref = v._appel.replace(/\.map$/, ""), L = ctx.locaux && ctx.locaux[ref];
      if (L && Array.isArray(L.v)) { L.servi = true; return lignes(L.v, (r && r.w) || qui, ctx); }
      return [{ qui: (r && r.w) || qui, ref }];
    }
    if (v && v._cat) return [{ qui, t: v }];
    if (v && v._si) return [{ qui, si: v._si, oui: lignes(v.oui, qui, ctx), non: lignes(v.non, qui, ctx) }];
    if (!Array.isArray(v)) return v === undefined ? [] : [{ qui, calc: v._x || v._appel || "(calculé)" }];
    return v.flatMap((e) => {
      if (e === null) return [];
      e = local(e, ctx);
      if (Array.isArray(e)) return lignes(e, qui, ctx);
      if (estTexte(e) || e._cat) return [{ qui, t: e }];
      if (e._si) return [{ qui, si: e._si, oui: lignes(e.oui, qui, ctx), non: lignes(e.non, qui, ctx) }];
      if (e._x !== undefined) return e.etale ? lignes(e.etale, qui, ctx) : [{ qui, calc: e._x }];
      if (e._appel) return lignes(e, qui, ctx);
      if (typeof e === "object" && "t" in e) return [{ qui: (e.w !== undefined ? local(e.w, ctx) : undefined) ?? qui, t: local(e.t, ctx) }];
      return [{ qui, calc: "(calculé)" }];
    });
  }
  const reponses = (opts) => (Array.isArray(opts) ? opts.map((o) => (Array.isArray(o) ? { t: o[0], ok: o[1] === 1 || o[1] === true ? true : o[1] === 0 || o[1] === false ? false : o[1], fb: o[2] } : { calc: o?._x || "(calculé)" })) : [{ calc: opts?._x || "(calculé)" }]);

  function brique(v) {
    // une brique de panneau : info(…), choice({…}), multi({…}), form({…}), order({…}), ou autre chose (calculé)
    if (v && v._q) return { genre: "question", q: v.q, rep: v.rep };
    if (!v || !v._appel) return { genre: "calcule", code: v?._x || "(calculé)" };
    const o = v.args[0] || {};
    switch (v._appel) {
      case "info": return { genre: "info", html: v.args[0], bouton: v.args[1] };
      case "choice": return { genre: "choix", titre: o.title, ctx: o.ctx, q: o.q, rep: reponses(o.opts) };
      case "multi": return { genre: "cases", titre: o.title, ctx: o.ctx, q: o.q, rep: reponses(o.items), bravo: o.okMsg };
      case "form": return { genre: "formulaire", titre: o.title, ctx: o.ctx, bravo: o.okMsg, champs: Array.isArray(o.fields) ? o.fields.map((c) => (c && !c._x ? { label: c.label, rep: reponses(c.opts) } : { calc: c?._x })) : [] };
      case "order": return { genre: "ordre", titre: o.title, ctx: o.ctx, q: o.q, etapes: Array.isArray(o.items) ? o.items : [], bravo: o.okMsg };
      case "signature": return { genre: "signature" };
      default: return { genre: "calcule", code: v._appel + "(…)" };
    }
  }
  function interpreter(v, ctx) {
    const A = v.args;
    let it;
    switch (v._appel) {
      case "say": case "voyParler": it = { genre: "dialogue", lignes: lignes(A[0], ctx.qui, ctx) }; break;
      case "secret": case "egg": it = { genre: "secret", cle: estTexte(A[0]) ? A[0].v : null, oeuf: v._appel === "egg", lignes: lignes(A[1], ctx.qui, ctx) }; break;
      case "voyDire": it = { genre: "dialogue", lignes: lignes(A[1], estTexte(A[0]) ? A[0] : ctx.qui, ctx) }; break;
      case "voySource": it = { genre: "source", site: A[0]?.v, info: A[1]?.v ?? A[1]?._x, lignes: lignes(A[3], estTexte(A[2]) ? A[2] : ctx.qui, ctx), ensuite: lignes(A[4], estTexte(A[2]) ? A[2] : ctx.qui, ctx) }; break;
      case "voyAnimateur": it = { genre: "source", site: A[0]?.v, info: A[1]?.v, lignes: lignes(A[3], A[2], ctx), ensuite: lignes(A[4], A[2], ctx), atelier: A[5]?._x }; break;
      case "toast": it = { genre: "toast", t: A[0] }; break;
      case "runSteps": case "voyEtapes": it = { genre: "suite", titre: A[0], etapes: Array.isArray(A[1]) ? A[1].flatMap((e) => (e && e.etale ? [{ genre: "calcule", code: e._x }] : [brique(e)])) : [{ genre: "calcule", code: A[1]?._x || "(calculé)" }] }; break;
      case "voyAtelier": it = { genre: "atelier", titre: A[0], reglages: local(A[1], ctx) }; break;
      case "voyAtelierEtapes": it = { genre: "atelier", reglages: local(A[0], ctx) }; break;
      case "voyDefi": {
        const d = A[1] && A[1]._ou ? A[1]._ou.find((x) => x && !x._x && typeof x === "object") || A[1] : A[1];
        const e = d && d.epreuves;
        it = { genre: "defi", site: A[0]?.v, d, epreuves: Array.isArray(e) ? e.map(brique) : e && e._appel === "voyAtelierEtapes" ? [{ genre: "atelier", reglages: local(e.args[0], ctx) }] : [] };
        break;
      }
      case "Q": it = null; break;
      default: it = Object.assign(brique(v));
    }
    if (!it) return null;
    it.suite = fonctionsDe(A).flatMap((fn) => scruter(fn.body, ctx));
    return it;
  }

  /** Parcourt un morceau de code et relève, dans l'ordre, ce qu'il affiche au joueur. */
  function scruter(n, ctx, out = []) {
    if (!n || typeof n.type !== "string") return out;
    if (n.type === "CallExpression") {
      const nom = n.callee.type === "Identifier" ? n.callee.name : null;
      if (nom && APPELS.has(nom)) {
        const v = val(n);
        const it = v._q ? { genre: "question", q: v.q, rep: v.rep, suite: [] } : interpreter(v, ctx);
        if (it) { out.push(Object.assign(it, { f: chemin, pos: n.start, dans: ctx.dans, qui: it.qui ?? ctx.qui, si: ctx.si })); return out; }
      }
      // gens(x, y, 'Nom', …) : les personnages des sites de voyage
      if (nom === "gens" && n.arguments[2]?.type === "Literal") ctx = Object.assign({}, ctx, { qui: texte(n.arguments[2]) });
    }
    if (n.type === "VariableDeclaration" && ctx.locaux) {
      // const L0=[…] dans une fonction : on retient la valeur, les appels qui suivent s'en servent
      for (const d of n.declarations) {
        if (d.id.type === "Identifier" && d.init && ["ArrayExpression", "ObjectExpression", "Literal", "TemplateLiteral", "ConditionalExpression", "BinaryExpression"].includes(d.init.type)) {
          const v = val(d.init);
          if (contientTexte(v)) { const L = { v, nom: d.id.name, pos: d.start, dans: ctx.dans, si: ctx.si }; ctx.locaux[d.id.name] = L; F.locaux.push(L); }
          fonctionsDe(v).forEach((fn) => scruter(fn.body, ctx, out));
        } else if (d.init) scruter(d.init, ctx, out);
      }
      return out;
    }
    if (n.type === "ObjectExpression") {
      const w = n.properties.find((p) => p.type === "Property" && cle(p) === "who" && (p.value.type === "Literal" && typeof p.value.value === "string"));
      if (w) ctx = Object.assign({}, ctx, { qui: texte(w.value) });
    }
    if (n.type === "IfStatement") {
      const si = court(src(n.test), 80);
      scruter(n.consequent, Object.assign({}, ctx, { si }), out);
      if (n.alternate) scruter(n.alternate, Object.assign({}, ctx, { si: "sinon (" + si + ")" }), out);
      scruter(n.test, ctx, out);
      return out;
    }
    for (const k in n) {
      if (k === "type" || k === "start" || k === "end") continue;
      const c = n[k];
      if (Array.isArray(c)) c.forEach((x) => x && typeof x.type === "string" && scruter(x, ctx, out));
      else if (c && typeof c.type === "string") scruter(c, ctx, out);
    }
    return out;
  }

  // ---------------------------------------------------------------- le fichier, de haut en bas
  const DONNEE = new Set(["ObjectExpression", "ArrayExpression", "Literal", "TemplateLiteral", "CallExpression"]);
  const garder = (nom, n) => {
    const v = val(n);
    F.donnees[nom] = v;
    fonctionsDe(v).forEach((fn) => scruter(fn.body, { dans: nom, locaux: {} }, F.items));
    return v;
  };
  for (const s of F.ast.body) {
    if (s.type === "FunctionDeclaration") scruter(s.body, { dans: s.id.name, locaux: {} }, F.items);
    else if (s.type === "VariableDeclaration") {
      for (const d of s.declarations) {
        if (!d.init || d.id.type !== "Identifier") { if (d.init) scruter(d.init, { dans: "(fichier)" }, F.items); continue; }
        if (DONNEE.has(d.init.type)) garder(d.id.name, d.init);
        else scruter(d.init, { dans: d.id.name, locaux: {} }, F.items);
      }
    } else if (s.type === "ExpressionStatement" && s.expression.type === "AssignmentExpression" && s.expression.left.type === "MemberExpression" && DONNEE.has(s.expression.right.type)) {
      garder(src(s.expression.left), s.expression.right);
    } else if (s.type === "ExpressionStatement" && s.expression.type === "CallExpression" && s.expression.callee.type === "Identifier" && /^voy(Declarer|Carte)$/.test(s.expression.callee.name)) {
      const v = val(s.expression);
      F.appels.push(v);
      fonctionsDe(v).forEach((fn) => scruter(fn.body, { dans: v._appel + "(" + (v.args[0]?.v || "") + ")", locaux: {} }, F.items));
    } else scruter(s, { dans: "(fichier)", locaux: {} }, F.items);
  }
  // une variable locale pleine de textes que personne n'a affichée : on la garde quand même
  F.locaux.filter((L) => !L.servi && textesDe(L.v).some((t) => estProse(t.v))).forEach((L) => F.items.push({ genre: "donnees", nom: L.nom, valeur: L.v, f: chemin, pos: L.pos, dans: L.dans, si: L.si, suite: [] }));
  F.items.sort((a, b) => a.pos - b.pos);

  // ---------------------------------------------------------------- les textes que rien n'a relevés
  F.libres = [];
  const portee = (pos) => {
    const s = F.ast.body.find((x) => pos >= x.start && pos < x.end);
    if (!s) return "(fichier)";
    if (s.type === "FunctionDeclaration") return s.id.name;
    if (s.type === "VariableDeclaration") return (s.declarations.find((d) => pos >= d.start && pos < d.end)?.id.name) || "(fichier)";
    return "(fichier)";
  };
  const chaine = (x) => (x && x.type === "Literal" && typeof x.value === "string" ? x.value : null);
  (function tous(n, si) {
    if (!n || typeof n.type !== "string") return;
    // les textes qui servent de repère au code : comparés, cherchés, ou servant à choisir un cas
    if (n.type === "BinaryExpression" && /^[!=]==?$/.test(n.operator)) [n.left, n.right].forEach((x) => chaine(x) !== null && F.compares.add(x.value));
    if (n.type === "SwitchCase" && chaine(n.test) !== null) F.compares.add(n.test.value);
    if (n.type === "CallExpression" && n.callee.type === "MemberExpression" && !n.callee.computed && /^(includes|indexOf|startsWith|endsWith)$/.test(n.callee.property.name)) n.arguments.forEach((x) => chaine(x) !== null && F.compares.add(x.value));
    if (n.type === "MemberExpression" && n.computed && chaine(n.property) !== null) F.compares.add(n.property.value);
    if (chaine(n) !== null && n.value.length <= 40) F.compte.set(n.value, (F.compte.get(n.value) || 0) + 1);
    if ((n.type === "Literal" && typeof n.value === "string") || n.type === "TemplateLiteral") {
      if (!F.pris.has(n.start)) {
        const brut = n.type === "Literal" ? n.value : n.quasis.map((q) => q.value.cooked).join(" … ");
        if (estProse(brut)) { const t = texte(n); F.libres.push({ genre: "texte", t, f: chemin, pos: n.start, dans: portee(n.start), si }); }
      }
      if (n.type === "TemplateLiteral") n.expressions.forEach((e) => tous(e, si));
      return;
    }
    if (n.type === "IfStatement") { const c = court(src(n.test), 80); tous(n.test, si); tous(n.consequent, c); if (n.alternate) tous(n.alternate, "sinon (" + c + ")"); return; }
    for (const k in n) {
      if (k === "type" || k === "start" || k === "end") continue;
      const c = n[k];
      if (Array.isArray(c)) c.forEach((x) => x && typeof x.type === "string" && tous(x, si));
      else if (c && typeof c.type === "string") tous(c, si);
    }
  })(F.ast);
  return F;
}

/** Un texte ressemble-t-il à une phrase lue par le joueur (et pas à du code, une couleur, une classe…) ? */
export function estProse(t) {
  const s = String(t).replace(/<[^>]*>/g, " ").replace(/\$\{[^}]*\}/g, " ").replace(/\s+/g, " ").trim();
  if (s.length < 14) return false;
  if (/^(bold |italic )?\d+(\.\d+)?px\b|sans-serif|monospace/.test(s)) return false; // une police
  if (/^[#.\w-]+$/.test(s) || /^(rgba?|hsl|linear-gradient|M\d|[0-9.,\s-]+$)/.test(s)) return false;
  if (/[{};]\s*[\w-]+\s*:|:\s*\d+px|^\s*[.#][\w-]+\s*\{/.test(t)) return false; // du CSS
  if (/^\s*[.#][a-z][\w-]*(\s|,|$)/.test(t)) return false; // un sélecteur
  const mots = s.split(" ").filter((m) => /[a-zà-ÿœ]{2,}/i.test(m));
  return mots.length >= 3 && /[a-zà-ÿœ]{3,}\s+[a-zà-ÿœ'’]{2,}/i.test(s);
}

/** Tous les textes d'une valeur (pour chercher, compter, marquer). */
export function textesDe(v, out = [], vu = 0) {
  if (!v || typeof v !== "object" || vu > 14) return out;
  if (v._t) { out.push(v); return out; }
  if (v._f) return textesDe(v.retour, out, vu + 1);
  (Array.isArray(v) ? v : Object.values(v)).forEach((x) => x !== v && textesDe(x, out, vu + 1));
  return out;
}

/** Le texte tel qu'on le lit : sans balises, les morceaux calculés entre crochets. */
export function lisible(v) {
  if (v === undefined || v === null) return "";
  if (estTexte(v)) return String(v.v).replace(/\$\{([^}]*)\}/g, "⟨$1⟩").replace(/<br\s*\/?>/g, " ").replace(/<[^>]*>/g, "").replace(/\\'/g, "'");
  if (v._cat) return v._cat.map(lisible).join("");
  if (v._si) return lisible(v.oui) + " / " + lisible(v.non);
  if (v._ou) return v._ou.map(lisible).filter(Boolean).join(" / ");
  if (v._x !== undefined) return "⟨" + v._x + "⟩";
  if (v._appel) return "⟨" + v._appel + "(…)⟩";
  if (v._f) return v.retour ? lisible(v.retour) : "⟨calculé⟩";
  if (typeof v === "object") return "";
  return String(v);
}
