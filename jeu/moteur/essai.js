/* Wattlings · jeu/moteur/essai.js
   Le mode essai : ouvrir le jeu directement à un endroit précis, pour le tester. Sert à la page de pilotage (pilotage/).
   En mode essai, RIEN n'est enregistré : ni la sauvegarde (save() ne fait rien), ni le suivi d'audience (trk() ne fait rien).
   La partie d'essai disparaît quand on recharge la page ; les vraies parties ne sont jamais touchées.

   Adresses comprises (jeu/#essai-…) :
     essai-chapitre-3            le début d'un chapitre
     essai-fiche-s2r1            la personne ou l'objet qui donne cette fiche savoir (réplique, question, fiche)
     essai-arene-2               l'entrée d'une arène, portes ouvertes
     essai-dresseur-2.1          le duel contre le 2e dresseur de l'arène 2 (les dresseurs sont numérotés à partir de 0)
     essai-champion-2            le champion de l'arène 2, dresseurs déjà battus
     essai-epreuve-2             l'épreuve du champion, sans le dialogue qui la précède
     essai-bilan-2               la carte « Dans un EMS » et l'auto-bilan qui suivent le badge
     essai-voyage-solaire        l'arrivée sur un site visité en train
     essai-info-solaire.module   une information de voyage (son carnet)
     essai-defi-solaire          le défi final d'un site, informations clés déjà réunies
     essai-sim-solSimCourbes     une manipulation d'un site (le nom de sa fonction dans simulations.js) */

function essaiLancer(quoi){
  const m=String(quoi).match(/^(chapitre|fiche|arene|dresseur|champion|epreuve|bilan|voyage|info|defi|sim)-([\w.]{1,40})$/);
  ESSAI=true;                                   // à partir d'ici : aucune sauvegarde, aucun suivi
  QK_HOST.hidden=false;qkTimeout(fitScreen,30);document.documentElement.classList.add('qk-lock');QK_HOST.scrollTop=0;
  ROOT.querySelectorAll('#layer > *').forEach(n=>n.remove());busy=false;dlg.q=[];dlg.cb=null;dlg.open=false;if(dlg.el){dlg.el.remove();dlg.el=null}
  S=Object.assign(DEF(),{name:'Essai',av:AVDEF('h')});
  if(!ROOT.querySelector('.essai-tag')){const t=document.createElement('div');t.className='essai-tag';t.textContent='Mode essai · rien n’est enregistré';$('wrap').appendChild(t)}
  if(!m){jumpTo(0,'ecole');toast('Essai inconnu : '+String(quoi).slice(0,40));return}
  const genre=m[1],arg=m[2],site='ecole';
  /* ce que jumpTo annonce (« Reprise : … ») est refermé, puis l'essai commence */
  const ensuite=fn=>qkTimeout(()=>{dlg.q=[];dlg.cb=null;if(dlg.open)nextLine();if(panelEl)closePanel();qkTimeout(()=>{try{fn()}catch(e){console.error(e);toast('Cet essai n’a pas pu démarrer.')}},120)},520);
  const arene=n=>{const A=ARENAS[n-1];if(!A)return null;jumpTo(ARENA_CH[A.id],site);FICHES.forEach(f=>{S.fiches[f.id]=1});return A};
  const dansArene=A=>{arenaInit(A);warp('arena'+A.id,7,10,'up')};
  const voyage=sid=>{const s=typeof VOY!=='undefined'&&VOY.sites[sid];if(!s||!s.ouvert)return null;jumpTo(11,site);return s};
  const surSite=(sid,s)=>{voyEtat().pass=1;voyEtat().faits[sid+'.arrivee']=1;warp(s.carte,s.arrivee[0],s.arrivee[1],s.arrivee[2]||'up')};
  if(genre==='chapitre'){jumpTo(Math.max(0,Math.min(11,+arg||0)),site);return}
  if(genre==='fiche'){const f=FICHES.find(x=>x.id===arg);if(!f){jumpTo(0,site);toast('Fiche inconnue.');return}
    jumpTo(typeof f.req==='number'?f.req:STEP_CH[f.st]||0,site);
    ensuite(()=>{FICHES.forEach(x=>{if(x.src===f.src)S.fiches[x.id]=1});delete S.fiches[f.id];srcAct(f.src)()});return}
  if(genre==='bilan'){const A=arene(+arg);if(!A){jumpTo(0,site);toast('Arène inconnue.');return}ensuite(()=>bilanArene(A,()=>toast('Bilan terminé.')));return}
  if(genre==='arene'||genre==='dresseur'||genre==='champion'||genre==='epreuve'){
    const [n,k]=arg.split('.').map(Number),A=arene(n);if(!A){jumpTo(0,site);toast('Arène inconnue.');return}
    ensuite(()=>{dansArene(A);
      if(genre==='dresseur'&&A.tr[k])qkTimeout(()=>duel(A,k),400);
      if(genre==='champion'||genre==='epreuve'){S.arena[A.id]=[1,1,1];qkTimeout(()=>genre==='champion'?champTalk(A):champTrial(A),400)}});return}
  if(genre==='voyage'||genre==='info'||genre==='defi'){
    const [sid,id]=arg.split('.'),s=voyage(sid);if(!s){jumpTo(11,site);toast('Destination inconnue.');return}
    ensuite(()=>{surSite(sid,s);
      if(genre==='info'&&s.infos.some(f=>f.id===id))qkTimeout(()=>voyDonnerInfo(sid,id),500);
      if(genre==='defi'){s.infos.forEach(f=>{if(f.cle)voyEtat().infos[sid+'.'+f.id]=1});voyRafraichir();
        qkTimeout(()=>{for(const c of s.cartes||[s.carte]){const sm=S.map;S.map=c;const o=objsFor(c).find(o=>o.chef);S.map=sm;if(o){if(c!==S.map)warp(c,(MAPS[c].depart||[1,1])[0],(MAPS[c].depart||[1,1])[1],'up');o.act();return}}toast('Pas de défi sur ce site.')},500)}});return}
  if(genre==='sim'){const fn=/^[a-z]{3}Sim[A-Z]\w*$/.test(arg)&&typeof window[arg]==='function'?window[arg]:null;jumpTo(11,site);
    if(!fn){toast('Manipulation inconnue.');return}
    ensuite(()=>{voyEtat().pass=1;fn(()=>toast('Manipulation terminée.'))});return}
}
