/* Wattlings · jeu/monde/ciel.js
   Le ciel : heure, saison, météo, et les préférences d'affichage du joueur. */

/* ================= LE CIEL : heure, saison, météo =================
   L'heure est celle de l'appareil du joueur. La date est celle du calendrier du jeu, qui avance en accéléré (ou la date réelle, au choix). Le soleil est calculé pour la latitude d'Orléans : sa hauteur donne
   la lumière (nuit, aube, jour, crépuscule), sa direction donne les ombres. La météo est simulée (le jeu n'a pas accès à
   Internet) : elle se déduit de la date et de l'heure, de façon déterministe, avec des tendances propres à chaque saison.
   Deux joueurs qui ouvrent le jeu au même moment voient donc le même temps. Les réglages du menu permettent de forcer
   un moment de la journée, un temps ou une saison. */
const PREF={wear:3,hour:'auto',meteo:'auto',saison:'auto',cal:'jeu'};
try{Object.assign(PREF,JSON.parse(localStorage.getItem(PREF_KEY)||'{}'))}catch(e){}
function prefSet(k,v){PREF[k]=v;try{localStorage.setItem(PREF_KEY,JSON.stringify(PREF))}catch(e){}SKY.stamp=0;SKY.quiet=true}
const SEASONS=['printemps','été','automne','hiver'],SEASON_DOY=[115,201,298,15];
const CLIM=[4,4.6,7.6,10.3,14.1,17.4,19.6,19.4,16.1,12.2,7.3,4.6];   // température moyenne mensuelle, ordre de grandeur pour le Loiret
const SKY={stamp:0,season:1,snowG:false,dark:0,el:45,az:180,phase:'jour',cloud:.1,rain:0,snow:0,fog:0,wind:.2,storm:false,T:18,Tm:16,dju:2,pv:.6,wet:0,
  lamps:false,winFrac:0,sh:{x:0,y:-1,a:0},amb:[255,255,255],label:'Soleil',clock:14,wd:2,date:new Date(),artKey:'',lk:'',sig:'',kind:''};
