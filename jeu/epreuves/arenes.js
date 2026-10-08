/* Wattlings · jeu/epreuves/arenes.js
   Arènes : déroulé d'une visite, duels de questions contre les dresseurs, épreuve du champion, badge. */

/* les 8 arènes, chacune décrite dans son fichier recit/arenes/arene-N.js */
const ARENAS=[ARENE_1,ARENE_2,ARENE_3,ARENE_4,ARENE_5,ARENE_6,ARENE_7,ARENE_8];
const arenaOf=id=>{const m=/^arena(\d)$/.exec(id||'');return m?ARENAS[+m[1]-1]:null};
const curArena=()=>arenaOf(S.map);
const arenaDone=A=>S.ch>ARENA_CH[A.id];
const trBeaten=(A,k)=>arenaDone(A)||!!(S.arena&&S.arena[A.id]&&S.arena[A.id][k]);
function genArena(){const g=grid(AW,AH,'a');rect(g,0,0,AW-1,1,'W');rect(g,0,AH-1,AW-1,AH-1,'x');g[AH-1][7]='E';
  [8,6,4].forEach(j=>{for(let i=0;i<AW;i++)if(i!==GAPS[j])g[j][i]='x'});
  for(const j of [2,3])for(let i=0;i<AW;i++)if(i<5||i>9)g[j][i]='x';
  return g}
ARENAS.forEach(A=>{MAPS['arena'+A.id]={g:genArena(),name:A.name,arena:A};BLD.push({id:'arena'+A.id,arena:A,roof:A.col,wall:A.wall,...A.b})});

