/* Wattlings · jeu/interface/intro-video.js
   La vidéo d'introduction, à la manière de Pokémon Rouge Feu : le logo du studio et son étoile filante, un duel de nuit
   (le héros contre Picatron), l'écran titre, puis Mme Joule qui présente le monde, le déroulé du jeu et ce qu'on y apprend.
   Tout est dessiné en direct avec les graphismes du jeu (la vraie ville, les personnages, les anomalies, les badges),
   dans une image de 240 × 160 pixels, la taille d'un écran de console portable, agrandie sans flou.
   Elle se lance au début d'une nouvelle partie, avant la présentation des commandes, et se revoit depuis Menu → Options.
   « Passer » ou Échap l'arrête ; Entrée, Espace ou un clic font avancer. Sans le son du jeu, elle reste muette :
   tout ce qui est dit est écrit dans la boîte de dialogue. */

const IV_W=240,IV_H=160;
/* les lettres qui manquent à la petite police du jeu (F35, rendu/decor-velos.js) */
const IV_F=Object.assign({},F35,{W:'101101101111101',K:'101110100110101',J:'001001001101111',X:'101101010101101',Y:'101101010010010',Z:'111001010100111',Q:'111101101111001',"'":'010010000000000','!':'010010010000010','.':'000000000000010'});
/* le W, trop large pour trois pixels, a sa propre grille de cinq */
const IV_W5='1000110001101011010101010';
function ivTexte(c,str,x,y,col,s){s=s||1;let k=0;for(const ch of str.toUpperCase()){
    if(ch==='W'){for(let i=0;i<25;i++)if(IV_W5[i]==='1')R(c,x+k+(i%5)*s,y+((i/5)|0)*s,s,s,col);k+=6*s;continue}
    const g=IV_F[ch];if(g)for(let i=0;i<15;i++)if(g[i]==='1')R(c,x+k+(i%3)*s,y+((i/3)|0)*s,s,s,col);k+=(ch===' '?2:4)*s}return k-s}
const ivLargeur=(str,s)=>{let k=0;for(const ch of str.toUpperCase())k+=(ch==='W'?6:ch===' '?2:4)*s;return k-s};
/* les répliques de Mme Joule, et ce que l'écran montre pendant chacune */
const IV_JOULE=[
  ['joule',"Bonjour ! Bienvenue dans le monde de l'énergie !"],
  ['joule',"Je m'appelle Mme Joule. Les gens m'appellent l'energy manager. Les factures, elles, m'appellent tout court."],
  ['courbe',"Ce monde est peuplé de kWh. La plupart travaillent. D'autres s'échappent la nuit, quand le bâtiment dort et que personne ne regarde."],
  ['anomalies',"Et dans les données rôdent des créatures étranges : les anomalies. Un trou ici, un doublon là, un pic à 999,9 kW…"],
  ['sites',"Toi, tu vas prendre en main un site d'Ampère-sur-Loire : une école, des bureaux, ou une boulangerie."],
  ['ville',"Dans chaque quartier, une arène : trois dresseurs, un champion, et une étape de la démarche à maîtriser."],
  ['badges',"Huit arènes, huit badges. Cadrer, Collecter, Fiabiliser, Structurer : la donnée. Puis Analyser, Détecter, Agir, Mesurer : l'énergie."],
  ['ems',"Dans l'EMS du bureau, tu manipuleras les vraies courbes de ton site : les nettoyer, les lire, traquer les dérives, et prouver les économies."],
  ['duo',"À la fin, tu sauras faire baisser la consommation d'un bâtiment. Et surtout, le prouver."],
  ['depart',"Ton aventure dans le monde de l'énergie commence ! En route !"]
];

