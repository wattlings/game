/* Wattlings · jeu/voyages/gare.js
   La gare d'Ampère-sur-Loire, enfin ouverte : le hall, le guichet (où l'on reçoit son passeport),
   le tableau des départs, et le trajet en train vers une destination. */

/* ================= LE HALL DE LA GARE ================= */
voyCarte('gare',{
  nom:"Gare d'Ampère-sur-Loire",musique:'indoor',depart:[7,10],
  sansCarte:"Tu es dans la gare. Pour la carte de la ville, il faut d'abord en sortir.",
  /* W mur · o parquet · E sortie vers la ville */
  plan:[
    'WWWWWWWWWWWWWWWW',
    'WWWWWWWWWWWWWWWW',
    'WWWWWWWWWWWWWWWW',
    'WooooooooooooooW',
    'WooooooooooooooW',
    'WooooooooooooooW',
    'WooooooooooooooW',
    'WooooooooooooooW',
    'WooooooooooooooW',
    'WooooooooooooooW',
    'WooooooooooooooW',
    'WWWWWWWEWWWWWWWW'],
  sortie(){const d=BLD.find(b=>b.id==='gare').door;warp('town',d[0],d[1]+1,'down')},
  objectif(){
    if(!voyEtat().pass)return "Gare d'Ampère-sur-Loire : demande ton passeport des énergies au guichet.";
    const n=Object.keys(voyEtat().tampons).length,N=VOY.ordre.length;
    return n>=N?"Passeport complet : les cinq tampons y sont. Tu peux retourner partout, pour le plaisir.":`Choisis une destination au tableau des départs (${n}/${N} tampons dans ton passeport).`;
  },
  cibles(){return voyEtat().pass?[[9,2]]:[[4,4]]},
  objets(o){
    const D=(x,y,kind,solid,extra)=>o.push(Object.assign({x,y,kind,solid:solid?1:0,decor:1},extra||{}));
    // guichet : un comptoir, la guichetière derrière
    [3,4,5].forEach(x=>o.push({x,y:4,kind:'counter',solid:1,act:gareGuichet}));
    o.push({x:2,y:4,kind:'vGuichetBord',voy:1,solid:1,act:gareGuichet},{x:6,y:4,kind:'vGuichetBord',voy:1,solid:1,act:gareGuichet});
    o.push({x:4,y:3,kind:'npc',solid:1,still:1,who:'Mme Aiguillage',dir:'down',glow:!voyEtat().pass,pal:{skin:'#e0ac7e',shirt:'#27325a',pants:'#1c2440',jacket:'#27325a',hair:'#b8431f',style:'carre',hat:'#c43d3d',hatType:'cap',scarf:'#f2c12e',glasses:1,lash:1},act:gareGuichet});
    // tableau des départs et porte des quais, sur le mur du fond
    [8,9,10].forEach((x,i)=>o.push({x,y:2,kind:i===0?'vDeparts':'none',voy:1,act:gareDeparts}));
    o.push({x:13,y:2,kind:'vPorteQuai',voy:1,act:()=>voyEtat().pass?gareDeparts():voyParler([{t:"Accès aux quais. Un portillon : « Passeport des énergies exigé ». Le portillon a l'air très sûr de lui."}])});
    // affiches des destinations (un bandeau rouge sur celles qui ne sont pas encore ouvertes)
    D(1,2,'clockw',0,{act:voyDire(null,["L'horloge de la gare. Le chef de gare la remet à l'heure chaque matin depuis des années, pour des trains qui n'existaient pas.","C'est la seule horloge de France qui a toujours été en avance sur son réseau."])});
    VOY.ordre.slice(0,5).forEach((id,i)=>{const s=VOY.sites[id];o.push({x:[2,3,5,6,7][i],y:2,kind:'vAffiche',voy:1,theme:id,ferme:!s.ouvert,act:voyDire(null,[`Une affiche : « ${s.nom} · ${s.region} ».${s.ouvert?'':' En bandeau : « Prochainement ».'}`,s.accroche])})});
    // salle d'attente
    D(10,7,'bench',1);D(11,7,'bench',1);D(13,7,'bench',1);
    D(14,4,'vending',1,{act:voyDire(null,["Un distributeur. Il propose de l'eau, des biscuits, et une boisson énergisante nommée « 1 kWh ».","Vérification faite : la canette contient 0,13 kWh. De quoi faire tenir un humain une bonne heure en réunion. La publicité exagère d'un facteur huit : dans l'énergie, c'est presque de la retenue."])});
    o.push({x:1,y:9,kind:'plant',solid:1},{x:14,y:9,kind:'plant',solid:1});
    o.push({x:12,y:6,kind:'npc',solid:1,who:'Voyageur',dir:'down',pal:{skin:'#f1c7a1',shirt:'#7a8594',pants:'#2f3a5c',jacket:'#6b4a2b',hair:'#9a9aa2',hat:'#3a3a44',hatType:'beret',prop:'book',glasses:1},
      act:()=>{VOY.nVoyageur=(VOY.nVoyageur||0)+1;voyParler([{w:'Voyageur',t:[VOY.sites.nucleaire&&VOY.sites.nucleaire.ouvert?"J'ai attendu le train pour la centrale nucléaire si longtemps que, maintenant qu'il existe, je n'ose plus le prendre. J'ai mes habitudes sur ce banc.":"J'attends le train pour la centrale nucléaire. Le tableau dit « prochainement ». J'ai pris un livre. Puis un deuxième.","On m'a dit que le train roulait à l'électricité. J'ai demandé laquelle. On m'a regardé bizarrement. Vous, vous comprenez la question, non ?","Un conseil de voyageur : au solaire, prenez un chapeau. En Bretagne, tenez-le. Dans les Alpes, mettez-en deux."][VOY.nVoyageur%3]}])}});
    D(8,9,'vBagages',1,{voy:1,decor:0,act:voyDire(null,["Une valise oubliée, étiquetée « Service Énergie · mairie d'Ampère-sur-Loire ».","Dedans : un wattmètre, trois gilets orange et un rapport intitulé « Sobriété : synthèse en 400 pages ». L'ironie pèse 2 kg."])});
  }
});

