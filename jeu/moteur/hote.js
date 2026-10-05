/* Wattlings · jeu/moteur/hote.js
   L'hôte du jeu : le shadow DOM qui isole l'interface, et les minuteries qui suivent la fenêtre affichant le jeu (onglet ou vignette flottante). */

/* ===== La Quête du Kilowatt : le jeu vit dans un shadow DOM pour ne pas se mélanger au cours ===== */
const QK_HOST=document.getElementById('qk-host');
const ROOT=QK_HOST.attachShadow({mode:'open'});
ROOT.appendChild(document.getElementById('qk-tpl').content.cloneNode(true));
/* les styles du jeu sont des fichiers : leurs adresses sont rendues absolues (elles suivent le jeu dans la vignette flottante)
   et l'interface n'apparaît qu'une fois tous chargés */
{const feuilles=[...ROOT.querySelectorAll('link[rel=stylesheet]')];feuilles.forEach(l=>{l.href=l.href});
  if(feuilles.length){QK_HOST.style.opacity='0';let reste=feuilles.length;const pret=()=>{if(--reste>0)return;QK_HOST.style.opacity='';if(typeof fitScreen==='function')qkTimeout(fitScreen,0)};
    feuilles.forEach(l=>{l.addEventListener('load',pret,{once:true});l.addEventListener('error',pret,{once:true})})}}
/* Minuteries et animations du jeu : elles passent par la fenêtre qui affiche le jeu (l'onglet, ou la vignette flottante),
   pour continuer à tourner quand l'onglet est en arrière-plan ; elles sont réarmées quand le jeu change de fenêtre. */
const PIP={win:null,fwd:false,pop:null,stale:false,isPop:window.name==='wattlings-vignette'};
const QT={win:window,t:new Map(),r:new Map(),n:0};
function qkTimeout(fn,ms){const id=++QT.n,a=[].slice.call(arguments,2),e={w:QT.win,due:Date.now()+(ms||0)};e.run=()=>{QT.t.delete(id);fn.apply(null,a)};e.h=e.w.setTimeout(e.run,ms||0);QT.t.set(id,e);return id}
function qkClear(id){const e=QT.t.get(id);if(e){try{e.w.clearTimeout(e.h)}catch(_){}QT.t.delete(id)}}
function qkInterval(fn,ms){const tick=()=>{qkTimeout(tick,ms);fn()};return qkTimeout(tick,ms)}
function qkRAF(fn){const id=++QT.n,e={w:QT.win};e.run=()=>{QT.r.delete(id);fn(performance.now())};e.h=e.w.requestAnimationFrame(e.run);QT.r.set(id,e);return id}
function qkCancelRAF(id){const e=QT.r.get(id);if(e){try{e.w.cancelAnimationFrame(e.h)}catch(_){}QT.r.delete(id)}}
function qkSwitch(win){
  QT.t.forEach(e=>{try{e.w.clearTimeout(e.h)}catch(_){}e.w=win;e.h=win.setTimeout(e.run,Math.max(0,e.due-Date.now()))});
  QT.r.forEach(e=>{try{e.w.cancelAnimationFrame(e.h)}catch(_){}e.w=win;e.h=win.requestAnimationFrame(e.run)});
  QT.win=win}
/* clavier : quand le jeu est dans la vignette, seules les touches tapées dans la vignette le pilotent */
function onKey(type,fn){addEventListener(type,e=>{if(PIP.win&&!PIP.fwd)return;fn(e)})}
