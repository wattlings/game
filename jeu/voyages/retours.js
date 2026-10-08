/* Wattlings · jeu/voyages/retours.js
   « Culture énergie » : les voyages en train sont une annexe du parcours. Chaque tampon débloque, dans la console de l'EMS du bureau
   (interface/ems-bureau.js), un atelier « De retour au bureau » qui applique la leçon du site visité au site du joueur :
     solaire : combien de panneaux sur ton toit, pour une autoconsommation qui tienne ;
     data center : le PUE de ton local informatique, et sa chaleur perdue ;
     barrage : la pointe et le prix de l'heure, en déplaçant un usage de ton site ;
     éolien et nucléaire : le carbone de ton contrat (garanties d'origine) contre le carbone de tes kWh.
   Tous les chiffres sont fictifs, d'ordre de grandeur réaliste. */

const RET_TITRES={solaire:'Du solaire sur ton toit',datacenter:'Le local informatique',barrage:'La pointe et le prix de l’heure',eolien:'Le carbone de ton contrat',nucleaire:'Le carbone de ton contrat'};
const retFait=sid=>!!(emsGet('retours')||{})[sid];
const retNoter=sid=>{emsSet('retours',Object.assign({},emsGet('retours'),{[sid]:1}));trk('setting',{k:'retour_bureau',v:sid})};

