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
/* cycliste en mouvement (dir : right/left/up/down) ; t>0 : l'autre temps du pédalage. pal : couleurs, peau, cheveux et accessoire
   (acc : sacoche, panier, cargo, enfant ou sac) */
function drawCyclist(c,x,y,dir,t,pal){
  x=Math.round(x);y=Math.round(y);const k='#2c2c34',sp=t?1:0,acc=pal.acc,peau=pal.skin||'#f1c7a1';
  if(dir==='left'||dir==='right'){const f=dir==='right'?1:-1,r=(a,b,w,h,col)=>R(c,f>0?x+a:x+16-a-w,y+b,w,h,col);
    // roues : pneu, jante, moyeu, un rayon qui tourne
    [[3,11],[13,11]].forEach(([a,b])=>{r(a-1,b-4,3,1,k);r(a-1,b+4,3,1,k);r(a-4,b-1,1,3,k);r(a+4,b-1,1,3,k);r(a-3,b-3,1,1,k);r(a+3,b-3,1,1,k);r(a-3,b+3,1,1,k);r(a+3,b+3,1,1,k);
      r(a-2,b-2,1,1,'#8a8f9a');r(a+2,b+2,1,1,'#8a8f9a');r(a,b,1,1,'#c9ccd3');if(sp)r(a,b-3,1,3,'#b5b9c2');else r(a-3,b,3,1,'#b5b9c2')});
    // cadre : base, tube de selle, tube horizontal, tube oblique, fourche, guidon, selle
    r(3,11,5,1,pal.bike);r(6,7,1,4,pal.bike);r(6,7,6,1,pal.bike);r(7,10,1,1,pal.bike);r(8,9,2,1,pal.bike);r(10,8,1,1,pal.bike);r(12,8,1,3,pal.bike);r(11,6,1,2,pal.bike);
    r(10,4,3,1,k);r(4,6,4,1,k);r(7,11,1,1,'#555');
    // accessoires
    if(acc==='sacoche'){r(0,7,4,3,pal.sac||'#6b4a2b');r(1,7,2,1,'#a87a45')}
    if(acc==='panier'){r(13,5,4,3,'#a87a45');r(13,5,4,1,'#c99a62');r(15,1,1,5,'#e8c98a');r(14,2,1,1,'#e8c98a')}
    if(acc==='cargo'){r(13,4,6,5,'#8a5f36');r(13,4,6,1,'#c99a62');r(14,5,4,1,'#f7f0dc');r(14,6,4,1,'#2f9e7a')}
    if(acc==='enfant'){r(1,3,4,4,'#4a78c9');r(2,0,3,3,'#f1c7a1');r(2,-1,3,1,'#f2a33a');r(4,1,1,1,'#222')}
    // jambes : une devant, une derrière, qui alternent
    r(5,5,3,2,pal.pants);
    if(sp){r(8,6,2,2,pal.pants);r(8,8,1,3,pal.pants);r(8,11,2,1,k);r(6,7,1,2,pal.pants);r(5,9,2,1,k)}
    else{r(7,6,2,2,pal.pants);r(6,8,1,3,pal.pants);r(6,11,2,1,k);r(9,7,1,2,pal.pants);r(9,9,2,1,k)}
    // buste penché, bras vers le guidon, sac à dos
    r(5,1,3,4,pal.shirt);r(6,0,3,2,pal.shirt);r(8,2,2,1,pal.shirt);r(9,3,1,1,pal.shirt);r(10,4,1,1,peau);
    if(acc==='sac')r(3,0,3,4,pal.sac||'#2f9e7a');
    if(pal.cravate)r(8,1,1,2,pal.cravate);
    // tête : visage, œil, cheveux, casque
    r(7,-4,4,4,peau);r(9,-3,1,1,'#222');r(6,-3,1,3,pal.hair||'#3a2a1a');r(6,-5,5,2,pal.helmet);r(11,-4,1,1,pal.helmet);r(7,-5,1,1,'#ffffff');
  }else{const r=(a,b,w,h,col)=>R(c,x+a,y+b,w,h,col),up=dir==='up';
    // roue (vue de face ou de dos), garde-boue, guidon
    r(7,8,2,7,k);r(7,9,2,1,'#8a8f9a');r(7,13,2,1,'#8a8f9a');r(7,7,2,1,pal.bike);r(3,6,10,1,k);r(3,6,1,1,'#555');r(12,6,1,1,'#555');
    if(!up&&acc==='panier'){r(5,7,6,3,'#a87a45');r(5,7,6,1,'#c99a62');r(8,4,1,4,'#e8c98a')}
    if(!up&&acc==='cargo'){r(3,7,10,5,'#8a5f36');r(3,7,10,1,'#c99a62');r(4,9,8,1,'#2f9e7a')}
    if(up&&acc==='sacoche'){r(4,9,2,4,pal.sac||'#6b4a2b');r(10,9,2,4,pal.sac||'#6b4a2b')}
    if(up&&acc==='enfant'){r(5,6,6,4,'#4a78c9');r(6,3,4,3,'#f2a33a')}
    // jambes qui pédalent, buste, bras
    r(sp?5:6,8,2,3,pal.pants);r(sp?9:8,8,2,3,pal.pants);r(sp?5:6,11,2,1,k);r(sp?9:8,11,2,1,k);
    r(5,1,6,6,pal.shirt);r(4,2,1,4,pal.shirt);r(11,2,1,4,pal.shirt);r(4,6,1,1,peau);r(11,6,1,1,peau);
    if(up&&acc==='sac')r(5,1,6,5,pal.sac||'#2f9e7a');
    if(!up&&pal.cravate)r(7,2,2,3,pal.cravate);
    // tête
    r(6,-4,4,4,up?(pal.hair||'#3a2a1a'):peau);r(5,-5,6,2,pal.helmet);r(6,-5,4,1,'#ffffff');
    if(!up){r(7,-2,1,1,'#222');r(9,-2,1,1,'#222');r(6,-3,1,1,pal.hair||'#3a2a1a');r(9,-3,1,1,pal.hair||'#3a2a1a')}
  }
}
/* les cinq cyclistes de la boucle : vitesse, sens, tenue ; leurs répliques sont dans recit/habitants.js (CYCLISTES) */
const RIDERS=[
  {o:0,v:1.25,cw:1,pal:{shirt:'#2f3a5c',pants:'#2f3a5c',helmet:'#f7f0dc',bike:'#2f6db5',acc:'sacoche',sac:'#8a3b3b',cravate:'#c43d3d',hair:'#6b3a1a'}},
  {o:900,v:1.05,cw:1,pal:{shirt:'#2f9e7a',pants:'#6b4a2b',helmet:'#f2c12e',bike:'#c43d3d',acc:'panier',hair:'#d9d9d9'}},
  {o:1900,v:1.0,cw:1,pal:{shirt:'#8a3b8f',pants:'#2c2c34',helmet:'#4a78c9',bike:'#f2a33a',acc:'cargo',skin:'#a8714a',hair:'#1c1c1c'}},
  {o:300,v:1.15,cw:0,pal:{shirt:'#f2c12e',pants:'#2f3a5c',helmet:'#c43d3d',bike:'#2f9e7a',acc:'enfant',hair:'#3a2a1a'}},
  {o:1500,v:1.45,cw:0,pal:{shirt:'#4a78c9',pants:'#333',helmet:'#f7f0dc',bike:'#f2a33a',acc:'sac',sac:'#2f9e7a',skin:'#c68a5a',hair:'#1c1c1c'}}];
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
  const av=(r.u!==undefined?r.u:t*r.v)+r.o;
  if(arc){const G=arc[1],u=(av%(2*G)+2*G)%(2*G);fw=u<G;d=arc[0]+(fw?u:2*G-u)}   // boucle encore barrée : allers-retours
  else{d=(av%per+per)%per;fw=!!r.cw;if(!fw)d=per-d}
  d=((d%per)+per)%per;let lo=0,hi=s.length-1;while(lo<hi){const m=(lo+hi+1)>>1;if(s[m].d<=d)lo=m;else hi=m-1}
  const a=s[lo],b=s[(lo+1)%s.length],seg=((b.d-a.d)+per)%per||1,f=(d-a.d)/seg,dx=b.x-a.x,dy=b.y-a.y,L2=Math.hypot(dx,dy)||1,sg=fw?1:-1;
  // on roule à droite : chacun se décale de 5 px vers sa droite
  return{x:a.x+dx*f-dy/L2*5*sg,y:a.y+dy*f+dx/L2*5*sg,dir:Math.abs(dx)>=Math.abs(dy)?(dx*sg>0?'right':'left'):(dy*sg>0?'down':'up')};
}
function riderEnts(ents,ox,oy,t){RIDERS.forEach(r=>{const p=riderPos(r,t);if(p.x-ox<-20||p.x-ox>cv.width+20||p.y-oy<-20||p.y-oy>cv.height+20)return;ents.push({y:p.y+1,f:()=>{const i=RIDERS.indexOf(r),sp=(t>>2)%2;ctx.fillStyle='rgba(20,40,30,.22)';ctx.fillRect(Math.round(p.x-ox)+2,Math.round(p.y-oy)+12,12,2);const arret=r.stop>0,spr=arret?0:sp;ctx.drawImage(fxSprite('cy'+i+p.dir+spr,28,30,g=>drawCyclist(g,6,8,p.dir,spr,r.pal)),Math.round(p.x-ox)-6,Math.round(p.y-oy)-10);
    if(arret&&(t>>4)%3!==2){ctx.fillStyle='#fffaf0';ctx.fillRect(Math.round(p.x-ox)-2,Math.round(p.y-oy)-22,22,8);ctx.fillStyle='#1c2440';ctx.font='bold 7px monospace';ctx.fillText('Dring',Math.round(p.x-ox),Math.round(p.y-oy)-16)}}})})}
