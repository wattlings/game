/* Wattlings · jeu/epreuves/donjons.js
   Le moteur des arènes-donjons, à la manière de Zelda : le plan (salles, murs, portes) se construit à partir de
   recit/arenes/donjons.js ; la caméra se cale sur la salle où l'on se trouve ; les portes s'ouvrent avec la petite clé
   du coffre, avec l'énigme, ou quand les trois dresseurs sont battus (celle du champion).
   Les énigmes : bornes, cartons et poids à pousser sur leur marque (bornes, cartons, balance) ; dalles qui s'effondrent
   (dalles) ; dalles de la courbe (talon) ; câbles à faire pivoter (cables) ; voyants à éteindre (voyants) ; leviers dans
   l'ordre (leviers). À la première visite, on choisit : explorer le donjon, ou aller directement au champion
   (les trois dresseurs attendent alors devant l'estrade). Une arène déjà gagnée a toutes ses portes ouvertes.
   Ce qui est sauvegardé (S.donjons[n]) : portes ouvertes, clés, coffres, énigme résolue, choix du raccourci. */

const DG_CW=14,DG_CH=10,DG_W=3*DG_CW+1,DG_H=3*DG_CH+1,DG_CALC={},DG_RT={};
/* le plan calculé d'un donjon : salles, portes, entrée, dresseurs, champion, éléments, en cases de la carte */
function dgCalc(n){
  if(DG_CALC[n])return DG_CALC[n];const D=DONJONS[n];if(!D)return null;
  const salles=D.salles.map(([c,r,w,h,nom])=>({x0:c*DG_CW,y0:r*DG_CH,x1:(c+w)*DG_CW,y1:(r+h)*DG_CH,nom}));
  const portes=D.portes.map(([a,b,t],i)=>{const A=salles[a],B=salles[b];let x,y;
    if(A.x1===B.x0||B.x1===A.x0){x=A.x1===B.x0?A.x1:A.x0;y=Math.floor((Math.max(A.y0,B.y0)+Math.min(A.y1,B.y1))/2)}
    else{y=A.y1===B.y0?A.y1:A.y0;x=Math.floor((Math.max(A.x0,B.x0)+Math.min(A.x1,B.x1))/2)}
    return {i,a,b,t,x,y}});
  const E=salles[D.entree],sortie=[Math.floor((E.x0+E.x1)/2),E.y1],items=[];
  D.contenu.forEach((L,si)=>L.forEach((it,k)=>items.push({si,k,s:it[0],it,x:salles[si].x0+(it[1]===undefined?0:it[0]==='d'||it[0]==='o'?it[2]:it[1]),y:salles[si].y0+(it[0]==='d'||it[0]==='o'?it[3]:it[2])})));
  const posts=[0,1,2].map(k=>{const d=items.find(i=>i.s==='d'&&i.it[1]===k);return d?[d.x,d.y,d.it[4]]:[sortie[0],sortie[1]-2,'up']});
  const c=items.find(i=>i.s==='c'),champ=c?[c.x,c.y]:[sortie[0],sortie[1]-6];
  return DG_CALC[n]={D,salles,portes,sortie,depart:[sortie[0],sortie[1]-1],items,posts,champ,salleChamp:c?c.si:0};
}
function genDonjon(n){
  const C=dgCalc(n),g=grid(DG_W,DG_H,'W');
  C.salles.forEach(s=>rect(g,s.x0+1,s.y0+1,s.x1-1,s.y1-1,'a'));
  C.portes.forEach(p=>{g[p.y][p.x]='a'});
  g[C.sortie[1]][C.sortie[0]]='E';
  C.items.forEach(i=>{if(i.s==='x')g[i.y][i.x]='x'});
  return g;
}
const dgN=A=>A&&DONJONS[A.id]?A.id:0;
const dgEtat=n=>{S.donjons=S.donjons||{};return S.donjons[n]=S.donjons[n]||{o:{},cles:0,coffres:{},enigme:0,passe:0,vu:0}};
const dgSalleDe=(C,x,y)=>C.salles.findIndex(s=>x>s.x0&&x<s.x1&&y>s.y0&&y<s.y1);
/* les dresseurs attendent devant l'estrade quand on a choisi le raccourci */
function dgPosts(A){const C=dgCalc(A.id),st=dgEtat(A.id);if(!C)return POSTS;
  if(!st.passe)return C.posts;const [cx,cy]=C.champ;return [[cx-4,cy+3,'right'],[cx+4,cy+3,'left'],[cx,cy+5,'up']]}
const dgChamp=A=>{const C=dgCalc(A.id);return C?C.champ:[7,2]};
const dgDepart=A=>{const C=dgCalc(A.id);if(!C)return [7,10];const st=dgEtat(A.id);if(st.passe&&!arenaDone(A)){const s=C.salles[C.salleChamp];return [Math.floor((s.x0+s.x1)/2),s.y1-1]}return C.depart};
function dgPorteOuverte(A,p){const st=dgEtat(A.id);
  if(p.t==='o'||st.passe||arenaDone(A)||st.o[p.i])return true;
  if(p.t==='e'||p.t==='x')return !!st.enigme;
  if(p.t==='b')return [0,1,2].every(k=>trBeaten(A,k));
  return false}

/* ---- l'état des énigmes pendant la visite (non sauvegardé, sauf « résolue ») ---- */
function dgRT(A){const n=A.id;if(DG_RT[n])return DG_RT[n];const C=dgCalc(n),st=dgEtat(n),blocs=C.items.filter(i=>i.s==='bloc').map(i=>({x:i.x,y:i.y,x0:i.x,y0:i.y,nom:i.it[3]}));
  if(st.enigme){const ci=C.items.filter(i=>i.s==='cible');const ok=DG_CIBLE_OK[C.D.enigme.sorte]||(()=>true);
    blocs.forEach(b=>{const c=ci.find(c=>ok(b.nom,c.it[3])&&!blocs.some(o=>o!==b&&o.x===c.x&&o.y===c.y));if(c){b.x=c.x;b.y=c.y}})}
  return DG_RT[n]={blocs,cables:C.items.filter(i=>i.s==='cable').map(i=>({x:i.x,y:i.y,sorte:i.it[3],r:st.enigme?dgCableBut(i.it[3]):i.it[4]})),voyants:{},leviers:[]}}
