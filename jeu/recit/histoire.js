/* Wattlings · jeu/recit/histoire.js
   L'histoire : les conseils de Mme Joule à chaque chapitre et le choix du site. */

/* ================= HISTOIRE ================= */
const JOULE_HINTS={get 1(){return[`Va voir ${site().short} de l'extérieur. L'adresse est sur la boîte aux lettres, la surface sur la fiche technique près de la porte.`]},
    0:["Parle-moi : on choisit ton site et on commence."],10:["Rendez-vous à l'hôtel de ville, place de l'Énergie, juste de l'autre côté du Grand pont. Le maire t'attend, et le PC patrimoine aussi : 20 sites à analyser."],
    2:["Entre dans ton site. Le compteur électrique est dans un coffret au mur ; le gaz, c'est souvent à la cave. Ensuite, file à l'Arène du Cadastre : elle est au Puy du Cadastre, au nord de la place, sur le chemin de la gare."],
    3:["Les données de mesure appartiennent au titulaire du contrat. Sans son consentement signé, pas de données. Tout se passe à la Cité des Beffrois, à l'est de la place : Enedis, GRDF, le fournisseur. C'est M. Relève qui te fera remplir le mandat, à l'Arène des Flux."],
    4:["Les données brutes sont pleines d'anomalies. Descends la piste cyclable jusqu'au Clos du Tamis : tu peux t'entraîner sur les sauvages du Parc des Données. Le Dr Doublon t'attend avec les siennes à l'Arène du Tamis."],
    5:["Des données justes, c'est bien. Des données bien rangées, c'est mieux. Prends l'inventaire dans l'armoire à archives, juste là, puis va voir Mlle Hiérarchie à l'Arène des Archives, au Quartier des Colombages, au sud de la place."],
    6:["Lis la courbe comme un électrocardiogramme : le repos, les pics, ce qui sort de l'ordinaire. Traverse la rivière par le pont du Sud : le Pr Talon t'attend à l'Arène des Courbes, sur la rive Énergie."],
    7:["Ce soir, fais une ronde de nuit dans ton site. Tout ce qui brille dans le noir consomme pour rien. Ensuite, l'Arène de la Nuit, dans le quartier de la Nuit, à l'ouest."],
    8:["Sobriété d'abord, contrat ensuite, travaux enfin. Présente ton plan au Chef Sobriété, à l'Arène du Chantier, dans le quartier du Chantier, au nord-ouest."],
    9:["Une action n'a marché que si on le prouve à conditions égales. La dernière arène, c'est l'Arène de la Preuve, au nord de la rive Énergie : la boucle est presque refermée. Sa championne ? Tu verras bien."],
    11:["Tu as bouclé la boucle. Et une boucle, ça recommence : nouvelles données, nouveaux objectifs !"]
};

function actJoule(){
  const J='Mme Joule',s=site();
  if(S.ch===0&&S.flags.choix)return say([{w:J,t:"Alors, quel site ? Les trois maquettes sont sur la table, à gauche. Approche-toi de chacune pour la regarder."}]);
  if(S.ch===0){const egg=nameEgg();const L0=[{w:J,t:"Ah, {name} ! Bienvenue dans l'équipe. On m'a dit que tu ne connaissais rien à l'énergie ?"},{w:J,t:"Excellent. Ici, on transforme des kilowattheures en tableaux, et des tableaux en économies. Parfois même dans cet ordre."},{w:J,t:"Parfait : on va tout apprendre dans l'ordre. Un energy manager ne suit jamais « l'énergie » en général. Il suit un patrimoine, des sites, des bâtiments, et des points de comptage."},{w:J,t:"Pour commencer, tu vas t'occuper d'un seul site. Choisis-le."}];return egg?secret('prenom',[L0[0],egg,...L0.slice(1)],presenterMaquettes):say(L0,presenterMaquettes)}
  if(S.ch===10&&!S.flags.pmIntro){S.flags.pmIntro=1;save();return say([{w:J,t:"{name}, la mairie a vu ton travail. À partir d'aujourd'hui, tu gères tout le patrimoine de la ville : 20 bâtiments."},{w:J,t:"Tu y retrouveras ton école et l'annexe du Carré. Pas la boulangerie : elle est privée, ce n'est pas à nous de payer ses croissants."},{w:J,t:"À cette échelle, on ne regarde plus une courbe : on classe, on compare, on priorise. Rendez-vous à l'hôtel de ville, au sud-est."}])}
  if(srcTry('joule'))return;
  jouleExtra((JOULE_HINTS[S.ch]||["Bon travail."]).map(t=>({w:J,t})));
}
/* ---- le choix du site, comme le choix du starter dans Pokémon Rouge Feu ----
   Sur la table du bureau, trois maquettes (monde/objets.js). Avant d'avoir parlé à Mme Joule, on peut les regarder
   sans les prendre. Ensuite, A devant une maquette la montre en grand (chooseSite) : « Tu choisis… ? » Oui / Non. */
