/* Wattlings · jeu/voyages/nucleaire/carte.js
   Centrale nucléaire de Neutron-sur-Mer : le plan du site, et tout ce qui est posé dessus.
   Au sud, la halte et l'esplanade du centre d'information ; derrière la clôture, le site ; au nord, la digue et la mer.
   Les textes sont dans textes.js, les dessins dans dessins.js, les simulations dans simulations.js. */

voyCarte('nucleaire',{
  nom:'Centrale nucléaire de Neutron-sur-Mer',depart:[21,26],
  /* ---- pour la carte (touche K) : le nom des endroits du site. r : le rectangle [x0,y0,x1,y1] ; t, d : ce que dit l'encart ; e : l'étiquette écrite sur le plan ---- */
  zones:[
    {r:[14,26,29,26],t:"Halte de Neutron-sur-Mer",d:"Le train du retour attend à quai. Il part à l'heure : ici, on aime les procédures.",e:"HALTE",ey:29},
    {r:[0,27,41,28],t:"Voie ferrée",d:"La ligne d'Ampère-sur-Loire, par Paris et Amiens."},
    {r:[4,22,17,25],t:"Centre d'information",d:"La maquette, la pastille, le fût, le simulateur de conduite. Ici on peut toucher : rien n'est branché.",e:"CENTRE D'INFORMATION",ey:21},
    {r:[18,19,22,21],t:"Portique d'accès",d:"On entre sur le site par ici, badge en main. M. Sievert compte tout ce qui passe, y compris ce qu'on ne voit pas."},
    {r:[7,7,18,12],t:"Bâtiments réacteurs",d:"Sous chaque dôme de béton, un réacteur. C'est là que naît la chaleur, et c'est la seule chose qu'on lui demande.",e:"RÉACTEURS"},
    {r:[21,8,33,11],t:"Salle des machines",d:"La vapeur y fait tourner la turbine, la turbine fait tourner l'alternateur. C'est là que la chaleur devient électricité.",e:"SALLE DES MACHINES"},
    {r:[29,12,35,13],t:"Départ vers le réseau",d:"Le transformateur, puis les pylônes : le courant quitte le site à très haute tension."},
    {r:[36,6,38,7],t:"Station de pompage",d:"L'eau de mer entre ici pour refroidir le circuit. Elle repart un peu plus chaude, et c'est tout ce qu'elle emporte."},
    {r:[0,3,41,5],t:"La digue",d:"Elle protège le site de la mer. Gaston y pêche, et il a des choses à dire sur l'eau tiède.",e:"DIGUE"},
    {c:'~',t:"La mer",d:"La source froide de la centrale : sans elle, pas de condensation, donc pas de turbine."},
    {r:[5,6,36,20],t:"Le site",d:"Derrière la clôture : du gravier, des routes internes, des caméras. On ne s'y promène pas, on y circule."},
    {c:'=',t:"Chemin de la digue",d:"Il contourne la clôture par l'est, jusqu'à la station de pompage et à la mer."}],
  ailleurs:["Les abords de la centrale","De l'herbe tondue de près, et des panneaux qui disent non."],
  /* ---- le plan : 42 cases sur 30 ----
     On marche sur : . herbe   = chemin   a route   g gravier   d dalles   s sable   b digue   q quai
     On bute contre : ~ mer   f clôture   P bâtiment réacteur   h salle des machines   w station de pompage   B centre d'information
                      T arbre   u buisson   k rocher   R r voie */
  plan:[
    '~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~',
    '~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~',
    '~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~',
    'bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb',
    'bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb',
    'susssssssusssssssusssssssusssssssssssss==s',
    '.....ffffffffffffffffffffffffffffffffww==.',
    '.u...fggggggggggggggggggggggggggggggfww==.',
    '...u.fggPPPPggPPPPgggghhhhhhhhhhhgggf..==u',
    '.....fggPPPPggPPPPgggghhhhhhhhhhhgggf..==.',
    '..T..fggPPPPggPPPPgggghhhhhhhhhhhgggf..==.',
    '.....fggPPPPggPPPPggggggggggggggggggf..==.',
    '.....fggPPPPggPPPPggggggggggggggggggf..==T',
    '.u...fgaaaaaaaaaaaaaaaaaaaaaaaaaaaagf..==.',
    '.....fgaaaaaaaaaaaaaaaaaaaaaaaaaaaagf..==.',
    '.....fggggggggggggggaaggggggggggggggf.u==.',
    '...k.fggggggggggggggaaggggggggggggggf..==.',
    '.....fggggggggggggggaaggggggggggggggf..==.',
    '.....fggggggggggggggaaggggggggggggggf..==u',
    '..T..fggggggggggggggaaggggggggggggggf.T==.',
    '.....fffffffffffffffaafffffffffffffff..==.',
    '...u.........k......aa.u.......u.......==.',
    '.u...BBBBBB.u..T....aa===================.',
    '.....BBBBBB.......u.aa....................',
    '....dddddddddddddd..aa..u..........T.....u',
    '..T.dddddddddddddd..aa........u..k...u....',
    '....u....k....qqqqqqqqqqqqqqq....u....T...',
    'RRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRR',
    'rrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr',
    '..k...u...k...u...k...u...k...u...k...u...'],
  legende:{'.':'herbe','=':'chemin',a:'asphalte',g:'gravier',d:'dalles',s:'sable',b:'beton',q:'quai','~':'eau',f:'grillage',T:'arbre',u:'buisson',k:'rocher',R:'bordQuai',r:'rails',
    P:{sol:'gravier',pose:NUCP.reacteur},h:NUCP.machines,
    w:{sol:'herbe',pose:'batiment',mur:'#c4c0b2',toit:'#59627c',porte:[.5,12,'#3a4050'],plaque:'POMPE'},
    B:{pose:'batiment',mur:'#e9dcc0',toit:'#c0503a',toitH:11,porte:[2.5,14,'#2f6db5'],plaque:'INFO',fenetres:[8,24,72,84]}},
  /* le Nord : une herbe un peu grise, une mer qui l'est franchement */
  teintes:{herbe:['#7fb86a','#88bf72','#93c77d'],brin:['#5b9a52','#a8d99a'],eau:['#5a8fa8','#4a7a92','#7fb0c6','#dfeaee']},
  essence:(x,y,h)=>h>.5?6:0,lignes:[[34,12,40,15],[40,15,43,17]],finitions:NUCP.finitions,

  objectif(){
    const sid='nucleaire',S0=VOY.sites[sid],m=voyClesManquantes(sid),n=voyInfosVues(sid).length,N=S0.infos.length,C=S0.infos.filter(f=>f.cle).length;
    if(voyTampon(sid))return n<N?`Tampon obtenu ! Il reste ${N-n} information${N-n>1?'s':''} à dénicher sur le site. Le train du retour attend à la halte, au sud.`:"Site visité de fond en comble. Le train du retour attend à la halte, au sud.";
    if(m.length)return `Centrale nucléaire : fais le tour du site et réunis les infos clés (${C-m.length}/${C}). Prochaine piste : ${m[0].ou}.`;
    return "Infos clés réunies : Mme Isotope t'attend au bout de l'allée des visiteurs, passé le portique.";
  },
  cibles(){return voyCibles('nucleaire',{fission:[5,24],pilotage:[12,24],carbone:[27,23],creuses:[31,23],bouilloire:[27,11],ordres:[29,12]},[21,12])},
  apres(c,ox,oy,t){voyHoule(c,ox,oy,t);voyLumiere(c,ox,oy)},

  objets(o){
    const sid='nucleaire',D=NUC.dit,vue=id=>voyInfoVue(sid,id);
    const pose=(x,y,kind,extra)=>o.push(Object.assign({x,y,kind,voy:1,solid:1},extra||{}));
    const decor=(x,y,kind,extra)=>o.push(Object.assign({x,y,kind,decor:1,solid:1},extra||{}));
    const gens=(x,y,who,dir,pal,act,extra)=>o.push(Object.assign({x,y,kind:'npc',solid:1,who,dir,pal,act},extra||{}));
    const source=(id,cle,qui)=>voySource(sid,id,qui,D[cle][0],D[cle][1]);

    // ---- la halte
    o.push({x:15,y:28,kind:'train',decor:1});
    for(let x=15;x<=26;x++)o.push({x,y:27,kind:'none',act:()=>voyRetour(sid)});
    gens(23,25,'Chef de halte','down',{skin:'#e0ac7e',shirt:'#27325a',pants:'#1c2440',jacket:'#27325a',hair:'#1c1c22',hat:'#c43d3d',hatType:'cap',glasses:1,tie:'#c43d3d'},()=>voyParler(D.chefHalte.map(t=>({w:'Chef de halte',t})),()=>voyRetour(sid)));
    pose(19,25,'vPanneau',{theme:'nucleaire',teinte:'#6a3fa0',act:voyDire(null,["Un grand panneau : « Centrale nucléaire de Neutron-sur-Mer · 2 réacteurs de 1 300 MW · 17 TWh par an ».","En petit : « Jours sans accident : beaucoup. Jours sans qu'un visiteur demande où sont les tours : zéro. »"])});
    pose(25,25,'vPoster',{theme:'nucleaire',teinte:'#6a3fa0',glow:!vue('epr'),act:source('epr','affiche')});

    // ---- l'esplanade du centre d'information : la maquette, la pastille, le fût, le simulateur
    pose(5,24,'vTable',{dessin:NUCT.fission,glow:!vue('fission'),act:source('fission','maquette')});
    pose(7,24,'vTable',{dessin:NUCT.pastille,glow:!vue('pastille'),act:source('pastille','pastille')});
    pose(9,24,'vFut',{glow:!vue('dechets'),act:source('dechets','fut')});
    const conduire=voyAnimateur(sid,'pilotage','M. Bore',["M. Bore, opérateur de conduite. Vingt ans de salle de commande. Mon travail consiste à ce qu'il ne se passe rien. Je suis très bon.","Ce simulateur est le même que celui où l'on nous entraîne, en plus petit. Tu veux essayer ? Doucement avec les barres. J'ai dit doucement."],["On me demande si c'est stressant. Un réacteur, ça prévient longtemps à l'avance, et ça s'arrête tout seul. Ce qui est stressant, c'est la machine à café du deuxième étage."],nucSimConduite);
    gens(12,24,'M. Bore','down',{skin:'#f1c7a1',shirt:'#f7f0dc',pants:'#274f8f',jacket:'#274f8f',hair:'#9a9aa2',glasses:1,tie:'#2f6db5',prop:'clipboard'},conduire,{glow:!vue('pilotage')});
    pose(13,24,'vSimulateur',{act:()=>voyParler([{t:D.bouton[0]}],()=>nucSimConduite(()=>voyDonnerInfo(sid,'pilotage')))});o.push({x:14,y:24,kind:'none',solid:1,act:voyDire(null,D.bouton)});
    decor(16,24,'chair',{act:voyDire(null,D.beignets)});
    gens(27,23,'Mme Carbone','down',{skin:'#c68a5c',shirt:'#2f9e7a',pants:'#3a4050',jacket:'#f7f0dc',hair:'#2b1d14',style:'boucle',lash:1,scarf:'#2f9e7a',prop:'tablet'},source('carbone','carbone','Mme Carbone'),{glow:!vue('carbone')});
    pose(28,23,'vCompteurCarbone',{act:voyDire(null,["Un afficheur : « Électricité française, en ce moment : 20 g de CO₂ par kWh ». Le chiffre tremble d'un gramme de temps en temps, par politesse."])});
    pose(31,23,'vBallon',{glow:!vue('creuses'),act:source('creuses','ballon')});

    // ---- l'entrée du site : le portique, M. Sievert
    o.push({x:20,y:20,kind:'vPortique',voy:1});
    gens(19,21,'M. Sievert','right',{skin:'#f6d3b3',shirt:'#f7f0dc',pants:'#3a4050',coat:'#f7f0dc',hair:'#d9a441',glasses:1,prop:'clipboard'},source('doses','sievert','M. Sievert'),{glow:!vue('doses')});
    pose(18,19,'vCamera',{act:voyDire(null,D.camera)});
    pose(30,20,'vMouette',{act:voyDire(null,D.mouette)});

    // ---- sur le site : les réacteurs, la salle des machines, le transformateur
    gens(12,12,'Inspectrice Rigueur','down',{skin:'#e0ac7e',shirt:'#f7f0dc',pants:'#1c2440',jacket:'#1c2440',hair:'#5a3a22',style:'carre',bun:1,lash:1,glasses:1,hat:'#f7f0dc',hatType:'helmet',prop:'clipboard'},source('barrieres','rigueur','Inspectrice Rigueur'),{glow:!vue('barrieres')});
    [7,13].forEach(x=>o.push({x,y:12,kind:'none',solid:1,act:voyDire(null,D.zone)}));
    const chaine=voyAnimateur(sid,'bouilloire','Mlle Vapeur',D.vapeur[0],D.vapeur[1],nucSimChaine);
    gens(27,11,'Mlle Vapeur','down',{skin:'#c68a5c',shirt:'#f2a33a',pants:'#3a4050',overall:'#3a4050',hair:'#1c1c22',style:'queue',lash:1,hat:'#f2c12e',hatType:'helmet'},chaine,{glow:!vue('bouilloire')});
    o.push({x:24,y:10,kind:'none',solid:1,glow:!vue('inertie'),act:source('inertie','baie')});
    gens(29,12,'Mme Gigawatt','down',{skin:'#f1c7a1',shirt:'#8a3b8f',pants:'#2f3a5c',jacket:'#2f3a5c',hair:'#b8431f',style:'boucle',lash:1,hat:'#f7f0dc',hatType:'helmet',prop:'tablet'},source('ordres','gigawatt','Mme Gigawatt'),{glow:!vue('ordres')});
    pose(30,12,'vTransfo',{act:voyDire(null,["Le transformateur principal : 400 000 volts en sortie. Il bourdonne plus grave que tous ceux que tu as croisés. C'est le doyen, il a de la voix."])});o.push({x:31,y:12,kind:'none',solid:1});
    pose(34,12,'vPylone',{act:voyDire(null,D.ligne)});
    o.push({x:40,y:15,kind:'vPylone',voy:1,solid:1});
    gens(24,15,'M. Planning','down',{skin:'#e0ac7e',shirt:'#f7f0dc',pants:'#59627c',hair:'#2b1d14',beard:'#2b1d14',glasses:1,tie:'#f2a33a',prop:'clipboard'},source('arret','planning','M. Planning'),{glow:!vue('arret')});
    pose(25,15,'vPlanning',{act:voyDire(null,["Le tableau de M. Planning : douze colonnes, des dizaines de cases, quatre couleurs. Une case rouge est entourée trois fois : « PAS JANVIER »."])});
    gens(21,12,'Mme Isotope','down',{skin:'#f1c7a1',shirt:'#f7f0dc',pants:'#1c2440',jacket:'#6a3fa0',hair:'#9a9aa2',style:'carre',lash:1,glasses:1,scarf:'#f2c12e',prop:'clipboard'},nucDefi,{still:1,chef:1,glow:!voyTampon(sid)&&!voyClesManquantes(sid).length});

    // ---- la digue : la station de pompage, Gaston
    o.push({x:37,y:7,kind:'none',solid:1,act:voyDire(null,D.pompe)});
    gens(32,3,'Gaston','up',{skin:'#c68a5c',shirt:'#2f6d34',pants:'#5a3a22',coat:'#2f6d34',hair:'#9a9aa2',beard:'#9a9aa2',hat:'#5a3a22',hatType:'beret',prop:'cane'},source('refroidissement','gaston','Gaston'),{glow:!vue('refroidissement')});
    decor(34,3,'casier');
  }
});
VOY.sites.nucleaire.arriver=()=>{if(!busy&&!dlg.open&&!voyEtat().faits['nucleaire.arrivee']){voyEtat().faits['nucleaire.arrivee']=1;save();voyParler(NUC.dit.arrivee)}};
