/* Wattlings · jeu/voyages/barrage/dessins.js
   Barrage de Val-Turbine : les dessins du site.
   - ce qui est peint sur la carte (BARP : le mur du barrage, la conduite forcée) ;
   - les objets posés dessus (VOY.dessins : roue Pelton, échelle du lac, panneau jaune, écran des prix…).
   Un dessin d'objet reçoit (c, o, X, Y, t) : le coin haut-gauche de sa case en pixels, l'objet, le compteur d'images t. */

/* ================= PEINT SUR LA CARTE ================= */
const BARP={
  /* le mur du barrage, vu de l'aval : une voûte de béton, peinte d'un bloc à partir de sa case haut-gauche */
  mur(c,d,X,Y,x,y,at){
    if(at(-1,0)==='P'||at(0,-1)==='P')return;
    let w=0,h=0;while(at(w,0)==='P')w++;while(at(0,h)==='P')h++;const W=w*16,H=h*16,B=['#e4e0d4','#cfcabb','#b9b4a4','#9d9889','#7f7a6c'];
    // la voûte : plus haute au centre de la vallée, elle s'appuie sur les deux rives
    for(let i=0;i<W;i++){const u=(i-W/2)/(W/2),bas=H-Math.round(Math.pow(Math.abs(u),2.2)*H*.55),ton=u<-.55?0:u<-.1?1:u<.4?2:3;
      R(c,X+i,Y,1,bas,B[ton]);if(i%8===0)R(c,X+i,Y,1,bas,B[Math.min(4,ton+1)]);R(c,X+i,Y+bas-2,1,2,B[4]);R(c,X+i,Y+bas,1,3,'rgba(20,30,30,.25)')}
    for(let j=14;j<H;j+=14)for(let i=0;i<W;i++){const u=(i-W/2)/(W/2),bas=H-Math.round(Math.pow(Math.abs(u),2.2)*H*.55);if(j<bas-3)R(c,X+i,Y+j+Math.round(u*u*4),1,1,B[3])}   // les reprises de bétonnage
    for(let k=0;k<9;k++){const a=X+12+((k*53)%(W-24)),l=10+((k*29)%(H-34));R(c,a,Y+6,1,l,'rgba(90,100,90,.35)');R(c,a+1,Y+6,1,l>>1,'rgba(90,100,90,.25)')}                  // les coulures
    R(c,X,Y,W,3,B[0]);R(c,X,Y+3,W,1,B[4]);
    // l'évacuateur de crues, au centre, et son filet d'eau : le débit réservé
    let cx=X+W/2;for(let i=0;i<w;i++)if(at(i,h)==='~'){cx=X+i*16+16;break}                                    // à l'aplomb du torrent
    R(c,cx-13,Y+4,26,7,B[4]);for(let k=0;k<3;k++)R(c,cx-11+k*8,Y+5,6,5,'#33475e');R(c,cx-1,Y+11,3,H-14,'#bfe6f5');R(c,cx,Y+11,1,H-14,'#ffffff');R(c,cx-4,Y+H-5,9,3,'#dff2f9');
  },
  /* après le reste : la conduite forcée, qui descend du lac à l'usine en suivant les cases x du plan */
  finitions(sol,devant,m){
    // les parapets de la crête : côté lac, côté vide
    m.g.forEach((l,y)=>l.forEach((ch,x)=>{if(ch!=='b')return;const X=x*16,Y=y*16,h=m.g[y-1]&&m.g[y-1][x],b=m.g[y+1]&&m.g[y+1][x];
      if(h==='~'){R(sol,X,Y,16,3,'#8f8b80');R(sol,X,Y,16,1,'#d9d5c8');if(x%2===0)R(sol,X+7,Y-3,2,4,'#8f8b80')}
      if(b==='P'||b==='k'){R(devant,X,Y+12,16,1,'#59627c');R(devant,X,Y+9,16,1,'#59627c');if(x%2)R(devant,X+7,Y+8,1,8,'#59627c')}}));
    const P=[];m.g.forEach((l,y)=>l.forEach((ch,x)=>{if(ch==='x')P.push([x*16+8,y*16+8])}));if(P.length<2)return;
    P.sort((a,b)=>a[1]-b[1]||a[0]-b[0]);
    const trait=(col,e,dx)=>{sol.strokeStyle=col;sol.lineWidth=e;sol.lineJoin='round';sol.lineCap='round';sol.beginPath();P.forEach(([x,y],i)=>i?sol.lineTo(x+dx,y):sol.moveTo(x+dx,y));sol.stroke()};
    trait('rgba(20,40,30,.28)',9,3);trait('#3f6b52',8,0);trait('#5c8a6e',4,-1);trait('#8fb89c',1,-2);
    P.forEach(([x,y],i)=>{if(i%2===0){R(sol,x-6,y-1,12,3,'#8f8b80');R(sol,x-6,y-1,12,1,'#b9b5a9')}});     // les massifs d'ancrage
  }
};

