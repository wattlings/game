/* Wattlings · jeu/moteur/panneaux.js
   Panneaux et mini-jeux : les briques communes (information, choix, sélection multiple, formulaire, tri, signature). */

/* ================= PANNEAUX / MINI-JEUX ================= */
let panelEl=null;
function clearKeys(){for(const k in keys)keys[k]=0;ROOT.querySelectorAll('.dpad .held').forEach(b=>b.classList.remove('held'))}
/* sansCours : une fenêtre qui n'a pas d'étape du cours à revoir (avatar, choix du site) n'affiche pas « Cours de cette étape » */
function openPanel(title,{sansCours=false}={}){busy=true;clearKeys();const ov=document.createElement('div');ov.className='overlay';ov.innerHTML=`<div class="panel" role="dialog" aria-modal="true" aria-label="${esc(title)}"><header><span>${esc(title)}</span><span class="hdr-r"><button type="button" class="course-link" title="Ouvre la section du cours dans un autre onglet ; le jeu reste ouvert"><span class="lg">Cours de cette étape</span><span class="sm">Cours</span> ↗</button><span class="step"></span></span></header><div class="pbody"></div></div>`;$('layer').appendChild(ov);panelEl=ov;const cl=ov.querySelector('.course-link');if(sansCours)cl.remove();else cl.onclick=()=>goCourse();return ov}
function closePanel(){if(panelEl){panelEl.remove();panelEl=null}busy=false;clearKeys();hud()}
function runSteps(title,steps,done){
  const ov=openPanel(title),body=ov.querySelector('.pbody'),st=ov.querySelector('.step');let i=0;
  const render=()=>{st.textContent=steps.length>1?`${i+1} / ${steps.length}`:'';body.innerHTML='';ov.scrollTop=0;steps[i](body,next)};
  const next=()=>{i++;if(i>=steps.length){closePanel();save();if(done)done()}else render()};render();
}
function contBtn(el,next,label='Continuer'){const b=document.createElement('button');b.className='btn';b.textContent=label+' ▸';b.onclick=next;el.appendChild(b);b.focus();return b}
const info=(html,label)=>(el,next)=>{el.innerHTML=html;contBtn(el,next,label)};
const choice=({title,ctx,gas,q,opts,keep})=>(el,next)=>{
  let tries=0;
  el.innerHTML=(title?`<h3>${title}</h3>`:'')+(ctx?`<div class="ctx${gas?' gas':''}">${ctx}</div>`:'')+`<p><b>${q}</b></p><div class="opts"></div><div class="fbz"></div>`;
  const box=el.querySelector('.opts'),fbz=el.querySelector('.fbz');
  (keep?opts:shuffle(opts)).forEach(o=>{const b=document.createElement('button');b.className='opt';b.innerHTML=o[0];box.appendChild(b);
    b.onclick=()=>{if(o[1]){b.classList.add('good');box.querySelectorAll('.opt').forEach(x=>x.disabled=true);fbz.innerHTML=`<div class="fb ok">✔ ${o[2]||'Exact !'}</div>`;gainXP(tries?5:20);contBtn(fbz,next)}
      else{tries++;trk('wrong_answer',{t:panelTitle(),q:trkTxt(q).slice(0,100),a:trkTxt(o[0]).slice(0,80)});b.classList.add('badc');b.disabled=true;sfx('bad');fbz.innerHTML=`<div class="fb ko">✘ ${o[2]||'Pas tout à fait.'} Réessaie.</div>`}}});
};
const multi=({title,ctx,gas,q,items,okMsg})=>(el,next)=>{
  let tries=0;
  el.innerHTML=(title?`<h3>${title}</h3>`:'')+(ctx?`<div class="ctx${gas?' gas':''}">${ctx}</div>`:'')+`<p><b>${q}</b></p><div class="opts"></div><div class="fbz"></div>`;
  const box=el.querySelector('.opts'),fbz=el.querySelector('.fbz');const rows=[];
  items.forEach((it,i)=>{const l=document.createElement('label');l.className='chk';l.innerHTML=`<input type="checkbox" id="mc${i}_${Date.now()%1e5}"><span>${it[0]}<small></small></span>`;box.appendChild(l);rows.push(l)});
  const v=document.createElement('button');v.className='btn';v.textContent='Valider ▸';el.appendChild(v);
  v.onclick=()=>{let bad=0;rows.forEach((l,i)=>{const it=items[i],c=l.querySelector('input').checked,sm=l.querySelector('small');l.classList.remove('good','badc');sm.textContent='';
      const wrong=(it[1]===true&&!c)||(it[1]===false&&c);if(wrong){bad++;l.classList.add('badc');sm.textContent=it[2]||''}else if(c){l.classList.add('good');sm.textContent=it[2]||''}});
    if(bad){tries++;trk('wrong_answer',{t:panelTitle(),q:trkTxt(q).slice(0,100),a:trkTxt(rows.filter(l=>l.classList.contains('badc')).map(l=>l.textContent.split('\n')[0]).join(' | ')).slice(0,80)});sfx('bad');fbz.innerHTML=`<div class="fb ko">✘ ${bad} case${bad>1?'s':''} à revoir (en rouge).</div>`}
    else{v.remove();rows.forEach(l=>l.querySelector('input').disabled=true);fbz.innerHTML=`<div class="fb ok">✔ ${okMsg||'Parfait.'}</div>`;gainXP(tries?5:20);contBtn(fbz,next)}};
};
const form=({title,ctx,gas,fields,okMsg})=>(el,next)=>{
  let tries=0;
  el.innerHTML=(title?`<h3>${title}</h3>`:'')+(ctx?`<div class="ctx${gas?' gas':''}">${ctx}</div>`:'')+`<div class="ff"></div><div class="fbz"></div>`;
  const ff=el.querySelector('.ff'),fbz=el.querySelector('.fbz');const sels=[];const uid=Math.random().toString(36).slice(2,7);
  fields.forEach((f,i)=>{const d=document.createElement('div');d.className='field';const opts=shuffle(f.opts);d.innerHTML=`<label for="f${uid}${i}">${f.label}</label><select id="f${uid}${i}"><option value="">— choisir —</option>${opts.map((o,j)=>`<option value="${f.opts.indexOf(o)}">${esc(o[0])}</option>`).join('')}</select><small class="m"></small>`;ff.appendChild(d);sels.push(d)});
  const v=document.createElement('button');v.className='btn';v.textContent='Valider ▸';el.appendChild(v);
  v.onclick=()=>{let bad=0;sels.forEach((d,i)=>{const s=d.querySelector('select'),m=d.querySelector('.m'),o=fields[i].opts[s.value];s.style.borderColor='';m.textContent='';
      if(!o){bad++;s.style.borderColor='var(--bad)';m.textContent='Choisis une valeur.'}else if(!o[1]){bad++;s.style.borderColor='var(--bad)';m.textContent='✘ '+(o[2]||'Incorrect.')}else{s.style.borderColor='var(--ok)';m.textContent=o[2]?'✔ '+o[2]:'✔'}});
    if(bad){tries++;trk('wrong_answer',{t:panelTitle(),q:trkTxt(title||'Formulaire').slice(0,100),a:trkTxt(sels.filter(d=>d.querySelector('.m').textContent.startsWith('✘')).map(d=>d.querySelector('label').textContent).join(' | ')).slice(0,80)});sfx('bad');fbz.innerHTML=`<div class="fb ko">✘ ${bad} champ${bad>1?'s':''} à corriger.</div>`}
    else{v.remove();sels.forEach(d=>d.querySelector('select').disabled=true);fbz.innerHTML=`<div class="fb ok">✔ ${okMsg||'Formulaire valide.'}</div>`;gainXP(tries?5:20);contBtn(fbz,next)}};
};
const order=({title,ctx,q,items,okMsg})=>(el,next)=>{
  let tries=0,seq=[];
  el.innerHTML=(title?`<h3>${title}</h3>`:'')+(ctx?`<div class="ctx">${ctx}</div>`:'')+`<p><b>${q}</b></p><div class="seq" aria-live="polite"></div><div class="opts"></div><div class="fbz"></div>`;
  const sq=el.querySelector('.seq'),box=el.querySelector('.opts'),fbz=el.querySelector('.fbz');
  const draw=()=>{sq.innerHTML=seq.length?seq.map((s,i)=>`<span class="it">${i+1}. ${esc(s)}</span>`).join(''):'<span style="color:var(--muted)">Clique les étapes dans l\'ordre…</span>';
    box.innerHTML='';shuffledItems.filter(x=>!seq.includes(x)).forEach(x=>{const b=document.createElement('button');b.className='opt';b.textContent=x;b.onclick=()=>{seq.push(x);draw();if(seq.length===items.length)check()};box.appendChild(b)})};
  const shuffledItems=shuffle(items);
  const check=()=>{if(seq.every((s,i)=>s===items[i])){fbz.innerHTML=`<div class="fb ok">✔ ${okMsg||'Bon ordre !'}</div>`;gainXP(tries?5:20);contBtn(fbz,next)}
    else{tries++;trk('wrong_answer',{t:panelTitle(),q:trkTxt(q).slice(0,100),a:trkTxt(seq.join(' > ')).slice(0,80)});sfx('bad');fbz.innerHTML=`<div class="fb ko">✘ Ce n'est pas le bon ordre.</div>`;const r=document.createElement('button');r.className='btn alt';r.textContent='Recommencer';r.onclick=()=>{seq=[];fbz.innerHTML='';draw()};fbz.appendChild(r)}};
  draw();
};
const signature=(who,orgName)=>(el,next)=>{
  const d=new Date().toLocaleDateString('fr-FR');
  el.innerHTML=`<h3>Signature du mandat ${orgName}</h3><p>Le titulaire (${esc(who)}) signe le mandat qui t'autorise à récupérer ses données. Signe dans le cadre avec la souris ou le doigt.</p><canvas class="sig" width="600" height="140" aria-label="Zone de signature"></canvas><div class="row"><button class="btn alt" id="sigClr">Effacer</button><button class="btn" id="sigOk" disabled>Signer le mandat</button></div><div class="fbz"></div>`;
  const c=el.querySelector('canvas'),x=c.getContext('2d');let drawing=false,len=0,last=null;x.lineWidth=3;x.lineCap='round';x.strokeStyle='#1c2440';
  const pos=e=>{const r=c.getBoundingClientRect();return[(e.clientX-r.left)*c.width/r.width,(e.clientY-r.top)*c.height/r.height]};
  c.onpointerdown=e=>{drawing=true;last=pos(e);c.setPointerCapture(e.pointerId)};
  c.onpointermove=e=>{if(!drawing)return;const p=pos(e);x.beginPath();x.moveTo(...last);x.lineTo(...p);x.stroke();len+=Math.hypot(p[0]-last[0],p[1]-last[1]);last=p;if(len>120)el.querySelector('#sigOk').disabled=false};
  c.onpointerup=()=>drawing=false;
  el.querySelector('#sigClr').onclick=()=>{x.clearRect(0,0,c.width,c.height);len=0;el.querySelector('#sigOk').disabled=true};
  el.querySelector('#sigOk').onclick=e=>{e.target.remove();el.querySelector('#sigClr').remove();c.style.pointerEvents='none';
    el.querySelector('.fbz').innerHTML=`<div class="fb ok">✔ Mandat ${orgName} signé le ${d}. Le consentement est enregistré : il vaut pour ces points, ces données et jusqu'à la date de fin choisie.</div>`;gainXP(20);contBtn(el.querySelector('.fbz'),next)};
};
function meterCanvas(kind){
  const c=document.createElement('canvas');c.width=64;c.height=48;const x=c.getContext('2d');R(x,0,0,64,48,kind==='gas'?'#6b6f78':site().wall);
  if(kind==='gas'){R(x,14,6,36,32,'#e8d24a');R(x,17,9,30,14,'#f7f0dc');R(x,20,13,24,5,'#333');for(let i=0;i<5;i++)R(x,21+i*5,14,3,3,'#e8e4d6');R(x,18,26,28,3,'#c9b640');R(x,20,38,4,10,'#888');R(x,40,38,4,10,'#888');R(x,44,24,4,4,'#fff')}
  else{R(x,10,4,44,40,'#9aa0a8');R(x,12,6,40,36,'#c4c9cf');R(x,18,10,28,14,'#1c2440');R(x,20,13,24,8,'#2aa198');R(x,22,15,4,4,'#bff');R(x,16,28,12,6,'#fff');R(x,34,28,12,6,'#fff');R(x,16,36,30,3,'#7a8088')}
  c.style.width='min(260px,70%)';return c;
}
const withArt=(kind,stepFn)=>(el,next)=>{stepFn(el,next);const a=document.createElement('div');a.className='meter-art';a.appendChild(meterCanvas(kind));el.insertBefore(a,el.firstChild)};
