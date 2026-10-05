/* Wattlings · jeu/rendu/regions-nature.js
   Un tour de France en huit quartiers : herbe, arbres, haies, murets, cultures, allées et emblèmes de chaque région. */

/* ================= UN TOUR DE FRANCE EN HUIT QUARTIERS =================
   Chaque quartier emprunte son décor à une région, choisie pour ce qu'elle dit de l'étape :
   Cadrer → Auvergne (les puys, d'où l'on voit tout le terrain) ; Collecter → Nord (briques, beffrois, réseaux) ;
   Fiabiliser → Normandie (le bocage, des prés bien clos) ; Structurer → Alsace (les colombages : la structure se voit) ;
   Analyser → Bourgogne (les coteaux, des rangs qui suivent les courbes) ; Détecter → Bretagne (le phare qui veille la nuit) ;
   Agir → Provence (le soleil, le parc solaire) ; Mesurer → Savoie (l'alpage, la station d'altitude).
   Les deux places, au bord de la rivière, restent du pays : le Val de Loire, tuffeau blanc et ardoise.
   La région règle l'architecture, les arbres, l'herbe, les cultures, les allées, les murets, les habitants. */
const regAt=(x,y)=>{const z=ZONE[y]?ZONE[y][x]:-1;return z>=0?REG[z]:''};
const bldReg=b=>{const z=zoneL(b.door[0],b.door[1]);return z>=0?REG[z]:'loire'};
const hexMix=(a,b,t)=>{const p=hex3(a),q=hex3(b);return '#'+((1<<24)|(Math.round(p[0]+(q[0]-p[0])*t)<<16)|(Math.round(p[1]+(q[1]-p[1])*t)<<8)|Math.round(p[2]+(q[2]-p[2])*t)).toString(16).slice(1)};
/* ---- l'herbe : plus sèche en Provence, plus grasse en Normandie, plus sombre en Bretagne… ---- */
const ZG=[];let ZG0=null;
function regGrassInit(p){ZG0=p.slice();for(let z=0;z<REG.length;z++){const g=REG_GRASS[REG[z]];ZG[z]=g&&!SEA.snow?p.map(c=>hexMix(c,g[0],g[1])):p.slice()}}
function zoneGrass(x,y){const z=ZONE[y]?ZONE[y][x]:-1,p=z>=0?ZG[z]:ZG0;if(!p)return;GCOL[0]=p[0];GCOL[1]=p[1];GCOL[2]=p[2];GT[0]=p[3];GT[1]=p[4]}
/* ---- les arbres : essence selon la région (0 chêne, 1 sapin, 2 bouleau, 3 pommier, 4 cyprès, 5 olivier, 6 peuplier) ---- */
const REG_TREES={auvergne:[[1,.55],[0,.9],[2,1]],nord:[[6,.5],[2,.75],[0,1]],normandie:[[3,.58],[0,1]],alsace:[[0,.5],[2,.8],[1,1]],bourgogne:[[0,.55],[6,.85],[3,1]],
  bretagne:[[0,.55],[1,.92],[2,1]],provence:[[5,.45],[4,.8],[0,1]],savoie:[[1,.86],[2,1]]};
