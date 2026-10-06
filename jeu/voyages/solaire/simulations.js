/* Wattlings · jeu/voyages/solaire/simulations.js
   Centrale solaire de Saint-Photon : ce qui se manipule.
   1. « Incline et oriente » (Mlle Azimut) : un modèle de production à régler, quatre missions.
   2. « Qu'est-ce qui cloche ? » (Mlle Cloche) : cinq courbes de la semaine à diagnostiquer.
   3. Le défi de Mme Zénith : six questions, puis l'épreuve « Midi pile », et le tampon.
   Les textes des missions et des diagnostics sont ici, à côté de leurs règles ; les répliques des personnages sont dans textes.js. */

/* ================= LE MODÈLE : CE QUE REÇOIT UN PANNEAU =================
   Un calcul simplifié mais honnête : position du soleil heure par heure, lumière directe et diffuse, part de ciel couvert par mois.
   Calé pour donner 1 450 kWh par kWc et par an au meilleur réglage fixe (35°, plein sud), à la latitude de Saint-Photon. */
const SOL_MODELE={
  latitude:43.8,
  jourType:[17,47,75,105,135,162,198,228,258,288,318,344],       // un jour représentatif par mois (numéro du jour dans l'année)
  joursParMois:[31,28,31,30,31,30,31,31,30,31,30,31],
  beauTemps:[.50,.55,.60,.62,.66,.76,.84,.80,.70,.58,.50,.46],   // part de ciel clair, de janvier à décembre
  rendement:.878,                                                // du soleil reçu à l'électricité livrée (chaleur, onduleur, câbles)
  butee:55,                                                      // un tracker ne pivote pas au-delà de 55°
  mois:['J','F','M','A','M','J','J','A','S','O','N','D']
};
/* éclairement d'un plan, en kW par m², à l'heure solaire donnée. incl : 0 à plat, 90 debout ; azim : -90 est, 0 sud, 90 ouest */
function solEclairement(jour,heure,incl,azim,suivi,clair){
  const r=Math.PI/180,L=SOL_MODELE.latitude*r,d=23.45*r*Math.sin(2*Math.PI*(284+jour)/365),w=(heure-12)*15*r;
  const hauteur=Math.sin(L)*Math.sin(d)+Math.cos(L)*Math.cos(d)*Math.cos(w);if(hauteur<=.02)return 0;
  const direct=1.353*Math.pow(.7,Math.pow(1/hauteur,.678)),diffus=.1*direct*hauteur+.03,global=direct*hauteur+diffus;
  let b=incl*r,g=azim*r;
  if(suivi){const cote=Math.cos(d)*Math.sin(w);b=Math.min(Math.atan2(Math.abs(cote),hauteur),SOL_MODELE.butee*r);g=(cote>0?90:-90)*r}
  const face=Math.sin(d)*Math.sin(L)*Math.cos(b)-Math.sin(d)*Math.cos(L)*Math.sin(b)*Math.cos(g)+Math.cos(d)*Math.cos(L)*Math.cos(b)*Math.cos(w)+Math.cos(d)*Math.sin(L)*Math.sin(b)*Math.cos(g)*Math.cos(w)+Math.cos(d)*Math.sin(b)*Math.sin(g)*Math.sin(w);
  const ciel=(1+Math.cos(b))/2,sol=.2*(1-Math.cos(b))/2;
  return clair*(direct*Math.max(0,face)+diffus*ciel+global*sol)+(1-clair)*.28*global*(ciel+sol);
}
/* une année pour un réglage : production par mois et sur l'année (kWh par kWc), journée claire de juin (kW par kWc), heure du pic */
function solAnnee(incl,azim,suivi){
  const M=SOL_MODELE,mois=M.jourType.map((j,m)=>{let e=0;for(let h=4;h<=20;h+=.25)e+=solEclairement(j,h,incl,azim,suivi,M.beauTemps[m])*.25;return e*M.joursParMois[m]*M.rendement});
  const juin=[];let pic=12,pMax=0;for(let h=4;h<=20;h+=.25){const v=solEclairement(162,h,incl,azim,suivi,1)*M.rendement;juin.push([h,v]);if(v>pMax+1e-9){pMax=v;pic=h}}
  return{mois,total:mois.reduce((a,b)=>a+b,0),juin,pic};
}