const MAQUETTES={ecole:{x:2,le:'l’',toit:'#c8643c',mur:'#f2d9a0'},bureau:{x:3,le:'les ',toit:'#3d6f8a',mur:'#a9d0de'},boulangerie:{x:4,le:'la ',toit:'#d8b25a',mur:'#f7f0dc'}};
const SITE_BLURB={ecole:'Bâtiment public, 250 élèves. Chauffage gaz, cantine, vacances scolaires.',bureau:'Tertiaire privé, 90 salariés. Grosse puissance, salle serveurs.',boulangerie:'Petit commerce avec compteur Linky. Le fournil travaille la nuit.'};
function presenterMaquettes(){
  S.flags.choix=1;save();hud();
  say([{w:'Mme Joule',t:"Sur la table, à gauche, il y a trois maquettes : trois sites de la ville. Va les regarder, et choisis celui dont tu vas t'occuper."},{w:'Mme Joule',t:"Prends ton temps : ce site te suivra pendant toute l'aventure !"}]);
}
function actMaquette(id){const s=SITES[id];
  if(S.ch===0&&!S.flags.choix)return say([{t:"Trois maquettes de bâtiments sont posées sur la table. Mme Joule t'en dira plus."}]);
  if(S.ch===0)return chooseSite(id);
  say([{t:id===S.site?`La maquette de ton site : ${s.name}.`:`La maquette de ${s.name}. Ce n'est pas ton site.`}]);
}
/* la maquette en grand : le bâtiment, ses chiffres, puis la question */
function chooseSite(id='ecole'){
  const s=SITES[id],bd=BLD.find(x=>x.id===id),ov=openPanel(s.name,{sansCours:true}),b=ov.querySelector('.pbody');
  const cv2=document.createElement('canvas');cv2.width=(bd.w+2)*TS;cv2.height=(bd.h+1)*TS;const x=cv2.getContext('2d');
  R(x,0,0,cv2.width,cv2.height,'#7cc56a');drawBuilding(x,{...bd,x:1,y:.7,door:[bd.door[0]-bd.x+1,bd.door[1]-bd.y+.7]});
  b.innerHTML=`<div class="maquette-vue"><div class="mq-img"></div><div class="mq-txt">${id==='ecole'?'<span class="tag key">Recommandé : l\'école du cours</span>':''}<b>${s.name}</b><span><span class="tag">${fmt(s.surface)} m²</span> <span class="tag">${s.kva} kVA</span></span><p>${SITE_BLURB[id]}</p></div></div>
    <p class="mq-q">Tu choisis ${MAQUETTES[id].le}${esc(s.name)}&nbsp;?</p><div class="row"><button class="btn" id="csOui">Oui</button><button class="btn alt" id="csNon">Non</button></div>`;
  b.querySelector('.mq-img').appendChild(cv2);
  const non=()=>{removeEventListener('keydown',touche,true);closePanel()};
  const touche=e=>{if(!ov.isConnected){removeEventListener('keydown',touche,true);return}if(e.key==='Escape'){e.preventDefault();e.stopPropagation();non()}};
  addEventListener('keydown',touche,true);
  b.querySelector('#csNon').onclick=non;
  b.querySelector('#csOui').onclick=()=>{removeEventListener('keydown',touche,true);choisirSite(id)};
  b.querySelector('#csOui').focus();
}
function choisirSite(id){const s=SITES[id];
  trk('site_choice',{site:id});S.site=id;S.ch=1;S.notes={};S.flags={};closePanel();rebuildMaps();save();hud();jingle('badge');
  say([{t:`${S.name} prend la maquette. Ton site : ${s.name} !`},{w:'Mme Joule',t:`${s.name}, bon choix ! La démarche compte 8 étapes : chacune a son quartier, ses informations à trouver et son arène. Le but : faire baisser les kWh, que compte le compteur en haut de l'écran.`},{w:'Mme Joule',t:"Première étape : cadrer ton site. Va dehors, lis l'adresse sur la boîte aux lettres, puis la surface sur la fiche technique. Suis la flèche orange."}]);
}
/* une maquette posée sur la table : un petit bâtiment sur un plateau de bois */
function dessinerMaquette(c,X,Y,id){const m=MAQUETTES[id];
  R(c,X,Y+7,16,9,'#8a5f36');R(c,X,Y+7,16,2,'#a0764a');R(c,X+2,Y+6,12,2,'#5f8f4a');   // la table, le socle vert
  R(c,X+3,Y,10,7,m.mur);R(c,X+7,Y+3,2,4,'#5a3a22');R(c,X+4,Y+2,2,2,'#7fb3d5');R(c,X+10,Y+2,2,2,'#7fb3d5');   // les murs, la porte, les fenêtres
  if(id==='bureau'){R(c,X+3,Y-3,10,3,m.toit);R(c,X+4,Y-2,8,1,'#7fb3d5')}   // toit plat, façade vitrée
  else{R(c,X+2,Y-2,12,3,m.toit);R(c,X+4,Y-4,8,2,m.toit);if(id==='boulangerie')for(let i=0;i<5;i++)R(c,X+3+i*2,Y+1,1,1,'#c43d3d')}   // toit de tuiles ou de chaume, auvent rayé
}
