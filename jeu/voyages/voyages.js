/* Wattlings · jeu/voyages/voyages.js
   Les voyages en train : ce qui est commun à toutes les destinations.
   Une destination = un dossier (voyages/solaire/, …) qui déclare son site (voyDeclarer) et sa carte (voyCarte).
   Tout ce qu'un voyage enregistre vit dans la sauvegarde sous S.voy : passeport, informations vues, tampons. */

/* ================= VOYAGES ================= */
const VOY={sites:{},ordre:[],dessins:{},trajet:null};

/* la gare ouvre à l'épilogue, une fois les 8 badges et le patrimoine terminés */
const voyOuvert=()=>S.ch>=11&&!!S.site;

/* ce que la ville dit des voyages : sur le diplôme de fin, puis dans l'objectif de l'épilogue */
const voyAnnonce=()=>`<p><b>Et aussi :</b> la gare d'Ampère-sur-Loire a rouvert. Tu sais maintenant où part l'électricité ; un train t'emmène voir d'où elle vient. Demande ton passeport des énergies au guichet.</p>`;
function voyObjectifVille(){
  if(!voyOuvert())return '';
  const v=S.voy||{},reste=VOY.ordre.filter(id=>VOY.sites[id].ouvert&&!(v.tampons&&v.tampons[id]));
  return !v.pass?" La gare a rouvert : va chercher ton passeport des énergies au guichet.":reste.length?` À la gare, un train part pour ${VOY.sites[reste[0]].gare}.`:'';
}

/* l'état des voyages dans la sauvegarde (créé à la première utilisation : les anciennes parties n'en ont pas) */
function voyEtat(){const v=S.voy=S.voy||{};v.infos=v.infos||{};v.faits=v.faits||{};v.tampons=v.tampons||{};return v}

/* ---- déclarer une destination ----
   d : { nom, gare, region, theme, ouvert, accroche, carte, arrivee:[x,y,direction], annonces:[…], paysage:{…}, infos:[{id,cle,t,x}], pret } */
function voyDeclarer(id,d){d.id=id;d.infos=d.infos||[];VOY.sites[id]=d;VOY.ordre.push(id)}

/* ---- déclarer une carte de voyage ----
   d.plan : la carte, une chaîne par rangée, un caractère par case.
   d.legende : pour chaque caractère, le pinceau qui le dessine (voir voyages/peinture.js).
   Sont infranchissables les caractères de SOLID (monde/cartes.js) : T W ~ f B w p x h R r u k P m.
   d.objets(liste) ajoute personnages et objets ;
   d.objectif() donne le texte d'objectif ; d.cibles() les flèches ; d.apres(c,ox,oy,t) la lumière. */
function voyCarte(id,d){
  const g=d.plan.map(l=>l.split('')),w=g[0].length;
  g.forEach((l,i)=>{if(l.length!==w)throw new Error(`Carte « ${id} » : la rangée ${i+1} compte ${l.length} cases au lieu de ${w}.`)});
  const m=MAPS[id]=Object.assign({g,name:d.nom,voy:1,musique:'town'},d);
  if(d.legende&&!d.peindre)m.peindre=(sol,devant)=>voyPeindre(sol,devant,m);   // la carte se peint d'après sa légende (voyages/peinture.js)
  // la liste des objets n'est refaite que lorsque le passeport change (une information de plus, un tampon) : entre-temps, elle est gardée telle quelle
  if(d.objets){let liste=null,cle='';m.objets=o=>{const k=voyCle();if(!liste||k!==cle){cle=k;liste=[];d.objets(liste)}for(const x of liste)o.push(x)}}
}
const voyCle=()=>{const v=S.voy||{};return (v.pass?1:0)+'|'+Object.keys(v.infos||{}).length+'|'+Object.keys(v.faits||{}).length+'|'+Object.keys(v.tampons||{}).length+'|'+(VOY.tour||0)};
/* à appeler quand un objet doit changer sans que le passeport ait bougé (un personnage qui change de réplique, par exemple) */
const voyRafraichir=()=>{VOY.tour=(VOY.tour||0)+1};

/* ---- dessins des voyages : VOY.dessins.nom=(c,o,X,Y,t)=>{…}, pour les objets {kind:'nom',voy:1} ---- */
function voyDessiner(c,o,X,Y,t){const f=VOY.dessins[o.kind];if(!f)return false;f(c,o,X,Y,t);return true}

/* ---- lumière : le site visité vit sous le même ciel que la ville (heure, météo) ---- */
function voyLumiere(c,ox,oy){
  const A=SKY.amb;if(Math.min(A[0],A[1],A[2])>=250)return;
  c.save();c.globalCompositeOperation='multiply';c.fillStyle=`rgb(${A[0]},${A[1]},${A[2]})`;c.fillRect(0,0,cv.width,cv.height);c.restore();
  if(SKY.dark>.35){const x=P.px-ox+8,y=P.py-oy+6,g=c.createRadialGradient(x,y,4,x,y,46);g.addColorStop(0,`rgba(255,226,170,${.22*SKY.dark})`);g.addColorStop(1,'rgba(255,226,170,0)');c.fillStyle=g;c.fillRect(x-46,y-46,92,92)}
}

