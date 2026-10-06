/* Wattlings · jeu/interface/carte.js
   La carte (touche K) : la ville, ses quartiers, ses arènes, l'objectif, le zoom.
   Une fois la gare rouverte, on peut dézoomer jusqu'à la carte du pays, puis zoomer sur un site pour voir son plan :
   ces cartes-là sont décrites dans voyages/atlas.js. Ici : la carte de la ville, et la mécanique commune (zoom, curseur, passage d'une carte à l'autre). */

/* ================= CARTE DE LA VILLE : consultation seule (touche K, bouton CARTE, onglet du menu) =================
   Un curseur se déplace sur toute la ville ; l'encart du bas dit à quoi correspond l'endroit pointé.
   Repères : toi, ton objectif, les arènes et leurs badges, les infos clés qui te manquent. Quartiers fermés : grisés, avec un cadenas. */
const WM={q:[],open:false,el:null,cv:null,c:null,base:null,av:null,cx:0,cy:0,z:1,zf:1,vx:0,vy:0,k:{},held:0,t:0,ptr:new Map(),drag:null,pinch:null,w:0,h:0,top:0,bot:0,last:'',oi:0,sent:false,lt:0,
  lieu:'town',L:null,W:0,H:0,tw:0,th:0,ts:16,anim:null};   // lieu : la carte affichée ; L : sa description ; W, H : sa taille en pixels ; tw, th, ts : la grille du curseur
const WMW=TW*TS,WMH=TH*TS;
const WM_LOW={3:1,5:1,6:1},WM_SHORT={1:'Puy du Cadastre',2:'Cité des Beffrois',3:'Clos du Tamis',4:'Colombages',5:'Coteaux des Courbes',6:'Anse du Veilleur',7:'Mas du Soleil',8:'Alpage de la Preuve'};
const wmCap=s=>s.charAt(0).toUpperCase()+s.slice(1);
/* où est le joueur sur la carte de la ville ; null s'il est parti en train */
function wmPlayer(){
  if(S.map==='town')return [P.px/TS,P.py/TS];
  const m=S.map;let d;
  if(wmIci()!=='town')return null;
  if(m==='office')d=doorOf('office');else if(m==='mairie')d=doorOf('mairie');else if(m==='gare')d=doorOf('gare');else if(m==='local')d=doorOf(S.inside==='villaUp'?'villa':S.inside);else if(MAPS[m]&&MAPS[m].arena)d=MAPS[m].arena.b.door;else d=doorOf(S.site);
  return [d[0],d[1]];
}
function wmInfos(){
  return missingReq().map(f=>{const s=SRC[f.src];let p;
    if(f.src==='tech')p=L.park.gate;else if(s.map==='mairie')p=doorOf('mairie');else if(s.map==='office')p=doorOf('office');else if(s.ins)p=doorOf(s.ins);else if(s.map==='town'&&s.x!==undefined)p=[s.x,s.y];else p=doorOf(S.site);
    return {x:p[0],y:p[1],where:s.where}});
}
function wmTargets(){if(wmIci()!=='town')return [];const m=S.map,i=S.inside;let T=[];S.map='town';S.inside=null;try{T=AR.lock?[]:(targets()||[])}catch(e){}S.map=m;S.inside=i;return T}
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
    if(b.id==='gare'&&wmEtages())return atlasGare();
    const w=WM_BLD[b.id];if(w)return {t:w[0],d:w[1]};
  }
  const tl=MAPS.town.g[y]&&MAPS.town.g[y][x],lp=(INVM[y]&&INVM[y][x])||[x,y];
  if(tl==='q'&&wmEtages())return atlasGare(1);
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
/* ================= LES LIEUX DE LA CARTE =================
   La carte montre un lieu à la fois. La ville est décrite ici ; le pays et les sites visités en train le sont dans voyages/atlas.js (atlasLieu).
   Un lieu : { titre(), W, H : sa taille en pixels, ts : la taille d'une case du curseur, base() : son image de fond,
               depart() : la case où poser le curseur, moi() : la case du joueur (null s'il n'y est pas), legende() : la légende du bas }
   et, pour les lieux de voyages/atlas.js : zmax(zf), dessiner(c,t), info(), reperes(), et pour le pays : aimant, sauter, entrer, zoomer, place, caseDe. */
