/* Wattlings · jeu/rendu/batiments.js
   Dessin des bâtiments : chacun a son architecture selon ce qu'il abrite. */

/* ---- bâtiments : chacun a son architecture (toit, vitrage, détails) selon ce qu'il abrite ---- */
const BSTY={arena1:{rt:'tile',nosign:1},arena2:{rt:'flat',nosign:1},arena3:{rt:'shed',nosign:1},arena4:{rt:'mansard',nosign:1},arena5:{rt:'gable',nosign:1},arena6:{rt:'flat',nosign:1},arena7:{rt:'tile',nosign:1},arena8:{rt:'mansard',nosign:1},
 
  office:{rt:'flat',sign:'EM',win:'strip'},ecole:{rt:'tile',sign:'ECOLE'},bureau:{rt:'flat',win:'glass',sign:'LE CARRE'},boulangerie:{rt:'gable',win:'shop',sign:'PAIN'},
  mairie:{rt:'mansard',sign:'MAIRIE'},gare:{rt:'tile',nosign:1},enedis:{rt:'flat',sign:'ENEDIS',band:'#2f6db5'},grdf:{rt:'flat',sign:'GRDF',band:'#f2c12e'},
  voltco:{rt:'flat',win:'shop',nosign:1},media:{rt:'shed',win:'glass',sign:'LIVRES'},cabinet:{rt:'gable'},pharma:{rt:'flat',win:'shop',band:'#2fbf5e'},maison:{rt:'gable',nosign:1,door:'#2f6db5'},villa:{rt:'flat',win:'bay',nosign:1}
};
function txt35(c,str,x,y,col,s){s=s||1;let k=0;for(const ch of str){if(ch!==' ')px35(c,ch,x+k,y,col,s);k+=(ch===' '?2:4)*s}return k-s}
const txt35w=(str,s)=>{let k=0;for(const ch of str)k+=(ch===' '?2:4)*(s||1);return k-(s||1)};
function drawBuilding(c,b){
  const X=b.x*TS,Y=b.y*TS,W=b.w*TS,H=b.h*TS,rr=Math.ceil(b.h*.45),rh=rr*TS,WY=Y+rh,S=regStyle(b),st=S.st,dx=b.door[0]*TS,dy=(b.y+b.h-1)*TS,dk='rgba(0,0,0,.18)',wall=S.wc;
  // murs et toit : le matériau vient de la région, la silhouette du bâtiment
  regWall(c,S,b,X,WY,W,H-rh);if(st.band)R(c,X+1,WY+3,W-2,3,st.band);
  const rt=S.geo;if(S.mat)regRoof(c,S,b,X,Y,W,rh);else artRoof(c,X,Y,W,rh,b.roof,rt);
  if(S.k==='nord'&&b.id!=='voltco')regStepGable(c,b,X,Y,W,rh,WY);
  if(rt==='shed')for(let k=0;k<Math.floor(W/24);k++){const sx=X+8+k*24;R(c,sx-1,Y+4,14,rh-11,tint(b.roof,-.4));R(c,sx,Y+5,12,rh-13,'#a6d4f0');R(c,sx,Y+5,12,2,'#e9f8fe');R(c,sx+5,Y+5,1,rh-13,'#6f9fbf');R(c,sx+1,Y+rh-10,10,1,'#74aedb')}
  // vitrages
  b.wins=[];const wn=(x,y,w,h,plain)=>{const v=thash(x*3+7,y*5+b.w);if(plain||!WEAR||v>=.035*WEAR)b.wins.push([x+2,y+2,w-4,h-4,v]);plain?artWin(c,x+1,y+1,w-2,h-2,wall):artWinV(c,x+1,y+1,w-2,h-2,wall,v);if(!plain)regShutters(c,S,x+1,y+1,w-2,h-2)};
  if(st.win==='glass'){R(c,X+2,WY+2,W-4,H-rh-6,'#6fa9cf');for(let k=2;k<W-2;k+=8)R(c,X+k,WY+2,1,H-rh-6,'#3f6f8f');for(let k=WY+2;k<Y+H-4;k+=10){R(c,X+2,k,W-4,1,'#3f6f8f');R(c,X+4+((k*7)%(W-20)),k+2,10,2,'rgba(255,255,255,.35)')}}
  else if(st.win==='strip'){for(let ty=b.y+rr;ty<b.y+b.h;ty++){R(c,X+3,ty*TS+4,W-6,7,'#4a5566');R(c,X+4,ty*TS+5,W-8,5,'#8ec9e8');for(let k=X+11;k<X+W-6;k+=8)R(c,k,ty*TS+5,1,5,'#4a5566')}}
  else for(let tx=b.x;tx<b.x+b.w;tx++){if(tx===b.door[0])continue;for(let ty=b.y+rr;ty<b.y+b.h;ty++){const bot=ty===b.y+b.h-1;
    if(st.win==='shop'&&bot){wn(tx*TS+(tx===b.x?3:0),ty*TS+2,tx===b.x||tx===b.x+b.w-1?13:16,11,1);continue}
    if(st.win==='bay'){wn(tx*TS+(tx===b.x?2:0),ty*TS+3,tx===b.x||tx===b.x+b.w-1?14:16,11,1);continue}
    if(bot&&b.h>5&&(tx%2))continue;wn(tx*TS+3,ty*TS+3,10,8)}}
  // porte
  artDoor(c,dx,dy,S.door||st.door||'#7a5230',wall);
  const tiles=S.mat==='slate'||S.mat==='lauze'||S.mat==='canal'||S.mat==='beaver'||!S.mat;
  wearBuilding(c,b,{X,Y,W,H,rh,WY,dx,dy,rt:S.flat?'flat':tiles&&rt!=='shed'?'tile':'shed',st,roof:S.rc,wall});if(SEA.snow)snowRoof(c,b,X,Y,W,rh,S.flat?'flat':rt==='hip'?'gable':rt,S.rc);
  // détails propres à chaque bâtiment
  const P=BPAINT[b.id];if(P)P(c,{X,Y,W,H,rh,WY,dx,dy,b});
  // enseigne : un nom, ou un pictogramme
  if(st.sign){const w=txt35w(st.sign),sx=Math.round(dx+8-w/2),sy=WY-8;R(c,sx-3,sy-2,w+6,9,'#1c2440');txt35(c,st.sign,sx,sy,'#f7f0dc')}
  else if(!st.nosign){const sy=WY+1;R(c,dx-4,sy-11,24,9,'#1c2440');const iy=sy-9,ix=dx+2;
    if(b.id==='cabinet'){R(c,ix+3,iy,6,5,'#f7f0dc');R(c,ix+5,iy+1,2,3,'#c43d3d');R(c,ix+4,iy+2,4,1,'#c43d3d')}
    if(b.id==='pharma'){R(c,ix+5,iy,2,5,'#2fbf5e');R(c,ix+3,iy+2,6,1,'#2fbf5e')}}
  if(b.id===S.site){R(c,X+W-10,Y-6,2,10,'#1c2440');R(c,X+W-8,Y-6,7,5,'#f2a33a')}
}
const BPAINT={
  office:(c,{X,Y,W,rh,WY})=>{R(c,X+5,Y+7,22,rh-14,'#27457a');for(let k=0;k<3;k++)R(c,X+5+k*8,Y+7,1,rh-14,'#8fb0e0');R(c,X+5,Y+7+((rh-14)>>1),22,1,'#8fb0e0');
    c.fillStyle='#e8eef5';c.beginPath();c.arc(X+W-14,Y+14,6,0,7);c.fill();c.fillStyle='#b9bec6';c.beginPath();c.arc(X+W-13,Y+15,3,0,7);c.fill();R(c,X+W-15,Y+19,2,6,'#59627c');R(c,X,WY+12,W,2,'#2aa198')},
  ecole:(c,{X,Y,W,rh,WY,dx})=>{const cx=dx+8;R(c,cx-8,Y-9,16,14,'#f0e0c8');for(let i=0;i<7;i++)R(c,cx-9+i,Y-16+i,18-2*i,1,'#a8432f');R(c,cx-3,Y-6,6,6,'#3b3240');R(c,cx-2,Y-4,4,4,'#f2c12e');R(c,cx-1,Y,2,1,'#8a6a1a');
    c.fillStyle='#f7f0dc';c.beginPath();c.arc(cx,WY-22,5,0,7);c.fill();c.strokeStyle='#1c2440';c.lineWidth=1;c.stroke();R(c,cx,WY-25,1,4,'#1c2440');R(c,cx,WY-22,3,1,'#1c2440');
    for(let k=0;k<W;k+=6)R(c,X+k,WY+11,3,2,['#e2573b','#f2c12e','#2f9e7a','#4a78c9'][(k/6)%4])},
  bureau:(c,{X,Y,W,rh,WY,dx,dy})=>{[[8,6],[W-30,8]].forEach(([a,b])=>{R(c,X+a,Y+b,20,12,'#d9dde3');R(c,X+a,Y+b+10,20,2,'#8e949d');c.fillStyle='#59627c';c.beginPath();c.arc(X+a+6,Y+b+5,4,0,7);c.arc(X+a+15,Y+b+5,4,0,7);c.fill()});
    R(c,dx-6,dy-3,28,4,'#2f5f73');R(c,dx-6,dy+1,2,15,'#2f5f73');R(c,dx+20,dy+1,2,15,'#2f5f73');R(c,dx+2,dy+1,12,15,'#9ad0e8');R(c,dx+7,dy+1,2,15,'#3f6f8f')},
  boulangerie:(c,{X,Y,W,rh,WY,dx,dy})=>{R(c,X+W-20,Y-7,9,16,'#9a5a3a');R(c,X+W-21,Y-9,11,3,'#6b3d26');
    for(let k=0;k<W-4;k+=4)R(c,X+2+k,WY+12,4,6,(k/4)%2?'#f7f0dc':'#c43d3d');R(c,X+2,WY+18,W-4,1,'rgba(0,0,0,.25)');
    for(let tx=X;tx<X+W;tx+=TS){if(tx===dx)continue;R(c,tx+3,dy+8,5,3,'#d9a55a');R(c,tx+9,dy+7,4,4,'#c98a3a');R(c,tx+4,dy+9,3,1,'#f3d9a0')}},
  mairie:(c,{X,Y,W,H,rh,WY,dx,dy})=>{const cx=dx+8;for(let k=0;k<3;k++){const a=X+10+k*((W-32)/2);R(c,a,Y+8,10,10,'#efe6d2');R(c,a+2,Y+10,6,7,'#8ec9e8');R(c,a-1,Y+6,12,3,'#3d3254')}
    for(let i=0;i<12;i++)R(c,cx-24+i*2,WY-2-i,48-i*4,1,'#efe6d2');R(c,cx-25,WY-2,50,3,'#d9cfb8');c.fillStyle='#fff';c.beginPath();c.arc(cx,WY-8,4,0,7);c.fill();R(c,cx,WY-11,1,3,'#1c2440');R(c,cx,WY-8,2,1,'#1c2440');
    R(c,dx-4,Y+H-3,24,3,'#d9d2c0');R(c,dx-7,Y+H-1,30,2,'#c6beaa')},
  enedis:(c,{X,Y,W,H,rh,WY,dx,dy})=>{R(c,X+3,dy+1,26,15,'#8a93a3');for(let k=0;k<5;k++)R(c,X+3,dy+2+k*3,26,1,'#6d7480');R(c,X+W-22,Y+6,3,rh-8,'#59627c');R(c,X+W-27,Y+6,13,2,'#59627c');R(c,X+W-27,Y+11,13,2,'#59627c');
    const bx=X+W-14,by=WY+7;R(c,bx,by,5,3,'#f2c12e');R(c,bx-2,by+3,5,2,'#f2c12e');R(c,bx,by+5,3,3,'#f2c12e')},
  grdf:(c,{X,Y,W,H,rh,WY,dx,dy})=>{R(c,X+2,WY+9,W-4,2,'#e8d24a');R(c,X+4,WY+9,2,H-rh-12,'#e8d24a');R(c,X+W-7,WY+9,2,H-rh-12,'#e8d24a');R(c,X+2,WY+7,4,6,'#c43d3d');
    [[8,6],[20,9]].forEach(([a,b])=>{R(c,X+a,Y+b,7,rh-b-6,'#9aa0a8');R(c,X+a-1,Y+b-2,9,3,'#6d7480')});
    const fx=X+W-18,fy=Y+8;R(c,fx-3,fy-2,13,14,'#1c2440');R(c,fx-2,fy-1,11,12,'#27325a');R(c,fx,fy+3,7,7,'#e2573b');R(c,fx+1,fy,4,5,'#e2573b');R(c,fx+2,fy+5,3,4,'#f2c12e')},
  voltco:(c,{X,Y,W,rh,WY,dx,dy})=>{const w=txt35w('VOLT CO',2),bx=Math.round(X+W/2-w/2)-5;R(c,bx,Y-9,w+10,17,'#1c2440');R(c,bx+1,Y-8,w+8,15,'#fff');R(c,bx+1,Y-8,w+8,2,'#c43d3d');R(c,bx+1,Y+5,w+8,2,'#c43d3d');txt35(c,'VOLT CO',bx+5,Y-4,'#c43d3d',2);
    R(c,bx+6,Y+8,2,6,'#59627c');R(c,bx+w+2,Y+8,2,6,'#59627c');
    for(let tx=X;tx<X+W;tx+=TS){if(tx===dx)continue;R(c,tx+4,dy+5,7,5,'#f2c12e');R(c,tx+5,dy+7,5,1,'#c43d3d')}},
  media:(c,{X,Y,W,H,rh,WY,dx,dy})=>{for(let k=6;k<W-6;k+=3){if(k>dx-X-2&&k<dx-X+16)continue;R(c,X+k,Y+H-14,2,9,['#c0503a','#2aa198','#f2a33a','#4a78c9','#8a3b8f'][(k/3)%5])}R(c,X+4,Y+H-5,W-8,1,'#3f6f8f')},
  cabinet:(c,{X,Y,W,H,rh,WY})=>{for(let tx=X;tx<X+W;tx+=TS){R(c,tx+3,WY+12,10,3,'#8a5f36');R(c,tx+4,WY+10,2,2,'#e2573b');R(c,tx+8,WY+10,2,2,'#f7e36b');R(c,tx+6,WY+11,2,1,'#3f8a3a')}},
  pharma:(c,{X,Y,W,H,rh,WY,dx,dy})=>{for(let tx=X;tx<X+W;tx+=TS){if(tx===dx)continue;for(let k=0;k<3;k++)R(c,tx+4+k*4,dy+6,2,4,['#2fbf5e','#f7f0dc','#4a78c9'][k])}R(c,X+W-12,Y+3,10,12,'#1c2440')},
  maison:(c,{X,Y,W,H,rh,WY,dx,dy})=>{R(c,X+10,Y-8,8,15,'#8a4a32');R(c,X+9,Y-10,10,3,'#5d3020');c.fillStyle='#f3e2c4';c.beginPath();c.arc(X+W/2,Y+rh-9,5,0,7);c.fill();c.fillStyle='#8ec9e8';c.beginPath();c.arc(X+W/2,Y+rh-9,3,0,7);c.fill();
    for(let tx=X;tx<X+W;tx+=TS){if(tx===dx)continue;R(c,tx+1,WY+3+(tx===X?2:0),2,8,'#2f6d34');R(c,tx+13,WY+3,2,8,'#2f6d34');R(c,tx+3,WY+11,10,2,'#8a5f36');R(c,tx+4,WY+10,2,1,'#e2573b');R(c,tx+8,WY+10,2,1,'#e57399')}
    },
  villa:(c,{X,Y,W,H,rh,WY,dx,dy})=>{c.fillStyle='#e2573b';c.beginPath();c.arc(X+20,Y+14,9,0,7);c.fill();c.fillStyle='#f7f0dc';for(let k=0;k<4;k++){c.beginPath();c.moveTo(X+20,Y+14);c.arc(X+20,Y+14,9,k*1.571,k*1.571+.785);c.fill()}R(c,X+19,Y+13,2,2,'#59627c');
    R(c,X+W-30,Y+9,18,6,'#56c4e8');R(c,X+W-30,Y+9,5,6,'#f7f0dc');R(c,X+W-30,Y+15,2,3,'#8a5f36');R(c,X+W-14,Y+15,2,3,'#8a5f36');
    R(c,X,WY+2,W,2,'#c9a26e');for(let k=0;k<W;k+=3)R(c,X+k,Y+H-8,2,5,'#b98d57')}
};
