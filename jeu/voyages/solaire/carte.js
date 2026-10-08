/* Wattlings · jeu/voyages/solaire/carte.js
   Centrale solaire de Saint-Photon : le plan du site, et tout ce qui est posé dessus (personnages, objets, sources d'information).
   Les textes sont dans textes.js, les dessins dans dessins.js, les simulations dans simulations.js. */

voyCarte('solaire',{
  nom:'Centrale solaire de Saint-Photon',depart:[22,26],region:'provence',
  /* ---- pour la carte (touche K) : le nom des endroits du site. r : le rectangle [x0,y0,x1,y1] ; t, d : ce que dit l'encart ; e : l'étiquette écrite sur le plan ---- */
  zones:[
    {r:[20,1,23,2],t:"Poste de livraison",d:"La porte de sortie du site : toute la production passe par ici avant de rejoindre le réseau. Mme Zénith y monte la garde."},
    {r:[18,3,26,9],t:"Zone technique",d:"Onduleurs, transformateur, supervision : c'est ici que le courant continu des modules devient celui du réseau.",e:"ZONE TECHNIQUE",ey:10},
    {r:[2,3,17,18],t:"Champ ouest : panneaux fixes",d:"Des rangées plein sud, inclinées une fois pour toutes. Les brebis tondent dessous, sans préavis de grève.",e:"PANNEAUX FIXES"},
    {r:[27,3,41,15],t:"Champ est : trackers",d:"Des rangées qui pivotent d'est en ouest pour suivre le soleil. Mlle Azimut tient le pupitre.",e:"TRACKERS"},
    {r:[12,21,21,25],t:"Espace d'accueil",d:"La vitrine, la maquette, M. Crête et son module : tout ce qu'on peut toucher sans se faire gronder.",e:"ACCUEIL",ey:20},
    {r:[13,26,31,28],t:"Halte de Saint-Photon-les-Cigales",d:"Le train du retour attend à quai. Le chef de halte aussi, mais lui, on le paie pour ça.",e:"HALTE",ey:29},
    {r:[28,22,41,25],t:"Champ de lavande",d:"Le champ de M. Riverain. Lui aussi récolte du soleil, mais en flacons.",e:"LAVANDE",ey:26},
    {r:[0,27,43,28],t:"Voie ferrée",d:"La ligne d'Ampère-sur-Loire. Elle passe par Lyon et Avignon, puis elle monte dans les collines."},
    {c:'=',t:"Chemin du site",d:"Il relie la halte, les deux champs et la zone technique. On ne peut pas se perdre. Certains y arrivent quand même."}],
  ailleurs:["La garrigue","Du thym, des cailloux, des cigales. Rendement électrique : nul. Rendement sonore : remarquable."],
  /* ---- le plan : 44 cases sur 30. Chaque caractère est une case ; la légende est juste en dessous ---- */
  plan:[
    'TTTTTTTTTTTTTTTTTTTTTkTTTTTTTTTTTTTTTTTTTTTT',
    'TT.u.T.k.u..T..u..T.WWWW.T.u..T.k.u..T..u.TT',
    'T...................WWWW..................kT',
    'T.ffffffffffffffffgggggggg.fffffffffffffff.T',
    'T.f..............fgggggggg.f.............f.T',
    'Tuf.ppppp..ppppp.fgggggggg.f.x.x....x.x..f.T',
    'T.f..............fgggggggg.f.x.x....x.x..f.T',
    'T.f.ppppp..ppppp.fgggggggg.f.x.x....x.x..fTT',
    'T.f..............fgggggggg.f.x.x....x.x..f.T',
    'TTf.ppppp..ppppp.fgggggggg.f.x.x....x.x..f.T',
    'T.f..............f...==....f.x.x....x.x..f.T',
    'T.f.ppppp..ppppp.f.u.==...Tf.x.x....x.x..f.T',
    'T.f..............f...==.T..f.x.x....x.x..fuT',
    'T.f.ppppp..ppppp.f.T.==....f.............f.T',
    'Tuf..............f...==..u.f.............f.T',
    'T.f.ppppp..ppppp.f...==....ffffff==fffffff.T',
    'T.f..............f.T.==..........==........T',
    'T.f..............fk..==.u......u.==.T...T..T',
    'Tkfffffff==fffffff...==..........==...u...TT',
    'T...====================================.k.T',
    'T...====================================...T',
    'TT...................==..k....T...........TT',
    'T....u.....u.dddddddd==...T.mmmmmm.mmmmmm..T',
    'T..T...k.....dddddddd==.....llllllllllllll.T',
    'T.u.....T....dddddddd==.....llllllllllllllTT',
    'TT..k.....T..........==.....llllllllllllll.T',
    'T.T...T..u.k.qqqqqqqqqqqqqqqqqq..u..T..u.T.T',
    'RRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRR',
    'rrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr',
    '..u...k..u.....u....k....u......u..k....u...'],
  /* ---- la légende : ce que dessine chaque caractère (les pinceaux sont dans voyages/peinture.js, ceux du site dans dessins.js) ----
     On marche sur : . garrigue   = chemin   g gravier   d dalles   q quai   l lavande
     On bute contre : T arbre   u buisson   k rocher   m muret   f grillage   p panneaux fixes   x trackers   W poste de livraison   R r voie */
  legende:{'.':'herbe','=':'chemin',g:'gravier',d:'dalles',q:'quai',l:'lavande',T:'arbre',u:'buisson',k:'rocher',m:'muret',f:'grillage',R:'bordQuai',r:'rails',
    p:SOLP.rangee,x:SOLP.piedTracker,W:{sol:'gravier',pose:SOLP.poste}},
  /* la garrigue : une herbe sèche, des cailloux clairs, du thym en fleur */
  teintes:{herbe:['#c9bd78','#d2c682','#dacf8e'],brin:['#9aa45a','#e6dca0'],chemin:['#ead9ac','#d3bf8a','#bfa870','#f7efd8'],pierre:['#e0d6ba','#b3a78a','#f4eeda']},
  fleur:'#a98bf0',pierres:['#d2a56c','#deb47c','#c2955c','#e8c490','#f2d8ac','#7a5a30'],
  /* cyprès en lisière, oliviers autour de la lavande, chênes verts ailleurs */
  essence:(x,y,h)=>x>25&&y>15?5:x===0||x===43||y===0?(h>.3?4:0):h>.55?4:h>.25?5:0,

  objectif(){
    const sid='solaire',S0=VOY.sites[sid],m=voyClesManquantes(sid),n=voyInfosVues(sid).length,N=S0.infos.length,C=S0.infos.filter(f=>f.cle).length;
    if(voyTampon(sid))return n<N?`Tampon obtenu ! Il reste ${N-n} information${N-n>1?'s':''} à dénicher sur le site. Le train du retour attend à la halte, au sud.`:"Site visité de fond en comble. Le train du retour attend à la halte, au sud.";
    if(m.length)return `Centrale solaire : explore le site et réunis les infos clés (${C-m.length}/${C}). Prochaine piste : ${m[0].ou}.`;
    return "Infos clés réunies : Mme Zénith t'attend devant le poste de livraison, tout au nord du chemin.";
  },
  /* où pointent les flèches : les sources des informations clés encore manquantes, puis Mme Zénith */
  cibles(){return voyCibles('solaire',{effet:[14,22],module:[19,22],productible:[20,25],batiment:[16,22],onduleur:[20,7],cloche:[23,9]},[23,3])},
  apres(c,ox,oy){voyLumiere(c,ox,oy)},

  objets(o){
    const sid='solaire',D=SOL.dit,vue=id=>voyInfoVue(sid,id);
    const pose=(x,y,kind,extra)=>o.push(Object.assign({x,y,kind,voy:1,solid:1},extra||{}));
    const decor=(x,y,kind,extra)=>o.push(Object.assign({x,y,kind,decor:1,solid:1},extra||{}));
    const gens=(x,y,who,dir,pal,act,extra)=>o.push(Object.assign({x,y,kind:'npc',solid:1,who,dir,pal,act},extra||{}));
    /* une source d'information : un objet ou une personne ; le point d'exclamation reste tant que l'information n'est pas notée */
    const source=(id,qui)=>voySource(sid,id,qui,D[SOL_SOURCES[id]][0],D[SOL_SOURCES[id]][1]);

    // ---- la halte : le train, le chef de halte, l'affiche
    o.push({x:16,y:28,kind:'train',decor:1});
    for(let x=16;x<=27;x++)o.push({x,y:27,kind:'none',act:()=>voyRetour(sid)});
    gens(24,25,'Chef de halte','down',{skin:'#6b4128',shirt:'#27325a',pants:'#1c2440',jacket:'#27325a',hair:'#3a2a1a',hat:'#c43d3d',hatType:'cap',beard:'#3a2a1a'},()=>voyParler(D.chefHalte.map(t=>({w:'Chef de halte',t})),()=>voyRetour(sid)));
    pose(26,25,'vAfficheFrance',{glow:!vue('france'),act:source('france')});
    decor(15,25,'bench');decor(16,25,'bench');

    // ---- l'espace d'accueil : le panneau du site, la vitrine, la maquette, M. Crête et son module
    pose(20,25,'vTotem',{glow:!vue('productible'),act:source('productible')});
    pose(14,22,'vVitrine',{glow:!vue('effet'),act:source('effet')});
    pose(16,22,'vMaquette',{glow:!vue('batiment'),act:source('batiment')});
    pose(18,22,'vModule',{act:source('module','M. Crête')});
    gens(19,22,'M. Crête','down',{skin:'#c68a5c',shirt:'#f2a33a',pants:'#3a4050',hair:'#2b1d14',hat:'#f7f0dc',hatType:'helmet',vest:1,beard:'#2b1d14',prop:'clipboard'},source('module','M. Crête'),{glow:!vue('module')});
    pose(13,24,'vCreme',{act:voyDire(null,D.creme)});
    decor(12,23,'fontaineP',{act:voyDire(null,["Une fontaine. L'eau est fraîche, l'ombre est rare, et le panneau « eau non contrôlée » n'a jamais découragé personne en août."])});

    // ---- la zone technique : onduleurs, transformateur, supervision, poste de livraison
    [18,19,20,23,24,25].forEach((x,i)=>pose(x,6,'vOnduleur',{act:()=>voyParler([{t:`L'onduleur n° ${i+1}. Il ronronne. ${solEnDirect()}`}])}));
    gens(20,7,'M. Sinus','down',{skin:'#e8b98f',shirt:'#2f6db5',pants:'#274f8f',overall:'#274f8f',hair:'#9a9aa2',glasses:1,hat:'#f2c12e',hatType:'helmet',prop:'tablet'},source('onduleur','M. Sinus'),{glow:!vue('onduleur')});
    pose(18,4,'vTransfo',{glow:!vue('reseau'),act:source('reseau')});o.push({x:19,y:4,kind:'none',solid:1,act:source('reseau')});
    const superviser=()=>{if(voyEtat().faits['solaire.courbes']&&vue('cloche'))voyParler([{w:'Mlle Cloche',t:D.cloche[1][0]},{t:solEnDirect()},{w:'Mlle Cloche',t:"Tu veux revoir les cinq courbes ? L'écran est à toi."}],()=>solSimCourbes());
      else voyParler(D.cloche[0].map(t=>({w:'Mlle Cloche',t})),()=>solSimCourbes(()=>voyDonnerInfo(sid,'cloche')))};
    pose(24,9,'vEcran',{act:superviser});o.push({x:25,y:9,kind:'none',solid:1,act:superviser});
    gens(23,9,'Mlle Cloche','down',{skin:'#e0ac7e',shirt:'#f7f0dc',pants:'#3a4050',jacket:'#2aa198',hair:'#5a3a22',style:'queue',lash:1,glasses:1,prop:'tablet'},superviser,{glow:!vue('cloche'),info:'cloche'});
    gens(23,3,'Mme Zénith','down',{skin:'#c68a5c',shirt:'#f7f0dc',pants:'#1c2440',jacket:'#c8502a',hair:'#1c1c22',style:'carre',lash:1,hat:'#f7f0dc',hatType:'helmet',scarf:'#f2c12e',prop:'clipboard'},solDefi,{still:1,chef:1,glow:!voyTampon(sid)&&!voyClesManquantes(sid).length});
    gens(24,15,'Dr Nuage','down',{skin:'#4a2c1c',shirt:'#8ec9e8',pants:'#59627c',coat:'#f7f0dc',hair:'#141216',style:'afro',glasses:1,prop:'tablet'},source('variable','Dr Nuage'),{glow:!vue('variable')});
    pose(25,15,'vCiel',{act:voyDire(null,["Une caméra braquée vers le ciel. Elle photographie les nuages toutes les minutes pour deviner où ils seront dans un quart d'heure.","C'est le seul appareil du site payé à regarder en l'air."])});

    // ---- le champ ouest : panneaux fixes, brebis, station météo
    pose(16,4,'vMeteo',{glow:!vue('chaleur'),act:source('chaleur')});
    decor(13,16,'bergerie',{act:voyDire(null,["La bergerie. Sur la porte, une ardoise : « Tonte de l'herbe : 14 hectares. Tondeuses : 200. Carburant : l'herbe. »"])});o.push({x:14,y:16,kind:'none',solid:1});
    gens(12,17,'Marius','down',{skin:'#c68a5c',shirt:'#8a5a2b',pants:'#3a3530',hair:'#5a3a22',beard:'#5a3a22',hat:'#e3cf98',hatType:'straw',prop:'crook'},source('surface','Marius'),{glow:!vue('surface')});
    decor(15,17,'patou',{act:voyDire(null,D.patou)});
    [[5,6],[13,8],[6,10],[14,12],[4,14],[7,16],[12,4]].forEach(([x,y],i)=>decor(x,y,'mouton',{act:voyDire(null,[i%2?"Bêêê. (Elle broute à l'ombre d'un module à 430 Wc. Elle s'en moque. Elle a raison.)":"Une brebis. Elle tond sous les panneaux huit heures par jour, sans contrat ni préavis. L'exploitant appelle ça de l'« éco-pâturage »."])}));
    pose(8,14,'vLapin',{act:voyDire(null,D.lapin)});
    [[8,18],[11,18],[32,15],[35,15]].forEach(([x,y])=>pose(x,y,'vDanger',{act:voyDire(null,D.danger)}));

    // ---- le champ est : les trackers, Mlle Azimut et son pupitre
    const g=MAPS.solaire.g;g.forEach((l,y)=>l.forEach((ch,x)=>{if(ch==='x')o.push({x,y,kind:'vTracker',voy:1,haut:g[y-1][x]!=='x',bas:g[y+1][x]!=='x'})}));
    const regler=()=>solSimOrientation(()=>voyDonnerInfo(sid,'tracker'));
    gens(35,13,'Mlle Azimut','down',{skin:'#f1c7a1',shirt:'#f2c12e',pants:'#3a4050',hair:'#b8431f',style:'queue',lash:1,hat:'#f7f0dc',hatType:'helmet',vest:1},()=>{if(vue('tracker'))voyParler(D.azimut[1].map(t=>({w:'Mlle Azimut',t})));else voyParler(D.azimut[0].map(t=>({w:'Mlle Azimut',t})),regler)},{glow:!vue('tracker'),info:'tracker'});
    pose(36,13,'vPupitre',{act:()=>voyParler([{t:"Le pupitre des trackers : deux curseurs, une case à cocher. "+solTrackersEnDirect()}],regler)});

    // ---- au sud : la palette, M. Riverain, les ruches, la cigale
    pose(6,21,'vPalette',{glow:!vue('carbone'),act:source('carbone')});
    gens(37,21,'M. Riverain','up',{skin:'#f6d3b3',shirt:'#f7f0dc',pants:'#c9b28a',hair:'#ddd',hat:'#f7f0dc',hatType:'cap',scarf:'#e2573b',prop:'cane'},source('midi','M. Riverain'),{glow:!vue('midi')});
    decor(39,21,'ruche',{act:voyDire(null,["Une ruche. Les abeilles butinent la lavande de M. Riverain et le thym sous les panneaux. Elles produisent toute la journée, sans onduleur."])});decor(40,21,'ruche');
    o.push({x:30,y:21,kind:'none',act:voyDire(null,D.cigale)});
  }
});
/* qui (ou quoi) donne quelle information : l'identifiant de l'information → sa réplique dans SOL.dit */
const SOL_SOURCES={effet:'cellule',module:'crete',productible:'totem',chaleur:'capteur',onduleur:'sinus',reseau:'transfo',variable:'nuage',surface:'berger',carbone:'palette',batiment:'maquette',midi:'riverain',france:'affiche'};

