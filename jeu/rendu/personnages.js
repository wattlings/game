/* Wattlings · jeu/rendu/personnages.js
   Dessin des personnages : couleurs de peau, cheveux, tenues, et le sprite en 4 directions. */

const STYLES={court:'Court',long:'Long',queue:'Queue-de-cheval',carre:'Carré',boucle:'Bouclé',afro:'Afro',tresses:'Tresses',couettes:'Couettes',chauve:'Crâne rasé'};
const AVDEF=g=>g==='f'?{g:'f',skin:1,style:'long',hair:1,top:1,bot:0,bt:'jupe'}:{g:'h',skin:1,style:'court',hair:1,top:0,bot:0,bt:'pantalon'};
function avPal(rank,av){const me=!av;av=av||S.av||AVDEF('h');
  const p=av.p?Object.assign({},av.p):{skin:SKINS[av.skin],hair:HAIRC[av.hair],style:av.style,shirt:TOPS[av.top],pants:BOTS[av.bot],skirt:av.bt==='jupe',
    hat:rank===1?'#f2c12e':null,vest:rank===1,jacket:rank===2?'#262b4f':null,tie:rank===2?'#f2a33a':null,lash:av.g==='f'};
  if(me&&S.wololo){const red=p.shirt!=='#c43d3d';p.shirt=red?'#c43d3d':'#2f6db5';p.pants=red?'#6e1f1f':'#1b3f6e';if(p.jacket)p.jacket=red?'#8f2222':'#1d4a82';if(p.hat)p.hat=p.shirt;p.vest=false}
  return p}
const PAL=[0,1,2].map(r=>new Proxy({}, {get:(_,k)=>avPal(r)[k]}));
/* Jambes : ph = phase du cycle (0 debout, 1 pas A, 2 passage, 3 pas B), run = course */
function drawLegs(c,x,y,dir,ph,p,run){
  const skin=p.skin||'#f1c7a1',leg=p.skirt?skin:p.pants,shoe='#222',dark='rgba(0,0,0,.28)';
  const lift=run?2:1,A=ph===1,B=ph===3;
  if(dir==='down'||dir==='up'){
    // vue de face/dos : une jambe s'allonge vers l'avant, l'autre se replie
    const lx=x+5,rx=x+8,w=p.skirt?2:3,rx2=p.skirt?x+9:rx;
    const lh=A?3+lift:B?3-lift:3,rh=B?3+lift:A?3-lift:3;
    const ly=y+12+(B?lift:0),ry=y+12+(A?lift:0);
    R(c,lx,ly,w,lh,leg);R(c,rx2,ry,w,rh,leg);
    R(c,lx,ly+lh-1,w,1,shoe);R(c,rx2,ry+rh-1,w,1,shoe);
    if(A)R(c,rx2,ry,w,1,dark);if(B)R(c,lx,ly,w,1,dark);
  }else{
    // vue de profil : les jambes s'écartent en ciseaux
    const f=dir==='right'?1:-1,sp=A||B?(run?3:2):0,back=B?'front':'back';
    const fx=x+6+f*sp,bx=x+7-f*sp;
    const legB=(A||B)?shade(leg):leg;
    R(c,bx,y+12,3,3,legB);R(c,bx+(f>0?-1:1)*(sp?1:0),y+14,3,1,shoe);
    R(c,fx,y+12,3,3,leg);R(c,fx+(f>0?1:0),y+14,3,1,shoe);
    if(run&&(A||B))R(c,fx+(f>0?2:-1),y+13,1,1,leg);
  }
  if(p.skirt){R(c,x+4,y+11,8,2,p.pants);R(c,x+3,y+12,10,1,p.pants)}
}
/* Le fauteuil roulant, à la place des jambes. temps : 'avant' (sous le corps) ou 'apres' (par-dessus : la roue de profil, le dossier vu de dos).
   Les roues tournent avec le pas. */
