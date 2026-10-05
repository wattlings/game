/* Wattlings · jeu/rendu/courbes.js
   Courbes : rivière, étang, pistes et allées dessinés au pixel. */

/* ================= COURBES : rivière, étang, pistes et allées dessinés au pixel =================
   La logique du jeu reste sur la grille (une case est praticable ou non), mais le dessin ne s'y limite plus :
   la rivière suit une vraie courbe, les pistes ont des virages en arc et des carrefours adoucis, les allées sont des rubans lisses.
   Chaque forme est décrite par sa distance (en pixels) à un tracé ; la couleur de chaque pixel se déduit de cette distance. */
const hex3=h=>{const n=parseInt(h.slice(1),16);return [n>>16,(n>>8)&255,n&255]};
function segDist(px,py,s){const dx=s[2]-s[0],dy=s[3]-s[1],L2=dx*dx+dy*dy;let t=L2?((px-s[0])*dx+(py-s[1])*dy)/L2:0;t=t<0?0:t>1?1:t;const qx=s[0]+dx*t-px,qy=s[1]+dy*t-py;return [Math.sqrt(qx*qx+qy*qy),s[4]+t*Math.sqrt(L2)]}
function mkLine(pts){const S=[];let cum=0;for(let i=0;i<pts.length-1;i++){const a=pts[i],b=pts[i+1],l=Math.hypot(b[0]-a[0],b[1]-a[1]);if(l<.01)continue;S.push([a[0],a[1],b[0],b[1],cum]);cum+=l}S.len=cum;
  S.bb=pts.reduce((m,p)=>[Math.min(m[0],p[0]),Math.min(m[1],p[1]),Math.max(m[2],p[0]),Math.max(m[3],p[1])],[1e9,1e9,-1e9,-1e9]);return S}