/* chaque image : les cyclistes avancent, sauf si tu es sur leur route (ils s'arrêtent et sonnent) ou si un dialogue est ouvert */
function riderStep(k){
  if(S.map!=='town')return;const gel=busy||dlg.open,cx=P.px,cy=P.py;
  RIDERS.forEach(r=>{if(r.u===undefined)r.u=tick*r.v;if(gel){return}
    const p=riderPos(r,tick);r.u+=r.v*k;const q=riderPos(r,tick),d0=Math.hypot(p.x-cx,p.y-cy),d1=Math.hypot(q.x-cx,q.y-cy);
    if(d1<17&&d1<=d0){r.u-=r.v*k;r.stop=(r.stop||0)+k}else r.stop=Math.max(0,(r.stop||0)-k*3)});
}
/* les cyclistes comme personnages : on ne les traverse pas, et on peut leur parler */
function riderObjs(o){
  RIDERS.forEach((r,i)=>{const p=riderPos(r,tick),c=CYCLISTES[i];o.push({x:Math.round(p.x/TS),y:Math.round(p.y/TS),px:p.x,py:p.y,kind:'npc',solid:1,who:c.who,still:1,draw:()=>{},
    act:()=>{r.n=(r.n||0)+1;r.stop=Math.max(r.stop||0,60);say([{w:c.who,t:c.lines[(r.n-1)%c.lines.length]}])}})});
}
