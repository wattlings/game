/* Wattlings · jeu/epreuves/ems-commun.js
   L'EMS du bureau : les briques communes des ateliers de chaque étape (un outil générique, aucun produit réel).
   Chaque atelier fait manipuler la donnée du site du joueur, et range ce qu'il a décidé dans S.ems pour les étapes suivantes :
     objectif (Cadrer) → indicateur suivi à Mesurer ; raccord (Collecter) ; fiab (Fiabiliser) ; signature (Analyser) ;
     alerte (Détecter) ; plan (Agir) → vérifié à Mesurer ; mv (Mesurer). */

const emsSet=(k,v)=>{S.ems=Object.assign(S.ems||{},{[k]:v});save()};
const emsGet=k=>(S.ems||{})[k];
/* la barre du haut de l'outil : son nom, puis le site et ce qu'on regarde */
const emsBarre=(quoi,outil='EMS du bureau')=>`<div class="ems-barre"><span>${esc(outil)}</span><span>${esc(site().name)} · ${esc(quoi)}</span></div>`;
/* le carnet, consultable sans quitter l'épreuve : on y recopie ce qu'on a trouvé en ville */
function emsCarnet(){const n=S.notes||{},l=(k,v)=>`<tr><th>${k}</th><td class="num">${v?esc(String(v)):'<i>pas encore relevé</i>'}</td></tr>`;
  return `<details class="ems-carnet"><summary>Ouvrir mon carnet</summary><div class="tbl"><table>${l('Adresse',n.adresse)}${l('Surface',n.surface&&fmt(n.surface)+' m²')}${l('Activité',n.activite)}${l('PDL (élec)',n.pdl)}${l('PCE (gaz)',n.pce)}</table></div></details>`}
/* un nombre tapé à la française (« 1 234,5 ») */
const emsNombre=t=>{const v=parseFloat(String(t).replace(/\s| | /g,'').replace(',','.'));return isFinite(v)?v:null};
const emsKwh=v=>Math.round(v).toLocaleString('fr-FR');
/* la ligne qui relie l'atelier au travail : ce que fait un EMS, et ce qui reste un choix humain */
const emsTransfert=t=>`<p class="dnote ems-transfert">Dans un EMS : ${t}</p>`;
/* une erreur de plus dans l'atelier : suivie comme une mauvaise réponse */
const emsRate=(q,a)=>{trk('wrong_answer',{t:panelTitle(),q:trkTxt(q).slice(0,100),a:trkTxt(String(a)).slice(0,80)});sfx('bad')};

/* des propositions à choisir : une erreur est expliquée, puis tout est remélangé (on ne gagne pas par élimination).
   opts : [texte, juste, explication]. ok(opt, essais) quand la bonne est choisie. */
function emsChoix(box,opts,ok,{q='',txt=t=>t,rendu=null}={}){
  let essais=0;
  const montrer=msg=>{box.innerHTML=(q?`<p><b>${q}</b></p>`:'')+'<div class="opts"></div>'+(msg||'');const o=box.querySelector('.opts');
    shuffle(opts).forEach(p=>{const b=document.createElement('button');b.type='button';b.className='opt';b.innerHTML=txt(p[0]);o.appendChild(b);
      b.onclick=()=>{if(p[1]){sfx('select');ok(p,essais)}else{essais++;emsRate(q||'Atelier EMS',p[0].replace(/<[^>]+>/g,''));montrer(`<div class="fb ko">✘ ${txt(p[2])} ${essais>=2?revoirFiche():''}Relis, et choisis encore.</div>`)}}});if(rendu)rendu(box)};
  montrer();
}

/* « Revoir la fiche » : après deux erreurs, les fiches de l'étape déjà trouvées, dépliables sans quitter l'épreuve */
function revoirFiche(){
  const A=curArena(),st=A?A.id:Math.max(1,Math.min(8,S.ch-1)),F=FICHES.filter(f=>f.st===st&&S.fiches&&S.fiches[f.id]);
  if(!F.length)return '';
  return `<details class="revoir"><summary>Revoir la fiche</summary>${F.map(f=>`<p><b>${esc(f.t)}</b> · ${esc(f.x)}</p>`).join('')}</details> `;
}

/* un graphique simple : cadre, grille, axe des ordonnées. Renvoie les fonctions de position. */
function emsRepere(x,{w,h,L=58,T=14,B=32,R=12,max,unite='kW',fond='#fffaf0'}){
  const W=w-L-R,H=h-T-B,haut=max>200?Math.ceil(max/200)*200:max>20?Math.ceil(max/10)*10:Math.ceil(max),Y=v=>T+H-v/haut*H;
  x.fillStyle=fond;x.fillRect(0,0,w,h);x.font='12px "Atkinson Hyperlegible",sans-serif';x.strokeStyle='#e6dcc0';x.lineWidth=1;x.fillStyle='#5b6380';x.textAlign='right';
  const pas=[1,2,5,10,20,25,50,100,200,250,500,1000,2000,2500,5000,10000,20000,25000,50000].find(v=>haut/v<=5)||haut;
  for(let g=0;g<=haut+1e-9;g+=pas){x.beginPath();x.moveTo(L,Y(g));x.lineTo(L+W,Y(g));x.stroke();x.fillText(g.toLocaleString('fr-FR')+(unite?' '+unite:''),L-4,Y(g)+4)}
  return {L,T,W,H,Y,haut};
}