const WM_VILLE={
  titre:()=>'Carte d’Ampère-sur-Loire',W:WMW,H:WMH,ts:TS,base:wmBase,
  depart:()=>wmPlayer()||doorOf('gare'),moi:()=>wmPlayer(),
  legende:()=>'<span><i class="lg-me"></i>Toi</span><span><i class="lg-obj"></i>Objectif</span><span><i class="lg-inf">!</i>Info clé manquante</span><span><i class="lg-ar"></i>Arène</span><span><i class="lg-no"></i>Quartier fermé</span>'
};
/* une fois la gare rouverte, la carte a plusieurs étages : la ville, le pays, les sites */
const wmEtages=()=>typeof voyOuvert==='function'&&typeof atlasLieu==='function'&&voyOuvert();
const wmLieu=id=>(id!=='town'&&typeof atlasLieu==='function'&&atlasLieu(id))||WM_VILLE;
/* le lieu où se trouve le joueur : la ville (y compris ses bâtiments et sa gare), ou le site où le train l'a déposé */
const wmIci=()=>{const m=MAPS[S.map];return m&&m.voy&&typeof atlasLieu==='function'&&atlasLieu(S.map)?S.map:'town'};
const wmCalme=()=>{try{return matchMedia('(prefers-reduced-motion: reduce)').matches}catch(e){return false}};

