/* Wattlings · jeu/epreuves/ems-seuil.js
   Étape 6 · Détecter, l'atelier : régler le seuil d'alerte de l'EMS sur quatre semaines du site. La consommation est comparée à
   la référence (ce que le site aurait dû consommer) ; une vraie dérive démarre la troisième semaine (les +3 kW de talon trouvés
   pendant la ronde de nuit), et un jour isolé sort du lot sans être un problème. Le joueur règle le seuil et la persistance. */

const SEU_DEBUT=15;   // la dérive démarre le mardi de la troisième semaine (jour 0 = un lundi)
const SEU_EVT={ecole:'la kermesse de l’école, sono et barbe à papa comprises',bureau:'le séminaire annuel, avec traiteur et vidéoprojecteurs',boulangerie:'la fête du pain, avec deux fournées de plus'};
function seuSeries(sid){
  const c=weekCurve(sid),jour=d=>c.slice((d%7)*48,(d%7)*48+48).reduce((a,v)=>a+v*.5,0),s=SITES[sid],der=(.5+s.derRdc[1]+s.derCave[1])*24;
  let seed=29;const rnd=()=>{seed=(seed*9301+49297)%233280;return seed/233280};
  const ref=[],mes=[];
  for(let d=0;d<28;d++){const r=jour(d);ref.push(Math.round(r));mes.push(Math.round(r*(1+(rnd()-.5)*.16)+(d>=SEU_DEBUT?der:0)+(d===9?r*.24:0)))}
  return {ref,mes,der:Math.round(der)};
}
/* les jours en alerte : écart au-dessus du seuil, et pendant « persist » jours de suite */
const seuAlertes=(ref,mes,seuil,persist)=>mes.map((m,d)=>{const au=k=>k>=0&&mes[k]>ref[k]*(1+seuil/100);return au(d)&&(persist<2||au(d-1))});
function seuilStep(el,next){
  const s=site(),{ref,mes,der}=seuSeries(s.id);let essais=0,persist=1,cur=null;
  el.innerHTML=`<div class="ems">${emsBarre('alertes · électricité, par jour')}
    <p>Quatre semaines du site, jour par jour, face à la référence (ce qu'il aurait dû consommer). <b>Règle le seuil d'alerte</b>, puis envoie la configuration. Trop bas, tout sonne. Trop haut, rien ne sonne.</p>
    <canvas class="chart ems-courbe" width="720" height="250" tabindex="0" aria-label="Consommation par jour sur quatre semaines, référence et seuil. Touche un jour pour le détail."></canvas>
    <p class="ems-legende"><span class="lg-b">consommation</span><span class="lg-c">référence</span><span class="lg-e">seuil</span><span class="lg-r">alerte</span></p>
    <div class="ff"><div class="field"><label for="seuS">Seuil : alerter au-delà de <span class="num" id="seuSv"></span> au-dessus de la référence</label><input type="range" id="seuS" min="2" max="40" step="1" value="3"></div>
    <div class="field"><span class="lbl">Persistance</span><div class="ems-chips"><button type="button" class="ems-zone" data-p="1" aria-pressed="true">1 jour suffit</button><button type="button" class="ems-zone" data-p="2" aria-pressed="false">2 jours de suite</button></div></div></div>
    <p class="ems-cur" aria-live="polite"></p>
    <button class="btn" type="button" id="seuOk">Envoyer la configuration ▸</button><div class="fbz" aria-live="polite"></div></div>`;
  const cv=el.querySelector('canvas'),x=cv.getContext('2d'),rS=el.querySelector('#seuS'),lab=el.querySelector('.ems-cur'),fbz=el.querySelector('.fbz');
  const J=['lun','mar','mer','jeu','ven','sam','dim'];
  const dessiner=()=>{const sv=+rS.value,al=seuAlertes(ref,mes,sv,persist);el.querySelector('#seuSv').textContent=sv+' %';
    const R=emsRepere(x,{w:720,h:250,L:70,max:Math.max(...mes,...ref.map(r=>r*(1+sv/100)))*1.08,unite:'kWh'}),bw=R.W/28;
    x.textAlign='center';x.fillStyle='#5b6380';for(let w=0;w<4;w++){x.fillText('semaine '+(w+1),R.L+bw*(w*7+3.5),R.T+R.H+26);if(w){x.strokeStyle='#c9bb92';x.beginPath();x.moveTo(R.L+bw*w*7,R.T);x.lineTo(R.L+bw*w*7,R.T+R.H);x.stroke()}}
    mes.forEach((m,d)=>{x.fillStyle=al[d]?'#c43d3d':d===cur?'#1c7a9a':'#2aa198';x.fillRect(R.L+bw*d+bw*.15,R.Y(m),bw*.7,R.T+R.H-R.Y(m));if(d%7===0||d%7===5){x.fillStyle='#5b6380';x.fillText(J[d%7],R.L+bw*(d+.5),R.T+R.H+12)}});
    const trace=(f,col,dash)=>{x.strokeStyle=col;x.lineWidth=2;x.setLineDash(dash);x.beginPath();ref.forEach((r,d)=>{const px=R.L+bw*(d+.5),py=R.Y(f(r));d?x.lineTo(px,py):x.moveTo(px,py)});x.stroke();x.setLineDash([])};
    trace(r=>r,'#2f6db5',[]);trace(r=>r*(1+sv/100),'#e2a13a',[6,4]);
    const n=al.filter(Boolean).length;
    lab.textContent=cur===null?`${n} jour${n>1?'s':''} en alerte sur 28.`:`${J[cur%7]} (semaine ${Math.floor(cur/7)+1}) : ${emsKwh(mes[cur])} kWh pour ${emsKwh(ref[cur])} attendus, soit ${mes[cur]>=ref[cur]?'+':'−'}${Math.abs(Math.round((mes[cur]/ref[cur]-1)*100))} % · ${n} jour${n>1?'s':''} en alerte sur 28.`};
  rS.oninput=dessiner;
  el.querySelectorAll('.ems-chips .ems-zone').forEach(b=>b.onclick=()=>{persist=+b.dataset.p;el.querySelectorAll('.ems-chips .ems-zone').forEach(z=>z.setAttribute('aria-pressed',String(z===b)));dessiner()});
  const choisirJour=e=>{const r=cv.getBoundingClientRect(),px=(e.clientX-r.left)*720/r.width;cur=Math.max(0,Math.min(27,Math.floor((px-70)/((720-70-12)/28))));dessiner()};
  cv.addEventListener('click',choisirJour);
  cv.addEventListener('keydown',e=>{if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();e.stopPropagation();cur=Math.max(0,Math.min(27,(cur===null?0:cur)+(e.key==='ArrowLeft'?-1:1)));dessiner()}});
  dessiner();
  el.querySelector('#seuOk').onclick=()=>{const sv=+rS.value,al=seuAlertes(ref,mes,sv,persist),vraies=al.filter((a,d)=>a&&d>=SEU_DEBUT).length,fausses=al.map((a,d)=>a&&d<SEU_DEBUT?d:-1).filter(d=>d>=0),premier=al.findIndex((a,d)=>a&&d>=SEU_DEBUT);
    if(vraies&&!fausses.length){el.querySelector('#seuOk').remove();rS.disabled=true;el.querySelectorAll('.ems-chips .ems-zone').forEach(z=>z.disabled=true);
      emsSet('alerte',{seuil:sv,persist,jour:premier});
      const D=[['Éclairage des circulations resté allumé toute la nuit'],s.derRdc,s.derCave];
      fbz.innerHTML=`<div class="fb ok">✔ Première alerte le ${['lundi','mardi','mercredi','jeudi','vendredi','samedi','dimanche'][premier%7]} de la semaine ${Math.floor(premier/7)+1}, ${premier-SEU_DEBUT===0?'le jour même où la dérive a commencé':(premier-SEU_DEBUT)+' jour'+(premier-SEU_DEBUT>1?'s':'')+' après son début'}. Aucune fausse alerte. Le jour isolé de la semaine 2, c'était ${esc(SEU_EVT[s.id])} : surprenant, pas anormal.</div>
        <p>Et cette dérive, tu l'as vue de tes yeux pendant ta ronde de nuit : <b>+${emsKwh(der)} kWh par jour</b>, toutes les nuits. ${D.map((d,i)=>esc(i?d[0].charAt(0).toLowerCase()+d[0].slice(1):d[0])).join(' ; ')} ; et la chaudière qui tourne le week-end. L'alerte dit <i>quand</i> et <i>combien</i>. La ronde dit <i>quoi</i>.</p>
        ${emsTransfert('l’outil compare chaque jour à la référence et sonne quand l’écart dépasse un seuil, pendant une durée choisie. Régler ce seuil est un choix humain : trop sensible, plus personne ne lit les alertes ; trop large, la dérive coûte des mois de facture avant d’être vue.')}`;
      gainXP(essais?5:20);contBtn(fbz,next);return}
    essais++;emsRate('Régler le seuil d’alerte',`${sv} % · ${persist} j · ${vraies} vraies · ${fausses.length} fausses`);
    fbz.innerHTML=`<div class="fb ko">✘ ${!vraies?`Aucune alerte pendant les deux semaines où le site gaspille ${emsKwh(der)} kWh par jour. Ton EMS dort aussi bien que le bâtiment.`:`Tu attrapes la vraie dérive, mais aussi ${fausses.length} fausse${fausses.length>1?'s':''} alerte${fausses.length>1?'s':''} avant qu'elle ne commence${fausses.includes(9)?', dont le jour isolé de la semaine 2':''}. Au bout de la troisième, l'équipe technique crée une règle qui envoie tes alertes à la corbeille.`} ${!vraies?'Baisse le seuil.':fausses.length>2?'Monte le seuil, ou exige que l’écart dure.':'Un écart d’un seul jour n’est peut-être pas une dérive…'} ${essais>=2?revoirFiche():''}</div>`};
}
