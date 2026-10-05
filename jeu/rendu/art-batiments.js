/* Wattlings · jeu/rendu/art-batiments.js
   Rendu détaillé : toits, murs, fenêtres, portes. */

/* ---- bâtiments : toits en rangs de tuiles, murs ombrés, fenêtres à croisillons, portes à panneaux ---- */
function artRoof(c,X,Y,W,rh,col,rt){
  const O=tint(col,-.52),hi=tint(col,.24),lo=tint(col,-.17),lo2=tint(col,-.32);
  if(rt==='flat'){R(c,X-2,Y+1,W+4,rh-1,O);R(c,X-1,Y+2,W+2,rh-4,'#c3c8cf');R(c,X-1,Y+2,W+2,1,'#e9ecf0');R(c,X-1,Y+2,1,rh-4,'#e9ecf0');R(c,X+W,Y+3,1,rh-5,'#9aa0aa');
    R(c,X+2,Y+5,W-4,rh-10,col);R(c,X+2,Y+5,W-4,1,lo2);R(c,X+2,Y+5,1,rh-10,lo2);R(c,X+2,Y+rh-6,W-4,1,hi);for(let k=10;k<W-6;k+=10)R(c,X+k,Y+6,1,rh-12,tint(col,-.08));
    for(let i=0;i<6;i++)R(c,X+4+((thash(X+i,Y)*(W-10))|0),Y+7+((thash(X,Y+i)*(rh-14))|0),2,1,tint(col,.09));
    R(c,X-1,Y+rh-3,W+2,1,'#9aa0aa');R(c,X-2,Y+rh-2,W+4,1,'#7d838d');return}
  for(let i=0;i<rh;i++){const a=rt==='gable'?Math.max(0,8-i):rt==='mansard'&&i<4?4:0,x0=X-2+a,w=W+4-2*a,r=i%4,row=(i/4)|0,dp=i/rh;
    if(i===0){R(c,x0,Y,w,1,O);continue}
    const base=tint(col,(rt==='mansard'&&i<4?-.14:0)+.06-dp*.16);
    R(c,x0,Y+i,w,1,r===0?lo:r===1?tint(col,.16-dp*.14):base);
    if(r!==0)for(let k=(row%2)*3+1;k<w-1;k+=6)R(c,x0+k,Y+i,1,1,r===1?base:lo);
    R(c,x0,Y+i,1,1,O);R(c,x0+w-1,Y+i,1,1,O);if(w>6){R(c,x0+1,Y+i,1,1,hi);R(c,x0+w-2,Y+i,2,1,lo2);R(c,x0+w-1,Y+i,1,1,O)}}
  R(c,X-3,Y+rh-3,W+6,1,lo2);R(c,X-3,Y+rh-2,W+6,1,tint(col,-.04));R(c,X-3,Y+rh-1,W+6,1,O);R(c,X-3,Y+rh-3,1,2,O);R(c,X+W+2,Y+rh-3,1,2,O);
}
function artWall(c,X,WY,W,h,col){
  const O=tint(col,-.5);R(c,X,WY,W,h,col);R(c,X,WY,W,2,tint(col,-.2));R(c,X,WY+2,W,1,tint(col,-.09));
  for(let k=6;k<h-4;k+=4)R(c,X+1,WY+k,W-2,1,tint(col,-.04));
  R(c,X+1,WY+3,1,h-6,tint(col,.35));R(c,X+W-2,WY+2,1,h-5,tint(col,-.13));R(c,X,WY,1,h,O);R(c,X+W-1,WY,1,h,O);
  R(c,X,WY+h-3,W,3,'#8f8676');R(c,X,WY+h-3,W,1,'#b9af9a');for(let k=3;k<W;k+=7)R(c,X+k,WY+h-2,1,2,'#6f6759');R(c,X,WY+h-1,W,1,'#5f584c');R(c,X+1,WY+h,W,2,'rgba(20,40,30,.22)');
}
function artWin(c,x,y,w,h,wall){
  R(c,x-1,y-1,w+2,h+2,tint(wall,-.45));R(c,x,y,w,h,'#f6f3e9');
  R(c,x+1,y+1,w-2,h-2,'#74aedb');R(c,x+1,y+1,w-2,Math.max(1,(h-2)>>1),'#a6d4f0');R(c,x+1,y+1,Math.min(3,w-2),1,'#e9f8fe');if(w>5)R(c,x+2,y+2,2,1,'#e9f8fe');
  if(w>=9)R(c,x+(w>>1),y+1,1,h-2,'#f6f3e9');if(h>=8)R(c,x+1,y+(h>>1),w-2,1,'#f6f3e9');
  R(c,x-1,y+h,w+2,1,'#ece6d6');R(c,x-1,y+h+1,w+2,1,'rgba(20,30,40,.25)');
}
function artDoor(c,dx,dy,col,wall){
  R(c,dx+1,dy,14,16,tint(wall,-.45));R(c,dx+2,dy+1,12,15,'#f6f3e9');R(c,dx+3,dy+2,10,14,col);R(c,dx+3,dy+2,10,1,tint(col,.25));R(c,dx+3,dy+2,1,14,tint(col,.15));R(c,dx+12,dy+3,1,13,tint(col,-.25));
  [[4,4,3,4],[9,4,3,4],[4,10,3,5],[9,10,3,5]].forEach(([a,b,w,h])=>{R(c,dx+a,dy+b,w,h,tint(col,-.16));R(c,dx+a,dy+b+h-1,w,1,tint(col,.12));R(c,dx+a+w-1,dy+b,1,h,tint(col,.12))});
  R(c,dx+11,dy+9,1,2,'#f7d84a');R(c,dx+11,dy+9,1,1,'#fff3b0');R(c,dx,dy+16,16,2,'#d6cfbd');R(c,dx,dy+16,16,1,'#ece6d6');R(c,dx,dy+18,16,1,'rgba(20,40,30,.25)');
}
/* sprite quelconque : dessiné une fois dans un petit canevas, contour et volume ajoutés, puis mis en cache */
const FXC=new Map();
function fxSprite(key,w,h,draw){let s=FXC.get(key);if(!s){if(FXC.size>400)FXC.clear();s=mkc(w,h);const g=s.getContext('2d');draw(g);gbaFx(g,w,h);FXC.set(key,s)}return s}
