/* Wattlings · jeu/monde/etage.js
   « Bureau » : un étage de bureaux, reproduit d'après un vrai plan (une case ≈ 1 m).
   Le bâtiment est place de la Donnée, ouvert dès le début ; on arrive par l'ascenseur, dans le sas, et il faut badger.
   Pour l'instant, c'est une visite : pas de quête, personne aux postes.
   Le dessin (sols, murs, mobilier) est dans rendu/etage.js. */

/* ---- le plan : 107 cases sur 33, une chaîne par rangée ----
   On marche sur : o moquette   c carrelage   q parquet flottant   d porte ouverte   g porte coulissante du sas (il faut badger)
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
'xxxxxxxxxxxxWWooooodooBBBBBBBBBBBBBBBoWWWWWWWWWWWWWWWWdWWWWWWWWWWWBBBBBBoWWWWWWooWWWWWWWdWWoooooWooooooooow',
'xxxxxxxxxxxxWooooooWooBBBBBBBBBBBBBBBoWccccccccccccccWoorrrrrrrrooBBBBBBoWcccccWcWcccWooooWoooooWooooooooow',
'xxxxxxxxxxxWWWWWWWWWooBBBBBBBBBBBBBBBoWccccccccccccccWoorrrrrrrrooBBBBBBoWcccccWcWcccWooooWWWWWoWooooooooow',
'xxxxxxxxxxWWoooooooWooBBBBBBBBBBBBBBBoWccccccccccccccWoWWWWWWWWWooBBBBBBoWcccccWcWcccWooooWoooWodoooooooooW',
'xxxxxxxxxxWoooooooohooBBPPBBPPBBPPBBBoWccccccccccccccWoWrrrrrrrrooBBBBBBoWcccccdcdcccWooooWoooWoWWWWWWWWWWW',
'xxxxxxxxxWWooooooooWooWoooooooooooWoooWccccccccccccccWoWrrrrrrrrooBBPPBBoWWWWWWWdWWWWWWWWWWoooWoWoooooooooW',
'xxxxxxxxWWWWWWWWWWWWooWoooooooooooWoooWccccccccccccccWoWWWWWWWWWWoWooooWoWcccccccWoooWooooWoooWodooooooooow',
'xxxxxxxxWWooooooooodooWoooooooooooWoooWccccccccccccccWooooooooooooWooooWoWcccccccWoooWooooWoooWoWooooooooow',
'xxxxxxxWWooooooooooWooWWWWWWgggWWWWoooWccccccccccccccWooooooooooooWooooWoWcccccccWoooWooooWoooWoWoooooooooW',
'xxxxxxWWWWWWWWWWWWWWooooooooooooooooooWWWWWWWddWWWWWWWWWWWWWWWWWWoWoooWooWWWWWWWWWoWWWWWdWWWhWWoWWWWWWWWWWW',
'xxxxxxWWooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooW',
'xxxxxWWoooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooW',
'xxxxxWoooooooooooooWWWWdWfffffffddfffffffffWoooooooooWWWdWWWWdWWdWWWWooooooooooooooooooWWWWdWdWWWWoooooooow',
'xxxxWWoooooooooooooWooooWqqqqqqqqqqqqqqqqqqWoooooooooWooooWooooWooooWooooooooooooooooooWooooWooooWoooooooow',
'xxxWWooooooooooooooWooooWqqqqqqqqqqqqqqqqqqWoooooooooWooooWooooWooooWooooooooooooooooooWooooWooooWoooooooow',
'xxxWoooooooooooooooWooooWqqqqqqqqqqqqqqqqqqWoooooooooWooooWooooWooooWooooooooooooooooooWooooWooooWooooooooW',
'xxWWoooooooooooooooWooooWqqqqqqqqqqqqqqqqqqWoooooooooWooooWooooWooooWooooooooooooooooooWooooWooooWooooooooW',
'xxWooooooooooooooooWooooWqqqqqqqqqqqqqqqqqqWoooooooooWooooWooooWooooWooooooooooooooooooWooooWooooWoooooooow',
'xWWooooooooooooooooWooooWqqqqqqqqqqqqqqqqqqWoooooooooWooooWooooWooooWooooooooooooooooooWooooWooooWoooooooow',
'WWoooooooooooooooooWooooWqqqqqqqqqqqqqqqqqqWoooooooooWooooWooooWooooWooooooooooooooooooWooooWooooWoooooooow',
'WooooooooooooooooooWooooWqqqqqqqqqqqqqqqqqqWoooooooooWooooWooooWooooWooooooooooooooooooWooooWooooWooooooooW',
'WWWwwwWWWwwwWWwwwWWWWwwWWWwwwWwwWWWwwWWwwwWWWwwWWwwWWWWwwWWWwwWWWwwWWWwwwWwwwWWwwwWwwwWWWwwWWWwwWWWwwWWwwWW'];

/* ---- le mobilier ----
   Chaque meuble : k (sa nature), x, y (la case en haut à gauche), w, h (sa taille en cases), d (là où il regarde).
   Un poste de travail : la chaise est sur sa case ; devant elle, la table sur deux cases de profondeur
   (le clavier sur la première, les deux écrans au fond de la seconde). */
