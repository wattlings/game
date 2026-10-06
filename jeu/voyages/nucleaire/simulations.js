/* Wattlings · jeu/voyages/nucleaire/simulations.js
   Centrale nucléaire de Neutron-sur-Mer : ce qui se manipule.
   1. « Le simulateur de conduite » (M. Bore) : on règle les barres de contrôle, en temps réel, pour suivre une consigne.
   2. « Du neutron à la prise » (Mlle Vapeur) : la chaîne à remettre dans l'ordre, puis le bilan de chaleur.
   3. Le défi de Mme Isotope : six questions, puis l'épreuve « Le planning des arrêts ».
   Les textes des missions sont ici, à côté de leurs règles ; les répliques des personnages sont dans textes.js. */

/* ================= 1. LE SIMULATEUR DE CONDUITE =================
   Un modèle très simplifié : la position des barres fixe la puissance d'équilibre, et la puissance réelle la rejoint avec un peu de retard.
   Dans le simulateur, une seconde vaut une minute. Trois façons de perdre : varier trop vite, dépasser 105 %, ou laisser passer le temps. */
const NUC_CONDUITE={
  retard:3,            // secondes pour combler les deux tiers de l'écart
  penteMax:10,         // variation maximale, en points par seconde, avant l'arrêt automatique
  surpuissance:105,    // au-delà : arrêt automatique
  tolerance:2,         // on est « sur la consigne » à 2 points près
  tenue:3,             // secondes à tenir sur la consigne
  equilibre:b=>Math.max(0,120-1.2*b),      // puissance d'équilibre (%) pour des barres enfoncées à b %
  barresPour:p=>Math.round((120-p)/1.2),
  residuelle:7         // % de chaleur encore produite juste après l'arrêt
};
/* une manœuvre du simulateur : partir d'une puissance, rejoindre la consigne, la tenir */
const nucManoeuvre=({t,x,depart,consigne,bravo})=>(el,suite)=>{
  const C=NUC_CONDUITE;let b,P,hist,tenu,etat,essais=0;
  el.innerHTML=`<h3>${esc(t)}</h3><div class="ctx">${esc(x)}</div><canvas class="chart" width="640" height="220" role="img" aria-label="Puissance du réacteur au fil du temps"></canvas>
    <div class="voy-chiffres" aria-live="off"></div><div class="voy-reglages seuls"></div><div class="fbz" aria-live="polite"></div><div class="row"></div>`;
  const cvs=el.querySelector('canvas'),ch=el.querySelector('.voy-chiffres'),fbz=el.querySelector('.fbz'),row=el.querySelector('.row');
  const curseur=voyCurseur(el.querySelector('.voy-reglages'),{nom:'Barres de contrôle',min:0,max:100,pas:1,val:C.barresPour(depart),dire:v=>v===0?'entièrement sorties':v===100?'entièrement enfoncées':`enfoncées à ${v} %`,quand:v=>{b=v}});
  const dessiner=()=>{const pente=(C.equilibre(b)-P)/C.retard;
    voyGraphe(cvs,{x:[-30,0],y:115,unite:'% de la puissance',gradY:[0,25,50,75,100],gradX:[-30,-20,-10,0].map(s=>[s,s?s+' s':'0']),
      series:[{p:[[-30,consigne+C.tolerance],[0,consigne+C.tolerance]],c:VOY_ENCRE.ok,genre:'tirets',e:2,nom:'Consigne'},{p:[[-30,consigne-C.tolerance],[0,consigne-C.tolerance]],c:VOY_ENCRE.ok,genre:'tirets',e:2},
        {p:[[-30,C.surpuissance],[0,C.surpuissance]],c:VOY_ENCRE.alerte,genre:'tirets',e:1,nom:'Limite'},{p:hist.map((v,i)=>[(i-hist.length+1)/10,v]),c:VOY_ENCRE.reseau,genre:'ligne',nom:'Puissance du réacteur'}]});
    ch.innerHTML=`<div class="${Math.abs(P-consigne)<=C.tolerance?'bon':''}"><b class="num">${Math.round(P)} %</b><span>puissance · ${fmt(Math.round(P*13/10)*10)} MW</span></div><div><b class="num">${consigne} %</b><span>consigne du réseau</span></div><div class="${Math.abs(pente)>C.penteMax*.75?'alerte':''}"><b class="num">${pente>=0?'+':'−'}${Math.abs(pente).toFixed(1).replace('.',',')}</b><span>points par seconde (maximum ${C.penteMax})</span></div><div><b class="num">${tenu>0?Math.min(C.tenue,tenu).toFixed(1).replace('.',','):'0'} s</b><span>sur la consigne (objectif ${C.tenue} s)</span></div>`};
  const lancer=()=>{b=C.barresPour(depart);P=depart;hist=Array(300).fill(depart);tenu=0;etat='marche';curseur.value=b;curseur.disabled=false;curseur.dispatchEvent(new Event('input'));row.innerHTML='';fbz.innerHTML='';boucle()};
  const perdu=pourquoi=>{etat='arret';essais++;sfx('bad');curseur.disabled=true;trk('wrong_answer',{t:'Simulateur de conduite',q:t,a:pourquoi.slice(0,60)});
    fbz.innerHTML=`<div class="fb ko">✘ Arrêt automatique du réacteur. ${esc(pourquoi)}</div>`;const r=document.createElement('button');r.className='btn alt';r.textContent='Redémarrer le simulateur';r.onclick=lancer;row.appendChild(r);voyMontrer(fbz)};
  const boucle=()=>{
    if(!el.isConnected||etat!=='marche')return;
    const cible=C.equilibre(b),pente=(cible-P)/C.retard;P+=pente*.1;hist.push(P);hist.shift();
    if(Math.abs(P-consigne)<=C.tolerance)tenu+=.1;else tenu=0;
    dessiner();
    if(Math.abs(pente)>C.penteMax)return perdu(pente>0?"La puissance montait trop vite : les protections ont fait tomber les barres. Sors-les par paliers, en laissant au cœur le temps de suivre.":"La puissance chutait trop vite. Enfonce les barres par paliers.");
    if(P>C.surpuissance)return perdu("Plus de 105 % : surpuissance. Le réacteur ne discute pas, il s'arrête.");
    if(tenu>=C.tenue){etat='gagne';curseur.disabled=true;gainXP(essais?5:15);fbz.innerHTML=`<div class="fb ok">✔ ${esc(bravo)}</div>`;contBtn(fbz,suite);voyMontrer(fbz);return}
    qkTimeout(boucle,100);
  };
  lancer();
};
/* l'arrêt automatique : on appuie, les barres tombent, et il reste de la chaleur */
const nucArretUrgence=(el,suite)=>{
  const C=NUC_CONDUITE;let P=100,hist=Array(300).fill(100),t=-1,fini=false;
  el.innerHTML=`<h3>Dernière manœuvre · Le bouton rouge</h3><div class="ctx">Le réacteur est à 100 %. Sous le capot, le bouton d'arrêt automatique. Appuie, et regarde ce qui reste.</div><canvas class="chart" width="640" height="220" role="img" aria-label="Puissance du réacteur pendant l'arrêt"></canvas><div class="voy-chiffres"></div><div class="fbz" aria-live="polite"></div><div class="row"><button class="btn voy-rouge" id="vAar">Arrêt automatique du réacteur</button></div>`;
  const cvs=el.querySelector('canvas'),ch=el.querySelector('.voy-chiffres'),fbz=el.querySelector('.fbz'),bt=el.querySelector('#vAar');
  const dessiner=()=>{voyGraphe(cvs,{x:[-30,0],y:115,unite:'% de la puissance',gradY:[0,25,50,75,100],gradX:[-30,-20,-10,0].map(s=>[s,s?s+' s':'0']),series:[{p:hist.map((v,i)=>[(i-hist.length+1)/10,v]),c:VOY_ENCRE.reseau,genre:'ligne',nom:'Chaleur produite par le cœur'}]});
    ch.innerHTML=`<div><b class="num">${P.toFixed(P<10?1:0).replace('.',',')} %</b><span>de la puissance thermique</span></div><div><b class="num">${fmt(Math.round(P*38))} MW</b><span>de chaleur à évacuer</span></div><div><b class="num">${t<0?'sorties':t<2?'en chute':'tombées'}</b><span>barres de contrôle</span></div>`};
  const boucle=()=>{if(!el.isConnected||fini)return;
    if(t>=0){t+=.1;P=t<2?100-(100-C.residuelle)*(t/2):Math.max(3,C.residuelle*Math.pow(t-1,-.28))}
    hist.push(P);hist.shift();dessiner();
    if(t>=9){fini=true;gainXP(10);fbz.innerHTML=`<div class="fb ok">✔ Deux secondes : les barres sont tombées, la réaction en chaîne est arrêtée. Mais regarde la courbe : le cœur dégage encore ${C.residuelle} % de sa chaleur, puis de moins en moins, pendant des jours. C'est la puissance résiduelle. Un réacteur arrêté doit continuer à être refroidi : c'est pour cela qu'il a des pompes de secours, des diesels de secours, et des secours de secours.</div>`;contBtn(fbz,suite);voyMontrer(fbz);return}
    qkTimeout(boucle,100)};
  bt.onclick=()=>{if(t<0){t=0;bt.remove();sfx('door')}};
  dessiner();boucle();
};
function nucSimConduite(fin){
  trk('voyage_sim',{site:'nucleaire',sim:'conduite'});
  voyEtapes('Simulateur de conduite',[
    info(`<h3>Le simulateur de M. Bore</h3><p>Un seul levier : les <b>barres de contrôle</b>. Enfoncées dans le cœur, elles avalent les neutrons et la puissance baisse ; sorties, elle monte.</p><p>La puissance ne suit pas la main : elle rejoint sa nouvelle valeur avec un peu de retard. Si tu la fais varier trop vite, ou si elle dépasse 105 %, les protections déclenchent l'<b>arrêt automatique</b>.</p><p class="dnote">Dans le simulateur, une seconde vaut une minute de la vraie vie. M. Bore trouve que c'est déjà très rapide.</p>`,'Prendre les commandes'),
    nucManoeuvre({t:'Manœuvre 1 · Le matin',depart:30,consigne:100,x:"6 h. Le pays se réveille, le réseau demande tout. Le réacteur est à 30 % : amène-le à 100 %, et tiens-le trois secondes dans la bande verte. Par paliers.",
      bravo:"Pleine puissance, 1 300 MW, sans rien déclencher. Tu as sorti les barres par paliers et laissé le cœur suivre : c'est exactement le geste. Dans la réalité, cette montée prend une bonne demi-heure."}),
    nucManoeuvre({t:'Manœuvre 2 · Midi',depart:100,consigne:60,x:"13 h, grand soleil sur tout le pays. Les panneaux produisent à plein, les prix s'effondrent : le réseau demande 60 %. Descends, et tiens trois secondes.",
      bravo:"60 %. Tu viens de faire du suivi de charge : laisser la place au solaire à midi, remonter le soir. Les réacteurs français font cela presque tous les jours, et de plus en plus souvent."}),
    nucArretUrgence,
    info(`<h3>Ce que dit M. Bore</h3><p><b>M. Bore :</b> « Trois choses à retenir. Un : la puissance se règle, avec des barres et de la patience. Deux : si quoi que ce soit sort des clous, le réacteur s'arrête tout seul, en deux secondes, sans demander l'avis de personne. Trois : arrêté ne veut pas dire froid. »</p><p>« Les gens imaginent une salle de commande avec des alarmes partout. En vrai, une bonne journée, c'est une journée où il ne se passe rien. J'ai eu beaucoup de bonnes journées. »</p>`,'Rendre le pupitre')
  ],()=>{voyEtat().faits['nucleaire.conduite']=1;save();if(fin)fin()},{plusTard:true});
}

