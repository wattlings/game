/* Wattlings · jeu/voyages/ateliers.js
   Les ateliers : ce qui se manipule sur un site. Un atelier, c'est des réglages (curseurs, choix, cases), un calcul,
   des chiffres et un graphique qui suivent les réglages, et une ou plusieurs missions à réussir.
   Chaque site décrit ses ateliers dans son fichier simulations.js ; l'affichage et les règles du jeu sont ici, une fois pour toutes.

   voyAtelier('Titre du panneau', {
     etat:{incl:10, azim:45},                  les réglages de départ (gardés d'une mission à l'autre)
     reglages:[                                 ce que le joueur manipule
       {id:'incl', genre:'curseur', nom:'Inclinaison', min:0, max:90, pas:5, dire:v=>v+'°', note:'…', couleur:'#…', inactif:etat=>…},
       {id:'mode', genre:'choix',   nom:'Mode', options:[['a','Pomper'],['b','Attendre']]},
       {id:'suivi',genre:'case',    nom:'Tracker', note:'…'}],
     calcul:etat=>resultat,                     tout ce qui se déduit des réglages
     chiffres:(r,etat)=>[['1 450','kWh par kWc', vrai si à mettre en vert], …],
     croquis:(canvas,etat,r)=>{…},              facultatif : un petit dessin (240 × 150) à côté des réglages
     vues:[{id:'mois', nom:'Par mois', graphe:(canvas,r,etat,mission)=>voyGraphe(canvas,{…})}],   un ou plusieurs graphiques
     grapheEnHaut:true,                         facultatif : le graphique avant les réglages
     missions:[{
       t:'Mission 1 · …', x:'La consigne.', vue:'mois', depart:{…}, reglages:['incl'],     (depart et reglages : facultatifs)
       ok:(r,etat)=>…, bravo:'…' ou (r,etat)=>'…', indice:(r,etat)=>'…',
       libre:1, fini:(r,etat)=>…, constat:(r,etat)=>'…'    essai libre : on peut terminer dès que fini() a été vrai une fois
     }]
   }, fin)                                      fin() est appelée quand toutes les missions sont réussies */

