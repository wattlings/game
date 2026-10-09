/* Wattlings · jeu/recit/clins-d-oeil.js
   Clins d'œil aux jeux vidéo et mode Hadès. */

/* ================= CLINS D'ŒIL AUX JEUX VIDÉO & MODE HADÈS ================= */
const egg=(id,lines,cb)=>secret(id,lines,cb);

/* ---- Mode Hadès : il faut tout demander deux fois aux personnages ---- */
const HADES_LINES=[
  "Hmm ? Ah. C'est à moi que tu parles. Dommage.",
  "Une question. Quelle audace, pour quelqu'un qui n'a manifestement pas réfléchi avant.",
  "Tu vois cette tête ? C'est celle de quelqu'un qui s'en fiche.",
  "J'ai connu des compteurs en panne plus pertinents que toi.",
  "Tu as pensé à chercher tout seul ? Non. Bien sûr que non.",
  "Je pourrais te répondre. Mais ce serait t'encourager.",
  "C'est noté. Dans la corbeille, entre deux audits que personne n'a lus.",
  "Encore toi. J'espérais une coupure de courant.",
  "On m'a déjà posé une question aujourd'hui. Elle était meilleure.",
  "Il paraît qu'il n'y a pas de question stupide. Tu viens de faire avancer la science.",
  "C'est écrit dans le cours. Avec des images, même. Pour les gens comme toi.",
  "Ton silence avait un excellent rendement. Tu viens de le dégrader.",
  "Cinq ans d'études pour entendre ça. J'aurais dû faire dentiste : là, au moins, les gens se taisent.",
  "Si la bêtise se facturait au kWh, tu serais mon plus gros client.",
  "À chaque fois que tu ouvres la bouche, un kilowattheure meurt pour rien.",
  "Tu consommes beaucoup d'attention pour ne rien produire. On appelle ça un talon.",
  "Je classe les gens en deux catégories : les utiles, et toi.",
  "Parle à ma main. Elle a un meilleur facteur de puissance que toi.",
  "Tu es une dérive. Personne ne t'a encore détecté, voilà tout.",
  "Je te répondrais bien, mais j'ai une vie intérieure à entretenir, et tu n'y figures pas.",
  "S'il pleuvait de la soupe, tu serais le premier à sortir ta fourchette.",
  "Tu deviens de plus en plus difficile à sous-estimer.",
  "Tu serais incapable de vider l'eau d'une botte, même si les instructions étaient sous la semelle.",
  "T'es rare. C'est précieux.",
  "Ta différence, c'est ta force.",
  "Tu aides beaucoup à l'estime de soi de tes collègues."
];
const HAD={ok:null,der:-1};
function hadesBlock(o){
  if(!S.hades||o.noHades)return false;
  const key=S.map+':'+(S.inside||'')+':'+o.x+','+o.y;
  if(HAD.ok===key){HAD.ok=null;return false}
  const n=S.hadesN||0,L=HADES_LINES,k=n<L.length?n:(r=>r>=HAD.der?r+1:r)(Math.floor(Math.random()*(L.length-1))),line=L[k];HAD.der=k;   // une fois toutes dites : au hasard, jamais deux fois de suite la même
  S.hadesN=n+1;HAD.ok=key;save();
  const who=o.who||(o.sid&&SRC[o.sid]&&SRC[o.sid].who)||'…';
  say([{w:who,t:line}]);return true;
}

