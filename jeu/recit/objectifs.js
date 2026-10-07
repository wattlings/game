/* Wattlings · jeu/recit/objectifs.js
   Le guidage : ce que le joueur doit faire, une action à la fois.
   - objectiveText0() : les tâches de l'étape en cours, dans l'ordre (texte court, faite ou non, cible de la flèche).
   - prochaineAction() : la première tâche pas encore faite (parmi les infos clés, la plus proche du joueur).
   - objectiveText() : la ligne affichée en permanence en haut de l'écran.
   La flèche orange (moteur/cibles.js) pointe la cible de la prochaine action ; le menu → Objectif montre la liste cochée.
   Les textes de chaque étape sont sous « if(S.ch===N) » : la page de pilotage les range ainsi par chapitre. */

/* ---- où aller : la case visée sur la carte où se trouve le joueur (la porte ou la sortie qui y mène, sinon) ---- */
const SORTIES={office:[5,8],mairie:[6,9],local:[5,7],cave:[1,2],rdc:[7,10]};
const sortie=()=>curArena()?[7,11]:SORTIES[S.map]||[7,10];
function vers(map,x,y,porte){
  if(S.map===map)return [x,y];
  if(S.map==='town')return porte||null;
  if(map==='cave'&&S.map==='rdc')return [14,2];   // l'escalier de la cave
  return sortie();
}
const porteSite=()=>{const b=BLD.find(x=>x.id===S.site);return b?b.door:null};

