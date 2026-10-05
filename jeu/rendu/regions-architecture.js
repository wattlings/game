/* Wattlings · jeu/rendu/regions-architecture.js
   Architecture régionale : murs, toits, pignons, volets. */

/* ================= ARCHITECTURE : les murs et les toits du pays ================= */
/* wall : matériau des murs · roof : matériau du toit · geo : forme du toit · shut : volets · door : porte */
const REG_STY={
  loire:{wall:'tuffeau',roof:'slate',wc:'#f1ebd9',rc:'#4d5a70',shut:'#9fb0c0',door:'#5f7a8a'},
  auvergne:{wall:'lava',roof:'lauze',wc:'#5a5a64',rc:'#7d7a72',shut:'#8a2f2a',door:'#7a2f2a'},
  nord:{wall:'brick',roof:'flat',wc:'#a4472f',rc:'#6d7480',door:'#2f4a3a'},
  normandie:{wall:'colomb',roof:'thatch',geo:'hip',wc:'#efe2c4',rc:'#c2a25a',door:'#5f4126'},
  alsace:{wall:'colombA',roof:'beaver',geo:'gable',wc:'#f0d27a',rc:'#9a4a34',shut:'#3f6d45',door:'#3f5f3a',box:1},
  bourgogne:{wall:'rubble',roof:'glazed',wc:'#e2d2a8',rc:'#a8432f',shut:'#7f9a86',door:'#6b3a2a'},
  bretagne:{wall:'granite',roof:'slate',wc:'#a9a59c',rc:'#3f4a5c',shut:'#2f5f9a',door:'#2f5f9a'},
  provence:{wall:'ocre',roof:'canal',wc:'#e6bc84',rc:'#d98a55',shut:'#7f8fd0',door:'#6f8a5a'},
  savoie:{wall:'chalet',roof:'shingle',geo:'gable',ov:4,wc:'#7a5230',rc:'#8a7256',shut:'#2f5f3a',door:'#4a3524',box:1}};
