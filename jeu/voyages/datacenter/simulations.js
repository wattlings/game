/* Wattlings · jeu/voyages/datacenter/simulations.js
   Data center du quai des Octets : ce qui se manipule.
   1. « Le PUE » (Mme Ratio) : un jumeau numérique du site, quatre leviers, trois missions.
   2. « La chasse aux zombies » (Mlle Octet) : huit serveurs, lesquels débrancher ?
   3. Le défi de Mme Quatreneuf : six questions, puis l'épreuve « Coupure à 3 h du matin ».
   Les textes des missions sont ici, à côté de leurs règles ; les répliques des personnages sont dans textes.js. */

/* ================= 1. LE PUE ================= */
const DAT_PUE={
  informatique:10,          // MW de serveurs à pleine charge
  froid:.6,                 // MW de froid par MW de serveurs, salle à 18 °C, sans rien d'autre
  parDegre:.04,             // chaque degré de consigne au-dessus de 18 °C retire 4 % de ce froid
  confinement:.8,           // allées séparées : 20 % de froid en moins
  galerie:.45,              // eau de galerie à la place des groupes froids : plus de la moitié en moins
  pertes:[.06,.25],         // onduleurs et transformateurs : part de la charge, plus une part fixe (MW)
  pertesEco:[.03,.15],      // les mêmes, onduleurs en mode économe
  divers:.15                // éclairage, bureaux, sûreté (MW)
};
function datPue(e){
  const M=DAT_PUE,it=M.informatique*e.charge/100,froid=it*M.froid*(1-M.parDegre*(e.temp-18))*(e.conf?M.confinement:1)*(e.gal?M.galerie:1),p=e.eco?M.pertesEco:M.pertes,pertes=it*p[0]+p[1];
  return{it,froid,pertes,divers:M.divers,total:it+froid+pertes+M.divers,pue:(it+froid+pertes+M.divers)/it};
}
const DAT_PUE_ATELIER={
  suivi:'Le PUE',legende:"Où va l'électricité du site",hauteur:220,
  etat:{temp:18,conf:false,gal:false,eco:false,charge:100},
  reglages:[
    {id:'temp',genre:'curseur',nom:"Consigne d'air en entrée des serveurs",min:18,max:27,pas:1,dire:v=>v+' °C'},
    {id:'conf',genre:'case',nom:'Séparer les allées chaudes et froides',note:"Des portes et un toit sur les allées : l'air froid ne se mélange plus à l'air chaud."},
    {id:'gal',genre:'case',nom:"Refroidir avec l'eau de la galerie",note:"De l'eau à 15 °C toute l'année, à la place des groupes froids."},
    {id:'eco',genre:'case',nom:'Onduleurs en mode économe',note:"Ils ne convertissent le courant que lorsque c'est nécessaire : moins de pertes, surtout à faible charge."}],
  calcul:datPue,
  chiffres:r=>[[r.pue.toFixed(2).replace('.',','),'PUE'],[r.total.toFixed(1).replace('.',',')+' MW','au compteur'],[r.froid.toFixed(1).replace('.',',')+' MW','pour le froid'],[Math.round((r.total-r.it)*8.76)+' GWh','par an qui ne calculent rien']],
  vues:[{id:'b',nom:'Les postes',graphe:(cv,r)=>voyGraphe(cv,{x:[-.6,3.6],y:11,unite:'MW',gradY:[0,2,4,6,8,10],gradX:[[0,'Serveurs'],[1,'Froid'],[2,'Pertes électriques'],[3,'Divers']],
    series:[{p:[[0,r.it]],c:VOY_ENCRE.reseau,genre:'barres',l:70},{p:[[1,r.froid]],c:VOY_ENCRE.conso,genre:'barres',l:70},{p:[[2,r.pertes]],c:VOY_ENCRE.soleil,genre:'barres',l:70},{p:[[3,r.divers]],c:VOY_ENCRE.prevu,genre:'barres',l:70}]})}],
  missions:[
    {t:"Mission 1 · Le data center d'il y a quinze ans",reglages:['temp','conf','eco'],depart:{temp:18,conf:false,gal:false,eco:false,charge:100},
      x:"Salle à 18 °C, air chaud et air froid mélangés, groupes froids à fond. PUE : 1,70. Fais-le descendre sous 1,50, sans toucher au mode de refroidissement.",
      ok:r=>r.pue<1.5,
      bravo:"Deux gestes qui ne coûtent presque rien : remonter la consigne et séparer les allées. Pendant des années, on a climatisé des salles entières à 18 °C pour des machines qui en supportent 27. C'est exactement ce qui se passe encore dans beaucoup de locaux serveurs de mairies.",
      indice:r=>`PUE ${r.pue.toFixed(2).replace('.',',')} : pas encore. Les serveurs acceptent un air bien plus chaud que 18 °C, et l'air froid n'a aucune raison de se mélanger au chaud.`},
    {t:'Mission 2 · Le site du quai des Octets',reglages:['temp','conf','gal','eco'],
      x:"Tu peux maintenant utiliser l'eau de la galerie. Objectif : un PUE inférieur à 1,30, celui du site réel.",
      ok:r=>r.pue<1.3,
      bravo:"Sous 1,30 : c'est le froid « gratuit » qui fait la différence. Quand on peut refroidir avec de l'eau fraîche ou de l'air extérieur, on n'a plus besoin de fabriquer le froid, seulement de le faire circuler. Regarde ce qui reste : ce sont surtout les pertes électriques.",
      indice:r=>`PUE ${r.pue.toFixed(2).replace('.',',')}. Le plus gros poste après les serveurs reste le froid : il y a mieux à faire que de le produire avec des compresseurs.`},
    {t:'Mission 3 · La salle au tiers vide',reglages:['temp','conf','gal','eco'],depart:{temp:22,conf:true,gal:true,eco:false,charge:30},
      x:"Un gros client est parti : la salle ne tourne plus qu'à 30 % de sa charge. Regarde le PUE : il a monté, alors que rien n'a changé dans les réglages. Ramène-le sous 1,33.",
      ok:r=>r.pue<1.33,
      bravo:"À faible charge, ce sont les consommations fixes qui pèsent : des onduleurs dimensionnés pour 10 MW perdent presque autant à 3 MW. Un équipement surdimensionné est inefficace quand il tourne loin de sa puissance : c'est vrai pour un data center, une chaudière ou une centrale de traitement d'air.",
      indice:r=>`PUE ${r.pue.toFixed(2).replace('.',',')}. Le froid a déjà beaucoup baissé avec la charge. Regarde la barre orange : elle, elle n'a presque pas bougé.`}]
};
function datSimPue(fin){trk('voyage_sim',{site:'datacenter',sim:'pue'});voyAtelier('Le PUE',DAT_PUE_ATELIER,()=>{voyEtat().faits['datacenter.pue']=1;save();if(fin)fin()})}

