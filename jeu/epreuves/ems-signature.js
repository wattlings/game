/* Wattlings · jeu/epreuves/ems-signature.js
   Étape 5 · Analyser, l'atelier : tracer à la main la signature énergétique du site (le gaz du mois selon les DJU du mois),
   en réglant le talon gaz (a) et la pente (b). L'EMS calcule ensuite la régression, pour comparer.
   La droite obtenue est la référence qui sert à détecter (étape 6) et à prouver (étape 8). */

/* DJU mensuels d'une année type à Orléans-Bricy (base 18 °C), de septembre à août */
const SIG_MOIS=['sept.','oct.','nov.','déc.','janv.','févr.','mars','avr.','mai','juin','juil.','août'];
const SIG_DJU=[60,190,330,410,430,360,300,200,110,30,5,10];
function sigPoints(sid){
  const s=SITES[sid],p=EN_PROF[sid],G=s.gaz*1000,tot=SIG_DJU.reduce((a,v)=>a+v,0),a=G*(1-p.gHeat)/12,b=G*p.gHeat/tot;
  let seed=11;const rnd=()=>{seed=(seed*9301+49297)%233280;return seed/233280};
  return {a,b,pts:SIG_DJU.map((d,i)=>[d,Math.round((a+b*d)*(1+(rnd()-.5)*.08))])};
}
/* moindres carrés : la droite que l'EMS calcule tout seul */
function sigRegression(pts){
  const n=pts.length,mx=pts.reduce((s,p)=>s+p[0],0)/n,my=pts.reduce((s,p)=>s+p[1],0)/n;
  const b=pts.reduce((s,p)=>s+(p[0]-mx)*(p[1]-my),0)/pts.reduce((s,p)=>s+(p[0]-mx)**2,0),a=my-b*mx;
  const r2=1-pts.reduce((s,p)=>s+(p[1]-a-b*p[0])**2,0)/pts.reduce((s,p)=>s+(p[1]-my)**2,0);
  return {a:Math.max(0,a),b,r2};
}
function signatureStep(el,next){
  const s=site(),{a:a0,b:b0,pts}=sigPoints(s.id),moy=pts.reduce((t,p)=>t+p[1],0)/12,maxY=Math.max(...pts.map(p=>p[1]))*1.15;
  const pasA=Math.max(10,Math.round(moy/200/10)*10),pasB=Math.max(.1,Math.round(b0/60*10)/10),maxA=Math.ceil(moy*1.2/pasA)*pasA,maxB=Math.ceil(b0*2.2/pasB)*pasB;
  let essais=0;
  el.innerHTML=`<div class="ems">${emsBarre('signature énergétique · gaz')}
    <p>Douze mois de gaz ${esc(enDe(s))}, chacun placé selon ses <b>DJU</b> (le froid du mois). Règle la droite pour qu'elle passe au milieu des points : <b>a</b>, le gaz qui ne dépend pas du froid ; <b>b</b>, ce que coûte chaque degré-jour.</p>
    <canvas class="chart" width="640" height="280" aria-label="Signature énergétique : consommation de gaz mensuelle selon les DJU"></canvas>
    <div class="ff"><div class="field"><label for="sigA">a · talon gaz : <span class="num" id="sigAv"></span> kWh/mois</label><input type="range" id="sigA" min="0" max="${maxA}" step="${pasA}" value="${Math.round(moy/pasA)*pasA}"></div>
    <div class="field"><label for="sigB">b · pente : <span class="num" id="sigBv"></span> kWh par DJU</label><input type="range" id="sigB" min="0" max="${maxB}" step="${pasB}" value="0"></div></div>
    <p class="ems-cur" aria-live="polite"></p>
    <button class="btn" type="button" id="sigOk">Valider ma droite ▸</button><div class="fbz" aria-live="polite"></div></div>`;
  const cv=el.querySelector('canvas'),x=cv.getContext('2d'),rA=el.querySelector('#sigA'),rB=el.querySelector('#sigB'),lab=el.querySelector('.ems-cur'),fbz=el.querySelector('.fbz');
  let reg=null;
  const ecart=(a,b)=>pts.reduce((t,p)=>t+Math.abs(a+b*p[0]-p[1]),0)/12/moy;
  const dessiner=()=>{const a=+rA.value,b=+rB.value;el.querySelector('#sigAv').textContent=emsKwh(a);el.querySelector('#sigBv').textContent=b.toLocaleString('fr-FR');
    const R=emsRepere(x,{w:640,h:280,L:70,B:36,max:maxY,unite:''}),X=d=>R.L+R.W*d/460;
    x.fillStyle='#5b6380';x.textAlign='center';for(let d=0;d<=450;d+=50){x.fillText(d,X(d),R.T+R.H+16)}x.fillText('DJU du mois',R.L+R.W/2,R.T+R.H+31);
    x.save();x.translate(14,R.T+R.H/2);x.rotate(-Math.PI/2);x.fillText('kWh de gaz du mois',0,0);x.restore();
    const ligne=(a,b,col,dash)=>{x.strokeStyle=col;x.lineWidth=dash?2:3;x.setLineDash(dash?[6,4]:[]);x.beginPath();x.moveTo(X(0),R.Y(Math.min(R.haut,a)));x.lineTo(X(460),R.Y(Math.min(R.haut,a+b*460)));x.stroke();x.setLineDash([])};
    if(reg)ligne(reg.a,reg.b,'#2f6db5',1);
    ligne(a,b,'#e2573b');
    pts.forEach((p,i)=>{x.fillStyle='#2aa198';x.beginPath();x.arc(X(p[0]),R.Y(p[1]),5,0,7);x.fill();if(i===4||i===10){x.fillStyle='#1c2440';x.textAlign='left';x.fillText(SIG_MOIS[i],X(p[0])+7,R.Y(p[1])-6)}});
    lab.textContent=`Écart moyen entre ta droite et les mois : ${Math.round(ecart(a,b)*100)} % · avec ta droite, un mois à 300 DJU consommerait ${emsKwh(a+b*300)} kWh`};
  rA.oninput=rB.oninput=dessiner;dessiner();
  el.querySelector('#sigOk').onclick=()=>{const a=+rA.value,b=+rB.value,e=ecart(a,b);
    if(e<=.1){el.querySelector('#sigOk').remove();rA.disabled=rB.disabled=true;reg=sigRegression(pts);dessiner();
      emsSet('signature',{a:Math.round(reg.a),b:Math.round(reg.b*10)/10});
      const be=Math.round(Math.abs(b-reg.b)/reg.b*100);
      fbz.innerHTML=`<div class="fb ok">✔ Ta droite colle aux mois à ${Math.round(e*100)} % près. L'EMS calcule la régression (en pointillés bleus) : <b>a ≈ ${emsKwh(reg.a)} kWh/mois</b>, <b>b ≈ ${(Math.round(reg.b*10)/10).toLocaleString('fr-FR')} kWh/DJU</b>, R² = ${reg.r2.toFixed(2).replace('.',',')}. ${be<=5?'Ton œil vaut presque un tableur.':'Ton œil était à '+be+' % de la pente. Pas mal, pour un humain sans tableur.'}</div>
        <p>${s.id==='boulangerie'?"Le talon gaz est énorme : c'est le four, qui se moque bien de la météo. Le chauffage ne pèse presque rien ici.":s.id==='bureau'?"Le talon gaz est presque nul : ici, tout le gaz sert à chauffer. Pas de cuisine, pas d'eau chaude au gaz.":"Le talon, c'est la cuisine de la cantine et l'eau chaude. Tout le reste suit le froid."}</p>
        ${emsTransfert('la signature est la référence du site : ce qu’il « devrait » consommer selon la météo. L’outil la calcule, mais c’est à toi de vérifier qu’elle a du sens. Une signature faite sur des données sales, ou sur une année où le chauffage était en panne, donne une référence fausse, et des économies imaginaires.')}`;
      gainXP(essais?5:20);contBtn(fbz,next);return}
    essais++;emsRate('Tracer la signature',`a=${a} b=${b} écart ${Math.round(e*100)} %`);
    const ete=pts.filter(p=>p[0]<=60),hiv=pts.filter(p=>p[0]>=300),dE=ete.reduce((t,p)=>t+a+b*p[0]-p[1],0)/ete.length,dH=hiv.reduce((t,p)=>t+a+b*p[0]-p[1],0)/hiv.length,tol=moy*.08;
    const conseil=dE>tol?"Ta droite survole l'été : le talon (a) est trop haut. En juillet, il ne reste que ce qui ne dépend pas du froid.":dE<-tol?"En été, il reste du gaz que ta droite ignore : remonte le talon (a).":dH>tol?"Ta droite plonge trop fort vers l'hiver : en janvier, elle prédit plus que la chaudière n'a jamais brûlé. Baisse la pente (b).":dH<-tol?"En plein hiver, les points sont bien au-dessus de ta droite : la pente (b) est trop faible.":"Presque : ajuste un peu les deux réglages.";
    fbz.innerHTML=`<div class="fb ko">✘ Écart moyen de ${Math.round(e*100)} % : la droite ne raconte pas encore ce site. ${conseil} ${essais>=2?revoirFiche():''}</div>`};
}