/* ce qui garde sa forme d'origine : terrasses techniques, verrières, toits que l'on a peints (parasol, panneaux solaires…) */
const REG_KEEP={office:1,bureau:1,enedis:1,grdf:1,voltco:1,villa:1,boulangerie:1,arena2:1};
const REG_OVR={media:{win:undefined,rt:'gable'},pharma:{rt:'gable'},arena6:{rt:'tile'},arena3:{rt:'tile'}};
function regStyle(b){
  const k=bldReg(b),RS=REG_STY[k],st0=BSTY[b.id]||{},ov=REG_OVR[b.id]||{},st=Object.assign({},st0,ov),keep=REG_KEEP[b.id],h=thash(b.x*7+3,b.y*13+b.w);
  let rt=st.rt||'tile';const flat=rt==='flat',mat=flat||keep?null:RS.roof==='flat'?null:RS.roof,geo=mat?(rt==='mansard'?'mansard':RS.geo||(rt==='gable'?'gable':'tile')):rt;
  const wc=k==='alsace'?ALS_COL[(h*5)|0]:k==='provence'?OCRES[(h*4)|0]:k==='loire'?hexMix(RS.wc,b.wall,.22):RS.wc;
  return {k,RS,st,mat,geo,flat,wc,rc:mat?RS.rc:b.roof,ov:mat&&RS.ov||0,door:st0.door||(b.arena?null:RS.door)};
}
/* ---- murs ---- */
function regWall(c,S,b,X,WY,W,h){
  const k=S.RS.wall,col=S.wc,x0=X+1,x1=X+W-1,y0=WY+3,y1=WY+h-3,s=(a,i)=>wh(b.x*31+a,b.y*17+i,400);
  artWall(c,X,WY,W,h,col);
  if(k==='brick'){for(let y=y0,r=0;y<y1;y+=3,r++){R(c,x0,y+2,W-2,1,'#c9917a');for(let a=x0+((r%2)*3);a<x1;a+=6){R(c,a,y,1,2,'#c9917a');const v=s(a,r);if(v<.22)R(c,a+1,y,Math.min(5,x1-a-1),2,v<.1?'#8a3a26':'#bb5a40')}}
    R(c,X,WY,W,3,'#e6ddd0');R(c,X,WY+2,W,1,'#b9ad9c');return}
  if(k==='colomb'){const T='#5f4126',T2='#7a5a38';for(let a=x0+3;a<x1-1;a+=5)R(c,a,y0,2,y1-y0,T);R(c,x0,y0,W-2,2,T);R(c,x0,y1-2,W-2,2,T);const my=y0+((y1-y0)>>1);R(c,x0,my,W-2,2,T);
    for(let i=0;i<7;i++){R(c,x0+2+i,y1-3-i*2,2,2,T);R(c,x1-4-i,y1-3-i*2,2,2,T)}R(c,x0,y0,W-2,1,T2);return}
  if(k==='colombA'){const T='#3a281c';for(let a=X;a<=X+W-2;a+=8)R(c,a===X?x0:a,y0,2,y1-y0,T);for(let y=WY+((16-((WY-b.y*16)%16))%16);y<y1;y+=16)R(c,x0,y-1,W-2,2,T);R(c,x0,y0,W-2,2,T);R(c,x0,y1-2,W-2,2,T);
    for(let a=X;a<X+W-8;a+=16){const cy=y1-6;for(let i=0;i<4;i++){R(c,a+2+i,cy+i,2,1,T);R(c,a+6-i,cy+i,2,1,T)}}
    for(let i=0;i<8;i++){R(c,x0+1+i,y0+2+i,2,1,T);R(c,x1-3-i,y0+2+i,2,1,T)}return}
  if(k==='granite'||k==='lava'||k==='tuffeau'){const lava=k==='lava',tuf=k==='tuffeau',J=lava?'#7e7e88':tuf?'#ddd4bc':'#8a867c',bh=lava?4:5,bw=lava?7:tuf?11:9;
    for(let y=y0,r=0;y<y1;y+=bh,r++){R(c,x0,y+bh-1,W-2,1,J);for(let a=x0+((r%2)*(bw>>1));a<x1;a+=bw){R(c,a,y,1,bh-1,J);const v=s(a,r);if(v<.3)R(c,a+1,y,Math.min(bw-1,x1-a-1),bh-1,tint(col,v<.12?-.12:(lava?.12:.07)))}}
    if(!tuf)for(let i=0;i<W*h/26;i++){const a=x0+((s(i,91)*(W-3))|0),y=y0+((s(i,92)*(y1-y0-1))|0);R(c,a,y,1,1,tint(col,s(i,93)<.5?-.22:.25))}
    for(let y=y0,r=0;y<y1-3;y+=bh,r++){const w=r%2?5:3,q=tint(col,lava?.2:tuf?-.06:.16);R(c,x0,y,w,bh-1,q);R(c,x1-w,y,w,bh-1,q)}   // chaînes d'angle
    if(tuf&&s(1,7)<.6){const a=x0+4+((s(2,7)*(W-14))|0);R(c,a,y0+2,3,6,'rgba(190,170,110,.25)')}return}
  if(k==='ocre'){for(let i=0;i<6;i++){const a=x0+((s(i,95)*(W-12))|0),y=y0+((s(i,96)*(y1-y0-5))|0),w=4+((s(i,97)*7)|0);R(c,a,y,w,3,tint(col,i%2?.12:-.07));R(c,a+1,y+3,w-2,1,tint(col,i%2?.12:-.07))}
    R(c,x0,y1-5,W-2,5,tint(col,-.08));R(c,x0,y0,W-2,1,'#f6ecd8');return}
  if(k==='rubble'){for(let i=0;i<W*h/14;i++){const a=x0+((s(i,98)*(W-8))|0),y=y0+((s(i,99)*(y1-y0-2))|0),w=3+((s(i,100)*4)|0),v=s(i,101);R(c,a,y,w,2,tint(col,v<.4?-.1:v<.75?.1:-.2));R(c,a,y,w,1,tint(col,v<.4?-.04:.18))}
    for(let y=y0,r=0;y<y1-3;y+=5,r++){const w=r%2?5:3;R(c,x0,y,w,4,'#f0e6c8');R(c,x1-w,y,w,4,'#f0e6c8');R(c,x0,y+4,w,1,'#c9b888');R(c,x1-w,y+4,w,1,'#c9b888')}return}
  if(k==='chalet'){const jy=WY+Math.round(h*.52),P1='#7a5230',P2='#5f3f24',P3='#946a42';
    R(c,x0,y0,W-2,jy-y0,P1);for(let y=y0+2;y<jy;y+=3){R(c,x0,y,W-2,1,P2);R(c,x0,y-1,W-2,1,P3)}for(let a=x0+9;a<x1;a+=13)R(c,a,y0,1,jy-y0,P2);
    R(c,x0,jy,W-2,y1-jy,'#a8a395');for(let y=jy,r=0;y<y1;y+=4,r++){R(c,x0,y+3,W-2,1,'#7d786b');for(let a=x0+((r%2)*4);a<x1;a+=8){R(c,a,y,1,3,'#7d786b');if(s(a,r)<.3)R(c,a+1,y,Math.min(6,x1-a-1),3,'#bdb8a8')}}
    R(c,X-2,jy-2,W+4,2,'#4a3524');R(c,X-2,jy-2,W+4,1,'#6b4a2b');for(let a=X-1;a<X+W+1;a+=3)R(c,a,jy-6,1,4,'#6b4a2b');R(c,X-2,jy-7,W+4,1,'#8a6538');return}
}
/* ---- toits ---- */
function regRoof(c,S,b,X,Y,W,rh){
  const k=S.mat,geo=S.geo,col=S.rc,ov=2+S.ov,O=tint(col,-.55),s=(a,i)=>wh(b.x*13+a,b.y*29+i,420);
  const row=i=>{const a=geo==='gable'?Math.max(0,8-i):geo==='mansard'&&i<4?4:geo==='hip'?Math.max(0,Math.round((9-i)*.8)):0;return [X-ov+a,W+2*ov-2*a]};
  for(let i=0;i<rh;i++){const [x0,w]=row(i),dp=i/rh;
    if(i===0){R(c,x0,Y,w,1,O);continue}
    if(k==='slate'){const r=i%3;R(c,x0,Y+i,w,1,r===0?tint(col,-.28):tint(col,.14-dp*.2));if(r!==0)for(let a=((i/3|0)%2)*2+1;a<w-1;a+=4)R(c,x0+a,Y+i,1,1,tint(col,-.2));if(r===1)for(let a=0;a<w;a+=11)if(s(a,i)<.25)R(c,x0+a,Y+i,3,2,tint(col,.2))}
    else if(k==='lauze'){const r=i%5,rw=(i/5)|0;R(c,x0,Y+i,w,1,r===0?tint(col,-.36):tint(col,.1-dp*.18));if(r!==0){let a=(s(rw,1)*5)|0;while(a<w-1){R(c,x0+a,Y+i,1,1,tint(col,-.3));if(r===1&&s(a,rw)<.35)R(c,x0+a+1,Y+i,3,3,tint(col,s(a,rw)<.15?.2:-.1));a+=5+((s(a,rw+50)*5)|0)}}
      if(r===2&&s(i,3)<.5)R(c,x0+3+((s(i,4)*(w-8))|0),Y+i,2,1,'#b9a94a')}
    else if(k==='thatch'){R(c,x0,Y+i,w,1,tint(col,.16-dp*.34));for(let a=0;a<w;a++){const v=s(a,7);if(v<.22)R(c,x0+a,Y+i,1,1,tint(col,-.2-dp*.2));else if(v>.82)R(c,x0+a,Y+i,1,1,tint(col,.3-dp*.2))}
      if(i<4){R(c,x0+1,Y+i,w-2,1,i===3?'#5f7030':'#7a8a3a');if(i===1&&SEA.se!==3)for(let a=4;a<w-4;a+=7)R(c,x0+a+((s(a,9)*3)|0),Y,1,2,s(a,10)<.5?'#8a6fe0':'#f2c12e')}
      if(i>=rh-4)R(c,x0,Y+i,w,1,tint(col,-.3-(i-rh+4)*.08))}
    else if(k==='beaver'){const r=i%3;R(c,x0,Y+i,w,1,r===2?tint(col,-.3):tint(col,.12-dp*.16));for(let a=((i/3|0)%2)*2;a<w;a+=4){if(r===2)R(c,x0+a+1,Y+i,2,1,tint(col,-.06));else R(c,x0+a,Y+i,1,1,tint(col,-.2))}}
    else if(k==='glazed'){const G=['#c9a227','#8a2a1a','#2f6d34','#1f1f24'];for(let a=0;a<w;a++){const u=Math.floor((a+i)/4),v=Math.floor((a-i+4000)/4),m=((u+v*3)%4+4)%4,e=(a+i)%4===0||(a-i+4000)%4===0;R(c,x0+a,Y+i,1,1,e?'#5a2416':tint(G[m],.1-dp*.2))}}
    else if(k==='canal'){const rw=(i/6)|0;R(c,x0,Y+i,w,1,tint(col,.08-dp*.14));for(let a=(rw%2)*2;a<w;a+=4){R(c,x0+a,Y+i,1,1,tint(col,-.22));if(a+1<w)R(c,x0+a+1,Y+i,1,1,tint(col,.24));const v=s(a,rw);if(v<.14&&a+3<w)R(c,x0+a+1,Y+i,3,1,v<.07?'#edc49c':'#c9764a')}if(i%6===0)R(c,x0,Y+i,w,1,tint(col,-.2))}
    else if(k==='shingle'){const r=i%4;R(c,x0,Y+i,w,1,r===0?tint(col,-.3):tint(col,.1-dp*.2));if(r!==0)for(let a=((i/4|0)%2)*3+1;a<w-1;a+=6)R(c,x0+a,Y+i,1,1,tint(col,-.24))}
    R(c,x0,Y+i,1,1,O);R(c,x0+w-1,Y+i,1,1,O);if(w>6&&k!=='glazed')R(c,x0+1,Y+i,1,1,tint(col,.28))}
  const [bx,bw]=row(rh-1);
  if(k==='shingle'){R(c,bx-1,Y+rh-4,bw+2,4,'#4a3524');R(c,bx-1,Y+rh-4,bw+2,1,'#7a5a38');R(c,bx-1,Y+rh-1,bw+2,1,'#2f2016');for(let i=0;i<6;i++){const a=X+6+((s(i,11)*(W-16))|0),y=Y+6+((s(i,12)*(rh-16))|0);R(c,a,y+1,5,3,'#8e8a80');R(c,a+1,y,3,1,'#b4b0a4');R(c,a,y+3,5,1,'#5f5b51')}}
  else if(k==='thatch'){for(let a=0;a<bw;a+=2)R(c,bx+a,Y+rh,1,1,tint(col,-.45));R(c,bx,Y+rh-1,bw,1,tint(col,-.5))}
  else if(k==='canal'){for(let j=0;j<3;j++)for(let a=(j%2)*2;a<bw;a+=4){R(c,bx+a,Y+rh-3+j,3,1,j===1?'#edc49c':'#c9764a');R(c,bx+a+3,Y+rh-3+j,1,1,'#8f4a2a')}}   // génoise
  else{R(c,bx-1,Y+rh-3,bw+2,1,tint(col,-.34));R(c,bx-1,Y+rh-2,bw+2,1,k==='slate'?'#9aa6b4':tint(col,-.04));R(c,bx-1,Y+rh-1,bw+2,1,O)}
  if(k==='beaver'&&W>=80)[.28,.72].forEach(f=>{const a=Math.round(X+W*f)-5,y=Y+rh-15;R(c,a,y+3,10,8,S.wc);R(c,a+2,y+5,6,5,'#74aedb');R(c,a+2,y+5,6,2,'#a6d4f0');for(let i=0;i<4;i++)R(c,a-1+i,y+3-i,12-2*i,1,tint(col,-.2));R(c,a-1,y+3,12,1,O)});   // lucarnes
  if(k==='slate'&&geo!=='mansard'&&S.k==='loire'){R(c,X+4,Y-2,2,3,'#9aa6b4');R(c,X+W-6,Y-2,2,3,'#9aa6b4')}   // épis de faîtage
}
/* ---- fronton à gradins (Nord) : un pignon de brique qui monte par marches au-dessus de la façade ---- */
function regStepGable(c,b,X,Y,W,rh,WY){
  const cx=X+(W>>1),n=4,sw=7,B='#a4472f',M='#c9917a',K='#e6ddd0';
  for(let k=0;k<n;k++){const w=Math.min(W-12,(n-k)*sw*2-2),y=WY-5-k*5;R(c,cx-(w>>1),y,w,6,B);for(let a=cx-(w>>1)+((k%2)*3);a<cx+(w>>1);a+=6)R(c,a,y,1,5,M);R(c,cx-(w>>1),y+2,w,1,M);R(c,cx-(w>>1)-1,y,w+2,1,K);R(c,cx-(w>>1)-1,y,1,6,'#5f2a1c');R(c,cx+(w>>1),y,1,6,'#5f2a1c')}
  c.fillStyle='#33475e';c.beginPath();c.arc(cx,WY-12,3,0,7);c.fill();R(c,cx-3,WY-12,7,1,K);R(c,cx,WY-15,1,7,K);
}
/* ---- volets et jardinières ---- */
function regShutters(c,S,x,y,w,h){
  const col=S.RS.shut;if(col){R(c,x-2,y,2,h,col);R(c,x+w,y,2,h,col);R(c,x-2,y,1,h,tint(col,.25));R(c,x+w+1,y,1,h,tint(col,-.3));R(c,x-2,y+(h>>1),2,1,tint(col,-.3));R(c,x+w,y+(h>>1),2,1,tint(col,-.3))}
  if(S.RS.box){R(c,x,y+h,w,2,'#6b4a2b');R(c,x,y+h,w,1,'#8a6538');if(SEA.se!==3&&!SEA.snow)for(let i=0;i<w;i+=2)R(c,x+i,y+h-1-(i%4?1:0),2,2,(i+x)%6<3?'#e2483b':(S.k==='savoie'?'#f7f0dc':'#e9679a'));else R(c,x+1,y+h-1,w-2,1,'#4f7a4a')}
}
