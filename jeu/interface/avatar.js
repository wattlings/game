/* Wattlings · jeu/interface/avatar.js
   L'avatar : chapeaux, accessoires, tenues, modèles régionaux et l'écran de personnalisation. */

/* ================= AVATAR =================
   L'avatar est une tenue complète (les mêmes champs que n'importe quel personnage du jeu) : S.av = {g, v:2, p:{…}}.
   - Tout ce que porte un habitant peut se choisir à la main : chapeaux, lunettes, barbe, veste, blouse, tablier, salopette, objet en main…
   - Des modèles : une tenue par région (disponibles tout de suite), les tenues de rang (proposées à chaque promotion, jamais imposées),
     et la tenue de chaque personnage à qui on a parlé (S.models, une collection de plus).
   Les anciennes sauvegardes (avatar à indices, tenue de rang imposée) restent lisibles : elles sont converties à la première retouche. */
const HATS={'':'Aucun',cap:'Casquette',helmet:'Casque',straw:'Paille',beret:'Béret',toque:'Toque',bonnet:'Bonnet',coiffe:'Coiffe',noeud:'Nœud',plat:'Bob'};
const PROPS={'':'Rien',tablet:'Tablette',clipboard:'Bloc-notes',plan:'Plan',book:'Livre',case:'Mallette',wrench:'Clé',broom:'Balai',lantern:'Lanterne',cane:'Canne',crook:'Houlette',rod:'Canne à pêche',net:'Épuisette',basket:'Panier',baguette:'Baguette',bretzel:'Bretzel',boule:'Boule',leash:'Laisse',umbrella:'Parapluie'};
const AVF=CHF.filter(k=>k!=='umb');
/* une tenue propre : seulement les champs renseignés */
function avClean(p){const q={};AVF.forEach(k=>{const v=p[k];if(v!=null&&v!==false&&v!==''&&v!==0)q[k]=v});if(!q.skin)q.skin='#f1c7a1';if(!q.hat)delete q.hatType;else if(!q.hatType)q.hatType='plat';return q}
/* la tenue portée aujourd'hui, quelle que soit l'ancienneté de la sauvegarde */
const avLook=()=>avClean(S.av&&S.av.p?S.av.p:avPal(S.rank,S.av||AVDEF('h')));
const avSet=(p,g)=>{S.av={g:g||(S.av&&S.av.g)||(p.lash?'f':'h'),v:2,p:avClean(p)}};
/* tenues de rang : un casque et un gilet sur le terrain, une veste et une cravate au bureau */
const RANK_FIT=[null,{n:'Tenue de terrain',d:'casque et gilet haute visibilité'},{n:'Tenue de bureau',d:'veste et cravate'}];
function rankOutfit(p,rank){const q=Object.assign({},p);
  if(rank===1){q.hat='#f2c12e';q.hatType='helmet';q.vest=1}
  else if(rank===2){if(q.vest&&q.hat==='#f2c12e'){delete q.hat;delete q.hatType}delete q.vest;q.jacket='#262b4f';q.tie='#f2a33a'}
  return avClean(q)}
