/* Wattlings · jeu/moteur/savoir.js
   Mécanique des fiches savoir : les obtenir, les afficher, ouvrir les portes des arènes. */

const FBY={};FICHES.forEach(f=>FBY[f.id]=f);
const fAvail=f=>S.ch>=STEP_CH[f.st];
const fGot=id=>!!(S.fiches&&S.fiches[id]);
function missingReq(ch){ch=ch===undefined?S.ch:ch;return FICHES.filter(f=>f.req===ch&&!fGot(f.id))}
function missingLines(ch){const m=missingReq(ch);return [{t:`Il te manque ${m.length} info${m.length>1?'s':''} clé${m.length>1?'s':''} pour entrer dans l'arène. Cherche : ${m.map(f=>SRC[f.src].where).join(' ; ')}.`},{t:'Les flèches orange t’indiquent où aller, et la carte (touche K) montre chaque info clé manquante. Ton objectif et tes fiches sont dans le menu (touche M).'}]}
function srcTry(sid){
  const f=FICHES.find(f=>f.src===sid&&fAvail(f)&&!fGot(f.id));if(!f)return false;
  const s=SRC[sid],lines=f.say.map(t=>s.who?{w:s.who,t}:{t});
  const give=()=>showFiche(f);
  if(f.quiz)say(lines,()=>runSteps(s.who||'Question',[choice({q:f.quiz.q,opts:f.quiz.opts})],give));else say(lines,give);
  return true;
}
const SKY_IDLE={meteo:()=>meteoLines(),mat:()=>relaisLines(),installateur:()=>pvLines(),horloge:()=>{const m=Math.ceil((SKY.clock*60+1)/10)*10+10,h=Math.floor(m/60)%24;return [`L'horloge du jardin indique ${h} h ${String(m%60).padStart(2,'0')}. Elle avance de 10 minutes. Ou plutôt : elle compte par pas de 10 minutes.`]}};   // bulletin, relais météo, production solaire : en direct du ciel
function srcAct(sid,fallback){return()=>{if(srcTry(sid))return;const s=SRC[sid];
  const future=FICHES.find(f=>f.src===sid&&!fAvail(f));
  if(fallback)return fallback();
  if(s.egg&&s.egg())return;
  const idle=(SKY_IDLE[sid]&&SKY_IDLE[sid]()||s.idle||['…']).map(t=>s.who?{w:s.who,t}:{t});
  if(future&&s.who)idle.push({w:s.who,t:'Repasse me voir plus tard, j’aurai sûrement quelque chose pour toi.'});
  say(idle)}}
function showFiche(f){
  trk('fiche',{id:f.id,cle:!!f.req});
  S.fiches=S.fiches||{};S.fiches[f.id]=1;save();sfx('secret');
  const ov=openPanel('Nouvelle fiche savoir'),b=ov.querySelector('.pbody');
  const n=Object.keys(S.fiches).length;
  b.innerHTML=`<div class="fiche${f.req?' req':''}"><div class="fiche-top"><span class="tag">${f.st===0?'Le cycle':f.st==='P'?'Patrimoine':'Étape '+f.st+' · '+STEP_NAMES[f.st]}</span>${f.req?'<span class="tag key">Info clé</span>':''}<span class="fiche-k">${f.k==='phrase'?'L’essentiel':f.k==='analogie'?'Analogie':'À retenir'}</span></div><h3>${esc(f.t)}</h3><p>${esc(f.x)}</p></div><p class="dnote">Classeur : ${n} / ${FICHES.length} fiches.</p><div class="row"><button class="btn" id="fOk">Ranger dans le classeur ▸</button><button class="btn alt" id="fCourse">Lire dans le cours ↗</button></div>`;
  b.querySelector('#fOk').onclick=()=>{closePanel();gainXP(f.req?15:10);hud();pendingCheck()};b.querySelector('#fOk').focus();
  b.querySelector('#fCourse').onclick=()=>{closePanel();gainXP(f.req?15:10);goCourse(STEP_HASH(f.st))};
}
function pendingCheck(){
  if(S.ch===1)return checkCh1();
  if(S.ch===2&&S.flags.elec&&S.flags.gas&&!S.flags.cad)return checkCh2();
  const A=ARENAS.find(a=>ARENA_CH[a.id]===S.ch),req=FICHES.filter(f=>f.req===S.ch);
  if(A&&req.length&&!arenaMissing(A).length&&req.some(f=>f.id===Object.keys(S.fiches).slice(-1)[0]))toast(`Infos clés réunies : l'${A.name} t'ouvre ses portes !`);
}

/* gardes : renvoie true si le mini-jeu doit attendre */
function gate(ch){if(S.ch===ch&&missingReq(ch).length){say(missingLines(ch));return true}return false}

/* ---- objets des sources dans chaque carte ---- */
function savoirObjs(id,o){
  Object.entries(SRC).forEach(([sid,s])=>{
    if(s.existing)return;
    const inMap=s.ins?(id==='local'&&S.inside===s.ins):(s.map===id);if(!inMap)return;
    if(s.when&&!s.when())return;
    const glow=FICHES.some(f=>f.src===sid&&fAvail(f)&&!fGot(f.id));
    o.push({x:s.x,y:s.y,kind:s.kind,solid:s.kind!=='poster'?1:0,pal:s.pal,dir:s.dir||'down',sid,who:s.who||undefined,glow,act:srcAct(sid)});
  });
}
/* ---- cibles : sources des infos clés manquantes ---- */
function savoirTargets(){
  const m=missingReq();if(!m.length)return null;const T=[];
  m.forEach(f=>{const s=SRC[f.src];let pos=null;
    if(f.src==='tech')pos={map:'town',x:L.park.gate[0],y:L.park.gate[1]};else if(f.src==='maire')pos={map:'mairie',x:10,y:4};else if(f.src==='joule')pos={map:'office',x:8,y:4};
    else if(s.ins){const b=BLD.find(b=>b.id===s.ins);if(S.map==='town')T.push(b.door);else if(S.map==='local'&&S.inside===s.ins)T.push([s.x,s.y]);return}
    else pos={map:s.map,x:s.x,y:s.y};
    if(pos.map===S.map)T.push([pos.x,pos.y]);
    else if(S.map!=='town'&&pos.map==='town')T.push(curArena()?[7,11]:S.map==='local'?[5,7]:S.map==='office'?[5,8]:S.map==='mairie'?[6,9]:S.map==='cave'?[1,2]:[7,10]);
    else if(S.map==='town'&&pos.map==='mairie')T.push(doorOf('mairie'));
    else if(S.map==='town'&&pos.map==='office')T.push(BLD[0].door);
  });
  if(S.map==='local'&&!T.length)T.push([5,7]);
  return T;
}
