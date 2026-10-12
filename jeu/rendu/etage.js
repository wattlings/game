/* Wattlings · jeu/rendu/etage.js
   Dessin de l'étage « Bureau » (monde/etage.js) : sols, murs, fenêtres, puis tout le mobilier, peints une fois pour toutes.
   Seules les portes coulissantes du sas et le voyant du lecteur de badge sont redessinés à chaque image. */

/* lettres qui manquaient à la petite police 3×5 (rendu/decor-velos.js), pour les plaques de porte */
Object.assign(F35,{J:'001001001101111',K:'101110100110101',Q:'111101101111001',W:'101101101111101',X:'101101010101101',Y:'101101010010010',Z:'111001010100111'});

const ETC={moqS:['#93a9cf','#8ea4ca'],moqSP:['#869cc3','#a1b5d8'],moqC:['#55678f','#516289'],moqCP:['#4a5b82','#61739b'],parq:['#dcc49a','#d4ba8d','#e2cca4'],parqJ:'#b99c6d',carr:'#ebe9e3',joint:'#d6d3cb',dessus:'#3d4252',face:'#e9e6de',plinthe:'#a3a9b5',
  vitre:'#a9d8f0',reflet:'#e2f4fc',cadre:'#59627a',dehors:'#e3e7ee',point:'#c7cdd8',bois:'#c89b63',boisB:'#9a6f3e',boisV:'#b98c55',blanc:'#f3f2ee',blancB:'#c9c6bd',noir:'#2b2c33',noirD:'#1e1f25'};
/* la façade en biais, en cases : de (20,45 ; 0) à (0 ; 32,27) ; ses deux fenêtres côté ouest (rangées) */
const ETAGE_BIAIS=[20.45,32.27],ETAGE_BIAIS_FEN=[[2.2,5.6],[22.6,25.2],[27.4,30.2]];
const etBiaisX=y=>ETAGE_BIAIS[0]*(1-y/ETAGE_BIAIS[1]);