/* ---- Metal Gear Solid : le carton ---- */
const BOX={on:false,origin:L.box,guard:null,since:0,lastMove:0};
const GUARD_PATH=L.guard;
function enterBox(){
  if(BOX.on)return;
  egg('mgs',["Un grand carton vide, posé là sans raison apparente.","Tu te glisses dessous. Parfait : plus personne ne peut te voir. Tu peux même marcher avec. (A pour en sortir.)"],()=>{
    BOX.on=true;BOX.since=tick;P.runToggle=false;
    BOX.guard={x:L.guard[1][0]*TS,y:L.guard[1][1]*TS,i:1,dir:'up',state:'patrol',wait:0,frame:0};
    toast('Quelqu’un approche…')});
}
function leaveBox(found){
  BOX.on=false;BOX.guard=null;
  if(found){P.x=BOX.origin[0];P.y=BOX.origin[1]+1;P.px=P.x*TS;P.py=P.y*TS;P.dir='up';P.moving=false;S.x=P.x;S.y=P.y;fadeIn()}
}
function updateGuard(k){
  const g=BOX.guard;if(!g||!BOX.on)return;if(dlg.open||busy)return;
  if(P.moving)BOX.lastMove=tick;
  const gx=Math.round(g.x/TS),gy=Math.round(g.y/TS);
  const step=(tx,ty,sp)=>{const dx=tx-g.x,dy=ty-g.y;if(Math.abs(dx)>0.5){g.x+=Math.sign(dx)*Math.min(sp,Math.abs(dx));g.dir=dx>0?'right':'left'}else if(Math.abs(dy)>0.5){g.y+=Math.sign(dy)*Math.min(sp,Math.abs(dy));g.dir=dy>0?'down':'up'}else return true;g.frame+=sp/4;return false};
  if(g.state==='patrol'){
    if(g.wait>0){g.wait-=k;if(g.wait<60&&g.wait>58)g.dir=['left','right','up','down'][Math.floor(Math.random()*4)]}
    else{const [tx,ty]=GUARD_PATH[g.i];if(step(tx*TS,ty*TS,0.9*k)){g.i=(g.i+1)%GUARD_PATH.length;g.wait=90}}
    // repérage : seulement si le carton BOUGE dans son champ de vision
    const [dx,dy]=DIRS[g.dir],moving=tick-BOX.lastMove<12;
    if(moving&&Math.abs(gx-P.x)+Math.abs(gy-P.y)<=1){g.state='alert';g.wait=45;sfx('bad')}
    else if(moving)for(let n=1;n<=5;n++){const x=gx+dx*n,y=gy+dy*n;if(x===P.x&&y===P.y){g.state='alert';g.wait=45;sfx('bad');break}const t=tileAt(x,y);if(t===undefined||SOLID.has(t))break}
    if(g.state==='patrol'&&tick-BOX.since>60*50){BOX.guard=null;say([{w:'Vigile',t:"Rien. Ce doit être mon imagination."},{t:"Le vigile s'éloigne. Tu restes seul avec ton carton et ta dignité."}])}
  }else if(g.state==='alert'){g.wait-=k;g.dir=Math.abs(P.px-g.x)>Math.abs(P.py-g.y)?(P.px>g.x?'right':'left'):(P.py>g.y?'down':'up');if(g.wait<=0)g.state='chase'}
  else if(g.state==='chase'){
    const tx=P.px,ty=P.py;if(Math.abs(tx-g.x)+Math.abs(ty-g.y)<=TS+2||step(tx,ty,2.6*k)){g.state='caught';
      say([{w:'Vigile',t:"Un carton qui marche. Tu croyais vraiment que ça passerait ?"},{t:"Tu es découvert ! Retour à la case départ, à côté du carton."}],()=>leaveBox(true))}
  }
}
function drawBoxPlayer(c,x,y,moving,frame){
  x=Math.round(x);y=Math.round(y);const b=moving&&frame%2?1:0;
  c.fillStyle='rgba(0,0,0,.22)';c.fillRect(x+1,y+14,14,2);
  if(moving){R(c,x+4,y+13,3,2,'#222');R(c,x+9,y+13,3,2,'#222')}
  R(c,x+1,y+2-b,14,12,'#b08a5a');R(c,x+1,y+2-b,14,2,'#c9a26e');R(c,x+1,y+12-b,14,2,'#8f6d42');R(c,x+7,y+2-b,2,12,'#d9c08e');R(c,x+4,y+7-b,3,1,'#5a4326');R(c,x+10,y+7-b,3,1,'#5a4326');
}
function drawGuard(c,ox,oy){
  const g=BOX.guard;if(!g)return;const X=g.x-ox,Y=g.y-oy-2;
  drawChar(c,X,Y,g.dir,Math.floor(g.frame),GUARD_PAL,g.state==='chase');
  if(g.state==='alert'||g.state==='chase'){R(c,Math.round(X)+5,Math.round(Y)-12,6,10,'#fff');R(c,Math.round(X)+7,Math.round(Y)-11,2,5,'#c43d3d');R(c,Math.round(X)+7,Math.round(Y)-5,2,2,'#c43d3d')}
}

