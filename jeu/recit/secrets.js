/* Wattlings · jeu/recit/secrets.js
   Secrets et humour : répliques cachées, œufs de Pâques, code Konami. */

/* ================= SECRETS & HUMOUR ================= */
const SECRETS={
  plante:'La plante verte',postit:'Le post-it',poubelle:'Les audits oubliés',etang:"L'étang",chat:'Le chat de la chaufferie',consultant:'Le consultant',
  commercial:'Le prix fixe',legendaire:'Le Compteur Légendaire',arbre:"L'arbre non déclaré",konami:'Le mode sobriété',prenom:'Un prénom prédestiné',
  carton:'Le carton de 2003',vent:'Le mur de vent',pspe:'La machine PSPE',mobilier:'Le mobilier bavard',joule:'Harceler Mme Joule',fuite:'La stratégie de fuite',panneau:'Le règlement du parc'
};
/* clins d'œil aux jeux vidéo (un par jeu) */
const EGGS={chouquette:'Le docteur et la chouquette',mgs:'Le carton qui marche',wow:'Le voyageur laconique',aoe:'Le prêtre persuasif',wc3:'L’artisan dévoué',zelda:'Dangereux d’y aller seul',crash:'La caisse nerveuse',
  dofus:'Le prix des tomates',adibou:'Le CD-ROM éducatif',sims:'La piscine sans échelle',metroid:'Le conduit trop étroit',castlevania:'Le mur creux',smash:'Sans une égratignure',
  mario64:'Le tableau qui ondule',spyro:'Le mouton inquiet',minecraft:'Le bloc de bois',wii:'La dragonne'};
