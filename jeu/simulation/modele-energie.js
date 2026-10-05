/* Wattlings · jeu/simulation/modele-energie.js
   Le fil rouge des kWh : calendrier, profils de consommation des sites, actions et leurs économies. */

/* ================= LE FIL ROUGE : LES kWh ÉCONOMISÉS =================
   Le but d'une démarche d'energy management, c'est de consommer moins de kWh. Tout le reste y mène.
   - Un compteur, toujours à l'écran, donne les kWh économisés depuis le début de la partie. Il reste à 0 pendant toutes les étapes
     « donnée » : elles n'économisent rien, elles rendent les économies possibles.
   - Trois états : gisement IDENTIFIÉ (Analyser, Détecter), économies RÉALISÉES (Agir), économies PROUVÉES (Mesurer).
   - Deux natures : les économies CONTINUES (talon, consigne, réduit, LED, isolation) rapportent chaque jour tant qu'elles tiennent ;
     les économies PONCTUELLES répondent à un événement (vague de froid, vacances, incident) et ne comptent qu'une fois.
   - Chaque euro économisé alimente un FONDS DE TRAVAUX : plus on économise, plus on peut investir.
   - Le temps du jeu est accéléré (EN_DPM jours par minute réelle). Chaque jour, la consommation du site dépend de la météo et du calendrier :
     chauffage quand il fait froid, climatisation quand il fait chaud, école au ralenti pendant les vacances.
   - Les économies sont comptées « à météo comparable » : on compare à ce que le site aurait consommé sans action, le même jour.
   - En fin de jeu, la même mécanique s'étend aux 20 sites du patrimoine : un seul fonds, un seul compteur. Un site ne rapporte rien tant qu'il
     n'est pas SUIVI (0 kWh, mais sans données on ne voit rien), puis on y lance les actions une à une. Objectif : −40 % sur le parc.
   Tous les chiffres sont fictifs, d'ordre de grandeur réaliste. */
const EN_DPM=7,EN_PE=.186,EN_PG=.09,EN_SEED=1500;
let EN_AID=2,EN_ENV=[0,40000,80000,200000,0];      // parc : euros d'aides ajoutés à chaque euro économisé ; enveloppe votée à chaque palier de −10 %
const EN_MD=[31,28,31,30,31,30,31,31,30,31,30,31],EN_MN=['janvier','février','mars','avril','mai','juin','juillet','août','septembre','octobre','novembre','décembre'],EN_MS=['janv.','févr.','mars','avr.','mai','juin','juil.','août','sept.','oct.','nov.','déc.'],EN_WD=['Dimanche','Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi'];
/* calendrier du jeu : le jour 0 est un lundi 1er septembre (la rentrée) */
function enDate(g){const n=Math.floor(g),d0=((243+n)%365+365)%365;let m=0,d=d0;while(d>=EN_MD[m]){d-=EN_MD[m];m++}return {n,doy:d0+1,m,d:d+1,k:(m+1)*100+d+1,wd:((n+1)%7+7)%7,an:1+Math.floor(n/365)}}
const enLabel=g=>{const D=enDate(g);return `${EN_WD[D.wd]} ${D.d}${D.d===1?'er':''} ${EN_MN[D.m]}, an ${D.an}`},enShort=g=>{const D=enDate(g);return `${D.d}${D.d===1?'er':''} ${EN_MN[D.m]}`};
/* vacances scolaires (calendrier approché de la zone d'Orléans, identique chaque année) */
const enVac=D=>{const k=D.k;return k>=1019&&k<=1103?'de la Toussaint':k>=1221||k<=105?'de Noël':k>=215&&k<=302?"d'hiver":k>=412&&k<=427?'de printemps':k>=705&&k<=831?"d'été":''};
/* température moyenne du jour : la normale de saison, plus des vagues de douceur et de froid de quelques semaines */
const enTm=g=>skClim(enDate(g).doy)+(skN(g/21,5)-.5)*9+(skN(g/4.3,15)-.5)*3;
const enHdd=T=>T<15?17-T:0;
/* ---- les sites : celui du joueur (histoire) et les 20 du patrimoine (« p0 » à « p19 ») ---- */
/* profil : part du talon et de la climatisation (ou du froid) dans l'électricité, part du chauffage dans le gaz */
const EN_PROF={ecole:{eTal:.5,eCool:0,cb:20,cu:.3,gHeat:.9,hu:.95,kwc:36,cf:1,clim:0},bureau:{eTal:.38,eCool:.15,cb:20,cu:.25,gHeat:1,hu:.95,kwc:36,cf:1,clim:1},boulangerie:{eTal:.6,eCool:.06,cb:12,cu:1,gHeat:.3,hu:.9,kwc:9,cf:.3,clim:0}};
const EN_PA={ens:{eTal:.5,eCool:0,cb:20,cu:.3,gHeat:.9,hu:.95,clim:0},pe:{eTal:.4,eCool:.03,cb:22,cu:.3,gHeat:.85,hu:.95,clim:0},sport:{eTal:.35,eCool:0,cb:20,cu:.3,gHeat:.9,hu:.95,clim:0},
  pisc:{eTal:.6,eCool:0,cb:20,cu:1,gHeat:.35,hu:1,clim:0},adm:{eTal:.38,eCool:.15,cb:20,cu:.25,gHeat:1,hu:.95,clim:1},cult:{eTal:.4,eCool:.08,cb:20,cu:.3,gHeat:.95,hu:.95,clim:1},ehpad:{eTal:.55,eCool:.06,cb:21,cu:1,gHeat:.75,hu:1,clim:1}};
