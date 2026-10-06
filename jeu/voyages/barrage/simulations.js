/* Wattlings · jeu/voyages/barrage/simulations.js
   Barrage de Val-Turbine : ce qui se manipule.
   1. « Débit × hauteur » (M. Newton) : deux curseurs, une puissance.
   2. « Quelle turbine ? » (Mlle Pelton) : trois chantiers, trois turbines.
   3. Le défi de Mme Lachute : six questions, puis l'épreuve « 24 heures de STEP ».
   Les textes des missions sont ici, à côté de leurs règles ; les répliques des personnages sont dans textes.js. */

/* ================= 1. DÉBIT × HAUTEUR ================= */
const BAR_CHUTE={
  rendement:.9,
  hauteurs:[5,10,20,30,50,100,200,300,400,600,900,1200],      // les crans du curseur de hauteur, en mètres
  debits:[1,2,5,10,20,40,80,150,300,500],                     // les crans du curseur de débit, en m³ par seconde
  turbine:h=>h>300?'Pelton':h>=30?'Francis':'Kaplan'
};
const barPuissance=(q,h)=>9.81*q*h*BAR_CHUTE.rendement/1000;     // en MW
const barMW=p=>p<1?Math.round(p*1000)+' kW':p<10?p.toFixed(1).replace('.',',')+' MW':fmt(Math.round(p))+' MW';
const BAR_ATELIER={
  suivi:'Débit × hauteur',legende:"Puissance selon le débit, pour la hauteur choisie",hauteur:220,
  etat:{ih:3,iq:3},
  reglages:[
    {id:'ih',genre:'curseur',nom:'Hauteur de chute',min:0,max:BAR_CHUTE.hauteurs.length-1,pas:1,dire:v=>fmt(BAR_CHUTE.hauteurs[v])+' m'},
    {id:'iq',genre:'curseur',nom:'Débit',min:0,max:BAR_CHUTE.debits.length-1,pas:1,dire:v=>BAR_CHUTE.debits[v]+' m³ par seconde'}],
  calcul:e=>{const h=BAR_CHUTE.hauteurs[e.ih],q=BAR_CHUTE.debits[e.iq];return{h,q,p:barPuissance(q,h),kwh:9.81*h*BAR_CHUTE.rendement/3600,bars:h/10}},
  chiffres:r=>[[barMW(r.p),'de puissance'],[r.kwh.toFixed(2).replace('.',',')+' kWh','par mètre cube turbiné'],[r.bars<10?r.bars.toFixed(1).replace('.',','):Math.round(r.bars)+'',"bars au pied de la conduite"],[BAR_CHUTE.turbine(r.h),'la turbine adaptée']],
  croquis:(cv,e,r)=>barCroquis(cv,r),
  vues:[{id:'p',nom:'La puissance',graphe:(cv,r)=>{const m=barPuissance(500,r.h),y=m>500?Math.ceil(m/1000)*1000:m>50?Math.ceil(m/100)*100:m>5?Math.ceil(m/10)*10:Math.ceil(m);
    voyGraphe(cv,{x:[0,520],y:y*1.05,unite:'MW',gradY:[0,y/2,y],gradX:[0,100,200,300,400,500].map(v=>[v,String(v)]),series:[{p:[[0,0],[500,m]],c:VOY_ENCRE.reseau,genre:'aire',nom:`Puissance pour ${fmt(r.h)} m de chute, selon le débit (m³/s)`}],reperes:[{x:r.q,c:VOY_ENCRE.alerte,nom:barMW(r.p)}]})}}],
  missions:[
    {t:'Mission 1 · Val-Turbine',x:"L'usine de Val-Turbine exploite une chute de 600 mètres. Règle la hauteur, puis trouve le débit qui lui fait produire 420 MW, à 10 MW près.",
      ok:r=>r.h===600&&Math.abs(r.p-420)<=10,
      bravo:"80 m³ par seconde : quatre-vingts tonnes d'eau, chaque seconde, qui tombent de 600 mètres. Au pied de la conduite, la pression atteint 60 bars. Et chaque mètre cube ne rend qu'un kilowattheure et demi : il en faut vraiment beaucoup.",
      indice:r=>r.h!==600?"Commence par régler la hauteur : 600 mètres, c'est le dénivelé entre le lac et l'usine.":r.p<420?`${barMW(r.p)} : il manque de l'eau. Augmente le débit.`:`${barMW(r.p)} : c'est trop. La conduite n'est pas si grosse.`},
    {t:'Mission 2 · Le fleuve',x:"Changement de décor : une usine au fil de l'eau, sur un grand fleuve. La chute ne fait que 10 mètres. Quel débit faut-il pour produire environ 44 MW ?",
      ok:r=>r.h===10&&Math.abs(r.p-44)<=5,
      bravo:"500 m³ par seconde : une piscine olympique toutes les cinq secondes. Soixante fois moins de hauteur qu'à Val-Turbine, alors il faut énormément d'eau pour une puissance dix fois plus petite. C'est l'autre façon de faire de l'hydraulique, avec des turbines Kaplan, de grosses hélices.",
      indice:r=>r.h!==10?"La chute ne fait que 10 mètres : règle d'abord la hauteur.":`${barMW(r.p)} : pas encore. Avec si peu de hauteur, il faut ouvrir en grand.`},
    {t:'Mission 3 · Un kilowattheure',x:"Dernière question de M. Newton : de quelle hauteur un mètre cube d'eau doit-il tomber pour rendre 1 kWh, à 5 % près ? Le débit n'y change rien : regarde le deuxième chiffre.",
      ok:r=>Math.abs(r.kwh-1)<=.05,
      bravo:"400 mètres : plus haut que la tour Eiffel, pour un seul kilowattheure par tonne d'eau, soit une vingtaine de centimes. C'est le chiffre à garder en tête quand on parle de stocker de l'électricité avec de l'eau : ça marche, à condition d'avoir une montagne.",
      indice:r=>r.kwh<1?`${r.kwh.toFixed(2).replace('.',',')} kWh par mètre cube : il faut tomber de plus haut.`:`${r.kwh.toFixed(2).replace('.',',')} kWh : c'est plus qu'il n'en faut. Redescends un peu.`}]
};
function barSimChute(fin){trk('voyage_sim',{site:'barrage',sim:'chute'});Object.assign(BAR_ATELIER.etat,{ih:3,iq:3});voyAtelier('Débit × hauteur',BAR_ATELIER,()=>{voyEtat().faits['barrage.chute']=1;save();if(fin)fin()})}
/* le croquis : le lac en haut, la conduite, l'usine en bas. La hauteur du lac et la grosseur du tuyau suivent les curseurs */
function barCroquis(cv,r){
  const c=cv.getContext('2d'),H=BAR_CHUTE.hauteurs,Q=BAR_CHUTE.debits,th=Math.log(r.h/H[0])/Math.log(H[H.length-1]/H[0]),tq=Math.log(r.q/Q[0])/Math.log(Q[Q.length-1]/Q[0]);
  c.clearRect(0,0,240,150);c.fillStyle='#dcecf5';c.fillRect(0,0,240,150);
  const haut=118-th*92,e=2+tq*9;
  c.fillStyle='#8a93a8';c.beginPath();c.moveTo(0,150);c.lineTo(0,haut-6);c.lineTo(70,haut-6);c.lineTo(86,haut+4);c.lineTo(190,128);c.lineTo(240,128);c.lineTo(240,150);c.fill();
  c.fillStyle='#3aa0b8';c.fillRect(6,haut-4,62,9);c.fillStyle='#e0f4f6';c.fillRect(6,haut-4,62,2);c.fillStyle='#cfcabb';c.fillRect(66,haut-10,7,18);
  c.strokeStyle='#3f6b52';c.lineWidth=e;c.lineCap='round';c.beginPath();c.moveTo(76,haut+2);c.lineTo(182,122);c.stroke();c.lineCap='butt';
  c.fillStyle='#d9d5c8';c.fillRect(180,110,34,20);c.fillStyle='#59627c';c.fillRect(178,106,38,5);c.fillStyle='#3aa0b8';c.fillRect(214,126,26,4);
  c.fillStyle='#1c2440';c.font='13px "Atkinson Hyperlegible",system-ui,sans-serif';c.textAlign='left';c.textBaseline='middle';c.fillText(fmt(r.h)+' m',150,Math.max(12,haut+2));c.fillText(BAR_CHUTE.turbine(r.h),182,142);
  c.strokeStyle='#1c2440';c.lineWidth=1;c.setLineDash([3,3]);c.beginPath();c.moveTo(140,haut);c.lineTo(140,128);c.stroke();c.setLineDash([]);
}

