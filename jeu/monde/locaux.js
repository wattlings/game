/* Wattlings · jeu/monde/locaux.js
   Les bâtiments du quartier est et du sud. */

/* ---- bâtiments du quartier est et du sud ---- */
const LOCALS={
  enedis:{name:'Agence Enedis',roof:'#3f9e58',wall:'#e8eef5'},grdf:{name:'Poste GRDF',roof:'#e58a2e',wall:'#eef3f2'},voltco:{name:'Volt&Co Énergie',roof:'#c43d3d',wall:'#f3ece2'},
  media:{name:'Médiathèque',roof:'#2f7d46',wall:'#efe9da'},cabinet:{name:'Cabinet médical',roof:'#8a5f36',wall:'#f5efe4'},pharma:{name:'Pharmacie',roof:'#2f8f4e',wall:'#f1f5ee'},maison:{name:'Maison Dupuis',roof:'#a0522d',wall:'#f3e2c4'},villa:{name:'Villa avec piscine',roof:'#3f8f8a',wall:'#f4efe6'}
};
function genLocal(){const W=11,H=8,g=grid(W,H,'o');rect(g,0,0,W-1,1,'W');rect(g,0,0,0,H-1,'W');rect(g,W-1,0,W-1,H-1,'W');rect(g,0,H-1,W-1,H-1,'W');g[H-1][5]='E';return g}
function localDecor(o){
  const k=S.inside;
  if(k==='enedis'||k==='grdf'||k==='voltco'||k==='pharma')o.push({x:3,y:4,kind:'plant',solid:1},{x:9,y:5,kind:'chairs',solid:1});
  if(k==='media')o.push({x:3,y:5,kind:'readtable',solid:1},{x:4,y:5,kind:'readtable',solid:1},{x:1,y:2,kind:'shelf',solid:1});
  if(k==='cabinet')o.push({x:8,y:3,kind:'bed',solid:1},{x:1,y:5,kind:'plant',solid:1});
  if(k==='maison')o.push({x:2,y:2,kind:'sofa',solid:1},{x:3,y:2,kind:'sofa',solid:1},{x:9,y:2,kind:'tv',solid:1,act:()=>eggWii()});
  if(k==='voltco')o.push({x:8,y:1,kind:'poster',act:()=>say([{t:"Affiche Volt&Co : « Prix fixe garanti* ». L’astérisque renvoie à une page 14 que personne n’a jamais trouvée."}])});
}