/* ---- dessins du hall ---- */
OFX_ANIM.vDeparts=1;   // le tableau clignote : il est redessiné à chaque image
VOY.dessins.vGuichetBord=(c,o,X,Y)=>{R(c,X,Y+3,16,13,'#b8864a');R(c,X,Y+3,16,3,'#e3cfa0');R(c,X+(o.x<4?12:0),Y-10,4,14,'#6b4a2b');R(c,X+(o.x<4?13:1),Y-10,1,14,'#8a6538')};
VOY.dessins.vDeparts=(c,o,X,Y,t)=>{
  R(c,X+1,Y+1,46,14,'#0e1326');R(c,X+2,Y+2,44,12,'#1c2440');R(c,X+2,Y+2,44,2,'#27325a');
  VOY.ordre.forEach((id,k)=>{const on=VOY.sites[id].ouvert;if(k>4)return;
    R(c,X+4,Y+5+k*1.8|0,5,1,on?'#f2a33a':'#59627c');R(c,X+11,Y+5+k*1.8|0,18,1,on?'#f7f0dc':'#59627c');R(c,X+33,Y+5+k*1.8|0,10,1,on?((t>>4)%2?'#3be07a':'#2a9a56'):'#59627c')});
};
VOY.dessins.vPorteQuai=(c,o,X,Y)=>{
  R(c,X-1,Y-2,18,18,'#3a4050');R(c,X,Y-1,7,17,'#8a8f9a');R(c,X+9,Y-1,7,17,'#8a8f9a');R(c,X+1,Y+1,5,7,'#8ec9e8');R(c,X+10,Y+1,5,7,'#8ec9e8');R(c,X+7,Y-1,2,17,'#2c2c34');
  R(c,X-4,Y-10,24,8,'#1c2440');R(c,X-3,Y-9,22,6,'#f2c12e');txt35(c,'VOIE A',X-1,Y-8,'#1c2440',1);
};
VOY.dessins.vAffiche=(c,o,X,Y)=>{
  const col={eolien:'#8ec9e8',nucleaire:'#f2c12e',barrage:'#9fd0c4',datacenter:'#c9b6e8',solaire:'#f7d98a'}[o.theme]||'#f7f0dc';
  R(c,X+2,Y+1,12,13,'#1c2440');R(c,X+3,Y+2,10,11,col);
  if(o.theme==='eolien'){R(c,X+7,Y+6,1,6,'#f7f0dc');R(c,X+5,Y+5,5,1,'#f7f0dc');R(c,X+7,Y+3,1,3,'#f7f0dc')}
  else if(o.theme==='nucleaire'){R(c,X+5,Y+6,6,6,'#e8eef5');R(c,X+6,Y+4,4,2,'#e8eef5');R(c,X+7,Y+3,2,1,'#e8eef5');R(c,X+10,Y+6,1,6,'#c9d3de');R(c,X+3,Y+10,10,2,'#4a78c9')}
  else if(o.theme==='solaire'){R(c,X+9,Y+3,3,3,'#f2a33a');R(c,X+4,Y+7,8,4,'#1f3d7c');R(c,X+4,Y+7,8,1,'#8fb6ee');R(c,X+8,Y+7,1,4,'#8fb6ee')}
  else if(o.theme==='barrage'){R(c,X+3,Y+5,10,3,'#4a78c9');R(c,X+6,Y+5,4,7,'#b9b4a6');R(c,X+7,Y+9,2,3,'#8ec9e8')}
  else if(o.theme==='datacenter'){for(let k=0;k<3;k++){R(c,X+4+k*3,Y+4,2,8,'#2c2c34');R(c,X+4+k*3,Y+5+k,2,1,'#3be07a')}}
  if(o.ferme)R(c,X+3,Y+11,10,2,'#c43d3d');
};
VOY.dessins.vBagages=(c,o,X,Y)=>{R(c,X+2,Y+14,13,1,'rgba(20,20,40,.25)');R(c,X+3,Y+6,10,8,'#8a3b3b');R(c,X+3,Y+6,10,1,'#b85a5a');R(c,X+6,Y+3,4,3,'#5a3a22');R(c,X+7,Y+4,2,2,'#c89b62');R(c,X+4,Y+9,8,1,'#5d2424');R(c,X+10,Y+10,3,3,'#f7f0dc')};

