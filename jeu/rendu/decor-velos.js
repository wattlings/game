/* Wattlings · jeu/rendu/decor-velos.js
   Décor : vélos et cyclistes de la boucle cyclable. */

/* ================= DÉCORS : ville cyclable, nature, gare, intérieurs meublés, barrières de quartier ================= */
const F35={0:'111101101101111',1:'010110010010111',2:'111001111100111',3:'111001111001111',4:'101101111001001',5:'111100111001111',6:'111100111101111',7:'111001010010010',8:'111101111101111',9:'111101111001111',
  G:'111100101101111',A:'111101111101101',R:'110101110101101',E:'111100110100111',F:'111100110100100',M:'101111101101101',
  B:'110101110101110',C:'111100100100111',D:'110101101101110',H:'101101111101101',I:'111010010010111',L:'100100100100111',N:'111101101101101',O:'111101101101111',P:'111101111100100',S:'111100111001111',T:'111010010010010',U:'101101101101111',V:'101101101010010'};
function px35(c,ch,x,y,col,s){const g=F35[ch];if(!g)return;s=s||1;for(let i=0;i<15;i++)if(g[i]==='1')R(c,x+(i%3)*s,y+((i/3)|0)*s,s,s,col)}
function drawBikeStatic(c,x,y,col){const k='#2c2c34';
  [[0,5],[8,5]].forEach(([a,b])=>{R(c,x+a+1,y+b,3,1,k);R(c,x+a+1,y+b+4,3,1,k);R(c,x+a,y+b+1,1,3,k);R(c,x+a+4,y+b+1,1,3,k)});
  R(c,x+3,y+4,6,1,col);R(c,x+2,y+5,1,2,col);R(c,x+6,y+5,1,2,col);R(c,x+9,y+3,1,4,col);R(c,x+3,y+3,2,1,k);R(c,x+9,y+2,2,1,'#555')}
/* cycliste en mouvement (dir : right/left/up/down) */
function drawCyclist(c,x,y,dir,t,pal){
  x=Math.round(x);y=Math.round(y);const k='#2c2c34',sp=(t>>2)%2;
  if(dir==='left'||dir==='right'){const f=dir==='right'?1:-1,bx=x+1;
    [[0,9],[9,9]].forEach(([a,b])=>{R(c,bx+a+1,y+b,3,1,k);R(c,bx+a+1,y+b+4,3,1,k);R(c,bx+a,y+b+1,1,3,k);R(c,bx+a+4,y+b+1,1,3,k);R(c,bx+a+2,y+b+2,1,1,sp?'#ddd':k)});
    R(c,bx+3,y+9,8,1,pal.bike);R(c,bx+6,y+9,1,3,pal.bike);
    R(c,x+6,y+4,4,5,pal.shirt);R(c,x+6+(f>0?3:-1),y+5,2,1,pal.shirt);R(c,x+6+(sp?1:2),y+9,2,3,pal.pants);
    R(c,x+6,y,4,4,'#f1c7a1');R(c,x+6,y-1,4,2,pal.helmet);R(c,x+(f>0?9:6),y+2,1,1,'#222');
  }else{
    R(c,x+7,y+6,2,9,k);R(c,x+5,y+8,6,1,pal.bike);
    R(c,x+5,y+4,6,5,pal.shirt);R(c,x+5+(sp?0:4),y+9,2,3,pal.pants);R(c,x+4,y+5,1,3,pal.shirt);R(c,x+11,y+5,1,3,pal.shirt);
    R(c,x+6,y,4,4,dir==='up'?pal.helmet:'#f1c7a1');R(c,x+6,y-1,4,2,pal.helmet);if(dir==='down'){R(c,x+7,y+2,1,1,'#222');R(c,x+9,y+2,1,1,'#222')}
  }
}
const RIDERS=[{o:0,v:1.25,cw:1,pal:{shirt:'#e2573b',pants:'#2f3a5c',helmet:'#f7f0dc',bike:'#2f6db5'}},{o:900,v:1.05,cw:1,pal:{shirt:'#2f9e7a',pants:'#6b4a2b',helmet:'#f2c12e',bike:'#c43d3d'}},{o:1900,v:1.45,cw:1,pal:{shirt:'#8a3b8f',pants:'#2c2c34',helmet:'#4a78c9',bike:'#2c2c34'}},
  {o:300,v:1.15,cw:0,pal:{shirt:'#f2c12e',pants:'#2f3a5c',helmet:'#c43d3d',bike:'#2f9e7a'}},{o:1500,v:1.35,cw:0,pal:{shirt:'#4a78c9',pants:'#333',helmet:'#f7f0dc',bike:'#f2a33a'}}];
