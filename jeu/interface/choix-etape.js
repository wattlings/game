/* Wattlings · jeu/interface/choix-etape.js
   Choix d'étape : la liste des chapitres et le saut direct à une étape. */

/* ================= CHOIX D'ÉTAPE ================= */
const XPMIN=[0,0,60,200,380,620,900,1100,1250,1450,1720,1800];
function chapterList(el,onPick){
  let sid=S.site||'ecole';
  const render=()=>{
    el.innerHTML=`<p>Reprends à n'importe quelle étape. Les étapes précédentes sont validées automatiquement (badges, carnet, rang).</p>
    <div class="field"><label>Site</label><div class="pills">${Object.values(SITES).map(s=>`<button type="button" class="pill${sid===s.id?' on':''}" data-site="${s.id}">${s.name}</button>`).join('')}</div></div>
    <div class="chap">${CHAPTERS.map((c,i)=>{const st=S.site===sid?(i<S.ch?'done':i===S.ch?'cur':''):'';return `<button type="button" class="opt chap-${st}" data-ch="${i}"><span class="num">${String(i).padStart(2,'0')}</span> ${c}${st==='cur'?' <span class="tag">en cours</span>':st==='done'?' ✔':''}</button>`}).join('')}</div>`;
    el.querySelectorAll('[data-site]').forEach(x=>x.onclick=()=>{sid=x.dataset.site;sfx('select');render()});
    el.querySelectorAll('[data-ch]').forEach(x=>x.onclick=()=>onPick(+x.dataset.ch,sid));
  };render();
}
function openChapterSelect(){
  const ov=openPanel('Choisir une étape'),b=ov.querySelector('.pbody');const inner=document.createElement('div');b.appendChild(inner);
  chapterList(inner,(ch,sid)=>{closePanel();jumpTo(ch,sid)});
  const c=document.createElement('button');c.className='btn alt';c.textContent='Annuler';c.onclick=closePanel;b.appendChild(c);
}
function jumpTo(ch,sid){
  TCH.via='jump';trk('jump',{ch,site:sid});
  const s=SITES[sid],keep={badges:(S.badges||[]).slice(),fiches:Object.assign({},S.fiches),dex:Object.assign({},S.dex),xp:S.xp||0,rank:S.rank||0};
  S.site=sid;S.ch=ch;S.notes={};S.flags={pmIntro:ch>=10?1:0,profilPropose:S.flags&&S.flags.profilPropose};S.arena={};S.v=4;AR.lock=false;AR.id=0;S.fiches={};FICHES.forEach(f=>{if(STEP_CH[f.st]<ch)S.fiches[f.id]=1});S.pm=ch>=11?6:0;S.derives={};S.dex={};
  if(ch>=2){S.notes.adresse=`${s.addr}, ${s.cp}`;S.notes.surface=s.surface;S.notes.activite=s.activite}
  if(ch>=3){S.notes.pdl=s.pdl;S.notes.pce=s.pce;Object.assign(S.flags,{elec:true,gas:true,sub:true})}
  if(ch>=5)ANOM.forEach(a=>S.dex[a.id]=1);
  S.badges=BADGES.slice(0,Math.max(0,Math.min(8,ch-2)));
  S.rank=ch>=10?2:ch>=6?1:0;S.xp=XPMIN[ch];{const d0=S.en?S.en.day:0;S.en=null;EN().day=d0;enSync()}   // rejouer une étape : le compteur repart de l'état de cette étape, le calendrier continue
  // la collection déjà gagnée n'est jamais perdue
  S.badges=BADGES.filter(b=>S.badges.includes(b)||keep.badges.includes(b));S.fiches=Object.assign(keep.fiches,S.fiches);S.dex=Object.assign(keep.dex,S.dex);S.rank=Math.max(S.rank,keep.rank);S.xp=Math.max(S.xp,keep.xp);
  const b=BLD.find(x=>x.id===sid);let pos;
  const AJ=ARENAS.find(a=>ARENA_CH[a.id]===ch);
  if([1].includes(ch))pos=['town',...front('office'),'down'];else if(ch===2||ch===7)pos=['town',b.door[0],b.door[1]+1,'up'];else if(ch===5)pos=['office',8,3,'right'];else if(AJ)pos=['town',AJ.b.door[0],AJ.b.door[1]+1,'up'];else if(ch===10)pos=['town',...front('mairie'),'up'];else if(ch===11)pos=['town',...LW(56,36),'down'];else pos=['office',5,6,'up'];
  S.flags.badgesOfferts=S.badges.length;   // la proposition de créer un profil attend un badge gagné en jouant (aides.js)
  S.map=pos[0];S.x=pos[1];S.y=pos[2];S.dir=pos[3];save();
  if(!ROOT.querySelector('.title-screen'))boot(true);
  const hint=JOULE_HINTS[ch];
  const suite=prochaineEtapeTexte();
  bandeauEtape(CHAPTERS[ch],s.name);
  const L=[...(hint?hint.map(t=>({w:'Mme Joule',t})):[]),...(suite?[{t:`Prochaine étape : ${suite}. Suis la flèche orange.`}]:[])];
  if(L.length)qkTimeout(()=>say(L),350);
}
