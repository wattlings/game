/* Wattlings · jeu/moteur/entrees.js
   Entrées : clavier, manette tactile, boutons autour de l'écran. */

/* ================= ENTRÉES ================= */
const KEYMAP={ArrowUp:'up',ArrowDown:'down',ArrowLeft:'left',ArrowRight:'right',KeyW:'up',KeyS:'down',KeyA:'left',KeyD:'right'};
onKey('keydown',e=>{
  if(QK_HOST.hidden)return;const tag=(((e.composedPath&&e.composedPath()[0])||e.target).tagName||'').toLowerCase();if(tag==='input'||tag==='select'||tag==='textarea')return;
  const isM=(e.key||'').toLowerCase()==='m'&&!e.ctrlKey&&!e.metaKey&&!e.altKey; // la lettre M, quel que soit le clavier (AZERTY ou QWERTY)
  if(busy){if(isM&&!e.repeat&&panelEl&&panelEl.querySelector('#mClose')){e.preventDefault();closePanel()}return}
  const k=KEYMAP[e.code]||KEYMAP[e.key];
  if(k){keys[k]=1;e.preventDefault();return}
  if(e.code==='Space'||e.key==='Enter'||e.code==='KeyE'){e.preventDefault();if(!e.repeat)pressA();return}
  if(e.code==='KeyC'&&!e.ctrlKey&&!e.metaKey&&!e.altKey){e.preventDefault();if(!e.repeat)startRoll();return}
  if(isM){e.preventDefault();if(!e.repeat)openMenu()}
});
onKey('keyup',e=>{if(e.key==='Shift')P.runHeld=false;const k=KEYMAP[e.code]||KEYMAP[e.key];if(k)keys[k]=0});
onKey('keydown',e=>{if(QK_HOST.hidden)return;const t=((e.composedPath&&e.composedPath()[0])||e.target).tagName||'';if(/INPUT|SELECT|TEXTAREA/.test(t))return;if(e.key==='Shift')P.runHeld=true;if(e.code==='KeyR'&&!e.repeat&&!busy){setRun(!P.runToggle)}});
function setRun(on){trk('setting',{k:'course',v:on});P.runToggle=on;const b=ROOT.querySelector('.ab .run');if(b)b.setAttribute('aria-pressed',on);toast(on?'Course activée':'Marche')}
ROOT.querySelector('.ab .run').addEventListener('pointerdown',e=>{e.preventDefault();setRun(!P.runToggle)});
ROOT.querySelector('.ab .roll').addEventListener('pointerdown',e=>{e.preventDefault();startRoll()});
addEventListener('blur',()=>{clearKeys();P.runHeld=false});
ROOT.querySelectorAll('.dpad button').forEach(b=>{const k=b.dataset.k;
  b.addEventListener('pointerdown',e=>{e.preventDefault();if(busy&&!WM.open)return;keys[k]=1;b.classList.add('held');b.setPointerCapture(e.pointerId)});
  ['pointerup','pointercancel','lostpointercapture'].forEach(ev=>b.addEventListener(ev,()=>{keys[k]=0;b.classList.remove('held')}))});
ROOT.querySelector('.ab .a').addEventListener('pointerdown',e=>{e.preventDefault();if(WM.open)wmZoomCycle();else pressA()});
ROOT.querySelector('.ab .b').addEventListener('pointerdown',e=>{e.preventDefault();if(WM.open)closeMap();else openMenu()});
$('menuBtn').onclick=openMenu;[$('hudKwh'),$('kwhPill')].forEach(b=>b.onclick=e=>{e.currentTarget.blur();if(WM.open)closeMap();openMenu('energie')});$('startBtn').onclick=e=>{e.currentTarget.blur();if(WM.open){closeMap();return}openMenu()};$('backBtn').onclick=e=>{e.currentTarget.blur();if(WM.open)closeMap();if(busy&&!panelEl)return;if(panelEl)closePanel();$('qkBack').click()};
cv.addEventListener('click',()=>{if(!busy)pressA()});
