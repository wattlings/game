/* Wattlings · jeu/moteur/boucle.js
   La boucle de jeu : ce qui se passe à chaque pas, l'affichage de l'écran, la cadence. */

function onStep(){
  if(arenaStep())return;
  if(S.map==='town'&&windStep())return;
  if(S.map==='town'&&tileAt(P.x,P.y)===':'&&S.ch>=4&&!BOX.on&&Math.random()<.16){startEncounter()}
}
function render(){
  const m=MAPS[S.map],mc=mapCache[S.map],mw=mc.width,mh=mc.height;
  const vw=cv.width,vh=cv.height;let ox=P.px+8-vw/2,oy=P.py+8-vh/2;
  ox=mw<vw?(mw-vw)/2:Math.max(0,Math.min(mw-vw,ox));oy=mh<vh?(mh-vh)/2:Math.max(0,Math.min(mh-vh,oy));
  ox=Math.round(ox);oy=Math.round(oy);
  R(ctx,0,0,cv.width,cv.height,'#0b1020');ctx.drawImage(mc,-ox,-oy);
  const objs=objsFor(S.map),town=S.map==='town',pal=town&&skWet()&&!P.rolling&&!BOX.on?skPal({pal:PAL[S.rank],fresh:1}):PAL[S.rank];
  if(town){lifeUnder(ctx,ox,oy,tick);skyUnder(ctx,ox,oy,objs,tick)}
  const ents=objs.map(o=>({y:o.flat?-1e6:o.py!==undefined?o.py:o.y*TS,f:()=>drawObj(ctx,o,ox,oy,tick)}));
  P.puffs.forEach(q=>{const a=1-q.t/18;ctx.fillStyle=`rgba(230,222,200,${a*.8})`;const r=1+q.t/6;ctx.fillRect(Math.round(q.x-ox-r),Math.round(q.y-oy-r-q.t/5),Math.round(r*2),Math.round(r*2))});
  ents.push({y:P.py+1,f:()=>BOX.on?drawBoxPlayer(ctx,P.px-ox,P.py-oy,P.moving,P.frame):P.rolling?drawRoll(ctx,P.px-ox,P.py-oy-2,P.dir,P.dist,pal):drawChar(ctx,P.px-ox,P.py-oy-2,P.dir,P.moving?P.frame:0,pal,P.moving&&isRunning())});
  if(BOX.guard)ents.push({y:BOX.guard.y+1,f:()=>drawGuard(ctx,ox,oy)});
  if(S.map==='town')ents.push({y:POOL.y0*TS,f:()=>drawSwimmer(ctx,ox,oy,tick)});
  if(S.map==='town'){riderEnts(ents,ox,oy,tick);lifeEnts(ents,ox,oy,tick)}
  ents.sort((a,b)=>a.y-b.y).forEach(e=>e.f());
  if(mapOver[S.map])ctx.drawImage(mapOver[S.map],-ox,-oy);
  // hautes herbes par-dessus les pieds
  if(S.map==='town'&&tileAt(P.x,P.y)===':'&&!P.moving){R(ctx,P.px-ox+2,P.py-oy+11,12,5,'#4f9a4a');R(ctx,P.px-ox+4,P.py-oy+10,1,4,'#6fbf5f');R(ctx,P.px-ox+10,P.py-oy+10,1,4,'#6fbf5f')}
  if(town){lifeOver(ctx,ox,oy,tick);drawWind(ox,oy);skyOver(ctx,ox,oy,objs,tick)}
  // nuit / cave
  const night=S.ch===7,dark=town?0:S.map==='arena6'?.8:S.map==='cave'?(night?.9:.55):(night?.86:0);   // en ville, la lumière vient du ciel (k_sky.js)
  if(dark>0){const cx=P.px-ox+8,cy=P.py-oy+8,g=ctx.createRadialGradient(cx,cy,8,cx,cy,night?58:80);g.addColorStop(0,'rgba(6,9,24,0)');g.addColorStop(1,`rgba(6,9,24,${dark})`);ctx.fillStyle=g;ctx.fillRect(0,0,cv.width,cv.height);
    if(night)objs.filter(o=>o.kind==='derive'||(o.kind==='boiler'&&!S.derives.boiler)).forEach(o=>{if(o.kind==='boiler'){const X=o.x*TS-ox,Y=o.y*TS-oy,g2=ctx.createRadialGradient(X+8,Y+6,1,X+8,Y+6,16);g2.addColorStop(0,'rgba(255,120,60,.8)');g2.addColorStop(1,'rgba(255,120,60,0)');ctx.fillStyle=g2;ctx.fillRect(X-10,Y-12,36,36)}else drawObj(ctx,o,ox,oy,tick)})}
  arenaNightFx(ctx,ox,oy);
  // flèches d'objectif
  const bob=Math.sin(tick/8)*2;
  objs.forEach(o=>{if(!o.glow)return;const X=o.x*TS-ox+8,Y=o.y*TS-oy-14+bob;R(ctx,X-4,Y-6,9,9,'#fffaf0');R(ctx,X-3,Y-7,7,11,'#fffaf0');R(ctx,X,Y-5,2,4,'#1c2440');R(ctx,X,Y,2,2,'#1c2440')});
  if(!AR.lock)targets().forEach(([x,y])=>{const X=x*TS-ox+8,Y=y*TS-oy-8+bob;ctx.fillStyle='#f2a33a';ctx.beginPath();ctx.moveTo(X-5,Y-6);ctx.lineTo(X+5,Y-6);ctx.lineTo(X,Y);ctx.fill();ctx.strokeStyle='#1c2440';ctx.lineWidth=1;ctx.stroke()});
  // nom de lieu
  if(fade>0){ctx.globalAlpha=fade;R(ctx,0,0,cv.width,cv.height,'#000');ctx.globalAlpha=1}
}
let lastT=0;function loop(now){const k=lastT?Math.min(3,(now-lastT)/16.667):1;lastT=now;if(!QK_HOST.hidden){update(k);render()}qkRAF(loop)}