/* « le géomètre » → « au géomètre » */
const aQui=w=>/^le /.test(w)?'au '+w.slice(3):/^les /.test(w)?'aux '+w.slice(4):/^la /.test(w)?'à la '+w.slice(3):/^l[’']/.test(w)?'à '+w:'à '+w;

/* une info clé à trouver */
function ficheCible(f){const s=SRC[f.src];
  if(f.src==='tech')return vers('town',L.park.gate[0],L.park.gate[1]);
  if(f.src==='maire')return vers('mairie',10,4,doorOf('mairie'));
  if(f.src==='joule')return vers('office',8,4,BLD[0].door);
  if(s.ins){if(S.map==='local'&&S.inside===s.ins)return [s.x,s.y];if(S.map==='town')return doorOf(s.ins);return sortie()}
  return vers(s.map,s.x,s.y,s.map==='office'?BLD[0].door:s.map==='mairie'?doorOf('mairie'):null);
}
const infosCles=ch=>FICHES.filter(f=>f.req===ch&&fAvail(f)).map(f=>{const s=SRC[f.src];   // un habitant : « Parle à… » ; un objet : « Examine… »
  return {t:s.kind==='npc'||!s.kind?'Parle '+aQui(s.where):'Examine '+s.where,ok:fGot(f.id),cible:()=>ficheCible(f),info:true,cle:true}});

/* l'arène de l'étape : y entrer, battre les trois dresseurs, puis le champion */
function areneTaches(A){
  const dedans=curArena()===A,fait=arenaDone(A),n=[0,1,2].filter(k=>trBeaten(A,k)).length;
  return [
    {t:`Entre dans l'${A.name}, ${qAu(A.id)}`,ok:dedans||fait,cible:()=>S.map==='town'?A.b.door:sortie()},
    {t:"Bats les 3 dresseurs de l'arène",ok:fait||n>=3,prog:n+'/3',cible:()=>{if(!dedans)return null;const k=[0,1,2].find(k=>!trBeaten(A,k));return k===undefined?null:[AR.t[k]?AR.t[k].x:POSTS[k][0],AR.t[k]?AR.t[k].y:POSTS[k][1]]}},
    {t:`Affronte ${A.champ}, sur l'estrade`,ok:fait,cible:()=>dedans?[7,2]:null},
  ];
}

function objectiveText0(){
  const s=site(),A=ARENAS.find(a=>ARENA_CH[a.id]===S.ch),arene=A?areneTaches(A):[],b=porteSite();
  if(S.ch===0)return [{t:"Parle à Mme Joule, au fond de ton bureau",ok:false,cible:()=>vers('office',8,4,BLD[0].door)}];
  if(S.ch===1)return [
    {t:`Lis l'adresse sur la boîte aux lettres ${enDe(s)}`,ok:!!S.notes.adresse,cible:()=>b&&vers('town',b[0]+2,b[1]+1)},
    {t:"Lis la surface sur la fiche technique, près de l'entrée",ok:!!S.notes.surface,cible:()=>b&&vers('town',b[0]-2,b[1]+1)},
    ...infosCles(1)];
  if(S.ch===2)return [
    {t:`Trouve le compteur électrique, dans un mur ${enDe(s)}`,ok:!!S.flags.elec,cible:()=>vers('rdc',11,1,b)},
    {t:`Trouve le compteur gaz, à la cave ${enDe(s)}`,ok:!!S.flags.gas,cible:()=>S.map==='cave'?[8,1]:vers('cave',8,1,b)},
    ...infosCles(2),...arene];
  if(S.ch===5)return [{t:"Prends l'inventaire de tes données dans l'armoire à archives du bureau",ok:!!S.flags.arch,cible:()=>vers('office',10,2,BLD[0].door)},...infosCles(5),...arene];
  if(S.ch===7){const d=Object.keys(S.derives).length;return [{t:`Ronde de nuit dans ${s.short} : trouve les 4 dérives`,ok:d>=4,prog:d+'/4',
    cible:()=>S.map==='cave'?(S.derives.boiler?null:[4,3]):S.map==='rdc'?(!S.derives.boiler||!S.derives.cave?[14,2]:null):vers('rdc',7,8,b)},...infosCles(7),...arene]}
  if(S.ch===10)return [{t:"Retrouve Mme Joule, au bureau : elle a une nouvelle mission pour toi",ok:!!S.flags.pmIntro,cible:()=>vers('office',8,4,BLD[0].door)},...infosCles(10),
    {t:`Analyse les 20 sites sur le PC patrimoine de l'hôtel de ville`,ok:(S.pm||0)>=6,prog:Math.min(6,S.pm||0)+'/6 missions',cible:()=>vers('mairie',2,2,doorOf('mairie'))},
    {t:"Présente tes résultats au maire",ok:false,cible:()=>vers('mairie',10,4,doorOf('mairie'))}];
  if(S.ch===11){const p=enPct(),v=voyOuvert()&&S.voy||{};const T=[{t:"Fais baisser la consommation du parc de 40 % : clique sur le compteur de kWh",ok:p>=.4,prog:'−'+(p*100).toFixed(1).replace('.',',')+' %',cible:()=>null}];
    if(voyOuvert())T.push({t:"La gare a rouvert : va chercher ton passeport des énergies au guichet",ok:!!v.pass,cible:()=>S.map==='town'?doorOf('gare'):sortie()});
    return T}
  if(S.ch>=3&&S.ch<=9)return [...infosCles(S.ch),...arene];
  return [];
}

/* la prochaine action : { t, prog, cible, n (tâches faites), total, fin } */
function prochaineAction(){
  if(MAPS[S.map]&&MAPS[S.map].objectif)return {t:MAPS[S.map].objectif(),cible:null,n:0,total:0,voyage:true};   // en voyage, l'objectif du site visité
  const cur=curArena(),A=ARENAS.find(a=>ARENA_CH[a.id]===S.ch);
  if(cur&&cur!==A)return {t:`Ressors de l'${cur.name} pour continuer`,cible:()=>[7,11],n:0,total:0};
  const T=objectiveText0(),n=T.filter(x=>x.ok).length;
  let a=T.find(x=>!x.ok);
  if(!a)return {t:S.ch>=11?"Objectif atteint ! Rejoue avec un autre site depuis le menu → Étapes":"Bravo, l'étape est terminée !",cible:null,n,total:T.length,fin:true};
  if(a.info){   // parmi les infos clés qui restent, la plus proche
    const d=x=>{const c=x.cible();return c?Math.abs(c[0]-P.x)+Math.abs(c[1]-P.y):1e9};
    a=T.filter(x=>x.info&&!x.ok).sort((x,y)=>d(x)-d(y))[0];
  }
  return Object.assign({},a,{n,total:T.length});
}

/* la première chose à faire dans l'étape en cours, pour l'annoncer dans un dialogue (« Prochaine étape : … ») */
function prochaineEtapeTexte(){const a=objectiveText0().find(x=>!x.ok);return a?a.t.charAt(0).toLowerCase()+a.t.slice(1):''}

/* la ligne d'objectif (en haut de l'écran, et partout où l'objectif est cité) */
function objectiveText(){const a=prochaineAction();return a.t+(a.prog?` (${a.prog})`:'')}
