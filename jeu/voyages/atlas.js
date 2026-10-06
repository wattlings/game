/* Wattlings · jeu/voyages/atlas.js
   La carte, au-delà de la ville (touche K, puis dézoomer) :
   - la carte du pays : Ampère-sur-Loire, les destinations, les lignes de train ;
   - le plan de chaque site visité en train : ses zones, ses informations, l'objectif.
   La mécanique (zoom, curseur, passage d'une carte à l'autre) est dans interface/carte.js. Ici : ce que ces cartes montrent.

   Ce qu'un site déclare pour y figurer :
     dans son textes.js (voyDeclarer) : pays:[longitude, latitude]   où il se trouve
                                        rail:[[longitude, latitude]…] les étapes de sa ligne, depuis Ampère-sur-Loire
                                        cote:'gauche'|'droite'|'haut'|'bas'   de quel côté du point écrire son nom
     dans son carte.js (voyCarte)     : zones:[{r:[x0,y0,x1,y1], t:'Nom', d:'Description', e:'ÉTIQUETTE'}]   (e : facultatif, écrit sur le plan, en haut de la zone ;
                                        ey, ex : la rangée ou la colonne où l'écrire quand cet endroit est encombré)
                                        ou {c:'~', t, d} pour désigner toutes les cases d'un caractère du plan ; la première zone qui convient gagne
                                        ailleurs:['Nom','Description']   ce que dit l'encart partout ailleurs
     sur un objet qui donne une information sans passer par voySource ou voyAnimateur : info:'identifiant'
     sur le responsable du site (le défi final) : chef:1 */

/* ================= LA CARTE DU PAYS ================= */
/* 404 × 376 pixels ; un degré de latitude = 36 pixels ; les longitudes sont resserrées comme elles le sont à cette latitude */
const ATLAS={W:404,H:376,ts:4,ouest:-6.4,nord:51.6,k:36,serre:.688,ville:[2.35,47.76],base:null,terre:null,lieux:null,plans:{}};
const atlasXY=p=>[(p[0]-ATLAS.ouest)*ATLAS.k*ATLAS.serre,(ATLAS.nord-p[1])*ATLAS.k];

/* ---- les contours, en [longitude, latitude] : schématiques, mais on reconnaît le pays ---- */
/* la France, dans le sens des aiguilles d'une montre depuis Dunkerque : frontières de l'est, Méditerranée, Pyrénées, Atlantique, Manche */
const ATLAS_FRANCE=[[2.55,51.09],[3.15,50.79],[3.3,50.52],[4.05,50.35],[4.2,49.96],[4.85,50.15],[4.87,49.8],[5.47,49.5],[5.9,49.5],[6.37,49.47],[6.75,49.17],[7.45,49.17],[8.2,48.97],
  [7.8,48.5],[7.58,48.1],[7.6,47.58],[7.0,47.45],[6.45,46.93],[6.1,46.55],[6.12,46.25],[6.8,46.4],[6.85,45.93],[7.05,45.47],[6.63,45.11],[7.07,44.68],[6.9,44.36],[7.67,44.17],
  /* 27 : Menton */[7.53,43.78],[7.2,43.65],[6.9,43.42],[6.65,43.2],[6.15,43.05],[5.9,43.08],[5.35,43.25],[5.05,43.33],[4.8,43.35],[4.2,43.46],[3.9,43.5],[3.5,43.27],[3.1,43.05],[3.05,42.55],
  /* 41 : Cerbère */[3.17,42.43],[2.5,42.35],[1.75,42.5],[1.45,42.6],[0.7,42.7],[0,42.7],[-0.55,42.8],[-1.4,43.05],
  /* 49 : Hendaye */[-1.78,43.36],[-1.5,43.52],[-1.33,44.2],[-1.25,44.65],[-1.15,45.45],[-1,45.63],[-1.2,45.95],[-1.15,46.15],[-1.5,46.35],[-1.85,46.6],[-2.15,46.9],[-2,47.1],[-2.2,47.28],[-2.5,47.3],
  [-2.75,47.55],[-3.35,47.72],[-4,47.85],[-4.35,47.8],[-4.7,48.04],[-4.3,48.12],[-4.6,48.28],[-4.35,48.35],[-4.78,48.4],[-4.75,48.55],[-4,48.72],[-3.5,48.83],[-3,48.85],[-2.7,48.55],[-2,48.65],
  [-1.55,48.63],[-1.6,48.85],[-1.8,49.4],[-1.9,49.72],[-1.3,49.7],[-1.15,49.37],[-0.3,49.3],[0.1,49.5],[0.2,49.72],[1.1,49.93],[1.55,50.2],[1.6,50.75],[1.85,50.97]];