const treeEver=sp=>sp===1||sp===4||sp===5;
function artTreeKind(x,y){
  const z=ZONE[y]?ZONE[y][x]:-1,T=z>=0&&x<WIND0?REG_TREES[REG[z]]:null;
  if(T){const h=wh(x,y,300);for(const [sp,p] of T)if(h<p)return sp}
  const h=thash(x,y);if(x>=WIND0||y<14&&h<.8)return 1;const n=vnoise(x/6+3,y/6+11),k=(h*31|0)%10;return n>.62?(k<7?1:0):n<.3?(k<4?2:0):k<1?3:k<2?2:0;
}
/* ---- les murets : la pierre du pays ---- */
/* près d'un changement de région, le muret mêle les pierres des deux pays : [région, région voisine, part de pierres voisines] */
function muretReg(x,y,at){
  const k=regAt(x,y);
  for(const [i,j] of [[1,0],[-1,0],[0,1],[0,-1]])for(let d=1;d<=3;d++){if(at(i*d,j*d)!=='m')break;const k1=regAt(x+i*d,y+j*d);if(k1!==k)return [k,k1,[0,.45,.28,.12][d]]}
  return [k,null,0];
}
function artMuret(c,x,y,at){
  const X=x*TS,Y=y*TS,L0=at(-1,0)==='m',R0=at(1,0)==='m',U0=at(0,-1)==='m',D0=at(0,1)==='m',vert=(U0||D0)&&!(L0||R0),[k,k2,mp]=muretReg(x,y,at),S=REG_STONE[k]||STONE0,S2=k2?REG_STONE[k2]||STONE0:S,pk=n=>mp&&wh(x*7+n,y*3+n,67)<mp?S2:S,brick=k==='nord',dk=S[5],cap=brick?S[4]:S[3],capHi=S[4];
  if(vert){R(c,X+12,Y,2,16,'rgba(20,40,30,.25)');R(c,X+4,Y,8,16,tint(S[0],-.12));for(let j=0;j<(brick?4:2);j++){const hh=brick?4:8,o=brick?(j%2)*2:((x+y*2+j)%2)*3;R(c,X+4,Y+j*hh+(brick?0:o%8),8,hh-1,pk(j)[(wh(x,y,60+j)*4)|0]);if(brick)R(c,X+6+o,Y+j*hh,1,hh-1,S[4])}
    R(c,X+4,Y,1,16,capHi);R(c,X+11,Y,1,16,dk);if(!D0){R(c,X+4,Y+12,8,4,tint(S[0],-.2));R(c,X+4,Y+15,8,1,dk)}return}
  R(c,X,Y+15,16,1,'rgba(20,40,30,.28)');R(c,X,Y+5,16,10,tint(S[0],-.2));
  if(brick){for(let r=0;r<3;r++){const ry=6+r*3,off=(r%2)*4;for(let sx=-off;sx<16;sx+=8){const a=Math.max(0,sx),w=Math.min(16,sx+7)-a;if(w>0)R(c,X+a,Y+ry,w,2,pk(r*9+sx)[(wh(x*3+sx,y,62+r)*4)|0])}}}
  else [[7,0],[11,3]].forEach(([ry,off],r)=>{for(let sx=-off;sx<16;sx+=6){const a=Math.max(0,sx),w=Math.min(16,sx+5)-a;if(w<=0)continue;const col=pk(r*9+sx)[(wh(x*3+sx,y,62+r)*3)|0];R(c,X+a,Y+ry,w,3,col);R(c,X+a,Y+ry,w,1,tint(col,.2))}});
  R(c,X,Y+3,16,3,cap);R(c,X,Y+3,16,1,capHi);R(c,X,Y+6,16,1,dk);R(c,X+((x%2)?5:11),Y+3,1,3,tint(cap,-.15));R(c,X,Y+14,16,1,dk);
  if(!L0)R(c,X,Y+3,1,12,dk);if(!R0)R(c,X+15,Y+3,1,12,dk);
}
/* ---- fleurs et cultures : lavande, vigne, coquelicots, gentianes… ---- */
function artLavender(c,X,Y,x,y){
  artGrass(c,X,Y,x,y,false);const se=SEA.se,bloom=se===1,P1=bloom?'#8a6fe0':se===0?'#9fb08a':'#8f9a86',P2=bloom?'#a98bf0':se===0?'#b4c49c':'#a3ad98',P3=bloom?'#6a52c0':'#74826c';
  for(let r=0;r<2;r++){const yy=Y+2+r*8;R(c,X,yy+5,16,1,'rgba(60,50,30,.22)');for(let k=0;k<3;k++){const a=X+k*5+(r?1:0)+(k===2?0:0),w=5;R(c,a,yy+2,w,4,'#74826c');R(c,a,yy+1,w,2,P1);R(c,a+1,yy,w-2,1,P2);R(c,a+w-1,yy+2,1,3,P3);if(bloom&&wh(x*3+k,y*2+r,310)<.6)R(c,a+1+((wh(x+k,y+r,311)*2)|0),yy-1,1,1,P2)}}
}
function artVine(c,X,Y,x,y,at){
  artGrass(c,X,Y,x,y,false);const se=SEA.se,L1=se===2?'#c9742f':se===0?'#8fd06a':'#4f9a4a',L2=se===2?'#e2c14a':se===0?'#b0e58c':'#6fbf62',L3=se===2?'#a5432a':'#3f8a45',row=at(-1,0)==='*'||at(1,0)==='*'||true;
  R(c,X,Y+13,16,1,'rgba(60,40,20,.25)');
  [3,11].forEach(px=>{R(c,X+px,Y+7,2,6,'#6b4a2b');R(c,X+px,Y+7,1,6,'#8a6538');R(c,X+px-1,Y+12,4,1,'#553920')});     // ceps
  R(c,X,Y+5,16,1,'#b9b4a6');R(c,X+7,Y+3,1,10,'#9a8a6a');                                                              // fil et piquet
  if(se===3){R(c,X+2,Y+6,4,1,'#6b4a2b');R(c,X+10,Y+6,4,1,'#6b4a2b');return}
  for(let i=0;i<7;i++){const a=((wh(x,y,320+i)*13)|0),b=2+((wh(x,y,330+i)*6)|0);R(c,X+a,Y+b,3,2,i%3===0?L2:i%3===1?L1:L3);R(c,X+a+1,Y+b-1,1,1,L2)}
  R(c,X,Y+4,16,3,L1);for(let k=0;k<16;k+=3)R(c,X+k+((wh(x+k,y,340)*2)|0),Y+3+((k/3)%2),2,2,k%2?L2:L3);
  if(se>=1)[[4,9],[12,8]].forEach(([a,b],i)=>{if(wh(x,y,350+i)<.75){R(c,X+a,Y+b,2,3,'#5a3a8a');R(c,X+a,Y+b,1,1,'#8a6fd0');R(c,X+a+1,Y+b+3,1,1,'#3f2a66')}});
}
const regCrop=(x,y)=>{const k=regAt(x,y);return k==='provence'?1:k==='bourgogne'?2:0};
/* ---- rochers : en Bretagne, ce sont des menhirs ---- */
function artMenhir(c,X,Y,x,y){const h=wh(x,y,360),w=6+((h*3)|0);R(c,X+3,Y+14,11,1,'rgba(20,40,30,.26)');
  for(let j=0;j<14;j++){const ww=Math.max(3,Math.round(w*(.55+.45*Math.sin((j+2)/15*Math.PI)))),a=X+8-(ww>>1)+(j<4?1:0);R(c,a,Y+1+j,ww,1,'#9a968c');R(c,a,Y+1+j,1,1,'#c4c0b4');R(c,a+ww-1,Y+1+j,1,1,'#6f6b62');if(j%4===2)R(c,a+1+((wh(x+j,y,361)*(ww-2))|0),Y+1+j,2,1,'#b4b0a4')}
  R(c,X+6,Y+11,2,1,'#6f9a55');R(c,X+9,Y+6,1,1,'#c9b84e');R(c,X+5,Y+14,6,1,'#6f6b62')}
