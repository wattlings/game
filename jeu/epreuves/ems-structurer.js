/* Wattlings · jeu/epreuves/ems-structurer.js
   Étape 4 · Structurer, l'atelier : ranger les objets du site dans l'arbre de l'EMS (site → point de comptage → compteur → mesures),
   puis mettre les séries à la même unité (m³ → kWh) et au même pas de temps (de la demi-heure ou des 10 minutes à la journée). */

/* les cases de l'arbre : [id, niveau, branche] ; « hors » reçoit ce qui n'a rien à faire dans l'arbre */
const STR_CASES=[['site',0,''],['pe',1,'e'],['pg',1,'g'],['ce',2,'e'],['cg',2,'g'],['me',3,'e'],['mg',3,'g']];
function strPieces(s){
  const pas=s.souscrit>36?10:30;
  return [
    {id:'site',t:`Site · ${s.name}`,ok:'site'},
    {id:'pe',t:`Point de comptage · PDL ${s.pdl}`,ok:'pe'},
    {id:'pg',t:`Point de comptage · PCE ${s.pce}`,ok:'pg'},
    {id:'ce',t:`Compteur · ${s.souscrit>36?'pro télérelevé':'Linky'} n° ${s.serie}`,ok:'ce'},
    {id:'cg',t:`Compteur · Gazpar ${s.gazSerie}`,ok:'cg'},
    {id:'me',t:`Mesures · puissances au pas de ${pas} min`,ok:'me'},
    {id:'mg',t:'Mesures · volumes journaliers en m³',ok:'mg'},
    {id:'fac',t:'Facture de janvier',ok:'hors',pq:"La facture se rattache au contrat, pas à l'arbre de comptage. Elle a son tiroir à elle : elle sert à chiffrer, pas à mesurer."},
    {id:'joule',t:'Le numéro de portable de Mme Joule',ok:'hors',pq:"Précieux, mais ce n'est pas une donnée d'énergie. Et Mme Joule tient à sa vie privée."}
  ];
}
/* pourquoi une pièce ne va pas dans une case */
function strPourquoi(p,c){
  if(c==='hors')return p.ok==='hors'?'':"Elle a sa place dans l'arbre, pourtant. Rien de ce qui mesure ton site ne va au rebut.";
  if(p.ok===c)return '';
  if(p.ok==='hors')return p.pq;
  const C=STR_CASES.find(x=>x[0]===c),P=STR_CASES.find(x=>x[0]===p.ok);
  if(P[1]===C[1])return "Bon étage, mauvaise branche. Électricité d'un côté, gaz de l'autre : les kWh ne se mélangeront pas tout seuls, mais tes graphiques si.";
  if(p.ok==='site')return "Le site, c'est le tronc. Tout pend dessous.";
  if(P[1]===1)return C[1]>1?"Le point de comptage se rattache directement au site : c'est le raccordement au réseau, il ne dépend d'aucun appareil.":"Le site d'abord. Le point en dessous.";
  if(P[1]===2)return C[1]<2?"Un compteur se change, un point reste. Range le compteur au-dessus du point, et le prochain remplacement effacera tout l'historique.":"Le compteur produit les mesures : il passe au-dessus d'elles.";
  return "Des mesures sans compteur, ce sont des chiffres orphelins. Elles vont tout en bas, sous l'appareil qui les produit.";
}
function arbreStep(el,next){
  const s=site(),P=strPieces(s),place={};let tenue=null,essais=0;
  el.innerHTML=`<div class="ems">${emsBarre('modèle de données')}
    <p>L'inventaire de l'armoire, en vrac. <b>Touche une pièce, puis la case de l'arbre où elle va.</b> Ce qui n'a rien à faire dans l'arbre va au rebut.</p>
    <div class="ems-pieces" role="group" aria-label="Pièces à ranger"></div>
    <div class="ems-arbre">
      <div class="ems-case" data-c="site"></div>
      <div class="ems-branches"><div class="ems-br"><span class="ems-brt">⚡ électricité</span><div class="ems-case" data-c="pe"></div><div class="ems-case" data-c="ce"></div><div class="ems-case" data-c="me"></div></div>
        <div class="ems-br"><span class="ems-brt">🔥 gaz</span><div class="ems-case" data-c="pg"></div><div class="ems-case" data-c="cg"></div><div class="ems-case" data-c="mg"></div></div></div>
      <div class="ems-case ems-hors" data-c="hors"><span>Rebut</span></div></div>
    <div class="ems-diag" aria-live="polite"></div></div>`;
  const pz=el.querySelector('.ems-pieces'),diag=el.querySelector('.ems-diag');
  const dessiner=()=>{
    pz.innerHTML='';shuffle(P.filter(p=>!place[p.id])).forEach(p=>{const b=document.createElement('button');b.type='button';b.className='ems-piece'+(tenue===p.id?' tenue':'');b.textContent=p.t;b.setAttribute('aria-pressed',String(tenue===p.id));
      b.onclick=()=>{tenue=tenue===p.id?null:p.id;dessiner()};pz.appendChild(b)});
    el.querySelectorAll('.ems-case').forEach(c=>{const k=c.dataset.c,dans=P.filter(p=>place[p.id]===k);
      c.innerHTML=(k==='hors'?'<span>Rebut</span>':'')+dans.map(p=>`<span class="ems-pose">${esc(p.t)}</span>`).join('')+(k!=='hors'&&!dans.length?'<span class="ems-vide">?</span>':'');
      c.classList.toggle('cible',!!tenue&&(k==='hors'||!dans.length));c.tabIndex=0;c.setAttribute('role','button');c.setAttribute('aria-label',k==='hors'?'Rebut':'Case de l’arbre'+(dans.length?' : '+dans[0].t:' vide'))});
  };
  el.querySelectorAll('.ems-case').forEach(c=>{const poser=()=>{if(!tenue)return;const p=P.find(x=>x.id===tenue),k=c.dataset.c;
      if(k!=='hors'&&P.some(x=>place[x.id]===k))return;
      const pq=strPourquoi(p,k);
      if(pq){essais++;emsRate('Ranger l’arbre',p.t+' → '+k);diag.innerHTML=`<div class="fb ko">✘ ${esc(pq)} ${essais>=3?revoirFiche():''}</div>`;tenue=null;dessiner();return}
      place[p.id]=k;tenue=null;sfx('select');diag.innerHTML=`<p class="dnote">✔ Rangé. Encore ${P.filter(x=>!place[x.id]).length}.</p>`;dessiner();
      if(P.every(x=>place[x.id])){pz.remove();el.querySelectorAll('.ems-case').forEach(x=>{x.classList.remove('cible');x.onclick=null;x.onkeydown=null});
        diag.innerHTML=`<div class="fb ok">✔ L'arbre tient debout : un site, deux points, un compteur par point, des mesures sous chaque compteur.</div>${emsTransfert('ce modèle est le squelette de l’outil. Tout graphique, tout ratio, toute alerte remonte l’arbre. Quand le distributeur change le compteur, on ajoute un compteur sous le même point, avec ses dates : l’historique ne bouge pas.')}`;
        gainXP(essais?5:20);contBtn(diag,next)}};
    c.onclick=poser;c.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();poser()}}});
  dessiner();
}

