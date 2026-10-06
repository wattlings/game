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
const VOY_TEINTES={herbe:['#73bf65','#7cc56a','#86cc72'],brin:['#58a551','#9bdc88'],chemin:['#e6d8ae','#cdbb88','#b9a672','#f6eed6'],pierre:['#b9b4a6','#8f8a7c','#dcd8cc'],eau:['#3f8fd0','#2f78b8','#6fb4e6','#d8effa']};

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
  lavande(c,d,X,Y,x,y){artLavender(c,X,Y,x,y)},
  /* eau (mer, lac, rivière) : carte.teintes.eau = [fond, vague sombre, vague claire, écume]. L'écume borde tout ce qui n'est pas de l'eau */
  eau(c,d,X,Y,x,y,at,m){
    const E=m.T.eau,w=t=>t==='~'||t===undefined;R(c,X,Y,16,16,E[0]);
    for(let i=0;i<3;i++){const a=(wh(x*3+i,y,940)*12)|0,b=2+i*5+((wh(x,y*3+i,941)*3)|0);R(c,X+a,Y+b,4,1,i%2?E[2]:E[1]);R(c,X+a+1,Y+b+1,2,1,E[1])}
    if(!w(at(0,-1))){R(c,X,Y,16,2,E[3]);R(c,X,Y+2,16,1,E[2]);for(let k=0;k<16;k+=4)R(c,X+k+((x+k)%3),Y+3,2,1,E[3])}
    if(!w(at(0,1))){R(c,X,Y+14,16,2,E[3]);R(c,X,Y+13,16,1,E[2])}
    if(!w(at(-1,0))){R(c,X,Y,2,16,E[3]);R(c,X+2,Y,1,16,E[2])}
    if(!w(at(1,0))){R(c,X+14,Y,2,16,E[3]);R(c,X+13,Y,1,16,E[2])}
  },
  /* ponton de bois : des planches en travers */
  ponton(c,d,X,Y,x,y,at){
    R(c,X,Y,16,16,'#a07845');for(let k=0;k<16;k+=4){R(c,X+k,Y,1,16,'#6b4a2b');R(c,X+k+1,Y,1,16,'#c9a26e');R(c,X+k+2,Y+((wh(x*4+k,y,950)*12)|0),1,2,'#8a6538')}
    if(at(0,-1)==='~'){R(c,X,Y,16,2,'#6b4a2b')}if(at(0,1)==='~'){R(c,X,Y+14,16,2,'#553920');for(let k=2;k<16;k+=8)R(c,X+k,Y+16,2,5,'#553920')}
  },
  /* sable : plage, grève */
  sable(c,d,X,Y,x,y){
    R(c,X,Y,16,16,'#ead9a6');for(let i=0;i<8;i++)R(c,X+((wh(x*3+i,y,942)*15)|0),Y+((wh(x,y*3+i,943)*15)|0),1,1,i%3?'#d9c58c':'#f6ecc8');
    if(wh(x,y,944)<.12){R(c,X+6,Y+8,3,2,'#f7f4ec');R(c,X+6,Y+10,3,1,'#cfc6a8')}else if(wh(x,y,944)<.2)R(c,X+3,Y+5,4,1,'#c9b47c');
  },
  /* asphalte : routes, parkings, quais de port */
  asphalte(c,d,X,Y,x,y,at,m,o){
    R(c,X,Y,16,16,(o&&o.teinte)||'#6f7480');for(let i=0;i<7;i++)R(c,X+((wh(x*3+i,y,945)*15)|0),Y+((wh(x,y*3+i,946)*15)|0),1,1,i%2?'#5d626e':'#858a96');
    if(o&&o.ligne&&x%2===0)R(c,X+3,Y+7,10,2,'#f2c12e');
  },
  /* neige : en altitude */
  neige(c,d,X,Y,x,y){
    R(c,X,Y,16,16,'#f1f5f8');for(let i=0;i<5;i++)R(c,X+((wh(x*3+i,y,947)*14)|0),Y+((wh(x,y*3+i,948)*15)|0),2,1,i%2?'#dbe6ee':'#ffffff');
    if(wh(x,y,949)<.1){R(c,X+8,Y+9,4,3,'#8f8a7c');R(c,X+8,Y+9,4,1,'#b9b4a6')}
  },
  /* sol technique : les dalles claires des salles (o.teinte pour colorer une allée, o.grille pour des dalles perforées) */
  dalleTech(c,d,X,Y,x,y,at,m,o){
    const T=(o&&o.teinte)||'#e3e7ec';R(c,X,Y,16,16,T);R(c,X,Y,16,1,tint(T,.12));R(c,X,Y,1,16,tint(T,.12));R(c,X+15,Y,1,16,tint(T,-.14));R(c,X,Y+15,16,1,tint(T,-.14));
    if(o&&o.grille)for(let j=3;j<14;j+=3)for(let i=3;i<14;i+=3)R(c,X+i,Y+j,1,1,tint(T,-.3));
  },
  /* mur d'intérieur : vu de dessus, avec sa face quand la case du dessous est un sol (carte.mur = {dessus, face, plinthe}) */
  mur(c,d,X,Y,x,y,at,m){
    const M=m.mur||{dessus:'#2b3148',face:'#dfe4ea',plinthe:'#8a93a3'},b=at(0,1),face=b!==undefined&&b!==at(0,0);
    if(face){R(c,X,Y,16,16,M.face);R(c,X,Y,16,3,M.dessus);R(c,X,Y+3,16,1,tint(M.face,.15));R(c,X,Y+13,16,3,M.plinthe);if(x%2===0)R(c,X,Y+4,1,9,tint(M.face,-.08))}
    else{R(c,X,Y,16,16,M.dessus);R(c,X,Y,16,1,tint(M.dessus,.12))}
  },
  /* bâtiment vu de face, peint d'un bloc à partir de sa case haut-gauche (toutes les cases voisines de même caractère).
     Dans la légende : {sol:'gravier', pose:'batiment', mur:'#…', toit:'#…', toitH:9, porte:[case, largeur en pixels, couleur], plaque:'PDL',
                        fenetres:nombre (ou liste de positions en pixels), grilles:1, bande:'#…', danger:1} */
  batiment(c,d,X,Y,x,y,at,m,o){
    const moi=at(0,0);if(at(-1,0)===moi||at(0,-1)===moi)return;
    o=o||{};let w=0,h=0;while(at(w,0)===moi)w++;while(at(0,h)===moi)h++;const W=w*16,H=h*16,mur=o.mur||'#d9d5c8',toit=o.toit||'#8f8b80',tH=o.toitH||9;
    R(c,X-1,Y+H-2,W+3,3,'rgba(20,30,30,.3)');
    R(c,X,Y+tH-1,W,H-tH,mur);R(c,X,Y+tH-1,W,1,tint(mur,.2));R(c,X+W-1,Y+tH-1,1,H-tH,tint(mur,-.18));R(c,X,Y+H-3,W,2,tint(mur,-.25));
    for(let k=16;k<W;k+=16)R(c,X+k,Y+tH,1,H-tH-3,tint(mur,-.08));
    if(o.bande)R(c,X,Y+tH+2,W,3,o.bande);
    R(c,X-2,Y,W+4,tH,toit);R(c,X-2,Y,W+4,2,tint(toit,.2));R(c,X-2,Y+tH-1,W+4,1,tint(toit,-.25));
    const bas=Y+H-2;
    if(o.fenetres){const F=Array.isArray(o.fenetres)?o.fenetres:Array.from({length:o.fenetres},(v,k)=>Math.round(W/(o.fenetres+1)*(k+1)-4));for(const f of F){const a=X+f;R(c,a,Y+tH+7,8,7,'#1c2440');R(c,a+1,Y+tH+8,6,5,'#8ec9e8');R(c,a+1,Y+tH+8,6,1,'#c9ecfa');R(c,a+4,Y+tH+8,1,5,'#1c2440')}}
    if(o.porte){const [pc,pl,col]=o.porte,px=X+pc*16+Math.round((16-pl)/2),ph=Math.min(H-tH-4,18);R(c,px,bas-ph,pl,ph,col||'#4f6f58');R(c,px,bas-ph,pl,1,tint(col||'#4f6f58',.25));if(pl>12)R(c,px+(pl>>1)-1,bas-ph,2,ph,tint(col||'#4f6f58',-.25));R(c,px+pl-4,bas-(ph>>1),1,3,'#e8e4d6');
      if(o.plaque){const l=o.plaque.length*4+3;R(c,px+((pl-l)>>1),bas-ph-8,l,7,'#f2c12e');txt35(c,o.plaque,px+((pl-l)>>1)+2,bas-ph-7,'#1c2440',1)}}
    if(o.grilles)[X+5,X+W-13].forEach(a=>{R(c,a,Y+tH+5,8,6,'#8a8f9a');for(let j=0;j<3;j++)R(c,a+1,Y+tH+6+j*2,6,1,'#59627c')});
    if(o.danger){R(c,X+W-12,bas-9,7,6,'#f2c12e');R(c,X+W-9,bas-8,1,3,'#1c2440');R(c,X+W-9,bas-4,1,1,'#1c2440')}
  }
};
/* ce qui compte comme « sol dur » : pas de liseré entre deux de ces cases */
const VOY_DUR=new Set(['=','g','d','q','b','D','E','a','s']);

