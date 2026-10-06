/* Wattlings · jeu/voyages/datacenter/dessins.js
   Data center du quai des Octets : les dessins du site.
   - ce qui est peint sur la carte (DATP : les armoires de serveurs, les armoires de calcul) ;
   - ce qui clignote par-dessus (datDiodes, appelé à chaque image) ;
   - les objets (VOY.dessins : écrans, batteries, groupes électrogènes, échangeur, trappe aux câbles…).
   Un dessin d'objet reçoit (c, o, X, Y, t) : le coin haut-gauche de sa case en pixels, l'objet, le compteur d'images t. */

/* ================= PEINT SUR LA CARTE ================= */
const DATP={
  /* une armoire de serveurs : le haut dépasse sur la case du dessus et passe devant les personnages */
  baie(c,d,X,Y,x,y,at,m,o){
    const ia=o&&o.ia,corps=g=>{
      R(g,X,Y-6,16,22,'#1c2440');R(g,X,Y-6,16,1,'#39426a');R(g,X+15,Y-6,1,22,'#0e1326');R(g,X,Y-6,1,22,'#2b3560');
      R(g,X+2,Y-4,12,18,ia?'#141a30':'#0e1326');for(let j=0;j<6;j++)R(g,X+3,Y-3+j*3,10,2,ia?'#1f2a4a':'#1a2140');
      if(ia){R(g,X+2,Y-4,1,18,'#4a9fd8');R(g,X+13,Y-4,1,18,'#e2573b')}};
    R(c,X,Y+15,16,2,'rgba(10,15,30,.35)');corps(c);d.save();d.beginPath();d.rect(X,Y-6,16,6);d.clip();corps(d);d.restore();
  }
};
/* les diodes des armoires : quelques points verts qui changent, sur les cases « x » et « h » visibles à l'écran */
function datDiodes(c,ox,oy,t){
  const g=MAPS[S.map].g,x0=Math.max(0,ox>>4),y0=Math.max(0,oy>>4),x1=Math.min(g[0].length-1,(ox+cv.width)>>4),y1=Math.min(g.length-1,(oy+cv.height+8)>>4),k=t>>3;
  for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++){const ch=g[y][x];if(ch!=='x'&&ch!=='h')continue;const X=x*16-ox,Y=y*16-oy;
    for(let j=0;j<2;j++){const h=wh(x*3+j,y,(k+j*7)&31);c.fillStyle=h>.85?'#f2a33a':ch==='h'?'#6fb4e6':'#3be07a';if(h>.25)c.fillRect(X+4+((h*40)&7),Y-3+j*3,1,1);if(h>.55)c.fillRect(X+3+((h*90)&7),Y-3+j*3,1,1)}}
}

