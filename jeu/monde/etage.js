/* Wattlings · jeu/monde/etage.js
   Le bâtiment « Bureau » : des étages de bureaux reproduits d'après de vrais plans (une case ≈ 1 m).
   Ce fichier est le moteur commun ; chaque étage se décrit dans son propre fichier (monde/etage-3.js, monde/etage-6.js).
   Le bâtiment est place de la Donnée, ouvert dès le début : à l'entrée, l'ascenseur demande l'étage ; on arrive dans le sas,
   et il faut badger pour passer les portes coulissantes. Pour l'instant, c'est une visite : pas de quête, personne aux postes.
   Le dessin (sols, murs, mobilier) est dans rendu/etage.js.

   Les plans : une chaîne par rangée, un caractère par case.
   On marche sur : o moquette   c carrelage   q parquet flottant   d porte ouverte   g porte coulissante du sas (il faut badger)
   On bute contre : W mur   w mur avec fenêtre   f cloison vitrée   h porte fermée à clé   P porte d'ascenseur
                    B gaine d'ascenseur   r escalier   x dehors (au-delà de la façade) */

const ETAGES=[];                       // les étages déclarés, du plus bas au plus haut : {id, num, resume}
const ETG={badge:false,ouv:0};         // la visite en cours : le badge (à refaire à chaque arrivée), l'ouverture des portes du sas
const ETAGE_MURAUX=new Set(['ecran','serviettes','affichage']);   // accrochés au mur : on ne bute pas dessus

/* ---- outils pour meubler un étage ----
   Chaque meuble : k (sa nature), x, y (la case en haut à gauche), w, h (sa taille en cases), d (là où il regarde).
   Un poste de travail : la chaise est sur sa case ; devant elle, la table sur deux cases de profondeur
   (le clavier sur la première, les deux écrans au fond de la seconde). */
function etageAtelier(){
  const M=[],m=(k,x,y,o)=>M.push(Object.assign({k,x,y,w:1,h:1},o||{}));
  const poste=(x,y,d)=>m('poste',x,y,{d});
  // un îlot : une table en bois de 4 cases de large (2 par côté), les postes face à face aux rangées données
  const ilot=(x,y0,y1,rangs)=>{m('table',x,y0,{w:4,h:y1-y0+1,bois:1});rangs.forEach(y=>{poste(x-1,y,'right');poste(x+4,y,'left')})};
  // le même îlot avec une table de 3 cases (là où il faut garder un passage entre les îlots)
  const ilot3=(x,y0,y1,rangs)=>{m('table',x,y0,{w:3,h:y1-y0+1,bois:1});rangs.forEach(y=>{poste(x-1,y,'right');poste(x+3,y,'left')})};
  // un bureau seul : une table de 3 cases sur 2, la chaise au milieu
  const seul=(x,y,d)=>{const T={up:[x-1,y-2,3,2],down:[x-1,y+1,3,2],left:[x-2,y-1,2,3],right:[x+1,y-1,2,3]}[d];m('table',T[0],T[1],{w:T[2],h:T[3],bois:1});poste(x,y,d)};
  const chaises=(pos,d,st)=>pos.forEach(([x,y])=>m('chaise',x,y,{d,st}));
  return {M,m,poste,ilot,ilot3,seul,chaises};
}
/* les cases couvertes par un îlot posé en biais (table et chaises), pour qu'on bute dessus */
function etageBiaisCases(f){
  const a=f.ang*Math.PI/180,co=Math.cos(a),si=Math.sin(a),L=[];
  for(let y=Math.floor(f.cy-5);y<=f.cy+5;y++)for(let x=Math.floor(f.cx-5);x<=f.cx+5;x++){
    const dx=x+.5-f.cx,dy=y+.5-f.cy,lx=co*dx+si*dy,ly=-si*dx+co*dy;
    if(Math.abs(lx)<=f.w/2+.1&&Math.abs(ly)<=f.h/2+.9)L.push([x,y])}
  return L;
}

