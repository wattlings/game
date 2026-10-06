/* Wattlings · jeu/voyages/peinture.js
   Peindre la carte d'un site de voyage : les sols et les éléments fixes, communs à toutes les destinations.
   Chaque site donne sa « légende » : pour chaque caractère de son plan, le nom d'un pinceau ci-dessous
   (ou une fonction à lui, pour ce qui n'existe que chez lui : les rangées de panneaux, un bâtiment…).
   La fonction voyPeindre, en bas du fichier, explique les formes que peut prendre une légende.

   Un pinceau reçoit (sol, devant, X, Y, x, y, autour, carte) :
     sol     ce qui est sous les personnages ; devant : ce qui passe devant eux (la cime d'un arbre) ;
     X, Y    le coin haut-gauche de la case, en pixels ; x, y : la case ;
     autour  autour(dx,dy) donne le caractère d'une case voisine. */

/* ---- couleurs du sol d'un site (carte.teintes) ; à défaut, celles-ci : une herbe ordinaire ---- */
const VOY_TEINTES={herbe:['#73bf65','#7cc56a','#86cc72'],brin:['#58a551','#9bdc88'],chemin:['#e6d8ae','#cdbb88','#b9a672','#f6eed6'],pierre:['#b9b4a6','#8f8a7c','#dcd8cc']};