/* ---- état d'une visite d'arène (non sauvegardé : positions, crédibilité) ---- */
const AR={id:0,cred:100,t:[],lock:false,seen:-1,bang:0};
function arenaInit(A){AR.id=A.id;AR.cred=100;AR.lock=false;AR.seen=-1;AR.bang=0;AR.t=POSTS.map(([x,y,d])=>({x,y,px:x*TS,py:y*TS,dir:d,frame:0}))}
function arenaMissing(A){ // ce qui manque pour entrer : [] si la porte s'ouvre
  const ch=ARENA_CH[A.id];
  if(S.ch>ch)return [];
  if(S.ch<ch||!S.site)return [{t:A.id===1?(S.ch<1?"L'arène est fermée. Parle d'abord à Mme Joule, au bureau.":`Avant d'entrer, termine le repérage ${enDe(site())} : adresse et surface, depuis l'extérieur.`):`La porte est verrouillée. Il te faut d'abord le badge ${BLAB(ARENAS[A.id-2].badge)} (${ARENAS[A.id-2].name}).`}];
  const L=[];
  if(A.id===1&&!(S.flags.elec&&S.flags.gas))L.push({t:`Avant d'affronter ${A.champ}, trouve les compteurs ${enDe(site())} : l'électrique dans un mur, le gaz à la cave.`});
  if(A.id===4&&!S.flags.arch)L.push({t:"Avant d'entrer, récupère l'inventaire de tes données dans l'armoire à archives du bureau."});
  if(A.id===6&&Object.keys(S.derives).length<4)L.push({t:`Avant d'entrer, termine ta ronde de nuit dans ${site().short} : ${Object.keys(S.derives).length}/4 dérives trouvées.`});
  if(missingReq(ch).length)L.push(...missingLines(ch));
  return L;
}
function enterArena(A){
  const L=arenaMissing(A);
  if(L.length)return say([{t:`${A.name}.`},...L]);
  arenaInit(A);warp('arena'+A.id,7,10,'up');toast(A.name);
  if(!arenaDone(A)&&!(S.arena&&S.arena[A.id]))say([{t:`${A.name}. Trois dresseurs gardent le chemin ; ${A.champ} t'attend au fond, sur l'estrade.`},{t:"Chaque dresseur pose une question. Une erreur coûte un tiers de ta crédibilité ; à zéro, retour à l'entrée."}]);
}
function arenaObjs(A,o){
  if(AR.id!==A.id||!AR.t.length)arenaInit(A);
  const g=MAPS['arena'+A.id].g;
  for(let j=2;j<AH-1;j++)for(let i=0;i<AW;i++)if(g[j][i]==='x')o.push({x:i,y:j,kind:'ablock',draw:(c,X,Y,tk)=>arenaBlock(c,A.theme,X,Y,i,j,tk)});
  A.tr.forEach((T,k)=>{const p=AR.t[k],won=trBeaten(A,k);o.push({x:p.x,y:p.y,px:p.px,py:p.py,kind:'npc',solid:1,pal:T.pal,dir:p.dir,frame:p.frame,who:T.n,noHades:!won,bang:AR.seen===k&&AR.bang>0,act:()=>won?say([{w:T.n,t:T.lose}]):duel(A,k)})});
  if(A.id===8&&S.ch>9)o.push({x:7,y:2,kind:'sign',solid:1,act:()=>say([{t:"Une plaque sur l'estrade : « Championne absente. Elle est retournée au bureau, former la relève. »"}])});
  else o.push({x:7,y:2,kind:'npc',solid:1,pal:A.cpal,dir:'down',who:A.champ,glow:!arenaDone(A)&&[0,1,2].every(k=>trBeaten(A,k)),act:()=>champTalk(A)});
}
/* un dresseur repère le joueur dans sa ligne de vue */
function arenaStep(){
  const A=curArena();if(!A||AR.lock||arenaDone(A))return false;
  for(let k=0;k<3;k++){if(trBeaten(A,k))continue;const T=AR.t[k],[dx,dy]=DIRS[T.dir];
    for(let n=1;n<=10;n++){const x=T.x+dx*n,y=T.y+dy*n;if(x===P.x&&y===P.y){AR.lock=true;AR.seen=k;AR.bang=38;clearKeys();sfx('bad');return true}if(isSolid(x,y))break}}
  return false;
}
function arenaUpdate(k){
  if(!AR.lock||AR.seen<0)return;const A=curArena();if(!A){AR.lock=false;return}
  if(AR.bang>0){AR.bang-=k;return}
  const T=AR.t[AR.seen],[dx,dy]=DIRS[T.dir],tx=(P.x-dx)*TS,ty=(P.y-dy)*TS,sp=1.6*k;
  if(Math.abs(tx-T.px)>.5||Math.abs(ty-T.py)>.5){T.px+=Math.sign(tx-T.px)*Math.min(sp,Math.abs(tx-T.px));T.py+=Math.sign(ty-T.py)*Math.min(sp,Math.abs(ty-T.py));T.frame=1+Math.floor((Math.abs(T.px-T.x*TS)+Math.abs(T.py-T.y*TS))/4);return}
  T.x=P.x-dx;T.y=P.y-dy;T.px=T.x*TS;T.py=T.y*TS;T.frame=0;
  const kk=AR.seen;AR.lock=false;AR.seen=-1;P.dir={up:'down',down:'up',left:'right',right:'left'}[T.dir];
  say([{w:A.tr[kk].n,t:A.tr[kk].intro}],()=>duel(A,kk));
}
function arenaDefeat(){
  const A=curArena();if(!A)return;arenaInit(A);warp(S.map,7,10,'up');
  say([{t:"Ta crédibilité est à zéro. Tu reprends ton souffle à l'entrée de l'arène."},{t:"Les dresseurs déjà battus te laisseront passer. Un doute ? Relis tes fiches dans Menu → Classeur."}]);
}
/* ---- duel de questions contre un dresseur ---- */
function duel(A,k){
  if(busy||trBeaten(A,k))return;busy=true;clearKeys();const T=A.tr[k];let qi=Math.floor(Math.random()*T.qs.length),over=false;
  const bg={cadastre:'#c9dceb,#e3edf5',flux:'#3b4258,#2b3142',labo:'#cfd8e0,#eef2f5',archives:'#e8dcc0,#c89b62',courbes:'#1c2748,#16203a',nuit:'#262a3a,#353a4c',chantier:'#b5694a,#a3a6ab',preuve:'#f3ece0,#e2d9c6'}[A.theme].split(',');
  const ov=document.createElement('div');ov.className='battle';ov.innerHTML=`<div class="arena" role="dialog" aria-label="Duel"><div class="field2" style="background:linear-gradient(${bg[0]} 0 55%,${bg[1]} 55%)"><div class="hpbox enemy"><b>${esc(T.n)}</b> <small>dresseur ${k+1}/3</small><div class="bar"><i style="width:100%"></i></div></div><div class="hpbox me"><b>${esc(S.name)}</b> <small>Nv ${level()}</small><div class="bar"><i style="width:${AR.cred}%"></i></div><small>Crédibilité</small></div></div><div class="bmsg"></div><div class="moves"></div></div>`;
  $('layer').appendChild(ov);sfx('encounter');updateMusic();
  const f=ov.querySelector('.field2'),mon=document.createElement('canvas');mon.width=20;mon.height=20;mon.className='mon';drawChar(mon.getContext('2d'),2,3,'down',0,T.pal);f.appendChild(mon);
  const hc=document.createElement('canvas');hc.width=20;hc.height=20;hc.className='hero';drawChar(hc.getContext('2d'),2,3,'up',0,PAL[S.rank]);f.appendChild(hc);
  const msg=ov.querySelector('.bmsg'),mv=ov.querySelector('.moves'),ebar=ov.querySelector('.enemy i'),mbar=ov.querySelector('.me i');
  const setBar=()=>{mbar.style.width=Math.max(0,AR.cred)+'%';mbar.style.background=AR.cred<40?'var(--bad)':AR.cred<100?'var(--amber)':''};setBar();
  const end=cb=>{ov.remove();busy=false;clearKeys();hud();save();updateMusic();if(cb)cb()};
  const one=(label,fn)=>{mv.innerHTML='';const c=document.createElement('button');c.textContent=label;c.style.gridColumn='1/-1';mv.appendChild(c);c.focus();c.onclick=fn};
  const ask=()=>{const q=T.qs[qi%T.qs.length];msg.innerHTML=`<b>${esc(T.n)} :</b> « ${esc(q.q)} »`;mv.innerHTML='';
    shuffle(q.o).forEach(o=>{const b=document.createElement('button');b.textContent=o[0];mv.appendChild(b);b.onclick=()=>{if(over)return;
      if(o[1]){over=true;mv.querySelectorAll('button').forEach(x=>x.disabled=true);ebar.style.width='0%';mon.classList.add('hit');jingle('victory');
        trk('battle',{a:(A.name+' · '+T.n).slice(0,100),r:'win'});S.arena=S.arena||{};S.arena[A.id]=S.arena[A.id]||[0,0,0];S.arena[A.id][k]=1;S.xp+=15;save();
        msg.innerHTML=`Bonne réponse ! ${esc(o[2])}<br><b>${esc(T.n)}</b> est battu. +15 XP`;qkTimeout(()=>mon.classList.add('ko'),500);
        qkTimeout(()=>one('Continuer ▸',()=>end(()=>say([{w:T.n,t:T.lose}]))),900)}
      else{trk('wrong_answer',{t:A.name,q:trkTxt(q.q).slice(0,100),a:trkTxt(o[0]).slice(0,80)});sfx('bad');AR.cred-=34;setBar();ov.querySelector('.hero').classList.add('hit');qkTimeout(()=>{const h=ov.querySelector('.hero');if(h)h.classList.remove('hit')},500);
        if(AR.cred<=0){over=true;trk('battle',{a:(A.name+' · '+T.n).slice(0,100),r:'lose'});msg.innerHTML=`Raté. ${esc(o[2])} La bonne réponse : « ${esc(q.o.find(z=>z[1])[0])} ».<br>Ta crédibilité est à zéro : <b>${esc(T.n)}</b> te raccompagne à l'entrée.`;one("Retour à l'entrée ▸",()=>end(arenaDefeat))}
        else{const bonne=q.o.find(z=>z[1]);msg.innerHTML=`Raté. ${esc(o[2])}<br>La bonne réponse : « ${esc(bonne[0])} ». ${esc(bonne[2]||'')}<br><b>${esc(T.n)}</b> enchaîne avec une autre question.`;one('Question suivante ▸',()=>{qi++;ask()})}}}});
    const b0=mv.querySelector('button');if(b0)b0.focus()};
  ask();
}
/* ---- le champion : son épreuve est le mini-jeu de l'étape ---- */
function champTalk(A){
  if(arenaDone(A))return say([{w:A.champ,t:`Tu as déjà le badge ${BLAB(A.badge)}. Reviens quand tu veux pour le plaisir de la conversation.`}]);
  if(![0,1,2].every(k=>trBeaten(A,k)))return say([{w:A.champ,t:"Bats d'abord mes trois dresseurs. Ensuite, on parlera."}]);
  say(A.cIntro.map(t=>({w:A.champ,t})),()=>champTrial(A));
}
function champTrial(A){
  const win=()=>arenaWin(A);
  ({1:()=>gamePatrimoine(()=>gamePlan(win)),2:()=>gameCollecte(win),3:()=>champAnomalies(A,win),4:()=>gameStructurer(win),5:()=>gameAnalyse(win),6:()=>gameDetect(win),7:()=>gameAgir(win),8:()=>gamePiloter(win)})[A.id]();
}
/* Arène 3 : d'abord les bocaux (les anomalies qu'on ne voit pas sur une courbe), puis l'atelier : une semaine brute du site à fiabiliser (serie-brute.js) */
const BOCAUX=['recule','boucle','unite','heure'];
function champAnomalies(A,win){
  S.flags.c3=S.flags.c3||{};const B=ANOM.filter(a=>BOCAUX.includes(a.id)),rest=B.filter(a=>!S.flags.c3[a.id]);
  if(!rest.length)return champSerie(A,win);
  const a=rest[0],n=B.length-rest.length+1;
  battle(a,{owner:A.champ,n,total:B.length,onWin:()=>{S.flags.c3[a.id]=1;save();const left=B.filter(x=>!S.flags.c3[x.id]).length;
    if(!left)say([{w:A.champ,t:"Les bocaux, c'était l'échauffement. Voici une semaine de données de ton site, toute fraîche de l'API."},{w:A.champ,t:"Je n'y ai pas touché. Personne n'y a touché. C'est bien le problème."}],()=>champSerie(A,win));
    else say([{w:A.champ,t:[`Pas mal. Spécimen suivant !`,`Tiens, tiens. Celui-ci est plus coriace.`,`Tu corriges vite. Trop vite ? Voyons le suivant.`][n%3]+` (${n}/${B.length} corrigées)`}],()=>champAnomalies(A,win))},onLose:arenaDefeat});
}
function champSerie(A,win){
  S.flags.c3=S.flags.c3||{};if(S.flags.c3.serie)return win();
  runSteps(A.name+' · L’EMS du labo',[
    info(`<h3>La vraie vie</h3><p>Une semaine de données ${esc(enDe(site()))}, telle que l'EMS du labo vient de la recevoir. Brute. Très brute.</p><p>Ton travail : repérer ce qui cloche, choisir le bon traitement, et ne jamais effacer la donnée d'origine. Attention : une donnée surprenante n'est pas forcément fausse. La cantine a le droit d'avoir faim à midi.</p>`,'Ouvrir la série'),
    serieBruteStep],()=>{S.flags.c3.serie=1;save();win()});
}
const ARENA_OPEN={1:"Une barrière se lève : la Cité des Beffrois est ouverte, à l'est de la place de la Donnée. Briques rouges et beffrois : te voilà dans le Nord.",2:"Une barrière se lève : le Clos du Tamis est ouvert, au sud de la Cité des Beffrois. Chaumières, pommiers et haies de bocage : la Normandie.",3:"Une barrière se lève : le Quartier des Colombages est ouvert, au sud de la place de la Donnée. Un petit air d'Alsace.",
  4:"Les ponts sont ouverts : la rive Énergie t'attend, avec la place de l'Énergie et les Coteaux des Courbes, plantés de vigne comme en Bourgogne.",5:"Une barrière se lève : l'Anse du Veilleur est ouverte, à l'ouest des Coteaux des Courbes. Granit, ardoise et un phare : la Bretagne.",6:"Une barrière se lève : le Mas du Soleil est ouvert, au nord de l'Anse du Veilleur. Lavande, oliviers et cyprès : la Provence.",
  7:"Une barrière se lève : l'Alpage de la Preuve est ouvert, à l'est du Mas du Soleil. Chalets, sapins et bergerie : la Savoie.",8:"Le pont du Nord est ouvert : la boucle est refermée."};