/* ================= 1. INCLINE ET ORIENTE ================= */
const SOL_MISSIONS=[
  {t:"Mission 1 · Le maximum sur l'année",vue:'mois',
    x:"Un hangar tout neuf, un toit qu'on peut tourner comme on veut. Le client veut « le maximum ». Trouve l'inclinaison et l'orientation qui produisent le plus sur l'année.",
    ok:(r,ref)=>r.total>=ref.total*.99,
    bravo:"Plein sud, entre 30 et 40° : la règle en France. Et regarde comme le sommet est plat : à 20° ou à 45°, on ne perd que 2 à 3 %. Inutile de se fâcher avec le charpentier pour cinq degrés.",
    indice:(r,s)=>Math.abs(s.azim)>15?"Regarde la boussole : à midi, le soleil est au sud. Tes panneaux regardent ailleurs.":s.incl<30?"Trop à plat : tu attrapes bien le soleil d'été, tu rates celui d'hiver. Redresse un peu.":"Trop debout : tu soignes l'hiver et tu sacrifies l'été, qui pèse bien plus lourd. Couche un peu."},
  {t:"Mission 2 · Le maximum en décembre",vue:'mois',
    x:"Un refuge de montagne chauffé à l'électricité, fermé tout l'été. Son seul problème s'appelle décembre. Règle les panneaux pour produire le plus possible ce mois-là.",
    ok:(r,ref)=>r.mois[11]>=ref.decembre*.985,
    bravo:"Entre 60 et 70° : en décembre, à midi, le soleil ne monte qu'à 23° au-dessus de l'horizon, alors on se redresse pour le regarder en face. Prix à payer : 8 à 15 % de moins sur l'année. Le « meilleur » réglage dépend de la question qu'on pose.",
    indice:(r,s)=>Math.abs(s.azim)>15?"En hiver, le soleil se lève tard, se couche tôt et reste au sud. Reviens-y.":s.incl<60?"Le soleil de décembre est très bas. Tes panneaux le regardent de travers : redresse encore.":"Là, c'est presque un mur. Un peu moins debout."},
  {t:"Mission 3 · Du courant le matin",vue:'jour',
    x:"Une école : la cantine chauffe dès 10 h, plus personne après 16 h 30. Fais tomber le pic d'une belle journée de juin à 10 h 30 au soleil, ou avant, sans perdre plus de 12 % sur l'année.",
    ok:(r,ref)=>r.pic<=10.5&&r.total>=ref.total*.88,
    bravo:"Tournés vers l'est-sud-est, les panneaux produisent quand l'école consomme. On y laisse une dizaine de pour cent, mais chaque kWh tombe au bon moment : il est consommé sur place au lieu d'être bradé à midi, quand tout le monde en a trop.",
    indice:(r,s,ref)=>r.pic>10.5?"Le pic arrive encore trop tard. Le soleil du matin est à l'est : tourne les panneaux vers lui.":"Tu as le matin, mais tu as trop perdu sur l'année. Plein est ou très redressé, c'est trop : cherche entre le sud et l'est, pas trop debout."},
  {t:"Essai libre · Et si les panneaux bougeaient ?",vue:'jour',libre:1,
    x:"Dernier réglage : coche « tracker ». Les panneaux pivotent d'est en ouest et suivent le soleil toute la journée. Compare la journée de juin, puis l'année."}
];
function solSimOrientation(fin){
  const etat={incl:10,azim:45,suivi:false},ref=solAnnee(35,0,false);ref.decembre=Math.max(...[55,60,65,70].map(i=>solAnnee(i,0,false).mois[11]));
  trk('voyage_sim',{site:'solaire',sim:'orientation'});
  voyEtapes('Incline et oriente',SOL_MISSIONS.map(m=>(el,suite)=>{
    let vue=m.vue,essais=0,gagne=false,vuTracker=false;
    el.innerHTML=`<h3>${esc(m.t)}</h3><div class="ctx">${esc(m.x)}</div>
      <div class="voy-atelier"><canvas class="voy-croquis" width="240" height="150" aria-hidden="true"></canvas><div class="voy-reglages"></div></div>
      <div class="voy-chiffres" aria-live="polite"></div>
      <div class="seg" role="group"><button type="button" data-v="mois">L'année, mois par mois</button><button type="button" data-v="jour">Une belle journée de juin</button></div>
      <canvas class="chart" width="640" height="230" role="img" aria-label="Production selon le réglage"></canvas><div class="fbz"></div><div class="row"></div>`;
    const R0=el.querySelector('.voy-reglages'),ch=el.querySelector('.voy-chiffres'),cvs=el.querySelector('.chart'),fbz=el.querySelector('.fbz'),row=el.querySelector('.row');
    const dessiner=()=>{
      const r=solAnnee(etat.incl,etat.azim,etat.suivi),pc=Math.round(r.total/ref.total*100);
      solCroquis(el.querySelector('.voy-croquis'),etat);
      ch.innerHTML=`<div><b class="num">${fmt(Math.round(r.total/10)*10)}</b><span>kWh par kWc et par an</span></div><div><b class="num">${pc} %</b><span>du meilleur réglage fixe</span></div><div><b class="num">${Math.round(r.mois[11])} · ${Math.round(r.mois[5])}</b><span>décembre · juin</span></div><div><b class="num">${voyHeure(r.pic)}</b><span>pic de juin, heure au soleil</span></div>`;
      el.querySelectorAll('.seg button').forEach(b=>{b.classList.toggle('on',b.dataset.v===vue);b.setAttribute('aria-pressed',b.dataset.v===vue)});
      if(vue==='mois')voyGraphe(cvs,{x:[-.6,11.6],y:260,unite:'kWh/kWc',gradY:[0,50,100,150,200,250],gradX:SOL_MODELE.mois.map((l,i)=>[i,l]),
        series:[{p:ref.mois.map((v,i)=>[i,v]),c:VOY_ENCRE.repere,genre:'barres',nom:'35°, plein sud',l:36},{p:r.mois.map((v,i)=>[i,v]),c:VOY_ENCRE.soleil,genre:'barres',nom:'Ton réglage',l:22}]});
      else voyGraphe(cvs,{x:[4,20],y:1,unite:'kW par kWc',gradY:[0,.25,.5,.75,1],gradX:[5,7,9,11,13,15,17,19].map(h=>[h,h+' h']),
        series:[{p:ref.juin,c:VOY_ENCRE.prevu,genre:'tirets',nom:'35°, plein sud'},{p:r.juin,c:VOY_ENCRE.soleil,genre:'aire',nom:'Ton réglage'}],reperes:m.libre?[]:[{x:r.pic,c:VOY_ENCRE.alerte,nom:'pic'}]});
      return r;
    };
    const cI=voyCurseur(R0,{nom:'Inclinaison',min:0,max:90,pas:5,val:etat.incl,dire:v=>v===0?'0° · à plat':v===90?'90° · debout':v+'°',quand:v=>{etat.incl=v;dessiner()}});
    const cA=voyCurseur(R0,{nom:'Orientation',min:-90,max:90,pas:15,val:etat.azim,dire:v=>({'-90':'plein est','-45':'sud-est','0':'plein sud','45':'sud-ouest','90':'plein ouest'}[v]||(Math.abs(v)<45?'sud, '+Math.abs(v)+'° vers l\''+(v<0?'est':'ouest'):(v<0?'est':'ouest')+', '+(90-Math.abs(v))+'° vers le sud')),quand:v=>{etat.azim=v;dessiner()}});
    el.querySelectorAll('.seg button').forEach(b=>b.onclick=()=>{vue=b.dataset.v;dessiner()});
    if(m.libre){
      const l=document.createElement('label');l.className='chk';l.innerHTML=`<input type="checkbox"${etat.suivi?' checked':''}><span>Tracker : les panneaux suivent le soleil d'est en ouest<small>Le réglage fixe ne compte plus : c'est le moteur qui décide.</small></span>`;R0.appendChild(l);
      const fini=document.createElement('button');fini.className='btn';fini.textContent='Rendre le pupitre ▸';fini.disabled=true;row.appendChild(fini);
      l.querySelector('input').onchange=e=>{etat.suivi=e.target.checked;cI.disabled=cA.disabled=etat.suivi;const r=dessiner();
        if(etat.suivi){vuTracker=true;fini.disabled=false;fbz.innerHTML=`<div class="fb ok">Avec un tracker : ${fmt(Math.round(r.total/10)*10)} kWh par kWc, soit ${Math.round((r.total/ref.total-1)*100)} % de plus que le meilleur réglage fixe. Et la cloche de juin est devenue un plateau : on produit fort dès 8 h et jusqu'à 18 h.</div>`;voyMontrer(fbz)}};
      fini.onclick=()=>{if(vuTracker)suite()};
    }else{
      const v=document.createElement('button');v.className='btn';v.textContent='Valider le réglage ▸';row.appendChild(v);
      v.onclick=()=>{if(gagne)return;const r=dessiner();
        if(m.ok(r,ref)){gagne=true;v.remove();cI.disabled=cA.disabled=true;fbz.innerHTML=`<div class="fb ok">✔ ${esc(m.bravo)}</div>`;gainXP(essais?5:15);contBtn(fbz,suite)}
        else{essais++;sfx('bad');trk('wrong_answer',{t:'Incline et oriente',q:m.t,a:etat.incl+'° / '+etat.azim});fbz.innerHTML=`<div class="fb ko">✘ ${esc(m.indice(r,etat,ref))}</div>`}
        voyMontrer(fbz)};
    }
    dessiner();
  }),()=>{voyEtat().faits['solaire.orientation']=1;save();if(fin)fin()},{plusTard:true});
}
/* le croquis : le panneau vu de profil (inclinaison) et vu du ciel (orientation) */
function solCroquis(cv,s){
  const c=cv.getContext('2d'),E=VOY_ENCRE;c.clearRect(0,0,240,150);c.fillStyle='#eaf4fb';c.fillRect(0,0,240,150);c.fillStyle='#d9c98a';c.fillRect(0,118,120,32);
  c.font='13px "Atkinson Hyperlegible",system-ui,sans-serif';c.textAlign='center';c.textBaseline='middle';
  // de profil : le sol, le poteau, le panneau
  const a=(s.suivi?25:s.incl)*Math.PI/180,cx=58,cy=96,l=44;c.fillStyle='#fff3c4';c.beginPath();c.arc(96,26,11,0,7);c.fill();
  c.strokeStyle='#8a8f9a';c.lineWidth=4;c.beginPath();c.moveTo(cx,cy);c.lineTo(cx,118);c.stroke();
  c.strokeStyle='#1f3d7c';c.lineWidth=7;c.lineCap='round';c.beginPath();c.moveTo(cx-Math.cos(a)*l,cy+Math.sin(a)*l*.9);c.lineTo(cx+Math.cos(a)*l,cy-Math.sin(a)*l*.9);c.stroke();
  c.strokeStyle='#5f8fd8';c.lineWidth=2;c.beginPath();c.moveTo(cx-Math.cos(a)*l,cy+Math.sin(a)*l*.9-3);c.lineTo(cx+Math.cos(a)*l,cy-Math.sin(a)*l*.9-3);c.stroke();c.lineCap='butt';
  c.fillStyle=E.texte;c.fillText(s.suivi?'pivote':s.incl+'°',cx,136);
  // vu du ciel : la boussole, et la face du panneau qui regarde dans une direction
  const bx=180,by=74,r=44;c.fillStyle='#fffaf0';c.beginPath();c.arc(bx,by,r,0,7);c.fill();c.strokeStyle=E.texte;c.lineWidth=2;c.stroke();
  c.fillStyle=E.discret;[['N',0,-1],['E',1,0],['S',0,1],['O',-1,0]].forEach(([t,dx,dy])=>c.fillText(t,bx+dx*(r-10),by+dy*(r-10)));
  if(s.suivi){c.strokeStyle=E.soleil;c.lineWidth=3;c.beginPath();c.arc(bx,by,22,Math.PI*.1,Math.PI*.9);c.stroke();c.fillStyle='#1f3d7c';c.fillRect(bx-4,by-18,8,36)}
  else{const g=(90+s.azim)*Math.PI/180,ux=Math.cos(g),uy=Math.sin(g);c.save();c.translate(bx,by);c.rotate(g-Math.PI/2);c.fillStyle='#1f3d7c';c.fillRect(-18,-5,36,10);c.restore();
    c.strokeStyle=E.soleil;c.lineWidth=3;c.beginPath();c.moveTo(bx+ux*8,by+uy*8);c.lineTo(bx+ux*26,by+uy*26);c.stroke();c.fillStyle=E.soleil;c.beginPath();c.arc(bx+ux*27,by+uy*27,4,0,7);c.fill()}
}

