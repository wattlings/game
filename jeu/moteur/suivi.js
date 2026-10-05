/* Wattlings · jeu/moteur/suivi.js
   Suivi d'audience côté jeu : événements de chapitres. Le moteur de suivi lui-même est dans commun/suivi.js. */

function trk(name,props){try{TRK.track(name,props)}catch(e){}}
/* suivi des chapitres du jeu : appelé à chaque mise à jour du bandeau */
const TCH={last:null,t0:0,via:null};
function trkChapter(){if(typeof S==='undefined'||!S.site||S.ch===TCH.last)return;
  const now=Date.now();if(TCH.last!==null&&TCH.via!=='jump'&&S.ch>TCH.last)trk('chapter_end',{ch:TCH.last,site:S.site,s:Math.round((now-TCH.t0)/1000),kwh:typeof enTotal==='function'?Math.round(enTotal()):0});
  trk('chapter_start',{ch:S.ch,site:S.site,via:TCH.via||(TCH.last===null?'reprise':'jeu')});TCH.last=S.ch;TCH.t0=now;TCH.via=null}
const trkTxt=h=>String(h||'').replace(/<[^>]+>/g,'').replace(/\s+/g,' ').trim();
const panelTitle=()=>{try{return trkTxt(panelEl&&panelEl.querySelector('header span').textContent)}catch(e){return ''}};
