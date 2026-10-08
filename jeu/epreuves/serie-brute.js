/* Wattlings · jeu/epreuves/serie-brute.js
   Étape 3 · Fiabiliser, l'atelier : une semaine de données brutes du site, telle que l'EMS du labo la reçoit.
   Le joueur traque lui-même les anomalies sur la courbe (clic, toucher, ou flèches puis Entrée), choisit leur traitement,
   et voit ce que l'EMS aurait affiché sans lui. Les anomalies qu'on ne voit pas sur une courbe (index qui recule,
   compteur qui boucle, unité, heure d'été) restent dans les bocaux du Dr Doublon (arenes.js, champAnomalies).

   Pour changer une anomalie : SB_ANOM (où elle est, ce qu'on en dit, les traitements proposés). {kva} et {kwh} sont
   remplacés par la puissance du raccordement du site et l'énergie en jeu. */

/* de et a : premier et dernier créneau touchés (une semaine = 7 × 48 demi-heures, lundi 0 h = 0) */
const SB_ANOM=[
  {id:'trou',dex:'trou',de:2*48+16,a:2*48+27,forme:'une ligne qui disparaît',
    quoi:"Mercredi, de 8 h à 14 h : rien. Pas une mesure. L'API a fait la sieste.",
    opts:[["Estimer le créneau avec un profil type et marquer les valeurs « estimées »",1,"Le trou est comblé, et tout le monde sait que c'est une estimation. Si la vraie donnée arrive, elle la remplacera."],
      ["Mettre 0 kWh à la place",0,"Bravo : tu viens d'économiser {kwh} kWh sans lever le petit doigt. Le directeur financier t'embrasse, l'auditeur te pend."],
      ["Recopier mardi, sans le dire",0,"Une correction en silence. Dans six mois, personne ne saura pourquoi ce mercredi ressemble autant à mardi."]]},
  {id:'doublon',dex:'doublon',de:1*48+20,a:1*48+21,forme:'une marche qui double',
    quoi:"Mardi, de 10 h à 11 h : la consommation double d'un coup, puis redescend comme si de rien n'était. Le créneau est arrivé deux fois.",
    opts:[["Garder une seule mesure par créneau, statut « corrigée », et conserver la brute",1,"Le doublon ressemblait à une surconsommation. Correction tracée, réversible, et personne n'appelle le chauffagiste pour rien."],
      ["Garder : il y avait sûrement une réunion",0,"Une réunion qui double exactement la consommation pendant une heure pile ? Même la machine à café n'est pas aussi régulière."],
      ["Supprimer toute la journée de mardi",0,"Tu jettes 46 mesures saines pour deux mauvaises. C'est brûler la maison pour une araignée."]]},
  {id:'pic',dex:'pic',de:3*48+28,a:3*48+28,forme:'une valeur qui s’envole',
    quoi:"Jeudi, 14 h : 999,9 kW. Pour un raccordement de {kva} kVA, c'est soit une erreur de mesure, soit un réacteur nucléaire sous le préau.",
    opts:[["Rejeter la valeur (statut « rejetée »), estimer le créneau, garder la brute",1,"Physiquement impossible, donc rejetée. Et regarde la courbe : sans ce pic, elle redevient lisible."],
      ["La garder : c'est un record",0,"Un record que ton raccordement ne peut pas laisser passer. Le disjoncteur aurait sauté bien avant."],
      ["La remplacer par 20 kW, sans rien noter",0,"Pourquoi 20 ? Pourquoi pas 42 ? Une correction sans trace, ce n'est pas une donnée, c'est une rumeur."]]},
  {id:'fige',de:4*48+12,a:4*48+39,forme:'une ligne parfaitement plate en pleine journée',
    quoi:"Vendredi, de 6 h à 20 h : exactement la même valeur, demi-heure après demi-heure. Ton bâtiment est devenu très, très zen.",
    opts:[["Valeurs figées : les rejeter, estimer, statut « estimée »",1,"Un capteur bloqué répète sa dernière valeur. Aucun bâtiment occupé ne consomme pile la même chose pendant 14 heures."],
      ["Les garder : vendredi était calme",0,"Calme au point de consommer la même chose à la décimale près, à 7 h comme à midi ? C'est un capteur, pas un moine."],
      ["Les mettre à 0 : le site était fermé",0,"Fermé, il aurait au moins gardé son talon. Et zéro, c'est encore une économie inventée."]]},
];
const SB_JOURS=['Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi','Dimanche'];
const sbHeure=i=>{const h=(i%48)/2;return `${SB_JOURS[Math.floor(i/48)]} ${Math.floor(h)} h ${h%1?'30':'00'}`};
const sbKwh=v=>Math.round(v).toLocaleString('fr-FR');

