/* Wattlings · jeu/epreuves/collecter.js
   Étape 2 · Collecter : le mandat et la collecte des données. */

function actPC(){
  const m={0:"Ton ordinateur. Parle d'abord à Mme Joule.",1:"Rien à faire ici pour l'instant : cadre ton site depuis l'extérieur.",10:"Tableau de bord : Mme Joule veut te parler.",11:"Tableau de bord du patrimoine : tout est au vert. Enfin, presque."};
  const A=ARENAS.find(a=>ARENA_CH[a.id]===S.ch);
  say([{t:m[S.ch]||(A?`Ton ordinateur affiche un rappel : « ${A.name}, ${qAu(A.id)}. ${A.champ} t'attend. »`:'Ton ordinateur.')}]);
}
function gameCollecte(done){
  const s=site(),now=new Date(),d=n=>{const x=new Date(now);x.setFullYear(x.getFullYear()+n);return x.toLocaleDateString('fr-FR')},hier=new Date(now-864e5).toLocaleDateString('fr-FR');
  const canal=elecChannel(s);
  runSteps('Arène des Flux · Le mandat',[
    info(`<h3>D'où viennent les données ?</h3><p>La donnée d'énergie arrive par trois canaux :</p><div class="tbl"><table><tr><th>Source</th><th>Pas</th><th>Sert à</th></tr><tr><td>Télérelevé (courbe de charge)</td><td>${s.souscrit>36?'10 min':'30 min'} (élec), 1 jour (gaz)</td><td>Analyser</td></tr><tr><td>Index</td><td>1 relevé par période</td><td>Contrôler</td></tr><tr><td>Facture</td><td>1 montant par période</td><td>Chiffrer le coût</td></tr></table></div><p>Avant de recevoir la moindre donnée de mesure, il faut le <b>consentement</b> du titulaire du contrat : ${esc(s.titulaire)}.</p>`),
    choice({q:'Qui te fournit les données de mesure de ton site ?',opts:[['Le distributeur : Enedis pour l\'électricité, GRDF pour le gaz',1,'Le distributeur pose et relève les compteurs. Le fournisseur, lui, vend l\'énergie et envoie la facture.'],['Le fournisseur qui envoie la facture',0,'Le fournisseur facture, il ne relève pas les compteurs.'],['La mairie',0,'Elle peut être titulaire du contrat, pas gestionnaire du réseau.']]}),
    form({title:'Mandat unique · Qui consent, et jusqu\'à quand ?',ctx:`Un seul mandat couvre les deux énergies.<br><b>Électricité</b> : Enedis, canal ${canal} (${s.souscrit>36?'plus de 36 kVA':'Linky, 36 kVA ou moins'}). <b>Gaz</b> : GRDF, API ADICT.<br>Repris de ton carnet : ${esc(s.addr)}, ${esc(s.cp)} · SIRET ${s.siret}.`,fields:[
      {label:'Titulaire du contrat (celui qui consent)',opts:[[s.titulaire,1],["Volt&Co Énergie (le fournisseur)",0,"Le fournisseur vend l'énergie : il n'est pas le titulaire qui consent."],[`${S.name} (gestionnaire)`,0,'Tu agis pour le titulaire, mais le consentement doit venir de lui.']]},
      {label:'Signataire',opts:[['Représentant légal du titulaire, ou personne habilitée',1],['Un technicien du distributeur',0,'Le distributeur reçoit le consentement, il ne le donne pas.'],["N'importe quel salarié du site",0,'Il faut une personne habilitée à engager le titulaire.']]},
      {label:'Date de fin du consentement',opts:[[`${hier} (hier)`,0,'Un consentement déjà expiré ne donne accès à rien.'],[`${d(1)} (1 an)`,1,'Valide. Pense à le renouveler avant l\'échéance.'],[`${d(3)} (3 ans)`,1,'Valide côté Enedis, où trois ans est le maximum. Côté GRDF, l\'accès est ramené à un an : à renouveler chaque année.'],['Sans date de fin',0,'Un consentement est toujours limité dans le temps.']]}
    ],okMsg:'Le titulaire consent, pour une durée limitée.'}),
    multi({title:'Mandat unique · Données demandées',q:'Coche les données à récupérer, pour l\'électricité et pour le gaz (juste le nécessaire).',items:[
      [`<span class="tag">Élec</span> Courbe de charge (pas de ${s.souscrit>36?10:30} min)`,true,'Indispensable pour analyser : elle montre quand on consomme.'],
      ['<span class="tag">Élec</span> Index et données contractuelles (puissance souscrite)',true,'La référence du comptage, et de quoi vérifier le contrat.'],
      ['<span class="tag">Gaz</span> Consommations quotidiennes (Gazpar)',true,'La consommation du jour J arrive un à trois jours plus tard.'],
      ['<span class="tag">Gaz</span> Coefficient de conversion (PCS)',true,'Sans lui, impossible de passer des m³ aux kWh.'],
      ['<span class="tag">Gaz</span> Courbe de charge au pas de 10 minutes',false,'Gazpar transmet un volume par jour, pas une courbe 10 min.'],
      ['Factures d\'électricité et de gaz',false,'Les factures viennent du fournisseur, pas des distributeurs.'],
      ['Liste nominative des occupants',false,'Données personnelles sans rapport : on ne demande que le nécessaire.']],okMsg:'Chaque source a son usage : analyser, contrôler, chiffrer.'}),
    signature(s.titulaire,'Enedis + GRDF'),
    raccordStep,
    dataAnim,
    sourcesStep,
    choice({q:"Le logiciel appelle l'API pour un PDL sans consentement valide. Que se passe-t-il ?",opts:[['Refus : sans consentement valide, pour ce point et à cette date, pas de données',1,'Même chose après l\'expiration du consentement : la collecte s\'arrête. Il faut surveiller les dates de fin.'],['L\'API renvoie les données, c\'est une formalité',0,'Le consentement est obligatoire.'],['L\'API renvoie des données estimées',0,'Elle ne renvoie rien.']]})
  ],done);
}
function dataAnim(el,next){
  const s=site();
  el.innerHTML=`<h3>Récupération des données</h3><p>Les compteurs remontent leurs mesures au distributeur, qui les transmet à ton logiciel grâce au mandat.</p><canvas class="chart" width="640" height="260" aria-label="Animation de collecte"></canvas><p class="num" id="cnt"></p>`;
  const c=el.querySelector('canvas'),x=c.getContext('2d'),cnt=el.querySelector('#cnt');let t0=performance.now(),pk=[],done=false,pts=0,days=0;
  const nodes={le:[70,70],lg:[70,190],en:[320,70],gr:[320,190],pc:[566,130]};
  const box=(p,col,lab,sub)=>{x.fillStyle=col;x.fillRect(p[0]-56,p[1]-28,112,56);x.fillStyle='#fff';x.font='16px "Unifont",monospace';x.textAlign='center';x.fillText(lab,p[0],p[1]-2);x.font='12px "Atkinson Hyperlegible",sans-serif';x.fillText(sub,p[0],p[1]+16)};
  function frame(now){
    const t=now-t0;x.fillStyle='#fffaf0';x.fillRect(0,0,640,260);x.strokeStyle='#c9bb92';x.lineWidth=3;x.setLineDash([6,6]);
    [['le','en'],['lg','gr'],['en','pc'],['gr','pc']].forEach(([a,b])=>{x.beginPath();x.moveTo(...nodes[a]);x.lineTo(...nodes[b]);x.stroke()});x.setLineDash([]);
    box(nodes.le,'#2aa198',s.souscrit>36?'Compteur pro':'Linky',`PDL …${s.pdl.slice(-4)}`);box(nodes.lg,'#c9a82a','Gazpar',`PCE ${s.pce}`);box(nodes.en,'#2f6db5','Enedis',elecChannel(s));box(nodes.gr,'#1c7a9a','GRDF','ADICT');box(nodes.pc,'#1c2440','Ton EMS','base de données');
    if(t<5200&&Math.random()<.25){const e=Math.random()<.65;pk.push({a:e?'le':'lg',b:e?'en':'gr',p:0,e})}
    pk.forEach(k=>{k.p+=.02;if(k.p>=1){if(k.b==='pc'){k.dead=1;if(k.e)pts+=48;else days++}else{k.a=k.b;k.b='pc';k.p=0}}const A=nodes[k.a],B=nodes[k.b];x.fillStyle=k.e?'#2aa198':'#e2573b';x.fillRect(A[0]+(B[0]-A[0])*k.p-5,A[1]+(B[1]-A[1])*k.p-5,10,10)});
    pk=pk.filter(k=>!k.dead);
    cnt.textContent=`Courbe de charge : ${fmt(pts)} points reçus · Gazpar : ${days} jours reçus`;
    if(t<6500||pk.length)qkRAF(frame);else if(!done){done=true;cnt.textContent+=' · Collecte terminée.';contBtn(el,next)}
  }
  qkRAF(frame);
}
