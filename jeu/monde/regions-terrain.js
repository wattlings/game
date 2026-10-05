/* Wattlings · jeu/monde/regions-terrain.js
   Le terrain des régions : limites de quartier et champs, posés à la génération de la ville. */

/* ---- les limites de quartier : haie de bocage, muret de pierre sèche, clôture d'alpage… ---- */
function regBorder(z,h,n){
  switch(REG[z]){
    case 'auvergne':return n<.8?'m':h<.5?'u':'k';
    case 'nord':return n<.78?'m':'f';
    case 'normandie':return h<.1?'T':h<.2?'u':'h';
    case 'alsace':return n<.62?'f':'h';
    case 'bourgogne':return n<.74?'m':'h';
    case 'bretagne':return n<.66?'m':h<.75?'u':'k';
    case 'provence':return n>.6?'P':h<.9?'m':'u';
    case 'savoie':return n<.7?'f':h<.5?'T':'k';
    default:return h<.93?'h':'u';
  }
}
function regTerrain(g){
  REG_FIELDS.forEach(([x0,y0,x1,y1])=>{for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++){const t=g[y][x];if(t==='.'||t==='*'||t==='T'||t==='u'||t==='k')g[y][x]='*'}});
  REG_FREE.forEach(([x,y])=>{const t=g[y][x];if(t==='T'||t==='u'||t==='k'||t==='*')g[y][x]='.'});
}
