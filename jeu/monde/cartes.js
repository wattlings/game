/* Wattlings · jeu/monde/cartes.js
   Les cartes : la ville et les intérieurs, générés case par case. */

/* ================= CARTES ================= */
const TS=16;let VW=15,VH=11;
const BLD=['office','ecole','bureau','boulangerie','mairie','gare','enedis','grdf','voltco','media','cabinet','pharma','maison','villa'].map(id=>({id,...L[id]}));
Object.assign(BLD[0],{roof:'#5a6b8c',wall:'#e6e2d8'});Object.assign(BLD[4],{roof:'#5b4a7a',wall:'#efe6d2'});Object.assign(BLD[5],{roof:'#7a4a3a',wall:'#f1e6d0'});
BLD.forEach(b=>{if(SITES[b.id]){b.roof=SITES[b.id].roof;b.wall=SITES[b.id].wall}if(typeof LOCALS!=='undefined'&&LOCALS[b.id]){b.roof=LOCALS[b.id].roof;b.wall=LOCALS[b.id].wall}});
function grid(w,h,ch){return Array.from({length:h},()=>Array(w).fill(ch))}
function rect(g,x0,y0,x1,y1,ch){for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++)if(g[y]&&g[y][x]!==undefined)g[y][x]=ch}
const POOL=Object.assign({told:false},L.pool);
const thash=(a,b)=>{let h=(a*374761393+b*668265263)^(a*b+77);h=(h^(h>>13))*1274126177;return((h^(h>>16))>>>0)/4294967295};
/* bruit doux (0..1) : sert à regrouper les arbres en bosquets, les fleurs en prairies */
function vnoise(x,y){const xi=Math.floor(x),yi=Math.floor(y),f=t=>t*t*(3-2*t),u=f(x-xi),v=f(y-yi),a=thash(xi,yi),b=thash(xi+1,yi),c=thash(xi,yi+1),d=thash(xi+1,yi+1);return a+(b-a)*u+(c-a)*v+(a-b-c+d)*u*v}
const TOWN_ROADS=[[[32,22],[32,58]],[[56,10],[56,58]],[[32,40],[71,40]],[[4,22],[21,22]],[[4,58],[21,58]],[[69,58],[79,58]]];
const TOWN_PATHS=[[[52,10],[61,10]],[[48,33],[58,33],[60,34],[70,33]],[[51,48],[56,48]],[[57,48],[63,48]],[[34,34],[38,34]],[[27,44],[32,44]],
  [[73,32],[79,32],[80,33],[85,32]],[[73,40],[85,40]],[[73,54],[78,54],[79,55],[84,54]],[[56,60],[57,62],[62,62]],[[33,60],[33,62]],[[26,62],[32,62],[33,63],[38,62]],
  [[4,50],[11,50],[12,51],[18,50]],[[4,67],[17,67]],[[17,60],[17,67]],[[4,40],[18,40]],[[4,32],[10,32],[11,31],[18,32]],[[13,21],[13,16],[12,15],[13,10]],[[7,10],[13,10]],[[4,18],[12,18]],[[82,22],[82,15]]];
