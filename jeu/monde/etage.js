/* Wattlings · jeu/monde/etage.js
   « Bureau » : un étage de bureaux, reproduit d'après un vrai plan (une case ≈ 1 m).
   On y arrive par l'ascenseur, dans le sas ; il faut badger pour passer les portes coulissantes.
   Pour l'instant, c'est une visite : pas de quête, personne aux postes.
   Le dessin (sols, murs, mobilier) est dans rendu/etage.js. */

/* ---- le plan : 107 cases sur 33, une chaîne par rangée ----
   On marche sur : o moquette   c carrelage   d porte ouverte   g porte coulissante du sas (il faut badger)
   On bute contre : W mur   w mur avec fenêtre   f cloison vitrée   h porte fermée à clé   P porte d'ascenseur
                    B gaine d'ascenseur   r escalier de secours   x dehors (au-delà de la façade) */
const ETAGE_PLAN=[
  'xxxxxxxxxxxxxxxxxxxWWWwwwWWwwwWWWWwwwWWWwwwWwwwWWwwwWwwwWWWWWWWWWWwwwWWWWWWwwwWWWWWwwWWwwWWWwwwWWwwwWWwwwWW',
  'xxxxxxxxxxxxxxxxxxxWooooooooooooWoooooWoooooooooooooooooooWooooWooooooooWooooooooWooooooooWoooooooooooooooW',
  'xxxxxxxxxxxxxxxxxxWWooooooooooooWoooooWoooooooooooooooooooWooooWooooooooWooooooooWooooooooWooooooooooooooow',
  'xxxxxxxxxxxxxxxxxWWoooooooooooooWoooooWoooooooooooooooooooWooooWooooooooWooooooooWooooooooWooooooooooooooow',
  'xxxxxxxxxxxxxxxxxWooooooooooooooWoooooWoooooooooooooooooooWooooWooooooooWooooooooWooooooooWoooooooooooooooW',
  'xxxxxxxxxxxxxxxxWWooooooooooooooWWdWWWWoooooooooooooooooooWooooWooooooooWooooooooWooooooooWoooooooooooooooW',
  'xxxxxxxxxxxxxxxxWooooooooooooooooooWooWoooooooooooooooooooWooooWooooooooWooooooooWooooooooWooooooooooooooow',
  'xxxxxxxxxxxxxxxWWooooooooooooooooooWooWoooooooooooooooooooWooooWooooooooWooooooooWooooooooWooooooooooooooow',
  'xxxxxxxxxxxxxxWWoooooooooooooooooooWooWoooooooooooooooooooWooooWooooooooWooooooooWooooooooWoooooooooooooooW',
  'xxxxxxxxxxxxxxWWWWWWoooooooooooooooWoWWoooooooooooooooooooWWhWWWoooooooooooooooooWWWWWWWWdWoooooWWWWWWWWWWW',
  'xxxxxxxxxxxxxWWooooWooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooWoooooooooW',
  'xxxxxxxxxxxxWWooooodooWWWWWWWWWWWWWWWoWWWWWWWWWWWWWWWWdWWWWWWWWWWWWWWWWWoWWWWWWooWWWWWWWdWWoooooWooooooooow',
  'xxxxxxxxxxxxWooooooWooWBBBBBBBBBBBBBWoWccccccWcccccccWoorrrrrrrrooWBBBBWoWcccccWcWcccWooooWoooooWooooooooow',
  'xxxxxxxxxxxWWWWWWWWWooWBBBBBBBBBBBBBWoWccccccWcccccccWoorrrrrrrrooWBBBBWoWcccccWcWcccWooooWWWWWoWooooooooow',
  'xxxxxxxxxxWWoooooooWooWBBBBBBBBBBBBBWoWccccccWcccccccWoWWWWWWWWWooWBBBBWoWcccccWcWcccWooooWoooWodoooooooooW',
  'xxxxxxxxxxWoooooooohooWBPPBBPPBBPPWWWoWccccccWcccccccWoWrrrrrrrrooWBBBBWoWcccccdcdcccWooooWoooWoWWWWWWWWWWW',
  'xxxxxxxxxWWooooooooWooWoooooooooooWoooWccccccWcccccccWoWrrrrrrrrooWBPPBWoWWWWWWWdWWWWWWWWWWoooWoWoooooooooW',
  'xxxxxxxxWWWWWWWWWWWWooWoooooooooooWoooWccccccWcccccccWoWWWWWWWWWWoWooooWoWcccccccWoooWooooWoooWodooooooooow',
  'xxxxxxxxWWooooooooodooWoooooooooooWoooWccccccWcccccccWooooooooooooWooooWoWcccccccWoooWooooWoooWoWooooooooow',
  'xxxxxxxWWooooooooooWooWWWWWWgggWWWWoooWccccccWcccccccWooooooooooooWooooWoWcccccccWoooWooooWoooWoWoooooooooW',
  'xxxxxxWWWWWWWWWWWWWWooooooooooooooooooWWWWdWWWWdWWWWWWWWWWWWWWWWWoWoooWooWWWWWWWWWoWWWWWdWWWhWWoWWWWWWWWWWW',
  'xxxxxxWWooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooW',
  'xxxxxWWoooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooW',
  'xxxxxWoooooooooooooWWWWdWfffffffddfffffffffWoooooooooWWWdWWWWdWWdWWWWooooooooooooooooooWWWWdWdWWWWoooooooow',
  'xxxxWWoooooooooooooWooooWccccccccccccccccccWoooooooooWooooWooooWooooWooooooooooooooooooWooooWooooWoooooooow',
  'xxxWWooooooooooooooWooooWccccccccccccccccccWoooooooooWooooWooooWooooWooooooooooooooooooWooooWooooWoooooooow',
  'xxxWoooooooooooooooWooooWccccccccccccccccccWoooooooooWooooWooooWooooWooooooooooooooooooWooooWooooWooooooooW',
  'xxWWoooooooooooooooWooooWccccccccccccccccccWoooooooooWooooWooooWooooWooooooooooooooooooWooooWooooWooooooooW',
  'xxWooooooooooooooooWooooWccccccccccccccccccWoooooooooWooooWooooWooooWooooooooooooooooooWooooWooooWoooooooow',
  'xWWooooooooooooooooWooooWccccccccccccccccccWoooooooooWooooWooooWooooWooooooooooooooooooWooooWooooWoooooooow',
  'WWoooooooooooooooooWooooWccccccccccccccccccWoooooooooWooooWooooWooooWooooooooooooooooooWooooWooooWoooooooow',
  'WooooooooooooooooooWooooWccccccccccccccccccWoooooooooWooooWooooWooooWooooooooooooooooooWooooWooooWooooooooW',
  'WWWwwwWWWwwwWWwwwWWWWwwWWWwwwWwwWWWwwWWwwwWWWwwWWwwWWWWwwWWWwwWWWwwWWWwwwWwwwWWwwwWwwwWWWwwWWWwwWWWwwWWwwWW'
];