const NSEC=Object.keys(SECRETS).length+Object.keys(EGGS).length;
function secret(id,lines,cb){
  const first=!S.secrets[id];
  say(lines,()=>{if(first){trk('secret',{id});S.secrets[id]=1;save();sfx('secret');gainXP(15);toast(`Secret trouvé ! ${Object.keys(S.secrets).length}/${NSEC}`)}if(cb)cb()});
}
const QUIPS=[
  "Petit conseil : ne dis jamais « c'est la faute du compteur » avant d'avoir vérifié l'unité.",
  "Un tableau Excel sans date de mise à jour, c'est une œuvre de fiction.",
  "La meilleure énergie est celle qu'on ne consomme pas. La deuxième meilleure, c'est celle qu'on facture correctement.",
  "Si ton tableau de bord a plus de douze couleurs, ce n'est plus un tableau de bord, c'est un vitrail.",
  "Le décret tertiaire, c'est comme le sport : tout le monde a une année de référence où il était en meilleure forme.",
  "En réunion, si quelqu'un dit « on va mettre de l'IA », demande-lui d'abord où sont les compteurs.",
  "Un audit énergétique non lu reste un excellent isolant. Pour les tiroirs."
];
let jouleTalks={ch:-1,n:0};
function jouleExtra(lines){
  if(jouleTalks.ch!==S.ch){jouleTalks={ch:S.ch,n:0}}
  jouleTalks.n++;
  if(jouleTalks.n===6)return secret('joule',[...lines,{w:'Mme Joule',t:"Tu me parles plus souvent que le fournisseur ne répond à ses mails. Va travailler !"}]);
  if(Math.random()<.4)lines=[...lines,{w:'Mme Joule',t:QUIPS[Math.floor(Math.random()*QUIPS.length)]}];
  say(lines);
}
function nameEgg(){
  const n=S.name.trim().toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,''),J='Mme Joule';
  const map={joule:"Une autre Joule ? Il va falloir un sous-compteur pour nous distinguer.",watt:"{name} ? Enchantée. Mais un watt sans heure, ça ne se facture pas.",
    enedis:"{name} ? C'est donc toi qui ne réponds jamais à mes demandes d'habilitation SGE ?",grdf:"{name} ? Tu viens relever le compteur ? Il est à la cave, derrière les cartons de 2003.",
    volt:"{name} ! Tes parents étaient électriciens, ou juste optimistes ?",ampere:"{name} ! Tes parents étaient électriciens, ou juste optimistes ?",kelvin:"{name}… Tu vas nous refroidir l'ambiance, toi.",
    pikachu:"Ce prénom appartient à des avocats bien plus puissants que 60 kVA. Je vais t'appeler « le stagiaire ».",linky:"{name} ? On t'a posé un jour sans prévenir, toi aussi ?",
    gazpar:"{name} ? Tu donnes de tes nouvelles tous les jours, et elles mettent un à trois jours à arriver. Je note."};
  return map[n]?{w:J,t:map[n]}:null;
}
let PONDT=null;function pondTiles(){if(!PONDT){PONDT=[];MAPS.town.g.forEach((r,y)=>r.forEach((t,x)=>{if(t==='~')PONDT.push([x,y])}))}return PONDT}
function secretObjs(id,o){
  const s=site();
  if(id==='town'){
    o.push({x:TP(55,32)[0],y:TP(55,32)[1],kind:'bin',solid:1,act:()=>secret('poubelle',["Une poubelle pleine de rapports d'audit énergétique : 2009, 2014, 2019.","Les trois concluent : « isoler les combles ». Les combles attendent toujours. Ils sont très patients, les combles."])});
    pondTiles().forEach(([x,y])=>o.push({x,y,kind:'none',act:()=>secret('etang',["Tu contemples l'étang. Ton reflet te contemple.","Aucun de vous deux ne sait convertir des m³ en kWh sans le coefficient de conversion. Vous détournez le regard."])}));
    o.push({x:TP(58,34)[0],y:TP(58,34)[1],kind:'cat',solid:1,act:()=>secret('chat',[{w:'Chat',t:"Miaou."},{t:"Le chat passe ses journées dans la chaufferie. En juillet."},{t:"Il a repéré la chaudière qui tourne l'été bien avant ton logiciel de détection à 40 000 €. Il réclame une augmentation en croquettes."}])});
    o.push({x:TP(53,38)[0],y:TP(53,38)[1],kind:'npc',solid:1,who:'Consultant',pal:{skin:'#f6d3b3',shirt:'#f7f0dc',pants:'#2c2c34',jacket:'#2c2c34',hair:'#d9a441',tie:'#c43d3d',prop:'tablet'},dir:'down',act:()=>secret('consultant',[{w:'Consultant',t:"Bonjour ! Je vends une plateforme IA-blockchain-métavers de pilotage énergétique prédictif."},{w:'Consultant',t:"Pour 80 000 €, elle vous dira d'éteindre la lumière en partant. En PowerPoint, avec des dégradés."},{w:'Consultant',t:"Vous n'avez pas encore de compteurs fiables ? Aucun problème : notre IA invente les données manquantes. Avec assurance."},{t:"Il te laisse une plaquette imprimée en couleur, recto seul. Tu la ranges avec les audits."}])});
    o.push({x:TP(79,42)[0],y:TP(79,42)[1],kind:'npc',solid:1,who:'Commercial',pal:{skin:'#e0ac7e',shirt:'#f7f0dc',pants:'#333',jacket:'#c43d3d',hair:'#2b1d14',tie:'#f2c12e',prop:'case'},dir:'left',act:()=>secret('commercial',[{w:'Commercial',t:"Contrat d'électricité à prix FIXE garanti trois ans !"},{w:'Commercial',t:"(Hors TURPE, accise, CTA, TVA, capacité, CEE, indexation, révision et cas de force majeure.)"},{w:'Commercial',t:"Mais le prix est fixe. Enfin, la police de caractères du prix est fixe."}])});
    o.push({x:TP(82,12)[0],y:TP(82,12)[1],kind:'legend',solid:1,act:()=>secret('legendaire',["Dans les buissons : un vieux compteur électromécanique à disque, couvert de mousse.","Son disque tourne à l'envers depuis 1987. Personne n'a jamais osé le relever.","Tu as trouvé le Compteur Légendaire ! Il n'a pas de PDL. Il est au-delà des PDL."])});
    o.push({x:L.trees[1][0],y:L.trees[1][1],kind:'none',act:()=>secret('arbre',["Cet arbre stocke du CO₂ gratuitement depuis soixante ans, sans subvention ni certificat d'économies d'énergie.","Il n'a jamais déclaré sur OPERAT. Personne n'a osé lui demander sa surface de plancher."])});
    o.push({x:TP(83,60)[0],y:TP(83,60)[1],kind:'sign',solid:1,act:()=>secret('panneau',["« PARC DES DONNÉES. Merci de ne pas nourrir les données brutes. »","« Interdiction d'extrapoler après 22 h. Les moyennes glissantes doivent être tenues en laisse. »"])});
  }
}
const MOBILIER={
  ecole:["Au tableau, à la craie : « Le radiateur sous la fenêtre ouverte n'est PAS une climatisation. »","Signé : la direction. En dessous, un élève a ajouté : « et la chaudière n'est pas un sèche-linge »."],
  bureau:["Un écran resté allumé affiche « Suivi_conso_FINAL_v3_vraiment_final (2).xlsx ».","Dernière modification : 2019. Trois onglets s'appellent « Feuil1 ». C'est ça, le système d'information énergie."],
  boulangerie:["Le boulanger t'explique que son four à 250 °C est une mesure de sobriété : il ne chauffe plus la boutique, le four s'en charge.","Tu notes « récupération de chaleur fatale » dans ton carnet. Il note « croissant pour le monsieur du compteur » dans le sien."]
};
const actMobilier=()=>secret('mobilier',MOBILIER[S.site]||MOBILIER.ecole);

/* ================= KONAMI ================= */
const KONAMI=['arrowup','arrowup','arrowdown','arrowdown','arrowleft','arrowright','arrowleft','arrowright','b','a'];let kbuf=[];
onKey('keydown',e=>{if(QK_HOST.hidden)return;kbuf.push((e.key||'').toLowerCase());kbuf=kbuf.slice(-10);
  if(kbuf.join()===KONAMI.join()){kbuf=[];S.sobriete=!S.sobriete;applySobriete();save();
    if(S.sobriete)secret('konami',["Code secret accepté. MODE SOBRIÉTÉ activé : l'écran passe en noir et blanc.","Économie estimée : 3 %. Personne ne l'a remarqué, comme la plupart des mesures de sobriété."]);else say(["Mode sobriété désactivé. Les couleurs reviennent, la facture aussi."])}});
function applySobriete(){cv.style.filter=S.sobriete?'grayscale(1) contrast(1.1)':''}