const ATLAS_MENTON=27,ATLAS_CERBERE=41,ATLAS_HENDAYE=49;
/* le continent autour : la côte nord de l'Espagne, les côtes françaises, la Belgique, puis l'Italie et l'Espagne côté Méditerranée */
const ATLAS_CONTINENT=[[-7,43.6],[-6,43.58],[-4.5,43.42],[-3,43.45]].concat(ATLAS_FRANCE.slice(ATLAS_HENDAYE),[[2.55,51.09],[3.2,51.35],[3.7,51.7],[10.5,51.7],[10.5,43.9],[9.8,44.05],[8.9,44.4],[8.2,44],[8,43.88]],
  ATLAS_FRANCE.slice(ATLAS_MENTON,ATLAS_CERBERE+1),[[3.2,42.25],[3.1,41.85],[2.2,41.3],[1.2,41.1],[0.8,40.9],[-7,40.9]]);
const ATLAS_ANGLETERRE=[[-5.7,50.05],[-5.05,49.97],[-4.1,50.33],[-3.45,50.35],[-3,50.7],[-2.45,50.53],[-1.3,50.58],[-0.1,50.8],[0.95,50.9],[1.4,51.15],[1.45,51.4],[0.6,51.5],[1,51.8],[-2.9,51.8],[-3,51.2],[-4.2,51.2],[-4.55,50.95],[-5,50.5]];
const ATLAS_CORSE=[[9.4,43],[9.48,42.6],[9.55,42.1],[9.4,41.6],[9.2,41.37],[8.8,41.55],[8.6,41.9],[8.57,42.35],[8.75,42.57],[9.1,42.73],[9.33,42.72]];
/* quatre fleuves */
const ATLAS_FLEUVES=[
  [[4.2,44.85],[4.05,45.9],[3.16,46.99],[2.63,47.69],[1.9,47.9],[0.69,47.39],[-0.55,47.47],[-1.55,47.21],[-2.15,47.28]],          // la Loire
  [[4.7,47.5],[4.07,48.3],[2.35,48.85],[1.1,49.44],[0.2,49.45]],                                                                // la Seine
  [[6.15,46.2],[5.75,45.75],[4.83,45.75],[4.85,44.9],[4.8,43.95],[4.75,43.4]],                                                   // le Rhône
  [[0.7,42.75],[1.44,43.6],[0.6,44.2],[-0.57,44.84],[-1.05,45.55]]];                                                             // la Garonne
/* les massifs : [longitude, latitude, demi-largeur, demi-hauteur (en degrés), neige] */
const ATLAS_MASSIFS=[[6.55,45.25,.75,1.15,1],[0.6,42.83,2.3,.22,1],[2.9,45.1,.8,.75,0],[6.15,46.75,.3,.5,0],[7.05,48.1,.2,.45,0],[8.3,46.35,1.7,.55,1],[7.6,45.2,.4,.9,1]];
/* les noms écrits sur la mer (grand écran seulement) */
const ATLAS_MERS=[['MANCHE',[-1.6,50.25]],['ATLANTIQUE',[-4.2,45.6]],['MÉDITERRANÉE',[5.4,42.35]]];