/* tenues des régions */
const REG_MODELS=[
  {r:'Val de Loire',n:'Batelier de Loire',p:{skin:'#e0ac7e',hair:'#5a3a22',shirt:'#f7f0dc',stripes:'#2f6db5',pants:'#27325a',hat:'#e3cf98',hatType:'straw',scarf:'#c43d3d',prop:'rod'}},
  {r:'Val de Loire',n:'Châtelaine',p:{skin:'#f6d3b3',hair:'#d9a441',style:'long',bun:1,lash:1,shirt:'#4a78c9',pants:'#4a78c9',robe:'#4a78c9',scarf:'#f2c12e',prop:'book'}},
  {r:'Auvergne',n:'Berger des puys',p:{skin:'#e0ac7e',hair:'#2b1d14',beard:'#2b1d14',shirt:'#ece6d6',pants:'#5a3a22',jacket:'#5a4a3a',hat:'#2c2c34',hatType:'beret',prop:'crook'}},
  {r:'Auvergne',n:'Paysanne des volcans',p:{skin:'#f1c7a1',hair:'#5a3a22',bun:1,lash:1,shirt:'#8a3b3b',pants:'#2c2c34',skirt:1,apron:'#ece6d6',hat:'#1c1c24',hatType:'straw',prop:'basket'}},
  {r:'Nord et Flandres',n:'Mineur',p:{skin:'#f1c7a1',hair:'#2b1d14',beard:'#2b1d14',shirt:'#59627c',pants:'#27325a',overall:'#27325a',hat:'#ece6d6',hatType:'helmet',scarf:'#c43d3d',prop:'lantern'}},
  {r:'Nord et Flandres',n:'Dentellière',p:{skin:'#f6d3b3',hair:'#b8431f',bun:1,lash:1,glasses:1,shirt:'#8ec9e8',pants:'#2f3a5c',skirt:1,apron:'#f7f0dc',scarf:'#f7f0dc'}},
  {r:'Normandie',n:'Fermière normande',p:{skin:'#f6d3b3',hair:'#d9a441',lash:1,shirt:'#c43d3d',pants:'#6b4a2b',skirt:1,apron:'#f7f0dc',hat:'#f7f0dc',hatType:'coiffe',prop:'basket'}},
  {r:'Normandie',n:'Cidrier',p:{skin:'#e0ac7e',hair:'#8a5a2b',beard:'#8a5a2b',shirt:'#f7f0dc',pants:'#6b4a2b',apron:'#8a5a2b',hat:'#59627c',hatType:'cap',scarf:'#c43d3d'}},
  {r:'Alsace',n:'Alsacienne',p:{skin:'#f1c7a1',hair:'#d9a441',style:'long',lash:1,shirt:'#f7f0dc',pants:'#c43d3d',skirt:1,apron:'#1c1c24',hat:'#1c1c24',hatType:'noeud',scarf:'#c43d3d'}},
  {r:'Alsace',n:'Alsacien',p:{skin:'#f1c7a1',hair:'#8a5a2b',shirt:'#f7f0dc',pants:'#1c1c24',jacket:'#c43d3d',hat:'#1c1c24',hatType:'plat',prop:'bretzel'}},
  {r:'Bourgogne',n:'Vigneronne',p:{skin:'#e0ac7e',hair:'#2b1d14',style:'queue',lash:1,shirt:'#7a8a4a',pants:'#5a3a22',apron:'#5a2a4a',hat:'#e3cf98',hatType:'straw',prop:'basket'}},
  {r:'Bourgogne',n:'Chevalier du cellier',p:{skin:'#f1c7a1',hair:'#9a9aa2',beard:'#9a9aa2',shirt:'#8a3b3b',pants:'#8a3b3b',robe:'#8a3b3b',hat:'#f2c12e',hatType:'toque',scarf:'#f2c12e'}},
  {r:'Bretagne',n:'Bigoudène',p:{skin:'#f6d3b3',hair:'#5a3a22',lash:1,shirt:'#1c1c24',pants:'#1c1c24',robe:'#1c1c24',apron:'#f7f0dc',hat:'#f7f0dc',hatType:'coiffe'}},
  {r:'Bretagne',n:'Marin breton',p:{skin:'#e0ac7e',hair:'#b8431f',beard:'#b8431f',shirt:'#f7f0dc',stripes:'#27457a',pants:'#27325a',hat:'#c43d3d',hatType:'bonnet',prop:'net'}},
  {r:'Provence',n:'Provençale',p:{skin:'#c68a5c',hair:'#2b1d14',style:'boucle',lash:1,shirt:'#f7f0dc',pants:'#7f8fd0',skirt:1,apron:'#f2c12e',hat:'#e3cf98',hatType:'straw',scarf:'#7f8fd0',prop:'basket'}},
  {r:'Provence',n:'Bouliste',p:{skin:'#c68a5c',hair:'#9a9aa2',beard:'#9a9aa2',shirt:'#f7f0dc',pants:'#c9b28a',hat:'#f7f0dc',hatType:'cap',scarf:'#e2573b',prop:'boule'}},
  {r:'Savoie',n:'Alpagiste',p:{skin:'#e0ac7e',hair:'#5a3a22',beard:'#5a3a22',shirt:'#8a5a2b',pants:'#3a3530',coat:'#6b4a2b',hat:'#2f6d34',hatType:'bonnet',prop:'crook'}},
  {r:'Savoie',n:'Skieuse',p:{skin:'#f6d3b3',hair:'#d9a441',style:'queue',lash:1,glasses:1,shirt:'#2f6db5',pants:'#2c2c34',coat:'#e2573b',hat:'#f7f0dc',hatType:'bonnet',scarf:'#f2c12e'}}];
