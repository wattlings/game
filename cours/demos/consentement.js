/**
 * Démo « consentement » (niveaux Comprendre / Approfondir).
 */
import { ECOLE } from "../../commun/donnees/ecole.js";
import { icone } from "../blocs/icones.js";
import { echapper, texteRiche, tous, un } from "../blocs/outils.js";
import { dateFr } from "../modele/calendrier.js";

const TYPES_DE_DONNEES = {
  courbe: "Courbe de charge",
  conso: "Consommations et index",
  contrat: "Données contractuelles",
};

const APPELS_API = [
  {
    id: "courbe-pdl",
    lib: "Courbe de charge du PDL",
    point: "pdl",
    donnee: "courbe",
    url: `GET /mesures/courbe-de-charge?point=${ECOLE.pdl}&debut=2026-09-01`,
  },
  {
    id: "conso-pce",
    lib: "Consommations journalières du PCE",
    point: "pce",
    donnee: "conso",
    url: `GET /mesures/consommations?point=${ECOLE.pce}&pas=jour`,
  },
  {
    id: "contrat-pdl",
    lib: "Contrat du PDL",
    point: "pdl",
    donnee: "contrat",
    url: `GET /contrats?point=${ECOLE.pdl}`,
  },
];

const AUJOURDHUI = new Date(Date.UTC(2026, 9, 1));

const ajouterMois = (e, n) => new Date(Date.UTC(e.getUTCFullYear(), e.getUTCMonth() + n, e.getUTCDate()));

const versIso = (e) => e.toISOString().slice(0, 10);

