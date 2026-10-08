/* Wattlings · jeu/voyages/eolien/carte.js
   Parc éolien de Port-Rafale : les deux plans du site (la lande, puis le poste électrique en mer) et tout ce qui est posé dessus.
   On passe de l'un à l'autre par la navette du capitaine Noroît, au bout du ponton.
   Les textes sont dans textes.js, les dessins dans dessins.js, les simulations dans simulations.js. */

/* les couleurs de la Bretagne : une lande bien verte, de la bruyère, du granit, une mer qui n'a pas chaud */
const EOL_TEINTES={herbe:['#5fae6a','#68b572','#74bd7c'],brin:['#3f8f52','#9bd8a0'],chemin:['#e0d6b8','#c7bb98','#afa37f','#f1ead4'],pierre:['#aaa69c','#8a867c','#d5d1c6'],eau:['#3f86b8','#30709f','#69a9d2','#dcebf2']};

/* ================= LA LANDE ================= */
voyCarte('eolien',{
  nom:'Parc éolien de Port-Rafale',depart:[22,24],region:'bretagne',
  /* ---- pour la carte (touche K) : le nom des endroits du site. r : le rectangle [x0,y0,x1,y1] ; t, d : ce que dit l'encart ; e : l'étiquette écrite sur le plan ---- */
  zones:[
    {r:[16,23,30,24],t:"Halte de Port-Rafale",d:"Le train du retour attend à quai. Pas d'abri : ici, un abri, ça devient un cerf-volant.",e:"HALTE",ey:27},
    {r:[0,25,39,26],t:"Voie ferrée",d:"La ligne d'Ampère-sur-Loire, par Le Mans et Rennes. Elle s'arrête ici : après, c'est l'océan."},
    {r:[20,8,28,11],t:"Poste de livraison",d:"Mme Suroît, le transformateur, et la sortie vers le réseau à 20 000 volts.",e:"POSTE DE LIVRAISON"},
    {r:[25,12,29,14],t:"Mât de mesure",d:"Il mesure le vent, tout là-haut. Mme Bourrasque en tire une année entière de données."},
    {r:[13,8,17,12],t:"Éolienne n° 1",d:"M. Rafale y fait la démonstration : un curseur, du vent, une courbe de puissance.",e:"N° 1"},
    {r:[19,2,22,5],t:"Le vieux moulin",d:"L'ancêtre. Il prenait déjà son énergie au vent, et lui aussi s'arrêtait quand il n'y en avait pas.",e:"MOULIN",ey:1},
    {r:[32,10,38,14],t:"Le hameau",d:"La crêperie de Mme Le Goff, voisine du parc. Elle a un avis sur les éoliennes. Elle a aussi des galettes.",e:"HAMEAU"},
    {r:[0,15,10,17],t:"Le ponton",d:"Le capitaine Noroît y embarque pour le poste électrique en mer : vingt minutes de traversée.",e:"PONTON"},
    {r:[0,1,4,5],t:"Phare de Port-Rafale",d:"Il éclaire la mer depuis plus longtemps que les éoliennes ne la regardent."},
    {r:[7,18,13,22],t:"La grève",d:"Yann, sa barque, ses casiers, et une pale d'éolienne posée là comme une baleine échouée.",e:"GRÈVE",ey:22},
    {c:'~',t:"L'océan",d:"Les quarante éoliennes en mer sont à seize kilomètres, derrière l'horizon. La navette y va."},
    {c:'s',t:"La plage",d:"Du sable, du vent, du sable dans le vent."},
    {c:'=',t:"Chemin du parc",d:"De la halte au poste de livraison, du ponton au hameau : tout le parc tient sur ce chemin en croix."}],
  ailleurs:["La lande","De la bruyère, du granit, douze éoliennes de 3 MW, et des moutons qui n'ont rien demandé."],
  /* ---- le plan : 40 cases sur 28 ----
     On marche sur : . lande   = chemin   g gravier   s sable   b ponton   q quai
     On bute contre : ~ mer   T arbre   u buisson   k rocher   W poste de livraison   B maison   R r voie */
  plan:[
    '~~~~~~~ssTuukTuukTuukTuukTuukTuukTuukTuk',
    '~~~~~~~~ss.............................T',
    '~~~~~~~~sk.............................T',
    '~kss~~~ss....u.............u...........k',
    '~sss~~~ss......................k.......T',
    '~ssk~~ss................k..............T',
    '~~~~~~ss...............................k',
    '~~~~~ss.........u......................T',
    '~~~~~ss..............WWWW..........u...T',
    '~~~~ss...............WWWW.......T....T.k',
    '~~~~ss.....k........gggggggg.u.........T',
    '~~~~~ss.............gggggggg.....BBBB..T',
    '~~~~~ss...............==.........BBBB..k',
    '~~~~~~ss..u...........==......u........T',
    '~~~~~~ss.........u....==...............T',
    '~~~~~~~ss.............==..............Tk',
    '~~~bbbbbb============================..T',
    '~~~~~~~ss============================..T',
    '~~~~~~~~ss....k.......==...............k',
    '~~~~~sss...........u..==.......k.....u.T',
    '~~~sssss..............==...............T',
    '~sssssss..............==..u............k',
    'ssssssss.u............==....u..........T',
    '.............k........==........u......T',
    '..........u.....qqqqqqqqqqqqqqq........k',
    'RRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRR',
    'rrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr',
    '....ku......ku......ku......ku......ku..'],
  legende:{'.':'herbe','=':'chemin',g:'gravier',s:'sable',b:'ponton',q:'quai','~':'eau',T:'arbre',u:'buisson',k:'rocher',R:'bordQuai',r:'rails',
    W:{sol:'gravier',pose:'batiment',mur:'#d9d5c8',toit:'#8f8b80',porte:[1.5,18,'#4f6f58'],plaque:'PDL',grilles:1,danger:1},
    B:{pose:'batiment',mur:'#b8b4a8',toit:'#4a5568',toitH:12,porte:[1.5,10,'#2f5f9a'],fenetres:[6,50]}},
  teintes:EOL_TEINTES,fleur:'#c06fb0',essence:(x,y,h)=>h>.5?2:0,

  objectif(){
    const sid='eolien',S0=VOY.sites[sid],m=voyClesManquantes(sid),n=voyInfosVues(sid).length,N=S0.infos.length,C=S0.infos.filter(f=>f.cle).length;
    if(voyTampon(sid))return n<N?`Tampon obtenu ! Il reste ${N-n} information${N-n>1?'s':''} à dénicher, à terre ou en mer. Le train du retour attend à la halte.`:"Site visité de fond en comble. Le train du retour attend à la halte, au sud.";
    if(m.length)return `Info clé suivante : ${m[0].ou} (${C-m.length}/${C})`;
    return "Infos clés réunies : Mme Suroît t'attend devant le poste de livraison, au bout du chemin.";
  },
  cibles(){return voyCibles('eolien',{cube:[27,13],courbe:[14,12],charge:[26,14],verte:[20,11]},[25,10],[2,16])},
  apres(c,ox,oy,t){voyHoule(c,ox,oy,t);voyLumiere(c,ox,oy)},

  objets(o){
    const sid='eolien',D=EOL.dit,vue=id=>voyInfoVue(sid,id);
    const pose=(x,y,kind,extra)=>o.push(Object.assign({x,y,kind,voy:1,solid:1},extra||{}));
    const decor=(x,y,kind,extra)=>o.push(Object.assign({x,y,kind,decor:1,solid:1},extra||{}));
    const gens=(x,y,who,dir,pal,act,extra)=>o.push(Object.assign({x,y,kind:'npc',solid:1,who,dir,pal,act},extra||{}));
    const source=(id,cle,qui)=>voySource(sid,id,qui,D[cle][0],D[cle][1]);

    // ---- la halte
    o.push({x:16,y:26,kind:'train',decor:1});
    for(let x=16;x<=27;x++)o.push({x,y:25,kind:'none',act:()=>voyRetour(sid)});
    gens(25,23,'Chef de halte','down',{skin:'#f1c7a1',shirt:'#27325a',pants:'#1c2440',jacket:'#27325a',hair:'#b8431f',hat:'#c43d3d',hatType:'cap',scarf:'#f7f0dc'},()=>voyParler(D.chefHalte.map(t=>({w:'Chef de halte',t})),()=>voyRetour(sid)));
    pose(21,23,'vPanneau',{theme:'eolien',teinte:'#2f6db5',act:voyDire(null,["Un grand panneau : « Parc éolien de Port-Rafale · 12 éoliennes de 3 MW sur la lande · 40 éoliennes de 8 MW en mer ».","Au feutre, en dessous : « Jours sans vent en 2025 : quelques-uns. Jours sans pluie : on cherche encore. »"])});
    pose(27,23,'vPoster',{theme:'eolien',teinte:'#2f6db5',glow:!vue('france'),act:source('france','affiche')});

    // ---- les éoliennes de la lande (six des douze sont visibles d'ici)
    [[15,11],[29,6],[12,5],[34,21],[36,3]].forEach(([x,y])=>pose(x,y,'vEolienne',{act:()=>voyParler([{t:`Une éolienne de 3 MW. ${eolEnDirect()}`}])}));
    pose(17,21,'vEolienne',{arret:1,act:source('bridage','loic','Loïc')});
    gens(18,22,'Loïc','left',{skin:'#fbe3d0',shirt:'#f2a33a',pants:'#3a4050',hair:'#5a3a22',hat:'#f7f0dc',hatType:'helmet',vest:1,bag:'#3a4050'},source('bridage','loic','Loïc'),{glow:!vue('bridage')});
    // M. Rafale et le pupitre de l'éolienne n° 1
    const courbe=voyAnimateur(sid,'courbe','M. Rafale',D.rafale[0],D.rafale[1],eolSimCourbe);
    gens(14,12,'M. Rafale','down',{skin:'#c68a5c',shirt:'#2f6db5',pants:'#274f8f',overall:'#274f8f',hair:'#2b1d14',hat:'#f2c12e',hatType:'helmet',prop:'tablet'},courbe,{glow:!vue('courbe')});
    pose(16,12,'vPupitre',{act:()=>voyParler([{t:"Le pupitre de démonstration de l'éolienne n° 1. Un curseur : le vent."}],()=>eolSimCourbe(()=>voyDonnerInfo(sid,'courbe')))});
    pose(30,7,'vPlaque',{glow:!vue('anatomie'),act:source('anatomie','plaque')});
    // le mât de mesure et Mme Bourrasque
    pose(27,13,'vMat',{glow:!vue('cube'),act:source('cube','mat')});
    const vent=voyAnimateur(sid,'charge','Mme Bourrasque',D.bourrasque[0],D.bourrasque[1],eolSimVent);
    gens(26,14,'Mme Bourrasque','down',{skin:'#7a4e30',shirt:'#8ec9e8',pants:'#3a4050',coat:'#2f9e7a',hair:'#141216',style:'tresses',lash:1,scarf:'#f2c12e',prop:'tablet'},()=>{if(vue('charge'))voyParler([{w:'Mme Bourrasque',t:D.bourrasque[1][0]},{w:'Mme Bourrasque',t:"Tu veux revoir l'année de vent ? La tablette est à toi."}],()=>eolSimVent());else vent()},{glow:!vue('charge'),info:'charge'});
    // le poste de livraison : Mme Suroît, Mme Origine, le transformateur
    gens(25,10,'Mme Suroît','down',{skin:'#e0ac7e',shirt:'#f7f0dc',pants:'#1c2440',coat:'#f2c12e',hair:'#3a2a1a',style:'carre',lash:1,hat:'#f2c12e',hatType:'bonnet',prop:'clipboard'},eolDefi,{still:1,chef:1,glow:!voyTampon(sid)&&!voyClesManquantes(sid).length});
    gens(20,11,'Mme Origine','right',{skin:'#c68a5c',shirt:'#f7f0dc',pants:'#2f3a5c',jacket:'#8a3b8f',hair:'#141216',style:'afro',lash:1,glasses:1,prop:'clipboard'},source('verte','origine','Mme Origine'),{glow:!vue('verte')});
    pose(26,10,'vTransfo',{act:voyDire(null,["Le transformateur du parc de la lande : 20 000 volts en sortie, direction le réseau de distribution.","Il bourdonne à cinquante hertz. Le vent, lui, n'a jamais réussi à tenir une note."])});o.push({x:27,y:10,kind:'none',solid:1});

    // ---- le vieux moulin, la pale, les menhirs
    pose(20,4,'vMoulin',{glow:!vue('betz'),act:source('betz','moulin')});o.push({x:21,y:4,kind:'none',solid:1,act:source('betz','moulin')});
    pose(10,20,'vPale',{glow:!vue('carbone'),act:source('carbone','pale')});[11,12].forEach(x=>o.push({x,y:20,kind:'none',solid:1,act:source('carbone','pale')}));
    [[36,22],[37,22],[38,23]].forEach(([x,y])=>decor(x,y,'menhir',{act:voyDire(null,D.menhirs)}));
    decor(25,3,'calvaire',{act:voyDire(null,D.calvaire)});
    [[13,8],[26,19],[31,9],[19,13]].forEach(([x,y])=>decor(x,y,'mouton',{act:voyDire(null,D.mouton)}));

    // ---- le hameau : la crêperie de Mme Le Goff
    pose(34,14,'vTable',{dessin:EOLT.crepes,act:voyDire(null,["Une crêpière en fonte, une pile de galettes. L'ardoise annonce : « Complète : œuf, jambon, fromage. Complète éolienne : la même, mais elle refroidit plus vite. »"])});
    gens(35,14,'Mme Le Goff','down',{skin:'#f6d3b3',shirt:'#f7f0dc',pants:'#2f3a5c',skirt:1,apron:'#2f5f9a',hair:'#ddd',bun:1,lash:1,glasses:1},source('voisins','legoff','Mme Le Goff'),{glow:!vue('voisins')});

    // ---- la grève, le ponton, la navette
    gens(9,19,'Yann','left',{skin:'#c68a5c',shirt:'#f2c12e',pants:'#2f3a5c',coat:'#f2c12e',hair:'#9a9aa2',beard:'#9a9aa2',hat:'#2f5f9a',hatType:'bonnet'},source('saison','yann','Yann'),{glow:!vue('saison')});
    decor(8,20,'barque');decor(8,18,'casier',{act:voyDire(null,D.casiers)});
    pose(8,15,'vGoeland',{act:voyDire(null,D.goeland)});
    o.push({x:2,y:4,kind:'phare',decor:1});pose(9,4,'vPlaque',{act:voyDire(null,D.phare)});
    o.push({x:0,y:16,kind:'vNavette',voy:1});
    o.push({x:2,y:16,kind:'none',solid:1,act:()=>eolEmbarquer(false)});
    gens(10,15,'Capitaine Noroît','down',{skin:'#e0ac7e',shirt:'#1f3d7c',pants:'#1c2440',coat:'#1f3d7c',hair:'#f7f0dc',beard:'#f7f0dc',hat:'#f7f0dc',hatType:'cap',scarf:'#c43d3d'},()=>voyParler(D.capitaine.map(t=>({w:'Capitaine Noroît',t})),()=>eolEmbarquer(false)),{glow:!vue('mer')||!vue('cable')});
  }
});