/* collection : la tenue d'un personnage se débloque quand on lui parle */
function metNpc(o){
  if(!o||!o.pal||!o.who)return;S.models=S.models||{};if(S.models[o.who])return;const p={};AVF.forEach(k=>{const v=o.pal[k];if(v!=null&&v!==false&&v!=='')p[k]=v});
  S.models[o.who]=avClean(p);trk('setting',{k:'avatar_modele',v:String(o.who).slice(0,40)});toast('Tenue débloquée : '+o.who+'.');
}
const avCanvas=(p,sc)=>{const c=document.createElement('canvas');c.width=20;c.height=24;c.style.width=(20*(sc||2))+'px';c.style.imageRendering='pixelated';drawChar(c.getContext('2d'),2,8,'down',0,p);return c};
function openAvatar(onDone){
  const g0=(S.av&&S.av.g)||'h';let p=avLook(),g=g0,tab='modeles',tpl='';busy=true;clearKeys();
  const ov=openPanel('Ton avatar'),b=ov.querySelector('.pbody');
  b.innerHTML=`<div class="av-grid"><div class="av-prev"><canvas id="avc" width="64" height="26" aria-label="Aperçu de l'avatar : face, profil, dos"></canvas><small>Face, profil, dos</small></div><div class="av-ctl"><div class="seg" role="group" aria-label="Rubriques" id="avTabs"></div><div id="avBody"></div></div></div>
    <div class="row"><button class="btn alt" type="button" id="avRnd">Au hasard</button><button class="btn" type="button" id="avOk">Valider mon avatar ▸</button></div>`;
  const body=b.querySelector('#avBody'),tabs=b.querySelector('#avTabs');
  const sw=(key,list,none)=>{const cur=p[key]||'',custom=cur&&!list.includes(cur);
    return `<div class="swatches" role="radiogroup">${none?`<button type="button" class="sw none${!cur?' on':''}" data-c="${key}" data-v="" aria-label="Aucun" title="Aucun"></button>`:''}${list.map(c=>`<button type="button" class="sw${cur===c?' on':''}" data-c="${key}" data-v="${c}" style="background:${c}" aria-label="Couleur ${c}"></button>`).join('')}<label class="sw pick${custom?' on':''}" style="${custom?'background:'+cur:''}" title="Autre couleur"><input type="color" data-pc="${key}" value="${custom?cur:'#888888'}" aria-label="Autre couleur"></label></div>`};
  const pills=(key,obj,cur)=>`<div class="pills">${Object.entries(obj).map(([v,l])=>`<button type="button" class="pill${cur===v?' on':''}" data-k="${key}" data-v="${v}">${l}</button>`).join('')}</div>`;
  const togs=L=>`<div class="pills">${L.map(([k,l])=>`<button type="button" class="pill${p[k]?' on':''}" data-t="${k}" aria-pressed="${p[k]?'true':'false'}">${l}</button>`).join('')}</div>`;
  const F=(l,h)=>`<div class="field"><label>${l}</label>${h}</div>`;
  const TAB={
    modeles:()=>{const M=S.models||{},names=Object.keys(M),rk=[1,2].filter(r=>S.rank>=r);
      return `<h4 class="segh">Tenues des régions</h4><div class="av-tpl">${REG_MODELS.map((m,i)=>`<button type="button" data-m="r${i}"><span data-cv="r${i}"></span><b>${esc(m.n)}</b><small>${esc(m.r)}</small></button>`).join('')}</div>
        ${rk.length?`<h4 class="segh">Tenues de rang</h4><div class="av-tpl">${rk.map(r=>`<button type="button" data-m="k${r}"><span data-cv="k${r}"></span><b>${RANK_FIT[r].n}</b><small>${RANK_FIT[r].d}</small></button>`).join('')}</div><p class="dnote">Une tenue de rang se pose sur ta tenue actuelle : elle ne change ni ta tête ni tes couleurs.</p>`:''}
        <h4 class="segh">Personnages rencontrés · ${names.length}</h4>${names.length?`<div class="av-tpl">${names.map((n,i)=>`<button type="button" data-m="c${i}"><span data-cv="c${i}"></span><b>${esc(n)}</b></button>`).join('')}</div>`:''}<p class="dnote">Parle aux habitants, aux dresseurs et aux champions : chacun te prête sa tenue.</p>`},
    tete:()=>F('Personnage',pills('g',{h:'Homme',f:'Femme'},g))+F('Peau',sw('skin',SKINS))+F('Coiffure',pills('style',STYLES,p.style||'court')+togs([['bun','Chignon'],['glasses','Lunettes']]))+F('Cheveux',sw('hair',HAIRC))+F('Barbe',sw('beard',HAIRC,1))+F('Chapeau',pills('hatType',HATS,p.hat?p.hatType||'plat':'')+(p.hat?sw('hat',CLOTH):'')),
    haut:()=>F('Haut',sw('shirt',CLOTH))+F('Rayures',sw('stripes',CLOTH,1))+F('Veste',sw('jacket',CLOTH,1))+F('Manteau ou blouse',sw('coat',CLOTH,1))+F('Cravate',sw('tie',CLOTH,1))+F('Foulard',sw('scarf',CLOTH,1))+F('Par-dessus',togs([['vest','Gilet haute visibilité'],['sash','Écharpe tricolore'],['stetho','Stéthoscope']])),
    bas:()=>F('Bas',pills('bt',{pantalon:'Pantalon',jupe:'Jupe'},p.skirt?'jupe':'pantalon')+sw('pants',CLOTH))+F('Salopette',sw('overall',CLOTH,1))+F('Tablier',sw('apron',CLOTH,1))+F('Robe longue',sw('robe',CLOTH,1)),
    objets:()=>F('En main',pills('prop',PROPS,p.prop||''))+F('Sacoche',sw('bag',CLOTH,1))};
  const TN={modeles:'Modèles',tete:'Tête',haut:'Haut',bas:'Bas',objets:'Objets'};
  const model=id=>{const k=id[0],i=+id.slice(1);return k==='r'?REG_MODELS[i].p:k==='k'?rankOutfit(p,i):(S.models||{})[Object.keys(S.models||{})[i]]};
  const draw=()=>{
    tabs.innerHTML=Object.entries(TN).map(([k,l])=>`<button type="button" data-tab="${k}" class="${tab===k?'on':''}">${l}</button>`).join('');
    body.innerHTML=TAB[tab]();
    tabs.querySelectorAll('[data-tab]').forEach(x=>x.onclick=()=>{tab=x.dataset.tab;sfx('select');draw()});
    body.querySelectorAll('[data-cv]').forEach(s=>s.appendChild(avCanvas(model(s.dataset.cv))));
    body.querySelectorAll('[data-m]').forEach(x=>x.onclick=()=>{const id=x.dataset.m,m=model(id);if(!m)return;p=avClean(m);if(id[0]!=='k')g=p.lash?'f':'h';tpl=id[0]==='r'?REG_MODELS[+id.slice(1)].n:id[0]==='k'?RANK_FIT[+id.slice(1)].n:Object.keys(S.models)[+id.slice(1)];sfx('select');draw()});
    body.querySelectorAll('[data-c]').forEach(x=>x.onclick=()=>{const k=x.dataset.c,v=x.dataset.v;if(v)p[k]=v;else delete p[k];sfx('select');draw()});
    body.querySelectorAll('[data-pc]').forEach(x=>{x.oninput=()=>{p[x.dataset.pc]=x.value;x.parentNode.style.background=x.value};x.onchange=()=>draw()});
    body.querySelectorAll('[data-t]').forEach(x=>x.onclick=()=>{const k=x.dataset.t;if(p[k])delete p[k];else p[k]=1;sfx('select');draw()});
    body.querySelectorAll('[data-k]').forEach(x=>x.onclick=()=>{const k=x.dataset.k,v=x.dataset.v;
      if(k==='g'){if(g!==v){g=v;if(v==='f'){p.lash=1;if(!p.style||p.style==='court')p.style='long'}else{delete p.lash;if(p.style==='long')p.style='court'}}}
      else if(k==='bt'){if(v==='jupe')p.skirt=1;else delete p.skirt}
      else if(k==='hatType'){if(!v){delete p.hat;delete p.hatType}else{p.hatType=v;if(!p.hat)p.hat=v==='helmet'?'#f2c12e':v==='straw'?'#e3cf98':v==='toque'||v==='coiffe'?'#f7f0dc':'#2c2c34'}}
      else if(v)p[k]=v;else delete p[k];
      sfx('select');draw()});
  };
  b.querySelector('#avRnd').onclick=()=>{const r=n=>Math.floor(Math.random()*n),pick=a=>a[r(a.length)],ch=x=>Math.random()<x;g=r(2)?'f':'h';
    p={skin:pick(SKINS),hair:pick(HAIRC),style:pick(Object.keys(STYLES)),shirt:pick(CLOTH),pants:pick(BOTS)};if(g==='f')p.lash=1;if(ch(.4))p.skirt=1;if(ch(.3)){p.hatType=pick(Object.keys(HATS).slice(1));p.hat=pick(CLOTH)}if(ch(.2))p.glasses=1;if(g==='h'&&ch(.3))p.beard=p.hair;
    if(ch(.25))p.jacket=pick(CLOTH);if(ch(.2))p.scarf=pick(CLOTH);if(ch(.15))p.apron=pick(CLOTH);if(ch(.12))p.stripes=pick(CLOTH);if(ch(.25))p.prop=pick(Object.keys(PROPS).slice(1));if(ch(.15))p.bag=pick(CLOTH);tpl='hasard';sfx('select');draw()};
  b.querySelector('#avOk').onclick=()=>{qkCancelRAF(raf);avSet(p,g);trk('avatar',{g,style:p.style||'court',bas:p.skirt?'jupe':'pantalon',modele:tpl});save();closePanel();if(onDone)onDone()};
  let fr=0,raf=0;const c=b.querySelector('#avc'),x=c.getContext('2d');
  (function loopA(){if(!ROOT.contains(c))return;fr++;x.clearRect(0,0,64,26);const q=avClean(p),f=Math.floor(fr/12);
    drawChar(x,2,9,'down',f,q);drawChar(x,23,9,Math.floor(fr/120)%2?'left':'right',f,q);drawChar(x,44,9,'up',f,q);raf=qkRAF(loopA)})();
  draw();
}
