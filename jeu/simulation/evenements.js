/* Wattlings · jeu/simulation/evenements.js
   Événements : économies ponctuelles proposées au fil des jours. */

/* ================= ÉVÉNEMENTS : économies ponctuelles =================
   Chaque alerte vise un site suivi (sans suivi, pas d'alerte). x.a est l'activité du site : ens, adm, com, pe, sport, pisc, cult, ehpad. */
const EN_EV=[
  {id:'vac',w:x=>(x.a==='ens'&&x.vac&&x.vd<5)||(x.a==='adm'&&x.D.k>=1221&&x.D.k<=1225)||((x.a==='com'||x.a==='pe')&&x.D.k>=727&&x.D.k<=802),
    t:x=>x.a==='ens'?`Vacances ${x.vac}`:x.a==='adm'?'Fermeture de fin d\'année':'Congés annuels',
    q:x=>`${cap(x.s.short)} ${x.s.pl?'ferment':'ferme'} pour ${x.a==='ens'?'deux semaines au moins':x.a==='adm'?'plusieurs jours':'trois semaines'}. Que fais-tu avant de partir ?`,
    o:x=>[['Mode vacances : chauffe-eau, ventilation et veilles coupés, chauffage en réduit',1,'Un bâtiment vide ne doit consommer que son strict minimum. Et ce gain-là ne se rattrape pas après coup.'],['Rien : tout repartira plus vite à la reprise',0,'Chauffer et ventiler du vide pendant des jours, c\'est la plus chère des habitudes.'],['Tout couper, y compris le hors-gel et le froid alimentaire',0,x.T<8?'Par ce temps, les canalisations gèlent. La réparation coûtera bien plus que l\'économie.':'Les denrées et les équipements n\'aiment pas ça. On coupe ce qui peut l\'être, pas tout.']],
    kwh:x=>(x.M.tal*24*.3+x.M.heatK*enHdd(x.T)*.3)*(x.a==='ens'?14:x.a==='adm'?7:21)},
  {id:'heure',w:x=>x.a!=='pisc'&&((x.D.k>=1025&&x.D.k<=1112)||(x.D.k>=328&&x.D.k<=410)),t:()=>'Changement d\'heure',
    q:x=>`L'horloge du chauffage ${enDe(x.s)} n'a pas changé d'heure : le bâtiment chauffe une heure trop tôt chaque matin.`,
    o:()=>[['Recaler l\'horloge de programmation',1,'Deux minutes de réglage, des semaines de chauffage inutile évitées. Les horloges se dérèglent : on les vérifie à chaque changement d\'heure.'],['Passer la chaudière en marche forcée',0,'La marche forcée, c\'est la porte ouverte à la dérive : on l\'oublie, et elle tourne tout l\'hiver.'],['Attendre le prochain changement d\'heure',0,'Six mois à chauffer une heure de trop chaque jour.']],kwh:x=>Math.max(60,x.M.heatK*Math.max(3,enHdd(x.T))*.04*30)},
  {id:'froid',w:x=>x.T<2&&['ens','adm','pe','cult'].includes(x.a),t:()=>'Vague de froid',q:x=>`Grand froid annoncé, et ${x.s.short} ${x.s.pl?'seront vides':'sera vide'} tout le week-end. Que fais-tu du chauffage ?`,
    o:()=>[['Réduit à 12 °C : le hors-gel est assuré',1,'On protège le bâtiment sans le chauffer pour personne. Plus il fait froid, plus ce réglage rapporte.'],['On laisse à 19 °C, par prudence',0,'C\'est justement par grand froid que chauffer du vide coûte le plus.'],['On coupe tout',0,'À cette température, les canalisations gèlent. Une économie qui finit en dégât des eaux.']],kwh:x=>x.M.heatK*enHdd(x.T)*2*.42},
  {id:'chaud',w:x=>x.T>23.5&&(x.s.p.clim||x.a==='com'),t:()=>'Canicule',
    q:x=>x.a==='com'?'Forte chaleur toute la semaine. Les vitrines et la chambre froide peinent. Que fais-tu ?':`Forte chaleur toute la semaine. La climatisation ${enDe(x.s)} tourne à plein. Quel réglage ?`,
    o:x=>x.a==='com'?[['Nettoyer les condenseurs, vérifier les joints, baisser les rideaux de nuit',1,'Un groupe froid encrassé consomme bien plus par forte chaleur. L\'entretien est la première des économies.'],['Baisser la consigne du froid de 3 °C, pour être tranquille',0,'Plus froid que nécessaire, c\'est plus de kWh pour la même qualité.'],['Laisser les portes ouvertes pour aérer le magasin',0,'La chaleur entre, et le froid travaille deux fois plus.']]
      :[[x.a==='ehpad'?'Consigne à 26 °C, stores baissés, ventilation la nuit':'Consigne à 26 °C, stores baissés, arrêt la nuit et le week-end',1,'Chaque degré de moins sur la climatisation, c\'est environ 7 % de consommation en plus. Et la nuit, l\'air frais est gratuit.'],['Consigne à 21 °C, en continu',0,'Cinq degrés de trop, jour et nuit : la facture de l\'été s\'envole.'],
        x.a==='ehpad'?['On coupe la climatisation partout',0,'Par canicule, ce serait mettre les résidents en danger. On règle, on ne supprime pas.']:['On coupe la climatisation, salle serveurs comprise',0,'Les serveurs ne survivront pas. On règle, on ne supprime pas.']],
    kwh:x=>x.a==='com'?x.M.tal*24*5*.09:x.M.coolK*Math.max(2,x.T-20)*5*.3},
  {id:'pointe',w:x=>x.T<5&&x.o>0,t:()=>'Jour de pointe sur le réseau',q:()=>'Le réseau électrique est très sollicité ce soir, entre 18 h et 20 h. On demande à chacun de réduire sa consommation.',
    o:()=>[['Décaler ce qui peut attendre et baisser d\'un degré pendant deux heures',1,'Peu de kWh, mais au pire moment : ceux-là comptent double pour le réseau.'],['Tout laisser tourner : ce n\'est pas notre problème',0,'Un peu partout en même temps, c\'est justement ce qui évite la coupure.'],['Lancer les gros appareils maintenant, pour en être débarrassé',0,'C\'est exactement l\'inverse de ce qu\'il faut faire.']],kwh:x=>Math.max(15,x.M.useK*.04)},
  {id:'fenetre',w:x=>enHdd(x.T)>4&&x.a!=='pisc',t:()=>'Gaz du week-end anormal',q:x=>`Tes alertes signalent que ${x.s.short} ${x.s.pl?'ont':'a'} consommé deux fois plus de gaz que prévu ce week-end.`,
    o:()=>[['Aller voir sur place',1,'Une fenêtre est restée grande ouverte, radiateur à fond dessous. Fermée : l\'alerte a servi. Sans elle, ça durait jusqu\'au printemps.'],['Monter la consigne : il doit faire froid dedans',0,'On chauffe encore plus la rue.'],['Ignorer : sûrement une fausse alerte',0,'Tes données sont fiabilisées : une alerte mérite au moins un coup d\'œil.']],kwh:x=>x.M.heatK*enHdd(x.T)*2*.5},
  {id:'fuite',w:()=>true,t:()=>'Talon de nuit en hausse',q:x=>`Depuis trois nuits, le talon ${enDe(x.s)} est monté d'un cran. Rien n'a changé dans le bâtiment, en principe.`,
    o:x=>[['Chercher ce qui tourne la nuit',1,x.a==='com'?'La porte de la chambre froide fermait mal de nouveau. Joint remplacé.':x.a==='adm'||x.a==='cult'?'La ventilation avait été relancée en manuel après un dépannage. Remise en automatique.':x.a==='pisc'?'Une pompe de filtration tournait à plein régime toute la nuit. Remise sur son horloge.':'Un ballon d\'eau chaude fuyait : il chauffait en continu. Réparé.'],['Attendre la facture pour voir',0,'La facture arrive dans six semaines. D\'ici là, ça tourne toutes les nuits.'],['Relever le seuil de l\'alerte',0,'Relever le seuil, c\'est apprendre à ne plus voir la dérive.']],kwh:x=>x.M.tal*24*.15*20}];
