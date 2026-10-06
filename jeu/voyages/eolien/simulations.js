/* Wattlings · jeu/voyages/eolien/simulations.js
   Parc éolien de Port-Rafale : ce qui se manipule.
   1. « La courbe de puissance » (M. Rafale) : on règle le vent, on lit ce que produit l'éolienne.
   2. « Un an de vent » (Mme Bourrasque) : du vent moyen d'un site à son facteur de charge.
   3. « Du large à la prise » (Mlle Alizé, en mer) : le chemin du courant, à remettre dans l'ordre.
   4. Le défi de Mme Suroît : six questions, puis l'épreuve « Douze mois ».
   Les textes des missions sont ici, à côté de leurs règles ; les répliques des personnages sont dans textes.js. */

/* ================= LE MODÈLE : CE QUE PRODUIT UNE ÉOLIENNE ================= */
const EOL_MODELE={
  demarrage:3,nominale:13,coupure:25,          // les trois vitesses de la courbe de puissance, en m/s
  terre:{mw:3,nom:'3 MW, à terre'},mer:{mw:8,nom:'8 MW, en mer'},
  toursMin:6,toursMax:14
};
/* part de la pleine puissance (0 à 1) pour un vent donné : rien, puis le cube, puis le plateau, puis l'arrêt */
function eolPuissance(v){const M=EOL_MODELE;return v<M.demarrage||v>M.coupure?0:v>=M.nominale?1:(v**3-M.demarrage**3)/(M.nominale**3-M.demarrage**3)}
/* un an de vent sur un site dont on connaît la moyenne : heures passées à chaque vitesse (loi de Rayleigh), facteur de charge, temps à l'arrêt */
function eolAnnee(moyenne){
  const heures=[];let fc=0,arret=0,total=0;
  for(let v=.25;v<40;v+=.5){const f=Math.PI/2*v/moyenne/moyenne*Math.exp(-Math.PI/4*(v/moyenne)**2)*.5,p=eolPuissance(v);fc+=f*p;total+=f;if(!p)arret+=f;const k=Math.floor(v);heures[k]=(heures[k]||0)+f*8760}
  return{heures:heures.slice(0,27),fc:fc/total*100,arret:arret/total*100};
}