const dgCableBut=s=>s==='h'?0:s==='v'?1:s==='c1'?1:3;
const dgCableOk=c=>c.sorte==='h'||c.sorte==='v'?c.r%2===dgCableBut(c.sorte):c.r===dgCableBut(c.sorte);
function dgResoudre(A){const st=dgEtat(A.id);if(st.enigme)return;st.enigme=1;save();sfx('secret');trk('setting',{k:'donjon_enigme',v:A.id});
  qkTimeout(()=>say([{t:DONJONS[A.id].enigme.bravo}]),250)}
function dgVerifCibles(A){const C=dgCalc(A.id),rt=dgRT(A),ci=C.items.filter(i=>i.s==='cible'),ok=DG_CIBLE_OK[C.D.enigme.sorte]||(()=>true),sorte=C.D.enigme.sorte;
  if(sorte==='balance'){const b=rt.blocs[0],sur=ci.find(c=>c.x===b.x&&c.y===b.y);if(!sur)return;
    if(ok(b.nom,sur.it[3]))dgResoudre(A);else say([{t:"La balance penche encore plus : le plateau du suivi s'écrase. Corriger le suivi de la météo, c'est compter deux fois l'hiver doux."},{t:"Le poids de la météo corrige la référence : c'est elle qu'on ramène aux conditions de l'année de suivi."}]);return}
  if(ci.every(c=>rt.blocs.some(b=>b.x===c.x&&b.y===c.y&&ok(b.nom,c.it[3]))))dgResoudre(A);
  else if(sorte==='cartons'&&ci.every(c=>rt.blocs.some(b=>b.x===c.x&&b.y===c.y)))say([{t:"Les quatre cartons sont sur les étagères, mais pas dans l'ordre de l'arbre. L'étagère grince. Du plus large au plus fin : site, point, compteur, mesures."}])}
function dgPousser(A,b,dir){
  const [dx,dy]=DIRS[dir],nx=b.x+dx,ny=b.y+dy,C=dgCalc(A.id);
  if(dgEtat(A.id).enigme&&C.D.enigme.sorte!=='balance')return say([{t:"C'est bien rangé comme ça. On ne touche plus à rien."}]);
  if(dgSalleDe(C,nx,ny)!==dgSalleDe(C,b.x,b.y)||tileAt(nx,ny)!=='a'||isSolid(nx,ny)){sfx('bump');return}
  b.x=nx;b.y=ny;sfx('roll');dgVerifCibles(A);
}
/* ---- à chaque pas : les dalles qui s'effondrent, la courbe du talon ---- */
function dgPas(){
  const A=curArena();if(!A||!dgCalc(A.id))return false;const C=dgCalc(A.id),st=dgEtat(A.id),si=dgSalleDe(C,P.x,P.y);
  if(si!==AR.salle){AR.salle=si;fade=Math.max(fade,.35)}
  if(st.enigme||st.passe||arenaDone(A))return false;
  const E=C.D.enigme;if(si!==E.salle)return false;
  if(E.sorte==='dalles'){const f=C.items.find(i=>i.s==='dalles');const [,x0,y0,w,h]=f.it,s=C.salles[si],rx=P.x-s.x0,ry=P.y-s.y0;
    if(ry<y0){dgResoudre(A);return false}
    if(rx>=x0&&rx<x0+w&&ry>=y0&&ry<y0+h){const d=dgDalle(A.id,rx-x0,ry-y0);if(!d.ok){sfx('bad');
      say([{t:`La dalle « ${d.v} » s'effondre ! ${d.pourquoi}`},{t:"Retour au début du couloir."}],()=>warp(S.map,s.x0+7,s.y1-1,'up'));return true}}}
  if(E.sorte==='talon'){const f=C.items.find(i=>i.s==='talon'),s=C.salles[si],[,x0,y,nb]=f.it,i=P.x-s.x0-x0;
    if(P.y-s.y0===y&&i>=0&&i<nb){const h=i*2,v=dgCourbe(i);if(dgNuit(h)){dgResoudre(A)}else say([{t:`${h} h : ${v.toLocaleString('fr-FR')} kW. ${h>=8&&h<18?'Le bâtiment travaille : c’est une heure d’occupation, pas le talon.':'Des gens arrivent ou repartent : la courbe monte ou descend. Le talon, c’est quand plus personne n’est là.'}`}])}}
  return false;
}
/* les dalles du laboratoire : un chemin de valeurs plausibles au milieu des anomalies */
const DG_CHEMIN=[[6,2],[6,1],[7,1],[8,1],[8,0]];
function dgDalle(n,i,j){
  const sur=DG_CHEMIN.some(([a,b])=>a===i&&b===j),k=(i*7+j*13)%4;
  if(sur)return {ok:1,v:['18,2','17,9','18,6','19,1','18,4'][(i+j)%5]};
  return [{v:'999,9',pourquoi:'Un pic impossible : Picatron a frappé.'},{v:'—',pourquoi:"Un trou : Lacunor est passé par là."},{v:'18,2 ×2',pourquoi:'Un doublon : la même mesure, deux fois.'},{v:'−4,0',pourquoi:"Une consommation négative, sans panneaux solaires : impossible."}][k];
}
const dgNuit=h=>h<6||h>=21;
/* la courbe du sol de l'observatoire : une journée de semaine du site, heure par heure (de 2 h en 2 h) */
const dgCourbe=i=>{const c=weekCurve(S.site||'ecole');return Math.round(c[48+i*4]*10)/10};