/* ---- le fond de carte : peint une fois, pixel par pixel ---- */
function atlasBase(){
  if(ATLAS.base)return ATLAS.base;
  const W=ATLAS.W,H=ATLAS.H,T=new Uint8Array(W*H);   // T : 0 mer · 1 France · 2 pays voisins · 3 Corse
  const remplir=(poly,v)=>{const Q=poly.map(atlasXY);for(let y=0;y<H;y++){const yc=y+.5,xs=[];
    for(let i=0;i<Q.length;i++){const a=Q[i],b=Q[(i+1)%Q.length];if((a[1]<=yc)!==(b[1]<=yc))xs.push(a[0]+(yc-a[1])/(b[1]-a[1])*(b[0]-a[0]))}
    xs.sort((a,b)=>a-b);for(let k=0;k+1<xs.length;k+=2)for(let x=Math.max(0,Math.round(xs[k]));x<Math.min(W,Math.round(xs[k+1]));x++)T[y*W+x]=v}};
  remplir(ATLAS_CONTINENT,2);remplir(ATLAS_ANGLETERRE,2);remplir(ATLAS_FRANCE,1);remplir(ATLAS_CORSE,3);
  // à quelle distance de la côte se trouve chaque case de mer (jusqu'à 6) : l'eau est plus claire près du bord
  const D=new Uint8Array(W*H).fill(9);for(let i=0;i<W*H;i++)if(T[i])D[i]=0;
  for(let n=1;n<=6;n++)for(let y=0;y<H;y++)for(let x=0;x<W;x++){const i=y*W+x;if(D[i]<9)continue;if((x&&D[i-1]===n-1)||(x<W-1&&D[i+1]===n-1)||(y&&D[i-W]===n-1)||(y<H-1&&D[i+W]===n-1))D[i]=n}
  const cv=mkc(W,H),c=cv.getContext('2d'),img=c.createImageData(W,H),px=img.data;
  const hex=h=>[parseInt(h.slice(1,3),16),parseInt(h.slice(3,5),16),parseInt(h.slice(5,7),16)],mets=(x,y,h)=>{if(x<0||y<0||x>=W||y>=H)return;const q=hex(h),i=(y*W+x)*4;px[i]=q[0];px[i+1]=q[1];px[i+2]=q[2];px[i+3]=255};
  const voisin=(x,y,v)=>(x&&T[y*W+x-1]===v)||(x<W-1&&T[y*W+x+1]===v)||(y&&T[(y-1)*W+x]===v)||(y<H-1&&T[(y+1)*W+x]===v);
  const VERT=['#7fbf6e','#88c676','#93cd80'],SEC=['#c3c27a','#cdc983','#b9c476'],GRIS=['#b3bfa6','#bbc6ad','#c2cdb4'];
  for(let y=0;y<H;y++)for(let x=0;x<W;x++){const t=T[y*W+x],h=wh(x,y,71),lon=x/(ATLAS.k*ATLAS.serre)+ATLAS.ouest,lat=ATLAS.nord-y/ATLAS.k;
    if(!t){const d=D[y*W+x];mets(x,y,d<=1?'#8cc3e2':d<=3?'#5fa3cf':d<=6&&h>.5?'#5298c8':h>.965&&!(y&1)?'#5a9fd0':'#4689bd');continue}
    if(t===2){mets(x,y,voisin(x,y,0)?'#d8d5bb':GRIS[h>.66?2:h>.33?1:0]);continue}
    // la France : verte, et de plus en plus sèche en descendant vers la Méditerranée
    const sec=Math.max(0,Math.min(1,(44.9-lat)/1.1))*Math.max(0,Math.min(1,(lon-2.2)/1.2));
    mets(x,y,voisin(x,y,0)?'#efe2b0':voisin(x,y,2)&&((x+y)&1)?'#4f7d57':(wh(x,y,72)<sec?SEC:VERT)[h>.66?2:h>.33?1:0]);
    if(t===1&&!voisin(x,y,0)&&wh(x,y,73)>.988)mets(x,y,'#5fa85a');   // un bosquet
  }
  // les fleuves, d'un trait d'un pixel, sur la terre seulement
  ATLAS_FLEUVES.forEach(f=>{const Q=f.map(atlasXY);for(let i=0;i+1<Q.length;i++){const a=Q[i],b=Q[i+1],n=Math.ceil(Math.hypot(b[0]-a[0],b[1]-a[1]))*2;
    for(let k=0;k<=n;k++){const x=Math.round(a[0]+(b[0]-a[0])*k/n+Math.sin((i*40+k)*.19)*1.2),y=Math.round(a[1]+(b[1]-a[1])*k/n);if(x>=0&&y>=0&&x<W&&y<H&&T[y*W+x]===1)mets(x,y,'#5fa3cf')}}});
  // les massifs : des sommets en quinconce, clairs d'un côté, à l'ombre de l'autre ; de la neige sur les plus hauts, de simples collines ailleurs
  ATLAS_MASSIFS.forEach(([lo,la,rx,ry,neige],n)=>{const q=atlasXY([lo,la]),ax=rx*ATLAS.k*ATLAS.serre,ay=ry*ATLAS.k,H0=neige?3:2;
    for(let gy=-ay;gy<=ay;gy+=neige?6:5)for(let gx=-ax;gx<=ax;gx+=neige?9:8){const x=Math.round(q[0]+gx+(wh(gx,gy,80+n)-.5)*3+((Math.round(gy/(neige?6:5))&1)?4:0)),y=Math.round(q[1]+gy+(wh(gy,gx,90+n)-.5)*2);
      if((gx/ax)**2+(gy/ay)**2>1||x<4||y<4||x>=W-4||y>=H-1)continue;const t=T[y*W+x];if(!t||T[y*W+x+3]!==t||T[y*W+x-3]!==t)continue;const pale=t===2;
      const clair=pale?'#cfccc0':neige?'#c9c4b6':'#a3bb80',sombre=pale?'#a5a296':neige?'#8a8577':'#6f9460';
      for(let r=0;r<=H0;r++)for(let k=-r;k<=r;k++)mets(x+k,y-H0+r,neige&&r<=1&&!pale?(k<=0?'#fbfbf8':'#d5dbe2'):k<=0&&r<H0?clair:sombre)}});
  c.putImageData(img,0,0);ATLAS.terre=T;return ATLAS.base=cv;
}

