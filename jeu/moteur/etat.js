/* Wattlings · jeu/moteur/etat.js
   L'état de la partie (S), sa sauvegarde et quelques outils de base. */

/* ================= ÉTAT & SAUVEGARDE ================= */
const RANKS=['Gestionnaire de site','Energy Manager','Gestionnaire de patrimoine'];
const BADGES=['Cadrer','Collecter','Fiabiliser','Structurer','Analyser','Détecter','Agir','Piloter'];
const DEF=()=>({en:null,ch:0,site:null,xp:0,rank:0,map:'office',x:5,y:6,dir:'up',flags:{},notes:{},badges:[],dex:{},derives:{},pm:0,fiches:{},inside:null,name:'Alex',av:null,models:{},secrets:{},maxCh:0,sobriete:false,hades:false,hadesN:0,wololo:false,arena:{},v:4});
let S=DEF();
/* Une seule partie : celle du compte du joueur. Le navigateur la garde, commun/compte.js la recopie sur le compte.
   Sans compte (« Jouer » sur l'écran titre), la partie se joue mais rien n'est enregistré : INVITE. */
function readSave(){try{const r=localStorage.getItem(SAVE_KEY);return r?JSON.parse(r):null}catch(e){return null}}
let saveOK=true;
/* en mode essai (moteur/essai.js), rien n'est enregistré */
let ESSAI=false;
let INVITE=false;
/* faut-il se connecter (ou choisir de jouer sans compte) avant de jouer ? Sans comptes sur ce site, la partie reste dans le navigateur */
const needAuth=()=>!INVITE&&!ESSAI&&COMPTE.disponible&&!COMPTE.identifiant();
function save(){if(ESSAI||INVITE)return;S.savedAt=Date.now();try{localStorage.setItem(SAVE_KEY,JSON.stringify(S));saveOK=true}catch(e){saveOK=false}if(typeof savedFlash==='function')savedFlash()}
function loadSave(){return ESSAI||INVITE?null:readSave()}
const fmtDate=ts=>ts?new Date(ts).toLocaleString('fr-FR',{day:'2-digit',month:'2-digit',year:'numeric',hour:'2-digit',minute:'2-digit'}):'—';
function restartStory(){const k={expert:S.expert,name:S.name,av:S.av,models:S.models||{},secrets:S.secrets,fiches:S.fiches,dex:S.dex,badges:S.badges,xp:S.xp,rank:S.rank,sobriete:S.sobriete,maxCh:S.maxCh,flees:S.flees,hades:S.hades,hadesN:S.hadesN,voy:S.voy};S=Object.assign(DEF(),k);save()}
let lastFlash=0;function savedFlash(){const el=typeof ROOT!=='undefined'&&ROOT.getElementById&&ROOT.getElementById('hudSaved');if(!el)return;const n=Date.now();if(n-lastFlash<2500)return;lastFlash=n;if(!saveOK&&!savedFlash.warned){savedFlash.warned=1;toast('⚠ Sauvegarde impossible dans ce navigateur')}el.textContent=saveOK?'✓ Sauvegardé':'⚠ Sauvegarde impossible';el.classList.remove('on');void el.offsetWidth;el.classList.add('on')}
const $=id=>ROOT.getElementById(id);
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const fmt=n=>Number(n).toLocaleString('fr-FR');
const shuffle=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
const hash=(x,y)=>{let h=x*374761393+y*668265263;h=(h^(h>>13))*1274126177;return ((h^(h>>16))>>>0)/4294967295};
