/* Wattlings · jeu/rendu/ciel.js
   Le ciel à l'écran : ombres, lumière, pluie, neige, brouillard, éclairs. */

/* ================= LE CIEL À L'ÉCRAN =================
   Ce fichier dessine ce que a_sky.js a calculé :
   - les ombres portées, dans la direction opposée au soleil et d'autant plus longues qu'il est bas ;
   - la lumière : toute la scène est multipliée par la couleur de l'air, puis les lampadaires et les fenêtres y rallument des halos ;
   - le temps qu'il fait : pluie, neige, brouillard, vent, éclairs, sol mouillé et flaques.
   Rien n'est figé dans le décor : tout se superpose à chaque image, sur de petits canevas de la taille de l'écran. */
const SKR={st:null,stK:'',sc:null,lc:null,g1:null,g2:null,g3:null,flash:0,nf:300,turb:0,lampK:null,lamps:[],artK:null,calm:false};
try{SKR.calm=matchMedia('(prefers-reduced-motion: reduce)').matches}catch(e){}
function skGlow(r,rgb,mid){const c=mkc(r*2,r*2),g=c.getContext('2d'),gr=g.createRadialGradient(r,r,1,r,r,r);gr.addColorStop(0,`rgba(${rgb},1)`);gr.addColorStop(mid||.4,`rgba(${rgb},.55)`);gr.addColorStop(1,`rgba(${rgb},0)`);g.fillStyle=gr;g.fillRect(0,0,r*2,r*2);return c}
function skLayer(k){const w=cv.width,h=cv.height;let c=SKR[k];if(!c||c.width!==w||c.height!==h){c=SKR[k]=mkc(w,h);c.g=c.getContext('2d');c.g.imageSmoothingEnabled=false}return c}
const lampLean=o=>{const m=[0,18,9,5,3][wearLvl()-1];return m&&(o.x*7+o.y*3)%m===0?1:0};
/* après un changement de saison, de neige ou de patine : on repeint la ville */
function skyApply(){
  if(SKR.artK!==SKY.artKey&&mapCache.town)buildMapCanvas('town');
}
/* ---- ombres du décor (bâtiments, arbres, haies, clôtures) : recalculées quand le soleil a tourné ---- */
function skHull(c,x,y,w,h,dx,dy){   // rectangle « traîné » le long du vecteur (dx,dy)
  const ax=dx<0?x+dx:x,bx=dx<0?x+w:x+w+dx,ay=dy<0?y+dy:y,by=dy<0?y+h:y+h+dy;c.beginPath();
  if((dx>=0)===(dy>=0)){c.moveTo(ax,ay);c.lineTo(ax+w,ay);c.lineTo(bx,by-h);c.lineTo(bx,by);c.lineTo(bx-w,by);c.lineTo(ax,ay+h)}
  else{c.moveTo(bx,ay);c.lineTo(bx,ay+h);c.lineTo(ax+w,by);c.lineTo(ax,by);c.lineTo(ax,by-h);c.lineTo(bx-w,ay)}
  c.closePath();c.fill();
}
function skyStatic(){
  const sh=SKY.sh,k=Math.round(sh.x*10)+'|'+Math.round(sh.y*10)+'|'+SEA.k+'|'+SKR.artK;if(SKR.st&&SKR.stK===k)return SKR.st;
  if(!SKR.st)SKR.st=mkc(TW*TS,TH*TS);const c=SKR.st.getContext('2d'),g=MAPS.town.g,sx=sh.x,sy=sh.y,ang=Math.atan2(sy,sx),ln=Math.hypot(sx,sy);SKR.stK=k;
  c.globalCompositeOperation='source-over';c.clearRect(0,0,TW*TS,TH*TS);c.fillStyle='#000';c.strokeStyle='#000';c.lineCap='round';
  BLD.forEach(b=>{const hb=14+b.h*3;skHull(c,b.x*TS,b.y*TS+8,b.w*TS,b.h*TS-8,sx*hb,sy*hb)});
  for(let y=1;y<TH-1;y++)for(let x=1;x<TW-1;x++){const t=g[y][x],X=x*TS,Y=y*TS;
    if(t==='T'){const sp=artTreeKind(x,y),bx=X+8,by=Y+13;
      if(sp===1){const tx=bx+sx*27,ty=by+sy*27,nx=-sy/ln*8,ny=sx/ln*8;c.beginPath();c.moveTo(bx+nx,by+ny);c.lineTo(tx,ty);c.lineTo(bx-nx,by-ny);c.closePath();c.fill();c.beginPath();c.ellipse(bx,by,7,3,0,0,7);c.fill()}
      else if(sp===4||(sp===6&&SEA.se!==3)){c.beginPath();c.ellipse(bx+sx*13,by+sy*13,4+ln*13,4,ang,0,7);c.fill()}
      else if(SEA.se===3&&sp!==5){c.lineWidth=2;c.beginPath();c.moveTo(bx,by);c.lineTo(bx+sx*14,by+sy*14);c.stroke();c.lineWidth=1;[-.5,.45,0].forEach(a=>{const ca=Math.cos(a),sa=Math.sin(a),ux=sx*ca-sy*sa,uy=sx*sa+sy*ca;c.beginPath();c.moveTo(bx+sx*11,by+sy*11);c.lineTo(bx+sx*11+ux*11,by+sy*11+uy*11);c.stroke()})}
      else{c.lineWidth=3;c.beginPath();c.moveTo(bx,by);c.lineTo(bx+sx*12,by+sy*12);c.stroke();c.beginPath();c.ellipse(bx+sx*17,by+sy*17,9+ln*3,8,ang,0,7);c.fill()}}
    else if(t==='u'){c.beginPath();c.ellipse(X+8+sx*5,Y+12+sy*5,6+ln*2,4,ang,0,7);c.fill()}
    else if(t==='k'){c.beginPath();c.ellipse(X+8+sx*3,Y+12+sy*3,5+ln,3,ang,0,7);c.fill()}
    else if(t==='h')skHull(c,X,Y+4,16,11,sx*10,sy*10);
    else if(t==='P')skHull(c,X,Y+9,16,6,sx*13,sy*13);
    else if(t==='m')skHull(c,X,Y+8,16,7,sx*8,sy*8);
    else if(t==='f'){c.lineWidth=2;[3,11].forEach(px=>{c.beginPath();c.moveTo(X+px,Y+14);c.lineTo(X+px+sx*11,Y+14+sy*11);c.stroke()});c.lineWidth=1;c.beginPath();c.moveTo(X+sx*8,Y+14+sy*8);c.lineTo(X+16+sx*8,Y+14+sy*8);c.stroke()}}
  // éoliennes : un long trait, le rotor au bout
  c.lineWidth=3;objsFor('town').forEach(o=>{if(o.kind!=='turbine')return;const bx=o.x*TS+8,by=o.y*TS+14;c.beginPath();c.moveTo(bx,by);c.lineTo(bx+sx*46,by+sy*46);c.stroke();c.beginPath();c.ellipse(bx+sx*46,by+sy*46,12,5,ang+1.57,0,7);c.fill()});
  // un bâtiment ne se fait pas d'ombre sur lui-même
  c.globalCompositeOperation='destination-out';BLD.forEach(b=>c.fillRect(b.x*TS-3,b.y*TS,b.w*TS+6,b.h*TS));c.globalCompositeOperation='source-over';
  return SKR.st;
}
const SK_NOSH={none:1,rug:1,chalk:1,leafpile:1,duck:1,boat:1,derive:1,train:1,turbine:1,gate:0,ablock:1,ball:0};
/* ---- sous les personnages : sol mouillé, flaques, ombres ---- */
function skyUnder(c,ox,oy,objs,t){
  const sh=SKY.sh,vw=cv.width,vh=cv.height,g=MAPS.town.g;
  if(SKY.wet>.03){
    c.fillStyle='rgba(22,40,74,'+(SKY.wet*.13).toFixed(3)+')';c.fillRect(0,0,vw,vh);
    const x0=Math.max(0,Math.floor(ox/TS)),y0=Math.max(0,Math.floor(oy/TS)),x1=Math.min(WIND0-1,Math.ceil((ox+vw)/TS)),y1=Math.min(TH-1,Math.ceil((oy+vh)/TS)),lim=SKY.wet*.1,rain=SKY.rain>.05;
    for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++){const tl=g[y][x];if(tl!=='b'&&tl!=='='&&tl!==','&&tl!=='d')continue;const h=wh(x,y,200);if(h>=lim)continue;
      const h2=wh(x,y,201),w=6+((h2*5)|0),X=x*TS-ox+2+((h2*7)|0),Y=y*TS-oy+4+(((h2*31)|0)%7);wearPuddle(c,X,Y,w);
      if(rain){const r=((t>>1)+((h2*90)|0))%26;if(r<9){c.fillStyle='rgba(255,255,255,'+(.55-r/20).toFixed(2)+')';c.fillRect(X+2+((h2*40)|0)%(w-3)-(r>>2),Y+1,1+(r>>1),1)}}}
  }
  if(sh.a>.02){
    const L=skLayer('sc'),s=L.g,ang=Math.atan2(sh.y,sh.x),ln=Math.hypot(sh.x,sh.y);s.clearRect(0,0,vw,vh);s.drawImage(skyStatic(),-ox,-oy);s.fillStyle='#000';s.strokeStyle='#000';s.lineCap='round';
    const body=(px,py,hh)=>{const X=px-ox+8+sh.x*hh*.5,Y=py-oy+14+sh.y*hh*.5;if(X<-30||X>vw+30||Y<-30||Y>vh+30)return;s.beginPath();s.ellipse(X,Y,3.5+ln*hh*.5,3.4,ang,0,7);s.fill()};
    objs.forEach(o=>{if(o.flat||SK_NOSH[o.kind])return;const px=o.px!==undefined?o.px:o.x*TS,py=o.py!==undefined?o.py:o.y*TS;
      if(regShadow(s,o,ox,oy,sh))return;
      if(o.kind==='npc')body(px,py,15);
      else if(o.kind==='lamp'){const X=px-ox+8,Y=py-oy+15;if(X<-60||X>vw+60||Y<-60||Y>vh+60)return;s.lineWidth=2;s.beginPath();s.moveTo(X,Y);s.lineTo(X+sh.x*27,Y+sh.y*27);s.stroke();s.fillRect(X+sh.x*27-4,Y+sh.y*27-2,8,4)}
      else if(o.kind==='qsign'||o.kind==='sign'||o.kind==='bsign'||o.kind==='mast'||o.kind==='anemo'||o.kind==='clock'){const X=px-ox+8,Y=py-oy+15;s.lineWidth=2;s.beginPath();s.moveTo(X,Y);s.lineTo(X+sh.x*16,Y+sh.y*16);s.stroke();s.fillRect(X+sh.x*16-4,Y+sh.y*16-3,8,6)}
      else body(px,py,9)});
    if(!BOX.on)body(P.px,P.py,15);
    c.globalAlpha=sh.a;c.drawImage(L,0,0);c.globalAlpha=1;
  }else if(SKY.lamps){
    // la nuit, chaque personnage projette une ombre à l'opposé du lampadaire le plus proche
    const lamps=skLamps(),one=(px,py)=>{const fx=px+8,fy=py+14;let best=null,bd=76;for(const l of lamps){const d=Math.hypot(fx-l.x*TS-8,fy-l.y*TS-12);if(d<bd){bd=d;best=l}}if(!best||bd<5)return;
      const ux=(fx-best.x*TS-8)/bd,uy=(fy-best.y*TS-12)/bd,len=5+bd/9;c.fillStyle='rgba(4,8,26,'+(.34*(1-bd/76)).toFixed(3)+')';c.beginPath();c.ellipse(fx-ox+ux*len*.7,fy-oy+uy*len*.7,len,3,Math.atan2(uy,ux),0,7);c.fill()};
    one(P.px,P.py);objs.forEach(o=>{if(o.kind==='npc')one(o.px!==undefined?o.px:o.x*TS,o.py!==undefined?o.py:o.y*TS)});
  }
}
function skLamps(){if(SKR.lampK!==DECOR_CACHE.l){SKR.lampK=DECOR_CACHE.l;SKR.lamps=DECOR_CACHE.l.filter(o=>o.kind==='lamp')}return SKR.lamps}
const skWinLit=(b,w)=>{if(b.id==='boulangerie'&&SKY.clock>=3.5&&SKY.clock<8.5)return true;if(S.ch===7&&b.id===S.site)return false;return ((w[4]*977)%1)<SKY.winFrac};
function thunder(){try{const a=AUD.ctx;if(!a||!AUD.on||!AUD.noise)return;const s=a.createBufferSource(),f=a.createBiquadFilter(),g=a.createGain(),t=a.currentTime+.25;s.buffer=AUD.noise;s.loop=true;f.type='lowpass';f.frequency.value=140;
  g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.5,t+.08);g.gain.exponentialRampToValueAtTime(.001,t+1.8);s.connect(f).connect(g).connect(AUD.master);s.start(t);s.stop(t+1.9)}catch(e){}}