/* ---- allées : la couleur du sol change avec le pays ---- */
/* ---- emblème de chaque quartier (10 × 9 points), pour les panneaux et la carte ---- */
const EMB={
  loire:['..#....#..','.###..###.','.###..###.','.########.','.#.#..#.#.','.########.','.###..###.','.###..###.','..........'],
  auvergne:['....##....','...#..#...','..##..##..','..######..','.########.','.###..###.','##########','##########','..........'],
  nord:['....##....','...####...','..######..','..#.##.#..','..######..','...####...','...#..#...','...####...','..######..'],
  normandie:['.....#....','....#.....','..###.###.','.#########','.#########','.#########','..#######.','...##.##..','..........'],
  alsace:['..##..##..','.#..##..#.','.#..##..#.','..##..##..','...####...','..#.##.#..','.#..##..#.','.#......#.','..######..'],
  bourgogne:['....#.....','...###....','..##.##...','.##.##.##.','.#.##.##..','..##.##...','...#.##...','....##....','....#.....'],
  bretagne:['#...##...#','.#.####.#.','....##....','#..####..#','...#..#...','...####...','...#..#...','..######..','.########.'],
  provence:['....#.....','.#..#..#..','..#...#...','....##....','##.####.##','....##....','..#...#...','.#..#..#..','....#.....'],
  savoie:['....#.....','...###....','...#.#....','..##.##.#.','..#...###.','.##...#.##','.#.....#.#','##.......#','##########']};
function regEmblem(c,k,x,y,col,s){s=s||1;const E=EMB[k];if(!E)return;c.fillStyle=col;for(let j=0;j<E.length;j++)for(let i=0;i<10;i++)if(E[j][i]==='#')c.fillRect(x+i*s,y+j*s,s,s)}