/* ---- en direct du ciel : la centrale vit sous le même soleil que la ville ---- */
function solEnDirect(){
  const mw=SKY.pv*12;
  if(SKY.el<=0)return "Production en ce moment : 0 MW. Il fait nuit. La centrale dort, et elle ne touche pas un centime pour ça.";
  return `Production en ce moment : ${mw.toFixed(1).replace('.',',')} MW, soit ${Math.round(SKY.pv*100)} % de la puissance crête. ${SKY.pv>.75?"Grand beau : c'est une journée à photos pour l'exploitant.":SKY.el<15?"Le soleil est bas sur l'horizon : on est sur un bord de la cloche.":SKY.pv>.35?"Honnête. Le ciel fait ce qu'il peut.":"Le ciel boude. Les modules attendent."}`;
}
function solTrackersEnDirect(){
  const p=solPenche();
  return SKY.el<=0?"Il fait nuit : les panneaux sont rangés à plat, en attendant le lever du soleil.":Math.abs(p)<.15?"Le soleil est au plus haut : les panneaux sont presque à plat.":p<0?"C'est le matin : toutes les rangées penchent vers l'est.":"C'est l'après-midi : toutes les rangées penchent vers l'ouest.";
}
/* à l'arrivée du train */
VOY.sites.solaire.arriver=()=>{if(!busy&&!dlg.open&&!voyEtat().faits['solaire.arrivee']){voyEtat().faits['solaire.arrivee']=1;save();voyParler(SOL.dit.arrivee)}};
