/* Wattlings · jeu/epreuves/analyser.js
   Étape 5 · Analyser : trouver le talon, régler la puissance souscrite. */

/* ================= ANALYSER ================= */
function weekCurve(id){
  const out=[];let seed=7;const rnd=()=>{seed=(seed*9301+49297)%233280;return seed/233280};
  for(let d=0;d<7;d++)for(let h=0;h<48;h++){const H=h/2;let p;
    if(id==='ecole'){p=6;const cl=d<5,wed=d===2;if(cl&&!wed){if(H>=7&&H<8)p=24;else if(H>=8&&H<11.5)p=38;else if(H>=11.5&&H<13.5)p=52;else if(H>=13.5&&H<16.5)p=36;else if(H>=16.5&&H<18)p=16}if(wed){if(H>=7.5&&H<12)p=34;else if(H>=12&&H<14)p=12}}
    if(id==='bureau'){p=18;if(d<5){if(H>=7&&H<8)p=60;else if(H>=8&&H<12)p=92;else if(H>=12&&H<14)p=80;else if(H>=14&&H<18)p=96;else if(H>=18&&H<20)p=44}}
    if(id==='boulangerie'){p=4;if(d!==0){if(H>=3&&H<7)p=24;else if(H>=7&&H<13)p=14;else if(H>=13&&H<15)p=7;else if(H>=15&&H<19.5)p=12}}
    out.push(Math.max(0,p+(rnd()-.5)*2.4));}
  return out;
}
const BASE={ecole:6,bureau:18,boulangerie:4};
function talonStep(el,next){
  const s=site(),c=weekCurve(s.id),mx=Math.ceil(Math.max(...c)/10)*10,base=BASE[s.id];let tries=0;
  el.innerHTML=`<h3>Trouve le talon</h3><p>Voici une semaine de courbe de charge électrique ${esc(enDe(s))} (pas de 30 min, du lundi au dimanche). Le <b>talon</b>, c'est ce que le bâtiment consomme quand il est vide : la nuit, le week-end${s.id==='boulangerie'?', le lundi (jour de fermeture)':''}.</p><canvas class="chart" width="640" height="240" aria-label="Courbe de charge d'une semaine"></canvas><div class="field"><label for="talonR">Place la ligne pointillée rouge sur le talon : <span class="num" id="talonV"></span></label><input type="range" id="talonR" min="0" max="${mx}" step="0.5" value="${Math.round(mx*.6)}"></div><button class="btn" id="tv">Valider ▸</button><div class="fbz"></div>`;
  const cv2=el.querySelector('canvas'),x=cv2.getContext('2d'),r=el.querySelector('#talonR'),lab=el.querySelector('#talonV'),fbz=el.querySelector('.fbz');
  const L=44,T=12,W=640-L-10,Hh=240-T-30,Y=v=>T+Hh-v/mx*Hh;
  const draw=()=>{const v=+r.value;lab.textContent=v.toLocaleString('fr-FR')+' kW';x.fillStyle='#fffaf0';x.fillRect(0,0,640,240);
    x.strokeStyle='#e6dcc0';x.lineWidth=1;x.fillStyle='#5b6380';x.font='12px "Atkinson Hyperlegible",sans-serif';x.textAlign='right';
    const st=[5,10,20,25,50].find(v=>mx/v<=6)||50;for(let g=0;g<=mx;g+=st){x.beginPath();x.moveTo(L,Y(g));x.lineTo(L+W,Y(g));x.stroke();x.fillText(Math.round(g)+' kW',L-4,Y(g)+4)}
    x.textAlign='center';['Lun','Mar','Mer','Jeu','Ven','Sam','Dim'].forEach((d,i)=>{x.fillText(d,L+W*(i+.5)/7,236);if(i){x.beginPath();x.moveTo(L+W*i/7,T);x.lineTo(L+W*i/7,T+Hh);x.stroke()}});
    x.beginPath();c.forEach((p,i)=>{const px=L+W*i/c.length,py=Y(p);i?x.lineTo(px,py):x.moveTo(px,py)});x.lineTo(L+W,T+Hh);x.lineTo(L,T+Hh);x.closePath();x.fillStyle='rgba(42,161,152,.18)';x.fill();
    x.beginPath();c.forEach((p,i)=>{const px=L+W*i/c.length,py=Y(p);i?x.lineTo(px,py):x.moveTo(px,py)});x.strokeStyle='#2aa198';x.lineWidth=2;x.stroke();
    x.strokeStyle='#e2573b';x.lineWidth=3;x.setLineDash([8,5]);x.beginPath();x.moveTo(L,Y(v));x.lineTo(L+W,Y(v));x.stroke();x.setLineDash([])};
  r.oninput=draw;draw();
  el.querySelector('#tv').onclick=e=>{const v=+r.value;if(Math.abs(v-base)<=Math.max(1.5,base*.25)){e.target.remove();r.disabled=true;
      fbz.innerHTML=`<div class="fb ok">✔ Le talon est d'environ <b>${base} kW</b>. Il tourne 24 h/24 : ${s.id==='ecole'?'éclairage de sécurité, informatique, ventilation, veilles':s.id==='bureau'?'serveurs, ventilation, veilles':'froid (vitrines, chambre froide), veilles'}.</div>`;gainXP(tries?5:20);contBtn(fbz,next)}
    else{tries++;trk('wrong_answer',{t:panelTitle(),q:trkTxt('Trouve le talon').slice(0,100),a:trkTxt((v>base?'trop haut ':'trop bas ')+v+' kW').slice(0,80)});sfx('bad');fbz.innerHTML=`<div class="fb ko">✘ ${v>base?'Trop haut : regarde les nuits et le week-end, pas les journées.':'Trop bas : même vide, le bâtiment consomme quelque chose.'}</div>`}};
}
function gameAnalyse(done){
  const s=site(),c=weekCurve(s.id),base=BASE[s.id],share=Math.round(c.reduce((a,p)=>a+Math.min(p,base),0)/c.reduce((a,p)=>a+p,0)*100/5)*5;
  const ratio=Math.round((s.elec+s.gaz)*1000/s.surface),re=Math.round(s.elec*1000/s.surface),gain=(s.souscrit-s.psOk)*13.5;
  runSteps('Arène des Courbes · Analyser la consommation',[
    info(`<h3>Lire la courbe comme un électrocardiogramme</h3><p>Le cardiologue regarde le rythme au repos, les pics à l'effort et ce qui sort de l'ordinaire. Une courbe de charge se lit de la même façon : le talon, les heures d'occupation, les pointes.</p>`),
    talonStep,
    choice({ctx:`Talon : <span class="num">${base} kW</span>, 168 heures par semaine.`,q:'Quelle part de l\'électricité de cette semaine part dans le talon ?',opts:[[`Environ ${share} %`,1,`Une grosse part ! Sur une année avec les vacances${s.id==='ecole'?' (l\'école est vide plus de 80 % des heures)':''}, elle est encore plus grande. D'où l'intérêt d'analyser les nuits et les week-ends.`],[`Environ ${Math.max(5,share-25)} %`,0,'Plus que ça : le talon tourne toutes les heures de la semaine.'],[`Environ ${Math.min(95,share+30)} %`,0,'Moins que ça : les heures d\'occupation pèsent aussi.']]}),
    choice({title:'Signature énergétique',ctx:'DJU (degré-jour unifié) = 18 °C − température moyenne du jour (0 s\'il fait plus de 18 °C). Le chauffage suit les DJU.',gas:1,q:'Un jour à 8 °C de moyenne compte combien de DJU ?',opts:[['10',1,'18 − 8 = 10 DJU.'],['8',0,'On part du seuil de 18 °C.'],['26',0,'On soustrait, on n\'additionne pas.']]}),
    choice({gas:1,ctx:'La signature du chauffage s\'écrit <b>E = a + b × DJU</b>.',q:'Que représente b ?',opts:[['Les kWh supplémentaires par degré-jour de froid (thermosensibilité)',1,'Si b augmente, le bâtiment chauffe moins bien : réglage, isolation, chaudière.'],['La consommation de base, hors météo',0,'Ça, c\'est a.'],['La température de consigne',0,'b est une pente, en kWh/DJU.']]}),
    choice({title:'Puissance souscrite',ctx:`Pointe annuelle mesurée : <span class="num">${s.pointe} kVA</span>. Souscrit aujourd'hui : <span class="num">${s.souscrit} kVA</span>. Part fixe (fictive) : 13,50 €/kVA/an.`,q:'Quelle puissance souscrire ?',opts:s.psOpts.map(v=>[`${v} kVA`,v===s.psOk,v===s.psOk?`Juste au-dessus de la pointe, avec une petite marge. Économie : ${s.souscrit-v} × 13,50 = ${fmt(gain)} € HT/an.`:v<s.pointe?'Sous la pointe : dépassements et pénalités.':v===s.souscrit?`Tu paies ${s.souscrit-s.pointe} kVA que tu n'utilises jamais.`:'Encore plus de puissance inutile.'])}),
    choice({title:'Ratios',ctx:`${esc(s.name)} : ${s.elec} MWh d'électricité + ${s.gaz} MWh de gaz par an, pour ${fmt(s.surface)} m².`,q:'Quel est son ratio de consommation totale ?',opts:[[`${fmt(ratio)} kWh/m²/an`,1,s.id==='boulangerie'?'Très élevé, mais normal pour un fournil : un ratio se lit toujours avec son contexte (activité, horaires).':'Le ratio rend les bâtiments comparables, à lire avec leur contexte (horaires, usages).'],[`${fmt(re)} kWh/m²/an`,0,'Ça, c\'est l\'électricité seule.'],[`${fmt(ratio*10)} kWh/m²/an`,0,'Attention aux MWh → kWh : ×1 000, pas ×10 000.'],[`${fmt(Math.round(ratio/10))} kWh/m²/an`,0,'N\'oublie pas de convertir les MWh en kWh.']]})
  ],done);
}