/* ================= 1. LA COURBE DE PUISSANCE ================= */
const EOL_COURBE={
  suivi:'La courbe de puissance',legende:"Puissance de l'éolienne selon la vitesse du vent",hauteur:230,
  etat:{v:0},
  reglages:[{id:'v',genre:'curseur',nom:'Vent à hauteur de nacelle',min:0,max:30,pas:.5,dire:v=>`${String(v).replace('.',',')} m/s · ${Math.round(v*3.6)} km/h`}],
  calcul:e=>{const p=eolPuissance(e.v),M=EOL_MODELE;return{p,kw:Math.round(p*3000/10)*10,tours:p?Math.min(M.toursMax,M.toursMin+(e.v-M.demarrage)/(M.nominale-M.demarrage)*(M.toursMax-M.toursMin)):0}},
  chiffres:(r,e)=>[[Math.round(e.v*3.6)+' km/h','de vent'],[fmt(r.kw)+' kW','produits',r.p>=1],[Math.round(r.p*100)+' %','de la pleine puissance'],[r.tours?String(Math.round(r.tours)):'0','tours par minute']],
  croquis:(cv,e,r)=>eolCroquis(cv,e.v,r),
  vues:[{id:'courbe',nom:'La courbe',graphe:(cv,r,e)=>{const P=[];for(let v=0;v<=30;v+=.25)P.push([v,eolPuissance(v)*3]);
    voyGraphe(cv,{x:[0,30],y:3.2,unite:'MW',gradY:[0,1,2,3],gradX:[0,5,10,15,20,25,30].map(v=>[v,v+' m/s']),series:[{p:P,c:VOY_ENCRE.reseau,genre:'aire',nom:"Puissance de l'éolienne"}],reperes:[{x:e.v,c:VOY_ENCRE.alerte,nom:'le vent du moment'}]})}}],
  missions:[
    {t:'Mission 1 · Le premier tour',x:"Pas de vent, pas de courant. Monte doucement : trouve le vent le plus faible qui fait produire l'éolienne.",
      ok:(r,e)=>e.v>=3&&e.v<=3.5,
      bravo:"3 m/s, soit 11 km/h : une petite brise, celle qui agite les feuilles. En dessous, il n'y a pas assez d'énergie pour vaincre les frottements. L'éolienne attend, face au vent.",
      indice:(r,e)=>e.v<3?"Rien ne bouge encore. Un peu plus de vent.":"Elle produit, mais elle a démarré plus tôt. Redescends jusqu'au tout premier kilowatt."},
    {t:'Mission 2 · La pleine puissance',x:"Les 3 MW de l'étiquette, elle ne les donne pas à la première brise. Trouve le vent le plus faible auquel elle produit à 100 %.",
      ok:(r,e)=>e.v===13,
      bravo:"13 m/s, soit 47 km/h : à ce vent-là, les parapluies se retournent. Regarde la courbe : entre 3 et 13 m/s, elle grimpe comme le cube du vent. Au-delà, les pales pivotent pour laisser filer le surplus : c'est le plateau.",
      indice:r=>r.p<1?"Pas encore à 100 %. Regarde la courbe : le plateau commence plus loin.":"Elle est à 100 %, mais elle y était déjà avec moins de vent. Redescends jusqu'au bord du plateau."},
    {t:'Mission 3 · La moitié',x:"Règle le vent pour que l'éolienne produise la moitié de sa puissance : 1 500 kW, à 100 kW près. Devine d'abord, vérifie ensuite.",
      ok:r=>Math.abs(r.kw-1500)<=100,
      bravo:"10,5 m/s : il faut 80 % du vent nominal pour obtenir 50 % de la puissance. Et à la moitié du vent nominal, 6,5 m/s, il n'en reste que 11 %. Voilà pourquoi un parc passe l'essentiel de son temps loin de sa puissance maximale.",
      indice:r=>r.kw<1400?`${fmt(r.kw)} kW : pas assez. La moitié de la puissance, ce n'est pas la moitié du vent : c'est plus loin.`:`${fmt(r.kw)} kW : trop. Un demi-mètre par seconde compte beaucoup dans cette zone.`},
    {t:'Essai libre · La tempête',libre:1,bouton:'Rendre le pupitre',x:"Dernière chose à voir. Pousse le vent au-delà de 25 m/s, comme un jour de tempête.",
      fini:(r,e)=>e.v>25,
      constat:(r,e)=>e.v>25?"Au-delà de 25 m/s, soit 90 km/h, l'éolienne se protège : elle met ses pales en drapeau, dans le lit du vent, et s'arrête. Production : zéro. Les jours de tempête sont de très mauvais jours pour un parc éolien. Les jours de grand vent régulier, juste en dessous, sont les meilleurs.":''}]
};
function eolSimCourbe(fin){trk('voyage_sim',{site:'eolien',sim:'courbe'});EOL_COURBE.etat.v=0;voyAtelier('La courbe de puissance',EOL_COURBE,()=>{voyEtat().faits['eolien.courbe']=1;save();if(fin)fin()})}
/* le croquis : l'éolienne, des traits de vent d'autant plus nombreux qu'il souffle, un drapeau */
function eolCroquis(cv,v,r){
  const c=cv.getContext('2d');c.clearRect(0,0,240,150);c.fillStyle='#dcecf5';c.fillRect(0,0,240,150);c.fillStyle='#5fae6a';c.fillRect(0,128,240,22);
  const n=Math.min(9,Math.round(v/3));for(let i=0;i<n;i++){const y=18+i*12,l=18+v*2;c.fillStyle='rgba(60,90,130,.45)';c.fillRect(8+(i%3)*14,y,l,2);c.fillRect(150+(i%2)*12,y+5,l*.7,2)}
  c.save();c.translate(120,128);c.scale(1.5,1.5);
  if(v>25){eolDessiner(c,0,0,58,24,-Math.PI/2,3);c.restore();c.fillStyle='#c43d3d';c.font='bold 13px "Atkinson Hyperlegible",system-ui,sans-serif';c.textAlign='center';c.fillText('pales en drapeau : arrêt',120,146)}
  else{eolDessiner(c,0,0,58,24,r.tours?v*1.3:.5,3);c.restore();if(!r.tours){c.fillStyle='#1c2440';c.font='13px "Atkinson Hyperlegible",system-ui,sans-serif';c.textAlign='center';c.fillText("pas assez de vent : à l'arrêt",120,146)}}
}