/* ce qui n'est pas une anomalie, et pourquoi : une donnée surprenante n'est pas forcément fausse */
function sbLeurre(sid,i){
  const d=Math.floor(i/48),H=(i%48)/2,ferme=sid==='boulangerie'?d===0:d>=5;
  if(sid==='ecole'&&d<5&&d!==2&&H>=11.5&&H<13.5)return "Midi : la cantine chauffe. Ce n'est pas une anomalie, c'est le hachis parmentier.";
  if(sid==='ecole'&&d===2&&H>=14)return "Mercredi après-midi : pas de classe. Une école vide qui consomme moins, rien de plus normal.";
  if(sid==='bureau'&&d<5&&H>=7&&H<9)return "8 h : tout le monde allume son écran et la machine à café. Un pic normal, humain, prévisible.";
  if(sid==='boulangerie'&&d!==0&&H>=3&&H<7)return "3 h du matin : le four démarre. Le boulanger est debout, la courbe aussi. Rien d'anormal.";
  if(ferme)return `${sid==='boulangerie'?'Lundi, jour de fermeture':'Le week-end'} : le bâtiment dort. Il consomme peu, mais il ne ment pas. C'est le talon.`;
  if(H<6||H>=21)return "La nuit : le talon. Le bâtiment dort, il consomme peu, mais il ne ment pas.";
  return "Rien à signaler ici : la courbe fait ce que fait le bâtiment à cette heure-là. Une donnée surprenante n'est pas forcément fausse.";
}

/* la semaine vraie (ce que le bâtiment a consommé), la semaine brute (ce que l'EMS a reçu) */
function sbSeries(sid){
  const vrai=weekCurve(sid).map(v=>Math.round(v*10)/10),brut=vrai.slice(),A=Object.fromEntries(SB_ANOM.map(a=>[a.id,a]));
  for(let i=A.trou.de;i<=A.trou.a;i++)brut[i]=null;
  for(let i=A.doublon.de;i<=A.doublon.a;i++)brut[i]=Math.round(vrai[i]*20)/10;
  brut[A.pic.de]=999.9;
  const fige=Math.round(Math.max(...vrai.slice(4*48,5*48))*7.5)/10;for(let i=A.fige.de;i<=A.fige.a;i++)brut[i]=fige;   // un capteur bloqué aux trois quarts du maximum du jour : plat, et bien visible
  return {vrai,brut};
}