/* ---- les lieux de la carte du pays : la ville, puis chaque carte de chaque site ---- */
function atlasPlaces(){
  if(ATLAS.lieux)return ATLAS.lieux;
  const L=[{id:'town',ville:1,p:atlasXY(ATLAS.ville),cote:'droite',nom:'Ampère-sur-Loire'}];
  VOY.ordre.forEach(sid=>{const s=VOY.sites[sid];if(!s.pays)return;
    (s.cartes||[s.carte]).forEach((id,i)=>{const m=MAPS[id]||{},q=i?m.pays:s.pays;if(q)L.push({id:id||sid,sid,annexe:i>0,ferme:!s.ouvert||!MAPS[id],p:atlasXY(q),cote:(i?m.cote:s.cote)||'bas',nom:i?m.nomCourt||m.name:s.gare.split(' · ')[0]})})});
  L.forEach(l=>{l.c=[Math.round(l.p[0]/ATLAS.ts-.5),Math.round(l.p[1]/ATLAS.ts-.5)]});
  return ATLAS.lieux=L;
}
const atlasPlace=id=>atlasPlaces().find(l=>l.id===id);
/* le lieu que pointe le curseur */
const atlasChoisi=()=>atlasPlaces().find(l=>l.c[0]===WM.cx&&l.c[1]===WM.cy);
/* les lignes de train : d'Ampère-sur-Loire à chaque site, par ses étapes */
function atlasLignes(){return VOY.ordre.map(sid=>{const s=VOY.sites[sid];return s.pays?{sid,ferme:!s.ouvert,pts:[ATLAS.ville].concat(s.rail||[],[s.pays]).map(atlasXY)}:null}).filter(Boolean)}
/* la prochaine destination conseillée : le premier site ouvert sans tampon */
const atlasProchain=()=>VOY.ordre.find(sid=>VOY.sites[sid].ouvert&&VOY.sites[sid].pays&&!voyTampon(sid));
/* le site auquel appartient une carte */
const atlasSiteDe=id=>VOY.ordre.find(sid=>{const s=VOY.sites[sid];return s.ouvert&&(s.cartes||[s.carte]).includes(id)});

/* ce que dit l'encart quand le curseur n'est sur aucun lieu */
function atlasRegion(wx,wy){
  const lon=wx/(ATLAS.k*ATLAS.serre)+ATLAS.ouest,lat=ATLAS.nord-wy/ATLAS.k,x=Math.max(0,Math.min(ATLAS.W-1,wx|0)),y=Math.max(0,Math.min(ATLAS.H-1,wy|0)),t=ATLAS.terre?ATLAS.terre[y*ATLAS.W+x]:1;
  if(!t){
    if(lat>50.6&&lon>1.3)return ['Mer du Nord',"Une mer froide et peu profonde : commode pour refroidir une centrale, et pour y planter des éoliennes."];
    if(lat>48.45&&lon>-5.6&&lon<2)return ['La Manche',"Du vent, des courants, des ferries. Plusieurs parcs éoliens en mer y tournent déjà."];
    if(lon>2.5&&lat<44.6)return ['Mer Méditerranée',"Du soleil, du mistral, et des câbles sous-marins qui arrivent à Marseille depuis trois continents."];
    return ['Océan Atlantique',"Le vent y arrive le premier, sans demander l'avis de personne. Le premier parc éolien en mer du pays tourne au large de Saint-Nazaire."]}
  if(t===3)return ['Corse',"Une île : aucun câble électrique ne la relie au continent français. Elle produit sur place, et échange avec l'Italie et la Sardaigne."];
  if(t===2)return ['Les pays voisins',"Le réseau électrique ne s'arrête pas à la frontière : des lignes relient la France à tous ses voisins, et le courant y passe dans les deux sens."];
  if(lon<-1.2&&lat>47.2)return ['Bretagne',"Beaucoup de vent, peu de centrales : la région consomme bien plus d'électricité qu'elle n'en produit. D'où les éoliennes."];
  if(lat>49.6)return ['Nord',"Plat, venté, bordé d'une mer froide : on y trouve des éoliennes, des usines, et des centrales qui ont besoin d'eau pour se refroidir."];
  if(lon>5.6&&lat>44.4&&lat<46.4)return ['Alpes',"De la pente et de l'eau : c'est ici que le pays range ses grands barrages."];
  if(lon>4&&lat<=44.4)return ['Provence',"Le coin le plus ensoleillé du pays. Les panneaux solaires s'y plaisent ; les data centers y transpirent."];
  if(lat<43.25&&lon<3)return ['Pyrénées',"De la pente, de l'eau, des barrages. Aucune ligne de la gare n'y mène : il faudra revenir."];
  if(lat>46.9&&lat<48.2&&lon>-1.2&&lon<3.6)return ['Val de Loire',"La Loire, ses châteaux, ses centrales nucléaires au bord de l'eau, et Ampère-sur-Loire au milieu."];
  return ['France',"Le reste du pays : des villes, des champs, des usines. Tout ce monde-là consomme, et compte sur le réseau pour que ça suive."];
}

