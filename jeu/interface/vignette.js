/* Wattlings · jeu/interface/vignette.js
   Vignette flottante : le jeu sort de l'onglet dans une petite fenêtre. */

/* ---- vignette flottante : le jeu sort de l'onglet dans une petite fenêtre toujours au-dessus (Document Picture-in-Picture,
   Chrome et Edge sur ordinateur). Ailleurs : une petite fenêtre séparée qui reprend la même sauvegarde. ---- */
const PIPB=$('qkPip'),POPUP=PIP.isPop;
const pipOK=()=>'documentPictureInPicture' in window;
function setPipUI(on){const q=$('pipBtn');q.setAttribute('aria-pressed',on);q.textContent=on?'↩ Onglet':'⧉ Vignette';q.title=on?'Remettre le jeu dans l’onglet':'Détacher le jeu dans une petite fenêtre flottante';PIPB.setAttribute('aria-pressed',on);PIPB.innerHTML=on?'↩ Remettre dans l’onglet':'⧉<span class="lg"> Vignette</span>';PIPB.title=on?'Remettre le jeu dans l’onglet':'Détacher le jeu dans une petite fenêtre flottante';const a=document.getElementById('qk-ailleurs');if(a)a.hidden=!on}
function pipAttach(w){
  const d=w.document;let ff='';
  // polices : celles déclarées dans un fichier sont reliées par ce fichier (leurs adresses sont relatives à lui), les autres sont recopiées
  for(const sh of document.styleSheets){try{const pol=[...sh.cssRules].filter(r=>r.type===5);if(pol.length&&sh.href)throw 0;pol.forEach(r=>ff+=r.cssText)}catch(e){if(sh.href){const l=d.createElement('link');l.rel='stylesheet';l.href=sh.href;d.head.appendChild(l)}}}
  const st=d.createElement('style');st.textContent=ff+'html,body{margin:0;height:100%;background:#131a2b;overflow:hidden}#qk-host{position:fixed;inset:0;overflow:hidden}';d.head.appendChild(st);
  d.title='Wattlings';d.documentElement.lang='fr';
  PIP.home=QK_HOST.parentNode;PIP.next=QK_HOST.nextSibling;
  d.body.appendChild(QK_HOST);
  PIP.win=w;QK_APP.classList.add('pip');document.documentElement.classList.remove('qk-lock');clearKeys();
  qkSwitch(w);
  const fk=e=>{const t=((e.composedPath&&e.composedPath()[0])||e.target).tagName||'';if(/INPUT|SELECT|TEXTAREA/.test(t))return;
    const ev=new KeyboardEvent(e.type,{key:e.key,code:e.code,shiftKey:e.shiftKey,ctrlKey:e.ctrlKey,metaKey:e.metaKey,altKey:e.altKey,repeat:e.repeat,cancelable:true});
    PIP.fwd=true;let ok=true;try{ok=window.dispatchEvent(ev)}finally{PIP.fwd=false}if(!ok)e.preventDefault()};
  w.addEventListener('keydown',fk);w.addEventListener('keyup',fk);
  w.addEventListener('blur',()=>{clearKeys();P.runHeld=false});
  w.addEventListener('resize',()=>window.dispatchEvent(new Event('resize')));
  w.addEventListener('pointerdown',()=>window.dispatchEvent(new Event('pointerdown')),{passive:true});
  w.addEventListener('pagehide',pipDetach,{once:true});
  setPipUI(true);fitScreen();qkTimeout(fitScreen,80);qkTimeout(fitScreen,400);
}
function pipDetach(){
  if(!PIP.win)return;PIP.win=null;
  const home=PIP.home||document.body;home.insertBefore(QK_HOST,PIP.next&&PIP.next.parentNode===home?PIP.next:null);
  QK_APP.classList.remove('pip');qkSwitch(window);clearKeys();
  if(!QK_HOST.hidden)document.documentElement.classList.add('qk-lock');
  setPipUI(false);fitScreen();qkTimeout(fitScreen,80);
}
async function pipToggle(){
  if(PIP.win){const w=PIP.win;pipDetach();try{w.close()}catch(e){}return}
  if(QK_APP.classList.contains('fs'))exitFs();
  trk('setting',{k:'vignette',v:true});
  if(pipOK()){try{const w=await documentPictureInPicture.requestWindow({width:480,height:470});pipAttach(w);return}catch(e){}}
  // repli : petite fenêtre séparée (pas « toujours au-dessus »), qui reprend la sauvegarde en cours ; cet onglet retourne au cours
  qkSaveNow();let w=null;try{w=window.open(location.href.split('#')[0]+'#vignette','wattlings-vignette','popup,width=480,height=540')}catch(e){}
  if(!w){toast('Vignette indisponible ici : ouvre le site dans Chrome ou Edge, sur ordinateur.');return}
  leaveGame(courseHash());
}
PIPB.onclick=pipToggle;
if(!pipOK()&&matchMedia('(pointer:coarse)').matches)PIPB.hidden=true;
$('pipBtn').hidden=PIPB.hidden||PIP.isPop;$('pipBtn').onclick=e=>{e.currentTarget.blur();pipToggle()};
/* depuis la petite fenêtre séparée, le cours s'affiche dans l'onglet d'origine */
{const _go=goCourse;goCourse=function(h){
  if(POPUP&&window.opener&&!window.opener.closed){const t=h||courseHash();try{window.opener.location.href=LIENS.adresseCours(t);window.opener.focus();trk('game_to_course',{target:t,ch:S.ch});return}catch(e){}}
  return _go(h)}}
/* dans la vignette, « ← Cours » ne ferme pas le jeu : le cours s'ouvre à côté */
{const _leave=leaveGame;leaveGame=function(h){if(PIP.win||POPUP)return goCourse(h);return _leave(h)}}
{const _open=openGame;openGame=function(ch){
  _open(ch);
  if(PIP.win){document.documentElement.classList.remove('qk-lock');try{PIP.win.focus()}catch(e){}}}}
if(POPUP){QK_APP.classList.add('pop');document.title='Wattlings'}
/* dans l'onglet resté ouvert pendant que le jeu est dans la vignette */
{const c=document.getElementById('qkAilleursCours'),r=document.getElementById('qkAilleursRetour');if(c)c.onclick=()=>goCourse();if(r)r.onclick=()=>pipToggle()}
/* version « fichier unique » : pas de vignette (le jeu y est déjà dans un cadre) */
if(window.WATTLINGS_EMBARQUE){PIPB.hidden=true;$('pipBtn').hidden=true}
