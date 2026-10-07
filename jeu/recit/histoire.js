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
  if(S.ch===0){const egg=nameEgg();const L0=[{w:J,t:"Ah, {name} ! Bienvenue dans l'équipe. On m'a dit que tu ne connaissais rien à l'énergie ?"},{w:J,t:"Excellent. Ici, on transforme des kilowattheures en tableaux, et des tableaux en économies. Parfois même dans cet ordre."},{w:J,t:"Parfait : on va tout apprendre dans l'ordre. Un energy manager ne suit jamais « l'énergie » en général. Il suit un patrimoine, des sites, des bâtiments, et des points de comptage."},{w:J,t:"Pour commencer, tu vas t'occuper d'un seul site. Choisis-le."}];return egg?secret('prenom',[L0[0],egg,...L0.slice(1)],chooseSite):say(L0,chooseSite)}
  if(S.ch===10&&!S.flags.pmIntro){S.flags.pmIntro=1;save();return say([{w:J,t:"{name}, la mairie a vu ton travail. À partir d'aujourd'hui, tu gères tout le patrimoine de la ville : 20 bâtiments."},{w:J,t:"Tu y retrouveras ton école et l'annexe du Carré. Pas la boulangerie : elle est privée, ce n'est pas à nous de payer ses croissants."},{w:J,t:"À cette échelle, on ne regarde plus une courbe : on classe, on compare, on priorise. Rendez-vous à l'hôtel de ville, au sud-est."}])}
  if(srcTry('joule'))return;
  jouleExtra((JOULE_HINTS[S.ch]||["Bon travail."]).map(t=>({w:J,t})));
}
function chooseSite(){
  const ov=openPanel('Choisis ton site',{sansCours:true}),b=ov.querySelector('.pbody');
  b.innerHTML=`<p>Tu es <b>gestionnaire de site</b>. Choisis le bâtiment dont tu vas t'occuper. Chaque site a ses propres chiffres et ses pièges. Tu hésites&nbsp;? Prends l'école : c'est l'exemple suivi dans le cours.</p><div class="cards"></div>`;
  const cards=b.querySelector('.cards');
  const blurb={ecole:'Bâtiment public, 250 élèves. Chauffage gaz, cantine, vacances scolaires.',bureau:'Tertiaire privé, 90 salariés. Grosse puissance, salle serveurs.',boulangerie:'Petit commerce avec compteur Linky. Le fournil travaille la nuit.'};
  ['ecole','bureau','boulangerie'].forEach(id=>{const s=SITES[id],bd=BLD.find(x=>x.id===id);
    const c=document.createElement('button');c.className='card';const cv2=document.createElement('canvas');cv2.width=(bd.w+2)*TS;cv2.height=(bd.h+1)*TS;const x=cv2.getContext('2d');
    R(x,0,0,cv2.width,cv2.height,'#7cc56a');drawBuilding(x,{...bd,x:1,y:.7,door:[bd.door[0]-bd.x+1,bd.door[1]-bd.y+.7]});
    c.appendChild(cv2);c.insertAdjacentHTML('beforeend',`${id==='ecole'?'<span class="tag key">Recommandé : l\'école du cours</span>':''}<b>${s.name}</b><span><span class="tag">${fmt(s.surface)} m²</span> <span class="tag">${s.kva} kVA</span></span><small>${blurb[id]}</small>`);
    c.onclick=()=>{trk('site_choice',{site:id});S.site=id;S.ch=1;S.notes={};S.flags={};closePanel();rebuildMaps();save();hud();
      say([{w:'Mme Joule',t:`${s.name}, bon choix ! La démarche compte 8 étapes : chacune a son quartier, ses informations à trouver et son arène. Le but : faire baisser les kWh, que compte le compteur en haut de l'écran.`},{w:'Mme Joule',t:"Première étape : cadrer ton site. Va dehors, lis l'adresse sur la boîte aux lettres, puis la surface sur la fiche technique. Suis la flèche orange."}])};
    cards.appendChild(c)});
}
