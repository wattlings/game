/* Wattlings · jeu/voyages/nucleaire/dessins.js
   Centrale nucléaire de Neutron-sur-Mer : les dessins du site.
   - ce qui est peint sur la carte (NUCP : les bâtiments réacteurs, les lignes à très haute tension) ;
   - les objets posés dessus (VOY.dessins : portique, simulateur, fût, chauffe-eau…).
   Un dessin d'objet reçoit (c, o, X, Y, t) : le coin haut-gauche de sa case en pixels, l'objet, le compteur d'images t. */

/* ================= PEINT SUR LA CARTE ================= */
const NUCP={
  /* un bâtiment réacteur : un cylindre de béton coiffé d'un dôme, peint d'un bloc à partir de sa case haut-gauche (4 cases sur 5) */
  reacteur(c,d,X,Y,x,y,at,m){
    if(at(-1,0)==='P'||at(0,-1)==='P')return;
    let w=0,h=0;while(at(w,0)==='P')w++;while(at(0,h)==='P')h++;const W=w*16,H=h*16,cx=X+W/2,B=['#f1eee4','#dedacb','#c4c0b2','#a8a394','#8f8b80'];
    R(c,X-2,Y+H-3,W+6,4,'rgba(20,30,30,.3)');
    const haut=Y+26;                                                    // là où finit le dôme et commence le cylindre
    for(let j=haut;j<Y+H-2;j++){R(c,X+2,j,W-4,1,B[1]);R(c,X+2,j,5,1,B[0]);R(c,X+W-12,j,6,1,B[2]);R(c,X+W-6,j,4,1,B[3])}
    for(let k=0;k<6;k++)R(c,X+8+k*9,haut,1,H-28,k%2?B[2]:'#e9e5d8');     // les nervures du béton
    for(let j=haut+12;j<Y+H-4;j+=14)R(c,X+2,j,W-4,1,B[2]);
    for(let j=0;j<24;j++){const r=Math.round(Math.sqrt(1-Math.pow((24-j)/24,2))*(W/2-2));R(c,cx-r,Y+2+j,r*2,1,B[1]);R(c,cx-r,Y+2+j,Math.max(2,r>>2),1,B[0]);R(c,cx+r-Math.max(2,r>>2),Y+2+j,Math.max(2,r>>2),1,B[3])}
    R(c,cx-3,Y,6,3,B[3]);R(c,cx-1,Y-3,2,3,'#c43d3d');                                                       // le paratonnerre et son feu
    R(c,X+2,haut-1,W-4,2,B[3]);R(c,X+2,Y+H-4,W-4,2,B[4]);
    R(c,X-6,Y+H-22,14,20,'#b9b5a9');R(c,X-6,Y+H-22,14,2,'#d9d5c8');R(c,X-3,Y+H-13,7,11,'#4f6f58');R(c,X-2,Y+H-18,5,4,'#f2c12e');   // le sas d'accès, sa porte, son trèfle
    let n=1;for(let k=1;k<=x;k++)if(at(-k,0)==='P'&&at(-k-1,0)!=='P')n++;                                  // son numéro : 1 pour le plus à l'ouest
    R(c,cx-9,haut+8,18,16,'#1c2440');txt35(c,String(n),cx-3,haut+11,'#f7f0dc',2);
  },
  /* la salle des machines : un long hall, de grandes baies, un bardage bleu */
  machines:{sol:'asphalte',pose:'batiment',mur:'#cfd6de',toit:'#59627c',toitH:11,bande:'#2f6db5',fenetres:[10,34,58,82,130,154],porte:[6,22,'#3a4050'],plaque:'TURBINE'},
  /* après tout le reste : les lignes à très haute tension, qui partent du transformateur vers l'est */
  finitions(sol,devant,m){
    if(!m.lignes)return;devant.strokeStyle='rgba(40,50,70,.75)';devant.lineWidth=1;
    m.lignes.forEach(([x0,y0,x1,y1])=>{[-5,0,5].forEach(k=>{devant.beginPath();devant.moveTo(x0*16+8+k,y0*16-30);devant.quadraticCurveTo((x0+x1)*8+8,(y0+y1)*8-14,x1*16+8+k,y1*16-30);devant.stroke()})});
  }
};