const EN_KEY={ecole:'ens',bureau:'adm',boulangerie:'com'};
const EN_PSH=[['l’école Jean-Jaurès',1],['l’école Pasteur',1],['la maternelle Les Tilleuls',1],['le groupe scolaire Victor-Hugo',0],['l’école Marie-Curie',1],['la crèche Les Lucioles',1],['la crèche Pom’Pouce',1],['le gymnase Coubertin',0],['le gymnase des Sablons',0],['le dojo municipal',0],
  ['la piscine Aqualoire',1],['l’hôtel de ville',0],['l’annexe Le Carré',1],['le centre technique municipal',0],['la médiathèque',1],['la salle des fêtes',1],['l’école de musique',1],['le centre social',0],['la maison des associations',1],['la résidence Les Glycines',1]];
const EN_SC={};
function enSite(sid){
  if(EN_SC[sid])return EN_SC[sid];
  if(sid[0]==='p'&&sid.length<4){const i=+sid.slice(1),P=PSITES[i],cf=Math.max(.3,Math.min(2.5,P.surf/2000));return EN_SC[sid]={sid,i,a:P.a,n:P.n,short:EN_PSH[i][0],fem:EN_PSH[i][1],pl:0,elec:P.e,gaz:P.g,surf:P.surf,p:EN_PA[P.a],cf,kwc:Math.round(Math.min(100,36*P.surf/2000)),der:null}}
  const s=SITES[sid],p=EN_PROF[sid];return EN_SC[sid]={sid,i:-1,a:EN_KEY[sid],n:s.name,short:s.short,fem:sid!=='bureau',pl:sid==='bureau',elec:s.elec,gaz:s.gaz,surf:s.surface,p,cf:p.cf,kwc:p.kwc,der:.5+s.derRdc[1]+s.derCave[1]};
}
/* occupation du site ce jour-là (0 : fermé, 1 : pleine activité), selon son activité */
function enOccA(a,D){
  const k=D.k,we=D.wd===0||D.wd===6;
  switch(a){
    case 'ens':return enVac(D)||we?0:D.wd===3?.5:1;
    case 'adm':return we?0:(k>=1224||k<=101)?.15:D.m===7?.6:1;
    case 'com':return D.wd===1?0:(k>=803&&k<=824)?0:1;                          // boulangerie : fermée le lundi et trois semaines en août
    case 'pe':return we||(k>=801&&k<=824)||k>=1224||k<=101?0:1;
    case 'sport':{const v=enVac(D);return k>=705&&k<=831?.25:(v?.6:1)*(D.wd===0?.4:D.wd===6?.7:1)}
    case 'pisc':return k>=901&&k<=914?.1:D.wd===0?.8:1;                          // vidange annuelle début septembre
    case 'cult':return D.wd===1?0:D.wd===0?.3:D.m===7?.5:1;
    default:return 1;                                                            // résidence : occupée jour et nuit, toute l'année
  }
}
const enOcc=(sid,D)=>enOccA(enSite(sid).a,D);
const EN_M={};
function enModel(sid){
  if(EN_M[sid])return EN_M[sid];const s=enSite(sid),p=s.p;let so=0,sc=0,sh=0;
  for(let g=0;g<365;g++){const D=enDate(g),o=enOccA(s.a,D),T=enTm(g);so+=o;sc+=Math.max(0,T-p.cb)*(o>0?1:p.cu);sh+=enHdd(T)*(o>0?1:p.hu)}
  const E=s.elec*1000,G=s.gaz*1000,tal=E*p.eTal/8760;
  return EN_M[sid]={tal,useK:E*(1-p.eTal-p.eCool)/so,coolK:sc?E*p.eCool/sc:0,heatK:G*p.gHeat/sh,gUseK:G*(1-p.gHeat)/so,der:s.der!==null?s.der:tal*(s.a==='ehpad'||s.a==='pisc'?.15:.45)};
}
const enSun=g=>(1+3.5*(1-Math.cos(2*Math.PI*(enDate(g).doy-355)/365))/2)*(.7+.6*skN(g/3,17));   // kWh produits par kWc et par jour
/* les actions : rev = badge qui la fait entrer dans le gisement identifié (5 Analyser, 6 Détecter, 7 Agir) ; only / no = activités concernées ou exclues */
const EN_ACT=[
  {id:'consigne',t:'Consigne de chauffage : un degré de moins',cat:'Sobriété',cost:0,rev:5,why:'1 °C de moins, c’est environ 7 % de chauffage en moins.'},
  {id:'veilles',t:'Chasse aux veilles : horloges, prises coupe-veille',cat:'Sobriété',cost:400,rev:6,why:'Le talon redescend, toutes les nuits et tous les week-ends.'},
  {id:'reduit',t:'Programmer le réduit de nuit et de week-end',cat:'Sobriété',cost:800,rev:6,no:['ehpad','pisc'],why:'On ne chauffe plus un bâtiment vide.'},
  {id:'ps',t:'Ajuster la puissance souscrite',cat:'Contrat',cost:0,rev:5,zero:1,why:'La facture baisse, pas la consommation : 0 kWh.'},
  {id:'led',t:'Relamping LED',cat:'Efficacité',cost:9000,rev:5,why:'Le même éclairage pour moitié moins d’électricité.'},
  {id:'combles',t:'Isolation des combles',cat:'Efficacité',cost:22000,rev:5,why:'La chaleur s’échappe d’abord par le toit.'},
  {id:'couv',t:'Couverture thermique du bassin, la nuit',cat:'Équipement',cost:18000,rev:7,only:'pisc',why:'L’eau chaude s’évapore : couvrir le bassin la nuit garde la chaleur dedans.'},
  {id:'pac',t:'Remplacer la chaudière par une pompe à chaleur',cat:'Équipement',cost:45000,rev:7,why:'Près de trois fois moins d’énergie pour la même chaleur. Beaucoup de kWh en moins, peu d’euros : l’électricité coûte plus cher que le gaz.'},
  {id:'pv',t:'Panneaux photovoltaïques',cat:'Production',cost:40000,rev:7,prod:1,why:'Produire n’est pas économiser : le compteur de kWh économisés ne bouge pas, la facture oui.'}];
