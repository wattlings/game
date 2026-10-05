/* Wattlings · jeu/monde/couloir-du-vent.js
   Le couloir du vent et la vieille machine. */

/* ================= LE COULOIR DU VENT ET LA VIEILLE MACHINE ================= */
const WIND={parts:[],told:false};
const inCorridor=()=>P.y>=L.wind.y0&&P.y<=L.wind.y1&&P.x>=WIND0&&P.x<=WIND0+5;
function pushBack(to,big){
  P.x=to;P.moving=true;P.pushed=true;P.dir='right';P.pushMsg=big;sfx('wind');
  for(let i=0;i<30;i++)WIND.parts.push({x:P.px+40+Math.random()*80,y:P.py+Math.random()*20-4,v:5+Math.random()*4,l:6+Math.random()*10});
}
function windStep(){
  if(P.pushed){P.pushed=false;
    if(P.pushMsg==='big'){P.pushMsg=null;const first=!S.secrets.vent;
      const L=[{t:"Une bourrasque te soulève presque du sol et te renvoie en arrière !"},{t:"Impossible d'aller plus loin : le champ d'éoliennes, là-bas, brasse beaucoup trop de vent."},{t:"Pour passer, il faudrait être beaucoup plus AGILE."},{w:S.name,t:first?"Au moins, elles produisent. Mais il faudra revenir quand elles seront un peu moins enthousiastes.":"Toujours autant de vent. Je n'insiste pas."}];
      first?secret('vent',L):say(L)}
    else if(P.pushMsg==='gust'){P.pushMsg=null;toast('Une rafale te repousse !')}
    return true}
  if(!inCorridor()){if(P.x<WIND0-3)WIND.told=false;
    
    return false}
  
  if(!WIND.told){WIND.told=true;toast('Le vent se lève…')}
  if(P.x>=WIND0+4){pushBack(WIND0-1,'big');return true}
  if(P.x>=WIND0+2&&P.dir==='right'&&Math.random()<.4){pushBack(Math.max(WIND0-1,P.x-2),'gust');return true}
  return false;
}
function drawWind(ox,oy){
  const near=P.x>=WIND0-8&&Math.abs(P.y-L.wind.y0-1)<14;if(near&&WIND.parts.length<(P.x>=WIND0?70:30)&&Math.random()<.9){for(let i=0;i<2;i++)WIND.parts.push({x:(WIND0+7+Math.random()*12)*TS,y:(L.wind.y0-2+Math.random()*8)*TS,v:3+Math.random()*4,l:6+Math.random()*12})}
  ctx.strokeStyle='rgba(255,255,255,.55)';ctx.lineWidth=1;
  WIND.parts.forEach(w=>{w.x-=w.v;const X=Math.round(w.x-ox),Y=Math.round(w.y-oy+Math.sin(w.x/20)*2);if(X>-20&&X<cv.width+20){ctx.beginPath();ctx.moveTo(X,Y);ctx.lineTo(X+w.l,Y);ctx.stroke()}});
  WIND.parts=WIND.parts.filter(w=>w.x>((WIND0-4)*TS));
}
const MACHINE={x:L.machine[0],y:L.machine[1]};
function actMachine(){
  secret('pspe',[{t:"Les vestiges d'une vieille machine grésillent faiblement. Un voyant jaune clignote, s'éteint, hésite, puis se rallume."},
    {t:"Sous la rouille, tu déchiffres d'étranges symboles gravés sur la plaque : P… S… P… E."},
    {w:S.name,t:"PSPE… Cette machine a l'air d'être en décommissionnement depuis très longtemps. Elle pourrait casser à tout instant."},
    {w:S.name,t:"Mieux vaut ne rien brancher dessus. Et surtout ne pas lui confier de données."}]);
}