function drawChair(c,x,y,dir,ph,p,temps){
  const M='#3a3a44',H='#9aa0a8',skin=p.skin||'#f1c7a1',leg=p.skirt?skin:p.pants,shoe='#222',rot=ph%2;
  if(dir==='down'||dir==='up'){
    if(temps==='avant'){R(c,x+4,y+11,8,2,M);
      if(dir==='down'){R(c,x+5,y+12,2,3,leg);R(c,x+9,y+12,2,3,leg);R(c,x+5,y+14,2,1,shoe);R(c,x+9,y+14,2,1,shoe);R(c,x+4,y+15,8,1,M)}}
    else{if(dir==='up')R(c,x+4,y+8,8,4,M);
      R(c,x+2,y+8,2,8,M);R(c,x+12,y+8,2,8,M);R(c,x+2,y+9+rot*3,2,1,H);R(c,x+12,y+12-rot*3,2,1,H)}   // les deux grandes roues, de face
  }else{const f=dir==='right'?1:-1,ax=x+7;
    if(temps==='avant'){R(c,f>0?ax+1:ax-4,y+11,4,2,leg);R(c,f>0?ax+4:ax-5,y+12,2,3,leg);R(c,f>0?ax+4:ax-5,y+14,2,1,shoe);
      R(c,f>0?ax+3:ax-5,y+15,3,1,M);R(c,f>0?ax+5:ax-6,y+14,1,2,M);   // repose-pieds et petite roue avant
      R(c,f>0?ax-4:ax+4,y+7,1,6,M)}   // le dossier
    else{R(c,ax-2,y+9,5,1,M);R(c,ax-3,y+10,1,5,M);R(c,ax+3,y+10,1,5,M);R(c,ax-2,y+15,5,1,M);R(c,ax,y+11+rot,1,2,H);R(c,ax-1,y+12-rot,3,1,H)}}   // la grande roue, de profil
}
/* une peau assez foncée pour que les yeux s'y perdent */
const peauFoncee=hex=>{const n=parseInt(String(hex).slice(1),16);return !isNaN(n)&&(0.299*(n>>16)+0.587*((n>>8)&255)+0.114*(n&255))<120};
function shade(hex){const n=parseInt(String(hex).slice(1),16);if(isNaN(n))return hex;const r=Math.max(0,(n>>16)-28),g=Math.max(0,((n>>8)&255)-28),b=Math.max(0,(n&255)-28);return `rgb(${r},${g},${b})`}
function drawChar0(c,x,y,dir,frame,p,run,fx){
  x=Math.round(x);y=Math.round(y);const skin=p.skin||'#f1c7a1',hc=p.hair,st=p.style||'court';
  const ph=((frame|0)%4+4)%4,bob=!p.chair&&(ph===1||ph===3)?1:0;
  c.fillStyle='rgba(20,40,30,.24)';c.fillRect(x+3,y+14,10,2);c.fillRect(x+4,y+16,8,1);
  if(dir==='up'&&(st==='long'||st==='tresses'))R(c,x+4,y+5-bob,8,5,hc);
  if(p.chair)drawChair(c,x,y,dir,ph,p,'avant');else drawLegs(c,x,y,dir,ph,p,run);
  if(p.robe){R(c,x+4,y+11,8,4,p.robe);R(c,x+3,y+14,10,1,shade(p.robe))}
  y-=bob+(fx&&fx.idle?1:0);
  const sw=ph===1?1:ph===3?-1:0,sa=run?2:1;
  // tresse/cheveux longs derrière le corps (vue de dos)
  if(dir==='up'&&(st==='long'||st==='tresses'))R(c,x+4,y+5,8,5,hc);
  if(dir==='up'&&st==='tresses')for(let k=0;k<4;k++)R(c,x+5+k*2,y+5,1,6,shade(hc));
  R(c,x+4,y+7,8,p.skirt?5:6,p.shirt);
  if(dir==='down'||dir==='up'){R(c,x+3,y+8-sw*sa,1,4,skin);R(c,x+12,y+8+sw*sa,1,4,skin)}
  else{const f=dir==='right'?1:-1;R(c,x+7+f*sw*sa,y+8,2,4,shade(p.shirt));R(c,x+7+f*sw*sa+(f>0?1:0),y+11,1,1,skin)}
  if(p.stripes)for(let k=0;k<3;k++)R(c,x+4,y+8+k*2,8,1,p.stripes);
  if(p.jacket){if(dir==='up')R(c,x+4,y+7,8,5,p.jacket);else{R(c,x+4,y+7,3,5,p.jacket);R(c,x+9,y+7,3,5,p.jacket)}if(dir==='down'||dir==='up'){R(c,x+3,y+8-sw*sa,1,3,p.jacket);R(c,x+12,y+8+sw*sa,1,3,p.jacket)}}
  if(p.vest){R(c,x+4,y+7,2,5,'#f2c12e');R(c,x+10,y+7,2,5,'#f2c12e');if(dir==='up')R(c,x+4,y+7,8,5,'#f2c12e');R(c,x+4,y+10,8,1,'#e8e4d6')}
  if(p.tie&&dir==='down')R(c,x+7,y+8,2,4,p.tie);
  // tenues de métier : salopette, blouse, tablier, écharpe tricolore, foulard, sacoche, stéthoscope
  if(p.overall){R(c,x+5,y+9,6,4,p.overall);if(dir==='down'||dir==='up'){R(c,x+5,y+7,1,2,p.overall);R(c,x+10,y+7,1,2,p.overall)}}
  if(p.coat){R(c,x+4,y+7,8,7,p.coat);if(dir==='down'){R(c,x+7,y+7,2,4,p.shirt);R(c,x+7,y+11,2,3,shade(p.coat))}if(dir==='down'||dir==='up'){R(c,x+3,y+8-sw*sa,1,3,p.coat);R(c,x+12,y+8+sw*sa,1,3,p.coat)}}
  if(p.apron&&dir!=='up'){if(dir==='down'){R(c,x+5,y+8,6,6,p.apron);R(c,x+7,y+7,2,1,p.apron)}else R(c,x+(dir==='right'?9:4),y+8,3,6,p.apron)}
  if(p.sash&&dir==='down')for(let i=0;i<5;i++){R(c,x+4+i,y+7+i,1,1,'#2f5fb3');R(c,x+5+i,y+7+i,1,1,'#f7f0dc');R(c,x+6+i,y+7+i,1,1,'#c43d3d')}
  if(p.scarf){R(c,x+4,y+7,8,1,p.scarf);if(dir==='down')R(c,x+9,y+8,2,3,p.scarf)}
  if(p.bag){if(dir==='down'){for(let i=0;i<5;i++)R(c,x+10-i,y+7+i,1,1,'#3b3240');R(c,x+3,y+10,4,4,p.bag)}else if(dir!=='up')R(c,x+6,y+10,4,4,p.bag)}
  if(p.stetho&&dir==='down'){R(c,x+6,y+8,1,3,'#333');R(c,x+9,y+8,1,3,'#333');R(c,x+7,y+11,2,1,'#9aa0a8')}
  if(p.chair)drawChair(c,x,y,dir,ph,p,'apres');
  R(c,x+4,y+1,8,7,skin);
  if(st==='chauve'){if(dir!=='up')R(c,x+5,y+1,2,1,'rgba(255,255,255,.35)');else R(c,x+4,y+1,8,2,'rgba(0,0,0,.08)')}
  else if(dir==='up'){R(c,x+4,y+1,8,6,hc);if(st==='queue')R(c,x+7,y+7,2,3,hc);if(st==='carre')R(c,x+4,y+1,8,7,hc);if(st==='boucle'){R(c,x+3,y,10,6,hc)}
    if(st==='afro'){R(c,x+2,y-3,12,9,hc);R(c,x+3,y-4,10,1,hc)}
    if(st==='couettes'){R(c,x+1,y-1,3,3,hc);R(c,x+12,y-1,3,3,hc)}}
  else{
    if(st==='boucle'){R(c,x+3,y-1,10,4,hc);R(c,x+3,y+2,2,3,hc);R(c,x+11,y+2,2,3,hc)}
    else if(st==='afro'){R(c,x+2,y-3,12,6,hc);R(c,x+3,y-4,10,1,hc);if(dir!=='right')R(c,x+2,y+3,2,3,hc);if(dir!=='left')R(c,x+12,y+3,2,3,hc);R(c,x+5,y-3,1,1,shade(hc));R(c,x+10,y-2,1,1,shade(hc))}
    else R(c,x+4,y,8,3,hc);
    if(st==='tresses'){const T=(tx)=>{for(let k=0;k<8;k++)R(c,tx,y+2+k,2,1,k%2?shade(hc):hc)};if(dir!=='right')T(x+3);if(dir!=='left')T(x+11);if(dir==='left')R(c,x+10,y+1,3,8,hc);if(dir==='right')R(c,x+3,y+1,3,8,hc)}
    if(st==='couettes'){if(dir!=='right')R(c,x+1,y-1,3,3,hc);if(dir!=='left')R(c,x+12,y-1,3,3,hc)}
    if(st==='long'){if(dir!=='right')R(c,x+3,y+2,2,7,hc);if(dir!=='left')R(c,x+11,y+2,2,7,hc);if(dir==='left')R(c,x+10,y+1,3,8,hc);if(dir==='right')R(c,x+3,y+1,3,8,hc)}
    if(st==='carre'){if(dir!=='right')R(c,x+3,y+2,2,5,hc);if(dir!=='left')R(c,x+11,y+2,2,5,hc)}
    if(st==='queue'){if(dir==='left')R(c,x+12,y+2,2,5,hc);if(dir==='right')R(c,x+2,y+2,2,5,hc)}
    if(dir==='left'&&st!=='long'&&st!=='tresses')R(c,x+9,y+1,3,4,hc);if(dir==='right'&&st!=='long'&&st!=='tresses')R(c,x+4,y+1,3,4,hc);
    const ey=y+4,eh=fx&&fx.blink?1:2,e0=fx&&fx.blink?ey+1:ey;
    if(eh>1&&peauFoncee(skin)){const W='#efe6da';if(dir==='down'){R(c,x+5,ey+1,1,1,W);R(c,x+10,ey+1,1,1,W)}if(dir==='left')R(c,x+6,ey+1,1,1,W);if(dir==='right')R(c,x+9,ey+1,1,1,W)}   // sur une peau foncée, le blanc de l'œil fait ressortir le regard
    if(dir==='down'){R(c,x+6,e0,1,eh,'#222');R(c,x+9,e0,1,eh,'#222');if(p.lash&&eh>1){R(c,x+5,ey,1,1,'#222');R(c,x+10,ey,1,1,'#222')}}
    if(dir==='left')R(c,x+5,e0,1,eh,'#222');if(dir==='right')R(c,x+10,e0,1,eh,'#222')}
  if(p.beard&&dir!=='up'){if(dir==='down')R(c,x+5,y+6,6,2,p.beard);else R(c,x+(dir==='left'?4:9),y+6,3,2,p.beard)}
  if(p.bun&&st!=='chauve'&&!(p.hat&&(p.hatType==='voile'||p.hatType==='turban')))R(c,x+6,y-2,4,2,hc);
  if(p.hat){const ht=p.hatType;
    if(ht==='helmet'){R(c,x+3,y-1,10,3,p.hat);R(c,x+4,y-2,8,1,p.hat);R(c,x+3,y+2,10,1,shade(p.hat));R(c,x+7,y-2,2,2,'rgba(255,255,255,.4)')}
    else if(ht==='straw'){R(c,x+4,y-2,8,3,p.hat);R(c,x+1,y+1,14,1,p.hat);R(c,x+4,y,8,1,shade(p.hat))}
    else if(ht==='beret'){R(c,x+3,y-1,10,2,p.hat);R(c,x+5,y-2,7,1,p.hat);R(c,x+11,y-3,1,1,p.hat)}
    else if(ht==='coiffe'){R(c,x+5,y-7,6,8,p.hat);R(c,x+5,y-7,1,8,'#fff');R(c,x+10,y-7,1,8,shade(p.hat));R(c,x+4,y,8,1,p.hat);for(let k=0;k<3;k++)R(c,x+6,y-6+k*2,4,1,shade(p.hat))}
    else if(ht==='bonnet'){R(c,x+3,y-1,10,3,p.hat);R(c,x+4,y-2,8,1,p.hat);R(c,x+3,y+1,10,1,'#f7f0dc');R(c,x+7,y-4,2,2,'#f7f0dc')}
    else if(ht==='noeud'){R(c,x+1,y-4,6,5,p.hat);R(c,x+9,y-4,6,5,p.hat);R(c,x+6,y-2,4,3,p.hat);R(c,x+2,y-3,2,1,'#3a3a44');R(c,x+12,y-3,2,1,'#3a3a44')}
    else if(ht==='voile'){const v=p.hat,d=shade(v);   // le voile couvre les cheveux et le cou, le visage reste dégagé
      if(dir==='up'){R(c,x+3,y-1,10,10,v);R(c,x+4,y+7,8,2,d)}
      else{R(c,x+3,y-1,10,3,v);R(c,x+4,y-2,8,1,v);
        if(dir!=='right')R(c,x+3,y+1,2,8,v);if(dir!=='left')R(c,x+11,y+1,2,8,v);
        if(dir==='left')R(c,x+9,y+1,4,8,v);if(dir==='right')R(c,x+3,y+1,4,8,v);
        R(c,x+4,y+7,8,2,v);R(c,x+3,y+8,10,1,d);if(dir==='down')R(c,x+5,y+1,6,1,d)}}
    else if(ht==='turban'){R(c,x+3,y-3,10,5,p.hat);R(c,x+4,y-4,8,1,p.hat);R(c,x+3,y+1,10,1,shade(p.hat));
      if(dir!=='up'){for(let k=0;k<4;k++)R(c,x+4+k*2,y-3+k,2,1,shade(p.hat))}}
    else if(ht==='kippa'){R(c,x+5,y-1,6,1,p.hat);R(c,x+6,y-2,4,1,p.hat)}
    else if(ht==='toque'){R(c,x+4,y-4,8,5,p.hat);R(c,x+3,y-5,10,3,p.hat);R(c,x+4,y,8,1,shade(p.hat))}
    else{R(c,x+3,y,10,3,p.hat);R(c,x+4,y-1,8,1,p.hat);if(ht==='cap'){if(dir==='down')R(c,x+4,y+2,8,1,shade(p.hat));if(dir==='left')R(c,x+1,y+2,4,1,p.hat);if(dir==='right')R(c,x+11,y+2,4,1,p.hat)}}}
  if(p.glasses&&dir!=='up'){R(c,x+5,y+4,6,1,'#222')}
  // ce que le personnage tient à la main
  if(p.prop==='umbrella'){   // le parapluie est centré sur son manche, tenu dans la main : la toile déborde du côté de cette main
    const u=p.umb||'#c43d3d',hx=dir==='left'||dir==='up'?x+3:x+12,hi=tint(u,.25),lo=tint(u,-.18),M='#3a3a44';
    R(c,hx,y-4,1,13,M);R(c,hx,y+9,2,1,M);R(c,hx,y-9,1,1,M);
    R(c,hx-4,y-8,9,1,hi);R(c,hx-6,y-7,13,2,u);R(c,hx-5,y-7,5,1,hi);R(c,hx-7,y-5,15,1,lo);
    [-7,-4,3,6].forEach(k=>R(c,hx+k,y-4,k<0?2:2,1,tint(u,-.3)))}
  else if(p.prop&&dir!=='up'){const hx=dir==='left'?x+1:x+12,hy=y+9,pr=p.prop;
    if(pr==='clipboard'){R(c,hx-1,hy,4,5,'#f7f0dc');R(c,hx,hy+1,2,1,'#5b6380');R(c,hx,hy+3,2,1,'#5b6380')}
    else if(pr==='tablet'){R(c,hx-1,hy,4,4,'#1c2440');R(c,hx,hy+1,2,2,'#2aa198')}
    else if(pr==='wrench'){R(c,hx+1,hy-3,1,7,'#9aa0a8');R(c,hx,hy-4,3,2,'#c4c9cf')}
    else if(pr==='lantern'){R(c,hx,hy+1,3,4,'#f2c12e');R(c,hx,hy,3,1,'#333');R(c,hx+1,hy+2,1,2,'#fff7c2')}
    else if(pr==='book'){R(c,hx-1,hy+1,4,3,'#c0503a');R(c,hx-1,hy+2,4,1,'#f7f0dc')}
    else if(pr==='cane'){R(c,hx+1,hy-1,1,8,'#6b4a2b');R(c,hx,hy-1,2,1,'#6b4a2b')}
    else if(pr==='baguette'){R(c,hx,hy-4,2,9,'#d9a55a');R(c,hx,hy-2,2,1,'#b8864a');R(c,hx,hy+1,2,1,'#b8864a')}
    else if(pr==='rod'){R(c,hx+1,hy-10,1,14,'#6b4a2b');R(c,hx+2,hy-10,1,5,'#e8e8e8')}
    else if(pr==='broom'){R(c,hx+1,hy-5,1,10,'#a07845');R(c,hx,hy+4,3,3,'#e3cf98')}
    else if(pr==='case'){R(c,hx-1,hy+2,5,4,'#6b4a2b');R(c,hx+1,hy+1,1,1,'#333')}
    else if(pr==='crook'){R(c,hx+1,hy-9,1,14,'#8a6538');R(c,hx,hy-10,2,1,'#8a6538');R(c,hx-1,hy-9,1,2,'#8a6538')}
    else if(pr==='basket'){R(c,hx-1,hy+2,5,4,'#b98d57');R(c,hx-1,hy+2,5,1,'#dcb682');R(c,hx,hy,3,1,'#86602f');R(c,hx,hy+1,2,1,'#e2483b');R(c,hx+2,hy+1,1,1,'#9ac23a')}
    else if(pr==='bretzel'){R(c,hx-1,hy,5,1,'#b8742a');R(c,hx-1,hy,1,4,'#b8742a');R(c,hx+3,hy,1,4,'#b8742a');R(c,hx-1,hy+3,5,1,'#b8742a');R(c,hx+1,hy+1,1,2,'#8a5220')}
    else if(pr==='boule'){R(c,hx,hy+2,3,3,'#8e949d');R(c,hx,hy+2,1,1,'#e9ecf0')}
    else if(pr==='net'){R(c,hx+1,hy-8,1,12,'#a07845');R(c,hx-1,hy-12,5,5,'rgba(255,255,255,.65)')}
    else if(pr==='leash'){R(c,hx+1,hy+1,1,1,'#333');R(c,hx+2,hy+2,1,2,'#333')}
    else if(pr==='plan'){R(c,hx-1,hy,5,4,'#e8f0f7');R(c,hx,hy+1,3,1,'#2f6db5');R(c,hx,hy+2,2,1,'#2f6db5')}}
}