/* ---- le mobilier ----
   Chaque meuble : k (sa nature), x, y (la case en haut à gauche), w, h (sa taille en cases), d (là où il regarde).
   Un poste de travail : la chaise est sur sa case, la table (deux écrans, clavier, souris) sur la case qu'elle regarde. */
function etageMeubles(){
  const M=[],m=(k,x,y,o)=>M.push(Object.assign({k,x,y,w:1,h:1},o||{}));
  const poste=(x,y,d)=>m('poste',x,y,{d});
  // un îlot de bureaux : une table en bois (2 cases de large) et un poste de chaque côté, aux rangées données
  const ilot=(x,y0,y1,rangs)=>{m('table',x,y0,{w:2,h:y1-y0+1,bois:1});rangs.forEach(y=>{poste(x-1,y,'right');poste(x+2,y,'left')})};
  // une salle de réunion : une table blanche, des chaises tout autour sauf côté écran
  const chaises=(xs,ys,d,st)=>xs.forEach(x=>ys.forEach(y=>m('chaise',x,y,{d,st})));
  const rg=(a,b)=>Array.from({length:b-a+1},(_,i)=>a+i);

  // ---- espaces de bureaux (89 postes)
  ilot(22,3,7,[3,5,7]);ilot(28,3,7,[3,5,7]);                                  // nord-ouest
  ilot(41,2,6,[2,4,6]);ilot(47,2,6,[2,4,6]);ilot(53,2,6,[2,4,6]);              // nord
  m('table',61,3,{bois:1});poste(61,2,'down');                                // le bureau fermé
  m('table',67,2,{w:2,h:3,bois:1});[2,4].forEach(y=>{poste(66,y,'right');poste(69,y,'left')});m('table',65,7,{bois:1});poste(65,8,'up');   // bureau violet
  m('table',76,2,{w:2,h:3,bois:1});[2,4].forEach(y=>{poste(75,y,'right');poste(78,y,'left')});m('table',80,7,{bois:1});poste(80,8,'up');   // bureau rose
  ilot(94,3,5,[3,5]);ilot(100,3,5,[3,5]);                                      // nord-est
  [7,14].forEach(x=>{m('table',x,26,{w:2,h:5,bois:1});[28,30].forEach(y=>{poste(x-1,y,'right');poste(x+2,y,'left')});poste(x+1,25,'down')});   // sud-ouest
  m('table',45,25,{w:2,h:2,bois:1});poste(45,24,'down');poste(47,26,'left');  // espace calme
  m('table',50,25,{w:2,h:2,bois:1});poste(51,24,'down');poste(49,26,'right');
  m('table',47,29,{bois:1});poste(47,30,'up');m('table',50,29,{bois:1});poste(50,30,'up');
  ilot(70,25,29,[25,27,29]);ilot(76,25,29,[25,27,29]);ilot(82,25,29,[25,27,29]);   // sud
  m('table',101,25,{w:2,h:6,bois:1});[26,28].forEach(y=>{poste(100,y,'right');poste(103,y,'left')});poste(101,24,'down');poste(102,31,'up');   // sud-est

  // ---- salles de réunion (nom, table, chaises, écran)
  m('table',34,2,{w:3,h:2});chaises([34,35,36],[1],'down');chaises([35,36],[4],'up');chaises([33],[2,3],'right');m('ecran',38,2,{h:2,mur:'e'});   // Bali
  m('table',84,3,{w:4,h:4});chaises(rg(84,87),[2],'down');chaises(rg(84,87),[7],'up');chaises([88],rg(3,6),'left');m('ecran',81,4,{h:2,mur:'w'});   // Jouzel
  m('table',99,11,{w:5,h:2});chaises(rg(99,103),[10],'down');chaises([98],[11,12],'right');chaises([104],[11,12],'left');m('ecran',100,15,{w:3,mur:'s'});   // Plass
  m('table',99,17,{w:5,h:2});chaises(rg(99,103),[16],'down','haute');chaises([98],[17,18],'right','haute');chaises([104],[17,18],'left','haute');m('ecran',100,20,{w:3,mur:'s'});   // Cancun
  const salle=(x,mur,st)=>{   // les salles du sud : 4 cases de large, table au milieu, écran à l'est ou à l'ouest
    m('table',x+1,26,{w:2,h:4});chaises([x+1,x+2],[25],'down',st);chaises([x+1,x+2],[30],'up',st);
    if(mur==='e'){chaises([x],rg(26,29),'right',st);m('ecran',x+4,27,{h:2,mur:'e'})}else{chaises([x+3],rg(26,29),'left',st);m('ecran',x-1,27,{h:2,mur:'w'})}};
  salle(20,'w','haute');salle(54,'e');salle(64,'e');salle(88,'w');salle(93,'e');   // Tyndall, Brainstorming, Copenhague, Newton, Paris
  // Repos : pas de table, pas d'écran
  m('canape',59,31,{w:3,d:'up',col:'#9ba0aa'});m('fatboy',59,26);m('pouf',60,28,{col:'#e2573b'});m('pouf',62,29,{col:'#f2c12e'});m('ballon',62,25);
  // les deux alcôves : écran au mur, table blanche, une banquette de chaque côté
  m('table',86,13,{w:2,h:2});m('banquette',86,12,{w:2,d:'down'});m('banquette',86,15,{w:2,d:'up'});m('ecran',85,13,{h:2,mur:'w'});
  m('table',86,18,{w:2});m('banquette',86,17,{w:2,d:'down'});m('banquette',86,19,{w:2,d:'up'});m('ecran',85,18,{mur:'w'});

  // ---- cafétéria
  m('frigo',42,24);m('vaisselle',42,25);m('evier',42,26);m('microondes',42,27);m('cafe',42,28);m('cafe',42,29);
  m('table',38,31,{w:4,bois:1});chaises(rg(38,41),[30],'down');m('chaise',37,31,{d:'right'});m('chaise',42,31,{d:'left'});
  m('armoire',31,31,{w:3});
  [28,32,36].forEach(x=>{m('rond',x,28);m('chaise',x,27,{d:'down'});m('chaise',x,29,{d:'up'});m('chaise',x-1,28,{d:'right'});m('chaise',x+1,28,{d:'left'})});
  m('canape',25,31,{w:3,d:'up',col:'#9ba0aa'});m('tbasse',26,30);m('chaise',25,29,{d:'down',st:'verte'});m('chaise',27,29,{d:'down',st:'verte'});
  m('ecran',24,25,{h:2,mur:'w'});m('babyfoot',26,25,{w:2});

  // ---- sanitaires
  m('cabine',39,12,{w:2,h:2,porte:'s'});m('cabine',41,12,{w:2,h:2,porte:'s'});m('lavabos',44,14,{h:5,mur:'e',n:3});m('serviettes',39,17,{mur:'w'});m('poubelle',39,19);   // femmes
  m('urinoir',47,12);m('cabine',49,12,{w:2,h:2,porte:'s'});m('cabine',51,12,{w:2,h:2,porte:'s'});m('lavabos',46,14,{h:5,mur:'w',n:3});m('serviettes',52,16,{mur:'e'});m('poubelle',52,18);   // hommes
  m('cabine',74,12,{w:2,h:2,porte:'s'});m('urinoir',77,12);m('lavabos',75,15,{w:2,mur:'s',n:2,savon:0});   // hommes (est)
  m('pmr',83,12);                                                                                      // PMR
  m('cabine',74,18,{w:2,h:2,porte:'n'});m('cabine',76,18,{w:2,h:2,porte:'n'});                       // femmes (est)

  // ---- casiers, ménage, reprographie
  m('casiers',36,6,{w:2,d:'down'});m('casiers',37,7,{d:'left'});
  m('casiers',35,17,{h:2,d:'right'});
  m('casiers',82,17,{w:3,d:'down'});
  m('casiers',91,12,{w:2,d:'up'});
  m('casiers',8,21,{w:11,d:'down'});
  m('chariot',15,10);m('balais',16,10);m('seau',14,12);
  m('imprimante',13,18,{w:2});m('fournitures',16,18,{w:2});
  return M;
}