const atlasTactile=()=>{try{return matchMedia('(pointer:coarse)').matches}catch(e){return false}};
/* le nom d'un lieu, posé du côté demandé, sans jamais sortir de l'écran */
function atlasEtiquette(c,txt,x,y,r,cote,fond,encre){
  c.font='16px Unifont,monospace';const w=Math.ceil(c.measureText(txt).width)+10;
  if((cote==='droite'&&x+r+6+w>WM.w-4)||(cote==='gauche'&&x-r-6-w<4))cote='bas';   // pas la place sur le côté : on écrit dessous
  let X=cote==='droite'?x+r+6:cote==='gauche'?x-r-6-w:x-w/2,Y=cote==='bas'?y+r+6:cote==='haut'?y-r-26:y-10;
  X=Math.round(Math.max(4,Math.min(WM.w-w-4,X)));Y=Math.round(Y);
  c.fillStyle=fond;c.fillRect(X,Y,w,20);c.fillStyle=encre;c.textBaseline='middle';c.textAlign='left';c.fillText(txt,X+5,Y+10);
}

const ATLAS_PAYS={
  titre:()=>'Carte du pays · les lignes de la gare',W:ATLAS.W,H:ATLAS.H,ts:ATLAS.ts,empreinte:12,
  base:atlasBase,zmax:zf=>zf*2.2,
  place:id=>{const l=atlasPlace(id);return l?l.p:null},
  caseDe:id=>(atlasPlace(id)||atlasPlace('town')).c,
  depart:()=>ATLAS_PAYS.caseDe(wmIci()),moi:()=>ATLAS_PAYS.caseDe(wmIci()),
  legende:()=>'<span><i class="lg-me"></i>Toi</span><span><i class="lg-site"></i>Site à visiter</span><span><i class="lg-ok"></i>Tampon obtenu</span><span><i class="lg-rail"></i>Ligne de train</span>',
  /* le curseur est attiré par le lieu le plus proche */
  aimant(wx,wy){let b=null,bd=24/WM.z;atlasPlaces().forEach(l=>{const d=Math.hypot(l.p[0]-wx,l.p[1]-wy);if(d<bd){bd=d;b=l}});return b?b.c:null},
  /* une flèche : le lieu suivant dans cette direction */
  sauter(dir){const d=DIRS[dir],x=(WM.cx+.5)*ATLAS.ts,y=(WM.cy+.5)*ATLAS.ts;let b=null,bs=1e9;
    atlasPlaces().forEach(l=>{const ax=(l.p[0]-x)*d[0]+(l.p[1]-y)*d[1],tr=Math.abs((l.p[0]-x)*d[1])+Math.abs((l.p[1]-y)*d[0]);if(ax<6||tr>ax*2.2)return;const s=ax+tr*1.6;if(s<bs){bs=s;b=l}});
    if(b){WM.cx=b.c[0];WM.cy=b.c[1]}},
  /* zoomer sur le lieu pointé : on ouvre sa carte */
  entrer(){const l=atlasChoisi();if(!l)return false;if(l.ferme){toast("Cette ligne n'est pas encore ouverte.");return true}wmVers(l.id);return true},
  zoomer(sx,sy){let b=null,bd=70;atlasPlaces().forEach(l=>{const d=Math.hypot(wmSX(l.p[0])-sx,wmSY(l.p[1])-sy);if(d<bd&&!l.ferme){bd=d;b=l}});b=b||atlasChoisi();if(!b||b.ferme)return false;wmVers(b.id);return true},
  /* bouton « Objectif » : les sites qui n'ont pas encore leur tampon */
  reperes:()=>atlasPlaces().filter(l=>l.sid&&!l.annexe&&!l.ferme&&!voyTampon(l.sid)).map(l=>l.c),

  dessiner(c,t){
    const z=WM.z,petit=z<1.35,L=atlasPlaces(),ici=wmIci(),sel=atlasChoisi(),pulse=.5+.5*Math.sin(t*6),X=p=>wmSX(p[0]),Y=p=>wmSY(p[1]),prochain=voyEtat().pass&&atlasProchain()!==atlasSiteDe(ici)?atlasProchain():null;
    if(!petit){c.font='16px Unifont,monospace';c.textAlign='center';c.textBaseline='middle';c.fillStyle='rgba(255,255,255,.62)';ATLAS_MERS.forEach(([n,q])=>{const p=atlasXY(q);c.fillText(n,Math.round(X(p)),Math.round(Y(p)))});c.textAlign='left'}
    // les lignes de train : un trait sombre, des traverses claires
    const lignes=atlasLignes(),trace=l=>{c.beginPath();l.pts.forEach((p,i)=>i?c.lineTo(X(p),Y(p)):c.moveTo(X(p),Y(p)));c.stroke()};
    c.lineJoin='round';c.lineCap='butt';c.strokeStyle='#1c2440';c.lineWidth=petit?3:5;lignes.forEach(trace);
    c.lineWidth=petit?1:2;c.setLineDash(petit?[4,4]:[7,6]);lignes.forEach(l=>{c.strokeStyle=l.ferme?'#8e97b3':'#f7f0dc';trace(l)});c.setLineDash([]);
    // les gares de passage
    lignes.forEach(l=>l.pts.slice(1,-1).forEach(p=>{c.fillStyle='#1c2440';c.fillRect(Math.round(X(p))-3,Math.round(Y(p))-3,6,6);c.fillStyle='#f7f0dc';c.fillRect(Math.round(X(p))-1,Math.round(Y(p))-1,2,2)}));
    // la traversée vers les cartes annexes (le poste en mer) : en pointillé, c'est un bateau
    L.filter(l=>l.annexe).forEach(l=>{const a=atlasPlace(VOY.sites[l.sid].carte);if(!a)return;c.strokeStyle='#f7f0dc';c.lineWidth=2;c.setLineDash([2,5]);c.beginPath();c.moveTo(X(a.p),Y(a.p));c.lineTo(X(l.p),Y(l.p));c.stroke();c.setLineDash([])});
    // un train roule vers la prochaine destination
    if(prochain){const l=lignes.find(l=>l.sid===prochain),S0=[];let tot=0;for(let i=0;i+1<l.pts.length;i++){const d=Math.hypot(l.pts[i+1][0]-l.pts[i][0],l.pts[i+1][1]-l.pts[i][1]);S0.push(d);tot+=d}
      let d=(t*22)%(tot+30),i=0;if(d<tot){while(d>S0[i]){d-=S0[i];i++}const a=l.pts[i],b=l.pts[i+1],f=d/S0[i],x=Math.round(wmSX(a[0]+(b[0]-a[0])*f)),y=Math.round(wmSY(a[1]+(b[1]-a[1])*f)),k=petit?4:5;
        c.fillStyle='#131a2b';c.fillRect(x-k-1,y-k-1,2*k+2,2*k+2);c.fillStyle='#2aa198';c.fillRect(x-k,y-k,2*k,2*k);c.fillStyle='#f7f0dc';c.fillRect(x-k+1,y-k+1,2*k-2,k-1)}}
    // les lieux
    L.forEach(l=>{const x=Math.round(X(l.p)),y=Math.round(Y(l.p)),r=(petit?9:12)-(l.annexe?3:0),s=petit||l.annexe?1:2;
      if(l.sid&&l.sid===prochain&&!l.annexe){c.strokeStyle=`rgba(242,163,58,${.35+.65*pulse})`;c.lineWidth=3;c.beginPath();c.arc(x,y,r+4+pulse*3,0,7);c.stroke()}
      c.fillStyle='#131a2b';c.beginPath();c.arc(x,y,r+2,0,7);c.fill();c.fillStyle=l.ville?'#f7f0dc':l.ferme?'#8e97b3':PASSEPORT_ENCRE[l.sid]||'#3a4050';c.beginPath();c.arc(x,y,r,0,7);c.fill();
      c.save();c.translate(x,y);c.scale(s,s);
      if(l.ville){R(c,-3,-1,6,4,'#1c2440');R(c,-4,-2,8,1,'#c8502a');R(c,-3,-3,6,1,'#c8502a');R(c,-2,-4,4,1,'#c8502a');R(c,-1,0,2,3,'#f2a33a')}   // une maison
      else voyPicto(c,VOY.sites[l.sid].id,-3.5,-3.5,'#f7f0dc');
      c.restore();
      if(l.sid&&!l.annexe&&voyTampon(l.sid))wmCoche(c,x+r-1,y+r-1,petit?5:7);
      if(l.id===ici){const k=petit?1:2;c.strokeStyle=`rgba(255,255,255,${.4+.6*pulse})`;c.lineWidth=2;c.beginPath();c.arc(x,y,r+4+pulse*3,0,7);c.stroke();c.imageSmoothingEnabled=false;c.drawImage(WM.av,x-8*k,y-r-20*k-1,16*k,20*k);
        if(!petit)wmPill(c,'TOI',x,y-r-20*k-22,'#f7f0dc','#131a2b','c')}
      // le nom des lieux : sur grand écran seulement (sur un téléphone, l'encart du bas le donne déjà)
      if(!petit)atlasEtiquette(c,l.nom,x,y,r,l.id===ici&&l.cote==='haut'?'bas':l.cote,l===sel?'#f2a33a':'rgba(19,26,43,.85)',l===sel?'#131a2b':'#f7f0dc')});
    // le curseur
    if(sel)wmCurseur(c,wmSX(sel.p[0]),wmSY(sel.p[1]),((petit?9:12)-(sel.annexe?3:0))*2+6,t);else wmCurseur(c,wmCX(),wmCY(),12,t);
  },

  info(){
    const l=atlasChoisi(),k='pays,'+WM.cx+','+WM.cy+','+voyCle()+','+S.map;
    if(!l){const r=atlasRegion((WM.cx+.5)*ATLAS.ts,(WM.cy+.5)*ATLAS.ts);return {k,t:r[0],d:r[1]}}
    const N=[],ici=wmIci();if(l.id===ici)N.push(['me','Tu es ici']);
    if(l.ville)return {k,t:'Ampère-sur-Loire',d:"Ta ville : huit quartiers, une rivière, une gare. Tous les trains partent d'ici, et tous y reviennent.",N:N.concat([['no',atlasTactile()?'Touche encore pour voir la ville':'Zoome (+) pour voir la carte de la ville']])};
    const s=VOY.sites[l.sid],m=MAPS[l.id]||{};
    if(l.ferme)return {k,t:s.nom,d:`${s.region} · ${s.theme}. ${s.accroche||''}`,N:[['no','Ligne à venir']]};
    if(voyTampon(l.sid))N.push(['ok','Tampon obtenu']);else if(!voyEtat().pass)N.push(['go','Passeport à retirer au guichet de la gare']);else if(l.sid===atlasProchain()&&atlasSiteDe(ici)!==l.sid)N.push(['go','Prochain départ conseillé']);
    const n=voyInfosVues(l.sid).length;N.push([n===s.infos.length?'ok':'no',`${n} / ${s.infos.length} informations notées`]);
    N.push(['no',atlasTactile()?'Touche encore pour voir le plan':'Zoome (+) pour voir le plan du site']);
    return {k,t:l.annexe?m.name:s.nom,d:l.annexe?m.acces||'':`${s.region} · ${s.theme}. ${s.accroche}`,N};
  }
};