const VOYP={
  /* herbe (ou garrigue, selon les teintes du site) : l'herbe du jeu, dans les couleurs du site, avec quelques cailloux */
  herbe(c,d,X,Y,x,y,at,m){
    artGrass(c,X,Y,x,y,false);const h=wh(x,y,901),T=m.T;
    if(h<.07){R(c,X+9,Y+7,3,2,T.pierre[0]);R(c,X+9,Y+9,3,1,T.pierre[1]);R(c,X+9,Y+7,1,1,T.pierre[2])}
    else if(h<.13){R(c,X+3,Y+10,2,1,T.pierre[0]);R(c,X+4,Y+11,2,1,T.pierre[1])}
    else if(h<.2&&m.fleur){R(c,X+5,Y+6,1,1,m.fleur);R(c,X+6,Y+5,1,1,m.fleur);R(c,X+11,Y+11,1,1,m.fleur)}
  },
  /* chemin de terre : un liseré plus foncé là où il touche l'herbe */
  chemin(c,d,X,Y,x,y,at,m){
    const [B,D,E,H]=m.T.chemin,G=m.T.herbe[1],dur=t=>VOY_DUR.has(t);R(c,X,Y,16,16,B);
    for(let i=0;i<6;i++){const a=(wh(x*3+i,y*7+1,902)*16)|0,b=(wh(x*5+2,y*3+i,903)*16)|0;R(c,X+a,Y+b,1,1,i<3?D:H)}
    if(wh(x,y,904)>.7)R(c,X+((wh(x,y,905)*12)|0),Y+((wh(x,y,906)*12)|0),2,1,D);
    if(!dur(at(0,-1))){R(c,X,Y,16,1,E);R(c,X,Y+1,16,1,D);for(let i=0;i<3;i++)R(c,X+((wh(x+i,y,907)*14)|0),Y,2,1,G)}
    if(!dur(at(0,1))){R(c,X,Y+15,16,1,E);R(c,X,Y+14,16,1,D);for(let i=0;i<3;i++)R(c,X+((wh(x,y+i,908)*14)|0),Y+15,2,1,G)}
    if(!dur(at(-1,0))){R(c,X,Y,1,16,E);R(c,X+1,Y,1,16,D);for(let i=0;i<3;i++)R(c,X,Y+((wh(x+i,y,909)*14)|0),1,2,G)}
    if(!dur(at(1,0))){R(c,X+15,Y,1,16,E);R(c,X+14,Y,1,16,D);for(let i=0;i<3;i++)R(c,X+15,Y+((wh(x,y+i,910)*14)|0),1,2,G)}
  },
  /* gravier : les zones techniques */
  gravier(c,d,X,Y,x,y){
    R(c,X,Y,16,16,'#cfcabb');
    for(let i=0;i<14;i++){const a=(wh(x*3+i,y,911)*16)|0,b=(wh(x,y*3+i,912)*16)|0;R(c,X+a,Y+b,1,1,['#b5b0a0','#e3dfd2','#a8a394','#dedacb'][i%4])}
    for(let i=0;i<3;i++){const a=(wh(x+i,y*5,913)*14)|0,b=(wh(x*5,y+i,914)*14)|0;R(c,X+a,Y+b,2,1,'#bdb8a8')}
  },
  /* dalles de terre cuite : les espaces d'accueil */
  dalles(c,d,X,Y,x,y){
    R(c,X,Y,16,16,'#b9744e');
    for(let j=0;j<2;j++)for(let i=0;i<2;i++){const k=wh(x*2+i,y*2+j,915),col=k<.33?'#d8946a':k<.66?'#d08a60':'#dc9c74';R(c,X+i*8+1,Y+j*8+1,7,7,col);R(c,X+i*8+1,Y+j*8+1,7,1,tint(col,.14));R(c,X+i*8+7,Y+j*8+2,1,6,tint(col,-.1))}
  },
  /* béton : dalle nue */
  beton(c,d,X,Y,x,y){
    R(c,X,Y,16,16,'#c9c5ba');for(let i=0;i<5;i++)R(c,X+((wh(x*3+i,y,916)*15)|0),Y+((wh(x,y*3+i,917)*15)|0),1,1,i%2?'#b6b2a6':'#d9d6cc');
    if(x%2===0)R(c,X,Y,1,16,'#b6b2a6');if(y%2===0)R(c,X,Y,16,1,'#b6b2a6');
  },
  /* quai : béton clair, bande d'éveil jaune du côté de la voie (en bas) */
  quai(c,d,X,Y,x,y){
    R(c,X,Y,16,16,'#d6d2c6');for(let i=0;i<4;i++)R(c,X+((wh(x*3+i,y,918)*15)|0),Y+((wh(x,y*3+i,919)*9)|0),1,1,i%2?'#c2beb2':'#e4e1d7');
    R(c,X,Y,16,1,'#ecebe4');R(c,X+(x%2?0:15),Y+1,1,10,'#c2beb2');
    R(c,X,Y+11,16,3,'#f2c12e');for(let i=1;i<16;i+=3)R(c,X+i,Y+12,1,1,'#c99a1c');R(c,X,Y+14,16,2,'#f7f4ec');
  },
  /* bord de quai : le nez du quai, puis le ballast */
  bordQuai(c,d,X,Y,x,y,at){
    VOYP.ballast(c,d,X,Y,x,y);
    if(at(0,-1)==='q'){R(c,X,Y,16,5,'#8f8b80');R(c,X,Y,16,1,'#b9b5a9');R(c,X,Y+5,16,2,'rgba(30,30,40,.3)')}
  },
  ballast(c,d,X,Y,x,y){
    R(c,X,Y,16,16,'#8f8878');for(let i=0;i<16;i++)R(c,X+((wh(x*3+i,y,920)*15)|0),Y+((wh(x,y*3+i,921)*15)|0),2,1,['#7a7466','#a39c8a','#6d675a','#b0a996'][i%4]);
  },
  /* voie ferrée : ballast, traverses, deux rails */
  rails(c,d,X,Y,x,y){
    VOYP.ballast(c,d,X,Y,x,y);
    for(let k=1;k<16;k+=5){R(c,X+k,Y+3,3,12,'#5a4630');R(c,X+k,Y+3,1,12,'#6f593f')}
    [5,12].forEach(ry=>{R(c,X,Y+ry,16,2,'#8a8f9a');R(c,X,Y+ry,16,1,'#c4c9cf');R(c,X,Y+ry+2,16,1,'rgba(30,30,40,.35)')});
  },
  /* grillage : la clôture verte des sites industriels */
  grillage(c,d,X,Y,x,y,at,m){
    const f=t=>t==='f',L0=f(at(-1,0)),R0=f(at(1,0)),U0=f(at(0,-1)),D0=f(at(0,1)),hz=L0||R0||!(U0||D0),V='#3f6b52',V2='#5c8a6e',V3='#2c4d3a';
    const poteau=px=>{R(c,X+px-1,Y+15,4,1,'rgba(20,40,30,.28)');R(c,X+px,Y+1,2,14,V);R(c,X+px,Y+1,1,14,V2);R(c,X+px,Y,2,1,V2)};
    if(hz){const a=L0?0:2,w=16-a-(R0?0:2);R(c,X+a,Y+3,w,10,'rgba(92,138,110,.28)');for(let k=a;k<a+w;k+=2)R(c,X+k,Y+3,1,10,'rgba(63,107,82,.6)');[3,7,12].forEach(ry=>R(c,X+a,Y+ry,w,1,ry===3?V2:V));R(c,X+a,Y+13,w,1,V3);poteau(L0?7:2);if(!R0)poteau(12)}
    if(U0||D0){const a=U0?0:3,hh=(D0?16:13)-a;R(c,X+7,Y+a,2,hh,V);R(c,X+7,Y+a,1,hh,V2);R(c,X+9,Y+a,1,hh,'rgba(20,40,30,.25)');for(let k=a+1;k<a+hh;k+=3)R(c,X+6,Y+k,4,1,V3);if(!hz)poteau(7)}
  },
  /* muret de pierre sèche (carte.pierres : six tons, du plus courant au plus sombre) */
  muret(c,d,X,Y,x,y,at,m){
    const S=m.pierres||['#a8a395','#b9b4a6','#9a9588','#c4bfb0','#dcd8cc','#5f5b51'],g=t=>t==='m',L0=g(at(-1,0)),R0=g(at(1,0)),a=L0?0:1,w=16-a-(R0?0:1);
    R(c,X+a,Y+15,w,1,'rgba(20,40,30,.3)');R(c,X+a,Y+4,w,11,S[5]);
    [[7,0],[11,3]].forEach(([ry,off],r)=>{for(let sx=-off;sx<16;sx+=6){const p=Math.max(a,sx),q=Math.min(a+w,sx+5)-p;if(q<=0)continue;const col=S[(wh(x*3+sx,y,922+r)*3)|0];R(c,X+p,Y+ry,q,3,col);R(c,X+p,Y+ry,q,1,tint(col,.2))}});
    R(c,X+a,Y+3,w,3,S[3]);R(c,X+a,Y+3,w,1,S[4]);R(c,X+(x%2?5:11),Y+3,1,3,tint(S[3],-.15));
  },
  rocher(c,d,X,Y,x,y,at,m){c.drawImage(ART.rock[wh(x,y,923)>.5?1:0],X,Y)},
  buisson(c,d,X,Y,x,y,at,m){const B=(m.region&&ART.bushR&&ART.bushR[m.region])||ART.bush;c.drawImage(B[(wh(x,y,924)*3)|0],X,Y-1)},
  /* arbre : le pied sur le sol, la cime devant les personnages. carte.essence(x,y) choisit l'essence
     (0 chêne, 1 sapin, 2 bouleau, 3 pommier, 4 cyprès, 5 olivier, 6 peuplier). */
  arbre(c,d,X,Y,x,y,at,m){
    const h=wh(x,y,925),s=ART.tree[m.essence?m.essence(x,y,h):0][(h*3)|0],sx=X-3+(((h*7)|0)%3-1),sy=Y-14;
    c.drawImage(s,0,14,22,16,sx,sy+14,22,16);d.drawImage(s,0,0,22,14,sx,sy,22,14);
  },
  lavande(c,d,X,Y,x,y){artLavender(c,X,Y,x,y)}
};
/* ce qui compte comme « sol dur » : pas de liseré entre deux de ces cases */
const VOY_DUR=new Set(['=','g','d','q','b','D','E']);