function etagePeindre(c,dessus,m){
  const S0=m.sol,H=S0.length,W=S0[0].length,at=(x,y)=>S0[y]&&S0[y][x];
  const biais=(x,y)=>y>0&&y<H-1&&x<=21&&at(x,y)==='W'&&x<etBiaisX(y)+.001&&x+1>etBiaisX(y+1)-.001;
  const plein=(x,y)=>{const t=at(x,y);return t!==undefined&&'WwhPBf'.includes(t)};   // ce qui se raccorde à un mur
  // le sol d'une case : o moquette, c carrelage, x dehors ; null pour un mur
  // le sol d'une case : s moquette claire (salles), o moquette foncée (couloirs), c carrelage, p parquet, x dehors ; null pour un mur
  const moq=(x,y)=>etageSalle(x,y)?'s':'o';
  const sol=(x,y)=>{const t=at(x,y);if(t===undefined||t==='x')return 'x';if(biais(x,y))return moq(x,y);if(t==='c')return 'c';if(t==='q')return 'p';
    if(t==='d'){const v=[[0,1],[0,-1],[1,0],[-1,0]].map(([a,b])=>at(x+a,y+b));return v.includes('c')?'c':'o'}return 'ogkr'.includes(t)?moq(x,y):null};
  const peindreSol=(k,X,Y,x,y)=>k==='c'?etCarrelage(c,X,Y):k==='p'?etParquet(c,X,Y,x,y):k==='x'?etDehors(c,X,Y):etMoquette(c,X,Y,x,y,k==='s');
  // 1. les sols, y compris sous les murs : chaque quart de case prend le sol du voisin le plus proche
  for(let y=0;y<H;y++)for(let x=0;x<W;x++){
    const X=x*16,Y=y*16,k=sol(x,y);if(k){peindreSol(k,X,Y,x,y);continue}
    const N=sol(x,y-1),Su=sol(x,y+1),O=sol(x-1,y),E=sol(x+1,y),df=Su||N||O||E||'o';
    [[0,0,N||O],[8,0,N||E],[0,8,Su||O],[8,8,Su||E]].forEach(([a,b,q])=>{c.save();c.beginPath();c.rect(X+a,Y+b,8,8);c.clip();peindreSol(q||df,X,Y,x,y);c.restore()});
  }
  // 2. les murs : une bande de 8 px au milieu de la case, raccordée aux murs voisins ; vue de face (8 px de haut) quand une pièce est au sud
  for(let y=0;y<H;y++)for(let x=0;x<W;x++){
    const t=at(x,y),X=x*16,Y=y*16;
    if(t==='r'){R(c,X,Y,16,16,'#bdb9b0');for(let i=0;i<4;i++){R(c,X+i*4,Y,4,16,i%2?'#cfccc4':'#c4c0b7');R(c,X+i*4,Y,1,16,'#9e9a90')}
      if(at(x,y-1)!=='r'){R(c,X,Y,16,2,'#7a8292');R(c,X,Y+2,16,1,'#d9d6cf')}if(at(x,y+1)!=='r')R(c,X,Y+14,16,2,'#7a8292');continue}
    if(t==='d'){const horiz=plein(x-1,y)||plein(x+1,y);if(horiz){R(c,X,Y+6,2,10,'#6b7287');R(c,X+14,Y+6,2,10,'#6b7287');R(c,X+2,Y+15,12,1,'rgba(40,46,64,.35)')}else{R(c,X+4,Y,8,2,'#6b7287');R(c,X+4,Y+14,8,2,'#6b7287')}continue}
    if(!plein(x,y)||biais(x,y))continue;
    const sud=sol(x,y+1),face=!!sud&&sud!=='x';
    if(t==='P'){R(c,X,Y,16,16,ETC.face);const g=at(x-1,y)!=='P';R(c,X,Y,16,3,'#2b2f3a');
      R(c,g?X+2:X,Y+3,14,13,'#6b7280');R(c,g?X+3:X,Y+4,13,12,g?'#c3c8d0':'#b6bcc5');R(c,g?X+15:X,Y+4,1,12,'#4a4f5c');
      R(c,g?X+6:X+4,Y+6,1,8,'rgba(255,255,255,.45)');if(g)px35(c,'3',X+13,Y,'#e2573b');continue}
    if(t==='B'){if(face)etFace(c,X,Y);else R(c,X,Y,16,16,ETC.dessus);continue}
    const up=plein(x,y-1),dn=plein(x,y+1),lf=plein(x-1,y),rt=plein(x+1,y),D=ETC.dessus;
    if(t==='f'){R(c,X,Y+6,16,2,'#5b6478');c.fillStyle='rgba(185,225,244,.6)';c.fillRect(X,Y+8,16,7);R(c,X+3,Y+9,1,5,'rgba(255,255,255,.75)');R(c,X+5,Y+9,1,2,'rgba(255,255,255,.6)');
      if(x%2===0)R(c,X,Y+8,1,7,'#8a93a6');R(c,X,Y+15,16,1,'#8a93a6');continue}
    if(face){
      const x0=lf?0:4,x1=rt?16:12;
      if(up)R(c,X+4,Y,8,6,D);R(c,X+x0,Y+6,x1-x0,2,D);
      R(c,X+x0,Y+8,x1-x0,8,ETC.face);R(c,X+x0,Y+8,x1-x0,1,'#d6d2c8');R(c,X+x0,Y+14,x1-x0,2,ETC.plinthe);
      if(t==='w'){const g=at(x-1,y)==='w',d=at(x+1,y)==='w';R(c,X+(g?0:1),Y+8,16-(g?0:1)-(d?0:1),6,ETC.cadre);R(c,X+(g?0:2),Y+9,16-(g?0:2)-(d?0:2),4,ETC.vitre);R(c,X+((x*5)%9)+2,Y+10,3,1,ETC.reflet)}
      if(t==='h'){R(c,X+4,Y+2,8,14,'#5a3a22');R(c,X+5,Y+3,6,13,'#8a5f36');R(c,X+6,Y+5,4,3,'#9a6d42');R(c,X+6,Y+10,4,3,'#9a6d42');R(c,X+9,Y+9,1,1,'#d9c79a')}
      continue}
    R(c,X+4,Y+4,8,8,D);if(up)R(c,X+4,Y,8,4,D);if(dn)R(c,X+4,Y+12,8,4,D);if(lf)R(c,X,Y+4,4,8,D);if(rt)R(c,X+12,Y+4,4,8,D);
    if(t==='w'){if(up||dn){R(c,X+5,Y,6,16,ETC.cadre);R(c,X+6,Y,4,16,ETC.vitre);R(c,X+7,Y+((y*7)%9)+2,1,4,ETC.reflet)}else{R(c,X,Y+5,16,6,ETC.cadre);R(c,X,Y+6,16,4,ETC.vitre);R(c,X+((x*7)%9)+2,Y+7,4,1,ETC.reflet)}}
    if(t==='h'){if(up||dn){R(c,X+4,Y+1,8,14,'#8a5f36');R(c,X+4,Y+1,1,14,'#5a3a22');R(c,X+10,Y+7,1,2,'#d9c79a')}else{R(c,X+1,Y+4,14,8,'#8a5f36');R(c,X+1,Y+4,14,1,'#5a3a22')}}
  }
  // la façade en biais : le dehors, la ligne de façade, ses fenêtres
  const [bx,by]=ETAGE_BIAIS;
  c.save();c.beginPath();c.moveTo(0,0);c.lineTo(bx*16,0);c.lineTo(0,by*16);c.closePath();c.clip();
  for(let y=0;y<Math.ceil(by);y++)for(let x=0;x<Math.ceil(bx);x++)etDehors(c,x*16,y*16);c.restore();
  const seg=(a,b,w,col)=>{c.strokeStyle=col;c.lineWidth=w;c.beginPath();c.moveTo(etBiaisX(a)*16+w/2-1,a*16);c.lineTo(etBiaisX(b)*16+w/2-1,b*16);c.stroke()};
  seg(0.6,by-.2,4,ETC.dessus);ETAGE_BIAIS_FEN.forEach(([a,b])=>{seg(a,b,3,ETC.cadre);seg(a,b,1.5,ETC.vitre)});
  // le mobilier : d'abord les tables (les écrans se posent dessus), puis le reste, du nord au sud
  const M=m.meubles.slice().sort((a,b)=>(a.k==='table'?0:1)-(b.k==='table'?0:1)||a.y-b.y||a.x-b.x);
  M.forEach(f=>etMeuble(c,f));
  ETAGE_PLAQUES.forEach(([txt,x,y])=>{const k=sol(x,y+1);etPlaque(c,txt,x,y,!!k&&k!=='x'&&plein(x,y))});
}

