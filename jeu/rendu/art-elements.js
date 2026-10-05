/* Wattlings · jeu/rendu/art-elements.js
   Rendu détaillé : éléments posés sur le sol. */

/* ---- éléments posés sur le sol : dessinés rangée par rangée, par-dessus les bâtiments ---- */
function artProp(c,o,ch,x,y,at){
  const X=x*TS,Y=y*TS,h=thash(x,y);
  if(ch==='T'){const s=ART.tree[artTreeKind(x,y)][(h*3)|0],sx=X-3+(((h*7)|0)%3-1),sy=Y-14;
    c.drawImage(s,0,14,22,16,sx,sy+14,22,16);o.drawImage(s,0,0,22,14,sx,sy,22,14);return}
  if(ch==='u'){const k=regAt(x,y),B=(ART.bushR&&ART.bushR[k])||ART.bush;c.drawImage(B[(h*3)|0],X,Y-1);return}
  if(ch==='k'){if(regAt(x,y)==='bretagne'&&!SEA.snow)artMenhir(c,X,Y,x,y);else c.drawImage(ART.rock[h>.5?1:0],X,Y);return}
  if(ch==='m'){artMuret(c,x,y,at);return}
  if(ch==='h'){const L0=at(-1,0)==='h',R0=at(1,0)==='h',U0=at(0,-1)==='h',D0=at(0,1)==='h',a0=L0?0:1,w0=16-a0-(R0?0:1),y0=U0?0:2,H0=15-y0;
    R(c,X+a0,Y+15,w0,1,'rgba(20,50,30,.28)');R(c,X+a0,Y+y0,w0,H0,'#2f7a3d');
    for(let i=0;i<9;i++){const a=a0+((thash(x*3+i,y*5)*(w0-2))|0),b=y0+3+((thash(x*7,y*3+i)*(H0-5))|0);R(c,X+a,Y+b,2,1,i<5?'#46995a':'#245f30');if(i<3)R(c,X+a,Y+b-1,1,1,'#63b56c')}
    if(!U0){R(c,X+a0,Y+y0,w0,3,'#58ad62');R(c,X+a0+1,Y+y0,w0-2,1,'#8fd68a');for(let i=0;i<4;i++)R(c,X+a0+1+((thash(x+i,y*11)*(w0-3))|0),Y+y0+2,2,1,'#3d8c4d');R(c,X+a0,Y+y0,1,1,'#2f7a3d');R(c,X+a0+w0-1,Y+y0,1,1,'#2f7a3d')}
    if(!D0){R(c,X+a0,Y+13,w0,2,'#1f5230');R(c,X+a0,Y+12,w0,1,'#276638')}
    if(!L0)R(c,X+a0,Y+y0+1,1,H0-1,'#1f5230');if(!R0)R(c,X+a0+w0-1,Y+y0+1,1,H0-1,'#1a4629');
    if(h>.74){const col=h>.9?'#fff7e6':h>.82?'#f39ab8':'#f7e36b';[[4,5+y0],[10,8+y0]].forEach(([a,b])=>{R(c,X+a,Y+b,1,1,col);R(c,X+a+1,Y+b+1,1,1,col);R(c,X+a+1,Y+b,1,1,'#f7d84a')})}return}
  if(ch==='f'){const L0=at(-1,0)==='f',R0=at(1,0)==='f',U0=at(0,-1)==='f',D0=at(0,1)==='f',hz=L0||R0||!(U0||D0);
    const post=(px)=>{R(c,X+px-1,Y+15,5,1,'rgba(20,50,30,.28)');R(c,X+px,Y+2,3,13,'#b98d57');R(c,X+px,Y+2,1,13,'#dcb682');R(c,X+px+2,Y+2,1,13,'#86602f');R(c,X+px,Y+1,3,1,'#e8c796');R(c,X+px-1,Y+2,5,1,'#cfa46a');R(c,X+px,Y+14,3,1,'#5d4024')};
    if(hz){[5,10].forEach(ry=>{R(c,X+(L0?0:2),Y+ry,16-(L0?0:2)-(R0?0:2),2,'#cfa46a');R(c,X+(L0?0:2),Y+ry,16-(L0?0:2)-(R0?0:2),1,'#e8c796');R(c,X+(L0?0:2),Y+ry+2,16-(L0?0:2)-(R0?0:2),1,'#86602f')});post(2);post(10)}
    if(U0||D0){R(c,X+7,Y+(U0?0:4),2,(D0?16:12)-(U0?0:4),'#cfa46a');R(c,X+9,Y+(U0?0:4),1,(D0?16:12)-(U0?0:4),'#86602f');if(!hz)post(6)}return}
  if(ch==='P'){R(c,X,Y+15,16,1,'rgba(20,50,30,.3)');R(c,X,Y+1,16,14,'#b98d57');for(let k=0;k<4;k++){R(c,X+k*4,Y+1,1,14,'#86602f');R(c,X+k*4+1,Y+1,1,14,'#d4ac78');R(c,X+k*4+2,Y+3+((thash(x*4+k,y)*8)|0),1,2,'#a07a48')}
    R(c,X,Y+1,16,1,'#e3c08f');R(c,X,Y+13,16,2,'#7a5630');R(c,X,Y+4,16,1,'#a07a48');R(c,X,Y+11,16,1,'#a07a48');
    if((x*3+y)%7===0){R(c,X+2,Y+5,12,6,'#1c2440');R(c,X+3,Y+6,10,4,'#f2c12e');R(c,X+7,Y+6,2,2,'#1c2440');R(c,X+7,Y+9,2,1,'#1c2440')}else if(h>.86){for(let k=0;k<12;k+=4){R(c,X+2+k,Y+6,2,3,'#e2573b');R(c,X+4+k,Y+6,2,3,'#f7f0dc')}}return}
}