function etageMeubles(){
  const M=[],m=(k,x,y,o)=>M.push(Object.assign({k,x,y,w:1,h:1},o||{}));
  const poste=(x,y,d)=>m('poste',x,y,{d});
  // un îlot : une table en bois de 4 cases de large (2 par côté), les postes face à face aux rangées données
  const ilot=(x,y0,y1,rangs)=>{m('table',x,y0,{w:4,h:y1-y0+1,bois:1});rangs.forEach(y=>{poste(x-1,y,'right');poste(x+4,y,'left')})};
  // le même îlot avec une table de 3 cases (là où il faut garder un passage entre les îlots)
  const ilot3=(x,y0,y1,rangs)=>{m('table',x,y0,{w:3,h:y1-y0+1,bois:1});rangs.forEach(y=>{poste(x-1,y,'right');poste(x+3,y,'left')})};
  // un bureau seul : une table de 3 cases sur 2, la chaise au milieu
  const seul=(x,y,d)=>{const T={up:[x-1,y-2,3,2],down:[x-1,y+1,3,2],left:[x-2,y-1,2,3],right:[x+1,y-1,2,3]}[d];m('table',T[0],T[1],{w:T[2],h:T[3],bois:1});poste(x,y,d)};
  const chaises=(pos,d,st)=>pos.forEach(([x,y])=>m('chaise',x,y,{d,st}));

  // ---- espaces de bureaux (89 postes)
  ilot(20,3,7,[3,5,7]);ilot(27,3,7,[3,5,7]);                                  // nord-ouest
  ilot(40,2,6,[2,4,6]);ilot(46,2,6,[2,4,6]);ilot(52,2,6,[2,4,6]);              // nord
  seul(61,2,'down');                                                           // le bureau fermé
  ilot(65,2,4,[2,4]);seul(65,8,'up');                                          // bureau violet
  ilot(74,2,4,[2,4]);seul(79,8,'up');                                          // bureau rose
  ilot(92,3,5,[3,5]);ilot(99,3,5,[3,5]);                                       // nord-est
  [6,13].forEach(x=>{m('table',x,26,{w:4,h:5,bois:1});[28,30].forEach(y=>{poste(x-1,y,'right');poste(x+4,y,'left')});poste(x+1,25,'down')});   // sud-ouest
  m('table',44,25,{w:3,h:2,bois:1});poste(44,24,'down');poste(47,26,'left');  // espace calme
  m('table',49,25,{w:3,h:2,bois:1});poste(51,24,'down');poste(48,26,'right');
  seul(47,31,'up');seul(50,31,'up');
  ilot3(70,25,29,[25,27,29]);ilot3(76,25,29,[25,27,29]);ilot3(82,25,29,[25,27,29]);   // sud (un passage entre chaque îlot)
  m('table',100,25,{w:4,h:6,bois:1});[27,28].forEach(y=>{poste(99,y,'right');poste(104,y,'left')});poste(101,24,'down');poste(102,31,'up');   // sud-est

  // ---- salles de réunion : une table blanche, quelques chaises, l'écran au mur indiqué
  m('table',34,2,{w:3,h:2});chaises([[34,1],[36,1]],'down');chaises([[33,2],[33,3]],'right');m('ecran',38,2,{h:2,mur:'e'});   // Voltaire
  m('table',84,3,{w:4,h:4});chaises([[85,2],[86,2]],'down');chaises([[85,7],[86,7]],'up');chaises([[88,4],[88,5]],'left');m('ecran',81,4,{h:2,mur:'w'});   // Watterloo
  m('table',99,11,{w:5,h:2});chaises([[100,10],[102,10]],'down');chaises([[98,11]],'right');chaises([[104,11]],'left');m('ecran',100,15,{w:3,mur:'s'});   // Jouliette
  m('table',99,17,{w:5,h:2});chaises([[100,16],[102,16]],'down','haute');chaises([[98,17]],'right','haute');chaises([[104,17]],'left','haute');m('ecran',100,20,{w:3,mur:'s'});   // Ampérium
  const salle=(x,mur,st)=>{   // les salles du sud : 4 cases de large, table au milieu, écran à l'est ou à l'ouest
    m('table',x+1,26,{w:2,h:4});chaises([[x+1,25]],'down',st);chaises([[x+2,30]],'up',st);
    if(mur==='e'){chaises([[x,26],[x,28]],'right',st);m('ecran',x+4,27,{h:2,mur:'e'})}else{chaises([[x+3,26],[x+3,28]],'left',st);m('ecran',x-1,27,{h:2,mur:'w'})}};
  salle(20,'w','haute');salle(54,'e');salle(64,'e');salle(88,'w');salle(93,'e');   // Ohméga, Tempête, Bobine, Dynamo, Pile Poil
  // Veille (le repos) : pas de table, pas d'écran
  m('canape',59,31,{w:3,d:'up',col:'#9ba0aa'});m('fatboy',59,26);m('pouf',60,28,{col:'#e2573b'});m('pouf',62,29,{col:'#f2c12e'});m('ballon',62,25);
  // le Nid et le Terrier (les alcôves) : écran au mur, table blanche, une banquette de chaque côté
  m('table',86,13,{w:2,h:2});m('banquette',86,12,{w:2,d:'down'});m('banquette',86,15,{w:2,d:'up'});m('ecran',85,13,{h:2,mur:'w'});
  m('table',86,18,{w:2});m('banquette',86,17,{w:2,d:'down'});m('banquette',86,19,{w:2,d:'up'});m('ecran',85,18,{mur:'w'});

  // ---- le Perco (la cafétéria)
  // la cuisine occupe tout le mur est, du nord au sud
  m('frigo',42,24);m('comptoir',42,25);m('vaisselle',42,26);m('evier',42,27);m('comptoir',42,28);m('microondes',42,29);m('cafe',42,30);m('cafe',42,31);
  // la grande table en bois, dans le sens nord-sud, un bout contre le mur sud ; on longe la cuisine par la colonne 41
  m('table',38,28,{w:2,h:4,bois:1});chaises([[37,28],[37,29],[37,30],[37,31]],'right');chaises([[40,28],[40,29],[40,30],[40,31]],'left');
  m('armoire',31,31,{w:3});
  // trois tables rondes alignées sur l'armoire, un passage entre elles (la dernière n'a pas de chaise côté est : la grande table est là)
  [28,32,36].forEach(x=>{m('rond',x,28);chaises([[x,27]],'down');chaises([[x,29]],'up');chaises([[x-1,28]],'right');if(x<36)chaises([[x+1,28]],'left')});
  // le coin salon, contre le mur ouest : canapé, table basse, deux fauteuils verts en face ; plus au nord l'écran et le babyfoot
  m('canape',25,29,{h:3,d:'right',col:'#9ba0aa'});m('tbasse',26,30);chaises([[27,29],[27,31]],'left','verte');
  m('ecran',24,25,{h:2,mur:'w'});m('babyfoot',26,25,{w:2});

  // ---- sanitaires
  // le bloc central (d'après le croquis) : un petit hall commun au sud ; de chaque côté une cabine au nord, une cabine en long
  // au centre qui ouvre sur ses toilettes, et les lavabos le long du mur extérieur
  m('cabine',41,12,{w:3,h:2,porte:'s'});m('cabine',44,12,{w:2,h:5,porte:'w'});m('lavabos',39,14,{h:5,mur:'w',n:3});m('serviettes',39,13,{mur:'w'});m('poubelle',39,19);   // femmes
  m('cabine',46,12,{w:2,h:5,porte:'e'});m('cabine',48,12,{w:3,h:2,porte:'s'});m('urinoir',51,12);m('lavabos',52,14,{h:5,mur:'e',n:3});m('serviettes',52,13,{mur:'e'});m('poubelle',52,19);   // hommes
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

/* ---- les salles et les open spaces (moquette claire) ; tout le reste de la moquette est couloir (moquette foncée) ---- */
const ETAGE_SALLES=[[0,1,31,8],[33,1,37,4],[36,6,37,8],[39,1,57,8],[59,1,62,8],[64,1,71,8],[73,1,80,8],[82,1,89,8],[91,1,105,8],
  [0,10,18,12],[0,14,18,16],[0,18,18,19],[23,16,33,18],[86,12,89,15],[86,17,89,19],[91,14,93,19],[82,17,84,19],[97,10,105,14],[97,16,105,19],
  [0,23,18,31],[20,24,23,31],[44,23,52,31],[54,24,57,31],[59,24,62,31],[64,24,67,31],[69,23,86,31],[88,24,91,31],[93,24,96,31],[98,23,105,31]];
const etageSalle=(x,y)=>ETAGE_SALLES.some(([a,b,c,d])=>x>=a&&x<=c&&y>=b&&y<=d);

/* ---- les plaques de porte ---- */
const ETAGE_PLAQUES=[['VOLTAIRE',35,5],['WATTERLOO',82,9],['JOULIETTE',96,12],['AMPERIUM',96,18],['OHMEGA',20,23],['LE PERCO',25,23],['TEMPETE',53,23],['VEILLE',59,23],['BOBINE',65,23],['DYNAMO',88,23],['PILE POIL',94,23],
  ['WC F',42,20],['WC H',47,20],['WC',78,11],['NID',86,11],['TERRIER',86,20],['RGT',93,20]];

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
