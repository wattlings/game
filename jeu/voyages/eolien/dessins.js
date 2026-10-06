/* Wattlings · jeu/voyages/eolien/dessins.js
   Parc éolien de Port-Rafale : les dessins du site.
   Les éoliennes tournent avec le vent du jeu (le même que celui qui agite le linge en ville) : plus il souffle, plus elles vont vite.
   Un dessin d'objet reçoit (c, o, X, Y, t) : le coin haut-gauche de sa case en pixels, l'objet, le compteur d'images t. */

/* dessinés directement à l'écran, à chaque image : ce qui tourne ou tangue */
OFX_SKIP.vEolienne=1;OFX_SKIP.vEolienneMer=1;OFX_SKIP.vNavette=1;OFX_SKIP.vMat=1;

/* une éolienne : mât, nacelle, trois pales. h : hauteur du moyeu en pixels ; l : longueur d'une pale ; a : angle du rotor */
function eolDessiner(c,bx,by,h,l,a,e){
  const hy=by-h,B='#f3f6f9',O='#c9d3de',G='#9aa6b2';
  R(c,bx-e-1,by-1,e*2+3,3,'rgba(20,40,30,.25)');
  for(let k=0;k<h;k++){const w=e-Math.round(k/h*(e-2));R(c,bx-w,by-k,w*2,1,B);R(c,bx+w-2,by-k,2,1,O)}          // le mât, plus fin vers le haut
  R(c,bx-e-1,by-2,e*2+2,3,G);
  R(c,bx-3,hy-3,9,6,B);R(c,bx-3,hy+2,9,1,O);R(c,bx+5,hy-2,1,4,G);                                                // la nacelle
  c.strokeStyle='#ffffff';c.lineCap='round';
  for(let i=0;i<3;i++){const g=a+i*2.0944,ex=bx+Math.cos(g)*l,ey=hy+Math.sin(g)*l;
    c.lineWidth=Math.max(2,e-1);c.strokeStyle=O;c.beginPath();c.moveTo(bx+1,hy+1);c.lineTo(ex+1,ey+1);c.stroke();
    c.strokeStyle='#ffffff';c.beginPath();c.moveTo(bx,hy);c.lineTo(ex,ey);c.stroke()}
  c.lineCap='butt';R(c,bx-2,hy-2,5,5,O);R(c,bx-1,hy-1,3,3,G);
}