/* ---- objets et personnages des clins d'œil ---- */
const WC3={n:0},TREE={n:0};
function eggObjs(id,o){
  if(id==='town'){
    if(!BOX.on)o.push({x:BOX.origin[0],y:BOX.origin[1],kind:'cbox',solid:1,act:enterBox});
    o.push({x:TP(41,60)[0],y:TP(41,60)[1],kind:'npc',solid:1,noHades:1,who:'Voyageur',pal:{skin:'#6f9f4f',shirt:'#6b4a2b',pants:'#3a3028',hair:'#1c1c1c',style:'queue'},dir:'right',act:()=>egg('wow',[{w:'Voyageur',t:'KEK'}])});
    o.push({x:TP(23,19)[0],y:TP(23,19)[1],kind:'npc',solid:1,noHades:1,who:'Prêtre',pal:{shirt:'#ece6d6',pants:'#ece6d6',robe:'#ece6d6',hair:'#9a9aa2',style:'chauve'},dir:'down',act:()=>{S.wololo=!S.wololo;save();egg('aoe',[{w:'Prêtre',t:'Wololo'}])}});
    o.push({x:TP(4,19)[0],y:TP(4,19)[1],kind:'sheep',solid:1,act:()=>egg('spyro',[{w:'Mouton',t:'Bêêê.'},{t:"Il jette des regards inquiets vers le ciel, comme si un petit dragon violet pouvait surgir à tout moment pour lui foncer dessus."}])});
    o.push({x:L.trees[0][0],y:L.trees[0][1],kind:'none',act:()=>{TREE.n++;if(TREE.n<4)return say([{t:["Tu frappes l'arbre à mains nues. Il ne se passe rien.","Tu frappes encore. Des fissures apparaissent. Étrange.","Encore un coup. Ça vient."][TREE.n-1]}]);TREE.n=0;
      egg('minecraft',["Un bloc de bois parfaitement cubique tombe au sol.","Tu n'as pas d'établi. Tu le reposes, un peu déçu."])}});
    // la piscine de la villa
    for(let y=POOL.y0;y<=POOL.y1;y++)for(let x=POOL.x0;x<=POOL.x1;x++)o.push({x,y,kind:'none',act:poolSay});
  }
  if(id==='local'&&S.inside==='villa'){
    const up=()=>{S.inside='villaUp';warp('local',5,6,'up');toast('À l’étage')};
    o.push({x:9,y:1,kind:'stairup',act:up,go:up},{x:1,y:2,kind:'sofa',solid:1},{x:2,y:2,kind:'sofa',solid:1},{x:4,y:2,kind:'shelf',solid:1},{x:1,y:6,kind:'plant',solid:1},{x:6,y:5,kind:'readtable',solid:1},{x:7,y:5,kind:'readtable',solid:1});
    o.push({x:3,y:4,kind:'npc',solid:1,noHades:1,who:'Habitante',pal:{shirt:'#e57399',pants:'#6d7896',hair:'#b8431f',style:'queue',lash:1},dir:'down',act:()=>say([{w:'Habitante',t:"Glarbo fenni wazoup ! Tiba dou vrenka somblé, yip narado frouli meshabou. Krimpa lo zavouni ?"},{t:"Tu ne comprends pas un mot. Elle désigne la piscine par la fenêtre, puis hausse les épaules."}])});
    o.push({x:7,y:3,kind:'npc',solid:1,noHades:1,who:'Habitant',pal:{shirt:'#2f6db5',pants:'#c9b28a',hair:'#2b1d14'},dir:'left',act:()=>say([{w:'Habitant',t:"Oublaï ! Fretch nabito klou, grémi sportalou vinz. Habada tchoup, habada tchoup ! Mirglo."}])});
    o.push({x:8,y:5,kind:'npc',solid:1,noHades:1,who:'Invité',pal:{shirt:'#2f9e7a',pants:'#2c2c34',hair:'#d9a441',style:'boucle'},dir:'left',act:()=>say([{w:'Invité',t:"Zib zib ? Arkélou fromba dinni, plou vachtaï ! Grenko mi sabloune, ooh, yébi sprou."}])});
  }
  if(id==='local'&&S.inside==='villaUp'){
    const cc=()=>say([{t:"Quelque chose bouge sous la couette."},{w:'Couette',t:"Crac crac."}]);
    o.push({x:5,y:7,kind:'stairdown'},{x:4,y:3,kind:'duvet',solid:1,act:cc},{x:5,y:3,kind:'none',solid:1,act:cc},{x:1,y:2,kind:'plant',solid:1},{x:8,y:2,kind:'shelf',solid:1},{x:9,y:6,kind:'plant',solid:1});
  }
  if(id==='cave'){
    o.push({x:7,y:6,kind:'nitro',solid:1,act:()=>egg('crash',["Une caisse marquée « NITRO ». Elle tressaute toute seule.","Tu décides sagement de ne pas sauter dessus. Les autres caisses, elles, te donnent une envie irrépressible de tournoyer."])});
    o.push({x:10,y:1,kind:'conduit',act:()=>egg('metroid',["Un conduit de ventilation, large comme un ballon.","Il faudrait pouvoir se rouler en boule pour passer. Tu n'as pas (encore) cet équipement. Au fond, quelque chose brille : une réserve d'énergie."])});
    o.push({x:6,y:1,kind:'crack',act:()=>egg('castlevania',["Ce pan de mur sonne creux. Tu donnes un coup dedans.","Derrière les briques : un poulet rôti, encore tiède. Tu ne poses pas de questions."])});
  }
  if(id==='mairie')o.push({x:10,y:1,kind:'painting',act:()=>egg('mario64',["Un grand tableau, dont la surface ondule légèrement.","Tu prends ton élan et tu sautes dedans. Tu te cognes. Ce n'est pas ce genre de château."])});
  if(id==='local'&&S.inside==='maison')o.push({x:1,y:5,kind:'oldpc',solid:1,act:()=>egg('adibou',["Un vieil ordinateur beige. Dans le lecteur, un CD-ROM éducatif pour les 4-7 ans.","Au menu : jardiner, cuisiner un gâteau, apprendre à lire. Pas un mot sur les kWh. Une lacune."])});
}
const eggDofus=()=>egg('dofus',["Sur l'étal, une ardoise : « Tomates : 3 kamas le kilo. »","En dessous, à la craie : « Dernier client : un guerrier très pressé, qui a foncé sans lire le mandat. »"]);
const eggWii=()=>egg('wii',[{w:'Télé',t:"« … et le thermostat connecté qui ne se connectait qu’à la box du voisin. Retour à la météo. »"},{t:"Tu changes de chaîne. Une console blanche est branchée dessous."},{w:'Télé',t:"« Avant de jouer, attache bien la dragonne à ton poignet. »"},{t:"Une petite fissure en bas de l'écran suggère que quelqu'un ne l'a pas fait."},{w:'Télé',t:"« Ton âge sportif est de 67 ans. »"}]);
function eggArtisan(){WC3.n++;if(WC3.n===1)return false;
  if(WC3.n===2){egg('wc3',[{w:'Artisan',t:'Encore du travail ?'}]);return true}
  say([{w:'Artisan',t:['Oui, chef ?','D’accord, d’accord…','Arrête de me tapoter l’épaule, je travaille !','Si tu continues, je te facture le déplacement.'][(WC3.n-3)%4]}]);return true}