/* ================= 2. QU'EST-CE QUI CLOCHE ? =================
   Cinq journées de la semaine. Pour chacune : la production attendue (ciel clair, ce jour-là) et la production mesurée.
   mesure(t, attendu) transforme la courbe attendue ; diag désigne le bon diagnostic. */
const SOL_DIAGS={
  nuages:["Des passages nuageux","Non : des nuages creusent des dents irrégulières, et la courbe remonte entre deux passages."],
  ecretage:["Un écrêtage : la centrale est plafonnée","Non : un écrêtage rabote le sommet bien à plat, et laisse le reste intact."],
  panne:["Un onduleur à l'arrêt","Non : une panne fait une marche nette, puis la courbe suit l'attendu, une fraction en dessous."],
  ombre:["Une ombre le matin","Non : une ombre mange toujours les mêmes heures, et rend la main ensuite."],
  sale:["Des modules encrassés","Non : la saleté retire quelques pour cent à toute heure, sans rien changer à la forme."]
};
const SOL_JOURNEES=[
  {jour:'Mardi',diag:'nuages',mesure:(t,a)=>{let k=1;[[11.2,.55,.22],[12.4,.7,.18],[14.1,.42,.3],[15.3,.62,.14],[16.6,.3,.25]].forEach(([h,p,l])=>{k*=1-p*Math.exp(-Math.pow((t-h)/l,2))});return a*k*(1+.035*Math.sin(t*9))},
    bravo:"Des dents irrégulières, et la courbe qui retrouve l'attendu entre deux : chaque nuage signe son passage. Rien à réparer. Dr Nuage l'avait annoncé la veille, il te le rappellera."},
  {jour:'Mercredi',diag:'panne',mesure:(t,a)=>t>=11.17?a*5/6:a,
    bravo:"À 11 h 10, un sixième de la production disparaît d'un coup et ne revient pas : un onduleur sur six s'est arrêté. On appelle M. Sinus tout de suite : chaque heure de soleil perdue ne se rattrape pas."},
  {jour:'Jeudi',diag:'ombre',mesure:(t,a)=>a*(t<8.2?.3:t<9.8?.3+.7*(t-8.2)/1.6:1),
    bravo:"Le matin est mangé jusqu'à 9 h 45, puis tout rentre dans l'ordre : c'est une ombre portée, ici la colline à l'est. Elle revient chaque jour à la même heure, et on la retrouve dans la prévision une fois qu'on la connaît."},
  {jour:'Samedi',diag:'sale',mesure:(t,a)=>a*.91,
    bravo:"Même forme, 9 % plus bas, du matin au soir : les modules sont sales. Lundi, il a plu du sable du Sahara. Soit on attend une vraie pluie, soit on nettoie : on compare le prix du lavage à celui des kWh perdus."},
  {jour:'Dimanche',diag:'ecretage',mesure:(t,a)=>Math.min(a,8),
    bravo:"Un sommet raboté bien à plat, à 8 MW : la centrale a reçu la consigne de plafonner. Dimanche, grand soleil, peu de consommation : les prix étaient négatifs. Les modules pouvaient faire mieux, on leur a demandé de ne pas le faire."}
];
/* la production attendue par ciel clair un jour de mai, en MW, à l'heure de la montre */
const solAttendu=t=>t<=6.3||t>=20.9?0:10.2*Math.pow(Math.sin(Math.PI*(t-6.3)/14.6),1.25);
function solSimCourbes(fin){
  trk('voyage_sim',{site:'solaire',sim:'courbes'});
  const intro=info(`<h3>Qu'est-ce qui cloche ?</h3><p>Cinq journées de mai, toutes ensoleillées sur le papier. Pour chacune, l'écran montre deux courbes au pas de 10 minutes :</p><p><b>l'attendu</b> (en pointillés) : ce que la centrale devait produire par ciel clair ce jour-là ;<br><b>le mesuré</b> (en plein) : ce que le compteur du poste de livraison a vraiment vu passer.</p><p>Entre les deux, il y a toujours une histoire. Trouve laquelle.</p>`,'Voir mardi');
  const cas=SOL_JOURNEES.map((J,n)=>(el,suite)=>{
    const A=[],M=[];let eA=0,eM=0;for(let t=5;t<=22;t+=1/6){const a=solAttendu(t),m=Math.max(0,J.mesure(t,a));A.push([t,a]);M.push([t,m]);eA+=a/6;eM+=m/6}
    choice({title:`${J.jour} · journée ${n+1} sur ${SOL_JOURNEES.length}`,
      ctx:`<canvas class="chart" width="640" height="270" role="img" aria-label="Production attendue et mesurée, ${J.jour}"></canvas><p class="voy-bilan">Attendu : <b class="num">${Math.round(eA)} MWh</b> · Mesuré : <b class="num">${Math.round(eM)} MWh</b> · Écart : <b class="num">${Math.round((eM/eA-1)*100)} %</b></p>`,
      q:"Que s'est-il passé ?",opts:Object.entries(SOL_DIAGS).map(([k,[nom,non]])=>[nom,k===J.diag,k===J.diag?J.bravo:non])})(el,suite);
    voyGraphe(el.querySelector('canvas'),{x:[5,22],y:11,unite:'MW',gradY:[0,2,4,6,8,10],gradX:[6,8,10,12,14,16,18,20,22].map(h=>[h,h+' h']),
      series:[{p:M,c:VOY_ENCRE.soleil,genre:'aire',nom:'Mesuré'},{p:A,c:VOY_ENCRE.prevu,genre:'tirets',nom:'Attendu par ciel clair',e:2}]});
  });
  const bilan=info(`<h3>La méthode de Mlle Cloche</h3><p>Tu viens de faire, cinq fois, ce qu'un energy manager fait devant n'importe quelle courbe :</p><p><b>1.</b> comparer le mesuré à un attendu, jamais à rien ;<br><b>2.</b> regarder la <b>forme</b> de l'écart : des dents, une marche, un plateau, un décalage, un matin qui manque ;<br><b>3.</b> seulement ensuite, chercher la cause.</p><p>Une courbe de production se lit comme la courbe de charge d'un bâtiment. Elle est juste à l'envers, et de meilleure humeur.</p>`,'Rendre l\'écran');
  voyEtapes('Supervision · Saint-Photon',[intro,...cas,bilan],()=>{voyEtat().faits['solaire.courbes']=1;save();if(fin)fin()},{plusTard:true});
}