/* ---- ouverture / fermeture ---- */
function openMap(){
  if(WM.open||busy||dlg.open||AR.lock)return;
  busy=true;clearKeys();WM.open=true;WM.k={};WM.q=[];WM.held=0;WM.last='';WM.ptr.clear();WM.drag=null;WM.pinch=null;WM.anim=null;
  if(!WM.sent){WM.sent=true;trk('setting',{k:'carte',v:true})}
  const el=document.createElement('div');el.className='wmap';el.setAttribute('role','dialog');el.setAttribute('aria-label',wmEtages()?'Carte':'Carte de la ville');
  el.innerHTML=`<canvas aria-hidden="true"></canvas>
    <div class="wm-top"><b></b><span class="wm-btns">${wmEtages()?'<button type="button" data-a="pays" title="Dézoomer jusqu’à la carte du pays">Pays</button>':''}<button type="button" data-a="out" title="Dézoomer (touche -)" aria-label="Dézoomer">−</button><button type="button" data-a="in" title="Zoomer (touche + ou Espace)" aria-label="Zoomer">+</button><button type="button" data-a="me" title="Centrer sur toi">Moi</button><button type="button" data-a="obj" title="Aller au prochain repère : objectif ou info clé">Objectif</button><button type="button" data-a="x" class="wm-x" title="Fermer la carte (touche K)">Fermer</button></span></div>
    <div class="wm-bot"><div class="wm-info" aria-live="polite"></div>
      <div class="wm-leg"></div></div>`;
  $('wrap').appendChild(el);ROOT.querySelector('.qk-app').classList.add('wm-open');
  WM.el=el;WM.cv=el.querySelector('canvas');WM.c=WM.cv.getContext('2d');
  WM.av=document.createElement('canvas');WM.av.width=16;WM.av.height=20;drawChar(WM.av.getContext('2d'),0,3,'down',0,PAL[S.rank]);
  el.querySelectorAll('.wm-btns button').forEach(b=>b.onclick=e=>{e.currentTarget.blur();if(WM.anim)return;const a=b.dataset.a;if(a==='x')closeMap();else if(a==='in')wmZoom(1.5);else if(a==='out')wmZoom(1/1.5);else if(a==='me')wmMoi();else if(a==='pays')wmVers('pays');else wmNextMark()});
  const cv=WM.cv;
  cv.addEventListener('pointerdown',e=>{e.preventDefault();if(WM.anim)return;try{cv.setPointerCapture(e.pointerId)}catch(_){}WM.ptr.set(e.pointerId,[e.offsetX,e.offsetY]);
    if(WM.ptr.size===1)WM.drag={x:e.offsetX,y:e.offsetY,vx:WM.vx,vy:WM.vy,moved:false};
    else if(WM.ptr.size===2){const a=[...WM.ptr.values()];WM.pinch={d:Math.hypot(a[0][0]-a[1][0],a[0][1]-a[1][1])||1,z:WM.z};WM.drag=null}});
  cv.addEventListener('pointermove',e=>{
    if(WM.anim)return;
    if(!WM.ptr.has(e.pointerId)){if(e.pointerType==='mouse')wmPoint(e.offsetX,e.offsetY);return}
    WM.ptr.set(e.pointerId,[e.offsetX,e.offsetY]);
    if(WM.pinch&&WM.ptr.size>=2){const a=[...WM.ptr.values()],d=Math.hypot(a[0][0]-a[1][0],a[0][1]-a[1][1])||1;wmSetZoom(WM.pinch.z*d/WM.pinch.d,(a[0][0]+a[1][0])/2,(a[0][1]+a[1][1])/2);return}
    const g=WM.drag;if(!g)return;const dx=e.offsetX-g.x,dy=e.offsetY-g.y;if(!g.moved&&Math.hypot(dx,dy)<6)return;g.moved=true;WM.vx=g.vx-dx/WM.z;WM.vy=g.vy-dy/WM.z;wmClamp()});
  const up=e=>{const had=WM.ptr.has(e.pointerId);WM.ptr.delete(e.pointerId);if(WM.ptr.size<2)WM.pinch=null;if(had&&WM.drag&&!WM.drag.moved&&e.type==='pointerup'&&!WM.anim)wmTape(e.offsetX,e.offsetY);if(!WM.ptr.size)WM.drag=null};
  cv.addEventListener('pointerup',up);cv.addEventListener('pointercancel',up);
  cv.addEventListener('wheel',e=>{e.preventDefault();wmSetZoom(WM.z*(e.deltaY<0?1.25:.8),e.offsetX,e.offsetY)},{passive:false});
  wmEntrer(wmIci());WM.lt=0;qkRAF(wmLoop);
}
function closeMap(){
  if(!WM.open)return;WM.open=false;WM.anim=null;if(WM.el)WM.el.remove();WM.el=WM.cv=WM.c=WM.base=null;
  ROOT.querySelector('.qk-app').classList.remove('wm-open');busy=false;clearKeys();hud();
}
/* ---- afficher un lieu : la ville, le pays ou un site ---- */
function wmEntrer(id,o){
  o=o||{};const L=wmLieu(id);if(L===WM_VILLE)id='town';
  WM.lieu=id;WM.L=L;WM.W=L.W;WM.H=L.H;WM.ts=L.ts;WM.tw=Math.ceil(L.W/L.ts);WM.th=Math.ceil(L.H/L.ts);
  WM.base=o.base||L.base();WM.last='';WM.oi=0;WM.held=0;WM.q=[];
  if(id==='pays'&&!WM.sentPays){WM.sentPays=true;trk('setting',{k:'carte_pays',v:true})}
  const el=WM.el,touch=matchMedia('(pointer:coarse)').matches,et=wmEtages();
  el.querySelector('.wm-top b').textContent=L.titre();
  const bp=el.querySelector('[data-a=pays]');if(bp){bp.hidden=id==='pays';bp.classList.toggle('wm-neuf',typeof atlasNouveau==='function'&&atlasNouveau())}
  const hint=id==='pays'?(touch?'Touche un lieu, puis touche-le encore pour voir sa carte':'Flèches : lieu suivant · Espace ou + : voir sa carte · K : fermer')
    :touch?'Touche : pointer · Glisse : déplacer'+(et?' · − : voir le pays':''):'Flèches : curseur · Espace : zoom · '+(et?'− : voir le pays · ':'')+'K : fermer';
  el.querySelector('.wm-leg').innerHTML=L.legende()+`<span class="wm-hint">${hint}</span>`;
  const p=o.curseur||L.depart();WM.cx=Math.round(p[0]);WM.cy=Math.round(p[1]);WM.fx=WM.cx;WM.fy=WM.cy;
  wmLayout(true);if(id==='town'&&WM.zf<.22){WM.z=.22;wmFollow(.5)}
}
/* ---- changer de lieu : on dézoome de la ville ou d'un site vers le pays, on zoome du pays vers un lieu ----
   Le temps du passage, on regarde la carte du pays de très près : le lieu y rétrécit jusqu'à n'être plus qu'un point (ou l'inverse). */