function introVideo(onDone){
  const avant=busy;busy=true;clearKeys();
  const reduit=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const ov=document.createElement('div');ov.className='iv';ov.setAttribute('role','dialog');ov.setAttribute('aria-modal','true');ov.setAttribute('aria-label',"Vidéo d'introduction");
  ov.innerHTML=`<div class="iv-ecran"><canvas width="${IV_W}" height="${IV_H}" aria-hidden="true"></canvas><div class="iv-boite" aria-live="polite" hidden></div><div class="iv-suite" aria-hidden="true" hidden>▼</div></div>
    <div class="iv-barre"><span class="iv-aide">${matchMedia('(pointer:coarse)').matches?'Touche l’image pour avancer':'Entrée ou clic pour avancer · Échap pour passer'}</span><button type="button" class="btn alt iv-passer">Passer la vidéo ▸</button></div>`;
  $('layer').appendChild(ov);
  const cv=ov.querySelector('canvas'),x=cv.getContext('2d'),boite=ov.querySelector('.iv-boite'),suite=ov.querySelector('.iv-suite');x.imageSmoothingEnabled=false;
  /* les acteurs : dessinés une fois, avec les fonctions du jeu */
  const sprite=(pal,dir,frame)=>{const c=document.createElement('canvas');c.width=20;c.height=20;drawChar(c.getContext('2d'),2,3,dir,frame||0,pal);return c};
  const heros=avPal(0,AVDEF('h')),JOULE={skin:'#e0ac7e',shirt:'#8a3b8f',pants:'#2f3a5c',hair:'#9a9aa2',style:'carre',bun:1,glasses:1,scarf:'#f2a33a',lash:1,prop:'tablet'};
  const H={d:sprite(heros,'down'),r:sprite(heros,'right'),r1:sprite(heros,'right',1),r2:sprite(heros,'right',2),u:sprite(heros,'up')},J=sprite(JOULE,'down');
  const pic=monCanvas(ANOM.find(a=>a.id==='pic'),40),mons=['trou','doublon','pic','unite'].map(id=>[ANOM.find(a=>a.id===id),monCanvas(ANOM.find(a=>a.id===id),40)]);
  if(!mapCache.town)try{buildMapCanvas('town')}catch(e){}
  const ville=mapCache.town,over=mapOver.town,bat=id=>BLD.find(b=>b.id===id);
  const coin=b=>b&&b.door?[b.door[0]*TS+8,b.door[1]*TS]:[0,0];
  const peindre=(img,cx,cy,dx,dy,w,h,k=1)=>{if(!img)return;const sx=Math.max(0,Math.min(img.width-w/k,cx-w/k/2)),sy=Math.max(0,Math.min(img.height-h/k,cy-h/k/2));x.drawImage(img,sx,sy,w/k,h/k,dx,dy,w,h)};
  const villeEn=(cx,cy,dx,dy,w,h,k)=>{peindre(ville,cx,cy,dx,dy,w,h,k);peindre(over,cx,cy,dx,dy,w,h,k)};
  const fond=(a,b)=>{const g=x.createLinearGradient(0,0,0,IV_H);g.addColorStop(0,a);g.addColorStop(1,b);x.fillStyle=g;x.fillRect(0,0,IV_W,IV_H)};
  const perso=(img,px,py,k)=>x.drawImage(img,Math.round(px),Math.round(py),20*k,20*k);
  const voile=(col,a)=>{if(a<=0)return;x.globalAlpha=Math.min(1,a);x.fillStyle=col;x.fillRect(0,0,IV_W,IV_H);x.globalAlpha=1};
  const etiquette=(t,px,py,col,taille)=>{x.font=`${taille||8}px "Unifont","Atkinson Hyperlegible",monospace`;x.textAlign='center';x.fillStyle='rgba(0,0,0,.45)';x.fillText(t,px+1,py+1);x.fillStyle=col||'#fff';x.fillText(t,px,py)};
  const musique=n=>{if(AUD.ctx&&AUD.on)playTrack(n)};

  /* ---- 1. le logo, et son étoile filante ---- */
  const logo=t=>{fond('#000','#000');
    if(!reduit&&t<1.6){const p=t/1.6,sx=IV_W+10-p*(IV_W+40),sy=30+p*40;for(let i=0;i<14;i++){const q=i/14;x.fillStyle=`rgba(255,236,150,${(1-q)*.8})`;x.fillRect(sx+i*6,sy-i*1.6,2,2)}x.fillStyle='#fff';x.fillRect(sx-1,sy-1,4,4)}
    const a=Math.max(0,Math.min(1,(t-1.2)/.8));x.globalAlpha=a;const w=ivLargeur('WATTLINGS',3);ivTexte(x,'WATTLINGS',(IV_W-w)/2,62,'#f2c12e',3);
    etiquette('présente',IV_W/2,96,'#cfd8e8',9);x.globalAlpha=1;
    if(t>1.4)for(let i=0;i<6;i++){const ph=(t*3+i*1.7)%2;if(ph<1){x.fillStyle=`rgba(255,255,255,${1-ph})`;x.fillRect(60+i*22+(i%2)*5,50+(i*13)%30,2,2)}}
    voile('#000',t>4?(t-4)*2:0)};
  /* ---- 2. le duel de nuit : le héros contre Picatron ---- */
  const duel=t=>{
    if(t<3){fond('#0b1030','#26305a');{const [cx,cy]=coin(bat('mairie'));villeEn(cx-60+t*40,cy-30,0,40,IV_W,120,1)}voile('#0b1030',.55);
      for(let i=0;i<30;i++){x.fillStyle=`rgba(255,255,255,${.4+.6*((i*7+Math.floor(t*4))%5)/5})`;x.fillRect((i*53)%IV_W,(i*29)%40,1,1)}
      etiquette('Ampère-sur-Loire, 3 h du matin.',IV_W/2,26,'#e8eef7',9);voile('#000',t<.5?1-t*2:0);return}
    const u=t-3;fond('#1c2748','#3b4258');x.fillStyle='#2b3142';x.fillRect(0,112,IV_W,48);x.fillStyle='rgba(255,236,150,.12)';x.beginPath();x.ellipse(176,114,40,8,0,0,7);x.fill();x.beginPath();x.ellipse(60,128,40,8,0,0,7);x.fill();
    const saut=reduit?0:Math.abs(Math.sin(u*5))*10,recul=u>4.2&&u<5?(u-4.2)*30:u>=5?24:0;
    x.drawImage(pic,150+recul,58-saut,52,52);
    const elan=u>3.6&&u<4.4?(u-3.6)*70:u>=4.4?56-(u-4.4)*20:0,pas=Math.floor(u*6)%2?H.r1:H.r2;perso(u>3.6&&u<4.6?pas:H.r,26+Math.max(0,elan),78,3);
    if(u>4.2&&u<4.5)voile('#fff',reduit?.3:.9);
    if(u>5.3){const e=Math.min(1,(u-5.3)*3);x.strokeStyle=`rgba(242,193,46,${e})`;x.lineWidth=3;x.beginPath();x.moveTo(120,0);x.lineTo(104,60);x.lineTo(128,58);x.lineTo(110,120);x.stroke()}
    if(u<1.6)etiquette('Une anomalie s’est glissée dans les données…',IV_W/2,24,'#e8eef7',9);
    else if(u>5)etiquette('Il faut quelqu’un pour la remettre à sa place.',IV_W/2,24,'#f2c12e',9);
    voile('#fff',u>6.6?(u-6.6)*3:0)};
  /* ---- 3. l'écran titre ---- */
  const titre=t=>{fond('#f2a33a','#8a3b8f');
    for(let i=0;i<5;i++){x.fillStyle='rgba(255,255,255,.08)';x.beginPath();x.moveTo(IV_W/2,IV_H);x.lineTo(i*60-20+(reduit?0:Math.sin(t+i)*6),0);x.lineTo(i*60+10,0);x.fill()}
    const w=ivLargeur('WATTLINGS',5);ivTexte(x,'WATTLINGS',(IV_W-w)/2+2,26+2,'#3a1d2e',5);ivTexte(x,'WATTLINGS',(IV_W-w)/2,26,'#fff3c4',5);
    etiquette("L'Energy Management par la donnée",IV_W/2,64,'#fff',9);
    mons.forEach(([a,c],i)=>x.drawImage(c,14+i*58+(i>1?22:0),96+(reduit?0:Math.sin(t*3+i)*3),30,30));
    perso(H.d,IV_W/2-24,84,2.4);
    if(Math.floor(t*2)%2===0)etiquette('Appuie sur Entrée',IV_W/2,150,'#fff3c4',8);
    voile('#fff',t<.4?1-t*2.5:0)};
  /* ---- 4. Mme Joule présente le monde ---- */
  const scene=(v,t)=>{
    fond('#f7f0dc','#c9dceb');x.fillStyle='rgba(28,36,64,.12)';x.beginPath();x.ellipse(IV_W/2,104,56,10,0,0,7);x.fill();
    if(v==='joule'){perso(J,IV_W/2-36,26,3.6);return}
    if(v==='courbe'){const c=weekCurve('ecole').slice(0,96),mx=Math.max(...c),L=14,W=IV_W-28,T=12,HH=86,Y=v=>T+HH-v/mx*HH;
      x.fillStyle='#fffaf0';x.fillRect(8,6,IV_W-16,100);x.strokeStyle='#2aa198';x.lineWidth=1.5;x.beginPath();c.forEach((v,i)=>i?x.lineTo(L+W*i/96,Y(v)):x.moveTo(L,Y(v)));x.stroke();
      const n=Math.min(96,Math.floor(t*30));x.fillStyle='rgba(196,61,61,.35)';for(let i=0;i<n;i++){const H2=(i%48)/2;if(H2<6||H2>=21)x.fillRect(L+W*i/96,Y(c[i]+3),W/96,Y(c[i])-Y(c[i]+3)+.5)}
      etiquette('la nuit, ça fuit',IV_W/2,100,'#c43d3d',8);perso(J,4,94,2);return}
    if(v==='anomalies'){mons.forEach(([a,c],i)=>{const px=14+i*56,py=30+(reduit?0:Math.abs(Math.sin(t*4+i))*-8);if(t>i*.4){x.drawImage(c,px,py,44,44);etiquette(a.name,px+22,88,'#1c2440',8)}});return}
    if(v==='sites'){['ecole','bureau','boulangerie'].forEach((id,i)=>{if(t<i*.6)return;const [cx,cy]=coin(bat(id)),px=6+i*78;x.fillStyle='#1c2440';x.fillRect(px-1,13,74,58);villeEn(cx,cy-20,px,14,72,56,1);etiquette(['École','Bureaux','Boulangerie'][i],px+36,84,'#1c2440',9)});return}
    if(v==='ville'){const A=BLD.filter(b=>b.arena),k=Math.min(A.length-1,Math.floor(t/1.2)),b=A[k],[cx,cy]=coin(b);x.fillStyle='#1c2440';x.fillRect(19,5,202,98);villeEn(cx,cy-24,20,6,200,96,1);
      etiquette(b.arena?b.arena.name:'',IV_W/2,114,'#1c2440',9);return}
    if(v==='badges'){for(let i=0;i<8;i++){if(t<i*.45)continue;const px=14+(i%4)*56,py=10+Math.floor(i/4)*52;x.drawImage(badgeCanvas(i+1),px+12,py,32,32);etiquette(BLAB(ARENAS[i].badge),px+28,py+44,i<4?'#2f6db5':'#c0503a',8)}return}
    if(v==='ems'){const {vrai,brut}=sbSeries('bureau'),p=Math.min(1,t/5),mx=Math.max(...vrai)*1.3,L=12,W=IV_W-24,Y=v=>100-Math.min(v,mx)/mx*86;
      x.fillStyle='#1c2440';x.fillRect(8,4,IV_W-16,10);etiquette('EMS du bureau',IV_W/2,12,'#e8eef7',7);x.fillStyle='#fffaf0';x.fillRect(8,14,IV_W-16,92);
      const s=p<.35?brut:p<.7?vrai:vrai.map((v,i)=>v-(((i%48)/2<6||(i%48)/2>=21)?3:0)*1.6);x.strokeStyle=p<.35?'#9aa0a8':p<.7?'#2aa198':'#2f6db5';x.lineWidth=1.2;x.beginPath();let lev=true;s.forEach((v,i)=>{if(v===null){lev=true;return}const px=L+W*i/s.length;lev?x.moveTo(px,Y(v)):x.lineTo(px,Y(v));lev=false});x.stroke();
      etiquette(p<.35?'brute':p<.7?'propre':'plus basse !',IV_W/2,118,'#1c2440',9);return}
    if(v==='duo'){perso(J,IV_W/2-62,30,3);perso(H.d,IV_W/2+6,30,3);return}
    if(v==='depart'){const k=Math.max(.6,3.2-t*.9);perso(H.u,IV_W/2-10*k,104-20*k,k);voile('#fff',t>2.4?(t-2.4)*1.5:0)}};

  /* ---- le déroulé ---- */
  const PLAN=[[logo,4.6],[duel,10],[titre,6]];let partie=0,t0=performance.now(),ligne=-1,tape=0,tl0=0,fini=false,raf=0;
  const texte=()=>IV_JOULE[ligne][1];
  const montrerLigne=i=>{ligne=i;tape=0;tl0=performance.now();boite.hidden=false;suite.hidden=true;boite.innerHTML='<b>Mme Joule</b><span></span>'};
  const avancer=()=>{
    if(partie<PLAN.length){partie++;t0=performance.now();if(partie===1)musique('battle');if(partie===2)musique('title');if(partie===PLAN.length){musique('town');montrerLigne(0)}return}
    if(tape<texte().length){tape=texte().length;return}
    if(ligne<IV_JOULE.length-1)montrerLigne(ligne+1);else terminer(false)};
  const terminer=passee=>{if(fini)return;fini=true;cancelAnimationFrame(raf);removeEventListener('keydown',touche,true);ov.remove();busy=avant;clearKeys();
    trk('video',{fin:passee?'passee':'vue',s:Math.round((performance.now()-debut)/1000),ou:partie<PLAN.length?partie:3+ligne});
    try{updateMusic()}catch(e){}if(onDone)onDone()};
  const debut=performance.now();
  const image=now=>{if(fini)return;
    if(partie<PLAN.length){const [f,d]=PLAN[partie],t=(now-t0)/1000;f(t);if(t>=d)avancer()}
    else{const t=(now-tl0)/1000;scene(IV_JOULE[ligne][0],t);
      if(tape<texte().length){tape=Math.min(texte().length,Math.floor(t*(reduit?200:38)));boite.querySelector('span').textContent=texte().slice(0,tape)}
      else{boite.querySelector('span').textContent=texte();suite.hidden=false;if(t>texte().length/38+Math.max(2.2,texte().length*.035))avancer()}}
    raf=requestAnimationFrame(image)};
  const touche=e=>{if(!ov.isConnected)return;
    if(e.key==='Escape'){e.preventDefault();e.stopPropagation();terminer(true)}
    else if(e.key==='Enter'||e.key===' '||e.key==='ArrowRight'){if(document.activeElement&&document.activeElement.classList&&document.activeElement.classList.contains('iv-passer'))return;e.preventDefault();e.stopPropagation();avancer()}};
  addEventListener('keydown',touche,true);
  ov.querySelector('.iv-ecran').onclick=avancer;
  ov.querySelector('.iv-passer').onclick=()=>terminer(true);
  ov.tabIndex=-1;ov.focus();
  raf=requestAnimationFrame(image);
}