/* ---- la flèche d'objectif dans le donjon : la cible si on peut l'atteindre ; sinon ce qui barre la route
   (le coffre, l'énigme, la porte), trouvé par un parcours en largeur depuis le joueur ---- */
let DG_CIB={k:'',t:0,v:null};
function dgCible(A,but){
  const C=dgCalc(A.id);if(!C||!but)return but;const st=dgEtat(A.id);if(st.passe||arenaDone(A))return but;
  const k=A.id+':'+P.x+','+P.y+':'+but,now=performance.now();if(DG_CIB.k===k&&now-DG_CIB.t<400)return DG_CIB.v;
  const so=new Set(objsFor(S.map).filter(o=>o.solid).map(o=>o.x+','+o.y)),libre=(a,b)=>{const c=tileAt(a,b);return c!==undefined&&c!=='E'&&!SOLID.has(c)&&!so.has(a+','+b)};   // un seul relevé des objets : le parcours reste léger
  const vu=new Set([P.x+','+P.y]),file=[[P.x,P.y]];
  while(file.length){const [x,y]=file.shift();for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]){const a=x+dx,b=y+dy,id=a+','+b;if(vu.has(id)||!libre(a,b))continue;vu.add(id);file.push([a,b])}}
  const pres=([x,y])=>[[1,0],[-1,0],[0,1],[0,-1]].some(([dx,dy])=>vu.has((x+dx)+','+(y+dy)));
  let v=but;
  if(!pres(but)){const coffre=C.items.find(i=>i.s==='k'&&!st.coffres[i.si]&&pres([i.x,i.y]));
    const E=C.D.enigme,piece=!st.enigme&&C.items.find(i=>i.si===E.salle&&['cible','bloc','cable','voyant','levier','dalles','talon'].includes(i.s)&&(i.s==='dalles'||i.s==='talon'?vu.has((C.salles[i.si].x0+7)+','+(C.salles[i.si].y1-1)):pres([i.x,i.y])));
    const porte=C.portes.find(p=>!dgPorteOuverte(A,p)&&pres([p.x,p.y])&&(p.t!=='k'||st.cles>0));
    v=coffre?[coffre.x,coffre.y]:piece?(piece.s==='dalles'||piece.s==='talon'?[C.salles[piece.si].x0+7,C.salles[piece.si].y0+5]:[piece.x,piece.y]):porte?[porte.x,porte.y]:but}
  DG_CIB={k,t:now,v};return v;
}
/* ---- la caméra : elle se cale sur la salle, comme un écran de Zelda ---- */
function dgCamera(ox,oy,vw,vh){
  const A=curArena();if(!A)return [ox,oy];const C=dgCalc(A.id);if(!C)return [ox,oy];const si=dgSalleDe(C,P.x,P.y);if(si<0)return [ox,oy];
  const s=C.salles[si],X0=s.x0*TS,X1=(s.x1+1)*TS,Y0=s.y0*TS,Y1=(s.y1+1)*TS;
  const cl=(o,a,b,v)=>b-a<=v?Math.round(a-(v-(b-a))/2):Math.max(a,Math.min(b-v,o));
  return [cl(ox,X0,X1,vw),cl(oy,Y0,Y1,vh)];
}

/* ---- le choix à la première visite : explorer, ou aller directement au champion ---- */
function dgChoix(A,suite){
  const ov=openPanel(A.name+' · '+DONJONS[A.id].titre,{sansCours:true}),b=ov.querySelector('.pbody');
  b.innerHTML=`<h3>${esc(DONJONS[A.id].titre)}</h3><p>L'arène est un petit donjon : des salles, une énigme liée à l'étape, une petite clé dans un coffre, trois dresseurs, et ${esc(A.champ)} tout au fond.</p>
    <div class="opts"><button class="opt" id="dgExp"><b>Explorer le donjon</b><small>Recommandé : l'énigme te fait manipuler l'étape.</small></button><button class="opt" id="dgDir"><b>Aller directement au champion</b><small>Les portes s'ouvrent ; les trois dresseurs t'attendent devant l'estrade.</small></button></div>
    <p class="dnote">Tu pourras changer d'avis : le panneau de l'entrée propose toujours le raccourci.</p>`;
  b.querySelector('#dgExp').onclick=()=>{closePanel();trk('setting',{k:'donjon',v:A.id+':explorer'});if(suite)suite()};
  b.querySelector('#dgDir').onclick=()=>{closePanel();dgRaccourci(A)};b.querySelector('#dgExp').focus();
}
function dgRaccourci(A){const st=dgEtat(A.id);st.passe=1;save();trk('setting',{k:'donjon',v:A.id+':raccourci'});arenaInit(A);const [x,y]=dgDepart(A);warp('arena'+A.id,x,y,'up');
  say([{t:`Les portes s'ouvrent. ${A.champ} t'attend sur l'estrade, et ses trois dresseurs juste devant.`}])}