function eggGardien(){if(S.ch!==7)return false;egg('zelda',[{w:'Gardien de l’école',t:"Il est dangereux de partir seul. Prends ceci."},{t:"Il te tend une lampe torche. Les piles datent de 2019, mais c'est l'intention qui compte."}]);return true}
SRC.artisan.egg=eggArtisan;SRC.gardien.egg=eggGardien;
const eggSmash=cb=>egg('smash',["Victoire sans une égratignure : 0 % de dégâts.","Du ciel, une voix grave hurle « GAME ! ». Tu ressens l'envie soudaine de refaire exactement la même chose, très vite, sans objets, sur un terrain parfaitement plat."],cb);
/* dessins des objets des clins d'œil */
function drawEgg(c,o,X,Y,t){
  switch(o.kind){
    case 'cbox':c.fillStyle='rgba(0,0,0,.22)';c.fillRect(X+1,Y+14,14,2);R(c,X+1,Y+3,14,12,'#b08a5a');R(c,X+1,Y+3,14,2,'#c9a26e');R(c,X+1,Y+13,14,2,'#8f6d42');R(c,X+7,Y+3,2,12,'#d9c08e');R(c,X+4,Y+8,3,1,'#5a4326');R(c,X+10,Y+8,3,1,'#5a4326');return true;
    case 'sheep':{const b=(t>>5)%2;c.fillStyle='rgba(0,0,0,.2)';c.fillRect(X+2,Y+14,12,2);R(c,X+4,Y+12,2,3,'#3a3530');R(c,X+10,Y+12,2,3,'#3a3530');R(c,X+2,Y+6,12,7,'#f4f1e8');R(c,X+3,Y+5,10,1,'#f4f1e8');R(c,X+3,Y+13,10,1,'#dcd8cc');R(c,X+11,Y+4+b,5,5,'#3a3530');R(c,X+13,Y+6+b,1,1,'#fff');R(c,X+10,Y+4+b,2,2,'#3a3530');return true}
    case 'nitro':{const j=(t%90)<8?((t>>1)%2?-1:1):0;R(c,X+1+j,Y+2,14,13,'#8a6a3e');R(c,X+1+j,Y+2,14,1,'#b08a5a');R(c,X+1+j,Y+5,14,2,'#5d5048');R(c,X+1+j,Y+11,14,2,'#5d5048');R(c,X+3+j,Y+5,1,2,'#c9d3de');R(c,X+12+j,Y+5,1,2,'#c9d3de');R(c,X+3+j,Y+11,1,2,'#c9d3de');R(c,X+12+j,Y+11,1,2,'#c9d3de');return true}
    case 'conduit':R(c,X+2,Y+3,12,10,'#6d7480');R(c,X+3,Y+4,10,8,'#15181f');for(let i=0;i<4;i++)R(c,X+3,Y+5+i*2,10,1,'#3a404a');if((t>>4)%5===0)R(c,X+10,Y+9,2,2,'#f2c12e');return true;
    case 'crack':R(c,X+7,Y+2,1,3,'#3a3530');R(c,X+8,Y+4,1,3,'#3a3530');R(c,X+6,Y+6,2,1,'#3a3530');R(c,X+6,Y+7,1,3,'#3a3530');R(c,X+7,Y+9,1,3,'#3a3530');R(c,X+9,Y+6,2,1,'#3a3530');R(c,X+10,Y+7,1,2,'#3a3530');return true;
    case 'painting':{R(c,X,Y+1,16,13,'#b8862f');R(c,X+1,Y+2,14,11,'#8f6420');for(let y=0;y<9;y++){const w=Math.round(Math.sin(t/14+y*.9)*1.2);R(c,X+2,Y+3+y,12,1,y<4?'#8ec9e8':y<6?'#5aa85a':'#3f8a4a');R(c,X+5+w,Y+3+y,3,1,y<4?'#b5def2':'#6fbf6f')}R(c,X+9,Y+4,2,2,'#fff6c0');return true}
    case 'stairup':R(c,X,Y,16,16,'#3b3240');for(let i=0;i<4;i++)R(c,X+1+i,Y+1+i*4,14-i*2,3,'#b9a88a');return true;
    case 'stairdown':R(c,X,Y,16,16,'#3b3240');for(let i=0;i<4;i++)R(c,X+1,Y+1+i*4,14,2,i%2?'#6d5d4d':'#86735f');return true;
    case 'duvet':{R(c,X,Y-4,32,6,'#6b4a2b');R(c,X+1,Y+2,30,13,'#f4f1e8');R(c,X+3,Y+2,11,5,'#fff');R(c,X+18,Y+2,11,5,'#fff');R(c,X+1,Y+7,30,8,'#c0503a');R(c,X+1,Y+7,30,1,'#e8e4d6');R(c,X+1,Y+14,30,1,'#8f3327');
      const bx=X+12+Math.round(Math.sin(t/9)*6),up=(t>>2)%2;R(c,bx,Y+6-up,9,4,'#c0503a');R(c,bx+1,Y+5-up,7,1,'#d1614b');R(c,bx+9,Y+8,2,2,'#a84433');return true}
    case 'oldpc':R(c,X,Y+10,16,6,'#8a5f36');R(c,X+2,Y,12,10,'#d9cfb8');R(c,X+3,Y+1,10,7,'#22303a');R(c,X+4,Y+2,8,5,(t>>5)%2?'#3f8a6a':'#4a9a78');R(c,X+5,Y+3,2,2,'#f2c12e');R(c,X+9,Y+4,2,2,'#e2573b');R(c,X+10,Y+8,3,1,'#9a917c');R(c,X+3,Y+11,10,2,'#cfc5ae');return true;
  }
  return false;
}