/* ================= 2. QUELLE TURBINE ? ================= */
function barSimTurbines(fin){
  trk('voyage_sim',{site:'barrage',sim:'turbines'});
  const T=bonne=>[['Pelton : une roue à augets, frappée par un jet',bonne==='P',bonne==='P'?'Haute chute, débit modéré : le jet fait tout.':'Il lui faut un jet à très haute pression : une haute chute.'],['Francis : une roue noyée dans une bâche en spirale',bonne==='F',bonne==='F'?'Chute moyenne : c\'est la turbine la plus répandue au monde.':'Elle est faite pour les chutes moyennes, entre 30 et 300 mètres.'],['Kaplan : une grande hélice à pales orientables',bonne==='K',bonne==='K'?'Basse chute, gros débit : on avale le fleuve.':'Une hélice ne résisterait pas à une haute chute.']];
  voyEtapes('Quelle turbine ?',[form({title:'Trois chantiers sur le bureau de Mlle Pelton',ctx:"<b>Mlle Pelton :</b> « Regarde la hauteur d'abord, le débit ensuite. »",
    fields:[{label:'Val-Turbine : 600 m de chute, 80 m³/s',opts:T('P')},{label:'Un barrage de moyenne montagne : 90 m de chute, 200 m³/s',opts:T('F')},{label:'Une usine sur le fleuve : 10 m de chute, 500 m³/s',opts:T('K')}],
    okMsg:"Trois sur trois. C'est la hauteur de chute qui décide : au-delà de 300 mètres une Pelton, en dessous de 30 une Kaplan, une Francis entre les deux."})],
    ()=>{voyEtat().faits['barrage.turbines']=1;save();if(fin)fin()},{plusTard:true});
}

