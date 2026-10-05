/* Wattlings · jeu/interface/tableau-de-bord.js
   Le tableau de bord Énergie du jeu : courbes, actions, parc de 20 sites. */

/* ================= TABLEAU DE BORD ================= */
const EN_CH={N:56,W:560,R:92,get:null},EN_V={v:'',i:-1};
/* 8 semaines de consommation : référence (sans action, même météo) et réel. get(g) donne la journée : {D,T,o,ref,s}. */
function enChart(get,opt){
  opt=opt||{};const e=EN(),g1=Math.floor(e.day),W=Math.max(300,Math.min(560,((typeof QK_HOST!=='undefined'&&QK_HOST.clientWidth)||620)-64)),N=W<430?35:56,H=170,L=opt.big?54:44,R=W<430?70:92,T=10,B=24,pts=[];let mx=0;Object.assign(EN_CH,{N,W,R,L,get,why:opt.why});
  for(let g=g1-N+1;g<=g1;g++){const d=get(g);pts.push({g,d,ref:d.ref,act:d.ref-d.s});mx=Math.max(mx,d.ref)}
  const ny=Math.pow(10,Math.floor(Math.log10(mx||1))),top=Math.ceil(mx/(ny/2))*(ny/2)||1,X=i=>L+i*(W-L-R)/(N-1),Y=v=>T+(H-T-B)*(1-v/top),has=pts.some(p=>p.d.s>0);
  const path=k=>pts.map((p,i)=>(i?'L':'M')+X(i).toFixed(1)+' '+Y(p[k]).toFixed(1)).join(' ');
  let grid='';for(let i=0;i<=2;i++){const v=top*i/2;grid+=`<line x1="${L}" x2="${W-R}" y1="${Y(v)}" y2="${Y(v)}" class="g"/><text x="${L-6}" y="${Y(v)+4}" text-anchor="end" class="ax">${fmt(Math.round(v))}</text>`}
  let xs='';pts.forEach((p,i)=>{if(p.d.D.wd===1&&i%14<7&&i<N-3)xs+=`<text x="${X(i)}" y="${H-6}" text-anchor="middle" class="ax">${p.d.D.d} ${EN_MS[p.d.D.m]}</text>`});
  let vac='';pts.forEach((p,i)=>{if(p.d.o===0)vac+=`<rect x="${X(i)-(W-L-R)/(N-1)/2}" y="${T}" width="${(W-L-R)/(N-1)}" height="${H-T-B}" class="off"/>`});
  const last=pts[N-1],ly1=Y(last.ref),ly2=Y(last.act),gap=Math.abs(ly1-ly2)<13;
  return `<div class="en-chart" id="enChart"><div class="en-leg"><span class="en-u">kWh par jour</span><span><i class="l1"></i>Référence : sans action, même météo</span>${has?'<span><i class="l2"></i>Consommation réelle</span>':''}${opt.noOff?'':'<span><i class="l0"></i>Site fermé</span>'}</div>
   <svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Consommation sur ${N===56?'huit':'cinq'} semaines, en kWh par jour">${vac}${grid}${xs}<path d="${path('ref')}" class="s1"/>${has?`<path d="${path('act')}" class="s2"/>`:''}
   <text x="${W-R+6}" y="${(gap&&has?ly1-7:ly1)+4}" class="lb">${has?'Référence':fmt(Math.round(last.ref))+' kWh'}</text>${has?`<text x="${W-R+6}" y="${(gap?ly2+7:ly2)+4}" class="lb">Réel</text>`:''}
   <line id="enX" y1="${T}" y2="${H-B}" class="cx" hidden/></svg><div class="en-tip" id="enTip" hidden></div></div>`;
}
function enWhy(d,sid){
  const s=enSite(sid||S.site),v=enVac(d.D),bits=[];
  bits.push(d.o===0?(v&&s.a==='ens'?`vacances ${v} : l'école tourne sur son talon`:`${s.short} ${s.pl?'sont fermés':s.fem?'est fermée':'est fermé'} : il ne reste que le talon`):d.o<1?'activité réduite':s.a==='ens'?'jour de classe':s.a==='ehpad'?'occupée jour et nuit':'jour d\'activité');
  if(enHdd(d.T)>9)bits.push('il fait froid : le chauffage pèse lourd');else if(enHdd(d.T)>0)bits.push('le chauffage tourne');else if(d.eC>d.eT*.15)bits.push(s.p.clim?'il fait chaud : la climatisation tourne':'il fait chaud : le froid alimentaire force');else bits.push('pas de chauffage');
  return cap(bits.join(', '))+'.';
}
const enWhyPk=d=>{const v=enVac(d.D),we=d.D.wd===0||d.D.wd===6;return cap((v?`vacances ${v} : les écoles sont au talon`:we?'week-end : écoles et bureaux fermés':'jour de semaine')+', '+(enHdd(d.T)>9?'il fait froid : le chauffage pèse lourd':enHdd(d.T)>0?'le chauffage tourne':d.T>23?'il fait chaud : les climatisations tournent':'pas de chauffage'))+'.'};
const enEvHtml=()=>{const e=EN(),ev=e.ev.cur;if(!ev)return '';const E=EN_EV.find(q=>q.id===ev.id),x=enCtx(ev.day,ev.sid);
  return `<div class="en-ev" id="enEv"><b>Alerte · ${esc(E.t(x))}${e.pk.on?' · '+esc(x.s.n):''}</b><p>${esc(E.q(x))}</p><div class="opts">${E.o(x).map((o,i)=>`<button class="opt" data-i="${i}">${esc(o[0])}</button>`).join('')}</div><small>En jeu : ${fmtKwh(ev.kwh)}, une seule fois. L'alerte expire dans ${Math.max(1,ev.exp-Math.floor(e.day))} jours.</small></div>`};