/* ================= GUICHET : LE PASSEPORT ================= */
function gareGuichet(){
  const v=voyEtat(),W='Mme Aiguillage';
  if(!v.pass){
    voyParler([{w:W,t:"Bonjour. Guichet ouvert. Oui, ouvert. Ne faites pas cette tête, ça arrive."},
      {w:W,t:"Vous êtes {name}, la personne qui a fait baisser les factures de toute la ville ? La mairie nous a prévenus : vous avez le droit de voir d'où vient l'électricité."},
      {w:W,t:"Voici votre passeport des énergies. Cinq destinations, cinq tampons. Un champ solaire, des éoliennes, une centrale nucléaire, un barrage, et un data center, parce qu'il faut bien que quelqu'un consomme tout ça."},
      {w:W,t:"Sur place : promenez-vous, lisez les panneaux, parlez aux gens. Quand vous en savez assez, le responsable du site vous met à l'épreuve et tamponne. Pas de tampon sans épreuve. C'est le règlement, et le règlement, c'est moi."}],
      ()=>{v.pass=1;save();sfx('secret');trk('voyage_passeport',{});toast('Passeport des énergies obtenu (menu → Passeport)');gainXP(10);hud()});
    return;
  }
  gareGuichet.k=(gareGuichet.k||0)+1;
  const n=Object.keys(v.tampons).length;
  voyParler([{w:W,t:[`${n} tampon${n>1?'s':''} sur ${VOY.ordre.length}. Le tableau des départs est sur votre droite. Les trains partent quand vous montez dedans : c'est notre conception de la ponctualité.`,
    VOY.ordre.some(id=>!VOY.sites[id].ouvert)?"Toutes les lignes ne sont pas encore en service. Les autres sont « en cours de pose ». Depuis un moment. Les rails, vous savez, c'est comme les travaux d'isolation : tout le monde est pour.":"Cinq lignes en service. Cinq ! J'ai dû commander de l'encre pour les tampons. Le budget « encre » de la gare a quintuplé : j'ai fait une note, personne ne l'a lue.",
    "Non, on ne peut pas tamponner soi-même. J'ai déjà vu des gens essayer avec une pomme de terre sculptée. Le tampon officiel a une dent de plus."][gareGuichet.k%3]}]);
}

