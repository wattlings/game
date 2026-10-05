/* Wattlings · jeu/interface/tableau-patrimoine.js
   Le tableau de bord du patrimoine dans le jeu (les graphiques viennent de commun/graphiques/). */

/* ---------- tableau de bord du jeu ---------- */
const DSH={tab:'pareto',ind:'mwh',act:'ens',bm:'ecart'};
function renderDash(view){
  const t=DSH.tab;let h='';
  if(t==='inv')h=`<p class="dnote">20 sites, électricité et gaz, année 2025. Surfaces de plancher ; pour la piscine, on retient aussi la surface de bassin.</p>`+invHTML();
  if(t==='pareto'||t==='act')h=`<div class="seg" role="group" aria-label="Indicateur">${Object.keys(IND).map(k=>`<button type="button" data-ind="${k}" class="${DSH.ind===k?'on':''}">${IND[k].lab} (${IND[k].u})</button>`).join('')}</div>`+paretoHTML(DSH.ind,GC,{act:t==='act'});
  if(t==='bench'){h=`<div class="seg" role="group" aria-label="Vue">${[['ecart','Écart à la référence'],['act','Par activité'],['gis','Gisements']].map(([k,l])=>`<button type="button" data-bm="${k}" class="${DSH.bm===k?'on':''}">${l}</button>`).join('')}</div>`;
    if(DSH.bm==='act')h+=`<div class="seg">${Object.keys(ACT).map(a=>`<button type="button" data-act="${a}" class="${DSH.act===a?'on':''}">${ACT[a].lab}</button>`).join('')}</div>`+benchHTML(DSH.act,GC);
    else if(DSH.bm==='gis')h+=gisHTML(GC);else h+=ecartHTML(GC);
    h+=`<p class="dnote">Références nationales : ordres de grandeur par activité (enquête ADEME « Énergie et patrimoine communal », EHPAD : ordre de grandeur publié), corrigés du climat. À actualiser avec les données OPERAT.</p>`}
  view.innerHTML=h;
  view.querySelectorAll('[data-ind]').forEach(b=>b.onclick=()=>{DSH.ind=b.dataset.ind;sfx('select');renderDash(view)});
  view.querySelectorAll('[data-bm]').forEach(b=>b.onclick=()=>{DSH.bm=b.dataset.bm;sfx('select');renderDash(view)});
  view.querySelectorAll('[data-act]').forEach(b=>b.onclick=()=>{DSH.act=b.dataset.act;sfx('select');renderDash(view)});
  const pc=view.querySelector('.pc');if(pc)tipify(pc);
  const tabs=view.closest('.panel').querySelectorAll('.dtabs button');tabs.forEach(b=>b.classList.toggle('on',b.dataset.tab===t));
}