/* ---- sols et murs ---- */
function etMoquette(c,X,Y,x,y,salle){
  const B=salle?ETC.moqS:ETC.moqC,P=salle?ETC.moqSP:ETC.moqCP;R(c,X,Y,16,16,B[((x>>1)+(y>>1))%2]);
  const h=hash(x,y);R(c,X+((h*13)|0)%15,Y+((h*71)|0)%15,1,1,P[0]);R(c,X+((h*37)|0)%15,Y+((h*53)|0)%15,1,1,P[1]);
  if(h>.5)R(c,X+((h*91)|0)%15,Y+((h*29)|0)%15,1,1,P[1]);
}
/* parquet flottant : des lames est-ouest de 4 px, joints décalés d'une rangée à l'autre */
function etParquet(c,X,Y,x,y){
  for(let r=0;r<4;r++){const yy=Y+r*4,k=(y*4+r),o=((k*7)%4)*4;R(c,X,yy,16,4,ETC.parq[(k+x)%3]);R(c,X,yy+3,16,1,ETC.parqJ);
    const j=((k*11+x*16+o)%32);if(j<16)R(c,X+j,yy,1,3,ETC.parqJ);if(hash(x*4+r,y)>.7)R(c,X+((hash(y,x+r)*12)|0)+2,yy+1,3,1,'#c8ad80')}
}
function etCarrelage(c,X,Y){R(c,X,Y,16,16,ETC.carr);R(c,X,Y+7,16,1,ETC.joint);R(c,X,Y+15,16,1,ETC.joint);R(c,X+7,Y,1,16,ETC.joint);R(c,X+15,Y,1,16,ETC.joint)}
function etDehors(c,X,Y){R(c,X,Y,16,16,ETC.dehors);R(c,X+4,Y+4,1,1,ETC.point);R(c,X+12,Y+12,1,1,ETC.point)}
/* une face de mur pleine (cages d'ascenseur) */
function etFace(c,X,Y){R(c,X,Y,16,16,ETC.face);R(c,X,Y,16,1,'#d6d2c8');R(c,X,Y+13,16,3,ETC.plinthe)}
function etPlaque(c,txt,x,y,face){
  const w=txt.length*4+3,X=x*16+2,Y=y*16+(face?7:4);
  R(c,X,Y,w,9,'#5b6478');R(c,X+1,Y+1,w-2,7,'#f7f5ee');[...txt].forEach((ch,i)=>px35(c,ch,X+2+i*4,Y+2,'#2f3a5c'));
}