const enAct=id=>EN_ACT.find(a=>a.id===id);
const enActs=sid=>{const a=enSite(sid||S.site).a;return EN_ACT.filter(x=>(!x.only||x.only===a)&&!(x.no&&x.no.includes(a)))};
const enCost=(a,sid)=>{const cf=enSite(sid||S.site||'ecole').cf,st=!sid||sid[0]!=='p';return a.cost>1000?Math.round(a.cost*cf/100)*100:st?a.cost:Math.round(a.cost*Math.max(.5,cf)/100)*100};
/* une journée d'un site : consommation de référence (sans action), économies de chaque action en place, production */
function enDay(sid,g,acts){
  const M=enModel(sid),S0=enSite(sid),p=S0.p,D=enDate(g),o=enOccA(S0.a,D),T=enTm(g),on=id=>acts&&acts[id]!==undefined&&acts[id]<=g;
  const eT=M.tal*24,eU=M.useK*o,eC=M.coolK*Math.max(0,T-p.cb)*(o>0?1:p.cu),gH=M.heatK*enHdd(T)*(o>0?1:p.hu),gU=M.gUseK*o,sav={};
  if(on('veilles'))sav.veilles=Math.min(eT*.8,M.der*(o>=1?14:o>0?19:24));
  if(on('led'))sav.led=eU*.11;
  let m=1;if(on('consigne')){sav.consigne=gH*m*.07;m*=.93}if(on('reduit')){const r=o>0?.1:.38;sav.reduit=gH*m*r;m*=1-r}if(on('combles')){sav.combles=gH*m*.18;m*=.82}   // les pourcentages se multiplient
  if(on('pac')){sav.pac=gH*m*.62;m*=.38}if(on('couv'))sav.couv=gU*.28;
  const se=(sav.veilles||0)+(sav.led||0),sg=(sav.consigne||0)+(sav.reduit||0)+(sav.combles||0)+(sav.couv||0),sp=sav.pac||0,prod=on('pv')?S0.kwc*enSun(g):0;
  return {D,o,T,eT,eU,eC,gH,gU,ref:eT+eU+eC+gH+gU,se,sg:sg+sp,s:se+sg+sp,sav,prod,eur:se*EN_PE+sg*EN_PG+sp*.031+prod*EN_PE*.8+(on('ps')?270*S0.cf/365:0)};
}
/* bilan d'une année type avec un jeu d'actions (sert à chiffrer le gisement et les gains annoncés) */
const EN_YC={};
function enYear(sid,ids){
  const k=sid+'|'+ids.join();if(EN_YC[k])return EN_YC[k];const acts={};ids.forEach(i=>acts[i]=-1);const r={kwh:0,eur:0,prod:0,ref:0,by:{}};
  for(let g=0;g<365;g++){const d=enDay(sid,g,acts);r.kwh+=d.s;r.eur+=d.eur;r.prod+=d.prod;r.ref+=d.ref;for(const i in d.sav)r.by[i]=(r.by[i]||0)+d.sav[i]}
  return EN_YC[k]=r;
}
const enGain=(id,sid)=>{const y=enYear(sid||S.site,[id]);return {kwh:Math.round(y.kwh/10)*10,prod:Math.round(y.prod/10)*10,eur:Math.round(y.eur/10)*10}};