function voyAtelierEtapes(A){
  const etat=A.etat;
  return A.missions.map(m=>(el,suite)=>{
    if(m.depart)Object.assign(etat,m.depart);
    let vue=m.vue||(A.vues&&A.vues[0]&&A.vues[0].id),essais=0,gagne=false,libreOk=false;
    const R0=(m.reglages?A.reglages.filter(g=>m.reglages.includes(g.id)):A.reglages.filter(g=>!g.seulement||(g.seulement==='libre'&&m.libre))),plusieursVues=A.vues&&A.vues.length>1&&!m.vueSeule;
    const blocGraphe=`${plusieursVues?`<div class="seg" role="group">${A.vues.map(v=>`<button type="button" data-v="${v.id}">${esc(v.nom)}</button>`).join('')}</div>`:''}${A.vues&&A.vues.length?`<canvas class="chart" width="640" height="${A.hauteur||240}" role="img" aria-label="${esc(A.legende||'Graphique de la simulation')}"></canvas>`:''}`;
    const blocReglages=A.croquis?`<div class="voy-atelier"><canvas class="voy-croquis" width="240" height="150" aria-hidden="true"></canvas><div class="voy-reglages"></div></div>`:`<div class="voy-reglages seuls"></div>`;
    el.innerHTML=`<h3>${esc(m.t)}</h3><div class="ctx">${m.html||esc(m.x)}</div>${A.grapheEnHaut?blocGraphe+'<div class="voy-chiffres" aria-live="polite"></div>'+blocReglages:blocReglages+'<div class="voy-chiffres" aria-live="polite"></div>'+blocGraphe}<div class="fbz"></div><div class="row"></div>`;
    const zone=el.querySelector('.voy-reglages'),ch=el.querySelector('.voy-chiffres'),cvs=el.querySelector('.chart'),fbz=el.querySelector('.fbz'),row=el.querySelector('.row'),champs=[];let bouton=null;
    const dessiner=()=>{
      const r=A.calcul(etat,m);
      if(A.croquis)A.croquis(el.querySelector('.voy-croquis'),etat,r);
      ch.innerHTML=(A.chiffres?A.chiffres(r,etat,m):[]).map(([v,l,bon])=>`<div class="${bon?'bon':''}"><b class="num">${v}</b><span>${esc(l)}</span></div>`).join('');
      el.querySelectorAll('.seg[role=group]>button[data-v]').forEach(b=>{b.classList.toggle('on',b.dataset.v===vue);b.setAttribute('aria-pressed',b.dataset.v===vue)});
      if(cvs){const v=A.vues.find(v=>v.id===vue)||A.vues[0];v.graphe(cvs,r,etat,m)}
      champs.forEach(c=>c.maj());
      if(m.libre){if(!libreOk&&(!m.fini||m.fini(r,etat))){libreOk=true;if(bouton)bouton.disabled=false}const t=m.constat&&m.constat(r,etat);if(t&&fbz.dataset.t!==t){fbz.dataset.t=t;fbz.innerHTML=`<div class="fb ok">${t}</div>`}}
      return r;
    };
    R0.forEach(g=>{
      if(g.genre==='curseur'){const boite=g.note||g.couleur?document.createElement('div'):zone;if(boite!==zone){boite.className='voy-usage';if(g.couleur)boite.style.setProperty('--u',g.couleur);zone.appendChild(boite)}
        const i=voyCurseur(boite,{nom:typeof g.nom==='function'?g.nom(etat):g.nom,min:g.min,max:g.max,pas:g.pas,val:etat[g.id],dire:v=>g.dire?g.dire(v,etat):String(v),quand:v=>{etat[g.id]=v;dessiner()}});
        if(g.note)boite.insertAdjacentHTML('beforeend',`<small>${esc(g.note)}</small>`);
        champs.push({el:i,maj:()=>{i.disabled=gagne||!!(g.inactif&&g.inactif(etat))}})}
      else if(g.genre==='choix'){const d=document.createElement('div');d.className='voy-choix';d.innerHTML=`<b>${esc(g.nom)}</b><div class="seg">${g.options.map(([v,l])=>`<button type="button" data-o="${esc(v)}">${esc(l)}</button>`).join('')}</div>`;zone.appendChild(d);
        const B=[...d.querySelectorAll('button')];B.forEach(b=>b.onclick=()=>{etat[g.id]=g.options.find(o=>String(o[0])===b.dataset.o)[0];dessiner()});
        champs.push({maj:()=>B.forEach(b=>{const on=String(etat[g.id])===b.dataset.o;b.classList.toggle('on',on);b.setAttribute('aria-pressed',on);b.disabled=gagne||!!(g.inactif&&g.inactif(etat))})})}
      else if(g.genre==='case'){const l=document.createElement('label');l.className='chk';l.innerHTML=`<input type="checkbox"${etat[g.id]?' checked':''}><span>${esc(g.nom)}${g.note?`<small>${esc(g.note)}</small>`:''}</span>`;zone.appendChild(l);
        const i=l.querySelector('input');i.onchange=()=>{etat[g.id]=i.checked;dessiner()};champs.push({maj:()=>{i.disabled=gagne}})}
    });
    el.querySelectorAll('.seg[role=group]>button[data-v]').forEach(b=>b.onclick=()=>{vue=b.dataset.v;dessiner()});
    if(m.libre){bouton=document.createElement('button');bouton.className='btn';bouton.textContent=(m.bouton||'Terminer')+' ▸';bouton.disabled=true;row.appendChild(bouton);bouton.onclick=()=>{if(libreOk)suite()}}
    else{bouton=document.createElement('button');bouton.className='btn';bouton.textContent=(m.bouton||'Valider le réglage')+' ▸';row.appendChild(bouton);
      bouton.onclick=()=>{if(gagne)return;const r=dessiner();
        if(m.ok(r,etat)){gagne=true;bouton.remove();champs.forEach(c=>c.maj());fbz.innerHTML=`<div class="fb ok">✔ ${typeof m.bravo==='function'?m.bravo(r,etat):esc(m.bravo)}</div>`;gainXP(essais?5:m.xp||15);contBtn(fbz,suite)}
        else{essais++;sfx('bad');trk('wrong_answer',{t:A.suivi||panelTitle(),q:trkTxt(m.t).slice(0,100),a:trkTxt(JSON.stringify(etat)).slice(0,80)});fbz.innerHTML=`<div class="fb ko">✘ ${esc(m.indice?m.indice(r,etat):'Pas encore. Regarde les chiffres, et réessaie.')}</div>`}
        voyMontrer(fbz)}}
    dessiner();
  });
}
function voyAtelier(titre,A,fin){voyEtapes(titre,voyAtelierEtapes(A),fin,{plusTard:true})}

/* ================= LE DÉFI FINAL D'UN SITE =================
   Le responsable du site : tant qu'il manque des informations clés, il renvoie le visiteur les chercher ; ensuite il pose ses questions,
   fait passer une épreuve, tamponne le passeport, puis radote.
   voyDefi('solaire', {qui:'Mme Zénith', attente:'…', entree:'…', questions:[Q(…)…], epreuves:[étapes…], verdict:'<p>…</p>', merci:'…', apres:['…','…']}) */
function voyDefi(sid,d){
  const W=d.qui;
  if(voyTampon(sid)){d.k=(d.k||0)+1;say([{w:W,t:d.apres[d.k%d.apres.length]}]);return}
  const manque=voyClesManquantes(sid);
  if(manque.length){say([{w:W,t:d.attente},{w:W,t:`Il te manque ${manque.length} info${manque.length>1?'s':''} clé${manque.length>1?'s':''}. Commence par ${manque[0].ou}.`}]);return}
  say([{w:W,t:d.entree}],()=>{
    trk('voyage_defi',{site:sid});
    voyEtapes('Le défi de '+W,[
      ...d.questions.map((q,i)=>choice({title:`Question ${i+1} sur ${d.questions.length}`,q:q.q,opts:q.o})),
      ...(d.epreuves||[]),
      info(`<h3>Verdict</h3>${d.verdict}`,'Tendre le passeport')
    ],()=>voyTamponner(sid,()=>say([{w:W,t:d.merci}])),{plusTard:true});
  });
}

/* quelqu'un qui fait manipuler avant de donner une information : il parle, lance l'atelier, et l'information est notée à la fin */
function voyAnimateur(sid,id,qui,avant,apres,lancer){
  const L=t=>({w:qui,t});
  return()=>{if(voyInfoVue(sid,id))say(apres.map(L));else say(avant.map(L),()=>lancer(()=>voyDonnerInfo(sid,id)))};
}
