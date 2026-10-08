/* Wattlings · jeu/interface/ma-courbe.js
   « Ma courbe » : le trophée qui récompense par l'effet. La semaine du site, telle que le joueur l'a rendue étape après étape :
   brute (avant Fiabiliser), propre, lue (le talon), surveillée (la dérive repérée), plus basse (le plan d'action), prouvée.
   Affichée dans la carte de joueur (interface/menu.js) et en tête de la console de l'EMS (interface/ems-bureau.js). */

const MC_ETATS=[
  [0,'Brute',"Telle que l'API l'a livrée : un trou, un doublon, un pic à 999,9 kW. Personne ne la croit, et c'est sage."],
  [3,'Propre',"Fiabilisée : chaque valeur est vraie, ou dit qu'elle est estimée. Elle ne ment plus. Elle ne dit pas encore grand-chose."],
  [5,'Lue',"Le talon est tracé : ce que le bâtiment consomme quand il dort. La courbe commence à parler."],
  [6,'Surveillée',"La dérive est repérée : +3 kW toutes les nuits, en rouge. Elle n'a nulle part où se cacher."],
  [7,'Plus basse',"Le plan d'action est lancé : la courbe d'avant, en gris, et celle d'aujourd'hui. La différence, c'est toi."],
  [8,'Prouvée',"Prouvée à météo comparable. Ce n'est plus une promesse, c'est une économie."]
];
/* le nombre de badges gagnés par l'histoire décide de l'état de la courbe */
const mcBadges=()=>ARENAS.filter(A=>arenaDone(A)).length;
const mcEtat=()=>{const b=mcBadges();return MC_ETATS.filter(e=>b>=e[0]).length-1};
/* la nuit, le week-end ou le jour de fermeture : là où vit le talon (et la dérive) */
const mcVide=(sid,i)=>{const d=Math.floor(i/48),H=(i%48)/2;return (sid==='boulangerie'?d===0:d>=5)||H<6||H>=21};
function mcSemaines(sid){
  const vrai=weekCurve(sid),s=SITES[sid],der=.5+s.derRdc[1]+s.derCave[1],ids=(emsGet('plan')&&emsGet('plan').ids)||Object.keys((S.en&&S.en.acts)||{});
  const avant=vrai.map((v,i)=>v+(mcVide(sid,i)?der:0));
  const apres=vrai.map((v,i)=>{let x=v;if(!ids.includes('veilles')&&mcVide(sid,i))x+=der;if(ids.includes('led')&&!mcVide(sid,i))x-=Math.max(0,v-BASE[sid])*.11;return x});
  return {vrai,avant,apres,der,brut:sbSeries(sid).brut};
}
function maCourbeHtml(){
  const k=mcEtat(),E=MC_ETATS[k];
  return `<div class="mc"><div class="mc-h"><b>Ma courbe</b><span>${esc(site().name)} · une semaine</span></div>
    <canvas width="480" height="170" aria-label="Ma courbe : la semaine du site, état « ${esc(E[1])} »"></canvas>
    <ol class="mc-etats">${MC_ETATS.map((e,i)=>`<li class="${i<k?'fait':i===k?'cur':''}">${esc(e[1])}</li>`).join('')}</ol>
    <p class="mc-leg">${esc(E[2])}</p></div>`;
}
function maCourbeDessiner(cv){
  if(!cv||!S.site)return;
  const s=site(),k=mcEtat(),M=mcSemaines(s.id),x=cv.getContext('2d'),w=cv.width,h=cv.height,L=8,T=10,W=w-16,H=h-24,N=336;
  const haut=Math.max(...M.avant)*1.25,X=i=>L+W*(i+.5)/N,Y=v=>T+H-Math.min(v,haut*1.02)/haut*H;
  x.fillStyle='#fffaf0';x.fillRect(0,0,w,h);x.strokeStyle='#e6dcc0';x.lineWidth=1;
  for(let j=1;j<7;j++){x.beginPath();x.moveTo(L+W*j/7,T);x.lineTo(L+W*j/7,T+H);x.stroke()}
  x.fillStyle='#5b6380';x.font='11px "Atkinson Hyperlegible",sans-serif';x.textAlign='center';SB_JOURS.forEach((d,j)=>x.fillText(d.slice(0,3),L+W*(j+.5)/7,h-6));
  const trace=(t,col,lw,dash)=>{x.strokeStyle=col;x.lineWidth=lw;x.setLineDash(dash||[]);x.beginPath();let lev=true;t.forEach((v,i)=>{if(v===null){lev=true;return}lev?x.moveTo(X(i),Y(v)):x.lineTo(X(i),Y(v));lev=false});x.stroke();x.setLineDash([])};
  if(k===0){trace(M.brut,'#9aa0a8',1.5);const pic=SB_ANOM.find(a=>a.id==='pic').de;x.fillStyle='#c43d3d';x.textAlign='left';x.fillText('999,9 ?',X(pic)+4,T+10);return}
  const base=k>=4?M.apres:M.avant;
  if(k>=4){trace(M.avant,'#c9c4b6',2);x.fillStyle='rgba(42,161,152,.18)';x.beginPath();M.avant.forEach((v,i)=>i?x.lineTo(X(i),Y(v)):x.moveTo(X(i),Y(v)));for(let i=N-1;i>=0;i--)x.lineTo(X(i),Y(M.apres[i]));x.fill()}
  trace(base,'#2aa198',2);
  if(k===3){trace(M.avant.map((v,i)=>mcVide(s.id,i)?v:null),'#c43d3d',3);x.fillStyle='#c43d3d';x.textAlign='center';x.font='bold 12px "Atkinson Hyperlegible",sans-serif';x.fillText(`+${String(M.der).replace('.',',')} kW chaque nuit`,L+W*5.9/7,Y(M.avant[5*48+4])-8)}
  if(k>=2){x.strokeStyle='#e2573b';x.setLineDash([6,4]);x.lineWidth=1.5;x.beginPath();x.moveTo(L,Y(BASE[s.id]));x.lineTo(L+W,Y(BASE[s.id]));x.stroke();x.setLineDash([]);x.fillStyle='#e2573b';x.textAlign='left';x.fillText('talon',L+2,Y(BASE[s.id])-4)}
  if(k>=4){const gain=Math.round(M.avant.reduce((a,v,i)=>a+(v-M.apres[i])*.5,0));x.fillStyle='#1c7a9a';x.textAlign='right';x.font='bold 12px "Atkinson Hyperlegible",sans-serif';x.fillText(`−${emsKwh(gain)} kWh sur la semaine`,L+W-4,T+12)}
  if(k>=5){x.save();x.translate(L+W*.78,T+H*.55);x.rotate(-.18);x.strokeStyle='#c43d3d';x.lineWidth=2.5;x.strokeRect(-46,-15,92,30);x.fillStyle='#c43d3d';x.font='bold 15px "Atkinson Hyperlegible",sans-serif';x.textAlign='center';x.fillText('PROUVÉ',0,5);x.restore()}
}