/* ================= LE PLAN D'UN SITE ================= */
/* les objets d'une carte, où que soit le joueur */
function atlasObjets(id){const sm=S.map;let O=[];S.map=id;try{O=objsFor(id)}finally{S.map=sm}return O}
/* le fond : le plan peint, et tout ce qui est posé dessus */
function atlasFond(id){
  if(!mapCache[id])buildMapCanvas(id);
  const src=mapCache[id],cv=mkc(src.width,src.height),x=cv.getContext('2d');x.imageSmoothingEnabled=false;x.drawImage(src,0,0);
  const sm=S.map;S.map=id;try{objsFor(id).filter(o=>o.kind!=='none'&&o.px===undefined).sort((a,b)=>a.y-b.y).forEach(o=>{try{drawObj(x,o,0,0,0)}catch(e){}})}finally{S.map=sm}
  if(mapOver[id])x.drawImage(mapOver[id],0,0);
  return cv;
}
/* où se trouve chaque information du site sur cette carte : l'objet (ou la personne) qui la donne */
function atlasSources(id,sid){
  const O=atlasObjets(id),donne=o=>o.info||(o.act&&o.act.info);
  return VOY.sites[sid].infos.map(f=>{const C=O.filter(o=>donne(o)===f.id);if(!C.length)return null;const o=C.find(o=>'glow' in o)||C[0];return {f,x:o.x,y:o.y,vu:voyInfoVue(sid,f.id)}}).filter(Boolean);
}
const atlasZone=(m,x,y)=>{const ch=m.g[y]&&m.g[y][x],Z=(m.zones||[]).find(Z=>Z.r?x>=Z.r[0]&&x<=Z.r[2]&&y>=Z.r[1]&&y<=Z.r[3]:Z.c&&Z.c.includes(ch));return Z?[Z.t,Z.d]:m.ailleurs||[m.name,'']};

