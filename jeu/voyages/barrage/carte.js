/* Wattlings · jeu/voyages/barrage/carte.js
   Barrage de Val-Turbine : le plan du site, et tout ce qui est posé dessus.
   En bas, la halte, l'usine et le bassin aval ; à l'ouest, le sentier qui monte ; en haut, la crête du barrage et le lac.
   Les textes sont dans textes.js, les dessins dans dessins.js, les simulations dans simulations.js. */

voyCarte('barrage',{
  nom:'Barrage de Val-Turbine',depart:[19,28],region:'savoie',
  /* ---- pour la carte (touche K) : le nom des endroits du site. r : le rectangle [x0,y0,x1,y1] ; t, d : ce que dit l'encart ; e : l'étiquette écrite sur le plan ---- */
  zones:[
    {r:[12,27,27,28],t:"Halte de Val-Turbine",d:"Le train du retour attend à quai, tout en bas de la vallée.",e:"HALTE",ey:31},
    {r:[0,29,39,30],t:"Voie ferrée",d:"La ligne d'Ampère-sur-Loire, par Lyon et Chambéry. Les derniers kilomètres montent."},
    {r:[6,1,34,6],t:"Le lac de retenue",d:"Le stock d'énergie du site : de l'eau, en hauteur, qui attend qu'on ait besoin d'elle.",e:"LAC DE RETENUE"},
    {r:[3,7,36,8],t:"La crête du barrage",d:"On marche sur le mur. D'un côté le lac, de l'autre le vide. Mme Stock et M. Capteur y travaillent, sans regarder en bas.",e:"CRÊTE"},
    {r:[5,9,10,17],t:"La conduite forcée",d:"Le tuyau qui descend l'eau du lac jusqu'aux turbines. Toute la hauteur de chute est là."},
    {r:[8,9,32,14],t:"Le mur du barrage",d:"Neuf cent mille mètres cubes de béton en travers de la vallée. Il retient le lac depuis 1957.",e:"BARRAGE"},
    {r:[8,18,18,23],t:"L'usine hydroélectrique",d:"Les turbines et les alternateurs. L'eau entre d'un côté, l'électricité sort de l'autre.",e:"USINE"},
    {r:[17,19,29,24],t:"Le bassin aval",d:"L'eau turbinée y attend. La nuit, des pompes peuvent la remonter au lac : c'est ce qui fait du site une batterie.",e:"BASSIN AVAL"},
    {r:[30,18,38,24],t:"L'alpage",d:"Le chalet du Père Anselme et ses vaches. Soixante-dix ans qu'il regarde le barrage, et il a un avis sur qui doit passer en premier."},
    {r:[1,1,5,6],t:"Les sommets",d:"La neige d'aujourd'hui est l'électricité du printemps."},
    {r:[35,1,38,6],t:"Les sommets",d:"La neige d'aujourd'hui est l'électricité du printemps."},
    {c:'~',t:"Le torrent",d:"Il coule toujours un peu : le barrage n'a pas le droit de garder toute l'eau pour lui."},
    {c:'=',t:"Le sentier",d:"Il monte de la halte à la crête du barrage, en longeant la conduite forcée. Compter vingt minutes, ou une marmotte."}],
  ailleurs:["La vallée de Val-Turbine","Des sapins, des rochers, de la pente. La pente, ici, c'est la matière première."],
  /* ---- le plan : 40 cases sur 32 ----
     On marche sur : . alpage   = sentier   g gravier   b crête du barrage   j pont   n neige   q quai
     On bute contre : ~ eau   P mur du barrage   x conduite forcée   h usine   B chalet   T sapin   k rocher   u buisson   R r voie */
  plan:[
    'kkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk',
    'knnnnk~~~~~~~~~~~~~~~~~~~~~~~~~~~~knnnnk',
    'knknnk~~~~~~~~~~~~~~~~~~~~~~~~~~~~knTnnk',
    'knnnnk~~~~~~~~~~~~~~~~~~~~~~~~~~~~knnnnk',
    'knnTnk~~~~~~~~~~~~~~~~~~~~~~~~~~~~knnknk',
    'kTnnnk~~~~~~~~~~~~~~~~~~~~~~~~~~~~knTnnk',
    'knTnnk~~~~~~~~~~~~~~~~~~~~~~~~~~~~knnnTk',
    'T.==bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb...T',
    'T.==bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb...k',
    'k.=.kxkkPPPPPPPPPPPPPPPPPPPPPPPPkkkk..TT',
    'TT=.kxkkPPPPPPPPPPPPPPPPPPPPPPPPkkkk...T',
    'T.=.kkxkPPPPPPPPPPPPPPPPPPPPPPPPkkkk...T',
    'kk=.kkxkPPPPPPPPPPPPPPPPPPPPPPPPkkkk.T.k',
    'T.=.kkkxPPPPPPPPPPPPPPPPPPPPPPPPkkkk...T',
    'TT=.kkkxPPPPPPPPPPPPPPPPPPPPPPPPkkkk..kT',
    'k.=.....x.....T.u.......~~.......T.....T',
    'T.=.T...x..T.k...T..u.T.~~....T...k....k',
    'T.=......x......k..T....~~.....u....T..T',
    'k.=.k....hhhhhhh........~~...k.........T',
    'T.=..T...hhhhhhh.....~~~~~~~~...BBBB...T',
    'TT=......hhhhhhh~~~~~~~~~~~~~...BBBB.k.k',
    'k.=..u..gggggggggg...~~~~~~~~..........T',
    'T.=.T...gggggggggg...~~~~~~~~.T...u...TT',
    'Tu=...T....==.....k........~~..k....T..T',
    'k.=........==..u.......u...~~..........k',
    'T.=========================jj=========.T',
    'T.=========================jj=========.T',
    'k..k.T..T.k........==......~~..T.k.T...T',
    'T...........qqqqqqqqqqqqqqq~~..........k',
    'RRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRR',
    'rrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr',
    '..k...u.....k...u.....k...u~~...k...u...'],
  legende:{'.':'herbe','=':'chemin',g:'gravier',b:'beton',q:'quai',j:'ponton',n:'neige','~':'eau',T:'arbre',u:'buisson',k:'rocher',R:'bordQuai',r:'rails',
    P:{sol:'gravier',pose:BARP.mur},x:'herbe',
    h:{sol:'gravier',pose:'batiment',mur:'#d9d5c8',toit:'#59627c',toitH:11,bande:'#1f8f7a',porte:[3,20,'#3a4050'],plaque:'USINE',fenetres:[8,28,76,96]},
    B:{pose:'batiment',mur:'#a07845',toit:'#6b4a2b',toitH:13,porte:[1.5,10,'#5d4024'],fenetres:[6,50]}},
  /* les Alpes : un alpage bien vert, des gentianes, une eau de fonte turquoise, des sapins */
  teintes:{herbe:['#6fc47c','#79cb84','#85d290'],brin:['#4fa860','#a8e4ae'],eau:['#3aa0b8','#2f8aa2','#6cc4d6','#e0f4f6']},
  fleur:'#3f6fd8',essence:()=>1,finitions:BARP.finitions,

  objectif(){
    const sid='barrage',S0=VOY.sites[sid],m=voyClesManquantes(sid),n=voyInfosVues(sid).length,N=S0.infos.length,C=S0.infos.filter(f=>f.cle).length;
    if(voyTampon(sid))return n<N?`Tampon obtenu ! Il reste ${N-n} information${N-n>1?'s':''} à dénicher, dans la vallée ou là-haut. Le train du retour attend à la halte.`:"Site visité de fond en comble. Le train du retour attend à la halte, au sud.";
    if(m.length)return `Info clé suivante : ${m[0].ou} (${C-m.length}/${C})`;
    return "Infos clés réunies : Mme Lachute t'attend devant l'usine, dans la vallée.";
  },
  cibles(){return voyCibles('barrage',{formule:[9,21],flexible:[12,21],step:[20,22],pointe:[18,24],types:[3,17],stock:[10,7]},[14,22])},
  apres(c,ox,oy,t){voyHoule(c,ox,oy,t);voyLumiere(c,ox,oy)},

  objets(o){
    const sid='barrage',D=BAR.dit,vue=id=>voyInfoVue(sid,id);
    const pose=(x,y,kind,extra)=>o.push(Object.assign({x,y,kind,voy:1,solid:1},extra||{}));
    const decor=(x,y,kind,extra)=>o.push(Object.assign({x,y,kind,decor:1,solid:1},extra||{}));
    const gens=(x,y,who,dir,pal,act,extra)=>o.push(Object.assign({x,y,kind:'npc',solid:1,who,dir,pal,act},extra||{}));
    const source=(id,cle,qui)=>voySource(sid,id,qui,D[cle][0],D[cle][1]);

    // ---- la halte
    o.push({x:13,y:30,kind:'train',decor:1});
    for(let x=13;x<=24;x++)o.push({x,y:29,kind:'none',act:()=>voyRetour(sid)});
    gens(22,27,'Chef de halte','down',{skin:'#f6d3b3',shirt:'#27325a',pants:'#1c2440',jacket:'#27325a',hair:'#d9a441',hat:'#c43d3d',hatType:'cap',scarf:'#f7f0dc'},()=>voyParler(D.chefHalte.map(t=>({w:'Chef de halte',t})),()=>voyRetour(sid)));
    pose(18,27,'vPanneau',{theme:'barrage',teinte:'#1f8f7a',act:voyDire(null,["Un grand panneau : « Aménagement de Val-Turbine · Barrage de 130 m · Chute de 600 m · 420 MW · dont 200 MW de pompage ».","Un ajout à la craie : « Le lac est en haut. Oui, tout en haut. Bon courage. »"])});
    pose(24,27,'vPoster',{theme:'barrage',teinte:'#1f8f7a',glow:!vue('france'),act:source('france','affiche')});

    // ---- l'usine et son parvis : M. Newton, M. Vanne, Mlle Pelton, Mme Lachute
    const chute=voyAnimateur(sid,'formule','M. Newton',D.newton[0],D.newton[1],barSimChute);
    gens(9,21,'M. Newton','down',{skin:'#f1c7a1',shirt:'#f7f0dc',pants:'#3a4050',jacket:'#1f8f7a',hair:'#9a9aa2',beard:'#9a9aa2',glasses:1,hat:'#f7f0dc',hatType:'helmet',prop:'clipboard'},chute,{glow:!vue('formule')});
    pose(8,21,'vPupitre',{act:()=>voyParler([{t:"Le pupitre de M. Newton. Deux curseurs : la hauteur, le débit."}],()=>barSimChute(()=>voyDonnerInfo(sid,'formule')))});
    gens(12,21,'M. Vanne','down',{skin:'#c68a5c',shirt:'#2f6db5',pants:'#274f8f',overall:'#274f8f',hair:'#2b1d14',hat:'#f2c12e',hatType:'helmet'},source('flexible','vanne','M. Vanne'),{glow:!vue('flexible')});
    const turbines=voyAnimateur(sid,'turbines','Mlle Pelton',D.pelton[0],D.pelton[1],barSimTurbines);
    gens(15,21,'Mlle Pelton','down',{skin:'#e0ac7e',shirt:'#f2a33a',pants:'#3a4050',overall:'#3a4050',hair:'#b8431f',style:'queue',lash:1,hat:'#f7f0dc',hatType:'helmet'},turbines,{glow:!vue('turbines')});
    pose(16,21,'vRoue',{act:voyDire(null,D.roue)});
    gens(14,22,'Mme Lachute','down',{skin:'#7a4e30',shirt:'#f7f0dc',pants:'#1c2440',jacket:'#1f8f7a',hair:'#5a3a22',style:'carre',lash:1,hat:'#f7f0dc',hatType:'helmet',scarf:'#f2c12e',prop:'clipboard'},barDefi,{still:1,chef:1,glow:!voyTampon(sid)&&!voyClesManquantes(sid).length});

    // ---- le bassin aval : Mme Reflux, M. Spot et son écran
    gens(20,22,'Mme Reflux','right',{skin:'#c68a5c',shirt:'#8ec9e8',pants:'#2f3a5c',coat:'#2f6db5',hair:'#1c1c22',style:'boucle',lash:1,hat:'#f2c12e',hatType:'helmet',prop:'tablet'},source('step','reflux','Mme Reflux'),{glow:!vue('step')});
    gens(18,24,'M. Spot','down',{skin:'#4a2c1c',shirt:'#f7f0dc',pants:'#2f3a5c',jacket:'#2f3a5c',hair:'#141216',glasses:1,tie:'#e2573b',prop:'tablet'},source('pointe','spot','M. Spot'),{glow:!vue('pointe')});
    pose(19,24,'vEcranPrix',{act:voyDire(null,D.ecran)});o.push({x:20,y:24,kind:'none',solid:1,act:voyDire(null,D.ecran)});

    // ---- le torrent : le panneau jaune, Mme Truite, la passe à poissons
    pose(26,24,'vPanneauJaune',{glow:!vue('aval'),act:source('aval','jaune')});
    gens(29,24,'Mme Truite','left',{skin:'#e0ac7e',shirt:'#2f6d34',pants:'#5a3a22',coat:'#2f6d34',hair:'#9a9aa2',style:'queue',lash:1,hat:'#5a3a22',hatType:'cap',bag:'#6b4a2b'},source('reserve','truite','Mme Truite'),{glow:!vue('reserve')});
    pose(30,23,'vPasse',{act:voyDire(null,D.passe)});

    // ---- le chalet du Père Anselme, les vaches
    gens(33,21,'Père Anselme','down',{skin:'#f6d3b3',shirt:'#8a5a2b',pants:'#3a3530',coat:'#6b4a2b',hair:'#ddd',beard:'#ddd',hat:'#2f6d34',hatType:'beret',prop:'cane'},source('usages','anselme','Père Anselme'),{glow:!vue('usages')});
    [[33,23],[35,22]].forEach(([x,y],i)=>decor(x,y,'cow',{v:i,act:voyDire(null,D.vache)}));

    // ---- le sentier : la conduite forcée, la table d'orientation, le randonneur
    pose(3,20,'vPlaque',{teinte:'#8fb89c',glow:!vue('conduite'),act:source('conduite','plaqueConduite')});
    pose(3,17,'vPlaque',{teinte:'#d9c9a0',glow:!vue('types'),act:source('types','table')});
    decor(1,17,'bench');
    gens(3,13,'Randonneur','left',{skin:'#e88a7a',shirt:'#e2573b',pants:'#59627c',hair:'#5a3a22',hat:'#f2c12e',hatType:'cap',bag:'#2f6db5'},voyDire('Randonneur',D.randonneur));

    // ---- la crête du barrage : Mme Stock, la plaque de 1957, M. Capteur
    gens(10,7,'Mme Stock','down',{skin:'#c68a5c',shirt:'#f7f0dc',pants:'#2f3a5c',coat:'#e2573b',hair:'#2b1d14',style:'carre',lash:1,hat:'#e2573b',hatType:'bonnet',prop:'tablet'},source('stock','stock','Mme Stock'),{glow:!vue('stock')});
    pose(11,7,'vEchelle',{act:voyDire(null,["L'échelle du lac, graduée en mètres d'altitude. Un flotteur orange monte et descend avec l'eau : quarante mètres d'écart entre le printemps et la fin de l'hiver."])});
    pose(16,7,'vPlaque',{teinte:'#8a9a6a',glow:!vue('carbone'),act:source('carbone','plaque1957')});
    gens(22,7,'M. Capteur','down',{skin:'#f1c7a1',shirt:'#f2a33a',pants:'#3a4050',hair:'#3a2a1a',glasses:1,hat:'#f7f0dc',hatType:'helmet',vest:1,prop:'tablet'},source('surete','capteur','M. Capteur'),{glow:!vue('surete')});
    pose(23,7,'vPendule',{act:voyDire(null,["Le coffret du pendule. Un fil à plomb de cent mètres descend dans le béton ; un capteur mesure de combien il s'écarte. Aujourd'hui : 2,3 centimètres. Le barrage se porte bien."])});
    pose(28,7,'vLongueVue',{act:voyDire(null,D.longuevue)});
    pose(32,7,'vPlaque',{teinte:'#c9a26e',act:voyDire(null,D.pedalo)});
    pose(37,8,'vMarmotte',{act:voyDire(null,D.marmotte)});
  }
});
VOY.sites.barrage.arriver=()=>{if(!busy&&!dlg.open&&!voyEtat().faits['barrage.arrivee']){voyEtat().faits['barrage.arrivee']=1;save();voyParler(BAR.dit.arrivee)}};