/* ================= LES OBJETS ================= */
OFX_ANIM.vEcranPrix=1;
Object.assign(VOY.dessins,{
  /* la roue Pelton du groupe 2, sur son socle */
  vRoue(c,o,X,Y){
    R(c,X,Y+14,17,2,'rgba(20,30,30,.28)');R(c,X+2,Y+10,12,5,'#b9b5a9');R(c,X+2,Y+10,12,1,'#d9d5c8');
    c.fillStyle='#8a6f1a';c.beginPath();c.arc(X+8,Y+1,9,0,7);c.fill();c.fillStyle='#c9a227';c.beginPath();c.arc(X+8,Y+1,7,0,7);c.fill();
    for(let k=0;k<10;k++){const a=k*Math.PI/5;R(c,Math.round(X+7+Math.cos(a)*8),Math.round(Y+Math.sin(a)*8),3,3,'#e8cf6a');R(c,Math.round(X+8+Math.cos(a)*8),Math.round(Y+1+Math.sin(a)*8),1,1,'#8a6f1a')}
    c.fillStyle='#59627c';c.beginPath();c.arc(X+8,Y+1,3,0,7);c.fill();R(c,X+7,Y,2,2,'#c4c9cf');
  },
  /* l'échelle du lac : des graduations, un flotteur */
  vEchelle(c,o,X,Y){
    R(c,X+5,Y+14,7,2,'rgba(20,30,30,.25)');R(c,X+6,Y-16,5,31,'#f7f0dc');R(c,X+6,Y-16,1,31,'#fff');R(c,X+10,Y-16,1,31,'#c9bb92');
    for(let k=0;k<10;k++){R(c,X+6,Y-14+k*3,k%2?2:4,1,'#1c2440')}R(c,X+6,Y-5,5,2,'#c43d3d');R(c,X+11,Y-6,4,4,'#f2a33a');R(c,X+12,Y-5,2,2,'#fff3a8');
  },
  /* le coffret du pendule : un fil à plomb de cent mètres, et ce qu'il raconte */
  vPendule(c,o,X,Y){
    R(c,X+2,Y+14,13,2,'rgba(20,30,30,.25)');R(c,X+3,Y,10,14,'#d9dde3');R(c,X+3,Y,10,1,'#f4f6f8');R(c,X+12,Y,1,14,'#a7b0bf');R(c,X+5,Y+2,6,5,'#0e1326');R(c,X+7,Y+2,1,3,'#f2a33a');R(c,X+7,Y+5,1,1,'#3be07a');R(c,X+5,Y+9,6,1,'#59627c');R(c,X+5,Y+11,4,1,'#59627c');
  },
  /* le panneau jaune des berges */
  vPanneauJaune(c,o,X,Y){
    R(c,X+4,Y+14,9,2,'rgba(20,30,30,.25)');R(c,X+7,Y+4,2,11,'#59627c');R(c,X+1,Y-10,14,15,'#1c2440');R(c,X+2,Y-9,12,13,'#f2c12e');R(c,X+2,Y-9,12,1,'#fff3a8');
    R(c,X+4,Y-2,8,1,'#1f6fb3');R(c,X+4,Y,8,1,'#1f6fb3');R(c,X+5,Y-1,6,1,'#1f6fb3');R(c,X+7,Y-7,2,3,'#1c2440');R(c,X+6,Y-5,4,1,'#1c2440');
  },
  /* l'écran de M. Spot : vingt-quatre barres, le prix de demain heure par heure */
  vEcranPrix(c,o,X,Y,t){
    R(c,X-1,Y+14,35,2,'rgba(20,30,30,.28)');R(c,X+1,Y-2,2,17,'#59627c');R(c,X+29,Y-2,2,17,'#59627c');R(c,X,Y-17,32,19,'#1c2440');R(c,X+1,Y-16,30,17,'#0e1326');
    [5,4,4,5,6,8,10,9,7,5,3,1,1,2,3,5,7,10,14,13,10,8,6,5].forEach((h,k)=>R(c,X+3+k,Y-1-h,1,h,k===18?((t>>3)%2?'#e2573b':'#f2a33a'):k>10&&k<14?'#3be07a':'#4a9fd8'));
    R(c,X+3,Y,26,1,'#39426a');
  },
  /* la passe à poissons : des bassins en escalier */
  vPasse(c,o,X,Y){
    for(let k=0;k<4;k++){R(c,X+k*4,Y+2+k*3,5,4,'#8f8b80');R(c,X+k*4+1,Y+3+k*3,3,2,'#6cc4d6');R(c,X+k*4+1,Y+3+k*3,3,1,'#e0f4f6')}R(c,X+9,Y+8,2,1,'#c4c9cf');
  },
  /* une marmotte, dressée */
  vMarmotte(c,o,X,Y){
    R(c,X+4,Y+14,9,1,'rgba(20,30,30,.24)');R(c,X+5,Y+5,6,9,'#a8794a');R(c,X+6,Y+7,4,6,'#d9b98a');R(c,X+5,Y+1,6,5,'#a8794a');R(c,X+5,Y,2,2,'#7a5630');R(c,X+9,Y,2,2,'#7a5630');R(c,X+6,Y+3,1,1,'#1c2440');R(c,X+9,Y+3,1,1,'#1c2440');R(c,X+7,Y+4,2,1,'#3a2a1a');R(c,X+4,Y+8,1,3,'#7a5630');R(c,X+11,Y+8,1,3,'#7a5630');
  },
  /* un randonneur assis sur son sac : c'est un personnage, mais il ne se lève pas */
  vSac(c,o,X,Y){R(c,X+3,Y+14,11,2,'rgba(20,30,30,.25)');R(c,X+4,Y+4,9,10,'#c0503a');R(c,X+4,Y+4,9,2,'#e07a62');R(c,X+6,Y+8,5,4,'#8f3a2a');R(c,X+5,Y+1,7,4,'#2f6db5');R(c,X+12,Y+6,2,6,'#59627c')}
});