/* ================= TABLEAU DES DÉPARTS ================= */
function gareDeparts(){
  const v=voyEtat();
  if(!v.pass){voyParler([{t:"Le tableau des départs. Cinq lignes. En dessous, une étiquette : « Passeport des énergies exigé. S'adresser au guichet. »"}]);return}
  const ov=voyPanneau('Tableau des départs'),b=ov.querySelector('.pbody');
  const h=new Date(),hh=k=>{const m=h.getHours()*60+h.getMinutes()+3+k*17;return String(Math.floor(m/60)%24).padStart(2,'0')+' h '+String(m%60).padStart(2,'0')};
  b.innerHTML=`<p>Gare d'Ampère-sur-Loire · départs. ${Object.keys(v.tampons).length} / ${VOY.ordre.length} tampons dans ton passeport.</p><div class="voy-departs">${VOY.ordre.map((id,k)=>{const s=VOY.sites[id],t=voyTampon(id);
    return `<div class="voy-ligne${s.ouvert?'':' ferme'}"><span class="h">${s.ouvert?hh(k):'— h —'}</span><span class="d"><b>${esc(s.gare)}</b><small>${esc(s.nom)} · ${esc(s.region)}${t?' · ✔ tamponné':''}</small></span>${s.ouvert?`<button class="btn" data-d="${id}">Monter à bord ▸</button>`:'<span class="st">Prochainement</span>'}</div>`}).join('')}</div>
    <p class="dnote">Le trajet dure quelques secondes. Sur place, le train t'attend à quai pour le retour.</p><div class="row"><button class="btn alt" id="vNon">Rester à Ampère-sur-Loire</button></div>`;
  b.querySelectorAll('[data-d]').forEach(x=>x.onclick=()=>{closePanel();voyTrajet(x.dataset.d)});
  b.querySelector('#vNon').onclick=closePanel;
  (b.querySelector('[data-d]')||b.querySelector('#vNon')).focus();
}
function gareTableauDehors(){
  const o=VOY.ordre.filter(id=>VOY.sites[id].ouvert).map(id=>VOY.sites[id].gare);
  const reste=VOY.ordre.length-o.length;
  voyParler([{t:reste?`Tableau des départs. ${o.length>1?o.length+' lignes se sont allumées':"Une ligne s'est allumée"} : ${o.join(', ')}. Les autres affichent toujours « — ».`:`Tableau des départs. Toutes les lignes sont allumées : ${o.join(', ')}. Le tableau n'avait jamais consommé autant.`},{t:"Quelqu'un a effacé « prochainement » à la craie et écrit « ENFIN » à la place. L'écriture ressemble à celle du chef de gare."}]);
}
function gareEntrer(){
  warp('gare',7,10,'up');
  const v=voyEtat();if(!v.hall){v.hall=1;save();qkTimeout(()=>{if(!busy&&!dlg.open)voyParler([{t:"La gare d'Ampère-sur-Loire est ouverte. Le hall sent la cire, la peinture fraîche et dix ans d'attente."},{t:"Au fond à gauche, le guichet. Au mur, le tableau des départs."}])},450)}
}
/* le chef de gare, dehors, change de refrain quand la gare est ouverte */
{const chef=TOWNSFOLK.find(f=>f.who==='Chef de gare');if(chef){const avant=chef.lines,apres=["Un train est parti ce matin. Un vrai. Avec des gens dedans. J'ai sifflé, j'ai agité le drapeau, j'ai un peu pleuré.","Cinq lignes. J'ai connu cette gare avec zéro. « Prochainement », je ne veux plus jamais lire ce mot, sauf sur un menu."];
  Object.defineProperty(chef,'lines',{get:()=>voyOuvert()?apres:avant})}}