/* ================= LE POSTE ÉLECTRIQUE EN MER ================= */
voyCarte('eolienMer',{
  nom:'Port-Rafale · le poste en mer',depart:[12,13,'up'],
  /* ---- pour la carte (touche K) : où est le poste sur la carte du pays, comment on y va, et le nom de ses endroits ---- */
  pays:[-5.45,48.25],cote:'haut',nomCourt:'Poste en mer',acces:"Le poste électrique du parc en mer. Aucun train ne s'arrête au milieu de l'eau : on y va en navette, depuis le ponton de Port-Rafale.",
  zones:[
    {r:[8,6,17,11],t:"Le pont du poste",d:"Un pont d'acier sur quatre jambes. Les câbles des quarante éoliennes y arrivent ; deux liaisons en repartent vers la côte.",e:"POSTE EN MER"},
    {r:[11,12,13,14],t:"L'appontement",d:"La navette du capitaine Noroît y attend. Vingt minutes jusqu'au ponton de Port-Rafale."}],
  ailleurs:["Le parc en mer","Quarante éoliennes de 8 MW, à seize kilomètres de la côte. D'ici, on n'en voit que sept, et c'est déjà beaucoup."],
  /* ---- le plan : 26 cases sur 18. ~ mer   b pont du poste (on y marche) ---- */
  plan:[
    '~~~~~~~~~~~~~~~~~~~~~~~~~~',
    '~~~~~~~~~~~~~~~~~~~~~~~~~~',
    '~~~~~~~~~~~~~~~~~~~~~~~~~~',
    '~~~~~~~~~~~~~~~~~~~~~~~~~~',
    '~~~~~~~~~~~~~~~~~~~~~~~~~~',
    '~~~~~~~~~~~~~~~~~~~~~~~~~~',
    '~~~~~~~~bbbbbbbbbb~~~~~~~~',
    '~~~~~~~~bbbbbbbbbb~~~~~~~~',
    '~~~~~~~~bbbbbbbbbb~~~~~~~~',
    '~~~~~~~~bbbbbbbbbb~~~~~~~~',
    '~~~~~~~~bbbbbbbbbb~~~~~~~~',
    '~~~~~~~~bbbbbbbbbb~~~~~~~~',
    '~~~~~~~~~~~~bb~~~~~~~~~~~~',
    '~~~~~~~~~~~~bb~~~~~~~~~~~~',
    '~~~~~~~~~~~~~~~~~~~~~~~~~~',
    '~~~~~~~~~~~~~~~~~~~~~~~~~~',
    '~~~~~~~~~~~~~~~~~~~~~~~~~~',
    '~~~~~~~~~~~~~~~~~~~~~~~~~~'],
  legende:{'~':'eau',b:{sol:'dalleTech',teinte:'#b9c0c9',grille:1}},
  teintes:{eau:['#2f78b8','#256399','#5a9fd0','#d8e8f2']},helico:[14,9],
  finitions:EOLP.finitionsMer,
  objectif(){
    const sid='eolien',m=voyClesManquantes(sid).filter(f=>f.id==='mer'||f.id==='cable');
    return m.length?`Le poste en mer : ${m.length} info${m.length>1?'s':''} clé${m.length>1?'s':''} à trouver ici. Prochaine piste : ${m[0].ou}.`:"Tu as vu l'essentiel du large. La navette te ramène à terre quand tu veux.";
  },
  cibles(){return voyCibles('eolien',{mer:[17,9],cable:[11,8]},null,[12,14])},
  apres(c,ox,oy,t){voyHoule(c,ox,oy,t);voyLumiere(c,ox,oy)},
  objets(o){
    const sid='eolien',D=EOL.dit,vue=id=>voyInfoVue(sid,id);
    const pose=(x,y,kind,extra)=>o.push(Object.assign({x,y,kind,voy:1,solid:1},extra||{}));
    const source=(id,cle,qui)=>voySource(sid,id,qui,D[cle][0],D[cle][1]);
    // les éoliennes du large : on ne les approche pas, on les regarde
    [[5,5],[20,6],[6,14],[20,15],[13,3],[2,10],[23,11]].forEach(([x,y])=>o.push({x,y,kind:'vEolienneMer',voy:1}));
    // sur le pont
    pose(9,6,'vTransfo',{act:voyDire(null,D.transfo)});o.push({x:10,y:6,kind:'none',solid:1,act:voyDire(null,D.transfo)});
    pose(13,6,'vTable',{dessin:EOLT.fondations,glow:!vue('fondations'),act:source('fondations','fondations')});
    pose(16,6,'vGrue',{act:voyDire(null,D.grue)});
    const chemin=voyAnimateur(sid,'cable','Mlle Alizé',D.alize[0],D.alize[1],eolSimChemin);
    o.push({x:11,y:8,kind:'npc',solid:1,who:'Mlle Alizé',dir:'down',glow:!vue('cable'),pal:{skin:'#c68a5c',shirt:'#f2a33a',pants:'#1c2440',overall:'#f2a33a',hair:'#1c1c22',style:'queue',lash:1,hat:'#f7f0dc',hatType:'helmet',prop:'tablet'},act:chemin});
    pose(17,9,'vLongueVue',{glow:!vue('mer'),act:source('mer','longuevue')});
    pose(8,11,'vGoeland',{act:voyDire(null,D.goelandMer)});
    o.push({x:14,y:10,kind:'none',act:voyDire(null,D.helico)});
    // la navette du retour
    o.push({x:11,y:14,kind:'vNavette',voy:1});
    o.push({x:12,y:14,kind:'none',solid:1,act:()=>eolEmbarquer(true)});
    o.push({x:13,y:13,kind:'npc',solid:1,who:'Capitaine Noroît',dir:'left',pal:{skin:'#e0ac7e',shirt:'#1f3d7c',pants:'#1c2440',coat:'#1f3d7c',hair:'#f7f0dc',beard:'#f7f0dc',hat:'#f7f0dc',hatType:'cap',scarf:'#c43d3d'},act:()=>voyParler(D.capitaineMer.map(t=>({w:'Capitaine Noroît',t})),()=>eolEmbarquer(true))});
  }
});