/* ---- déclarer un étage ----
   d : { num, resume, plan, meubles(), plaques, salles, biais, dehors, arrivee, ascenseurs, service,
         sas:{portes:[x0,x1,y], lecteur:[x,y]}, fermes:{'x,y':[répliques]}, escalier(x,y) → répliques, objets(o,dire) } */
function etageDeclarer(id,d){
  const g=d.plan.map(l=>l.split('')),w=g[0].length;
  g.forEach((l,i)=>{if(l.length!==w)throw new Error(`Étage ${d.num} : la rangée ${i+1} compte ${l.length} cases au lieu de ${w}.`)});
  const sol=g.map(l=>l.slice()),meubles=d.meubles();
  // le mobilier est infranchissable (sauf ce qui est accroché au mur) : ses cases deviennent des « k »
  const k=(x,y)=>{if(g[y]&&g[y][x]!==undefined)g[y][x]='k'};
  meubles.forEach(f=>{if(ETAGE_MURAUX.has(f.k))return;
    if(f.k==='ilotBiais'){etageBiaisCases(f).forEach(([x,y])=>k(x,y));return}
    for(let j=0;j<f.h;j++)for(let i=0;i<f.w;i++)k(f.x+i,f.y+j);
    if(f.k==='poste'){const [dx,dy]=DIRS[f.d];k(f.x+dx,f.y+dy)}});
  let liste=null;
  MAPS[id]=Object.assign({},d,{g,sol,meubles,name:`Bureau · ${d.num}e étage`,musique:'indoor',
    salle:(x,y)=>d.salles.some(([a,b,c,e])=>x>=a&&x<=c&&y>=b&&y<=e),
    peindre:(c,dessus,m)=>etagePeindre(c,dessus,m),
    objectif:()=>ETG.badge?`${d.num}e étage : visite libre. Pour changer d'étage ou repartir, reprends l'ascenseur, dans le sas.`:"Badge au lecteur, à droite des portes coulissantes, pour entrer dans les bureaux.",
    cibles:()=>[],
    objets:o=>{if(!liste){liste=[];etageObjets(d,liste)}for(const x of liste)o.push(x)},
    sortie(){etageSortir()}});
  ETAGES.push({id,num:d.num,resume:d.resume});ETAGES.sort((a,b)=>a.num-b.num);
}