/* ---- les objets du donjon : portes, coffre, énigme, décor ---- */
function dgObjs(A,o){
  const n=A.id,C=dgCalc(n);if(!C)return;const st=dgEtat(n),rt=dgRT(A),th=A.theme,fini=st.enigme||st.passe||arenaDone(A),plats=[];
  C.portes.forEach(p=>{if(dgPorteOuverte(A,p))return;
    const msg=p.t==='k'?(st.cles?null:"Fermée à clé. Un coffre doit bien traîner quelque part dans le donjon."):p.t==='b'?`La porte de ${A.champ}. Elle ne s'ouvre qu'à ceux qui ont battu les trois dresseurs.`:p.t==='x'?"Un vide. Il faudrait un pont. Il apparaîtra peut-être quand la salle aura livré son secret.":"Une porte scellée. L'énigme de la salle doit l'ouvrir. "+DONJONS[n].enigme.indice;
    const ouvrir=()=>{if(p.t==='k'&&st.cles>0){st.cles--;st.o[p.i]=1;save();sfx('door');toast('La petite clé tourne dans la serrure.');return}say([{t:msg}])};
    o.push({x:p.x,y:p.y,kind:'dgporte',solid:1,go:ouvrir,act:ouvrir,draw:(c,X,Y,t)=>dgDessinPorte(c,X,Y,p.t,th,t)})});
  C.items.forEach(i=>{
    if(i.s==='k'){const ouvert=st.coffres[i.si];o.push({x:i.x,y:i.y,kind:'dgcoffre',solid:1,draw:(c,X,Y)=>dgDessinCoffre(c,X,Y,ouvert),
      act:()=>{if(st.coffres[i.si])return say([{t:'Le coffre est vide. Tu as déjà la clé, ou tu l’as déjà utilisée.'}]);st.coffres[i.si]=1;st.cles++;save();jingle('badge');say([{t:'Tu ouvres le coffre… Une petite clé ! Elle ouvre une porte de ce donjon.'}])}})}
    else if(i.s==='o'){const k=i.it[1];o.push({x:i.x,y:i.y,kind:'dgdeco',solid:1,draw:(c,X,Y,t)=>dgDessinDeco(c,X,Y,k,t),act:DG_TXT[k]?()=>say([{t:DG_TXT[k]}]):null})}
    else if(i.s==='t')o.push({x:i.x,y:i.y,kind:'sign',solid:1,act:()=>{const D=DONJONS[n],L=[{t:i.it[3]}];
      if(i.si===DONJONS[n].entree&&!arenaDone(A)&&!st.passe){L.push({t:'En dessous, une flèche : « Accès direct au champion ». Tu peux l’emprunter quand tu veux.'});say(L,()=>dgChoix(A))}else say(L)}});
    else if(i.s==='reset')o.push({x:i.x,y:i.y,kind:'sign',solid:1,act:()=>{if(fini)return say([{t:i.it[3]+'. Plus rien à remettre en place.'}]);rt.blocs.forEach(b=>{b.x=b.x0;b.y=b.y0});sfx('select');say([{t:i.it[3]+' : tout revient à sa place.'}])}});
    else if(i.s==='cible')plats.push({x:i.x,y:i.y,kind:'dgcible',flat:1,draw:(c,X,Y)=>dgDessinCible(c,X,Y,i.it[3],th)});
    else if(i.s==='cable'){const cb=rt.cables.find(c=>c.x===i.x&&c.y===i.y);o.push({x:i.x,y:i.y,kind:'dgcable',solid:1,draw:(c,X,Y,t)=>dgDessinCable(c,X,Y,cb,fini,t),
      act:()=>{if(fini)return;cb.r=(cb.r+1)%4;sfx('select');if(rt.cables.every(dgCableOk))dgResoudre(A)}})}
    else if(i.s==='voyant'){const id=i.x+','+i.y;o.push({x:i.x,y:i.y,kind:'dgvoyant',solid:1,draw:(c,X,Y,t)=>dgDessinVoyant(c,X,Y,fini||rt.voyants[id],t),
      act:()=>{if(fini||rt.voyants[id])return say([{t:'Éteint. Il ne consomme plus rien, et il boude.'}]);rt.voyants[id]=1;sfx('select');const N=C.items.filter(x=>x.s==='voyant').length,k=Object.keys(rt.voyants).length;
        if(k>=N)dgResoudre(A);else say([{t:`Un voyant rouge de moins (${k}/${N}). Un Veillotron grogne dans le noir.`}])}})}
    else if(i.s==='levier'){const [,,,nom,ordre]=i.it;o.push({x:i.x,y:i.y,kind:'dglevier',solid:1,draw:(c,X,Y)=>dgDessinLevier(c,X,Y,fini||rt.leviers.includes(ordre),nom),
      act:()=>{if(fini)return;if(rt.leviers.includes(ordre))return;if(ordre!==rt.leviers.length+1){rt.leviers=[];sfx('bad');return say([{t:`${nom} avant le reste ? Tous les leviers remontent d'un coup. Le chef soupire du haut de sa grue.`},{t:DONJONS[n].enigme.indice}])}
        rt.leviers.push(ordre);sfx('select');if(rt.leviers.length===3)dgResoudre(A);else say([{t:`Levier « ${nom} » abaissé.`}])}})}
    else if(i.s==='dalles'){const [,x0,y0,w,h]=i.it,s=C.salles[i.si];for(let a=0;a<w;a++)for(let b=0;b<h;b++){const d=dgDalle(n,a,b);plats.push({x:s.x0+x0+a,y:s.y0+y0+b,kind:'dgdalle',flat:1,draw:(c,X,Y)=>dgDessinDalle(c,X,Y,d,fini)})}}
    else if(i.s==='talon'){const [,x0,y,nb]=i.it,s=C.salles[i.si];for(let a=0;a<nb;a++)plats.push({x:s.x0+x0+a,y:s.y0+y,kind:'dgtalon',flat:1,draw:(c,X,Y)=>dgDessinTalon(c,X,Y,a,fini)})}
  });
  rt.blocs.forEach(b=>o.push({x:b.x,y:b.y,kind:'dgbloc',solid:1,go:()=>dgPousser(A,b,P.dir),act:()=>say([{t:`${b.nom}. Marche contre pour la pousser.`}]),draw:(c,X,Y)=>dgDessinBloc(c,X,Y,b.nom,th)}));
  o.push(...plats);   // en dernier : les marques au sol ne cachent jamais un bloc ou une porte
}