/* la boucle vue par les cyclistes : des points tous les quarts de case le long de son axe, déformés comme la ville */
let RINGS=null;const RARC={ch:-1,a:null};
function ringSamples(){
  if(RINGS)return RINGS;const P=ringCentre(),S0=[];let d=0,pv=null;
  for(let k=0;k<P.length-1;k++){const [ax,ay]=P[k],[bx,by]=P[k+1],n=Math.max(1,Math.round(Math.hypot(bx-ax,by-ay)/4));
    for(let i=0;i<n;i++){const x=ax+(bx-ax)*i/n-8,y=ay+(by-ay)*i/n-8,lx=x/TS,ly=y/TS;if(pv)d+=Math.hypot(x-pv[0],y-pv[1]);pv=[x,y];S0.push({x,y,d,lx,ly,z:zoneL(Math.round(lx+.5),Math.round(ly+.5))})}}
  const f=S0[0];RINGS={s:S0,per:d+Math.hypot(f.x-pv[0],f.y-pv[1])};return RINGS;
}
/* portion ouverte aux vélos : de l'est du pont du Nord jusqu'à la première barrière fermée (null = boucle entière) */
function ringArc(){
  if(RARC.ch===S.ch)return RARC.a;RARC.ch=S.ch;const {s,per}=ringSamples(),n=s.length,open=q=>q.z<0||(q.z===8&&q.lx>=RIVER[0]-1?S.ch>=10:S.ch>=QUARTERS[q.z].need);
  let i0=s.findIndex(q=>q.ly<RING.y0+1&&q.lx>=RIVER[1]+2),k=0;while(k<n&&open(s[(i0+k)%n]))k++;
  if(k>=n)return RARC.a=null;const len=(s[(i0+k-1)%n].d-s[i0].d+per)%per-28;return RARC.a=[s[i0].d+8,Math.max(TS,len)];
}
function riderPos(r,t){
  const {s,per}=ringSamples(),arc=ringArc();let d,fw;
  if(arc){const G=arc[1],u=((t*r.v+r.o)%(2*G)+2*G)%(2*G);fw=u<G;d=arc[0]+(fw?u:2*G-u)}   // boucle encore barrée : allers-retours
  else{d=((t*r.v+r.o)%per+per)%per;fw=!!r.cw;if(!fw)d=per-d}
  d=((d%per)+per)%per;let lo=0,hi=s.length-1;while(lo<hi){const m=(lo+hi+1)>>1;if(s[m].d<=d)lo=m;else hi=m-1}
  const a=s[lo],b=s[(lo+1)%s.length],seg=((b.d-a.d)+per)%per||1,f=(d-a.d)/seg,dx=b.x-a.x,dy=b.y-a.y,L2=Math.hypot(dx,dy)||1,sg=fw?1:-1;
  // on roule à droite : chacun se décale de 5 px vers sa droite
  return{x:a.x+dx*f-dy/L2*5*sg,y:a.y+dy*f+dx/L2*5*sg,dir:Math.abs(dx)>=Math.abs(dy)?(dx*sg>0?'right':'left'):(dy*sg>0?'down':'up')};
}
function riderEnts(ents,ox,oy,t){RIDERS.forEach(r=>{const p=riderPos(r,t);if(p.x-ox<-20||p.x-ox>cv.width+20||p.y-oy<-20||p.y-oy>cv.height+20)return;ents.push({y:p.y+1,f:()=>{const i=RIDERS.indexOf(r),sp=(t>>2)%2;ctx.fillStyle='rgba(20,40,30,.22)';ctx.fillRect(Math.round(p.x-ox)+2,Math.round(p.y-oy)+12,12,2);ctx.drawImage(fxSprite('cy'+i+p.dir+sp,28,30,g=>drawCyclist(g,6,8,p.dir,sp*4,r.pal)),Math.round(p.x-ox)-6,Math.round(p.y-oy)-10)}})})}
