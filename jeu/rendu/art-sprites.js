/* Wattlings · jeu/rendu/art-sprites.js
   Rendu détaillé : contour et volume automatiques, cache des personnages et des objets. */

/* ---- contour et volume automatiques : un sprite plat devient un sprite « travaillé » ---- */
function gbaFx(x,w,h){
  const im=x.getImageData(0,0,w,h),d=im.data,s=new Uint8ClampedArray(d),A=(a,b)=>a<0||b<0||a>=w||b>=h?0:s[(b*w+a)*4+3];let x0=w,y0=h,x1=-1,y1=-1;
  for(let b=0;b<h;b++)for(let a=0;a<w;a++){const i=(b*w+a)*4,al=s[i+3];
    if(al>200){const tl=A(a,b-1)<128||A(a-1,b)<128,br=A(a,b+1)<128||A(a+1,b)<128;
      if(br&&!tl){d[i]=s[i]*.76;d[i+1]=s[i+1]*.76;d[i+2]=s[i+2]*.8}else if(tl&&!br){d[i]=s[i]+(255-s[i])*.2;d[i+1]=s[i+1]+(255-s[i+1])*.2;d[i+2]=s[i+2]+(255-s[i+2])*.2}}
    else if(al<128){let j=-1;if(A(a,b-1)>200)j=i-w*4;else if(A(a-1,b)>200)j=i-4;else if(A(a+1,b)>200)j=i+4;else if(A(a,b+1)>200)j=i+w*4;
      if(j>=0){d[i]=s[j]*.36;d[i+1]=s[j+1]*.36;d[i+2]=s[j+2]*.44;d[i+3]=255}else if(al<8)continue}
    if(a<x0)x0=a;if(a>x1)x1=a;if(b<y0)y0=b;if(b>y1)y1=b}
  x.putImageData(im,0,0);return x1<0?null:[x0,y0,x1-x0+1,y1-y0+1];
}
/* ---- personnages : sprite dessiné une fois par pose, puis mis en cache ---- */
const CHF=['skin','hair','style','shirt','pants','skirt','hat','hatType','vest','jacket','tie','lash','glasses','robe','coat','apron','overall','sash','scarf','bag','stetho','beard','bun','prop','umb','stripes','chair'],CHC=new Map();
function drawChar(c,x,y,dir,frame,p,run,fx){
  x=Math.round(x);y=Math.round(y);const ph=((frame|0)%4+4)%4;let k=dir+ph+(run?'r':'')+(fx&&fx.idle?'i':'')+(fx&&fx.blink?'b':'');for(let i=0;i<CHF.length;i++)k+='|'+(p[CHF[i]]||'');
  let s=CHC.get(k);
  if(!s){if(CHC.size>700)CHC.clear();const cv2=mkc(30,36),g=cv2.getContext('2d');drawChar0(g,7,12,dir,ph,p,run,fx);gbaFx(g,30,36);s=cv2;CHC.set(k,s)}
  c.fillStyle='rgba(20,40,30,.22)';c.fillRect(x+3,y+14,10,2);c.fillRect(x+4,y+16,8,1);c.fillRect(x+4,y+13,8,1);
  c.drawImage(s,x-7,y-12);
}
/* ---- objets : même traitement ; ceux qui ne bougent pas sont mis en cache ---- */
const OFX_ANIM={laundry:1,anemo:1,boat:1,boiler:1,borne:1,cat:1,coffret:1,conduit:1,duck:1,duvet:1,fountain:1,legend:1,machine:1,nitro:1,oldpc:1,painting:1,pc:1,rack:1,screenw:1,sheep:1,swing:1,tv:1,watermeter:1,bigpc:1,bigpc2:1,cbox:1},
  OFX_SKIP={npc:1,none:1,train:1,turbine:1,derive:1,rug:1,ablock:1,pv:1,gate:0,chalk:1,leafpile:1,escargot:1},OFC=new Map(),OFX_NOSNOW={gate:1,duck:1,boat:1,qsign:0,cow:1,mouton:1,patou:1,boules:1};let OFS=null;
function drawObj(c,o,ox,oy,t){
  if(o.draw||OFX_SKIP[o.kind]){drawObj0(c,o,ox,oy,t);return}
  const bx=(o.px!==undefined?Math.round(o.px):o.x*TS),by=(o.py!==undefined?Math.round(o.py):o.y*TS),W=112,H=88,OX=40,OY=44;
  if(c===ctx&&(bx-ox<-80||bx-ox>cv.width+48||by-oy<-56||by-oy>cv.height+56))return;   // hors de l'écran
  if(!OFS){OFS=mkc(W,H);OFS.g=OFS.getContext('2d',{willReadFrequently:true})}
  const anim=OFX_ANIM[o.kind];let e=null,key;
  if(!anim){key=o.kind+'|'+o.x+'|'+o.y+'|'+S.map+'|'+(S.inside||'')+'|'+S.site+'|'+S.ch+'|'+(o.col||'')+'|'+(o.n||'')+'|'+(o.w||'')+'|'+(o.did||'')+'|'+(S.map==='town'?SKY.lk+SEA.k+PREF.wear:'');e=OFC.get(key)}
  if(!e){const g=OFS.g;g.clearRect(0,0,W,H);drawObj0(g,o,bx-OX,by-OY,t);if(!anim&&SKY.snowG&&S.map==='town'&&!OFX_NOSNOW[o.kind])snowCap(g,W,H,2);const bb=gbaFx(g,W,H);
    if(anim){if(bb)c.drawImage(OFS,bb[0],bb[1],bb[2],bb[3],bx-ox-OX+bb[0],by-oy-OY+bb[1],bb[2],bb[3]);return}
    if(OFC.size>1200)OFC.clear();
    if(!bb)e={c:null};else{const s=mkc(bb[2],bb[3]);s.getContext('2d').drawImage(OFS,bb[0],bb[1],bb[2],bb[3],0,0,bb[2],bb[3]);e={c:s,dx:bb[0]-OX,dy:bb[1]-OY}}OFC.set(key,e)}
  if(e.c)c.drawImage(e.c,bx-ox+e.dx,by-oy+e.dy);
}