/* ---- dessins ---- */
function dgSol(x,A,F,WALL){
  const g=MAPS['arena'+A.id].g,t=A.theme,C=dgCalc(A.id),fond={cadastre:'#5d4a36',flux:'#14171f',labo:'#5b6670',archives:'#4a3421',courbes:'#070b16',nuit:'#0b0d14',chantier:'#4d3326',preuve:'#7a6430'}[t]||'#111';
  const sol=c=>c==='a'||c==='x'||c==='E';
  for(let j=0;j<DG_H;j++)for(let i=0;i<DG_W;i++){const X=i*16,Y=j*16,ch=g[j][i];
    if(sol(ch)){F[t](X,Y,i,j);continue}
    if(g[j+1]&&sol(g[j+1][i])){R(x,X,Y,16,16,WALL[0]);R(x,X,Y+13,16,3,WALL[1]);R(x,X,Y,16,2,shade(WALL[0]));
      if(AHASH(i,j)>.82){R(x,X+4,Y+3,8,7,WALL[1]);R(x,X+5,Y+4,6,5,shade(WALL[0]))}}
    else R(x,X,Y,16,16,fond)}
  // l'estrade du champion
  const [cx,cy]=C.champ,D={cadastre:'#c9dceb',flux:'#3d4660',labo:'#c6d2db',archives:'#a87a45',courbes:'#22305a',nuit:'#444a60',chantier:'#8a8d93',preuve:'#d9c58a'}[t];
  R(x,(cx-2)*16,(cy-1)*16,5*16,2*16,D);R(x,(cx-2)*16,(cy-1)*16,5*16,1,'rgba(255,255,255,.35)');R(x,cx*16,(cy+1)*16,16,16,D);for(let k=0;k<3;k++)R(x,cx*16,(cy+1)*16+4+k*4,16,1,'rgba(0,0,0,.18)');
  // la porte de sortie
  const [sx,sy]=C.sortie;R(x,sx*16,sy*16,16,16,D);R(x,sx*16+2,sy*16+3,12,10,'#8a3b3b');R(x,sx*16+3,sy*16+4,10,8,'#a54a4a');
  // tapis de couloir entre les portes ouvertes de la salle du champion
  if(t==='preuve')for(let j=cy+2;j<C.salles[C.salleChamp].y1;j++){R(x,cx*16,j*16,16,16,'#a23a3a');R(x,cx*16,j*16,1,16,'#c9a227');R(x,cx*16+15,j*16,1,16,'#c9a227')}
}
function dgDessinPorte(c,X,Y,t,th,tk){
  if(t==='x'){R(c,X,Y,16,16,'#05070e');for(let k=0;k<4;k++)R(c,X+((k*5+tk/6)%16|0),Y+3+k*3,1,1,'#9fb4d8');return}
  const bois=t==='b'?'#7a2a2a':t==='k'?'#6b4a2b':'#39426a';R(c,X,Y-2,16,18,bois);R(c,X+1,Y-1,14,16,shade(bois));
  for(let k=0;k<3;k++)R(c,X+2+k*5,Y,2,14,'#1d1a2b');
  if(t==='k'){R(c,X+6,Y+5,4,5,'#c9a227');R(c,X+7,Y+7,2,2,'#1d1a2b')}
  if(t==='b'){R(c,X+5,Y+3,6,6,'#c9a227');R(c,X+7,Y+5,2,2,'#c43d3d')}
  if(t==='e'){const p=(Math.sin(tk/10)+1)/2;R(c,X+5,Y+4,6,6,`rgba(176,106,181,${.5+p*.5})`);R(c,X+7,Y+6,2,2,'#fff')}
}
function dgDessinCoffre(c,X,Y,ouvert){R(c,X+1,Y+5,14,10,'#8a5f36');R(c,X+1,Y+5,14,2,'#a87a45');R(c,X+1,Y+9,14,1,'#c9a227');R(c,X+7,Y+8,2,3,'#c9a227');
  if(ouvert){R(c,X+1,Y+1,14,4,'#5d4024');R(c,X+3,Y+5,10,3,'#1d1a2b')}else{R(c,X+1,Y+2,14,4,'#a87a45');R(c,X+1,Y+2,14,1,'#c99a62')}}
function dgDessinCible(c,X,Y,nom,th){c.strokeStyle=th==='preuve'?'#c9a227':'#c43d3d';c.lineWidth=1.5;c.setLineDash([3,2]);c.strokeRect(X+1.5,Y+1.5,13,13);c.setLineDash([]);
  if(nom&&nom.length<=2){c.fillStyle='#c43d3d';c.font='bold 7px monospace';c.textAlign='center';c.fillText(nom,X+8,Y+11)}}
function dgDessinBloc(c,X,Y,nom,th){
  if(th==='cadastre'){R(c,X+4,Y+3,8,12,'#f7f0dc');R(c,X+4,Y+3,8,3,'#c43d3d');R(c,X+4,Y+9,8,2,'#c43d3d');R(c,X+3,Y+14,10,2,'rgba(0,0,0,.25)');return}
  if(th==='preuve'){R(c,X+2,Y+5,12,10,'#5b6380');R(c,X+5,Y+2,6,4,'#5b6380');R(c,X+4,Y+8,8,4,'#9fb4d8');c.fillStyle='#fff';c.font='bold 5px monospace';c.textAlign='center';c.fillText('DJU',X+8,Y+12);return}
  R(c,X+1,Y+3,14,12,'#c89b62');R(c,X+1,Y+3,14,2,'#e0b880');R(c,X+7,Y+3,2,12,'#a87a45');R(c,X+3,Y+7,10,4,'#f7f0dc');c.fillStyle='#1c2440';c.font='bold 4px monospace';c.textAlign='center';c.fillText(nom.split(' ')[0].slice(0,7),X+8,Y+10.5);
}
function dgDessinCable(c,X,Y,cb,fini,tk){
  R(c,X,Y,16,16,'#20242f');R(c,X+1,Y+1,14,14,'#2b3142');const ok=fini,col=ok?'#4fd1c5':'#8a97a3';const seg=d=>{if(d==='u')R(c,X+7,Y,2,9,col);if(d==='d')R(c,X+7,Y+7,2,9,col);if(d==='l')R(c,X,Y+7,9,2,col);if(d==='r')R(c,X+7,Y+7,9,2,col)};
  const r=cb.r;if(cb.sorte==='h'||cb.sorte==='v'){if(r%2===0){seg('l');seg('r')}else{seg('u');seg('d')}}else{[['u','r'],['r','d'],['d','l'],['l','u']][r].forEach(seg)}
  if(ok&&(tk>>2)%4===0)R(c,X+6,Y+6,4,4,'#f2c12e');
}
function dgDessinVoyant(c,X,Y,eteint,tk){R(c,X+3,Y+4,10,9,'#2c3550');R(c,X+4,Y+5,8,6,'#1a2238');const on=!eteint&&(tk>>4)%2===0;R(c,X+11,Y+10,2,2,eteint?'#3b4a6b':on?'#ff3b3b':'#a01818');
  if(!eteint){c.fillStyle='rgba(255,59,59,.25)';c.beginPath();c.arc(X+12,Y+11,5,0,7);c.fill()}}