function wmVers(id){
  if(WM.anim||id===WM.lieu||!wmEtages())return;
  WM.ptr.clear();WM.drag=WM.pinch=null;WM.k={};WM.q=[];
  const de=WM.lieu;if(de!=='pays'&&id!=='pays'){wmEntrer(id);return}
  const sortie=id==='pays',detail=sortie?de:id,PA=wmLieu('pays'),D=wmLieu(detail),s=PA.place(detail);
  if(!s||wmCalme()){wmEntrer(id,sortie?{curseur:PA.caseDe(detail)}:null);return}
  const hh=WM.h-WM.top-WM.bot,img=sortie?WM.base:D.base(),pimg=sortie?PA.base():WM.base;
  let zD=sortie?WM.z:Math.min(WM.w/D.W,hh/D.H);if(!sortie&&detail==='town'&&zD<.22)zD=.22;
  const zP=sortie?Math.min(WM.w/PA.W,hh/PA.H):WM.z,cP=sortie?[PA.W/2,PA.H/2]:[WM.vx,WM.vy];
  const off0=sortie?[wmSX(D.W/2)-WM.w/2,wmSY(D.H/2)-wmMidY()]:[0,0];
  WM.anim={t:0,d:.6,sortie,detail,img,pimg,s,rw:PA.empreinte,rh:PA.empreinte*D.H/D.W,z0:zD*D.W/PA.empreinte,zP,cP,off0,PA};
  WM.lieu='pays';WM.L=PA;WM.W=PA.W;WM.H=PA.H;WM.ts=PA.ts;WM.tw=Math.ceil(PA.W/PA.ts);WM.th=Math.ceil(PA.H/PA.ts);WM.base=pimg;
  const k=PA.caseDe(detail);WM.cx=k[0];WM.cy=k[1];WM.el.querySelector('.wm-top b').textContent=(sortie?PA:D).titre();WM.last='';wmInfo();
}
function wmAnime(dt){
  const A=WM.anim;A.t+=dt;const f=Math.min(1,A.t/A.d),e=f*f*(3-2*f),u=A.sortie?e:1-e,z=A.z0*Math.pow(A.zP/A.z0,u),lim=v=>Math.max(0,Math.min(1,v));
  const ox=A.off0[0]*(1-u)+(A.s[0]-A.cP[0])*A.zP*u,oy=A.off0[1]*(1-u)+(A.s[1]-A.cP[1])*A.zP*u;
  WM.z=z;WM.vx=A.s[0]-ox/z;WM.vy=A.s[1]-oy/z;
  const c=WM.c;c.setTransform(WM.dpr,0,0,WM.dpr,0,0);c.fillStyle='#0b1020';c.fillRect(0,0,WM.w,WM.h);
  // le pays, d'abord flou et tout proche, puis entier
  c.imageSmoothingEnabled=z<1;c.globalAlpha=lim(u*2.5);
  {const X0=wmSX(0),Y0=wmSY(0),W=A.PA.W,H=A.PA.H,x0=Math.max(0,Math.floor(-X0/z)),y0=Math.max(0,Math.floor(-Y0/z)),x1=Math.min(W,Math.ceil((WM.w-X0)/z)),y1=Math.min(H,Math.ceil((WM.h-Y0)/z));
    if(x1>x0&&y1>y0)c.drawImage(A.pimg,x0,y0,x1-x0,y1-y0,X0+x0*z,Y0+y0*z,(x1-x0)*z,(y1-y0)*z)}
  const a=lim((u-.55)/.45);if(a>0){c.globalAlpha=a;A.PA.dessiner(c,WM.t)}
  // le lieu, qui rétrécit jusqu'à son point sur la carte
  const dw=A.rw*z,dh=A.rh*z;c.globalAlpha=1-lim((u-.3)/.5);c.imageSmoothingEnabled=dw<A.img.width;c.drawImage(A.img,wmSX(A.s[0])-dw/2,wmSY(A.s[1])-dh/2,dw,dh);c.globalAlpha=1;
  if(f>=1){WM.anim=null;if(A.sortie)wmEntrer('pays',{curseur:A.PA.caseDe(A.detail),base:A.pimg});else wmEntrer(A.detail,{base:A.img})}
}
/* ---- géométrie : zoom, caméra ---- */
function wmLayout(reset){
  const el=WM.el,dpr=Math.min(2,(el.ownerDocument.defaultView||window).devicePixelRatio||1),w=el.clientWidth,h=el.clientHeight;
  const top=el.querySelector('.wm-top').offsetHeight,bot=el.querySelector('.wm-bot').offsetHeight;
  if(w!==WM.w||h!==WM.h||top!==WM.top||bot!==WM.bot||reset){if(w!==WM.w||h!==WM.h||reset){WM.cv.width=Math.round(w*dpr);WM.cv.height=Math.round(h*dpr)}WM.w=w;WM.h=h;WM.dpr=dpr;WM.top=top;WM.bot=bot;
    const zf=Math.min(w/WM.W,(h-WM.top-WM.bot)/WM.H);WM.zmax=WM.L.zmax?WM.L.zmax(zf):Math.max(3,zf*4);if(reset||WM.z<zf||WM.z===WM.zf)WM.z=zf;WM.zf=zf;if(reset){WM.vx=WM.W/2;WM.vy=WM.H/2}wmClamp()}
}
const wmMidY=()=>WM.top+(WM.h-WM.top-WM.bot)/2;
const wmSX=wx=>(wx-WM.vx)*WM.z+WM.w/2,wmSY=wy=>(wy-WM.vy)*WM.z+wmMidY();
/* le centre de la case du curseur, à l'écran */
const wmCX=()=>wmSX((WM.cx+.5)*WM.ts),wmCY=()=>wmSY((WM.cy+.5)*WM.ts);
function wmClamp(){
  const hw=WM.w/2/WM.z,hh=(WM.h-WM.top-WM.bot)/2/WM.z;
  WM.vx=hw>=WM.W/2?WM.W/2:Math.max(hw,Math.min(WM.W-hw,WM.vx));WM.vy=hh>=WM.H/2?WM.H/2:Math.max(hh,Math.min(WM.H-hh,WM.vy));
}
function wmSetZoom(z,sx,sy){
  if(WM.anim)return;if(sx===undefined){sx=wmCX();sy=wmCY()}
  // au-delà des limites, on change de carte : dézoomer encore mène au pays ; zoomer encore sur un lieu du pays ouvre sa carte
  if(wmEtages()){
    if(WM.lieu!=='pays'&&z<WM.zf*.82&&WM.z<=WM.zf*1.001){wmVers('pays');return}
    if(WM.L.zoomer&&z>WM.zmax*1.15&&WM.z>=WM.zmax*.999&&WM.L.zoomer(sx,sy))return}
  z=Math.max(WM.zf,Math.min(WM.zmax,z));
  const wx=(sx-WM.w/2)/WM.z+WM.vx,wy=(sy-wmMidY())/WM.z+WM.vy;WM.z=z;WM.vx=wx-(sx-WM.w/2)/z;WM.vy=wy-(sy-wmMidY())/z;wmClamp();
}
function wmZoom(f){if(WM.anim)return;if(f>1&&WM.L.entrer&&WM.L.entrer())return;wmFollow(.5);wmSetZoom(WM.z*f)}
function wmZoomCycle(){if(WM.anim)return;if(WM.L.entrer&&WM.L.entrer())return;if(WM.z>=WM.zmax*.99)wmSetZoom(WM.zf);else wmZoom(1.6)}
function wmPoint(sx,sy){
  const wx=(sx-WM.w/2)/WM.z+WM.vx,wy=(sy-wmMidY())/WM.z+WM.vy;let p=[Math.floor(wx/WM.ts),Math.floor(wy/WM.ts)];if(WM.L.aimant)p=WM.L.aimant(wx,wy)||p;
  WM.cx=Math.max(0,Math.min(WM.tw-1,p[0]));WM.cy=Math.max(0,Math.min(WM.th-1,p[1]))}
