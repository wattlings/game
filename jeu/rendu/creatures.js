/* Wattlings · jeu/rendu/creatures.js
   Les créatures de l'Anomalidex, façon Pokémon : sept anomalies de données (N° 001 à 007, étape Fiabiliser) et neuf dérives
   de consommation (N° 008 à 016, étape Détecter). Chaque créature incarne son défaut : sa forme raconte l'anomalie.
   Les sprites sont dessinés sur une grille de 48 × 48 avec des formes simples, puis « pixelisés » (bords nets, contour
   sombre d'un pixel), comme un sprite de console. monCanvas (epreuves/fiabiliser.js) s'en sert partout : combats, bocaux,
   ronde de nuit, Anomalidex, vidéo d'introduction.

   Pour changer une créature : son entrée dans CREA_DONNEES ou CREA_CONSO (nom, fiche, dessin). */

const CR_OUTLINE='#1d1a2b';
function crSprite(draw,size=48){
  const c=document.createElement('canvas');c.width=size;c.height=size;const x=c.getContext('2d');
  draw(x);
  const d=x.getImageData(0,0,size,size),p=d.data,op=i=>p[i*4+3]>110;
  for(let i=0;i<size*size;i++)p[i*4+3]=op(i)?255:0;
  const o=[];for(let y=0;y<size;y++)for(let X=0;X<size;X++){const i=y*size+X;if(op(i))continue;
    if((X>0&&op(i-1))||(X<size-1&&op(i+1))||(y>0&&op(i-size))||(y<size-1&&op(i+size)))o.push(i)}
  const r=parseInt(CR_OUTLINE.slice(1,3),16),g=parseInt(CR_OUTLINE.slice(3,5),16),b=parseInt(CR_OUTLINE.slice(5,7),16);
  o.forEach(i=>{p[i*4]=r;p[i*4+1]=g;p[i*4+2]=b;p[i*4+3]=255});
  x.putImageData(d,0,0);return c;
}
/* petites briques de dessin */
const crE=(x,cx,cy,rx,ry,col,rot=0)=>{x.fillStyle=col;x.beginPath();x.ellipse(cx,cy,rx,ry,rot,0,Math.PI*2);x.fill()};
const crP=(x,pts,col)=>{x.fillStyle=col;x.beginPath();pts.forEach(([a,b],i)=>i?x.lineTo(a,b):x.moveTo(a,b));x.closePath();x.fill()};
const crB=(x,a,b,w,h,col)=>{x.fillStyle=col;x.fillRect(a,b,w,h)};
const crOeil=(x,cx,cy,r=3,regard=0,col='#fff')=>{crE(x,cx,cy,r,r+.6,col);crB(x,Math.round(cx-1+regard),Math.round(cy-1),2,3,'#1d1a2b');crB(x,Math.round(cx-1+regard),Math.round(cy-1),1,1,'#fff')};
const crTrou=(x,cx,cy,rx,ry)=>{x.save();x.globalCompositeOperation='destination-out';crE(x,cx,cy,rx,ry,'#000');x.restore()};