function dgDessinLevier(c,X,Y,bas,nom){R(c,X+3,Y+10,10,5,'#59627c');R(c,X+7,bas?Y+9:Y+2,2,bas?3:9,'#8a8f9a');R(c,X+5,bas?Y+11:Y,6,3,bas?'#2aa198':'#c43d3d');
  c.fillStyle='#1c2440';c.font='bold 4px monospace';c.textAlign='center';c.fillText(nom.slice(0,8),X+8,Y+16)}
function dgDessinDalle(c,X,Y,d,fini){R(c,X+1,Y+1,14,14,fini||d.ok?'#dfe6eb':'#e9dede');R(c,X+1,Y+1,14,1,'#fff');c.fillStyle=fini?'#2f9e7a':'#1c2440';c.font='bold 4.5px monospace';c.textAlign='center';c.fillText(d.v,X+8,Y+10)}
function dgDessinTalon(c,X,Y,i,fini){const v=dgCourbe(i),mx=Math.max(...Array.from({length:12},(_,k)=>dgCourbe(k))),h=Math.max(2,Math.round(v/mx*12));
  R(c,X+1,Y+1,14,14,'#1f2c4d');R(c,X+4,Y+15-h,8,h,fini&&dgNuit(i*2)?'#2aa198':'#f2a33a');c.fillStyle='#9fb4d8';c.font='4px monospace';c.textAlign='center';c.fillText(i*2+'h',X+8,Y+5)}

/* le décor : une petite bibliothèque d'objets, par thème. Ce qu'on lit en les examinant : DG_TXT */
const DG_TXT={plan:"Un plan cadastral. Chaque parcelle a son numéro, chaque numéro a son propriétaire.",theodolite:"Un théodolite. Il mesure des angles. Le géomètre, lui, mesure ta patience.",
  maquette:"La maquette du site : le bâtiment, la cour, et rien d'autre. Le périmètre s'arrête là.",gardien:"Le logement du gardien. Son propre compteur, sa propre facture : hors du périmètre.",lampadaire:"Un lampadaire de la rue : éclairage public, hors du périmètre.",
  compteur:"Une plaque de compteur. Le PDL a 14 chiffres. Les autres numéros sont des leurres : numéro de série, index, téléphone du dépanneur.",carte:"Une carte du quartier, avec des pointillés autour de chaque site.",
  linky:"Un Linky géant. Il compte, il transmet, il ne juge pas.",gazpar:"Un Gazpar géant. Une fois par jour, il envoie un volume en m³.",enedis:"Le poste Enedis : c'est par lui que passent les données de mesure.",serveur:"Une baie de serveurs. Ça clignote, ça ronronne, ça collecte.",horloge:"Une horloge « J+1 » : la donnée arrive toujours un peu après.",
  'bocal-trou':"Un bocal : Lacunor dedans. Il te regarde à travers un trou.",'bocal-doublon':"Un bocal : Doublonix. Deux têtes, deux fois le même regard.",'bocal-pic':"Un bocal : Picatron. Le verre est fêlé tout en haut.",'bocal-recule':"Un bocal : Reculax. Il marche à reculons contre la paroi.",'bocal-boucle':"Un bocal : Boucloop, roulé en anneau.",'bocal-unite':"Un bocal : Wattomix. L'étiquette dit « 22 500 ». De quoi ? Mystère.",'bocal-heure':"Un bocal : Horlogix. Il avance d'une heure, puis recule.",
  tamis:"Le grand tamis : les valeurs plausibles passent, les aberrantes restent dessus.",tableau:"Un tableau blanc couvert de courbes. Quelqu'un a entouré un 999,9 en rouge.",balance:"Une balance : d'un côté des m³, de l'autre des kWh. Sans coefficient, elle ne s'équilibrera jamais.",
  telescope:"Le télescope est pointé sur la ville. Sur la courbe d'un bâtiment, on voit même la nuit.",ecran:"Un écran géant : une courbe de charge défile, comme un électrocardiogramme.",projecteur:"Un projecteur pointé vers le mur : trois points qui, presque, s'alignent sur une droite.",thermometre:"Un thermomètre géant gradué en DJU.",etoile:"Une étoile au sol. Elle brille un peu, toute la nuit. Comme un talon.",
  portrait:"Un portrait. Ses yeux suivent tes pas, et ton voyant de veille.",horloge2:"",armure:"Une armure. Elle ne consomme rien. Elle est bien la seule ici.",tele:"Un téléviseur en veille. Un petit point rouge, depuis 2014.",chaudiere:"La chaudière. Weekendragon dort dedans, le week-end compris.",lune:"La lune, par la fenêtre. Elle éclaire gratuitement. Prends-en de la graine.",
  betonniere:"Une bétonnière qui tourne à vide. Le chef dit que c'est pour l'ambiance.",grue:"Le mât de la grue. Le Chef Sobriété est tout en haut, il voit tout le chantier.",panneaupv:"Des panneaux solaires sur palettes. On les posera après la sobriété et l'efficacité. Pas avant.",
  archives:"Des archives scellées à la cire : les preuves des années passées.",balancecentre:"La grande balance de la preuve. Elle attend qu'on compare à conditions égales.",jury:"Un jury de Wattlings. Ils lèvent tous la main quand on parle de météo.",vitrail:"Un vitrail : un thermomètre, une courbe, une balance. L'histoire de la mesure.",colonne:"Une colonne de marbre. Elle tient debout depuis des années, sans consommer un watt."};