/* axe de la boucle : un rectangle dont les quatre coins sont des arcs */
function ringCentre(){
  const {x0,x1,y0,y1}=RING,X0=(x0+1)*TS,X1=x1*TS,Y0=(y0+1)*TS,Y1=y1*TS,r=24,P=[],arc=(cx,cy,a0)=>{for(let k=0;k<=8;k++){const a=(a0+k*11.25)*Math.PI/180;P.push([cx+Math.cos(a)*r,cy+Math.sin(a)*r])}};
  P.push([X0+r,Y0]);arc(X1-r,Y0+r,-90);arc(X1-r,Y1-r,0);arc(X0+r,Y1-r,90);arc(X0+r,Y0+r,180);return P;
}
let CURVES=null;
function curveLines(){
  if(CURVES)return CURVES;const c=v=>(v+1)*TS;
  const roads=[mkLine(ringCentre())].concat(TOWN_ROADS.map(([a,b])=>mkLine([[c(a[0]),c(a[1])],[c(b[0]),c(b[1])]])));
  const paths=TOWN_PATHS.map(p=>mkLine(p.map(([x,y])=>[x*TS+8,y*TS+8]))).concat(TOWN_LEADS.map(([x,a,b])=>mkLine([[x*TS+8,a],[x*TS+8,b]])));
  return CURVES={roads,paths};
}
const smin=(a,b,k)=>{const h=Math.max(k-Math.abs(a-b),0)/k;return Math.min(a,b)-h*h*k/4};
/* distance signée à la chaussée (négative dedans), avec le tracé le plus proche, l'écart à son axe et l'abscisse le long de cet axe */
function roadAt(px,py,cand){let d=1e9,best=1e9,bi=-1,bs=0,second=1e9;
  for(let i=0;i<cand.length;i++){const G=cand[i];let m=1e9,ms=0;for(let j=0;j<G.length;j++){const r=segDist(px,py,G[j]);if(r[0]<m){m=r[0];ms=r[1]}}
    d=i?smin(d,m,11):m;if(m<best){second=best;best=m;bi=i;bs=ms}else if(m<second)second=m}
  return [d-16,best,bs,second];
}
function curvePass(c,g){
  const W=TW*TS,H=TH*TS,im=c.getImageData(0,0,W,H),D=im.data,snow=SKY.snowG,set=(px,py,col)=>{const i=(py*W+px)*4;D[i]=col[0];D[i+1]=col[1];D[i+2]=col[2];D[i+3]=255};
  const tl=(px,py)=>{const r=g[py>>4];return r?r[px>>4]:undefined},soft=t=>t==='.'||t==='*'||t==='R'||t==='~'||t==='T'||t==='u'||t==='k'||t==='h'||t==='f'||t==='P'||t==='m'||t==='='||t==='b'||t==='g'||t==='r';
  // ---- eau : rivière puis étang ----
  const WB=hex3('#4f9fdc'),WL=hex3('#8fd0f4'),WD=hex3('#3f8ccb'),WS=hex3('#356f9f'),WF=hex3('#86c6ee'),EARTH=hex3(snow?'#cfd6dd':'#7a6a45'),LIP=hex3(snow?'#e3eaf0':'#4f9a4e'),WDEEP=hex3('#4794d4');
  const water=(px,py,d,maxd)=>{   // d : distance à la berge, positive dans l'eau
    d+=(vnoise(px/6.1+2.3,py/6.1+5.7)-.5)*2.6;if(d<-5)return;const t=tl(px,py),h=thash(px*5+1,py*9+4);      // la berge ondule ; l'herbe s'assombrit en tramé en approchant de l'eau
    if(d<0){if(!soft(t))return;if(d<-2.4){if(h<.55*(1+(d+2.4)/2.6))set(px,py,LIP)}else if(d<-1.1){if(h<.82)set(px,py,LIP)}else set(px,py,h<.24?LIP:EARTH);return}
    if(d<1.3){set(px,py,h<.3?WF:WS);return}
    if(d<4.6&&(vnoise(px/3.1,py/3.1)>.42+(d-1.3)*.1||h<.34*(1-(d-1.3)/3.3))){set(px,py,WF);return}      // hauts-fonds clairs, de plus en plus rares vers le large
    const n=vnoise(px/7+3,py/1.8);set(px,py,n>.74?WL:n<.19?WD:d>maxd*.55?WDEEP:WB)};
  for(let py=2*TS;py<(TH-2)*TS;py++){const cx=riverCx(py),hw=riverHw(py),a=cx-hw,b=cx+hw;for(let px=Math.floor(a)-7;px<=Math.ceil(b)+7;px++)water(px,py,Math.min(px+.5-a,b-(px+.5)),hw)}
  {const P0=L.pondL,cx=(P0.x0+P0.x1+1)/2*TS,cy=(P0.y0+P0.y1+1)/2*TS,A=(P0.x1-P0.x0+1)/2*TS+3,B=(P0.y1-P0.y0+1)/2*TS+3;
    for(let py=Math.floor(cy-B-8);py<=cy+B+8;py++)for(let px=Math.floor(cx-A-8);px<=cx+A+8;px++){const dx=(px+.5-cx)/A,dy=(py+.5-cy)/B,th=Math.atan2(dy,dx),r=Math.sqrt(dx*dx+dy*dy),Rr=1+.07*Math.sin(3*th+1)+.05*Math.sin(5*th+.4);
      water(px,py,(Rr-r)*Math.min(A,B),Math.min(A,B)*.8)}}
  // ---- allées : rubans de sable, bord plus sombre, herbe qui mord ----
  const {roads,paths}=curveLines(),PB=hex3(snow?'#e9e6dc':'#e6d8ae'),PD=hex3(snow?'#d3d2cc':'#cdbb88'),PE=hex3(snow?'#bdbdb8':'#b9a672'),PL=hex3('#f6eed6');
  const RPATH=REG.map(k=>REG_PATH[k]?REG_PATH[k].map(hex3):null);
  paths.forEach(S=>{const x0=Math.max(0,Math.floor(S.bb[0]-11)),y0=Math.max(0,Math.floor(S.bb[1]-11)),x1=Math.min(W-1,Math.ceil(S.bb[2]+11)),y1=Math.min(H-1,Math.ceil(S.bb[3]+11));
    for(let py=y0;py<=y1;py++)for(let px=x0;px<=x1;px++){let m=1e9;for(let j=0;j<S.length;j++){const r=segDist(px+.5,py+.5,S[j])[0];if(r<m)m=r}
      const d=m-6.6+(vnoise(px/4.3+1.7,py/4.3+9.1)-.5)*2.6;if(d>=1.8)continue;const t=tl(px,py);if(!(t==='='||t==='.'||t==='*'||t==='b'||t==='T'||t==='D'))continue;const h=thash(px*3+1,py*7+2);
      const rp=snow?null:RPATH[(ZONE[py>>4]||[])[px>>4]],b0=rp?rp[0]:PB,d0=rp?rp[1]:PD,e0=rp?rp[2]:PE,l0=rp?rp[3]:PL;
      if(d>=0){if(h<.2*(1-d/1.8))set(px,py,d0);continue}      // quelques grains de sable dans l'herbe
      if(d>-1.2){if(h<.42)continue;set(px,py,h>.82?e0:d0)}else if(d>-2.6)set(px,py,h<.45?d0:b0);else set(px,py,h<.035?d0:h>.975?l0:b0)}});
  // ---- pistes cyclables : chaussée, bordure de pierre éclairée d'un côté, ligne d'axe en pointillés ----
  const AB=hex3(snow?'#d8cfc9':'#c98e6e'),AD=hex3(snow?'#c3b5ac':'#b87c5e'),AL=hex3(snow?'#f1f3f6':'#dba98b'),C1=hex3(snow?'#f6f8fa':'#ebe1c9'),C2=hex3(snow?'#dfe5ea':'#d6cbb2'),C3=hex3(snow?'#b9c2cb':'#a39a84'),CJ=hex3('#bdb39b'),DASH=hex3('#fbf5e6');
  const verge=t=>t==='.'||t==='*'||t==='T'||t==='u'||t==='k'||t==='h'||t==='f'||t==='P'||t==='m'||t==='=';
  const near=(x,y)=>{for(let j=-1;j<=1;j++)for(let i=-1;i<=1;i++){const t=g[y+j]&&g[y+j][x+i];if(t==='b'||t==='g')return true}return false};
  for(let ty=2;ty<TH-2;ty++)for(let tx=2;tx<WIND0;tx++){if(!near(tx,ty))continue;const t0=g[ty][tx];if(t0==='B'||t0==='D'||t0==='r'||t0==='q'||t0==='g')continue;
    const mx=tx*TS+8,my=ty*TS+8,cand=roads.map(G=>G.filter(s=>segDist(mx,my,s)[0]<44)).filter(G=>G.length);if(!cand.length)continue;
    for(let j=0;j<16;j++)for(let i=0;i<16;i++){const px=tx*TS+i,py=ty*TS+j,r=roadAt(px+.5,py+.5,cand),d=r[0];
      if(d>=0){if(d<2.8&&!snow&&verge(t0)&&thash(px*7+5,py*11+3)<.8*(1-d/2.8)){const k=(py*W+px)*4;D[k]=D[k]*.8+8;D[k+1]=D[k+1]*.83+4;D[k+2]=D[k+2]*.78}continue}      // l'accotement : l'herbe fonce en tramé au pied de la bordure
      if(d>-1&&verge(t0)&&thash(px*3+7,py*5+1)<.1)continue;      // un brin d'herbe passe par-dessus la bordure
      if(d>-2){const gx=roadAt(px+1.5,py+.5,cand)[0]-roadAt(px-.5,py+.5,cand)[0],gy=roadAt(px+.5,py+1.5,cand)[0]-roadAt(px+.5,py-.5,cand)[0],lit=gx+gy<0;
        set(px,py,d>-1?(lit?C1:C3):((px*3+py*5)%11===0?CJ:C2));continue}
      if(d>-3){set(px,py,AD);continue}
      if(!snow&&r[1]<1&&r[3]>24&&((r[2]/8)|0)%2===0){set(px,py,DASH);continue}
      const h=thash(px*5+3,py*3+1);set(px,py,h<.03?AD:h>.972?AL:AB)}}
  c.putImageData(im,0,0);
}
/* ---- ce qui se pose ensuite sur l'eau et la chaussée ---- */
function curveDecor(c,g){
  const at=(x,y)=>g[y]&&g[y][x];
  for(let y=2;y<TH-2;y++)for(let x=2;x<WIND0;x++){const t=g[y][x],X=x*TS,Y=y*TS,h=thash(x,y);
    if(t==='g')artBridge(c,X,Y,x,y,(dx,dy)=>at(x+dx,y+dy));
    else if(t==='=')( (at(x-1,y)==='f'||at(x+1,y)==='f')&&artPath(c,X,Y,x,y,(dx,dy)=>at(x+dx,y+dy)) );
    else if(t==='b'){if((x*7+y*13)%29===0&&[[0,1],[0,-1],[1,0],[-1,0]].every(([a,b])=>{const q=at(x+a,y+b);return q==='b'||q==='g'})&&!SKY.snowG){const w='#fbf5e6',B='#c98e6e';R(c,X+3,Y+8,3,3,w);R(c,X+4,Y+9,1,1,B);R(c,X+10,Y+8,3,3,w);R(c,X+11,Y+9,1,1,B);R(c,X+5,Y+7,6,1,w);R(c,X+5,Y+6,2,1,w);R(c,X+10,Y+5,2,2,w)}}
    else if(t==='R'||t==='~'){const deep=[[1,0],[-1,0],[0,1],[0,-1]].every(([a,b])=>{const q=at(x+a,y+b);return q==='R'||q==='~'}),k=(h*61)|0;
      if(deep&&k<3){R(c,X+5,Y+6,6,4,'#4b9a4d');R(c,X+6,Y+5,4,6,'#4b9a4d');R(c,X+6,Y+6,3,2,'#6fbf62');R(c,X+9,Y+7,2,1,'#4f9fdc');R(c,X+5,Y+10,5,1,'#3f8ccb');if(k===0){R(c,X+7,Y+7,2,2,'#f7c8dc');R(c,X+7,Y+7,1,1,'#fff')}}
      else if(deep&&k===3){R(c,X+6,Y+8,5,4,'#8a8577');R(c,X+7,Y+7,3,1,'#b4af9c');R(c,X+6,Y+8,2,1,'#b4af9c');R(c,X+5,Y+12,7,1,'#3f8ccb');R(c,X+10,Y+9,1,3,'#6b665a')}
      else if(t==='R'&&h>.5&&(x===riverL(y)||x===riverR(y))){const py=Y+8,bx=Math.round(x===riverL(y)?riverCx(py)-riverHw(py)+2:riverCx(py)+riverHw(py)-3);R(c,bx,Y+3,1,8,'#3f8a45');R(c,bx+(x===riverL(y)?2:-2),Y+6,1,6,'#3f8a45');R(c,bx,Y+2,1,2,'#7a5a34')}}}
  // viaduc : la voie ferrée franchit la rivière sur un tablier d'acier posé sur deux piles de pierre
  const ry=3,xa=riverL(ry)-1,xb=riverR(ry)+1;
  for(let y=ry;y<=ry+1;y++)for(let x=xa;x<=xb;x++){const X=x*TS,Y=y*TS,land=x===xa||x===xb;
    R(c,X,Y,16,16,land?'#9a958c':'#6a717d');if(!land)R(c,X,Y+2,16,12,'#7b8390');
    for(let k=0;k<4;k++){R(c,X+k*4+1,Y+3,2,10,land?'#6b4a2b':'#54402a');R(c,X+k*4+1,Y+3,2,1,land?'#86602f':'#6b5238')}
    [5,10].forEach(q=>{R(c,X,Y+q,16,1,'#e6e7ec');R(c,X,Y+q+1,16,1,land?'#77726a':'#4b515c')});
    if(land){const sx=x===xa?13:0;R(c,X+sx,Y,3,16,'#b4af9c');R(c,X+sx,Y,1,16,'#d5d1c0');for(let k=2;k<16;k+=5)R(c,X+sx,Y+k,3,1,'#8a8577')}
    else{const gy=y===ry?0:13;R(c,X,Y+gy,16,3,'#3f6b5c');R(c,X,Y+gy,16,1,'#6a9a86');R(c,X,Y+gy+2,16,1,'#2a4a3f');for(let k=1;k<16;k+=4)R(c,X+k,Y+gy+1,1,1,'#9fc5b4');
      R(c,X+((x%2)?2:10),Y+gy,1,3,'#2a4a3f')}}
  [xa+2,xb-2].forEach(x=>{const X=x*TS;   // piles de pierre : un bec arrondi de chaque côté du tablier, l'eau qui s'y brise
    [[ry*TS,-1],[(ry+2)*TS-1,1]].forEach(([Y,s])=>{[[10,0],[10,1],[10,2],[8,3],[6,4],[2,5]].forEach(([w,k])=>{const y=Y+s*(k+1),x0=X+8-w/2;R(c,x0,y,w,1,k>3?'#98937f':'#b4af9c');R(c,x0,y,1,1,'#d5d1c0');R(c,x0+w-1,y,1,1,'#7d786b')});
      R(c,X+3,Y+s*2,10,1,'#8a8577');R(c,X+1,Y+s*8,4,1,'#c6ebfb');R(c,X+11,Y+s*8,4,1,'#c6ebfb');R(c,X+6,Y+s*9,4,1,'#8fd0f4')})});
  for(let x=xa+1;x<xb;x++)R(c,x*TS,(ry+2)*TS,16,3,'rgba(10,30,60,.28)');   // ombre du tablier sur l'eau
}
