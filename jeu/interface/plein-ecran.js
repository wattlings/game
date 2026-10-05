/* Wattlings · jeu/interface/plein-ecran.js
   Plein écran : API native quand elle existe, sinon mode immersif. */

/* ---- plein écran : API native quand elle existe, sinon mode immersif (iPhone, vues d'application) ---- */
const QK_APP=ROOT.querySelector('.qk-app'),FSB=$('qkFs');
const fsEl=()=>document.fullscreenElement||document.webkitFullscreenElement;
const MOBILE=matchMedia('(pointer:coarse), (max-width:760px)');
function fitScreen(){
  const app=true;QK_APP.classList.add('app'); // l'écran de jeu occupe toujours toute la place disponible
  const c=$('screen'),w=$('wrap'),Wd=w.clientWidth,Ht=app?w.clientHeight:Math.round(Wd*11/15);
  if(!Wd||!Ht)return;
  let s=Math.min(Wd,Ht)/(TS*10.5);s=Math.max(1.5,Math.min(6,s));if(s>=2)s=Math.round(s*2)/2;
  const cw=Math.ceil(Wd/s),ch=Math.ceil(Ht/s);
  if(c.width!==cw||c.height!==ch){c.width=cw;c.height=ch;ctx.imageSmoothingEnabled=false}
  c.style.width=Wd+'px';c.style.height=Ht+'px';
}
if(MOBILE.addEventListener)MOBILE.addEventListener('change',()=>qkTimeout(fitScreen,50));
function setFsUI(on){
  QK_APP.classList.toggle('fs',on);FSB.setAttribute('aria-pressed',on);FSB.innerHTML=on?'✕<span class="lg"> Quitter le plein écran</span>':'⛶<span class="lg"> Plein écran</span>';
  qkRAF(()=>qkRAF(fitScreen));
}
async function enterFs(){
  trk('setting',{k:'plein_ecran',v:true});
  setFsUI(true);
  const req=QK_HOST.requestFullscreen||QK_HOST.webkitRequestFullscreen;
  if(req){try{await req.call(QK_HOST,{navigationUI:'hide'})}catch(e){}}
  try{if(screen.orientation&&screen.orientation.lock&&matchMedia('(pointer:coarse)').matches)await screen.orientation.lock('landscape')}catch(e){}
  qkTimeout(fitScreen,250);
}
function exitFs(){
  setFsUI(false);
  if(fsEl()){const ex=document.exitFullscreen||document.webkitExitFullscreen;try{ex&&ex.call(document)}catch(e){}}
  try{screen.orientation&&screen.orientation.unlock&&screen.orientation.unlock()}catch(e){}
}
FSB.onclick=()=>QK_APP.classList.contains('fs')?exitFs():enterFs();
['fullscreenchange','webkitfullscreenchange'].forEach(ev=>document.addEventListener(ev,()=>{if(!fsEl()&&QK_APP.classList.contains('fs')&&QK_APP.dataset.native==='1')setFsUI(false);QK_APP.dataset.native=fsEl()?'1':'0';qkTimeout(fitScreen,100)}));
addEventListener('resize',()=>qkTimeout(fitScreen,60));addEventListener('orientationchange',()=>qkTimeout(fitScreen,300));
if(window.ResizeObserver)new ResizeObserver(fitScreen).observe($('wrap'));
onKey('keydown',e=>{if(QK_HOST.hidden)return;const t=((e.composedPath&&e.composedPath()[0])||e.target).tagName;if(/INPUT|SELECT|TEXTAREA/.test(t||''))return;if(e.code==='KeyF'&&!e.ctrlKey&&!e.metaKey&&!e.altKey){e.preventDefault();FSB.click()}});
{const _go=goCourse;goCourse=function(h){if(QK_APP.classList.contains('fs'))exitFs();return _go(h)}}