/* ================= LA FENÊTRE DE VOYAGE =================
   Quelques secondes de paysage qui défile, des annonces, puis l'arrivée. Une touche ou un clic pour passer.
   Sert au train (voyTrajet) et à tout autre trajet d'un site (un bateau, une navette) :
   voyFenetre({de:'…', vers:'…', annonces:['…'], dessiner:(x, f, d)=>{…}, fin:()=>{…}})
     x : le dessin (240 × 112) ; f : l'avancement du trajet, de 0 à 1 ; d : un compteur qui avance avec le temps. */
function voyFenetre(o){
  if(VOY.trajet)return;
  const annonces=o.annonces||[];busy=true;clearKeys();sfx('door');
  const el=document.createElement('div');el.className='voy-trajet';
  el.innerHTML=`<div class="voy-trajet-in"><div class="voy-trajet-tete"><span>${esc(o.de)}</span><i></i><b>${esc(o.vers)}</b></div><canvas width="240" height="112" aria-hidden="true"></canvas><p class="voy-annonce" aria-live="polite"></p><button type="button" class="btn">Passer ▸</button></div>`;
  $('layer').appendChild(el);
  const x=el.querySelector('canvas').getContext('2d'),txt=el.querySelector('.voy-annonce'),DUREE=Math.max(1,annonces.length)*3200+1600,t0=performance.now();let k=-1;
  const fin=()=>{const T=VOY.trajet;if(!T)return;VOY.trajet=null;qkClear(T.id);el.remove();busy=false;o.fin()};
  const boucle=()=>{if(!VOY.trajet)return;const n=performance.now()-t0;o.dessiner(x,Math.min(1,n/DUREE),n/16);
    const kk=Math.min(annonces.length-1,Math.floor(n/3200));if(kk!==k&&annonces[kk]){k=kk;txt.textContent=annonces[kk]}
    if(n>=DUREE){fin();return}VOY.trajet.id=qkTimeout(boucle,33)};
  VOY.trajet={fin};boucle();
  el.querySelector('button').onclick=fin;el.querySelector('button').focus();
}
onKey('keydown',e=>{if(!VOY.trajet)return;if(e.key===' '||e.key==='Enter'||e.key==='Escape'){e.preventDefault();VOY.trajet.fin()}});

/* ================= LE TRAJET EN TRAIN =================
   dest : l'identifiant d'un site, ou 'retour' pour rentrer à Ampère-sur-Loire depuis le site « depuis ».
   Le paysage glisse des couleurs de la Loire vers celles du site (site.paysage : ciel, collines, premier plan). */