function atlasPlan(id,sid){
  const m=MAPS[id],site=VOY.sites[sid],w=m.g[0].length,h=m.g.length,ici=()=>S.map===id?[P.px/TS,P.py/TS]:null;
  const cibles=()=>{try{return (m.cibles&&m.cibles())||[]}catch(e){return []}};
  const L={sid,W:w*TS,H:h*TS,ts:TS,src:null,chef:null,
    titre:()=>m.name,zmax:zf=>Math.max(3,zf*3),
    base(){L.src=atlasSources(id,sid);L.chef=atlasObjets(id).find(o=>o.chef)||null;return atlasFond(id)},
    depart:()=>ici()||[m.depart?m.depart[0]:w>>1,m.depart?m.depart[1]:h>>1],moi:ici,
    legende:()=>'<span><i class="lg-me"></i>Toi</span><span><i class="lg-obj"></i>Objectif</span><span><i class="lg-inf">!</i>Info clé à noter</span><span><i class="lg-q">?</i>Autre information</span><span><i class="lg-ok"></i>Déjà noté</span>',
    /* bouton « Objectif » : d'abord les flèches, puis ce qui reste à noter */
    reperes(){const T=cibles(),R0=(L.src||[]).filter(s=>!s.vu&&!T.some(([x,y])=>x===s.x&&y===s.y)).sort((a,b)=>(b.f.cle?1:0)-(a.f.cle?1:0)).map(s=>[s.x,s.y]);return T.concat(R0)},
    dessiner(c,t){
      const z=WM.z,petit=z<.75,bob=Math.sin(t*5)*2,src=L.src||[];
      // le nom des zones, quand il tient
      if(!petit)(m.zones||[]).forEach(Z=>{if(!Z.e||!Z.r)return;c.font='16px Unifont,monospace';if(c.measureText(Z.e).width+10>(Z.r[2]-Z.r[0]+1)*TS*z*1.2)return;wmPill(c,Z.e,wmSX((Z.ex!==undefined?Z.ex+.5:(Z.r[0]+Z.r[2]+1)/2)*TS),wmSY((Z.ey!==undefined?Z.ey:Z.r[1])*TS)-2,'rgba(19,26,43,.8)','#f7f0dc','c')});
      // les informations : déjà notées (coche), ou à noter (bulle)
      src.filter(s=>s.vu).forEach(s=>wmCoche(c,Math.round(wmSX(s.x*TS+8)),Math.round(wmSY(s.y*TS)-(petit?5:9)),petit?5:7));
      src.filter(s=>!s.vu).forEach(s=>wmBulle(c,Math.round(wmSX(s.x*TS+8)),Math.round(wmSY(s.y*TS)-14+bob),petit,s.f.cle?'!':'?'));
      // l'objectif
      cibles().filter(([x,y])=>!src.some(s=>!s.vu&&s.x===x&&s.y===y)).forEach(([x,y])=>wmFleche(c,wmSX(x*TS+8),wmSY(y*TS)-6+bob,petit));
      // toi, si tu es sur ce site
      {const p=ici();if(p)wmToi(c,Math.round(wmSX(p[0]*TS+8)),Math.round(wmSY(p[1]*TS+8)),petit,t)}
      wmCurseur(c,wmCX(),wmCY(),Math.max(TS*z,16),t);
    },
    info(){
      const cx=WM.cx,cy=WM.cy,k=id+','+cx+','+cy+','+voyCle()+','+S.map,Z=atlasZone(m,cx,cy),pres=(x,y)=>Math.abs(x-cx)<=1&&Math.abs(y-cy)<=2,N=[],src=L.src||[];
      src.filter(s=>pres(s.x,s.y)).forEach(s=>N.push(s.vu?['ok','Déjà noté : '+s.f.t]:s.f.cle?['go','Info clé à noter : '+s.f.ou]:['inf','Information à noter : '+s.f.ou]));
      if(L.chef&&pres(L.chef.x,L.chef.y)){const q=L.chef.who,n=voyClesManquantes(sid).length;N.push(voyTampon(sid)?['ok','Tampon obtenu auprès de '+q]:n?['no',`Défi final : ${q} attend que tu aies les infos clés (encore ${n})`]:['go',`Défi final : ${q} t'attend`])}
      else if(cibles().some(([x,y])=>pres(x,y)&&!src.some(s=>!s.vu&&s.x===x&&s.y===y)))N.push(['go','Ton objectif est ici']);
      const p=ici();if(p&&pres(Math.round(p[0]),Math.round(p[1])))N.push(['me','Tu es ici']);
      return {k,t:Z[0],d:Z[1],N};
    }};
  return L;
}

