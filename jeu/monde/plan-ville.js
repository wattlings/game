/* Wattlings · jeu/monde/plan-ville.js
   Le plan de la ville : rivière, boucle cyclable, les 8 quartiers et leurs emplacements. */

/* ================= PLAN DE LA VILLE =================
   Une boucle cyclable fait le tour de la ville, comme le cycle du cours. La rivière sépare la rive Data (est, étapes 1 à 4)
   de la rive Énergie (ouest, étapes 5 à 8). Chaque étape a son quartier : on y trouve ses infos clés et son arène.
   Le plan est d'abord décrit sur un quadrillage simple (coordonnées « logiques »), puis une déformation douce (WARP)
   fait onduler les rues, la rivière et les limites de quartier : la ville garde sa logique mais perd son quadrillage. */
const TW=108,TH=74;
const RIVER=[44,47];                         // colonnes (logiques) de la rivière
const RING={x0:18,x1:73,y0:22,y1:59,c:0};    // boucle cyclable, 2 cases de large, coins coupés sur c cases
const WIND0=86;                              // première colonne de la forêt de l'est (couloir du vent)
/* le plan est droit : rues, quartiers et bâtiments restent alignés (la déformation est neutre, on la garde pour pouvoir y revenir) */
const WARP=(x,y)=>[0,0];
const LWF=(x,y)=>[x,y];
const LW=(x,y)=>[Math.round(x),Math.round(y)];
const LINV=(X,Y)=>[X,Y];
/* seule la rivière serpente : droite sous la voie ferrée et les trois ponts, sinueuse entre les deux */
const RIVK=[[0,0],[6,0],[9,1.8],[13,-1.9],[17,-1],[21,0],[24,0],[28,.7],[32,-.6],[36,.8],[39,0],[42,0],[46,-1.9],[51,-1],[55,-1.9],[57.5,0],[60,0],[63,1.9],[67,-1.9],[70.5,0],[80,0]];
/* la rivière est une vraie courbe : son axe (en pixels) et sa demi-largeur pour chaque ligne de pixels ; une case est « rivière » quand l'eau en couvre plus de la moitié */
function riverCx(py){const y=py/16,m=(RIVER[0]+RIVER[1]+1)/2;for(let i=0;i<RIVK.length-1;i++){const [a,u]=RIVK[i],[b,v]=RIVK[i+1];if(y>=a&&y<=b){const f=(y-a)/(b-a),e=(1-Math.cos(f*Math.PI))/2;return (m+u+(v-u)*e)*16}}return m*16}
const riverHw=py=>31+2.5*Math.sin(py/47)+1.5*Math.sin(py/19+1);
const riverL=y=>Math.ceil((riverCx(y*16+8)-riverHw(y*16+8)-9)/16),riverR=y=>Math.floor((riverCx(y*16+8)+riverHw(y*16+8)-7)/16);
const L={
  office:{x:49,y:27,w:6,h:5,door:[51,31]},
  ecole:{x:59,y:26,w:9,h:6,door:[63,31]},
  bureau:{x:60,y:42,w:7,h:6,door:[63,47]},
  boulangerie:{x:48,y:43,w:7,h:5,door:[51,47]},
  mairie:{x:35,y:28,w:8,h:5,door:[38,32]},
  gare:{x:51,y:6,w:12,h:4,door:[56,9]},
  cabinet:{x:49,y:16,w:5,h:4,door:[51,19]},
  enedis:{x:74,y:26,w:6,h:5,door:[76,30]},
  grdf:{x:81,y:27,w:5,h:5,door:[83,31]},
  voltco:{x:74,y:34,w:6,h:5,door:[76,38]},
  media:{x:49,y:51,w:6,h:5,door:[51,55]},
  maison:{x:5,y:27,w:5,h:4,door:[7,30]},
  pharma:{x:36,y:16,w:5,h:4,door:[38,19]},
  villa:{x:4,y:62,w:6,h:4,door:[7,65]},
  arena:[null,{x:63,y:15,w:6,h:5,door:[66,19]},{x:80,y:34,w:6,h:5,door:[83,38]},{x:77,y:48,w:6,h:5,door:[80,52]},{x:61,y:52,w:6,h:5,door:[64,56]},
    {x:23,y:52,w:6,h:5,door:[26,56]},{x:6,y:44,w:6,h:5,door:[9,48]},{x:6,y:33,w:6,h:5,door:[9,37]},{x:26,y:15,w:7,h:5,door:[29,19]}],
  park:{x0:74,y0:61,x1:84,y1:70,gate:[79,61]},        // Parc des Données (hautes herbes clôturées)
  pool:{x0:11,y0:62,x1:16,y1:65},
  pond:{x0:23,y0:34,x1:28,y1:38},
  meteo:{x0:34,y0:64,x1:39,y1:68,gate:[36,64]},        // station météo clôturée
  pv:{x0:4,x1:11,rows:[14,16]},                        // parc solaire
  wind:{y0:41,y1:44},                                  // couloir du vent, dans la forêt de l'est
  machine:[6,9],
  box:[25,43],guard:[[26,44],[26,48],[24,48],[24,44]],
  fountain:[52,35],market:[29,45],
  train:[50,3]
};
/* chaque élément est déplacé d'un bloc par la déformation (les bâtiments restent rectangulaires) */
{const sh=(o,ax,ay)=>{const [nx,ny]=LW(ax,ay);return [nx-ax,ny-ay]};
  const bld=o=>{const [dx,dy]=sh(o,o.door[0],o.door[1]);o.x+=dx;o.y+=dy;o.door=[o.door[0]+dx,o.door[1]+dy]};
  ['office','ecole','bureau','boulangerie','mairie','gare','cabinet','enedis','grdf','voltco','media','maison','pharma','villa'].forEach(k=>bld(L[k]));L.arena.forEach(a=>a&&bld(a));
  const box=(o,g)=>{const [dx,dy]=sh(o,g?g[0]:(o.x0+o.x1)>>1,g?g[1]:(o.y0+o.y1)>>1);o.x0+=dx;o.x1+=dx;o.y0+=dy;o.y1+=dy;if(o.gate)o.gate=[o.gate[0]+dx,o.gate[1]+dy]};
  box(L.park,L.park.gate);box(L.pool);box(L.meteo,L.meteo.gate);
  L.pondL=Object.assign({},L.pond);                                   // l'étang garde ses coordonnées logiques : il est dessiné déformé
  {const [dx,dy]=sh(0,7,15);L.pv.x0+=dx;L.pv.x1+=dx;L.pv.rows=L.pv.rows.map(y=>y+dy)}
  {const [dx,dy]=sh(0,L.box[0],L.box[1]);L.box=[L.box[0]+dx,L.box[1]+dy];L.guard=L.guard.map(([x,y])=>[x+dx,y+dy])}
  L.machine=LW(L.machine[0],L.machine[1]);L.fountain=LW(L.fountain[0],L.fountain[1]);L.market=LW(L.market[0],L.market[1]);
}
/* quartiers : need = chapitre à partir duquel le quartier est ouvert ; r = zone logique (repère pour le nom sur la carte) ;
   reg = la région qui lui donne son décor ; le / au / de = le nom tel qu'il s'insère dans une phrase */