Object.assign(VOY.dessins,{
  /* une éolienne de la lande. o.arret : elle est bridée, pales immobiles */
  vEolienne(c,o,X,Y){eolDessiner(c,X+8,Y+13,58,24,o.arret?.5:SKR.turb*.9+o.x*1.7,3)},
  /* une éolienne en mer : plus haute, plus lente, les pieds dans l'eau sur sa pièce de transition jaune */
  vEolienneMer(c,o,X,Y){
    R(c,X+4,Y+8,9,7,'#f2c12e');R(c,X+4,Y+8,9,1,'#fff3a8');R(c,X+3,Y+14,11,2,'#c99a1c');R(c,X+2,Y+15,13,1,'rgba(255,255,255,.6)');
    eolDessiner(c,X+8,Y+9,74,33,SKR.turb*.6+o.x*1.3+o.y,4);
  },
  /* le mât de mesure : un treillis, trois anémomètres. Celui du haut tourne plus vite */
  vMat(c,o,X,Y){
    R(c,X+4,Y+14,9,2,'rgba(20,40,30,.25)');
    for(let k=0;k<64;k+=4){R(c,X+6,Y+14-k,1,4,'#8a8f9a');R(c,X+10,Y+14-k,1,4,'#8a8f9a');R(c,X+6+((k>>2)%2?0:1),Y+12-k,4,1,'#b0b6c0');R(c,X+7,Y+13-k,3,1,(k>>2)%2?'#c43d3d':'#f7f0dc')}
    [[-48,1],[-28,.75],[-8,.5]].forEach(([dy,v],i)=>{const a=((SKR.turb*7*v+i)|0)%3;R(c,X+11,Y+dy,5,1,'#59627c');R(c,X+13+a,Y+dy-2,3,2,'#c43d3d');R(c,X+18-a,Y+dy-2,2,2,'#c43d3d')});
    c.strokeStyle='rgba(60,70,90,.5)';c.lineWidth=1;c.beginPath();c.moveTo(X+8.5,Y-30);c.lineTo(X-6.5,Y+15);c.moveTo(X+8.5,Y-30);c.lineTo(X+23.5,Y+15);c.stroke();     // les haubans
  },
  /* la navette du parc en mer : elle tangue */
  vNavette(c,o,X,Y,t){
    const b=(t>>5)%2;Y+=b;
    R(c,X-2,Y+13,36,2,'rgba(255,255,255,.55)');R(c,X,Y+5,32,9,'#1f3d7c');R(c,X+2,Y+4,30,2,'#f2a33a');R(c,X-2,Y+6,3,5,'#1f3d7c');R(c,X+30,Y+3,4,6,'#1f3d7c');R(c,X,Y+12,32,2,'#172c5a');
    R(c,X+8,Y-5,14,10,'#f7f0dc');R(c,X+8,Y-5,14,1,'#ffffff');R(c,X+10,Y-3,10,4,'#8ec9e8');R(c,X+14,Y-3,1,4,'#f7f0dc');R(c,X+17,Y-3,1,4,'#f7f0dc');R(c,X+13,Y-9,1,4,'#59627c');R(c,X+14,Y-9,3,2,'#c43d3d');
    R(c,X+24,Y+1,5,3,'#f2a33a');R(c,X+3,Y+2,4,3,'#e2573b');R(c,X+4,Y+3,2,1,'#f7f0dc');
  },
  /* les ruines du moulin de Kerwatt : une tour de pierre, deux ailes brisées. Dessiné sur deux cases */
  vMoulin(c,o,X,Y){
    R(c,X+1,Y+14,30,2,'rgba(20,40,30,.28)');
    for(let j=0;j<34;j++){const w=11-Math.round(j/34*3);R(c,X+16-w,Y+14-j,w*2,1,j%4===0?'#8a867c':'#aaa69c');R(c,X+16-w,Y+14-j,2,1,'#c4c0b4');R(c,X+14+w,Y+14-j,2,1,'#77736a')}
    for(let k=0;k<8;k++)R(c,X+7+((k*37)%17),Y-16+((k*23)%26),3,1,'#8a867c');
    R(c,X+7,Y-21,5,2,'#aaa69c');R(c,X+16,Y-22,7,3,'#aaa69c');R(c,X+12,Y-20,4,1,'#77736a');                                 // le haut, écroulé
    R(c,X+13,Y+5,6,9,'#3f2a14');R(c,X+13,Y+5,6,1,'#6b4a2b');R(c,X+18,Y-6,3,4,'#33475e');
    c.strokeStyle='#6b4a2b';c.lineWidth=2;c.beginPath();c.moveTo(X+16,Y-12);c.lineTo(X+35,Y-25);c.moveTo(X+16,Y-12);c.lineTo(X+2,Y-30);c.stroke();
    c.lineWidth=1;c.strokeStyle='#8a6538';for(let k=1;k<4;k++){c.beginPath();c.moveTo(X+16+k*5,Y-12-k*3.4);c.lineTo(X+19+k*5,Y-8-k*3.4);c.stroke()}
    R(c,X+2,Y+9,4,2,'#3f8a3a');R(c,X+25,Y+11,4,2,'#3f8a3a');R(c,X+9,Y-2,2,2,'#6f9a55');
  },
  /* une pale posée sur ses tréteaux, trois cases de long */
  vPale(c,o,X,Y){
    R(c,X+2,Y+14,45,2,'rgba(20,40,30,.25)');[6,24,40].forEach(a=>{R(c,X+a,Y+8,2,7,'#8a5f36');R(c,X+a-2,Y+13,6,1,'#6b4a2b')});
    c.fillStyle='#f3f6f9';c.beginPath();c.moveTo(X,Y+5);c.lineTo(X+8,Y+1);c.lineTo(X+30,Y+3);c.lineTo(X+47,Y+6);c.lineTo(X+30,Y+9);c.lineTo(X+6,Y+10);c.closePath();c.fill();
    R(c,X+6,Y+9,26,1,'#c9d3de');R(c,X+32,Y+8,10,1,'#c9d3de');R(c,X,Y+4,3,5,'#9aa6b2');R(c,X+18,Y+4,4,2,'#3a3530');R(c,X+20,Y+5,3,1,'#3a3530');   // la trace de la foudre
    R(c,X+12,Y+2,6,3,'#f2c12e');R(c,X+14,Y+3,2,1,'#1c2440');
  },
  /* un goéland, perché */
  vGoeland(c,o,X,Y,t){
    R(c,X+7,Y+9,2,6,'#8a6538');R(c,X+5,Y+14,6,1,'rgba(20,40,30,.25)');
    R(c,X+4,Y+3,8,5,'#f7f4ec');R(c,X+3,Y+4,5,4,'#9aa6b2');R(c,X+10,Y,4,4,'#f7f4ec');R(c,X+14,Y+2,2,1,'#f2a33a');R(c,X+12,Y+1,1,1,'#1c2440');R(c,X+6,Y+8,1,2,'#f2a33a');R(c,X+9,Y+8,1,2,'#f2a33a');R(c,X+2,Y+6,2,1,'#3a3530');
  },
  /* la longue-vue, fixée au garde-corps */
  vLongueVue(c,o,X,Y){
    R(c,X+5,Y+14,7,2,'rgba(20,30,30,.28)');R(c,X+7,Y+4,2,11,'#59627c');R(c,X+5,Y+13,6,2,'#3a4050');
    R(c,X+3,Y-1,11,4,'#c9a227');R(c,X+3,Y-1,11,1,'#e8cf6a');R(c,X+13,Y-2,3,6,'#8a6f1a');R(c,X+1,Y,2,2,'#3a3530');R(c,X+14,Y-1,1,4,'#8ec9e8');
  },
  /* la grue du pont */
  vGrue(c,o,X,Y){
    R(c,X+3,Y+13,11,3,'#59627c');R(c,X+6,Y-22,4,36,'#f2c12e');R(c,X+6,Y-22,1,36,'#fff3a8');for(let k=0;k<32;k+=6)R(c,X+6,Y-20+k,4,1,'#c99a1c');
    R(c,X-14,Y-24,26,3,'#f2c12e');R(c,X-14,Y-24,26,1,'#fff3a8');R(c,X+10,Y-26,5,7,'#3a4050');R(c,X-11,Y-21,1,14,'#3a3530');R(c,X-13,Y-8,5,3,'#c43d3d');
  }
});