/* ---- les plaques de porte ---- */
const ETAGE_PLAQUES=[['BALI',33,5],['JOUZEL',86,9],['PLASS',96,12],['CANCUN',96,18],['TYNDALL',20,23],['CAFETERIA',25,23],['BRAINSTORMING',53,23],['REPOS',59,23],['COPENHAGUE',65,23],['NEWTON',88,23],['PARIS',94,23],
  ['WC',41,20],['WC',48,20],['WC',78,11],['ALCOVE',86,11],['ALCOVE',86,20],['RGT',93,20]];

/* ---- l'état de la visite : le badge (remis à zéro à chaque arrivée) ---- */
const ETG={badge:false,ouv:0};
const ETAGE_ARRIVEE=[29,16];

/* ---- ce qui réagit quand on le touche ---- */
function etageObjets(o){
  const dire=t=>()=>say(t.map(x=>({t:x})));
  // l'ascenseur : on redescend en ville
  const sortir=()=>{if(busy||dlg.open)return;MAPS.etage.sortie()};
  [24,25,28,29,32,33].forEach(x=>o.push({x,y:15,kind:'none',solid:1,act:sortir,go:sortir}));
  // le lecteur de badge et les portes coulissantes du sas
  o.push({x:31,y:19,kind:'none',solid:1,act:etageBadger});
  [28,29,30].forEach(x=>o.push({x,y:19,kind:'none',get solid(){return ETG.ouv<1},get go(){return ETG.ouv<1?etageBadgeRefus:null},draw:(c,X,Y)=>etageDessinerPorteSas(c,X,Y,x)}));
  // les portes fermées, l'escalier de secours, l'ascenseur de service
  o.push({x:60,y:9,kind:'none',solid:1,act:dire(["La porte est fermée. Une étiquette : « Bureau. Merci de frapper. »","Tu frappes. Personne. Le bureau a des fenêtres sur le couloir… ah non, aucune. Mystère complet."])});
  [[19,15],[92,20]].forEach(([x,y])=>o.push({x,y,kind:'none',solid:1,act:dire(["RGT : local technique. Fermé à clé.","Derrière la porte, quelque chose ronronne. Probablement le réseau. Ou un chat. Personne n'a jamais vérifié."])}));
  for(let x=56;x<=63;x++)for(const y of [12,13,15,16])o.push({x,y,kind:'none',solid:1,act:dire(["Escalier de secours. Il ne sert qu'en cas d'alarme.","Certains le prennent quand même pour garder la forme. Leur consommation électrique : zéro. Leur dignité dans les marches du 3e : variable."])});
  [68,69].forEach(x=>o.push({x,y:16,kind:'none',solid:1,act:dire(["Ascenseur de service. Un panneau : « Réservé aux livraisons et à l'entretien. »","Le bouton d'appel est protégé par une clé. Tu n'as pas la clé. Tu as un badge, ce qui n'impressionne pas du tout l'ascenseur."])}));
}
function etageBadger(){
  if(ETG.badge){say([{t:"Le voyant est déjà vert. Les portes t'attendent."}]);return}
  ETG.badge=true;sfx('secret');say([{t:"Tu passes ton badge sur le lecteur. Bip ! Le voyant passe au vert."},{t:"Les portes coulissantes s'écartent dans un souffle. Bienvenue au bureau."}]);
}
function etageBadgeRefus(){
  if(ETG.ouv>=1)return;
  const n=performance.now();if(n-(etageBadgeRefus.t||0)<1500)return;etageBadgeRefus.t=n;
  if(P.y>19){ETG.badge=true;return}   // côté bureaux, les portes s'ouvrent toutes seules pour sortir
  sfx('bump');say([{t:"Les portes coulissantes restent fermées. Il faut badger : le lecteur est sur le mur, juste à droite."}]);
}
/* à chaque image : les portes du sas s'ouvrent quand on a badgé et qu'on est tout près, puis se referment */
function etageStep(k){
  if(S.map!=='etage')return;
  const pres=Math.abs(P.y-19)<=2&&P.x>=26&&P.x<=32,cote=P.y>19;
  if(cote&&pres)ETG.badge=true;
  const veut=ETG.badge&&pres;
  ETG.ouv=Math.max(0,Math.min(1,ETG.ouv+(veut?.08:-.05)*k));
}

