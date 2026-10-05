/* Wattlings · jeu/rendu/art-sols.js
   Rendu détaillé : sols (herbe, chemins, routes, eau, ponts, place, terre, fleurs). */

/* ---- sols ---- */
function artGrassBase(c,X,Y,x,y,town){R(c,X,Y,16,16,GCOL[1])}
function artGrass(c,X,Y,x,y,town){
  artGrassBase(c,X,Y,x,y,town);const h=thash(x,y),k=(h*4096)|0,T=[[2,3],[9,1],[5,9],[12,10],[1,12],[8,5]];
  for(let i=0;i<6;i++)if((k>>i)&1&&(i+x+y)%2===0){const [a,b]=T[i];R(c,X+a,Y+b+1,1,1,GT[0]);R(c,X+a+1,Y+b,1,1,GT[0]);R(c,X+a+2,Y+b+1,1,1,GT[0]);R(c,X+a+1,Y+b+1,1,1,GT[1])}
  if(!town||SEA.snow)return;const m=(k>>6)%64===1&&(x*7+y*3)%4?9:(k>>6)%64;
  if(m===0){R(c,X+9,Y+7,3,2,'#b9b4a6');R(c,X+9,Y+9,3,1,'#8f8a7c');R(c,X+9,Y+7,1,1,'#dcd8cc')}
  else if(m===1){R(c,X+5,Y+10,3,2,'#d9483b');R(c,X+6,Y+12,1,2,'#f7f0dc');R(c,X+5,Y+10,1,1,'#f39a8c');R(c,X+7,Y+11,1,1,'#fff')}
  else if(m<4){R(c,X+4,Y+6,2,2,'#4f9a4a');R(c,X+6,Y+5,2,2,'#4f9a4a');R(c,X+5,Y+7,2,2,'#4f9a4a');R(c,X+5,Y+6,1,1,'#8fd07c')}
}
const artPathLike=t=>t==='='||t==='b'||t==='g'||t==='D'||t===','||t==='q'||t==='d'||t===':'||t==='B';
function artCorner(c,X,Y,x,y,at,isP,draw){[[-1,-1,0,0],[1,-1,1,0],[-1,1,0,1],[1,1,1,1]].forEach(([dx,dy,rx,ry])=>{if(!isP(at(dx,0))&&!isP(at(0,dy)))draw(rx,ry)})}
function artPath(c,X,Y,x,y,at){
  const B='#e6d8ae',D='#cdbb88',E='#b9a672';R(c,X,Y,16,16,B);
  for(let i=0;i<6;i++){const a=(thash(x*3+i,y*7+1)*16)|0,b=(thash(x*5+2,y*3+i)*16)|0;R(c,X+a,Y+b,1,1,i<3?D:'#f6eed6')}
  if(thash(x*11,y*13)>.7)R(c,X+((thash(x,y*9)*12)|0),Y+((thash(x*9,y)*12)|0),2,1,D);
  // bords : un liseré plus foncé, puis l'herbe qui mord un peu sur l'allée
  const g=artPathLike,U=!g(at(0,-1)),Dn=!g(at(0,1)),Lf=!g(at(-1,0)),Rt=!g(at(1,0));
  if(U){R(c,X,Y,16,1,E);R(c,X,Y+1,16,1,D);for(let i=0;i<3;i++)R(c,X+((thash(x+i,y*3)*14)|0),Y,2,1,'#6fb862')}
  if(Dn){R(c,X,Y+15,16,1,E);R(c,X,Y+14,16,1,D);for(let i=0;i<3;i++)R(c,X+((thash(x*3+i,y)*14)|0),Y+15,2,1,'#6fb862')}
  if(Lf){R(c,X,Y,1,16,E);R(c,X+1,Y,1,16,D);for(let i=0;i<3;i++)R(c,X,Y+((thash(x*5+i,y*2)*14)|0),1,2,'#6fb862')}
  if(Rt){R(c,X+15,Y,1,16,E);R(c,X+14,Y,1,16,D);for(let i=0;i<3;i++)R(c,X+15,Y+((thash(x*2+i,y*5)*14)|0),1,2,'#6fb862')}
  artCorner(c,X,Y,x,y,at,g,(rx,ry)=>{const gx=X+(rx?13:0),gy=Y+(ry?13:0),G=GCOL[1];R(c,gx,gy,3,3,G);R(c,X+(rx?11:0),Y+(ry?15:0),5,1,G);R(c,X+(rx?15:0),Y+(ry?11:0),1,5,G);
    R(c,X+(rx?12:3),Y+(ry?14:1),1,1,E);R(c,X+(rx?14:1),Y+(ry?12:3),1,1,E);R(c,X+(rx?13:2),Y+(ry?13:2),1,1,E)});
}
function artRoad(c,X,Y,x,y,at){
  const rd=(dx,dy)=>{const t=at(dx,dy);return t==='b'||t==='g'},hard=(dx,dy)=>{const t=at(dx,dy);return t==='b'||t==='g'||t==='='||t==='D'||t==='q'||t===','},B='#c98e6e';
  R(c,X,Y,16,16,B);for(let i=0;i<7;i++){const a=(thash(x*3+i,y*7+5)*16)|0,b=(thash(x*5+7,y*3+i)*16)|0;R(c,X+a,Y+b,1,1,i<4?'#b87c5e':'#dba98b')}
  // bordure de pierre : claire côté lumière, sombre côté ombre
  if(!hard(0,-1)){R(c,X,Y,16,1,'#f6eedc');R(c,X,Y+1,16,1,'#d6cbb2');R(c,X,Y+2,16,1,'#b87c5e')}
  if(!hard(0,1)){R(c,X,Y+14,16,1,'#d6cbb2');R(c,X,Y+15,16,1,'#a39a84');R(c,X,Y+13,16,1,'#b87c5e')}
  if(!hard(-1,0)){R(c,X,Y,1,16,'#f6eedc');R(c,X+1,Y,1,16,'#d6cbb2');R(c,X+2,Y,1,16,'#b87c5e')}
  if(!hard(1,0)){R(c,X+14,Y,1,16,'#d6cbb2');R(c,X+15,Y,1,16,'#a39a84');R(c,X+13,Y,1,16,'#b87c5e')}
  for(let k=0;k<16;k+=8){if(!hard(0,-1))R(c,X+k+3,Y,1,2,'#bdb39b');if(!hard(0,1))R(c,X+k+6,Y+14,1,2,'#8f8772');if(!hard(-1,0))R(c,X,Y+k+3,2,1,'#bdb39b');if(!hard(1,0))R(c,X+14,Y+k+6,2,1,'#8f8772')}
  const hz=rd(-1,0)||rd(1,0),vt=rd(0,-1)||rd(0,1);
  if(hz&&rd(0,1)&&!rd(0,-1)&&x%2===0){R(c,X+3,Y+15,10,1,'#fbf5e6');R(c,X+3,Y+14,10,1,'#e9dcc4')}
  if(vt&&rd(1,0)&&!rd(-1,0)&&y%2===0){R(c,X+15,Y+3,1,10,'#fbf5e6');R(c,X+14,Y+3,1,10,'#e9dcc4')}
  if((x*7+y*13)%29===0&&hard(0,-1)&&hard(0,1)&&hard(-1,0)&&hard(1,0)){const w='#fbf5e6';R(c,X+3,Y+8,3,3,w);R(c,X+4,Y+9,1,1,B);R(c,X+10,Y+8,3,3,w);R(c,X+11,Y+9,1,1,B);R(c,X+5,Y+7,6,1,w);R(c,X+5,Y+6,2,1,w);R(c,X+10,Y+5,2,2,w)}
  artCorner(c,X,Y,x,y,at,t=>t==='b'||t==='g'||t==='='||t==='D'||t==='q'||t===','||t==='B',(rx,ry)=>{const G=GCOL[1];R(c,X+(rx?14:0),Y+(ry?14:0),2,2,G);R(c,X+(rx?13:2),Y+(ry?15:0),1,1,G);R(c,X+(rx?15:0),Y+(ry?13:2),1,1,G);R(c,X+(rx?13:2),Y+(ry?14:1),1,1,'#d6cbb2');R(c,X+(rx?14:1),Y+(ry?13:2),1,1,'#d6cbb2')});
}
function artWater(c,X,Y,x,y,at,pond){
  const wt=(dx,dy)=>{const t=at(dx,dy);return t==='R'||t==='~'||t==='g'||t==='r'||t===undefined},h=thash(x,y),B=pond?'#55a6dd':'#4f9fdc';
  R(c,X,Y,16,16,B);
  // vaguelettes : un trait clair, son reflet plus sombre dessous
  [[2+((h*6)|0),4],[8-((h*4)|0),11],[11,7+((h*3)|0)]].forEach(([a,b],i)=>{if(i===2&&h<.5)return;R(c,X+a,Y+b,4,1,'#8fd0f4');R(c,X+a+1,Y+b+1,3,1,'#3f8ccb');R(c,X+a+4,Y+b,1,1,'#c6ebfb')});
  if(wt(-1,0)&&wt(1,0)&&wt(0,-1)&&wt(0,1)){const k=(h*61)|0;
    if(k<3){R(c,X+5,Y+6,6,4,'#4b9a4d');R(c,X+6,Y+5,4,6,'#4b9a4d');R(c,X+6,Y+6,3,2,'#6fbf62');R(c,X+9,Y+7,2,1,B);R(c,X+5,Y+10,5,1,'#3f8ccb');if(k===0){R(c,X+7,Y+7,2,2,'#f7c8dc');R(c,X+7,Y+7,1,1,'#fff')}}
    else if(k===3){R(c,X+6,Y+8,5,4,'#8a8577');R(c,X+7,Y+7,3,1,'#b4af9c');R(c,X+6,Y+8,2,1,'#b4af9c');R(c,X+5,Y+12,7,1,'#3f8ccb');R(c,X+10,Y+9,1,3,'#6b665a')}}
  // berges : terre sombre, ombre dans l'eau, écume
  const bank=(dx,dy)=>{const v=dx!==0,o=dx>0||dy>0;for(let k=0;k<3;k++){const col=['#4f9a4e','#356f9f','#79bfeb'][k],p=o?15-k:k;if(v)R(c,X+p,Y,1,16,col);else R(c,X,Y+p,16,1,col)}
    for(let i=0;i<2;i++){const q=(thash(x*7+i+dx,y*5+dy)*13)|0;if(thash(x+i,y+dx*3+dy)>.45){if(v)R(c,X+(o?12:1),Y+q,2,1,o?'#3f8a45':'#6fb862');else R(c,X+q,Y+(o?12:1),1,2,o?'#3f8a45':'#6fb862')}}};
  if(!wt(0,-1))bank(0,-1);if(!wt(0,1))bank(0,1);if(!wt(-1,0))bank(-1,0);if(!wt(1,0))bank(1,0);
  if(!wt(-1,0)&&h>.6){R(c,X+3,Y+3,1,8,'#3f8a45');R(c,X+5,Y+6,1,6,'#3f8a45');R(c,X+3,Y+2,1,2,'#7a5a34')}
  if(!wt(1,0)&&h<.35){R(c,X+12,Y+5,1,8,'#3f8a45');R(c,X+10,Y+8,1,5,'#3f8a45');R(c,X+12,Y+4,1,2,'#7a5a34')}
}
function artBridge(c,X,Y,x,y,at){
  const wtr=(dx,dy)=>{const t=at(dx,dy);return t==='R'||t==='~'};
  R(c,X,Y,16,16,'#b08650');for(let k=0;k<4;k++){R(c,X+k*4,Y,1,16,'#7a5830');R(c,X+k*4+1,Y,1,16,'#caa26c');R(c,X+k*4+2,Y+2+((thash(x*4+k,y)*10)|0),1,3,'#96703f');R(c,X+k*4+2,Y+1,1,1,'#5d4024');R(c,X+k*4+2,Y+14,1,1,'#5d4024')}
  // garde-corps du côté de l'eau : lisse claire, poteaux, ombre portée
  const rail=(top)=>{const y0=top?0:11;R(c,X,Y+y0,16,5,'#6b4a2b');R(c,X,Y+y0,16,1,'#3f2a14');R(c,X,Y+y0+1,16,1,'#c9a06a');R(c,X,Y+y0+2,16,1,'#a07845');R(c,X,Y+y0+4,16,1,'#3f2a14');[1,9].forEach(px=>{R(c,X+px,Y+y0,3,5,'#8a6538');R(c,X+px,Y+y0,3,1,'#e3c08f');R(c,X+px+2,Y+y0+1,1,4,'#553920')});if(top)R(c,X,Y+5,16,2,'rgba(40,25,10,.28)')};
  const railV=(left)=>{const x0=left?0:12;R(c,X+x0,Y,4,16,'#6b4a2b');R(c,X+x0,Y,1,16,left?'#3f2a14':'#c9a06a');R(c,X+x0+1,Y,1,16,left?'#c9a06a':'#a07845');R(c,X+x0+3,Y,1,16,'#3f2a14');[2,10].forEach(py=>{R(c,X+x0,Y+py,4,3,'#8a6538');R(c,X+x0,Y+py,4,1,'#e3c08f')})};
  if(wtr(0,-1))rail(true);if(wtr(0,1))rail(false);if(wtr(-1,0))railV(true);if(wtr(1,0))railV(false);
}
function artPlaza(c,X,Y,x,y,at){
  R(c,X,Y,16,16,'#bdb196');
  for(let j=0;j<2;j++)for(let i=-1;i<2;i++){const ox=i*8+(((y*2+j)%2)?4:0),sx=Math.max(0,ox),w=Math.min(16,ox+7)-sx;if(w<=0)continue;const k=thash(x*2+i+((y*2+j)%2),y*2+j),col=k<.33?'#d2c7ab':k<.66?'#dcd2b9':'#e4dbc4';
    R(c,X+sx,Y+j*8,w,7,col);R(c,X+sx,Y+j*8,w,1,'#eee6d2');if(ox>=0)R(c,X+sx,Y+j*8,1,7,'#eee6d2');R(c,X+sx,Y+j*8+6,w,1,'#c9bd9f')}
  artCorner(c,X,Y,x,y,at,t=>t===','||t==='b'||t==='='||t==='B'||t==='D'||t==='g',(rx,ry)=>{const G=GCOL[1];R(c,X+(rx?13:0),Y+(ry?13:0),3,3,G);R(c,X+(rx?11:0),Y+(ry?15:0),5,1,G);R(c,X+(rx?15:0),Y+(ry?11:0),1,5,G)});
}
function artDirt(c,X,Y,x,y,at){
  R(c,X,Y,16,16,'#b99766');for(let i=0;i<8;i++){const a=(thash(x*3+i,y*7+9)*15)|0,b=(thash(x*5+3,y*3+i)*15)|0;R(c,X+a,Y+b,i<3?2:1,1,i<5?'#a5845a':'#cfb288')}
  const h=thash(x,y);if(h>.6){R(c,X+10,Y+11,2,2,'#8f8a7c');R(c,X+10,Y+11,1,1,'#b4af9c')}if(h<.3){R(c,X+2,Y+5,9,1,'#a5845a');R(c,X+3,Y+8,9,1,'#a5845a')}
  artCorner(c,X,Y,x,y,at,t=>t==='d'||t==='b'||t==='='||t==='B'||t==='D'||t==='P',(rx,ry)=>{const G=GCOL[1];R(c,X+(rx?13:0),Y+(ry?13:0),3,3,G);R(c,X+(rx?11:0),Y+(ry?15:0),5,1,G);R(c,X+(rx?15:0),Y+(ry?11:0),1,5,G)});
}
function artFlowers(c,X,Y,x,y,town){
  artGrass(c,X,Y,x,y,town);const h=thash(x,y),pal=(town&&x<WIND0&&REG_FLOWERS[regAt(x,y)])||[['#e2483b','#f7d84a','#ffffff'],['#a56ad6','#e9679a','#ffffff'],['#4f95e6','#ffffff','#f7d84a'],['#f2a33a','#f7e36b','#e2483b']][town?Math.floor(vnoise(x/8+5,y/8+17)*3.99):0],o=(h*5)|0;
  [[2+o%3,3,0],[10,5-o%2,1],[5,10,2],[11-o%3,11,0]].forEach(([a,b,k])=>{const p=pal[k];R(c,X+a+1,Y+b+3,1,2,'#3f8a45');R(c,X+a+2,Y+b+4,1,1,'#58a551');
    R(c,X+a+1,Y+b,1,3,p);R(c,X+a,Y+b+1,3,1,p);R(c,X+a+1,Y+b+1,1,1,p==='#f7d84a'||p==='#f7e36b'?'#e2913a':'#f7d84a');if(p!=='#ffffff'){R(c,X+a,Y+b,1,1,tint(p,-.2));R(c,X+a+2,Y+b+2,1,1,tint(p,-.2))}});
}
function artTall(c,X,Y,x,y){
  R(c,X,Y,16,16,'#58a653');for(let j=0;j<2;j++)for(let i=0;i<4;i++){const bx=X+i*4+(j?2:0)-1,by=Y+j*8;
    R(c,bx+1,by+1,1,6,'#86cc72');R(c,bx+2,by,1,7,'#6fbf62');R(c,bx+3,by+2,1,5,'#3f8a45');R(c,bx,by+3,1,4,'#3f8a45');R(c,bx+1,by+7,3,1,'#2f6d38')}
}
