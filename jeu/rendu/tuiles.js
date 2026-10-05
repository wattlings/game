/* Wattlings · jeu/rendu/tuiles.js
   Dessin pixel : l'écran de jeu et les tuiles de base (herbe, chemins, eau…). */

/* ================= DESSIN PIXEL ================= */
const cv=$('screen'),ctx=cv.getContext('2d');ctx.imageSmoothingEnabled=false;
function R(c,x,y,w,h,col){c.fillStyle=col;c.fillRect(x,y,w,h)}
function drawTile0(c,ch,x,y,mapId){
  const X=x*TS,Y=y*TS,h=hash(x,y);
  const town=mapId==='town',G=MAPS[mapId].g,at=(dx,dy)=>G[y+dy]&&G[y+dy][x+dx];
  // herbe : trois verts par grandes plaques, des touffes, parfois un caillou, un trèfle, un champignon
  const grass=()=>{const n=town?vnoise(x/5+13,y/5+29):.5,k=Math.floor(h*97)%97;{const m=n+(h-.5)*.22;R(c,X,Y,16,16,m<.36?'#75bf64':m>.66?'#83ca71':'#7cc56a')}
    if(h>.5){R(c,X+3+(h*8|0),Y+4,1,2,'#5fa854');R(c,X+10-(h*5|0),Y+11,1,2,'#5fa854')}
    if(!town)return;if(k<5){R(c,X+6,Y+9,1,3,'#5fa854');R(c,X+8,Y+8,1,4,'#4f9a4a');R(c,X+10,Y+9,1,3,'#5fa854')}else if(k<7){R(c,X+9,Y+6,3,2,'#b9b4a6');R(c,X+9,Y+8,3,1,'#8f8a7c')}else if(k===7){R(c,X+5,Y+10,3,2,'#d9483b');R(c,X+6,Y+12,1,2,'#f7f0dc');R(c,X+6,Y+10,1,1,'#fff')}else if(k<11){R(c,X+4,Y+5,2,2,'#4f9a4a');R(c,X+6,Y+4,2,2,'#4f9a4a');R(c,X+5,Y+6,2,2,'#4f9a4a')}};
  // coins arrondis : un coin de chemin ou de piste qui donne sur l'herbe est rogné
  const round=(isP,col)=>{[[-1,-1,0,0],[1,-1,13,0],[-1,1,0,13],[1,1,13,13]].forEach(([dx,dy,ox,oy])=>{if(!isP(at(dx,0))&&!isP(at(0,dy))){R(c,X+ox,Y+oy,3,3,col);R(c,X+(dx<0?0:11),Y+(dy<0?0:14),5,2,col);R(c,X+(dx<0?0:14),Y+(dy<0?0:11),2,5,col)}})};
  switch(ch){
    case '.':case 'B':case 'D':case 'w':grass();break;
    case 'b':{const G=MAPS[mapId].g,at=(dx,dy)=>G[y+dy]&&G[y+dy][x+dx],rd=(dx,dy)=>{const t=at(dx,dy);return t==='b'||t==='g'},hard=(dx,dy)=>{const t=at(dx,dy);return t==='b'||t==='g'||t==='='||t==='D'||t==='q'};
      R(c,X,Y,16,16,'#c58a6a');if(h>.5)R(c,X+(h*12|0),Y+(h*53%12|0),2,1,'#b67c5d');if(h<.3)R(c,X+((h*40|0)%13),Y+9,1,1,'#d6a184');
      if(!hard(0,-1))R(c,X,Y,16,1,'#efe4cc');if(!hard(0,1))R(c,X,Y+15,16,1,'#a8704f');if(!hard(-1,0))R(c,X,Y,1,16,'#efe4cc');if(!hard(1,0))R(c,X+15,Y,1,16,'#a8704f');
      const hz=rd(-1,0)||rd(1,0),vt=rd(0,-1)||rd(0,1);
      if(hz&&rd(0,1)&&!rd(0,-1)&&x%2===0)R(c,X+3,Y+15,10,1,'#f7f0dc');if(vt&&rd(1,0)&&!rd(-1,0)&&y%2===0)R(c,X+15,Y+3,1,10,'#f7f0dc');
      if((x*7+y*13)%29===0){const w='#f7f0dc';R(c,X+3,Y+8,3,3,w);R(c,X+4,Y+9,1,1,'#c58a6a');R(c,X+10,Y+8,3,3,w);R(c,X+11,Y+9,1,1,'#c58a6a');R(c,X+5,Y+7,6,1,w);R(c,X+5,Y+6,2,1,w);R(c,X+10,Y+5,2,2,w)}break}
    case 'h':{grass();const L0=at(-1,0)==='h',R0=at(1,0)==='h',a0=L0?0:2,w0=16-a0-(R0?0:2);R(c,X+a0,Y+4,w0,11,'#2f6d34');R(c,X+a0,Y+3,w0,2,'#3f8a4a');R(c,X+2+(h*9|0),Y+7,2,2,'#4f9a4a');R(c,X+9-(h*5|0),Y+10,2,1,'#255a2b');R(c,X+a0,Y+14,w0,2,'#255a2b');if(h>.55){const col=h>.85?'#f7f0dc':h>.7?'#e57399':'#f7e36b';R(c,X+4,Y+6,2,2,col);R(c,X+10,Y+9,2,2,col)}break}
    case 'R':{const G=MAPS[mapId].g,wt=dx=>{const t=G[y]&&G[y][x+dx];return t==='R'||t==='g'||t==='r'};
      R(c,X,Y,16,16,'#4a9fd8');R(c,X+2+(h*6|0),Y+4,5,1,'#8fd0f0');R(c,X+8-(h*4|0),Y+11,5,1,'#8fd0f0');if(h>.8)R(c,X+5,Y+8,3,1,'#b8e4f7');
      if(wt(-1)&&wt(1)){const k=(h*53|0)%53;if(k<3){R(c,X+5,Y+6,5,4,'#4f9a4a');R(c,X+6,Y+5,3,6,'#4f9a4a');R(c,X+8,Y+7,2,1,'#4a9fd8');if(k===0)R(c,X+6,Y+7,2,2,'#f7c8dc')}else if(k===3){R(c,X+6,Y+8,5,4,'#8f8a7c');R(c,X+7,Y+7,3,1,'#a8a395');R(c,X+5,Y+12,7,1,'#3a86bd')}}
      if(!wt(-1)){R(c,X,Y,3,16,'#3a86bd');R(c,X,Y,1,16,'#5fa854');if(h>.55){R(c,X+2,Y+3,1,7,'#3f8a3a');R(c,X+4,Y+6,1,5,'#3f8a3a')}}
      if(!wt(1)){R(c,X+13,Y,3,16,'#3a86bd');R(c,X+15,Y,1,16,'#5fa854');if(h<.4){R(c,X+13,Y+5,1,7,'#3f8a3a');R(c,X+11,Y+8,1,5,'#3f8a3a')}}break}
    case 'g':{const G=MAPS[mapId].g,br=dy=>{const t=G[y+dy]&&G[y+dy][x];return t==='g'};
      R(c,X,Y,16,16,'#a07845');for(let k=0;k<4;k++)R(c,X+k*4+3,Y,1,16,'#8a6538');if(!br(-1)){R(c,X,Y,16,3,'#6b4a2b');R(c,X,Y,16,1,'#8a6538')}if(!br(1)){R(c,X,Y+13,16,3,'#6b4a2b');R(c,X,Y+15,16,1,'#4a3421')}break}
    case 'r':{const over=x>=RIVER[0]&&x<=RIVER[1];R(c,X,Y,16,16,over?'#4a9fd8':'#9a958c');if(over)R(c,X,Y+2,16,12,'#7a7f8a');else if(h>.5)R(c,X+(h*12|0),Y+13,2,1,'#86817a');
      for(let k=0;k<4;k++)R(c,X+k*4+1,Y+3,2,10,'#6b4a2b');R(c,X,Y+5,16,1,'#e1e1e6');R(c,X,Y+10,16,1,'#e1e1e6');break}
    case 'q':R(c,X,Y,16,16,'#d9d2c0');R(c,X,Y,16,2,'#f2c12e');R(c,X,Y+15,16,1,'#b8b09c');if(x%2)R(c,X,Y+2,1,13,'#c6beaa');break;
    case '*':{grass();const pal=[['#e2573b','#f7e36b','#fff'],['#b07ad8','#e57399','#fff'],['#5aa0e8','#fff','#f7e36b'],['#f2a33a','#f7e36b','#e2573b']][town?Math.floor(vnoise(x/8+5,y/8+17)*3.99):0],o=(h*5|0);
      [[3+o%3,4,0],[10,6-o%2,1],[6,11,2],[12-o%4,12,0]].forEach(([a,b,k])=>{R(c,X+a,Y+b,2,2,pal[k]);R(c,X+a,Y+b+2,1,1,'#3f8a3a')});break}
    case ':':R(c,X,Y,16,16,'#4f9a4a');for(let i=0;i<4;i++){const bx=X+1+i*4,by=Y+(i%2?3:8);R(c,bx,by+2,1,5,'#2f6d34');R(c,bx+1,by,1,7,'#6fbf5f');R(c,bx+2,by+2,1,5,'#2f6d34')}break;
    case '=':R(c,X,Y,16,16,'#e3cf98');if(h>.3)R(c,X+(h*13|0),Y+(h*97%13|0),2,1,'#cdb57a');if(h>.7)R(c,X+4,Y+10,1,1,'#cdb57a');if(town)round(t=>t==='='||t==='b'||t==='g'||t==='D'||t===','||t==='q'||t==='d'||t===':','#7cc56a');break;
    case 'T':{grass();const sp=!town?0:(x>=WIND0||y<14&&h<.8)?1:(()=>{const n=vnoise(x/6+3,y/6+11),k=(h*31|0)%10;return n>.62?(k<7?1:0):n<.3?(k<4?2:0):k<1?3:k<2?2:0})();
      if(sp===1){R(c,X+7,Y+12,2,4,'#5d4024');[[7,1,2],[5,3,6],[4,6,8],[2,9,12]].forEach(([a,b,w])=>R(c,X+a,Y+b,w,3,'#256b45'));R(c,X+6,Y+4,2,1,'#3f8a5a');R(c,X+5,Y+7,3,1,'#3f8a5a');R(c,X+3,Y+10,4,1,'#3f8a5a')}
      else if(sp===2){R(c,X+7,Y+8,2,8,'#ece6d6');R(c,X+7,Y+10,1,1,'#555');R(c,X+8,Y+13,1,1,'#555');c.fillStyle='#3f8f52';c.beginPath();c.arc(X+8,Y+6,6,0,7);c.fill();c.fillStyle='#58ad62';c.beginPath();c.arc(X+8,Y+5,5,0,7);c.fill();c.fillStyle='#84cf7c';c.beginPath();c.arc(X+6,Y+3,2,0,7);c.fill()}
      else{R(c,X+6,Y+11,4,5,'#6b4a2b');c.fillStyle=sp===3?'#3f8f4a':'#2e7d4f';c.beginPath();c.arc(X+8,Y+7,7,0,7);c.fill();c.fillStyle=sp===3?'#5fb060':'#3f9a5f';c.beginPath();c.arc(X+6,Y+5,3,0,7);c.fill();
        if(sp===3)[[4,6],[10,4],[9,9],[6,10],[12,8]].forEach(([a,b])=>R(c,X+a,Y+b,2,2,'#d9483b'))}break}
    case 'u':grass();c.fillStyle='#2f7a3d';c.beginPath();c.arc(X+8,Y+10,6,0,7);c.fill();c.fillStyle='#46995a';c.beginPath();c.arc(X+6,Y+8,3,0,7);c.fill();if(h>.5)[[5,11],[10,8],[11,12]].forEach(([a,b])=>R(c,X+a,Y+b,1,1,h>.75?'#d9483b':'#7a5fd0'));R(c,X+3,Y+15,10,1,'rgba(0,0,0,.15)');break;
    case 'k':grass();R(c,X+3,Y+7,10,7,'#8f8a7c');R(c,X+4,Y+5,7,3,'#a8a395');R(c,X+5,Y+5,4,1,'#c4bfb0');R(c,X+3,Y+13,10,1,'#6f6a5e');if(h>.5)R(c,X+11,Y+10,3,4,'#7d786b');R(c,X+5,Y+9,2,1,'#6f9a5a');break;
    case 'P':grass();R(c,X,Y+2,16,13,'#b98d57');for(let k=0;k<4;k++)R(c,X+k*4,Y+2,1,13,'#8f6a3d');R(c,X,Y+2,16,1,'#d4ac78');R(c,X,Y+14,16,2,'#6b4a2b');if((x+y)%3===0){R(c,X+3,Y+5,10,6,'#f2c12e');R(c,X+7,Y+6,2,3,'#1c2440');R(c,X+7,Y+10,2,1,'#1c2440')}else if(h>.6)R(c,X+2,Y+7,12,2,'#e2573b');break;
    case ',':{R(c,X,Y,16,16,'#d8cdb4');for(let j=0;j<2;j++)for(let i=0;i<2;i++){const o=(j%2)*4;R(c,X+i*8+((o+0)%8),Y+j*8,7,7,(i+j+x+y)%2?'#cfc3a8':'#e0d6bf')}R(c,X,Y+7,16,1,'#bdb196');R(c,X,Y+15,16,1,'#bdb196');R(c,X+7,Y,1,7,'#bdb196');R(c,X+3,Y+8,1,7,'#bdb196');R(c,X+11,Y+8,1,7,'#bdb196');
      round(t=>t===','||t==='b'||t==='='||t==='B'||t==='D','#7cc56a');break}
    case 'd':R(c,X,Y,16,16,'#b89668');R(c,X+(h*10|0),Y+3,4,1,'#a4835a');R(c,X+2,Y+9+(h*4|0),6,1,'#a4835a');if(h>.6)R(c,X+10,Y+11,2,2,'#8f8a7c');if(h<.25){R(c,X+4,Y+5,2,1,'#cdb088');R(c,X+9,Y+13,3,1,'#cdb088')}round(t=>t==='d'||t==='b'||t==='='||t==='B'||t==='D'||t==='P','#7cc56a');break;
    case '~':R(c,X,Y,16,16,'#4aa3d8');R(c,X+2+(h*4|0),Y+5,5,1,'#8fd0f0');R(c,X+8,Y+11,5,1,'#8fd0f0');break;
    case 'p':{const G=MAPS[mapId].g,n=(dx,dy)=>G[y+dy]&&G[y+dy][x+dx]==='p',e='#ece6d4',s='#c9c0a6';R(c,X,Y,16,16,'#56c4e8');R(c,X+2+(h*6|0),Y+4,5,1,'#b8ecfa');R(c,X+8,Y+11,4,1,'#b8ecfa');if((x+y)%2)R(c,X+3,Y+8,3,1,'#8ad9f2');
      if(!n(0,-1)){R(c,X,Y,16,4,e);R(c,X,Y+4,16,1,s)}if(!n(0,1)){R(c,X,Y+12,16,4,e);R(c,X,Y+11,16,1,'#3aa3c8')}if(!n(-1,0)){R(c,X,Y,4,16,e);R(c,X+4,Y,1,16,s)}if(!n(1,0)){R(c,X+12,Y,4,16,e);R(c,X+11,Y,1,16,s)}break}
    case 'f':grass();R(c,X,Y+5,16,2,'#a07845');R(c,X,Y+10,16,2,'#a07845');R(c,X+2,Y+3,3,11,'#8a6538');R(c,X+11,Y+3,3,11,'#8a6538');break;
    case 'o':{let a='#c89b62',b='#b3874f';if(mapId==='rdc'){[a,b]=site().floor}
      R(c,X,Y,16,16,a);if(mapId==='rdc'&&S.site==='boulangerie'){if((x+y)%2)R(c,X,Y,16,16,b)}else if(mapId==='rdc'&&S.site==='bureau'){if(h>.6)R(c,X+(h*12|0),Y+(h*71%12|0),2,2,b)}else{R(c,X,Y+7,16,1,b);R(c,X+((y%2)?4:11),Y,1,7,b);R(c,X+((y%2)?12:2),Y+8,1,8,b)}break}
    case 'c':R(c,X,Y,16,16,'#6b6f78');if(h>.4)R(c,X+(h*12|0),Y+(h*37%12|0),3,2,'#5d616a');if(h>.8)R(c,X+3,Y+12,2,1,'#80848d');break;
    case 'E':R(c,X,Y,16,16,mapId==='cave'?'#6b6f78':'#c89b62');R(c,X+2,Y+3,12,10,'#8a3b3b');R(c,X+3,Y+4,10,8,'#a54a4a');break;
    case 'S':R(c,X,Y,16,16,'#3b3240');for(let i=0;i<4;i++)R(c,X+1,Y+2+i*4,14,2,i%2?'#6d5d4d':'#86735f');break;
    case 'U':R(c,X,Y,16,16,'#3b3240');for(let i=0;i<4;i++)R(c,X+1,Y+1+i*4,14-i*2,3,'#9a9aa2');break;
    case 'W':{const below=MAPS[mapId].g[y+1]&&MAPS[mapId].g[y+1][x];const face=below&&below!=='W';
      if(face){const wc=mapId==='cave'?'#555a64':mapId==='rdc'?site().wall:'#e8dcc0';R(c,X,Y,16,16,wc);R(c,X,Y+13,16,3,mapId==='cave'?'#3d414a':'#8c6d4a');if(mapId==='cave'){R(c,X+(h*10|0),Y+4,4,2,'#4a4f58')}}
      else R(c,X,Y,16,16,mapId==='cave'?'#2a2c33':'#3b3240');break}
  }
}