/* ---- la navette : de la lande au poste en mer, et retour ---- */
function eolEmbarquer(retour){
  const ov=voyPanneau('La navette du parc en mer'),b=ov.querySelector('.pbody');
  b.innerHTML=`<p>${retour?"La navette est amarrée au pied du poste. Vingt minutes jusqu'au ponton de Port-Rafale.":"La navette du capitaine Noroît est amarrée au bout du ponton. Vingt minutes de mer jusqu'au poste électrique, au milieu des quarante éoliennes."}</p><div class="row"><button class="btn" id="vOui">${retour?'Rentrer à terre':'Embarquer'} ▸</button><button class="btn alt" id="vNon">Rester ici</button></div>`;
  b.querySelector('#vNon').onclick=closePanel;b.querySelector('#vOui').focus();
  b.querySelector('#vOui').onclick=()=>{closePanel();trk('voyage_train',{vers:retour?'eolien-terre':'eolien-mer'});
    voyFenetre({de:retour?'Le poste en mer':'Port-Rafale',vers:retour?'Port-Rafale':'Le poste en mer',dessiner:(x,f,d)=>eolTraversee(x,f,d,retour),
      annonces:retour?["Capitaine Noroît : « On rentre. Regardez derrière vous : d'ici, quarante éoliennes tiennent dans une main. »"]:["Capitaine Noroît : « Seize kilomètres. Fixez l'horizon, pas vos chaussures. »","« Droit devant, les éoliennes. Chacune fait deux cents mètres de haut. Vous allez les trouver petites. Puis plus du tout. »"],
      fin(){if(retour)warp('eolien',3,16,'right');else{warp('eolienMer',12,13,'up');toast('Le poste électrique en mer');const v=voyEtat();if(!v.faits['eolien.mer']){v.faits['eolien.mer']=1;save();qkTimeout(()=>{if(!busy&&!dlg.open)voyParler([{t:"Le poste électrique en mer : un pont d'acier sur quatre jambes, au milieu des éoliennes. Tout ce que le parc produit passe par ici."},{t:"Ça bouge un peu. Non, c'est toi."}])},450)}}}});
  };
}
/* en direct du ciel : les éoliennes de la lande tournent avec le vent du jeu */
function eolEnDirect(){
  const kmh=Math.round(SKY.wind*62),p=eolPuissance(kmh/3.6*1.6);   // le vent mesuré au sol est plus faible qu'à hauteur de nacelle
  return kmh<5?"Calme plat aujourd'hui : elle attend. Les goélands aussi.":p>=1?`${kmh} km/h au sol : elle tourne à pleine puissance. C'est une journée à faire sourire Mme Suroît.`:p>0?`${kmh} km/h au sol : elle produit environ ${Math.round(p*100)} % de sa puissance.`:"Trop peu de vent là-haut pour produire. Elle s'oriente, et elle patiente.";
}
VOY.sites.eolien.arriver=()=>{if(!busy&&!dlg.open&&!voyEtat().faits['eolien.arrivee']){voyEtat().faits['eolien.arrivee']=1;save();voyParler(EOL.dit.arrivee)}};
