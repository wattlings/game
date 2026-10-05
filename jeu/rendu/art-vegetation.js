/* Wattlings · jeu/rendu/art-vegetation.js
   Rendu détaillé : arbres et végétation, sprites générés une fois. */

/* ---- végétation : sprites générés une fois ---- */
function artBlob(P,cx,cy,rx,ry,pal,seed,grain){
  for(let b=Math.floor(cy-ry);b<=cy+ry;b++)for(let a=Math.floor(cx-rx);a<=cx+rx;a++){const u=(a+.5-cx)/rx,w=(b+.5-cy)/ry,d=u*u+w*w;if(d>1)continue;
    const l=-u*.55-w*.8+(vnoise(a/2.7+seed,b/2.7+seed*1.7)-.5)*(grain===undefined?.95:grain);
    P(a,b,pal[d>.8?(u+w>-.25?0:1):l>.72?4:l>.28?3:l>-.3?2:1])}
}
/* arbre nu : un tronc, des branches qui se divisent (l'hiver) */
function artBare(P,sp,v){
  const birch=sp===2,pop=sp===6,tc=birch?['#ece7d8','#b5ae98','#4a4a4a','#9a947f']:['#8a5f36','#63431f','#3f2a14','#6f4d2b'];let n=0;const rnd=()=>wh(sp*17+v*5+3,n++,7),sp0=pop?.4:1;
  const br=(x,y,ang,len,w,d)=>{for(let i=0;i<len;i++){x+=Math.cos(ang);y+=Math.sin(ang);const px=Math.round(x),py=Math.round(y);if(w===1)P(px,py,tc[3]);else for(let k=0;k<w;k++)P(px+k-(w>>1),py,k===0&&!birch?tint(tc[0],.15):k===w-1?tc[1]:tc[0]);if(d<3)ang+=(rnd()-.5)*.3*sp0}
    if(d>0){const s=(.5+rnd()*.3)*sp0,w2=Math.max(1,w-1);br(x,y,ang-s,len*(pop?.85:.72),w2,d-1);br(x,y,ang+s,len*(pop?.85:.72),w2,d-1);if(d>1)br(x,y,ang+(rnd()-.5)*.25,len*.8,w2,d-1)}};
  br(11,27.5,-Math.PI/2,pop?8:9,birch||pop?2:3,3);
  if(birch){P(10,24,tc[2]);P(11,21,tc[2])}else{P(9,27,tc[1]);P(13,27,tc[2])}
}
function artInit(){
  if(ART.tree)return;ART.tree=[];const se=SEA.se,snow=SEA.snow;
  const PALS=[['#1f5238','#2a7048','#3a8d58','#55aa69','#8ccf88'],['#143c2c','#1d5539','#2a7047','#3d8b57','#63ad72'],['#2a7446','#3f9555','#5cb264','#84cc7a','#b9e79c'],['#235a33','#327c43','#499a53','#6ab664','#a2da89'],
    ['#12301f','#1a4530','#245a3e','#33724e','#4f8f66'],['#4f6a55','#66826c','#829c86','#a0b8a0','#c6d6c2'],['#2a6d3c','#3f8c48','#58a856','#7cc46e','#aee096']];
  const SPR=[['#2a6a3c','#3b8a4c','#52a85c','#74c56f','#aee59a'],null,['#3a8a4a','#52aa58','#74c668','#9cdc82','#cdf0a8'],['#2f7040','#43904c','#5fae5a','#84c870','#b8e496'],null,null,['#3a8a44','#52a852','#70c264','#98da80','#c8f0a6']];
  const AUT=[[['#7a3d16','#a5561d','#cf7a26','#e89c3a','#f6c765'],['#6a2416','#93321c','#b94a22','#d86a2c','#eea050'],['#7a5a14','#a57f1c','#cfa628','#e6c544','#f6e384']],null,
    [['#8a6a12','#b8921c','#dcb82c','#f0d650','#faec96']],[['#6a3a18','#8f5220','#b3722c','#d2953e','#e9bd6a'],['#5a5a1c','#7f8226','#a3a634','#c4c552','#e2e184']],null,null,[['#8a6a12','#b8921c','#dcb82c','#f0d650','#faec96'],['#7a5a14','#a57f1c','#cfa628','#e6c544','#f6e384']]];
  for(let sp=0;sp<7;sp++){ART.tree[sp]=[];for(let v=0;v<3;v++){const c=mkc(22,30),x=c.getContext('2d',{willReadFrequently:true}),P=(a,b,col)=>{x.fillStyle=col;x.fillRect(a,b,1,1)},ever=treeEver(sp),bare=se===3&&!ever,
      pal=sp===1?(snow?[PALS[1][0],PALS[1][1],PALS[1][2],'#d6e2ec','#f8fbfd']:PALS[1]):ever?PALS[sp]:se===0?SPR[sp]:se===2?AUT[sp][v%AUT[sp].length]:PALS[sp];
    x.fillStyle='rgba(20,50,30,.26)';x.beginPath();x.ellipse(11,27.2,bare||sp===4||sp===6?5:8,bare?1.8:2.6,0,0,7);x.fill();
    if(bare)artBare(P,sp,v);
    else if(sp===1){ // conifère : trois étages de branches
      for(let b=24;b<28;b++){P(10,b,'#7a5330');P(11,b,'#553920')}
      [[13,12,9+(v===2?1:0)],[7,11,7],[1,10,5]].forEach(([top,h,hw],ti)=>{for(let yy=0;yy<h;yy++){const half=Math.max(1,Math.round(hw*(yy+1)/h)),x0=11-half,x1=10+half;
        for(let a=x0;a<=x1;a++){const t=(a-x0)/Math.max(1,x1-x0),last=yy===h-1;if(last&&(a+ti+v)%3===0)continue;
          P(a,top+yy,a===x0?pal[1]:a===x1||last?pal[0]:t<.22?pal[3]:t<.36?(yy%3===1?pal[4]:pal[3]):t<.68?pal[2]:pal[1])}}});
      P(10,0,pal[2]);P(11,0,pal[1]);
    }else if(sp===4){ // cyprès : une flamme sombre, étroite et haute
      for(let b=24;b<28;b++){P(10,b,'#6b4a2b');P(11,b,'#553920')}
      const top=v===1?2:0;for(let yy=top;yy<25;yy++){const t=(yy-top)/(24-top),half=Math.max(1,Math.round((3.4+(v===2?.5:0))*Math.sin(Math.min(1,t*1.18)*Math.PI*.64+.2))),x0=11-half,x1=10+half;
        for(let a=x0;a<=x1;a++){const u=(a-x0)/Math.max(1,x1-x0);P(a,yy+1,a===x0?pal[3]:a===x1?pal[0]:u<.34?(wh(a,yy,370+v)<.3?pal[4]:pal[3]):u<.66?pal[2]:pal[1])}}
    }else if(sp===5){ // olivier : tronc noueux, feuillage argenté
      [[10,27],[11,27],[12,27],[9,26],[10,26],[11,26],[10,25],[11,25],[11,24],[12,24],[11,23],[10,22],[11,22],[10,21],[9,20],[10,20],[12,21],[13,20],[10,19],[13,19]].forEach(([a,b],i)=>P(a+(v===2&&b<23?-1:0),b,i%3===0?'#8a7a62':i%3===1?'#6b5c48':'#4f4234'));
      artBlob(P,11,11.5,9.8,7.2+(v===1?.6:0),pal,31+v*4.7,1.25);artBlob(P,6,14,3.6,3,pal,37+v,1.1);artBlob(P,16,14.5,3.4,2.8,pal,41+v,1.1);
      if(se===2)[[6,10],[10,7],[14,11],[9,14],[15,8]].forEach(([a,b])=>{P(a,b,'#2a2a3a');P(a,b+1,'#1c1c28')});
    }else{
      const birch=sp===2,pop=sp===6,tw=birch||pop?2:4,tx=birch||pop?10:9,tc=birch?['#f4f0e4','#cfc8b4','#4a4a4a']:pop?['#9a8a6a','#74664c','#4f4434']:['#8a5f36','#63431f','#3f2a14'];
      for(let b=17;b<27;b++)for(let a=0;a<tw;a++)P(tx+a,b,a===0&&!birch?tint(tc[0],.15):a===tw-1?tc[1]:tc[0]);
      if(birch){P(tx,19,tc[2]);P(tx+1,22,tc[2]);P(tx,24,tc[2])}else if(!pop){P(tx-1,26,tc[1]);P(tx+tw,26,tc[2]);P(tx+1,20,tc[2]);P(tx+2,23,tc[1])}
      if(pop)artBlob(P,11,11.5,4.6+(v===1?.5:0),11.2,pal,53+v*3.1,.8);
      else artBlob(P,11,birch?9.5:10.5,birch?7.5:9.6+(v===1?.4:0),birch?8.5:9.4+(v===2?.6:0),pal,sp*7+v*3.3);
      if(sp===3&&se===0)[[5,9],[9,5],[14,8],[8,13],[13,14],[16,11],[11,10],[6,13],[12,4],[15,14],[4,6],[10,16],[17,8]].forEach(([a,b],i)=>{const col=['#f9d3e2','#ffffff','#f39ab8'][(i+v)%3];P(a,b,col);P(a+1,b,col);if(i%2)P(a,b+1,'#ffffff')});   // pommier en fleurs
      else if(sp===3)[[5,9],[9,5],[14,8],[8,13],[13,14],[16,11],[11,10]].forEach(([a,b],i)=>{if((i+v)%4===3||(se===2&&i%2))return;P(a,b,'#e2483b');P(a+1,b,'#c0352b');P(a,b+1,'#c0352b');P(a+1,b+1,'#96261f');P(a,b,'#f08a72')});
    }
    if(snow){if(bare)snowTwig(x,22,30);else snowCap(x,22,30,sp===1?3:2)}
    ART.tree[sp][v]=c}}
  const BP=se===2?['#5a5a22','#7f7a2a','#a39a38','#c9b84e','#e6da84']:se===3?['#27583a','#356f49','#4a875a','#689f70','#93bf92']:['#2a6d3c','#3d8c4d','#57a95f','#7cc777','#b2e59a'];
  ART.bush=[0,1,2].map(v=>{const c=mkc(16,16),x=c.getContext('2d',{willReadFrequently:true}),P=(a,b,col)=>{x.fillStyle=col;x.fillRect(a,b,1,1)};
    x.fillStyle='rgba(20,50,30,.24)';x.beginPath();x.ellipse(8,14.2,6.5,1.8,0,0,7);x.fill();
    artBlob(P,8,8.5,7,6,BP,20+v*5,.7);
    if(v&&se!==3)[[5,9],[10,7],[11,11],[7,5]].forEach(([a,b])=>P(a,b,se===0?(v===1?'#ffffff':'#f39ab8'):v===1?'#e2483b':'#8a6fe0'));if(snow)snowCap(x,16,16,3);return c});
  const mkBush=(pal,dots,seed)=>[0,1,2].map(v=>{const c=mkc(16,16),x=c.getContext('2d',{willReadFrequently:true}),P=(a,b,col)=>{x.fillStyle=col;x.fillRect(a,b,1,1)};
    x.fillStyle='rgba(20,50,30,.24)';x.beginPath();x.ellipse(8,14.2,6.5,1.8,0,0,7);x.fill();artBlob(P,8,8.5,7,6,pal,seed+v*5,.7);
    if(dots&&se!==3)[[4,8],[7,5],[10,7],[11,10],[6,10],[8,8],[12,6],[5,6]].forEach(([a,b],i)=>{const col=dots[(i+v)%dots.length];P(a,b,col);P(a+1,b,col);P(a,b+1,tint(col,-.2));if(i%2)P(a+1,b-1,tint(col,.3))});if(snow)snowCap(x,16,16,3);return c});
  ART.bushR={bretagne:mkBush(['#24603a','#327a48','#449a58','#62b56e','#96d894'],se===1||se===2?['#5f8fe6','#e98ab8','#8f7ae0']:se===0?['#9fd08a']:null,70),
    provence:mkBush(['#55705a','#6b8870','#84a288','#a2bca2','#c4d6c0'],se===1?['#8a6fe0']:null,80),alsace:mkBush(BP,se!==3?['#e2483b','#e9679a']:null,90),auvergne:mkBush(BP,se===0||se===1?['#f2c12e','#f7e36b']:null,100)};
  ART.rock=[0,1].map(v=>{const c=mkc(16,16),x=c.getContext('2d',{willReadFrequently:true}),P=(a,b,col)=>{x.fillStyle=col;x.fillRect(a,b,1,1)};
    x.fillStyle='rgba(20,40,30,.24)';x.beginPath();x.ellipse(8.5,14,6,1.8,0,0,7);x.fill();
    artBlob(P,8,9.5,v?6.5:5.5,v?4.8:4.2,['#5f5b51','#7d786b','#98937f','#b4af9c','#d5d1c0'],40+v*9,.5);if(v)artBlob(P,11.5,11,3,2.6,['#5f5b51','#7d786b','#98937f','#b4af9c','#d5d1c0'],61,.4);
    if(snow)snowCap(x,16,16,2);else{P(5,12,'#6f9a5a');P(6,13,'#5fa854')}return c});
}
