/* Wattlings · jeu/simulation/partie.js
   Les kWh économisés dans la partie : compteur, fonds de travaux, temps qui passe, bilan à chaque badge. */

/* ---- état de la partie ---- */
function EN(){
  if(!S.en)S.en={day:0,rec:0,one:0,prod:0,by:{},acts:{},ident:{},earn:0,spent:0,seed:0,proved:0,ev:{next:0,cur:null,last:'',ok:0,ko:0,miss:0},log:[]};
  const e=S.en;if(!e.ev)e.ev={next:0,cur:null,last:'',ok:0,ko:0,miss:0};if(!e.pk)e.pk={on:0,s:{},rec:0,tier:0};return e;
}
const enFonds=()=>{const e=EN();return Math.round(e.seed+e.earn+(e.aid||0)-e.spent)};
const enEarn=v=>{const e=EN();e.earn+=v;if(e.pk.on)e.aid=(e.aid||0)+v*EN_AID};
const enToday=()=>enDay(S.site,Math.floor(EN().day),EN().acts);
/* le parc : le site du joueur y figure déjà s'il appartient à la ville (école : n° 0, Le Carré : n° 12) ; la boulangerie, privée, reste à part */
const enOwn=()=>S.site==='ecole'?0:S.site==='bureau'?12:-1;
const enMon=()=>{const e=EN(),o=enOwn(),L=[];if(e.pk.on)for(let i=0;i<20;i++)if(i!==o&&e.pk.s[i]&&e.pk.s[i].mon!==undefined)L.push(i);return L};
const enPkDay=g=>{const e=EN();let s=0,prod=0,eur=0;enMon().forEach(i=>{const d=enDay('p'+i,g,e.pk.s[i].acts);s+=d.s;prod+=d.prod;eur+=d.eur});return {s,prod,eur}};
const enTotal=()=>{if(!S.site)return 0;const e=EN(),g=Math.floor(e.day);return e.rec+e.one+e.pk.rec+(enToday().s+(e.pk.on?enPkDay(g).s:0))*(e.day-g)};      // le compteur tourne en continu
const enRate=()=>S.site?enYear(S.site,Object.keys(EN().acts).sort()).kwh:0;
const enRatePk=()=>{const e=EN();return enMon().reduce((t,i)=>t+enYear('p'+i,Object.keys(e.pk.s[i].acts).sort()).kwh,0)};
let EN_REF=0;const enRefPk=()=>{if(!EN_REF)for(let i=0;i<20;i++)EN_REF+=enYear('p'+i,[]).ref;return EN_REF};
const enPct=()=>(enRatePk()+(enOwn()>=0?enRate():0))/enRefPk();                 // part de la consommation du parc effacée, à météo comparable
const enIdent=sid=>{const e=EN(),st=!sid||sid===S.site,x=sid||S.site,acts=st?e.acts:(e.pk.s[+sid.slice(1)]||{acts:{}}).acts,cur=Object.keys(acts).sort(),add=enActs(x).filter(a=>(!st||e.ident[a.id])&&acts[a.id]===undefined&&!a.zero&&!a.prod).map(a=>a.id);
  return add.length?Math.round((enYear(x,cur.concat(add).sort()).kwh-enYear(x,cur).kwh)/10)*10:0};      // les gains ne s'additionnent pas : ils se multiplient
