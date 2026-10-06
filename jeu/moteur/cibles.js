/* Wattlings · jeu/moteur/cibles.js
   Les cibles : où pointe la flèche d'objectif. */

/* ================= CIBLES (flèche d'objectif) ================= */
function targets(){
  if(MAPS[S.map].cibles)return MAPS[S.map].cibles();   // cartes de voyage
  const ST=savoirTargets();if(ST)return ST;
  const s=S.site,m=S.map,T=[],b=BLD.find(x=>x.id===s),off=BLD[0];
  const toOffice=()=>{if(m==='town')T.push(off.door);else if(m!=='office')T.push(m==='cave'?[1,2]:[7,10])};
  const toSite=()=>{if(m==='town'&&b)T.push(b.door);else if(m==='office')T.push([5,8])};
  const A=ARENAS.find(a=>ARENA_CH[a.id]===S.ch),cur=curArena(),out=()=>T.push(cur?[7,11]:m==='office'?[5,8]:m==='mairie'?[6,9]:m==='local'?[5,7]:m==='cave'?[1,2]:[7,10]);
  const toArena=a=>{if(cur===a){const k=[0,1,2].find(k=>!trBeaten(a,k));if(k===undefined)T.push([7,2]);else T.push([AR.t[k]?AR.t[k].x:POSTS[k][0],AR.t[k]?AR.t[k].y:POSTS[k][1]])}else if(m==='town')T.push(a.b.door);else out()};
  if(cur&&(!A||cur!==A)){out();return T}
  switch(S.ch){
    case 0:if(m==='office')T.push([8,4]);else toOffice();break;
    case 1:if(m==='town'){if(!S.notes.adresse)T.push([b.door[0]+2,b.door[1]+1]);if(!S.notes.surface)T.push([b.door[0]-2,b.door[1]+1])}else out();break;
    case 2:if(S.flags.elec&&S.flags.gas){toArena(A);break}toSite();if(m==='rdc'){if(!S.flags.elec)T.push([11,1]);if(!S.flags.gas)T.push([14,2])}if(m==='cave'&&!S.flags.gas)T.push([8,1]);if(m==='cave'&&S.flags.gas)T.push([1,2]);break;
    case 5:if(S.flags.arch)toArena(A);else{toOffice();if(m==='office')T.push([10,2])}break;
    case 7:if(Object.keys(S.derives).length>=4){toArena(A);break}toSite();if(m==='rdc'&&(!S.derives.boiler||!S.derives.cave))T.push([14,2]);if(m==='cave'&&!S.derives.boiler)T.push([4,3]);break;
    case 3:case 4:case 6:case 8:case 9:toArena(A);break;
    case 11:if(m==='town'&&voyOuvert()&&!(S.voy&&S.voy.pass))T.push(doorOf('gare'));break;   // épilogue : la gare a rouvert
    case 10:if(m==='town')T.push(doorOf('mairie'));else if(m==='mairie')T.push(S.pm>=6?[10,4]:[2,2]);else out();break;
  }
  return T;
}