/* ---- le mobilier ---- */
const etOmbre=(c,X,Y,w,h)=>{c.fillStyle='rgba(20,24,40,.16)';c.fillRect(X,Y,w,h)};
function etMeuble(c,f){
  const X=f.x*16,Y=f.y*16,Wp=f.w*16,Hp=f.h*16;
  switch(f.k){
    case 'table':etOmbre(c,X+2,Y+Hp-2,Wp-2,2);
      if(f.bois){R(c,X+1,Y+1,Wp-2,Hp-3,ETC.bois);R(c,X+1,Y+Hp-3,Wp-2,2,ETC.boisB);for(let j=0;j<f.h;j++)R(c,X+3,Y+j*16+6,Wp-6,1,ETC.boisV);if(f.w===2&&f.h>1)R(c,X+15,Y+1,2,Hp-4,'#a97e4a')}
      else{R(c,X+1,Y+1,Wp-2,Hp-3,ETC.blancB);R(c,X+2,Y+2,Wp-4,Hp-6,ETC.blanc);R(c,X+1,Y+Hp-3,Wp-2,2,'#b3b0a7')}break;
    case 'poste':{const [dx,dy]=DIRS[f.d];etClavier(c,X+dx*16,Y+dy*16,f.d);etEcrans(c,X+dx*32,Y+dy*32,f.d);etChaise(c,X,Y,f.d,'bureau');break}
    case 'chaise':etChaise(c,X,Y,f.d,f.st||'blanche');break;
    case 'rond':etOmbre(c,X+3,Y+12,11,3);c.fillStyle=ETC.blancB;c.beginPath();c.arc(X+8,Y+8,7,0,7);c.fill();c.fillStyle=ETC.blanc;c.beginPath();c.arc(X+8,Y+7.5,6,0,7);c.fill();R(c,X+5,Y+5,2,1,'#ffffff');break;
    case 'ecran':etEcranMural(c,f);break;
    case 'canape':{const col=f.col,fonce='#6d727c',clair='#b9bec7';etOmbre(c,X,Y+Hp-2,Wp,2);
      if(f.d==='up'){R(c,X,Y+2,Wp,13,fonce);for(let i=0;i<f.w;i++){R(c,X+3+i*((Wp-6)/f.w),Y+3,(Wp-6)/f.w-1,8,clair);R(c,X+4+i*((Wp-6)/f.w),Y+4,(Wp-6)/f.w-3,1,'#d3d7de')}R(c,X+1,Y+11,Wp-2,4,col);R(c,X,Y+2,3,13,'#80858f');R(c,X+Wp-3,Y+2,3,13,'#80858f')}
      else if(f.d==='right'){R(c,X+1,Y,14,Hp,fonce);R(c,X+1,Y+1,4,Hp-2,col);for(let j=0;j<f.h;j++){R(c,X+5,Y+3+j*((Hp-6)/f.h),9,(Hp-6)/f.h-1,clair);R(c,X+6,Y+4+j*((Hp-6)/f.h),1,(Hp-6)/f.h-3,'#d3d7de')}R(c,X+1,Y,14,3,'#80858f');R(c,X+1,Y+Hp-3,14,3,'#80858f')}
      else{R(c,X,Y+1,Wp,13,fonce);R(c,X+1,Y+1,Wp-2,4,col);for(let i=0;i<f.w;i++)R(c,X+3+i*((Wp-6)/f.w),Y+5,(Wp-6)/f.w-1,8,clair)}break}
    case 'comptoir':etComptoir(c,X,Y);R(c,X+6,Y+4,6,1,'#c9c4b9');R(c,X+5,Y+10,4,3,'#e2573b');R(c,X+10,Y+9,3,4,'#f7f5ee');break;
    case 'tbasse':etOmbre(c,X+2,Y+12,12,2);R(c,X+2,Y+4,12,8,'#7a5230');R(c,X+3,Y+5,10,6,'#a0764a');R(c,X+5,Y+6,3,2,'#f3f2ee');break;
    case 'babyfoot':{etOmbre(c,X+2,Y+14,28,2);R(c,X+1,Y+2,30,12,'#6b4a2b');R(c,X+3,Y+4,26,8,'#3f9a4a');R(c,X+16,Y+4,1,8,'#e8f5e0');R(c,X+3,Y+6,1,4,'#e8f5e0');R(c,X+28,Y+6,1,4,'#e8f5e0');
      [6,10,14,18,22,26].forEach((rx,i)=>{R(c,X+rx,Y+1,1,14,'#c9ccd2');R(c,X+rx-1,Y+6+(i%2)*2,3,2,i<3?'#c43d3d':'#2f6db5')});R(c,X+15,Y+7,2,2,'#ffffff');break}
    case 'frigo':etOmbre(c,X+1,Y+14,14,2);R(c,X+1,Y-6,14,21,'#b8bec7');R(c,X+2,Y-5,12,19,'#eceff2');R(c,X+2,Y+1,12,1,'#b8bec7');R(c,X+3,Y-3,1,3,'#9aa1ab');R(c,X+3,Y+3,1,5,'#9aa1ab');break;
    case 'vaisselle':etComptoir(c,X,Y);R(c,X+4,Y+2,10,12,'#c9ccd2');for(let i=0;i<3;i++){R(c,X+5+i*3,Y+3,2,7,'#ffffff');R(c,X+5+i*3,Y+3,2,1,'#e2e5ea')}R(c,X+6,Y+11,3,2,'#f2a33a');R(c,X+10,Y+11,3,2,'#4a78c9');break;
    case 'evier':etComptoir(c,X,Y);R(c,X+4,Y+3,9,10,'#8f98a3');R(c,X+5,Y+4,7,8,'#c4cbd3');R(c,X+8,Y+7,1,1,'#6b7280');R(c,X+12,Y+7,3,2,'#7d858f');break;
    case 'microondes':etComptoir(c,X,Y);R(c,X+3,Y+2,11,11,'#3a3d44');R(c,X+4,Y+3,6,9,'#1c1f26');R(c,X+5,Y+4,1,3,'#5a606b');R(c,X+11,Y+4,2,1,'#3be07a');R(c,X+11,Y+7,2,4,'#565a63');break;
    case 'cafe':etComptoir(c,X,Y);R(c,X+4,Y+1,10,12,'#26272c');R(c,X+5,Y+2,8,3,'#3a3c43');R(c,X+5,Y+6,5,5,'#8a8f99');R(c,X+6,Y+8,3,3,'#ffffff');R(c,X+7,Y+8,1,1,'#6b4a2b');R(c,X+11,Y+3,2,1,'#f2a33a');break;
    case 'armoire':etOmbre(c,X,Y+14,Wp,2);R(c,X+1,Y+1,Wp-2,14,'#7d8794');R(c,X+2,Y+2,Wp-4,12,'#9aa3ae');for(let i=1;i<f.w*2;i++)R(c,X+i*8,Y+3,1,10,'#7d8794');
      for(let i=0;i<f.w;i++){const px=X+i*16+4;R(c,px,Y-2,7,4,'#c0663e');R(c,px+1,Y-1,5,1,'#9a4f2e');c.fillStyle=i%2?'#3f9a5f':'#2f7a4f';c.beginPath();c.arc(px+3.5,Y-5,5,0,7);c.fill();R(c,px-1,Y-7,2,3,'#58b56f');R(c,px+6,Y-8,2,3,'#58b56f');if(i===1){R(c,px+5,Y+1,1,6,'#3f9a5f');R(c,px+6,Y+5,1,4,'#3f9a5f')}}break;
    case 'casiers':etCasiers(c,f);break;
    case 'chariot':etOmbre(c,X+2,Y+13,12,2);R(c,X+2,Y+3,12,9,'#4a6fa5');R(c,X+3,Y+4,5,7,'#f2c12e');R(c,X+9,Y+4,4,7,'#8ec9e8');R(c,X+2,Y+12,2,2,'#26272c');R(c,X+12,Y+12,2,2,'#26272c');R(c,X+13,Y,1,4,'#9aa1ab');break;
    case 'balais':R(c,X+3,Y-4,1,16,'#8a5f36');R(c,X+1,Y+10,5,4,'#3a3d44');R(c,X+8,Y-3,1,15,'#8a5f36');R(c,X+6,Y+11,6,3,'#c43d3d');R(c,X+12,Y-2,1,14,'#8a5f36');R(c,X+11,Y+11,3,3,'#e8e2d0');break;
    case 'seau':etOmbre(c,X+4,Y+13,9,2);R(c,X+4,Y+6,9,8,'#e0a81e');R(c,X+5,Y+6,7,2,'#f2c12e');R(c,X+5,Y+7,7,1,'#5f8fb0');R(c,X+9,Y-4,1,11,'#8a5f36');break;
    case 'imprimante':etOmbre(c,X+1,Y+14,30,2);R(c,X+1,Y-3,30,17,'#b9bec6');R(c,X+2,Y-2,28,15,'#e3e5e9');R(c,X+2,Y-2,28,4,'#cfd3d9');R(c,X+20,Y+3,8,4,'#3a3d44');R(c,X+26,Y+4,1,1,'#3be07a');R(c,X+4,Y+4,12,6,'#ffffff');R(c,X+4,Y+9,12,1,'#d6d9de');break;
    case 'fournitures':R(c,X+1,Y-6,30,21,'#6b7280');for(let r=0;r<3;r++){R(c,X+2,Y-5+r*7,28,6,'#8a8f99');for(let i=0;i<5;i++)R(c,X+3+i*5+(r%2),Y-4+r*7,4,5,['#ffffff','#f2c12e','#4a78c9','#ffffff','#e2573b','#3f9a4a'][(r*5+i)%6])}break;
    case 'cabine':etCabine(c,f);break;
    case 'urinoir':R(c,X+4,Y,8,9,'#c9ced6');R(c,X+5,Y,6,8,'#f4f6f8');R(c,X+6,Y+3,4,3,'#dfe3e8');R(c,X+7,Y-3,2,3,'#9aa1ab');break;
    case 'lavabos':etLavabos(c,f);break;
    case 'serviettes':{const xo=f.mur==='w'?X-4:X+15;R(c,xo,Y+2,5,10,'#c9ced6');R(c,xo+1,Y+3,3,8,'#f4f6f8');R(c,xo+1,Y+9,3,1,'#9aa1ab');break}
    case 'poubelle':etOmbre(c,X+5,Y+13,7,2);R(c,X+5,Y+6,7,8,'#7d858f');R(c,X+5,Y+5,7,2,'#9aa1ab');R(c,X+7,Y+14,3,1,'#4a4f5c');break;
    case 'pmr':R(c,X+3,Y,10,3,'#e9ecf0');R(c,X+4,Y+2,8,8,'#c9ced6');R(c,X+5,Y+3,6,6,'#f4f6f8');R(c,X+6,Y+4,4,3,'#dfe3e8');R(c,X,Y+2,1,10,'#7d858f');R(c,X,Y+11,3,1,'#7d858f');R(c,X+15,Y+2,1,10,'#7d858f');
      R(c,X+12,Y-14,8,8,'#2f6db5');R(c,X+15,Y-13,2,2,'#ffffff');R(c,X+14,Y-11,2,3,'#ffffff');R(c,X+15,Y-9,3,1,'#ffffff');break;
    case 'banquette':{const tissu='#3a9590',dos='#245f5d';etOmbre(c,X,Y+14,Wp,2);
      if(f.d==='down'){R(c,X+1,Y+1,Wp-2,5,dos);R(c,X+1,Y+6,Wp-2,8,tissu);R(c,X+1,Y+13,Wp-2,1,dos)}else{R(c,X+1,Y+2,Wp-2,8,tissu);R(c,X+1,Y+10,Wp-2,5,dos)}
      for(let i=1;i<f.w;i++)R(c,X+i*16,Y+(f.d==='down'?6:2),1,8,dos);break}
    case 'pouf':etOmbre(c,X+3,Y+12,10,3);c.fillStyle='#00000030';c.beginPath();c.arc(X+8,Y+9,6,0,7);c.fill();c.fillStyle=f.col;c.beginPath();c.arc(X+8,Y+8,6,0,7);c.fill();R(c,X+5,Y+5,3,1,'rgba(255,255,255,.5)');break;
    case 'fatboy':etOmbre(c,X+1,Y+12,15,3);c.fillStyle='#c46a1e';c.beginPath();c.ellipse(X+8,Y+9,8,6,0,0,7);c.fill();c.fillStyle='#e58a2e';c.beginPath();c.ellipse(X+8,Y+8,7,5,-.3,0,7);c.fill();R(c,X+4,Y+6,5,1,'#f2a85a');R(c,X+9,Y+9,3,1,'#c46a1e');break;
    case 'ballon':etOmbre(c,X+3,Y+12,10,3);c.fillStyle='#2f5fb0';c.beginPath();c.arc(X+8,Y+7,6,0,7);c.fill();c.fillStyle='#4a86e0';c.beginPath();c.arc(X+7,Y+6,4.5,0,7);c.fill();R(c,X+5,Y+3,2,2,'#cfe2ff');break;
  }
}
/* une chaise, vue de dessus : d est la direction où regarde la personne assise (le dossier est de l'autre côté) */
function etChaise(c,X,Y,d,st){
  etOmbre(c,X+3,Y+13,10,2);
  if(st==='verte'){const a='#2f7a4f',b='#3f9a62';R(c,X+2,Y+2,12,12,a);R(c,X+4,Y+4,8,8,b);
    if(d==='down')R(c,X+2,Y+2,12,4,'#245f3e');else if(d==='up')R(c,X+2,Y+10,12,4,'#245f3e');else if(d==='left')R(c,X+10,Y+2,4,12,'#245f3e');else R(c,X+2,Y+2,4,12,'#245f3e');return}
  if(st==='blanche'){R(c,X+3,Y+4,10,9,'#c4c4bc');R(c,X+4,Y+5,8,7,'#f6f6f2');[[3,4],[12,4],[3,12],[12,12]].forEach(([a,b])=>R(c,X+a,Y+b,1,1,'#8f8f8f'));
    if(d==='down')R(c,X+3,Y+2,10,3,'#dcdcd5');else if(d==='up')R(c,X+3,Y+12,10,3,'#dcdcd5');else if(d==='left')R(c,X+12,Y+4,3,9,'#dcdcd5');else R(c,X+1,Y+4,3,9,'#dcdcd5');return}
  // fauteuil de bureau noir à roulettes (« haute » : dossier plus grand, appui-tête)
  const hb=st==='haute';R(c,X+2,Y+14,1,1,'#55575f');R(c,X+13,Y+14,1,1,'#55575f');R(c,X+7,Y+15,2,1,'#55575f');
  R(c,X+4,Y+4,8,8,ETC.noir);R(c,X+5,Y+5,6,1,'#3c3e48');R(c,X+3,Y+6,1,4,'#3c3e48');R(c,X+12,Y+6,1,4,'#3c3e48');
  const e=hb?5:4;
  if(d==='down'){R(c,X+3,Y+1-(hb?1:0),10,e,ETC.noirD);R(c,X+4,Y+1-(hb?1:0),8,1,'#44464f')}
  else if(d==='up'){R(c,X+3,Y+11,10,e,ETC.noirD);R(c,X+4,Y+11,8,1,'#44464f');if(hb)R(c,X+5,Y+15,6,1,ETC.noirD)}
  else if(d==='left'){R(c,X+11,Y+3,e,10,ETC.noirD);R(c,X+11,Y+3,1,10,'#44464f')}
  else{R(c,X+1-(hb?1:0),Y+3,e,10,ETC.noirD);R(c,X+e-(hb?1:0),Y+3,1,10,'#44464f')}
}
/* le clavier et la souris d'un poste, sur la première case de table devant la chaise */
function etClavier(c,X,Y,d){
  const k='#d6d9de',t='#b8bcc4';
  if(d==='up'){R(c,X+3,Y+8,9,3,t);R(c,X+3,Y+8,9,2,k);R(c,X+13,Y+8,2,3,k)}
  else if(d==='down'){R(c,X+4,Y+5,9,3,t);R(c,X+4,Y+5,9,2,k);R(c,X+1,Y+5,2,3,k)}
  else if(d==='left'){R(c,X+6,Y+3,3,9,t);R(c,X+6,Y+3,2,9,k);R(c,X+6,Y+13,3,2,k)}
  else{R(c,X+7,Y+4,3,9,t);R(c,X+8,Y+4,2,9,k);R(c,X+7,Y+1,3,2,k)}
}
/* les deux écrans d'un poste, au fond de la seconde case de table (dos à dos avec le poste d'en face) */
function etEcrans(c,X,Y,d){
  const cadre='#1c1f26',ecr='#5b8fd9',dos='#3a3e48',pied='#3a3d46';
  if(d==='up'){[0,8].forEach(a=>{R(c,X+a+1,Y+1,7,6,cadre);R(c,X+a+2,Y+2,5,4,ecr);R(c,X+a+2,Y+2,2,1,'#a9c8f5');R(c,X+a+3,Y+7,3,1,pied)})}
  else if(d==='down'){[0,8].forEach(a=>{R(c,X+a+1,Y+9,7,6,dos);R(c,X+a+2,Y+10,5,1,'#4a4f5c');R(c,X+a+3,Y+8,3,1,pied)})}
  else if(d==='left'){[0,8].forEach(b=>{R(c,X+1,Y+b+1,3,7,cadre);R(c,X+4,Y+b+2,1,5,ecr);R(c,X+5,Y+b+3,1,3,pied)})}
  else{[0,8].forEach(b=>{R(c,X+12,Y+b+1,3,7,cadre);R(c,X+11,Y+b+2,1,5,ecr);R(c,X+10,Y+b+3,1,3,pied)})}
}
/* un écran de présentation accroché au mur (vu de dessus : une barre sombre, la lumière côté salle) */
function etEcranMural(c,f){
  const X=f.x*16,Y=f.y*16,lum='rgba(120,170,255,.13)';
  if(f.mur==='e'){const L=f.h*16-4;R(c,X,Y+2,4,L,'#1c1f26');R(c,X-1,Y+3,1,L-2,'#6fa8ff');c.fillStyle=lum;c.fillRect(X-12,Y+2,11,L)}
  else if(f.mur==='w'){const L=f.h*16-4;R(c,X+12,Y+2,4,L,'#1c1f26');R(c,X+16,Y+3,1,L-2,'#6fa8ff');c.fillStyle=lum;c.fillRect(X+17,Y+2,11,L)}
  else{const L=f.w*16-4;R(c,X+2,Y,L,4,'#1c1f26');R(c,X+3,Y-1,L-2,1,'#6fa8ff');c.fillStyle=lum;c.fillRect(X+2,Y-11,L,10)}
}
function etComptoir(c,X,Y){R(c,X+1,Y,15,16,'#bdb8ad');R(c,X+3,Y,13,16,'#d9d5cc');R(c,X+3,Y+15,13,1,'#c9c4b9')}
/* des casiers blancs : quatre cases carrées les unes sur les autres */
function etCasiers(c,f){
  const X=f.x*16,Y=f.y*16,Wp=f.w*16,Hp=f.h*16,b='#f1f2f4',l='#c3c7ce',k='#8a909b';
  if(f.d==='down'){etOmbre(c,X,Y+14,Wp,2);R(c,X,Y-6,Wp,22,l);R(c,X+1,Y-5,Wp-2,20,b);
    for(let i=0;i<f.w*2;i++)for(let j=0;j<4;j++){const cx=X+1+i*8,cy=Y-5+j*5;R(c,cx,cy,7,1,l);R(c,cx+7,cy,1,5,l);R(c,cx+5,cy+2,1,1,k)}R(c,X,Y+14,Wp,2,l)}
  else if(f.d==='up'){R(c,X,Y+2,Wp,13,l);R(c,X+1,Y+3,Wp-2,11,'#e9ebee');for(let i=1;i<f.w*2;i++)R(c,X+i*8,Y+3,1,11,l)}
  else{const x0=f.d==='right'?X+1:X+3;R(c,x0,Y-4,12,Hp+3,l);R(c,x0+1,Y-3,10,Hp+1,b);const xp=f.d==='right'?x0+10:x0;
    for(let j=0;j<f.h*2;j++){R(c,x0+1,Y-3+j*8+7,10,1,l);R(c,xp,Y-2+j*8+3,1,1,k)}}
}
/* une cabine de WC (2×2 cases) : les cloisons, la cuvette au fond, la porte côté passage */
function etCabine(c,f){
  const X=f.x*16,Y=f.y*16,s=f.porte==='s',cl='#c7ccd6',bd='#9aa1ae';
  R(c,X,Y,32,32,'#e1dfd8');R(c,X,Y,2,32,bd);R(c,X+30,Y,2,32,bd);
  const ty=s?Y+3:Y+20;R(c,X+11,ty,10,3,'#e9ecf0');R(c,X+12,s?ty+3:ty-7,8,7,'#c9ced6');R(c,X+13,s?ty+4:ty-6,6,5,'#f4f6f8');R(c,X+14,s?ty+5:ty-5,4,2,'#dfe3e8');
  const py=s?Y+22:Y;R(c,X,py,32,10,cl);R(c,X,s?py:py+8,32,2,bd);R(c,X+8,py+1,16,8,'#b3bac6');R(c,X+9,py+2,14,6,'#bfc5d0');R(c,X+21,py+4,1,2,'#3be07a');
}
/* une rangée de lavabos le long d'un mur, avec les distributeurs de savon entre eux */
function etLavabos(c,f){
  const X=f.x*16,Y=f.y*16,n=f.n||3,sav=f.savon!==0;
  if(f.mur==='s'){R(c,X,Y+8,f.w*16,8,'#c9ced6');R(c,X,Y+9,f.w*16,6,'#e2e5ea');for(let i=0;i<n;i++){const bx=X+i*16+3;R(c,bx,Y+8,10,6,'#f4f6f8');R(c,bx+2,Y+9,6,4,'#cfd6de');R(c,bx+4,Y+13,2,2,'#7d858f')}return}
  const e=f.mur==='e',x0=e?X+6:X,L=f.h*16;R(c,x0,Y,10,L,'#c9ced6');R(c,e?x0+1:x0,Y,9,L,'#e2e5ea');
  for(let i=0;i<n;i++){const by=Y+i*32+2;R(c,x0+1,by,8,11,'#f4f6f8');R(c,x0+2,by+2,6,7,'#cfd6de');R(c,e?x0+8:x0,by+5,2,2,'#7d858f');
    if(sav&&i<n-1){const sy=by+21;R(c,e?x0+7:x0,sy,3,5,'#ffffff');R(c,e?x0+7:x0,sy,3,1,'#9aa1ab')}}
}
/* les portes coulissantes du sas (cases 28 à 30, rangée 19), vitrées : elles s'écartent quand on a badgé */
function etageDessinerPorteSas(c,X,Y,x){
  if(x!==28)return;const off=Math.round(ETG.ouv*22),L=48;
  R(c,X,Y+5,L,3,'#4a4f60');c.save();c.beginPath();c.rect(X,Y+8,L,8);c.clip();
  [[X-off,0],[X+24+off,1]].forEach(([px,i])=>{R(c,px,Y+8,24,8,'#7a8292');c.fillStyle='rgba(191,227,242,.85)';c.fillRect(px+1,Y+9,22,6);R(c,px+(i?2:20),Y+10,1,4,'#5b6478');R(c,px+5,Y+9,1,4,'rgba(255,255,255,.8)')});
  c.restore();R(c,X,Y+15,L,1,'#5b6478');
  // le lecteur de badge, sur le mur à droite (case 31)
  const lx=X+3*16;R(c,lx+5,Y+7,6,8,'#2b2f3a');R(c,lx+6,Y+8,4,3,'#4a4f5c');R(c,lx+7,Y+12,2,2,ETG.badge?'#3be07a':'#e2573b');
}

/* ---- en ville : l'enseigne « BUREAU » au-dessus de la porte ---- */
function etageFacade(c,b){
  const txt='BUREAU',w=txt.length*4+5,X=b.door[0]*16+8-(w>>1),Y=b.door[1]*16-12;
  R(c,X,Y,w,10,'#1c2440');R(c,X+1,Y+1,w-2,8,'#f7f5ee');[...txt].forEach((ch,i)=>px35(c,ch,X+3+i*4,Y+3,'#1c2440'));
}
