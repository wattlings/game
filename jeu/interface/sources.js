/* Wattlings · jeu/interface/sources.js
   Les sources dans le jeu : le petit volet « Sources » sous une fiche ou une information de voyage, et l'onglet Sources du menu.
   Le registre de toutes les références est commun au cours et au jeu : commun/donnees/sources.js (SOURCES, libelleSource).
   Pour citer une source : refs:['cle-1','cle-2'] sur une fiche savoir (recit/fiches-savoir.js), une arène (recit/arenes/),
   une information de voyage ou un site (voyages/<site>/textes.js) ; ce que disent les habitants et les épreuves d'une étape
   est référencé dans recit/references.js. */

/* une source : « Éditeur, Titre (date) », avec son lien */
function refLien(cle){
  const s=SOURCES[cle];if(!s)return '';
  return `<li><b>${esc(s.ed)}</b>, <a href="${esc(s.url)}" target="_blank" rel="noopener">${esc(s.t)} ↗</a>${s.date?` <span class="ref-d">(${esc(s.date)})</span>`:''}${s.niveau==='secondaire'?' <span class="ref-2" title="Presse, fabricant ou projet open source : à défaut de source d’origine">source secondaire</span>':''}</li>`;
}
const refsListe=cles=>`<ul class="refs-l">${cles.map(refLien).join('')}</ul>`;
/* le volet « Sources » d'une fiche : replié dans les listes, déplié (ouvert=true) quand on vient de trouver la fiche */
function refsHTML(refs,ouvert){
  const L=(refs||[]).filter(k=>SOURCES[k]);if(!L.length)return '';
  return `<details class="refs"${ouvert?' open':''}><summary>Source${L.length>1?'s':''} (${L.length})</summary>${refsListe(L)}</details>`;
}
/* une liste de clés sans doublon, dans l'ordre d'arrivée */
const refsUnion=listes=>{const u=[];listes.forEach(l=>(l||[]).forEach(k=>{if(SOURCES[k]&&!u.includes(k))u.push(k)}));return u};

/* ---- ce que cite chaque partie du jeu ---- */
/* une étape : ses fiches savoir, son arène, puis ses habitants et son épreuve (recit/references.js) */
const refsEtape=st=>refsUnion(FICHES.filter(f=>f.st===st).map(f=>f.refs).concat([(ARENAS.find(A=>A.id===st)||{}).refs,(typeof REFS_ETAPES!=='undefined'&&REFS_ETAPES[st])||[]]));
/* un site visité en train : ses informations, puis ce que disent ses habitants et ses simulations (refs du site) */
const refsSite=sid=>{const s=VOY.sites[sid];return refsUnion(s.infos.map(f=>f.refs).concat([s.refs]))};

/* ---- l'onglet Sources du menu ---- */
function sourcesHTML(){
  const E=[0,1,2,3,4,5,6,7,8,'P'].map(st=>[st,refsEtape(st)]).filter(([,L])=>L.length);
  const V=typeof VOY==='undefined'?[]:VOY.ordre.filter(id=>VOY.sites[id].ouvert).map(id=>[id,refsSite(id)]).filter(([,L])=>L.length);
  const bloc=(titre,L)=>`<div class="cls"><div class="cls-h"><b>${esc(titre)}</b><span>${L.length} source${L.length>1?'s':''}</span></div>${refsListe(L)}</div>`;
  return `<p>Chaque fait et chaque règle du jeu renvoie à une source qui a été ouverte et lue (dernière consultation : ${esc(sourcesVuesLe())}). Sous une fiche savoir ou une information de voyage, le volet <b>Sources</b> donne les liens ; cette page les réunit.</p>
    <p class="dnote">Sans source, et c'est voulu : ce qui est inventé (Ampère-sur-Loire, ses habitants, Volt&Co, les relevés des sites, les centrales visitées en train), la méthode en 8 étapes, les calculs, et les vannes.</p>
    <p class="dnote"><b>Référencement en cours.</b> Déjà traité en entier : ${E.filter(([st])=>typeof REFS_ETAPES!=='undefined'&&REFS_ETAPES[st]).map(([st])=>st===0?'le cycle':st==='P'?'le patrimoine':'l’étape '+st+' ('+STEP_NAMES[st]+')').concat(V.map(([id])=>VOY.sites[id].nom)).join(' ; ')||'rien encore'}. Le reste suit.</p>
    ${E.map(([st,L])=>bloc(st===0?'Le cycle':st==='P'?'Patrimoine':'Étape '+st+' · '+STEP_NAMES[st],L)).join('')}${V.map(([id,L])=>bloc('Voyage · '+VOY.sites[id].nom,L)).join('')}`;
}