const CREA_DONNEES=[
  {id:'trou',num:1,nom:'Lacunor',espece:'la Créature Lacune',types:['Vide'],taille:'0,4 m',poids:'0 kg (jamais mesuré)',
   anomalie:'le trou dans les données',
   dex:"Une petite taupe qui creuse dans les courbes de charge et mange les mesures qu'elle croise. Elle laisse derrière elle des trous parfaitement ronds. On la repère à ce qu'on ne voit pas.",
   capacite:'Estimation marquée : on comble le trou avec un profil type, et on écrit « estimée » dessus.',
   draw:x=>{crE(x,24,42,15,3,'rgba(0,0,0,.25)');crE(x,24,29,15,14,'#5a6b8c');crE(x,24,33,10,9,'#8fa0c4');crE(x,18,20,3,4,'#5a6b8c');
     crE(x,15,16,4,4,'#5a6b8c');crE(x,33,16,4,4,'#5a6b8c');crE(x,15,16,2,2,'#e8a0b4');crE(x,33,16,2,2,'#e8a0b4');
     crE(x,24,22,11,8,'#5a6b8c');crOeil(x,19,22,2.5,1);crOeil(x,29,22,2.5,-1);crE(x,24,27,3,2,'#e8a0b4');
     crB(x,9,40,6,3,'#e8d9b8');crB(x,33,40,6,3,'#e8d9b8');crTrou(x,24,35,5,4);
     for(let i=0;i<4;i++)crB(x,12+i*7,10,4,1,'#8fa0c4')}},
  {id:'doublon',num:2,nom:'Doublonix',espece:'la Créature Écho',types:['Écho'],taille:'0,6 m (×2)',poids:'3,2 kg, ou 6,4 kg',
   anomalie:'le doublon',
   dex:"Un oiseau à deux têtes identiques qui répète tout deux fois. Tout deux fois. Il adore se glisser dans les envois d'API : la même mesure arrive deux fois, et la consommation double d'un coup.",
   capacite:'Dédoublonnage : une seule valeur par créneau, statut « corrigée », la brute conservée.',
   draw:x=>{crE(x,24,43,14,3,'rgba(0,0,0,.25)');crE(x,24,33,13,10,'#8a5fc9');crE(x,24,36,8,6,'#c4a8ef');
     crP(x,[[11,32],[2,24],[8,36]],'#6b45a8');crP(x,[[37,32],[46,24],[40,36]],'#6b45a8');
     [15,33].forEach(cx=>{crE(x,cx,17,8,8,'#8a5fc9');crP(x,[[cx-2,5],[cx+1,11],[cx-4,11]],'#f2c12e');crOeil(x,cx-2,16,2.4,1);crOeil(x,cx+3,16,2.4,1);crP(x,[[cx-2,20],[cx+3,20],[cx,25]],'#f2a33a')});
     crB(x,17,42,3,4,'#f2a33a');crB(x,28,42,3,4,'#f2a33a');
     x.fillStyle='#fff';x.font='bold 7px monospace';x.textAlign='center';x.fillText('×2',24,39)}},
  {id:'pic',num:3,nom:'Picatron',espece:'la Créature Surtension',types:['Surtension'],taille:'0,9 m (pointe comprise)',poids:'999,9 kg',
   anomalie:'le pic impossible',
   dex:"Un hérisson électrique dont l'épine dorsale monte bien plus haut que le raccordement ne le permet. Il apparaît une seconde à 999,9 kW, puis disparaît. Les disjoncteurs ne l'ont jamais vu passer.",
   capacite:'Rejet : la valeur est physiquement impossible, on la rejette et on estime le créneau.',
   draw:x=>{crE(x,24,43,15,3,'rgba(0,0,0,.25)');
     crP(x,[[22,26],[20,1],[27,12],[29,3],[30,24]],'#f2c12e');
     for(let i=0;i<5;i++)crP(x,[[10+i*7,26],[7+i*7,14+Math.abs(i-2)*3],[15+i*7,24]],'#b8322a');
     crE(x,24,31,15,12,'#e2573b');crE(x,24,35,9,7,'#ffd2a8');
     crP(x,[[38,34],[47,30],[42,36],[47,38],[38,38]],'#f2c12e');
     crOeil(x,18,27,2.6,1);crOeil(x,30,27,2.6,-1);crP(x,[[15,23],[21,25],[15,25]],'#1d1a2b');crP(x,[[33,23],[27,25],[33,25]],'#1d1a2b');
     crB(x,21,33,6,2,'#1d1a2b');crB(x,22,35,1,1,'#fff');crB(x,25,35,1,1,'#fff');
     crB(x,13,41,5,3,'#b8322a');crB(x,30,41,5,3,'#b8322a')}},
  {id:'recule',num:4,nom:'Reculax',espece:'la Créature Rétro',types:['Rétro'],taille:'0,5 m',poids:'41,3 kg, puis 40,4 kg',
   anomalie:"l'index qui recule",
   dex:"Un crabe qui marche à reculons et porte sur son dos un compteur qu'il fait tourner à l'envers. Un mois, l'index affiche moins que le mois d'avant : c'est lui. Il n'a jamais rendu un seul kWh.",
   capacite:"Signalement : un index ne recule jamais ; on signale l'erreur de saisie et on estime en attendant.",
   draw:x=>{crE(x,24,44,17,3,'rgba(0,0,0,.25)');
     [[9,38],[13,40],[35,40],[39,38]].forEach(([a,b])=>crP(x,[[a,b-4],[a-4,b+3],[a+1,b+1]],'#a8871e'));
     crE(x,24,33,15,10,'#c9a82a');crE(x,24,26,12,9,'#8a6a16');crB(x,15,22,18,7,'#f7f0dc');
     x.fillStyle='#1d1a2b';x.font='bold 6px monospace';x.textAlign='center';x.fillText('4139',24,28);
     crB(x,17,13,2,7,'#a8871e');crB(x,29,13,2,7,'#a8871e');crOeil(x,18,12,2.6,-1);crOeil(x,30,12,2.6,-1);
     crE(x,5,28,5,4,'#c9a82a');crP(x,[[1,24],[7,27],[2,29]],'#1d1a2b');crE(x,43,28,5,4,'#c9a82a');crP(x,[[47,24],[41,27],[46,29]],'#1d1a2b');
     crB(x,22,36,4,1,'#1d1a2b');crP(x,[[19,40],[23,38],[23,42]],'#f7f0dc')}},
  {id:'boucle',num:5,nom:'Boucloop',espece:'la Créature Ouroboros',types:['Boucle'],taille:'1,0 m (déroulé)',poids:'99 850 g, puis 420 g',
   anomalie:'le compteur qui boucle',
   dex:"Un serpent qui se mord la queue. Quand son corps atteint 99 999, il recommence à zéro et fait croire que la consommation s'est effondrée. Il n'est pas méchant : il manque juste de chiffres.",
   capacite:'Bouclage : (maximum − ancien index) + nouvel index. Le compteur a fait un tour, pas un miracle.',
   draw:x=>{crE(x,24,44,15,3,'rgba(0,0,0,.25)');
     x.strokeStyle='#2aa198';x.lineWidth=9;x.beginPath();x.arc(24,26,14,.55,Math.PI*2-.2);x.stroke();
     x.strokeStyle='#8fe0d6';x.lineWidth=3;x.beginPath();x.arc(24,26,14,.7,Math.PI*2-.4);x.stroke();
     crE(x,37,33,7,6,'#2aa198');crP(x,[[40,38],[44,41],[38,40]],'#c43d3d');crOeil(x,36,31,2.4,1);crOeil(x,41,31,2,1);
     crP(x,[[33,40],[36,37],[30,37]],'#1f7a72');
     x.fillStyle='#1d1a2b';x.font='bold 6px monospace';x.textAlign='center';x.fillText('99',15,20);x.fillText('00',15,36)}},
  {id:'unite',num:6,nom:'Wattomix',espece:'la Créature Caméléon',types:['Unité'],taille:'0,3 m, ou 300 mm',poids:'2 500 g, ou 2,5 kg',
   anomalie:"l'unité trompeuse",
   dex:"Un caméléon qui change d'unité comme d'autres changent de couleur. Il annonce « 22 500 » sans préciser : des W, des kW, des kVA ? Il adore voir les tableaux de bord exploser d'un facteur mille.",
   capacite:"Conversion : toujours vérifier l'unité, et ramener tout le monde en kW et en kWh.",
   draw:x=>{crE(x,24,44,16,3,'rgba(0,0,0,.25)');
     x.strokeStyle='#2f5aa8';x.lineWidth=4;x.beginPath();x.arc(40,30,6,Math.PI*.5,Math.PI*2.3);x.stroke();
     crE(x,22,31,15,11,'#4a78c9');crE(x,22,34,10,7,'#bcd3f5');crE(x,12,20,10,9,'#4a78c9');
     crE(x,9,19,5,5,'#2f5aa8');crOeil(x,9,19,3,-1,'#f2c12e');crP(x,[[3,25],[12,25],[6,28]],'#e8a0b4');
     crB(x,12,41,4,4,'#2f5aa8');crB(x,28,41,4,4,'#2f5aa8');
     x.fillStyle='#1d1a2b';x.font='bold 9px monospace';x.textAlign='center';x.fillText('W',22,37);
     crB(x,32,14,9,9,'#f7f0dc');x.fillStyle='#c43d3d';x.font='bold 8px monospace';x.fillText('k?',36.5,21)}},
  {id:'heure',num:7,nom:'Horlogix',espece:'la Créature Fuseau',types:['Temps'],taille:'0,7 m',poids:'2,3 kg (23 h sur 24)',
   anomalie:"l'heure d'été",
   dex:"Une chouette dont le visage est une horloge. Deux fois par an, elle avance ou recule d'une heure, et la journée compte 23 ou 25 heures de mesures. Les débutants la prennent pour un trou. Elle en rit.",
   capacite:'Calendrier : une journée de 23 h ou de 25 h est normale au changement d’heure ; on stocke en UTC.',
   draw:x=>{crE(x,24,44,14,3,'rgba(0,0,0,.25)');
     crE(x,24,29,14,15,'#8a3b3b');crE(x,24,33,9,10,'#d9a86c');for(let i=0;i<4;i++)crB(x,20+((i%2)*5),29+i*3,3,1,'#8a3b3b');
     crP(x,[[10,14],[13,4],[17,12]],'#8a3b3b');crP(x,[[38,14],[35,4],[31,12]],'#8a3b3b');
     crE(x,24,18,12,10,'#6b2b2b');crE(x,24,18,9,8,'#f7f0dc');
     x.strokeStyle='#1d1a2b';x.lineWidth=1.5;x.beginPath();x.moveTo(24,18);x.lineTo(24,12);x.moveTo(24,18);x.lineTo(29,20);x.stroke();
     [[24,11],[31,18],[24,25],[17,18]].forEach(([a,b],i)=>{if(i!==1)crB(x,a-.5,b-.5,1.5,1.5,'#1d1a2b')});
     crE(x,10,30,4,9,'#6b2b2b',.3);crE(x,38,30,4,9,'#6b2b2b',-.3);crP(x,[[22,23],[26,23],[24,26]],'#f2a33a');
     crB(x,19,42,3,3,'#f2a33a');crB(x,26,42,3,3,'#f2a33a')}}
];