/* ---- ce qui réagit quand on le touche ---- */
const ETAGE_SERVICE=["Ascenseur de service. Un panneau : « Réservé aux livraisons et à l'entretien. »","Le bouton d'appel est protégé par une clé. Tu n'as pas la clé. Tu as un badge, ce qui n'impressionne pas du tout l'ascenseur."];
function etageObjets(d,o){
  const dire=t=>()=>say(t.map(x=>({t:x})));
  // les ascenseurs : on choisit l'étage, ou la sortie
  const asc=()=>{if(busy||dlg.open)return;etageAscenseur(S.map)};
  d.ascenseurs.forEach(([x,y])=>o.push({x,y,kind:'none',solid:1,act:asc,go:asc}));
  (d.service||[]).forEach(([x,y])=>o.push({x,y,kind:'none',solid:1,act:dire(ETAGE_SERVICE)}));
  // le lecteur de badge et les portes coulissantes du sas
  const [x0,x1,yp]=d.sas.portes,[lx,ly]=d.sas.lecteur;
  o.push({x:lx,y:ly,kind:'none',solid:1,act:etageBadger});
  for(let x=x0;x<=x1;x++)o.push({x,y:yp,kind:'none',get solid(){return ETG.ouv<1},get go(){return ETG.ouv<1?etageBadgeRefus:null},draw:(c,X,Y)=>{if(x===x0)etageDessinerPorteSas(c,X,Y,x1-x0+1,lx-x0)}});
  // les portes fermées à clé, les escaliers
  Object.keys(d.fermes||{}).forEach(c=>{const [x,y]=c.split(',').map(Number);o.push({x,y,kind:'none',solid:1,act:dire(d.fermes[c])})});
  d.plan.forEach((l,y)=>{for(let x=0;x<l.length;x++)if(l[x]==='r')o.push({x,y,kind:'none',solid:1,act:dire(d.escalier(x,y))})});
  if(d.objets)d.objets(o,dire);
}
function etageBadger(){
  if(ETG.badge){say([{t:"Le voyant est déjà vert. Les portes t'attendent."}]);return}
  ETG.badge=true;sfx('secret');say([{t:"Tu passes ton badge sur le lecteur. Bip ! Le voyant passe au vert."},{t:"Les portes coulissantes s'écartent dans un souffle. Bienvenue au bureau."}]);
}
function etageBadgeRefus(){
  if(ETG.ouv>=1)return;
  const n=performance.now();if(n-(etageBadgeRefus.t||0)<1500)return;etageBadgeRefus.t=n;
  if(P.y>MAPS[S.map].sas.portes[2]){ETG.badge=true;return}   // côté bureaux, les portes s'ouvrent toutes seules pour sortir
  sfx('bump');say([{t:"Les portes coulissantes restent fermées. Il faut badger : le lecteur est sur le mur, juste à droite."}]);
}
/* à chaque image : les portes du sas s'ouvrent quand on a badgé et qu'on est tout près, puis se referment */
function etageStep(k){
  const m=MAPS[S.map];if(!m||!m.sas)return;
  const [x0,x1,yp]=m.sas.portes,pres=Math.abs(P.y-yp)<=2&&P.x>=x0-2&&P.x<=x1+2,cote=P.y>yp;
  if(cote&&pres)ETG.badge=true;
  ETG.ouv=Math.max(0,Math.min(1,ETG.ouv+(ETG.badge&&pres?.08:-.05)*k));
}

/* ---- l'ascenseur : à l'entrée du bâtiment (ici = null) ou depuis le sas d'un étage ---- */
function etageAscenseur(ici){
  const cur=ETAGES.find(e=>e.id===ici),ov=openPanel('Ascenseur',{sansCours:true}),b=ov.querySelector('.pbody');
  const choix=ETAGES.filter(e=>e.id!==ici).slice().reverse().map(e=>({k:e.id,t:`${e.num}e étage`,s:e.resume}));
  if(ici)choix.push({k:'rdc',t:'Rez-de-chaussée',s:'La sortie, place de la Donnée.'});
  choix.push({k:'',t:ici?'Rester ici':'Ressortir',s:ici?`Tu restes au ${cur.num}e étage.`:'Tu retournes sur la place.'});
  b.innerHTML=`<p>${ici?`Tu es au ${cur.num}e étage. L'ascenseur attend, portes ouvertes, avec la patience d'une machine qui consomme même à l'arrêt.`:"Le hall du bâtiment « Bureau ». Un ascenseur arrive dans un « ding » discret. À quel étage vas-tu ?"}</p><div class="opts">${choix.map((c,i)=>`<button class="opt" data-i="${i}"><b>${c.t}</b><small>${c.s}</small></button>`).join('')}</div>`;
  b.querySelectorAll('[data-i]').forEach(bt=>bt.onclick=()=>{const c=choix[+bt.dataset.i];closePanel();if(c.k==='rdc')etageSortir();else if(c.k)etageAller(c.k)});
  b.querySelector('[data-i]').focus();
}
function etageAller(id){const m=MAPS[id];ETG.badge=false;ETG.ouv=0;warp(id,m.arrivee[0],m.arrivee[1],'down');toast(`${m.num}e étage`)}
function etageSortir(){const b=BLD.find(b=>b.id==='etage');if(b)warp('town',b.door[0],b.door[1]+1,'down')}
/* entrer dans le bâtiment (la porte, en ville) : l'ascenseur demande l'étage */
function etageEntrer(){etageAscenseur(null)}