/* ================= 3. LE DÉFI DE MME LACHUTE ================= */
/* l'épreuve « 24 heures de STEP » : huit tranches de trois heures ; à chacune, pomper, attendre ou turbiner */
const BAR_STEP={
  prix:[40,35,95,60,5,30,140,80],        // prix de l'électricité, en €/MWh, pour chaque tranche de 3 heures
  achat:600,vente:480,                   // MWh consommés par une tranche de pompage, rendus par une tranche de turbinage (rendement : 80 %)
  depart:1,plein:3,                      // niveau du lac au départ et niveau maximal, en « tranches » d'eau
  objectif:90000                         // recette à atteindre, en euros
};
function barStepBilan(e){
  const S=BAR_STEP;let niveau=S.depart,recette=0,erreur=null,achete=0,vendu=0;const niveaux=[];
  S.prix.forEach((p,i)=>{const a=e['b'+i];
    if(a==='p'){if(niveau>=S.plein){if(erreur===null)erreur=[i,'plein']}else{niveau++;recette-=S.achat*p;achete+=S.achat}}
    else if(a==='t'){if(niveau<=0){if(erreur===null)erreur=[i,'vide']}else{niveau--;recette+=S.vente*p;vendu+=S.vente}}
    niveaux.push(niveau)});
  return{niveaux,recette,erreur,fin:niveau,achete,vendu};
}
const BAR_STEP_ATELIER={
  suivi:'24 heures de STEP',legende:"Prix de l'électricité et niveau du lac sur 24 heures",hauteur:240,grapheEnHaut:true,
  etat:Object.fromEntries(BAR_STEP.prix.map((p,i)=>['b'+i,'a'])),
  reglages:BAR_STEP.prix.map((p,i)=>({id:'b'+i,genre:'choix',nom:`${i*3} h – ${i*3+3} h · ${p} €/MWh`,options:[['p','Pomper'],['a','Attendre'],['t','Turbiner']]})),
  calcul:e=>Object.assign(barStepBilan(e),{actions:BAR_STEP.prix.map((p,i)=>e['b'+i])}),
  chiffres:b=>[[fmt(Math.round(b.recette/1000))+' k€',`de recette (objectif : ${fmt(BAR_STEP.objectif/1000)} k€)`,b.recette>=BAR_STEP.objectif&&!b.erreur&&b.fin>=BAR_STEP.depart],[b.fin+' / '+BAR_STEP.plein,`niveau du lac à minuit (départ : ${BAR_STEP.depart})`,b.fin>=BAR_STEP.depart],[fmt(b.achete)+' MWh','achetés pour pomper'],[fmt(b.vendu)+' MWh','vendus en turbinant']],
  vues:[{id:'j',nom:'La journée',graphe:(cv,b)=>{const P=BAR_STEP.prix,serie=a=>P.map((p,i)=>[i*3+1.5,b.actions[i]===a?p:0]);
    voyGraphe(cv,{x:[0,24],y:160,unite:'€/MWh',gradY:[0,50,100,150],gradX:[0,3,6,9,12,15,18,21,24].map(h=>[h,h+' h']),
      series:[{p:serie('a'),c:VOY_ENCRE.repere,genre:'barres',nom:'Attendre',l:52},{p:serie('p'),c:VOY_ENCRE.reseau,genre:'barres',nom:'Pomper',l:52},{p:serie('t'),c:VOY_ENCRE.soleil,genre:'barres',nom:'Turbiner',l:52},
        {p:[[0,BAR_STEP.depart*50],...b.niveaux.map((n,i)=>[i*3+3,n*50])],c:VOY_ENCRE.conso,genre:'ligne',nom:'Niveau du lac'}]})}}],
  missions:[{t:'Dernière épreuve · 24 heures de STEP',bouton:'Valider la journée',xp:25,
    html:`<b>Mme Lachute :</b> « Voici les prix de demain, par tranches de trois heures. Le lac est au tiers. Pomper une tranche coûte 600 MWh et le remonte d'un cran ; turbiner une tranche le fait redescendre et rend 480 MWh. Il ne peut ni déborder ni se vider, et je veux le retrouver à minuit au moins aussi haut que ce matin. Rapporte-moi <b>${fmt(BAR_STEP.objectif)} €</b>. »`,
    ok:b=>!b.erreur&&b.fin>=BAR_STEP.depart&&b.recette>=BAR_STEP.objectif,
    bravo:b=>`${fmt(b.recette)} € en une journée, en déplaçant de l'eau. Tu as acheté ${fmt(b.achete)} MWh et tu n'en as revendu que ${fmt(b.vendu)} : un cinquième s'est perdu en route. Et pourtant tu gagnes, parce qu'à 19 h le mégawattheure vaut vingt-huit fois celui de 13 h. Une STEP ne produit pas d'énergie : elle la déplace vers l'heure où elle manque.`,
    indice:b=>b.erreur?`Entre ${b.erreur[0]*3} h et ${b.erreur[0]*3+3} h, le lac est déjà ${b.erreur[1]==='plein'?'plein : impossible de pomper davantage':'vide : plus rien à turbiner'}. Regarde la ligne verte.`:b.fin<BAR_STEP.depart?"À minuit, le lac est plus bas que ce matin : tu as vendu de l'eau que tu n'avais pas remontée. Mme Lachute compte.":`${fmt(b.recette)} € : pas assez. Pompe aux deux creux de la journée, la nuit et en début d'après-midi ; turbine aux deux pointes, le matin et le soir.`}]
};
function barDefi(){
  BAR_STEP.prix.forEach((p,i)=>{BAR_STEP_ATELIER.etat['b'+i]='a'});
  voyDefi('barrage',BAR.defi=BAR.defi||{qui:'Mme Lachute',attente:BAR.dit.lachuteAttente,apres:BAR.dit.lachuteApres,
    entree:"Tu es monté jusqu'au barrage ? À pied ? Bien. Six questions, puis une journée aux commandes de la STEP. Si tu vides mon lac, tu le remplis au seau.",
    questions:BAR.questions,epreuves:voyAtelierEtapes(BAR_STEP_ATELIER),
    verdict:`<p><b>Mme Lachute :</b> « Tu sais d'où vient la puissance, pourquoi un lac vaut plus qu'un fleuve à 19 h, et comment on gagne sa vie en perdant 20 % d'énergie. »</p><p>« Les touristes repartent avec une photo du lac. Toi, tu sais combien de gigawattheures il y a sur la photo. »</p>`,
    merci:"Voilà ton tampon. Redescends par le sentier, pas par la conduite. On a déjà eu la question."});
}