/* ce qui est posé sur les maquettes et les étals (objets vTable) */
const EOLT={
  /* quatre façons de tenir debout dans l'eau */
  fondations(c,X,Y){
    R(c,X+1,Y+1,14,4,'#4a9fd8');R(c,X+1,Y+1,14,1,'#8ec9e8');
    [[2,'#8a8f9a'],[6,'#f2c12e'],[10,'#b9b5a9'],[13,'#e2573b']].forEach(([a,col],i)=>{R(c,X+a,Y-7,1,9,'#f3f6f9');R(c,X+a-1,Y-8,3,1,'#f3f6f9');R(c,X+a-(i===2?1:0),Y+2,i===2?3:1,3,col)});
  },
  /* la crêperie : une bilig, une pile de crêpes */
  crepes(c,X,Y){R(c,X+2,Y+1,7,3,'#3a3530');R(c,X+3,Y,5,1,'#e8c490');R(c,X+10,Y-1,5,5,'#e3b56a');R(c,X+10,Y-1,5,1,'#f2d8ac');R(c,X+10,Y+1,5,1,'#c9954a')}
};

/* ================= PEINT SUR LA CARTE ================= */
const EOLP={
  /* le poste électrique en mer : garde-corps jaune sur les bords du pont, et le H de l'hélisurface */
  finitionsMer(sol,devant,m){
    const g=m.g;g.forEach((l,y)=>l.forEach((ch,x)=>{if(ch!=='b')return;const X=x*16,Y=y*16,eau=(dx,dy)=>g[y+dy]&&g[y+dy][x+dx]==='~';
      if(eau(0,-1)){R(sol,X,Y,16,2,'#f2c12e');for(let k=0;k<16;k+=5)R(sol,X+k,Y-5,1,6,'#f2c12e');R(sol,X,Y-5,16,1,'#f2c12e')}
      if(eau(0,1)){R(devant,X,Y+9,16,1,'#f2c12e');for(let k=0;k<16;k+=5)R(devant,X+k,Y+9,1,7,'#f2c12e');R(sol,X,Y+14,16,2,'#c99a1c');R(sol,X,Y+16,16,4,'#59627c');for(let k=2;k<16;k+=6)R(sol,X+k,Y+20,2,6,'#59627c')}
      if(eau(-1,0))R(sol,X,Y,2,16,'#f2c12e');if(eau(1,0))R(sol,X+14,Y,2,16,'#f2c12e')}));
    if(m.helico){const [x,y]=m.helico,X=x*16,Y=y*16;sol.strokeStyle='#f7f0dc';sol.lineWidth=2;sol.beginPath();sol.arc(X+16,Y+16,13,0,7);sol.stroke();R(sol,X+10,Y+9,2,14,'#f7f0dc');R(sol,X+20,Y+9,2,14,'#f7f0dc');R(sol,X+10,Y+15,12,2,'#f7f0dc')}
  }
};