/* ================= 3. LE DÉFI DE MME ZÉNITH ================= */
/* l'épreuve « Midi pile » : l'école, 36 kWc sur le toit, et trois usages à déplacer dans la journée */
const SOL_MIDI={
  objectif:70,
  /* production du toit (kW) à l'heure de la montre, un beau jeudi de mai */
  toit:t=>t<=6.75||t>=20.5?0:28*Math.pow(Math.sin(Math.PI*(t-6.75)/13.75),1.3),
  /* ce que l'école consomme quoi qu'il arrive (kW) : veille, journée de classe, cuisine de la cantine */
  socle:t=>2+(t>=7.5&&t<17.5?6:0)+(t>=10&&t<13?8:0),
  /* les usages déplaçables : puissance (kW), durée (h), heure de départ actuelle, plage autorisée, et pourquoi */
  usages:[
    {nom:'Chauffe-eau de la cantine',kw:6,h:3,depart:2,min:0,max:21,c:'#e2573b',note:"Programmé la nuit depuis l'époque des heures creuses. L'eau reste chaude toute la journée : il peut tourner quand on veut."},
    {nom:'Lave-vaisselle de la cantine',kw:9,h:2,depart:18,min:13.5,max:20,c:'#4a78c9',note:"Départ différé réglé à 18 h en 2011, personne ne sait pourquoi. Il ne peut pas partir avant la fin du service, à 13 h 30."},
    {nom:'Recharge de la voiture de service',kw:7,h:4,depart:18,min:12,max:20,c:'#8a3b8f',note:"Branchée le soir par habitude. Elle rentre de tournée à midi : pas de recharge avant."}]
};
function solMidiBilan(departs){
  const M=SOL_MIDI,pv=[],co=[],au=[];let prod=0,conso=0,auto=0;
  for(let i=0;i<48;i++){const t=i/2+.25,p=M.toit(t);let c=M.socle(t);M.usages.forEach((u,k)=>{if(t>=departs[k]&&t<departs[k]+u.h)c+=u.kw});
    prod+=p/2;conso+=c/2;auto+=Math.min(p,c)/2;pv.push([t,p]);co.push([i/2,c]);au.push([i/2,Math.min(p,c)])}
  co.push([24,co[47][1]]);au.push([24,0]);
  return{pv,co,au,prod,conso,auto,autoconso:auto/prod*100,autoprod:auto/conso*100,achat:conso-auto,injecte:prod-auto};
}
const solMidi=(el,suite)=>{
  const M=SOL_MIDI,departs=M.usages.map(u=>u.depart);let essais=0,gagne=false;const b0=solMidiBilan(departs);
  el.innerHTML=`<h3>Dernière épreuve · Midi pile</h3><div class="ctx"><b>Mme Zénith :</b> « L'école Jean-Jaurès. 36 kWc sur le toit, un jeudi de mai, grand soleil. Trois appareils tournent à des heures choisies il y a longtemps par quelqu'un qui est parti depuis. Déplace-les. Je veux au moins <b>${M.objectif} %</b> d'autoconsommation. Et retiens que midi pile, au soleil, c'est 13 h 40 à ta montre. »</div>
    <canvas class="chart" width="640" height="270" role="img" aria-label="Production du toit et consommation de l'école sur 24 heures"></canvas>
    <div class="voy-chiffres" aria-live="polite"></div><div class="voy-usages"></div><div class="fbz"></div><div class="row"><button class="btn" id="vVal">Valider le planning ▸</button></div>`;
  const cvs=el.querySelector('canvas'),ch=el.querySelector('.voy-chiffres'),U=el.querySelector('.voy-usages'),fbz=el.querySelector('.fbz'),val=el.querySelector('#vVal');
  const dessiner=()=>{const b=solMidiBilan(departs);
    voyGraphe(cvs,{x:[0,24],y:32,unite:'kW',gradY:[0,10,20,30],gradX:[0,4,8,12,16,20,24].map(h=>[h,h+' h']),
      series:[{p:b.pv,c:VOY_ENCRE.soleil,genre:'aire',fond:VOY_ENCRE.soleilClair,nom:'Produit',e:2},{p:b.au,c:VOY_ENCRE.soleil,genre:'aire',marches:1,fond:VOY_ENCRE.soleil,nom:'Consommé sur place',e:1},{p:b.co,c:VOY_ENCRE.conso,genre:'escalier',nom:'Consommation'}]});
    ch.innerHTML=`<div class="${b.autoconso>=M.objectif?'bon':''}"><b class="num">${Math.round(b.autoconso)} %</b><span>autoconsommation (objectif ${M.objectif} %)</span></div><div><b class="num">${Math.round(b.autoprod)} %</b><span>autoproduction</span></div><div><b class="num">${Math.round(b.achat)} kWh</b><span>achetés au réseau</span></div><div><b class="num">${Math.round(b.injecte)} kWh</b><span>injectés sur le réseau</span></div>`;return b};
  const curseurs=M.usages.map((u,k)=>{const d=document.createElement('div');d.className='voy-usage';d.style.setProperty('--u',u.c);U.appendChild(d);
    const i=voyCurseur(d,{nom:`${u.nom} · ${u.kw} kW pendant ${u.h} h`,min:u.min,max:u.max,pas:.5,val:departs[k],dire:v=>`de ${voyHeure(v)} à ${voyHeure(v+u.h)}`,quand:v=>{departs[k]=v;dessiner()}});
    d.insertAdjacentHTML('beforeend',`<small>${esc(u.note)}</small>`);return i});
  val.onclick=()=>{if(gagne)return;const b=dessiner();
    if(b.autoconso>=M.objectif){gagne=true;val.remove();curseurs.forEach(i=>i.disabled=true);gainXP(essais?10:25);
      fbz.innerHTML=`<div class="fb ok">✔ De ${Math.round(b0.autoconso)} à ${Math.round(b.autoconso)} % d'autoconsommation, sans acheter un seul appareil : tu as juste changé trois horaires. L'école achète ${Math.round(b0.achat-b.achat)} kWh de moins ce jour-là. ${b.autoconso>=75?"C'est presque le maximum possible. ":''}Il reste ${Math.round(b.injecte)} kWh injectés : à midi, le toit produit plus que l'école ne peut avaler. C'est là, et seulement là, qu'on commence à parler de batterie.</div>`;contBtn(fbz,suite)}
    else{essais++;sfx('bad');trk('wrong_answer',{t:'Midi pile',q:'planning',a:departs.join(' / ')});
      fbz.innerHTML=`<div class="fb ko">✘ ${Math.round(b.autoconso)} % : pas encore. Regarde le jaune clair : c'est du courant produit que personne ne consomme. Glisse les appareils sous la cloche, entre 12 h et 18 h, sans tous les empiler au même moment.</div>`}
    voyMontrer(fbz)};
  dessiner();
};
function solDefi(){
  const W='Mme Zénith',sid='solaire';
  if(voyTampon(sid)){solDefi.k=(solDefi.k||0)+1;say([{w:W,t:SOL.dit.zenithApres[solDefi.k%SOL.dit.zenithApres.length]}]);return}
  const manque=voyClesManquantes(sid);
  if(manque.length){say([{w:W,t:SOL.dit.zenithAttente[0]},{w:W,t:`Il te manque ${manque.length} info${manque.length>1?'s':''} clé${manque.length>1?'s':''}. Commence par ${manque[0].ou}.`}]);return}
  say([{w:W,t:"Tu as fait le tour ? On va voir ça. Six questions, puis une épreuve. Si tu confonds encore kWc et kWh à la fin, je garde le tampon."}],()=>{
    trk('voyage_defi',{site:sid});
    voyEtapes('Le défi de Mme Zénith',[
      ...SOL.questions.map((q,i)=>choice({title:`Question ${i+1} sur ${SOL.questions.length}`,q:q.q,opts:q.o})),
      solMidi,
      info(`<h3>Verdict</h3><p><b>Mme Zénith :</b> « Bien. Tu sais ce qu'un panneau promet, ce qu'il tient, pourquoi sa courbe a cette forme, et quoi faire d'un bâtiment qui consomme à contretemps. »</p><p>« La plupart des gens repartent d'ici avec une photo des brebis. Toi, tu repars avec un tampon. »</p>`,'Tendre le passeport')
    ],()=>voyTamponner(sid,()=>say([{w:W,t:"Voilà. Ne le perds pas : je ne tamponne qu'une fois, et j'ai une excellente mémoire des visages."}])),{plusTard:true});
  });
}