/* ================= LES OBJETS ================= */
OFX_ANIM.vCompteurCarbone=1;OFX_ANIM.vSimulateur=1;
Object.assign(VOY.dessins,{
  /* le portique de radioprotection, à l'entrée du site */
  vPortique(c,o,X,Y){
    R(c,X-2,Y+14,20,2,'rgba(20,30,30,.28)');R(c,X-2,Y-12,4,27,'#e8eef5');R(c,X+14,Y-12,4,27,'#e8eef5');R(c,X-2,Y-12,1,27,'#fff');R(c,X+17,Y-12,1,27,'#a7b0bf');
    R(c,X-2,Y-15,20,4,'#2f6db5');R(c,X-2,Y-15,20,1,'#6f9be0');R(c,X+6,Y-14,4,2,'#3be07a');R(c,X-1,Y-6,2,8,'#f2c12e');R(c,X+15,Y-6,2,8,'#f2c12e');
  },
  /* un pylône à très haute tension */
  vPylone(c,o,X,Y){
    R(c,X+2,Y+14,13,2,'rgba(20,30,30,.25)');c.strokeStyle='#8a8f9a';c.lineWidth=1;
    c.beginPath();c.moveTo(X+2.5,Y+15);c.lineTo(X+7.5,Y-34);c.moveTo(X+13.5,Y+15);c.lineTo(X+9.5,Y-34);c.stroke();
    for(let k=0;k<5;k++){const y=Y+10-k*9,w=5-k;c.beginPath();c.moveTo(X+8.5-w,y);c.lineTo(X+8.5+w,y-9);c.moveTo(X+8.5+w,y);c.lineTo(X+8.5-w,y-9);c.stroke()}
    [[-30,9],[-22,7]].forEach(([dy,w])=>{R(c,X+8-w,Y+dy,w*2+1,1,'#8a8f9a');R(c,X+8-w,Y+dy+1,1,3,'#59627c');R(c,X+8+w,Y+dy+1,1,3,'#59627c')});
  },
  /* le simulateur de conduite : deux cases de pupitre, des voyants qui clignotent, un capot rouge */
  vSimulateur(c,o,X,Y,t){
    R(c,X,Y+14,33,2,'rgba(20,30,30,.28)');R(c,X+1,Y+6,30,9,'#59627c');R(c,X+1,Y-8,30,15,'#d9dde3');R(c,X+1,Y-8,30,1,'#f4f6f8');R(c,X+30,Y-8,1,15,'#a7b0bf');
    R(c,X+3,Y-6,12,8,'#0e1326');for(let k=0;k<10;k++)R(c,X+4+k,Y+1-((k*k)>>3)-1,1,1,'#3be07a');R(c,X+4,Y-2,10,1,'#39426a');
    for(let k=0;k<4;k++)R(c,X+17+k*3,Y-6,2,2,((t>>4)+k)%4?'#3be07a':'#f2a33a');R(c,X+17,Y-2,6,3,'#3a4050');R(c,X+18,Y-1,1,1,'#f7f0dc');
    R(c,X+25,Y-4,5,5,'#c43d3d');R(c,X+25,Y-4,5,1,'#e88a8a');R(c,X+24,Y+1,7,1,'#8a93a3');
  },
  /* le fût factice, coupé pour montrer le verre */
  vFut(c,o,X,Y){
    R(c,X+2,Y+14,13,2,'rgba(20,30,30,.28)');R(c,X+3,Y-2,10,16,'#f2c12e');R(c,X+3,Y-2,2,16,'#fff3a8');R(c,X+11,Y-2,2,16,'#c99a1c');R(c,X+3,Y+2,10,1,'#c99a1c');R(c,X+3,Y+10,10,1,'#c99a1c');
    R(c,X+6,Y-2,6,9,'#8a8f9a');R(c,X+7,Y-1,4,7,'#1c1c22');R(c,X+8,Y,1,2,'#59627c');R(c,X+5,Y+5,5,4,'#1c2440');R(c,X+7,Y+6,1,1,'#f2c12e');R(c,X+6,Y+7,1,1,'#f2c12e');R(c,X+8,Y+7,1,1,'#f2c12e');
  },
  /* le chauffe-eau de 1968, sur son socle */
  vBallon(c,o,X,Y){
    R(c,X+1,Y+14,15,2,'rgba(20,30,30,.28)');R(c,X+2,Y+10,12,5,'#b9b5a9');R(c,X+2,Y+10,12,1,'#d9d5c8');
    R(c,X+4,Y-10,8,20,'#e8e4d6');R(c,X+4,Y-10,2,20,'#f7f4ec');R(c,X+10,Y-10,2,20,'#c4bfb0');R(c,X+5,Y-12,6,2,'#c4bfb0');R(c,X+4,Y+8,8,2,'#a8a394');
    R(c,X+6,Y+2,4,4,'#3a3530');R(c,X+7,Y+3,2,2,'#f2a33a');R(c,X+7,Y-14,1,3,'#8a5a3a');R(c,X+9,Y-14,1,3,'#4a78c9');R(c,X+6,Y-5,4,3,'#c0503a');
  },
  /* le compteur de Mme Carbone : un grand afficheur, un chiffre qui ne bouge presque pas */
  vCompteurCarbone(c,o,X,Y,t){
    R(c,X-1,Y+14,19,2,'rgba(20,30,30,.28)');R(c,X+1,Y+2,2,13,'#59627c');R(c,X+13,Y+2,2,13,'#59627c');R(c,X-2,Y-14,20,17,'#1c2440');R(c,X-1,Y-13,18,15,'#0e1326');
    txt35(c,'20',X+2,Y-11,'#3be07a',2);R(c,X+1,Y-2+((t>>5)%2),14,1,'#2a9a56');R(c,X+13,Y-11,3,1,(t>>4)%2?'#3be07a':'#1f8a48');
  },
  /* le tableau de M. Planning : douze colonnes, des cases de couleur */
  vPlanning(c,o,X,Y){
    R(c,X-1,Y+14,19,2,'rgba(20,30,30,.28)');R(c,X+1,Y+2,2,13,'#6b4a2b');R(c,X+13,Y+2,2,13,'#6b4a2b');R(c,X-3,Y-14,22,17,'#8a6538');R(c,X-2,Y-13,20,15,'#f7f0dc');
    for(let k=0;k<6;k++)R(c,X-1+k*3+1,Y-12,1,13,'#d9cfb0');
    [[2,-11,6,'#c43d3d'],[10,-8,6,'#f2a33a'],[5,-5,4,'#4a78c9'],[13,-2,4,'#2f9e7a']].forEach(([a,b,l,col])=>R(c,X-2+a,Y+b,l,2,col));
  },
  /* une caméra de surveillance sur son mât */
  vCamera(c,o,X,Y){R(c,X+5,Y+14,7,2,'rgba(20,30,30,.25)');R(c,X+7,Y-10,2,25,'#8a8f9a');R(c,X+3,Y-13,9,4,'#e8eef5');R(c,X+3,Y-13,9,1,'#fff');R(c,X+2,Y-12,2,2,'#1c2440');R(c,X+10,Y-10,2,2,'#c43d3d')},
  /* une porte de zone contrôlée, dans un mur */
  vPorteZone(c,o,X,Y){R(c,X+2,Y-4,12,20,'#4f6f58');R(c,X+2,Y-4,12,1,'#6f8f78');R(c,X+13,Y-4,1,20,'#3a5544');R(c,X+5,Y-1,6,6,'#f2c12e');R(c,X+7,Y,2,1,'#1c2440');R(c,X+6,Y+2,1,2,'#1c2440');R(c,X+9,Y+2,1,2,'#1c2440');R(c,X+12,Y+7,2,3,'#1c2440');R(c,X+12,Y+8,1,1,'#c43d3d')},
  /* une mouette sur la clôture */
  vMouette(c,o,X,Y){R(c,X+4,Y+2,8,5,'#f7f4ec');R(c,X+3,Y+3,5,4,'#b0b6c0');R(c,X+10,Y-1,4,4,'#f7f4ec');R(c,X+14,Y+1,2,1,'#f2a33a');R(c,X+12,Y,1,1,'#1c2440');R(c,X+6,Y+7,1,2,'#f2a33a');R(c,X+9,Y+7,1,2,'#f2a33a')}
});

/* ce qui est posé sur les tables de l'esplanade (objets vTable) */
const NUCT={
  /* la maquette de la fission : un gros noyau, des billes de neutrons */
  fission(c,X,Y){R(c,X+5,Y-5,6,6,'#c43d3d');R(c,X+6,Y-6,4,8,'#c43d3d');R(c,X+6,Y-4,2,2,'#e88a8a');R(c,X+1,Y-2,2,2,'#f2c12e');R(c,X+13,Y-7,2,2,'#f2c12e');R(c,X+13,Y+1,2,2,'#f2c12e');R(c,X+3,Y-2,2,1,'#f7f0dc');R(c,X+1,Y+1,14,1,'#59627c')},
  /* la pastille sous sa loupe */
  pastille(c,X,Y){R(c,X+3,Y-7,10,10,'rgba(190,225,245,.55)');R(c,X+3,Y-7,10,1,'#eaf6fd');R(c,X+3,Y-7,1,10,'#eaf6fd');R(c,X+7,Y-1,2,3,'#1c1c22');R(c,X+9,Y-6,3,3,'#8ec9e8');R(c,X+9,Y-6,3,1,'#c9a227');R(c,X+11,Y-3,2,2,'#c9a227')}
};