function serieBruteStep(el,next){
  const s=site(),{vrai,brut}=sbSeries(s.id),N=brut.length,fait={},statut=Array(N).fill('brute');
  let cur=Math.floor(N/2)+18,choisi=null,rates=0,essais=0;
  const energie=t=>t.reduce((a,v)=>a+(v||0)*0.5,0),E0=energie(brut),E1=energie(vrai);
  const ecart=a=>{let e=0;for(let i=a.de;i<=a.a;i++)e+=((brut[i]||0)-vrai[i])*0.5;return e};
  el.innerHTML=`<div class="ems"><div class="ems-barre"><span>EMS du labo</span><span>${esc(s.name)} · électricité · pas de 30 min</span></div>
    <p>Une semaine de données de ton site, telle que l'EMS vient de la recevoir. <b>Quatre choses clochent.</b> Touche ou clique la courbe à l'endroit suspect, puis choisis le traitement.</p>
    <ul class="ems-liste">${SB_ANOM.map(a=>`<li data-a="${a.id}"><span aria-hidden="true">○</span> ${esc(a.forme)}</li>`).join('')}</ul>
    <canvas class="chart ems-courbe" width="720" height="260" tabindex="0" aria-label="Courbe de charge brute de la semaine. Flèches gauche et droite pour se déplacer, Entrée pour inspecter le créneau."></canvas>
    <p class="ems-cur" aria-live="polite"></p>
    <p class="ems-legende"><span class="lg-b">brute</span><span class="lg-c">corrigée</span><span class="lg-e">estimée</span><span class="lg-r">rejetée</span><span class="lg-t">trou</span></p>
    <div class="ems-diag" aria-live="polite"></div></div>`;
  const cv=el.querySelector('canvas'),x=cv.getContext('2d'),lab=el.querySelector('.ems-cur'),diag=el.querySelector('.ems-diag');
  const L=58,T=14,W=720-L-12,Hh=260-T-32,X=i=>L+W*(i+.5)/N;
  const vue=i=>statut[i]==='brute'?brut[i]:vrai[i];
  const dessiner=()=>{
    const mx=Math.max(10,...Array.from({length:N},(_,i)=>vue(i)||0)),haut=mx>200?Math.ceil(mx/200)*200:Math.ceil(mx/10)*10,Y=v=>T+Hh-v/haut*Hh;
    x.fillStyle='#fffaf0';x.fillRect(0,0,720,260);x.font='12px "Atkinson Hyperlegible",sans-serif';
    x.strokeStyle='#e6dcc0';x.lineWidth=1;x.fillStyle='#5b6380';x.textAlign='right';
    const pas=[5,10,20,25,50,100,200,250,500].find(v=>haut/v<=5)||500;for(let g=0;g<=haut;g+=pas){x.beginPath();x.moveTo(L,Y(g));x.lineTo(L+W,Y(g));x.stroke();x.fillText(g+' kW',L-4,Y(g)+4)}
    x.textAlign='center';SB_JOURS.forEach((d,j)=>{x.fillText(d.slice(0,3),L+W*(j+.5)/7,256);if(j){x.beginPath();x.moveTo(L+W*j/7,T);x.lineTo(L+W*j/7,T+Hh);x.stroke()}});
    // le trou, tant qu'il n'est pas traité : une bande hachurée
    for(let i=0;i<N;i++)if(vue(i)===null){x.fillStyle='rgba(226,87,59,.10)';x.fillRect(X(i)-W/N/2,T,W/N,Hh)}
    const coul={brute:'#2aa198',corrigee:'#2f6db5',estimee:'#e2a13a'};
    for(let i=1;i<N;i++){const a=vue(i-1),b=vue(i);if(a===null||b===null)continue;const st=statut[i]==='brute'&&statut[i-1]!=='brute'?statut[i-1]:statut[i];
      x.strokeStyle=coul[st]||coul.brute;x.lineWidth=st==='brute'?2:3;x.setLineDash(st==='estimee'?[6,4]:[]);x.beginPath();x.moveTo(X(i-1),Y(a));x.lineTo(X(i),Y(b));x.stroke()}
    x.setLineDash([]);
    if(fait.pic){const i=SB_ANOM.find(a=>a.id==='pic').de;x.strokeStyle='#c43d3d';x.lineWidth=2;const px=X(i),py=T+8;x.beginPath();x.moveTo(px-5,py-5);x.lineTo(px+5,py+5);x.moveTo(px+5,py-5);x.lineTo(px-5,py+5);x.stroke();x.fillStyle='#c43d3d';x.textAlign='left';x.fillText('999,9 rejetée',px+8,py+4)}
    if(choisi){x.fillStyle='rgba(47,109,181,.12)';x.fillRect(X(choisi.de)-W/N/2,T,X(choisi.a)-X(choisi.de)+W/N,Hh)}
    x.strokeStyle='#1c2440';x.lineWidth=1;x.setLineDash([3,3]);x.beginPath();x.moveTo(X(cur),T);x.lineTo(X(cur),T+Hh);x.stroke();x.setLineDash([]);
    const v=vue(cur);lab.textContent=`${sbHeure(cur)} · ${v===null?'aucune mesure':v.toLocaleString('fr-FR')+' kW'}${statut[cur]!=='brute'?' · '+statut[cur].replace('corrigee','corrigée').replace('estimee','estimée'):''}`;
  };
  const cocher=()=>el.querySelectorAll('.ems-liste li').forEach(li=>{const ok=!!fait[li.dataset.a];li.classList.toggle('ok',ok);li.querySelector('span').textContent=ok?'✔':'○'});
  const fin=()=>{
    const lignes=SB_ANOM.map(a=>{const e=ecart(a);return `<tr><td>${esc(a.forme.charAt(0).toUpperCase()+a.forme.slice(1))}</td><td class="num">${e<0?'−':'+'}${sbKwh(Math.abs(e))} kWh</td></tr>`}).join('');
    const pct=Math.round((E0-E1)/E1*100);
    S.ems=Object.assign(S.ems||{},{fiab:{brut:Math.round(E0),net:Math.round(E1)}});save();
    diag.innerHTML=`<div class="fb ok">✔ Semaine fiabilisée. La donnée brute est toujours là, chaque valeur corrigée porte son statut.</div>
      <div class="tbl"><table><tr><th>Ce que l'EMS aurait compté sans toi</th><th class="num">écart</th></tr>${lignes}
      <tr><th>Semaine brute : ${sbKwh(E0)} kWh · fiabilisée : ${sbKwh(E1)} kWh</th><th class="num">${pct>0?'+':''}${pct} %</th></tr></table></div>
      <p>Sans fiabilisation, l'EMS aurait annoncé ${Math.abs(pct)} % de consommation ${pct>=0?'en trop':'en moins'}. Quelqu'un aurait monté un plan d'action contre un bug, ou fêté une économie qui n'existe pas.</p>
      <p class="dnote">Dans un EMS, c'est le travail des contrôles de qualité : ils repèrent et proposent. Mais c'est une personne qui choisit le traitement, et la donnée d'origine n'est jamais effacée.</p>`;
    gainXP(essais?10:30);contBtn(diag,next);
  };
  const traiter=a=>{
    choisi=a;cur=a.de;dessiner();const kwh=sbKwh(Math.abs(ecart(a))),txt=t=>esc(t).replace('{kva}',s.kva).replace('{kwh}',kwh);
    const montrer=msg=>{
      diag.innerHTML=`<p class="ems-quoi">${txt(a.quoi)}</p><p><b>Quel traitement ?</b></p><div class="opts"></div>${msg||''}`;
      const box=diag.querySelector('.opts');
      shuffle(a.opts).forEach(o=>{const b=document.createElement('button');b.type='button';b.className='opt';b.textContent=o[0];box.appendChild(b);
        b.onclick=()=>{
          if(o[1]){fait[a.id]=1;for(let i=a.de;i<=a.a;i++)statut[i]=a.id==='doublon'?'corrigee':'estimee';choisi=null;
            if(a.dex&&!S.dex[a.dex]){S.dex[a.dex]=1;toast(`Anomalidex : ${Object.keys(S.dex).length}/7`)}
            sfx('select');cocher();dessiner();
            if(SB_ANOM.every(z=>fait[z.id]))return fin();
            diag.innerHTML=`<div class="fb ok">✔ ${txt(o[2])}</div><p class="dnote">Encore ${SB_ANOM.filter(z=>!fait[z.id]).length} à trouver.</p>`;cv.focus()}
          else{essais++;trk('wrong_answer',{t:'Série brute',q:a.id,a:trkTxt(o[0]).slice(0,80)});sfx('bad');
            montrer(`<div class="fb ko">✘ ${txt(o[2])} Relis le symptôme, et choisis encore.</div>`)}};   // les propositions sont remélangées : on ne gagne pas par élimination
      });
      diag.scrollIntoView({block:'nearest'});
    };
    montrer();
  };
  const inspecter=(i,tol=1)=>{   // tol : la marge, en créneaux, autour d'une anomalie (plus large au doigt)
    cur=Math.max(0,Math.min(N-1,i));const a=SB_ANOM.find(z=>i>=z.de-tol&&i<=z.a+tol);
    if(a&&fait[a.id]){choisi=null;dessiner();diag.innerHTML=`<p class="dnote">Déjà traité : statut « ${a.id==='doublon'?'corrigée':'estimée'} ». La brute reste consultable.</p>`;return}
    if(a)return traiter(a);
    choisi=null;dessiner();rates++;
    const reste=SB_ANOM.filter(z=>!fait[z.id]),indice=rates>=3&&reste.length?`<p class="dnote">Indice du Dr Doublon, à ne répéter à personne : regarde ${esc(SB_JOURS[Math.floor(reste[0].de/48)].toLowerCase())}, et cherche ${esc(reste[0].forme)}.</p>`:'';
    diag.innerHTML=`<p><b>${esc(sbHeure(cur))}</b> · ${esc(sbLeurre(s.id,cur))}</p>${indice}`;
  };
  const idx=e=>{const r=cv.getBoundingClientRect(),px=(e.clientX-r.left)*720/r.width;return Math.max(0,Math.min(N-1,Math.floor((px-L)/W*N)))};
  cv.addEventListener('pointermove',e=>{if(e.pointerType==='mouse'){cur=idx(e);dessiner()}});
  cv.addEventListener('click',e=>{const r=cv.getBoundingClientRect(),creneau=r.width*W/720/N;inspecter(idx(e),Math.max(1,Math.round(14/creneau)))});
  cv.addEventListener('keydown',e=>{
    if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();e.stopPropagation();cur=Math.max(0,Math.min(N-1,cur+(e.key==='ArrowLeft'?-1:1)*(e.shiftKey?12:1)));dessiner()}
    else if(e.key==='Enter'||e.key===' '){e.preventDefault();e.stopPropagation();inspecter(cur)}});
  dessiner();
}
