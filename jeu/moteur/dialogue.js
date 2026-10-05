/* Wattlings · jeu/moteur/dialogue.js
   Les dialogues : file de répliques, pagination, effet machine à écrire. */

/* ================= DIALOGUE ================= */
const dlg={open:false,q:[],cur:null,shown:0,cb:null,el:null};
function say(lines,cb){
  // les répliques consécutives d'un même personnage sont regroupées pour remplir l'encart
  const m=[];lines.forEach(l=>{l=typeof l==='string'?{t:l}:l;const p=m[m.length-1];if(p&&p.w===l.w)p.t+=' '+l.t;else m.push({w:l.w,t:l.t})});
  // un dialogue déjà ouvert n'est jamais écrasé : les nouvelles répliques se mettent à la suite
  if(dlg.open&&dlg.cur){const prev=dlg.cb;m.forEach(x=>dlg.q.push(x));dlg.cb=()=>{if(prev)prev();if(cb)cb()};return}
  dlg.q=m;dlg.cb=cb||null;dlg.open=true;nextLine()}
function nextLine(){
  if(!dlg.q.length){dlg.open=false;if(dlg.el){dlg.el.remove();dlg.el=null}const cb=dlg.cb;dlg.cb=null;if(cb)qkTimeout(cb,30);return}
  dlg.cur=dlg.q.shift();dlg.shown=0;
  if(!dlg.el){dlg.el=document.createElement('div');dlg.el.className='dialog';dlg.el.addEventListener('click',pressA);$('wrap').appendChild(dlg.el)}
  dlg.cur.full=dlg.cur.t.replace(/\{name\}/g,S.name);paginate();typeTick();
}
/* Taille de texte fixe (calée sur l'encart, identique pour toutes les répliques) ; le texte est découpé en pages qui remplissent l'encart */
const spkHTML=c=>c.w?`<span class="spk">${esc(c.w)}</span>`:'';
function paginate(){
  const el=dlg.el,c=dlg.cur;if(!el||!c)return;
  el.innerHTML=spkHTML(c)+'<div class="dtx"></div>';
  const t=el.querySelector('.dtx'),h=t.clientHeight,target=Math.max(18,Math.min(26,$('wrap').clientWidth/36));let n0=Math.max(2,Math.round(h/(target*1.3))),n=h/(n0*1.3)>target+1?n0+1:n0;
  dlg.fs=Math.floor(h/(n*1.3)*2)/2;t.style.fontSize=dlg.fs+'px';
  const fits=txt=>{t.textContent=txt;return t.scrollHeight<=t.clientHeight+1};
  if(fits(c.full))return;
  const w=c.full.split(' ');let lo=1,hi=w.length-1;
  while(lo<hi){const mid=Math.ceil((lo+hi)/2);if(fits(w.slice(0,mid).join(' ')))lo=mid;else hi=mid-1}
  dlg.q.unshift({w:c.w,t:w.slice(lo).join(' '),cont:true});c.full=w.slice(0,lo).join(' ');
}
addEventListener('resize',()=>{if(dlg.open&&dlg.el&&dlg.cur){while(dlg.q[0]&&dlg.q[0].cont)dlg.cur.full+=' '+dlg.q.shift().t;paginate();dlg.shown=dlg.cur.full.length;typeTick()}});
function typeTick(){
  if(!dlg.open||!dlg.el)return;const c=dlg.cur;dlg.shown=Math.min(c.full.length,dlg.shown+2);
  dlg.el.innerHTML=spkHTML(c)+`<div class="dtx" style="font-size:${dlg.fs||16}px">${esc(c.full.slice(0,dlg.shown))}</div>`+(dlg.shown>=c.full.length?'<span class="more">▼</span>':'');
  if(dlg.shown<c.full.length){sfx('blip');qkTimeout(typeTick,16)}
}
function pressA(){
  if(busy||AR.lock)return;
  if(dlg.open){if(dlg.shown<dlg.cur.full.length){dlg.shown=dlg.cur.full.length;typeTick()}else nextLine();return}
  if(P.moving)return;
  if(BOX.on){leaveBox(false);say([{t:"Tu sors du carton. Il retourne à sa place, l'air de rien."}]);return}
  const [dx,dy]=DIRS[P.dir],o=objAt(P.x+dx,P.y+dy);
  if(o&&o.act){if(o.kind==='npc'){o.dir={up:'down',down:'up',left:'right',right:'left'}[P.dir];if(hadesBlock(o))return;metNpc(o)}o.act()}
}
