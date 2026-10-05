/* Wattlings · jeu/rendu/objets.js
   Dessin des objets : compteurs, panneaux, boîtes aux lettres, meubles… */

function drawObj0(c,o,ox,oy,t){
  const X=(o.px!==undefined?Math.round(o.px):o.x*TS)-ox,Y=(o.py!==undefined?Math.round(o.py):o.y*TS)-oy;
  if(o.draw){o.draw(c,X,Y,t);return}
  if(drawEgg(c,o,X,Y,t))return;
  if(o.decor&&drawDecor(c,o,X,Y,t))return;
  switch(o.kind){
    case 'mailbox':R(c,X+7,Y+8,2,8,'#6b4a2b');R(c,X+3,Y+2,10,7,'#c43d3d');R(c,X+4,Y+3,8,2,'#e25f5f');R(c,X+11,Y+1,1,4,'#f2a33a');break;
    case 'panel':R(c,X+2,Y+12,2,4,'#555');R(c,X+12,Y+12,2,4,'#555');R(c,X+1,Y+2,14,10,'#1c2440');R(c,X+2,Y+3,12,8,'#f7f0dc');for(let i=0;i<3;i++)R(c,X+3,Y+4+i*2,i===0?7:10,1,'#5b6380');break;
    case 'sign':{const tl=(o.x+o.y)%3===0?1:0;R(c,X+7,Y+9,2,7,'#6b4a2b');R(c,X+2,Y+3+tl,6,7,'#a07845');R(c,X+8,Y+3,6,7,'#a07845');R(c,X+2,Y+3+tl,6,1,'#c9a26e');R(c,X+8,Y+3,6,1,'#c9a26e');R(c,X+3,Y+5+tl,5,1,'#5a3a22');R(c,X+8,Y+5,5,1,'#5a3a22');R(c,X+3,Y+7+tl,5,1,'#5a3a22');R(c,X+8,Y+7,2,1,'#5a3a22');break}
    case 'npc':{if(c===ctx&&(X<-24||X>cv.width+8||Y<-28||Y>cv.height+8))break;let d=o.dir;const ax=P.x-o.x,ay=P.y-o.y,hh=(o.x*37+o.y*91)%211;if(!o.still&&(ax||ay)&&Math.abs(ax)+Math.abs(ay)<=2&&c===ctx)d=Math.abs(ax)>Math.abs(ay)?(ax>0?'right':'left'):(ay>0?'down':'up');
      drawChar(c,X,Y-2,d,o.frame||0,skPal(o),false,o.moving?null:{idle:(t+hh*3)%110<9,blink:(t+hh*7)%190<7})}if(o.bang){R(c,X+5,Y-14,6,10,'#fff');R(c,X+7,Y-13,2,5,'#c43d3d');R(c,X+7,Y-7,2,2,'#c43d3d')}break;
    case 'pc':R(c,X,Y+4,16,12,'#8a5f36');R(c,X+3,Y-2,10,8,'#1c2440');R(c,X+4,Y-1,8,6,(t>>4)%2?'#2aa198':'#34b5aa');R(c,X+7,Y+6,2,2,'#333');break;
    case 'desk':R(c,X,Y+4,16,12,'#8a5f36');R(c,X,Y+4,16,2,'#a0764a');if(o.x===1)R(c,X+4,Y+1,8,4,'#f7f0dc');break;
    case 'shelf':R(c,X+1,Y-6,14,22,'#6b4a2b');for(let i=0;i<4;i++){R(c,X+2,Y-5+i*5,12,4,'#4a3421');for(let j=0;j<4;j++)R(c,X+3+j*3,Y-4+i*5,2,3,['#c0503a','#2aa198','#f2a33a','#4a78c9'][(i+j+o.x)%4])}break;
    case 'mapwall':R(c,X+1,Y+2,14,10,'#f7f0dc');R(c,X+2,Y+3,12,8,'#9fd08a');R(c,X+4,Y+6,8,1,'#e3cf98');R(c,X+5,Y+4,2,2,'#c0503a');R(c,X+10,Y+4,2,2,'#3f7f8f');R(c,X+9,Y+8,2,2,'#b8864a');break;
    case 'plant':R(c,X+5,Y+10,6,6,'#a0522d');c.fillStyle='#3f9a5f';c.beginPath();c.arc(X+8,Y+7,5,0,7);c.fill();break;
    case 'coffret':R(c,X+2,Y+1,12,12,'#9aa0a8');R(c,X+3,Y+2,10,10,'#c4c9cf');R(c,X+5,Y+4,6,4,'#1c2440');R(c,X+6,Y+5,4,2,(t>>5)%2?'#2aa198':'#1c7a73');R(c,X+4,Y+9,8,2,'#7a8088');break;
    case 'submeter':R(c,X+4,Y+3,8,9,'#c4c9cf');R(c,X+5,Y+4,6,3,'#1c2440');R(c,X+6,Y+5,3,1,'#2aa198');R(c,X+7,Y+12,2,2,'#333');break;
    case 'gasmeter':R(c,X+2,Y+2,12,11,'#e8d24a');R(c,X+3,Y+3,10,6,'#f7f0dc');R(c,X+4,Y+5,8,2,'#333');R(c,X+4,Y+13,2,3,'#888');R(c,X+10,Y+13,2,3,'#888');break;
    case 'boiler':R(c,X+1,Y-8,15,24,'#d9d9dc');R(c,X+3,Y-6,11,6,'#bbb');R(c,X+5,Y+4,6,4,S.ch===7?((t>>3)%2?'#e2573b':'#f2a33a'):'#555');break;
    case 'boiler2':R(c,X,Y-8,14,24,'#cfcfd3');R(c,X+4,Y-10,4,4,'#888');R(c,X+2,Y+2,8,2,'#999');break;
    case 'crate':R(c,X+1,Y+2,14,13,'#a07845');R(c,X+1,Y+8,14,1,'#6b4a2b');R(c,X+7,Y+2,1,13,'#6b4a2b');break;
    case 'schooldesk':R(c,X+1,Y+4,14,7,'#c89b62');R(c,X+1,Y+4,14,2,'#dcb07a');R(c,X+2,Y+11,2,4,'#555');R(c,X+12,Y+11,2,4,'#555');R(c,X+5,Y+12,6,3,'#4a78c9');break;
    case 'board':R(c,X-10,Y+1,36,11,'#8a6538');R(c,X-9,Y+2,34,9,'#2f5a45');R(c,X-6,Y+4,10,1,'#e8e4d6');R(c,X+6,Y+7,14,1,'#e8e4d6');break;
    case 'stove':R(c,X+1,Y+2,14,14,'#b0b4ba');R(c,X+3,Y+4,4,3,'#333');R(c,X+9,Y+4,4,3,'#333');R(c,X+3,Y+10,10,4,'#8a8f96');break;
    case 'officedesk':R(c,X,Y+5,16,7,'#e6e2d8');R(c,X+1,Y+12,2,4,'#777');R(c,X+13,Y+12,2,4,'#777');R(c,X+4,Y,8,6,'#1c2440');R(c,X+5,Y+1,6,4,'#4a78c9');break;
    case 'rack':R(c,X+2,Y-6,12,22,'#1c2440');for(let i=0;i<6;i++)R(c,X+4,Y-4+i*3,8,1,(t>>3)%3===i%3?'#2aa198':'#39426a');break;
    case 'counter':R(c,X,Y+3,16,13,'#b8864a');R(c,X,Y+3,16,3,'#e3cfa0');R(c,X+2,Y+7,12,5,'#c9ecfa');R(c,X+3,Y+9,5,2,'#d9a55a');break;
    case 'oven':R(c,X+1,Y-4,14,20,'#7a7f88');R(c,X+3,Y,10,7,'#1f1f22');R(c,X+4,Y+1,8,5,'#e2573b');R(c,X+3,Y+9,10,1,'#ccc');break;
    case 'bin':R(c,X+3,Y+4,10,11,'#5b6380');R(c,X+2,Y+3,12,2,'#39426a');R(c,X+5,Y+1,6,3,'#f7f0dc');R(c,X+6,Y+7,1,6,'#39426a');R(c,X+9,Y+7,1,6,'#39426a');break;
    case 'cat':{const b=(t>>5)%2;R(c,X+3,Y+8,9,5,'#e0913a');R(c,X+10,Y+5,5,5,'#e0913a');R(c,X+10,Y+4,1,2,'#e0913a');R(c,X+14,Y+4,1,2,'#e0913a');R(c,X+11,Y+7,1,1,'#222');R(c,X+13,Y+7,1,1,'#222');R(c,X+1,Y+(b?7:9),3,2,'#e0913a');R(c,X+4,Y+9,6,1,'#c0712a');break}
    case 'legend':R(c,X+4,Y+3,8,10,'#6b5a3a');R(c,X+5,Y+4,6,5,'#d9d2b5');R(c,X+6,Y+6,4,1,(t>>3)%2?'#222':'#888');R(c,X+2,Y+11,12,5,'#3f8a3a');R(c,X+1,Y+9,4,4,'#2e7d4f');R(c,X+11,Y+10,4,4,'#2e7d4f');break;
    case 'poster':R(c,X+2,Y+2,12,10,'#f7f0dc');R(c,X+2,Y+2,12,2,'#2f6db5');R(c,X+4,Y+6,8,1,'#5b6380');R(c,X+4,Y+8,6,1,'#5b6380');R(c,X+4,Y+10,7,1,'#c43d3d');break;
    case 'dab':R(c,X+2,Y,12,16,'#5b6380');R(c,X+4,Y+2,8,5,'#9ad0e8');R(c,X+5,Y+9,6,1,'#1c2440');R(c,X+4,Y+11,8,3,'#39426a');break;
    case 'clock':R(c,X+6,Y+6,4,10,'#5b4a3a');c.fillStyle='#f7f0dc';c.beginPath();c.arc(X+8,Y+4,6,0,7);c.fill();c.strokeStyle='#1c2440';c.lineWidth=1;c.stroke();R(c,X+8,Y,1,4,'#1c2440');R(c,X+8,Y+4,3,1,'#1c2440');break;
    case 'mast':R(c,X+7,Y-8,2,24,'#9aa0a8');R(c,X+3,Y-8,10,2,'#9aa0a8');c.fillStyle='#c43d3d';c.beginPath();c.arc(X+4,Y-9,2,0,7);c.arc(X+12,Y-9,2,0,7);c.fill();R(c,X+2,Y+4,12,8,'#f7f0dc');R(c,X+3,Y+5,10,6,'#e8e4d6');R(c,X+4,Y+7,8,1,'#1a73c9');break;
    case 'borne':R(c,X+4,Y+4,8,12,'#39426a');R(c,X+3,Y,10,7,'#1c2440');R(c,X+4,Y+1,8,5,(t>>4)%2?'#2aa198':'#34b5aa');break;
    case 'balance':R(c,X+3,Y+10,10,5,'#9aa0a8');R(c,X+7,Y+1,2,10,'#9aa0a8');R(c,X+4,Y-1,8,5,'#f7f0dc');R(c,X+5,Y,6,3,'#2f8f4e');break;
    case 'chairs':R(c,X+1,Y+6,6,6,'#2f6db5');R(c,X+9,Y+6,6,6,'#2f6db5');R(c,X+1,Y+3,6,3,'#1c4f8f');R(c,X+9,Y+3,6,3,'#1c4f8f');break;
    case 'readtable':R(c,X,Y+4,16,8,'#c89b62');R(c,X+3,Y+5,5,3,'#f7f0dc');R(c,X+1,Y+12,2,4,'#6b4a2b');R(c,X+13,Y+12,2,4,'#6b4a2b');break;
    case 'bed':R(c,X,Y+2,16,12,'#e8e4d6');R(c,X,Y+2,4,12,'#9ad0e8');R(c,X+1,Y+14,2,2,'#888');R(c,X+13,Y+14,2,2,'#888');break;
    case 'sofa':R(c,X,Y+4,16,10,'#8a3b3b');R(c,X,Y+2,16,4,'#a54a4a');break;
    case 'tv':R(c,X+1,Y+1,14,10,'#1c2440');R(c,X+2,Y+2,12,8,(t>>5)%2?'#4a78c9':'#5a88d9');R(c,X+6,Y+11,4,3,'#333');break;
    case 'pv':R(c,X,Y+3,16,10,'#1c3f7a');for(let i=0;i<4;i++)R(c,X+i*4,Y+3,1,10,'#9ad0e8');R(c,X,Y+7,16,1,'#9ad0e8');R(c,X+7,Y+13,2,3,'#888');break;
    case 'stall':R(c,X,Y+6,16,10,'#a07845');R(c,X,Y,16,5,'#c43d3d');for(let i=0;i<4;i++)R(c,X+i*4,Y,2,5,'#f7f0dc');R(c,X+2,Y+7,4,3,'#e2573b');R(c,X+7,Y+7,4,3,'#2f9e7a');R(c,X+12,Y+7,3,3,'#f2c12e');break;
    case 'watermeter':R(c,X+4,Y+6,8,8,'#1a73c9');R(c,X+5,Y+7,6,4,'#e8e4d6');R(c,X+6,Y+8,4,1,(t>>3)%2?'#222':'#888');R(c,X+2,Y+12,12,2,'#888');break;
    case 'turbine':{const bx=X+8,by=Y+14,hy=Y-34,a=SKR.turb+o.x;R(c,bx-2,hy,4,by-hy,'#e8eef5');R(c,bx-1,hy,1,by-hy,'#c9d3de');R(c,bx-4,by-2,8,3,'#9aa0a8');
      c.strokeStyle='#f7fbff';c.lineWidth=2;c.lineCap='round';for(let i=0;i<3;i++){const ang=a+i*2.094;c.beginPath();c.moveTo(bx,hy);c.lineTo(bx+Math.cos(ang)*17,hy+Math.sin(ang)*17);c.stroke()}
      R(c,bx-2,hy-2,5,5,'#c9d3de');R(c,bx-1,hy-1,3,3,'#9aa0a8');break}
    case 'machine':{const rust=['#8a5a3a','#a0522d','#6b4a2b','#7a6a5a'];R(c,X,Y+2,32,14,'#5d5048');R(c,X+1,Y+3,30,12,'#7a6a5a');
      for(let i=0;i<14;i++){const hx=(hash(o.x*7+i,o.y*3)*28)|0,hy=(hash(i,o.x)*10)|0;R(c,X+2+hx,Y+4+hy,2+(i%3),1+(i%2),rust[i%4])}
      R(c,X+3,Y-6,12,9,'#6b5a4a');R(c,X+4,Y-5,10,7,'#3a3530');R(c,X+20,Y-3,3,6,'#5d5048');R(c,X+26,Y-8,3,11,'#6b5a4a');
      const G={P:['111','101','111','100','100'],S:['111','100','111','001','111'],E:['111','100','110','100','111']};let gx=X+6;
      ['P','S','P','E'].forEach((ch,ci)=>{G[ch].forEach((row,ry)=>[...row].forEach((b,rx)=>{if(b==='1'&&hash(ci*9+rx,ry)>.18)R(c,gx+rx,Y+6+ry,1,1,hash(rx,ci)>.5?'#d9c79a':'#b09a70')}));gx+=4});
      R(c,X+4,Y+5,18,7,'#4a4038');
      const on=(t>>3)%7!==0&&(t>>2)%11!==3;R(c,X+8,Y-3,3,3,on?'#f2c12e':'#5a4a1a');
      if((t%97)<6){R(c,X+22+((t*7)%5),Y-6-((t*3)%4),1,1,'#fff6c0');R(c,X+21,Y-4,1,1,'#f2a33a')}
      const sm=(t%120)/120;c.fillStyle=`rgba(200,200,200,${.5*(1-sm)})`;c.fillRect(X+26,Y-10-sm*14,3+sm*3,3+sm*3);break}
    case 'bigpc':R(c,X,Y+4,16,12,'#8a5f36');R(c,X+1,Y-6,15,11,'#1c2440');R(c,X+2,Y-5,14,9,'#fffaf0');for(let i=0;i<4;i++)R(c,X+3,Y-4+i*2,10-i*2,1,i<2?'#00968a':'#d4502f');break;
    case 'bigpc2':R(c,X,Y+4,16,12,'#8a5f36');R(c,X,Y-6,14,11,'#1c2440');R(c,X,Y-5,13,9,'#fffaf0');R(c,X+2,Y-4,2,6,'#3a4a7a');R(c,X+5,Y-2,2,4,'#3a4a7a');R(c,X+8,Y,2,2,'#3a4a7a');R(c,X+6,Y+5,4,2,'#333');break;
    case 'flag':R(c,X+1,Y+2,14,10,'#a07845');R(c,X+2,Y+3,12,8,'#f7f0dc');R(c,X+3,Y+5,8,1,'#5b6380');R(c,X+3,Y+7,6,1,'#5b6380');R(c,X+3,Y+9,4,1,'#c43d3d');break;
    case 'derive':if(!S.derives[o.did]){const g=c.createRadialGradient(X+8,Y+8,1,X+8,Y+8,14);g.addColorStop(0,'rgba(255,230,120,.95)');g.addColorStop(1,'rgba(255,230,120,0)');c.fillStyle=g;c.fillRect(X-8,Y-8,32,32);R(c,X+6,Y+5,4,5,'#fff6c0');R(c,X+7,Y+10,2,2,'#999')}break;
  }
}
