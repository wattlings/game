/* Wattlings · jeu/rendu/decor-gare.js
   Décor : la gare et son train. */

/* ---- gare : façade, train à quai ---- */
const STATION_BOARD=[8,9];      // colonnes du mur (depuis le bord gauche) qui portent le tableau des départs
function drawStationFacade(c,b){
  const X=b.x*TS,Y=b.y*TS,W=b.w*TS,rh=Math.ceil(b.h*.45)*TS,dx=b.door[0]*TS,dy=b.door[1]*TS;
  R(c,dx-22,Y+rh-13,60,12,'#1c2440');R(c,dx-21,Y+rh-12,58,10,'#f7f0dc');['G','A','R','E'].forEach((ch,i)=>px35(c,ch,dx-13+i*9,Y+rh-11,'#1c2440',2));
  R(c,dx+3,Y+2,12,12,'#f7f0dc');R(c,dx+4,Y+1,10,14,'#f7f0dc');R(c,dx+8,Y+4,1,5,'#1c2440');R(c,dx+8,Y+8,4,1,'#1c2440');
  R(c,dx+2,dy+1,12,15,'#8a8f9a');for(let k=0;k<5;k++)R(c,dx+2,dy+2+k*3,12,1,'#6d7480');R(c,dx+4,dy+5,8,5,'#f7f0dc');R(c,dx+5,dy+7,6,1,'#c43d3d');
  // tableau des départs, accroché au mur à droite de la porte (il remplace deux fenêtres du rez-de-chaussée)
  const bx=X+STATION_BOARD[0]*TS+1,by=Y+(b.h-1)*TS+1,bw=STATION_BOARD.length*TS-2,bh=13;
  if(b.wins)b.wins=b.wins.filter(w=>!(w[0]+w[2]>bx&&w[0]<bx+bw&&w[1]+w[3]>by&&w[1]<by+bh));
  R(c,bx-1,by-1,bw+2,bh+2,'#0e1326');R(c,bx,by,bw,bh,'#1c2440');R(c,bx,by,bw,2,'#27325a');
  for(let k=0;k<3;k++){R(c,bx+2,by+4+k*3,5,1,'#f2a33a');R(c,bx+9,by+4+k*3,9,1,'#59627c');R(c,bx+bw-8,by+4+k*3,5,1,'#f2a33a')}
  R(c,bx+2,by-3,1,2,'#59627c');R(c,bx+bw-3,by-3,1,2,'#59627c');
}
function drawTrain(c,X,Y,t){
  const car=(x,w,loco)=>{R(c,x,Y-9,w,22,'#f1e6d0');R(c,x,Y-9,w,4,'#3a4050');R(c,x,Y+4,w,5,'#00968a');R(c,x,Y+9,w,4,'#2c2c34');
    for(let k=6;k<w-8;k+=11)R(c,x+k,Y-3,7,6,'#8ec9e8');if(loco){R(c,x+w-10,Y-5,8,8,'#8ec9e8');R(c,x+w-3,Y+5,3,2,'#f2c12e')}
    for(let k=5;k<w-6;k+=14){R(c,x+k,Y+12,6,4,'#222');R(c,x+k+2,Y+13,2,2,'#8a8f9a')}};
  car(X,60,false);car(X+62,60,false);car(X+124,66,true);R(c,X+60,Y+5,2,3,'#2c2c34');R(c,X+122,Y+5,2,3,'#2c2c34');
}