/* ================= 2. LA CHASSE AUX ZOMBIES ================= */
/* [ce qu'on lit dans la supervision, faut-il le débrancher ?, pourquoi] */
const DAT_SERVEURS=[
  ["SRV-COMPTA-2011 · 3 % de processeur · aucune connexion depuis 14 mois",true,"Quatorze mois sans visite : la comptabilité a changé de logiciel, personne n'a prévenu le serveur."],
  ["SRV-MESSAGERIE · 35 % · 4 000 boîtes aux lettres",false,"Il travaille, et 4 000 personnes s'en apercevraient très vite."],
  ["SRV-TEST-STAGIAIRE · 1 % · créé en 2019 « pour deux semaines »",true,"Le stagiaire est directeur ailleurs depuis. Son serveur de test l'attend toujours."],
  ["SRV-SAUVEGARDE · 2 % le jour, 90 % la nuit",false,"Il dort le jour et travaille la nuit. Une moyenne ne suffit pas : il faut regarder la courbe entière."],
  ["SRV-INTRANET-ANCIEN · 0 % · remplacé en 2022, gardé « au cas où »",true,"Le « au cas où » dure depuis quatre ans. On archive les données, on éteint la machine."],
  ["SRV-PAIE · 5 % en moyenne, 100 % trois jours par mois",false,"Peu utilisé, mais indispensable trois jours par mois : c'est un bon candidat au regroupement, pas à l'extinction."],
  ["SRV-IMPRIMANTES-3E · 1 % · l'étage a déménagé en 2020",true,"Il pilote des imprimantes qui n'existent plus. Il le fait très bien."],
  ["SRV-BADGES · 8 % · ouvre toutes les portes du bâtiment",false,"Peu chargé, mais sans lui personne n'entre ni ne sort. On le garde, et on lui dit merci."]
];
function datSimZombies(fin){
  trk('voyage_sim',{site:'datacenter',sim:'zombies'});
  voyEtapes('La chasse aux zombies',[multi({title:'Huit serveurs dans la supervision',ctx:"<b>Mlle Octet :</b> « Coche ceux que tu débranches. Attention : un serveur peu chargé n'est pas forcément inutile, et un serveur inutile n'est pas toujours à l'arrêt. Regarde ce qu'il fait, et pour qui. »",
    q:'Lesquels sont des zombies ?',items:DAT_SERVEURS,okMsg:"Quatre zombies sur huit : la proportion est exagérée, pas le phénomène. Chacun consommait environ 150 watts sans rien faire, jour et nuit : 1 300 kWh par an et par machine, plus le froid pour l'évacuer. Dans un local de mairie, c'est souvent la première économie, et la moins chère."})],
    ()=>{voyEtat().faits['datacenter.zombies']=1;save();if(fin)fin()},{plusTard:true});
}