/* ---- panneaux : les voyages n'ont pas de page de cours, le lien « Revoir le cours » est retiré ---- */
function voyPanneau(titre){const ov=openPanel(titre),l=ov.querySelector('.course-link');if(l)l.remove();return ov}
/* une suite d'étapes dans un panneau (comme runSteps). Avec plusTard:true, un bouton permet de refermer avant la fin : rien n'est validé. */
function voyEtapes(titre,etapes,fin,options){
  const ov=voyPanneau(titre),body=ov.querySelector('.pbody'),st=ov.querySelector('.step');let i=0;
  if(options&&options.plusTard){const q=document.createElement('button');q.type='button';q.className='course-link voy-plus-tard';q.textContent='Plus tard ✕';q.title="Refermer : tu pourras recommencer quand tu veux";q.onclick=()=>{closePanel();if(options.abandon)options.abandon()};st.parentNode.insertBefore(q,st)}
  const afficher=()=>{st.textContent=etapes.length>1?`${i+1} / ${etapes.length}`:'';body.innerHTML='';ov.scrollTop=0;etapes[i](body,suite)};
  const suite=()=>{i++;if(i>=etapes.length){closePanel();save();if(fin)fin()}else afficher()};afficher();
}

/* ================= INFORMATIONS DE VOYAGE =================
   Chaque site a sa liste d'informations (dans son fichier textes.js). On les trouve en examinant le site et en parlant aux gens ;
   les informations « clés » sont exigées avant le défi final. */
const voyInfoVue=(sid,id)=>!!(S.voy&&S.voy.infos&&S.voy.infos[sid+'.'+id]);
const voyInfosVues=sid=>VOY.sites[sid].infos.filter(f=>voyInfoVue(sid,f.id));
const voyClesManquantes=sid=>VOY.sites[sid].infos.filter(f=>f.cle&&!voyInfoVue(sid,f.id));
const voyTampon=sid=>!!(S.voy&&S.voy.tampons&&S.voy.tampons[sid]);

function voyDonnerInfo(sid,id,cb){
  const site=VOY.sites[sid],f=site.infos.find(x=>x.id===id);
  if(!f||voyInfoVue(sid,id)){if(cb)cb();return}
  voyEtat().infos[sid+'.'+id]=1;save();sfx('secret');trk('voyage_info',{site:sid,id,cle:!!f.cle});
  const ov=voyPanneau('Carnet de voyage'),b=ov.querySelector('.pbody'),n=voyInfosVues(sid).length;
  b.innerHTML=`<div class="fiche${f.cle?' req':''}"><div class="fiche-top"><span class="tag">${esc(site.nom)}</span>${f.cle?'<span class="tag key">Info clé</span>':''}<span class="fiche-k">${esc(site.theme)}</span></div><h3>${esc(f.t)}</h3><p>${esc(f.x)}</p>${f.retiens?`<p class="voy-retiens"><b>À retenir :</b> ${esc(f.retiens)}</p>`:''}</div><p class="dnote">Passeport : ${n} / ${site.infos.length} informations sur ce site.</p><div class="row"><button class="btn" id="vOk">Noter dans le passeport ▸</button></div>`;
  const ok=b.querySelector('#vOk');
  ok.onclick=()=>{closePanel();gainXP(f.cle?15:10);hud();if(f.cle&&!voyClesManquantes(sid).length&&!voyTampon(sid)&&site.pret)toast(site.pret);if(cb)cb()};ok.focus();
}

/* quelqu'un (ou quelque chose) qui détient une information : il parle, puis la donne ; ensuite il radote.
   qui : nom affiché (null pour un objet) ; lignes : ce qu'il dit la première fois ; ensuite : ce qu'il dit après. */
function voySource(sid,id,qui,lignes,ensuite){
  const L=t=>qui?{w:qui,t}:{t};
  return()=>{if(!voyInfoVue(sid,id))say(lignes.map(L),()=>voyDonnerInfo(sid,id));else say((ensuite||lignes.slice(-1)).map(L))};
}
/* une remarque sans information à la clé (les vannes) */
const voyDire=(qui,lignes)=>()=>say(lignes.map(t=>qui?{w:qui,t}:{t}));

/* ---- flèches d'objectif d'un site : vers les informations clés manquantes, puis vers le défi final ---- */
function voyCibles(sid,lieux,defi){
  if(voyTampon(sid))return [];
  const m=voyClesManquantes(sid).map(f=>lieux[f.id]).filter(Boolean);
  return m.length?m:[defi];
}

/* ---- tampon : le défi final d'un site est gagné ---- */
function voyTamponner(sid,cb){
  const site=VOY.sites[sid],v=voyEtat();if(v.tampons[sid]){if(cb)cb();return}
  v.tampons[sid]=Date.now();S.xp+=60;save();hud();jingle('badge');trk('voyage_tampon',{site:sid,n:Object.keys(v.tampons).length});
  const ov=voyPanneau('Passeport des énergies'),b=ov.querySelector('.pbody'),n=Object.keys(v.tampons).length,N=VOY.ordre.length;
  b.innerHTML=`<div class="voy-tampon-box"><canvas width="48" height="48" class="voy-tampon pose"></canvas><div><h3>Tampon obtenu : ${esc(site.nom)}</h3><p>${esc(site.bravo||'')}</p><p class="dnote">${n} / ${N} tampons · +60 XP. Ton passeport est dans le menu, onglet Passeport.</p></div></div><div class="row"><button class="btn" id="vOk">Ranger le passeport ▸</button></div>`;
  passeportTampon(b.querySelector('canvas').getContext('2d'),sid,true);
  const ok=b.querySelector('#vOk');ok.onclick=()=>{closePanel();if(cb)cb()};ok.focus();
}
