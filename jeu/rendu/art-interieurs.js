/* Wattlings · jeu/rendu/art-interieurs.js
   Rendu détaillé : intérieurs (parquet, murs). */

/* ---- intérieurs : parquet veiné, murs avec moulure et plinthe ---- */
function artFloor(c,X,Y,x,y,mapId){
  let a='#c89b62',b='#b3874f';if(mapId==='rdc'){[a,b]=site().floor}const h=thash(x,y);
  if(mapId==='rdc'&&S.site==='boulangerie'){const d=(x+y)%2?b:a;R(c,X,Y,16,16,d);R(c,X,Y,16,1,tint(d,.18));R(c,X,Y,1,16,tint(d,.18));R(c,X,Y+15,16,1,tint(d,-.1));R(c,X+15,Y,1,16,tint(d,-.1));return}
  if(mapId==='rdc'&&S.site==='bureau'){R(c,X,Y,16,16,a);for(let i=0;i<5;i++)R(c,X+((thash(x*3+i,y)*15)|0),Y+((thash(x,y*3+i)*15)|0),1,1,i<3?b:tint(a,.15));R(c,X,Y,16,1,tint(a,-.05));R(c,X,Y,1,16,tint(a,-.05));return}
  // lames de parquet : une teinte par lame, un joint, quelques veines
  for(let j=0;j<2;j++){const off=((y*2+j)%2)?4:11,yy=Y+j*8;[[0,off],[off,16]].forEach(([x0,x1],i)=>{const k=thash(x*2+i+(x0?1:0),y*2+j),col=tint(a,k<.3?-.05:k>.7?.05:0);R(c,X+x0,yy,x1-x0,7,col);R(c,X+x0,yy,x1-x0,1,tint(col,.1));
      R(c,X+x0+1+((k*5)|0),yy+3,Math.min(5,x1-x0-2),1,tint(col,-.07));if(k>.5)R(c,X+x0+2,yy+5,3,1,tint(col,-.05))});
    R(c,X,yy+7,16,1,b);R(c,X+off,yy,1,7,b)}
}
function artWallTile(c,X,Y,x,y,mapId){
  const G=MAPS[mapId].g,below=G[y+1]&&G[y+1][x],face=below&&below!=='W',cave=mapId==='cave';
  if(!face){const d=cave?'#2a2c33':'#3b3240';R(c,X,Y,16,16,d);const b2=G[y+1]&&G[y+1][x];if(b2==='W'&&G[y+2]&&G[y+2][x]&&G[y+2][x]!=='W')R(c,X,Y+15,16,1,tint(d,.2));return}
  const wc=cave?'#555a64':mapId==='rdc'?site().wall:'#e8dcc0',h=thash(x,y);
  R(c,X,Y,16,16,wc);R(c,X,Y,16,2,tint(wc,-.22));R(c,X,Y+2,16,1,tint(wc,-.1));
  if(cave){for(let j=0;j<3;j++){R(c,X,Y+4+j*4,16,1,'#454a54');R(c,X+((j%2)?4:11),Y+1+j*4,1,3,'#454a54')}R(c,X+((h*10)|0),Y+5,3,1,'#6b707b');R(c,X,Y+13,16,3,'#3d414a');return}
  for(let k=3;k<16;k+=4)R(c,X+k,Y+3,1,8,tint(wc,-.035));
  R(c,X,Y+11,16,1,tint(wc,.25));R(c,X,Y+12,16,4,'#9b7a53');R(c,X,Y+12,16,1,'#b8956a');R(c,X,Y+15,16,1,'#6f5536');for(let k=1;k<16;k+=5)R(c,X+k,Y+13,1,2,'#86663f');
}
function drawTileA(c,ch,x,y,mapId){
  const X=x*TS,Y=y*TS,town=mapId==='town',G=MAPS[mapId].g,at=(dx,dy)=>G[y+dy]&&G[y+dy][x+dx];
  if(town)zoneGrass(x,y);
  switch(ch){
    case '.':if(town&&SEA.se===0&&!SEA.snow&&x<WIND0&&thash(x*3+5,y*7+1)<.06){artFlowers(c,X,Y,x,y,true);return}   // au printemps, des fleurs un peu partout
    case 'B':case 'D':case 'w':case 'T':case 'u':case 'k':case 'h':case 'f':case 'P':case 'm':if(town){artGrass(c,X,Y,x,y,true);return}break;
    case '*':if(town){const cr=x<WIND0?regCrop(x,y):0;if(cr===1)artLavender(c,X,Y,x,y);else if(cr===2)artVine(c,X,Y,x,y,at);else if(SEA.snow||SEA.se===3||(SEA.se===2&&thash(x*5+1,y*3+7)<.6))artGrass(c,X,Y,x,y,true);else artFlowers(c,X,Y,x,y,true);return}break;
    case '=':if(town){artPath(c,X,Y,x,y,at);return}break;
    case 'b':artRoad(c,X,Y,x,y,at);return;
    case 'R':case '~':artWater(c,X,Y,x,y,at,ch==='~');return;
    case ',':artPlaza(c,X,Y,x,y,at);return;
    case 'g':if(town){artBridge(c,X,Y,x,y,at);return}break;
    case 'd':artDirt(c,X,Y,x,y,at);return;
    case ':':artTall(c,X,Y,x,y);return;
    case 'o':artFloor(c,X,Y,x,y,mapId);return;
    case 'W':artWallTile(c,X,Y,x,y,mapId);return;
  }
  drawTile0(c,ch,x,y,mapId);
}
