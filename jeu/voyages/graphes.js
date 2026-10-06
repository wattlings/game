/* Wattlings · jeu/voyages/graphes.js
   Les graphiques des voyages : courbes d'une journée, barres d'une année. Un seul dessin, réglé par ses options,
   pour que tous les sites montrent leurs données de la même façon.

   voyGraphe(canvas, {
     x:[min,max], y:max,                    l'étendue des deux axes
     gradX:[[valeur,'texte'],…], gradY:[valeurs],   les graduations
     unite:'MW',                            écrit en haut de l'axe vertical
     zones:[{de,a,c}],                      des bandes verticales de fond (une plage horaire, par exemple)
     series:[{p:[[x,y],…], c:'#couleur', genre:'aire'|'ligne'|'tirets'|'escalier'|'barres', nom:'Légende', l:largeur des barres, base:[…] pour empiler des barres sur d'autres, marches:1 pour une aire en escalier}],
     reperes:[{x,c,nom}]                    des traits verticaux
   }) */
const VOY_ENCRE={texte:'#1c2440',discret:'#5b6380',grille:'#e3d9b8',repere:'#cdbf95',fond:'#fffaf0',soleil:'#f2a33a',soleilClair:'#f9d58f',prevu:'#5b6380',conso:'#2aa198',alerte:'#c43d3d',reseau:'#4a78c9'};

