/* Wattlings · jeu/rendu/regions-vie.js
   Ce qui bouge dans les régions : moulin, cigogne, goélands, marmottes, cloches. */

/* ---- ce qui bouge : ailes du moulin, cigogne, goélands, marmottes, cloches du beffroi ---- */
const RGX={hour:-1,marm:[[34,8],[24,17],[41,10]]};
function regLifeOver(c,ox,oy,t){
  const vw=cv.width,vh=cv.height,on=(x,y,m)=>x*TS-ox>-m&&x*TS-ox<vw+m&&y*TS-oy>-m&&y*TS-oy<vh+m;
  // moulin : quatre ailes entraînées par le vent
  {const [mx,my]=REG_SPOT.moulin;if(on(mx,my,60)){const hx=mx*TS-ox+8,hy=my*TS-oy-13,a0=SKR.turb*.8;c.lineCap='butt';
    for(let i=0;i<4;i++){const a=a0+i*Math.PI/2,ca=Math.cos(a),sa=Math.sin(a),ex=hx+ca*18,ey=hy+sa*18;c.strokeStyle='#553920';c.lineWidth=1;c.beginPath();c.moveTo(hx,hy);c.lineTo(ex,ey);c.stroke();
      c.strokeStyle='rgba(244,240,228,.92)';c.lineWidth=4;c.beginPath();c.moveTo(hx+ca*6-sa*2,hy+sa*6+ca*2);c.lineTo(ex-sa*2,ey+ca*2);c.stroke();c.strokeStyle='#8a6538';c.lineWidth=1;for(let k=8;k<18;k+=3){c.beginPath();c.moveTo(hx+ca*k,hy+sa*k);c.lineTo(hx+ca*k-sa*4,hy+sa*k+ca*4);c.stroke()}}
    R(c,hx-1,hy-1,3,3,'#3f2a14')}}
  // cigogne sur le toit de la médiathèque (elle migre l'hiver)
  {const b=BLD.find(q=>q.id==='media');if(b&&on(b.x+3,b.y,80)){const X=(b.x+b.w)*TS-ox-26,Y=b.y*TS-oy-6;R(c,X-2,Y+3,14,3,'#6b4a2b');R(c,X-3,Y+2,16,1,'#8a6538');for(let k=0;k<6;k++)R(c,X-3+k*3,Y+1+(k%2),2,1,'#553920');
    if(SEA.se!==3){const sl=SKY.dark>.4,cl=!sl&&(t>>3)%60<6;if(sl){R(c,X+2,Y-3,8,5,'#f7f4ec');R(c,X+7,Y-3,3,4,'#1c1c24');R(c,X+1,Y-4,3,3,'#f7f4ec')}
      else{R(c,X+5,Y-4,1,6,'#e2573b');R(c,X+7,Y-4,1,6,'#e2573b');R(c,X+2,Y-10,8,6,'#f7f4ec');R(c,X+7,Y-9,4,4,'#1c1c24');R(c,X+2,Y-15,2,6,'#f7f4ec');R(c,X+1,Y-17,3,3,'#f7f4ec');R(c,X-3,Y-16+(cl?1:0),4,1,'#e2573b');if(cl)R(c,X-3,Y-17,4,1,'#e2573b');R(c,X+2,Y-16,1,1,'#222')}}}}
  // abeilles autour des ruches
  if(SEA.se!==3&&SKY.dark<.3&&!skWet()&&on(17,15,60))for(let i=0;i<7;i++){const a=(16.5+(i%3)*.9)*TS-ox+Math.round(Math.sin(t/7+i*2)*9),b=15*TS-oy+2+Math.round(Math.cos(t/9+i*3)*7)+(i%3===2?14:0);R(c,a,b,1,1,'#f2c12e');R(c,a+1,b,1,1,'#222')}
  // goélands au-dessus de l'Anse
  if(SKY.dark<.4&&!SKY.storm)for(let i=0;i<3;i++){const a=t/(70+i*13)+i*2.1,gx=(9+i*3)*TS+Math.cos(a)*(46+i*12),gy=(50+i*5)*TS+Math.sin(a*1.3)*(30+i*6),X=Math.round(gx-ox),Y=Math.round(gy-oy);if(X<-20||X>vw+20||Y<-20||Y>vh+20)continue;
    const fl=((t>>3)+i)%4<2;c.fillStyle='rgba(20,40,30,.12)';c.fillRect(X-3,Y+18,7,2);R(c,X-1,Y,3,2,'#f7f4ec');R(c,X-5,Y-(fl?2:0),4,1,'#f7f4ec');R(c,X+2,Y-(fl?2:0),4,1,'#f7f4ec');R(c,X-6,Y-(fl?1:-1),1,1,'#3a3a44');R(c,X+6,Y-(fl?1:-1),1,1,'#3a3a44');R(c,X+(Math.cos(a)>0?-2:2),Y,1,1,'#f2a33a')}
}
function regLifeEnts(ents,ox,oy,t){
  // marmottes : dressées sur leurs pattes, elles sifflent et plongent dans le terrier quand tu approches (elles hibernent l'hiver)
  if(SEA.se===3||SKY.dark>.4||skWet())return;
  RGX.marm.forEach(([x,y],i)=>{const g=MAPS.town.g[y][x];if(g!=='.'&&g!=='*')return;const X=x*TS-ox,Y=y*TS-oy;if(X<-20||X>cv.width+20||Y<-20||Y>cv.height+20)return;const near=Math.abs(P.x-x)+Math.abs(P.y-y)<=3,up=!near&&((t>>4)+i*7)%9<6;
    ents.push({y:y*TS-2,f:()=>{c0(X+4,Y+11,8,3,'#5a4630');c0(X+5,Y+12,6,2,'#2a1c10');if(near)return;const b=up?0:3;c0(X+6,Y+3+b,5,9-b,'#9a7a4a');c0(X+7,Y+5+b,3,6-b,'#d9c08a');c0(X+6,Y+1+b,5,3,'#8a6a3e');c0(X+6,Y+2+b,1,1,'#222');c0(X+10,Y+2+b,1,1,'#222');c0(X+8,Y+3+b,1,1,'#3a2a1a');c0(X+6,Y+b,1,1,'#6b4a2b');c0(X+10,Y+b,1,1,'#6b4a2b')}})});
}
const c0=(x,y,w,h,col)=>R(ctx,x,y,w,h,col);
/* le beffroi sonne les heures (heure réelle seulement) */
function regTick(){
  // en changeant de quartier, son nom et sa région s'affichent un instant
  if(S.map==='town'&&!P.moving&&!busy&&!dlg.open){const z=ZONE[P.y]?ZONE[P.y][P.x]:-1,n=performance.now();if(z>=0&&z!==RGX.zone){const first=RGX.zone===undefined;RGX.zone=z;if(!first&&n-(RGX.zt||0)>6000){RGX.zt=n;toast(QUARTERS[z].name+' · '+QUARTERS[z].reg)}}}
  const h=Math.floor(SKY.clock);if(RGX.hour<0){RGX.hour=h;return}if(h===RGX.hour)return;RGX.hour=h;
  if(PREF.hour!=='auto'||S.ch===7||S.map!=='town'||S.ch<3||busy||dlg.open)return;const n=h%12||12;toast(`Le beffroi sonne ${n} heure${n>1?'s':''}.`);
  try{const a=AUD.ctx;if(a&&AUD.on)for(let i=0;i<Math.min(n,4);i++){tone('tri',392,a.currentTime+.1+i*.7,.6,.16);tone('tri',196,a.currentTime+.1+i*.7,.9,.1)}}catch(e){}
}
/* le faisceau du phare, dans la carte de lumière (appelé par skyOver quand il fait nuit) */
function regLight(g,ox,oy,t,f){
  const [px,py]=REG_SPOT.phare,X=px*TS-ox+8,Y=py*TS-oy-40;if(X<-260||X>cv.width+260||Y<-260||Y>cv.height+260)return;
  const a=t/55,L=230,w=.2;g.globalAlpha=.34*f;g.fillStyle='rgb(255,244,200)';g.beginPath();g.moveTo(X,Y);g.lineTo(X+Math.cos(a-w)*L,Y+Math.sin(a-w)*L*.8);g.lineTo(X+Math.cos(a+w)*L,Y+Math.sin(a+w)*L*.8);g.closePath();g.fill();
  g.globalAlpha=.9*f;g.drawImage(SKR.g2,X-20,Y-20);g.globalAlpha=1;
}
/* la nuit : la lanterne du phare et le cadran du beffroi restent bien visibles (dessinés après l'assombrissement) */
function regNight(c,ox,oy,f){
  const [px,py]=REG_SPOT.phare,[bx,by]=REG_SPOT.beffroi;let X=px*TS-ox,Y=py*TS-oy;
  if(X>-20&&X<cv.width+20&&Y>-20&&Y<cv.height+60){c.fillStyle=`rgba(255,244,190,${(.95*f).toFixed(2)})`;c.fillRect(X+6,Y-43,4,7)}
  X=bx*TS-ox;Y=by*TS-oy;if(X>-20&&X<cv.width+20&&Y>-20&&Y<cv.height+60){c.fillStyle=`rgba(255,240,190,${(.9*f).toFixed(2)})`;c.beginPath();c.arc(X+8,Y-22.5,3.6,0,7);c.fill();c.fillStyle='#1c2440';c.fillRect(X+8,Y-25,1,3);c.fillRect(X+8,Y-23,2,1)}
}
/* ombres des monuments (appelé par skyUnder, s = calque d'ombres) */
function regShadow(s,o,ox,oy,sh){
  const X=o.x*TS-ox,Y=o.y*TS-oy,k=o.kind;
  if(k==='beffroi'||k==='phare'||k==='moulin'){s.lineWidth=k==='moulin'?10:8;s.lineCap='butt';s.beginPath();s.moveTo(X+8,Y+14);s.lineTo(X+8+sh.x*(k==='moulin'?30:46),Y+14+sh.y*(k==='moulin'?30:46));s.stroke();s.lineCap='round';return true}
  if(k==='puy'||k==='terril'){skHull(s,X+4,Y+8,40,7,sh.x*18,sh.y*18);return true}
  if(k==='chaumiere'||k==='bergerie'||k==='buron'){skHull(s,X,Y+6,32,9,sh.x*(k==='buron'?12:22),sh.y*(k==='buron'?12:22));return true}
  if(k==='boules'||k==='escargot')return true;
  return false;
}