const cap=s=>s.charAt(0).toUpperCase()+s.slice(1);
const enDe=s=>s.short.startsWith('le ')?'du '+s.short.slice(3):s.short.startsWith('les ')?'des '+s.short.slice(4):'de '+s.short;      // « de le » se dit « du »
function enCtx(g,sid){sid=sid||S.site;const s=enSite(sid),D=enDate(g),vac=enVac(D);let vd=0;if(vac){while(vd<70&&enVac(enDate(g-vd-1))===vac)vd++}return {g,sid,s,a:s.a,D,T:enTm(g),o:enOccA(s.a,D),vac,vd,M:enModel(sid)}}
const enEvSites=()=>[S.site].concat(enMon().map(i=>'p'+i));      // les sites qui peuvent lever une alerte : ceux qu'on suit
function enEvents(g){
  const e=EN(),ev=e.ev;if(S.ch<8)return;
  if(ev.cur){if(g>=ev.cur.exp){ev.miss++;e.log.push([g,'miss',ev.cur.id,Math.round(ev.cur.kwh)]);toast(`Alerte ignorée : ${fmtKwh(ev.cur.kwh)} qui ne seront jamais économisés.`);ev.cur=null;ev.next=g+10;enHud(true)}return}
  if(!ev.next){ev.next=g+6;return}
  // les rendez-vous du calendrier (vacances, changement d'heure) ne se ratent pas ; le reste arrive au fil de la météo
  const L=enEvSites(),r0=(wh(g,5,899)*L.length)|0,rot=L.slice(r0).concat(L.slice(0,r0)),calOf=q=>{for(const sid of rot){const x=enCtx(q,sid),c=EN_EV.slice(0,2).find(E=>E.w(x));if(c)return [c,x]}return null};
  const cal=calOf(g),ck=cal?cal[0].id+':'+(cal[0].id==='vac'?(cal[1].a==='ens'?g-cal[1].vd:cal[1].a+cal[1].D.an):cal[1].D.an+'-'+cal[1].D.m):'';let E=null,x=null;
  if(cal&&ev.calk!==ck){E=cal[0];x=cal[1];ev.calk=ck}
  else{if(g<ev.next)return;for(let d=1;d<=18;d++){const c=calOf(g+d);if(c&&(c[0].id+':'+(c[0].id==='vac'?(c[1].a==='ens'?g+d-c[1].vd:c[1].a+c[1].D.an):c[1].D.an+'-'+c[1].D.m))!==ev.calk){ev.next=g+2;return}}   // on laisse la place au rendez-vous qui approche
    for(const sid of rot){const y=enCtx(g,sid),C=EN_EV.slice(2).filter(q=>q.id!==ev.last&&q.w(y));if(C.length){E=C[(wh(g,7,900)*C.length)|0];x=y;break}}
    if(!E){ev.next=g+3;return}}
  ev.cur={id:E.id,sid:x.sid,day:g,exp:g+17,kwh:Math.max(10,Math.round(E.kwh(x)/10)*10)};ev.last=E.id;ev.next=g+17+8+((wh(g,3,901)*10)|0);
  if(!busy)toast('Alerte énergie : '+E.t(x)+(e.pk.on?' ('+x.s.n+')':'')+'.');enHud(true);
}
function enAnswer(i){
  const e=EN(),ev=e.ev,c=ev.cur;if(!c)return null;const E=EN_EV.find(q=>q.id===c.id),x=enCtx(c.day,c.sid),o=E.o(x)[i],ok=!!o[1];
  if(ok){e.one+=c.kwh;enEarn(c.kwh*((c.id==='chaud'||c.id==='pointe'||c.id==='fuite')?EN_PE:EN_PG));ev.ok++;gainXP(10);sfx('ok')}else{ev.ko++;sfx('bad')}
  e.log.push([Math.floor(e.day),ok?'ok':'ko',c.id,Math.round(c.kwh)]);trk('setting',{k:'energie_alerte',v:c.id+(ok?':ok':':ko')});ev.cur=null;save();enHud(true);return {ok,fb:o[2],kwh:c.kwh,t:E.t(x)};
}