export function demoConsentement(zone, options) {
  let t = null;
  let a = 0;
  const c = [];
  zone.innerHTML = `
    <form class="formulaire" id="cs-form" novalidate>
      <fieldset><legend>Qui ?</legend>
        <p style="font-size:var(--t-s)"><b>Titulaire :</b> Mairie (fictive), qui a les contrats de l’école</p>
        <p style="font-size:var(--t-s)"><b>${texteRiche("{{tiers-autorise|Tiers autorisé}}")} :</b> l’éditeur du logiciel d’energy management</p>
      </fieldset>
      <fieldset><legend>Sur quels points ?</legend>
        <label class="check"><input type="checkbox" id="cs-pdl" checked> PDL ${ECOLE.pdl} (électricité)</label>
        <label class="check"><input type="checkbox" id="cs-pce"> PCE ${ECOLE.pce} (gaz)</label>
      </fieldset>
      <fieldset><legend>Quelles données ?</legend>
        ${Object.entries(TYPES_DE_DONNEES)
          .map(
            ([l, s], r) =>
              `<label class="check"><input type="checkbox" id="cs-d-${l}" ${r < 2 ? "checked" : ""}> ${s}</label>`,
          )
          .join("")}
      </fieldset>
      <fieldset><legend>Pour combien de temps ?</legend>
        <label class="field"><span class="sr">Durée</span><select id="cs-duree"><option value="12">1 an</option><option value="24">2 ans</option><option value="36" selected>3 ans</option></select></label>
        <label class="check"><input type="checkbox" id="cs-accord"> J’autorise ce tiers à accéder à ces données pour cette durée.</label>
      </fieldset>
    </form>
    <div class="row"><button type="button" class="btn data" id="cs-signer">Signer le consentement</button><button type="button" class="btn" id="cs-revoquer" disabled>Révoquer</button><span id="cs-etat" class="badge neutre" aria-live="polite"></span></div>
    <div class="field"><label for="cs-date">Date de l’appel à l’API : <span id="cs-date-txt" class="num"></span></label><input type="range" id="cs-date" min="0" max="48" value="0"></div>
    <div class="row">${APPELS_API.map((l) => `<button type="button" class="btn" data-appel="${l.id}">${icone("fleche")} ${echapper(l.lib)}</button>`).join("")}</div>
    <div class="console" id="cs-console" aria-live="polite" role="log">API simulée. Appuie sur un bouton pour appeler l’API.</div>`;
  const o = () => ajouterMois(AUJOURDHUI, a);
  function d() {
    const l = un("#cs-etat", zone);
    if (t) {
      if (t.revoque) {
        l.className = "badge bad";
        l.textContent = "Consentement révoqué";
      } else if (o() > t.fin) {
        l.className = "badge warn";
        l.textContent = `Expiré le ${dateFr(versIso(t.fin))}`;
      } else {
        l.className = "badge ok";
        l.textContent = `Valide jusqu’au ${dateFr(versIso(t.fin))}`;
      }
    } else {
      l.className = "badge neutre";
      l.textContent = "Aucun consentement";
    }
    un("#cs-revoquer", zone).disabled = !t || t.revoque;
    un("#cs-date-txt", zone).textContent = dateFr(versIso(o()));
  }
  function u(l) {
    options.toucher();
    const s = o();
    let r = 200;
    let i = "";
    if (t) {
      if (t.revoque) {
        r = 403;
        i = "Consentement révoqué par le titulaire.";
      } else if (s > t.fin) {
        r = 403;
        i = `Consentement expiré le ${versIso(t.fin)}.`;
      } else if (t.points.has(l.point)) {
        if (!t.donnees.has(l.donnee)) {
          r = 403;
          i = `Le consentement ne couvre pas « ${TYPES_DE_DONNEES[l.donnee]} ».`;
        }
      } else {
        r = 403;
        i = `Le point ${l.point === "pdl" ? ECOLE.pdl : ECOLE.pce} n’est pas dans le périmètre du consentement.`;
      }
    } else {
      r = 403;
      i = "Aucun consentement pour ce point.";
    }
    const p =
      r === 200
        ? {
            courbe: `{ "point": "${ECOLE.pdl}", "pas": "PT10M", "unite": "W", "valeurs": [ { "debut": "2026-09-01T00:00:00+02:00", "valeur": 5870 }, { "debut": "2026-09-01T00:10:00+02:00", "valeur": 5712 }, … ] }`,
            conso: `{ "point": "${ECOLE.pce}", "valeurs": [ { "jour": "2026-09-01", "volume_m3": 6.8, "coefficient": 11.24, "energie_kwh": 76 }, … ] }`,
            contrat: `{ "point": "${ECOLE.pdl}", "segment": "C4", "puissance_souscrite_kva": 60, "postes": ["HPH", "HCH", "HPB", "HCB"] }`,
          }[l.donnee]
        : `{ "erreur": "acces_refuse", "message": "${i}" }`;
    c.unshift(`<span class="c"># ${dateFr(versIso(s))}</span>
${echapper(l.url)}
<span class="${r === 200 ? "ok" : "ko"}">${r} ${r === 200 ? "OK" : "Forbidden"}</span>  ${echapper(p)}`);
    un("#cs-console", zone).innerHTML = c.slice(0, 4).join(`

`);
  }
  un("#cs-signer", zone).addEventListener("click", () => {
    options.toucher();
    if (!un("#cs-accord", zone).checked) {
      c.unshift('<span class="ko">Signature refusée : coche la case d’accord.</span>');
      un("#cs-console", zone).innerHTML = c.slice(0, 4).join(`

`);
      return;
    }
    const l = new Set(["pdl", "pce"].filter((r) => un(`#cs-${r}`, zone).checked));
    const s = new Set(Object.keys(TYPES_DE_DONNEES).filter((r) => un(`#cs-d-${r}`, zone).checked));
    t = {
      points: l,
      donnees: s,
      fin: ajouterMois(AUJOURDHUI, +un("#cs-duree", zone).value),
      revoque: false,
    };
    c.unshift(
      `<span class="ok">Consentement signé le ${dateFr(versIso(AUJOURDHUI))}</span> : ${[...l].map((r) => r.toUpperCase()).join(" + ") || "aucun point"}, ${[...s].map((r) => TYPES_DE_DONNEES[r]).join(", ") || "aucune donnée"}.`,
    );
    un("#cs-console", zone).innerHTML = c.slice(0, 4).join(`

`);
    d();
  });
  un("#cs-revoquer", zone).addEventListener("click", () => {
    t.revoque = true;
    options.toucher();
    d();
  });
  un("#cs-date", zone).addEventListener("input", (l) => {
    a = +l.target.value;
    options.toucher();
    d();
  });
  tous("[data-appel]", zone).forEach((l) =>
    l.addEventListener("click", () => u(APPELS_API.find((s) => s.id === l.dataset.appel))),
  );
  d();
}
