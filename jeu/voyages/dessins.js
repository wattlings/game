/* Wattlings · jeu/voyages/dessins.js
   Les dessins d'objets qui servent à plusieurs sites : transformateur, pupitre, station météo, panneaux.
   Un dessin reçoit (c, o, X, Y, t) : le coin haut-gauche de sa case en pixels, l'objet lui-même (o.theme, o.teinte…), le compteur d'images t.
   Les dessins propres à un site sont dans son dossier (voyages/<site>/dessins.js). */

OFX_ANIM.vMeteo=1;

/* le pictogramme d'un thème, dans un carré de 7 × 7 pixels : sur les panneaux, les affiches */
function voyPicto(c,theme,X,Y,col){
  if(theme==='solaire'){R(c,X+2,Y+2,3,3,col);R(c,X+3,Y,1,7,col);R(c,X,Y+3,7,1,col)}
  else if(theme==='eolien'){R(c,X+3,Y+3,1,4,col);R(c,X+3,Y,1,3,col);R(c,X,Y+4,3,1,col);R(c,X+4,Y+4,3,1,col)}
  else if(theme==='nucleaire'){R(c,X+1,Y+3,5,4,col);R(c,X+2,Y+1,3,2,col);R(c,X+3,Y,1,1,col)}
  else if(theme==='barrage'){R(c,X+2,Y,2,7,col);R(c,X+4,Y+3,1,4,col);R(c,X+5,Y+5,1,2,col);R(c,X,Y+1,2,1,col);R(c,X,Y+3,2,1,col)}
  else if(theme==='datacenter'){for(let k=0;k<3;k++){R(c,X+k*3-(k?1:0),Y,2,7,col)}}
}