/* ---- solaire : la taille de l'installation, sur la courbe du site ---- */
const RET_TOIT={ecole:60,bureau:200,boulangerie:24};
function retSolaire(sid,kwc){
  const c=weekCurve(sid);let prod=0,auto=0;
  c.forEach((v,i)=>{const t=(i%48)/2+.25,p=t<=6.75||t>=20.5?0:kwc*.78*Math.pow(Math.sin(Math.PI*(t-6.75)/13.75),1.3);prod+=p/2;auto+=Math.min(p,v)/2});
  return {prod,auto,ac:prod?auto/prod*100:100,ap:auto/c.reduce((a,v)=>a+v/2,0)*100};
}
function retourSolaire(el,next){
  const s=site(),max=RET_TOIT[s.id]||40;let essais=0;
  let kmax=0;for(let k=1;k<=max;k++)if(retSolaire(s.id,k).ac>=75)kmax=k;
  el.innerHTML=`<div class="ems">${emsBarre('de retour au bureau · '+RET_TITRES.solaire)}
    <p>À Saint-Photon, Mme Zénith te l'a dit : un kWh produit et consommé sur place vaut bien plus qu'un kWh revendu. Ton toit peut porter jusqu'à <b>${max} kWc</b>. Combien en poser, pour une semaine de mai de <b>ton</b> site ? La règle de la maison : au moins <b>75 % d'autoconsommation</b>, et pas de frilosité.</p>
    <canvas class="chart" width="640" height="200" aria-label="Production solaire et consommation du site sur une semaine"></canvas>
    <div class="field"><label for="retK">Puissance installée : <span class="num" id="retKv"></span></label><input type="range" id="retK" min="0" max="${max}" step="1" value="${max}"></div>
    <p class="ems-cur" aria-live="polite"></p><button class="btn" type="button" id="retOk">Valider ▸</button><div class="fbz" aria-live="polite"></div></div>`;
  const cv=el.querySelector('canvas'),x=cv.getContext('2d'),r=el.querySelector('#retK'),lab=el.querySelector('.ems-cur'),fbz=el.querySelector('.fbz'),c=weekCurve(s.id);
  const dessiner=()=>{const k=+r.value,b=retSolaire(s.id,k);el.querySelector('#retKv').textContent=k+' kWc';
    const pv=c.map((v,i)=>{const t=(i%48)/2+.25;return t<=6.75||t>=20.5?0:k*.78*Math.pow(Math.sin(Math.PI*(t-6.75)/13.75),1.3)});
    const R=emsRepere(x,{w:640,h:200,L:60,max:Math.max(...c,...pv)*1.1,unite:'kW'}),X=i=>R.L+R.W*(i+.5)/c.length;
    x.fillStyle='rgba(226,161,58,.35)';x.beginPath();x.moveTo(X(0),R.Y(0));pv.forEach((p,i)=>x.lineTo(X(i),R.Y(p)));x.lineTo(X(c.length-1),R.Y(0));x.fill();
    x.fillStyle='rgba(42,161,152,.45)';x.beginPath();x.moveTo(X(0),R.Y(0));pv.forEach((p,i)=>x.lineTo(X(i),R.Y(Math.min(p,c[i]))));x.lineTo(X(c.length-1),R.Y(0));x.fill();
    x.strokeStyle='#1c2440';x.lineWidth=1.5;x.beginPath();c.forEach((v,i)=>i?x.lineTo(X(i),R.Y(v)):x.moveTo(X(i),R.Y(v)));x.stroke();
    x.fillStyle='#5b6380';x.textAlign='center';SB_JOURS.forEach((d,j)=>x.fillText(d.slice(0,3),R.L+R.W*(j+.5)/7,196));
    lab.textContent=`Autoconsommation : ${Math.round(b.ac)} % (ce qui est produit et consommé sur place) · autoproduction : ${Math.round(b.ap)} % de ta consommation`};
  r.oninput=dessiner;dessiner();
  el.querySelector('#retOk').onclick=()=>{const k=+r.value,b=retSolaire(s.id,k);
    if(b.ac>=75&&k>=Math.round(kmax*.7)){el.querySelector('#retOk').remove();r.disabled=true;retNoter('solaire');
      fbz.innerHTML=`<div class="fb ok">✔ ${k} kWc : ${Math.round(b.ac)} % de la production consommée sur place, et ${Math.round(b.ap)} % de ta consommation couverte par ton toit. ${s.id==='boulangerie'?"Le four travaille la nuit, le soleil le jour : la boulangerie ne pourra jamais tout couvrir. Ce n'est pas grave, c'est l'heure du pain.":s.id==='ecole'?"Et l'été, quand l'école est vide ? Le toit produit pour personne : c'est là que la revente ou le partage avec les voisins prend son sens.":"Le week-end, les bureaux dorment et le toit, lui, travaille : c'est ce qui limite la taille."}</div>${emsTransfert('l’outil superpose la production attendue et la courbe du site, avant d’acheter quoi que ce soit. On dimensionne sur sa propre courbe, pas sur la surface du toit.')}`;
      gainXP(essais?5:20);contBtn(fbz,next);return}
    essais++;emsRate('Retour au bureau · solaire',k+' kWc');
    fbz.innerHTML=`<div class="fb ko">✘ ${b.ac<75?`${Math.round(100-b.ac)} % de ta production part sur le réseau, revendue une misère. Ton toit travaille pour les voisins.`:`Prudent. Trop prudent : tu pourrais monter jusqu'à ${kmax} kWc sans passer sous 75 %.`}</div>`};
}

/* ---- data center : le PUE du local informatique du site, et la chaleur qu'il jette ---- */
const RET_IT={ecole:{kw:1.5,quoi:'la salle informatique et la baie réseau'},bureau:{kw:6,quoi:'la salle serveurs'},boulangerie:{kw:.8,quoi:'le serveur de commandes, la caisse, la box et la vidéo, dans le placard climatisé'}};
function retourDatacenter(el,next){
  const s=site(),IT=RET_IT[s.id]||RET_IT.bureau,e={consigne:'18',air:'non',portes:'non'};let essais=0;
  const calc=()=>{const clim=IT.kw*{18:.9,22:.6,26:.4}[e.consigne]*(e.air==='oui'?.6:1)*(e.portes==='oui'?.8:1),pue=(IT.kw*1.1+clim)/IT.kw;return {clim,pue,an:Math.round((IT.kw*1.1+clim)*8760),chaleur:Math.round((IT.kw+clim)*8760)}};
  el.innerHTML=`<div class="ems">${emsBarre('de retour au bureau · '+RET_TITRES.datacenter)}
    <p>Au data center, on t'a appris le PUE : l'énergie totale divisée par celle des machines. Chez toi, il y a ${esc(IT.quoi)} : <b>${String(IT.kw).replace('.',',')} kW</b> de machines, jour et nuit, et une clim réglée par quelqu'un qui avait froid. Objectif : un PUE de <b>1,5</b> au plus.</p>
    <div class="enj-champs"><p class="lbl">Consigne de la clim du local</p>${enjChips('consigne',[['18','18 °C'],['22','22 °C'],['26','26 °C']],e.consigne)}
    <p class="lbl">Refroidir avec l'air extérieur quand il fait frais</p>${enjChips('air',[['non','Non'],['oui','Oui']],e.air)}
    <p class="lbl">Fermer la porte et boucher les trous de la baie</p>${enjChips('portes',[['non','Non'],['oui','Oui']],e.portes)}</div>
    <p class="ems-cur" aria-live="polite"></p><button class="btn" type="button" id="retOk">Valider ▸</button><div class="fbz" aria-live="polite"></div></div>`;
  const lab=el.querySelector('.ems-cur'),fbz=el.querySelector('.fbz'),maj=()=>{const b=calc();lab.textContent=`PUE : ${b.pue.toFixed(2).replace('.',',')} · clim : ${b.clim.toFixed(1).replace('.',',')} kW · ${emsKwh(b.an)} kWh par an pour le local`};
  enjLier(el.querySelector('.enj-champs'),e,maj);maj();
  el.querySelector('#retOk').onclick=()=>{const b=calc();
    if(Math.round(b.pue*100)/100<=1.5){el.querySelector('#retOk').remove();el.querySelectorAll('.enj-champs button').forEach(z=>z.disabled=true);retNoter('datacenter');
      fbz.innerHTML=`<div class="fb ok">✔ PUE de ${b.pue.toFixed(2).replace('.',',')}. ${e.consigne==='18'?'Et sans toucher à la consigne : joli.':'Les machines supportent très bien 26 °C ; c’est l’humain qui avait froid, pas le serveur.'}</div>
        <p>Et toute cette énergie finit en chaleur : <b>${emsKwh(b.chaleur)} kWh par an</b>, jetés dehors par la clim. ${s.id==='bureau'?'De quoi préchauffer l’eau chaude de tout l’immeuble.':s.id==='ecole'?'De quoi tiédir l’eau de la cantine une bonne partie de l’année.':'De quoi préchauffer l’eau du lavage du fournil.'} C'est la chaleur fatale : récupérée, elle remplace du gaz.</p>
        ${emsTransfert('un sous-compteur sur le local informatique suffit pour suivre son PUE dans l’outil, et repérer la clim qui s’emballe. Ce qui ne se mesure pas ne se règle pas.')}`;
      gainXP(essais?5:20);contBtn(fbz,next);return}
    essais++;emsRate('Retour au bureau · data center',JSON.stringify(e));
    fbz.innerHTML=`<div class="fb ko">✘ PUE de ${b.pue.toFixed(2).replace('.',',')} : pour 1 kWh de calcul, ${(b.pue-1).toFixed(2).replace('.',',')} kWh partent dans la clim et le reste. ${e.consigne==='18'?'18 °C dans un local à serveurs, c’est un congélateur avec des voyants.':'Encore un effort : l’air extérieur est gratuit la moitié de l’année.'}</div>`};
}

/* ---- barrage : déplacer un usage hors des heures chères et de la pointe ---- */
const RET_PRIX=h=>h<6?.12:h<8?.18:h<11?.26:h<17?.17:h<20?.28:.15;   // €/kWh à l'heure, fictifs : deux pointes, matin et soir
const RET_USAGE={ecole:{nom:'Chauffe-eau de la cantine',kw:6,h:3,depart:8,min:0,max:8,note:"L'eau doit être chaude à 11 h, pour la cantine."},
  bureau:{nom:'Recharge des trois voitures de service',kw:11,h:4,depart:18,min:18,max:28,note:"Elles rentrent à 18 h et repartent à 8 h."},
  boulangerie:{nom:'Chambre de pousse',kw:5,h:3,depart:18,min:15,max:24,note:"La pâte doit être prête à 3 h, pour la première fournée."}};
function retBarrage(sid,dep){
  const U=RET_USAGE[sid],c=weekCurve(sid).slice(48,96);let cout=0,pic=0;
  for(let i=0;i<48;i++){const t=i/2,tt=(t-dep+24)%24,on=tt<U.h,p=c[i]+(on?U.kw:0);cout+=p*.5*RET_PRIX(t);pic=Math.max(pic,p)}
  return {cout,pic};
}
function retourBarrage(el,next){
  const s=site(),U=RET_USAGE[s.id]||RET_USAGE.ecole;let essais=0;
  const deps=[];for(let d=U.min;d<=U.max;d+=.5)deps.push(d);const couts=deps.map(d=>retBarrage(s.id,d%24).cout),best=Math.min(...couts),seuil=best+(Math.max(...couts)-best)*.2,JOURS=s.id==='ecole'?180:s.id==='bureau'?250:310;
  el.innerHTML=`<div class="ems">${emsBarre('de retour au bureau · '+RET_TITRES.barrage)}
    <p>Au barrage, on t'a montré que l'électricité n'a pas le même prix à toutes les heures : la STEP pompe quand c'est bon marché et turbine à la pointe. Chez toi, pas de barrage, mais un usage qu'on peut déplacer : <b>${esc(U.nom)}</b>, ${U.kw} kW pendant ${U.h} h. ${esc(U.note)}</p>
    <canvas class="chart" width="640" height="200" aria-label="Consommation du mardi et prix de l'heure"></canvas>
    <div class="field"><label for="retD">Départ : <span class="num" id="retDv"></span></label><input type="range" id="retD" min="${U.min}" max="${U.max}" step=".5" value="${U.depart}"></div>
    <p class="ems-cur" aria-live="polite"></p><button class="btn" type="button" id="retOk">Valider ▸</button><div class="fbz" aria-live="polite"></div></div>`;
  const cv=el.querySelector('canvas'),x=cv.getContext('2d'),r=el.querySelector('#retD'),lab=el.querySelector('.ems-cur'),fbz=el.querySelector('.fbz'),c=weekCurve(s.id).slice(48,96);
  const h=v=>{const t=((v%24)+24)%24;return `${Math.floor(t)} h ${t%1?'30':'00'}`};
  const dessiner=()=>{const d=+r.value%24,b=retBarrage(s.id,d);el.querySelector('#retDv').textContent=`${h(d)} → ${h(d+U.h)}`;
    const p=c.map((v,i)=>{const tt=(i/2-d+24)%24;return v+(tt<U.h?U.kw:0)}),R=emsRepere(x,{w:640,h:200,L:60,max:Math.max(...p)*1.15,unite:'kW'}),X=i=>R.L+R.W*i/48;
    for(let i=0;i<48;i++){const pr=RET_PRIX(i/2);x.fillStyle=pr>=.26?'rgba(196,61,61,.13)':pr<=.15?'rgba(42,161,152,.10)':'rgba(0,0,0,0)';x.fillRect(X(i),R.T,R.W/48,R.H)}
    x.fillStyle='#2aa198';c.forEach((v,i)=>x.fillRect(X(i)+1,R.Y(v),R.W/48-2,R.T+R.H-R.Y(v)));
    x.fillStyle='#e2a13a';p.forEach((v,i)=>{if(v>c[i])x.fillRect(X(i)+1,R.Y(v),R.W/48-2,R.Y(c[i])-R.Y(v))});
    x.fillStyle='#5b6380';x.textAlign='center';[0,6,8,11,17,20,24].forEach(t=>x.fillText(t+' h',X(t*2),196));
    lab.textContent=`Coût de la journée : ${b.cout.toFixed(1).replace('.',',')} €, soit ${fmt(Math.round(b.cout*JOURS))} € sur ${JOURS} jours d'activité · pointe : ${Math.round(b.pic)} kW (souscrit conseillé : ${s.psOk} kVA) · en rouge, les heures chères`};
  r.oninput=dessiner;dessiner();
  el.querySelector('#retOk').onclick=()=>{const b=retBarrage(s.id,+r.value%24);
    if(b.cout<=seuil){el.querySelector('#retOk').remove();r.disabled=true;retNoter('barrage');
      fbz.innerHTML=`<div class="fb ok">✔ ${esc(U.nom)} part à ${h(+r.value)} : la journée coûte ${b.cout.toFixed(1).replace('.',',')} €, ${fmt(Math.round((Math.max(...couts)-b.cout)*JOURS))} € de moins par an qu'à la pire heure, et la pointe reste à ${Math.round(b.pic)} kW. Même énergie, autre heure, autre prix. C'est la STEP du pauvre, et elle marche très bien.</div>${emsTransfert('l’outil croise la courbe du site et les heures du contrat : il montre ce qui tourne aux heures chères, et ce qui pousse la pointe. Déplacer un usage n’économise aucun kWh, mais des euros, et parfois de la puissance souscrite.')}`;
      gainXP(essais?5:20);contBtn(fbz,next);return}
    essais++;emsRate('Retour au bureau · barrage',r.value);
    fbz.innerHTML=`<div class="fb ko">✘ On peut gagner encore ${fmt(Math.round((b.cout-best)*JOURS))} € par an, rien qu'en changeant l'heure. Regarde où tombent les heures rouges.</div>`};
}

/* ---- éolien et nucléaire : le carbone du contrat (garanties d'origine) et le carbone des kWh ---- */
function retourCarbone(sid){return (el,next)=>{
  const s=site(),E=s.elec*1000,plan=emsGet('plan'),eco=Math.min(E*.3,Math.round(((plan&&plan.kwh)||E*.12)*.25));let essais=0;
  el.innerHTML=`<div class="ems">${emsBarre('de retour au bureau · '+RET_TITRES[sid])}
    <p>${sid==='eolien'?"Au parc éolien, on t'a parlé des garanties d'origine : un certificat qui dit qu'un MWh renouvelable a été produit quelque part. Ton fournisseur t'en propose, pour ton contrat d'électricité."
      :"À la centrale nucléaire, tu as vu pourquoi le kWh électrique français émet peu de CO₂. Ton fournisseur, lui, te propose en plus des garanties d'origine renouvelables pour « verdir » ton contrat."}
    Deux façons de compter le CO₂ de tes ${emsKwh(E)} kWh : <b>selon le réseau</b> (ce que tes kWh émettent vraiment) et <b>selon le contrat</b> (ce que tu peux déclarer avec tes certificats).</p>
    <div class="field"><label for="retG">Part de ton électricité couverte par des garanties d'origine : <span class="num" id="retGv"></span></label><input type="range" id="retG" min="0" max="100" step="10" value="0"></div>
    <div class="enj-champs"><p class="lbl">Appliquer ton plan d'action</p>${enjChips('plan',[['non','Non'],['oui',`Oui (−${emsKwh(eco)} kWh d'électricité)`]],'non')}</div>
    <div class="ems-co2"></div><div class="ems-q"></div></div>`;
  const e={plan:'non'},g=el.querySelector('#retG'),co=el.querySelector('.ems-co2');
  const maj=()=>{const kwh=E-(e.plan==='oui'?eco:0),p=+g.value/100,reseau=kwh*.052/1000,contrat=kwh*(1-p)*.052/1000;el.querySelector('#retGv').textContent=g.value+' %';
    co.innerHTML=`<div class="tbl"><table><tr><th></th><th class="num">tCO₂e par an</th></tr><tr><td>Selon le réseau (ce que tes kWh émettent)</td><td class="num">${reseau.toFixed(1).replace('.',',')}</td></tr><tr><td>Selon le contrat (ce que tu peux déclarer)</td><td class="num">${contrat.toFixed(1).replace('.',',')}</td></tr><tr><td>Surcoût des garanties d'origine</td><td class="num">${fmt(Math.round(kwh/1000*p*3))} € par an</td></tr></table></div>`};
  g.oninput=maj;enjLier(el.querySelector('.enj-champs'),e,maj);maj();
  emsChoix(el.querySelector('.ems-q'),[
    ["Consommer moins de kWh : c'est le seul réglage qui fait baisser les deux lignes",1],
    ["Acheter 100 % de garanties d'origine",0,"Regarde le tableau : seule la ligne « contrat » baisse. Les électrons qui arrivent chez toi n'ont pas changé ; tu as acheté le droit de le dire."],
    ["Changer de fournisseur",0,"Le fournisseur change la facture et le contrat, pas le réseau qui t'alimente."]],
    (o,n)=>{essais+=n;retNoter(sid);el.querySelector('.ems-q').innerHTML=`<div class="fb ok">✔ Les garanties d'origine financent des producteurs renouvelables, et c'est utile. Mais l'atmosphère, elle, compte tes kWh. Le meilleur kWh reste celui qu'on ne consomme pas.</div>${emsTransfert('un bon outil affiche les deux méthodes côte à côte (selon le réseau, selon le contrat) et dit laquelle il utilise. Un bilan carbone qui ne précise pas sa méthode peut afficher zéro sans avoir rien changé.')}`;
      gainXP(essais?5:20);contBtn(el.querySelector('.ems-q'),next)},
    {q:"Qu'est-ce qui fait vraiment baisser les émissions de ton site ?"});
}}
const RET_ATELIERS={solaire:retourSolaire,datacenter:retourDatacenter,barrage:retourBarrage,eolien:retourCarbone('eolien'),nucleaire:retourCarbone('nucleaire')};