/* ================= CE QUE LA CARTE DEMANDE (interface/carte.js) ================= */
/* la description d'un lieu : 'pays', ou la carte d'un site ouvert ; null pour tout le reste (la ville est décrite dans interface/carte.js) */
function atlasLieu(id){
  if(id==='pays')return ATLAS_PAYS;
  if(ATLAS.plans[id])return ATLAS.plans[id];
  const sid=atlasSiteDe(id);return sid&&MAPS[id]?(ATLAS.plans[id]=atlasPlan(id,sid)):null;
}
/* sur la carte de la ville : ce que dit l'encart devant la gare et son quai, une fois la gare rouverte */
function atlasGare(quai){
  const n=VOY.ordre.filter(id=>VOY.sites[id].ouvert).length;
  return {t:quai?'Quai de la gare':'Gare d’Ampère-sur-Loire',d:quai?`Un train attend à quai. ${n} lignes au départ : dézoome la carte pour voir où elles mènent.`:`Rouverte. ${n} lignes en partent : vers ceux qui produisent l'électricité, et vers ceux qui l'avalent.`,s:['go','Dézoome (−) pour voir tout le pays']};
}
/* tant que le joueur n'a jamais vu la carte du pays, le bouton « Pays » clignote (interface/carte.js le demande à chaque changement de carte) */
function atlasNouveau(){const v=voyEtat();if(v.faits['carte.pays'])return false;if(WM.lieu!=='pays')return true;v.faits['carte.pays']=1;save();return false}
