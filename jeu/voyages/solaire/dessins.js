/* Wattlings · jeu/voyages/solaire/dessins.js
   Centrale solaire de Saint-Photon : les dessins.
   - ce qui est peint sur la carte, par-dessus le sol (SOLP : rangées de panneaux, poste de livraison, pied des trackers) ;
   - les objets posés dessus (VOY.dessins : onduleurs, totem, vitrine…). Ceux qui servent à plusieurs sites (transformateur, pupitre,
     station météo, panneau « danger ») sont dans voyages/dessins.js.
   Un dessin d'objet reçoit (c, o, X, Y, t) : le coin haut-gauche de sa case en pixels, et le compteur d'images t. */

/* ---- les bleus d'un module, du reflet au plus sombre ---- */
const SOL_BLEU=['#8fb6ee','#3f6cc0','#2a4f96','#1f3d7c','#172c5a'],SOL_ALU=['#eef2f6','#c4c9cf','#8a8f9a'];

/* ================= PEINT SUR LA CARTE ================= */
const SOLP={
  /* une rangée de panneaux fixes, inclinés vers le sud (vers nous) : deux modules par case, le haut de la table passe devant les personnages */
  rangee(c,d,X,Y,x,y,at,m){
    const L0=at(-1,0)==='p',R0=at(1,0)==='p',B=SOL_BLEU,A=SOL_ALU;
    R(c,X-(L0?0:1),Y+12,16+(L0?0:1)+(R0?0:1),3,'rgba(30,40,30,.3)');                       // l'ombre de la table
    [3,11].forEach(px=>{R(c,X+px,Y+8,2,6,A[2]);R(c,X+px,Y+8,1,6,A[1])});                   // les pieds
    const table=g=>{
      R(g,X,Y-4,16,13,B[3]);R(g,X,Y-4,16,1,A[0]);R(g,X,Y+8,16,1,A[2]);                     // le cadre, haut et bas
      R(g,X,Y-3,16,5,B[2]);R(g,X,Y-3,16,2,B[1]);R(g,X,Y+2,16,1,A[1]);                      // le module du haut, plus clair : il reflète le ciel
      for(let k=0;k<16;k+=8){R(g,X+k,Y-3,1,11,A[1]);for(let j=2;j<8;j+=2)R(g,X+k+j,Y+3,1,5,B[4])}   // montants, puis les cellules du module du bas
      const r=((x*5+y*3)%4)*2;R(g,X+2+r,Y-3,2,1,B[0]);R(g,X+3+r,Y-2,1,1,B[0]);              // un reflet
      if(!L0)R(g,X,Y-4,1,13,A[0]);if(!R0)R(g,X+15,Y-4,1,13,A[2]);
    };
    table(c);d.save();d.beginPath();d.rect(X,Y-4,16,4);d.clip();table(d);d.restore();
  },
  /* le pied d'un tracker : l'herbe, l'ombre, le poteau (le panneau lui-même est un objet : il bouge) */
  piedTracker(c,d,X,Y,x,y,at,m){
    if(y%2===0){R(c,X+6,Y+7,4,3,'rgba(30,40,30,.28)');R(c,X+7,Y+4,2,5,SOL_ALU[2])}
  },
  /* le poste de livraison : un préfabriqué de béton, peint d'un bloc à partir de sa case haut-gauche */
  poste(c,d,X,Y,x,y,at,m){
    if(at(-1,0)==='W'||at(0,-1)==='W')return;
    let w=0,h=0;while(at(w,0)==='W')w++;while(at(0,h)==='W')h++;const W=w*16,H=h*16;
    R(c,X-1,Y+H-2,W+3,3,'rgba(20,30,30,.3)');
    R(c,X,Y+8,W,H-9,'#d9d5c8');R(c,X,Y+8,W,1,'#f1eee4');R(c,X+W-1,Y+8,1,H-9,'#b3ae9f');R(c,X,Y+H-3,W,2,'#a8a394');   // les murs
    for(let k=8;k<W;k+=16)R(c,X+k,Y+9,1,H-12,'#c4c0b2');                                                             // les joints des panneaux de béton
    R(c,X-2,Y,W+4,9,'#8f8b80');R(c,X-2,Y,W+4,2,'#b9b5a9');R(c,X-2,Y+8,W+4,1,'#6d695f');                              // le toit plat
    const px=X+W/2-9;R(c,px,Y+12,18,H-14,'#4f6f58');R(c,px,Y+12,18,1,'#6f8f78');R(c,px+8,Y+12,2,H-14,'#3a5544');      // la porte à deux battants
    R(c,px+6,Y+21,1,3,'#d9d5c8');R(c,px+11,Y+21,1,3,'#d9d5c8');
    R(c,px+3,Y+14,12,6,'#f2c12e');R(c,px+3,Y+14,12,1,'#fff3a8');txt35(c,'PDL',px+4,Y+15,'#1c2440',1);                 // la plaque
    [X+5,X+W-13].forEach(a=>{R(c,a,Y+13,8,6,'#8a8f9a');for(let j=0;j<3;j++)R(c,a+1,Y+14+j*2,6,1,'#59627c')});          // les grilles d'aération
    R(c,X+W-12,Y+22,7,6,'#f2c12e');R(c,X+W-9,Y+23,1,3,'#1c2440');R(c,X+W-9,Y+26,1,1,'#1c2440');                        // « danger »
  }
};

