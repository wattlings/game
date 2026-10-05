/* Wattlings · jeu/rendu/usure.js
   Aspérités : ce qui fait qu'une ville a vécu (flaques, herbes folles, façades marquées). */

/* ================= ASPÉRITÉS : ce qui fait qu'une ville a vécu =================
   Le plan est bien rangé ; ce sont les détails qui ne le sont pas tout à fait. Quatre familles, toutes tirées au sort
   une fois pour toutes à partir de la position (la ville est donc toujours la même) :
   - l'usure du temps : bitume fissuré et rapiécé, pavés descellés, tuiles dépareillées, mousse, enduit écaillé ;
   - les traces de vie : rideaux, pots de fleurs, paillassons, affiches, linge, craies au sol ;
   - la nature qui déborde : herbes folles au pied des murs et des bordures, flaques, feuilles mortes, lierre ;
   - les petits défauts de construction : clôtures dépareillées, fenêtre murée, volet de travers, lampadaire penché.
   Le réglage « patine » du menu fixe le dosage sur cinq niveaux (voir b_season.js). */
let WEAR=1;   // multiplicateur de dosage, fixé par seasonArt() d'après le réglage (5 niveaux)
const wh=(x,y,i)=>{let n=Math.imul(x|0,73856093)^Math.imul(y|0,19349663)^Math.imul((i|0)+1,83492791);n=Math.imul(n^(n>>>15),2246822519);n=Math.imul(n^(n>>>13),3266489917);return((n^(n>>>16))>>>0)/4294967296};
const LEAFC=['#d9903a','#b8642a','#e2c14a','#8a5a2b','#c9742f'];
function wearPuddle(c,X,Y,w){R(c,X+1,Y,w-2,1,'#86a9be');R(c,X,Y+1,w,2,'#9dbfd3');R(c,X+1,Y+3,w-3,1,'#86a9be');R(c,X+2,Y+1,2,1,'#e6f3f9');R(c,X+w-3,Y+2,2,1,'#c6dde8')}
function wearWeed(c,X,Y,v){R(c,X,Y+1,1,2,'#58a551');R(c,X+1,Y,1,3,v?'#6fbf62':'#4f9a4a');R(c,X+2,Y+1,1,2,'#58a551');if(v)R(c,X+1,Y-1,1,1,'#f7d84a')}
function drawTile(c,ch,x,y,mapId){drawTileA(c,ch,x,y,mapId);if(WEAR&&mapId!=='town')wearInside(c,ch,x,y,mapId)}   // en ville, l'usure du sol est posée après les courbes (seasonGround)
/* intérieurs : un parquet qui a vu passer du monde, un mur fendillé, une cave humide */
function wearInside(c,ch,x,y,mapId){
  const X=x*TS,Y=y*TS,s=mapId.length*7+(mapId==='local'?(S.inside||'').length*3:0),h=wh(x+s,y,70),h2=wh(x+s,y,71),G=MAPS[mapId].g;
  if(ch==='o'&&!(mapId==='rdc'&&S.site!=='ecole')){
    if(h<.07){const a=2+((h2*8)|0),b=2+(((h2*37)|0)%9);for(let i=0;i<5;i++)R(c,X+a+i,Y+b+((i/2)|0),1,1,'rgba(60,35,10,.35)')}   // rayure
    else if(h<.12){R(c,X+4+((h2*6)|0),Y+5+(((h2*29)|0)%5),4,3,'rgba(60,35,10,.16)');R(c,X+5+((h2*6)|0),Y+4+(((h2*29)|0)%5),2,5,'rgba(60,35,10,.16)')}   // tache
    else if(h>.95){R(c,X+((y%2)?4:11)-1,Y+2,1,3,'rgba(255,240,210,.5)')}   // lame qui baille
  }else if(ch==='W'){const below=G[y+1]&&G[y+1][x];if(!below||below==='W')return;
    if(mapId==='cave'){if(h<.3){R(c,X+3+((h2*8)|0),Y+9,2,4,'#3f5f4a');R(c,X+4+((h2*8)|0),Y+11,2,2,'#4f7358')}if(h>.8){for(let i=0;i<5;i++)R(c,X+10+((i/2)|0),Y+3+i,1,1,'#3d414a')}}   // mousse, fissure
    else if(h<.07){let a=4+((h2*8)|0);for(let i=0;i<6;i++){R(c,X+a,Y+3+i,1,1,'rgba(90,70,50,.45)');if(i%2)a+=h2<.5?1:-1}}   // fissure dans l'enduit
    else if(h>.95){R(c,X+3,Y+3,3,1,'rgba(255,255,255,.5)');R(c,X+3,Y+3,1,3,'rgba(255,255,255,.5)');R(c,X+4,Y+4,1,1,'rgba(255,255,255,.4)')}   // toile d'araignée dans l'angle
  }else if(ch==='c'&&h>.93)wearPuddle(c,X+4,Y+7,7);
}
function wearGround(c,ch,x,y){
  const X=x*TS,Y=y*TS,G=MAPS.town.g,at=(dx,dy)=>G[y+dy]&&G[y+dy][x+dx],h=wh(x,y,0),h2=wh(x,y,1),K=WEAR;
  const nearTree=()=>{for(let j=-1;j<=1;j++)for(let i=-1;i<=1;i++)if(at(i,j)==='T')return true;return false};
  const leaves=n=>{for(let i=0;i<n;i++){const a=(wh(x,y,20+i)*14)|0,b=(wh(x,y,30+i)*14)|0,col=LEAFC[(wh(x,y,40+i)*5)|0];R(c,X+a,Y+b,2,1,col);if(i%2)R(c,X+a+1,Y+b+1,1,1,col)}};
  if(ch==='b'){
    const ed=(dx,dy)=>{const t=at(dx,dy);return !(t==='b'||t==='g'||t==='='||t==='D'||t==='q'||t===',')},eU=ed(0,-1),eD=ed(0,1),eL=ed(-1,0),eR=ed(1,0),inr=!(eU||eD||eL||eR);
    if(h<.07*K){let a=2+((h2*4)|0),b=4+(((h2*29)|0)%8);for(let i=0;i<9;i++){R(c,X+a,Y+b,1,1,'#8a5a42');if(i%3===2)R(c,X+a,Y+b+1,1,1,'#8a5a42');else R(c,X+a,Y+b+1,1,1,'#dba98b');a++;b=Math.max(4,Math.min(11,b+((wh(x+i,y,2)*3)|0)-1))}}   // fissure
    else if(h<.115*K&&inr){const a=3+((h2*5)|0),b=3+(((h2*23)|0)%6),w=5+(((h2*7)|0)%4),hh=4+(((h2*11)|0)%3),dk=h2<.5;   // rustine de bitume
      R(c,X+a,Y+b,w,hh,dk?'#b6795b':'#d59d7f');R(c,X+a,Y+b,w,1,dk?'#a4694d':'#e3b193');R(c,X+a,Y+b,1,hh,dk?'#a4694d':'#e3b193');R(c,X+a,Y+b+hh-1,w,1,dk?'#9c6247':'#c38869')}
    else if(h>1-.04*K&&inr)wearPuddle(c,X+3+((h2*5)|0),Y+5+(((h2*17)|0)%5),7+(((h2*13)|0)%3));
    if(inr&&(x*5+y*11)%47===3){c.fillStyle='#646a76';c.beginPath();c.arc(X+8,Y+8,4.6,0,7);c.fill();c.fillStyle='#8a909c';c.beginPath();c.arc(X+8,Y+8,3.6,0,7);c.fill();R(c,X+6,Y+7,5,1,'#5d626d');R(c,X+6,Y+9,5,1,'#5d626d');R(c,X+8,Y+5,1,6,'#5d626d');R(c,X+5,Y+5,2,1,'#c3c8d1')}   // plaque d'égout
    // bordures : herbes folles qui passent par-dessus, pierre descellée
    if(eU){if(h2<.26*K)wearWeed(c,X+2+((h*11)|0),Y,h2<.06);if(h2>1-.1*K){const a=4+((h*7)|0);R(c,X+a,Y,4,2,'#9c8c6c');R(c,X+a+1,Y,2,1,'#7f7157')}}
    if(eD){if(wh(x,y,3)<.26*K)wearWeed(c,X+2+((h2*11)|0),Y+13,0);if(wh(x,y,3)>1-.1*K){const a=4+((h2*7)|0);R(c,X+a,Y+14,4,2,'#8a7b5e');R(c,X+a+1,Y+15,2,1,'#6f6350')}}
    if(eL&&wh(x,y,4)<.22*K){const b=3+((h*9)|0);R(c,X,Y+b,2,1,'#58a551');R(c,X+1,Y+b-1,2,1,'#6fbf62');R(c,X,Y+b+1,3,1,'#4f9a4a')}
    if(eR&&wh(x,y,5)<.22*K){const b=3+((h2*9)|0);R(c,X+14,Y+b,2,1,'#58a551');R(c,X+13,Y+b-1,2,1,'#6fbf62');R(c,X+13,Y+b+1,3,1,'#4f9a4a')}
    if(nearTree()&&h2<.6)leaves(2);return}
  if(ch==='='){
    if(h<.1*K)wearWeed(c,X+4+((h2*7)|0),Y+5+(((h2*31)|0)%6),h<.03);else if(h>1-.035*K)wearPuddle(c,X+4,Y+6+((h2*4)|0),7);
    else if(h<.2*K){const a=3+((h2*8)|0),b=4+(((h2*19)|0)%7);R(c,X+a,Y+b,3,2,'#b9b4a6');R(c,X+a,Y+b,2,1,'#d5d1c0');R(c,X+a,Y+b+2,3,1,'#c9b684')}   // pierre affleurante
    if(nearTree()&&h2<.7)leaves(2+((h2*3)|0));return}
  if(ch===','){
    if(h<.055*K){const a=(h2<.5?0:8)+((y%2)?4:0),b=h2*4<2?0:8;R(c,X+Math.min(9,a),Y+b,7,7,'#8f7f62');R(c,X+Math.min(9,a),Y+b,7,1,'#74664d');wearWeed(c,X+Math.min(9,a)+2,Y+b+3,0)}   // pavé manquant
    else if(h<.2*K){for(let i=0;i<4;i++)R(c,X+((wh(x,y,6+i)*14)|0),Y+(i%2?7:15),2,1,i%2?'#7fae62':'#6f9a55')}   // mousse dans les joints
    else if(h>1-.06*K){let a=2+((h2*8)|0),b=1;for(let i=0;i<6;i++){R(c,X+a,Y+b,1,1,'#a89b7c');b++;if(i%2)a+=h2<.5?1:-1}}   // pavé fendu
    if(nearTree()&&h2<.5)leaves(2);return}
  if(ch==='g'){if(h<.3*K){const k=(h2*4)|0;R(c,X+k*4+1,Y+5,2,6,'#e0c595');R(c,X+k*4+1,Y+5,1,6,'#ecd7ae')}if(h>.7){R(c,X+2+((h2*10)|0),Y+1,2,1,'#6f9a55');R(c,X+5+((h2*8)|0),Y+12,3,1,'#6f9a55')}return}
  if(ch==='.'){
    if(nearTree()){if(h2<.75)leaves(2+((h*4)|0))}
    else if(h<.035*K){const a=4+((h2*8)|0),b=5+(((h2*23)|0)%6);R(c,X+a,Y+b+2,1,3,'#4f9a4a');R(c,X+a-1,Y+b,3,2,h2<.6?'#f7d84a':'#f4f1e6');R(c,X+a,Y+b,1,1,h2<.6?'#e2a13a':'#d9d5c5')}   // pissenlit
    else if(h>1-.014*K){const a=3+((h2*6)|0),b=6+((h2*4)|0);R(c,X+a+1,Y+b,5,1,'#a9925f');R(c,X+a,Y+b+1,7,2,'#b39b66');R(c,X+a+1,Y+b+3,5,1,'#9c8656');R(c,X+a+2,Y+b+1,1,1,'#8a7648');R(c,X+a+5,Y+b+2,1,1,'#8a7648')}   // terre à nu
    // au pied d'un mur : l'herbe pousse plus haut, jamais tondue
    if(at(0,-1)==='B'){for(let i=0;i<5;i++)if(wh(x,y,10+i)<.45*K){const a=1+i*3+((wh(x,y,15+i)*2)|0);R(c,X+a,Y,1,3,'#4f9a4a');R(c,X+a+1,Y,1,2,'#6fbf62');if(wh(x,y,10+i)<.07)R(c,X+a,Y-1,2,1,'#f7d84a')}}
  }
}
/* ---- haies, clôtures, murets, palissades, arbres : ce qui dépasse, ce qui manque, ce qu'on a ajouté ---- */
function wearProp(c,ch,x,y,at){
  zoneGrass(x,y);const X=x*TS,Y=y*TS,h=wh(x,y,50),h2=wh(x,y,51),K=WEAR;
  if(ch==='m'){
    const L0=at(-1,0)==='m',R0=at(1,0)==='m',U0=at(0,-1)==='m',D0=at(0,1)==='m',vert=(U0||D0)&&!(L0||R0),S=REG_STONE[regAt(x,y)]||STONE0;if(vert)return;
    if(h<.13*K){const a=3+((h2*7)|0);R(c,X+a,Y+3,5,3,S[5]);R(c,X+a,Y+5,5,1,S[0]);R(c,X+a+6>12?X+2:X+a+6,Y+13,3,2,S[3])}   // pierre de couronnement tombée
    else if(h<.4*K){for(let i=0;i<4;i++)R(c,X+((wh(x,y,64+i)*14)|0),Y+3+(i%2),2,1,i%2?'#6f9a55':'#86b05a')}   // mousse
    else if(h<.5*K){const a=2+((h2*9)|0);for(let j=0;j<7;j++){const w=3-((j/3)|0);R(c,X+a+((wh(x,y+j,66)*2)|0),Y+4+j,w,1,j%2?'#3d8c4d':'#57a95f')}}   // lierre
    return}
  if(ch==='h'){const U0=at(0,-1)==='h';
    if(h<.17*K&&!U0){for(let i=0;i<4;i++){const a=1+((wh(x,y,52+i)*13)|0),l=1+((wh(x,y,56+i)*3)|0);R(c,X+a,Y+2-l,1,l,'#58ad62');R(c,X+a,Y+2-l,1,1,'#8fd68a');if(i%2)R(c,X+a+1,Y+3-l,1,Math.max(1,l-1),'#3d8c4d')}}   // mal taillée
    else if(h<.24*K){const a=3+((h2*6)|0);R(c,X+a,Y+6,5,4,'#8a7d3c');R(c,X+a+1,Y+5,3,1,'#a39448');R(c,X+a+1,Y+8,3,1,'#6f6430');R(c,X+a+3,Y+7,1,1,'#bfb05c')}   // rameau grillé
    else if(h<.28*K){R(c,X+5,Y+7,5,4,'#1a4629');R(c,X+6,Y+8,3,2,'#123520')}   // trou
    return}
  if(ch==='f'){const L0=at(-1,0)==='f',R0=at(1,0)==='f',hz=L0||R0;if(!hz)return;
    if(h<.13*K){R(c,X+4,Y+5,6,2,'#ecd8ad');R(c,X+4,Y+5,6,1,'#f6e8c6');R(c,X+4,Y+7,6,1,'#b79a62')}   // lisse neuve, plus claire
    else if(h<.21*K){R(c,X+5,Y+5,5,3,GCOL[1]);R(c,X+4,Y+5,1,2,'#86602f');R(c,X+5,Y+13,5,1,'#cfa46a');R(c,X+6,Y+14,3,1,'#86602f')}   // lisse cassée, tombée au pied
    else if(h<.33*K){wearWeed(c,X+5+((h2*4)|0),Y+12,h2<.3);wearWeed(c,X+12,Y+13,0)}   // herbes au pied
    else if(h<.39*K){R(c,X+10,Y+1,3,1,'#e8c796');R(c,X+11,Y+2,3,13,'#b98d57');R(c,X+11,Y+2,1,13,'#dcb682');R(c,X+13,Y+2,1,13,'#86602f')}   // poteau de travers
    return}
  if(ch==='P'){
    if(h<.2*K){const col=['#e2573b','#2f6db5','#2f9e7a','#f2a33a'][(h2*4)|0];R(c,X+3,Y+3,8,9,'#f4efe0');R(c,X+3,Y+3,8,3,col);R(c,X+4,Y+7,6,1,'#5b6380');R(c,X+4,Y+9,4,1,'#5b6380');R(c,X+9,Y+10,2,2,'#b98d57');R(c,X+3,Y+12,8,1,'rgba(0,0,0,.2)')}   // affiche, coin arraché
    else if(h<.32*K){const col=h2<.5?'#e9679a':'#4fc3d9';let a=2,b=8;for(let i=0;i<11;i++){R(c,X+a,Y+b,2,1,col);a++;b+=[-1,-1,1,1,0,-1,1,0,-1,1,0][i]}}   // tag
    else if(h<.42*K){R(c,X+5,Y+2,3,11,'#e6cc9a');R(c,X+5,Y+2,1,11,'#f2dfb8')}   // planche neuve
    else if(h<.47*K){R(c,X+9,Y+6,2,3,'#3f2a14');R(c,X+9,Y+6,1,1,'#7a5630')}   // nœud du bois tombé
    return}
  if(ch==='T'){const sp=artTreeKind(x,y);
    if(sp!==1&&h<.06*K){R(c,X+6,Y+3,5,5,'#c9a26e');R(c,X+5,Y+2,7,1,'#8a3b3b');R(c,X+6,Y+1,5,1,'#a54a4a');R(c,X+8,Y+4,1,2,'#3f2a14');R(c,X+6,Y+7,5,1,'#8a6538')}   // nichoir
    else if(h<.2*K){R(c,X+4,Y+14,3,1,'#6b4a2b');R(c,X+10,Y+14,2,1,'#553920');if(h2<.4){R(c,X+12,Y+12,2,2,'#d9483b');R(c,X+13,Y+14,1,1,'#f7f0dc')}}   // racines, champignon
    return}
  if(ch==='k'&&h<.5){R(c,X+5,Y+6,3,1,'#6f9a55');R(c,X+7,Y+7,2,1,'#86b05a')}
}
/* ---- bâtiments : chacun porte les marques de son âge et de ses habitants ---- */
const CURT=['#e2573b','#f2c12e','#8a3b8f','#2f9e7a','#e9679a','#4a78c9','#f7f0dc'];
function artWinV(c,x,y,w,h,wall,v){
  if(!WEAR||v>=.62){artWin(c,x,y,w,h,wall);return}
  if(v<.035*WEAR){   // fenêtre murée
    R(c,x-1,y-1,w+2,h+2,tint(wall,-.45));R(c,x,y,w,h,tint(wall,-.14));for(let j=0;j<h;j+=3){R(c,x,y+j,w,1,tint(wall,-.28));for(let i=(j/3%2)*3+1;i<w;i+=5)R(c,x+i,y+j,1,3,tint(wall,-.28))}R(c,x-1,y+h,w+2,1,'#ece6d6');return}
  artWin(c,x,y,w,h,wall);const col=CURT[(v*97|0)%CURT.length];
  if(v<.28){R(c,x+1,y+1,2,h-2,col);R(c,x+w-3,y+1,2,h-2,col);R(c,x+1,y+1,w-2,1,tint(col,-.2));R(c,x+2,y+2,1,h-3,tint(col,.25))}   // rideaux
  else if(v<.4){const hh=Math.max(2,((h-2)*(.4+v))|0);R(c,x+1,y+1,w-2,hh,'#e3dcc8');for(let j=1;j<hh;j+=2)R(c,x+1,y+1+j,w-2,1,'#c9c0a6')}   // store à demi baissé
  else if(v<.46){R(c,x+1,y+1,w-2,h-2,'#33475e');R(c,x+1,y+1,2,h-2,'#f6f3e9');R(c,x+w-2,y+2,1,h-3,'#5a7a9a')}   // fenêtre ouverte
  else if(h>=7){R(c,x,y+h-1,w,2,'#8a5f36');R(c,x,y+h-1,w,1,'#a87a4a');for(let i=1;i<w-1;i+=2)R(c,x+i,y+h-3+((i>>1)%2),1,2,i%4===1?col:'#46995a')}   // jardinière
}
function wearBuilding(c,b,g){
  if(!WEAR)return;const {X,Y,W,H,rh,WY,dx,dy,rt,st}=g,s=i=>thash(b.x*5+i*3+1,b.y*11+b.w*7+i),roof=g.roof||b.roof,wall=g.wall||b.wall,glass=st.win==='glass',K=WEAR;
  if(rt==='shed'){if(s(20)<.8)for(let i=0;i<3;i++){const a=5+((s(22+i)*(W-14))|0);R(c,X+a,Y+rh-6,4,2,'#6f9a4a');R(c,X+a+1,Y+rh-7,2,1,'#86b05a')}}
  else if(rt!=='flat'){
    // tuiles dépareillées : quelques-unes plus claires ou plus sombres, une ou deux remplacées par une autre teinte
    const rows=(rh>>2)-2,n=Math.round(W*rh/70*K);
    for(let i=0;i<n;i++){const ro=1+((s(i)*rows)|0),a=(ro%2)*3+2+6*((s(i+40)*((W-14)/6))|0)+4,v=s(i+80),col=v<.1?(s(i+90)<.5?'#c98a4a':'#8a8f9a'):v<.55?tint(roof,.15):tint(roof,-.15);
      R(c,X+a,Y+ro*4+1,5,3,col);R(c,X+a,Y+ro*4+1,5,1,tint(col,.14));R(c,X+a,Y+ro*4+3,5,1,tint(col,-.1))}
    if(s(20)<.6){const m=2+((s(21)*4*K)|0);for(let i=0;i<m;i++){const a=5+((s(22+i)*(W-14))|0),y0=Y+rh-7-(((s(30+i)*2)|0)*4);R(c,X+a,y0,4,2,'#6f9a4a');R(c,X+a+1,y0-1,2,1,'#86b05a');R(c,X+a+3,y0+1,2,1,'#5a8440')}}   // mousse
    if(s(26)<.3*K&&rows>1){const a=12+((s(27)*(W-28))|0),ro=1+((s(28)*rows)|0);R(c,X+a,Y+ro*4+1,4,3,'#3a2a22');R(c,X+a,Y+ro*4+2,4,1,'#5a463a')}   // tuile manquante
  }else{
    for(let i=0;i<3;i++){const a=5+((s(i)*(W-16))|0),q=7+((s(i+5)*(rh-16))|0);R(c,X+a,Y+q,5+((s(i+9)*4)|0),2,tint(roof,-.1));R(c,X+a+1,Y+q+2,3,1,tint(roof,-.06))}   // traces d'eau
    if(s(8)<.5)wearPuddle(c,X+5+((s(9)*(W-20))|0),Y+rh-12,8);
  }
  if(!glass){const rr=Math.ceil(b.h*.45);
    // coulures sous les appuis de fenêtre
    for(let tx=b.x;tx<b.x+b.w;tx++){if(tx===b.door[0]||s(tx)>.4*K||st.win==='strip')continue;const px=tx*TS+4+((s(tx+30)*7)|0),py=(b.y+rr)*TS+13;R(c,px,py,1,2+((s(tx+60)*3)|0),tint(wall,-.11));R(c,px+2,py,1,1+((s(tx+70)*2)|0),tint(wall,-.08))}
    // enduit écaillé : la brique apparaît
    if(s(50)<.5*K){const px=X+2+((s(51)*3)|0),py=Y+H-10;[[1,3],[0,5],[0,6],[1,5],[2,3]].forEach(([o,w],i)=>R(c,px+o,py+i,w,1,i%2?'#c58f72':'#b27c61'));R(c,px+3,py+1,1,1,'#e2c9b0');R(c,px+1,py+3,1,1,'#96664e')}
    // fissure qui descend de l'avant-toit
    if(s(52)<.4*K){let a=X+W-7-((s(53)*8)|0),q=WY+3;for(let i=0;i<6;i++){R(c,a,q,1,1,tint(wall,-.3));q++;if(i%2)a+=s(54+i)<.5?1:-1}}
    // descente d'eau pluviale
    if(s(54)<.75){const px=X+W-3;R(c,px,WY,2,H-rh-3,'#8e949d');R(c,px,WY,1,H-rh-3,'#bcc1c9');for(let k=WY+4;k<Y+H-5;k+=7)R(c,px-1,k,4,1,'#6d7480');R(c,px-2,Y+H-4,4,1,'#6d7480')}
    // lierre qui grimpe à un angle
    if(s(59)<.28*K||b.id==='cabinet'||b.id==='maison'){const left=s(60)<.5,top=WY+2+((s(61)*8)|0),bot=Y+H-2;
      for(let yy=bot;yy>=top;yy--){const pr=(bot-yy)/(bot-top),w=Math.max(1,Math.round(6*(1-pr*.65)+wh(yy,b.x,7)*2-1));for(let k=0;k<w;k++){const q=wh(b.x*3+k,yy,8);R(c,left?X+1+k:X+W-2-k,yy,1,1,q<.3?'#2f7a3d':q<.75?'#46995a':'#6fbf62')}}}
  }
  // coffret de comptage à côté de la porte, numéro de rue de l'autre côté
  if(dx+20<X+W&&s(55)<.7){R(c,dx+16,dy+8,3,5,'#d9dde3');R(c,dx+16,dy+8,3,1,'#f4f6f8');R(c,dx+17,dy+10,1,1,'#2aa198');R(c,dx+16,dy+13,3,1,'#8e949d')}
  if(dx-4>X){R(c,dx-3,dy+5,3,3,'#27457a');R(c,dx-2,dy+6,1,1,'#fff')}
  // devant la porte : paillasson, pots de fleurs (jamais deux fois les mêmes)
  if(b.id!=='gare'){const mat=['#8a3b3b','#2f6d34','#5b4a7a','#8a5f36','#27457a'][(s(58)*5)|0];R(c,dx+3,dy+16,10,2,mat);R(c,dx+4,dy+16,8,1,tint(mat,.25));
    const pot=(px,v)=>{R(c,px,dy+16,4,4,'#b5653a');R(c,px,dy+16,4,1,'#d98a5a');R(c,px+3,dy+17,1,3,'#8f4a26');R(c,px-1,dy+13,6,3,'#3f9a5f');R(c,px,dy+12,4,1,'#57b56f');if(v<.7){R(c,px,dy+13,2,2,CURT[(v*40|0)%6]);R(c,px+3,dy+12,2,2,CURT[(v*70|0)%6])}};
    if(dx-6>X&&s(56)<.6*K)pot(dx-6,s(62));if(dx+21<X+W&&s(57)<.45*K)pot(dx+20,s(63))}
  // herbes au pied du mur
  for(let k=2;k<W-3;k+=2)if(wh(b.x*16+k,b.y,9)<.16*K&&!(X+k>=dx-7&&X+k<=dx+24)){R(c,X+k,Y+H-2,1,3,'#58a551');R(c,X+k+1,Y+H-1,1,2,'#7cc56a')}
}