function dgDessinDeco(c,X,Y,k,t){
  const r=(a,b,w,h,col)=>R(c,X+a,Y+b,w,h,col);
  switch(k){
    case 'plan':case 'carte':r(1,1,14,11,'#2f6db5');r(2,2,12,9,'#e3edf5');r(3,4,4,3,'#bcd3e4');r(8,3,5,5,'#c9dceb');c.strokeStyle='#c43d3d';c.setLineDash([1,1]);c.strokeRect(X+7.5,Y+2.5,6,6);c.setLineDash([]);break;
    case 'theodolite':r(7,3,3,4,'#f2c12e');r(6,2,5,2,'#59627c');r(5,7,1,8,'#8a5f36');r(8,7,1,8,'#8a5f36');r(11,7,1,8,'#8a5f36');break;
    case 'maquette':r(0,3,16,12,'#9fcf86');r(3,5,10,7,'#f0e0c8');r(3,4,10,2,'#c0503a');r(7,9,2,3,'#6b4a2b');break;
    case 'gardien':r(2,4,12,11,'#d6b48a');r(1,2,14,3,'#8a5f36');r(6,9,4,6,'#6b4a2b');r(3,6,3,3,'#9fb4d8');break;
    case 'lampadaire':r(7,2,2,13,'#59627c');r(5,1,6,2,'#59627c');r(6,3,4,2,'#ffe07a');break;
    case 'compteur':case 'linky':r(3,1,10,14,k==='linky'?'#b6d957':'#9aa0a8');r(5,3,6,4,'#1c2440');r(6,4,4,2,'#4fd1c5');r(5,9,6,1,'#1c2440');r(5,11,4,1,'#1c2440');break;
    case 'gazpar':r(3,2,10,13,'#e8d24a');r(5,4,6,4,'#f7f0dc');r(6,5,4,2,'#333');break;
    case 'enedis':r(1,1,14,14,'#2f6db5');r(3,3,10,4,'#e8eef7');r(3,9,4,4,'#f2c12e');r(9,9,4,4,'#1c2440');break;
    case 'serveur':r(2,-4,12,19,'#59627c');r(3,-3,10,16,'#20242f');for(let a=0;a<4;a++){r(4,-2+a*4,8,1,'#444c63');r(11,-1+a*4,1,1,((t>>3)+a)%3?'#4fd1c5':'#f2a33a')}break;
    case 'horloge':r(4,1,8,14,'#6b4a2b');r(5,2,6,6,'#f7f0dc');r(8,3,1,3,'#1c2440');r(8,5,2,1,'#1c2440');r(7,10,2,3,'#c9a227');break;
    case 'bureau':case 'table':r(1,5,14,6,'#8a5f36');r(1,5,14,2,'#a87a45');r(2,11,2,4,'#5d4024');r(12,11,2,4,'#5d4024');r(5,3,6,3,'#f7f0dc');break;
    case 'blouse':r(4,1,8,13,'#f7f9fb');r(4,1,8,2,'#cfd8e0');r(7,3,2,10,'#dfe6eb');break;
    case 'paillasse':r(0,5,16,10,'#f7f9fb');r(0,5,16,2,'#2aa198');r(3,1,3,5,'rgba(140,200,235,.8)');r(9,2,2,4,'#c0503a');break;
    case 'tamis':r(0,4,16,10,'#8a97a3');r(1,5,14,8,'#cfd8e0');for(let a=1;a<15;a+=2)r(a,5,1,8,'#a5b2bd');for(let a=6;a<13;a+=2)r(1,a,14,1,'#a5b2bd');break;
    case 'tableau':r(0,1,16,11,'#f7f9fb');r(0,1,16,1,'#8a97a3');c.strokeStyle='#2aa198';c.beginPath();c.moveTo(X+2,Y+9);c.lineTo(X+6,Y+5);c.lineTo(X+9,Y+8);c.lineTo(X+13,Y+3);c.stroke();r(11,2,3,3,'#c43d3d');break;
    case 'comptoir':r(0,4,16,11,'#8a5f36');r(0,4,16,2,'#c89b62');break;
    case 'lampe':r(7,6,2,9,'#c9a227');r(3,3,10,4,'#2f9e7a');r(5,7,6,1,'#ffe07a');break;
    case 'echelle':r(3,-6,2,21,'#a87a45');r(11,-6,2,21,'#a87a45');for(let a=-4;a<14;a+=4)r(3,a,10,1,'#a87a45');break;
    case 'etagere':r(1,-6,14,22,'#6b4a2b');for(let a=0;a<4;a++){r(2,-5+a*5,12,4,'#4a3421');for(let b=0;b<4;b++)r(3+b*3,-4+a*5,2,3,['#c0503a','#2aa198','#f2a33a','#4a78c9'][(a+b)%4])}break;
    case 'balance':case 'balancecentre':r(7,2,2,13,'#c9a227');r(1,3,14,1,'#c9a227');r(0,6,5,2,'#c9a227');r(11,6,5,2,'#c9a227');r(1,4,1,2,'#c9a227');r(14,4,1,2,'#c9a227');r(5,14,6,2,'#a07a1a');break;
    case 'carton':r(1,3,14,12,'#c89b62');r(1,3,14,2,'#e0b880');r(7,3,2,12,'#a87a45');break;
    case 'chariot':r(1,4,14,8,'#59627c');r(2,2,4,4,'#c0503a');r(7,1,3,5,'#2aa198');r(2,12,3,3,'#1d1a2b');r(11,12,3,3,'#1d1a2b');break;
    case 'telescope':r(2,3,11,4,'#59627c');r(12,2,3,6,'#9fb4d8');r(6,7,2,8,'#8a8f9a');r(3,14,9,1,'#8a8f9a');break;
    case 'ecran':r(0,-2,16,13,'#0b1020');r(1,-1,14,11,'#16335a');for(let a=0;a<6;a++){const h=2+((a*3+(t>>4))%6);r(2+a*2,9-h,1,h,'#4fd1c5')}break;
    case 'projecteur':r(4,6,8,7,'#59627c');r(11,8,4,3,'#ffe07a');c.fillStyle='rgba(255,224,122,.18)';c.beginPath();c.moveTo(X+15,Y+8);c.lineTo(X+30,Y+2);c.lineTo(X+30,Y+16);c.fill();break;
    case 'thermometre':r(6,-6,4,18,'#f7f0dc');r(7,-4,2,14,'#c43d3d');r(5,10,6,5,'#c43d3d');break;
    case 'etoile':r(7,4,2,8,'#ffe07a');r(4,7,8,2,'#ffe07a');r(7,7,2,2,'#fff');break;
    case 'portrait':r(2,1,12,13,'#c9a227');r(3,2,10,11,'#39426a');r(6,4,4,4,'#e0ac7e');r(5,8,6,5,'#6b2b2b');r(7,5,1,1,'#ff3b3b');break;
    case 'fauteuil':r(2,4,12,10,'#6b2b2b');r(2,2,12,4,'#8a3b3b');r(1,6,3,8,'#5a2020');r(12,6,3,8,'#5a2020');break;
    case 'armure':r(5,0,6,6,'#9aa0a8');r(4,6,8,8,'#8a8f9a');r(5,14,2,2,'#59627c');r(9,14,2,2,'#59627c');r(6,2,4,1,'#1d1a2b');break;
    case 'tele':r(1,3,14,10,'#2c3550');r(2,4,12,8,'#1a2238');r(13,11,2,2,(t>>4)%2?'#ff3b3b':'#a01818');break;
    case 'chaudiere':r(0,-2,16,17,'#c0503a');r(2,4,12,7,'#3a1d16');for(let a=0;a<3;a++)r(4+a*3,6,2,4,'#f2a33a');r(3,0,10,2,'#8a2f22');break;
    case 'tuyau':r(6,-6,4,22,'#8a8f9a');r(5,-2,6,2,'#59627c');r(5,8,6,2,'#59627c');break;
    case 'lune':r(4,1,8,8,'#f7f0dc');r(8,1,4,4,'#cfd8e8');break;
    case 'casque':r(3,7,10,6,'#f2c12e');r(5,5,6,3,'#f2c12e');r(2,12,12,2,'#d9a400');break;
    case 'cone':r(6,3,4,3,'#f2a33a');r(5,6,6,3,'#f7f0dc');r(4,9,8,4,'#f2a33a');r(3,13,10,2,'#c0503a');break;
    case 'betonniere':r(3,3,10,9,'#f2a33a');r(4,4,8,7,'#c0503a');r(6,6,4,3,'#59627c');r(2,12,12,2,'#59627c');r(3,14,3,2,'#1d1a2b');r(10,14,3,2,'#1d1a2b');break;
    case 'sacs':r(1,6,7,9,'#d9cfb8');r(8,7,7,8,'#cfc3a8');r(2,8,5,1,'#8a8f9a');break;
    case 'echafaudage':for(let a=0;a<2;a++)r(2+a*10,-14,2,29,'#8a8f9a');r(0,-4,16,3,'#a07845');r(0,-14,16,2,'#a07845');r(0,10,16,2,'#8a8f9a');break;
    case 'panneaupv':r(0,6,16,9,'#a07845');r(1,2,14,7,'#1c3a6b');r(1,2,14,1,'#4a78c9');r(5,2,1,7,'#4a78c9');r(10,2,1,7,'#4a78c9');break;
    case 'grue':r(5,-14,6,30,'#f2c12e');for(let a=-12;a<16;a+=4){r(5,a,6,1,'#c99a00')}break;
    case 'colonne':r(3,-18,10,32,'#f7f3ea');r(5,-18,2,32,'#fff');r(11,-18,2,32,'#d9cfb8');r(1,-20,14,3,'#d9cfb8');r(1,12,14,3,'#d9cfb8');break;
    case 'banc':r(0,6,16,4,'#8a5f36');r(0,4,16,2,'#a87a45');r(1,10,2,5,'#5d4024');r(13,10,2,5,'#5d4024');break;
    case 'archives':r(1,2,14,13,'#e8dcc0');r(1,2,14,2,'#c9bb92');r(6,6,4,4,'#c43d3d');break;
    case 'jury':{const p=['#2f6db5','#c0503a','#2aa198'][((X>>4)+(Y>>4))%3];r(4,2,8,7,'#f1c7a1');r(3,8,10,7,p);r(6,4,1,2,'#1d1a2b');r(9,4,1,2,'#1d1a2b');if((t>>5)%3===0)r(13,0,2,8,'#f1c7a1');break}
    case 'vitrail':r(2,0,12,14,'#c9a227');r(3,1,10,12,'#2f6db5');r(3,7,10,6,'#c43d3d');r(7,1,2,12,'#c9a227');r(3,6,10,1,'#c9a227');break;
    default:if(k.startsWith('bocal-')){r(2,-2,12,16,'rgba(140,200,235,.45)');r(2,-4,12,3,'#8a97a3');r(2,13,12,2,'#8a97a3');const im=typeof crImage==='function'&&crImage(k.slice(6));if(im){c.imageSmoothingEnabled=false;c.drawImage(im,X+3,Y,10,10)}r(3,-2,2,15,'rgba(255,255,255,.4)')}
  }
}
