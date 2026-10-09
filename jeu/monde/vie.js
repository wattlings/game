/* Wattlings · jeu/monde/vie.js
   La vie de la ville : passants, oiseaux, chien, papillons, fumée, drapeaux, nuages. */

const lifeOn=who=>{const f=LIFE_WHEN[who];return !f||f()};
const lifeLine=(d,n)=>{const w=(LIFE_WX[d.who]||[]).find(([c])=>c());return w&&n%2===1?w[1]:d.lines[((w?n>>1:n-1)%d.lines.length+d.lines.length)%d.lines.length]};
const LIFE={ch:-1,solid:null,busy:false,w:[],birds:null,n:0};
function lifeInit(){
  LIFE.ch=S.ch;LIFE.busy=true;const sol=new Set();objsFor('town').forEach(o=>{if(o.solid)sol.add(o.x+','+o.y)});LIFE.busy=false;
  TOWN_GATES.forEach(G=>sol.add(G.x+','+G.y));TOWNSFOLK.forEach(f=>sol.add(TP(f.at[0],f.at[1]).join()));const g=MAPS.town.g;
  LIFE.w=WALKERS.map((w,i)=>{const a=TP(w.a[0],w.a[1]),b=TP(w.b[0],w.b[1]),z=ZONE[a[1]][a[0]],ok=(x,y)=>{const t=g[y]&&g[y][x];return t!==undefined&&!SOLID.has(t)&&t!=='D'&&t!==':'&&ZONE[y][x]===z&&!sol.has(x+','+y)};
    // plus court chemin de a à b, sans quitter le quartier
    const prev={},q=[a];prev[a.join()]=null;let found=null;
    while(q.length){const c=q.shift();if(c[0]===b[0]&&c[1]===b[1]){found=c;break}for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]){const n=[c[0]+dx,c[1]+dy],k=n.join();if(!(k in prev)&&ok(n[0],n[1])){prev[k]=c;q.push(n)}}}
    const path=[];for(let c=found;c;c=prev[c.join()])path.unshift(c);if(!path.length)path.push(a);
    const old=LIFE.w[i],st=old&&old.path.length===path.length?old:{i:0,s:1,px:path[0][0]*TS,py:path[0][1]*TS,wait:60+i*40,frame:0,dir:'down',n:0};st.path=path;st.def=w;return st});
  if(!LIFE.birds)LIFE.birds=[[54,37],[61,12],[36,31],[27,41],[64,60],[30,60],[10,48],[9,20],[38,12],[79,43],[80,57],[67,46],[24,33],[57,22]].map(([x,y],i)=>{const p=LW(x,y);return {x:p[0],y:p[1],n:2+i%3,st:0,t:0}});
}
function lifeUpdate(k){
  riderStep(k);
  if(S.map!=='town')return;if(LIFE.ch!==S.ch)lifeInit();
  const frozen=busy||dlg.open;
  LIFE.w.forEach(w=>{const tx=Math.round(w.px/TS),ty=Math.round(w.py/TS);w.x=tx;w.y=ty;w.moving=false;
    const ax=P.x-tx,ay=P.y-ty;if(Math.abs(ax)+Math.abs(ay)<=1){if(ax||ay)w.dir=Math.abs(ax)>Math.abs(ay)?(ax>0?'right':'left'):(ay>0?'down':'up');return}   // tu es à côté : il s'arrête et te regarde
    if(frozen||w.path.length<2)return;if(w.wait>0){w.wait-=k;return}
    const n=w.path[w.i+w.s];if(!n){w.s=-w.s;w.wait=150+((w.i*37+w.path.length*11)%160);return}
    const gx=n[0]*TS,gy=n[1]*TS,sp=(w.def.v||.5)*k,dx=gx-w.px,dy=gy-w.py;
    if(Math.abs(dx)>Math.abs(dy))w.dir=dx>0?'right':'left';else if(dy)w.dir=dy>0?'down':'up';
    w.px+=Math.sign(dx)*Math.min(sp,Math.abs(dx));w.py+=Math.sign(dy)*Math.min(sp,Math.abs(dy));w.moving=true;w.frame+=.09*k*(1+(w.def.v||.5));
    if(w.px===gx&&w.py===gy)w.i+=w.s});
  // oiseaux : ils s'envolent quand tu approches, et reviennent plus tard
  LIFE.birds.forEach(b=>{if(b.st===0){if(Math.abs(P.x-b.x)<=2&&Math.abs(P.y-b.y)<=2){b.st=1;b.t=0}}else{b.t+=k;if(b.st===1&&b.t>70){b.st=2;b.t=0}else if(b.st===2&&b.t>900&&(Math.abs(P.x-b.x)>6||Math.abs(P.y-b.y)>6)){b.st=0}}});
}
function lifeObjs(id,o){
  if(id!=='town'||LIFE.busy)return;
  TOWNSFOLK.forEach(f=>{if(!lifeOn(f.who))return;const p=TP(f.at[0],f.at[1]);o.push({x:p[0],y:p[1],kind:'npc',solid:1,who:f.who,pal:f.pal,dir:f.dir,act:()=>{f.n=(f.n||0)+1;say([{w:f.who,t:lifeLine(f,f.n)}])}})});
  LIFE.w.forEach(w=>{const d=w.def;if(!lifeOn(d.who))return;o.push({x:w.x===undefined?w.path[0][0]:w.x,y:w.y===undefined?w.path[0][1]:w.y,px:w.px,py:w.py,kind:'npc',solid:1,who:d.who,pal:d.pal,dir:w.dir,frame:w.moving?Math.floor(w.frame):0,moving:w.moving,still:1,pet:d.pet,
    noUmb:d.who==='Joggeuse',act:()=>{w.n++;say([{w:d.who,t:lifeLine(d,w.n)}])}})});
  riderObjs(o);
}
/* ---- sous les personnages : l'eau miroite ---- */
function lifeUnder(c,ox,oy,t){
  const g=MAPS.town.g,x0=Math.max(0,Math.floor(ox/TS)),y0=Math.max(0,Math.floor(oy/TS)),x1=Math.min(TW-1,Math.ceil((ox+cv.width)/TS)),y1=Math.min(TH-1,Math.ceil((oy+cv.height)/TS));
  for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++){const tl=g[y][x];if(tl!=='R'&&tl!=='~'&&tl!=='p')continue;const h=(x*13+y*7)%11,ph=((t>>3)+h*3)%22;
    if(ph<12){c.fillStyle='rgba(255,255,255,'+(tl==='p'?.3:.22)+')';c.fillRect(x*TS-ox+((ph+h*2)%13),y*TS-oy+3+((h*5)%10),3,1)}
    if(tl==='R'&&(x*31+y*17)%23===0){const r=((t>>2)+x*9+y*5)%150;if(r<18){c.strokeStyle='rgba(255,255,255,'+(.5-r/40)+')';c.lineWidth=1;c.beginPath();c.arc(x*TS-ox+8,y*TS-oy+8,1+r/3,0,7);c.stroke()}}}
}
/* ---- parmi les personnages : oiseaux, chien ---- */
function lifeEnts(ents,ox,oy,t){
  regLifeEnts(ents,ox,oy,t);
  LIFE.birds&&!skWet()&&SKY.dark<.4&&LIFE.birds.forEach(b=>{if(b.st===2)return;const X=b.x*TS-ox,Y=b.y*TS-oy;if(X<-60||X>cv.width+60||Y<-90||Y>cv.height+40)return;
    ents.push({y:b.y*TS+2,f:()=>{for(let i=0;i<b.n;i++){const hx=(i*7+b.x*3)%11,hy=(i*5+b.y)%7;
      if(b.st===0){const pk=((t>>3)+i*5+b.x)%14<2?1:0,hop=((t>>2)+i*9)%40===0?-1:0,bx=X+1+hx,by=Y+5+hy+hop;R(ctx,bx,by,4,3,i%2?'#5b6380':'#8a6538');R(ctx,bx+3,by-1+pk,2,2,i%2?'#39426a':'#6b4a2b');R(ctx,bx+5,by+pk,1,1,'#f2a33a');R(ctx,bx+1,by+3,1,1,'#333')}
      else{const u=b.t,bx=X+1+hx+u*(1.1+i*.3)*(i%2?1:-1),by=Y+5+hy-u*(1.3+i*.2),fl=((t>>1)+i)%2;R(ctx,bx,by,3,2,i%2?'#5b6380':'#8a6538');R(ctx,bx-2,by-(fl?2:0),2,1,'#39426a');R(ctx,bx+3,by-(fl?2:0),2,1,'#39426a')}}}})});
  LIFE.w.forEach(w=>{if(!w.def.pet||!lifeOn(w.def.who))return;const back={up:[0,12],down:[0,-11],left:[13,2],right:[-13,2]}[w.dir],X=Math.round(w.px+back[0]-ox),Y=Math.round(w.py+back[1]-oy),wag=((t>>2)%2);
    ents.push({y:w.py+back[1],f:()=>{R(ctx,X+3,Y+14,9,1,'rgba(0,0,0,.2)');R(ctx,X+3,Y+8,9,4,'#c9a26e');R(ctx,X+(w.dir==='left'?1:10),Y+6,4,4,'#c9a26e');R(ctx,X+(w.dir==='left'?1:13),Y+5,1,2,'#8a6538');R(ctx,X+(w.dir==='left'?2:12),Y+7,1,1,'#222');
      R(ctx,X+(w.dir==='left'?12:2),Y+7-wag,1,2,'#8a6538');R(ctx,X+4,Y+12,1,2+(w.moving&&(t>>3)%2?-1:0),'#8a6538');R(ctx,X+10,Y+12,1,2+(w.moving&&(t>>3)%2?0:-1),'#8a6538')}})});
}
/* ---- au-dessus : papillons, fumée, drapeaux, enseignes, nuages ---- */
function lifeOver(c,ox,oy,t){
  regLifeOver(c,ox,oy,t);
  const g=MAPS.town.g,night=SKY.dark>.3,fly=!night&&!skWet()&&SEA.se!==3&&SKY.T>9&&SKY.wind<.7,x0=Math.max(0,Math.floor(ox/TS)),y0=Math.max(0,Math.floor(oy/TS)),x1=Math.min(TW-1,Math.ceil((ox+cv.width)/TS)),y1=Math.min(TH-1,Math.ceil((oy+cv.height)/TS));
  if(fly)for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++){if(g[y][x]!=='*'||(x*29+y*13)%7)continue;const a=t/23+x*1.7+y,bx=x*TS-ox+8+Math.sin(a)*9,by=y*TS-oy+4+Math.cos(a*1.3)*6-3,fl=(t>>2)%2,col=['#f7f0dc','#f2c12e','#e57399','#8ec9e8'][(x+y)%4];
    R(c,bx-(fl?2:1),by,fl?2:1,2,col);R(c,bx+1,by,fl?2:1,2,col);R(c,bx,by,1,2,'#333')}
  const vis=b=>b.x*TS-ox<cv.width+20&&(b.x+b.w)*TS-ox>-20&&b.y*TS-oy<cv.height+40&&(b.y+b.h)*TS-oy>-40;
  BLD.forEach(b=>{if(!vis(b))return;const X=b.x*TS-ox,Y=b.y*TS-oy,W=b.w*TS,rh=Math.ceil(b.h*.45)*TS;
    const smoke=(sx,sy)=>{for(let k=0;k<4;k++){const a=(t/2+k*16)%64;c.fillStyle='rgba(245,245,245,'+(.5*(1-a/64))+')';c.beginPath();c.arc(sx+Math.sin(a/9+k)*3+a/10*(1+SKY.wind*5),sy-a*(.5-SKY.wind*.2),1.5+a/22,0,7);c.fill()}};
    const fw=.5+SKY.wind*1.6,flag=(fx,fy,cols)=>{R(c,fx,fy,1,16,'#8a8f9a');cols.forEach((col,i)=>{for(let j=0;j<7;j++)R(c,fx+1+i*3,fy+1+j+Math.round(Math.sin(t*fw/7+i*.9+j*.25)*(.6+SKY.wind*1.4)),3,1,col)})};
    if(b.id==='boulangerie'&&(hr(3,9.5)||SKY.T<8))smoke(X+W-16,Y-10);   // le fournil la nuit et le matin, le chauffage quand il fait froid
    if(b.id==='maison'&&SKY.T<13)smoke(X+14,Y-11);
    if(b.id==='mairie'){flag(X+4,Y+rh-20,['#2f5fb3','#f7f0dc','#c43d3d']);flag(X+W-14,Y+rh-20,['#2f5fb3','#f7f0dc','#c43d3d'])}
    if(b.id==='ecole')flag(X+W-12,Y-12,['#2f5fb3','#f7f0dc','#c43d3d']);
    if(b.id==='pharma'){const on=(t>>4)%4!==3,k=on?'#3be07a':'#1f6f43';R(c,X+W-9,Y+4,4,10,k);R(c,X+W-12,Y+7,10,4,k);if(on){c.fillStyle='rgba(59,224,122,.18)';c.fillRect(X+W-15,Y+1,16,16)}}
    if(b.id==='voltco'){const w=txt35w('VOLT CO',2)+10,bx=Math.round(X+W/2-w/2);for(let k=0;k<w;k+=4)R(c,bx+k+1,Y-9,2,1,((k>>2)+(t>>3))%3===0?'#fff3a8':'#c9a227')}
    if(b.id==='enedis'&&(t>>4)%2)R(c,X+W-21,Y+4,2,2,'#ff5a4a');
    if(b.id==='gare'){const a=t/40;R(c,b.door[0]*TS-ox+9,Y+5,1,1,'#c43d3d');R(c,Math.round(b.door[0]*TS-ox+9+Math.sin(a)*3),Math.round(Y+8-Math.cos(a)*3),1,1,'#1c2440')}
    if(b.arena===6){[[6,5],[W-12,9],[W/2,3],[20,11]].forEach(([a,d],i)=>{if(((t>>4)+i)%3)R(c,X+a,Y+d,1,1,'#fff7c2')})}});
  // feuilles qui tombent des arbres
  if(!night&&SEA.se!==3)for(let y=y0-1;y<=y1;y++)for(let x=x0;x<=x1;x++){if(g[y]===undefined||g[y][x]!=='T'||(x*31+y*17)%(SEA.se===2?2:7)||treeEver(artTreeKind(x,y)))continue;const ph=(t*.4+x*47+y*29)%210;if(ph>80)continue;
    R(c,Math.round(x*TS-ox+8+Math.sin(ph/8+x)*6-ph*.06),Math.round(y*TS-oy-8+ph*.32),2,1,LEAFC[(x+y)%5]);if(ph%20<10)R(c,Math.round(x*TS-ox+9+Math.sin(ph/8+x)*6-ph*.06),Math.round(y*TS-oy-7+ph*.32),1,1,LEAFC[(x+y+1)%5])}
  // ombres de nuages qui passent
  if(!night&&SKY.cloud>.15&&SKY.cloud<.88&&SKY.fog<.2)for(let i=0;i<(SKY.cloud>.5?5:3);i++){const wx=((t*(.12+SKY.wind*.5)+i*640)%(TW*TS+500))-250,wy=120+i*330+Math.sin(i*2.1)*90,X=wx-ox,Y=wy-oy;if(X<-200||X>cv.width+200||Y<-90||Y>cv.height+90)continue;
    c.fillStyle='rgba(20,40,60,'+(.05+SKY.cloud*.07).toFixed(3)+')';c.beginPath();c.ellipse(X,Y,150,46,0,0,7);c.fill();c.beginPath();c.ellipse(X+70,Y-22,80,34,0,0,7);c.fill()}
}