/* les pinceaux « posés » : ils se dessinent par-dessus le sol, dans un second passage, pour ne pas être rognés par la case voisine */
const VOY_POSES=new Set(['grillage','muret','rocher','buisson','arbre']);

/* ---- peindre une carte : le sol de chaque case d'abord, puis ce qui est posé dessus ----
   Dans la légende d'un site, un caractère renvoie à :
     'chemin'                         un pinceau de sol ;
     'arbre'                          un pinceau posé (sur de l'herbe) ;
     une fonction                     un dessin propre au site, posé sur de l'herbe ;
     {sol:'gravier', pose:fonction}   un dessin propre au site, posé sur le sol indiqué. */
function voyPeindre(sol,devant,m){
  artInit();
  const g=m.g,H=g.length,W=g[0].length,L=m.legende,T=m.T=Object.assign({},VOY_TEINTES,m.teintes||{});
  const G0=GCOL.slice(),T0=GT.slice();GCOL.splice(0,3,...T.herbe);GT.splice(0,2,...T.brin);     // l'herbe du jeu prend les couleurs du site le temps de peindre
  const lire=ch=>{let p=L[ch],s='herbe',q=null;if(typeof p==='string'){if(VOY_POSES.has(p))q=VOYP[p];else s=p}else if(typeof p==='function')q=p;else if(p){s=p.sol||'herbe';q=typeof p.pose==='string'?VOYP[p.pose]:p.pose}return[VOYP[s]||VOYP.herbe,q]};
  try{
    for(let passe=0;passe<2;passe++)for(let y=0;y<H;y++)for(let x=0;x<W;x++){
      const f=lire(g[y][x])[passe];if(f)f(sol,devant,x*TS,y*TS,x,y,(dx,dy)=>g[y+dy]&&g[y+dy][x+dx],m);
    }
    if(m.finitions)m.finitions(sol,devant,m);
  }finally{GCOL.splice(0,3,...G0);GT.splice(0,2,...T0)}
}