/* liste d'actions d'un site : état, gain annuel, coût, bouton */
function enActsHtml(sid,acts,by,list,can){
  const f=enFonds();return `<div class="en-acts">`+list.map(a=>{const g=enGain(a.id,sid),on=acts[a.id]!==undefined,c=enCost(a,sid),ok=can&&!on&&f>=c;
    return `<div class="en-act${on?' on':''}"><div><span class="tag">${a.cat}</span> <b>${esc(a.t)}</b><small>${a.zero?'0 kWh · '+fmt(g.eur)+' € par an':a.prod?fmtKwh(g.prod)+' produits par an (0 kWh économisé)':fmtKwh(g.kwh)+' par an'}${on&&by&&by[a.id]?' · déjà '+fmtKwh(by[a.id]):''} · ${c?fmt(c)+' €':'gratuit'}</small><small>${esc(a.why)}</small></div>
      ${on?'<span class="en-st ok">✔ en place</span>':can?`<button class="btn alt" data-buy="${sid}|${a.id}"${ok?'':' disabled'}>${ok?'Lancer':'Fonds insuffisant'}</button>`:'<span class="en-st">identifié</span>'}</div>`}).join('')+'</div>';
}
function enTab(){
  if(!S.site)return '<h3>Énergie</h3><p>Choisis d\'abord ton site auprès de Mme Joule.</p>';
  enSync();const e=EN();if(!e.pk.on)return enViewSite();
  if(!EN_V.v)EN_V.v='parc';
  const nav=`<div class="seg" role="group" aria-label="Vue">${[['parc','Le parc · 20 sites'],['site','Mon site']].map(([k,l])=>`<button type="button" data-env="${k}" class="${(EN_V.v==='psite'?'parc':EN_V.v)===k?'on':''}">${l}</button>`).join('')}</div>`;
  return nav+(EN_V.v==='site'?enViewSite():EN_V.v==='psite'?enViewPsite(EN_V.i):enViewParc());
}
function enViewSite(){
  const e=EN(),s=site(),d=enToday(),tot=e.rec+d.s*(e.day-Math.floor(e.day))+(e.pk.on?0:e.one),rate=enRate(),idn=enIdent(),f=enFonds(),data=S.ch>=4,done=Object.keys(e.acts).length>0;
  let h=`<h3>Énergie · ${esc(s.name)}</h3><div class="en-hero${tot<1?' zero':''}"><div class="en-big"><b>${fmtKwh(tot)}</b><span>économisés ${e.pk.on?'sur ce site':'depuis le début'}${done?(e.proved?' · <i class="ok">prouvés</i>':' · <i>estimés, à prouver</i>'):''}</span></div>
    <div class="en-kpi"><div><b>${fmtKwh(rate)}</b><span>par an, en continu</span></div>${e.pk.on?'':`<div><b>${fmtKwh(e.one)}</b><span>ponctuels</span></div>`}<div><b>${fmtKwh(idn)}</b><span>par an identifiés, pas encore réalisés</span></div><div><b>${fmt(f)} €</b><span>fonds de travaux</span></div></div></div>`;
  if(!done)h+=`<p class="dnote">${S.ch<7?'Le compteur est à zéro, et c\'est normal : cadrer, collecter, fiabiliser et structurer n\'économisent aucun kWh. Ces étapes rendent les économies possibles.':S.ch<9?'Toujours zéro : un gisement identifié n\'est pas une économie. Le compteur démarrera à l\'étape Agir.':''}</p>`;
  if(!e.pk.on)h+=enEvHtml();
  h+=`<h4 class="segh">Aujourd'hui · ${esc(enLabel(e.day))}</h4>`;
  if(data){h+=`<p class="en-today"><b>${fmtKwh(d.ref-d.s)}</b> consommés aujourd'hui${d.s>0?` au lieu de ${fmtKwh(d.ref)} sans action (−${fmtKwh(d.s)})`:''}. Température moyenne : ${Math.round(d.T)} °C. ${esc(enWhy(d))}</p>${enChart(g=>enDay(S.site,g,e.acts),{why:q=>enWhy(q)})}
    <p class="dnote">La consommation monte et descend avec la météo et le calendrier. Les économies, elles, se comptent à météo comparable : l'écart entre les deux courbes, le même jour.</p>`}
  else h+=`<p class="dnote">Pas encore de données de consommation : elles arriveront à l'étape Collecter. Sans données, impossible de dire ce que ${S.site==='bureau'?'consomment':'consomme'} ${esc(s.short)} aujourd'hui.</p>`;
  const vis=enActs(S.site).filter(a=>e.ident[a.id]||e.acts[a.id]!==undefined||S.ch>=9);
  if(vis.length){h+=`<h4 class="segh">${S.ch>=9?'Plan d\'action':'Gisement identifié'}</h4>`+enActsHtml(S.site,e.acts,e.by,vis,S.ch>=9);
    if(S.ch>=9)h+=`<p class="dnote">Fonds de travaux : ${fmt(f)} €. Il reçoit chaque euro économisé (${fmt(Math.round(e.earn))} € à ce jour) et finance les actions suivantes. Les économies continues le remplissent sans s'arrêter.</p>`}
  h+=`<h4 class="segh">Ce que chaque étape a économisé</h4><div class="tbl"><table>`+ARENAS.map(A=>{const got=S.badges.includes(A.badge),i=A.id;
    return `<tr><th>${A.badge}</th><td>${!got?'<i>à venir</i>':i<=4?'0 kWh':i<=6?'0 kWh · gisement identifié':i===7?fmtKwh(rate)+' par an lancés':'économies prouvées'}</td></tr>`}).join('')+`</table></div>`;
  if(!e.pk.on&&e.ev.ok+e.ev.ko+e.ev.miss)h+=`<p class="dnote">Alertes : ${e.ev.ok} bien traitées, ${e.ev.ko} mal traitées, ${e.ev.miss} ignorées.</p>`;
  if(data){let rows='';const g1=Math.floor(e.day);for(let g=g1;g>g1-14;g--){const q=enDay(S.site,g,e.acts);rows+=`<tr><td>${enShort(g)}</td><td class="num">${Math.round(q.T)} °C</td><td class="num">${fmt(Math.round(q.ref))}</td><td class="num">${fmt(Math.round(q.ref-q.s))}</td><td class="num">${fmt(Math.round(q.s))}</td></tr>`}
    h+=`<details class="en-tblv"><summary>Voir les 14 derniers jours en tableau</summary><div class="tbl"><table><tr><th>Jour</th><th>Temp.</th><th>Référence (kWh)</th><th>Réel (kWh)</th><th>Économie (kWh)</th></tr>${rows}</table></div></details>`}
  return h+'<p class="dnote"><i>Chiffres fictifs, d\'ordre de grandeur réaliste. Une minute de jeu vaut une semaine.</i></p>';
}
/* ---- le parc : 20 sites, un seul fonds, un seul compteur ---- */
const enPkActs=i=>{const e=EN();return i===enOwn()?e.acts:(e.pk.s[i]&&e.pk.s[i].mon!==undefined?e.pk.s[i].acts:null)};      // null : site non suivi
const enPkGet=g=>{const o=enOwn();let ref=0,s=0;for(let i=0;i<20;i++){const a=enPkActs(i),d=enDay(i===o?S.site:'p'+i,g,a||{});ref+=d.ref;s+=d.s}return {D:enDate(g),T:enTm(g),ref,s}};
function enViewParc(){
  const e=EN(),o=enOwn(),tot=enTotal(),rate=enRatePk()+enRate(),f=enFonds(),pct=enPct(),nmon=enMon().length+(o>=0?1:0),d=enPkGet(Math.floor(e.day)),nx=e.pk.tier<3&&EN_ENV[e.pk.tier+1]?e.pk.tier+1:0;
  let h=`<h3>Énergie · le parc d'Ampère-sur-Loire</h3><div class="en-hero"><div class="en-big"><b>${fmtKwh(tot)}</b><span>économisés depuis le début, tous sites confondus</span></div>
    <div class="en-kpi"><div><b>${fmtMwh(rate)}</b><span>par an, en continu</span></div><div><b>${fmtKwh(e.one)}</b><span>ponctuels</span></div><div><b>${nmon} / 20</b><span>sites suivis</span></div><div><b>${fmt(f)} €</b><span>fonds de travaux</span></div></div></div>
    <div class="en-goal"><div class="en-bar" role="img" aria-label="Avancement vers l'objectif de moins 40 %"><i style="width:${Math.min(100,pct/.5*100).toFixed(1)}%"></i><em style="left:80%"></em></div><p><b>−${(pct*100).toFixed(1).replace('.',',')} %</b> sur la consommation annuelle du parc, à météo comparable. Objectif du décret tertiaire pour 2030 : <b>−40 %</b>.${pct>=.4?' <b class="ok">Objectif atteint.</b>':nx?` Prochain palier : −${nx*10} %, et ${fmt(EN_ENV[nx])} € de travaux votés par le conseil municipal.`:''}</p></div>`;
  h+=enEvHtml();
  h+=`<h4 class="segh">Aujourd'hui · ${esc(enLabel(e.day))}</h4><p class="en-today"><b>${fmtKwh(d.ref-d.s)}</b> consommés aujourd'hui sur le parc${d.s>0?` au lieu de ${fmtKwh(d.ref)} sans action (−${fmtKwh(d.s)})`:''}. Température moyenne : ${Math.round(d.T)} °C. ${esc(enWhyPk(d))}</p>${enChart(enPkGet,{noOff:1,big:1,why:enWhyPk})}`;
  h+=`<h4 class="segh">Les 20 sites, du plus gros au plus petit</h4><p class="dnote">Un site non suivi ne donne ni alerte ni gisement : on ne peut pas y agir. Le mettre sous suivi coûte un peu et n'économise aucun kWh. C'est pourtant par là que tout commence. Le Pareto dit par où commencer.</p><div class="en-acts">`;
  const rows=[];for(let i=0;i<20;i++){const sid=i===o?S.site:'p'+i,a=enPkActs(i),y0=enYear(sid,[]);rows.push({i,sid,a,ref:y0.ref,sav:a?enYear(sid,Object.keys(a).sort()).kwh:0})}
  rows.sort((x,y)=>y.ref-x.ref).forEach((r,k)=>{const s=enSite(r.sid),n=r.a?Object.keys(r.a).length:0,idn=r.a?enIdent(r.i===o?undefined:r.sid):0;
    h+=`<div class="en-act${r.a?' on':''}"><div><b>${k+1}. ${esc(PSITES[r.i].n)}</b> <span class="tag">${esc(ACT[PSITES[r.i].a].lab)}</span>${r.i===o?' <span class="tag">ton site</span>':''}<small>${fmtMwh(r.ref)} par an · ${r.a?`suivi · ${n} action${n>1?'s':''} · −${fmtMwh(r.sav)} par an${idn>0?' · encore '+fmtMwh(idn)+' identifiés':''}`:'non suivi : ni alerte, ni gisement'}</small></div>
      <button class="btn alt" ${r.i===o?'data-env="site"':`data-open="${r.i}"`}>${r.a?'Ouvrir':'Suivre…'}</button></div>`});
  h+='</div>';
  h+=`<h4 class="segh">D'où vient le fonds de travaux</h4><div class="tbl"><table><tr><th>Euros économisés sur les factures</th><td class="num">${fmt(Math.round(e.earn))} €</td></tr><tr><th>Aides aux travaux (CEE, Fonds vert) : 2 € pour 1 € économisé</th><td class="num">${fmt(Math.round(e.aid||0))} €</td></tr><tr><th>Mise de départ, prime et enveloppes du conseil municipal</th><td class="num">${fmt(Math.round(e.seed))} €</td></tr><tr><th>Déjà dépensé en suivi et en travaux</th><td class="num">−${fmt(Math.round(e.spent))} €</td></tr><tr><th><b>Disponible</b></th><td class="num"><b>${fmt(f)} €</b></td></tr></table></div><p class="dnote">Plus le parc économise, plus le fonds se remplit : les économies financent les travaux suivants.</p>`;
  if(o<0)h+=`<p class="dnote">${esc(site().name)} est un commerce privé : il n'entre pas dans le patrimoine de la ville. Ses économies comptent dans ton total, pas dans l'objectif du parc.</p>`;
  if(e.ev.ok+e.ev.ko+e.ev.miss)h+=`<p class="dnote">Alertes : ${e.ev.ok} bien traitées, ${e.ev.ko} mal traitées, ${e.ev.miss} ignorées.</p>`;
  return h+'<p class="dnote"><i>Chiffres fictifs, d\'ordre de grandeur réaliste. Une minute de jeu vaut une semaine.</i></p>';
}
function enViewPsite(i){
  const e=EN(),sid='p'+i,s=enSite(sid),st=e.pk.s[i],mon=st&&st.mon!==undefined,f=enFonds(),y0=enYear(sid,[]),g=Math.floor(e.day);
  let h=`<p><button class="btn alt" data-env="parc">◂ Retour au parc</button></p><h3>${esc(s.n)}</h3><p class="dnote">${esc(ACT[s.a].lab)} · ${fmt(s.surf)} m² · ${fmtMwh(y0.ref)} par an (électricité ${s.elec} MWh, gaz ${s.gaz} MWh) · ${s.surf>=1000?'assujetti au décret tertiaire':'sous le seuil du décret tertiaire'}</p>`;
  if(!mon){const c=enMonCost(i);return h+`<div class="en-ev"><b>Site non suivi</b><p>Pour l'instant, tu ne connais ${esc(enDe(s))} que sa facture annuelle. Pas de courbe, pas d'alerte, pas de gisement : impossible de savoir où agir.</p><p>Mettre le site sous suivi, c'est refaire les quatre premières étapes en accéléré : cadrer, collecter, fiabiliser, structurer.</p>
    <button class="btn" data-mon="${i}"${f>=c?'':' disabled'}>${f>=c?`Mettre sous suivi · ${fmt(c)} €`:`Fonds insuffisant (${fmt(c)} €)`}</button><small>Économie attendue de cette dépense : <b>0 kWh</b>. Elle rend toutes les autres possibles.</small></div>`}
  const d=enDay(sid,g,st.acts),rate=enYear(sid,Object.keys(st.acts).sort()).kwh,idn=enIdent(sid);
  h+=`<div class="en-kpi dark"><div><b>${fmtKwh(rate)}</b><span>par an, en continu</span></div><div><b>${fmtKwh(idn)}</b><span>par an identifiés, pas encore réalisés</span></div><div><b>${fmt(f)} €</b><span>fonds de travaux</span></div></div>
    <h4 class="segh">Plan d'action</h4>`+enActsHtml(sid,st.acts,null,enActs(sid),true)+
    `<h4 class="segh">Aujourd'hui · ${esc(enLabel(e.day))}</h4><p class="en-today"><b>${fmtKwh(d.ref-d.s)}</b> consommés aujourd'hui${d.s>0?` au lieu de ${fmtKwh(d.ref)} sans action (−${fmtKwh(d.s)})`:''}. Température moyenne : ${Math.round(d.T)} °C. ${esc(enWhy(d,sid))}</p>${enChart(q=>enDay(sid,q,st.acts),{big:y0.ref>2e6,why:q=>enWhy(q,sid)})}`;
  return h;
}
const enTop=mt=>{let n=mt;while(n&&n.nodeType===1){if(n.scrollTop>0)n.scrollTop=0;n=n.parentNode}};
function enBind(mt,show){
  const re=()=>show('energie');
  mt.querySelectorAll('[data-env]').forEach(b=>b.onclick=()=>{EN_V.v=b.dataset.env;sfx('select');re();enTop(mt)});
  mt.querySelectorAll('[data-open]').forEach(b=>b.onclick=()=>{EN_V.v='psite';EN_V.i=+b.dataset.open;sfx('select');re();enTop(mt)});
  mt.querySelectorAll('[data-mon]').forEach(b=>b.onclick=()=>{enPkMon(+b.dataset.mon);sfx('ok');re()});
  mt.querySelectorAll('[data-buy]').forEach(b=>b.onclick=()=>{const [sid,id]=b.dataset.buy.split('|');if(sid===S.site)enBuy([id]);else enPkBuy(+sid.slice(1),id);sfx('ok');re()});
  const evb=mt.querySelector('#enEv');if(evb)evb.querySelectorAll('.opt').forEach(b=>b.onclick=()=>{const r=enAnswer(+b.dataset.i);if(!r)return re();evb.querySelectorAll('.opt').forEach(x=>x.disabled=true);b.classList.add(r.ok?'good':'bad');
    const fb=document.createElement('div');fb.className='fb '+(r.ok?'ok':'ko');fb.textContent=(r.ok?`✔ +${fmtKwh(r.kwh)}, une fois. `:'✘ Occasion manquée. ')+r.fb;evb.appendChild(fb);const k=document.createElement('button');k.className='btn';k.textContent='Continuer ▸';k.onclick=re;evb.appendChild(k);k.focus()});
  // survol du graphique : un repère vertical et les valeurs du jour
  const ch=mt.querySelector('#enChart');if(!ch)return;const svg=ch.querySelector('svg'),tip=ch.querySelector('#enTip'),cx=ch.querySelector('#enX'),e=EN(),g1=Math.floor(e.day),{N,W,R,L,get,why}=EN_CH;
  const mv=ev=>{const r=svg.getBoundingClientRect(),px=((ev.touches?ev.touches[0].clientX:ev.clientX)-r.left)/r.width*W,i=Math.max(0,Math.min(N-1,Math.round((px-L)/((W-L-R)/(N-1))))),g=g1-N+1+i,d=get(g),x=L+i*(W-L-R)/(N-1);
    cx.setAttribute('x1',x);cx.setAttribute('x2',x);cx.removeAttribute('hidden');tip.hidden=false;tip.innerHTML=`<b>${enLabel(g)}</b><span>${Math.round(d.T)} °C${why?' · '+esc(why(d)):''}</span><span><i class="l1"></i>Référence : ${fmtKwh(d.ref)}</span>${d.s>0?`<span><i class="l2"></i>Réel : ${fmtKwh(d.ref-d.s)}</span><span>Économie du jour : ${fmtKwh(d.s)}</span>`:''}`;
    tip.style.left=Math.min(r.width-190,Math.max(0,x/W*r.width-95))+'px'};
  svg.addEventListener('pointermove',mv);svg.addEventListener('pointerdown',mv);svg.addEventListener('pointerleave',()=>{tip.hidden=true;cx.setAttribute('hidden','')});
}