const TOWN_WOODS=[[75,6,85,22,.6],[2,5,12,12,.65],[21,6,25,15,.5],[40,6,43,15,.5],[67,6,73,13,.45],[22,26,30,31,.32],[22,45,31,49,.2],[48,60,55,71,.34],[59,64,70,71,.34],[21,64,31,71,.4],[40,60,43,71,.34],[2,52,17,57,.25],[2,68,19,71,.55],[74,47,76,53,.4],[60,36,69,39,.12],[34,43,42,48,.12],[75,41,84,45,.1]];
const TOWN_CLEAR=[[66,10,73,14],[80,9,85,13],[25,6,32,11],[76,19,80,22],[13,40,17,43],[80,10,84,14],[5,8,13,11],[23,29,27,31],[23,42,27,49],[4,53,12,55],[82,15,82,22]];
const ringPts=()=>{const {x0,x1,y0,y1,c}=RING;return [[x0+c,y0],[x1-1-c,y0],[x1-1,y0+c],[x1-1,y1-1-c],[x1-1-c,y1-1],[x0+c,y1-1],[x0,y1-1-c],[x0,y0+c],[x0+c,y0]]};
const TOWN_WARN=[],TOWN_LEADS=[];
function genTown(){TOWN_WARN.length=0;
  const W=TW,H=TH,g=grid(W,H,'.'),[r0,r1]=RIVER,inR=(p,r)=>p[0]>=r[0]&&p[0]<=r[2]&&p[1]>=r[1]&&p[1]<=r[3];
  // 1. chaque case réelle connaît sa case logique et son quartier
  for(let y=0;y<H;y++){INVM[y]=[];ZONE[y]=[];for(let x=0;x<W;x++){const p=LINV(x,y);p[0]=Math.max(0,Math.min(W-1,p[0]));p[1]=Math.max(0,Math.min(H-1,p[1]));INVM[y][x]=p;ZONE[y][x]=zoneL(p[0],p[1])}}
  // 2. le paysage : lisière, forêt de l'est et couloir du vent, champ d'éoliennes, rivière, voie ferrée, étang, places, bois, prairies
  const P0=L.pondL,pcx=(P0.x0+P0.x1)/2,pcy=(P0.y0+P0.y1)/2,pa=(P0.x1-P0.x0)/2+.4,pb=(P0.y1-P0.y0)/2+.4;
  for(let y=0;y<H;y++)for(let x=0;x<W;x++){const p=INVM[y][x],lx=p[0],ly=p[1],h=thash(x,y);let t='.';
    if(lx<2||ly<2||lx>=W-2||ly>=H-2)t='T';
    else if(lx>=WIND0&&lx<=WIND0+5)t=ly>=L.wind.y0&&ly<=L.wind.y1?(lx===WIND0+5?'w':'.'):'T';
    else if(lx>WIND0+5)t=h>.95?'T':h<.05?'*':'.';
    else if(ly===3||ly===4)t='r';                      // la voie ferrée passe avant la rivière : elle la franchit sur un viaduc
    else if(lx>=riverL(ly)&&lx<=riverR(ly))t='R';
    else if(ly===5&&lx>=48&&lx<=66)t='q';
    else if(((lx-pcx)/pa)**2+((ly-pcy)/pb)**2<=1)t='~';
    else if(inR(p,[49,34,56,38])||inR(p,[27,43,32,47]))t=',';
    else if(inR(p,[10,33,17,38])&&vnoise(x/3,y/3)>.35)t='d';
    else{const wd=TOWN_WOODS.find(r=>inR(p,r));
      if(wd&&!TOWN_CLEAR.some(r=>inR(p,r))&&h<wd[4]*(.25+1.5*vnoise(x/4.2+9,y/4.2)))t='T';
      else{const zr=REG[ZONE[y][x]],fl=vnoise(x/6+40,y/6+7);if(zr==='provence'||zr==='bourgogne'?(vnoise(x/5+11,y/5+3)>.5?h<.94:h<.01):fl>.66?h<.3:h<.018)t='*'}}
    g[y][x]=t}
  // 3. pistes cyclables (2 cases de large) : la boucle, les avenues ; un pont là où elles croisent la rivière
  const stamp=(X,Y)=>{for(let j=0;j<2;j++)for(let i=0;i<2;i++){const t=g[Y+j]&&g[Y+j][X+i];if(t!==undefined&&t!=='r'&&t!=='q')g[Y+j][X+i]=t==='R'||t==='g'?'g':'b'}};
  const line=(pts,f)=>{for(let k=0;k<pts.length-1;k++){const [ax,ay]=pts[k],[bx,by]=pts[k+1],n=Math.max(1,Math.ceil(Math.max(Math.abs(bx-ax),Math.abs(by-ay))*3));for(let i=0;i<=n;i++){const p=LWF(ax+(bx-ax)*i/n,ay+(by-ay)*i/n);f(Math.round(p[0]),Math.round(p[1]))}}};
  [ringPts(),...TOWN_ROADS].forEach(r=>line(r,stamp));
  g[RING.y0][RING.x1]='.';                            // le virage nord-est est un arc : son coin extérieur reste en herbe
  // 4. allées piétonnes (1 case)
  const soft=(x,y)=>{const t=g[y]&&g[y][x];if(t==='.'||t==='*'||(t==='T'&&x>2&&y>5&&x<WIND0-1&&y<H-3))g[y][x]='='};
  TOWN_PATHS.forEach(r=>{let pv=null;line(r,(X,Y)=>{if(pv&&X!==pv[0]&&Y!==pv[1])soft(X,pv[1]);soft(X,Y);pv=[X,Y]})});
  // 5. ce qui reste rectangulaire : Parc des Données, piscine, station météo, bâtiments
  const K=L.park;rect(g,K.x0,K.y0,K.x1,K.y1,'f');rect(g,K.x0+1,K.y0+1,K.x1-1,K.y1-1,':');g[K.gate[1]][K.gate[0]]='=';
  rect(g,POOL.x0,POOL.y0,POOL.x1,POOL.y1,'p');
  const M=L.meteo;rect(g,M.x0,M.y0,M.x1,M.y1,'f');rect(g,M.x0+1,M.y0+1,M.x1-1,M.y1-1,'.');g[M.gate[1]][M.gate[0]]='=';
  BLD.forEach(b=>{for(let y=b.y-1;y<=b.y+b.h;y++)for(let x=b.x-1;x<=b.x+b.w;x++)if(g[y]&&(g[y][x]==='T'||g[y][x]==='~'))g[y][x]='.';
    for(let y=b.y;y<b.y+b.h;y++)for(let x=b.x;x<b.x+b.w;x++){const t=g[y][x];if(t==='R'||t==='b'||t==='g'||t==='p'||t==='f'||t==='B')TOWN_WARN.push(b.id+':'+t+'@'+x+','+y)}
    rect(g,b.x,b.y,b.x+b.w-1,b.y+b.h-1,'B');g[b.door[1]][b.door[0]]='D'});
  // chaque porte (et chaque portillon) est reliée à la rue par une allée
  TOWN_LEADS.length=0;
  const lead=(x,y)=>{const z=ZONE[y][x];let k=0;for(;k<9;k++){const t=g[y+k]&&g[y+k][x];if((t==='.'||t==='*'||t==='T'||t==='d')&&ZONE[y+k][x]===z)g[y+k][x]='=';else break}
    if(k){const e=g[y+k]&&g[y+k][x];TOWN_LEADS.push([x,y*TS-3,(y+k)*TS+(e==='b'||e==='='||e===','?8:-6)])}};
  BLD.forEach(b=>lead(b.door[0],b.door[1]+1));
  {const up=(x,y)=>{let k=0;for(;k<6;k++){const t=g[y-k]&&g[y-k][x];if(t==='.'||t==='*'||t==='T')g[y-k][x]='=';else break}
    if(k){const e=g[y-k]&&g[y-k][x];TOWN_LEADS.push([x,(y-k+1)*TS-(e==='b'||e==='='?8:-6),(y+1)*TS+8])}};up(K.gate[0],K.gate[1]-1);up(M.gate[0],M.gate[1]-1)}
  // 6. limites de quartier : des haies, des buissons, des arbres, une palissade ; là où une piste les traverse, une barrière
  TOWN_GATES.length=0;
  {const road=t=>t==='b'||t==='g'||t==='=',walk=t=>t==='.'||t==='*'||t===','||t==='d',marks=[];
    for(let y=1;y<H-1;y++)for(let x=1;x<W-1;x++){const z=ZONE[y][x];if(z<0)continue;
      for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]){const z2=ZONE[y+dy][x+dx];if(z2<0||z2===z||zoneRank(z)<zoneRank(z2))continue;
        const tu=g[y][x],tv=g[y+dy][x+dx];
        if(road(tu)){if(road(tv)){if(!TOWN_GATES.some(G=>G.x===x&&G.y===y))TOWN_GATES.push({x,y,need:pairNeed(z,z2),q:pairNeed(z,z2)===10?10:z})}else if(walk(tv))marks.push([x+dx,y+dy,z2,z])}
        else if(walk(tu))marks.push([x,y,z,z2])}}
    marks.forEach(([x,y,a,b])=>{const n=vnoise(x/7+3,y/7+1),h=thash(x*7+3,y*11+5),pl=a===0||b===0||a===9||b===9;
      g[y][x]=regBorder(a,h,n)})}
  [L.box,...L.guard].forEach(([x,y])=>{for(let j=-1;j<=1;j++)for(let i=-1;i<=1;i++){const t=g[y+j][x+i];if(t==='T'||t==='u'||t==='k')g[y+j][x+i]='.'}});
  // 7. deux arbres remarquables, puis des buissons et des rochers isolés (jamais là où ils gêneraient le passage)
  L.trees=[LW(69,36),LW(25,30)];L.trees.forEach(([x,y])=>{if(g[y][x]!=='B'&&g[y][x]!=='b')g[y][x]='T';if(g[y+1][x]==='T'||g[y+1][x]==='u')g[y+1][x]='.'});
  for(let y=6;y<H-3;y++)for(let x=3;x<WIND0-1;x++){if(g[y][x]!=='.')continue;let free=true;for(let j=-1;j<=1&&free;j++)for(let i=-1;i<=1;i++){const t=g[y+j][x+i];if(t!=='.'&&t!=='*'){free=false;break}}
    if(!free)continue;const h=thash(x*5+1,y*3+2),n=vnoise(x/5+70,y/5+20);if(h<.012+.05*Math.max(0,n-.55))g[y][x]=h<.008?'k':'u'}
  regTerrain(g);
  return g;
}
/* après la génération : les personnages et objets décrits en coordonnées logiques prennent leur place réelle */
function placeTown(){
  for(const k in TPC)delete TPC[k];TPO.clear();const res=(x,y)=>TPO.add(x+','+y);
  BLD.forEach(b=>{const [dx,dy]=b.door;[-2,0,2].forEach(a=>res(dx+a,dy+1));res(dx,dy+2);res(dx,dy+3)});
  res(L.box[0],L.box[1]);L.guard.forEach(p=>res(p[0],p[1]));res(L.machine[0],L.machine[1]);res(L.machine[0]+1,L.machine[1]);
  for(let j=0;j<2;j++)for(let i=0;i<2;i++)res(L.fountain[0]+i,L.fountain[1]+j);res(L.market[0],L.market[1]);res(L.market[0]-1,L.market[1]);
  {const K=L.park.gate;res(K[0],K[1]-1);res(K[0]+2,K[1]-1);res(K[0]+2,K[1]);res(L.meteo.gate[0],L.meteo.gate[1]-1)}
  for(let x=L.pv.x0;x<=L.pv.x1;x++)L.pv.rows.forEach(y=>res(x,y));
  Object.keys(SRC).forEach(k=>{const s=SRC[k];if(s.map!=='town'||s.x===undefined)return;if(s.lx===undefined){s.lx=s.x;s.ly=s.y}
    if(k==='marchand'){s.x=L.market[0];s.y=L.market[1]}else [s.x,s.y]=TP(s.lx,s.ly)});
}
function genOffice(){const W=12,H=9,g=grid(W,H,'o');rect(g,0,0,W-1,1,'W');rect(g,0,0,0,H-1,'W');rect(g,W-1,0,W-1,H-1,'W');rect(g,0,H-1,W-1,H-1,'W');g[H-1][5]='E';return g}
function genRdc(){const W=16,H=11,g=grid(W,H,'o');rect(g,0,0,W-1,1,'W');rect(g,0,0,0,H-1,'W');rect(g,W-1,0,W-1,H-1,'W');rect(g,0,H-1,W-1,H-1,'W');
  rect(g,5,2,5,6,'W');g[4][5]='o'; // cloison de la pièce technique / cuisine
  g[H-1][7]='E';g[2][14]='S';return g}
function genCave(){const W=12,H=9,g=grid(W,H,'c');rect(g,0,0,W-1,1,'W');rect(g,0,0,0,H-1,'W');rect(g,W-1,0,W-1,H-1,'W');rect(g,0,H-1,W-1,H-1,'W');g[2][1]='U';return g}
function genMairie(){const W=14,H=10,g=grid(W,H,'o');rect(g,0,0,W-1,1,'W');rect(g,0,0,0,H-1,'W');rect(g,W-1,0,W-1,H-1,'W');rect(g,0,H-1,W-1,H-1,'W');g[H-1][6]='E';return g}
const MAPS={local:{g:genLocal(),name:'Intérieur'},mairie:{g:genMairie(),name:'Hôtel de ville'},town:{g:genTown(),name:'Ampère-sur-Loire'},office:{g:genOffice(),name:'Ton bureau'},rdc:{g:genRdc(),name:'Rez-de-chaussée'},cave:{g:genCave(),name:'Cave'}};
const SOLID=new Set(['T','W','~','f','B','w','p','x','h','R','r','u','k','P','m']);
