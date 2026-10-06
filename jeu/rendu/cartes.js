/* Wattlings · jeu/rendu/cartes.js
   Mise en cache des cartes dessinées. */

const mapCache={};
const mapOver={};   // ce qui passe devant les personnages : la cime des arbres
function buildMapCanvas(id){
  const m=MAPS[id],H=m.g.length,W=m.g[0].length,c=mkc(W*TS,H*TS),x2=c.getContext('2d');
  const town=id==='town';if(town){seasonArt();SKR.artK=SKY.artKey;SKR.stK=''}
  // en ville, l'eau, les pistes et les allées ne sont plus dessinées case par case : on pose d'abord l'herbe, les courbes viennent ensuite
  // une carte de voyage (jeu/voyages/) se peint elle-même : son sol, puis ce qui passe devant les personnages
  if(m.peindre){const o=mkc(W*TS,H*TS);m.peindre(x2,o.getContext('2d'),m);mapOver[id]=o;mapCache[id]=c;return}
  for(let y=0;y<H;y++)for(let x=0;x<W;x++){const ch=m.g[y][x];if(town&&(ch==='b'||ch==='='||ch==='R'||ch==='~'||ch==='g')){zoneGrass(x,y);artGrass(x2,x*TS,y*TS,x,y,false)}else drawTile(x2,ch,x,y,id)}
  if(town){blendEdges(x2,m.g);blendGrass(x2);curvePass(x2,m.g);curveDecor(x2,m.g);for(let y=0;y<H;y++)for(let x=0;x<WIND0;x++)seasonGround(x2,m.g[y][x],x,y);blendGrass(x2)}      // fondus : avant les courbes, puis une seconde fois pour ce qui s'est posé dessus
  if(m.arena)arenaFloor(x2,m.arena);
  mapOver[id]=null;
  if(id==='town'){artInit();const o=mkc(W*TS,H*TS),xo=o.getContext('2d');
    for(let y=0;y<H;y++)for(let x=0;x<W;x++){const ch=m.g[y][x];if(ch==='T'||ch==='u'||ch==='k'||ch==='h'||ch==='f'||ch==='P'||ch==='m'){const at=(dx,dy)=>m.g[y+dy]&&m.g[y+dy][x+dx];artProp(x2,xo,ch,x,y,at);if(SEA.snow)snowProp(x2,ch,x,y,at);else if(WEAR&&x<WIND0)wearProp(x2,ch,x,y,at)}}
    BLD.forEach(b=>{drawBuilding(x2,b);if(b.arena)drawArenaFacade(x2,b);if(b.id==='gare')drawStationFacade(x2,b)});
    mapOver[id]=o}
  mapCache[id]=c;
}
function rebuildMaps(){Object.keys(MAPS).forEach(buildMapCanvas)}

/* Personnages */
