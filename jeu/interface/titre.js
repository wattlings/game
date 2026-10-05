/* Wattlings · jeu/interface/titre.js
   L'écran titre et les 3 emplacements de sauvegarde. */

function titleScreen(){
  busy=true;EN_ON=false;
  const ov=document.createElement('div');ov.className='title-screen';
  const card=n=>{const v=readSlot(n);
    if(v&&v.site)return `<div class="slot${n===SLOT?' cur':''}" data-n="${n}"><div class="slot-h"><canvas width="20" height="20" data-av="${n}"></canvas><div><b>${esc(v.name||'Alex')}</b><small>Emplacement ${n} · ${RANKS[v.rank||0]} · Nv ${Math.floor((v.xp||0)/90)+1}${v.hades?' · Hadès':''}</small></div></div>
      <small>${esc(SITES[v.site]?SITES[v.site].name:'')} · ${esc(CHAPTERS[v.ch]||'')}</small>
      <span class="stats">${(v.badges||[]).length}/8 badges · ${Object.keys(v.secrets||{}).length}/${NSEC} secrets · ${Object.keys(v.fiches||{}).length}/${FICHES.length} fiches</span>
      <small>Sauvegardé le ${fmtDate(v.savedAt)}</small>
      <div class="acts"><button class="btn" data-a="cont">Continuer</button><button class="btn alt" data-a="chap">Choisir une étape</button><button class="btn alt" data-a="restart">Recommencer l'histoire</button><button class="btn danger" data-a="erase">Effacer</button></div></div>`;
    return `<div class="slot empty" data-n="${n}"><b>Emplacement ${n}</b><small>Vide</small><label for="pn${n}" class="sr-only" style="font-size:12.5px;color:#b7bdd6">Ton prénom</label><input id="pn${n}" maxlength="14" value="" placeholder="Ton prénom"><label class="hades"><input type="checkbox" data-hades> Mode Hadès <small>les personnages se font prier : il faut tout leur demander deux fois</small></label><div class="acts"><button class="btn" data-a="new">Nouvelle partie</button><button class="btn alt" data-a="newchap">Commencer à une étape</button></div></div>`};
  ov.innerHTML=`<div class="title-box"><button type="button" class="title-back" id="tBack">← Retour au cours</button><div class="logo">Wattlings<small>Energy management par la donnée</small></div>
  <p>Tu es gestionnaire de site et tu ne connais rien à l'énergie. Explore la ville, réunis les informations, puis remporte les 8 arènes et leurs badges… pour devenir gestionnaire de patrimoine.</p>
  <div class="slots">${[1,2,3].map(card).join('')}</div>
  <p style="font-size:13px">Sauvegarde automatique dans ce navigateur, 3 emplacements. Le son est coupé par défaut : active-le dans le menu → Options.</p></div>`;
  $('layer').appendChild(ov);updateMusic();
  ov.querySelector('#tBack').onclick=()=>$('qkBack').click();if(PIP.isPop)ov.querySelector('#tBack').hidden=true;
  ov.querySelectorAll('canvas[data-av]').forEach(c=>{const v=readSlot(+c.dataset.av);drawChar(c.getContext('2d'),2,3,'down',0,avPal(v.rank||0,v.av||AVDEF('h')))});
  const leave=()=>{ov.remove();busy=false};
  const pick=()=>{const o2=openPanel('Choisir une étape'),b=o2.querySelector('.pbody'),inner=document.createElement('div');b.appendChild(inner);
    chapterList(inner,(ch,sid)=>{closePanel();jumpTo(ch,sid)});
    const cc=document.createElement('button');cc.className='btn alt';cc.textContent='Retour';cc.onclick=()=>{closePanel();titleScreen()};b.appendChild(cc)};
  ov.querySelectorAll('.slot').forEach(el=>{const n=+el.dataset.n;
    el.querySelectorAll('[data-a]').forEach(btn=>btn.onclick=()=>{const a=btn.dataset.a;
      if(a==='new'||a==='newchap'){const hd=!!el.querySelector('[data-hades]').checked;trk('game_new',{slot:n,etape:a==='newchap',hades:hd});const nm=(el.querySelector('input').value||'Alex').trim().slice(0,14)||'Alex';setSlot(n);S=DEF();S.name=nm;S.hades=hd;save();leave();a==='new'?openAvatar(()=>boot()):openAvatar(pick);return}
      if(a==='erase'){if(btn.dataset.ok){trk('slot_erase',{slot:n});try{localStorage.removeItem(SLOT_KEY(n))}catch(e){}ov.remove();titleScreen()}else{btn.dataset.ok=1;btn.textContent='Confirmer : tout effacer'}return}
      setSlot(n);S=Object.assign(DEF(),readSlot(n));
      if(a==='cont'){trk('game_continue',{slot:n,ch:S.ch});leave();if(!S.av)openAvatar(()=>boot());else boot()}
      if(a==='chap'){leave();pick()}
      if(a==='restart'){if(btn.dataset.ok){trk('game_restart',{slot:n});restartStory();leave();boot()}else{btn.dataset.ok=1;btn.textContent='Confirmer (collection gardée)'}}
    })});
  const f=ov.querySelector('.slot.cur [data-a=cont]')||ov.querySelector('[data-a=cont]')||ov.querySelector('.slot input');if(f)f.focus();
}
