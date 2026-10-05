/* Wattlings · jeu/interface/carte.js
   La carte de la ville (touche K) : quartiers, arènes, objectif, zoom. */

/* ================= CARTE DE LA VILLE : consultation seule (touche K, bouton CARTE, onglet du menu) =================
   Un curseur se déplace sur toute la ville ; l'encart du bas dit à quoi correspond l'endroit pointé.
   Repères : toi, ton objectif, les arènes et leurs badges, les infos clés qui te manquent. Quartiers fermés : grisés, avec un cadenas. */
const WM={q:[],open:false,el:null,cv:null,c:null,base:null,av:null,cx:0,cy:0,z:1,zf:1,vx:0,vy:0,k:{},held:0,t:0,ptr:new Map(),drag:null,pinch:null,w:0,h:0,top:0,bot:0,last:'',oi:0,sent:false,lt:0};
const WMW=TW*TS,WMH=TH*TS;
const WM_LOW={3:1,5:1,6:1},WM_SHORT={1:'Puy du Cadastre',2:'Cité des Beffrois',3:'Clos du Tamis',4:'Colombages',5:'Coteaux des Courbes',6:'Anse du Veilleur',7:'Mas du Soleil',8:'Alpage de la Preuve'};
const wmCap=s=>s.charAt(0).toUpperCase()+s.slice(1);
function wmPlayer(){
  if(S.map==='town')return [P.px/TS,P.py/TS];
  const m=S.map;let d;
  if(m==='office')d=doorOf('office');else if(m==='mairie')d=doorOf('mairie');else if(m==='local')d=doorOf(S.inside==='villaUp'?'villa':S.inside);else if(MAPS[m]&&MAPS[m].arena)d=MAPS[m].arena.b.door;else d=doorOf(S.site);
  return [d[0],d[1]];
}
function wmInfos(){
  return missingReq().map(f=>{const s=SRC[f.src];let p;
    if(f.src==='tech')p=L.park.gate;else if(s.map==='mairie')p=doorOf('mairie');else if(s.map==='office')p=doorOf('office');else if(s.ins)p=doorOf(s.ins);else if(s.map==='town'&&s.x!==undefined)p=[s.x,s.y];else p=doorOf(S.site);
    return {x:p[0],y:p[1],where:s.where}});
}
function wmTargets(){const m=S.map,i=S.inside;let T=[];S.map='town';S.inside=null;try{T=AR.lock?[]:(targets()||[])}catch(e){}S.map=m;S.inside=i;return T}
const wmArenaState=A=>arenaDone(A)?2:S.ch===ARENA_CH[A.id]?1:0;
/* ---- à quoi correspond la case pointée ---- */
const WM_BLD={
  office:['Ton bureau','Mme Joule, ton ordinateur et tes archives. Le départ de la boucle.'],
  mairie:['Hôtel de ville','Le maire et le tableau de bord du patrimoine, une fois les 8 badges gagnés.'],
  gare:['Gare d’Ampère-sur-Loire','Fermée pour l’instant. Plus tard, les trains mèneront vers d’autres lieux.'],
  enedis:['Agence Enedis','Le distributeur d’électricité : compteurs, courbes de charge, dépassements.'],
  grdf:['Poste GRDF','Le distributeur de gaz : compteurs, volumes en m³ et conversion en kWh.'],
  voltco:['Volt&Co Énergie','Un fournisseur : contrats et factures.'],
  media:['Médiathèque','Rayons, borne de prêt et archiviste : tout y est rangé.'],
  cabinet:['Cabinet médical','Le Dr Ohm reçoit sans rendez-vous.'],
  pharma:['Pharmacie','La pharmacienne et sa balance.'],
  maison:['Maison Dupuis','Chez M. et Mme Dupuis.'],
  villa:['Villa','Une villa avec piscine.']
};
/* lieux remarquables : test sur la case réelle (x,y), sa case logique (lx,ly) et son terrain t */
const wmIn=(x,y,r)=>x>=r.x0&&x<=r.x1&&y>=r.y0&&y<=r.y1;
const WM_SPOTS=[
  [(x,y)=>wmIn(x,y,L.park)||(x===L.park.gate[0]&&y===L.park.gate[1]-1),'Parc des Données','Les données brutes y arrivent. Dans les hautes herbes : des anomalies.'],
  [(x,y,lx,ly,t)=>t==='~','Étang','L’étang du parc, place de l’Énergie.'],
  [(x,y)=>wmIn(x,y,L.pool),'Piscine','La piscine de la villa.'],
  [(x,y)=>x>=L.pv.x0&&x<=L.pv.x1&&y>=L.pv.rows[0]-1&&y<=L.pv.rows[1]+1,'Parc solaire','Des panneaux photovoltaïques, et l’installatrice qui les entretient.'],
  [(x,y)=>wmIn(x,y,L.meteo),'Station météo','Température, vent, pluie : les mesures qui expliquent la consommation.'],
  [(x,y,lx,ly,t)=>t===','&&lx<RIVER[0],'Marché','La place du marché, sur la rive Énergie.'],
  [(x,y,lx,ly,t)=>t===','||(x>=L.fountain[0]&&x<=L.fountain[0]+1&&y>=L.fountain[1]&&y<=L.fountain[1]+1),'Place de la fontaine','Le cœur de la place de la Donnée : une fontaine, des pavés, des bancs.'],
  [(x,y,lx,ly,t)=>t==='q','Quai de la gare','Un train attend à quai. Aucun départ n’est affiché.'],
  [(x,y,lx,ly,t)=>t==='g'&&ly<30,'Pont du Nord','Il referme la boucle : de la 8e étape, on revient à la 1re.'],
  [(x,y,lx,ly,t)=>t==='g'&&ly<50,'Grand pont','Il relie la place de la Donnée à la place de l’Énergie.'],
  [(x,y,lx,ly,t)=>t==='g','Pont du Sud','De la 4e à la 5e étape : la donnée fiable passe sur la rive Énergie.'],
  [(x,y,lx,ly,t)=>t==='r','Voie ferrée','Elle longe la ville par le nord.'],
  [(x,y,lx,ly,t)=>t==='R','Rivière','Elle sépare la rive Data (à l’est, étapes 1 à 4) de la rive Énergie (à l’ouest, étapes 5 à 8).'],
  [(x,y,lx,ly)=>lx>=WIND0&&lx<=WIND0+5&&ly>=L.wind.y0&&ly<=L.wind.y1,'Couloir du vent','Une trouée dans la forêt de l’est. Le vent y repousse les promeneurs.'],
  [(x,y,lx)=>lx>=WIND0&&lx<=WIND0+5,'Forêt de l’est','Une forêt épaisse. Derrière, on entend tourner quelque chose.'],
  [(x,y,lx)=>lx>WIND0+5,'Champ d’éoliennes','Au-delà de la forêt, là où le vent souffle le plus fort.']
];
function wmPlaceAt(x,y){
  const b=BLD.find(b=>x>=b.x&&x<b.x+b.w&&y>=b.y&&y<=b.door[1]);
  if(b){
    if(b.arena){const A=b.arena,st=wmArenaState(A),n=A.id;let d=`Étape ${QUARTERS[n].step}, ${QUARTERS[n].au}. ${A.champ} y remet le badge ${BLAB(A.badge)}.`,s;
      if(st===2)s=['ok',`Badge ${BLAB(A.badge)} obtenu`];else if(st===1){const k=missingReq().length;s=k?['go',`Ouverte : encore ${k} info${k>1?'s':''} clé${k>1?'s':''} à trouver avant d’entrer`]:['go','Ouverte : les dresseurs t’attendent']}
      else s=['no',n>1?`Fermée : il faut d’abord le badge ${BLAB(BADGES[n-2])}`:'Fermée : parle d’abord à Mme Joule'];
      return {t:A.name,d,s}}
    if(SITES[b.id])return {t:SITES[b.id].name,d:b.id===S.site?'Ton site : celui que tu suis tout au long de la boucle.':'L’un des trois sites de la ville.',s:b.id===S.site?['go','Ton site']:null};
    const w=WM_BLD[b.id];if(w)return {t:w[0],d:w[1]};
  }
  const tl=MAPS.town.g[y]&&MAPS.town.g[y][x],lp=(INVM[y]&&INVM[y][x])||[x,y];
  const sp=WM_SPOTS.find(([f])=>f(x,y,lp[0],lp[1],tl));if(sp)return {t:sp[1],d:sp[2]};
  if(tl==='b')return {t:'Piste cyclable',d:'La boucle fait le tour de la ville dans l’ordre des 8 étapes. Ici, tout le monde roule à vélo.'};
  const Q=quarterAt(x,y);
  if(Q){const open=quarterOpen(Q.n);
    return {t:Q.name,d:Q.step?`Décor : ${Q.reg}. Étape ${Q.step} : on y trouve les infos clés de l’étape et l’${ARENAS[Q.n-1].name}.`:`Décor : ${Q.reg}. ${Q.sub}.`,
      s:open?['ok','Quartier ouvert']:['no',Q.step?`Quartier fermé : il s’ouvre avec le badge ${BLAB(BADGES[Q.n-2])}`:'Quartier fermé : il s’ouvre avec le badge Structurer']}}
  return {t:'Ampère-sur-Loire',d:'Les abords de la ville : des arbres, de l’herbe, et pas une voiture.'};
}
/* ---- forme des quartiers : bandes à teinter, bords à tracer, emplacement du nom et du cadenas ---- */
let WMZ=null;
function wmZones(){
  if(WMZ)return WMZ;WMZ=QUARTERS.map(()=>({runs:[],edges:[],cx:0,cy:0,n:0,lab:[0,0]}));
  for(let y=0;y<TH;y++){let x=0;while(x<TW){const z=ZONE[y][x];let n=1;while(x+n<TW&&ZONE[y][x+n]===z)n++;if(z>=0){const Z=WMZ[z];Z.runs.push([x,y,n]);Z.cx+=(x+n/2)*n;Z.cy+=(y+.5)*n;Z.n+=n}x+=n}}
  for(let y=1;y<TH-1;y++)for(let x=1;x<TW-1;x++){const z=ZONE[y][x];if(z<0)continue;[[0,-1],[0,1],[-1,0],[1,0]].forEach(([dx,dy],d)=>{if(ZONE[y+dy][x+dx]!==z)WMZ[z].edges.push([x,y,d])})}
  QUARTERS.forEach(Q=>{const Z=WMZ[Q.n];Z.cx/=Z.n||1;Z.cy/=Z.n||1;
    // le nom se pose dans un coin du quartier : la première case du quartier trouvée en partant de ce coin
    const low=WM_LOW[Q.n],p=LW(Q.r[0]+1,low?Q.r[3]-2:Q.r[1]+1);let best=null;Z.runs.forEach(([x,y,n])=>{for(let i=0;i<n;i++){const d=Math.abs(x+i-p[0])+Math.abs(y-p[1]);if(!best||d<best[2])best=[x+i,y,d]}});Z.lab=best?[best[0],best[1]]:p});
  return WMZ;
}
/* ---- fond de carte : la ville et son décor fixe ---- */
function wmBase(){
  if(!mapCache.town)buildMapCanvas('town');
  const src=mapCache.town,c=document.createElement('canvas');c.width=src.width;c.height=src.height;const x=c.getContext('2d');x.imageSmoothingEnabled=false;x.drawImage(src,0,0);
  const skip={npc:1,gate:1,none:1,legend:1,sheep:1,cat:1,derive:1,cbox:1,bin:1};
  objsFor('town').filter(o=>!skip[o.kind]&&!o.draw&&o.px===undefined).sort((a,b)=>a.y-b.y).forEach(o=>{try{drawObj(x,o,0,0,0)}catch(e){}});
  if(mapOver.town)x.drawImage(mapOver.town,0,0);
  return c;
}
/* ---- ouverture / fermeture ---- */
function openMap(){
  if(WM.open||busy||dlg.open||AR.lock)return;
  busy=true;clearKeys();WM.open=true;WM.k={};WM.q=[];WM.held=0;WM.last='';WM.ptr.clear();WM.drag=null;WM.pinch=null;
  if(!WM.sent){WM.sent=true;trk('setting',{k:'carte',v:true})}
  const el=document.createElement('div');el.className='wmap';el.setAttribute('role','dialog');el.setAttribute('aria-label','Carte de la ville');
  const touch=matchMedia('(pointer:coarse)').matches;
  el.innerHTML=`<canvas aria-hidden="true"></canvas>
    <div class="wm-top"><b>Carte d’Ampère-sur-Loire</b><span class="wm-btns"><button type="button" data-a="out" title="Dézoomer (touche -)" aria-label="Dézoomer">−</button><button type="button" data-a="in" title="Zoomer (touche + ou Espace)" aria-label="Zoomer">+</button><button type="button" data-a="me" title="Centrer sur toi">Moi</button><button type="button" data-a="obj" title="Aller au prochain repère : objectif ou info clé">Objectif</button><button type="button" data-a="x" class="wm-x" title="Fermer la carte (touche K)">Fermer</button></span></div>
    <div class="wm-bot"><div class="wm-info" aria-live="polite"></div>
      <div class="wm-leg"><span><i class="lg-me"></i>Toi</span><span><i class="lg-obj"></i>Objectif</span><span><i class="lg-inf">!</i>Info clé manquante</span><span><i class="lg-ar"></i>Arène</span><span><i class="lg-no"></i>Quartier fermé</span><span class="wm-hint">${touch?'Touche : pointer · Glisse : déplacer':'Flèches : curseur · Espace : zoom · K : fermer'}</span></div></div>`;
  $('wrap').appendChild(el);ROOT.querySelector('.qk-app').classList.add('wm-open');
  WM.el=el;WM.cv=el.querySelector('canvas');WM.c=WM.cv.getContext('2d');WM.base=wmBase();
  WM.av=document.createElement('canvas');WM.av.width=16;WM.av.height=20;drawChar(WM.av.getContext('2d'),0,3,'down',0,PAL[S.rank]);
  const p=wmPlayer();WM.cx=Math.round(p[0]);WM.cy=Math.round(p[1]);
  el.querySelectorAll('.wm-btns button').forEach(b=>b.onclick=e=>{e.currentTarget.blur();const a=b.dataset.a;if(a==='x')closeMap();else if(a==='in')wmZoom(1.5);else if(a==='out')wmZoom(1/1.5);else if(a==='me')wmGo(wmPlayer());else wmNextMark()});
  const cv=WM.cv;
  cv.addEventListener('pointerdown',e=>{e.preventDefault();try{cv.setPointerCapture(e.pointerId)}catch(_){}WM.ptr.set(e.pointerId,[e.offsetX,e.offsetY]);
    if(WM.ptr.size===1)WM.drag={x:e.offsetX,y:e.offsetY,vx:WM.vx,vy:WM.vy,moved:false};
    else if(WM.ptr.size===2){const a=[...WM.ptr.values()];WM.pinch={d:Math.hypot(a[0][0]-a[1][0],a[0][1]-a[1][1])||1,z:WM.z};WM.drag=null}});
  cv.addEventListener('pointermove',e=>{
    if(!WM.ptr.has(e.pointerId)){if(e.pointerType==='mouse')wmPoint(e.offsetX,e.offsetY);return}
    WM.ptr.set(e.pointerId,[e.offsetX,e.offsetY]);
    if(WM.pinch&&WM.ptr.size>=2){const a=[...WM.ptr.values()],d=Math.hypot(a[0][0]-a[1][0],a[0][1]-a[1][1])||1;wmSetZoom(WM.pinch.z*d/WM.pinch.d,(a[0][0]+a[1][0])/2,(a[0][1]+a[1][1])/2);return}
    const g=WM.drag;if(!g)return;const dx=e.offsetX-g.x,dy=e.offsetY-g.y;if(!g.moved&&Math.hypot(dx,dy)<6)return;g.moved=true;WM.vx=g.vx-dx/WM.z;WM.vy=g.vy-dy/WM.z;wmClamp()});
  const up=e=>{const had=WM.ptr.has(e.pointerId);WM.ptr.delete(e.pointerId);if(WM.ptr.size<2)WM.pinch=null;if(had&&WM.drag&&!WM.drag.moved&&e.type==='pointerup')wmPoint(e.offsetX,e.offsetY);if(!WM.ptr.size)WM.drag=null};
  cv.addEventListener('pointerup',up);cv.addEventListener('pointercancel',up);
  cv.addEventListener('wheel',e=>{e.preventDefault();wmSetZoom(WM.z*(e.deltaY<0?1.25:.8),e.offsetX,e.offsetY)},{passive:false});
  wmLayout(true);if(WM.zf<.22){WM.z=.22;wmFollow(.5)}WM.lt=0;qkRAF(wmLoop);
}
function closeMap(){
  if(!WM.open)return;WM.open=false;if(WM.el)WM.el.remove();WM.el=WM.cv=WM.c=WM.base=null;
  ROOT.querySelector('.qk-app').classList.remove('wm-open');busy=false;clearKeys();hud();
}
/* ---- géométrie : zoom, caméra ---- */
function wmLayout(reset){
  const el=WM.el,dpr=Math.min(2,(el.ownerDocument.defaultView||window).devicePixelRatio||1),w=el.clientWidth,h=el.clientHeight;
  const top=el.querySelector('.wm-top').offsetHeight,bot=el.querySelector('.wm-bot').offsetHeight;
  if(w!==WM.w||h!==WM.h||top!==WM.top||bot!==WM.bot||reset){if(w!==WM.w||h!==WM.h||reset){WM.cv.width=Math.round(w*dpr);WM.cv.height=Math.round(h*dpr)}WM.w=w;WM.h=h;WM.dpr=dpr;WM.top=top;WM.bot=bot;
    const zf=Math.min(w/WMW,(h-WM.top-WM.bot)/WMH);WM.zmax=Math.max(3,zf*4);if(reset||WM.z<zf||WM.z===WM.zf)WM.z=zf;WM.zf=zf;if(reset){WM.vx=WMW/2;WM.vy=WMH/2}wmClamp()}
}
const wmMidY=()=>WM.top+(WM.h-WM.top-WM.bot)/2;
const wmSX=wx=>(wx-WM.vx)*WM.z+WM.w/2,wmSY=wy=>(wy-WM.vy)*WM.z+wmMidY();
function wmClamp(){
  const hw=WM.w/2/WM.z,hh=(WM.h-WM.top-WM.bot)/2/WM.z;
  WM.vx=hw>=WMW/2?WMW/2:Math.max(hw,Math.min(WMW-hw,WM.vx));WM.vy=hh>=WMH/2?WMH/2:Math.max(hh,Math.min(WMH-hh,WM.vy));
}
function wmSetZoom(z,sx,sy){
  z=Math.max(WM.zf,Math.min(WM.zmax,z));if(sx===undefined){sx=wmSX(WM.cx*TS+8);sy=wmSY(WM.cy*TS+8)}
  const wx=(sx-WM.w/2)/WM.z+WM.vx,wy=(sy-wmMidY())/WM.z+WM.vy;WM.z=z;WM.vx=wx-(sx-WM.w/2)/z;WM.vy=wy-(sy-wmMidY())/z;wmClamp();
}
function wmZoom(f){wmFollow(.5);wmSetZoom(WM.z*f)}
function wmZoomCycle(){if(WM.z>=WM.zmax*.99)wmSetZoom(WM.zf);else wmZoom(1.6)}
function wmPoint(sx,sy){const x=Math.floor(((sx-WM.w/2)/WM.z+WM.vx)/TS),y=Math.floor(((sy-wmMidY())/WM.z+WM.vy)/TS);WM.cx=Math.max(0,Math.min(TW-1,x));WM.cy=Math.max(0,Math.min(TH-1,y))}
/* la caméra suit le curseur : il reste dans la partie centrale de l'écran */
function wmFollow(m){
  const mw=WM.w*(m===undefined?.2:m),mh=(WM.h-WM.top-WM.bot)*(m===undefined?.2:m),sx=wmSX(WM.cx*TS+8),sy=wmSY(WM.cy*TS+8),y0=WM.top,y1=WM.h-WM.bot;
  if(sx<mw)WM.vx-=(mw-sx)/WM.z;else if(sx>WM.w-mw)WM.vx+=(sx-(WM.w-mw))/WM.z;
  if(sy<y0+mh)WM.vy-=(y0+mh-sy)/WM.z;else if(sy>y1-mh)WM.vy+=(sy-(y1-mh))/WM.z;wmClamp();
}
function wmGo(p){WM.cx=Math.max(0,Math.min(TW-1,Math.round(p[0])));WM.cy=Math.max(0,Math.min(TH-1,Math.round(p[1])));if(WM.z<=WM.zf*1.01&&WM.zf<.6)wmSetZoom(Math.min(WM.zmax,Math.max(1,WM.zf*2)));wmFollow(.5)}
function wmMarks(){const I=wmInfos(),T=wmTargets().filter(([x,y])=>!I.some(i=>i.x===x&&i.y===y));return I.map(i=>[i.x,i.y]).concat(T)}
function wmNextMark(){const M=wmMarks();if(!M.length){toast('Aucun repère d’objectif sur la carte pour le moment.');return}WM.oi=(WM.oi||0)%M.length;wmGo(M[WM.oi]);WM.oi++}
/* ---- boucle d'affichage ---- */
function wmLoop(now){
  if(!WM.open)return;const dt=WM.lt?Math.min(.1,(now-WM.lt)/1000):.016;WM.lt=now;WM.t+=dt;
  wmLayout(false);
  // curseur : un appui = une case ; une touche maintenue fait glisser le curseur, de plus en plus vite
  const K=WM.k,kb=K.right||K.left||K.up||K.down,cl=()=>{WM.cx=Math.max(0,Math.min(TW-1,WM.cx));WM.cy=Math.max(0,Math.min(TH-1,WM.cy))};
  let mv=false;while(WM.q.length){const d=DIRS[WM.q.shift()];WM.cx+=d[0];WM.cy+=d[1];mv=true}
  const dx=kb?((K.right?1:0)-(K.left?1:0)):((keys.right?1:0)-(keys.left?1:0)),dy=kb?((K.down?1:0)-(K.up?1:0)):((keys.down?1:0)-(keys.up?1:0));
  if(dx||dy){if(!WM.held&&!kb){WM.cx+=dx;WM.cy+=dy;mv=true}
    WM.held+=dt;if(WM.held>.25){const sp=(WM.held>.8?26:12)/Math.max(.6,Math.min(2,WM.z));WM.fx=Math.max(0,Math.min(TW-1,WM.fx+dx*sp*dt));WM.fy=Math.max(0,Math.min(TH-1,WM.fy+dy*sp*dt));WM.cx=Math.round(WM.fx);WM.cy=Math.round(WM.fy);mv=true}else{cl();WM.fx=WM.cx;WM.fy=WM.cy}}
  else{WM.held=0;cl();WM.fx=WM.cx;WM.fy=WM.cy}
  if(mv){cl();wmFollow()}
  try{wmDraw();wmInfo()}catch(e){if(!WM.err){WM.err=1;console.error(e)}}
  qkRAF(wmLoop);
}
function wmPill(c,txt,x,y,bg,fg,al){c.font='16px Unifont,monospace';const w=Math.ceil(c.measureText(txt).width)+10;const X=al==='c'?Math.round(x-w/2):Math.round(x);c.fillStyle=bg;c.fillRect(X,Math.round(y),w,20);c.fillStyle=fg;c.textBaseline='middle';c.textAlign='left';c.fillText(txt,X+5,Math.round(y)+10);return w}
function wmLock(c,x,y,s){c.fillStyle='#f7f0dc';c.fillRect(x-4*s,y-1*s,8*s,7*s);c.fillRect(x-3*s,y-5*s,1.5*s,4*s);c.fillRect(x+1.5*s,y-5*s,1.5*s,4*s);c.fillRect(x-3*s,y-6*s,6*s,1.5*s);c.fillStyle='#1c2440';c.fillRect(x-.75*s,y+1*s,1.5*s,3*s)}
function wmDraw(){
  const c=WM.c,z=WM.z,w=WM.w,h=WM.h,t=WM.t;c.setTransform(WM.dpr,0,0,WM.dpr,0,0);
  c.fillStyle='#0b1020';c.fillRect(0,0,w,h);
  c.imageSmoothingEnabled=z<1;c.imageSmoothingQuality='high';
  const X0=wmSX(0),Y0=wmSY(0);c.drawImage(WM.base,Math.round(X0),Math.round(Y0),Math.round(WMW*z),Math.round(WMH*z));
  // rives
  const small=z<.42;
  if(!small){const y=Y0+4;wmPill(c,'RIVE ÉNERGIE',wmSX(22*TS),y,'rgba(19,26,43,.82)','#f2a33a','c');wmPill(c,'RIVE DATA',wmSX(68*TS),y,'rgba(19,26,43,.82)','#8fd0f0','c')}
  // quartiers : la teinte suit la forme réelle de chaque quartier ; fermé = grisé, avec un cadenas
  const ZR=wmZones(),tx=v=>Math.round(X0+v*TS*z),ty=v=>Math.round(Y0+v*TS*z);
  QUARTERS.forEach(Q=>{const Z=ZR[Q.n],open=quarterOpen(Q.n);
    if(open){c.globalAlpha=.14;c.fillStyle=Q.col}else c.fillStyle='rgba(14,18,34,.68)';
    Z.runs.forEach(([x,y,n])=>c.fillRect(tx(x),ty(y),tx(x+n)-tx(x),ty(y+1)-ty(y)));c.globalAlpha=1;
    c.fillStyle=open?Q.col:'#6d7896';const th=small?1:2;
    Z.edges.forEach(([x,y,d])=>{const a=tx(x),b=ty(y),w=tx(x+1)-a,h=ty(y+1)-b;if(d===0)c.fillRect(a,b,w,th);else if(d===1)c.fillRect(a,b+h-th,w,th);else if(d===2)c.fillRect(a,b,th,h);else c.fillRect(a+w-th,b,th,h)})});
  QUARTERS.forEach(Q=>{const Z=ZR[Q.n],open=quarterOpen(Q.n),qw=(Q.r[2]-Q.r[0]+1)*TS*z;
    if(!open)wmLock(c,wmSX(Z.cx*TS),wmSY(Z.cy*TS)+(small?0:6),small?1.5:2.5);
    const x=Math.round(wmSX(Z.lab[0]*TS)),y=Math.round(wmSY(Z.lab[1]*TS));
    if(Q.step){const r=small?8:11;c.fillStyle=open?Q.col:'#59627c';c.beginPath();c.arc(x+r+3,y+r+3,r,0,7);c.fill();c.strokeStyle='#f7f0dc';c.lineWidth=1.5;c.stroke();
      regEmblem(c,REG[Q.n],x+r+3-(small?5:10),y+r+3-(small?4:9),'#fff',small?1:2);
      if(!small){c.font='16px Unifont,monospace';const nm=WM_SHORT[Q.n];if(c.measureText(nm).width+2*r+14<qw*1.7)wmPill(c,nm,x+2*r+7,y+4,'rgba(19,26,43,.82)','#f7f0dc')}}
    else if(!small){c.font='16px Unifont,monospace';if(c.measureText(Q.name).width+16<qw)wmPill(c,Q.name,x+4,y+4,'rgba(19,26,43,.82)','#f7f0dc')}});
  // arènes et badges
  const bob=Math.sin(t*5)*2,pulse=.5+.5*Math.sin(t*6);
  ARENAS.forEach(A=>{const b=A.b,st=wmArenaState(A),s=small?1:2,x=Math.round(wmSX((b.x+b.w/2)*TS)),y=Math.round(wmSY((b.y+b.h/2)*TS)),r=8*s+3;
    if(st===1){c.strokeStyle=`rgba(242,163,58,${.35+.65*pulse})`;c.lineWidth=3;c.beginPath();c.arc(x,y,r+3+pulse*3,0,7);c.stroke()}
    c.fillStyle=st===2?'#c9a227':st===1?'#f2a33a':'#59627c';c.beginPath();c.arc(x,y,r,0,7);c.fill();c.fillStyle='#131a2b';c.beginPath();c.arc(x,y,r-2,0,7);c.fill();
    c.imageSmoothingEnabled=false;c.globalAlpha=st?1:.35;c.drawImage(badgeCanvas(A.id),x-8*s,y-8*s,16*s,16*s);c.globalAlpha=1;
    if(st===2){const k=small?5:7;c.fillStyle='#2f9e4a';c.beginPath();c.arc(x+r-2,y+r-2,k,0,7);c.fill();c.strokeStyle='#fff';c.lineWidth=2;c.beginPath();c.moveTo(x+r-2-k*.5,y+r-2);c.lineTo(x+r-2-k*.1,y+r-2+k*.4);c.lineTo(x+r-2+k*.55,y+r-2-k*.4);c.stroke()}});
  // infos clés manquantes
  const I=wmInfos();
  I.forEach(i=>{const x=Math.round(wmSX(i.x*TS+8)),y=Math.round(wmSY(i.y*TS)-14+bob),k=small?7:10;
    c.fillStyle='#f2a33a';c.fillRect(x-k-2,y-k-2,2*k+4,2*k+4);c.fillStyle='#fffaf0';c.fillRect(x-k,y-k,2*k,2*k);c.fillStyle='#f2a33a';c.beginPath();c.moveTo(x-4,y+k+2);c.lineTo(x+4,y+k+2);c.lineTo(x,y+k+7);c.fill();
    c.fillStyle='#c43d3d';if(small){c.fillRect(x-1,y-5,2,6);c.fillRect(x-1,y+3,2,2)}else{c.fillRect(x-1.5,y-7,3,9);c.fillRect(x-1.5,y+4,3,3)}});
  // objectif
  wmTargets().filter(([x,y])=>!I.some(i=>i.x===x&&i.y===y)).forEach(([tx,ty])=>{const x=wmSX(tx*TS+8),y=wmSY(ty*TS)-6+bob,k=small?8:12;
    c.fillStyle='#f2a33a';c.strokeStyle='#131a2b';c.lineWidth=2;c.beginPath();c.moveTo(x-k,y-k*1.4);c.lineTo(x+k,y-k*1.4);c.lineTo(x,y);c.closePath();c.fill();c.stroke()});
  // toi
  {const p=wmPlayer(),x=Math.round(wmSX(p[0]*TS+8)),y=Math.round(wmSY(p[1]*TS+8)),s=small?1:2;
    c.strokeStyle=`rgba(255,255,255,${.4+.6*pulse})`;c.lineWidth=2;c.beginPath();c.arc(x,y,9*s+2+pulse*3,0,7);c.stroke();c.fillStyle='rgba(19,26,43,.75)';c.beginPath();c.arc(x,y,9*s+1,0,7);c.fill();
    c.imageSmoothingEnabled=false;c.drawImage(WM.av,x-8*s,y-11*s,16*s,20*s);if(!small)wmPill(c,'TOI',x,y+9*s+5,'#f7f0dc','#131a2b','c')}
  // curseur
  {const s=Math.max(TS*z,16),x=Math.round(wmSX(WM.cx*TS+8)-s/2),y=Math.round(wmSY(WM.cy*TS+8)-s/2),g=3+Math.round((Math.sin(t*7)+1)*1.5),l=Math.max(5,Math.round(s*.4));
    const br=(col,o,th)=>{c.fillStyle=col;const x1=x+s+g,y1=y+s+g,x0=x-g,y0=y-g;[[x0,y0,l,th],[x0,y0,th,l],[x1-l,y0,l,th],[x1-th,y0,th,l],[x0,y1-th,l,th],[x0,y1-l,th,l],[x1-l,y1-th,l,th],[x1-th,y1-l,th,l]].forEach(([a,b,w2,h2])=>c.fillRect(a-o,b-o,w2+2*o,h2+2*o))};
    br('#131a2b',1,3);br('#fff',0,3)}
}
function wmInfo(){
  const k=WM.cx+','+WM.cy+','+S.ch+','+missingReq().length;if(k===WM.last)return;WM.last=k;
  const p=wmPlaceAt(WM.cx,WM.cy),near=(x,y)=>Math.abs(x-WM.cx)<=1&&Math.abs(y-WM.cy)<=2,N=[];
  const I=wmInfos();I.filter(i=>near(i.x,i.y)).forEach(i=>N.push(['go','Info clé à récupérer : '+i.where]));
  if(wmTargets().some(([x,y])=>near(x,y)&&!I.some(i=>i.x===x&&i.y===y)))N.push(['go','Ton objectif est ici']);
  const me=wmPlayer();if(near(Math.round(me[0]),Math.round(me[1])))N.push(['me','Tu es ici']);
  if(p.s)N.unshift(p.s);
  WM.el.querySelector('.wm-info').innerHTML=`<b>${esc(p.t)}</b><span>${esc(p.d)}</span>${N.length?'<div class="wm-tags">'+N.map(([c,t])=>`<em class="${c}">${esc(t)}</em>`).join('')+'</div>':''}`;
}
/* ---- clavier ---- */
onKey('keydown',e=>{
  const tag=(((e.composedPath&&e.composedPath()[0])||e.target).tagName||'').toLowerCase();if(tag==='input'||tag==='select'||tag==='textarea')return;
  if(e.ctrlKey||e.metaKey||e.altKey)return;const key=(e.key||'').toLowerCase();
  if(!WM.open){if(key==='k'&&!e.repeat&&!QK_HOST.hidden){e.preventDefault();openMap()}return}
  const d=KEYMAP[e.code]||KEYMAP[e.key];
  if(d){if(!e.repeat&&!WM.k[d])WM.q.push(d);WM.k[d]=1;e.preventDefault();return}
  if(key==='k'||key==='m'||key==='escape'){e.preventDefault();if(!e.repeat)qkTimeout(closeMap,0);return}
  if(e.code==='Space'||key==='enter'||e.code==='KeyE'){e.preventDefault();if(!e.repeat)wmZoomCycle();return}
  if(key==='+'||key==='='||e.code==='NumpadAdd'){e.preventDefault();wmZoom(1.5);return}
  if(key==='-'||key==='_'||e.code==='NumpadSubtract'){e.preventDefault();wmZoom(1/1.5)}
});
onKey('keyup',e=>{const d=KEYMAP[e.code]||KEYMAP[e.key];if(d)WM.k[d]=0});
addEventListener('blur',()=>{WM.k={}});
$('mapBtn').onclick=e=>{e.currentTarget.blur();if(WM.open)closeMap();else openMap()};