/* ================= LES OBJETS ================= */
OFX_ANIM.vEcranMonde=1;OFX_ANIM.vEcranPlat=1;
Object.assign(VOY.dessins,{
  /* le mur d'écrans du hall : une carte du monde, des points qui s'allument (deux cases de large, sur le mur) */
  vEcranMonde(c,o,X,Y,t){
    R(c,X,Y-2,32,16,'#1c2440');R(c,X+1,Y-1,30,14,'#0e1326');
    [[4,3,6,4],[6,7,3,4],[13,2,5,3],[14,6,4,5],[19,2,8,5],[25,8,3,2]].forEach(([a,b,w,h])=>R(c,X+a,Y+b,w,h,'#27325a'));
    [[6,4],[15,3],[16,8],[22,4],[24,5],[7,9],[26,9],[14,5]].forEach(([a,b],i)=>R(c,X+a,Y+b,1,1,((t>>3)+i)%5?'#3be07a':'#fff3a8'));
    R(c,X+2,Y+11,(t>>2)%26+2,1,'#f2a33a');
  },
  /* l'écran de M. Talon : une courbe de charge parfaitement plate (deux cases de large, sur le mur) */
  vEcranPlat(c,o,X,Y,t){
    R(c,X,Y-2,32,16,'#1c2440');R(c,X+1,Y-1,30,14,'#0e1326');for(let k=0;k<7;k++)R(c,X+3+k*4,Y+1,1,10,'#1a2140');
    R(c,X+3,Y+4,26,1,'#3be07a');R(c,X+3+((t>>2)%26),Y+3,1,3,'#fff3a8');R(c,X+3,Y+11,26,1,'#39426a');
  },
  /* une armoire de batteries */
  vBatterie(c,o,X,Y){
    R(c,X,Y+14,17,2,'rgba(10,15,30,.3)');R(c,X+1,Y-8,14,23,'#d9dde3');R(c,X+1,Y-8,14,1,'#f4f6f8');R(c,X+14,Y-8,1,23,'#a7b0bf');
    for(let j=0;j<4;j++){R(c,X+3,Y-6+j*5,10,4,'#59627c');R(c,X+4,Y-5+j*5,2,2,'#c43d3d');R(c,X+10,Y-5+j*5,2,2,'#1c2440');R(c,X+7,Y-5+j*5,2,1,'#3be07a')}
  },
  /* un groupe électrogène, gros comme un conteneur */
  vGroupe(c,o,X,Y){
    R(c,X-1,Y+14,19,2,'rgba(20,30,30,.3)');R(c,X,Y-4,16,19,'#4f6f58');R(c,X,Y-4,16,1,'#6f8f78');R(c,X+15,Y-4,1,19,'#3a5544');
    for(let j=0;j<4;j++)R(c,X+2,Y-1+j*3,8,1,'#2c4d3a');R(c,X+11,Y,3,8,'#3a5544');R(c,X+12,Y+2,1,2,'#3be07a');R(c,X+4,Y-9,3,6,'#59627c');R(c,X+3,Y-10,5,2,'#3a4050');R(c,X+2,Y+11,12,2,'#f2c12e');
  },
  /* la cuve de fioul */
  vCuve(c,o,X,Y){
    R(c,X-1,Y+14,19,2,'rgba(20,30,30,.3)');R(c,X+1,Y+11,3,4,'#59627c');R(c,X+12,Y+11,3,4,'#59627c');
    R(c,X,Y,16,11,'#c9c5ba');R(c,X,Y,16,2,'#e4e1d7');R(c,X,Y+9,16,2,'#a39c8a');R(c,X+6,Y-3,4,3,'#8a8f9a');R(c,X+4,Y+3,8,5,'#e2573b');R(c,X+7,Y+4,2,3,'#fff3a8');
  },
  /* l'échangeur de chaleur : deux cases, un tuyau rouge qui part vers le quartier */
  vEchangeur(c,o,X,Y){
    R(c,X-1,Y+14,35,2,'rgba(20,30,30,.3)');R(c,X+2,Y-6,22,20,'#d9dde3');R(c,X+2,Y-6,22,1,'#f4f6f8');R(c,X+23,Y-6,1,20,'#a7b0bf');
    for(let k=0;k<9;k++)R(c,X+4+k*2,Y-3,1,14,k%2?'#a7b0bf':'#8a93a3');
    R(c,X-2,Y-2,5,3,'#4a9fd8');R(c,X-2,Y+7,5,3,'#4a9fd8');R(c,X+24,Y-2,10,3,'#e2573b');R(c,X+24,Y-2,10,1,'#f39a8c');R(c,X+24,Y+7,10,3,'#e2573b');R(c,X+30,Y+9,3,6,'#e2573b');
  },
  /* les conduites d'eau de galerie : deux gros tuyaux bleus qui sortent du sol */
  vConduites(c,o,X,Y){
    R(c,X,Y+14,17,2,'rgba(20,30,30,.3)');[[1,'#3f8fd0','#8ec9e8'],[9,'#5aa8c8','#a8dcec']].forEach(([a,col,hi])=>{R(c,X+a,Y-6,6,21,col);R(c,X+a,Y-6,2,21,hi);R(c,X+a-1,Y-1,8,2,'#59627c');R(c,X+a-1,Y+8,8,2,'#59627c')});
    R(c,X+4,Y+3,8,5,'#f7f0dc');R(c,X+5,Y+4,6,1,'#1c2440');R(c,X+5,Y+6,4,1,'#5b6380');
  },
  /* la chambre d'atterrage : une trappe jaune, des câbles qui plongent */
  vTrappe(c,o,X,Y){
    R(c,X+1,Y+3,14,11,'#f2c12e');R(c,X+1,Y+3,14,1,'#fff3a8');R(c,X+1,Y+13,14,1,'#c99a1c');for(let k=0;k<3;k++)R(c,X+3+k*4,Y+5,2,7,'#c99a1c');
    R(c,X+12,Y+7,2,2,'#1c2440');[[3,'#1c2440'],[7,'#3a4050'],[11,'#1c2440']].forEach(([a,col])=>R(c,X+a,Y-6,2,10,col));
  },
  /* la sonde de l'allée chaude : un pied, un afficheur rouge */
  vSonde(c,o,X,Y){
    R(c,X+4,Y+14,9,2,'rgba(10,15,30,.3)');R(c,X+7,Y+2,2,13,'#8a8f9a');R(c,X+3,Y-7,10,10,'#1c2440');R(c,X+4,Y-6,8,8,'#0e1326');txt35(c,'34',X+5,Y-4,'#e2573b',1);R(c,X+7,Y+4,2,3,'#e2573b');
  },
  /* le thermostat mural et son affichette */
  vThermostat(c,o,X,Y){R(c,X+3,Y+2,6,8,'#f4f6f8');R(c,X+4,Y+3,4,3,'#0e1326');R(c,X+5,Y+4,2,1,'#3be07a');R(c,X+4,Y+7,4,1,'#a7b0bf');R(c,X+2,Y+1,8,10,'rgba(190,225,245,.35)');R(c,X+11,Y+2,4,7,'#f7f0dc');R(c,X+11,Y+3,3,1,'#5b6380');R(c,X+11,Y+5,3,1,'#5b6380')},
  /* des conteneurs empilés sur le quai (deux cases) */
  vConteneurs(c,o,X,Y){
    R(c,X-1,Y+14,35,2,'rgba(20,30,30,.3)');[[0,2,'#c0503a'],[16,2,'#2f6db5'],[6,-10,'#2f9e7a']].forEach(([a,b,col])=>{R(c,X+a,Y+b,16,12,col);R(c,X+a,Y+b,16,1,tint(col,.25));for(let k=2;k<16;k+=3)R(c,X+a+k,Y+b+2,1,9,tint(col,-.2))});
  },
  /* un pointu, la barque des pêcheurs marseillais */
  vPointu(c,o,X,Y,t){
    R(c,X-1,Y+12,22,2,'rgba(255,255,255,.5)');R(c,X+1,Y+6,18,6,'#f7f0dc');R(c,X,Y+5,20,2,'#2f6db5');R(c,X-1,Y+4,2,3,'#c43d3d');R(c,X+19,Y+3,2,4,'#c43d3d');R(c,X+2,Y+10,16,2,'#c0503a');R(c,X+9,Y-4,1,9,'#6b4a2b');R(c,X+7,Y+2,5,4,'#e0ac7e');R(c,X+7,Y,5,2,'#f2c12e');
  },
  /* une bitte d'amarrage */
  vBitte(c,o,X,Y){R(c,X+4,Y+13,9,2,'rgba(20,30,30,.3)');R(c,X+5,Y+6,6,8,'#3a4050');R(c,X+4,Y+4,8,3,'#59627c');R(c,X+4,Y+4,8,1,'#8a93a3')},
  /* un poste de travail : trois écrans */
  vPoste(c,o,X,Y,t){R(c,X,Y+5,16,7,'#e6e2d8');R(c,X+1,Y+12,2,4,'#777');R(c,X+13,Y+12,2,4,'#777');[[0,'#4a78c9'],[5,'#2aa198'],[10,'#4a78c9']].forEach(([a,col])=>{R(c,X+1+a,Y-1,4,5,'#1c2440');R(c,X+2+a,Y,2,3,col)})}
});