/* ================= 2. DU NEUTRON À LA PRISE ================= */
const NUC_CHAINE=["Un neutron casse un noyau d'uranium : de la chaleur","L'eau du circuit primaire s'échauffe à 320 °C, sous 155 bars","Dans le générateur de vapeur, elle fait bouillir l'eau du circuit secondaire","La vapeur fait tourner la turbine","L'alternateur produit le courant, à 1 500 tours par minute","Le transformateur l'élève à 400 000 volts","L'eau de mer refroidit la vapeur, qui redevient de l'eau"];
function nucSimChaine(fin){
  trk('voyage_sim',{site:'nucleaire',sim:'chaine'});
  voyEtapes('Du neutron à la prise',[
    order({title:'La bouilloire, étape par étape',ctx:"<b>Mlle Vapeur :</b> « Sept étapes. Les six premières vont du cœur au réseau. La dernière ferme la boucle : la vapeur doit redevenir de l'eau pour repartir. »",q:"Dans quel ordre ?",items:NUC_CHAINE,
      okMsg:"C'est ça. Trois circuits qui ne se mélangent jamais : l'eau qui touche le combustible reste dans le bâtiment réacteur, celle qui fait tourner la turbine ne voit jamais le cœur, et l'eau de mer ne voit que des tuyaux."}),
    choice({title:'Le bilan',ctx:"Le réacteur produit <b>3 800 MW</b> de chaleur. L'alternateur en tire <b>1 300 MW</b> d'électricité.",q:"Que vaut le rendement, et où passe le reste ?",
      opts:[["Environ 34 % ; les 2 500 MW restants partent en chaleur dans la mer",1,"Un tiers, deux tiers : c'est la règle de toutes les centrales à vapeur. D'où l'importance de la source froide : la mer ici, une rivière et des tours ailleurs."],
        ["Environ 34 % ; le reste est stocké dans le cœur",0,"Un cœur ne stocke pas sa chaleur : ce qui n'est pas évacué le ferait monter en température."],
        ["Environ 90 %, comme une turbine hydraulique",0,"On aimerait bien. Mais transformer de la chaleur en mouvement coûte toujours cher : c'est la thermodynamique."]]})
  ],()=>{voyEtat().faits['nucleaire.chaine']=1;save();if(fin)fin()},{plusTard:true});
}

