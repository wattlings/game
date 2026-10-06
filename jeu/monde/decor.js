/* Wattlings · jeu/monde/decor.js
   Pose du décor sur chaque carte. */

/* ---- objets de décor par carte ---- */
const freeTile=(x,y,o)=>{const t=MAPS.town.g[y]&&MAPS.town.g[y][x];return(t==='.'||t==='*'||t===','||t==='d')&&!o.some(q=>q.x===x&&q.y===y)};
const DECOR_CACHE={k:'',l:[]};
function decorObjs(id,o){
  if(id==='town'){const k=S.ch+'|'+S.site+'|'+(S.ch>=4&&!missingReq(4).length)+'|'+PREF.wear;if(DECOR_CACHE.k!==k){const l=o.slice();decorBuild(id,l);DECOR_CACHE.k=k;DECOR_CACHE.l=l.slice(o.length)}for(const d of DECOR_CACHE.l)o.push(d);return}
  decorBuild(id,o);
}
function decorBuild(id,o){
  const D=(x,y,kind,solid,extra)=>o.push(Object.assign({x,y,kind,solid:solid?1:0,flat:kind==='rug'?1:0,decor:1},extra||{}));
  if(id==='town'){
    const G0=MAPS.town.g,T=(x,y,kind,solid,extra)=>{const p=TP(x,y);D(p[0],p[1],kind,solid,extra)},Wt=(x,y,kind)=>{const p=LW(x,y),t=G0[p[1]]&&G0[p[1]][p[0]];if(t==='R'||t==='~')D(p[0],p[1],kind,0)};
    TOWN_GATES.forEach(G=>{if(S.ch<G.need)D(G.x,G.y,'gate',1,{act:()=>say(gateMsg(G.q))})});
    // plaques de quartier
    [[1,55,21],[2,74,25],[3,74,47],[4,69,57],[4,58,51],[5,42,57],[6,17,57],[7,16,39],[7,17,21],[8,21,21],[9,34,39],[0,55,39]].forEach(([n,x,y])=>{const Q=QUARTERS[n];
      T(x,y,'qsign',1,{n,col:Q.col,act:()=>say([{t:Q.step?`${Q.name} · ${Q.reg} · étape ${Q.step}. Ici : les informations de l'étape et l'${ARENAS[n-1].name}.`:`${Q.name} · ${Q.reg}. ${Q.sub}.`}])})});
    // gare : train à quai, tableau des départs
    D(L.train[0],L.train[1],'train',0);
    {const g=BLD.find(b=>b.id==='gare'),a=()=>voyOuvert()?gareTableauDehors():say([{t:"Tableau des départs. Toutes les lignes affichent « — »."},{t:"En bas, en petit : « Prochainement : d'autres villes, d'autres bâtiments, d'autres compteurs. »"}]);STATION_BOARD.forEach(k=>D(g.x+k,g.y+g.h-1,'none',0,{act:a}))}      // le tableau est accroché au mur de la gare
    T(53,11,'bench',1);T(59,11,'bench',1);
    // place de la Donnée : fontaine, pompe à vélo, bancs
    {const fa=()=>say([{t:"La fontaine de la place. Elle tourne en circuit fermé : un compteur d'eau, zéro fuite. Enfin, en principe."}]);const [fx,fy]=L.fountain;D(fx,fy,'fountain',1,{act:fa});D(fx+1,fy,'none',1,{act:fa});D(fx,fy+1,'none',1,{act:fa});D(fx+1,fy+1,'none',1,{act:fa})}
    T(59,39,'pump',1,{act:()=>say([{t:"Une station de gonflage en libre-service. Ici, tout le monde roule à vélo : la ville n'a pas une seule voiture."}])});
    T(49,35,'bench',1);T(66,35,'bench',1);T(59,35,'flowerbed',1);T(60,35,'flowerbed',1);T(64,38,'flowerbed',1);T(50,39,'bsign',1);
    // parcs, étang, rivière
    T(23,35,'bench',1);T(28,38,'bench',1);Wt(25,36,'duck');Wt(27,37,'duck');Wt(45,30,'duck');Wt(46,49,'duck');Wt(45,67,'duck');Wt(46,13,'duck');
    Wt(47,37,'boat');Wt(44,54,'boat');
    T(58,63,'bench',1);T(62,63,'bench',1);T(59,61,'flowerbed',1);T(61,61,'flowerbed',1);T(30,63,'bench',1);T(24,61,'flowerbed',1);
    T(41,35,'bsign',1);T(34,25,'flowerbed',1);T(31,25,'flowerbed',1);
    // station météo
    {const M=L.meteo,one=f=>()=>say([{t:f()}]);
      D(M.x0+1,M.y0+2,'anemo',1,{act:one(()=>`Anémomètre : ${Math.round(SKY.wind*62)} km/h. ${SKY.wind>.7?"Les coupelles s'affolent.":SKY.wind<.15?'Les coupelles tournent à peine.':'Les coupelles tournent tranquillement.'}`)});
      D(M.x0+3,M.y0+2,'sbox',1,{act:one(()=>`Abri météo : ${Math.round(SKY.T)} °C sous abri. Moyenne du jour : ${String(Math.round(SKY.Tm*10)/10).replace('.',',')} °C, soit ${djuPhrase()}.`)});
      D(M.x0+4,M.y0+1,'gauge',1,{act:one(()=>`Pluviomètre : ${SKY.snow>0||SKY.snowG?'plein de neige. Il faudra la faire fondre pour la mesurer':SKY.rain>.1?"il se remplit à vue d'œil":SKY.wet>.3?'quelques millimètres, tombés il y a peu':'à sec'}.`)})}
    // quartiers : détails
    T(79,24,'transfo',1);T(13,36,'cone',1);T(14,37,'cone',1);T(3,38,'cone',1);T(12,34,'cargo',1);
    // mobilier urbain : placé seulement sur une case libre
    const F=(x,y,kind,extra)=>{const p=LW(x,y);if(freeTile(p[0],p[1],o))D(p[0],p[1],kind,extra&&extra.solid===0?0:1,extra)};
    for(let x=24;x<=70;x+=6){F(x,21,'lamp');F(x+2,60,'lamp')}
    for(let y=27;y<=56;y+=6){F(17,y,'lamp');F(74,y+1,'lamp');F(58,y,'lamp');F(31,y+2,'lamp');F(55,y+3,'lamp')}
    for(let y=13;y<=20;y+=4)F(58,y,'lamp');      // pas en y=12 : le lampadaire cachait le chef de gare
    F(68,34,'slide',{act:()=>say([{t:"Le toboggan de l'école. Énergie potentielle en haut, énergie cinétique en bas. Aucun kWh facturé."}])});F(69,35,'swing');
    F(40,44,'picnic');F(41,46,'picnic');F(36,37,'picnic');F(22,33,'picnic');F(63,66,'picnic');F(77,43,'picnic');
    F(36,12,'statue',{act:()=>say([{t:"Un monument : trois barres dorées, de plus en plus hautes. Sur le socle : « Ce qui n'est pas mesuré n'est pas prouvé. »"}])});
    F(30,10,'bench');F(33,13,'bench');F(38,9,'flowerbed');F(34,10,'flowerbed');F(27,12,'picnic');
    F(13,35,'scaffold');F(14,35,'scaffold');F(11,36,'pallet');F(4,37,'pallet');F(16,30,'pallet');F(12,29,'garden');F(13,29,'garden');F(12,30,'garden');F(3,29,'garden');
    F(54,39,'repair',{act:()=>say([{t:"Une borne de réparation : clés, démonte-pneus, pied d'atelier. Tout est attaché par des câbles, par expérience."}])});
    F(60,39,'recycle');F(35,39,'recycle');F(80,29,'recycle');F(15,49,'recycle');F(62,22-1,'recycle');
    F(27,45,'cart');F(31,46,'pallet');F(28,46,'cargo');
    F(8,51,'bench');F(5,56,'lamp');F(14,60,'lamp');F(10,66,'bench');F(78,56,'bench');F(83,57,'lamp');F(76,23,'bench');
    // traces de vie : linge qui sèche, marelle à la craie, vélo couché, ballon oublié, nain de jardin, tas de feuilles (plus ou moins selon la patine)
    const say1=t=>()=>say([{t}]),lv=wearLvl();
    if(lv>1){
      [[11,26],[5,60],[55,18]].forEach(([x,y])=>{if(freeTile(x,y,o)&&freeTile(x+1,y,o)){const a=()=>say([{t:skWet()||SKY.dark>=.35?"Un fil à linge, vide. Quelqu'un a tout rentré à temps.":"Du linge qui sèche au vent. Le sèche-linge le plus sobre du quartier : zéro kWh par cycle."}]);D(x,y,'laundry',1,{act:a});D(x+1,y,'none',1,{act:a})}});
      D(66,33,'chalk',0,{flat:1,act:()=>say([{t:SKY.snowG?"Il y avait une marelle ici. Elle dort sous la neige.":SKY.wet>.35?"Il y avait une marelle ici. La pluie a tout effacé, comme d'habitude.":"Une marelle tracée à la craie. Après la case 4, quelqu'un a dessiné une maison et un cœur. La pluie effacera tout, comme d'habitude."}])});
      [[67,37],[29,60],[41,45],[12,52],[78,43],[36,58],[70,45],[9,40],[62,13]].slice(0,[0,2,5,7,9][lv-1]).forEach(([x,y])=>{if(freeTile(x,y,o))D(x,y,'bikedown',0,{act:say1("Un vélo couché dans l'herbe. Son propriétaire ne doit pas être bien loin.")})});
      F(66,36,'ball',{solid:0,act:say1("Un ballon oublié. La récréation a dû se terminer en catastrophe.")});
      if(lv>2)F(4,31,'gnome',{act:say1("Un nain de jardin. Il fixe le compteur d'un air soupçonneux.")});
      [[27,30],[62,67],[24,47],[70,10],[39,62],[8,53],[80,20]].slice(0,[0,2,4,6,7][lv-1]).forEach(([x,y])=>F(x,y,'leafpile'));
    }
    regDecorBuild(o,D,F);
    // arceaux à vélos devant chaque bâtiment
    BLD.forEach(b=>{const [dx,dy]=b.door;for(const [a,c] of [[3,1],[-3,1],[4,1],[-4,1]]){if(freeTile(dx+a,dy+c,o)){D(dx+a,dy+c,'brack',1);break}}});
    [[58,25],[31,43],[75,55],[16,53],[22,57],[69,22-1],[47,21]].forEach(([x,y])=>F(x,y,'bike'));
  }
  if(id==='office'){D(4,5,'rug',0,{w:3,col:'#39426a',col2:'#4a5588'});D(5,2,'cooler',1);D(7,2,'filing',1);D(9,4,'desk',1);D(3,1,'clockw',0);D(10,5,'coat',1);D(1,4,'printer',1)}
  if(id==='mairie'){D(5,6,'rug',0,{w:4});D(5,5,'table',1);D(6,5,'table',1);D(7,5,'table',1);D(4,5,'chair',1);D(8,5,'chair',1);D(11,1,'flagfr',0);D(7,1,'frame',0,{c2:'#5b6380',c3:'#f1c7a1'});D(1,4,'filing',1);D(12,4,'lampf',1);D(4,2,'cooler',1)}
  if(id==='rdc'){D(1,1,'ext',0);D(8,1,'clockw',0);D(6,9,'coat',1);D(4,1,'bikewall',0,{col:'#2f6db5'});D(14,9,'plant',1)}
  if(id==='cave'){D(3,1,'pipes',0);D(4,1,'pipes',0);D(5,1,'pipes',0);D(1,6,'filing',1);D(7,1,'ext',0)}
  if(id==='local'){const k=S.inside;
    if(k==='enedis'){D(4,3,'counter',1);D(6,3,'counter',1);D(2,1,'screenw',0);D(4,1,'banner',0,{w:2,col:'#2f6db5'});D(8,3,'transfo',1);D(8,5,'chairs',1);D(4,5,'rug',0,{w:3,col:'#39426a',col2:'#4a78c9'});D(1,2,'filing',1)}
    if(k==='grdf'){D(4,3,'counter',1);D(6,3,'counter',1);D(6,1,'pipes',0);D(7,1,'pipes',0);D(8,1,'pipes',0);D(1,2,'bottle',1);D(1,3,'bottle',1);D(8,5,'chairs',1);D(9,2,'filing',1);D(4,5,'rug',0,{w:3,col:'#7a4a2a',col2:'#e2573b'})}
    if(k==='voltco'){D(4,3,'counter',1);D(6,3,'counter',1);D(2,1,'banner',0,{w:2,col:'#c43d3d'});D(5,1,'screenw',0);D(1,5,'sofa',1);D(1,2,'vending',1);D(8,5,'chairs',1);D(4,5,'rug',0,{w:3})}
    if(k==='pharma'){D(4,3,'counter',1);D(6,3,'counter',1);D(1,2,'pshelf',1);D(2,2,'pshelf',1);D(3,2,'pshelf',1);D(7,2,'pshelf',1);D(9,2,'pshelf',1);D(5,1,'cross',0);D(8,5,'chairs',1);D(1,5,'stool',1)}
    if(k==='media'){D(6,2,'shelf',1);D(7,2,'shelf',1);D(1,4,'cart',1);D(1,6,'globe',1);D(6,5,'rug',0,{w:2,col:'#2f6d34',col2:'#3f8a4a'});D(4,1,'frame',0);D(5,1,'clockw',0)}
    if(k==='cabinet'){D(2,1,'frame',0,{c2:'#f7f0dc',c3:'#c43d3d'});D(4,3,'desk',1);D(1,2,'filing',1);D(9,2,'coat',1);D(2,5,'chairs',1);D(7,1,'clockw',0);D(8,5,'rug',0,{w:1,col:'#2f9e7a',col2:'#8fe0c0'})}
    if(k==='maison'){D(5,2,'kitchen',1);D(6,2,'kitchen',1);D(7,2,'fridge',1);D(1,2,'lampf',1);D(2,3,'rug',0,{w:2});D(2,5,'table',1);D(3,5,'chair',1);D(4,1,'frame',0);D(8,1,'bikewall',0);D(9,5,'plant',1);D(6,1,'clockw',0)}
    if(k==='villa'){D(3,3,'rug',0,{w:2,col:'#2f6db5',col2:'#8ec9e8'});D(6,2,'kitchen',1);D(7,2,'fridge',1);D(3,1,'frame',0,{c2:'#56c4e8'});D(9,6,'lampf',1)}
    if(k==='villaUp'){D(2,2,'wardrobe',1);D(3,5,'rug',0,{w:3,col:'#8a3b8f',col2:'#b06ab5'});D(6,1,'frame',0);D(9,2,'lampf',1)}
  }
}
