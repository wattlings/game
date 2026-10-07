/* Wattlings · jeu/rendu/saisons.js
   Saisons et patine : couleurs de saison, neige. */

/* ================= SAISONS ET PATINE =================
   Le décor de la ville est peint une fois, puis repeint quand la saison change, quand il neige ou quand on règle la patine.
   - printemps : herbe tendre, davantage de fleurs, pommiers en fleurs ;
   - été : la ville telle qu'on la connaît ;
   - automne : feuillages roux et dorés, feuilles mortes un peu partout ;
   - hiver : arbres nus, plus de fleurs ; s'il a neigé, tout ce qui regarde le ciel est blanc.
   La patine (usure, traces de vie, nature qui déborde, défauts) se règle sur cinq niveaux, de « neuf » à « très marqué ». */
const WEAR_K=[0,.5,1,1.6,2.4],WEAR_NAMES=['Neuf','Léger','Présent','Marqué','Très marqué'];
const SEA={k:'',se:1,snow:false};
const wearLvl=()=>Math.max(1,Math.min(5,PREF.wear|0||1));
/* à appeler avant de repeindre la ville : fixe la patine, les teintes de l'herbe, et fait régénérer les arbres si la saison a changé */
function seasonArt(){
  WEAR=WEAR_K[wearLvl()-1];SEA.se=SKY.season;SEA.snow=!!SKY.snowG;
  const p=SEA.snow?GSNOW:GSEASON[SEA.se];GCOL[0]=p[0];GCOL[1]=p[1];GCOL[2]=p[2];GT[0]=p[3];GT[1]=p[4];regGrassInit(p);
  const k=SEA.se+'|'+(SEA.snow?1:0);if(k!==SEA.k){SEA.k=k;ART.tree=null}
}
/* la neige se pose sur tout ce qui regarde vers le haut : chaque pixel opaque qui a du vide au-dessus de lui devient blanc */
function snowCap(x,w,h,depth){
  const im=x.getImageData(0,0,w,h),d=im.data,s=new Uint8ClampedArray(d),A=(a,b)=>b<0?0:s[(b*w+a)*4+3];
  for(let b=0;b<h;b++)for(let a=0;a<w;a++){if(A(a,b)<200||A(a,b-1)>=200)continue;const n=depth-((a*7+b*3)%3===0?1:0);
    for(let k=0;k<n&&b+k<h;k++){if(A(a,b+k)<200)break;const i=((b+k)*w+a)*4,sh=k===n-1&&n>1;d[i]=sh?214:250;d[i+1]=sh?226:252;d[i+2]=sh?238:255}}
  x.putImageData(im,0,0);
}
function snowTwig(x,w,h){
  const im=x.getImageData(0,0,w,h),d=im.data,s=new Uint8ClampedArray(d),A=(a,b)=>a<0||b<0||a>=w||b>=h?0:s[(b*w+a)*4+3];
  for(let b=1;b<h-4;b++)for(let a=0;a<w;a++){if(A(a,b)<200||A(a,b-1)>=200||thash(a*3+1,b*7+w)<.3)continue;const i=((b-1)*w+a)*4;d[i]=250;d[i+1]=252;d[i+2]=255;d[i+3]=255}
  x.putImageData(im,0,0);
}
function snowProp(c,ch,x,y,at){
  const X=x*TS,Y=y*TS,W='#f8fbfd',S2='#d6e2ee',h=wh(x,y,90);
  if(ch==='h'){if(at(0,-1)==='h'){R(c,X+3+((h*8)|0),Y+3,4,2,W);return}R(c,X+1,Y+2,14,3,W);R(c,X+1,Y+5,14,1,S2);for(let i=0;i<3;i++)R(c,X+2+((wh(x,y,91+i)*11)|0),Y+5,2,2,W)}
  else if(ch==='f'){if(at(-1,0)==='f'||at(1,0)==='f'||!(at(0,-1)==='f'||at(0,1)==='f')){R(c,X,Y+4,16,1,W);R(c,X+2,Y+1,3,1,W);R(c,X+10,Y+1,3,1,W);R(c,X+1,Y+9,5,1,W);R(c,X+9,Y+9,6,1,W)}else R(c,X+7,Y,2,2,W)}
  else if(ch==='P'){R(c,X,Y,16,2,W);R(c,X,Y+2,16,1,S2);R(c,X+((h*12)|0),Y+2,3,1,W)}
  else if(ch==='m'){const vert=(at(0,-1)==='m'||at(0,1)==='m')&&!(at(-1,0)==='m'||at(1,0)==='m');if(vert){R(c,X+5,Y,6,16,W);R(c,X+10,Y,1,16,S2)}else{R(c,X,Y+2,16,3,W);R(c,X,Y+5,16,1,S2)}}
}
/* toit enneigé : la neige suit la forme du toit, laisse voir un rang de tuiles au bord et quelques plaques qui ont glissé */
function snowRoof(c,b,X,Y,W,rh,rt,rc){
  const Wc='#f6fafd',S1='#dde7f0',S2='#c5d3e0',s=i=>thash(b.x*7+i,b.y*3+i*5);
  if(rt==='flat'){R(c,X+2,Y+5,W-4,rh-10,Wc);R(c,X+2,Y+rh-7,W-4,2,S1);for(let i=0;i<4;i++)R(c,X+5+((s(i)*(W-14))|0),Y+8+((s(i+9)*(rh-18))|0),4,1,S1);return}
  const al=rt==='shed'?.55:1;c.globalAlpha=al;
  for(let i=1;i<rh-4;i++){const a=rt==='gable'?Math.max(0,8-i):rt==='mansard'&&i<4?4:0,x0=X-1+a,w=W+2-2*a;R(c,x0,Y+i,w,1,i%4===0?S1:Wc);R(c,x0+w-2,Y+i,2,1,S2)}
  c.globalAlpha=1;
  for(let i=0;i<3;i++){const a=4+((s(i+3)*(W-14))|0);R(c,X+a,Y+rh-7,5+((s(i+6)*4)|0),3,tint(rc||b.roof,-.1));R(c,X+a,Y+rh-8,2,1,S2)}   // plaques qui ont glissé
  for(let k=1;k<W;k+=5)if(s(k+20)<.45)R(c,X+k,Y+rh-1,1,2+((s(k+40)*3)|0),'#eaf4fb');                                              // glaçons sous l'avant-toit
}
function seasonGround(c,ch,x,y){
  const X=x*TS,Y=y*TS,G=MAPS.town.g,at=(dx,dy)=>G[y+dy]&&G[y+dy][x+dx],h=wh(x,y,80),h2=wh(x,y,81);
  if(SEA.snow){
    if(ch===','||ch==='d'||ch===':'||ch==='q'){R(c,X,Y,16,16,'rgba(244,248,252,'+(ch===':'?.55:.74)+')');if(h<.5)R(c,X+((h2*12)|0),Y+3+((h*20)|0)%10,3,1,'#d6e2ee')}
    else if(ch==='g'){R(c,X,Y,16,16,'rgba(244,248,252,.4)')}
    else if((ch==='b'||ch==='=')&&h<.3){const a=3+((h2*8)|0),b=3+(((h2*37)|0)%9);R(c,X+a,Y+b,2,3,'rgba(120,130,150,.28)');R(c,X+a+4,Y+b+3,2,3,'rgba(120,130,150,.28)')}   // traces de pas
    else if(ch==='.'||ch==='*'){if(h<.3){const a=1+((h2*8)|0),b=2+(((h2*53)|0)%10),w=5+((h*20)|0)%5;R(c,X+a,Y+b,w,1,'#d3deea');R(c,X+a+1,Y+b+1,w,1,'#dfe8f1');R(c,X+a+1,Y+b-1,w-2,1,'#ffffff')}else if(h>.93){R(c,X+7,Y+7,1,1,'#ffffff');R(c,X+6,Y+8,3,1,'#c9d6e3')}}
    return}
  if(WEAR)wearGround(c,ch,x,y);
  const walk=ch==='.'||ch==='='||ch==='b'||ch===','||ch==='d'||ch==='*',tree=k=>{for(let j=-1;j<=1;j++)for(let i=-1;i<=1;i++)if(at(i,j)==='T'&&(k===undefined?!treeEver(artTreeKind(x+i,y+j)):artTreeKind(x+i,y+j)===k))return true;return false};
  if(SEA.se===2){   // automne : les feuilles tombent, le vent les pousse jusque sur les pistes et dans l'eau
    const leaves=n=>{for(let i=0;i<n;i++){const a=(wh(x,y,100+i)*14)|0,b=(wh(x,y,110+i)*14)|0,col=LEAFC[(wh(x,y,120+i)*5)|0];R(c,X+a,Y+b,2,1,col);if(i%2)R(c,X+a+1,Y+b+1,1,1,col);else R(c,X+a,Y+b-1,1,1,tint(col,.2))}};
    if(walk){if(tree())leaves(4+((h*5)|0));else if(h<.22)leaves(1+((h2*2)|0))}
    else if((ch==='R'||ch==='~')&&h<.12&&at(-1,0)===ch&&at(1,0)===ch){const col=LEAFC[(h2*5)|0];R(c,X+5+((h2*5)|0),Y+6,2,1,col);R(c,X+6+((h2*5)|0),Y+7,1,1,col)}
  }else if(SEA.se===0&&walk&&tree(3)){   // printemps : pétales sous les pommiers
    for(let i=0;i<4+((h*4)|0);i++)R(c,X+((wh(x,y,100+i)*15)|0),Y+((wh(x,y,110+i)*15)|0),1,1,i%3?'#f9d3e2':'#ffffff')}
}
