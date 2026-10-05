/* Wattlings · jeu/recit/meteo.js
   Ce que le ciel change en ville : répliques de la station météo, du relais, des panneaux solaires. */

/* ---- ce que le ciel change dans la ville : qui est dehors, qui dit quoi ---- */
const skWet=()=>SKY.rain>.1||SKY.snow>0,skDay=()=>SKY.dark<.3;
const skUmb=new WeakMap(),UMBC=['#c43d3d','#2f6db5','#f2c12e','#2f9e7a','#8a3b8f','#1c2440'];
function skPal(o){   // sous la pluie ou la neige, on ouvre son parapluie (sauf casque, toque et sportifs)
  const p=o.pal;if(!p||!skWet()||S.map!=='town'||o.noUmb||p.hatType==='helmet'||p.hatType==='toque'||p.prop==='rod'||p.prop==='lantern')return p;
  let q=o.fresh?null:skUmb.get(p);if(!q){q={};CHF.forEach(k=>{q[k]=p[k]});q.prop='umbrella';q.umb=o.fresh?'#1c2440':p.prop==='umbrella'?'#f2c12e':UMBC[((o.who||'x').length*7+(o.who||'x').charCodeAt(0))%UMBC.length];if(!o.fresh)skUmb.set(p,q)}return q;
}
const djuTxt=()=>SKY.dju.toFixed(1).replace('.',','),djuPhrase=()=>SKY.dju>=.05?djuTxt()+' degrés-jours (base 18)':'zéro degré-jour (base 18)';
function meteoLines(){
  const T=Math.round(SKY.T),Tm=Math.round(SKY.Tm*10)/10,L=[`Bulletin d'Ampère-sur-Loire, ${skyHM()} : ${SKY.label.toLowerCase()}, ${T} °C.`];
  L.push(SKY.dju>0?`Température moyenne du jour : ${String(Tm).replace('.',',')} °C, soit ${djuTxt()} degrés-jours (base 18). C'est ce chiffre, pas le thermomètre de l'instant, qui explique la consommation de chauffage.`:`Température moyenne du jour : ${String(Tm).replace('.',',')} °C. Zéro degré-jour : aujourd'hui, aucune chaudière n'a d'excuse.`);
  if(SKY.snow>0||SKY.snowG)L.push("Quand il neige, tout le monde pense au chauffage. C'est pourtant la température, pas les flocons, qui fait tourner les chaudières.");
  else if(skWet())L.push("Mon parapluie sert enfin à quelque chose. Note bien : la pluie ne chauffe ni ne refroidit un bâtiment. Ce qui compte, c'est la température.");
  return L;
}
function relaisLines(){const v=Math.round(SKY.wind*62);return [`Relais météo d'Ampère-sur-Loire, ${skyHM()}. Température : ${Math.round(SKY.T)} °C. Vent : ${v} km/h. Ciel : ${SKY.label.toLowerCase()}.`,`Aujourd'hui : ${djuPhrase()}. Moral des chaudières : ${SKY.dju>8?'en berne, elles travaillent':SKY.dju>0?'correct':'excellent, elles dorment'}.`]}
function pvLines(){
  const p=Math.round(SKY.pv*100),why=SKY.el>0&&SKY.fog>.4?"Dans ce brouillard, presque rien n'arrive jusqu'aux panneaux.":SKY.el<=0?"La nuit, zéro. Le talon du bâtiment, lui, ne dort pas : c'est le réseau qui le fournit.":SKY.snowG?"Avec la neige sur les panneaux, on perd plus de la moitié.":SKY.cloud>.75?"Sous ce ciel couvert, il ne reste que la lumière diffuse.":SKY.cloud>.4?"Chaque nuage qui passe se lit sur la courbe de production.":SKY.el<15?"Le soleil est bas : les rayons arrivent en biais.":"Plein soleil : c'est maintenant qu'il faut faire tourner ce qui peut attendre.";
  return [`Là, tout de suite, les panneaux produisent ${p} % de leur puissance crête. ${why}`,"Une installation solaire, ça se mesure aussi : la production attendue selon la météo, la production réelle, et l'écart entre les deux."];
}