/* ================= 2. UN AN DE VENT ================= */
const EOL_PARI=(()=>{const mer=EOL_MODELE.mer.mw*8.76*eolAnnee(9).fc/100;return{mer,cinq:eolAnnee(5).fc}})();   // ce que produit une machine de 8 MW par 9 m/s (GWh/an) ; le facteur de charge à 5 m/s
const EOL_VENT={
  suivi:'Un an de vent',legende:"Heures par an passées à chaque vitesse de vent, et courbe de puissance",hauteur:240,
  etat:{vm:5,n:1},
  reglages:[
    {id:'vm',genre:'curseur',nom:'Vent moyen du site, à hauteur de nacelle',min:4,max:11,pas:.5,dire:v=>`${String(v).replace('.',',')} m/s`},
    {id:'n',genre:'curseur',nom:'Nombre d\'éoliennes de 3 MW',min:1,max:12,pas:1,dire:v=>v+(v>1?' machines':' machine')}],
  calcul:e=>{const a=eolAnnee(e.vm);a.gwh=e.n*EOL_MODELE.terre.mw*8.76*a.fc/100;return a},
  chiffres:(r,e)=>[[r.fc.toFixed(1).replace('.',',')+' %','facteur de charge'],[fmt(Math.round(r.fc*87.6/10)*10)+' h','par an « à pleine puissance »'],[r.gwh.toFixed(1).replace('.',',')+' GWh',`par an (${e.n} machine${e.n>1?'s':''})`],[Math.round(r.arret)+' %','du temps à l\'arrêt']],
  vues:[{id:'an',nom:"L'année",graphe:(cv,r)=>voyGraphe(cv,{x:[-.6,26.6],y:1800,unite:'heures par an',gradY:[0,500,1000,1500],gradX:[0,5,10,15,20,25].map(v=>[v+.0,v+' m/s']),
    series:[{p:r.heures.map((h,v)=>[v+.5,h]),c:VOY_ENCRE.reseau,genre:'barres',nom:'Heures à cette vitesse',l:16},{p:Array.from({length:105},(x,i)=>[i/4,eolPuissance(i/4)*1650]),c:VOY_ENCRE.soleil,genre:'ligne',nom:'Courbe de puissance (de 0 à 100 %)'}]})}],
  missions:[
    {t:'Mission 1 · Un parc qui se finance',reglages:['vm'],depart:{vm:5,n:12},
      x:"Les barres bleues : le nombre d'heures par an passées à chaque vitesse de vent. La ligne orange : ce que l'éolienne en tire. La banque ne prête que si le facteur de charge atteint 25 %, à un point près. Quel vent moyen faut-il sur le site ?",
      ok:r=>Math.abs(r.fc-25)<=1,
      bravo:"7 m/s de moyenne à cent mètres du sol : c'est la lande de Port-Rafale. Sur l'année, le parc produit comme s'il tournait à pleine puissance un jour sur quatre. Remarque que le vent le plus fréquent, lui, ne fait presque rien produire : l'essentiel de l'énergie vient des jours de bon vent.",
      indice:r=>r.fc<24?`${r.fc.toFixed(1).replace('.',',')} % : la banque dit non. Il faut un site plus venté.`:`${r.fc.toFixed(1).replace('.',',')} % : c'est mieux que demandé, mais ce n'est pas la question. Cherche le site qui donne juste 25 %.`},
    {t:'Mission 2 · Un mètre par seconde',reglages:['vm'],depart:{vm:5,n:12},
      x:`À 5 m/s de moyenne, le facteur de charge n'est que de ${EOL_PARI.cinq.toFixed(1).replace('.',',')} %. Trouve le vent moyen qui double la production du parc.`,
      ok:r=>r.fc>=EOL_PARI.cinq*1.9&&r.fc<=EOL_PARI.cinq*2.25,
      bravo:"De 5 à 6,5 m/s : 30 % de vent en plus, deux fois plus d'énergie. Un écart qu'on ne sent même pas sur le visage. C'est pour cela qu'on plante un mât de mesure pendant un an avant de planter quoi que ce soit d'autre.",
      indice:r=>r.fc<EOL_PARI.cinq*1.9?"Pas encore le double. Monte un peu.":"C'est plus que le double. La réponse est plus près que tu ne crois."},
    {t:'Mission 3 · Terre contre mer',reglages:['n'],depart:{vm:7,n:1},
      x:`Au large de Port-Rafale, le vent moyen est de 9 m/s. Une seule éolienne de 8 MW y produit ${Math.round(EOL_PARI.mer)} GWh par an. Sur la lande, à 7 m/s, combien de machines de 3 MW faut-il, au minimum, pour faire aussi bien ?`,
      ok:(r,e)=>r.gwh>=EOL_PARI.mer&&(e.n-1)*r.gwh/e.n<EOL_PARI.mer,
      bravo:"Cinq machines à terre pour une seule en mer. Elle est presque trois fois plus puissante, et le vent du large la fait tourner bien plus souvent à plein régime : 40 % de facteur de charge au lieu de 25. C'est ce qui paie les bateaux, le béton et le sel.",
      indice:(r,e)=>r.gwh<EOL_PARI.mer?`${r.gwh.toFixed(1).replace('.',',')} GWh : il en manque. Ajoute des machines.`:"C'est assez, mais il y en a trop : on demande le minimum."}]
};
function eolSimVent(fin){trk('voyage_sim',{site:'eolien',sim:'vent'});voyAtelier('Un an de vent',EOL_VENT,()=>{voyEtat().faits['eolien.vent']=1;save();if(fin)fin()})}

