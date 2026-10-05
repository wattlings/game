/* Wattlings · jeu/rendu/regions-decor.js
   Dessin du décor et des monuments des régions. */

/* ================= DÉCOR, MONUMENTS ET HABITANTS DES RÉGIONS =================
   Chaque quartier a son monument, ses objets du pays, ses bêtes et un ou deux habitants en tenue :
   Auvergne : un puy, un buron, des vaches Salers, la fromagère · Nord : beffroi (il sonne les heures), moulin, terril, baraque à frites ·
   Normandie : chaumière, pressoir à cidre, vaches normandes · Alsace : cigogne sur la médiathèque, puits fleuri, bretzels ·
   Bourgogne : coteaux de vigne, cabotte, tonneaux, escargots après la pluie · Bretagne : phare (allumé la nuit), menhirs, calvaire, goélands, crêpes ·
   Provence : champs de lavande, pétanque, fontaine, ruches · Savoie : bergerie, moutons, patou, marmottes, bassin. */
const COWS=[{b:'#8a3b22',p:null,h:'#7a3018',horn:1},{b:'#f4f1e8',p:'#7a4a2a',h:'#7a4a2a'},{b:'#f1ead8',p:null,h:'#e6dcc6'},{b:'#9a4a2a',p:'#f4f1e8',h:'#f4f1e8',bell:1}];
function drawRegDecor(c,o,X,Y,t){
  const h=wh(o.x,o.y,500);
  switch(o.kind){
    case 'puy':{const cx=X+24;R(c,X+1,Y+14,46,2,'rgba(20,40,30,.25)');
      const G=SEA.snow?['#e6edf3','#f8fbfd','#c9d6e2']:SEA.se===2?['#8f9a4a','#a8b060','#6b7a38']:SEA.se===3?['#6f8a5c','#86a070','#56704a']:['#5f9a52','#74b060','#477a40'];
      for(let j=0;j<35;j++){const y=Y-20+j,hw=Math.round(7+j*.48+(j>22?(j-22)*.42:0)),top=j<4;R(c,cx-hw,y,hw*2,1,top?'#8a5a42':j<7?hexMix(G[0],'#8a5a42',.3):G[0]);R(c,cx-hw,y,Math.max(2,(hw*.45)|0),1,top?'#a8765a':G[1]);R(c,cx+hw-Math.max(2,(hw*.3)|0),y,Math.max(2,(hw*.3)|0),1,top?'#6b4030':G[2])}
      c.fillStyle='#3a2a22';c.beginPath();c.ellipse(cx,Y-19,6,2,0,0,7);c.fill();R(c,cx-5,Y-19,4,1,'#5a4034');
      [[-9,-6],[6,0],[-14,7],[11,9],[-2,5]].forEach(([a,b],i)=>{R(c,cx+a,Y+b,3,2,'#8e8a80');R(c,cx+a,Y+b,2,1,'#b4b0a4')});[[-12,2],[8,5],[0,10],[-18,11],[15,12]].forEach(([a,b])=>{R(c,cx+a,Y+b,1,2,'#3f8a45');R(c,cx+a+1,Y+b+1,1,1,'#3f8a45')});
      for(let k=0;k<9;k++)R(c,cx-3+k*2-(k>4?(k-4)*3:0),Y-12+k*3,2,1,'#c9b98a');return true}   // sentier qui monte au cratère
    case 'buron':{R(c,X,Y+15,32,1,'rgba(20,40,30,.28)');R(c,X+1,Y+3,30,12,'#5a5a64');for(let r=0;r<3;r++){R(c,X+1,Y+6+r*4,30,1,'#7e7e88');for(let a=X+3+(r%2)*4;a<X+30;a+=8)R(c,a,Y+3+r*4,1,3,'#7e7e88')}R(c,X+1,Y+3,1,12,'#33333a');R(c,X+30,Y+3,1,12,'#33333a');
      for(let j=0;j<13;j++){const a=Math.max(0,6-j);R(c,X-1+a,Y-9+j,34-2*a,1,j%4===0?'#55524c':j<2?'#95928a':'#7d7a72');if(j%4===1)for(let k=a+2;k<33-a;k+=6)R(c,X-1+k,Y-9+j,1,3,'#55524c')}R(c,X-1,Y+3,34,1,'#33333a');
      R(c,X+13,Y+7,6,8,'#3f2a14');R(c,X+13,Y+7,6,1,'#7e7e88');R(c,X+14,Y+8,1,7,'#6b4a2b');R(c,X+23,Y+7,4,3,'#1c1c24');R(c,X+5,Y+7,4,3,'#1c1c24');R(c,X+25,Y-12,3,5,'#55524c');return true}
    case 'cow':{const V=COWS[o.v||0],f=o.x%2?1:-1,hx=f>0?X+12:X;R(c,X+2,Y+14,12,1,'rgba(20,40,30,.24)');
      R(c,X+3,Y+11,2,4,V.b);R(c,X+11,Y+11,2,4,V.b);R(c,X+5,Y+12,1,3,tint(V.b,-.25));R(c,X+9,Y+12,1,3,tint(V.b,-.25));R(c,X+2,Y+5,12,7,V.b);R(c,X+2,Y+5,12,1,tint(V.b,.2));R(c,X+2,Y+11,12,1,tint(V.b,-.2));
      if(V.p){if(o.v===1){R(c,X+4,Y+6,4,3,V.p);R(c,X+9,Y+8,3,3,V.p);R(c,X+6,Y+9,2,2,V.p)}else R(c,X+3,Y+10,10,2,V.p)}
      R(c,hx,Y+3,4,6,V.h);R(c,hx+(f>0?3:0),Y+7,1,2,'#f1b8b0');R(c,hx+(f>0?2:1),Y+5,1,1,'#222');R(c,hx+(f>0?0:3),Y+2,1,2,V.horn?'#f4f1e8':tint(V.h,-.2));if(V.horn)R(c,hx+(f>0?-1:4),Y+1,1,2,'#f4f1e8');
      R(c,f>0?X+1:X+14,Y+5,1,6,tint(V.b,-.2));R(c,f>0?X+1:X+14,Y+11,1,2,'#3a3530');R(c,X+7,Y+12,2,1,'#f1b8b0');if(V.bell){R(c,hx+1,Y+9,2,2,'#f2c12e');R(c,hx+1,Y+11,2,1,'#8a6a1a')}return true}
    case 'etal':{const A={fromage:['#f2c12e','#8a3b22'],bretzel:['#c43d3d','#f7f0dc'],frites:['#f2c12e','#c43d3d'],crepes:['#2f5f9a','#f7f0dc'],pommes:['#2f9e7a','#f7f0dc']}[o.v]||['#c43d3d','#f7f0dc'];
      R(c,X-1,Y+15,18,1,'rgba(20,40,30,.26)');R(c,X,Y-5,1,20,'#6b4a2b');R(c,X+15,Y-5,1,20,'#6b4a2b');R(c,X,Y+6,16,9,'#a07845');R(c,X,Y+6,16,1,'#c9a06a');R(c,X,Y+14,16,1,'#6b4a2b');for(let k=2;k<16;k+=5)R(c,X+k,Y+8,1,6,'#86602f');
      R(c,X-2,Y-7,20,5,A[0]);for(let k=0;k<5;k++)R(c,X-2+k*4,Y-7,2,5,A[1]);for(let k=0;k<5;k++)R(c,X-2+k*4+1,Y-2,2,1,k%2?A[0]:A[1]);R(c,X-2,Y-7,20,1,tint(A[0],.25));
      if(o.v==='fromage'){R(c,X+2,Y+3,5,3,'#f0d27a');R(c,X+2,Y+3,5,1,'#f8e6a8');R(c,X+9,Y+2,5,4,'#e8b85a');R(c,X+9,Y+2,5,1,'#c9a26e');R(c,X+11,Y+3,2,3,'#f8e6a8')}
      else if(o.v==='bretzel'){[2,9].forEach(a=>{R(c,X+a,Y+2,5,1,'#b8742a');R(c,X+a,Y+2,1,4,'#b8742a');R(c,X+a+4,Y+2,1,4,'#b8742a');R(c,X+a,Y+5,5,1,'#b8742a');R(c,X+a+2,Y+3,1,2,'#8a5220');R(c,X+a+1,Y+2,1,1,'#fff')})}
      else if(o.v==='frites'){R(c,X+3,Y+1,5,5,'#c43d3d');for(let k=0;k<4;k++)R(c,X+3+k,Y-1+(k%2),1,3,'#f2c12e');R(c,X+10,Y+2,4,4,'#8e949d');R(c,X+10,Y+2,4,1,'#c3c8d1');R(c,X+11,Y,1,2,'rgba(255,255,255,.6)')}
      else if(o.v==='crepes'){c.fillStyle='#3a3a44';c.beginPath();c.ellipse(X+5,Y+4,4,2,0,0,7);c.fill();c.fillStyle='#e8c07a';c.beginPath();c.ellipse(X+5,Y+3.5,3,1.4,0,0,7);c.fill();R(c,X+10,Y+2,4,4,'#f0d9a0');R(c,X+10,Y+3,4,1,'#c9a26e');R(c,X+10,Y+5,4,1,'#c9a26e')}
      else{R(c,X+2,Y+2,12,4,'#8a5f36');[[3,1],[6,2],[9,1],[12,2],[5,0],[10,0]].forEach(([a,b],i)=>{R(c,X+a,Y+b,2,2,i%3?'#e2483b':'#9ac23a');R(c,X+a,Y+b,1,1,'#f39a8c')})}
      return true}
    case 'beffroi':{const B='#a4472f',M='#c9917a',K='#e6ddd0',D0='#5f2a1c';R(c,X-1,Y+15,18,1,'rgba(20,40,30,.3)');
      R(c,X+2,Y-17,12,31,B);for(let y=Y-16,r=0;y<Y+13;y+=3,r++){R(c,X+2,y+2,12,1,M);for(let a=X+3+(r%2)*3;a<X+14;a+=6)R(c,a,y,1,2,M)}R(c,X+2,Y-17,1,31,D0);R(c,X+13,Y-17,1,31,D0);R(c,X+12,Y-17,1,31,'#8a3a26');
      R(c,X+1,Y+12,14,3,K);R(c,X+1,Y+14,14,1,'#9a9080');R(c,X+6,Y+5,4,8,'#3f2a14');R(c,X+6,Y+5,4,1,K);[[-10],[-2]].forEach(([b])=>{R(c,X+7,Y+b,2,5,'#33475e');R(c,X+7,Y+b,2,1,K)});
      R(c,X+1,Y-28,14,11,B);R(c,X+1,Y-28,14,1,K);R(c,X+1,Y-18,14,1,K);R(c,X+1,Y-28,1,11,D0);R(c,X+14,Y-28,1,11,D0);c.fillStyle='#f7f0dc';c.beginPath();c.arc(X+8,Y-22.5,3.6,0,7);c.fill();R(c,X+8,Y-25,1,3,'#1c2440');R(c,X+8,Y-23,2,1,'#1c2440');
      R(c,X+2,Y-37,12,9,K);R(c,X+2,Y-37,1,9,'#9a9080');R(c,X+13,Y-37,1,9,'#9a9080');[4,9].forEach(a=>{R(c,X+a,Y-35,3,7,'#33333a');R(c,X+a,Y-36,3,1,'#55555e');for(let k=0;k<3;k++)R(c,X+a,Y-34+k*2,3,1,'#6d7480')});R(c,X+1,Y-38,14,1,'#b9ad9c');
      for(let j=0;j<6;j++)R(c,X+2+j,Y-39-j,12-2*j,1,j%2?'#3f4a5c':'#566278');R(c,X+7,Y-44,2,1,'#f2c12e');R(c,X+7,Y-43,2,1,'#f2c12e');return true}
    case 'moulin':{R(c,X-1,Y+15,18,1,'rgba(20,40,30,.28)');R(c,X+7,Y+6,2,9,'#6b4a2b');for(let k=0;k<5;k++){R(c,X+2+k,Y+14-k*2,1,2,'#8a6538');R(c,X+13-k,Y+14-k*2,1,2,'#6b4a2b')}R(c,X+1,Y+14,14,1,'#553920');
      R(c,X+2,Y-18,12,24,'#8a6538');for(let a=X+4;a<X+14;a+=3)R(c,a,Y-18,1,24,'#6b4a2b');R(c,X+2,Y-18,1,24,'#b98d57');R(c,X+13,Y-18,1,24,'#553920');R(c,X+2,Y+5,12,1,'#553920');
      for(let j=0;j<7;j++)R(c,X+1+j,Y-19-j,14-2*j,1,j%2?'#5f584c':'#7d766a');R(c,X+6,Y-6,4,5,'#33475e');R(c,X+6,Y-6,4,1,'#e8c796');R(c,X+6,Y,4,6,'#3f2a14');R(c,X+7,Y-15,2,2,'#3f2a14');return true}
    case 'terril':{const cx=X+24;R(c,X+1,Y+14,46,2,'rgba(20,40,30,.28)');
      for(let j=0;j<33;j++){const y=Y-18+j,hw=Math.round(1+j*.7);R(c,cx-hw,y,hw*2,1,'#34343c');R(c,cx-hw,y,Math.max(1,(hw*.4)|0),1,'#4a4a54');R(c,cx+hw-Math.max(1,(hw*.3)|0),y,Math.max(1,(hw*.3)|0),1,'#24242a');if(j>6&&j%5===0)R(c,cx-hw+3,y,hw*2-6,1,'#3d3d46')}
      [[-6,-4],[4,2],[-10,6],[9,8],[-1,9],[14,11],[-16,12]].forEach(([a,b])=>{R(c,cx+a,Y+b,2,1,'#5a5a66')});[[-18,12],[-12,10],[8,12],[16,13],[2,13],[-5,13]].forEach(([a,b])=>{R(c,cx+a,Y+b,2,2,'#4f8a4a');R(c,cx+a,Y+b,1,1,'#74b060')});
      R(c,cx-1,Y-26,2,9,'#3a3a44');R(c,cx-5,Y-27,10,2,'#55555e');R(c,cx-3,Y-25,1,6,'#55555e');R(c,cx+2,Y-25,1,6,'#55555e');return true}   // un vieux chevalement au sommet
    case 'chaumiere':{R(c,X-1,Y+15,34,1,'rgba(20,40,30,.28)');R(c,X+1,Y+2,30,13,'#efe2c4');R(c,X+1,Y+2,30,1,'#5f4126');R(c,X+1,Y+13,30,2,'#8f8676');for(let a=X+3;a<X+30;a+=5)R(c,a,Y+2,2,11,'#5f4126');R(c,X+1,Y+2,1,13,'#5f4126');R(c,X+30,Y+2,1,13,'#5f4126');R(c,X+1,Y+8,30,1,'#5f4126');
      R(c,X+13,Y+5,6,9,'#f6f3e9');R(c,X+14,Y+6,4,8,'#5f4126');R(c,X+14,Y+6,4,1,'#7a5a38');R(c,X+17,Y+10,1,1,'#f7d84a');[[5,5],[23,5]].forEach(([a,b])=>{R(c,X+a,Y+b,5,5,'#5f4126');R(c,X+a+1,Y+b+1,3,3,'#a6d4f0');R(c,X+a,Y+b+5,5,1,'#8a5f36');R(c,X+a+1,Y+b+4,1,1,'#e2483b');R(c,X+a+3,Y+b+4,1,1,'#e9679a')});
      R(c,X+23,Y-26,5,8,'#a4472f');R(c,X+22,Y-27,7,2,'#6b3020');
      for(let j=0;j<26;j++){const a=Math.max(0,Math.round((9-j)*.8)),w=36-2*a,col=tint('#c2a25a',.16-j/26*.36);R(c,X-2+a,Y-23+j,w,1,col);for(let k=0;k<w;k++){const v=wh(o.x*7+k,o.y,510);if(v<.2)R(c,X-2+a+k,Y-23+j,1,1,tint('#c2a25a',-.25-j/60));else if(v>.84)R(c,X-2+a+k,Y-23+j,1,1,tint('#c2a25a',.3-j/60))}R(c,X-2+a,Y-23+j,1,1,'#6b5220');R(c,X-3+a+w,Y-23+j,1,1,'#6b5220')}
      R(c,X+7,Y-23,18,3,'#7a8a3a');for(let a=X+9;a<X+24;a+=4)R(c,a,Y-24,1,2,a%8<4?'#8a6fe0':'#f2c12e');R(c,X-2,Y+2,36,1,'#6b5220');R(c,X-2,Y+3,36,1,'rgba(40,25,10,.3)');return true}
    case 'pressoir':R(c,X,Y+15,16,1,'rgba(20,40,30,.26)');R(c,X+1,Y+8,14,7,'#8a5f36');for(let k=3;k<15;k+=3)R(c,X+k,Y+8,1,7,'#63431f');R(c,X+1,Y+8,14,1,'#b98d57');R(c,X+1,Y+11,14,1,'#55524c');R(c,X+2,Y-4,2,12,'#6b4a2b');R(c,X+12,Y-4,2,12,'#6b4a2b');R(c,X+1,Y-5,14,2,'#8a6538');R(c,X+7,Y-8,2,15,'#9aa0a8');R(c,X+7,Y-8,1,15,'#c4c9cf');R(c,X+4,Y-9,8,1,'#6b4a2b');R(c,X+5,Y+5,6,3,'#b98d57');[[3,6],[11,7],[13,6]].forEach(([a,b])=>R(c,X+a,Y+b,2,2,'#e2483b'));R(c,X+14,Y+12,2,3,'#c9a227');return true;
    case 'pommes':R(c,X+1,Y+15,14,1,'rgba(20,40,30,.24)');[[1,8],[8,9],[4,3]].forEach(([a,b],i)=>{R(c,X+a,Y+b,7,6,'#b98d57');R(c,X+a,Y+b,7,1,'#dcb682');R(c,X+a,Y+b+3,7,1,'#86602f');R(c,X+a,Y+b+5,7,1,'#6b4a2b');[[1,-1],[3,-2],[5,-1]].forEach(([p,q],k)=>{R(c,X+a+p,Y+b+q,2,2,(i+k)%3?'#e2483b':'#9ac23a')})});return true;
    case 'puits':{R(c,X,Y+15,16,1,'rgba(20,40,30,.26)');R(c,X+2,Y+6,12,9,'#b4af9c');for(let r=0;r<2;r++){R(c,X+2,Y+9+r*3,12,1,'#7d786b');for(let a=X+4+r*3;a<X+14;a+=6)R(c,a,Y+6+r*3,1,3,'#7d786b')}R(c,X+1,Y+5,14,2,'#d5d1c0');R(c,X+3,Y+6,10,1,'#3a3a44');
      R(c,X+2,Y-6,2,12,'#6b4a2b');R(c,X+12,Y-6,2,12,'#6b4a2b');for(let j=0;j<5;j++)R(c,X+j,Y-7-j,16-2*j,1,j%2?'#8a4a32':'#9a5a3c');R(c,X+7,Y-5,2,7,'#c9c0a6');R(c,X+6,Y+1,4,3,'#8a5f36');
      if(SEA.se!==3)[[1,4],[5,3],[10,4],[13,3]].forEach(([a,b],i)=>{R(c,X+a,Y+b,2,2,i%2?'#e2483b':'#e9679a');R(c,X+a,Y+b+2,1,1,'#3f8a45')});return true}
    case 'cabotte':{R(c,X-1,Y+15,18,1,'rgba(20,40,30,.26)');R(c,X+1,Y+3,14,12,'#e2d2a8');for(let i=0;i<12;i++)R(c,X+2+((wh(o.x,i,511)*10)|0),Y+4+((wh(i,o.y,512)*9)|0),3,1,i%2?'#c9b888':'#f0e4c0');R(c,X+1,Y+3,1,12,'#8a7a54');R(c,X+14,Y+3,1,12,'#8a7a54');R(c,X+6,Y+7,4,8,'#3f2a14');R(c,X+6,Y+7,4,1,'#f0e6c8');
      for(let j=0;j<10;j++){const a=Math.round(j*.7);R(c,X+7-a,Y-7+j,2+2*a,1,j%3===0?'#8a7a54':'#b9a878')}R(c,X-1,Y+3,18,1,'#6b5e3e');R(c,X+7,Y-8,2,1,'#6b5e3e');return true}
    case 'tonneau':{const n=1+((h*2)|0);for(let i=0;i<n;i++){const a=X+2+i*6,b=Y+5-i*2;R(c,a,Y+15,9,1,'rgba(20,40,30,.24)');R(c,a,b+1,9,9,'#8a5f36');R(c,a+1,b,7,11,'#8a5f36');R(c,a+1,b,2,11,'#b98d57');R(c,a+7,b,1,11,'#63431f');R(c,a,b+2,9,1,'#55524c');R(c,a,b+8,9,1,'#55524c');R(c,a+4,b+5,1,1,'#3f2a14')}return true}
    case 'escargot':{if(SKY.wet<.25||SKY.snowG)return true;const a=X+3+((t/50+h*40|0)%9);R(c,a,Y+11,5,1,'#d9c9a0');R(c,a+4,Y+9,1,2,'#d9c9a0');R(c,a+1,Y+8,3,3,'#8a5f36');R(c,a+2,Y+9,1,1,'#c9a26e');return true}
    case 'phare':{R(c,X,Y+15,16,1,'rgba(20,40,30,.3)');R(c,X+1,Y+11,14,4,'#9a968c');R(c,X+1,Y+11,14,1,'#c4c0b4');R(c,X+1,Y+14,14,1,'#6f6b62');
      for(let j=0;j<45;j++){const y=Y+10-j,hw=5-(j>30?1:0)-(j<4?-1:0);R(c,X+8-hw,y,hw*2,1,((j/9)|0)%2?'#c43d3d':'#f4f1e8');R(c,X+8-hw,y,2,1,((j/9)|0)%2?'#e0685a':'#ffffff');R(c,X+7+hw-1,y,2,1,((j/9)|0)%2?'#8f2a2a':'#c9c5ba')}
      R(c,X+7,Y+2,2,8,'#3f2a14');[[-8],[-20]].forEach(([b])=>R(c,X+7,Y+b,2,3,'#33475e'));R(c,X+2,Y-36,12,2,'#3a3a44');for(let a=X+2;a<X+14;a+=2)R(c,a,Y-39,1,3,'#59627c');R(c,X+2,Y-39,12,1,'#59627c');
      R(c,X+5,Y-43,6,7,SKY.lamps?'#fff3a8':'#cfe6f2');R(c,X+5,Y-43,1,7,'#3a3a44');R(c,X+10,Y-43,1,7,'#3a3a44');R(c,X+4,Y-44,8,1,'#c43d3d');R(c,X+5,Y-45,6,1,'#c43d3d');return true}
    case 'calvaire':R(c,X+1,Y+15,14,1,'rgba(20,40,30,.26)');R(c,X+2,Y+11,12,4,'#9a968c');R(c,X+4,Y+8,8,3,'#aaa69c');R(c,X+2,Y+11,12,1,'#c4c0b4');R(c,X+7,Y-12,3,20,'#9a968c');R(c,X+7,Y-12,1,20,'#c4c0b4');R(c,X+3,Y-7,11,3,'#9a968c');R(c,X+3,Y-7,11,1,'#c4c0b4');c.strokeStyle='#8a867c';c.lineWidth=1;c.beginPath();c.arc(X+8.5,Y-5.5,4.5,0,7);c.stroke();R(c,X+5,Y+12,2,1,'#6f9a55');R(c,X+9,Y+3,1,1,'#c9b84e');return true;
    case 'barque':R(c,X,Y+14,18,1,'rgba(20,40,30,.26)');R(c,X+1,Y+8,16,5,'#2f5f9a');R(c,X,Y+7,18,2,'#f4f1e8');R(c,X+2,Y+12,14,1,'#1f3f6a');R(c,X+1,Y+8,1,4,'#4a7fc0');R(c,X+3,Y+9,12,2,'#8a5f36');R(c,X+6,Y+9,1,2,'#63431f');R(c,X+11,Y+9,1,2,'#63431f');
      for(let k=0;k<5;k++){R(c,X+8+k,Y+3+((k%2)?1:0),1,5,'rgba(230,240,240,.8)')}R(c,X+7,Y+4,7,1,'rgba(230,240,240,.8)');R(c,X+9,Y+2,2,2,'#e2573b');return true;
    case 'casier':R(c,X+1,Y+15,13,1,'rgba(20,40,30,.24)');R(c,X+1,Y+8,10,7,'#8a6538');for(let k=2;k<11;k+=2)R(c,X+k,Y+8,1,7,'#553920');R(c,X+1,Y+8,10,1,'#b98d57');R(c,X+1,Y+11,10,1,'#b98d57');R(c,X+1,Y+14,10,1,'#553920');R(c,X+11,Y+9,3,4,'#e2573b');R(c,X+11,Y+9,3,1,'#f7f0dc');R(c,X+12,Y+6,1,3,'#3a3a44');return true;
    case 'menhir':artMenhir(c,X,Y,o.x,o.y);return true;
    case 'boules':{R(c,X-1,Y+2,34,13,'#d9c08a');R(c,X-1,Y+2,34,1,'#b9a06a');R(c,X-1,Y+14,34,1,'#b9a06a');R(c,X-1,Y+2,1,13,'#b9a06a');R(c,X+32,Y+2,1,13,'#b9a06a');for(let i=0;i<14;i++)R(c,X+((wh(i,o.x,513)*30)|0),Y+4+((wh(o.y,i,514)*9)|0),1,1,i%2?'#c9ae76':'#ead8a8');
      R(c,X+22,Y+8,1,1,'#e2a13a');[[19,6],[24,9],[20,10],[14,7],[26,6],[9,11]].forEach(([a,b],i)=>{R(c,X+a,Y+b,2,2,i%2?'#8e949d':'#6d7480');R(c,X+a,Y+b,1,1,'#e9ecf0')});return true}
    case 'fontaineP':{R(c,X-1,Y+15,18,1,'rgba(20,40,30,.26)');R(c,X,Y+8,16,7,'#d2a56c');R(c,X,Y+8,16,2,'#e8c490');R(c,X,Y+14,16,1,'#7a5a30');R(c,X+2,Y+9,12,2,'#56a6dd');R(c,X+3,Y+9,4,1,'#a6d4f0');
      R(c,X+6,Y-6,4,15,'#c2955c');R(c,X+6,Y-6,1,15,'#e8c490');R(c,X+5,Y-8,6,2,'#deb47c');c.fillStyle='#deb47c';c.beginPath();c.arc(X+8,Y-10,2.5,0,7);c.fill();R(c,X+4,Y+1,2,1,'#8e949d');R(c,X+10,Y+1,2,1,'#8e949d');R(c,X+4,Y+2,1,7,'rgba(166,212,240,.8)');R(c,X+11,Y+2,1,7,'rgba(166,212,240,.8)');
      [[6,-3],[8,2],[7,6],[1,10],[13,12]].forEach(([a,b])=>{R(c,X+a,Y+b,2,2,'#5f8a4a');R(c,X+a,Y+b,1,1,'#86b05a')});return true}
    case 'ruche':{const col=['#f4f1e8','#e9d27a','#9cc3dd'][(h*3)|0];R(c,X+2,Y+15,12,1,'rgba(20,40,30,.24)');R(c,X+4,Y+12,2,3,'#6b4a2b');R(c,X+10,Y+12,2,3,'#6b4a2b');R(c,X+3,Y+3,10,9,col);R(c,X+3,Y+6,10,1,tint(col,-.2));R(c,X+3,Y+9,10,1,tint(col,-.2));R(c,X+2,Y+1,12,2,'#8e949d');R(c,X+2,Y+1,12,1,'#c3c8d1');R(c,X+6,Y+10,4,1,'#3a3a44');
      return true}
    case 'bergerie':{R(c,X-1,Y+15,34,1,'rgba(20,40,30,.28)');R(c,X+1,Y+2,30,13,'#a8a395');for(let r=0;r<3;r++){R(c,X+1,Y+5+r*4,30,1,'#7d786b');for(let a=X+3+(r%2)*4;a<X+30;a+=8)R(c,a,Y+2+r*4,1,3,'#7d786b')}R(c,X+1,Y+2,1,13,'#5f5b51');R(c,X+30,Y+2,1,13,'#5f5b51');
      R(c,X+11,Y+5,10,10,'#2a1c10');R(c,X+11,Y+5,10,1,'#6b4a2b');R(c,X+10,Y+5,1,10,'#6b4a2b');R(c,X+21,Y+5,1,10,'#6b4a2b');R(c,X+13,Y+12,6,3,'#c9a26e');R(c,X+4,Y+6,4,3,'#33475e');R(c,X+24,Y+6,4,3,'#33475e');
      for(let j=0;j<22;j++){const a=Math.max(0,Math.round((14-j)*.9)),w=40-2*a;R(c,X-4+a,Y-19+j,w,1,j%4===0?'#5f4a34':tint('#8a7256',.1-j/22*.2));if(j%4===2)for(let k=a+3;k<40-a;k+=6)R(c,X-4+k,Y-19+j,1,2,'#5f4a34')}R(c,X-5,Y,42,3,'#4a3524');R(c,X-5,Y,42,1,'#7a5a38');
      [[4,-8],[18,-12],[27,-6],[11,-4]].forEach(([a,b])=>{R(c,X+a,Y+b+1,5,3,'#8e8a80');R(c,X+a+1,Y+b,3,1,'#b4b0a4')});R(c,X+14,Y-14,4,5,'#7a5230');R(c,X+15,Y-13,2,3,'#2a1c10');return true}
    case 'mouton':{const f=o.x%2?1:-1;R(c,X+2,Y+14,12,1,'rgba(20,40,30,.22)');R(c,X+4,Y+12,2,3,'#3a3530');R(c,X+10,Y+12,2,3,'#3a3530');R(c,X+2,Y+6,12,7,'#f4f1e8');R(c,X+3,Y+5,10,1,'#f4f1e8');R(c,X+3,Y+13,10,1,'#dcd8cc');[[4,7],[8,6],[11,9],[6,10]].forEach(([a,b])=>R(c,X+a,Y+b,2,1,'#dcd8cc'));
      R(c,f>0?X+11:X,Y+4,5,5,'#3a3530');R(c,f>0?X+13:X+2,Y+6,1,1,'#fff');return true}
    case 'patou':R(c,X+1,Y+14,14,1,'rgba(20,40,30,.22)');R(c,X+2,Y+8,11,6,'#f7f4ec');R(c,X+2,Y+13,11,1,'#dcd8cc');R(c,X+10,Y+5,5,6,'#f7f4ec');R(c,X+10,Y+5,2,3,'#e6dcc6');R(c,X+14,Y+8,1,2,'#3a3530');R(c,X+12,Y+7,1,1,'#222');R(c,X+1,Y+7,2,3,'#f7f4ec');R(c,X+4,Y+10,3,1,'#e6dcc6');return true;
    case 'bassin':R(c,X-1,Y+15,18,1,'rgba(20,40,30,.24)');R(c,X,Y+8,16,6,'#8a6538');R(c,X,Y+8,16,1,'#b98d57');R(c,X,Y+13,16,1,'#553920');R(c,X+1,Y+9,14,2,'#56a6dd');R(c,X+2,Y+9,5,1,'#a6d4f0');R(c,X+1,Y+14,2,1,'#553920');R(c,X+13,Y+14,2,1,'#553920');
      R(c,X+12,Y-2,2,10,'#6b4a2b');R(c,X+8,Y,5,1,'#8e949d');R(c,X+8,Y+1,1,8,'rgba(166,212,240,.85)');return true;
    case 'tasbois':R(c,X,Y+15,16,1,'rgba(20,40,30,.24)');for(let r=0;r<3;r++)for(let k=0;k<4-(r>1?1:0);k++){const a=X+1+k*4+(r%2)*2,b=Y+11-r*4;c.fillStyle='#8a5f36';c.beginPath();c.arc(a+2,b+2,2.2,0,7);c.fill();R(c,a+1,b+1,2,2,'#d9b88a');R(c,a+2,b+2,1,1,'#8a5f36')}return true;
  }
  return false;
}