/* ---- la traversée en bateau : la côte s'éloigne, les éoliennes du large grandissent (f : de 0 à 1) ---- */
function eolTraversee(x,f,d,retour){
  const g=retour?1-f:f;
  const gr=x.createLinearGradient(0,0,0,60);gr.addColorStop(0,'#9cc4e0');gr.addColorStop(1,'#e2eef3');x.fillStyle=gr;x.fillRect(0,0,240,112);
  for(let i=0;i<3;i++){const cx=((i*97-d*.12)%300+300)%300-30;R(x,cx,12+i*8,28,5,'rgba(255,255,255,.85)');R(x,cx+7,9+i*8,14,4,'rgba(255,255,255,.85)')}
  // la côte, à gauche, de plus en plus basse
  const hc=Math.round(16*(1-g)+3);for(let px=0;px<90;px+=2){const h=hc*(1-px/100)+Math.sin(px/9)*2;R(x,px,58-h,2,h+2,'#4a8358')}
  R(x,8,58-hc-9,2,9,'#f4f1e8');R(x,7,58-hc-11,4,2,'#c43d3d');                                                              // le phare
  // les éoliennes du large, à droite, de plus en plus grandes
  for(let i=0;i<5;i++){const s=.25+g*.9-i*.08;if(s<=.1)continue;const bx=130+i*24,h=Math.round(34*s),l=Math.round(15*s),a=d*.06+i;
    R(x,bx,58-h,Math.max(1,Math.round(2*s)),h,'#f3f6f9');x.strokeStyle='#ffffff';x.lineWidth=Math.max(1,Math.round(1.6*s));for(let k=0;k<3;k++){x.beginPath();x.moveTo(bx+.5,58-h);x.lineTo(bx+.5+Math.cos(a+k*2.0944)*l,58-h+Math.sin(a+k*2.0944)*l);x.stroke()}}
  R(x,0,58,240,54,'#3f8fd0');R(x,0,58,240,1,'#8ec9e8');
  for(let i=0;i<26;i++){const wx=((i*41-d*(1+i%3))%270+270)%270-15,wy=62+(i*13)%46;R(x,wx,wy,8+(i%3)*3,1,i%2?'#6fb4e6':'#2f78b8')}
  const b=Math.round(Math.sin(d/9)*2);
  // la navette, vue de côté
  R(x,70,84+b,62,10,'#1f3d7c');R(x,66,86+b,6,6,'#1f3d7c');R(x,130,82+b,8,8,'#1f3d7c');R(x,70,83+b,64,2,'#f2a33a');R(x,86,70+b,28,14,'#f7f0dc');R(x,90,73+b,20,6,'#8ec9e8');R(x,97,73+b,1,6,'#f7f0dc');R(x,104,73+b,1,6,'#f7f0dc');R(x,99,62+b,1,8,'#59627c');R(x,100,62+b,5,3,'#c43d3d');
  for(let i=0;i<7;i++)R(x,40+i*4-((d*2)%4),93+b+(i%2),6,1,'rgba(255,255,255,.8)');R(x,62,94+b,76,2,'rgba(255,255,255,.6)');
}
