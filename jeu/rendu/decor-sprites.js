/* Wattlings · jeu/rendu/decor-sprites.js
   Décor : tous les sprites d'extérieur et d'intérieur. */

/* ---- sprites de décor (extérieur et intérieur) ---- */
function drawDecor(c,o,X,Y,t){
  const h=thash(o.x,o.y);
  switch(o.kind){
    case 'gate':R(c,X+1,Y+4,2,11,'#59627c');R(c,X+13,Y+4,2,11,'#59627c');R(c,X,Y+6,16,4,'#f7f0dc');for(let k=0;k<4;k++)R(c,X+k*4+(o.x%2?0:2),Y+6,2,4,'#c43d3d');R(c,X+5,Y-4,6,6,'#c43d3d');R(c,X+6,Y-2,4,2,'#f7f0dc');R(c,X+7,Y+2,2,4,'#59627c');return true;
    case 'qsign':R(c,X+7,Y+6,2,10,'#6b4a2b');R(c,X+1,Y-6,14,13,'#1c2440');R(c,X+2,Y-5,12,11,o.col||'#5b6380');regEmblem(c,REG[o.n||0],X+3,Y-4,'#fff');return true;
    case 'brack':for(let k=0;k<3;k++){R(c,X+2+k*5,Y+9,1,6,'#8a8f9a');R(c,X+2+k*5,Y+9,3,1,'#8a8f9a');R(c,X+4+k*5,Y+9,1,6,'#8a8f9a')}if(h<.18)return true;drawBikeStatic(c,X+1,Y+2,['#c43d3d','#2f6db5','#2f9e7a','#f2a33a'][(o.x+o.y)%4]);if(h>.4)drawBikeStatic(c,X+3,Y+5,['#2c2c34','#8a3b8f','#00968a'][(o.x*3+o.y)%3]);return true;
    case 'bike':drawBikeStatic(c,X+2,Y+3,['#c43d3d','#2f6db5','#2f9e7a','#f2a33a','#8a3b8f'][(o.x+o.y*2)%5]);return true;
    case 'cargo':R(c,X-6,Y+5,10,7,'#a07845');R(c,X-5,Y+6,8,5,'#c9a26e');drawBikeStatic(c,X+2,Y+3,'#2f6d34');return true;
    case 'pump':R(c,X+6,Y+3,4,11,'#2f6db5');R(c,X+5,Y+2,6,2,'#1c4f8f');R(c,X+10,Y+6,3,1,'#222');R(c,X+12,Y+6,1,7,'#222');R(c,X+4,Y+14,8,2,'#59627c');R(c,X+7,Y+5,2,3,'#f7f0dc');return true;
    case 'bsign':R(c,X+7,Y+6,2,10,'#8a8f9a');R(c,X+3,Y-5,10,10,'#1a73c9');R(c,X+2,Y-3,12,6,'#1a73c9');{const w='#fff';R(c,X+4,Y,2,2,w);R(c,X+10,Y,2,2,w);R(c,X+5,Y-1,5,1,w);R(c,X+6,Y-2,1,1,w);R(c,X+9,Y-3,2,2,w)}return true;
    case 'bench':{R(c,X+1,Y+5,14,2,'#a07845');R(c,X+1,Y+8,14,3,'#8a5f36');R(c,X+2,Y+11,2,4,'#5d4024');R(c,X+12,Y+11,2,4,'#5d4024');const v=(o.x*5+o.y*3)%7;
      if(v<2){R(c,X+4,Y+7,5,3,'#f4f1e6');R(c,X+5,Y+8,3,1,'#9aa0a8');R(c,X+4,Y+7,5,1,'#fff')}else if(v===2){R(c,X+10,Y+6,2,3,'#f4f1e6');R(c,X+10,Y+6,2,1,'#8a5f36')}else if(v===3){R(c,X+1,Y+5,6,2,'#c9a26e');R(c,X+9,Y+9,5,1,'#a07845')}else if(v===4){R(c,X+6,Y+8,4,1,'#5d4024');R(c,X+7,Y+9,2,1,'#5d4024')}return true}
    case 'fountain':{R(c,X+2,Y+10,28,19,'#b8b09c');R(c,X+4,Y+9,24,2,'#d9d2c0');R(c,X+4,Y+12,24,14,'#4a9fd8');R(c,X+14,Y+4,4,16,'#d9d2c0');R(c,X+11,Y+8,10,2,'#b8b09c');
      const a=(t>>3)%3;R(c,X+15,Y-2+a,2,6,'#b8e4f7');R(c,X+11-a,Y+11,2,2,'#b8e4f7');R(c,X+19+a,Y+11,2,2,'#b8e4f7');R(c,X+7+a*2,Y+18,4,1,'#8fd0f0');R(c,X+20-a*2,Y+22,4,1,'#8fd0f0');return true}
    case 'duck':{const b=(t>>5)%2;R(c,X+4,Y+8+b,8,4,'#f7f0dc');R(c,X+10,Y+5+b,3,4,'#2f6d34');R(c,X+13,Y+7+b,2,1,'#f2a33a');R(c,X+3,Y+12+b,10,1,'#8fd0f0');return true}
    case 'boat':{const b=(t>>5)%2;R(c,X+1,Y+5+b,14,7,'#8a5f36');R(c,X+2,Y+6+b,12,4,'#c9a26e');R(c,X+5,Y+6+b,1,4,'#8a5f36');R(c,X+10,Y+6+b,1,4,'#8a5f36');R(c,X,Y+7+b,1,3,'#6b4a2b');return true}
    case 'flowerbed':R(c,X+1,Y+6,14,8,'#6b4a2b');R(c,X+2,Y+7,12,6,'#3f8a3a');[['#e2573b',3,8],['#f7e36b',7,7],['#fff',11,9],['#e57399',5,11],['#f7e36b',10,11]].forEach(([col,a,b])=>R(c,X+a,Y+b,2,2,col));return true;
    case 'anemo':{R(c,X+7,Y-8,2,23,'#8a8f9a');const a=((SKR.turb*7)|0)%3;R(c,X+2+a,Y-10,4,2,'#c43d3d');R(c,X+10-a,Y-10,4,2,'#c43d3d');R(c,X+6,Y-11,4,3,'#59627c');R(c,X+4,Y+14,8,2,'#59627c');return true}
    case 'sbox':R(c,X+3,Y+10,2,6,'#8a8f9a');R(c,X+11,Y+10,2,6,'#8a8f9a');R(c,X+2,Y,12,11,'#f7f0dc');for(let k=0;k<4;k++)R(c,X+3,Y+2+k*2,10,1,'#c6beaa');R(c,X+1,Y-1,14,2,'#d9d2c0');return true;
    case 'gauge':R(c,X+5,Y+4,6,11,'#b8e4f7');R(c,X+5,Y+9,6,6,'#4a9fd8');R(c,X+4,Y+3,8,2,'#8a8f9a');return true;
    case 'dboard':R(c,X+2,Y+8,2,8,'#59627c');R(c,X+12,Y+8,2,8,'#59627c');R(c,X,Y-6,16,15,'#1c2440');for(let k=0;k<4;k++){R(c,X+2,Y-4+k*3,4,1,'#f2a33a');R(c,X+8,Y-4+k*3,6,1,'#59627c')}return true;
    case 'train':drawTrain(c,X,Y,t);return true;
    case 'cone':R(c,X+3,Y+13,10,2,'#e2573b');R(c,X+5,Y+4,6,9,'#e2573b');R(c,X+6,Y+2,4,3,'#e2573b');R(c,X+5,Y+8,6,2,'#f7f0dc');return true;
    case 'transfo':R(c,X+2,Y+3,12,12,'#6d7480');R(c,X+3,Y+4,10,5,'#8a8f9a');R(c,X+5,Y+11,6,3,'#f2c12e');R(c,X+7,Y+12,2,1,'#1c2440');R(c,X+4,Y,2,4,'#59627c');R(c,X+10,Y,2,4,'#59627c');return true;
    case 'lamp':{const lean=lampLean(o),v=(o.x+o.y*2)%5;R(c,X+7,Y+1,2,14,'#3a4050');R(c,X+7+lean,Y-12,2,13,'#3a4050');R(c,X+5,Y+14,6,2,'#3a4050');R(c,X+4+lean*2,Y-15,8,4,'#3a4050');R(c,X+5+lean*2,Y-12,6,2,SKY.lamps?'#fff3a8':'#f7f0dc');
      if(v===0){R(c,X+7,Y+4,2,3,'#f2c12e');R(c,X+7,Y+5,2,1,'#1c2440')}else if(v===1){R(c,X+6,Y+2,4,5,'#f4f1e6');R(c,X+7,Y+3,2,2,'#e2573b')}return true}
    case 'picnic':R(c,X+1,Y+4,14,4,'#a07845');R(c,X+1,Y+4,14,1,'#c9a26e');R(c,X,Y+10,16,2,'#8a5f36');R(c,X+3,Y+8,2,7,'#5d4024');R(c,X+11,Y+8,2,7,'#5d4024');return true;
    case 'slide':R(c,X+2,Y-4,2,19,'#59627c');R(c,X+6,Y-4,2,19,'#59627c');for(let k=0;k<4;k++)R(c,X+2,Y+k*4,6,1,'#59627c');for(let k=0;k<8;k++)R(c,X+7+k,Y-3+k*2,4,3,'#e2573b');R(c,X+1,Y-6,8,3,'#f2c12e');return true;
    case 'swing':R(c,X,Y-6,2,21,'#2f6db5');R(c,X+14,Y-6,2,21,'#2f6db5');R(c,X,Y-7,16,2,'#2f6db5');{const a=((t>>4)%3)-1;R(c,X+5+a,Y-5,1,13,'#8a8f9a');R(c,X+10+a,Y-5,1,13,'#8a8f9a');R(c,X+4+a,Y+8,8,2,'#c43d3d')}return true;
    case 'statue':R(c,X+2,Y+9,12,6,'#b8b09c');R(c,X+1,Y+8,14,2,'#d9d2c0');R(c,X+3,Y+2,3,6,'#c9a227');R(c,X+7,Y-3,3,11,'#c9a227');R(c,X+11,Y-8,3,16,'#e3c44a');R(c,X+11,Y-11,3,2,'#f7e36b');return true;
    case 'scaffold':for(let k=0;k<3;k++){R(c,X+k*7,Y-10,1,25,'#8a8f9a')}R(c,X,Y-10,15,1,'#8a8f9a');R(c,X,Y,15,2,'#c9a26e');R(c,X,Y-9,15,1,'#f2a33a');for(let k=0;k<6;k++)R(c,X+1+k*2,Y-8+k,1,1,'#8a8f9a');return true;
    case 'pallet':R(c,X+1,Y+10,14,5,'#a07845');R(c,X+1,Y+12,14,1,'#6b4a2b');R(c,X+2,Y+3,12,7,'#d98a6a');R(c,X+2,Y+6,12,1,'#b86a4c');R(c,X+7,Y+3,1,7,'#b86a4c');return true;
    case 'garden':R(c,X,Y+2,16,13,'#6b4a2b');for(let k=0;k<3;k++){R(c,X+1,Y+4+k*4,14,2,'#5a3a22');for(let b=0;b<4;b++)R(c,X+2+b*4,Y+3+k*4,2,2,k===1?'#e2573b':'#5fa854')}return true;
    case 'recycle':R(c,X+1,Y+5,6,10,'#2f9e7a');R(c,X+1,Y+4,6,2,'#1c6f55');R(c,X+9,Y+5,6,10,'#f2c12e');R(c,X+9,Y+4,6,2,'#c9a227');R(c,X+3,Y+8,2,2,'#f7f0dc');R(c,X+11,Y+8,2,2,'#f7f0dc');if(h<.4){R(c,X+10,Y+1,4,3,'#f4f1e6');R(c,X+11,Y+2,2,1,'#9aa0a8');R(c,X+9,Y+3,6,1,'#c9a227')}if(h>.7){R(c,X+7,Y+13,2,2,'#c9a26e')}return true;
    case 'repair':R(c,X+3,Y-2,2,17,'#e2573b');R(c,X+3,Y-2,9,2,'#e2573b');R(c,X+11,Y-2,2,5,'#e2573b');R(c,X+2,Y+14,5,2,'#59627c');R(c,X+7,Y+5,1,5,'#8a8f9a');R(c,X+9,Y+5,1,6,'#8a8f9a');R(c,X+6,Y+3,6,2,'#59627c');return true;
    case 'laundry':{const sw=Math.round(Math.sin(t/(14-SKY.wind*8)+o.x)*(1.3+SKY.wind*1.6)),out=!skWet()&&SKY.dark<.35;[1,29].forEach(px=>{R(c,X+px,Y-7,2,22,'#8a6538');R(c,X+px,Y-7,2,1,'#c9a26e');R(c,X+px-1,Y+14,4,1,'#5d4024')});R(c,X+2,Y-5,28,1,'#e4e0d2');
      if(out)[[5,'#f7f0dc',6,9],[12,'#e2573b',5,10],[18,'#4a78c9',4,8],[23,'#f2c12e',5,7]].forEach(([a,col,w,hh],i)=>{const s2=i%2?sw:-sw;R(c,X+a,Y-4,w,3,col);R(c,X+a+(s2>0?1:0),Y-1,w,hh-5,col);R(c,X+a+s2,Y+hh-6,w,2,tint(col,-.14));R(c,X+a,Y-5,1,2,'#8a6538');R(c,X+a+w-1,Y-5,1,2,'#8a6538')});return true}
    case 'chalk':{if(SKY.wet>.35||SKY.snowG)return true;/* la pluie a tout effacé */const w='rgba(255,255,255,.8)';for(let k=0;k<4;k++){R(c,X+1+k*7,Y+4,7,1,w);R(c,X+1+k*7,Y+11,8,1,w);R(c,X+1+k*7,Y+4,1,8,w);px35(c,String(k+1),X+3+k*7,Y+6,w)}R(c,X+29,Y+4,1,8,w);
      R(c,X+33,Y+5,7,1,'rgba(247,216,74,.9)');R(c,X+33,Y+10,7,1,'rgba(247,216,74,.9)');R(c,X+33,Y+5,1,6,'rgba(247,216,74,.9)');R(c,X+39,Y+5,1,6,'rgba(247,216,74,.9)');R(c,X+35,Y+7,1,2,'rgba(247,216,74,.9)');R(c,X+37,Y+7,1,2,'rgba(247,216,74,.9)');
      R(c,X+44,Y+3,2,2,'rgba(233,103,154,.9)');R(c,X+47,Y+3,2,2,'rgba(233,103,154,.9)');R(c,X+44,Y+5,5,2,'rgba(233,103,154,.9)');R(c,X+45,Y+7,3,1,'rgba(233,103,154,.9)');R(c,X+46,Y+8,1,1,'rgba(233,103,154,.9)');return true}
    case 'bikedown':{const k='#2c2c34',col=['#c43d3d','#2f6db5','#f2a33a','#2f9e7a'][(o.x+o.y)%4];R(c,X+1,Y+13,13,1,'rgba(20,40,30,.2)');
      [[1,8],[9,6]].forEach(([a,b])=>{R(c,X+a+1,Y+b,4,1,k);R(c,X+a+1,Y+b+3,4,1,k);R(c,X+a,Y+b+1,1,2,k);R(c,X+a+5,Y+b+1,1,2,k)});R(c,X+4,Y+8,6,1,col);R(c,X+6,Y+6,1,3,col);R(c,X+9,Y+5,3,1,col);R(c,X+5,Y+5,2,1,k);R(c,X+12,Y+4,1,3,'#8a8f9a');return true}
    case 'ball':R(c,X+5,Y+13,6,1,'rgba(20,40,30,.22)');c.fillStyle='#f4f1e6';c.beginPath();c.arc(X+8,Y+10,3.2,0,7);c.fill();R(c,X+6,Y+9,2,2,'#e2573b');R(c,X+9,Y+10,2,2,'#2f6db5');R(c,X+7,Y+8,1,1,'#fff');return true;
    case 'gnome':R(c,X+5,Y+14,6,1,'rgba(20,40,30,.22)');R(c,X+6,Y+9,4,5,'#2f6db5');R(c,X+6,Y+13,4,1,'#5d4024');R(c,X+6,Y+6,4,3,'#f1c7a1');R(c,X+6,Y+8,4,2,'#f4f1e6');R(c,X+7,Y+10,2,1,'#f4f1e6');R(c,X+6,Y+4,4,2,'#c43d3d');R(c,X+7,Y+2,2,2,'#c43d3d');R(c,X+8,Y+1,1,1,'#c43d3d');R(c,X+7,Y+7,1,1,'#222');R(c,X+9,Y+7,1,1,'#222');return true;
    case 'leafpile':[[3,10,10,3],[5,8,6,2],[4,13,8,1]].forEach(([a,b,w,hh])=>R(c,X+a,Y+b,w,hh,'#b8642a'));for(let i=0;i<9;i++)R(c,X+3+((thash(o.x+i,o.y)*10)|0),Y+8+((thash(o.x,o.y+i)*5)|0),2,1,LEAFC[i%5]);R(c,X+13,Y+3,1,11,'#8a6538');R(c,X+11,Y+13,5,1,'#8a8f9a');R(c,X+11,Y+14,1,1,'#8a8f9a');R(c,X+13,Y+14,1,1,'#8a8f9a');R(c,X+15,Y+14,1,1,'#8a8f9a');return true;
    /* intérieurs */
    case 'rug':R(c,X+1,Y+2,(o.w||2)*16-2,12,o.col||'#a54a4a');R(c,X+3,Y+4,(o.w||2)*16-6,8,o.col2||'#c0503a');R(c,X+1,Y+2,2,12,'#e8dcc0');R(c,X+(o.w||2)*16-3,Y+2,2,12,'#e8dcc0');return true;
    case 'table':R(c,X,Y+3,16,9,'#a07845');R(c,X,Y+3,16,2,'#c9a26e');R(c,X+1,Y+12,2,4,'#6b4a2b');R(c,X+13,Y+12,2,4,'#6b4a2b');if(h>.5){R(c,X+5,Y+5,5,3,'#f7f0dc')}else R(c,X+9,Y+5,3,3,'#e2573b');return true;
    case 'chair':R(c,X+4,Y+3,8,5,'#8a5f36');R(c,X+4,Y+8,8,3,'#a07845');R(c,X+4,Y+11,2,4,'#5d4024');R(c,X+10,Y+11,2,4,'#5d4024');return true;
    case 'fridge':R(c,X+2,Y-6,12,21,'#e8eef5');R(c,X+2,Y+2,12,1,'#9aa0a8');R(c,X+11,Y-3,1,4,'#9aa0a8');R(c,X+11,Y+5,1,5,'#9aa0a8');R(c,X+2,Y+14,12,2,'#9aa0a8');return true;
    case 'kitchen':R(c,X,Y+2,16,13,'#d9cfb8');R(c,X,Y+2,16,3,'#8a8f9a');R(c,X+2,Y+3,5,1,'#59627c');R(c,X+10,Y+3,3,1,'#2c2c34');R(c,X+3,Y+8,4,5,'#b8b09c');R(c,X+9,Y+8,4,5,'#b8b09c');R(c,X+5,Y+10,1,1,'#555');R(c,X+11,Y+10,1,1,'#555');return true;
    case 'lampf':R(c,X+7,Y-2,2,15,'#59627c');R(c,X+4,Y-8,8,7,'#f7e36b');R(c,X+5,Y-9,6,1,'#f7e36b');R(c,X+5,Y+13,6,2,'#59627c');return true;
    case 'filing':R(c,X+2,Y-4,12,19,'#8a93a3');for(let k=0;k<3;k++){R(c,X+3,Y-3+k*6,10,5,'#a7b0bf');R(c,X+7,Y-1+k*6,2,1,'#59627c')}return true;
    case 'printer':R(c,X+1,Y+6,14,9,'#8a5f36');R(c,X+2,Y,12,8,'#d9dde3');R(c,X+3,Y-2,10,3,'#f7f0dc');R(c,X+3,Y+4,10,1,'#59627c');R(c,X+11,Y+2,2,1,'#2fbf5e');return true;
    case 'cooler':R(c,X+4,Y+4,8,11,'#e8eef5');R(c,X+5,Y-5,6,10,'#8ec9e8');R(c,X+6,Y-6,4,2,'#4a9fd8');R(c,X+6,Y+7,2,1,'#c43d3d');R(c,X+9,Y+7,1,1,'#2f6db5');return true;
    case 'wboard':R(c,X,Y+3,(o.w||2)*16,11,'#8a8f9a');R(c,X+1,Y+4,(o.w||2)*16-2,9,'#f7f9fb');R(c,X+4,Y+6,10,1,'#c43d3d');R(c,X+4,Y+9,16,1,'#2f6db5');R(c,X+18,Y+6,6,4,'#2f9e7a');return true;
    case 'clockw':R(c,X+3,Y+3,10,10,'#1c2440');R(c,X+4,Y+4,8,8,'#f7f0dc');R(c,X+8,Y+5,1,4,'#1c2440');R(c,X+8,Y+8,3,1,'#c43d3d');return true;
    case 'frame':R(c,X+2,Y+3,12,11,o.col||'#6b4a2b');R(c,X+3,Y+4,10,9,'#f7f0dc');R(c,X+3,Y+9,10,4,o.c2||'#7cc56a');R(c,X+9,Y+5,3,3,o.c3||'#f2c12e');return true;
    case 'coat':R(c,X+7,Y-6,2,21,'#6b4a2b');R(c,X+4,Y-6,8,1,'#6b4a2b');R(c,X+3,Y-5,4,8,'#2f6db5');R(c,X+10,Y-5,3,3,'#f2c12e');R(c,X+5,Y+14,6,2,'#6b4a2b');return true;
    case 'pshelf':R(c,X+1,Y-6,14,22,'#f1f5ee');for(let a=0;a<4;a++){R(c,X+2,Y-5+a*5,12,4,'#dfe8dc');for(let b=0;b<4;b++)R(c,X+3+b*3,Y-4+a*5,2,3,['#2fbf5e','#f7f0dc','#4a78c9','#e2573b'][(a*2+b+o.x)%4])}return true;
    case 'cross':R(c,X+2,Y+2,12,12,'#f7f0dc');R(c,X+6,Y+3,4,10,'#2fbf5e');R(c,X+3,Y+6,10,4,'#2fbf5e');return true;
    case 'pipes':R(c,X,Y+4,16,3,'#e8d24a');R(c,X,Y+10,16,3,'#d4502f');R(c,X+5,Y+3,3,5,'#8a8f9a');R(c,X+11,Y+9,3,5,'#8a8f9a');return true;
    case 'bottle':R(c,X+4,Y+3,8,12,'#1a73c9');R(c,X+5,Y+1,6,3,'#1a73c9');R(c,X+7,Y-1,2,3,'#8a8f9a');R(c,X+4,Y+7,8,2,'#f7f0dc');return true;
    case 'banner':R(c,X,Y+2,(o.w||2)*16,12,o.col||'#2f6db5');R(c,X+3,Y+5,(o.w||2)*16-12,2,'#fff');R(c,X+3,Y+9,(o.w||2)*8,1,'rgba(255,255,255,.7)');return true;
    case 'bikewall':R(c,X+2,Y+3,1,3,'#8a8f9a');R(c,X+12,Y+3,1,3,'#8a8f9a');drawBikeStatic(c,X+1,Y+3,o.col||'#c43d3d');return true;
    case 'cart':R(c,X+2,Y+3,12,10,'#8a5f36');for(let b=0;b<4;b++)R(c,X+3+b*3,Y+4,2,5,['#c0503a','#2aa198','#f2a33a','#4a78c9'][b]);R(c,X+3,Y+13,3,3,'#222');R(c,X+10,Y+13,3,3,'#222');return true;
    case 'globe':R(c,X+7,Y+9,2,5,'#6b4a2b');R(c,X+4,Y+14,8,2,'#6b4a2b');R(c,X+3,Y,10,10,'#4a9fd8');R(c,X+5,Y+2,4,3,'#5fa854');R(c,X+8,Y+6,3,2,'#5fa854');return true;
    case 'screenw':R(c,X+1,Y+3,14,10,'#1c2440');R(c,X+2,Y+4,12,8,(t>>5)%2?'#16335a':'#1b3d6a');for(let k=0;k<4;k++)R(c,X+3+k*3,Y+10-((k*5+o.x)%5),2,1+((k*5+o.x)%5),'#f2a33a');return true;
    case 'flagfr':R(c,X+3,Y,1,15,'#8a8f9a');R(c,X+4,Y+1,3,7,'#2f5fb3');R(c,X+7,Y+1,3,7,'#f7f0dc');R(c,X+10,Y+1,3,7,'#c43d3d');return true;
    case 'vending':R(c,X+1,Y-6,14,21,'#c43d3d');R(c,X+2,Y-5,9,13,'#1c2440');for(let a=0;a<3;a++)for(let b=0;b<3;b++)R(c,X+3+b*3,Y-4+a*4,2,3,['#f2c12e','#2fbf5e','#8ec9e8'][(a+b)%3]);R(c,X+12,Y-3,2,5,'#f7f0dc');R(c,X+3,Y+10,7,3,'#2c2c34');return true;
    case 'ext':R(c,X+6,Y+4,4,9,'#c43d3d');R(c,X+7,Y+2,2,3,'#2c2c34');R(c,X+9,Y+3,2,1,'#2c2c34');return true;
    case 'wardrobe':R(c,X+1,Y-8,14,23,'#8a5f36');R(c,X+2,Y-7,6,21,'#a07845');R(c,X+8,Y-7,6,21,'#a07845');R(c,X+7,Y+2,1,3,'#5d4024');R(c,X+9,Y+2,1,3,'#5d4024');return true;
    default:return drawRegDecor(c,o,X,Y,t);
    case 'stool':R(c,X+5,Y+6,6,3,'#c0503a');R(c,X+6,Y+9,1,5,'#59627c');R(c,X+9,Y+9,1,5,'#59627c');return true;
  }
  return false;
}