const fmtKwh=v=>v>=1e7?(Math.round(v/1e4)/100).toLocaleString('fr-FR')+' GWh':fmt(Math.round(v))+' kWh',fmtMwh=v=>fmt(Math.round(v/1000))+' MWh';
let EN_ON=false,EN_T=0,EN_SV=0;
/* cohérence avec l'avancement de l'histoire (reprise d'une ancienne sauvegarde, saut à une étape) */
function enSync(){
  if(!S.site)return;const e=EN();
  EN_ACT.forEach(a=>{if(S.ch>=a.rev+2)e.ident[a.id]=1});
  if(S.ch>=8&&!e.seed)e.seed=EN_SEED;
  if(S.ch>=9&&!Object.keys(e.acts).length)['consigne','veilles','reduit','ps'].forEach(id=>{e.acts[id]=Math.floor(e.day);e.spent+=enCost(enAct(id))});
  if(S.ch>=10&&!e.proved){e.proved=1;e.seed+=enPrime()}
  if(S.ch>=11&&!e.pk.on){e.pk.on=1;e.log.push([Math.floor(e.day),'parc'])}
}
const enPrime=()=>Math.round(5000*enSite(S.site).cf/100)*100;
function enBuy(ids){const e=EN();ids.forEach(id=>{if(e.acts[id]!==undefined)return;const a=enAct(id);e.acts[id]=Math.floor(e.day)+1;e.spent+=enCost(a);e.ident[id]=1;e.log.push([Math.floor(e.day),'act',id]);trk('setting',{k:'energie_action',v:id})});save();enHud(true);enTier()}
const enMonCost=i=>Math.max(300,Math.round(600*enSite('p'+i).cf/100)*100);
function enPkMon(i){const e=EN(),c=enMonCost(i);if(enFonds()<c||(e.pk.s[i]&&e.pk.s[i].mon!==undefined))return;e.pk.s[i]={mon:Math.floor(e.day),acts:{}};e.spent+=c;trk('setting',{k:'parc_suivi',v:'p'+i});save()}
function enPkBuy(i,id){const e=EN(),st=e.pk.s[i],a=enAct(id),c=enCost(a,'p'+i);if(!st||st.acts[id]!==undefined||enFonds()<c)return;st.acts[id]=Math.floor(e.day)+1;e.spent+=c;trk('setting',{k:'parc_action',v:'p'+i+':'+id});save();enHud(true);enTier()}
function enTier(){
  const e=EN();if(!e.pk.on)return;const p=enPct(),t=p>=.4?4:p>=.3?3:p>=.2?2:p>=.1?1:0;if(t<=e.pk.tier)return;let env=0;for(let k=e.pk.tier+1;k<=t;k++)env+=EN_ENV[k];e.pk.tier=t;e.seed+=env;e.env=(e.env||0)+env;e.log.push([Math.floor(e.day),'palier',t]);gainXP(t===4?120:40);trk('setting',{k:'parc_palier',v:String(t*10)});
  toast(t===4?'Objectif atteint : −40 % sur le parc. Le décret tertiaire 2030 est tenu !':`−${t*10} % sur le parc, à météo comparable. Des économies prouvées, ça convainc : le conseil municipal vote ${fmt(env)} € de travaux.`);
}
/* ---- le temps passe ---- */
function enTick(k){
  if(!EN_ON||!S.site||document.hidden)return;const e=EN(),d0=Math.floor(e.day);e.day+=Math.min(.25,k/60)*EN_DPM/60;const d1=Math.floor(e.day);
  for(let g=d0;g<d1;g++){const d=enDay(S.site,g,e.acts);e.rec+=d.s;e.prod+=d.prod;enEarn(d.eur);for(const i in d.sav)e.by[i]=(e.by[i]||0)+d.sav[i];
    if(e.pk.on){const q=enPkDay(g);e.pk.rec+=q.s;e.prod+=q.prod;enEarn(q.eur)}
    enEvents(g+1);
    if(S.ch>=4&&!busy){const a=enVac(enDate(g+1)),b=enVac(enDate(g));if(a&&!b)toast(`Vacances ${a} : ${e.pk.on?'les écoles se vident':"l'école se vide"}${S.site==='ecole'&&!e.pk.on?', sa consommation tombe au talon':''}.`);else if(b&&!a)toast(e.pk.on?"C'est la rentrée : les écoles reprennent.":"C'est la rentrée : l'école reprend.")}}
  const n=performance.now();if(n-EN_T>400){EN_T=n;enHud()}
  if(n-EN_SV>30000){EN_SV=n;if(!ESSAI&&!INVITE)try{localStorage.setItem(SAVE_KEY,JSON.stringify(S))}catch(x){}}
}
let EN_HT='';
function enHud(force){
  const els=[$('hudKwh'),$('kwhPill')].filter(Boolean);if(!els.length)return;if(!S.site){els.forEach(el=>el.hidden=true);return}
  const e=EN(),v=enTotal(),t=fmtKwh(v)+(e.ev.cur?'!':'');if(t===EN_HT&&!force&&!els[0].hidden)return;EN_HT=t;
  els.forEach(el=>{el.hidden=false;el.innerHTML=`<i aria-hidden="true"></i><b>${fmtKwh(v)}</b><span class="hk-l"> économisés</span>${e.ev.cur?'<em title="Alerte énergie en cours">!</em>':''}`;
    el.classList.toggle('zero',v<1);el.classList.toggle('alert',!!e.ev.cur);el.setAttribute('aria-label',`${fmtKwh(v)} économisés depuis le début de la partie${e.ev.cur?'. Une alerte énergie attend ta décision.':''}`)});
}
/* ---- bilan affiché à chaque badge ---- */
function enBadge(id){
  const e=EN(),s=site();enSync();
  if(id===7){const r=enRate();e.log.push([Math.floor(e.day),'badge',7]);return `Bilan de l'étape Agir : le compteur démarre enfin. Tes actions économisent environ ${fmtKwh(r)} par an, jour après jour. Chaque euro économisé retourne au fonds de travaux : plus tu économises, plus tu peux investir.`}
  if(id===8)return `Bilan de l'étape Mesurer : ${fmtKwh(enTotal())} économisés, et maintenant prouvés à météo comparable. Des économies prouvées, ça convainc : la mairie verse une prime de ${fmt(enPrime())} € au fonds de travaux.`;
  if(id===5)return `Bilan de l'étape Analyser : toujours 0 kWh économisé. Mais tu as repéré un gisement d'environ ${fmtKwh(enIdent())} par an. Identifié n'est pas économisé : il faudra agir.`;
  if(id===6)return `Bilan de l'étape Détecter : encore 0 kWh économisé. Le gisement identifié monte à ${fmtKwh(enIdent())} par an, et tes alertes sont réglées : elles te préviendront dès qu'il y aura quelque chose à faire.`;
  return 'Bilan de l\'étape '+['','Cadrer : 0 kWh économisé. C\'est normal : tu sais maintenant quoi suivre, où, et pourquoi.',`Collecter : 0 kWh économisé. Mais les données arrivent : ton tableau de bord (le compteur, en haut de l'écran) montre enfin ce que ${S.site==='bureau'?'consomment':'consomme'} ${s.short}, jour après jour.`,
    'Fiabiliser : 0 kWh économisé. Des données justes ne font pas baisser la consommation. Elles évitent de se tromper de cible.','Structurer : 0 kWh économisé. Tout est rangé et comparable. La partie « donnée » est finie : elle n\'a rien économisé, elle a tout rendu possible.'][id];
}
