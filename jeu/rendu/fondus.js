/* Wattlings · jeu/rendu/fondus.js
   Fondus : les jointures entre textures. */

/* ================= FONDUS : les jointures entre textures =================
   Trois passes au pixel sur le sol de la ville, pour qu'aucune frontière ne soit une ligne droite :
   - blendEdges : là où un sol posé (pavés, terre, quai, cultures) touche l'herbe, la limite ondule, l'herbe mord sur le sol et le sol s'égrène dans l'herbe ;
   - blendGrass : d'une région à l'autre, la teinte de l'herbe ne change plus au cordeau : la limite serpente et les deux teintes se mêlent en tramé ;
   - les berges, les allées et le bord des pistes sont adoucis dans curvePass (b_curve.js). */
const BAYER=[0,8,2,10,12,4,14,6,3,11,1,9,15,7,13,5],hexI=h=>parseInt(h.slice(1),16);
let ZEFF=null;const ZPIX={};
/* quartier « effectif » : les cases sans quartier (berges, bords de piste) prennent celui du voisin le plus proche */
function zoneEff(){
  if(ZEFF)return ZEFF;ZEFF=[];
  for(let y=0;y<TH;y++){const r=new Int8Array(TW);for(let x=0;x<TW;x++){let z=ZONE[y]&&ZONE[y][x]>=0?ZONE[y][x]:-1;
    if(z<0&&x<WIND0){let bd=99;for(let j=-3;j<=3;j++)for(let i=-3;i<=3;i++){const q=ZONE[y+j]?ZONE[y+j][x+i]:-1;if(q>=0){const d=i*i+j*j;if(d<bd){bd=d;z=q}}}}r[x]=z}ZEFF.push(r)}
  return ZEFF;
}
/* quartier vu depuis un pixel : la limite serpente (bruit lent) et se trame sur une case de large */
function zonePix(px,py,Z){
  const sx=px+.5+(vnoise(px/21+7.3,py/21+3.1)-.5)*22,sy=py+.5+(vnoise(px/21+31.7,py/21+17.9)-.5)*22,u=(sx-8)/16,v=(sy-8)/16,i0=Math.floor(u),j0=Math.floor(v);
  const t1=(BAYER[(px&3)+((py&3)<<2)]+.5)/16*.55+thash(px*7+3,py*13+5)*.45,t2=(BAYER[((px+2)&3)+(((py+1)&3)<<2)]+.5)/16*.55+thash(px*5+11,py*3+7)*.45;
  const x=i0+((u-i0)>t1?1:0),y=j0+((v-j0)>t2?1:0);return x<0||y<0||x>=TW||y>=TH?-2:Z[y][x];
}
function blendGrass(c){
  if(SEA.snow||!ZG0)return;
  const W=TW*TS,H=TH*TS,im=c.getImageData(0,0,W,H),D=im.data,Z=zoneEff(),P0=ZG0.map(hexI),PZ=ZG.map(p=>p.map(hexI)),pal=z=>z>=0?PZ[z]:P0;
  for(let ty=0;ty<TH;ty++)for(let tx=0;tx<TW;tx++){
    const z0=ZONE[ty]&&ZONE[ty][tx]>=0?ZONE[ty][tx]:-1,src=pal(z0);let mixed=Z[ty][tx]!==z0;
    for(let j=-2;j<=2&&!mixed;j++)for(let i=-2;i<=2;i++){const x=tx+i,y=ty+j;if(x>=0&&y>=0&&x<TW&&y<TH&&Z[y][x]!==z0){mixed=true;break}}
    if(!mixed)continue;
    let M=ZPIX[ty*TW+tx];if(!M){M=ZPIX[ty*TW+tx]=new Int8Array(256);for(let j=0;j<16;j++)for(let i=0;i<16;i++){const t=zonePix(tx*16+i,ty*16+j,Z);M[j*16+i]=t===-2?z0:t}}      // la géométrie des quartiers ne change jamais : calculée une fois
    for(let j=0;j<16;j++)for(let i=0;i<16;i++){const px=tx*16+i,py=ty*16+j,k=(py*W+px)*4,col=(D[k]<<16)|(D[k+1]<<8)|D[k+2];let q=0;while(q<5&&src[q]!==col)q++;if(q>4)continue;
      const dst=pal(M[j*16+i]);if(dst===src)continue;const n=dst[q];D[k]=n>>16;D[k+1]=(n>>8)&255;D[k+2]=n&255}}
  c.putImageData(im,0,0);
}
/* sols posés contre l'herbe : amplitude de l'ondulation, en pixels */
const BLEND_AMP={',':2.2,d:3.8,q:1.1,c:3.2},BLEND_SOW={',':[.05,.2],d:[.3,.2],q:[0,.14],c:[.22,.2]};      // semis : part du sol qui s'égrène dans l'herbe, part d'herbe qui pousse sur le sol
function blendEdges(c,g){
  const W=TW*TS,H=TH*TS,im=c.getImageData(0,0,W,H),D=im.data,S0=new Uint8ClampedArray(D);
  const hard=(x,y)=>{const t=g[y]&&g[y][x];return t===','||t==='d'||t==='q'?t:t==='*'&&x<WIND0&&regCrop(x,y)?'c':0};
  const soft=t=>t==='.'||t==='*'||t==='T'||t==='u'||t==='k'||t==='h'||t==='f'||t==='P'||t==='m'||t===':';
  const cp=(ax,ay,bx,by)=>{if(ax<0||ay<0||bx<0||by<0||ax>=W||bx>=W||ay>=H||by>=H)return;const a=(ay*W+ax)*4,b=(by*W+bx)*4;D[a]=S0[b];D[a+1]=S0[b+1];D[a+2]=S0[b+2]};
  const put=(x,y,col)=>{if(x<0||y<0||x>=W||y>=H)return;const a=(y*W+x)*4;D[a]=col[0];D[a+1]=col[1];D[a+2]=col[2]};
  for(let ty=1;ty<TH-1;ty++)for(let tx=1;tx<WIND0;tx++){const k=hard(tx,ty);if(!k)continue;const A=BLEND_AMP[k],n=Math.ceil(A+2),[sa,sb]=BLEND_SOW[k];
    [[0,-1],[0,1],[-1,0],[1,0]].forEach(([dx,dy])=>{const nx=tx+dx,ny=ty+dy;if(!soft(g[ny][nx])||hard(nx,ny))return;zoneGrass(nx,ny);const G=[hex3(GCOL[1]),hex3(GT[0])];
      const e=dx?(dx>0?tx*16+16:tx*16):(dy>0?ty*16+16:ty*16),sg=dx?dx:dy;      // e : position de la limite sur l'axe perpendiculaire ; sg : côté de l'herbe
      for(let a=0;a<16;a++){const w=(dx?ty:tx)*16+a,o=(vnoise(w/5.1+e*.37,e*.61+3)-.5)*2*A+(thash(w*3+1,e*5+2)-.5)*1.4;      // o > 0 : le sol déborde sur l'herbe
        for(let s=1;s<=n;s++){const pg=sg>0?e+s-1:e-s,ph=sg>0?e-s:e+s-1,gx=dx?pg:w,gy=dx?w:pg,hx=dx?ph:w,hy=dx?w:ph,r=thash(gx*11+s,gy*17+3),r2=thash(hx*13+5,hy*7+s);
          if(s-.5<o||(s-.5<o+2.2&&r<sa))cp(gx,gy,hx,hy);
          else if(o<.5-s||(o<.5-s+2.2&&r2<sb))put(hx,hy,G[r2<.07?1:0])}}})}
  c.putImageData(im,0,0);
}