function voyGraphe(cv,o){
  // sur un écran étroit, le dessin est rétréci à l'affichage : on grossit le texte et on rehausse le graphique pour qu'il reste lisible
  const h0=+(cv.dataset.h||(cv.dataset.h=cv.height)),k=cv.clientWidth?cv.width/cv.clientWidth:1,F=Math.round(Math.max(20,12.5*k)),hVoulue=Math.round(h0*(k>1.6?1.45:1));if(cv.height!==hVoulue)cv.height=hVoulue;
  const c=cv.getContext('2d'),W=cv.width,H=cv.height,E=VOY_ENCRE,legende=(o.series||[]).filter(s=>s.nom),mG=Math.round(F*2.9),mD=Math.round(F*1.5),mH=Math.round(legende.length||o.unite?F*2.2:F*.9),mB=Math.round(F*1.9),police=t=>t+'px "Atkinson Hyperlegible","Segoe UI",system-ui,sans-serif';
  const x0=o.x[0],x1=o.x[1],yM=o.y,px=x=>mG+(x-x0)/(x1-x0)*(W-mG-mD),py=y=>H-mB-Math.max(0,Math.min(1.04,y/yM))*(H-mB-mH);
  c.clearRect(0,0,W,H);c.fillStyle=E.fond;c.fillRect(0,0,W,H);c.font=police(F);c.textBaseline='middle';
  (o.zones||[]).forEach(z=>{c.fillStyle=z.c;c.fillRect(px(z.de),mH,px(z.a)-px(z.de),H-mB-mH)});
  // grille et graduations
  c.lineWidth=1;c.textAlign='right';
  (o.gradY||[]).forEach(v=>{c.strokeStyle=E.grille;c.beginPath();c.moveTo(mG,py(v)+.5);c.lineTo(W-mD,py(v)+.5);c.stroke();c.fillStyle=E.discret;c.fillText(String(v).replace('.',','),mG-8,py(v))});
  c.textAlign='center';(o.gradX||[]).forEach(([v,t])=>{c.fillStyle=E.discret;c.fillText(t,px(v),H-mB+F*.9);c.fillRect(px(v)|0,H-mB,1,5)});
  // séries
  (o.series||[]).forEach(s=>{
    if(!s.p||!s.p.length)return;
    if(s.genre==='barres'){const l=s.l||((W-mG-mD)/s.p.length*.62);s.p.forEach(([x,y],i)=>{const b=s.base?s.base[i]:0;c.fillStyle=s.c;c.fillRect(Math.round(px(x)-l/2),Math.round(py(b+y)),Math.round(l),Math.round(py(b)-py(b+y)))});return}
    const chemin=()=>{c.beginPath();s.p.forEach(([x,y],i)=>{if((s.genre==='escalier'||s.marches)&&i){c.lineTo(px(x),py(s.p[i-1][1]))}i?c.lineTo(px(x),py(y)):c.moveTo(px(x),py(y))})};
    if(s.genre==='aire'){chemin();c.lineTo(px(s.p[s.p.length-1][0]),py(0));c.lineTo(px(s.p[0][0]),py(0));c.closePath();c.fillStyle=s.fond||s.c;c.globalAlpha=s.fond?1:.35;c.fill();c.globalAlpha=1}
    chemin();c.strokeStyle=s.c;c.lineWidth=s.e||3;c.lineJoin='round';c.setLineDash(s.genre==='tirets'?[8,6]:[]);c.stroke();c.setLineDash([]);
  });
  (o.reperes||[]).forEach(r=>{c.strokeStyle=r.c||E.alerte;c.lineWidth=2;c.setLineDash([4,4]);c.beginPath();c.moveTo(px(r.x),mH);c.lineTo(px(r.x),H-mB);c.stroke();c.setLineDash([]);if(r.nom){c.fillStyle=r.c||E.alerte;c.textAlign=px(r.x)>W*.7?'right':'left';c.fillText(r.nom,px(r.x)+(px(r.x)>W*.7?-6:6),mH+F*.6)}});
  // axes
  c.strokeStyle=E.texte;c.lineWidth=2;c.beginPath();c.moveTo(mG,mH-4);c.lineTo(mG,H-mB);c.lineTo(W-mD,H-mB);c.stroke();
  // légende, en haut
  const hL=Math.round(F*.8);{const large=(o.unite?c.measureText(o.unite).width+F*1.3:0)+legende.reduce((t,s)=>t+F*2.5+c.measureText(s.nom).width,0);if(large>W-16)c.font=police(Math.max(F*.62,Math.floor(F*(W-16)/large)))}   // une légende trop longue se resserre
  let lx=8;c.textAlign='left';if(o.unite){c.fillStyle=E.discret;c.fillText(o.unite,lx,hL);lx+=c.measureText(o.unite).width+F*1.3}
  legende.forEach(s=>{const l=F*1.1,ht=F*.7;c.strokeStyle=s.c;c.fillStyle=s.c;if(s.genre==='barres'||s.genre==='aire'){c.globalAlpha=s.genre==='aire'&&!s.fond?.5:1;c.fillStyle=s.fond||s.c;c.fillRect(lx,hL-ht/2,l,ht);c.globalAlpha=1;c.strokeStyle=s.c;c.lineWidth=2;c.strokeRect(lx,hL-ht/2,l,ht)}else{c.lineWidth=3;c.setLineDash(s.genre==='tirets'?[6,4]:[]);c.beginPath();c.moveTo(lx,hL);c.lineTo(lx+l,hL);c.stroke();c.setLineDash([])}
    c.fillStyle=E.texte;c.fillText(s.nom,lx+l+F*.3,hL+1);lx+=l+F*.3+c.measureText(s.nom).width+F*1.1});
}

/* une heure décimale en clair : 13.5 → « 13 h 30 » */
const voyHeure=h=>{const m=Math.round(h*60);return Math.floor(m/60)%24+' h '+String(m%60).padStart(2,'0')};
/* un réglage à curseur, avec son intitulé et sa valeur affichée ; renvoie l'élément <input> */
function voyCurseur(el,{nom,min,max,pas,val,dire,quand}){
  const d=document.createElement('label');d.className='voy-curseur';d.innerHTML=`<span><b>${esc(nom)}</b><output></output></span><input type="range" min="${min}" max="${max}" step="${pas}" value="${val}">`;el.appendChild(d);
  const i=d.querySelector('input'),o=d.querySelector('output'),maj=()=>{o.textContent=dire(+i.value)};i.addEventListener('input',()=>{maj();quand(+i.value)});maj();return i;
}
/* après un verdict : le faire venir à l'écran si le panneau est plus haut que la fenêtre */
function voyMontrer(el){try{el.scrollIntoView({block:'nearest',behavior:'smooth'})}catch(e){}}