/* une journée du site (mardi) : puissances au pas du compteur, volume de gaz du jour */
function strJour(s){
  const pas=s.souscrit>36?10:30,c=weekCurve(s.id).slice(48,96),k=30/pas,P=[];
  c.forEach((v,i)=>{for(let j=0;j<k;j++)P.push(Math.round((v+(j-(k-1)/2)*.2)*10)/10)});
  const somme=Math.round(P.reduce((a,v)=>a+v,0)*10)/10,E=Math.round(somme*pas/60),m3=Math.round(s.gaz*1000/365*1.6/11.21*10)/10;
  return {pas,P,somme,E,m3,coef:11.21,gk:Math.round(m3*11.21)};
}
function conversionStep(el,next){
  const s=site(),J=strJour(s);let essais=0;
  el.innerHTML=`<div class="ems">${emsBarre('unités et pas de temps')}
    <p>Pour comparer, tout doit parler la même langue : <b>des kWh, par jour</b>. Pour l'instant, l'électricité arrive en ${J.P.length} puissances du mardi, et le gaz en m³.</p>
    <canvas class="chart" width="480" height="200" aria-label="Énergie du mardi, électricité et gaz"></canvas>
    <div class="ems-diag" aria-live="polite"></div></div>`;
  const cv=el.querySelector('canvas'),x=cv.getContext('2d'),diag=el.querySelector('.ems-diag');
  /* deux barres : l'électricité du jour selon la méthode choisie, le gaz selon l'unité ; l'index sert de contrôle */
  let eJour=null,gJour=null,gUnite='m³';
  const dessiner=()=>{const vals=[eJour||0,gJour||0,J.E],mx=Math.max(J.E*1.4,...vals,J.gk*1.15);const R=emsRepere(x,{w:480,h:200,L:70,max:mx,unite:''});
    const bar=(i,v,col,lab,sous)=>{const bw=R.W/3*.5,px=R.L+R.W*(i+.25)/3;if(v!==null){x.fillStyle=col;x.fillRect(px,R.Y(v),bw,R.T+R.H-R.Y(v))}x.fillStyle='#1c2440';x.textAlign='center';x.fillText(lab,px+bw/2,190);if(v!==null)x.fillText(sous,px+bw/2,R.Y(v)-5)};
    bar(0,eJour,eJour!==null&&Math.abs(eJour-J.E)<=1?'#2aa198':'#c43d3d','Électricité',eJour===null?'':emsKwh(eJour)+' kWh');
    bar(1,gJour,gUnite==='kWh'?'#e2a13a':'#9aa0a8','Gaz',gJour===null?'':(gUnite==='kWh'?emsKwh(gJour)+' kWh':gJour.toLocaleString('fr-FR')+' m³ (!)'));
    x.setLineDash([6,4]);x.strokeStyle='#2f6db5';x.lineWidth=2;x.beginPath();x.moveTo(R.L,R.Y(J.E));x.lineTo(R.L+R.W*2/3,R.Y(J.E));x.stroke();x.setLineDash([]);x.fillStyle='#2f6db5';x.textAlign='left';x.fillText(`index : ${emsKwh(J.E)} kWh`,R.L+R.W*2/3+4,R.Y(J.E)+4)};
  /* 1. le pas de temps */
  const methodes=[[`Additionner les ${J.P.length} puissances`,J.somme,`${emsKwh(J.somme)} kWh : ${Math.round(J.somme/J.E)} fois l'index. Soit le compteur ment, soit c'est le calcul. (C'est le calcul.) Une puissance, c'est des kW : il faut la multiplier par la durée du pas.`],
    [`Additionner, puis multiplier par la durée d'un pas (${J.pas} min = ${J.pas===10?'1/6':'1/2'} h)`,J.E,''],
    ['Faire la moyenne des puissances',Math.round(J.somme/J.P.length*10)/10,`${(Math.round(J.somme/J.P.length*10)/10).toLocaleString('fr-FR')} : c'est une puissance moyenne, en kW. Multiplie par les 24 heures de la journée, et on en reparle.`]];
  const pas=()=>{diag.innerHTML='<div class="ems-q"></div>';
    emsChoix(diag.querySelector('.ems-q'),methodes.map(m=>[m[0],m[1]===J.E,m[2]]),(o,e)=>{essais+=e;eJour=J.E;dessiner();
      diag.innerHTML=`<div class="fb ok">✔ ${emsKwh(J.E)} kWh pour le mardi, pile ce que dit l'index. E = Σ P × Δt.</div>`;contBtn(diag,unite,'Et le gaz ?')},
      {q:`Comment passer des ${J.P.length} puissances du mardi à l'énergie de la journée ?`,
       /* aperçu : la méthode survolée ou choisie s'affiche en barre, pour voir l'écart avec l'index */
       rendu:box=>box.querySelectorAll('.opt').forEach(b=>{const m=methodes.find(z=>z[0]===b.textContent);if(m)b.onmouseenter=b.onfocus=()=>{eJour=m[1];dessiner()}})})};
  /* 2. l'unité du gaz */
  const unite=()=>{gJour=J.m3;gUnite='m³';dessiner();
    diag.innerHTML=`<p>Le gaz du mardi : <span class="num">${J.m3.toLocaleString('fr-FR')} m³</span>, coefficient de conversion du mois : <span class="num">${J.coef.toLocaleString('fr-FR')} kWh/m³</span>.</p><div class="field"><label for="strGk">Combien de kWh ?</label><input id="strGk" inputmode="decimal" autocomplete="off"></div><button class="btn" type="button" id="strGv">Convertir ▸</button><div class="fbz"></div>`;
    const fb=diag.querySelector('.fbz');
    diag.querySelector('#strGv').onclick=()=>{const v=emsNombre(diag.querySelector('#strGk').value);
      if(v!==null&&Math.abs(v-J.gk)<=Math.max(2,J.gk*.01)){gJour=J.gk;gUnite='kWh';dessiner();diag.querySelector('#strGv').remove();diag.querySelector('input').disabled=true;
        emsSet('structure',{e:J.E,g:J.gk});
        fb.innerHTML=`<div class="fb ok">✔ ${emsKwh(J.gk)} kWh de gaz. Maintenant les deux barres parlent la même langue : ${emsKwh(J.E+J.gk)} kWh pour le mardi, tout compris.</div>${emsTransfert('l’outil convertit et agrège tout seul, mais il faut lui donner les bons coefficients et les bons pas de temps. Un coefficient manquant, et le gaz disparaît des bilans ; un pas mal déclaré, et l’électricité est multipliée par six.')}`;
        gainXP(essais?5:20);contBtn(fb,next);return}
      essais++;emsRate('Convertir le gaz',v);
      fb.innerHTML=`<div class="fb ko">✘ ${v===null?'Tape un nombre.':Math.abs(v-J.m3)<1?'Des m³ ne sont pas des kWh. Additionner les deux, c’est additionner des litres et des euros.':v<J.m3?'Tu as divisé. Le gaz ne rétrécit pas à la conversion : on multiplie.':'Pas tout à fait : m³ × coefficient.'} ${essais>=3?revoirFiche():''}</div>`};
  };
  dessiner();pas();
}