Object.assign(VOY.dessins,{
  /* le transformateur : la cuve, ses ailettes, trois isolateurs. Dessiné sur deux cases de large */
  vTransfo(c,o,X,Y){
    R(c,X-1,Y+13,35,3,'rgba(20,30,30,.3)');R(c,X,Y+11,32,4,'#b9b5a9');R(c,X,Y+11,32,1,'#d9d5c8');                // la dalle
    R(c,X+3,Y-6,26,18,'#6d7a70');R(c,X+3,Y-6,26,1,'#93a096');R(c,X+28,Y-6,1,18,'#4c574f');
    for(let k=0;k<6;k++){R(c,X+5+k*4,Y-3,2,13,'#566259');R(c,X+5+k*4,Y-3,1,13,'#7f8c82')}                         // les ailettes de refroidissement
    [8,15,22].forEach(a=>{R(c,X+a,Y-14,3,8,'#8a5a3a');for(let j=0;j<3;j++)R(c,X+a-1,Y-13+j*3,5,1,'#b98d57');R(c,X+a+1,Y-16,1,2,'#c4c9cf')});
    R(c,X+12,Y+2,9,7,'#f2c12e');R(c,X+12,Y+2,9,1,'#fff3a8');R(c,X+16,Y+4,1,3,'#1c2440');R(c,X+16,Y+8,1,1,'#1c2440');
  },
  /* le pupitre des trackers : une manette, un petit écran */
  vPupitre(c,o,X,Y){
    R(c,X+1,Y+14,15,2,'rgba(20,30,30,.28)');R(c,X+6,Y+6,4,9,'#59627c');R(c,X+1,Y-2,14,9,'#d9dde3');R(c,X+1,Y-2,14,1,'#f4f6f8');R(c,X+1,Y+6,14,1,'#8a93a3');
    R(c,X+3,Y,6,4,'#1c2440');R(c,X+4,Y+1,4,1,'#f2a33a');R(c,X+5,Y+2,2,1,'#f2a33a');R(c,X+11,Y+1,2,4,'#3a4050');R(c,X+10,Y-1,4,3,'#c43d3d');
  },
  /* la station météo : un mât, la coupole qui mesure le rayonnement, l'anémomètre qui tourne */
  vMeteo(c,o,X,Y,t){
    R(c,X+4,Y+14,9,2,'rgba(20,30,30,.28)');R(c,X+7,Y-14,2,29,'#8a8f9a');R(c,X+7,Y-14,1,29,'#c4c9cf');
    const a=((SKR.turb*7)|0)%3;R(c,X+2+a,Y-16,4,2,'#c43d3d');R(c,X+10-a,Y-16,4,2,'#c43d3d');R(c,X+7,Y-17,2,3,'#3a4050');
    R(c,X+9,Y-8,6,1,'#8a8f9a');R(c,X+12,Y-11,4,3,'rgba(190,225,245,.8)');R(c,X+13,Y-12,2,1,'#eaf6fd');R(c,X+12,Y-8,4,1,'#3a4050');     // le pyranomètre
    R(c,X+1,Y-6,6,4,'#1f3d7c');R(c,X+1,Y-6,6,1,'#8fb6ee');R(c,X+4,Y+2,8,7,'#e8eef5');R(c,X+4,Y+2,8,1,'#fff');R(c,X+5,Y+4,6,2,'#1c2440');R(c,X+6,Y+4,3,1,(t>>4)%2?'#3be07a':'#f2a33a');
  },
  /* le panneau « danger » accroché au grillage */
  vDanger(c,o,X,Y){R(c,X+3,Y+3,10,9,'#f2c12e');R(c,X+3,Y+3,10,1,'#fff3a8');R(c,X+3,Y+11,10,1,'#c99a1c');R(c,X+7,Y+5,2,3,'#1c2440');R(c,X+7,Y+9,2,1,'#1c2440')},
  /* le grand panneau d'un site, à la sortie du quai : o.theme choisit le pictogramme, o.teinte le bandeau */
  vPanneau(c,o,X,Y){
    R(c,X-3,Y+14,23,2,'rgba(20,30,30,.28)');R(c,X-2,Y-2,2,17,'#6b4a2b');R(c,X+16,Y-2,2,17,'#6b4a2b');
    R(c,X-5,Y-22,26,21,'#1c2440');R(c,X-4,Y-21,24,19,'#f7f0dc');R(c,X-4,Y-21,24,7,o.teinte||'#f2a33a');
    voyPicto(c,o.theme,X-2,Y-21,'#fffaf0');R(c,X+7,Y-19,11,1,'#1c2440');R(c,X+7,Y-17,7,1,'#1c2440');
    [[-12,14],[-9,18],[-6,11],[-3,16]].forEach(([b,l])=>R(c,X-2,Y+b,l,1,'#5b6380'));
  },
  /* une affiche sur deux poteaux : des chiffres, trois barres */
  vPoster(c,o,X,Y){
    R(c,X-1,Y+14,19,2,'rgba(20,30,30,.28)');R(c,X,Y,2,15,'#59627c');R(c,X+14,Y,2,15,'#59627c');R(c,X-2,Y-16,20,18,'#1c2440');R(c,X-1,Y-15,18,16,'#f7f0dc');
    voyPicto(c,o.theme,X,Y-14,o.teinte||'#f2a33a');
    [[8,3,o.teinte||'#f2a33a'],[11,6,'#4a78c9'],[14,10,'#59627c']].forEach(([a,h,col])=>R(c,X+a,Y-4-h,2,h,col));R(c,X+7,Y-4,10,1,'#1c2440');R(c,X+1,Y-2,14,1,'#5b6380');
  },
  /* une plaque d'information sur pied : ce qu'on lit en se penchant */
  vPlaque(c,o,X,Y){
    R(c,X+3,Y+14,11,2,'rgba(20,30,30,.28)');R(c,X+7,Y+6,2,9,'#59627c');R(c,X+2,Y-1,12,8,'#1c2440');R(c,X+3,Y,10,6,o.teinte||'#f7f0dc');R(c,X+4,Y+1,6,1,'#1c2440');R(c,X+4,Y+3,8,1,'#5b6380');R(c,X+4,Y+4,5,1,'#5b6380');
  },
  /* une table avec une maquette : o.dessin(c, X, Y) dessine ce qui est posé dessus */
  vTable(c,o,X,Y){
    R(c,X,Y+14,17,2,'rgba(20,30,30,.28)');R(c,X,Y+4,16,8,'#a07845');R(c,X,Y+4,16,2,'#c9a26e');R(c,X+1,Y+12,2,3,'#6b4a2b');R(c,X+13,Y+12,2,3,'#6b4a2b');
    if(o.dessin)o.dessin(c,X,Y);
  }
});