const VOY_LOIRE=[['#8fd0f0','#bfe6f5'],['#74b060','#5f9a52'],['#7cc56a','#58a551']];
function voyTrajet(dest,depuis){
  const retour=dest==='retour',site=VOY.sites[retour?depuis:dest],P0=VOY_LOIRE,P1=site.paysage||P0;
  trk('voyage_train',{vers:retour?'ampere':dest});
  voyFenetre({de:retour?site.gare:"Ampère-sur-Loire",vers:retour?"Ampère-sur-Loire":site.gare,annonces:retour?site.annoncesRetour:site.annonces,
    dessiner(x,f,d){
      const g=retour?1-f:f,mix=(i,j)=>hexMix(P0[i][j],P1[i][j],g);
      const gr=x.createLinearGradient(0,0,0,70);gr.addColorStop(0,mix(0,0));gr.addColorStop(1,mix(0,1));x.fillStyle=gr;x.fillRect(0,0,240,112);
      R(x,196,12,12,12,'#fff3c4');R(x,194,14,16,8,'#fff3c4');R(x,198,10,8,16,'#fff3c4');                                   // le soleil
      for(let i=0;i<3;i++){const cx=((i*97-d*.15)%300+300)%300-30;R(x,cx,18+i*9,26,5,'rgba(255,255,255,.8)');R(x,cx+6,15+i*9,14,4,'rgba(255,255,255,.8)')}   // nuages
      const relief=site.relief||1;
      for(let px=0;px<240;px+=2){const u=px+d*.35,h1=(22+Math.sin(u/41)*9+Math.sin(u/17)*4)*(1+(relief-1)*g);R(x,px,70-h1,2,h1+4,mix(1,0))}        // collines lointaines
      for(let px=0;px<240;px+=2){const u=px+d*.9,h2=12+Math.sin(u/29+2)*6+Math.sin(u/11)*2;R(x,px,74-h2,2,h2+2,mix(1,1))}
      R(x,0,74,240,38,mix(2,0));for(let i=0;i<14;i++){const gx=((i*37-d*2.2)%260+260)%260-10;R(x,gx,78+(i*7)%22,9,2,mix(2,1))}
      for(let i=0;i<3;i++){const px=((i*120-d*3)%360+360)%360-40;R(x,px+5,30,2,52,'#59627c');R(x,px,32,12,2,'#59627c');R(x,px+2,40,8,1,'#59627c');x.strokeStyle='rgba(60,70,100,.55)';x.lineWidth=1;x.beginPath();x.moveTo(px+6,33);x.quadraticCurveTo(px+66,46,px+126,33);x.stroke()}   // la ligne électrique suit la voie
      R(x,0,101,240,2,'#8a8f9a');R(x,0,104,240,1,'#6d7480');for(let i=0;i<12;i++){const tx=((i*22-d*4)%264+264)%264-12;R(x,tx,100,3,6,'#5a4630')}
      drawTrain(x,26,88+((d>>2)%2),d|0);
      for(let i=0;i<6;i++){const sx=((i*53-d*6)%300+300)%300-30;R(x,sx,106+(i%3)*2,10,1,'rgba(255,255,255,.35)')}
    },
    fin(){
      if(retour){warp('gare',13,4,'down');qkTimeout(()=>{if(!busy&&!dlg.open)voyParler([{t:"Ampère-sur-Loire, terminus. Le chef de gare est sur le quai. Il a sifflé à l'arrivée. On ne l'arrêtera plus."}])},450)}
      else{const a=site.arrivee;warp(site.carte,a[0],a[1],a[2]);toast(site.gare);if(site.arriver)qkTimeout(site.arriver,450)}
    }});
}

/* ---- sur un site : le train du retour attend à quai ---- */
function voyRetour(sid){
  const s=VOY.sites[sid],reste=s.infos.length-voyInfosVues(sid).length,ov=voyPanneau('Halte de '+s.gare),b=ov.querySelector('.pbody');
  b.innerHTML=`<p>Le train pour Ampère-sur-Loire est à quai, portes ouvertes. ${voyTampon(sid)?(reste?`Ton passeport est tamponné ; il reste ${reste} information${reste>1?'s':''} à dénicher sur le site.`:'Passeport tamponné, site visité de fond en comble.'):"Ton passeport n'est pas encore tamponné : tu pourras revenir quand tu veux, ce que tu as noté reste noté."}</p>
    <div class="row"><button class="btn" id="vOui">Rentrer à Ampère-sur-Loire ▸</button><button class="btn alt" id="vNon">Rester sur le site</button></div>`;
  b.querySelector('#vOui').onclick=()=>{closePanel();voyTrajet('retour',sid)};b.querySelector('#vNon').onclick=closePanel;b.querySelector('#vNon').focus();
}