/* ================= 3. DU LARGE À LA PRISE ================= */
const EOL_CHEMIN=["Le vent fait tourner les pales","La génératrice, dans la nacelle, produit le courant","Un câble posé au fond relie les éoliennes, à 66 000 volts","Le poste en mer élève la tension à 225 000 volts","La double liaison sous-marine, puis souterraine","Le poste à terre et le réseau de RTE","Ta prise"];
function eolSimChemin(fin){
  trk('voyage_sim',{site:'eolien',sim:'chemin'});
  voyEtapes('Du large à la prise',[order({title:'Le chemin du courant',ctx:"<b>Mlle Alizé :</b> « Sept étapes entre le vent et ta prise. Clique-les dans l'ordre. Un indice : on élève la tension avant le long voyage, jamais après. »",
    q:'Par où passe le courant ?',items:EOL_CHEMIN,okMsg:"Exact. On monte à 225 000 volts avant de traverser : plus la tension est haute, moins on perd en route. C'est vrai sous la mer comme sur les pylônes de ta ville."})],
    ()=>{voyEtat().faits['eolien.chemin']=1;save();if(fin)fin()},{plusTard:true});
}

/* ================= 4. LE DÉFI DE MME SUROÎT ================= */
/* l'épreuve « Douze mois » : quel dosage d'éolien et de solaire colle le mieux à la consommation, mois par mois */
const EOL_MOIS={
  part:.3,objectif:4.5,                                                   // on vise 30 % de la consommation ; moins de 4,5 % de production mal placée
  conso:[52,46,44,36,33,31,33,30,32,37,43,50],                           // la consommation du territoire, mois par mois (profil français, hiver fort)
  vent:[.33,.35,.28,.22,.17,.10,.13,.13,.17,.24,.28,.32],                 // facteur de charge de l'éolien, mois par mois
  soleil:[60,79,118,139,160,174,190,177,138,100,64,52],                   // production d'un kWc de solaire, mois par mois
  mois:['J','F','M','A','M','J','J','A','S','O','N','D']
};
function eolMoisBilan(a){
  const M=EOL_MOIS,S=t=>t.reduce((x,y)=>x+y,0),E=M.part*S(M.conso),sv=S(M.vent),ss=S(M.soleil);let ecart=0;
  const vise=M.conso.map(d=>d*M.part),vent=M.vent.map(w=>E*a/100*w/sv),soleil=M.soleil.map(s=>E*(1-a/100)*s/ss);
  vise.forEach((c,m)=>{ecart+=Math.abs(vent[m]+soleil[m]-c)});
  const couv=L=>Math.round(L.reduce((t,m)=>t+(vent[m]+soleil[m])/vise[m],0)/L.length*100);
  return{vise,vent,soleil,malPlace:ecart/E*50,hiver:couv([0,1,10,11]),ete:couv([5,6,7])};
}
const EOL_MOIS_ATELIER={
  suivi:'Douze mois',legende:'Production éolienne et solaire face aux besoins, mois par mois',hauteur:250,grapheEnHaut:true,
  etat:{a:0},
  reglages:[{id:'a',genre:'curseur',nom:'Le dosage',min:0,max:100,pas:10,dire:v=>`${v} % d'éolien · ${100-v} % de solaire`}],
  calcul:e=>eolMoisBilan(e.a),
  chiffres:b=>[[b.malPlace.toFixed(1).replace('.',',')+' %',`de la production tombe au mauvais mois (objectif : moins de ${String(EOL_MOIS.objectif).replace('.',',')} %)`,b.malPlace<=EOL_MOIS.objectif],[b.hiver+' %','des besoins visés couverts de novembre à février'],[b.ete+' %','de juin à août']],
  vues:[{id:'an',nom:"L'année",graphe:(cv,b)=>voyGraphe(cv,{x:[-.6,11.6],y:20,unite:'énergie',gradY:[0,5,10,15],gradX:EOL_MOIS.mois.map((l,i)=>[i,l]),
    series:[{p:b.vise.map((v,i)=>[i,v]),c:VOY_ENCRE.repere,genre:'barres',nom:'Besoins visés',l:36},{p:b.vent.map((v,i)=>[i,v]),c:VOY_ENCRE.reseau,genre:'barres',nom:'Éolien',l:22},{p:b.soleil.map((v,i)=>[i,v]),base:b.vent,c:VOY_ENCRE.soleil,genre:'barres',nom:'Solaire',l:22}]})}],
  missions:[{t:'Dernière épreuve · Douze mois',bouton:'Valider le dosage',xp:25,
    html:`<b>Mme Suroît :</b> « La région veut couvrir 30 % de sa consommation avec du vent et du soleil. Tu as un seul curseur : la part de chacun. Trouve le dosage qui colle le mieux aux besoins, mois après mois. Je veux moins de <b>${String(EOL_MOIS.objectif).replace('.',',')} %</b> de production au mauvais moment. »`,
    ok:b=>b.malPlace<=EOL_MOIS.objectif,
    bravo:(b,e)=>`${e.a} % d'éolien, ${100-e.a} % de solaire : l'un donne l'hiver, l'autre l'été. Seul, le solaire ne couvre que 43 % des besoins d'hiver et déborde de 80 % en été ; seul, l'éolien manque de moitié en juin. Reste un problème que ce graphique ne montre pas : la semaine de janvier sans vent ni soleil. Celle-là, ce sont les barrages et les centrales qui la passent. Il y a un train pour ça.`,
    indice:(b,e)=>b.ete>115?`${b.malPlace.toFixed(1).replace('.',',')} % : trop de production en été, pas assez en hiver. Qui produit l'hiver ?`:`${b.malPlace.toFixed(1).replace('.',',')} % : l'hiver est couvert, mais l'été manque. Remets un peu de solaire.`}]
};
function eolDefi(){
  EOL_MOIS_ATELIER.etat.a=0;
  voyDefi('eolien',EOL.defi=EOL.defi||{qui:'Mme Suroît',attente:EOL.dit.suroitAttente,apres:EOL.dit.suroitApres,
    entree:"Tu as vu la lande et le large ? Bien. Six questions, puis une épreuve. Si tu me dis qu'une offre verte livre des électrons verts, je garde le tampon et je préviens Mme Origine.",
    questions:EOL.questions,epreuves:voyAtelierEtapes(EOL_MOIS_ATELIER),
    verdict:`<p><b>Mme Suroît :</b> « Tu sais ce que vaut un mètre par seconde, pourquoi un parc de 36 MW n'en produit pas 36, et ce qu'on achète vraiment avec une offre verte. »</p><p>« La plupart des visiteurs repartent en disant que ça tourne lentement. Toi, tu sais à quelle vitesse va le bout de la pale. »</p>`,
    merci:"Tiens bien ton passeport en sortant. Le dernier visiteur a couru derrière le sien jusqu'à la grève."});
}