/* un appui bref : on pointe ; sur la carte du pays, appuyer sur le lieu déjà pointé ouvre sa carte */
function wmTape(sx,sy){const avant=WM.cx+','+WM.cy;wmPoint(sx,sy);if(WM.L.entrer&&avant===WM.cx+','+WM.cy)WM.L.entrer()}
/* la caméra suit le curseur : il reste dans la partie centrale de l'écran */
function wmFollow(m){
  const mw=WM.w*(m===undefined?.2:m),mh=(WM.h-WM.top-WM.bot)*(m===undefined?.2:m),sx=wmCX(),sy=wmCY(),y0=WM.top,y1=WM.h-WM.bot;
  if(sx<mw)WM.vx-=(mw-sx)/WM.z;else if(sx>WM.w-mw)WM.vx+=(sx-(WM.w-mw))/WM.z;
  if(sy<y0+mh)WM.vy-=(y0+mh-sy)/WM.z;else if(sy>y1-mh)WM.vy+=(sy-(y1-mh))/WM.z;wmClamp();
}
function wmGo(p){WM.cx=Math.max(0,Math.min(WM.tw-1,Math.round(p[0])));WM.cy=Math.max(0,Math.min(WM.th-1,Math.round(p[1])));if(WM.z<=WM.zf*1.01&&WM.zf<.6)wmSetZoom(Math.min(WM.zmax,Math.max(1,WM.zf*2)));wmFollow(.5)}
/* bouton « Moi » : on revient là où se trouve le joueur */
function wmMoi(){const ici=wmIci();if(WM.lieu==='pays'){wmGo(WM.L.caseDe(ici));return}if(ici!==WM.lieu){wmEntrer(ici);return}const p=WM.L.moi();if(p)wmGo(p)}
function wmMarks(){if(WM.L.reperes)return WM.L.reperes();const I=wmInfos(),T=wmTargets().filter(([x,y])=>!I.some(i=>i.x===x&&i.y===y));return I.map(i=>[i.x,i.y]).concat(T)}
function wmNextMark(){const M=wmMarks();if(!M.length){toast('Aucun repère d’objectif sur la carte pour le moment.');return}WM.oi=(WM.oi||0)%M.length;wmGo(M[WM.oi]);WM.oi++}
/* ---- boucle d'affichage ---- */
function wmLoop(now){
  if(!WM.open)return;const dt=WM.lt?Math.min(.1,(now-WM.lt)/1000):.016;WM.lt=now;WM.t+=dt;
  if(WM.anim){try{wmAnime(dt)}catch(e){const A=WM.anim;WM.anim=null;console.error(e);wmEntrer(A.sortie?'pays':A.detail)}qkRAF(wmLoop);return}
  wmLayout(false);
  const K=WM.k,kb=K.right||K.left||K.up||K.down,cl=()=>{WM.cx=Math.max(0,Math.min(WM.tw-1,WM.cx));WM.cy=Math.max(0,Math.min(WM.th-1,WM.cy))};
  const dx=kb?((K.right?1:0)-(K.left?1:0)):((keys.right?1:0)-(keys.left?1:0)),dy=kb?((K.down?1:0)-(K.up?1:0)):((keys.down?1:0)-(keys.up?1:0));
  if(WM.L.sauter){
    // peu de lieux, loin les uns des autres : une flèche = le lieu suivant dans cette direction
    let d=WM.q.length?WM.q[WM.q.length-1]:null;WM.q.length=0;const dir=dx>0?'right':dx<0?'left':dy>0?'down':dy<0?'up':null;
    if(dir){if(!WM.held&&!kb)d=dir;WM.held+=dt;if(WM.held>.45){WM.held=.1;d=dir}}else WM.held=0;
    if(d){WM.L.sauter(d);wmFollow()}
  }else{
    // curseur : un appui = une case ; une touche maintenue fait glisser le curseur, de plus en plus vite
    let mv=false;while(WM.q.length){const d=DIRS[WM.q.shift()];WM.cx+=d[0];WM.cy+=d[1];mv=true}
    if(dx||dy){if(!WM.held&&!kb){WM.cx+=dx;WM.cy+=dy;mv=true}
      WM.held+=dt;if(WM.held>.25){const sp=(WM.held>.8?26:12)/Math.max(.6,Math.min(2,WM.z));WM.fx=Math.max(0,Math.min(WM.tw-1,WM.fx+dx*sp*dt));WM.fy=Math.max(0,Math.min(WM.th-1,WM.fy+dy*sp*dt));WM.cx=Math.round(WM.fx);WM.cy=Math.round(WM.fy);mv=true}else{cl();WM.fx=WM.cx;WM.fy=WM.cy}}
    else{WM.held=0;cl();WM.fx=WM.cx;WM.fy=WM.cy}
    if(mv){cl();wmFollow()}
  }
  try{wmDraw();wmInfo()}catch(e){if(!WM.err){WM.err=1;console.error(e)}}
  qkRAF(wmLoop);
}
function wmPill(c,txt,x,y,bg,fg,al){c.font='16px Unifont,monospace';const w=Math.ceil(c.measureText(txt).width)+10;const X=al==='c'?Math.round(x-w/2):al==='r'?Math.round(x-w):Math.round(x);c.fillStyle=bg;c.fillRect(X,Math.round(y),w,20);c.fillStyle=fg;c.textBaseline='middle';c.textAlign='left';c.fillText(txt,X+5,Math.round(y)+10);return w}
function wmLock(c,x,y,s){c.fillStyle='#f7f0dc';c.fillRect(x-4*s,y-1*s,8*s,7*s);c.fillRect(x-3*s,y-5*s,1.5*s,4*s);c.fillRect(x+1.5*s,y-5*s,1.5*s,4*s);c.fillRect(x-3*s,y-6*s,6*s,1.5*s);c.fillStyle='#1c2440';c.fillRect(x-.75*s,y+1*s,1.5*s,3*s)}
/* ---- les repères communs à toutes les cartes (x, y : à l'écran) ---- */
/* une information à récupérer : une bulle, avec « ! » (info clé) ou « ? » (les autres) */
function wmBulle(c,x,y,small,genre){
  const k=small?7:10,bord=genre==='?'?'#4a78c9':'#f2a33a';
  c.fillStyle=bord;c.fillRect(x-k-2,y-k-2,2*k+4,2*k+4);c.fillStyle='#fffaf0';c.fillRect(x-k,y-k,2*k,2*k);c.fillStyle=bord;c.beginPath();c.moveTo(x-4,y+k+2);c.lineTo(x+4,y+k+2);c.lineTo(x,y+k+7);c.fill();
  if(genre==='?'){c.fillStyle='#2f5f9a';c.font=`bold ${small?12:16}px Unifont,monospace`;c.textAlign='center';c.textBaseline='middle';c.fillText('?',x,y+1);c.textAlign='left';return}
  c.fillStyle='#c43d3d';if(small){c.fillRect(x-1,y-5,2,6);c.fillRect(x-1,y+3,2,2)}else{c.fillRect(x-1.5,y-7,3,9);c.fillRect(x-1.5,y+4,3,3)}
}
/* l'objectif : une flèche vers le bas */
function wmFleche(c,x,y,small){const k=small?8:12;c.fillStyle='#f2a33a';c.strokeStyle='#131a2b';c.lineWidth=2;c.beginPath();c.moveTo(x-k,y-k*1.4);c.lineTo(x+k,y-k*1.4);c.lineTo(x,y);c.closePath();c.fill();c.stroke()}
/* une pastille verte cochée : c'est fait */
function wmCoche(c,x,y,k){c.fillStyle='#2f9e4a';c.beginPath();c.arc(x,y,k,0,7);c.fill();c.strokeStyle='#fff';c.lineWidth=2;c.beginPath();c.moveTo(x-k*.5,y);c.lineTo(x-k*.1,y+k*.4);c.lineTo(x+k*.55,y-k*.4);c.stroke()}
/* toi */
function wmToi(c,x,y,small,t){
  const s=small?1:2,pulse=.5+.5*Math.sin(t*6);
  c.strokeStyle=`rgba(255,255,255,${.4+.6*pulse})`;c.lineWidth=2;c.beginPath();c.arc(x,y,9*s+2+pulse*3,0,7);c.stroke();c.fillStyle='rgba(19,26,43,.75)';c.beginPath();c.arc(x,y,9*s+1,0,7);c.fill();
  c.imageSmoothingEnabled=false;c.drawImage(WM.av,x-8*s,y-11*s,16*s,20*s);if(!small)wmPill(c,'TOI',x,y+9*s+5,'#f7f0dc','#131a2b','c')}