/* ---- les dérives de consommation : on les affronte pendant la ronde de nuit (epreuves/detecter.js) et dans l'Arène de la Nuit ----
   vu : ce que la ronde constate ; moves : les traitements proposés en combat, [texte, juste, explication] */
const CREA_CONSO=[
  {id:'veillotron',num:8,nom:'Veillotron',espece:'la Créature Veille',types:['Talon'],taille:'0,5 m (écran 24 pouces)',poids:'4 kg, plus 1 W toute la nuit',
   anomalie:'les appareils en veille',col:'#3b4a6b',
   dex:"Un écran fantôme qui dort les yeux ouverts : un petit voyant rouge, toute la nuit, tout le week-end. Seul, il ne consomme presque rien. Il n'est jamais seul.",
   capacite:'Coupe-veille : des horloges et des prises coupe-veille, pour que tout s’éteigne quand le bâtiment se vide.',
   vu:s=>s.id==='ecole'?"2 h du matin : le tableau numérique et les PC de la salle informatique sont en veille. Des dizaines de petits voyants rouges.":"2 h du matin : écrans, imprimantes et machine à café en veille sur tous les plateaux. Des dizaines de petits voyants rouges.",
   moves:[["Horloges et prises coupe-veille sur les postes",1,"Tout s'éteint quand le bâtiment se vide, et se rallume avant l'arrivée des premiers. Le talon redescend toutes les nuits."],
     ["Débrancher tout chaque soir, à la main",0,"Le premier soir, oui. Le deuxième, peut-être. Le troisième, personne. Une automatisation ne se fatigue pas."],
     ["Rien : une veille, ça ne consomme rien",0,"Un peu, multiplié par des dizaines d'appareils et 5 000 heures de nuit par an : des milliers de kWh."]],
   draw:x=>{crE(x,24,44,14,3,'rgba(0,0,0,.25)');crP(x,[[14,38],[34,38],[30,46],[18,46]],'#2c3550');crB(x,21,33,6,6,'#2c3550');
     crB(x,6,8,36,27,'#3b4a6b');crB(x,9,11,30,20,'#1a2238');crB(x,11,13,10,3,'rgba(120,160,230,.35)');
     crOeil(x,18,21,2.4,1,'#9fb4d8');crOeil(x,30,21,2.4,1,'#9fb4d8');crB(x,20,27,8,1,'#9fb4d8');
     crE(x,38,32,2,2,'#ff3b3b');crP(x,[[6,30],[0,36],[6,35]],'#3b4a6b');crP(x,[[42,30],[48,36],[42,35]],'#3b4a6b');
     for(let i=0;i<3;i++)crB(x,40-i*2,2+i*3,3-i,1,'#9fb4d8')}},
  {id:'lumignon',num:9,nom:'Lumignon',espece:'la Créature Luciole',types:['Lumière'],taille:'0,2 m',poids:'60 W',
   anomalie:"l'éclairage qui reste allumé",col:'#f2c12e',
   dex:"Une luciole-ampoule qui n'éteint jamais. Elle aime les couloirs vides, la nuit, et les bâtiments où chacun pense que quelqu'un d'autre éteindra.",
   capacite:'Détection : des détecteurs de présence et une minuterie dans les circulations.',
   vu:()=>"Minuit passé : les couloirs et les escaliers sont éclairés comme en plein jour. Personne. Pas un chat. Si, un chat.",
   moves:[["Détecteurs de présence et minuterie dans les circulations",1,"La lumière s'allume quand quelqu'un passe, et seulement là. L'éclairage de sécurité, lui, reste."],
     ["Passer en LED et laisser allumé",0,"Plus efficace, oui. Mais une LED allumée pour personne reste du gaspillage : on règle d'abord l'usage."],
     ["Couper tout l'éclairage la nuit, sécurité comprise",0,"L'éclairage de sécurité est obligatoire. On coupe le confort, jamais la sécurité."]],
   draw:x=>{crE(x,24,45,10,2,'rgba(0,0,0,.2)');crE(x,24,24,21,21,'rgba(255,236,150,.35)');
     crE(x,11,22,8,5,'#cfe8f5',-.5);crE(x,37,22,8,5,'#cfe8f5',.5);crE(x,24,24,10,11,'#f2c12e');crE(x,24,22,7,7,'#fff3c4');
     crB(x,19,33,10,3,'#9aa0a8');crB(x,19,36,10,2,'#6b7280');crB(x,21,38,6,2,'#9aa0a8');
     crOeil(x,21,22,2.2,0);crOeil(x,27,22,2.2,0);crB(x,22,27,4,1,'#1d1a2b');
     crB(x,22,8,1,6,'#1d1a2b');crB(x,26,8,1,6,'#1d1a2b');crE(x,22,7,1.5,1.5,'#f2a33a');crE(x,26,7,1.5,1.5,'#f2a33a')}},
  {id:'weekendragon',num:10,nom:'Weekendragon',espece:'la Créature Chaudière',types:['Chaleur'],taille:'1,2 m',poids:'180 kg (fonte)',
   anomalie:'le chauffage du week-end',col:'#c0503a',
   dex:"Un dragon-chaudière qui crache sa chaleur le samedi soir, bâtiment vide. Il chauffe pour personne, avec une constance admirable. Il n'a jamais su lire un calendrier.",
   capacite:'Réduit : programmer le réduit de nuit et de week-end sur la régulation.',
   vu:()=>"Samedi, 23 h : la chaudière tourne à plein régime. Le bâtiment est vide depuis vendredi 18 h.",
   moves:[["Programmer le réduit de nuit et de week-end",1,"La chaudière baisse quand le bâtiment se vide, et remonte à temps pour le lundi. Une règle métier liée au calendrier la surveille ensuite."],
     ["Couper la chaudière tout le week-end, même en février",0,"Lundi matin : 11 °C et des canalisations qui toussent. Un réduit, pas un arrêt."],
     ["Baisser la consigne de 4 °C toute la semaine",0,"Les occupants de la semaine n'ont rien demandé. On réduit quand le bâtiment est vide, pas quand il est plein."]],
   draw:x=>{crE(x,24,45,16,3,'rgba(0,0,0,.25)');crP(x,[[6,40],[2,26],[10,34]],'#8a2f22');
     crB(x,12,18,24,24,'#c0503a');crB(x,15,26,18,10,'#3a1d16');for(let i=0;i<4;i++)crB(x,17+i*4,28,2,6,'#f2a33a');crB(x,17,32,14,3,'#ffde6b');
     crB(x,14,14,20,6,'#8a2f22');crE(x,24,12,10,7,'#c0503a');crP(x,[[16,7],[13,0],[20,6]],'#f2c12e');crP(x,[[32,7],[35,0],[28,6]],'#f2c12e');
     crOeil(x,20,12,2.2,1,'#ffde6b');crOeil(x,28,12,2.2,-1,'#ffde6b');crB(x,22,16,4,1,'#1d1a2b');
     crP(x,[[34,16],[46,10],[44,18],[48,20],[38,20]],'#f2a33a');crB(x,13,41,6,4,'#8a2f22');crB(x,29,41,6,4,'#8a2f22')}},
  {id:'ventilox',num:11,nom:'Ventilox',espece:'la Créature Hélice',types:['Air'],taille:'0,6 m',poids:'9 kg, souffle compris',
   anomalie:'la ventilation qui tourne 24 h/24',col:'#5f8fa8',
   dex:"Un hibou-hélice qui souffle jour et nuit, même quand il n'y a plus personne à aérer. Il renouvelle l'air de pièces vides avec une conscience professionnelle remarquable.",
   capacite:'Asservissement : la ventilation suit l’occupation, avec une horloge ou un capteur de CO₂.',
   vu:()=>"Dimanche, 4 h : la centrale de ventilation tourne à plein débit. Elle aère des bureaux vides depuis vendredi.",
   moves:[["Asservir la ventilation à l'occupation (horloge, capteur de CO₂)",1,"Plein débit quand il y a du monde, débit réduit ou arrêt quand il n'y a personne. L'air neuf reste garanti."],
     ["L'arrêter complètement",0,"L'air neuf est obligatoire quand le bâtiment est occupé. On l'arrête quand il est vide, pas tout le temps."],
     ["Ouvrir les fenêtres à la place",0,"En hiver, c'est chauffer la rue. Et la nuit, c'est inviter les cambrioleurs."]],
   draw:x=>{crE(x,24,45,13,3,'rgba(0,0,0,.25)');crE(x,24,29,14,15,'#5f8fa8');crE(x,24,33,9,9,'#bcd8e6');
     crE(x,24,16,13,10,'#4a7891');crE(x,18,16,5,5,'#e8eef7');crE(x,30,16,5,5,'#e8eef7');
     for(let k=0;k<3;k++){const a=k*2.094;crP(x,[[18,16],[18+Math.cos(a)*5,16+Math.sin(a)*5],[18+Math.cos(a+.7)*5,16+Math.sin(a+.7)*5]],'#4a7891');crP(x,[[30,16],[30+Math.cos(a)*5,16+Math.sin(a)*5],[30+Math.cos(a+.7)*5,16+Math.sin(a+.7)*5]],'#4a7891')}
     crE(x,18,16,1.5,1.5,'#1d1a2b');crE(x,30,16,1.5,1.5,'#1d1a2b');crP(x,[[22,21],[26,21],[24,24]],'#f2a33a');
     crP(x,[[13,8],[16,2],[19,8]],'#4a7891');crP(x,[[35,8],[32,2],[29,8]],'#4a7891');
     crE(x,9,30,4,9,'#4a7891',.3);crE(x,39,30,4,9,'#4a7891',-.3);for(let i=0;i<3;i++)crB(x,2,26+i*5,5,1,'#bcd8e6');crB(x,19,42,3,3,'#f2a33a');crB(x,26,42,3,3,'#f2a33a')}},
  {id:'givrou',num:12,nom:'Givrou',espece:'la Créature Vitrine',types:['Froid'],taille:'0,8 m',poids:'45 kg (givre compris)',
   anomalie:'la vitrine réfrigérée ouverte la nuit',col:'#8fd0e8',
   dex:"Un petit yéti qui vit dans les vitrines réfrigérées sans rideau de nuit. Il refroidit la boutique entière jusqu'au matin, et souffle sur les croissants pour le plaisir.",
   capacite:'Rideau de nuit : on ferme la vitrine la nuit ; le froid reste dedans.',
   vu:()=>"3 h du matin, boutique fermée : la vitrine réfrigérée est grande ouverte, sans rideau. Le froid se déverse sur le carrelage.",
   moves:[["Poser un rideau de nuit sur la vitrine",1,"Le froid reste dans la vitrine, le groupe froid se repose, les produits ne craignent rien."],
     ["Baisser encore la température de la vitrine",0,"Plus froid et toujours ouvert : tu refroidis la boutique encore plus vite. Il adore."],
     ["Éteindre la vitrine la nuit, produits dedans",0,"Les produits frais, eux, n'aiment pas ça. Les règles d'hygiène non plus."]],
   draw:x=>{crE(x,24,45,14,3,'rgba(0,0,0,.2)');crE(x,24,29,14,15,'#e8f6fb');crE(x,24,31,9,10,'#8fd0e8');
     for(let i=0;i<6;i++)crP(x,[[10+i*5.5,16],[12+i*5.5,8+(i%2)*3],[15+i*5.5,16]],'#e8f6fb');
     crE(x,24,20,10,7,'#8fd0e8');crOeil(x,20,20,2.4,0);crOeil(x,28,20,2.4,0);crP(x,[[22,24],[26,24],[24,27]],'#e8f6fb');
     crE(x,9,30,4,7,'#e8f6fb',.4);crE(x,39,30,4,7,'#e8f6fb',-.4);
     [[4,8],[42,10],[40,40],[5,38]].forEach(([a,b])=>{crB(x,a,b,1,5,'#8fd0e8');crB(x,a-2,b+2,5,1,'#8fd0e8')});crB(x,17,42,5,3,'#5aa8c8');crB(x,27,42,5,3,'#5aa8c8')}},
  {id:'bouillonix',num:13,nom:'Bouillonix',espece:'la Créature Ballon',types:['Eau chaude'],taille:'1,1 m (200 litres)',poids:'230 kg, plein',
   anomalie:"le chauffe-eau qui tourne pendant les vacances",col:'#e2573b',
   dex:"Un ballon d'eau chaude qui garde son eau à 60 °C pendant les vacances, au cas où. Personne ne viendra se laver les mains avant la rentrée. Il le sait. Il chauffe quand même.",
   capacite:'Programmation : on coupe pendant les vacances, et on relance la veille de la rentrée, en montant bien en température.',
   vu:()=>"Vacances de février, école vide : le chauffe-eau électrique de la cave chauffe ses 200 litres à 60 °C, jour et nuit.",
   moves:[["Le couper pendant les vacances, le relancer la veille de la rentrée",1,"On relance assez tôt pour remonter l'eau en température : c'est aussi ce qui protège des légionelles."],
     ["Le laisser tourner, on ne sait jamais",0,"On sait, justement : personne ne viendra. Deux semaines de chauffe pour rien."],
     ["Le couper définitivement",0,"La cantine en a besoin dès la rentrée. On programme, on ne supprime pas."]],
   draw:x=>{crE(x,24,45,12,3,'rgba(0,0,0,.25)');crE(x,24,26,13,18,'#f7f0dc');crB(x,11,20,26,12,'#f7f0dc');
     crB(x,13,30,22,4,'#e2573b');crE(x,24,26,6,6,'#cfd8e0');crB(x,23,22,2,5,'#e2573b');
     crOeil(x,18,15,2.4,0);crOeil(x,30,15,2.4,0);crB(x,21,19,6,1,'#1d1a2b');
     crB(x,16,42,3,4,'#9aa0a8');crB(x,29,42,3,4,'#9aa0a8');crB(x,37,24,6,2,'#9aa0a8');crB(x,41,24,2,8,'#9aa0a8');
     for(let i=0;i<3;i++)crE(x,14+i*10,4+(i%2)*2,2.5,2.5,'rgba(207,216,224,.9)')}},
  {id:'portagel',num:14,nom:'Portagel',espece:'la Créature Courant d’air',types:['Froid'],taille:'2,0 m (huisserie)',poids:'80 kg',
   anomalie:'la porte de chambre froide qui ferme mal',col:'#9fb4d8',
   dex:"Une porte de chambre froide qui ne ferme jamais tout à fait. Par l'entrebâillement, elle laisse filer le froid, et le groupe froid court derrière toute la nuit.",
   capacite:'Étanchéité : un joint neuf et un ferme-porte. Le froid reste où on l’a mis.',
   vu:()=>"Dans la réserve, la porte de la chambre froide est restée entrouverte. Le groupe froid tourne sans s'arrêter.",
   moves:[["Changer le joint et poser un ferme-porte",1,"La porte se referme toute seule et ferme vraiment : le groupe froid peut enfin souffler."],
     ["Baisser la consigne pour compenser",0,"Plus froid dedans, plus de fuite dehors : tu as aggravé la dérive."],
     ["Laisser la porte ouverte pour aérer",0,"Une chambre froide n'a pas besoin d'air. Elle a besoin d'une porte."]],
   draw:x=>{crE(x,24,45,15,3,'rgba(0,0,0,.25)');crB(x,10,4,28,41,'#9fb4d8');crB(x,13,7,22,35,'#cfe0f5');crB(x,31,22,3,6,'#6b7a99');
     crP(x,[[35,7],[44,9],[44,42],[35,42]],'#6b7a99');crOeil(x,19,18,2.6,1);crOeil(x,28,18,2.6,1);crP(x,[[19,25],[28,25],[24,29]],'#6b7a99');
     for(let i=0;i<4;i++)crB(x,40,12+i*8,7,1,'#e8f6fb');crB(x,13,34,22,2,'#8fd0e8')}},
  {id:'thermoclash',num:15,nom:'Thermoclash',espece:'la Créature Conflit',types:['Chaleur','Froid'],taille:'0,9 m',poids:'2 × 20 kg',
   anomalie:'le chauffage et la clim en même temps',col:'#8a5fc9',
   dex:"Deux têtes, une qui chauffe, une qui refroidit, dans la même pièce. Elles se battent depuis des années, et la facture compte les points. Chacune pense que l'autre a commencé.",
   capacite:'Zone morte : des consignes séparées (chauffage à 19 °C, clim à 26 °C) et un seul pilote.',
   draw:x=>{crE(x,24,45,15,3,'rgba(0,0,0,.25)');crE(x,24,33,14,11,'#8a5fc9');
     crE(x,14,17,9,9,'#e2573b');crP(x,[[10,9],[14,0],[18,9]],'#f2c12e');crOeil(x,11,17,2.2,1);crOeil(x,17,17,2.2,1);crB(x,12,22,4,1,'#1d1a2b');
     crE(x,34,17,9,9,'#5aa8c8');for(let i=0;i<3;i++)crP(x,[[29+i*4,10],[31+i*4,3],[33+i*4,10]],'#e8f6fb');crOeil(x,31,17,2.2,-1);crOeil(x,37,17,2.2,-1);crB(x,32,22,4,1,'#1d1a2b');
     crP(x,[[22,28],[26,28],[24,40]],'#f7f0dc');crB(x,15,42,5,4,'#6b45a8');crB(x,28,42,5,4,'#6b45a8')}},
  {id:'pointezilla',num:16,nom:'Pointezilla',espece:'la Créature Pointe',types:['Pointe'],taille:'1,5 m (2,0 m à 10 h 02)',poids:'104 kVA',
   anomalie:'le dépassement de puissance',col:'#2aa198',
   dex:"Il ne mange qu'une fois par an, mais au pire moment : le jour le plus froid, à 10 h 02, quand tout démarre en même temps. Chaque bouchée au-delà de la puissance souscrite se paie en pénalités.",
   capacite:'Lissage : décaler les démarrages, et ajuster la puissance souscrite juste au-dessus de la pointe.',
   draw:x=>{crE(x,24,45,16,3,'rgba(0,0,0,.25)');crP(x,[[8,42],[0,34],[12,36]],'#1f7a72');
     crE(x,22,32,13,12,'#2aa198');crE(x,22,35,8,8,'#bfe8e0');crE(x,28,16,11,9,'#2aa198');crP(x,[[34,20],[46,18],[44,24],[34,24]],'#2aa198');
     for(let i=0;i<5;i++)crP(x,[[12+i*5,12-i],[14+i*5,4-i],[17+i*5,12-i]],'#f2c12e');
     crOeil(x,30,14,2.6,1);crB(x,37,22,6,1,'#1d1a2b');crB(x,39,23,1,2,'#fff');crE(x,12,30,3,5,'#1f7a72');
     crB(x,14,42,6,4,'#1f7a72');crB(x,26,42,6,4,'#1f7a72');crB(x,0,2,48,1,'#c43d3d');crB(x,2,0,10,2,'#c43d3d')}}
];

