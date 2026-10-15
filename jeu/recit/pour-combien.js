/* Wattlings · jeu/recit/pour-combien.js
   Mme Combien, la brocanteuse de la place de la Donnée : à chaque visite, elle pose un « Pour combien ? » tiré au hasard.
   Le joueur répond un montant en euros (champ libre) ou « Jamais de la vie ».

   La liste (POUR_COMBIEN_LISTE) se modifie ici, ou depuis le pilotage comme les autres textes du jeu : une ligne par question.

   Les réponses : dans la sauvegarde (S.pourCombien, la dernière réponse par question), et dans la mesure d'audience
   (événement « pour_combien » : q = id, eur = montant ou jamais = 1 ; le profil s'y ajoute quand le joueur est connecté).
   Le pilotage (onglet « Pour combien ? ») en tire la moyenne, la médiane et le nombre de réponses de chaque question. */

/* une question par ligne : « identifiant | la question ». L'identifiant (minuscules, chiffres, tirets) ne change plus une fois
   la question posée aux joueurs ; on peut réécrire la question elle-même sans perdre ses réponses. */
const POUR_COMBIEN_LISTE="boucle-oreille | Pour combien tu portes une boucle d'oreille (que tu choisis) à vie ?";
const pcSlug=t=>String(t).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,40);
const POUR_COMBIEN=POUR_COMBIEN_LISTE.split('\n').map(l=>l.trim()).filter(Boolean).map(l=>{const i=l.indexOf('|');
  return i>0?{id:pcSlug(l.slice(0,i)),q:l.slice(i+1).trim()}:{id:pcSlug(l),q:l}}).filter(p=>p.id&&p.q);
const PC_MAX=1e12;   // au-delà, ce n'est plus une réponse, c'est un numéro de téléphone

const PC_BONJOUR=[
  "Tout a un prix. Même toi. Surtout toi.",
  "Approche, approche. Ici on n'achète rien : on fixe des prix.",
  "Je tiens les comptes de la ville. Pas l'électricité : les gens."];
const PC_MERCI=[
  "Noté. Je n'oublie jamais un prix.",
  "Intéressant. Je t'aurais cru plus cher. Ou moins. Je note.",
  "Parfait. Ce chiffre ira rejoindre les autres dans mon carnet."];

/* une question au hasard parmi celles auxquelles le joueur n'a pas encore répondu ; toutes faites : un nouveau tour */
function pcTirer(){
  const R=S.pourCombien||{},Q=POUR_COMBIEN.filter(p=>p&&p.id&&p.q);if(!Q.length)return null;
  const neuves=Q.filter(p=>!R[p.id]);
  const L=neuves.length?neuves:Q;
  return L[Math.floor(Math.random()*L.length)];
}
/* lire un montant tapé : « 1 500 », « 1500 € », « 12,50 » */
function pcMontant(t){
  const s=String(t||'').replace(/[\s  €]/g,'').replace(',','.');
  if(!/^\d+(\.\d+)?$/.test(s))return null;
  const v=Math.round(parseFloat(s)*100)/100;
  return isFinite(v)&&v>=0&&v<=PC_MAX?v:null;
}
function pcNoter(p,v){
  if(!S.pourCombien)S.pourCombien={};
  S.pourCombien[p.id]=v===null?{jamais:1,t:Date.now()}:{eur:v,t:Date.now()};save();
  trk('pour_combien',v===null?{q:p.id,jamais:1}:{q:p.id,eur:v});
}
function pcParler(){
  const p=pcTirer(),bj=PC_BONJOUR[Math.floor(Math.random()*PC_BONJOUR.length)];
  if(!p)return say([{w:'Mme Combien',t:bj},{w:'Mme Combien',t:"Mais aujourd'hui, je n'ai rien à te demander. Reviens plus tard."}]);
  say([{w:'Mme Combien',t:bj},{w:'Mme Combien',t:p.q}],()=>pcDemander(p));
}
function pcDemander(p){
  const ov=openPanel('Pour combien ?',{sansCours:true}),b=ov.querySelector('.pbody');
  b.innerHTML=`<p><b>${esc(p.q)}</b></p>
    <div class="field"><label for="pcV">Ton prix, en euros</label><input id="pcV" inputmode="decimal" autocomplete="off" placeholder="ex. 5 000"><small class="m" id="pcM"></small></div>
    <div class="opts det"><button class="opt" id="pcOk"><b>C'est mon prix</b><small>Mme Combien le note dans son carnet.</small></button>
    <button class="opt" id="pcJamais"><b>Jamais de la vie</b><small>Il y a des choses qui n'ont pas de prix.</small></button>
    <button class="opt" id="pcPlus"><b>Je réfléchis</b><small>Elle reposera la question une autre fois.</small></button></div>`;
  const champ=b.querySelector('#pcV'),msg=b.querySelector('#pcM');
  const fini=v=>{closePanel();pcNoter(p,v);
    const t=v===null?"Jamais ? Tout le monde dit ça. Puis on discute.":PC_MERCI[Math.floor(Math.random()*PC_MERCI.length)];
    say([{w:'Mme Combien',t}]);sfx('good')};
  const valider=()=>{const v=pcMontant(champ.value);
    if(v===null){msg.textContent=champ.value.trim()?"Un montant en euros, positif, en chiffres. Pas une poésie.":"Donne-moi un chiffre. Même zéro, c'est un prix.";champ.focus();return}
    fini(v)};
  b.querySelector('#pcOk').onclick=valider;
  champ.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();valider()}});
  b.querySelector('#pcJamais').onclick=()=>fini(null);
  b.querySelector('#pcPlus').onclick=()=>{closePanel();say([{w:'Mme Combien',t:"Réfléchis. Mais pas trop longtemps : les prix montent."}])};
  champ.focus();
}
/* Mme Combien, devant la fontaine de la place de la Donnée (ouverte dès le début) */
const PC_PAL={skin:'#e8b98f',shirt:'#8a3b8f',pants:'#2c2c34',skirt:1,hair:'#b8431f',style:'long',hat:'#2c2c34',lash:1};
function pcObjs(id,o){
  if(id!=='town')return;
  const [x,y]=TP(55,37);
  o.push({x,y,kind:'npc',solid:1,noHades:1,who:'Mme Combien',pal:PC_PAL,dir:'down',act:pcParler});
}