/* ---- par-dessus tout : lumière, fenêtres, brouillard, pluie, neige, vent, éclairs ---- */
function skyOver(c,ox,oy,objs,t){
  const vw=cv.width,vh=cv.height,A=SKY.amb,dim=Math.min(A[0],A[1],A[2])<250,night=SKY.dark>.2,lamps=skLamps();
  const vis=b=>b.x*TS-ox<vw+30&&(b.x+b.w)*TS-ox>-30&&b.y*TS-oy<vh+40&&(b.y+b.h)*TS-oy>-40;
  if(dim){
    const L=skLayer('lc'),g=L.g;g.globalCompositeOperation='source-over';g.globalAlpha=1;g.fillStyle=`rgb(${A[0]},${A[1]},${A[2]})`;g.fillRect(0,0,vw,vh);
    if(night){
      if(!SKR.g1){SKR.g1=skGlow(56,'255,214,150',.38);SKR.g2=skGlow(20,'255,206,130',.45);SKR.g3=skGlow(44,'214,224,255',.4)}
      g.globalCompositeOperation='lighter';const f=sk01((SKY.dark-.15)/.4);
      if(SKY.lamps)lamps.forEach(o=>{const X=o.x*TS-ox+8,Y=o.y*TS-oy+2;if(X<-60||X>vw+60||Y<-60||Y>vh+60)return;const flick=(o.x*5+o.y*3)%11===0&&((t>>2)%9<2||(t>>1)%37===0);if(flick)return;g.globalAlpha=.92*f;g.drawImage(SKR.g1,X-56,Y-50)});
      if(SKY.winFrac>0)BLD.forEach(b=>{if(!b.wins||!vis(b))return;b.wins.forEach(w=>{if(!skWinLit(b,w))return;g.globalAlpha=.5*f;g.drawImage(SKR.g2,w[0]+w[2]/2-ox-20,w[1]+w[3]-oy-12)})});
      BLD.forEach(b=>{if(b.id!=='pharma'||!vis(b))return;g.globalAlpha=.5*f;g.drawImage(SKR.g2,(b.x+b.w)*TS-ox-27,b.y*TS-oy-11)});
      regLight(g,ox,oy,t,f);
      // toi : une lanterne pendant la ronde de nuit, sinon juste de quoi distinguer ce qui t'entoure
      g.globalAlpha=(S.ch===7?.8:.3)*f;g.drawImage(SKR.g3,P.px-ox+8-44,P.py-oy+6-44);g.globalAlpha=1;
    }
    c.globalCompositeOperation='multiply';c.drawImage(L,0,0);c.globalCompositeOperation='source-over';
    if(night){
      const f=sk01((SKY.dark-.15)/.4);
      if(SKY.winFrac>0)BLD.forEach(b=>{if(!b.wins||!vis(b))return;b.wins.forEach(w=>{if(!skWinLit(b,w))return;const X=w[0]-ox,Y=w[1]-oy;c.fillStyle=`rgba(255,214,128,${(.86*f).toFixed(2)})`;c.fillRect(X,Y,w[2],w[3]);c.fillStyle=`rgba(255,244,196,${(.8*f).toFixed(2)})`;c.fillRect(X,Y,w[2],1);
        if(w[2]>=7){c.fillStyle=`rgba(150,96,40,${(.55*f).toFixed(2)})`;c.fillRect(X+(w[2]>>1),Y,1,w[3])}})});
      regNight(c,ox,oy,f);
      if(SKY.lamps)lamps.forEach(o=>{const X=o.x*TS-ox,Y=o.y*TS-oy;if(X<-20||X>vw+20||Y<-20||Y>vh+40)return;if((o.x*5+o.y*3)%11===0&&(t>>2)%9<2)return;const l=lampLean(o)*2;c.fillStyle='#fff6c4';c.fillRect(X+5+l,Y-12,6,2);c.fillStyle='rgba(255,236,170,.35)';c.fillRect(X+3+l,Y-13,10,4)});
    }
  }
  // brouillard : un voile, et des bancs qui dérivent
  if(SKY.fog>.05){c.fillStyle=`rgba(226,232,238,${(SKY.fog*.42).toFixed(3)})`;c.fillRect(0,0,vw,vh);
    for(let i=0;i<5;i++){const wx=((t*.12*(1+i*.2)+i*370+(i%2?ox*.3:-ox*.2))%(vw+400)+vw+400)%(vw+400)-200,wy=((i*97+40-oy*.4)%(vh+120)+vh+120)%(vh+120)-60;c.fillStyle=`rgba(240,244,248,${(SKY.fog*.16).toFixed(3)})`;c.beginPath();c.ellipse(wx,wy,170,38,0,0,7);c.fill()}}
  const area=vw*vh,wind=SKY.wind;
  if(SKY.rain>.05){
    const n=Math.min(900,Math.round(SKY.rain*area/360)),sl=1+wind*5,W=vw+60,H=vh+30;c.fillStyle=SKY.dark>.4?'rgba(170,190,235,.5)':'rgba(214,230,250,.62)';
    for(let i=0;i<n;i++){const sp=6+(i%5),x=((thash(i,3)*W+t*sl*.9-ox)%W+W)%W-30,y=((thash(i,9)*H+t*sp-oy)%H+H)%H-15;c.fillRect(x,y,1,3);c.fillRect(x+(sl>2.5?1:0),y+3,1,3)}
    c.fillStyle='rgba(235,244,255,.7)';
    for(let i=0;i<n/5;i++){const ph=(t+i*7)%10,k=((t+i*7)/10)|0;if(ph>5)continue;const x=(thash(i,k)*vw)|0,y=(thash(k,i+50)*vh)|0;if(ph<3)c.fillRect(x,y,2,1);else{c.fillRect(x-2,y-1,1,1);c.fillRect(x+3,y-1,1,1);c.fillRect(x,y-2,1,1)}}
  }
  if(SKY.snow>0){
    const n=Math.min(500,Math.round(SKY.snow*area/520)),W=vw+40,H=vh+20;c.fillStyle='rgba(255,255,255,.92)';
    for(let i=0;i<n;i++){const sp=.45+(i%4)*.22,x=((thash(i,13)*W+Math.sin(t/31+i)*7+t*wind*1.6-ox)%W+W)%W-20,y=((thash(i,19)*H+t*sp-oy)%H+H)%H-10,s=i%5===0?2:1;c.fillRect(x|0,y|0,s,s)}
  }
  if(wind>.7&&!SKR.calm){   // grand vent : des traits qui filent, des feuilles arrachées
    const n=Math.round((wind-.55)*14*area/60000),W=vw+120;c.fillStyle='rgba(255,255,255,.26)';
    for(let i=0;i<n;i++){const x=((thash(i,23)*W+t*(5+i%4))%W+W)%W-60,y=(thash(i,29)*vh+Math.sin(t/17+i)*5)|0;c.fillRect(x|0,y,10+(i%3)*8,1)}
    if(SEA.se===2||SEA.se===0)for(let i=0;i<n;i++){const x=((thash(i,33)*W+t*(2.6+i%3)-ox)%W+W)%W-60,y=((thash(i,39)*vh+Math.sin(t/9+i*2)*9+t*.4-oy)%vh+vh)%vh;c.fillStyle=SEA.se===2?LEAFC[i%5]:'#f9d3e2';c.fillRect(x|0,y|0,2,1)}
  }
  if(SKY.storm){if(--SKR.nf<=0){SKR.flash=12;SKR.nf=280+((thash(t,5)*520)|0);thunder()}}
  if(SKR.flash>0){if(!SKR.calm){const a=SKR.flash>9?.3:SKR.flash>7?.06:SKR.flash>4?.2:.07;c.fillStyle=`rgba(232,238,255,${a})`;c.fillRect(0,0,vw,vh)}SKR.flash--}
}
