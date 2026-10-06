/* Wattlings · jeu/voyages/datacenter/carte.js
   Data center du quai des Octets : le plan du site, et tout ce qui est posé dessus.
   Au sud, la halte et le parvis ; au centre, le bâtiment vu de dessus (hall, salle des serveurs, salle de calcul,
   salle de contrôle, local des batteries) ; au nord, le quai du port et la mer.
   Les textes sont dans textes.js, les dessins dans dessins.js, les simulations dans simulations.js. */

voyCarte('datacenter',{
  nom:'Data center du quai des Octets',depart:[21,24],region:'provence',musique:'indoor',
  /* ---- pour la carte (touche K) : le nom des endroits du site. r : le rectangle [x0,y0,x1,y1] ; t, d : ce que dit l'encart ; e : l'étiquette écrite sur le plan ---- */
  zones:[
    {r:[13,24,30,24],t:"Halte du quai des Octets",d:"Le train du retour attend à quai, à deux pas du port.",e:"HALTE",ey:27},
    {r:[0,25,39,26],t:"Voie ferrée",d:"La ligne d'Ampère-sur-Loire, par Lyon et Avignon. Terminus : la mer."},
    {c:'~',t:"La Méditerranée",d:"Des câbles sous-marins y arrivent de trois continents. C'est pour eux que le data center est ici, pas pour la vue."},
    {r:[0,3,39,4],t:"Le quai des Octets",d:"Des conteneurs, des bittes d'amarrage, et une trappe jaune sous laquelle passe une bonne part de l'internet.",e:"QUAI",ex:24},
    {r:[5,5,18,5],t:"Le froid",d:"Conduites et échangeur : la chaleur des serveurs sort du bâtiment par ici. Mme Calorie aimerait qu'elle serve à quelqu'un."},
    {r:[26,5,36,5],t:"Les groupes électrogènes",d:"Des moteurs diesel et trois jours de fioul. Ils ne tournent presque jamais : on les paie pour attendre."},
    {r:[5,6,18,13],t:"Salle des serveurs",d:"Les baies, rangées en allées froides et allées chaudes. Mlle Octet y cherche les serveurs qui tournent pour rien.",e:"SALLE DES SERVEURS",ey:13},
    {r:[5,14,18,19],t:"Salle de calcul",d:"Les baies les plus denses du bâtiment. M. Token y explique ce que consomme une question posée à une machine.",e:"SALLE DE CALCUL"},
    {r:[19,6,25,20],t:"Le hall",d:"M. Badge, le mur d'écrans, un distributeur de boissons. Mme Quatreneuf y attend les visiteurs qui ont tout vu.",e:"HALL",ey:9},
    {r:[26,6,35,12],t:"Salle de contrôle",d:"La courbe plate de M. Talon, et le pupitre de Mme Ratio : c'est ici qu'on compte ce que le bâtiment consomme en plus des serveurs.",e:"SALLE DE CONTRÔLE"},
    {r:[26,13,35,19],t:"Local des batteries",d:"De quoi tenir une dizaine de minutes sans le réseau, le temps que les groupes électrogènes démarrent.",e:"BATTERIES",ey:18},
    {r:[15,21,29,23],t:"Le parvis",d:"L'entrée du data center. Pas d'enseigne, pas de fenêtre : la discrétion fait partie du service."},
    {r:[1,5,37,23],t:"L'enceinte",d:"Du bitume, des murs sans fenêtre, des caméras. Les données n'aiment pas les courants d'air."}],
  ailleurs:["Les abords du port","Du soleil, des cailloux, et le bruit de fond des ventilateurs."],
  /* ---- le plan : 40 cases sur 28 ----
     On marche sur : . herbe   a bitume   b quai du port   q quai de la halte   o sol technique   c allée froide   e allée chaude
     On bute contre : ~ mer   W mur   x armoire de serveurs   h armoire de calcul   T arbre   u buisson   k rocher   R r voie */
  plan:[
    '~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~',
    '~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~',
    '~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~',
    'bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb',
    'bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb',
    '.aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa.',
    '.aaaWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWaaa.',
    '.aaaWoooooooooooooWooooooWoooooooooWaaa.',
    'uaaaWoxxxxxxxxxxxoWooooooWoooooooooWaaa.',
    '.aaaWcccccccccccccWooooooWoooooooooWaaa.',
    '.aaaWoxxxxxxxxxxxooooooooooooooooooWaaau',
    '.aaaWeeeeeeeeeeeeeWooooooWoooooooooWaaa.',
    '.aaaWoxxxxxxxxxxxoWooooooWoooooooooWaaa.',
    '.aaaWcccccccccccccWooooooWWWWWWWWWWWaaa.',
    '.aaaWWWWWWWWWWWWWWWooooooWoooooooooWaaa.',
    '.aaaWoooooooooooooWooooooWoooooooooWaaa.',
    'TaaaWoohhhhhhoooooWooooooooooooooooWaaa.',
    '.aaaWooooooooooooooooooooWoooooooooWaaa.',
    '.aaaWoooooooooooooWooooooWoooooooooWaaaT',
    '.aaaWoooooooooooooWooooooWoooooooooWaaa.',
    '.aaaWWWWWWWWWWWWWWWWWooWWWWWWWWWWWWWaaa.',
    '.aaa...u.......aaaaaaaaaaaaaa...u...aaa.',
    '.aaa.T.....T...aaaaaaaaaaaaaa..T....aaa.',
    '.aaa....u......aaaaaaaaaaaaaa....u..aaa.',
    '....u....k...qqqqqqqqqqqqqqqqq.T...u....',
    'RRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRR',
    'rrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr',
    '..k...u...k...u...k...u...k...u...k...u.'],
  legende:{'.':'herbe',a:'asphalte',b:'beton',q:'quai','~':'eau',T:'arbre',u:'buisson',k:'rocher',R:'bordQuai',r:'rails',W:'mur',
    o:'dalleTech',c:{sol:'dalleTech',teinte:'#cfe2f2',grille:1},e:{sol:'dalleTech',teinte:'#f4d9cf'},
    x:{sol:'dalleTech',pose:DATP.baie},h:{sol:'dalleTech',pose:DATP.baie,ia:1}},
  /* Marseille : l'herbe sèche de la Provence, une mer bien bleue, des murs gris */
  teintes:{herbe:['#c9bd78','#d2c682','#dacf8e'],brin:['#9aa45a','#e6dca0'],pierre:['#e0d6ba','#b3a78a','#f4eeda'],eau:['#2f86c8','#2470ac','#62aee0','#dceefa']},
  essence:(x,y,h)=>h>.5?5:4,mur:{dessus:'#3a4050',face:'#d9dde3',plinthe:'#8a93a3'},batiment:[4,6,35,20],

  objectif(){
    const sid='datacenter',S0=VOY.sites[sid],m=voyClesManquantes(sid),n=voyInfosVues(sid).length,N=S0.infos.length,C=S0.infos.filter(f=>f.cle).length;
    if(voyTampon(sid))return n<N?`Tampon obtenu ! Il reste ${N-n} information${N-n>1?'s':''} à dénicher, dans les salles ou sur le quai. Le train du retour attend à la halte.`:"Site visité de fond en comble. Le train du retour attend à la halte, au sud.";
    if(m.length)return `Data center : visite les salles et le quai, réunis les infos clés (${C-m.length}/${C}). Prochaine piste : ${m[0].ou}.`;
    return "Infos clés réunies : Mme Quatreneuf t'attend dans le hall.";
  },
  cibles(){return voyCibles('datacenter',{salle:[20,12],chaleur:[5,11],pue:[32,9],plate:[27,8],secours:[29,16],fatale:[15,5]},[20,15])},
  /* les diodes clignotent ; dehors, il fait jour ou nuit comme en ville ; dedans, la lumière ne s'éteint jamais */
  apres(c,ox,oy,t){
    datDiodes(c,ox,oy,t);voyHoule(c,ox,oy,t);
    const B=MAPS.datacenter.batiment;c.save();c.beginPath();c.rect(0,0,cv.width,cv.height);c.rect(B[0]*16-ox,B[1]*16-oy,(B[2]-B[0]+1)*16,(B[3]-B[1]+1)*16);c.clip('evenodd');voyLumiere(c,ox,oy);c.restore();
  },

  objets(o){
    const sid='datacenter',D=DAT.dit,vue=id=>voyInfoVue(sid,id);
    const pose=(x,y,kind,extra)=>o.push(Object.assign({x,y,kind,voy:1,solid:1},extra||{}));
    const decor=(x,y,kind,extra)=>o.push(Object.assign({x,y,kind,decor:1,solid:1},extra||{}));
    const gens=(x,y,who,dir,pal,act,extra)=>o.push(Object.assign({x,y,kind:'npc',solid:1,who,dir,pal,act},extra||{}));
    const source=(id,cle,qui)=>voySource(sid,id,qui,D[cle][0],D[cle][1]);

    // ---- la halte et le parvis
    o.push({x:15,y:26,kind:'train',decor:1});
    for(let x=15;x<=26;x++)o.push({x,y:25,kind:'none',act:()=>voyRetour(sid)});
    gens(24,23,'Chef de halte','down',{skin:'#c68a5c',shirt:'#27325a',pants:'#1c2440',jacket:'#27325a',hair:'#1c1c22',hat:'#c43d3d',hatType:'cap',beard:'#1c1c22'},()=>voyParler(D.chefHalte.map(t=>({w:'Chef de halte',t})),()=>voyRetour(sid)));
    pose(17,23,'vPanneau',{theme:'datacenter',teinte:'#3a4050',act:voyDire(null,["Un panneau, discret : « Quai des Octets · 10 MW informatiques · 2 000 baies · disponibilité 99,98 % ».","Pas de logo, pas de nom de client. Une ligne en bas : « Si vous savez ce qu'il y a dedans, vous n'avez pas besoin de panneau. »"])});
    pose(26,23,'vPoster',{theme:'datacenter',teinte:'#3a4050',glow:!vue('carbone'),act:source('carbone','affiche')});

    // ---- le hall : M. Badge, le mur d'écrans, M. Placard, Mme Quatreneuf
    o.push({x:21,y:6,kind:'vEcranMonde',voy:1,glow:!vue('monde'),act:source('monde','ecrans')},{x:22,y:6,kind:'none',act:source('monde','ecrans')});
    gens(23,18,'M. Badge','left',{skin:'#e0ac7e',shirt:'#f7f0dc',pants:'#1c2440',jacket:'#1c2440',hair:'#2b1d14',tie:'#3a4050',glasses:1},source('tier','badge','M. Badge'),{glow:!vue('tier')});
    gens(20,12,'M. Placard','right',{skin:'#f1c7a1',shirt:'#8ec9e8',pants:'#59627c',jacket:'#8a6a4a',hair:'#9a9aa2',glasses:1,tie:'#c0503a',bag:'#6b4a2b'},source('salle','placard','M. Placard'),{glow:!vue('salle')});
    gens(20,15,'Mme Quatreneuf','right',{skin:'#c68a5c',shirt:'#f7f0dc',pants:'#1c2440',jacket:'#3a4050',hair:'#1c1c22',style:'carre',lash:1,scarf:'#3be07a',prop:'tablet'},datDefi,{still:1,chef:1,glow:!voyTampon(sid)&&!voyClesManquantes(sid).length});
    decor(24,7,'vending',{act:voyDire(null,D.cafe)});o.push({x:19,y:7,kind:'plant',solid:1},{x:19,y:19,kind:'plant',solid:1},{x:24,y:19,kind:'plant',solid:1});

    // ---- la salle des serveurs : Mlle Octet, le thermostat, la sonde de l'allée chaude
    o.push({x:10,y:6,kind:'vThermostat',voy:1,glow:!vue('consigne'),act:source('consigne','thermostat')});
    const zombies=voyAnimateur(sid,'zombies','Mlle Octet',D.octet[0],D.octet[1],datSimZombies);
    gens(13,7,'Mlle Octet','down',{skin:'#f6d3b3',shirt:'#1c2440',pants:'#3a4050',jacket:'#2aa198',hair:'#8a3b8f',style:'boucle',lash:1,glasses:1,prop:'tablet'},zombies,{glow:!vue('zombies')});
    pose(5,11,'vSonde',{glow:!vue('chaleur'),act:source('chaleur','sonde')});
    [[8,8],[13,10],[9,12]].forEach(([x,y])=>o.push({x,y,kind:'none',act:voyDire(null,D.baie)}));

    // ---- la salle de calcul : M. Token
    gens(14,17,'M. Token','left',{skin:'#c68a5c',shirt:'#f2a33a',pants:'#1c2440',hair:'#1c1c22',glasses:1,hat:'#1c2440',hatType:'cap',prop:'tablet'},source('ia','token','M. Token'),{glow:!vue('ia')});
    o.push({x:9,y:16,kind:'none',act:voyDire(null,D.baieIA)});

    // ---- la salle de contrôle : M. Talon et sa courbe plate, Mme Ratio et son pupitre
    o.push({x:28,y:6,kind:'vEcranPlat',voy:1,act:voyDire(null,["L'écran de M. Talon : la courbe de charge du site sur sept jours. Une ligne verte, parfaitement horizontale. Un curseur la parcourt consciencieusement, à la recherche d'un événement."])},{x:29,y:6,kind:'none',act:voyDire(null,["La courbe plate. Lundi ressemble à dimanche, qui ressemble à 3 h du matin."])});
    gens(27,8,'M. Talon','down',{skin:'#f1c7a1',shirt:'#f7f0dc',pants:'#59627c',hair:'#b8431f',beard:'#b8431f',glasses:1,tie:'#2aa198',prop:'clipboard'},source('plate','talon','M. Talon'),{glow:!vue('plate')});
    const pue=voyAnimateur(sid,'pue','Mme Ratio',D.ratio[0],D.ratio[1],datSimPue);
    gens(32,9,'Mme Ratio','down',{skin:'#e0ac7e',shirt:'#2aa198',pants:'#2f3a5c',jacket:'#f7f0dc',hair:'#5a3a22',style:'queue',lash:1,glasses:1,prop:'tablet'},pue,{glow:!vue('pue')});
    pose(33,9,'vPupitre',{act:()=>voyParler([{t:"Le pupitre du jumeau numérique : une consigne, trois interrupteurs, et un chiffre qui réagit."}],()=>datSimPue(()=>voyDonnerInfo(sid,'pue')))});
    [[30,11],[33,11]].forEach(([x,y])=>pose(x,y,'vPoste',{act:voyDire(null,D.bureau)}));

    // ---- le local des batteries : Mmes Redondance
    for(let x=27;x<=33;x++)pose(x,14,'vBatterie',{act:voyDire(null,["Une armoire de batteries. Elle ne sert presque jamais : quelques secondes par an. Ces quelques secondes justifient toute la rangée."])});
    const R1={skin:'#f6d3b3',shirt:'#f7f0dc',pants:'#1c2440',jacket:'#2f6db5',hair:'#d9a441',style:'carre',lash:1,hat:'#f7f0dc',hatType:'helmet',prop:'clipboard'};
    gens(29,16,'Mme Redondance','down',R1,source('secours','redondance','Mme Redondance'),{glow:!vue('secours')});
    gens(31,16,'Mme Redondance','down',R1,voyDire('Mme Redondance',D.redondance2));

    // ---- côté quai : les conduites, l'échangeur et Mme Calorie, les groupes électrogènes, la trappe aux câbles
    pose(8,5,'vConduites',{glow:!vue('eau'),act:source('eau','conduites')});
    pose(12,5,'vEchangeur',{act:voyDire(null,["L'échangeur. D'un côté, l'eau tiède du data center ; de l'autre, celle du réseau de chaleur du quartier. Elles ne se touchent pas : seule la chaleur traverse."])});o.push({x:13,y:5,kind:'none',solid:1});
    gens(15,5,'Mme Calorie','down',{skin:'#c68a5c',shirt:'#e2573b',pants:'#3a4050',overall:'#3a4050',hair:'#2b1d14',style:'boucle',lash:1,hat:'#f7f0dc',hatType:'helmet',prop:'tablet'},source('fatale','calorie','Mme Calorie'),{glow:!vue('fatale')});
    [27,29,31,33].forEach(x=>pose(x,5,'vGroupe',{act:voyDire(null,D.groupe)}));pose(35,5,'vCuve',{act:voyDire(null,D.cuve)});
    pose(20,3,'vTrappe',{glow:!vue('cables'),act:source('cables','trappe')});
    [5,25,37].forEach(x=>pose(x,3,'vBitte'));pose(11,3,'vBitte',{act:voyDire(null,D.pointu)});o.push({x:10,y:1,kind:'vPointu',voy:1});
    pose(30,3,'vConteneurs',{act:voyDire(null,D.conteneurs)});o.push({x:31,y:3,kind:'none',solid:1});
    pose(17,3,'vGoeland',{act:voyDire(null,D.gabian)});
  }
});
VOY.sites.datacenter.arriver=()=>{if(!busy&&!dlg.open&&!voyEtat().faits['datacenter.arrivee']){voyEtat().faits['datacenter.arrivee']=1;save();voyParler(DAT.dit.arrivee)}};