function arenaWin(A){
  S.ch=ARENA_CH[A.id]+1;if(A.id===5)S.derives={};badge(A.badge);save();hud();
  const L=A.cWin.map(t=>({w:A.champ,t}));L.push({t:enBadge(A.id)});enHud(true);
  const suite=prochaineEtapeTexte(),O={t:ARENA_OPEN[A.id]+(suite?` Prochaine étape : ${suite}. Sors de l'arène et suis la flèche orange.`:' La carte (touche K) montre le chemin.')};
  if(A.id===4)return say(L,()=>evolve(1,()=>say([{w:'Mme Joule',t:'(au téléphone) '+A.next},O])));
  if(A.id===8)return say(L,()=>evolve(2,()=>say([{t:"Les 8 badges sont à toi. Mme Joule a quitté l'estrade : elle t'attend au bureau."},O])));
  say([...L,{w:'Mme Joule',t:'(au téléphone) '+A.next},O]);
}
/* éclairage de l'Arène de la Nuit : faisceaux des lampes des dresseurs */
function arenaNightFx(c,ox,oy){
  const A=curArena();if(!A||A.id!==6)return;
  AR.t.forEach((T,k)=>{if(trBeaten(A,k))return;const [dx,dy]=DIRS[T.dir],X=T.px-ox+8,Y=T.py-oy+6;c.fillStyle='rgba(255,236,150,.2)';c.beginPath();c.moveTo(X+dx*6,Y+dy*6);
    c.lineTo(X+dx*64-dy*14,Y+dy*64-dx*14);c.lineTo(X+dx*64+dy*14,Y+dy*64+dx*14);c.fill()});
  const X=7*TS-ox+8,Y=2*TS-oy+6,g=c.createRadialGradient(X,Y,2,X,Y,26);g.addColorStop(0,'rgba(255,236,150,.35)');g.addColorStop(1,'rgba(255,236,150,0)');c.fillStyle=g;c.fillRect(X-26,Y-26,52,52);
}
/* tenue des dresseurs et des champions : chaque arène a son uniforme */
{const KIT={cadastre:{prop:'plan'},flux:{prop:'tablet'},labo:{coat:'#f7f0dc'},archives:{prop:'book'},courbes:{prop:'clipboard'},nuit:{prop:'lantern',scarf:'#5b6ee0'},chantier:{vest:1,hat:'#f2c12e',hatType:'helmet'},preuve:{prop:'clipboard'}},
  CK={1:{prop:'plan',scarf:'#f2a33a',lash:1},2:{hatType:'cap',prop:'tablet',beard:'#2b1d14'},3:{coat:'#f7f0dc',stetho:1},4:{bun:1,lash:1,prop:'book'},5:{jacket:'#6b4a2b',beard:'#9a9aa2',prop:'clipboard'},6:{prop:'lantern',scarf:'#f2c12e',lash:1},7:{hat:'#f7f0dc',hatType:'helmet',vest:1,beard:'#5a3a22'},8:{bun:1,scarf:'#f2a33a',lash:1,prop:'tablet'}};
  ARENAS.forEach(A=>{A.tr.forEach((T,i)=>{T.pal=Object.assign({skin:SKINS[(i*2+A.id*3)%6]},KIT[A.theme],T.pal)});A.cpal=Object.assign({skin:SKINS[(A.id*5)%6]},CK[A.id],A.cpal)})}
MAPS.town.g=genTown();placeTown(); // la ville est régénérée avec les 8 bâtiments d'arène, puis chacun y prend sa place