/* les pinceaux « posés » : ils se dessinent par-dessus le sol, dans un second passage, pour ne pas être rognés par la case voisine */
const VOY_POSES=new Set(['grillage','muret','rocher','buisson','arbre','batiment']);

/* ---- peindre une carte : le sol de chaque case d'abord, puis ce qui est posé dessus ----
   Dans la légende d'un site, un caractère renvoie à :
     'chemin'                         un pinceau de sol ;
     'arbre'                          un pinceau posé (sur de l'herbe) ;
     une fonction                     un dessin propre au site, posé sur de l'herbe ;
     {sol:'gravier', pose:fonction}   un dessin propre au site, posé sur le sol indiqué ;
     {sol:'dalleTech', teinte:'#…'}   un pinceau avec ses options (elles lui arrivent en dernier argument). */
function voyPeindre(sol,devant,m){
  artInit();
  const g=m.g,H=g.length,W=g[0].length,L=m.legende,T=m.T=Object.assign({},VOY_TEINTES,m.teintes||{});
  const G0=GCOL.slice(),T0=GT.slice();GCOL.splice(0,3,...T.herbe);GT.splice(0,2,...T.brin);     // l'herbe du jeu prend les couleurs du site le temps de peindre
  /* pour un caractère : [pinceau de sol, pinceau posé, options] */
  const lire=ch=>{let p=L[ch],s='herbe',q=null;if(typeof p==='string'){if(VOY_POSES.has(p))q=VOYP[p];else s=p}else if(typeof p==='function')q=p;else if(p){s=p.sol||'herbe';q=typeof p.pose==='string'?VOYP[p.pose]:p.pose||null}return[VOYP[s]||VOYP.herbe,q,p&&typeof p==='object'?p:null]};
  try{
    for(let passe=0;passe<2;passe++)for(let y=0;y<H;y++)for(let x=0;x<W;x++){
      const l=lire(g[y][x]),f=l[passe];if(f)f(sol,devant,x*TS,y*TS,x,y,(dx,dy)=>g[y+dy]&&g[y+dy][x+dx],m,l[2]);
    }
    if(m.finitions)m.finitions(sol,devant,m);
  }finally{GCOL.splice(0,3,...G0);GT.splice(0,2,...T0)}
}