const sk01=v=>Math.max(0,Math.min(1,v));
const skH=(i,s)=>{let n=Math.imul(i|0,73856093)^Math.imul((s|0)+11,19349663);n=Math.imul(n^(n>>>15),2246822519);n=Math.imul(n^(n>>>13),3266489917);return((n^(n>>>16))>>>0)/4294967296};
function skN(t,seed){const i=Math.floor(t),f=t-i,u=f*f*(3-2*f),a=skH(i,seed),b=skH(i+1,seed);return a+(b-a)*u}   // bruit lissé à une dimension
const skDoy=d=>Math.floor((Date.UTC(d.getFullYear(),d.getMonth(),d.getDate())-Date.UTC(d.getFullYear(),0,0))/864e5);
function skClim(doy){const m=(doy-15)/30.44,i=Math.floor(m),f=m-i,a=CLIM[((i%12)+12)%12],b=CLIM[(((i+1)%12)+12)%12];return a+(b-a)*f}
/* état du ciel à un instant donné (th : heures depuis 1970, sol : heure solaire, doy : jour de l'année, se : saison) */
function skWeather(th,sol,doy,se){
  const day=Math.floor((th+1)/24),bias=[.04,-.12,.08,.14][se];
  const cloud=sk01(skN(th/9,1)*1.35-.2+bias+(skN(day/2.7,6)-.5)*.5),humid=skN(th/6+50,2);
  let rain=sk01((cloud-.6)*2.6)*sk01((humid-.5)*4.5);if(rain<.08)rain=0;
  const wind=sk01(Math.pow(skN(th/5+20,4),1.7)*1.2+(rain>.3?.15:0));
  const Tm=skClim(doy)+(skN(day/3.3,5)-.5)*9,amp=(3.5+3.5*(1-cloud))*[1,1.2,.9,.65][se],T=Tm+amp*Math.cos((sol-15)/24*2*Math.PI)-(rain>0?1.2:0);
  const storm=(se<2)&&rain>.6&&skN(th/3+9,3)>.62;
  return {cloud,humid,rain,wind,T,Tm,storm};
}
function skyUpdate(force){
  const now=Date.now();if(!force&&now-SKY.stamp<1000)return;const first=!SKY.stamp;SKY.stamp=now;
  const d=new Date(now),tz=-d.getTimezoneOffset()/60,std=Math.min(-new Date(d.getFullYear(),0,1).getTimezoneOffset(),-new Date(d.getFullYear(),6,1).getTimezoneOffset())/60;
  // le calendrier : celui du jeu (accéléré, voir m_energie.js) dès que l'histoire a commencé, sinon la date réelle
  const gcal=PREF.cal!=='reel'&&typeof S!=='undefined'&&S&&S.site&&S.en?S.en.day:null;
  let doy=gcal!==null?enDate(gcal).doy:skDoy(d),se=(doy>=80&&doy<172)?0:(doy>=172&&doy<265)?1:(doy>=265&&doy<355)?2:3;
  if(PREF.saison!=='auto'){se=Math.max(0,SEASONS.indexOf(PREF.saison));doy=SEASON_DOY[se]}
  // soleil : déclinaison, lever et coucher (en heure solaire), puis hauteur et azimut
  const rad=Math.PI/180,lat=47.9*rad,dec=23.44*rad*Math.sin(2*Math.PI*(284+doy)/365),H0=Math.acos(Math.max(-1,Math.min(1,-Math.tan(lat)*Math.tan(dec))))/rad/15;
  let clock=d.getHours()+d.getMinutes()/60+d.getSeconds()/3600,off=(tz-std)+(std===1?.87:.3),sol=clock-off;
  const forceH=(typeof S!=='undefined'&&S&&S.ch===7)?'nuit':PREF.hour;   // la ronde de nuit se joue toujours de nuit
  if(forceH!=='auto'){sol={aube:12-H0+.4,jour:12.6,crepuscule:12+H0-.45,nuit:23.6}[forceH];clock=((sol+off)%24+24)%24}
  const Hh=(sol-12)*15*rad,sinEl=Math.sin(lat)*Math.sin(dec)+Math.cos(lat)*Math.cos(dec)*Math.cos(Hh),el=Math.asin(sinEl)/rad;
  const az=(Math.atan2(Math.sin(Hh),Math.cos(Hh)*Math.sin(lat)-Math.tan(dec)*Math.cos(lat))/rad+180+360)%360;
  // météo simulée
  // en calendrier de jeu, le temps qu'il fait change en quelques minutes, et la température est celle du jour de jeu
  const th=gcal!==null?now/9e4:now/36e5+(forceH!=='auto'?(clock-(d.getHours()+d.getMinutes()/60)):0),w=skWeather(th,sol,doy,se),dT=gcal!==null&&PREF.saison==='auto'?enTm(gcal)-w.Tm:0;
  let {cloud,rain,wind,T,Tm,storm}=w,fog=0;T+=dT;Tm+=dT;
  const calm=1-sk01(wind*2.4);fog=sk01((w.humid-.42)*3.2)*calm*sk01(1-Math.abs(sol-(12-H0+.6))/3.5)*(T<13?1:0)*(rain>0?0:1);if(fog<.15)fog=0;
  let snowG=false;
  if(se===3){for(let k=0;k<=4&&!snowG;k++){const p=skWeather(th-k*3,sol-k*3,doy,se);if(p.rain>.2&&p.T+dT<1.5)snowG=true}if(T>3)snowG=false}
  const M=PREF.meteo;
  if(M==='clair'){cloud=.05;rain=0;fog=0;storm=false;wind=Math.min(wind,.3)}
  else if(M==='nuageux'){cloud=.6;rain=0;fog=0;storm=false}
  else if(M==='couvert'){cloud=.92;rain=0;fog=0;storm=false}
  else if(M==='pluie'){cloud=.92;rain=.6;fog=0;storm=false;T=Math.max(T,4)}
  else if(M==='orage'){cloud=1;rain=1;fog=0;storm=true;wind=Math.max(wind,.7);T=Math.max(T,8)}
  else if(M==='brouillard'){cloud=.55;rain=0;fog=.85;storm=false;wind=.05}
  else if(M==='neige'){cloud=.9;rain=.55;fog=0;storm=false;T=Math.min(T,-1);Tm=Math.min(Tm,0);snowG=true}
  else if(M==='vent'){cloud=.45;rain=0;fog=0;storm=false;wind=.92}
  if(M!=='auto'&&M!=='neige'&&T>3.5)snowG=false;
  const snow=rain>0&&(M==='neige'||(se===3&&T<1.5))?rain:0;if(snow)snowG=true;
  if(gcal!==null&&!force&&!first&&snowG!==SKY.snowG&&now-(SKY.snowAt||0)<120000)snowG=SKY.snowG;else if(snowG!==SKY.snowG)SKY.snowAt=now;   // la neige ne va et vient pas toutes les dix secondes
  // lumière : obscurité, teinte chaude à l'aube et au crépuscule, voile gris par temps couvert
  const k=sk01((6-el)/14),dark=Math.min(.66,k*k*(3-2*k)*.6+cloud*.05+rain*.07+(storm?.1:0)),warm=Math.exp(-Math.pow((el-1)/6.5,2))*(1-cloud*.7);
  const phase=el<-6?'nuit':el<7?(Hh<0?'aube':'crepuscule'):'jour';
  // lumière ambiante : la scène entière est multipliée par cette couleur (blanc en plein jour, bleu nuit, rosée à l'aube, orangée au crépuscule)
  {const f=sk01(dark/.66),g=fog*.0,w1=Hh<0?[1,.86,.84]:[1,.8,.62];SKY.amb=[255-(255-62)*f,255-(255-76)*f,255-(255-142)*f].map((v,i)=>Math.round(Math.min(255,v*(1-(1-w1[i])*warm*.75)*(1-cloud*[.08,.06,.03][i]))))}
  // ombres : opposées au soleil, d'autant plus longues qu'il est bas, effacées par les nuages
  const len=el>1.5?Math.min(2.3,1/Math.tan(el*rad)):0;
  SKY.sh={x:-Math.sin(az*rad)*len,y:Math.cos(az*rad)*len*.8,a:el>1.5?.3*sk01(el/7)*(1-cloud*.85)*(rain>0?.35:1)*(1-fog):0};
    if(gcal!==null&&!first&&!force&&se!==SKY.season&&PREF.saison==='auto'&&typeof toast==='function'&&S.map==='town')toast(["Le printemps est là.","C'est l'été.","L'automne arrive.","L'hiver s'installe."][se]);
  Object.assign(SKY,{date:d,clock,wd:d.getDay(),cal:gcal!==null?enLabel(gcal):null,sol,season:se,snowG,dark,el,az,phase,cloud,rain:snow?0:rain,snow,fog,wind,storm,T,Tm,dju:Math.max(0,18-Tm),
    pv:Math.max(0,sinEl)*(1-.78*cloud)*(snowG?.45:1)*(1-fog*.5),lamps:dark>.2,
    winFrac:dark<.12?0:(clock>=17||clock<1?.6:clock<5.5?.1:.35)});
  SKY.label=storm?'Orage':snow?'Neige':rain>.55?'Pluie':rain>0?'Pluie fine':fog>.4?'Brouillard':cloud>.78?'Ciel couvert':cloud>.45?'Nuageux':cloud>.2?(el<-4?'Nuit peu nuageuse':'Éclaircies'):el<-4?'Nuit claire':'Soleil';
  if(wind>.8&&!storm)SKY.label+=', vent fort';
  // sol mouillé : il se mouille vite sous la pluie et sèche lentement
  if(first){SKY.wet=rain>0&&!snow?1:0;if(!SKY.wet&&M==='auto'&&forceH==='auto')for(let k=1;k<=3&&!SKY.wet;k++){const p=skWeather(th-k*.33,sol-k*.33,doy,se);if(p.rain>0&&p.T>1.5)SKY.wet=1-k*.28}}else SKY.wet=sk01(SKY.wet+(rain>0&&!snow?.012+rain*.03:-.004*(1+wind)));
  SKY.artKey=se+'|'+(snowG?1:0)+'|'+PREF.wear;SKY.lk=(SKY.lamps?'L':'')+(snowG?'N':'');
  SKY.sig=SKY.artKey+'|'+SKY.lk+'|'+(rain>.1||snow>0?'P':'')+(dark>.5?'D':'')+'|'+Math.floor(clock*2);
  const kind=storm?'orage':snow?'neige':rain>0?'pluie':fog>.4?'brouillard':'sec',was=SKY.kind;SKY.kind=kind;
  if(!first&&!force&&was&&was!==kind&&typeof toast==='function'&&typeof S!=='undefined'&&S&&S.map==='town'&&typeof busy!=='undefined'&&!busy)
    toast({orage:"L'orage éclate.",neige:'Il se met à neiger.',pluie:was==='orage'?"L'orage s'éloigne.":'Il se met à pleuvoir.',brouillard:'Le brouillard tombe.',sec:was==='brouillard'?'Le brouillard se lève.':was==='neige'?'La neige cesse de tomber.':"La pluie s'arrête."}[kind]);
}
const skyHM=()=>{const h=Math.floor(SKY.clock),m=Math.floor((SKY.clock-h)*60);return h+' h '+String(m).padStart(2,'0')};
const skyLine=()=>`${SKY.cal||['Dimanche','Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi'][SKY.wd]} · ${skyHM()} · ${SEASONS[SKY.season]} · ${SKY.label.toLowerCase()} · ${Math.round(SKY.T)} °C`;