/* ================= 3. LE DÉFI DE MME ISOTOPE ================= */
/* l'épreuve « Le planning des arrêts » : deux réacteurs, un arrêt de deux mois chacun, à placer dans l'année */
const NUC_ARRETS={
  duree:2,                                                    // mois d'arrêt par réacteur
  besoin:[100,96,85,70,60,56,58,54,60,72,86,97],              // la consommation du pays, mois par mois (indice 100 en janvier)
  hiver:[10,11,0,1],                                          // novembre, décembre, janvier, février : on ne s'arrête pas
  mois:['J','F','M','A','M','J','J','A','S','O','N','D'],noms:['janvier','février','mars','avril','mai','juin','juillet','août','septembre','octobre','novembre','décembre']
};
function nucArretsBilan(a1,a2){
  const M=NUC_ARRETS,en=(a,m)=>((m-a)%12+12)%12<M.duree,dispo=M.mois.map((x,m)=>(en(a1,m)?0:1)+(en(a2,m)?0:1));
  const hiverPerdu=M.hiver.reduce((t,m)=>t+2-dispo[m],0),ensemble=dispo.filter(d=>d===0).length;
  const ecart=Math.min(((a2-a1)%12+12)%12,((a1-a2)%12+12)%12)-M.duree;                 // mois de battement entre la fin d'un arrêt et le début de l'autre
  let utile=0,total=0;M.besoin.forEach((b,m)=>{utile+=dispo[m]*b;total+=2*b});
  return{dispo,hiverPerdu,ensemble,ecart,utile:utile/total*100};
}
const NUC_ARRETS_ATELIER={
  suivi:'Le planning des arrêts',legende:"Réacteurs disponibles et besoins du pays, mois par mois",hauteur:230,grapheEnHaut:true,
  etat:{a1:11,a2:0},
  reglages:[1,2].map(n=>({id:'a'+n,genre:'curseur',nom:`Arrêt du réacteur ${n}`,min:0,max:11,pas:1,couleur:n===1?'#4a78c9':'#8a3b8f',dire:v=>`${NUC_ARRETS.noms[v]} et ${NUC_ARRETS.noms[(v+1)%12]}`})),
  calcul:e=>nucArretsBilan(e.a1,e.a2),
  chiffres:b=>[[b.hiverPerdu?b.hiverPerdu+' mois':'aucun',"d'arrêt entre novembre et février",!b.hiverPerdu],[b.ensemble?b.ensemble+' mois':'jamais','les deux réacteurs arrêtés ensemble',!b.ensemble],[b.ecart>=1?b.ecart+' mois':'aucun',"de battement entre les deux arrêts (il en faut un)",b.ecart>=1],[b.utile.toFixed(1).replace('.',',')+' %','des besoins de l\'année servis']],
  vues:[{id:'an',nom:"L'année",graphe:(cv,b)=>voyGraphe(cv,{x:[-.6,11.6],y:2.4,unite:'réacteurs',gradY:[0,1,2],gradX:NUC_ARRETS.mois.map((l,i)=>[i,l]),
    series:[{p:NUC_ARRETS.besoin.map((v,i)=>[i,v/50]),c:VOY_ENCRE.repere,genre:'barres',nom:'Besoins du pays',l:36},{p:b.dispo.map((v,i)=>[i,v]),c:VOY_ENCRE.reseau,genre:'barres',nom:'Réacteurs disponibles',l:20}]})}],
  missions:[{t:'Dernière épreuve · Le planning des arrêts',bouton:'Valider le planning',xp:25,
    html:`<b>Mme Isotope :</b> « Chaque réacteur doit s'arrêter deux mois cette année pour recharger. M. Planning est en congé, et quelqu'un a rempli le tableau à sa place. Corrige-le. Trois règles : aucun arrêt de novembre à février, jamais les deux réacteurs ensemble, et un mois de battement entre les deux arrêts : ce sont les mêmes équipes. »`,
    ok:b=>!b.hiverPerdu&&!b.ensemble&&b.ecart>=1,
    bravo:b=>`Planning validé : les deux réacteurs sont là tout l'hiver, et ${b.utile.toFixed(1).replace('.',',')} % des besoins de l'année sont servis. C'est pour cela que la disponibilité du parc français se lit en dents de scie : haute en janvier, basse en été. Ce n'est pas un défaut, c'est le planning.`,
    indice:b=>b.hiverPerdu?"Un réacteur est à l'arrêt en plein hiver, quand les barres claires, les besoins, sont les plus hautes. Décale-le vers les beaux jours.":b.ensemble?"Les deux réacteurs sont arrêtés en même temps : le site ne produit plus rien ce mois-là. Sépare-les.":"Les deux arrêts se suivent sans pause. Les équipes de M. Planning ne se dédoublent pas : laisse un mois entre les deux."}]
};
function nucDefi(){
  Object.assign(NUC_ARRETS_ATELIER.etat,{a1:11,a2:0});
  voyDefi('nucleaire',NUC.defi=NUC.defi||{qui:'Mme Isotope',attente:NUC.dit.isotopeAttente,apres:NUC.dit.isotopeApres,
    entree:"Vous avez fait le tour. Bien. Six questions, puis une épreuve. Je vous préviens : si vous me dites que les tours fument, la visite recommence depuis le portique.",
    questions:NUC.questions,epreuves:voyAtelierEtapes(NUC_ARRETS_ATELIER),
    verdict:`<p><b>Mme Isotope :</b> « Vous savez ce qu'est une fission, pourquoi il faut trois circuits, ce que pèse un kWh français et à quoi sert un mois de mai. »</p><p>« La plupart des visiteurs repartent rassurés ou inquiets. Vous, vous repartez informé. C'est plus rare, et c'est plus utile. »</p>`,
    merci:"Tamponné, daté, contresigné. Vous repasserez le portique en sortant. Il ne sonnera pas. Il ne sonne jamais. C'est le but."});
}