/* ---- la carte ---- */
(function(){
  const g=ETAGE_PLAN.map(l=>l.split('')),w=g[0].length;
  g.forEach((l,i)=>{if(l.length!==w)throw new Error(`Étage : la rangée ${i+1} compte ${l.length} cases au lieu de ${w}.`)});
  const sol=g.map(l=>l.slice()),meubles=etageMeubles();
  // le mobilier est infranchissable (sauf ce qui est accroché au mur) : ses cases deviennent des « k »
  meubles.forEach(f=>{if(f.k==='ecran'||f.k==='serviettes')return;for(let j=0;j<f.h;j++)for(let i=0;i<f.w;i++)if(g[f.y+j]&&g[f.y+j][f.x+i]!==undefined)g[f.y+j][f.x+i]='k';
    if(f.k==='poste'){const [dx,dy]=DIRS[f.d];g[f.y+dy][f.x+dx]='k'}});
  let liste=null;
  MAPS.etage={g,sol,meubles,name:'Bureau',musique:'indoor',
    objectif:()=>ETG.badge?"Visite libre de l'étage. Pour repartir, reprends l'ascenseur, dans le sas.":"Badge au lecteur, à droite des portes coulissantes, pour entrer dans les bureaux.",cibles:()=>[],
    peindre:(c,dessus,m)=>etagePeindre(c,dessus,m),
    objets:o=>{if(!liste){liste=[];etageObjets(liste)}for(const x of liste)o.push(x)},
    sortie(){const b=BLD.find(b=>b.id==='etage');if(b)warp('town',b.door[0],b.door[1]+1,'down');else warp('town',P.x,P.y,'down')}};
})();
/* entrer : par l'ascenseur, dans le sas, badge à refaire */
function etageEntrer(){ETG.badge=false;ETG.ouv=0;warp('etage',ETAGE_ARRIVEE[0],ETAGE_ARRIVEE[1],'down')}