/* ================= 3. LE DÉFI DE MME QUATRENEUF ================= */
const DAT_COUPURE=["Le réseau tombe : plus de tension sur l'arrivée électrique","Les batteries des onduleurs prennent le relais, sans la moindre coupure","Les groupes électrogènes démarrent : dix à trente secondes","Les groupes sont stables : la charge bascule sur eux","Les batteries se rechargent ; le fioul donne 72 heures","Le réseau revient : on attend qu'il soit stable","Retour sur le réseau, arrêt des groupes, plein des cuves"];
function datDefi(){
  voyDefi('datacenter',DAT.defi=DAT.defi||{qui:'Mme Quatreneuf',attente:DAT.dit.quatreneufAttente,apres:DAT.dit.quatreneufApres,
    entree:"Vous avez tout vu ? Les salles, les batteries, le quai ? Alors six questions, puis une épreuve. Je vous préviens : elle se déroule à 3 h du matin.",
    questions:DAT.questions,
    epreuves:[
      order({title:'Dernière épreuve · Coupure à 3 h du matin',ctx:"<b>Mme Quatreneuf :</b> « Une tempête, une ligne arrachée : le réseau tombe. Aucun serveur ne doit s'en apercevoir. Remettez dans l'ordre ce qui se passe, de la première milliseconde au retour à la normale. »",
        q:"Que se passe-t-il, et dans quel ordre ?",items:DAT_COUPURE,okMsg:"C'est la séquence. Les batteries ne servent qu'à tenir le temps que les groupes démarrent ; les groupes ne servent qu'à tenir le temps que le réseau revienne. Chacun couvre exactement la faiblesse du précédent."}),
      choice({title:'Dernière épreuve · Le compte des batteries',ctx:"Les batteries doivent tenir <b>10 minutes</b> à pleine charge du site : <b>13 MW</b>.",q:"Quelle énergie stockent-elles, au minimum ?",
        opts:[["Environ 2,2 MWh",1,"13 MW × 10 minutes = 13 × 1/6 d'heure. Beaucoup de puissance, très peu d'énergie : c'est le contraire d'un lac de barrage."],["130 MWh",0,"Ce serait 13 MW pendant dix heures. On a dit dix minutes."],["13 MWh",0,"Ça, c'est une heure entière à pleine charge."]]})],
    verdict:`<p><b>Mme Quatreneuf :</b> « Vous savez où part chaque watt, pourquoi notre courbe est plate, ce qui se passe quand le réseau tombe, et quoi faire du placard à balais de M. Placard. »</p><p>« La plupart des gens pensent que le numérique est immatériel. Vous, vous avez posé la main sur la conduite tiède. »</p>`,
    merci:"Votre tampon. Il a été sauvegardé sur trois sites distants pendant que je l'apposais. Bonne route, et éteignez la lumière en sortant : c'est une plaisanterie, elle s'éteint toute seule."});
}
