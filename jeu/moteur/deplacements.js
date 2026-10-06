/* Wattlings · jeu/moteur/deplacements.js
   Déplacements du joueur : marche, course, roulade, portes, collisions, mise à jour à chaque image. */

/* ================= BOUCLE DE JEU ================= */
const P={x:5,y:6,px:5*TS,py:6*TS,dir:'up',moving:false,step:0,frame:0,dist:0,runHeld:false,runToggle:false,puffs:[]};
const WALK_SPEED=60,RUN_SPEED=128; // pixels par seconde (1 case = 16 px)
const isRunning=()=>!BOX.on&&(P.runHeld||P.runToggle);
/* Roulade avant : trois cases d'une traite, plus vite qu'en courant, puis un bref temps de récupération */
const ROLL_SPEED=280,ROLL_TILES=3,ROLL_REST=90;
function rollStep(first){
  const [dx,dy]=DIRS[P.dir],nx=P.x+dx,ny=P.y+dy,t=tileAt(nx,ny),ob=objAt(nx,ny);
  if(t==='D'||t==='E'||t==='S'||t==='U'||(ob&&ob.go)||isSolid(nx,ny)){if(first)sfx('bump');endRoll();return false}
  P.x=nx;P.y=ny;P.moving=true;return true;
}
function endRoll(){P.rolling=false;P.roll=0;P.rollEnd=performance.now();P.frame=0;P.dist=0}
function startRoll(){
  if(busy||dlg.open||AR.lock||BOX.on||P.rolling||P.pushed||QK_HOST.hidden)return;
  if(P.moving){P.rollWant=performance.now();return}
  if(performance.now()-(P.rollEnd||0)<ROLL_REST){P.rollWant=performance.now();return}
  for(const d of ['up','down','left','right'])if(keys[d]){P.dir=d;break}
  P.rollWant=0;P.rolling=true;P.roll=ROLL_TILES;P.dist=0;
  if(rollStep(true))sfx('roll');
}
function drawRoll(c,x,y,dir,dist,p){
  x=Math.round(x);y=Math.round(y);const skin=p.skin||'#f1c7a1',q=Math.floor(dist/6)%4,k=(dir==='right'||dir==='down')?q:(4-q)%4,body=p.jacket||p.shirt;
  c.fillStyle='rgba(0,0,0,.22)';c.fillRect(x+3,y+14,10,2);
  const by=y+3+(q%2?0:1);
  R(c,x+4,by,8,11,body);R(c,x+3,by+2,10,7,body);
  const Q=[[x+5,by,6,3],[x+10,by+3,3,5],[x+5,by+8,6,3],[x+3,by+3,3,5]],put=(i,col)=>{const r=Q[(k+i)%4];R(c,r[0],r[1],r[2],r[3],col)};
  put(0,p.hat||p.hair);put(1,skin);put(2,p.skirt?skin:p.pants);put(3,'#222');
}
const keys={up:0,down:0,left:0,right:0};
let tick=0,busy=false; // busy = dialogue/modal/combat
function blocked(){return busy||dlg.open||AR.lock}
function tileAt(x,y){const g=MAPS[S.map].g;return g[y]&&g[y][x]}
function objAt(x,y){return objsFor(S.map).find(o=>o.x===x&&o.y===y)}
function isSolid(x,y){const t=tileAt(x,y);if(t===undefined||SOLID.has(t))return true;const o=objAt(x,y);return !!(o&&o.solid)}
const DIRS={up:[0,-1],down:[0,1],left:[-1,0],right:[1,0]};
function tryMove(d){
  P.dir=d;const [dx,dy]=DIRS[d],nx=P.x+dx,ny=P.y+dy,t=tileAt(nx,ny);
  if(BOX.on&&(t==='D'||t==='E'||t==='S'||t==='U')){const n=performance.now();if(n-(tryMove.c||0)>2500){toast('Le carton ne passe pas la porte.');tryMove.c=n}return}
  if(t==='D'){enterDoor(nx,ny);return}
  if(t==='E'){exitBuilding();return}
  if(t==='S'){warp('cave',2,2,'down');return}
  if(t==='U'){warp('rdc',13,2,'left');return}
  {const ob=objAt(nx,ny);if(ob&&ob.go){ob.go();return}}
  if(isSolid(nx,ny)){const n=performance.now();if(n-(tryMove.b||0)>260){sfx('bump');tryMove.b=n}return}
  P.x=nx;P.y=ny;P.moving=true;
}
function warp(map,x,y,dir){BOX.on=false;BOX.guard=null;P.rolling=false;P.roll=0;P.rollWant=0;S.map=map;P.x=x;P.y=y;P.px=x*TS;P.py=y*TS;P.dir=dir;P.moving=false;S.x=x;S.y=y;S.dir=dir;save();fadeIn();sfx('door');updateMusic();if(typeof lastObj!=='undefined'&&S.site)hud()}
let fade=0;function fadeIn(){fade=1}
function enterDoor(x,y){
  const b=BLD.find(b=>b.door[0]===x&&b.door[1]===y);if(!b)return;
  if(b.arena){enterArena(b.arena);return}
  if(b.id==='office'){warp('office',5,7,'up');return}
  if(LOCALS[b.id]){S.inside=b.id;warp('local',5,6,'up');toast(LOCALS[b.id].name);return}
  if(b.id==='gare'){if(voyOuvert()){gareEntrer();return}say([{t:"Gare d'Ampère-sur-Loire. Les portes sont closes. Une affiche : « Gare fermée. Réouverture prochaine. »"},{t:"Sous l'affiche, le tableau des départs est vide. Quelqu'un a écrit à la craie : « D'autres villes, bientôt. »"}]);return}
  if(b.id==='mairie'){if(S.ch>=10)warp('mairie',6,8,'up');else say([{t:"Hôtel de ville. Un panneau : « Le maire est en réunion. » Le panneau semble dater de 2019."},{t:"Tu reviendras quand tu géreras un patrimoine entier."}]);return}
  if(!S.site){say([{t:"Ce bâtiment n'est pas encore dans ton périmètre. Parle d'abord à Mme Joule, au bureau."}]);return}
  if(b.id!==S.site){say([{t:`${SITES[b.id].name} : ce n'est pas (encore) ton site. ${S.ch>=10?"Tu le gères maintenant depuis la vue patrimoine, au bureau.":"Un jour, peut-être..."}`}]);return}
  if(S.ch<2){say([{t:"Pas si vite ! Avant d'entrer, cadre ton site depuis l'extérieur : boîte aux lettres et fiche technique."}]);return}
  warp('rdc',7,9,'up');
}
function exitBuilding(){
  if(MAPS[S.map].sortie){MAPS[S.map].sortie();return}   // cartes de voyage
  if(curArena()){const d=curArena().b.door;AR.lock=false;warp('town',d[0],d[1]+1,'down')}
  else if(S.map==='office'){const d=BLD[0].door;warp('town',d[0],d[1]+1,'down')}
  else if(S.map==='mairie'){const d=front('mairie');warp('town',d[0],d[1],'down')}
  else if(S.map==='local'&&S.inside==='villaUp'){S.inside='villa';warp('local',9,2,'down')}
  else if(S.map==='local'){const b=BLD.find(b=>b.id===S.inside);warp('town',b.door[0],b.door[1]+1,'down')}
  else{const b=BLD.find(b=>b.id===S.site);warp('town',b.door[0],b.door[1]+1,'down')}
}
function update(k){
  k=k||1;tick++;skyUpdate();skyApply();regTick();enTick(k);SKR.turb+=(.02+SKY.wind*.15)*k;
  if(fade>0)fade=Math.max(0,fade-.06);
  if(P.moving){const tx=P.x*TS,ty=P.y*TS,run=isRunning(),sp=(P.pushed?230:P.rolling?ROLL_SPEED:run?RUN_SPEED:WALK_SPEED)/60*k;const dx=Math.min(sp,Math.abs(tx-P.px)),dy=Math.min(sp,Math.abs(ty-P.py));P.px+=Math.sign(tx-P.px)*dx;P.py+=Math.sign(ty-P.py)*dy;if(!P.pushed){P.dist+=dx+dy;P.step++;P.frame=1+Math.floor(P.dist/(run?5:4))}
    if((run||P.rolling)&&tick%(P.rolling?3:7)===0)P.puffs.push({x:P.px+8,y:P.py+15,t:0});
    if(P.px===tx&&P.py===ty){P.moving=false;S.x=P.x;S.y=P.y;S.dir=P.dir;onStep();
      if(P.rolling){P.roll--;if(P.roll>0&&!blocked()&&!P.moving&&!P.pushed)rollStep();else endRoll()}}}
  if(!P.moving&&!blocked()&&!P.rolling&&P.rollWant){if(performance.now()-P.rollWant<260){if(performance.now()-(P.rollEnd||0)>=ROLL_REST)startRoll()}else P.rollWant=0}
  if(!P.moving&&!blocked()&&!P.rolling){for(const d of ['up','down','left','right'])if(keys[d]){tryMove(d);break}}
  if(!P.moving&&!Object.values(keys).some(Boolean)){P.frame=0;P.dist=0}
  P.puffs=P.puffs.filter(q=>(q.t+=k)<18);
  updateGuard(k);arenaUpdate(k);lifeUpdate(k);
}