const QUARTERS=[
  {n:0,name:'Place de la Donnée',le:'la place de la Donnée',au:'place de la Donnée',reg:'Val de Loire',sub:'Ton bureau, les trois sites, le départ de la boucle',need:0,col:'#5b6380',r:[48,25,70,49]},
  {n:1,name:'Le Puy du Cadastre',le:'le Puy du Cadastre',au:'au Puy du Cadastre',de:'du Puy du Cadastre',reg:'Auvergne',step:'Cadrer',need:0,col:'#2f6db5',r:[48,5,73,23]},
  {n:2,name:'La Cité des Beffrois',le:'la Cité des Beffrois',au:'à la Cité des Beffrois',de:'de la Cité des Beffrois',reg:'Nord et Flandres',step:'Collecter',need:3,col:'#00968a',r:[72,24,85,45]},
  {n:3,name:'Le Clos du Tamis',le:'le Clos du Tamis',au:'au Clos du Tamis',de:'du Clos du Tamis',reg:'Normandie',step:'Fiabiliser',need:4,col:'#2f9e7a',r:[72,47,85,71]},
  {n:4,name:'Le Quartier des Colombages',le:'le Quartier des Colombages',au:'au Quartier des Colombages',de:'du Quartier des Colombages',reg:'Alsace',step:'Structurer',need:5,col:'#8a3b8f',r:[48,51,70,71]},
  {n:5,name:'Les Coteaux des Courbes',le:'les Coteaux des Courbes',au:'aux Coteaux des Courbes',de:'des Coteaux des Courbes',reg:'Bourgogne',step:'Analyser',need:6,col:'#f2a33a',r:[21,51,43,71]},
  {n:6,name:'L’Anse du Veilleur',le:'l’Anse du Veilleur',au:'à l’Anse du Veilleur',de:'de l’Anse du Veilleur',reg:'Bretagne',step:'Détecter',need:7,col:'#5b6ee0',r:[2,42,19,71]},
  {n:7,name:'Le Mas du Soleil',le:'le Mas du Soleil',au:'au Mas du Soleil',de:'du Mas du Soleil',reg:'Provence',step:'Agir',need:8,col:'#e2573b',r:[2,5,19,40]},
  {n:8,name:'L’Alpage de la Preuve',le:'l’Alpage de la Preuve',au:'à l’Alpage de la Preuve',de:'de l’Alpage de la Preuve',reg:'Savoie',step:'Mesurer',need:9,col:'#c9a227',r:[21,5,43,23]},
  {n:9,name:'Place de l’Énergie',le:'la place de l’Énergie',au:'place de l’Énergie',reg:'Val de Loire',sub:'L’hôtel de ville, le marché, le parc de l’étang',need:6,col:'#5b6380',r:[21,25,43,49]}
];
/* la région de chaque quartier (voir b_region.js) */
const REG=['loire','auvergne','nord','normandie','alsace','bourgogne','bretagne','provence','savoie','loire'];
/* emplacements des monuments : le terrain y est dégagé à la génération de la ville (cases logiques) */
const REG_SPOT={puy:[68,12],buron:[49,12],beffroi:[78,23],moulin:[83,11],terril:[83,24],chaumiere:[84,49],phare:[15,43],bergerie:[27,8],cabotte:[28,67]};
const REG_FIELDS=[[15,6,19,13],[14,24,16,28],[22,64,33,70],[37,52,42,55]];                     // lavande (2), vigne (2)
const REG_FREE=[[68,12],[69,12],[70,12],[68,11],[69,11],[70,11],[49,12],[50,12],[78,23],[83,11],[83,10],[83,24],[84,24],[85,24],[84,48],[85,48],[84,49],[85,49],[15,43],[27,7],[28,7],[27,8],[28,8],[28,67],[11,39],[12,39]];
/* à quel quartier appartient une case logique (-1 : hors de la ville). La rivière fait partie de la rive ouest. */
function zoneL(x,y){
  if(x<2||x>=WIND0||y<5||y>TH-3)return -1;
  if(x>riverR(y)){
    if(y<=23)return x<=73?1:2;
    if(y===24&&x<=70)return 1;
    if(x>=72||(x===71&&y<=49)||(x>=69&&y>=50))return y<=45?2:3;
    return y<=49?0:4;
  }
  if(y<=24)return x<=19?7:8;
  if(x<=20)return y<=41?7:6;
  return y<=50?9:5;
}
/* une limite entre deux quartiers est fermée tant que le plus tardif des deux n'est pas ouvert ; le pont du Nord attend le 8e badge */
const zoneRank=z=>QUARTERS[z].need*100+z;
const pairNeed=(a,b)=>(a===1&&b===8)||(a===8&&b===1)?10:Math.max(QUARTERS[a].need,QUARTERS[b].need);
const ZONE=[],INVM=[],TOWN_GATES=[];           // remplis par genTown : quartier et coordonnées logiques de chaque case, barrières
const quarterOpen=n=>n===10?S.ch>=10:S.ch>=QUARTERS[n].need;
const quarterAt=(x,y)=>{const z=ZONE[y]?ZONE[y][x]:-1;return z>=0?QUARTERS[z]:undefined};
const doorOf=id=>{const b=BLD.find(b=>b.id===id);return b?b.door:L.office.door};
const front=id=>{const d=doorOf(id);return [d[0],d[1]+1]};
const qLow=n=>QUARTERS[n].le,qAu=n=>QUARTERS[n].au;
/* position réelle d'un objet décrit en coordonnées logiques : la case libre la plus proche (mémorisée, jamais deux objets au même endroit) */
const TPC={},TPO=new Set();
function TP(x,y){
  const k=x+','+y;if(TPC[k])return TPC[k];const g=MAPS.town.g;let [X,Y]=LW(x,y);
  const ok=(a,b)=>{const t=g[b]&&g[b][a];return(t==='.'||t==='*'||t===','||t==='d')&&!TPO.has(a+','+b)};
  if(!ok(X,Y)){let best=null;for(let r=1;r<=5&&!best;r++)for(let dy=-r;dy<=r;dy++)for(let dx=-r;dx<=r;dx++){if(Math.max(Math.abs(dx),Math.abs(dy))!==r)continue;const d=Math.abs(dx)+Math.abs(dy);if(ok(X+dx,Y+dy)&&ZONE[Y+dy][X+dx]===zoneL(x,y)&&(!best||d<best[2]))best=[X+dx,Y+dy,d]}if(best){X=best[0];Y=best[1]}}
  TPO.add(X+','+Y);return TPC[k]=[X,Y];
}