const CREATURES=[...CREA_DONNEES,...CREA_CONSO],CREA=Object.fromEntries(CREATURES.map(c=>[c.id,c]));
const CREA_CACHE={};
/* le sprite d'une créature (48 × 48), dessiné une fois ; noir : sa silhouette, pour une espèce pas encore rencontrée */
function crImage(id,noir){
  const k=id+(noir?':n':'');if(CREA_CACHE[k])return CREA_CACHE[k];const C=CREA[id];if(!C)return null;
  let c=crSprite(C.draw);
  if(noir){const n=document.createElement('canvas');n.width=n.height=48;const x=n.getContext('2d');x.drawImage(c,0,0);x.globalCompositeOperation='source-in';x.fillStyle='#2c2c3a';x.fillRect(0,0,48,48);c=n}
  return CREA_CACHE[k]=c;
}
/* une dérive de consommation, prête pour un combat (epreuves/fiabiliser.js, battle) */
const creaCombat=(id,s)=>{const C=CREA[id];return {id,name:C.nom,col:C.col,data:esc(C.vu?C.vu(s||site()):C.anomalie),moves:C.moves||[]}};
/* combien d'espèces de chaque famille sont dans l'Anomalidex */
const dexCompte=fam=>(fam==='conso'?CREA_CONSO:CREA_DONNEES).filter(c=>S.dex&&S.dex[c.id]).length;