/* le curseur : quatre coins qui respirent autour d'un carré de côté s */
function wmCurseur(c,cx,cy,s,t){
  const x=Math.round(cx-s/2),y=Math.round(cy-s/2),g=3+Math.round((Math.sin(t*7)+1)*1.5),l=Math.max(5,Math.round(s*.4));
  const br=(col,o,th)=>{c.fillStyle=col;const x1=x+s+g,y1=y+s+g,x0=x-g,y0=y-g;[[x0,y0,l,th],[x0,y0,th,l],[x1-l,y0,l,th],[x1-th,y0,th,l],[x0,y1-th,l,th],[x0,y1-l,th,l],[x1-l,y1-th,l,th],[x1-th,y1-l,th,l]].forEach(([a,b,w2,h2])=>c.fillRect(a-o,b-o,w2+2*o,h2+2*o))};
  br('#131a2b',1,3);br('#fff',0,3)}
function wmDraw(){
  const c=WM.c,z=WM.z,w=WM.w,h=WM.h,t=WM.t;c.setTransform(WM.dpr,0,0,WM.dpr,0,0);
  c.fillStyle='#0b1020';c.fillRect(0,0,w,h);
  c.imageSmoothingEnabled=z<1;c.imageSmoothingQuality='high';
  const X0=wmSX(0),Y0=wmSY(0);c.drawImage(WM.base,Math.round(X0),Math.round(Y0),Math.round(WM.W*z),Math.round(WM.H*z));
  if(WM.L.dessiner){WM.L.dessiner(c,t);return}   // le pays, un site : voyages/atlas.js
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
    if(st===2)wmCoche(c,x+r-2,y+r-2,small?5:7)});
  // infos clés manquantes
  const I=wmInfos();
  I.forEach(i=>wmBulle(c,Math.round(wmSX(i.x*TS+8)),Math.round(wmSY(i.y*TS)-14+bob),small,'!'));
  // objectif
  wmTargets().filter(([x,y])=>!I.some(i=>i.x===x&&i.y===y)).forEach(([tx,ty])=>wmFleche(c,wmSX(tx*TS+8),wmSY(ty*TS)-6+bob,small));
  // toi (sauf si le train t'a emmené ailleurs)
  {const p=wmPlayer();if(p)wmToi(c,Math.round(wmSX(p[0]*TS+8)),Math.round(wmSY(p[1]*TS+8)),small,t)}
  // curseur
  wmCurseur(c,wmCX(),wmCY(),Math.max(TS*z,16),t);
}
function wmEcrire(t,d,N){WM.el.querySelector('.wm-info').innerHTML=`<b>${esc(t)}</b><span>${esc(d)}</span>${N&&N.length?'<div class="wm-tags">'+N.map(([c,t])=>`<em class="${c}">${esc(t)}</em>`).join('')+'</div>':''}`}
function wmInfo(){
  if(WM.L.info){const r=WM.L.info();if(r.k===WM.last)return;WM.last=r.k;wmEcrire(r.t,r.d,r.N);return}   // le pays, un site : voyages/atlas.js
  const k=WM.cx+','+WM.cy+','+S.ch+','+missingReq().length;if(k===WM.last)return;WM.last=k;
  const p=wmPlaceAt(WM.cx,WM.cy),near=(x,y)=>Math.abs(x-WM.cx)<=1&&Math.abs(y-WM.cy)<=2,N=[];
  const I=wmInfos();I.filter(i=>near(i.x,i.y)).forEach(i=>N.push(['go','Info clé à récupérer : '+i.where]));
  if(wmTargets().some(([x,y])=>near(x,y)&&!I.some(i=>i.x===x&&i.y===y)))N.push(['go','Ton objectif est ici']);
  const me=wmPlayer();if(me&&near(Math.round(me[0]),Math.round(me[1])))N.push(['me','Tu es ici']);
  if(p.s)N.unshift(p.s);
  wmEcrire(p.t,p.d,N);
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
  if(key==='+'||key==='='||e.code==='NumpadAdd'){e.preventDefault();if(!e.repeat||WM.lieu!=='pays')wmZoom(1.5);return}
  if(key==='-'||key==='_'||e.code==='NumpadSubtract'){e.preventDefault();if(!e.repeat||WM.z>WM.zf*1.001)wmZoom(1/1.5)}
});
onKey('keyup',e=>{const d=KEYMAP[e.code]||KEYMAP[e.key];if(d)WM.k[d]=0});
addEventListener('blur',()=>{WM.k={}});
$('mapBtn').onclick=e=>{e.currentTarget.blur();if(WM.open)closeMap();else openMap()};