/* ================= LES OBJETS ================= */
/* dessinés directement à l'écran, sans le contour automatique : les trackers (ils pivotent) */
OFX_SKIP.vTracker=1;
/* redessinés à chaque image : ce qui clignote ou tourne */
OFX_ANIM.vEcran=1;OFX_ANIM.vOnduleur=1;

/* de quel côté penchent les trackers : -1 plein est (matin), 0 à plat (midi, ou la nuit), +1 plein ouest (soir) */
const solPenche=()=>SKY.el<=1?0:Math.max(-1,Math.min(1,(SKY.az-180)/70));

Object.assign(VOY.dessins,{
  /* un tronçon de tracker, vu du ciel : il rétrécit quand il penche, son ombre s'allonge du côté opposé au soleil */
  vTracker(c,o,X,Y){
    const p=solPenche(),a=Math.abs(p),l=16-Math.round(a*6),x0=X+Math.round((16-l)/2+p*1.5),B=SOL_BLEU,A=SOL_ALU,om=Math.round(2+a*5);
    R(c,p<=0?x0-om:x0+l,Y+1,om,16,'rgba(30,40,30,.26)');                                            // l'ombre, à l'opposé du soleil
    R(c,x0,Y,l,16,B[a>.6?1:2]);
    for(let j=0;j<16;j+=8){R(c,x0,Y+j,l,1,A[1]);for(let k=2;k<l-1;k+=3)R(c,x0+k,Y+j+2,1,5,B[a>.6?2:3])}
    R(c,p<0?x0+l-2:x0,Y,2,16,a>.15?B[0]:B[1]);                                                      // le bord qui regarde le soleil prend la lumière
    R(c,x0,Y,1,16,A[0]);R(c,x0+l-1,Y,1,16,A[2]);
    if(o.haut)R(c,x0,Y,l,1,A[0]);if(o.bas){R(c,x0,Y+15,l,1,A[2]);R(c,X+6,Y+16,4,2,'#f2a33a')}       // en bas de rangée : le moteur, orange
  },
  /* une armoire d'onduleur : sa diode respire, son écran affiche la production du moment */
  vOnduleur(c,o,X,Y,t){
    R(c,X,Y+14,17,2,'rgba(20,30,30,.28)');R(c,X+1,Y-9,14,24,'#d9dde3');R(c,X+1,Y-9,14,1,'#f4f6f8');R(c,X+14,Y-9,1,24,'#a7b0bf');R(c,X+1,Y+13,14,2,'#8a93a3');
    R(c,X+3,Y-6,10,5,'#1c2440');const n=Math.round(SKY.pv*8);for(let k=0;k<n;k++){const h=1+(k*2)%3;R(c,X+4+k,Y-2-h,1,h,'#3be07a')}
    for(let j=0;j<4;j++)R(c,X+3,Y+2+j*2,10,1,'#a7b0bf');                                             // les ouïes de ventilation
    R(c,X+11,Y+11,2,2,SKY.pv>.02?((t+o.x*9>>4)%4?'#3be07a':'#1f8a48'):'#f2a33a');R(c,X+3,Y+10,5,4,'#f2c12e');R(c,X+5,Y+11,1,2,'#1c2440');
  },
  /* l'écran de supervision, sous son auvent : la cloche du jour, et un point qui avance avec l'heure */
  vEcran(c,o,X,Y,t){
    R(c,X-1,Y+14,35,2,'rgba(20,30,30,.28)');R(c,X+1,Y-2,2,17,'#59627c');R(c,X+29,Y-2,2,17,'#59627c');
    R(c,X-2,Y-16,36,4,'#c0503a');R(c,X-2,Y-16,36,1,'#e07a62');R(c,X-2,Y-12,36,1,'#8f3a2a');                       // l'auvent de tuiles
    R(c,X+2,Y-11,28,17,'#1c2440');R(c,X+3,Y-10,26,15,'#0e1326');
    for(let k=0;k<24;k++){const h=Math.round(Math.pow(Math.sin(Math.PI*k/23),1.3)*11);R(c,X+4+k,Y+4-h,1,1,'#f2a33a');if(k%3===0)R(c,X+4+k,Y+4,1,1,'#39426a')}
    const k=Math.max(0,Math.min(23,Math.round((SKY.clock-6.3)/14.6*23))),h=Math.round(Math.pow(Math.sin(Math.PI*k/23),1.3)*11);
    if(SKY.el>0&&(t>>3)%2)R(c,X+3+k,Y+3-h,3,3,'#fff3a8');
    R(c,X+5,Y+8,22,5,'#8a93a3');R(c,X+5,Y+8,22,1,'#c4c9cf');for(let j=0;j<6;j++)R(c,X+7+j*3,Y+10,2,1,'#3a4050');   // le clavier
  },
  /* le grand panneau du site, à la sortie du quai */
  vTotem(c,o,X,Y){
    R(c,X-3,Y+14,23,2,'rgba(20,30,30,.28)');R(c,X-2,Y-2,2,17,'#6b4a2b');R(c,X+16,Y-2,2,17,'#6b4a2b');
    R(c,X-5,Y-22,26,21,'#1c2440');R(c,X-4,Y-21,24,19,'#f7f0dc');R(c,X-4,Y-21,24,6,'#f2a33a');
    R(c,X-1,Y-20,4,4,'#fff3c4');R(c,X,Y-21,2,6,'#fff3c4');R(c,X-2,Y-19,6,2,'#fff3c4');                             // un soleil
    R(c,X+5,Y-19,12,1,'#1c2440');R(c,X+5,Y-17,8,1,'#1c2440');
    [[-13,14],[-10,18],[-7,11],[-4,16]].forEach(([b,l])=>R(c,X-2,Y+b,l,1,'#5b6380'));R(c,X+13,Y-7,5,4,'#1f3d7c');R(c,X+13,Y-5,5,1,'#8fb6ee');
  },
  /* la vitrine : une cellule de silicium coupée en deux */
  vVitrine(c,o,X,Y){
    R(c,X+1,Y+14,15,2,'rgba(20,30,30,.28)');R(c,X+2,Y+5,12,10,'#8a5f36');R(c,X+2,Y+5,12,2,'#c9a26e');R(c,X+13,Y+7,1,8,'#63431f');
    R(c,X+2,Y-9,12,14,'rgba(190,225,245,.55)');R(c,X+2,Y-9,12,1,'#eaf6fd');R(c,X+2,Y-9,1,14,'#eaf6fd');R(c,X+13,Y-9,1,14,'#9cc3dd');
    R(c,X+4,Y-6,4,8,'#1f3d7c');R(c,X+9,Y-5,4,8,'#1f3d7c');for(let j=0;j<4;j++){R(c,X+4,Y-5+j*2,4,1,'#c4c9cf');R(c,X+9,Y-4+j*2,4,1,'#c4c9cf')}
    R(c,X+3,Y-8,2,3,'rgba(255,255,255,.7)');R(c,X+5,Y+8,6,3,'#f7f0dc');R(c,X+6,Y+9,4,1,'#5b6380');
  },
  /* la maquette de l'école : des panneaux sur le toit, deux curseurs */
  vMaquette(c,o,X,Y){
    R(c,X,Y+14,17,2,'rgba(20,30,30,.28)');R(c,X,Y+4,16,8,'#a07845');R(c,X,Y+4,16,2,'#c9a26e');R(c,X+1,Y+12,2,3,'#6b4a2b');R(c,X+13,Y+12,2,3,'#6b4a2b');
    R(c,X+2,Y-3,9,7,'#f1e6d0');R(c,X+1,Y-6,11,4,'#c0503a');R(c,X+2,Y-6,8,2,'#1f3d7c');R(c,X+2,Y-6,8,1,'#8fb6ee');R(c,X+4,Y,2,4,'#6b4a2b');R(c,X+8,Y-1,2,2,'#8ec9e8');
    R(c,X+12,Y+1,3,1,'#59627c');R(c,X+13,Y,1,3,'#f2a33a');R(c,X+12,Y+5,3,1,'#59627c');R(c,X+12,Y+4,1,3,'#2aa198');
  },
  /* le module témoin de M. Crête, posé sur un chevalet */
  vModule(c,o,X,Y){
    R(c,X,Y+14,17,2,'rgba(20,30,30,.28)');R(c,X+2,Y+3,1,12,'#8a5f36');R(c,X+13,Y+3,1,12,'#8a5f36');R(c,X+4,Y+8,9,1,'#8a5f36');
    R(c,X+2,Y-10,12,18,SOL_ALU[1]);R(c,X+3,Y-9,10,16,SOL_BLEU[3]);R(c,X+3,Y-9,10,5,SOL_BLEU[2]);
    for(let j=0;j<16;j+=4)R(c,X+3,Y-9+j,10,1,SOL_BLEU[4]);R(c,X+7,Y-9,1,16,SOL_BLEU[4]);R(c,X+4,Y-8,3,1,SOL_BLEU[0]);R(c,X+5,Y-7,1,1,SOL_BLEU[0]);
    R(c,X+9,Y+3,4,3,'#f7f0dc');R(c,X+10,Y+4,2,1,'#1c2440');
  },
  /* le distributeur de crème solaire */
  vCreme(c,o,X,Y){
    R(c,X+3,Y+14,11,2,'rgba(20,30,30,.28)');R(c,X+7,Y+6,2,9,'#59627c');R(c,X+4,Y-6,8,13,'#f2c12e');R(c,X+4,Y-6,8,1,'#fff3a8');R(c,X+11,Y-6,1,13,'#c99a1c');
    R(c,X+6,Y-3,4,4,'#fff');R(c,X+7,Y-4,2,6,'#fff');R(c,X+5,Y-2,6,2,'#fff');R(c,X+7,Y-2,2,2,'#f2a33a');R(c,X+6,Y+7,4,2,'#f7f0dc');R(c,X+7,Y+9,2,1,'#f7f0dc');
  },
  /* l'affiche de la halte : le solaire en France */
  vAfficheFrance(c,o,X,Y){
    R(c,X-1,Y+14,19,2,'rgba(20,30,30,.28)');R(c,X,Y,2,15,'#59627c');R(c,X+14,Y,2,15,'#59627c');R(c,X-2,Y-16,20,18,'#1c2440');R(c,X-1,Y-15,18,16,'#f7f0dc');
    R(c,X+1,Y-13,5,5,'#f2a33a');R(c,X+2,Y-14,3,7,'#f2a33a');R(c,X,Y-12,7,3,'#f2a33a');
    [[8,3,'#f2a33a'],[11,6,'#4a78c9'],[14,10,'#59627c']].forEach(([a,h,col])=>R(c,X+a,Y-4-h,2,h,col));R(c,X+7,Y-4,10,1,'#1c2440');R(c,X+1,Y-2,14,1,'#5b6380');
  },
  /* la palette de vieux modules */
  vPalette(c,o,X,Y){
    R(c,X,Y+14,17,2,'rgba(20,30,30,.28)');R(c,X+1,Y+10,14,5,'#a07845');R(c,X+1,Y+12,14,1,'#6b4a2b');R(c,X+3,Y+13,2,2,'#6b4a2b');R(c,X+11,Y+13,2,2,'#6b4a2b');
    for(let j=0;j<5;j++){R(c,X+2-(j%2),Y+8-j*2,13,2,'#2b3d63');R(c,X+2-(j%2),Y+8-j*2,13,1,'#9aa6b8')}
    R(c,X+7,Y-1,2,11,'#f2a33a');R(c,X+10,Y+3,4,4,'#f7f0dc');R(c,X+11,Y+4,2,1,'#c43d3d');
  },
  /* la caméra de ciel de Dr Nuage : un trépied, une coupole qui regarde en l'air */
  vCiel(c,o,X,Y){
    R(c,X+3,Y+14,11,2,'rgba(20,30,30,.28)');c.strokeStyle='#59627c';c.lineWidth=1;[[3,15],[8,15],[13,15]].forEach(([a,b])=>{c.beginPath();c.moveTo(X+8.5,Y+3);c.lineTo(X+a+.5,Y+b);c.stroke()});
    R(c,X+5,Y-1,7,5,'#e8eef5');R(c,X+5,Y-1,7,1,'#fff');R(c,X+6,Y-5,5,4,'rgba(150,200,235,.9)');R(c,X+7,Y-6,3,1,'#eaf6fd');R(c,X+7,Y-4,1,1,'#fff');
  },
  /* un lapin, à l'ombre */
  vLapin(c,o,X,Y){
    R(c,X+4,Y+14,9,1,'rgba(20,30,30,.24)');R(c,X+4,Y+9,8,5,'#b8a48a');R(c,X+10,Y+7,4,4,'#b8a48a');R(c,X+11,Y+3,1,4,'#b8a48a');R(c,X+13,Y+3,1,4,'#b8a48a');R(c,X+11,Y+4,1,2,'#e9b8a8');
    R(c,X+12,Y+8,1,1,'#1c2440');R(c,X+3,Y+10,2,2,'#f4f1e8');R(c,X+5,Y+13,3,1,'#9a8870');R(c,X+10,Y+13,2,1,'#9a8870');
  }
});