/* ---- la piscine sans échelle ---- */
const POOL_LINE=[{t:"On dirait que quelqu'un a retiré l'échelle, classique."}];
function poolSay(){egg('sims',POOL_LINE)}
function drawSwimmer(c,ox,oy,t){
  const L=(POOL.x1-POOL.x0+1)*TS-30,per=L*2,u=(t*.45)%per,right=u<L,sx=POOL.x0*TS+8+(right?u:per-u),sy=(POOL.y0+POOL.y1+1)*TS/2-5;
  const X=Math.round(sx-ox),Y=Math.round(sy-oy),st=(t>>3)%2,f=right?1:-1;
  c.fillStyle='rgba(255,255,255,.55)';c.fillRect(X-f*6+(f>0?0:8),Y+7,6,1);c.fillRect(X-f*10+(f>0?0:8),Y+9,5,1);
  R(c,X+2,Y+6,10,3,'#f1c7a1');R(c,X+(f>0?9:-1),Y+(st?4:7),6,2,'#f1c7a1');R(c,X+(f>0?-1:9),Y+(st?7:4),6,2,'#f1c7a1');
  R(c,X+4,Y+1,6,6,'#f1c7a1');R(c,X+4,Y,6,3,'#5a3a22');R(c,X+(f>0?8:5),Y+4,1,1,'#222');
  c.fillStyle='rgba(184,236,250,.9)';c.fillRect(X+1,Y+9,12,1);
}
